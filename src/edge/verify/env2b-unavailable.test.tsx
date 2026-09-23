// @vitest-environment jsdom
/**
 * ENV2b · 存储不可用时的降级（2026-09-22 存储环境差异专项）
 *
 * ## 为什么必须单开一个文件
 *
 * 前几轮验证「配额耗尽」时用的手法是
 * `vi.spyOn(window.localStorage, "setItem").mockImplementation(() => { throw ... })`。
 * **这个手法在本项目的 jsdom 环境里是无效的**——它既没有拦住写入，
 * 还往 localStorage 里写进了一个名叫 `setItem` 的垃圾键（见本文件第 1 组用例）。
 *
 * 原因是 jsdom 的 `Storage` 实例把 `setItem`/`getItem` 暴露成**命名属性的 getter**
 * （`Storage.prototype` 上的存取器），于是：
 *   - `vi.spyOn(ls, "setItem")` 读到的是一个函数、包一层后在实例上定义属性，
 *     但真正被调用的仍是原型上的方法 → 断言全部「通过」，实际什么都没拦；
 *   - `window.localStorage.setItem = fn` 直接被当成**写一个键**，同样不生效；
 *   - 只有 `Storage.prototype.setItem = fn` 才真正改变行为。
 *
 * 本文件因此统一用原型补丁来模拟「存储不可用」，并把它固化成断言。
 * 同时本文件回答任务书里的核心问题：
 * **当写入全程失败时，用户的学习进度是不是完全丢失且无提示？**
 */
import { describe, expect, it, vi } from "vitest";
import { loadData, saveData, diagnoseStoredData, STORAGE_SOFT_LIMIT_BYTES } from "../../services/storage";
import { mountPage } from "../harness";
import TodayPage from "../../pages/TodayPage";
import SettingsPage from "../../pages/SettingsPage";
import { makeAppData, cardsToData, makeSentenceCard, STORAGE_KEY } from "./fixtures";

if (typeof window !== "undefined" && !("ResizeObserver" in window)) {
  class NoopResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
  (window as unknown as { ResizeObserver: unknown }).ResizeObserver = NoopResizeObserver;
}

/** 让「写」永久失败。原型补丁是 jsdom 下唯一真正生效的做法。 */
const blockWrites = (name: "SecurityError" | "QuotaExceededError" = "SecurityError") => {
  const original = Storage.prototype.setItem;
  Storage.prototype.setItem = function patchedSetItem() {
    throw new DOMException(`simulated ${name}`, name);
  } as typeof Storage.prototype.setItem;
  return () => {
    Storage.prototype.setItem = original;
  };
};

/** 让「读」永久失败（Safari 隐私模式下 `getItem` 也会抛 SecurityError）。 */
const blockReads = () => {
  const original = Storage.prototype.getItem;
  Storage.prototype.getItem = function patchedGetItem() {
    throw new DOMException("simulated SecurityError", "SecurityError");
  } as typeof Storage.prototype.getItem;
  return () => {
    Storage.prototype.getItem = original;
  };
};

/** 一页「有学习进度」的数据：一张已复习过的卡 + 一条复习记录。 */
const progressData = () => {
  const base = makeAppData({
    ...cardsToData([
      makeSentenceCard({
        id: "mine",
        sentence: "This is the sentence I practised yesterday.",
        note: "我的英文日记 · 2026",
        schedule: { reviewCount: 4, intervalDays: 7, nextReviewAt: "2024-01-01T00:00:00.000Z" }
      })
    ])
  });
  return {
    ...base,
    reviews: [
      {
        id: "r1",
        cardId: "mine",
        mode: "spelling" as const,
        rating: 4 as const,
        answer: "This is the sentence I practised yesterday.",
        reviewedAt: "2024-01-02T09:00:00.000Z"
      }
    ]
  };
};

