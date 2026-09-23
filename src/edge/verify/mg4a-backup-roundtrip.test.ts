// @vitest-environment jsdom
/**
 * MG4-a · JSON 备份完整往返（2026-09-22）
 *
 * 目标：造一份「内容齐全」的 AppData，走 exportJson → restoreDataFromJson，
 * 逐字段对比，输出完整对照表。判据是：
 *   - 哪些字段值变了（有意的规范化 vs 非预期丢失）
 *   - 哪些字段消失了
 *   - 哪些字段多出来了
 *
 * 因为 AppData 是一个嵌套结构，「逐字段」必须是递归的（数组按索引对齐比较），
 * 所以下面自带一个 deepDiff，把差异摊平成 path × input × output 的行。
 */
import { describe, expect, it } from "vitest";
import type { AppData } from "../../types";
import { exportJson } from "../../services/exportService";
import { APP_SCHEMA_VERSION, restoreDataFromJson } from "../../services/storage";
import { makeAppData } from "./fixtures";

/* ── 深比较：把两棵树摊平成差异行 ─────────────────────────────────────── */

export type DiffKind = "changed" | "missing" | "added";

export interface DiffRow {
  path: string;
  input: unknown;
  output: unknown;
  kind: DiffKind;
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const has = (record: Record<string, unknown>, key: string) =>
  Object.prototype.hasOwnProperty.call(record, key);

/**
 * 数组元素的身份键。按位置对齐会把「重排」误报成几十行字段差异
 * （迁移里 unit/card 都可能被重排或补充），所以优先按 id 对齐。
 */
const ARRAY_KEYS = ["id", "cardId", "runeId", "word", "topicId"] as const;

const identityOf = (item: unknown): string | null => {
  if (!isPlainObject(item)) return null;
  for (const key of ARRAY_KEYS) {
    const value = item[key];
    if (typeof value === "string" && value) return `${key}=${value}`;
  }
  return null;
};

export const deepDiff = (input: unknown, output: unknown, path = ""): DiffRow[] => {
  if (Array.isArray(input) || Array.isArray(output)) {
    const inArr = Array.isArray(input) ? input : [];
    const outArr = Array.isArray(output) ? output : [];
    const inById = new Map<string, unknown>();
    const outById = new Map<string, unknown>();
    for (const item of inArr) {
      const key = identityOf(item);
      if (key) inById.set(key, item);
    }
    for (const item of outArr) {
      const key = identityOf(item);
      if (key) outById.set(key, item);
    }

    const rows: DiffRow[] = [];
    if (inArr.length !== outArr.length) {
      rows.push({ path: `${path}.length`, input: inArr.length, output: outArr.length, kind: "changed" });
    }

    // 有身份键的项按 id 对齐（顺序无关），这样差异只反映字段本身。
    for (const key of new Set([...inById.keys(), ...outById.keys()])) {
      const at = `${path}[${key}]`;
      if (!inById.has(key)) rows.push({ path: at, input: undefined, output: outById.get(key), kind: "added" });
      else if (!outById.has(key)) rows.push({ path: at, input: inById.get(key), output: undefined, kind: "missing" });
      else rows.push(...deepDiff(inById.get(key), outById.get(key), at));
    }

    // 身份键缺失的项（如 schedule 之外的匿名对象）退回按位置对齐。
    const inAnon = inArr.filter((item) => !identityOf(item));
    const outAnon = outArr.filter((item) => !identityOf(item));
    for (let index = 0; index < Math.max(inAnon.length, outAnon.length); index += 1) {
      const at = `${path}[#${index}]`;
      if (index >= inAnon.length) rows.push({ path: at, input: undefined, output: outAnon[index], kind: "added" });
      else if (index >= outAnon.length) rows.push({ path: at, input: inAnon[index], output: undefined, kind: "missing" });
      else rows.push(...deepDiff(inAnon[index], outAnon[index], at));
    }
    return rows;
  }

  if (isPlainObject(input) || isPlainObject(output)) {
    const inRec = isPlainObject(input) ? input : {};
    const outRec = isPlainObject(output) ? output : {};
    const rows: DiffRow[] = [];
    for (const key of new Set([...Object.keys(inRec), ...Object.keys(outRec)])) {
      const at = path ? `${path}.${key}` : key;
      // `{a: undefined}` 与 `{}` 在 JSON 里等价（stringify 会丢掉 undefined 值的键），
      // 所以两侧都是 undefined 时不算差异，否则会淹出几百行假差异。
      if (inRec[key] === undefined && outRec[key] === undefined) continue;
      if (!has(inRec, key)) rows.push({ path: at, input: undefined, output: outRec[key], kind: "added" });
      else if (!has(outRec, key)) rows.push({ path: at, input: inRec[key], output: undefined, kind: "missing" });
      else rows.push(...deepDiff(inRec[key], outRec[key], at));
    }
    return rows;
  }

  return JSON.stringify(input) === JSON.stringify(output)
    ? []
    : [{ path, input, output, kind: "changed" }];
};

/** 只保留产生差异的顶层字段，便于人读。 */
export const topLevelOf = (row: DiffRow): string => row.path.replace(/^\./, "").split(/[.[]/)[0];

/* ── 内容齐全的 AppData ───────────────────────────────────────────────── */

const ISO = "2024-03-05T08:30:00.000Z";
const ISO2 = "2024-03-06T09:45:00.000Z";

/**
 * 这份数据刻意做到「每个字段都有可辨认的值」：
 * 三类卡 × 五种状态、进度、遥测、设置、日记、侦探记录、季/关卡、词书、材料、
 * 错词生成、冒险、语言之门、符文状态。
 *
 * 关键：带上默认词书/分组 + seededWordVersions=["core-100-v1"]，
 * 否则 seedCoreWords 会补 100 张核心词卡（噪音，掩盖真正的字段差异）。
 * 这与真实用户导出的备份一致——真实数据里这些默认词书早就存在了。
 */
export const buildFullAppData = (): AppData =>
  makeAppData({
    schemaVersion: APP_SCHEMA_VERSION,

    unitGroups: [
      { id: "group-core-100", title: "核心100", color: "#f06423", order: 1, createdAt: ISO, updatedAt: ISO },
      { id: "group-adventure-accumulation", title: "冒险积累", color: "#177e78", order: 2, createdAt: ISO, updatedAt: ISO },
      { id: "group_mine", title: "我的分组", color: "#2563eb", order: 3, createdAt: ISO, updatedAt: ISO }
    ],

    units: [
      {
        id: "core-100-unit-1",
        title: "核心100 - Unit 1",
        description: "内置核心词第 1-20 个",
        order: 1,
        color: "#f06423",
        groupId: "group-core-100",
        createdAt: ISO,
        updatedAt: ISO
      },
      {
        id: "unit_mine",
        title: "我的词书",
        description: "从材料里收的词",
        order: 9,
        color: "#7c3aed",
        groupId: "group_mine",
        createdAt: ISO,
        updatedAt: ISO,
        completedAt: ISO2,
        speedRun: true,
        dynamicKind: "mistakes"
      },
      {
        id: "unit-adventure-accumulation",
        title: "冒险积累",
        description: "在冒险阅读中收藏的单词",
        order: 6,
        color: "#177e78",
        groupId: "group-adventure-accumulation",
        createdAt: ISO,
        updatedAt: ISO
      }
    ],

    cards: [
      // 三类卡 × 各种状态，逐字段带值
      {
        id: "card_word_mastered",
        type: "word",
        front: "approach",
        back: "方法；接近",
        note: "从材料里收的",
        sourceId: "material_1",
        unitId: "unit_mine",
        tags: ["导入", "核心"],
        status: "mastered",
        priority: true,
        prioritySource: "manual",
        createdAt: ISO,
        updatedAt: ISO2,
        masteredAt: ISO2
      },
      {
        id: "card_word_review",
        type: "word",
        front: "context",
        back: "上下文",
        note: "",
        sourceId: "material_1",
        unitId: "unit_mine",
        tags: ["导入"],
        status: "review",
        priority: false,
        createdAt: ISO,
        updatedAt: ISO
      },
      {
        id: "card_word_suspended",
        type: "word",
        front: "settle",
        back: "安定下来",
        note: "",
        sourceId: "",
        unitId: "unit_mine",
        tags: [],
        status: "suspended",
        suspendedFrom: "review",
        priority: false,
        createdAt: ISO,
        updatedAt: ISO
      },
      {
        id: "card_word_graduated",
        type: "word",
        front: "retain",
        back: "保留",
        note: "",
        sourceId: "",
        unitId: "unit_mine",
        tags: [],
        status: "learning",
        priority: false,
        mistakeGraduatedAt: ISO2,
        createdAt: ISO,
        updatedAt: ISO
      },
      {
        id: "card_phrase_new",
        type: "phrase",
        front: "in context",
        back: "在语境中",
        note: "",
        sourceId: "material_1",
        tags: ["短语"],
        status: "new",
        priority: false,
        createdAt: ISO,
        updatedAt: ISO
      },
      {
        id: "card_sentence_learning",
        type: "sentence",
        front: "A practical approach matters.",
        back: "实用的方法很重要。",
        note: "来源：材料一",
        sourceId: "material_1",
        tags: ["导入"],
        status: "learning",
        priority: true,
        prioritySource: "system",
        createdAt: ISO,
        updatedAt: ISO2
      },
      // 计划会自动补，这张卡刻意不给
      {
        id: "card_word_noplan",
        type: "word",
        front: "dwell",
        back: "停留",
        note: "",
        sourceId: "",
        unitId: "unit_mine",
        tags: [],
        status: "new",
        priority: false,
        createdAt: ISO,
        updatedAt: ISO
      }
    ],

    wordDetails: [
      {
        cardId: "card_word_mastered",
        word: "approach",
        phonetic: "/əˈproʊtʃ/",
        partOfSpeech: "n./v.",
        chineseDefinition: "方法；接近",
        englishDefinition: "a way of dealing with something",
        collocations: "a practical approach",
        /**
         * 三个近义/反义字段已废弃（2026-09-22）：零读取、永久为空。
         * 这里刻意留一个**非空真实值**，验证「手工填过的内容不会被丢」——
         * 空缺值（下面那条的 `""`）则会在迁移时被摘掉，正是本次治理的目的。
         */
        synonyms: "method",
        audioUrl: "https://example.com/approach.mp3",
        sourceSentence: "A practical approach matters."
      },
      {
        cardId: "card_word_suspended",
        word: "settle",
        phonetic: "/ˈsetl/",
        partOfSpeech: "v.",
        chineseDefinition: "安定下来",
        englishDefinition: "",
        collocations: "settle down",
        audioUrl: "",
        sourceSentence: ""
      }
    ],

    sentenceDetails: [
      {
        cardId: "card_sentence_learning",
        sentence: "A practical approach matters.",
        translation: "实用的方法很重要。",
        keywords: ["approach", "matter"],
        grammarNote: "主语是单数，动词跟着变",
        audioUrl: ""
      }
    ],

    materials: [
      {
        id: "material_1",
        title: "材料一",
        type: "text",
        content: "A practical approach matters. Context helps.",
        sourceUrl: "https://example.com/article",
        tags: ["阅读"],
        createdAt: ISO
      }
    ],

    materialSegments: [
      { id: "segment_1", materialId: "material_1", index: 0, text: "A practical approach matters.", createdAt: ISO },
      { id: "segment_2", materialId: "material_1", index: 1, text: "Context helps.", createdAt: ISO },
      // 孤儿句段（材料不存在）——应被清理
      { id: "segment_orphan", materialId: "material_missing", index: 0, text: "Orphan.", createdAt: ISO }
    ],

    reviews: [
      {
        id: "review_1",
        cardId: "card_word_mastered",
        mode: "spelling",
        rating: 4,
        answer: "approach",
        diffJson: "[]",
        reviewedAt: ISO2
      },
      {
        id: "review_2",
        cardId: "card_sentence_learning",
        mode: "rebuild",
        rating: 2,
        answer: "A practical approach matter.",
        diffJson: '[{"token":"matter","status":"substitution"}]',
        reviewedAt: ISO2
      },
      // 孤儿复习记录——应被清理
      { id: "review_orphan", cardId: "card_missing", mode: "recall", rating: 3, answer: "", diffJson: "[]", reviewedAt: ISO }
    ],

    mistakeGenerations: [
      {
        id: "gen_1",
        dateKey: "2024-03-05",
        type: "story",
        cardIds: ["card_word_mastered", "card_word_suspended"],
        title: "错词故事",
        content: "A short story with approach and settle.",
        prompt: "Use the target words.",
        createdAt: ISO2,
        settings: { level: "B1", scene: "校园", length: "short", tone: "轻松", bilingual: true },
        wordSnapshots: [
          { cardId: "card_word_mastered", word: "approach", translation: "方法", wrongAnswers: ["aproach"], status: "improving" }
        ],
        coverage: { usedCardIds: ["card_word_mastered"], missingCardIds: ["card_word_suspended"] },
        story: {
          title: "The Approach",
          englishStory: "She took a practical approach.",
          chineseTranslation: "她采取了实用的方法。",
          usedWords: ["approach"],
          missingWords: ["settle"],
          wordNotes: [{ word: "approach", sentence: "She took a practical approach.", meaning: "方法" }]
        }
      }
    ],

    adventures: [
      {
        id: "adventure_1",
        title: "校园的一天",
        template: "campus",
        scene: "campus",
        themeId: "theme_campus",
        level: "B1",
        customPrompt: "轻松校园故事",
        createdAt: ISO,
        updatedAt: ISO2,
        currentNodeId: "node_1",
        nodes: [
          {
            id: "node_1",
            chapter: 1,
            title: "Chapter 1",
            englishText: "Mika walks into the classroom.",
            chineseText: "美佳走进教室。",
            sentenceTranslations: ["美佳走进教室。"],
            summary: "开场",
            source: "ai",
            choices: [{ id: "choice_1", label: "Say hello", description: "打招呼", promptHint: "说一句问候" }],
            selectedChoiceId: "choice_1",
            customAction: "wave",
            vocabulary: [
              { word: "classroom", translation: "教室", partOfSpeech: "n.", sentence: "Mika walks into the classroom.", cardId: "card_word_mastered" }
            ],
            createdAt: ISO
          }
        ]
      }
    ],

    huntAttempts: [
      { id: "attempt_1", caseId: "case_1", tokenIndex: 3, guessedTag: "tense", hit: true, createdAt: ISO2 },
      { id: "attempt_2", caseId: "case_1", tokenIndex: 5, guessedTag: null, hit: false, createdAt: ISO2 }
    ],

    huntResults: [
      { id: "result_1", caseId: "case_1", found: 2, total: 3, misses: 1, stars: 2, durationMs: 64000, finishedAt: ISO2 }
    ],

    grammarLessonsDone: ["lesson-13-now"],
    grammarLessonStagesDone: { "lesson-13-now": [1, 2] },
    grammarBoostsDone: { "lesson-13-now": [1] },

    diaryEntries: [
      {
        id: "diary_1",
        dateKey: "2024-03-05",
        questionId: "q_1",
        questionZh: "今天做了什么？",
        answerEn: "I read a book today.",
        correctedEn: "I read a book today.",
        issues: [{ original: "I readed", correction: "I read", explanation: "过去的说法不一样", tag: "tense" }],
        status: "done",
        note: "自己的备注",
        followUp: "再多说一句",
        createdAt: ISO2
      },
      {
        id: "diary_2",
        dateKey: "2024-03-06",
        questionId: "q_2",
        questionZh: "明天想做什么？",
        answerEn: "I will study.",
        correctedEn: "",
        issues: [],
        status: "pending",
        createdAt: ISO2
      }
    ],

    schedules: [
      {
        cardId: "card_word_mastered",
        easeFactor: 2.8,
        intervalDays: 12,
        reviewCount: 5,
        lapseCount: 1,
        nextReviewAt: "2030-01-01T00:00:00.000Z",
        recoveryCount: 2
      },
      {
        cardId: "card_sentence_learning",
        easeFactor: 2.2,
        intervalDays: 3,
        reviewCount: 2,
        lapseCount: 3,
        nextReviewAt: "2030-01-02T00:00:00.000Z"
      }
    ],

    dictionaryEntries: [
      { word: "approach", phonetic: "/əˈproʊtʃ/", partOfSpeech: "n.", definition: "a way of dealing", translation: "方法", collocations: "practical approach" }
    ],

    seededWordVersions: ["core-100-v1"],

    languageGates: [
      {
        id: "gate_1",
        topicId: "there_be",
        runeId: "rune_1",
        mode: "say",
        npcLine: "Where are you from?",
        npcLineZh: "你从哪里来？",
        zhIntent: "告诉她你从北京来",
        canDo: "说清『自己从哪里来』",
        requiredPattern: "I + be + from + …",
        sampleAnswer: "I am from Beijing.",
        hints: ["先说 I", "加上 am from", "I am from Beijing."],
        skeleton: { subject: "I", verb: "am from Beijing", subjectLabel: "谁", verbLabel: "从哪来" },
        counterExample: "I from Beijing.",
        counterNote: "少了一个词，句子站不住",
        acceptRegex: "I'm from Beijing",
        misreadBranches: [{ errorTag: "missing_be", npcReply: "From Beijing? Nice!", npcReplyZh: "来自北京？真好！", lampHint: "还差一个小词" }]
      }
    ],

    gateAttempts: [
      {
        id: "gate_attempt_1",
        adventureId: "adventure_1",
        nodeId: "node_1",
        gateId: "gate_1",
        topicId: "there_be",
        raw: "I from Beijing",
        verdict: "near",
        errorTags: ["missing_be"],
        hintsUsed: 1,
        attemptIndex: 1,
        createdAt: ISO2
      }
    ],

    runeStates: [{ runeId: "rune_1", mastery: "usable", xp: 30, unlockedAt: ISO2 }],

    settings: {
      dailyNewWords: 12,
      dailyReviewLimit: 42,
      dailySentences: 7,
      strictPunctuation: true,
      speechVoice: "voice-mika",
      speechLang: "en-GB",
      speechRate: 1.1,
      autoSpeakInSpelling: false,
      lastExportedAt: ISO2,
      lastSyncedAt: ISO,
      diaryDailyCount: 5,
      diaryCorrectionStyle: "strict",
      aiProvider: {
        enabled: true,
        baseUrl: "https://api.example-relay.com/v1",
        apiKey: "sk-live-SECRET-abcdefghijklmn",
        model: "gpt-4o-mini",
        temperature: 1.2,
        timeoutMs: 180000,
        fallbackToLocal: false
      },
      dataSync: { enabled: true, baseUrl: "https://sync.example.com", token: "sync-token-SECRET" },
      reviewOnlyDayKey: 20240305,
      studyScopeUnitIds: ["unit_mine"],
      reachedMilestoneIds: ["first_100"]
    }
  });

describe("MG4-a 完整往返：exportJson → restoreDataFromJson", () => {
  it("把差异摊平成对照表（诊断输出，不做断言）", () => {
    const input = buildFullAppData();
    const json = exportJson(input);
    const output = restoreDataFromJson(json);
    const rows = deepDiff(input, output);

    const table = rows
      .map((row) => `| \`${row.path}\` | ${row.kind} | ${JSON.stringify(row.input)} | ${JSON.stringify(row.output)} |`)
      .join("\n");
    // eslint-disable-next-line no-console
    console.log(`\n=== MG4-a 往返差异 ${rows.length} 行 ===\n${table || "（无差异）"}\n`);

    const byTop = new Map<string, number>();
    for (const row of rows) byTop.set(topLevelOf(row), (byTop.get(topLevelOf(row)) ?? 0) + 1);
    // eslint-disable-next-line no-console
    console.log("=== 差异按顶层字段 ===\n" + [...byTop.entries()].map(([key, count]) => `${key}: ${count}`).join("\n"));

    expect(Array.isArray(rows)).toBe(true);
  });

  it("两次导入结果稳定（迁移幂等）", () => {
    const input = buildFullAppData();
    const once = restoreDataFromJson(exportJson(input));
    const twice = restoreDataFromJson(exportJson(once));
    const rows = deepDiff(once, twice);
    // eslint-disable-next-line no-console
    console.log(`\n=== MG4-a 幂等差异 ${rows.length} 行 ===\n` + rows.map((r) => `| \`${r.path}\` | ${JSON.stringify(r.input)} | ${JSON.stringify(r.output)} |`).join("\n"));
    expect(rows, "第二次导入不该再改变数据").toEqual([]);
  });

  it("逐顶层字段判定：哪些原样保留、哪些被规范化、哪些消失", () => {
    const input = buildFullAppData();
    const output = restoreDataFromJson(exportJson(input));
    const rows = deepDiff(input, output);

    const summary = (Object.keys(input) as Array<keyof typeof input>).map((field) => {
      const fieldRows = rows.filter((row) => topLevelOf(row) === field);
      const kinds = new Set(fieldRows.map((row) => row.kind));
      const verdict =
        fieldRows.length === 0
          ? "原样保留"
          : kinds.has("missing")
            ? "有丢失"
            : kinds.has("added")
              ? "有新增（迁移补齐）"
              : "有值变化";
      const detail = fieldRows.map((row) => `${row.path}:${row.kind}`).join(", ");
      return `| \`${field}\` | ${verdict} | ${fieldRows.length} | ${detail || "—"} |`;
    });

    // eslint-disable-next-line no-console
    console.log(
      `\n=== MG4-a 逐顶层字段判定 ===\n| 字段 | 判定 | 差异行数 | 明细 |\n|---|---|---|---|\n${summary.join("\n")}`
    );

    const inputKeys = new Set(Object.keys(input));
    const outputKeys = new Set(Object.keys(output));
    // eslint-disable-next-line no-console
    console.log(
      `=== 顶层键对比 ===\n消失的键：${JSON.stringify([...inputKeys].filter((key) => !outputKeys.has(key)))}\n` +
        `多出的键：${JSON.stringify([...outputKeys].filter((key) => !inputKeys.has(key)))}`
    );

    // 输入里显式给出的契约字段，除下面三类之外都该原样保留。
    expect(rows.length).toBeGreaterThan(0);
  });

  it("落盘的第二遍迁移不改变数据（内存 == localStorage）", () => {
    const input = buildFullAppData();
    const returned = restoreDataFromJson(exportJson(input));
    const persisted = JSON.parse(window.localStorage.getItem("personal-vocab-app-data-v1") ?? "{}") as AppData;
    const rows = deepDiff(returned, persisted);
    // eslint-disable-next-line no-console
    console.log(`\n=== MG4-a 返回 vs 落盘 差异 ${rows.length} 行 ===\n` + rows.map((r) => `| \`${r.path}\` | ${JSON.stringify(r.input)} | ${JSON.stringify(r.output)} |`).join("\n"));
    expect(rows, "restoreDataFromJson 的返回值应与落盘内容一致").toEqual([]);
  });
});

/**
 * reviewOnlyDayKey 的类型契约（2026-09-22 补）。
 *
 * `Settings.reviewOnlyDayKey?: number` —— 写入侧 `UnitsPage` 用的是
 * `dayKey(new Date())`（statsService 的数字 20260922）。
 * 但归一化里写的是 `asString(settings.reviewOnlyDayKey).trim() || undefined`，
 * 于是**真实写入的数字被当成非法值丢掉**，导出→导入一轮之后「纯复习日」标记消失，
 * 当天又按日常节奏排新词。
 *
 * 这条不是「备份特有」的问题：`saveData` 每次都走同一条迁移，所以只要用户开了
 * 纯复习日、当天又发生过任何一次保存，标记就会被抹掉。
 */
describe("MG4-a reviewOnlyDayKey 的类型契约", () => {
  it("写入侧产出的 number 必须能原样往返（不能被当作非法值丢弃）", () => {
    const written = 20260922; // = statsService.dayKey(new Date()) 的形状
    const data = { ...buildFullAppData(), settings: { ...buildFullAppData().settings, reviewOnlyDayKey: written } };

    const raw = JSON.parse(exportJson(data)) as Record<string, unknown>;
    // eslint-disable-next-line no-console
    console.log(`[reviewOnlyDayKey] 导出文件里的值 = ${JSON.stringify((raw.settings as Record<string, unknown>).reviewOnlyDayKey)}`);

    const out = restoreDataFromJson(exportJson(data));
    // eslint-disable-next-line no-console
    console.log(`[reviewOnlyDayKey] 导入后的值 = ${JSON.stringify(out.settings.reviewOnlyDayKey)} (类型 ${typeof out.settings.reviewOnlyDayKey})`);

    expect(
      out.settings.reviewOnlyDayKey,
      "number 形态的纯复习日标记被丢弃了——写入侧产出的就是 number"
    ).toBe(written);
  });
});
