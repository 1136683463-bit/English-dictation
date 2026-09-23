// @vitest-environment node
/**
 * MG3b · 老字段回填的行为（2026-09-22）
 *
 * 三处「旧数据回填」逻辑，逐个用真实 `parseBackupJson` 验证：
 *   1. `grammarLessonsDone` → `grammarLessonStagesDone` 补 `[1]`（storage.ts:1013-1023）
 *   2. `seededWordVersions` 缺失 → `seedCoreWords` 补内置核心词（storage.ts:1054-1127）
 *   3. `applyStartupMigration` 里的 `restructureOversizedUnits` + `syncUnitCompletion`
 *
 * 关注点是「老用户升级后，已有的东西会不会被改坏 / 被覆盖 / 被重复灌入」。
 */
import { describe, expect, it } from "vitest";
import { APP_SCHEMA_VERSION, migrateData, parseBackupJson } from "../../services/storage";
import { CORE_100_WORDS_VERSION, CORE_WORDS_PER_UNIT, core100Words } from "../../data/seedWords";
import { deleteUnit } from "../../services/unitService";

const ISO = "2024-01-01T00:00:00.000Z";

const base = (patch: Record<string, unknown> = {}) => ({
  schemaVersion: 0,
  seededWordVersions: [CORE_100_WORDS_VERSION],
  cards: [],
  units: [],
  unitGroups: [],
  ...patch
});

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

describe("MG3b-1 grammarLessonsDone → grammarLessonStagesDone 补 [1]", () => {
  it("旧字段有值、新字段缺失 → 每课补 [1]，旧字段本身保留", () => {
    const out = migrateData(base({ grammarLessonsDone: ["lesson-01-am", "lesson-02-is"] }));
    expect(out.grammarLessonStagesDone, "两课都应补出关 1").toEqual({
      "lesson-01-am": [1],
      "lesson-02-is": [1]
    });
    expect(out.grammarLessonsDone, "旧字段必须保留（回滚与存量消费方还依赖它）").toEqual([
      "lesson-01-am",
      "lesson-02-is"
    ]);
  });

  it("已有关卡进度 [1,2] 不被覆盖：回填只补缺失的 1，不重置已有值", () => {
    const out = migrateData(
      base({
        grammarLessonsDone: ["lesson-01-am"],
        grammarLessonStagesDone: { "lesson-01-am": [1, 2] }
      })
    );
    expect(out.grammarLessonStagesDone?.["lesson-01-am"], "用户已打通的关 2 不能被回填冲掉").toEqual([1, 2]);
  });

  it("[2,3] 且旧字段有该课 → 补 1 后为 [1,2,3]（升序、不重复）", () => {
    const out = migrateData(
      base({
        grammarLessonsDone: ["lesson-01-am"],
        grammarLessonStagesDone: { "lesson-01-am": [3, 2] }
      })
    );
    expect(out.grammarLessonStagesDone?.["lesson-01-am"]).toEqual([1, 2, 3]);
  });

  it("[1] 已存在 → 幂等，结果不变", () => {
    const first = migrateData(
      base({
        grammarLessonsDone: ["lesson-01-am"],
        grammarLessonStagesDone: { "lesson-01-am": [1] }
      })
    );
    const second = migrateData(JSON.parse(JSON.stringify(first)));
    expect(second.grammarLessonStagesDone?.["lesson-01-am"]).toEqual([1]);
    expect(second.grammarLessonStagesDone).toEqual(first.grammarLessonStagesDone);
  });

  it("新字段有课但旧字段没有 → 不反向写入旧字段（不制造假进度）", () => {
    const out = migrateData(base({ grammarLessonsDone: [], grammarLessonStagesDone: { "lesson-05-like": [1] } }));
    expect(out.grammarLessonsDone, "旧字段不能被新字段反推填充").toEqual([]);
    expect(out.grammarLessonStagesDone?.["lesson-05-like"]).toEqual([1]);
  });

  it("旧字段里重复的课只补一次", () => {
    const out = migrateData(base({ grammarLessonsDone: ["lesson-01-am", "lesson-01-am", "lesson-01-am"] }));
    expect(out.grammarLessonStagesDone?.["lesson-01-am"]).toEqual([1]);
  });

  it("旧字段里混入 null / 数字 / 对象 / 空串 / 空白串 → 全部丢弃", () => {
    /**
     * 【已修 2026-09-23】原断言写「空串与空白串**会留下**（未 trim 过滤）」——
     * 那是记录缺陷。现在改用 `asTrimmedStringArray`（trim + 滤空 + 去重），
     * 空串/空白串与 null/数字/对象一样被丢弃。
     */
    const out = migrateData(
      base({ grammarLessonsDone: [null, 42, { id: "x" }, "", "  ", "lesson-01-am"] as unknown[] })
    );
    expect(out.grammarLessonsDone, "只剩有效课 id").toEqual(["lesson-01-am"]);
    expect(out.grammarLessonStagesDone, "不再产生空键").toEqual({ "lesson-01-am": [1] });
  });

  it("FAIL-5【已修 2026-09-23】空串课 id 不再进进度统计", () => {
    /**
     * 修复前：空串/空白串被原样保留（`asStringArray` 只滤非字符串），
     * 随后被写成 `grammarLessonStagesDone` 的无意义键；
     * 而页面侧 `grammarLessonsDone.length` 直接当「已学课数」用
     * （GrammarPathPage.tsx、GrammarLessonPage.tsx），于是进度凭空 +2。
     * 修复：改用 `asTrimmedStringArray`（trim + 滤空 + 去重）。
     */
    const out = migrateData(base({ grammarLessonsDone: ["", "  "], grammarLessonStagesDone: {} }));
    expect(out.grammarLessonStagesDone, "不产生无意义的键").toEqual({});
    expect(out.grammarLessonsDone.length, "空串不算已完成课数").toBe(0);
  });

  it("旧字段不是数组（字符串 / 数字 / 对象）→ 降级为空，不抛错", () => {
    for (const value of ["lesson-01-am", 7, { a: 1 }, null, true]) {
      const out = migrateData(base({ grammarLessonsDone: value }));
      expect(out.grammarLessonsDone, `${JSON.stringify(value)} 应降级为空数组`).toEqual([]);
      expect(out.grammarLessonStagesDone).toEqual({});
    }
  });

  it("关卡序号只认 1/2/3：越界值、小数、字符串数字全部丢弃", () => {
    const out = migrateData(
      base({
        grammarLessonsDone: [],
        grammarLessonStagesDone: {
          "lesson-01-am": [1, 2, 3, 0, 4, 99, -1, 1.5, "2", null]
        }
      })
    );
    expect(out.grammarLessonStagesDone?.["lesson-01-am"]).toEqual([1, 2, 3]);
  });

  it("新字段是数组 / 字符串（旧版本可能写错类型）→ 降级为空对象", () => {
    for (const value of [[1, 2], "lesson-01-am", 5]) {
      const out = migrateData(base({ grammarLessonStagesDone: value }));
      expect(out.grammarLessonStagesDone, `${JSON.stringify(value)} 应降级为 {}`).toEqual({});
    }
  });

  it("关卡完成后「全部掌握」的历史进度不受影响（回填不碰卡片状态）", () => {
    const out = migrateData(
      base({
        cards: [
          wordCard("c1", "apple", { status: "mastered" }),
          wordCard("c2", "pear", { status: "learning" })
        ],
        grammarLessonsDone: ["lesson-01-am"]
      })
    );
    expect(out.cards.find((card) => card.id === "c1")?.status).toBe("mastered");
    expect(out.cards.find((card) => card.id === "c2")?.status).toBe("learning");
  });
});

