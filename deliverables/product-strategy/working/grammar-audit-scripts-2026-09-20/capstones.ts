/**
 * 季合并后的收口课补齐（L180–L183）
 *
 * 背景：末段 17 个小季合并为 6 个大季时，原本分散在各小季末尾的 4 节收口课
 * （L141/L144/L147/L150）只覆盖了前两季。后四季（L151-179）末尾是新授课，
 * 缺了「学完一季有个总结」的收束点。
 *
 * 这 4 课不引入新知识点（零新知），只把该季的句型排一行复习——
 * 与全库既有 18 节收口课的设计语言一致。
 */
import type { NewLesson } from "./types";

export const CAPSTONE_LESSONS: NewLesson[] = [
  // ══════════════ L180 · 第二十四季收口（L151-156）══════════════
  {
    id: "lesson-182-close-24",
    number: 182,
    title: "这一季排一行（全都、还没、多久）",
    grammarLabel: "收口 · 零新知（六件事排一行）",
    episode: "小美的一天 一百八十二",
    scene: "campus",
    sceneSetupZh: "期末前的教室，小美把这一阵子记的小纸条摊在桌上——数数、时间、先后，全是这段时间学的。",
    dialogueEn: "All the books are good, and she hasn't come yet.",
    dialogueZh: "小美把纸条一张张理齐。",
    intentZh: "这几本全都好，她还没来。",
    targetSentence: "All the books are good, and she hasn't come yet.",
    blocks: [
      { text: "All the books are good", role: "这几本全都好（第 151 课）" },
      { text: "and she hasn't come yet", role: "她还没来（第 153 课）" }
    ],
    oneLineRule: "这一季学的是「数量、时间、先后」：这几本全都好、每个学生都到了、她还没来、我已经吃过了、她三天前走的、我等了一个小时。六件事排一行，一句一件，说清身边的事。",
    examples: [
      { en: "All the books are good.", zh: "这几本全都好。（第 151 课）" },
      { en: "Every student is here.", zh: "每个学生都到了。（第 152 课）" },
      { en: "She hasn't come yet.", zh: "她还没来。（第 153 课）" },
      { en: "I have already eaten.", zh: "我已经吃过了。（第 153 课）" },
      { en: "She left three days ago.", zh: "她三天前走的。（第 155 课）" },
      { en: "I waited for an hour.", zh: "我等了一个小时。（第 156 课）" }
    ],
    dialogue: [
      { who: "npc", en: "Are these all yours?", zh: "同桌看着桌上那摞纸条问。" },
      { who: "npc", en: "Where is Lily?", zh: "她往门口看了一眼。" },
      { who: "me", en: "All the books are good, and she hasn't come yet.", zh: "轮到你说了——这几本全都好，她还没来。" }
    ],
    contrast: [
      {
        wrong: "All the books is good.",
        wrongMark: "is",
        correct: "All the books are good.",
        whyZh: "第 151 课回流：「这几本」是一群，搭档用 are——All the books 【are】 good。"
      },
      {
        wrong: "She doesn't come yet.",
        wrongMark: "doesn't come",
        correct: "She hasn't come yet.",
        whyZh: "第 153 课回流：说「还没」要用 hasn't + 做过版——She 【hasn't come】 yet。"
      },
      {
        wrong: "She left three days before.",
        wrongMark: "before",
        correct: "She left three days ago.",
        whyZh: "第 155 课回流：往回数用 ago 站句尾——three days 【ago】。"
      },
      {
        wrong: "I waited for an hour.",
        wrongMark: null,
        correct: "I waited for an hour.",
        bothRight: true,
        whyZh: "这句是对的——第 156 课：「数时长」用 for 接前面（for an hour）。它和第 155 课的 ago 正好一对。"
      },
      {
        wrong: "Every student is here.",
        wrongMark: null,
        correct: "All the books are good, and she hasn't come yet.",
        bothRight: true,
        whyZh: "两句都对——第 152 课那个 every 是「一个一个来」；今天这句用 all 说「一群都在内」。"
      },
      {
        wrong: "Most of the students like it.",
        wrongMark: null,
        correct: "All the books are good, and she hasn't come yet.",
        bothRight: true,
        whyZh: "两句都对——第 162 课那个 most 是「大多数」（大半在内）；今天这句的 all 是「一个不落」。"
      }
    ],
    variants: [
      { label: "肯定", en: "All the books are good.", zh: "这几本全都好。", noteZh: "第 151 课：all 站最前面。" },
      { label: "否定", en: "She hasn't come yet.", zh: "她还没来。", noteZh: "第 153 课：说「还没」用 hasn't…yet。" },
      { label: "疑问", en: "Has she come yet?", zh: "她来了吗？", noteZh: "Has 搬到句首。" }
    ],
    sceneSwings: [
      { sceneZh: "说这几本全都好（第 151 课）", en: "All the books are good.", zh: "这几本全都好。" },
      { sceneZh: "说她还没来（第 153 课）", en: "She hasn't come yet.", zh: "她还没来。" },
      { sceneZh: "说她三天前走的（第 155 课）", en: "She left three days ago.", zh: "她三天前走的。" }
    ],
    deepDive: {
      title: "这一季的四对搭档",
      paragraphs: [
        "第一对：all 和 every。all 说「一群都在内」（All the books are good）；every 说「一个一个来」（Every student is here）。",
        "第二对：yet 和 already。还没做用 hasn't…yet（她还没来）；已经做了用 have already（我已经吃过了）。",
        "第三对：ago 和 for。往回数用 ago 站句尾（three days ago）；数时长用 for 接前面（for an hour）。",
        "第四对：still 和 yet。still 说「一直在」（She is still waiting）；yet 说「还没」（She hasn't come yet）。一边是一直，一边是还没。"
      ]
    },
    summary: {
      rule: "这一季六件事：全都／每个、还没／已经、还在、多久以前／持续多久——一句一件，说清身边的事。",
      points: [
        "All the books are good. —— all 一群都在内",
        "Every student is here. —— every 一个一个来",
        "She hasn't come yet.（还没）／ I have already eaten.（已经）—— 一对"
      ]
    },
    guided: [
      { kind: "choose", promptZh: "你想说：这几本全都好。", before: "", after: "the books are good.",
        options: ["All", "Every", "Both"], answer: "All", explain: "「这几本」是一群（三个以上）用 all——All the books。" },
      { kind: "arrange", promptZh: "你想说：这几本全都好。",
        tokens: ["All", "the", "books", "are", "good."], answer: "All the books are good.",
        explain: "第 151 课：all 站最前面，后面那群东西带 s、搭档用 are。" },
      { kind: "arrange", promptZh: "先复习一小步——第 152 课学过：每个学生都到了。",
        tokens: ["Every", "student", "is", "here."], answer: "Every student is here.",
        explain: "复现第 152 课：every 是「一个一个来」，后面跟一个。" },
      { kind: "spot", promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["She", "doesn't", "come", "yet."], wrongToken: "doesn't come", answer: "doesn't come",
        correctionZh: "改成 She hasn't come yet：说「还没」用 hasn't + 做过版。",
        explain: "第 153 课：还没做用 hasn't…yet。" },
      { kind: "arrange", promptZh: "再对照一句——第 155 课学过：她三天前走的。",
        tokens: ["She", "left", "three", "days", "ago."], answer: "She left three days ago.",
        explain: "复现第 155 课：往回数用 ago 站句尾。" },
      { kind: "replace", promptZh: "句子换时间：「She left three days ago.」把三天换成一个小时，怎么变？",
        replaceBase: "She left three days ago.", replaceTarget: "把 three days 换成一个小时",
        options: ["She left an hour ago.", "She left an hour before.", "She left for an hour."],
        answer: "She left an hour ago.",
        explain: "换时间只换那段，ago 照样站句尾——第 155 课的规矩。" }
    ],
    practice: [
      { promptZh: "你想说：这几本全都好。", tokens: ["All", "the", "books", "are", "good."], distractors: ["Every"], answer: "All the books are good." },
      { promptZh: "你想说：她还没来。", tokens: ["She", "hasn't", "come", "yet."], distractors: ["already"], answer: "She hasn't come yet." },
      { promptZh: "复习第 152 课：每个学生都到了。", tokens: ["Every", "student", "is", "here."], distractors: ["are"], answer: "Every student is here." },
      { promptZh: "复习第 156 课：我等了一个小时。", tokens: ["I", "waited", "for", "an", "hour."], distractors: ["ago"], answer: "I waited for an hour." },
      { promptZh: "你想说：我已经吃过了。", tokens: ["I", "have", "already", "eaten."], distractors: ["yet"], answer: "I have already eaten." }
    ],
    recall: {
      promptZh: "期末前的教室，你把这一阵子记的小纸条摊在桌上。凭记忆，写出你那句英文。",
      intentZh: "这几本全都好，她还没来。",
      answer: "All the books are good, and she hasn't come yet.",
      noteZh: "这一季六件事排一行——全部、每个、还没、已经、还在、多久。"
    },
    huntCaseIds: ["hunt-close-24-row"]
  },

  // ══════════════ L181 · 第二十五季收口（L157-162）══════════════
  {
    id: "lesson-183-close-25",
    number: 183,
    title: "这一季排一行（一个都不、看起来像）",
    grammarLabel: "收口 · 零新知（身边的事排一行）",
    episode: "小美的一天 一百八十三",
    scene: "city",
    sceneSetupZh: "放学回家的路上，小美一路看一路想——家里一个人都没有、天上那朵云像条船、牛奶也得买了。",
    dialogueEn: "Nobody is at home, and the cloud looks like a boat.",
    dialogueZh: "小美边走边抬头看天。",
    intentZh: "家里一个人都没有，那朵云看起来像条船。",
    targetSentence: "Nobody is at home, and the cloud looks like a boat.",
    blocks: [
      { text: "Nobody is at home", role: "家里一个人都没有（第 158 课）" },
      { text: "and the cloud looks like a boat", role: "那朵云像条船（第 159 课）" }
    ],
    oneLineRule: "这一季学的是「身边的事」：一个都不（none／nobody）、看起来像（look like）、好像（seem to）、需要（need to）、大多数（most of）。五件事排一行，都是抬眼就能说的。",
    examples: [
      { en: "None of the cups are mine.", zh: "这些杯子一个都不是我的。（第 157 课）" },
      { en: "Nobody is at home.", zh: "家里一个人都没有。（第 158 课）" },
      { en: "It looks like a boat.", zh: "它看起来像一条船。（第 159 课）" },
      { en: "He seems to know you.", zh: "他好像认识你。（第 160 课）" },
      { en: "I need to buy some milk.", zh: "我需要买点牛奶。（第 161 课）" },
      { en: "Most of the students like it.", zh: "大多数学生都喜欢它。（第 162 课）" }
    ],
    dialogue: [
      { who: "npc", en: "Is anyone home?", zh: "小美推门前停了一下。" },
      { who: "npc", en: "Look at that cloud!", zh: "她抬头看了看天。" },
      { who: "me", en: "Nobody is at home, and the cloud looks like a boat.", zh: "轮到你说了——家里一个人都没有，那朵云像条船。" }
    ],
    contrast: [
      {
        wrong: "None of the cups is mine.",
        wrongMark: "is",
        correct: "None of the cups are mine.",
        whyZh: "第 157 课回流：cups 是一群，搭档用 are——None of the cups 【are】 mine。"
      },
      {
        wrong: "Nobody are at home.",
        wrongMark: "are",
        correct: "Nobody is at home.",
        whyZh: "第 158 课回流：nobody 说的是「一个人」，搭档用 is——Nobody 【is】 at home。"
      },
      {
        wrong: "It looks a boat.",
        wrongMark: "a",
        correct: "It looks like a boat.",
        whyZh: "第 159 课回流：说「像」要带上 like——looks 【like】 a boat。少了它就成了「看一个船」。"
      },
      {
        wrong: "He seems to know you.",
        wrongMark: null,
        correct: "He seems to know you.",
        bothRight: true,
        whyZh: "这句是对的——第 160 课：seem 后面垫个 to（seems 【to】 know）。"
      },
      {
        wrong: "I need to buy some milk.",
        wrongMark: null,
        correct: "Nobody is at home, and the cloud looks like a boat.",
        bothRight: true,
        whyZh: "两句都对——第 161 课那个 need to 是「需要」（后面垫 to）；今天这句是说「身边的样子」。"
      },
      {
        wrong: "Most of the students like it.",
        wrongMark: null,
        correct: "Nobody is at home, and the cloud looks like a boat.",
        bothRight: true,
        whyZh: "两句都对——第 162 课那个 most 后面拴 of；今天这句说「一个人都没有」和「像条船」。"
      }
    ],
    variants: [
      { label: "肯定", en: "Nobody is at home.", zh: "家里一个人都没有。", noteZh: "第 158 课：nobody 配 is。" },
      { label: "否定", en: "It doesn't look like a boat.", zh: "它看起来不像船。", noteZh: "说「不像」用 doesn't look like。" },
      { label: "疑问", en: "Does it look like a boat?", zh: "它看起来像船吗？", noteZh: "Does 搬到句首，look 退回原样。" }
    ],
    sceneSwings: [
      { sceneZh: "说家里一个人都没有（第 158 课）", en: "Nobody is at home.", zh: "家里一个人都没有。" },
      { sceneZh: "说那朵云像条船（第 159 课）", en: "The cloud looks like a boat.", zh: "那朵云看起来像一条船。" },
      { sceneZh: "说需要买点牛奶（第 161 课）", en: "I need to buy some milk.", zh: "我需要买点牛奶。" }
    ],
    deepDive: {
      title: "这一季的三对搭档",
      paragraphs: [
        "第一对：none 和 nobody。说东西用 none 后面拴 of（None of the cups）；说人用 nobody，它自己就装着一个「人」（Nobody is at home）。",
        "第二对：look like 和 seem to。看着像什么用 look like（It looks like a boat）；说着好像发生的用 seem to（He seems to know you）。",
        "第三对：need to 和 have to。need 是「这件事本身要办」（I need to buy some milk）；have to 是「不得不」（第 16 课）。",
        "还有一个：most of。它和第 157 课的 none of 正好一头一尾——一个「大多数都」，一个「一个都不」，后面都拴 of。"
      ]
    },
    summary: {
      rule: "这一季五件事：一个都不（none／nobody）、看起来像（look like）、好像（seem to）、需要（need to）、大多数（most of）。",
      points: [
        "None of the cups are mine.（东西）／ Nobody is at home.（人）—— 一个都不的两个说法",
        "It looks like a boat. —— 说「像」带上 like",
        "I need to buy some milk. —— need 后面垫 to"
      ]
    },
    guided: [
      { kind: "choose", promptZh: "你想说：家里一个人都没有。", before: "", after: "at home.",
        options: ["Nobody is", "Nobody are", "None is"], answer: "Nobody is", explain: "说人用 nobody——它装着一个「人」，搭档用 is。" },
      { kind: "arrange", promptZh: "你想说：家里一个人都没有。",
        tokens: ["Nobody", "is", "at", "home."], answer: "Nobody is at home.",
        explain: "第 158 课：nobody 自己就含「一个都不」，后面不再加 not。" },
      { kind: "arrange", promptZh: "先复习一小步——第 157 课学过：这些杯子一个都不是我的。",
        tokens: ["None", "of", "the", "cups", "are", "mine."], answer: "None of the cups are mine.",
        explain: "复现第 157 课：说东西用 none 后面拴 of。" },
      { kind: "spot", promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["It", "looks", "a", "boat."], wrongToken: "a", answer: "a",
        correctionZh: "在 a 前面补 like：It looks like a boat。",
        explain: "第 159 课：说「像」要带上 like。" },
      { kind: "arrange", promptZh: "再对照一句——第 161 课学过：我需要买点牛奶。",
        tokens: ["I", "need", "to", "buy", "some", "milk."], answer: "I need to buy some milk.",
        explain: "复现第 161 课：need 后面垫个 to。" },
      { kind: "replace", promptZh: "句子换样子：「It looks like a boat.」换成说「不像船」，怎么变？",
        replaceBase: "It looks like a boat.", replaceTarget: "换成说「它看起来不像船」",
        options: ["It doesn't look like a boat.", "It doesn't looks like a boat.", "It not look like a boat."],
        answer: "It doesn't look like a boat.",
        explain: "说「不像」用 doesn't，而且 look 退回原样（第 132 课的老规矩）。" }
    ],
    practice: [
      { promptZh: "你想说：家里一个人都没有。", tokens: ["Nobody", "is", "at", "home."], distractors: ["are"], answer: "Nobody is at home." },
      { promptZh: "你想说：它看起来像一条船。", tokens: ["It", "looks", "like", "a", "boat."], distractors: ["look"], answer: "It looks like a boat." },
      { promptZh: "复习第 157 课：这些杯子一个都不是我的。", tokens: ["None", "of", "the", "cups", "are", "mine."], distractors: ["is"], answer: "None of the cups are mine." },
      { promptZh: "复习第 162 课：大多数学生都喜欢它。", tokens: ["Most", "of", "the", "students", "like", "it."], distractors: ["likes"], answer: "Most of the students like it." },
      { promptZh: "你想说：我需要买点牛奶。", tokens: ["I", "need", "to", "buy", "some", "milk."], distractors: ["buying"], answer: "I need to buy some milk." },
      { promptZh: "你想问：它看起来像船吗？", tokens: ["Does", "it", "look", "like", "a", "boat?"], distractors: ["looks"], answer: "Does it look like a boat?" }
    ],
    recall: {
      promptZh: "放学路上你一路看一路想——家里没人、云像条船、牛奶该买了。凭记忆，写出你那句英文。",
      intentZh: "家里一个人都没有，那朵云看起来像条船。",
      answer: "Nobody is at home, and the cloud looks like a boat.",
      noteZh: "这一季五件事排一行——一个都不、像什么、好像、需要、大多数。"
    },
    huntCaseIds: ["hunt-close-25-row"]
  },

  // ══════════════ L182 · 第二十六季收口（L163-169）══════════════
  {
    id: "lesson-184-close-26",
    number: 184,
    title: "这一季排一行（我自己、太多、怎么不）",
    grammarLabel: "收口 · 零新知（日常六句排一行）",
    episode: "小美的一天 一百八十四",
    scene: "campus",
    sceneSetupZh: "自习课上，小美把这一阵子顺口学会的几句串在一起想了一遍——自己做、互相帮、人太多、怎么不歇会儿。",
    dialogueEn: "I can do it myself, and we help each other.",
    dialogueZh: "小美在本子上写下这两句。",
    intentZh: "我自己能做，我们互相帮忙。",
    targetSentence: "I can do it myself, and we help each other.",
    blocks: [
      { text: "I can do it myself", role: "我自己能做（第 163 课）" },
      { text: "and we help each other", role: "我们互相帮忙（第 165 课）" }
    ],
    oneLineRule: "这一季学的是「日常里最顺口的几句」：我自己能做（myself）、我们互相帮忙（each other）、人太多了（too many）、我有很多朋友（a lot of）、你怎么不歇会儿（Why don't you）、我想要一杯茶（I'd like）。六句排一行，张口就能用。",
    examples: [
      { en: "I can do it myself.", zh: "我自己能做。（第 163 课）" },
      { en: "We help each other.", zh: "我们互相帮忙。（第 165 课）" },
      { en: "There are too many people.", zh: "人太多了。（第 166 课）" },
      { en: "I have a lot of friends.", zh: "我有很多朋友。（第 167 课）" },
      { en: "Why don't you take a rest?", zh: "你怎么不歇一会儿？（第 168 课）" },
      { en: "I'd like a cup of tea.", zh: "我想要一杯茶。（第 169 课）" }
    ],
    dialogue: [
      { who: "npc", en: "Do you need help?", zh: "同桌看小美一个人搬书。" },
      { who: "npc", en: "We can do it together.", zh: "她伸手要接。" },
      { who: "me", en: "I can do it myself, and we help each other.", zh: "轮到你说了——我自己能做，我们互相帮忙。" }
    ],
    contrast: [
      {
        wrong: "I can do it me.",
        wrongMark: "me",
        correct: "I can do it myself.",
        whyZh: "第 163 课回流：说「我自己」用 myself——I can do it 【myself】。"
      },
      {
        wrong: "We help each others.",
        wrongMark: "others",
        correct: "We help each other.",
        whyZh: "第 165 课回流：each other 后面不加 s——它本来就说「互相」。"
      },
      {
        wrong: "There are too much people.",
        wrongMark: "much",
        correct: "There are too many people.",
        whyZh: "第 166 课回流：「人」数得出来，用 many——too 【many】 people。"
      },
      {
        wrong: "I have a lot friends.",
        wrongMark: "lot",
        correct: "I have a lot of friends.",
        whyZh: "第 167 课回流：a lot of 三个词一起出场——a lot 【of】 friends。"
      },
      {
        wrong: "Why don't you take a rest?",
        wrongMark: null,
        correct: "I can do it myself, and we help each other.",
        bothRight: true,
        whyZh: "两句都对——第 168 课那句是劝对方歇会儿；今天这句说「我自己来」和「互相帮忙」。"
      },
      {
        wrong: "I'd like a cup of tea.",
        wrongMark: null,
        correct: "I can do it myself, and we help each other.",
        bothRight: true,
        whyZh: "两句都对——第 169 课那句是「我想要」（客气说法）；今天这句说「自己做／互相帮」。"
      }
    ],
    variants: [
      { label: "肯定", en: "I can do it myself.", zh: "我自己能做。", noteZh: "第 163 课：myself 站句尾。" },
      { label: "否定", en: "We don't help each other.", zh: "我们不互相帮忙。", noteZh: "说「不」用 don't。" },
      { label: "疑问", en: "Can you do it yourself?", zh: "你自己能做吗？", noteZh: "Can 搬到句首，myself→yourself。" }
    ],
    sceneSwings: [
      { sceneZh: "说我自己能做（第 163 课）", en: "I can do it myself.", zh: "我自己能做。" },
      { sceneZh: "说我们互相帮忙（第 165 课）", en: "We help each other.", zh: "我们互相帮忙。" },
      { sceneZh: "说人太多了（第 166 课）", en: "There are too many people.", zh: "人太多了。" }
    ],
    deepDive: {
      title: "这一季的三组搭配",
      paragraphs: [
        "第一组：myself 和 each other。myself 说「我本人」（I can do it myself）；each other 说「互相」（We help each other）。一个指自己，一个指彼此。",
        "第二组：too many 和 a lot of。too many 是「太多」（嫌多：There are too many people）；a lot of 是「很多」（正常：I have a lot of friends）。一个抱怨，一个陈述。",
        "第三组：Why don't you 和 I'd like。Why don't you 是劝对方（Why don't you take a rest）；I'd like 是说自己想要（I'd like a cup of tea）。一个朝外，一个朝内。",
        "还有一条：这三组都是口语里天天用的。「日常里最顺口的几句」——它们的共同点是短、能直接搬去用。"
      ]
    },
    summary: {
      rule: "这一季六句话：我自己能做、我们互相帮忙、人太多了、我有很多朋友、你怎么不歇会儿、我想要一杯茶。",
      points: [
        "myself（我自己）／ each other（互相）—— 一个指自己，一个指彼此",
        "too many（太多·嫌多）／ a lot of（很多·正常）—— 一个抱怨，一个陈述",
        "Why don't you（劝对方）／ I'd like（说自己）"
      ]
    },
    guided: [
      { kind: "choose", promptZh: "你想说：我自己能做。", before: "I can do it", after: ".",
        options: ["myself", "me", "me other"], answer: "myself", explain: "第 163 课：说「我自己」用 myself——站在句尾。" },
      { kind: "arrange", promptZh: "你想说：我们互相帮忙。",
        tokens: ["We", "help", "each", "other."], answer: "We help each other.",
        explain: "第 165 课：each other 站句尾，两个词一起出场。" },
      { kind: "arrange", promptZh: "先复习一小步——第 166 课学过：人太多了。",
        tokens: ["There", "are", "too", "many", "people."], answer: "There are too many people.",
        explain: "复现第 166 课：「人」数得出来用 many。" },
      { kind: "spot", promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "have", "a", "lot", "friends."], wrongToken: "lot", answer: "lot",
        correctionZh: "在 lot 后面补 of：I have a lot of friends。",
        explain: "第 167 课：a lot of 三个词不能少。" },
      { kind: "arrange", promptZh: "再对照一句——第 168 课学过：你怎么不歇一会儿？",
        tokens: ["Why", "don't", "you", "take", "a", "rest?"], answer: "Why don't you take a rest?",
        explain: "复现第 168 课：don't 跟着 Why 站前面。" },
      { kind: "replace", promptZh: "句子换说法：「I'd like a cup of tea.」还原成完整说法，怎么变？",
        replaceBase: "I'd like a cup of tea.", replaceTarget: "把 I'd 还原成完整说法",
        options: ["I would like a cup of tea.", "I will like a cup of tea.", "I do like a cup of tea."],
        answer: "I would like a cup of tea.",
        explain: "第 169 课：那个小撇号是省掉的 would——还原就是 I would like。" }
    ],
    practice: [
      { promptZh: "你想说：我自己能做。", tokens: ["I", "can", "do", "it", "myself."], distractors: ["me"], answer: "I can do it myself." },
      { promptZh: "你想说：我们互相帮忙。", tokens: ["We", "help", "each", "other."], distractors: ["others"], answer: "We help each other." },
      { promptZh: "复习第 166 课：人太多了。", tokens: ["There", "are", "too", "many", "people."], distractors: ["much"], answer: "There are too many people." },
      { promptZh: "复习第 167 课：我有很多朋友。", tokens: ["I", "have", "a", "lot", "of", "friends."], distractors: ["lot's"], answer: "I have a lot of friends." },
      { promptZh: "你想说：我想要一杯茶。", tokens: ["I'd", "like", "a", "cup", "of", "tea."], distractors: ["Id"], answer: "I'd like a cup of tea." },
      { promptZh: "你想问：你自己能做吗？", tokens: ["Can", "you", "do", "it", "yourself?"], distractors: ["myself"], answer: "Can you do it yourself?" }
    ],
    recall: {
      promptZh: "自习课上你把这一阵子顺口学会的几句串着想了一遍。凭记忆，写出你那句英文。",
      intentZh: "我自己能做，我们互相帮忙。",
      answer: "I can do it myself, and we help each other.",
      noteZh: "这一季六句排一行——自己做、互相帮、太多、很多、怎么不、想要。"
    },
    huntCaseIds: ["hunt-close-26-row"]
  },

  // ══════════════ L183 · 第二十七季收口（L170-179）══════════════
  {
    id: "lesson-185-close-27",
    number: 185,
    title: "这一季排一行（成对儿的说法）",
    grammarLabel: "收口 · 零新知（五对八句排一行）",
    episode: "小美的一天 一百八十五",
    scene: "campus",
    sceneSetupZh: "毕业前的最后一节自习课，小美把这一季学的成对说法在心里过了一遍——都是成对出现的，记住一个就想起另一个。",
    dialogueEn: "She can both sing and dance, and she likes neither tea nor coffee.",
    dialogueZh: "小美合上本子，靠在椅背上。",
    intentZh: "她既会唱歌又会跳舞，她既不喜欢茶也不喜欢咖啡。",
    targetSentence: "She can both sing and dance, and she likes neither tea nor coffee.",
    blocks: [
      { text: "She can both sing and dance", role: "她既会唱歌又会跳舞（第 170 课）" },
      { text: "and she likes neither tea nor coffee", role: "她既不喜欢茶也不喜欢咖啡（第 171 课）" }
    ],
    oneLineRule: "这一季的八个说法是成对出现的：both…and／neither…nor、unless／in order to、be able to／So do I、would rather／prefer、had + 做过版／Shall we。记住一个，另一个就在旁边。",
    examples: [
      { en: "She can both sing and dance.", zh: "她既会唱歌又会跳舞。（第 170 课）" },
      { en: "I like neither spicy food nor noodles.", zh: "辣的我不喜欢，面我也不喜欢。（第 171 课）" },
      { en: "We will go unless it rains.", zh: "除非下雨，不然我们就去。（第 172 课）" },
      { en: "I got up early in order to catch the bus.", zh: "为了赶上那班车，我起得很早。（第 173 课）" },
      { en: "I am able to go there myself now.", zh: "我现在能自己去了。（第 174 课）" },
      { en: "So do I.", zh: "我也是。（第 175 课）" },
      { en: "I would rather walk.", zh: "我宁愿走路。（第 176 课）" },
      { en: "I prefer tea to coffee.", zh: "比起咖啡，我更喜欢茶。（第 177 课）" },
      { en: "I had lost my key before I got home.", zh: "到家之前我就把钥匙弄丢了。（第 178 课）" },
      { en: "Shall we take the quiet way?", zh: "我们走清静的那条好吗？（第 179 课）" }
    ],
    dialogue: [
      { who: "npc", en: "Tell me about your cousin.", zh: "同桌翻着毕业纪念册问。" },
      { who: "npc", en: "Does she like tea?", zh: "她指着照片旁边那个人。" },
      { who: "me", en: "She can both sing and dance, and she likes neither tea nor coffee.", zh: "轮到你说了——她既会唱歌又会跳舞，既不喜欢茶也不喜欢咖啡。" }
    ],
    contrast: [
      {
        wrong: "She can both sing or dance.",
        wrongMark: "or",
        correct: "She can both sing and dance.",
        whyZh: "第 170 课回流：两样都占接 and——both sing 【and】 dance。or 是挑一个。"
      },
      {
        wrong: "She likes neither tea or coffee.",
        wrongMark: "or",
        correct: "She likes neither tea nor coffee.",
        whyZh: "第 171 课回流：前面是 neither，后面就用 nor——neither …【nor】。"
      },
      {
        wrong: "I prefer tea than coffee.",
        wrongMark: "than",
        correct: "I prefer tea to coffee.",
        whyZh: "第 177 课回流：prefer 后面那半截用 to 领——prefer tea 【to】 coffee。than 是比较大小用的（第 17 课）。"
      },
      {
        wrong: "I would rather to walk.",
        wrongMark: "to",
        correct: "I would rather walk.",
        whyZh: "第 176 课回流：would rather 后面穿原样，不垫 to——垫 to 的是 would like（第 62 课）。"
      },
      {
        wrong: "Shall we take the quiet way?",
        wrongMark: null,
        correct: "She can both sing and dance, and she likes neither tea nor coffee.",
        bothRight: true,
        whyZh: "两句都对——第 179 课那句是问「咱们一起…行吗」；今天这句是陈述。"
      },
      {
        wrong: "I had lost my key before I got home.",
        wrongMark: null,
        correct: "She can both sing and dance, and she likes neither tea nor coffee.",
        bothRight: true,
        whyZh: "两句都对——第 178 课那句用 had 分先后；今天这句说的是「两样都占」和「两样都否」。"
      }
    ],
    variants: [
      { label: "肯定", en: "She can both sing and dance.", zh: "她既会唱歌又会跳舞。", noteZh: "第 170 课：both…and 一对夹子。" },
      { label: "否定", en: "She likes neither tea nor coffee.", zh: "她既不喜欢茶也不喜欢咖啡。", noteZh: "第 171 课：neither…nor 一对夹子。" },
      { label: "疑问", en: "Can she both sing and dance?", zh: "她既会唱歌又会跳舞吗？", noteZh: "Can 搬到句首，两个夹子不动。" }
    ],
    sceneSwings: [
      { sceneZh: "说她既会唱又会跳（第 170 课）", en: "She can both sing and dance.", zh: "她既会唱歌又会跳舞。" },
      { sceneZh: "说两样都不喜欢（第 171 课）", en: "I like neither spicy food nor noodles.", zh: "辣的我不喜欢，面我也不喜欢。" },
      { sceneZh: "说宁愿走路（第 176 课）", en: "I would rather walk.", zh: "我宁愿走路。" }
    ],
    deepDive: {
      title: "五对，正好配齐",
      paragraphs: [
        "第一对：both…and 和 neither…nor。一个「两样都占」（She can both sing and dance），一个「两样都否」（neither tea nor coffee）。前面那个词变了，后面跟着变——both 配 and，neither 配 nor。",
        "第二对：unless 和 if。第 48 课那个 if 是「如果」（从条件说），第 172 课的 unless 是「除非」（从例外说）——同一件事的两面。",
        "第三对：be able to 和 can。「会什么」用 can（第 14 课）；说「某一次做到了」或者要跟时间变化，用 be able to（第 174 课）。",
        "第四对：would rather 和 prefer。当场选一个用 would rather（第 176 课）；说平时的偏好用 prefer，后面那半截用 to（第 177 课）。",
        "第五对：had + 做过版 和 Shall we。第 178 课那个 had 是把「往回看」挪到过去（更早那件事）；第 179 课的 Shall we 是征求意见。两件不相干，但都在这一季里配齐了。"
      ]
    },
    summary: {
      rule: "这一季五对成对的说法：both…and／neither…nor、unless／if、be able to／can、would rather／prefer、had + 做过版／Shall we。",
      points: [
        "both sing and dance（两样都占）／ neither tea nor coffee（两样都否）",
        "prefer tea to coffee —— 那半截用 to，不用 than",
        "would rather walk —— 后面穿原样，不垫 to"
      ]
    },
    guided: [
      { kind: "choose", promptZh: "你想说：她既会唱歌又会跳舞。", before: "She can both sing", after: "dance.",
        options: ["and", "or", "nor"], answer: "and", explain: "第 170 课：两样都占接 and——both sing 【and】 dance。" },
      { kind: "arrange", promptZh: "你想说：她既会唱歌又会跳舞。",
        tokens: ["She", "can", "both", "sing", "and", "dance."], answer: "She can both sing and dance.",
        explain: "第 170 课：both 站第一样前，and 站第二样前。" },
      { kind: "arrange", promptZh: "先复习一小步——第 171 课学过：辣的我不喜欢，面我也不喜欢。",
        tokens: ["I", "like", "neither", "spicy", "food", "nor", "noodles."], answer: "I like neither spicy food nor noodles.",
        explain: "复现第 171 课：neither…nor 一对，两样都否。" },
      { kind: "spot", promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？",
        tokens: ["I", "prefer", "tea", "than", "coffee."], wrongToken: "than", answer: "than",
        correctionZh: "把 than 换成 to：I prefer tea to coffee。",
        explain: "第 177 课：prefer 后面那半截用 to 领。" },
      { kind: "arrange", promptZh: "再对照一句——第 176 课学过：我宁愿走路。",
        tokens: ["I", "would", "rather", "walk."], answer: "I would rather walk.",
        explain: "复现第 176 课：rather 站在 would 后面，后面穿原样。" },
      { kind: "replace", promptZh: "句子换说法：「I would rather walk.」换成「更喜欢走路」，怎么变？",
        replaceBase: "I would rather walk.", replaceTarget: "换成说他比起跑步更喜欢走路",
        options: ["He prefers walking to running.", "He prefers walk to run.", "He prefers walking than running."],
        answer: "He prefers walking to running.",
        explain: "第 177 课：prefer 两头都穿 -ing，那半截照样用 to。" }
    ],
    practice: [
      { promptZh: "你想说：她既会唱歌又会跳舞。", tokens: ["She", "can", "both", "sing", "and", "dance."], distractors: ["or"], answer: "She can both sing and dance." },
      { promptZh: "你想说：她既不喜欢茶也不喜欢咖啡。", tokens: ["She", "likes", "neither", "tea", "nor", "coffee."], distractors: ["or"], answer: "She likes neither tea nor coffee." },
      { promptZh: "复习第 177 课：比起咖啡，我更喜欢茶。", tokens: ["I", "prefer", "tea", "to", "coffee."], distractors: ["than"], answer: "I prefer tea to coffee." },
      { promptZh: "复习第 176 课：我宁愿走路。", tokens: ["I", "would", "rather", "walk."], distractors: ["to"], answer: "I would rather walk." },
      { promptZh: "复习第 178 课：到家之前我就把钥匙弄丢了。", tokens: ["I", "had", "lost", "my", "key", "before", "I", "got", "home."], distractors: ["lose"], answer: "I had lost my key before I got home." }
    ],
    recall: {
      promptZh: "毕业前最后一节自习课，你把这一季学的成对说法在心里过了一遍。凭记忆，写出你那句英文。",
      intentZh: "她既会唱歌又会跳舞，她既不喜欢茶也不喜欢咖啡。",
      answer: "She can both sing and dance, and she likes neither tea nor coffee.",
      noteZh: "这一季五对成对的说法——记住一个，另一个就在旁边。"
    },
    huntCaseIds: ["hunt-close-27-row"]
  }
];
