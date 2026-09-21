import type { HuntCase } from "../types";

/**
 * 「侦探找错」P0 案件池。
 *
 * 选题依据：调研显示中国学习者写作错误高度集中在这几类——时态、主谓一致（三单漏 -s）、
 * 冠词、名词单复数（含不可数名词）、介词、be 动词缺失、句子成分残缺、连接词误用。
 * 每个案件都故意留了「看着可疑但其实没错」的陷阱词，逼玩家真的判断而不是靠感觉乱点。
 *
 * 词汇门槛：用词尽量落在核心 500 词内；个别教学上必须保留的难词放在 notes 里
 * 作为「生词提示」展示（如 case 9 的 advice / information）。
 *
 * 新增案件时只需追加数组项：tokens 是原文按空格切好的词表（标点跟在前一个词后面），
 * errors[].tokenIndex 指向 tokens 的下标。
 *
 * R15 人工校验记录（2026-09-12）：3 号案 + 13–20 号案（原 AI 初稿、未被任何课引用）逐案核对——
 * 语法正确性、罪名标注、讲解话术、tokenIndex 全部通过；修正 13 号案未标注的时态错（stay → stayed）。
 * 标记 reviewed: true。被课程引用的案件在配课时校验，新增案件若暂未配课须先校验并标记 reviewed。
 *
 * R13 人工校验记录（2026-09-13）：第一季 19 案逐案核对——tokenIndex 对位、罪名合法、
 * explanation 话术、修正≠原词、植错密度 2-4 全部通过；修正 hunt-passive 的 The people → People
 * （泛指「人们」不加 the，tokenIndex 11→10）。33 案全部 reviewed: true，红线断言入 huntService.test。
 *
 * 决策⑤（2026-09-13，5 课空 huntCaseIds 是否配案）：不配案，维持番外定位。
 * 空课（2/3/5/6/8 课）是第一季基础课，而番外案（white-cat/sports-day/pen-pal-letter/
 * fridge-note/term-review）各含 5-7 类混合罪名，是综合复习性质——配给基础课会越级撞墙，
 * 违背 R01 难度闸门。第一季混题复习已由「第 12 课番外整体解锁」承担（huntService R01）。
 */