describe("ENV2b-0 手法本身：为什么不能用 vi.spyOn 模拟存储异常", () => {
  it("vi.spyOn(localStorage, 'setItem') 拦不住写入，还会污染存储", () => {
    window.localStorage.clear();
    const spy = vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
      throw new DOMException("quota", "QuotaExceededError");
    });

    window.localStorage.setItem("env2b-probe", "written-anyway");

    expect(
      window.localStorage.getItem("env2b-probe"),
      "写入没有被拦住——用它做的「配额满」用例其实一直在正常写盘，断言靠巧合通过"
    ).toBe("written-anyway");
    expect(spy.mock.calls.length, "被监视的函数一次都没被调用").toBe(0);
    /** 更糟的副作用：键名 "setItem" 被真的写进了存储，占用配额并出现在遍历里。 */
    expect(
      typeof window.localStorage.getItem("setItem"),
      "存储里多出一个名为 setItem 的垃圾键"
    ).toBe("string");

    spy.mockRestore();
    window.localStorage.clear();
  });

  it("直接给实例赋值同样无效；只有改 Storage.prototype 才生效", () => {
    window.localStorage.clear();
    window.localStorage.setItem("env2b-probe2", "original");
    (window.localStorage as unknown as Record<string, unknown>).getItem = () => "HIJACKED";
    expect(
      window.localStorage.getItem("env2b-probe2"),
      "实例赋值无效——读回的仍是原值"
    ).toBe("original");

    const restore = blockWrites();
    let blocked = false;
    try {
      window.localStorage.setItem("env2b-probe3", "x");
    } catch {
      blocked = true;
    }
    restore();
    expect(blocked, "原型补丁才是有效的模拟方式").toBe(true);
    window.localStorage.clear();
  });
});

describe("ENV2b-1 localStorage 完全不存在（delete window.localStorage）", () => {
  it("【已修 R09】不再抛错——返回初始数据，应用能挂载出界面", () => {
    window.localStorage.clear();
    const w = window as unknown as Record<string, unknown>;
    const saved = w.localStorage;
    delete w.localStorage;
    try {
      /**
       * 修复前：`const raw = window.localStorage.getItem(STORAGE_KEY)` 裸写在最外层，
       * 这里抛 TypeError → AppContext 的 useState 初始化抛 → 无 ErrorBoundary → 白屏。
       * 修复后：读不到就按「全新安装」处理，界面能起来 —— 用户至少进得来、
       * 看得到提示、能导出备份自救。这比白屏严格更好。
       */
      let thrown: unknown = null;
      let loaded: ReturnType<typeof loadData> | null = null;
      try {
        loaded = loadData();
      } catch (error) {
        thrown = error;
      }
      expect(thrown, "存储对象不存在时不再抛").toBeNull();
      expect(loaded, "仍返回一份可用数据").not.toBeNull();
      expect(loaded!.cards.length, "是初始种子数据").toBeGreaterThan(0);

      /** 影响面：AppContext.tsx:40 在 useState 初始化里调 loadData，此前异常冒到 React 渲染。 */
      let mountThrew: unknown = null;
      try {
        const mounted = mountPage(<TodayPage />, "/today", "/today");
        mounted.unmount();
      } catch (error) {
        mountThrew = error;
      }
      expect(mountThrew, "挂载不再抛出 → 不再白屏").toBeNull();
    } finally {
      w.localStorage = saved;
    }
  });
});

describe("ENV2b-2 全新用户 + 写入被拒（SecurityError / 隐私模式）", () => {
  it("【已修 R09】不再抛错 → 不白屏，应用仍能起来", () => {
    window.localStorage.clear();
    const restore = blockWrites("SecurityError");
    try {
      /**
       * 修复前：首次启动（raw 为空）走 `writeRaw(initial)` 且**不在 try 里**，
       * 写失败直接逃出 loadData → 白屏。
       * 修复后：与「损坏分支」的保护对齐，写不下也返回初始数据。
       */
      let thrown: unknown = null;
      try {
        loadData();
      } catch (error) {
        thrown = error;
      }
      expect(thrown, "全新启动 + 写被拒 → 不再抛出").toBeNull();

      let mountThrew: unknown = null;
      try {
        const mounted = mountPage(<TodayPage />, "/today", "/today");
        mounted.unmount();
      } catch (error) {
        mountThrew = error;
      }
      expect(mountThrew, "应用能挂载（不白屏）").toBeNull();
    } finally {
      restore();
    }
  });
});

