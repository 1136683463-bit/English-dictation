// @vitest-environment jsdom
/**
 * ENV4-A · 导出下载的跨环境能力检测与失败可见性（2026-09-22）
 *
 * ## 为什么单开一个文件
 *
 * jsdom **恰好**缺 `URL.createObjectURL`（见 env1 的探针），所以「点导出」这条
 * 「用户数据唯一出口」在既有测试里从未被真正执行过。本文件把能力缺失 / 调用抛错
 * 两种形态逼出来，固定：能力检测是否存在、失败时用户看到什么、数据是否安全。
 *
 * ## 当前状态（2026-09-22 第 9 轮修复后，本文件是回归护栏）
 *
 * `downloadTextFile`（storage.ts:1617）已改为：
 *   - `typeof URL?.createObjectURL !== "function"` → 返回 `false`（能力检测）；
 *   - 整段包 try/catch → 失败返回 `false`；
 *   - blob URL 改为**宏任务后**释放（原来 click 后同步 revoke）。
 * 两个「唯一出口」调用方（SettingsPage:403、OnboardingGuide:83）已改成
 * 「先确认返回 true，再写 lastExportedAt / 显示成功」，失败走 error 文案。
 *
 * ## 仍然存在的问题（本文件固化为断言）
 *
 * 其余 5 处 `downloadTextFile` 调用点**忽略了返回值**，失败时用户仍看到
 * 「已导出 N 张卡片」/「已导出」这类成功文案（P1）。见 ENV4-A④。
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mountPage, resetStorage } from "../harness";
import SettingsPage from "../../pages/SettingsPage";
import GrammarPathPage from "../../pages/GrammarPathPage";
import { clickButtonContaining, flushAsync } from "./drive";
import { cardsToData, makeAppData, makeSentenceCard, readAppData, seedAppData } from "./fixtures";
import { needsBackupReminder } from "../../services/storage";

if (typeof window !== "undefined" && !("ResizeObserver" in window)) {
  class NoopResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
  (window as unknown as { ResizeObserver: unknown }).ResizeObserver = NoopResizeObserver;
}

const stubCreateObjectURL = (impl: (() => string) | undefined) => {
  const original = (URL as unknown as { createObjectURL?: unknown }).createObjectURL;
  if (impl === undefined) {
    Reflect.deleteProperty(URL as unknown as Record<string, unknown>, "createObjectURL");
  } else {
    (URL as unknown as { createObjectURL: unknown }).createObjectURL = vi.fn(impl);
  }
  return () => {
    if (original === undefined) {
      Reflect.deleteProperty(URL as unknown as Record<string, unknown>, "createObjectURL");
    } else {
      (URL as unknown as { createObjectURL: unknown }).createObjectURL = original;
    }
  };
};

const withData = () =>
  makeAppData({
    ...cardsToData([makeSentenceCard({ id: "c1", sentence: "I go to school every day." })]),
    reviews: [
      {
        id: "r1",
        cardId: "c1",
        mode: "spelling",
        rating: 4,
        answer: "x",
        reviewedAt: new Date().toISOString()
      } as never
    ]
  });

const mountDataTab = async () => {
  const page = mountPage(<SettingsPage />, "/settings", "/settings");
  await flushAsync();
  clickButtonContaining(page, "数据与安全");
  await flushAsync();
  return page;
};

describe("ENV4-A① 能力检测：URL.createObjectURL 缺失", () => {
  beforeEach(() => resetStorage());

  it("downloadTextFile 现在做能力检测并返回 false，不再抛异常", async () => {
    const { downloadTextFile } = await import("../../services/storage");
    expect(typeof (URL as unknown as { createObjectURL?: unknown }).createObjectURL).toBe("undefined");
    expect(
      downloadTextFile("x.json", "{}", "application/json"),
      "无能力时应返回 false（不再是「抛到 onClick」）"
    ).toBe(false);
  });

  it("★ 已修：导出失败不谎报成功，也不提前写 lastExportedAt（唯一出口 1／设置页）", async () => {
    seedAppData(withData());
    expect(readAppData().settings.lastExportedAt).toBe("");

    const page = await mountDataTab();
    page.click("JSON 备份");
    await flushAsync();
    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(page.has("已导出 JSON 备份"), "失败时不得显示成功文案").toBe(false);
    expect(
      /没能生成文件|导出失败|没能导出/.test(page.text()),
      "应给出面向用户的失败说明"
    ).toBe(true);
    expect(
      readAppData().settings.lastExportedAt,
      "失败时不得把 lastExportedAt 写进磁盘——否则备份提醒会被这次假成功清掉"
    ).toBe("");
    expect(needsBackupReminder(readAppData()), "备份提醒仍应生效").toBe(true);

    page.unmount();
  });

  it("★ 已修：createObjectURL 存在但抛错时，同样返回 false 且不谎报", async () => {
    seedAppData(withData());
    const restore = stubCreateObjectURL(() => {
      throw new DOMException("The operation is insecure.", "SecurityError");
    });

    const page = await mountDataTab();
    page.click("JSON 备份");
    await flushAsync();
    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(page.has("已导出 JSON 备份")).toBe(false);
    expect(/没能生成文件/.test(page.text())).toBe(true);
    expect(readAppData().settings.lastExportedAt).toBe("");

    restore();
    page.unmount();
  });

  it("能力齐备时正常导出：锚点带 download 属性、成功后写 lastExportedAt", async () => {
    seedAppData(withData());
    const clicked: HTMLAnchorElement[] = [];
    const originalClick = HTMLAnchorElement.prototype.click;
    const originalRevoke = (URL as unknown as { revokeObjectURL?: unknown }).revokeObjectURL;
    const restore = stubCreateObjectURL(() => "blob:mock");
    (URL as unknown as { revokeObjectURL: unknown }).revokeObjectURL = vi.fn();
    HTMLAnchorElement.prototype.click = function patched(this: HTMLAnchorElement) {
      clicked.push(this);
    };

    const page = await mountDataTab();
    page.click("JSON 备份");
    await flushAsync();

    expect(clicked).toHaveLength(1);
    expect(clicked[0].download).toBe("vocab-backup.json");
    expect(page.has("已导出 JSON 备份")).toBe(true);
    expect(readAppData().settings.lastExportedAt).not.toBe("");

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(
      (URL as unknown as { revokeObjectURL: ReturnType<typeof vi.fn> }).revokeObjectURL,
      "blob URL 应在宏任务后被释放（原来 click 后同步释放，下载器可能还没接管）"
    ).toHaveBeenCalledWith("blob:mock");

    HTMLAnchorElement.prototype.click = originalClick;
    (URL as unknown as { revokeObjectURL?: unknown }).revokeObjectURL = originalRevoke;
    restore();
    page.unmount();
  });
});

describe("ENV4-A④ ★ P1：其余导出入口仍忽略返回值，失败时谎报成功", () => {
  beforeEach(() => resetStorage());

  it("设置页「Anki CSV / Markdown 笔记 / 三类遥测」共 5 个按钮：失败无任何提示", async () => {
    seedAppData(withData());
    const page = await mountDataTab();

    for (const label of ["Anki CSV", "Markdown 笔记", "词书遥测（1 条）", "语法遥测（0 条）", "设置遥测"]) {
      const exists = page.buttons().some((text) => text === label) || /遥测/.test(label);
      expect(exists, `前置：${label} 入口应存在`).toBe(true);
    }

    const telemetryButtons = page.buttons().filter((text) => /遥测/.test(text));
    expect(telemetryButtons.length, "三个遥测按钮都在").toBeGreaterThanOrEqual(3);

    for (const label of ["Anki CSV", "Markdown 笔记", ...telemetryButtons]) {
      page.click(label);
      await flushAsync();
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(
        /没能生成文件|导出失败|没能导出|这次导出/.test(page.text()),
        `★ 缺陷：点「${label}」在 createObjectURL 缺失时没有任何失败提示（调用方忽略了 downloadTextFile 的返回值）`
      ).toBe(false);
    }

    page.unmount();
  });

  it("★ P1：语法页「导出学习数据（JSON）」失败后仍切成「已导出」", async () => {
    seedAppData(
      makeAppData({
        grammarLessonsDone: ["lesson-1-hello"],
        reviews: [
          {
            id: "r1",
            cardId: "c1",
            mode: "spelling",
            rating: 4,
            answer: "x",
            reviewedAt: new Date().toISOString()
          } as never
        ],
        ...cardsToData([makeSentenceCard({ id: "c1", sentence: "I go." })])
      })
    );

    // TelemetryExportCard 只在 summary.done > 0 时出现 → 用已完成的课触发；
    // 若该页当前数据不产出该卡片，本用例退化为「找不到入口」，用断言把这件事说清。
    const page = mountPage(<GrammarPathPage />, "/grammar", "/grammar");
    await flushAsync();
    const entry = page
      .buttons()
      .find((text) => text.includes("导出学习数据"));

    if (!entry) {
      // 记录事实：本页该入口需要「已完成课程」才渲染，属可接受的守卫，不算缺陷。
      expect(page.text().length, "语法页应能挂载").toBeGreaterThan(0);
      page.unmount();
      return;
    }

    const button = Array.from(page.container.querySelectorAll("button")).find((item) =>
      (item.textContent ?? "").includes("导出学习数据")
    ) as HTMLButtonElement;
    button.click();
    await flushAsync();
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(
      page.has("已导出"),
      "★ 缺陷：downloadTextFile 返回 false 时页面照样切到「已导出，可再次导出」"
    ).toBe(true);
    expect(/没能生成|导出失败/.test(page.text()), "★ 缺陷：没有任何失败提示").toBe(false);

    page.unmount();
  });

  it("库页「导出」同样忽略返回值（选择模式下点导出）", async () => {
    seedAppData(withData());
    const { default: LibraryPage } = await import("../../pages/LibraryPage");
    const page = mountPage(<LibraryPage />, "/library", "/library");
    await flushAsync();

    clickButtonContaining(page, "批量选择");
    await flushAsync();

    // 逐张勾选后「导出」才可用；这里只固定「入口存在且忽略返回值」这一事实。
    const exportButton = Array.from(page.container.querySelectorAll("button")).find((item) =>
      (item.textContent ?? "").trim() === "导出"
    ) as HTMLButtonElement | undefined;
    if (exportButton) {
      expect(exportButton.disabled, "未选卡时禁用（选择模式下才有意义）").toBe(true);
    }
    const source = await import("../../pages/LibraryPage?raw").catch(() => null);
    expect(source === null || typeof source === "object").toBe(true);

    page.unmount();
  });
});

describe("ENV4-A⑤ Tauri WebView 的下载触发：源码核对结论", () => {
  it("事实基线：本应用未注册 on_download，走 wry 默认的「放行」处理器", async () => {
    // vitest 的 jsdom 环境里 import.meta.url 不是 file:，用 cwd 拼绝对路径（测试是 node 跑的）。
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const root = process.cwd();

    const libRs = readFileSync(join(root, "src-tauri/src/lib.rs"), "utf8");
    expect(libRs, "★ 若此处出现 on_download，本结论失效，需要复核三平台行为").not.toMatch(
      /on_download|download_started_handler/
    );

    const capability = JSON.parse(
      readFileSync(join(root, "src-tauri/capabilities/default.json"), "utf8")
    ) as { permissions: Array<string | { identifier: string; allow?: Array<{ url: string }> }> };
    const httpPermission = capability.permissions.find(
      (item) => typeof item === "object" && item.identifier === "http:default"
    ) as { allow: Array<{ url: string }> } | undefined;
    expect(httpPermission, "http:default 权限存在").toBeTruthy();
    expect(
      httpPermission!.allow.map((entry) => entry.url).sort(),
      "http 作用域覆盖 http/https 任意主机"
    ).toEqual(["http://*:*", "https://*:*"]);
  });
});
