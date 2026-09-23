// @vitest-environment node
/**
 * MG9 · 字段存活矩阵（2026-09-22）
 *
 * 「老数据字段不全」的另一面是**字段存在却被迁移丢掉**——那才是把好数据变成
 * 老数据的机制（先例：`Card.prioritySource` 曾被 normalizeCard 静默丢弃，
 * 直到 2026-09-22 才修，见 storage.ts:303-326 的注释）。
 *
 * 方法：造一份**每个可选字段都填满**的数据，走真实入口（parseBackupJson）往返一次，
 * 逐字段比对哪些值活下来、哪些被改写、哪些消失。
 * 这比「读代码找漏」更可靠：白名单只要漏一个字段，这里就会红。
 */
import { describe, expect, it } from "vitest";
import { migrateData, parseBackupJson } from "../../services/storage";
import { core100Words, CORE_100_WORDS_VERSION } from "../../data/seedWords";

const ISO = "2024-01-01T00:00:00.000Z";

/** 全字段数据：所有可选字段都填上真值（不用默认值，避免把「默认值恰好相同」当成存活）。 */
const fullyPopulated = () => ({
  schemaVersion: 1,
  unitGroups: [{ id: "g1", title: "分组", color: "#111111", order: 1, createdAt: ISO, updatedAt: ISO }],
  units: [
    {
      id: "u1",
      title: "词书",
      description: "描述",
      order: 1,
      color: "#222222",
      groupId: "g1",
      createdAt: ISO,
      updatedAt: ISO,
      completedAt: ISO,
      speedRun: true,
      dynamicKind: "mistakes"
    }
  ],
  cards: [
    {
      id: "c1",
      type: "sentence",
      front: "I am drawing a picture.",
      back: "我正在画一幅画。",
      note: "备注",
      sourceId: "lesson:lesson-13-now",
      unitId: "u1",
      tags: ["语法", "日记"],
      status: "suspended",
      suspendedFrom: "mastered",
      priority: true,
      prioritySource: "manual",
      createdAt: ISO,
      updatedAt: ISO,
      masteredAt: ISO,
      mistakeGraduatedAt: ISO
    },
    {
      id: "c2",
      type: "word",
      front: "apple",
      back: "苹果",
      note: "",
      unitId: "u1",
      tags: [],
      status: "mastered",
      priority: false,
      createdAt: ISO,
      updatedAt: ISO,
      masteredAt: ISO
    }
  ],
  wordDetails: [
    {
      cardId: "c2",
      word: "apple",
      phonetic: "/ˈæpl/",
      partOfSpeech: "n.",
      chineseDefinition: "苹果",
      englishDefinition: "a fruit",
      collocations: "an apple",
      synonyms: "pome",
      antonyms: "none",
      confusedWords: "apply",
      audioUrl: "http://x/a.mp3",
      sourceSentence: "I eat an apple."
    }
  ],
  sentenceDetails: [
    {
      cardId: "c1",
      sentence: "I am drawing a picture.",
      translation: "我正在画一幅画。",
      keywords: ["draw"],
      grammarNote: "[tense:draw] 讲解",
      audioUrl: "http://x/s.mp3"
    }
  ],
  materials: [{ id: "m1", title: "材料", type: "note", content: "正文", sourceUrl: "http://x", tags: ["t"], createdAt: ISO }],
  materialSegments: [{ id: "seg1", materialId: "m1", index: 0, text: "句段", createdAt: ISO }],
  reviews: [
    { id: "r1", cardId: "c1", mode: "recall", rating: 4, answer: "x", diffJson: "[]", reviewedAt: ISO },
    { id: "r2", cardId: "c2", mode: "rebuild", rating: 3, answer: "y", diffJson: "[]", reviewedAt: ISO }
  ],
  mistakeGenerations: [
    {
      id: "mg1",
      dateKey: "2024-01-01",
      type: "story",
      cardIds: ["c2"],
      title: "错词故事",
      content: "内容",
      prompt: "提示",
      createdAt: ISO,
      settings: { level: "A2", scene: "校园", length: "short", tone: "轻松", bilingual: true },
      wordSnapshots: [{ cardId: "c2", word: "apple", translation: "苹果", wrongAnswers: ["appel"], status: "improving" }],
      coverage: { usedCardIds: ["c2"], missingCardIds: [] },
      story: {
        title: "标题",
        englishStory: "story",
        chineseTranslation: "故事",
        usedWords: ["apple"],
        missingWords: [],
        wordNotes: [{ word: "apple", sentence: "I eat an apple.", meaning: "苹果" }]
      }
    }
  ],
  adventures: [
    {
      id: "a1",
      title: "冒险",
      template: "campus",
      scene: "classroom",
      themeId: "theme-1",
      level: "B1",
      customPrompt: "自定义",
      createdAt: ISO,
      updatedAt: ISO,
      currentNodeId: "n1",
      nodes: [
        {
          id: "n1",
          chapter: 1,
          title: "第一章",
          englishText: "Text.",
          chineseText: "文本。",
          sentenceTranslations: ["文本。"],
          summary: "摘要",
          source: "ai",
          choices: [{ id: "ch1", label: "选项", description: "说明", promptHint: "提示" }],
          selectedChoiceId: "ch1",
          customAction: "动作",
          vocabulary: [{ word: "apple", translation: "苹果", partOfSpeech: "n.", sentence: "An apple.", cardId: "c2" }],
          createdAt: ISO
        }
      ]
    }
  ],
  huntAttempts: [
    { id: "ha1", caseId: "hunt-kitchen-note", tokenIndex: 1, guessedTag: "tense", hit: true, createdAt: ISO }
  ],
  huntResults: [
    { id: "hr1", caseId: "hunt-kitchen-note", found: 2, total: 2, misses: 0, stars: 3, durationMs: 1000, finishedAt: ISO }
  ],
  grammarLessonsDone: ["lesson-13-now"],
  grammarLessonStagesDone: { "lesson-13-now": [1, 2] },
  grammarBoostsDone: { "lesson-13-now": [1, 3] },
  diaryEntries: [
    {
      id: "d1",
      dateKey: "2024-01-01",
      questionId: "q1",
      questionZh: "问题",
      answerEn: "answer",
      correctedEn: "corrected",
      issues: [{ original: "go", correction: "went", explanation: "解释", tag: "tense" }],
      status: "done",
      note: "备注",
      followUp: "再多说一句",
      createdAt: ISO
    }
  ],
  schedules: [
    { cardId: "c1", easeFactor: 2.5, intervalDays: 3, reviewCount: 2, lapseCount: 1, nextReviewAt: ISO, recoveryCount: 1 },
    { cardId: "c2", easeFactor: 2.6, intervalDays: 5, reviewCount: 4, lapseCount: 0, nextReviewAt: ISO }
  ],
  dictionaryEntries: [{ word: "w", phonetic: "p", partOfSpeech: "n.", definition: "d", translation: "t", collocations: "c" }],
  seededWordVersions: [CORE_100_WORDS_VERSION],
  languageGates: [
    {
      id: "gate1",
      topicId: "t1",
      runeId: "r1",
      mode: "complete",
      npcLine: "Line.",
      npcLineZh: "台词。",
      zhIntent: "意图",
      canDo: "能说清…",
      requiredPattern: "I + …",
      sampleAnswer: "I am here.",
      hints: ["h1", "h2", "h3"],
      skeleton: { subject: "I", verb: "am", subjectLabel: "谁", verbLabel: "做什么" },
      counterExample: "I here.",
      counterNote: "点评",
      acceptRegex: "^I\\b",
      misreadBranches: [{ errorTag: "missing_be", npcReply: "R.", npcReplyZh: "反应。", lampHint: "提示" }]
    }
  ],
  gateAttempts: [
    {
      id: "ga1",
      adventureId: "a1",
      nodeId: "n1",
      gateId: "gate1",
      topicId: "t1",
      raw: "I am here.",
      verdict: "pass",
      errorTags: ["tense"],
      hintsUsed: 1,
      attemptIndex: 2,
      createdAt: ISO
    }
  ],
  runeStates: [{ runeId: "r1", mastery: "fluent", xp: 30, unlockedAt: ISO }],
  settings: {
    dailyNewWords: 7,
    dailyReviewLimit: 20,
    dailySentences: 4,
    strictPunctuation: true,
    speechVoice: "voice",
    speechLang: "en-GB",
    speechRate: 1.1,
    autoSpeakInSpelling: false,
    lastExportedAt: ISO,
    lastSyncedAt: ISO,
    diaryDailyCount: 5,
    diaryCorrectionStyle: "strict",
    aiProvider: {
      enabled: true,
      baseUrl: "http://ai",
      apiKey: "key",
      model: "m",
      temperature: 0.9,
      timeoutMs: 90000,
      fallbackToLocal: false
    },
    dataSync: { enabled: true, baseUrl: "http://sync", token: "tok" },
    reviewOnlyDayKey: 20240101,
    studyScopeUnitIds: ["u1"],
    reachedMilestoneIds: ["ms1"]
  }
});

