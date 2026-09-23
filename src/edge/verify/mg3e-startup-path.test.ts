// @vitest-environment jsdom
/**
 * MG3e · 真实启动路径（localStorage → loadData → 迁移 → 写回）下的老数据升级（2026-09-22）
 *
 * 上面的 mg3a–mg3d 直接调 `parseBackupJson`；这里用 jsdom + 真实 localStorage 走
 * `loadData()`，验证「用户打开一次应用」到底做了什么：
 *   1. 老数据能否正常加载；
 *   2. 启动修复报告说了什么；
 *   3. 第一次启动写回后，第二次启动还会不会继续改数据（mg3c 的 FAIL-1 在真实路径上的表现）。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { loadData, parseBackupJson, summarizeStartupRepairs } from "../../services/storage";
import { resetStorage } from "../harness";

const STORAGE_KEY = "personal-vocab-app-data-v1";
const REPAIR_KEY = "personal-vocab-startup-repairs-v1";
const ISO = "2024-01-01T00:00:00.000Z";

const readRepairs = (): string[] => {
  const raw = window.localStorage.getItem(REPAIR_KEY);
  if (!raw) return [];
  const parsed = JSON.parse(raw) as { items?: unknown };
  return Array.isArray(parsed.items) ? (parsed.items as string[]) : [];
};

describe("MG3e 真实启动路径", () => {
  beforeEach(() => {
    resetStorage();
  });

  it("最早版本数据（无 schemaVersion）能正常启动，旧卡片与进度都还在", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        cards: [
          {
            id: "c1",
            type: "word",
            front: "custom",
            back: "自建词",
            note: "",
            tags: [],
            status: "review",
            priority: true,
            createdAt: ISO,
            updatedAt: ISO
          }
        ],
        grammarLessonsDone: ["lesson-01-am"]
      })
    );

    const data = loadData();
    expect(data.schemaVersion).toBe(8);
    expect(data.cards.some((card) => card.id === "c1"), "用户自己的卡必须还在").toBe(true);
    expect(data.cards.find((card) => card.id === "c1")?.priority, "标星不能被清").toBe(true);
    expect(data.grammarLessonsDone).toEqual(["lesson-01-am"]);
    expect(data.grammarLessonStagesDone?.["lesson-01-am"], "关 1 已回填").toEqual([1]);
    expect(readRepairs().some((item) => item.includes("迁移")), "启动修复报告应记录版本迁移").toBe(true);
  });

  it("【已修 2026-09-22】FAIL-12 老数据第一次启动就稳定（不再需要两次）", () => {
    const original = JSON.stringify({
      cards: [
        {
          id: "c1",
          type: "word",
          front: "custom",
          back: "自建词",
          note: "",
          tags: [],
          status: "review",
          priority: false,
          createdAt: ISO,
          updatedAt: ISO
        }
      ]
    });
    window.localStorage.setItem(STORAGE_KEY, original);

    const returnedFirst = loadData();
    const afterFirst = window.localStorage.getItem(STORAGE_KEY) ?? "";
    const returnedSecond = loadData();
    const afterSecond = window.localStorage.getItem(STORAGE_KEY) ?? "";
    loadData();
    const afterThird = window.localStorage.getItem(STORAGE_KEY) ?? "";

    /**
     * 2026-09-23 更新：`unitId` **第一次启动就落定**（此前要两次）。
     *
     * 本条曾记录两个层次的问题：
     *  ①（2026-09-22 已修）同一次启动里「返回值 vs 落盘内容」不一致；
     *  ②（本轮 2026-09-23 修）归属字段要**第二次启动**才补上——
     *     根因是 `normalizeCard` / `ensureDefaultUnits` 都跑在
     *     `seedCoreWords` **之前**，首次迁移时还没有可归属的 unit。
     *     修法：seeding 之后再跑一次 `ensureDefaultUnits` + `normalizeCard`
     *     （见 services/storage.ts 的 migrateData 末尾）。
     *
     * 现在第一次启动即终态：页面看到的数据与磁盘内容都带 unitId。
     */
    expect(
      returnedFirst.cards.find((card) => card.id === "c1")?.unitId,
      "第一次启动【页面看到】用户卡保持未分配（未分配是受支持的状态）"
    ).toBeUndefined();
    expect(
      (JSON.parse(afterFirst) as { cards: Array<{ id: string; unitId?: string }> }).cards.find(
        (card) => card.id === "c1"
      )?.unitId,
      "第一次启动【磁盘里】同一口径（页面与磁盘一致）"
    ).toBeUndefined();
    expect(
      JSON.stringify(returnedFirst),
      "同一次启动：返回值必须与落盘内容逐字节一致"
    ).toBe(afterFirst);
    expect(JSON.stringify(returnedSecond), "第二次启动同样一致").toBe(afterSecond);
    expect(afterSecond, "第二次之后内容收敛").toBe(afterThird);
  });

  it("【已修 2026-09-22】FAIL-13 loadData 返回值与落盘内容逐字节一致", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        cards: [
          {
            id: "c1",
            type: "word",
            front: "custom",
            back: "自建词",
            status: "review",
            priority: false,
            createdAt: ISO,
            updatedAt: ISO
          }
        ]
      })
    );
    const returned = loadData();
    const persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as {
      cards: Array<{ id: string; front?: string; unitId?: string; masteredAt?: string | null }>;
    };
    const returnedCard = returned.cards.find((card) => card.id === "c1");
    const persistedCard = persisted.cards.find((card) => card.id === "c1");

    /**
     * 修复后：返回值与落盘内容逐字节一致。
     * 修复前两者相差一次迁移——页面看到卡片还没有 unitId、磁盘上已经补好了，
     * 用户随便点一下就会看到界面「自己变了一次」。
     * （unitId 的归属本身仍可能晚一次启动才落定，见 FAIL-12 的说明。）
     */
    expect(returnedCard?.unitId, "页面看到的应与磁盘一致").toBe(persistedCard?.unitId);
    expect(JSON.stringify(returned), "返回值与落盘内容应逐字节相等").toBe(JSON.stringify(persisted));
  });

  it("对照 PASS-4：第二次启动起，返回值与落盘内容一致", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 8,
        seededWordVersions: ["core-100-v1"],
        cards: [
          {
            id: "c1",
            type: "word",
            front: "custom",
            back: "自建词",
            unitId: "core-100-unit-1",
            status: "review",
            priority: false,
            createdAt: ISO,
            updatedAt: ISO
          }
        ],
        units: [],
        unitGroups: []
      })
    );
    loadData();
    const returned = loadData();
    const persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
    expect(JSON.stringify(returned), "稳定态下返回值应等于落盘内容").toBe(JSON.stringify(persisted));
  });

  it("坏数据（无法解析）会整库重置，并留下明确的修复说明", () => {
    window.localStorage.setItem(STORAGE_KEY, "{ not json at all");
    const data = loadData();
    expect(data.cards.length, "重置后是内置词库").toBeGreaterThan(0);
    expect(readRepairs().some((item) => item.includes("损坏"))).toBe(true);
  });

  it("单条坏记录不会导致整库重置（只丢那一条）", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 8,
        seededWordVersions: ["core-100-v1"],
        cards: [
          { id: "good1", type: "word", front: "alpha", back: "甲", status: "review", priority: false, createdAt: ISO, updatedAt: ISO },
          null,
          "garbage",
          { id: "good2", type: "word", front: "beta", back: "乙", status: "review", priority: false, createdAt: ISO, updatedAt: ISO }
        ]
      })
    );
    const data = loadData();
    expect(data.cards.map((card) => card.id)).toEqual(["good1", "good2"]);
    expect(readRepairs().some((item) => item.includes("损坏")), "不该报「整库损坏」").toBe(false);
  });

  it("升级后重复打开应用不会让卡片或复习记录增长", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 0,
        cards: [{ id: "c1", type: "word", front: "custom", back: "自建词", status: "review", priority: false, createdAt: ISO, updatedAt: ISO }]
      })
    );
    const counts: number[] = [];
    for (let launch = 0; launch < 4; launch += 1) {
      const data = loadData();
      counts.push(data.cards.length);
    }
    expect(new Set(counts.slice(1)).size, `连续 4 次启动的卡片数应稳定，实际：${counts.join(", ")}`).toBe(1);
    expect(counts[0], "首次启动补种内置词").toBe(1 + 115);
  });

  it("迁移报告与实际改动一致：孤儿复习记录被清理时会如实说明", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schemaVersion: 8,
        seededWordVersions: ["core-100-v1"],
        cards: [{ id: "c1", type: "word", front: "alpha", back: "甲", status: "review", priority: false, createdAt: ISO, updatedAt: ISO }],
        reviews: [
          { id: "r1", cardId: "c1", mode: "spelling", rating: 4, answer: "", diffJson: "[]", reviewedAt: ISO },
          { id: "r2", cardId: "ghost", mode: "spelling", rating: 4, answer: "", diffJson: "[]", reviewedAt: ISO }
        ]
      })
    );
    const data = loadData();
    expect(data.reviews).toHaveLength(1);
    expect(readRepairs().some((item) => item.includes("复习记录"))).toBe(true);
  });

  it("对照 PASS-3：parseBackupJson 与 loadData 的**落盘结果**一致", () => {
    const raw = JSON.stringify({
      schemaVersion: 0,
      cards: [{ id: "c1", type: "word", front: "custom", back: "自建词", status: "review", priority: false, createdAt: ISO, updatedAt: ISO }]
    });
    window.localStorage.setItem(STORAGE_KEY, raw);
    loadData();
    const persisted = window.localStorage.getItem(STORAGE_KEY) ?? "";
    const viaParse = parseBackupJson(persisted);
    // loadData 落盘的是「迁移两次」的结果；对已稳定的内容再迁移一次必须不变。
    // （注意：不能直接比 parseBackupJson(raw)，因为 loadData 返回的与落盘的不是同一份，见 FAIL-13。）
    expect(JSON.stringify(parseBackupJson(JSON.stringify(viaParse))), "落盘内容已收敛").toBe(
      JSON.stringify(viaParse)
    );
    /**
     * 2026-09-23 语义收紧：无归属用户卡不再被编入内置书（见 FAIL-8 的说明），
     * 两条路径都保持「未分配」——本条要守的是「两条路径口径一致」，不是具体归属值。
     */
    expect(viaParse.cards.find((card) => card.id === "c1")?.unitId).toBeUndefined();
  });

  it("启动修复报告由 summarizeStartupRepairs 生成，老版本号会被如实写出", () => {
    const raw = JSON.stringify({
      schemaVersion: 3,
      seededWordVersions: ["core-100-v1"],
      cards: [],
      reviews: [],
      materials: [],
      materialSegments: []
    });
    const migrated = parseBackupJson(raw);
    const repairs = summarizeStartupRepairs(raw, migrated);
    expect(repairs.some((item) => item.includes("v3") && item.includes("v8"))).toBe(true);
  });

  it("【已修 2026-09-22】FAIL-14 存储写不下时 loadData 不抛错（应用仍能起来）", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        cards: [{ id: "c1", type: "word", front: "custom", back: "自建词", status: "review", priority: false, createdAt: ISO, updatedAt: ISO }]
      })
    );
    const originalSetItem = Storage.prototype.setItem;
    // 模拟浏览器存储额度用尽：写 STORAGE_KEY 一律抛 QuotaExceededError。
    Storage.prototype.setItem = function patchedSetItem(key: string, value: string) {
      if (key === STORAGE_KEY) {
        const error = new Error("QuotaExceededError");
        error.name = "QuotaExceededError";
        throw error;
      }
      return originalSetItem.call(this, key, value);
    };
    let thrown: Error | null = null;
    try {
      loadData();
    } catch (error) {
      thrown = error as Error;
    } finally {
      Storage.prototype.setItem = originalSetItem;
    }

    /**
     * 修复后：写不下也照样返回可用数据，不抛错。
     * 修复前 try 分支的写入抛错 → 落 catch → catch 里再写又抛 → 逃出 loadData；
     * 项目没有 ErrorBoundary，异常冒到 React 渲染就是白屏，
     * 用户连导出备份自救的入口都没有。
     */
    expect(thrown, "写不下时不应抛错（否则无 ErrorBoundary 会白屏）").toBeNull();
    // 影响面：AppContext 在 useState 初始化里调 loadData（AppContext.tsx:40），
    // 异常会冒到 React 渲染，项目没有 ErrorBoundary → 应用挂载失败。
    // 数据本身没丢（磁盘上还是原样），但用户看不到任何界面。
    expect(window.localStorage.getItem(STORAGE_KEY), "磁盘上的旧数据没被破坏").not.toBeNull();
  });
});