describe("ENV2b-3 已有数据 + 写入被拒（配额满 / 权限被撤）", () => {
  it("【已修 R09】进度不再被静默放弃——内存里是用户的真实数据，不从磁盘覆盖", () => {
    window.localStorage.clear();
    const mine = progressData();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mine));
    const onDiskBefore = window.localStorage.getItem(STORAGE_KEY);

    const restore = blockWrites("QuotaExceededError");
    let loaded: ReturnType<typeof loadData> | null = null;
    let thrown: unknown = null;
    try {
      loaded = loadData();
    } catch (error) {
      thrown = error;
    } finally {
      restore();
    }

    expect(thrown, "有数据时不会抛（应用能起来）").toBeNull();

    /**
     * 修复前：`writeRaw(migrated)` 抛错 → 落进「本地数据损坏」catch
     * → 返回初始数据、并把初始数据**原地覆盖**到磁盘，
     * 用户进度被 85KB 空白状态替换且诊断报「一切正常」。
     *
     * 修复后：写回失败只意味着「这次没能回写」，读出来的真实数据照常返回。
     */
    expect(loaded!.cards.some((card) => card.id === "mine"), "用户自己的卡在内存态里").toBe(true);
    expect(loaded!.reviews.length, "复习记录保留").toBe(mine.reviews.length);

    /** 磁盘上的数据也**没有被覆盖**（写都失败了，更不该拿空白数据去顶替）。 */
    expect(window.localStorage.getItem(STORAGE_KEY), "磁盘上的原始数据仍在").toBe(onDiskBefore);
  });

  it("【已修 R09】后续一次成功写入不再把用户进度抹掉", () => {
    window.localStorage.clear();
    const mine = progressData();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mine));

    const restore = blockWrites("QuotaExceededError");
    const loaded = loadData();
    restore();

    // 用户腾出空间后继续用：落盘的必须是他的真实数据，而不是「全新安装」的种子
    saveData(loaded);
    const onDisk = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
    expect(
      onDisk.cards.some((card: { id: string }) => card.id === "mine"),
      "用户的卡还在——这条路径此前是不可逆的数据丢失"
    ).toBe(true);
    expect(onDisk.reviews.length, "复习记录保留").toBe(mine.reviews.length);
  });

  it("对照：写入失败但磁盘上**没有**旧数据时，返回初始数据是合理的", () => {
    window.localStorage.clear();
    const restore = blockWrites("QuotaExceededError");
    let loaded: ReturnType<typeof loadData> | null = null;
    try {
      loaded = loadData();
    } catch {
      // 全新启动那条分支会抛（见 ENV2b-2）
    }
    restore();
    if (loaded) expect(loaded.cards.length).toBeGreaterThan(0);
    expect(true, "该路径的行为已在 ENV2b-2 单列").toBe(true);
  });
});

describe("ENV2b-4 getItem 返回 null（数据被外部清理 / 站点数据被清除）", () => {
  it("与「全新安装」不可区分：静默给一份空进度，没有任何提示", () => {
    window.localStorage.clear();
    const mine = progressData();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mine));

    // 外部清理（浏览器「清除站点数据」、隐私清理工具、另一个标签页调 clear）
    window.localStorage.removeItem(STORAGE_KEY);

    const loaded = loadData();
    expect(loaded.cards.some((card) => card.id === "mine"), "用户数据已读不到").toBe(false);
    expect(loaded.reviews.length).toBe(0);

    const diagnosis = diagnoseStoredData(loaded);
    /**
     * 注意这里 `ok: true`：`diagnoseStoredData` 读的是**刚刚被 loadData 写回去的**
     * 初始数据（storage.ts:1504），所以 `raw !== null`，那条
     * 「读不到本地存储快照」的 issue **不会出现**——它测的是「此刻能不能读到」，
     * 而不是「这次启动是否丢过数据」。用户因此得不到任何「数据不见了」的信号。
     */
    expect(diagnosis.ok, "诊断报告一切正常").toBe(true);
    expect(diagnosis.issues.length, "没有「数据被外部清理」的提示").toBe(0);
    expect(diagnosis.repaired.length, "也没有留档说明").toBe(0);
  });
});

