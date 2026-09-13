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
      "Last", "week", "I", "move", "to", "a", "new", "home.",
      "It", "was", "small", "but", "quiet.",
      "My", "sister", "help", "me", "carry", "three", "box", "of", "books.",
      "We", "was", "tired,", "but", "we", "cooked", "dinner", "together."
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "tense",
        original: "move",
        correction: "moved",
        explanation: "Last week 说的是过去发生的事，动词要用过去式：move → moved。"
      },
      {
        tokenIndex: 15,
        tag: "tense",
        original: "help",
        correction: "helped",
        explanation: "整段都在讲上周的事，help 也要变成 helped，时态要一致。"
      },
      {
        tokenIndex: 19,
        tag: "plural",
        original: "box",
        correction: "boxes",
        explanation: "three 后面是可数名词复数：three boxes。"
      },
      {
        tokenIndex: 23,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation: "主语是 We（复数），be 动词要用 were，不是 was。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-yesterday-park",
    number: 2,
    title: "昨天的公园",
    scene: "相册背面的一行字",
    tokens: [
      "Yesterday", "I", "go", "to", "the", "park", "with", "my", "friend.",
      "We", "see", "a", "lot", "of", "birds."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "Yesterday 提示这是过去的事，go 的过去式是 went。"
      },
      {
        tokenIndex: 10,
        tag: "tense",
        original: "see",
        correction: "saw",
        explanation: "同一段里的动作都发生在昨天，see 要变成 saw。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-my-sister",
    number: 3,
    reviewed: true,
    title: "我的妹妹",
    scene: "写给新同学的一封自我介绍",
    tokens: [
      "My", "sister", "like", "reading", "books.",
      "She", "go", "to", "the", "library", "every", "week."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "sv_agreement",
        original: "like",
        correction: "likes",
        explanation: "主语 My sister 等于 she，是第三人称单数，动词要加 -s：likes。"
      },
      {
        tokenIndex: 6,
        tag: "sv_agreement",
        original: "go",
        correction: "goes",
        explanation: "主语 She 是三单，go 要变 goes。中文动词不随人称变化，所以这里最容易漏。"
      }
    ]
  },
  {
    id: "hunt-breakfast",
    number: 4,
    title: "早餐桌",
    scene: "早上随手写在便签上的一段话",
    tokens: [
      "I", "have", "a", "egg", "and", "three", "sandwich", "for", "breakfast.",
      "My", "brother", "eat", "two", "banana."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "article",
        original: "a",
        correction: "an",
        explanation: "egg 以元音音素开头，要用 an egg，不是 a egg。"
      },
      {
        tokenIndex: 6,
        tag: "plural",
        original: "sandwich",
        correction: "sandwiches",
        explanation: "three 后面要用复数：three sandwiches。"
      },
      {
        tokenIndex: 11,
        tag: "sv_agreement",
        original: "eat",
        correction: "eats",
        explanation: "主语 My brother 是三单，eat 要加 -s。"
      },
      {
        tokenIndex: 13,
        tag: "plural",
        original: "banana",
        correction: "bananas",
        explanation: "two 后面是可数名词复数：two bananas。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-call-mother",
    number: 5,
    title: "车站的一通电话",
    scene: "给朋友描述刚才的通话",
    tokens: [
      "My", "mother", "happy", "today", "because", "I", "called", "her",
      "from", "the", "station.",
      "She", "very", "glad", "to", "hear", "my", "voice."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "missing_be",
        original: "happy",
        correction: "is happy",
        explanation: "英语的句子必须有动词。主语和形容词之间少了 be：My mother is happy。中文说「我妈妈今天高兴」不需要动词，所以这里特别容易漏。"
      },
      {
        tokenIndex: 13,
        tag: "missing_be",
        original: "glad",
        correction: "is glad",
        explanation: "同样少了 be 动词：She is very glad。没有它就只剩一个主语加一个形容词，句子是塌的。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-prepositions",
    number: 6,
    title: "三个介词",
    scene: "英语角聊天后记下的三句话",
    tokens: [
      "I", "live", "at", "China.",
      "She", "is", "good", "in", "math.",
      "We", "arrived", "to", "the", "station", "late."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "preposition",
        original: "at",
        correction: "in",
        explanation: "国家、城市这样的大地方用 in：live in China。at 用于具体的点，比如 at the station。"
      },
      {
        tokenIndex: 7,
        tag: "preposition",
        original: "in",
        correction: "at",
        explanation: "be good at 是固定搭配：good at math。这类搭配要整块记，不能按中文的「在…方面」去推。"
      },
      {
        tokenIndex: 11,
        tag: "preposition",
        original: "to",
        correction: "at",
        explanation: "arrive at 用于较小的地方（station、airport 这类具体的点），arrive in 用于城市和国家。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-because-so",
    number: 7,
    title: "因为所以",
    scene: "一篇周记里最常见的两句话",
    tokens: [
      "Because", "I", "was", "tired,", "so", "I", "went", "to", "bed", "early.",
      "Though", "it", "was", "cold,", "but", "we", "went", "out."
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "run_on",
        original: "so",
        correction: "去掉 so",
        explanation: "中文的「因为…所以…」在英语里只能留一个。Because I was tired, I went to bed early. 或者 I was tired, so I went to bed early."
      },
      {
        tokenIndex: 14,
        tag: "run_on",
        original: "but",
        correction: "去掉 but",
        explanation: "同样的道理：Though 和 but 不能同时出现，留一个就够。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-tense-jump",
    number: 8,
    title: "时态跳走了",
    scene: "一段前半句过去、后半句现在的话",
    tokens: [
      "I", "met", "my", "old", "friend", "yesterday.",
      "We", "talk", "for", "hours", "and", "laugh", "a", "lot."
    ],
    errors: [
      {
        tokenIndex: 7,
        tag: "tense",
        original: "talk",
        correction: "talked",
        explanation: "前面已经用 met 定在过去了，后面不能突然回到现在的 talk。"
      },
      {
        tokenIndex: 11,
        tag: "tense",
        original: "laugh",
        correction: "laughed",
        explanation: "and 连接的两个动作时态要一致，都要用过去式。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-uncountable",
    number: 9,
    title: "不可数的东西",
    scene: "考完试写给老师的一段话",
    notes: [
      { word: "advice", zh: "建议（不可数名词）" },
      { word: "information", zh: "信息（不可数名词）" },
      { word: "exam", zh: "考试" }
    ],
    tokens: [
      "The", "teacher", "gave", "us", "many", "advice", "and", "some",
      "informations", "about", "the", "exam."
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "plural",
        original: "many",
        correction: "a lot of",
        explanation: "advice 是不可数名词，不能用 many 修饰。改成 a lot of advice 或者 some advice。"
      },
      {
        tokenIndex: 8,
        tag: "plural",
        original: "informations",
        correction: "information",
        explanation: "information 永远不加 -s。同类还有 news、homework、furniture、equipment。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-passive",
    number: 10,
    title: "演唱会后",
    scene: "演出结束后的一条朋友圈",
    tokens: [
      "The", "song", "was", "sing", "by", "her", "at", "the", "party.",
      "People", "was", "very", "happy."
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "verb_form",
        original: "sing",
        correction: "sung",
        explanation: "被动语态是 be + 过去分词：was sung。sing 的过去分词是 sung。"
      },
      {
        tokenIndex: 10,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation: "主语是 People（人们，复数），be 动词要用 were。泛指「人们」时不加 the。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-word-order",
    number: 11,
    title: "形容词站错位置",
    scene: "看图说话练习里的两句话",
    tokens: [
      "She", "bought", "a", "dress", "beautiful.",
      "We", "visited", "a", "house", "old", "near", "the", "river."
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "word_order",
        original: "a dress beautiful",
        correction: "a beautiful dress",
        explanation: "形容词修饰名词时要站在名词前面：a beautiful dress。中文说「一条漂亮的裙子」，形容词也在前面，但英语不能倒过来放。"
      },
      {
        tokenIndex: 9,
        tag: "word_order",
        original: "a house old",
        correction: "an old house",
        explanation: "同样的位置问题：an old house。old 要放在 house 前面。"
      }
    ],
    reviewed: true
  },
  {
    id: "hunt-new-phone",
    number: 12,
    title: "新手机",
    scene: "在群里安利刚买的手机（提示：店里那个 a 其实是对的）",
    tokens: [
      "I", "bought", "the", "new", "phone", "yesterday.",
      "I", "waited", "for", "a", "hour", "in", "a", "shop."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "article",
        original: "the",
        correction: "a",
        explanation: "第一次提到一样东西，对方还不知道是哪一个，要用 a：a new phone。"
      },
      {
        tokenIndex: 9,
        tag: "article",
        original: "a",
        correction: "an",
        explanation: "hour 的 h 不发音，词以元音音素开头，要用 an hour。"
      }
    ],
    reviewed: true
  },
  // ── 以下第 13–20 案为 R06 内容扩量的 AI 初稿（2026-09-12），补齐 fragment / verb_form / missing_be /
  // run_on / word_order 短板罪名（扩量后 10 类罪名每类 ≥3）。上线前需按红线人工校验：
  // 错误自然、解析准确、词汇落在核心词规范内（超纲词已配 notes 生词提示）。
  {
    id: "hunt-mom-note",
    number: 13,
    reviewed: true,
    title: "妈妈的留言条",
    scene: "贴在门上的一张便条，妈妈出门前留的",
    tokens: [
      "Because", "rainy,", "we", "stayed", "at", "home", "all", "day.",
      "Very", "happy", "today.",
      "She", "very", "happy", "with", "the", "cake.",
      "My", "brother", "likes", "it", "too."
    ],
    errors: [
      {
        tokenIndex: 1,
        tag: "fragment",
        original: "rainy,",
        correction: "it was rainy,",
        explanation: "Because 后面要跟一个完整的小句子（谁 + 怎么样）：Because it was rainy。只写 rainy 就缺了主语和动词。"
      },
      {
        tokenIndex: 8,
        tag: "fragment",
        original: "Very",
        correction: "I am very",
        explanation: "Very happy today 没有主语也没有动词——句子要能回答「谁 + 怎么样」：I am very happy today。"
      },
      {
        tokenIndex: 12,
        tag: "missing_be",
        original: "very",
        correction: "is very",
        explanation: "She 后面少了个动词：说「她是开心的状态」要用 She is very happy，be 动词不能丢。"
      }
    ]
  },
  {
    id: "hunt-school-show",
    number: 14,
    reviewed: true,
    title: "学校演出",
    scene: "演出第二天写在笔记本上的回忆",
    tokens: [
      "Yesterday", "I", "was", "sing", "at", "the", "school", "show.",
      "My", "friend", "was", "dance", "too.",
      "Very", "fun."
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "verb_form",
        original: "sing",
        correction: "singing",
        explanation: "was 后面接「正在做」的动作要用 -ing 形式：was singing。"
      },
      {
        tokenIndex: 11,
        tag: "verb_form",
        original: "dance",
        correction: "dancing",
        explanation: "同一句式：was dancing，dance 要变成 dancing。"
      },
      {
        tokenIndex: 13,
        tag: "fragment",
        original: "Very",
        correction: "It was very",
        explanation: "这一句没有主语也没有动词，补上 It was：It was very fun。"
      }
    ]
  },
  {
    id: "hunt-weekend-plan",
    number: 15,
    reviewed: true,
    title: "周末计划",
    scene: "写在日历边上的一份小计划",
    tokens: [
      "Because", "it", "is", "my", "grandma's", "birthday,", "so", "I", "will", "make", "cake", "for", "her.",
      "I", "want", "to", "buy", "two", "apple", "too."
    ],
    errors: [
      {
        tokenIndex: 6,
        tag: "run_on",
        original: "so,",
        correction: "去掉 so,",
        explanation: "because 和 so 不能同时用——中文说「因为……所以……」，英文只留一个。句首已经有 Because，so 要去掉。"
      },
      {
        tokenIndex: 10,
        tag: "article",
        original: "cake",
        correction: "a cake",
        explanation: "可数名词单数前面要有个「帽子」：make a cake。"
      },
      {
        tokenIndex: 18,
        tag: "plural",
        original: "apple",
        correction: "apples",
        explanation: "two 后面的可数名词要加 -s：two apples。"
      }
    ],
    notes: [{ word: "grandma", zh: "奶奶；外婆" }]
  },
  {
    id: "hunt-white-cat",
    number: 16,
    reviewed: true,
    title: "朋友的白猫",
    scene: "跟同学聊天时说到的一只猫",
    tokens: [
      "My", "friend", "has", "a", "cat", "white.",
      "She", "was", "excite", "about", "it", "all", "day.",
      "We", "went", "to", "home", "at", "five", "o'clock."
    ],
    errors: [
      {
        tokenIndex: 5,
        tag: "word_order",
        original: "white.",
        correction: "去掉（white 放到 cat 前面）",
        explanation: "形容词要站在名词前面：a white cat。中文说「一只白色的猫」，英文的 white 不能排在 cat 后面。"
      },
      {
        tokenIndex: 8,
        tag: "verb_form",
        original: "excite",
        correction: "excited",
        explanation: "说「感到兴奋」要用 excited：She was excited about it。"
      },
      {
        tokenIndex: 15,
        tag: "preposition",
        original: "to",
        correction: "去掉 to",
        explanation: "go home 中间不加 to——home 在这里自己就是「目的地」，直接说 went home。"
      }
    ],
    notes: [
      { word: "excited", zh: "感到兴奋的" },
      { word: "o'clock", zh: "……点钟" }
    ]
  },
  {
    id: "hunt-sports-day",
    number: 17,
    reviewed: true,
    title: "运动会",
    scene: "运动会结束当晚写的日记",
    tokens: [
      "Sports", "Day", "was", "last", "Friday.",
      "We", "very", "excited.",
      "The", "race", "stop", "in", "the", "afternoon.",
      "Run", "fast", "was", "fun.",
      "Very", "tired,", "but", "very", "happy."
    ],
    errors: [
      {
        tokenIndex: 6,
        tag: "missing_be",
        original: "very",
        correction: "were very",
        explanation: "We 后面少了个动词：事情发生在上周，要说 We were very excited。"
      },
      {
        tokenIndex: 10,
        tag: "tense",
        original: "stop",
        correction: "stopped",
        explanation: "比赛是上周五停的，动词要换成过去式：stopped。"
      },
      {
        tokenIndex: 14,
        tag: "verb_form",
        original: "Run",
        correction: "Running",
        explanation: "「跑步」这件事当主语时，动词要穿 -ing 的外衣：Running fast was fun。"
      },
      {
        tokenIndex: 18,
        tag: "fragment",
        original: "Very",
        correction: "We were very",
        explanation: "又是一个没有主语和动词的句子：We were very tired, but very happy。"
      }
    ],
    notes: [{ word: "Sports Day", zh: "运动会" }]
  },
  {
    id: "hunt-pen-pal-letter",
    number: 18,
    reviewed: true,
    title: "写给笔友的信",
    scene: "英语课上写了一半的一封信",
    tokens: [
      "My", "pen", "pal", "live", "in", "Canada.",
      "Because", "I", "miss", "her,", "so", "I", "write", "to", "her", "every", "week.",
      "She", "is", "good", "in", "English."
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "sv_agreement",
        original: "live",
        correction: "lives",
        explanation: "主语 My pen pal 等于 she，是第三人称单数：lives。"
      },
      {
        tokenIndex: 10,
        tag: "run_on",
        original: "so,",
        correction: "去掉 so,",
        explanation: "句首已经有 Because，后面的 so 要去掉——because 和 so 只留一个。"
      },
      {
        tokenIndex: 20,
        tag: "preposition",
        original: "in",
        correction: "at",
        explanation: "擅长某件事用 be good at：She is good at English。"
      }
    ],
    notes: [
      { word: "pen pal", zh: "笔友" },
      { word: "Canada", zh: "加拿大" }
    ]
  },
  {
    id: "hunt-fridge-note",
    number: 19,
    reviewed: true,
    title: "冰箱上的便条",
    scene: "厨房冰箱门上贴着的家里留言",
    tokens: [
      "The", "soup", "is", "in", "the", "kitchen.",
      "There", "are", "two", "egg", "in", "the", "fridge.",
      "The", "vegetables", "are", "fresh.",
      "I", "very", "busy", "today.",
      "Eat", "the", "chicken", "noodles", "hot."
    ],
    errors: [
      {
        tokenIndex: 9,
        tag: "plural",
        original: "egg",
        correction: "eggs",
        explanation: "two 后面的可数名词要加 -s：two eggs。"
      },
      {
        tokenIndex: 18,
        tag: "missing_be",
        original: "very",
        correction: "am very",
        explanation: "I 后面少了个动词：I am very busy today。"
      },
      {
        tokenIndex: 25,
        tag: "word_order",
        original: "hot.",
        correction: "去掉（hot 放到 noodles 前面）",
        explanation: "形容词要站在名词前面：hot chicken noodles。"
      }
    ],
    notes: [
      { word: "fridge", zh: "冰箱" },
      { word: "soup", zh: "汤" },
      { word: "vegetables", zh: "蔬菜" }
    ]
  },
  {
    id: "hunt-term-review",
    number: 20,
    reviewed: true,
    title: "学期总结",
    scene: "期末写给自己的三行总结",
    tokens: [
      "Last", "term,", "I", "learn", "a", "lot", "of", "English.",
      "My", "teacher", "gave", "us", "useful", "advice.",
      "She", "is", "best", "teacher", "in", "our", "school.",
      "I", "was", "excite", "to", "see", "my", "scores."
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "tense",
        original: "learn",
        correction: "learned",
        explanation: "Last term 是过去的时间，动词要换成过去式：learned。"
      },
      {
        tokenIndex: 16,
        tag: "article",
        original: "best",
        correction: "the best",
        explanation: "最高级前面要加 the：She is the best teacher。"
      },
      {
        tokenIndex: 23,
        tag: "verb_form",
        original: "excite",
        correction: "excited",
        explanation: "「感到兴奋」是 was excited——excite 的 -ed 外衣不能忘。"
      }
    ],
    notes: [
      { word: "advice", zh: "建议（不可数，没有 -s）" },
      { word: "term", zh: "学期" },
      { word: "scores", zh: "分数；成绩" }
    ]
  },
  {
    // L13（现在进行时）配套案 · R24 螺旋混题：新错 verb_form ×2 + 旧错 sv_agreement / plural ×2（旧错占 50%）
    id: "hunt-kitchen-note",
    number: 21,
    title: "冰箱上的便条",
    scene: "周六中午，家里冰箱上贴的一张便条",
    tokens: [
      "Mom", "is", "cook", "in", "the", "kitchen.",
      "Dad", "is", "watch", "TV", "with", "my", "brother.",
      "My", "sister", "do", "her", "homework", "every", "evening.",
      "Please", "buy", "two", "egg", "and", "some", "milk.",
      "We", "are", "waiting", "for", "dinner!"
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "verb_form",
        original: "cook",
        correction: "cooking",
        explanation: "Mom is 正在做这件事，cook 要穿上 -ing 外套：is cooking。"
      },
      {
        tokenIndex: 8,
        tag: "verb_form",
        original: "watch",
        correction: "watching",
        explanation: "Dad is 后面的动词也要 -ing：is watching。be 不能丢，-ing 也不能丢。"
      },
      {
        tokenIndex: 15,
        tag: "sv_agreement",
        original: "do",
        correction: "does",
        explanation: "every evening 说的是每天都做的事，My sister 是三单，动词要加 -s：does。"
      },
      {
        tokenIndex: 23,
        tag: "plural",
        original: "egg",
        correction: "eggs",
        explanation: "two 后面的可数名词要用复数：two eggs。"
      }
    ],
    notes: [
      { word: "kitchen", zh: "厨房" }
    ],
    reviewed: true
  },
  {
    // L14（can）配套案 · R24 螺旋混题：新错 verb_form（can 后动词变形）×2 + 旧错 article / plural ×2（旧错占 50%）
    id: "hunt-cafe-order",
    number: 22,
    title: "奶茶店的小票",
    scene: "街角奶茶店台面上的一张手写小票",
    tokens: [
      "Order", "for", "Xiaomei:",
      "I", "can", "making", "milk", "tea,",
      "and", "she", "cans", "make", "coffee.",
      "Please", "give", "me", "a", "ice", "tea",
      "and", "three", "kind", "of", "juice.",
      "Thank", "you!"
    ],
    errors: [
      {
        tokenIndex: 5,
        tag: "verb_form",
        original: "making",
        correction: "make",
        explanation: "can 后面的动词穿原样，不变形：can make。"
      },
      {
        tokenIndex: 10,
        tag: "verb_form",
        original: "cans",
        correction: "can",
        explanation: "can 从不换衣服：不管主语是谁都是 can，没有 cans 这种形状。"
      },
      {
        tokenIndex: 16,
        tag: "article",
        original: "a",
        correction: "an",
        explanation: "ice 以元音开头，前面要用 an：an ice tea——看发音，不看字母。"
      },
      {
        tokenIndex: 21,
        tag: "plural",
        original: "kind",
        correction: "kinds",
        explanation: "three 后面的可数名词要用复数：three kinds。"
      }
    ],
    notes: [
      { word: "order", zh: "点单；订单" },
      { word: "juice", zh: "果汁" }
    ],
    reviewed: true
  },
  {
    // L15（want to）配套案 · R24 螺旋混题：新错 verb_form（to 后动词变形）×2 + 旧错 plural / tense ×2（旧错占 50%）
    id: "hunt-travel-plan",
    number: 23,
    title: "暑假计划单",
    scene: "笔记本上写了一半的暑假计划",
    tokens: [
      "Summer", "plan:",
      "I", "want", "to", "goes", "to", "the", "beach.",
      "My", "brother", "wants", "to", "swimming", "every", "day.",
      "We", "will", "take", "two", "bag", "of", "clothes.",
      "Last", "summer", "we", "stay", "at", "home."
    ],
    errors: [
      {
        tokenIndex: 5,
        tag: "verb_form",
        original: "goes",
        correction: "go",
        explanation: "to 后面的动词穿原样：want to go。变形的事已经由 want 做完了。"
      },
      {
        tokenIndex: 13,
        tag: "verb_form",
        original: "swimming",
        correction: "swim",
        explanation: "wants to 后面跟动词原形：wants to swim，-ing 外套要脱掉。"
      },
      {
        tokenIndex: 20,
        tag: "plural",
        original: "bag",
        correction: "bags",
        explanation: "two 后面的可数名词要用复数：two bags。"
      },
      {
        tokenIndex: 26,
        tag: "tense",
        original: "stay",
        correction: "stayed",
        explanation: "Last summer 是过去的时间，动词要换昨天版：stayed。"
      }
    ],
    notes: [
      { word: "beach", zh: "海滩" }
    ],
    reviewed: true
  },
  {
    // L16（must / have to）配套案 · R24 螺旋混题：新错 verb_form（must 后动词变形）×2 + 旧错 plural / article ×2（旧错占 50%）
    id: "hunt-desk-rules",
    number: 24,
    title: "课桌上的提醒",
    scene: "教室课桌上贴的一张自律小纸条",
    tokens: [
      "My", "rules", "for", "today:",
      "I", "must", "going", "to", "bed", "early.",
      "She", "musts", "clean", "her", "room.",
      "Read", "two", "page", "every", "night.",
      "Eat", "a", "apple", "after", "dinner."
    ],
    errors: [
      {
        tokenIndex: 6,
        tag: "verb_form",
        original: "going",
        correction: "go",
        explanation: "must 后面的动词穿原形：must go。going 的 -ing 外套 must 不认。"
      },
      {
        tokenIndex: 11,
        tag: "verb_form",
        original: "musts",
        correction: "must",
        explanation: "must 和 can 一样从不变形：不管主语是谁都是 must，没有 musts。"
      },
      {
        tokenIndex: 17,
        tag: "plural",
        original: "page",
        correction: "pages",
        explanation: "two 后面的可数名词要用复数：two pages。"
      },
      {
        tokenIndex: 21,
        tag: "article",
        original: "a",
        correction: "an",
        explanation: "apple 以元音开头，前面要用 an：an apple。"
      }
    ],
    reviewed: true
  },
  {
    // L17（比较级）配套案 · R24 螺旋混题：新错 verb_form（比较级词形：双写 / 不规则 better）×2 + 旧错 article / plural ×2（旧错占 50%）
    id: "hunt-photo-compare",
    number: 25,
    title: "两张旧照片",
    scene: "相册里并排贴着的两张海边照片",
    tokens: [
      "Two", "photos", "from", "last", "summer:",
      "In", "the", "first", "one,",
      "I", "look", "younger,", "and", "my", "hair", "is", "shorter.",
      "The", "sea", "was", "hoter", "than", "today.",
      "This", "photo", "is", "more", "good", "than", "that.",
      "There", "is", "a", "island", "in", "it,",
      "and", "two", "boat", "on", "the", "water."
    ],
    errors: [
      {
        tokenIndex: 20,
        tag: "verb_form",
        original: "hoter",
        correction: "hotter",
        explanation: "比「更热」要用 -er 形状，hot 是短促有力的词，先双写 t 再加 -er：hotter。"
      },
      {
        tokenIndex: 26,
        tag: "verb_form",
        original: "more good",
        correction: "better",
        explanation: "good 的比较级是不规则形状 better——像 go 的昨天版是 went 一样，要单独记住。"
      },
      {
        tokenIndex: 32,
        tag: "article",
        original: "a",
        correction: "an",
        explanation: "island 以元音开头，前面要用 an：an island。"
      },
      {
        tokenIndex: 38,
        tag: "plural",
        original: "boat",
        correction: "boats",
        explanation: "two 后面的可数名词要用复数：two boats。"
      }
    ],
    notes: [
      { word: "island", zh: "岛" }
    ],
    reviewed: true
  },
  {
    // L18（介词 in/on/at）配套案 · R24 螺旋混题：新错 preposition（in/on/at 混用）×2 + 旧错 plural / article ×2（旧错占 50%）
    id: "hunt-grandma-box",
    number: 26,
    title: "外婆的箱子",
    scene: "外婆家老房子里，周末整理时翻出的一只旧箱子",
    tokens: [
      "Grandma", "keeps", "old", "photos", "in", "a", "box.",
      "The", "box", "is", "in", "the", "table.",
      "We", "open", "it", "at", "Sunday.",
      "There", "are", "three", "photo", "inside.",
      "It", "is", "a", "old", "box."
    ],
    errors: [
      {
        tokenIndex: 10,
        tag: "preposition",
        original: "in",
        correction: "on",
        explanation: "在桌子上（表面）用 on：on the table。in 是「在里面」。"
      },
      {
        tokenIndex: 16,
        tag: "preposition",
        original: "at",
        correction: "on",
        explanation: "具体某一天前面用 on：on Sunday。at 留给时间点（at six）。"
      },
      {
        tokenIndex: 21,
        tag: "plural",
        original: "photo",
        correction: "photos",
        explanation: "three 后面的可数名词要用复数：three photos。"
      },
      {
        tokenIndex: 25,
        tag: "article",
        original: "a",
        correction: "an",
        explanation: "old 以元音开头，前面要用 an：an old box。"
      }
    ],
    reviewed: true
  },
  {
    // L19（and / but）配套案 · R24 螺旋混题：新错 run_on（缺连词 / 并列误用转折）×2 + 旧错 tense / article ×2（旧错占 50%）
    id: "hunt-snow-day",
    number: 27,
    title: "雪天的日记",
    scene: "写了一半的雪天日记",
    tokens: [
      "Snow", "day!",
      "It", "snowed", "all", "day,", "we", "were", "very", "happy.",
      "Yesterday", "I", "play", "in", "the", "snow", "all", "day.",
      "My", "sister", "but", "I", "played", "outside.",
      "Mom", "gave", "us", "a", "orange", "juice."
    ],
    errors: [
      {
        tokenIndex: 6,
        tag: "run_on",
        original: "we",
        correction: "and we",
        explanation: "逗号连不住两个句子，中间要站一个连词：……all day, and we were very happy."
      },
      {
        tokenIndex: 12,
        tag: "tense",
        original: "play",
        correction: "played",
        explanation: "Yesterday 是过去的时间，动词要换昨天版：played。"
      },
      {
        tokenIndex: 20,
        tag: "run_on",
        original: "but",
        correction: "and",
        explanation: "My sister 和 I 是并列的两件事，用 and 连：My sister and I played outside."
      },
      {
        tokenIndex: 27,
        tag: "article",
        original: "a",
        correction: "an",
        explanation: "orange 以元音开头，前面要用 an：an orange juice。"
      }
    ],
    reviewed: true
  },
  {
    // L20（because / so）配套案 · R24 螺旋混题：新错 run_on（because…so 连用）+ fragment（because 半句独立）×2 + 旧错 tense / plural ×2（旧错占 50%）
    id: "hunt-late-note",
    number: 28,
    title: "迟到的解释",
    scene: "塞给老师的一张道歉小纸条",
    tokens: [
      "To", "my", "teacher:",
      "I", "was", "late", "because", "the", "bus", "was", "late,", "so",
      "please", "don't", "be", "angry.",
      "It", "was", "cold", "yesterday,", "so", "I", "wear", "my", "coat.",
      "Because", "the", "alarm", "was", "broken.",
      "Tomorrow", "I", "will", "use", "two", "alarm", "clock."
    ],
    errors: [
      {
        tokenIndex: 11,
        tag: "run_on",
        original: "so",
        correction: "去掉 so",
        explanation: "because 和 so 只能来一个：I was late because the bus was late. Please don't be angry."
      },
      {
        tokenIndex: 22,
        tag: "tense",
        original: "wear",
        correction: "wore",
        explanation: "yesterday 说的是昨天的事，动词要换昨天版：wore。"
      },
      {
        tokenIndex: 25,
        tag: "fragment",
        original: "Because",
        correction: "去掉 Because，并入上一句",
        explanation: "because 开头的半句只是原因，不能自己站住：要和结果连在一起，或直接说 The alarm was broken."
      },
      {
        tokenIndex: 36,
        tag: "plural",
        original: "clock",
        correction: "clocks",
        explanation: "two 后面的可数名词要用复数：two alarm clocks。"
      }
    ],
    reviewed: true
  },
  {
    // ── 第二批案件（析客规格书 §4）：每案 3–4 错 = 新错（verb_form/tense）1–2 + 旧错 1–2，全部单 token 可修 ──
    // L21 配套 · 螺旋混题：新错 have do→done / eated→eaten + 旧错 say→said（tense, L10）/ sandwich→sandwiches（plural, L11）
    id: "hunt-homework-note",
    number: 29,
    reviewed: true,
    title: "书包里的字条",
    scene: "妈妈清晨塞进书包的一张字条",
    notes: [{ word: "packed", zh: "装好（pack 的昨天版）" }],
    tokens: [
      "Good", "morning!",
      "Have", "you", "finished", "your", "homework?",
      "I", "hope", "you", "have", "do", "it", "all.",
      "Yesterday", "you", "say", "it", "was", "too", "much,", "and", "it", "was", "hard.",
      "You", "have", "eated", "two", "sandwich", "for", "dinner.",
      "I", "have", "packed", "your", "lunch", "box."
    ],
    errors: [
      {
        tokenIndex: 11,
        tag: "verb_form",
        original: "do",
        correction: "done",
        explanation: "have 后面要站做过版：do 的做过版是 done。I have done it all."
      },
      {
        tokenIndex: 16,
        tag: "tense",
        original: "say",
        correction: "said",
        explanation: "Yesterday 说的是昨天的事，动词要换昨天版：say → said。"
      },
      {
        tokenIndex: 27,
        tag: "verb_form",
        original: "eated",
        correction: "eaten",
        explanation: "eat 的做过版是 eaten，不走加 -ed 的路——没有 eated 这个形状。"
      },
      {
        tokenIndex: 29,
        tag: "plural",
        original: "sandwich",
        correction: "sandwiches",
        explanation: "two 后面的可数名词要用复数：two sandwiches。"
      }
    ]
  },
  {
    // L22 配套：新错 was→been（have 后错位）/ see→seen + 旧错 a→an（article, L04）/ We was→were（sv_agreement）
    id: "hunt-photo-album",
    number: 30,
    reviewed: true,
    title: "相册里的一页",
    scene: "小美和外婆一起翻旧相册，念出照片背后的一行字",
    notes: [{ word: "Beijing", zh: "北京（地名）" }, { word: "Grandma", zh: "外婆" }],
    tokens: [
      "Summer,", "2015.",
      "This", "is", "me", "and", "Grandma.",
      "I", "have", "was", "to", "Beijing", "with", "her,",
      "and", "I", "have", "see", "the", "sea", "for", "the", "first", "time.",
      "We", "was", "so", "happy", "that", "day.",
      "On", "the", "way", "home,", "I", "ate", "a", "apple", "and", "shared", "it", "with", "her."
    ],
    errors: [
      {
        tokenIndex: 9,
        tag: "verb_form",
        original: "was",
        correction: "been",
        explanation: "be 的做过版是 been：I have been to Beijing。was 是昨天版，不能站在 have 后面。"
      },
      {
        tokenIndex: 17,
        tag: "verb_form",
        original: "see",
        correction: "seen",
        explanation: "have 后面站做过版：see 的做过版是 seen。"
      },
      {
        tokenIndex: 25,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation: "主语是 We（我们），昨天版要用 were。"
      },
      {
        tokenIndex: 36,
        tag: "article",
        original: "a",
        correction: "an",
        explanation: "apple 以元音开头，前面要穿 an：an apple。"
      }
    ]
  },
  {
    // L23 配套：新错 losed→lost（杜撰形陷阱）/ broke→broken + 旧错 in home→at home（preposition, L18）/ glasses is→are（sv_agreement）
    // 陷阱设计：句中两个 in——get in 是对的，waiting in home 是错的
    id: "hunt-lost-key",
    number: 31,
    reviewed: true,
    title: "门口的求助字条",
    scene: "邻居贴在楼门口的一张寻钥匙字条",
    notes: [{ word: "neighbors", zh: "邻居们" }, { word: "glasses", zh: "眼镜" }, { word: "handle", zh: "把手" }],
    tokens: [
      "To", "my", "neighbors:",
      "I", "have", "losed", "my", "key.",
      "Now", "I", "can't", "get", "in", "and", "I", "am", "waiting", "in", "home.",
      "My", "glasses", "is", "in", "the", "same", "bag,",
      "so", "I", "can't", "see", "clearly.",
      "I", "have", "also", "broke", "my", "phone", "screen.",
      "If", "you", "find", "my", "key,",
      "please", "put", "it", "on", "my", "door", "handle.",
      "Thank", "you!"
    ],
    errors: [
      {
        tokenIndex: 5,
        tag: "verb_form",
        original: "losed",
        correction: "lost",
        explanation: "lose 的做过版是 lost——没有 losed 这个形状。"
      },
      {
        tokenIndex: 17,
        tag: "preposition",
        original: "in",
        correction: "at",
        explanation: "「在家里」是 at home——home 是特例，前面不垫 in。（前面 get in 的 in 是对的，别看错）"
      },
      {
        tokenIndex: 21,
        tag: "sv_agreement",
        original: "is",
        correction: "are",
        explanation: "glasses（眼镜）永远是复数，要用 are。"
      },
      {
        tokenIndex: 34,
        tag: "verb_form",
        original: "broke",
        correction: "broken",
        explanation: "have 后面站做过版：break 的做过版是 broken。"
      }
    ]
  },
  {
    // L24 主配套 · 本批核心新错型：Yesterday 与做过版同台（seen→saw，tense）
    id: "hunt-diary-mix",
    number: 32,
    reviewed: true,
    title: "混了时间的日记",
    scene: "一篇把两种时间搅在一起的周记",
    notes: [{ word: "bowls", zh: "碗（bowl 的复数）" }],
    tokens: [
      "Sunday,", "sunny.",
      "Yesterday", "I", "have", "seen", "that", "film", "with", "Dad,",
      "and", "it", "was", "funny.",
      "In", "the", "afternoon", "I", "go", "to", "school", "for", "the", "art", "class.",
      "Mom", "made", "dinner,", "and", "I", "have", "eat", "two", "bowls", "of", "rice.",
      "Before", "bed,", "I", "read", "three", "book", "about", "animals."
    ],
    errors: [
      {
        tokenIndex: 5,
        tag: "tense",
        original: "seen",
        correction: "saw",
        explanation: "Yesterday 已经站在句子里，动词要用昨天版：I saw that film。做过版和具体时间点不能同台。"
      },
      {
        tokenIndex: 18,
        tag: "tense",
        original: "go",
        correction: "went",
        explanation: "下午的美术课是昨天的事，go 要换昨天版 went。"
      },
      {
        tokenIndex: 31,
        tag: "verb_form",
        original: "eat",
        correction: "eaten",
        explanation: "have 后面站做过版：eat 的做过版是 eaten。"
      },
      {
        tokenIndex: 41,
        tag: "plural",
        original: "book",
        correction: "books",
        explanation: "three 后面是可数名词复数：three books。"
      }
    ]
  },
  {
    // L24 第 2 案：新错 have did→done + 旧错 In Monday→on Monday（preposition）/ was→were（sv_agreement）/ must to go→must go（verb_form, L16）
    id: "hunt-weekend-note",
    number: 33,
    reviewed: true,
    title: "外婆的周末字条",
    scene: "外婆贴在冰箱上的周末安排便条",
    tokens: [
      "A", "note", "for", "the", "weekend:",
      "Our", "family", "have", "did", "a", "lot", "this", "weekend.",
      "In", "Monday,", "we", "cleaned", "the", "house", "together,",
      "and", "my", "little", "brother", "and", "I", "was", "tired", "but", "happy.",
      "Dad", "said", "we", "must", "to", "go", "to", "bed", "early.",
      "I", "have", "also", "done", "my", "homework,",
      "so", "tomorrow", "we", "can", "go", "to", "the", "park."
    ],
    errors: [
      {
        tokenIndex: 8,
        tag: "verb_form",
        original: "did",
        correction: "done",
        explanation: "have 后面要站做过版：do 的做过版是 done。"
      },
      {
        tokenIndex: 13,
        tag: "preposition",
        original: "In",
        correction: "On",
        explanation: "说「在星期一」用 on Monday——星期前面垫 on。"
      },
      {
        tokenIndex: 26,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation: "主语是 my little brother and I（两个人），昨天版要用 were。"
      },
      {
        tokenIndex: 34,
        tag: "verb_form",
        original: "to",
        correction: "去掉 to",
        explanation: "must 后面的动词保持原样，中间不垫 to：must go。"
      }
    ]
  },
  {
    // ── F5 第三季 · L25 三单 -s 案件（sv_agreement 主战场）──
    id: "hunt-third-person-daily",
    number: 34,
    reviewed: true,
    title: "同桌的日常记录",
    scene: "小美在笔记本上记同桌的每日习惯",
    tokens: [
      "My", "deskmate", "have", "many", "habits.",
      "He", "drink", "milk", "every", "day",
      "and", "watch", "TV", "every", "night.",
      "She", "like", "music,", "but", "he", "don't", "like", "coffee.",
      "Does", "he", "likes", "sports?", "Yes,", "he", "plays", "football", "on", "Monday."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "sv_agreement",
        original: "have",
        correction: "has",
        explanation: "My deskmate 是「他」，三单要用 has。"
      },
      {
        tokenIndex: 6,
        tag: "sv_agreement",
        original: "drink",
        correction: "drinks",
        explanation: "「他喝」是三单，动词加小尾巴 -s：drinks。"
      },
      {
        tokenIndex: 11,
        tag: "sv_agreement",
        original: "watch",
        correction: "watches",
        explanation: "watch 以 ch 结尾，三单加 es：watches。"
      },
      {
        tokenIndex: 16,
        tag: "sv_agreement",
        original: "like",
        correction: "likes",
        explanation: "「她喜欢」是三单，动词加 -s：likes。"
      },
      {
        tokenIndex: 20,
        tag: "sv_agreement",
        original: "don't",
        correction: "doesn't",
        explanation: "「他不喜欢」，帮手换三单 doesn't。"
      },
      {
        tokenIndex: 25,
        tag: "verb_form",
        original: "likes",
        correction: "like",
        explanation: "Does 一出场，动词打回原形 like——小尾巴由帮手扛。"
      }
    ]
  },
  {
    // ── F5 第三季 · L26 there be 案件 ──
    id: "hunt-there-be-room",
    number: 35,
    reviewed: true,
    title: "新房间的清单",
    scene: "小美帮妈妈列新房间里的东西",
    tokens: [
      "Look", "at", "my", "new", "room!",
      "There", "have", "a", "bed", "and", "a", "desk.",
      "There", "is", "three", "books", "on", "the", "desk,",
      "and", "there", "are", "a", "lamp", "near", "the", "window.",
      "Is", "there", "a", "chair?", "Yes,", "there", "is", "a", "blue", "chair", "in", "the", "corner."
    ],
    errors: [
      {
        tokenIndex: 6,
        tag: "missing_be",
        original: "have",
        correction: "is",
        explanation: "「某处有某物」用 There is / There are，不用 have。"
      },
      {
        tokenIndex: 13,
        tag: "sv_agreement",
        original: "is",
        correction: "are",
        explanation: "three books 是复数，用 There are。"
      },
      {
        tokenIndex: 21,
        tag: "sv_agreement",
        original: "are",
        correction: "is",
        explanation: "a lamp 是单数，用 There is。"
      }
    ]
  },
  {
    // ── F5 第三季 · L27 疑问词案件 ──
    id: "hunt-question-words",
    number: 36,
    reviewed: true,
    title: "失物招领处的问答",
    scene: "小美在失物招领处帮老师登记",
    tokens: [
      "The", "teacher", "asks:", "Where", "is", "this?",
      "A", "boy", "says:", "It", "is", "a", "blue", "bag.",
      "When", "you", "lost", "it?", "the", "teacher", "asks.",
      "How", "is", "your", "name?", "she", "asks", "too.",
      "The", "boy", "answers:", "My", "name", "is", "Tom."
    ],
    errors: [
      {
        tokenIndex: 3,
        tag: "word_order",
        original: "Where",
        correction: "What",
        explanation: "问「这是什么」用 What；Where 是问地方。"
      },
      {
        tokenIndex: 16,
        tag: "word_order",
        original: "lost",
        correction: "did you lose",
        explanation: "问过去的动作要请帮手 did：When did you lose it？动词打回原形。"
      },
      {
        tokenIndex: 21,
        tag: "word_order",
        original: "How",
        correction: "What",
        explanation: "问名字用 What（是什么）；How 是问方式或状况。"
      }
    ]
  },
  {
    // ── F5 第三季 · L28 频率副词案件 ──
    id: "hunt-frequency-habit",
    number: 37,
    reviewed: true,
    title: "习惯调查表",
    scene: "小美帮老师统计全班的习惯",
    tokens: [
      "We", "asked", "everyone", "about", "their", "habits.",
      "Lily", "go", "always", "to", "the", "library", "after", "class.",
      "Tom", "is", "never", "late,", "and", "he", "often", "play", "football.",
      "The", "girls", "are", "often", "happy", "after", "the", "game."
    ],
    errors: [
      {
        tokenIndex: 7,
        tag: "word_order",
        original: "go",
        correction: "always goes",
        explanation: "频率副词站在动词前面：always goes；三单还要加 -s。"
      },
      {
        tokenIndex: 21,
        tag: "sv_agreement",
        original: "play",
        correction: "plays",
        explanation: "he 是三单，动词加 -s：often plays。"
      }
    ]
  },
  {
    // ── F5 第三季 · L29 be going to 案件 ──
    id: "hunt-going-to-plan",
    number: 38,
    reviewed: true,
    title: "周末计划板",
    scene: "教室后墙贴着全班的周末计划",
    tokens: [
      "Our", "weekend", "plans:",
      "I", "going", "to", "visit", "my", "grandma.",
      "She", "are", "going", "to", "watch", "a", "movie.",
      "We", "am", "going", "to", "play", "football", "on", "Sunday.",
      "It", "will", "rains", "tomorrow,", "so", "bring", "an", "umbrella!"
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "missing_be",
        original: "going",
        correction: "am going",
        explanation: "be going to 里的 be 不能丢：I am going to。"
      },
      {
        tokenIndex: 10,
        tag: "sv_agreement",
        original: "are",
        correction: "is",
        explanation: "She 是单数，be 用 is：She is going to。"
      },
      {
        tokenIndex: 17,
        tag: "sv_agreement",
        original: "am",
        correction: "are",
        explanation: "We 是一伙的，be 用 are：We are going to。"
      },
      {
        tokenIndex: 26,
        tag: "verb_form",
        original: "rains",
        correction: "rain",
        explanation: "will 后面的动词穿原样：will rain——be going to 也一样后面是原形。"
      }
    ]
  },
  {
    // ── F5 第三季 · L30 some/any/much/many 案件 ──
    id: "hunt-some-any-fridge",
    number: 39,
    reviewed: true,
    title: "冰箱盘点清单",
    scene: "小美列了一张冰箱库存单",
    tokens: [
      "A", "list", "for", "the", "fridge:",
      "There", "are", "some", "milk", "in", "the", "fridge.",
      "Do", "we", "have", "some", "eggs?",
      "I", "don't", "have", "some", "juice,",
      "and", "there", "isn't", "many", "bread."
    ],
    errors: [
      {
        tokenIndex: 6,
        tag: "sv_agreement",
        original: "are",
        correction: "is",
        explanation: "milk 数不清，用 There is——数不清的东西当单数看。"
      },
      {
        tokenIndex: 15,
        tag: "article",
        original: "some",
        correction: "any",
        explanation: "疑问句里「一些」换 any：Do we have any eggs？"
      },
      {
        tokenIndex: 20,
        tag: "article",
        original: "some",
        correction: "any",
        explanation: "否定句里也用 any：don't have any juice。"
      },
      {
        tokenIndex: 25,
        tag: "article",
        original: "many",
        correction: "much",
        explanation: "bread 数不清，用 much：isn't much bread。"
      }
    ]
  },
  {
    // ── F5 第三季 · L31 最高级案件 ──
    id: "hunt-superlative-market",
    number: 40,
    reviewed: true,
    title: "水果摊的招牌",
    scene: "水果摊挂出了一块新招牌",
    tokens: [
      "Welcome", "to", "our", "shop!",
      "This", "is", "biggest", "apple", "in", "town.",
      "That", "one", "is", "the", "most", "cheapest,",
      "and", "this", "is", "the", "goodest", "orange.",
      "Our", "fruit", "is", "the", "freshest", "than", "anywhere", "else."
    ],
    errors: [
      {
        tokenIndex: 6,
        tag: "article",
        original: "biggest",
        correction: "the biggest",
        explanation: "最高级前必须站 the：the biggest。"
      },
      {
        tokenIndex: 14,
        tag: "article",
        original: "most",
        correction: "去掉 most",
        explanation: "most 和 -est 只能用一个：the cheapest。"
      },
      {
        tokenIndex: 20,
        tag: "article",
        original: "goodest",
        correction: "best",
        explanation: "good 的最高级是 best，不是 goodest——不规则要单独记。"
      },
      {
        tokenIndex: 27,
        tag: "run_on",
        original: "than",
        correction: "in",
        explanation: "最高级用 in（在……里），than 是比较级的搭档。"
      }
    ]
  },
  {
    // ── F5 第三季 · L32 祈使句案件 ──
    id: "hunt-imperative-signs",
    number: 41,
    reviewed: true,
    title: "图书馆的告示牌",
    scene: "小美看图书馆新贴的告示牌",
    tokens: [
      "Library", "rules:",
      "You", "keep", "quiet,", "please.",
      "Closing", "the", "door", "when", "you", "leave.",
      "Don't", "eating", "in", "the", "reading", "room.",
      "Returns", "your", "books", "before", "Friday."
    ],
    errors: [
      {
        tokenIndex: 2,
        tag: "word_order",
        original: "You",
        correction: "去掉 You",
        explanation: "祈使句动词直接开头，省掉 You：Keep quiet, please。"
      },
      {
        tokenIndex: 6,
        tag: "verb_form",
        original: "Closing",
        correction: "Close",
        explanation: "祈使句动词穿原样：Close the door——-ing 是进行时的打扮。"
      },
      {
        tokenIndex: 13,
        tag: "verb_form",
        original: "eating",
        correction: "eat",
        explanation: "Don't + 动词原形：Don't eat。"
      },
      {
        tokenIndex: 18,
        tag: "verb_form",
        original: "Returns",
        correction: "Return",
        explanation: "祈使句动词不加三单 -s：Return your books——没有主语就没有三单。"
      }
    ]
  },
  {
    // ── F5 第三季 · L33 指示代词案件 ──
    id: "hunt-pronoun-umbrella",
    number: 42,
    reviewed: true,
    title: "失物招领的牌子",
    scene: "下雨天，失物招领处立了块新牌子",
    tokens: [
      "Lost", "and", "Found:",
      "This", "umbrella", "is", "me.",
      "Those", "one", "is", "the", "teacher's,",
      "and", "these", "gloves", "are", "her.",
      "That", "one", "over", "there", "is", "your,"
    ],
    errors: [
      {
        tokenIndex: 6,
        tag: "missing_be",
        original: "me",
        correction: "mine",
        explanation: "「我的（东西）」是 mine；me 是「我」这个人。"
      },
      {
        tokenIndex: 8,
        tag: "sv_agreement",
        original: "one",
        correction: "ones",
        explanation: "Those 配复数：Those ones（那些个）。"
      },
      {
        tokenIndex: 9,
        tag: "sv_agreement",
        original: "is",
        correction: "are",
        explanation: "Those ones 是复数，用 are。"
      },
      {
        tokenIndex: 16,
        tag: "missing_be",
        original: "her",
        correction: "hers",
        explanation: "句尾「她的（东西）」用 hers——her 要贴在名词前面（her gloves）。"
      },
      {
        tokenIndex: 22,
        tag: "missing_be",
        original: "your",
        correction: "yours",
        explanation: "句尾「你的（东西）」用 yours。"
      }
    ]
  },
  {
    // ── F5 第三季 · L34 过去进行时案件 ──
    id: "hunt-past-rainy-day",
    number: 43,
    reviewed: true,
    title: "雨天的日记",
    scene: "小美翻开上周的日记",
    tokens: [
      "Last", "Sunday,", "it", "was", "rain", "hard.",
      "I", "was", "draw", "at", "home", "all", "afternoon.",
      "Mom", "were", "cooking", "in", "the", "kitchen,",
      "and", "my", "brother", "was", "play", "games.",
      "What", "was", "you", "doing", "then?"
    ],
    errors: [
      {
        tokenIndex: 4,
        tag: "verb_form",
        original: "rain",
        correction: "raining",
        explanation: "过去正在下雨：was raining——be 后面的动词要穿 -ing 外套。"
      },
      {
        tokenIndex: 8,
        tag: "verb_form",
        original: "draw",
        correction: "drawing",
        explanation: "was drawing——-ing 外套不能丢。"
      },
      {
        tokenIndex: 14,
        tag: "sv_agreement",
        original: "were",
        correction: "was",
        explanation: "Mom 是单数，过去版 be 用 was。"
      },
      {
        tokenIndex: 23,
        tag: "verb_form",
        original: "play",
        correction: "playing",
        explanation: "was playing——进行时的动词必须穿 -ing。"
      },
      {
        tokenIndex: 26,
        tag: "sv_agreement",
        original: "was",
        correction: "were",
        explanation: "you 的过去版 be 是 were。"
      }
    ]
  }
];
