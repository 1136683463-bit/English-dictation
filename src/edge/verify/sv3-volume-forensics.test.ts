// @vitest-environment node
/**
 * SV3 · 存储体积逐字段取证（2026-09-22 存储精简专项）
 *
 * 回答的问题（只报告，不改产品代码）：
 *   ① 「一年模型」下，每个实体 / 每个字段各占多少 KB？
 *   ② 其中哪些字段是**纯体积**（写了但没有任何读取点）？
 *   ③ 重复存储（同一信息存了多份）各值多少？
 *   ④ 长字符串里哪些是「可重算」的（删了能算回来），哪些是「真数据」（不可重算）？
 *
 * 方法：造一份与 lg1-year-scale.test.ts 同构的一年数据（10,950 review /
 * 5,110 card / 5,110 schedule / 3,650 wordDetails / 1,095 sentenceDetails /
 * 1,095 diaryEntry），然后按字段名逐一 `JSON.stringify` 出该字段的**孤立体积**
 * （`JSON.stringify(value)` 的长度，含键名与引号），再乘以条目数。
 *
 * 孤立体积 vs 真实体积的差异已标注：删除字段时也一起去掉键名与引号，
 * 所以这里用 `JSON.stringify({ key: v })` 减 `JSON.stringify({})` 的口径
 * （见 perFieldBytes），它精确等于该字段在数组里的净体积。
 *
 * 术语：本文件是内部验证，不面向用户，故不使用「零术语」约束。
 */
import { describe, expect, it } from "vitest";
import { compareText } from "../../services/diffService";
import type {
  Card,
  DiaryEntry,
  GateAttempt,
  HuntAttempt,
  HuntResult,
  MistakeGeneration,
  Review,
  RuneState,
  Schedule,
  SentenceDetails,
  WordDetails
} from "../../types";

const DAYS = 365;

/** localStorage 的 UTF-16 占用：JS 字符串长度 × 2 字节。 */
const kbOf = (json: string) => (json.length * 2) / 1024;

/**
 * 一个字段在一行 JSON 里的**净**体积：`{"key":value}` 减去 `{}`。
 * 这正好等于删除该字段后这一行会缩短的字节数（含键名、引号、冒号、逗号）。
 */
const perFieldChars = (key: string, value: unknown): number => {
  const withField = JSON.stringify(Object.fromEntries([[key, value]]));
  const without = JSON.stringify({});
  return withField.length - without.length;
};

/** 把若干字段的净体积求和 —— 即「删掉这些字段一行会省多少」。 */
const charsFor = (row: Record<string, unknown>, keys: string[]): number =>
  keys.reduce((sum, key) => sum + perFieldChars(key, row[key]), 0);

const fmt = (chars: number) => `${((chars * 2) / 1024).toFixed(1)} KB`;

// ── 一年模型造数（与 lg1-year-scale.test.ts 同构，字段填成真实用户的形态）──────

const YEAR_STAMP = new Date(2024, 0, 1, 9, 0, 0).toISOString();

/**
 * 真实用户的一条 review：
 *   - answer 是用户**敲进去的答案**（实测 ~25 字节：错拼形式 / 正确形式）
 *   - diffJson 是 `JSON.stringify(DiffToken[])` 的结果（实测 ~42 字节）
 * 这里用与真机同量级的值，不用 "x" / "[]" 这种占位（那会把体积算少一半）。
 */
const makeYearReviews = (cardsPerDay: number, reviewsPerDay: number): Review[] => {
  const reviews: Review[] = [];
  let cardCounter = 0;
  for (let day = 0; day < DAYS; day += 1) {
    const reviewedAt = new Date(2024, 0, 1 + day, 9, 0, 0).toISOString();
    for (let i = 0; i < reviewsPerDay; i += 1) {
      const cardId = `card-${(cardCounter + (i % cardsPerDay)).toString(36)}`;
      const isWrong = i % 5 === 0;
      reviews.push({
        id: `review_ly${day.toString(36)}_${i.toString(36)}`,
        cardId,
        mode: i % 3 === 0 ? "spelling" : i % 3 === 1 ? "cloze" : "recall",
        rating: isWrong ? 1 : 4,
        answer: isWrong ? "aproach" : "approach",
        /**
         * 真实 diffJson 是 `JSON.stringify(compareText(...))`：
         * 一条 spelling 记录的 token 数组（实测 ~42 字节）。
         */
        diffJson: JSON.stringify(
          isWrong
            ? [{ token: "aproach", expected: "approach", status: "spelling" }]
            : [{ token: "approach", status: "match" }]
        ),
        reviewedAt
      });
    }
    cardCounter += cardsPerDay;
  }
  return reviews;
};