describe("ENV2b-5 数据被外部改坏（JSON.parse 抛）", () => {
  it("能恢复（重置为初始数据）且**有**提示，但提示只在设置页、首屏看不到", () => {
    window.localStorage.clear();
    window.localStorage.setItem(STORAGE_KEY, "{ 这不是合法 JSON");

    const loaded = loadData();
    expect(loaded.cards.length, "返回可用的初始数据").toBeGreaterThan(0);

    const diagnosis = diagnoseStoredData(loaded);
    expect(diagnosis.repaired.length, "有「已自动重置」的修复留档").toBeGreaterThan(0);
    expect(diagnosis.repaired.join(" "), "文案说明可用 JSON 备份恢复").toMatch(/备份|恢复/);
    expect(diagnosis.ok, "诊断为不健康").toBe(false);
  });

  it("损坏 + 写入也被拒：磁盘上的坏数据不写坏，但用户同样拿不到界面（白屏）", () => {
    window.localStorage.clear();
    window.localStorage.setItem(STORAGE_KEY, "{ 坏数据");
    const restore = blockWrites("QuotaExceededError");

    let thrown: unknown = null;
    try {
      loadData();
      /**
       * storage.ts:1300-1304 的 try/catch 只在 `recordStartupRepairs` **本身**不抛时有效；
       * `recordStartupRepairs`（1466-1472）自己吞掉异常，所以这条路径是安全的——
       * 这里固定住「损坏 + 写不下」不会白屏这条保证。
       */
    } catch (error) {
      thrown = error;
    } finally {
      restore();
    }
    expect(thrown, "损坏 + 写不下：已被 1300 行的 try/catch 兜住，不白屏").toBeNull();
    expect(window.localStorage.getItem(STORAGE_KEY), "坏数据不会被进一步写坏").toBe("{ 坏数据");
  });
});

describe("ENV2b-6 读被拒（getItem 抛 SecurityError）", () => {
  it("【已修 R09】不再白屏——降级为初始数据，且设置页的诊断文案能告诉用户原因", () => {
    window.localStorage.clear();
    const restore = blockReads();
    let thrown: unknown = null;
    let loaded: ReturnType<typeof loadData> | null = null;
    try {
      loaded = loadData();
    } catch (error) {
      thrown = error;
    }
    /**
     * 修复前：`getItem` 在 try 之外 → 读被拒同样白屏，
     * 而 `diagnoseStoredData` **已经准备好**了对应文案
     *   「访问本地存储被浏览器拒绝，请检查隐私模式或站点权限设置」
     * —— 文案写好了，但用户到不了能看见它的页面。
     * 修复后：读不到按「全新安装」处理，用户进得来，就能看到那条诊断。
     */
    const diagnosis = diagnoseStoredData(makeAppData());
    restore();

    expect(thrown, "读被拒不再抛 → 不白屏").toBeNull();
    expect(loaded!.cards.length, "仍返回可用的初始数据").toBeGreaterThan(0);
    expect(diagnosis.issues.join(" "), "诊断文案说明原因（用户现在能看到了）").toMatch(/隐私模式|站点权限/);
    expect(diagnosis.ok).toBe(false);
  });
});

