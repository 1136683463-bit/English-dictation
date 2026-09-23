// @vitest-environment jsdom
/**
 * MG4-b · 导入路径的边界（2026-09-22）
 *
 * 验证 restoreDataFromJson / parseBackupJson 面对以下输入的行为：
 *   空对象 / null / 数组 / 纯字符串 / 非法 JSON / 超大 JSON / 部分字段 /
 *   schemaVersion 更高 / 别人的备份
 *
 * 判据：不崩、不静默清空用户数据、错误可理解；缺失字段取默认值而不是 undefined。
 */
import { beforeEach, describe, expect, it } from "vitest";
import type { AppData } from "../../types";
import { APP_SCHEMA_VERSION, parseBackupJson, restoreDataFromJson } from "../../services/storage";
import { STORAGE_KEY, makeAppData } from "./fixtures";

/** 有价值的“用户当前数据”：导入失败时它必须原样还在。 */
const seedCurrentData = (): void => {
  const current = makeAppData({
    cards: [
      {
        id: "card_keep",
        type: "word",
        front: "keep",
        back: "保留",
        note: "",
        tags: [],
        status: "review",
        priority: false,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      }
    ],
    reviews: [
      {
        id: "review_keep",
        cardId: "card_keep",
        mode: "spelling",
        rating: 4,
        answer: "keep",
        diffJson: "[]",
        reviewedAt: "2024-01-01T00:00:00.000Z"
      }
    ]
  });
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
};

const currentCardIds = (): string[] => {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const parsed = JSON.parse(raw) as AppData;
  return parsed.cards.map((card) => card.id);
};

/** 捕获同步抛出的错误（不关心类型，只看有没有抛、消息是什么）。 */
const attempt = (json: string): { threw: boolean; message: string; value?: AppData } => {
  try {
    return { threw: false, message: "", value: restoreDataFromJson(json) };
  } catch (error) {
    return { threw: true, message: error instanceof Error ? error.message : String(error) };
  }
};

describe("MG4-b 非法输入：应报错且不动用户数据", () => {
  beforeEach(() => {
    window.localStorage.clear();
    seedCurrentData();
  });

  it("空对象 {} → 抛错，当前数据原样保留", () => {
    const result = attempt("{}");
    // eslint-disable-next-line no-console
    console.log(`[{}] threw=${result.threw} message="${result.message}"`);
    expect(result.threw, "{} 不是可识别的备份，应当报错").toBe(true);
    expect(currentCardIds(), "报错后不该动本地数据").toEqual(["card_keep"]);
  });

  it("null → 抛错，当前数据原样保留", () => {
    const result = attempt("null");
    // eslint-disable-next-line no-console
    console.log(`[null] threw=${result.threw} message="${result.message}"`);
    expect(result.threw).toBe(true);
    expect(currentCardIds()).toEqual(["card_keep"]);
  });

  it("数组 [] → 抛错，当前数据原样保留", () => {
    const result = attempt("[]");
    // eslint-disable-next-line no-console
    console.log(`[[]] threw=${result.threw} message="${result.message}"`);
    expect(result.threw).toBe(true);
    expect(currentCardIds()).toEqual(["card_keep"]);
  });

  it("纯字符串 \"hello\" → 抛错，当前数据原样保留", () => {
    const result = attempt(JSON.stringify("hello"));
    // eslint-disable-next-line no-console
    console.log(`["hello"] threw=${result.threw} message="${result.message}"`);
    expect(result.threw).toBe(true);
    expect(currentCardIds()).toEqual(["card_keep"]);
  });

  it("非法 JSON → 抛错，但消息是引擎原文（不是用户能懂的话）", () => {
    const result = attempt("{ this is not json");
    // eslint-disable-next-line no-console
    console.log(`[非法 JSON] threw=${result.threw} message="${result.message}"`);
    expect(result.threw).toBe(true);
    expect(currentCardIds(), "报错后不该动本地数据").toEqual(["card_keep"]);
    // 记录事实：消息里没有面向用户的中文解释，只有 JSON 引擎原文。
    expect(/Unexpected|JSON|position|token/i.test(result.message), "消息为 JSON 引擎原文").toBe(true);
  });

  it("parseBackupJson 对非法输入同样抛错且不落盘", () => {
    expect(() => parseBackupJson("{}")).toThrow();
    expect(currentCardIds()).toEqual(["card_keep"]);
  });
});

