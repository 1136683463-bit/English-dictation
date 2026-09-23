// @vitest-environment node
/**
 * MG3a · 版本号矩阵：任意历史版本的 schemaVersion 都能升级吗？（2026-09-22）
 *
 * 背景：`APP_SCHEMA_VERSION = 8`（storage.ts:50），但 `migrateData` 里**没有一处
 * 读 schemaVersion 做分支**——它只在出口写回常量。所以「版本升级」实际是
 * 「按当前归一化器重解一遍」，版本号本身不参与决策。
 *
 * 本文件穷举 schemaVersion 的取值形态，逐条记录：
 *   能否迁移 / 迁移后 schemaVersion / 哪些字段被清空 / 有没有被注入种子词。
 *
 * 特别注意老数据（缺失 / 0）：字段最不完整，也是 `seedCoreWords` 唯一会真正
 * 插入 100 张卡的场景 —— 老用户升级后词库是否被灌入内置核心词。
 */
import { describe, expect, it } from "vitest";
import { APP_SCHEMA_VERSION, migrateData, parseBackupJson } from "../../services/storage";
import { core100Words, CORE_100_WORDS_VERSION } from "../../data/seedWords";

const FIXED_ISO = "2024-01-01T00:00:00.000Z";

/**
 * 一份「有内容的」历史数据：每个版本号都套用同一份，这样横向可比。
 * 故意带上每个版本可能存在的字段，观察谁被保留、谁被清空。
 */
const richLegacyData = (schemaVersion: unknown, includeVersion = true) => {
  const data: Record<string, unknown> = {
    unitGroups: [{ id: "g1", title: "我的分组", color: "#111111", order: 1, createdAt: FIXED_ISO, updatedAt: FIXED_ISO }],
    units: [
      {
        id: "u1",
        title: "我的词书",
        description: "自建",
        order: 1,
        color: "#222222",
        groupId: "g1",
        createdAt: FIXED_ISO,
        updatedAt: FIXED_ISO
      }
    ],
    cards: [
      {
        id: "c1",
        type: "word",
        front: "apple",
        back: "苹果",
        note: "我的笔记",
        unitId: "u1",
        tags: ["自建"],
        status: "review",
        priority: true,
        createdAt: FIXED_ISO,
        updatedAt: FIXED_ISO
      },
      {
        id: "c2",
        type: "sentence",
        front: "I like apples.",
        back: "我喜欢苹果。",
        note: "",
        tags: [],
        status: "new",
        priority: false,
        createdAt: FIXED_ISO,
        updatedAt: FIXED_ISO
      }
    ],
    wordDetails: [
      {
        cardId: "c1",
        word: "apple",
        phonetic: "/ˈæpl/",
        partOfSpeech: "n.",
        chineseDefinition: "苹果",
        englishDefinition: "a fruit",
        collocations: "an apple a day",
        synonyms: "",
        antonyms: "",
        confusedWords: "",
        audioUrl: "",
        sourceSentence: "I like apples."
      }
    ],
    sentenceDetails: [
      { cardId: "c2", sentence: "I like apples.", translation: "我喜欢苹果。", keywords: [], grammarNote: "", audioUrl: "" }
    ],
    reviews: [
      { id: "r1", cardId: "c1", mode: "spelling", rating: 3, answer: "apple", diffJson: "[]", reviewedAt: FIXED_ISO }
    ],
    schedules: [
      {
        cardId: "c1",
        easeFactor: 2.5,
        intervalDays: 4,
        reviewCount: 3,
        lapseCount: 1,
        nextReviewAt: FIXED_ISO
      }
    ],
    grammarLessonsDone: ["lesson-a", "lesson-b"],
    grammarLessonStagesDone: { "lesson-a": [1, 2], "lesson-b": [1] },
    grammarBoostsDone: { "lesson-a": [1] },
    diaryEntries: [
      {
        id: "d1",
        dateKey: "2024-01-01",
        questionId: "q1",
        questionZh: "今天做了什么",
        answerEn: "I read a book.",
        correctedEn: "I read a book.",
        issues: [],
        status: "done",
        createdAt: FIXED_ISO
      }
    ],
    seededWordVersions: [],
    settings: { dailyNewWords: 7, speechLang: "en-GB" }
  };
  if (includeVersion) data.schemaVersion = schemaVersion;
  return data;
};