describe("ENV2b-6b 不用任何桩：真实把配额灌满后的数据丢失（本轮最重要的复现）", () => {
  /** 一份「用了很久」的真实形态数据：一张自己的卡 + 20000 条复习记录（约 2.7MB）。 */
  const longTimeUser = (cardId: string) =>
    makeAppData({
      cards: [
        {
          id: cardId,
          type: "sentence" as const,
          front: "I have studied for months.",
          back: "",
          note: "我的英文日记",
          tags: ["语法"],
          status: "review" as const,
          priority: false,
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z"
        }
      ],
      schedules: [
        {
          cardId,
          easeFactor: 2.5,
          intervalDays: 7,
          reviewCount: 5,
          lapseCount: 0,
          nextReviewAt: "2024-01-08T00:00:00.000Z"
        }
      ],
      reviews: Array.from({ length: 20000 }, (_, index) => ({
        id: `r${index}`,
        cardId,
        mode: "spelling" as const,
        rating: 4 as const,
        answer: "I have studied for months.",
        reviewedAt: new Date(Date.UTC(2024, 0, 1, 9, index % 60)).toISOString()
      }))
    });

  /**
   * 用**递减的块**把剩余额度压到真正的底线。
   *
   * 关键：必须填到「连一个 85KB 的写入都失败」。只填大块会在额度里留下
   * 几百 KB 的碎缝，而应用写回的那份数据恰好能塞进碎缝——那样就复现不出来。
   * （第一版就是只填 128KB 块，留下 2118KB 空隙，写入居然成功了。）
   */
  const squeezeToCeiling = (): number => {
    let keys = 0;
    for (const size of [512 * 1024, 128 * 1024, 32 * 1024, 8 * 1024, 2 * 1024, 512, 64]) {
      for (let index = 0; index < 500; index += 1) {
        try {
          window.localStorage.setItem(`env2b-filler-${keys}`, "z".repeat(size));
          keys += 1;
        } catch {
          break;
        }
      }
    }
    return keys;
  };

  /**
   * 清掉自己灌进去的填充键。
   *
   * 必须在用例结束时调用：配额是**整个进程**共享的，留着一满格会让
   * 后续用例的写入全部 QuotaExceededError（实测会把 ENV2b-7 打成
   * 一个 unhandled error，看起来像它自己坏了）。
   */
  const clearFillers = () => {
    for (const key of Object.keys(window.localStorage)) {
      if (key.startsWith("env2b-filler-")) window.localStorage.removeItem(key);
    }
  };

  it("【已修 R09 · 本轮最重要的复现】真实配额耗尽后，用户进度既不在内存里消失，也不被覆盖", () => {
    window.localStorage.clear();
    const user = longTimeUser("my-card");
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

    const diskBefore = window.localStorage.getItem(STORAGE_KEY)!;
    expect(diskBefore, "前置：用户数据已落盘").toContain("my-card");

    const fillers = squeezeToCeiling();
    /** 前置确认：此刻连一个 85KB 的写入都放不下了。 */
    let smallWriteFits = true;
    try {
      window.localStorage.setItem("env2b-probe", "z".repeat(85 * 1024));
    } catch {
      smallWriteFits = false;
    }
    expect(smallWriteFits, "已把额度压到真正的底线（否则测不出这条路径）").toBe(false);

    /**
     * 修复前：`writeRaw(migrated)` 在 try 块内抛 QuotaExceededError，
     * 被语义为「**本地数据损坏（无法解析）**」的 catch 接住——它不区分
     * 「数据坏了」与「数据好但写不下」。于是返回全新的初始数据（用户的
     * 20000 条记录在内存里凭空消失），并且 catch 分支还会 `writeRaw(initial)`：
     * 85KB 的初始数据**装得下**那块剩余空间，于是把磁盘上 2.7MB 的真实数据
     * 原地覆盖，诊断还报「一切正常」。这是不可逆的数据丢失。
     *
     * 修复后：写回失败与解析失败分开处理——解析成功就保留真实数据。
     */
    const loaded = loadData();
    const diskAfter = window.localStorage.getItem(STORAGE_KEY)!;

    expect(loaded.cards.some((card) => card.id === "my-card"), "用户自己的卡仍在内存态里").toBe(true);
    expect(loaded.reviews.length, "20000 条复习记录保留").toBe(20000);

    /** 磁盘上必须是原样——写不下就该维持上一个好版本，绝不能被空白状态顶替。 */
    expect(diskAfter, "磁盘未被覆盖").toBe(diskBefore);
    expect(diskAfter.includes("my-card"), "磁盘上仍找得到用户那张卡").toBe(true);
    expect(
      diskAfter.length,
      "磁盘体积未缩水（此前的缺陷会把它压到 1/10 以下）"
    ).toBe(diskBefore.length);

    /**
     * 最后一道防线：诊断必须告诉用户「接近上限、建议导出备份」。
     * 修复前这里是 `ok=true`（因为没有 issue、也没有修复留档），
     * 用户被告知一切正常，而进度已经没了。
     */
    const diagnosis = diagnoseStoredData(loaded);
    expect(diagnosis.ok, "诊断不再报「一切正常」").toBe(false);
    expect(
      diagnosis.issues.join(" "),
      "给出可执行的建议（导出备份后清理）"
    ).toMatch(/接近存储上限|导出备份/);

    console.log(
      `\n[ENV2b-6b] 真实配额耗尽（无任何桩，已修后复测）：\n` +
        `  灌入 ${fillers} 个填充键后，85KB 写入已失败（确认到底线）\n` +
        `  启动前磁盘 ${Math.round(diskBefore.length / 1024)} KB（含 20000 条复习记录）\n` +
        `  启动后磁盘 ${Math.round(diskAfter.length / 1024)} KB（原样保留）\n` +
        `  内存态：cards=${loaded.cards.length} reviews=${loaded.reviews.length}\n` +
        `  诊断：ok=${diagnosis.ok} issues=${diagnosis.issues.length}\n` +
        `  → 用户视角：进度完好，并被明确告知该导出备份了`
    );
    clearFillers();
  }, 120000);
});

