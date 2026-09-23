// @vitest-environment node
/**
 * MG3c · 多次迁移的幂等性 + 往返稳定性（2026-09-22）
 *
 * 关键前提：`AppContext.commitData` 每次更新都会 `saveData`（读 → `migrateData` → 写回），
 * `loadData` 每次启动也会迁移一遍并写回。所以「迁移不是一次性事件」——
 * 只要有一处不幂等，就会变成「每打开一次应用 / 每做一次操作，数据就被改一次」。
 *
 * 本文件对多份真实形态的数据连续迁移 3 次，逐字节比对 `JSON.stringify`。
 *
 * 命名约定（沿用 jd10-defects）：FAIL-<编号> = 已确认缺陷；PASS-<编号> = 验证过没问题的方向。
 * 每条 FAIL 的断言写成「缺陷仍然存在」，修好之后会失败，正好提醒把断言翻过来。
 */
import { describe, expect, it } from "vitest";
import { parseBackupJson } from "../../services/storage";
import { core100Words } from "../../data/seedWords";

const ISO = "2024-01-01T00:00:00.000Z";
const PAST = "2024-06-01T00:00:00.000Z";

interface PassResult {
  /** 每一次迁移后的 JSON 字符串（第 0 项是入参本身）。 */
  snapshots: string[];
  /** 逐次比对的差异字段路径。 */
  diffs: string[][];
}

/**
 * 递归比较两份 JSON 值，返回紧凑的差异描述。
 * 数组按「元素身份」对齐（优先用 id 键），这样同一次变化不会因为数组整体位移而刷屏。
 * 值过长时截断，保证测试输出可读。
 */
const trim = (value: unknown, max = 60): string => {
  const text = JSON.stringify(value) ?? "undefined";
  return text.length > max ? `${text.slice(0, max)}…` : text;
};

const identityOf = (value: unknown): string => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    for (const key of ["id", "cardId", "lessonId", "runeId", "caseId"]) {
      if (typeof record[key] === "string") return `${key}=${record[key] as string}`;
    }
  }
  return "";
};

const deepDiff = (a: unknown, b: unknown, path = "$", out: string[] = []): string[] => {
  if (a === b) return out;
  if (Array.isArray(a) || Array.isArray(b)) {
    const left = Array.isArray(a) ? a : [];
    const right = Array.isArray(b) ? b : [];
    if (left.length !== right.length) out.push(`${path}: 条数 ${left.length} -> ${right.length}`);
    const sameOrder = left.length === right.length && left.every((item, index) => identityOf(item) === identityOf(right[index]));
    if (sameOrder) {
      for (let index = 0; index < left.length; index += 1) {
        deepDiff(left[index], right[index], `${path}[${identityOf(left[index]) || index}]`, out);
      }
      return out;
    }
    const leftMap = new Map(left.map((item, index) => [identityOf(item) || `#${index}`, item]));
    const rightMap = new Map(right.map((item, index) => [identityOf(item) || `#${index}`, item]));
    for (const [key, value] of leftMap) {
      if (!rightMap.has(key)) out.push(`${path}: 少了一项 ${key}`);
      else deepDiff(value, rightMap.get(key), `${path}[${key}]`, out);
    }
    for (const key of rightMap.keys()) if (!leftMap.has(key)) out.push(`${path}: 多了一项 ${key}`);
    if ([...leftMap.keys()].join(",") !== [...rightMap.keys()].join(",")) {
      out.push(`${path}: 顺序变化（${leftMap.size} 项）`);
    }
    return out;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    const keys = new Set([...Object.keys(a as object), ...Object.keys(b as object)]);
    for (const key of keys) {
      const left = (a as Record<string, unknown>)[key];
      const right = (b as Record<string, unknown>)[key];
      if (left === right) continue;
      if (
        left &&
        right &&
        typeof left === "object" &&
        typeof right === "object" &&
        (!Array.isArray(left) || !Array.isArray(right))
      ) {
        deepDiff(left, right, `${path}.${key}`, out);
      } else if (JSON.stringify(left) !== JSON.stringify(right)) {
        out.push(`${path}.${key}: ${trim(left)} -> ${trim(right)}`);
      }
    }
    return out;
  }
  out.push(`${path}: ${trim(a)} -> ${trim(b)}`);
  return out;
};

