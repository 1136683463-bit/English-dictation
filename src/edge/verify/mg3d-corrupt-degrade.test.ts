// @vitest-environment node
/**
 * MG3c2 · 损坏数据的降级行为（2026-09-22）
 *
 * 期望：**一条坏记录不该让整个词库丢掉**。`loadData` 的 catch 会整库重置，
 * 所以只要 `migrateData` 抛错，用户就会失去全部卡片、复习记录与进度。
 *
 * 本文件穷举各类损坏输入，记录：是「安全降级」还是「整体失败」。
 */
import { describe, expect, it } from "vitest";
import { migrateData, parseBackupJson, summarizeStartupRepairs } from "../../services/storage";

const ISO = "2024-01-01T00:00:00.000Z";

const wordCard = (id: string, front: string, patch: Record<string, unknown> = {}) => ({
  id,
  type: "word",
  front,
  back: `${front} 的释义`,
  note: "",
  tags: [],
  status: "review",
  priority: false,
  createdAt: ISO,
  updatedAt: ISO,
  ...patch
});

const seeded = (patch: Record<string, unknown>) => ({
  schemaVersion: 8,
  seededWordVersions: ["core-100-v1"],
  cards: [],
  units: [],
  unitGroups: [],
  ...patch
});

/** 跑迁移，返回「成功/失败 + 异常信息」。 */
const attempt = (input: unknown): { ok: boolean; error?: string; data?: ReturnType<typeof migrateData> } => {
  try {
    return { ok: true, data: migrateData(input) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
};

describe("MG3c2-1 cards 数组里的坏记录", () => {
  it("混入 null / 字符串 / 数字 / 布尔 / 数组 → 逐条丢弃，好卡全部保留", () => {
    const result = attempt(
      seeded({
        cards: [
          wordCard("good1", "apple"),
          null,
          "not-a-card",
          42,
          true,
          [1, 2, 3],
          undefined,
          wordCard("good2", "pear")
        ]
      })
    );
    expect(result.ok, `迁移不该因坏记录失败：${result.error}`).toBe(true);
    expect(result.data?.cards.map((card) => card.id)).toEqual(["good1", "good2"]);
  });

  it("缺少 id 的卡 → 生成新 id（不是丢弃），卡还在", () => {
    const result = attempt(seeded({ cards: [{ type: "word", front: "apple", back: "苹果" }] }));
    expect(result.ok).toBe(true);
    expect(result.data?.cards).toHaveLength(1);
    expect(result.data?.cards[0].id, "缺 id 时补一个新 id").toBeTruthy();
    expect(result.data?.cards[0].front).toBe("apple");
  });

  it("缺少 id 的卡在**每次迁移**都会换新 id → 绑在旧 id 上的计划与记录全部失效", () => {
    const input = seeded({
      cards: [{ type: "word", front: "apple", back: "苹果", status: "review" }],
      schedules: [
        { cardId: "missing", easeFactor: 2.5, intervalDays: 9, reviewCount: 9, lapseCount: 4, nextReviewAt: ISO }
      ],
      reviews: [
        { id: "r1", cardId: "missing", mode: "spelling", rating: 4, answer: "", diffJson: "[]", reviewedAt: ISO }
      ]
    });
    const first = parseBackupJson(JSON.stringify(input));
    const second = parseBackupJson(JSON.stringify(first));
    const firstId = first.cards[0]?.id;
    const secondId = second.cards[0]?.id;
    // 第一次迁移后 id 已固定，第二次不会变（id 被写回后就是稳定值）。
    expect(secondId).toBe(firstId);
    // 但旧计划与旧记录在第一次迁移时就已经全部对不上、被清掉了。
    expect(first.reviews, "指向不存在卡片的复习记录会被清掉").toHaveLength(0);
    const orphanSchedule = first.schedules.find((schedule) => schedule.cardId === "missing");
    expect(orphanSchedule, "指向不存在卡片的计划也会被清掉").toBeUndefined();
  });

  it("id 重复的卡：两张都留着，但共用一条复习计划", () => {
    const result = attempt(
      seeded({
        cards: [wordCard("dup", "apple"), wordCard("dup", "pear")],
        schedules: [
          { cardId: "dup", easeFactor: 2.5, intervalDays: 3, reviewCount: 3, lapseCount: 0, nextReviewAt: ISO }
        ]
      })
    );
    expect(result.ok).toBe(true);
    expect(result.data?.cards, "同 id 的两张卡都会留下").toHaveLength(2);
    expect(result.data?.schedules, "同 id 只保留一条计划").toHaveLength(1);
    expect(result.data?.wordDetails, "wordDetails 也按 cardId 各留一条").toHaveLength(2);
  });

  it("卡片 id 是数字 / 空串 → 补成新 id；纯空白 id 被原样保留（仍是坏 id）", () => {
    const result = attempt(
      seeded({
        cards: [
          { id: 123, type: "word", front: "a", back: "甲" },
          { id: "", type: "word", front: "b", back: "乙" },
          { id: "   ", type: "word", front: "c", back: "丙" }
        ]
      })
    );
    expect(result.ok).toBe(true);
    expect(result.data?.cards).toHaveLength(3);
    const ids = result.data?.cards.map((card) => card.id) ?? [];
    expect(ids[0], "数字 id 被替换").not.toBe("123");
    expect(ids[1], "空串 id 被替换").not.toBe("");
    expect(ids[2], "纯空白 id 被原样保留（没有 trim 后再判空）").toBe("   ");
    expect(new Set(ids).size, "补 id 后不应互相碰撞").toBe(3);
  });

  it("卡片字段缺失（只有 front）→ 补齐类型与状态，不丢卡", () => {
    const result = attempt(seeded({ cards: [{ front: "lonely" }] }));
    expect(result.ok).toBe(true);
    expect(result.data?.cards).toHaveLength(1);
    expect(result.data?.cards[0]).toMatchObject({ front: "lonely", type: "word", status: "new", priority: false });
  });

  it("front 是空白、back 有内容 → 保留（判定是「两者都空」才丢）", () => {
    const result = attempt(seeded({ cards: [wordCard("blanks", "  "), wordCard("good", "apple")] }));
    expect(result.ok).toBe(true);
    expect(result.data?.cards.map((card) => card.id)).toEqual(["blanks", "good"]);
    expect(result.data?.cards.find((card) => card.id === "blanks")?.front, "空壳卡的题面就是空白").toBe("  ");
  });

  it("front 与 back 都为空串 / 都缺失 → 丢弃（无法出题的空壳）", () => {
    const result = attempt(
      seeded({
        cards: [
          { id: "both-empty", type: "word", front: "", back: "" },
          { id: "no-fields", type: "word" },
          { id: "whitespace-both", type: "word", front: "   ", back: "  " },
          { id: "good", type: "word", front: "apple", back: "苹果" }
        ]
      })
    );
    expect(result.ok).toBe(true);
    expect(result.data?.cards.map((card) => card.id)).toEqual(["good"]);
  });

  it("字段类型全错（front 是对象、tags 是字符串、status 是数字）→ 降级但不抛错", () => {
    const result = attempt(
      seeded({
        cards: [
          {
            id: "c1",
            type: 42,
            front: { text: "apple" },
            back: ["苹果"],
            note: 7,
            tags: "a,b",
            status: 9,
            priority: "yes",
            createdAt: 12345,
            updatedAt: null,
            unitId: {}
          }
        ]
      })
    );
    expect(result.ok, `字段类型全错时也必须安全降级：${result.error}`).toBe(true);
    // front/back 都不是字符串 → 视为空壳卡，被丢弃（这是当前的降级结果）。
    expect(result.data?.cards ?? []).toEqual([]);
  });

  it("cards 不是数组（对象 / 字符串 / 数字）→ 降级为空数组，其它数据保留", () => {
    for (const value of [{}, "cards", 5, null, true]) {
      const result = attempt(seeded({ cards: value, units: [{ id: "u1", title: "我的书", order: 1, createdAt: ISO, updatedAt: ISO }] }));
      expect(result.ok, `cards=${JSON.stringify(value)} 不该抛错`).toBe(true);
      expect(result.data?.cards, `cards=${JSON.stringify(value)} 应降级为空`).toEqual([]);
      expect(result.data?.units.some((unit) => unit.id === "u1"), "其它字段不能跟着丢").toBe(true);
    }
  });

  it("混合坏记录时，好卡与复习记录的量级不变", () => {
    const cards = Array.from({ length: 50 }, (_, index) => wordCard(`c${index}`, `word${index}`));
    const reviews = cards.map((card, index) => ({
      id: `r${index}`,
      cardId: card.id,
      mode: "spelling",
      rating: 4,
      answer: "",
      diffJson: "[]",
      reviewedAt: ISO
    }));
    const result = attempt(seeded({ cards: [...cards, null, "x", 7], reviews }));
    expect(result.ok).toBe(true);
    expect(result.data?.cards).toHaveLength(50);
    expect(result.data?.reviews).toHaveLength(50);
  });

  it("超长卡片列表里的单条坏记录不会中断后续处理", () => {
    const cards = [
      wordCard("first", "a"),
      null,
      ...Array.from({ length: 100 }, (_, index) => wordCard(`m${index}`, `word${index}`)),
      "",
      wordCard("last", "z")
    ];
    const result = attempt(seeded({ cards }));
    expect(result.ok).toBe(true);
    expect(result.data?.cards).toHaveLength(102);
    expect(result.data?.cards[0].id).toBe("first");
    expect(result.data?.cards[result.data.cards.length - 1].id).toBe("last");
  });
});

describe("MG3c2-2 schedules 数组里的坏记录", () => {
  it("混入 null / 字符串 / 数字 → 丢弃，好计划保留", () => {
    const result = attempt(
      seeded({
        cards: [wordCard("c1", "apple"), wordCard("c2", "pear")],
        schedules: [
          { cardId: "c1", easeFactor: 2.5, intervalDays: 3, reviewCount: 2, lapseCount: 0, nextReviewAt: ISO },
          null,
          "bad",
          99,
          { cardId: "c2", easeFactor: 2.5, intervalDays: 5, reviewCount: 4, lapseCount: 1, nextReviewAt: ISO }
        ]
      })
    );
    expect(result.ok).toBe(true);
    const byId = new Map(result.data?.schedules.map((schedule) => [schedule.cardId, schedule]));
    expect(byId.get("c1")?.reviewCount).toBe(2);
    expect(byId.get("c2")?.reviewCount).toBe(4);
  });

  it("计划里数字字段是脏值（负数 / NaN / 字符串）→ 收敛到安全范围", () => {
    const result = attempt(
      seeded({
        cards: [wordCard("c1", "apple")],
        schedules: [
          {
            cardId: "c1",
            easeFactor: -5,
            intervalDays: -3,
            reviewCount: Number.NaN,
            lapseCount: "abc",
            nextReviewAt: "not-a-date"
          }
        ]
      })
    );
    expect(result.ok).toBe(true);
    const schedule = result.data?.schedules.find((item) => item.cardId === "c1");
    expect(schedule?.easeFactor).toBeGreaterThanOrEqual(1.3);
    expect(schedule?.intervalDays).toBeGreaterThanOrEqual(0);
    expect(schedule?.lapseCount).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(new Date(schedule?.nextReviewAt ?? "").getTime())).toBe(true);
  });

  it("同一张卡有多条计划 → 只留第一条（后面的丢失）", () => {
    const result = attempt(
      seeded({
        cards: [wordCard("c1", "apple")],
        schedules: [
          { cardId: "c1", easeFactor: 2.5, intervalDays: 1, reviewCount: 1, lapseCount: 0, nextReviewAt: ISO },
          { cardId: "c1", easeFactor: 2.5, intervalDays: 30, reviewCount: 9, lapseCount: 0, nextReviewAt: ISO }
        ]
      })
    );
    expect(result.ok).toBe(true);
    expect(result.data?.schedules).toHaveLength(1);
    expect(result.data?.schedules[0].reviewCount, "保留的是第一条").toBe(1);
  });

  it("没有计划的卡会自动补一条「现在到期」的计划（老数据升级后的行为）", () => {
    const result = attempt(seeded({ cards: [wordCard("c1", "apple", { status: "review" })] }));
    expect(result.ok).toBe(true);
    expect(result.data?.schedules, "缺计划的卡会被补计划").toHaveLength(1);
    expect(result.data?.schedules[0]).toMatchObject({ cardId: "c1", reviewCount: 0, intervalDays: 0 });
  });

  it("schedules 不是数组 → 所有卡都补新计划（原有计划数据丢失）", () => {
    const result = attempt(
      seeded({ cards: [wordCard("c1", "apple")], schedules: { c1: { intervalDays: 99 } } })
    );
    expect(result.ok).toBe(true);
    expect(result.data?.schedules).toHaveLength(1);
    expect(result.data?.schedules[0].intervalDays, "非法形式下的计划数据丢失").toBe(0);
  });
});

describe("MG3c2-3 循环引用与不可序列化输入", () => {
  it("对象里的循环引用不会让 migrateData 抛错", () => {
    const card: Record<string, unknown> = { id: "c1", type: "word", front: "apple", back: "苹果" };
    card.self = card;
    const data: Record<string, unknown> = { schemaVersion: 8, seededWordVersions: ["core-100-v1"], cards: [card] };
    data.loop = data;
    const result = attempt(data);
    expect(result.ok, `循环引用应被安全忽略：${result.error}`).toBe(true);
    expect(result.data?.cards).toHaveLength(1);
    // 迁移结果本身必须可序列化（否则 saveData 会抛，loadData 会整库重置）。
    expect(() => JSON.stringify(result.data)).not.toThrow();
  });

  it("循环引用只在被丢弃的字段里时也不影响", () => {
    const nested: Record<string, unknown> = { a: 1 };
    nested.loop = nested;
    const result = attempt(
      seeded({ cards: [wordCard("c1", "apple", { note: nested, tags: [nested] })] })
    );
    expect(result.ok).toBe(true);
    expect(result.data?.cards[0].note, "非字符串字段被降级为空串").toBe("");
    expect(() => JSON.stringify(result.data)).not.toThrow();
  });

  it("输入本身是字符串但 JSON 坏了 → 抛错（由 loadData 走整库重置）", () => {
    expect(() => parseBackupJson("{ not json")).toThrow();
  });

  it("输入不是可识别的 AppData（没有已知字段）→ 明确抛错，不静默清空", () => {
    for (const value of [{ hello: "world" }, [], 42, "plain text", null]) {
      expect(
        () => migrateData(value),
        `${JSON.stringify(value)} 应被拒绝（否则用户的数据会被静默替换）`
      ).toThrow();
    }
  });

  it("只有 schemaVersion 一个键也算可识别 → 会补种内置核心词", () => {
    const result = attempt({ schemaVersion: 8 });
    expect(result.ok).toBe(true);
    expect(result.data?.seededWordVersions, "没有 seededWordVersions 就会补种").toEqual(["core-100-v1"]);
    expect(result.data?.cards.length, "补种数量等于内置词条数").toBeGreaterThan(0);
  });
});

describe("MG3c2-4 顶层坏字段的降级", () => {
  const topLevelArrays = [
    "units",
    "unitGroups",
    "cards",
    "wordDetails",
    "sentenceDetails",
    "materials",
    "materialSegments",
    "reviews",
    "mistakeGenerations",
    "adventures",
    "huntAttempts",
    "huntResults",
    "grammarLessonsDone",
    "diaryEntries",
    "schedules",
    "dictionaryEntries",
    "seededWordVersions",
    "languageGates",
    "gateAttempts",
    "runeStates"
  ];

  it("每个顶层数组字段被替换成非法类型时，其它字段不受影响", () => {
    for (const key of topLevelArrays) {
      const cards = [wordCard("c1", "apple")];
      const result = attempt(seeded({ cards, units: [], unitGroups: [], [key]: { unexpected: "object" } }));
      expect(result.ok, `${key} 为对象时不该抛错：${result.error}`).toBe(true);
      if (key !== "cards" && key !== "seededWordVersions") {
        expect(result.data?.cards, `${key} 坏掉不该影响 cards`).toHaveLength(1);
      }
      // 关键：坏掉的字段本身要降级成空数组，而不是让整次迁移失败。
      const value = key === "seededWordVersions" ? result.data?.seededWordVersions : (result.data as unknown as Record<string, unknown>)?.[key];
      expect(Array.isArray(value), `${key} 应降级为数组，实际：${JSON.stringify(value)}`).toBe(true);
    }
  });

  it("settings 完全坏掉（字符串 / 数组 / 数字）→ 回落到默认设置，数据不丢", () => {
    for (const value of ["settings", [], 7, null, true]) {
      const result = attempt(seeded({ cards: [wordCard("c1", "apple")], settings: value }));
      expect(result.ok, `settings=${JSON.stringify(value)} 不该抛错`).toBe(true);
      expect(result.data?.settings.dailyNewWords, "应回落到默认值").toBe(10);
      expect(result.data?.cards).toHaveLength(1);
    }
  });

  it("settings 里的数值越界 → 收敛到合法区间", () => {
    const result = attempt(
      seeded({
        settings: { dailyNewWords: -50, dailyReviewLimit: 0, dailySentences: 99999, speechRate: 99 }
      })
    );
    expect(result.ok).toBe(true);
    expect(result.data?.settings.dailyNewWords).toBe(0);
    expect(result.data?.settings.dailyReviewLimit).toBe(1);
    expect(result.data?.settings.speechRate).toBeLessThanOrEqual(1.5);
  });

  it("顶层出现未知键 → 被忽略（不报错，但也不会被保存）", () => {
    const result = attempt(seeded({ cards: [wordCard("c1", "apple")], futureField: { keep: "me" } }));
    expect(result.ok).toBe(true);
    expect(result.data && "futureField" in result.data).toBe(false);
  });

  it("整个输入是超大体积也不会抛错（不触发栈溢出）", () => {
    const cards = Array.from({ length: 5000 }, (_, index) => wordCard(`c${index}`, `word${index}`));
    const result = attempt(seeded({ cards }));
    expect(result.ok).toBe(true);
    expect(result.data?.cards).toHaveLength(5000);
  });
});

describe("MG3c2-5 启动修复报告与实际修复的一致性", () => {
  it("孤儿复习记录会被如实报告", () => {
    const raw = JSON.stringify(
      seeded({
        cards: [wordCard("c1", "apple")],
        reviews: [
          { id: "r1", cardId: "c1", mode: "spelling", rating: 4, answer: "", diffJson: "[]", reviewedAt: ISO },
          { id: "r2", cardId: "ghost", mode: "spelling", rating: 4, answer: "", diffJson: "[]", reviewedAt: ISO }
        ]
      })
    );
    const migrated = parseBackupJson(raw);
    const repairs = summarizeStartupRepairs(raw, migrated);
    expect(repairs.some((item) => item.includes("复习记录"))).toBe(true);
    expect(migrated.reviews).toHaveLength(1);
  });

  it("坏卡片被丢弃时**不会**出现在修复报告里（用户不会知道卡片少了）", () => {
    const raw = JSON.stringify(
      seeded({
        cards: [
          wordCard("c1", "apple"),
          { id: "both-empty", type: "word", front: "", back: "" },
          "not-a-card",
          null
        ]
      })
    );
    const migrated = parseBackupJson(raw);
    const repairs = summarizeStartupRepairs(raw, migrated);
    expect(migrated.cards, "3 条坏记录被丢弃，只剩 1 张好卡").toHaveLength(1);
    expect(
      repairs.some((item) => item.includes("卡片") || item.includes("词")),
      `报告里没有提到卡片被丢弃，实际报告：${JSON.stringify(repairs)}`
    ).toBe(false);
  });

  it("孤儿计划（指向不存在卡片）不会被报告", () => {
    const raw = JSON.stringify(
      seeded({
        cards: [wordCard("c1", "apple")],
        schedules: [{ cardId: "ghost", easeFactor: 2.5, intervalDays: 9, reviewCount: 9, lapseCount: 0, nextReviewAt: ISO }]
      })
    );
    const migrated = parseBackupJson(raw);
    const repairs = summarizeStartupRepairs(raw, migrated);
    expect(migrated.schedules.every((schedule) => schedule.cardId === "c1")).toBe(true);
    expect(repairs.some((item) => item.includes("计划")), `报告：${JSON.stringify(repairs)}`).toBe(false);
  });
});