interface MatrixRow {
  label: string;
  input: unknown;
  migrated: boolean;
  error?: string;
  outVersion?: unknown;
  cards: number;
  reviews: number;
  units: number;
  unitGroups: number;
  wordDetails: number;
  schedules: number;
  grammarLessonsDone: number;
  stagesForA?: number[];
  seededInjected: number;
  seededVersions?: string[];
}

const runCase = (label: string, input: unknown, includeVersion = true): MatrixRow => {
  const raw = richLegacyData(input, includeVersion);
  let out;
  try {
    out = parseBackupJson(JSON.stringify(raw));
  } catch (error) {
    return {
      label,
      input,
      migrated: false,
      error: error instanceof Error ? error.message : String(error),
      cards: 0,
      reviews: 0,
      units: 0,
      unitGroups: 0,
      wordDetails: 0,
      schedules: 0,
      grammarLessonsDone: 0,
      seededInjected: 0
    };
  }
  const injectedCardIds = new Set(out.cards.map((card) => card.id).filter((id) => !["c1", "c2"].includes(id)));
  return {
    label,
    input: includeVersion ? input : "<missing>",
    migrated: true,
    outVersion: out.schemaVersion,
    cards: out.cards.length,
    reviews: out.reviews.length,
    units: out.units.length,
    unitGroups: out.unitGroups.length,
    wordDetails: out.wordDetails.length,
    schedules: out.schedules.length,
    grammarLessonsDone: out.grammarLessonsDone.length,
    stagesForA: out.grammarLessonStagesDone?.["lesson-a"],
    seededInjected: injectedCardIds.size,
    seededVersions: out.seededWordVersions
  };
};

