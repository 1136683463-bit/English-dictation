// @vitest-environment jsdom
/**
 * R13a · 存储压力的**用户可见面**（2026-09-23 第 11 轮）
 *
 * ## 为什么单开一个文件
 *
 * 第 9~11 轮把「配额怎么算」查清了（WebKit 按字节、含汉字整串翻倍），
 * 但那是**底层事实**。本文件守的是**产品面**：用户到底能不能知道、能不能自救。
 *
 * ## 修掉的产品缺口
 *
 * 修前：
 *   ① 「接近上限」的判断只在**设置页**算（`diagnoseStoredData`），
 *      而设置页用户很少去。实测从软上限到真正写不下，macOS 桌面端只有约 **43 天**。
 *   ② 写入失败的文案建议「清理浏览器存储或删掉部分卡片」——两条都会丢东西，
 *      **唯独没提归档**，而归档是唯一「保留进度只释放体积」的选项。
 *
 * 修后：每次保存后顺带更新存储压力，全局横幅在任何页面都能看到；
 * 文案直接指向归档，并给出可点的入口。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import App from "../../App";
import { AppProvider } from "../../AppContext";
import { makeAppData, seedAppData } from "./fixtures";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

if (typeof window !== "undefined") {
  window.scrollTo = (() => undefined) as typeof window.scrollTo;
  if (!window.matchMedia) {
    (window as unknown as { matchMedia: unknown }).matchMedia = (query: string) => ({
      matches: false, media: query, onchange: null,
      addListener: () => undefined, removeListener: () => undefined,
      addEventListener: () => undefined, removeEventListener: () => undefined,
      dispatchEvent: () => false
    });
    class RO { observe() {} unobserve() {} disconnect() {} }
    (window as unknown as { ResizeObserver: unknown }).ResizeObserver = RO;
  }
}

/**
 * 造一份「接近上限」的中文内容。
 *
 * 数量是算过的：含汉字 → WebKit 按 2 字节/字符计费，
 * 5200 张卡实测约 4.4MB 计费量，**越过 4MB 软上限**但不触发写入失败
 *（真实容量约 4.96MB）——正好落在「该提醒、但还能存」的窗口里。
 */
const nearLimitData = () => {
  const filler = "这是一段用来把数据推到存储软上限附近的中文内容，含汉字所以按 2 字节计费。";
  const cards = Array.from({ length: 5200 }, (_, index) => ({
    id: `c-${index}`,
    type: "sentence" as const,
    front: `I have been learning sentence number ${index} for quite a while now.`,
    back: "",
    note: `${filler}${index}`,
    tags: ["语法"],
    status: "review" as const,
    priority: false,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  }));
  return makeAppData({ cards, schedules: cards.map((card) => ({
    cardId: card.id, easeFactor: 2.5, intervalDays: 5, reviewCount: 3, lapseCount: 0,
    nextReviewAt: "2024-01-01T00:00:00.000Z"
  })) });
};

const mountApp = () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(
      <AppProvider>
        <MemoryRouter initialEntries={["/today"]}>
          <App />
        </MemoryRouter>
      </AppProvider>
    );
  });
  return {
    text: () => container.textContent ?? "",
    unmount: () => {
      act(() => root.unmount());
      container.remove();
    }
  };
};

beforeEach(() => {
  window.localStorage.clear();
});

describe("R13a 存储压力的用户可见面", () => {
  it("数据量正常时：不打扰用户（无任何存储横幅）", () => {
    seedAppData(makeAppData({}));
    const page = mountApp();
    expect(page.text(), "正常情况下不该出现存储提示").not.toMatch(/接近存储上限/);
    page.unmount();
  });

  it("★ 接近上限时：在**任意页面**都能看到提示（不再只在设置页）", () => {
    seedAppData(nearLimitData());
    const page = mountApp();
    /**
     * 注意这里挂的是 `/today`（首页），不是设置页——
     * 修复前这条提示只存在于设置页，用户在首页完全看不到。
     */
    expect(page.text(), "首页就应有接近上限的提示").toMatch(/接近存储上限|接近上限/);
    page.unmount();
  });

  it("★ 提示里必须提到「归档」——那是唯一保留进度的自救方式", () => {
    seedAppData(nearLimitData());
    const page = mountApp();
    const text = page.text();
    expect(text, "文案要给出不丢进度的选项").toMatch(/归档/);
    // 也不该只让人去「清理存储/删卡片」
    expect(text, "不应只给会丢数据的建议").not.toMatch(/删掉部分卡片/);
    page.unmount();
  });
});
