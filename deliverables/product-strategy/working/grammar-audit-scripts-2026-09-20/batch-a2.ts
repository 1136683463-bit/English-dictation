/**
 * B1 级语法缺口 · 批次 A 续（L173–L175）
 *   L173 in order to · L174 be able to · L175 So do I（倒装）
 */
import type { NewLesson } from "./types";

export const B1_LESSONS_A2: NewLesson[] = [
  // ══════════════ L173 · in order to ══════════════
  {
    id: "lesson-173-in-order-to",
    number: 173,
    title: "为了赶上早班车",
    grammarLabel: "为了 · in order to",
    episode: "小美的一天 一百七十三",
    scene: "city",
    sceneSetupZh: "天还没大亮，小美已经在公交站台上了——今天要赶最早那班车去城另一头办事，早起就是为了它。",
    dialogueEn: "I got up early in order to catch the bus.",
    dialogueZh: "小美把围巾往上拉了拉。",
    intentZh: "为了赶上那班车，我起得很早。",
    targetSentence: "I got up early in order to catch the bus.",
    blocks: [
      { text: "I got up early", role: "我起得很早（做的事）" },
      { text: "in order to catch the bus", role: "为了赶上那班车（为的是什么）" }
    ],
    oneLineRule: "说「为了」用 in order to——I got up early in order to catch the bus（为了赶上那班车，我起得很早）。它和第 44 课那块小垫板 to 是一家人，说的时候正式一点、清楚一点。",
    examples: [
      { en: "I got up early in order to catch the bus.", zh: "为了赶上那班车，我起得很早。" },
      { en: "She studies hard in order to pass the test.", zh: "为了通过考试，她努力学习。" },
      { en: "I go to the shop to buy milk.", zh: "我去商店买牛奶。（第 44 课——那块小垫板）" },
      { en: "I got up at six o'clock.", zh: "我六点起床。（第 18 课）" }
    ],
    dialogue: [
      { who: "npc", en: "Why are you here so early?", zh: "站台上的大叔问。" },
      { who: "npc", en: "The first bus leaves at six.", zh: "他看了看表。" },
      { who: "me", en: "I got up early in order to catch the bus.", zh: "轮到你说了——为了赶上那班车，我起得很早。" }
    ],
    contrast: [
      {
        wrong: "I got up early in order to catching the bus.",
        wrongMark: "catching",
        correct: "I got up early in order to catch the bus.",
        whyZh: "in order to 后面那个动作穿原样——in order to 【catch】。第 44 课那块小垫板 to 后面也是原样。"
      },
      {
        wrong: "I got up early in order catch the bus.",
        wrongMark: "order",
        correct: "I got up early in order to catch the bus.",
        whyZh: "in order to 三个词一起出场——in order 【to】 catch。少了 to，那个「为了」就没接上后面的动作。"
      },
      {
        wrong: "I got up early for to catch the bus.",
        wrongMark: "for",
        correct: "I got up early in order to catch the bus.",
        whyZh: "「为了做某事」用 in order to，不用 for to——for 后面跟的是东西（for you），不接动作。"
      },
      {
        wrong: "I go to the shop to buy milk.",
        wrongMark: null,
        correct: "I got up early in order to catch the bus.",
        bothRight: true,
        whyZh: "两句都对——第 44 课那块小垫板 to 说的是「去做什么」；in order to 说的是「为了什么」，意思近，后者更正式也更清楚。"
      },
      {
        wrong: "I got up at six o'clock.",
        wrongMark: null,
        correct: "I got up early in order to catch the bus.",
        bothRight: true,
        whyZh: "两句都对——第 18 课那句只说了几点起；今天多说了「为什么」。"
      },
      {
        wrong: "I must get up early.",
        wrongMark: null,
        correct: "I got up early in order to catch the bus.",
        bothRight: true,
        whyZh: "两句都对——第 16 课那句说「必须早起」；今天说的是「已经早起了，为了赶上那班车」。"
      }
    ],
    variants: [
      { label: "肯定", en: "I got up early in order to catch the bus.", zh: "为了赶上那班车，我起得很早。", noteZh: "in order to 后面穿原样。" },
      { label: "否定", en: "I got up early in order not to miss the bus.", zh: "为了不误那班车，我起得很早。", noteZh: "说「为了不」把 not 插在 to 前面。" },
      { label: "疑问", en: "Why did you get up so early?", zh: "你为什么起这么早？", noteZh: "问原因用 Why + did。" }
    ],
    sceneSwings: [
      { sceneZh: "说为了赶车起得很早", en: "I got up early in order to catch the bus.", zh: "为了赶上那班车，我起得很早。" },
      { sceneZh: "说她为了通过考试努力学习", en: "She studies hard in order to pass the test.", zh: "为了通过考试，她努力学习。" },
      { sceneZh: "说去商店买牛奶（第 44 课）", en: "I go to the shop to buy milk.", zh: "我去商店买牛奶。" }
    ],
    deepDive: {
      title: "to 那块小垫板的两种说法",
      paragraphs: [
        "第 44 课学过：I go to the shop to buy milk.（我去商店买牛奶）。后面那个 to buy milk 说的是「去干什么」——to 像块小垫板，垫在动作前面。",
        "今天学的 in order to 干的是同一件事，只是说得更清楚：I got up early in order to catch the bus.（为了赶上那班车，我起得很早）。它比单个 to 更强调「目的」，写在纸上、说正事的时候更常用。",
        "两个说法后面都跟原样：to buy、in order to catch。别写成 buying 或 catching（那是第 42 课「穿 -ing 外套」的另一件活）。",
        "想说「为了不…」，把 not 插在 to 前面：in order not to miss the bus（为了不误车）。not 站的位置很固定——to 的前面，动作的前面。"
      ]
    },
    summary: {
      rule: "说「为了」用 in order to + 动作原样——in order to catch the bus；说「为了不」就 in order not to + 原样。",
      points: [
        "I got up early in order to catch the bus. —— 为了赶车",
        "in order catch ❌ —— 少了 to",
        "to buy milk（第 44 课·去做什么）／ in order to catch（今天·为了什么）"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：为了赶上那班车，我起得很早。",
        before: "I got up early in order",
        after: "catch the bus.",
        options: ["to", "for", "at"],
        answer: "to",
        explain: "in order to 三个词一起出场——in order 【to】 catch。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：为了赶上那班车，我起得很早。",
        tokens: ["I", "got", "up", "early", "in", "order", "to", "catch", "the", "bus."],
        answer: "I got up early in order to catch the bus.",
        explain: "先说做的事（I got up early）＋ 再说为了什么（in order to catch the bus）。"
      },
      {
        kind: "arrange",
        promptZh: "先复习一小步——第 44 课学过：我去商店买牛奶。",
        tokens: ["I", "go", "to", "the", "shop", "to", "buy", "milk."],
        answer: "I go to the shop to buy milk.",
        explain: "复现第 44 课：那块小垫板 to 说的是「去做什么」；今天换成更正式的 in order to。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "got", "up", "early", "in", "order", "catching", "the", "bus."],
        wrongToken: "catching",
        answer: "catching",
        correctionZh: "把 catching 换成 catch：in order to catch the bus。",
        explain: "in order to 后面那个动作穿原样——第 44 课的老规矩。"
      },
      {
        kind: "arrange",
        promptZh: "再对照一句——第 18 课学过：我六点起床。",
        tokens: ["I", "get", "up", "at", "six", "o'clock."],
        answer: "I get up at six o'clock.",
        explain: "复现第 18 课：那句只说了几点起；今天多说了「为什么」。"
      },
      {
        kind: "replace",
        promptZh: "句子换目的：「I got up early in order to catch the bus.」把目的换成「不误车」，怎么变？",
        replaceBase: "I got up early in order to catch the bus.",
        replaceTarget: "把目的换成「为了不误车」",
        options: [
          "I got up early in order not to miss the bus.",
          "I got up early in order to not miss the bus.",
          "I got up early in order not miss the bus."
        ],
        answer: "I got up early in order not to miss the bus.",
        explain: "说「为了不」把 not 插在 to 前面——in order 【not to】 miss。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：为了赶上那班车，我起得很早。",
        tokens: ["I", "got", "up", "early", "in", "order", "to", "catch", "the", "bus."],
        distractors: ["catching"],
        answer: "I got up early in order to catch the bus."
      },
      {
        promptZh: "你想说：为了不误那班车，我起得很早。",
        tokens: ["I", "got", "up", "early", "in", "order", "not", "to", "miss", "the", "bus."],
        distractors: ["no"],
        answer: "I got up early in order not to miss the bus."
      },
      {
        promptZh: "复习第 44 课：我去商店买牛奶。",
        tokens: ["I", "go", "to", "the", "shop", "to", "buy", "milk."],
        distractors: ["buying"],
        answer: "I go to the shop to buy milk."
      },
      {
        promptZh: "你想说：为了通过考试，她努力学习。",
        tokens: ["She", "studies", "hard", "in", "order", "to", "pass", "the", "test."],
        distractors: ["passing"],
        answer: "She studies hard in order to pass the test."
      }
    ],
    recall: {
      promptZh: "天还没大亮，你已经在公交站台上了。凭记忆，写出你那句英文。",
      intentZh: "为了赶上那班车，我起得很早。",
      answer: "I got up early in order to catch the bus.",
      noteZh: "in order to 后面穿原样——说「为了不」就把 not 插在 to 前面。"
    },
    huntCaseIds: ["hunt-in-order-to-bus"]
  },

  // ══════════════ L174 · be able to ══════════════
  {
    id: "lesson-174-be-able-to",
    number: 174,
    title: "这次我能自己去了",
    grammarLabel: "能够 · be able to",
    episode: "小美的一天 一百七十四",
    scene: "city",
    sceneSetupZh: "上周小美还不敢一个人坐地铁，这周妈妈说要送她，她摇摇头——路线已经记熟了，自己走得通。",
    dialogueEn: "I am able to go there myself now.",
    dialogueZh: "小美把地铁卡举给妈妈看。",
    intentZh: "我现在能自己去了。",
    targetSentence: "I am able to go there myself now.",
    blocks: [
      { text: "I am able to", role: "我能（用 be able to 说「能」）" },
      { text: "go there myself now", role: "现在自己去那儿（后面跟动作原样）" }
    ],
    oneLineRule: "说「能」除了 can，还有 be able to——I am able to go there myself now（我现在能自己去了）。意思和 can 一样，但它能配「以前不能、现在能」这类变化：can 没有过去和将来那么多形状，be able to 有。",
    examples: [
      { en: "I am able to go there myself now.", zh: "我现在能自己去了。" },
      { en: "She was able to finish it yesterday.", zh: "她昨天把它做完了。（说昨天「做到」了）" },
      { en: "I can swim.", zh: "我会游泳。（第 14 课）" },
      { en: "I can do it myself.", zh: "我自己能做。（第 163 课）" }
    ],
    dialogue: [
      { who: "npc", en: "I can take you there.", zh: "妈妈拿起车钥匙。" },
      { who: "npc", en: "Are you sure you know the way?", zh: "她还是有点不放心。" },
      { who: "me", en: "I am able to go there myself now.", zh: "轮到你说了——我现在能自己去了。" }
    ],
    contrast: [
      {
        wrong: "I am able to going there myself now.",
        wrongMark: "going",
        correct: "I am able to go there myself now.",
        whyZh: "be able to 后面那个动作穿原样——able to 【go】。第 44 课那块小垫板 to 后面也是原样。"
      },
      {
        wrong: "I able to go there myself now.",
        wrongMark: "I",
        correct: "I am able to go there myself now.",
        whyZh: "able 是个「形容类的词」，前面得站个 be 才站得住——I 【am】 able to。第 1 课的老规矩。"
      },
      {
        wrong: "I am able to go there myself now?",
        wrongMark: null,
        correct: "I am able to go there myself now.",
        bothRight: true,
        whyZh: "这是陈述句——说「我能」。要问「你能吗」，把 am 搬到句首：Are you able to…?"
      },
      {
        wrong: "I can swim.",
        wrongMark: null,
        correct: "I am able to go there myself now.",
        bothRight: true,
        whyZh: "两句都对——第 14 课那个 can 说「会」（一种本事）；be able to 常用来说「某一次做得到」。"
      },
      {
        wrong: "I can do it myself.",
        wrongMark: null,
        correct: "I am able to go there myself now.",
        bothRight: true,
        whyZh: "两句都对——第 163 课那句强调「我自己来」（不用帮）；今天这句强调「我现在能了」（以前不能）。"
      },
      {
        wrong: "I got up at six o'clock.",
        wrongMark: null,
        correct: "I am able to go there myself now.",
        bothRight: true,
        whyZh: "两句都对——第 18 课那句说时间；今天这句说能力。"
      }
    ],
    variants: [
      { label: "肯定", en: "I am able to go there myself now.", zh: "我现在能自己去了。", noteZh: "be able to 后面穿原样。" },
      { label: "否定", en: "I am not able to go there alone.", zh: "我一个人去不了。", noteZh: "「不」跟 am 走。" },
      { label: "疑问", en: "Are you able to go there alone?", zh: "你能一个人去吗？", noteZh: "Are 搬到句首。" }
    ],
    sceneSwings: [
      { sceneZh: "说现在能自己去了", en: "I am able to go there myself now.", zh: "我现在能自己去了。" },
      { sceneZh: "说她昨天把它做完了", en: "She was able to finish it yesterday.", zh: "她昨天把它做完了。" },
      { sceneZh: "说我会游泳（第 14 课）", en: "I can swim.", zh: "我会游泳。" }
    ],
    deepDive: {
      title: "can 和 be able to 都在说「能」",
      paragraphs: [
        "第 14 课学过 can：I can swim.（我会游泳）。它是最顺口的「能」，平时说话用它就够了。",
        "be able to 说的是同一件事，但它是「be + 一个形容类的词 + to」，所以能跟着时间变形：I am able to（现在能）、She was able to（那时能）、You will be able to（以后能）。",
        "can 在这一块不太灵光：想说「昨天做到了」，一般不用 could，而用 was able to——She was able to finish it yesterday.（她昨天把它做完了）。因为 could 更像「当时有这个本事」，was able to 说的是「那一次真做到了」。",
        "所以怎么选：平时说「会什么」用 can；要说「某一次做到了」或者要跟时间变化，用 be able to。两个都对，看你想说哪一层。"
      ]
    },
    summary: {
      rule: "说「能」除了 can，还有 be able to + 动作原样——I am able to go there now；它能跟时间变形（was／will be）。",
      points: [
        "I am able to go there myself now. —— 现在能了",
        "I am able to going ❌ —— 后面穿原样",
        "can（第 14 课·会什么）／ be able to（今天·某一次做得到）"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "你想说：我现在能自己去了。",
        before: "I am able",
        after: "go there myself now.",
        options: ["to", "for", "at"],
        answer: "to",
        explain: "be able to 三个词是一组——able 【to】 go。后面那个动作穿原样。"
      },
      {
        kind: "arrange",
        promptZh: "你想说：我现在能自己去了。",
        tokens: ["I", "am", "able", "to", "go", "there", "myself", "now."],
        answer: "I am able to go there myself now.",
        explain: "我能（I am able to）＋ 现在自己去那儿（go there myself now，穿原样）。"
      },
      {
        kind: "arrange",
        promptZh: "先复习一小步——第 14 课学过：我会游泳。",
        tokens: ["I", "can", "swim."],
        answer: "I can swim.",
        explain: "复现第 14 课：那个 can 说「会」；今天学一个能跟时间变形的说法。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "am", "able", "to", "going", "there", "myself", "now."],
        wrongToken: "going",
        answer: "going",
        correctionZh: "把 going 换成 go：able to go there。",
        explain: "be able to 后面穿原样——和第 44 课那块小垫板一个规矩。"
      },
      {
        kind: "arrange",
        promptZh: "再对照一句——第 163 课学过：我自己能做。",
        tokens: ["I", "can", "do", "it", "myself."],
        answer: "I can do it myself.",
        explain: "复现第 163 课：那句强调「我自己来」；今天强调「我现在能了」。"
      },
      {
        kind: "replace",
        promptZh: "句子换成过去：「I am able to go there myself now.」说她昨天做到了，怎么变？",
        replaceBase: "I am able to go there myself now.",
        replaceTarget: "换成说她昨天把它做完了",
        options: [
          "She was able to finish it yesterday.",
          "She is able to finish it yesterday.",
          "She was able finish it yesterday."
        ],
        answer: "She was able to finish it yesterday.",
        explain: "换时间就换前面那个 be：am→was——She 【was】 able to finish。后面照样穿原样。"
      }
    ],
    practice: [
      {
        promptZh: "你想说：我现在能自己去了。",
        tokens: ["I", "am", "able", "to", "go", "there", "myself", "now."],
        distractors: ["going"],
        answer: "I am able to go there myself now."
      },
      {
        promptZh: "你想说：我一个人去不了。",
        tokens: ["I", "am", "not", "able", "to", "go", "there", "alone."],
        distractors: ["going"],
        answer: "I am not able to go there alone."
      },
      {
        promptZh: "复习第 14 课：我会游泳。",
        tokens: ["I", "can", "swim."],
        distractors: ["swimming"],
        answer: "I can swim."
      },
      {
        promptZh: "你想说：她昨天把它做完了。",
        tokens: ["She", "was", "able", "to", "finish", "it", "yesterday."],
        distractors: ["is"],
        answer: "She was able to finish it yesterday."
      }
    ],
    recall: {
      promptZh: "妈妈说要送你去地铁站，你把地铁卡举给她看。凭记忆，写出你那句英文。",
      intentZh: "我现在能自己去了。",
      answer: "I am able to go there myself now.",
      noteZh: "be able to 后面穿原样——换时间就换前面那个 be。"
    },
    huntCaseIds: ["hunt-able-to-go"]
  },

  // ══════════════ L175 · So do I（倒装） ══════════════
  {
    id: "lesson-175-so-do-i",
    number: 175,
    title: "我也是",
    grammarLabel: "我也是 · So do I",
    episode: "小美的一天 一百七十五",
    scene: "campus",
    sceneSetupZh: "聊到喜欢的电影，同桌说她爱看动画片。小美发现自己也一样，顺口接了一句——用的是「我也是」里最利落的那个说法。",
    dialogueEn: "So do I.",
    dialogueZh: "小美跟着点了点头。",
    intentZh: "我也是。",
    targetSentence: "So do I.",
    blocks: [
      { text: "So", role: "也（跟着对方说）" },
      { text: "do I", role: "我也是（do 先站前面）" }
    ],
    oneLineRule: "接「我也是」有个利落的说法：So do I。它能省掉重复——对方说她喜欢，你接 So do I，就等于说「我也喜欢」。注意 do 站在 I 前面，顺序是倒着的。",
    examples: [
      { en: "So do I.", zh: "我也是。" },
      { en: "So am I.", zh: "我也是。（对方说的是 am/is 时，这里也跟着换）" },
      { en: "I like tea too.", zh: "我也喜欢茶。（第 145 课）" },
      { en: "I don't like coffee either.", zh: "我也不喜欢咖啡。（第 146 课）" }
    ],
    dialogue: [
      { who: "npc", en: "I love cartoons.", zh: "同桌一边翻手机一边说。" },
      { who: "npc", en: "Which one do you like?", zh: "她抬头问小美。" },
      { who: "me", en: "So do I.", zh: "轮到你说了——我也是。" }
    ],
    contrast: [
      {
        wrong: "So I do.",
        wrongMark: "I do",
        correct: "So do I.",
        whyZh: "顺序要倒过来——So 【do I】。do 先站前面，我（I）跟在后面。这是这个说法固定的形状。"
      },
      {
        wrong: "So do me.",
        wrongMark: "me",
        correct: "So do I.",
        whyZh: "后面站的是 I，不是 me——So do 【I】。这一句里「我」是做事的那个，所以用 I。"
      },
      {
        wrong: "So I am.",
        wrongMark: "I am",
        correct: "So am I.",
        whyZh: "对方说的是 be（I am happy），你接的也要用 be，而且照样倒过来——So 【am I】。用哪一半，看对方那句里站的是哪个词。"
      },
      {
        wrong: "I like tea too.",
        wrongMark: null,
        correct: "So do I.",
        bothRight: true,
        whyZh: "两句都对——第 145 课那句是完整的「我也喜欢茶」；今天这个 So do I 是把重复的部分省掉的说法，更利落。"
      },
      {
        wrong: "I don't like coffee either.",
        wrongMark: null,
        correct: "So do I.",
        bothRight: true,
        whyZh: "两句都对——第 146 课那句接的是「不」（也不喜欢）；今天这个接的是「也」（也一样）。"
      },
      {
        wrong: "Do you like cartoons?",
        wrongMark: null,
        correct: "So do I.",
        bothRight: true,
        whyZh: "两句都对——第 5 课那句是在问；今天这句是在接话。"
      }
    ],
    variants: [
      { label: "肯定", en: "So do I.", zh: "我也是。", noteZh: "对方说的是 do 类动作时用它。" },
      { label: "否定", en: "Neither do I.", zh: "我也不。", noteZh: "接否定用 Neither——第 149 课那个词。" },
      { label: "疑问", en: "So do you?", zh: "你也是吗？", noteZh: "把 I 换成 you 就成了反问。" }
    ],
    sceneSwings: [
      { sceneZh: "接一句我也是", en: "So do I.", zh: "我也是。" },
      { sceneZh: "对方说 I am happy 时接", en: "So am I.", zh: "我也是。" },
      { sceneZh: "说我也喜欢茶（第 145 课）", en: "I like tea too.", zh: "我也喜欢茶。" }
    ],
    deepDive: {
      title: "顺序为什么是倒的",
      paragraphs: [
        "第 145 课学过 too：I like tea too.（我也喜欢茶）。那是把整句说一遍。今天这个 So do I 是把重复的部分省掉——对方已经说过「喜欢」了，你不必再说一遍，只接一句「我也是」。",
        "它的形状是固定的：So + 对方那句里的那个帮手 + 我。对方说 I like…（用的帮手是 do），你接 So do I；对方说 I am…（帮手是 am），你接 So am I。",
        "注意顺序是倒着的：不是 So I do，是 So do I。帮手先站前面，我（I）跟后面。这个「倒过来」是它固定的形状，不能改。",
        "接否定的时候换一个词：对方说 I don't like…，你要接「我也不」，就用 Neither do I.（第 149 课那个 neither）。一个接「也」，一个接「也不」。"
      ]
    },
    summary: {
      rule: "接「我也是」用 So + 帮手 + I（顺序倒过来）——So do I／So am I；接「我也不」用 Neither do I。",
      points: [
        "So do I. —— do 站在 I 前面",
        "So I do. ❌ —— 顺序不能正着来",
        "I like tea too（第 145 课·完整说）／ So do I（今天·省掉重复）"
      ]
    },
    guided: [
      {
        kind: "choose",
        promptZh: "对方说她喜欢看动画片，你要接「我也是」。",
        before: "",
        after: "",
        options: ["So do I.", "So I do.", "So do me."],
        answer: "So do I.",
        explain: "顺序要倒过来——So 【do I】。do 先站前面，我（I）跟后面。"
      },
      {
        kind: "arrange",
        promptZh: "对方说她喜欢看动画片，你要接「我也是」。",
        tokens: ["So", "do", "I."],
        answer: "So do I.",
        explain: "也（So）＋ 帮手（do）＋ 我（I）——三个词，顺序是倒的。"
      },
      {
        kind: "arrange",
        promptZh: "先复习一小步——第 145 课学过：我也喜欢茶。",
        tokens: ["I", "like", "tea", "too."],
        answer: "I like tea too.",
        explain: "复现第 145 课：那是把整句说一遍；今天学一个省掉重复的说法。"
      },
      {
        kind: "spot",
        promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["So", "I", "do."],
        wrongToken: "I",
        answer: "I",
        correctionZh: "把 I 和 do 换个位置：So do I。",
        explain: "这个说法的顺序是倒的——帮手先站前面。"
      },
      {
        kind: "arrange",
        promptZh: "再对照一句——第 146 课学过：我也不喜欢咖啡。",
        tokens: ["I", "don't", "like", "coffee", "either."],
        answer: "I don't like coffee either.",
        explain: "复现第 146 课：那句接的是「也不」（用 either）；今天接的是「也」。"
      },
      {
        kind: "replace",
        promptZh: "对方换成说「我很开心（I am happy）」，你要接「我也是」，怎么说？",
        replaceBase: "So do I.",
        replaceTarget: "对方说的是 I am happy，你接「我也是」",
        options: ["So am I.", "So do I.", "So I am."],
        answer: "So am I.",
        explain: "对方那句站的帮手是 am，你接的也要用 am，而且照样倒过来——So 【am I】。"
      }
    ],
    practice: [
      {
        promptZh: "对方说她喜欢看动画片，你要接「我也是」。",
        tokens: ["So", "do", "I."],
        distractors: ["me"],
        answer: "So do I."
      },
      {
        promptZh: "对方说「我很开心」，你要接「我也是」。",
        tokens: ["So", "am", "I."],
        distractors: ["do"],
        answer: "So am I."
      },
      {
        promptZh: "复习第 145 课：我也喜欢茶。",
        tokens: ["I", "like", "tea", "too."],
        distractors: ["either"],
        answer: "I like tea too."
      },
      {
        promptZh: "对方说「我不喜欢咖啡」，你要接「我也不」。",
        tokens: ["Neither", "do", "I."],
        distractors: ["So"],
        answer: "Neither do I."
      }
    ],
    recall: {
      promptZh: "同桌说她爱看动画片，你发现自己也一样，顺口接了一句。凭记忆，写出你那句英文。",
      intentZh: "我也是。",
      answer: "So do I.",
      noteZh: "顺序是倒的——So do I／So am I，看对方那句站的帮手是谁。"
    },
    huntCaseIds: ["hunt-so-do-i"]
  }
];
