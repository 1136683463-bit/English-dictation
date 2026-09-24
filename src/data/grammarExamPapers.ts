/**
 * 语法季末综合卷 · 内容资产（第一季试点）
 *
 * 规格：`deliverables/product-strategy/prd-grammar-season-final-exam-2026-09-24.md`
 *   §4.2④ 阅读理解 ｜ §4.2⑤ 写作 ｜ §8 内容生产规格 ｜ §8.2 三条守门
 *
 * 为什么这些内容必须新写、不能从既有素材里拼：
 *   仓库里没有任何跨课的阅读短文（grep `passage|短文|阅读材料` 命中 0），
 *   而「用季内 dialogue 拼一篇」的便宜路子已被实测否决——第 1 季全 12 课 dialogue 拼起来
 *   只有 144 词、410/410 的旁白行 `zh` 是舞台说明而非译文、且 `me` 行 196/205 与
 *   `targetSentence` 逐字相同（会泄漏本卷约四成的中译英答案）。
 *
 * 三条守门由 `src/edge/verify/ex2-exam-content.test.ts` 强制：
 *   ① 用词 ⊆ 第 1 季已教词（**不与 `core100Words` 取并集**——实测那份表是学术词表，
 *      含 analyze / constitute / distinguish，放进零基础短文是灾难）；
 *   ② 句型 ⊆ 本季已教句型；
 *   ③ 短文不得逐字包含本卷任何中译英答案句。
 *
 * 本文件只放内容，不放判分与流程——判分在 `grammarExamService.ts`。
 */

/** 阅读短文：逐句存英文与中文对照，便于守门逐句判定与页面逐句展示。 */
export interface ExamPassage {
  id: string;
  seasonId: string;
  /** 故事标题（中文，展示用）。 */
  titleZh: string;
  /** 逐句英文。 */
  sentences: string[];
  /** 逐句中文对照，长度必须与 `sentences` 一致（前置教训：npc 行有 410/410 缺译文）。 */
  zhSentences: string[];
  /** 超出本季已教词、但短文里必须出现的词，逐个给中文注释；上限 2 个。 */
  notes: { word: string; zh: string }[];
}

/** 阅读理解小题（一律做成选择题，判分走确定性精确比对）。 */
export type ExamQuestionKind = "detail" | "inference" | "mainIdea";

export interface ExamComprehensionQuestion {
  id: string;
  kind: ExamQuestionKind;
  /** 题干：中文问句，保证零基础也能读懂要问什么。 */
  promptZh: string;
  options: { id: string; en: string; zh: string }[];
  /** 正确选项 id。 */
  answerId: string;
}

/** 写作题：KET 档 25–35 词 / 3–5 句，中文提示骨架，不给英文范文（防泄漏与防背诵）。 */
export interface ExamWritingTask {
  id: string;
  seasonId: string;
  /** 中文提示骨架（只说写什么，不给英文句子）。 */
  promptZh: string;
  /** 必答要点，3 个。 */
  points: string[];
  /** 关键词提示（中文，避免直接给出英文句子）。 */
  keywords: string[];
  minWords: number;
  maxWords: number;
}

/**
 * 第 1 季（L1–L12）的阅读短文。
 *
 * 话题沿用本季「小美的一天」连续剧的场景（公园 / 奶茶 / 朋友 / 图书馆 / 明天做什么），
 * 但**逐字新写**，不复用任何 dialogue 行。句型只用到本季已教的：
 * be 动词、一般现在时（含三单 likes/wants）、规则与不规则过去式（went / saw / played /
 * watched / ate / drank）、will 将来时、物主词（her / his）、并列 and。
 *
 * 刻意避开的三类词：① 本季未教的连接词（but / then / because）；
 * ② 本季未教的过去式（had / were / said）；③ 学术词表里的词。
 */