describe("MG4-b 超大 JSON", () => {
  beforeEach(() => {
    window.localStorage.clear();
    seedCurrentData();
  });

  /** 造一份指定体积量级的备份。 */
  const bigBackup = (cardCount: number) => {
    const filler = "x".repeat(250);
    const cards = Array.from({ length: cardCount }, (_, index) => ({
      id: `bulk_${index}`,
      type: "word",
      front: `word${index}`,
      back: `释义${index}`,
      note: filler,
      tags: [],
      status: "new",
      priority: false,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z"
    }));
    return JSON.stringify({
      schemaVersion: APP_SCHEMA_VERSION,
      seededWordVersions: ["core-100-v1"],
      cards,
      settings: {}
    });
  };

  it("约 1.7MB 的备份：没有体积门槛，静默接受并整体替换", () => {
    const json = bigBackup(4000);
    const sizeMb = json.length / 1024 / 1024;
    const started = Date.now();
    const restored = restoreDataFromJson(json);
    // eslint-disable-next-line no-console
    console.log(
      `[大备份] ${sizeMb.toFixed(2)}MB / 4000 卡：接受，耗时 ${Date.now() - started}ms，落盘卡数=${currentCardIds().length}`
    );

    expect(restored.cards.length, "没有体积上限：备份有多大就吃多大").toBe(4000);
    expect(currentCardIds(), "本机原数据被整体替换").not.toContain("card_keep");
  }, 60000);

  it("超出存储配额时抛 QuotaExceededError：旧数据保住，但错误不是用户能懂的话", () => {
    // 本环境 localStorage 配额为 500 万字符；迁移会把每张卡补出 wordDetails + schedule，
    // 落盘体积约为备份的 1.9 倍 —— 所以 3MB 的备份就可能写不下。
    const json = bigBackup(7000);
    const sizeMb = json.length / 1024 / 1024;
    const started = Date.now();
    const result = attempt(json);
    const elapsed = Date.now() - started;

    // eslint-disable-next-line no-console
    console.log(
      `[超配额] 备份 ${sizeMb.toFixed(2)}MB：threw=${result.threw} 耗时=${elapsed}ms message="${result.message}"\n` +
        `  落盘卡数=${currentCardIds().length}（本机 card_keep 保留=${currentCardIds().includes("card_keep")}）`
    );

    expect(sizeMb, "构造的备份应确实大于诊断里 4MB 的软阈值").toBeGreaterThan(2.5);
    expect(result.threw, "写不下时抛出底层存储错误").toBe(true);
    expect(
      /QuotaExceededError|quota/i.test(result.message),
      "错误是存储配额原文，不是「备份太大 / 空间不够」这类用户能懂的话"
    ).toBe(true);
    expect(currentCardIds(), "写入是原子的：失败的写入没有破坏旧数据").toEqual(["card_keep"]);
  }, 180000);
});

describe("MG4-b 部分字段的备份", () => {
  beforeEach(() => {
    window.localStorage.clear();
    seedCurrentData();
  });

  it("只有 cards：其余字段取默认值，deck 不为 undefined", () => {
    const restored = restoreDataFromJson(
      JSON.stringify({
        schemaVersion: APP_SCHEMA_VERSION,
        seededWordVersions: ["core-100-v1"],
        cards: [
          {
            id: "partial_1",
            type: "word",
            front: "partial",
            back: "部分的",
            note: "",
            tags: [],
            status: "new",
            priority: false,
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z"
          }
        ]
      })
    );

    const undefinedFields = (Object.keys(restored) as Array<keyof AppData>).filter(
      (key) => restored[key] === undefined
    );
    // eslint-disable-next-line no-console
    console.log(`[只有 cards] undefined 顶层字段 = ${JSON.stringify(undefinedFields)}`);
    expect(undefinedFields, "任何顶层字段都不该是 undefined（否则下游 .length 会崩）").toEqual([]);

    // 关键默认值
    expect(restored.settings.dailyNewWords, "settings 缺失时取默认目标").toBe(10);
    expect(restored.settings.aiProvider.apiKey).toBe("");
    expect(Array.isArray(restored.reviews)).toBe(true);
    expect(Array.isArray(restored.diaryEntries)).toBe(true);
    expect(Array.isArray(restored.languageGates)).toBe(true);
    expect(typeof restored.grammarLessonStagesDone).toBe("object");
    expect(restored.dictionaryEntries.length, "词典缺失时回退内置词典").toBeGreaterThan(0);
    expect(restored.cards.map((card) => card.id)).toEqual(["partial_1"]);
    // 部分备份会把默认词书补齐
    // eslint-disable-next-line no-console
    console.log(
      `[只有 cards] units=${restored.units.length} schedules=${restored.schedules.length} wordDetails=${restored.wordDetails.length}`
    );
  });

  it("只有 settings：卡片等数组为空，settings 值被保留", () => {
    const restored = restoreDataFromJson(
      JSON.stringify({
        schemaVersion: APP_SCHEMA_VERSION,
        seededWordVersions: ["core-100-v1"],
        settings: { dailyNewWords: 33, speechLang: "en-GB", diaryDailyCount: 10 }
      })
    );
    expect(restored.settings.dailyNewWords).toBe(33);
    expect(restored.settings.speechLang).toBe("en-GB");
    expect(restored.settings.dailyReviewLimit, "未给的设置项取默认").toBe(30);
    expect(restored.cards).toEqual([]);
    expect(restored.reviews).toEqual([]);
  });

  it("新装的备份没有 seededWordVersions 时会被补 100 张核心词卡", () => {
    const restored = restoreDataFromJson(JSON.stringify({ schemaVersion: APP_SCHEMA_VERSION, cards: [] }));
    // eslint-disable-next-line no-console
    console.log(`[缺 seededWordVersions] 卡数=${restored.cards.length} units=${restored.units.length}`);
    expect(restored.cards.length, "缺 seededWordVersions 会触发核心词补齐（意外放大数据量）").toBeGreaterThan(90);
    expect(restored.seededWordVersions).toContain("core-100-v1");
  });
});

