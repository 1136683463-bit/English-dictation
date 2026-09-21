/**
 * 「重放题」替换清单（2026-09-20 · 选题逻辑重构）
 *
 * 病灶：94 道练段题与课内「看」段素材**中英文双重对应**——
 * 用户在看段已经建立了「这句中文 → 这句英文」的直接映射，
 * 练段只是把这个映射重放一遍，不需要任何组织。
 *
 *   例：L4 看段例句「I want an umbrella. ← 我想要一把伞。」
 *       练段题目「你想说：我想要一把伞。」→ 答案 I want an umbrella.
 *
 * 判据（两道同时满足才算重放）：
 *   1. 答案句与看段某句归一化后完全相同
 *   2. 题目中文提示与那句的中文释义相似度 ≥0.8
 *
 * 替换标准：
 *   1. 保持本课语法点不变（同句型）
 *   2. 换实义内容（宾语/地点/时间/动作至少换一个）
 *   3. 所有词都在本课（含此前累计）教过
 *   4. 不构成新的重放（中英都不与看段对应）
 */
export interface ReplayReplacement {
  n: number;
  /** 原题答案（定位用） */
  from: string;
  promptZh: string;
  tokens: string[];
  distractors: string[];
  answer: string;
}

export const REPLAY_REPLACEMENTS: ReplayReplacement[] = [
  // ── L1–L20（33 题）───────────────────────────────────────
  // 【豁免】L12「It will rain.」——本课 will 句式的自然组合已全部用于课内素材
  // （It will rain / We will go tomorrow / I will call you / She will come / I will draw /
  //   It will not rain / Will you come），穷举单词替换无合法候选，保留原题。


  // ── L21–L60（13 题）──────────────────────────────────────

  // ── L61–L100（23 题）─────────────────────────────────────

  // ── L101–L158（25 题）────────────────────────────────────

  // ── 二轮补（26 课 · 28 题）────────────────────────────
  { n: 3, from: "I have a dream.",
    promptZh: "介绍你的东西，你想说：我有一本书。",
    tokens: ["I", "have", "a", "book."], distractors: ["has"], answer: "I have a book." },
  { n: 3, from: "I have a red cup.",
    promptZh: "说你的东西，你想说：我有一个大杯子。",
    tokens: ["I", "have", "a", "big", "cup."], distractors: ["has"], answer: "I have a big cup." },
  { n: 3, from: "I have a new bike.",
    promptZh: "说你的新东西，你想说：我有一个新杯子。",
    tokens: ["I", "have", "a", "new", "cup."], distractors: ["has"], answer: "I have a new cup." },
  { n: 29, from: "It is going to rain.",
    promptZh: "说她的计划，你想说：她打算看电影。",
    tokens: ["She", "is", "going", "to", "watch", "a", "movie."], distractors: ["are"], answer: "She is going to watch a movie." },
  { n: 31, from: "It is the best movie this year.",
    promptZh: "说最好的一个，你想说：这是最好的一个。",
    tokens: ["This", "is", "the", "best", "one."], distractors: ["better"], answer: "This is the best one." },
  { n: 33, from: "That one is yours.",
    promptZh: "指远处的东西，你想说：那个包是她的。",
    tokens: ["That", "bag", "is", "hers."], distractors: ["her"], answer: "That bag is hers." },
  { n: 39, from: "I know the boy who is tall.",
    promptZh: "说你认识的人，你想说：我认识那个戴眼镜的男孩。",
    tokens: ["I", "know", "the", "boy", "who", "wears", "glasses."], distractors: ["which"], answer: "I know the boy who wears glasses." },
  { n: 56, from: "School starts in September.",
    promptZh: "说开学时间，你想说：学校在三月开学。",
    tokens: ["School", "starts", "in", "March."], distractors: ["on"], answer: "School starts in March." },
  { n: 58, from: "He does his homework carefully.",
    promptZh: "夸同学读书，你想说：她读得很认真。",
    tokens: ["She", "reads", "carefully."], distractors: ["careful"], answer: "She reads carefully." },
  { n: 60, from: "There were two birds in the park.",
    promptZh: "回忆公园，你想说：那天公园里有一朵花。",
    tokens: ["There", "was", "a", "flower", "in", "the", "park."], distractors: ["were"], answer: "There was a flower in the park." },
  { n: 65, from: "This book is as new as that one.",
    promptZh: "比两样东西，你想说：这本书和那本一样好。",
    tokens: ["This", "book", "is", "as", "good", "as", "that", "one."], distractors: ["better"], answer: "This book is as good as that one." },
  { n: 82, from: "I put my bag on the desk.",
    promptZh: "收拾东西，你想说：我把书放在桌子上了。",
    tokens: ["I", "put", "my", "book", "on", "the", "desk."], distractors: ["putted"], answer: "I put my book on the desk." },
  { n: 85, from: "This one is mine.",
    promptZh: "说这些东西的归属，你想说：那个包是她的。",
    tokens: ["That", "bag", "is", "hers."], distractors: ["her"], answer: "That bag is hers." },
  { n: 87, from: "It's nice to see you.",
    promptZh: "说今天天气，你想说：今天天气很好。",
    tokens: ["It's", "nice", "today."], distractors: ["Its"], answer: "It's nice today." },
  { n: 88, from: "It's cloudy today.",
    promptZh: "看窗外，你想说：今天天气很好。",
    tokens: ["It's", "nice", "today."], distractors: ["Its"], answer: "It's nice today." },
  { n: 89, from: "What a nice bag!",
    promptZh: "看到大房子，你想说：多好的房子啊！",
    tokens: ["What", "a", "nice", "house!"], distractors: ["nice a"], answer: "What a nice house!" },
  { n: 96, from: "It is raining.",
    promptZh: "回忆那天晚上，你想说：当时正在下雨。",
    tokens: ["It", "was", "raining", "that", "night."], distractors: ["were"], answer: "It was raining that night." },
  { n: 97, from: "When you called, I was sleeping.",
    promptZh: "说昨天被打断的事，你想说：你打电话时我正在做饭。",
    tokens: ["When", "you", "called,", "I", "was", "cooking."], distractors: ["cooked"], answer: "When you called, I was cooking." },
  { n: 98, from: "While I was cooking, she was reading.",
    promptZh: "说两件事同时，你想说：我做饭的时候他在睡觉。",
    tokens: ["While", "I", "was", "cooking,", "he", "was", "sleeping."], distractors: ["cooks"], answer: "While I was cooking, he was sleeping." },
  { n: 129, from: "It smells nice.",
    promptZh: "闻到厨房的味道，你想说：汤闻起来很好。",
    tokens: ["The", "soup", "smells", "good."], distractors: ["smell"], answer: "The soup smells good." },
  { n: 130, from: "It tastes nice.",
    promptZh: "尝了点心，你想说：这个蛋糕尝起来很好。",
    tokens: ["The", "cake", "tastes", "good."], distractors: ["taste"], answer: "The cake tastes good." },
  { n: 132, from: "Does this cake taste good?",
    promptZh: "问同学汤的味道，你想问：这个汤尝起来好吗？",
    tokens: ["Does", "the", "soup", "taste", "good?"], distractors: ["tastes"], answer: "Does the soup taste good?" },
  { n: 140, from: "Although it was cold, we went out.",
    promptZh: "说虽然累还是去了，你想说：虽然很累，我们还是出去了。",
    tokens: ["Although", "we", "were", "tired,", "we", "went", "out."], distractors: ["but"], answer: "Although we were tired, we went out." },
  { n: 142, from: "As soon as I get home, I will call you.",
    promptZh: "说一到家就吃饭，你想说：我一到家就吃饭。",
    tokens: ["As", "soon", "as", "I", "get", "home,", "I", "will", "eat."], distractors: ["when"], answer: "As soon as I get home, I will eat." }
];
