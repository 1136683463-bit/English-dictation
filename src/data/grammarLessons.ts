import type { GrammarLesson } from "../types";
import cover1 from "../assets/lessons/lesson-1.jpg";
import cover2 from "../assets/lessons/lesson-2.jpg";
import cover3 from "../assets/lessons/lesson-3.jpg";
import cover4 from "../assets/lessons/lesson-4.jpg";
import cover5 from "../assets/lessons/lesson-5.jpg";
import cover6 from "../assets/lessons/lesson-6.jpg";
import cover7 from "../assets/lessons/lesson-7.jpg";
import cover8 from "../assets/lessons/lesson-8.jpg";
import cover9 from "../assets/lessons/lesson-9.jpg";
import cover10 from "../assets/lessons/lesson-10.jpg";
import cover11 from "../assets/lessons/lesson-11.jpg";
import cover12 from "../assets/lessons/lesson-12.jpg";
import cover13 from "../assets/lessons/lesson-13.jpg";
import cover14 from "../assets/lessons/lesson-14.jpg";
import cover15 from "../assets/lessons/lesson-15.jpg";
import cover16 from "../assets/lessons/lesson-16.jpg";
import cover17 from "../assets/lessons/lesson-17.jpg";
import cover18 from "../assets/lessons/lesson-18.jpg";
import cover19 from "../assets/lessons/lesson-19.jpg";
import cover20 from "../assets/lessons/lesson-20.jpg";
import cover21 from "../assets/lessons/lesson-21.jpg";
import cover22 from "../assets/lessons/lesson-22.jpg";
import cover23 from "../assets/lessons/lesson-23.jpg";
import cover24 from "../assets/lessons/lesson-24.jpg";

/**
 * 「小美的一天」· 初学者语法连续剧（第一季 1–12 课 · 第二季进阶篇 13 课起，规划见 PRD-grammar-advanced）。
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
 *    第②段末尾一道 spot 找茬题（为第④段破案做铺垫），第③段 4 题（句型 / 变体 / 场景迁移 /
 *    否定或疑问变体——R06 扩量：每课练习必含一道与 variants 卡一致的否定或疑问变体题）。
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
    cover: cover1,
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
      },
      {
        wrong: "I are Xiaomei.",
        wrongMark: "are",
        correct: "I am Xiaomei.",
        whyZh: "are 也不是 I 的搭档。I 只认 am 这一个搭档——is 和 are 都管不到「我」。"
      },
      {
        wrong: "I am not happy today.",
        wrongMark: null,
        correct: "I am happy today.",
        whyZh: "想说「开心」却多了 not，意思就反了。not 是「不」，要真不开心才放——别让它偷偷溜进来。"
      },
      {
        wrong: "Am I Xiaomei.",
        wrongMark: "Am I",
        correct: "I am Xiaomei.",
        whyZh: "自我介绍是陈述句，I 在最前面：I am。Am 搬到句首是问别人「我是不是……」，自我介绍用不上。"
      },
      {
        wrong: "I am student.",
        wrongMark: null,
        correct: "I am a student.",
        whyZh: "说「我是一名学生」，a 不能丢：一个学生要先报数 a 再出场。光有 student 站在那儿，句子就差一口气。"
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
      },
      {
        // R9 变形/替换：换表语（开心→累），I am 搭档不变（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I am happy.」把「开心」换成「累（tired）」，am 要怎么变？",
        replaceBase: "I am happy.",
        replaceTarget: "把 happy 换成 tired",
        options: ["am", "is", "are"],
        answer: "am",
        explain: "换表语不用怕：主语还是 I，搭档永远是 am——I am tired。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我很累。",
        tokens: ["I", "am", "tired."],
        distractors: ["is"],
        answer: "I am tired."
      },
      {
        promptZh: "你想说：我是一名老师。",
        tokens: ["teacher.", "a", "I", "am"],
        distractors: ["is"],
        answer: "I am a teacher."
      },
      {
        promptZh: "食堂阿姨问你饿不饿，你想说：我很饿。",
        tokens: ["hungry.", "am", "I"],
        distractors: ["are"],
        answer: "I am hungry."
      },
      {
        promptZh: "室友问你累不累，你想说：我不累。",
        tokens: ["tired.", "not", "am", "I"],
        distractors: ["is"],
        answer: "I am not tired."
      }
    ],
    // R5「忆」段：遮盖回忆——不给选项，凭记忆还原核心句
    recall: {
      promptZh: "开学第一天，老师让每个人做自我介绍。凭记忆，写出小美的那句英文。",
      intentZh: "我是小美。",
      answer: "I am Xiaomei.",
      noteZh: "I 和 am 是固定搭档，说「我是……」它们一起出场。"
    },
    huntCaseIds: ["hunt-call-mother"]
  },
  {
    id: "lesson-02-is",
    number: 2,
    title: "你是谁，他是谁",
    grammarLabel: "be 动词 · you are / he is",
    episode: "小美的一天 ②",
    scene: "campus",
    cover: cover2,
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
      },
      {
        wrong: "He are a doctor.",
        wrongMark: "are",
        correct: "He is a doctor.",
        whyZh: "He 是一个人，搭档用 is 不用 are。are 管的是 you、we、they 这些「多数派」。"
      },
      {
        wrong: "You are a teacher?",
        wrongMark: null,
        correct: "Are you a teacher?",
        whyZh: "问「你是不是老师」要把 Are 搬到句首：Are you……？语序不换，就成了陈述句不是问句。"
      },
      {
        wrong: "She is nurse.",
        wrongMark: null,
        correct: "She is a nurse.",
        whyZh: "她是「一名」护士，a 不能丢：a nurse。单数的东西前面要报数 a，光秃秃的 nurse 站不住。"
      },
      {
        wrong: "You not are my friend.",
        wrongMark: "not are",
        correct: "You are not my friend.",
        whyZh: "「不是」要把 not 放在 are 后面：are not。not 不能跑到搭档前面去。"
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
      },
      {
        // R8 跨课复现：上一课（L1 I am）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：我很开心。",
        tokens: ["I", "am", "happy."],
        answer: "I am happy.",
        explain: "复现第 1 课：I 的搭档永远是 am。"
      },
      {
        // R9 变形/替换：换主语 You→She，be 动词跟着换（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「You are my friend.」把主语 You 换成 She，are 要怎么变？",
        replaceBase: "You are my friend.",
        replaceTarget: "把 You 换成 She",
        options: ["is", "are", "am"],
        answer: "is",
        explain: "She 是一个人，搭档换 is：She is my friend。are 管不到「她」。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：你是林涛。",
        tokens: ["are", "Lin", "You", "Tao."],
        distractors: ["is"],
        answer: "You are Lin Tao."
      },
      {
        promptZh: "你想说：她是我的老师。",
        tokens: ["She", "my", "is", "teacher."],
        distractors: ["are"],
        answer: "She is my teacher."
      },
      {
        promptZh: "运动会上，你想说：他们很强。",
        tokens: ["strong.", "They", "are"],
        distractors: ["is"],
        answer: "They are strong."
      },
      {
        promptZh: "同学猜错了她的工作，你想说：她不是护士。",
        tokens: ["nurse.", "a", "not", "is", "She"],
        distractors: ["am"],
        answer: "She is not a nurse."
      }
    ],
    // R5「忆」段：遮盖回忆——不给选项，凭记忆还原核心句
    recall: {
      promptZh: "教室后墙贴着新同学的全家福，你要告诉大家照片上这个男生是谁。",
      intentZh: "他是我的哥哥。",
      answer: "He is my brother.",
      noteZh: "他（单个的人）的搭档是 is。"
    },
    huntCaseIds: []
  },
  {
    id: "lesson-03-have",
    number: 3,
    title: "我有一个背包",
    grammarLabel: "have + a",
    episode: "小美的一天 ③",
    scene: "campus",
    cover: cover3,
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
      },
      {
        wrong: "I have a apple.",
        wrongMark: "a",
        correct: "I have an apple.",
        whyZh: "apple 第一个音是元音，a 和它连读会拗口，要换 an 才顺口——看发音不看字母。"
      },
      {
        wrong: "I haves a bag.",
        wrongMark: "haves",
        correct: "I have a bag.",
        whyZh: "have 只有「他、她」才换 has，「我」还是用 have——没有 haves 这种形状。"
      },
      {
        wrong: "I have a water.",
        wrongMark: "a",
        correct: "I have water.",
        whyZh: "water 这类数不清的东西，前面不加 a——a 只给数得清的一个一个的东西用。"
      },
      {
        wrong: "Does she has a cat?",
        wrongMark: "has",
        correct: "Does she have a cat?",
        whyZh: "Does 一出场，动词要打回原形 have：Does she have……？一场戏只让一个词扛变化。"
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
      },
      {
        // R8 跨课复现：上一课（L2 you are/he is）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：她是我的朋友。",
        tokens: ["She", "is", "my", "friend."],
        answer: "She is my friend.",
        explain: "复现第 2 课：She 的搭档是 is。"
      },
      {
        // R9 变形/替换：换主语 I→She，have 变 has（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I have a pen.」把主语 I 换成 She，have 要怎么变？",
        replaceBase: "I have a pen.",
        replaceTarget: "把 I 换成 She",
        options: ["has", "have", "haves"],
        answer: "has",
        explain: "「她有」要换 has：She has a pen。has 是他、她专用的搭档。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我有一个梦想。",
        tokens: ["dream.", "a", "I", "have"],
        distractors: ["has"],
        answer: "I have a dream."
      },
      {
        promptZh: "你想说：我有一个红色的杯子。",
        tokens: ["cup.", "have", "red", "I", "a"],
        distractors: ["an"],
        answer: "I have a red cup."
      },
      {
        promptZh: "自行车棚前，你想说：我有一辆新自行车。",
        tokens: ["bike.", "a", "I", "new", "have"],
        distractors: ["has"],
        answer: "I have a new bike."
      },
      {
        promptZh: "同桌没带笔，你想问他：你有笔吗？",
        tokens: ["a", "Do", "pen?", "have", "you"],
        distractors: ["Are"],
        answer: "Do you have a pen?"
      }
    ],
    // R5「忆」段：遮盖回忆——不给选项，凭记忆还原核心句
    recall: {
      promptZh: "课间同桌夸你的新书包，你想告诉她你有什么。",
      intentZh: "我有一个新背包。",
      answer: "I have a new bag.",
      noteZh: "「我有什么」用 have；一个可数的东西前面要有 a。"
    },
    huntCaseIds: []
  },
  {
    id: "lesson-04-want",
    number: 4,
    title: "我想要一杯奶茶",
    grammarLabel: "want + a / an",
    episode: "小美的一天 ④",
    scene: "city",
    cover: cover4,
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
      },
      {
        wrong: "I want a hour.",
        wrongMark: "a",
        correct: "I want an hour.",
        whyZh: "hour 虽然以辅音字母 h 开头，但 h 不发音，第一个音是元音——所以用 an。看发音，不看字母。"
      },
      {
        wrong: "I want apple.",
        wrongMark: null,
        correct: "I want an apple.",
        whyZh: "说「想要一个苹果」，可数的东西前面要报数：an apple。光秃秃的 apple 站不住。"
      },
      {
        wrong: "She want a milk tea.",
        wrongMark: "want",
        correct: "She wants a milk tea.",
        whyZh: "「她想要」，want 要换三单 wants。变形的是 want 自己，奶茶前面的 a 不变。"
      },
      {
        wrong: "I want an uniform.",
        wrongMark: "an",
        correct: "I want a uniform.",
        whyZh: "uniform 虽然以元音字母 u 开头，但读出来第一个音是「优」这个辅音——所以用 a。还是看发音，不看字母。"
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
      },
      {
        // R8 跨课复现：上一课（L3 have + a）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：我有一支笔。",
        tokens: ["I", "have", "a", "pen."],
        answer: "I have a pen.",
        explain: "复现第 3 课：一个可数的东西前面要报数 a。"
      },
      {
        // R9 变形/替换：换名词（辅音→元音开头），冠词跟着换（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I want a book.」把「书」换成「苹果（apple）」，a 要怎么变？",
        replaceBase: "I want a book.",
        replaceTarget: "把 book 换成 apple",
        options: ["an", "a", "the"],
        answer: "an",
        explain: "apple 元音开头，a 要换 an：I want an apple。看发音，不看字母。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我想要一个鸡蛋。",
        tokens: ["egg.", "an", "I", "want"],
        distractors: ["a"],
        answer: "I want an egg."
      },
      {
        promptZh: "你想说：我想要一把伞。",
        tokens: ["umbrella.", "want", "I", "an"],
        distractors: ["a"],
        answer: "I want an umbrella."
      },
      {
        promptZh: "蛋糕店里，你想说：我想要一块橡皮。",
        tokens: ["eraser.", "want", "I", "an"],
        distractors: ["a"],
        answer: "I want an eraser."
      },
      {
        promptZh: "食堂阿姨想给你加个鸡蛋，你想说：我不要鸡蛋。",
        tokens: ["an", "don't", "egg.", "I", "want"],
        distractors: ["a"],
        answer: "I don't want an egg."
      }
    ],
    // R5「忆」段：遮盖回忆——不给选项，凭记忆还原核心句
    recall: {
      promptZh: "奶茶店的店员笑着问你要点什么，轮到你点单了。",
      intentZh: "我想要一杯奶茶。",
      answer: "I want a milk tea.",
      noteZh: "想要什么就说 I want…；元音开头的词前面要用 an。"
    },
    huntCaseIds: ["hunt-new-phone"]
  },
  {
    id: "lesson-05-like",
    number: 5,
    title: "我喜欢音乐",
    grammarLabel: "like + 名词",
    episode: "小美的一天 ⑤",
    scene: "sparkle",
    cover: cover5,
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
      },
      {
        wrong: "She like cats.",
        wrongMark: "like",
        correct: "She likes cats.",
        whyZh: "「她喜欢」，like 要换三单 likes。变形的是 like 自己，cats 照样复数。"
      },
      {
        wrong: "I like a dogs.",
        wrongMark: "a",
        correct: "I like dogs.",
        whyZh: "「喜欢狗这一整类」用复数 dogs，前面不能再加 a——a 是「一个」，dogs 是「一类」，不能凑一起。"
      },
      {
        wrong: "I not like coffee.",
        wrongMark: "not like",
        correct: "I don't like coffee.",
        whyZh: "「不喜欢」要把 don't 放在 like 前面：don't like。not 不能自己站在动词前。"
      },
      {
        wrong: "Does you like coffee?",
        wrongMark: "Does",
        correct: "Do you like coffee?",
        whyZh: "问「你喜欢吗」用 Do 不用 Does——Does 只配他、她。you 的帮手是 Do。"
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
      },
      {
        // R8 跨课复现：上一课（L4 want + a/an）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：我想要一个苹果。",
        tokens: ["I", "want", "an", "apple."],
        answer: "I want an apple.",
        explain: "复现第 4 课：apple 元音开头用 an。"
      },
      {
        // R9 变形/替换：换主语 I→She，like 变 likes（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I like music.」把主语 I 换成 She，like 要怎么变？",
        replaceBase: "I like music.",
        replaceTarget: "把 I 换成 She",
        options: ["likes", "like", "liking"],
        answer: "likes",
        explain: "「她喜欢」要换三单 likes：She likes music。变形的是 like，music 不变。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我喜欢读书。",
        tokens: ["reading.", "I", "like"],
        distractors: ["a"],
        answer: "I like reading."
      },
      {
        promptZh: "你想说：我喜欢春天。",
        tokens: ["I", "spring.", "like"],
        distractors: ["likes"],
        answer: "I like spring."
      },
      {
        promptZh: "运动会上，你想说：我喜欢篮球。",
        tokens: ["I", "like", "basketball."],
        distractors: ["a"],
        answer: "I like basketball."
      },
      {
        promptZh: "想认识新朋友，你问他：你喜欢音乐吗？",
        tokens: ["music?", "Do", "like", "you"],
        distractors: ["likes"],
        answer: "Do you like music?"
      }
    ],
    // R5「忆」段：遮盖回忆——不给选项，凭记忆还原核心句
    recall: {
      promptZh: "好朋友问你平时喜欢什么，你指了指正戴着的耳机。",
      intentZh: "我喜欢音乐。",
      answer: "I like music.",
      noteZh: "music 这类数不清的词原样跟在 like 后面，不加 a。"
    },
    huntCaseIds: []
  },
  {
    id: "lesson-06-it",
    number: 6,
    title: "现在几点了",
    grammarLabel: "It is · 时间与天气",
    episode: "小美的一天 ⑥",
    scene: "city",
    cover: cover6,
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
      },
      {
        wrong: "It am hot.",
        wrongMark: "am",
        correct: "It is hot.",
        whyZh: "am 只跟 I 走，It 的搭档是 is。说天气热，用 It is hot。"
      },
      {
        wrong: "It is rains.",
        wrongMark: "rains",
        correct: "It is raining.",
        whyZh: "说「正在下雨」，动词要穿 -ing 外套：is raining。is 后面的动词不能光用原形加 -s。"
      },
      {
        wrong: "Is it three o'clock?",
        wrongMark: null,
        correct: "It is three o'clock.",
        whyZh: "回答别人的提问用陈述句：It is three o'clock。Is it 开头是问句——这里要答，不是要问。"
      },
      {
        wrong: "It is not cold today.",
        wrongMark: null,
        correct: "It is cold today.",
        whyZh: "想说「冷」却多了 not，意思就反了。not 是「不」，要真不冷才放——别让它偷偷溜进来。"
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
      },
      {
        // R8 跨课复现：上一课（L5 like + 名词）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：我喜欢音乐。",
        tokens: ["I", "like", "music."],
        answer: "I like music.",
        explain: "复现第 5 课：music 数不清，前面不加 a。"
      },
      {
        // R9 变形/替换：换表语（时间→天气），It is 搭档不变（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「It is three o'clock.」把「三点」换成「冷（cold）」，is 要怎么变？",
        replaceBase: "It is three o'clock.",
        replaceTarget: "把 three o'clock 换成 cold",
        options: ["is", "are", "am"],
        answer: "is",
        explain: "换表语不用怕：天气和时间都用 It is——It is cold。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：现在是七点。",
        tokens: ["seven", "It", "o'clock.", "is"],
        distractors: ["are"],
        answer: "It is seven o'clock."
      },
      {
        promptZh: "你想说：今天很热。",
        tokens: ["hot.", "It", "is"],
        distractors: ["am"],
        answer: "It is hot."
      },
      {
        promptZh: "翻日历时，你想说：今天是星期天。",
        tokens: ["It", "is", "Sunday."],
        distractors: ["He"],
        answer: "It is Sunday."
      },
      {
        promptZh: "摸了摸水杯，你想说：它不热。",
        tokens: ["hot.", "is", "It", "not"],
        distractors: ["are"],
        answer: "It is not hot."
      }
    ],
    // R5「忆」段：遮盖回忆——不给选项，凭记忆还原核心句
    recall: {
      promptZh: "你抬头看了看街口的大钟，想告诉同桌现在几点。",
      intentZh: "现在是三点。",
      answer: "It is three o'clock.",
      noteZh: "说时间和天气，都用占位小凳子 It is 开头。"
    },
    huntCaseIds: []
  },
  {
    id: "lesson-07-we",
    number: 7,
    title: "我们很开心",
    grammarLabel: "be 动词 · we are / they are",
    episode: "小美的一天 ⑦",
    scene: "island",
    cover: cover7,
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
      },
      {
        wrong: "They is my friends.",
        wrongMark: "is",
        correct: "They are my friends.",
        whyZh: "They 是「他们」，一伙人，搭档用 are 不用 is。is 只配单个的他、她、它。"
      },
      {
        wrong: "We are a students.",
        wrongMark: "a",
        correct: "We are students.",
        whyZh: "「我们是学生」用复数 students，前面不能再加 a——a 是「一个」，students 是「一伙」，不能凑一起。"
      },
      {
        wrong: "Are they classmates?",
        wrongMark: null,
        correct: "They are classmates.",
        whyZh: "告诉别人「他们是同学」用陈述句：They are。Are they 开头是问句——这里要说，不是要问。"
      },
      {
        wrong: "We am happy.",
        wrongMark: "am",
        correct: "We are happy.",
        whyZh: "am 只跟 I 一个人走，We 是「我们」，搭档换 are。am 管不到一伙人。"
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
      },
      {
        // R8 跨课复现：上一课（L6 It is）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：今天很冷。",
        tokens: ["It", "is", "cold", "today."],
        answer: "It is cold today.",
        explain: "复现第 6 课：天气用 It is 开头。"
      },
      {
        // R9 变形/替换：换主语 We→They，be 动词不变（一伙人都用 are，构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「We are happy.」把主语 We 换成 They，are 要怎么变？",
        replaceBase: "We are happy.",
        replaceTarget: "把 We 换成 They",
        options: ["are", "is", "am"],
        answer: "are",
        explain: "They 也是一伙的，搭档还是 are：They are happy。一伙人都用 are。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我们是同学。",
        tokens: ["We", "classmates.", "are"],
        distractors: ["is"],
        answer: "We are classmates."
      },
      {
        promptZh: "你想说：他们很忙。",
        tokens: ["busy.", "They", "are"],
        distractors: ["is"],
        answer: "They are busy."
      },
      {
        promptZh: "合唱比赛后，你想说：我们很棒。",
        tokens: ["great.", "We", "are"],
        distractors: ["am"],
        answer: "We are great."
      },
      {
        promptZh: "看到照片里几个穿校服的孩子，你想问：他们是学生吗？",
        tokens: ["Are", "students?", "they"],
        distractors: ["Is"],
        answer: "Are they students?"
      }
    ],
    // R5「忆」段：遮盖回忆——不给选项，凭记忆还原核心句
    recall: {
      promptZh: "班级春游拍照，班长喊完 say cheese，你心里想说的是——",
      intentZh: "我们很开心。",
      answer: "We are happy.",
      noteZh: "一伙人（We / You / They）的搭档都是 are。"
    },
    huntCaseIds: ["hunt-moving-day"]
  },
  {
    id: "lesson-08-my",
    number: 8,
    title: "她是我的朋友",
    grammarLabel: "物主词 my / her",
    episode: "小美的一天 ⑧",
    scene: "train",
    cover: cover8,
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
      },
      {
        wrong: "I like she cat.",
        wrongMark: "she",
        correct: "I like her cat.",
        whyZh: "「她的猫」要用小标签 her 贴在 cat 前面。she 只能当主角，不能贴在东西前。"
      },
      {
        wrong: "My am happy.",
        wrongMark: "My",
        correct: "I am happy.",
        whyZh: "当主角的是 I，不是 my。my 是贴在东西前的标签，不能站到句子开头当主角。"
      },
      {
        wrong: "He name is Tom.",
        wrongMark: "He",
        correct: "His name is Tom.",
        whyZh: "「他的名字」要用小标签 his 贴在 name 前面。he 只能当主角，his 才是「他的」。"
      },
      {
        wrong: "This is my a book.",
        wrongMark: "a",
        correct: "This is my book.",
        whyZh: "有 my 这个小标签在前面，就不用再报数 a——my 已经说清是「我的那本」了，a 和 my 不能同时贴。"
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
      },
      {
        // R8 跨课复现：上一课（L7 we are）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：我们是同学。",
        tokens: ["We", "are", "classmates."],
        answer: "We are classmates.",
        explain: "复现第 7 课：一伙人（We）的搭档是 are。"
      },
      {
        // R9 变形/替换：换主角 my→her（物主标签跟着换，构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「This is my book.」把「我的」换成「她的」，my 要怎么变？",
        replaceBase: "This is my book.",
        replaceTarget: "把 my 换成「她的」",
        options: ["her", "she", "hers"],
        answer: "her",
        explain: "「她的」用标签 her 贴在 book 前：This is her book。she 只能当主角。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：他是我的同学。",
        tokens: ["my", "He", "is", "classmate."],
        distractors: ["her"],
        answer: "He is my classmate."
      },
      {
        promptZh: "你想说：这是她的杯子。",
        tokens: ["her", "This", "cup.", "is"],
        distractors: ["she"],
        answer: "This is her cup."
      },
      {
        promptZh: "失物招领处，你想说：这是他的帽子。",
        tokens: ["hat.", "This", "his", "is"],
        distractors: ["he"],
        answer: "This is his hat."
      },
      {
        promptZh: "捡到一本书，你想问：这是你的书吗？",
        tokens: ["book?", "Is", "this", "your"],
        distractors: ["you"],
        answer: "Is this your book?"
      }
    ],
    // R5「忆」段：遮盖回忆——不给选项，凭记忆还原核心句
    recall: {
      promptZh: "火车上，邻座的人好奇身边这个女生是谁。",
      intentZh: "她是我的朋友。",
      answer: "She is my friend.",
      noteZh: "主角位用 She；「我的」是贴在人前面的小标签 my。"
    },
    huntCaseIds: []
  },
  {
    id: "lesson-09-go",
    number: 9,
    title: "放学去图书馆",
    grammarLabel: "go to + 地点",
    episode: "小美的一天 ⑨",
    scene: "campus",
    cover: cover9,
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
      },
      {
        wrong: "I go to the school.",
        wrongMark: "the",
        correct: "I go to school.",
        whyZh: "「去上学」是 go to school，school 前不加 the——这是去读书的意思。加 the 就变成「去那所学校（那栋楼）」，意思不一样了。"
      },
      {
        wrong: "She go to the park.",
        wrongMark: "go",
        correct: "She goes to the park.",
        whyZh: "「她去」，go 要换三单 goes。变形的是 go 自己，to the park 不变。"
      },
      {
        wrong: "I goes to the park.",
        wrongMark: "goes",
        correct: "I go to the park.",
        whyZh: "「我去」用原形 go——goes 只配他、她。I 后面不接三单 goes。"
      },
      {
        wrong: "I go the library.",
        wrongMark: "the",
        correct: "I go to the library.",
        whyZh: "「去图书馆」中间要垫 to：go to the library。漏了 to，脚步就迈不过去。"
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
      },
      {
        // R8 跨课复现：上一课（L8 my/her）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：她是我的朋友。",
        tokens: ["She", "is", "my", "friend."],
        answer: "She is my friend.",
        explain: "复现第 8 课：当主角用 She，her 是贴在东西前的标签。"
      },
      {
        // R9 变形/替换：换地点（park→school），to 踏板不变但 the 消失（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I go to the park.」把「公园」换成「学校」，to the 要怎么变？",
        replaceBase: "I go to the park.",
        replaceTarget: "把 the park 换成 school",
        options: ["to school", "to the school", "school"],
        answer: "to school",
        explain: "「去上学」固定是 go to school，school 前不加 the——去读书的意思。park 才要 the。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我去商店。",
        tokens: ["the", "I", "shop.", "go", "to"],
        distractors: ["at"],
        answer: "I go to the shop."
      },
      {
        promptZh: "你想说：我每天去学校。",
        tokens: ["every", "day.", "I", "go", "to", "school"],
        distractors: ["the"],
        answer: "I go to school every day."
      },
      {
        promptZh: "买参考书时，你想说：我去书店。",
        tokens: ["bookstore.", "go", "the", "I", "to"],
        distractors: ["in"],
        answer: "I go to the bookstore."
      },
      {
        promptZh: "今天下雨，你想说：我不去公园。",
        tokens: ["don't", "go", "I", "park.", "the", "to"],
        distractors: ["went"],
        answer: "I don't go to the park."
      }
    ],
    // R5「忆」段：遮盖回忆——不给选项，凭记忆还原核心句
    recall: {
      promptZh: "放学铃响了，同桌问你等下去哪写作业。",
      intentZh: "我去图书馆。",
      answer: "I go to the library.",
      noteZh: "去哪里中间要垫一个 to；大家都熟悉的地方前面加 the。"
    },
    huntCaseIds: ["hunt-prepositions"]
  },
  {
    id: "lesson-10-went",
    number: 10,
    title: "昨天去了公园",
    grammarLabel: "一般过去时",
    episode: "小美的一天 ⑩",
    scene: "forest",
    cover: cover10,
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
      },
      {
        wrong: "I didn't went out.",
        wrongMark: "went",
        correct: "I didn't go out.",
        whyZh: "didn't 一出场，动词就要打回原形：didn't go。一场戏只让一个词换形状。"
      },
      {
        wrong: "Did you went yesterday?",
        wrongMark: "went",
        correct: "Did you go yesterday?",
        whyZh: "Did 搬句首时，后面的动词也要变回原形 go：Did you go？别让动词换两次形状。"
      },
      {
        wrong: "I was watch TV.",
        wrongMark: "watch",
        correct: "I watched TV.",
        whyZh: "watch 的昨天版是直接加 -ed：watched。was 是 am/is 的昨天版，不能跟动词原形凑一对。"
      },
      {
        wrong: "She see a bird yesterday.",
        wrongMark: "see",
        correct: "She saw a bird yesterday.",
        whyZh: "yesterday 是信号灯：see 的昨天版是 saw，不规则变化要单独记。"
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
      },
      {
        // R8 跨课复现：上一课（L9 go to + 地点）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：放学去图书馆。",
        tokens: ["I", "go", "to", "the", "library", "after", "school."],
        answer: "I go to the library after school.",
        explain: "复现第 9 课：go to + 地点，图书馆前面要加 the。"
      },
      {
        // R9 变形/替换：换时间 yesterday→every day，动词打回原形（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「Yesterday I went to the park.」把 Yesterday 换成 Every day，went 要怎么变？",
        replaceBase: "Yesterday I went to the park.",
        replaceTarget: "把 Yesterday 换成 Every day",
        options: ["go", "went", "goes"],
        answer: "go",
        explain: "Every day 是每天，动词要用原形 go：Every day I go to the park. went 只是昨天版。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：昨天我很累。",
        tokens: ["tired", "was", "yesterday.", "I"],
        distractors: ["am"],
        answer: "I was tired yesterday."
      },
      {
        promptZh: "你想说：昨天我吃了一个苹果。",
        tokens: ["apple.", "ate", "I", "an"],
        distractors: ["eat"],
        answer: "I ate an apple."
      },
      {
        promptZh: "日记里写昨天：我走路回了家。",
        tokens: ["home.", "I", "walked"],
        distractors: ["walk"],
        answer: "I walked home."
      },
      {
        promptZh: "昨晚作业太多，你想说：我没出门。",
        tokens: ["did", "go", "I", "not", "out."],
        distractors: ["went"],
        answer: "I did not go out."
      }
    ],
    // R5「忆」段：遮盖回忆——不给选项，凭记忆还原核心句
    recall: {
      promptZh: "周日晚上的日记本摊在桌上，你要写下昨天最开心的一件事。",
      intentZh: "我昨天去了公园。",
      answer: "Yesterday I went to the park.",
      noteZh: "看到 yesterday，动词要换昨天版：go 的昨天版是 went。"
    },
    huntCaseIds: ["hunt-yesterday-park", "hunt-tense-jump"]
  },
  {
    id: "lesson-11-plural",
    number: 11,
    title: "昨天吃了三明治",
    grammarLabel: "名词复数 + 不规则过去式",
    episode: "小美的一天 ⑪",
    scene: "train",
    cover: cover11,
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
      },
      {
        wrong: "I ate two sandwichs.",
        wrongMark: "sandwichs",
        correct: "I ate two sandwiches.",
        whyZh: "sandwich 以 ch 结尾，复数不是只加 s，要加 es：sandwiches。和 watches、boxes 是一个规律。"
      },
      {
        wrong: "I buyed some bread.",
        wrongMark: "buyed",
        correct: "I bought some bread.",
        whyZh: "buy 的昨天版是 bought，不走加 -ed 的路——这些老词要单独记，和 go→went 一样。"
      },
      {
        wrong: "I ate a sandwiches.",
        wrongMark: "a",
        correct: "I ate a sandwich.",
        whyZh: "a 是「一个」，后面跟单数 sandwich；复数 sandwiches 前面不能再用 a。一个和一类不能凑一起。"
      },
      {
        wrong: "I eated two sandwiches.",
        wrongMark: "eated",
        correct: "I ate two sandwiches.",
        whyZh: "eat 的昨天版是 ate，不是 eated——eat 不走加 -ed 的路，要单独记。"
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
      },
      {
        // R8 跨课复现：上一课（L10 一般过去时）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：昨天我去了公园。",
        tokens: ["Yesterday", "I", "went", "to", "the", "park."],
        answer: "Yesterday I went to the park.",
        explain: "复现第 10 课：yesterday 在场，动词换昨天版 went。"
      },
      {
        // R9 变形/替换：换数量（一个→两个），名词变复数（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I ate a sandwich.」把「一个」换成「两个（two）」，sandwich 要怎么变？",
        replaceBase: "I ate a sandwich.",
        replaceTarget: "把 a 换成 two",
        options: ["sandwiches", "sandwich", "sandwichs"],
        answer: "sandwiches",
        explain: "两个以上，sandwich 要加 es 变 sandwiches——ch 结尾加 es。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：昨天我喝了茶。",
        tokens: ["drank", "I", "tea."],
        distractors: ["drink"],
        answer: "I drank tea."
      },
      {
        promptZh: "你想说：我有三个哥哥。",
        tokens: ["three", "I", "brothers.", "have"],
        distractors: ["brother"],
        answer: "I have three brothers."
      },
      {
        promptZh: "文具店买笔，你想说：我买了四支笔。",
        tokens: ["four", "bought", "I", "pens."],
        distractors: ["buy"],
        answer: "I bought four pens."
      },
      {
        promptZh: "朋友好奇你的午餐，问你：你吃了什么？",
        tokens: ["did", "eat?", "What", "you"],
        distractors: ["ate"],
        answer: "What did you eat?"
      }
    ],
    // R5「忆」段：遮盖回忆——不给选项，凭记忆还原核心句
    recall: {
      promptZh: "好朋友发消息问你，昨天中午吃了什么。",
      intentZh: "我吃了两个三明治。",
      answer: "I ate two sandwiches.",
      noteZh: "两个以上要加 s；sandwich 以 ch 结尾，复数是 sandwiches。"
    },
    huntCaseIds: ["hunt-breakfast", "hunt-uncountable", "hunt-passive"]
  },
  {
    id: "lesson-12-will",
    number: 12,
    title: "明天要画画",
    grammarLabel: "will 将来时",
    episode: "小美的一天 ⑫",
    scene: "magic",
    cover: cover12,
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
      },
      {
        wrong: "I will drawing.",
        wrongMark: "drawing",
        correct: "I will draw.",
        whyZh: "will 后面的动词穿原样：will draw。-ing 要 be 搭着才是「正在做」；这里没有 be，就不用它。"
      },
      {
        wrong: "She wills draw.",
        wrongMark: "wills",
        correct: "She will draw.",
        whyZh: "will 和 can 一样从不变形：不管主语是谁都是 will，没有 wills 这种形状。"
      },
      {
        wrong: "I not will go.",
        wrongMark: "not will",
        correct: "I will not go.",
        whyZh: "「不去（将）」要把 not 放在 will 后面：will not（可缩成 won't）。not 不能跑到 will 前面。"
      },
      {
        wrong: "Will you goes tomorrow?",
        wrongMark: "goes",
        correct: "Will you go tomorrow?",
        whyZh: "Will 搬到句首问话，动词照样穿原样 go：Will you go……？三单 -s 管不到 will。"
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
      },
      {
        // R8 跨课复现：上一课（L11 复数+不规则过去式）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：我吃了两个三明治。",
        tokens: ["I", "ate", "two", "sandwiches."],
        answer: "I ate two sandwiches.",
        explain: "复现第 11 课：两个以上，sandwich 加 es。"
      },
      {
        // R9 变形/替换：换时间（今天→明天），动词时态跟着换（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I draw a picture today.」把「今天」换成「明天」，draw 前要加什么？",
        replaceBase: "I draw a picture today.",
        replaceTarget: "把 today 换成 tomorrow",
        options: ["will", "am", "did"],
        answer: "will",
        explain: "说「明天要做」，动词前面放 will：I will draw tomorrow。will 出场动词穿原样。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：明天会下雨。",
        tokens: ["rain.", "It", "will"],
        distractors: ["rains"],
        answer: "It will rain."
      },
      {
        promptZh: "你想说：我明天会给你打电话。",
        tokens: ["you", "call", "I", "tomorrow.", "will"],
        distractors: ["called"],
        answer: "I will call you tomorrow."
      },
      {
        promptZh: "跟朋友约明天跑步，你想说：我明天会跑步。",
        tokens: ["run", "will", "I", "tomorrow."],
        distractors: ["to"],
        answer: "I will run tomorrow."
      },
      {
        promptZh: "出门前看了眼天，你想说：它不会下雨。",
        tokens: ["It", "not", "rain.", "will"],
        distractors: ["rained"],
        answer: "It will not rain."
      }
    ],
    // R5「忆」段：遮盖回忆——不给选项，凭记忆还原核心句
    recall: {
      promptZh: "睡觉前，你在日记本上写下明天的计划。",
      intentZh: "我明天要画画。",
      answer: "I will draw tomorrow.",
      noteZh: "明天的事在动词前面加 will，动词本身保持原样。"
    },
    huntCaseIds: ["hunt-because-so", "hunt-word-order"]
  },
  {
    // ── 第二季进阶篇 · R1（L13 现在进行时）：中文「正在」零成本映射，进阶缓冲坡第一课 ──
    id: "lesson-13-now",
    number: 13,
    title: "正在做什么",
    grammarLabel: "现在进行时 · am/is/are + V-ing",
    episode: "小美的一天 ⑬",
    scene: "campus",
    cover: cover13,
    sceneSetupZh: "周六上午，小美回到学校的美术教室，大家都在忙各自的事。",
    dialogueEn: "What are you doing?",
    dialogueZh: "推门进来的同学小声问你。",
    intentZh: "我正在画一幅画。",
    targetSentence: "I am drawing a picture.",
    blocks: [
      { text: "I", role: "我" },
      { text: "am", role: "正在（我专用）" },
      { text: "drawing", role: "画（-ing 版）" },
      { text: "a picture", role: "一幅画" }
    ],
    oneLineRule: "说「正在做」：be 动词 + 动词ing——I am drawing，be 和 -ing 一个都不能少。",
    examples: [
      { en: "She is reading.", zh: "她正在看书。" },
      { en: "They are playing football.", zh: "他们正在踢足球。" },
      { en: "I am not sleeping.", zh: "我没在睡觉。" },
      { en: "What are you doing?", zh: "你在做什么？" }
    ],
    dialogue: [
      { who: "npc", en: "What are you doing?", zh: "推门进来的同学小声问你。" },
      { who: "npc", en: "It looks nice!", zh: "她凑近看了看你的画纸说。" },
      { who: "me", en: "I am drawing a picture.", zh: "轮到你说了——你正在画一幅画。" }
    ],
    contrast: [
      {
        wrong: "She drawing a bird.",
        wrongMark: null,
        correct: "She is drawing a bird.",
        whyZh: "中文说「她在画画」可以不用「是」，但英语的 be 动词不能丢——丢了，句子就塌了。"
      },
      {
        wrong: "I am draw a picture.",
        wrongMark: "draw",
        correct: "I am drawing a picture.",
        whyZh: "说「正在做」，动词要穿 -ing 这件外套：draw → drawing。"
      },
      {
        wrong: "They is playing football.",
        wrongMark: "is",
        correct: "They are playing football.",
        whyZh: "they 的搭档是 are 不是 is。一伙人做事，be 动词要用 are。"
      },
      {
        wrong: "He are sleeping.",
        wrongMark: "are",
        correct: "He is sleeping.",
        whyZh: "he 是单数，搭档是 is。are 是 you/we/they 这些「多数派」的搭档。"
      },
      {
        wrong: "I am not sleep.",
        wrongMark: "sleep",
        correct: "I am not sleeping.",
        whyZh: "否定句里动词照样要穿 -ing 外套：am not sleeping，外套不能脱。"
      },
      {
        wrong: "What you are doing?",
        wrongMark: "you are",
        correct: "What are you doing?",
        whyZh: "问句里 are 要搬到主语 you 前面：What are you doing？语序要换位置。"
      }
    ],
    variants: [
      { label: "肯定", en: "I am drawing a picture.", zh: "我正在画一幅画。" },
      { label: "否定", en: "I am not sleeping.", zh: "我没在睡觉。", noteZh: "在 am 后面加 not，就是「没在」。" },
      { label: "疑问", en: "What are you doing?", zh: "你在做什么呢？", noteZh: "问别人正在做什么：What 放句首，Are 跟上来。" }
    ],
    sceneSwings: [
      { sceneZh: "走廊里，老师问你找什么", en: "I am looking for my teacher.", zh: "我正在找老师。" },
      { sceneZh: "操场边，你指着同学们说", en: "They are playing basketball.", zh: "他们正在打篮球。" },
      { sceneZh: "电话里，妈妈问你在干嘛", en: "I am doing my homework.", zh: "我正在写作业。" }
    ],
    deepDive: {
      title: "动词的 -ing 外套怎么穿？",
      paragraphs: [
        "大多数动词直接加 -ing：draw → drawing，read → reading，listen → listening。",
        "少数短动词要双写最后一个字母再加：sit → sitting，run → running，swim → swimming——短衣服要先缝双针再接袖。",
        "进行时的 be 就是老搭档 am / is / are：I 用 am，he/she 用 is，you/we/they 用 are。这些搭档你在第 1、2、7 课已经练熟了。"
      ]
    },
    summary: {
      rule: "说「正在做」：be（am/is/are）+ 动词ing，两个都不能少。",
      points: [
        "I am drawing. —— be + 动词ing",
        "She is not reading. —— 没在做：be 后面加 not",
        "What are you doing? —— 问对方：What 开头，Are 跟上"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：她正在看书。",
        before: "She",
        after: "reading.",
        options: ["is", "am", "are"],
        answer: "is",
        explain: "She 的搭档是 is：She is reading。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我正在画一幅画。",
        tokens: ["I", "am", "drawing", "a", "picture."],
      answer: "I am drawing a picture.",
        explain: "am 和 drawing 手拉手，谁也不许缺席。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：他们正在踢足球。",
        tokens: ["They", "are", "playing", "football."],
        answer: "They are playing football.",
        explain: "they 的搭档是 are，playing 穿好 -ing 外套。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["He", "is", "sleep", "now."],
        wrongToken: "sleep",
        answer: "sleep",
        correctionZh: "把 sleep 换成 sleeping：He is sleeping now。",
        explain: "is 后面的动词要穿 -ing 外套。"
      },
      {
        // R8 跨课复现：上一课（L12 will）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：明天要画画。",
        tokens: ["I", "will", "draw", "tomorrow."],
        answer: "I will draw tomorrow.",
        explain: "复现第 12 课：will 后面的动词穿原样。"
      },
      {
        // R9 变形/替换：换主语 I→She，be 动词跟着变（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I am drawing.」把主语 I 换成 She，动词要怎么变？",
        replaceBase: "I am drawing.",
        replaceTarget: "把 I 换成 She",
        options: ["is", "am", "are"],
        answer: "is",
        explain: "I 的搭档是 am，但 She 的搭档要换成 is：She is drawing."
      }
    ],
    practice: [
      {
        promptZh: "你想说：我正在读书。",
        tokens: ["I", "am", "reading", "a", "book."],
        distractors: ["is", "draw"],
        answer: "I am reading a book."
      },
      {
        promptZh: "你想说：她正在听音乐。",
        tokens: ["She", "is", "listening", "to", "music."],
        distractors: ["are", "listen"],
        answer: "She is listening to music."
      },
      {
        promptZh: "电话里妈妈问你在干嘛，你想说：我正在写作业。",
        tokens: ["my", "I", "doing", "am", "homework."],
        distractors: ["is"],
        answer: "I am doing my homework."
      },
      {
        promptZh: "想问同学在忙什么，你想说：你在做什么呢？",
        tokens: ["What", "are", "you", "doing?"],
        distractors: ["is"],
        answer: "What are you doing?"
      }
    ],
    // R5「忆」段：遮盖回忆——不给选项，凭记忆还原核心句
    recall: {
      promptZh: "周六上午的美术教室里，你正在画一幅画。凭记忆，写出这句英文。",
      intentZh: "我正在画一幅画。",
      answer: "I am drawing a picture."
    },
    // R7：每课 1–2 案（本案讲「演出正当时」，与进行时同主题）
    huntCaseIds: ["hunt-kitchen-note", "hunt-school-show"]
  },
  {
    // ── 第二季进阶篇 · R2（L14 can）：点餐/求助刚需，疑问语序靠 arrange 题练 ──
    id: "lesson-14-can",
    number: 14,
    title: "我能点这个吗",
    grammarLabel: "情态动词 · can",
    episode: "小美的一天 ⑭",
    scene: "city",
    cover: cover14,
    sceneSetupZh: "放学路上，小美和同学拐进街角的奶茶店，排起了队。",
    dialogueEn: "Can I help you?",
    dialogueZh: "店员微笑着问你。",
    intentZh: "我能要一杯奶茶吗？",
    targetSentence: "Can I have a milk tea?",
    blocks: [
      { text: "Can", role: "能（搬到句首）" },
      { text: "I", role: "我" },
      { text: "have", role: "要" },
      { text: "a milk tea", role: "一杯奶茶" }
    ],
    oneLineRule: "说「能/会」，动词前面放 can，动词一点不变：I can swim。问「能不能」，把 Can 搬到句首。",
    examples: [
      { en: "I can swim.", zh: "我会游泳。" },
      { en: "She can sing very well.", zh: "她唱歌很好听。" },
      { en: "Can I have a milk tea?", zh: "我能要一杯奶茶吗？" },
      { en: "You can sit here.", zh: "你可以坐这儿。" }
    ],
    dialogue: [
      { who: "npc", en: "Can I help you?", zh: "店员微笑着问你。" },
      { who: "npc", en: "The milk tea here is nice.", zh: "她又补了一句：这儿的奶茶很不错。" },
      { who: "me", en: "Can I have a milk tea?", zh: "轮到你说了——你要一杯奶茶。" }
    ],
    contrast: [
      {
        wrong: "I can to swim.",
        wrongMark: "to",
        correct: "I can swim.",
        whyZh: "can 和 will 是一家的：后面动词直接跟，中间不垫 to。"
      },
      {
        wrong: "She cans dance.",
        wrongMark: "cans",
        correct: "She can dance.",
        whyZh: "can 从来不变形：不管主语是谁都是 can，没有 cans 这种形状。"
      },
      {
        wrong: "I can swimming.",
        wrongMark: "swimming",
        correct: "I can swim.",
        whyZh: "can 后面的动词穿原样：can swim。-ing 要 be 搭着才是「正在做」；这里没有 be，就不用它。"
      },
      {
        wrong: "Can he plays football?",
        wrongMark: "plays",
        correct: "Can he play football?",
        whyZh: "有 can 在前面扛变化，动词打回原形：Can he play。三单 -s 管不到 can。"
      },
      {
        wrong: "I not can swim.",
        wrongMark: "not can",
        correct: "I can't swim.",
        whyZh: "「不能」要把 not 贴在 can 后面：can't。顺序不能倒，not 不能跑到 can 前面。"
      },
      {
        wrong: "Do you can swim?",
        wrongMark: "Do you can",
        correct: "Can you swim?",
        whyZh: "问「会不会」直接把 Can 搬到句首就行，不用再请 Do 来帮忙：Can you swim？"
      }
    ],
    variants: [
      { label: "肯定", en: "I can swim.", zh: "我会游泳。" },
      { label: "否定", en: "I can't swim.", zh: "我不会游泳。", noteZh: "can not 缩写成 can't，意思一样。" },
      { label: "疑问", en: "Can you swim?", zh: "你会游泳吗？", noteZh: "把 Can 搬到句首就是问句。回答：Yes, I can. / No, I can't." }
    ],
    sceneSwings: [
      { sceneZh: "在图书馆，你想问能不能看书", en: "Can I read this book?", zh: "我能看这本书吗？" },
      { sceneZh: "同学抱着一摞作业本，你起身说", en: "I can help you.", zh: "我可以帮你。" },
      { sceneZh: "朋友问你擅长什么运动", en: "I can play football.", zh: "我会踢足球。" }
    ],
    deepDive: {
      title: "为什么 can 后面的动词永远不变形？",
      paragraphs: [
        "英语里有几个「不变词」，can 和 will 是一家：所有变化都由它们扛，动词穿原样就行——can go、can eat、can play，永远不会跑形。",
        "can 也没有三单：He can swim，不是 He cans swim。三单 -s 是一般现在时的规矩，管不到 can。",
        "can't 读起来和 can 差别很大：听到句尾那个「特」的音，就是「不能」。写的时候别丢掉那个小撇号。"
      ]
    },
    summary: {
      rule: "能/会 = can + 动词原形；问句把 Can 搬到句首。",
      points: [
        "I can swim. —— can + 动词原形",
        "I can't swim. —— 不会：can 后面加 not（can't）",
        "Can you swim? —— 问别人：Can 搬到句首"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我会游泳。",
        before: "I",
        after: "swim.",
        options: ["can", "am", "want"],
        answer: "can",
        explain: "说「能/会」用 can：I can swim。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我能要一杯奶茶吗？",
        tokens: ["Can", "I", "have", "a", "milk", "tea?"],
      answer: "Can I have a milk tea?",
        explain: "问「能不能」，Can 搬到句首，后面的词照旧排队。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：她会唱歌。",
        tokens: ["She", "can", "sing", "very", "well."],
        answer: "She can sing very well.",
        explain: "can 后面的动词穿原样：can sing。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["He", "cans", "play", "football."],
        wrongToken: "cans",
        answer: "cans",
        correctionZh: "把 cans 换回 can：He can play football。",
        explain: "can 永远不变形，没有 cans 这种形状。"
      },
      {
        // R9 变形/替换：换主语 I→He，can 不变、动词穿原样（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I can swim.」把主语 I 换成 He，swim 要怎么变？",
        replaceBase: "I can swim.",
        replaceTarget: "把 I 换成 He",
        options: ["swim", "swims", "swimming"],
        answer: "swim",
        explain: "can 后面的动词永远穿原样：He can swim。三单 -s 管不到 can。"
      },
      {
        // R8 跨课复现：上一课（L13 进行时）的句式混入
        kind: "arrange",
        promptZh: "上一课学过：她正在看书。还记得吗？",
        tokens: ["She", "is", "reading", "a", "book."],
        answer: "She is reading a book.",
        explain: "复现第 13 课：be + V-ing，两个都不能少。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我会游泳。",
        tokens: ["I", "can", "swim."],
        distractors: ["cans", "swimming"],
        answer: "I can swim."
      },
      {
        promptZh: "你想说：他会踢足球。",
        tokens: ["He", "can", "play", "football."],
        distractors: ["plays"],
        answer: "He can play football."
      },
      {
        promptZh: "在图书馆，你想问：我能看这本书吗？",
        tokens: ["Can", "I", "read", "this", "book?"],
        distractors: ["Is"],
        answer: "Can I read this book?"
      },
      {
        promptZh: "朋友问你不会什么，你想说：我不会游泳。",
        tokens: ["I", "can't", "swim."],
        distractors: ["can"],
        answer: "I can't swim."
      }
    ],
    // R5「忆」段：不给选项，凭记忆还原核心句
    recall: {
      promptZh: "奶茶店里，店员问你要点什么。凭记忆，写出你要说的那句英文。",
      intentZh: "我能要一杯奶茶吗？",
      answer: "Can I have a milk tea?",
      noteZh: "问「能不能」，把 Can 搬到句首：Can I have……？"
    },
    // R7：每课 1–2 案（本案复习三单旧知，螺旋混题）
    huntCaseIds: ["hunt-cafe-order", "hunt-my-sister"]
  },
  {
    // ── 第二季进阶篇 · R3（L15 want to）：中文「想去」直接接动词，英语要垫 to ──
    id: "lesson-15-want-to",
    number: 15,
    title: "我想去旅行",
    grammarLabel: "want to + 动词原形",
    episode: "小美的一天 ⑮",
    scene: "train",
    cover: cover15,
    sceneSetupZh: "暑假前最后一节课，小美在笔记本上偷偷写暑假计划。",
    dialogueEn: "Where do you want to go?",
    dialogueZh: "同桌凑过来看她的笔记本。",
    intentZh: "我想去旅行。",
    targetSentence: "I want to travel.",
    blocks: [
      { text: "I", role: "我" },
      { text: "want", role: "想要" },
      { text: "to", role: "小垫板" },
      { text: "travel", role: "旅行（原样）" }
    ],
    oneLineRule: "「想做……」= want to + 动词原形：I want to travel。want 后面要垫一块小垫板 to。",
    examples: [
      { en: "I want to sleep.", zh: "我想睡觉。" },
      { en: "She wants to read a book.", zh: "她想读一本书。" },
      { en: "Do you want to play?", zh: "你想一起玩吗？" },
      { en: "We want to go home.", zh: "我们想回家。" }
    ],
    dialogue: [
      { who: "npc", en: "Where do you want to go?", zh: "同桌凑过来问她。" },
      { who: "npc", en: "The beach? The mountains?", zh: "她一边写一边猜。" },
      { who: "me", en: "I want to travel.", zh: "轮到你说了——你想去旅行。" }
    ],
    contrast: [
      {
        wrong: "I want go home.",
        wrongMark: null,
        correct: "I want to go home.",
        whyZh: "中文「想去」后面直接接动词，但英语 want 后面要垫一个小小的 to，动词才踩得上去。"
      },
      {
        wrong: "She wants to travels.",
        wrongMark: "travels",
        correct: "She wants to travel.",
        whyZh: "变形的事已经由 wants 做完了（三单加 -s），to 后面的动词永远穿原样。"
      },
      {
        wrong: "She want to read.",
        wrongMark: "want",
        correct: "She wants to read.",
        whyZh: "「她想读」，want 要换三单 wants。变形的是 want 自己，不是 to 后面的词。"
      },
      {
        wrong: "I want to going home.",
        wrongMark: "going",
        correct: "I want to go home.",
        whyZh: "to 后面的动词穿原样：want to go。-ing 要 be 搭着才是「正在做」；这里没有 be，就不用它。"
      },
      {
        wrong: "I don't want go.",
        wrongMark: "want go",
        correct: "I don't want to go.",
        whyZh: "加了 don't，to 这块小垫板也不能丢：don't want to go。垫板和否定是两回事。"
      },
      {
        wrong: "Want you to play?",
        wrongMark: "Want you",
        correct: "Do you want to play?",
        whyZh: "问「想不想」要把 Do 搬到句首来帮忙：Do you want to……？want 自己不会问话。"
      }
    ],
    variants: [
      { label: "肯定", en: "I want to travel.", zh: "我想去旅行。" },
      { label: "否定", en: "I don't want to go.", zh: "我不想去了。", noteZh: "在 want 前面加 don't：don't want to。" },
      { label: "疑问", en: "Do you want to play?", zh: "你想一起玩吗？", noteZh: "把 Do 搬到句首来问：Do you want to……？" }
    ],
    sceneSwings: [
      { sceneZh: "周末晚上，你和朋友约电影", en: "I want to watch a movie.", zh: "我想看电影。" },
      { sceneZh: "午餐时间，肚子咕咕叫", en: "I want to eat noodles.", zh: "我想吃面条。" },
      { sceneZh: "写作业写累了，你伸个懒腰", en: "I want to go home.", zh: "我想回家。" }
    ],
    deepDive: {
      title: "为什么 want 后面要垫一个 to？",
      paragraphs: [
        "want 是「想要」，但它自己迈不开步——后面跟的动词要踩着 to 这块小垫板才能出场：want to go、want to eat。",
        "to 后面的动词永远穿原样：want to go、wants to go、wanted to go——变的只有 want 自己，to 后面从不动。",
        "想问别人「想不想」，把 Do 搬到句首：Do you want to play？回答：Yes, I do. / No, I don't."
      ]
    },
    summary: {
      rule: "想做……= want to + 动词原形，to 这块小垫板不能丢。",
      points: [
        "I want to travel. —— want + to + 原形",
        "She wants to read. —— 三单是 wants，to 后面照样原形",
        "Do you want to play? —— 问别人：Do 搬到句首"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我想睡觉。",
        before: "I want",
        after: "sleep.",
        options: ["to", "too", "at"],
        answer: "to",
        explain: "want 后面垫 to，动词踩上去：want to sleep。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我想去旅行。",
        tokens: ["I", "want", "to", "travel."],
      answer: "I want to travel.",
        explain: "want to 手拉手出场，travel 保持原样。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：她想读一本书。",
        tokens: ["She", "wants", "to", "read", "a", "book."],
        answer: "She wants to read a book.",
        explain: "三单是 wants，但 to 后面的 read 照样穿原样。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["He", "wants", "to", "plays", "football."],
        wrongToken: "plays",
        answer: "plays",
        correctionZh: "把 plays 换回原形 play：He wants to play football。",
        explain: "to 后面的动词永远穿原样。"
      },
      {
        // R8 跨课复现：上一课（L14 can）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：我会游泳。",
        tokens: ["I", "can", "swim."],
        answer: "I can swim.",
        explain: "复现第 14 课：can 后面的动词穿原样。"
      },
      {
        // R9 变形/替换：换主语 I→She，want 变三单 wants（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I want to travel.」把主语 I 换成 She，want 要怎么变？",
        replaceBase: "I want to travel.",
        replaceTarget: "把 I 换成 She",
        options: ["wants", "want", "wanted"],
        answer: "wants",
        explain: "She 是单数，want 要换三单 wants：She wants to travel。但 to 后面照样原形。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我想回家。",
        tokens: ["I", "want", "to", "go", "home."],
        distractors: ["wants"],
        answer: "I want to go home."
      },
      {
        promptZh: "你想说：他想吃东西。",
        tokens: ["He", "wants", "to", "eat", "something."],
        distractors: ["want", "eating"],
        answer: "He wants to eat something."
      },
      {
        promptZh: "朋友问你要不要一起玩，你想说：我想看电影。",
        tokens: ["I", "want", "to", "watch", "a", "movie."],
        distractors: ["watches"],
        answer: "I want to watch a movie."
      },
      {
        promptZh: "天太晚了，你想说：我不想去了。",
        tokens: ["I", "don't", "want", "to", "go."],
        distractors: ["doesn't"],
        answer: "I don't want to go."
      }
    ],
    // R5「忆」段：不给选项，凭记忆还原核心句
    recall: {
      promptZh: "笔记本上写着你的暑假心愿。凭记忆，写出这句英文。",
      intentZh: "我想去旅行。",
      answer: "I want to travel.",
      noteZh: "want 后面要垫一块小垫板 to，动词踩上去。"
    },
    // R7：每课 1–2 案（本案含 want to 句式，主题契合）
    huntCaseIds: ["hunt-travel-plan", "hunt-weekend-plan"]
  },
  {
    // ── 第二季进阶篇 · R4（L16 must / have to）：情态动词第二课，后接原形 + 从不变形 ──
    id: "lesson-16-must",
    number: 16,
    title: "今天必须交作业",
    grammarLabel: "情态动词 · must / have to",
    episode: "小美的一天 ⑯",
    scene: "campus",
    cover: cover16,
    sceneSetupZh: "早读课，组长站在课桌前收作业，小美突然想起来什么。",
    dialogueEn: "Don't forget your homework!",
    dialogueZh: "组长提醒她。",
    intentZh: "我今天必须交作业。",
    targetSentence: "I must finish my homework today.",
    blocks: [
      { text: "I", role: "我" },
      { text: "must", role: "必须（不变形）" },
      { text: "finish", role: "完成（原样）" },
      { text: "my homework", role: "我的作业" }
    ],
    oneLineRule: "说「必须」：must + 动词原形——I must go。must 和 can 一样，从来不变形。",
    examples: [
      { en: "I must go now.", zh: "我现在必须走了。" },
      { en: "She must finish it today.", zh: "她今天必须完成它。" },
      { en: "I have to get up early.", zh: "我不得不早起。" },
      { en: "You must not be late.", zh: "你千万不要迟到。" }
    ],
    dialogue: [
      { who: "npc", en: "Don't forget your homework!", zh: "组长站在课桌前提醒她。" },
      { who: "npc", en: "The teacher wants it today.", zh: "她补了一句：老师今天就要。" },
      { who: "me", en: "I must finish my homework today.", zh: "轮到你说了——你今天必须交作业。" }
    ],
    contrast: [
      {
        wrong: "I must going now.",
        wrongMark: "going",
        correct: "I must go now.",
        whyZh: "must 后面的动词穿原形：must go。going 的 -ing 外套，must 不认。"
      },
      {
        wrong: "She musts finish it.",
        wrongMark: "musts",
        correct: "She must finish it.",
        whyZh: "must 和 can 一样从不变形：不管主语是谁都是 must，没有 musts 这种形状。"
      },
      {
        wrong: "I must to go.",
        wrongMark: "to",
        correct: "I must go.",
        whyZh: "must 和 can 是一家的：后面动词直接跟，中间不垫 to。要垫 to 的是 have to。"
      },
      {
        wrong: "She have to get up early.",
        wrongMark: "have",
        correct: "She has to get up early.",
        whyZh: "have to 里的 have 要变三单：she has to。must 不变形，但 have to 的 have 会变。"
      },
      {
        wrong: "You must not to be late.",
        wrongMark: "to be",
        correct: "You must not be late.",
        whyZh: "must not 后面照样跟原形 be：must not be。not 不改变「must 后面穿原形」的规矩。"
      },
      {
        wrong: "Must you to go now?",
        wrongMark: "to go",
        correct: "Must you go now?",
        whyZh: "Must 搬到句首问话，后面的动词还是原形 go，不垫 to：Must you go？"
      }
    ],
    variants: [
      { label: "肯定", en: "I must finish my homework today.", zh: "我今天必须完成作业。" },
      { label: "否定", en: "You must not be late.", zh: "你千万不要迟到。", noteZh: "must 后面加 not 是「禁止、千万别」，语气很重。" },
      { label: "疑问", en: "Must I go now?", zh: "我必须现在去吗？", noteZh: "把 Must 搬到句首。回答常是：Yes, you must. / No, you don't have to." }
    ],
    sceneSwings: [
      { sceneZh: "红灯亮了，你拉住同学", en: "We must stop.", zh: "我们必须停下来。" },
      { sceneZh: "在图书馆里，你小声说", en: "I have to be quiet.", zh: "我必须安静。" },
      { sceneZh: "吃饭前，妈妈指着你的手说", en: "You must wash your hands.", zh: "你必须洗手。" }
    ],
    deepDive: {
      title: "must 和 have to 有什么不一样？",
      paragraphs: [
        "意思很近，口气不同：must 多是「自己要求自己，或规矩要求」——I must study（我要学）；have to 多是「外面的情况逼着你」——I have to get up early（不得不早起）。",
        "否定刚好相反，千万别弄反：must not 是「禁止」，don't have to 是「不用、没必要」——You must not run（禁止跑）/ You don't have to run（不用跑）。",
        "它们后面都跟动词原形：must go、have to go——这一课的形状和上一课的 can 完全一样。"
      ]
    },
    summary: {
      rule: "必须 = must / have to + 动词原形，情态动词从不变形。",
      points: [
        "I must go now. —— must + 原形",
        "She musts ❌ → She must ✅ —— must 不变形",
        "I have to get up early. —— have to = 外面情况逼着的「必须」"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我现在必须走。",
        before: "I must",
        after: "now.",
        options: ["go", "goes", "going"],
        answer: "go",
        explain: "must 后面的动词穿原形：must go。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我今天必须完成作业。",
        tokens: ["I", "must", "finish", "my", "homework", "today."],
      answer: "I must finish my homework today.",
        explain: "must 站在原形动词前面，finish 一点不变。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我明天必须早起。",
        tokens: ["I", "have", "to", "get", "up", "early", "tomorrow."],
        answer: "I have to get up early tomorrow.",
        explain: "have to 也是「必须」：have to + 原形。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["She", "musts", "clean", "her", "room."],
        wrongToken: "musts",
        answer: "musts",
        correctionZh: "把 musts 换回 must：She must clean her room。",
        explain: "must 从不变形，没有 musts。"
      },
      {
        // R8 跨课复现：上一课（L15 want to）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：我想去旅行。",
        tokens: ["I", "want", "to", "travel."],
        answer: "I want to travel.",
        explain: "复现第 15 课：want 后面垫 to，动词穿原样。"
      },
      {
        // R9 变形/替换：换主语 I→She，must 不变（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I must go now.」把主语 I 换成 She，must 要怎么变？",
        replaceBase: "I must go now.",
        replaceTarget: "把 I 换成 She",
        options: ["must", "musts", "have to"],
        answer: "must",
        explain: "must 从不变形：She must go。这是它和 have to 最大的不一样。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我现在必须走。",
        tokens: ["I", "must", "go", "now."],
        distractors: ["goes", "going"],
        answer: "I must go now."
      },
      {
        promptZh: "图书馆里，你想说：我必须安静。",
        tokens: ["I", "have", "to", "be", "quiet."],
        distractors: ["has"],
        answer: "I have to be quiet."
      },
      {
        promptZh: "跟同学约好六点起床跑步，你想说：我必须早起。",
        tokens: ["I", "must", "get", "up", "early."],
        distractors: ["getting"],
        answer: "I must get up early."
      },
      {
        promptZh: "上学快迟到了，妈妈提醒你：你千万不要迟到。",
        tokens: ["You", "must", "not", "be", "late."],
        distractors: ["don't"],
        answer: "You must not be late."
      }
    ],
    // R5「忆」段：不给选项，凭记忆还原核心句
    recall: {
      promptZh: "组长站在课桌前收作业。凭记忆，写出你心里想的那句英文。",
      intentZh: "我今天必须交作业。",
      answer: "I must finish my homework today.",
      noteZh: "must 后面的动词穿原形，must 自己从不变形。"
    },
    huntCaseIds: ["hunt-desk-rules"]
  },
  {
    // ── 第二季进阶篇 · R5（L17 比较级）：-er / more 双轨入门，better 不规则进深挖 ──
    id: "lesson-17-comparative",
    number: 17,
    title: "更大、更好、更快",
    grammarLabel: "形容词比较级 · -er / more",
    episode: "小美的一天 ⑰",
    scene: "island",
    cover: cover17,
    sceneSetupZh: "海边春游，小美和同学并排坐在沙滩上看两艘小船。",
    dialogueEn: "Which one is bigger?",
    dialogueZh: "同学指着眼前的两艘船问你。",
    intentZh: "这条船比那条大。",
    targetSentence: "This boat is bigger than that one.",
    blocks: [
      { text: "This boat", role: "这条船" },
      { text: "is", role: "是" },
      { text: "bigger", role: "更大（-er 版）" },
      { text: "than that one", role: "比那条" }
    ],
    oneLineRule: "比「更……」：短的形容词加 -er（bigger），长的请 more 帮忙（more beautiful），再用 than 接住比较的对象。",
    examples: [
      { en: "I am taller than my sister.", zh: "我比我姐姐高。" },
      { en: "Today is hotter than yesterday.", zh: "今天比昨天热。" },
      { en: "This flower is more beautiful than that one.", zh: "这朵花比那朵好看。" },
      { en: "This book is better than that one.", zh: "这本书比那本好。" }
    ],
    dialogue: [
      { who: "npc", en: "Which one is bigger?", zh: "同学指着两艘船问你。" },
      { who: "npc", en: "The white one or the blue one?", zh: "她又追问了一句。" },
      { who: "me", en: "This boat is bigger than that one.", zh: "轮到你说了——这条船比那条大。" }
    ],
    contrast: [
      {
        wrong: "This boat is big than that one.",
        wrongMark: "big",
        correct: "This boat is bigger than that one.",
        whyZh: "比「更」要用 -er 形状：big 要双写 g 再加 -er，变成 bigger。"
      },
      {
        wrong: "This flower is beautifuller than that one.",
        wrongMark: "beautifuller",
        correct: "This flower is more beautiful than that one.",
        whyZh: "长的形容词搬不动，不自己加 -er，请 more 站在前面帮忙。"
      },
      {
        wrong: "This tree is more taller than that one.",
        wrongMark: "more",
        correct: "This tree is taller than that one.",
        whyZh: "-er 和 more 只能用一个，不能双份：taller 已经带了 -er，more 就不用来了。"
      },
      {
        wrong: "I am taller that my sister.",
        wrongMark: "that",
        correct: "I am taller than my sister.",
        whyZh: "比「更」要用 than 接住比较的对象：taller than。than 和 that 长得像，别认错。"
      },
      {
        wrong: "This book is gooder than that one.",
        wrongMark: "gooder",
        correct: "This book is better than that one.",
        whyZh: "good 的「更好」是 better，不是 gooder。它和 go→went 一样是不守规矩的，要单独记。"
      },
      {
        wrong: "Today is hoter than yesterday.",
        wrongMark: "hoter",
        correct: "Today is hotter than yesterday.",
        whyZh: "hot 这种短促有力的词，加 -er 前要双写最后一个字母：hotter——和 running 双写 n 一个道理。"
      }
    ],
    variants: [
      { label: "肯定", en: "This boat is bigger than that one.", zh: "这条船比那条大。" },
      { label: "否定", en: "She is not older than me.", zh: "她年纪不比我大。", noteZh: "否定只要把 not 放回 be 后面，比较级不变。" },
      { label: "疑问", en: "Is this boat bigger than that one?", zh: "这条船比那条大吗？", noteZh: "把 Is 搬到句首就是问句。" }
    ],
    sceneSwings: [
      { sceneZh: "水果摊前，你挑苹果", en: "This apple is bigger than that one.", zh: "这个苹果比那个大。" },
      { sceneZh: "出门前看了看天", en: "Today is hotter than yesterday.", zh: "今天比昨天热。" },
      { sceneZh: "和哥哥背靠背比身高", en: "I am taller than my brother.", zh: "我比我哥哥高。" }
    ],
    deepDive: {
      title: "-er 和 more，什么时候用哪个？",
      paragraphs: [
        "短的形容词（一两个音节）自己加 -er：tall → taller，old → older，fast → faster。",
        "长的形容词（三个音节以上）搬不动，请 more 来帮忙：more beautiful，more interesting。",
        "像 big、hot 这种短促有力的词，加 -er 前要双写最后一个字母：bigger、hotter——和 running 的双写是同一个道理。",
        "也有几个不守规矩的：good 的「更好」是 better，bad 的「更坏」是 worse——像 go 的昨天版是 went 一样，要单独记住。"
      ]
    },
    summary: {
      rule: "更……= 短词加 -er，长词用 more，后面用 than 接住比较对象。",
      points: [
        "bigger than —— 短词：双写再加 -er",
        "more beautiful than —— 长词：more 站前面",
        "good → better —— 不规则形状，单独记"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我比我姐姐高。",
        before: "I am",
        after: "than my sister.",
        options: ["taller", "tall", "tallest"],
        answer: "taller",
        explain: "比「更高」用 -er 形状：taller than。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：这条船比那条大。",
        tokens: ["This", "boat", "is", "bigger", "than", "that", "one."],
      answer: "This boat is bigger than that one.",
        explain: "bigger 比「更大」，than 接住比较的对象。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：今天比昨天热。",
        tokens: ["Today", "is", "hotter", "than", "yesterday."],
        answer: "Today is hotter than yesterday.",
        explain: "hot 双写 t 再加 -er：hotter。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["This", "tree", "is", "more", "taller", "than", "that", "one."],
        wrongToken: "more",
        answer: "more",
        correctionZh: "more 和 taller 不能同时出场，留一个就行：This tree is taller than that one。",
        explain: "-er 和 more 只能用一个，不能双份。"
      },
      {
        // R8 跨课复现：上一课（L16 must）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：我现在必须走。",
        tokens: ["I", "must", "go", "now."],
        answer: "I must go now.",
        explain: "复现第 16 课：must 后面的动词穿原形。"
      },
      {
        // R9 变形/替换：换形容词 short→long（短词 -er 变长词 more），比较级形状跟着变（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「This boat is bigger than that one.」把「大」换成「好看（beautiful）」，bigger 要怎么变？",
        replaceBase: "This boat is bigger than that one.",
        replaceTarget: "把 bigger 换成「更好看」",
        options: ["more beautiful", "beautifuller", "beautiful"],
        answer: "more beautiful",
        explain: "beautiful 是长词，搬不动 -er，要请 more 帮忙：more beautiful than。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我比我哥哥高。",
        tokens: ["I", "am", "taller", "than", "my", "brother."],
        distractors: ["tall", "more"],
        answer: "I am taller than my brother."
      },
      {
        promptZh: "水族馆里，你想说：这条鱼比那条大。",
        tokens: ["This", "fish", "is", "bigger", "than", "that", "one."],
        distractors: ["more"],
        answer: "This fish is bigger than that one."
      },
      {
        promptZh: "花店里，你想说：这朵花比那朵好看。",
        tokens: ["This", "flower", "is", "more", "beautiful", "than", "that", "one."],
        distractors: ["beautifuller"],
        answer: "This flower is more beautiful than that one."
      },
      {
        promptZh: "有人猜错了年龄，你想说：她年纪不比我大。",
        tokens: ["She", "is", "not", "older", "than", "me."],
        distractors: ["oldest"],
        answer: "She is not older than me."
      }
    ],
    // R5「忆」段：不给选项，凭记忆还原核心句
    recall: {
      promptZh: "海边春游，你指着两艘大小不同的船。凭记忆，写出这句英文。",
      intentZh: "这条船比那条大。",
      answer: "This boat is bigger than that one.",
      noteZh: "短的形容词加 -er，再用 than 接住比较的对象。"
    },
    huntCaseIds: ["hunt-photo-compare"]
  },
  {
    // ── 第二季进阶篇 · R6（L18 介词）：高频三词 in/on/at，地点+时间双场景 ──
    id: "lesson-18-preposition",
    number: 18,
    title: "在哪、什么时候",
    grammarLabel: "介词 · in / on / at",
    episode: "小美的一天 ⑱",
    scene: "mansion",
    cover: cover18,
    sceneSetupZh: "周末在外婆家的老房子里，小美帮外婆找东西、听她讲每周的安排。",
    dialogueEn: "Where is my hat?",
    dialogueZh: "外婆在阁楼口喊她。",
    intentZh: "帽子在盒子里。",
    targetSentence: "My hat is in the box.",
    blocks: [
      { text: "My hat", role: "我的帽子" },
      { text: "is", role: "在" },
      { text: "in", role: "里面（小词）" },
      { text: "the box", role: "盒子里" }
    ],
    oneLineRule: "「在哪」和「什么时候」都靠三个小词：in（里面 / 大块时间）、on（上面 / 某一天）、at（某一点）。",
    examples: [
      { en: "My hat is in the box.", zh: "我的帽子在盒子里。" },
      { en: "The book is on the desk.", zh: "书在桌子上。" },
      { en: "We meet on Monday.", zh: "我们周一见面。" },
      { en: "She is at home.", zh: "她在家。" }
    ],
    dialogue: [
      { who: "npc", en: "Where is my hat?", zh: "外婆在阁楼口喊她。" },
      { who: "npc", en: "Is it in your room?", zh: "她又自言自语：是在你房间里吗？" },
      { who: "me", en: "My hat is in the box.", zh: "轮到你说了——帽子在盒子里。" }
    ],
    contrast: [
      {
        wrong: "My hat is on the box.",
        wrongMark: "on",
        correct: "My hat is in the box.",
        whyZh: "在……里面用 in；on 是「在上面」。盒子里和盒子上，小词一个字母差，意思就变了。"
      },
      {
        wrong: "I read in Monday.",
        wrongMark: "in",
        correct: "I read on Monday.",
        whyZh: "星期几是具体某一天，前面用 on：on Monday。in 留给月份、年份和早中晚。"
      },
      {
        wrong: "She is in home.",
        wrongMark: "in",
        correct: "She is at home.",
        whyZh: "「在家」是固定搭配 at home，用 at 不用 in。at 管「某个点」的地方。"
      },
      {
        wrong: "I get up on six o'clock.",
        wrongMark: "on",
        correct: "I get up at six o'clock.",
        whyZh: "几点钟是时间点，前面用 at：at six。on 管具体某一天，时间点要交给 at。"
      },
      {
        wrong: "The book is at the desk.",
        wrongMark: "at",
        correct: "The book is on the desk.",
        whyZh: "「在桌面上」用 on：on the desk。at 是「在某个点」，桌面是平面要用 on。"
      },
      {
        wrong: "We meet at Sunday.",
        wrongMark: "at",
        correct: "We meet on Sunday.",
        whyZh: "周日是具体的一天，前面用 on：on Sunday。at 只给几点钟这种时间点用。"
      }
    ],
    variants: [
      { label: "肯定", en: "My hat is in the box.", zh: "我的帽子在盒子里。" },
      { label: "否定", en: "I am not at home.", zh: "我不在家。", noteZh: "not 照常放回 be 后面，介词 at 站在原地不动。" },
      { label: "疑问", en: "Is my hat on the desk?", zh: "我的帽子在桌子上吗？", noteZh: "把 Is 搬到句首，介词短语留在句尾。" }
    ],
    sceneSwings: [
      { sceneZh: "早餐时说你的习惯", en: "I read in the morning.", zh: "我早上读书。" },
      { sceneZh: "约同学周末玩", en: "We meet on Sunday.", zh: "我们周日见。" },
      { sceneZh: "电话里妈妈问你在哪", en: "I am at home.", zh: "我在家。" }
    ],
    deepDive: {
      title: "in、on、at 三个小词怎么分？",
      paragraphs: [
        "说地方：in 是「在里面」（in the box），on 是「在上面」（on the desk），at 是「在某个点」（at home、at the door）。",
        "说时间：in 给大块时间（in the morning、in summer），on 给具体一天（on Monday、on Sunday），at 给时间点（at six、at noon）。",
        "记忆口诀：大块用 in，某天用 on，点位用 at。这三个小词在中文里没有一对一的翻译，见一个记一个搭配最稳。"
      ]
    },
    summary: {
      rule: "地方和时间都靠小词：in 里面 / 大块时间，on 上面 / 某天，at 点位。",
      points: [
        "in the box —— 在里面",
        "on Monday —— 在某一天",
        "at home —— 在某个点"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：帽子在盒子里。",
        before: "My hat is",
        after: "the box.",
        options: ["in", "on", "at"],
        answer: "in",
        explain: "「在……里面」用 in：in the box。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我们周一见面。",
        tokens: ["We", "meet", "on", "Monday."],
        answer: "We meet on Monday.",
        explain: "星期几前面用 on：on Monday。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：她在家。",
        tokens: ["She", "is", "at", "home."],
        answer: "She is at home.",
        explain: "at home 是固定搭配：在家的「在」用 at。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "read", "on", "the", "morning."],
        wrongToken: "on",
        answer: "on",
        correctionZh: "早中晚是大块时间，用 in：in the morning。",
        explain: "大块时间用 in，具体某天用 on。"
      },
      {
        // R8 跨课复现：上一课（L17 比较级）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：我比我姐姐高。",
        tokens: ["I", "am", "taller", "than", "my", "sister."],
        answer: "I am taller than my sister.",
        explain: "复现第 17 课：taller than，-er 形状加 than。"
      },
      {
        // R9 变形/替换：换地方 in the box→on the desk，介词跟着变（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「My hat is in the box.」把「盒子里」换成「桌子上」，in 要怎么变？",
        replaceBase: "My hat is in the box.",
        replaceTarget: "把「盒子里」换成「桌子上」",
        options: ["on", "in", "at"],
        answer: "on",
        explain: "「在桌面上」用 on：on the desk。盒子是里面用 in，桌面是上面用 on。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：帽子在盒子里。",
        tokens: ["My", "hat", "is", "in", "the", "box."],
        distractors: ["on", "at"],
        answer: "My hat is in the box."
      },
      {
        promptZh: "你想说：书在桌子上。",
        tokens: ["The", "book", "is", "on", "the", "desk."],
        distractors: ["in"],
        answer: "The book is on the desk."
      },
      {
        promptZh: "早餐时说你的习惯：我早上读书。",
        tokens: ["I", "read", "in", "the", "morning."],
        distractors: ["on"],
        answer: "I read in the morning."
      },
      {
        promptZh: "外婆在找帽子，你想问：我的帽子在桌子上吗？",
        tokens: ["Is", "my", "hat", "on", "the", "desk?"],
        distractors: ["in"],
        answer: "Is my hat on the desk?"
      }
    ],
    // R5「忆」段：不给选项，凭记忆还原核心句
    recall: {
      promptZh: "外婆在阁楼口找她的帽子。凭记忆，写出你回答的那句英文。",
      intentZh: "我的帽子在盒子里。",
      answer: "My hat is in the box.",
      noteZh: "在……里面用 in；on 是在上面，一个字母差意思就变了。"
    },
    huntCaseIds: ["hunt-grandma-box"]
  },
  {
    // ── 第二季进阶篇 · R7（L19 and / but）：从单句到连句的第一步，主打通配 run_on ──
    id: "lesson-19-and-but",
    number: 19,
    title: "又忙又开心",
    grammarLabel: "连词 · and / but",
    episode: "小美的一天 ⑲",
    scene: "snow",
    cover: cover19,
    sceneSetupZh: "下雪了，小美和同学在院子里堆雪人，玩了一整个下午。",
    dialogueEn: "How was your day?",
    dialogueZh: "晚上妈妈问她。",
    intentZh: "我又忙又开心。",
    targetSentence: "I was busy and happy.",
    blocks: [
      { text: "I", role: "我" },
      { text: "was", role: "（昨天）是" },
      { text: "busy and happy", role: "又忙又开心（and 手拉手）" }
    ],
    oneLineRule: "把两个词或两句话连起来：一个方向用 and（又……又……），反着来用 but（但是）。",
    examples: [
      { en: "I was busy and happy.", zh: "我又忙又开心。" },
      { en: "The snow is cold but fun.", zh: "雪很冷但很好玩。" },
      { en: "My sister and I played outside.", zh: "我和妹妹在外面玩了。" },
      { en: "It was windy, but we were happy.", zh: "起风了，但我们很开心。" }
    ],
    dialogue: [
      { who: "npc", en: "How was your day?", zh: "晚上妈妈问她。" },
      { who: "npc", en: "You look tired.", zh: "她看着小美的红脸蛋说。" },
      { who: "me", en: "I was busy and happy.", zh: "轮到你说了——你又忙又开心。" }
    ],
    contrast: [
      {
        wrong: "I was busy happy.",
        wrongMark: null,
        correct: "I was busy and happy.",
        whyZh: "中文「又忙又开心」不用连词，但英语两个形容词手拉手，中间要站一个 and。"
      },
      {
        wrong: "The snow is cold, I am happy.",
        wrongMark: null,
        correct: "The snow is cold, but I am happy.",
        whyZh: "逗号连不住两个句子，中间必须站一个连词：这里意思转折，用 but。"
      },
      {
        wrong: "I was busy but happy.",
        wrongMark: "but",
        correct: "I was busy and happy.",
        whyZh: "「又忙又开心」是两件事一起对，用 and；but 是意思转弯（前面和后面相反）才用的。"
      },
      {
        wrong: "I like apples, and I like oranges, and I like bananas.",
        wrongMark: "and I like bananas",
        correct: "I like apples, oranges, and bananas.",
        whyZh: "一长串同类的东西，只在最后两个之间放一个 and：apples, oranges, and bananas。句句都加 and 就啰嗦了。"
      },
      {
        wrong: "I am tired, and I don't want to stop.",
        wrongMark: "and",
        correct: "I am tired, but I don't want to stop.",
        whyZh: "「累了」和「不想停」意思是转弯的，用 but 连接才对味；and 是顺着往下加。"
      },
      {
        wrong: "My sister and I is happy.",
        wrongMark: "is",
        correct: "My sister and I are happy.",
        whyZh: "My sister and I 是两个人，算一伙的，用 are 不用 is。and 连起来的主语是复数。"
      }
    ],
    variants: [
      { label: "肯定", en: "I was busy and happy.", zh: "我又忙又开心。" },
      { label: "否定", en: "It is not warm, but it is fun.", zh: "它不暖和，但很好玩。", noteZh: "not 照常放在 be 后面，but 负责转折。" },
      { label: "疑问", en: "Is the snow cold and white?", zh: "雪又冷又白吗？", noteZh: "把 Is 搬到句首，两个形容词照旧并列。" }
    ],
    sceneSwings: [
      { sceneZh: "晚上写日记总结这一天", en: "I was busy and happy.", zh: "我又忙又开心。" },
      { sceneZh: "聊起今天的天气", en: "It was windy, but we were happy.", zh: "起风了，但我们很开心。" },
      { sceneZh: "介绍一起玩雪的伙伴", en: "My brother and I like the snow.", zh: "我和哥哥都喜欢雪。" }
    ],
    deepDive: {
      title: "and 和 but，怎么选？",
      paragraphs: [
        "两边是同一个方向的，用 and：busy and happy（又忙又开心）、cold and white（又冷又白）。",
        "两边反着来，用 but：cold but fun（虽然冷但好玩）——but 前后在「唱反调」。",
        "and 连两个主语时（My sister and I），要看成「一群人」，动词跟着变复数：My sister and I were happy.",
        "下一课的 because 和 so 也是连接词家族的成员——到时候你会看到它们的一条特殊家规。"
      ]
    },
    summary: {
      rule: "并列用 and（又……又……），转折用 but（但是），逗号连不住句子。",
      points: [
        "busy and happy —— 并列：and",
        "cold but fun —— 转折：but",
        "My sister and I were happy. —— and 连主语算复数"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：雪很冷但很好玩。",
        before: "The snow is cold",
        after: "fun.",
        options: ["but", "and", "or"],
        answer: "but",
        explain: "冷和好玩是反着来的，转折用 but。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我又忙又开心。",
        tokens: ["I", "was", "busy", "and", "happy."],
      answer: "I was busy and happy.",
        explain: "「又……又……」是并列，用 and 手拉手。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：起风了但我们很开心。",
        tokens: ["It", "was", "windy,", "but", "we", "were", "happy."],
        answer: "It was windy, but we were happy.",
        explain: "逗号后面站一个 but，两个句子就牵住了。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["My", "sister", "and", "I", "was", "happy."],
        wrongToken: "was",
        answer: "was",
        correctionZh: "My sister and I 是两个人，用 were：My sister and I were happy。",
        explain: "and 连起来的主语算复数。"
      },
      {
        // R8 跨课复现：上一课（L18 介词）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：她在家。",
        tokens: ["She", "is", "at", "home."],
        answer: "She is at home.",
        explain: "复现第 18 课：at home 是固定搭配。"
      },
      {
        // R9 变形/替换：换语境（顺接→转折），连词跟着变（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I was busy and happy.」如果想说「我很累，但还不想停」，and 要怎么变？",
        replaceBase: "I was busy and happy.",
        replaceTarget: "换成「我很累，＿不想停」（意思转弯）",
        options: ["but", "and", "so"],
        answer: "but",
        explain: "「累了」和「不想停」意思转弯，用 but；顺着往下加才用 and。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：妈妈又累又饿。",
        tokens: ["Mom", "was", "tired", "and", "hungry."],
        distractors: ["but"],
        answer: "Mom was tired and hungry."
      },
      {
        promptZh: "你想说：雪很冷但很好玩。",
        tokens: ["The", "snow", "is", "cold", "but", "fun."],
        distractors: ["and"],
        answer: "The snow is cold but fun."
      },
      {
        promptZh: "描述那本旧书，你想说：书很旧但很好。",
        tokens: ["The", "book", "is", "old", "but", "good."],
        distractors: ["and"],
        answer: "The book is old but good."
      },
      {
        promptZh: "摸了摸雪，你想说：它不暖和，但很好玩。",
        tokens: ["It", "is", "not", "warm,", "but", "it", "is", "fun."],
        distractors: ["so"],
        answer: "It is not warm, but it is fun."
      }
    ],
    // R5「忆」段：不给选项，凭记忆还原核心句
    recall: {
      promptZh: "晚上妈妈问你今天怎么样。凭记忆，写出这句英文。",
      intentZh: "我又忙又开心。",
      answer: "I was busy and happy.",
      noteZh: "「又……又……」是并列，中间站 and。"
    },
    huntCaseIds: ["hunt-snow-day"]
  },
  {
    // ── 第二季进阶篇 · R8（L20 because / so）：因果表达收口第一批，because…so 连用是必修对比 ──
    id: "lesson-20-because-so",
    number: 20,
    title: "因为我起晚了",
    grammarLabel: "连词 · because / so",
    episode: "小美的一天 ⑳",
    scene: "city",
    cover: cover20,
    sceneSetupZh: "今天早上闹钟没响，小美一路跑向学校，刚好在校门口碰到班长。",
    dialogueEn: "Why are you so late?",
    dialogueZh: "班长拦住她问。",
    intentZh: "我迟到是因为公交车迟到了。",
    targetSentence: "I was late because the bus was late.",
    blocks: [
      { text: "I was late", role: "我迟到了" },
      { text: "because", role: "因为（接原因）" },
      { text: "the bus was late", role: "公交车迟到了" }
    ],
    oneLineRule: "说「因为」用 because 接原因，说「所以」用 so 接结果——英语只用其中一个，不成对出现。",
    examples: [
      { en: "I was late because the bus was late.", zh: "我迟到是因为公交车迟到了。" },
      { en: "It was cold, so I stayed at home.", zh: "天冷，所以我待在家里。" },
      { en: "I was sleepy, so I went to bed early.", zh: "我很困，所以早早睡了。" },
      { en: "Why are you so late?", zh: "你怎么这么晚？" }
    ],
    dialogue: [
      { who: "npc", en: "Why are you so late?", zh: "班长拦住她问。" },
      { who: "npc", en: "Class begins in five minutes!", zh: "她看了看手表补充道。" },
      { who: "me", en: "I was late because the bus was late.", zh: "轮到你解释了——公交车迟到了。" }
    ],
    contrast: [
      {
        wrong: "Because it was cold, so I stayed at home.",
        wrongMark: "so",
        correct: "It was cold, so I stayed at home.",
        whyZh: "中文「因为……所以……」成对出现，英语 because 和 so 只能来一个：because 开头，后面就不许再放 so。"
      },
      {
        wrong: "Because the bus was late.",
        wrongMark: null,
        correct: "I was late because the bus was late.",
        whyZh: "because 开头的半句只是一个原因，不能自己站住——要抱着结果一起说，才是完整的句子。"
      },
      {
        wrong: "I was late, because so I missed the bus.",
        wrongMark: "so",
        correct: "I was late because I missed the bus.",
        whyZh: "because 后面直接跟原因，别再塞 so：because I missed the bus。两个连词不能挤在一起。"
      },
      {
        wrong: "I was tired. Because I went to bed late.",
        wrongMark: "Because",
        correct: "I was tired because I went to bed late.",
        whyZh: "because 从句是原因，不能自己独立成句——要和结果连成一句话，中间不加句号。"
      },
      {
        wrong: "It rained, because I took an umbrella.",
        wrongMark: "because",
        correct: "It rained, so I took an umbrella.",
        whyZh: "「下雨了」是原因，「带伞」是结果——结果前面用 so，不是 because。因果别弄反。"
      },
      {
        wrong: "I was hungry, so because I ate noodles.",
        wrongMark: "because",
        correct: "I was hungry, so I ate noodles.",
        whyZh: "so 后面直接跟结果，别再塞 because：so I ate noodles。so 和 because 二选一，不能都要。"
      }
    ],
    variants: [
      { label: "肯定", en: "I was late because the bus was late.", zh: "我迟到是因为公交车迟到了。" },
      { label: "否定", en: "It was not cold, so we went out.", zh: "天不冷，所以我们出去了。", noteZh: "not 放在 was 后面，so 照旧接结果。" },
      { label: "疑问", en: "Why are you so late?", zh: "你怎么这么晚？", noteZh: "问「为什么」用 why 开头：Why are you……？" }
    ],
    sceneSwings: [
      { sceneZh: "跟老师解释迟到的原因", en: "I was late because the bus was late.", zh: "我迟到是因为公交车迟到了。" },
      { sceneZh: "说起周末为什么没出门", en: "It was cold, so we stayed at home.", zh: "天冷，所以我们待在家里。" },
      { sceneZh: "朋友问你今天为什么开心", en: "I am happy because it is Friday.", zh: "我很开心，因为今天是周五。" }
    ],
    deepDive: {
      title: "because 和 so，只能来一个？",
      paragraphs: [
        "中文习惯「因为……所以……」成对出场，英语刚好相反：because 和 so 是两个方向的连词，一句话只用一个。",
        "because 接「原因」，so 接「结果」：I stayed at home because it was cold. = It was cold, so I stayed at home.——意思一样，看你想强调哪一头。",
        "because 开头的半句不能单独成句，那只是半个句子；把它放到结果后面，或者改写成 so 句，都行。"
      ]
    },
    summary: {
      rule: "原因用 because，结果用 so，一句话只用一个。",
      points: [
        "I was late because the bus was late. —— because 接原因",
        "It was cold, so I stayed at home. —— so 接结果",
        "Because it was cold, so…… ❌ —— 不能成对出现"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：天冷，所以我待在家里。",
        before: "It was cold,",
        after: "I stayed at home.",
        options: ["so", "because", "or"],
        answer: "so",
        explain: "前因后果，结果那半句用 so 接。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我迟到是因为公交车迟到了。",
        tokens: ["I", "was", "late", "because", "the", "bus", "was", "late."],
      answer: "I was late because the bus was late.",
        explain: "because 接住原因，放在结果句后面。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：下雨了，所以我待在家里。",
        tokens: ["It", "rained,", "so", "I", "stayed", "at", "home."],
        answer: "It rained, so I stayed at home.",
        explain: "前半句原因，逗号加 so，后半句结果。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["Because", "it", "was", "cold,", "so", "I", "stayed", "at", "home."],
        wrongToken: "so",
        answer: "so",
        correctionZh: "because 和 so 只留一个：Because it was cold, I stayed at home。",
        explain: "中文成对出现，英语二选一。"
      },
      {
        // R8 跨课复现：上一课（L19 and/but）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：我很累，但不想停。",
        tokens: ["I", "am", "tired,", "but", "I", "don't", "want", "to", "stop."],
        answer: "I am tired, but I don't want to stop.",
        explain: "复现第 19 课：意思转弯用 but。"
      },
      {
        // R9 变形/替换：换因果方向（前因→前果），连词跟着换（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「It was cold, so I stayed at home.」想改成「因为天冷，我才待在家」，so 要怎么变？",
        replaceBase: "It was cold, so I stayed at home.",
        replaceTarget: "换成「因为天冷」（说原因）",
        options: ["because", "so", "and"],
        answer: "because",
        explain: "说「因为……」用 because：Because it was cold, I stayed at home。because 和 so 二选一。"
      }
    ],
    practice: [
      {
        promptZh: "朋友问你为什么开心，你想说：我很开心，因为今天是周五。",
        tokens: ["I", "am", "happy", "because", "it", "is", "Friday."],
        distractors: ["so"],
        answer: "I am happy because it is Friday."
      },
      {
        promptZh: "昨晚太困了，你想说：我很困，所以早早睡了。",
        tokens: ["I", "was", "sleepy,", "so", "I", "went", "to", "bed", "early."],
        distractors: ["because", "go"],
        answer: "I was sleepy, so I went to bed early."
      },
      {
        promptZh: "朋友问你为什么没去公园，你想说：我待在家里，因为下雨了。",
        tokens: ["I", "stayed", "at", "home", "because", "it", "rained."],
        distractors: ["so"],
        answer: "I stayed at home because it rained."
      },
      {
        promptZh: "跑进教室时，班长问你：你怎么这么晚？",
        tokens: ["Why", "are", "you", "so", "late?"],
        distractors: ["because"],
        answer: "Why are you so late?"
      }
    ],
    // R5「忆」段：不给选项，凭记忆还原核心句
    recall: {
      promptZh: "你气喘吁吁地跑进教室。凭记忆，写出你解释迟到的那句英文。",
      intentZh: "我迟到是因为公交车迟到了。",
      answer: "I was late because the bus was late.",
      noteZh: "because 接原因，so 接结果——一句话只用一个。"
    },
    // R7：每课 1–2 案（本案练 because 半句独立与 missing_be，主题契合）
    huntCaseIds: ["hunt-late-note", "hunt-mom-note"]
  },
  {
    // ── 第三季 · 第二批（析客规格书 prd-grammar-second-batch-2026-09-13）：现在完成时拆 3 课 + 对比课 ──
    // L21 基本式「刚做完」：不规则做过版只引入 done / eaten；一词两义（have=有 / have+做过版）在主线对比卡正面拆解
    id: "lesson-21-have-done",
    number: 21,
    title: "作业写完了",
    grammarLabel: "现在完成时 · have + 做过版",
    episode: "小美的一天 ㉑",
    scene: "mansion",
    cover: cover21,
    sceneSetupZh: "清晨出门前，妈妈指着门口的书包问作业。",
    dialogueEn: "Have you finished your homework?",
    dialogueZh: "妈妈一边帮忙整理书包一边问。",
    intentZh: "我已经写完作业了。",
    targetSentence: "I have done my homework.",
    blocks: [
      { text: "I", role: "我" },
      { text: "have", role: "信号灯（做过了）" },
      { text: "done", role: "做（做过版）" },
      { text: "my homework", role: "我的作业" }
    ],
    oneLineRule: "说「做完了、做过了」，用 have + 做过版：I have done…。have 后面站做过的版，不是原形。",
    examples: [
      { en: "I have done my homework.", zh: "我已经写完作业了。" },
      { en: "I have eaten breakfast.", zh: "我吃过早饭了。" },
      { en: "I have finished my picture.", zh: "我画完画了。" },
      { en: "I have watched the game.", zh: "我看过比赛了。" }
    ],
    dialogue: [
      { who: "npc", en: "Have you finished your homework?", zh: "妈妈一边整理书包一边问。" },
      { who: "npc", en: "Don't forget your lunch box.", zh: "她又把饭盒塞进书包。" },
      { who: "me", en: "I have done my homework.", zh: "轮到你说了——作业已经写完了。" }
    ],
    contrast: [
      {
        wrong: "I have do my homework.",
        wrongMark: "do",
        correct: "I have done my homework.",
        whyZh: "have 后面要站动词的做过版。do 的做过版是 done——have 已经占好了位置，动词要换上做过版的外套。"
      },
      {
        wrong: "I have eat breakfast.",
        wrongMark: "eat",
        correct: "I have eaten breakfast.",
        whyZh: "have 后面跟「东西」是「有」（I have a bag），跟「做过版」就是「做过了」（I have eaten breakfast）。看 have 后面站的是什么词。"
      },
      {
        wrong: "I have finished my homework yesterday.",
        wrongMark: "yesterday",
        correct: "I finished my homework yesterday.",
        whyZh: "有 yesterday 这种确切的过去时间，要用一般过去时 finished——完成时不说「具体哪一刻」，只说「做过了」。这是完成时和过去时最容易撞车的地方。"
      },
      {
        wrong: "She have done her homework.",
        wrongMark: "have",
        correct: "She has done her homework.",
        whyZh: "「她做完了」，have 要换三单 has：She has done。have/has 跟着主语变，做过版 done 不变。"
      },
      {
        wrong: "I have watched TV yesterday.",
        wrongMark: "yesterday",
        correct: "I have watched TV.",
        whyZh: "完成时只说「看过了」，不带 yesterday 这种确定时间——要么说 I have watched TV（看过），要么说 I watched TV yesterday（昨天看了），两个只能选一个。"
      },
      {
        wrong: "Have you do your homework?",
        wrongMark: "do",
        correct: "Have you done your homework?",
        whyZh: "问「做完了吗」，Have 搬到句首，动词照样换做过版：Have you done……？做过版不能偷懒。"
      }
    ],
    variants: [
      { label: "肯定", en: "I have done my homework.", zh: "我已经写完作业了。" },
      { label: "否定", en: "I haven't done my homework.", zh: "我还没写作业。", noteZh: "haven't = have not：have 后面加 not，就是「还没做」。" },
      { label: "疑问", en: "Have you finished your homework?", zh: "你写完作业了吗？", noteZh: "问别人时把 Have 搬到句首。回答还是 I have。" }
    ],
    sceneSwings: [
      { sceneZh: "早餐桌上，妈妈问你吃了没", en: "I have eaten breakfast.", zh: "我吃过早饭了。" },
      { sceneZh: "画室里，老师看你的画", en: "I have finished my picture.", zh: "我画完画了。" },
      { sceneZh: "球场上，朋友问你看了比赛没", en: "I have watched the game.", zh: "我看过比赛了。" }
    ],
    deepDive: {
      title: "have 明明是「有」，怎么又变成「做过了」？",
      paragraphs: [
        "have 是个多面手：后面跟「东西」，就是「有」——I have a new bag（我有一个新背包，第 3 课学过）；后面跟「做过版」，就是「做过了」——I have done my homework（我写完了作业）。判断方法只有一个：看 have 后面站的是什么词。",
        "做过版是动词的第三件外套。大多数动词的做过版和昨天版长得一样：watch→watched、finish→finished，昨天穿今天穿都是它。只有几个老词走自己的路：do→done、eat→eaten，遇到就单独记住。",
        "下一课你会见到 been 和 seen——be 和 see 的做过版。加上这课的 done、eaten，四个常客就集齐了。"
      ]
    },
    summary: {
      rule: "说「做过了」用 have + 做过版；have 后面跟东西是「有」，跟做过版是「做过了」。",
      points: [
        "I have done my homework. —— have + 做过版",
        "I haven't done my homework. —— 还没做：have 后面加 not",
        "Have you finished your homework? —— 问别人：Have 搬到句首"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我已经写完作业了。",
        before: "I",
        after: "done my homework.",
        options: ["have", "has", "had"],
        answer: "have",
        explain: "说「我做过了」，信号灯用 have；has 是他、她专用的，这里先不用管。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我吃过早饭了。",
        tokens: ["eaten", "I", "breakfast.", "have"],
        answer: "I have eaten breakfast.",
        explain: "have 后面站做过版：eaten 是 eat 的做过版。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我已经写完作业了。",
        tokens: ["homework.", "my", "done", "have", "I"],
        answer: "I have done my homework.",
        explain: "I have 开头，done 站在 have 后面。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "have", "do", "my", "homework."],
        wrongToken: "do",
        answer: "do",
        correctionZh: "把 do 换成做过版 done：I have done my homework。",
        explain: "have 后面要站做过版，do 的做过版是 done。"
      },
      {
        // R8 跨课复现：上一课（L20 because/so）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：天冷了，所以我待在家。",
        tokens: ["It", "was", "cold,", "so", "I", "stayed", "at", "home."],
        answer: "It was cold, so I stayed at home.",
        explain: "复现第 20 课：结果前面用 so。"
      },
      {
        // R9 变形/替换：换主语 I→She，have 变 has（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I have done my homework.」把主语 I 换成 She，have 要怎么变？",
        replaceBase: "I have done my homework.",
        replaceTarget: "把 I 换成 She",
        options: ["has", "have", "had"],
        answer: "has",
        explain: "She 是单数，have 换三单 has：She has done。做过版 done 不变。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我画完画了。",
        tokens: ["picture.", "my", "finished", "have", "I"],
        distractors: ["has"],
        answer: "I have finished my picture."
      },
      {
        promptZh: "早餐桌上，你想说：我吃过早饭了。",
        tokens: ["breakfast.", "eaten", "have", "I"],
        distractors: ["eat", "ate"],
        answer: "I have eaten breakfast."
      },
      {
        promptZh: "先复习一小步——上一季学过：昨天我去了公园。",
        tokens: ["went", "Yesterday", "I", "to", "the", "park."],
        distractors: ["go"],
        answer: "Yesterday I went to the park."
      },
      {
        promptZh: "作业早写完了，你想问同桌：你写完作业了吗？",
        tokens: ["you", "Have", "homework?", "finished", "your"],
        distractors: ["done"],
        answer: "Have you finished your homework?"
      }
    ],
    // R5 忆段：析客规格 §4.5 降档——本课忆 L10 旧句热身，规避 have 一词两义 + 无提示回忆双重陡坡
    recall: {
      promptZh: "出门前最后检查：周日的日记本上，昨天最开心的一件事要写下来。凭记忆，写出那句英文。",
      intentZh: "我昨天去了公园。",
      answer: "Yesterday I went to the park.",
      noteZh: "这是第 10 课的核心句——先热个身，下一课开始回忆新句型。"
    },
    huntCaseIds: ["hunt-homework-note"]
  },
  {
    // L22 经历「去过」：引入 been / seen；gone 仅深挖卡认读不进必做题（Non-goals）
    id: "lesson-22-been-to",
    number: 22,
    title: "去过北京",
    grammarLabel: "现在完成时 · have been to / have seen",
    episode: "小美的一天 ㉒",
    scene: "city",
    cover: cover22,
    sceneSetupZh: "课间，班上新来的转学生正在聊暑假去了哪儿。",
    dialogueEn: "Have you been to Beijing?",
    dialogueZh: "新同学转过身来问你。",
    intentZh: "我去过北京。",
    targetSentence: "I have been to Beijing.",
    blocks: [
      { text: "I", role: "我" },
      { text: "have", role: "信号灯" },
      { text: "been", role: "去（做过版）" },
      { text: "to Beijing", role: "去过北京" }
    ],
    oneLineRule: "说「去过某地」用 have been to：I have been to Beijing。been 是 be 的做过版——去过了、回来了。",
    examples: [
      { en: "I have been to Beijing.", zh: "我去过北京。" },
      { en: "I have seen that film.", zh: "我看过那部电影。" },
      { en: "I have been to the zoo.", zh: "我去过动物园。" },
      { en: "I have been to Shanghai.", zh: "我去过上海。" }
    ],
    dialogue: [
      { who: "npc", en: "Have you been to Beijing?", zh: "新同学转过身来问你。" },
      { who: "npc", en: "I have seen that film twice!", zh: "她还聊起了最近看的电影。" },
      { who: "me", en: "I have been to Beijing.", zh: "轮到你说了——小美去过北京。" }
    ],
    contrast: [
      {
        wrong: "I have be to Beijing.",
        wrongMark: "be",
        correct: "I have been to Beijing.",
        whyZh: "be 的做过版是 been，不是 be 本身。做过版是另一件外套，不能拿原形充数。"
      },
      {
        wrong: "I see that film yesterday.",
        wrongMark: "see",
        correct: "I saw that film yesterday.",
        whyZh: "句子里有 yesterday，就要用昨天版：I saw that film yesterday。没有时间点、只说「看过」，才用 have + 做过版。"
      },
      {
        wrong: "I have been to Beijing yesterday.",
        wrongMark: "yesterday",
        correct: "I have been to Beijing.",
        whyZh: "「去过」只说有过这个经历，不带 yesterday 这种确定时间——要说具体哪次，就用 I went to Beijing yesterday（一般过去时）。"
      },
      {
        wrong: "She have been to the zoo.",
        wrongMark: "have",
        correct: "She has been to the zoo.",
        whyZh: "「她去过」，信号灯要换三单 has：She has been to。been 这个做过版不变，have/has 跟着主语变。"
      },
      {
        wrong: "I have went to Beijing.",
        wrongMark: "went",
        correct: "I have been to Beijing.",
        whyZh: "have 后面要站做过版，went 是 go 的昨天版（一般过去时用的），不是做过版——「去过」固定是 have been to。"
      },
      {
        wrong: "Have you ever went to Beijing?",
        wrongMark: "went",
        correct: "Have you ever been to Beijing?",
        whyZh: "问「去过没有」，Have 搬到句首，后面照样用做过版 been：Have you (ever) been to……？went 在这里站不住。"
      }
    ],
    variants: [
      { label: "肯定", en: "I have been to Beijing.", zh: "我去过北京。" },
      { label: "否定", en: "I haven't seen that film.", zh: "我还没看过那部电影。", noteZh: "haven't = have not：还没看过。" },
      { label: "疑问", en: "Have you been to Beijing?", zh: "你去过北京吗？", noteZh: "把 Have 搬到句首，问别人去过没。" }
    ],
    sceneSwings: [
      { sceneZh: "相册前，你指着一张剧照", en: "I have seen that film.", zh: "我看过那部电影。" },
      { sceneZh: "地图前，同学问你暑假去了哪儿", en: "I have been to Beijing.", zh: "我去过北京。" },
      { sceneZh: "动物园门口，朋友约你再去", en: "I have been to the zoo.", zh: "我去过动物园。" }
    ],
    deepDive: {
      title: "been 和 was 长得像，它们是什么关系？",
      paragraphs: [
        "been 和 was 其实是同一个动词的两件外套：am / is 的昨天版是 was，做过版是 been。说「我昨天在北京」用 was（I was in Beijing yesterday），说「我去过北京」用 been（I have been to Beijing）。",
        "还有一个近亲 gone：go 的做过版。gone 是「去了还没回来」，been 是「去过了、已经回来」——说 He has gone to Beijing 是他人还在北京，说 He has been to Beijing 是他去玩过、人回来了。这两个词先混个脸熟，不用考。",
        "说「去过哪儿、看过什么」不用报日子，像翻相册：一张一张说过去就行。这也是为什么这类句子里不放 yesterday。"
      ]
    },
    summary: {
      rule: "说「去过某地」用 have been to；「看过什么」用 have + 做过版。",
      points: [
        "I have been to Beijing. —— been 是 be 的做过版",
        "I haven't seen that film. —— 还没看过：haven't + 做过版",
        "Have you been to Beijing? —— 问别人：Have 搬到句首"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我去过北京。",
        before: "I have",
        after: "to Beijing.",
        options: ["been", "was", "go"],
        answer: "been",
        explain: "been 是 be 的做过版；was 是昨天版，不能站错位置。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我看过那部电影。",
        tokens: ["that", "I", "film.", "seen", "have"],
        answer: "I have seen that film.",
        explain: "have 后面站 seen——see 的做过版。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我去过北京。",
        tokens: ["have", "been", "I", "Beijing.", "to"],
        answer: "I have been to Beijing.",
        explain: "been to + 地名：去过哪儿。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["She", "have", "been", "to", "the", "zoo."],
        wrongToken: "have",
        answer: "have",
        correctionZh: "她专用的信号灯是 has：She has been to the zoo。",
        explain: "说「她做过了」，信号灯要用 has。这个先认个脸，以后细讲。"
      },
      {
        // R8 跨课复现：上一课（L21 have done）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：我做完作业了。",
        tokens: ["I", "have", "done", "my", "homework."],
        answer: "I have done my homework.",
        explain: "复现第 21 课：have 后面站做过版 done。"
      },
      {
        // R9 变形/替换：换主语 I→She，have 变 has（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I have been to Beijing.」把主语 I 换成 She，have 要怎么变？",
        replaceBase: "I have been to Beijing.",
        replaceTarget: "把 I 换成 She",
        options: ["has", "have", "is"],
        answer: "has",
        explain: "She 是单数，信号灯换 has：She has been to。been 这个做过版不变。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我去过北京。",
        tokens: ["I", "been", "have", "Beijing.", "to"],
        distractors: ["was", "go"],
        answer: "I have been to Beijing."
      },
      {
        promptZh: "聊到电影，你想说：我看过那部电影。",
        tokens: ["film.", "seen", "that", "have", "I"],
        distractors: ["saw"],
        answer: "I have seen that film."
      },
      {
        promptZh: "先复习一小步——学过的老句子：我去图书馆。",
        tokens: ["library.", "I", "go", "to", "the"],
        distractors: ["goes"],
        answer: "I go to the library."
      },
      {
        promptZh: "同学聊起一部你没看过的电影，你想说：我还没看过那部电影。",
        tokens: ["film.", "I", "seen", "that", "haven't"],
        distractors: ["saw"],
        answer: "I haven't seen that film."
      }
    ],
    recall: {
      promptZh: "新同学笑着等你回答，轮到你介绍自己去过哪儿了。凭记忆，写出那句英文。",
      intentZh: "我去过北京。",
      answer: "I have been to Beijing.",
      noteZh: "been 是 be 的做过版：去过了、回来了。"
    },
    huntCaseIds: ["hunt-photo-album"]
  },
  {
    // L23 结果「还在呢」：引入 broken / written；lost 白捡（昨天版做过版同形）
    id: "lesson-23-have-lost",
    number: 23,
    title: "钥匙不见了",
    grammarLabel: "现在完成时 · have lost / have broken",
    episode: "小美的一天 ㉓",
    scene: "mansion",
    cover: cover23,
    sceneSetupZh: "放学回家，小美站在门口翻遍了书包——钥匙不见了。",
    dialogueEn: "Is it in your bag?",
    dialogueZh: "外婆隔着门问。",
    intentZh: "我把钥匙弄丢了。",
    targetSentence: "I have lost my key.",
    blocks: [
      { text: "I", role: "我" },
      { text: "have", role: "信号灯" },
      { text: "lost", role: "弄丢（做过版）" },
      { text: "my key", role: "我的钥匙" }
    ],
    oneLineRule: "丢了、坏了、还在呢——结果现在还看得见的事，用 have + 做过版说：I have lost my key。",
    examples: [
      { en: "I have lost my key.", zh: "我把钥匙弄丢了。" },
      { en: "I have broken my cup.", zh: "我把杯子打碎了。" },
      { en: "I have written a letter.", zh: "我写好了一封信。" },
      { en: "I have lost my pen.", zh: "我把钢笔弄丢了。" }
    ],
    dialogue: [
      { who: "npc", en: "Is it in your bag?", zh: "外婆隔着门问。" },
      { who: "npc", en: "Don't worry. I have my key here.", zh: "外婆拿出备用钥匙：别担心，我这儿有。" },
      { who: "me", en: "I have lost my key.", zh: "轮到你说了——钥匙弄丢了。" }
    ],
    contrast: [
      {
        wrong: "I have lose my key.",
        wrongMark: "lose",
        correct: "I have lost my key.",
        whyZh: "lose 的做过版是 lost，不走加 -ed 的路。丢失的结果现在还在——还没进家门呢，所以用 have + 做过版。"
      },
      {
        wrong: "I break my cup yesterday.",
        wrongMark: "break",
        correct: "I broke my cup yesterday.",
        whyZh: "句子里有 yesterday，要用昨天版 broke。没提时间、只说「碎了还在」，才用 have + 做过版。"
      },
      {
        wrong: "I have lost my key yesterday.",
        wrongMark: "yesterday",
        correct: "I lost my key yesterday.",
        whyZh: "说了 yesterday 就用一般过去时 lost——完成时只管「现在还没找到」，不问哪天丢的。时间点一出现，就换昨天版。"
      },
      {
        wrong: "She have lost her key.",
        wrongMark: "have",
        correct: "She has lost her key.",
        whyZh: "「她丢了」，信号灯换三单 has：She has lost。lost 这个做过版不变，have/has 跟着主语变。"
      },
      {
        wrong: "I have breaked my cup.",
        wrongMark: "breaked",
        correct: "I have broken my cup.",
        whyZh: "break 的做过版是 broken，不是 breaked——它不走加 -ed 的寻常路。做过版里这种「老词」要单独记。"
      },
      {
        wrong: "I lost my key. So I can't open the door now.",
        wrongMark: "lost",
        correct: "I have lost my key. So I can't open the door now.",
        whyZh: "强调「丢了，现在进不了门」这个结果还在，用 have lost 更贴——一般过去时只说「丢过」，完成时才说清「影响到现在」。"
      }
    ],
    variants: [
      { label: "肯定", en: "I have lost my key.", zh: "我把钥匙弄丢了。" },
      { label: "否定", en: "I haven't cleaned my room.", zh: "我还没打扫房间。", noteZh: "haven't = have not：还没做好。" },
      { label: "疑问", en: "Have you cleaned your room?", zh: "你打扫房间了吗？", noteZh: "把 Have 搬到句首，问别人做好了没。" }
    ],
    sceneSwings: [
      { sceneZh: "家门口，外婆问你钥匙哪去了", en: "I have lost my key.", zh: "我把钥匙弄丢了。" },
      { sceneZh: "厨房里，你收拾碗时手一滑", en: "I have broken my cup.", zh: "我把杯子打碎了。" },
      { sceneZh: "书房里，你给笔友回信", en: "I have written a letter.", zh: "我写好了一封信。" }
    ],
    deepDive: {
      title: "丢钥匙的事在昨天，为什么不用昨天版？",
      paragraphs: [
        "重点不在哪一天丢的，而在「现在还没找回来」——结果一直留到了现在。凡是结果还在的事（钥匙丢了、杯子碎了），英语用 have + 做过版来说。",
        "lost 是个白捡的词：lose 的昨天版和做过版长得一样，都是 lost。I lost my key yesterday（昨天丢的，讲故事）和 I have lost my key（还没找回来，说结果）都对，只是分工不同。",
        "broken、written 也是老词走自己的路：break 的昨天版是 broke、做过版是 broken；write 的昨天版是 wrote、做过版是 written。两件外套别穿混。"
      ]
    },
    summary: {
      rule: "结果还在的事（丢了、碎了）用 have + 做过版：I have lost my key。",
      points: [
        "I have lost my key. —— 结果还在：用做过版",
        "I broke my cup yesterday. —— 有时间点：用昨天版",
        "Have you cleaned your room? —— 问别人：Have 搬到句首"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我把钥匙弄丢了。",
        before: "I have",
        after: "my key.",
        options: ["lost", "lose", "losed"],
        answer: "lost",
        explain: "lose 的做过版是 lost；losed 是不存在的形状。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我写好了一封信。",
        tokens: ["letter.", "a", "written", "have", "I"],
        answer: "I have written a letter.",
        explain: "have 后面站 written——write 的做过版。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我把钥匙弄丢了。",
        tokens: ["key.", "lost", "my", "have", "I"],
        answer: "I have lost my key.",
        explain: "I have lost = 已经丢了，还没找回来。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "have", "break", "my", "cup."],
        wrongToken: "break",
        answer: "break",
        correctionZh: "把 break 换成做过版 broken：I have broken my cup。",
        explain: "have 后面要站做过版：break 的做过版是 broken。"
      },
      {
        // R8 跨课复现：上一课（L22 have been to）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：我去过北京。",
        tokens: ["I", "have", "been", "to", "Beijing."],
        answer: "I have been to Beijing.",
        explain: "复现第 22 课：「去过」固定是 have been to。"
      },
      {
        // R9 变形/替换：换动词 lose→break，做过版跟着换（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I have lost my key.」把「丢了钥匙」换成「碎了杯子」，lost 要怎么变？",
        replaceBase: "I have lost my key.",
        replaceTarget: "把 lost（丢）换成 break（碎）的做过版",
        options: ["broken", "breaked", "broke"],
        answer: "broken",
        explain: "break 的做过版是 broken：I have broken my cup。不走加 -ed 的路。"
      }
    ],
    practice: [
      {
        promptZh: "外婆问你钥匙哪去了，你想说：我把钥匙弄丢了。",
        tokens: ["I", "lost", "have", "key.", "my"],
        distractors: ["lose", "losed"],
        answer: "I have lost my key."
      },
      {
        promptZh: "厨房里，你想说：我把杯子打碎了。",
        tokens: ["cup.", "my", "broken", "have", "I"],
        distractors: ["broke"],
        answer: "I have broken my cup."
      },
      {
        promptZh: "先复习一小步——学过的老句子：它在你书包里吗？",
        tokens: ["it", "Is", "your", "bag?", "in"],
        distractors: ["on", "at"],
        answer: "Is it in your bag?"
      },
      {
        promptZh: "妈妈快回家了，你想说：我还没打扫房间。",
        tokens: ["cleaned", "I", "room.", "my", "haven't"],
        distractors: ["clean"],
        answer: "I haven't cleaned my room."
      }
    ],
    recall: {
      promptZh: "外婆在门口等你，你翻遍了书包也没找到，该告诉她坏消息了。凭记忆，写出那句英文。",
      intentZh: "我把钥匙弄丢了。",
      answer: "I have lost my key.",
      noteZh: "丢了、还没找回来——结果还在，用 have + 做过版。"
    },
    huntCaseIds: ["hunt-lost-key"]
  },
  {
    // L24 对比收口课：targetSentence 存昨天版核心句（无提示产出题恰好考「昨天信号选昨天版」）；
    // 做过版核心句由 variants 肯定卡 + 破案/练习承载。零新增分词，全批复用。
    id: "lesson-24-past-vs-perfect",
    number: 24,
    title: "昨天去了，还是去过了？",
    grammarLabel: "对比 · 一般过去时 vs 现在完成时",
    episode: "小美的一天 ㉔",
    scene: "mystery",
    cover: cover24,
    sceneSetupZh: "周日晚，小美在灯下写周记，妈妈端着水果进来聊天。",
    dialogueEn: "Have you been to the new park?",
    dialogueZh: "妈妈一边削苹果一边问。",
    intentZh: "我昨天去了公园。",
    targetSentence: "Yesterday I went to the park.",
    blocks: [
      { text: "Yesterday", role: "昨天（信号灯）" },
      { text: "I", role: "我" },
      { text: "went", role: "去（昨天版）" },
      { text: "to the park", role: "去公园" }
    ],
    oneLineRule: "句子里有具体时间点（yesterday、last week）就用昨天版；不报时间、只说「做过了、去过」就用 have + 做过版。",
    examples: [
      { en: "Yesterday I went to the park.", zh: "我昨天去了公园。" },
      { en: "I have been to the park.", zh: "我去过那个公园。" },
      { en: "I saw that film yesterday.", zh: "我昨天看了那部电影。" },
      { en: "I have seen that film.", zh: "我看过那部电影。" }
    ],
    dialogue: [
      { who: "npc", en: "Have you been to the new park?", zh: "妈妈一边削苹果一边问。" },
      { who: "npc", en: "I heard it is beautiful.", zh: "她说：听说那儿很漂亮。" },
      { who: "me", en: "I have been to the park.", zh: "轮到你说了——小美去过那个公园。" }
    ],
    contrast: [
      {
        wrong: "I have seen that film yesterday.",
        wrongMark: "seen",
        correct: "I saw that film yesterday.",
        whyZh: "yesterday 已经站在句子里了，就得用昨天版 saw。做过版和具体时间点不能同台。"
      },
      {
        wrong: "Yesterday I have done my homework.",
        wrongMark: "have",
        correct: "Yesterday I did my homework.",
        whyZh: "Yesterday 在场，讲的是哪一天干了啥——用昨天版 did。做过版只说「做过了」，不带日子。"
      },
      {
        wrong: "I saw that film. It's great!",
        wrongMark: "saw",
        correct: "I have seen that film. It's great!",
        whyZh: "没提时间、只说「看过，觉得好」这个经历，用 have seen 更自然——强调看过之后的感受留到了现在。"
      },
      {
        wrong: "Did you finish your homework? Mom is waiting.",
        wrongMark: "Did you finish",
        correct: "Have you finished your homework? Mom is waiting.",
        whyZh: "妈妈现在就在等，关心的是「现在做完没有」这个结果，用 Have you finished 更贴——完成时管「现在的状态」。"
      },
      {
        wrong: "I have gone to the park yesterday afternoon.",
        wrongMark: "have gone",
        correct: "I went to the park yesterday afternoon.",
        whyZh: "yesterday afternoon 是确定时间，用一般过去时 went——完成时不能挂具体时间状语，这是两个时态最硬的分界线。"
      },
      {
        wrong: "She has lost her key last week.",
        wrongMark: "last week",
        correct: "She lost her key last week.",
        whyZh: "last week 也是确定的过去时间，用一般过去时 lost——完成时只说「丢了还没找到」，不说哪一周丢的。"
      }
    ],
    variants: [
      { label: "肯定", en: "I have been to the park.", zh: "我去过那个公园。" },
      { label: "否定", en: "I didn't go out yesterday.", zh: "我昨天没出门。", noteZh: "昨天 + 不 = didn't：did 出场后动词变回原形 go。" },
      { label: "疑问", en: "Have you been to the new park?", zh: "你去过新开的公园吗？", noteZh: "不报时间地问经历：Have 搬到句首。" }
    ],
    sceneSwings: [
      { sceneZh: "日记里写下昨天的行程", en: "I went to the park yesterday.", zh: "我昨天去了公园。" },
      { sceneZh: "饭桌上，妈妈问你饿不饿", en: "I have eaten breakfast, so I am full.", zh: "我吃过早饭了，所以很饱。" },
      { sceneZh: "照片前，你指着天安门", en: "I have been to Beijing.", zh: "我去过北京。" }
    ],
    deepDive: {
      title: "went 和 have been，到底怎么选？",
      paragraphs: [
        "两句话并排看：Yesterday I went to the park（我昨天去了公园——讲故事，有日子）；I have been to the park（我去过那个公园——说经历，没有日子）。同一件事，讲法分工不同。",
        "一句话判据：句子里有具体时间点吗？有——yesterday、last week——用昨天版；没有，只说「做过了、去过」，或事情和现在有关——用 have + 做过版。",
        "信号词小清单：看到 yesterday、last week，用昨天版；看到 just（刚刚）或不报时间，用做过版。just 先混个脸熟，不用考。",
        "gone 和 been 再认一次：gone 是去了还没回来，been 是去过了、回来了。说经历，用 been。"
      ]
    },
    summary: {
      rule: "有具体时间点用昨天版；不报时间、只说做过了就用 have + 做过版。",
      points: [
        "Yesterday I went to the park. —— yesterday 在场：昨天版",
        "I have been to the park. —— 不报时间的经历：做过版",
        "I didn't go out yesterday. —— 昨天版否定：did + 原形"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：昨天我去了公园。",
        before: "",
        after: "I went to the park.",
        options: ["Yesterday", "Just", "Now"],
        answer: "Yesterday",
        explain: "说哪一天干了啥，开头放时间点 Yesterday，动词穿昨天版。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：昨天我去了公园。",
        tokens: ["to", "Yesterday", "I", "the", "park.", "went"],
        answer: "Yesterday I went to the park.",
        explain: "Yesterday 开头，went 是 go 的昨天版。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我去过那个公园。",
        tokens: ["park.", "been", "I", "the", "to", "have"],
        answer: "I have been to the park.",
        explain: "不报时间，只说去过：have + been。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "have", "seen", "that", "film", "yesterday."],
        wrongToken: "seen",
        answer: "seen",
        correctionZh: "把 seen 换成昨天版 saw：I saw that film yesterday。",
        explain: "yesterday 在场，动词要用昨天版，做过版不能同台。"
      },
      {
        // R8 跨课复现：上一课（L23 have lost）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：我丢了钥匙。",
        tokens: ["I", "have", "lost", "my", "key."],
        answer: "I have lost my key.",
        explain: "复现第 23 课：「丢了（还没找到）」用 have lost。"
      },
      {
        // R9 变形/替换：加时间状语（无→yesterday），时态跟着换（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I have seen that film.」句尾加上 yesterday，have seen 要怎么变？",
        replaceBase: "I have seen that film.",
        replaceTarget: "句尾加上 yesterday",
        options: ["saw", "have seen", "seen"],
        answer: "saw",
        explain: "一出现 yesterday，就换一般过去时 saw——完成时和具体时间不能同台。"
      }
    ],
    practice: [
      {
        promptZh: "写周记的第一句，你想说：昨天我去了公园。",
        tokens: ["I", "went", "Yesterday", "to", "the", "park."],
        distractors: ["have", "been"],
        answer: "Yesterday I went to the park."
      },
      {
        promptZh: "回答妈妈的问题，你想说：我去过那个公园。",
        tokens: ["park.", "I", "been", "the", "have", "to"],
        distractors: ["went", "Yesterday"],
        answer: "I have been to the park."
      },
      {
        promptZh: "先复习一小步——学过的老句子：我吃了两个三明治。",
        tokens: ["I", "ate", "two", "sandwiches."],
        distractors: ["eat"],
        answer: "I ate two sandwiches."
      },
      {
        promptZh: "昨天作业太多，你想说：我昨天没出门。",
        tokens: ["go", "didn't", "I", "out", "yesterday."],
        distractors: ["went"],
        answer: "I didn't go out yesterday."
      }
    ],
    recall: {
      promptZh: "妈妈笑着等你回答——去过新开的公园没？凭记忆，写出那句英文。",
      intentZh: "我去过那个公园。",
      answer: "I have been to the park.",
      noteZh: "不报时间、只说去过：have + been to。"
    },
    huntCaseIds: ["hunt-diary-mix", "hunt-weekend-note"]
  },
  {
    // ── 第三季巩固篇 · R1（L25 三单 -s）：A2 最高频、中式错误 Top，24 课竟跳过的一般现在时三单 ──
    id: "lesson-25-third-person",
    number: 25,
    title: "他每天喝牛奶",
    grammarLabel: "一般现在时 · 三单 -s",
    episode: "小美的一天 ㉕",
    scene: "campus",
    cover: cover1,
    sceneSetupZh: "周一早读，小美观察同桌的习惯，发现了好多「他每天都做的事」。",
    dialogueEn: "He drinks milk every day.",
    dialogueZh: "你指着同桌跟朋友说。",
    intentZh: "他每天喝牛奶。",
    targetSentence: "He drinks milk every day.",
    blocks: [
      { text: "He", role: "他" },
      { text: "drinks", role: "喝（三单版）" },
      { text: "milk", role: "牛奶" },
      { text: "every day", role: "每天" }
    ],
    oneLineRule: "他、她、它做事，动词后面要加个小尾巴 -s：He drinks。中文动词不变，英语三单必须变。",
    examples: [
      { en: "She likes music.", zh: "她喜欢音乐。" },
      { en: "He plays football.", zh: "他踢足球。" },
      { en: "It rains a lot.", zh: "（天）老下雨。" },
      { en: "She watches TV every night.", zh: "她每晚看电视。" }
    ],
    dialogue: [
      { who: "npc", en: "What does he do every day?", zh: "朋友顺着你的话问。" },
      { who: "npc", en: "Does he play sports too?", zh: "她又补了一句。" },
      { who: "me", en: "He drinks milk every day.", zh: "轮到你说了——他每天喝牛奶。" }
    ],
    contrast: [
      {
        wrong: "He drink milk every day.",
        wrongMark: "drink",
        correct: "He drinks milk every day.",
        whyZh: "「他喝」是三单，动词要加小尾巴 -s：drinks。中文动词不变，英语三单必须变。"
      },
      {
        wrong: "She like music.",
        wrongMark: "like",
        correct: "She likes music.",
        whyZh: "「她喜欢」要加 -s：likes。这是英语里最顽固的小尾巴，别丢了。"
      },
      {
        wrong: "He don't like milk.",
        wrongMark: "don't",
        correct: "He doesn't like milk.",
        whyZh: "「他不喜欢」，帮手要换三单 doesn't。don't 只配 I、you、we、they。"
      },
      {
        wrong: "Does he likes milk?",
        wrongMark: "likes",
        correct: "Does he like milk?",
        whyZh: "Does 一出场，动词要打回原形 like——一场戏只让一个词扛变化，别让小尾巴长两次。"
      },
      {
        wrong: "She watch TV every night.",
        wrongMark: "watch",
        correct: "She watches TV every night.",
        whyZh: "watch 以 ch 结尾，三单不是只加 s，要加 es：watches——和 sandwich 加 es 是一个规律。"
      },
      {
        wrong: "He studys English.",
        wrongMark: "studys",
        correct: "He studies English.",
        whyZh: "study 是「辅音 + y」结尾，三单要把 y 变 i 再加 es：studies。和 story→stories 同款。"
      }
    ],
    variants: [
      { label: "肯定", en: "He drinks milk every day.", zh: "他每天喝牛奶。" },
      { label: "否定", en: "He doesn't like coffee.", zh: "他不喜欢咖啡。", noteZh: "三单的「不」用 doesn't，动词打回原形。" },
      { label: "疑问", en: "Does he play football?", zh: "他踢足球吗？", noteZh: "Does 搬到句首，动词打回原形 play。" }
    ],
    sceneSwings: [
      { sceneZh: "说妈妈的日常", en: "She cooks dinner every day.", zh: "她每天做晚饭。" },
      { sceneZh: "说天气的规律", en: "It rains a lot in summer.", zh: "夏天老下雨。" },
      { sceneZh: "问同桌的习惯", en: "Does he read every morning?", zh: "他每天早读吗？" }
    ],
    deepDive: {
      title: "为什么三单要加 -s？什么时候加 es？",
      paragraphs: [
        "一般现在时里，只有「他、她、它」（三单）的动词要加小尾巴：I/you/we/they 都用原形。这是英语里最显眼的人称标记。",
        "大多数动词直接加 -s：drink → drinks、like → likes、play → plays。",
        "以 s、x、ch、sh、o 结尾的加 -es：watch → watches、go → goes、fix → fixes。",
        "「辅音 + y」结尾的把 y 变 i 再加 -es：study → studies、carry → carries。元音 + y 不变：play → plays。",
        "疑问句和否定句里，Does / doesn't 出场后动词打回原形：Does he play？He doesn't play——小尾巴由帮手扛。"
      ]
    },
    summary: {
      rule: "他、她、它做事，动词加小尾巴 -s；Does / doesn't 出场，动词打回原形。",
      points: [
        "He drinks. —— 三单加 -s",
        "She watches. —— ch 结尾加 -es",
        "Does he play? / He doesn't play. —— 帮手出场，动词回原形"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：他喜欢音乐。",
        before: "He",
        after: "music.",
        options: ["likes", "like", "liking"],
        answer: "likes",
        explain: "「他喜欢」是三单，动词加小尾巴 -s：likes。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：她每晚看电视。",
        tokens: ["She", "watches", "TV", "every", "night."],
        answer: "She watches TV every night.",
        explain: "watch 以 ch 结尾，三单加 es：watches。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：他踢足球吗？",
        tokens: ["Does", "he", "play", "football?"],
        answer: "Does he play football?",
        explain: "Does 搬到句首，动词打回原形 play。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["He", "drink", "milk", "every", "day."],
        wrongToken: "drink",
        answer: "drink",
        correctionZh: "把 drink 加小尾巴：He drinks milk every day。",
        explain: "三单动词要加 -s。"
      },
      {
        // R8 跨课复现：上一课（L24 完成时 vs 过去时）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：我去过北京。",
        tokens: ["I", "have", "been", "to", "Beijing."],
        answer: "I have been to Beijing.",
        explain: "复现第 24 课：「去过」固定是 have been to。"
      },
      {
        // R9 变形/替换：换主语 I→He，动词原形变三单（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I play football.」把主语 I 换成 He，play 要怎么变？",
        replaceBase: "I play football.",
        replaceTarget: "把 I 换成 He",
        options: ["plays", "play", "playing"],
        answer: "plays",
        explain: "He 是三单，play 要加小尾巴：He plays football。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：他每天喝牛奶。",
        tokens: ["He", "drinks", "milk", "every", "day."],
        distractors: ["drink"],
        answer: "He drinks milk every day."
      },
      {
        promptZh: "你想说：她不喜欢咖啡。",
        tokens: ["She", "doesn't", "like", "coffee."],
        distractors: ["don't"],
        answer: "She doesn't like coffee."
      },
      {
        // R06 变体扩量：与 variants 否定卡一致的否定变体题
        promptZh: "你想说：他不喜欢咖啡。",
        tokens: ["He", "doesn't", "like", "coffee."],
        distractors: ["don't", "isn't"],
        answer: "He doesn't like coffee."
      },
      {
        promptZh: "问同桌的习惯，你想说：他踢足球吗？",
        tokens: ["Does", "he", "play", "football?"],
        distractors: ["plays", "Is"],
        answer: "Does he play football?"
      },
      {
        promptZh: "你想说：他学英语。",
        tokens: ["He", "studies", "English."],
        distractors: ["studys"],
        answer: "He studies English."
      }
    ],
    // R5「忆」段：不给选项，凭记忆还原核心句
    recall: {
      promptZh: "朋友问你同桌有什么习惯。凭记忆，写出那句英文。",
      intentZh: "他每天喝牛奶。",
      answer: "He drinks milk every day.",
      noteZh: "「他喝」是三单，drink 要加小尾巴 -s。"
    },
    // R7：三单是中式错误 Top，配 2 案持续追踪 sv_agreement
    huntCaseIds: ["hunt-my-sister", "hunt-third-person-daily"]
  },
  {
    // ── 第三季巩固篇 · R2（L26 there be）：S0 明确列出而始终无课的 there be 句型 ──
    id: "lesson-26-there-be",
    number: 26,
    title: "桌上有一本书",
    grammarLabel: "存在句 · there is / there are",
    episode: "小美的一天 ㉖",
    scene: "mansion",
    cover: cover18,
    sceneSetupZh: "周末整理房间，小美帮你数桌上的东西。",
    dialogueEn: "What is on the desk?",
    dialogueZh: "你指着书桌问她。",
    intentZh: "桌上有一本书。",
    targetSentence: "There is a book on the desk.",
    blocks: [
      { text: "There is", role: "有（单数）" },
      { text: "a book", role: "一本书" },
      { text: "on the desk", role: "在桌上" }
    ],
    oneLineRule: "说「某处有某物」用 There is / There are 开头：单数用 is，复数用 are——中文的「有」直接说，英语要让 There 先占位。",
    examples: [
      { en: "There is a cat under the chair.", zh: "椅子下面有一只猫。" },
      { en: "There are three apples on the table.", zh: "桌上有三个苹果。" },
      { en: "There is some milk in the fridge.", zh: "冰箱里有一些牛奶。" },
      { en: "Is there a park near here?", zh: "这附近有公园吗？" }
    ],
    dialogue: [
      { who: "npc", en: "What is on the desk?", zh: "你指着书桌问她。" },
      { who: "npc", en: "Anything else?", zh: "她探头看了看又问。" },
      { who: "me", en: "There is a book on the desk.", zh: "轮到你说了——桌上有一本书。" }
    ],
    contrast: [
      {
        wrong: "There have a book on the desk.",
        wrongMark: "have",
        correct: "There is a book on the desk.",
        whyZh: "「某处有某物」用 There is / There are，不用 have——have 是「某人拥有」，There be 是「某处存在」。中文都是「有」，英语两条路。"
      },
      {
        wrong: "There is three apples on the table.",
        wrongMark: "is",
        correct: "There are three apples on the table.",
        whyZh: "三个苹果是复数，用 There are 不用 There is——看后面的东西是单数还是复数。"
      },
      {
        wrong: "There are a cat under the chair.",
        wrongMark: "are",
        correct: "There is a cat under the chair.",
        whyZh: "一只猫是单数，用 There is。are 只配两个以上的东西。"
      },
      {
        wrong: "Is there a park near here?",
        wrongMark: null,
        correct: "There is a park near here.",
        whyZh: "告诉别人「这里有公园」用陈述句 There is。Is there 开头是问句——这里要答，不是要问。"
      },
      {
        wrong: "There is some books on the desk.",
        wrongMark: "is",
        correct: "There are some books on the desk.",
        whyZh: "some books 是复数，用 There are。some 不改变单复数的判断——看后面的词本身。"
      },
      {
        wrong: "There is a milk in the fridge.",
        wrongMark: "a",
        correct: "There is some milk in the fridge.",
        whyZh: "milk 数不清，前面不能报数 a——用 some（一些）或直接 there is milk。数不清的东西不数个数。"
      }
    ],
    variants: [
      { label: "肯定", en: "There is a book on the desk.", zh: "桌上有一本书。" },
      { label: "否定", en: "There isn't a park near here.", zh: "这附近没有公园。", noteZh: "在 is 后面加 not：isn't。复数用 aren't。" },
      { label: "疑问", en: "Is there a park near here?", zh: "这附近有公园吗？", noteZh: "把 Is 搬到句首就是问句。复数用 Are there。" }
    ],
    sceneSwings: [
      { sceneZh: "看冰箱里的东西", en: "There is some milk in the fridge.", zh: "冰箱里有一些牛奶。" },
      { sceneZh: "数桌上的水果", en: "There are three apples on the table.", zh: "桌上有三个苹果。" },
      { sceneZh: "问附近有没有公园", en: "Is there a park near here?", zh: "这附近有公园吗？" }
    ],
    deepDive: {
      title: "There be 和 have 都是「有」，怎么分？",
      paragraphs: [
        "There be 说「某处存在某物」：There is a book on the desk（桌上有一本书）——重点是「那个地方有什么」。",
        "have 说「某人拥有某物」：I have a book（我有一本书）——重点是「谁拥有」。",
        "单数用 There is，复数用 There are，数不清的用 There is（牛奶、水这类）：There is some milk。",
        "问句把 Is / Are 搬到句首：Is there…? / Are there…?；否定在 be 后面加 not：isn't / aren't。"
      ]
    },
    summary: {
      rule: "某处有某物：单数 There is，复数 There are；问句 Is/Are 搬句首。",
      points: [
        "There is a book. —— 单数用 is",
        "There are three apples. —— 复数用 are",
        "Is there a park? —— 问句：Is 搬句首"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：桌上有一本书。",
        before: "",
        after: "a book on the desk.",
        options: ["There is", "There are", "There have"],
        answer: "There is",
        explain: "一本书是单数，用 There is。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：桌上有三个苹果。",
        tokens: ["There", "are", "three", "apples", "on", "the", "table."],
        answer: "There are three apples on the table.",
        explain: "三个苹果是复数，用 There are。"
      },
      {
        kind: "arrange",
        promptZh: "你想问：这附近有公园吗？",
        tokens: ["Is", "there", "a", "park", "near", "here?"],
        answer: "Is there a park near here?",
        explain: "问句把 Is 搬到句首。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["There", "have", "a", "book", "on", "the", "desk."],
        wrongToken: "have",
        answer: "have",
        correctionZh: "把 have 换成 is：There is a book on the desk。",
        explain: "「某处有某物」用 There be，不用 have。"
      },
      {
        // R8 跨课复现：上一课（L25 三单 -s）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：他喜欢音乐。",
        tokens: ["He", "likes", "music."],
        answer: "He likes music.",
        explain: "复现第 25 课：三单动词加 -s。"
      },
      {
        // R9 变形/替换：换数量（一本→三本），be 动词跟着换（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「There is a book on the desk.」把「一本书」换成「三本书」，is 要怎么变？",
        replaceBase: "There is a book on the desk.",
        replaceTarget: "把 a book 换成 three books",
        options: ["are", "is", "have"],
        answer: "are",
        explain: "三本书是复数，用 There are：There are three books。看后面的东西是单是复。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：桌上有一本书。",
        tokens: ["There", "is", "a", "book", "on", "the", "desk."],
        distractors: ["are"],
        answer: "There is a book on the desk."
      },
      {
        promptZh: "你想说：椅子上有一只猫。",
        tokens: ["There", "is", "a", "cat", "under", "the", "chair."],
        distractors: ["are"],
        answer: "There is a cat under the chair."
      },
      {
        // R06 变体扩量：与 variants 否定卡一致的否定变体题
        promptZh: "你想说：这附近没有公园。",
        tokens: ["There", "isn't", "a", "park", "near", "here."],
        distractors: ["is", "aren't"],
        answer: "There isn't a park near here."
      },
      {
        promptZh: "你想问：这附近有公园吗？",
        tokens: ["Is", "there", "a", "park", "near", "here?"],
        distractors: ["Are", "Does"],
        answer: "Is there a park near here?"
      }
    ],
    // R5「忆」段：不给选项，凭记忆还原核心句
    recall: {
      promptZh: "朋友问你桌上有什么。凭记忆，写出那句英文。",
      intentZh: "桌上有一本书。",
      answer: "There is a book on the desk.",
      noteZh: "「某处有某物」用 There is / There are，不用 have。"
    },
    huntCaseIds: ["hunt-there-be-room"]
  },
  {
    // ── 第三季巩固篇 · R3（L27 疑问词系统）：what/where/when/how 从未专攻，只作对话背景出现 ──
    id: "lesson-27-question-words",
    number: 27,
    title: "你在找什么",
    grammarLabel: "疑问词 · what / where / when / how",
    episode: "小美的一天 ㉗",
    scene: "city",
    cover: cover9,
    sceneSetupZh: "放学路上，小美看你东张西望，猜到你在找东西。",
    dialogueEn: "What are you looking for?",
    dialogueZh: "她停下来问你。",
    intentZh: "我在找我的钥匙。",
    targetSentence: "What are you looking for?",
    blocks: [
      { text: "What", role: "什么（问东西）" },
      { text: "are you", role: "你在" },
      { text: "looking for", role: "找" }
    ],
    oneLineRule: "问事情用 What，问地方用 Where，问时间用 When，问方式用 How——疑问词站句首，后面跟着 be 或帮手动词。",
    examples: [
      { en: "What is this?", zh: "这是什么？" },
      { en: "Where is my key?", zh: "我的钥匙在哪？" },
      { en: "When is your birthday?", zh: "你的生日是什么时候？" },
      { en: "How are you?", zh: "你好吗？（你怎么样）" }
    ],
    dialogue: [
      { who: "npc", en: "What are you looking for?", zh: "她停下来问你。" },
      { who: "npc", en: "Can I help you?", zh: "她又补了一句：要我帮忙吗？" },
      { who: "me", en: "I am looking for my key.", zh: "轮到你说了——你在找钥匙。" }
    ],
    contrast: [
      {
        wrong: "Where is this?",
        wrongMark: "Where",
        correct: "What is this?",
        whyZh: "问「这是什么」用 What；Where 是问地方（在哪）。拿错疑问词，意思就跑偏了。"
      },
      {
        wrong: "What is your birthday?",
        wrongMark: "What",
        correct: "When is your birthday?",
        whyZh: "问生日是问「什么时候」，用 When；What 是问「什么东西」。"
      },
      {
        wrong: "Where my key is?",
        wrongMark: "my key is",
        correct: "Where is my key?",
        whyZh: "疑问句里 be 要搬到主语前面：Where is my key？疑问词后面跟着 be，不是跟着主语。"
      },
      {
        wrong: "How is your name?",
        wrongMark: "How",
        correct: "What is your name?",
        whyZh: "问名字用 What（是什么）；How 是问方式或状况（怎么样）。"
      },
      {
        wrong: "When you go to school?",
        wrongMark: "you go",
        correct: "When do you go to school?",
        whyZh: "问动作（去上学）要请帮手 do：When do you go……？be 管名词，do 管动作。"
      },
      {
        wrong: "What are you look for?",
        wrongMark: "look",
        correct: "What are you looking for?",
        whyZh: "「正在找」用进行时 looking：What are you looking for？are 后面的动词要穿 -ing 外套。"
      }
    ],
    variants: [
      { label: "肯定", en: "This is my key.", zh: "这是我的钥匙。" },
      { label: "否定", en: "I don't know where it is.", zh: "我不知道它在哪。", noteZh: "「不知道」用 don't know，后面疑问句变陈述语序（where it is，不颠倒）。" },
      { label: "疑问", en: "Where is my key?", zh: "我的钥匙在哪？", noteZh: "问地方用 Where，be 搬到主语前。" }
    ],
    sceneSwings: [
      { sceneZh: "指着不认识的东西问", en: "What is this?", zh: "这是什么？" },
      { sceneZh: "找不着钥匙时自言自语", en: "Where is my key?", zh: "我的钥匙在哪？" },
      { sceneZh: "问同学几点上课", en: "When is the class?", zh: "什么时候上课？" }
    ],
    deepDive: {
      title: "疑问词后面，be 和 do 怎么选？",
      paragraphs: [
        "问名词（是什么、在哪、什么时候），疑问词后面跟 be：What is this? / Where is my key? / When is the class?",
        "问动作（做什么、怎么做），疑问词后面要请帮手 do/does/did：What do you want? / How does he go to school?",
        "四个疑问词各管一摊：What 管东西，Where 管地方，When 管时间，How 管方式或身体状况（How are you）。",
        "记住口诀：疑问词站句首，名词用 be，动作用 do——语序和陈述句正好反过来。"
      ]
    },
    summary: {
      rule: "What 问东西，Where 问地方，When 问时间，How 问方式；名词用 be，动作用 do。",
      points: [
        "What is this? —— 问东西：What + be",
        "Where is my key? —— 问地方：Where + be",
        "When do you go? —— 问动作：When + do"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想问：这是什么？",
        before: "",
        after: "is this?",
        options: ["What", "Where", "When"],
        answer: "What",
        explain: "问「是什么」用 What。"
      },
      {
        kind: "arrange",
        promptZh: "你想问：我的钥匙在哪？",
        tokens: ["Where", "is", "my", "key?"],
        answer: "Where is my key?",
        explain: "问地方用 Where，be 搬到主语前。"
      },
      {
        kind: "arrange",
        promptZh: "你想问：你什么时候去上学？",
        tokens: ["When", "do", "you", "go", "to", "school?"],
        answer: "When do you go to school?",
        explain: "问动作要请帮手 do：When do you go……？"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["Where", "my", "key", "is?"],
        wrongToken: "my",
        answer: "my",
        correctionZh: "be 要搬到主语前面：Where is my key？",
        explain: "疑问句里 be 站在疑问词后面、主语前面。"
      },
      {
        // R8 跨课复现：上一课（L26 there be）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：桌上有三个苹果。",
        tokens: ["There", "are", "three", "apples", "on", "the", "table."],
        answer: "There are three apples on the table.",
        explain: "复现第 26 课：复数用 There are。"
      },
      {
        // R9 变形/替换：换疑问对象（东西→地方），疑问词跟着换（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「What is this?」把「这是什么」换成「我的钥匙在哪」，What 要怎么变？",
        replaceBase: "What is this?",
        replaceTarget: "换成「在哪」（问地方）",
        options: ["Where", "When", "How"],
        answer: "Where",
        explain: "问地方用 Where：Where is my key？What 管东西，Where 管地方。"
      }
    ],
    practice: [
      {
        promptZh: "你想问：这是什么？",
        tokens: ["What", "is", "this?"],
        distractors: ["Where"],
        answer: "What is this?"
      },
      {
        promptZh: "你想问：你的生日是什么时候？",
        tokens: ["When", "is", "your", "birthday?"],
        distractors: ["What"],
        answer: "When is your birthday?"
      },
      {
        // R06 变体扩量：与 variants 否定卡一致的否定变体题
        promptZh: "朋友问你钥匙在哪，你想说：我不知道它在哪。",
        tokens: ["I", "don't", "know", "where", "it", "is."],
        distractors: ["isn't", "doesn't"],
        answer: "I don't know where it is."
      },
      {
        promptZh: "你想问：我的钥匙在哪？",
        tokens: ["Where", "is", "my", "key?"],
        distractors: ["What", "are"],
        answer: "Where is my key?"
      }
    ],
    // R5「忆」段：不给选项，凭记忆还原核心句
    recall: {
      promptZh: "你看到朋友在找东西，想问他在找什么。凭记忆，写出那句英文。",
      intentZh: "你在找什么？",
      answer: "What are you looking for?",
      noteZh: "问「正在找什么」：What are you looking for？are 后面动词穿 -ing 外套。"
    },
    huntCaseIds: ["hunt-question-words"]
  },
  {
    // ── 第三季巩固篇 · R4（L28 频率副词）：always/often/never 与三单天然同季连排（一般现在时习惯）──
    id: "lesson-28-frequency",
    number: 28,
    title: "我总是早到",
    grammarLabel: "频率副词 · always / often / never",
    episode: "小美的一天 ㉘",
    scene: "campus",
    cover: cover16,
    sceneSetupZh: "周一早上，小美发现自己总是第一个到教室。",
    dialogueEn: "You are always early!",
    dialogueZh: "同桌惊讶地说。",
    intentZh: "我总是早到。",
    targetSentence: "I always arrive early.",
    blocks: [
      { text: "I", role: "我" },
      { text: "always", role: "总是（小标签）" },
      { text: "arrive", role: "到" },
      { text: "early", role: "早" }
    ],
    oneLineRule: "说「总是、经常、从不」用频率副词，它站在普通动词前面、be 动词后面：I always go / She is always happy。",
    examples: [
      { en: "I always arrive early.", zh: "我总是早到。" },
      { en: "She often reads at night.", zh: "她经常晚上看书。" },
      { en: "He never eats candy.", zh: "他从不吃糖。" },
      { en: "They are always happy.", zh: "他们总是很开心。" }
    ],
    dialogue: [
      { who: "npc", en: "You are always early!", zh: "同桌惊讶地说。" },
      { who: "npc", en: "Do you ever come late?", zh: "她又好奇地问：你迟到过吗？" },
      { who: "me", en: "I always arrive early.", zh: "轮到你说了——我总是早到。" }
    ],
    contrast: [
      {
        wrong: "I go always to school early.",
        wrongMark: "go always",
        correct: "I always go to school early.",
        whyZh: "频率副词站在普通动词前面：always go。它不能跑到动词后面去。"
      },
      {
        wrong: "She always is happy.",
        wrongMark: "always is",
        correct: "She is always happy.",
        whyZh: "be 动词前面反过来：频率副词站在 be 后面——is always，不是 always is。"
      },
      {
        wrong: "He never doesn't eat candy.",
        wrongMark: "doesn't",
        correct: "He never eats candy.",
        whyZh: "never 本身就是「从不」，再加 don't 就双重否定了——英语一个否定就够，never 出场动词照样肯定形。"
      },
      {
        wrong: "He play often football.",
        wrongMark: "play often",
        correct: "He often plays football.",
        whyZh: "两个错：频率副词站在动词前（often plays），三单动词加 -s（plays）。"
      },
      {
        wrong: "I am always arrive early.",
        wrongMark: "am",
        correct: "I always arrive early.",
        whyZh: "「总是早到」是习惯动作，动词 arrive 本身就够，不用加 be——be 后面接形容词，不接动作。"
      },
      {
        wrong: "They often are late.",
        wrongMark: "often are",
        correct: "They are often late.",
        whyZh: "be 动词的特殊规矩：频率副词跟在 be 后面——are often，不是 often are。"
      }
    ],
    variants: [
      { label: "肯定", en: "I always arrive early.", zh: "我总是早到。" },
      { label: "否定", en: "He never eats candy.", zh: "他从不吃糖。", noteZh: "never 就是否定，动词照样肯定形（eats），不再加 don't。" },
      { label: "疑问", en: "Do you often read at night?", zh: "你经常晚上看书吗？", noteZh: "问句请 do 帮忙，often 站在动词 read 前面。" }
    ],
    sceneSwings: [
      { sceneZh: "说你的阅读习惯", en: "I often read at night.", zh: "我经常晚上看书。" },
      { sceneZh: "说同桌从不吃糖", en: "He never eats candy.", zh: "他从不吃糖。" },
      { sceneZh: "形容你们班的气氛", en: "They are always happy.", zh: "他们总是很开心。" }
    ],
    deepDive: {
      title: "频率副词的位置：动词前、be 后，为什么？",
      paragraphs: [
        "普通动词（go、read、play）：频率副词站在它前面——I always go、She often reads。",
        "be 动词（am/is/are）反过来：频率副词站在它后面——She is always happy、They are often late。",
        "一句话记：「动作前，be 后」。be 是特例，跟它换个位置就行。",
        "频率从高到低：always（总是）→ usually（通常）→ often（经常）→ sometimes（有时）→ never（从不）。",
        "never 自带否定：He never eats，不再加 don't——一个否定就够。"
      ]
    },
    summary: {
      rule: "频率副词：动作前，be 后；never 自带否定不加 don't。",
      points: [
        "I always go. —— 动词前",
        "She is always happy. —— be 后",
        "He never eats. —— never 自带否定"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我总是早到。",
        before: "I",
        after: "arrive early.",
        options: ["always", "am always", "go always"],
        answer: "always",
        explain: "频率副词站在动词 arrive 前面：always arrive。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：她经常晚上看书。",
        tokens: ["She", "often", "reads", "at", "night."],
        answer: "She often reads at night.",
        explain: "often 站在动词 reads 前面，三单 reads 加 -s。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：他从不吃糖。",
        tokens: ["He", "never", "eats", "candy."],
        answer: "He never eats candy.",
        explain: "never 自带否定，动词 eats 照样肯定形。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["She", "always", "is", "happy."],
        wrongToken: "always",
        answer: "always",
        correctionZh: "be 后面才是频率副词的位置：She is always happy。",
        explain: "be 动词的特殊规矩：频率副词跟在 be 后面。"
      },
      {
        // R8 跨课复现：上一课（L27 疑问词）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：我的钥匙在哪？",
        tokens: ["Where", "is", "my", "key?"],
        answer: "Where is my key?",
        explain: "复现第 27 课：问地方用 Where + be。"
      },
      {
        // R9 变形/替换：换动词类型（动作→be），频率副词位置跟着换（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I always arrive early.」把「早到」换成「开心（happy）」，always 的位置要怎么变？",
        replaceBase: "I always arrive early.",
        replaceTarget: "换成「我总是开心」（用 be）",
        options: ["am always", "always am", "always is"],
        answer: "am always",
        explain: "happy 是形容词，要用 be；频率副词跟在 be 后面：I am always happy。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我总是早到。",
        tokens: ["I", "always", "arrive", "early."],
        distractors: ["am"],
        answer: "I always arrive early."
      },
      {
        promptZh: "你想说：他经常踢足球。",
        tokens: ["He", "often", "plays", "football."],
        distractors: ["play"],
        answer: "He often plays football."
      },
      {
        // R06 变体扩量：与 variants 否定卡一致的否定变体题
        promptZh: "你想说：他从不吃糖。",
        tokens: ["He", "never", "eats", "candy."],
        distractors: ["doesn't", "don't"],
        answer: "He never eats candy."
      },
      {
        promptZh: "你想说：他们总是很开心。",
        tokens: ["They", "are", "always", "happy."],
        distractors: ["always are"],
        answer: "They are always happy."
      }
    ],
    recall: {
      promptZh: "朋友问你怎么总是第一个到教室。凭记忆，写出那句英文。",
      intentZh: "我总是早到。",
      answer: "I always arrive early.",
      noteZh: "频率副词站在动词前面：always arrive。"
    },
    huntCaseIds: ["hunt-frequency-habit"]
  },
  {
    // ── 第三季巩固篇 · R5（L29 be going to）：S2 列出，与 L12 will 形成对比对，复用对比课模板 ──
    id: "lesson-29-be-going-to",
    number: 29,
    title: "我打算去看电影",
    grammarLabel: "将来时 · be going to",
    episode: "小美的一天 ㉙",
    scene: "city",
    cover: cover2,
    sceneSetupZh: "周五放学，小美和同学约周末的计划。",
    dialogueEn: "What are you going to do this weekend?",
    dialogueZh: "同学问你。",
    intentZh: "我打算去看电影。",
    targetSentence: "I am going to watch a movie.",
    blocks: [
      { text: "I am going to", role: "我打算" },
      { text: "watch", role: "看（原样）" },
      { text: "a movie", role: "一场电影" }
    ],
    oneLineRule: "说「打算做、就要做」用 be going to + 动词原形：I am going to watch。be 跟着主语变（am/is/are），going to 不变。",
    examples: [
      { en: "I am going to watch a movie.", zh: "我打算去看电影。" },
      { en: "She is going to visit her grandma.", zh: "她打算去看外婆。" },
      { en: "We are going to play football.", zh: "我们打算去踢足球。" },
      { en: "It is going to rain.", zh: "（看这天）要下雨了。" }
    ],
    dialogue: [
      { who: "npc", en: "What are you going to do this weekend?", zh: "同学问你。" },
      { who: "npc", en: "The new movie is really good.", zh: "她补了一句：那部新电影很不错。" },
      { who: "me", en: "I am going to watch a movie.", zh: "轮到你说了——你打算去看电影。" }
    ],
    contrast: [
      {
        wrong: "I going to watch a movie.",
        wrongMark: null,
        correct: "I am going to watch a movie.",
        whyZh: "be going to 里的 be 不能丢——I am going to。be 跟着主语变（am/is/are），少了它句子就塌了。"
      },
      {
        wrong: "I am going to watching.",
        wrongMark: "watching",
        correct: "I am going to watch a movie.",
        whyZh: "going to 后面的动词穿原样：going to watch。-ing 要 be 搭着才是「正在做」；和 will 后面的动词一个规矩。"
      },
      {
        wrong: "She are going to visit her grandma.",
        wrongMark: "are",
        correct: "She is going to visit her grandma.",
        whyZh: "be 跟着主语变：She 是单数用 is。going to 不变，变的是前面的 be。"
      },
      {
        wrong: "I will going to watch a movie.",
        wrongMark: "will going",
        correct: "I am going to watch a movie.",
        whyZh: "will 和 be going to 都说「将来」，但两个不能挤一起——选一个：I will watch 或 I am going to watch。"
      },
      {
        wrong: "Are you going to watch?",
        wrongMark: null,
        correct: "You are going to watch.",
        whyZh: "告诉别人「你打算看」用陈述句 You are。Are you 开头是问句——这里要答，不是要问。"
      },
      {
        wrong: "It will rains tomorrow.",
        wrongMark: "rains",
        correct: "It is going to rain tomorrow.",
        whyZh: "两个错：will 后动词要原形（rain 不是 rains）；说「看迹象要发生」，be going to 比 will 更贴切。"
      }
    ],
    variants: [
      { label: "肯定", en: "I am going to watch a movie.", zh: "我打算去看电影。" },
      { label: "否定", en: "I am not going to watch a movie.", zh: "我不打算去看电影。", noteZh: "在 be 后面加 not：am not going to。" },
      { label: "疑问", en: "Are you going to watch a movie?", zh: "你打算去看电影吗？", noteZh: "把 be 搬到句首：Are you going to……？" }
    ],
    sceneSwings: [
      { sceneZh: "说周末计划", en: "I am going to visit my grandma.", zh: "我打算去看外婆。" },
      { sceneZh: "看乌云说要下雨", en: "It is going to rain.", zh: "要下雨了。" },
      { sceneZh: "问同学的打算", en: "What are you going to do?", zh: "你打算做什么？" }
    ],
    deepDive: {
      title: "be going to 和 will 都是「将来」，怎么选？",
      paragraphs: [
        "be going to：早有打算、计划好的事，或看迹象就要发生——I am going to watch a movie（早计划好了）/ It is going to rain（看乌云就知道）。",
        "will：说话那一刻才决定的、或承诺——I will call you tonight（刚决定的）。",
        "初学者不用纠结：很多情况下两个能互换。先记住一个倾向——「有计划用 be going to，临时决定用 will」。",
        "形状上：will 永不变形（will go）；be going to 的 be 跟着主语变（am/is/are going to），going to 不变。"
      ]
    },
    summary: {
      rule: "打算/就要 = be going to + 动词原形，be 跟着主语变。",
      points: [
        "I am going to watch. —— be + going to + 原形",
        "She is going to visit. —— be 跟着主语变 is",
        "Are you going to watch? —— 问句：be 搬句首"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我打算去看电影。",
        before: "I",
        after: "going to watch a movie.",
        options: ["am", "is", "are"],
        answer: "am",
        explain: "I 的 be 搭档是 am：I am going to watch。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：她打算去看外婆。",
        tokens: ["She", "is", "going", "to", "visit", "her", "grandma."],
        answer: "She is going to visit her grandma.",
        explain: "She 的 be 是 is，going to 后面的动词穿原样 visit。"
      },
      {
        kind: "arrange",
        promptZh: "你想问：周末你打算做什么？",
        tokens: ["What", "are", "you", "going", "to", "do", "this", "weekend?"],
        answer: "What are you going to do this weekend?",
        explain: "问句把 be（are）搬到主语 you 前面。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "going", "to", "watch", "a", "movie."],
        wrongToken: "going",
        answer: "going",
        correctionZh: "going to 前面要有 be：I am going to watch a movie。",
        explain: "be going to 里的 be 不能丢。"
      },
      {
        // R8 跨课复现：上一课（L28 频率副词）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：他总是很开心。",
        tokens: ["He", "is", "always", "happy."],
        answer: "He is always happy.",
        explain: "复现第 28 课：频率副词跟在 be 后面。"
      },
      {
        // R9 变形/替换：换主语 I→She，be 跟着换（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I am going to watch a movie.」把主语 I 换成 She，am 要怎么变？",
        replaceBase: "I am going to watch a movie.",
        replaceTarget: "把 I 换成 She",
        options: ["is", "am", "are"],
        answer: "is",
        explain: "be 跟着主语变：She is going to。going to 不变，变的是 be。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我打算去看电影。",
        tokens: ["I", "am", "going", "to", "watch", "a", "movie."],
        distractors: ["will"],
        answer: "I am going to watch a movie."
      },
      {
        promptZh: "你想说：我们打算去踢足球。",
        tokens: ["We", "are", "going", "to", "play", "football."],
        distractors: ["is"],
        answer: "We are going to play football."
      },
      {
        // R06 变体扩量：与 variants 否定卡一致的否定变体题
        promptZh: "你想说：我不打算去看电影。",
        tokens: ["I", "am", "not", "going", "to", "watch", "a", "movie."],
        distractors: ["don't"],
        answer: "I am not going to watch a movie."
      },
      {
        promptZh: "看乌云，你想说：要下雨了。",
        tokens: ["It", "is", "going", "to", "rain."],
        distractors: ["rains", "will"],
        answer: "It is going to rain."
      }
    ],
    recall: {
      promptZh: "同学问你周末打算做什么。凭记忆，写出那句英文。",
      intentZh: "我打算去看电影。",
      answer: "I am going to watch a movie.",
      noteZh: "打算 = be going to + 动词原形，be 跟着主语变。"
    },
    huntCaseIds: ["hunt-going-to-plan"]
  },
  {
    // ── 第三季巩固篇 · R6（L30 some/any/much/many）：S1 列出，名词复数（L11）已建 ──
    id: "lesson-30-some-any",
    number: 30,
    title: "桌上有一些苹果",
    grammarLabel: "数量词 · some / any / much / many",
    episode: "小美的一天 ㉚",
    scene: "mansion",
    cover: cover11,
    sceneSetupZh: "周末大扫除，小美帮你数家里的东西。",
    dialogueEn: "Are there any apples on the table?",
    dialogueZh: "你问她。",
    intentZh: "桌上有一些苹果。",
    targetSentence: "There are some apples on the table.",
    blocks: [
      { text: "There are", role: "有" },
      { text: "some", role: "一些（肯定）" },
      { text: "apples", role: "苹果（复数）" },
      { text: "on the table", role: "在桌上" }
    ],
    oneLineRule: "「一些」：肯定句用 some，疑问句和否定句换 any。数得清的用 many，数不清的用 much。",
    examples: [
      { en: "There are some apples on the table.", zh: "桌上有一些苹果。" },
      { en: "Are there any apples?", zh: "有苹果吗？" },
      { en: "I don't have any candy.", zh: "我没有糖。" },
      { en: "How many books do you have?", zh: "你有多少本书？" }
    ],
    dialogue: [
      { who: "npc", en: "Are there any apples on the table?", zh: "你问她。" },
      { who: "npc", en: "I am hungry.", zh: "她摸了摸肚子说。" },
      { who: "me", en: "There are some apples on the table.", zh: "轮到你说了——桌上有一些苹果。" }
    ],
    contrast: [
      {
        wrong: "Are there some apples on the table?",
        wrongMark: "some",
        correct: "Are there any apples on the table?",
        whyZh: "疑问句里「一些」要换 any，不用 some——some 是肯定句的搭档，疑问和否定要换 any。"
      },
      {
        wrong: "I don't have some candy.",
        wrongMark: "some",
        correct: "I don't have any candy.",
        whyZh: "否定句里也用 any 不用 some——don't have any。some 只在肯定句里用。"
      },
      {
        wrong: "How much books do you have?",
        wrongMark: "much",
        correct: "How many books do you have?",
        whyZh: "books 数得清，用 How many 问数量；much 问数不清的（水、牛奶、时间）。"
      },
      {
        wrong: "How many milk is there?",
        wrongMark: "many",
        correct: "How much milk is there?",
        whyZh: "milk 数不清，用 How much 问；many 只问数得清的一个一个的东西。"
      },
      {
        wrong: "There are any apples on the table.",
        wrongMark: "any",
        correct: "There are some apples on the table.",
        whyZh: "肯定句里用 some 不用 any——any 是疑问句和否定句的搭档，别把两家搞混。"
      },
      {
        wrong: "I have much friends.",
        wrongMark: "much",
        correct: "I have many friends.",
        whyZh: "friends 数得清，用 many；much 只配数不清的东西（much time、much water）。"
      }
    ],
    variants: [
      { label: "肯定", en: "There are some apples on the table.", zh: "桌上有一些苹果。" },
      { label: "否定", en: "There aren't any apples.", zh: "没有苹果。", noteZh: "否定句用 any：aren't any。" },
      { label: "疑问", en: "Are there any apples?", zh: "有苹果吗？", noteZh: "疑问句也用 any：Are there any……？" }
    ],
    sceneSwings: [
      { sceneZh: "看冰箱里的牛奶", en: "There is some milk in the fridge.", zh: "冰箱里有一些牛奶。" },
      { sceneZh: "问有没有糖", en: "Do you have any candy?", zh: "你有糖吗？" },
      { sceneZh: "问家里有几本书", en: "How many books do you have?", zh: "你有多少本书？" }
    ],
    deepDive: {
      title: "some/any 是一家，much/many 是一家，怎么分？",
      paragraphs: [
        "some 和 any 都是「一些」：肯定句用 some（There are some apples），疑问句和否定句换 any（Are there any? / don't have any）。",
        "much 和 many 都是「多」：数得清的用 many（many books、many friends），数不清的用 much（much milk、much time）。",
        "问数量也是这个规矩：How many + 数得清（How many books），How much + 数不清（How much milk）。",
        "一句话记：「肯定 some 疑问 any，数得清 many 数不清 much」。"
      ]
    },
    summary: {
      rule: "肯定用 some，疑问/否定用 any；数得清用 many，数不清用 much。",
      points: [
        "some apples —— 肯定句用 some",
        "any apples? —— 疑问/否定用 any",
        "many books / much milk —— 数得清 many，数不清 much"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想问：有苹果吗？",
        before: "Are there",
        after: "apples?",
        options: ["any", "some", "much"],
        answer: "any",
        explain: "疑问句里「一些」用 any。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：桌上有一些苹果。",
        tokens: ["There", "are", "some", "apples", "on", "the", "table."],
        answer: "There are some apples on the table.",
        explain: "肯定句里「一些」用 some。"
      },
      {
        kind: "arrange",
        promptZh: "你想问：你有多少本书？",
        tokens: ["How", "many", "books", "do", "you", "have?"],
        answer: "How many books do you have?",
        explain: "books 数得清，用 How many 问。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "don't", "have", "some", "candy."],
        wrongToken: "some",
        answer: "some",
        correctionZh: "否定句用 any：I don't have any candy。",
        explain: "some 只在肯定句，否定和疑问换 any。"
      },
      {
        // R8 跨课复现：上一课（L29 be going to）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：要下雨了。",
        tokens: ["It", "is", "going", "to", "rain."],
        answer: "It is going to rain.",
        explain: "复现第 29 课：看迹象要发生用 be going to。"
      },
      {
        // R9 变形/替换：换句式（肯定→疑问），some 换 any（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「There are some apples.」把它改成疑问句「有苹果吗」，some 要怎么变？",
        replaceBase: "There are some apples.",
        replaceTarget: "改成疑问句",
        options: ["any", "some", "much"],
        answer: "any",
        explain: "疑问句里 some 换 any：Are there any apples？"
      }
    ],
    practice: [
      {
        promptZh: "你想说：桌上有一些苹果。",
        tokens: ["There", "are", "some", "apples", "on", "the", "table."],
        distractors: ["any"],
        answer: "There are some apples on the table."
      },
      {
        promptZh: "你想问：有苹果吗？",
        tokens: ["Are", "there", "any", "apples?"],
        distractors: ["some"],
        answer: "Are there any apples?"
      },
      {
        // R06 变体扩量：与 variants 否定卡一致的否定变体题
        promptZh: "你想说：我没有糖。",
        tokens: ["I", "don't", "have", "any", "candy."],
        distractors: ["some", "much"],
        answer: "I don't have any candy."
      },
      {
        promptZh: "你想问：有多少牛奶？",
        tokens: ["How", "much", "milk", "is", "there?"],
        distractors: ["many"],
        answer: "How much milk is there?"
      }
    ],
    recall: {
      promptZh: "妈妈问冰箱里有什么，你说有牛奶。凭记忆，写出那句英文。",
      intentZh: "桌上有一些苹果。",
      answer: "There are some apples on the table.",
      noteZh: "肯定句「一些」用 some；疑问和否定换 any。"
    },
    huntCaseIds: ["hunt-some-any-fridge"]
  },
  {
    // ── 第三季巩固篇 · R7（L31 最高级）：L17 比较级已建且标注「暂不涉」，顺势收尾 ──
    id: "lesson-31-superlative",
    number: 31,
    title: "这是最大的苹果",
    grammarLabel: "形容词最高级 · -est / most",
    episode: "小美的一天 ㉛",
    scene: "island",
    cover: cover14,
    sceneSetupZh: "水果摊前，小美挑三个苹果里最大的那个。",
    dialogueEn: "Which one do you want?",
    dialogueZh: "摊主问你。",
    intentZh: "我要最大的那个。",
    targetSentence: "I want the biggest apple.",
    blocks: [
      { text: "I want", role: "我要" },
      { text: "the biggest", role: "最大的（the + -est）" },
      { text: "apple", role: "苹果" }
    ],
    oneLineRule: "「最……」：短词加 -est（biggest），长词用 most（most beautiful），前面必须站 the——the biggest。",
    examples: [
      { en: "I want the biggest apple.", zh: "我要最大的那个苹果。" },
      { en: "She is the tallest in our class.", zh: "她是全班最高的。" },
      { en: "This is the most beautiful flower.", zh: "这是最漂亮的花。" },
      { en: "It is the best movie this year.", zh: "这是今年最好的电影。" }
    ],
    dialogue: [
      { who: "npc", en: "Which one do you want?", zh: "摊主问你。" },
      { who: "npc", en: "Big or small?", zh: "他又补了一句：大的还是小的？" },
      { who: "me", en: "I want the biggest apple.", zh: "轮到你说了——你要最大的那个。" }
    ],
    contrast: [
      {
        wrong: "I want biggest apple.",
        wrongMark: null,
        correct: "I want the biggest apple.",
        whyZh: "「最……」前面必须站 the：the biggest。丢了 the，最大的那个就没归属了。"
      },
      {
        wrong: "She is more taller than me.",
        wrongMark: "more",
        correct: "She is taller than me.",
        whyZh: "比较级 more 和 -er 只能用一个——这句是复习：taller 已带 -er，most/more 不用来了。"
      },
      {
        wrong: "She is the tallest than me.",
        wrongMark: "than",
        correct: "She is the tallest in our class.",
        whyZh: "最高级比的是一群里挑一个，用 in（在……里）；than 是比较级（两者比）的搭档，别混。"
      },
      {
        wrong: "This is the most biggest apple.",
        wrongMark: "most",
        correct: "This is the biggest apple.",
        whyZh: "most 和 -est 只能用一个：biggest 已经带了 -est，most 就不用来了——和比较级 more/-er 一个规矩。"
      },
      {
        wrong: "He is the most tall in our class.",
        wrongMark: "most tall",
        correct: "He is the tallest in our class.",
        whyZh: "tall 是短词，自己加 -est：tallest，不请 most 帮忙——most 只配长词。"
      },
      {
        wrong: "This is the goodest apple.",
        wrongMark: "goodest",
        correct: "This is the best apple.",
        whyZh: "good 的「最好」是 best，不是 goodest——它和 good→better 一样不守规矩，要单独记。"
      }
    ],
    variants: [
      { label: "肯定", en: "I want the biggest apple.", zh: "我要最大的那个苹果。" },
      { label: "否定", en: "This is not the best one.", zh: "这不是最好的那个。", noteZh: "not 放回 be 后面，the best 不变。" },
      { label: "疑问", en: "Is this the biggest one?", zh: "这是最大的那个吗？", noteZh: "把 Is 搬到句首，the biggest 留在原地。" }
    ],
    sceneSwings: [
      { sceneZh: "说班里谁最高", en: "She is the tallest in our class.", zh: "她是全班最高的。" },
      { sceneZh: "夸花店里最好看的花", en: "This is the most beautiful flower.", zh: "这是最漂亮的花。" },
      { sceneZh: "聊今年最好的电影", en: "It is the best movie this year.", zh: "这是今年最好的电影。" }
    ],
    deepDive: {
      title: "比较级是「更」，最高级是「最」——形状是一对双胞胎",
      paragraphs: [
        "短词：比较级加 -er（bigger），最高级加 -est（biggest）——双写 g 的规矩一模一样。",
        "长词：比较级用 more（more beautiful），最高级用 most（most beautiful）。",
        "不守规矩的：good → better → best，bad → worse → worst——比较级和最高级都要单独记。",
        "最大的差别：最高级前面必须站 the（the biggest），因为「最」的那一个是独一无二的；比较级后面用 than 接对手（bigger than）。"
      ]
    },
    summary: {
      rule: "最……= the + 短词 -est / the + most 长词，the 不能丢。",
      points: [
        "the biggest —— 短词：双写加 -est",
        "the most beautiful —— 长词：most 站前面",
        "good → the best —— 不规则，单独记"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：她是全班最高的。",
        before: "She is",
        after: "in our class.",
        options: ["the tallest", "tallest", "the most tall"],
        answer: "the tallest",
        explain: "最高级前必须站 the，tall 是短词加 -est。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我要最大的那个苹果。",
        tokens: ["I", "want", "the", "biggest", "apple."],
        answer: "I want the biggest apple.",
        explain: "the + biggest，the 不能丢。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：这是最漂亮的花。",
        tokens: ["This", "is", "the", "most", "beautiful", "flower."],
        answer: "This is the most beautiful flower.",
        explain: "长词用 most，前面站 the。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["He", "is", "the", "most", "tallest", "in", "our", "class."],
        wrongToken: "most",
        answer: "most",
        correctionZh: "most 和 -est 只能用一个：He is the tallest。",
        explain: "tallest 已经带了 -est，most 不用来了。"
      },
      {
        // R8 跨课复现：上一课（L30 some/any）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：我没有糖。",
        tokens: ["I", "don't", "have", "any", "candy."],
        answer: "I don't have any candy.",
        explain: "复现第 30 课：否定句用 any。"
      },
      {
        // R9 变形/替换：换形容词（短词最高→长词最高），形状跟着换（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I want the biggest apple.」把「大」换成「漂亮（beautiful）」，the biggest 要怎么变？",
        replaceBase: "I want the biggest apple.",
        replaceTarget: "把 biggest 换成「最漂亮」",
        options: ["the most beautiful", "the beautifulest", "most beautiful"],
        answer: "the most beautiful",
        explain: "beautiful 是长词，用 the most beautiful——the 不能丢。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我要最大的那个苹果。",
        tokens: ["I", "want", "the", "biggest", "apple."],
        distractors: ["bigger"],
        answer: "I want the biggest apple."
      },
      {
        promptZh: "你想说：她是全班最高的。",
        tokens: ["She", "is", "the", "tallest", "in", "our", "class."],
        distractors: ["taller"],
        answer: "She is the tallest in our class."
      },
      {
        // R06 变体扩量：与 variants 否定卡一致的否定变体题
        promptZh: "你想说：这不是最好的那个。",
        tokens: ["This", "is", "not", "the", "best", "one."],
        distractors: ["goodest"],
        answer: "This is not the best one."
      },
      {
        promptZh: "聊电影，你想说：这是今年最好的电影。",
        tokens: ["It", "is", "the", "best", "movie", "this", "year."],
        distractors: ["better"],
        answer: "It is the best movie this year."
      }
    ],
    recall: {
      promptZh: "摊主问你要哪个苹果。凭记忆，写出那句英文。",
      intentZh: "我要最大的那个。",
      answer: "I want the biggest apple.",
      noteZh: "最高级前必须站 the：the biggest。"
    },
    huntCaseIds: ["hunt-superlative-market"]
  },
  {
    // ── 第三季巩固篇 · R8（L32 祈使句）：零术语叙事最友好的点（指令场景）──
    id: "lesson-32-imperative",
    number: 32,
    title: "把门关上",
    grammarLabel: "祈使句 · 动词开头",
    episode: "小美的一天 ㉜",
    scene: "mansion",
    cover: cover21,
    sceneSetupZh: "起风了，外婆朝屋里喊。",
    dialogueEn: "Close the door, please!",
    dialogueZh: "外婆朝你喊。",
    intentZh: "把门关上。",
    targetSentence: "Close the door.",
    blocks: [
      { text: "Close", role: "关（动词开头）" },
      { text: "the door", role: "门" }
    ],
    oneLineRule: "请人做事：动词直接开头——Close the door。不说 You close（省掉主语），加 please 更礼貌。",
    examples: [
      { en: "Close the door.", zh: "把门关上。" },
      { en: "Open your book.", zh: "打开书。" },
      { en: "Please sit down.", zh: "请坐。" },
      { en: "Don't be late!", zh: "别迟到！" }
    ],
    dialogue: [
      { who: "npc", en: "Close the door, please!", zh: "外婆朝你喊。" },
      { who: "npc", en: "The wind is too strong.", zh: "她又补了一句：风太大了。" },
      { who: "me", en: "OK! I will close it.", zh: "你应了一声——这就去关。" }
    ],
    contrast: [
      {
        wrong: "You close the door, please.",
        wrongMark: "You",
        correct: "Close the door, please.",
        whyZh: "请人做事，动词直接开头，不说 You——省掉主语才是地道的请求。"
      },
      {
        wrong: "Closing the door!",
        wrongMark: "Closing",
        correct: "Close the door!",
        whyZh: "祈使句的动词穿原样（Close）——-ing 是「正在做」或「当名字」的打扮，祈使句两样都不用。"
      },
      {
        wrong: "Please you open the book.",
        wrongMark: "you",
        correct: "Please open the book.",
        whyZh: "please 后面直接跟动词原形，不用加 you——请人做事不需要点名主语。"
      },
      {
        wrong: "Don't closing the door.",
        wrongMark: "closing",
        correct: "Don't close the door.",
        whyZh: "「别做」是 Don't + 动词原形：Don't close。-ing 外套在祈使句里也不穿。"
      },
      {
        wrong: "Not be late!",
        wrongMark: "Not be",
        correct: "Don't be late!",
        whyZh: "「别……」用 Don't 开头：Don't be late。光 Not 不够劲，请 don't 来扛。"
      },
      {
        wrong: "Closes the door, please.",
        wrongMark: "Closes",
        correct: "Close the door, please.",
        whyZh: "祈使句的动词穿原样，不加三单 -s——没有主语，就没有三单这一说。"
      }
    ],
    variants: [
      { label: "肯定", en: "Close the door, please.", zh: "请把门关上。" },
      { label: "否定", en: "Don't open the window.", zh: "别开窗。", noteZh: "「别做」= Don't + 动词原形。" },
      { label: "疑问", en: "Close the door, will you?", zh: "把门关上，好吗？", noteZh: "句尾加 will you? 更客气，还是祈使句。" }
    ],
    sceneSwings: [
      { sceneZh: "上课时老师喊", en: "Open your book.", zh: "打开书。" },
      { sceneZh: "请客人坐", en: "Please sit down.", zh: "请坐。" },
      { sceneZh: "提醒自己别迟到", en: "Don't be late!", zh: "别迟到！" }
    ],
    deepDive: {
      title: "为什么祈使句不说 You？",
      paragraphs: [
        "请人做事时，「你」是明摆着的——英语干脆把 You 省掉，动词直接开头：Close the door（你，关门）。",
        "礼貌三档：Close the door（直白）→ Close the door, please（加 please）→ Could you close the door?（最客气，变成问句）。",
        "「别做」在前面垫 Don't：Don't open / Don't be late——Don't + 动词原形。",
        "标语、说明书的句子全是祈使句：Push（推）、Pull（拉）、Turn left（左转）——看到动词裸开头，就是让你做事。"
      ]
    },
    summary: {
      rule: "请人做事：动词原形开头（省 You）；别做 = Don't + 原形。",
      points: [
        "Close the door. —— 动词开头",
        "Please sit down. —— 加 please 更礼貌",
        "Don't be late. —— Don't + 原形"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：把门关上。",
        before: "",
        after: "the door, please.",
        options: ["Close", "You close", "Closing"],
        answer: "Close",
        explain: "祈使句动词直接开头，省掉 You。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：请坐下。",
        tokens: ["Please", "sit", "down."],
        answer: "Please sit down.",
        explain: "please 后面直接跟动词原形。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：别开窗。",
        tokens: ["Don't", "open", "the", "window."],
        answer: "Don't open the window.",
        explain: "「别做」= Don't + 动词原形。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["You", "open", "the", "book,", "please."],
        wrongToken: "You",
        answer: "You",
        correctionZh: "省掉 You，动词直接开头：Open the book, please。",
        explain: "请人做事不用点名主语。"
      },
      {
        // R8 跨课复现：上一课（L31 最高级）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：她是全班最高的。",
        tokens: ["She", "is", "the", "tallest", "in", "our", "class."],
        answer: "She is the tallest in our class.",
        explain: "复现第 31 课：最高级前站 the。"
      },
      {
        // R9 变形/替换：换语气（请求→禁止），开头跟着换（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「Open the window.」想改成「别开窗」，开头要怎么变？",
        replaceBase: "Open the window.",
        replaceTarget: "改成「别开窗」",
        options: ["Don't open", "Not open", "No open"],
        answer: "Don't open",
        explain: "「别做」= Don't + 动词原形：Don't open the window。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：把门关上。",
        tokens: ["Close", "the", "door."],
        distractors: ["You"],
        answer: "Close the door."
      },
      {
        promptZh: "上课了，老师说：打开书。",
        tokens: ["Open", "your", "book."],
        distractors: ["Opens"],
        answer: "Open your book."
      },
      {
        // R06 变体扩量：与 variants 否定卡一致的否定变体题
        promptZh: "风大，你想说：别开窗。",
        tokens: ["Don't", "open", "the", "window."],
        distractors: ["Not", "No"],
        answer: "Don't open the window."
      },
      {
        promptZh: "提醒自己，你想说：别迟到。",
        tokens: ["Don't", "be", "late!"],
        distractors: ["Not"],
        answer: "Don't be late!"
      }
    ],
    recall: {
      promptZh: "外婆在等你关门。凭记忆，写出那句英文。",
      intentZh: "把门关上。",
      answer: "Close the door.",
      noteZh: "祈使句动词直接开头，省掉 You。"
    },
    huntCaseIds: ["hunt-imperative-signs"]
  },
  {
    // ── 第三季巩固篇 · R9（L33 代词系统）：this/that/someone，my/her（L8）已建 ──
    id: "lesson-33-pronouns",
    number: 33,
    title: "这是谁的伞",
    grammarLabel: "指示代词 · this / that / these / those",
    episode: "小美的一天 ㉝",
    scene: "mystery",
    cover: cover20,
    sceneSetupZh: "放学下雨，小美在失物堆里发现两把伞。",
    dialogueEn: "Whose umbrellas are these?",
    dialogueZh: "她指着伞堆问你。",
    intentZh: "这把是我的。",
    targetSentence: "This one is mine.",
    blocks: [
      { text: "This", role: "这个（近的）" },
      { text: "one", role: "那个（东西）" },
      { text: "is mine", role: "是我的" }
    ],
    oneLineRule: "指近处用 this（这个）/ these（这些），指远处用 that（那个）/ those（那些）；「我的（东西）」是 mine。",
    examples: [
      { en: "This one is mine.", zh: "这个是我的。" },
      { en: "That one is yours.", zh: "那个是你的。" },
      { en: "These are my books.", zh: "这些是我的书。" },
      { en: "Those are hers.", zh: "那些是她的。" }
    ],
    dialogue: [
      { who: "npc", en: "Whose umbrellas are these?", zh: "她指着伞堆问你。" },
      { who: "npc", en: "Someone left them here.", zh: "她补了一句：有人把它们落这儿了。" },
      { who: "me", en: "This one is mine.", zh: "轮到你说了——这把是你的。" }
    ],
    contrast: [
      {
        wrong: "This ones are mine.",
        wrongMark: "ones",
        correct: "This one is mine.",
        whyZh: "this 是「这一个」，配单数 one 和 is；ones 是复数，要换 these——This one is。"
      },
      {
        wrong: "These one are mine.",
        wrongMark: "one",
        correct: "These are mine.",
        whyZh: "these 是「这些」，配复数；后面要么直接 These are mine，要么 These ones are——单数 one 搭不上。"
      },
      {
        wrong: "This umbrella is my.",
        wrongMark: "my",
        correct: "This umbrella is mine.",
        whyZh: "my 是贴在名词前的小标签（my umbrella）；句尾「是我的」要用 mine——它自己就能当主角。"
      },
      {
        wrong: "That one is me.",
        wrongMark: "me",
        correct: "That one is mine.",
        whyZh: "me 是「我」这个人；「我的（东西）」是 mine。东西归东西，人归人。"
      },
      {
        wrong: "This is mine umbrella.",
        wrongMark: "mine",
        correct: "This is my umbrella.",
        whyZh: "mine 后面不能再跟名词——贴在 umbrella 前面的小标签是 my：my umbrella。"
      },
      {
        wrong: "Those one is hers.",
        wrongMark: "Those one is",
        correct: "Those are hers.",
        whyZh: "those 是「那些」（复数），要配 are：Those are hers。单数才配 is。"
      }
    ],
    variants: [
      { label: "肯定", en: "This one is mine.", zh: "这个是我的。" },
      { label: "否定", en: "That one is not mine.", zh: "那个不是我的。", noteZh: "not 放回 be 后面，mine 不变。" },
      { label: "疑问", en: "Is this one yours?", zh: "这个是你的吗？", noteZh: "把 Is 搬到句首；「你的（东西）」是 yours。" }
    ],
    sceneSwings: [
      { sceneZh: "指近处的东西", en: "This is my book.", zh: "这是我的书。" },
      { sceneZh: "指远处的东西", en: "That is your umbrella.", zh: "那是你的伞。" },
      { sceneZh: "指一堆东西", en: "These are hers.", zh: "这些是她的。" }
    ],
    deepDive: {
      title: "this/that/these/those 和 my/mine 有什么不一样？",
      paragraphs: [
        "远近四兄弟：this（这个，近）→ that（那个，远）→ these（这些，近+复数）→ those（那些，远+复数）。一对近远、一对单复。",
        "my 和 mine 都是「我的」：my 是小标签，必须贴在名词前面（my umbrella）；mine 自己就能当主角，站句尾（is mine）。",
        "一家人都这样：your/yours、her/hers、our/ours——带 s 的那个独立用，不带的贴名词。",
        "these/those 配复数名词或 are（These are mine），this/that 配单数或 is（This is mine）——单复别配错。"
      ]
    },
    summary: {
      rule: "近 this/这些 these，远 that/那些 those；贴名词 my，句尾 mine。",
      points: [
        "This one is mine. —— 近处单个",
        "Those are hers. —— 远处多个",
        "my umbrella / is mine —— 贴名词用 my，独立用 mine"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：这个是我的。（指手里这把伞）",
        before: "",
        after: "one is mine.",
        options: ["This", "These", "Those"],
        answer: "This",
        explain: "近处单个用 This。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：那些是她的。",
        tokens: ["Those", "are", "hers."],
        answer: "Those are hers.",
        explain: "远处多个用 Those，配 are。"
      },
      {
        kind: "arrange",
        promptZh: "你想问：这个是你的吗？",
        tokens: ["Is", "this", "one", "yours?"],
        answer: "Is this one yours?",
        explain: "Is 搬到句首，「你的（东西）」是 yours。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["These", "is", "my", "books."],
        wrongToken: "is",
        answer: "is",
        correctionZh: "books 是复数，要配 are：These are my books。",
        explain: "these 配复数，动词用 are。"
      },
      {
        // R8 跨课复现：上一课（L32 祈使句）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：别迟到。",
        tokens: ["Don't", "be", "late!"],
        answer: "Don't be late!",
        explain: "复现第 32 课：Don't + 动词原形。"
      },
      {
        // R9 变形/替换：换数量（单个→多个），指示词跟着换（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「This one is mine.」把「这一把」换成「这些（书）」，This 要怎么变？",
        replaceBase: "This one is mine.",
        replaceTarget: "把 This one 换成「这些书」",
        options: ["These", "Those ones is", "This"],
        answer: "These",
        explain: "多个用 These，配 are：These are my books。this/that 只管单个。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：这把伞是我的。",
        tokens: ["This", "umbrella", "is", "mine."],
        distractors: ["me"],
        answer: "This umbrella is mine."
      },
      {
        promptZh: "你想说：那个是你的。",
        tokens: ["That", "one", "is", "yours."],
        distractors: ["you"],
        answer: "That one is yours."
      },
      {
        // R06 变体扩量：与 variants 否定卡一致的否定变体题
        promptZh: "你想说：那个不是我的。",
        tokens: ["That", "one", "is", "not", "mine."],
        distractors: ["my"],
        answer: "That one is not mine."
      },
      {
        promptZh: "指远处那堆书，你想说：那些是她的。",
        tokens: ["Those", "are", "her", "books."],
        distractors: ["is"],
        answer: "Those are her books."
      }
    ],
    recall: {
      promptZh: "同学问失物堆里哪把伞是你的。凭记忆，写出那句英文。",
      intentZh: "这个是我的。",
      answer: "This one is mine.",
      noteZh: "近处单个用 This；句尾「我的」用 mine。"
    },
    huntCaseIds: ["hunt-pronoun-umbrella"]
  },
  {
    // ── 第三季巩固篇 · R10（L34 过去进行时）：依赖 L13 现在进行 + L10 一般过去，故排最后 ──
    id: "lesson-34-past-continuous",
    number: 34,
    title: "那时我正在画画",
    grammarLabel: "过去进行时 · was/were + V-ing",
    episode: "小美的一天 ㉞",
    scene: "campus",
    cover: cover13,
    sceneSetupZh: "放学后，朋友问你昨天下午三点在干嘛。",
    dialogueEn: "What were you doing at three yesterday?",
    dialogueZh: "朋友问。",
    intentZh: "我正在画画。",
    targetSentence: "I was drawing at three.",
    blocks: [
      { text: "I was", role: "我（过去式 be）" },
      { text: "drawing", role: "画画（-ing）" },
      { text: "at three", role: "在三点" }
    ],
    oneLineRule: "说「过去某时正在做」：was/were + 动词ing——I was drawing。be 用过去版（was/were），动词照样穿 -ing 外套。",
    examples: [
      { en: "I was drawing at three.", zh: "三点时我正在画画。" },
      { en: "She was reading last night.", zh: "昨晚她正在看书。" },
      { en: "They were playing football.", zh: "（那时）他们正在踢足球。" },
      { en: "What were you doing?", zh: "你（那时）在干嘛？" }
    ],
    dialogue: [
      { who: "npc", en: "What were you doing at three yesterday?", zh: "朋友问。" },
      { who: "npc", en: "I called you but no answer.", zh: "她补了一句：我打了电话没人接。" },
      { who: "me", en: "I was drawing at three.", zh: "轮到你说了——你当时正在画画。" }
    ],
    contrast: [
      {
        wrong: "I was draw at three.",
        wrongMark: "draw",
        correct: "I was drawing at three.",
        whyZh: "进行时的动词必须穿 -ing 外套：was drawing。be 后面直接跟原形就塌了。"
      },
      {
        wrong: "I am drawing at three yesterday.",
        wrongMark: "am",
        correct: "I was drawing at three yesterday.",
        whyZh: "昨天的事要用过去版的 be：was。am 是「现在」的搭档，装不下昨天。"
      },
      {
        wrong: "They was playing football.",
        wrongMark: "was",
        correct: "They were playing football.",
        whyZh: "They 是一伙的，过去版 be 用 were——和 are 换 were 一个道理。"
      },
      {
        wrong: "She were reading last night.",
        wrongMark: "were",
        correct: "She was reading last night.",
        whyZh: "She 是单数，过去版 be 用 was——were 只配 you/we/they。"
      },
      {
        wrong: "What was you doing?",
        wrongMark: "was",
        correct: "What were you doing?",
        whyZh: "you 的过去版 be 是 were——was 只配 I/he/she/it。疑问句里 be 也要搬句首。"
      },
      {
        wrong: "I drawing at three.",
        wrongMark: null,
        correct: "I was drawing at three.",
        whyZh: "-ing 想说「正在做」，前面必须有 be 搭着：was drawing。丢了 was，句子就塌了。"
      }
    ],
    variants: [
      { label: "肯定", en: "I was drawing at three.", zh: "三点时我正在画画。" },
      { label: "否定", en: "I wasn't sleeping at three.", zh: "三点时我没在睡觉。", noteZh: "was 加 not：wasn't（were 加 not 是 weren't）。" },
      { label: "疑问", en: "Were you drawing at three?", zh: "三点时你正在画画吗？", noteZh: "把 Were 搬到句首，-ing 外套不动。" }
    ],
    sceneSwings: [
      { sceneZh: "说昨晚正在看书", en: "She was reading last night.", zh: "昨晚她正在看书。" },
      { sceneZh: "说他们当时正在踢球", en: "They were playing football.", zh: "（那时）他们正在踢足球。" },
      { sceneZh: "问对方当时在干嘛", en: "What were you doing?", zh: "你（那时）在干嘛？" }
    ],
    deepDive: {
      title: "过去进行时 = 过去版的「正在」",
      paragraphs: [
        "现在进行时：am/is/are + V-ing（I am drawing——现在正在画）。",
        "过去进行时：把 be 换成过去版 was/were，-ing 外套不动（I was drawing——那时正在画）。",
        "be 的过去版搭档：I/he/she/it 用 was，you/we/they 用 were——和 am/is/are 的分工一一对应。",
        "最常用的场景：过去某时正在做什么（at three yesterday）+ 讲故事背景（It was raining——当时正下着雨）。"
      ]
    },
    summary: {
      rule: "过去某时正在做 = was/were + V-ing，be 用过去版。",
      points: [
        "I was drawing. —— was + -ing",
        "They were playing. —— 一伙人用 were",
        "Were you drawing? —— 问句 Were 搬句首"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：三点时我正在画画。",
        before: "I",
        after: "drawing at three.",
        options: ["was", "am", "were"],
        answer: "was",
        explain: "I 的过去版 be 是 was：was drawing。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：昨晚她正在看书。",
        tokens: ["She", "was", "reading", "last", "night."],
        answer: "She was reading last night.",
        explain: "She 用 was，动词穿 -ing 外套。"
      },
      {
        kind: "arrange",
        promptZh: "你想问：三点时你正在做什么？",
        tokens: ["What", "were", "you", "doing", "at", "three?"],
        answer: "What were you doing at three?",
        explain: "you 的过去版 be 是 were，搬到句首。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["They", "was", "playing", "football."],
        wrongToken: "was",
        answer: "was",
        correctionZh: "They 是一伙的，用 were：They were playing football。",
        explain: "过去版 be：单数 was，一伙 were。"
      },
      {
        // R8 跨课复现：上一课（L33 指示代词）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：那些是她的。",
        tokens: ["Those", "are", "hers."],
        answer: "Those are hers.",
        explain: "复现第 33 课：远处多个用 Those。"
      },
      {
        // R9 变形/替换：换时间（现在→过去），be 跟着换（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I am drawing.」加上「昨天三点（at three yesterday）」这个过去时间，am 要怎么变？",
        replaceBase: "I am drawing.",
        replaceTarget: "加上过去的時間 at three yesterday",
        options: ["was", "am", "were"],
        answer: "was",
        explain: "过去的事用过去版 be：I was drawing at three yesterday。-ing 外套不动。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：三点时我正在画画。",
        tokens: ["I", "was", "drawing", "at", "three."],
        distractors: ["am"],
        answer: "I was drawing at three."
      },
      {
        promptZh: "你想说：他们当时正在踢足球。",
        tokens: ["They", "were", "playing", "football."],
        distractors: ["was"],
        answer: "They were playing football."
      },
      {
        // R06 变体扩量：与 variants 否定卡一致的否定变体题
        promptZh: "你想说：三点时我没在睡觉。",
        tokens: ["I", "wasn't", "sleeping", "at", "three."],
        distractors: ["am not"],
        answer: "I wasn't sleeping at three."
      },
      {
        promptZh: "讲故事，你想说：当时正下着雨。",
        tokens: ["It", "was", "raining."],
        distractors: ["is"],
        answer: "It was raining."
      }
    ],
    recall: {
      promptZh: "朋友问你昨天下午三点在干嘛。凭记忆，写出那句英文。",
      intentZh: "我正在画画。",
      answer: "I was drawing at three.",
      noteZh: "过去正在做 = was/were + 动词ing。"
    },
    huntCaseIds: ["hunt-past-rainy-day"]
  },
  {
    // ── 第四批 · L35 宾语从句①（wh- 语序）：疑问句住进句子里要换鞋，续写 L27「I don't know where it is」种子 ──
    id: "lesson-35-know-where",
    number: 35,
    title: "我知道它在哪",
    grammarLabel: "话中话 · 疑问句回家换鞋",
    episode: "小美的一天 ㉟",
    scene: "city",
    cover: cover9,
    sceneSetupZh: "早上出门前，妈妈在门口找不到钥匙，问你知不知道它在哪儿。",
    dialogueEn: "Do you know where my key is?",
    dialogueZh: "妈妈在门口问你。",
    intentZh: "我知道它在哪。",
    targetSentence: "I know where it is.",
    blocks: [
      { text: "I know", role: "我知道" },
      { text: "where", role: "在哪（问地方）" },
      { text: "it is", role: "它在（换好鞋的顺序）" }
    ],
    oneLineRule: "疑问句住进句子里，要换鞋：Where is it? 变成 I know where it is——is 要退回 it 后面，不站主语前面。",
    examples: [
      { en: "I know where it is.", zh: "我知道它在哪。" },
      { en: "I know where he is.", zh: "我知道他在哪。" },
      { en: "I don't know where my key is.", zh: "我不知道我的钥匙在哪。" },
      { en: "Do you know where the school is?", zh: "你知道学校在哪吗？" }
    ],
    dialogue: [
      { who: "npc", en: "Do you know where my key is?", zh: "妈妈在门口问你。" },
      { who: "npc", en: "It is not on the desk.", zh: "她补了一句：它不在书桌上。" },
      { who: "me", en: "I know where it is.", zh: "轮到你说了——你知道它在哪。" }
    ],
    contrast: [
      {
        wrong: "I know where is it.",
        wrongMark: "is",
        correct: "I know where it is.",
        whyZh: "话中话要换鞋：is 退回 it 后面——I know where it is。问句的站法搬进句子里就塌了。"
      },
      {
        wrong: "I know where is he.",
        wrongMark: "is",
        correct: "I know where he is.",
        whyZh: "主语换成 he 也一样：where he is。疑问句住进句子里，谁都得换鞋。"
      },
      {
        wrong: "I know where it.",
        wrongMark: null,
        correct: "I know where it is.",
        whyZh: "少了 is，句子就塌了——「它在哪」里的 is 不能省，换鞋不是脱鞋。"
      },
      {
        wrong: "I don't know where is my key.",
        wrongMark: "is",
        correct: "I don't know where my key is.",
        whyZh: "主语长一点也一样换鞋：where my key is——is 站到整条主语的后面。"
      },
      {
        wrong: "Do you know where is it?",
        wrongMark: "is",
        correct: "Do you know where it is?",
        whyZh: "问别人「你知不知道」：外面的 Do 站句首，里面的 it is 照样换好鞋。"
      },
      {
        wrong: "I not know where it is.",
        wrongMark: "not",
        correct: "I don't know where it is.",
        whyZh: "「不知道」要请帮手：I don't know——not 不能自己站，配上 do 才有力气（第 10 课学过的搭档）。"
      }
    ],
    variants: [
      { label: "肯定", en: "I know where it is.", zh: "我知道它在哪。" },
      { label: "否定", en: "I don't know where it is.", zh: "我不知道它在哪。", noteZh: "「不知道」用 don't know；里面的话照样换鞋：where it is。" },
      { label: "疑问", en: "Do you know where it is?", zh: "你知道它在哪吗？", noteZh: "问别人：Do 站句首，里面的 where it is 不变。" }
    ],
    sceneSwings: [
      { sceneZh: "说你知道他在哪", en: "I know where he is.", zh: "我知道他在哪。" },
      { sceneZh: "说不知道包在哪", en: "I don't know where my bag is.", zh: "我不知道我的包在哪。" },
      { sceneZh: "问同学知不知道图书馆在哪", en: "Do you know where the library is?", zh: "你知道图书馆在哪吗？" }
    ],
    deepDive: {
      title: "疑问句住进句子，为什么要换鞋？",
      paragraphs: [
        "英语问问题要把 be 搬到前面：Where is it?（它在哪？）。但只要这句话被「我知道」「你不知道」包住，它就不是在问了，是话里的内容——be 要退回原位：I know where it is。",
        "判断方法：句首是 I know / I don't know / Do you know 的时候，后面就按「换好鞋」的顺序说：where + 主语 + is。",
        "中文不用换：『它在哪』和『我知道它在哪』里，『它在哪』长得一模一样。英语的疑问句和话中话是两套站法——这是按中文直译最容易踩的一个坑。",
        "这课只管 where 一家的换鞋。以后你会见到 when / what / how 也来这一套：I know what it is、I know when it starts。"
      ]
    },
    summary: {
      rule: "疑问句住进句子里要换鞋：Where is it? → I know where it is。",
      points: [
        "I know where it is. —— 我知道它在哪：where + 主语 + is",
        "I don't know where it is. —— 不知道：don't know + 换好鞋的话",
        "Do you know where it is? —— 问别人：Do 站句首，里面不变"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我知道它在哪。",
        before: "I know",
        after: "it is.",
        options: ["where", "when", "what"],
        answer: "where",
        explain: "问地方用 where：「在哪」。话中话里，疑问词还是站这句的开头。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我知道它在哪。",
        tokens: ["I", "know", "where", "it", "is."],
        answer: "I know where it is.",
        explain: "换好鞋的顺序：where it is——is 退回主语后面。"
      },
      {
        kind: "arrange",
        promptZh: "妈妈问你钥匙在哪，你想说：我不知道它在哪。",
        tokens: ["I", "don't", "know", "where", "it", "is."],
        answer: "I don't know where it is.",
        explain: "don't know 后面照样换鞋：where it is。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "know", "where", "is", "it."],
        wrongToken: "is",
        answer: "is",
        correctionZh: "is 要退回 it 后面：I know where it is。",
        explain: "话中话里 is 不站主语前面。"
      },
      {
        // R8 跨课复现：上一课（L34 过去进行）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：三点时我正在画画。",
        tokens: ["I", "was", "drawing", "at", "three."],
        answer: "I was drawing at three.",
        explain: "复现第 34 课：过去正在做 = was + 动词ing。"
      },
      {
        // R9 变形/替换：把 L27 的问句装进 I know 后面（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子搬家：「Where is my key?」住进 I know 后面，里面的词要怎么站？",
        replaceBase: "Where is my key?",
        replaceTarget: "住进 I know 后面",
        options: ["where my key is", "where is my key", "where my key"],
        answer: "where my key is",
        explain: "换好鞋的顺序：where my key is。整句是 I know where my key is。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我知道它在哪。",
        tokens: ["I", "know", "where", "it", "is."],
        distractors: ["is it"],
        answer: "I know where it is."
      },
      {
        // R06 变体扩量：与 variants 否定卡逐字一致的否定变体题
        promptZh: "妈妈问你钥匙在哪，你想说：我不知道它在哪。",
        tokens: ["I", "don't", "know", "where", "it", "is."],
        distractors: ["where is it"],
        answer: "I don't know where it is."
      },
      {
        promptZh: "你想问：你知道它在哪吗？",
        tokens: ["Do", "you", "know", "where", "it", "is?"],
        distractors: ["When"],
        answer: "Do you know where it is?"
      },
      {
        // R8 跨课复现（L33 指示代词）：旧句式混入产出段
        promptZh: "先复习一小步——第 33 课学过：这把是我的。",
        tokens: ["This", "one", "is", "mine."],
        distractors: ["me"],
        answer: "This one is mine."
      }
    ],
    recall: {
      promptZh: "出门前，妈妈问你知道钥匙在哪吗。凭记忆，写出你那句回答。",
      intentZh: "我知道它在哪。",
      answer: "I know where it is.",
      noteZh: "话中话要换鞋：where it is——is 退回主语后面。"
    },
    huntCaseIds: ["hunt-key-clue"]
  },
  {
    // ── 第四批 · L36 宾语从句②（that 可选件）：说想法用 I think + 一句话；that 挂不挂都行，漏 that 不设错 ──
    id: "lesson-36-think-that",
    number: 36,
    title: "我觉得她累了",
    grammarLabel: "话中话 · 小挂件 that",
    episode: "小美的一天 ㊱",
    scene: "campus",
    cover: cover16,
    sceneSetupZh: "课间休息，同桌趴在桌上没精神，同学凑过来问你。",
    dialogueEn: "Is she tired?",
    dialogueZh: "同学转头问你。",
    intentZh: "我觉得她累了。",
    targetSentence: "I think she is tired.",
    blocks: [
      { text: "I think", role: "我觉得（说想法的引子）" },
      { text: "(that)", role: "小挂件·可有可无" },
      { text: "she is", role: "她（是）" },
      { text: "tired", role: "累的" }
    ],
    oneLineRule: "说想法 = I think + 一句话；that 是可拆的小挂件：挂上 I think that she is tired.、不挂 I think she is tired.，都对——漏 that 不算错。",
    examples: [
      { en: "I think she is tired.", zh: "我觉得她累了。" },
      { en: "I think he is at home.", zh: "我觉得他在家。" },
      { en: "I think the book is good.", zh: "我觉得这本书不错。" },
      { en: "I think that she is happy.", zh: "我觉得她很开心。" }
    ],
    dialogue: [
      { who: "npc", en: "Lily is so quiet today.", zh: "同学小声说：莉莉今天好安静。" },
      { who: "npc", en: "Is she tired?", zh: "她又问你：她是不是累了？" },
      { who: "me", en: "I think she is tired.", zh: "轮到你说了——你觉得她累了。" }
    ],
    contrast: [
      {
        wrong: "I think she tired.",
        wrongMark: null,
        correct: "I think she is tired.",
        whyZh: "话装进 I think 后面，该有的 is 不能省——I think she is tired。中文「我觉得她累」不用动词，英语少了 is 句子就塌了。"
      },
      {
        wrong: "I think that she is tired.",
        wrongMark: null,
        correct: "I think she is tired.",
        bothRight: true,
        whyZh: "两句都对——that 是可拆的拉链小挂件：挂上和拿掉，意思一模一样。这课的特权：that 可有可无，不用纠结。"
      },
      {
        wrong: "I think is she tired.",
        wrongMark: "is",
        correct: "I think she is tired.",
        whyZh: "话里不换鞋的老规矩：I think 后面是 she is，不是 is she——上一课学的换鞋，到这课照样管用。"
      },
      {
        wrong: "I thinks she is tired.",
        wrongMark: "thinks",
        correct: "I think she is tired.",
        whyZh: "I 是「我」，think 不用加 s——加 -s 是 he / she / it 的待遇（第 25 课学过的三单）。"
      },
      {
        wrong: "I think she is a tired.",
        wrongMark: "a",
        correct: "I think she is tired.",
        whyZh: "tired 是形容词，直接跟在 is 后面：she is tired。形容词前面不加 a——a 是给可数名词戴的帽子。"
      },
      {
        wrong: "Do you think is he tired?",
        wrongMark: "is",
        correct: "Do you think he is tired?",
        whyZh: "问别人的想法：外面 Do 站句首，里面的 he is 不换位——里面还是话，话就按话的规矩站。"
      }
    ],
    variants: [
      { label: "肯定", en: "I think she is tired.", zh: "我觉得她累了。" },
      { label: "否定", en: "I don't think she is tired.", zh: "我觉得她不累。", noteZh: "「不」要放在 think 前面说：I don't think……英语的习惯说法，先照说。" },
      { label: "疑问", en: "Do you think she is tired?", zh: "你觉得她累吗？", noteZh: "问别人的想法：Do 站句首，后面的话不动。" }
    ],
    sceneSwings: [
      { sceneZh: "说觉得他在家", en: "I think he is at home.", zh: "我觉得他在家。" },
      { sceneZh: "说觉得这本书不错", en: "I think the book is good.", zh: "我觉得这本书不错。" },
      { sceneZh: "说觉得今天很冷", en: "I think it is cold today.", zh: "我觉得今天很冷。" }
    ],
    deepDive: {
      title: "小挂件 that，和「那个」that 长得像？",
      paragraphs: [
        "说想法有个固定引子：I think + 一句话。这句话自己必须是完整的——she is tired（她累了），不能缺 is。",
        "中间可以插一个小挂件 that：I think that she is tired. 挂上和拿掉，意思完全一样。它可有可无——所以说话也好、做题也好，漏掉 that 从来不算错。",
        "你以前学过的 that 是「那个」：that book（那本书）、I like that.（我喜欢那个）。同一个词，两个岗位——看它后面跟的是什么：后面跟名词，它是「那个」；后面跟一整句话，它是小挂件。",
        "不用背规则，记住手感：I think + 一句话。中间想加 that 就加，不加也行。"
      ]
    },
    summary: {
      rule: "说想法 = I think + 一句话；that 是可拆的小挂件，挂不挂都对。",
      points: [
        "I think she is tired. —— 我 + 觉得 + 一句话",
        "I think that she is tired. —— 挂了 that，两句都对",
        "I don't think she is tired. —— 「不」放 think 前面"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我觉得她累了。",
        before: "I",
        after: "she is tired.",
        options: ["think", "thinks", "thinking"],
        answer: "think",
        explain: "说想法用 I think；I 不用加 s，也不用 -ing。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我觉得她累了。",
        tokens: ["I", "think", "she", "is", "tired."],
        answer: "I think she is tired.",
        explain: "I think + 一句话：引子后面跟着完整的 she is tired。"
      },
      {
        kind: "arrange",
        promptZh: "你还想练一句挂上小挂件的：我觉得她累了（带 that）。",
        tokens: ["I", "think", "that", "she", "is", "tired."],
        answer: "I think that she is tired.",
        explain: "挂上 that 也对：I think that she is tired。小挂件挂不挂都行。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "think", "she", "tired."],
        wrongToken: "tired.",
        answer: "tired.",
        correctionZh: "少了 is：I think she is tired。",
        explain: "话装进 I think 后面，该有的 is 不能省。"
      },
      {
        // R8 跨课复现：上一课（L34 过去进行）的句子混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——第 34 课学过：昨晚她正在看书。",
        tokens: ["She", "was", "reading", "last", "night."],
        answer: "She was reading last night.",
        explain: "复现第 34 课：was + 动词ing = 过去正在做。"
      },
      {
        // R9 变形/替换：否定转移种子的构造迁移（复用 choose 判题）
        kind: "replace",
        promptZh: "句子变装：「I think she is tired.」想说「我『不』觉得她累了」，「不」要放在哪里？",
        replaceBase: "I think she is tired.",
        replaceTarget: "想说「不」觉得她累了",
        options: ["don't think", "think not", "not think"],
        answer: "don't think",
        explain: "「不」放在 think 前面：I don't think she is tired。英语习惯把否定放前面。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我觉得她累了。",
        tokens: ["I", "think", "she", "is", "tired."],
        distractors: ["thinks"],
        answer: "I think she is tired."
      },
      {
        // R06 变体扩量：与 variants 否定卡逐字一致的否定变体题
        promptZh: "你想说：我觉得她不累。",
        tokens: ["I", "don't", "think", "she", "is", "tired."],
        distractors: ["not"],
        answer: "I don't think she is tired."
      },
      {
        // R8 跨课复现（L25 三单）：旧知识点放进从句内部
        promptZh: "你想说：我觉得他每天喝牛奶。",
        tokens: ["I", "think", "he", "drinks", "milk", "every", "day."],
        distractors: ["drink"],
        answer: "I think he drinks milk every day."
      },
      {
        promptZh: "你想说：我觉得她累了（带上小挂件 that）。",
        tokens: ["I", "think", "that", "she", "is", "tired."],
        distractors: ["what"],
        answer: "I think that she is tired."
      }
    ],
    recall: {
      promptZh: "课间同桌趴在桌上，你想跟同学说你的想法。凭记忆，写出那句英文。",
      intentZh: "我觉得她累了。",
      answer: "I think she is tired.",
      noteZh: "说想法 = I think + 一句话；that 可挂可不挂。"
    },
    huntCaseIds: ["hunt-homework-guess"]
  },
  {
    // ── 第四批 · L37 宾语从句③（引子可以换人）：know/think/forget 后面装同一句话；按开放问题②降级，不引入 hear ──
    id: "lesson-37-where-he-is",
    number: 37,
    title: "我不知道他在哪",
    grammarLabel: "话中话 · 引子可以换人",
    episode: "小美的一天 ㊲",
    scene: "city",
    cover: cover6,
    sceneSetupZh: "小区门口，邻居阿姨拦住小美，打听一个同学在哪里。",
    dialogueEn: "Do you know where Xiaoming is?",
    dialogueZh: "小区门口，邻居阿姨问你。",
    intentZh: "我不知道他在哪。",
    targetSentence: "I don't know where he is.",
    blocks: [
      { text: "I don't know", role: "我不知道（引子）" },
      { text: "where", role: "在哪" },
      { text: "he is", role: "他在（换好鞋的顺序）" }
    ],
    oneLineRule: "引子可以换人：I know / I think / I forget 后面都能装同一句话；里面永远是 where + 主语 + is——换鞋的规矩不变。",
    examples: [
      { en: "I don't know where he is.", zh: "我不知道他在哪。" },
      { en: "I think he is at school.", zh: "我觉得他在学校。" },
      { en: "Do you know where he is?", zh: "你知道他在哪吗？" },
      { en: "I forget where he is.", zh: "我忘了他在哪。" }
    ],
    dialogue: [
      { who: "npc", en: "Do you know where Xiaoming is?", zh: "小区门口，邻居阿姨问你。" },
      { who: "npc", en: "His mother is looking for him.", zh: "她补了一句：他妈妈在找他。" },
      { who: "me", en: "I don't know where he is.", zh: "轮到你说了——你不知道他在哪。" }
    ],
    contrast: [
      {
        wrong: "I don't know where is he.",
        wrongMark: "is",
        correct: "I don't know where he is.",
        whyZh: "换鞋的规矩到哪都一样：where he is——is 退回 he 后面。上一课学的手感，这课接着用。"
      },
      {
        wrong: "I think is he at school.",
        wrongMark: "is",
        correct: "I think he is at school.",
        whyZh: "引子从 know 换成 think，里面照样是 he is——引子换人，话的规矩不换。"
      },
      {
        wrong: "I don't know he is.",
        wrongMark: null,
        correct: "I don't know where he is.",
        whyZh: "「我不知道他在哪」，where 是话的头，不能丢：I don't know where he is。丢了头，话就没了方向。"
      },
      {
        wrong: "Do you know where is he?",
        wrongMark: "is",
        correct: "Do you know where he is?",
        whyZh: "问别人时：外面 Do 站句首，里面的话照样换好鞋——两套规矩同时在场，各站各的。"
      },
      {
        wrong: "We don't know where is Coco.",
        wrongMark: "is",
        correct: "We don't know where Coco is.",
        whyZh: "主语换成名字也一样：where Coco is。换鞋说的是顺序，不是词的长短。"
      },
      {
        wrong: "I think he at school.",
        wrongMark: null,
        correct: "I think he is at school.",
        whyZh: "话装进引子后面，该有的 is 不能省——I think he is at school。"
      }
    ],
    variants: [
      { label: "肯定", en: "I know where he is.", zh: "我知道他在哪。" },
      { label: "否定", en: "I don't know where he is.", zh: "我不知道他在哪。", noteZh: "「不知道」用 don't know；里面的话照样换鞋：where he is。" },
      { label: "疑问", en: "Do you know where he is?", zh: "你知道他在哪吗？", noteZh: "问别人：Do 站句首，里面的 where he is 不动。" }
    ],
    sceneSwings: [
      { sceneZh: "说不知道他在哪", en: "I don't know where he is.", zh: "我不知道他在哪。" },
      { sceneZh: "说觉得他在学校", en: "I think he is at school.", zh: "我觉得他在学校。" },
      { sceneZh: "问对方知不知道", en: "Do you know where he is?", zh: "你知道他在哪吗？" }
    ],
    deepDive: {
      title: "引子可以换人——know / think / forget",
      paragraphs: [
        "说「话中话」的引子不止一个：I know（我知道）、I don't know（我不知道）、I think（我觉得）、I forget（我忘了）——后面都能装同一句话。",
        "forget 你见过它：第 16 课组长的「Don't forget your homework!」（别忘了作业）。它站到引子位，一样能装话：I forget where he is（我忘了他在哪）。",
        "规矩只有一条，从头到尾没变过：不管引子是谁，里面永远是 where + 主语 + is（where he is）。引子换人，话不换鞋。",
        "以后遇到别的引子（比如别人跟你说话里带的），先找这条：话里的话，按换好鞋的顺序站。"
      ]
    },
    summary: {
      rule: "引子（I know / I don't know / I think / I forget）+ 换好鞋的一句话：where + 主语 + is。",
      points: [
        "I don't know where he is. —— 不知道：don't know + where he is",
        "I think he is at school. —— 引子换人，话不变",
        "Do you know where he is? —— 问别人：Do 站句首，里面不动"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我不知道他在哪。",
        before: "I",
        after: "know where he is.",
        options: ["don't", "doesn't", "isn't"],
        answer: "don't",
        explain: "「不知道」用 don't know——not 要请帮手 do 一起站。"
      },
      {
        kind: "arrange",
        promptZh: "帮小美说一句：我们不知道 Coco 在哪。",
        tokens: ["We", "don't", "know", "where", "Coco", "is."],
        answer: "We don't know where Coco is.",
        explain: "主语换成一伙的 We、后面换成名字，顺序还是 where + 主语 + is。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我觉得他在学校。",
        tokens: ["I", "think", "he", "is", "at", "school."],
        answer: "I think he is at school.",
        explain: "引子从 know 换成 think，话照样按换好鞋的顺序站。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "don't", "know", "where", "is", "he."],
        wrongToken: "is",
        answer: "is",
        correctionZh: "is 要退回 he 后面：I don't know where he is。",
        explain: "话中话里 is 不站主语前面。"
      },
      {
        // R8 跨课复现：第 30 课（some/any）的句子混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——第 30 课学过：桌上有一些苹果。",
        tokens: ["There", "are", "some", "apples", "on", "the", "table."],
        answer: "There are some apples on the table.",
        explain: "复现第 30 课：复数用 There are，apples 加 s。"
      },
      {
        // R9 变形/替换：上一个问句搬进引子后面（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子搬家：「Where is he?」住进 I don't know 后面，里面的词要怎么站？",
        replaceBase: "Where is he?",
        replaceTarget: "住进 I don't know 后面",
        options: ["where he is", "where is he", "where he"],
        answer: "where he is",
        explain: "换好鞋的顺序：where he is。整句是 I don't know where he is。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我知道他在哪。",
        tokens: ["I", "know", "where", "he", "is."],
        distractors: ["is he"],
        answer: "I know where he is."
      },
      {
        // R06 变体扩量：与 variants 否定卡逐字一致的否定变体题
        promptZh: "阿姨问你知不知道他在哪，你想说：我不知道他在哪。",
        tokens: ["I", "don't", "know", "where", "he", "is."],
        distractors: ["where is he"],
        answer: "I don't know where he is."
      },
      {
        // R8 跨课复现（L26 there be）：原句复现，抗遗忘
        promptZh: "先复习一小步——第 26 课学过：桌上有一本书。",
        tokens: ["There", "is", "a", "book", "on", "the", "desk."],
        distractors: ["are"],
        answer: "There is a book on the desk."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：你知道他在哪吗？",
        tokens: ["Do", "you", "know", "where", "he", "is?"],
        distractors: ["When"],
        answer: "Do you know where he is?"
      }
    ],
    recall: {
      promptZh: "小区门口，阿姨打听小明住哪儿。凭记忆，写出你那句回答。",
      intentZh: "我不知道他在哪。",
      answer: "I don't know where he is.",
      noteZh: "引子（don't know）+ 换好鞋的话：where he is。"
    },
    huntCaseIds: ["hunt-lost-dog"]
  },
  {
    // ── 第四批 · L38 宾语从句④（转述 + 否定转移）：She says + 原话照装；「不」搬到主句说 ──
    id: "lesson-38-she-says",
    number: 38,
    title: "她说她会来",
    grammarLabel: "话中话 · 转述别人的话",
    episode: "小美的一天 ㊳",
    scene: "campus",
    cover: cover2,
    sceneSetupZh: "接力赛前，教练在跑道边问小美：Lily 会不会来？小美把 Lily 的原话转告给教练。",
    dialogueEn: "Will Lily come to the race?",
    dialogueZh: "教练在跑道边问你。",
    intentZh: "她说她会来。",
    targetSentence: "She says she will come.",
    blocks: [
      { text: "She says", role: "她说（转述的引子）" },
      { text: "she will come", role: "她会来（原话照装）" }
    ],
    oneLineRule: "转述别人的话：She says + 原话照装（she will come）；想说「我觉得她不会来」，「不」要搬到前面说：I don't think she will come。",
    examples: [
      { en: "She says she will come.", zh: "她说她会来。" },
      { en: "She says she is busy.", zh: "她说她很忙。" },
      { en: "I don't think she will come.", zh: "我觉得她不会来。" },
      { en: "Do you think she will come?", zh: "你觉得她会来吗？" }
    ],
    dialogue: [
      { who: "npc", en: "Will Lily come to the race?", zh: "教练在跑道边问你。" },
      { who: "npc", en: "The race is on Friday.", zh: "他补了一句：比赛在周五。" },
      { who: "me", en: "She says she will come.", zh: "轮到你说了——她说她会来。" }
    ],
    contrast: [
      {
        wrong: "She says she will comes.",
        wrongMark: "comes",
        correct: "She says she will come.",
        whyZh: "will 后面的动词穿原样：will come。第 12 课学的老规矩，转述里照样管用。"
      },
      {
        wrong: "I think she will not come.",
        wrongMark: "not",
        correct: "I don't think she will come.",
        whyZh: "「不」要搬到前面说：I don't think she will come——英语的习惯是让主句替她说「不」，别放在后面的话里。"
      },
      {
        wrong: "She says she come.",
        wrongMark: "come",
        correct: "She says she will come.",
        whyZh: "说将来的事要带上 will：she will come——光一个 come 站不住，也没说清是将来。"
      },
      {
        wrong: "She say she will come.",
        wrongMark: "say",
        correct: "She says she will come.",
        whyZh: "主语 She 是三单，say 要加 -s：She says。"
      },
      {
        wrong: "Do you think she will comes?",
        wrongMark: "comes",
        correct: "Do you think she will come?",
        whyZh: "问别人的想法：外面 Do 站句首，里面的 will come 还是原样，哪儿都不变。"
      },
      {
        wrong: "She says she will coming.",
        wrongMark: "coming",
        correct: "She says she will come.",
        whyZh: "will 后面永远穿原样——comes、came、coming 都不对，就是 come。"
      }
    ],
    variants: [
      { label: "肯定", en: "She says she will come.", zh: "她说她会来。" },
      { label: "否定", en: "I don't think she will come.", zh: "我觉得她不会来。", noteZh: "「不」放在主句说：I don't think……英语的习惯说法，别放进后面的话里。" },
      { label: "疑问", en: "Do you think she will come?", zh: "你觉得她会来吗？", noteZh: "问别人的想法：Do 站句首，里面的话不动。" }
    ],
    sceneSwings: [
      { sceneZh: "转述她的原话", en: "She says she will come.", zh: "她说她会来。" },
      { sceneZh: "说觉得她不会来", en: "I don't think she will come.", zh: "我觉得她不会来。" },
      { sceneZh: "问别人觉得", en: "Do you think she will come?", zh: "你觉得她会来吗？" }
    ],
    deepDive: {
      title: "「不」为什么跑到前面去了？",
      paragraphs: [
        "转述就是「引子 + 原话照装」：She says + she will come。Lily 怎么说，装进去就怎么说。",
        "但有一个习惯你要认识：想说「我觉得她不会来」，英语不说 I think she will not come，而是 I don't think she will come——「不」跑到前面 think 那里去了。",
        "这叫「否定搬家」：中文的「不」在后面（我觉得她【不】会来），英语的习惯是让主句替她说「不」（I 【don't】think……）。两边习惯不同，记住英语的站法。",
        "先记最常用的这一句就行：I don't think……（我觉得不……）。以后见到 I don't think he can come 这种，你就认识它了。"
      ]
    },
    summary: {
      rule: "转述 = She says + 原话照装；「不」放前面说：I don't think she will come。",
      points: [
        "She says she will come. —— 引子 + 原话",
        "I don't think she will come. —— 「不」搬到前面",
        "Do you think she will come? —— 问别人：Do 站句首"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：她说她会来。",
        before: "",
        after: "she will come.",
        options: ["She says", "She say", "She said"],
        answer: "She says",
        explain: "主语 She 是三单，say 加 -s：She says。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：她说她会来。",
        tokens: ["She", "says", "she", "will", "come."],
        answer: "She says she will come.",
        explain: "转述 = 引子 + 原话照装：She says + she will come。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我觉得她不会来。",
        tokens: ["I", "don't", "think", "she", "will", "come."],
        answer: "I don't think she will come.",
        explain: "「不」搬到前面说：I don't think she will come。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["She", "says", "she", "will", "comes."],
        wrongToken: "comes.",
        answer: "comes.",
        correctionZh: "will 后面的动词穿原样：will come。",
        explain: "will 后面永远穿原样，comes 要换回 come。"
      },
      {
        // R8 跨课复现：第 29 课（be going to）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——第 29 课学过：我打算去看电影。",
        tokens: ["I", "am", "going", "to", "watch", "a", "movie."],
        answer: "I am going to watch a movie.",
        explain: "复现第 29 课：be going to + 动词原形。"
      },
      {
        // R9 变形/替换：否定搬家（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变装：「I think she will come.」想说「我觉得她不会来」，「不」要放在哪里？",
        replaceBase: "I think she will come.",
        replaceTarget: "想说「我觉得她不会来」",
        options: ["don't think", "think not", "not think"],
        answer: "don't think",
        explain: "「不」搬到前面：I don't think she will come。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：她说她会来。",
        tokens: ["She", "says", "she", "will", "come."],
        distractors: ["say"],
        answer: "She says she will come."
      },
      {
        // R06 变体扩量：与 variants 否定卡逐字一致的否定变体题
        promptZh: "你想说：我觉得她不会来。",
        tokens: ["I", "don't", "think", "she", "will", "come."],
        distractors: ["not"],
        answer: "I don't think she will come."
      },
      {
        promptZh: "把第 29 课的句子装进转述里——你想说：她说她打算去跑步。",
        tokens: ["She", "says", "she", "is", "going", "to", "run."],
        distractors: ["goes"],
        answer: "She says she is going to run."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：你觉得她会来吗？",
        tokens: ["Do", "you", "think", "she", "will", "come?"],
        distractors: ["Does"],
        answer: "Do you think she will come?"
      }
    ],
    recall: {
      promptZh: "接力赛前，教练问你 Lily 会不会来。凭记忆，写出你那句转述。",
      intentZh: "她说她会来。",
      answer: "She says she will come.",
      noteZh: "转述 = She says + 原话照装。"
    },
    huntCaseIds: ["hunt-team-message"]
  },
  {
    // ── 第四批 · L39 定语从句①（who 指人）：给名词挂尾巴，先叫人再挂尾巴；本批最长课，arrange 拆段 token≤8 ──
    id: "lesson-39-who-glasses",
    number: 39,
    title: "那个戴眼镜的男生",
    grammarLabel: "给名词挂尾巴 · who",
    episode: "小美的一天 ㊴",
    scene: "campus",
    cover: cover7,
    sceneSetupZh: "放学时在校门口接人，同学问你哪个是你哥哥。",
    dialogueEn: "Who is your brother?",
    dialogueZh: "同学在东张西望。",
    intentZh: "那个戴眼镜的男生是我哥哥。",
    targetSentence: "The boy who wears glasses is my brother.",
    blocks: [
      { text: "The boy", role: "那个男生（先叫人）" },
      { text: "who wears glasses", role: "戴眼镜的（挂在他后面的尾巴）" },
      { text: "is my brother", role: "是我哥哥" }
    ],
    oneLineRule: "给名词挂尾巴：先说出人（the boy），再把「戴眼镜的」这条尾巴挂他后面（who wears glasses）——中文的「的」住前面，英语的尾巴住后面。",
    examples: [
      { en: "The boy who wears glasses is my brother.", zh: "那个戴眼镜的男生是我哥哥。" },
      { en: "The girl who plays football is my friend.", zh: "那个踢足球的女生是我的朋友。" },
      { en: "The teacher who helps us is kind.", zh: "帮我们的那位老师很亲切。" },
      { en: "I know the boy who is tall.", zh: "我认识那个高个子男生。" }
    ],
    dialogue: [
      { who: "npc", en: "Who is your brother?", zh: "同学在东张西望。" },
      { who: "npc", en: "Is he the tall boy?", zh: "她又猜：是那个高个子的男生吗？" },
      { who: "me", en: "The boy who wears glasses is my brother.", zh: "轮到你说了——那个戴眼镜的男生是你哥哥。" }
    ],
    contrast: [
      {
        wrong: "The boy wears glasses is my brother.",
        wrongMark: null,
        correct: "The boy who wears glasses is my brother.",
        whyZh: "两条句子直接拼在一起，没人当钩子。要挂尾巴：the boy 【who wears glasses】is my brother——who 就是把尾巴钩到 boy 上的那个钩子。"
      },
      {
        wrong: "The boy is my brother who wears glasses.",
        wrongMark: "who wears glasses",
        correct: "The boy who wears glasses is my brother.",
        whyZh: "尾巴挂错了地方——它挂到句尾去了，好像「我哥哥戴眼镜」是顺带说的。尾巴要贴着它修饰的人站：the boy who wears glasses。"
      },
      {
        wrong: "The boy who he wears glasses is my brother.",
        wrongMark: "he",
        correct: "The boy who wears glasses is my brother.",
        whyZh: "一个萝卜一个坑：who 已经替「他」站好了位置，再冒出一个 he 就挤了——who wears glasses，不许再有 he。"
      },
      {
        wrong: "The boy who wear glasses is my brother.",
        wrongMark: "wear",
        correct: "The boy who wears glasses is my brother.",
        whyZh: "尾巴里的人 who 也是「他」，动词要加 -s：who wears——三单的规矩进了尾巴照样管用。"
      },
      {
        wrong: "The boy who is wears glasses is my brother.",
        wrongMark: "is wears",
        correct: "The boy who wears glasses is my brother.",
        whyZh: "wear 自己就是动词，前面不用再垫 is——is 和 wears 不能叠在一起站。"
      },
      {
        wrong: "The girl who play football is my friend.",
        wrongMark: "play",
        correct: "The girl who plays football is my friend.",
        whyZh: "who 指 the girl（她），动词加 -s：who plays football。"
      }
    ],
    variants: [
      { label: "肯定", en: "The boy who wears glasses is my brother.", zh: "那个戴眼镜的男生是我哥哥。" },
      { label: "否定", en: "The boy who wears glasses is not my brother.", zh: "那个戴眼镜的男生不是我哥哥。", noteZh: "not 放 is 后面；尾巴 who wears glasses 原地不动。" },
      { label: "疑问", en: "Is the boy who wears glasses your brother?", zh: "那个戴眼镜的男生是你哥哥吗？", noteZh: "把 Is 搬到句首，尾巴留在主语后面。" }
    ],
    sceneSwings: [
      { sceneZh: "说踢足球的女生是你朋友", en: "The girl who plays football is my friend.", zh: "那个踢足球的女生是我的朋友。" },
      { sceneZh: "说帮你们的老师很亲切", en: "The teacher who helps us is kind.", zh: "帮我们的那位老师很亲切。" },
      { sceneZh: "说认识那个高个子男生", en: "I know the boy who is tall.", zh: "我认识那个高个子男生。" }
    ],
    deepDive: {
      title: "中文的「的」在前，英语的尾巴在后",
      paragraphs: [
        "中文说「戴眼镜的男生」，「戴眼镜的」住在前面的；英语倒过来：先说 the boy，再把 who wears glasses 这条尾巴挂到后面。顺序不同，位置感是这课唯一的难点。",
        "who 是干什么的？它是「这个人」的替身兼钩子：把尾巴钩在人物身上，同时在尾巴里替他做事（wears glasses）。",
        "尾巴挂错位置会改变意思：The boy is my brother who wears glasses 听起来像「我哥哥戴眼镜」；The boy who wears glasses is my brother 才是「戴眼镜的那个是我哥哥」——先认人，再认关系。",
        "一个萝卜一个坑：who 已经替了人，尾巴里不能再有 he / she；who 是「他/她」的意思，动词该加 -s 照样加（who wears）。"
      ]
    },
    summary: {
      rule: "给名词挂尾巴：先叫人（the boy），再挂 who + 他说的事（who wears glasses）。",
      points: [
        "The boy who wears glasses is my brother. —— 先叫人，再挂尾巴",
        "The girl who plays football is my friend. —— 尾巴里的动词照加 -s",
        "Is the boy who wears glasses your brother? —— 问句把 Is 搬句首，尾巴不动"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：那个戴眼镜的男生是我哥哥。",
        before: "The boy",
        after: "wears glasses is my brother.",
        options: ["who", "he", "which"],
        answer: "who",
        explain: "指人用 who 当钩子：the boy who wears glasses。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：那个戴眼镜的男生是我哥哥。（先拼主句）",
        tokens: ["The", "boy", "is", "my", "brother."],
        answer: "The boy is my brother.",
        explain: "先拼出主句：The boy is my brother——这是句子的骨架。"
      },
      {
        kind: "arrange",
        promptZh: "现在把尾巴挂上去：那个戴眼镜的男生是我哥哥。",
        tokens: ["The", "boy", "who", "wears", "glasses", "is", "my", "brother."],
        answer: "The boy who wears glasses is my brother.",
        explain: "尾巴贴着 boy 站：who wears glasses。先叫人，再挂尾巴。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["The", "boy", "wears", "glasses", "is", "my", "brother."],
        wrongToken: "wears",
        answer: "wears",
        correctionZh: "缺了个钩子：The boy who wears glasses is my brother。",
        explain: "两条句子直接拼在一起，要用 who 把尾巴钩住。"
      },
      {
        // R8 跨课复现：第 25 课（三单 -s）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——第 25 课学过：他每天喝牛奶。",
        tokens: ["He", "drinks", "milk", "every", "day."],
        answer: "He drinks milk every day.",
        explain: "复现第 25 课：三单动词加 -s，drinks。"
      },
      {
        // R9 变形/替换：换成女生（who 不变、动词形式要跟着走）
        kind: "replace",
        promptZh: "句子变身：「The boy who wears glasses is my brother.」换成女生（The girl…），尾巴里的动词怎么变？",
        replaceBase: "The boy who wears glasses is my brother.",
        replaceTarget: "把 The boy 换成 The girl",
        options: ["wears", "wear", "wearing"],
        answer: "wears",
        explain: "who 指 the girl（她），动词照样加 -s：who wears glasses。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：那个踢足球的女生是我的朋友。",
        tokens: ["The", "girl", "who", "plays", "football", "is", "my", "friend."],
        distractors: ["play"],
        answer: "The girl who plays football is my friend."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题（8 token，守 L39 token≤8 摩擦上限）
        promptZh: "你想问：那个戴眼镜的男生是你哥哥吗？",
        tokens: ["Is", "the", "boy", "who", "wears", "glasses", "your", "brother?"],
        distractors: ["he", "which"],
        answer: "Is the boy who wears glasses your brother?"
      },
      {
        // R8 跨课复现（L25 三单）：旧知识点装进尾巴
        promptZh: "把第 25 课的句子改成「那个踢球的男生是谁」——你想说：那个踢足球的男生是我的哥哥。",
        tokens: ["The", "boy", "who", "plays", "football", "is", "my", "brother."],
        distractors: ["play", "he"],
        answer: "The boy who plays football is my brother."
      },
      {
        promptZh: "你想说：我认识那个高个子男生。",
        tokens: ["I", "know", "the", "boy", "who", "is", "tall."],
        distractors: ["are"],
        answer: "I know the boy who is tall."
      }
    ],
    recall: {
      promptZh: "放学在校门口，同学问你哪个是你哥哥。凭记忆，写出你那句英文。",
      intentZh: "那个戴眼镜的男生是我哥哥。",
      answer: "The boy who wears glasses is my brother.",
      noteZh: "先叫人（the boy），再挂尾巴（who wears glasses）。"
    },
    huntCaseIds: ["hunt-family-photo"]
  },
  {
    // ── 第四批 · L40 定语从句②（which 指物）：which 是 it 的替身，本尊退场；与 L39 who 成对 ──
    id: "lesson-40-which-book",
    number: 40,
    title: "我读过的那本书",
    grammarLabel: "给名词挂尾巴 · which",
    episode: "小美的一天 ㊵",
    scene: "campus",
    cover: cover10,
    sceneSetupZh: "课桌分享会上，同桌问你有什么好书推荐。",
    dialogueEn: "Which book is good?",
    dialogueZh: "同桌凑过来问你。",
    intentZh: "这是我读过的那本书。",
    targetSentence: "This is the book which I read.",
    blocks: [
      { text: "This is the book", role: "这是那本书（先说出东西）" },
      { text: "which I read", role: "我读过的（挂在后面的尾巴）" }
    ],
    oneLineRule: "给东西挂尾巴：which 是 it 的替身——「我读过它」的 it 搬走，which 上场：the book which I read。",
    examples: [
      { en: "This is the book which I read.", zh: "这是我读过的那本书。" },
      { en: "These are the books which I like.", zh: "这些是我喜欢的书。" },
      { en: "I know the book which she likes.", zh: "我知道她喜欢的那本书。" },
      { en: "The book which I read is good.", zh: "我读过的那本书很不错。" }
    ],
    dialogue: [
      { who: "npc", en: "Which book is good?", zh: "同桌凑过来问你。" },
      { who: "npc", en: "I need a book for the weekend.", zh: "她补了一句：周末我想找本书看。" },
      { who: "me", en: "This is the book which I read.", zh: "轮到你说了——这是你读过的那本书。" }
    ],
    contrast: [
      {
        wrong: "This is the book which I read it.",
        wrongMark: "it.",
        correct: "This is the book which I read.",
        whyZh: "尾巴里多留了一个 it：which 已经替它站好了位置，本尊就要退场——the book which I read。"
      },
      {
        wrong: "This is the book I read it.",
        wrongMark: null,
        correct: "This is the book which I read.",
        whyZh: "这条有两个毛病：缺了钩子（which），还多留了 it。把 it 换成 which 挂上去：the book which I read。"
      },
      {
        wrong: "This is the book who I read.",
        wrongMark: "who",
        correct: "This is the book which I read.",
        whyZh: "钩子拿错了：人用 who（第 39 课），东西用 which——书是东西，请 which 上场。"
      },
      {
        wrong: "This is the book which I reads.",
        wrongMark: "reads",
        correct: "This is the book which I read.",
        whyZh: "I 后面的动词不加 -s——加 -s 是 he / she / it 的待遇。"
      },
      {
        wrong: "These are the book which I like.",
        wrongMark: "book",
        correct: "These are the books which I like.",
        whyZh: "These 是「这些」，后面的东西要用复数：books——复数配复数，第 11 课的老规矩。"
      },
      {
        wrong: "This is the book which I don't like it.",
        wrongMark: "it.",
        correct: "This is the book which I don't like.",
        whyZh: "否定句里 it 照样要搬走：which I don't like——钩子替了它，尾巴里不再留 it。"
      }
    ],
    variants: [
      { label: "肯定", en: "This is the book which I read.", zh: "这是我读过的那本书。" },
      { label: "否定", en: "This is the book which I don't like.", zh: "这是我不喜欢的那本书。", noteZh: "「不」放动词前面：which I don't like——尾巴里照常说 don't。" },
      { label: "疑问", en: "Is this the book which you read?", zh: "这是你读过的那本书吗？", noteZh: "把 Is 搬到句首，尾巴 which you read 原地不动。" }
    ],
    sceneSwings: [
      { sceneZh: "说这些是你喜欢的书", en: "These are the books which I like.", zh: "这些是我喜欢的书。" },
      { sceneZh: "说知道她喜欢的那本书", en: "I know the book which she likes.", zh: "我知道她喜欢的那本书。" },
      { sceneZh: "说读过的书很不错", en: "The book which I read is good.", zh: "我读过的那本书很不错。" }
    ],
    deepDive: {
      title: "it 去哪儿了？",
      paragraphs: [
        "中文说「我读过它」，英语把这句话挂到书后面时，it 要「搬家」：I read it（我读过它）→ the book which I read（我读过的那本书）。it 本尊退场，which 替身上场。",
        "who 管人、which 管东西：上一课 the boy who wears glasses（戴眼镜的男生）；这一课 the book which I read（我读过的那本书）。两个钩子分工不同，看它拴的是人还是东西。",
        "尾巴里的语序和普通句子一样：which I read、which I like——就是「主语 + 动词」，跟别处没两样。",
        "最容易犯的错是舍不得那个 it：中文「我读过它」说惯了，尾巴里就会多留一个 it。记住：钩子替了它，它就不许再出现。"
      ]
    },
    summary: {
      rule: "给东西挂尾巴：which 替 it 上场——the book which I read。",
      points: [
        "This is the book which I read. —— which = it 的替身",
        "These are the books which I like. —— 多个东西一样挂",
        "the book which I don't like —— 尾巴里否定照常说 don't"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：这是我读过的那本书。",
        before: "This is the book",
        after: "I read.",
        options: ["which", "who", "it"],
        answer: "which",
        explain: "指东西用 which 当钩子：the book which I read。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：这是我读过的那本书。",
        tokens: ["This", "is", "the", "book", "which", "I", "read."],
        answer: "This is the book which I read.",
        explain: "先说出东西（the book），再挂尾巴（which I read）。"
      },
      {
        kind: "arrange",
        promptZh: "同桌问你有好书推荐吗，你想说：这些是我喜欢的书。",
        tokens: ["These", "are", "the", "books", "which", "I", "like."],
        answer: "These are the books which I like.",
        explain: "多个东西一样挂：books 配 are，后面跟 which I like。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["This", "is", "the", "book", "which", "I", "read", "it."],
        wrongToken: "it.",
        answer: "it.",
        correctionZh: "it 要搬走：the book which I read——which 已经替了它。",
        explain: "钩子替了它，尾巴里不许再留 it。"
      },
      {
        // R8 跨课复现：上一课（L39 who 指人）的句式混入，与 which 形成对偶
        kind: "arrange",
        promptZh: "先复习一小步——上一课学过：那个戴眼镜的男生是我哥哥。",
        tokens: ["The", "boy", "who", "wears", "glasses", "is", "my", "brother."],
        answer: "The boy who wears glasses is my brother.",
        explain: "复现第 39 课：who 管人；这课 which 管东西。"
      },
      {
        // R9 变形/替换：否定进尾巴（复用 choose 判题）
        kind: "replace",
        promptZh: "句子变装：「This is the book which I read.」想说「这是我『不』喜欢的那本书」，「不」要放在哪里？",
        replaceBase: "This is the book which I read.",
        replaceTarget: "想说「不」喜欢",
        options: ["don't like", "like not", "not like"],
        answer: "don't like",
        explain: "「不」放动词前面：which I don't like——尾巴里照常说 don't。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：这是我读过的那本书。",
        tokens: ["This", "is", "the", "book", "which", "I", "read."],
        distractors: ["who"],
        answer: "This is the book which I read."
      },
      {
        // R8 跨课复现（L33 指示代词 × L11 复数）：旧句式装进 which 尾巴
        promptZh: "先复习一小步——把第 33 课的「这些是我的书」装进尾巴：这些是我喜欢的书。",
        tokens: ["These", "are", "the", "books", "which", "I", "like."],
        distractors: ["book"],
        answer: "These are the books which I like."
      },
      {
        // R06 变体扩量：与 variants 否定卡逐字一致的否定变体题
        promptZh: "你想说：这是我不喜欢的那本书。",
        tokens: ["This", "is", "the", "book", "which", "I", "don't", "like."],
        distractors: ["it"],
        answer: "This is the book which I don't like."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：这是你读过的那本书吗？",
        tokens: ["Is", "this", "the", "book", "which", "you", "read?"],
        distractors: ["do"],
        answer: "Is this the book which you read?"
      }
    ],
    recall: {
      promptZh: "课桌分享会上轮到你推荐一本书。凭记忆，写出你那句英文。",
      intentZh: "这是我读过的那本书。",
      answer: "This is the book which I read.",
      noteZh: "which 替 it 上场：the book which I read。"
    },
    huntCaseIds: ["hunt-book-swap"]
  },
  {
    // ── 第四批 · L41 收口课：零新知全对比，宾从 + 定从混排；「钩子可以省」只做深挖卡认读 ──
    id: "lesson-41-two-things",
    number: 41,
    title: "一句话说两件事",
    grammarLabel: "收口 · 两句话拼一句",
    episode: "小美的一天 ㊶",
    scene: "campus",
    cover: cover22,
    sceneSetupZh: "期末班会，小美向新老师介绍同学和班级的事。",
    dialogueEn: "Can you tell me about your class?",
    dialogueZh: "新老师微笑着问你。",
    intentZh: "我认识那个戴眼镜的男生。",
    targetSentence: "I know the boy who wears glasses.",
    blocks: [
      { text: "I know", role: "我知道（话中话的引子）" },
      { text: "the boy", role: "那个男生（先叫人）" },
      { text: "who wears glasses", role: "戴眼镜的（挂在他后面的尾巴）" }
    ],
    oneLineRule: "两句话拼一句：话中话（I know where he is）和挂尾巴（the boy who wears glasses）合用——先认人，再说你认识他。",
    examples: [
      { en: "I know the boy who wears glasses.", zh: "我认识那个戴眼镜的男生。" },
      { en: "I know where he is.", zh: "我知道他在哪。" },
      { en: "She says she likes the book which I read.", zh: "她说她喜欢我读过的那本书。" },
      { en: "Do you know the girl who plays football?", zh: "你认识那个踢足球的女生吗？" }
    ],
    dialogue: [
      { who: "npc", en: "Can you tell me about your class?", zh: "新老师微笑着问你。" },
      { who: "npc", en: "Who is the boy over there?", zh: "她指了指窗边。" },
      { who: "me", en: "I know the boy who wears glasses.", zh: "轮到你说了——你认识那个戴眼镜的男生。" }
    ],
    contrast: [
      {
        wrong: "I know where is he.",
        wrongMark: "is",
        correct: "I know where he is.",
        whyZh: "话中话换鞋的老规矩：where he is——第 35 课学的，到今天照样管用。"
      },
      {
        wrong: "I know the boy who he wears glasses.",
        wrongMark: "he",
        correct: "I know the boy who wears glasses.",
        whyZh: "一个萝卜一个坑：who 已经替了他，不许再有 he——第 39 课学的，收口课再站一次。"
      },
      {
        wrong: "I like the boy is tall.",
        wrongMark: null,
        correct: "I know the boy who is tall.",
        whyZh: "两条句子直接拼在一起，没人当钩子——要给 the boy 挂尾巴：who is tall。"
      },
      {
        wrong: "I know the boy which wears glasses.",
        wrongMark: "which",
        correct: "I know the boy who wears glasses.",
        whyZh: "人用 who、东西用 which——男生是人，请 who 上场（第 40 课的分工表）。"
      },
      {
        wrong: "I know the boy who wear glasses.",
        wrongMark: "wear",
        correct: "I know the boy who wears glasses.",
        whyZh: "who 也是「他」，动词加 -s：who wears——尾巴里的三单规矩不变。"
      },
      {
        wrong: "Do you know where is he?",
        wrongMark: "is",
        correct: "Do you know where he is?",
        whyZh: "两套规矩同台：外面 Do 站句首，里面的话换好鞋——各站各的。"
      }
    ],
    variants: [
      { label: "肯定", en: "I know the boy who wears glasses.", zh: "我认识那个戴眼镜的男生。" },
      { label: "否定", en: "I don't know the boy who wears glasses.", zh: "我不认识那个戴眼镜的男生。", noteZh: "「不知道」用 don't know；尾巴 who wears glasses 原地不动。" },
      { label: "疑问", en: "Do you know the boy who wears glasses?", zh: "你认识那个戴眼镜的男生吗？", noteZh: "问别人：Do 站句首，里面照常。" }
    ],
    sceneSwings: [
      { sceneZh: "说认识那个戴眼镜的男生", en: "I know the boy who wears glasses.", zh: "我认识那个戴眼镜的男生。" },
      { sceneZh: "说知道他在哪", en: "I know where he is.", zh: "我知道他在哪。" },
      { sceneZh: "说她说她喜欢我读过的书", en: "She says she likes the book which I read.", zh: "她说她喜欢我读过的那本书。" }
    ],
    deepDive: {
      title: "钩子还能省？（认读级，别急着用）",
      paragraphs: [
        "老外说话有时把钩子省掉：the people we met（我们见过的人）——which/who 不见了，尾巴照样挂着。这是更进阶的用法，你现在只需要看得懂，不用主动说。",
        "怎么认？看到「名词 + 一整句话」（the people we met）就是省了钩子的尾巴。等用得多了，它自己会顺出来。",
        "本课的主线还是两件旧本事：话中话（where he is）和挂尾巴（who wears glasses）——收口课不学新的，把这两样用熟。",
        "复盘一下这一批你拿到的两句万能句式：I know + 话（我知道……）；the + 名词 + who/which + 尾巴（……的那个）。日常表达大半都从这里长出来。"
      ]
    },
    summary: {
      rule: "话中话（I know where he is）+ 挂尾巴（the boy who wears glasses）——两样合起来，一句话说两件事。",
      points: [
        "I know the boy who wears glasses. —— 引子 + 带尾巴的主语",
        "I know where he is. —— 话中话照旧换鞋",
        "She says she likes the book which I read. —— 转述 + 尾巴同台"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我认识那个戴眼镜的男生。",
        before: "I know the boy",
        after: "wears glasses.",
        options: ["who", "which", "he"],
        answer: "who",
        explain: "指人用 who 当钩子——第 39 课学的，还记得吧。"
      },
      {
        kind: "arrange",
        promptZh: "先复习一小步——第 35 课学过：我知道他在哪。",
        tokens: ["I", "know", "where", "he", "is."],
        answer: "I know where he is.",
        explain: "复现第 35 课：话中话要换鞋，where he is。"
      },
      {
        kind: "arrange",
        promptZh: "现在拼合体句：我认识那个戴眼镜的男生。",
        tokens: ["I", "know", "the", "boy", "who", "wears", "glasses."],
        answer: "I know the boy who wears glasses.",
        explain: "引子（I know）+ 带尾巴的主语（the boy who wears glasses）。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "know", "the", "boy", "which", "wears", "glasses."],
        wrongToken: "which",
        answer: "which",
        correctionZh: "人用 who：the boy who wears glasses。",
        explain: "钩子拿错了——书用 which、人用 who。"
      },
      {
        kind: "arrange",
        promptZh: "先复习一小步——第 40 课学过：这是我读过的那本书。",
        tokens: ["This", "is", "the", "book", "which", "I", "read."],
        answer: "This is the book which I read.",
        explain: "复现第 40 课：which 替 it 上场。"
      },
      {
        // R9 变形/替换：两种钩子各就各位（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I know the boy who wears glasses.」把 the boy 换成 the book，钩子要怎么换？",
        replaceBase: "I know the boy who wears glasses.",
        replaceTarget: "把 the boy 换成 the book",
        options: ["which", "who", "it"],
        answer: "which",
        explain: "人换人就留 who；人换成东西，钩子换成 which——the book which……"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我认识那个戴眼镜的男生。",
        tokens: ["I", "know", "the", "boy", "who", "wears", "glasses."],
        distractors: ["which"],
        answer: "I know the boy who wears glasses."
      },
      {
        // R8 跨课复现（L35 宾从）
        promptZh: "先复习一小步——第 35 课学过：我知道他在哪。",
        tokens: ["I", "know", "where", "he", "is."],
        distractors: ["is he"],
        answer: "I know where he is."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：你认识那个戴眼镜的男生吗？",
        tokens: ["Do", "you", "know", "the", "boy", "who", "wears", "glasses?"],
        distractors: ["which"],
        answer: "Do you know the boy who wears glasses?"
      },
      {
        // 收口总复现（L40）：which 尾巴复现
        promptZh: "最后一小步——第 40 课的句子再走一遍：这是我不喜欢的那本书。",
        tokens: ["This", "is", "the", "book", "which", "I", "don't", "like."],
        distractors: ["it"],
        answer: "This is the book which I don't like."
      }
    ],
    recall: {
      promptZh: "期末班会上，新老师指着一个男生问你认不认识。凭记忆，写出你那句英文。",
      intentZh: "我认识那个戴眼镜的男生。",
      answer: "I know the boy who wears glasses.",
      noteZh: "引子 + 带尾巴的主语：I know + the boy who wears glasses。"
    },
    huntCaseIds: ["hunt-class-intro"]
  },
  {
    // ── 第五批 · L42 动名词①（doing 本体）：-ing 的第二份工作——光 -ing 当名字用；踩 L5 种子转正 ──
    id: "lesson-42-like-reading",
    number: 42,
    title: "我喜欢读书",
    grammarLabel: "动词的第二份工作 · -ing",
    episode: "小美的一天 ㊷",
    scene: "sparkle",
    cover: cover5,
    sceneSetupZh: "周末兴趣角，新同桌问小美平时喜欢做什么。",
    dialogueEn: "What do you like?",
    dialogueZh: "新同桌问她周末喜欢做什么。",
    intentZh: "我喜欢读书。",
    targetSentence: "I like reading.",
    blocks: [
      { text: "I", role: "我" },
      { text: "like", role: "喜欢" },
      { text: "reading", role: "读书（名字版）" }
    ],
    oneLineRule: "-ing 是动词的第二份工作：有 be 搭着＝正在做（I am reading）；没有 be、跟在 like 后面＝当名字用（I like reading）。",
    examples: [
      { en: "I like reading.", zh: "我喜欢读书。" },
      { en: "I like drawing.", zh: "我喜欢画画。" },
      { en: "She likes reading.", zh: "她喜欢读书。" },
      { en: "Do you like reading?", zh: "你喜欢读书吗？" }
    ],
    dialogue: [
      { who: "npc", en: "What do you like?", zh: "新同桌问她周末喜欢做什么。" },
      { who: "npc", en: "Do you like sports?", zh: "她又问：喜欢运动吗？" },
      { who: "me", en: "I like reading.", zh: "轮到你说了——你喜欢读书。" }
    ],
    contrast: [
      {
        wrong: "I like read.",
        wrongMark: "read",
        correct: "I like reading.",
        whyZh: "喜欢的是「做的事」：动词要换名字版——read 变成 reading，才能跟在 like 后面。"
      },
      {
        wrong: "I am reading.",
        wrongMark: null,
        correct: "I like reading.",
        bothRight: true,
        whyZh: "两句都对——同一件 -ing，两个岗位：有 be 搭着＝正在做（I am reading）；光 -ing＝当名字用（I like reading）。"
      },
      {
        wrong: "I don't like read.",
        wrongMark: "read",
        correct: "I don't like reading.",
        whyZh: "否定句里名字版也不动：don't 挡住的是 like，做的事照样用 reading。"
      },
      {
        wrong: "She like reading.",
        wrongMark: "like",
        correct: "She likes reading.",
        whyZh: "主语 She 是三单，like 要加 -s：She likes reading。"
      },
      {
        wrong: "You like reading?",
        wrongMark: null,
        correct: "Do you like reading?",
        whyZh: "问句要请帮手：Do 站句首——You like reading? 是在说，不是在问。"
      },
      {
        wrong: "I not like reading.",
        wrongMark: "not",
        correct: "I don't like reading.",
        whyZh: "「不」要请帮手一起站：I don't like reading——not 自己站不住，配上 do 才有力气。"
      }
    ],
    variants: [
      { label: "肯定", en: "I like reading.", zh: "我喜欢读书。" },
      { label: "否定", en: "I don't like reading.", zh: "我不喜欢读书。", noteZh: "don't 挡住的是 like；reading 是名字版，原地不动。" },
      { label: "疑问", en: "Do you like reading?", zh: "你喜欢读书吗？", noteZh: "问别人：Do 站句首，reading 不动。" }
    ],
    sceneSwings: [
      { sceneZh: "说喜欢画画", en: "I like drawing.", zh: "我喜欢画画。" },
      { sceneZh: "说她喜欢读书", en: "She likes reading.", zh: "她喜欢读书。" },
      { sceneZh: "问对方喜欢读书吗", en: "Do you like reading?", zh: "你喜欢读书吗？" }
    ],
    deepDive: {
      title: "-ing 的第二份工作",
      paragraphs: [
        "你在第 13 课见过 -ing：I am reading（我正在读）——前面站着 be（am/is/are），它就在说「正在做」。",
        "现在它换了第二份工作：没有 be 的时候，-ing 当「名字牌」用——把做一件事变成「那件事」本身：I like reading（我喜欢「读书」这件事）。",
        "怎么分？看有没有 be 搭着：有 be＝正在做（I am reading）；光 -ing、跟在 like 后面＝当名字用。同一件工装，两班岗。",
        "中文不用变：「我喜欢读书」里的「读书」原样不动；英语要把 read 换成名字版 reading。这是中文直译最容易漏的一步。"
      ]
    },
    summary: {
      rule: "-ing 是动词的第二份工作：有 be 搭着＝正在做；光 -ing＝当名字用。",
      points: [
        "I like reading. —— 喜欢「读书」这件事",
        "I am reading. —— 正在读：be 搭着",
        "Do you like reading? —— 问别人：Do 站句首"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我喜欢读书。",
        before: "I",
        after: "reading.",
        options: ["like", "likes", "am"],
        answer: "like",
        explain: "I 用 like——不用加 s，也不用垫 am。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我喜欢读书。",
        tokens: ["I", "like", "reading."],
        answer: "I like reading.",
        explain: "读书是「做的事」：动词换名字版 reading。"
      },
      {
        // R8 跨课复现：第 5 课（like + 名词）原句
        kind: "arrange",
        promptZh: "先复习一小步——第 5 课学过：我喜欢音乐。",
        tokens: ["I", "like", "music."],
        answer: "I like music.",
        explain: "复现第 5 课：喜欢一类东西，直接用名字。"
      },
      {
        // R8 跨课复现：第 13 课（现在进行时）的对照句
        kind: "arrange",
        promptZh: "再对照一下——第 13 课学过：我正在读一本书。",
        tokens: ["I", "am", "reading", "a", "book."],
        answer: "I am reading a book.",
        explain: "复现第 13 课：有 be 搭着才是「正在做」。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "like", "read."],
        wrongToken: "read.",
        answer: "read.",
        correctionZh: "read 要换名字版：I like reading。",
        explain: "喜欢的是「做的事」，动词要变 reading。"
      },
      {
        // R9 变形/替换：名词换「做的事」（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I like music.」想说「我喜欢读书」，music 要换成什么？",
        replaceBase: "I like music.",
        replaceTarget: "把 music 换成「读书」",
        options: ["reading", "read", "to read"],
        answer: "reading",
        explain: "做的事要用名字版：I like reading。"
      }
    ],
    practice: [
      {
        // L5 practice 原题回收（种子转正）
        promptZh: "你想说：我喜欢读书。",
        tokens: ["I", "like", "reading."],
        distractors: ["read"],
        answer: "I like reading."
      },
      {
        // R06 变体扩量：与 variants 否定卡逐字一致的否定变体题
        promptZh: "你想说：我不喜欢读书。",
        tokens: ["I", "don't", "like", "reading."],
        distractors: ["read"],
        answer: "I don't like reading."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：你喜欢读书吗？",
        tokens: ["Do", "you", "like", "reading?"],
        distractors: ["Does"],
        answer: "Do you like reading?"
      },
      {
        // R8 跨课复现（L13 进行时）：同词换岗对照
        promptZh: "先复习一小步——第 13 课学过：她正在画画。",
        tokens: ["She", "is", "drawing."],
        distractors: ["draw"],
        answer: "She is drawing."
      }
    ],
    recall: {
      promptZh: "周末兴趣角，新同桌问小美喜欢做什么。凭记忆，写出那句英文。",
      intentZh: "我喜欢读书。",
      answer: "I like reading.",
      noteZh: "喜欢的是「做的事」：动词换名字版 reading。"
    },
    huntCaseIds: ["hunt-interest-day"]
  },
  {
    // ── 第五批 · L43 动名词②（V-ing 当主角）：句首说「做某事」也要名字版；踩 L32 命令句跨课对撞，零新词 ──
    id: "lesson-43-swimming-fun",
    number: 43,
    title: "游泳真好玩",
    grammarLabel: "让事情当主角 · -ing 开头",
    episode: "小美的一天 ㊸",
    scene: "island",
    cover: cover17,
    sceneSetupZh: "夏令营水上活动日结束，小美回家跟妈妈汇报。",
    dialogueEn: "How was the water day?",
    dialogueZh: "妈妈在门口问她。",
    intentZh: "游泳真好玩。",
    targetSentence: "Swimming is fun.",
    blocks: [
      { text: "Swimming", role: "游泳这件事（当主角，名字版）" },
      { text: "is", role: "是" },
      { text: "fun", role: "好玩" }
    ],
    oneLineRule: "这件事当句子的主角时也穿名字版：Swimming is fun——句首不放 Swim（那是命令口气），放 Swimming。",
    examples: [
      { en: "Swimming is fun.", zh: "游泳真好玩。" },
      { en: "Drawing is fun.", zh: "画画真好玩。" },
      { en: "Reading is fun.", zh: "读书真好玩。" },
      { en: "Swimming is not easy.", zh: "游泳不容易。" }
    ],
    dialogue: [
      { who: "npc", en: "How was the water day?", zh: "妈妈在门口问她。" },
      { who: "npc", en: "Did you have fun?", zh: "她又问：玩得开心吗？" },
      { who: "me", en: "Swimming is fun.", zh: "轮到你说了——游泳真好玩。" }
    ],
    contrast: [
      {
        wrong: "Swim is fun.",
        wrongMark: "Swim",
        correct: "Swimming is fun.",
        whyZh: "句首的 Swim 光着身子，像在下命令（回想第 32 课：Close the door 那种口气）。说「游泳这件事」，要给动词上名字版：Swimming。"
      },
      {
        wrong: "I am swimming.",
        wrongMark: null,
        correct: "Swimming is fun.",
        bothRight: true,
        whyZh: "两句都对——有 be 搭着＝正在游（I am swimming）；当名字＝「游泳这件事」（Swimming is fun）。名字牌还是那件名字牌。"
      },
      {
        wrong: "Swim is not easy.",
        wrongMark: "Swim",
        correct: "Swimming is not easy.",
        whyZh: "否定句里主角照样用名字版：Swimming is not easy——not 管的是 is，名字牌不动。"
      },
      {
        wrong: "Swimming are fun.",
        wrongMark: "are",
        correct: "Swimming is fun.",
        whyZh: "「游泳」是一件事，算单个，用 is：Swimming is fun。"
      },
      {
        wrong: "Swimming is a fun.",
        wrongMark: "a",
        correct: "Swimming is fun.",
        whyZh: "fun 直接跟在 is 后面就行，前面不加 a——a 是给可数名词戴的帽子（第 4 课学过的）。"
      },
      {
        wrong: "Swimming fun.",
        wrongMark: null,
        correct: "Swimming is fun.",
        whyZh: "少了 is，句子就塌了——「件事 + 是 + 评价」三块都要到齐。"
      }
    ],
    variants: [
      { label: "肯定", en: "Swimming is fun.", zh: "游泳真好玩。" },
      { label: "否定", en: "Swimming is not fun.", zh: "游泳不好玩。", noteZh: "not 放 is 后面；主角 swimming 不动。" },
      { label: "疑问", en: "Is swimming fun?", zh: "游泳好玩吗？", noteZh: "把 Is 搬到句首，swimming 留在原地。" }
    ],
    sceneSwings: [
      { sceneZh: "说画画真好玩", en: "Drawing is fun.", zh: "画画真好玩。" },
      { sceneZh: "说读书真好玩", en: "Reading is fun.", zh: "读书真好玩。" },
      { sceneZh: "说游泳不容易", en: "Swimming is not easy.", zh: "游泳不容易。" }
    ],
    deepDive: {
      title: "句首的动词，为什么不能光着身子？",
      paragraphs: [
        "第 32 课你学过命令句：Close the door（把门关上）——动词光着身子开头，是在请人做事。",
        "所以句首直接说 Swim is fun，听起来像在喊「游泳！很好玩！」，口气不对。要说「游泳这件事」，动词要上名字版：Swimming is fun。",
        "名字牌还是那件名字牌（第 42 课学的）：跟在 like 后面当「做的事」，站到句首当「主角」——都是把动作变成「那件事」。",
        "顺便认识一个词：fun 是「好玩、有意思」。Swimming is fun 就是「游泳这件事很好玩」。"
      ]
    },
    summary: {
      rule: "事情当主角也用名字版：Swimming is fun。句首不放光身子的动词。",
      points: [
        "Swimming is fun. —— 游泳这件事：名字版站句首",
        "Swimming is not fun. —— 否定：not 放 is 后面",
        "Is swimming fun? —— 问句：把 Is 搬句首"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：游泳真好玩。",
        before: "",
        after: "is fun.",
        options: ["Swimming", "Swim", "Swims"],
        answer: "Swimming",
        explain: "事情当主角用名字版：Swimming。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：游泳真好玩。",
        tokens: ["Swimming", "is", "fun."],
        answer: "Swimming is fun.",
        explain: "名字版站句首当主角：Swimming + is + fun。"
      },
      {
        kind: "arrange",
        promptZh: "你还想跟妈妈说：画画也很好玩。",
        tokens: ["Drawing", "is", "fun", "too."],
        answer: "Drawing is fun too.",
        explain: "同一个句式换个主角：Drawing is fun too。"
      },
      {
        // R8 跨课复现：第 14 课（can）原句
        kind: "arrange",
        promptZh: "先复习一小步——第 14 课学过：我会游泳。",
        tokens: ["I", "can", "swim."],
        answer: "I can swim.",
        explain: "复现第 14 课：can 后面的动词穿原样。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["Swim", "is", "fun."],
        wrongToken: "Swim",
        answer: "Swim",
        correctionZh: "主角要上名字版：Swimming is fun。",
        explain: "句首光身子的 Swim 像在下命令，要说「游泳这件事」得用 Swimming。"
      },
      {
        // R9 变形/替换：命令句变主角句（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I am swimming.」想说「游泳真好玩」，开头要换成什么？",
        replaceBase: "I am swimming.",
        replaceTarget: "把「我在游泳」换成「游泳这件事」",
        options: ["Swimming", "Swim", "am swimming"],
        answer: "Swimming",
        explain: "当主角用名字版：Swimming is fun。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：游泳真好玩。",
        tokens: ["Swimming", "is", "fun."],
        distractors: ["Swim"],
        answer: "Swimming is fun."
      },
      {
        // R06 变体扩量：与 variants 否定卡逐字一致的否定变体题
        promptZh: "你想说：游泳不好玩。",
        tokens: ["Swimming", "is", "not", "fun."],
        distractors: ["are"],
        answer: "Swimming is not fun."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：游泳好玩吗？",
        tokens: ["Is", "swimming", "fun?"],
        distractors: ["Do"],
        answer: "Is swimming fun?"
      },
      {
        // R8 跨课复现（L13 进行时）：同词换岗对照
        promptZh: "先复习一小步——第 13 课学过：我正在画画。",
        tokens: ["I", "am", "drawing."],
        distractors: ["draw"],
        answer: "I am drawing."
      }
    ],
    recall: {
      promptZh: "夏令营水上活动日结束，妈妈问你玩得怎么样。凭记忆，写出那句英文。",
      intentZh: "游泳真好玩。",
      answer: "Swimming is fun.",
      noteZh: "事情当主角用名字版：Swimming 站句首。"
    },
    huntCaseIds: ["hunt-swim-day"]
  },
  {
    // ── 第五批 · L44 目的 to（小垫板延伸）：两个动作要垫板才缝得上；全批 token 最长课（≤8 强制） ──
    id: "lesson-44-shop-to-buy",
    number: 44,
    title: "去商店买牛奶",
    grammarLabel: "小垫板新用法 · to + 去做什么",
    episode: "小美的一天 ㊹",
    scene: "city",
    cover: cover4,
    sceneSetupZh: "放学路上，妈妈打电话让小美顺路去商店买东西。",
    dialogueEn: "Can you go to the shop?",
    dialogueZh: "妈妈在电话里问你。",
    intentZh: "我去商店买牛奶。",
    targetSentence: "I go to the shop to buy milk.",
    blocks: [
      { text: "I go to the shop", role: "去商店（to 带路到地方）" },
      { text: "to buy", role: "买（垫板·说明去干嘛）" },
      { text: "milk", role: "牛奶" }
    ],
    oneLineRule: "两个动作要垫板才缝得上：go to the shop「to buy」milk——到地方垫一块 to（带路），去做什么再垫一块 to（说明目的）。",
    examples: [
      { en: "I go to the shop to buy milk.", zh: "我去商店买牛奶。" },
      { en: "I go to the library to read books.", zh: "我去图书馆看书。" },
      { en: "She goes to the park to play.", zh: "她去公园玩。" },
      { en: "I want to buy bread.", zh: "我想买面包。" }
    ],
    dialogue: [
      { who: "npc", en: "Can you go to the shop?", zh: "妈妈在电话里问你。" },
      { who: "npc", en: "We need milk.", zh: "她补了一句：家里要牛奶。" },
      { who: "me", en: "I go to the shop to buy milk.", zh: "轮到你说了——你去商店买牛奶。" }
    ],
    contrast: [
      {
        wrong: "I go to the shop buy milk.",
        wrongMark: "buy",
        correct: "I go to the shop to buy milk.",
        whyZh: "两个动作直接撞一起站不住——中间垫上 to 才缝得住：go to the shop 【to buy】milk。"
      },
      {
        wrong: "I go to the shop.",
        wrongMark: null,
        correct: "I go to the shop to buy milk.",
        bothRight: true,
        whyZh: "两句都对——只说腿儿，到商店就完了；多说一层「去干嘛」，就把 to buy 垫上。垫板可以只垫一块，也可以垫两块。"
      },
      {
        wrong: "I go to the shop to buying milk.",
        wrongMark: "buying",
        correct: "I go to the shop to buy milk.",
        whyZh: "垫板 to 后面永远穿原样：to buy——买东西说 buy，不说 buying。"
      },
      {
        wrong: "I go shop to buy milk.",
        wrongMark: "shop",
        correct: "I go to the shop to buy milk.",
        whyZh: "去地方的第一块垫板别丢：go 【to】the shop——商店是地方，要用 to 带路。"
      },
      {
        wrong: "She go to the shop to buy milk.",
        wrongMark: "go",
        correct: "She goes to the shop to buy milk.",
        whyZh: "主语 She 是三单，go 要加 -es：goes。"
      },
      {
        wrong: "I go to the shop to buy milks.",
        wrongMark: "milks",
        correct: "I go to the shop to buy milk.",
        whyZh: "牛奶数不清，永远不加 s：buy milk（第 30 课学过的不朋友）。"
      }
    ],
    variants: [
      { label: "肯定", en: "I go to the shop to buy milk.", zh: "我去商店买牛奶。" },
      { label: "否定", en: "I don't go to the shop.", zh: "我不去商店。", noteZh: "「不去」用 don't go；整句保持短句，不带目的尾。" },
      { label: "疑问", en: "Do you go to the shop?", zh: "你去商店吗？", noteZh: "问别人：Do 站句首。" }
    ],
    sceneSwings: [
      { sceneZh: "说去图书馆看书", en: "I go to the library to read books.", zh: "我去图书馆看书。" },
      { sceneZh: "说她去公园玩", en: "She goes to the park to play.", zh: "她去公园玩。" },
      { sceneZh: "说想买面包", en: "I want to buy bread.", zh: "我想买面包。" }
    ],
    deepDive: {
      title: "一块垫板，两个车站",
      paragraphs: [
        "第 9 课你见过第一块小垫板：go to the library（去图书馆）——to 带路，把你送到地方。",
        "今天垫板能垫第二块：到了商店要干嘛？把「买牛奶」也垫上——to buy milk。合起来：I go to the shop to buy milk。",
        "为什么中文不用垫？「去商店买牛奶」一口气说完了，中间不用任何标记；英语不行，两个动作要一块垫板缝着，不然听着像两个句子硬拼。",
        "记住手感：到地方 = to + 地方（to the shop）；去做什么 = to + 原形动词（to buy）。同一个 to，两块工牌。"
      ]
    },
    summary: {
      rule: "两个动作用垫板缝：go to the shop【to buy】milk——第一块带路，第二块说去干嘛。",
      points: [
        "I go to the shop to buy milk. —— 两块垫板：to the shop / to buy",
        "to buy 后面穿原样 —— 不写 buying",
        "She goes to the park to play. —— 三单的 -es 别忘"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我去商店买牛奶。",
        before: "I go to the shop",
        after: "milk.",
        options: ["to buy", "buy", "buying"],
        answer: "to buy",
        explain: "去干嘛要垫一块 to：to buy milk。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我去商店买牛奶。",
        tokens: ["I", "go", "to", "the", "shop", "to", "buy", "milk."],
        answer: "I go to the shop to buy milk.",
        explain: "两块垫板：to the shop 带路 + to buy 说目的。"
      },
      {
        // R8 跨课复现：第 9 课（go to）原句
        kind: "arrange",
        promptZh: "先复习一小步——第 9 课学过：我去图书馆。",
        tokens: ["I", "go", "to", "the", "library."],
        answer: "I go to the library.",
        explain: "复现第 9 课：to 带路到地方。"
      },
      {
        // R8 跨课复现：第 9 课 + 本课扩展合体
        kind: "arrange",
        promptZh: "给第 9 课的句子加上目的——我去图书馆看书。",
        tokens: ["I", "go", "to", "the", "library", "to", "read", "books."],
        answer: "I go to the library to read books.",
        explain: "同样的骨架：到地方（to the library）+ 去干嘛（to read books）。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "go", "to", "the", "shop", "buy", "milk."],
        wrongToken: "buy",
        answer: "buy",
        correctionZh: "中间垫一块 to：go to the shop to buy milk。",
        explain: "两个动作硬撞了，垫板没垫。"
      },
      {
        // R9 变形/替换：同词换岗（want 门口的垫板）
        kind: "replace",
        promptZh: "句子变身：「I go to the shop to buy milk.」想说「我想去旅行」——第 15 课的桌子，这里怎么垫？",
        replaceBase: "I want to travel.",
        replaceTarget: "把 travel 换成「买面包」",
        options: ["to buy bread", "buy bread", "buying bread"],
        answer: "to buy bread",
        explain: "want 后面照样垫 to：I want to buy bread。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我去商店买牛奶。",
        tokens: ["I", "go", "to", "the", "shop", "to", "buy", "milk."],
        distractors: ["buying"],
        answer: "I go to the shop to buy milk."
      },
      {
        // R8 跨课复现（L9 扩展）
        promptZh: "先复习一小步——把第 9 课的句子加上目的：我去图书馆看书。",
        tokens: ["I", "go", "to", "the", "library", "to", "read", "books."],
        distractors: ["reading"],
        answer: "I go to the library to read books."
      },
      {
        // R06 变体扩量：与 variants 否定卡逐字一致的否定变体题
        promptZh: "你想说：我不去商店。",
        tokens: ["I", "don't", "go", "to", "the", "shop."],
        distractors: ["not"],
        answer: "I don't go to the shop."
      },
      {
        // R8 跨课复现（L15 want to）：同块垫板
        promptZh: "先复习一小步——第 15 课学过：我想旅行。",
        tokens: ["I", "want", "to", "travel."],
        distractors: ["traveling"],
        answer: "I want to travel."
      }
    ],
    recall: {
      promptZh: "妈妈打电话让你顺路买东西。凭记忆，写出你要说的那句英文。",
      intentZh: "我去商店买牛奶。",
      answer: "I go to the shop to buy milk.",
      noteZh: "两块垫板：to the shop 带路 + to buy 说目的。"
    },
    huntCaseIds: ["hunt-shop-note"]
  },
  {
    // ── 第五批 · L45 动名词③（enjoy 的门）：有的动词只开一扇门——enjoy 只认名字版；全批唯一新词 enjoy ──
    id: "lesson-45-enjoy-drawing",
    number: 45,
    title: "我享受读书",
    grammarLabel: "enjoy 的门 · 只认 -ing",
    episode: "小美的一天 ㊺",
    scene: "magic",
    cover: cover12,
    sceneSetupZh: "美术兴趣班的报名表上要写自己的爱好，小美认真填。",
    dialogueEn: "What do you enjoy?",
    dialogueZh: "同桌探头看你填表。",
    intentZh: "我享受读书。",
    targetSentence: "I enjoy reading.",
    blocks: [
      { text: "I enjoy", role: "我享受（enjoy = 很享受）" },
      { text: "reading", role: "读书（名字版）" }
    ],
    oneLineRule: "enjoy 的门只开一扇：只认名字版 enjoy reading，不认 enjoy to read——enjoy 后面不垫 to。",
    examples: [
      { en: "I enjoy reading.", zh: "我享受读书。" },
      { en: "I enjoy drawing.", zh: "我享受画画。" },
      { en: "She enjoys reading.", zh: "她享受读书。" },
      { en: "Do you enjoy reading?", zh: "你享受读书吗？" }
    ],
    dialogue: [
      { who: "npc", en: "What do you enjoy?", zh: "同桌探头看你填表。" },
      { who: "npc", en: "I enjoy drawing. What about you?", zh: "她先说了自己的：我享受画画。你呢？" },
      { who: "me", en: "I enjoy reading.", zh: "轮到你说了——你享受读书。" }
    ],
    contrast: [
      {
        wrong: "I enjoy to read.",
        wrongMark: "to",
        correct: "I enjoy reading.",
        whyZh: "enjoy 的门只开一扇——它不认 to，只认名字版：enjoy reading。垫板在 enjoy 门口用不上。"
      },
      {
        wrong: "She enjoy reading.",
        wrongMark: "enjoy",
        correct: "She enjoys reading.",
        whyZh: "主语 She 是三单，enjoy 要加 -s：enjoys。名字版 reading 不动。"
      },
      {
        wrong: "I enjoy read.",
        wrongMark: "read",
        correct: "I enjoy reading.",
        whyZh: "enjoy 后面跟着的是「做的事」，要用名字版：reading。第 42 课学的手感，这里照样用。"
      },
      {
        wrong: "I enjoy reading books.",
        wrongMark: null,
        correct: "I enjoy reading.",
        bothRight: true,
        whyZh: "两句都对——reading 后面想加 books 就加，不想加也完整。名字版（reading）是必须的，books 是添头。"
      },
      {
        wrong: "Do you enjoy read?",
        wrongMark: "read",
        correct: "Do you enjoy reading?",
        whyZh: "问句里名字版也不动：Do you enjoy reading？Do 站句首，reading 原位。"
      },
      {
        wrong: "I don't enjoy to draw.",
        wrongMark: "to",
        correct: "I don't enjoy drawing.",
        whyZh: "否定句里 enjoy 的门还是只开一扇：don't enjoy drawing——to 照样进不去。"
      }
    ],
    variants: [
      { label: "肯定", en: "I enjoy reading.", zh: "我享受读书。" },
      { label: "否定", en: "I don't enjoy reading.", zh: "我不享受读书。", noteZh: "don't 挡住 enjoy；reading 是名字版，原地不动。" },
      { label: "疑问", en: "Do you enjoy reading?", zh: "你享受读书吗？", noteZh: "问别人：Do 站句首，reading 不动。" }
    ],
    sceneSwings: [
      { sceneZh: "说她享受读书", en: "She enjoys reading.", zh: "她享受读书。" },
      { sceneZh: "说享受画画", en: "I enjoy drawing.", zh: "我享受画画。" },
      { sceneZh: "问对方享不享受读书", en: "Do you enjoy reading?", zh: "你享受读书吗？" }
    ],
    deepDive: {
      title: "enjoy 为什么不要 to？",
      paragraphs: [
        "第 44 课你学过：两个动作用垫板缝——go to the shop to buy milk。但不是所有动词门口都垫板。",
        "enjoy 的门只开一扇：它后面只认名字版（enjoy reading），不认 to（enjoy to read 进不去）。每个动词的门口规矩不一样，遇到就记这一句。",
        "enjoy 本身是什么意思？「享受、很喜欢」——比 like 多一点投入。I enjoy reading 就是「我读书读得很享受」。",
        "这课只用记一个动词的门口：enjoy 只认名字版。别的动词以后一个一个遇。"
      ]
    },
    summary: {
      rule: "enjoy 的门只开一扇：只认名字版 enjoy reading，不认 to。",
      points: [
        "I enjoy reading. —— enjoy + 名字版",
        "She enjoys reading. —— 三单的 -s 别忘",
        "reading 后加 books 也行 —— 名字版必须，添头随意"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我享受读书。",
        before: "I",
        after: "reading.",
        options: ["enjoy", "enjoys", "enjoy to"],
        answer: "enjoy",
        explain: "I 用 enjoy；enjoy 后面直接跟名字版，不垫 to。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我享受读书。",
        tokens: ["I", "enjoy", "reading."],
        answer: "I enjoy reading.",
        explain: "enjoy 的门只开一扇：enjoy + reading。"
      },
      {
        // R8 跨课复现：第 5 课原句（like reading 同源）
        kind: "arrange",
        promptZh: "先复习一小步——第 5 课学过：我喜欢读书。",
        tokens: ["I", "like", "reading."],
        answer: "I like reading.",
        explain: "复现第 5 课/第 42 课：like 后面也是名字版。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "enjoy", "to", "read."],
        wrongToken: "to",
        answer: "to",
        correctionZh: "enjoy 的门不认 to：I enjoy reading。",
        explain: "enjoy 后面不垫板，只认名字版。"
      },
      {
        // R8 跨课复现：第 25 课（三单）的句式混入
        kind: "arrange",
        promptZh: "先复习一小步——第 25 课学过：他每天喝牛奶。",
        tokens: ["He", "drinks", "milk", "every", "day."],
        answer: "He drinks milk every day.",
        explain: "复现第 25 课：三单动词加 -s。"
      },
      {
        // R9 变形/替换：换做的事（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I enjoy reading.」想说「我享受画画」，reading 要换成什么？",
        replaceBase: "I enjoy reading.",
        replaceTarget: "把阅读换成「画画」",
        options: ["drawing", "to draw", "draw"],
        answer: "drawing",
        explain: "enjoy 只认名字版：enjoy drawing。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我享受读书。",
        tokens: ["I", "enjoy", "reading."],
        distractors: ["to read"],
        answer: "I enjoy reading."
      },
      // R8 跨课复现（L25 三单）+ 本课新词：她享受读书
      {
        promptZh: "先复习一小步——把第 25 课的三单和今天的 enjoy 合起来：她享受读书。",
        tokens: ["She", "enjoys", "reading."],
        distractors: ["enjoy", "to read"],
        answer: "She enjoys reading."
      },
      {
        // R06 变体扩量：与 variants 否定卡逐字一致的否定变体题
        promptZh: "你想说：我不享受读书。",
        tokens: ["I", "don't", "enjoy", "reading."],
        distractors: ["to read"],
        answer: "I don't enjoy reading."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：你享受读书吗？",
        tokens: ["Do", "you", "enjoy", "reading?"],
        distractors: ["enjoys"],
        answer: "Do you enjoy reading?"
      }
    ],
    recall: {
      promptZh: "兴趣班报名表要写爱好。凭记忆，写出你说的那句英文。",
      intentZh: "我享受读书。",
      answer: "I enjoy reading.",
      noteZh: "enjoy 的门只开一扇：只认名字版 reading。"
    },
    huntCaseIds: ["hunt-club-poster"]
  },
  {
    // ── 第五批 · L46 收口课（零新知全复现）：两搭档同台——名字版 + 小垫板；深挖卡认读「都行，默认 doing」──
    id: "lesson-46-two-partners",
    number: 46,
    title: "一句话，两种搭档",
    grammarLabel: "收口 · 名字版 + 小垫板",
    episode: "小美的一天 ㊻",
    scene: "mansion",
    cover: cover24,
    sceneSetupZh: "期末兴趣分享会，小美介绍自己的爱好和暑假打算。",
    dialogueEn: "What do you enjoy?",
    dialogueZh: "同学们围过来问你。",
    intentZh: "我享受读书，我还想去旅行。",
    targetSentence: "I enjoy reading and I want to travel.",
    blocks: [
      { text: "I enjoy reading", role: "名字版搭档（enjoy）" },
      { text: "and", role: "和" },
      { text: "I want to travel", role: "小垫板搭档（want to）" }
    ],
    oneLineRule: "两样搭档同台：enjoy/like 后面跟名字版（reading）；want 门口垫 to（to travel）——两个动词，两种搭法。",
    examples: [
      { en: "I enjoy reading and I want to travel.", zh: "我享受读书，我还想去旅行。" },
      { en: "I like reading.", zh: "我喜欢读书。" },
      { en: "I want to travel.", zh: "我想去旅行。" },
      { en: "She likes drawing and she wants to dance.", zh: "她喜欢画画，她还想去跳舞。" }
    ],
    dialogue: [
      { who: "npc", en: "What do you enjoy?", zh: "同学们围过来问你。" },
      { who: "npc", en: "Any plans for the summer?", zh: "又有人问：暑假有什么打算？" },
      { who: "me", en: "I enjoy reading and I want to travel.", zh: "轮到你说了——你享受读书，还想去旅行。" }
    ],
    contrast: [
      {
        wrong: "I enjoy to read.",
        wrongMark: "to",
        correct: "I enjoy reading.",
        whyZh: "enjoy 的门只开一扇：enjoy reading——to 进不去。对照记：同一块 read，want 门口却要垫板（want to read）。"
      },
      {
        wrong: "I know where is he.",
        wrongMark: "is",
        correct: "I know where he is.",
        whyZh: "旧线温习——话中话要换鞋：where he is。第 35 课学的，收口课再站一次。"
      },
      {
        wrong: "I like read.",
        wrongMark: "read",
        correct: "I like reading.",
        whyZh: "名字版的老规矩：喜欢「做的事」用 reading——第 42 课学的手感。"
      },
      {
        wrong: "I want to traveling.",
        wrongMark: "traveling",
        correct: "I want to travel.",
        whyZh: "垫板 to 后面永远穿原样：to travel——不写 traveling。"
      },
      {
        wrong: "I enjoy reading and I want travel.",
        wrongMark: "want travel",
        correct: "I enjoy reading and I want to travel.",
        whyZh: "want 门口的垫板别丢：want 【to】travel——两个动作中间要缝一块板。"
      },
      {
        wrong: "She like drawing and she want to dance.",
        wrongMark: "like",
        correct: "She likes drawing and she wants to dance.",
        whyZh: "两个动词的主语都是 She（三单），like 加 -s、want 也加 -s：likes / wants。"
      }
    ],
    variants: [
      { label: "肯定", en: "I enjoy reading and I want to travel.", zh: "我享受读书，我还想去旅行。" },
      { label: "否定", en: "I don't enjoy reading.", zh: "我不享受读书。", noteZh: "don't 挡住 enjoy；reading 是名字版，原地不动。" },
      { label: "疑问", en: "Do you enjoy reading?", zh: "你享受读书吗？", noteZh: "问别人：Do 站句首，reading 不动。" }
    ],
    sceneSwings: [
      { sceneZh: "说喜欢读书（名字版搭档）", en: "I like reading.", zh: "我喜欢读书。" },
      { sceneZh: "说想去旅行（小垫板搭档）", en: "I want to travel.", zh: "我想去旅行。" },
      { sceneZh: "说她喜欢画画还想跳舞", en: "She likes drawing and she wants to dance.", zh: "她喜欢画画，她还想去跳舞。" }
    ],
    deepDive: {
      title: "搭档地图 —— 还有一句悄悄话",
      paragraphs: [
        "这一批你认识了两样搭档：名字版（reading）——跟着 like / enjoy 出场；小垫板（to + 原形）——跟着 want 出场，也帮「去干什么」缝句（go to the shop to buy milk）。",
        "「搭档地图」不用背：遇到动词就往门口看一眼——enjoy 的门只开一扇（只认名字版），want 的门口有垫板（认 to）。",
        "悄悄话一句：其实「喜欢」两类搭法都能说——like reading 和 like to read 都对，意思几乎一样。你不用纠结，默认用名字版就行。",
        "至此，你会说「喜欢做、享受做、去做、想做」——动词后面跟什么，你已经有一套自己的手感了。"
      ]
    },
    summary: {
      rule: "两种搭档：like / enjoy + 名字版（reading）；want + 小垫板（to travel）。",
      points: [
        "I enjoy reading. —— 名字版搭档",
        "I want to travel. —— 小垫板搭档",
        "I enjoy reading and I want to travel. —— 两样同台"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我享受读书（名字版搭档）。",
        before: "I enjoy",
        after: ".",
        options: ["reading", "to read", "read"],
        answer: "reading",
        explain: "enjoy 的门只开一扇：只认名字版 reading。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我想去旅行（小垫板搭档）。",
        tokens: ["I", "want", "to", "travel."],
        answer: "I want to travel.",
        explain: "want 门口垫 to：want to travel。"
      },
      {
        kind: "arrange",
        promptZh: "两样同台——你想说：我享受读书，我还想去旅行。",
        tokens: ["I", "enjoy", "reading", "and", "I", "want", "to", "travel."],
        answer: "I enjoy reading and I want to travel.",
        explain: "两个动词两种搭法：enjoy reading + want to travel。"
      },
      {
        // R8 跨课复现：第 35 课（宾从）旧线
        kind: "arrange",
        promptZh: "先复习一小步——第 35 课学过：我知道他在哪。",
        tokens: ["I", "know", "where", "he", "is."],
        answer: "I know where he is.",
        explain: "复现第 35 课：话中话要换鞋。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "enjoy", "to", "read."],
        wrongToken: "to",
        answer: "to",
        correctionZh: "enjoy 的门不认 to：I enjoy reading。",
        explain: "enjoy 只认名字版，to 进不去。"
      },
      {
        // R9 变形/替换：换搭档（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I like reading.」换成 want——「我想读书」，后面的词要怎么搭？",
        replaceBase: "I like reading.",
        replaceTarget: "把 like 换成 want",
        options: ["to read", "reading", "read"],
        answer: "to read",
        explain: "want 门口有垫板：want to read。"
      }
    ],
    practice: [
      {
        // R8 复现（L42 型）
        promptZh: "你想说：我喜欢读书。",
        tokens: ["I", "like", "reading."],
        distractors: ["read"],
        answer: "I like reading."
      },
      {
        // R8 复现（L44 型）
        promptZh: "先复习一小步——第 44 课学过：我去商店买牛奶。",
        tokens: ["I", "go", "to", "the", "shop", "to", "buy", "milk."],
        distractors: ["buying"],
        answer: "I go to the shop to buy milk."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：你享受读书吗？",
        tokens: ["Do", "you", "enjoy", "reading?"],
        distractors: ["enjoys"],
        answer: "Do you enjoy reading?"
      },
      {
        // 全批总句
        promptZh: "全批收官——你想说：我享受读书，我还想去旅行。",
        tokens: ["I", "enjoy", "reading", "and", "I", "want", "to", "travel."],
        distractors: ["traveling"],
        answer: "I enjoy reading and I want to travel."
      }
    ],
    recall: {
      promptZh: "期末兴趣分享会上，同学们围过来问你。凭记忆，写出你那句英文。",
      intentZh: "我享受读书，我还想去旅行。",
      answer: "I enjoy reading and I want to travel.",
      noteZh: "两样搭档同台：enjoy reading + want to travel。"
    },
    huntCaseIds: ["hunt-partner-show"]
  },
  {
    // ── 第六批 · L47 should（情态家族收口）：should 也进「不变词家族」，增量=分寸（建议比 must 轻）──
    id: "lesson-47-should",
    number: 47,
    title: "你应该早点睡",
    grammarLabel: "情态三兄弟 · should",
    episode: "小美的一天 ㊼",
    scene: "mansion",
    cover: cover3,
    sceneSetupZh: "期末复习夜，小美还在熬夜写作业，妈妈端着一杯热牛奶走过来。",
    dialogueEn: "You should sleep early.",
    dialogueZh: "妈妈把牛奶放在桌上，轻声说。",
    intentZh: "我应该早点睡。",
    targetSentence: "You should sleep early.",
    blocks: [
      { text: "You should", role: "你应该（should 也是不变词）" },
      { text: "sleep", role: "睡觉（穿原样）" },
      { text: "early", role: "早一点" }
    ],
    oneLineRule: "should 也进「不变词家族」：can / must / should 从来不变形，后面动词穿原样；不一样的是口气——can 能、must 必须、should 应该（给建议，比 must 轻）。",
    examples: [
      { en: "You should sleep early.", zh: "你应该早点睡。" },
      { en: "She should go to bed.", zh: "她该去睡了。" },
      { en: "Should I rest now?", zh: "我现在该休息一下吗？" },
      { en: "You shouldn't sleep late.", zh: "你不该熬夜。" }
    ],
    dialogue: [
      { who: "npc", en: "It is eleven o'clock.", zh: "妈妈看了眼钟。" },
      { who: "npc", en: "You should sleep early.", zh: "她把牛奶放在桌上：你应该早点睡。" },
      { who: "me", en: "You should sleep early.", zh: "轮到你复述这句建议——应该早点睡。" }
    ],
    contrast: [
      {
        wrong: "You should to sleep early.",
        wrongMark: "to",
        correct: "You should sleep early.",
        whyZh: "should 是家族成员，不垫板——should sleep early。垫板是 want 的待遇（第 15 课 / 第 44 课），别串门。"
      },
      {
        wrong: "She should goes to bed.",
        wrongMark: "goes",
        correct: "She should go to bed.",
        whyZh: "家族里动词穿原样：should go——goes 的三单尾巴要脱下来（must 后面也一样）。"
      },
      {
        wrong: "You must sleep early.",
        wrongMark: null,
        correct: "You should sleep early.",
        bothRight: true,
        whyZh: "两句都对——一句是建议（should，像关心）、一句是必须（must，像命令），口气不同。这课的特权：分寸没有标准答案，看你想怎么说。"
      },
      {
        wrong: "I should to helping her.",
        wrongMark: "to helping",
        correct: "I should help her.",
        whyZh: "should 后面既不垫 to、也不换 helping——动词就穿原样：should help。"
      },
      {
        wrong: "Should I to rest now?",
        wrongMark: "to",
        correct: "Should I rest now?",
        whyZh: "问句把 Should 搬到句首，动词照原样：Should I rest？不垫 to。"
      },
      {
        wrong: "You don't should sleep late.",
        wrongMark: "don't should",
        correct: "You shouldn't sleep late.",
        whyZh: "「不」跟着 should 走，缩成一个词 shouldn't：You shouldn't sleep late。（不是 don't should。）"
      }
    ],
    variants: [
      { label: "肯定", en: "You should sleep early.", zh: "你应该早点睡。" },
      { label: "否定", en: "You shouldn't sleep late.", zh: "你不该熬夜。", noteZh: "not 跟着 should 走，缩成一个词 shouldn't。" },
      { label: "疑问", en: "Should I rest now?", zh: "我现在该休息一下吗？", noteZh: "Should 搬句首，动词照原样。" }
    ],
    sceneSwings: [
      { sceneZh: "说她该去睡了", en: "She should go to bed.", zh: "她该去睡了。" },
      { sceneZh: "说你不该熬夜", en: "You shouldn't sleep late.", zh: "你不该熬夜。" },
      { sceneZh: "问自己现在该不该休息", en: "Should I rest now?", zh: "我现在该休息一下吗？" }
    ],
    deepDive: {
      title: "三兄弟的分寸：can / must / should",
      paragraphs: [
        "家族里现在有三兄弟：can（能）、must（必须）、should（应该）。形态都一样——从来不变形，后面动词穿原样。",
        "不一样的是口气：must 最硬（必须，非做不可）；should 最软（应该，给建议）；can 说的是能力（能）。",
        "同样是「早点睡」：You must sleep early.（必须，像命令）/ You should sleep early.（应该，像关心）——两句语法都对，看你想要哪种口气。",
        "求别人给建议，还能把它搬句首：Should I rest now?（我该休息一下吗？）——把 Should 放最前面就行。"
      ]
    },
    summary: {
      rule: "should 进「不变词家族」：后面动词穿原样；口气是「应该」——给建议，比 must 轻。",
      points: [
        "You should sleep early. —— 应该：建议口气",
        "She should go to bed. —— 家族里动词穿原样",
        "Should I rest now? —— 问句：Should 搬句首"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：你应该早点睡。",
        before: "You",
        after: "sleep early.",
        options: ["should", "should to", "shoulds"],
        answer: "should",
        explain: "should 不垫板、不变形：You should sleep early。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：你应该早点睡。",
        tokens: ["You", "should", "sleep", "early."],
        answer: "You should sleep early.",
        explain: "家族句式：should + 动词原样。"
      },
      {
        // R8 跨课复现：第 16 课（must）原句——family 对照
        kind: "arrange",
        promptZh: "先复习一小步——第 16 课学过：我今天必须完成作业。",
        tokens: ["I", "must", "finish", "my", "homework", "today."],
        answer: "I must finish my homework today.",
        explain: "复现第 16 课：must 也是家族成员，后面穿原样。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["You", "should", "to", "sleep", "early."],
        wrongToken: "to",
        answer: "to",
        correctionZh: "should 不垫板：去掉 to——You should sleep early。",
        explain: "should 是家族成员，不垫板（want 才垫）。"
      },
      {
        // R9 变形/替换：求建议（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「You should sleep early.」想求建议——「我该休息一下吗」，开头要换成什么？",
        replaceBase: "You should sleep early.",
        replaceTarget: "把「你应该早睡」变成「我该休息一下吗」",
        options: ["Should I", "Do I", "Am I"],
        answer: "Should I",
        explain: "求建议把 Should 搬句首：Should I rest now？"
      },
      {
        // R8 跨课复现：第 25 课（三单 -s）的句式混入，抗遗忘
        kind: "arrange",
        promptZh: "先复习一小步——第 25 课学过：他每天喝牛奶。",
        tokens: ["He", "drinks", "milk", "every", "day."],
        answer: "He drinks milk every day.",
        explain: "复现第 25 课：三单动词加 -s。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：你应该早点睡。",
        tokens: ["You", "should", "sleep", "early."],
        distractors: ["should to"],
        answer: "You should sleep early."
      },
      {
        // R06 变体扩量：与 variants 否定卡逐字一致的否定变体题
        promptZh: "你想说：你不该熬夜。",
        tokens: ["You", "shouldn't", "sleep", "late."],
        distractors: ["don't should"],
        answer: "You shouldn't sleep late."
      },
      {
        // R8 跨课复现（L14 can）：家族第三员收口
        promptZh: "先复习一小步——第 14 课学过：我会游泳。",
        tokens: ["I", "can", "swim."],
        distractors: ["can to"],
        answer: "I can swim."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：我现在该休息一下吗？",
        tokens: ["Should", "I", "rest", "now?"],
        distractors: ["Do"],
        answer: "Should I rest now?"
      }
    ],
    recall: {
      promptZh: "期末复习夜，妈妈让你早点睡。凭记忆，写出那句建议的英文。",
      intentZh: "你应该早点睡。",
      answer: "You should sleep early.",
      noteZh: "should 进家族：后面动词穿原样；口气是「应该」。"
    },
    huntCaseIds: ["hunt-advice-note"]
  },
  {
    // ── 第六批 · L48 if 真实条件句（负迁移核心课）：if 里说现在（It rains），主句说将来（will stay）──
    id: "lesson-48-if-rain",
    number: 48,
    title: "如果下雨就不去",
    grammarLabel: "条件句 · if 里说现在",
    episode: "小美的一天 ㊽",
    scene: "city",
    cover: cover8,
    sceneSetupZh: "周末早晨，小美趴在窗边看天色，妈妈在厨房问她今天怎么安排。",
    dialogueEn: "What will you do today?",
    dialogueZh: "妈妈在厨房问她。",
    intentZh: "如果下雨，我就待在家。",
    targetSentence: "If it rains, I will stay at home.",
    blocks: [
      { text: "If it rains", role: "如果下雨（说现在）" },
      { text: "I will stay", role: "我就待着（说将来）" },
      { text: "at home", role: "在家" }
    ],
    oneLineRule: "说「如果…就…」：if 里说现在（If it rains），主句说将来（I will stay）——if 里不用 will，「如果的路面用现在时铺」。",
    examples: [
      { en: "If it rains, I will stay at home.", zh: "如果下雨，我就待在家。" },
      { en: "If it rains, I won't go out.", zh: "如果下雨，我就不出门。" },
      { en: "Will you go out if it rains?", zh: "如果下雨，你还出门吗？" },
      { en: "If it is sunny, we will play outside.", zh: "如果天晴，我们就去外面玩。" }
    ],
    dialogue: [
      { who: "npc", en: "What will you do today?", zh: "妈妈在厨房问她。" },
      { who: "npc", en: "The sky looks dark.", zh: "她看了眼窗外：天阴着呢。" },
      { who: "me", en: "If it rains, I will stay at home.", zh: "轮到你说了——如果下雨就待在家。" }
    ],
    contrast: [
      {
        wrong: "If it will rain, I will stay at home.",
        wrongMark: "will rain",
        correct: "If it rains, I will stay at home.",
        whyZh: "if 里说现在，不用 will：If it rains——「如果的路面用现在时铺」。中文说「如果**会**下雨」，英语的 if 里不带 will。"
      },
      {
        wrong: "If it rains, I stay at home.",
        wrongMark: "stay",
        correct: "If it rains, I will stay at home.",
        whyZh: "「就…」说的是将来，要带上 will：I will stay——前半句现在，后半句将来。"
      },
      {
        wrong: "Because it rains, I stay at home.",
        wrongMark: null,
        correct: "If it rains, I will stay at home.",
        bothRight: true,
        whyZh: "两句都对——if 管「还没发生」（如果下雨，就待着）；because 管「已经这样」（因为下雨，所以待着）。两套连词，各管一摊。"
      },
      {
        wrong: "If it rain, I will stay.",
        wrongMark: "rain",
        correct: "If it rains, I will stay.",
        whyZh: "it 是三单，动词加 -s：it rains——if 里的小句子也要站直。"
      },
      {
        wrong: "If rains, I will stay.",
        wrongMark: null,
        correct: "If it rains, I will stay.",
        whyZh: "if 里要有完整的小句子（谁 + 动作）：it rains——主语 it 不能丢。"
      },
      {
        wrong: "If it rains, I will staying at home.",
        wrongMark: "staying",
        correct: "If it rains, I will stay at home.",
        whyZh: "will 后面穿原样：will stay——staying 的 -ing 要脱下来。"
      }
    ],
    variants: [
      { label: "肯定", en: "If it rains, I will stay at home.", zh: "如果下雨，我就待在家。" },
      { label: "否定", en: "If it rains, I won't go out.", zh: "如果下雨，我就不出门。", noteZh: "won't = will not：将来的「不」。" },
      { label: "疑问", en: "Will you go out if it rains?", zh: "如果下雨，你还出门吗？", noteZh: "条件句也可以挂后面：Will you go out if it rains？" }
    ],
    sceneSwings: [
      { sceneZh: "说不下雨就出去玩", en: "If it is sunny, we will play outside.", zh: "如果天晴，我们就去外面玩。" },
      { sceneZh: "说下雨就不出门", en: "If it rains, I won't go out.", zh: "如果下雨，我就不出门。" },
      { sceneZh: "问对方下雨还出不出门", en: "Will you go out if it rains?", zh: "如果下雨，你还出门吗？" }
    ],
    deepDive: {
      title: "if 里说现在，主句说将来",
      paragraphs: [
        "中文说「如果明天**会**下雨，我就不去」，那个「会」字会跟着跑进英语——\*If it will rain。不对。英语的 if 里说现在：If it rains。",
        "为什么？if 里的「下雨」是假设；假设还没发生，就按「现在的事实」来铺——这是英语的老习惯，记住句子形状就行：if + it rains（现在），I will stay（将来）。",
        "「如果的路面，用现在时铺」——if 是路面，铺好了，主句的车（will）才开得过去。",
        "和 because 对照着记：Because it rains, I stay.（因为下雨，所以我待着——事情已经在发生）/ If it rains, I will stay.（如果下雨就待着——还没发生）。if 管「如果」，because 管「因为」。"
      ]
    },
    summary: {
      rule: "如果…就…：if 里说现在（If it rains），主句说将来（I will stay）——if 里不用 will。",
      points: [
        "If it rains, I will stay at home. —— 现在 + 将来",
        "If it rains, I won't go out. —— 将来的「不」用 won't",
        "Will you go out if it rains? —— 条件句挂后面也行"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：如果下雨，我就待在家。",
        before: "If it",
        after: ", I will stay at home.",
        options: ["rains", "will rain", "raining"],
        answer: "rains",
        explain: "if 里说现在：it rains——不用 will。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：如果下雨，我就待在家。",
        tokens: ["If", "it", "rains,", "I", "will", "stay", "at", "home."],
        answer: "If it rains, I will stay at home.",
        explain: "前半现在（it rains）、后半将来（will stay）。"
      },
      {
        // R8 跨课复现：第 12 课（will）原句——把天气句装进 if
        kind: "arrange",
        promptZh: "先复习一小步——第 12 课学过：明天会下雨。",
        tokens: ["It", "will", "rain."],
        answer: "It will rain.",
        explain: "复现第 12 课：will + 原形。放进 if 里它要变：If it rains…"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["If", "it", "will", "rain,", "I", "will", "stay."],
        wrongToken: "will",
        answer: "will",
        correctionZh: "if 里说现在：去掉第一个 will——If it rains, I will stay。",
        explain: "if 里不用 will。"
      },
      {
        // R8 跨课复现：第 20 课（because）句式对照
        kind: "arrange",
        promptZh: "再对照一句——第 20 课学过：因为下雨，我待在家。",
        tokens: ["Because", "it", "rains,", "I", "stay", "at", "home."],
        answer: "Because it rains, I stay at home.",
        explain: "复现第 20 课：because 管「已经这样」——和 if 管「如果」对撞记。"
      },
      {
        // R9 变形/替换：把陈述句改问句（条件句挂后面）
        kind: "replace",
        promptZh: "句子变身：「If it rains, I will stay at home.」想问对方——「如果下雨，你还出门吗」，最前面换成什么？",
        replaceBase: "If it rains, I will stay at home.",
        replaceTarget: "把「我就待在家」换成「你还出门吗」",
        options: ["Will you go out", "Do you go out", "Are you go out"],
        answer: "Will you go out",
        explain: "问将来的打算用 Will 开头：Will you go out if it rains？"
      }
    ],
    practice: [
      {
        promptZh: "你想说：如果下雨，我就待在家。",
        tokens: ["If", "it", "rains,", "I", "will", "stay", "at", "home."],
        distractors: ["will rains"],
        answer: "If it rains, I will stay at home."
      },
      {
        // R06 变体扩量：与 variants 否定卡逐字一致的否定变体题
        promptZh: "你想说：如果下雨，我就不出门。",
        tokens: ["If", "it", "rains,", "I", "won't", "go", "out."],
        distractors: ["will not go out"],
        answer: "If it rains, I won't go out."
      },
      {
        // R8 跨课复现（L12）：天气原句
        promptZh: "先复习一小步——第 12 课学过：明天会下雨。",
        tokens: ["It", "will", "rain."],
        distractors: ["rains"],
        answer: "It will rain."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：如果下雨，你还出门吗？",
        tokens: ["Will", "you", "go", "out", "if", "it", "rains?"],
        distractors: ["Do"],
        answer: "Will you go out if it rains?"
      }
    ],
    recall: {
      promptZh: "周末早晨看天色，妈妈问你今天怎么安排。凭记忆，写出你那句英文。",
      intentZh: "如果下雨，我就待在家。",
      answer: "If it rains, I will stay at home.",
      noteZh: "if 里说现在（rains），主句说将来（will stay）。"
    },
    huntCaseIds: ["hunt-weather-plan"]
  },
  {
    // ── 第六批 · L49 收口课（零新知全复现）：建议 + 条件同台——You should… if…──
    id: "lesson-49-advice-if",
    number: 49,
    title: "你应该试试",
    grammarLabel: "收口 · 建议 + 条件",
    episode: "小美的一天 ㊾",
    scene: "campus",
    cover: cover15,
    sceneSetupZh: "出门前妈妈叮嘱小美带上伞，到学校她把这句提醒转告给同学。",
    dialogueEn: "Any tips for the weekend?",
    dialogueZh: "同学在班群里问。",
    intentZh: "如果下雨，你应该带把伞。",
    targetSentence: "You should take an umbrella if it rains.",
    blocks: [
      { text: "You should take", role: "你应该带（建议先走）" },
      { text: "an umbrella", role: "一把伞" },
      { text: "if it rains", role: "如果下雨（条件挂后面）" }
    ],
    oneLineRule: "建议加条件：主建议用 should（You should take an umbrella），条件用 if 挂后面（if it rains）——should 不垫板、if 里说现在。",
    examples: [
      { en: "You should take an umbrella if it rains.", zh: "如果下雨，你应该带把伞。" },
      { en: "You shouldn't go out if it rains.", zh: "如果下雨，你不该出门。" },
      { en: "Should I take an umbrella if it rains?", zh: "如果下雨，我该带伞吗？" },
      { en: "She should sleep early if she is tired.", zh: "如果她累了，应该早点睡。" }
    ],
    dialogue: [
      { who: "npc", en: "Any tips for the weekend?", zh: "同学在班群里问。" },
      { who: "npc", en: "It looks like rain.", zh: "有人补了一句：看着要下雨。" },
      { who: "me", en: "You should take an umbrella if it rains.", zh: "轮到你说了——如果下雨，应该带把伞。" }
    ],
    contrast: [
      {
        wrong: "You should to take an umbrella if it rains.",
        wrongMark: "to",
        correct: "You should take an umbrella if it rains.",
        whyZh: "should 是家族成员，不垫板——should take（第 47 课学过）。"
      },
      {
        wrong: "If it will rain, you should take an umbrella.",
        wrongMark: "will rain",
        correct: "If it rains, you should take an umbrella.",
        whyZh: "if 里说现在，不用 will：If it rains（第 48 课学过）——「如果的路面用现在时铺」。"
      },
      {
        wrong: "You must take an umbrella if it rains.",
        wrongMark: null,
        correct: "You should take an umbrella if it rains.",
        bothRight: true,
        whyZh: "两句都对——一句是建议（应该带伞）、一句是必须（必须带伞），口气不同。分寸没有标准答案，看你想怎么说。"
      },
      {
        wrong: "Should I to go now?",
        wrongMark: "to",
        correct: "Should I go now?",
        whyZh: "问句里 should 也不垫板：Should I go now？——Should 搬句首，动词照原样。"
      },
      {
        wrong: "If it rain, you should stay.",
        wrongMark: "rain",
        correct: "If it rains, you should stay.",
        whyZh: "it 是三单，动词加 -s：it rains——if 里的小句子也要站直。"
      },
      {
        wrong: "You shouldn't to worry.",
        wrongMark: "to",
        correct: "You shouldn't worry.",
        whyZh: "否定形也不垫板：shouldn't worry——「不」跟着 should 走，动词照原样。"
      }
    ],
    variants: [
      { label: "肯定", en: "You should take an umbrella if it rains.", zh: "如果下雨，你应该带把伞。" },
      { label: "否定", en: "You shouldn't go out if it rains.", zh: "如果下雨，你不该出门。", noteZh: "not 跟 should 走：shouldn't；if 尾巴照挂。" },
      { label: "疑问", en: "Should I take an umbrella if it rains?", zh: "如果下雨，我该带伞吗？", noteZh: "Should 搬句首，if 尾巴照挂。" }
    ],
    sceneSwings: [
      { sceneZh: "说下雨不该出门", en: "You shouldn't go out if it rains.", zh: "如果下雨，你不该出门。" },
      { sceneZh: "问下雨该不该带伞", en: "Should I take an umbrella if it rains?", zh: "如果下雨，我该带伞吗？" },
      { sceneZh: "说她累了就该早睡", en: "She should sleep early if she is tired.", zh: "如果她累了，应该早点睡。" }
    ],
    deepDive: {
      title: "建议 + 条件：一句话办两件事",
      paragraphs: [
        "这一批你学了两样工具：should（给建议）和 if（说条件）。现在它们同台：You should take an umbrella if it rains。",
        "组装顺序有讲究：主建议走在前面（You should take an umbrella），条件用 if 挂在后面（if it rains）——先说你要干嘛，再补一句「什么情况下」。",
        "两个规矩同时在场：should 后面动词穿原样（不垫板）；if 里说现在（不用 will）。哪边松了都不对。",
        "回顾这一批的三兄弟加条件句：can 能 / must 必须 / should 应该；if 管「如果」、because 管「因为」。日常对话里给建议、说条件，你现在都能接住了。"
      ]
    },
    summary: {
      rule: "建议 + 条件：主建议 You should…（不垫板）+ 条件 if…（说现在）挂后面。",
      points: [
        "You should take an umbrella if it rains. —— 建议先走，条件挂后",
        "You shouldn't go out if it rains. —— 否定：not 跟 should",
        "Should I take an umbrella if it rains? —— 问句：Should 搬句首"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：如果下雨，你应该带把伞。",
        before: "You should",
        after: "an umbrella if it rains.",
        options: ["take", "to take", "taking"],
        answer: "take",
        explain: "should 后面动词穿原样：should take。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：如果下雨，你应该带把伞。",
        tokens: ["You", "should", "take", "an", "umbrella", "if", "it", "rains."],
        answer: "You should take an umbrella if it rains.",
        explain: "建议先走（should take）、条件挂后（if it rains）。"
      },
      {
        // R8 跨课复现：第 47 课（should）原句
        kind: "arrange",
        promptZh: "先复习一小步——第 47 课学过：你应该早点睡。",
        tokens: ["You", "should", "sleep", "early."],
        answer: "You should sleep early.",
        explain: "复现第 47 课：should 后面穿原样。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["You", "should", "to", "take", "an", "umbrella."],
        wrongToken: "to",
        answer: "to",
        correctionZh: "should 不垫板：去掉 to——You should take an umbrella。",
        explain: "should 是家族成员，不垫板。"
      },
      {
        // R8 跨课复现：第 48 课（if）原句
        kind: "arrange",
        promptZh: "再复习一句——第 48 课学过：如果下雨，我就待在家。",
        tokens: ["If", "it", "rains,", "I", "will", "stay", "at", "home."],
        answer: "If it rains, I will stay at home.",
        explain: "复现第 48 课：if 里说现在，主句说将来。"
      },
      {
        // R9 变形/替换：求建议（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「You should take an umbrella if it rains.」想问对方——「如果下雨，我该带伞吗」，最前面换成什么？",
        replaceBase: "You should take an umbrella if it rains.",
        replaceTarget: "把「你应该带」变成「我该带吗」",
        options: ["Should I take", "Do I take", "Am I take"],
        answer: "Should I take",
        explain: "求建议把 Should 搬句首：Should I take an umbrella if it rains？"
      }
    ],
    practice: [
      {
        // R8 复现（L47 型）
        promptZh: "你想说：你应该早点睡。",
        tokens: ["You", "should", "sleep", "early."],
        distractors: ["should to"],
        answer: "You should sleep early."
      },
      {
        // R8 复现（L48 型）
        promptZh: "先复习一小步——第 48 课学过：如果下雨，我就待在家。",
        tokens: ["If", "it", "rains,", "I", "will", "stay", "at", "home."],
        distractors: ["will rains"],
        answer: "If it rains, I will stay at home."
      },
      {
        // R06 变体扩量：与 variants 否定卡逐字一致的否定变体题
        promptZh: "你想说：如果下雨，你不该出门。",
        tokens: ["You", "shouldn't", "go", "out", "if", "it", "rains."],
        distractors: ["don't should"],
        answer: "You shouldn't go out if it rains."
      },
      {
        // 全批总句
        promptZh: "全批收官——你想说：如果下雨，你应该带把伞。",
        tokens: ["You", "should", "take", "an", "umbrella", "if", "it", "rains."],
        distractors: ["to take"],
        answer: "You should take an umbrella if it rains."
      }
    ],
    recall: {
      promptZh: "出门前妈妈叮嘱你带伞，到学校你把这句提醒转告给同学。凭记忆，写出那句英文。",
      intentZh: "如果下雨，你应该带把伞。",
      answer: "You should take an umbrella if it rains.",
      noteZh: "建议先走（should take），条件挂后（if it rains）。"
    },
    huntCaseIds: ["hunt-weekend-tip"]
  }
];

export const GRAMMAR_LESSON_BY_ID: ReadonlyMap<string, GrammarLesson> = new Map(
  grammarLessons.map((lesson) => [lesson.id, lesson])
);