describe("MG3b-2 seedCoreWords：种子词补种", () => {
  it("seededWordVersions 缺失（老数据）→ 补入内置核心词，并记下版本号", () => {
    const out = migrateData({ schemaVersion: 0, cards: [], wordDetails: [], seededWordVersions: [] });
    expect(out.cards).toHaveLength(core100Words.length);
    expect(out.wordDetails).toHaveLength(core100Words.length);
    expect(out.schedules).toHaveLength(core100Words.length);
    expect(out.seededWordVersions).toEqual([CORE_100_WORDS_VERSION]);
  });

  /**
   * MG3b-2b【2026-09-24 新增】种子词**分本分布**必须正确。
   *
   * ## 为什么要加这条闸
   *
   * 上面那条只断言**总数**（`cards` 长度 == 词表长度），
   * 于是「115 词 vs 5 本（容量 100）」这个错配**逃过了所有测试**：
   * 索引 100-114 的 15 个词分本时越界，被兜底塞进 **Unit 1**——
   * 实测空存储首启后 `core-100-unit-1` 有 **35** 张（应为 20）。
   *
   * 用户可见后果：第 1 本异常长、「第 1-20 个」的描述与实际 35 张不符、
   * 按本推进的节奏在第 1 本就被打乱。**从初始提交起就存在**。
   *
   * ## 这条闸锁什么
   *
   * ① 分布是「每本 ≤ CORE_WORDS_PER_UNIT」——不允许任何一本超容；
   * ② 分本与**下标顺序**一致（第 N 本 = 词表第 (N-1)×20+1 ~ N×20 个）；
   * ③ 描述里的区间与实际卡数一致（防止再出现「描述说 1-20、实际 35」）。
   */
  it("MG3b-2b 种子词分布：每本 ≤ CORE_WORDS_PER_UNIT，且与下标区间一致", () => {
    const out = migrateData({ schemaVersion: 0, cards: [], wordDetails: [], seededWordVersions: [] });

    // ① 每本不得超容
    const byUnit = new Map<string, string[]>();
    for (const card of out.cards) {
      const unitId = card.unitId ?? "<无归属>";
      const list = byUnit.get(unitId) ?? [];
      list.push(card.front);
      byUnit.set(unitId, list);
    }
    for (const [unitId, words] of byUnit) {
      expect(
        words.length,
        `${unitId} 有 ${words.length} 张，超过每本上限 ${CORE_WORDS_PER_UNIT}（分本下标算错？）`
      ).toBeLessThanOrEqual(CORE_WORDS_PER_UNIT);
    }

    // ② 第 N 本装的正是词表第 (N-1)×20+1 ~ N×20 个（逐词核对，不只看数量）
    const offenders: string[] = [];
    for (const [index, seed] of core100Words.entries()) {
      const expectedUnit = `core-100-unit-${Math.floor(index / CORE_WORDS_PER_UNIT) + 1}`;
      const card = out.cards.find((item) => item.front === seed.word.toLowerCase());
      if (!card) {
        offenders.push(`「${seed.word}」（索引 ${index}）没有对应卡片`);
        continue;
      }
      if (card.unitId !== expectedUnit) {
        offenders.push(`「${seed.word}」（索引 ${index}）应在 ${expectedUnit}，实际在 ${card.unitId}`);
      }
    }
    expect(offenders.slice(0, 8), `分本错位：\n${offenders.join("\n")}`).toEqual([]);

    // ③ 描述区间与实际卡数一致
    for (const [unitId, words] of byUnit) {
      const unit = out.units.find((item) => item.id === unitId);
      const match = unit?.description.match(/第 (\d+)-(\d+) 个/);
      expect(match, `${unitId} 的描述应写明词序号区间，实际：${unit?.description}`).toBeTruthy();
      const declared = Number(match![2]) - Number(match![1]) + 1;
      expect(words.length, `${unitId} 描述写「${match![0]}」（${declared} 个）但实际 ${words.length} 张`).toBe(declared);
    }
  });

  it("已有同名单词（含大小写差异 / 前后空格）不会被重复插入", () => {
    // 用真实内置词条做样本（achieve），否则用例是空转的。
    const seedWord = core100Words[0].word;
    const out = migrateData({
      schemaVersion: 0,
      seededWordVersions: [],
      cards: [wordCard("mine", seedWord, { status: "review", priority: true })],
      wordDetails: [{ cardId: "mine", word: `  ${seedWord.toUpperCase()} `, chineseDefinition: "自己写的释义" }]
    });
    const hits = out.cards.filter((card) => card.front.trim().toLowerCase() === seedWord);
    expect(hits, "同名词只能有一张卡，不能重复插入内置卡").toHaveLength(1);
    expect(hits[0].id, "保留用户自己的卡").toBe("mine");
    expect(hits[0].priority, "用户的标星不能被动过").toBe(true);
    expect(out.cards, "总数 = 内置词条数（用户的词占了其中一个名额）").toHaveLength(core100Words.length);
  });

  it("对照 PASS-5：词卡存在但 wordDetails 为空时也不会重复（fillMissingDetails 先补齐了详情）", () => {
    const seedWord = core100Words[0].word;
    const out = migrateData({
      schemaVersion: 0,
      seededWordVersions: [],
      cards: [wordCard("mine", seedWord, { status: "mastered", priority: false })],
      wordDetails: []
    });
    const hits = out.cards.filter((card) => card.front.trim().toLowerCase() === seedWord);
    // seedCoreWords 的 existingWords 取自 wordDetails，而 migrateData 在调它之前
    // 先跑 fillMissingDetails，给每张词卡补了详情 → 用户已有的词能被认出来。
    expect(hits, "用户已有的词卡被正确识别，没有重复插入").toHaveLength(1);
    expect(hits[0].id).toBe("mine");
    expect(out.cards).toHaveLength(core100Words.length);
  });

  it("FAIL-9【已修 2026-09-23】把该词做成了非词卡时，不再重复插入内置词卡", () => {
    /**
     * 修复前：去重集合只用 `wordDetails[].word` 建，而 `fillMissingDetails`
     * 只给 `type === "word"` 的卡补 wordDetails——所以用户把单词做成
     * 句子卡/短语卡时那个词不在集合里，又插一张词卡，同一个词出现两张。
     *
     * 修复：去重集合改为按**卡片 front 归一化**建，且**不限卡类型**
     * （单词做成了句子卡也算「用户已经有这个词」）。
     */
    const seedWord = core100Words[0].word;
    for (const type of ["sentence", "phrase"] as const) {
      const out = migrateData({
        schemaVersion: 0,
        seededWordVersions: [],
        cards: [{ ...wordCard("other", seedWord), type, back: "同类文字的另一张卡" }],
        wordDetails: []
      });
      const hits = out.cards.filter((card) => card.front.trim().toLowerCase() === seedWord);
      expect(hits.map((card) => card.type), `type=${type} 时只保留用户那张`).toEqual([type]);
    }
  });

  it("FAIL-10【已修 2026-09-23】用户卡 front 带句末标点时不再重复插入", () => {
    /**
     * 修复前：字面量比对 (`achieve.` !== `achieve`) → 认不出重复，又插一张。
     * 修复：去重键去掉句末标点（`[.!?]+$`）后再比。
     * 注意只影响「是否补种」，**不改用户卡片内容**——`achieve.` 原样保留。
     */
    const seedWord = core100Words[0].word;
    const out = migrateData({
      schemaVersion: 0,
      seededWordVersions: [],
      cards: [wordCard("mine", `${seedWord}.`)],
      wordDetails: [{ cardId: "mine", word: `${seedWord}.` }]
    });
    const hits = out.cards.filter((card) =>
      card.front.trim().toLowerCase().replace(/[.!?]+$/, "") === seedWord
    );
    expect(hits.map((card) => card.front), "只保留用户那张（内容未被改动）").toEqual([`${seedWord}.`]);
  });

  it("大小写与前后空格差异不算重复（去重已覆盖这两种）", () => {
    const seedWord = core100Words[0].word;
    for (const front of [seedWord.toUpperCase(), ` ${seedWord} `]) {
      const out = migrateData({
        schemaVersion: 0,
        seededWordVersions: [],
        cards: [wordCard("mine", front)],
        wordDetails: [{ cardId: "mine", word: front }]
      });
      const hits = out.cards.filter((card) => card.front.trim().toLowerCase() === seedWord);
      expect(hits, `front=${JSON.stringify(front)} 应识别为已有词`).toHaveLength(1);
      expect(hits[0].id).toBe("mine");
    }
  });

  it("用户的卡属于自建词书时也不会重复插入", () => {
    const seedWord = core100Words[0].word;
    const out = migrateData({
      schemaVersion: 0,
      seededWordVersions: [],
      cards: [wordCard("mine", seedWord, { unitId: "my-unit" })],
      wordDetails: [{ cardId: "mine", word: seedWord }],
      units: [{ id: "my-unit", title: "我的书", description: "", order: 1, color: "#111", createdAt: ISO, updatedAt: ISO }]
    });
    const hits = out.cards.filter((card) => card.front.trim().toLowerCase() === seedWord);
    expect(hits).toHaveLength(1);
    expect(hits[0].unitId, "用户自己的词书归属不能被改").toBe("my-unit");
  });

  it("用户改过的释义与笔记不被覆盖（补种只新增、不改已有）", () => {
    const out = migrateData({
      schemaVersion: 0,
      seededWordVersions: [],
      cards: [wordCard("mine", "achieve", { back: "我自己改的释义", note: "我的手写笔记" })],
      wordDetails: [
        {
          cardId: "mine",
          word: "achieve",
          phonetic: "/我改过/",
          chineseDefinition: "我自己改的释义",
          englishDefinition: "自己写的",
          collocations: "自己写的搭配"
        }
      ]
    });
    const card = out.cards.find((item) => item.front.toLowerCase() === "achieve");
    expect(card?.id).toBe("mine");
    expect(card?.back, "改过的释义不能被内置释义顶掉").toBe("我自己改的释义");
    expect(card?.note, "手写笔记不能被顶掉").toBe("我的手写笔记");
    const details = out.wordDetails.find((item) => item.cardId === "mine");
    expect(details?.phonetic).toBe("/我改过/");
  });

  it("补种只发生一次：带版本号的数据再迁移不会重复插入", () => {
    const first = migrateData({ schemaVersion: 0, seededWordVersions: [], cards: [] });
    const second = migrateData(JSON.parse(JSON.stringify(first)));
    const third = migrateData(JSON.parse(JSON.stringify(second)));
    expect(second.cards).toHaveLength(first.cards.length);
    expect(third.cards).toHaveLength(first.cards.length);
    expect(second.wordDetails).toHaveLength(first.wordDetails.length);
    expect(new Set(third.cards.map((card) => card.id)).size, "卡片 id 不能重复").toBe(third.cards.length);
  });

  it("已记录版本号的老数据不再补种（老用户已有 100 词时的正常路径）", () => {
    const out = migrateData(base({ cards: [wordCard("c1", "自定义词")] }));
    expect(out.cards).toHaveLength(1);
    expect(out.seededWordVersions).toEqual([CORE_100_WORDS_VERSION]);
  });

  it("用户删掉内置核心词卡后不会被重新灌回（版本号还在）", () => {
    const once = migrateData({ schemaVersion: 0, seededWordVersions: [], cards: [] });
    const withoutSeeds = { ...once, cards: once.cards.slice(0, 1), wordDetails: once.wordDetails.slice(0, 1) };
    const again = migrateData(withoutSeeds);
    expect(again.cards).toHaveLength(1);
  });

  it("补种词卡的 unitId 落在内置词书上（不会变成无书散卡）", () => {
    const out = migrateData({ schemaVersion: 0, seededWordVersions: [], cards: [] });
    const orphan = out.cards.filter((card) => !card.unitId);
    expect(orphan, "补种词卡必须都属于某一本内置词书").toEqual([]);
  });

  /**
   * 【2026-09-24 修】这两条原先是「记录已知缺陷」，缺陷已修，改为断言正确行为。
   *
   * 修前实测（当时是**正确的记录**）：
   *  - `core-100-unit-1` 装 **35** 条（20 本容量 + 15 越界兜底）；
   *  - `unit1.description` 写「第 1-20 个」，与实际 35 条**对不上**。
   *
   * 根因见 `storage.ts` 的 `seedCoreWords`：`createCoreUnits` 写死建 5 本
   * （20×5=100），而 `core100Words` 有 **115** 条 ⇒ 索引 100-114 越界
   * （`seededUnits[5]` 为 undefined），被 `?? seededUnits[0]` 兜回第 1 本。
   *
   * 修法：本数由 `core100Words.length / CORE_WORDS_PER_UNIT` 推导（⇒ 6 本），
   * 分本下标按 `core-100-unit-N` **按名取本**（不再依赖数组下标，避免
   * 「用户删掉某本后被删本之后的词全体前移一位」）。
   */
  it("【已修】补种词卡的 unitId 分布：每本 ≤ CORE_WORDS_PER_UNIT，末本装余数", () => {
    const out = migrateData({ schemaVersion: 0, seededWordVersions: [], cards: [] });
    const counts = new Map<string, number>();
    for (const card of out.cards) {
      counts.set(card.unitId ?? "<无>", (counts.get(card.unitId ?? "<无>") ?? 0) + 1);
    }
    expect([...counts.values()].reduce((sum, value) => sum + value, 0)).toBe(core100Words.length);

    // 115 条 / 每本 20 ⇒ 6 本，前 5 本各 20、末本 15
    const expectedUnits = Math.ceil(core100Words.length / CORE_WORDS_PER_UNIT);
    for (let index = 1; index <= expectedUnits; index += 1) {
      const count = counts.get(`core-100-unit-${index}`) ?? 0;
      expect(count, `core-100-unit-${index} 应有卡且不超过每本上限`).toBeGreaterThan(0);
      expect(count, `core-100-unit-${index} 超过每本上限`).toBeLessThanOrEqual(CORE_WORDS_PER_UNIT);
    }
    expect(counts.get("core-100-unit-1"), "第 1 本应恰好装满（不再吃越界的 15 条）").toBe(CORE_WORDS_PER_UNIT);
    expect(counts.get(`core-100-unit-${expectedUnits}`), "末本应装余数").toBe(core100Words.length % CORE_WORDS_PER_UNIT);
  });

  it("【已修】内置词书的说明文案与实际条数一致（第 1 本写 1-20，实际也是 20）", () => {
    const out = migrateData({ schemaVersion: 0, seededWordVersions: [], cards: [] });
    const unit1 = out.units.find((unit) => unit.id === "core-100-unit-1");
    const count = out.cards.filter((card) => card.unitId === "core-100-unit-1").length;
    expect(unit1?.description).toContain("1-20");
    expect(count, "描述写 1-20，实际卡数必须也是 20").toBe(CORE_WORDS_PER_UNIT);
  });

  it("补种不会动用户已有的复习计划与复习记录", () => {
    const out = migrateData({
      schemaVersion: 0,
      seededWordVersions: [],
      cards: [wordCard("c1", "自定义词")],
      schedules: [
        { cardId: "c1", easeFactor: 2.3, intervalDays: 9, reviewCount: 4, lapseCount: 2, nextReviewAt: ISO }
      ],
      reviews: [{ id: "r1", cardId: "c1", mode: "spelling", rating: 4, answer: "", diffJson: "[]", reviewedAt: ISO }]
    });
    const schedule = out.schedules.find((item) => item.cardId === "c1");
    expect(schedule, "用户自己的计划必须还在").toBeTruthy();
    expect(schedule, "复习次数不能被重置").toMatchObject({ intervalDays: 9, reviewCount: 4, lapseCount: 2, easeFactor: 2.3 });
    expect(out.reviews).toHaveLength(1);
  });

  it("补种词卡不会被记成已掌握或已标星", () => {
    const out = migrateData({ schemaVersion: 0, seededWordVersions: [], cards: [] });
    expect(out.cards.every((card) => card.status === "new")).toBe(true);
    expect(out.cards.every((card) => card.priority === false)).toBe(true);
  });

  it("用户删掉内置词书后会被重新建出来（词书无法真正删除）", () => {
    const once = migrateData({ schemaVersion: 0, seededWordVersions: [], cards: [] });
    const withoutUnit = { ...once, units: once.units.filter((unit) => unit.id !== "core-100-unit-1") };
    const again = migrateData(withoutUnit);
    expect(
      again.units.some((unit) => unit.id === "core-100-unit-1"),
      "用户删过的内置词书在下次迁移后重新出现"
    ).toBe(true);
  });

  it("【语义收紧 2026-09-23】无归属的用户词卡保持未分配", () => {
    /**
     * 原断言是「自动归入第 1 本内置词书」——那是 FAIL-8 记录的缺陷：
     * 「未分配」是被正式支持的合法状态（`deleteUnit` 删书后卡片就变成未分配，
     * 界面上有「收纳未分配词（N）」入口与未分配词列表），自动回填会让
     * 用户刚删完、重启又回来，与那条 UX 直接冲突。
     */
    const cards = [0, 1, 2].map((index) => wordCard(`mine${index}`, `myword${index}`, { unitId: undefined }));
    const out = migrateData(base({ cards }));
    expect(out.cards.map((card) => card.unitId), "保持未分配").toEqual([undefined, undefined, undefined]);
  });

  it("已属于自定义词书的卡片不会被改归属", () => {
    const cards = [wordCard("mine", "myword", { unitId: "my-unit" })];
    const units = [
      { id: "my-unit", title: "我的词书", description: "", order: 1, color: "#111", createdAt: ISO, updatedAt: ISO }
    ];
    const out = migrateData(base({ cards, units }));
    expect(out.cards.find((card) => card.id === "mine")?.unitId).toBe("my-unit");
  });
});

