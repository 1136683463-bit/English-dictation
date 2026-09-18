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
import cover25 from "../assets/lessons/lesson-25.jpg";
import cover26 from "../assets/lessons/lesson-26.jpg";
import cover27 from "../assets/lessons/lesson-27.jpg";
import cover28 from "../assets/lessons/lesson-28.jpg";
import cover29 from "../assets/lessons/lesson-29.jpg";
import cover30 from "../assets/lessons/lesson-30.jpg";
import cover31 from "../assets/lessons/lesson-31.jpg";
import cover32 from "../assets/lessons/lesson-32.jpg";
import cover33 from "../assets/lessons/lesson-33.jpg";
import cover34 from "../assets/lessons/lesson-34.jpg";
import cover35 from "../assets/lessons/lesson-35.jpg";
import cover36 from "../assets/lessons/lesson-36.jpg";
import cover37 from "../assets/lessons/lesson-37.jpg";
import cover38 from "../assets/lessons/lesson-38.jpg";
import cover39 from "../assets/lessons/lesson-39.jpg";
import cover40 from "../assets/lessons/lesson-40.jpg";
import cover41 from "../assets/lessons/lesson-41.jpg";
import cover42 from "../assets/lessons/lesson-42.jpg";
import cover43 from "../assets/lessons/lesson-43.jpg";
import cover44 from "../assets/lessons/lesson-44.jpg";
import cover45 from "../assets/lessons/lesson-45.jpg";
import cover46 from "../assets/lessons/lesson-46.jpg";
import cover47 from "../assets/lessons/lesson-47.jpg";
import cover48 from "../assets/lessons/lesson-48.jpg";
import cover49 from "../assets/lessons/lesson-49.jpg";

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
    cover: cover25,
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
    cover: cover26,
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
    cover: cover27,
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
    cover: cover28,
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
    cover: cover29,
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
    cover: cover30,
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
    cover: cover31,
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
    cover: cover32,
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
    cover: cover33,
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
    cover: cover34,
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
    cover: cover35,
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
    cover: cover36,
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
    cover: cover37,
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
    cover: cover38,
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
    cover: cover39,
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
    cover: cover40,
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
    cover: cover41,
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
    cover: cover42,
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
    cover: cover43,
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
    cover: cover44,
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
    cover: cover45,
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
    cover: cover46,
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
    cover: cover47,
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
    cover: cover48,
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
    cover: cover49,
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
  },
  {
    // ── 第七批 · L50 被动本体（幕后句）：谁做的不重要——把做过版借到 be 身边 ──
    id: "lesson-50-passive",
    number: 50,
    title: "杯子被摔了",
    grammarLabel: "幕后句 · 谁做的不重要",
    episode: "小美的一天 ㊿",
    scene: "campus",
    cover: cover16,
    sceneSetupZh: "课间回到座位，小美发现桌上的杯子摔在地上，跟同桌说起这件事。",
    dialogueEn: "What happened to your cup?",
    dialogueZh: "同桌看着地上的杯子问你。",
    intentZh: "我的杯子被摔了。",
    targetSentence: "My cup was broken.",
    blocks: [
      { text: "My cup", role: "我的杯子（站台上）" },
      { text: "was", role: "过去版 be（新搭档）" },
      { text: "broken", role: "摔坏（做过版）" }
    ],
    oneLineRule: "谁做的不重要时，把「做过版」借到 be 身边：My cup was broken——杯子站台上，做事的人退到幕后（跟 have 身边是同一件外套）。",
    examples: [
      { en: "My cup was broken.", zh: "我的杯子被摔了。" },
      { en: "My key was lost.", zh: "我的钥匙丢了。" },
      { en: "The window was broken.", zh: "窗户被弄坏了。" },
      { en: "The picture was finished.", zh: "画被画完了。" }
    ],
    dialogue: [
      { who: "npc", en: "What happened to your cup?", zh: "同桌看着地上的杯子问你。" },
      { who: "npc", en: "It is on the floor now.", zh: "她补了一句：它现在躺在地上。" },
      { who: "me", en: "My cup was broken.", zh: "轮到你说了——杯子被摔了。" }
    ],
    contrast: [
      {
        wrong: "My cup was break.",
        wrongMark: "break",
        correct: "My cup was broken.",
        whyZh: "be 身边要穿「做过版」——不能拿原形充数：was broken。老规矩：have 身边穿什么，be 身边就穿什么。"
      },
      {
        wrong: "My cup was broke.",
        wrongMark: "broke",
        correct: "My cup was broken.",
        whyZh: "昨天版也不能充数：break → broke → broken 是三件外套——broke 是昨天版，be 身边要穿做过版 broken。"
      },
      {
        wrong: "My cup broken.",
        wrongMark: null,
        correct: "My cup was broken.",
        whyZh: "少了搭档！做过版不能独自站台——be（was）是它的新搭档，丢了句子就塌了。"
      },
      {
        wrong: "My cup were broken.",
        wrongMark: "were",
        correct: "My cup was broken.",
        whyZh: "一个杯子用 was——were 是一群人的搭档（复数专用），这里请不动它。"
      },
      {
        wrong: "Someone broke my cup.",
        wrongMark: null,
        correct: "My cup was broken.",
        bothRight: true,
        whyZh: "两句都对——一句说「有人摔了我的杯子」（谁干的站台上）；一句说「我的杯子被摔了」（杯子站台上）。看你想让谁当主角。"
      },
      {
        wrong: "I have broken my cup.",
        wrongMark: null,
        correct: "My cup was broken.",
        bothRight: true,
        whyZh: "两句也都对——同一件做过版外套：左边跟 have（我弄坏了），右边跟 be（杯子被弄坏了）。外套同一件，换了搭档。"
      }
    ],
    variants: [
      { label: "肯定", en: "My cup was broken.", zh: "我的杯子被摔了。" },
      { label: "否定", en: "My cup wasn't broken.", zh: "我的杯子没被摔。", noteZh: "not 跟 was 走：wasn't。" },
      { label: "疑问", en: "Was your cup broken?", zh: "你的杯子被摔了吗？", noteZh: "Was 搬句首——is/are 的问句搬法照旧。" }
    ],
    sceneSwings: [
      { sceneZh: "说钥匙丢了", en: "My key was lost.", zh: "我的钥匙丢了。" },
      { sceneZh: "说窗户被弄坏了", en: "The window was broken.", zh: "窗户被弄坏了。" },
      { sceneZh: "说画被画完了", en: "The picture was finished.", zh: "画被画完了。" }
    ],
    deepDive: {
      title: "同一件外套，两个搭档",
      paragraphs: [
        "第 21 课你认识过「做过版」：它是动词的第三件外套（watch→watched、do→done、break→broken）。那件外套一直跟 have 出场：I have done my homework（我写完了）。",
        "今天它换了新搭档：be。My cup was broken（杯子被摔了）——谁摔的不重要，杯子这件事站台上。have 身边说「我干的」，be 身边说「事发生了」。",
        "怎么分？看你想让谁当主角：做事的人重要，用主动（Someone broke my cup.）；事重要、人不重要，用幕后句（My cup was broken.）。",
        "be 的两个班岗也复习一下：be + 动词ing 是「正在做」（I am drawing）；be + 做过版是「被做过」（My cup was broken）。同一件工装，看它后面跟的是什么。"
      ]
    },
    summary: {
      rule: "谁做的不重要——把做过版借到 be 身边：My cup was broken。",
      points: [
        "My cup was broken. —— 杯子站台上，人退幕后",
        "Someone broke my cup. —— 也可以让做事的人站台上（都对）",
        "I have broken my cup. —— 同一件外套、两个搭档（have / be）"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我的杯子被摔了。",
        before: "My cup",
        after: "broken.",
        options: ["was", "were", "am"],
        answer: "was",
        explain: "一个杯子、过去的事：was broken。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我的杯子被摔了。",
        tokens: ["My", "cup", "was", "broken."],
        answer: "My cup was broken.",
        explain: "be 搭档（was）+ 做过版（broken）——谁摔的不重要。"
      },
      {
        // R8 跨课复现：第 21 课（have + 做过版）原句
        kind: "arrange",
        promptZh: "先复习一小步——第 21 课学过：我已经写完作业了。",
        tokens: ["I", "have", "done", "my", "homework."],
        answer: "I have done my homework.",
        explain: "复现第 21 课：做过版跟 have 出场。今天它还要跟 be 出场。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["My", "cup", "was", "break."],
        wrongToken: "break.",
        answer: "break.",
        correctionZh: "be 身边要穿做过版：was broken。",
        explain: "原形不能站在 be 身边——穿做过版。"
      },
      {
        // R8 跨课复现：第 13 课（be + -ing）——be 的另一班岗
        kind: "arrange",
        promptZh: "再对照一句——第 13 课学过：我正在画一幅画。",
        tokens: ["I", "am", "drawing", "a", "picture."],
        answer: "I am drawing a picture.",
        explain: "复现第 13 课：be + 动词ing 是「正在做」；be + 做过版是「被做过」——两班岗。"
      },
      {
        // R9 变形/替换：have 搭档换 be 搭档（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子换搭档：「I have broken my cup.」想说「杯子被摔了」（人退幕后），开头要换成什么？",
        replaceBase: "I have broken my cup.",
        replaceTarget: "把「我弄坏了杯子」换成「杯子被摔了」（人退幕后）",
        options: ["My cup was", "My cup have", "My cup is"],
        answer: "My cup was",
        explain: "人退幕后、事站台上：My cup was broken——同一个 broken，搭档从 have 换成 was。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我的杯子被摔了。",
        tokens: ["My", "cup", "was", "broken."],
        distractors: ["were"],
        answer: "My cup was broken."
      },
      {
        // R06 变体扩量：与 variants 否定卡逐字一致的否定变体题
        promptZh: "你想说：我的杯子没被摔。",
        tokens: ["My", "cup", "wasn't", "broken."],
        distractors: ["weren't"],
        answer: "My cup wasn't broken."
      },
      {
        // R8 跨课复现（L23）：同形分词
        promptZh: "先复习一小步——第 23 课学过：我丢了钥匙。",
        tokens: ["I", "have", "lost", "my", "key."],
        distractors: ["losed"],
        answer: "I have lost my key."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：你的杯子被摔了吗？",
        tokens: ["Was", "your", "cup", "broken?"],
        distractors: ["Did"],
        answer: "Was your cup broken?"
      }
    ],
    recall: {
      promptZh: "课间回到座位，发现杯子躺在地上。凭记忆，写出你跟同桌说的那句英文。",
      intentZh: "我的杯子被摔了。",
      answer: "My cup was broken.",
      noteZh: "谁做的不重要：事站台上（My cup was broken）——做过版跟 be 出场。"
    },
    huntCaseIds: ["hunt-broken-window"]
  },
  {
    // ── 第七批 · L51 复数搭档（were）：主语变多，be 换 were 搭档——were 薄区正式教学 ──
    id: "lesson-51-plural",
    number: 51,
    title: "教室被打扫了",
    grammarLabel: "幕后句 · 复数搭档",
    episode: "小美的一天 五十一",
    scene: "campus",
    cover: cover23,
    sceneSetupZh: "周一早上到教室，发现窗户和桌子都被擦得干干净净，值日生刚走。",
    dialogueEn: "Who cleaned the room?",
    dialogueZh: "同桌看着干净的教室问你。",
    intentZh: "窗户被打扫了。",
    targetSentence: "The windows were cleaned yesterday.",
    blocks: [
      { text: "The windows", role: "那些窗户（一群，复数）" },
      { text: "were", role: "过去版 be（复数搭档）" },
      { text: "cleaned", role: "打扫（做过版）" }
    ],
    oneLineRule: "幕后句的搭档也要配对：一个用 was、一群用 were——The windows were cleaned（窗户们被打扫了）。",
    examples: [
      { en: "The windows were cleaned yesterday.", zh: "窗户昨天被打扫了。" },
      { en: "The desks were cleaned too.", zh: "桌子也被擦了。" },
      { en: "The cups were washed.", zh: "杯子们被洗了。" },
      { en: "The pictures were finished.", zh: "画们被画完了。" }
    ],
    dialogue: [
      { who: "npc", en: "Who cleaned the room?", zh: "同桌看着干净的教室问你。" },
      { who: "npc", en: "Everything looks new.", zh: "她补了一句：一切看着像新的。" },
      { who: "me", en: "The windows were cleaned yesterday.", zh: "轮到你说了——窗户（们）昨天被打扫了。" }
    ],
    contrast: [
      {
        wrong: "The windows was cleaned.",
        wrongMark: "was",
        correct: "The windows were cleaned.",
        whyZh: "主语 The windows 是一群（复数）——用 were 搭档。一个 was、一群 were，配对不能错。"
      },
      {
        wrong: "The window were cleaned.",
        wrongMark: "were",
        correct: "The window was cleaned.",
        whyZh: "反过来的错也一样：一个窗户用 was——were 请不动（它是复数专用）。"
      },
      {
        wrong: "The windows was clean yesterday.",
        wrongMark: "clean",
        correct: "The windows were cleaned yesterday.",
        whyZh: "两个坑：搭档要配对（were），动词要穿做过版（cleaned）——clean 说「干净的」这个状态，cleaned 说「被打扫过」这件事。"
      },
      {
        wrong: "Was the windows cleaned?",
        wrongMark: "Was",
        correct: "Were the windows cleaned?",
        whyZh: "问句里搭档也要配对：一群窗户用 Were 开头。"
      },
      {
        wrong: "Someone cleaned the windows.",
        wrongMark: null,
        correct: "The windows were cleaned.",
        bothRight: true,
        whyZh: "两句都对——一句说「有人擦了窗户」（谁干的站台上）；一句说「窗户被打扫了」（窗户站台上）。看你想让谁当主角。"
      },
      {
        wrong: "The window was cleaned yesterday.",
        wrongMark: null,
        correct: "The windows were cleaned yesterday.",
        bothRight: true,
        whyZh: "两句也都对——一扇窗户用 was，好几扇窗户用 were。搭档跟着主语的人数走（这是本课的新手感）。"
      }
    ],
    variants: [
      { label: "肯定", en: "The windows were cleaned yesterday.", zh: "窗户昨天被打扫了。" },
      { label: "否定", en: "The windows weren't cleaned.", zh: "窗户没被打扫。", noteZh: "not 跟 were 走：weren't。" },
      { label: "疑问", en: "Were the windows cleaned?", zh: "窗户被打扫了吗？", noteZh: "Were 搬句首——一群的搭档。" }
    ],
    sceneSwings: [
      { sceneZh: "说桌子也被擦了", en: "The desks were cleaned too.", zh: "桌子也被擦了。" },
      { sceneZh: "说杯子们被洗了", en: "The cups were washed.", zh: "杯子们被洗了。" },
      { sceneZh: "说画们被画完了", en: "The pictures were finished.", zh: "画们被画完了。" }
    ],
    deepDive: {
      title: "一个用 was、一群用 were",
      paragraphs: [
        "你已经见过 was 和 were 这对搭档：I was drawing（我在画，单数）、They were playing（他们在玩，一群）——第 34 课学的。",
        "幕后句里它们照样配对：一个东西站台上用 was（The window was cleaned）、一群东西站台上用 were（The windows were cleaned）。",
        "怎么记？看台上有几个人：一个人用 was、一伙人用 were——和 am/is/are 的分工一一对应（am/is 对 was，are 对 were）。",
        "顺便对照上节课：My cup was broken（一个杯子）→ The cups were washed（一群杯子）——同一件做过版外套，搭档跟着人数换。"
      ]
    },
    summary: {
      rule: "幕后句搭档要配对：一个用 was、一群用 were——The windows were cleaned。",
      points: [
        "The window was cleaned. —— 一扇：was",
        "The windows were cleaned. —— 一群：were",
        "Were the windows cleaned? —— 问句也配对"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：窗户（们）被打扫了。",
        before: "The windows",
        after: "cleaned.",
        options: ["were", "was", "am"],
        answer: "were",
        explain: "The windows 是一群，用 were 搭档。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：窗户（们）昨天被打扫了。",
        tokens: ["The", "windows", "were", "cleaned", "yesterday."],
        answer: "The windows were cleaned yesterday.",
        explain: "复数搭档（were）+ 做过版（cleaned）。"
      },
      {
        // R8 跨课复现：第 50 课（单数对照）
        kind: "arrange",
        promptZh: "先复习一小步——第 50 课学过：我的杯子被摔了。",
        tokens: ["My", "cup", "was", "broken."],
        answer: "My cup was broken.",
        explain: "复现第 50 课：一个东西用 was。这节课看一群的。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["The", "windows", "was", "cleaned."],
        wrongToken: "was",
        answer: "was",
        correctionZh: "一群窗户用 were：The windows were cleaned。",
        explain: "一个 was、一群 were——搭档要配对。"
      },
      {
        // R8 跨课复现：第 19 课（were 先例）
        kind: "arrange",
        promptZh: "再对照一句——第 19 课学过：起风了，但我们很开心。",
        tokens: ["It", "was", "windy,", "but", "we", "were", "happy."],
        answer: "It was windy, but we were happy.",
        explain: "复现第 19 课：we 是一伙的，用 were——和幕后句一个道理。"
      },
      {
        // R9 变形/替换：单数换复数（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子换人数：「The window was cleaned.」教室里有好几扇窗户，be 要换成什么？",
        replaceBase: "The window was cleaned.",
        replaceTarget: "一扇换成一群（The windows）",
        options: ["were", "was", "is"],
        answer: "were",
        explain: "一扇 was、一群 were：The windows were cleaned。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：窗户（们）被打扫了。",
        tokens: ["The", "windows", "were", "cleaned."],
        distractors: ["was"],
        answer: "The windows were cleaned."
      },
      {
        // R06 变体扩量：与 variants 否定卡逐字一致的否定变体题
        promptZh: "你想说：窗户没被打扫。",
        tokens: ["The", "windows", "weren't", "cleaned."],
        distractors: ["wasn't"],
        answer: "The windows weren't cleaned."
      },
      {
        // R8 跨课复现（L34）：were doing 先例
        promptZh: "先复习一小步——第 34 课学过：他们当时正在踢足球。",
        tokens: ["They", "were", "playing", "football."],
        distractors: ["was"],
        answer: "They were playing football."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：窗户被打扫了吗？",
        tokens: ["Were", "the", "windows", "cleaned?"],
        distractors: ["Was"],
        answer: "Were the windows cleaned?"
      }
    ],
    recall: {
      promptZh: "周一早上，同桌问谁打扫了教室。凭记忆，写出你跟她说的一句。",
      intentZh: "窗户（们）昨天被打扫了。",
      answer: "The windows were cleaned yesterday.",
      noteZh: "一群东西用 were 搭档：The windows were cleaned。"
    },
    huntCaseIds: ["hunt-clean-classroom"]
  },
  {
    // ── 第七批 · L52 by 施动者：想说谁做的，就垫 by（把幕后的人拉出来补一句）──
    id: "lesson-52-by-agent",
    number: 52,
    title: "蛋糕被谁吃了",
    grammarLabel: "幕后句 · 想说谁就垫 by",
    episode: "小美的一天 五十二",
    scene: "mansion",
    cover: cover10,
    sceneSetupZh: "生日会结束，小美发现蛋糕少了一大块，哥哥在一旁偷笑。",
    dialogueEn: "Who ate the cake?",
    dialogueZh: "妈妈看着空盘子问。",
    intentZh: "蛋糕被我哥哥吃了。",
    targetSentence: "The cake was eaten by my brother.",
    blocks: [
      { text: "The cake was eaten", role: "蛋糕被吃了（事站台上）" },
      { text: "by my brother", role: "被我哥哥（把人拉出来）" }
    ],
    oneLineRule: "想说谁做的，就在幕后句尾巴垫一块 by：was eaten by my brother——事在前，人在后，by 是「被谁」的牌子。",
    examples: [
      { en: "The cake was eaten by my brother.", zh: "蛋糕被我哥哥吃了。" },
      { en: "The window was broken by the wind.", zh: "窗户被风弄坏了。" },
      { en: "The song was sung by her.", zh: "那首歌是她唱的。" },
      { en: "The letter was written by Xiaomei.", zh: "那封信是小美写的。" }
    ],
    dialogue: [
      { who: "npc", en: "Who ate the cake?", zh: "妈妈看着空盘子问。" },
      { who: "npc", en: "Look at your brother!", zh: "她指了指旁边偷笑的哥哥。" },
      { who: "me", en: "The cake was eaten by my brother.", zh: "轮到你说了——蛋糕被我哥哥吃了。" }
    ],
    contrast: [
      {
        wrong: "The cake was eaten from my brother.",
        wrongMark: "from",
        correct: "The cake was eaten by my brother.",
        whyZh: "「被谁」用 by，不是 from——from 说的是「从哪里来」。中文的「从/被」翻过来容易拿错牌子，记住：by 才是「被谁」。"
      },
      {
        wrong: "The cake was eaten my brother.",
        wrongMark: null,
        correct: "The cake was eaten by my brother.",
        whyZh: "想说谁做的，by 不能丢：was eaten 【by】my brother——人从幕后拉出来，要垫一块牌子。"
      },
      {
        wrong: "My brother ate the cake.",
        wrongMark: null,
        correct: "The cake was eaten by my brother.",
        bothRight: true,
        whyZh: "两句都对——一句说「我哥哥吃了蛋糕」（哥哥站台上）；一句说「蛋糕被我哥哥吃了」（蛋糕站台上、哥哥从幕后点个名）。谁重要谁上台。"
      },
      {
        wrong: "The cake was eaten.",
        wrongMark: null,
        correct: "The cake was eaten by my brother.",
        bothRight: true,
        whyZh: "两句也都对——不想说谁吃的，就不垫 by（The cake was eaten.）；想说，就垫上（by my brother）。by 是选配的。"
      },
      {
        wrong: "The cake was eat by my brother.",
        wrongMark: "eat",
        correct: "The cake was eaten by my brother.",
        whyZh: "be 身边要穿做过版：was eaten——eat → ate → eaten，第 50 课学的手感。"
      },
      {
        wrong: "The cake was eaten of my brother.",
        wrongMark: "of",
        correct: "The cake was eaten by my brother.",
        whyZh: "of 是「的」（my brother 的什么），by 才是「被谁」——牌子别拿错。"
      }
    ],
    variants: [
      { label: "肯定", en: "The cake was eaten by my brother.", zh: "蛋糕被我哥哥吃了。" },
      { label: "否定", en: "The cake wasn't eaten by my brother.", zh: "蛋糕不是我哥哥吃的。", noteZh: "not 跟 was 走：wasn't；by 那截照挂。" },
      { label: "疑问", en: "Was the cake eaten by your brother?", zh: "蛋糕是你哥哥吃的吗？", noteZh: "Was 搬句首，by my brother 留在句尾。" }
    ],
    sceneSwings: [
      { sceneZh: "说窗户被风弄坏了", en: "The window was broken by the wind.", zh: "窗户被风弄坏了。" },
      { sceneZh: "说歌是她唱的", en: "The song was sung by her.", zh: "那首歌是她唱的。" },
      { sceneZh: "说信是小美写的", en: "The letter was written by Xiaomei.", zh: "那封信是小美写的。" }
    ],
    deepDive: {
      title: "想说谁，就垫一块 by",
      paragraphs: [
        "上节课的幕后句是「谁做的不重要」：My cup was broken（杯子被摔了，谁摔的不管）。",
        "有时候又想点个名：「是我哥哥吃的！」——这时在句尾垫一块 by：The cake was eaten by my brother。",
        "看位置：事在台上最前面（The cake）、be + 做过版说它怎么了（was eaten）、by 后面跟「谁干的」（my brother）。顺序千万别反。",
        "by 还是选配的：不想点名就不垫（The cake was eaten.）——两种说法都对，看你聊到哪一步。"
      ]
    },
    summary: {
      rule: "想说谁做的，就垫 by：was eaten by my brother——事在前、人在后。",
      points: [
        "The cake was eaten by my brother. —— by 是「被谁」的牌子",
        "The cake was eaten. —— 不想说谁就不垫（也对）",
        "My brother ate the cake. —— 想说谁，也可以让他站台上（主动）"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：蛋糕被我哥哥吃了。",
        before: "The cake was eaten",
        after: "my brother.",
        options: ["by", "from", "of"],
        answer: "by",
        explain: "「被谁」用 by：eaten by my brother。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：蛋糕被我哥哥吃了。",
        tokens: ["The", "cake", "was", "eaten", "by", "my", "brother."],
        answer: "The cake was eaten by my brother.",
        explain: "事在前（The cake was eaten）、人在后（by my brother）。"
      },
      {
        // R8 跨课复现：第 50 课（不带 by 的幕后句）
        kind: "arrange",
        promptZh: "先复习一小步——第 50 课学过：我的杯子被摔了。",
        tokens: ["My", "cup", "was", "broken."],
        answer: "My cup was broken.",
        explain: "复现第 50 课：不点名时就不垫 by——今天学点名的那一版。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["The", "cake", "was", "eaten", "from", "my", "brother."],
        wrongToken: "from",
        answer: "from",
        correctionZh: "「被谁」用 by：eaten by my brother。",
        explain: "from 是「从哪里来」；被谁用 by。"
      },
      {
        // R8 跨课复现：第 21 课（eat 的做过版）
        kind: "arrange",
        promptZh: "再对照一句——第 21 课学过：我吃过早饭了。",
        tokens: ["I", "have", "eaten", "breakfast."],
        answer: "I have eaten breakfast.",
        explain: "复现第 21 课：同一个 eaten——跟 have 出场是「吃过了」，跟 be 出场是「被吃了」。"
      },
      {
        // R9 变形/替换：不点名 → 点名（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子补人名：「The cake was eaten.（蛋糕被吃了）」想点哥哥的名，句尾要垫什么？",
        replaceBase: "The cake was eaten.",
        replaceTarget: "想点哥哥的名（my brother）",
        options: ["by my brother", "from my brother", "of my brother"],
        answer: "by my brother",
        explain: "点名垫 by：The cake was eaten by my brother。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：蛋糕被我哥哥吃了。",
        tokens: ["The", "cake", "was", "eaten", "by", "my", "brother."],
        distractors: ["from"],
        answer: "The cake was eaten by my brother."
      },
      {
        // R06 变体扩量：与 variants 否定卡逐字一致的否定变体题
        promptZh: "你想说：蛋糕不是我哥哥吃的。",
        tokens: ["The", "cake", "wasn't", "eaten", "by", "my", "brother."],
        distractors: ["weren't"],
        answer: "The cake wasn't eaten by my brother."
      },
      {
        // R8 跨课复现：第 51 课（复数搭档）对照
        promptZh: "先复习一小步——第 51 课学过：窗户（们）被打扫了。",
        tokens: ["The", "windows", "were", "cleaned."],
        distractors: ["was"],
        answer: "The windows were cleaned."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：蛋糕是你哥哥吃的吗？",
        tokens: ["Was", "the", "cake", "eaten", "by", "your", "brother?"],
        distractors: ["Were"],
        answer: "Was the cake eaten by your brother?"
      }
    ],
    recall: {
      promptZh: "生日会结束，妈妈看着空盘子问「谁吃了蛋糕」。凭记忆，写出点名哥哥的那句英文。",
      intentZh: "蛋糕被我哥哥吃了。",
      answer: "The cake was eaten by my brother.",
      noteZh: "点名垫 by：事在前、人在后。"
    },
    huntCaseIds: ["hunt-birthday-cake"]
  },
  {
    // ── 第七批 · L53 has been done（已经做过了）：完成时里 be 穿做过版——been 的双身份对撞 ──
    id: "lesson-53-has-been-done",
    number: 53,
    title: "窗户已经打扫过了",
    grammarLabel: "幕后句 · 已经做过了",
    episode: "小美的一天 五十三",
    scene: "campus",
    cover: cover24,
    sceneSetupZh: "早读前，同学们发现窗户透亮，小美说值日生已经打扫过了。",
    dialogueEn: "The window is so clean!",
    dialogueZh: "同桌看着透亮的窗户感叹。",
    intentZh: "窗户已经打扫过了。",
    targetSentence: "The window has been cleaned.",
    blocks: [
      { text: "The window", role: "窗户（站台上）" },
      { text: "has been", role: "已经（been 出场）" },
      { text: "cleaned", role: "打扫（做过版）" }
    ],
    oneLineRule: "说「已经被做过了」：has been + 做过版——been 是 be 的做过版（第 22 课学过），在这里跟 has 搭班。",
    examples: [
      { en: "The window has been cleaned.", zh: "窗户已经打扫过了。" },
      { en: "The window hasn't been cleaned.", zh: "窗户还没被打扫。" },
      { en: "Has the window been cleaned?", zh: "窗户打扫过了吗？" },
      { en: "The letter has been written.", zh: "信已经写好了。" }
    ],
    dialogue: [
      { who: "npc", en: "The window is so clean!", zh: "同桌看着透亮的窗户感叹。" },
      { who: "npc", en: "Was it done yesterday?", zh: "她猜：是昨天弄的吗？" },
      { who: "me", en: "The window has been cleaned.", zh: "轮到你说了——窗户已经打扫过了。" }
    ],
    contrast: [
      {
        wrong: "The window has cleaned.",
        wrongMark: null,
        correct: "The window has been cleaned.",
        whyZh: "has 后面要垫 be 的做过版（been）：has been cleaned。缺了它，句子就塌了——has 不能直接抓动词。"
      },
      {
        wrong: "The window has been clean.",
        wrongMark: "clean",
        correct: "The window has been cleaned.",
        whyZh: "been 后面要穿做过版：clean 说「干净的」这个状态，cleaned 说「被打扫过」这个动作——差一个 -ed 差一个动作。"
      },
      {
        wrong: "I have been to Beijing.",
        wrongMark: null,
        correct: "The window has been cleaned.",
        bothRight: true,
        whyZh: "两句都对——been 有两个身份：后面跟地方＝去过（I have been to Beijing）；后面跟做过版＝被做过（The window has been cleaned）。看 been 后面站的是地方还是分词。"
      },
      {
        wrong: "The window has been cleaned yesterday.",
        wrongMark: "yesterday",
        correct: "The window was cleaned yesterday.",
        whyZh: "有 yesterday 这种明确时间点，就不用完成时——说 The window was cleaned yesterday（第 24 课学过的判据）。"
      },
      {
        wrong: "The window hasn't been cleaned.",
        wrongMark: null,
        correct: "The window has been cleaned.",
        bothRight: true,
        whyZh: "两句都对——肯定（已经打扫过了）和否定（还没打扫）都是同一个骨架：has 后面 not 可加可不加、been cleaned 原地不动。看你想说哪头。"
      },
      {
        wrong: "Have the window been cleaned?",
        wrongMark: "Have",
        correct: "Has the window been cleaned?",
        whyZh: "一扇窗户用 Has 搬句首：Has the window been cleaned？——Been cleaned 留在原地不动。"
      }
    ],
    variants: [
      { label: "肯定", en: "The window has been cleaned.", zh: "窗户已经打扫过了。" },
      { label: "否定", en: "The window hasn't been cleaned.", zh: "窗户还没被打扫。", noteZh: "not 跟着 has 走（hasn't）；been cleaned 原地不动。" },
      { label: "疑问", en: "Has the window been cleaned?", zh: "窗户打扫过了吗？", noteZh: "Has 搬句首，been cleaned 不动。" }
    ],
    sceneSwings: [
      { sceneZh: "说信已经写好了", en: "The letter has been written.", zh: "信已经写好了。" },
      { sceneZh: "说窗户还没被打扫", en: "The window hasn't been cleaned.", zh: "窗户还没被打扫。" },
      { sceneZh: "问窗户打扫过了吗", en: "Has the window been cleaned?", zh: "窗户打扫过了吗？" }
    ],
    deepDive: {
      title: "been 的两个身份",
      paragraphs: [
        "第 22 课你认识过 been：它是 be 的做过版——I have been to Beijing（我去过北京）。been 后面跟地方，说的是「去过」。",
        "今天 been 又换个活：后面跟动词的做过版——The window has been cleaned（窗户已经打扫过了）。been 后面跟分词，说的是「被做过」。",
        "怎么分？看 been 后面站的是谁：跟地方（Beijing、the zoo）＝去过；跟做过版（cleaned、written）＝被做过。一个词，两班岗。",
        "和昨天的说法合起来看：The window was cleaned.（昨天打扫了）/ The window has been cleaned.（已经打扫过了，现在还是干净的）——想强调「现在做完了」，用 has been。"
      ]
    },
    summary: {
      rule: "说「已经被做过了」：has been + 做过版——The window has been cleaned。",
      points: [
        "The window has been cleaned. —— has been + cleaned",
        "I have been to Beijing. —— been 后面跟地方＝去过",
        "Has the window been cleaned? —— 问句：Has 搬句首"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：窗户已经打扫过了。",
        before: "The window has",
        after: "cleaned.",
        options: ["been", "be", "is"],
        answer: "been",
        explain: "has 后面垫 been：has been cleaned。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：窗户已经打扫过了。",
        tokens: ["The", "window", "has", "been", "cleaned."],
        answer: "The window has been cleaned.",
        explain: "has been + 做过版（cleaned）。"
      },
      {
        // R8 跨课复现：第 22 课（been 的第一身份）
        kind: "arrange",
        promptZh: "先复习一小步——第 22 课学过：我去过北京。",
        tokens: ["I", "have", "been", "to", "Beijing."],
        answer: "I have been to Beijing.",
        explain: "复现第 22 课：been 后面跟地方＝去过。今天看它的第二个身份。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["The", "window", "has", "cleaned."],
        wrongToken: "cleaned.",
        answer: "cleaned.",
        correctionZh: "has 后面要垫 been：has been cleaned。",
        explain: "缺了 been，句子就塌了。"
      },
      {
        // R8 跨课复现：第 24 课（时间点判据）
        kind: "arrange",
        promptZh: "再对照一句——第 24 课学过：昨天我去了公园。",
        tokens: ["Yesterday", "I", "went", "to", "the", "park."],
        answer: "Yesterday I went to the park.",
        explain: "复现第 24 课：有 yesterday 用昨天版——完成时不吃具体时间点。"
      },
      {
        // R9 变形/替换：过去式换完成时说法（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子换口气：「The window was cleaned.（昨天打扫了）」想强调「已经打扫过了（现在还是干净的）」，was 要换成什么？",
        replaceBase: "The window was cleaned.",
        replaceTarget: "换成「已经打扫过了」的口气",
        options: ["has been", "have been", "is been"],
        answer: "has been",
        explain: "一扇窗户用 has been：The window has been cleaned。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：窗户已经打扫过了。",
        tokens: ["The", "window", "has", "been", "cleaned."],
        distractors: ["have"],
        answer: "The window has been cleaned."
      },
      {
        // R06 变体扩量：与 variants 否定卡逐字一致的否定变体题
        promptZh: "你想说：窗户还没被打扫。",
        tokens: ["The", "window", "hasn't", "been", "cleaned."],
        distractors: ["haven't"],
        answer: "The window hasn't been cleaned."
      },
      {
        // R8 跨课复现（L50）：was cleaned 对照
        promptZh: "先复习一小步——第 50 课学过：我的杯子被摔了。",
        tokens: ["My", "cup", "was", "broken."],
        distractors: ["were"],
        answer: "My cup was broken."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：窗户打扫过了吗？",
        tokens: ["Has", "the", "window", "been", "cleaned?"],
        distractors: ["Have"],
        answer: "Has the window been cleaned?"
      }
    ],
    recall: {
      promptZh: "早读前，同桌感叹窗户很干净。凭记忆，写出你那句「已经打扫过了」的英文。",
      intentZh: "窗户已经打扫过了。",
      answer: "The window has been cleaned.",
      noteZh: "has been + 做过版——been 跟 has 搭班，说的还是「被做过」。"
    },
    huntCaseIds: ["hunt-cleaned-board"]
  },
  {
    // ── 第七批 · L54 收口课（零新知全复现）：被动地图——谁重要谁上台 ──
    id: "lesson-54-focus",
    number: 54,
    title: "谁上台",
    grammarLabel: "收口 · 谁重要谁上台",
    episode: "小美的一天 五十四",
    scene: "city",
    cover: cover20,
    sceneSetupZh: "班会结束，同学们围着展板聊今天的展览——有人关心谁做的，有人只关心事办成了没。",
    dialogueEn: "Who took these pictures?",
    dialogueZh: "同学指着展板问你。",
    intentZh: "照片是老师拍的。",
    targetSentence: "The pictures were taken by the teacher.",
    blocks: [
      { text: "The pictures", role: "照片们（复数站台上）" },
      { text: "were taken", role: "被拍了（were + 做过版）" },
      { text: "by the teacher", role: "被老师（点名垫 by）" }
    ],
    oneLineRule: "谁重要谁上台：想说谁干的用主动（The teacher took the pictures.）；想说事，用幕后句——谁重要谁上台。",
    examples: [
      { en: "The pictures were taken by the teacher.", zh: "照片是老师拍的。" },
      { en: "The window was cleaned yesterday.", zh: "窗户昨天被打扫了。" },
      { en: "The window has been cleaned.", zh: "窗户已经打扫过了。" },
      { en: "The teacher took the pictures.", zh: "老师拍了这些照片。" }
    ],
    dialogue: [
      { who: "npc", en: "Who took these pictures?", zh: "同学指着展板问你。" },
      { who: "npc", en: "They are so good!", zh: "她补了一句：拍得真好。" },
      { who: "me", en: "The pictures were taken by the teacher.", zh: "轮到你说了——照片是老师拍的。" }
    ],
    contrast: [
      {
        wrong: "The pictures were took by the teacher.",
        wrongMark: "took",
        correct: "The pictures were taken by the teacher.",
        whyZh: "be 身边要穿做过版：were taken——took 是昨天版，不能充数。"
      },
      {
        wrong: "The pictures were taken from the teacher.",
        wrongMark: "from",
        correct: "The pictures were taken by the teacher.",
        whyZh: "「被谁」用 by，不是 from——from 说的是「从哪里来」。第 52 课学过的牌子。"
      },
      {
        wrong: "The teacher took the pictures.",
        wrongMark: null,
        correct: "The pictures were taken by the teacher.",
        bothRight: true,
        whyZh: "两句都对——一句说「老师拍了照片」（老师站台上）；一句说「照片是老师拍的」（照片站台上、老师从幕后点个名）。谁重要谁上台。"
      },
      {
        wrong: "The window has been cleaned yesterday.",
        wrongMark: "yesterday",
        correct: "The window was cleaned yesterday.",
        whyZh: "有 yesterday 用昨天版：was cleaned——完成时不吃具体时间点（第 24/53 课判据）。"
      },
      {
        wrong: "The window has been clean.",
        wrongMark: "clean",
        correct: "The window has been cleaned.",
        whyZh: "been 后面要穿做过版：cleaned 说「被打扫过」——clean 是「干净的」这个状态。"
      },
      {
        wrong: "The pictures was taken by the teacher.",
        wrongMark: "was",
        correct: "The pictures were taken by the teacher.",
        whyZh: "主语 The pictures 是一群，用 were 搭档——一个 was、一群 were（第 51 课的配对）。"
      }
    ],
    variants: [
      { label: "肯定", en: "The pictures were taken by the teacher.", zh: "照片是老师拍的。" },
      { label: "否定", en: "The pictures weren't taken by the teacher.", zh: "照片不是老师拍的。", noteZh: "not 跟 were 走：weren't；by the teacher 照挂。" },
      { label: "疑问", en: "Were the pictures taken by the teacher?", zh: "照片是老师拍的吗？", noteZh: "Were 搬句首（复数搭档），by the teacher 不动。" }
    ],
    sceneSwings: [
      { sceneZh: "说窗户昨天被打扫了", en: "The window was cleaned yesterday.", zh: "窗户昨天被打扫了。" },
      { sceneZh: "说窗户已经打扫过了", en: "The window has been cleaned.", zh: "窗户已经打扫过了。" },
      { sceneZh: "说照片是老师拍的（主动版）", en: "The teacher took the pictures.", zh: "老师拍了这些照片。" }
    ],
    deepDive: {
      title: "被动地图",
      paragraphs: [
        "这一批你学了一整套「幕后句」，收口时把它们画成一张地图：",
        "① 谁做的不重要：was/were + 做过版——My cup was broken. / The windows were cleaned.（一个 was、一群 were）",
        "② 想说谁做的：句尾垫 by——The cake was eaten by my brother. / The pictures were taken by the teacher.",
        "③ 已经做过了：has been + 做过版——The window has been cleaned.（been 跟 has 搭班）",
        "一句话判据贯穿全部：谁重要谁上台。做事的人重要，用主动（Someone broke my cup. / The teacher took the pictures.）；事重要、人不重要，用幕后句。分寸在你手里。"
      ]
    },
    summary: {
      rule: "被动地图：was/were + 做过版（被做过）→ by（被谁）→ has been + 做过版（已经做过了）——谁重要谁上台。",
      points: [
        "The pictures were taken by the teacher. —— 全体要素同台",
        "The teacher took the pictures. —— 想说谁，让他站台上（都对）",
        "谁重要谁上台 —— 一句话判据"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：照片是老师拍的。",
        before: "The pictures were",
        after: "by the teacher.",
        options: ["taken", "took", "taking"],
        answer: "taken",
        explain: "be 身边穿做过版：were taken。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：照片是老师拍的。",
        tokens: ["The", "pictures", "were", "taken", "by", "the", "teacher."],
        answer: "The pictures were taken by the teacher.",
        explain: "全体要素同台：复数搭档（were）+ 做过版（taken）+ 点名（by the teacher）。"
      },
      {
        // R8 跨课复现：第 50 课（本体）
        kind: "arrange",
        promptZh: "先复习一小步——第 50 课学过：我的杯子被摔了。",
        tokens: ["My", "cup", "was", "broken."],
        answer: "My cup was broken.",
        explain: "复现第 50 课：谁做的不重要——不点名版。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["The", "pictures", "were", "took", "by", "the", "teacher."],
        wrongToken: "took",
        answer: "took",
        correctionZh: "be 身边穿做过版：were taken。",
        explain: "took 是昨天版，不能充数。"
      },
      {
        // R8 跨课复现：第 53 课（already 版）
        kind: "arrange",
        promptZh: "再对照一句——第 53 课学过：窗户已经打扫过了。",
        tokens: ["The", "window", "has", "been", "cleaned."],
        answer: "The window has been cleaned.",
        explain: "复现第 53 课：has been + 做过版——已经做过了。"
      },
      {
        // R9 变形/替换：焦点选择（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子换焦点：「The teacher took the pictures.」想把焦点挪到照片上（谁拍的不重要？不，还是点个名），be 要怎么搭？",
        replaceBase: "The teacher took the pictures.",
        replaceTarget: "把焦点挪到照片上（保留点名）",
        options: ["were taken by", "was taken by", "were took by"],
        answer: "were taken by",
        explain: "一群照片用 were taken by：The pictures were taken by the teacher。"
      }
    ],
    practice: [
      {
        // 全批混练：L50 型
        promptZh: "你想说：我的杯子被摔了。",
        tokens: ["My", "cup", "was", "broken."],
        distractors: ["were"],
        answer: "My cup was broken."
      },
      {
        // 全批混练：L52 型
        promptZh: "你想说：蛋糕被我哥哥吃了。",
        tokens: ["The", "cake", "was", "eaten", "by", "my", "brother."],
        distractors: ["from"],
        answer: "The cake was eaten by my brother."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：照片是老师拍的吗？",
        tokens: ["Were", "the", "pictures", "taken", "by", "the", "teacher?"],
        distractors: ["Was"],
        answer: "Were the pictures taken by the teacher?"
      },
      {
        // 全批总句
        promptZh: "全批收官——你想说：照片是老师拍的。",
        tokens: ["The", "pictures", "were", "taken", "by", "the", "teacher."],
        distractors: ["took"],
        answer: "The pictures were taken by the teacher."
      }
    ],
    recall: {
      promptZh: "班会上，同学指着展板问照片是谁拍的。凭记忆，写出你那句英文。",
      intentZh: "照片是老师拍的。",
      answer: "The pictures were taken by the teacher.",
      noteZh: "全体要素同台：were + taken + by the teacher。"
    },
    huntCaseIds: ["hunt-show-focus"]
  },

  // ── 第八批 · L55 排位词①（first/second/third + the）：报数管「有几个」、排位管「排第几」——日期链第一课（批八 PRD §2）──
  {
    id: "lesson-55-ordinal",
    number: 55,
    title: "第一个到教室",
    grammarLabel: "第几个 · first / second / third",
    episode: "小美的一天 五十五",
    scene: "campus",
    cover: cover28,
    sceneSetupZh: "周一清晨，小美第一个到教室，在黑板上写下比赛名次等同学来。",
    dialogueEn: "Who is the first to come?",
    dialogueZh: "同桌走进教室，指着黑板上的名次表问你。",
    intentZh: "他是第一个到的。",
    targetSentence: "He is the first to come.",
    blocks: [
      { text: "He is", role: "他是" },
      { text: "the first", role: "第一个（排位词）" },
      { text: "to come", role: "来的（做的事）" }
    ],
    oneLineRule: "说「第几个」用排位词：first（第一）、second（第二）、third（第三）——排位词前面常带着 the。",
    examples: [
      { en: "He is the first to come.", zh: "他是第一个到的。" },
      { en: "Tom is the second to finish.", zh: "汤姆是第二个跑完的。" },
      { en: "Amy is the third to finish.", zh: "艾米是第三个跑完的。" },
      { en: "He comes first.", zh: "他第一个来。" }
    ],
    dialogue: [
      { who: "npc", en: "Who is the first to come?", zh: "同桌走进教室，指着黑板上的名次表问你。" },
      { who: "npc", en: "Tom and Amy are on the board, too.", zh: "她念了念：名次表上还有汤姆和艾米。" },
      { who: "me", en: "He is the first to come.", zh: "轮到你说了——他是第一个到的。" }
    ],
    contrast: [
      {
        wrong: "He is first to come.",
        wrongMark: null,
        correct: "He is the first to come.",
        whyZh: "排位词前面不能光着：the first——排位一出现，the 就跟上（想想第 31 课的 the best，是它家老亲戚）。"
      },
      {
        wrong: "Tom is the two to finish.",
        wrongMark: "two",
        correct: "Tom is the second to finish.",
        whyZh: "报数词不能顶排位词：two 是「两个」，second 才是「第二」——报数管几个、排位管第几。"
      },
      {
        wrong: "Amy is the three to finish.",
        wrongMark: "three",
        correct: "Amy is the third to finish.",
        whyZh: "三的排位是 third——不是把 three 直接搬来，拼法要单独认。"
      },
      {
        wrong: "He comes first.",
        wrongMark: null,
        correct: "He is the first to come.",
        bothRight: true,
        whyZh: "两句都对——同一个「第一」，两种说法：句尾的 first 能单独用（He comes first），「the first + 做事」的说法也完整。看你想怎么说。"
      },
      {
        wrong: "There is a winner.",
        wrongMark: null,
        correct: "There are three winners.",
        bothRight: true,
        whyZh: "两句都对——一个赢家用 is、三个赢家用 are；three 是报数词，管「有几个」——别和排位家族混（第 26 课的老规矩）。"
      },
      {
        wrong: "The three boys are here.",
        wrongMark: null,
        correct: "The third boy is here.",
        bothRight: true,
        whyZh: "两句都对——「三个男孩」是一群、「第三个男孩」是排出来的那一个：three 管几个、third 管第几，差几个字母差一件事。"
      }
    ],
    variants: [
      { label: "肯定", en: "He is the first to come.", zh: "他是第一个到的。" },
      { label: "否定", en: "He is not the first to come.", zh: "他不是第一个到的。", noteZh: "not 跟 is 走：is not——the first to come 原地不动。" },
      { label: "疑问", en: "Who is the first?", zh: "谁是第一个？", noteZh: "问「谁是第一个」，疑问词 Who 站句首（第 27 课的搬法照旧）。" }
    ],
    sceneSwings: [
      { sceneZh: "说汤姆第二个跑完", en: "Tom is the second to finish.", zh: "汤姆是第二个跑完的。" },
      { sceneZh: "说艾米第三个回答", en: "Amy is the third to answer.", zh: "艾米是第三个回答的。" },
      { sceneZh: "说他第一个来（句尾版）", en: "He comes first.", zh: "他第一个来。" }
    ],
    deepDive: {
      title: "报数词和排位词",
      paragraphs: [
        "这一课认识一个新家族：排位词——first（第一）、second（第二）、third（第三）。它们和报数词（one、two、three）是两个家族：报数词管「有几个」，排位词管「排第几」。",
        "从「四」往后，排位词大多在数字后面加 -th：fourth、sixth、seventh……把 -th 想成「排位的小尾巴」。只有几个常客要单独认：first、second、third。",
        "排位词前面常带着 the：the first、the second——想想第 31 课的 the best（最好的），它就是 the 家的老亲戚。排位一出现，the 就跟上。",
        "把 two 和 second 放一起体会：two boys 是「两个男孩」（数出来的）；the second boy 是「第二个男孩」（排出来的）。差一个词，差一件事。"
      ]
    },
    summary: {
      rule: "说「第几个」用排位词：first、second、third——排位词前面常带着 the。",
      points: [
        "He is the first to come. —— the first 排第一",
        "He comes first. —— 同一个「第一」，两种说法",
        "The third boy is here. —— 排位词站名词前"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：他是第一个到的。",
        before: "He is",
        after: "to come.",
        options: ["the first", "the two", "first"],
        answer: "the first",
        explain: "排位词前面带着 the：the first——报数词 two 在这儿上不了岗。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：他是第一个到的。",
        tokens: ["He", "is", "the", "first", "to", "come."],
        answer: "He is the first to come.",
        explain: "排位词前面带着 the：the first；后面「来的事」用 to come。"
      },
      {
        // R8 跨课复现：第 6 课（It 占位说时间）
        kind: "arrange",
        promptZh: "先复习一小步——第 6 课学过：今天是星期一。",
        tokens: ["It", "is", "Monday."],
        answer: "It is Monday.",
        explain: "复现第 6 课：It 占位说时间——小美抬头看了一眼教室的钟。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["He", "is", "first", "to", "come."],
        wrongToken: "first",
        answer: "first",
        correctionZh: "排位词前面要带着 the：the first。",
        explain: "排位一出现，the 就跟上。"
      },
      {
        // R8 跨课复现：第 26 课（There 先占位）
        kind: "arrange",
        promptZh: "再对照一句——第 26 课学过：桌上有一本书。",
        tokens: ["There", "is", "a", "book", "on", "the", "desk."],
        answer: "There is a book on the desk.",
        explain: "复现第 26 课：There 先占位说「有」——这个名字牌以后还会用到。"
      },
      {
        // R9 变形/替换：报数换排位（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「Tom is the second to finish.」把「第二」换成「第三」，排位词要怎么变？",
        replaceBase: "Tom is the second to finish.",
        replaceTarget: "把「第二」换成「第三」",
        options: ["the third", "the three", "third"],
        answer: "the third",
        explain: "三的排位是 third（不是 three）——前面照样带着 the：the third。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：他是第一个到的。",
        tokens: ["He", "is", "the", "first", "to", "come."],
        distractors: ["one"],
        answer: "He is the first to come."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：谁是第一个？",
        tokens: ["Who", "is", "the", "first?"],
        distractors: ["two"],
        answer: "Who is the first?"
      },
      {
        // R8 跨课复现：第 26 课原句
        promptZh: "复习第 26 课：桌上有一本书。",
        tokens: ["There", "is", "a", "book", "on", "the", "desk."],
        distractors: ["are"],
        answer: "There is a book on the desk."
      },
      {
        promptZh: "收个尾——你想说：艾米是第三个到的。",
        tokens: ["Amy", "is", "the", "third", "to", "come."],
        distractors: ["three"],
        answer: "Amy is the third to come."
      }
    ],
    recall: {
      promptZh: "周一早读，同桌指着黑板上的名次表问你谁是第一个到的。凭记忆，写出你那句英文。",
      intentZh: "他是第一个到的。",
      answer: "He is the first to come.",
      noteZh: "排位词前面带着 the：the first；「来的事」用 to come。"
    },
    huntCaseIds: ["hunt-race-result"]
  },

  // ── 第八批 · L56 月份（12 个月 + in）：挂着挂历认月份，说「在某个月」用 in——接住 L27 的生日问句（批八 PRD §2）──
  {
    id: "lesson-56-months",
    number: 56,
    title: "我的生日在五月",
    grammarLabel: "月份 · in May",
    episode: "小美的一天 五十六",
    scene: "mansion",
    cover: cover30,
    sceneSetupZh: "家里挂历前，小美在 12 个月格子上圈生日，给全家人的生日排顺序。",
    dialogueEn: "When is your birthday?",
    dialogueZh: "妈妈指着挂历问你。",
    intentZh: "我的生日在五月。",
    targetSentence: "My birthday is in May.",
    blocks: [
      { text: "My birthday", role: "我的生日" },
      { text: "is", role: "在（是）" },
      { text: "in May", role: "在五月（大格子）" }
    ],
    oneLineRule: "说「在某个月」用 in：in May——只说月份这一大格用 in；月份名字首字母要抬头（May 像人名一样大写）。",
    examples: [
      { en: "My birthday is in May.", zh: "我的生日在五月。" },
      { en: "My birthday is in June.", zh: "我的生日在六月。" },
      { en: "Grandma's birthday is in October.", zh: "奶奶的生日在十月。" },
      { en: "It is May.", zh: "现在是五月。" }
    ],
    dialogue: [
      { who: "npc", en: "When is your birthday?", zh: "妈妈指着挂历问你。" },
      { who: "npc", en: "Let's circle it on the calendar.", zh: "她把笔递给你：来，圈在挂历上。" },
      { who: "me", en: "My birthday is in May.", zh: "轮到你说了——我的生日在五月。" }
    ],
    contrast: [
      {
        wrong: "My birthday is on May.",
        wrongMark: "on",
        correct: "My birthday is in May.",
        whyZh: "只说「哪个月」用 in——月份是一个大格子；「某一天」才用 on（第 18 课的判据：点用 on、段用 in）。"
      },
      {
        wrong: "My birthday is in may.",
        wrongMark: "may",
        correct: "My birthday is in May.",
        whyZh: "月份名字要抬头：May——像人名一样首字母大写，小写的 may 是另一个词。"
      },
      {
        wrong: "School starts on Monday.",
        wrongMark: null,
        correct: "School starts in May.",
        bothRight: true,
        whyZh: "两句都对——一天用 on（on Monday）、一个月用 in（in May）：点到哪一级，用哪个词。"
      },
      {
        wrong: "When is your birthday?",
        wrongMark: null,
        correct: "My birthday is in May.",
        bothRight: true,
        whyZh: "两句都对——一句问（第 27 课学的问句）、一句答。会问还要会答，今天就补上答句。"
      },
      {
        wrong: "It is Monday.",
        wrongMark: null,
        correct: "It is May.",
        bothRight: true,
        whyZh: "两句都对——第 6 课说星期（It is Monday），今天说月份（It is May）：星期是「点」、月份是「段」，名字都抬头。"
      },
      {
        wrong: "July / August / September / October / November / December",
        wrongMark: null,
        correct: "January / February / March / April / May / June",
        bothRight: true,
        whyZh: "12 个月挂历认读——长名字拆三段读：Sep-tem-ber / Oc-to-ber / No-vem-ber / De-cem-ber，读顺了就不怕长。"
      }
    ],
    variants: [
      { label: "肯定", en: "My birthday is in May.", zh: "我的生日在五月。" },
      { label: "否定", en: "My birthday is not in May.", zh: "我的生日不在五月。", noteZh: "not 跟 is 走：is not——in May 原地不动。" },
      { label: "疑问", en: "Is your birthday in May?", zh: "你的生日在五月吗？", noteZh: "Is 搬句首，in May 不动（第 27 课的搬法照旧）。" }
    ],
    sceneSwings: [
      { sceneZh: "说爷爷的生日在十月", en: "Grandpa's birthday is in October.", zh: "爷爷的生日在十月。" },
      { sceneZh: "说开学在九月", en: "School starts in September.", zh: "开学在九月。" },
      { sceneZh: "问对方生日在不在七月", en: "Is your birthday in July?", zh: "你的生日在七月吗？" }
    ],
    deepDive: {
      title: "挂历上的大格子",
      paragraphs: [
        "12 个月名字来自挂历——不用死背，先认形状：一个月一个大格子，格子上的名字首字母都抬头（January、February……），因为它们是「名字」，像人名一样。",
        "说「在某个月」用 in：in May、in October——你先说到哪个大格子。月份是「段」（一段很长），所以用 in；星期和日子是「点」（就那一天），所以用 on。第 18 课的判据今天升级：点用 on、段用 in。",
        "长名字不用怕：September 拆成 Sep-tem-ber、October 拆成 Oc-to-ber、November 拆成 No-vem-ber、December 拆成 De-cem-ber——按段读就顺了。",
        "想想第 27 课你学过的问句：When is your birthday？当时你只会问。今天你会答了：My birthday is in May.——会问又会答，生日这件事就完整了。"
      ]
    },
    summary: {
      rule: "说「在某个月」用 in：in May——月份是大格子（段）；名字首字母要抬头。",
      points: [
        "My birthday is in May. —— 一个月用 in",
        "When is your birthday? / My birthday is in May. —— 会问也会答",
        "on Monday / in May —— 点用 on、段用 in"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我的生日在五月。",
        before: "My birthday is",
        after: "May.",
        options: ["in", "on", "at"],
        answer: "in",
        explain: "只说月份这个大格子用 in：in May——「某一天」才用 on。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我的生日在五月。",
        tokens: ["My", "birthday", "is", "in", "May."],
        answer: "My birthday is in May.",
        explain: "in + 月份：in May——月份名字抬头。"
      },
      {
        // R8 跨课复现：第 27 课（生日问句）——本课负责「答」
        kind: "arrange",
        promptZh: "先复习一小步——第 27 课学过：你的生日是什么时候？",
        tokens: ["When", "is", "your", "birthday?"],
        answer: "When is your birthday?",
        explain: "复现第 27 课：会问；今天补上「答」。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["My", "birthday", "is", "in", "may."],
        wrongToken: "may.",
        answer: "may.",
        correctionZh: "月份名字要抬头：May。",
        explain: "像人名一样首字母大写——小写的 may 是另一个词。"
      },
      {
        // R8 跨课复现：第 6 课（It 占位说时间）
        kind: "arrange",
        promptZh: "再对照一句——第 6 课学过：今天是星期五。",
        tokens: ["It", "is", "Friday."],
        answer: "It is Friday.",
        explain: "复现第 6 课：It 占位说时间——星期和月份是一家人，名字都抬头。"
      },
      {
        // R9 变形/替换：换月份（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「My birthday is in May.」把五月换成十月，月份名字要怎么变？",
        replaceBase: "My birthday is in May.",
        replaceTarget: "把五月换成十月",
        options: ["in October", "in october", "on October"],
        answer: "in October",
        explain: "still in + 月份：in October——名字照样抬头。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我的生日在五月。",
        tokens: ["My", "birthday", "is", "in", "May."],
        distractors: ["on"],
        answer: "My birthday is in May."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：你的生日在五月吗？",
        tokens: ["Is", "your", "birthday", "in", "May?"],
        distractors: ["on"],
        answer: "Is your birthday in May?"
      },
      {
        // R8 跨课复现：第 6 课原句
        promptZh: "复习第 6 课：今天是星期五。",
        tokens: ["It", "is", "Friday."],
        distractors: ["are"],
        answer: "It is Friday."
      },
      {
        promptZh: "收个尾——你想说：开学在九月。",
        tokens: ["School", "starts", "in", "September."],
        distractors: ["on"],
        answer: "School starts in September."
      }
    ],
    recall: {
      promptZh: "家里挂历前，妈妈指着格子问你生日是什么时候。凭记忆，写出你那句英文。",
      intentZh: "我的生日在五月。",
      answer: "My birthday is in May.",
      noteZh: "只用月份用 in：in May——名字抬头。"
    },
    huntCaseIds: ["hunt-birthday-list"]
  },

  // ── 第八批 · L57 日期（on + 月份 + 日子读排位词）：日期链收口——L27 会问、L56 说月份、本课说日子（批八 PRD §2）──
  {
    id: "lesson-57-dates",
    number: 57,
    title: "十月一日",
    grammarLabel: "日期 · on October 1",
    episode: "小美的一天 五十七",
    scene: "campus",
    cover: cover18,
    sceneSetupZh: "开学通知贴在教室门口，小美指着日期念给同学听。",
    dialogueEn: "When does school start?",
    dialogueZh: "同学凑过来看通知。",
    intentZh: "开学在十月一号。",
    targetSentence: "School starts on October 1.",
    blocks: [
      { text: "School starts", role: "开学（它开头做事）" },
      { text: "on", role: "在（点到日子）" },
      { text: "October 1", role: "十月一号（读 October first）" }
    ],
    oneLineRule: "说「某月某日」＝on + 月份 + 日子；日子里的数字读排位词——October 1 读 October first。",
    examples: [
      { en: "School starts on October 1.", zh: "开学在十月一号。" },
      { en: "My birthday is on May third.", zh: "我的生日在五月三号。" },
      { en: "The party is on June 2.", zh: "派对在六月二号。" },
      { en: "We meet on Monday.", zh: "我们周一见面。" }
    ],
    dialogue: [
      { who: "npc", en: "When does school start?", zh: "同学凑过来看通知。" },
      { who: "npc", en: "The date is right here.", zh: "她指着通知上的红字。" },
      { who: "me", en: "School starts on October 1.", zh: "轮到你说了——开学在十月一号。" }
    ],
    contrast: [
      {
        wrong: "School starts in October 1.",
        wrongMark: "in",
        correct: "School starts on October 1.",
        whyZh: "有具体日子就用 on：October 1 是「某一天」——只说月份才用 in（in October）。点到日子就升级。"
      },
      {
        wrong: "School starts on October one.",
        wrongMark: "one",
        correct: "School starts on October 1.",
        whyZh: "日子读排位词，不读报数：1 读 first——October 1 读 October first（第 55 课的排位家族又出场）。"
      },
      {
        wrong: "My birthday is in May.",
        wrongMark: null,
        correct: "My birthday is on May third.",
        bothRight: true,
        whyZh: "两句都对——只说「五月」用 in（in May）；点到「五月三号」升级用 on（on May third）——一步之差。"
      },
      {
        wrong: "School starts on october 1.",
        wrongMark: "october",
        correct: "School starts on October 1.",
        whyZh: "月份名字要抬头：October——第 56 课的老规矩，写日期也别忘。"
      },
      {
        wrong: "He is the first to come.",
        wrongMark: null,
        correct: "School starts on October 1.",
        bothRight: true,
        whyZh: "两句都对——第 55 课的 the first（第一个）站台上；日子里的 1 读出来就是 first：排位词家族的又一次出场。"
      },
      {
        wrong: "School starts on Monday.",
        wrongMark: null,
        correct: "School starts on October 1.",
        bothRight: true,
        whyZh: "两句都对——「某一天」都是同一班：星期几用 on、日期也用 on。日期写 October 1 或 1 October 都对，两种都对不用改。"
      }
    ],
    variants: [
      { label: "肯定", en: "School starts on October 1.", zh: "开学在十月一号。" },
      { label: "否定", en: "School doesn't start on October 1.", zh: "开学不在十月一号。", noteZh: "动作请帮手 doesn't（第 25 课的规矩）；日期块原地不动。" },
      { label: "疑问", en: "Does school start on October 1?", zh: "开学在十月一号吗？", noteZh: "Does 站句首，start 穿原样，日期块不动。" }
    ],
    sceneSwings: [
      { sceneZh: "说生日在五月三号", en: "My birthday is on May third.", zh: "我的生日在五月三号。" },
      { sceneZh: "说派对在六月二号", en: "The party is on June 2.", zh: "派对在六月二号。" },
      { sceneZh: "问开学在不在十月一号", en: "Does school start on October 1?", zh: "开学在十月一号吗？" }
    ],
    deepDive: {
      title: "日期链收口",
      paragraphs: [
        "把这三课连起来看：第 27 课你会问（When is your birthday?）；第 56 课你会答月份（My birthday is in May.）；今天你会答日子（My birthday is on May third.）——从问到答，生日和开学这种事你都能说全了。",
        "判据一条：点到哪一级用哪个词——只说月份用 in（in May），点到日子升级用 on（on May third）。点用 on、段用 in，第 18 课的老判据一路升级到这里。",
        "日子为什么读 first 不读 one？因为说的是「第几个日子」——五月三号是「五月里的第三个日子」，读 May third。写的时候写 3 或 third 都行，读出来读排位词。",
        "写日期两种顺序都对：October 1（美式）或 1 October（英式）——见到 1 October 别惊讶，它和 October 1 是一个意思。"
      ]
    },
    summary: {
      rule: "说「某月某日」＝on + 月份 + 日子（日子读排位词）：School starts on October 1.",
      points: [
        "School starts on October 1. —— 点到日子用 on",
        "in May / on May third —— 月份一步，日子升级",
        "October 1 读 October first —— 日子读排位词"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：开学在十月一号。",
        before: "School starts",
        after: "October 1.",
        options: ["on", "in", "at"],
        answer: "on",
        explain: "有具体日子就用 on：on October 1——点到日子就升级。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：开学在十月一号。",
        tokens: ["School", "starts", "on", "October", "1."],
        answer: "School starts on October 1.",
        explain: "on + 月份 + 日子：on October 1——读出来是 October first。"
      },
      {
        // R8 跨课复现：第 55 课（the first 排位词）——日子的 first 就是它
        kind: "arrange",
        promptZh: "先复习一小步——第 55 课学过：他是第一个到的。",
        tokens: ["He", "is", "the", "first", "to", "come."],
        answer: "He is the first to come.",
        explain: "复现第 55 课：the first——今天日期里的 1 读 first，就是它。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["School", "starts", "on", "October", "one."],
        wrongToken: "one.",
        answer: "one.",
        correctionZh: "日子读排位词：1 读 first——on October first。",
        explain: "报数词不能顶排位词的岗。"
      },
      {
        // R8 跨课复现：第 56 课（in + 月份）
        kind: "arrange",
        promptZh: "再对照一句——第 56 课学过：我的生日在五月。",
        tokens: ["My", "birthday", "is", "in", "May."],
        answer: "My birthday is in May.",
        explain: "复现第 56 课：只说月份用 in——今天点到日子，一步升级到 on。"
      },
      {
        // R9 变形/替换：换日子（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「School starts on October 1.」把日子换成「五月三号」，要怎么变？",
        replaceBase: "School starts on October 1.",
        replaceTarget: "把日子换成「五月三号」",
        options: ["on May third", "on May three", "in May three"],
        answer: "on May third",
        explain: "点到日子用 on + 排位词：on May third——three 要换成 third。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：开学在十月一号。",
        tokens: ["School", "starts", "on", "October", "1."],
        distractors: ["in"],
        answer: "School starts on October 1."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：开学在十月一号吗？",
        tokens: ["Does", "school", "start", "on", "October", "1?"],
        distractors: ["Do"],
        answer: "Does school start on October 1?"
      },
      {
        // R8 跨课复现：第 18 课原句（on + 某一天）
        promptZh: "复习第 18 课：我们周一见面。",
        tokens: ["We", "meet", "on", "Monday."],
        distractors: ["in"],
        answer: "We meet on Monday."
      },
      {
        promptZh: "收个尾——你想说：我的生日在五月三号。",
        tokens: ["My", "birthday", "is", "on", "May", "third."],
        distractors: ["three"],
        answer: "My birthday is on May third."
      }
    ],
    recall: {
      promptZh: "开学通知贴在教室门口，同学问你什么时候开学。凭记忆，写出你那句英文。",
      intentZh: "开学在十月一号。",
      answer: "School starts on October 1.",
      noteZh: "点到日子用 on；数字 1 读 first。"
    },
    huntCaseIds: ["hunt-calendar-note"]
  },

  // ── 第八批 · L58 -ly 副词（做事的样子）：形容词加 -ly 变样子词，站动词后面——与 L28 频率词「前座」对照（批八 PRD §2）──
  {
    id: "lesson-58-ly-adverbs",
    number: 58,
    title: "她跑得快",
    grammarLabel: "做事的样子 · 动词后面加 -ly",
    episode: "小美的一天 五十八",
    scene: "campus",
    cover: cover49,
    sceneSetupZh: "运动会看台上，小美给跑第一的姐姐喊加油，报出她跑的样子。",
    dialogueEn: "Look at your sister!",
    dialogueZh: "同学推推你的胳膊。",
    intentZh: "她跑得快。",
    targetSentence: "She runs quickly.",
    blocks: [
      { text: "She runs", role: "她跑（动作）" },
      { text: "quickly", role: "快（做事的样子）" }
    ],
    oneLineRule: "说「怎么做的」，在动作词后面站一个样子词：大多是形容样子的词加 -ly 变来——quick→quickly、careful→carefully。",
    examples: [
      { en: "She runs quickly.", zh: "她跑得快。" },
      { en: "He does his homework carefully.", zh: "他做作业很仔细。" },
      { en: "She reads loudly.", zh: "她朗读声音大。" },
      { en: "She is quick.", zh: "她很快（跑得快这个特点）。" }
    ],
    dialogue: [
      { who: "npc", en: "Look at your sister!", zh: "同学推推你的胳膊。" },
      { who: "npc", en: "She is so fast on the track!", zh: "她指着跑道喊。" },
      { who: "me", en: "She runs quickly.", zh: "轮到你说了——她跑得快。" }
    ],
    contrast: [
      {
        wrong: "She quickly runs.",
        wrongMark: "quickly",
        correct: "She runs quickly.",
        whyZh: "样子词站动词后面：runs quickly——频率词抢前座（always runs），样子词坐后座（runs quickly），座位不同（第 28 课的对照）。"
      },
      {
        wrong: "She runs quick.",
        wrongMark: "quick",
        correct: "She runs quickly.",
        whyZh: "「什么样」的词不能顶「做得怎么样」的岗：quick 形容人（She is quick），加 -ly 才是「跑得快」（runs quickly）。"
      },
      {
        wrong: "She is quick.",
        wrongMark: null,
        correct: "She runs quickly.",
        bothRight: true,
        whyZh: "两句都对——说「她快」（她的特点）用 is + quick；说「她跑得快」（做得怎么样）用 runs + quickly。是什么样 vs 做得怎么样。"
      },
      {
        wrong: "She always runs in the morning.",
        wrongMark: null,
        correct: "She runs quickly.",
        bothRight: true,
        whyZh: "两句都对——always（频率词）站动词前面，这是第 28 课的老规矩；今天学的 quickly 站动词后面。前座后座，各坐各的。"
      },
      {
        wrong: "He does his homework carefully.",
        wrongMark: null,
        correct: "She runs quickly.",
        bothRight: true,
        whyZh: "两句都对——做事的样子跟着动作走：runs quickly、does his homework carefully——careful 加 -ly 再收尾。"
      },
      {
        wrong: "He reads loud.",
        wrongMark: "loud",
        correct: "He reads loudly.",
        whyZh: "形容词顶岗反向再练一条：读书「声音大」要说 reads loudly——形容词 loud 加 -ly 才是样子词。"
      }
    ],
    variants: [
      { label: "肯定", en: "She runs quickly.", zh: "她跑得快。" },
      { label: "否定", en: "She doesn't run quickly.", zh: "她跑得不快。", noteZh: "not 走帮手 doesn't；quickly 留在动词后不动。" },
      { label: "疑问", en: "Does she run quickly?", zh: "她跑得快吗？", noteZh: "Does 站句首，run 穿原样，后座词不动。" }
    ],
    sceneSwings: [
      { sceneZh: "说他做作业仔细", en: "He does his homework carefully.", zh: "他做作业很仔细。" },
      { sceneZh: "说她朗读声音大", en: "She reads loudly.", zh: "她朗读声音大。" },
      { sceneZh: "问对方跑得快不快", en: "Do you run quickly?", zh: "你跑得快吗？" }
    ],
    deepDive: {
      title: "前座与后座",
      paragraphs: [
        "第 28 课你认识过一族词：always、often、never——它们说「多久一次」，站动词前面（I always arrive early）。今天的新一族站动词后面（She runs quickly）。",
        "两族词别坐错位置：说「多久一次」坐前座；说「怎么做的」坐后座。always runs（前座）/ runs quickly（后座）——一回生两回熟，座位记牢。",
        "后座词怎么来的？大多是从「形容样子的词」加 -ly 变来的：quick→quickly、careful→carefully、loud→loudly。变化不难：尾巴上挂个 -ly 就行。",
        "「什么样」和「做得怎么样」是两班岗：She is quick（她是快的——形容她这个人）；She runs quickly（她跑得快——形容跑这件事）。差一个 -ly，差一个岗位。"
      ]
    },
    summary: {
      rule: "说「怎么做的」，动作词后面站个样子词（形容词加 -ly）：She runs quickly.——前座频率、后座样子。",
      points: [
        "She runs quickly. —— 样子词坐后座",
        "I always arrive early. —— 频率词坐前座",
        "is quick / runs quickly —— 是什么样 vs 做得怎么样"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：她跑得快。",
        before: "She runs",
        after: ".",
        options: ["quickly", "quick", "always"],
        answer: "quickly",
        explain: "「做得怎么样」要加 -ly 的样子词：runs quickly——quick 是形容人，always 是频率词（前座的）。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：她跑得快。",
        tokens: ["She", "runs", "quickly."],
        answer: "She runs quickly.",
        explain: "样子词坐后座：runs quickly——动作在前，样子在后。"
      },
      {
        // R8 跨课复现：第 28 课（频率词前座）
        kind: "arrange",
        promptZh: "先复习一小步——第 28 课学过：我总是早到。",
        tokens: ["I", "always", "arrive", "early."],
        answer: "I always arrive early.",
        explain: "复现第 28 课：always 坐前座（动词前）——今天的样子词坐后座，座位对照着记。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["She", "runs", "quick."],
        wrongToken: "quick.",
        answer: "quick.",
        correctionZh: "要加 -ly 的样子词：runs quickly。",
        explain: "形容词不能顶样子词的岗。"
      },
      {
        // R8 跨课复现：第 25 课（三单 -s）
        kind: "arrange",
        promptZh: "再对照一句——第 25 课学过：他每天喝牛奶。",
        tokens: ["He", "drinks", "milk", "every", "day."],
        answer: "He drinks milk every day.",
        explain: "复现第 25 课：三单的 -s 别丢——今天句子里的 runs 也穿着这件外套。"
      },
      {
        // R9 变形/替换：换样子词（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「She runs quickly.」把「快」换成「仔细（careful）」，样子词要怎么变？",
        replaceBase: "She runs quickly.",
        replaceTarget: "把「快」换成「仔细」",
        options: ["carefully", "careful", "carefuly"],
        answer: "carefully",
        explain: "careful 加 -ly：carefully——拼写把 e 留住。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：她跑得快。",
        tokens: ["She", "runs", "quickly."],
        distractors: ["quick"],
        answer: "She runs quickly."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：她跑得快吗？",
        tokens: ["Does", "she", "run", "quickly?"],
        distractors: ["runs"],
        answer: "Does she run quickly?"
      },
      {
        promptZh: "复习第 28 课：我总是早到。",
        tokens: ["I", "always", "arrive", "early."],
        distractors: ["arrive always"],
        answer: "I always arrive early."
      },
      {
        promptZh: "收个尾——你想说：他做作业很仔细。",
        tokens: ["He", "does", "his", "homework", "carefully."],
        distractors: ["careful"],
        answer: "He does his homework carefully."
      }
    ],
    recall: {
      promptZh: "运动会看台上，同学指着跑第一的姐姐让你也说一句。凭记忆，写出你那句英文。",
      intentZh: "她跑得快。",
      answer: "She runs quickly.",
      noteZh: "样子词坐后座：runs quickly——别和频率词的前座混。"
    },
    huntCaseIds: ["hunt-sports-report"]
  },

  // ── 第八批 · L59 well / fast（副词链收口）：两个不按 -ly 走的常客——good→well、fast→fast；L14 认读种子转正（批八 PRD §2）──
  {
    id: "lesson-59-well-fast",
    number: 59,
    title: "她唱得好",
    grammarLabel: "不按 -ly 走的两个常客 · good→well、fast→fast",
    episode: "小美的一天 五十九",
    scene: "mansion",
    cover: cover21,
    sceneSetupZh: "家庭聚会上姐姐唱完一首，小美在客厅夸她唱得好。",
    dialogueEn: "She sings very well.",
    dialogueZh: "姐姐唱完一首歌，亲戚们都在鼓掌。",
    intentZh: "她唱得很好。",
    targetSentence: "She sings very well.",
    blocks: [
      { text: "She sings", role: "她唱（动作）" },
      { text: "very well", role: "很好（放大器 + 常客）" }
    ],
    oneLineRule: "两个常客不按 -ly 走：good 的样子词是 well，fast 的样子词还是 fast；very 要贴在样子词前面。",
    examples: [
      { en: "She sings very well.", zh: "她唱得很好。" },
      { en: "He runs very fast.", zh: "他跑得很快。" },
      { en: "She is a good singer.", zh: "她是个好歌手。" },
      { en: "She can sing very well.", zh: "她唱歌很好听（第 14 课的句子）。" }
    ],
    dialogue: [
      { who: "npc", en: "Listen! Your sister is singing.", zh: "客厅里，姐姐唱完了一首歌。" },
      { who: "npc", en: "She can sing very well.", zh: "妈妈轻轻跟着哼了一句。" },
      { who: "me", en: "She sings very well.", zh: "轮到你说了——她唱得很好。" }
    ],
    contrast: [
      {
        wrong: "She sings very good.",
        wrongMark: "good",
        correct: "She sings very well.",
        whyZh: "good 形容「她这个人/东西好」，well 说「做得好」：sing + well——good 的样子词是 well，不是 goodly。"
      },
      {
        wrong: "She sings well very.",
        wrongMark: "very",
        correct: "She sings very well.",
        whyZh: "very 是「放大器」，得排在它放大的词前面：very well——先放大、后样子。"
      },
      {
        wrong: "He runs fastly.",
        wrongMark: "fastly",
        correct: "He runs fast.",
        whyZh: "fast 自己就是样子词，不加 -ly：runs fast——没有 fastly 这个词。"
      },
      {
        wrong: "She is a good singer.",
        wrongMark: null,
        correct: "She sings well.",
        bothRight: true,
        whyZh: "两句都对——夸「一个好歌手」用 good 挂在人身上；夸「唱得好」用 well 跟着动作。挂人用 good、跟动作用 well。"
      },
      {
        wrong: "She runs quickly.",
        wrongMark: null,
        correct: "She sings very well.",
        bothRight: true,
        whyZh: "两句都对——第 58 课的 quickly 是规则型（quick 加 -ly）；今天的 well 是不按套路走的常客。一族词加一个常客。"
      },
      {
        wrong: "She can sing very well.",
        wrongMark: null,
        correct: "She sings very well.",
        bothRight: true,
        whyZh: "两句都对——第 14 课你听懂过「She can sing very well.」（她会唱，带 can）；今天你不带 can 也会说了。会听 → 会自己说。"
      }
    ],
    variants: [
      { label: "肯定", en: "She sings very well.", zh: "她唱得很好。" },
      { label: "否定", en: "She doesn't sing very well.", zh: "她唱得不太好。", noteZh: "not 走帮手 doesn't；very well 原地不动。" },
      { label: "疑问", en: "Does she sing well?", zh: "她唱得好吗？", noteZh: "Does 站句首，sing 穿原样——问句里 very 可以省。" }
    ],
    sceneSwings: [
      { sceneZh: "夸姐姐唱得好", en: "She sings very well.", zh: "她唱得很好。" },
      { sceneZh: "说弟弟跑得很快（fast 常客）", en: "He runs very fast.", zh: "他跑得很快。" },
      { sceneZh: "说她朗读声音大（规则型复现）", en: "She reads loudly." , zh: "她朗读声音大。" }
    ],
    deepDive: {
      title: "副词链地图",
      paragraphs: [
        "这一批你认识了一族词：做事的样子词。大多是从形容样子的词加 -ly 变来：quick→quickly、careful→carefully、loud→loudly——加个 -ly 就是「做得怎么样」。",
        "有两个常客不按套路走：good 的样子词是 well（唱歌「好」是 sing well，不是 sing good）；fast 谁也不加（跑得「快」还是 fast，没有 fastly）。两个常客不需要理由，记句子就行。",
        "再加一个放大器 very：它站样子词前面——very well、very fast。想加力气就把 very 摆上去。",
        "回头看第 14 课：She can sing very well.——当时你只是听懂了（带 can 的版本）。今天你不带 can 也会自己说了：She sings very well. 从听懂到会说，这就是这一课的意义。"
      ]
    },
    summary: {
      rule: "两个常客：good 的样子词是 well、fast 还是 fast——very 贴在样子词前面。",
      points: [
        "She sings very well. —— well 是 good 的样子词",
        "He runs very fast. —— fast 不加 -ly",
        "She can sing very well. —— 第 14 课听懂过，今天会说"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：她唱得很好。",
        before: "She sings",
        after: ".",
        options: ["very well", "well very", "very good"],
        answer: "very well",
        explain: "very 排样子词前面，well 说「做得好」：very well——good 上不了这个岗。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：她唱得很好。",
        tokens: ["She", "sings", "very", "well."],
        answer: "She sings very well.",
        explain: "放大器在前、样子词在后：very well。"
      },
      {
        // R8 跨课复现：第 14 课（认读种子转正——逐字拼一次）
        kind: "arrange",
        promptZh: "先复习一小步——第 14 课你听过的句子：她会唱得很好。",
        tokens: ["She", "can", "sing", "very", "well."],
        answer: "She can sing very well.",
        explain: "复现第 14 课：can 后面的 sing 穿原样、well 收尾——今天它要转正成你自己的句子。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["She", "sings", "very", "good."],
        wrongToken: "good.",
        answer: "good.",
        correctionZh: "good 的样子词是 well：sings very well。",
        explain: "good 形容人/东西，well 说做得好。"
      },
      {
        // R8 跨课复现：第 58 课（规则型对照）
        kind: "arrange",
        promptZh: "再对照一句——第 58 课学过：她跑得快。",
        tokens: ["She", "runs", "quickly."],
        answer: "She runs quickly.",
        explain: "复现第 58 课：quickly 是规则型（quick 加 -ly）——今天两位常客不这么走。"
      },
      {
        // R9 变形/替换：常客换规则型（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子换样子词：「She sings very well.」把「好」换成「声音大（loud）」，样子词要怎么变？",
        replaceBase: "She sings very well.",
        replaceTarget: "把「好」换成「声音大」",
        options: ["loudly", "loud", "loudly very"],
        answer: "loudly",
        explain: "loud 加 -ly 变 loudly：sings loudly——规则型照旧；well / fast 是两位常客。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：她唱得很好。",
        tokens: ["She", "sings", "very", "well."],
        distractors: ["good"],
        answer: "She sings very well."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：她唱得好吗？",
        tokens: ["Does", "she", "sing", "well?"],
        distractors: ["sings"],
        answer: "Does she sing well?"
      },
      {
        promptZh: "复习第 58 课：她跑得快。",
        tokens: ["She", "runs", "quickly."],
        distractors: ["quick"],
        answer: "She runs quickly."
      },
      {
        promptZh: "收个尾——你想说：他跑得很快。",
        tokens: ["He", "runs", "very", "fast."],
        distractors: ["fastly"],
        answer: "He runs very fast."
      }
    ],
    recall: {
      promptZh: "家庭聚会上姐姐唱完一首歌，大家都看着你。凭记忆，写出你那句夸她的话。",
      intentZh: "她唱得很好。",
      answer: "She sings very well.",
      noteZh: "well 是 good 的样子词；very 贴在它前面。"
    },
    huntCaseIds: ["hunt-stage-note"]
  },

  // ── 第八批 · L60 收口课（there was/were）：把 L26 存在句翻到「昨天版」——回忆的开关（批八 PRD §2）──
  {
    id: "lesson-60-there-was",
    number: 60,
    title: "昨天公园里有…",
    grammarLabel: "回忆版存在句 · there was / there were",
    episode: "小美的一天 六十",
    scene: "mansion",
    cover: cover26,
    sceneSetupZh: "周末整理相册，小美翻出上个月公园野餐的照片，跟你说「那天」有什么。",
    dialogueEn: "Look at this old photo!",
    dialogueZh: "小美举着一张照片跑过来。",
    intentZh: "那天公园里有一只鸟。",
    targetSentence: "There was a bird in the park.",
    blocks: [
      { text: "There was", role: "有（昨天版）" },
      { text: "a bird", role: "一只鸟" },
      { text: "in the park", role: "在公园里" }
    ],
    oneLineRule: "讲「昨天有什么」把 There is / are 换昨天版：单数 was、复数 were——There 先占位的老规矩不动。",
    examples: [
      { en: "There was a bird in the park.", zh: "那天公园里有一只鸟。" },
      { en: "There were two birds in the park.", zh: "那天公园里有两只鸟。" },
      { en: "There was a photo on the wall.", zh: "墙上曾有一张照片。" },
      { en: "There is a bird today.", zh: "今天有一只鸟。" }
    ],
    dialogue: [
      { who: "npc", en: "Look at this old photo!", zh: "小美举着一张照片跑过来。" },
      { who: "npc", en: "We had a picnic in the park.", zh: "她说：那天我们在公园野餐。" },
      { who: "me", en: "There was a bird in the park.", zh: "轮到你说了——那天公园里有一只鸟。" }
    ],
    contrast: [
      {
        wrong: "There have a book yesterday.",
        wrongMark: "have",
        correct: "There was a book yesterday.",
        whyZh: "存在的「有」用 There be，不用 have（第 26 课的老规矩）——昨天版就用 was：There was a book yesterday。"
      },
      {
        wrong: "There was two birds.",
        wrongMark: "was",
        correct: "There were two birds.",
        whyZh: "两只鸟是一群，用 were 搭档：There were two birds——单数 was、复数 were（第 51 课的配对）。"
      },
      {
        wrong: "Yesterday there is a bird.",
        wrongMark: "is",
        correct: "There was a bird yesterday.",
        whyZh: "句子开头说了昨天，动词要跟着换昨天版：is→was——时间点变了，搭档跟着变。"
      },
      {
        wrong: "There is a bird today.",
        wrongMark: null,
        correct: "There was a bird yesterday.",
        bothRight: true,
        whyZh: "两句都对——现在版（is）说今天、昨天版（was）说那天：同一只鸟，两个时间点。"
      },
      {
        wrong: "My birthday is on May third.",
        wrongMark: null,
        correct: "There was a bird in the park.",
        bothRight: true,
        whyZh: "两句都对——第 57 课的日期链复现：回忆那天说得出日期，也说得出「那天有什么」。"
      },
      {
        wrong: "There were flowers.",
        wrongMark: null,
        correct: "There was a flower.",
        bothRight: true,
        whyZh: "两句都对——一群用 were（There were flowers）、一朵用 was（There was a flower）：看后面东西的人数配对。"
      }
    ],
    variants: [
      { label: "肯定", en: "There was a bird in the park.", zh: "那天公园里有一只鸟。" },
      { label: "否定", en: "There wasn't a bird.", zh: "那天没有鸟。", noteZh: "not 跟 was 走：wasn't——There 先占位不动。" },
      { label: "疑问", en: "Was there a bird?", zh: "那天有鸟吗？", noteZh: "Was 搬句首——第 26 课「Is there 开头是问句」的搬法照旧。" }
    ],
    sceneSwings: [
      { sceneZh: "说那天公园里有两只鸟", en: "There were two birds in the park.", zh: "那天公园里有两只鸟。" },
      { sceneZh: "说那天没有鸟", en: "There wasn't a bird.", zh: "那天没有鸟。" },
      { sceneZh: "问那天有没有鸟", en: "Was there a bird?", zh: "那天有鸟吗？" }
    ],
    deepDive: {
      title: "存在句地图：现在版与昨天版",
      paragraphs: [
        "把第 26 课和今天连起来看：There 先占位说「有」——现在版用 is / are（There is a book / There are three apples），昨天版用 was / were（There was a bird / There were two birds）。",
        "搭档怎么选？看后面东西的人数：一个用 is / was，一群用 are / were。现在版和昨天版一一对应：is→was、are→were。",
        "为什么「有」不用 have？have 是「某人拥有」（I have a book），There be 是「某处存在」（There is a book）。中文都是「有」，英语两条路——第 26 课的老规矩，今天照样管用。",
        "回忆的开关就在这：翻相册说「那天有什么」，把动词换成昨天版，一句话就把你带回那天的公园——今天这批课到此收口，说日期、夸做得好、回忆昨天，日常小事你都能说利索了。"
      ]
    },
    summary: {
      rule: "说「那天有什么」：There 先占位 + 昨天版搭档——单数 was、复数 were。",
      points: [
        "There was a bird in the park. —— 一只用 was",
        "There were two birds. —— 一群用 were",
        "is→was、are→were —— 现在版和昨天版一一对应"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：那天公园里有一只鸟。",
        before: "There",
        after: "a bird in the park.",
        options: ["was", "were", "is"],
        answer: "was",
        explain: "一只鸟用单数搭档，回忆版就是 was：There was a bird。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：那天公园里有一只鸟。",
        tokens: ["There", "was", "a", "bird", "in", "the", "park."],
        answer: "There was a bird in the park.",
        explain: "There 先占位 + 昨天版搭档 was：回忆那天的公园。"
      },
      {
        // R8 跨课复现：第 26 课（现在版先站好，再换昨天版）
        kind: "arrange",
        promptZh: "先复习一小步——第 26 课学过：桌上有一本书。",
        tokens: ["There", "is", "a", "book", "on", "the", "desk."],
        answer: "There is a book on the desk.",
        explain: "复现第 26 课：现在版用 is——今天把同一句翻到昨天版就是 was。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["Yesterday", "there", "is", "a", "bird."],
        wrongToken: "is",
        answer: "is",
        correctionZh: "开头说了昨天，动词要换昨天版：Yesterday there was a bird。",
        explain: "时间点变了，搭档跟着变。"
      },
      {
        // R8 跨课复现：第 34 课（was 的另一个岗位：过去进行）
        kind: "arrange",
        promptZh: "再对照一句——第 34 课学过：三点时我正在画画。",
        tokens: ["I", "was", "drawing", "at", "three."],
        answer: "I was drawing at three.",
        explain: "复现第 34 课：was + 动词ing 是「正在做」；今天 was + There 句是「那天有」——was 的两班岗。"
      },
      {
        // R9 变形/替换：单数换复数（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「There was a bird in the park.」把「一只鸟」换成「两只鸟」，搭档要怎么变？",
        replaceBase: "There was a bird in the park.",
        replaceTarget: "把 a bird 换成 two birds",
        options: ["were", "was", "are"],
        answer: "were",
        explain: "两只鸟是一群，用 were 搭档：There were two birds——回忆版的一群也是 were。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：那天公园里有一只鸟。",
        tokens: ["There", "was", "a", "bird", "in", "the", "park."],
        distractors: ["were"],
        answer: "There was a bird in the park."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：那天有鸟吗？",
        tokens: ["Was", "there", "a", "bird?"],
        distractors: ["Is"],
        answer: "Was there a bird?"
      },
      {
        // R8 跨课复现：第 26 课原句
        promptZh: "复习第 26 课：桌上有一本书。",
        tokens: ["There", "is", "a", "book", "on", "the", "desk."],
        distractors: ["are"],
        answer: "There is a book on the desk."
      },
      {
        // 全批收官总句
        promptZh: "全批收官——你想说：那天公园里有两只鸟。",
        tokens: ["There", "were", "two", "birds", "in", "the", "park."],
        distractors: ["was"],
        answer: "There were two birds in the park."
      }
    ],
    recall: {
      promptZh: "翻相册时小美举起一张公园野餐的照片。看着那张照片，凭记忆，写出你那句英文。",
      intentZh: "那天公园里有一只鸟。",
      answer: "There was a bird in the park.",
      noteZh: "There 先占位 + 昨天版搭档 was：单数用 was。"
    },
    huntCaseIds: ["hunt-old-photo"]
  },

  // ── 第九批 · L61 客气请求①（Could you…?）：L32 礼貌三档第三档上岗——请人帮忙最客气的一档（批九 PRD §2）──
  {
    id: "lesson-61-could-you",
    number: 61,
    title: "能帮我一下吗",
    grammarLabel: "客气请求 · Could you…?",
    episode: "小美的一天 六十一",
    scene: "city",
    cover: cover31,
    sceneSetupZh: "街角，小美抱着一摞书腾不出手，请路人帮她把门推开。",
    dialogueEn: "Could you help me?",
    dialogueZh: "你抱着书，朝旁边的大姐姐开口。",
    intentZh: "能帮我一下吗？",
    targetSentence: "Could you help me?",
    blocks: [
      { text: "Could you", role: "能（请你）——最客气的一档" },
      { text: "help", role: "帮（穿原样）" },
      { text: "me", role: "我" }
    ],
    oneLineRule: "请人帮忙用 Could you + 动词原形——比 Can you 更客气；动词不垫 to、不换装。",
    examples: [
      { en: "Could you help me?", zh: "能帮我一下吗？" },
      { en: "Could you close the door?", zh: "能把门关上吗？" },
      { en: "Could you help me, please?", zh: "能帮我一下吗？（口气更软）" },
      { en: "I could help you.", zh: "我可以帮你。（我能帮上忙）" }
    ],
    dialogue: [
      { who: "npc", en: "Oh, can I help you?", zh: "大姐姐看到你抱着一摞书。" },
      { who: "npc", en: "The door is heavy.", zh: "她指了指那扇门。" },
      { who: "me", en: "Could you help me?", zh: "轮到你说了——能帮我一下吗？" }
    ],
    contrast: [
      {
        wrong: "Could you to help me?",
        wrongMark: "to",
        correct: "Could you help me?",
        whyZh: "垫板不进这扇门：Could you help——家族不垫板（第 47 课的老规矩）。"
      },
      {
        wrong: "Could you helping me?",
        wrongMark: "helping",
        correct: "Could you help me?",
        whyZh: "动词穿原样，不换 -ing 装：Could you help me——跟 must/should 家族一个规矩。"
      },
      {
        wrong: "Can you help me?",
        wrongMark: null,
        correct: "Could you help me?",
        bothRight: true,
        whyZh: "两句都对——Can you 直接、Could you 更客气：第 32 课礼貌三档，今天升到最客气档。"
      },
      {
        wrong: "Close the door, please.",
        wrongMark: null,
        correct: "Could you close the door?",
        bothRight: true,
        whyZh: "两句都对——please 版直白、could 版最客气：请人做事两档都能用，看场合挑。"
      },
      {
        wrong: "Close the door, please!",
        wrongMark: null,
        correct: "Could you close the door?",
        bothRight: true,
        whyZh: "两句都对——第 32 课三档的起点和顶点：Close the door, please（直白）→ Could you close the door（最客气）。"
      },
      {
        wrong: "Can I have a milk tea?",
        wrongMark: null,
        correct: "Could you help me?",
        bothRight: true,
        whyZh: "两句都对——要东西问「我能不能」（Can I…，第 14 课）；请人帮忙问「你能不能」（Could you…，今天）——两个方向的两句问话。"
      }
    ],
    variants: [
      { label: "肯定", en: "I could help you.", zh: "我可以帮你。", noteZh: "could 站动词前、动词穿原样：I could help you。" },
      { label: "否定", en: "I couldn't help you.", zh: "我没能帮上你。", noteZh: "could 加 not 缩成 couldn't——跟 can→can't 一个规矩。" },
      { label: "疑问", en: "Could you help me, please?", zh: "能帮我一下吗？（口气更软）", noteZh: "再加一个 please，口气更软。" }
    ],
    sceneSwings: [
      { sceneZh: "请人把窗打开", en: "Could you open the window?", zh: "能把窗打开吗？" },
      { sceneZh: "请人等一下", en: "Could you wait a minute?", zh: "能等一下吗？" },
      { sceneZh: "说可以帮对方", en: "I could help you.", zh: "我可以帮你。" }
    ],
    deepDive: {
      title: "could 的两班岗",
      paragraphs: [
        "第 32 课你见过「礼貌三档」：Close the door（直白）→ Close the door, please（加个 please）→ Could you close the door?（最客气）。第三档今天正式上岗——请人帮忙、问路、求助，这一档最稳妥。",
        "could 和 can 一样是不变词：后面动词穿原样（Could you help me），不垫 to、不换 -ing——跟 must/should 家族同一个规矩。",
        "could 还有另一个班岗：说「能」（有本事）。I could help you 就是「我可以帮你」——说出来的事，不是问句。这个班岗你现在认得、听得出就行，用得到的时候它自己会顺出来。",
        "三个门卫排排站：Can you help me?（直接）→ Could you help me?（客气）→ Could you help me, please?（最软）——需要哪个请哪个。"
      ]
    },
    summary: {
      rule: "请人帮忙用 Could you + 动词原形——比 Can you 更客气；不垫板、不换装。",
      points: [
        "Could you help me? —— 最客气的一档",
        "Can you / Could you —— 两句都对，口气不同",
        "I could help you. —— could 的另一个班岗（我能帮上）"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：能帮我一下吗？",
        before: "Could you",
        after: "me?",
        options: ["help", "to help", "helping"],
        answer: "help",
        explain: "家族不垫板、不换装：Could you help me。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：能帮我一下吗？",
        tokens: ["Could", "you", "help", "me?"],
        answer: "Could you help me?",
        explain: "请人帮忙最客气的一档：Could you + 动词原形。"
      },
      {
        // R8 跨课复现：第 32 课（礼貌三档起点）
        kind: "arrange",
        promptZh: "先复习一小步——第 32 课学过：请把门关上。",
        tokens: ["Close", "the", "door,", "please!"],
        answer: "Close the door, please!",
        explain: "复现第 32 课：礼貌三档的起点——今天把第三档接上。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["Could", "you", "to", "help", "me?"],
        wrongToken: "to",
        answer: "to",
        correctionZh: "垫板不进这扇门：Could you help me。",
        explain: "家族不垫板——第 47 课的老规矩。"
      },
      {
        // R8 跨课复现：第 26 课（There 先占位）
        kind: "arrange",
        promptZh: "再对照一句——第 26 课学过：桌上有一本书。",
        tokens: ["There", "is", "a", "book", "on", "the", "desk."],
        answer: "There is a book on the desk.",
        explain: "复现第 26 课：今天小美怀里抱的就是一摞书。"
      },
      {
        // R9 变形/替换：换动词（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「Could you help me?」把「帮忙」换成「等一下（wait a minute）」，动词要怎么变？",
        replaceBase: "Could you help me?",
        replaceTarget: "把 help 换成 wait a minute",
        options: ["wait a minute", "to wait a minute", "waiting a minute"],
        answer: "wait a minute",
        explain: "穿原样、不垫板：Could you wait a minute。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：能帮我一下吗？",
        tokens: ["Could", "you", "help", "me?"],
        distractors: ["to"],
        answer: "Could you help me?"
      },
      {
        // R06 变体扩量：与 variants 否定卡逐字一致的否定变体题
        promptZh: "你想说：我没能帮上你。",
        tokens: ["I", "couldn't", "help", "you."],
        distractors: ["to"],
        answer: "I couldn't help you."
      },
      {
        // R8 跨课复现：第 14 课原句
        promptZh: "复习第 14 课：我能要一杯奶茶吗？",
        tokens: ["Can", "I", "have", "a", "milk", "tea?"],
        distractors: ["Could"],
        answer: "Can I have a milk tea?"
      },
      {
        promptZh: "收个尾——你想说：能帮我一下吗？（口气再软一点）",
        tokens: ["Could", "you", "help", "me,", "please?"],
        distractors: ["helping"],
        answer: "Could you help me, please?"
      }
    ],
    recall: {
      promptZh: "街角，小美抱着一摞书腾不出手，想请旁边的大姐姐帮忙。凭记忆，写出她那句英文。",
      intentZh: "能帮我一下吗？",
      answer: "Could you help me?",
      noteZh: "第三档上岗：Could you + 动词原形——不垫板、不换装。"
    },
    huntCaseIds: ["hunt-help-note"]
  },

  // ── 第九批 · L62 客气想要（would like）：L4 对白种子收口——want 的客气版，会说会问（批九 PRD §2）──
  {
    id: "lesson-62-would-like",
    number: 62,
    title: "你想要点什么",
    grammarLabel: "客气想要 · would like",
    episode: "小美的一天 六十二",
    scene: "mansion",
    cover: cover32,
    sceneSetupZh: "周末，小美去阿姨家做客，阿姨端出茶壶招待她。",
    dialogueEn: "What would you like?",
    dialogueZh: "阿姨提着茶壶笑着问你。",
    intentZh: "我要一杯茶。",
    targetSentence: "I would like a cup of tea.",
    blocks: [
      { text: "I would like", role: "我想要（客气版）" },
      { text: "a cup of tea", role: "一杯茶" }
    ],
    oneLineRule: "想把「想要」说客气一点，用 I would like：比 I want 软一档，would 家族穿原样。",
    examples: [
      { en: "I would like a cup of tea.", zh: "我要一杯茶。" },
      { en: "What would you like?", zh: "你想要点什么？" },
      { en: "She would like a cup of coffee.", zh: "她要一杯咖啡。" },
      { en: "I would like to sleep.", zh: "我想睡觉。" }
    ],
    dialogue: [
      { who: "npc", en: "Come in, please!", zh: "阿姨开门把你让进屋。" },
      { who: "npc", en: "What would you like?", zh: "她提着茶壶问你想喝点什么。" },
      { who: "me", en: "I would like a cup of tea.", zh: "轮到你说了——你要一杯茶。" }
    ],
    contrast: [
      {
        wrong: "I would like to tea.",
        wrongMark: "to",
        correct: "I would like a cup of tea.",
        whyZh: "想要的东西直接跟上，不垫板：would like a cup of tea——垫板是给动作用的（would like to sleep）。"
      },
      {
        wrong: "I would likes tea.",
        wrongMark: "likes",
        correct: "I would like a cup of tea.",
        whyZh: "would 家族穿原样：like 不加 -s——跟 must/should 家族一个规矩。"
      },
      {
        wrong: "I want a cup of tea.",
        wrongMark: null,
        correct: "I would like a cup of tea.",
        bothRight: true,
        whyZh: "两句都对——want 直接、would like 客气：两档口气，看场合挑。"
      },
      {
        wrong: "What would you like?",
        wrongMark: null,
        correct: "I would like a cup of tea.",
        bothRight: true,
        whyZh: "两句都对——一句问、一句答：第 4 课听过的问法，今天连答句一起会了。"
      },
      {
        wrong: "I would like to sleep.",
        wrongMark: null,
        correct: "I would like a cup of tea.",
        bothRight: true,
        whyZh: "两句都对——想要「东西」直接跟上（a cup of tea）；想要「做事」垫块 to（to sleep）。"
      },
      {
        wrong: "Can I have a milk tea?",
        wrongMark: null,
        correct: "I would like a cup of tea.",
        bothRight: true,
        whyZh: "两句都对——要东西两说法：问店员用 Can I have（第 14 课）；客气地说「我要」用 I would like（今天）。"
      }
    ],
    variants: [
      { label: "肯定", en: "I would like a cup of tea.", zh: "我要一杯茶。" },
      { label: "否定", en: "I wouldn't like coffee.", zh: "我不想要咖啡。", noteZh: "would 加 not 缩成 wouldn't，直接跟在 I 后。" },
      { label: "疑问", en: "What would you like?", zh: "你想要点什么？", noteZh: "第 4 课听过的问法——今天会自己说了。" }
    ],
    sceneSwings: [
      { sceneZh: "说想喝一杯咖啡", en: "I would like a cup of coffee.", zh: "我要一杯咖啡。" },
      { sceneZh: "问客人想要什么", en: "What would you like?", zh: "你想要点什么？" },
      { sceneZh: "说她想睡觉", en: "She would like to sleep.", zh: "她想睡觉。" }
    ],
    deepDive: {
      title: "would like 的两个用法",
      paragraphs: [
        "想要「东西」：would like 后面直接跟上——I would like a cup of tea。想要「做事」：在中间垫一块 to——I would like to sleep。看后面跟的是什么，垫不垫板就定了。",
        "would like 是 want 的客气版：I want a cup of tea（直接）→ I would like a cup of tea（客气）。点单、做客、招待客人，客气一档都用它。",
        "would 也是「不变词」家族的一员：I / you / she / he……谁当主语，would like 都穿原样——She would like a cup of coffee（likes 的 -s 不给它穿）。",
        "第 4 课你在奶茶店听过 What would you like?——当时你只会答 I want a milk tea。今天你连问带答都有了：问 What would you like?，答 I would like a cup of tea。"
      ]
    },
    summary: {
      rule: "客气想要用 would like：I would like a cup of tea——想要东西直接跟，想要做事垫 to。",
      points: [
        "I would like a cup of tea. —— 客气版的「我要」",
        "What would you like? —— 第 4 课听过，今天会问也会答",
        "I would like to sleep. —— 想要做事，垫块 to"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我要一杯茶。",
        before: "I would like",
        after: "tea.",
        options: ["a cup of", "to", "cup"],
        answer: "a cup of",
        explain: "想要的东西直接跟上：a cup of tea——不垫板。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我要一杯茶。",
        tokens: ["I", "would", "like", "a", "cup", "of", "tea."],
        answer: "I would like a cup of tea.",
        explain: "would like + 想要的东西：a cup of tea。"
      },
      {
        // R8 跨课复现：第 4 课（问句种子——本课收口）
        kind: "arrange",
        promptZh: "先复习一小步——第 4 课听过：你想要点什么？",
        tokens: ["What", "would", "you", "like?"],
        answer: "What would you like?",
        explain: "复现第 4 课：当时你只会答——今天连问带答都有了。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "would", "likes", "coffee."],
        wrongToken: "likes",
        answer: "likes",
        correctionZh: "would 家族穿原样：would like coffee。",
        explain: "likes 的 -s 不给它穿。"
      },
      {
        // R8 跨课复现：第 16 课（家族点名）
        kind: "arrange",
        promptZh: "再对照一句——第 16 课学过：我今天必须完成作业。",
        tokens: ["I", "must", "finish", "my", "homework", "today."],
        answer: "I must finish my homework today.",
        explain: "复现第 16 课：must 家族穿原样——今天认识的 would 也是这一家的。"
      },
      {
        // R9 变形/替换：换主语（家族永不变形）
        kind: "replace",
        promptZh: "句子变身：「I would like a cup of tea.」把 I 换成 She，中间那截要怎么变？",
        replaceBase: "I would like a cup of tea.",
        replaceTarget: "把 I 换成 She",
        options: ["would like", "would likes", "will like"],
        answer: "would like",
        explain: "家族永不变形：She would like a cup of tea——换主语也不给它加 -s。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我要一杯茶。",
        tokens: ["I", "would", "like", "a", "cup", "of", "tea."],
        distractors: ["to"],
        answer: "I would like a cup of tea."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：你想要点什么？",
        tokens: ["What", "would", "you", "like?"],
        distractors: ["did"],
        answer: "What would you like?"
      },
      {
        // R8 跨课复现：第 14 课原句
        promptZh: "复习第 14 课：我能要一杯奶茶吗？",
        tokens: ["Can", "I", "have", "a", "milk", "tea?"],
        distractors: ["Could"],
        answer: "Can I have a milk tea?"
      },
      {
        promptZh: "收个尾——你想说：她要一杯咖啡。",
        tokens: ["She", "would", "like", "a", "cup", "of", "coffee."],
        distractors: ["likes"],
        answer: "She would like a cup of coffee."
      }
    ],
    recall: {
      promptZh: "阿姨家做客，她提着茶壶问你想喝点什么。凭记忆，写出你那句英文。",
      intentZh: "我要一杯茶。",
      answer: "I would like a cup of tea.",
      noteZh: "客气版「我要」：would like + 东西——不垫板。"
    },
    huntCaseIds: ["hunt-guest-note"]
  },

  // ── 第九批 · L63 给东西（双宾语）：先给谁、后给什么；东西变 it 要翻身垫 to（批九 PRD §2）──
  {
    id: "lesson-63-give-me",
    number: 63,
    title: "把它递给我",
    grammarLabel: "给东西 · give me the book / give it to me",
    episode: "小美的一天 六十三",
    scene: "campus",
    cover: cover33,
    sceneSetupZh: "手工课上，小美两只手都占着，请同桌把桌上的书递过来。",
    dialogueEn: "Please give me the book.",
    dialogueZh: "你朝同桌开口。",
    intentZh: "请把那本书递给我。",
    targetSentence: "Please give me the book.",
    blocks: [
      { text: "Please give me", role: "请给我——先给谁" },
      { text: "the book", role: "那本书——后给什么" }
    ],
    oneLineRule: "给东西：先给谁、后给什么（give me the book）——中文同序；东西换成 it 时，要跑到后面垫上 to（give it to me）。",
    examples: [
      { en: "Please give me the book.", zh: "请把那本书递给我。" },
      { en: "Please give it to me.", zh: "请把它递给我。" },
      { en: "Please pass me the pen.", zh: "请把那支笔递给我。" },
      { en: "Please give me the pen.", zh: "请把那支笔给我。" }
    ],
    dialogue: [
      { who: "npc", en: "Your hands are full!", zh: "同桌看你两手都占着。" },
      { who: "npc", en: "What do you need?", zh: "她问你还要什么。" },
      { who: "me", en: "Please give me the book.", zh: "轮到你说了——请把那本书递给我。" }
    ],
    contrast: [
      {
        wrong: "Give me it.",
        wrongMark: "me it",
        correct: "Give it to me.",
        whyZh: "东西一变成 it，就要绕到后面垫 to：give it to me——「先给谁、后给什么」的规矩，碰到小词要翻个身。"
      },
      {
        wrong: "Give the book me.",
        wrongMark: "the book me",
        correct: "Give me the book.",
        whyZh: "两样东西挤一块会撞车：谁在前（me）、什么在后（the book）——中文「给我那本书」就是这个顺序。"
      },
      {
        wrong: "Give me the book.",
        wrongMark: null,
        correct: "Give the book to me.",
        bothRight: true,
        whyZh: "两句都对——顺口说 me the book 版，想强调「给谁」就说 the book to me 版。"
      },
      {
        wrong: "Please pass me the pen.",
        wrongMark: null,
        correct: "Please give me the pen.",
        bothRight: true,
        whyZh: "两句都对——递东西两兄弟 pass 和 give 走同一套语序：先给谁、后给什么。"
      },
      {
        wrong: "There is a book on the desk.",
        wrongMark: null,
        correct: "Please give me the book.",
        bothRight: true,
        whyZh: "两句都对——第 26 课「桌上有本书」＋今天「请把书递给我」：同一本书，从桌上到你手里。"
      },
      {
        wrong: "Can I have a milk tea?",
        wrongMark: null,
        correct: "Could you help me?",
        bothRight: true,
        whyZh: "两句都对——要东西（Can I…第 14 课）＋请帮忙（Could you…第 61 课）：「给与请」两个方向。"
      }
    ],
    variants: [
      { label: "肯定", en: "Please give me the book.", zh: "请把那本书递给我。" },
      { label: "否定", en: "Don't give me the book.", zh: "别把书递给我。", noteZh: "别做在前面垫 Don't：Don't give——第 32 课的老规矩。" },
      { label: "疑问", en: "Can you give me the book?", zh: "能把书递给我吗？", noteZh: "请人递东西的问句——用 Could 更客气（第 61 课）。" }
    ],
    sceneSwings: [
      { sceneZh: "说请把那支笔递给我", en: "Please pass me the pen.", zh: "请把那支笔递给我。" },
      { sceneZh: "说请把它递给我（it 版）", en: "Please give it to me.", zh: "请把它递给我。" },
      { sceneZh: "问对方能不能把书递过来", en: "Can you give me the book?", zh: "能把书递给我吗？" }
    ],
    deepDive: {
      title: "先给谁、后给什么",
      paragraphs: [
        "中文说「给我一本书」，英语正好同一个顺序：give me a book——你早就有的直觉，今天正式点破。",
        "两样东西跟在一个动作后面，顺序有讲究：先给谁（me）、后给什么（the book）。挤在一起会撞车——*give the book me 就不行。",
        "那个「什么」要是换成了小词 it（它），就得跑到后面、垫上一块 to：give it to me。小词太轻，站不住前面那个位子。",
        "递东西的动词不止 give：pass（递）、show（给谁看）都走同一套。以后再遇到新的，照样套。"
      ]
    },
    summary: {
      rule: "给东西：先给谁、后给什么（give me the book）；东西变 it 要翻身垫 to（give it to me）。",
      points: [
        "Please give me the book. —— 先给谁、后给什么",
        "Please give it to me. —— it 版：翻身垫 to",
        "pass / give 同一套 —— 递东西两兄弟"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：请把那本书递给我。",
        before: "Please give",
        after: "the book.",
        options: ["me", "to me", "my"],
        answer: "me",
        explain: "先给谁：me 站在 give 后面第一位——give me the book。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：请把那本书递给我。",
        tokens: ["Please", "give", "me", "the", "book."],
        answer: "Please give me the book.",
        explain: "先给谁（me）、后给什么（the book）。"
      },
      {
        // R8 跨课复现：第 26 课（桌上那本书）
        kind: "arrange",
        promptZh: "先复习一小步——第 26 课学过：桌上有一本书。",
        tokens: ["There", "is", "a", "book", "on", "the", "desk."],
        answer: "There is a book on the desk.",
        explain: "复现第 26 课：桌上那本书——今天把它递到手。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["Please", "give", "it", "me."],
        wrongToken: "me.",
        answer: "me.",
        correctionZh: "要给谁垫块 to：give it to me——it 站前面时，me 要垫 to。",
        explain: "东西变 it 要翻身垫 to。"
      },
      {
        // R8 跨课复现：第 61 课（请帮忙）
        kind: "arrange",
        promptZh: "再对照一句——第 61 课学过：能帮我一下吗？",
        tokens: ["Could", "you", "help", "me?"],
        answer: "Could you help me?",
        explain: "复现第 61 课：请人帮忙最客气的一档——今天请人递东西。"
      },
      {
        // R9 变形/替换：东西换 it（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「Please give me the book.」把那本书换成小词 it，句子要怎么变？",
        replaceBase: "Please give me the book.",
        replaceTarget: "把 the book 换成 it",
        options: ["Please give it to me.", "Please give me it.", "Please give it me."],
        answer: "Please give it to me.",
        explain: "东西变 it 要翻身垫 to：give it to me——今天最容易忘的一步。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：请把那本书递给我。",
        tokens: ["Please", "give", "me", "the", "book."],
        distractors: ["my"],
        answer: "Please give me the book."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：能把书递给我吗？",
        tokens: ["Can", "you", "give", "me", "the", "book?"],
        distractors: ["Does"],
        answer: "Can you give me the book?"
      },
      {
        promptZh: "你想说：请把它递给我。",
        tokens: ["Please", "give", "it", "to", "me."],
        distractors: ["for"],
        answer: "Please give it to me."
      },
      {
        // R8 跨课复现：第 61 课原句
        promptZh: "复习第 61 课：能帮我一下吗？",
        tokens: ["Could", "you", "help", "me?"],
        distractors: ["to"],
        answer: "Could you help me?"
      }
    ],
    recall: {
      promptZh: "手工课上，小美两只手都占着，请同桌把桌上的书递过来。凭记忆，写出她那句英文。",
      intentZh: "请把那本书递给我。",
      answer: "Please give me the book.",
      noteZh: "先给谁、后给什么：give me the book。"
    },
    huntCaseIds: ["hunt-handout-note"]
  },

  // ── 第九批 · L64 收尾动词（finish + 名字版）：L45 门卫体系扩员第一站——又一个单门门卫（批九 PRD §2）──
  {
    id: "lesson-64-finish-doing",
    number: 64,
    title: "我看完啦",
    grammarLabel: "收尾动词 · finish + 名字版",
    episode: "小美的一天 六十四",
    scene: "mansion",
    cover: cover34,
    sceneSetupZh: "周末晚上，小美合上刚读完的故事书，跟姐姐说「我看完啦」。",
    dialogueEn: "I finished reading the book.",
    dialogueZh: "小美合上书，朝姐姐晃了晃。",
    intentZh: "我看完这本书啦。",
    targetSentence: "I finished reading the book.",
    blocks: [
      { text: "I finished", role: "我完成了（收尾）" },
      { text: "reading the book", role: "读这本书（名字版）" }
    ],
    oneLineRule: "说「做完了」用 finish + 名字版（finish reading）——它和第 45 课的 enjoy 一样，门只开一扇。",
    examples: [
      { en: "I finished reading the book.", zh: "我看完这本书啦。" },
      { en: "I finished my homework.", zh: "我写完作业了。" },
      { en: "She finished drawing a picture.", zh: "她画完了一幅画。" },
      { en: "I enjoy reading.", zh: "我享受读书。" }
    ],
    dialogue: [
      { who: "npc", en: "Is the story good?", zh: "姐姐凑过来问。" },
      { who: "npc", en: "You read so fast!", zh: "她看你已经翻到最后一页。" },
      { who: "me", en: "I finished reading the book.", zh: "轮到你说了——我看完这本书啦。" }
    ],
    contrast: [
      {
        wrong: "I finished to read the book.",
        wrongMark: "to",
        correct: "I finished reading the book.",
        whyZh: "finish 的门也开一扇：只认名字版——跟第 45 课 enjoy 是同一类门卫，to 进不去。"
      },
      {
        wrong: "I finished read the book.",
        wrongMark: "read",
        correct: "I finished reading the book.",
        whyZh: "光板词不能进门：read 加 -ing 变名字版（reading），守卫才放行。"
      },
      {
        wrong: "I finished reading the book.",
        wrongMark: null,
        correct: "I finished the book.",
        bothRight: true,
        whyZh: "两句都对——想说清「做的事情」就带 reading；直接说「看完书了」也完整。"
      },
      {
        wrong: "I like reading.",
        wrongMark: null,
        correct: "I finished reading.",
        bothRight: true,
        whyZh: "两句都对——同一个名字版 reading，门口换了守卫：like 也认、finish 也认——名字版是通行证。"
      },
      {
        wrong: "I enjoy reading.",
        wrongMark: null,
        correct: "I finished reading the book.",
        bothRight: true,
        whyZh: "两句都对——第 45 课 enjoy 的门卫又见面了：enjoy reading、finish reading——名字版两边都进得去。"
      },
      {
        wrong: "I have done my homework.",
        wrongMark: null,
        correct: "I finished my homework.",
        bothRight: true,
        whyZh: "两句都对——「做完了」两条路：have done（第 21 课的做过版）或 finished（今天的收尾词）。"
      }
    ],
    variants: [
      { label: "肯定", en: "I finished reading the book.", zh: "我看完这本书啦。" },
      { label: "否定", en: "I didn't finish reading the book.", zh: "我还没看完这本书。", noteZh: "昨天的「没做完」：didn't 挡住 finish，reading 不动。" },
      { label: "疑问", en: "Did you finish reading the book?", zh: "你看完这本书了吗？", noteZh: "Did 站句首，finish 穿原样，reading 留在原地。" }
    ],
    sceneSwings: [
      { sceneZh: "说写完作业了", en: "I finished my homework.", zh: "我写完作业了。" },
      { sceneZh: "说她画完了一幅画", en: "She finished drawing a picture.", zh: "她画完了一幅画。" },
      { sceneZh: "问对方看完书了吗", en: "Did you finish reading the book?", zh: "你看完这本书了吗？" }
    ],
    deepDive: {
      title: "又一个单门门卫",
      paragraphs: [
        "第 45 课认识过 enjoy 的门：只认名字版（enjoy reading），to 进不去。今天的 finish 是同一个脾气：finish reading、finish drawing——只开一扇门。",
        "「名字版」是什么？就是把动作穿上 -ing 外套、当「做的事情」来用：read → reading、draw → drawing。它在 like / enjoy / finish 这些门卫门前都通行。",
        "也有动词门口是垫板的：want to travel（第 15 课）、would like to sleep（第 62 课）——同一个动作，门口规矩不同。遇到新动词，看一眼它认哪一种。",
        "门卫名单还会加长：后面你还会遇到更多「只认名字版」或「只认垫板」的动词——一个一个遇，不着急。"
      ]
    },
    summary: {
      rule: "做完了 = finish + 名字版：finish reading——门口规矩跟 enjoy 一样，只开一扇。",
      points: [
        "I finished reading the book. —— 收尾的门 + 名字版",
        "I finished my homework. —— 直接说「做完了什么」也完整",
        "I enjoy reading. / I finished reading. —— 名字版两边都进得去"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我看完这本书啦。",
        before: "I finished",
        after: "the book.",
        options: ["reading", "to read", "read"],
        answer: "reading",
        explain: "finish 的门只开一扇：只认名字版 reading。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我看完这本书啦。",
        tokens: ["I", "finished", "reading", "the", "book."],
        answer: "I finished reading the book.",
        explain: "收尾的门 + 名字版：finished reading。"
      },
      {
        // R8 跨课复现：第 45 课（门卫家族前一站）
        kind: "arrange",
        promptZh: "先复习一小步——第 45 课学过：我享受读书。",
        tokens: ["I", "enjoy", "reading."],
        answer: "I enjoy reading.",
        explain: "复现第 45 课：enjoy 的门——今天再认识一个新门卫 finish。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "finished", "to", "read", "the", "book."],
        wrongToken: "to",
        answer: "to",
        correctionZh: "垫板进不了 finish 的门：finished reading。",
        explain: "只认名字版——第 45 课同款门卫。"
      },
      {
        // R8 跨课复现：第 42 课（名字版通行证）
        kind: "arrange",
        promptZh: "再对照一句——第 42 课学过：我喜欢读书。",
        tokens: ["I", "like", "reading."],
        answer: "I like reading.",
        explain: "复现第 42 课：like 也认名字版——reading 这张通行证拿着到处用。"
      },
      {
        // R9 变形/替换：换动词（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I finished reading the book.」把「读书」换成「画画（draw a picture）」，收尾句要怎么变？",
        replaceBase: "I finished reading the book.",
        replaceTarget: "把 reading the book 换成 draw a picture",
        options: ["drawing a picture", "draw a picture", "to draw a picture"],
        answer: "drawing a picture",
        explain: "名字版换上：finished drawing a picture——-ing 外套穿好。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我看完这本书啦。",
        tokens: ["I", "finished", "reading", "the", "book."],
        distractors: ["to"],
        answer: "I finished reading the book."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：你看完这本书了吗？",
        tokens: ["Did", "you", "finish", "reading", "the", "book?"],
        distractors: ["Does"],
        answer: "Did you finish reading the book?"
      },
      {
        promptZh: "你想说：我写完作业了。",
        tokens: ["I", "finished", "my", "homework."],
        distractors: ["to"],
        answer: "I finished my homework."
      },
      {
        // R8 跨课复现：第 45 课原句
        promptZh: "复习第 45 课：我享受读书。",
        tokens: ["I", "enjoy", "reading."],
        distractors: ["to"],
        answer: "I enjoy reading."
      }
    ],
    recall: {
      promptZh: "周末晚上，小美合上刚读完的故事书，跟姐姐说「我看完啦」。凭记忆，写出她那句英文。",
      intentZh: "我看完这本书啦。",
      answer: "I finished reading the book.",
      noteZh: "收尾的门 + 名字版：finished reading。"
    },
    huntCaseIds: ["hunt-reading-corner"]
  },

  // ── 第九批 · L65 一样（as…as）：两头卡住——与 L17「更…than」两家人对照（批九 PRD §2）──
  {
    id: "lesson-65-as-as",
    number: 65,
    title: "和你一样高",
    grammarLabel: "一样 · as tall as",
    episode: "小美的一天 六十五",
    scene: "campus",
    cover: cover35,
    sceneSetupZh: "体检日，走廊里排着量身高的队伍，小美和同桌靠着身高贴比个子。",
    dialogueEn: "He is as tall as me.",
    dialogueZh: "同桌踮起脚往贴纸上比划。",
    intentZh: "他和我一样高。",
    targetSentence: "He is as tall as me.",
    blocks: [
      { text: "He is", role: "他是" },
      { text: "as tall as", role: "一样高（两头卡住）" },
      { text: "me", role: "我" }
    ],
    oneLineRule: "说「一样」用 as…as 两头卡住（as tall as me）——两个 as 一个都不能丢。",
    examples: [
      { en: "He is as tall as me.", zh: "他和我一样高。" },
      { en: "She is as smart as her sister.", zh: "她和姐姐一样聪明。" },
      { en: "This book is as new as that one.", zh: "这本书和那本一样新。" },
      { en: "He is taller than me.", zh: "他比我高。" }
    ],
    dialogue: [
      { who: "npc", en: "Let's check our height!", zh: "同桌拉着你往身高贴那边站。" },
      { who: "npc", en: "Wow, look at this boy!", zh: "她指着旁边排队的男生。" },
      { who: "me", en: "He is as tall as me.", zh: "轮到你说了——他和我一样高。" }
    ],
    contrast: [
      {
        wrong: "He is as tall than me.",
        wrongMark: "than",
        correct: "He is as tall as me.",
        whyZh: "「一样」家不认 than：than 是隔壁「更…」家的门牌（第 17 课的老规矩）。"
      },
      {
        wrong: "He is tall as me.",
        wrongMark: null,
        correct: "He is as tall as me.",
        whyZh: "两头都要卡住：少一头 as，「一样」就散架。"
      },
      {
        wrong: "He is as taller as me.",
        wrongMark: "taller",
        correct: "He is as tall as me.",
        whyZh: "中间的词穿原样：加了 -er 是「更」家的人，进不了「一样」家的门。"
      },
      {
        wrong: "He is taller than me.",
        wrongMark: null,
        correct: "He is as tall as me.",
        bothRight: true,
        whyZh: "两句都对——一句「更高」（更…家）、一句「一样高」（一样家）：两家人各站一边。"
      },
      {
        wrong: "This boat is bigger than that one.",
        wrongMark: null,
        correct: "He is as tall as me.",
        bothRight: true,
        whyZh: "两句都对——第 17 课「更…家」的门牌又见：bigger than——今天学的是它隔壁的「一样家」。"
      },
      {
        wrong: "This one is mine.",
        wrongMark: null,
        correct: "He is as tall as me.",
        bothRight: true,
        whyZh: "两句都对——第 33 课认过 mine（我的）；今天的 me 是「我」——跟在 as 后面的用 me。"
      }
    ],
    variants: [
      { label: "肯定", en: "He is as tall as me.", zh: "他和我一样高。" },
      { label: "否定", en: "He is not as tall as me.", zh: "他不如我高。", noteZh: "not 跟 is 走——说不「一样」的常用说法。" },
      { label: "疑问", en: "Is he as tall as you?", zh: "他和你一样高吗？", noteZh: "Is 搬句首——两头卡住的中间那截不动。" }
    ],
    sceneSwings: [
      { sceneZh: "说她和她姐姐一样聪明", en: "She is as smart as her sister.", zh: "她和姐姐一样聪明。" },
      { sceneZh: "说这本书和那本一样新", en: "This book is as new as that one.", zh: "这本书和那本一样新。" },
      { sceneZh: "说他不如我高", en: "He is not as tall as me.", zh: "他不如我高。" }
    ],
    deepDive: {
      title: "「更」家和「一样」家",
      paragraphs: [
        "第 17 课认识过「更」家：bigger than、taller than——比下去用 than。今天认识隔壁的「一样」家：as tall as——一样用两个 as 卡住。",
        "两家人门牌不同：than 只在「更」家用；「一样」家的两个 as 一个都不能丢——as tall as me，少一头就散架。",
        "中间那个词穿原样：as tall as（不写 taller）、as smart as（不写 smarter）——加了 -er 就串门到「更」家去了。",
        "说不「一样」（不如）也简单：在第一个 is 后面加 not——He is not as tall as me（他不如我高）。"
      ]
    },
    summary: {
      rule: "说「一样」用 as…as 两头卡住：as tall as me——「更」家用 than，「一样」家用两个 as。",
      points: [
        "He is as tall as me. —— 两头卡住",
        "He is taller than me. —— 「更」家的门牌",
        "He is not as tall as me. —— 不如"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：他和我一样高。",
        before: "He is",
        after: "me.",
        options: ["as tall as", "taller than", "tall as"],
        answer: "as tall as",
        explain: "两头卡住：as tall as——少一头 as 就散架。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：他和我一样高。",
        tokens: ["He", "is", "as", "tall", "as", "me."],
        answer: "He is as tall as me.",
        explain: "两个 as 各卡一头：as tall as me。"
      },
      {
        // R8 跨课复现：第 17 课（「更」家门牌）
        kind: "arrange",
        promptZh: "先复习一小步——第 17 课学过：这条船比那条大。",
        tokens: ["This", "boat", "is", "bigger", "than", "that", "one."],
        answer: "This boat is bigger than that one.",
        explain: "复现第 17 课：「更」家用 than——今天隔壁「一样」家站好。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["He", "is", "as", "tall", "than", "me."],
        wrongToken: "than",
        answer: "than",
        correctionZh: "「一样」家不认 than：as tall as me。",
        explain: "than 是「更…」家的门牌。"
      },
      {
        // R8 跨课复现：第 31 课（the 家族）
        kind: "arrange",
        promptZh: "再对照一句——第 31 课学过：我要最大的那个苹果。",
        tokens: ["I", "want", "the", "biggest", "apple."],
        answer: "I want the biggest apple.",
        explain: "复现第 31 课：最大的（the biggest）——比较家族今天又多认了一家。"
      },
      {
        // R9 变形/替换：换形容（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「He is as tall as me.」把「高」换成「聪明（smart）」，中间那截要怎么变？",
        replaceBase: "He is as tall as me.",
        replaceTarget: "把 tall 换成 smart",
        options: ["as smart as", "as smarter as", "smart than"],
        answer: "as smart as",
        explain: "中间的词穿原样：as smart as——加了 -er 就串门了。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：他和我一样高。",
        tokens: ["He", "is", "as", "tall", "as", "me."],
        distractors: ["than"],
        answer: "He is as tall as me."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：他和你一样高吗？",
        tokens: ["Is", "he", "as", "tall", "as", "you?"],
        distractors: ["than"],
        answer: "Is he as tall as you?"
      },
      {
        promptZh: "你想说：这本书和那本一样新。",
        tokens: ["This", "book", "is", "as", "new", "as", "that", "one."],
        distractors: ["than"],
        answer: "This book is as new as that one."
      },
      {
        // R8 跨课复现：第 17 课原句
        promptZh: "复习第 17 课：这条船比那条大。",
        tokens: ["This", "boat", "is", "bigger", "than", "that", "one."],
        distractors: ["as"],
        answer: "This boat is bigger than that one."
      }
    ],
    recall: {
      promptZh: "体检日走廊，同桌指着旁边排队的男生让你看。凭记忆，写出你那句英文。",
      intentZh: "他和我一样高。",
      answer: "He is as tall as me.",
      noteZh: "两头卡住：as tall as——两个 as 一个都不能丢。"
    },
    huntCaseIds: ["hunt-height-chart"]
  },

  // ── 第九批 · L66 太…了装不下（too…to）：L32 风句种子转正——一条句子装中文两句；批收口（批九 PRD §2）──
  {
    id: "lesson-66-too-to",
    number: 66,
    title: "太重了拿不动",
    grammarLabel: "太…了装不下 · too…to",
    episode: "小美的一天 六十六",
    scene: "city",
    cover: cover36,
    sceneSetupZh: "搬家日，小美想一个人搬最大的纸箱，蹲下使劲抬了抬，纹丝不动。",
    dialogueEn: "It is too heavy to carry.",
    dialogueZh: "小美拍拍纸箱，朝姐姐摇摇头。",
    intentZh: "它太重了，拿不动。",
    targetSentence: "It is too heavy to carry.",
    blocks: [
      { text: "It is too heavy", role: "它太重了" },
      { text: "to carry", role: "搬不动（拿它没辙）" }
    ],
    oneLineRule: "说「太…了（所以）不能…」用 too + 词 + to + 动作：too heavy to carry——一条句子装中文两句。",
    examples: [
      { en: "It is too heavy to carry.", zh: "它太重了，拿不动。" },
      { en: "It is too hot to sleep.", zh: "太热了，睡不着。" },
      { en: "It is too dark to see.", zh: "太黑了，看不见。" },
      { en: "The wind is too strong.", zh: "风太大了。" }
    ],
    dialogue: [
      { who: "npc", en: "Need a hand?", zh: "姐姐抱着一摞盘子路过。" },
      { who: "npc", en: "That box looks big!", zh: "她看了一眼那个大纸箱。" },
      { who: "me", en: "It is too heavy to carry.", zh: "轮到你说了——它太重了，拿不动。" }
    ],
    contrast: [
      {
        wrong: "The box is too heavy that I can't carry it.",
        wrongMark: "that",
        correct: "The box is too heavy to carry.",
        whyZh: "中文「太…了（所以）不能…」两句直译会超载：英语一条句子就装下了——too…to。"
      },
      {
        wrong: "It is too heavy to carry it.",
        wrongMark: "it.",
        correct: "It is too heavy to carry.",
        whyZh: "to 后面不用再把东西指一遍——它已经在句子头上了。"
      },
      {
        wrong: "The wind is very strong to go out.",
        wrongMark: "very",
        correct: "The wind is too strong to go out.",
        whyZh: "「太…了装不下」的位子给 too：「非常」只说很大，说不出「不能出门」。"
      },
      {
        wrong: "It is very heavy.",
        wrongMark: null,
        correct: "It is too heavy to carry.",
        bothRight: true,
        whyZh: "两句都对——一句只说「很重」；想带上「拿不动」，就在词前放 too、后面接 to 动作。"
      },
      {
        wrong: "The wind is too strong.",
        wrongMark: null,
        correct: "It is too heavy to carry.",
        bothRight: true,
        whyZh: "两句都对——第 32 课听过「风太大」（到这儿就停）；今天把后半段 to go out 装上——种子转正。"
      },
      {
        wrong: "It is too hot to sleep.",
        wrongMark: null,
        correct: "It is too dark to see.",
        bothRight: true,
        whyZh: "两句都对——两个常景：「太热睡不着」「太黑看不见」——too…to 一对就读顺。"
      }
    ],
    variants: [
      { label: "肯定", en: "It is too heavy to carry.", zh: "它太重了，拿不动。" },
      { label: "否定", en: "It is too heavy for me.", zh: "它对我来说太重了。", noteZh: "搬不动就说 for me——说明对谁来说太重。" },
      { label: "疑问", en: "Is it too heavy to carry?", zh: "是不是太重搬不动？", noteZh: "Is 搬句首——too…to 那截不动。" }
    ],
    sceneSwings: [
      { sceneZh: "说太热了睡不着", en: "It is too hot to sleep.", zh: "太热了，睡不着。" },
      { sceneZh: "说太黑了看不见", en: "It is too dark to see.", zh: "太黑了，看不见。" },
      { sceneZh: "说搬不动（开口求助）", en: "Could you help me? It is too heavy to carry.", zh: "能帮我一下吗？它太重了。" }
    ],
    deepDive: {
      title: "too 的两个身份",
      paragraphs: [
        "too 今天站的位子是「太」：站在词前面——too heavy、too hot、too dark。想带上「所以不能」，后面接 to + 动作：too heavy to carry。",
        "too 还有一个老身份「也」：站在句子尾巴上——I like tea too（我也喜欢茶）。两个身份看站位：句尾是「也」，词前是「太」。",
        "为什么不用 very？very heavy 只说「很重」，话说到这儿就停了；too heavy to carry 带上「拿不动」——想说出「没法做」，就请 too 上场。",
        "回头看看第 32 课：外婆喊 Close the door，补了一句 The wind is too strong——当时你听懂了「风太大」。今天你把整条 too…to 拿下了：It is too heavy to carry。"
      ]
    },
    summary: {
      rule: "太…了装不下：too + 词 + to + 动作（too heavy to carry）——一条句子装中文两句。",
      points: [
        "It is too heavy to carry. —— 太…了（所以）不能…",
        "The wind is too strong. → too strong to go out —— 种子转正",
        "too 两身份：词前是「太」、句尾是「也」"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：它太重了，拿不动。",
        before: "It is",
        after: "to carry.",
        options: ["too heavy", "very heavy", "heavy too"],
        answer: "too heavy",
        explain: "「装不下」的位子给 too：too heavy to carry。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：它太重了，拿不动。",
        tokens: ["It", "is", "too", "heavy", "to", "carry."],
        answer: "It is too heavy to carry.",
        explain: "太…了装不下：too heavy to carry。"
      },
      {
        // R8 跨课复现：第 32 课（风句种子——本课转正起点）
        kind: "arrange",
        promptZh: "先复习一小步——第 32 课听过：风太大了。",
        tokens: ["The", "wind", "is", "too", "strong."],
        answer: "The wind is too strong.",
        explain: "复现第 32 课：当时听懂一半——今天把后半段 to go out 装上。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["It", "is", "too", "heavy", "to", "carry", "it."],
        wrongToken: "it.",
        answer: "it.",
        correctionZh: "to 后面不用再指一遍：too heavy to carry。",
        explain: "东西已经在句子头上了。"
      },
      {
        // R8 跨课复现：第 61 课（开口求助）
        kind: "arrange",
        promptZh: "再对照一句——第 61 课学过：能帮我一下吗？",
        tokens: ["Could", "you", "help", "me?"],
        answer: "Could you help me?",
        explain: "复现第 61 课：搬不动就开口——「太…了装不下」＋「能帮我吗」串成一线。"
      },
      {
        // R9 变形/替换：换形容词（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「It is too heavy to carry.」把「重」换成「热（hot）」，句子要怎么变？",
        replaceBase: "It is too heavy to carry.",
        replaceTarget: "把 heavy 换成 hot",
        options: ["too hot", "very hot", "hot too"],
        answer: "too hot",
        explain: "同一把椅子换人坐：too hot to sleep——太热了睡不着。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：它太重了，拿不动。",
        tokens: ["It", "is", "too", "heavy", "to", "carry."],
        distractors: ["very"],
        answer: "It is too heavy to carry."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：是不是太重搬不动？",
        tokens: ["Is", "it", "too", "heavy", "to", "carry?"],
        distractors: ["Does"],
        answer: "Is it too heavy to carry?"
      },
      {
        promptZh: "你想说：太热了，睡不着。",
        tokens: ["It", "is", "too", "hot", "to", "sleep."],
        distractors: ["very"],
        answer: "It is too hot to sleep."
      },
      {
        // R8 跨课复现：第 61 课原句（批收口串线）
        promptZh: "全批收官——复习第 61 课：能帮我一下吗？",
        tokens: ["Could", "you", "help", "me?"],
        distractors: ["to"],
        answer: "Could you help me?"
      }
    ],
    recall: {
      promptZh: "搬家日，小美想一个人搬最大的纸箱，抬了抬纹丝不动。凭记忆，写出她那句英文。",
      intentZh: "它太重了，拿不动。",
      answer: "It is too heavy to carry.",
      noteZh: "太…了装不下：too + 词 + to + 动作——一条句子装两句。"
    },
    huntCaseIds: ["hunt-moving-day-note"]
  },

  // ── 第十批 · L67 擅长（good at + 名字版）：门牌 at 上岗——案件话术句转正（批十 PRD §2）──
  {
    id: "lesson-67-good-at",
    number: 67,
    title: "我擅长画画",
    grammarLabel: "擅长 · good at + 名字版",
    episode: "小美的一天 六十七",
    scene: "campus",
    cover: cover12,
    sceneSetupZh: "美术课后的才艺角，小美把画贴上墙，同学凑过来夸她画得好。",
    dialogueEn: "You are so good at drawing!",
    dialogueZh: "同学看着墙上的画说。",
    intentZh: "我擅长画画。",
    targetSentence: "I am good at drawing.",
    blocks: [
      { text: "I am good", role: "我擅长" },
      { text: "at", role: "门牌 at（挂上擅长）" },
      { text: "drawing", role: "画画（名字版）" }
    ],
    oneLineRule: "说「擅长做某事」用 good at + 名字版：good at drawing——at 是它的门牌，门里穿名字版。",
    examples: [
      { en: "I am good at drawing.", zh: "我擅长画画。" },
      { en: "She is good at math.", zh: "她数学很好。" },
      { en: "He is good at swimming.", zh: "他擅长游泳。" },
      { en: "Are you good at singing?", zh: "你唱歌好听吗？" }
    ],
    dialogue: [
      { who: "npc", en: "You are so good at drawing!", zh: "同学看着墙上的画说。" },
      { who: "npc", en: "This one is really nice.", zh: "她指了指最上面那张。" },
      { who: "me", en: "I am good at drawing.", zh: "轮到你说了——我擅长画画。" }
    ],
    contrast: [
      {
        wrong: "I am good at draw.",
        wrongMark: "draw",
        correct: "I am good at drawing.",
        whyZh: "门牌后面穿名字版：at drawing——光板进不了门（跟 enjoy/finish 一个规矩）。"
      },
      {
        wrong: "I am good in drawing.",
        wrongMark: "in",
        correct: "I am good at drawing.",
        whyZh: "擅长用门牌 at：「在…方面」的 in 是中文惯性——第 6 课案件里听过 good at，今天正面学。"
      },
      {
        wrong: "I like drawing.",
        wrongMark: null,
        correct: "I am good at drawing.",
        bothRight: true,
        whyZh: "两句都对——同一个名字版：喜欢也认（第 42 课）、擅长也认——通行证换门卫不换。"
      },
      {
        wrong: "I am good at math.",
        wrongMark: null,
        correct: "I am good at drawing.",
        bothRight: true,
        whyZh: "两句都对——门牌后接学科直接跟（math）、接事情穿名字版（drawing）——两种都对。"
      },
      {
        wrong: "I finished reading.",
        wrongMark: null,
        correct: "I am good at drawing.",
        bothRight: true,
        whyZh: "两句都对——第 64 课 finished reading（收尾的门）＋今天 good at drawing（擅长的门牌）：名字版排队点名。"
      },
      {
        wrong: "My hat is in the box.",
        wrongMark: null,
        correct: "I am good at drawing.",
        bothRight: true,
        whyZh: "两句都对——第 18 课 in the box（盒子里）复现：in/on/at 三词家族，at 今天有了新岗。"
      }
    ],
    variants: [
      { label: "肯定", en: "I am good at drawing.", zh: "我擅长画画。" },
      { label: "否定", en: "I am not good at singing.", zh: "我不擅长唱歌。", noteZh: "not 跟 am 走——「不擅长」。" },
      { label: "疑问", en: "Are you good at drawing?", zh: "你擅长画画吗？", noteZh: "Are 搬句首——问对方擅长什么。" }
    ],
    sceneSwings: [
      { sceneZh: "说她数学很好", en: "She is good at math.", zh: "她数学很好。" },
      { sceneZh: "说他擅长游泳", en: "He is good at swimming.", zh: "他擅长游泳。" },
      { sceneZh: "问对方唱不唱得好", en: "Are you good at singing?", zh: "你唱歌好听吗？" }
    ],
    deepDive: {
      title: "门牌 at 挂上门",
      paragraphs: [
        "第 18 课认识过 in / on / at 三块门牌：in the box（盒子里）、on Monday（周一）、at six（六点）。今天 at 接了新活：挂在「擅长」后面——good at。",
        "门牌后面穿什么？多数要穿名字版：good at drawing、good at swimming——跟第 42 课喜欢、第 45 课享受、第 64 课收尾一个规矩：通行证走到哪儿都认。",
        "例外也有：接一门学科直接跟就行——good at math、good at English（学科名本来就当「事」用）。遇到新词，看一眼它穿不穿外套。",
        "「擅长」这件事挂在 at 上，别用 in 去推——中文说「在数学方面很好」，那个「在」是中文的思维；英语的门牌房里，擅长只认 at。"
      ]
    },
    summary: {
      rule: "擅长做某事：good at + 名字版（good at drawing）——at 是门牌，门里穿名字版。",
      points: [
        "I am good at drawing. —— 门牌 at + 名字版",
        "She is good at math. —— 接学科直接跟",
        "I like reading. / I am good at drawing. —— 通行证换门卫不换"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我擅长画画。",
        before: "I am good at",
        after: ".",
        options: ["drawing", "draw", "to draw"],
        answer: "drawing",
        explain: "门牌后面穿名字版：at drawing。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我擅长画画。",
        tokens: ["I", "am", "good", "at", "drawing."],
        answer: "I am good at drawing.",
        explain: "good at + 名字版：门牌挂上门。"
      },
      {
        // R8 跨课复现：第 42 课（名字版通行证起点）
        kind: "arrange",
        promptZh: "先复习一小步——第 42 课学过：我喜欢读书。",
        tokens: ["I", "like", "reading."],
        answer: "I like reading.",
        explain: "复现第 42 课：名字版通行证——今天拿它进新门牌。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "am", "good", "in", "drawing."],
        wrongToken: "in",
        answer: "in",
        correctionZh: "擅长用门牌 at：good at drawing。",
        explain: "「在…方面」的 in 是中文惯性。"
      },
      {
        // R8 跨课复现：第 45 课（enjoy 的门）
        kind: "arrange",
        promptZh: "再对照一句——第 45 课学过：我享受读书。",
        tokens: ["I", "enjoy", "reading."],
        answer: "I enjoy reading.",
        explain: "复现第 45 课：enjoy 的门——门卫名单今天又添一位。"
      },
      {
        // R9 变形/替换：换擅长的事（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I am good at drawing.」把「画画」换成「游泳（swim）」，门牌后面要怎么变？",
        replaceBase: "I am good at drawing.",
        replaceTarget: "把 drawing 换成 swim",
        options: ["swimming", "swim", "to swim"],
        answer: "swimming",
        explain: "名字版换一件：good at swimming——-ing 外套穿好。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我擅长画画。",
        tokens: ["I", "am", "good", "at", "drawing."],
        distractors: ["in"],
        answer: "I am good at drawing."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：你擅长画画吗？",
        tokens: ["Are", "you", "good", "at", "drawing?"],
        distractors: ["Do"],
        answer: "Are you good at drawing?"
      },
      {
        promptZh: "你想说：她数学很好。",
        tokens: ["She", "is", "good", "at", "math."],
        distractors: ["in"],
        answer: "She is good at math."
      },
      {
        // R8 跨课复现：第 45 课原句
        promptZh: "复习第 45 课：我享受读书。",
        tokens: ["I", "enjoy", "reading."],
        distractors: ["to"],
        answer: "I enjoy reading."
      }
    ],
    recall: {
      promptZh: "美术课后的才艺角，同学夸小美画得好。凭记忆，写出她那句英文。",
      intentZh: "我擅长画画。",
      answer: "I am good at drawing.",
      noteZh: "门牌 at + 名字版：good at drawing。"
    },
    huntCaseIds: ["hunt-good-at"]
  },

  // ── 第十批 · L68 买给你（buy sb sth / buy sth for sb）：to 递到手、for 为你办——两家人分家（批十 PRD §2）──
  {
    id: "lesson-68-buy-for",
    number: 68,
    title: "买给你",
    grammarLabel: "买给谁 · buy sb sth / buy sth for sb",
    episode: "小美的一天 六十八",
    scene: "city",
    cover: cover44,
    sceneSetupZh: "母亲节前的周末，小美在商店挑了一份礼物，回家递给妈妈。",
    dialogueEn: "I bought a gift for my mom.",
    dialogueZh: "小美把礼物袋递到妈妈手里。",
    intentZh: "我给妈妈买了份礼物。",
    targetSentence: "I bought a gift for my mom.",
    blocks: [
      { text: "I bought", role: "我买了（昨天版）" },
      { text: "a gift", role: "一份礼物" },
      { text: "for my mom", role: "给妈妈的（为你办）" }
    ],
    oneLineRule: "说「买给谁」：东西在前、for + 人收尾（buys a gift for my mom）——递到手的用 to，为你办的用 for。",
    examples: [
      { en: "I bought a gift for my mom.", zh: "我给妈妈买了份礼物。" },
      { en: "I bought my mom a gift.", zh: "我给妈妈买了份礼物（同序换位）。" },
      { en: "She made a cake for me.", zh: "她给我做了个蛋糕。" },
      { en: "Please give it to me.", zh: "请把它递给我。" }
    ],
    dialogue: [
      { who: "npc", en: "What a nice bag!", zh: "妈妈接过礼物袋。" },
      { who: "npc", en: "Is it for me?", zh: "她笑着问。" },
      { who: "me", en: "I bought a gift for my mom.", zh: "轮到你说了——我给妈妈买了份礼物。" }
    ],
    contrast: [
      {
        wrong: "I bought a gift to my mom.",
        wrongMark: "to",
        correct: "I bought a gift for my mom.",
        whyZh: "买是「为你办的事」，用 for；to 是递到手的老位子（第 63 课 give it to me）——两家人分家。"
      },
      {
        wrong: "I bought for my mom a gift.",
        wrongMark: "for my mom",
        correct: "I bought a gift for my mom.",
        whyZh: "for 的人站最后：要么走 me the book 式（先给谁后给什么）、要么东西在前 for 收尾——别插中间。"
      },
      {
        wrong: "I bought my mom a gift.",
        wrongMark: null,
        correct: "I bought a gift for my mom.",
        bothRight: true,
        whyZh: "两句都对——先给谁后给什么（第 63 课老规矩）今天扩到 buy：两序随便挑。"
      },
      {
        wrong: "Please give the gift to me.",
        wrongMark: null,
        correct: "I bought the gift for my mom.",
        bothRight: true,
        whyZh: "两句都对——递到手 to（give 的位子）／为你办 for（buy 的位子）：一字之差两家人。"
      },
      {
        wrong: "I go to the shop to buy milk.",
        wrongMark: null,
        correct: "I bought a gift for my mom.",
        bothRight: true,
        whyZh: "两句都对——第 44 课去商店买东西（buy 的老句子）＋今天买给谁：同一个 buy，加了「给谁」。"
      },
      {
        wrong: "Please give me the book.",
        wrongMark: null,
        correct: "I bought a gift for my mom.",
        bothRight: true,
        whyZh: "两句都对——第 63 课先给谁后给什么（give）＋今天 for 收尾（buy）：递东西家族的门规都摸清了。"
      }
    ],
    variants: [
      { label: "肯定", en: "I bought a gift for my mom.", zh: "我给妈妈买了份礼物。" },
      { label: "否定", en: "I didn't buy a gift for my mom.", zh: "我没给妈妈买礼物。", noteZh: "昨天的「没买」用 didn't + 原形 buy——bought 退回原样。" },
      { label: "疑问", en: "Did you buy a gift for your mom?", zh: "你给妈妈买礼物了吗？", noteZh: "Did 搬句首，buy 穿原样，for your mom 不动。" }
    ],
    sceneSwings: [
      { sceneZh: "说她给我做了个蛋糕", en: "She made a cake for me.", zh: "她给我做了个蛋糕。" },
      { sceneZh: "说给妈妈买了份礼物（换位版）", en: "I bought my mom a gift.", zh: "我给妈妈买了份礼物。" },
      { sceneZh: "问对方给妈妈买礼物了吗", en: "Did you buy a gift for your mom?", zh: "你给妈妈买礼物了吗？" }
    ],
    deepDive: {
      title: "to 递到手、for 为你办",
      paragraphs: [
        "第 63 课学过递东西：give me the book、give it to me——那是「递到手」，用 to。今天 buy 出场：给你买的礼物，是你花了心思「为你办」的事，用 for。",
        "两边都记两个说法：递到手——give me the book ／ give the book to me；为你办——buy my mom a gift ／ buy a gift for my mom。顺序都是老规矩：先给谁后给什么，或者东西在前、末尾收尾。",
        "buy 的昨天版是 bought（第 11 课见过的老实词）：bought 不走加 -ed 的路——和 go→went 一样要单独记。今天句子里它穿着昨天版出场。",
        "第 44 课你去商店买牛奶（go to the shop to buy milk）——今天的 buy 前面多了一个「给谁」：买给妈妈、买给朋友，都是 for 出场。"
      ]
    },
    summary: {
      rule: "买给谁：buy + 人 + 东西 ／ buy + 东西 + for + 人——递到手用 to，为你办用 for。",
      points: [
        "I bought a gift for my mom. —— for 收尾版",
        "I bought my mom a gift. —— 先给谁后给什么版（都对）",
        "give it to me ／ buy it for me —— to 与 for 两家人"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我给妈妈买了份礼物。",
        before: "I bought a gift",
        after: "my mom.",
        options: ["for", "to", "at"],
        answer: "for",
        explain: "买是为你办的事：for my mom——to 是递到手的位子。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我给妈妈买了份礼物。",
        tokens: ["I", "bought", "a", "gift", "for", "my", "mom."],
        answer: "I bought a gift for my mom.",
        explain: "东西在前、for + 人收尾：a gift for my mom。"
      },
      {
        // R8 跨课复现：第 63 课（先给谁后给什么）
        kind: "arrange",
        promptZh: "先复习一小步——第 63 课学过：请把那本书递给我。",
        tokens: ["Please", "give", "me", "the", "book."],
        answer: "Please give me the book.",
        explain: "复现第 63 课：递到手的 to——今天 for 家族登场分家。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "bought", "a", "gift", "to", "my", "mom."],
        wrongToken: "to",
        answer: "to",
        correctionZh: "为你办用 for：a gift for my mom。",
        explain: "to 是递到手的位子——买用 for。"
      },
      {
        // R8 跨课复现：第 44 课（buy 的老句子）
        kind: "arrange",
        promptZh: "再对照一句——第 44 课学过：我去商店买牛奶。",
        tokens: ["I", "go", "to", "the", "shop", "to", "buy", "milk."],
        answer: "I go to the shop to buy milk.",
        explain: "复现第 44 课：buy 的老句子——今天给它加「给谁」。"
      },
      {
        // R9 变形/替换：换两序（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I bought a gift for my mom.」换成「先给谁后给什么」语序，中间要怎么变？",
        replaceBase: "I bought a gift for my mom.",
        replaceTarget: "换成先给谁后给什么语序",
        options: ["I bought my mom a gift.", "I bought for my mom a gift.", "I bought a gift my mom for."],
        answer: "I bought my mom a gift.",
        explain: "两序互换：my mom 上中间位、a gift 收尾——for 不用了。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我给妈妈买了份礼物。",
        tokens: ["I", "bought", "a", "gift", "for", "my", "mom."],
        distractors: ["to"],
        answer: "I bought a gift for my mom."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：你给妈妈买礼物了吗？",
        tokens: ["Did", "you", "buy", "a", "gift", "for", "your", "mom?"],
        distractors: ["Does"],
        answer: "Did you buy a gift for your mom?"
      },
      {
        // R8 跨课复现：第 44 课原句
        promptZh: "复习第 44 课：我去商店买牛奶。",
        tokens: ["I", "go", "to", "the", "shop", "to", "buy", "milk."],
        distractors: ["buying"],
        answer: "I go to the shop to buy milk."
      },
      {
        promptZh: "收个尾——你想说：她给我做了个蛋糕。",
        tokens: ["She", "made", "a", "cake", "for", "me."],
        distractors: ["to"],
        answer: "She made a cake for me."
      }
    ],
    recall: {
      promptZh: "母亲节前的周末，小美把礼物递给妈妈。凭记忆，写出她那句英文。",
      intentZh: "我给妈妈买了份礼物。",
      answer: "I bought a gift for my mom.",
      noteZh: "为你办用 for：a gift for my mom。"
    },
    huntCaseIds: ["hunt-gift-list"]
  },

  // ── 第十批 · L69 你介意吗（Would you mind…?）：礼貌第四档 + 门卫名单再添一位——应答链带 Yes 陷阱（批十 PRD §2）──
  {
    id: "lesson-69-mind",
    number: 69,
    title: "你介意吗",
    grammarLabel: "客气第四档 · Would you mind + 名字版",
    episode: "小美的一天 六十九",
    scene: "campus",
    cover: cover39,
    sceneSetupZh: "午后的教室闷得慌，小美朝靠窗的同桌开口，请她开个窗。",
    dialogueEn: "Would you mind opening the window?",
    dialogueZh: "小美探过身，朝同桌轻声开口。",
    intentZh: "你介意把窗打开吗？",
    targetSentence: "Would you mind opening the window?",
    blocks: [
      { text: "Would you mind", role: "你介意吗（最婉转的一档）" },
      { text: "opening", role: "打开（名字版）" },
      { text: "the window?", role: "窗户" }
    ],
    oneLineRule: "请人做事最婉转的一档：Would you mind + 名字版（mind opening）；答应说 Of course not——「当然不介意」。",
    examples: [
      { en: "Would you mind opening the window?", zh: "你介意把窗打开吗？" },
      { en: "Of course not.", zh: "当然不介意。（我去开）" },
      { en: "I don't mind opening the window.", zh: "我不介意开窗。" },
      { en: "Do you mind opening the window?", zh: "你介意开一下窗吗？（口气直接一点）" }
    ],
    dialogue: [
      { who: "npc", en: "It is so hot in here.", zh: "同桌扇着本子嘟囔。" },
      { who: "npc", en: "The window is closed.", zh: "她瞟了一眼窗户。" },
      { who: "me", en: "Would you mind opening the window?", zh: "轮到你说了——你介意把窗打开吗？" }
    ],
    contrast: [
      {
        wrong: "Would you mind open the window?",
        wrongMark: "open",
        correct: "Would you mind opening the window?",
        whyZh: "mind 的门只认名字版：光板进不了门——跟 enjoy/finish 一个规矩。"
      },
      {
        wrong: "Would you mind to open the window?",
        wrongMark: "to",
        correct: "Would you mind opening the window?",
        whyZh: "垫板对门卫不管用：mind 不认 to——去掉它，名字版上岗。"
      },
      {
        wrong: "Could you open the window?",
        wrongMark: null,
        correct: "Would you mind opening the window?",
        bothRight: true,
        whyZh: "两句都对——第三档（Could you 直接请）、第四档（Would you mind 最婉转）：看交情挑。"
      },
      {
        wrong: "Yes.",
        wrongMark: null,
        correct: "Of course not.",
        whyZh: "应答陷阱：问的是「你介意吗」——答应说的是「当然不介意」（Of course not）；Yes 出口反而成了「我介意」。"
      },
      {
        wrong: "Could you help me?",
        wrongMark: null,
        correct: "Would you mind opening the window?",
        bothRight: true,
        whyZh: "两句都对——第 61 课第三档＋今天第四档：请人帮忙从直接到婉转，四档全会。"
      },
      {
        wrong: "I finished reading the book.",
        wrongMark: null,
        correct: "Would you mind opening the window?",
        bothRight: true,
        whyZh: "两句都对——第 64 课收尾的门＋今天 mind 的门：门卫名单又添一位，名字版通行证走到哪儿都认。"
      }
    ],
    variants: [
      { label: "肯定", en: "I don't mind opening the window.", zh: "我不介意开窗。", noteZh: "自己说不介意：don't mind + 名字版。" },
      { label: "否定", en: "I don't mind at all.", zh: "我一点都不介意。", noteZh: "at all 收尾——加满「一点都不」。" },
      { label: "疑问", en: "Do you mind opening the window?", zh: "你介意开一下窗吗？", noteZh: "Do 开头也常听到，口气比 Would you mind 直接一点。" }
    ],
    sceneSwings: [
      { sceneZh: "请同桌关一下门", en: "Would you mind closing the door?", zh: "你介意把门关上吗？" },
      { sceneZh: "说自己不介意开窗", en: "I don't mind opening the window.", zh: "我不介意开窗。" },
      { sceneZh: "用直接一点的口气再问一遍", en: "Do you mind opening the window?", zh: "你介意开一下窗吗？" }
    ],
    deepDive: {
      title: "第四档与应答链",
      paragraphs: [
        "礼貌档位一路升上来：Close the door（直白）→ Close the door, please（加 please）→ Could you close the door?（第 61 课第三档）→ Would you mind closing the door?（今天第四档，最婉转）。",
        "为什么最婉转？它把「请你做事」绕成了「你介意吗」——给对方留足了说「不」的余地，这是英语里请人帮忙最客气的一档。",
        "应答要小心：被问 Would you mind…?，答应（好，我去）要说 Of course not（当然不介意）；不想做才说 Sorry, I can't。Sure 和 No problem 也可以——都是「不介意，我来」。记住：Yes 出口就成「我介意」了。",
        "mind 也是「只认名字版」的门卫（第 64 课说的「名单还会加长」今天再加一位）：Would you mind opening——opening 穿 -ing 外套。"
      ]
    },
    summary: {
      rule: "最婉转的一档：Would you mind + 名字版（mind opening）——答应说 Of course not。",
      points: [
        "Would you mind opening the window? —— 第四档上岗",
        "Of course not. —— 「当然不介意」（别说 Yes）",
        "Could you…? ／ Would you mind…? —— 第三档、第四档都对"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：你介意把窗打开吗？",
        before: "Would you mind",
        after: "the window?",
        options: ["opening", "open", "to open"],
        answer: "opening",
        explain: "mind 的门只认名字版：opening。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：你介意把窗打开吗？",
        tokens: ["Would", "you", "mind", "opening", "the", "window?"],
        answer: "Would you mind opening the window?",
        explain: "第四档 + 名字版：mind opening。"
      },
      {
        // R8 跨课复现：第 61 课（第三档）
        kind: "arrange",
        promptZh: "先复习一小步——第 61 课学过：能帮我一下吗？",
        tokens: ["Could", "you", "help", "me?"],
        answer: "Could you help me?",
        explain: "复现第 61 课：第三档——今天升到第四档。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["Would", "you", "mind", "to", "open", "the", "window?"],
        wrongToken: "to",
        answer: "to",
        correctionZh: "垫板对门卫不管用：要去掉 to、穿名字版——mind opening。",
        explain: "mind 不认 to。"
      },
      {
        // R8 跨课复现：第 64 课（门卫名单前一位）
        kind: "arrange",
        promptZh: "再对照一句——第 64 课学过：我看完这本书啦。",
        tokens: ["I", "finished", "reading", "the", "book."],
        answer: "I finished reading the book.",
        explain: "复现第 64 课：finished reading——今天 mind 又添一位。"
      },
      {
        // R9 变形/替换：换请做的事（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「Would you mind opening the window?」把「开窗」换成「关窗（close the window）」，动词要怎么变？",
        replaceBase: "Would you mind opening the window?",
        replaceTarget: "把 opening the window 换成 close the window",
        options: ["closing the window", "close the window", "to close the window"],
        answer: "closing the window",
        explain: "名字版换一件：mind closing——-ing 外套穿好。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：你介意把窗打开吗？",
        tokens: ["Would", "you", "mind", "opening", "the", "window?"],
        distractors: ["to"],
        answer: "Would you mind opening the window?"
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想（直接一点）问：你介意开一下窗吗？",
        tokens: ["Do", "you", "mind", "opening", "the", "window?"],
        distractors: ["Does"],
        answer: "Do you mind opening the window?"
      },
      {
        promptZh: "你想说：我不介意开窗。",
        tokens: ["I", "don't", "mind", "opening", "the", "window."],
        distractors: ["to"],
        answer: "I don't mind opening the window."
      },
      {
        // R8 跨课复现：第 61 课原句
        promptZh: "复习第 61 课：能帮我一下吗？",
        tokens: ["Could", "you", "help", "me?"],
        distractors: ["to"],
        answer: "Could you help me?"
      }
    ],
    recall: {
      promptZh: "午后教室闷得慌，小美请靠窗的同桌开个窗——用了最婉转的一档。凭记忆，写出她那句英文。",
      intentZh: "你介意把窗打开吗？",
      answer: "Would you mind opening the window?",
      noteZh: "第四档 + 名字版：mind opening。"
    },
    huntCaseIds: ["hunt-mind-note"]
  },

  // ── 第十批 · L70 要不要（Would you like…?）：offer 型 + 应答链——第 62 课的「问」端收口（批十 PRD §2）──
  {
    id: "lesson-70-would-you-like",
    number: 70,
    title: "要不要",
    grammarLabel: "提供 · Would you like…? + Yes, please / No, thanks",
    episode: "小美的一天 七十",
    scene: "mansion",
    cover: cover46,
    sceneSetupZh: "表妹来家里玩，小美拎着小茶壶，问她要不要来点茶。",
    dialogueEn: "Would you like some tea?",
    dialogueZh: "小美举起茶壶朝向表妹。",
    intentZh: "你要不要来点茶？",
    targetSentence: "Would you like some tea?",
    blocks: [
      { text: "Would you like", role: "要不要（端到人前问）" },
      { text: "some tea?", role: "来点茶" }
    ],
    oneLineRule: "问对方「要不要」用 Would you like + 东西：要就说 Yes, please.；不要就说 No, thanks.。",
    examples: [
      { en: "Would you like some tea?", zh: "你要不要来点茶？" },
      { en: "Yes, please.", zh: "要，谢谢。" },
      { en: "No, thanks.", zh: "不要，谢谢。" },
      { en: "Would you like to have some tea?", zh: "要不要来喝点茶？" }
    ],
    dialogue: [
      { who: "npc", en: "I am a little thirsty.", zh: "表妹舔了舔嘴唇。" },
      { who: "npc", en: "Do you have any drinks?", zh: "她问你有没有喝的。" },
      { who: "me", en: "Would you like some tea?", zh: "轮到你说了——你要不要来点茶？" }
    ],
    contrast: [
      {
        wrong: "Would you like to some tea?",
        wrongMark: "to",
        correct: "Would you like some tea?",
        whyZh: "东西直接跟、不垫板：some tea——垫板留给动作（would like to have）。"
      },
      {
        wrong: "Do you like some tea?",
        wrongMark: "Do",
        correct: "Would you like some tea?",
        whyZh: "想提供却问成了「你爱不爱喝茶」：「要不要」用 Would you like，「爱不爱」才是 Do you like。"
      },
      {
        wrong: "Would you like some tea?",
        wrongMark: null,
        correct: "Yes, please.",
        bothRight: true,
        whyZh: "两句都对——问「要不要」＋答「要，谢谢」：成对出场，答句里 please 让答得周全。"
      },
      {
        wrong: "Do you want some tea?",
        wrongMark: null,
        correct: "Would you like some tea?",
        bothRight: true,
        whyZh: "两句都对——熟人直接问 want、招待客人用 Would you like 更体面。"
      },
      {
        wrong: "I would like a cup of tea.",
        wrongMark: null,
        correct: "Would you like some tea?",
        bothRight: true,
        whyZh: "两句都对——第 62 课会答「我想要」，今天会把问句递出去：想要和给前问，两头都会。"
      },
      {
        wrong: "What would you like?",
        wrongMark: null,
        correct: "Would you like some tea?",
        bothRight: true,
        whyZh: "两句都对——问「想要什么」（第 4 课种子、第 62 课）＋问「要不要」：两条问法都熟。"
      }
    ],
    variants: [
      { label: "肯定", en: "Yes, please.", zh: "要，谢谢。", noteZh: "要就说——please 让答得周全。" },
      { label: "否定", en: "No, thanks.", zh: "不要，谢谢。", noteZh: "不要就说——thanks 让拒绝也体面。" },
      { label: "疑问", en: "Would you like to have some tea?", zh: "要不要来喝点茶？", noteZh: "想请对方做动作时，垫上 to：to have——东西和动作两种问法。" }
    ],
    sceneSwings: [
      { sceneZh: "问表妹要不要来点茶", en: "Would you like some tea?", zh: "你要不要来点茶？" },
      { sceneZh: "答应「要」", en: "Yes, please.", zh: "要，谢谢。" },
      { sceneZh: "婉拒「不要」", en: "No, thanks.", zh: "不要，谢谢。" }
    ],
    deepDive: {
      title: "两条问法：想要什么、要不要",
      paragraphs: [
        "第 62 课你会答「我想要」（I would like a cup of tea）；今天把同一家族的问句递到别人面前：Would you like some tea?——问「要不要」，招待、分零食都靠它。",
        "两条问法的分工：What would you like?（你想要什么——让对方自己挑）／Would you like some tea?（要不要这个——端着东西问）。一个开放式、一个端到人前。",
        "应答成对记：要——Yes, please.；不要——No, thanks.。两个都带上 please/thanks，答得周全。",
        "别和 Do you like…? 混：「爱不爱」问的是平时的口味（Do you like tea? 你平时爱喝茶吗）；「要不要」是现在这一杯（Would you like some tea?）——一字之差，一问口味一问当下。"
      ]
    },
    summary: {
      rule: "问「要不要」：Would you like + 东西——要答 Yes, please.；不要答 No, thanks.。",
      points: [
        "Would you like some tea? —— 端到人前问",
        "Yes, please. / No, thanks. —— 应答成对",
        "Do you like…? ／ Would you like…? —— 口味 vs 当下"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想问：你要不要来点茶？",
        before: "Would you like",
        after: "?",
        options: ["some tea", "to tea", "tea to"],
        answer: "some tea",
        explain: "东西直接跟：some tea——不垫板。"
      },
      {
        kind: "arrange",
        promptZh: "你想问：你要不要来点茶？",
        tokens: ["Would", "you", "like", "some", "tea?"],
        answer: "Would you like some tea?",
        explain: "端到人前问：Would you like + 东西。"
      },
      {
        // R8 跨课复现：第 62 课（同家族）
        kind: "arrange",
        promptZh: "先复习一小步——第 62 课学过：你想要点什么？",
        tokens: ["What", "would", "you", "like?"],
        answer: "What would you like?",
        explain: "复现第 62 课：两条问法今天配对——一条让对方挑、一条端着问。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["Would", "you", "like", "to", "some", "tea?"],
        wrongToken: "to",
        answer: "to",
        correctionZh: "东西直接跟、不垫板：some tea。",
        explain: "垫板留给动作（to have）。"
      },
      {
        // R8 跨课复现：第 4 课（种子）
        kind: "arrange",
        promptZh: "再对照一句——第 4 课听过：你想要点什么？",
        tokens: ["What", "would", "you", "like?"],
        answer: "What would you like?",
        explain: "复现第 4 课：种子今天第三次见面——两条问法都熟了。"
      },
      {
        // R9 变形/替换：换提供的东西（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「Would you like some tea?」把「茶」换成「咖啡（coffee）」，句子要怎么变？",
        replaceBase: "Would you like some tea?",
        replaceTarget: "把 some tea 换成 some coffee",
        options: ["some coffee", "to coffee", "coffee some"],
        answer: "some coffee",
        explain: "同一个位子换东西：some coffee——照样直接跟。"
      }
    ],
    practice: [
      {
        promptZh: "你想问：你要不要来点茶？",
        tokens: ["Would", "you", "like", "some", "tea?"],
        distractors: ["to"],
        answer: "Would you like some tea?"
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问（请对方做动作）：要不要来喝点茶？",
        tokens: ["Would", "you", "like", "to", "have", "some", "tea?"],
        distractors: ["having"],
        answer: "Would you like to have some tea?"
      },
      {
        promptZh: "你想答（要）：要，谢谢。",
        tokens: ["Yes,", "please."],
        distractors: ["thanks"],
        answer: "Yes, please."
      },
      {
        // R8 跨课复现：第 62 课原句
        promptZh: "复习第 62 课：我要一杯茶。",
        tokens: ["I", "would", "like", "a", "cup", "of", "tea."],
        distractors: ["to"],
        answer: "I would like a cup of tea."
      }
    ],
    recall: {
      promptZh: "表妹来家里玩说口渴，小美拎着小茶壶问她要不要来点茶。凭记忆，写出她那句英文。",
      intentZh: "你要不要来点茶？",
      answer: "Would you like some tea?",
      noteZh: "端到人前问：Would you like + 东西。"
    },
    huntCaseIds: ["hunt-tea-invite"]
  },

  // ── 第十批 · L71 够轻拿得动（enough）：L66 镜像收尾——「够」站词后面；批收口（批十 PRD §2）──
  {
    id: "lesson-71-enough",
    number: 71,
    title: "够轻拿得动",
    grammarLabel: "够 · enough 站词后",
    episode: "小美的一天 七十一",
    scene: "island",
    cover: cover17,
    sceneSetupZh: "春游出门前，小美把背包往妹妹肩上一放，掂了掂说这包不沉、背得动。",
    dialogueEn: "The bag is light enough to carry.",
    dialogueZh: "小美拍了拍背包对妹妹说。",
    intentZh: "包够轻，背得动。",
    targetSentence: "The bag is light enough to carry.",
    blocks: [
      { text: "The bag is light", role: "包很轻" },
      { text: "enough", role: "够（站词后面）" },
      { text: "to carry", role: "背得动（接动作）" }
    ],
    oneLineRule: "说「够」用 enough——它站词的后面（light enough）；后半段接 to + 动作收尾（to carry）。",
    examples: [
      { en: "The bag is light enough to carry.", zh: "包够轻，背得动。" },
      { en: "He is old enough.", zh: "他够大了。" },
      { en: "We have enough money.", zh: "我们的钱够。" },
      { en: "It is too heavy to carry.", zh: "它太重了，拿不动。" }
    ],
    dialogue: [
      { who: "npc", en: "This bag looks heavy.", zh: "妹妹掂了掂背包。" },
      { who: "npc", en: "Can I carry it?", zh: "她问你行不行。" },
      { who: "me", en: "The bag is light enough to carry.", zh: "轮到你说了——包够轻，背得动。" }
    ],
    contrast: [
      {
        wrong: "The bag is enough light to carry.",
        wrongMark: "enough",
        correct: "The bag is light enough to carry.",
        whyZh: "enough 站词的后面：light enough——中文的「够」在前面（够轻），英语的 enough 在词后。"
      },
      {
        wrong: "It is too heavy to carry.",
        wrongMark: null,
        correct: "The bag is light enough to carry.",
        bothRight: true,
        whyZh: "两句都对——太重拿不动（第 66 课）↔ 够轻拿得动（今天）：一面镜子翻个面就对。"
      },
      {
        wrong: "The bag is light enough for carry.",
        wrongMark: "for",
        correct: "The bag is light enough to carry.",
        whyZh: "后面接动作要垫 to：enough to carry——for 是「为你办」家的人（第 68 课刚分家）。"
      },
      {
        wrong: "We have enough money.",
        wrongMark: null,
        correct: "He is old enough.",
        bothRight: true,
        whyZh: "两句都对——enough 两处岗：名词前（enough money）、词后（old enough）——今天主攻词后，名词前认读。"
      },
      {
        wrong: "It is too heavy to carry.",
        wrongMark: null,
        correct: "The bag is light enough to carry.",
        bothRight: true,
        whyZh: "两句都对——第 66 课镜像的另一面：too 和 enough 是一对反义词，句子形状搭对。"
      },
      {
        wrong: "He is as tall as me.",
        wrongMark: null,
        correct: "The bag is light enough to carry.",
        bothRight: true,
        whyZh: "两句都对——第 65 课「一样」（as…as）、第 66 课「太」（too…to）、今天「够」（enough）：程度三兄弟排好队。"
      }
    ],
    variants: [
      { label: "肯定", en: "The bag is light enough to carry.", zh: "包够轻，背得动。" },
      { label: "否定", en: "The bag is not light enough.", zh: "包不够轻。", noteZh: "不够轻——not 跟 is 走；后半段可省。" },
      { label: "疑问", en: "Is the bag light enough to carry?", zh: "包够轻能背吗？", noteZh: "Is 搬句首——问背不背得动。" }
    ],
    sceneSwings: [
      { sceneZh: "说他够大了", en: "He is old enough.", zh: "他够大了。" },
      { sceneZh: "说我们的钱够", en: "We have enough money.", zh: "我们的钱够。" },
      { sceneZh: "问包够不够轻", en: "Is the bag light enough to carry?", zh: "包够轻能背吗？" }
    ],
    deepDive: {
      title: "够站后面——镜子的两面",
      paragraphs: [
        "第 66 课你学过 too…to：too heavy to carry（太重了拿不动）。今天把它翻个面：light enough to carry（够轻，拿得动）。too 和 enough 是一对——一个说「太过了」，一个说「够格了」。",
        "位置记牢：too 站在词前面（too heavy）、enough 站在词后面（light enough）——位置天生相反，和它们的意思正好照应。",
        "后半段的 to carry 两兄弟一样：够了能做的事、太过了做不了的事，都用 to + 动作收尾。",
        "enough 还有一个岗位在名词前面：enough money（钱够）、enough time（时间够）。今天你先记住词后那句（light enough），名词前这句认得、听得懂就行——用起来一样是「够」。"
      ]
    },
    summary: {
      rule: "说「够」：enough 站词的后面（light enough）——后半段接 to + 动作（to carry）。",
      points: [
        "The bag is light enough to carry. —— 够站后面",
        "too heavy to carry ↔ light enough to carry —— 镜子两面",
        "enough money —— 名词前的老位子（认读）"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：包够轻，背得动。",
        before: "The bag is light",
        after: "to carry.",
        options: ["enough", "too", "very"],
        answer: "enough",
        explain: "「够」的位子给 enough：light enough——站词后。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：包够轻，背得动。",
        tokens: ["The", "bag", "is", "light", "enough", "to", "carry."],
        answer: "The bag is light enough to carry.",
        explain: "够站词后 + to + 动作：light enough to carry。"
      },
      {
        // R8 跨课复现：第 66 课（镜像起点）
        kind: "arrange",
        promptZh: "先复习一小步——第 66 课学过：它太重了，拿不动。",
        tokens: ["It", "is", "too", "heavy", "to", "carry."],
        answer: "It is too heavy to carry.",
        explain: "复现第 66 课：太重拿不动——今天把镜子翻个面。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["The", "bag", "is", "enough", "light", "to", "carry."],
        wrongToken: "enough",
        answer: "enough",
        correctionZh: "enough 站词的后面：light enough。",
        explain: "中文的「够」在前，英语的 enough 在后。"
      },
      {
        // R8 跨课复现：第 65 课（程度三兄弟第一位）
        kind: "arrange",
        promptZh: "再对照一句——第 65 课学过：他和我一样高。",
        tokens: ["He", "is", "as", "tall", "as", "me."],
        answer: "He is as tall as me.",
        explain: "复现第 65 课：一样（as…as）——程度三兄弟今天到齐。"
      },
      {
        // R9 变形/替换：换形容词（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「The bag is light enough to carry.」把「轻」换成「大（big）」——够大装得下，句子要怎么变？",
        replaceBase: "The bag is light enough to carry.",
        replaceTarget: "把 light 换成 big",
        options: ["big enough", "enough big", "big too"],
        answer: "big enough",
        explain: "同一个位子换词：big enough——enough 照样站词后。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：包够轻，背得动。",
        tokens: ["The", "bag", "is", "light", "enough", "to", "carry."],
        distractors: ["too"],
        answer: "The bag is light enough to carry."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：包够轻能背吗？",
        tokens: ["Is", "the", "bag", "light", "enough", "to", "carry?"],
        distractors: ["Does"],
        answer: "Is the bag light enough to carry?"
      },
      {
        promptZh: "你想说：他够大了。",
        tokens: ["He", "is", "old", "enough."],
        distractors: ["too"],
        answer: "He is old enough."
      },
      {
        // R8 跨课复现：第 66 课原句（批收口串线）
        promptZh: "全批收官——复习第 66 课：它太重了，拿不动。",
        tokens: ["It", "is", "too", "heavy", "to", "carry."],
        distractors: ["enough"],
        answer: "It is too heavy to carry."
      }
    ],
    recall: {
      promptZh: "春游出门前，小美把背包往妹妹肩上一放，说这包背得动。凭记忆，写出她那句英文。",
      intentZh: "包够轻，背得动。",
      answer: "The bag is light enough to carry.",
      noteZh: "够站后面：light enough + to carry。"
    },
    huntCaseIds: ["hunt-enough-bag"]
  },

  // ── 第十一批 · L72 多久一次（How often）：How 家族又一岗——L28 频率阶梯补上问句（批十一 PRD §2）──
  {
    id: "lesson-72-how-often",
    number: 72,
    title: "多久一次",
    grammarLabel: "多久一次 · How often + 答语词块",
    episode: "小美的一天 七十二",
    scene: "campus",
    cover: cover43,
    sceneSetupZh: "操场边，小美指着你的跑步计划表，问你多久跑一次。",
    dialogueEn: "How often do you run?",
    dialogueZh: "小美指着计划表上的格子问你。",
    intentZh: "你多久跑一次？",
    targetSentence: "How often do you run?",
    blocks: [
      { text: "How often", role: "多久一次（问节奏）" },
      { text: "do you run?", role: "你跑步（请帮手 do）" }
    ],
    oneLineRule: "问「多久一次」用 How often——第 27 课「How 管方式」的又一岗；答语是词块：twice a week（一周两次）。",
    examples: [
      { en: "How often do you run?", zh: "你多久跑一次？" },
      { en: "Twice a week.", zh: "一周两次。" },
      { en: "I run three times a week.", zh: "我一周跑三次。" },
      { en: "I read once a month.", zh: "我一个月读一次。" }
    ],
    dialogue: [
      { who: "npc", en: "Your plan looks great!", zh: "小美翻着你的计划表。" },
      { who: "npc", en: "How often do you run?", zh: "她指着格子问你多久跑一次。" },
      { who: "me", en: "Twice a week.", zh: "轮到你说了——一周两次。" }
    ],
    contrast: [
      {
        wrong: "How often you run?",
        wrongMark: null,
        correct: "How often do you run?",
        whyZh: "问动作要请帮手 do：疑问词后面，动作用 do 帮忙（第 27 课的老规矩）。"
      },
      {
        wrong: "I run one week two times.",
        wrongMark: "one week two times",
        correct: "I run twice a week.",
        whyZh: "「一星期两次」时间放后面：twice a week——「两次」有专门说法 twice，中文直译的语序是最大的坑。"
      },
      {
        wrong: "How often do you run?",
        wrongMark: null,
        correct: "Twice a week.",
        bothRight: true,
        whyZh: "两句都对——问「多久一次」＋答「一周两次」：成对出场。"
      },
      {
        wrong: "How old are you?",
        wrongMark: null,
        correct: "How are you?",
        bothRight: true,
        whyZh: "两句都对——How 家族两兄弟：「多大了」（How old）和「你好吗」（How are you）同一条路：How 站句首。"
      },
      {
        wrong: "I always arrive early.",
        wrongMark: null,
        correct: "How often do you run?",
        bothRight: true,
        whyZh: "两句都对——第 28 课频率副词站位（always）＋今天学会问：答句老基座，问句今天补。"
      },
      {
        wrong: "I have seen that film twice!",
        wrongMark: null,
        correct: "I run twice a week.",
        bothRight: true,
        whyZh: "两句都对——第 21 课对白里的 twice（看过两遍）＋今天有了搭档：twice a week。"
      }
    ],
    variants: [
      { label: "肯定", en: "I run twice a week.", zh: "我一周跑两次。", noteZh: "答语词块：twice a week——「两次」在前、时间在后。" },
      { label: "否定", en: "I don't run every day.", zh: "我不是每天都跑。", noteZh: "don't 帮忙说清节奏。" },
      { label: "疑问", en: "How often do you run?", zh: "你多久跑一次？", noteZh: "问动作请帮手 do：How often 站句首，do 排第二。" }
    ],
    sceneSwings: [
      { sceneZh: "说她一周游泳三次", en: "She goes swimming three times a week.", zh: "她一周游泳三次。" },
      { sceneZh: "说我一个月读一次", en: "I read once a month.", zh: "我一个月读一次。" },
      { sceneZh: "问她多久去一次图书馆", en: "How often does she go to the library?", zh: "她多久去一次图书馆？" }
    ],
    deepDive: {
      title: "答语词块三档",
      paragraphs: [
        "回答「多久一次」有三档说法：一次——once a week（一周一次）；两次——twice a week（一周两次）；三次以上——three times a week（数字 + times）。「两次」有专门说法 twice，不用 two times。",
        "顺序记牢：先说几次、再说周期——twice a week、once a month。中文「一星期两次」是时间在前，英语正好倒过来。",
        "第 28 课你学过频率副词（always、often、never）站动词前面；今天补上它们的问法：How often do you run?——答句可以是副词（I often run.），也可以是词块（Twice a week.）。",
        "How 家族排排站：How are you（你好吗）、How old（多大）、How many（多少）、今天的 How often（多久一次）——一个 How 站句首，后面接什么问什么。"
      ]
    },
    summary: {
      rule: "问「多久一次」用 How often；答语词块：once／twice／three times + a week。",
      points: [
        "How often do you run? —— How 家族又一岗",
        "Twice a week. —— 几次在前、周期在后",
        "once a week / twice a week / three times a week —— 答语三档"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想问：你多久跑一次？",
        before: "How often",
        after: "run?",
        options: ["do you", "you", "are you"],
        answer: "do you",
        explain: "问动作要请帮手：How often do you run。"
      },
      {
        kind: "arrange",
        promptZh: "你想问：你多久跑一次？",
        tokens: ["How", "often", "do", "you", "run?"],
        answer: "How often do you run?",
        explain: "How often 站句首、do 排第二：疑问词的老规矩。"
      },
      {
        // R8 跨课复现：第 28 课（频率阶梯起点）
        kind: "arrange",
        promptZh: "先复习一小步——第 28 课学过：我总是早到。",
        tokens: ["I", "always", "arrive", "early."],
        answer: "I always arrive early.",
        explain: "复现第 28 课：频率副词站动词前——答句老基座在库。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["How", "often", "you", "run?"],
        wrongToken: "you",
        answer: "you",
        correctionZh: "问动作要请帮手 do：How often do you run。",
        explain: "疑问词后面，动作用 do 帮忙。"
      },
      {
        // R8 跨课复现：第 21 课（twice 老句）
        kind: "arrange",
        promptZh: "再对照一句——第 21 课听过：那部电影我看过两遍了！",
        tokens: ["I", "have", "seen", "that", "film", "twice!"],
        answer: "I have seen that film twice!",
        explain: "复现第 21 课：twice（两遍）老句——今天它有了新搭档 a week。"
      },
      {
        // R9 变形/替换：换周期（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I run twice a week.」换成「一个月一次」（一个月只跑一次），词块要怎么换？",
        replaceBase: "I run twice a week.",
        replaceTarget: "把 twice a week 换成「一个月一次」",
        options: ["once a month", "one a month", "a month once"],
        answer: "once a month",
        explain: "一次用 once：once a month——几次在前、周期在后。"
      }
    ],
    practice: [
      {
        promptZh: "你想问：你多久跑一次？",
        tokens: ["How", "often", "do", "you", "run?"],
        distractors: ["are"],
        answer: "How often do you run?"
      },
      {
        // R06 变体扩量：与 variants 否定卡逐字一致的否定变体题
        promptZh: "你想说：我不是每天都跑。",
        tokens: ["I", "don't", "run", "every", "day."],
        distractors: ["doesn't"],
        answer: "I don't run every day."
      },
      {
        promptZh: "你想答：一周两次。",
        tokens: ["Twice", "a", "week."],
        distractors: ["two"],
        answer: "Twice a week."
      },
      {
        // R8 跨课复现：第 28 课原句
        promptZh: "复习第 28 课：我总是早到。",
        tokens: ["I", "always", "arrive", "early."],
        distractors: ["arrive always"],
        answer: "I always arrive early."
      }
    ],
    recall: {
      promptZh: "操场边，小美指着你的跑步计划表问你多久跑一次。凭记忆，写出她那句英文。",
      intentZh: "你多久跑一次？",
      answer: "How often do you run?",
      noteZh: "How often 站句首、动作请帮手 do。"
    },
    huntCaseIds: ["hunt-run-plan"]
  },

  // ── 第十一批 · L73 要花多久（How long does it take?）：How 家族再添一岗——take 表耗时全库首次转正（批十一 PRD §2）──
  {
    id: "lesson-73-how-long",
    number: 73,
    title: "要花多久",
    grammarLabel: "要花多久 · How long does it take? + It takes…",
    episode: "小美的一天 七十三",
    scene: "city",
    cover: cover9,
    sceneSetupZh: "早高峰的路口，小美见你盯着公交站牌，问你到学校要花多久。",
    dialogueEn: "How long does it take?",
    dialogueZh: "小美凑过来看站牌。",
    intentZh: "到学校要花多久？",
    targetSentence: "How long does it take?",
    blocks: [
      { text: "How long", role: "多久（量时间条）" },
      { text: "does it take?", role: "要花（请帮手 does）" }
    ],
    oneLineRule: "问「要花多久」用 How long does it take——答语 It takes ten minutes（take 表「花时间」）。",
    examples: [
      { en: "How long does it take?", zh: "要花多久？" },
      { en: "It takes ten minutes.", zh: "要花十分钟。" },
      { en: "It takes an hour by bus.", zh: "坐公交车要一个小时。" },
      { en: "How far is the school?", zh: "学校有多远？" }
    ],
    dialogue: [
      { who: "npc", en: "The bus is late again.", zh: "小美看了一眼站牌叹气。" },
      { who: "npc", en: "How long does it take to school?", zh: "她问你到学校要花多久。" },
      { who: "me", en: "It takes ten minutes.", zh: "轮到你说了——要花十分钟。" }
    ],
    contrast: [
      {
        wrong: "How long it takes?",
        wrongMark: null,
        correct: "How long does it take?",
        whyZh: "问动作要请帮手 does：疑问词后面，动作用 does 帮忙（第 72 课刚立的老规矩）。"
      },
      {
        wrong: "It is ten minutes.",
        wrongMark: "is",
        correct: "It takes ten minutes.",
        whyZh: "「花时间」用 takes 不用 is：中文「是十分钟」的惯性——英语说「它花十分钟」。"
      },
      {
        wrong: "How long does it take?",
        wrongMark: null,
        correct: "It takes ten minutes.",
        bothRight: true,
        whyZh: "两句都对——问「要花多久」＋答「要十分钟」：成对出场。"
      },
      {
        wrong: "How far is the school?",
        wrongMark: null,
        correct: "How long does it take?",
        bothRight: true,
        whyZh: "两句都对——「多远」问距离、「多久」问时间：How 家族两兄弟，一个量路、一个量钟。"
      },
      {
        wrong: "How does he go to school?",
        wrongMark: null,
        correct: "How long does it take?",
        bothRight: true,
        whyZh: "两句都对——第 27 课 How 管方式（怎么去）＋今天 How long 量时间：同一个 How，问的东西不同。"
      },
      {
        wrong: "How many books do you have?",
        wrongMark: null,
        correct: "It takes ten minutes.",
        bothRight: true,
        whyZh: "两句都对——第 30 课问数量（多少本）＋今天答时长（十分钟）：How 家族排排站。"
      }
    ],
    variants: [
      { label: "肯定", en: "It takes ten minutes.", zh: "要花十分钟。", noteZh: "take 表花时间：It takes + 时长。" },
      { label: "否定", en: "It doesn't take long.", zh: "花不了多久。", noteZh: "doesn't 帮手 + 原形 take。" },
      { label: "疑问", en: "How long does it take?", zh: "要花多久？", noteZh: "How long 站句首、does 排第二。" }
    ],
    sceneSwings: [
      { sceneZh: "说坐公交要一个小时", en: "It takes an hour by bus.", zh: "坐公交车要一个小时。" },
      { sceneZh: "说走路只要五分钟", en: "It takes five minutes on foot.", zh: "走路只要五分钟。" },
      { sceneZh: "问去火车站要多久", en: "How long does it take to the station?", zh: "去火车站要多久？" }
    ],
    deepDive: {
      title: "take 表花时间",
      paragraphs: [
        "「花时间」英语有自己的词：take。东西当主角——It takes ten minutes（「它」花十分钟）。这个「它」不是小美、不是公交车，是那段路、那件事本身。",
        "问句和答句成对记：How long does it take?（要花多久？）／It takes ten minutes.（要花十分钟。）问的时候 does 帮忙，答的时候 takes 穿上 -s（它一个，三单尾巴）。",
        "It takes an hour by bus.（坐公交要一小时）——后面想说什么交通工具、走什么路，都可以跟。",
        "How 家族越排越长：How are you（你好吗）、How old（多大）、How many（多少）、How often（多久一次）、今天的 How long（要花多久）。还有一个认读的小兄弟：How far（有多远）——问距离，你先认得、听得出就行。"
      ]
    },
    summary: {
      rule: "问「要花多久」：How long does it take?——答：It takes + 时长（takes 表花时间）。",
      points: [
        "How long does it take? —— How 家族又一岗",
        "It takes ten minutes. —— 「花时间」用 takes",
        "How far is the school? —— 「多远」认读兄弟"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想问：要花多久？",
        before: "How long",
        after: "take?",
        options: ["does it", "it", "is it"],
        answer: "does it",
        explain: "问动作请帮手：How long does it take。"
      },
      {
        kind: "arrange",
        promptZh: "你想问：要花多久？",
        tokens: ["How", "long", "does", "it", "take?"],
        answer: "How long does it take?",
        explain: "How long 站句首、does 排第二：疑问词的老规矩。"
      },
      {
        // R8 跨课复现：第 27 课（How 管方式老句）
        kind: "arrange",
        promptZh: "先复习一小步——第 27 课学过：你在找什么？",
        tokens: ["What", "are", "you", "looking", "for?"],
        answer: "What are you looking for?",
        explain: "复现第 27 课：疑问词家族起点——今天 How 再添一岗。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["It", "is", "ten", "minutes."],
        wrongToken: "is",
        answer: "is",
        correctionZh: "「花时间」用 takes 不用 is：It takes ten minutes。",
        explain: "中文「是十分钟」的惯性——英语说「它花十分钟」。"
      },
      {
        // R8 跨课复现：第 30 课（How many）
        kind: "arrange",
        promptZh: "再对照一句——第 30 课学过：你有多少本书？",
        tokens: ["How", "many", "books", "do", "you", "have?"],
        answer: "How many books do you have?",
        explain: "复现第 30 课：How 家族排排站——问完数量，今天问时长。"
      },
      {
        // R9 变形/替换：问距离的认读句（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「How long does it take?」想问「有多远」，How 后面那截要怎么换？",
        replaceBase: "How long does it take?",
        replaceTarget: "把 long 换成 far（问距离）",
        options: ["How far is the school?", "How far does it take?", "How long is the school?"],
        answer: "How far is the school?",
        explain: "问距离：How far is the school?——今天认读一句，混个脸熟。"
      }
    ],
    practice: [
      {
        promptZh: "你想问：要花多久？",
        tokens: ["How", "long", "does", "it", "take?"],
        distractors: ["is"],
        answer: "How long does it take?"
      },
      {
        // R06 变体扩量：与 variants 否定卡逐字一致的否定变体题
        promptZh: "你想说：花不了多久。",
        tokens: ["It", "doesn't", "take", "long."],
        distractors: ["takes"],
        answer: "It doesn't take long."
      },
      {
        promptZh: "你想答：要花十分钟。",
        tokens: ["It", "takes", "ten", "minutes."],
        distractors: ["is"],
        answer: "It takes ten minutes."
      },
      {
        // R8 跨课复现：第 30 课原句
        promptZh: "复习第 30 课：你有多少本书？",
        tokens: ["How", "many", "books", "do", "you", "have?"],
        distractors: ["does"],
        answer: "How many books do you have?"
      }
    ],
    recall: {
      promptZh: "早高峰路口，小美看着站牌问你到学校要花多久。凭记忆，写出她那句英文。",
      intentZh: "要花多久？",
      answer: "How long does it take?",
      noteZh: "How long 站句首、does 排第二。"
    },
    huntCaseIds: ["hunt-trip-time"]
  },

  // ── 第十一批 · L74 让我来帮你（Let me / help + 原形）：两个口令块——第 61 课请求义的来处，今天出手义转正（批十一 PRD §2）──
  {
    id: "lesson-74-help-let",
    number: 74,
    title: "让我来帮你",
    grammarLabel: "让我来 · Let me / help + 动作穿原样",
    episode: "小美的一天 七十四",
    scene: "mansion",
    cover: cover19,
    sceneSetupZh: "周末搬家，小美看你抱着纸箱腾不出手，开口说让我来帮你。",
    dialogueEn: "Let me help you.",
    dialogueZh: "小美接过你手里的纸箱。",
    intentZh: "让我来帮你。",
    targetSentence: "Let me help you.",
    blocks: [
      { text: "Let me", role: "让我来（我出手）" },
      { text: "help you", role: "帮你（搭把手）" }
    ],
    oneLineRule: "「让我来」用 Let me + 动作穿原样（Let me help）；「帮你做」help 后面也是动作穿原样（help you carry）——口令块后面直接接动作，不垫板。",
    examples: [
      { en: "Let me help you.", zh: "让我来帮你。" },
      { en: "Let me carry the box.", zh: "让我来搬这个箱子。" },
      { en: "He helped me carry the box.", zh: "他帮我搬了箱子。" },
      { en: "Can I help you?", zh: "我能帮上忙吗？" }
    ],
    dialogue: [
      { who: "npc", en: "This box is heavy!", zh: "你抱着纸箱喘着气。" },
      { who: "npc", en: "Let me help you.", zh: "小美伸手接过纸箱。" },
      { who: "me", en: "Let me help you.", zh: "轮到你说了——让我来帮你。" }
    ],
    contrast: [
      {
        wrong: "Let me to help you.",
        wrongMark: "to",
        correct: "Let me help you.",
        whyZh: "口令块后面直接接动作，不垫板：Let me help——跟第 47 课家族一个规矩。"
      },
      {
        wrong: "Let me helps you.",
        wrongMark: "helps",
        correct: "Let me help you.",
        whyZh: "动词穿原样：跟 must/should/can 家族一个规矩——helps 的 -s 不给它穿。"
      },
      {
        wrong: "Could you help me?",
        wrongMark: null,
        correct: "Let me help you.",
        bothRight: true,
        whyZh: "两句都对——你会请人帮你（第 61 课），今天你也能开口帮人：一来一往，两条都会。"
      },
      {
        wrong: "He helped me carry the box.",
        wrongMark: null,
        correct: "Let me help you.",
        bothRight: true,
        whyZh: "两句都对——help 后面垫不垫 to 两可：helped me carry 和 helped me to carry 都对；别的口令块一个都不垫，这里最宽松。"
      },
      {
        wrong: "Let me carry the box.",
        wrongMark: null,
        correct: "Let me help you.",
        bothRight: true,
        whyZh: "两句都对——同一个口令块换动作：Let me help you ／ Let me carry the box——后面接什么就做什么。"
      },
      {
        wrong: "You should sleep early.",
        wrongMark: null,
        correct: "Let me help you.",
        bothRight: true,
        whyZh: "两句都对——第 47 课家族不垫板（should sleep）＋今天的 Let me help：老规矩一条线。"
      }
    ],
    variants: [
      { label: "肯定", en: "Let me help you.", zh: "让我来帮你。", noteZh: "Let me + 动作穿原样。" },
      { label: "否定", en: "She doesn't let me help.", zh: "她不让我帮忙。", noteZh: "doesn't 帮忙，let 照样穿原样。" },
      { label: "疑问", en: "Can I help you?", zh: "我能帮上忙吗？", noteZh: "出手也常这么问——第 14 课 can 老熟人。" }
    ],
    sceneSwings: [
      { sceneZh: "说让我来搬这个箱子", en: "Let me carry the box.", zh: "让我来搬这个箱子。" },
      { sceneZh: "说他帮我搬了箱子", en: "He helped me carry the box.", zh: "他帮我搬了箱子。" },
      { sceneZh: "问「我能帮上忙吗」", en: "Can I help you?", zh: "我能帮上忙吗？" }
    ],
    deepDive: {
      title: "两个口令块",
      paragraphs: [
        "今天认识两个「口令块」：Let me（让我来——我出手）和 help（搭把手）。它们后面都直接接动作，动作穿原样：Let me help、help you carry——不垫板、不加 -s，跟 must/should/can 家族一个规矩。",
        "第 61 课你会说 Could you help me?（请你帮我）；今天反过来：Let me help you（让我来帮你）——请求和出手，一件事的两头都齐了。",
        "help 后面最宽松：垫不垫 to 两可——He helped me carry the box. 和 He helped me to carry the box. 都对。别的口令块一个都不垫，只有它两头都收。",
        "「让」这个字中文里管的事很多：让某人做（Let me…）、让谁等（wait）……今天先拿下一个最常用的：Let me——我出手的时候开口说它。"
      ]
    },
    summary: {
      rule: "「让我来」Let me + 动作穿原样；「帮你做」help + 动作穿原样——口令块后面直接接动作，不垫板。",
      points: [
        "Let me help you. —— 让我来（我出手）",
        "He helped me carry the box. —— help 后垫不垫 to 两可",
        "Could you help me? ／ Let me help you. —— 请求与出手两头"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：让我来帮你。",
        before: "Let me",
        after: "you.",
        options: ["help", "to help", "helps"],
        answer: "help",
        explain: "口令块后面直接接动作：Let me help。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：让我来帮你。",
        tokens: ["Let", "me", "help", "you."],
        answer: "Let me help you.",
        explain: "Let me + 动作穿原样：口令块出手。"
      },
      {
        // R8 跨课复现：第 61 课（请求义）
        kind: "arrange",
        promptZh: "先复习一小步——第 61 课学过：能帮我一下吗？",
        tokens: ["Could", "you", "help", "me?"],
        answer: "Could you help me?",
        explain: "复现第 61 课：请求义——今天换成自己出手。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["Let", "me", "to", "help", "you."],
        wrongToken: "to",
        answer: "to",
        correctionZh: "口令块不垫板：Let me help you。",
        explain: "跟 must/should 家族一个规矩。"
      },
      {
        // R8 跨课复现：第 47 课（家族不垫板）
        kind: "arrange",
        promptZh: "再对照一句——第 47 课学过：你该早点睡。",
        tokens: ["You", "should", "sleep", "early."],
        answer: "You should sleep early.",
        explain: "复现第 47 课：家族不垫板——老规矩今天扩到 Let me。"
      },
      {
        // R9 变形/替换：换动作（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「Let me help you.」把「帮你」换成「搬这个箱子（carry the box）」，动作要怎么变？",
        replaceBase: "Let me help you.",
        replaceTarget: "把 help you 换成 carry the box",
        options: ["carry the box", "to carry the box", "carrying the box"],
        answer: "carry the box",
        explain: "动作穿原样：Let me carry the box。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：让我来帮你。",
        tokens: ["Let", "me", "help", "you."],
        distractors: ["to"],
        answer: "Let me help you."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：我能帮上忙吗？",
        tokens: ["Can", "I", "help", "you?"],
        distractors: ["Do"],
        answer: "Can I help you?"
      },
      {
        promptZh: "你想说：让我来做吧。",
        tokens: ["Let", "me", "do", "it."],
        distractors: ["does"],
        answer: "Let me do it."
      },
      {
        // R8 跨课复现：第 47 课原句
        promptZh: "复习第 47 课：你该早点睡。",
        tokens: ["You", "should", "sleep", "early."],
        distractors: ["to"],
        answer: "You should sleep early."
      }
    ],
    recall: {
      promptZh: "周末搬家，小美看你抱着纸箱腾不出手，开口搭把手。凭记忆，写出她那句英文。",
      intentZh: "让我来帮你。",
      answer: "Let me help you.",
      noteZh: "Let me + 动作穿原样——不垫板。"
    },
    huntCaseIds: ["hunt-moving-help"]
  },

  // ── 第十一批 · L75 咱们去…吧（Let's + How about）：老熟人转正——L56/L65 对白两处弱曝；提议功能收口；批收口（批十一 PRD §2）──
  {
    id: "lesson-75-lets",
    number: 75,
    title: "咱们去…吧",
    grammarLabel: "提议 · Let's + 动作穿原样",
    episode: "小美的一天 七十五",
    scene: "forest",
    cover: cover29,
    sceneSetupZh: "周六早上，小美扒着窗帘看天气，回头提议一起去公园。",
    dialogueEn: "Let's go to the park.",
    dialogueZh: "小美放下窗帘，回头提议。",
    intentZh: "咱们去公园吧。",
    targetSentence: "Let's go to the park.",
    blocks: [
      { text: "Let's", role: "咱们…吧（口令块）" },
      { text: "go to the park", role: "去公园（动作穿原样）" }
    ],
    oneLineRule: "提议「咱们去…吧」用 Let's + 动作穿原样（Let's go）——口令块后面直接接动作，不垫板。",
    examples: [
      { en: "Let's go to the park.", zh: "咱们去公园吧。" },
      { en: "Good idea!", zh: "好主意！" },
      { en: "How about going to the park?", zh: "去公园怎么样？" },
      { en: "Let's not go now.", zh: "咱们别现在去。" }
    ],
    dialogue: [
      { who: "npc", en: "The weather is great today!", zh: "小美扒着窗帘往外看。" },
      { who: "npc", en: "Let's go to the park.", zh: "她回头提议。" },
      { who: "me", en: "Good idea!", zh: "轮到你说了——好主意！" }
    ],
    contrast: [
      {
        wrong: "Let's to go to the park.",
        wrongMark: "to",
        correct: "Let's go to the park.",
        whyZh: "口令块后面直接接动作，不垫板：Let's go——跟第 74 课同规矩。"
      },
      {
        wrong: "Let's going to the park.",
        wrongMark: "going",
        correct: "Let's go to the park.",
        whyZh: "动词穿原样，不换 -ing 装：跟 must/should 家族一个规矩。"
      },
      {
        wrong: "Let's go to the park.",
        wrongMark: null,
        correct: "How about going to the park?",
        bothRight: true,
        whyZh: "两句都对——Let's 直接提议、How about 把选项放桌上问：提议的第二种说法今天送你。"
      },
      {
        wrong: "What about you?",
        wrongMark: null,
        correct: "How about a cup of tea?",
        bothRight: true,
        whyZh: "两句都对——老位上的 What about 是「你呢」（第 45 课）；How about 才是「怎么样」——一个词两岗，看后头跟着谁。"
      },
      {
        wrong: "Let's circle it on the calendar.",
        wrongMark: null,
        correct: "Let's go to the park.",
        bothRight: true,
        whyZh: "两句都对——第 56 课对白里的 Let's（来，圈在挂历上）转正：老句子今天扶正。"
      },
      {
        wrong: "Let's go to the park.",
        wrongMark: null,
        correct: "Good idea!",
        bothRight: true,
        whyZh: "两句都对——提议＋接话成对出场：Let's…（咱们去吧）／ Good idea!（好主意）。"
      }
    ],
    variants: [
      { label: "肯定", en: "Let's go to the park.", zh: "咱们去公园吧。", noteZh: "Let's + 动作穿原样。" },
      { label: "否定", en: "Let's not go now.", zh: "咱们别现在去。", noteZh: "not 跟在 Let's 后面。" },
      { label: "提议（第二种）", en: "How about going to the park?", zh: "去公园怎么样？", noteZh: "How about 后面穿名字版 going——把选项放桌上问。" }
    ],
    sceneSwings: [
      { sceneZh: "提议出来接话「好主意」", en: "Good idea!", zh: "好主意！" },
      { sceneZh: "说咱们别现在去", en: "Let's not go now.", zh: "咱们别现在去。" },
      { sceneZh: "提议去公园（第二种说法）", en: "How about going to the park?", zh: "去公园怎么样？" }
    ],
    deepDive: {
      title: "口令块 Let's 与把选项放桌上",
      paragraphs: [
        "Let's 是「Let us」的缩写——字面是「让我们」，实际是提议：咱们一起吧。它是对白里的老熟人：第 56 课「Let's circle it on the calendar.」、第 65 课「Let's check our height!」——今天正式扶正成你自己的句子。",
        "规矩和第 74 课一样：口令块后面直接接动作、动作穿原样——Let's go、Let's eat，不垫板、不加装。",
        "提议还有第二种说法：How about + 名字版（How about going to the park?）——把选项放桌上问，比 Let's 软一点。",
        "接话成对记：别人提议，你同意就说 Good idea!（好主意）；想换个主意就说 How about…?——一条提议链就齐了。"
      ]
    },
    summary: {
      rule: "提议「咱们…吧」：Let's + 动作穿原样（Let's go）——第二种说法 How about + 名字版。",
      points: [
        "Let's go to the park. —— 口令块提议",
        "Good idea! —— 接话成对",
        "How about going to the park? —— 把选项放桌上"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想提议：咱们去公园吧。",
        before: "Let's",
        after: "to the park.",
        options: ["go", "to go", "going"],
        answer: "go",
        explain: "口令块后面直接接动作：Let's go。"
      },
      {
        kind: "arrange",
        promptZh: "你想提议：咱们去公园吧。",
        tokens: ["Let's", "go", "to", "the", "park."],
        answer: "Let's go to the park.",
        explain: "Let's + 动作穿原样：口令块提议。"
      },
      {
        // R8 跨课复现：第 29 课（从「我打算」到「咱们去吧」）
        kind: "arrange",
        promptZh: "先复习一小步——第 29 课学过：我打算去看电影。",
        tokens: ["I", "am", "going", "to", "watch", "a", "movie."],
        answer: "I am going to watch a movie.",
        explain: "复现第 29 课：「我打算」（自己）——今天升级成「咱们去吧」（一起）。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["Let's", "to", "go", "to", "the", "park."],
        wrongToken: "to",
        answer: "to",
        correctionZh: "口令块不垫板：Let's go——去掉第一个 to。",
        explain: "跟第 74 课同规矩。"
      },
      {
        // R8 跨课复现：第 65 课（Let's 弱曝句转正）
        kind: "arrange",
        promptZh: "再对照一句——第 65 课听过：咱们来量量身高！",
        tokens: ["Let's", "check", "our", "height!"],
        answer: "Let's check our height!",
        explain: "复现第 65 课：对白里的 Let's——今天是你自己的句子了。"
      },
      {
        // R9 变形/替换：换第二种说法（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「Let's go to the park.」换成第二种提议说法（把选项放桌上问），开头要怎么换？",
        replaceBase: "Let's go to the park.",
        replaceTarget: "换成 How about 型提议",
        options: ["How about going to the park?", "How about go to the park?", "How about to go to the park?"],
        answer: "How about going to the park?",
        explain: "How about 后面穿名字版：going——第二说法今天会了。"
      }
    ],
    practice: [
      {
        promptZh: "你想提议：咱们去公园吧。",
        tokens: ["Let's", "go", "to", "the", "park."],
        distractors: ["going"],
        answer: "Let's go to the park."
      },
      {
        // R06 变体扩量：与 variants 第二种提议卡逐字一致的变体题
        promptZh: "你想换种说法（把选项放桌上）：去公园怎么样？",
        tokens: ["How", "about", "going", "to", "the", "park?"],
        distractors: ["go"],
        answer: "How about going to the park?"
      },
      {
        promptZh: "你想说：咱们来做吧。",
        tokens: ["Let's", "do", "it."],
        distractors: ["does"],
        answer: "Let's do it."
      },
      {
        // R8 跨课复现：第 29 课原句（批收口串线）
        promptZh: "全批收官——复习第 29 课：我打算去看电影。",
        tokens: ["I", "am", "going", "to", "watch", "a", "movie."],
        distractors: ["watches"],
        answer: "I am going to watch a movie."
      }
    ],
    recall: {
      promptZh: "周六早上天气晴，小美回头提议一起去公园。凭记忆，写出她那句英文。",
      intentZh: "咱们去公园吧。",
      answer: "Let's go to the park.",
      noteZh: "Let's + 动作穿原样——不垫板。"
    },
    huntCaseIds: ["hunt-park-plan"]
  },

  // ── 第十二批 · L76 好多了（much + 比较级）：给「更」加力的小词——B1 真课提前（批十二 PRD §2）──
  {
    id: "lesson-76-much-better",
    number: 76,
    title: "好多了",
    grammarLabel: "程度加力 · much + 比较级",
    episode: "小美的一天 七十六",
    scene: "mansion",
    cover: cover7,
    sceneSetupZh: "小美昨天不太舒服，今天在客厅伸了个懒腰，说自己好多了。",
    dialogueEn: "I feel much better today.",
    dialogueZh: "小美伸了个懒腰，笑着跟你说。",
    intentZh: "我今天好多了。",
    targetSentence: "I feel much better today.",
    blocks: [
      { text: "I feel", role: "我觉得（身体感觉）" },
      { text: "much better", role: "好多了（给「更」加力）" },
      { text: "today", role: "今天" }
    ],
    oneLineRule: "给「更」加力的小词用 much：much better、much taller——它站比较级前面，比单说 better 力气更大。",
    examples: [
      { en: "I feel much better today.", zh: "我今天好多了。" },
      { en: "He is much taller than me.", zh: "他比我高多了。" },
      { en: "This one is much better.", zh: "这个好多了。" },
      { en: "How far is the school?", zh: "学校有多远？" }
    ],
    dialogue: [
      { who: "npc", en: "Are you feeling better?", zh: "妈妈端着一杯热水走过来。" },
      { who: "npc", en: "You looked tired yesterday.", zh: "她昨天看你蔫蔫的。" },
      { who: "me", en: "I feel much better today.", zh: "轮到你说了——我今天好多了。" }
    ],
    contrast: [
      {
        wrong: "How much milk is there?",
        wrongMark: null,
        correct: "I feel much better.",
        bothRight: true,
        whyZh: "两句都对——much 有两个岗：管数量（How much milk，第 30 课）和给「更」加力（much better，今天）——看它后头跟着谁。"
      },
      {
        wrong: "I am very better.",
        wrongMark: "very",
        correct: "I feel much better.",
        whyZh: "「好多了」用 much 不用 very：very 不能给「更」加力——想加力，请 much 上场。"
      },
      {
        wrong: "He is more taller than me.",
        wrongMark: "more",
        correct: "He is much taller than me.",
        whyZh: "「更」已经藏在 taller 里了：前面只加力、不再叠 more——more 和 -er 没见过面。"
      },
      {
        wrong: "I feel much better today.",
        wrongMark: null,
        correct: "He is much taller than me.",
        bothRight: true,
        whyZh: "两句都对——同一个小词，一个管感觉（much better）、一个管个子（much taller）：成对出场。"
      },
      {
        wrong: "It is the best movie this year.",
        wrongMark: null,
        correct: "I feel much better today.",
        bothRight: true,
        whyZh: "两句都对——第 31 课 good→better→best 的老规矩，今天在 better 前面加力：much better。"
      },
      {
        wrong: "How far is the school?",
        wrongMark: null,
        correct: "I feel much better today.",
        bothRight: true,
        whyZh: "两句都对——第 73 课 far 老熟人（「多远」）今天只认读：far 也能给「更」加力（far better），先混个脸熟。"
      }
    ],
    variants: [
      { label: "肯定", en: "I feel much better today.", zh: "我今天好多了。", noteZh: "much 站比较级前面加力。" },
      { label: "否定", en: "I am not much better today.", zh: "我今天没好多少。", noteZh: "not 插在 much 前面。" },
      { label: "疑问", en: "Are you much better today?", zh: "你今天好点了吗？", noteZh: "Are 搬句首——问对方好转没。" }
    ],
    sceneSwings: [
      { sceneZh: "说他比我高多了", en: "He is much taller than me.", zh: "他比我高多了。" },
      { sceneZh: "说这个好多了", en: "This one is much better.", zh: "这个好多了。" },
      { sceneZh: "问对方好点了吗", en: "Are you much better today?", zh: "你今天好点了吗？" }
    ],
    deepDive: {
      title: "much 的两个岗",
      paragraphs: [
        "第 30 课你认识过 much 的一个岗：管「数不清的数量」——How much milk（多少牛奶）。今天它换第二个岗：给「更」加力。",
        "怎么分？看它后面跟着谁：跟「数不清的东西」（milk、money、water）＝问数量；跟「更…的词」（better、taller）＝加力。一个 much，两班岗，看后头。",
        "给「更」加力的不止 much：far 也行——far better（好得多）比 much better 力气还大。far 你第 73 课见过（How far 问距离）——今天认读一句，混个脸熟。",
        "为什么不能说 very better？因为 very 是「非常」的岗（very good），它不给「更」加力。中文说「好多了」，英语的力气词是 much——记住这句，very 就不会串门了。"
      ]
    },
    summary: {
      rule: "给「更」加力的小词：much better、much taller——站比较级前面。",
      points: [
        "I feel much better today. —— 加力小词上岗",
        "much 两岗：管数量（much milk）／加力（much better）",
        "very better ❌ —— very 不站这个位"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我今天好多了。",
        before: "I feel",
        after: "better today.",
        options: ["much", "very", "more"],
        answer: "much",
        explain: "给「更」加力用 much：much better。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我今天好多了。",
        tokens: ["I", "feel", "much", "better", "today."],
        answer: "I feel much better today.",
        explain: "加力小词站比较级前面：much better。"
      },
      {
        // R8 跨课复现：第 17 课（比较链起点）
        kind: "arrange",
        promptZh: "先复习一小步——第 17 课学过：这条船比那条大。",
        tokens: ["This", "boat", "is", "bigger", "than", "that", "one."],
        answer: "This boat is bigger than that one.",
        explain: "复现第 17 课：「更」的门牌——今天给它加力。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "feel", "very", "better", "today."],
        wrongToken: "very",
        answer: "very",
        correctionZh: "给「更」加力用 much：much better——very 不站这个位。",
        explain: "very 是「非常」的岗，不给「更」加力。"
      },
      {
        // R8 跨课复现：第 31 课（good→better→best）
        kind: "arrange",
        promptZh: "再对照一句——第 31 课学过：这是今年最好的电影。",
        tokens: ["It", "is", "the", "best", "movie", "this", "year."],
        answer: "It is the best movie this year.",
        explain: "复现第 31 课：good→better→best 老规矩——今天在 better 前面加力。"
      },
      {
        // R9 变形/替换：换比较的词（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I feel much better today.」把「好」换成「高（tall）」，加力句要怎么变？",
        replaceBase: "I feel much better today.",
        replaceTarget: "把 better 换成 tall（说他比我高多了）",
        options: ["much taller than me", "more taller than me", "very taller than me"],
        answer: "much taller than me",
        explain: "加力 + 「更」的词：much taller than me——不叠 more、不请 very。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我今天好多了。",
        tokens: ["I", "feel", "much", "better", "today."],
        distractors: ["very"],
        answer: "I feel much better today."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：你今天好点了吗？",
        tokens: ["Are", "you", "much", "better", "today?"],
        distractors: ["Do"],
        answer: "Are you much better today?"
      },
      {
        promptZh: "你想说：他比我高多了。",
        tokens: ["He", "is", "much", "taller", "than", "me."],
        distractors: ["more"],
        answer: "He is much taller than me."
      },
      {
        // R8 跨课复现：第 30 课原句
        promptZh: "复习第 30 课：有多少牛奶？",
        tokens: ["How", "much", "milk", "is", "there?"],
        distractors: ["many"],
        answer: "How much milk is there?"
      }
    ],
    recall: {
      promptZh: "小美昨天不太舒服，今天在客厅伸了个懒腰。凭记忆，写出她那句英文。",
      intentZh: "我今天好多了。",
      answer: "I feel much better today.",
      noteZh: "加力小词站比较级前面：much better。"
    },
    huntCaseIds: ["hunt-feel-better"]
  },

  // ── 第十二批 · L77 一直在做（keep + 名字版）：名字版通行证第五站——keep 是「一直」，不是「收尾」（批十二 PRD §2）──
  {
    id: "lesson-77-keep-doing",
    number: 77,
    title: "一直在做",
    grammarLabel: "习惯不停 · keep + 名字版",
    episode: "小美的一天 七十七",
    scene: "campus",
    cover: cover42,
    sceneSetupZh: "放学后的自习角，小美看你每天来，问你是不是一直都在这里做作业。",
    dialogueEn: "I keep doing my homework.",
    dialogueZh: "小美放下书包，朝你笑了笑。",
    intentZh: "我一直在做作业。",
    targetSentence: "I keep doing my homework.",
    blocks: [
      { text: "I keep", role: "我一直（不停）" },
      { text: "doing my homework", role: "做作业（名字版）" }
    ],
    oneLineRule: "一件事一直做、不停做，用 keep + 名字版（keep doing）——keep 是「一直」，不是「做完」（那是第 64 课的 finish）。",
    examples: [
      { en: "I keep doing my homework.", zh: "我一直在做作业。" },
      { en: "I keep reading at night.", zh: "我一直在晚上读书。" },
      { en: "She keeps asking questions.", zh: "她一直在问问题。" },
      { en: "I finished reading the book.", zh: "我看完这本书了。" }
    ],
    dialogue: [
      { who: "npc", en: "You are here again!", zh: "小美放下书包，朝你笑了笑。" },
      { who: "npc", en: "Every day after school!", zh: "她数了数日子。" },
      { who: "me", en: "I keep doing my homework.", zh: "轮到你说了——我一直在做作业。" }
    ],
    contrast: [
      {
        wrong: "I keep to do my homework.",
        wrongMark: "to",
        correct: "I keep doing my homework.",
        whyZh: "名字版通道只收名字版、不垫板：keep doing——跟 like/enjoy/finish 一个规矩。"
      },
      {
        wrong: "He keeps do it.",
        wrongMark: "do",
        correct: "He keeps doing it.",
        whyZh: "名字版不装光板：keeps doing——三单的 -s 只动 keep 自己，后面照样穿名字版。"
      },
      {
        wrong: "I finished reading the book.",
        wrongMark: null,
        correct: "I keep reading at night.",
        bothRight: true,
        whyZh: "两句都对——finish 是刹车（做完了）、keep 是不停车（一直在做）：一个收尾、一个持续，分工不同。"
      },
      {
        wrong: "You keep quiet, please.",
        wrongMark: null,
        correct: "I keep reading.",
        bothRight: true,
        whyZh: "两句都对——老位上的 keep 是「保持」（keep quiet 保持安静）；今天这条是「一直」（keep reading）——看后头跟的是状态还是名字版。"
      },
      {
        wrong: "I enjoy reading.",
        wrongMark: null,
        correct: "I keep doing my homework.",
        bothRight: true,
        whyZh: "两句都对——第 45 课名字版通行证老站＋今天第五站：enjoy reading ／ keep doing。"
      },
      {
        wrong: "I am good at drawing.",
        wrongMark: null,
        correct: "I keep doing my homework.",
        bothRight: true,
        whyZh: "两句都对——第 67 课通道老规矩（入口后面永远跟名字版）＋今天 keep：通行证第五站打卡。"
      }
    ],
    variants: [
      { label: "肯定", en: "I keep doing my homework.", zh: "我一直在做作业。", noteZh: "keep + 名字版：不停做。" },
      { label: "否定", en: "I don't keep doing it.", zh: "我不再一直做了。", noteZh: "don't 帮忙，后面照样名字版。" },
      { label: "疑问", en: "Do you keep reading at night?", zh: "你一直在晚上读书吗？", noteZh: "Do 站句首——问对方是不是一直在做。" }
    ],
    sceneSwings: [
      { sceneZh: "说我一直在晚上读书", en: "I keep reading at night.", zh: "我一直在晚上读书。" },
      { sceneZh: "说她一直在问问题", en: "She keeps asking questions.", zh: "她一直在问问题。" },
      { sceneZh: "问对方是不是一直在晚上读书", en: "Do you keep reading at night?", zh: "你一直在晚上读书吗？" }
    ],
    deepDive: {
      title: "名字版通行证第五站",
      paragraphs: [
        "名字版通行证一路打卡：第 42 课 like reading（喜欢）、第 45 课 enjoy reading（享受）、第 64 课 finish reading（做完）、第 67 课 good at drawing（擅长）——今天第五站：keep reading（一直做）。",
        "先分清 keep 和 finish：finish 是刹车——做完了、停下了；keep 是不停车——一直做、不停下。I finished reading 是「看完了」；I keep reading 是「一直在看」。",
        "keep 还有一个老位子：「保持」——keep quiet（保持安静）、keep the door open（让门开着）。今天这条是「一直做」（后面跟名字版）——看后头跟的是状态还是名字版，就知道是哪个岗。",
        "三单的规矩照旧：He keeps doing——keep 自己加 -s（他不一般），后面的名字版不动。"
      ]
    },
    summary: {
      rule: "一直做不停做：keep + 名字版（keep doing）——keep 是不停车，finish 是刹车。",
      points: [
        "I keep doing my homework. —— 通行证第五站",
        "I finished reading. ／ I keep reading. —— 刹车 vs 不停车",
        "He keeps doing it. —— 三单只动 keep 自己"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我一直在做作业。",
        before: "I keep",
        after: "my homework.",
        options: ["doing", "to do", "do"],
        answer: "doing",
        explain: "名字版通道只收名字版：keep doing。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我一直在做作业。",
        tokens: ["I", "keep", "doing", "my", "homework."],
        answer: "I keep doing my homework.",
        explain: "keep + 名字版：不停做。"
      },
      {
        // R8 跨课复现：第 64 课（最近邻划界）
        kind: "arrange",
        promptZh: "先复习一小步——第 64 课学过：我看完这本书了。",
        tokens: ["I", "finished", "reading", "the", "book."],
        answer: "I finished reading the book.",
        explain: "复现第 64 课：finish 是刹车（做完了）——今天学不停车（keep）。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "keep", "to", "do", "my", "homework."],
        wrongToken: "to",
        answer: "to",
        correctionZh: "名字版通道不垫板：keep doing。",
        explain: "跟 like/enjoy/finish 一个规矩。"
      },
      {
        // R8 跨课复现：第 42 课（通行证首站）
        kind: "arrange",
        promptZh: "再对照一句——第 42 课学过：我喜欢读书。",
        tokens: ["I", "like", "reading."],
        answer: "I like reading.",
        explain: "复现第 42 课：通行证首站——今天第五站打卡。"
      },
      {
        // R9 变形/替换：换做的事（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I keep doing my homework.」把「做作业」换成「读书（read）」，通道后面要怎么变？",
        replaceBase: "I keep doing my homework.",
        replaceTarget: "把 doing my homework 换成 read（一直在读书）",
        options: ["reading", "read", "to read"],
        answer: "reading",
        explain: "名字版换一件：keep reading——-ing 外套穿好。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我一直在做作业。",
        tokens: ["I", "keep", "doing", "my", "homework."],
        distractors: ["to"],
        answer: "I keep doing my homework."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：你一直在晚上读书吗？",
        tokens: ["Do", "you", "keep", "reading", "at", "night?"],
        distractors: ["Does"],
        answer: "Do you keep reading at night?"
      },
      {
        promptZh: "你想说：我一直在晚上读书。",
        tokens: ["I", "keep", "reading", "at", "night."],
        distractors: ["read"],
        answer: "I keep reading at night."
      },
      {
        // R8 跨课复现：第 42 课原句
        promptZh: "复习第 42 课：我喜欢读书。",
        tokens: ["I", "like", "reading."],
        distractors: ["to"],
        answer: "I like reading."
      }
    ],
    recall: {
      promptZh: "放学后的自习角，小美看你每天来，说你从来没停下。凭记忆，写出你那句英文。",
      intentZh: "我一直在做作业。",
      answer: "I keep doing my homework.",
      noteZh: "keep + 名字版：不停车。"
    },
    huntCaseIds: ["hunt-hobby-habit"]
  },

  // ── 第十二批 · L78 一天的故事（跨季综合 · 零新知全复现 · 批收口）：把一天串成一条线（批十二 PRD §2）──
  {
    id: "lesson-78-day-story",
    number: 78,
    title: "一天的故事",
    grammarLabel: "收口 · 跨季大团圆（零新知）",
    episode: "小美的一天 七十八",
    scene: "sparkle",
    cover: cover25,
    sceneSetupZh: "傍晚的公园长椅，小美把一天做的事串成一条线，讲给你听。",
    dialogueEn: "I run every day, and I keep reading.",
    dialogueZh: "小美靠在长椅上，望着跑道上的人。",
    intentZh: "我每天跑步，也一直在读书。",
    targetSentence: "I run every day, and I keep reading.",
    blocks: [
      { text: "I run every day", role: "我每天跑步（频率位）" },
      { text: "and", role: "而且（两条线接起来）" },
      { text: "I keep reading", role: "我一直在读书（不停车）" }
    ],
    oneLineRule: "把两件事串成一条线：中间用 and 接上——前半句说「每天」，后半句说「一直」，一天的故事就齐了。",
    examples: [
      { en: "I run every day, and I keep reading.", zh: "我每天跑步，也一直在读书。" },
      { en: "I don't run every day, but I keep reading.", zh: "我不是每天跑，但一直在读书。" },
      { en: "Do you run or walk every day?", zh: "你每天是跑步还是走路？" },
      { en: "When it is sunny, I run in the park.", zh: "天晴的时候，我在公园跑步。" }
    ],
    dialogue: [
      { who: "npc", en: "The park is so lively tonight!", zh: "小美靠在长椅上，望着跑道上的人。" },
      { who: "npc", en: "What do you do every day?", zh: "她转头问你每天做些什么。" },
      { who: "me", en: "I run every day, and I keep reading.", zh: "轮到你说了——我每天跑步，也一直在读书。" }
    ],
    contrast: [
      {
        wrong: "I finished read the book.",
        wrongMark: "read",
        correct: "I finished reading the book.",
        whyZh: "名字版通道：finish 后面也收名字版（第 64 课老规矩——光板进不了门）。"
      },
      {
        wrong: "I feel very better today.",
        wrongMark: "very",
        correct: "I feel much better today.",
        whyZh: "刚学的加力小词回流：much better——very 不站「更」前面（第 76 课）。"
      },
      {
        wrong: "This boat is bigger than that one.",
        wrongMark: null,
        correct: "I feel much better today.",
        bothRight: true,
        whyZh: "两句都对——第 17 课的「更」（bigger than）＋第 76 课的「更加力」（much better）：同台站好。"
      },
      {
        wrong: "I enjoy reading.",
        wrongMark: null,
        correct: "I keep reading at night.",
        bothRight: true,
        whyZh: "两句都对——第 45 课 enjoy reading ＋ 第 77 课 keep reading：名字版通行证两位老站同台。"
      },
      {
        wrong: "I always arrive early.",
        wrongMark: null,
        correct: "I run every day, and I keep reading.",
        bothRight: true,
        whyZh: "两句都对——第 28 课频率位（always 站动词前）＋今天 every day 收尾：说节奏的两条路。"
      },
      {
        wrong: "When it is sunny, I run in the park.",
        wrongMark: null,
        correct: "I run every day, and I keep reading.",
        bothRight: true,
        whyZh: "两句都对——第 48 课 if 家族的老邻居 when（天晴的时候）认读一句：条件句的老朋友。"
      }
    ],
    variants: [
      { label: "肯定", en: "I run every day, and I keep reading.", zh: "我每天跑步，也一直在读书。", noteZh: "and 把两条线接起来。" },
      { label: "否定", en: "I don't run every day, but I keep reading.", zh: "我不是每天跑，但一直在读书。", noteZh: "but 转个弯——否定前句、保后句。" },
      { label: "疑问", en: "Do you run or walk every day?", zh: "你每天是跑步还是走路？", noteZh: "or 两条路挑一条——老熟人 or（二选一）。" }
    ],
    sceneSwings: [
      { sceneZh: "说不是每天跑但一直在读", en: "I don't run every day, but I keep reading.", zh: "我不是每天跑，但一直在读书。" },
      { sceneZh: "问对方每天跑步还是走路", en: "Do you run or walk every day?", zh: "你每天是跑步还是走路？" },
      { sceneZh: "说天晴的时候在公园跑步", en: "When it is sunny, I run in the park.", zh: "天晴的时候，我在公园跑步。" }
    ],
    deepDive: {
      title: "跨季倒带：一天的线怎么接",
      paragraphs: [
        "这一课没有新知识——把你这一路学的几样东西串成一条线：说节奏（第 25/28 课的 every day、always）、说「更」（第 17 课 bigger than、第 76 课 much better）、说「一直做」（第 77 课 keep reading）。",
        "接线的词有三个：and（两条都算上）、but（转个弯）、or（二选一）。前面你都见过：and/but 是第 19 课的老伙计，or 今天正式登场一回。",
        "句子的顺序也有讲究：先说「每天做什么」（every day 收尾）、再接「一直做什么」（keep + 名字版）——先把日常摊开，再把坚持说出来。",
        "跨季倒带一路点过：L17 比较链、L25 每天、L28 频率位、L45 名字版、L64 收尾、L76 加力、L77 不停车——七季的东西，今天一句话全用上。"
      ]
    },
    summary: {
      rule: "把两件事串成一条线：and 接上、but 转弯、or 二选一——一天的故事就齐了。",
      points: [
        "I run every day, and I keep reading. —— 频率 + 不停车",
        "and / but / or —— 三条接线",
        "跨季七站：比较链、频率位、名字版、收尾、加力、不停车"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想把两件事接起来：我每天跑步，也一直在读书。",
        before: "I run every day,",
        after: "I keep reading.",
        options: ["and", "but", "or"],
        answer: "and",
        explain: "两条都算上：and 接上。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我每天跑步，也一直在读书。",
        tokens: ["I", "run", "every", "day,", "and", "I", "keep", "reading."],
        answer: "I run every day, and I keep reading.",
        explain: "频率 + 不停车，and 接成一条线。"
      },
      {
        // R8 跨课复现：第 28 课（频率位起点）
        kind: "arrange",
        promptZh: "先复习一小步——第 28 课学过：我总是早到。",
        tokens: ["I", "always", "arrive", "early."],
        answer: "I always arrive early.",
        explain: "复现第 28 课：频率位老规矩——今天说「每天」用 every day 收尾。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "finished", "read", "the", "book."],
        wrongToken: "read",
        answer: "read",
        correctionZh: "名字版通道：finish 后面收名字版——finished reading。",
        explain: "第 64 课老规矩。"
      },
      {
        // R8 跨课复现：第 45 课（名字版老站）
        kind: "arrange",
        promptZh: "再对照一句——第 45 课学过：我享受读书。",
        tokens: ["I", "enjoy", "reading."],
        answer: "I enjoy reading.",
        explain: "复现第 45 课：名字版通行证——今天 keep reading 是它第五站。"
      },
      {
        // R9 变形/替换：换接线词（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I run every day, and I keep reading.」想改成「不是每天跑，但一直在读」，接头要怎么换？",
        replaceBase: "I run every day, and I keep reading.",
        replaceTarget: "改成「不是每天跑，但一直在读」",
        options: ["don't run every day, but I keep", "run every day, or I keep", "not run every day, and keep"],
        answer: "don't run every day, but I keep",
        explain: "否定前句用 don't、转个弯用 but：I don't run every day, but I keep reading。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我每天跑步，也一直在读书。",
        tokens: ["I", "run", "every", "day,", "and", "I", "keep", "reading."],
        distractors: ["but"],
        answer: "I run every day, and I keep reading."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：你每天是跑步还是走路？",
        tokens: ["Do", "you", "run", "or", "walk", "every", "day?"],
        distractors: ["and"],
        answer: "Do you run or walk every day?"
      },
      {
        // R8 跨课复现：第 17 课原句
        promptZh: "复习第 17 课：这条船比那条大。",
        tokens: ["This", "boat", "is", "bigger", "than", "that", "one."],
        distractors: ["as"],
        answer: "This boat is bigger than that one."
      },
      {
        // 全批收官惯例：复现第 76 课原句
        promptZh: "全批收官——复习第 76 课：我今天好多了。",
        tokens: ["I", "feel", "much", "better", "today."],
        distractors: ["very"],
        answer: "I feel much better today."
      }
    ],
    recall: {
      promptZh: "傍晚的公园长椅，小美把一天做的事串成一条线讲给你听。凭记忆，写出你那句英文。",
      intentZh: "我每天跑步，也一直在读书。",
      answer: "I run every day, and I keep reading.",
      noteZh: "and 把两条线接起来：频率 + 不停车。"
    },
    huntCaseIds: ["hunt-full-day"]
  },

  // ── 第十三批 · L79 就在旁边（next to）：门牌家族新员——紧挨着，两个词一起住（批十三 PRD §2·大章节第一课）──
  {
    id: "lesson-79-next-to",
    number: 79,
    title: "就在旁边",
    grammarLabel: "位置词 · next to",
    episode: "小美的一天 七十九",
    scene: "mansion",
    cover: cover1,
    sceneSetupZh: "小美在书房收拾东西，比划着说书桌紧挨着窗户。",
    dialogueEn: "My desk is next to the window.",
    dialogueZh: "小美拍了拍书桌，朝窗户努了努嘴。",
    intentZh: "我的书桌紧挨着窗户。",
    targetSentence: "My desk is next to the window.",
    blocks: [
      { text: "My desk is", role: "我的书桌是" },
      { text: "next to", role: "紧挨着（两个词一起住）" },
      { text: "the window", role: "那扇窗户" }
    ],
    oneLineRule: "说「紧挨着」用 next to——两个词一起住（to 不能丢）；它和第 18 课的 in/on/at 是一家人，都是说位置的。",
    examples: [
      { en: "My desk is next to the window.", zh: "我的书桌紧挨着窗户。" },
      { en: "He sits next to me.", zh: "他坐在我旁边。" },
      { en: "The shop is next to the bank.", zh: "商店紧挨着银行。" },
      { en: "Is there a park near here?", zh: "这附近有公园吗？" }
    ],
    dialogue: [
      { who: "npc", en: "Your room looks nice!", zh: "小美站在书房门口看了看。" },
      { who: "npc", en: "Where is your desk?", zh: "她问你书桌在哪儿。" },
      { who: "me", en: "My desk is next to the window.", zh: "轮到你说了——我的书桌紧挨着窗户。" }
    ],
    contrast: [
      {
        wrong: "My desk is next the window.",
        wrongMark: "next",
        correct: "My desk is next to the window.",
        whyZh: "两个词一起住：next to——to 不能丢（漏 to 是头号坑）。"
      },
      {
        wrong: "My desk is next to window.",
        wrongMark: null,
        correct: "My desk is next to the window.",
        whyZh: "窗户是「那一扇」：要带上 the——next to the window。"
      },
      {
        wrong: "My hat is in the box.",
        wrongMark: null,
        correct: "My desk is next to the window.",
        bothRight: true,
        whyZh: "两句都对——第 18 课的老门牌（in the box）＋今天的新门牌（next to）：一家人。"
      },
      {
        wrong: "Is there a park near here?",
        wrongMark: null,
        correct: "My desk is next to the window.",
        bothRight: true,
        whyZh: "两句都对——第 26 课 near（不远）＋今天 next to（紧挨着）：差一层「贴不贴」。"
      },
      {
        wrong: "There is a cat under the chair.",
        wrongMark: null,
        correct: "My desk is next to the window.",
        bothRight: true,
        whyZh: "两句都对——第 26 课 under（在下面）复现：位置词越攒越多。"
      },
      {
        wrong: "She is at home.",
        wrongMark: null,
        correct: "My desk is next to the window.",
        bothRight: true,
        whyZh: "两句都对——第 18 课 at（在某个点）复现：位置词家族排排站。"
      }
    ],
    variants: [
      { label: "肯定", en: "My desk is next to the window.", zh: "我的书桌紧挨着窗户。", noteZh: "next to：两个词一起住。" },
      { label: "否定", en: "My desk is not next to the window.", zh: "我的书桌不挨着窗户。", noteZh: "not 跟 is 走。" },
      { label: "疑问", en: "Is your desk next to the window?", zh: "你的书桌挨着窗户吗？", noteZh: "Is 搬句首——问对方的位置。" }
    ],
    sceneSwings: [
      { sceneZh: "说他坐在我旁边", en: "He sits next to me.", zh: "他坐在我旁边。" },
      { sceneZh: "说商店紧挨着银行", en: "The shop is next to the bank.", zh: "商店紧挨着银行。" },
      { sceneZh: "问对方书桌挨不挨着窗户", en: "Is your desk next to the window?", zh: "你的书桌挨着窗户吗？" }
    ],
    deepDive: {
      title: "位置词家族：从 in/on/at 到 next to",
      paragraphs: [
        "第 18 课你学过三块老门牌：in（在里面）、on（在上面）、at（在某个点）。今天家族来了新成员：next to（紧挨着）——它是「贴边站」的那一位。",
        "next to 是「两个词一起住」：next + to，to 不能丢。中文说「在窗户旁边」，英语说 next to the window——中间那个 to 就是「朝向」，少了它句子就缺一块。",
        "和 near 比一比：near 是「不远」（可能还隔条街），next to 是「紧挨着」（贴在一起）——差一层「贴不贴」。",
        "location 家族越攒越多：in／on／at（第 18 课）＋under／near（第 26 课）＋今天的 next to——一样一样往里加，你的「东西在哪」就说得越来越准。"
      ]
    },
    summary: {
      rule: "说「紧挨着」用 next to——两个词一起住；它和 in/on/at 一样，都是说位置的。",
      points: [
        "My desk is next to the window. —— 新门牌上岗",
        "next to（紧挨着）／ near（不远）—— 差一层「贴不贴」",
        "in／on／at／under／near／next to —— 位置词家族"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我的书桌紧挨着窗户。",
        before: "My desk is",
        after: "the window.",
        options: ["next to", "next", "near to"],
        answer: "next to",
        explain: "两个词一起住：next to。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我的书桌紧挨着窗户。",
        tokens: ["My", "desk", "is", "next", "to", "the", "window."],
        answer: "My desk is next to the window.",
        explain: "next to 两个词：to 不能丢。"
      },
      {
        // R8 跨课复现：第 18 课（老门牌）
        kind: "arrange",
        promptZh: "先复习一小步——第 18 课学过：我的帽子在盒子里。",
        tokens: ["My", "hat", "is", "in", "the", "box."],
        answer: "My hat is in the box.",
        explain: "复现第 18 课：老门牌 in——今天家族来新人。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["My", "desk", "is", "next", "the", "window."],
        wrongToken: "next",
        answer: "next",
        correctionZh: "两个词一起住：next 【to】the window。",
        explain: "to 不能丢。"
      },
      {
        // R8 跨课复现：第 26 课（under）
        kind: "arrange",
        promptZh: "再对照一句——第 26 课学过：椅子下面有一只猫。",
        tokens: ["There", "is", "a", "cat", "under", "the", "chair."],
        answer: "There is a cat under the chair.",
        explain: "复现第 26 课：under（在下面）——位置词家族排排站。"
      },
      {
        // R9 变形/替换：换位置（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「My desk is next to the window.」把「书桌」换成「他坐的地方」（他坐在我旁边），位置词那截要怎么变？",
        replaceBase: "My desk is next to the window.",
        replaceTarget: "换成「他坐在我旁边」",
        options: ["He sits next to me.", "He sits next me.", "He next to sits me."],
        answer: "He sits next to me.",
        explain: "动作句照样用 next to：He sits next to me——to 不丢。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我的书桌紧挨着窗户。",
        tokens: ["My", "desk", "is", "next", "to", "the", "window."],
        distractors: ["near"],
        answer: "My desk is next to the window."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：你的书桌挨着窗户吗？",
        tokens: ["Is", "your", "desk", "next", "to", "the", "window?"],
        distractors: ["Does"],
        answer: "Is your desk next to the window?"
      },
      {
        // 保障句（cloze 落 sits）
        promptZh: "你想说：他坐在我旁边。",
        tokens: ["He", "sits", "next", "to", "me."],
        distractors: ["sit"],
        answer: "He sits next to me."
      },
      {
        // R8 跨课复现：第 26 课原句
        promptZh: "复习第 26 课：椅子下面有一只猫。",
        tokens: ["There", "is", "a", "cat", "under", "the", "chair."],
        distractors: ["on"],
        answer: "There is a cat under the chair."
      }
    ],
    recall: {
      promptZh: "小美站在书房门口，问你书桌在哪儿。凭记忆，写出你那句英文。",
      intentZh: "我的书桌紧挨着窗户。",
      answer: "My desk is next to the window.",
      noteZh: "next to：两个词一起住——to 不能丢。"
    },
    huntCaseIds: ["hunt-desk-map"]
  },

  // ── 第十三批 · L80 前面、后面（in front of / behind）：前后一对——脸朝哪边、背朝哪边（批十三 PRD §2）──
  {
    id: "lesson-80-front-behind",
    number: 80,
    title: "前面、后面",
    grammarLabel: "位置词 · in front of / behind",
    episode: "小美的一天 八十",
    scene: "mansion",
    cover: cover2,
    sceneSetupZh: "小美到处找猫，最后发现猫蹲在门后头。",
    dialogueEn: "The cat is behind the door.",
    dialogueZh: "小美朝门后努了努嘴，小声说。",
    intentZh: "猫在门后头。",
    targetSentence: "The cat is behind the door.",
    blocks: [
      { text: "The cat is", role: "那只猫是" },
      { text: "behind", role: "在后面（背朝那边）" },
      { text: "the door", role: "那扇门" }
    ],
    oneLineRule: "说「在前面」用 in front of、「在后面」用 behind——一对好搭档：一个脸朝那边，一个背朝那边。",
    examples: [
      { en: "The cat is behind the door.", zh: "猫在门后头。" },
      { en: "The school is in front of the park.", zh: "学校在公园前面。" },
      { en: "He sits in front of me.", zh: "他坐在我前面。" },
      { en: "The ball is behind the box.", zh: "球在盒子后面。" }
    ],
    dialogue: [
      { who: "npc", en: "Where is the cat?", zh: "小美到处找，问你猫在哪儿。" },
      { who: "npc", en: "I cannot find it!", zh: "她有点着急。" },
      { who: "me", en: "The cat is behind the door.", zh: "轮到你说了——猫在门后头。" }
    ],
    contrast: [
      {
        wrong: "The ball is in front the door.",
        wrongMark: null,
        correct: "The ball is in front of the door.",
        whyZh: "前面那一位是三个词一起住：in front of——of 不能丢。"
      },
      {
        wrong: "The cat is behind of the door.",
        wrongMark: "of",
        correct: "The cat is behind the door.",
        whyZh: "后面那一位只住一个词：behind——它不带 of（跟 in front of 分工不同）。"
      },
      {
        wrong: "The school is in front of the park.",
        wrongMark: null,
        correct: "The cat is behind the door.",
        bothRight: true,
        whyZh: "两句都对——一个脸朝（in front of）、一个背朝（behind）：前后配对出场。"
      },
      {
        wrong: "My desk is next to the window.",
        wrongMark: null,
        correct: "The cat is behind the door.",
        bothRight: true,
        whyZh: "两句都对——第 79 课 next to（紧挨着）＋今天 behind（在后面）：位置词排排站。"
      },
      {
        wrong: "There is a cat under the chair.",
        wrongMark: null,
        correct: "The cat is behind the door.",
        bothRight: true,
        whyZh: "两句都对——第 26 课 under（在下面）复现：猫的老位置又出现了。"
      },
      {
        wrong: "She is at home.",
        wrongMark: null,
        correct: "The cat is behind the door.",
        bothRight: true,
        whyZh: "两句都对——第 18 课 at（在某个点）复现：位置词家族又添两位。"
      }
    ],
    variants: [
      { label: "肯定", en: "The cat is behind the door.", zh: "猫在门后头。", noteZh: "behind 一个人住——不带 of。" },
      { label: "否定", en: "The cat is not behind the door.", zh: "猫不在门后头。", noteZh: "not 跟 is 走。" },
      { label: "疑问", en: "Where is the cat?", zh: "猫在哪儿？", noteZh: "问地方——Where 老熟人（第 27 课）。" }
    ],
    sceneSwings: [
      { sceneZh: "说学校在公园前面", en: "The school is in front of the park.", zh: "学校在公园前面。" },
      { sceneZh: "说他坐在我前面", en: "He sits in front of me.", zh: "他坐在我前面。" },
      { sceneZh: "问猫在哪儿", en: "Where is the cat?", zh: "猫在哪儿？" }
    ],
    deepDive: {
      title: "前后配对：谁带 of、谁不带",
      paragraphs: [
        "今天认识一对好搭档：in front of（在前面）和 behind（在后面）。一个脸朝那边、一个背朝那边——说位置时一对一对地用，画面就清楚了。",
        "两位住的房间不一样：in front of 是三个词一起住（in + front + of），of 不能丢；behind 只住一个词，别给它加 of。中文都是「前/后」，英语这两位一个带 of、一个不带——记住这一对。",
        "跟第 79 课的 next to 连起来看：next to（贴旁边）、in front of（在前面）、behind（在后面）——你的「东西在哪」越来越立体了。",
        "还有第 26 课的老朋友 under（在下面）、near（不远）——位置词家族现在有六位：in／on／at／under／near／next to／in front of／behind。"
      ]
    },
    summary: {
      rule: "前面 in front of（三个词一起住、of 不丢）；后面 behind（一个词、不带 of）。",
      points: [
        "The cat is behind the door. —— 背朝那边",
        "The school is in front of the park. —— 脸朝那边",
        "in front of 带 of ／ behind 不带 —— 一对好搭档"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：猫在门后头。",
        before: "The cat is",
        after: "the door.",
        options: ["behind", "behind of", "in front of"],
        answer: "behind",
        explain: "后面那一位只住一个词：behind。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：猫在门后头。",
        tokens: ["The", "cat", "is", "behind", "the", "door."],
        answer: "The cat is behind the door.",
        explain: "behind 一个人住——不带 of。"
      },
      {
        // R8 跨课复现：第 79 课（位置词新员）
        kind: "arrange",
        promptZh: "先复习一小步——第 79 课学过：我的书桌紧挨着窗户。",
        tokens: ["My", "desk", "is", "next", "to", "the", "window."],
        answer: "My desk is next to the window.",
        explain: "复现第 79 课：next to——今天再来一对前后。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["The", "cat", "is", "behind", "of", "the", "door."],
        wrongToken: "of",
        answer: "of",
        correctionZh: "后面那一位不带 of：behind the door。",
        explain: "of 是多出来的——去掉它。"
      },
      {
        // R8 跨课复现：第 26 课（under）
        kind: "arrange",
        promptZh: "再对照一句——第 26 课学过：椅子下面有一只猫。",
        tokens: ["There", "is", "a", "cat", "under", "the", "chair."],
        answer: "There is a cat under the chair.",
        explain: "复现第 26 课：under（在下面）——位置词家族越排越长。"
      },
      {
        // R9 变形/替换：换成一对面（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「The cat is behind the door.」把「门后」换成「学校前面」，位置那截要怎么换？",
        replaceBase: "The cat is behind the door.",
        replaceTarget: "换成「学校在前面（公园）」（The school is ___ the park.）",
        options: ["in front of", "in front", "front of"],
        answer: "in front of",
        explain: "前面那一位三个词一起住：in front of the park——of 不丢。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：猫在门后头。",
        tokens: ["The", "cat", "is", "behind", "the", "door."],
        distractors: ["of"],
        answer: "The cat is behind the door."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：猫在哪儿？",
        tokens: ["Where", "is", "the", "cat?"],
        distractors: ["What"],
        answer: "Where is the cat?"
      },
      {
        promptZh: "你想说：学校在公园前面。",
        tokens: ["The", "school", "is", "in", "front", "of", "the", "park."],
        distractors: ["behind"],
        answer: "The school is in front of the park."
      },
      {
        // R8 跨课复现：第 26 课原句
        promptZh: "复习第 26 课：椅子下面有一只猫。",
        tokens: ["There", "is", "a", "cat", "under", "the", "chair."],
        distractors: ["on"],
        answer: "There is a cat under the chair."
      }
    ],
    recall: {
      promptZh: "小美到处找猫，最后发现猫蹲在门后头。凭记忆，写出你那句英文。",
      intentZh: "猫在门后头。",
      answer: "The cat is behind the door.",
      noteZh: "behind 一个人住——不带 of。"
    },
    huntCaseIds: ["hunt-cat-hiding"]
  },

  // ── 第十三批 · L81 夹在中间（between A and B）：两头都要点名——中间用 and 牵起来（批十三 PRD §2）──
  {
    id: "lesson-81-between",
    number: 81,
    title: "夹在中间",
    grammarLabel: "位置词 · between A and B",
    episode: "小美的一天 八十一",
    scene: "campus",
    cover: cover3,
    sceneSetupZh: "教室换座位，小美看了看新座位表，说自己坐在汤姆和艾米中间。",
    dialogueEn: "I sit between Tom and Amy.",
    dialogueZh: "小美指着座位表上自己的名字。",
    intentZh: "我坐在汤姆和艾米中间。",
    targetSentence: "I sit between Tom and Amy.",
    blocks: [
      { text: "I sit", role: "我坐" },
      { text: "between", role: "在中间（两头都要点名）" },
      { text: "Tom and Amy", role: "汤姆和艾米（用 and 牵起来）" }
    ],
    oneLineRule: "说「在中间」用 between——两头都要点名，中间用 and 牵起来（between Tom and Amy）。",
    examples: [
      { en: "I sit between Tom and Amy.", zh: "我坐在汤姆和艾米中间。" },
      { en: "The shop is between the bank and the park.", zh: "商店在银行和公园中间。" },
      { en: "The ball is between the two boxes.", zh: "球在两个盒子中间。" },
      { en: "I was busy and happy.", zh: "我又忙又开心。" }
    ],
    dialogue: [
      { who: "npc", en: "We have new seats!", zh: "小美看着座位表。" },
      { who: "npc", en: "Who is next to you?", zh: "她问你旁边是谁。" },
      { who: "me", en: "I sit between Tom and Amy.", zh: "轮到你说了——我坐汤姆和艾米中间。" }
    ],
    contrast: [
      {
        wrong: "I sit between Tom to Amy.",
        wrongMark: "to",
        correct: "I sit between Tom and Amy.",
        whyZh: "两头用 and 牵起来：between Tom 【and】Amy——「从…到…」的 to 在这儿上不了岗。"
      },
      {
        wrong: "I sit between Tom.",
        wrongMark: null,
        correct: "I sit between Tom and Amy.",
        whyZh: "两头都要点名：给了这头、还要给那头——话要说完。"
      },
      {
        wrong: "I was busy and happy.",
        wrongMark: null,
        correct: "I sit between Tom and Amy.",
        bothRight: true,
        whyZh: "两句都对——第 19 课 and（连接两样）＋今天 and（牵两头）：一个词两班岗。"
      },
      {
        wrong: "My desk is next to the window.",
        wrongMark: null,
        correct: "I sit between Tom and Amy.",
        bothRight: true,
        whyZh: "两句都对——第 79 课 next to（贴旁边）＋今天 between（夹中间）：位置词排排站。"
      },
      {
        wrong: "The cat is behind the door.",
        wrongMark: null,
        correct: "I sit between Tom and Amy.",
        bothRight: true,
        whyZh: "两句都对——第 80 课 behind（在后面）复现：前后左右中间，方位都齐了。"
      },
      {
        wrong: "There are three apples on the table.",
        wrongMark: null,
        correct: "I sit between Tom and Amy.",
        bothRight: true,
        whyZh: "两句都对——第 26 课 on（在上面）复现：位置词家族大点兵。"
      }
    ],
    variants: [
      { label: "肯定", en: "I sit between Tom and Amy.", zh: "我坐在汤姆和艾米中间。", noteZh: "两头点名、and 牵手。" },
      { label: "否定", en: "I don't sit between Tom and Amy.", zh: "我不坐汤姆和艾米中间。", noteZh: "don't 帮忙，between 那截不动。" },
      { label: "疑问", en: "Who sits between Tom and Amy?", zh: "谁坐汤姆和艾米中间？", noteZh: "谁坐中间——Who 老熟人（第 27 课）。" }
    ],
    sceneSwings: [
      { sceneZh: "说商店在银行和公园中间", en: "The shop is between the bank and the park.", zh: "商店在银行和公园中间。" },
      { sceneZh: "说球在两个盒子中间", en: "The ball is between the two boxes.", zh: "球在两个盒子中间。" },
      { sceneZh: "问谁坐中间", en: "Who sits between Tom and Amy?", zh: "谁坐汤姆和艾米中间？" }
    ],
    deepDive: {
      title: "两头都要点名",
      paragraphs: [
        "between 是「夹在中间」的位置词，它的规矩是「两头都要点名」：between Tom and Amy——左边一个、右边一个，缺一头句子就没说完。",
        "两头的名字用 and 牵起来——and 是第 19 课的老熟人（I was busy and happy），今天它多了个班岗：连接位置的两头。",
        "中文的「从…到…」里有个「到」，翻英语时容易顺手写成 to——between Tom to Amy 就错了。记住：between 家族只认 and。",
        "方位词家族现在已经很能打了：in／on／at（第 18 课）、under／near（第 26 课）、next to（第 79 课）、in front of／behind（第 80 课）、between（今天）——你的「东西在哪」可以说得非常细了。"
      ]
    },
    summary: {
      rule: "说「在中间」用 between——两头都要点名，中间用 and 牵起来。",
      points: [
        "I sit between Tom and Amy. —— 两头点名",
        "between A and B —— and 牵手（不用 to）",
        "next to ／ in front of ／ behind ／ between —— 方位四件套"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我坐在汤姆和艾米中间。",
        before: "I sit between Tom",
        after: "Amy.",
        options: ["and", "to", "with"],
        answer: "and",
        explain: "两头用 and 牵起来：between Tom and Amy。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我坐在汤姆和艾米中间。",
        tokens: ["I", "sit", "between", "Tom", "and", "Amy."],
        answer: "I sit between Tom and Amy.",
        explain: "两头点名、and 牵手。"
      },
      {
        // R8 跨课复现：第 80 课（前后一对）
        kind: "arrange",
        promptZh: "先复习一小步——第 80 课学过：猫在门后头。",
        tokens: ["The", "cat", "is", "behind", "the", "door."],
        answer: "The cat is behind the door.",
        explain: "复现第 80 课：behind（在后面）——今天学夹中间。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "sit", "between", "Tom", "to", "Amy."],
        wrongToken: "to",
        answer: "to",
        correctionZh: "两头用 and 牵：between Tom and Amy。",
        explain: "「从…到…」的 to 在这儿上不了岗。"
      },
      {
        // R8 跨课复现：第 19 课（and 老熟人）
        kind: "arrange",
        promptZh: "再对照一句——第 19 课学过：我又忙又开心。",
        tokens: ["I", "was", "busy", "and", "happy."],
        answer: "I was busy and happy.",
        explain: "复现第 19 课：and 连接两样——今天用它牵两头。"
      },
      {
        // R9 变形/替换：换两头（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I sit between Tom and Amy.」把中间那截换成「银行和公园」（说商店在它们中间），要怎么换？",
        replaceBase: "I sit between Tom and Amy.",
        replaceTarget: "换成「商店在银行和公园中间」（The shop is between ___ ___）",
        options: ["the bank and the park", "the bank to the park", "bank and park"],
        answer: "the bank and the park",
        explain: "两头都要点名、带上 the：between the bank and the park。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我坐在汤姆和艾米中间。",
        tokens: ["I", "sit", "between", "Tom", "and", "Amy."],
        distractors: ["to"],
        answer: "I sit between Tom and Amy."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：谁坐汤姆和艾米中间？",
        tokens: ["Who", "sits", "between", "Tom", "and", "Amy?"],
        distractors: ["sit"],
        answer: "Who sits between Tom and Amy?"
      },
      {
        promptZh: "你想说：商店在银行和公园中间。",
        tokens: ["The", "shop", "is", "between", "the", "bank", "and", "the", "park."],
        distractors: ["to"],
        answer: "The shop is between the bank and the park."
      },
      {
        // R8 跨课复现：第 19 课原句
        promptZh: "复习第 19 课：我又忙又开心。",
        tokens: ["I", "was", "busy", "and", "happy."],
        distractors: ["but"],
        answer: "I was busy and happy."
      }
    ],
    recall: {
      promptZh: "教室换座位，小美指着座位表上自己的名字。凭记忆，写出她那句英文。",
      intentZh: "我坐在汤姆和艾米中间。",
      answer: "I sit between Tom and Amy.",
      noteZh: "两头点名、and 牵手——不用 to。"
    },
    huntCaseIds: ["hunt-seat-plan"]
  },

  // ── 第十三批 · L82 把它放那儿（put · 三态同形）：放，三天长一个样（批十三 PRD §2）──
  {
    id: "lesson-82-put",
    number: 82,
    title: "把它放那儿",
    grammarLabel: "放 · put（三态同形）",
    episode: "小美的一天 八十二",
    scene: "mansion",
    cover: cover4,
    sceneSetupZh: "小美放学进门，把书包往门边一放，说就放这儿。",
    dialogueEn: "I put my bag next to the door.",
    dialogueZh: "小美把书包往门边一放。",
    intentZh: "我把书包放在门边。",
    targetSentence: "I put my bag next to the door.",
    blocks: [
      { text: "I put", role: "我放（三天长一个样）" },
      { text: "my bag", role: "我的书包" },
      { text: "next to the door", role: "在门边（位置收尾）" }
    ],
    oneLineRule: "说「放」用 put——它三天长一个样：今天 put、昨天 put、明天还是 put（不加 -ed）。",
    examples: [
      { en: "I put my bag next to the door.", zh: "我把书包放在门边。" },
      { en: "I put my bag on the desk.", zh: "我把书包放在桌上。" },
      { en: "Put the book in the box.", zh: "把书放进盒子里。" },
      { en: "I went to school yesterday.", zh: "我昨天去学校了。" }
    ],
    dialogue: [
      { who: "npc", en: "Where is your bag?", zh: "妈妈看你两手空空。" },
      { who: "npc", en: "Your desk is next to the window.", zh: "她指了指书房。" },
      { who: "me", en: "I put my bag next to the door.", zh: "轮到你说了——我把书包放在门边。" }
    ],
    contrast: [
      {
        wrong: "I putted my bag next to the door.",
        wrongMark: "putted",
        correct: "I put my bag next to the door.",
        whyZh: "put 三天长一个样：不加 -ed——跟 go→went 那种老实词不同路。"
      },
      {
        wrong: "I put my bag next the door.",
        wrongMark: "next",
        correct: "I put my bag next to the door.",
        whyZh: "第 79 课的老规矩：next to 两个词一起住——to 不能丢。"
      },
      {
        wrong: "I went to school yesterday.",
        wrongMark: null,
        correct: "I put my bag next to the door.",
        bothRight: true,
        whyZh: "两句都对——第 10 课 went（昨天版）＋今天 put（三天一个样）：一个换装、一个不换。"
      },
      {
        wrong: "Close the door.",
        wrongMark: null,
        correct: "I put my bag next to the door.",
        bothRight: true,
        whyZh: "两句都对——第 32 课祈使句（动词开头、省主语）＋今天 put 出台：都是动作句。"
      },
      {
        wrong: "My desk is next to the window.",
        wrongMark: null,
        correct: "I put my bag next to the door.",
        bothRight: true,
        whyZh: "两句都对——第 79 课 next to（贴旁边）＋今天 put（放到那儿）：位置词前后都是老熟人。"
      },
      {
        wrong: "The cat is behind the door.",
        wrongMark: null,
        correct: "I put my bag next to the door.",
        bothRight: true,
        whyZh: "两句都对——第 80 课 behind（在后面）复现：说位置的两条路都熟了。"
      }
    ],
    variants: [
      { label: "肯定", en: "I put my bag next to the door.", zh: "我把书包放在门边。", noteZh: "put 三天一个样。" },
      { label: "否定", en: "I don't put my bag on the desk.", zh: "我不把书包放桌上。", noteZh: "don't 帮忙，put 照样原样。" },
      { label: "疑问", en: "Where do you put your bag?", zh: "你把书包放哪儿？", noteZh: "问你放哪儿——do 帮忙（第 27 课的老规矩）。" }
    ],
    sceneSwings: [
      { sceneZh: "说把书包放在桌上", en: "I put my bag on the desk.", zh: "我把书包放在桌上。" },
      { sceneZh: "说把书放进盒子里（祈使）", en: "Put the book in the box.", zh: "把书放进盒子里。" },
      { sceneZh: "问对方把书包放哪儿", en: "Where do you put your bag?", zh: "你把书包放哪儿？" }
    ],
    deepDive: {
      title: "put：三天长一个样",
      paragraphs: [
        "第 10 课你学过「昨天版」：go→went、eat→ate、see→saw。今天这位新朋友不一样：put 昨天不改装——今天 put、昨天 put、明天还是 put。",
        "英语里有一小撮这样的「实在词」：形状从头到尾不变，放进任何时间的句子里都认识。put 是最常用的一个——放书包、放杯子、放钥匙，天天用。",
        "怎么用？「把什么放到哪里」：put + 东西 + 位置——I put my bag next to the door（书包放到门边）。位置那截用第 79-81 课学的词收尾。",
        "跟祈使句连起来也好用：Put the book in the box（把书放进盒子里）——动词开头、省主语，第 32 课的老规矩。让别人「放一下」，一句话就够。"
      ]
    },
    summary: {
      rule: "说「放」用 put——三天长一个样（不加 -ed）：put + 东西 + 位置。",
      points: [
        "I put my bag next to the door. —— 放 + 位置",
        "putted ❌ —— 它不穿昨天的外套",
        "Put the book in the box. —— 让别人放也一句搞定"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我把书包放在门边。",
        before: "I",
        after: "my bag next to the door.",
        options: ["put", "putted", "puts"],
        answer: "put",
        explain: "put 三天长一个样：不加 -ed。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我把书包放在门边。",
        tokens: ["I", "put", "my", "bag", "next", "to", "the", "door."],
        answer: "I put my bag next to the door.",
        explain: "put + 东西 + 位置：一句话说完放哪。"
      },
      {
        // R8 跨课复现：第 79 课（位置收尾词）
        kind: "arrange",
        promptZh: "先复习一小步——第 79 课学过：我的书桌紧挨着窗户。",
        tokens: ["My", "desk", "is", "next", "to", "the", "window."],
        answer: "My desk is next to the window.",
        explain: "复现第 79 课：位置词学会了——今天给它配个动作。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "putted", "my", "bag", "on", "the", "desk."],
        wrongToken: "putted",
        answer: "putted",
        correctionZh: "put 三天长一个样：I put my bag on the desk。",
        explain: "它不穿昨天的外套。"
      },
      {
        // R8 跨课复现：第 10 课（昨天版老规矩）
        kind: "arrange",
        promptZh: "再对照一句——第 10 课学过：我昨天去公园了。",
        tokens: ["Yesterday", "I", "went", "to", "the", "park."],
        answer: "Yesterday I went to the park.",
        explain: "复现第 10 课：went（昨天版换装）——put 偏偏不换。"
      },
      {
        // R9 变形/替换：换位置（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I put my bag next to the door.」把「门边」换成「桌上」，位置那截要怎么换？",
        replaceBase: "I put my bag next to the door.",
        replaceTarget: "把 next to the door 换成「桌上」",
        options: ["on the desk", "in the desk", "at the desk"],
        answer: "on the desk",
        explain: "桌面是「表面」：on the desk——第 18 课的老门牌。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我把书包放在门边。",
        tokens: ["I", "put", "my", "bag", "next", "to", "the", "door."],
        distractors: ["putted"],
        answer: "I put my bag next to the door."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：你把书包放哪儿？",
        tokens: ["Where", "do", "you", "put", "your", "bag?"],
        distractors: ["Does"],
        answer: "Where do you put your bag?"
      },
      {
        promptZh: "你想说：我把书包放在桌上。",
        tokens: ["I", "put", "my", "bag", "on", "the", "desk."],
        distractors: ["putted"],
        answer: "I put my bag on the desk."
      },
      {
        // R8 跨课复现：第 32 课原句
        promptZh: "复习第 32 课：把门关上。",
        tokens: ["Close", "the", "door."],
        distractors: ["You"],
        answer: "Close the door."
      }
    ],
    recall: {
      promptZh: "小美放学进门，把书包往门边一放。凭记忆，写出她那句英文。",
      intentZh: "我把书包放在门边。",
      answer: "I put my bag next to the door.",
      noteZh: "put 三天一个样——不加 -ed。"
    },
    huntCaseIds: ["hunt-pack-bag"]
  },

  // ── 第十三批 · L83 有个东西（something / anything）：L30 some/any 老规矩的东西版（批十三 PRD §2）──
  {
    id: "lesson-83-something",
    number: 83,
    title: "有个东西",
    grammarLabel: "不点名的东西 · something / anything",
    episode: "小美的一天 八十三",
    scene: "mansion",
    cover: cover5,
    sceneSetupZh: "小美手里攥着东西背在身后，说有样东西要给你。",
    dialogueEn: "I have something for you.",
    dialogueZh: "小美笑着把手背到身后。",
    intentZh: "我有样东西给你。",
    targetSentence: "I have something for you.",
    blocks: [
      { text: "I have", role: "我有" },
      { text: "something", role: "一样东西（先不说是什么）" },
      { text: "for you", role: "给你的" }
    ],
    oneLineRule: "说不清或者先不说是什么，用 something；疑问和否定里换成 anything——第 30 课 some/any 的老规矩。",
    examples: [
      { en: "I have something for you.", zh: "我有样东西给你。" },
      { en: "I don't have anything for you.", zh: "我没有东西带给你。" },
      { en: "Do you have anything for me?", zh: "你有东西给我吗？" },
      { en: "I want something to drink.", zh: "我想喝点什么。" }
    ],
    dialogue: [
      { who: "npc", en: "You look happy today!", zh: "小美笑着把手背到身后。" },
      { who: "npc", en: "What is in your hand?", zh: "她问：你手里拿着什么？" },
      { who: "me", en: "I have something for you.", zh: "轮到你说了——我有样东西给你。" }
    ],
    contrast: [
      {
        wrong: "I don't have something for you.",
        wrongMark: "something",
        correct: "I don't have anything for you.",
        whyZh: "否定句里换 anything：don't have anything——第 30 课 some/any 的老规矩。"
      },
      {
        wrong: "Do you have something for me?",
        wrongMark: "something",
        correct: "Do you have anything for me?",
        whyZh: "疑问句里也换 anything：Do you have anything——同一个规矩（肯定用 some 侧、疑问否定用 any 侧）。"
      },
      {
        wrong: "There are some apples on the table.",
        wrongMark: null,
        correct: "I have something for you.",
        bothRight: true,
        whyZh: "两句都对——第 30 课 some（一些）＋今天 something（一样东西）：老规矩穿新衣服。"
      },
      {
        wrong: "I don't have any candy.",
        wrongMark: null,
        correct: "I have something for you.",
        bothRight: true,
        whyZh: "两句都对——第 30 课的 any（否定侧）＋今天 something 的肯定侧：一对。"
      },
      {
        wrong: "My desk is next to the window.",
        wrongMark: null,
        correct: "I have something for you.",
        bothRight: true,
        whyZh: "两句都对——第 79 课位置词复现：这一季的句子都能串起来听。"
      },
      {
        wrong: "I put my bag next to the door.",
        wrongMark: null,
        correct: "I have something for you.",
        bothRight: true,
        whyZh: "两句都对——第 82 课 put（放）复现：东西放好了，现在说「有样东西给你」。"
      }
    ],
    variants: [
      { label: "肯定", en: "I have something for you.", zh: "我有样东西给你。", noteZh: "肯定用 something。" },
      { label: "否定", en: "I don't have anything for you.", zh: "我没有东西带给你。", noteZh: "否定换 anything。" },
      { label: "疑问", en: "Do you have anything for me?", zh: "你有东西给我吗？", noteZh: "疑问也换 anything。" }
    ],
    sceneSwings: [
      { sceneZh: "说想喝点什么", en: "I want something to drink.", zh: "我想喝点什么。" },
      { sceneZh: "说没东西带给你", en: "I don't have anything for you.", zh: "我没有东西带给你。" },
      { sceneZh: "问对方有没有东西给我", en: "Do you have anything for me?", zh: "你有东西给我吗？" }
    ],
    deepDive: {
      title: "some/any 的东西版",
      paragraphs: [
        "第 30 课你学过「一些」的规矩：肯定句用 some、疑问和否定换 any。今天认识它们的「东西版」：something（某样东西）、anything（任何东西）——规矩一模一样。",
        "什么时候用？想说「有个东西」，但先不说是什么（或者说不清）：I have something for you——手里攥着、话先留一半，这就是 something 的舞台。",
        "三个搭配顺手记：something to drink（喝点什么）、something to eat（吃点什么）、something for you（给你的东西）——后面跟 to + 动作，或者 for + 人。",
        "疑问否定换 anything 是反射动作：Do you have anything for me?（有东西给我吗）／I don't have anything（什么都没有）——注意「疑问本身就换」，不用等否定。"
      ]
    },
    summary: {
      rule: "说不清的「一个东西」用 something；疑问和否定换 anything——第 30 课 some/any 的老规矩。",
      points: [
        "I have something for you. —— 肯定侧",
        "Do you have anything for me? —— 疑问侧换 anything",
        "something to drink —— 想喝点什么"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我有样东西给你。",
        before: "I have",
        after: "for you.",
        options: ["something", "anything", "some thing"],
        answer: "something",
        explain: "肯定句用 something：有样东西（先不说是什么）。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我有样东西给你。",
        tokens: ["I", "have", "something", "for", "you."],
        answer: "I have something for you.",
        explain: "something + for you：东西给你。"
      },
      {
        // R8 跨课复现：第 30 课（老规矩源头）
        kind: "arrange",
        promptZh: "先复习一小步——第 30 课学过：桌上有一些苹果。",
        tokens: ["There", "are", "some", "apples", "on", "the", "table."],
        answer: "There are some apples on the table.",
        explain: "复现第 30 课：肯定用 some——今天认识它的「东西版」。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "don't", "have", "something", "for", "you."],
        wrongToken: "something",
        answer: "something",
        correctionZh: "否定句里换 anything：don't have anything。",
        explain: "第 30 课的老规矩。"
      },
      {
        // R8 跨课复现：第 30 课否定侧
        kind: "arrange",
        promptZh: "再对照一句——第 30 课学过：我没有糖。",
        tokens: ["I", "don't", "have", "any", "candy."],
        answer: "I don't have any candy.",
        explain: "复现第 30 课：否定用 any——今天 anything 同款。"
      },
      {
        // R9 变形/替换：换东西（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I have something for you.」把「给你的东西」换成「喝点什么」，后半截要怎么换？",
        replaceBase: "I have something for you.",
        replaceTarget: "把 for you 换成「喝点什么」",
        options: ["to drink", "drink", "for drink"],
        answer: "to drink",
        explain: "想喝点什么：something to drink——to + 动作收尾。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我有样东西给你。",
        tokens: ["I", "have", "something", "for", "you."],
        distractors: ["anything"],
        answer: "I have something for you."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：你有东西给我吗？",
        tokens: ["Do", "you", "have", "anything", "for", "me?"],
        distractors: ["something"],
        answer: "Do you have anything for me?"
      },
      {
        promptZh: "你想说：我想喝点什么。",
        tokens: ["I", "want", "something", "to", "drink."],
        distractors: ["anything"],
        answer: "I want something to drink."
      },
      {
        // R8 跨课复现：第 30 课原句
        promptZh: "复习第 30 课：我没有糖。",
        tokens: ["I", "don't", "have", "any", "candy."],
        distractors: ["some"],
        answer: "I don't have any candy."
      }
    ],
    recall: {
      promptZh: "小美笑着把手背到身后，你问她手里有什么。凭记忆，写出你那句英文。",
      intentZh: "我有样东西给你。",
      answer: "I have something for you.",
      noteZh: "肯定用 something——先不说是什么。"
    },
    huntCaseIds: ["hunt-gift-box"]
  },

  // ── 第十三批 · L84 什么都没有（nothing / someone）：啥也没有——它自带「不」（批十三 PRD §2）──
  {
    id: "lesson-84-nothing",
    number: 84,
    title: "什么都没有",
    grammarLabel: "不点名的东西 · nothing / someone",
    episode: "小美的一天 八十四",
    scene: "mansion",
    cover: cover6,
    sceneSetupZh: "小美打开一个旧盒子，里面空空的，什么也没有。",
    dialogueEn: "There is nothing in the box.",
    dialogueZh: "小美把盒子倒过来抖了抖。",
    intentZh: "盒子里什么也没有。",
    targetSentence: "There is nothing in the box.",
    blocks: [
      { text: "There is", role: "有（存在先占位）" },
      { text: "nothing", role: "什么也没有（自带「不」）" },
      { text: "in the box", role: "在盒子里" }
    ],
    oneLineRule: "说「什么也没有」用 nothing——它自带「不」，句子里不再请 not；someone 是「有人」，一个人配 is。",
    examples: [
      { en: "There is nothing in the box.", zh: "盒子里什么也没有。" },
      { en: "I have nothing.", zh: "我什么都没有。" },
      { en: "Someone is at the door.", zh: "有人在门口。" },
      { en: "Someone left them here.", zh: "有人把它们落这儿了。" }
    ],
    dialogue: [
      { who: "npc", en: "Is there anything in the box?", zh: "小美抱着旧盒子晃了晃。" },
      { who: "npc", en: "Listen... nothing!", zh: "她晃给你听：一点声音都没有。" },
      { who: "me", en: "There is nothing in the box.", zh: "轮到你说了——盒子里什么也没有。" }
    ],
    contrast: [
      {
        wrong: "I don't have nothing.",
        wrongMark: "don't",
        correct: "I have nothing.",
        whyZh: "nothing 自带「不」：一句话里有了它，就别再请 not——两个「不」打架。"
      },
      {
        wrong: "Someone are at the door.",
        wrongMark: "are",
        correct: "Someone is at the door.",
        whyZh: "someone 是「一个人」：配 is——第 26 课单复数判断的老规矩。"
      },
      {
        wrong: "There is something in the box.",
        wrongMark: null,
        correct: "There is nothing in the box.",
        bothRight: true,
        whyZh: "两句都对——有样东西（something）／啥也没有（nothing）：一对反义，对台站。"
      },
      {
        wrong: "I have something for you.",
        wrongMark: null,
        correct: "There is nothing in the box.",
        bothRight: true,
        whyZh: "两句都对——第 83 课 something 复现：一个「有」、一个「没」。"
      },
      {
        wrong: "Is there a park near here?",
        wrongMark: null,
        correct: "There is nothing in the box.",
        bothRight: true,
        whyZh: "两句都对——第 26 课 There be 家族复现：问「有没有」就是它的老本行。"
      },
      {
        wrong: "Someone left them here.",
        wrongMark: null,
        correct: "There is nothing in the box.",
        bothRight: true,
        whyZh: "两句都对——第 33 课某人（someone）的老台词复现：someone 今天正式转正。"
      }
    ],
    variants: [
      { label: "肯定", en: "There is nothing in the box.", zh: "盒子里什么也没有。", noteZh: "nothing 自带「不」。" },
      { label: "否定", en: "There is not anything in the box.", zh: "盒里没东西（换个说法）。", noteZh: "想用 not 也可以：换成 anything，两个「不」不打架。" },
      { label: "疑问", en: "Is there anything in the box?", zh: "盒子里有东西吗？", noteZh: "疑问换 anything——第 83 课的老规矩。" }
    ],
    sceneSwings: [
      { sceneZh: "说我什么都没有", en: "I have nothing.", zh: "我什么都没有。" },
      { sceneZh: "说有人在门口", en: "Someone is at the door.", zh: "有人在门口。" },
      { sceneZh: "问盒子里有没有东西", en: "Is there anything in the box?", zh: "盒子里有东西吗？" }
    ],
    deepDive: {
      title: "nothing 自带「不」",
      paragraphs: [
        "nothing 的肚子里已经装着一个「不」了——它就是「什么也没有」。所以一句话里有了它，就别再请 not 来帮忙：I have nothing（我什么都没有）。",
        "如果想用 not 呢？那就换个词：I don't have anything——not + anything，两个「不」其实是一个意思的两种说法。记住原则：nothing 和 not 不同台。",
        "someone 是「有人」——它说的是「某一个人」，所以配 is：Someone is at the door（有人在门口）。第 33 课的老台词 Someone left them here，今天正式转正。",
        "三个一起记：something（有样东西）、anything（任何东西，疑问否定用）、nothing（啥也没有）——「不点名的东西」三兄弟到齐了。"
      ]
    },
    summary: {
      rule: "nothing 自带「不」（不再请 not）：There is nothing in the box.；someone 是「一个人」，配 is。",
      points: [
        "There is nothing in the box. —— 啥也没有",
        "I don't have nothing ❌ —— 两个「不」打架",
        "Someone is at the door. —— someone 配 is"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：盒子里什么也没有。",
        before: "There is",
        after: "in the box.",
        options: ["nothing", "not nothing", "anything"],
        answer: "nothing",
        explain: "nothing 自带「不」：不再请 not。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：盒子里什么也没有。",
        tokens: ["There", "is", "nothing", "in", "the", "box."],
        answer: "There is nothing in the box.",
        explain: "There be + nothing：啥也没有。"
      },
      {
        // R8 跨课复现：第 26 课（There be 家族）
        kind: "arrange",
        promptZh: "先复习一小步——第 26 课学过：桌上有一本书。",
        tokens: ["There", "is", "a", "book", "on", "the", "desk."],
        answer: "There is a book on the desk.",
        explain: "复现第 26 课：There be——今天它有话要说（啥也没有）。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "don't", "have", "nothing."],
        wrongToken: "don't",
        answer: "don't",
        correctionZh: "nothing 自带「不」：去掉 don't——I have nothing。",
        explain: "两个「不」打架。"
      },
      {
        // R8 跨课复现：第 33 课（someone 老台词）
        kind: "arrange",
        promptZh: "再对照一句——第 33 课听过：有人把它们落这儿了。",
        tokens: ["Someone", "left", "them", "here."],
        answer: "Someone left them here.",
        explain: "复现第 33 课：someone 老台词——今天正式转正。"
      },
      {
        // R9 变形/替换：换说法（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「There is nothing in the box.」想换成 not 的说法，中间那截要怎么变？",
        replaceBase: "There is nothing in the box.",
        replaceTarget: "换成 not + anything 的说法",
        options: ["not anything", "not nothing", "no anything"],
        answer: "not anything",
        explain: "换说法：is not anything——not 和 anything 搭伙，不和 nothing 搭伙。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：盒子里什么也没有。",
        tokens: ["There", "is", "nothing", "in", "the", "box."],
        distractors: ["anything"],
        answer: "There is nothing in the box."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：盒子里有东西吗？",
        tokens: ["Is", "there", "anything", "in", "the", "box?"],
        distractors: ["nothing"],
        answer: "Is there anything in the box?"
      },
      {
        promptZh: "你想说：有人在门口。",
        tokens: ["Someone", "is", "at", "the", "door."],
        distractors: ["are"],
        answer: "Someone is at the door."
      },
      {
        // R8 跨课复现：第 33 课原句
        promptZh: "复习第 33 课：有人把它们落这儿了。",
        tokens: ["Someone", "left", "them", "here."],
        distractors: ["leaves"],
        answer: "Someone left them here."
      }
    ],
    recall: {
      promptZh: "小美打开旧盒子，里面空空的。凭记忆，写出你那句英文。",
      intentZh: "盒子里什么也没有。",
      answer: "There is nothing in the box.",
      noteZh: "nothing 自带「不」——不再请 not。"
    },
    huntCaseIds: ["hunt-empty-drawer"]
  },

  // ── 第十三批 · L85 这是谁的（whose）：疑问词家族最后一位补员——L33 对白转正（批十三 PRD §2）──
  {
    id: "lesson-85-whose",
    number: 85,
    title: "这是谁的",
    grammarLabel: "问东西的主人 · whose",
    episode: "小美的一天 八十五",
    scene: "mystery",
    cover: cover8,
    sceneSetupZh: "失物堆前，小美捡起一本书，问这是谁的。",
    dialogueEn: "Whose book is this?",
    dialogueZh: "小美把书举起来晃了晃。",
    intentZh: "这是谁的书？",
    targetSentence: "Whose book is this?",
    blocks: [
      { text: "Whose book", role: "谁的书（主人词站最前）" },
      { text: "is this?", role: "是这本？" }
    ],
    oneLineRule: "问「这是谁的」，用 whose 站最前面——whose 后面直接跟东西（whose book），再问是谁的。",
    examples: [
      { en: "Whose book is this?", zh: "这是谁的书？" },
      { en: "Whose bag is this?", zh: "这是谁的包？" },
      { en: "Whose umbrellas are these?", zh: "这些是谁的伞？" },
      { en: "This one is mine.", zh: "这本是我的。" }
    ],
    dialogue: [
      { who: "npc", en: "Someone left a book here.", zh: "小美从失物堆里捡起一本书。" },
      { who: "npc", en: "It is not mine.", zh: "她翻了翻，不是自己的。" },
      { who: "me", en: "Whose book is this?", zh: "轮到你说了——这是谁的书？" }
    ],
    contrast: [
      {
        wrong: "Who's book is this?",
        wrongMark: "Who's",
        correct: "Whose book is this?",
        whyZh: "谁是「谁」，whose 是「谁的」——两家人读起来像、写法不同：whose 一个词，who's 是 who is 的缩写。"
      },
      {
        wrong: "Whose is this book?",
        wrongMark: null,
        correct: "Whose book is this?",
        whyZh: "whose 后面直接跟东西：Whose book（谁的书）——再问 is this。"
      },
      {
        wrong: "Where is my hat?",
        wrongMark: null,
        correct: "Whose book is this?",
        bothRight: true,
        whyZh: "两句都对——第 18 课 Where（在哪）＋今天 whose（谁的）：疑问词家族一句一个。"
      },
      {
        wrong: "Whose umbrellas are these?",
        wrongMark: null,
        correct: "Whose book is this?",
        bothRight: true,
        whyZh: "两句都对——第 33 课的老对白（那些伞是谁的）今天转正：疑问有了自己的课。"
      },
      {
        wrong: "Do you have anything for me?",
        wrongMark: null,
        correct: "Whose book is this?",
        bothRight: true,
        whyZh: "两句都对——第 83 课 anything 复现：失物堆前正好用得上。"
      },
      {
        wrong: "There is nothing in the box.",
        wrongMark: null,
        correct: "Whose book is this?",
        bothRight: true,
        whyZh: "两句都对——第 84 课 nothing 复现：这一季的问句和答句都串起来了。"
      }
    ],
    variants: [
      { label: "肯定", en: "Whose book is this?", zh: "这是谁的书？", noteZh: "whose + 东西 + is this。" },
      { label: "否定", en: "This is not my book.", zh: "这不是我的书。", noteZh: "答「不是我的」——is not。" },
      { label: "疑问", en: "Whose bag is this?", zh: "这是谁的包？", noteZh: "换样东西再问一次。" }
    ],
    sceneSwings: [
      { sceneZh: "问这是谁的包", en: "Whose bag is this?", zh: "这是谁的包？" },
      { sceneZh: "问这些是谁的伞", en: "Whose umbrellas are these?", zh: "这些是谁的伞？" },
      { sceneZh: "说这本是我的", en: "This one is mine.", zh: "这本是我的。" }
    ],
    deepDive: {
      title: "疑问词家族大点兵",
      paragraphs: [
        "第 27 课你认识了疑问词家族的四位：What（什么）、Where（哪里）、When（什么时候）、Who（谁）；第 72 课又添了 How 家族。今天最后一位成员报到：Whose——「谁的」。",
        "whose 的规矩：站最前面、后面直接跟东西——Whose book is this?（谁的书是这本）。中文说「这是谁的书」，「谁的」在中间；英语把 whose 提到最前头。",
        "最容易混的是 who's：它读起来和 whose 一模一样，但 who's = who is（谁是）。写的时候要看清楚——问「谁的」用 whose（一个词），「谁是」才用 who's。",
        "第 33 课的老对白 Whose umbrellas are these?（那些伞是谁的）今天正式转正——当时你只是听过，现在它是一整个家族的最后一块拼图。"
      ]
    },
    summary: {
      rule: "问「这是谁的」：whose + 东西 + is this?——whose 一个词，who's 是「谁是」。",
      points: [
        "Whose book is this? —— 主人词站最前",
        "Whose umbrellas are these? —— 第 33 课老对白转正",
        "whose（谁的）≠ who's（谁是）—— 读音像、写法不同"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想问：这是谁的书？",
        before: "___ book is this?",
        after: "",
        options: ["Whose", "Who's", "Who"],
        answer: "Whose",
        explain: "问「谁的」用 whose——一个词。"
      },
      {
        kind: "arrange",
        promptZh: "你想问：这是谁的书？",
        tokens: ["Whose", "book", "is", "this?"],
        answer: "Whose book is this?",
        explain: "whose + 东西 + is this：主人词站最前。"
      },
      {
        // R8 跨课复现：第 33 课（老对白）
        kind: "arrange",
        promptZh: "先复习一小步——第 33 课听过：这些是谁的伞？",
        tokens: ["Whose", "umbrellas", "are", "these?"],
        answer: "Whose umbrellas are these?",
        explain: "复现第 33 课：老对白——今天正式转正。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["Who's", "book", "is", "this?"],
        wrongToken: "Who's",
        answer: "Who's",
        correctionZh: "问「谁的」用 whose（一个词）：Whose book is this?",
        explain: "who's 是「谁是」——两家人。"
      },
      {
        // R8 跨课复现：第 27 课（家族老四位）
        kind: "arrange",
        promptZh: "再对照一句——第 27 课学过：你的生日是什么时候？",
        tokens: ["When", "is", "your", "birthday?"],
        answer: "When is your birthday?",
        explain: "复现第 27 课：家族老成员——它的妹妹 whose 今天补位。"
      },
      {
        // R9 变形/替换：换东西（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「Whose book is this?」把「书」换成「包」，句子要怎么变？",
        replaceBase: "Whose book is this?",
        replaceTarget: "把 book 换成 bag",
        options: ["Whose bag is this?", "Whose is bag this?", "Who's bag is this?"],
        answer: "Whose bag is this?",
        explain: "同一个位子换东西：Whose bag is this?——whose 照样站最前。"
      }
    ],
    practice: [
      {
        promptZh: "你想问：这是谁的书？",
        tokens: ["Whose", "book", "is", "this?"],
        distractors: ["Who's"],
        answer: "Whose book is this?"
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：这是谁的包？",
        tokens: ["Whose", "bag", "is", "this?"],
        distractors: ["Who"],
        answer: "Whose bag is this?"
      },
      {
        promptZh: "你想说：这本是我的。",
        tokens: ["This", "one", "is", "mine."],
        distractors: ["my"],
        answer: "This one is mine."
      },
      {
        // R8 跨课复现：第 33 课原句
        promptZh: "复习第 33 课：这些是谁的伞？",
        tokens: ["Whose", "umbrellas", "are", "these?"],
        distractors: ["Who's"],
        answer: "Whose umbrellas are these?"
      }
    ],
    recall: {
      promptZh: "失物堆前，小美捡起一本书，不是她的。凭记忆，写出她那句英文。",
      intentZh: "这是谁的书？",
      answer: "Whose book is this?",
      noteZh: "whose 一个词——后面直接跟东西。"
    },
    huntCaseIds: ["hunt-umbrella-owner"]
  },

  // ── 第十三批 · L86 失物招领处（收口 · 零新知全复现）：把身边的东西一件件说清楚——大章节收口（批十三 PRD §2）──
  {
    id: "lesson-86-lost-and-found",
    number: 86,
    title: "失物招领处",
    grammarLabel: "收口 · 大团圆（零新知）",
    episode: "小美的一天 八十六",
    scene: "school",
    cover: cover11,
    sceneSetupZh: "学校失物招领处，小美和你一件件认领、一件件放回。",
    dialogueEn: "Whose bag is this? It is next to the door.",
    dialogueZh: "小美从失物架上拎起一个包。",
    intentZh: "这是谁的包？它就在门边。",
    targetSentence: "Whose bag is this? It is next to the door.",
    blocks: [
      { text: "Whose bag is this?", role: "这是谁的包？（问主人）" },
      { text: "It is next to the door.", role: "它在门边（说位置）" }
    ],
    oneLineRule: "一句问主人（Whose…?）、一句说位置（next to…）——把身边的东西说清楚，这一季的本事全在这一问一答里。",
    examples: [
      { en: "Whose bag is this? It is next to the door.", zh: "这是谁的包？它在门边。" },
      { en: "There is nothing in the bag.", zh: "包里什么也没有。" },
      { en: "I put my bag next to the door.", zh: "我把书包放在门边。" },
      { en: "What a nice bag!", zh: "多好的包啊！（认读）" }
    ],
    dialogue: [
      { who: "npc", en: "Look! A bag on the shelf.", zh: "小美从失物架上拎起一个包。" },
      { who: "npc", en: "Who left it here?", zh: "她左右看了看，没人。" },
      { who: "me", en: "Whose bag is this? It is next to the door.", zh: "轮到你说了——这是谁的包？它在门边。" }
    ],
    contrast: [
      {
        wrong: "I putted it on the desk.",
        wrongMark: "putted",
        correct: "I put it on the desk.",
        whyZh: "第 82 课回流：put 三天长一个样——不加 -ed。"
      },
      {
        wrong: "Whose bag is this? It is next to the door.",
        wrongMark: null,
        correct: "It is next to the door.",
        bothRight: true,
        whyZh: "两句都对——一句问主人（第 85 课）、一句说位置（第 79 课）：复现不是新点，一问一答站稳。"
      },
      {
        wrong: "I don't have nothing.",
        wrongMark: "don't",
        correct: "I have nothing.",
        whyZh: "第 84 课回流：nothing 自带「不」——去掉 don't。"
      },
      {
        wrong: "My desk is next to the window.",
        wrongMark: null,
        correct: "Whose bag is this?",
        bothRight: true,
        whyZh: "两句都对——第 79 课 next to（贴旁边）＋第 85 课 whose（谁的）：位置与主人，两句都好用。"
      },
      {
        wrong: "The cat is behind the door.",
        wrongMark: null,
        correct: "I sit between Tom and Amy.",
        bothRight: true,
        whyZh: "两句都对——第 80 课 behind（在后面）＋第 81 课 between（在中间）：方位家族兄弟排排站。"
      },
      {
        wrong: "What a nice bag!",
        wrongMark: null,
        correct: "There is nothing in the box.",
        bothRight: true,
        whyZh: "两句都对——第 68 课的感叹句（多好的包啊）今天只认读；第 84 课 nothing 复现：大章末点个名。"
      }
    ],
    variants: [
      { label: "肯定", en: "Whose bag is this? It is next to the door.", zh: "这是谁的包？它在门边。", noteZh: "一问一答：主人与位置。" },
      { label: "否定", en: "There is nothing in the bag.", zh: "包里什么也没有。", noteZh: "nothing 自带「不」——第 84 课回流。" },
      { label: "疑问", en: "Is this your bag?", zh: "这是你的包吗？", noteZh: "问「是不是你的」——Is 搬句首。" }
    ],
    sceneSwings: [
      { sceneZh: "说包里什么也没有", en: "There is nothing in the bag.", zh: "包里什么也没有。" },
      { sceneZh: "说把包放在门边", en: "I put my bag next to the door.", zh: "我把书包放在门边。" },
      { sceneZh: "问这是谁的伞", en: "Whose umbrella is this?", zh: "这是谁的伞？" }
    ],
    deepDive: {
      title: "大章倒带：把身边说清楚",
      paragraphs: [
        "这一季八课，你学会了一套「把身边说清楚」的本事：东西在哪（next to／in front of／behind／between）、怎么放（put）、说不清是什么（something／anything／nothing／someone）、这是谁的（whose）。",
        "方位家族现在有八位：in／on／at（第 18 课）、under／near（第 26 课）、next to（第 79 课）、in front of／behind（第 80 课）、between（第 81 课）——你指哪儿说哪儿。",
        "「不点名的东西」三兄弟：something（有样东西）、anything（疑问否定用）、nothing（啥也没有）——第 30 课 some/any 的老规矩一路管到这儿。",
        "最后送一句认读（第 68 课的老朋友）：What a nice bag!（多好的包啊）——感叹句先混个脸熟，它有自己的课在后面等着。失物招领处的一天到此收工：问主人、说位置、清点东西，你都会了。"
      ]
    },
    summary: {
      rule: "把身边说清楚：东西在哪（next to／behind／between）＋ 怎么放（put）＋ 说不清是什么（something／nothing）＋ 这是谁的（whose）。",
      points: [
        "Whose bag is this? It is next to the door. —— 一问一答收口",
        "方位八位：in／on／at／under／near／next to／in front of／behind／between",
        "put 三天一个样 ／ nothing 自带「不」——本季两条老规矩"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想问：这是谁的包？",
        before: "___ bag is this?",
        after: "",
        options: ["Whose", "Who's", "Where"],
        answer: "Whose",
        explain: "问「谁的」用 whose——第 85 课的规矩。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：它在门边。",
        tokens: ["It", "is", "next", "to", "the", "door."],
        answer: "It is next to the door.",
        explain: "位置收尾：next to the door——第 79 课老规矩。"
      },
      {
        // R8 跨课复现：第 82 课（put）
        kind: "arrange",
        promptZh: "先复习一小步——第 82 课学过：我把书包放在门边。",
        tokens: ["I", "put", "my", "bag", "next", "to", "the", "door."],
        answer: "I put my bag next to the door.",
        explain: "复现第 82 课：put 三天一个样——大章第一段的本事。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "putted", "it", "on", "the", "desk."],
        wrongToken: "putted",
        answer: "putted",
        correctionZh: "put 三天长一个样：I put it on the desk。",
        explain: "第 82 课回流。"
      },
      {
        // R8 跨课复现：第 84 课（nothing）
        kind: "arrange",
        promptZh: "再对照一句——第 84 课学过：盒子里什么也没有。",
        tokens: ["There", "is", "nothing", "in", "the", "box."],
        answer: "There is nothing in the box.",
        explain: "复现第 84 课：nothing 自带「不」——大章第二段的本事。"
      },
      {
        // R9 变形/替换：换问的东西（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「Whose bag is this?」把「包」换成「伞（umbrella）」，句子要怎么变？",
        replaceBase: "Whose bag is this?",
        replaceTarget: "把 bag 换成 umbrella",
        options: ["Whose umbrella is this?", "Whose is umbrella this?", "Who's umbrella is this?"],
        answer: "Whose umbrella is this?",
        explain: "同一个位子换东西：Whose umbrella is this?——失物招领处最常用的一句。"
      }
    ],
    practice: [
      {
        promptZh: "你想问：这是谁的包？",
        tokens: ["Whose", "bag", "is", "this?"],
        distractors: ["Who's"],
        answer: "Whose bag is this?"
      },
      {
        // R06 变体扩量：与 variants 否定卡逐字一致的否定变体题
        promptZh: "你想说：包里什么也没有。",
        tokens: ["There", "is", "nothing", "in", "the", "bag."],
        distractors: ["anything"],
        answer: "There is nothing in the bag."
      },
      {
        // R8 跨课复现：第 82 课原句
        promptZh: "复习第 82 课：我把书包放在门边。",
        tokens: ["I", "put", "my", "bag", "next", "to", "the", "door."],
        distractors: ["putted"],
        answer: "I put my bag next to the door."
      },
      {
        // 全批收官惯例：复现第 80 课原句
        promptZh: "全批收官——复习第 80 课：猫在门后头。",
        tokens: ["The", "cat", "is", "behind", "the", "door."],
        distractors: ["of"],
        answer: "The cat is behind the door."
      }
    ],
    recall: {
      promptZh: "学校失物招领处，小美从失物架上拎起一个包问你。凭记忆，写出她那句英文。",
      intentZh: "这是谁的包？它在门边。",
      answer: "Whose bag is this? It is next to the door.",
      noteZh: "一句问主人、一句说位置——大章收口。"
    },
    huntCaseIds: ["hunt-lost-found"]
  },

  // ── 第十四批 · L87 今天真冷（合体 It's）：两个词挤一挤——L6 老句的短版（批十四 PRD §2·大章节第一课）──
  {
    id: "lesson-87-its-cold",
    number: 87,
    title: "今天真冷",
    grammarLabel: "两个词挤一挤 · It's",
    episode: "小美的一天 八十七",
    scene: "school",
    cover: cover16,
    sceneSetupZh: "开学第一天早上，校门口风不小，小美搓着手说今天真冷。",
    dialogueEn: "It's cold today.",
    dialogueZh: "小美搓着手，朝手心哈了口气。",
    intentZh: "今天真冷。",
    targetSentence: "It's cold today.",
    blocks: [
      { text: "It's", role: "它是（两个词挤一挤）" },
      { text: "cold", role: "冷" },
      { text: "today", role: "今天" }
    ],
    oneLineRule: "两个词可以挤一挤：It is 挤成 It's——短的这版口语里天天用，意思一模一样。",
    examples: [
      { en: "It's cold today.", zh: "今天真冷。" },
      { en: "It is cold today.", zh: "今天很冷。（一个意思）" },
      { en: "It's nice to see you.", zh: "见到你真好。" },
      { en: "It is sunny today.", zh: "今天天晴。" }
    ],
    dialogue: [
      { who: "npc", en: "Good morning!", zh: "校门口，同学朝你挥手。" },
      { who: "npc", en: "You look cold.", zh: "她看你缩着脖子。" },
      { who: "me", en: "It's cold today.", zh: "轮到你说了——今天真冷。" }
    ],
    contrast: [
      {
        wrong: "It's cold today.",
        wrongMark: null,
        correct: "It is cold today.",
        bothRight: true,
        whyZh: "两句都对——长的短的都在：It is cold（第 6 课学的）和 It's cold（今天学的短版）意思一模一样。"
      },
      {
        wrong: "Its cold today.",
        wrongMark: "Its",
        correct: "It's cold today.",
        whyZh: "短版的尾巴上有一小撇：It's——那一撇是把 is 挤掉后留下的记号，丢了它就成了「它的」。"
      },
      {
        wrong: "It cold today.",
        wrongMark: null,
        correct: "It's cold today.",
        whyZh: "挤掉的是 is，但搭档不能全没：It's 里还留着它的影——光剩 It 句子就塌了。"
      },
      {
        wrong: "It is sunny today.",
        wrongMark: null,
        correct: "It's cold today.",
        bothRight: true,
        whyZh: "两句都对——第 6 课的天气老句（It is sunny）＋今天的短版：天气句两版都会。"
      },
      {
        wrong: "Where is my hat?",
        wrongMark: null,
        correct: "It's cold today.",
        bothRight: true,
        whyZh: "两句都对——第 18 课的 Where is（在哪）复现：天冷了，帽子该在哪儿。"
      },
      {
        wrong: "I am happy.",
        wrongMark: null,
        correct: "It's cold today.",
        bothRight: true,
        whyZh: "两句都对——第 1 课的 I am（我是）复现：I am 也能挤成 I'm，同一个道理（今天先记 It's）。"
      }
    ],
    variants: [
      { label: "肯定", en: "It's cold today.", zh: "今天真冷。", noteZh: "It is 挤成 It's。" },
      { label: "否定", en: "It's not cold today.", zh: "今天不冷。", noteZh: "not 跟 is 走：It's not。" },
      { label: "疑问", en: "Is it cold today?", zh: "今天冷吗？", noteZh: "第 6 课的搬法照旧：Is 搬句首。" }
    ],
    sceneSwings: [
      { sceneZh: "说见到你真好", en: "It's nice to see you.", zh: "见到你真好。" },
      { sceneZh: "说今天天晴", en: "It is sunny today.", zh: "今天天晴。" },
      { sceneZh: "问今天冷不冷", en: "Is it cold today?", zh: "今天冷吗？" }
    ],
    deepDive: {
      title: "两个词挤一挤",
      paragraphs: [
        "英语口语里，两个小词常常挤一挤合成一个短词：It is → It's、I am → I'm、That is → That's——挤完尾巴上留一小撇（'），记号还在。",
        "为什么挤？因为说话要快。老外日常说「今天冷」，十个里有九个说 It's cold——长的 It is cold 也不错，只是听起来更慢、更正式。两句都对，随你挑。",
        "那一小撇很重要：It's 是「它是」的短版，Its 是「它的」——读起来一样，写法差一小撇，意思差一条街。写的时候记得把尾巴带上。",
        "第 6 课你学过 It is cold today 的完整版；今天把短版装上——从今天起，打招呼聊天气，你两版都会。"
      ]
    },
    summary: {
      rule: "两个词挤一挤：It is → It's（短的这版口语天天用）——尾巴那一小撇不能丢。",
      points: [
        "It's cold today. —— 短版（口语常用）",
        "It is cold today. —— 长版（也对）",
        "Its ❌ —— 少一小撇就成了「它的」"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：今天真冷。（用短的那版）",
        before: "",
        after: " cold today.",
        options: ["It's", "Its", "It"],
        answer: "It's",
        explain: "It is 挤成 It's——尾巴带一小撇。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：今天真冷。",
        tokens: ["It's", "cold", "today."],
        answer: "It's cold today.",
        explain: "短版：It's + cold + today。"
      },
      {
        // R8 跨课复现：第 6 课（长版老句）
        kind: "arrange",
        promptZh: "先复习一小步——第 6 课学过：今天很冷。",
        tokens: ["It", "is", "cold", "today."],
        answer: "It is cold today.",
        explain: "复现第 6 课：长版——今天把它挤短。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["Its", "cold", "today."],
        wrongToken: "Its",
        answer: "Its",
        correctionZh: "尾巴上要有一小撇：It's cold today。",
        explain: "少一小撇就成了「它的」。"
      },
      {
        // R8 跨课复现：第 18 课（Where is）
        kind: "arrange",
        promptZh: "再对照一句——第 18 课学过：我的帽子在哪？",
        tokens: ["Where", "is", "my", "hat?"],
        answer: "Where is my hat?",
        explain: "复现第 18 课：Where is 里也有 is——天冷，帽子戴好。"
      },
      {
        // R9 变形/替换：长换短（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「It is sunny today.」把长版挤成短版，开头要怎么变？",
        replaceBase: "It is sunny today.",
        replaceTarget: "把 It is 挤成短的",
        options: ["It's", "Its", "It is's"],
        answer: "It's",
        explain: "同一招换一句：It's sunny today——尾巴带撇。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：今天真冷。",
        tokens: ["It's", "cold", "today."],
        distractors: ["Its"],
        answer: "It's cold today."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：今天冷吗？",
        tokens: ["Is", "it", "cold", "today?"],
        distractors: ["Does"],
        answer: "Is it cold today?"
      },
      {
        promptZh: "你想说：见到你真好。",
        tokens: ["It's", "nice", "to", "see", "you."],
        distractors: ["Its"],
        answer: "It's nice to see you."
      },
      {
        // R8 跨课复现：第 6 课原句
        promptZh: "复习第 6 课：今天很冷。",
        tokens: ["It", "is", "cold", "today."],
        distractors: ["are"],
        answer: "It is cold today."
      }
    ],
    recall: {
      promptZh: "开学第一天早上校门口，同学看你缩着脖子。凭记忆，写出你那句英文。",
      intentZh: "今天真冷。",
      answer: "It's cold today.",
      noteZh: "It is 挤成 It's——尾巴带一小撇。"
    },
    huntCaseIds: ["hunt-cold-morning"]
  },

  // ── 第十四批 · L88 今天刮风（-y 家族）：名词穿 -y 外套变成「…的」（批十四 PRD §2）──
  {
    id: "lesson-88-its-windy",
    number: 88,
    title: "今天刮风",
    grammarLabel: "名词穿外套 · windy / snowy / cloudy",
    episode: "小美的一天 八十八",
    scene: "school",
    cover: cover20,
    sceneSetupZh: "校门口风很大，风把云吹了过来，小美按住帽檐。",
    dialogueEn: "It's windy today.",
    dialogueZh: "小美按住帽檐，眯着眼。",
    intentZh: "今天刮风。",
    targetSentence: "It's windy today.",
    blocks: [
      { text: "It's", role: "它是（挤一挤）" },
      { text: "windy", role: "刮风的（wind 穿了外套）" },
      { text: "today", role: "今天" }
    ],
    oneLineRule: "名词穿上一件 -y 外套，就变成「…的」：wind→windy（刮风的）、snow→snowy（下雪的）、cloud→cloudy（多云的）。",
    examples: [
      { en: "It's windy today.", zh: "今天刮风。" },
      { en: "It's snowy today.", zh: "今天下雪。" },
      { en: "It's cloudy today.", zh: "今天多云。" },
      { en: "It's cold today.", zh: "今天真冷。" }
    ],
    dialogue: [
      { who: "npc", en: "Look at the clouds!", zh: "小美指着天上跑得飞快的云。" },
      { who: "npc", en: "My hat!", zh: "她的帽檐被风掀了起来。" },
      { who: "me", en: "It's windy today.", zh: "轮到你说了——今天刮风。" }
    ],
    contrast: [
      {
        wrong: "It's wind today.",
        wrongMark: "wind",
        correct: "It's windy today.",
        whyZh: "「刮风的」要说 windy——wind 穿上 -y 外套才变成「…的」。（这一处只在这里对照：漏外套的错不放进案子里。）"
      },
      {
        wrong: "It's windy day.",
        wrongMark: null,
        correct: "It's a windy day.",
        whyZh: "「一个大风天」要带 a：It's a windy day——漏了 a 句子就缺口。"
      },
      {
        wrong: "It's cold today.",
        wrongMark: null,
        correct: "It's windy today.",
        bothRight: true,
        whyZh: "两句都对——第 87 课短版＋今天的 windy：天气句越说越细。"
      },
      {
        wrong: "It is sunny today.",
        wrongMark: null,
        correct: "It's windy today.",
        bothRight: true,
        whyZh: "两句都对——第 6 课 sunny（晴）＋今天 windy（风）：-y 家族的两位都在。"
      },
      {
        wrong: "It was windy, but we were happy.",
        wrongMark: null,
        correct: "It's windy today.",
        bothRight: true,
        whyZh: "两句都对——第 19 课听过 windy（风很大，但我们很开心）——今天它正式上岗。"
      },
      {
        wrong: "The clouds are white.",
        wrongMark: null,
        correct: "It's windy today.",
        bothRight: true,
        whyZh: "两句都对——云和风是一家人：云在跑（clouds）、风在吹（windy）——第 26 课的单复数也在。"
      }
    ],
    variants: [
      { label: "肯定", en: "It's windy today.", zh: "今天刮风。", noteZh: "wind 穿 -y 外套。" },
      { label: "否定", en: "It's not windy today.", zh: "今天不刮风。", noteZh: "not 跟 is 走：It's not。" },
      { label: "疑问", en: "Is it windy today?", zh: "今天刮风吗？", noteZh: "Is 搬句首——第 6 课的搬法。" }
    ],
    sceneSwings: [
      { sceneZh: "说今天下雪", en: "It's snowy today.", zh: "今天下雪。" },
      { sceneZh: "说今天多云", en: "It's cloudy today.", zh: "今天多云。" },
      { sceneZh: "问今天刮不刮风", en: "Is it windy today?", zh: "今天刮风吗？" }
    ],
    deepDive: {
      title: "名词穿 -y 外套",
      paragraphs: [
        "天气词有一个好玩的规矩：很多都是名词「穿了外套」变来的——wind（风）穿上 -y 变成 windy（刮风的）、snow（雪）变成 snowy（下雪的）、cloud（云）变成 cloudy（多云的）。",
        "怎么记？看到 -y 尾巴，就想「…的」：windy 是「风的（天气）」、snowy 是「雪的」、cloudy 是「云的」——外套一穿，名字就变成描述。",
        "第 6 课你学过 sunny（晴的）——它也是这样来的：sun（太阳）穿 -y。今天再认识三个兄弟，天气词家族就够你天天聊了。",
        "说说天气三件套：It's + 天气词 + today——It's cold、It's windy、It's snowy——第 87 课的短版配上今天的新词，随口就能聊。"
      ]
    },
    summary: {
      rule: "名词穿 -y 外套变成「…的」：wind→windy、snow→snowy、cloud→cloudy。",
      points: [
        "It's windy today. —— wind 穿外套",
        "snowy / cloudy / sunny —— -y 家族排排站",
        "It's a windy day. —— 「一个大风天」要带 a"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：今天刮风。",
        before: "It's",
        after: "today.",
        options: ["windy", "wind", "wind's"],
        answer: "windy",
        explain: "刮风的要说 windy——wind 穿 -y 外套。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：今天刮风。",
        tokens: ["It's", "windy", "today."],
        answer: "It's windy today.",
        explain: "短版 + windy：It's windy today。"
      },
      {
        // R8 跨课复现：第 87 课（合体）
        kind: "arrange",
        promptZh: "先复习一小步——第 87 课学过：今天真冷。",
        tokens: ["It's", "cold", "today."],
        answer: "It's cold today.",
        explain: "复现第 87 课：短版——今天给它换上天气新词。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["It's", "wind", "today."],
        wrongToken: "wind",
        answer: "wind",
        correctionZh: "穿 -y 外套：windy。",
        explain: "「刮风的」要用 windy。"
      },
      {
        // R8 跨课复现：第 6 课（sunny 老熟人）
        kind: "arrange",
        promptZh: "再对照一句——第 6 课学过：今天天晴。",
        tokens: ["It", "is", "sunny", "today."],
        answer: "It is sunny today.",
        explain: "复现第 6 课：sunny 也是 -y 家族——穿外套的老规矩。"
      },
      {
        // R9 变形/替换：换天气词（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「It's windy today.」把「刮风」换成「下雪（snow）」，天气词要怎么变？",
        replaceBase: "It's windy today.",
        replaceTarget: "把 windy 换成 snow（下雪的）",
        options: ["snowy", "snow", "snowing"],
        answer: "snowy",
        explain: "snow 穿 -y 外套：It's snowy today——同一个规矩。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：今天刮风。",
        tokens: ["It's", "windy", "today."],
        distractors: ["wind"],
        answer: "It's windy today."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：今天刮风吗？",
        tokens: ["Is", "it", "windy", "today?"],
        distractors: ["Does"],
        answer: "Is it windy today?"
      },
      {
        promptZh: "你想说：今天多云。",
        tokens: ["It's", "cloudy", "today."],
        distractors: ["cloud"],
        answer: "It's cloudy today."
      },
      {
        // R8 跨课复现：第 6 课原句
        promptZh: "复习第 6 课：今天天晴。",
        tokens: ["It", "is", "sunny", "today."],
        distractors: ["sun"],
        answer: "It is sunny today."
      }
    ],
    recall: {
      promptZh: "校门口风很大，风把云吹得飞快，小美按住帽檐。凭记忆，写出你那句英文。",
      intentZh: "今天刮风。",
      answer: "It's windy today.",
      noteZh: "wind 穿 -y 外套：windy。"
    },
    huntCaseIds: ["hunt-windy-window"]
  },

  // ── 第十四批 · L89 多好的天啊（What a…!）：先说 What 再把 a 和东西摆上——L86 预告兑现（批十四 PRD §2）──
  {
    id: "lesson-89-what-a-day",
    number: 89,
    title: "多好的天啊",
    grammarLabel: "多好的… · What a + 东西",
    episode: "小美的一天 八十九",
    scene: "school",
    cover: cover21,
    sceneSetupZh: "风把云吹散了，太阳出来，小美抬头感叹多好的天。",
    dialogueEn: "What a nice day!",
    dialogueZh: "小美抬头眯着眼，笑了。",
    intentZh: "多好的天啊！",
    targetSentence: "What a nice day!",
    blocks: [
      { text: "What", role: "多么（先说它）" },
      { text: "a nice day", role: "一个好天（a 在形容词后面）" }
    ],
    oneLineRule: "感叹「多好的…」：先说 What，再把 a 和东西摆上——What a + nice + day!（a 站在形容词后面）。",
    examples: [
      { en: "What a nice day!", zh: "多好的天啊！" },
      { en: "What a nice bag!", zh: "多好的包啊！" },
      { en: "What a big house!", zh: "多大的房子啊！" },
      { en: "It's a nice day.", zh: "今天天气不错。（陈述句）" }
    ],
    dialogue: [
      { who: "npc", en: "Look! The sun is out!", zh: "小美抬头，云散了。" },
      { who: "npc", en: "The sky is so blue.", zh: "她眯着眼，笑了。" },
      { who: "me", en: "What a nice day!", zh: "轮到你说了——多好的天啊！" }
    ],
    contrast: [
      {
        wrong: "What nice day!",
        wrongMark: "nice",
        correct: "What a nice day!",
        whyZh: "「一个天」要带 a——而且 a 站在形容词后面：What a nice day!（漏了 a 句子就缺口）。"
      },
      {
        wrong: "What a nice day?",
        wrongMark: "?",
        correct: "What a nice day!",
        whyZh: "感叹要配感叹号，不是问号——这是喊出来的，不是问出来的。"
      },
      {
        wrong: "It's a nice day.",
        wrongMark: null,
        correct: "What a nice day!",
        bothRight: true,
        whyZh: "两句都对——平着说（It's a nice day）和喊着说（What a nice day!）：一个是陈述、一个是感叹。"
      },
      {
        wrong: "What a nice bag!",
        wrongMark: null,
        correct: "What a nice day!",
        bothRight: true,
        whyZh: "两句都对——第 68 课听过 What a nice bag（多好的包）——今天换成天，同一个架子。"
      },
      {
        wrong: "It's windy today.",
        wrongMark: null,
        correct: "What a nice day!",
        bothRight: true,
        whyZh: "两句都对——第 88 课 windy（刮风）＋今天感叹：风停日出，正好喊一句。"
      },
      {
        wrong: "It's cold today.",
        wrongMark: null,
        correct: "What a nice day!",
        bothRight: true,
        whyZh: "两句都对——第 87 课短版复现：天从冷到暖，一句感叹收尾。"
      }
    ],
    variants: [
      { label: "肯定", en: "What a nice day!", zh: "多好的天啊！", noteZh: "What a + 形容词 + 东西——a 站形容词后。" },
      { label: "否定", en: "What a bad day!", zh: "多糟的一天啊！", noteZh: "换个词就换了心情——架子不变。" },
      { label: "疑问", en: "Is it a nice day?", zh: "今天天气好吗？", noteZh: "想问就问：Is 搬句首——感叹变疑问。" }
    ],
    sceneSwings: [
      { sceneZh: "感叹一个好包", en: "What a nice bag!", zh: "多好的包啊！" },
      { sceneZh: "感叹一座大房子", en: "What a big house!", zh: "多大的房子啊！" },
      { sceneZh: "平着说今天天气不错", en: "It's a nice day.", zh: "今天天气不错。" }
    ],
    deepDive: {
      title: "感叹的架子",
      paragraphs: [
        "感叹句有一个固定架子：What + a + 形容词 + 东西——What a nice day!（多好的天啊）。先说 What 把气提起来，再把 a 和东西摆上，感叹号收尾。",
        "最容易丢的是 a：What nice day ❌ 听起来像少了块砖——「一个天」必须带 a。记的时候把 a 和形容词当一个整体背：a nice day。",
        "感叹和陈述是一对：平着说 It's a nice day（今天天气不错）；喊着说 What a nice day!（多好的天啊）——同样的事，口气不同。",
        "第 68 课你听过 What a nice bag!（多好的包）——当时它只是句台词；第 86 课我们写了一句「它有自己的课在后面等着」——今天它来了。"
      ]
    },
    summary: {
      rule: "感叹「多好的…」：What a + 形容词 + 东西（What a nice day!）——a 站在形容词后面。",
      points: [
        "What a nice day! —— 感叹的架子",
        "What nice day ❌ —— a 不能丢",
        "It's a nice day. / What a nice day! —— 平着说 vs 喊着说"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想感叹：多好的天啊！",
        before: "What",
        after: " day!",
        options: ["a nice", "nice", "nice a"],
        answer: "a nice",
        explain: "a 站在形容词前面、紧跟着 What：What a nice day!"
      },
      {
        kind: "arrange",
        promptZh: "你想感叹：多好的天啊！",
        tokens: ["What", "a", "nice", "day!"],
        answer: "What a nice day!",
        explain: "架子：What + a + 形容词 + 东西。"
      },
      {
        // R8 跨课复现：第 68 课（老台词）
        kind: "arrange",
        promptZh: "先复习一小步——第 68 课听过：多好的包啊！",
        tokens: ["What", "a", "nice", "bag!"],
        answer: "What a nice bag!",
        explain: "复现第 68 课：老台词——今天正式学它的架子。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["What", "nice", "day!"],
        wrongToken: "nice",
        answer: "nice",
        correctionZh: "a 不能丢：What 【a】 nice day!",
        explain: "「一个天」要带 a。"
      },
      {
        // R8 跨课复现：第 87 课（短版天气句）
        kind: "arrange",
        promptZh: "再对照一句——第 87 课学过：今天真冷。",
        tokens: ["It's", "cold", "today."],
        answer: "It's cold today.",
        explain: "复现第 87 课：平着说天气——等一下我们喊一句。"
      },
      {
        // R9 变形/替换：换形容词（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「What a nice day!」把「好」换成「大（big）」，感叹的架子怎么变？",
        replaceBase: "What a nice day!",
        replaceTarget: "把 nice 换成 big",
        options: ["What a big day!", "What big a day!", "What a day big!"],
        answer: "What a big day!",
        explain: "架子里换个形容词：What a big day!——a 还是站原位。"
      }
    ],
    practice: [
      {
        promptZh: "你想感叹：多好的天啊！",
        tokens: ["What", "a", "nice", "day!"],
        distractors: ["nice a"],
        answer: "What a nice day!"
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：今天天气好吗？",
        tokens: ["Is", "it", "a", "nice", "day?"],
        distractors: ["Does"],
        answer: "Is it a nice day?"
      },
      {
        promptZh: "你想感叹：多好的包啊！",
        tokens: ["What", "a", "nice", "bag!"],
        distractors: ["an"],
        answer: "What a nice bag!"
      },
      {
        // R8 跨课复现：第 88 课原句
        promptZh: "复习第 88 课：今天刮风。",
        tokens: ["It's", "windy", "today."],
        distractors: ["wind"],
        answer: "It's windy today."
      }
    ],
    recall: {
      promptZh: "风把云吹散了，太阳出来，小美抬头笑了。凭记忆，写出她那句英文。",
      intentZh: "多好的天啊！",
      answer: "What a nice day!",
      noteZh: "What + a + 形容词 + 东西——a 不能丢。"
    },
    huntCaseIds: ["hunt-nice-day"]
  },

  // ── 第十四批 · L90 写完作业才看电视（after + 小句子）：after 后面升级成跟一整句（批十四 PRD §2·中段自走查点）──
  {
    id: "lesson-90-after",
    number: 90,
    title: "写完作业才看电视",
    grammarLabel: "先后 · after + 小句子",
    episode: "小美的一天 九十",
    scene: "mansion",
    cover: cover26,
    sceneSetupZh: "放学回到家，小美说自己的规矩：写完作业才看电视。",
    dialogueEn: "After I do my homework, I watch TV.",
    dialogueZh: "小美把书包放好，指了指作业本。",
    intentZh: "我写完作业才看电视。",
    targetSentence: "After I do my homework, I watch TV.",
    blocks: [
      { text: "After I do my homework", role: "我写完作业后（一整句小句子）" },
      { text: "I watch TV", role: "我看电视" }
    ],
    oneLineRule: "说「做完一件事之后」：after 后面要跟一个完整的小句子（谁 + 做什么）——After I do my homework, I watch TV。",
    examples: [
      { en: "After I do my homework, I watch TV.", zh: "我写完作业才看电视。" },
      { en: "After I eat dinner, I read a book.", zh: "我吃完晚饭看书。" },
      { en: "I go home after school.", zh: "放学后我回家。（第 9 课老句）" },
      { en: "After we clean the room, we play games.", zh: "我们打扫完房间就玩游戏。" }
    ],
    dialogue: [
      { who: "npc", en: "What do you do after school?", zh: "小美把书包放好，问你放学后都干什么。" },
      { who: "npc", en: "Do you watch TV first?", zh: "她猜你是不是先看电视。" },
      { who: "me", en: "After I do my homework, I watch TV.", zh: "轮到你说了——我写完作业才看电视。" }
    ],
    contrast: [
      {
        wrong: "After eat dinner, I watch TV.",
        wrongMark: null,
        correct: "After I eat dinner, I watch TV.",
        whyZh: "after 后面要有一整句：谁 + 做什么——After 【I】 eat dinner。光剩一个动作，句子就缺了「谁」。"
      },
      {
        wrong: "I watch TV after I do my homework.",
        wrongMark: null,
        correct: "After I do my homework, I watch TV.",
        bothRight: true,
        whyZh: "两句都对——「先做完作业」那截可以摆前面（After I do my homework, I watch TV），也可以摆后面（I watch TV after I do my homework）——先后一样、口气不同。"
      },
      {
        wrong: "After I do my homework, I watched TV.",
        wrongMark: "watched",
        correct: "After I do my homework, I watch TV.",
        whyZh: "说的都是每天常做的事，动词都用现在版：do…watch——两个动作同一档。"
      },
      {
        wrong: "I go home after school.",
        wrongMark: null,
        correct: "After I do my homework, I watch TV.",
        bothRight: true,
        whyZh: "两句都对——第 9 课 after school（放学后，后面跟一个名字）＋今天 after + 一整句：老词升级。"
      },
      {
        wrong: "I wash my hands before I eat.",
        wrongMark: null,
        correct: "After I do my homework, I watch TV.",
        bothRight: true,
        whyZh: "两句都对——before（先做的那件）和 after（后做的那件）是一对——下一课专门学它。"
      },
      {
        wrong: "It's cold today.",
        wrongMark: null,
        correct: "After I do my homework, I watch TV.",
        bothRight: true,
        whyZh: "两句都对——第 87 课短版复现：聊完天气，聊规矩。"
      }
    ],
    variants: [
      { label: "肯定", en: "After I do my homework, I watch TV.", zh: "我写完作业才看电视。", noteZh: "after + 一整句（谁+做什么）。" },
      { label: "否定", en: "After I do my homework, I don't watch TV.", zh: "我写完作业也不看电视。", noteZh: "后半句的「不」用 don't——前半句照旧。" },
      { label: "疑问", en: "Do you watch TV after you do your homework?", zh: "你写完作业看电视吗？", noteZh: "after 那截也可以摆后面——问句 Do 站句首。" }
    ],
    sceneSwings: [
      { sceneZh: "说吃完晚饭看书", en: "After I eat dinner, I read a book.", zh: "我吃完晚饭看书。" },
      { sceneZh: "说打扫完房间玩游戏", en: "After we clean the room, we play games.", zh: "我们打扫完房间就玩游戏。" },
      { sceneZh: "问对方放学后做什么", en: "What do you do after school?", zh: "你放学后做什么？" }
    ],
    deepDive: {
      title: "after 升级：从跟一个名字到跟一整句",
      paragraphs: [
        "第 9 课你学过 after school（放学后）——当时 after 后面只跟一个名字。今天它升级了：后面跟一整个小句子，谁做什么都说全——After I do my homework（我写完作业后）。",
        "为什么要有「谁」？因为英语的小句子必须站直：有主语、有动作。中文说「吃完饭后」，主语藏在话里；英语要把它请出来：After I eat dinner——那个 I 不能省。",
        "两段之间有个逗号，是分界线：逗号前是「先做的事」、逗号后是「然后做的事」——After I do my homework, I watch TV。",
        "两个动作的时态要站同一档：都是每天常做的事，就都用现在版（do…watch）。说昨天的故事，就两个都换昨天版——今天先练现在版。"
      ]
    },
    summary: {
      rule: "after 后面跟一整句（谁 + 做什么）：After I do my homework, I watch TV——逗号分先后。",
      points: [
        "After I do my homework, I watch TV. —— after + 一整句",
        "After eat dinner ❌ —— 缺了「谁」",
        "after school（第 9 课）→ after I do my homework —— 老词升级"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我写完作业才看电视。",
        before: "After",
        after: "my homework, I watch TV.",
        options: ["I do", "do", "doing"],
        answer: "I do",
        explain: "after 后面要有一整句：谁（I）+ 做什么（do）。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我写完作业才看电视。",
        tokens: ["After", "I", "do", "my", "homework,", "I", "watch", "TV."],
        answer: "After I do my homework, I watch TV.",
        explain: "两段式：先做的事（After…）+ 然后做的事（I watch TV）。"
      },
      {
        // R8 跨课复现：第 9 课（老词原形）
        kind: "arrange",
        promptZh: "先复习一小步——第 9 课学过：放学后我回家。",
        tokens: ["I", "go", "home", "after", "school."],
        answer: "I go home after school.",
        explain: "复现第 9 课：after 后面只跟一个名字——今天升级成跟一整句。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["After", "eat", "dinner,", "I", "watch", "TV."],
        wrongToken: "eat",
        answer: "eat",
        correctionZh: "要补上「谁」：After 【I】 eat dinner。",
        explain: "小句子要有主语——那个 I 不能省。"
      },
      {
        // R8 跨课复现：第 87 课（天气句）
        kind: "arrange",
        promptZh: "再对照一句——第 87 课学过：今天真冷。",
        tokens: ["It's", "cold", "today."],
        answer: "It's cold today.",
        explain: "复现第 87 课：短版天气——聊完天，聊规矩。"
      },
      {
        // R9 变形/替换：换后做的事（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「After I do my homework, I watch TV.」把「看电视」换成「读书（read a book）」，后半截怎么变？",
        replaceBase: "After I do my homework, I watch TV.",
        replaceTarget: "把 I watch TV 换成「读书」",
        options: ["I read a book.", "I reading a book.", "read a book."],
        answer: "I read a book.",
        explain: "后面那截也是完整小句子：I read a book——谁+做什么。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我写完作业才看电视。",
        tokens: ["After", "I", "do", "my", "homework,", "I", "watch", "TV."],
        distractors: ["doing"],
        answer: "After I do my homework, I watch TV."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：你写完作业看电视吗？",
        tokens: ["Do", "you", "watch", "TV", "after", "you", "do", "your", "homework?"],
        distractors: ["Does"],
        answer: "Do you watch TV after you do your homework?"
      },
      {
        promptZh: "你想说：我吃完晚饭看书。",
        tokens: ["After", "I", "eat", "dinner,", "I", "read", "a", "book."],
        distractors: ["eating"],
        answer: "After I eat dinner, I read a book."
      },
      {
        // R8 跨课复现：第 9 课原句
        promptZh: "复习第 9 课：放学后我回家。",
        tokens: ["I", "go", "home", "after", "school."],
        distractors: ["to"],
        answer: "I go home after school."
      }
    ],
    recall: {
      promptZh: "放学回到家，小美问你放学后都干什么，还猜你是不是先看电视。凭记忆，写出你那句英文。",
      intentZh: "我写完作业才看电视。",
      answer: "After I do my homework, I watch TV.",
      noteZh: "after 后面跟一整句（谁+做什么）。"
    },
    huntCaseIds: ["hunt-homework-first"]
  },

  // ── 第十四批 · L91 吃饭前先洗手（before + 小句子）：before 和 after 是一对（批十四 PRD §2）──
  {
    id: "lesson-91-before",
    number: 91,
    title: "吃饭前先洗手",
    grammarLabel: "先后 · before + 小句子",
    episode: "小美的一天 九十一",
    scene: "mansion",
    cover: cover31,
    sceneSetupZh: "聊到家里的规矩，小美说吃饭前要先洗手。",
    dialogueEn: "Before I eat, I wash my hands.",
    dialogueZh: "小美指了指洗手池。",
    intentZh: "吃饭前我先洗手。",
    targetSentence: "Before I eat, I wash my hands.",
    blocks: [
      { text: "Before I eat", role: "我吃饭前（先做的那件）" },
      { text: "I wash my hands", role: "我洗手" }
    ],
    oneLineRule: "说「做一件事之前」：before 后面也跟一整句——Before I eat, I wash my hands；before 和 after 是一对。",
    examples: [
      { en: "Before I eat, I wash my hands.", zh: "吃饭前我先洗手。" },
      { en: "Before I sleep, I read a book.", zh: "睡觉前我看会儿书。" },
      { en: "After I do my homework, I watch TV.", zh: "我写完作业才看电视。（第 90 课老句）" },
      { en: "Before we go out, we take an umbrella.", zh: "出门前我们带把伞。" }
    ],
    dialogue: [
      { who: "npc", en: "Dinner is ready!", zh: "妈妈在厨房喊。" },
      { who: "npc", en: "Wash your hands first.", zh: "她又补了一句。" },
      { who: "me", en: "Before I eat, I wash my hands.", zh: "轮到你说了——吃饭前我先洗手。" }
    ],
    contrast: [
      {
        wrong: "Before eat, I wash my hands.",
        wrongMark: "eat",
        correct: "Before I eat, I wash my hands.",
        whyZh: "before 后面也要有一整句：Before 【I】 eat——跟第 90 课 after 一个规矩。"
      },
      {
        wrong: "Before I eat I wash my hands.",
        wrongMark: null,
        correct: "Before I eat, I wash my hands.",
        whyZh: "两段之间要点个逗号：Before I eat【,】 I wash my hands——逗号是两段的分界线。"
      },
      {
        wrong: "After I do my homework, I watch TV.",
        wrongMark: null,
        correct: "Before I eat, I wash my hands.",
        bothRight: true,
        whyZh: "两句都对——after 管「做完之后」（第 90 课）、before 管「做之前」（今天）：一对好搭档。"
      },
      {
        wrong: "I wash my hands before I eat.",
        wrongMark: null,
        correct: "Before I eat, I wash my hands.",
        bothRight: true,
        whyZh: "两句都对——「先洗手」那截可以摆前面，也可以摆后面：先后一样、口气不同（跟 after 同一招）。"
      },
      {
        wrong: "It's cold today.",
        wrongMark: null,
        correct: "Before I eat, I wash my hands.",
        bothRight: true,
        whyZh: "两句都对——第 87 课短版复现：聊完天气聊规矩。"
      },
      {
        wrong: "What a nice day!",
        wrongMark: null,
        correct: "Before I eat, I wash my hands.",
        bothRight: true,
        whyZh: "两句都对——第 89 课感叹复现：这一章的话越攒越多。"
      }
    ],
    variants: [
      { label: "肯定", en: "Before I eat, I wash my hands.", zh: "吃饭前我先洗手。", noteZh: "before + 一整句（先做的那件）。" },
      { label: "否定", en: "Before I eat, I don't drink water.", zh: "吃饭前我不喝水。", noteZh: "后半句的「不」用 don't——前半句照旧。" },
      { label: "疑问", en: "Do you wash your hands before you eat?", zh: "你吃饭前洗手吗？", noteZh: "before 那截摆后面也行——问句 Do 站句首。" }
    ],
    sceneSwings: [
      { sceneZh: "说睡觉前看会儿书", en: "Before I sleep, I read a book.", zh: "睡觉前我看会儿书。" },
      { sceneZh: "说出门前带把伞", en: "Before we go out, we take an umbrella.", zh: "出门前我们带把伞。" },
      { sceneZh: "问对方饭前洗不洗手", en: "Do you wash your hands before you eat?", zh: "你吃饭前洗手吗？" }
    ],
    deepDive: {
      title: "before 和 after 这一对",
      paragraphs: [
        "before 和 after 是一对方向相反的好搭档：after 说「做完一件事之后」、before 说「做一件事之前」——同一件事，从两头看。",
        "Before I eat, I wash my hands（吃饭前先洗手）／After I eat, I read a book（吃完饭后看书）——一个管前、一个管后，两个都是「后面跟一整句」的规矩。",
        "先做的那截可以摆前面、也可以摆后面：Before I eat, I wash my hands 和 I wash my hands before I eat——先后一样。想强调「先洗手」，就把它放前面。",
        "两段之间记得点逗号——那是两段的分界线，英文里读起来会停一下，写起来也要停一下（一个逗号）。"
      ]
    },
    summary: {
      rule: "before 后面也跟一整句：Before I eat, I wash my hands——before 管前、after 管后，一对搭档。",
      points: [
        "Before I eat, I wash my hands. —— before + 一整句",
        "before（之前）／ after（之后）—— 一对方向相反",
        "逗号是分界线 —— 两段之间点一下"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：吃饭前我先洗手。",
        before: "Before",
        after: "eat, I wash my hands.",
        options: ["I", "me", "my"],
        answer: "I",
        explain: "before 后面要有一整句：谁（I）+ 做什么（eat）。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：吃饭前我先洗手。",
        tokens: ["Before", "I", "eat,", "I", "wash", "my", "hands."],
        answer: "Before I eat, I wash my hands.",
        explain: "先做的那件（Before…）+ 然后那件（I wash my hands）。"
      },
      {
        // R8 跨课复现：第 90 课（after 一对）
        kind: "arrange",
        promptZh: "先复习一小步——第 90 课学过：我写完作业才看电视。",
        tokens: ["After", "I", "do", "my", "homework,", "I", "watch", "TV."],
        answer: "After I do my homework, I watch TV.",
        explain: "复现第 90 课：after 管「之后」——今天学它的搭档 before。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["Before", "eat,", "I", "wash", "my", "hands."],
        wrongToken: "eat,",
        answer: "eat,",
        correctionZh: "要补上「谁」：Before 【I】 eat。",
        explain: "小句子要有主语——跟 after 一个规矩。"
      },
      {
        // R8 跨课复现：第 89 课（感叹）
        kind: "arrange",
        promptZh: "再对照一句——第 89 课学过：多好的天啊！",
        tokens: ["What", "a", "nice", "day!"],
        answer: "What a nice day!",
        explain: "复现第 89 课：感叹的架子——今天学先后。"
      },
      {
        // R9 变形/替换：前换后（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「Before I eat, I wash my hands.」把「之前」换成「之后」（吃完饭后看书），领头词要怎么换？",
        replaceBase: "Before I eat, I wash my hands.",
        replaceTarget: "换成「吃完饭后看书」的意思",
        options: ["After I eat, I read a book.", "Before I eat, I read a book.", "After I eat, I wash my hands."],
        answer: "After I eat, I read a book.",
        explain: "方向反过来：After I eat, I read a book——before 换 after、动作也跟着换。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：吃饭前我先洗手。",
        tokens: ["Before", "I", "eat,", "I", "wash", "my", "hands."],
        distractors: ["me"],
        answer: "Before I eat, I wash my hands."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：你吃饭前洗手吗？",
        tokens: ["Do", "you", "wash", "your", "hands", "before", "you", "eat?"],
        distractors: ["Does"],
        answer: "Do you wash your hands before you eat?"
      },
      {
        promptZh: "你想说：睡觉前我看会儿书。",
        tokens: ["Before", "I", "sleep,", "I", "read", "a", "book."],
        distractors: ["sleeping"],
        answer: "Before I sleep, I read a book."
      },
      {
        // R8 跨课复现：第 90 课原句
        promptZh: "复习第 90 课：我写完作业才看电视。",
        tokens: ["After", "I", "do", "my", "homework,", "I", "watch", "TV."],
        distractors: ["doing"],
        answer: "After I do my homework, I watch TV."
      }
    ],
    recall: {
      promptZh: "开饭了，妈妈让你先洗手。凭记忆，写出你回答的那句英文。",
      intentZh: "吃饭前我先洗手。",
      answer: "Before I eat, I wash my hands.",
      noteZh: "before + 一整句——先做的那件放前面。"
    },
    huntCaseIds: ["hunt-before-dinner"]
  },

  // ── 第十四批 · L92 天晴的时候我跑步（when 从句转正）：L78 认读升级＋L27 疑问 when 同形对照（批十四 PRD §2）──
  {
    id: "lesson-92-when",
    number: 92,
    title: "天晴的时候我跑步",
    grammarLabel: "什么时候 · when + 小句子",
    episode: "小美的一天 九十二",
    scene: "campus",
    cover: cover32,
    sceneSetupZh: "聊到常做的事，小美说天晴的时候她就去跑步。",
    dialogueEn: "When it is sunny, I run.",
    dialogueZh: "小美看了看操场的跑道。",
    intentZh: "天晴的时候我跑步。",
    targetSentence: "When it is sunny, I run.",
    blocks: [
      { text: "When it is sunny", role: "天晴的时候（一整句）" },
      { text: "I run", role: "我跑步" }
    ],
    oneLineRule: "说「当…的时候」：when 也领一整句——When it is sunny, I run；它跟 after/before 是同一个三人组（后面都跟一整句）。",
    examples: [
      { en: "When it is sunny, I run.", zh: "天晴的时候我跑步。" },
      { en: "When I am tired, I go to bed early.", zh: "我累的时候就早点睡。" },
      { en: "When it is sunny, I run in the park.", zh: "天晴的时候我在公园跑步。（第 78 课老句）" },
      { en: "When do you run?", zh: "你什么时候跑步？（问句）" }
    ],
    dialogue: [
      { who: "npc", en: "You look great!", zh: "小美看着你，笑着问你有什么秘诀。" },
      { who: "npc", en: "Do you run every day?", zh: "她朝跑道努了努嘴。" },
      { who: "me", en: "When it is sunny, I run.", zh: "轮到你说了——天晴的时候我跑步。" }
    ],
    contrast: [
      {
        wrong: "When is sunny, I run.",
        wrongMark: "is",
        correct: "When it is sunny, I run.",
        whyZh: "小句子要有「谁」：When 【it】 is sunny——那个 it 是天气句的老座位（第 6 课）。"
      },
      {
        wrong: "When it is sunny I run.",
        wrongMark: null,
        correct: "When it is sunny, I run.",
        whyZh: "两段之间点个逗号：When it is sunny【,】 I run——跟 after/before 一个规矩。"
      },
      {
        wrong: "When do you run?",
        wrongMark: null,
        correct: "When it is sunny, I run.",
        bothRight: true,
        whyZh: "两句都对——When 有两班岗：站句首问「什么时候」（第 27 课）、在句子里说「当…的时候」（今天）——看它在问还是在说。"
      },
      {
        wrong: "After I do my homework, I watch TV.",
        wrongMark: null,
        correct: "When it is sunny, I run.",
        bothRight: true,
        whyZh: "两句都对——after（之后）＋when（当…时候）：先后三人组排排站。"
      },
      {
        wrong: "Before I eat, I wash my hands.",
        wrongMark: null,
        correct: "When it is sunny, I run.",
        bothRight: true,
        whyZh: "两句都对——before（之前）复现：三人组今天到齐（after/before/when）。"
      },
      {
        wrong: "It's a nice day.",
        wrongMark: null,
        correct: "When it is sunny, I run.",
        bothRight: true,
        whyZh: "两句都对——第 89 课陈述句复现：天气好，正好跑步。"
      }
    ],
    variants: [
      { label: "肯定", en: "When it is sunny, I run.", zh: "天晴的时候我跑步。", noteZh: "when + 一整句（当…的时候）。" },
      { label: "否定", en: "When it is rainy, I don't run.", zh: "下雨的时候我不跑。", noteZh: "后半句的「不」用 don't——前半句照旧。" },
      { label: "疑问", en: "When do you run?", zh: "你什么时候跑步？", noteZh: "When 站句首问「什么时候」——第 27 课的疑问岗。" }
    ],
    sceneSwings: [
      { sceneZh: "说我累了就早点睡", en: "When I am tired, I go to bed early.", zh: "我累的时候就早点睡。" },
      { sceneZh: "说天晴时在公园跑步", en: "When it is sunny, I run in the park.", zh: "天晴的时候我在公园跑步。" },
      { sceneZh: "问对方什么时候跑步", en: "When do you run?", zh: "你什么时候跑步？" }
    ],
    deepDive: {
      title: "when 的两班岗",
      paragraphs: [
        "when 有两班岗：第一班站句首问「什么时候」——When do you run?（第 27 课学的疑问岗）；第二班在句子里领一个「当…的时候」——When it is sunny, I run（今天的连词岗）。",
        "怎么分？看它有没有在问。句尾带问号、前头站着 do/is 的，是问句；句子里讲「每当这个时候就怎样」的，是连词——两班岗长得一样，心思不同。",
        "先后三人组今天到齐：after（做完之后）、before（做之前）、when（当…的时候）——三个都是「后面跟一整句」，规矩一样。",
        "第 78 课你见过 When it is sunny, I run in the park（当时只是认读）——今天它转正了：会自己说，还会分清两班岗。"
      ]
    },
    summary: {
      rule: "when 领一整句说「当…的时候」：When it is sunny, I run——它和 after/before 是先后三人组。",
      points: [
        "When it is sunny, I run. —— when 的连词岗",
        "When do you run? —— when 的疑问岗（第 27 课）",
        "after / before / when —— 先后三人组到齐"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：天晴的时候我跑步。",
        before: "When",
        after: "sunny, I run.",
        options: ["it is", "is", "it"],
        answer: "it is",
        explain: "小句子要有「谁」和搭档：When it is sunny。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：天晴的时候我跑步。",
        tokens: ["When", "it", "is", "sunny,", "I", "run."],
        answer: "When it is sunny, I run.",
        explain: "when + 一整句 + 逗号 + 主句。"
      },
      {
        // R8 跨课复现：第 78 课（老句）
        kind: "arrange",
        promptZh: "先复习一小步——第 78 课听过：天晴的时候我在公园跑步。",
        tokens: ["When", "it", "is", "sunny,", "I", "run", "in", "the", "park."],
        answer: "When it is sunny, I run in the park.",
        explain: "复现第 78 课：老句子——今天正式转正。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["When", "is", "sunny,", "I", "run."],
        wrongToken: "is",
        answer: "is",
        correctionZh: "要补上「谁」：When 【it】 is sunny。",
        explain: "天气句的老座位 it 不能缺。"
      },
      {
        // R8 跨课复现：第 27 课（疑问 when 对照）
        kind: "arrange",
        promptZh: "再对照一句——第 27 课学过：你的生日是什么时候？",
        tokens: ["When", "is", "your", "birthday?"],
        answer: "When is your birthday?",
        explain: "复现第 27 课：When 的疑问岗——今天认识它的连词岗。"
      },
      {
        // R9 变形/替换：换条件（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「When it is sunny, I run.」把「天晴」换成「我累了」（tired），前半截怎么变？",
        replaceBase: "When it is sunny, I run.",
        replaceTarget: "把 it is sunny 换成「我累了」",
        options: ["When I am tired,", "When is tired,", "When I tired,"],
        answer: "When I am tired,",
        explain: "换个人称换搭档：When I am tired——谁累、配 am。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：天晴的时候我跑步。",
        tokens: ["When", "it", "is", "sunny,", "I", "run."],
        distractors: ["sun"],
        answer: "When it is sunny, I run."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：你什么时候跑步？",
        tokens: ["When", "do", "you", "run?"],
        distractors: ["Does"],
        answer: "When do you run?"
      },
      {
        promptZh: "你想说：我累的时候就早点睡。",
        tokens: ["When", "I", "am", "tired,", "I", "go", "to", "bed", "early."],
        distractors: ["tiring"],
        answer: "When I am tired, I go to bed early."
      },
      {
        // R8 跨课复现：第 91 课原句
        promptZh: "复习第 91 课：吃饭前我先洗手。",
        tokens: ["Before", "I", "eat,", "I", "wash", "my", "hands."],
        distractors: ["me"],
        answer: "Before I eat, I wash my hands."
      }
    ],
    recall: {
      promptZh: "小美问你跑步有什么秘诀。凭记忆，写出你那句英文。",
      intentZh: "天晴的时候我跑步。",
      answer: "When it is sunny, I run.",
      noteZh: "when + 一整句——跟 after/before 一个规矩。"
    },
    huntCaseIds: ["hunt-sunny-run"]
  },

  // ── 第十四批 · L93 我从前常在这儿玩（used to + 原形）：从前常这样、现在不这样（批十四 PRD §2）──
  {
    id: "lesson-93-used-to",
    number: 93,
    title: "我从前常在这儿玩",
    grammarLabel: "从前常这样 · used to",
    episode: "小美的一天 九十三",
    scene: "campus",
    cover: cover18,
    sceneSetupZh: "站在校门口的老操场边说，小美说从前她常在这儿玩。",
    dialogueEn: "I used to play here.",
    dialogueZh: "小美望着老操场，笑了笑。",
    intentZh: "我从前常在这儿玩。",
    targetSentence: "I used to play here.",
    blocks: [
      { text: "I used to", role: "我从前常（现在不这样了）" },
      { text: "play here", role: "在这儿玩（动作穿原样）" }
    ],
    oneLineRule: "说「从前常这样、现在不这样了」用 used to——后面跟原形：I used to play here。",
    examples: [
      { en: "I used to play here.", zh: "我从前常在这儿玩。" },
      { en: "She used to live in Beijing.", zh: "她从前住在北京。" },
      { en: "We used to walk to school.", zh: "我们从前走路去上学。" },
      { en: "I play here every day.", zh: "我每天都在这儿玩。（现在）" }
    ],
    dialogue: [
      { who: "npc", en: "This playground is old.", zh: "小美望着老操场。" },
      { who: "npc", en: "Do you come here often?", zh: "她问你现在常不常来。" },
      { who: "me", en: "I used to play here.", zh: "轮到你说了——我从前常在这儿玩。" }
    ],
    contrast: [
      {
        wrong: "I use to play here.",
        wrongMark: "use",
        correct: "I used to play here.",
        whyZh: "used to 的尾巴上有个 d，不能丢：I 【used】 to play——丢了这个 d，就变成「用」了。"
      },
      {
        wrong: "I used to playing here.",
        wrongMark: "playing",
        correct: "I used to play here.",
        whyZh: "used to 后面跟原形：play——不穿 -ing 外套（跟 want to travel 一个规矩）。"
      },
      {
        wrong: "I play here every day.",
        wrongMark: null,
        correct: "I used to play here.",
        bothRight: true,
        whyZh: "两句都对——「现在每天都在玩」（I play here every day）和「从前常玩、现在不这样了」（I used to play here）：现在和从前的两句话。"
      },
      {
        wrong: "Yesterday I went to the park.",
        wrongMark: null,
        correct: "I used to play here.",
        bothRight: true,
        whyZh: "两句都对——第 10 课「昨天去了一次」（went）＋今天「从前常常」（used to）：一次 vs 常常，两条说过去的路。"
      },
      {
        wrong: "He drinks milk every day.",
        wrongMark: null,
        correct: "I used to play here.",
        bothRight: true,
        whyZh: "两句都对——第 25 课三单 -s（每天的习惯）＋今天 used to（从前的习惯）：习惯句两兄弟。"
      },
      {
        wrong: "When it is sunny, I run.",
        wrongMark: null,
        correct: "I used to play here.",
        bothRight: true,
        whyZh: "两句都对——第 92 课 when（当…时候）复现：这一章的说法越来越全。"
      }
    ],
    variants: [
      { label: "肯定", en: "I used to play here.", zh: "我从前常在这儿玩。", noteZh: "used to + 原形——尾巴 d 不丢。" },
      { label: "否定", en: "I didn't use to play here.", zh: "我从前不常在这儿玩。", noteZh: "「不」用 didn't——这时 use 反而不带 d（跟着 didn't 走）。" },
      { label: "疑问", en: "Did you use to play here?", zh: "你从前常在这儿玩吗？", noteZh: "问句 Did 站句首——use 也不带 d。" }
    ],
    sceneSwings: [
      { sceneZh: "说她从前住在北京", en: "She used to live in Beijing.", zh: "她从前住在北京。" },
      { sceneZh: "说我们从前走路去上学", en: "We used to walk to school.", zh: "我们从前走路去上学。" },
      { sceneZh: "问对方从前常不常在这儿玩", en: "Did you use to play here?", zh: "你从前常在这儿玩吗？" }
    ],
    deepDive: {
      title: "used to：从前和现在的对比",
      paragraphs: [
        "used to 说的是「从前常这样、现在不这样了」——它自带一条时间线：I used to play here（从前常在这儿玩，现在不玩了）。",
        "后面跟原形：used to play（不穿 -ing、不穿 -ed）——跟 want to travel、Let me help 一个规矩：to 后面永远穿原样。",
        "那条小尾巴要留意：说「从前常」是 used to（带 d）；说「从前不常」「从前常吗」时，d 跑到前面的 didn't/Did 里去了——I didn't use to play／Did you use to play（这时 use 不带 d）。",
        "和「昨天去了一次」的 went 比一比：went 说「那次去了」；used to 说「从前常常」——一次 vs 常常，两条说过去的路，你都拿到了。"
      ]
    },
    summary: {
      rule: "说「从前常这样、现在不这样」：used to + 原形（I used to play here）——尾巴 d 不丢。",
      points: [
        "I used to play here. —— 从前常常",
        "I play here every day. —— 现在每天（对比）",
        "didn't use to ／ Did you use to…? —— d 跟着前面的帮手走"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我从前常在这儿玩。",
        before: "I",
        after: "play here.",
        options: ["used to", "use to", "used"],
        answer: "used to",
        explain: "尾巴上要有 d：used to——不能丢。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我从前常在这儿玩。",
        tokens: ["I", "used", "to", "play", "here."],
        answer: "I used to play here.",
        explain: "used to + 原形：play here。"
      },
      {
        // R8 跨课复现：第 10 课（昨天版对照）
        kind: "arrange",
        promptZh: "先复习一小步——第 10 课学过：昨天我去了公园。",
        tokens: ["Yesterday", "I", "went", "to", "the", "park."],
        answer: "Yesterday I went to the park.",
        explain: "复现第 10 课：「昨天去了一次」——今天学「从前常常」。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "use", "to", "play", "here."],
        wrongToken: "use",
        answer: "use",
        correctionZh: "尾巴上补个 d：I 【used】 to play here。",
        explain: "丢了 d 就变成「用」了。"
      },
      {
        // R8 跨课复现：第 25 课（习惯句）
        kind: "arrange",
        promptZh: "再对照一句——第 25 课学过：他每天喝牛奶。",
        tokens: ["He", "drinks", "milk", "every", "day."],
        answer: "He drinks milk every day.",
        explain: "复现第 25 课：现在的习惯（每天）——今天学从前的习惯。"
      },
      {
        // R9 变形/替换：换动作（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I used to play here.」把「玩」换成「住（live）」，后半截怎么变？",
        replaceBase: "I used to play here.",
        replaceTarget: "把 play here 换成「住在北京」",
        options: ["live in Beijing", "living in Beijing", "lived in Beijing"],
        answer: "live in Beijing",
        explain: "used to 后面跟原形：live——不穿 -ing、不穿 -ed。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我从前常在这儿玩。",
        tokens: ["I", "used", "to", "play", "here."],
        distractors: ["use"],
        answer: "I used to play here."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：你从前常在这儿玩吗？",
        tokens: ["Did", "you", "use", "to", "play", "here?"],
        distractors: ["used"],
        answer: "Did you use to play here?"
      },
      {
        promptZh: "你想说：她从前住在北京。",
        tokens: ["She", "used", "to", "live", "in", "Beijing."],
        distractors: ["living"],
        answer: "She used to live in Beijing."
      },
      {
        // R8 跨课复现：第 10 课原句
        promptZh: "复习第 10 课：昨天我去了公园。",
        tokens: ["Yesterday", "I", "went", "to", "the", "park."],
        distractors: ["go"],
        answer: "Yesterday I went to the park."
      }
    ],
    recall: {
      promptZh: "站在校门口的老操场边，小美问你从前常不常在这儿玩。凭记忆，写出你那句英文。",
      intentZh: "我从前常在这儿玩。",
      answer: "I used to play here.",
      noteZh: "used to + 原形——尾巴 d 不丢。"
    },
    huntCaseIds: ["hunt-old-playground"]
  },

  // ── 第十四批 · L94 校门口聊两句（收口 · 零新知全复现）：从见面到再见——大章收口（批十四 PRD §2）──
  {
    id: "lesson-94-gate-talk",
    number: 94,
    title: "校门口聊两句",
    grammarLabel: "收口 · 大团圆（零新知）",
    episode: "小美的一天 九十四",
    scene: "school",
    cover: cover10,
    sceneSetupZh: "开学第一天早上，从校门口见面到再见——把这一章的话串成一次完整聊天。",
    dialogueEn: "It's cold today. What a nice day!",
    dialogueZh: "小美搓着手过来，风一停又抬头看天。",
    intentZh: "今天真冷。多好的天啊！",
    targetSentence: "It's cold today. What a nice day!",
    blocks: [
      { text: "It's cold today.", role: "今天真冷（短版合体）" },
      { text: "What a nice day!", role: "多好的天啊（感叹）" }
    ],
    oneLineRule: "把这一章的话串成一次聊天：见面说天气（It's cold）、看天感叹（What a nice day!）、聊规矩（After I…）、说从前（I used to…）——一句接一句。",
    examples: [
      { en: "It's cold today.", zh: "今天真冷。" },
      { en: "What a nice day!", zh: "多好的天啊！" },
      { en: "After I do my homework, I watch TV.", zh: "我写完作业才看电视。" },
      { en: "I used to play here.", zh: "我从前常在这儿玩。" }
    ],
    dialogue: [
      { who: "npc", en: "Morning! It's cold today.", zh: "校门口，小美搓着手过来。" },
      { who: "npc", en: "Oh — the wind stops. What a nice day!", zh: "风一停，她抬头看天。" },
      { who: "me", en: "It's cold today. What a nice day!", zh: "轮到你说了——今天真冷，多好的天啊！" }
    ],
    contrast: [
      {
        wrong: "What nice day!",
        wrongMark: null,
        correct: "What a nice day!",
        whyZh: "第 89 课回流：a 不能丢——What 【a】 nice day!"
      },
      {
        wrong: "After eat dinner, I watch TV.",
        wrongMark: "eat",
        correct: "After I eat dinner, I watch TV.",
        whyZh: "第 90 课回流：after 后面要有一整句——那个 I 不能省。"
      },
      {
        wrong: "I use to play here.",
        wrongMark: "use",
        correct: "I used to play here.",
        whyZh: "第 93 课回流：尾巴上要有 d——I 【used】 to play。"
      },
      {
        wrong: "It is cold today.",
        wrongMark: null,
        correct: "It's cold today.",
        bothRight: true,
        whyZh: "两句都对——长版（It is cold）和短版（It's cold）都在：先说长的，再说短的。"
      },
      {
        wrong: "When it is sunny, I run.",
        wrongMark: null,
        correct: "After I do my homework, I watch TV.",
        bothRight: true,
        whyZh: "两句都对——第 92 课 when（当…时候）＋第 90 课 after（之后）：先后三人组各回一句。"
      },
      {
        wrong: "It's windy today.",
        wrongMark: null,
        correct: "What a nice day!",
        bothRight: true,
        whyZh: "两句都对——第 88 课 windy（刮风）＋第 89 课感叹：风停日出，聊得越来越顺。"
      }
    ],
    variants: [
      { label: "肯定", en: "It's cold today. What a nice day!", zh: "今天真冷。多好的天啊！", noteZh: "两句连着说：先天气、再感叹。" },
      { label: "否定", en: "It's not a nice day.", zh: "今天天不好。", noteZh: "not 跟 is 走——反过来说也行。" },
      { label: "疑问", en: "Do you play here after school?", zh: "放学后你在这儿玩吗？", noteZh: "问句 Do 站句首——after school 的老搭配。" }
    ],
    sceneSwings: [
      { sceneZh: "感叹一个好包（第 68 课老句）", en: "What a nice bag!", zh: "多好的包啊！" },
      { sceneZh: "说写完作业才看电视（第 90 课老句）", en: "After I do my homework, I watch TV.", zh: "我写完作业才看电视。" },
      { sceneZh: "说从前常在这儿玩（第 93 课老句）", en: "I used to play here.", zh: "我从前常在这儿玩。" }
    ],
    deepDive: {
      title: "大章倒带：聊两句的本事",
      paragraphs: [
        "这一章八课，你学会了「聊两句」的一整套：见面说天气（It's cold——短版合体）、换着词说天气（windy／snowy／cloudy——名词穿 -y 外套）、看天感叹（What a nice day!）、聊规矩说先后（After I…／Before I…／When it is…）、说从前（I used to…）。",
        "这一章的句子有个共同点：都能在「校门口见面」这个场景里用上——先打招呼聊天气、再说说自己的规矩、走着走着聊起从前。八课的话，一次聊完。",
        "先后三人组（after／before／when）是你这一章最新拿到的工具：以后讲故事、说安排，全靠它们把两件事串起来。",
        "最后看一句老朋友的感叹：What a nice bag!（第 68 课）——当时它只是一句台词，这一章里它变成了你自己的话（第 89 课）。从听到说，就是这八课走的路。"
      ]
    },
    summary: {
      rule: "聊两句的本事：说天气（It's cold／windy）＋ 感叹（What a…!）＋ 说先后（after／before／when）＋ 说从前（used to）。",
      points: [
        "It's cold today. What a nice day! —— 两句连着说",
        "After I…／Before I…／When it is… —— 先后三人组",
        "I used to play here. —— 说从前"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想感叹：多好的天啊！",
        before: "What",
        after: " day!",
        options: ["a nice", "nice", "nice a"],
        answer: "a nice",
        explain: "第 89 课老规矩：a 站形容词前面——What a nice day!"
      },
      {
        kind: "arrange",
        promptZh: "你想说：今天真冷。",
        tokens: ["It's", "cold", "today."],
        answer: "It's cold today.",
        explain: "第 87 课短版：It's——尾巴带撇。"
      },
      {
        // R8 跨课复现：第 93 课（说从前）
        kind: "arrange",
        promptZh: "先复习一小步——第 93 课学过：我从前常在这儿玩。",
        tokens: ["I", "used", "to", "play", "here."],
        answer: "I used to play here.",
        explain: "复现第 93 课：说从前——尾巴 d 不丢。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["What", "nice", "day!"],
        wrongToken: "nice",
        answer: "nice",
        correctionZh: "a 不能丢：What 【a】 nice day!",
        explain: "第 89 课老规矩。"
      },
      {
        // R8 跨课复现：第 90 课（说先后）
        kind: "arrange",
        promptZh: "再对照一句——第 90 课学过：我写完作业才看电视。",
        tokens: ["After", "I", "do", "my", "homework,", "I", "watch", "TV."],
        answer: "After I do my homework, I watch TV.",
        explain: "复现第 90 课：after + 一整句——先后三人组老大。"
      },
      {
        // R9 变形/替换：换说法（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「It's cold today.」把「冷」换成「刮风（windy）」，天气词怎么变？",
        replaceBase: "It's cold today.",
        replaceTarget: "把 cold 换成 windy",
        options: ["It's windy today.", "It's wind today.", "It windy today."],
        answer: "It's windy today.",
        explain: "第 88 课老规矩：wind 穿 -y 外套——It's windy today。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：今天真冷。",
        tokens: ["It's", "cold", "today."],
        distractors: ["Its"],
        answer: "It's cold today."
      },
      {
        // R06 变体扩量：与 variants 否定卡逐字一致的否定变体题
        promptZh: "你想说：今天天不好。",
        tokens: ["It's", "not", "a", "nice", "day."],
        distractors: ["no"],
        answer: "It's not a nice day."
      },
      {
        // R8 跨课复现：第 89 课原句
        promptZh: "复习第 89 课：多好的天啊！",
        tokens: ["What", "a", "nice", "day!"],
        distractors: ["nice a"],
        answer: "What a nice day!"
      },
      {
        // 章末收官惯例：复现第 91 课原句
        promptZh: "全批收官——复习第 91 课：吃饭前我先洗手。",
        tokens: ["Before", "I", "eat,", "I", "wash", "my", "hands."],
        distractors: ["me"],
        answer: "Before I eat, I wash my hands."
      }
    ],
    recall: {
      promptZh: "开学第一天早上，校门口风一停，小美抬头看天。凭记忆，写出她那句感叹。",
      intentZh: "多好的天啊！",
      answer: "What a nice day!",
      noteZh: "What + a + 形容词 + 东西——a 不能丢。"
    },
    huntCaseIds: ["hunt-after-school-talk"]
  },

  // ── 第十五批 · L95 那时我正在看书（was + 穿 -ing）：昨天版的「正在」——L34 平台升级（批十五 PRD §2·单拱第一课）──
  {
    id: "lesson-95-was-doing",
    number: 95,
    title: "那时我正在看书",
    grammarLabel: "那时正做着 · was + 穿 -ing",
    episode: "小美的一天 九十五",
    scene: "campus",
    cover: cover13,
    sceneSetupZh: "回想昨晚八点自己在做什么——昨天那个电话的故事开场。",
    dialogueEn: "I was reading at eight.",
    dialogueZh: "小美托着腮想了想昨晚。",
    intentZh: "八点的时候我正在看书。",
    targetSentence: "I was reading at eight.",
    blocks: [
      { text: "I was", role: "我那时（昨天版搭档）" },
      { text: "reading", role: "正在看书（-ing 外套）" },
      { text: "at eight", role: "八点的时候" }
    ],
    oneLineRule: "说「那时正做着」：be 换成昨天版 was/were，动作照穿 -ing 外套——I was reading at eight。",
    examples: [
      { en: "I was reading at eight.", zh: "八点的时候我正在看书。" },
      { en: "I was drawing at three.", zh: "三点时我正在画画。" },
      { en: "She was reading last night.", zh: "昨晚她正在看书。" },
      { en: "They were playing football.", zh: "他们当时正在踢足球。" }
    ],
    dialogue: [
      { who: "npc", en: "What were you doing last night?", zh: "小美托着腮问你。" },
      { who: "npc", en: "At eight, I mean.", zh: "她补了一句：就八点那会儿。" },
      { who: "me", en: "I was reading at eight.", zh: "轮到你说了——八点的时候我正在看书。" }
    ],
    contrast: [
      {
        wrong: "I was read at eight.",
        wrongMark: "read",
        correct: "I was reading at eight.",
        whyZh: "动作没穿 -ing 外套：was 后面要跟 reading——「那时正做着」，外套不能脱。"
      },
      {
        wrong: "I read at eight.",
        wrongMark: "read",
        correct: "I was reading at eight.",
        whyZh: "丢掉了「那时正做着」：光说 read 是「读了」（一件事），要加 was + -ing 才是「当时正做着」。"
      },
      {
        wrong: "I was drawing at three.",
        wrongMark: null,
        correct: "I was reading at eight.",
        bothRight: true,
        whyZh: "两句都对——第 34 课的老句（三点正在画画）＋今天换个钟点：同一套说法，随你换。"
      },
      {
        wrong: "She was reading last night.",
        wrongMark: null,
        correct: "I was reading at eight.",
        bothRight: true,
        whyZh: "两句都对——第 34 课的老句复现：她昨晚在看、我八点在读——「那时正做着」越用越顺。"
      },
      {
        wrong: "Yesterday I went to the park.",
        wrongMark: null,
        correct: "I was reading at eight.",
        bothRight: true,
        whyZh: "两句都对——第 10 课「昨天去了」（一件事）＋今天「那时正做着」：两条说过去的路。"
      },
      {
        wrong: "What were you doing?",
        wrongMark: null,
        correct: "I was reading at eight.",
        bothRight: true,
        whyZh: "两句都对——第 34 课问句（你那时在干嘛）＋今天的答句：一问一答配套。"
      }
    ],
    variants: [
      { label: "肯定", en: "I was reading at eight.", zh: "八点的时候我正在看书。", noteZh: "was + 穿 -ing。" },
      { label: "否定", en: "I was not reading at eight.", zh: "八点那会儿我没在看书。", noteZh: "not 跟 was 走。" },
      { label: "疑问", en: "Were you reading at eight?", zh: "八点你在看书吗？", noteZh: "Were 搬句首——问对方那时在干嘛。" }
    ],
    sceneSwings: [
      { sceneZh: "说三点时正在画画", en: "I was drawing at three.", zh: "三点时我正在画画。" },
      { sceneZh: "说他们当时正在踢足球", en: "They were playing football.", zh: "他们当时正在踢足球。" },
      { sceneZh: "问对方八点在不在看书", en: "Were you reading at eight?", zh: "八点你在看书吗？" }
    ],
    deepDive: {
      title: "昨天版的「正在」",
      paragraphs: [
        "第 34 课你学过「昨天某时正在做」：I was drawing at three（三点时我正在画画）——be 用昨天版（was/were），动作照穿 -ing 外套。今天把它拿来做主菜。",
        "两个零件缺一不可：昨天版搭档（was/were）＋穿 -ing 的动作。少了外套（I was read）错、少了搭档（I reading）也错——合体才成立。",
        "一个用 was、一伙用 were：I was reading（一个）／They were playing（一群）——第 51 课学过的配对，这里照样管用。",
        "跟「昨天去了」比一比：I went to the park（去了一趟，一件事做完）／I was reading at eight（那时正做着，画面停在那一刻）——两条说过去的路，今天走这条「画面」路。"
      ]
    },
    summary: {
      rule: "说「那时正做着」：was/were + 穿 -ing 的动作（I was reading at eight）——两个零件缺一不可。",
      points: [
        "I was reading at eight. —— 昨天版搭档 + -ing 外套",
        "I was read ❌ ／ I read ❌ —— 少外套、少搭档都不行",
        "They were playing. —— 一伙人用 were"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：八点的时候我正在看书。",
        before: "I",
        after: "at eight.",
        options: ["was reading", "was read", "read"],
        answer: "was reading",
        explain: "昨天版搭档（was）+ 穿 -ing 的动作（reading）：两个零件。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：八点的时候我正在看书。",
        tokens: ["I", "was", "reading", "at", "eight."],
        answer: "I was reading at eight.",
        explain: "was + reading：昨天版「正在」。"
      },
      {
        // R8 跨课复现：第 34 课（平台老句）
        kind: "arrange",
        promptZh: "先复习一小步——第 34 课学过：三点时我正在画画。",
        tokens: ["I", "was", "drawing", "at", "three."],
        answer: "I was drawing at three.",
        explain: "复现第 34 课：老句——今天换个钟点接着说。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "was", "read", "at", "eight."],
        wrongToken: "read",
        answer: "read",
        correctionZh: "动作要穿 -ing 外套：was 【reading】 at eight。",
        explain: "「那时正做着」——外套不能脱。"
      },
      {
        // R8 跨课复现：第 10 课（昨天版对照）
        kind: "arrange",
        promptZh: "再对照一句——第 10 课学过：昨天我去了公园。",
        tokens: ["Yesterday", "I", "went", "to", "the", "park."],
        answer: "Yesterday I went to the park.",
        explain: "复现第 10 课：「去了一趟」——对照今天的「那时正做着」。"
      },
      {
        // R9 变形/替换：换人称（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I was reading at eight.」把 I 换成 They（一伙人），搭档要怎么变？",
        replaceBase: "I was reading at eight.",
        replaceTarget: "把 I 换成 They",
        options: ["were", "was", "are"],
        answer: "were",
        explain: "一伙人用 were：They were reading——配对照旧。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：八点的时候我正在看书。",
        tokens: ["I", "was", "reading", "at", "eight."],
        distractors: ["read"],
        answer: "I was reading at eight."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：八点你在看书吗？",
        tokens: ["Were", "you", "reading", "at", "eight?"],
        distractors: ["Was"],
        answer: "Were you reading at eight?"
      },
      {
        // 保障句（cloze 落 were）
        promptZh: "你想说：他们当时正在踢足球。",
        tokens: ["They", "were", "playing", "football."],
        distractors: ["was"],
        answer: "They were playing football."
      },
      {
        // R8 跨课复现：第 10 课原句
        promptZh: "复习第 10 课：昨天我去了公园。",
        tokens: ["Yesterday", "I", "went", "to", "the", "park."],
        distractors: ["go"],
        answer: "Yesterday I went to the park."
      }
    ],
    recall: {
      promptZh: "小美问你昨晚八点在做什么。凭记忆，写出你那句英文。",
      intentZh: "八点的时候我正在看书。",
      answer: "I was reading at eight.",
      noteZh: "was + 穿 -ing：两个零件缺一不可。"
    },
    huntCaseIds: ["hunt-eight-reading"]
  },

  // ── 第十五批 · L96 当时正下着雨（背景句）：天气句的昨天版——L34 伏笔兑现（批十五 PRD §2）──
  {
    id: "lesson-96-was-raining",
    number: 96,
    title: "当时正下着雨",
    grammarLabel: "背景句 · It was + 穿 -ing",
    episode: "小美的一天 九十六",
    scene: "city",
    cover: cover14,
    sceneSetupZh: "故事第二句：那天晚上，外面正下着雨，窗上全是水。",
    dialogueEn: "It was raining that night.",
    dialogueZh: "小美指了指窗玻璃上的水痕。",
    intentZh: "那天晚上正下着雨。",
    targetSentence: "It was raining.",
    blocks: [
      { text: "It was", role: "它那时（昨天版）" },
      { text: "raining", role: "正在下雨（-ing 外套）" }
    ],
    oneLineRule: "天气句的昨天版：It was raining——今天版说今天（It is raining），昨天版说那天。",
    examples: [
      { en: "It was raining.", zh: "当时正下着雨。" },
      { en: "It is raining.", zh: "现在正下着雨。" },
      { en: "It was cold that night.", zh: "那天晚上很冷。" },
      { en: "It's cold today.", zh: "今天真冷。" }
    ],
    dialogue: [
      { who: "npc", en: "What was the weather like that night?", zh: "小美望着窗外问你。" },
      { who: "npc", en: "Look at the window!", zh: "她指了指窗玻璃上的水痕。" },
      { who: "me", en: "It was raining.", zh: "轮到你说了——当时正下着雨。" }
    ],
    contrast: [
      {
        wrong: "It was rain.",
        wrongMark: "rain",
        correct: "It was raining.",
        whyZh: "动作没穿 -ing 外套：was 后面要跟 raining——雨是「正在下」的样子。"
      },
      {
        wrong: "It rains yesterday.",
        wrongMark: "rains",
        correct: "It was raining.",
        whyZh: "yesterday 在场，动词要换昨天版：光用 rains 是「天天下雨」的口气，说那天要用 was raining。"
      },
      {
        wrong: "It is raining.",
        wrongMark: null,
        correct: "It was raining.",
        bothRight: true,
        whyZh: "两句都对——今天版（It is raining，现在正下）和昨天版（It was raining，那天正下）：同一场雨的两个版本。"
      },
      {
        wrong: "It was windy, but we were happy.",
        wrongMark: null,
        correct: "It was raining.",
        bothRight: true,
        whyZh: "两句都对——第 19 课的老句子（起风了，但我们很开心）——那时版天气的老熟人。"
      },
      {
        wrong: "It's cold today.",
        wrongMark: null,
        correct: "It was raining.",
        bothRight: true,
        whyZh: "两句都对——第 87 课今天版（今天真冷）＋今天学的昨天版：天气两版都会。"
      },
      {
        wrong: "I was reading at eight.",
        wrongMark: null,
        correct: "It was raining.",
        bothRight: true,
        whyZh: "两句都对——第 95 课「那时正在做」复现：一个人看书、天在下雨——故事的两句话。"
      }
    ],
    variants: [
      { label: "肯定", en: "It was raining.", zh: "当时正下着雨。", noteZh: "It was + 穿 -ing。" },
      { label: "否定", en: "It was not raining.", zh: "那会儿没下雨。", noteZh: "not 跟 was 走。" },
      { label: "疑问", en: "Was it raining?", zh: "那时在下雨吗？", noteZh: "Was 搬句首——问那天的天气。" }
    ],
    sceneSwings: [
      { sceneZh: "说现在正下着雨", en: "It is raining.", zh: "现在正下着雨。" },
      { sceneZh: "说那天晚上很冷", en: "It was cold that night.", zh: "那天晚上很冷。" },
      { sceneZh: "问那时在下雨吗", en: "Was it raining?", zh: "那时在下雨吗？" }
    ],
    deepDive: {
      title: "今天版说今天，昨天版说那天",
      paragraphs: [
        "天气句有两版：今天版——It is raining（现在正下着雨）；昨天版——It was raining（那天正下着雨）。零件一样，只是搭档换了版本。",
        "第 34 课就埋了一句：「过去进行最常用的场景之一，就是讲故事背景」——今天它兑现了：讲故事时先说「那天正下着雨」，画面就铺开了。",
        "搭配记牢：昨天版搭档（was）＋穿 -ing 的动作（raining）——少外套（It was rain）错、没换版本（It rains yesterday）也错。",
        "先说背景、再讲事情——这是讲故事的顺序：It was raining（背景铺好），然后 When you called, I was reading（事情来了）。下一课我们就学「事情来了」怎么说。"
      ]
    },
    summary: {
      rule: "天气句的昨天版：It was raining——搭档换昨天版、动作照穿 -ing；今天版说今天、昨天版说那天。",
      points: [
        "It was raining. —— 昨天版（背景句）",
        "It is raining. —— 今天版（现在）",
        "先说背景、再讲事情 —— 讲故事的顺序"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：当时正下着雨。",
        before: "It was",
        after: ".",
        options: ["raining", "rain", "rains"],
        answer: "raining",
        explain: "动作穿 -ing 外套：It was raining。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：当时正下着雨。",
        tokens: ["It", "was", "raining."],
        answer: "It was raining.",
        explain: "昨天版搭档 + -ing 外套：三个词说完。"
      },
      {
        // R8 跨课复现：第 34 课（伏笔原句）
        kind: "arrange",
        promptZh: "先复习一小步——第 34 课听过：当时正下着雨。",
        tokens: ["It", "was", "raining."],
        answer: "It was raining.",
        explain: "复现第 34 课：当时只是听懂——今天它会自己说了。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["It", "was", "rain."],
        wrongToken: "rain",
        answer: "rain",
        correctionZh: "动作要穿 -ing 外套：It was 【raining】。",
        explain: "雨是「正在下」的样子。"
      },
      {
        // R8 跨课复现：第 87 课（今天版对照）
        kind: "arrange",
        promptZh: "再对照一句——第 87 课学过：今天真冷。",
        tokens: ["It's", "cold", "today."],
        answer: "It's cold today.",
        explain: "复现第 87 课：今天版——今天学它的昨天版。"
      },
      {
        // R9 变形/替换：今天换昨天（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「It is raining.」把今天版换成昨天版，搭档要怎么变？",
        replaceBase: "It is raining.",
        replaceTarget: "把今天版换成昨天版",
        options: ["It was raining.", "It was rain.", "It is rained."],
        answer: "It was raining.",
        explain: "搭档换昨天版：It was raining——外套照穿。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：当时正下着雨。",
        tokens: ["It", "was", "raining."],
        distractors: ["rain"],
        answer: "It was raining."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：那时在下雨吗？",
        tokens: ["Was", "it", "raining?"],
        distractors: ["Is"],
        answer: "Was it raining?"
      },
      {
        // 保障句（cloze 落 is——今天版对照）
        promptZh: "你想说：现在正下着雨。",
        tokens: ["It", "is", "raining."],
        distractors: ["was"],
        answer: "It is raining."
      },
      {
        // R8 跨课复现：第 87 课原句
        promptZh: "复习第 87 课：今天真冷。",
        tokens: ["It's", "cold", "today."],
        distractors: ["Its"],
        answer: "It's cold today."
      }
    ],
    recall: {
      promptZh: "小美望着窗外问你那天晚上的天气。凭记忆，写出你那句英文。",
      intentZh: "当时正下着雨。",
      answer: "It was raining.",
      noteZh: "昨天版搭档 + -ing 外套：It was raining。"
    },
    huntCaseIds: ["hunt-rainy-memory"]
  },

  // ── 第十五批 · L97 电话响的时候（when + 当时正做着）：跨批对白闭环——回答 L34「I called you but no answer.」（批十五 PRD §2）──
  {
    id: "lesson-97-when-called",
    number: 97,
    title: "你打电话的时候",
    grammarLabel: "那时候 · when + 当时正做着",
    episode: "小美的一天 九十七",
    scene: "mansion",
    cover: cover15,
    sceneSetupZh: "故事第三句——直接回答第 34 课那句「我打了电话没人接」：你打电话的时候，我正在看书。",
    dialogueEn: "When you called, I was reading.",
    dialogueZh: "小美放下电话听筒的记录本，跟你解释。",
    intentZh: "你打电话的时候我正在看书。",
    targetSentence: "When you called, I was reading.",
    blocks: [
      { text: "When you called", role: "你打电话的时候（插进来的小事）" },
      { text: "I was reading", role: "我正在看书（当时正做着）" }
    ],
    oneLineRule: "when 领的那截是「插进来的小事」（用短的版本），另一截是「当时正做着」（was + 穿 -ing）——When you called, I was reading。",
    examples: [
      { en: "When you called, I was reading.", zh: "你打电话的时候我正在看书。" },
      { en: "When you called, I was sleeping.", zh: "你打电话的时候我正在睡觉。" },
      { en: "I called you but no answer.", zh: "我打了电话没人接。（第 34 课）" },
      { en: "When it is sunny, I run.", zh: "天晴的时候我跑步。（第 92 课）" }
    ],
    dialogue: [
      { who: "npc", en: "I called you but no answer.", zh: "小美翻着电话记录本，学你朋友那口气。" },
      { who: "npc", en: "What were you doing?", zh: "她问你那会儿在干嘛。" },
      { who: "me", en: "When you called, I was reading.", zh: "轮到你说了——你打电话的时候我正在看书。" }
    ],
    contrast: [
      {
        wrong: "When you called, I read a book.",
        wrongMark: "read",
        correct: "When you called, I was reading.",
        whyZh: "「当时正做着」丢了版本：read 是「读了」（一件事），was reading 才是「正看着」——被电话打断的正是那个画面。"
      },
      {
        wrong: "When you call, I was reading.",
        wrongMark: "call",
        correct: "When you called, I was reading.",
        whyZh: "打电话那件是昨天的事，要换昨天版：When you 【called】——两截都是昨天的事。"
      },
      {
        wrong: "When you called, I read a book.",
        wrongMark: "read",
        correct: "When you called, I was reading.",
        whyZh: "同一件事，哪件穿 -ing 有讲究：电话是「插进来的小事」（短版本 called），看书是「当时正做着」（was reading）——反过来就讲不通了。"
      },
      {
        wrong: "I called you but no answer.",
        wrongMark: null,
        correct: "When you called, I was reading.",
        bothRight: true,
        whyZh: "两句都对——第 34 课老对白（我打了电话没人接）＋今天把你的回答递回去：老对白今天有回话了。"
      },
      {
        wrong: "When it is sunny, I run.",
        wrongMark: null,
        correct: "When you called, I was reading.",
        bothRight: true,
        whyZh: "两句都对——第 92 课 when（天晴的时候，天天的事）＋今天 when（你打电话的时候，昨天的事）：when 的岗越用越熟。"
      },
      {
        wrong: "When is your birthday?",
        wrongMark: null,
        correct: "When you called, I was reading.",
        bothRight: true,
        whyZh: "两句都对——问「什么时候」（第 27 课）和说「当…的时候」（今天）：when 同形两张脸，看它在问还是在说。"
      }
    ],
    variants: [
      { label: "肯定", en: "When you called, I was reading.", zh: "你打电话的时候我正在看书。", noteZh: "小事用短的版本（called）、正做着穿 -ing（was reading）。" },
      { label: "否定", en: "When you called, I was not reading.", zh: "你打电话时我没在看书。", noteZh: "not 跟 was 走。" },
      { label: "疑问", en: "Were you reading when I called?", zh: "我打电话时你在看书吗？", noteZh: "把 when 那截挪到后面问也行——Were 搬句首。" }
    ],
    sceneSwings: [
      { sceneZh: "说你打电话时我正在睡觉", en: "When you called, I was sleeping.", zh: "你打电话的时候我正在睡觉。" },
      { sceneZh: "说我打电话时你在看书吗", en: "Were you reading when I called?", zh: "我打电话时你在看书吗？" },
      { sceneZh: "说天晴的时候我跑步（第 92 课老句）", en: "When it is sunny, I run.", zh: "天晴的时候我跑步。" }
    ],
    deepDive: {
      title: "两截话：谁穿 -ing、谁用短的",
      paragraphs: [
        "这条句子里有两截：when you called（你打电话）和 I was reading（我正在看书）。哪截穿 -ing？——「被插进来的那件小事」用短版本（called），「当时正做着的」穿 -ing（was reading）。",
        "为什么？想象画面：镜头先对着「正在看书」的你，忽然电话铃插进来——正在看的（画面）穿 -ing、插进来的（事件）用短的。英文的老习惯就是这样分工。",
        "第 34 课你听过朋友那句「I called you but no answer.」（我打了电话没人接）——今天你把回答递回去了：When you called, I was reading（你打电话的时候我在看书）。跨了六十多课的老对白，今天接上了。",
        "两截的版本要配套：都是昨天的事——called（昨天版）、was reading（昨天版 + -ing）。一截换了一截没换，听起来就像半新半旧的衣服。"
      ]
    },
    summary: {
      rule: "when 领的那截是「插进来的小事」（短版本），另一截是「当时正做着」（was + 穿 -ing）——When you called, I was reading。",
      points: [
        "When you called, I was reading. —— 小事 + 正做着",
        "called 短的 ／ was reading 穿 -ing —— 分工不换位",
        "I called you but no answer. —— 第 34 课老对白今天有回话"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：你打电话的时候我正在看书。",
        before: "When you called,",
        after: ".",
        options: ["I was reading", "I read", "I reading"],
        answer: "I was reading",
        explain: "当时正做着要穿 -ing：was reading。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：你打电话的时候我正在看书。",
        tokens: ["When", "you", "called,", "I", "was", "reading."],
        answer: "When you called, I was reading.",
        explain: "两截话：小事（called）+ 正做着（was reading）。"
      },
      {
        // R8 跨课复现：第 34 课（对白闭环）
        kind: "arrange",
        promptZh: "先复习一小步——第 34 课听过：我打了电话没人接。",
        tokens: ["I", "called", "you", "but", "no", "answer."],
        answer: "I called you but no answer.",
        explain: "复现第 34 课：老对白——今天把回答递回去。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["When", "you", "call,", "I", "was", "reading."],
        wrongToken: "call,",
        answer: "call,",
        correctionZh: "打电话那件要换昨天版：When you 【called】。",
        explain: "两截都是昨天的事。"
      },
      {
        // R8 跨课复现：第 92 课（when 的岗）
        kind: "arrange",
        promptZh: "再对照一句——第 92 课学过：天晴的时候我跑步。",
        tokens: ["When", "it", "is", "sunny,", "I", "run."],
        answer: "When it is sunny, I run.",
        explain: "复现第 92 课：when 的岗——今天的 when 换到昨天。"
      },
      {
        // R9 变形/替换：换正做着的事（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「When you called, I was reading.」把「看书」换成「睡觉（sleep）」，正做着那截怎么变？",
        replaceBase: "When you called, I was reading.",
        replaceTarget: "把 reading 换成 sleep",
        options: ["I was sleeping.", "I was sleep.", "I slept."],
        answer: "I was sleeping.",
        explain: "还是 was + 穿 -ing：sleep→sleeping——外套照穿。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：你打电话的时候我正在看书。",
        tokens: ["When", "you", "called,", "I", "was", "reading."],
        distractors: ["read"],
        answer: "When you called, I was reading."
      },
      {
        // R06 变体扩量：与 variants 否定卡逐字一致的否定变体题
        promptZh: "你想说：你打电话时我没在看书。",
        tokens: ["When", "you", "called,", "I", "was", "not", "reading."],
        distractors: ["no"],
        answer: "When you called, I was not reading."
      },
      {
        // 保障句（cloze 落 sleeping——正做着那截不落空）
        promptZh: "你想说：你打电话的时候我正在睡觉。",
        tokens: ["When", "you", "called,", "I", "was", "sleeping."],
        distractors: ["sleep"],
        answer: "When you called, I was sleeping."
      },
      {
        // R8 跨课复现：第 92 课原句
        promptZh: "复习第 92 课：天晴的时候我跑步。",
        tokens: ["When", "it", "is", "sunny,", "I", "run."],
        distractors: ["sun"],
        answer: "When it is sunny, I run."
      }
    ],
    recall: {
      promptZh: "小美翻着电话记录本问你那会儿在干嘛。凭记忆，写出你那句英文。",
      intentZh: "你打电话的时候我正在看书。",
      answer: "When you called, I was reading.",
      noteZh: "小事用短的（called）、正做着穿 -ing（was reading）。"
    },
    huntCaseIds: ["hunt-call-reading"]
  },

  // ── 第十五批 · L98 一边…一边…（while）：两件同时进行、各自穿 -ing——while 全库首次（批十五 PRD §2·中段自走查点）──
  {
    id: "lesson-98-while",
    number: 98,
    title: "一边…一边…",
    grammarLabel: "两件同时 · while + 都在穿 -ing",
    episode: "小美的一天 九十八",
    scene: "mansion",
    cover: cover22,
    sceneSetupZh: "故事第四句：那会儿我在看书，弟弟在睡觉——两件同时在发生。",
    dialogueEn: "While I was reading, he was sleeping.",
    dialogueZh: "小美朝弟弟的房门努了努嘴。",
    intentZh: "我看书那会儿，他在睡觉。",
    targetSentence: "While I was reading, he was sleeping.",
    blocks: [
      { text: "While I was reading", role: "我看书那会儿（一件在进行）" },
      { text: "he was sleeping", role: "他在睡觉（另一件也在进行）" }
    ],
    oneLineRule: "说「两件同时在发生」用 while，两边各自穿 -ing：While I was reading, he was sleeping——两支镜头同时开着。",
    examples: [
      { en: "While I was reading, he was sleeping.", zh: "我看书那会儿，他在睡觉。" },
      { en: "While I was cooking, she was reading.", zh: "我做饭那会儿，她在看书。" },
      { en: "I was reading while he was sleeping.", zh: "他在睡觉的时候我在看书。（换个顺序也一样）" },
      { en: "When you called, I was reading.", zh: "你打电话时我正在看书。（第 97 课）" }
    ],
    dialogue: [
      { who: "npc", en: "What was your brother doing?", zh: "小美问你弟弟那会儿在干嘛。" },
      { who: "npc", en: "Was he reading, too?", zh: "她朝弟弟的房门努了努嘴。" },
      { who: "me", en: "While I was reading, he was sleeping.", zh: "轮到你说了——我看书那会儿，他在睡觉。" }
    ],
    contrast: [
      {
        wrong: "While I was reading, he slept.",
        wrongMark: "slept",
        correct: "While I was reading, he was sleeping.",
        whyZh: "同时的那件也要穿 -ing：slept 是「睡了一觉」（一件事）——两件同时在，两边都穿。"
      },
      {
        wrong: "While I read, he was sleeping.",
        wrongMark: "read",
        correct: "While I was reading, he was sleeping.",
        whyZh: "前半那件也丢了「正做着」：while 领的两边都在进行——read 是光板，要变成 was reading。"
      },
      {
        wrong: "During I was reading, he was sleeping.",
        wrongMark: "During",
        correct: "While I was reading, he was sleeping.",
        whyZh: "during 后面只能跟「名字」（during the class），跟不了小句子——要说一整句，得用 while 领路。"
      },
      {
        wrong: "I was reading while he was sleeping.",
        wrongMark: null,
        correct: "While I was reading, he was sleeping.",
        bothRight: true,
        whyZh: "两句都对——两件同时在，谁先谁后都行：While I was reading, he was sleeping. ／ I was reading while he was sleeping. 一个意思。"
      },
      {
        wrong: "When you called, I was reading.",
        wrongMark: null,
        correct: "While I was reading, he was sleeping.",
        bothRight: true,
        whyZh: "两句都对——第 97 课 when（插进来的小事）＋今天 while（两件同时在）：一个打断、一个并行。"
      },
      {
        wrong: "They were playing football.",
        wrongMark: null,
        correct: "While I was reading, he was sleeping.",
        bothRight: true,
        whyZh: "两句都对——第 34 课老句（一伙人当时正踢球）今天仍在——while 也是同一套零件。"
      }
    ],
    variants: [
      { label: "肯定", en: "While I was reading, he was sleeping.", zh: "我看书那会儿，他在睡觉。", noteZh: "while 两边都穿 -ing。" },
      { label: "否定", en: "While I was reading, he was not sleeping.", zh: "我看书那会儿他没在睡。", noteZh: "not 跟第二个 was 走。" },
      { label: "疑问", en: "Was he sleeping while you were reading?", zh: "你看书时他在睡吗？", noteZh: "把 while 那截挪到后面问也行——Was 搬句首。" },
    ],
    sceneSwings: [
      { sceneZh: "说我做饭那会儿她在看书", en: "While I was cooking, she was reading.", zh: "我做饭那会儿，她在看书。" },
      { sceneZh: "说他在睡觉时我在看书（换顺序版）", en: "I was reading while he was sleeping.", zh: "他在睡觉的时候我在看书。" },
      { sceneZh: "问你弟那会儿在不在睡", en: "Was he sleeping while you were reading?", zh: "你看书时他在睡吗？" }
    ],
    deepDive: {
      title: "while 与 when 的分工，和 during 的门槛",
      paragraphs: [
        "第 97 课的 when 领的是「插进来的小事」（When you called）——打断。今天的 while 领的是「两件同时在」（While I was reading）——并行。一个打断、一个并行，都是讲故事的好工具。",
        "while 的规矩：两边都穿 -ing。While I was reading（我看书那会儿）、he was sleeping（他在睡觉）——两支镜头同时开着，谁说前面都行。",
        "再来认识 during 的门槛：它后面只能跟「名字」——during the class（课那会儿）、during the night（夜里）。想跟一整句话？请 while 出马：While I was reading——during I was reading 说不通。今天只作对照，混个脸熟。",
        "同一件事两种说法：While I was reading, he was sleeping. ／ I was reading while he was sleeping.——顺序换一换，意思一个样，看你想先让镜头对着谁。"
      ]
    },
    summary: {
      rule: "两件同时在：while 两边都穿 -ing（While I was reading, he was sleeping）——when 管打断、while 管并行。",
      points: [
        "While I was reading, he was sleeping. —— 两支镜头同时开",
        "I was reading while he was sleeping. —— 换顺序也一样",
        "during ❌ 跟小句子 —— 它只认名字（during the class）"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我看书那会儿，他在睡觉。",
        before: "While I was reading,",
        after: ".",
        options: ["he was sleeping", "he slept", "he sleeping"],
        answer: "he was sleeping",
        explain: "同时的那件也穿 -ing：he was sleeping。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我看书那会儿，他在睡觉。",
        tokens: ["While", "I", "was", "reading,", "he", "was", "sleeping."],
        answer: "While I was reading, he was sleeping.",
        explain: "while 两边都穿 -ing：两支镜头同时开。"
      },
      {
        // R8 跨课复现：第 97 课（when 对照）
        kind: "arrange",
        promptZh: "先复习一小步——第 97 课学过：你打电话的时候我正在看书。",
        tokens: ["When", "you", "called,", "I", "was", "reading."],
        answer: "When you called, I was reading.",
        explain: "复现第 97 课：when 管打断——今天的 while 管并行。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["While", "I", "was", "reading,", "he", "slept."],
        wrongToken: "slept.",
        answer: "slept.",
        correctionZh: "同时的那件也要穿 -ing：he 【was sleeping】。",
        explain: "两件同时在，两边都穿外套。"
      },
      {
        // R8 跨课复现：第 34 课（一伙人正做着）
        kind: "arrange",
        promptZh: "再对照一句——第 34 课学过：他们当时正在踢足球。",
        tokens: ["They", "were", "playing", "football."],
        answer: "They were playing football.",
        explain: "复现第 34 课：一伙人用 were——零件跟 while 句一样。"
      },
      {
        // R9 变形/替换：换两件事（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「While I was reading, he was sleeping.」把两件换成「我做饭、她看书」，动词怎么变？",
        replaceBase: "While I was reading, he was sleeping.",
        replaceTarget: "换成「我做饭那会儿她在看书」",
        options: ["While I was cooking, she was reading.", "While I was cook, she was read.", "While I cooked, she read."],
        answer: "While I was cooking, she was reading.",
        explain: "还是两边都穿 -ing：cooking／reading——外套各穿各的。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我看书那会儿，他在睡觉。",
        tokens: ["While", "I", "was", "reading,", "he", "was", "sleeping."],
        distractors: ["slept"],
        answer: "While I was reading, he was sleeping."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：你看书时他在睡吗？",
        tokens: ["Was", "he", "sleeping", "while", "you", "were", "reading?"],
        distractors: ["Did"],
        answer: "Was he sleeping while you were reading?"
      },
      {
        // 保障句（换两件事）
        promptZh: "你想说：我做饭那会儿，她在看书。",
        tokens: ["While", "I", "was", "cooking,", "she", "was", "reading."],
        distractors: ["cooked"],
        answer: "While I was cooking, she was reading."
      },
      {
        // R8 跨课复现：第 34 课原句
        promptZh: "复习第 34 课：他们当时正在踢足球。",
        tokens: ["They", "were", "playing", "football."],
        distractors: ["was"],
        answer: "They were playing football."
      }
    ],
    recall: {
      promptZh: "小美问你弟弟那会儿在干嘛。凭记忆，写出你那句英文。",
      intentZh: "我看书那会儿，他在睡觉。",
      answer: "While I was reading, he was sleeping.",
      noteZh: "while 两边都穿 -ing——两支镜头同时开。"
    },
    huntCaseIds: ["hunt-two-screens"]
  },

  // ── 第十五批 · L99 电话响的时候（进行 vs 昨天版）：哪件用哪个版本——响是一下子、看是一阵子（批十五 PRD §2）──
  {
    id: "lesson-99-when-rang",
    number: 99,
    title: "电话响的时候",
    grammarLabel: "哪件用哪个版本 · 进行 vs 昨天版",
    episode: "小美的一天 九十九",
    scene: "mansion",
    cover: cover27,
    sceneSetupZh: "故事第五句：电话响的那一下，我正在看书——响是一下子的事。",
    dialogueEn: "I was reading when the phone rang.",
    dialogueZh: "小美指了指茶几上的电话。",
    intentZh: "电话响的时候我正在看书。",
    targetSentence: "I was reading when the phone rang.",
    blocks: [
      { text: "I was reading", role: "我正在看书（一阵子的事）" },
      { text: "when the phone rang", role: "电话响了（一下子的事）" }
    ],
    oneLineRule: "哪件用哪个版本：正在做的一阵子穿 -ing（was reading）、插进来的那一下用昨天版（rang）——响是一下子、看是一阵子。",
    examples: [
      { en: "I was reading when the phone rang.", zh: "电话响的时候我正在看书。" },
      { en: "The phone rang while I was sleeping.", zh: "我睡觉的时候电话响了。" },
      { en: "When the guests arrived, Jane was cooking dinner.", zh: "客人到的时候，简正在做晚饭。" },
      { en: "Jane cooked dinner.", zh: "简做了晚饭。（一顿饭的完成）" }
    ],
    dialogue: [
      { who: "npc", en: "When did the phone ring?", zh: "小美指了指茶几上的电话。" },
      { who: "npc", en: "What were you doing?", zh: "她问你那一下在干嘛。" },
      { who: "me", en: "I was reading when the phone rang.", zh: "轮到你说了——电话响的时候我正在看书。" }
    ],
    contrast: [
      {
        wrong: "The phone was ringing while I was sleeping.",
        wrongMark: "ringing",
        correct: "The phone rang while I was sleeping.",
        whyZh: "响是一下子的事：穿 -ing 就成了「一直在响」——像闹钟一样响个不停。一下子的那件用昨天版：rang。"
      },
      {
        wrong: "I was reading when the phone ring.",
        wrongMark: "ring",
        correct: "I was reading when the phone rang.",
        whyZh: "响那一下没换昨天版：ring 是光板，要说 rang——第 10 课的昨天版规矩。"
      },
      {
        wrong: "I was reading when the phone rang.",
        wrongMark: null,
        correct: "When the guests arrived, Jane was cooking dinner.",
        bothRight: true,
        whyZh: "两句都对——都是「一阵子 + 一下子」的架子：I was reading（一阵子）when the phone rang（一下子）／was cooking（一阵子）when the guests arrived（一下子）。"
      },
      {
        wrong: "It was raining.",
        wrongMark: null,
        correct: "I was reading when the phone rang.",
        bothRight: true,
        whyZh: "两句都对——第 34 课的老句（当时正下着雨，故事第一句）＋今天的「电话响」：同一本书的两页。"
      },
      {
        wrong: "While I was reading, he was sleeping.",
        wrongMark: null,
        correct: "I was reading when the phone rang.",
        bothRight: true,
        whyZh: "两句都对——第 98 课 while（两件同时在）＋今天（一件打断另一件）：同与断，两种镜头。"
      },
      {
        wrong: "Yesterday I went to the park.",
        wrongMark: null,
        correct: "I was reading when the phone rang.",
        bothRight: true,
        whyZh: "两句都对——第 10 课「昨天去了一趟」＋今天「那一下正做着」：都是一下子的事，分工不同。"
      }
    ],
    variants: [
      { label: "肯定", en: "I was reading when the phone rang.", zh: "电话响的时候我正在看书。", noteZh: "一阵子穿 -ing、一下子用昨天版。" },
      { label: "否定", en: "I was not reading when the phone rang.", zh: "电话响时我没在看书。", noteZh: "not 跟 was 走。" },
      { label: "疑问", en: "What were you doing when the phone rang?", zh: "电话响的时候你在干嘛？", noteZh: "Were 搬前面问——第 34 课的问法照旧。" }
    ],
    sceneSwings: [
      { sceneZh: "说我睡觉的时候电话响了", en: "The phone rang while I was sleeping.", zh: "我睡觉的时候电话响了。" },
      { sceneZh: "说客人到的时候简在做晚饭", en: "When the guests arrived, Jane was cooking dinner.", zh: "客人到的时候，简正在做晚饭。" },
      { sceneZh: "问电话响的时候在干嘛", en: "What were you doing when the phone rang?", zh: "电话响的时候你在干嘛？" }
    ],
    deepDive: {
      title: "响是一下子，看是一阵子",
      paragraphs: [
        "同一段回忆里有两种事：一阵子的（正在看书、正在下雨）和一下子的（电话响了、有人敲门）。英文给它们配了不同版本：一阵子穿 -ing（was reading），一下子用昨天版（rang）。",
        "为什么？因为「响」就是一瞬间——叮铃一声就完了；「看」是一段时间——挂在那里。想象画面：镜头对着看书的你（一阵子），忽然电话铃插进来（一下子）——画面穿 -ing、插进来的用昨天版。",
        "两种摆法都行：I was reading when the phone rang（先看后响）／The phone rang while I was sleeping（先响后睡）——哪个在前先说哪个。",
        "别忘了「响」的昨天版是 rang：ring→rang→rung（老词有自己的三件外套）——今天用中间那件。"
      ]
    },
    summary: {
      rule: "一阵子穿 -ing（was reading）、一下子用昨天版（rang）——I was reading when the phone rang。",
      points: [
        "I was reading when the phone rang. —— 一阵子 + 一下子",
        "The phone rang while I was sleeping. —— 换个顺序也一样",
        "ring → rang —— 响的昨天版"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：电话响的时候我正在看书。",
        before: "I was reading when the phone",
        after: ".",
        options: ["rang", "ring", "ringing"],
        answer: "rang",
        explain: "响是一下子——用昨天版：rang。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：电话响的时候我正在看书。",
        tokens: ["I", "was", "reading", "when", "the", "phone", "rang."],
        answer: "I was reading when the phone rang.",
        explain: "一阵子（was reading）+ 一下子（rang）。"
      },
      {
        // R8 跨课复现：第 98 课（while 对照）
        kind: "arrange",
        promptZh: "先复习一小步——第 98 课学过：我看书那会儿，他在睡觉。",
        tokens: ["While", "I", "was", "reading,", "he", "was", "sleeping."],
        answer: "While I was reading, he was sleeping.",
        explain: "复现第 98 课：两件同时在——今天学「一件打断另一件」。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["The", "phone", "was", "ringing", "while", "I", "was", "sleeping."],
        wrongToken: "ringing",
        answer: "ringing",
        correctionZh: "响是一下子：The phone 【rang】 while I was sleeping。",
        explain: "穿 -ing 就成了「一直在响」。"
      },
      {
        // R8 跨课复现：第 34 课（故事第一句）
        kind: "arrange",
        promptZh: "再对照一句——第 34 课学过：三点时我正在画画。",
        tokens: ["I", "was", "drawing", "at", "three."],
        answer: "I was drawing at three.",
        explain: "复现第 34 课：一阵子的画面——今天的「一下子」正好插进来。"
      },
      {
        // R9 变形/替换：换一下子的事（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I was reading when the phone rang.」把「电话响」换成「有人敲门（knock）」，一下子那截怎么变？",
        replaceBase: "I was reading when the phone rang.",
        replaceTarget: "把 the phone rang 换成「有人敲门」",
        options: ["someone knocked", "someone knock", "someone was knocking"],
        answer: "someone knocked",
        explain: "敲门也是一下子：knocked——用昨天版（不穿 -ing）。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：电话响的时候我正在看书。",
        tokens: ["I", "was", "reading", "when", "the", "phone", "rang."],
        distractors: ["ring"],
        answer: "I was reading when the phone rang."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：电话响的时候你在干嘛？",
        tokens: ["What", "were", "you", "doing", "when", "the", "phone", "rang?"],
        distractors: ["Was"],
        answer: "What were you doing when the phone rang?"
      },
      {
        // 保障句
        promptZh: "你想说：我睡觉的时候电话响了。",
        tokens: ["The", "phone", "rang", "while", "I", "was", "sleeping."],
        distractors: ["ringing"],
        answer: "The phone rang while I was sleeping."
      },
      {
        // R8 跨课复现：第 34 课原句
        promptZh: "复习第 34 课：三点时我正在画画。",
        tokens: ["I", "was", "drawing", "at", "three."],
        distractors: ["drew"],
        answer: "I was drawing at three."
      }
    ],
    recall: {
      promptZh: "小美指着茶几上的电话问你那一下在干嘛。凭记忆，写出你那句英文。",
      intentZh: "电话响的时候我正在看书。",
      answer: "I was reading when the phone rang.",
      noteZh: "一阵子穿 -ing、一下子用昨天版——rang。"
    },
    huntCaseIds: ["hunt-phone-rang"]
  },

  // ── 第十五批 · L100 从前常这样（讲故事里用 used to）：回讲老习惯——一次去了/那会儿正做着/从前常常 三路对照（批十五 PRD §2）──
  {
    id: "lesson-100-used-to-story",
    number: 100,
    title: "从前常这样",
    grammarLabel: "讲故事 · used to 回讲",
    episode: "小美的一天 一百",
    scene: "campus",
    cover: cover37,
    sceneSetupZh: "故事往回一翻：站在学校老操场边说，从前我常在这儿玩。",
    dialogueEn: "I used to play here every day.",
    dialogueZh: "小美望着老操场，眼神跑远了。",
    intentZh: "从前我天天在这儿玩。",
    targetSentence: "I used to play here every day.",
    blocks: [
      { text: "I used to play here", role: "从前我常在这儿玩" },
      { text: "every day", role: "天天（从前的常常）" }
    ],
    oneLineRule: "讲故事往回翻：从前的习惯用 used to（I used to play here every day）——「一次去了」（went）、「那会儿正做着」（was reading）、「从前常常」（used to）三条路各管一摊。",
    examples: [
      { en: "I used to play here every day.", zh: "从前我天天在这儿玩。" },
      { en: "I used to play here.", zh: "我从前常在这儿玩。（第 93 课）" },
      { en: "I was reading at eight.", zh: "八点的时候我正在看书。（那一晚）" },
      { en: "Yesterday I went to the park.", zh: "昨天我去了公园。（那一趟）" }
    ],
    dialogue: [
      { who: "npc", en: "This playground is so old!", zh: "小美望着老操场。" },
      { who: "npc", en: "Did you play here before?", zh: "她问你家是不是住得近。" },
      { who: "me", en: "I used to play here every day.", zh: "轮到你说了——从前我天天在这儿玩。" }
    ],
    contrast: [
      {
        wrong: "I use to play here every day.",
        wrongMark: "use",
        correct: "I used to play here every day.",
        whyZh: "尾巴上少了 d：used to——「从前常常」的老记号不能丢。"
      },
      {
        wrong: "I used to playing here every day.",
        wrongMark: "playing",
        correct: "I used to play here every day.",
        whyZh: "used to 后面跟原形：play——它不认 -ing 外套（跟 want to travel 一个规矩）。"
      },
      {
        wrong: "I was reading at eight.",
        wrongMark: null,
        correct: "I used to play here every day.",
        bothRight: true,
        whyZh: "两句都对——说那一晚「正做着」（was reading）vs 说从前「常常」（used to）：两个「过去」各管一摊、不打架。"
      },
      {
        wrong: "Yesterday I went to the park.",
        wrongMark: null,
        correct: "I used to play here every day.",
        bothRight: true,
        whyZh: "两句都对——「昨天去了一趟」（went）＋「从前天天」（used to）：一次去了 vs 从前常常。"
      },
      {
        wrong: "I didn't use to play here.",
        wrongMark: null,
        correct: "I used to play here every day.",
        bothRight: true,
        whyZh: "两句都对——第 93 课的反面（从前不常来）＋今天的正面：d 跟着前面的帮手走，两种都说得出。"
      },
      {
        wrong: "I always arrive early.",
        wrongMark: null,
        correct: "I used to play here every day.",
        bothRight: true,
        whyZh: "两句都对——第 28 课「现在的常常」（always）＋今天「从前的常常」（used to）：一个现在、一个从前。"
      }
    ],
    variants: [
      { label: "肯定", en: "I used to play here every day.", zh: "从前我天天在这儿玩。", noteZh: "used to——从前常常、现在不这样了。" },
      { label: "否定", en: "I didn't use to play here.", zh: "从前我不常在这儿玩。", noteZh: "否定用 didn't——d 跟着帮手走。" },
      { label: "疑问", en: "Did you use to play here?", zh: "你从前常在这儿玩吗？", noteZh: "问句 Did 站句首——use 不带 d。" }
    ],
    sceneSwings: [
      { sceneZh: "说我从前常在这儿玩（第 93 课老句）", en: "I used to play here.", zh: "我从前常在这儿玩。" },
      { sceneZh: "说八点那会儿正在看书", en: "I was reading at eight.", zh: "八点的时候我正在看书。" },
      { sceneZh: "说昨天去了公园", en: "Yesterday I went to the park.", zh: "昨天我去了公园。" }
    ],
    deepDive: {
      title: "三条说过去的路，今天凑齐了",
      paragraphs: [
        "这一章你攒了三条说过去的路：那一次去了（I went to the park，一趟做完）、那会儿正做着（I was reading at eight，画面停住）、从前常常（I used to play here every day，一段时期的习惯）。",
        "今天的主角是第三条：讲故事往回翻的时候，用 used to 说「那时候的日常」——从前天天在这儿玩、从前常去那家店。它和现在对照着听：从前这样、现在不这样了。",
        "「从前常常」和「现在常常」也要分清：现在每天还在做，用 every day 配现在版（I play here every day）；从前才这样，用 used to（I used to play here every day）——同一个 every day，动词的版本不一样。",
        "三条路走到这儿，你讲故事的底子就有了：先铺背景（It was raining）、说被什么打断（when the phone rang）、聊从前的习惯（I used to…）——昨天的故事，你能从头讲到尾了。"
      ]
    },
    summary: {
      rule: "讲故事往回翻：从前的习惯用 used to（I used to play here every day）——一次去了/那会儿正做着/从前常常，三条路各管一摊。",
      points: [
        "I used to play here every day. —— 从前的常常",
        "I went there. ／ I was reading. —— 一次 vs 一阵",
        "I used to play here. ／ I play here every day. —— 从前 vs 现在"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：从前我天天在这儿玩。",
        before: "I",
        after: "here every day.",
        options: ["used to play", "use to play", "used to playing"],
        answer: "used to play",
        explain: "used to + 原形：d 不丢、外套不穿。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：从前我天天在这儿玩。",
        tokens: ["I", "used", "to", "play", "here", "every", "day."],
        answer: "I used to play here every day.",
        explain: "used to + 原形——说从前的常常。"
      },
      {
        // R8 跨课复现：第 93 课（老句）
        kind: "arrange",
        promptZh: "先复习一小步——第 93 课学过：我从前常在这儿玩。",
        tokens: ["I", "used", "to", "play", "here."],
        answer: "I used to play here.",
        explain: "复现第 93 课：老句——今天把它放回故事里说。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "use", "to", "play", "here", "every", "day."],
        wrongToken: "use",
        answer: "use",
        correctionZh: "尾巴上补个 d：I 【used】 to play here every day。",
        explain: "「从前常常」的老记号不能丢。"
      },
      {
        // R8 跨课复现：第 10 课（一次去了）
        kind: "arrange",
        promptZh: "再对照一句——第 10 课学过：昨天我去了公园。",
        tokens: ["Yesterday", "I", "went", "to", "the", "park."],
        answer: "Yesterday I went to the park.",
        explain: "复现第 10 课：「去了一趟」——三条路的第一条。"
      },
      {
        // R9 变形/替换：换习惯（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I used to play here every day.」把「玩」换成「读书（read）」，后半截怎么变？",
        replaceBase: "I used to play here every day.",
        replaceTarget: "把 play here 换成「天天晚上读书」",
        options: ["read at night", "reading at night", "read at night every day"],
        answer: "read at night",
        explain: "used to 后面跟原形：read——「从前的常常」换个习惯照样说。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：从前我天天在这儿玩。",
        tokens: ["I", "used", "to", "play", "here", "every", "day."],
        distractors: ["use"],
        answer: "I used to play here every day."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：你从前常在这儿玩吗？",
        tokens: ["Did", "you", "use", "to", "play", "here?"],
        distractors: ["used"],
        answer: "Did you use to play here?"
      },
      {
        // 保障句（cloze 落 used——正中考点）
        promptZh: "你想说：我从前常晚上读书。",
        tokens: ["I", "used", "to", "read", "at", "night."],
        distractors: ["use"],
        answer: "I used to read at night."
      },
      {
        // R8 跨课复现：第 10 课原句
        promptZh: "复习第 10 课：昨天我去了公园。",
        tokens: ["Yesterday", "I", "went", "to", "the", "park."],
        distractors: ["go"],
        answer: "Yesterday I went to the park."
      }
    ],
    recall: {
      promptZh: "站在学校老操场边，小美问你家是不是住得近。凭记忆，写出你那句英文。",
      intentZh: "从前我天天在这儿玩。",
      answer: "I used to play here every day.",
      noteZh: "used to——从前的常常；d 不丢、外套不穿。"
    },
    huntCaseIds: ["hunt-old-habit"]
  },

  // ── 第十五批 · L101 讲故事（跨课混排 · 半收口）：一句接一句串成小故事——then 认读（批十五 PRD §2）──
  {
    id: "lesson-101-tell-story",
    number: 101,
    title: "讲故事",
    grammarLabel: "一句接一句 · 混排（then 认读）",
    episode: "小美的一天 一百零一",
    scene: "sparkle",
    cover: cover38,
    sceneSetupZh: "把前六课各一句串成一个完整的小故事——昨晚八点那个电话，一句接一句说起来。",
    dialogueEn: "I was reading. It was raining. When you called, I was reading.",
    dialogueZh: "小美撑着下巴，眼睛看着半空，一句一句把昨晚摆出来。",
    intentZh: "我在看书。外面下着雨。你打电话时我正在看书。",
    targetSentence: "I was reading. It was raining. When you called, I was reading.",
    blocks: [
      { text: "I was reading.", role: "我在看书（画面开场）" },
      { text: "It was raining.", role: "外面下着雨（背景铺上）" },
      { text: "When you called, …", role: "你打电话的时候…（事情来了）" }
    ],
    oneLineRule: "讲故事：一句接一句——先摆画面（I was reading），再铺背景（It was raining），最后让事情插进来（When you called）——中间可以用 then 接上（认读）。",
    examples: [
      { en: "I was reading. It was raining.", zh: "我在看书。外面下着雨。" },
      { en: "Then you called.", zh: "然后你打电话来了。（then 认读）" },
      { en: "When you called, I was reading.", zh: "你打电话的时候我正在看书。" },
      { en: "I used to play here.", zh: "我从前常在这儿玩。" }
    ],
    dialogue: [
      { who: "npc", en: "Tell me about last night.", zh: "小美撑着下巴，眼睛看着半空。" },
      { who: "npc", en: "One sentence at a time.", zh: "她摆了摆手：一句一句来。" },
      { who: "me", en: "I was reading. It was raining. When you called, I was reading.", zh: "轮到你了——把昨晚摆出来。" }
    ],
    contrast: [
      {
        wrong: "I was read at eight.",
        wrongMark: "read",
        correct: "I was reading at eight.",
        whyZh: "第 95 课回流：一阵子的事要穿 -ing——was reading。"
      },
      {
        wrong: "When you called, I read a book.",
        wrongMark: "read",
        correct: "When you called, I was reading.",
        whyZh: "第 97 课回流：被电话打断的正做着要穿 -ing——was reading。"
      },
      {
        wrong: "I was reading. Then you called.",
        wrongMark: null,
        correct: "When you called, I was reading.",
        bothRight: true,
        whyZh: "两种说都对——分开两句说（Then you called，then 是「然后」）和合成一句说（When you called, …）：一个意思。"
      },
      {
        wrong: "It was raining.",
        wrongMark: null,
        correct: "I was reading at eight.",
        bothRight: true,
        whyZh: "两句都对——本批的两句老熟人：第 95 课（八点在看）＋第 96 课（下着雨）——故事的开场两句。"
      },
      {
        wrong: "While I was reading, he was sleeping.",
        wrongMark: null,
        correct: "When you called, I was reading.",
        bothRight: true,
        whyZh: "两句都对——第 98 课 while（两件同时在）＋第 97 课 when（一件插进来）：两种镜头。"
      },
      {
        wrong: "Yesterday I went to the park.",
        wrongMark: null,
        correct: "I used to play here.",
        bothRight: true,
        whyZh: "两句都对——第 10 课「一次去了」＋第 93/100 课「从前常常」：说过去的两条路。"
      }
    ],
    variants: [
      { label: "肯定", en: "I was reading. It was raining. When you called, I was reading.", zh: "我在看书。下着雨。你打电话时我在看书。", noteZh: "一句接一句——画面、背景、事情。" },
      { label: "否定", en: "I was not reading at eight.", zh: "八点我没在看书。", noteZh: "not 跟 was 走。" },
      { label: "疑问", en: "What were you doing when I called?", zh: "我打电话时你在干嘛？", noteZh: "Were 搬前面问。" }
    ],
    sceneSwings: [
      { sceneZh: "说八点那会儿正在看书", en: "I was reading at eight.", zh: "八点的时候我正在看书。" },
      { sceneZh: "说外面正下着雨（背景）", en: "It was raining.", zh: "当时正下着雨。" },
      { sceneZh: "说从前常在这儿玩（往回翻）", en: "I used to play here.", zh: "我从前常在这儿玩。" }
    ],
    deepDive: {
      title: "故事的顺序：画面 → 背景 → 事情",
      paragraphs: [
        "讲故事有顺序：先把镜头对准一处画面（I was reading，我在看书），再把背景铺上（It was raining，外面下着雨），最后让事情插进来（When you called，你打电话的时候）——听众脑子里就有画面了。",
        "句子之间可以用 then（然后）接上：I was reading. Then you called.（我在看书。然后你打电话来了。）——then 是讲故事的小帮手，今天只认读，混个脸熟。",
        "往回翻还有一条路：I used to play here（从前常在这儿玩）——讲到从前的事，用它。",
        "这一章的工具箱到这儿齐了：一阵子的事（was reading）、一下子的插曲（rang）、两件同时在（while）、从前的习惯（used to）——讲昨天、讲从前，你都有词用。"
      ]
    },
    summary: {
      rule: "讲故事的顺序：先摆画面（I was reading）→ 铺背景（It was raining）→ 事情插进来（When you called）——then 是连接词（认读）。",
      points: [
        "I was reading. It was raining. Then you called. —— 一句接一句",
        "When you called, I was reading. —— 合起来说也一样",
        "was reading ／ rang ／ while ／ used to —— 工具箱齐了"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：八点那会儿我在看书。（一阵子的事）",
        before: "I",
        after: "at eight.",
        options: ["was reading", "read", "was read"],
        answer: "was reading",
        explain: "一阵子的事穿 -ing：was reading。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：外面正下着雨。（背景）",
        tokens: ["It", "was", "raining."],
        answer: "It was raining.",
        explain: "背景句：It was raining。"
      },
      {
        // R8 跨课复现：第 100 课（往回翻）
        kind: "arrange",
        promptZh: "先复习一小步——第 100 课学过：从前我天天在这儿玩。",
        tokens: ["I", "used", "to", "play", "here", "every", "day."],
        answer: "I used to play here every day.",
        explain: "复现第 100 课：从前的常常——讲故事往回翻就用它。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "was", "read", "at", "eight."],
        wrongToken: "read",
        answer: "read",
        correctionZh: "一阵子的事要穿 -ing：I was 【reading】 at eight。",
        explain: "第 95 课的老规矩。"
      },
      {
        // R8 跨课复现：第 34 课（老句）
        kind: "arrange",
        promptZh: "再对照一句——第 34 课学过：三点时我正在画画。",
        tokens: ["I", "was", "drawing", "at", "three."],
        answer: "I was drawing at three.",
        explain: "复现第 34 课：同一套零件——画面随时可以换。"
      },
      {
        // R9 变形/替换：接上 then（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I was reading.」后面想用 then 接「你打电话来了」，接上哪一截？",
        replaceBase: "I was reading.",
        replaceTarget: "用 then 接「你打电话来了」",
        options: ["Then you called.", "Then you call.", "You then called."],
        answer: "Then you called.",
        explain: "then 站句首接上：Then you called——然后你打来了（called 是昨天版）。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：八点那会儿我在看书。",
        tokens: ["I", "was", "reading", "at", "eight."],
        distractors: ["read"],
        answer: "I was reading at eight."
      },
      {
        // R06 变体扩量：与 variants 疑问卡逐字一致的疑问变体题
        promptZh: "你想问：我打电话时你在干嘛？",
        tokens: ["What", "were", "you", "doing", "when", "I", "called?"],
        distractors: ["Was"],
        answer: "What were you doing when I called?"
      },
      {
        // 保障句（cloze 落 raining——实词兜底）
        promptZh: "你想说：八点那会儿正下着雨。",
        tokens: ["It", "was", "raining", "at", "eight."],
        distractors: ["rain"],
        answer: "It was raining at eight."
      },
      {
        // R8 跨课复现：第 97 课原句
        promptZh: "复习第 97 课：你打电话的时候我正在看书。",
        tokens: ["When", "you", "called,", "I", "was", "reading."],
        distractors: ["read"],
        answer: "When you called, I was reading."
      }
    ],
    recall: {
      promptZh: "小美让你把昨晚一句一句摆出来。凭记忆，写出你那句英文。",
      intentZh: "你打电话的时候我正在看书。",
      answer: "When you called, I was reading.",
      noteZh: "事情插进来用 when——正做着穿 -ing。"
    },
    huntCaseIds: ["hunt-story-parts"]
  },

  // ── 第十五批 · L102 昨天那个电话（章末收口 · 零新知）：电话故事收口——大团圆（批十五 PRD §2）──
  {
    id: "lesson-102-phone-story",
    number: 102,
    title: "昨天那个电话",
    grammarLabel: "收口 · 大团圆（零新知）",
    episode: "小美的一天 一百零二",
    scene: "mansion",
    cover: cover40,
    sceneSetupZh: "电话故事收口：从「昨晚八点」到「从前的操场」——把这条电话线一次说完。",
    dialogueEn: "I was reading at eight. It was raining. When you called, I was reading.",
    dialogueZh: "小美把电话记录本合上，往椅背一靠，笑了。",
    intentZh: "八点我在看书。下着雨。你打电话时我正在看书。",
    targetSentence: "I was reading at eight. It was raining. When you called, I was reading.",
    blocks: [
      { text: "I was reading at eight.", role: "八点在看（开场）" },
      { text: "It was raining.", role: "下着雨（背景）" },
      { text: "When you called, …", role: "电话来了（事情）" }
    ],
    oneLineRule: "把这一章的话一次说完：八点在看书、外面下着雨、电话打进来、弟弟在睡、从前常在这儿玩——一条线讲到底。",
    examples: [
      { en: "I was reading at eight.", zh: "八点的时候我正在看书。" },
      { en: "It was raining.", zh: "当时正下着雨。" },
      { en: "I was reading when the phone rang.", zh: "电话响的时候我正在看书。" },
      { en: "I used to play here.", zh: "我从前常在这儿玩。" }
    ],
    dialogue: [
      { who: "npc", en: "So that was last night!", zh: "小美把电话记录本合上。" },
      { who: "npc", en: "And before?", zh: "她往椅背一靠，笑着问：那再往前呢。" },
      { who: "me", en: "I was reading at eight. It was raining. When you called, I was reading.", zh: "轮到你说了——把昨晚摆出来。" }
    ],
    contrast: [
      {
        wrong: "It was rain.",
        wrongMark: "rain",
        correct: "It was raining.",
        whyZh: "第 96 课回流：背景句的动作要穿 -ing——It was raining。"
      },
      {
        wrong: "While I was reading, he slept.",
        wrongMark: "slept",
        correct: "While I was reading, he was sleeping.",
        whyZh: "第 98 课回流：两件同时在，两边都穿 -ing——he was sleeping。"
      },
      {
        wrong: "I use to play here.",
        wrongMark: "use",
        correct: "I used to play here.",
        whyZh: "第 100 课回流：从前的常常要带 d——used to。"
      },
      {
        wrong: "I was reading when the phone rang.",
        wrongMark: null,
        correct: "I was reading at eight.",
        bothRight: true,
        whyZh: "两句都对——第 99 课（电话响那一下）＋第 95 课（八点在看）：同一段回忆的两个镜头。"
      },
      {
        wrong: "When you called, I was reading.",
        wrongMark: null,
        correct: "I was reading when the phone rang.",
        bothRight: true,
        whyZh: "两句都对——第 97 课 when 在前＋第 99 课 when 在后：同一个架子，倒过来也成。"
      },
      {
        wrong: "I didn't use to play here.",
        wrongMark: null,
        correct: "I used to play here.",
        bothRight: true,
        whyZh: "两句都对——第 93 课的反面（从前不常）＋正面（从前常常）：d 跟着帮手走。"
      }
    ],
    variants: [
      { label: "肯定", en: "I was reading at eight. It was raining.", zh: "八点我在看书。外面下着雨。", noteZh: "开场 + 背景，一句接一句。" },
      { label: "否定", en: "It was not raining.", zh: "那时没下雨。", noteZh: "not 跟 was 走。" },
      { label: "疑问", en: "Were you reading when I called?", zh: "我打电话时你在看书吗？", noteZh: "Were 搬句首问。" }
    ],
    sceneSwings: [
      { sceneZh: "说八点那会儿正在看书", en: "I was reading at eight.", zh: "八点的时候我正在看书。" },
      { sceneZh: "说电话响时正在看书", en: "I was reading when the phone rang.", zh: "电话响的时候我正在看书。" },
      { sceneZh: "说从前常在这儿玩（全章收口）", en: "I used to play here.", zh: "我从前常在这儿玩。" }
    ],
    deepDive: {
      title: "大章倒带：讲故事的整套本事",
      paragraphs: [
        "这一章八课，你把「讲故事」的整套本事拿下了：画面（I was reading at eight）、背景（It was raining）、被什么打断（When you called／the phone rang）、两件同时在（While I was reading, he was sleeping）、从前的习惯（I used to play here）。",
        "工具箱里最重要的一条判据：一阵子的事穿 -ing（was reading、was raining）、一下子的事用昨天版（rang、called）——讲故事的节奏就靠它。",
        "第 34 课埋的伏笔今天全兑现了：当时那句「过去进行最常用的场景之一是讲故事背景」，你听懂了；今天你不光懂，还能把整段故事讲出来。",
        "最后一页别忘了往回翻：I used to play here（从前常在这儿玩）——故事讲完，再往前聊两句从前，一个电话的晚上就这么说圆了。"
      ]
    },
    summary: {
      rule: "讲故事的整套本事：画面（was reading）+ 背景（was raining）+ 打断（rang／called）+ 同时（while）+ 从前（used to）。",
      points: [
        "I was reading at eight. It was raining. —— 开场 + 背景",
        "I was reading when the phone rang. —— 电话打断",
        "I used to play here. —— 往前翻：从前的常常"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：八点那会儿我在看书。",
        before: "I was",
        after: "at eight.",
        options: ["reading", "read", "rain"],
        answer: "reading",
        explain: "一阵子的事穿 -ing：was reading。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：电话响的时候我正在看书。",
        tokens: ["I", "was", "reading", "when", "the", "phone", "rang."],
        answer: "I was reading when the phone rang.",
        explain: "一阵子（was reading）+ 一下子（rang）。"
      },
      {
        // R8 跨课复现：第 100 课（从前的常常）
        kind: "arrange",
        promptZh: "先复习一小步——第 100 课学过：从前我天天在这儿玩。",
        tokens: ["I", "used", "to", "play", "here", "every", "day."],
        answer: "I used to play here every day.",
        explain: "复现第 100 课：从前的常常——故事说完往回翻。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["It", "was", "rain."],
        wrongToken: "rain",
        answer: "rain",
        correctionZh: "背景句的动作穿 -ing：It was 【raining】。",
        explain: "第 96 课的老规矩。"
      },
      {
        // R8 跨课复现：第 98 课（同时）
        kind: "arrange",
        promptZh: "再对照一句——第 98 课学过：我看书那会儿，他在睡觉。",
        tokens: ["While", "I", "was", "reading,", "he", "was", "sleeping."],
        answer: "While I was reading, he was sleeping.",
        explain: "复现第 98 课：两件同时在——工具箱的最后一件。"
      },
      {
        // R9 变形/替换：换开场（构造迁移，复用 choose 判题）
        kind: "replace",
        promptZh: "句子变身：「I was reading at eight.」把「八点」换成「昨晚（last night）」，句子怎么变？",
        replaceBase: "I was reading at eight.",
        replaceTarget: "把 at eight 换成 last night",
        options: ["I was reading last night.", "I read last night.", "I was read last night."],
        answer: "I was reading last night.",
        explain: "换个时间词：last night——was reading 照旧。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：八点那会儿我在看书。",
        tokens: ["I", "was", "reading", "at", "eight."],
        distractors: ["read"],
        answer: "I was reading at eight."
      },
      {
        // R06 变体扩量：与 variants 否定卡逐字一致的否定变体题
        promptZh: "你想说：那时没下雨。",
        tokens: ["It", "was", "not", "raining."],
        distractors: ["no"],
        answer: "It was not raining."
      },
      {
        // R8 跨课复现：第 96 课原句
        promptZh: "复习第 96 课：当时正下着雨。",
        tokens: ["It", "was", "raining."],
        distractors: ["rain"],
        answer: "It was raining."
      },
      {
        // 章末收官惯例：复现第 99 课原句
        promptZh: "全批收官——复习第 99 课：电话响的时候我正在看书。",
        tokens: ["I", "was", "reading", "when", "the", "phone", "rang."],
        distractors: ["ring"],
        answer: "I was reading when the phone rang."
      }
    ],
    recall: {
      promptZh: "电话故事收口——小美往椅背一靠，让你把昨晚一次说完。凭记忆，写出你那句英文。",
      intentZh: "八点我在看书。下着雨。你打电话时我正在看书。",
      answer: "I was reading at eight. It was raining. When you called, I was reading.",
      noteZh: "画面 → 背景 → 事情：一条线讲到底。"
    },
    huntCaseIds: ["hunt-phone-story"]
  }
];

export const GRAMMAR_LESSON_BY_ID: ReadonlyMap<string, GrammarLesson> = new Map(
  grammarLessons.map((lesson) => [lesson.id, lesson])
);