/** 连续迁移 `passes` 次，返回每次的快照与逐次差异。 */
const migratePasses = (input: string, passes = 3): PassResult => {
  const snapshots = [input];
  let current = input;
  for (let index = 0; index < passes; index += 1) {
    current = JSON.stringify(parseBackupJson(current));
    snapshots.push(current);
  }
  const diffs: string[][] = [];
  for (let index = 1; index < snapshots.length; index += 1) {
    diffs.push(deepDiff(JSON.parse(snapshots[index - 1]), JSON.parse(snapshots[index])));
  }
  return { snapshots, diffs };
};

const legacyWordCard = (id: string, front: string, patch: Record<string, unknown> = {}) => ({
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

const wordCardAt = (id: string, front: string, createdAt: string, patch: Record<string, unknown> = {}) =>
  legacyWordCard(id, front, { createdAt, ...patch });

describe("MG3c-1 三次迁移的逐字节一致性", () => {
  const cases: Array<{ name: string; input: () => string; expectStableFrom?: number }> = [
    {
      name: "最早版本（无 schemaVersion、无 seededWordVersions、字段最少）",
      input: () => JSON.stringify({ cards: [legacyWordCard("c1", "apple")] })
    },
    {
      name: "最早版本 + 已学课程（触发双写回填）",
      input: () => JSON.stringify({ cards: [legacyWordCard("c1", "apple")], grammarLessonsDone: ["lesson-01-am"] })
    },
    {
      name: "当前版本干净数据",
      input: () =>
        JSON.stringify({
          schemaVersion: 8,
          seededWordVersions: ["core-100-v1"],
          cards: [legacyWordCard("c1", "apple")],
          units: [],
          unitGroups: [],
          grammarLessonsDone: [],
          grammarLessonStagesDone: {}
        })
    },
    {
      name: "超 200 条的大词书（触发拆分）",
      input: () =>
        JSON.stringify({
          schemaVersion: 0,
          seededWordVersions: ["core-100-v1"],
          cards: Array.from({ length: 250 }, (_, index) => wordCardAt(`c${index}`, `w${index}`, ISO, { unitId: "big" })),
          units: [{ id: "big", title: "我的大书", description: "", order: 3, color: "#111", createdAt: ISO, updatedAt: ISO }]
        })
    },
    {
      name: "全掌握的大词书（触发拆分 + 完成打点重写）",
      input: () =>
        JSON.stringify({
          schemaVersion: 0,
          seededWordVersions: ["core-100-v1"],
          cards: Array.from({ length: 250 }, (_, index) =>
            wordCardAt(`c${index}`, `w${index}`, ISO, { unitId: "big", status: "mastered" })
          ),
          units: [
            {
              id: "big",
              title: "已通读的大书",
              description: "",
              order: 1,
              color: "#111",
              completedAt: PAST,
              createdAt: ISO,
              updatedAt: PAST
            }
          ]
        })
    },
    {
      name: "未启动的自建词书（触发速通标记）",
      input: () =>
        JSON.stringify({
          schemaVersion: 0,
          seededWordVersions: ["core-100-v1"],
          cards: [0, 1, 2].map((index) =>
            wordCardAt(`c${index}`, `w${index}`, ISO, { unitId: `u${index}`, status: "new" })
          ),
          units: [0, 1, 2].map((index) => ({
            id: `u${index}`,
            title: `第 ${index + 1} 本`,
            description: "",
            order: index + 1,
            color: "#111",
            createdAt: ISO,
            updatedAt: ISO
          }))
        })
    },
    {
      name: "学习者已开始第一本内置词书（速通标记应保持）",
      input: () =>
        JSON.stringify({
          schemaVersion: 0,
          seededWordVersions: ["core-100-v1"],
          cards: Array.from({ length: 40 }, (_, index) =>
            wordCardAt(`c${index}`, `w${index}`, ISO, {
              unitId: `core-100-unit-${Math.floor(index / 20) + 1}`,
              status: index === 0 ? "learning" : "new"
            })
          ),
          units: []
        })
    }
  ];

  for (const testCase of cases) {
    it(`${testCase.name}：第 1 次 vs 第 2 次 vs 第 3 次`, () => {
      const { snapshots, diffs } = migratePasses(testCase.input(), 3);
      const firstStable = snapshots[1] === snapshots[2];
      const secondStable = snapshots[2] === snapshots[3];

      // 打印实际差异，便于报告逐条记录（只列不改动整份 JSON 的摘要）。
      // eslint-disable-next-line no-console
      console.log(
        `\n[CASE] ${testCase.name}\n  第1==第2? ${snapshots[0] === snapshots[1]} / 第2==第3? ${firstStable} / 第3==第4? ${secondStable}\n  长度: ${snapshots
          .map((item) => item.length)
          .join(" -> ")}\n  第1→2次变动 ${diffs[0].length} 项；第2→3次变动 ${diffs[1].length} 项`
      );

      // 不变量：第 2 次迁移之后必须稳定（收敛），否则就是「每次操作都改数据」。
      // FAIL-1：老数据（无 seededWordVersions / 需拆分）在第 1 次迁移后**没有收敛**，
      // 第 2 次迁移还会改动 units（speedRun 徽标、拆分的 order）与 cards（unitId、masteredAt）。
      // 也就是说「升级后第一次打开」的数据与「第二次打开」并不相同 —— 判据见下方专项用例。
      expect(secondStable, `第 3 次与第 4 次迁移必须逐字节一致，实际差异：${diffs[2].join(" ;; ")}`).toBe(true);
    });
  }
});

describe("MG3c-2 FAIL-1：老数据第 1 次迁移不收敛（第 2 次打开还会改数据）", () => {
  /** 无 seededWordVersions 的最早版本数据：第 1 次补种，第 2 次才补 unitId / speedRun。 */
  const oldestVersion = () =>
    JSON.stringify({ cards: [legacyWordCard("c1", "apple", { status: "review" })] });

  /**
   * FAIL-1a / 1b【已修 2026-09-23】第一次迁移即收敛。
   *
   * 修复前：`migrateData` 的卡片归一化发生在 `seedCoreWords` **之前**，
   * 于是 seeding 新造的卡绕过了归一化（缺 `masteredAt`），
   * `ensureDefaultUnits` 的补 `unitId` 也只在 seeding 的早退分支里跑——
   * 首访那次不受益。两条加起来就是「第 1 次迁移不是终态，第 2 次才补齐」。
   *
   * 修复：seeding 之后再跑一次 `ensureDefaultUnits` + `normalizeCard`，
   * 让一次迁移就产出终态（见 services/storage.ts 的 migrateData 末尾注释）。
   */
  it("FAIL-1a【已修 2026-09-23】原有卡片不被编造归属，且第 1 次迁移即稳定", () => {
    /**
     * 2026-09-23 两处修复叠加后的口径：
     *  ① 归一化顺序修好 → 第 1 次迁移即终态（不再「第 2 次才补齐」）；
     *  ② FAIL-8 修好 → 用户原有卡**不再被静默编入内置书**——
     *     「未分配」是产品正式支持的状态（删书时 UI 承诺「单词会保留，并变成未分配」，
     *     且有常驻的「收纳未分配词（N）」入口）。
     * 所以这里断言的是「保持未分配」+「两次迁移结果一致」，而不是「被归入 unit-1」。
     */
    const first = parseBackupJson(oldestVersion());
    const second = parseBackupJson(JSON.stringify(first));
    expect(first.cards[0].unitId, "用户原有卡保持未分配").toBeUndefined();
    expect(second.cards[0].unitId, "第 2 次仍不变").toBeUndefined();
    expect(JSON.stringify(first), "第 1 次即终态").toBe(JSON.stringify(second));
  });

  it("FAIL-1b【已修 2026-09-23】补种卡第 1 次迁移就带上 masteredAt", () => {
    const first = parseBackupJson(oldestVersion());
    const second = parseBackupJson(JSON.stringify(first));
    const seededFirst = first.cards.find((card) => card.front === core100Words[0].word);
    const seededSecond = second.cards.find((card) => card.front === core100Words[0].word);
    expect(seededFirst && "masteredAt" in seededFirst, "第 1 次迁移即含该字段").toBe(true);
    expect(seededFirst?.masteredAt, "非 mastered 卡恒为 null").toBeNull();
    expect(seededSecond?.masteredAt, "第 2 次不变").toBeNull();
  });

  it("FAIL-1c【已修 2026-09-23】速通徽标一次迁移即定型（不再二次蔓延）", () => {
    const first = parseBackupJson(oldestVersion());
    const second = parseBackupJson(JSON.stringify(first));
    const badges = (data: ReturnType<typeof parseBackupJson>) =>
      data.units.filter((unit) => unit.speedRun).map((unit) => unit.id);
    // 徽标集合在第 1 次迁移后即稳定，第 2 次不再变（修复前第 2 次会多标第 3 本）
    expect(badges(first), "第 1 次迁移的徽标集合").toEqual(badges(second));
  });

  it("FAIL-1d【已修 2026-09-23】拆分结果第 1 次迁移就按 order 归位", () => {
    const cards = Array.from({ length: 250 }, (_, index) =>
      wordCardAt(`c${index}`, `w${index}`, ISO, { unitId: "big" })
    );
    const units = [
      { id: "big", title: "我的大书", description: "", order: 3, color: "#111", createdAt: ISO, updatedAt: ISO }
    ];
    const input = JSON.stringify({ schemaVersion: 0, seededWordVersions: ["core-100-v1"], cards, units });
    const first = parseBackupJson(input);
    const second = parseBackupJson(JSON.stringify(first));
    const idsOf = (data: ReturnType<typeof parseBackupJson>) => data.units.map((unit) => unit.id).join(",");
    const positionOf = (data: ReturnType<typeof parseBackupJson>, id: string) =>
      data.units.findIndex((unit) => unit.id === id);

    /**
     * 【已修 2026-09-23】修复前：拆分结果直接追加到数组末尾，
     * 于是 order=3 的「我的大书」排在 order=6 的冒险积累之后，
     * 要等**下一次**迁移的 `mergeUnits` 才归位——同一份数据两次迁移顺序不同，
     * 用户每次启动看到的分组顺序都在变。
     * 修复：拆分时立即 `.sort((a, b) => a.order - b.order)`。
     */
    expect(positionOf(first, "big"), "第 1 次迁移即归位到第 4 位（order=3）").toBe(3);
    expect(idsOf(second), "第 2 次迁移顺序不变").toBe(idsOf(first));
    expect(JSON.stringify(first), "第 1 次即终态（逐字节相等）").toBe(JSON.stringify(second));
    const third = parseBackupJson(JSON.stringify(second));
    expect(idsOf(third), "持续稳定").toBe(idsOf(second));
  });

  it("FAIL-1e【已修 2026-09-23】收敛性：第 1 次迁移之后即稳定", () => {
    const { snapshots } = migratePasses(oldestVersion(), 3);
    /**
     * 修复前：`snapshots[1] !== snapshots[2]`——第 1 次迁移不是终态，
     * 用户要**打开两次应用**数据才不再变（而 commitData 每次操作都会迁移+写回，
     * 所以体感是「数据每操作一次就自己动一次」）。
     * 修复后第 1 次即终态。
     */
    expect(snapshots[1], "第 1 次迁移即终态").toBe(snapshots[2]);
    expect(snapshots[2], "第 2 次稳定").toBe(snapshots[3]);
  });

  it("对照 PASS-1：当前版本干净数据第一次迁移就收敛", () => {
    const input = JSON.stringify({
      schemaVersion: 8,
      seededWordVersions: ["core-100-v1"],
      cards: [legacyWordCard("c1", "apple", { unitId: "core-100-unit-1" })],
      units: [],
      unitGroups: [],
      grammarLessonsDone: [],
      grammarLessonStagesDone: {}
    });
    const { snapshots, diffs } = migratePasses(input, 3);
    expect(diffs[0].length, "干净数据首轮仍有变化（补内置词书），但必须立刻收敛").toBeGreaterThan(0);
    expect(snapshots[1], "第 1 次之后即稳定").toBe(snapshots[2]);
  });
});

describe("MG3c-2b 首轮迁移的字段变动清单（老数据升级的真实影响面）", () => {
  it("最早版本数据：第一次迁移改动了什么，第二次又改动了什么", () => {
    const input = JSON.stringify({
      cards: [legacyWordCard("c1", "apple", { status: "mastered", updatedAt: PAST })],
      grammarLessonsDone: ["lesson-01-am"]
    });
    const { diffs } = migratePasses(input, 3);
    // 第一次迁移：补种 + 回填，属于预期的一次性变化。
    expect(diffs[0].length, "第一次迁移应发生实质性变化").toBeGreaterThan(0);
    // 第二次迁移：只能是「第一次没做完」的遗留 —— 这里把它列出来当作待评估项。
    // eslint-disable-next-line no-console
    console.log(`[首轮之后的残余变动] ${diffs[1].length} 项：${diffs[1].join(" ;; ")}`);
  });
});

describe("MG3c-3 往返稳定性：parse(JSON.stringify(parse(x)))", () => {
  it("已迁移数据再迁一次不变（各项内容不丢、不增）", () => {
    const input = JSON.stringify({
      schemaVersion: 0,
      seededWordVersions: ["core-100-v1"],
      cards: [legacyWordCard("c1", "apple", { priority: true, note: "我的笔记", tags: ["自建"] })],
      units: [{ id: "u1", title: "我的书", description: "d", order: 1, color: "#123", createdAt: ISO, updatedAt: ISO }],
      unitGroups: [{ id: "g1", title: "我的分组", color: "#234", order: 1, createdAt: ISO, updatedAt: ISO }],
      wordDetails: [
        {
          cardId: "c1",
          word: "apple",
          phonetic: "/ˈæpl/",
          partOfSpeech: "n.",
          chineseDefinition: "苹果",
          englishDefinition: "a fruit",
          collocations: "an apple",
          synonyms: "s",
          antonyms: "a",
          confusedWords: "c",
          audioUrl: "u",
          sourceSentence: "I like apples."
        }
      ],
      reviews: [
        { id: "r1", cardId: "c1", mode: "spelling", rating: 4, answer: "apple", diffJson: "[]", reviewedAt: PAST }
      ],
      schedules: [
        { cardId: "c1", easeFactor: 2.4, intervalDays: 7, reviewCount: 5, lapseCount: 2, nextReviewAt: PAST }
      ],
      grammarLessonsDone: ["lesson-01-am"],
      grammarLessonStagesDone: { "lesson-01-am": [1, 2] },
      diaryEntries: [
        {
          id: "d1",
          dateKey: "2024-06-01",
          questionId: "q1",
          questionZh: "今天做了什么？",
          answerEn: "I read a book.",
          correctedEn: "I read a book.",
          issues: [],
          status: "done",
          createdAt: PAST
        }
      ],
      huntAttempts: [{ id: "h1", caseId: "case-1", tokenIndex: 1, guessedTag: "tense", hit: true, createdAt: PAST }],
      huntResults: [
        { id: "hr1", caseId: "case-1", found: 2, total: 2, misses: 0, stars: 3, durationMs: 1000, finishedAt: PAST }
      ]
    });

    const once = parseBackupJson(input);
    const onceJson = JSON.stringify(once);
    const twice = parseBackupJson(onceJson);
    expect(JSON.stringify(twice), "第二次迁移必须与第一次完全一致").toBe(onceJson);

    // 内容层面的硬指标：不能丢用户数据。
    expect(once.cards).toHaveLength(1);
    expect(once.wordDetails[0].phonetic).toBe("/ˈæpl/");
    expect(once.schedules[0]).toMatchObject({ intervalDays: 7, reviewCount: 5, lapseCount: 2, easeFactor: 2.4 });
    expect(once.reviews).toHaveLength(1);
    expect(once.units.find((unit) => unit.id === "u1")).toMatchObject({ title: "我的书", groupId: undefined });
    expect(once.unitGroups.find((group) => group.id === "g1")?.title).toBe("我的分组");
    expect(once.diaryEntries).toHaveLength(1);
    expect(once.huntAttempts).toHaveLength(1);
    expect(once.huntResults).toHaveLength(1);
    expect(once.grammarLessonStagesDone?.["lesson-01-am"]).toEqual([1, 2]);
  });

  it("导出 JSON（缩进格式）能原样再读回来", () => {
    const input = JSON.stringify({
      schemaVersion: 0,
      seededWordVersions: ["core-100-v1"],
      cards: [legacyWordCard("c1", "apple")]
    });
    const once = parseBackupJson(input);
    // 导出走 exportJson = JSON.stringify(data, null, 2)
    const exported = JSON.stringify(once, null, 2);
    const twice = parseBackupJson(exported);
    expect(JSON.stringify(twice)).toBe(JSON.stringify(once));
  });

  it("反复导出/导入 5 轮不会累积（体积与条数都稳定）", () => {
    let json = JSON.stringify({
      schemaVersion: 0,
      seededWordVersions: ["core-100-v1"],
      cards: [legacyWordCard("c1", "apple")],
      units: [{ id: "u1", title: "书", description: "", order: 1, color: "#111", createdAt: ISO, updatedAt: ISO }]
    });
    const lengths: number[] = [];
    for (let round = 0; round < 5; round += 1) {
      const data = parseBackupJson(json);
      json = JSON.stringify(data, null, 2);
      lengths.push(json.length);
    }
    expect(new Set(lengths.slice(1)).size, `5 轮长度应稳定，实际：${lengths.join(", ")}`).toBe(1);
  });
});