describe("MG3b-3 applyStartupMigration：单元结构", () => {
  it("超过 200 条的书会被拆开，卡片状态与复习计划原样跟随", () => {
    const cards = Array.from({ length: 250 }, (_, index) =>
      wordCard(`c${index}`, `word${index}`, {
        unitId: "big",
        status: index < 100 ? "mastered" : "review",
        createdAt: `2024-01-01T00:00:${String(index % 60).padStart(2, "0")}.000Z`
      })
    );
    const units = [
      { id: "big", title: "我的大书", description: "", order: 1, color: "#111", createdAt: ISO, updatedAt: ISO }
    ];
    const out = parseBackupJson(JSON.stringify(base({ cards, units })));
    const bookUnits = out.units.filter((unit) => unit.title.startsWith("我的大书"));
    expect(bookUnits.length, "250 条应拆成 2 本").toBe(2);
    expect(out.cards.filter((card) => card.status === "mastered"), "已掌握状态不能在拆分中丢失").toHaveLength(100);
    expect(out.schedules.filter((schedule) => schedule.cardId.startsWith("c")), "每张卡的复习计划都还在").toHaveLength(250);
    const ids = new Set(out.cards.map((card) => card.id));
    expect(ids.size, "拆分不能复制或丢失卡片").toBe(250);
  });

  it("正好 200 条的书不拆（阈值是「超过 200」）", () => {
    const cards = Array.from({ length: 200 }, (_, index) => wordCard(`c${index}`, `word${index}`, { unitId: "u" }));
    const units = [{ id: "u", title: "恰好一本", description: "", order: 1, color: "#111", createdAt: ISO, updatedAt: ISO }];
    const out = parseBackupJson(JSON.stringify(base({ cards, units })));
    expect(out.units.filter((unit) => unit.title.startsWith("恰好一本"))).toHaveLength(1);
  });

  it("拆分后每本都不超过 200 条（再迁一次不再拆）", () => {
    const cards = Array.from({ length: 401 }, (_, index) => wordCard(`c${index}`, `word${index}`, { unitId: "u" }));
    const units = [{ id: "u", title: "很大一本", description: "", order: 1, color: "#111", createdAt: ISO, updatedAt: ISO }];
    const first = parseBackupJson(JSON.stringify(base({ cards, units })));
    const grouped = new Map<string, number>();
    for (const card of first.cards) grouped.set(card.unitId ?? "", (grouped.get(card.unitId ?? "") ?? 0) + 1);
    for (const [unitId, count] of grouped) expect(count, `${unitId} 超过 200 条`).toBeLessThanOrEqual(200);
    const second = parseBackupJson(JSON.stringify(first));
    expect(second.units.filter((unit) => unit.title.startsWith("很大一本")).length).toBe(3);
  });

  it("FAIL-2【已修 2026-09-23】拆分后完成时间保留原值（不改写成迁移时刻）", () => {
    const cards = Array.from({ length: 250 }, (_, index) =>
      wordCard(`c${index}`, `word${index}`, { unitId: "big", status: "mastered" })
    );
    const units = [
      {
        id: "big",
        title: "已通读的书",
        description: "",
        order: 1,
        color: "#111",
        completedAt: "2024-05-05T00:00:00.000Z",
        createdAt: ISO,
        updatedAt: ISO
      }
    ];
    const out = parseBackupJson(JSON.stringify(base({ cards, units })));
    const books = out.units.filter((unit) => unit.title.startsWith("已通读的书"));
    expect(books.length, "拆成两块").toBe(2);
    /**
     * 【已修 2026-09-23】修复前：`restructureOversizedUnits` 先把 completedAt 清成 undefined，
     * 随后的 `syncUnitCompletion` 发现「全掌握」又补上**当前时刻** →
     * 用户 2024-05-05 学完的书，完成时间被改写成「今天」。
     * 修复：拆分时第 1 块**继承原 completedAt**（拆分只是存储结构变化，
     * 不该改写「这本书什么时候被学完」这个历史事实）。
     */
    expect(books[0].completedAt, "第 1 块保留原完成时间").toBe("2024-05-05T00:00:00.000Z");
    // 第 2 块是拆分产物，不承接完成态（见 FAIL-3：它不算「独立读完的一本」）
    expect(books[1].completedAt, "第 2 块不带完成时间").toBeUndefined();
  });

  it("FAIL-3【已修 2026-09-23】拆分不放大「已完成词书数」（仍是 1 本）", () => {
    const cards = Array.from({ length: 250 }, (_, index) =>
      wordCard(`c${index}`, `word${index}`, { unitId: "big", status: "mastered" })
    );
    const units = [
      {
        id: "big",
        title: "已通读的书",
        description: "",
        order: 1,
        color: "#111",
        completedAt: "2024-05-05T00:00:00.000Z",
        createdAt: ISO,
        updatedAt: ISO
      }
    ];
    const input = base({ cards, units });
    expect(
      (input.units as Array<{ completedAt?: string }>).filter((unit) => unit.completedAt).length,
      "迁移前：1 本已完成"
    ).toBe(1);
    const out = parseBackupJson(JSON.stringify(input));
    // milestoneService.computeMilestoneStates 用 `units.filter(unit => Boolean(unit.completedAt)).length`
    // 作为「已完成本数」——拆一本成两本，这个数就被动翻倍。
    /**
     * 【已修 2026-09-23】修复前：拆出的新块因「卡仍全掌握」被 `syncUnitCompletion`
     * 补上 completedAt → 已完成本数从 1 翻成 2，里程碑数字被凭空放大
     * （用户什么都没做，成就数字却涨了）。
     * 修复：拆分产出块由 `applyStartupMigration` 在 `syncUnitCompletion` 之后
     * 按清单剔除完成态——拆分只是存储结构变化，不构成「独立读完的一本」。
     */
    expect(
      out.units.filter((unit) => Boolean(unit.completedAt)).length,
      "仍只有 1 本已完成（不因拆分而放大）"
    ).toBe(1);
  });

  it("FAIL-4【已修 2026-09-23】速通徽标稳定在两本（不随学习推进蔓延）", () => {
    // 老数据：没有 seededWordVersions → 首次迁移补种 115 张内置词卡到 5 本内置词书。
    let json = JSON.stringify({ schemaVersion: 0, seededWordVersions: [], cards: [], units: [], unitGroups: [] });
    const badgeCounts: number[] = [];
    for (let step = 0; step < 5; step += 1) {
      const data = parseBackupJson(json);
      badgeCounts.push(data.units.filter((unit) => unit.speedRun).length);
      // 用户只做一件事：开始学下一本内置词书的第一个词。
      const targetUnit = `core-100-unit-${step + 1}`;
      const first = data.cards.find((card) => card.unitId === targetUnit);
      if (!first) break;
      json = JSON.stringify({
        ...data,
        cards: data.cards.map((card) =>
          card.id === first.id ? { ...card, status: "learning" as const } : card
        )
      });
    }
    /**
     * 【已修 2026-09-23】
     * 修复前：`applySpeedRunMarks` 每次按「**当前**前 N 本未启动的书」重挑徽标，
     * 且对未启动的书**两向都改**（该加的加、不该有的摘）。
     * 用户每开始学一本，它就从「未启动」集合退出、后面的书立刻补位：
     * 实测 2 → 3 → 4 → 5 → 5，最终 5 本全标着「3天速通」——
     * 「速通」这个起点承诺被稀释到没有意义。
     *
     * 修复：**只加不摘**。徽标一旦发出就保留（已带徽标又学起来的书，那是它应得的）；
     * 补位只发生在「已发出的不足 N」时。于是数量恒为 2，不随学习推进增长。
     */
    expect(badgeCounts, "徽标数量恒为 2（起点承诺，不随学习蔓延）").toEqual([2, 2, 2, 2, 2]);
  });

  it("对照 PASS-2：非全掌握的书被拆分后不会获得完成时间", () => {
    const cards = Array.from({ length: 250 }, (_, index) =>
      wordCard(`c${index}`, `word${index}`, { unitId: "big", status: "review" })
    );
    const units = [
      { id: "big", title: "没读完的书", description: "", order: 1, color: "#111", createdAt: ISO, updatedAt: ISO }
    ];
    const out = parseBackupJson(JSON.stringify(base({ cards, units })));
    for (const book of out.units.filter((unit) => unit.title.startsWith("没读完的书"))) {
      expect(book.completedAt).toBeUndefined();
    }
  });

  it("未启动的书会被标上速通标记，已启动的书不会", () => {
    const units = [0, 1, 2].map((index) => ({
      id: `u${index}`,
      title: `我的第 ${index + 1} 本`,
      description: "",
      order: index + 1,
      color: "#111",
      createdAt: ISO,
      updatedAt: ISO
    }));
    const cards = [0, 1, 2].map((index) =>
      wordCard(`c${index}`, `w${index}`, { unitId: `u${index}`, status: index === 2 ? "review" : "new" })
    );
    const out = parseBackupJson(JSON.stringify(base({ units, cards })));
    const byId = new Map(out.units.map((unit) => [unit.id, unit]));
    expect(byId.get("u0")?.speedRun, "完全没碰过的书算速通本").toBe(true);
    expect(byId.get("u1")?.speedRun).toBe(true);
    expect(byId.get("u2")?.speedRun, "已经学过的书不会带徽标（值为 undefined 而非 false）").toBeUndefined();
  });

  it("拆分出的书继承了原书的分组与配色（用户的分组不被拆散）", () => {
    const cards = Array.from({ length: 250 }, (_, index) => wordCard(`c${index}`, `word${index}`, { unitId: "big" }));
    const units = [
      {
        id: "big",
        title: "分组里的书",
        description: "",
        order: 1,
        color: "#123456",
        groupId: "g1",
        createdAt: ISO,
        updatedAt: ISO
      }
    ];
    const unitGroups = [
      { id: "g1", title: "我的分组", color: "#111", order: 1, createdAt: ISO, updatedAt: ISO }
    ];
    const out = parseBackupJson(JSON.stringify(base({ cards, units, unitGroups })));
    const books = out.units.filter((unit) => unit.title.startsWith("分组里的书"));
    expect(books).toHaveLength(2);
    for (const book of books) {
      expect(book.groupId, "拆分后的两本都应留在用户的分组里").toBe("g1");
      expect(book.color).toBe("#123456");
    }
  });

  it("用户自建的同名分组不影响内置分组建立（两者按 id 独立共存）", () => {
    /**
     * 【语义收紧 2026-09-23】原断言是「同名分组只应存在一个」——
     * 它把「按标题去重」当成了正确行为，但这正是 FAIL-6 的根因：
     * 内置 `group-core-100` 因标题被占用而**不建立**，
     * 而 5 本内置词书的 `groupId` 写死指向它 → 悬空引用，内置书掉出分组。
     *
     * 界面上分组是按 **id** 关联、按标题展示的（UnitsPage: `groupId === group.id`），
     * 所以两个同名分组会各自成为一个独立分组、都显示「核心100」——
     * 这正是用户预期的（「我也有个核心100」不该挤掉系统那个）。
     */
    const unitGroups = [
      { id: "my-group", title: "核心100", color: "#aaa", order: 1, createdAt: ISO, updatedAt: ISO }
    ];
    const out = parseBackupJson(JSON.stringify(base({ unitGroups })));
    const named = out.unitGroups.filter((group) => group.title.trim() === "核心100");
    expect(named, "用户自建 + 内置，两个实体各自存在").toHaveLength(2);
    expect(
      named.map((group) => group.id).sort(),
      "分别是自建与内置（id 不同）"
    ).toEqual(["group-core-100", "my-group"]);
  });

  it("FAIL-6【已修 2026-09-23】用户自建同名分组时，内置词书不再悬空引用", () => {
    const unitGroups = [
      { id: "my-group", title: "核心100", color: "#aaa", order: 1, createdAt: ISO, updatedAt: ISO }
    ];
    const out = parseBackupJson(JSON.stringify(base({ unitGroups })));
    const knownGroupIds = new Set(out.unitGroups.map((group) => group.id));
    // mergeUnitGroups 只按**标题**去重，跳过了内置分组 group-core-100；
    // 而 createCoreUnits 写死了 groupId: "group-core-100" → 悬空引用。
    /**
     * 【已修 2026-09-23】修复前：内置 `group-core-100` 因「标题已被占用」而没被建立，
     * 但 `createCoreUnits` 写死了 `groupId: "group-core-100"` → 5 本内置书全悬空。
     * 修复：分组去重改为**按 id**（用户自建同名分组是两个不同实体，不该挤掉内置组）。
     */
    const dangling = out.units.filter((unit) => unit.groupId && !knownGroupIds.has(unit.groupId));
    expect(dangling.map((unit) => unit.id), "不再有悬空引用").toEqual([]);
    expect(
      out.unitGroups.map((group) => group.id).sort(),
      "内置分组与用户自建分组各自存在"
    ).toEqual(["group-adventure-accumulation", "group-core-100", "my-group"]);
    // 「冒险积累」走的是另一条路：按标题反查分组 id，于是把内置书挂进了内置分组（符合预期）。
    expect(out.units.find((unit) => unit.id === "unit-adventure-accumulation")?.groupId).toBe(
      "group-adventure-accumulation"
    );
  });

  it("FAIL-7【已修 2026-09-23】用户删掉的内置词书不再复活（tombstone 生效）", () => {
    // 老数据：无 seededWordVersions，用户有 30 张自建词卡（首次迁移会被扫进 unit-1）。
    const cards = Array.from({ length: 30 }, (_, index) =>
      wordCard(`mine${index}`, `mine${index}`, { status: "mastered" })
    );
    const first = parseBackupJson(JSON.stringify(base({ cards, seededWordVersions: [] })));
    /**
     * 首访后归入 unit-1 的是**内置核心词的前若干张**（不含用户的 30 张自建卡）。
     *
     * 2026-09-23 两次修复叠加后的口径：
     *  · 归一化顺序修好 → 内置卡首访即归位（不再等第二次迁移）；
     *  · FAIL-8 修好 → 用户的散卡**保持未分配**，不再被扫进 unit-1
     *    （「未分配」是被正式支持的合法状态，界面有「收纳未分配词」入口）。
     * 所以这里是 5 张内置核心词，而不是早期版本的 5 或误算的 55。
     */
    const builtinInUnit1 = first.cards.filter(
      (card) => card.unitId === "core-100-unit-1" && /^[a-z]+$/.test(card.front)
    );
    expect(builtinInUnit1.length, "unit-1 里是内置核心词（用户散卡未被扫入）").toBeGreaterThan(0);
    expect(
      first.cards.filter((card) => card.front.startsWith("mine") && card.unitId),
      "用户的 30 张自建卡保持未分配"
    ).toHaveLength(0);

    // 用户删掉「核心100 - Unit 1」与同名分组（UI 上确认对话框写的是「删除后 10 秒内可撤销」）。
    const removed = {
      ...first,
      units: first.units.filter((unit) => unit.id !== "core-100-unit-1"),
      unitGroups: first.unitGroups.filter((group) => group.id !== "group-core-100")
    };
    const detached = deleteUnit(removed, "core-100-unit-1");
    expect(detached.units.some((unit) => unit.id === "core-100-unit-1")).toBe(false);
    expect(detached.cards.filter((card) => !card.unitId).length, "删书后卡片变成未分配").toBeGreaterThan(0);

    /**
     * 【已修 2026-09-23】下次迁移（任何一次 saveData / 启动）
     * → `ensureDefaultUnits` 见到 tombstone，**不再补回**这本书。
     *
     * 修复前：内置书由「id 不存在就补」的规则维护，用户删了下次启动就复活，
     * 书里的卡片也被重新归位——删除形同虚设。
     * 修复：`deleteUnit` 对内置书记删除标记（`deletedBuiltinUnitIds`），
     * `seedCoreWords` / `ensureDefaultUnits` 均尊重它；撤销删除时撤掉标记。
     */
    const again = parseBackupJson(JSON.stringify(detached));
    expect(again.units.some((unit) => unit.id === "core-100-unit-1"), "删掉的内置词书不再复活").toBe(false);
    expect(
      again.cards.filter((card) => card.unitId === "core-100-unit-1").length,
      "也没有卡片被塞回这本已删的书"
    ).toBe(0);
    // 卡片本身的进度不受影响（这条一直是好的）。
    expect(again.cards.find((card) => card.id === "mine0")?.status).toBe("mastered");
    // 删除标记被持久化，供后续启动继续遵守
    expect(again.deletedBuiltinUnitIds, "删除标记已落盘").toEqual(["core-100-unit-1"]);
  });

  it("FAIL-8【已修 2026-09-23】无归属的用户词卡保持未分配（不塞进内置书）", () => {
    const cards = [0, 1, 2].map((index) =>
      wordCard(`mine${index}`, `myword${index}`, { unitId: undefined, tags: ["文件导入"] })
    );
    const out = parseBackupJson(JSON.stringify(base({ cards })));
    expect(
      out.cards.map((card) => card.unitId),
      "用户导入的散卡保持未分配"
    ).toEqual([undefined, undefined, undefined]);
    // 内置词书本身照常建立（只是不再吸纳用户的散卡）
    expect(out.units.some((unit) => unit.id === "core-100-unit-1"), "内置词书仍在").toBe(true);
  });

  it("【语义收紧 2026-09-23】大量散卡不被扫进内置书，故不触发拆分", () => {
    /**
     * 原断言是「500 张散卡被扫进第 1 本 → 把它撑到触发拆分，拆出的书仍挂着内置标题」——
     * 那记录的是 FAIL-8 的连锁后果：用户导入的 500 个词被塞进「核心100」，
     * 还把它拆成了三本名字都带「核心100」的书，用户完全找不到自己的词。
     * 现在散卡保持未分配，内置书数量不变、也不被撑爆。
     */
    const cards = Array.from({ length: 500 }, (_, index) =>
      wordCard(`x${index}`, `custom${index}`, { unitId: undefined })
    );
    const out = parseBackupJson(JSON.stringify(base({ cards })));
    expect(
      out.cards.every((card) => card.unitId === undefined),
      "500 张散卡保持未分配"
    ).toBe(true);
    const titles = out.units.filter((unit) => unit.title.startsWith("核心100 - Unit 1")).map((unit) => unit.title);
    expect(titles, "第 1 本未被撑爆拆分").toEqual(["核心100 - Unit 1"]);
    expect(out.cards, "卡片一张不少").toHaveLength(500);
  });

  it("冒险积累词书不参与拆分（它按用途持续吸纳）", () => {
    const cards = Array.from({ length: 300 }, (_, index) =>
      wordCard(`c${index}`, `word${index}`, { unitId: "unit-adventure-accumulation" })
    );
    const units = [
      {
        id: "unit-adventure-accumulation",
        title: "冒险积累",
        description: "",
        order: 1,
        color: "#177e78",
        createdAt: ISO,
        updatedAt: ISO
      }
    ];
    const out = parseBackupJson(JSON.stringify(base({ cards, units })));
    expect(out.units.filter((unit) => unit.title.startsWith("冒险积累"))).toHaveLength(1);
    expect(out.units[0].id).toBe("unit-adventure-accumulation");
  });

  it("卡片的时间顺序决定拆分归属：最早的一批留在原书 id 上", () => {
    const cards = Array.from({ length: 210 }, (_, index) =>
      wordCard(`c${String(index).padStart(3, "0")}`, `word${String(index).padStart(3, "0")}`, {
        unitId: "big",
        createdAt: `2024-01-01T00:00:${String(index % 60).padStart(2, "0")}.000Z`
      })
    );
    const units = [{ id: "big", title: "书", description: "", order: 1, color: "#111", createdAt: ISO, updatedAt: ISO }];
    const out = parseBackupJson(JSON.stringify(base({ cards, units })));
    const kept = out.cards.filter((card) => card.unitId === "big").length;
    expect(kept, "第一块留在原 id 上").toBe(105);
    expect(out.units.find((unit) => unit.id === "big")?.title).toBe("书 · 1");
  });

  it("卡片排序键相同时（同一时间戳）拆分仍不丢卡", () => {
    const cards = Array.from({ length: 250 }, (_, index) => wordCard(`c${index}`, `word${index}`, { unitId: "big" }));
    const units = [{ id: "big", title: "同刻书", description: "", order: 1, color: "#111", createdAt: ISO, updatedAt: ISO }];
    const out = parseBackupJson(JSON.stringify(base({ cards, units })));
    expect(new Set(out.cards.map((card) => card.id)).size).toBe(250);
  });

  it("词书里的词全部掌握后会被打上完成时间，未全掌握则不留完成时间", () => {
    const cards = [
      wordCard("c1", "a", { unitId: "u1", status: "mastered" }),
      wordCard("c2", "b", { unitId: "u1", status: "mastered" }),
      wordCard("c3", "c", { unitId: "u2", status: "mastered" }),
      wordCard("c4", "d", { unitId: "u2", status: "review" })
    ];
    const units = ["u1", "u2"].map((id, index) => ({
      id,
      title: `书${index + 1}`,
      description: "",
      order: index + 1,
      color: "#111",
      createdAt: ISO,
      updatedAt: ISO
    }));
    const out = parseBackupJson(JSON.stringify(base({ cards, units })));
    const byId = new Map(out.units.map((unit) => [unit.id, unit]));
    expect(Boolean(byId.get("u1")?.completedAt), "全掌握的书应打上完成时间").toBe(true);
    expect(byId.get("u2")?.completedAt, "还有没掌握的卡，不该有完成时间").toBeUndefined();
  });

  it("空书不会被当成「全掌握」而误打完成时间", () => {
    const units = [{ id: "empty", title: "空书", description: "", order: 1, color: "#111", createdAt: ISO, updatedAt: ISO }];
    const out = parseBackupJson(JSON.stringify(base({ units })));
    expect(out.units.find((unit) => unit.id === "empty")?.completedAt).toBeUndefined();
  });

  it("原来有完成时间、后来有卡退回未掌握时完成时间被清掉", () => {
    const cards = [wordCard("c1", "a", { unitId: "u1", status: "learning" })];
    const units = [
      {
        id: "u1",
        title: "书",
        description: "",
        order: 1,
        color: "#111",
        completedAt: "2024-05-05T00:00:00.000Z",
        createdAt: ISO,
        updatedAt: ISO
      }
    ];
    const out = parseBackupJson(JSON.stringify(base({ cards, units })));
    expect(out.units[0].completedAt, "不再全掌握后完成时间必须清掉").toBeUndefined();
  });

  it("非词卡（句子卡）不参与词书完成度判定", () => {
    const cards = [
      wordCard("c1", "a", { unitId: "u1", status: "mastered" }),
      { ...wordCard("c2", "sentence", { unitId: "u1" }), type: "sentence", status: "new" }
    ];
    const units = [{ id: "u1", title: "书", description: "", order: 1, color: "#111", createdAt: ISO, updatedAt: ISO }];
    const out = parseBackupJson(JSON.stringify(base({ cards, units })));
    expect(Boolean(out.units[0].completedAt), "句子卡不该拖住词书的完成判定").toBe(true);
  });

  it("老数据里没有 unitGroups 字段 → 补出内置分组，用户数据不丢", () => {
    const out = migrateData({ schemaVersion: 0, cards: [wordCard("c1", "自定义词")], seededWordVersions: [] });
    expect(out.unitGroups.map((group) => group.title)).toEqual(["核心100", "冒险积累"]);
    expect(out.cards.some((card) => card.id === "c1")).toBe(true);
  });

  it("迁移后的数据带当前版本号", () => {
    const out = migrateData(base({}));
    expect(out.schemaVersion).toBe(APP_SCHEMA_VERSION);
  });
});