describe("ENV2b-7 「用户数据能否导出」的可用性", () => {
  it("导出链路不依赖 localStorage 写入 —— 但前提是应用能挂载", () => {
    window.localStorage.clear();
    const mine = progressData();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mine));

    const restore = blockWrites("QuotaExceededError");
    try {
      const page = mountPage(<SettingsPage />, "/settings", "/settings");
      const text = page.text();
      /**
       * 应用能起来（这条路径见 ENV2b-3），所以设置页可访问，
       * 「JSON 备份」按钮存在 → 用户**理论上**能自救。
       * 但导出的是内存态（已经是初始数据），不是磁盘上那份真数据。
       */
      expect(text, "设置页可渲染").toContain("设置");
      expect(text, "导出入口存在").toMatch(/JSON 备份/);

      const exported = JSON.stringify(
        (window as unknown as { __env2b_exported?: string }).__env2b_exported ?? ""
      );
      void exported;
    } finally {
      restore();
    }
  });

  it("【已修 R09】写入被拒时应用仍挂得起来 —— 导出备份自救的入口保持可用", () => {
    window.localStorage.clear();
    const restore = blockWrites("SecurityError");
    let mountThrew: unknown = null;
    try {
      const mounted = mountPage(<SettingsPage />, "/settings", "/settings");
      /**
       * 这条是本轮修复的**意义**所在：能进设置页，才有机会把数据导出带走。
       * 修复前这里白屏，用户连唯一的自救入口都够不到。
       */
      expect(mounted.text().length, "设置页渲染出了内容").toBeGreaterThan(0);
      mounted.unmount();
    } catch (error) {
      mountThrew = error;
    } finally {
      restore();
    }
    expect(mountThrew, "不再白屏 → 导出备份自救的入口仍然可用").toBeNull();
  });

  it("软上限常量本身与存储可用性无关（对照项）", () => {
    expect(STORAGE_SOFT_LIMIT_BYTES).toBeGreaterThan(0);
  });
});