describe("MG4-b schemaVersion 更高的备份", () => {
  beforeEach(() => {
    window.localStorage.clear();
    seedCurrentData();
  });

  it("v99：静默降级为 v8，未知新字段被丢弃（覆盖后不可恢复）", () => {
    const restored = restoreDataFromJson(
      JSON.stringify({
        schemaVersion: 99,
        seededWordVersions: ["core-100-v1"],
        cards: [],
        settings: { dailyNewWords: 20 },
        // 假设未来版本新增的字段
        futureFeature: { enabled: true, data: [1, 2, 3] },
        newTopLevelList: ["a", "b"]
      })
    );

    // eslint-disable-next-line no-console
    console.log(
      `[v99] schemaVersion: 99 → ${restored.schemaVersion}；futureFeature=${JSON.stringify(
        (restored as unknown as Record<string, unknown>).futureFeature
      )}；newTopLevelList=${JSON.stringify((restored as unknown as Record<string, unknown>).newTopLevelList)}`
    );

    expect(restored.schemaVersion, "高版本号被无条件改写为当前版本").toBe(APP_SCHEMA_VERSION);
    expect(
      (restored as unknown as Record<string, unknown>).futureFeature,
      "未来字段被静默丢弃"
    ).toBeUndefined();
    expect((restored as unknown as Record<string, unknown>).newTopLevelList).toBeUndefined();
    // 而且没有向用户报告这件事
    expect(restored.settings.dailyNewWords, "同一版本里的已知字段仍生效").toBe(20);
  });

  it("v99 的卡片级新字段同样被丢弃", () => {
    const restored = restoreDataFromJson(
      JSON.stringify({
        schemaVersion: 99,
        seededWordVersions: ["core-100-v1"],
        cards: [
          {
            id: "future_card",
            type: "word",
            front: "future",
            back: "未来",
            note: "",
            tags: [],
            status: "new",
            priority: false,
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
            futureSrsField: 0.42
          }
        ]
      })
    );
    // eslint-disable-next-line no-console
    console.log(
      `[v99 卡片字段] futureSrsField=${JSON.stringify(
        (restored.cards[0] as unknown as Record<string, unknown>).futureSrsField
      )}`
    );
    expect((restored.cards[0] as unknown as Record<string, unknown>).futureSrsField).toBeUndefined();
  });
});

describe("MG4-b 别人的备份：全量替换（不合并）", () => {
  beforeEach(() => {
    window.localStorage.clear();
    seedCurrentData();
  });

  it("只含对方卡片的合法备份 → 本机卡片与复习记录被完全替换", () => {
    const other = makeAppData({
      cards: [
        {
          id: "other_card",
          type: "word",
          front: "other",
          back: "别人的",
          note: "",
          tags: [],
          status: "mastered",
          priority: false,
          createdAt: "2024-02-01T00:00:00.000Z",
          updatedAt: "2024-02-01T00:00:00.000Z"
        }
      ]
    });
    const before = currentCardIds();
    const restored = restoreDataFromJson(JSON.stringify(other));

    // eslint-disable-next-line no-console
    console.log(
      `[别人的备份] 导入前本机卡片=${JSON.stringify(before)} 导入后=${JSON.stringify(restored.cards.map((c) => c.id))} 复习=${restored.reviews.length}`
    );

    expect(restored.cards.map((card) => card.id)).toEqual(["other_card"]);
    expect(restored.reviews, "本机复习记录一律被清掉").toEqual([]);
    expect(currentCardIds(), "落盘内容也被替换").toEqual(["other_card"]);
  });

  it("对方的 AI Key / 云同步令牌会覆盖本机（安全相关）", () => {
    const other = makeAppData({
      settings: {
        aiProvider: {
          enabled: true,
          baseUrl: "https://api.other-relay.com/v1",
          apiKey: "sk-other-user-key",
          model: "gpt-4o-mini",
          temperature: 0.7,
          timeoutMs: 120000,
          fallbackToLocal: true
        },
        dataSync: { enabled: true, baseUrl: "https://other.example.com", token: "other-token" }
      }
    });
    const restored = restoreDataFromJson(JSON.stringify(other));
    // eslint-disable-next-line no-console
    console.log(
      `[别人的备份] 本机 AI Key 被替换为 "${restored.settings.aiProvider.apiKey}"，同步地址 "${restored.settings.dataSync.baseUrl}"`
    );
    expect(restored.settings.aiProvider.apiKey).toBe("sk-other-user-key");
    expect(restored.settings.dataSync.baseUrl).toBe("https://other.example.com");
    expect(restored.settings.dataSync.enabled, "对方的云同步开关也会在本机生效，本机数据会被推到对方地址").toBe(true);
  });
});