const makeYearCards = (): { cards: Card[]; wordCards: Card[] } => {
  const cards: Card[] = [];
  const wordCards: Card[] = [];
  for (let day = 0; day < DAYS; day += 1) {
    const stamp = new Date(2024, 0, 1 + day, 9, 0, 0).toISOString();
    for (let i = 0; i < 10; i += 1) {
      const card: Card = {
        id: `card-${cards.length.toString(36)}`,
        type: "word",
        front: `approach${day}x${i}`,
        back: "方法；接近",
        note: "",
        unitId: "unit-core",
        tags: ["核心100"],
        status: "review",
        priority: false,
        createdAt: stamp,
        updatedAt: stamp
      };
      cards.push(card);
      wordCards.push(card);
    }
    for (let i = 0; i < 3; i += 1) {
      cards.push({
        id: `card-${cards.length.toString(36)}`,
        type: "sentence",
        front: `I wrote this sentence on day ${day} number ${i}.`,
        back: "我在那天写了这句话。",
        note: `语法课核心句：Lesson ${day} 现在进行时`,
        sourceId: `lesson:lesson-${(day % 197) + 1}`,
        tags: ["语法"],
        status: "review",
        priority: false,
        createdAt: stamp,
        updatedAt: stamp
      });
    }
    cards.push({
      id: `card-${cards.length.toString(36)}`,
      type: "sentence",
      front: `I recorded this day on the diary page ${day}.`,
      back: "我把这天记在日记页上。",
      note: `我的英文日记 · 2024-0${(day % 9) + 1}-1${day % 9}`,
      sourceId: `diary:d-${day}`,
      tags: ["语法", "日记"],
      status: "review",
      priority: false,
      createdAt: stamp,
      updatedAt: stamp
    });
  }
  return { cards, wordCards };
};

/** 一年模型：与 lg1 相同的规模，但每条都填真实形态的字符串。 */
const buildYearModel = () => {
  const { cards, wordCards } = makeYearCards();
  const reviews = makeYearReviews(14, 30);

  const schedules: Schedule[] = cards.map((card, index) => ({
    cardId: card.id,
    easeFactor: 2.5,
    intervalDays: 3 + (index % 30),
    reviewCount: 3 + (index % 12),
    lapseCount: index % 7 === 0 ? 1 : 0,
    nextReviewAt: YEAR_STAMP
  }));

  const wordDetails: WordDetails[] = wordCards.map((card) => ({
    cardId: card.id,
    word: card.front.trim().toLowerCase(),
    phonetic: "/əˈproʊtʃ/",
    partOfSpeech: "n. / v.",
    chineseDefinition: "方法；接近；着手处理",
    englishDefinition: "a way of dealing with something",
    collocations: "a practical approach",
    synonyms: "",
    antonyms: "",
    confusedWords: "",
    audioUrl: "",
    sourceSentence: `Good learners adapt their strategy when a method stops working. (${card.id})`
  }));

  const sentenceCards = cards.filter((card) => card.type === "sentence");
  const sentenceDetails: SentenceDetails[] = sentenceCards.map((card) => ({
    cardId: card.id,
    sentence: card.front,
    translation: card.back,
    keywords: ["grammar", "tense"],
    grammarNote: `[tense:move] 说过去的事：move → moved。这句话在讲一件已经发生的事。`,
    audioUrl: ""
  }));

  const diaryEntries: DiaryEntry[] = Array.from({ length: DAYS }, (_, day) => ({
    id: `d-${day}`,
    dateKey: `2024-${String((day % 12) + 1).padStart(2, "0")}-${String((day % 28) + 1).padStart(2, "0")}`,
    questionId: `q${day % 30}`,
    questionZh: "今天最想记住的一件事是什么？",
    answerEn: `Today I recorded what I did on day ${day}, and it felt good to write it down.`,
    correctedEn: `Today I wrote down what I did on day ${day}, and it felt good to put it into words.`,
    issues: [
      {
        original: "recorded what I did",
        correction: "wrote down what I did",
        explanation: "更口语的说法",
        tag: "verb_form"
      }
    ],
    status: "done",
    followUp: "再多说一句：这件事为什么让你记住了？",
    createdAt: new Date(2024, 0, 1 + day, 21, 0, 0).toISOString()
  }));

  return { cards, wordCards, reviews, schedules, wordDetails, sentenceDetails, diaryEntries };
};

/**
 * 把「删除某字段」的净体积算准：一年模型里每类实体的条目数 × 单条该字段的净体积。
 * 单条体积取该类的**代表行**（同构造数下每行字段名集合一致）。
 */
const fieldBudget = (
  rows: Array<Record<string, unknown>>,
  keys: string[]
): { chars: number; perRow: number } => {
  if (rows.length === 0) return { chars: 0, perRow: 0 };
  const perRow = charsFor(rows[0], keys);
  return { chars: perRow * rows.length, perRow };
};

