import type { GrammarLesson } from "../types";

/**
 * 「小美的一天」· 初学者语法连续剧（12 课）。
 *
 * 设计依据（GRAMMAR_PEDAGOGY_REVIEW.md + GRAMMAR_DEPTH_PRD.md）：
 * 1. 按学习者要表达的事组织，不按语法知识组织：介绍自己 → 说别人 → 说拥有 → 说想要 →
 *    说喜欢 → 说时间 → 说我们 → 说归属 → 说去向 → 说昨天 → 数量与过去 → 说明天。
 * 2. 每课四段：看（情景讲解）→ 跟（试一试）→ 练（自己来）→ 破（侦探挑战，复习旧知识）。
 * 3. 词汇控制在核心 500 词内；am/is/are 用「固定搭档」的大白话讲，不用术语。
 * 4. 后面的课会复现前面的句子（复习伪装成剧情）。
 * 5. 每课通过 huntCaseIds 关联找错案件，学会之后才解锁对应破案挑战。
 * 6. 深度优化增量字段（全部可选）：dialogue 多句对话、contrast 正误对比、
 *    variants 三口气变体、sceneSwings 场景变奏、deepDive 深挖折叠卡、summary 完课小结；
 *    第②段末尾一道 spot 找茬题（为第④段破案做铺垫），第③段 3 题（句型 / 变体 / 场景迁移）。
 *    红线：解释话术不出现挫败性字眼；contrast 的 wrong 必须真错、correct 必须真对。
 */
