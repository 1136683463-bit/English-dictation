/**
 * B1 级语法缺口补齐 · 批次 A（L170–L175）
 *   L170 both...and · L171 neither...nor · L172 unless · L173 in order to
 *   L174 be able to · L175 So do I（倒装）
 *
 * 内容纪律与 L163–L169 一致：零术语、六段结构完整、提示与答案语义一致、
 * 含 1-2 道旧课回流题、每课配错题案件。
 */
import type { NewLesson } from "./types";

export const B1_LESSONS_A: NewLesson[] = [
  // ══════════════ L170 · both...and ══════════════
  {
    id: "lesson-170-both-and",
    number: 170,
    title: "又会唱又会跳",
    grammarLabel: "既…又… · both…and",
    episode: "小美的一天 一百七十",
    scene: "campus",
    sceneSetupZh: "文艺汇演报名表贴在公告栏上，同桌盯着看了半天——她家那个表妹不光会唱，跳也跳得不错。",
    dialogueEn: "She can both sing and dance.",
    dialogueZh: "同桌用手指点了点报名表上的两栏。",
    intentZh: "她既会唱歌又会跳舞。",
    targetSentence: "She can both sing and dance.",
    blocks: [
      { text: "She can both", role: "她既（两样都占）" },
      { text: "sing and dance", role: "会唱、又会跳（and 把两样接起来）" }
    ],
    oneLineRule: "说「既…又…」用 both…and——She can both sing and dance（她既会唱歌又会跳舞）。both 站在第一样前面，and 站在第二样前面，两样一起端出来。",
    examples: [
      { en: "She can both sing and dance.", zh: "她既会唱歌又会跳舞。" },
      { en: "He is both tall and strong.", zh: "他个子又高、身体又壮。" },
      { en: "Both books are good.", zh: "两本都好。（第 148 课——那是「两个都」）" },
      { en: "I like tea and coffee.", zh: "我喜欢茶和咖啡。（第 19 课）" }
    ],
    dialogue: [
      { who: "npc", en: "Can she dance?", zh: "同桌看着报名表问。" },
      { who: "npc", en: "She sings too.", zh: "她家那个表妹两栏都填了。" },
      { who: "me", en: "She can both sing and dance.", zh: "轮到你说了——她既会唱歌又会跳舞。" }
    ],
    contrast: [
      {
        wrong: "She can both sing or dance.",
        wrongMark: "or",
        correct: "She can both sing and dance.",
        whyZh: "两样都占，接起来的是 and——both 【and】。or 是「或者」，那是挑一个，不是两样都要。"
      },
      {
        wrong: "She can both sing and dance both.",
        wrongMark: "both.",
        correct: "She can both sing and dance.",
        whyZh: "both 只站第一样前面——【both】 sing and dance。句尾再放一个就多出来了。"
      },
      {
        wrong: "She can sing both and dance.",
        wrongMark: "both",
        correct: "She can both sing and dance.",
        whyZh: "both 要站在第一样前面——She can 【both】 sing and dance。站在中间就断了。"
      },
      {
        wrong: "Both books are good.",
        wrongMark: null,
        correct: "She can both sing and dance.",
        bothRight: true,
        whyZh: "两句都对——第 148 课那个 both 说的是「两个都」（后面跟着东西）；今天这个 both…and 是把两样特点接起来。"
      },
      {
        wrong: "I like tea and coffee.",
        wrongMark: null,
        correct: "She can both sing and dance.",
        bothRight: true,
        whyZh: "两句都对——第 19 课那句只是用 and 把两样并列；今天多了个 both，强调「两样都占」。"
      },
      {
        wrong: "She can sing very well.",
        wrongMark: null,
        correct: "She can both sing and dance.",
        bothRight: true,
        whyZh: "两句都对——第 59 课那句只说她唱得好；今天这句把「跳」也算上了。"
      }
    ],
    variants: [
      { label: "肯定", en: "She can both sing and dance.", zh: "她既会唱歌又会跳舞。", noteZh: "both 站第一样前、and 站第二样前。" },
      { label: "否定", en: "She can't both sing and dance.", zh: "她没法既唱又跳。", noteZh: "「不」用 can't。" },
      { label: "疑问", en: "Can she both sing and dance?", zh: "她既会唱歌又会跳舞吗？", noteZh: "Can 搬到句首，both…and 不动。" }
    ],
    sceneSwings: [
      { sceneZh: "说她既会唱又会跳", en: "She can both sing and dance.", zh: "她既会唱歌又会跳舞。" },
      { sceneZh: "说他个子又高又壮", en: "He is both tall and strong.", zh: "他个子又高、身体又壮。" },
      { sceneZh: "问同学两样是不是都行", en: "Can you both sing and dance?", zh: "你既会唱歌又会跳舞吗？" }
    ],
    deepDive: {
      title: "两个都 和 既…又…差在哪儿",
      paragraphs: [
        "第 148 课学过 Both books are good.（两本都好）。那时候 both 后面跟着一样东西（books），说的是「这两个都在内」。",
        "今天这个 both…and 干的是另一件活：把同一个人的两样特点接起来——She can both sing and dance.（她既会唱歌又会跳舞）。both 站第一样前面，and 站第二样前面，两个词像一对夹子。",
        "别用 or：She can both sing or dance 是错的中文思路——「又…又…」是两样都要，所以接的是 and，不是 or。",
        "后面跟的东西形状要一样：both sing and dance（两个都是原样）、both tall and strong（两个都是形容类的词）。一头一尾对称，句子才站得稳。"
      ]
    },
    summary: {
      rule: "说「既…又…」用 both…and——both 站第一样前、and 站第二样前：She can both sing and dance。",
      points: [
        "She can both sing and dance. —— 两样都占",
        "both sing or dance ❌ —— 是 and，不是 or",
        "Both books are good（第 148 课·两个都）／ both sing and dance（今天·既…又…）"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：她既会唱歌又会跳舞。",
        before: "She can both sing",
        after: "dance.",
        options: ["and", "or", "but"],
        answer: "and",
        explain: "两样都占，接起来的是 and——both sing 【and】 dance。or 是挑一个。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：她既会唱歌又会跳舞。",
        tokens: ["She", "can", "both", "sing", "and", "dance."],
        answer: "She can both sing and dance.",
        explain: "both 站第一样前（both sing）＋ and 站第二样前（and dance），一对夹子。"
      },
      {
        kind: "arrange",
        promptZh: "先复习一小步——第 148 课学过：两本都好。",
        tokens: ["Both", "books", "are", "good."],
        answer: "Both books are good.",
        explain: "复现第 148 课：那是「两个都」（后面跟着东西）；今天看两个夹子把两样接起来。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["She", "can", "both", "sing", "or", "dance."],
        wrongToken: "or",
        answer: "or",
        correctionZh: "把 or 换成 and：She can both sing and dance。",
        explain: "「既…又…」两样都要，接的是 and——or 是挑一个。"
      },
      {
        kind: "arrange",
        promptZh: "再对照一句——第 19 课学过：我喜欢茶和咖啡。",
        tokens: ["I", "like", "tea", "and", "coffee."],
        answer: "I like tea and coffee.",
        explain: "复现第 19 课：那句只是并列；今天前面加个 both，强调两样都占。"
      },
      {
        kind: "replace",
        promptZh: "句子换特点：「She can both sing and dance.」把「跳」换成「游泳」，怎么变？",
        replaceBase: "She can both sing and dance.",
        replaceTarget: "把 dance 换成 swim",
        options: ["She can both sing and swim.", "She can both sing and swimming.", "She can sing both and swim."],
        answer: "She can both sing and swim.",
        explain: "换第二样只换最后那个词，形状不变（照样原样）——and 【swim】。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：她既会唱歌又会跳舞。",
        tokens: ["She", "can", "both", "sing", "and", "dance."],
        distractors: ["or"],
        answer: "She can both sing and dance."
      },
      {
        promptZh: "你想说：他个子又高、身体又壮。",
        tokens: ["He", "is", "both", "tall", "and", "strong."],
        distractors: ["or"],
        answer: "He is both tall and strong."
      },
      {
        promptZh: "复习第 148 课：两本都好。",
        tokens: ["Both", "books", "are", "good."],
        distractors: ["is"],
        answer: "Both books are good."
      },
      {
        promptZh: "你想问：她既会唱歌又会跳舞吗？",
        tokens: ["Can", "she", "both", "sing", "and", "dance?"],
        distractors: ["Does"],
        answer: "Can she both sing and dance?"
      }
    ],
    recall: {
      promptZh: "同桌盯着报名表看了半天，说那个表妹两栏都填了。凭记忆，写出她那句英文。",
      intentZh: "她既会唱歌又会跳舞。",
      answer: "She can both sing and dance.",
      noteZh: "both 站第一样前、and 站第二样前——一对夹子。"
    },
    huntCaseIds: ["hunt-both-and-sing"]
  },

  // ══════════════ L171 · neither...nor ══════════════
  {
    id: "lesson-171-neither-nor",
    number: 171,
    title: "既不会也不喜欢",
    grammarLabel: "既不…也不… · neither…nor",
    episode: "小美的一天 一百七十一",
    scene: "campus",
    sceneSetupZh: "食堂门口碰到同学问她想不想试试新出的辣面，小美摆手——辣的吃不了，面也一般，两样都不算。",
    dialogueEn: "I like neither spicy food nor noodles.",
    dialogueZh: "小美拉着同学往另一个窗口走。",
    intentZh: "辣的我不喜欢，面我也不喜欢。",
    targetSentence: "I like neither spicy food nor noodles.",
    blocks: [
      { text: "I like neither", role: "我两个都不喜欢（neither 站第一样前）" },
      { text: "spicy food nor noodles", role: "辣的、面（nor 接第二样）" }
    ],
    oneLineRule: "说「既不…也不…」用 neither…nor——neither 站第一样前、nor 接第二样，两样一块儿否掉。它和第 149 课那个 neither 是一家：一个管「两个都不」，一个管「既不…也不…」。",
    examples: [
      { en: "I like neither spicy food nor noodles.", zh: "辣的我不喜欢，面我也不喜欢。" },
      { en: "He is neither tall nor strong.", zh: "他个子不高、身体也不壮。" },
      { en: "Neither book is good.", zh: "两本书都不好。（第 149 课）" },
      { en: "She can both sing and dance.", zh: "她既会唱歌又会跳舞。（第 170 课——那是「两样都占」）" }
    ],
    dialogue: [
      { who: "npc", en: "Have you tried the new spicy noodles?", zh: "同学指着新窗口问。" },
      { who: "npc", en: "It's really hot!", zh: "她一脸期待。" },
      { who: "me", en: "I like neither spicy food nor noodles.", zh: "轮到你说了——辣的我不喜欢，面我也不喜欢。" }
    ],
    contrast: [
      {
        wrong: "I like neither spicy food or noodles.",
        wrongMark: "or",
        correct: "I like neither spicy food nor noodles.",
        whyZh: "前面是 neither，后面就要用 nor 接——neither …【nor】。两个词是一对，不能拿 or 顶上。"
      },
      {
        wrong: "I like neither spicy food and noodles.",
        wrongMark: "and",
        correct: "I like neither spicy food nor noodles.",
        whyZh: "and 是「都」用的（both…and）；这里两样都不喜欢，要用 nor——neither …【nor】。"
      },
      {
        wrong: "I don't like neither spicy food nor noodles.",
        wrongMark: "don't",
        correct: "I like neither spicy food nor noodles.",
        whyZh: "neither 已经把「不」含在里面了——再加 don't 就成了「不…也不」，意思绕回去了。"
      },
      {
        wrong: "Neither book is good.",
        wrongMark: null,
        correct: "I like neither spicy food nor noodles.",
        bothRight: true,
        whyZh: "两句都对——第 149 课那个 neither 说的是「两个都不」（后面跟着一样东西）；今天这个 neither…nor 是把两样一块儿否掉。"
      },
      {
        wrong: "She can both sing and dance.",
        wrongMark: null,
        correct: "I like neither spicy food nor noodles.",
        bothRight: true,
        whyZh: "两句都对——第 170 课那句是「两样都占」（both…and）；今天这句是「两样都否」（neither…nor）。正好一对反话。"
      },
      {
        wrong: "I don't like coffee.",
        wrongMark: null,
        correct: "I like neither spicy food nor noodles.",
        bothRight: true,
        whyZh: "两句都对——第 146 课那句只管一样东西；今天这句一口气否掉两样。"
      }
    ],
    variants: [
      { label: "肯定", en: "I like neither spicy food nor noodles.", zh: "辣的我不喜欢，面我也不喜欢。", noteZh: "neither…nor，两样一块儿否掉。" },
      { label: "否定", en: "I don't like either spicy food or noodles.", zh: "辣的我不喜欢，面我也不喜欢。（换个说法）", noteZh: "换成 don't…either…or，意思一样。" },
      { label: "疑问", en: "Do you like neither of them?", zh: "两个你都不喜欢吗？", noteZh: "问句里更常用 neither of them。" }
    ],
    sceneSwings: [
      { sceneZh: "说辣的和面都不喜欢", en: "I like neither spicy food nor noodles.", zh: "辣的我不喜欢，面我也不喜欢。" },
      { sceneZh: "说他个子不高也不壮", en: "He is neither tall nor strong.", zh: "他个子不高、身体也不壮。" },
      { sceneZh: "说两个都不好（第 149 课）", en: "Neither book is good.", zh: "两本书都不好。" }
    ],
    deepDive: {
      title: "两个词一对，否掉两样",
      paragraphs: [
        "第 149 课学过 Neither book is good.（两本书都不好）。那时候 neither 后面跟一样东西（book），一次否掉两样（两本书）。",
        "今天这个 neither…nor 换了个用法：把两样不同的东西并排否掉——I like neither spicy food nor noodles.（辣的我不喜欢，面我也不喜欢）。neither 站第一样前，nor 站第二样前。",
        "记住这两个词是一对：前面是 neither，后面就用 nor；前面是 both，后面才用 and。前面一个词变了，后面那个也得跟着变。",
        "还有件事容易出错：neither 自己就含「不」的意思，所以句子前面不用再加 don't。要说 I like neither…，不要说 I don't like neither…。"
      ]
    },
    summary: {
      rule: "说「既不…也不…」用 neither…nor——neither 站第一样前、nor 接第二样；它自己就含「不」，前面不再加 don't。",
      points: [
        "I like neither spicy food nor noodles. —— 两样都否",
        "neither … or ❌ —— 前面 neither，后面要用 nor",
        "both…and（第 170 课·两样都占）／ neither…nor（今天·两样都否）—— 一对反话"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：辣的我不喜欢，面我也不喜欢。",
        before: "I like neither spicy food",
        after: "noodles.",
        options: ["nor", "or", "and"],
        answer: "nor",
        explain: "前面是 neither，后面就用 nor——neither …【nor】。两个词是一对。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：辣的我不喜欢，面我也不喜欢。",
        tokens: ["I", "like", "neither", "spicy", "food", "nor", "noodles."],
        answer: "I like neither spicy food nor noodles.",
        explain: "neither 站第一样前（neither spicy food）＋ nor 接第二样（nor noodles）。"
      },
      {
        kind: "arrange",
        promptZh: "先复习一小步——第 149 课学过：两本书都不好。",
        tokens: ["Neither", "book", "is", "good."],
        answer: "Neither book is good.",
        explain: "复现第 149 课：那是「两个都不」（后面跟一样东西）；今天把两样并排否掉。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "like", "neither", "spicy", "food", "or", "noodles."],
        wrongToken: "or",
        answer: "or",
        correctionZh: "把 or 换成 nor：I like neither spicy food nor noodles。",
        explain: "neither 后面要用 nor 接——两个词是一对。"
      },
      {
        kind: "arrange",
        promptZh: "再对照一句——第 170 课学过：她既会唱歌又会跳舞。",
        tokens: ["She", "can", "both", "sing", "and", "dance."],
        answer: "She can both sing and dance.",
        explain: "复现第 170 课：那句是「两样都占」（both…and）；今天反过来，两样都否。"
      },
      {
        kind: "replace",
        promptZh: "句子换两样东西：「I like neither spicy food nor noodles.」换成「不高也不壮」，怎么说？",
        replaceBase: "I like neither spicy food nor noodles.",
        replaceTarget: "换成说他个子不高、身体也不壮",
        options: ["He is neither tall nor strong.", "He is neither tall or strong.", "He neither is tall nor strong."],
        answer: "He is neither tall nor strong.",
        explain: "换人换两样，一对词不动：neither…nor——He is 【neither】 tall 【nor】 strong。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：辣的我不喜欢，面我也不喜欢。",
        tokens: ["I", "like", "neither", "spicy", "food", "nor", "noodles."],
        distractors: ["or"],
        answer: "I like neither spicy food nor noodles."
      },
      {
        promptZh: "你想说：他个子不高、身体也不壮。",
        tokens: ["He", "is", "neither", "tall", "nor", "strong."],
        distractors: ["or"],
        answer: "He is neither tall nor strong."
      },
      {
        promptZh: "复习第 149 课：两本书都不好。",
        tokens: ["Neither", "book", "is", "good."],
        distractors: ["are"],
        answer: "Neither book is good."
      },
      {
        promptZh: "你想说：辣的我也不喜欢，面我也不喜欢。（换个说法）",
        tokens: ["I", "don't", "like", "either", "spicy", "food", "or", "noodles."],
        distractors: ["nor"],
        answer: "I don't like either spicy food or noodles."
      }
    ],
    recall: {
      promptZh: "食堂门口同学问你想不想试新出的辣面，你摆手拉着她往别的窗口走。凭记忆，写出你那句英文。",
      intentZh: "辣的我不喜欢，面我也不喜欢。",
      answer: "I like neither spicy food nor noodles.",
      noteZh: "neither…nor 一对——前面 neither，后面就得 nor。"
    },
    huntCaseIds: ["hunt-neither-nor-food"]
  },

  // ══════════════ L172 · unless ══════════════
  {
    id: "lesson-172-unless",
    number: 172,
    title: "除非下雨",
    grammarLabel: "除非 · unless",
    episode: "小美的一天 一百七十二",
    scene: "city",
    sceneSetupZh: "周末约好去爬山，小美看着天上的云跟伙伴说：除非下雨，不然我们照计划走。",
    dialogueEn: "We will go unless it rains.",
    dialogueZh: "小美把手机塞回口袋，抬头看了看天。",
    intentZh: "除非下雨，不然我们就去。",
    targetSentence: "We will go unless it rains.",
    blocks: [
      { text: "We will go", role: "我们会去（照计划走）" },
      { text: "unless it rains", role: "除非下雨（就这一个例外）" }
    ],
    oneLineRule: "说「除非」用 unless——We will go unless it rains（除非下雨，不然我们就去）。它和第 48 课那个 if 正好反着：if 说「如果下雨就不去」，unless 说「不下雨就去」。",
    examples: [
      { en: "We will go unless it rains.", zh: "除非下雨，不然我们就去。" },
      { en: "I won't go unless you go.", zh: "除非你去，不然我不去。" },
      { en: "If it rains, I will stay at home.", zh: "如果下雨，我就待在家里。（第 48 课——正好反着）" },
      { en: "We will go to the park tomorrow.", zh: "我们明天去公园。（第 12 课）" }
    ],
    dialogue: [
      { who: "npc", en: "Are we still going tomorrow?", zh: "伙伴在群里发了条消息。" },
      { who: "npc", en: "What if it rains?", zh: "她补了一句。" },
      { who: "me", en: "We will go unless it rains.", zh: "轮到你说了——除非下雨，不然我们就去。" }
    ],
    contrast: [
      {
        wrong: "We will go unless it will rain.",
        wrongMark: "will rain",
        correct: "We will go unless it rains.",
        whyZh: "后面那个「例外」不用 will——unless it 【rains】。第 48 课的老规矩：if 和 unless 后面的那小句，用现在时说明天的事。"
      },
      {
        wrong: "We will go unless it doesn't rain.",
        wrongMark: "doesn't",
        correct: "We will go unless it rains.",
        whyZh: "unless 自己就含「除非」的意思——unless it 【rains】 就是「除非下雨」。再加 doesn't 就成了「除非不下雨」，意思反了。"
      },
      {
        wrong: "Unless it rains, we will not go.",
        wrongMark: null,
        correct: "Unless it rains, we will not go.",
        bothRight: true,
        whyZh: "这句也对——只是位置换了：unless 的小句站前面时，后面说「不去」。两种排法都对，看你把哪半句放前面。"
      },
      {
        wrong: "If it rains, I will stay at home.",
        wrongMark: null,
        correct: "We will go unless it rains.",
        bothRight: true,
        whyZh: "两句都对——第 48 课那句用 if 说「如果下雨就不去」；今天用 unless 说「除非下雨才不去」。一个从正面说，一个从例外说。"
      },
      {
        wrong: "We will go to the park tomorrow.",
        wrongMark: null,
        correct: "We will go unless it rains.",
        bothRight: true,
        whyZh: "两句都对——第 12 课那句只是说计划；今天多留了一个例外的口子。"
      },
      {
        wrong: "It will rain.",
        wrongMark: null,
        correct: "We will go unless it rains.",
        bothRight: true,
        whyZh: "两句都对——第 12 课那句只说天气；今天这句把天气和计划挂上了钩。"
      }
    ],
    variants: [
      { label: "肯定", en: "We will go unless it rains.", zh: "除非下雨，不然我们就去。", noteZh: "unless 后面那小句用现在时。" },
      { label: "否定", en: "I won't go unless you go.", zh: "除非你去，不然我不去。", noteZh: "主句用了 won't——「不去」。", },
      { label: "疑问", en: "Will you go unless it rains?", zh: "除非下雨，不然你会去吗？", noteZh: "Will 搬到句首，unless 的小句不动。" }
    ],
    sceneSwings: [
      { sceneZh: "说除非下雨不然就去", en: "We will go unless it rains.", zh: "除非下雨，不然我们就去。" },
      { sceneZh: "说除非你去不然我不去", en: "I won't go unless you go.", zh: "除非你去，不然我不去。" },
      { sceneZh: "说如果下雨就待在家（第 48 课）", en: "If it rains, I will stay at home.", zh: "如果下雨，我就待在家里。" }
    ],
    deepDive: {
      title: "if 和 unless 是同一件事的两面",
      paragraphs: [
        "第 48 课学的 if 是「如果」：If it rains, I will stay at home.（如果下雨，我就待在家里）——从一个条件出发，说会发生什么。",
        "unless 是「除非」：We will go unless it rains.（除非下雨，不然我们就去）——先把计划说定，再留一个例外。两句话说的其实是同一件事，只是一个从正面说、一个从例外说。",
        "用法上和 if 一模一样：后面那小句不用 will，用现在时说明天的事——unless it rains。这是第 48 课就定下的规矩，if 和 unless 都守。",
        "还有一件事：unless 自己就含「除非不」的意思，所以后面不要再加 doesn't 或 not。unless it rains 就是「除非下雨」，写成 unless it doesn't rain 意思正好反过来。"
      ]
    },
    summary: {
      rule: "说「除非」用 unless——We will go unless it rains；后面那小句用现在时，不再加 not。",
      points: [
        "We will go unless it rains. —— 先定计划，再留例外",
        "unless it will rain ❌ —— 后面小句用现在时",
        "if（第 48 课·如果）／ unless（今天·除非）—— 同一件事的两面"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：除非下雨，不然我们就去。",
        before: "We will go",
        after: "it rains.",
        options: ["unless", "if", "because"],
        answer: "unless",
        explain: "「除非」用 unless——We will go 【unless】 it rains。if 是「如果」，方向不同。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：除非下雨，不然我们就去。",
        tokens: ["We", "will", "go", "unless", "it", "rains."],
        answer: "We will go unless it rains.",
        explain: "先说计划（We will go）＋ 再留例外（unless it rains，用现在时）。"
      },
      {
        kind: "arrange",
        promptZh: "先复习一小步——第 48 课学过：如果下雨，我就待在家里。",
        tokens: ["If", "it", "rains,", "I", "will", "stay", "at", "home."],
        answer: "If it rains, I will stay at home.",
        explain: "复现第 48 课：那是从「如果」说；今天换成从「除非」说。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["We", "will", "go", "unless", "it", "will", "rain."],
        wrongToken: "will",
        answer: "will",
        correctionZh: "把 will 去掉：We will go unless it rains。",
        explain: "unless 后面那小句用现在时——第 48 课的老规矩，if 和 unless 都守。"
      },
      {
        kind: "arrange",
        promptZh: "再对照一句——第 12 课学过：我们明天去公园。",
        tokens: ["We", "will", "go", "to", "the", "park", "tomorrow."],
        answer: "We will go to the park tomorrow.",
        explain: "复现第 12 课：那句只是说计划；今天多留了一个例外的口子。"
      },
      {
        kind: "replace",
        promptZh: "句子换例外：「We will go unless it rains.」把「下雨」换成「下雪」，怎么变？",
        replaceBase: "We will go unless it rains.",
        replaceTarget: "把 rains 换成 snows",
        options: ["We will go unless it snows.", "We will go unless it will snow.", "We will go unless it snow."],
        answer: "We will go unless it snows.",
        explain: "换例外只换后面那个词，照样用现在时——unless it 【snows】。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：除非下雨，不然我们就去。",
        tokens: ["We", "will", "go", "unless", "it", "rains."],
        distractors: ["if"],
        answer: "We will go unless it rains."
      },
      {
        promptZh: "你想说：除非你去，不然我不去。",
        tokens: ["I", "won't", "go", "unless", "you", "go."],
        distractors: ["will"],
        answer: "I won't go unless you go."
      },
      {
        promptZh: "复习第 48 课：如果下雨，我就待在家里。",
        tokens: ["If", "it", "rains,", "I", "will", "stay", "at", "home."],
        distractors: ["unless"],
        answer: "If it rains, I will stay at home."
      },
      {
        promptZh: "你想问：除非下雨，不然你会去吗？",
        tokens: ["Will", "you", "go", "unless", "it", "rains?"],
        distractors: ["Do"],
        answer: "Will you go unless it rains?"
      }
    ],
    recall: {
      promptZh: "周末约好去爬山，你看着天上的云跟伙伴说了一句。凭记忆，写出你那句英文。",
      intentZh: "除非下雨，不然我们就去。",
      answer: "We will go unless it rains.",
      noteZh: "unless 自己就含「除非不」——后面不再加 not。"
    },
    huntCaseIds: ["hunt-unless-rain"]
  }
];