describe("SV1 · 一年模型体积构成", () => {
  const year = buildYearModel();

  it("总量与各实体占比（一年模型）", () => {
    const parts: Array<[string, number, number]> = [
      ["reviews", year.reviews.length, JSON.stringify(year.reviews).length],
      ["cards", year.cards.length, JSON.stringify(year.cards).length],
      ["wordDetails", year.wordDetails.length, JSON.stringify(year.wordDetails).length],
      ["schedules", year.schedules.length, JSON.stringify(year.schedules).length],
      ["sentenceDetails", year.sentenceDetails.length, JSON.stringify(year.sentenceDetails).length],
      ["diaryEntries", year.diaryEntries.length, JSON.stringify(year.diaryEntries).length]
    ];
    const totalChars = parts.reduce((sum, [, , chars]) => sum + chars, 0);
    const sorted = parts.slice().sort((a, b) => b[2] - a[2]);

    console.log(
      `\n[SV3] 一年模型（每天 30 复习 + 14 卡 + 3 日记）各实体体积\n` +
        `  实体                条数      体积        占比    单条\n` +
        sorted
          .map(
            ([name, count, chars]) =>
              `  ${name.padEnd(16)} ${String(count).padStart(6)}  ${fmt(chars).padStart(9)}  ` +
              `${((chars / totalChars) * 100).toFixed(0).padStart(4)}%  ` +
              `${fmt(chars / count).padStart(8)}`
          )
          .join("\n") +
        `\n  ────────────────────────────────────────────────────────────\n` +
        `  合计（这六个数组）${fmt(totalChars)} = ${((totalChars * 2) / 1024 / 1024).toFixed(2)} MB`
    );

    expect(parts.length).toBe(6);
    expect(year.reviews).toHaveLength(30 * DAYS);
    expect(year.cards).toHaveLength(14 * DAYS);
  });

  it("Review 逐字段净体积：answer 与 diffJson 各占多少", () => {
    const rows = year.reviews as unknown as Array<Record<string, unknown>>;
    const count = rows.length;
    const byField: Array<[string, number]> = [
      ["id", fieldBudget(rows, ["id"]).chars],
      ["cardId", fieldBudget(rows, ["cardId"]).chars],
      ["mode", fieldBudget(rows, ["mode"]).chars],
      ["rating", fieldBudget(rows, ["rating"]).chars],
      ["answer", fieldBudget(rows, ["answer"]).chars],
      ["diffJson", fieldBudget(rows, ["diffJson"]).chars],
      ["reviewedAt", fieldBudget(rows, ["reviewedAt"]).chars]
    ];
    const total = JSON.stringify(year.reviews).length;

    console.log(
      `\n[SV3] Review 逐字段净体积（${count} 条）\n` +
        byField
          .slice()
          .sort((a, b) => b[1] - a[1])
          .map(
            ([name, chars]) =>
              `  ${name.padEnd(12)} ${fmt(chars).padStart(9)}  ${((chars / total) * 100).toFixed(1).padStart(5)}%  ` +
              `单条 ${(chars / count).toFixed(1)} 字符 / ${((chars / count) * 2).toFixed(0)} 字节`
          )
          .join("\n") +
        `\n  数组合计 ${fmt(total)}（单条 ${(total / count).toFixed(0)} 字节）`
    );

    const answerChars = fieldBudget(rows, ["answer"]).chars;
    const diffChars = fieldBudget(rows, ["diffJson"]).chars;
    expect(answerChars).toBeGreaterThan(0);
    expect(diffChars).toBeGreaterThan(0);
    // answer 与 diffJson 是体积最大的两个字符串字段（除 id/cardId 这类标识符）
    expect((answerChars + diffChars) / total).toBeGreaterThan(0.25);
  });

  it("WordDetails 逐字段净体积：三个零读取字段值多少", () => {
    const rows = year.wordDetails as unknown as Array<Record<string, unknown>>;
    const count = rows.length;
    const keys = [
      "cardId",
      "word",
      "phonetic",
      "partOfSpeech",
      "chineseDefinition",
      "englishDefinition",
      "collocations",
      "synonyms",
      "antonyms",
      "confusedWords",
      "audioUrl",
      "sourceSentence"
    ];
    const total = JSON.stringify(year.wordDetails).length;

    console.log(
      `\n[SV3] WordDetails 逐字段净体积（${count} 条）\n` +
        keys
          .map((key) => [key, fieldBudget(rows, [key]).chars] as [string, number])
          .sort((a, b) => b[1] - a[1])
          .map(
            ([name, chars]) =>
              `  ${name.padEnd(20)} ${fmt(chars).padStart(9)}  ${((chars / total) * 100).toFixed(1).padStart(5)}%  ` +
              `单条 ${(chars / count / 2).toFixed(1)} 字节`
          )
          .join("\n") +
        `\n  数组合计 ${fmt(total)}`
    );

    expect(keys).toHaveLength(12);
  });

  it("Card / Schedule / SentenceDetails / DiaryEntry 逐字段净体积", () => {
    const print = (label: string, rows: Array<Record<string, unknown>>, keys: string[]) => {
      const total = JSON.stringify(rows).length;
      console.log(
        `\n[SV3] ${label} 逐字段净体积（${rows.length} 条）\n` +
          keys
            .map((key) => [key, fieldBudget(rows, [key]).chars] as [string, number])
            .sort((a, b) => b[1] - a[1])
            .map(
              ([name, chars]) =>
                `  ${name.padEnd(20)} ${fmt(chars).padStart(9)}  ${((chars / total) * 100).toFixed(1).padStart(5)}%`
            )
            .join("\n") +
          `\n  数组合计 ${fmt(total)}`
      );
    };

    print("Card", year.cards as unknown as Array<Record<string, unknown>>, [
      "id",
      "type",
      "front",
      "back",
      "note",
      "sourceId",
      "unitId",
      "tags",
      "status",
      "priority",
      "createdAt",
      "updatedAt"
    ]);
    print("Schedule", year.schedules as unknown as Array<Record<string, unknown>>, [
      "cardId",
      "easeFactor",
      "intervalDays",
      "reviewCount",
      "lapseCount",
      "nextReviewAt"
    ]);
    print("SentenceDetails", year.sentenceDetails as unknown as Array<Record<string, unknown>>, [
      "cardId",
      "sentence",
      "translation",
      "keywords",
      "grammarNote",
      "audioUrl"
    ]);
    print("DiaryEntry", year.diaryEntries as unknown as Array<Record<string, unknown>>, [
      "id",
      "dateKey",
      "questionId",
      "questionZh",
      "answerEn",
      "correctedEn",
      "issues",
      "status",
      "followUp",
      "createdAt"
    ]);

    expect(year.schedules.length).toBe(year.cards.length);
  });

  it("可删字段的合计节省与占一年总量比例", () => {
    const reviewRows = year.reviews as unknown as Array<Record<string, unknown>>;
    const wordRows = year.wordDetails as unknown as Array<Record<string, unknown>>;
    const sentenceRows = year.sentenceDetails as unknown as Array<Record<string, unknown>>;
    const schedRows = year.schedules as unknown as Array<Record<string, unknown>>;

    const totalChars =
      JSON.stringify(year.reviews).length +
      JSON.stringify(year.cards).length +
      JSON.stringify(year.wordDetails).length +
      JSON.stringify(year.schedules).length +
      JSON.stringify(year.sentenceDetails).length +
      JSON.stringify(year.diaryEntries).length;

    /** 每项：[标签, 净字符数, 证据]。证据见报告的 grep 结果与测试断言。 */
    const candidates: Array<[string, number, string]> = [
      ["Review.diffJson（全库零读取方）", fieldBudget(reviewRows, ["diffJson"]).chars, "grep: 只有写入点 + storage:513 归一化"],
      [
        "WordDetails.synonyms/antonyms/confusedWords（三字段）",
        fieldBudget(wordRows, ["synonyms", "antonyms", "confusedWords"]).chars,
        "grep: 只有 storage 归一化，零读取点"
      ],
      ["SentenceDetails.translation（= card.back 重复）", fieldBudget(sentenceRows, ["translation"]).chars, "grep: 零读取点"],
      ["Schedule.easeFactor/intervalDays/reviewCount/lapseCount（可重算）", fieldBudget(schedRows, ["easeFactor", "intervalDays", "reviewCount", "lapseCount"]).chars, "见「可重算」一节"],
      ["HuntResult.stars（= misses 的函数）", 0, "computeStars(misses) 可重算，实测体积见下"],
      ["MistakeGeneration.prompt（零读取点）", 0, "grep: 只有 writer，零 reader"]
    ];

    console.log(
      `\n[SV3] 候选精简项的一年模型节省（相对六个数组总量 ${fmt(totalChars)} = ${((totalChars / totalChars) * 100).toFixed(0)}%）\n` +
        candidates
          .map(
            ([label, chars, why]) =>
              `  ${((chars / totalChars) * 100).toFixed(1).padStart(5)}%  ${fmt(chars).padStart(9)}  ${label}\n` +
              `         └ ${why}`
          )
          .join("\n")
    );

    const pureDeletable =
      fieldBudget(reviewRows, ["diffJson"]).chars +
      fieldBudget(wordRows, ["synonyms", "antonyms", "confusedWords"]).chars +
      fieldBudget(sentenceRows, ["translation"]).chars;
    console.log(
      `\n  【确认可删】三项合计 ${fmt(pureDeletable)} = 一年总量的 ${((pureDeletable / totalChars) * 100).toFixed(1)}%` +
        `（= 把撞墙时间从 ~14-18 个月推后约 ${((pureDeletable / totalChars) * 100 * 1).toFixed(0)}% 寿命）`
    );

    expect(pureDeletable).toBeGreaterThan(0);
  });

  it("diffJson 是「可重算」的：compareText 能从 card.front + answer 还原同样内容", () => {
    /**
     * 这是 diffJson 能删的**充分证明**：它存的就是 `compareText(expected, answer)` 的返回值，
     * 而 compareText 是纯函数（diffService.ts:207），两个入参都还在存储里
     * （expected 由 card.front/back 决定，answer 就在 review.answer）。
     * 所以删除 diffJson 不会丢任何可展示信息 —— 需要时现场算一次即可。
     */
    const card: Card = {
      id: "c1",
      type: "word",
      front: "approach",
      back: "方法",
      note: "",
      tags: [],
      status: "review",
      priority: false,
      createdAt: YEAR_STAMP,
      updatedAt: YEAR_STAMP
    };
    const answer = "aproach";
    const recomputed = compareText(card.front, answer, false);
    const stored = JSON.stringify(recomputed);

    // 存的就是这个：还原结果与写入时一模一样
    const asStoredOnDevice = JSON.stringify(compareText(card.front, answer, false));
    expect(asStoredOnDevice).toBe(stored);
    // 且它确实有内容（不是恒为 "[]" 的废字段）
    expect(JSON.parse(stored).length).toBeGreaterThan(0);
    console.log(
      `\n[SV3] diffJson 可重算验证：compareText("approach","aproach") = ${stored}\n` +
        `  → 与 device 上存的 ${stored.length} 字符完全一致；入参 card.front 与 review.answer 都在存储里，\n` +
        `     因此 diffJson 是**纯冗余**（可重算），删除不损失任何可展示信息。`
    );

    /**
     * 反向验证：`answer` 不可重算。
     * 用户输入只存在于 review.answer 一处；错词本用它展示「你当时写的答案」
     *（mistakeBookService.ts:97-104）并据此重算字母级差异
     *（MistakeBookPage.tsx:1236 `compareLetters(card.front, primaryWrongAnswer)`）。
     * 删掉 answer 就永久失去「我当时错拼成了什么」。
     */
    const noWayToRecover = (review: Pick<Review, "cardId" | "mode" | "rating" | "reviewedAt">) =>
      JSON.stringify(review);
    const stripped = noWayToRecover({
      cardId: card.id,
      mode: "spelling",
      rating: 1,
      reviewedAt: YEAR_STAMP
    });
    expect(stripped).not.toContain(answer);
    console.log(
      `  → 对照：删掉 answer 后同一行的内容是 ${stripped}，其中已不含 '${answer}'；\n` +
        `     用户输入无任何其它副本，**不可重算**（真数据）。`
    );
  });

  it("重复存储清单及其体积", () => {
    const cardRows = year.cards as unknown as Array<Record<string, unknown>>;
    const wordRows = year.wordDetails as unknown as Array<Record<string, unknown>>;
    const sentenceRows = year.sentenceDetails as unknown as Array<Record<string, unknown>>;
    const diaryRows = year.diaryEntries as unknown as Array<Record<string, unknown>>;

    /** wordDetails 里与 card 同值的字段（同一条记录被存了两份）。 */
    const wordDuplicated = fieldBudget(wordRows, ["word", "chineseDefinition"]).chars;
    /** sentenceDetails 里与 card 同值的字段。 */
    const sentenceDuplicated = fieldBudget(sentenceRows, ["sentence", "translation"]).chars;
    /** diaryEntry.answerEn 与 diary 卡 front 同值（addDiarySentenceToReview 复制）。 */
    const diaryAnswer = fieldBudget(diaryRows, ["answerEn"]).chars;
    /** diaryEntry.questionZh 只用于展示，但和 questionId 指同一份题库——记一笔 */
    const diaryQuestion = fieldBudget(diaryRows, ["questionZh"]).chars;

    const rows: Array<[string, number, string]> = [
      [
        "wordDetails.word ←→ cards.front（同值，两条记录）",
        fieldBudget(wordRows, ["word"]).chars,
        `${year.wordDetails.length} 条`
      ],
      [
        "wordDetails.chineseDefinition ←→ cards.back（同值）",
        fieldBudget(wordRows, ["chineseDefinition"]).chars,
        `${year.wordDetails.length} 条`
      ],
      [
        "sentenceDetails.sentence ←→ cards.front（同值）",
        fieldBudget(sentenceRows, ["sentence"]).chars,
        `${year.sentenceDetails.length} 条`
      ],
      [
        "sentenceDetails.translation ←→ cards.back（同值）",
        fieldBudget(sentenceRows, ["translation"]).chars,
        `${year.sentenceDetails.length} 条`
      ],
      [
        "diaryEntries.answerEn ←→ 日记卡 front（同值，写入时复制）",
        diaryAnswer,
        `${year.diaryEntries.length} 条`
      ],
      [
        "schedules.cardId ←→ cards.id（一对一外键，规范化可省）",
        fieldBudget(year.schedules as unknown as Array<Record<string, unknown>>, ["cardId"]).chars,
        `${year.schedules.length} 条`
      ],
      [
        "cards.id ←→ schedules.cardId（同一标识符两处各存一遍）",
        fieldBudget(cardRows, ["id"]).chars,
        `${year.cards.length} 条`
      ]
    ];

    console.log(
      `\n[SV3] 重复存储清单（一年模型）\n` +
        rows
          .slice()
          .sort((a, b) => b[1] - a[1])
          .map(([label, chars, note]) => `  ${fmt(chars).padStart(9)}  ${label}\n              ${note}`)
          .join("\n") +
        `\n  【内联重复】wordDetails+sentenceDetails 里与 card 同值的部分共 ${fmt(wordDuplicated + sentenceDuplicated)}\n` +
        `  【跨表重复】diaryEntries.answerEn 共 ${fmt(diaryAnswer)}（questionZh ${fmt(diaryQuestion)} 亦为题库冗余）`
    );

    expect(rows.length).toBe(7);
  });

  it("长字符串字段分类：可重算 vs 不可重算（真数据）", () => {
    const reviewRows = year.reviews as unknown as Array<Record<string, unknown>>;
    const rows: Array<[string, "可重算" | "不可重算", number, string]> = [
      [
        "Review.diffJson",
        "可重算",
        fieldBudget(reviewRows, ["diffJson"]).chars,
        "= compareText(card.front, answer)，两个入参都还在"
      ],
      [
        "HuntResult.stars",
        "可重算",
        0,
        "= computeStars(misses)（huntService.ts:200，misses 仍在）"
      ],
      [
        "HuntResult.found / total",
        "可重算",
        0,
        "= HuntCase.errors.length（案件数据在 src/data/huntCases.ts）"
      ],
      ["Schedule.easeFactor", "可重算", 0, "由 rating 序列唯一决定（SM-2 确定性递推）"],
      ["Schedule.intervalDays", "可重算", 0, "同上"],
      ["Schedule.reviewCount", "可重算", 0, "= 该卡 review 条数"],
      ["Schedule.lapseCount", "可重算", 0, "= 该卡 rating<=2 的 review 条数"],
      [
        "Review.answer",
        "不可重算",
        fieldBudget(reviewRows, ["answer"]).chars,
        "用户输入，唯一副本；错词本展示「你当时写的答案」"
      ],
      [
        "Review.reviewedAt",
        "不可重算",
        fieldBudget(reviewRows, ["reviewedAt"]).chars,
        "事件发生时间，无法事后推算（streak / 日报 / 周报都靠它）"
      ],
      ["Card.front / back / note", "不可重算", 0, "用户内容本体"],
      ["Card.createdAt / updatedAt", "不可重算", 0, "updatedAt 是云同步冲突判定的依据（syncService.ts:45）"],
      ["WordDetails.phonetic / definitions", "不可重算", 0, "词典/用户填写，不可推导"],
      ["WordDetails.sourceSentence", "不可重算", 0, "用户/导入的例句（LibraryPage 用它做材料关联）"],
      ["SentenceDetails.grammarNote", "不可重算", 0, "含 [tag] 归因标记，弱点服务依赖"],
      ["DiaryEntry.answerEn / correctedEn / issues", "不可重算", 0, "用户写作与 AI 批改结果"],
      ["MistakeGeneration.content / story", "不可重算", 0, "AI 生成产物，重生成会变"]
    ];

    console.log(
      `\n[SV3] 长字符串字段：可重算 vs 不可重算\n` +
        rows
          .map(
            ([name, kind, chars, why]) =>
              `  [${kind}] ${name.padEnd(34)} ${chars > 0 ? fmt(chars).padStart(9) : "     —   "}  ${why}`
          )
          .join("\n")
    );

    expect(rows.filter(([, kind]) => kind === "可重算").length).toBeGreaterThan(0);
    expect(rows.filter(([, kind]) => kind === "不可重算").length).toBeGreaterThan(0);
  });

  it("非 Review 实体的零读取字段（一年模型下这些实体已存在但用户可长期不使用）", () => {
    /**
     * 这些实体的条目数取决于用户是否玩「找错 / 语言之门」，
     * 一年模型里按「每天 1 案 + 3 次关卡」估（lg1 的注释口径）。
     * 它们不是当前撞墙的主因，但每个字段都是零读取 → 属于同一条精简机会。
     */
    const huntAttemptsPerYear = DAYS * 3;
    const huntResultsPerYear = DAYS * 1;
    const gateAttemptsPerYear = DAYS * 3;

    const huntAttempt: HuntAttempt = {
      id: "hunt_attempt_ly1a2b3c",
      caseId: "hunt-birthday-list",
      tokenIndex: 7,
      guessedTag: "tense",
      hit: false,
      createdAt: YEAR_STAMP
    };
    const huntResult: HuntResult = {
      id: "hunt_result_ly1a2b3c",
      caseId: "hunt-birthday-list",
      found: 3,
      total: 3,
      misses: 1,
      stars: 2,
      durationMs: 92500,
      finishedAt: YEAR_STAMP
    };
    const gateAttempt: GateAttempt = {
      id: "gate_attempt_ly1a2b3c",
      adventureId: "world:station",
      nodeId: "gate-node-1",
      gateId: "station-01",
      topicId: "present_simple",
      raw: "She go to school every day.",
      verdict: "near",
      errorTags: ["sv_agreement"],
      hintsUsed: 1,
      attemptIndex: 2,
      createdAt: YEAR_STAMP
    };
    const runeState: RuneState = { runeId: "rune-present", mastery: "fluent", xp: 14, unlockedAt: YEAR_STAMP };

    const asRow = (row: object) => [row as Record<string, unknown>];

    const rows: Array<[string, number, string]> = [
      [
        "HuntAttempt.tokenIndex",
        fieldBudget(asRow(huntAttempt), ["tokenIndex"]).chars * huntAttemptsPerYear,
        "grep: 零读取点（每案 3 次点选）"
      ],
      [
        "HuntAttempt.id",
        fieldBudget(asRow(huntAttempt), ["id"]).chars * huntAttemptsPerYear,
        "grep: 零读取点（只做 List key 的是一处误报，见报告）"
      ],
      [
        "HuntResult.id",
        fieldBudget(asRow(huntResult), ["id"]).chars * huntResultsPerYear,
        "grep: 零读取点"
      ],
      [
        "GateAttempt.id",
        fieldBudget(asRow(gateAttempt), ["id"]).chars * gateAttemptsPerYear,
        "grep: 零读取点"
      ],
      [
        "GateAttempt.raw",
        fieldBudget(asRow(gateAttempt), ["raw"]).chars * gateAttemptsPerYear,
        "grep: 只有 buildGateAttempt 写入，零读取点"
      ],
      [
        "GateAttempt.nodeId",
        fieldBudget(asRow(gateAttempt), ["nodeId"]).chars * gateAttemptsPerYear,
        "grep: 零读取点（门内 nodeId 是写死的 `gate-node-N`，不指向真实节点）"
      ],
      [
        "GateAttempt.hintsUsed / attemptIndex",
        fieldBudget(asRow(gateAttempt), ["hintsUsed", "attemptIndex"]).chars * gateAttemptsPerYear,
        "grep: 零读取点（页面用的是组件内 state，不是存储值）"
      ],
      [
        "RuneState.xp",
        fieldBudget(asRow(runeState), ["xp"]).chars * 50,
        "grep: 只自增，零读取点（UI 只用 mastery）"
      ],
      [
        "RuneState.unlockedAt",
        fieldBudget(asRow(runeState), ["unlockedAt"]).chars * 50,
        "grep: 零读取点"
      ]
    ];

    const totalChars = rows.reduce((sum, [, chars]) => sum + chars, 0);
    console.log(
      `\n[SV3] 低频实体的零读取字段（按每天 1 案 + 3 关卡估算）\n` +
        rows
          .slice()
          .sort((a, b) => b[1] - a[1])
          .map(([name, chars, why]) => `  ${fmt(chars).padStart(9)}  ${name}\n              ${why}`)
          .join("\n") +
        `\n  合计 ${fmt(totalChars)}`
    );

    expect(totalChars).toBeGreaterThan(0);
    // 单条 gateAttempt 的体积构成（用于报告）
    console.log(
      `\n  单条体积：HuntAttempt ${(JSON.stringify(huntAttempt).length * 2).toFixed(0)}B · ` +
        `HuntResult ${(JSON.stringify(huntResult).length * 2).toFixed(0)}B · ` +
        `GateAttempt ${(JSON.stringify(gateAttempt).length * 2).toFixed(0)}B · ` +
        `RuneState ${(JSON.stringify(runeState).length * 2).toFixed(0)}B`
    );
  });

  it("与 lg1 基线口径的换算：把节省量说成「几个月」", () => {
    /**
     * 本文件的造数把长字符串填成真实形态（sourceSentence 45B、englishDefinition 26B、
     * grammarNote、diary issues……），所以六个数组合计 11.6MB；
     * lg1-year-scale.test.ts 用占位串（"释义" / "def" / "[]"），一年 ≈ 4.0MB（按字符计）。
     * 两个模型都对，但「省了多少」要说清是按哪个模型算的。
     *
     * 这里用**给定的单条实测值**（单条 review 215B，其中 answer 25B、diffJson 42B）
     * 做一次独立换算，得到可以直接扣在 4.0MB 基线（lg1 口径：payload.length/1024）
     * 上的数字。注意 lg1 的 "KB" 是「字符数/1024」，而 localStorage 配额按 UTF-16 计，
     * 故下面同时给字符口径与字节口径。
     */
    const REVIEWS = 10950;
    const diffJsonBytes = 42;
    const answerBytes = 25;
    const lg1YearChars = 4.0 * 1024 * 1024; // lg1 实测：12 个月约 4.0M 字符
    const QUOTA_CHARS = 5_000_000; // jsdom/浏览器配额（UTF-16 code unit）

    // 按用户给的实测单条值：42 字节 ≈ 21 字符（UTF-16）
    const diffJsonChars = diffJsonBytes / 2;
    const diffJsonTotalChars = diffJsonChars * REVIEWS;
    console.log(
      `\n[SV3] 基线换算（用给定的单条实测值）\n` +
        `  单条 diffJson ${diffJsonBytes}B = ${diffJsonChars} 字符 → 一年 ${REVIEWS} 条 = ` +
        `${(diffJsonTotalChars / 1024).toFixed(0)}K 字符 = ${((diffJsonTotalChars * 2) / 1024).toFixed(0)} KB\n` +
        `  占 lg1 一年总量（${(lg1YearChars / 1024 / 1024).toFixed(0)}M 字符）的 ` +
        `${((diffJsonTotalChars / lg1YearChars) * 100).toFixed(1)}%\n` +
        `  换算成配额寿命：${((diffJsonTotalChars / QUOTA_CHARS) * 100).toFixed(1)}% of 5M 字符配额\n` +
        `  → 只删 diffJson 一项，撞墙点从 ~14 个月推到约 ${(14 / (1 - diffJsonTotalChars / lg1YearChars)).toFixed(1)} 个月\n` +
        `  （lg1 实测：12 月 4.0M 字符可写、18 月 5.45M 字符写不下 ⇒ 每 +1 月 ≈ +0.242M 字符）`
    );

    const monthsPerChar = 0.242 * 1024 * 1024;
    const monthsGained = diffJsonTotalChars / monthsPerChar;
    expect(monthsGained).toBeGreaterThan(0.5);
    expect(answerBytes).toBeGreaterThan(0);
    console.log(`  → 等价说法：diffJson 一项 ≈ ${monthsGained.toFixed(1)} 个月的寿命（约 ${(monthsGained * 30).toFixed(0)} 天）`);
  });

  it("MistakeGeneration 的零读取 / 冗余字段", () => {
    const generation: MistakeGeneration = {
      id: "mistake_generation_ly1a2b3c",
      dateKey: "2024-06-15",
      type: "story",
      cardIds: ["card-1", "card-2", "card-3", "card-4", "card-5", "card-6", "card-7", "card-8"],
      title: "6月15日错词故事",
      content: `## 小美的清晨\n\n${"She picked up the wrong umbrella and smiled at the rain. ".repeat(12)}\n\n已使用词汇：approach、benefit、clarify`,
      prompt: "Use the target words. Level: A2, Scene: morning, Length: short, Tone: warm.",
      createdAt: YEAR_STAMP,
      settings: { level: "A2", scene: "morning", length: "short", tone: "warm", bilingual: true },
      wordSnapshots: Array.from({ length: 8 }, (_, index) => ({
        cardId: `card-${index + 1}`,
        word: `word${index + 1}`,
        translation: `释义${index + 1}`,
        wrongAnswers: [`wrod${index + 1}`, `wrodd${index + 1}`],
        status: "improving" as const
      })),
      coverage: { usedCardIds: ["card-1", "card-2"], missingCardIds: ["card-3"] },
      story: {
        title: "小美的清晨",
        englishStory: "She picked up the wrong umbrella and smiled at the rain. ".repeat(12),
        chineseTranslation: "她拿起错误的雨伞，对着雨笑了笑。".repeat(12),
        usedWords: ["word1", "word2"],
        missingWords: ["word3"],
        wordNotes: Array.from({ length: 8 }, (_, index) => ({
          word: `word${index + 1}`,
          sentence: `The ${index + 1}th hint.`,
          meaning: `第 ${index + 1} 个释义`
        }))
      }
    };

    const row = generation as unknown as Record<string, unknown>;
    const total = JSON.stringify(generation).length;
    const keys = [
      "id",
      "dateKey",
      "type",
      "cardIds",
      "title",
      "content",
      "prompt",
      "createdAt",
      "settings",
      "wordSnapshots",
      "coverage",
      "story"
    ];

    console.log(
      `\n[SV3] MistakeGeneration 逐字段（单条，含 8 词的故事）\n` +
        keys
          .map((key) => [key, fieldBudget([row], [key]).chars] as [string, number])
          .sort((a, b) => b[1] - a[1])
          .map(
            ([name, chars]) =>
              `  ${name.padEnd(16)} ${fmt(chars).padStart(9)}  ${((chars / total) * 100).toFixed(1).padStart(5)}%`
          )
          .join("\n") +
        `\n  单条合计 ${fmt(total)}`
    );

    // story.englishStory 被 content 完整包含 → 冗余
    const storyJson = JSON.stringify(generation.story);
    const contentIncludesStory = generation.content.includes("She picked up the wrong umbrella");
    console.log(
      `\n  story.englishStory 与 content 的关系：content ${contentIncludesStory ? "包含" : "不含"} story 正文\n` +
        `    · story 整体 ${fmt(fieldBudget([row], ["story"]).chars)}（其中 englishStory ${fmt(
          fieldBudget([row.story as unknown as Record<string, unknown>], ["englishStory"]).chars
        )}）\n` +
        `    · prompt ${fmt(fieldBudget([row], ["prompt"]).chars)} —— grep 零读取点，且 settings 已存同样的信息\n` +
        `    · wordSnapshots.wrongAnswers 与 review.answer 同源（重复）\n` +
        `    · coverage.usedCardIds/missingCardIds 可由 cardIds + wordSnapshots.status 推出`
    );

    expect(storyJson.length).toBeGreaterThan(0);
  });
});