export const grammarLessons: GrammarLesson[] = [
  {
    id: "lesson-01-am",
    number: 1,
    title: "我是谁",
    grammarLabel: "be 动词 · I am",
    episode: "小美的一天 ①",
    scene: "campus",
    sceneSetupZh: "新学期第一天，教室里坐满了不认识的同学。",
    dialogueEn: "Who are you?",
    dialogueZh: "旁边的同学转过头来问你。",
    intentZh: "我是小美。",
    targetSentence: "I am Xiaomei.",
    blocks: [
      { text: "I", role: "我" },
      { text: "am", role: "是（我专用）" },
      { text: "Xiaomei", role: "名字" }
    ],
    oneLineRule: "英语说「我是谁」，am 不能丢。I am 是一对固定搭档，说「我是……」它们就一起出场。",
    examples: [
      { en: "I am a student.", zh: "我是一名学生。" },
      { en: "I am happy.", zh: "我很开心。" },
      { en: "I am ready.", zh: "我准备好了。" },
      { en: "I am free on Sunday.", zh: "我周日有空。" }
    ],
    dialogue: [
      { who: "npc", en: "Hi! Who are you?", zh: "旁边的同学转过头来问你。" },
      { who: "npc", en: "Are you new here?", zh: "她又补了一句。" },
      { who: "me", en: "I am Xiaomei.", zh: "轮到你说了——你是小美。" }
    ],
    contrast: [
      {
        wrong: "I is Xiaomei.",
        wrongMark: "is",
        correct: "I am Xiaomei.",
        whyZh: "is 不是 I 的搭档。英语里谁和谁是搭档是固定的：I 只跟 am 一起出场，就像搭档不能换人。"
      },
      {
        wrong: "I Xiaomei.",
        wrongMark: null,
        correct: "I am Xiaomei.",
        whyZh: "中文说「我小美」不用动词，但英语的句子必须有动词。把 am 丢了，句子就塌了。"
      }
    ],
    variants: [
      { label: "肯定", en: "I am happy.", zh: "我很开心。" },
      { label: "否定", en: "I am not tired.", zh: "我不累。", noteZh: "在 am 后面加 not，就是「不」。am 和 not 也是固定搭档。" },
      { label: "疑问", en: "Are you new here?", zh: "你是新来的吗？", noteZh: "问别人时把 Are 搬到句首。你回答时还是用 I am。" }
    ],
    sceneSwings: [
      { sceneZh: "宿舍里，室友问你周末干嘛", en: "I am free on Sunday.", zh: "我周日有空。" },
      { sceneZh: "回家后，妈妈问你今天开心吗", en: "I am happy today.", zh: "我今天很开心。" },
      { sceneZh: "球场上，朋友喊你来玩", en: "I am ready!", zh: "我准备好了！" }
    ],
    deepDive: {
      title: "为什么 am 只跟 I？is 和 are 呢？",
      paragraphs: [
        "英语的 be 动词有三个搭档，各管一摊：I 专用 am；他、她、它和一个东西用 is；你、我们、他们和两个以上的东西用 are。",
        "下一课你会见到 is 和 are。现在只要记住：说「我」的时候，am 永远在场。这张搭档总表在第 2 课的深挖卡里会完整给出。"
      ]
    },
    summary: {
      rule: "I am 是一对固定搭档：说「我是……」它们一起出场。",
      points: [
        "I am not tired. —— 不累：am 后面加 not",
        "Are you new here? —— 问对方：Are 搬到句首",
        "I is ❌ → I am ✅：I 的搭档不能换人"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我很开心。",
        before: "I",
        after: "happy.",
        options: ["am", "is", "are"],
        answer: "am",
        explain: "主语是 I 的时候，搭档永远是 am。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我是一名学生。",
        tokens: ["I", "am", "a", "student."],
        answer: "I am a student.",
        explain: "I am 开头，a student 是「一名学生」。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我是小明。",
        tokens: ["am", "Xiaoming.", "I"],
        answer: "I am Xiaoming.",
        explain: "顺序永远是 I 在最前面：I am + 名字。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "is", "Xiaomei."],
        wrongToken: "is",
        answer: "is",
        correctionZh: "把 is 换成 am：I am Xiaomei。",
        explain: "I 的搭档永远是 am；is 是他、她专用的搭档。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我很累。",
        tokens: ["I", "am", "tired."],
        answer: "I am tired."
      },
      {
        promptZh: "你想说：我是一名老师。",
        tokens: ["teacher.", "a", "I", "am"],
        answer: "I am a teacher."
      },
      {
        promptZh: "食堂阿姨问你饿不饿，你想说：我很饿。",
        tokens: ["hungry.", "am", "I"],
        answer: "I am hungry."
      }
    ],
    huntCaseIds: ["hunt-call-mother"]
  },
  {
    id: "lesson-02-is",
    number: 2,
    title: "你是谁，他是谁",
    grammarLabel: "be 动词 · you are / he is",
    episode: "小美的一天 ②",
    scene: "campus",
    sceneSetupZh: "小美开始认识班里的同学，也第一次见到老师的家人。",
    dialogueEn: "Who is that boy?",
    dialogueZh: "有同学指着一个男生问。",
    intentZh: "他是我的哥哥。",
    targetSentence: "He is my brother.",
    blocks: [
      { text: "He", role: "他" },
      { text: "is", role: "是（他 / 她专用）" },
      { text: "my", role: "我的" },
      { text: "brother", role: "哥哥" }
    ],
    oneLineRule: "说别人要用别的搭档：You are、He is、She is。am 只跟 I 走，谁都不借。",
    examples: [
      { en: "You are my friend.", zh: "你是我的朋友。" },
      { en: "She is a nurse.", zh: "她是一名护士。" },
      { en: "He is tall.", zh: "他个子高。" },
      { en: "Is she your teacher?", zh: "她是你的老师吗？" }
    ],
    dialogue: [
      { who: "npc", en: "Who is that boy?", zh: "有同学指着一个男生问。" },
      { who: "npc", en: "Is he your classmate?", zh: "她又追问了一句。" },
      { who: "me", en: "He is my brother.", zh: "轮到你说了——他是小美的哥哥。" }
    ],
    contrast: [
      {
        wrong: "You is my friend.",
        wrongMark: "is",
        correct: "You are my friend.",
        whyZh: "You 的搭档是 are，不是 is。is 只管他、她、它一个。"
      },
      {
        wrong: "She am a nurse.",
        wrongMark: "am",
        correct: "She is a nurse.",
        whyZh: "am 只跟 I 走，谁都不借。She 的搭档是 is。"
      }
    ],
    variants: [
      { label: "肯定", en: "He is my brother.", zh: "他是我的哥哥。" },
      { label: "否定", en: "She is not a nurse.", zh: "她不是护士。", noteZh: "在 is 后面加 not，就是「不是」。" },
      { label: "疑问", en: "Is he your classmate?", zh: "他是你的同学吗？", noteZh: "问别人时把 Is 搬到句首。回答还是 He is。" }
    ],
    sceneSwings: [
      { sceneZh: "教室里，老师点名认识新同学", en: "You are Lin Tao.", zh: "你是林涛。" },
      { sceneZh: "照片前，小美指给朋友看家人", en: "She is my mother.", zh: "她是我的妈妈。" },
      { sceneZh: "操场边，同学问那个高个子是谁", en: "He is my teacher.", zh: "他是我的老师。" }
    ],
    deepDive: {
      title: "am、is、are 三个搭档，怎么选？",
      paragraphs: [
        "一张总表：I 专用 am；他（he）、她（she）、它（it）和一个东西用 is；你（you）、我们（we）、他们（they）和两个以上的东西用 are。",
        "一个小窍门：am 是贴身搭档，只跟 I 出场；is 管「一个人 / 一个东西」；are 管「一伙人 / 两个以上」。遇到谁，先看他是单枪匹马还是一伙的。",
        "第 7 课会再见到 are，管一整队人。这张表可以先存着，忘了随时回来翻。"
      ]
    },
    summary: {
      rule: "说别人要换搭档：You are、He is、She is。",
      points: [
        "He is my brother. —— 他（单个）用 is",
        "She is not a nurse. —— 不是：is 后面加 not",
        "Is he your classmate? —— 问对方：Is 搬到句首"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：她是一名护士。",
        before: "She",
        after: "a nurse.",
        options: ["is", "am", "are"],
        answer: "is",
        explain: "She 的搭档是 is。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：你是我的朋友。",
        tokens: ["You", "are", "my", "friend."],
        answer: "You are my friend.",
        explain: "You 的搭档是 are。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：他是我的哥哥。",
        tokens: ["my", "He", "brother.", "is"],
        answer: "He is my brother.",
        explain: "He is 开头，my brother 是「我的哥哥」。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["She", "am", "a", "nurse."],
        wrongToken: "am",
        answer: "am",
        correctionZh: "把 am 换成 is：She is a nurse。",
        explain: "am 只跟 I 走，She 的搭档是 is。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：你是林涛。",
        tokens: ["are", "Lin", "You", "Tao."],
        answer: "You are Lin Tao."
      },
      {
        promptZh: "你想说：她是我的老师。",
        tokens: ["She", "my", "is", "teacher."],
        answer: "She is my teacher."
      },
      {
        promptZh: "运动会上，你想说：他们很强。",
        tokens: ["strong.", "They", "are"],
        answer: "They are strong."
      }
    ],
    huntCaseIds: []
  },
  {
    id: "lesson-03-have",
    number: 3,
    title: "我有一个背包",
    grammarLabel: "have + a",
    episode: "小美的一天 ③",
    scene: "campus",
    sceneSetupZh: "课间，同桌盯着小美的新书包看。",
    dialogueEn: "Nice bag!",
    dialogueZh: "同桌夸了一句。",
    intentZh: "我有一个新背包。",
    targetSentence: "I have a new bag.",
    blocks: [
      { text: "I", role: "我" },
      { text: "have", role: "有" },
      { text: "a", role: "一个" },
      { text: "new bag", role: "新背包" }
    ],
    oneLineRule: "说「我有什么」用 have。一个可数的东西前面要有 a，不能光着出现。",
    examples: [
      { en: "I have a pen.", zh: "我有一支钢笔。" },
      { en: "I have a dream.", zh: "我有一个梦想。" },
      { en: "I have a big bag.", zh: "我有一个大背包。" },
      { en: "I have two pens.", zh: "我有两支钢笔。" }
    ],
    dialogue: [
      { who: "npc", en: "Nice bag!", zh: "同桌夸了一句。" },
      { who: "npc", en: "Is it new?", zh: "她又问：是新买的吗？" },
      { who: "me", en: "I have a new bag.", zh: "轮到你说了——我有一个新背包。" }
    ],
    contrast: [
      {
        wrong: "I have pen.",
        wrongMark: "pen",
        correct: "I have a pen.",
        whyZh: "一个可数的东西不能光着出现，前面要给它配一个 a，就像先报数再出场。"
      },
      {
        wrong: "She have a cat.",
        wrongMark: "have",
        correct: "She has a cat.",
        whyZh: "说「她有什么」，have 要换成 has。has 是他、她专用的搭档。"
      }
    ],
    variants: [
      { label: "肯定", en: "I have a new bag.", zh: "我有一个新背包。" },
      { label: "否定", en: "I don't have a pen.", zh: "我没有钢笔。", noteZh: "没有 = don't have。don't 是 do not 的缩写，先混个脸熟。" },
      { label: "疑问", en: "Do you have a pen?", zh: "你有钢笔吗？", noteZh: "把 Do 搬到句首，就是问「有没有」。" }
    ],
    sceneSwings: [
      { sceneZh: "文具店里，你指着货架说", en: "I have a new pen.", zh: "我有一支新钢笔。" },
      { sceneZh: "宠物店门口，同学问你养没养宠物", en: "I have a cat.", zh: "我有一只猫。" },
      { sceneZh: "收拾书包时，你发现自己没带尺子", en: "I don't have a ruler.", zh: "我没有尺子。" }
    ],
    deepDive: {
      title: "为什么东西前面要有 a？",
      paragraphs: [
        "英语数东西数得很认真：一个就是一个 a，两个以上要加 s。a 就像给东西发的小号码牌，光着出现会显得「没报数」。",
        "有些东西数不清，比如水、空气，它们前面就不用 a。现在先记住：能一个一个数的东西，前面要有 a。",
        "第 4 课的 a 和 an 是一对兄弟：元音开头的词要换 an。下节课见。"
      ]
    },
    summary: {
      rule: "说「我有什么」用 have；一个可数的东西前面要有 a。",
      points: [
        "I have a new bag. —— have + a + 东西",
        "I don't have a pen. —— 没有：don't have",
        "She has a cat. —— 她专用的 has"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我有一支钢笔。",
        before: "I",
        after: "a pen.",
        options: ["have", "has", "am"],
        answer: "have",
        explain: "「我有什么」固定用 have。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我有一本书。",
        tokens: ["I", "have", "a", "book."],
        answer: "I have a book.",
        explain: "have 后面先说 a，再说东西。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我有一个大背包。",
        tokens: ["a", "bag.", "I", "have", "big"],
        answer: "I have a big bag.",
        explain: "形容词要放在东西前面：a big bag。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["She", "have", "a", "cat."],
        wrongToken: "have",
        answer: "have",
        correctionZh: "把 have 换成 has：She has a cat。",
        explain: "他、她专用 has；我、你、我们用 have。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我有一个梦想。",
        tokens: ["dream.", "a", "I", "have"],
        answer: "I have a dream."
      },
      {
        promptZh: "你想说：我有一个红色的杯子。",
        tokens: ["cup.", "have", "red", "I", "a"],
        answer: "I have a red cup."
      },
      {
        promptZh: "自行车棚前，你想说：我有一辆新自行车。",
        tokens: ["bike.", "a", "I", "new", "have"],
        answer: "I have a new bike."
      }
    ],
    huntCaseIds: []
  },
  {
    id: "lesson-04-want",
    number: 4,
    title: "我想要一杯奶茶",
    grammarLabel: "want + a / an",
    episode: "小美的一天 ④",
    scene: "city",
    sceneSetupZh: "放学路上，小美和同学拐进一家奶茶店。",
    dialogueEn: "What would you like?",
    dialogueZh: "店员笑着问你们想要什么。",
    intentZh: "我想要一杯奶茶。",
    targetSentence: "I want a milk tea.",
    blocks: [
      { text: "I", role: "我" },
      { text: "want", role: "想要" },
      { text: "a", role: "一杯" },
      { text: "milk tea", role: "奶茶" }
    ],
    oneLineRule: "想要什么就说 I want…。a 和 an 像「一个」：普通词前面用 a，apple、egg 这种元音开头的词前面用 an。",
    examples: [
      { en: "I want an apple.", zh: "我想要一个苹果。" },
      { en: "I want a book.", zh: "我想要一本书。" },
      { en: "I want a ruler.", zh: "我想要一把尺子。" },
      { en: "I want an egg.", zh: "我想要一个鸡蛋。" }
    ],
    dialogue: [
      { who: "npc", en: "What would you like?", zh: "店员笑着问你们想要什么。" },
      { who: "npc", en: "The milk tea is good!", zh: "同桌推荐说：奶茶很好喝！" },
      { who: "me", en: "I want a milk tea.", zh: "轮到你说了——我想要一杯奶茶。" }
    ],
    contrast: [
      {
        wrong: "I want a apple.",
        wrongMark: "a",
        correct: "I want an apple.",
        whyZh: "apple 第一个音是元音，a 和它连读会拗口，要换穿 an 才顺口。"
      },
      {
        wrong: "I want an book.",
        wrongMark: "an",
        correct: "I want a book.",
        whyZh: "book 以辅音开头，配 a 才顺。an 只给元音开头的词穿。"
      }
    ],
    variants: [
      { label: "肯定", en: "I want a milk tea.", zh: "我想要一杯奶茶。" },
      { label: "否定", en: "I don't want an egg.", zh: "我不想要鸡蛋。", noteZh: "不想要 = don't want。" },
      { label: "疑问", en: "Do you want a book?", zh: "你想要一本书吗？", noteZh: "把 Do 搬到句首，就是问「要不要」。" }
    ],
    sceneSwings: [
      { sceneZh: "水果店里，你指着一筐橘子", en: "I want an orange.", zh: "我想要一个橘子。" },
      { sceneZh: "文具店，你想买一把尺子", en: "I want a ruler.", zh: "我想要一把尺子。" },
      { sceneZh: "午餐时间，同学问你吃不吃汉堡", en: "I don't want a hamburger.", zh: "我不想吃汉堡。" }
    ],
    deepDive: {
      title: "an hour？h 不是辅音吗？",
      paragraphs: [
        "真正的规则是：看发音，不看字母。用 a 还是 an，取决于这个词读出来时第一个「音」是元音还是辅音。",
        "hour（小时）的 h 不发音，读出来第一个音是元音，所以是 an hour；university 的 u 读出来像「you」，第一个音是辅音，所以是 a university。",
        "还有一位 the（就是那个）：大家都心知肚明的东西前面用它，比如 the library、the sun。第 9 课会专门讲 the。第④段的 an hour 案件，正好可以试试今天这条完整的规则。"
      ]
    },
    summary: {
      rule: "想要什么就说 I want…；a 和 an 看发音选：元音开头的词用 an。",
      points: [
        "I want an apple. —— 元音开头用 an",
        "I want a book. —— 辅音开头用 a",
        "an hour —— h 不发音，看发音不看字母"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我想要一个苹果。",
        before: "I want",
        after: "apple.",
        options: ["a", "an", "the"],
        answer: "an",
        explain: "apple 以元音开头，前面用 an，读起来才不拗口。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我想要一本书。",
        tokens: ["I", "want", "a", "book."],
        answer: "I want a book.",
        explain: "book 以辅音开头，用 a。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我想要一杯奶茶。",
        tokens: ["milk", "I", "a", "want", "tea."],
        answer: "I want a milk tea.",
        explain: "I want 开头，a milk tea 是「一杯奶茶」。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "want", "a", "apple."],
        wrongToken: "a",
        answer: "a",
        correctionZh: "把 a 换成 an：I want an apple。",
        explain: "apple 元音开头，要用 an。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我想要一个鸡蛋。",
        tokens: ["egg.", "an", "I", "want"],
        answer: "I want an egg."
      },
      {
        promptZh: "你想说：我想要一把伞。",
        tokens: ["umbrella.", "want", "I", "an"],
        answer: "I want an umbrella."
      },
      {
        promptZh: "蛋糕店里，你想说：我想要一块橡皮。",
        tokens: ["eraser.", "want", "I", "an"],
        answer: "I want an eraser."
      }
    ],
    huntCaseIds: ["hunt-new-phone"]
  },
  {
    id: "lesson-05-like",
    number: 5,
    title: "我喜欢音乐",
    grammarLabel: "like + 名词",
    episode: "小美的一天 ⑤",
    scene: "sparkle",
    sceneSetupZh: "周末，小美戴着耳机在房间里听歌。",
    dialogueEn: "What do you like?",
    dialogueZh: "好朋友问她平时喜欢什么。",
    intentZh: "我喜欢音乐。",
    targetSentence: "I like music.",
    blocks: [
      { text: "I", role: "我" },
      { text: "like", role: "喜欢" },
      { text: "music", role: "音乐" }
    ],
    oneLineRule: "喜欢一整类东西时，直接说名字，不加 a 也不加 s：I like music。喜欢很多只狗这种「复数」，才用 dogs。",
    examples: [
      { en: "I like tea.", zh: "我喜欢茶。" },
      { en: "I like dogs.", zh: "我喜欢狗。" },
      { en: "I like spring.", zh: "我喜欢春天。" },
      { en: "I like reading.", zh: "我喜欢读书。" }
    ],
    dialogue: [
      { who: "npc", en: "What do you like?", zh: "好朋友问她平时喜欢什么。" },
      { who: "npc", en: "Do you like sports?", zh: "好朋友又问：喜欢运动吗？" },
      { who: "me", en: "I like music.", zh: "轮到你说了——我喜欢音乐。" }
    ],
    contrast: [
      {
        wrong: "I like dog.",
        wrongMark: "dog",
        correct: "I like dogs.",
        whyZh: "喜欢「狗」这一整类，可数名词要变成复数 dogs。单数 a dog 就变成特指那一只了。"
      },
      {
        wrong: "I like a music.",
        wrongMark: "a",
        correct: "I like music.",
        whyZh: "music 这类词数不清，前面不加 a，直接跟在 like 后面。"
      }
    ],
    variants: [
      { label: "肯定", en: "I like music.", zh: "我喜欢音乐。" },
      { label: "否定", en: "I don't like coffee.", zh: "我不喜欢咖啡。", noteZh: "不喜欢 = don't like。" },
      { label: "疑问", en: "Do you like music?", zh: "你喜欢音乐吗？", noteZh: "把 Do 搬到句首，就是问「喜欢吗」。" }
    ],
    sceneSwings: [
      { sceneZh: "小吃街，朋友问你喝什么", en: "I like tea.", zh: "我喜欢茶。" },
      { sceneZh: "动物园门口，你说起最爱的动物", en: "I like cats.", zh: "我喜欢猫。" },
      { sceneZh: "食堂里挑菜", en: "I don't like onions.", zh: "我不喜欢洋葱。" }
    ],
    deepDive: {
      title: "为什么喜欢一整类，词要变样子？",
      paragraphs: [
        "说「我喜欢狗」，意思是喜欢所有的狗，不是哪一只，所以 dog 要变成复数 dogs，表示「狗这一类」。",
        "但 music、tea 这样的词数不清，没有复数形状，直接跟在 like 后面就行。",
        "一个小结：可数的一类 → 加 s；数不清的 → 原样。"
      ]
    },
    summary: {
      rule: "喜欢一整类东西：可数的变复数（dogs），数不清的原样（music）。",
      points: [
        "I like music. —— 数不清的词原样",
        "I like dogs. —— 一整类可数加 s",
        "Do you like tea? —— 问对方：Do 搬到句首"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我喜欢狗（泛指狗这种动物）。",
        before: "I like",
        after: ".",
        options: ["dog", "dogs", "a dog"],
        answer: "dogs",
        explain: "喜欢的是「狗」这一整类，用复数 dogs。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我喜欢茶。",
        tokens: ["I", "like", "tea."],
        answer: "I like tea.",
        explain: "tea 这类词没有复数，直接跟在 like 后面。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我喜欢猫。",
        tokens: ["cats.", "I", "like"],
        answer: "I like cats.",
        explain: "同 dogs 一样，一整类用复数。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "like", "a", "music."],
        wrongToken: "a",
        answer: "a",
        correctionZh: "把 a 去掉：I like music。",
        explain: "music 数不清，前面不加 a。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我喜欢读书。",
        tokens: ["reading.", "I", "like"],
        answer: "I like reading."
      },
      {
        promptZh: "你想说：我喜欢春天。",
        tokens: ["I", "spring.", "like"],
        answer: "I like spring."
      },
      {
        promptZh: "运动会上，你想说：我喜欢篮球。",
        tokens: ["I", "like", "basketball."],
        answer: "I like basketball."
      }
    ],
    huntCaseIds: []
  },
  {
    id: "lesson-06-it",
    number: 6,
    title: "现在几点了",
    grammarLabel: "It is · 时间与天气",
    episode: "小美的一天 ⑥",
    scene: "city",
    sceneSetupZh: "小美抬头看街口的大钟，想确认时间。",
    dialogueEn: "What time is it?",
    dialogueZh: "她小声问自己。",
    intentZh: "现在是三点。",
    targetSentence: "It is three o'clock.",
    blocks: [
      { text: "It", role: "它（时间专用）" },
      { text: "is", role: "是" },
      { text: "three", role: "三" },
      { text: "o'clock", role: "点钟" }
    ],
    oneLineRule: "说时间和天气，主语用 It：It is…。它不指任何东西，只是占个位子。",
    examples: [
      { en: "It is cold.", zh: "天气很冷。" },
      { en: "It is Monday.", zh: "今天是星期一。" },
      { en: "It is sunny.", zh: "今天天晴。" },
      { en: "It is Friday.", zh: "今天是星期五。" }
    ],
    dialogue: [
      { who: "npc", en: "What time is it?", zh: "同桌小声问她。" },
      { who: "npc", en: "The class starts at nine.", zh: "同桌看了看课程表：九点开始上课。" },
      { who: "me", en: "It is three o'clock.", zh: "轮到你说了——现在是三点。" }
    ],
    contrast: [
      {
        wrong: "It are cold.",
        wrongMark: "are",
        correct: "It is cold.",
        whyZh: "It 的搭档是 is。天气和时间都用 It is 开头。"
      },
      {
        wrong: "It three o'clock.",
        wrongMark: null,
        correct: "It is three o'clock.",
        whyZh: "缺了 is，句子就塌了。It 后面要跟上它的搭档 is。"
      }
    ],
    variants: [
      { label: "肯定", en: "It is cold today.", zh: "今天很冷。" },
      { label: "否定", en: "It is not hot.", zh: "天气不热。", noteZh: "在 is 后面加 not，就是「不」。" },
      { label: "疑问", en: "Is it cold today?", zh: "今天冷吗？", noteZh: "把 Is 搬到句首。" }
    ],
    sceneSwings: [
      { sceneZh: "早上出门前看天气", en: "It is sunny.", zh: "今天天晴。" },
      { sceneZh: "朋友问你星期几", en: "It is Friday.", zh: "今天是星期五。" },
      { sceneZh: "半夜写作业看表", en: "It is ten o'clock.", zh: "现在是十点。" }
    ],
    deepDive: {
      title: "It 明明是「它」，怎么变成时间和天气了？",
      paragraphs: [
        "英语的句子必须有主语。但「时间」和「天气」没有脸、没有手，找不到谁来当主语，就请 It 来占个位子。",
        "所以 It is cold（天冷）、It is nine o'clock（九点）里的 It 不指任何东西，只是一把「占位小凳子」。",
        "下回听到别人说 It is…，先想一想：说的是时间、天气，还是真的某个东西。"
      ]
    },
    summary: {
      rule: "说时间和天气，主语用占位小凳子 It：It is…",
      points: [
        "It is cold. —— 天气",
        "It is nine o'clock. —— 时间",
        "Is it cold? —— 问天气：Is 搬到句首"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：今天很冷。",
        before: "",
        after: "cold today.",
        options: ["It is", "It are", "He is"],
        answer: "It is",
        explain: "天气用 It is 开头，不用 He，也不用 are。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：今天是星期一。",
        tokens: ["It", "is", "Monday."],
        answer: "It is Monday.",
        explain: "It is + 星期。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：现在是三点。",
        tokens: ["three", "It", "o'clock.", "is"],
        answer: "It is three o'clock.",
        explain: "It is + 数字 + o'clock。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["It", "are", "Friday."],
        wrongToken: "are",
        answer: "are",
        correctionZh: "把 are 换成 is：It is Friday。",
        explain: "It 的搭档是 is。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：现在是七点。",
        tokens: ["seven", "It", "o'clock.", "is"],
        answer: "It is seven o'clock."
      },
      {
        promptZh: "你想说：今天很热。",
        tokens: ["hot.", "It", "is"],
        answer: "It is hot."
      },
      {
        promptZh: "翻日历时，你想说：今天是星期天。",
        tokens: ["It", "is", "Sunday."],
        answer: "It is Sunday."
      }
    ],
    huntCaseIds: []
  },
  {
    id: "lesson-07-we",
    number: 7,
    title: "我们很开心",
    grammarLabel: "be 动词 · we are / they are",
    episode: "小美的一天 ⑦",
    scene: "island",
    sceneSetupZh: "班级春游，大家站在海边拍照。",
    dialogueEn: "Are you happy?",
    dialogueZh: "班长举起相机问大家。",
    intentZh: "我们很开心。",
    targetSentence: "We are happy.",
    blocks: [
      { text: "We", role: "我们" },
      { text: "are", role: "是（复数搭档）" },
      { text: "happy", role: "开心" }
    ],
    oneLineRule: "你们、我们、他们都是「一伙的」，搭档都用 are：You are、We are、They are。",
    examples: [
      { en: "They are students.", zh: "他们是学生。" },
      { en: "We are ready.", zh: "我们准备好了。" },
      { en: "We are classmates.", zh: "我们是同学。" },
      { en: "They are busy.", zh: "他们很忙。" }
    ],
    dialogue: [
      { who: "npc", en: "Are you happy?", zh: "班长举起相机问大家。" },
      { who: "npc", en: "Say cheese!", zh: "班长喊：说 cheese！" },
      { who: "me", en: "We are happy.", zh: "轮到你说了——我们很开心。" }
    ],
    contrast: [
      {
        wrong: "We is happy.",
        wrongMark: "is",
        correct: "We are happy.",
        whyZh: "We 是一伙的，搭档是 are；is 只管一个人。"
      },
      {
        wrong: "They are student.",
        wrongMark: "student",
        correct: "They are students.",
        whyZh: "They 指两个以上的人，student 要加 s 变 students。"
      }
    ],
    variants: [
      { label: "肯定", en: "We are happy.", zh: "我们很开心。" },
      { label: "否定", en: "They are not busy.", zh: "他们不忙。", noteZh: "在 are 后面加 not。" },
      { label: "疑问", en: "Are they students?", zh: "他们是学生吗？", noteZh: "把 Are 搬到句首。" }
    ],
    sceneSwings: [
      { sceneZh: "拔河比赛前，队长给大家打气", en: "We are ready!", zh: "我们准备好了！" },
      { sceneZh: "毕业照上，你指着同学们", en: "They are my classmates.", zh: "他们是我的同学。" },
      { sceneZh: "妈妈打电话问春游累不累", en: "We are not tired.", zh: "我们不累。" }
    ],
    deepDive: {
      title: "为什么「一伙人」都用 are？",
      paragraphs: [
        "数一数就明白：am 管 1 个（I），is 管他、她、它这 1 个，are 管你 + 我 = 我们、他 + 她 = 他们，2 个以上都归 are。",
        "you 好玩的地方：你 1 个人也用 are（You are），因为 you 这个词天生就有「对着一群人说话」的气质。",
        "am、is、are 的完整总表在第 2 课的深挖卡里，忘了可以回去翻。"
      ]
    },
    summary: {
      rule: "你们、我们、他们都是一伙的，搭档都用 are。",
      points: [
        "We are happy. —— 我们用 are",
        "They are not busy. —— 不是：are 后面加 not",
        "Are they students? —— 问别人：Are 搬到句首"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：他们是学生。",
        before: "They",
        after: "students.",
        options: ["are", "is", "am"],
        answer: "are",
        explain: "They 是复数，搭档是 are。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我们准备好了。",
        tokens: ["We", "are", "ready."],
        answer: "We are ready.",
        explain: "We are 开头。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我们今天很开心。",
        tokens: ["today.", "happy", "We", "are"],
        answer: "We are happy today.",
        explain: "时间词 today 放在句子最后。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["We", "is", "classmates."],
        wrongToken: "is",
        answer: "is",
        correctionZh: "把 is 换成 are：We are classmates。",
        explain: "一伙人（We / They）的搭档是 are。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我们是同学。",
        tokens: ["We", "classmates.", "are"],
        answer: "We are classmates."
      },
      {
        promptZh: "你想说：他们很忙。",
        tokens: ["busy.", "They", "are"],
        answer: "They are busy."
      },
      {
        promptZh: "合唱比赛后，你想说：我们很棒。",
        tokens: ["great.", "We", "are"],
        answer: "We are great."
      }
    ],
    huntCaseIds: ["hunt-moving-day"]
  },
  {
    id: "lesson-08-my",
    number: 8,
    title: "她是我的朋友",
    grammarLabel: "物主词 my / her",
    episode: "小美的一天 ⑧",
    scene: "train",
    sceneSetupZh: "小美和朋友坐火车去邻市看展览。",
    dialogueEn: "Is she your friend?",
    dialogueZh: "邻座的人好奇地问。",
    intentZh: "她是我的朋友。",
    targetSentence: "She is my friend.",
    blocks: [
      { text: "She", role: "她" },
      { text: "is", role: "是" },
      { text: "my", role: "我的" },
      { text: "friend", role: "朋友" }
    ],
    oneLineRule: "my / your / his / her 是小标签，永远贴在东西或人的前面：my friend、his bag。",
    examples: [
      { en: "This is my book.", zh: "这是我的书。" },
      { en: "His name is Lin Tao.", zh: "他的名字叫林涛。" },
      { en: "This is her cup.", zh: "这是她的杯子。" },
      { en: "He is my classmate.", zh: "他是我的同学。" }
    ],
    dialogue: [
      { who: "npc", en: "Is she your friend?", zh: "邻座的人好奇地问。" },
      { who: "npc", en: "What is her name?", zh: "他又问：她叫什么名字？" },
      { who: "me", en: "She is my friend.", zh: "轮到你说了——她是我的朋友。" }
    ],
    contrast: [
      {
        wrong: "This is I book.",
        wrongMark: "I",
        correct: "This is my book.",
        whyZh: "「我的」要用小标签 my。I 只能当句子的主角，不能贴在东西前面。"
      },
      {
        wrong: "Her is my friend.",
        wrongMark: "Her",
        correct: "She is my friend.",
        whyZh: "当「她」是主角时要用 She；her 是贴在东西前面的标签，只说「她的……」。"
      }
    ],
    variants: [
      { label: "肯定", en: "She is my friend.", zh: "她是我的朋友。" },
      { label: "否定", en: "This is not my book.", zh: "这不是我的书。", noteZh: "在 is 后面加 not。" },
      { label: "疑问", en: "Is this your book?", zh: "这是你的书吗？", noteZh: "把 Is 搬到句首。" }
    ],
    sceneSwings: [
      { sceneZh: "火车上，你介绍同行的朋友", en: "This is my friend.", zh: "这是我的朋友。" },
      { sceneZh: "教室里捡到一支钢笔", en: "Is this your pen?", zh: "这是你的钢笔吗？" },
      { sceneZh: "帮妈妈拿包", en: "This is her bag.", zh: "这是她的包。" }
    ],
    deepDive: {
      title: "my 和 I 明明都是「我」，为什么不能混用？",
      paragraphs: [
        "I 是「主角位」：动作和状态都从它出发（I am happy）。my 是「标签位」：贴在东西前面，只回答「这是谁的」。",
        "同一套标签还有 your（你的）、his（他的）、her（她的）。第 2 课的 he / she 管主角位，他们的标签位就是 his / her。",
        "记法：主角位站在句子开头或动词前面，标签位永远贴着东西走。"
      ]
    },
    summary: {
      rule: "my / your / his / her 是小标签，永远贴在东西或人的前面。",
      points: [
        "This is my book. —— 我的书",
        "Is this your pen? —— 问别人：Is 搬到句首",
        "She is my friend. —— 主角用 She，标签用 my"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：这是我的书。",
        before: "This is",
        after: "book.",
        options: ["my", "me", "I"],
        answer: "my",
        explain: "「我的」要贴在 book 前面，用 my。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：她是我的朋友。",
        tokens: ["She", "is", "my", "friend."],
        answer: "She is my friend.",
        explain: "She is 开头，my friend 收尾。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：她的包是新的。",
        tokens: ["bag", "Her", "is", "new."],
        answer: "Her bag is new.",
        explain: "her 贴在 bag 前面：她的包。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["This", "is", "I", "book."],
        wrongToken: "I",
        answer: "I",
        correctionZh: "把 I 换成 my：This is my book。",
        explain: "贴在东西前面的「我的」要用小标签 my。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：他是我的同学。",
        tokens: ["my", "He", "is", "classmate."],
        answer: "He is my classmate."
      },
      {
        promptZh: "你想说：这是她的杯子。",
        tokens: ["her", "This", "cup.", "is"],
        answer: "This is her cup."
      },
      {
        promptZh: "失物招领处，你想说：这是他的帽子。",
        tokens: ["hat.", "This", "his", "is"],
        answer: "This is his hat."
      }
    ],
    huntCaseIds: []
  },
  {
    id: "lesson-09-go",
    number: 9,
    title: "放学去图书馆",
    grammarLabel: "go to + 地点",
    episode: "小美的一天 ⑨",
    scene: "campus",
    sceneSetupZh: "下午最后一节课结束，小美收拾书包准备去图书馆写作业。",
    dialogueEn: "Where are you going?",
    dialogueZh: "同桌问她去哪。",
    intentZh: "我去图书馆。",
    targetSentence: "I go to the library.",
    blocks: [
      { text: "I", role: "我" },
      { text: "go", role: "去" },
      { text: "to", role: "到" },
      { text: "the library", role: "那个图书馆" }
    ],
    oneLineRule: "去什么地方用 go to。去「那个」大家都知道的地方，前面加 the：the library、the park。",
    examples: [
      { en: "I go to school.", zh: "我去上学。" },
      { en: "I go to the park.", zh: "我去公园。" },
      { en: "I go to the shop.", zh: "我去商店。" },
      { en: "I go home after school.", zh: "放学后我回家。" }
    ],
    dialogue: [
      { who: "npc", en: "Where are you going?", zh: "同桌问她去哪。" },
      { who: "npc", en: "Can I come with you?", zh: "同桌又问：能跟你一起去吗？" },
      { who: "me", en: "I go to the library.", zh: "轮到你说了——我去图书馆。" }
    ],
    contrast: [
      {
        wrong: "I go school.",
        wrongMark: "school",
        correct: "I go to school.",
        whyZh: "「去哪里」中间要垫一个 to，像铺一块小踏板，脚步才迈得过去。"
      },
      {
        wrong: "I go to home.",
        wrongMark: "to",
        correct: "I go home.",
        whyZh: "home 是特例：go home 本身就是「到家」，前面不用垫 to。规则有边界，特例单独记。"
      }
    ],
    variants: [
      { label: "肯定", en: "I go to the library.", zh: "我去图书馆。" },
      { label: "否定", en: "I don't go to the park.", zh: "我不去公园。", noteZh: "不去 = don't go。" },
      { label: "疑问", en: "Do you go to the library?", zh: "你去图书馆吗？", noteZh: "把 Do 搬到句首。" }
    ],
    sceneSwings: [
      { sceneZh: "周末早上，你跟妈妈说出门", en: "I go to the shop.", zh: "我去商店。" },
      { sceneZh: "放学铃响，你收书包", en: "I go home.", zh: "我回家。" },
      { sceneZh: "同学约你打球", en: "I go to the park every day.", zh: "我每天去公园。" }
    ],
    deepDive: {
      title: "为什么 go to school 不加 the，go to the park 要加？",
      paragraphs: [
        "go to school 说的不是那栋楼，而是「上学」这件事——就像 go to bed 是「睡觉」，不是走向那张床。这类词组把 school 当一件事，不加 the。",
        "the library、the park 说的是「大家都知道的那个地方」，是具体的一个地点，所以要加 the。",
        "判断小窍门：想「事」就不加（school, home, bed），想「那个地方」就加 the（the library, the shop）。"
      ]
    },
    summary: {
      rule: "去什么地方用 go to；家是特例：go home 不加 to。",
      points: [
        "I go to the library. —— 去 + to + 地方",
        "I go home. —— home 特例，不加 to",
        "Do you go to school? —— 问别人：Do 搬到句首"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我每天去上学。",
        before: "I go",
        after: "school every day.",
        options: ["to", "at", "in"],
        answer: "to",
        explain: "去哪里，中间要垫一个 to。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我去公园。",
        tokens: ["I", "go", "to", "the", "park."],
        answer: "I go to the park.",
        explain: "go to the park，一个词都不能少。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：放学后我去图书馆。",
        tokens: ["after", "I", "the", "school.", "go", "to", "library"],
        answer: "I go to the library after school.",
        explain: "时间放最后：after school。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "go", "school."],
        wrongToken: "school.",
        answer: "school.",
        correctionZh: "在 school 前面垫一个 to：I go to school。",
        explain: "「去哪里」中间要垫一个 to。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我去商店。",
        tokens: ["the", "I", "shop.", "go", "to"],
        answer: "I go to the shop."
      },
      {
        promptZh: "你想说：我每天去学校。",
        tokens: ["every", "day.", "I", "go", "to", "school"],
        answer: "I go to school every day."
      },
      {
        promptZh: "买参考书时，你想说：我去书店。",
        tokens: ["bookstore.", "go", "the", "I", "to"],
        answer: "I go to the bookstore."
      }
    ],
    huntCaseIds: ["hunt-prepositions"]
  },
  {
    id: "lesson-10-went",
    number: 10,
    title: "昨天去了公园",
    grammarLabel: "一般过去时",
    episode: "小美的一天 ⑩",
    scene: "forest",
    sceneSetupZh: "周日的日记本摊在桌上，小美想写下昨天的事。",
    dialogueEn: "What did you do yesterday?",
    dialogueZh: "好朋友发消息问她。",
    intentZh: "我昨天去了公园。",
    targetSentence: "Yesterday I went to the park.",
    blocks: [
      { text: "Yesterday", role: "昨天（信号灯）" },
      { text: "I", role: "我" },
      { text: "went", role: "去（昨天版）" },
      { text: "to the park", role: "去公园" }
    ],
    oneLineRule: "看到 yesterday，动词就要换形状：go 的昨天版是 went。中文动词不变，英语必须变。",
    examples: [
      { en: "I saw a bird.", zh: "我看见了一只鸟。" },
      { en: "I was tired.", zh: "我很累。" },
      { en: "I watched TV.", zh: "我看了电视。" },
      { en: "I played football.", zh: "我踢了足球。" }
    ],
    dialogue: [
      { who: "npc", en: "What did you do yesterday?", zh: "好朋友发消息问她。" },
      { who: "npc", en: "Was it fun?", zh: "好朋友又问：好玩吗？" },
      { who: "me", en: "I went to the park.", zh: "轮到你说了——我昨天去了公园。" }
    ],
    contrast: [
      {
        wrong: "Yesterday I go to the park.",
        wrongMark: "go",
        correct: "Yesterday I went to the park.",
        whyZh: "看到 yesterday，动词就要换昨天版。go 的昨天版是 went——中文动词不变，英语必须变。"
      },
      {
        wrong: "I eated an apple.",
        wrongMark: "eated",
        correct: "I ate an apple.",
        whyZh: "eat 的昨天版是 ate。有些动词换形状不走加 -ed 的路，要单独记。"
      }
    ],
    variants: [
      { label: "肯定", en: "I went to the park.", zh: "我去了公园。" },
      { label: "否定", en: "I did not go out.", zh: "我昨天没出门。", noteZh: "昨天 + 不 = did not（didn't）。did 出场后，动词要变回原形 go。" },
      { label: "疑问", en: "Did you go yesterday?", zh: "你昨天去了吗？", noteZh: "把 Did 搬到句首，go 也变回原形。" }
    ],
    sceneSwings: [
      { sceneZh: "日记里写昨天的晚饭", en: "I ate noodles.", zh: "我吃了面条。" },
      { sceneZh: "跟朋友讲昨天的电影", en: "I saw a film.", zh: "我看了一部电影。" },
      { sceneZh: "妈妈问昨天作业写了没", en: "I did my homework.", zh: "我写了作业。" }
    ],
    deepDive: {
      title: "动词的「昨天版」都有哪些形状？",
      paragraphs: [
        "大多数动词很有规律：昨天版就是加 -ed。watch→watched、play→played、walk→walked，看到原形就能猜到昨天版。",
        "少数老词走自己的路：go→went、see→saw、eat→ate、am/is→was。它们是英语里最常用的词，用多了自然就记住了。",
        "疑问句和否定句里，Did / did not 出场时动词要变回原形——一场戏只让一个词换形状，别让动词换两次。"
      ]
    },
    summary: {
      rule: "看到 yesterday，动词要换昨天版；大多数动词加 -ed，少数不规则。",
      points: [
        "I watched TV. —— 大多数动词加 -ed",
        "I went to the park. —— go 的昨天版是 went",
        "Did you go yesterday? —— Did 搬句首，go 变回原形"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：昨天我去了公园。",
        before: "Yesterday I",
        after: "to the park.",
        options: ["went", "go", "goes"],
        answer: "went",
        explain: "Yesterday 是信号灯，go 要换成 went。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：昨天我去了公园。",
        tokens: ["went", "Yesterday", "the", "I", "park.", "to"],
        answer: "Yesterday I went to the park.",
        explain: "Yesterday 放最前面，后面照常说。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我看见了一只鸟。",
        tokens: ["a", "I", "bird.", "saw"],
        answer: "I saw a bird.",
        explain: "see 的昨天版是 saw。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["Yesterday", "I", "go", "to", "the", "park."],
        wrongToken: "go",
        answer: "go",
        correctionZh: "把 go 换成昨天版 went：Yesterday I went to the park。",
        explain: "yesterday 是信号灯，动词要换昨天版。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：昨天我很累。",
        tokens: ["tired", "was", "yesterday.", "I"],
        answer: "I was tired yesterday."
      },
      {
        promptZh: "你想说：昨天我吃了一个苹果。",
        tokens: ["apple.", "ate", "I", "an"],
        answer: "I ate an apple."
      },
      {
        promptZh: "日记里写昨天：我走路回了家。",
        tokens: ["home.", "I", "walked"],
        answer: "I walked home."
      }
    ],
    huntCaseIds: ["hunt-yesterday-park", "hunt-tense-jump"]
  },
  {
    id: "lesson-11-plural",
    number: 11,
    title: "昨天吃了三明治",
    grammarLabel: "名词复数 + 不规则过去式",
    episode: "小美的一天 ⑪",
    scene: "train",
    sceneSetupZh: "回程的火车上，小美翻开日记继续写昨天的野餐。",
    dialogueEn: "What did you eat?",
    dialogueZh: "好朋友又发来消息。",
    intentZh: "我吃了两个三明治。",
    targetSentence: "I ate two sandwiches.",
    blocks: [
      { text: "I", role: "我" },
      { text: "ate", role: "吃（昨天版）" },
      { text: "two", role: "两个" },
      { text: "sandwiches", role: "三明治（要加 s）" }
    ],
    oneLineRule: "两个以上要加 s。有些词变得不规则：man→men、foot→feet。advice、information 这种词永远不加 s。",
    examples: [
      { en: "I drank tea.", zh: "我喝了茶。" },
      { en: "I met my friend.", zh: "我见到了我的朋友。" },
      { en: "I bought three books.", zh: "我买了三本书。" },
      { en: "I met my friends.", zh: "我见到了我的朋友们。" }
    ],
    dialogue: [
      { who: "npc", en: "What did you eat?", zh: "好朋友又发来消息。" },
      { who: "me", en: "I ate two sandwiches.", zh: "轮到你说了——我吃了两个三明治。" },
      { who: "npc", en: "Two? I want one too!", zh: "好友秒回：两个？我也要一个！" }
    ],
    contrast: [
      {
        wrong: "I ate two sandwich.",
        wrongMark: "sandwich",
        correct: "I ate two sandwiches.",
        whyZh: "两个以上，东西要加 s。sandwich 以 ch 结尾，复数是 sandwiches。"
      },
      {
        wrong: "I have three brother.",
        wrongMark: "brother",
        correct: "I have three brothers.",
        whyZh: "three 是三个，brother 要加 s 变 brothers。"
      }
    ],
    variants: [
      { label: "肯定", en: "I ate two sandwiches.", zh: "我吃了两个三明治。" },
      { label: "否定", en: "I did not drink tea.", zh: "我没喝茶。", noteZh: "昨天 + 不 = did not，drink 变回原形。" },
      { label: "疑问", en: "What did you eat?", zh: "你吃了什么？", noteZh: "What 放句首 + did，eat 变回原形。" }
    ],
    sceneSwings: [
      { sceneZh: "野餐篮里数饮料", en: "I have two bottles of water.", zh: "我有两瓶水。" },
      { sceneZh: "给朋友讲昨天的聚会", en: "I met my friends.", zh: "我见到了我的朋友们。" },
      { sceneZh: "日记里写昨天早饭", en: "I drank milk and ate bread.", zh: "我喝了牛奶，吃了面包。" }
    ],
    deepDive: {
      title: "加 s 的三个小花样",
      paragraphs: [
        "大多数名词直接加 s：book→books、cat→cats。",
        "以 s、x、sh、ch 结尾的词要加 es：bus→buses、box→boxes、sandwich→sandwiches——多一个音节才念得顺。",
        "还有几个完全自己变的：man→men、foot→feet、child→children，遇到就单独记住。另外 advice、information 这种词永远不加 s，它们「数不清」。"
      ]
    },
    summary: {
      rule: "两个以上要加 s；s、x、sh、ch 结尾加 es；少数词不规则。",
      points: [
        "I ate two sandwiches. —— 复数 sandwiches",
        "I drank tea. —— drink 的昨天版是 drank",
        "What did you eat? —— What + did，eat 变回原形"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我买了三本书。",
        before: "I bought three",
        after: ".",
        options: ["book", "books", "bookes"],
        answer: "books",
        explain: "three 后面是复数：books。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我吃了两个三明治。",
        tokens: ["I", "ate", "two", "sandwiches."],
        answer: "I ate two sandwiches.",
        explain: "ate 是 eat 的昨天版，sandwiches 要加 s。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我见到了我的朋友。",
        tokens: ["my", "I", "friend.", "met"],
        answer: "I met my friend.",
        explain: "meet 的昨天版是 met。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "ate", "two", "sandwich."],
        wrongToken: "sandwich.",
        answer: "sandwich.",
        correctionZh: "两个以上要加 s：I ate two sandwiches。",
        explain: "two 后面是复数，sandwich 要加 es。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：昨天我喝了茶。",
        tokens: ["drank", "I", "tea."],
        answer: "I drank tea."
      },
      {
        promptZh: "你想说：我有三个哥哥。",
        tokens: ["three", "I", "brothers.", "have"],
        answer: "I have three brothers."
      },
      {
        promptZh: "文具店买笔，你想说：我买了四支笔。",
        tokens: ["four", "bought", "I", "pens."],
        answer: "I bought four pens."
      }
    ],
    huntCaseIds: ["hunt-breakfast", "hunt-uncountable", "hunt-passive"]
  },
  {
    id: "lesson-12-will",
    number: 12,
    title: "明天要画画",
    grammarLabel: "will 将来时",
    episode: "小美的一天 ⑫",
    scene: "magic",
    sceneSetupZh: "晚上，小美在日记本最后写下明天的计划。",
    dialogueEn: "Any plans for tomorrow?",
    dialogueZh: "妈妈敲门问她。",
    intentZh: "我明天要画画。",
    targetSentence: "I will draw tomorrow.",
    blocks: [
      { text: "I", role: "我" },
      { text: "will", role: "要（明天版）" },
      { text: "draw", role: "画画" },
      { text: "tomorrow", role: "明天" }
    ],
    oneLineRule: "说明天的事，在动词前面加 will，动词本身一点不变：I will draw。",
    examples: [
      { en: "It will rain.", zh: "明天会下雨。" },
      { en: "We will go tomorrow.", zh: "我们明天去。" },
      { en: "I will call you tomorrow.", zh: "我明天会给你打电话。" },
      { en: "She will come tomorrow.", zh: "她明天会来。" }
    ],
    dialogue: [
      { who: "npc", en: "Any plans for tomorrow?", zh: "妈妈敲门问她。" },
      { who: "npc", en: "The weather will be nice!", zh: "妈妈看着窗外说：明天天气会很好。" },
      { who: "me", en: "I will draw tomorrow.", zh: "轮到你说了——我明天要画画。" }
    ],
    contrast: [
      {
        wrong: "I will to draw.",
        wrongMark: "to",
        correct: "I will draw.",
        whyZh: "will 后面动词直接跟，中间不垫 to。"
      },
      {
        wrong: "Tomorrow I will drew.",
        wrongMark: "drew",
        correct: "Tomorrow I will draw.",
        whyZh: "will 出场时动词保持原样，不换昨天版。一场戏只有一个变化。"
      }
    ],
    variants: [
      { label: "肯定", en: "I will draw tomorrow.", zh: "我明天要画画。" },
      { label: "否定", en: "It will not rain.", zh: "明天不会下雨。", noteZh: "在 will 后面加 not。" },
      { label: "疑问", en: "Will you come tomorrow?", zh: "你明天来吗？", noteZh: "把 Will 搬到句首。回答：I will。" }
    ],
    sceneSwings: [
      { sceneZh: "看天气预报，跟爸爸说明天", en: "It will rain.", zh: "明天会下雨。" },
      { sceneZh: "答应朋友明天一起去公园", en: "We will go to the park tomorrow.", zh: "我们明天去公园。" },
      { sceneZh: "晚上给同学回消息", en: "I will call you tomorrow.", zh: "我明天给你打电话。" }
    ],
    deepDive: {
      title: "为什么 will 后面的动词不用变？",
      paragraphs: [
        "过去时要动词自己换衣服（go→went），将来时不一样：变化都交给 will 这一个词，动词穿原样就行。",
        "所以不管主语是 I、she 还是 they，都是 will + 动词原形：I will go、she will go、they will go，永远不会跑形。",
        "信号灯从 yesterday 换成 tomorrow，动词旁边站一个 will，过去和将来就分开了。"
      ]
    },
    summary: {
      rule: "说明天的事，动词前面加 will，动词本身不变。",
      points: [
        "I will draw tomorrow. —— will + 动词原形",
        "It will not rain. —— 不会：will 后面加 not",
        "Will you come tomorrow? —— 问别人：Will 搬到句首"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我明天要画画。",
        before: "I",
        after: "draw tomorrow.",
        options: ["will", "am", "went"],
        answer: "will",
        explain: "明天的事，动词前面加 will。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我明天要画画。",
        tokens: ["I", "will", "draw", "tomorrow."],
        answer: "I will draw tomorrow.",
        explain: "will 加在动词前面，draw 不用变。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我们明天去公园。",
        tokens: ["tomorrow.", "the", "We", "park", "go", "will", "to"],
        answer: "We will go to the park tomorrow.",
        explain: "will 放在 go 前面，go to the park 照旧。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "will", "drew", "a", "picture."],
        wrongToken: "drew",
        answer: "drew",
        correctionZh: "把 drew 换回原形 draw：I will draw a picture。",
        explain: "will 后面的动词保持原样。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：明天会下雨。",
        tokens: ["rain.", "It", "will"],
        answer: "It will rain."
      },
      {
        promptZh: "你想说：我明天会给你打电话。",
        tokens: ["you", "call", "I", "tomorrow.", "will"],
        answer: "I will call you tomorrow."
      },
      {
        promptZh: "跟朋友约明天跑步，你想说：我明天会跑步。",
        tokens: ["run", "will", "I", "tomorrow."],
        answer: "I will run tomorrow."
      }
    ],
    huntCaseIds: ["hunt-because-so", "hunt-word-order"]
  }
];

export const GRAMMAR_LESSON_BY_ID: ReadonlyMap<string, GrammarLesson> = new Map(
  grammarLessons.map((lesson) => [lesson.id, lesson])
);