export const SEASON_1_PASSAGE: ExamPassage = {
  id: "passage-season-1",
  seasonId: "season-1",
  titleZh: "小美的星期天",
  sentences: [
    "Sunday was sunny, and Xiaomei went to the park with her brother and two classmates.",
    "The park was big and nice, and they saw a bird and three cats.",
    "Xiaomei played basketball with Lin, and Lin is her good friend.",
    "After an hour, Lin was hungry, and she ate two sandwiches and drank milk.",
    "Xiaomei drank milk tea, and it was hot and good.",
    "After that, they watched TV at home, and the film was good.",
    "Xiaomei was tired and hungry, and she was happy too.",
    "Tomorrow she will go to the library and draw a picture for her teacher.",
    "Will you be free tomorrow? Come and draw a picture too.",
    "Xiaomei likes music, and her brother wants a new bag."
  ],
  zhSentences: [
    "星期天是晴天，小美和哥哥还有两个同学一起去了公园。",
    "公园又大又好看，他们看到一只鸟和三只猫。",
    "小美和林一起打篮球，林是她的好朋友。",
    "过了一小时，林饿了，她吃了两个三明治、喝了牛奶。",
    "小美喝了奶茶，奶茶又热又好喝。",
    "之后他们在家看电视，电影很好看。",
    "小美又累又饿，她也很开心。",
    "明天她要去图书馆，给老师画一张画。",
    "你明天有空吗？来一起画一张画吧。",
    "小美喜欢音乐，她哥哥想要一个新背包。"
  ],
  notes: []
};

export const SEASON_1_COMPREHENSION: ExamComprehensionQuestion[] = [
  {
    id: "s1-comprehension-1",
    kind: "detail",
    promptZh: "星期天小美和哥哥去了哪里？",
    options: [
      { id: "a", en: "The library.", zh: "图书馆。" },
      { id: "b", en: "The park.", zh: "公园。" },
      { id: "c", en: "The zoo.", zh: "动物园。" },
      { id: "d", en: "The bookstore.", zh: "书店。" }
    ],
    answerId: "b"
  },
  {
    id: "s1-comprehension-2",
    kind: "detail",
    promptZh: "林饿了以后吃了什么？",
    options: [
      { id: "a", en: "An apple.", zh: "一个苹果。" },
      { id: "b", en: "A hamburger.", zh: "一个汉堡。" },
      { id: "c", en: "Two sandwiches.", zh: "两个三明治。" },
      { id: "d", en: "Some noodles.", zh: "一些面条。" }
    ],
    answerId: "c"
  },
  {
    id: "s1-comprehension-3",
    kind: "inference",
    promptZh: "从短文看，林是小美的什么人？",
    options: [
      { id: "a", en: "Her teacher.", zh: "她的老师。" },
      { id: "b", en: "Her classmate and good friend.", zh: "她的同学兼好朋友。" },
      { id: "c", en: "Her brother.", zh: "她的哥哥。" },
      { id: "d", en: "Her mother.", zh: "她的妈妈。" }
    ],
    answerId: "b"
  },
  {
    id: "s1-comprehension-4",
    kind: "mainIdea",
    promptZh: "这篇短文主要讲了什么？",
    options: [
      { id: "a", en: "A Sunday with Xiaomei.", zh: "小美过的一个星期天。" },
      { id: "b", en: "A new bag.", zh: "一个新背包。" },
      { id: "c", en: "A film at home.", zh: "在家看的一部电影。" },
      { id: "d", en: "A bird and three cats.", zh: "一只鸟和三只猫。" }
    ],
    answerId: "a"
  }
];

export const SEASON_1_WRITING: ExamWritingTask = {
  id: "writing-season-1",
  seasonId: "season-1",
  promptZh: "写 3 到 5 句话，说说你的星期天。",
  points: ["星期天天气怎么样", "你和谁在一起", "你做了什么"],
  keywords: ["星期天", "天气", "一起"],
  minWords: 25,
  maxWords: 35
};