/** 读取嵌套值（点路径）。 */
const get = (object: unknown, path: string): unknown =>
  path.split(".").reduce<unknown>((current, key) => {
    if (current === null || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[key];
  }, object);

describe("MG9 字段存活矩阵：全字段数据往返 parseBackupJson", () => {
  const out = parseBackupJson(JSON.stringify(fullyPopulated()));

  /** 逐条断言「该路径的值必须与输入一致」。 */
  const mustSurvive: Array<[string, string]> = [
    ["Unit.completedAt", "units.0.completedAt"],
    ["Unit.speedRun", "units.0.speedRun"],
    ["Unit.dynamicKind", "units.0.dynamicKind"],
    ["Card.suspendedFrom", "cards.0.suspendedFrom"],
    ["Card.prioritySource", "cards.0.prioritySource"],
    // c1 是 suspended 卡：masteredAt 按契约恒为 null（status !== mastered），
    // 这里断言的是 mastered 卡 c2 的 masteredAt 存活。
    ["Card.masteredAt(mastered 卡)", "cards.1.masteredAt"],
    ["Card.mistakeGraduatedAt", "cards.0.mistakeGraduatedAt"],
    ["Card.sourceId", "cards.0.sourceId"],
    ["Card.tags", "cards.0.tags"],
    ["WordDetails.englishDefinition", "wordDetails.0.englishDefinition"],
    ["WordDetails.collocations", "wordDetails.0.collocations"],
    ["WordDetails.synonyms", "wordDetails.0.synonyms"],
    ["WordDetails.confusedWords", "wordDetails.0.confusedWords"],
    ["WordDetails.sourceSentence", "wordDetails.0.sourceSentence"],
    ["SentenceDetails.grammarNote", "sentenceDetails.0.grammarNote"],
    ["Material.tags", "materials.0.tags"],
    ["Review.mode(rebuild)", "reviews.1.mode"],
    ["MistakeGeneration.settings.bilingual", "mistakeGenerations.0.settings.bilingual"],
    ["MistakeGeneration.settings.level", "mistakeGenerations.0.settings.level"],
    ["MistakeGeneration.wordSnapshots.0.status", "mistakeGenerations.0.wordSnapshots.0.status"],
    ["MistakeGeneration.coverage", "mistakeGenerations.0.coverage"],
    ["MistakeGeneration.story.wordNotes", "mistakeGenerations.0.story.wordNotes"],
    ["Adventure.scene", "adventures.0.scene"],
    ["Adventure.themeId", "adventures.0.themeId"],
    ["AdventureNode.sentenceTranslations", "adventures.0.nodes.0.sentenceTranslations"],
    ["AdventureNode.selectedChoiceId", "adventures.0.nodes.0.selectedChoiceId"],
    ["AdventureNode.customAction", "adventures.0.nodes.0.customAction"],
    ["AdventureNode.vocabulary.0.cardId", "adventures.0.nodes.0.vocabulary.0.cardId"],
    ["HuntAttempt.guessedTag", "huntAttempts.0.guessedTag"],
    ["HuntResult.stars", "huntResults.0.stars"],
    ["grammarLessonStagesDone", "grammarLessonStagesDone"],
    ["grammarBoostsDone", "grammarBoostsDone"],
    ["DiaryEntry.followUp", "diaryEntries.0.followUp"],
    ["DiaryEntry.issues.0.tag", "diaryEntries.0.issues.0.tag"],
    ["DiaryEntry.note", "diaryEntries.0.note"],
    ["Schedule.recoveryCount", "schedules.0.recoveryCount"],
    ["LanguageGate.canDo", "languageGates.0.canDo"],
    ["LanguageGate.misreadBranches.0.lampHint", "languageGates.0.misreadBranches.0.lampHint"],
    ["LanguageGate.skeleton.verbLabel", "languageGates.0.skeleton.verbLabel"],
    ["GateAttempt.errorTags", "gateAttempts.0.errorTags"],
    ["GateAttempt.hintsUsed", "gateAttempts.0.hintsUsed"],
    ["RuneState.xp", "runeStates.0.xp"],
    ["RuneState.mastery", "runeStates.0.mastery"],
    ["Settings.reviewOnlyDayKey", "settings.reviewOnlyDayKey"],
    ["Settings.studyScopeUnitIds", "settings.studyScopeUnitIds"],
    ["Settings.reachedMilestoneIds", "settings.reachedMilestoneIds"],
    ["Settings.diaryCorrectionStyle", "settings.diaryCorrectionStyle"],
    ["Settings.lastSyncedAt", "settings.lastSyncedAt"],
    ["Settings.aiProvider.apiKey", "settings.aiProvider.apiKey"],
    ["Settings.dataSync.token", "settings.dataSync.token"]
  ];

  it("往返不丢字段：逐条比对输入与输出（含嵌套可选字段）", () => {
    const input = fullyPopulated();
    const lost: string[] = [];
    for (const [label, path] of mustSurvive) {
      const before = get(input, path);
      const after = get(out, path);
      if (JSON.stringify(before) !== JSON.stringify(after)) {
        lost.push(`${label}（${path}）：输入 ${JSON.stringify(before)} → 输出 ${JSON.stringify(after)}`);
      }
    }
    // 报告用：把丢失清单打出来，测试失败信息即为报告内容。
    expect(lost, `以下字段在迁移往返中未被原样保留：\n${lost.join("\n")}`).toEqual([]);
  });

  it("二次往返稳定：第一次迁移结果再迁移一次不再变化（幂等）", () => {
    const again = parseBackupJson(JSON.stringify(out));
    // 时间戳类字段（缺失时补 now）不在比较范围——只比较结构与用户内容。
    const strip = (value: unknown): unknown =>
      JSON.parse(
        JSON.stringify(value, (key, item) => (key === "nextReviewAt" || key === "unlockedAt" ? "<ts>" : item))
      );
    expect(strip(again)).toEqual(strip(out));
  });

  it("不在 AppData 里的自定义字段被丢弃（白名单语义的确认，非缺陷）", () => {
    const withExtra = fullyPopulated() as unknown as Record<string, unknown>;
    withExtra.cards = [
      { ...(withExtra.cards as Array<Record<string, unknown>>)[0], myCustomField: "用户自己加的" }
    ];
    const migrated = parseBackupJson(JSON.stringify(withExtra));
    expect(
      (migrated.cards[0] as unknown as Record<string, unknown>).myCustomField,
      "白名单会丢掉未知字段——这是设计语义，但也是「字段一旦不在 normalizeXxx 返回对象里就永久消失」的机制"
    ).toBeUndefined();
  });

  it("没有注入内置核心词（seededWordVersions 已标记）", () => {
    expect(out.cards.length, "两张原卡，无补种").toBe(2);
    expect(out.cards.some((card) => card.note === "内置核心词")).toBe(false);
  });

  it("★ 对照：ensureDefaultUnits 在每次迁移都注入内置词书（老用户的书架被塞东西）", () => {
    // ensureDefaultUnits（storage.ts）在两条路径都会跑：
    // seedCoreWords 的分支返回 ensureDefaultUnits(data)，而已补种的分支直接返回它，
    // 所以**每次 saveData / loadData 都会执行**。输入的 1 个自建词书之外，
    // 会多出「核心100 - Unit 1..5」+「冒险积累」。
    //
    // 2026-09-24 修：此前本数写死 5，而内置词表有 115 条 ⇒ 越界的 15 条被兜底
    // 塞进第 1 本（第 1 本实测 35 条）。现在本数由词表长度推导 ⇒ 6 本，
    // 于是「已补种的老用户」本该多出一本**空的** Unit 6。
    // 已加保护：末本**只在有词可装时才补**（见 ensureDefaultUnits 的注释）——
    // 本用例的数据 `seededWordVersions` 已标记（属老用户），故**看不到 Unit 6**，
    // 这与「不给老用户塞空词书」的取向一致。详见 storage.ts 的 seedCoreWords 长注释。
    const injectedTitles = out.units.map((unit) => unit.title);
    expect(
      injectedTitles,
      "输入只有 1 个词书，输出多出 6 个注入词书（5 本核心100 + 冒险积累）"
    ).toEqual([
      "词书",
      "核心100 - Unit 1",
      "核心100 - Unit 2",
      "核心100 - Unit 3",
      "核心100 - Unit 4",
      "核心100 - Unit 5",
      "冒险积累"
    ]);
    expect(out.unitGroups.map((group) => group.title)).toEqual(["分组", "核心100", "冒险积累"]);
  });

  it("【2026-09-24】老用户不会凭空多出空的末本（新用户则会拿到它，因为里面有词）", () => {
    // 本用例走的是老用户路径（seededWordVersions 已标记、无内置词卡）
    expect(
      out.units.some((unit) => unit.id === "core-100-unit-6"),
      "老用户不该多出一本空词书"
    ).toBe(false);

    // 对照：新用户（未标记）补种时，末本有词 ⇒ 照常建立
    const fresh = migrateData({ schemaVersion: 0, cards: [], wordDetails: [], seededWordVersions: [] });
    expect(
      fresh.units.some((unit) => unit.id === "core-100-unit-6"),
      "新用户的末本有词，应照常建立"
    ).toBe(true);
    const lastUnitCards = fresh.cards.filter((card) => card.unitId === "core-100-unit-6");
    expect(lastUnitCards.length, "末本应真的装着词（不是空书）").toBeGreaterThan(0);
  });

  it("【语义收紧 2026-09-23】无 unitId 的旧词卡保持未分配（不再编造归属）", () => {
    /**
     * 修复前：`ensureDefaultUnits` 按「word 卡下标 / 20」编造归属。
     * 与产品设计冲突（删书后 UI 承诺「变成未分配」，并有「收纳未分配词」入口），已修。
     */
    const raw: Record<string, unknown> = {
      schemaVersion: 8,
      seededWordVersions: [CORE_100_WORDS_VERSION],
      units: [],
      unitGroups: [],
      cards: [
        { id: "c1", type: "word", front: "apple", back: "苹果", note: "", tags: [], status: "review", priority: false, createdAt: ISO, updatedAt: ISO },
        { id: "c2", type: "word", front: "pear", back: "梨", note: "", tags: [], status: "review", priority: false, createdAt: ISO, updatedAt: ISO }
      ]
    };
    const migrated = parseBackupJson(JSON.stringify(raw));
    expect(migrated.cards.map((card) => card.unitId), "两张无归属词卡保持未分配").toEqual([
      undefined,
      undefined
    ]);
  });

  it("对照：字段确实被读到了（不是「全字段数据本身就被清空」导致的假绿）", () => {
    expect(out.cards.length).toBe(2);
    expect(out.reviews.length).toBe(2);
    expect(out.adventures.length).toBe(1);
    expect(out.runeStates.length).toBe(1);
    expect(out.settings.dailyNewWords).toBe(7);
    expect(core100Words.length).toBeGreaterThan(0);
  });
});