describe("MG3a 版本号矩阵", () => {
  it("穷举 schemaVersion 取值，记录迁移结论", () => {
    const cases: Array<[string, unknown, boolean]> = [
      ["缺失（无 schemaVersion 字段）", undefined, false],
      ["0", 0, true],
      ["1", 1, true],
      ["2", 2, true],
      ["3", 3, true],
      ["4", 4, true],
      ["5", 5, true],
      ["6", 6, true],
      ["7", 7, true],
      ["8（当前）", 8, true],
      ["99（未来版本）", 99, true],
      ["null", null, true],
      ["字符串 \"8\"", "8", true],
      ["负数 -1", -1, true],
      ["小数 6.5", 6.5, true],
      ["NaN", Number.NaN, true],
      ["对象 {}", {}, true]
    ];

    const rows = cases.map(([label, value, hasVersion]) => runCase(label, value, hasVersion));

    // 报告用：把矩阵打到测试输出里，报告表格即由此转写。
    // eslint-disable-next-line no-console
    console.log(
      ["版本 | 可迁移 | 输出版本 | cards | reviews | units | groups | 注入卡 | seededWordVersions"]
        .concat(
          rows.map((row) =>
            [
              row.label,
              row.migrated ? "是" : `否(${row.error})`,
              String(row.outVersion),
              row.cards,
              row.reviews,
              row.units,
              row.unitGroups,
              row.seededInjected,
              JSON.stringify(row.seededVersions)
            ].join(" | ")
          )
        )
        .join("\n")
    );

    // 全部必须能迁移：任何版本号都不该让 parseBackupJson 抛错。
    for (const row of rows) {
      expect(row.migrated, `schemaVersion=${row.label} 必须能迁移，实际抛错：${row.error}`).toBe(true);
      expect(row.outVersion, `schemaVersion=${row.label} 迁移后应写成当前版本`).toBe(APP_SCHEMA_VERSION);
    }

    // 用户内容必须存活：卡片、复习记录、自建词书/分组、关卡进度。
    for (const row of rows) {
      expect(row.reviews, `schemaVersion=${row.label} 复习记录不该被清空`).toBe(1);
      expect(row.grammarLessonsDone, `schemaVersion=${row.label} 已学课程不该被清空`).toBe(2);
      expect(row.stagesForA, `schemaVersion=${row.label} lesson-a 的关卡进度应含关 1、关 2`).toEqual([1, 2]);
    }

    // 这条是核心风险：老数据的 seededWordVersions 为空 → 会被灌 100 张内置核心词。
    // 注意：这里**故意**用了 seededWordVersions: []，所以每个版本号都会补种 ——
    // 说明补种只由 seededWordVersions 决定，与版本号完全无关。
    const withoutSeeded = rows.filter((row) => row.seededInjected > 0);
    expect(
      withoutSeeded.map((row) => row.label).sort(),
      "seededWordVersions 为空时，任何版本号都会补种内置核心词"
    ).toEqual(rows.map((row) => row.label).sort());
    for (const row of rows) {
      expect(row.seededInjected, `${row.label}: 补种数量应等于内置词条数`).toBe(core100Words.length);
      expect(row.cards, `${row.label}: 原有 2 张卡 + 补种卡`).toBe(2 + core100Words.length);
    }
  });

  it("补种只由 seededWordVersions 决定：带上版本号的任何 schemaVersion 都不补种", () => {
    for (const version of [0, 1, 3, 8, 99, undefined, null, "8", -1]) {
      const raw: Record<string, unknown> = {
        seededWordVersions: [CORE_100_WORDS_VERSION],
        cards: [{ id: "c1", type: "word", front: "apple", back: "苹果" }]
      };
      if (version !== undefined) raw.schemaVersion = version;
      const out = migrateData(raw);
      expect(out.cards, `schemaVersion=${JSON.stringify(version)} 不该补种`).toHaveLength(1);
      expect(out.seededWordVersions).toEqual([CORE_100_WORDS_VERSION]);
    }
  });

  it("seededWordVersions 里有别的版本号（不含 core-100-v1）→ 仍会补种一次", () => {
    const first = migrateData({ schemaVersion: 0, seededWordVersions: ["other-v1"], cards: [] });
    expect(first.cards, "其它版本号不代表已补过内置词").toHaveLength(core100Words.length);
    expect(first.seededWordVersions).toEqual(["other-v1", CORE_100_WORDS_VERSION]);
    // 补种后再次迁移不再重复（版本号已记下）。
    const second = migrateData(first);
    expect(second.cards).toHaveLength(core100Words.length);
    expect(new Set(second.cards.map((card) => card.id)).size).toBe(core100Words.length);
  });

  it("版本号形态不影响「未知顶层字段被丢弃」的行为（白名单与版本无关）", () => {
    for (const version of [0, 8, 99, null, "8"]) {
      const out = migrateData({
        schemaVersion: version,
        seededWordVersions: [CORE_100_WORDS_VERSION],
        cards: [],
        futureFeatureState: { keep: "me" }
      });
      expect(
        out && "futureFeatureState" in out,
        `schemaVersion=${JSON.stringify(version)} 时未知字段被丢弃`
      ).toBe(false);
    }
  });

  it("版本号本身不参与迁移决策：0 / 3 / 8 / 99 走的是同一条路径", () => {
    const results = [0, 3, 8, 99].map((version) => {
      const out = migrateData(richLegacyData(version));
      return {
        cards: out.cards.length,
        units: out.units.length,
        unitGroups: out.unitGroups.length,
        seeded: out.seededWordVersions,
        stages: out.grammarLessonStagesDone,
        // 时间戳会变（nowIso），先剔除后再比对结构。
        shape: Object.keys(out).sort()
      };
    });
    for (const result of results) {
      expect(result.shape).toEqual(results[0].shape);
      expect(result.cards).toBe(results[0].cards);
      expect(result.units).toBe(results[0].units);
      expect(result.unitGroups).toBe(results[0].unitGroups);
      expect(result.stages).toEqual(results[0].stages);
    }
    // 版本号只被写回常量，不被用来判断「这份数据该补什么」。
    expect(CORE_100_WORDS_VERSION).toBe("core-100-v1");
  });

  it("合法 ISO 时间戳与非法时间戳的处理差异（老数据常见脏值）", () => {
    const out = migrateData({
      seededWordVersions: [CORE_100_WORDS_VERSION],
      cards: [
        { id: "c1", front: "apple", back: "苹果", createdAt: "not-a-date", updatedAt: "not-a-date" },
        { id: "c2", front: "pear", back: "梨", createdAt: "", updatedAt: null }
      ],
      units: [{ id: "u1", title: "书", createdAt: "garbage", updatedAt: "garbage" }]
    });
    // 非法时间戳被替换成「现在」而不是被丢弃——老数据不会因此丢卡，但时间线被改写。
    expect(out.cards).toHaveLength(2);
    for (const card of out.cards) {
      expect(Number.isNaN(new Date(card.createdAt).getTime()), `${card.id} 的时间戳应被改成合法 ISO`).toBe(false);
    }
    expect(Number.isNaN(new Date(out.units[0].createdAt).getTime())).toBe(false);
  });
});