export const huntCases: HuntCase[] = [
  {
    id: "hunt-moving-day",
    number: 1,
    title: "搬家那天",
    scene: "周末整理旧东西时翻到的一页日记",
    tokens: [
      "Last",
      "week",
      "I",
      "move",
      "to",
      "a",
      "new",
      "home.",
      "It",
      "was",
      "small",
      "but",
      "quiet.",
      "My",
      "sister",
      "help",
      "me",
      "carry",
      "three",
      "box",
      "of",
      "books.",
      "We",
      "was",
      "tired,",
      "but",
      "we",
      "cooked",
      "dinner",
      "together.",
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "tense",
        original: "move",
        correction: "moved",
        explanation:
          "Last week 说的是过去发生的事，动词要用过去式：move → moved。",
      },
      {
        tokenIndex: 15,
        tag: "tense",
        original: "help",
        correction: "helped",
        explanation: "整段都在讲上周的事，help 也要变成 helped，时态要一致。",
      },
      {
        tokenIndex: 19,
        tag: "plural",
        original: "box",
        correction: "boxes",
        explanation: "three 后面是可数名词复数：three boxes。",
      },
      {
        tokenIndex: 23,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation: "主语是 We（复数），be 动词要用 were，不是 was。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-yesterday-park",
    number: 2,
    title: "昨天的公园",
    scene: "相册背面的一行字",
    tokens: [
      "Yesterday",
      "I",
      "go",
      "to",
      "the",
      "park",
      "with",
      "my",
      "friend.",
      "We",
      "see",
      "a",
      "lot",
      "of",
      "birds.",
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "Yesterday 提示这是过去的事，go 的过去式是 went。",
      },
      {
        tokenIndex: 10,
        tag: "tense",
        original: "see",
        correction: "saw",
        explanation: "同一段里的动作都发生在昨天，see 要变成 saw。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-my-sister",
    number: 3,
    title: "我的妹妹",
    scene: "写给新同学的一封自我介绍",
    tokens: [
      "My",
      "sister",
      "like",
      "reading",
      "books.",
      "She",
      "go",
      "to",
      "the",
      "library",
      "every",
      "week.",
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "sv_agreement",
        original: "like",
        correction: "likes",
        explanation:
          "主语 My sister 等于 she，是第三人称单数，动词要加 -s：likes。",
      },
      {
        tokenIndex: 6,
        tag: "sv_agreement",
        original: "go",
        correction: "goes",
        explanation:
          "主语 She 是三单，go 要变 goes。中文动词不随人称变化，所以这里最容易漏。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-breakfast",
    number: 4,
    title: "早餐桌",
    scene: "早上随手写在便签上的一段话",
    tokens: [
      "I",
      "have",
      "a",
      "egg",
      "and",
      "three",
      "sandwich",
      "for",
      "breakfast.",
      "My",
      "brother",
      "eat",
      "two",
      "banana.",
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "article",
        original: "a",
        correction: "an",
        explanation: "egg 以元音音素开头，要用 an egg，不是 a egg。",
      },
      {
        tokenIndex: 6,
        tag: "plural",
        original: "sandwich",
        correction: "sandwiches",
        explanation: "three 后面要用复数：three sandwiches。",
      },
      {
        tokenIndex: 11,
        tag: "sv_agreement",
        original: "eat",
        correction: "eats",
        explanation: "主语 My brother 是三单，eat 要加 -s。",
      },
      {
        tokenIndex: 13,
        tag: "plural",
        original: "banana",
        correction: "bananas",
        explanation: "two 后面是可数名词复数：two bananas。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-call-mother",
    number: 5,
    title: "车站的一通电话",
    scene: "给朋友描述刚才的通话",
    tokens: [
      "My",
      "mother",
      "happy",
      "today",
      "because",
      "I",
      "called",
      "her",
      "from",
      "the",
      "station.",
      "She",
      "very",
      "glad",
      "to",
      "hear",
      "my",
      "voice.",
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "missing_be",
        original: "happy",
        correction: "is happy",
        explanation:
          "英语的句子必须有动词。主语和形容词之间少了 be：My mother is happy。中文说「我妈妈今天高兴」不需要动词，所以这里特别容易漏。",
      },
      {
        // 2026-09-21 批四十：插入点上移到 very（is 该插在 very 之前，不是 glad 之前）——
        // 原写法让机械修正生成「She very is glad」这个病句（错词本例句会显示它）。
        tokenIndex: 12,
        tag: "missing_be",
        original: "very",
        correction: "is very",
        explanation:
          "同样少了 be 动词：She is very glad。没有它就只剩一个主语加一个形容词，句子是塌的。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-prepositions",
    number: 6,
    title: "三个介词",
    scene: "英语角聊天后记下的三句话",
    tokens: [
      "I",
      "live",
      "at",
      "China.",
      "She",
      "is",
      "good",
      "in",
      "math.",
      "We",
      "arrived",
      "to",
      "the",
      "station",
      "late.",
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "preposition",
        original: "at",
        correction: "in",
        explanation:
          "国家、城市这样的大地方用 in：live in China。at 用于具体的点，比如 at the station。",
      },
      {
        tokenIndex: 7,
        tag: "preposition",
        original: "in",
        correction: "at",
        explanation:
          "be good at 是固定搭配：good at math。这类搭配要整块记，不能按中文的「在…方面」去推。",
      },
      {
        tokenIndex: 11,
        tag: "preposition",
        original: "to",
        correction: "at",
        explanation:
          "arrive at 用于较小的地方（station、airport 这类具体的点），arrive in 用于城市和国家。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-because-so",
    number: 7,
    title: "因为所以",
    scene: "一篇周记里最常见的两句话",
    tokens: [
      "Because",
      "I",
      "was",
      "tired,",
      "so",
      "I",
      "went",
      "to",
      "bed",
      "early.",
      "Though",
      "it",
      "was",
      "cold,",
      "but",
      "we",
      "went",
      "out.",
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "run_on",
        original: "so",
        correction: "去掉 so",
        explanation:
          "中文的「因为…所以…」在英语里只能留一个。Because I was tired, I went to bed early. 或者 I was tired, so I went to bed early.",
      },
      {
        tokenIndex: 14,
        tag: "run_on",
        original: "but",
        correction: "去掉 but",
        explanation: "同样的道理：Though 和 but 不能同时出现，留一个就够。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-tense-jump",
    number: 8,
    title: "时态跳走了",
    scene: "一段前半句过去、后半句现在的话",
    tokens: [
      "I",
      "met",
      "my",
      "old",
      "friend",
      "yesterday.",
      "We",
      "talk",
      "for",
      "hours",
      "and",
      "laugh",
      "a",
      "lot.",
    ],
    errors: [
      {
        tokenIndex: 7,
        tag: "tense",
        original: "talk",
        correction: "talked",
        explanation: "前面已经用 met 定在过去了，后面不能突然回到现在的 talk。",
      },
      {
        tokenIndex: 11,
        tag: "tense",
        original: "laugh",
        correction: "laughed",
        explanation: "and 连接的两个动作时态要一致，都要用过去式。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-uncountable",
    number: 9,
    title: "不可数的东西",
    scene: "考完试写给老师的一段话",
    tokens: [
      "The",
      "teacher",
      "gave",
      "us",
      "many",
      "advice",
      "and",
      "some",
      "informations",
      "about",
      "the",
      "exam.",
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "plural",
        original: "many",
        correction: "a lot of",
        explanation:
          "advice 是不可数名词，不能用 many 修饰。改成 a lot of advice 或者 some advice。",
      },
      {
        tokenIndex: 8,
        tag: "plural",
        original: "informations",
        correction: "information",
        explanation:
          "information 永远不加 -s。同类还有 news、homework、furniture、equipment。",
      },
    ],
    notes: [
      { word: "advice", zh: "建议（不可数名词）" },
      { word: "information", zh: "信息（不可数名词）" },
      { word: "exam", zh: "考试" },
    ],
    reviewed: true,
  },
  {
    id: "hunt-passive",
    number: 10,
    title: "演唱会后",
    scene: "演出结束后的一条朋友圈",
    tokens: [
      "The",
      "song",
      "was",
      "sing",
      "by",
      "her",
      "at",
      "the",
      "party.",
      "People",
      "was",
      "very",
      "happy.",
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "verb_form",
        original: "sing",
        correction: "sung",
        explanation:
          "做事的人退到幕后时，be 身边要穿做过版：was sung。sing 的做过版是 sung——和 have 身边同一件外套。",
      },
      {
        tokenIndex: 10,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation:
          "主语是 People（人们，复数），be 动词要用 were。泛指「人们」时不加 the。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-word-order",
    number: 11,
    title: "形容词站错位置",
    scene: "看图说话练习里的两句话",
    tokens: [
      "She",
      "bought",
      "a",
      "dress",
      "beautiful.",
      "We",
      "visited",
      "a",
      "house",
      "old",
      "near",
      "the",
      "river.",
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "word_order",
        original: "a dress beautiful",
        correction: "a beautiful dress",
        explanation:
          "形容词修饰名词时要站在名词前面：a beautiful dress。中文说「一条漂亮的裙子」，形容词也在前面，但英语不能倒过来放。",
      },
      {
        tokenIndex: 9,
        tag: "word_order",
        original: "a house old",
        correction: "an old house",
        explanation: "同样的位置问题：an old house。old 要放在 house 前面。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-new-phone",
    number: 12,
    title: "新手机",
    scene: "在群里安利刚买的手机（提示：店里那个 a 其实是对的）",
    tokens: [
      "I",
      "bought",
      "the",
      "new",
      "phone",
      "yesterday.",
      "I",
      "waited",
      "for",
      "a",
      "hour",
      "in",
      "a",
      "shop.",
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "article",
        original: "the",
        correction: "a",
        explanation:
          "第一次提到一样东西，对方还不知道是哪一个，要用 a：a new phone。",
      },
      {
        tokenIndex: 9,
        tag: "article",
        original: "a",
        correction: "an",
        explanation: "hour 的 h 不发音，词以元音音素开头，要用 an hour。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-mom-note",
    number: 13,
    title: "妈妈的留言条",
    scene: "贴在门上的一张便条，妈妈出门前留的",
    tokens: [
      "Because",
      "rainy,",
      "we",
      "stayed",
      "at",
      "home",
      "all",
      "day.",
      "Very",
      "happy",
      "today.",
      "She",
      "very",
      "happy",
      "with",
      "the",
      "cake.",
      "My",
      "brother",
      "likes",
      "it",
      "too.",
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "fragment",
        original: "rainy,",
        correction: "it was rainy,",
        explanation:
          "Because 后面要跟一个完整的小句子（谁 + 怎么样）：Because it was rainy。只写 rainy 就缺了主语和动词。",
      },
      {
        tokenIndex: 8,
        tag: "fragment",
        original: "Very",
        correction: "I am very",
        explanation:
          "Very happy today 没有主语也没有动词——句子要能回答「谁 + 怎么样」：I am very happy today。",
      },
      {
        tokenIndex: 12,
        tag: "missing_be",
        original: "very",
        correction: "is very",
        explanation:
          "She 后面少了个动词：说「她是开心的状态」要用 She is very happy，be 动词不能丢。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-school-show",
    number: 14,
    title: "学校演出",
    scene: "演出第二天写在笔记本上的回忆",
    tokens: [
      "Yesterday",
      "I",
      "was",
      "sing",
      "at",
      "the",
      "school",
      "show.",
      "My",
      "friend",
      "was",
      "dance",
      "too.",
      "Very",
      "fun.",
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "verb_form",
        original: "sing",
        correction: "singing",
        explanation: "was 后面接「正在做」的动作要用 -ing 形式：was singing。",
      },
      {
        tokenIndex: 11,
        tag: "verb_form",
        original: "dance",
        correction: "dancing",
        explanation: "同一句式：was dancing，dance 要变成 dancing。",
      },
      {
        tokenIndex: 13,
        tag: "fragment",
        original: "Very",
        correction: "It was very",
        explanation: "这一句没有主语也没有动词，补上 It was：It was very fun。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-weekend-plan",
    number: 15,
    title: "周末计划",
    scene: "写在日历边上的一份小计划",
    tokens: [
      "Because",
      "it",
      "is",
      "my",
      "grandma's",
      "birthday,",
      "so",
      "I",
      "will",
      "make",
      "cake",
      "for",
      "her.",
      "I",
      "want",
      "to",
      "buy",
      "two",
      "apple",
      "too.",
    ],
    errors: [
      {
        tokenIndex: 6,
        tag: "run_on",
        original: "so,",
        correction: "去掉 so,",
        explanation:
          "because 和 so 不能同时用——中文说「因为……所以……」，英文只留一个。句首已经有 Because，so 要去掉。",
      },
      {
        tokenIndex: 10,
        tag: "article",
        original: "cake",
        correction: "a cake",
        explanation: "可数名词单数前面要有个「帽子」：make a cake。",
      },
      {
        tokenIndex: 18,
        tag: "plural",
        original: "apple",
        correction: "apples",
        explanation: "two 后面的可数名词要加 -s：two apples。",
      },
    ],
    notes: [{ word: "grandma", zh: "奶奶；外婆" }],
    reviewed: true,
  },
  {
    id: "hunt-white-cat",
    number: 16,
    title: "朋友的白猫",
    scene: "跟同学聊天时说到的一只猫",
    tokens: [
      "My",
      "friend",
      "has",
      "a",
      "cat",
      "white.",
      "She",
      "was",
      "excite",
      "about",
      "it",
      "all",
      "day.",
      "We",
      "went",
      "to",
      "home",
      "at",
      "five",
      "o'clock.",
    ],
    errors: [
      {
        tokenIndex: 5,
        tag: "word_order",
        original: "white.",
        correction: "去掉（white 放到 cat 前面）",
        explanation:
          "形容词要站在名词前面：a white cat。中文说「一只白色的猫」，英文的 white 不能排在 cat 后面。",
      },
      {
        tokenIndex: 8,
        tag: "verb_form",
        original: "excite",
        correction: "excited",
        explanation: "说「感到兴奋」要用 excited：She was excited about it。",
      },
      {
        tokenIndex: 15,
        tag: "preposition",
        original: "to",
        correction: "去掉 to",
        explanation:
          "go home 中间不加 to——home 在这里自己就是「目的地」，直接说 went home。",
      },
    ],
    notes: [
      { word: "excited", zh: "感到兴奋的" },
      { word: "o'clock", zh: "……点钟" },
    ],
    reviewed: true,
  },
  {
    id: "hunt-sports-day",
    number: 17,
    title: "运动会",
    scene: "运动会结束当晚写的日记",
    tokens: [
      "Sports",
      "Day",
      "was",
      "last",
      "Friday.",
      "We",
      "very",
      "excited.",
      "The",
      "race",
      "stop",
      "in",
      "the",
      "afternoon.",
      "Run",
      "fast",
      "was",
      "fun.",
      "Very",
      "tired,",
      "but",
      "very",
      "happy.",
    ],
    errors: [
      {
        tokenIndex: 6,
        tag: "missing_be",
        original: "very",
        correction: "were very",
        explanation:
          "We 后面少了个动词：事情发生在上周，要说 We were very excited。",
      },
      {
        tokenIndex: 10,
        tag: "tense",
        original: "stop",
        correction: "stopped",
        explanation: "比赛是上周五停的，动词要换成过去式：stopped。",
      },
      {
        tokenIndex: 14,
        tag: "verb_form",
        original: "Run",
        correction: "Running",
        explanation:
          "「跑步」这件事当主语时，动词要穿 -ing 的外衣：Running fast was fun。",
      },
      {
        tokenIndex: 18,
        tag: "fragment",
        original: "Very",
        correction: "We were very",
        explanation:
          "又是一个没有主语和动词的句子：We were very tired, but very happy。",
      },
    ],
    notes: [{ word: "Sports Day", zh: "运动会" }],
    reviewed: true,
  },
  {
    id: "hunt-pen-pal-letter",
    number: 18,
    title: "写给笔友的信",
    scene: "英语课上写了一半的一封信",
    tokens: [
      "My",
      "pen",
      "pal",
      "live",
      "in",
      "Canada.",
      "Because",
      "I",
      "miss",
      "her,",
      "so",
      "I",
      "write",
      "to",
      "her",
      "every",
      "week.",
      "She",
      "is",
      "good",
      "in",
      "English.",
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "sv_agreement",
        original: "live",
        correction: "lives",
        explanation: "主语 My pen pal 等于 she，是第三人称单数：lives。",
      },
      {
        tokenIndex: 10,
        tag: "run_on",
        original: "so,",
        correction: "去掉 so,",
        explanation:
          "句首已经有 Because，后面的 so 要去掉——because 和 so 只留一个。",
      },
      {
        tokenIndex: 20,
        tag: "preposition",
        original: "in",
        correction: "at",
        explanation: "擅长某件事用 be good at：She is good at English。",
      },
    ],
    notes: [
      { word: "pen pal", zh: "笔友" },
      { word: "Canada", zh: "加拿大" },
    ],
    reviewed: true,
  },
  {
    id: "hunt-fridge-note",
    number: 19,
    title: "冰箱上的便条",
    scene: "厨房冰箱门上贴着的家里留言",
    tokens: [
      "The",
      "soup",
      "is",
      "in",
      "the",
      "kitchen.",
      "There",
      "are",
      "two",
      "egg",
      "in",
      "the",
      "fridge.",
      "The",
      "vegetables",
      "are",
      "fresh.",
      "I",
      "very",
      "busy",
      "today.",
      "Eat",
      "the",
      "chicken",
      "noodles",
      "hot.",
    ],
    errors: [
      {
        tokenIndex: 9,
        tag: "plural",
        original: "egg",
        correction: "eggs",
        explanation: "two 后面的可数名词要加 -s：two eggs。",
      },
      {
        tokenIndex: 18,
        tag: "missing_be",
        original: "very",
        correction: "am very",
        explanation: "I 后面少了个动词：I am very busy today。",
      },
      {
        tokenIndex: 25,
        tag: "word_order",
        original: "hot.",
        correction: "去掉（hot 放到 noodles 前面）",
        explanation: "形容词要站在名词前面：hot chicken noodles。",
      },
    ],
    notes: [
      { word: "fridge", zh: "冰箱" },
      { word: "soup", zh: "汤" },
      { word: "vegetables", zh: "蔬菜" },
    ],
    reviewed: true,
  },
  {
    id: "hunt-term-review",
    number: 20,
    title: "学期总结",
    scene: "期末写给自己的三行总结",
    tokens: [
      "Last",
      "term,",
      "I",
      "learn",
      "a",
      "lot",
      "of",
      "English.",
      "My",
      "teacher",
      "gave",
      "us",
      "useful",
      "advice.",
      "She",
      "is",
      "best",
      "teacher",
      "in",
      "our",
      "school.",
      "I",
      "was",
      "excite",
      "to",
      "see",
      "my",
      "scores.",
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "tense",
        original: "learn",
        correction: "learned",
        explanation: "Last term 是过去的时间，动词要换成过去式：learned。",
      },
      {
        tokenIndex: 16,
        tag: "article",
        original: "best",
        correction: "the best",
        explanation: "最高级前面要加 the：She is the best teacher。",
      },
      {
        tokenIndex: 23,
        tag: "verb_form",
        original: "excite",
        correction: "excited",
        explanation: "「感到兴奋」是 was excited——excite 的 -ed 外衣不能忘。",
      },
    ],
    notes: [
      { word: "advice", zh: "建议（不可数，没有 -s）" },
      { word: "term", zh: "学期" },
      { word: "scores", zh: "分数；成绩" },
    ],
    reviewed: true,
  },
  {
    id: "hunt-kitchen-note",
    number: 21,
    title: "冰箱上的便条",
    scene: "周六中午，家里冰箱上贴的一张便条",
    tokens: [
      "Mom",
      "is",
      "cook",
      "in",
      "the",
      "kitchen.",
      "Dad",
      "is",
      "watch",
      "TV",
      "with",
      "my",
      "brother.",
      "My",
      "sister",
      "do",
      "her",
      "homework",
      "every",
      "evening.",
      "Please",
      "buy",
      "two",
      "egg",
      "and",
      "some",
      "milk.",
      "We",
      "are",
      "waiting",
      "for",
      "dinner!",
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "verb_form",
        original: "cook",
        correction: "cooking",
        explanation: "Mom is 正在做这件事，cook 要穿上 -ing 外套：is cooking。",
      },
      {
        tokenIndex: 8,
        tag: "verb_form",
        original: "watch",
        correction: "watching",
        explanation:
          "Dad is 后面的动词也要 -ing：is watching。be 不能丢，-ing 也不能丢。",
      },
      {
        tokenIndex: 15,
        tag: "sv_agreement",
        original: "do",
        correction: "does",
        explanation:
          "every evening 说的是每天都做的事，My sister 是三单，动词要加 -s：does。",
      },
      {
        tokenIndex: 23,
        tag: "plural",
        original: "egg",
        correction: "eggs",
        explanation: "two 后面的可数名词要用复数：two eggs。",
      },
    ],
    notes: [{ word: "kitchen", zh: "厨房" }],
    reviewed: true,
  },
  {
    id: "hunt-cafe-order",
    number: 22,
    title: "奶茶店的小票",
    scene: "街角奶茶店台面上的一张手写小票",
    tokens: [
      "Order",
      "for",
      "Xiaomei:",
      "I",
      "can",
      "making",
      "milk",
      "tea,",
      "and",
      "she",
      "cans",
      "make",
      "coffee.",
      "Please",
      "give",
      "me",
      "a",
      "ice",
      "tea",
      "and",
      "three",
      "kind",
      "of",
      "juice.",
      "Thank",
      "you!",
    ],
    errors: [
      {
        tokenIndex: 5,
        tag: "verb_form",
        original: "making",
        correction: "make",
        explanation: "can 后面的动词穿原样，不变形：can make。",
      },
      {
        tokenIndex: 10,
        tag: "verb_form",
        original: "cans",
        correction: "can",
        explanation:
          "can 从不换衣服：不管主语是谁都是 can，没有 cans 这种形状。",
      },
      {
        tokenIndex: 16,
        tag: "article",
        original: "a",
        correction: "an",
        explanation:
          "ice 以元音开头，前面要用 an：an ice tea——看发音，不看字母。",
      },
      {
        tokenIndex: 21,
        tag: "plural",
        original: "kind",
        correction: "kinds",
        explanation: "three 后面的可数名词要用复数：three kinds。",
      },
    ],
    notes: [
      { word: "order", zh: "点单；订单" },
      { word: "juice", zh: "果汁" },
    ],
    reviewed: true,
  },
  {
    id: "hunt-travel-plan",
    number: 23,
    title: "暑假计划单",
    scene: "笔记本上写了一半的暑假计划",
    tokens: [
      "Summer",
      "plan:",
      "I",
      "want",
      "to",
      "goes",
      "to",
      "the",
      "beach.",
      "My",
      "brother",
      "wants",
      "to",
      "swimming",
      "every",
      "day.",
      "We",
      "will",
      "take",
      "two",
      "bag",
      "of",
      "clothes.",
      "Last",
      "summer",
      "we",
      "stay",
      "at",
      "home.",
    ],
    errors: [
      {
        tokenIndex: 5,
        tag: "verb_form",
        original: "goes",
        correction: "go",
        explanation:
          "to 后面的动词穿原样：want to go。变形的事已经由 want 做完了。",
      },
      {
        tokenIndex: 13,
        tag: "verb_form",
        original: "swimming",
        correction: "swim",
        explanation:
          "wants to 后面跟动词原形：wants to swim，-ing 外套要脱掉。",
      },
      {
        tokenIndex: 20,
        tag: "plural",
        original: "bag",
        correction: "bags",
        explanation: "two 后面的可数名词要用复数：two bags。",
      },
      {
        tokenIndex: 26,
        tag: "tense",
        original: "stay",
        correction: "stayed",
        explanation: "Last summer 是过去的时间，动词要换昨天版：stayed。",
      },
    ],
    notes: [{ word: "beach", zh: "海滩" }],
    reviewed: true,
  },
  {
    id: "hunt-desk-rules",
    number: 24,
    title: "课桌上的提醒",
    scene: "教室课桌上贴的一张自律小纸条",
    tokens: [
      "My",
      "rules",
      "for",
      "today:",
      "I",
      "must",
      "going",
      "to",
      "bed",
      "early.",
      "She",
      "musts",
      "clean",
      "her",
      "room.",
      "Read",
      "two",
      "page",
      "every",
      "night.",
      "Eat",
      "a",
      "apple",
      "after",
      "dinner.",
    ],
    errors: [
      {
        tokenIndex: 6,
        tag: "verb_form",
        original: "going",
        correction: "go",
        explanation:
          "must 后面的动词穿原形：must go。going 的 -ing 外套 must 不认。",
      },
      {
        tokenIndex: 11,
        tag: "verb_form",
        original: "musts",
        correction: "must",
        explanation:
          "must 和 can 一样从不变形：不管主语是谁都是 must，没有 musts。",
      },
      {
        tokenIndex: 17,
        tag: "plural",
        original: "page",
        correction: "pages",
        explanation: "two 后面的可数名词要用复数：two pages。",
      },
      {
        tokenIndex: 21,
        tag: "article",
        original: "a",
        correction: "an",
        explanation: "apple 以元音开头，前面要用 an：an apple。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-photo-compare",
    number: 25,
    title: "两张旧照片",
    scene: "相册里并排贴着的两张海边照片",
    tokens: [
      "Two",
      "photos",
      "from",
      "last",
      "summer:",
      "In",
      "the",
      "first",
      "one,",
      "I",
      "look",
      "younger,",
      "and",
      "my",
      "hair",
      "is",
      "shorter.",
      "The",
      "sea",
      "was",
      "hoter",
      "than",
      "today.",
      "This",
      "photo",
      "is",
      "more",
      "good",
      "than",
      "that.",
      "There",
      "is",
      "a",
      "island",
      "in",
      "it,",
      "and",
      "two",
      "boat",
      "on",
      "the",
      "water.",
    ],
    errors: [
      {
        tokenIndex: 20,
        tag: "verb_form",
        original: "hoter",
        correction: "hotter",
        explanation:
          "比「更热」要用 -er 形状，hot 是短促有力的词，先双写 t 再加 -er：hotter。",
      },
      {
        tokenIndex: 26,
        tag: "verb_form",
        original: "more good",
        correction: "better",
        explanation:
          "good 的比较级是不规则形状 better——像 go 的昨天版是 went 一样，要单独记住。",
      },
      {
        tokenIndex: 32,
        tag: "article",
        original: "a",
        correction: "an",
        explanation: "island 以元音开头，前面要用 an：an island。",
      },
      {
        tokenIndex: 38,
        tag: "plural",
        original: "boat",
        correction: "boats",
        explanation: "two 后面的可数名词要用复数：two boats。",
      },
    ],
    notes: [{ word: "island", zh: "岛" }],
    reviewed: true,
  },
  {
    id: "hunt-grandma-box",
    number: 26,
    title: "外婆的箱子",
    scene: "外婆家老房子里，周末整理时翻出的一只旧箱子",
    tokens: [
      "Grandma",
      "keeps",
      "old",
      "photos",
      "in",
      "a",
      "box.",
      "The",
      "box",
      "is",
      "in",
      "the",
      "table.",
      "We",
      "open",
      "it",
      "at",
      "Sunday.",
      "There",
      "are",
      "three",
      "photo",
      "inside.",
      "It",
      "is",
      "a",
      "old",
      "box.",
    ],
    errors: [
      {
        tokenIndex: 10,
        tag: "preposition",
        original: "in",
        correction: "on",
        explanation: "在桌子上（表面）用 on：on the table。in 是「在里面」。",
      },
      {
        tokenIndex: 16,
        tag: "preposition",
        original: "at",
        correction: "on",
        explanation:
          "具体某一天前面用 on：on Sunday。at 留给时间点（at six）。",
      },
      {
        tokenIndex: 21,
        tag: "plural",
        original: "photo",
        correction: "photos",
        explanation: "three 后面的可数名词要用复数：three photos。",
      },
      {
        tokenIndex: 25,
        tag: "article",
        original: "a",
        correction: "an",
        explanation: "old 以元音开头，前面要用 an：an old box。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-snow-day",
    number: 27,
    title: "雪天的日记",
    scene: "写了一半的雪天日记",
    tokens: [
      "Snow",
      "day!",
      "It",
      "snowed",
      "all",
      "day,",
      "we",
      "were",
      "very",
      "happy.",
      "Yesterday",
      "I",
      "play",
      "in",
      "the",
      "snow",
      "all",
      "day.",
      "My",
      "sister",
      "but",
      "I",
      "played",
      "outside.",
      "Mom",
      "gave",
      "us",
      "a",
      "orange",
      "juice.",
    ],
    errors: [
      {
        tokenIndex: 6,
        tag: "run_on",
        original: "we",
        correction: "and we",
        explanation:
          "逗号连不住两个句子，中间要站一个连词：……all day, and we were very happy.",
      },
      {
        tokenIndex: 12,
        tag: "tense",
        original: "play",
        correction: "played",
        explanation: "Yesterday 是过去的时间，动词要换昨天版：played。",
      },
      {
        tokenIndex: 20,
        tag: "run_on",
        original: "but",
        correction: "and",
        explanation:
          "My sister 和 I 是并列的两件事，用 and 连：My sister and I played outside.",
      },
      {
        tokenIndex: 27,
        tag: "article",
        original: "a",
        correction: "an",
        explanation: "orange 以元音开头，前面要用 an：an orange juice。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-late-note",
    number: 28,
    title: "迟到的解释",
    scene: "塞给老师的一张道歉小纸条",
    tokens: [
      "To",
      "my",
      "teacher:",
      "I",
      "was",
      "late",
      "because",
      "the",
      "bus",
      "was",
      "late,",
      "so",
      "please",
      "don't",
      "be",
      "angry.",
      "It",
      "was",
      "cold",
      "yesterday,",
      "so",
      "I",
      "wear",
      "my",
      "coat.",
      "Because",
      "the",
      "alarm",
      "was",
      "broken.",
      "Tomorrow",
      "I",
      "will",
      "use",
      "two",
      "alarm",
      "clock.",
    ],
    errors: [
      {
        tokenIndex: 11,
        tag: "run_on",
        original: "so",
        correction: "去掉 so",
        explanation:
          "because 和 so 只能来一个：I was late because the bus was late. Please don't be angry.",
      },
      {
        tokenIndex: 22,
        tag: "tense",
        original: "wear",
        correction: "wore",
        explanation: "yesterday 说的是昨天的事，动词要换昨天版：wore。",
      },
      {
        tokenIndex: 25,
        tag: "fragment",
        original: "Because",
        correction: "去掉 Because，并入上一句",
        explanation:
          "because 开头的半句只是原因，不能自己站住：要和结果连在一起，或直接说 The alarm was broken.",
      },
      {
        tokenIndex: 36,
        tag: "plural",
        original: "clock",
        correction: "clocks",
        explanation: "two 后面的可数名词要用复数：two alarm clocks。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-homework-note",
    number: 29,
    title: "书包里的字条",
    scene: "妈妈清晨塞进书包的一张字条",
    tokens: [
      "Good",
      "morning!",
      "Have",
      "you",
      "finished",
      "your",
      "homework?",
      "I",
      "hope",
      "you",
      "have",
      "do",
      "it",
      "all.",
      "Yesterday",
      "you",
      "say",
      "it",
      "was",
      "too",
      "much,",
      "and",
      "it",
      "was",
      "hard.",
      "You",
      "have",
      "eated",
      "two",
      "sandwich",
      "for",
      "dinner.",
      "I",
      "have",
      "packed",
      "your",
      "lunch",
      "box.",
    ],
    errors: [
      {
        tokenIndex: 11,
        tag: "verb_form",
        original: "do",
        correction: "done",
        explanation:
          "have 后面要站做过版：do 的做过版是 done。I have done it all.",
      },
      {
        tokenIndex: 16,
        tag: "tense",
        original: "say",
        correction: "said",
        explanation: "Yesterday 说的是昨天的事，动词要换昨天版：say → said。",
      },
      {
        tokenIndex: 27,
        tag: "verb_form",
        original: "eated",
        correction: "eaten",
        explanation:
          "eat 的做过版是 eaten，不走加 -ed 的路——没有 eated 这个形状。",
      },
      {
        tokenIndex: 29,
        tag: "plural",
        original: "sandwich",
        correction: "sandwiches",
        explanation: "two 后面的可数名词要用复数：two sandwiches。",
      },
    ],
    notes: [{ word: "packed", zh: "装好（pack 的昨天版）" }],
    reviewed: true,
  },
  {
    id: "hunt-photo-album",
    number: 30,
    title: "相册里的一页",
    scene: "小美和外婆一起翻旧相册，念出照片背后的一行字",
    tokens: [
      "Summer,",
      "2015.",
      "This",
      "is",
      "me",
      "and",
      "Grandma.",
      "I",
      "have",
      "was",
      "to",
      "Beijing",
      "with",
      "her,",
      "and",
      "I",
      "have",
      "see",
      "the",
      "sea",
      "for",
      "the",
      "first",
      "time.",
      "We",
      "was",
      "so",
      "happy",
      "that",
      "day.",
      "On",
      "the",
      "way",
      "home,",
      "I",
      "ate",
      "a",
      "apple",
      "and",
      "shared",
      "it",
      "with",
      "her.",
    ],
    errors: [
      {
        tokenIndex: 9,
        tag: "verb_form",
        original: "was",
        correction: "been",
        explanation:
          "be 的做过版是 been：I have been to Beijing。was 是昨天版，不能站在 have 后面。",
      },
      {
        tokenIndex: 17,
        tag: "verb_form",
        original: "see",
        correction: "seen",
        explanation: "have 后面站做过版：see 的做过版是 seen。",
      },
      {
        tokenIndex: 25,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation: "主语是 We（我们），昨天版要用 were。",
      },
      {
        tokenIndex: 36,
        tag: "article",
        original: "a",
        correction: "an",
        explanation: "apple 以元音开头，前面要穿 an：an apple。",
      },
    ],
    notes: [
      { word: "Beijing", zh: "北京（地名）" },
      { word: "Grandma", zh: "外婆" },
    ],
    reviewed: true,
  },
  {
    id: "hunt-lost-key",
    number: 31,
    title: "门口的求助字条",
    scene: "邻居贴在楼门口的一张寻钥匙字条",
    tokens: [
      "To",
      "my",
      "neighbors:",
      "I",
      "have",
      "losed",
      "my",
      "key.",
      "Now",
      "I",
      "can't",
      "get",
      "in",
      "and",
      "I",
      "am",
      "waiting",
      "in",
      "home.",
      "My",
      "glasses",
      "is",
      "in",
      "the",
      "same",
      "bag,",
      "so",
      "I",
      "can't",
      "see",
      "clearly.",
      "I",
      "have",
      "also",
      "broke",
      "my",
      "phone",
      "screen.",
      "If",
      "you",
      "find",
      "my",
      "key,",
      "please",
      "put",
      "it",
      "on",
      "my",
      "door",
      "handle.",
      "Thank",
      "you!",
    ],
    errors: [
      {
        tokenIndex: 5,
        tag: "verb_form",
        original: "losed",
        correction: "lost",
        explanation: "lose 的做过版是 lost——没有 losed 这个形状。",
      },
      {
        tokenIndex: 17,
        tag: "preposition",
        original: "in",
        correction: "at",
        explanation:
          "「在家里」是 at home——home 是特例，前面不垫 in。（前面 get in 的 in 是对的，别看错）",
      },
      {
        tokenIndex: 21,
        tag: "sv_agreement",
        original: "is",
        correction: "are",
        explanation: "glasses（眼镜）永远是复数，要用 are。",
      },
      {
        tokenIndex: 34,
        tag: "verb_form",
        original: "broke",
        correction: "broken",
        explanation: "have 后面站做过版：break 的做过版是 broken。",
      },
    ],
    notes: [
      { word: "neighbors", zh: "邻居们" },
      { word: "glasses", zh: "眼镜" },
      { word: "handle", zh: "把手" },
    ],
    reviewed: true,
  },
  {
    id: "hunt-diary-mix",
    number: 32,
    title: "混了时间的日记",
    scene: "一篇把两种时间搅在一起的周记",
    tokens: [
      "Sunday,",
      "sunny.",
      "Yesterday",
      "I",
      "have",
      "seen",
      "that",
      "film",
      "with",
      "Dad,",
      "and",
      "it",
      "was",
      "funny.",
      "In",
      "the",
      "afternoon",
      "I",
      "go",
      "to",
      "school",
      "for",
      "the",
      "art",
      "class.",
      "Mom",
      "made",
      "dinner,",
      "and",
      "I",
      "have",
      "eat",
      "two",
      "bowls",
      "of",
      "rice.",
      "Before",
      "bed,",
      "I",
      "read",
      "three",
      "book",
      "about",
      "animals.",
    ],
    errors: [
      {
        tokenIndex: 5,
        tag: "tense",
        original: "seen",
        correction: "saw",
        explanation:
          "Yesterday 已经站在句子里，动词要用昨天版：I saw that film。做过版和具体时间点不能同台。",
      },
      {
        tokenIndex: 18,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "下午的美术课是昨天的事，go 要换昨天版 went。",
      },
      {
        tokenIndex: 31,
        tag: "verb_form",
        original: "eat",
        correction: "eaten",
        explanation: "have 后面站做过版：eat 的做过版是 eaten。",
      },
      {
        tokenIndex: 41,
        tag: "plural",
        original: "book",
        correction: "books",
        explanation: "three 后面是可数名词复数：three books。",
      },
    ],
    notes: [{ word: "bowls", zh: "碗（bowl 的复数）" }],
    reviewed: true,
  },
  {
    id: "hunt-weekend-note",
    number: 33,
    title: "外婆的周末字条",
    scene: "外婆贴在冰箱上的周末安排便条",
    tokens: [
      "A",
      "note",
      "for",
      "the",
      "weekend:",
      "Our",
      "family",
      "have",
      "did",
      "a",
      "lot",
      "this",
      "weekend.",
      "In",
      "Monday,",
      "we",
      "cleaned",
      "the",
      "house",
      "together,",
      "and",
      "my",
      "little",
      "brother",
      "and",
      "I",
      "was",
      "tired",
      "but",
      "happy.",
      "Dad",
      "said",
      "we",
      "must",
      "to",
      "go",
      "to",
      "bed",
      "early.",
      "I",
      "have",
      "also",
      "done",
      "my",
      "homework,",
      "so",
      "tomorrow",
      "we",
      "can",
      "go",
      "to",
      "the",
      "park.",
    ],
    errors: [
      {
        tokenIndex: 8,
        tag: "verb_form",
        original: "did",
        correction: "done",
        explanation: "have 后面要站做过版：do 的做过版是 done。",
      },
      {
        tokenIndex: 13,
        tag: "preposition",
        original: "In",
        correction: "On",
        explanation: "说「在星期一」用 on Monday——星期前面垫 on。",
      },
      {
        tokenIndex: 26,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation:
          "主语是 my little brother and I（两个人），昨天版要用 were。",
      },
      {
        tokenIndex: 34,
        tag: "verb_form",
        original: "to",
        correction: "去掉 to",
        explanation: "must 后面的动词保持原样，中间不垫 to：must go。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-third-person-daily",
    number: 34,
    title: "同桌的日常记录",
    scene: "小美在笔记本上记同桌的每日习惯",
    tokens: [
      "My",
      "deskmate",
      "have",
      "many",
      "habits.",
      "He",
      "drink",
      "milk",
      "every",
      "day",
      "and",
      "watch",
      "TV",
      "every",
      "night.",
      "She",
      "like",
      "music,",
      "but",
      "he",
      "don't",
      "like",
      "coffee.",
      "Does",
      "he",
      "likes",
      "sports?",
      "Yes,",
      "he",
      "plays",
      "football",
      "on",
      "Monday.",
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "sv_agreement",
        original: "have",
        correction: "has",
        explanation: "My deskmate 是「他」，三单要用 has。",
      },
      {
        tokenIndex: 6,
        tag: "sv_agreement",
        original: "drink",
        correction: "drinks",
        explanation: "「他喝」是三单，动词加小尾巴 -s：drinks。",
      },
      {
        tokenIndex: 11,
        tag: "sv_agreement",
        original: "watch",
        correction: "watches",
        explanation: "watch 以 ch 结尾，三单加 es：watches。",
      },
      {
        tokenIndex: 16,
        tag: "sv_agreement",
        original: "like",
        correction: "likes",
        explanation: "「她喜欢」是三单，动词加 -s：likes。",
      },
      {
        tokenIndex: 20,
        tag: "sv_agreement",
        original: "don't",
        correction: "doesn't",
        explanation: "「他不喜欢」，帮手换三单 doesn't。",
      },
      {
        tokenIndex: 25,
        tag: "verb_form",
        original: "likes",
        correction: "like",
        explanation: "Does 一出场，动词打回原形 like——小尾巴由帮手扛。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-there-be-room",
    number: 35,
    title: "新房间的清单",
    scene: "小美帮妈妈列新房间里的东西",
    tokens: [
      "Look",
      "at",
      "my",
      "new",
      "room!",
      "There",
      "have",
      "a",
      "bed",
      "and",
      "a",
      "desk.",
      "There",
      "is",
      "three",
      "books",
      "on",
      "the",
      "desk,",
      "and",
      "there",
      "are",
      "a",
      "lamp",
      "near",
      "the",
      "window.",
      "Is",
      "there",
      "a",
      "chair?",
      "Yes,",
      "there",
      "is",
      "a",
      "blue",
      "chair",
      "in",
      "the",
      "corner.",
    ],
    errors: [
      {
        tokenIndex: 6,
        tag: "missing_be",
        original: "have",
        correction: "is",
        explanation: "「某处有某物」用 There is / There are，不用 have。",
      },
      {
        tokenIndex: 13,
        tag: "sv_agreement",
        original: "is",
        correction: "are",
        explanation: "three books 是复数，用 There are。",
      },
      {
        tokenIndex: 21,
        tag: "sv_agreement",
        original: "are",
        correction: "is",
        explanation: "a lamp 是单数，用 There is。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-question-words",
    number: 36,
    title: "失物招领处的问答",
    scene: "小美在失物招领处帮老师登记",
    tokens: [
      "The",
      "teacher",
      "asks:",
      "Where",
      "is",
      "this?",
      "A",
      "boy",
      "says:",
      "It",
      "is",
      "a",
      "blue",
      "bag.",
      "When",
      "you",
      "lost",
      "it?",
      "the",
      "teacher",
      "asks.",
      "How",
      "is",
      "your",
      "name?",
      "she",
      "asks",
      "too.",
      "The",
      "boy",
      "answers:",
      "My",
      "name",
      "is",
      "Tom.",
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "word_order",
        original: "Where",
        correction: "What",
        explanation: "问「这是什么」用 What；Where 是问地方。",
      },
      {
        tokenIndex: 16,
        tag: "word_order",
        original: "lost",
        correction: "did you lose",
        explanation:
          "问过去的动作要请帮手 did：When did you lose it？动词打回原形。",
      },
      {
        tokenIndex: 21,
        tag: "word_order",
        original: "How",
        correction: "What",
        explanation: "问名字用 What（是什么）；How 是问方式或状况。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-frequency-habit",
    number: 37,
    title: "习惯调查表",
    scene: "小美帮老师统计全班的习惯",
    tokens: [
      "We",
      "asked",
      "everyone",
      "about",
      "their",
      "habits.",
      "Lily",
      "go",
      "always",
      "to",
      "the",
      "library",
      "after",
      "class.",
      "Tom",
      "is",
      "never",
      "late,",
      "and",
      "he",
      "often",
      "play",
      "football.",
      "The",
      "girls",
      "are",
      "often",
      "happy",
      "after",
      "the",
      "game.",
    ],
    errors: [
      {
        tokenIndex: 7,
        tag: "word_order",
        original: "go",
        correction: "always goes",
        explanation: "频率副词站在动词前面：always goes；三单还要加 -s。",
      },
      {
        tokenIndex: 21,
        tag: "sv_agreement",
        original: "play",
        correction: "plays",
        explanation: "he 是三单，动词加 -s：often plays。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-going-to-plan",
    number: 38,
    title: "周末计划板",
    scene: "教室后墙贴着全班的周末计划",
    tokens: [
      "Our",
      "weekend",
      "plans:",
      "I",
      "going",
      "to",
      "visit",
      "my",
      "grandma.",
      "She",
      "are",
      "going",
      "to",
      "watch",
      "a",
      "movie.",
      "We",
      "am",
      "going",
      "to",
      "play",
      "football",
      "on",
      "Sunday.",
      "It",
      "will",
      "rains",
      "tomorrow,",
      "so",
      "bring",
      "an",
      "umbrella!",
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "missing_be",
        original: "going",
        correction: "am going",
        explanation: "be going to 里的 be 不能丢：I am going to。",
      },
      {
        tokenIndex: 10,
        tag: "sv_agreement",
        original: "are",
        correction: "is",
        explanation: "She 是单数，be 用 is：She is going to。",
      },
      {
        tokenIndex: 17,
        tag: "sv_agreement",
        original: "am",
        correction: "are",
        explanation: "We 是一伙的，be 用 are：We are going to。",
      },
      {
        tokenIndex: 26,
        tag: "verb_form",
        original: "rains",
        correction: "rain",
        explanation:
          "will 后面的动词穿原样：will rain——be going to 也一样后面是原形。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-some-any-fridge",
    number: 39,
    title: "冰箱盘点清单",
    scene: "小美列了一张冰箱库存单",
    tokens: [
      "A",
      "list",
      "for",
      "the",
      "fridge:",
      "There",
      "are",
      "some",
      "milk",
      "in",
      "the",
      "fridge.",
      "Do",
      "we",
      "have",
      "some",
      "eggs?",
      "I",
      "don't",
      "have",
      "some",
      "juice,",
      "and",
      "there",
      "isn't",
      "many",
      "bread.",
    ],
    errors: [
      {
        tokenIndex: 6,
        tag: "sv_agreement",
        original: "are",
        correction: "is",
        explanation: "milk 数不清，用 There is——数不清的东西当单数看。",
      },
      {
        tokenIndex: 15,
        tag: "article",
        original: "some",
        correction: "any",
        explanation: "疑问句里「一些」换 any：Do we have any eggs？",
      },
      {
        tokenIndex: 20,
        tag: "article",
        original: "some",
        correction: "any",
        explanation: "否定句里也用 any：don't have any juice。",
      },
      {
        tokenIndex: 25,
        tag: "article",
        original: "many",
        correction: "much",
        explanation: "bread 数不清，用 much：isn't much bread。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-superlative-market",
    number: 40,
    title: "水果摊的招牌",
    scene: "水果摊挂出了一块新招牌",
    tokens: [
      "Welcome",
      "to",
      "our",
      "shop!",
      "This",
      "is",
      "biggest",
      "apple",
      "in",
      "town.",
      "That",
      "one",
      "is",
      "the",
      "most",
      "cheapest,",
      "and",
      "this",
      "is",
      "the",
      "goodest",
      "orange.",
      "Our",
      "fruit",
      "is",
      "the",
      "freshest",
      "than",
      "anywhere",
      "else.",
    ],
    errors: [
      {
        tokenIndex: 6,
        tag: "article",
        original: "biggest",
        correction: "the biggest",
        explanation: "最高级前必须站 the：the biggest。",
      },
      {
        tokenIndex: 14,
        tag: "article",
        original: "most",
        correction: "去掉 most",
        explanation: "most 和 -est 只能用一个：the cheapest。",
      },
      {
        tokenIndex: 20,
        tag: "article",
        original: "goodest",
        correction: "best",
        explanation: "good 的最高级是 best，不是 goodest——不规则要单独记。",
      },
      {
        tokenIndex: 27,
        tag: "run_on",
        original: "than",
        correction: "in",
        explanation: "最高级用 in（在……里），than 是比较级的搭档。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-imperative-signs",
    number: 41,
    title: "图书馆的告示牌",
    scene: "小美看图书馆新贴的告示牌",
    tokens: [
      "Library",
      "rules:",
      "You",
      "keep",
      "quiet,",
      "please.",
      "Closing",
      "the",
      "door",
      "when",
      "you",
      "leave.",
      "Don't",
      "eating",
      "in",
      "the",
      "reading",
      "room.",
      "Returns",
      "your",
      "books",
      "before",
      "Friday.",
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "word_order",
        original: "You",
        correction: "去掉 You",
        explanation: "祈使句动词直接开头，省掉 You：Keep quiet, please。",
      },
      {
        tokenIndex: 6,
        tag: "verb_form",
        original: "Closing",
        correction: "Close",
        explanation: "祈使句动词穿原样：Close the door——-ing 是进行时的打扮。",
      },
      {
        tokenIndex: 13,
        tag: "verb_form",
        original: "eating",
        correction: "eat",
        explanation: "Don't + 动词原形：Don't eat。",
      },
      {
        tokenIndex: 18,
        tag: "verb_form",
        original: "Returns",
        correction: "Return",
        explanation:
          "祈使句动词不加三单 -s：Return your books——没有主语就没有三单。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-pronoun-umbrella",
    number: 42,
    title: "失物招领的牌子",
    scene: "下雨天，失物招领处立了块新牌子",
    tokens: [
      "Lost",
      "and",
      "Found:",
      "This",
      "umbrella",
      "is",
      "me.",
      "Those",
      "one",
      "is",
      "the",
      "teacher's,",
      "and",
      "these",
      "gloves",
      "are",
      "her.",
      "That",
      "one",
      "over",
      "there",
      "is",
      "your,",
    ],
    errors: [
      {
        tokenIndex: 6,
        tag: "missing_be",
        original: "me",
        correction: "mine",
        explanation: "「我的（东西）」是 mine；me 是「我」这个人。",
      },
      {
        tokenIndex: 8,
        tag: "sv_agreement",
        original: "one",
        correction: "ones",
        explanation: "Those 配复数：Those ones（那些个）。",
      },
      {
        tokenIndex: 9,
        tag: "sv_agreement",
        original: "is",
        correction: "are",
        explanation: "Those ones 是复数，用 are。",
      },
      {
        tokenIndex: 16,
        tag: "missing_be",
        original: "her",
        correction: "hers",
        explanation:
          "句尾「她的（东西）」用 hers——her 要贴在名词前面（her gloves）。",
      },
      {
        tokenIndex: 22,
        tag: "missing_be",
        original: "your",
        correction: "yours",
        explanation: "句尾「你的（东西）」用 yours。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-past-rainy-day",
    number: 43,
    title: "雨天的日记",
    scene: "小美翻开上周的日记",
    tokens: [
      "Last",
      "Sunday,",
      "it",
      "was",
      "rain",
      "hard.",
      "I",
      "was",
      "draw",
      "at",
      "home",
      "all",
      "afternoon.",
      "Mom",
      "were",
      "cooking",
      "in",
      "the",
      "kitchen,",
      "and",
      "my",
      "brother",
      "was",
      "play",
      "games.",
      "What",
      "was",
      "you",
      "doing",
      "then?",
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "verb_form",
        original: "rain",
        correction: "raining",
        explanation: "过去正在下雨：was raining——be 后面的动词要穿 -ing 外套。",
      },
      {
        tokenIndex: 8,
        tag: "verb_form",
        original: "draw",
        correction: "drawing",
        explanation: "was drawing——-ing 外套不能丢。",
      },
      {
        tokenIndex: 14,
        tag: "sv_agreement",
        original: "were",
        correction: "was",
        explanation: "Mom 是单数，过去版 be 用 was。",
      },
      {
        tokenIndex: 23,
        tag: "verb_form",
        original: "play",
        correction: "playing",
        explanation: "was playing——进行时的动词必须穿 -ing。",
      },
      {
        tokenIndex: 26,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation: "you 的过去版 be 是 were。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-key-clue",
    number: 44,
    title: "门卫的字条",
    scene: "门卫大叔留在门上的字条",
    tokens: [
      "Hi,",
      "Xiaomei!",
      "I",
      "saw",
      "two",
      "key",
      "on",
      "the",
      "desk.",
      "I",
      "don't",
      "know",
      "where",
      "is",
      "it.",
      "Do",
      "you",
      "know",
      "where",
      "is",
      "the",
      "key?",
      "Please",
      "look",
      "on",
      "your",
      "bag.",
    ],
    errors: [
      {
        tokenIndex: 5,
        tag: "plural",
        original: "key",
        correction: "keys",
        explanation: "two 后面是可数名词复数：two keys。",
      },
      {
        tokenIndex: 13,
        tag: "word_order",
        original: "is it",
        correction: "it is",
        explanation:
          "话中话要换鞋：I don't know where it is——is 退回 it 后面，不站主语前。",
      },
      {
        tokenIndex: 19,
        tag: "word_order",
        original: "is the key",
        correction: "the key is",
        explanation:
          "Do you know 后面也是话中话：where the key is——is 退回主语后面。",
      },
      {
        tokenIndex: 24,
        tag: "preposition",
        original: "on",
        correction: "in",
        explanation:
          "看包里面用 look in：look in your bag——in 是「在里面」，on 是「在上面」。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-homework-guess",
    number: 45,
    title: "作业本上的猜测",
    scene: "课间，小美在同桌摊开的作业本上读到的几句话",
    tokens: [
      "Tom",
      "is",
      "not",
      "here",
      "today.",
      "I",
      "think",
      "he",
      "tired.",
      "I",
      "think",
      "he",
      "at",
      "home",
      "now.",
      "Two",
      "boy",
      "is",
      "playing",
      "football",
      "in",
      "the",
      "park.",
    ],
    errors: [
      {
        tokenIndex: 8,
        tag: "missing_be",
        original: "tired",
        correction: "is tired",
        explanation:
          "「我觉得他累了」少了 is：I think he is tired——话装进 I think 后面，该有的 is 不能省。",
      },
      {
        tokenIndex: 12,
        tag: "missing_be",
        original: "at",
        correction: "is at",
        explanation: "「我觉得他在家」同样少了 is：I think he is at home。",
      },
      {
        tokenIndex: 16,
        tag: "plural",
        original: "boy",
        correction: "boys",
        explanation: "Two 后面是可数名词复数：two boys。",
      },
      {
        tokenIndex: 17,
        tag: "sv_agreement",
        original: "is",
        correction: "are",
        explanation: "主语是 Two boys（复数），be 动词用 are。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-lost-dog",
    number: 46,
    title: "找狗启事",
    scene: "小区布告栏上贴着的一张手写启事",
    tokens: [
      "Our",
      "dog",
      "Coco",
      "is",
      "lost.",
      "We",
      "don't",
      "know",
      "where",
      "is",
      "he.",
      "My",
      "sister",
      "think",
      "he",
      "at",
      "the",
      "school.",
      "We",
      "walk",
      "him",
      "on",
      "eight",
      "every",
      "morning.",
    ],
    errors: [
      {
        tokenIndex: 13,
        tag: "sv_agreement",
        original: "think",
        correction: "thinks",
        explanation: "主语 My sister 是三单，动词加 -s：thinks。",
      },
      {
        tokenIndex: 9,
        tag: "word_order",
        original: "is he",
        correction: "he is",
        explanation:
          "话中话要换鞋：We don't know where he is——is 退回 he 后面。",
      },
      {
        tokenIndex: 15,
        tag: "missing_be",
        original: "at",
        correction: "is at",
        explanation: "话里不能缺 is：My sister thinks he is at the school。",
      },
      {
        tokenIndex: 21,
        tag: "preposition",
        original: "on",
        correction: "at",
        explanation: "「在八点」用 at eight——at 管钟点，on 管某一天。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-team-message",
    number: 47,
    title: "接力赛的留言",
    scene: "接力赛前，队友留在白板上的一段话",
    tokens: [
      "Hi,",
      "this",
      "is",
      "Anna.",
      "Lily",
      "say",
      "she",
      "will",
      "comes",
      "to",
      "the",
      "race.",
      "She",
      "ready",
      "at",
      "eight.",
      "I",
      "think",
      "she",
      "will",
      "not",
      "be",
      "late.",
    ],
    errors: [
      {
        tokenIndex: 5,
        tag: "sv_agreement",
        original: "say",
        correction: "says",
        explanation: "主语 Lily 是三单，动词加 -s：says。",
      },
      {
        tokenIndex: 8,
        tag: "verb_form",
        original: "comes",
        correction: "come",
        explanation: "will 后面的动词穿原样：will come。",
      },
      {
        tokenIndex: 13,
        tag: "missing_be",
        original: "ready",
        correction: "is ready",
        explanation: "句子里少了 is：She is ready at eight。",
      },
      {
        tokenIndex: 20,
        tag: "word_order",
        original: "think she will not",
        correction: "don't think she will",
        explanation:
          "「不」要搬到前面说：I don't think she will be late——英语习惯让主句替她把「不」说了。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-family-photo",
    number: 48,
    title: "一张全家福",
    scene: "外婆相册里的一张全家福，旁边有手写的说明",
    tokens: [
      "This",
      "is",
      "a",
      "photo",
      "of",
      "my",
      "family.",
      "The",
      "woman",
      "wears",
      "red",
      "is",
      "my",
      "aunt.",
      "My",
      "aunt",
      "have",
      "two",
      "children.",
      "My",
      "uncle",
      "tall",
      "and",
      "kind.",
      "The",
      "boy",
      "in",
      "the",
      "left",
      "is",
      "my",
      "brother.",
    ],
    errors: [
      {
        tokenIndex: 9,
        tag: "fragment",
        original: "wears",
        correction: "who wears",
        explanation:
          "两条句子直接拼在一起，缺了个钩子：「穿红衣服的女士」要说成 The woman who wears red。",
      },
      {
        tokenIndex: 16,
        tag: "sv_agreement",
        original: "have",
        correction: "has",
        explanation: "主语 My aunt 是三单，have 要变 has。",
      },
      {
        tokenIndex: 21,
        tag: "missing_be",
        original: "tall",
        correction: "is tall",
        explanation: "句子少了 is：My uncle is tall and kind。",
      },
      {
        tokenIndex: 26,
        tag: "preposition",
        original: "in",
        correction: "on",
        explanation: "「在左边」用 on the left——on 管方位。",
      },
    ],
    notes: [
      { word: "aunt", zh: "姑姑 / 阿姨" },
      { word: "uncle", zh: "叔叔 / 舅舅" },
      { word: "family", zh: "家庭" },
    ],
    reviewed: true,
  },
  {
    id: "hunt-book-swap",
    number: 49,
    title: "图书交换角",
    scene: "教室图书角贴着一张交换登记的纸条",
    tokens: [
      "Welcome",
      "to",
      "our",
      "book",
      "corner!",
      "This",
      "is",
      "the",
      "book",
      "which",
      "I",
      "read",
      "it.",
      "My",
      "sister",
      "want",
      "the",
      "books",
      "which",
      "I",
      "read.",
      "They",
      "are",
      "on",
      "the",
      "box",
      "near",
      "the",
      "door.",
      "Two",
      "books",
      "very",
      "good.",
    ],
    errors: [
      {
        tokenIndex: 12,
        tag: "fragment",
        original: "it.",
        correction: "去掉 it",
        explanation:
          "which 已经替它站好了位置，尾巴里不许再有 it：the book which I read。",
      },
      {
        tokenIndex: 15,
        tag: "sv_agreement",
        original: "want",
        correction: "wants",
        explanation: "主语 My sister 是三单，want 要加 -s。",
      },
      {
        tokenIndex: 23,
        tag: "preposition",
        original: "on",
        correction: "in",
        explanation: "书在箱子里面用 in：in the box。",
      },
      {
        tokenIndex: 31,
        tag: "missing_be",
        original: "very",
        correction: "are very",
        explanation:
          "句子少了 are：Two books are very good——主语是两本，用 are。",
      },
    ],
    notes: [{ word: "corner", zh: "角落" }],
    reviewed: true,
  },
  {
    id: "hunt-class-intro",
    number: 50,
    title: "班级介绍卡",
    scene: "新老师贴在教室墙上的一张班级介绍卡",
    tokens: [
      "Welcome",
      "to",
      "our",
      "class!",
      "I",
      "know",
      "where",
      "is",
      "he.",
      "The",
      "boy",
      "wears",
      "glasses",
      "is",
      "Tom.",
      "He",
      "live",
      "near",
      "the",
      "school.",
      "See",
      "you",
      "in",
      "the",
      "school",
      "gate!",
    ],
    errors: [
      {
        tokenIndex: 7,
        tag: "word_order",
        original: "is he",
        correction: "he is",
        explanation: "话中话要换鞋：I know where he is——is 退回 he 后面。",
      },
      {
        tokenIndex: 11,
        tag: "fragment",
        original: "wears",
        correction: "who wears",
        explanation:
          "两条句子直接拼在一起，缺了个钩子：The boy who wears glasses is Tom。",
      },
      {
        tokenIndex: 16,
        tag: "sv_agreement",
        original: "live",
        correction: "lives",
        explanation: "主语 He 是三单，live 要加 -s：lives。",
      },
      {
        tokenIndex: 22,
        tag: "preposition",
        original: "in",
        correction: "at",
        explanation:
          "在学校门口用 at：at the school gate——at 管具体的点（门、车站）。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-interest-day",
    number: 51,
    title: "兴趣日打卡卡",
    scene: "小美贴在书桌前的一张兴趣日打卡卡",
    tokens: [
      "My",
      "weekend",
      "card:",
      "I",
      "like",
      "read",
      "books.",
      "My",
      "sister",
      "reading",
      "a",
      "book",
      "now.",
      "She",
      "likes",
      "dog",
      "and",
      "cats.",
      "Does",
      "you",
      "like",
      "reading?",
    ],
    errors: [
      {
        tokenIndex: 5,
        tag: "verb_form",
        original: "read",
        correction: "reading",
        explanation:
          "喜欢的是「做的事」——动词要换名字版：I like reading books。",
      },
      {
        tokenIndex: 9,
        tag: "missing_be",
        original: "reading",
        correction: "is reading",
        explanation:
          "「正看着呢」少了 is：My sister is reading a book now——有 be 搭着才是「正在做」。",
      },
      {
        tokenIndex: 15,
        tag: "plural",
        original: "dog",
        correction: "dogs",
        explanation: "两个以上要加 s：She likes dogs and cats。",
      },
      {
        tokenIndex: 18,
        tag: "sv_agreement",
        original: "Does",
        correction: "Do",
        explanation:
          "问「你」用 do：Do you like reading？Does 是给 he / she / it 的。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-swim-day",
    number: 52,
    title: "泳池边的光荣榜",
    scene: "夏令营泳池边贴出的一张光荣榜",
    tokens: [
      "Swim",
      "is",
      "fun.",
      "Everyone",
      "says",
      "swimming",
      "fun.",
      "My",
      "sister",
      "swim",
      "fast.",
      "We",
      "meet",
      "in",
      "the",
      "station.",
      "See",
      "you",
      "there!",
    ],
    errors: [
      {
        tokenIndex: 0,
        tag: "verb_form",
        original: "Swim",
        correction: "Swimming",
        explanation: "「游泳」这件事当主角，动词要上名字版：Swimming is fun。",
      },
      {
        tokenIndex: 6,
        tag: "missing_be",
        original: "fun",
        correction: "is fun",
        explanation:
          "「大家都说游泳好玩」少了 is：Everyone says swimming is fun。",
      },
      {
        tokenIndex: 9,
        tag: "sv_agreement",
        original: "swim",
        correction: "swims",
        explanation: "主语 My sister 是三单，swim 要加 -s：swims。",
      },
      {
        tokenIndex: 13,
        tag: "preposition",
        original: "in",
        correction: "at",
        explanation: "碰头的地方用 at：at the station——at 管具体的点。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-shop-note",
    number: 53,
    title: "冰箱上的便条",
    scene: "家里冰箱门上贴着一张妈妈留的便条",
    tokens: [
      "Hi,",
      "Xiaomei!",
      "I",
      "go",
      "the",
      "shop",
      "buy",
      "milk.",
      "Two",
      "egg",
      "in",
      "the",
      "fridge,",
      "and",
      "I",
      "want",
      "buy",
      "bread",
      "too.",
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "preposition",
        original: "the",
        correction: "to the",
        explanation: "「去商店」中间要垫 to：go to the shop——to 带路到地方。",
      },
      {
        tokenIndex: 6,
        tag: "verb_form",
        original: "buy",
        correction: "to buy",
        explanation:
          "两个动作不能硬撞：去商店「买」牛奶，中间再垫一块 to——go to the shop to buy milk。",
      },
      {
        tokenIndex: 9,
        tag: "plural",
        original: "egg",
        correction: "eggs",
        explanation: "Two 后面是可数名词复数：Two eggs in the fridge。",
      },
      {
        tokenIndex: 16,
        tag: "verb_form",
        original: "buy",
        correction: "to buy",
        explanation: "want 的门口有垫板：want to buy——想做某事，中间垫 to。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-club-poster",
    number: 54,
    title: "社团招新海报",
    scene: "美术社团贴在走廊上的一张招新海报",
    tokens: [
      "Art",
      "Club",
      "is",
      "fun!",
      "We",
      "enjoy",
      "to",
      "draw",
      "pictures.",
      "Lily",
      "draw",
      "very",
      "well.",
      "Two",
      "picture",
      "are",
      "on",
      "the",
      "wall.",
    ],
    errors: [
      {
        tokenIndex: 6,
        tag: "verb_form",
        original: "to",
        correction: "去掉 to",
        explanation:
          "enjoy 的门只开一扇，它不认 to——enjoy drawing：只认名字版。",
      },
      {
        tokenIndex: 7,
        tag: "verb_form",
        original: "draw",
        correction: "drawing",
        explanation:
          "名字版要穿上：enjoy drawing——喜欢「画画」这件事，动词换名字牌。",
      },
      {
        tokenIndex: 10,
        tag: "sv_agreement",
        original: "draw",
        correction: "draws",
        explanation: "主语 Lily 是三单，draw 要加 -s：draws。",
      },
      {
        tokenIndex: 14,
        tag: "plural",
        original: "picture",
        correction: "pictures",
        explanation: "Two 后面是可数名词复数：Two pictures are on the wall。",
      },
    ],
    notes: [{ word: "enjoy", zh: "享受 / 很喜欢" }],
    reviewed: true,
  },
  {
    id: "hunt-partner-show",
    number: 55,
    title: "班会节目单",
    scene: "期末班会贴在教室后面的节目单",
    tokens: [
      "Show",
      "time",
      "in",
      "Monday!",
      "I",
      "like",
      "read",
      "stories.",
      "My",
      "classmate",
      "want",
      "to",
      "watch",
      "a",
      "show.",
      "We",
      "go",
      "to",
      "the",
      "hall",
      "watch",
      "it.",
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "preposition",
        original: "in",
        correction: "on",
        explanation: "「在周一」用 on：on Monday——on 管某一天（第 6 课学过）。",
      },
      {
        tokenIndex: 6,
        tag: "verb_form",
        original: "read",
        correction: "reading",
        explanation:
          "like 后面跟着「做的事」，要用名字版：like reading stories。",
      },
      {
        tokenIndex: 10,
        tag: "sv_agreement",
        original: "want",
        correction: "wants",
        explanation: "主语 My classmate 是三单，want 要加 -s：wants。",
      },
      {
        tokenIndex: 20,
        tag: "verb_form",
        original: "watch",
        correction: "to watch",
        explanation:
          "两个动作要垫板缝：去礼堂「看」演出，中间垫一块 to——go to the hall to watch it。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-advice-note",
    number: 56,
    title: "同桌的便签",
    scene: "同桌留在一张小便签上的话，压在课桌角",
    tokens: [
      "You",
      "should",
      "to",
      "sleep",
      "early.",
      "I",
      "should",
      "rests",
      "more.",
      "My",
      "mother",
      "give",
      "me",
      "some",
      "advices.",
      "I",
      "feel",
      "tired",
      "today.",
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "verb_form",
        original: "to",
        correction: "去掉 to",
        explanation: "should 是家族成员，不垫板——should sleep early。",
      },
      {
        tokenIndex: 7,
        tag: "verb_form",
        original: "rests",
        correction: "rest",
        explanation:
          "家族里动词穿原样：should rest——rests 的三单尾巴要脱下来。",
      },
      {
        tokenIndex: 11,
        tag: "sv_agreement",
        original: "give",
        correction: "gives",
        explanation: "主语 My mother 是三单，动词加 -s：gives。",
      },
      {
        tokenIndex: 14,
        tag: "plural",
        original: "advices",
        correction: "advice",
        explanation: "advice 不可数，永远不加 s：some advice。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-weather-plan",
    number: 57,
    title: "周末计划单",
    scene: "教室后墙贴着的周末活动计划单",
    tokens: [
      "Weekend",
      "plan:",
      "If",
      "it",
      "will",
      "rain,",
      "we",
      "will",
      "stay",
      "at",
      "home.",
      "We",
      "will",
      "stays",
      "together",
      "and",
      "take",
      "two",
      "umbrella.",
      "See",
      "you",
      "in",
      "Sunday",
      "morning!",
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "verb_form",
        original: "will",
        correction: "去掉 will",
        explanation:
          "if 里说现在，不用 will：If it rains——「如果的路面用现在时铺」。",
      },
      {
        tokenIndex: 13,
        tag: "verb_form",
        original: "stays",
        correction: "stay",
        explanation: "will 后面穿原样：will stay——stays 的三单尾巴要脱下来。",
      },
      {
        tokenIndex: 18,
        tag: "plural",
        original: "umbrella",
        correction: "umbrellas",
        explanation: "two 后面是可数名词复数：two umbrellas。",
      },
      {
        tokenIndex: 21,
        tag: "preposition",
        original: "in",
        correction: "on",
        explanation:
          "「在周日早上」用 on：on Sunday morning——on 管某一天（第 6 课 / 第 18 课学过）。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-weekend-tip",
    number: 58,
    title: "班群消息",
    scene: "班级群里发的一条温馨提示",
    tokens: [
      "Hi,",
      "classmates!",
      "You",
      "should",
      "to",
      "bring",
      "an",
      "umbrella.",
      "If",
      "it",
      "will",
      "snow,",
      "stay",
      "at",
      "home.",
      "Two",
      "umbrella",
      "are",
      "at",
      "the",
      "door.",
      "See",
      "you",
      "on",
      "the",
      "morning!",
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "verb_form",
        original: "to",
        correction: "去掉 to",
        explanation: "should 是家族成员，不垫板——should bring an umbrella。",
      },
      {
        tokenIndex: 10,
        tag: "verb_form",
        original: "will",
        correction: "去掉 will",
        explanation:
          "if 里说现在，不用 will：If it snows——「如果的路面用现在时铺」。",
      },
      {
        tokenIndex: 16,
        tag: "plural",
        original: "umbrella",
        correction: "umbrellas",
        explanation: "Two 后面是可数名词复数：Two umbrellas are at the door。",
      },
      {
        tokenIndex: 23,
        tag: "preposition",
        original: "on",
        correction: "in",
        explanation:
          "「在早上」用 in：in the morning——in 管一天里的时段（第 18 课学过）。",
      },
    ],
    notes: [{ word: "tip", zh: "提示" }],
    reviewed: true,
  },
  {
    id: "hunt-broken-window",
    number: 59,
    title: "教室的窗户",
    scene: "教室窗户玻璃裂了，值日生贴在窗边的说明",
    tokens: [
      "Look",
      "at",
      "the",
      "window!",
      "It",
      "was",
      "break",
      "on",
      "the",
      "morning.",
      "The",
      "window",
      "was",
      "broke",
      "again",
      "later.",
      "Two",
      "window",
      "were",
      "broken",
      "too.",
    ],
    errors: [
      {
        tokenIndex: 6,
        tag: "verb_form",
        original: "break",
        correction: "broken",
        explanation:
          "be 身边要穿做过版：was broken——谁弄坏的不重要，事站台上。",
      },
      {
        tokenIndex: 7,
        tag: "preposition",
        original: "on",
        correction: "in",
        explanation:
          "「在早上」用 in：in the morning——in 管一天里的时段（第 18 课学过）。",
      },
      {
        tokenIndex: 13,
        tag: "verb_form",
        original: "broke",
        correction: "broken",
        explanation:
          "昨天版不能充数：穿做过版 broken——break → broke → broken，老词的三件外套别穿混。",
      },
      {
        tokenIndex: 17,
        tag: "plural",
        original: "window",
        correction: "windows",
        explanation: "Two 后面是可数名词复数：Two windows were broken too。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-clean-classroom",
    number: 60,
    title: "值日表旁边",
    scene: "教室值日表旁边贴着的一行说明",
    tokens: [
      "In",
      "Monday",
      "morning,",
      "the",
      "windows",
      "was",
      "cleaned.",
      "Two",
      "desk",
      "were",
      "cleaned",
      "too.",
      "The",
      "room",
      "is",
      "clean",
      "now.",
    ],
    errors: [
      {
        tokenIndex: 0,
        tag: "preposition",
        original: "In",
        correction: "On",
        explanation:
          "「在周一」用 on：On Monday morning——on 管某一天（第 6 课学过）。",
      },
      {
        tokenIndex: 5,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation: "主语 The windows 是复数，用 were 搭档：were cleaned。",
      },
      {
        tokenIndex: 8,
        tag: "plural",
        original: "desk",
        correction: "desks",
        explanation: "Two 后面是可数名词复数：Two desks。",
      },
      {
        tokenIndex: 15,
        tag: "verb_form",
        original: "clean",
        correction: "cleaned",
        explanation:
          "「被打扫过了」要穿做过版：is cleaned——clean 说「干净的」这个状态，cleaned 说「被打扫过」这个动作。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-birthday-cake",
    number: 61,
    title: "生日会的蛋糕",
    scene: "生日会结束后，蛋糕旁留下的一张字条",
    tokens: [
      "The",
      "big",
      "cake",
      "was",
      "eat",
      "from",
      "my",
      "brother!",
      "He",
      "was",
      "happy.",
      "Ten",
      "candle",
      "in",
      "the",
      "table.",
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "verb_form",
        original: "eat",
        correction: "eaten",
        explanation:
          "be 身边要穿做过版：was eaten——eat 的做过版是 eaten（eat → ate → eaten）。",
      },
      {
        tokenIndex: 5,
        tag: "preposition",
        original: "from",
        correction: "by",
        explanation:
          "「被谁」用 by，不是 from：eaten by my brother——from 说的是「从哪里来」。",
      },
      {
        tokenIndex: 12,
        tag: "plural",
        original: "candle",
        correction: "candles",
        explanation: "Ten 后面是可数名词复数：Ten candles。",
      },
      {
        tokenIndex: 13,
        tag: "preposition",
        original: "in",
        correction: "on",
        explanation:
          "东西在桌上用 on：on the table——in 是「在里面」（第 18 课学过）。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-cleaned-board",
    number: 62,
    title: "值日记录板",
    scene: "教室角落那块值日记录板上写的一句话",
    tokens: [
      "Look!",
      "The",
      "window",
      "has",
      "cleaned.",
      "The",
      "room",
      "has",
      "been",
      "clean.",
      "Two",
      "student",
      "did",
      "it.",
      "See",
      "you",
      "on",
      "the",
      "afternoon!",
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "missing_be",
        original: "cleaned",
        correction: "been cleaned",
        explanation:
          "has 后面要垫 be 的做过版（been）：has been cleaned——缺了它，句子就塌了。",
      },
      {
        tokenIndex: 9,
        tag: "verb_form",
        original: "clean",
        correction: "cleaned",
        explanation:
          "been 后面要穿做过版：has been cleaned——clean 是「干净的」这个状态，cleaned 是「被打扫过」这个动作。",
      },
      {
        tokenIndex: 11,
        tag: "plural",
        original: "student",
        correction: "students",
        explanation: "Two 后面是可数名词复数：Two students。",
      },
      {
        tokenIndex: 16,
        tag: "preposition",
        original: "on",
        correction: "in",
        explanation:
          "「在下午」用 in：in the afternoon——in 管一天里的时段（第 18 课学过）。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-show-focus",
    number: 63,
    title: "班会展板",
    scene: "班会结束后，展板旁边留下的一张说明卡",
    tokens: [
      "Our",
      "pictures",
      "were",
      "took",
      "from",
      "the",
      "teacher.",
      "One",
      "picture",
      "was",
      "broke",
      "and",
      "two",
      "picture",
      "were",
      "cleaned",
      "again.",
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "verb_form",
        original: "took",
        correction: "taken",
        explanation:
          "be 身边要穿做过版：were taken——took 是昨天版，不能充数（take → took → taken）。",
      },
      {
        tokenIndex: 4,
        tag: "preposition",
        original: "from",
        correction: "by",
        explanation:
          "「被谁」用 by，不是 from：taken by the teacher——from 说的是「从哪里来」。",
      },
      {
        tokenIndex: 10,
        tag: "verb_form",
        original: "broke",
        correction: "broken",
        explanation:
          "昨天版不能充数：was broken——break → broke → broken，老词三件外套别穿混。",
      },
      {
        tokenIndex: 13,
        tag: "plural",
        original: "picture",
        correction: "pictures",
        explanation: "two 后面是可数名词复数：two pictures。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-race-result",
    number: 64,
    title: "比赛名次表",
    scene: "贴在教室后墙的比赛名次表",
    tokens: [
      "The",
      "race",
      "was",
      "in",
      "Monday.",
      "Tom",
      "is",
      "the",
      "two",
      "to",
      "finish.",
      "Amy",
      "is",
      "the",
      "three",
      "to",
      "finish.",
      "Two",
      "boy",
      "are",
      "in",
      "the",
      "race.",
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "preposition",
        original: "in",
        correction: "on",
        explanation:
          "星期几前面用 on，不用 in：was on Monday——第 18 课的老规矩。",
      },
      {
        tokenIndex: 8,
        tag: "word_order",
        original: "two",
        correction: "second",
        explanation:
          "报数词不能顶排位词：two 是「两个」，second 才是「第二」——报数管几个、排位管第几。",
      },
      {
        tokenIndex: 14,
        tag: "word_order",
        original: "three",
        correction: "third",
        explanation: "三的排位是 third——不是把 three 直接搬来，拼法要单独认。",
      },
      {
        tokenIndex: 18,
        tag: "plural",
        original: "boy",
        correction: "boys",
        explanation: "Two 后面是可数名词复数：two boys。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-birthday-list",
    number: 65,
    title: "生日清单",
    scene: "冰箱门上贴着的生日清单",
    tokens: [
      "Our",
      "family",
      "has",
      "three",
      "birthday.",
      "My",
      "birthday",
      "is",
      "on",
      "May.",
      "Dad's",
      "birthday",
      "is",
      "in",
      "may.",
      "We",
      "buy",
      "two",
      "gift",
      "in",
      "June.",
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "plural",
        original: "birthday",
        correction: "birthdays",
        explanation:
          "three 后面是可数名词复数：three birthdays——家里三个人的生日。",
      },
      {
        tokenIndex: 8,
        tag: "preposition",
        original: "on",
        correction: "in",
        explanation: "只说月份用 in：in May——月份是大格子；「某一天」才用 on。",
      },
      {
        tokenIndex: 14,
        tag: "word_order",
        original: "may",
        correction: "May",
        explanation: "月份名字要抬头：May——像人名一样首字母大写。",
      },
      {
        tokenIndex: 18,
        tag: "plural",
        original: "gift",
        correction: "gifts",
        explanation: "two 后面是可数名词复数：two gifts。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-calendar-note",
    number: 66,
    title: "日历便条",
    scene: "教室门口贴着的日历便条",
    tokens: [
      "School",
      "start",
      "on",
      "September",
      "1.",
      "We",
      "have",
      "three",
      "day",
      "for",
      "the",
      "trip.",
      "The",
      "party",
      "is",
      "in",
      "October",
      "one.",
      "See",
      "you",
      "on",
      "Monday!",
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "sv_agreement",
        original: "start",
        correction: "starts",
        explanation:
          "School 是一个（三单），动词加 -s：School starts——开学这件事它自己开头。",
      },
      {
        tokenIndex: 8,
        tag: "plural",
        original: "day",
        correction: "days",
        explanation: "three 后面是可数名词复数：three days。",
      },
      {
        tokenIndex: 15,
        tag: "preposition",
        original: "in",
        correction: "on",
        explanation: "有具体日子就用 on：on October 1——「某一天」都用 on。",
      },
      {
        tokenIndex: 17,
        tag: "word_order",
        original: "one.",
        correction: "first.",
        explanation:
          "日子读排位词，不读报数：1 读 first——October 1 读 October first。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-sports-report",
    number: 67,
    title: "运动会报道",
    scene: "校广播站桌上的一份运动会报道稿",
    tokens: [
      "Our",
      "school",
      "race",
      "was",
      "fun.",
      "Amy",
      "run",
      "quick",
      "in",
      "the",
      "race.",
      "She",
      "shouts",
      "loud",
      "for",
      "her",
      "class.",
      "Two",
      "girl",
      "run",
      "with",
      "her.",
    ],
    errors: [
      {
        tokenIndex: 6,
        tag: "sv_agreement",
        original: "run",
        correction: "runs",
        explanation:
          "Amy 是一个（三单），动词加 -s：Amy runs——第 25 课的老规矩。",
      },
      {
        tokenIndex: 7,
        tag: "word_order",
        original: "quick",
        correction: "quickly",
        explanation:
          "「做得怎么样」要加 -ly 的样子词：runs quickly——quick 是形容人，quickly 才是描述跑的样子。",
      },
      {
        tokenIndex: 13,
        tag: "word_order",
        original: "loud",
        correction: "loudly",
        explanation: "「喊得声音大」要加 -ly 的样子词：shouts loudly。",
      },
      {
        tokenIndex: 18,
        tag: "plural",
        original: "girl",
        correction: "girls",
        explanation: "Two 后面是可数名词复数：two girls。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-stage-note",
    number: 68,
    title: "舞台评语",
    scene: "后台化妆镜上贴着的一张评语卡",
    tokens: [
      "The",
      "show",
      "was",
      "on",
      "Monday.",
      "Amy",
      "sing",
      "a",
      "song.",
      "She",
      "sings",
      "very",
      "good.",
      "She",
      "runs",
      "fastly",
      "in",
      "the",
      "stage.",
    ],
    errors: [
      {
        tokenIndex: 6,
        tag: "sv_agreement",
        original: "sing",
        correction: "sings",
        explanation:
          "Amy 是一个（三单），动词加 -s：Amy sings——第 25 课的老规矩。",
      },
      {
        tokenIndex: 12,
        tag: "word_order",
        original: "good",
        correction: "well",
        explanation:
          "good 的样子词是 well：sings very well——good 形容人，well 说做得好。",
      },
      {
        tokenIndex: 15,
        tag: "word_order",
        original: "fastly",
        correction: "fast",
        explanation:
          "fast 自己就是样子词，不加 -ly：runs fast——没有 fastly 这个词。",
      },
      {
        tokenIndex: 16,
        tag: "preposition",
        original: "in",
        correction: "on",
        explanation: "在舞台上用 on：on the stage——第 18 课学过的表面用 on。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-old-photo",
    number: 69,
    title: "旧照片字条",
    scene: "相册里夹着的一张旧照片背面的字条",
    tokens: [
      "There",
      "have",
      "a",
      "bird",
      "in",
      "the",
      "park.",
      "There",
      "was",
      "two",
      "birds",
      "on",
      "the",
      "lake.",
      "Two",
      "photo",
      "are",
      "in",
      "the",
      "wall.",
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "missing_be",
        original: "have",
        correction: "was",
        explanation:
          "存在的「有」用 There be，不用 have：There was a bird——「有」万能直译是老大难，英语走两条路。",
      },
      {
        tokenIndex: 8,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation:
          "两只鸟是一群，用 were 搭档：There were two birds——单数 was、复数 were。",
      },
      {
        tokenIndex: 15,
        tag: "plural",
        original: "photo",
        correction: "photos",
        explanation: "Two 后面是可数名词复数：two photos。",
      },
      {
        tokenIndex: 17,
        tag: "preposition",
        original: "in",
        correction: "on",
        explanation: "挂在墙上用 on：on the wall——第 18 课学过的表面用 on。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-help-note",
    number: 70,
    title: "求助便条",
    scene: "教室门口贴着的一张求助便条",
    tokens: [
      "Hi,",
      "Xiaomei!",
      "Could",
      "you",
      "to",
      "help",
      "me",
      "open",
      "the",
      "door?",
      "Sam",
      "cans",
      "help",
      "at",
      "four,",
      "but",
      "he",
      "cannot",
      "helping",
      "me",
      "today.",
      "The",
      "two",
      "door",
      "are",
      "closed.",
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "verb_form",
        original: "to",
        correction: "去掉 to",
        explanation:
          "垫板不进这扇门：Could you help me——家族不垫板（第 47 课的老规矩）。",
      },
      {
        tokenIndex: 11,
        tag: "verb_form",
        original: "cans",
        correction: "can",
        explanation: "家族不变形：can 就是 can——复数、三单都不给它加尾巴。",
      },
      {
        tokenIndex: 18,
        tag: "verb_form",
        original: "helping",
        correction: "help",
        explanation:
          "动词穿原样，不换 -ing 装：cannot help——跟 must/should 家族一个规矩。",
      },
      {
        tokenIndex: 23,
        tag: "plural",
        original: "door",
        correction: "doors",
        explanation: "two 后面是可数名词复数：two doors。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-guest-note",
    number: 71,
    title: "招待清单",
    scene: "厨房冰箱上贴着的招待清单",
    tokens: [
      "Hi,",
      "Aunt!",
      "She",
      "would",
      "likes",
      "coffee.",
      "I",
      "would",
      "like",
      "to",
      "juice.",
      "We",
      "have",
      "a",
      "cups",
      "for",
      "tea.",
      "See",
      "you",
      "on",
      "the",
      "morning!",
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "verb_form",
        original: "likes",
        correction: "like",
        explanation: "would 家族穿原样：would like——likes 的 -s 不给它穿。",
      },
      {
        tokenIndex: 9,
        tag: "verb_form",
        original: "to",
        correction: "去掉 to",
        explanation:
          "想要的东西直接跟上、不垫板：would like juice——垫板是给动作用的。",
      },
      {
        tokenIndex: 14,
        tag: "plural",
        original: "cups",
        correction: "cup",
        explanation: "a 后面跟单数：a cup——一个杯子不报数。",
      },
      {
        tokenIndex: 19,
        tag: "preposition",
        original: "on",
        correction: "in",
        explanation:
          "早中晚是大块时间，用 in：in the morning——第 18 课的老规矩。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-handout-note",
    number: 72,
    title: "手工作业单",
    scene: "手工课上贴在材料角的一张作业单",
    tokens: [
      "Please",
      "give",
      "it",
      "me.",
      "Please",
      "give",
      "the",
      "glue",
      "me.",
      "Two",
      "ruler",
      "are",
      "here.",
      "The",
      "tape",
      "is",
      "in",
      "the",
      "desk.",
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "word_order",
        original: "me.",
        correction: "to me",
        explanation:
          "要给谁垫块 to：give it to me——it 站前面时，后面的人要垫上 to。",
      },
      {
        tokenIndex: 8,
        tag: "word_order",
        original: "me.",
        correction: "去掉（me 放到 the glue 前面）",
        explanation: "两样东西不能挤一块：先给谁、后给什么——give me the glue。",
      },
      {
        tokenIndex: 10,
        tag: "plural",
        original: "ruler",
        correction: "rulers",
        explanation: "Two 后面是可数名词复数：two rulers。",
      },
      {
        tokenIndex: 16,
        tag: "preposition",
        original: "in",
        correction: "on",
        explanation: "在桌面上用 on：on the desk——第 26 课的老规矩。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-reading-corner",
    number: 73,
    title: "阅读角记录",
    scene: "教室阅读角贴着的读书登记表",
    tokens: [
      "Ben",
      "finished",
      "to",
      "read",
      "a",
      "story.",
      "Amy",
      "finished",
      "read",
      "three",
      "book",
      "today.",
      "Sam",
      "finish",
      "reading",
      "the",
      "book",
      "yesterday.",
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "verb_form",
        original: "to",
        correction: "去掉 to",
        explanation:
          "垫板进不了 finish 的门：finished reading——它跟 enjoy 是同一类门卫（第 45 课）。",
      },
      {
        tokenIndex: 8,
        tag: "verb_form",
        original: "read",
        correction: "reading",
        explanation:
          "光板词不能进门：read 加 -ing 变名字版——finished reading。",
      },
      {
        tokenIndex: 10,
        tag: "plural",
        original: "book",
        correction: "books",
        explanation: "three 后面是可数名词复数：three books。",
      },
      {
        tokenIndex: 13,
        tag: "tense",
        original: "finish",
        correction: "finished",
        explanation:
          "句尾说了 yesterday，动词要换昨天版：finished——第 10 课的老规矩。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-height-chart",
    number: 74,
    title: "身高记录墙",
    scene: "体检日走廊身高贴旁边留下的一张记录卡",
    tokens: [
      "Tom",
      "is",
      "tall",
      "as",
      "me.",
      "Amy",
      "is",
      "as",
      "taller",
      "as",
      "me.",
      "Two",
      "boy",
      "are",
      "here.",
      "Sam",
      "is",
      "as",
      "tall",
      "than",
      "me.",
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "word_order",
        original: "tall",
        correction: "as tall",
        explanation:
          "两头都要卡住：少一头 as，「一样」就散架——Tom is as tall as me。",
      },
      {
        tokenIndex: 8,
        tag: "verb_form",
        original: "taller",
        correction: "tall",
        explanation:
          "中间的词穿原样：as tall as——加了 -er 是「更」家的人，进不了「一样」家的门。",
      },
      {
        tokenIndex: 12,
        tag: "plural",
        original: "boy",
        correction: "boys",
        explanation: "Two 后面是可数名词复数：two boys。",
      },
      {
        tokenIndex: 19,
        tag: "preposition",
        original: "than",
        correction: "as",
        explanation:
          "「一样」家不认 than：as tall as me——than 是「更…」家的门牌（第 17 课）。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-moving-day-note",
    number: 75,
    title: "搬家提示单",
    scene: "搬家公司留在门口的一张提示单",
    tokens: [
      "The",
      "box",
      "is",
      "very",
      "heavy",
      "to",
      "carry",
      "it.",
      "Three",
      "box",
      "are",
      "in",
      "the",
      "door.",
      "The",
      "pens",
      "are",
      "on",
      "the",
      "desk.",
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "word_order",
        original: "very",
        correction: "too",
        explanation:
          "「太…了装不下」的位子给 too：too heavy to carry——very 只说「很重」，说不出「拿不动」。",
      },
      {
        tokenIndex: 7,
        tag: "fragment",
        original: "it.",
        correction: "去掉 it",
        explanation:
          "to 后面不用再指一遍：too heavy to carry——东西已经在句子头上了。",
      },
      {
        tokenIndex: 9,
        tag: "plural",
        original: "box",
        correction: "boxes",
        explanation: "Three 后面是可数名词复数：three boxes。",
      },
      {
        tokenIndex: 11,
        tag: "preposition",
        original: "in",
        correction: "at",
        explanation:
          "在门口用 at：at the door——at 管具体的点（第 18 课的老规矩）。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-good-at",
    number: 76,
    title: "才艺角",
    scene: "教室才艺角墙上贴着的一张作品卡",
    tokens: [
      "I",
      "am",
      "good",
      "at",
      "draw.",
      "Amy",
      "is",
      "good",
      "in",
      "math.",
      "Two",
      "picture",
      "are",
      "on",
      "the",
      "wall.",
      "We",
      "meet",
      "at",
      "six",
      "in",
      "Monday.",
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "verb_form",
        original: "draw.",
        correction: "drawing.",
        explanation: "门牌后面穿名字版：good at drawing——光板进不了门。",
      },
      {
        tokenIndex: 8,
        tag: "preposition",
        original: "in",
        correction: "at",
        explanation:
          "擅长用门牌 at：good at math——「在…方面」的 in 是中文惯性。",
      },
      {
        tokenIndex: 11,
        tag: "plural",
        original: "picture",
        correction: "pictures",
        explanation: "Two 后面是可数名词复数：two pictures。",
      },
      {
        tokenIndex: 20,
        tag: "preposition",
        original: "in",
        correction: "on",
        explanation: "星期几前面用 on，不用 in：on Monday——第 18 课的老规矩。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-gift-list",
    number: 77,
    title: "礼物清单",
    scene: "书桌上摊着的一张礼物清单",
    tokens: [
      "I",
      "bought",
      "a",
      "gift",
      "to",
      "my",
      "mom.",
      "He",
      "bought",
      "for",
      "his",
      "dad",
      "a",
      "hat.",
      "I",
      "buyed",
      "two",
      "gift",
      "for",
      "my",
      "friends.",
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "preposition",
        original: "to",
        correction: "for",
        explanation:
          "买是「为你办的事」，用 for：a gift for my mom——to 是递到手的位子。",
      },
      {
        tokenIndex: 9,
        tag: "word_order",
        original: "for",
        correction: "去掉 for",
        explanation:
          "for 的人别插中间：去掉它，「his dad a hat」就是先给谁后给什么的老语序。",
      },
      {
        tokenIndex: 15,
        tag: "tense",
        original: "buyed",
        correction: "bought",
        explanation:
          "buy 的昨天版是 bought，不走加 -ed 的路——老词要单独记（第 11 课的老朋友）。",
      },
      {
        tokenIndex: 17,
        tag: "plural",
        original: "gift",
        correction: "gifts",
        explanation: "two 后面是可数名词复数：two gifts。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-mind-note",
    number: 78,
    title: "值日便条",
    scene: "放学后贴在值日角的一张交接便条",
    tokens: [
      "Would",
      "you",
      "mind",
      "open",
      "the",
      "window?",
      "Would",
      "you",
      "mind",
      "to",
      "close",
      "the",
      "door?",
      "Two",
      "window",
      "are",
      "open.",
      "The",
      "book",
      "is",
      "in",
      "the",
      "desk.",
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "verb_form",
        original: "open",
        correction: "opening",
        explanation: "mind 的门只认名字版：mind opening——光板进不了门。",
      },
      {
        tokenIndex: 9,
        tag: "verb_form",
        original: "to",
        correction: "去掉 to",
        explanation: "垫板对门卫不管用：mind closing——去掉 to、穿名字版。",
      },
      {
        tokenIndex: 14,
        tag: "plural",
        original: "window",
        correction: "windows",
        explanation: "Two 后面是可数名词复数：two windows。",
      },
      {
        tokenIndex: 20,
        tag: "preposition",
        original: "in",
        correction: "on",
        explanation: "在桌面上用 on：on the desk——第 26 课的老规矩。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-tea-invite",
    number: 79,
    title: "招待短信",
    scene: "表妹发来的一串招待安排短信",
    tokens: [
      "Would",
      "you",
      "likes",
      "some",
      "tea?",
      "Would",
      "you",
      "like",
      "to",
      "some",
      "cakes?",
      "We",
      "have",
      "two",
      "cup",
      "for",
      "you.",
      "See",
      "you",
      "at",
      "the",
      "afternoon!",
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "verb_form",
        original: "likes",
        correction: "like",
        explanation: "would 家族穿原样：Would you like——likes 的 -s 不给它穿。",
      },
      {
        tokenIndex: 8,
        tag: "verb_form",
        original: "to",
        correction: "去掉 to",
        explanation:
          "要提供的东西直接跟、不垫板：some cakes——垫板留给动作（to have）。",
      },
      {
        tokenIndex: 14,
        tag: "plural",
        original: "cup",
        correction: "cups",
        explanation: "two 后面是可数名词复数：two cups。",
      },
      {
        tokenIndex: 19,
        tag: "preposition",
        original: "at",
        correction: "in",
        explanation:
          "下午是大块时间，用 in：in the afternoon——第 18 课的老规矩。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-enough-bag",
    number: 80,
    title: "书包便签",
    scene: "春游集合点放在书包上的一张便签",
    tokens: [
      "The",
      "bag",
      "is",
      "enough",
      "light",
      "to",
      "carry.",
      "It",
      "is",
      "big",
      "enough",
      "for",
      "carry",
      "two",
      "bag.",
      "This",
      "box",
      "is",
      "heavy",
      "than",
      "that",
      "one.",
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "word_order",
        original: "enough",
        correction: "去掉（enough 放到 light 后面）",
        explanation:
          "enough 站词的后面：light enough——中文的「够」在前，英语的 enough 在后。",
      },
      {
        tokenIndex: 11,
        tag: "preposition",
        original: "for",
        correction: "to",
        explanation:
          "后面接动作要垫 to：big enough to carry——for 是「为你办」家的人（第 68 课刚分家）。",
      },
      {
        tokenIndex: 14,
        tag: "plural",
        original: "bag.",
        correction: "bags.",
        explanation: "two 后面是可数名词复数：two bags。",
      },
      {
        tokenIndex: 18,
        tag: "verb_form",
        original: "heavy",
        correction: "heavier",
        explanation:
          "「比…更」的词要带 -er：heavier than that one——heavy 收尾的 y 要变 i 再加 -er。第 17 课的老规矩。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-run-plan",
    number: 81,
    title: "跑步计划表",
    scene: "床头贴着的一张跑步计划表",
    tokens: [
      "How",
      "often",
      "you",
      "run?",
      "I",
      "run",
      "a",
      "week",
      "twice.",
      "Two",
      "shoe",
      "are",
      "here.",
      "We",
      "run",
      "on",
      "the",
      "morning.",
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "word_order",
        original: "you",
        correction: "do you",
        explanation:
          "问动作要请帮手 do：How often do you run——疑问词后面，动作用 do 帮忙。",
      },
      {
        tokenIndex: 8,
        tag: "word_order",
        original: "twice.",
        correction: "去掉（twice 放到 a week 前面）",
        explanation:
          "「一星期两次」时间放后面：twice a week——几次在前、周期在后，中文语序要倒过来。",
      },
      {
        tokenIndex: 10,
        tag: "plural",
        original: "shoe",
        correction: "shoes",
        explanation: "Two 后面是可数名词复数：two shoes。",
      },
      {
        tokenIndex: 15,
        tag: "preposition",
        original: "on",
        correction: "in",
        explanation:
          "早上是大块时间，用 in：in the morning——第 18 课的老规矩。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-trip-time",
    number: 82,
    title: "出行时间条",
    scene: "公交站牌上贴着的出行时间条",
    tokens: [
      "How",
      "long",
      "it",
      "takes?",
      "It",
      "is",
      "ten",
      "minute.",
      "We",
      "meet",
      "in",
      "noon.",
      "The",
      "bus",
      "go",
      "in",
      "the",
      "morning.",
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "word_order",
        original: "it",
        correction: "does it",
        explanation:
          "问动作要请帮手 does：How long does it take——疑问词后面，动作用 does 帮忙。",
      },
      {
        tokenIndex: 5,
        tag: "verb_form",
        original: "is",
        correction: "takes",
        explanation:
          "「花时间」用 takes 不用 is：It takes ten minutes——「它花十分钟」。",
      },
      {
        tokenIndex: 7,
        tag: "plural",
        original: "minute.",
        correction: "minutes.",
        explanation: "ten 后面是可数名词复数：ten minutes。",
      },
      {
        tokenIndex: 10,
        tag: "preposition",
        original: "in",
        correction: "at",
        explanation:
          "中午十二点是时间点，用 at：at noon——第 18 课的老规矩（点用 at、段用 in）。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-moving-help",
    number: 83,
    title: "搬家帮手条",
    scene: "搬家纸箱上贴着的一张帮手条",
    tokens: [
      "Let",
      "me",
      "to",
      "help",
      "you.",
      "Let",
      "me",
      "helps",
      "carry",
      "it.",
      "Two",
      "box",
      "are",
      "here.",
      "Last",
      "week",
      "he",
      "help",
      "me",
      "a",
      "lot.",
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "verb_form",
        original: "to",
        correction: "去掉 to",
        explanation:
          "口令块不垫板：Let me help you——跟 must/should 家族一个规矩。",
      },
      {
        tokenIndex: 7,
        tag: "verb_form",
        original: "helps",
        correction: "help",
        explanation:
          "动词穿原样：Let me help——helps 的 -s 不给它穿（跟 must/should/can 家族一个规矩）。",
      },
      {
        tokenIndex: 11,
        tag: "plural",
        original: "box",
        correction: "boxes",
        explanation: "Two 后面是可数名词复数：two boxes。",
      },
      {
        tokenIndex: 17,
        tag: "tense",
        original: "help",
        correction: "helped",
        explanation:
          "Last week 说的是上周的事，动词要换昨天版：helped——第 10 课的老规矩。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-park-plan",
    number: 84,
    title: "公园计划",
    scene: "公园门口长椅上压着的一张计划条",
    tokens: [
      "Let's",
      "to",
      "go",
      "to",
      "the",
      "park.",
      "How",
      "about",
      "go",
      "to",
      "the",
      "park?",
      "Two",
      "tree",
      "are",
      "here.",
      "We",
      "walk",
      "on",
      "the",
      "park.",
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "verb_form",
        original: "to",
        correction: "去掉 to",
        explanation: "口令块不垫板：Let's go——跟第 74 课同规矩。",
      },
      {
        tokenIndex: 8,
        tag: "verb_form",
        original: "go",
        correction: "going",
        explanation: "How about 后面穿名字版：going——把选项放桌上问。",
      },
      {
        tokenIndex: 13,
        tag: "plural",
        original: "tree",
        correction: "trees",
        explanation: "Two 后面是可数名词复数：two trees。",
      },
      {
        tokenIndex: 18,
        tag: "preposition",
        original: "on",
        correction: "in",
        explanation:
          "在公园里用 in：walk in the park——第 18 课的老规矩（园子里是地块里）。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-feel-better",
    number: 85,
    title: "身体好转条",
    scene: "冰箱门上贴着的一周身体记录条",
    tokens: [
      "I",
      "feel",
      "very",
      "better",
      "today.",
      "He",
      "is",
      "more",
      "taller",
      "than",
      "me.",
      "Two",
      "day",
      "are",
      "enough.",
      "We",
      "meet",
      "in",
      "Monday.",
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "word_order",
        original: "very",
        correction: "much",
        explanation:
          "给「更」加力用 much：much better——very 不站这个位（very 是「非常」的岗）。",
      },
      {
        tokenIndex: 7,
        tag: "word_order",
        original: "more",
        correction: "much",
        explanation:
          "「更」已经藏在 taller 里：前面只加力、不叠 more——much taller。",
      },
      {
        tokenIndex: 12,
        tag: "plural",
        original: "day",
        correction: "days",
        explanation: "Two 后面是可数名词复数：two days。",
      },
      {
        tokenIndex: 17,
        tag: "preposition",
        original: "in",
        correction: "on",
        explanation: "星期几前面用 on，不用 in：on Monday——第 18 课的老规矩。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-hobby-habit",
    number: 86,
    title: "习惯打卡表",
    scene: "书房墙上贴着的一张习惯打卡表",
    tokens: [
      "I",
      "keep",
      "to",
      "do",
      "my",
      "homework.",
      "He",
      "keeps",
      "do",
      "three",
      "book",
      "every",
      "night.",
      "I",
      "keep",
      "reading",
      "on",
      "night.",
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "verb_form",
        original: "to",
        correction: "去掉 to",
        explanation:
          "名字版通道不垫板：keep doing——跟 like/enjoy/finish 一个规矩。",
      },
      {
        tokenIndex: 8,
        tag: "verb_form",
        original: "do",
        correction: "doing",
        explanation: "名字版不装光板：keeps doing——三单的 -s 只动 keep 自己。",
      },
      {
        tokenIndex: 10,
        tag: "plural",
        original: "book",
        correction: "books",
        explanation: "three 后面是可数名词复数：three books。",
      },
      {
        tokenIndex: 16,
        tag: "preposition",
        original: "on",
        correction: "at",
        explanation:
          "夜里这个时间点用 at：at night——第 18 课的老规矩（点用 at）。",
      },
    ],
    reviewed: true,
  },
  {
    id: "hunt-full-day",
    number: 87,
    title: "一天记录",
    scene: "书桌上摊着的一张一天记录卡",
    tokens: [
      "I",
      "feel",
      "very",
      "better",
      "today.",
      "I",
      "keep",
      "do",
      "my",
      "homework.",
      "Two",
      "shoe",
      "are",
      "here.",
      "We",
      "walk",
      "on",
      "the",
      "morning.",
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "word_order",
        original: "very",
        correction: "much",
        explanation:
          "给「更」加力用 much：much better——第 76 课刚学的（very 不站这个位）。",
      },
      {
        tokenIndex: 7,
        tag: "verb_form",
        original: "do",
        correction: "doing",
        explanation:
          "名字版通道不装光板：keep doing——第 77 课刚学的（通道后面永远跟名字版）。",
      },
      {
        tokenIndex: 11,
        tag: "plural",
        original: "shoe",
        correction: "shoes",
        explanation: "Two 后面是可数名词复数：two shoes。",
      },
      {
        tokenIndex: 16,
        tag: "preposition",
        original: "on",
        correction: "in",
        explanation:
          "早上是大块时间，用 in：in the morning——第 18 课的老规矩。",
      },
    ],
    reviewed: true,
  },
  {
    // ── 第十三批 · L79 案件（规格：prd-grammar-find-things-2026-09-19.md §6；next to 首案：next→next to 与 the 缺失双新错 + 旧错 plural/sv）──
    id: "hunt-desk-map",
    number: 88,
    title: "书桌地图",
    scene: "书桌上摊着的一张家具位置图",
    tokens: [
      "My",
      "desk",
      "is",
      "next",
      "window.",
      "There",
      "are",
      "two",
      "book",
      "on",
      "the",
      "desk.",
      "He",
      "sit",
      "next",
      "to",
      "me.",
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "preposition",
        original: "next",
        correction: "next to",
        explanation: "两个词一起住：next 【to】the window——to 不能丢。",
      },
      {
        tokenIndex: 4,
        tag: "article",
        original: "window.",
        correction: "the window.",
        explanation: "说得清是哪一扇，就要带上 the：next to the window。",
      },
      {
        tokenIndex: 8,
        tag: "plural",
        original: "book",
        correction: "books",
        explanation: "two 后面是可数名词复数：two books。",
      },
      {
        tokenIndex: 13,
        tag: "sv_agreement",
        original: "sit",
        correction: "sits",
        explanation:
          "He 是一个（三单），动词加 -s：He sits——第 25 课的老规矩。",
      },
    ],
    reviewed: true,
  },
  {
    // ── 第十三批 · L80 案件（规格：prd-grammar-find-things-2026-09-19.md §6；前后对首案：of 多出与 of 缺失双新错 + 旧错 plural/sv）──
    id: "hunt-cat-hiding",
    number: 89,
    title: "猫躲哪了",
    scene: "客厅地上散落的一张找猫记录",
    tokens: [
      "The", "cat", "is", "behind", "of", "the", "door.",
      "The", "ball", "is", "in", "front", "the", "box.",
      "There", "are", "two", "chair", "here.",
      "She", "are", "at", "home."
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "preposition",
        original: "of",
        correction: "去掉 of",
        explanation: "后面那一位不带 of：behind the door——of 是多出来的。"
      },
      {
        tokenIndex: 12,
        tag: "fragment",
        original: "the",
        correction: "of the",
        explanation: "前面那一位三个词一起住：in front 【of】the box——缺了 of 句子就缺口。"
      },
      {
        tokenIndex: 17,
        tag: "plural",
        original: "chair",
        correction: "chairs",
        explanation: "two 后面是可数名词复数：two chairs。"
      },
      {
        tokenIndex: 20,
        tag: "sv_agreement",
        original: "are",
        correction: "is",
        explanation: "She 是一个（三单），配 is：She is at home——第 18 课的老搭配。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十三批 · L81 案件（规格：prd-grammar-find-things-2026-09-19.md §6；between 首案：to→and 与 sit→sits 双新错 + 旧错 sv/plural）──
    id: "hunt-seat-plan",
    number: 90,
    title: "座位表",
    scene: "教室墙上贴着的新座位表",
    tokens: [
      "I", "sit", "between", "Tom", "to", "Amy.",
      "He", "sit", "between", "you", "and", "me.",
      "There", "is", "three", "apple", "here.",
      "She", "go", "to", "school."
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "preposition",
        original: "to",
        correction: "and",
        explanation: "两头用 and 牵起来：between Tom 【and】Amy——「从…到…」的 to 上不了岗。"
      },
      {
        tokenIndex: 7,
        tag: "sv_agreement",
        original: "sit",
        correction: "sits",
        explanation: "He 是一个（三单），动词加 -s：He sits——第 25 课的老规矩。"
      },
      {
        tokenIndex: 13,
        tag: "sv_agreement",
        original: "is",
        correction: "are",
        explanation: "three apples 是复数，配 are：There are three apples——第 26 课的老规矩。"
      },
      {
        tokenIndex: 15,
        tag: "plural",
        original: "apple",
        correction: "apples",
        explanation: "three 后面是可数名词复数：three apples。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十三批 · L82 案件（规格：prd-grammar-find-things-2026-09-19.md §6；put 首案：putted→put 与 next→next to 双新错 + 旧错 tense/plural）──
    id: "hunt-pack-bag",
    number: 91,
    title: "收书包",
    scene: "门口挂钩上贴着的一张收书包便条",
    tokens: [
      "I", "putted", "my", "bag", "next", "the", "door.",
      "He", "go", "to", "school", "yesterday.",
      "Two", "shoe", "are", "here.",
      "I", "put", "my", "bag", "on", "the", "desk."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "verb_form",
        original: "putted",
        correction: "put",
        explanation: "put 三天长一个样：不加 -ed——I put my bag next to the door。"
      },
      {
        tokenIndex: 4,
        tag: "preposition",
        original: "next",
        correction: "next to",
        explanation: "第 79 课的老规矩：next to 两个词一起住——to 不能丢。"
      },
      {
        tokenIndex: 8,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "yesterday 说了昨天的事，动词要换昨天版：went——第 10 课的老规矩。"
      },
      {
        tokenIndex: 13,
        tag: "plural",
        original: "shoe",
        correction: "shoes",
        explanation: "Two 后面是可数名词复数：two shoes。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十三批 · L83 案件（规格：prd-grammar-find-things-2026-09-19.md §6；something/anything 首案：两处 something→anything 双新错 + 旧错 plural/preposition）──
    id: "hunt-gift-box",
    number: 92,
    title: "礼物盒",
    scene: "礼物盒盖上压着的一张说明卡",
    tokens: [
      "I", "don't", "have", "something", "for", "you.",
      "Do", "you", "have", "something", "for", "me?",
      "There", "are", "two", "candy", "here.",
      "I", "put", "my", "bag", "on", "the", "box."
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "article",
        original: "something",
        correction: "anything",
        explanation: "否定句里换 anything：don't have anything——第 30 课 some/any 的老规矩。"
      },
      {
        tokenIndex: 9,
        tag: "article",
        original: "something",
        correction: "anything",
        explanation: "疑问句里也换 anything：Do you have anything——同一个规矩。"
      },
      {
        tokenIndex: 15,
        tag: "plural",
        original: "candy",
        correction: "candies",
        explanation: "two 后面是可数名词复数：two candies（一颗一颗数的糖）。"
      },
      {
        tokenIndex: 21,
        tag: "preposition",
        original: "on",
        correction: "in",
        explanation: "放进盒子里用 in：in the box——第 18 课的老规矩（盒子里是「里头」）。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十三批 · L84 案件（规格：prd-grammar-find-things-2026-09-19.md §6；nothing 首案：双重否定陷阱与 someone 三单双新错 + 旧错 plural/preposition）──
    id: "hunt-empty-drawer",
    number: 93,
    title: "空抽屉",
    scene: "书桌抽屉里垫着的一张清点单",
    tokens: [
      "I", "don't", "have", "nothing.",
      "Someone", "are", "at", "the", "door.",
      "There", "are", "two", "book", "in", "the", "box.",
      "He", "reads", "on", "the", "morning."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "word_order",
        original: "don't",
        correction: "去掉 don't",
        explanation: "nothing 自带「不」：一句话里有了它，就别再请 not——两个「不」打架。"
      },
      {
        tokenIndex: 5,
        tag: "sv_agreement",
        original: "are",
        correction: "is",
        explanation: "someone 是「一个人」：配 is——Someone is at the door。"
      },
      {
        tokenIndex: 12,
        tag: "plural",
        original: "book",
        correction: "books",
        explanation: "two 后面是可数名词复数：two books。"
      },
      {
        tokenIndex: 18,
        tag: "preposition",
        original: "on",
        correction: "in",
        explanation: "早上是大块时间，用 in：in the morning——第 18 课的老规矩。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十三批 · L85 案件（规格：prd-grammar-find-things-2026-09-19.md §6；whose 首案：Who's→Whose 与语序换位双新错 + 旧错 plural ×2）──
    id: "hunt-umbrella-owner",
    number: 94,
    title: "伞的主人",
    scene: "失物招领架上贴着的认领单",
    tokens: [
      "Who's", "book", "is", "this?",
      "Whose", "this", "book", "is?",
      "Two", "umbrella", "are", "here.",
      "These", "one", "are", "mine."
    ],
    errors: [
      {
        tokenIndex: 0,
        tag: "word_order",
        original: "Who's",
        correction: "Whose",
        explanation: "问「谁的」用 whose（一个词）：Whose book is this?——who's 是「谁是」，两家人。"
      },
      {
        tokenIndex: 5,
        tag: "word_order",
        original: "this",
        correction: "去掉（this book 顺序调整：Whose book is this?）",
        explanation: "whose 后面直接跟东西：Whose book is this?——this 站最后，别插在中间。"
      },
      {
        tokenIndex: 9,
        tag: "plural",
        original: "umbrella",
        correction: "umbrellas",
        explanation: "Two 后面是可数名词复数：two umbrellas。"
      },
      {
        tokenIndex: 13,
        tag: "plural",
        original: "one",
        correction: "ones",
        explanation: "These 是「这些」（好几样），后面的词也要复数：These ones are mine——第 33 课的老搭配。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十三批 · L86 收官案件（规格：prd-grammar-find-things-2026-09-19.md §6；本批四点回流：putted/Who's/双重否定/next to——以 #91/#93/#94/#88 为锚）──
    id: "hunt-lost-found",
    number: 95,
    title: "失物招领",
    scene: "失物招领处柜台上的一份登记簿",
    tokens: [
      "I", "putted", "it", "on", "the", "desk.",
      "Who's", "bag", "is", "this?",
      "I", "don't", "have", "nothing.",
      "The", "bag", "is", "next", "the", "door."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "verb_form",
        original: "putted",
        correction: "put",
        explanation: "第 82 课回流：put 三天长一个样——不加 -ed。"
      },
      {
        tokenIndex: 6,
        tag: "word_order",
        original: "Who's",
        correction: "Whose",
        explanation: "第 85 课回流：问「谁的」用 whose（一个词）——who's 是「谁是」。"
      },
      {
        tokenIndex: 11,
        tag: "word_order",
        original: "don't",
        correction: "去掉 don't",
        explanation: "第 84 课回流：nothing 自带「不」——去掉 don't。"
      },
      {
        tokenIndex: 17,
        tag: "preposition",
        original: "next",
        correction: "next to",
        explanation: "第 79 课回流：next to 两个词一起住——to 不能丢。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十四批 · L87 案件（规格：prd-grammar-small-talk-past-2026-09-19.md §6；合体首案：漏 be 与漏 a 双新错 + 旧错 tense/plural；漏撇号不入案）──
    id: "hunt-cold-morning",
    number: 96,
    title: "冷早晨",
    scene: "校门口的值日记录板上夹着的一张天气记录",
    tokens: [
      "It", "cold", "today.",
      "It", "is", "cold", "morning.",
      "Yesterday", "I", "go", "to", "school.",
      "Two", "hat", "are", "here."
    ],
    errors: [
      {
        tokenIndex: 0,
        tag: "missing_be",
        original: "It",
        correction: "It is",
        explanation: "搭档不能全没：It 后面要跟上 is（或挤成 It's）——It cold today 句子就塌了。"
      },
      {
        tokenIndex: 4,
        tag: "article",
        original: "is",
        correction: "is a",
        explanation: "「一个冷早晨」要带 a：It is 【a】 cold morning——漏了 a 句子就缺口。"
      },
      {
        tokenIndex: 9,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "Yesterday 说了昨天的事，动词要换昨天版：went——第 10 课的老规矩。"
      },
      {
        tokenIndex: 13,
        tag: "plural",
        original: "hat",
        correction: "hats",
        explanation: "Two 后面是可数名词复数：two hats。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十四批 · L88 案件（规格：prd-grammar-small-talk-past-2026-09-19.md §6；-y 家族首案：漏 be 与漏 a 双新错 + 旧错 sv/plural；词性误用不入案）──
    id: "hunt-windy-window",
    number: 97,
    title: "风敲窗",
    scene: "教室窗台上压着的一张值日天气记录",
    tokens: [
      "It", "windy", "today.",
      "It", "is", "windy", "day.",
      "The", "clouds", "is", "white.",
      "Two", "cloud", "are", "here."
    ],
    errors: [
      {
        tokenIndex: 0,
        tag: "missing_be",
        original: "It",
        correction: "It is",
        explanation: "搭档不能全没：It 后面要跟上 is（或挤成 It's）——It windy today 句子就塌了。"
      },
      {
        tokenIndex: 4,
        tag: "article",
        original: "is",
        correction: "is a",
        explanation: "「一个大风天」要带 a：It is 【a】 windy day——漏了 a 句子就缺口。"
      },
      {
        tokenIndex: 9,
        tag: "sv_agreement",
        original: "is",
        correction: "are",
        explanation: "The clouds 是复数，配 are：The clouds are white——一个 is、一群 are（第 26 课的配对）。"
      },
      {
        tokenIndex: 12,
        tag: "plural",
        original: "cloud",
        correction: "clouds",
        explanation: "Two 后面是可数名词复数：two clouds。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十四批 · L89 案件（规格：prd-grammar-small-talk-past-2026-09-19.md §6；感叹首案：漏 a 与问号双新错 + 旧错 sv/plural）──
    id: "hunt-nice-day",
    number: 98,
    title: "多好的天",
    scene: "教室黑板上留着的一句感叹",
    tokens: [
      "What", "nice", "day!",
      "What", "a", "nice", "day?",
      "There", "are", "three", "apple", "here.",
      "Two", "umbrella", "are", "here."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "article",
        original: "nice",
        correction: "a nice",
        explanation: "a 不能丢：What 【a】 nice day!——「一个好天」要带 a。"
      },
      {
        tokenIndex: 6,
        tag: "word_order",
        original: "day?",
        correction: "day!",
        explanation: "感叹要配感叹号：What a nice day!——这是喊出来的，不是问出来的。"
      },
      {
        tokenIndex: 10,
        tag: "plural",
        original: "apple",
        correction: "apples",
        explanation: "three 后面是可数名词复数：three apples。"
      },
      {
        tokenIndex: 13,
        tag: "plural",
        original: "umbrella",
        correction: "umbrellas",
        explanation: "Two 后面是可数名词复数：two umbrellas。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十四批 · L90 案件（规格：prd-grammar-small-talk-past-2026-09-19.md §6；after 从句首案：漏主语与 watched 双新错 + 旧错 sv/plural）──
    id: "hunt-homework-first",
    number: 99,
    title: "先做作业",
    scene: "书桌前贴着的一张学习安排条",
    tokens: [
      "After", "eat", "dinner,", "I", "watch", "TV.",
      "After", "I", "do", "my", "homework,", "I", "watched", "TV.",
      "He", "drink", "milk", "every", "day.",
      "Two", "film", "are", "here."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "fragment",
        original: "eat",
        correction: "I eat",
        explanation: "after 后面要有一整句：谁 + 做什么——After 【I】 eat dinner——那个 I 不能省。"
      },
      {
        tokenIndex: 12,
        tag: "tense",
        original: "watched",
        correction: "watch",
        explanation: "说的都是每天常做的事，动词穿现在版：do…watch——两个动作同一档。"
      },
      {
        tokenIndex: 15,
        tag: "sv_agreement",
        original: "drink",
        correction: "drinks",
        explanation: "He 是一个（三单），动词加 -s：He drinks——第 25 课的老规矩。"
      },
      {
        tokenIndex: 20,
        tag: "plural",
        original: "film",
        correction: "films",
        explanation: "Two 后面是可数名词复数：two films。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十四批 · L91 案件（规格：prd-grammar-small-talk-past-2026-09-19.md §6；before 从句首案：漏主语与漏逗号双新错 + 旧错 sv/preposition）──
    id: "hunt-before-dinner",
    number: 100,
    title: "饭前",
    scene: "餐桌旁贴着的一张饭前规矩条",
    tokens: [
      "Before", "eat,", "I", "wash", "my", "hands.",
      "Before", "I", "eat", "I", "wash", "my", "hands.",
      "My", "sister", "wash", "her", "hands.",
      "I", "go", "to", "home", "after", "school."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "fragment",
        original: "eat,",
        correction: "I eat,",
        explanation: "before 后面也要有一整句：Before 【I】 eat——那个 I 不能省（跟 after 一个规矩）。"
      },
      {
        tokenIndex: 8,
        tag: "run_on",
        original: "eat",
        correction: "eat,",
        explanation: "两段之间要点个逗号：Before I eat【,】 I wash my hands——逗号是两段的分界线。"
      },
      {
        tokenIndex: 15,
        tag: "sv_agreement",
        original: "wash",
        correction: "washes",
        explanation: "My sister 是一个（三单），动词加 -s：washes——第 25 课的老规矩。"
      },
      {
        tokenIndex: 20,
        tag: "preposition",
        original: "to",
        correction: "去掉 to",
        explanation: "home 是「回家」的老搭配，前面不加 to：I go home——第 9 课的老规矩。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十四批 · L92 案件（规格：prd-grammar-small-talk-past-2026-09-19.md §6；when 从句首案：漏逗号与漏 it 双新错 + 旧错 preposition/plural）──
    id: "hunt-sunny-run",
    number: 101,
    title: "天晴去跑",
    scene: "操场边压着的一张跑步角告示",
    tokens: [
      "When", "it", "is", "sunny", "I", "run.",
      "When", "is", "sunny,", "I", "run.",
      "I", "run", "on", "the", "park.",
      "Two", "mile", "are", "here."
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "run_on",
        original: "sunny",
        correction: "sunny,",
        explanation: "两段之间点个逗号：When it is sunny【,】 I run——逗号是两段的分界线。"
      },
      {
        tokenIndex: 7,
        tag: "fragment",
        original: "is",
        correction: "it is",
        explanation: "小句子要有「谁」：When 【it】 is sunny——那个 it 是天气句的老座位。"
      },
      {
        tokenIndex: 13,
        tag: "preposition",
        original: "on",
        correction: "in",
        explanation: "在公园里用 in：in the park——第 18 课的老规矩（园子是地块里）。"
      },
      {
        tokenIndex: 17,
        tag: "plural",
        original: "mile",
        correction: "miles",
        explanation: "Two 后面是可数名词复数：two miles。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十四批 · L93 案件（规格：prd-grammar-small-talk-past-2026-09-19.md §6；used to 首案：use→used 与 playing→play 双新错 + 旧错 tense/plural）──
    id: "hunt-old-playground",
    number: 102,
    title: "老操场",
    scene: "老操场边立着的一块旧告示牌",
    tokens: [
      "I", "use", "to", "play", "here.",
      "I", "used", "to", "playing", "here.",
      "Yesterday", "I", "go", "to", "the", "park.",
      "Two", "hour", "are", "here."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "verb_form",
        original: "use",
        correction: "used",
        explanation: "尾巴上要有 d：I 【used】 to play——丢了 d 就变成「用」了。"
      },
      {
        tokenIndex: 8,
        tag: "verb_form",
        original: "playing",
        correction: "play",
        explanation: "used to 后面跟原形：play——不穿 -ing 外套（跟 want to travel 一个规矩）。"
      },
      {
        tokenIndex: 12,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "Yesterday 说了昨天的事，动词要换昨天版：went——第 10 课的老规矩。"
      },
      {
        tokenIndex: 17,
        tag: "plural",
        original: "hour",
        correction: "hours",
        explanation: "Two 后面是可数名词复数：two hours。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十四批 · L94 收官案件（规格：prd-grammar-small-talk-past-2026-09-19.md §6；本批四点回流：漏 a／漏主语／use→used／漏逗号——以 #98/#99/#102/#101 为锚）──
    id: "hunt-after-school-talk",
    number: 103,
    title: "校门口",
    scene: "校门口墙上贴着的一张大字聊天记录",
    tokens: [
      "What", "nice", "day!",
      "After", "eat", "dinner,", "I", "watch", "TV.",
      "I", "use", "to", "play", "here.",
      "When", "it", "is", "sunny", "I", "run."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "article",
        original: "nice",
        correction: "a nice",
        explanation: "第 89 课回流：a 不能丢——What 【a】 nice day!"
      },
      {
        tokenIndex: 4,
        tag: "fragment",
        original: "eat",
        correction: "I eat",
        explanation: "第 90 课回流：after 后面要有一整句——那个 I 不能省。"
      },
      {
        tokenIndex: 10,
        tag: "verb_form",
        original: "use",
        correction: "used",
        explanation: "第 93 课回流：尾巴上要有 d——I 【used】 to play。"
      },
      {
        tokenIndex: 17,
        tag: "run_on",
        original: "sunny",
        correction: "sunny,",
        explanation: "第 92 课回流：两段之间点个逗号——When it is sunny【,】 I run。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十五批 · L95 案件（规格：prd-grammar-storytelling-2026-09-19.md §6；过去进行首案：read→reading 与 was→were 双新错 + 旧错 tense/plural）──
    id: "hunt-eight-reading",
    number: 104,
    title: "八点读书",
    scene: "日记本摊开的那一页：昨晚八点的记录",
    tokens: [
      "I", "was", "read", "at", "eight.",
      "They", "was", "playing", "football.",
      "Yesterday", "I", "go", "home",
      "with", "two", "friend."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "verb_form",
        original: "read",
        correction: "reading",
        explanation: "动作要穿 -ing 外套：was 【reading】 at eight——「那时正做着」，外套不能脱。"
      },
      {
        tokenIndex: 6,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation: "They 是一伙人，用 were 搭档：They were playing——一个 was、一群 were。"
      },
      {
        tokenIndex: 11,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "Yesterday 说了昨天的事，动词要换昨天版：went——第 10 课的老规矩。"
      },
      {
        tokenIndex: 15,
        tag: "plural",
        original: "friend.",
        correction: "friends.",
        explanation: "two 后面是可数名词复数：two friends。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十五批 · L96 案件（规格：prd-grammar-storytelling-2026-09-19.md §6；背景句首案：rain→raining 与 is→was 双新错 + 旧错 plural/tense）──
    id: "hunt-rainy-memory",
    number: 105,
    title: "雨夜回忆",
    scene: "窗台上压着的一张雨夜回忆条",
    tokens: [
      "It", "was", "rain", "at", "eight.",
      "It", "is", "raining", "yesterday.",
      "Two", "cloud", "are", "white.",
      "Yesterday", "I", "go", "home."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "verb_form",
        original: "rain",
        correction: "raining",
        explanation: "动作要穿 -ing 外套：It was 【raining】——雨是「正在下」的样子。"
      },
      {
        tokenIndex: 6,
        tag: "tense",
        original: "is",
        correction: "was",
        explanation: "yesterday 在场，搭档要换昨天版：It 【was】 raining——今天版说今天、昨天版说那天。"
      },
      {
        tokenIndex: 10,
        tag: "plural",
        original: "cloud",
        correction: "clouds",
        explanation: "Two 后面是可数名词复数：two clouds。"
      },
      {
        tokenIndex: 15,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "Yesterday 说了昨天的事，动词要换昨天版：went——第 10 课的老规矩。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十五批 · L97 案件（规格：prd-grammar-storytelling-2026-09-19.md §6；when+过去进行首案：call→called 与 read→reading 双新错 + 旧错 sv/preposition）──
    id: "hunt-call-reading",
    number: 106,
    title: "电话与书",
    scene: "沙发扶手上放着的通话记录条",
    tokens: [
      "When", "you", "call,", "I", "was", "reading.",
      "When", "you", "called,", "I", "was", "read.",
      "We", "was", "happy.",
      "I", "go", "to", "home", "at", "eight."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "tense",
        original: "call,",
        correction: "called,",
        explanation: "打电话那件是昨天的事，要换昨天版：When you 【called】。"
      },
      {
        tokenIndex: 11,
        tag: "verb_form",
        original: "read.",
        correction: "reading.",
        explanation: "「当时正做着」要穿 -ing 外套：was 【reading】——read 是光板，进不了这个位。"
      },
      {
        tokenIndex: 13,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation: "We 是一伙人，用 were 搭档：We were happy——一个 was、一群 were。"
      },
      {
        tokenIndex: 17,
        tag: "preposition",
        original: "to",
        correction: "去掉 to",
        explanation: "home 是「回家」的老搭配，前面不加 to：I go home——第 9 课的老规矩。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十五批 · L98 案件（规格：prd-grammar-storytelling-2026-09-19.md §6；while 首案：read→reading 与 sleep→sleeping 双新错 + 旧错 run_on/sv）──
    id: "hunt-two-screens",
    number: 107,
    title: "两台屏幕",
    scene: "客厅茶几上放着的一张两屏记录条",
    tokens: [
      "While", "I", "was", "read,", "he", "was", "sleeping.",
      "While", "I", "was", "sleep,", "he", "was", "reading.",
      "While", "I", "was", "reading", "he", "was", "sleeping.",
      "My", "brother", "watch", "TV."
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "verb_form",
        original: "read,",
        correction: "reading,",
        explanation: "一边也要穿 -ing 外套：While I was 【reading】——两件同时在，两边都穿。"
      },
      {
        tokenIndex: 10,
        tag: "verb_form",
        original: "sleep,",
        correction: "sleeping,",
        explanation: "另一边也要穿 -ing：he was 【sleeping】——同时的两件都不能赤膊。"
      },
      {
        tokenIndex: 17,
        tag: "run_on",
        original: "reading",
        correction: "reading,",
        explanation: "两段之间点个逗号：While I was reading【,】 he was sleeping——逗号是两支镜头的分界线。"
      },
      {
        tokenIndex: 23,
        tag: "sv_agreement",
        original: "watch",
        correction: "watches",
        explanation: "My brother 是一个（三单），动词加 -es：watches——第 25 课的老规矩。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十五批 · L99 案件（规格：prd-grammar-storytelling-2026-09-19.md §6；进行 vs 过去首案：read→reading 与 ringing→rang 双新错 + 旧错 sv/plural）──
    id: "hunt-phone-rang",
    number: 108,
    title: "电话响了",
    scene: "茶几上压着的一张电话时间记录",
    tokens: [
      "I", "was", "read", "when", "the", "phone", "rang.",
      "The", "phone", "was", "ringing", "while", "I", "was", "sleeping.",
      "We", "was", "happy.",
      "She", "has", "two", "cat."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "verb_form",
        original: "read",
        correction: "reading",
        explanation: "一阵子的事要穿 -ing：I was 【reading】——「看是一阵子」。"
      },
      {
        tokenIndex: 10,
        tag: "verb_form",
        original: "ringing",
        correction: "rang",
        explanation: "响是一下子：穿 -ing 就成了「一直在响」——一下子的那件用昨天版：【rang】。"
      },
      {
        tokenIndex: 16,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation: "We 是一伙人，用 were 搭档：We were happy——一个 was、一群 were。"
      },
      {
        tokenIndex: 21,
        tag: "plural",
        original: "cat.",
        correction: "cats.",
        explanation: "two 后面是可数名词复数：two cats。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十五批 · L100 案件（规格：prd-grammar-storytelling-2026-09-19.md §6；used to 讲故事首案：use→used 与 playing→play 双新错 + 旧错 tense/plural）──
    id: "hunt-old-habit",
    number: 109,
    title: "老习惯",
    scene: "老操场看台上夹着的一张旧习惯记录",
    tokens: [
      "I", "use", "to", "play", "here.",
      "She", "used", "to", "playing", "here.",
      "Yesterday", "I", "go", "home.",
      "We", "have", "two", "dog."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "verb_form",
        original: "use",
        correction: "used",
        explanation: "尾巴上少了 d：used to——「从前常常」的老记号不能丢。"
      },
      {
        tokenIndex: 8,
        tag: "verb_form",
        original: "playing",
        correction: "play",
        explanation: "used to 后面跟原形：play——它不认 -ing 外套。"
      },
      {
        tokenIndex: 12,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "Yesterday 说了昨天的事，动词要换昨天版：went——第 10 课的老规矩。"
      },
      {
        tokenIndex: 17,
        tag: "plural",
        original: "dog.",
        correction: "dogs.",
        explanation: "two 后面是可数名词复数：two dogs。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十五批 · L101 案件（规格：prd-grammar-storytelling-2026-09-19.md §6；本批三点回流：is→was／call→called／漏逗号／use→used）──
    id: "hunt-story-parts",
    number: 110,
    title: "故事零件",
    scene: "书桌上摊着的一张故事零件卡",
    tokens: [
      "It", "is", "raining", "yesterday.",
      "When", "you", "call,", "I", "was", "reading.",
      "While", "I", "was", "reading", "he", "was", "sleeping.",
      "I", "use", "to", "play", "here."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "tense",
        original: "is",
        correction: "was",
        explanation: "第 96 课回流：yesterday 在场，搭档要换昨天版——It 【was】 raining。"
      },
      {
        tokenIndex: 6,
        tag: "tense",
        original: "call,",
        correction: "called,",
        explanation: "第 97 课回流：打电话那件是昨天的事，要换昨天版——When you 【called】。"
      },
      {
        tokenIndex: 13,
        tag: "run_on",
        original: "reading",
        correction: "reading,",
        explanation: "第 98 课回流：两段之间点个逗号——While I was reading【,】 he was sleeping。"
      },
      {
        tokenIndex: 18,
        tag: "verb_form",
        original: "use",
        correction: "used",
        explanation: "第 93 课回流：从前的常常要带 d——I 【used】 to play here。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十五批 · L102 收官案件（规格：prd-grammar-storytelling-2026-09-19.md §6；本批四点回流：rain→raining／漏逗号／ring→rang／use→used）──
    id: "hunt-phone-story",
    number: 111,
    title: "电话故事",
    scene: "电话记录本最后一页上的一段完整记录",
    tokens: [
      "It", "was", "rain.",
      "While", "I", "was", "reading", "he", "was", "sleeping.",
      "I", "was", "reading", "when", "the", "phone", "ring.",
      "I", "use", "to", "play", "here.",
      "We", "have", "two", "cat."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "verb_form",
        original: "rain.",
        correction: "raining.",
        explanation: "第 96 课回流：背景句的动作要穿 -ing——It was 【raining】。"
      },
      {
        tokenIndex: 6,
        tag: "run_on",
        original: "reading",
        correction: "reading,",
        explanation: "第 98 课回流：两段之间点个逗号——While I was reading【,】 he was sleeping。"
      },
      {
        tokenIndex: 16,
        tag: "tense",
        original: "ring.",
        correction: "rang.",
        explanation: "第 99 课回流：响是一下子——用昨天版：【rang】。"
      },
      {
        tokenIndex: 25,
        tag: "plural",
        original: "cat.",
        correction: "cats.",
        explanation: "two 后面是可数名词复数：two cats。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十六批 · L103 开篇案件（规格：prd-grammar-causative-2026-09-19.md §6；新错 make→makes／does→do，旧错回流 L25 三单＋L11 复数）──
    id: "hunt-mom-makes",
    number: 112,
    title: "妈妈让我写作业",
    scene: "书桌上摊开的作业本，第一页写着四行字",
    tokens: [
      "My", "mom", "make", "me", "clean", "my", "room.",
      "My", "dad", "makes", "me", "does", "my", "homework.",
      "He", "drink", "milk", "every", "day.",
      "We", "have", "two", "apple."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "sv_agreement",
        original: "make",
        correction: "makes",
        explanation: "妈妈是「她」——动词要加 -s：My mom 【makes】 me clean my room。"
      },
      {
        tokenIndex: 11,
        tag: "verb_form",
        original: "does",
        correction: "do",
        explanation: "口令块后面穿原样：makes me 【do】——-s 前面已经用过一次了。"
      },
      {
        tokenIndex: 15,
        tag: "sv_agreement",
        original: "drink",
        correction: "drinks",
        explanation: "第 25 课回流：他/她/它后面的动词加 -s——He 【drinks】 milk every day。"
      },
      {
        tokenIndex: 22,
        tag: "plural",
        original: "apple.",
        correction: "apples.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【apples】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十六批 · L104 案件（规格：prd-grammar-causative-2026-09-19.md §6；新错 make→made／waited→wait，旧错回流 L10 昨天版＋L11 复数）──
    id: "hunt-made-me-wait",
    number: 113,
    title: "等了半小时",
    scene: "在街角等人时，便签本上写的四行字",
    tokens: [
      "He", "make", "me", "wait.",
      "She", "made", "me", "waited.",
      "Yesterday", "I", "go", "home.",
      "I", "went", "with", "two", "friend."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "tense",
        original: "make",
        correction: "made",
        explanation: "说昨天的事要换昨天版：make → 【made】——昨天版不带 -s。"
      },
      {
        tokenIndex: 7,
        tag: "verb_form",
        original: "waited.",
        correction: "wait.",
        explanation: "第 103 课规矩：口令块后面穿原样——made me 【wait】。"
      },
      {
        tokenIndex: 10,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "第 10 课回流：说昨天的事要换昨天版——go → 【went】。"
      },
      {
        tokenIndex: 16,
        tag: "plural",
        original: "friend.",
        correction: "friends.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【friends】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十六批 · L105 案件（规格：prd-grammar-causative-2026-09-19.md §6；新错 lets→let／let me to go，旧错回流 L19 was/were＋L11 复数）──
    id: "hunt-not-let-me",
    number: 114,
    title: "不让我去",
    scene: "晚上家门口，门垫上压着的字条",
    tokens: [
      "She", "doesn't", "lets", "me", "go.",
      "He", "doesn't", "let", "me", "to", "go.",
      "We", "was", "happy.",
      "I", "have", "two", "cat."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "verb_form",
        original: "lets",
        correction: "let",
        explanation: "帮手已经接了 -s 的活儿：doesn't 【let】 me go。"
      },
      {
        tokenIndex: 9,
        tag: "verb_form",
        original: "to",
        correction: "去掉 to",
        explanation: "第 103 课规矩：家族不认 to——let me 【go】，不垫板。"
      },
      {
        tokenIndex: 12,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation: "第 19 课回流：We 是一伙人，用 were 搭档——We 【were】 happy。"
      },
      {
        tokenIndex: 17,
        tag: "plural",
        original: "cat.",
        correction: "cats.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【cats】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十六批 · L106 案件（规格：prd-grammar-causative-2026-09-19.md §6；新错 let→lets／plays→play，旧错回流 L25 三单＋L11 复数）──
    id: "hunt-let-him-play",
    number: 115,
    title: "让他玩",
    scene: "客厅茶几上摆着的练习本，写着他家饭后的事",
    tokens: [
      "She", "let", "him", "play.",
      "She", "lets", "him", "plays.",
      "My", "brother", "watch", "TV.",
      "We", "have", "two", "dog."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "sv_agreement",
        original: "let",
        correction: "lets",
        explanation: "她是「她」——lets 要带 -s：She 【lets】 him play。"
      },
      {
        tokenIndex: 7,
        tag: "verb_form",
        original: "plays.",
        correction: "play.",
        explanation: "第 103 课规矩：后面穿原样——lets him 【play】。"
      },
      {
        tokenIndex: 10,
        tag: "sv_agreement",
        original: "watch",
        correction: "watches",
        explanation: "第 25 课回流：他/她/它后面的动词加 -s——My brother 【watches】 TV。"
      },
      {
        tokenIndex: 15,
        tag: "plural",
        original: "dog.",
        correction: "dogs.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【dogs】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十六批 · L107 案件（规格：prd-grammar-causative-2026-09-19.md §6；新错 has→had／came→come，旧错回流 L25 三单＋L11 复数）──
    id: "hunt-teacher-had-me",
    number: 116,
    title: "老师叫我",
    scene: "办公室门口的通知板上，钉着一张便条",
    tokens: [
      "The", "teacher", "has", "me", "come", "early.",
      "The", "teacher", "had", "me", "came", "early.",
      "He", "go", "to", "school.",
      "I", "have", "two", "book."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "tense",
        original: "has",
        correction: "had",
        explanation: "说已经发生过的事要用昨天版：has → 【had】——The teacher had me come early。"
      },
      {
        tokenIndex: 10,
        tag: "verb_form",
        original: "came",
        correction: "come",
        explanation: "第 103 课规矩：后面穿原样——had me 【come】，换版本只换前面那一个词。"
      },
      {
        tokenIndex: 13,
        tag: "sv_agreement",
        original: "go",
        correction: "goes",
        explanation: "第 25 课回流：他/她/它后面的动词加 -s——He 【goes】 to school。"
      },
      {
        tokenIndex: 19,
        tag: "plural",
        original: "book.",
        correction: "books.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【books】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十六批 · L108 案件（规格：prd-grammar-causative-2026-09-19.md §6；新错漏 to／get→got，旧错回流 L10 昨天版＋L11 复数）──
    id: "hunt-got-him-to",
    number: 117,
    title: "说服他去",
    scene: "放学路上，路边长椅上落下的一张便签",
    tokens: [
      "I", "got", "him", "go", "with", "me.",
      "I", "get", "him", "to", "go", "with", "me.",
      "Yesterday", "I", "see", "him.",
      "We", "have", "two", "banana."
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "verb_form",
        original: "go",
        correction: "to go",
        explanation: "这一家就 get 垫板：got him 【to go】——前面几课练的是不垫，到它这要垫。"
      },
      {
        tokenIndex: 7,
        tag: "tense",
        original: "get",
        correction: "got",
        explanation: "说已经说动过的那次，要用昨天版：get → 【got】。"
      },
      {
        tokenIndex: 15,
        tag: "tense",
        original: "see",
        correction: "saw",
        explanation: "第 10 课回流：说昨天的事要换昨天版——see → 【saw】。"
      },
      {
        tokenIndex: 20,
        tag: "plural",
        original: "banana.",
        correction: "bananas.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【bananas】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十六批 · L109 案件（规格：prd-grammar-causative-2026-09-19.md §6；新错 stops→stopped／wait→waited，旧错回流 L11 复数＋L19 have/has）──
    id: "hunt-until-rain",
    number: 118,
    title: "等雨停",
    scene: "屋檐下的长椅上，一张被雨气泡过的练习纸",
    tokens: [
      "I", "wait", "until", "the", "rain", "stopped.",
      "I", "waited", "until", "the", "rain", "stops.",
      "We", "have", "two", "bus.",
      "She", "have", "a", "dog."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "verb_form",
        original: "wait",
        correction: "waited",
        explanation: "两边都得用昨天版：前面也要过去版——I 【waited】 until the rain stopped。"
      },
      {
        tokenIndex: 11,
        tag: "tense",
        original: "stops.",
        correction: "stopped.",
        explanation: "前面用了昨天版 waited，后面也得跟昨天版——until the rain 【stopped】。"
      },
      {
        tokenIndex: 15,
        tag: "plural",
        original: "bus.",
        correction: "buses.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【buses】。"
      },
      {
        tokenIndex: 17,
        tag: "sv_agreement",
        original: "have",
        correction: "has",
        explanation: "第 25 课回流：她/他/它做事动词要变——She 【has】 a dog（第 3 课的 has 也是它）。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十六批 · L110 收官案件（规格：prd-grammar-causative-2026-09-19.md §6；全回流、不新增错型——四点分别锚 #112/#114/#117/#118）──
    id: "hunt-who-makes-who",
    number: 119,
    title: "谁让谁做什么",
    scene: "把这一章的话摆一摆——本子最后一页上的四行字",
    tokens: [
      "My", "mom", "make", "me", "do", "my", "homework.",
      "She", "doesn't", "lets", "me", "go.",
      "I", "got", "him", "go", "with", "me.",
      "I", "waited", "until", "the", "rain", "stop."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "sv_agreement",
        original: "make",
        correction: "makes",
        explanation: "第 103 课回流：妈妈是「她」——动词要加 -s：My mom 【makes】 me do my homework。"
      },
      {
        tokenIndex: 9,
        tag: "verb_form",
        original: "lets",
        correction: "let",
        explanation: "第 105 课回流：帮手已经接了 -s 的活儿——doesn't 【let】 me go。"
      },
      {
        tokenIndex: 15,
        tag: "verb_form",
        original: "go",
        correction: "to go",
        explanation: "第 108 课回流：这一家就 get 垫板——got him 【to go】。"
      },
      {
        tokenIndex: 23,
        tag: "tense",
        original: "stop.",
        correction: "stopped.",
        explanation: "第 109 课回流：两边都用昨天版——until the rain 【stopped】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十七批 · L111 开篇案件（规格：prd-grammar-a2-closeout-2026-09-19.md §6；新错漏撇号／月份 on→in，旧错回流 L10 昨天版＋L11 复数）──
    id: "hunt-grandmas-birthday",
    number: 120,
    title: "挂历上的生日",
    scene: "家里挂历前，十二个月格子上圈着全家的生日",
    tokens: [
      "Grandma", "birthday", "is", "in", "May.",
      "My", "birthday", "is", "on", "May.",
      "Yesterday", "I", "go", "to", "the", "park.",
      "We", "have", "two", "apple."
    ],
    errors: [
      {
        tokenIndex: 0,
        tag: "word_order",
        original: "Grandma",
        correction: "Grandma's",
        explanation: "「谁的」不能光着说：人后面要加撇号 s——Grandma【's】birthday。"
      },
      {
        tokenIndex: 8,
        tag: "preposition",
        original: "on",
        correction: "in",
        explanation: "第 56 课回流：只说哪个月用 in——月份是一个大格子，某一天才用 on。"
      },
      {
        tokenIndex: 12,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "第 10 课回流：说昨天的事要换昨天版——go → 【went】。"
      },
      {
        tokenIndex: 19,
        tag: "plural",
        original: "apple.",
        correction: "apples.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【apples】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十七批 · L112 案件（规格：prd-grammar-a2-closeout-2026-09-19.md §6；新错短版站句尾／人前缺小标签，旧错回流 L25 三单＋L11 复数）──
    id: "hunt-whose-book-mine",
    number: 121,
    title: "两本一样的书",
    scene: "茶几上两本封面一样的书，旁边压着一张字条",
    tokens: [
      "This", "book", "is", "my.",
      "That", "book", "is", "brother's.",
      "He", "drink", "milk", "every", "day.",
      "We", "have", "two", "book."
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "verb_form",
        original: "my.",
        correction: "mine.",
        explanation: "短版不能站句尾：my 后面得跟着东西——句尾收住要用长版 【mine】。"
      },
      {
        tokenIndex: 7,
        tag: "article",
        original: "brother's.",
        correction: "my brother's.",
        explanation: "人加撇号 s 前面还要有小标签：my brother's——光着说站不住。"
      },
      {
        tokenIndex: 9,
        tag: "sv_agreement",
        original: "drink",
        correction: "drinks",
        explanation: "第 25 课回流：他/她/它后面的动词加 -s——He 【drinks】 milk every day。"
      },
      {
        tokenIndex: 16,
        tag: "plural",
        original: "book.",
        correction: "books.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【books】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十七批 · L113 案件（规格：prd-grammar-a2-closeout-2026-09-19.md §6；新错 let→lets／plays→play 同型，旧错回流 L19 was/were＋L11 复数）──
    id: "hunt-bored-boring",
    number: 122,
    title: "雨天下午",
    scene: "沙发上摊着的作业本，最后一页写着四行字",
    tokens: [
      "The", "book", "is", "bored.",
      "I", "bored.",
      "We", "was", "happy.",
      "We", "have", "two", "sandwich."
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "verb_form",
        original: "bored.",
        correction: "boring.",
        explanation: "书不会「感到」——只有人会。说东西让人没劲，用让人版：The book is 【boring】。"
      },
      {
        tokenIndex: 5,
        tag: "missing_be",
        original: "bored.",
        correction: "am bored.",
        explanation: "搭档不能丢：I 和 am 一起出场（第 1 课的老规矩）——I 【am】 bored。"
      },
      {
        tokenIndex: 7,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation: "第 19 课回流：We 是一伙人，用 were 搭档——We 【were】 happy。"
      },
      {
        tokenIndex: 12,
        tag: "plural",
        original: "sandwich.",
        correction: "sandwiches.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【sandwiches】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十七批 · L114 案件（规格：prd-grammar-a2-closeout-2026-09-19.md §6；新错丢 a／a few 后跟单数，旧错回流 L11 复数＋L25 三单）──
    id: "hunt-few-apples",
    number: 123,
    title: "果盘见底了",
    scene: "果盘端上桌，旁边压着一张小纸条",
    tokens: [
      "There", "are", "few", "apples.",
      "There", "are", "a", "few", "apple.",
      "We", "have", "two", "bus.",
      "She", "have", "a", "dog."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "article",
        original: "few",
        correction: "a few",
        explanation: "「还有几个」（够）要说 a few——差一个小 a，意思就反了。"
      },
      {
        tokenIndex: 8,
        tag: "plural",
        original: "apple.",
        correction: "apples.",
        explanation: "第 11 课回流：a few 后面跟着的是好几个东西，要加尾巴——a few 【apples】。"
      },
      {
        tokenIndex: 12,
        tag: "plural",
        original: "bus.",
        correction: "buses.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【buses】。"
      },
      {
        tokenIndex: 14,
        tag: "sv_agreement",
        original: "have",
        correction: "has",
        explanation: "第 25 课回流：她/他/它做事动词要变——She 【has】 a dog。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十七批 · L115 案件（规格：prd-grammar-a2-closeout-2026-09-19.md §6；新错多补动词／the→a，旧错回流 L10 昨天版＋L11 复数）──
    id: "hunt-have-got-bike",
    number: 124,
    title: "新车棚",
    scene: "楼下新车棚，车把上挂着的一张便签",
    tokens: [
      "I", "have", "got", "a", "new", "bike", "is.",
      "I", "have", "got", "the", "new", "bike.",
      "Yesterday", "I", "go", "home.",
      "We", "have", "two", "bag."
    ],
    errors: [
      {
        tokenIndex: 6,
        tag: "verb_form",
        original: "is.",
        correction: "去掉 is.",
        explanation: "got 后面直接接东西，句子就完了——不用再补 is，一句话只要一个「发动机」。"
      },
      {
        tokenIndex: 10,
        tag: "article",
        original: "the",
        correction: "a",
        explanation: "第一次说这辆车要用 a：a new bike。the 是说双方都知道的那一辆。"
      },
      {
        tokenIndex: 15,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "第 10 课回流：说昨天的事要换昨天版——go → 【went】。"
      },
      {
        tokenIndex: 20,
        tag: "plural",
        original: "bag.",
        correction: "bags.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【bags】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十七批 · L116 案件（规格：prd-grammar-a2-closeout-2026-09-19.md §6；新错 have→has／多补动词，旧错回流 L19 was/were＋L11 复数）──
    id: "hunt-she-has-got",
    number: 125,
    title: "姐姐的新包",
    scene: "沙发上并排摆着的两个包，旁边一张购物单",
    tokens: [
      "She", "have", "got", "a", "new", "bag.",
      "She", "has", "got", "a", "new", "bag", "is.",
      "They", "was", "happy.",
      "We", "have", "two", "book."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "sv_agreement",
        original: "have",
        correction: "has",
        explanation: "她是「她」——have 要换成 【has】（第 25 课的老规矩）。"
      },
      {
        tokenIndex: 12,
        tag: "verb_form",
        original: "is.",
        correction: "去掉 is.",
        explanation: "第 115 课规矩：got 后面直接接东西，句子就完了——不用再补 is。"
      },
      {
        tokenIndex: 14,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation: "第 19 课回流：They 是一伙人，用 were 搭档——They 【were】 happy。"
      },
      {
        tokenIndex: 19,
        tag: "plural",
        original: "book.",
        correction: "books.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【books】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十七批 · L117 案件（规格：prd-grammar-a2-closeout-2026-09-19.md §6；新错 boring→bored／门牌 in→at，旧错回流 L10 型 tense＋L11 复数）──
    id: "hunt-all-i-wanted",
    number: 126,
    title: "本子上的四行",
    scene: "本子上排成四行的话，边上画着几个小圈",
    tokens: [
      "I", "am", "boring.",
      "I", "am", "good", "in", "drawing.",
      "I", "waited", "until", "the", "rain", "stop.",
      "We", "have", "two", "friend."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "verb_form",
        original: "boring.",
        correction: "bored.",
        explanation: "第 113 课回流：说自己没劲用感到版——I am 【bored】。"
      },
      {
        tokenIndex: 6,
        tag: "preposition",
        original: "in",
        correction: "at",
        explanation: "第 67 课回流：擅长做什么用 at——good 【at】 drawing。"
      },
      {
        tokenIndex: 13,
        tag: "tense",
        original: "stop.",
        correction: "stopped.",
        explanation: "第 109 课回流：until 两边都用昨天版——until the rain 【stopped】。"
      },
      {
        tokenIndex: 17,
        tag: "plural",
        original: "friend.",
        correction: "friends.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【friends】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十七批 · L118 收官案件（规格：prd-grammar-a2-closeout-2026-09-19.md §6；全回流、不新增错型——四点分别锚 #120/#122/#123/#125）──
    id: "hunt-close-17",
    number: 127,
    title: "最后一页",
    scene: "本子最后一页，这一章学过的几句话排在下面",
    tokens: [
      "Grandma", "birthday", "is", "in", "May.",
      "I", "am", "boring.",
      "There", "are", "few", "apples.",
      "She", "have", "got", "a", "new", "bag."
    ],
    errors: [
      {
        tokenIndex: 0,
        tag: "word_order",
        original: "Grandma",
        correction: "Grandma's",
        explanation: "第 111 课回流：「谁的」不能光着说——人后面要加撇号 s。"
      },
      {
        tokenIndex: 7,
        tag: "verb_form",
        original: "boring.",
        correction: "bored.",
        explanation: "第 113 课回流：说自己没劲用感到版——I am 【bored】。"
      },
      {
        tokenIndex: 10,
        tag: "article",
        original: "few",
        correction: "a few",
        explanation: "第 114 课回流：「还有几个」要说 a few——差一个小 a，意思就反了。"
      },
      {
        tokenIndex: 13,
        tag: "sv_agreement",
        original: "have",
        correction: "has",
        explanation: "第 116 课回流：她是「她」——have 要换成 【has】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十八批 · L119 开篇案件（规格：prd-grammar-used-to-2026-09-19.md §7；新错 use→used／漏 be，旧错回流 L10 昨天版＋L11 复数）──
    id: "hunt-used-to-it",
    number: 128,
    title: "新住处第一周",
    scene: "新住处窗台上压着的一张便条，记着这一周的事",
    tokens: [
      "I", "am", "use", "to", "the", "cold.",
      "I", "used", "to", "the", "city.",
      "Yesterday", "I", "go", "home.",
      "We", "have", "two", "bag."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "verb_form",
        original: "use",
        correction: "used",
        explanation: "习惯的记号是 used（带 d）——前面有 am 站着，它也不动：am 【used】 to the cold。"
      },
      {
        tokenIndex: 7,
        tag: "missing_be",
        original: "used",
        correction: "am used",
        explanation: "说「习惯了」要有 am／is／are 站着——I 【am】 used to the city。"
      },
      {
        tokenIndex: 13,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "第 10 课回流：说昨天的事要换昨天版——go → 【went】。"
      },
      {
        tokenIndex: 18,
        tag: "plural",
        original: "bag.",
        correction: "bags.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【bags】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十八批 · L120 案件（规格：prd-grammar-used-to-2026-09-19.md §7；新错 get→getting／漏 to，旧错回流 L25 三单＋L11 复数）──
    id: "hunt-getting-up-early",
    number: 129,
    title: "六点的闹钟",
    scene: "新家床头柜上的一张作息便签",
    tokens: [
      "I", "am", "used", "to", "get", "up", "early.",
      "She", "is", "used", "getting", "up", "early.",
      "He", "drink", "milk", "every", "day.",
      "We", "have", "two", "clock."
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "verb_form",
        original: "get",
        correction: "getting",
        explanation: "做的事要穿名字版：get → 【getting】 up early（有 be 站着的 to 认名字版）。"
      },
      {
        tokenIndex: 10,
        tag: "preposition",
        original: "getting",
        correction: "to getting",
        explanation: "to 不能丢：used 【to】 getting——有 be 站着，它照样带着 to。"
      },
      {
        tokenIndex: 14,
        tag: "sv_agreement",
        original: "drink",
        correction: "drinks",
        explanation: "第 25 课回流：他/她/它后面的动词加 -s——He 【drinks】 milk every day。"
      },
      {
        tokenIndex: 21,
        tag: "plural",
        original: "clock.",
        correction: "clocks.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【clocks】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十八批 · L121 案件（规格：prd-grammar-used-to-2026-09-19.md §7；新错 get→getting／use→used，旧错回流 L10 昨天版＋L11 复数）──
    id: "hunt-getting-used-to",
    number: 130,
    title: "第二周",
    scene: "新学校课桌上摊着的日记本，写着这一周",
    tokens: [
      "I", "am", "get", "used", "to", "it.",
      "She", "is", "getting", "use", "to", "the", "noise.",
      "Yesterday", "I", "see", "him.",
      "We", "have", "two", "book."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "verb_form",
        original: "get",
        correction: "getting",
        explanation: "「慢慢」是正在发生的过程——get 要穿 -ing：am 【getting】 used to it。"
      },
      {
        tokenIndex: 9,
        tag: "verb_form",
        original: "use",
        correction: "used",
        explanation: "习惯的记号照样是 used（带 d）——getting 【used】 to the noise。"
      },
      {
        tokenIndex: 15,
        tag: "tense",
        original: "see",
        correction: "saw",
        explanation: "第 10 课回流：说昨天的事要换昨天版——see → 【saw】。"
      },
      {
        tokenIndex: 20,
        tag: "plural",
        original: "book.",
        correction: "books.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【books】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十八批 · L122 案件（脊柱课；规格：prd-grammar-used-to-2026-09-19.md §7；新错两张脸混形／漏 to，旧错回流 L10 昨天版＋L11 复数）──
    id: "hunt-two-faces",
    number: 131,
    title: "两张脸排一行",
    scene: "本子上并排写着两行——一行「从前」，一行「现在」",
    tokens: [
      "She", "used", "to", "working", "late.",
      "I", "am", "used", "walking", "to", "school.",
      "Yesterday", "I", "go", "home.",
      "We", "have", "two", "clock."
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "verb_form",
        original: "working",
        correction: "work",
        explanation: "第 93 课规矩：只有 used、没有 be 的时候，后面穿原样——used to 【work】 late。"
      },
      {
        tokenIndex: 8,
        tag: "preposition",
        original: "walking",
        correction: "to walking",
        explanation: "有 be 站着的时候，to 不能丢：used 【to】 walking to school。"
      },
      {
        tokenIndex: 13,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "第 10 课回流：说昨天的事要换昨天版——go → 【went】。"
      },
      {
        tokenIndex: 18,
        tag: "plural",
        original: "clock.",
        correction: "clocks.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【clocks】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十八批 · L123 案件（规格：prd-grammar-used-to-2026-09-19.md §7；新错 don't→am not／Are 语序，旧错回流 L19 was/were＋L11 复数）──
    id: "hunt-not-used-to",
    number: 132,
    title: "操场上的一句话",
    scene: "操场上接力棒旁边的一张记分纸",
    tokens: [
      "I", "don't", "used", "to", "it.",
      "You", "are", "used", "to", "the", "noise?",
      "They", "was", "happy.",
      "We", "have", "two", "ball."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "verb_form",
        original: "don't",
        correction: "am not",
        explanation: "说「习惯了」的「不」动 be：not 跟在 am 后面——I 【am not】 used to it。"
      },
      {
        tokenIndex: 5,
        tag: "word_order",
        original: "You",
        correction: "去掉 You（Are 搬句首）",
        explanation: "想问别人，be 要站到句首：Are you used to the noise?——光说 You are 是在陈述，不是问。"
      },
      {
        tokenIndex: 12,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation: "第 19 课回流：They 是一伙人，用 were 搭档——They 【were】 happy。"
      },
      {
        tokenIndex: 17,
        tag: "plural",
        original: "ball.",
        correction: "balls.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【balls】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十八批 · L124 收官案件（规格：prd-grammar-used-to-2026-09-19.md §7；全回流、不新增错型——四点分别锚 #128/#129/#130/#131）──
    id: "hunt-close-18",
    number: 133,
    title: "最后一页",
    scene: "本子最后一页，这一章学过的几行排在下面",
    tokens: [
      "I", "use", "to", "the", "cold.",
      "I", "am", "used", "to", "get", "up", "early.",
      "I", "am", "get", "used", "to", "it.",
      "She", "used", "to", "walking", "late."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "verb_form",
        original: "use",
        correction: "used",
        explanation: "第 119 课回流：习惯的记号是 used（带 d）——前面有 am 站着，它也不动。"
      },
      {
        tokenIndex: 9,
        tag: "verb_form",
        original: "get",
        correction: "getting",
        explanation: "第 120 课回流：做的事要穿名字版——used to 【getting】 up early。"
      },
      {
        tokenIndex: 14,
        tag: "verb_form",
        original: "get",
        correction: "getting",
        explanation: "第 121 课回流：「慢慢」是正在发生的过程——am 【getting】 used to it。"
      },
      {
        tokenIndex: 21,
        tag: "verb_form",
        original: "walking",
        correction: "work",
        explanation: "第 122 课回流：只有 used、没有 be 的时候，后面穿原样——used to 【work】 late。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十九批 · L125 开篇案件（规格：prd-grammar-look-2026-09-19.md §7；新错中间站 is／漏 -s，旧错回流 L10 昨天版＋L11 复数）──
    id: "hunt-it-looks-nice",
    number: 134,
    title: "画纸上的那句话",
    scene: "书桌上摊着的画纸，背面写着几行字",
    tokens: [
      "It", "looks", "is", "nice.",
      "It", "look", "nice.",
      "Yesterday", "I", "go", "home.",
      "We", "have", "two", "box."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "verb_form",
        original: "is",
        correction: "去掉 is",
        explanation: "中间不站 is：look 自己站中间就够了——It looks 【nice】。"
      },
      {
        tokenIndex: 5,
        tag: "sv_agreement",
        original: "look",
        correction: "looks",
        explanation: "「它」是单个的，look 要带上 s——It 【looks】 nice。"
      },
      {
        tokenIndex: 9,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "第 10 课回流：说昨天的事要换昨天版——go → 【went】。"
      },
      {
        tokenIndex: 14,
        tag: "plural",
        original: "box.",
        correction: "boxes.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【boxes】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十九批 · L126 案件（规格：prd-grammar-look-2026-09-19.md §7；新错 looks→look／look→looks，旧错回流 L19 was/were＋L11 复数）──
    id: "hunt-you-look-tired",
    number: 135,
    title: "走廊里的那句话",
    scene: "学校走廊的长椅上，落着一张记分纸",
    tokens: [
      "You", "looks", "tired.",
      "She", "look", "tired.",
      "They", "was", "happy.",
      "We", "have", "two", "cup."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "sv_agreement",
        original: "looks",
        correction: "look",
        explanation: "「你」配原样的 look——不带 s：You 【look】 tired。"
      },
      {
        tokenIndex: 4,
        tag: "sv_agreement",
        original: "look",
        correction: "looks",
        explanation: "「她」配带 s 的 looks（第 25 课的老规矩）：She 【looks】 tired。"
      },
      {
        tokenIndex: 7,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation: "第 19 课回流：They 是一伙人，用 were 搭档——They 【were】 happy。"
      },
      {
        tokenIndex: 12,
        tag: "plural",
        original: "cup.",
        correction: "cups.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【cups】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第十九批 · L127 收官案件（规格：prd-grammar-look-2026-09-19.md §7；全回流、不新增错型——三点锚 #134/#135，旧错取 L10 型）──
    id: "hunt-two-look-faces",
    number: 136,
    title: "放学前的那句话",
    scene: "教室黑板上留着的一行板书",
    tokens: [
      "The", "sky", "look", "dark.",
      "You", "looks", "tired.",
      "It", "looks", "is", "nice.",
      "Yesterday", "I", "go", "home."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "sv_agreement",
        original: "look",
        correction: "looks",
        explanation: "第 125 课回流：「天」是单个的，look 要带上 s——The sky 【looks】 dark。"
      },
      {
        tokenIndex: 5,
        tag: "sv_agreement",
        original: "looks",
        correction: "look",
        explanation: "第 126 课回流：「你」配原样的 look——不带 s。"
      },
      {
        tokenIndex: 9,
        tag: "verb_form",
        original: "is",
        correction: "去掉 is",
        explanation: "第 125 课回流：中间不站 is——look 自己站中间就够了。"
      },
      {
        tokenIndex: 13,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "第 10 课回流：说昨天的事要换昨天版——go → 【went】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十批 · L128 开篇案件（规格：prd-grammar-five-senses-2026-09-19.md §7；新错中间站 is／漏 -s，旧错回流 L10 昨天版＋L11 复数）──
    id: "hunt-it-sounds-great",
    number: 137,
    title: "厨房里的声音",
    scene: "厨房料理台上压着的一张便条",
    tokens: [
      "It", "sounds", "is", "great.",
      "It", "sound", "great.",
      "Yesterday", "I", "go", "home.",
      "We", "have", "two", "box."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "verb_form",
        original: "is",
        correction: "去掉 is",
        explanation: "中间不站 is：听的那个词自己站中间就够了——It sounds 【great】。"
      },
      {
        tokenIndex: 5,
        tag: "sv_agreement",
        original: "sound",
        correction: "sounds",
        explanation: "「它」是单个的，sound 要带上 s——It 【sounds】 great。"
      },
      {
        tokenIndex: 9,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "第 10 课回流：说昨天的事要换昨天版——go → 【went】。"
      },
      {
        tokenIndex: 14,
        tag: "plural",
        original: "box.",
        correction: "boxes.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【boxes】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十批 · L129 案件（规格：prd-grammar-five-senses-2026-09-19.md §7；新错 well→good／漏 -s，旧错回流 L19 was/were＋L25 三单）──
    id: "hunt-it-smells-good",
    number: 138,
    title: "锅里的香味",
    scene: "灶台边贴着的一张炖汤步骤纸",
    tokens: [
      "It", "smells", "well.",
      "It", "smell", "good.",
      "They", "was", "happy.",
      "He", "drink", "milk."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "word_order",
        original: "well.",
        correction: "good.",
        explanation: "well 是「做得好」（第 59 课）——这句说的是「闻着怎么样」，要用 【good】。"
      },
      {
        tokenIndex: 4,
        tag: "sv_agreement",
        original: "smell",
        correction: "smells",
        explanation: "「它」是单个的，smell 要带上 s——It 【smells】 good。"
      },
      {
        tokenIndex: 7,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation: "第 19 课回流：They 是一伙人，用 were 搭档——They 【were】 happy。"
      },
      {
        tokenIndex: 10,
        tag: "sv_agreement",
        original: "drink",
        correction: "drinks",
        explanation: "第 25 课回流：他/她/它后面的动词加 -s——He 【drinks】 milk。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十批 · L130 案件（规格：prd-grammar-five-senses-2026-09-19.md §7；新错 well→good／漏 -s，旧错回流 L10 昨天版＋L11 复数）──
    id: "hunt-it-tastes-good",
    number: 139,
    title: "桌上的蛋糕",
    scene: "饭桌上留着的半张蛋糕盒卡片",
    tokens: [
      "This", "cake", "tastes", "well.",
      "This", "cake", "taste", "good.",
      "Yesterday", "I", "go", "home.",
      "We", "have", "two", "cup."
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "word_order",
        original: "well.",
        correction: "good.",
        explanation: "well 是「做得好」——这句说的是「尝着怎么样」，要用 【good】（第 59 课的老规矩）。"
      },
      {
        tokenIndex: 6,
        tag: "sv_agreement",
        original: "taste",
        correction: "tastes",
        explanation: "「这个蛋糕」是单个的，taste 要带上 s——This cake 【tastes】 good。"
      },
      {
        tokenIndex: 10,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "第 10 课回流：说昨天的事要换昨天版——go → 【went】。"
      },
      {
        tokenIndex: 15,
        tag: "plural",
        original: "cup.",
        correction: "cups.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【cups】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十批 · L131 案件（规格：prd-grammar-five-senses-2026-09-19.md §7；新错 -ly 过度套用／漏 -s，旧错回流 L19 was/were＋L25 三单）──
    id: "hunt-water-feels-cold",
    number: 140,
    title: "洗手台前",
    scene: "洗手台边贴着的值日提醒条",
    tokens: [
      "The", "water", "feels", "coldly.",
      "The", "water", "feel", "cold.",
      "They", "was", "happy.",
      "She", "drink", "milk."
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "word_order",
        original: "coldly.",
        correction: "cold.",
        explanation: "不加 -ly：这句说的是「摸着怎么样」，后面直接跟 【cold】（第 58 课的老规矩）。"
      },
      {
        tokenIndex: 6,
        tag: "sv_agreement",
        original: "feel",
        correction: "feels",
        explanation: "「这水」是单个的，feel 要带上 s——The water 【feels】 cold。"
      },
      {
        tokenIndex: 9,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation: "第 19 课回流：They 是一伙人，用 were 搭档——They 【were】 happy。"
      },
      {
        tokenIndex: 12,
        tag: "sv_agreement",
        original: "drink",
        correction: "drinks",
        explanation: "第 25 课回流：他/她/它后面的动词加 -s——She 【drinks】 milk。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十批 · L132 案件（规格：prd-grammar-five-senses-2026-09-19.md §7；新错 not sounds／Does it sounds，旧错回流 L10 昨天版＋L11 复数）──
    id: "hunt-does-it-sound-good",
    number: 141,
    title: "课间的一句话",
    scene: "课桌角上贴着的一张周末安排小纸条",
    tokens: [
      "It", "not", "sounds", "good.",
      "Does", "it", "sounds", "good?",
      "Yesterday", "I", "go", "home.",
      "We", "have", "two", "box."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "verb_form",
        original: "not",
        correction: "does not",
        explanation: "说「不」要请帮手：does not 站前面，sound 退回原样——It 【does not】 sound good。"
      },
      {
        tokenIndex: 6,
        tag: "verb_form",
        original: "sounds",
        correction: "sound",
        explanation: "帮手 Does 已经站到句首了，sound 退回原样——Does it 【sound】 good?"
      },
      {
        tokenIndex: 10,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "第 10 课回流：说昨天的事要换昨天版——go → 【went】。"
      },
      {
        tokenIndex: 15,
        tag: "plural",
        original: "box.",
        correction: "boxes.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【boxes】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十批 · L133 收官案件（规格：prd-grammar-five-senses-2026-09-19.md §7；全回流、不新增错型——三点锚 #137/#138/#139/#140）──
    id: "hunt-five-senses",
    number: 142,
    title: "本子上的五行",
    scene: "书桌上摊开的本子，最后一行还没写完",
    tokens: [
      "It", "looks", "is", "nice.",
      "It", "sound", "great.",
      "This", "cake", "tastes", "well.",
      "The", "water", "feel", "cold."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "verb_form",
        original: "is",
        correction: "去掉 is",
        explanation: "第 125 课回流：中间不站 is——看的那个词自己站中间就够了。"
      },
      {
        tokenIndex: 5,
        tag: "sv_agreement",
        original: "sound",
        correction: "sounds",
        explanation: "第 128 课回流：「它」是单个的，sound 要带上 s——It 【sounds】 great。"
      },
      {
        tokenIndex: 10,
        tag: "word_order",
        original: "well.",
        correction: "good.",
        explanation: "第 130 课回流：well 是「做得好」——说「尝着怎么样」要用 【good】。"
      },
      {
        tokenIndex: 13,
        tag: "sv_agreement",
        original: "feel",
        correction: "feels",
        explanation: "第 131 课回流：「这水」是单个的——feel 要带上 s。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十一批 · L134 开篇案件（规格：prd-grammar-look-forward-to-2026-09-20.md §9；新错 look→looking／漏 to，旧错回流 L10 昨天版＋L11 复数）──
    id: "hunt-looking-forward-weekend",
    number: 143,
    title: "台历上的圈",
    scene: "书桌上摊开的台历，周六那格画了个圈",
    tokens: [
      "I", "am", "look", "forward", "to", "the", "weekend.",
      "I", "looking", "forward", "to", "the", "weekend.",
      "Yesterday", "I", "go", "home.",
      "We", "have", "two", "box."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "verb_form",
        original: "look",
        correction: "looking",
        explanation: "「盼着」这个记号是 looking——前面站着 am，它穿 -ing：am 【looking】 forward to。"
      },
      {
        tokenIndex: 9,
        tag: "preposition",
        original: "forward",
        correction: "forward to",
        explanation: "to 不能丢：looking forward 【to】 the weekend——三个词是一块记号。"
      },
      {
        tokenIndex: 15,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "第 10 课回流：说昨天的事要换昨天版——go → 【went】。"
      },
      {
        tokenIndex: 20,
        tag: "plural",
        original: "box.",
        correction: "boxes.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【boxes】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十一批 · L135 案件（规格：prd-grammar-look-forward-to-2026-09-20.md §9；新错漏 -s／漏 the，旧错回流 L19 was/were＋L25 三单）──
    id: "hunt-she-looks-forward",
    number: 144,
    title: "画满圈的日历",
    scene: "课桌上摊着的日历，暑假那几天画满了圈",
    tokens: [
      "She", "look", "forward", "to", "the", "summer.",
      "She", "looks", "forward", "to", "summer.",
      "They", "was", "happy.",
      "He", "drink", "milk."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "sv_agreement",
        original: "look",
        correction: "looks",
        explanation: "她是「她」——记号要带上 s：She 【looks】 forward to。"
      },
      {
        tokenIndex: 10,
        tag: "article",
        original: "summer.",
        correction: "the summer.",
        explanation: "说的是「这个夏天」（要等的那个）——前面带上 the：the summer。"
      },
      {
        tokenIndex: 12,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation: "第 19 课回流：They 是一伙人，用 were 搭档——They 【were】 happy。"
      },
      {
        tokenIndex: 15,
        tag: "sv_agreement",
        original: "drink",
        correction: "drinks",
        explanation: "第 25 课回流：他/她/它后面的动词加 -s——He 【drinks】 milk。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十一批 · L136 案件（规格：prd-grammar-look-forward-to-2026-09-20.md §9；新错 see→seeing（本批新错型）＋漏 to，旧错回流 L10 昨天版＋L11 复数）──
    id: "hunt-looking-forward-seeing",
    number: 145,
    title: "电话里的那句话",
    scene: "书桌上的电话便签，记着下周的安排",
    tokens: [
      "I", "am", "looking", "forward", "to", "see", "you.",
      "I", "am", "looking", "forward", "seeing", "you.",
      "Yesterday", "I", "go", "home.",
      "We", "have", "two", "cup."
    ],
    errors: [
      {
        tokenIndex: 5,
        tag: "verb_form",
        original: "see",
        correction: "seeing",
        explanation: "盼着的是「做那件事」——那件事要穿名字版：to 【seeing】 you（第 120 课同一个规矩）。"
      },
      {
        tokenIndex: 10,
        tag: "preposition",
        original: "forward",
        correction: "forward to",
        explanation: "to 不能丢：looking forward 【to】 seeing you——三个词是一块记号。"
      },
      {
        tokenIndex: 15,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "第 10 课回流：说昨天的事要换昨天版——go → 【went】。"
      },
      {
        tokenIndex: 20,
        tag: "plural",
        original: "cup.",
        correction: "cups.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【cups】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十一批 · L137 案件（规格：prd-grammar-look-forward-to-2026-09-20.md §9；新错 Do→Are（不请帮手）／look→looking，旧错回流 L10 昨天版＋L11 复数）──
    id: "hunt-are-you-looking-forward",
    number: 146,
    title: "暑假通知单",
    scene: "课桌上传着的暑假通知单，边上有人写了几个字",
    tokens: [
      "Do", "you", "looking", "forward", "to", "the", "summer?",
      "I", "am", "not", "look", "forward", "to", "saying", "goodbye.",
      "Yesterday", "I", "go", "home.",
      "We", "have", "two", "cup."
    ],
    errors: [
      {
        tokenIndex: 0,
        tag: "verb_form",
        original: "Do",
        correction: "Are",
        explanation: "句子里站的是 be——问要搬 be，不请帮手：Are you looking…？（第 123 课的老规矩）"
      },
      {
        tokenIndex: 10,
        tag: "verb_form",
        original: "look",
        correction: "looking",
        explanation: "说「不」不动记号的形状：am not 【looking】 forward to…。"
      },
      {
        tokenIndex: 17,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "第 10 课回流：说昨天的事要换昨天版——go → 【went】。"
      },
      {
        tokenIndex: 22,
        tag: "plural",
        original: "cup.",
        correction: "cups.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【cups】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十一批 · L138 收官案件（规格：prd-grammar-look-forward-to-2026-09-20.md §9；全回流、不新增错型——四点分别锚 #143/#144/#145/#146）──
    id: "hunt-two-stations",
    number: 147,
    title: "本子上的两个 to",
    scene: "书桌上摊开的本子，两句话中间画了条竖线",
    tokens: [
      "I", "am", "used", "to", "get", "up", "early.",
      "I", "am", "looking", "forward", "to", "see", "you.",
      "She", "look", "forward", "to", "the", "summer.",
      "We", "have", "two", "cup."
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "verb_form",
        original: "get",
        correction: "getting",
        explanation: "第 120 课回流：这个 to 认名字版——used to 【getting】 up early。"
      },
      {
        tokenIndex: 12,
        tag: "verb_form",
        original: "see",
        correction: "seeing",
        explanation: "第 136 课回流：这个 to 也认名字版——looking forward to 【seeing】 you。"
      },
      {
        tokenIndex: 15,
        tag: "sv_agreement",
        original: "look",
        correction: "looks",
        explanation: "第 135 课回流：她是「她」——记号带上 s：She 【looks】 forward to。"
      },
      {
        tokenIndex: 23,
        tag: "plural",
        original: "cup.",
        correction: "cups.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【cups】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十二批 · L139 开篇案件（规格：prd-grammar-contrast-2026-09-20.md §9；新错「虽然…但是」并存（本批新错型）／will 漏用，旧错回流 L10 昨天版＋L11 复数）──
    id: "hunt-although-rain",
    number: 148,
    title: "雨里的那句话",
    scene: "门口伞架旁压着的一张便条",
    tokens: [
      "Although", "it", "is", "raining,", "but", "I", "will", "go", "out.",
      "Although", "it", "is", "raining,", "I", "go", "out.",
      "Yesterday", "I", "go", "home.",
      "We", "have", "two", "box."
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "run_on",
        original: "but",
        correction: "去掉 but",
        explanation: "中文的「虽然…但是…」成对说，英语只留一个：前面有了 Although，后面就不带 but。"
      },
      {
        tokenIndex: 14,
        tag: "tense",
        original: "go",
        correction: "will go",
        explanation: "说的是「等下要出去」（还没发生）——后面那句要用 will：I 【will】 go out。"
      },
      {
        tokenIndex: 18,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "第 10 课回流：说昨天的事要换昨天版——go → 【went】。"
      },
      {
        tokenIndex: 23,
        tag: "plural",
        original: "box.",
        correction: "boxes.",
        explanation: "第 11 课回流：two 后面是可数名词复数——two 【boxes】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十二批 · L140 案件（规格：prd-grammar-contrast-2026-09-20.md §9；新错两张脸同时上／逗号错位，旧错回流 L19 was/were＋L25 三单）──
    id: "hunt-but-vs-although",
    number: 149,
    title: "便签上的两张脸",
    scene: "桌上并排摆着的两张便签，写着同一个意思",
    tokens: [
      "It", "is", "raining,", "but", "I", "will", "go", "out.",
      "Although", "it", "is", "raining", "but", "I", "will", "go", "out.",
      "They", "was", "happy.",
      "He", "drink", "milk."
    ],
    errors: [
      {
        tokenIndex: 11,
        tag: "run_on",
        original: "raining",
        correction: "raining,",
        explanation: "Although 领完那一整句要点个逗号断开——Although it is raining【,】；站中间的 but 前面也要点逗号。"
      },
      {
        tokenIndex: 12,
        tag: "run_on",
        original: "but",
        correction: "去掉 but",
        explanation: "两张脸不能同时上：前面有了 Although，后面就不用 but（只留一个）。"
      },
      {
        tokenIndex: 18,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation: "第 19 课回流：They 是一伙人，用 were 搭档——They 【were】 happy。"
      },
      {
        tokenIndex: 21,
        tag: "sv_agreement",
        original: "drink",
        correction: "drinks",
        explanation: "第 25 课回流：他/她/它后面的动词加 -s——He 【drinks】 milk。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十二批 · L141 收官案件（规格：prd-grammar-contrast-2026-09-20.md §9；全回流、不新增错型——四点分别锚 #148/#149）──
    id: "hunt-close-22",
    number: 150,
    title: "本子上的等号",
    scene: "书桌上摊开的本子，两句话中间画了个等号",
    tokens: [
      "Although", "it", "is", "raining,", "but", "I", "will", "go", "out.",
      "It", "is", "raining", "but", "I", "will", "go", "out.",
      "Although", "raining,", "I", "will", "go", "out.",
      "They", "was", "happy."
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "run_on",
        original: "but",
        correction: "去掉 but",
        explanation: "第 139 课回流：两张脸不能同时上——前面有了 Although，后面就不用 but。"
      },
      {
        tokenIndex: 11,
        tag: "run_on",
        original: "raining",
        correction: "raining,",
        explanation: "第 140 课回流：but 站中间，前面点个逗号断一下——It is raining【,】 but I will go out。"
      },
      {
        tokenIndex: 18,
        tag: "fragment",
        original: "raining,",
        correction: "it is raining,",
        explanation: "第 139 课回流：Although 后面要跟一个完整的小句子——Although 【it is raining】。"
      },
      {
        tokenIndex: 24,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation: "第 19 课回流：They 是一伙人，用 were 搭档——They 【were】 happy。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十三批 · L142 案件（规格：prd-grammar-as-soon-as-2026-09-20.md §11；新错 word_order 缺两头／verb_form 前面请 will，旧错回流 L10＋L11）──
    id: "hunt-as-soon-as-comes",
    number: 151,
    title: "饭桌上的四行字",
    scene: "傍晚的饭桌：位子还空着，本子上写了四行",
    tokens: [
      "As", "soon", "as", "I", "will", "finish,", "I", "will", "eat.",
      "Soon", "as", "I", "finish,", "I", "will", "eat.",
      "Yesterday", "I", "go", "home", "late.",
      "I", "ate", "two", "sandwich."
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "verb_form",
        original: "will",
        correction: "去掉 will",
        explanation: "前面那件说现在，不请 will：As soon as I 【finish】——第 48 课那条规矩，as soon as 也照办。"
      },
      {
        tokenIndex: 9,
        tag: "word_order",
        original: "Soon",
        correction: "As soon",
        explanation: "两头都要卡住：少一头 as，「一到就」就散架——As 【soon as】 I finish。第 65 课那句 as tall as 是「一样」，这句是「一到就」——同一个字，两张脸。"
      },
      {
        tokenIndex: 18,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "第 10 课回流：说昨天的事要换昨天版——go → 【went】。"
      },
      {
        tokenIndex: 24,
        tag: "plural",
        original: "sandwich.",
        correction: "sandwiches.",
        explanation: "第 11 课回流：two 后面要加 -s——two 【sandwiches】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十三批 · L143 案件（规格：prd-grammar-as-soon-as-2026-09-20.md §11；新错 word_order 缺第二头／tense 后面漏 will，旧错回流 L19＋L25）──
    id: "hunt-when-vs-as-soon",
    number: 152,
    title: "妹妹又追了一句",
    scene: "同一张饭桌上的问句，妹妹端着碗追问",
    tokens: [
      "When", "I", "finish,", "I", "eat.",
      "As", "soon", "I", "finish,", "I", "will", "eat.",
      "My", "sister", "and", "I", "was", "happy.",
      "She", "like", "music."
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "tense",
        original: "eat.",
        correction: "will eat.",
        explanation: "后面那件还没发生，要带上 will——When I finish, I 【will eat】。中文的「就」不带将来，英语这边要带。"
      },
      {
        tokenIndex: 6,
        tag: "word_order",
        original: "soon",
        correction: "as soon as",
        explanation: "两头都要卡住：第 142 课少的是第一头，这回少的是第二头——As soon 【as】 I finish。两个 as 缺一不可。"
      },
      {
        tokenIndex: 16,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation: "第 19 课回流：My sister and I 是两个人，算一伙的，用 【were】 不用 was。"
      },
      {
        tokenIndex: 19,
        tag: "sv_agreement",
        original: "like",
        correction: "likes",
        explanation: "第 25 课回流：「她喜欢」要加 -s——She 【likes】 music。这是英语里最顽固的小尾巴，别丢了。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十三批 · L144 收官案件（规格：prd-grammar-as-soon-as-2026-09-20.md §11；全回流、不新增错型——三点锚本批 #151/#152，一点锚旧课 L10）──
    id: "hunt-close-23",
    number: 153,
    title: "本子最后一页",
    scene: "本子翻到最后一页，六行排好了，最后一行写错了",
    tokens: [
      "As", "soon", "as", "I", "will", "finish,", "I", "will", "eat.",
      "As", "soon", "I", "finish,", "I", "will", "eat.",
      "When", "I", "finish,", "I", "eat.",
      "Yesterday", "I", "go", "home", "late."
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "verb_form",
        original: "will",
        correction: "去掉 will",
        explanation: "第 142 课回流：前面那件说现在，不请 will——As soon as I 【finish】。第 48 课那条规矩，as soon as 也照办。"
      },
      {
        tokenIndex: 10,
        tag: "word_order",
        original: "soon",
        correction: "as soon as",
        explanation: "第 142 课回流：两头都要卡住——As 【soon as】 I finish，两个 as 缺一不可。"
      },
      {
        tokenIndex: 20,
        tag: "tense",
        original: "eat.",
        correction: "will eat.",
        explanation: "第 143 课回流：后面那件还没发生，要带上 will——When I finish, I 【will eat】。"
      },
      {
        tokenIndex: 23,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "第 10 课回流：说昨天的事要换昨天版——go → 【went】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十四批 · L145 案件（规格：prd-grammar-too-either-2026-09-20.md §11；新错 word_order too 站错位置，旧错回流 L25＋L11＋L10）──
    id: "hunt-like-tea-too",
    number: 154,
    title: "桌上的两杯",
    scene: "晚饭后，桌上还剩着一杯茶和一杯咖啡",
    tokens: [
      "I", "too", "like", "tea.",
      "My", "brother", "like", "apples.",
      "I", "have", "two", "sister.",
      "Last", "week", "I", "go", "to", "the", "library."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "word_order",
        original: "too",
        correction: "去掉（too 放到 tea 后面）",
        explanation: "中文的「也」在中间（我也喜欢），英语的 too 要走到句子尾巴上——I like tea【 too】。"
      },
      {
        tokenIndex: 6,
        tag: "sv_agreement",
        original: "like",
        correction: "likes",
        explanation: "第 25 课回流：My brother 是「他」一个，后面的动词要加 -s——My brother 【likes】 apples。"
      },
      {
        tokenIndex: 11,
        tag: "plural",
        original: "sister.",
        correction: "sisters.",
        explanation: "第 11 课回流：two 后面要加 -s——two 【sisters】。"
      },
      {
        tokenIndex: 15,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "第 10 课回流：Last week 是过去的事，要换昨天版——go → 【went】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十四批 · L146 案件（规格：prd-grammar-too-either-2026-09-20.md §11；新错 word_order 否定句尾没换词，旧错回流 L25＋L11＋L19）──
    id: "hunt-not-coffee-either",
    number: 155,
    title: "弟弟的杯子",
    scene: "弟弟把咖啡杯推到一边，皱着鼻子摇头",
    tokens: [
      "I", "don't", "like", "coffee", "too.",
      "She", "don't", "like", "tea.",
      "There", "are", "two", "table", "at", "home.",
      "My", "sister", "and", "I", "was", "tired."
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "word_order",
        original: "too.",
        correction: "either.",
        explanation: "前面有了「不」，句尾就要换人：too 让位、either 上——I don't like coffee【 either】。中文的「也」不分肯定否定，英语要分。"
      },
      {
        tokenIndex: 6,
        tag: "sv_agreement",
        original: "don't",
        correction: "doesn't",
        explanation: "第 25 课回流：She 是「她」一个，帮手要用 doesn't——She 【doesn't】 like tea。"
      },
      {
        tokenIndex: 12,
        tag: "plural",
        original: "table",
        correction: "tables",
        explanation: "第 11 课回流：two 后面要加 -s——two 【tables】。"
      },
      {
        tokenIndex: 19,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation: "第 19 课回流：My sister and I 是两个人，算一伙的，用 【were】 不用 was。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十四批 · L147 收官案件（规格：prd-grammar-too-either-2026-09-20.md §11；全回流、不新增错型——两点锚本批 #154/#155，两点锚旧课 L25/L10）──
    id: "hunt-close-24",
    number: 156,
    title: "本子上的两行",
    scene: "本子最后一页，两句话并排写着，中间画了个点",
    tokens: [
      "I", "too", "like", "tea.",
      "I", "don't", "like", "coffee", "too.",
      "My", "brother", "drink", "milk.",
      "Yesterday", "I", "go", "to", "school", "late."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "word_order",
        original: "too",
        correction: "去掉（too 放到 tea 后面）",
        explanation: "第 145 课回流：「也」要站句子尾巴上——I like tea【 too】，不站中间。"
      },
      {
        tokenIndex: 8,
        tag: "word_order",
        original: "too.",
        correction: "either.",
        explanation: "第 146 课回流：前面有「不」，句尾要换成 either——I don't like coffee【 either】。"
      },
      {
        tokenIndex: 11,
        tag: "sv_agreement",
        original: "drink",
        correction: "drinks",
        explanation: "第 25 课回流：My brother 是「他」一个，动词要加 -s——My brother 【drinks】 milk。"
      },
      {
        tokenIndex: 15,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "第 10 课回流：Yesterday 是过去的事，要换昨天版——go → 【went】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十五批 · L148 案件（规格：prd-grammar-both-neither-2026-09-20.md §2；新错 word_order both 夹在中间 + plural 名字没带 s，旧错回流 L25＋L10）──
    id: "hunt-both-books",
    number: 157,
    title: "书桌上的两本",
    scene: "小美房间的书桌，两本书并排摊着",
    tokens: [
      "Books", "both", "are", "good.",
      "Both", "book", "is", "good.",
      "My", "brother", "like", "books.",
      "Yesterday", "I", "go", "to", "the", "library."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "word_order",
        original: "both",
        correction: "去掉（both 放到 Books 前面）",
        explanation: "中文说「两本书都很好」，「都」夹在中间；英语的 both 要走到最前面——【Both】 books are good。"
      },
      {
        tokenIndex: 5,
        tag: "plural",
        original: "book",
        correction: "books",
        explanation: "第 11 课回流：两个以上，后面那个东西要带上 s——Both 【books】。"
      },
      {
        tokenIndex: 10,
        tag: "sv_agreement",
        original: "like",
        correction: "likes",
        explanation: "第 25 课回流：My brother 是「他」一个，后面的动词要加 -s——My brother 【likes】 books。"
      },
      {
        tokenIndex: 14,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "第 10 课回流：Yesterday 是过去的事，要换昨天版——go → 【went】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十五批 · L149 案件（规格：prd-grammar-both-neither-2026-09-20.md §2；新错 word_order 有「不」没换词 + plural neither 后没去 s，旧错回流 L19＋L11）──
    id: "hunt-neither-book",
    number: 158,
    title: "两本都不满意",
    scene: "还是那张书桌，两本书被合上推到一边",
    tokens: [
      "Both", "books", "are", "not", "good.",
      "Neither", "books", "are", "good.",
      "The", "books", "was", "good.",
      "I", "have", "two", "apple."
    ],
    errors: [
      {
        tokenIndex: 0,
        tag: "word_order",
        original: "Both",
        correction: "Neither",
        explanation: "有「不」的时候，最前面那个词整个换人：Both 让位、Neither 上——【Neither】 book is good（后面也只见一个）。"
      },
      {
        tokenIndex: 6,
        tag: "plural",
        original: "books",
        correction: "book",
        explanation: "neither 后面只说一个——Neither 【book】，不带 s，搭档也用 is。"
      },
      {
        tokenIndex: 11,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation: "第 19 课回流：The books 是好几本，算一伙的，用 【were】 不用 was。"
      },
      {
        tokenIndex: 16,
        tag: "plural",
        original: "apple.",
        correction: "apples.",
        explanation: "第 11 课回流：two 后面要加 -s——two 【apples】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十五批 · L150 收官案件（规格：prd-grammar-both-neither-2026-09-20.md §2；全回流、不新增错型——三点锚本批 #157/#158，一点锚旧课 L10）──
    id: "hunt-close-25",
    number: 159,
    title: "本子上的两行",
    scene: "本子最后一页，两行并排写着，中间画了个点",
    tokens: [
      "Both", "book", "is", "good.",
      "Neither", "books", "are", "good.",
      "Books", "both", "are", "good.",
      "Last", "week", "I", "go", "home."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "plural",
        original: "book",
        correction: "books",
        explanation: "第 148 课回流：两个以上，名字要带上 s——Both 【books】。"
      },
      {
        tokenIndex: 5,
        tag: "plural",
        original: "books",
        correction: "book",
        explanation: "第 149 课回流：neither 后面只说一个——Neither 【book】。"
      },
      {
        tokenIndex: 9,
        tag: "word_order",
        original: "both",
        correction: "去掉（both 放到 Books 前面）",
        explanation: "第 148 课回流：「都」要走到最前面，不夹在中间——【Both】 books are good。"
      },
      {
        tokenIndex: 15,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "第 10 课回流：Last week 是过去的事，要换昨天版——go → 【went】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十六批 · L151 案件（规格：prd-grammar-all-every-2026-09-20.md §2；新错 plural 没带 s + word_order 多插 of，旧错回流 L7＋L11）──
    id: "hunt-all-the-books",
    number: 160,
    title: "书桌上的一摞",
    scene: "小美的书桌上，四本书摊成一排",
    tokens: [
      "All", "student", "is", "here.",
      "All", "of", "books", "are", "good.",
      "All", "the", "books", "is", "good.",
      "We", "have", "two", "pen."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "plural",
        original: "student",
        correction: "students",
        explanation: "第 11 课回流：「一个不落」说的是一群，后面那个东西要带上 s——All 【students】。"
      },
      {
        tokenIndex: 5,
        tag: "word_order",
        original: "of",
        correction: "去掉 of",
        explanation: "中文说「所有的书」直接连着说，英语的 all 后面也直接接——中间不加 of：All 【the】 books。"
      },
      {
        tokenIndex: 12,
        tag: "sv_agreement",
        original: "is",
        correction: "are",
        explanation: "第 7 课回流：好几样东西一起出场，搭档要用 are——All the books 【are】 good。"
      },
      {
        tokenIndex: 17,
        tag: "plural",
        original: "pen.",
        correction: "pens.",
        explanation: "第 11 课回流：two 后面要加 -s——two 【pens】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十六批 · L152 案件（规格：prd-grammar-all-every-2026-09-20.md §2；新错 plural every 后带了 s + fragment every 单站，旧错回流 L25＋L10）──
    id: "hunt-every-student",
    number: 161,
    title: "名册上的名字",
    scene: "早读课前，讲台边摊着一本名册",
    tokens: [
      "Every", "students", "are", "here.",
      "Every", "are", "here.",
      "My", "sister", "like", "music.",
      "Last", "night", "I", "watch", "TV."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "plural",
        original: "students",
        correction: "student",
        explanation: "every 后面只说一个——Every 【student】 is here，不加 s、搭档也用 is。"
      },
      {
        tokenIndex: 4,
        tag: "fragment",
        original: "Every",
        correction: "Every student",
        explanation: "every 后面必须跟着那个东西，不能自己单站——Every 【student】 are here 说不过去。"
      },
      {
        tokenIndex: 9,
        tag: "sv_agreement",
        original: "like",
        correction: "likes",
        explanation: "第 25 课回流：My sister 是「她」一个，后面的动词要加 -s——My sister 【likes】 music。"
      },
      {
        tokenIndex: 14,
        tag: "tense",
        original: "watch",
        correction: "watched",
        explanation: "第 10 课回流：Last night 是过去的事，要换昨天版——watch → 【watched】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十七批 · L153 案件（规格：prd-grammar-yet-already-2026-09-20.md §7；新错 word_order yet/already 站错位，旧错回流 L21＋L10）──
    id: "hunt-yet-already",
    number: 162,
    title: "门口的两行字",
    scene: "厨房门边贴着一张字条，桌边摆好了两副碗筷",
    tokens: [
      "She", "hasn't", "come", "already.",
      "She", "hasn't", "yet", "come.",
      "I", "have", "do", "my", "homework.",
      "Yesterday", "we", "go", "out."
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "word_order",
        original: "already.",
        correction: "yet.",
        explanation: "「还没」要用 yet，而且站最末尾——She hasn't come【 yet】。already 是「已经」，两个词分工不同。"
      },
      {
        tokenIndex: 6,
        tag: "word_order",
        original: "yet",
        correction: "去掉（yet 放到 come 后面）",
        explanation: "yet 站句子最末尾，不插在中间——中文的「还」在中间，英语这个要走到最后。"
      },
      {
        tokenIndex: 10,
        tag: "verb_form",
        original: "do",
        correction: "done",
        explanation: "第 21 课回流：have 后面要用「做过版」——have 【done】 my homework。"
      },
      {
        tokenIndex: 15,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "第 10 课回流：Yesterday 是过去的事，要换昨天版——go → 【went】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十七批 · L154 案件（规格：prd-grammar-yet-already-2026-09-20.md §7；新错 word_order still 站错位，旧错回流 L7＋L25＋L10）──
    id: "hunt-still-waiting",
    number: 163,
    title: "校门口的那个人",
    scene: "放学后的校门口，别的班都走光了",
    tokens: [
      "She", "still", "is", "waiting.",
      "They", "is", "at", "home.",
      "He", "like", "tea.",
      "I", "see", "her", "yesterday."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "word_order",
        original: "still",
        correction: "去掉（still 放到 is 后面）",
        explanation: "still 站在中间、紧挨着 is——She is【 still】 waiting。中文的「还」在「在」前面，英语这个要挤到 is 后面。"
      },
      {
        tokenIndex: 5,
        tag: "sv_agreement",
        original: "is",
        correction: "are",
        explanation: "第 7 课回流：They 是一伙人，算好几个，搭档要用 are——They 【are】 at home。"
      },
      {
        tokenIndex: 9,
        tag: "sv_agreement",
        original: "like",
        correction: "likes",
        explanation: "第 25 课回流：He 是「他」一个，后面的动词要加 -s——He 【likes】 tea。"
      },
      {
        tokenIndex: 12,
        tag: "tense",
        original: "see",
        correction: "saw",
        explanation: "第 10 课回流：yesterday 是过去的事，要换昨天版——see → 【saw】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十八批 · L155 案件（规格：prd-grammar-ago-for-2026-09-20.md §7；新错 verb_form 前面多请了 have + word_order ago 站错位，旧错回流 L10＋L7）──
    id: "hunt-three-days-ago",
    number: 164,
    title: "站台上的告示纸",
    scene: "火车站台上，告示纸被风吹得直响",
    tokens: [
      "She", "has", "left", "three", "days", "ago.",
      "She", "left", "ago", "three", "days.",
      "I", "watch", "TV", "yesterday.",
      "We", "is", "happy."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "verb_form",
        original: "has",
        correction: "去掉 has",
        explanation: "「…以前」说的是过去某一个点，那句话穿昨天版就够——She 【left】 three days ago，前面不加 have。"
      },
      {
        tokenIndex: 8,
        tag: "word_order",
        original: "ago",
        correction: "去掉（ago 放到 days 后面）",
        explanation: "ago 要跟在那块时间后面，站最末尾——three days【 ago】。中文整块往前放，英语这块要走到最后。"
      },
      {
        tokenIndex: 12,
        tag: "tense",
        original: "watch",
        correction: "watched",
        explanation: "第 10 课回流：yesterday 是过去的事，要换昨天版——watch → 【watched】。"
      },
      {
        tokenIndex: 16,
        tag: "sv_agreement",
        original: "is",
        correction: "are",
        explanation: "第 7 课回流：We 是一伙人，算好几个，搭档要用 are——We 【are】 happy。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十八批 · L156 案件（规格：prd-grammar-ago-for-2026-09-20.md §7；新错 word_order for 站错位，旧错回流 L10＋L25＋L11）──
    id: "hunt-waited-an-hour",
    number: 165,
    title: "长椅上的一个小时",
    scene: "放学后的校门口，长椅上放着一个书包",
    tokens: [
      "I", "waited", "an", "hour", "for.",
      "I", "wait", "for", "an", "hour.",
      "He", "don't", "know.",
      "She", "have", "two", "book."
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "word_order",
        original: "for.",
        correction: "去掉（for 放到 an 前面）",
        explanation: "for 要接在那块时间前面，不站句尾——I waited【 for】 an hour。上一课的 ago 站句尾，这个 for 站前面。"
      },
      {
        tokenIndex: 6,
        tag: "tense",
        original: "wait",
        correction: "waited",
        explanation: "第 10 课回流：说的是已经等过了，动词要换昨天版——wait → 【waited】。"
      },
      {
        tokenIndex: 11,
        tag: "sv_agreement",
        original: "don't",
        correction: "doesn't",
        explanation: "第 25 课回流：He 是「他」一个，帮手要用 doesn't——He 【doesn't】 know。"
      },
      {
        tokenIndex: 16,
        tag: "plural",
        original: "book.",
        correction: "books.",
        explanation: "第 11 课回流：two 后面要加 -s——two 【books】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十九批 · L157 案件（规格：prd-grammar-none-nobody-2026-09-20.md §7；新错 word_order none 缺 of + 多请 not，旧错回流 L10＋L7）──
    id: "hunt-none-of-the-cups",
    number: 166,
    title: "失物招领处的一排杯子",
    scene: "失物招领处的桌上，一排杯子摆得整整齐齐",
    tokens: [
      "None", "cups", "are", "mine.",
      "None", "of", "the", "cups", "are", "not", "mine.",
      "I", "watch", "TV", "last", "night.",
      "The", "students", "is", "here."
    ],
    errors: [
      {
        tokenIndex: 0,
        tag: "word_order",
        original: "None",
        correction: "None of",
        explanation: "none 不能直接贴东西，中间要拴一个 of——None 【of】 the cups are mine。"
      },
      {
        tokenIndex: 9,
        tag: "word_order",
        original: "not",
        correction: "去掉 not",
        explanation: "none 自己已经带着「不」了，后面不要再补一个——两个「不」撞一起，意思要翻。第 84 课 nothing 也是这个规矩。"
      },
      {
        tokenIndex: 12,
        tag: "tense",
        original: "watch",
        correction: "watched",
        explanation: "第 10 课回流：last night 是过去的事，要换昨天版——watch → 【watched】。"
      },
      {
        tokenIndex: 18,
        tag: "sv_agreement",
        original: "is",
        correction: "are",
        explanation: "第 7 课回流：The students 是好几号人，算一伙的，搭档要用 are——The students 【are】 here。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第二十九批 · L158 案件（规格：prd-grammar-none-nobody-2026-09-20.md §7；新错 sv_agreement nobody 配 are + 多请 not，旧错回流 L11＋L25）──
    id: "hunt-nobody-at-home",
    number: 167,
    title: "门口的那通电话",
    scene: "傍晚的楼道口，小美站在家门口打电话",
    tokens: [
      "Nobody", "are", "at", "home.",
      "Nobody", "is", "not", "at", "home.",
      "She", "has", "two", "pen.",
      "He", "want", "a", "book."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "sv_agreement",
        original: "are",
        correction: "is",
        explanation: "nobody 说的是「一个人」——一个人配 is，不配 are：Nobody 【is】 at home。"
      },
      {
        tokenIndex: 6,
        tag: "word_order",
        original: "not",
        correction: "去掉 not",
        explanation: "nobody 自己已经带着「不」了，后面不要再补一个——两个「不」撞一起，意思要翻。第 84 课 nothing 也是这个规矩。"
      },
      {
        tokenIndex: 12,
        tag: "plural",
        original: "pen.",
        correction: "pens.",
        explanation: "第 11 课回流：two 后面要加 -s——two 【pens】。"
      },
      {
        tokenIndex: 14,
        tag: "sv_agreement",
        original: "want",
        correction: "wants",
        explanation: "第 25 课回流：He 是「他」一个，后面的动词要加 -s——He 【wants】 a book。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第三十批 · L159 案件（规格：prd-grammar-look-like-seem-2026-09-20.md §7；新错 article like 后丢 a + word_order 丢了 like，旧错回流 L25＋L10）──
    id: "hunt-looks-like-boat",
    number: 168,
    title: "防波堤上的那朵云",
    scene: "海边的防波堤上，两个人抬头看云",
    tokens: [
      "It", "looks", "like", "boat.",
      "It", "looks", "a", "cat.",
      "She", "want", "a", "book.",
      "We", "go", "out", "yesterday."
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "article",
        original: "boat.",
        correction: "a boat.",
        explanation: "一条船要说 a boat——那个 a 不能丢。like 后面跟的是一个「什么东西」，前面要报数。"
      },
      {
        tokenIndex: 5,
        tag: "word_order",
        original: "looks",
        correction: "looks like",
        explanation: "说「像什么」中间要请 like 出场——It looks 【like】 a cat。少了 like 就成了「它看着一只猫」，说不通。"
      },
      {
        tokenIndex: 9,
        tag: "sv_agreement",
        original: "want",
        correction: "wants",
        explanation: "第 25 课回流：She 是「她」一个，后面的动词要加 -s——She 【wants】 a book。"
      },
      {
        tokenIndex: 13,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "第 10 课回流：yesterday 是过去的事，要换昨天版——go → 【went】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第三十批 · L160 案件（规格：prd-grammar-look-like-seem-2026-09-20.md §7；新错 word_order seem 后丢 to + verb_form to 后换了形状，旧错回流 L11＋L7）──
    id: "hunt-seems-to-know",
    number: 169,
    title: "灯塔下的一眼",
    scene: "灯塔下的石阶，等摆渡船的人朝这边招了招手",
    tokens: [
      "He", "seems", "know", "you.",
      "He", "seems", "to", "knows", "you.",
      "I", "have", "two", "bag.",
      "They", "is", "happy."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "word_order",
        original: "seems",
        correction: "seems to",
        explanation: "seem 后面要请 to 垫一下——He seems 【to】 know you。少了 to 连不上（第 15 课的老规矩）。"
      },
      {
        tokenIndex: 7,
        tag: "verb_form",
        original: "knows",
        correction: "know",
        explanation: "to 后面那个动作穿原样——to 【know】 you，不换形状。一场戏只让一个词换形状，seems 已经换过了。"
      },
      {
        tokenIndex: 12,
        tag: "plural",
        original: "bag.",
        correction: "bags.",
        explanation: "第 11 课回流：two 后面要加 -s——two 【bags】。"
      },
      {
        tokenIndex: 14,
        tag: "sv_agreement",
        original: "is",
        correction: "are",
        explanation: "第 7 课回流：They 是一伙人，算好几个，搭档要用 are——They 【are】 happy。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第三十一批 · L161 案件（规格：prd-grammar-need-most-2026-09-20.md §7；新错 word_order need 丢了 to + verb_form to 后换形状，旧错回流 L25＋L10）──
    id: "hunt-need-to-buy",
    number: 170,
    title: "小本子上的采购单",
    scene: "小卖部门口，小美掏出小本子记了一笔",
    tokens: [
      "I", "need", "buy", "milk.",
      "I", "need", "to", "buys", "milk.",
      "She", "read", "book.",
      "They", "watch", "TV", "yesterday."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "word_order",
        original: "need",
        correction: "need to",
        explanation: "need 后面要请 to 垫一下——I need 【to】 buy some milk。少了 to 连不上（第 15 课的老规矩）。"
      },
      {
        tokenIndex: 7,
        tag: "verb_form",
        original: "buys",
        correction: "buy",
        explanation: "to 后面那个动作穿原样——to 【buy】，不换形状。一场戏只让一个词换形状。"
      },
      {
        tokenIndex: 10,
        tag: "sv_agreement",
        original: "read",
        correction: "reads",
        explanation: "第 25 课回流：She 是「她」一个，后面的动词要加 -s——She 【reads】 a book。"
      },
      {
        tokenIndex: 13,
        tag: "tense",
        original: "watch",
        correction: "watched",
        explanation: "第 10 课回流：yesterday 是过去的事，要换昨天版——watch → 【watched】。"
      }
    ],
    reviewed: true,
  },
  {
    // ── 第三十一批 · L162 案件（规格：prd-grammar-need-most-2026-09-20.md §7；新错 word_order most 缺 of + sv_agreement 一群人配了单数，旧错回流 L11＋L7）──
    id: "hunt-most-of-students",
    number: 171,
    title: "黑板角落的票数",
    scene: "课间，投票纸摊在讲台上，黑板上写着一个数",
    tokens: [
      "Most", "students", "like", "it.",
      "Most", "of", "the", "students", "likes", "it.",
      "We", "need", "two", "chair.",
      "We", "is", "at", "school."
    ],
    errors: [
      {
        tokenIndex: 0,
        tag: "word_order",
        original: "Most",
        correction: "Most of",
        explanation: "most 后面要拴一个 of——Most 【of】 the students like it。少了它，那个「大多数」就没说清是哪一群里的。"
      },
      {
        tokenIndex: 8,
        tag: "sv_agreement",
        original: "likes",
        correction: "like",
        explanation: "「大多数学生」是一群人，动词穿原样——Most of the students 【like】 it。带 s 的那件是给「他／她一个」穿的。"
      },
      {
        tokenIndex: 13,
        tag: "plural",
        original: "chair.",
        correction: "chairs.",
        explanation: "第 11 课回流：two 后面要加 -s——two 【chairs】。"
      },
      {
        tokenIndex: 15,
        tag: "sv_agreement",
        original: "is",
        correction: "are",
        explanation: "第 7 课回流：We 是一伙人，算好几个，搭档要用 are——We 【are】 at school。"
      }
    ],
    reviewed: true,
  },
  {
    id: "hunt-myself-cake",
    number: 172,
    title: "厨房里的蛋糕",
    scene: "厨房料理台上摊着一本手写的食谱",
    tokens: [
      "I",
      "made",
      "this",
      "cake",
      "me.",
      "I",
      "cleaned",
      "my",
      "room",
      "myself.",
      "She",
      "can",
      "helps",
      "you."
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "word_order",
        original: "me.",
        correction: "myself.",
        explanation: "说「我自己做」要用 myself，不是 me——I made this cake 【myself】。me 是「我（被做了什么的那个）」，myself 才是「我本人」。"
      },
      {
        tokenIndex: 12,
        tag: "verb_form",
        original: "helps",
        correction: "help",
        explanation: "第 14 课回流：can 后面跟原样，不能带 s——She can 【help】 you。带 s 的那件是给「他／她做事」穿的，can 后面用不上。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-herself-homework",
    number: 173,
    title: "晚自习的灯",
    scene: "教室里只剩两盏灯还亮着",
    tokens: [
      "She",
      "can",
      "do",
      "it",
      "himself.",
      "He",
      "cleaned",
      "his",
      "room",
      "herself.",
      "We",
      "are",
      "classmate."
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "word_order",
        original: "himself.",
        correction: "herself.",
        explanation: "「她」要配 herself——前面那半截跟着人走：her + self。himself 是给「他」用的。"
      },
      {
        tokenIndex: 9,
        tag: "word_order",
        original: "herself.",
        correction: "himself.",
        explanation: "「他」要配 himself——He cleaned his room 【himself】。herself 是给「她」用的。"
      },
      {
        tokenIndex: 12,
        tag: "plural",
        original: "classmate.",
        correction: "classmates.",
        explanation: "第 7 课回流：We 后面跟的那群人带 -s——We are 【classmates】。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-each-other-clean",
    number: 174,
    title: "大扫除的抹布",
    scene: "教室后墙的水桶边放着两块拧干的抹布",
    tokens: ["We", "help", "each", "others.", "They", "know", "other.", "We", "are", "friend."],
    errors: [
      {
        tokenIndex: 3,
        tag: "plural",
        original: "others.",
        correction: "other.",
        explanation: "each other 后面不加 s——它本来就说「互相」，不用再带尾巴。"
      },
      {
        tokenIndex: 6,
        tag: "fragment",
        original: "other.",
        correction: "each other.",
        explanation: "「互相」要两个词一起出场：each other——They know 【each】【other】。少了 each，意思全歪。"
      },
      {
        tokenIndex: 9,
        tag: "plural",
        original: "friend.",
        correction: "friends.",
        explanation: "第 7 课回流：We 是一群人，后面那个东西要带 -s——We are 【friends】。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-too-many-people",
    number: 175,
    title: "公交站的长队",
    scene: "站牌下的人排到了花坛边",
    tokens: [
      "There",
      "are",
      "too",
      "much",
      "people.",
      "There",
      "is",
      "too",
      "many",
      "water.",
      "We",
      "are",
      "classmate."
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "article",
        original: "much",
        correction: "many",
        explanation: "「人」能一个一个数出来，用 many——too 【many】 people。much 是给数不出来的东西用的。"
      },
      {
        tokenIndex: 8,
        tag: "article",
        original: "many",
        correction: "much",
        explanation: "水数不出来，用 much——too 【much】 water。数得出来的（人、书）才用 many。"
      },
      {
        tokenIndex: 12,
        tag: "plural",
        original: "classmate.",
        correction: "classmates.",
        explanation: "第 7 课回流：We 是一群人，后面带 -s——We are 【classmates】。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-a-lot-of-friends",
    number: 176,
    title: "走廊那头的一群人",
    scene: "午休的走廊上传来一阵笑闹声",
    tokens: [
      "I",
      "have",
      "a",
      "lot",
      "friends.",
      "She",
      "have",
      "a",
      "lot",
      "of",
      "books.",
      "They",
      "is",
      "here."
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "fragment",
        original: "friends.",
        correction: "of friends.",
        explanation: "a lot of 三个词一起出场——a lot 【of】 friends。少了 of，「很多」就接不上后面的东西。"
      },
      {
        tokenIndex: 6,
        tag: "sv_agreement",
        original: "have",
        correction: "has",
        explanation: "第 25 课回流：She 是一个人，动词要带 -s——She 【has】 a lot of books。"
      },
      {
        tokenIndex: 12,
        tag: "sv_agreement",
        original: "is",
        correction: "are",
        explanation: "第 7 课回流：They 是一伙人，搭档用 are——They 【are】 here。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-why-dont-you-rest",
    number: 177,
    title: "自习课的哈欠",
    scene: "课桌上摊着写了一半的练习册",
    tokens: [
      "Why",
      "don't",
      "you",
      "to",
      "take",
      "a",
      "rest?",
      "Why",
      "you",
      "don't",
      "rest?",
      "She",
      "can",
      "swim"
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "verb_form",
        original: "to",
        correction: "（去掉 to）",
        explanation: "后面那个动作穿原样，去掉 to——Why don't you 【take】 a rest。"
      },
      {
        tokenIndex: 8,
        tag: "word_order",
        original: "you",
        correction: "（与 don't 对调）",
        explanation: "don't 要跟 Why 挨着——Why 【don't you】 rest。don't 和 you 得对调过来。"
      },
      {
        tokenIndex: 13,
        tag: "fragment",
        original: "swim",
        correction: "swim.",
        explanation: "句尾少了句号——一个句子说完要有个收尾的记号。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-id-like-tea",
    number: 178,
    title: "茶铺的玻璃罐",
    scene: "柜台后面一排玻璃罐里装着不同的茶叶",
    tokens: ["Id", "like", "a", "cup", "of", "tea.", "I'd", "like", "to", "a", "cup", "of", "coffee."],
    errors: [
      {
        tokenIndex: 0,
        tag: "fragment",
        original: "Id",
        correction: "I'd",
        explanation: "缩写要带上那个小撇号——I【'd】 like。少了它，就成了一个不认识的词。"
      },
      {
        tokenIndex: 8,
        tag: "verb_form",
        original: "to",
        correction: "（去掉 to）",
        explanation: "后面跟东西时不垫 to——I'd like 【a cup of coffee】。要跟动作才垫 to（I'd like to go home）。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-both-and-sing",
    number: 179,
    title: "报名表上的两栏",
    scene: "公告栏前围了几个看演出报名表的人",
    tokens: [
      "She",
      "can",
      "both",
      "sing",
      "or",
      "dance.",
      "She",
      "can",
      "both",
      "sing",
      "and",
      "dance",
      "both.",
      "We",
      "are",
      "classmate."
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "word_order",
        original: "or",
        correction: "and",
        explanation: "「既…又…」两样都要，接的是 and——both sing 【and】 dance。or 是挑一个。"
      },
      {
        tokenIndex: 12,
        tag: "fragment",
        original: "both.",
        correction: "（去掉句尾的 both）",
        explanation: "both 只站第一样前面——句尾那个 both 是多余的，去掉它。"
      },
      {
        tokenIndex: 15,
        tag: "plural",
        original: "classmate.",
        correction: "classmates.",
        explanation: "第 7 课回流：We 是一群人，后面那个东西要带 -s——We are 【classmates】。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-neither-nor-food",
    number: 180,
    title: "食堂新窗口",
    scene: "新窗口前排着队，锅里的热气往上冒",
    tokens: [
      "I",
      "like",
      "neither",
      "spicy",
      "food",
      "or",
      "noodles.",
      "I",
      "don't",
      "like",
      "neither",
      "coffee",
      "nor",
      "tea."
    ],
    errors: [
      {
        tokenIndex: 5,
        tag: "word_order",
        original: "or",
        correction: "nor",
        explanation: "前面是 neither，后面就要用 nor——neither …【nor】。两个词是一对。"
      },
      {
        tokenIndex: 8,
        tag: "fragment",
        original: "don't",
        correction: "（去掉 don't）",
        explanation: "neither 自己就含「不」——这个 don't 是多余的，去掉它，否则成了「不…也不」。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-unless-rain",
    number: 181,
    title: "周末的爬山计划",
    scene: "手机群里弹出天气预报的截图",
    tokens: ["We", "will", "go", "unless", "it", "will", "rain.", "I", "won't", "go", "unless", "you", "goes."],
    errors: [
      {
        tokenIndex: 5,
        tag: "tense",
        original: "will",
        correction: "（去掉 will）",
        explanation: "unless 后面那小句用现在时——去掉 will：unless it 【rains】。第 48 课的老规矩。"
      },
      {
        tokenIndex: 12,
        tag: "sv_agreement",
        original: "goes.",
        correction: "go.",
        explanation: "第 25 课回流：you 的搭档穿原样——unless you 【go】。带 s 的那件是给「他／她」穿的，you 用不上。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-in-order-to-bus",
    number: 182,
    title: "天没亮的站台",
    scene: "站台的长椅上放着一个保温杯",
    tokens: [
      "I",
      "got",
      "up",
      "early",
      "in",
      "order",
      "catching",
      "the",
      "bus.",
      "He",
      "studies",
      "hard",
      "in",
      "order",
      "to",
      "pass",
      "the",
      "test"
    ],
    errors: [
      {
        tokenIndex: 6,
        tag: "verb_form",
        original: "catching",
        correction: "catch",
        explanation: "in order to 后面那个动作穿原样——in order to 【catch】。和第 44 课那块小垫板一个规矩。"
      },
      {
        tokenIndex: 17,
        tag: "fragment",
        original: "test",
        correction: "test.",
        explanation: "句尾少了句号——一个句子说完要有个收尾的记号。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-able-to-go",
    number: 183,
    title: "地铁口的告别",
    scene: "地铁口的闸机不停地开合",
    tokens: [
      "I",
      "am",
      "able",
      "to",
      "going",
      "there",
      "myself",
      "now.",
      "I",
      "able",
      "to",
      "go",
      "there",
      "alone."
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "verb_form",
        original: "going",
        correction: "go",
        explanation: "be able to 后面穿原样——able to 【go】。和第 44 课那块小垫板同一个规矩。"
      },
      {
        tokenIndex: 9,
        tag: "missing_be",
        original: "able",
        correction: "am able",
        explanation: "able 是个形容类的词，前面得站个 be 才站得住——I 【am】 able to。第 1 课的老规矩。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-so-do-i",
    number: 184,
    title: "聊电影的课间",
    scene: "课桌上摊着一本翻到中间的漫画",
    tokens: ["So", "I", "do.", "So", "do", "me.", "She", "can", "both", "sing", "and", "dance", "herself."],
    errors: [
      {
        tokenIndex: 0,
        tag: "word_order",
        original: "So",
        correction: "（So 与 do I 对调）",
        explanation: "这个说法的顺序是倒的——要写成 So 【do I】。帮手先站前面，我（I）跟后面。"
      },
      {
        tokenIndex: 5,
        tag: "fragment",
        original: "me.",
        correction: "I.",
        explanation: "后面站的是 I，不是 me——So do 【I】。这一句里「我」是做事的那个。"
      },
      {
        tokenIndex: 11,
        tag: "word_order",
        original: "dance",
        correction: "dance.",
        explanation: "这句没问题——both sing and dance 形状对称（两个都穿原样）。这里的陷阱是要分清 two 的搭档是不是对称。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-would-rather-walk",
    number: 185,
    title: "堵成一条龙的路口",
    scene: "红绿灯下排着一长串车",
    tokens: [
      "I",
      "would",
      "rather",
      "to",
      "walk.",
      "I",
      "rather",
      "would",
      "walk.",
      "She",
      "would",
      "rather",
      "stay",
      "at",
      "home"
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "verb_form",
        original: "to",
        correction: "（去掉 to）",
        explanation: "would rather 后面那个动作穿原样，去掉 to——I would rather 【walk】。垫 to 的是 would like。"
      },
      {
        tokenIndex: 6,
        tag: "word_order",
        original: "rather",
        correction: "（rather 跟在 would 后）",
        explanation: "rather 站在 would 后面——I 【would】【rather】 walk。两个词的顺序是固定的。"
      },
      {
        tokenIndex: 14,
        tag: "fragment",
        original: "home",
        correction: "home.",
        explanation: "句尾少了句号——一个句子说完要有个收尾的记号。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-prefer-tea",
    number: 186,
    title: "茶铺里的两个罐子",
    scene: "柜台上并排放着咖啡罐和茶叶罐",
    tokens: [
      "I",
      "prefer",
      "tea",
      "than",
      "coffee.",
      "I",
      "prefer",
      "drink",
      "tea.",
      "She",
      "prefers",
      "walking",
      "to",
      "running."
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "word_order",
        original: "than",
        correction: "to",
        explanation: "prefer 后面那半截用 to 领——prefer tea 【to】 coffee。than 是第 17 课比较大小用的。"
      },
      {
        tokenIndex: 7,
        tag: "verb_form",
        original: "drink",
        correction: "（drink → drinking 或去掉）",
        explanation: "prefer 后面可以直接跟东西（prefer tea）；要跟动作就穿 -ing，去掉这个原样写法（prefer drinking）。光用原样两样都不像。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-had-lost-key",
    number: 187,
    title: "门口的电话",
    scene: "家门口的地上放着一个塞满东西的书包",
    tokens: [
      "I",
      "had",
      "lose",
      "my",
      "key",
      "before",
      "I",
      "got",
      "home.",
      "I",
      "have",
      "lost",
      "my",
      "key",
      "before",
      "I",
      "got",
      "home."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "verb_form",
        original: "lose",
        correction: "lost",
        explanation: "had 后面要跟做过版——had 【lost】。第 21 课那个 have + 做过版是同一条规矩。"
      },
      {
        tokenIndex: 10,
        tag: "tense",
        original: "have",
        correction: "had",
        explanation: "两件都是过去的事，更早那件要用 had——have 是在说「到现在为止」（第 23 课那种）。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-shall-we-quiet",
    number: 188,
    title: "岔路口的两条路",
    scene: "小路口的指示牌被雨打得发亮",
    tokens: [
      "Shall",
      "we",
      "to",
      "take",
      "the",
      "quiet",
      "way?",
      "Shall",
      "you",
      "take",
      "the",
      "quiet",
      "way?"
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "verb_form",
        original: "to",
        correction: "（去掉 to）",
        explanation: "Shall we 后面那个动作穿原样，不垫 to——Shall we 【take】。"
      },
      {
        tokenIndex: 8,
        tag: "word_order",
        original: "you",
        correction: "we",
        explanation: "Shall 后面站的是 we——它问的是「咱们一起…好吗」。要说对方，用第 168 课的 Why don't you。"
      }
    ],
    reviewed: true
  },
  {
    // ── 第三十二批 · L180 案件（规格：prd-grammar-whole-had-better-2026-09-21.md §7；新错 plural whole 后带了 s + word_order 数不清的东西误用 whole，旧错回流 L25＋L10）──
    id: "hunt-whole-book",
    number: 193,
    title: "雪天读完的那本书",
    scene: "雪天的窗边，一本书合上放在桌上",
    tokens: [
      "I", "finished", "the", "whole", "books.",
      "I", "drank", "the", "whole", "milk.",
      "He", "read", "a", "book.",
      "I", "see", "her", "last", "week."
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "plural",
        original: "books.",
        correction: "book.",
        explanation: "「整个」说的是一个东西从头到尾——后面那个东西只说一个，不加 s：the whole 【book】。"
      },
      {
        tokenIndex: 8,
        tag: "word_order",
        original: "whole",
        correction: "all",
        explanation: "数不清的东西（牛奶、水）只能用 all the，不能用 the whole——I drank 【all】 the milk。"
      },
      {
        tokenIndex: 11,
        tag: "sv_agreement",
        original: "read",
        correction: "reads",
        explanation: "第 25 课回流：He 是「他」一个，后面的动词要加 -s——He 【reads】 a book。"
      },
      {
        tokenIndex: 15,
        tag: "tense",
        original: "see",
        correction: "saw",
        explanation: "第 10 课回流：last week 是过去的事，要换昨天版——see → 【saw】。"
      }
    ],
    reviewed: true
  },
  {
    // ── 第三十二批 · L181 案件（规格：prd-grammar-whole-had-better-2026-09-21.md §7；新错 word_order had better 后垫了 to + verb_form had 换成 have，旧错回流 L11＋L7）──
    id: "hunt-had-better-go",
    number: 194,
    title: "车站的末班车",
    scene: "车站的钟下，两个人朝检票口张望",
    tokens: [
      "We", "had", "better", "to", "go.",
      "We", "have", "better", "go.",
      "They", "have", "two", "dog.",
      "My", "friends", "is", "here."
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "word_order",
        original: "to",
        correction: "去掉 to",
        explanation: "后面那个动作穿原样、不垫 to——had better 【go】，中间不加东西。"
      },
      {
        tokenIndex: 6,
        tag: "verb_form",
        original: "have",
        correction: "had",
        explanation: "这句话永远是 had，不管说的是今天还是昨天——换成 have 就走样了。"
      },
      {
        tokenIndex: 12,
        tag: "plural",
        original: "dog.",
        correction: "dogs.",
        explanation: "第 11 课回流：two 后面要加 -s——two 【dogs】。"
      },
      {
        tokenIndex: 15,
        tag: "sv_agreement",
        original: "is",
        correction: "are",
        explanation: "第 7 课回流：My friends 是好几个，算一伙的，搭档要用 are——My friends 【are】 here。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-close-24-row",
    number: 189,
    title: "期末前的小纸条",
    scene: "课桌上摊着一摞写满字的纸条",
    tokens: [
      "All",
      "the",
      "books",
      "is",
      "good.",
      "She",
      "doesn't",
      "come",
      "yet.",
      "She",
      "left",
      "three",
      "days",
      "before."
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "sv_agreement",
        original: "is",
        correction: "are",
        explanation: "第 151 课回流：「这几本」是一群，搭档用 are——All the books 【are】 good。"
      },
      {
        tokenIndex: 6,
        tag: "tense",
        original: "doesn't",
        correction: "hasn't",
        explanation: "第 153 课回流：说「还没」要用 hasn't + 做过版——She 【hasn't】 come yet。"
      },
      {
        tokenIndex: 13,
        tag: "preposition",
        original: "before",
        correction: "ago",
        explanation: "第 155 课回流：往回数用 ago 站句尾——three days 【ago】。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-close-25-row",
    number: 190,
    title: "放学路上的云",
    scene: "路边水洼里映着一朵云",
    tokens: [
      "Nobody",
      "are",
      "at",
      "home.",
      "It",
      "looks",
      "a",
      "boat.",
      "None",
      "of",
      "the",
      "cups",
      "is",
      "mine."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "sv_agreement",
        original: "are",
        correction: "is",
        explanation: "第 158 课回流：nobody 说的是「一个人」，搭档用 is——Nobody 【is】 at home。"
      },
      {
        tokenIndex: 6,
        tag: "preposition",
        original: "a",
        correction: "like a",
        explanation: "第 159 课回流：说「像」要带上 like——looks 【like】 a boat。"
      },
      {
        tokenIndex: 12,
        tag: "sv_agreement",
        original: "is",
        correction: "are",
        explanation: "第 157 课回流：cups 是一群，搭档用 are——None of the cups 【are】 mine。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-close-26-row",
    number: 191,
    title: "自习课的本子",
    scene: "本子上写着两行刚记的句子",
    tokens: ["I", "can", "do", "it", "me.", "We", "help", "each", "others.", "I", "have", "a", "lot", "friends."],
    errors: [
      {
        tokenIndex: 4,
        tag: "word_order",
        original: "me.",
        correction: "myself.",
        explanation: "第 163 课回流：说「我自己」用 myself——I can do it 【myself】。"
      },
      {
        tokenIndex: 8,
        tag: "plural",
        original: "others.",
        correction: "other.",
        explanation: "第 165 课回流：each other 后面不加 s——它本来就说「互相」。"
      },
      {
        tokenIndex: 13,
        tag: "fragment",
        original: "friends.",
        correction: "of friends.",
        explanation: "第 167 课回流：a lot of 三个词一起出场——a lot 【of】 friends。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-close-27-row",
    number: 192,
    title: "毕业前的最后一课",
    scene: "毕业纪念册摊开在最后一页",
    tokens: [
      "She",
      "can",
      "both",
      "sing",
      "or",
      "dance.",
      "I",
      "prefer",
      "tea",
      "than",
      "coffee.",
      "I",
      "would",
      "rather",
      "to",
      "walk."
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "word_order",
        original: "or",
        correction: "and",
        explanation: "第 170 课回流：两样都占接 and——both sing 【and】 dance。"
      },
      {
        tokenIndex: 9,
        tag: "word_order",
        original: "than",
        correction: "to",
        explanation: "第 177 课回流：prefer 后面那半截用 to 领——prefer tea 【to】 coffee。"
      },
      {
        tokenIndex: 14,
        tag: "verb_form",
        original: "to",
        correction: "（去掉 to）",
        explanation: "第 176 课回流：would rather 后面穿原样，不垫 to——would rather 【walk】。"
      }
    ],
    reviewed: true
  },
  {
    // ── 第三十四批 · L186 案件（规格：prd-grammar-so-that-as-long-as-2026-09-21.md §7；新错 word_order in order to 接不住换人 + fragment so that 后丢了「谁」，旧错回流 L25＋L10）──
    id: "hunt-so-that-early",
    number: 195,
    title: "天没亮的营地",
    scene: "沙漠营地，天还没亮，水壶摆在沙地上",
    tokens: [
      "I", "came", "early", "in", "order", "to", "you", "can", "rest.",
      "I", "came", "early", "so", "that", "can", "rest.",
      "She", "read", "a", "book.",
      "She", "go", "home", "late."
    ],
    errors: [
      {
        tokenIndex: 5,
        tag: "word_order",
        original: "to",
        correction: "so that",
        explanation: "换人要换说法：in order to 后面只跟动作、前后是同一个人——要换成另一个人，得用 【so that】 you can rest。"
      },
      {
        tokenIndex: 13,
        tag: "fragment",
        original: "that",
        correction: "that you",
        explanation: "后半截不能少「谁」：中文可以不说「你」，英语这半截得把「谁」带上——so 【that you】 can rest。"
      },
      {
        tokenIndex: 17,
        tag: "sv_agreement",
        original: "read",
        correction: "reads",
        explanation: "第 25 课回流：She 是「她」一个，后面的动词要加 -s——She 【reads】 a book。"
      },
      {
        tokenIndex: 21,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "第 10 课回流：说的是过去的事（那天回家晚了），要换昨天版——go → 【went】。"
      }
    ],
    reviewed: true
  },
  {
    // ── 第三十四批 · L187 案件（规格：prd-grammar-so-that-as-long-as-2026-09-21.md §7；新错 word_order 少一头 as + verb_form 前提那半句请了 will，旧错回流 L11＋L7）──
    id: "hunt-as-long-as-forest",
    number: 196,
    title: "林子入口的木牌",
    scene: "雾里的森林入口，木牌上挂着水珠",
    tokens: [
      "I", "will", "go", "as", "long", "you", "come.",
      "I", "will", "go", "as", "long", "as", "you", "will", "come.",
      "I", "see", "two", "bird.",
      "My", "friends", "is", "happy."
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "word_order",
        original: "long",
        correction: "long as",
        explanation: "两个 as 一个都不能少：as 【long as】——两头各卡一个 as，少一头就散架。第 65 课 as tall as 的老规矩。"
      },
      {
        tokenIndex: 8,
        tag: "verb_form",
        original: "will",
        correction: "去掉 will",
        explanation: "前提那半句说现在：as long as you 【come】。第 48 课的老规矩——if 和 unless 都守这条。"
      },
      {
        tokenIndex: 19,
        tag: "plural",
        original: "bird.",
        correction: "birds.",
        explanation: "第 11 课回流：two 后面要加 -s——two 【birds】。"
      },
      {
        tokenIndex: 22,
        tag: "sv_agreement",
        original: "is",
        correction: "are",
        explanation: "第 7 课回流：My friends 是好几个，算一伙的，搭档要用 are——My friends 【are】 happy。"
      }
    ],
    reviewed: true
  },
  {
    // ── 第三十五批 · L188 案件（规格：prd-grammar-had-to-2026-09-21.md §7；新错 verb_form must 说了昨天 + verb_form had to 后换了形状，旧错回流 L10＋L7）──
    id: "hunt-had-to-walk",
    number: 197,
    title: "站台上的那双湿鞋",
    scene: "傍晚的公交站台，雨刚停，地上还有水洼",
    tokens: [
      "I", "must", "walk", "home", "yesterday.",
      "I", "had", "to", "walked", "home.",
      "She", "cook", "dinner", "last", "night.",
      "My", "books", "is", "new."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "verb_form",
        original: "must",
        correction: "had to",
        explanation: "must 只管现在，说昨天的事得换人——yesterday 那一类过去的事要用 【had to】 walk home。"
      },
      {
        tokenIndex: 8,
        tag: "verb_form",
        original: "walked",
        correction: "walk",
        explanation: "had to 后面那个动作穿原样——had to 【walk】。一场戏只让一个词换形状，had 已经换过了。"
      },
      {
        tokenIndex: 11,
        tag: "tense",
        original: "cook",
        correction: "cooked",
        explanation: "第 10 课回流：last night 是过去的事，要换昨天版——cook → 【cooked】。"
      },
      {
        tokenIndex: 17,
        tag: "sv_agreement",
        original: "is",
        correction: "are",
        explanation: "第 7 课回流：My books 是好几个，算一伙的，搭档要用 are——My books 【are】 new。"
      }
    ],
    reviewed: true
  },
  {
    // ── 第三十六批 · L189 案件（规格：prd-grammar-their-2026-09-21.md §7；新错 word_order they 误代 their + theirs 贴了东西，旧错回流 L25＋L10）──
    id: "hunt-their-books",
    number: 198,
    title: "讲台上的那摞本子",
    scene: "课间讲台边，一摞作业本按名字分成两摞",
    tokens: [
      "These", "are", "they", "books.",
      "These", "are", "theirs", "books.",
      "My", "brother", "read", "book.",
      "I", "go", "to", "school", "last", "week."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "word_order",
        original: "they",
        correction: "their",
        explanation: "「他们的」要用 their，不是 they——they 是「他们」，their 才是那个贴在东西前面的小标签。"
      },
      {
        tokenIndex: 6,
        tag: "word_order",
        original: "theirs",
        correction: "their",
        explanation: "贴东西前面的是不带 s 的那个——【their】 books。带 s 的 theirs 要自己站，后面不跟东西。"
      },
      {
        tokenIndex: 10,
        tag: "sv_agreement",
        original: "read",
        correction: "reads",
        explanation: "第 25 课回流：My brother 是「他」一个，后面的动词要加 -s——My brother 【reads】 a book。"
      },
      {
        tokenIndex: 13,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "第 10 课回流：last week 是过去的事，要换昨天版——go → 【went】。"
      }
    ],
    reviewed: true
  },
  {
    // ── 第三十七批 · L190 案件（规格：prd-grammar-learning-to-swim-2026-09-21.md §7；新错 word_order 后面丢了 to + missing_be -ing 自己站，旧错回流 L10＋L25）──
    id: "hunt-learning-to-swim",
    number: 199,
    title: "泳池边的浮板",
    scene: "暑假的泳池边，一块浮板斜靠在池沿上",
    tokens: [
      "I", "am", "learning", "swim.",
      "I", "learning", "to", "swim.",
      "We", "play", "football", "yesterday.",
      "He", "read", "book."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "word_order",
        original: "learning",
        correction: "learning to",
        explanation: "后面那半截要垫个小垫板——learning 【to】 swim。少了 to，两个动作就粘在一起了。"
      },
      {
        tokenIndex: 5,
        tag: "missing_be",
        original: "learning",
        correction: "am learning",
        explanation: "「正在」要有 be 搭着：I 【am】 learning。第 13 课的老规矩——-ing 自己站不住。"
      },
      {
        tokenIndex: 9,
        tag: "tense",
        original: "play",
        correction: "played",
        explanation: "第 10 课回流：yesterday 是过去的事，要换昨天版——play → 【played】。"
      },
      {
        tokenIndex: 13,
        tag: "sv_agreement",
        original: "read",
        correction: "reads",
        explanation: "第 25 课回流：He 是「他」一个，后面的动词要加 -s——He 【reads】 a book。"
      }
    ],
    reviewed: true
  }
,
  {
    id: "hunt-walked-into",
    number: 200,
    title: "厨房门口的水果盘",
    scene: "周末下午的厨房门口，一盘切好的水果还端在手里",
    tokens: [
      "She", "walked", "in", "the", "kitchen.",
      "He", "walked", "into", "room.",
      "They", "are", "student.",
      "I", "eated", "an", "apple."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "preposition",
        original: "in",
        correction: "into",
        explanation: "「走进厨房里面」这个动作要用 into——第 191 课：walked 【into】 the kitchen。in 只说「人在里面」，缺了「从外面动到里面」这一层。"
      },
      {
        tokenIndex: 8,
        tag: "article",
        original: "room.",
        correction: "the room.",
        explanation: "进到哪个具体的房间，前面要带上 the——into 【the】 room。第 3 课的老规矩。"
      },
      {
        tokenIndex: 11,
        tag: "plural",
        original: "student.",
        correction: "students.",
        explanation: "第 7 课回流：They 是好几个，后面那个也跟着变好几个——They are 【students】。"
      },
      {
        tokenIndex: 13,
        tag: "tense",
        original: "eated",
        correction: "ate",
        explanation: "第 10 课回流：吃这个动作有自己的昨天版，不是加 -ed——eat 的昨天版是 【ate】。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-through-across",
    number: 201,
    title: "桥上回头喊",
    scene: "春游的窄木桥上，有人停下来回头喊同学",
    tokens: [
      "We", "walked", "across", "the", "forest.",
      "She", "walked", "through", "the", "bridge.",
      "I", "will", "to", "draw.",
      "They", "is", "playing", "football."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "preposition",
        original: "across",
        correction: "through",
        explanation: "树林四周都是树，要从中间钻过去——第 192 课：walked 【through】 the forest。across 只在「有两个头」的地方用。"
      },
      {
        tokenIndex: 7,
        tag: "preposition",
        original: "through",
        correction: "across",
        explanation: "桥是一条窄路、有两头，从这头走到那头用 across——walked 【across】 the bridge。桥没有「中间」可以钻。"
      },
      {
        tokenIndex: 12,
        tag: "verb_form",
        original: "to",
        correction: "（去掉 to）",
        explanation: "第 12 课回流：will 后面那个动作穿原样，不垫 to——I will 【draw】。"
      },
      {
        tokenIndex: 15,
        tag: "sv_agreement",
        original: "is",
        correction: "are",
        explanation: "第 13 课回流：They 是好几个，搭档要用 are——They 【are】 playing football。"
      }
    ],
    reviewed: true
  }
,
  {
    id: "hunt-so-that-result",
    number: 202,
    title: "灯塔上的裂缝",
    scene: "台风夜值班室的窗边，玻璃上裂了一道细缝",
    tokens: [
      "The", "wind", "was", "very", "strong", "that", "the", "window", "broke.",
      "He", "was", "so", "tired", "that", "fell", "asleep.",
      "She", "have", "a", "cat.",
      "I", "buyed", "two", "books."
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "word_order",
        original: "very",
        correction: "so",
        explanation: "「太…了，所以…」这一头要用 so——第 193 课：was 【so】 strong that…。very 只说「挺…」，拉不出后面那个结果。"
      },
      {
        tokenIndex: 14,
        tag: "fragment",
        original: "fell",
        correction: "he fell",
        explanation: "that 后面那半截得把「谁」放回去——睡着了的是他：that 【he】 fell asleep。少了它那句话不知道是谁。"
      },
      {
        tokenIndex: 17,
        tag: "sv_agreement",
        original: "have",
        correction: "has",
        explanation: "第 3 课回流：She 是「她」一个，搭档要用 has——She 【has】 a cat。"
      },
      {
        tokenIndex: 21,
        tag: "tense",
        original: "buyed",
        correction: "bought",
        explanation: "第 11 课回流：buy 的昨天版不是加 -ed，它有自己的样子——buy 的昨天版是 【bought】。"
      }
    ],
    reviewed: true
  }
,
  {
    id: "hunt-such-a",
    number: 203,
    title: "船边的渔获",
    scene: "海钓船边，一条大鱼摆在甲板的水桶旁",
    tokens: [
      "It", "was", "a", "such", "big", "fish.",
      "She", "is", "so", "a", "kind", "teacher.",
      "He", "go", "to", "school", "every", "day.",
      "I", "see", "a", "bird", "yesterday."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "word_order",
        original: "a",
        correction: "such a",
        explanation: "a 要跟在 such 后面——第 194 课：such 【a】 big fish。先说「这么」再说「一个」，两个词得挨着。"
      },
      {
        tokenIndex: 8,
        tag: "word_order",
        original: "so",
        correction: "such",
        explanation: "后面跟的是「东西」（a kind teacher），要用 such——so 只跟「有多…」那个词（so kind）。第 193 课的老规矩。"
      },
      {
        tokenIndex: 13,
        tag: "sv_agreement",
        original: "go",
        correction: "goes",
        explanation: "第 25 课回流：He 是「他」一个，后面的动词要加 -s——He 【goes】 to school。"
      },
      {
        tokenIndex: 19,
        tag: "tense",
        original: "see",
        correction: "saw",
        explanation: "第 10 课回流：yesterday 是过去的事，要换昨天版——see 的昨天版是 【saw】。"
      }
    ],
    reviewed: true
  }
,
  {
    id: "hunt-its-box",
    number: 204,
    title: "储物间的纸盒",
    scene: "储物间角落里的纸盒，边上散着一件小孩的旧外套",
    tokens: [
      "The", "cat", "is", "in", "it", "box.",
      "It's", "box", "is", "small.",
      "She", "have", "two", "cat.",
      "I", "buyed", "a", "book", "yesterday."
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "word_order",
        original: "it",
        correction: "its",
        explanation: "「它的」要写成 its——第 195 课：in 【its】 box。光写 it 是「它」，它不能贴到东西前面去。"
      },
      {
        tokenIndex: 6,
        tag: "word_order",
        original: "It's",
        correction: "Its",
        explanation: "带撇的 It's 是「它是」——It's box 就成了「它是盒子」。说「它的盒子」要用不带撇的 its。"
      },
      {
        tokenIndex: 11,
        tag: "sv_agreement",
        original: "have",
        correction: "has",
        explanation: "第 3 课回流：She 是「她」一个，搭档要用 has——She 【has】 a cat。"
      },
      {
        tokenIndex: 13,
        tag: "plural",
        original: "cat.",
        correction: "cats.",
        explanation: "第 7 课回流：two 后面是一群，要加 s——two 【cats】。"
      }
    ],
    reviewed: true
  }
];
