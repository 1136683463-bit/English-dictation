import type { LanguageGate } from "../types";

/**
 * 图书馆世界（S4 句子变长）· 批 1：G1–G4（GRAMMAR_ADVENTURE_PLAN §5 第五世界）。
 *
 * 世界机制：有些书只有说出完整长句才会打开——句子缺一块，书页就纹丝不动；
 * 句子搭完整，封面自己弹开。误读支线四拍模板：
 * ①「」复读玩家句子 → ②书/书架的具象反应 → ③缺了哪一块的后果 → ④lampHint 点拨。
 *
 * 红线与既往世界一致：「」内引文豁免语法与禁用词检测。
 */

export const LIBRARY_WORLD_ID = "library";

/** 图书馆的门按关卡序排列（1–10，本批 1–4）。 */
export const LIBRARY_GATES: LanguageGate[] = [
  // ── G1 · 连词 because：说出原因 ──────────────────────────────────
  {
    id: "library-gate-1",
    topicId: "s4-conjunction",
    runeId: "rune-conjunction-shuttle",
    mode: "complete",
    npcLine: "The librarian holds a book that will not open. \"It is waiting for a reason,\" she says. \"Finish the line on its cover: I stayed home ___ it rained.\"",
    npcLineZh: "图书管理员捧着一本打不开的书。“它在等一个理由，”她说，“把封面上的句子补完：I stayed home ___ it rained。”",
    zhIntent: "补全这句话：I stayed home ___ it rained.（为什么待在家？）",
    canDo: "说清原因「下雨了，所以我待在家里」",
    requiredPattern: "I stayed home because it rained.",
    sampleAnswer: "I stayed home because it rained.",
    hints: [
      "I stayed home b______ it rained.",
      "说出原因，用 because 当梭子把两句话织在一起。",
      "I stayed home because it rained."
    ],
    skeleton: { subject: "I", verb: "stayed home because…（做事的理由）", subjectLabel: "谁", verbLabel: "做了什么、为什么" },
    counterExample: "I stayed home because so it rained.",
    counterNote: "because 和 so 不能同时上场——梭子只要一把",
    acceptRegex: "^i\\s+stayed\\s+home\\s+because\\s+it\\s+rained[.!]?$",
    misreadBranches: [
      {
        errorTag: "run_on",
        npcReply: "「I stayed home because so it rained」— the book creaks, its spine straining at two shuttles in one loom. The cover stays shut: the sentence is woven twice, and holds nothing.",
        npcReplyZh: "「I stayed home because so it rained」——书脊吱呀作响，一台织机塞了两把梭子。封面合着：这句话织了两遍，什么也没兜住。",
        lampHint: "because 和 so 留一个就够：I stayed home because it rained。"
      }
    ]
  },

  // ── G2 · 连词 but：转折 ─────────────────────────────────────────
  {
    id: "library-gate-2",
    topicId: "s4-conjunction",
    runeId: "rune-conjunction-shuttle",
    mode: "say",
    npcLine: "A second book slides forward. On its cover: a raincloud and a sunny hill. \"Two halves that pull apart,\" the librarian says. \"Tell me—the book was long. What about the story?\"",
    npcLineZh: "第二本书滑了出来。封面上：一朵雨云和一座阳光下的山丘。“互相拉扯的两半，”管理员说，“告诉我——书很长。那故事呢？”",
    zhIntent: "说书很长，但是故事很有趣。",
    canDo: "说清转折「书很长，但故事很有趣」",
    requiredPattern: "The book was long, but the story was interesting.",
    sampleAnswer: "The book was long, but the story was interesting.",
    hints: [
      "The book was long, b__ the story was interesting.",
      "两半往相反方向拉，用 but 当梭子。",
      "The book was long, but the story was interesting."
    ],
    skeleton: { subject: "The book / the story", verb: "was long, but was interesting（两半相反）", subjectLabel: "书 / 故事", verbLabel: "各是什么样" },
    counterExample: "The book was long, and the story was interesting.",
    counterNote: "两半在拉扯（长vs有趣），要用 but，不是顺着的 and",
    acceptRegex: "^the\\s+book\\s+was\\s+long[,]?\\s+but\\s+the\\s+story\\s+was\\s+interesting[.!]?$",
    misreadBranches: [
      {
        errorTag: "run_on",
        npcReply: "「The book was long, and the story was interesting」— the raincloud and the sunny hill slide together into one grey picture. The librarian tilts her head: \"Both halves are pulling apart. And says they are the same side.\"",
        npcReplyZh: "「The book was long, and the story was interesting」——雨云和阳光的山丘滑到一起，变成一张灰图。管理员歪了歪头：“这两半在互相拉扯。and 却说它们是同一边。”",
        lampHint: "一拉一扯用 but：long, but interesting。"
      }
    ]
  },

  // ── G3 · 不定式 to do：想去做 ────────────────────────────────────
  {
    id: "library-gate-3",
    topicId: "s4-infinitive",
    runeId: "rune-infinitive-sprout",
    mode: "say",
    npcLine: "Deeper in the stacks, a book floats at eye level, its pages rustling like leaves. \"This one opens for wishes,\" the librarian whispers. \"Tell it what you want to do here.\"",
    npcLineZh: "到了书架深处，一本书悬在视线的高度轻轻翻动，书页像叶子一样沙沙响。“这本为愿望而开，”管理员低声说，“告诉它你想在这儿做什么。”",
    zhIntent: "说你想读这本书。",
    canDo: "说出愿望「我想读这本书」——愿望带 to 的芽",
    requiredPattern: "I want to read this book.",
    sampleAnswer: "I want to read this book.",
    hints: [
      "I want to r___ this book.",
      "想说「要去做」，动词前种一个 to 的芽：want to read。",
      "I want to read this book."
    ],
    skeleton: { subject: "I", verb: "want to read this book（想做什么）", subjectLabel: "谁", verbLabel: "想做什么" },
    counterExample: "I want read this book.",
    counterNote: "「要去做」的芽是 to——want to read，不是 want read",
    acceptRegex: "^i\\s+(want|would like|'d like)\\s+to\\s+read\\s+this\\s+book[.!]?$",
    misreadBranches: [
      {
        errorTag: "verb_form",
        npcReply: "「I want read this book」— the book's pages stop mid-flutter, like a leaf caught without a stem. It cannot tell whether you wish to read, or you are reading, or you read long ago.",
        npcReplyZh: "「I want read this book」——书页扑到一半停住，像一片没长叶柄就悬空的叶子。它分不清你是想读、正在读、还是早就读过。",
        lampHint: "愿望的芽是 to：I want to read this book。"
      }
    ]
  },

  // ── G4 · 不定式·decide to：决定去做 ──────────────────────────────
  {
    id: "library-gate-4",
    topicId: "s4-infinitive",
    runeId: "rune-infinitive-sprout",
    mode: "complete",
    npcLine: "The librarian sets down her stamp and looks at the clock. \"The reading room closes at dusk. Finish your thought on the slip: I ___ (decide) to finish this chapter tonight.\"",
    npcLineZh: "管理员放下印章，看了看挂钟。“阅览室黄昏关门。把借书条上这句补完：I ___ (decide) to finish this chapter tonight。”",
    zhIntent: "补全这句话：I ___ (decide) to finish this chapter tonight.",
    canDo: "说出决定「我决定今晚读完这一章」",
    requiredPattern: "I decided to finish this chapter tonight.",
    sampleAnswer: "I decided to finish this chapter tonight.",
    hints: [
      "I d______ to finish this chapter tonight.",
      "决定是过去定的，decide 要变成 decided；to 的芽保留。",
      "I decided to finish this chapter tonight."
    ],
    skeleton: { subject: "I", verb: "decided to finish…（决定了要做什么）", subjectLabel: "谁", verbLabel: "决定了什么" },
    counterExample: "I decide to finish this chapter tonight.",
    counterNote: "决定是刚才做的，decide 要带上 -ed 的痕迹：decided",
    acceptRegex: "^i\\s+decided\\s+to\\s+finish\\s+this\\s+chapter\\s+tonight[.!]?$",
    misreadBranches: [
      {
        errorTag: "tense",
        npcReply: "「I decide to finish this chapter tonight」— the librarian's stamp hovers. \"You decide now? Every evening?\" The book waits: a decision with no date cannot hold a place on the shelf.",
        npcReplyZh: "「I decide to finish this chapter tonight」——印章悬在半空。“你现在决定？每个晚上都决定？”书等着：没有日期的决定，占不了书架上的位置。",
        lampHint: "决定是刚做的，用过去式：I decided to finish…"
      }
    ]
  },

  // ── G5 · 动名词：动词戴叶子当名字 ────────────────────────────────
  {
    id: "library-gate-5",
    topicId: "s4-gerund",
    runeId: "rune-gerund-leaf",
    mode: "say",
    npcLine: "The inner reading room. A book lies open on a lectern, its title blank. \"This one asks for a subject,\" the librarian says. \"Tell it what you like doing best.\"",
    npcLineZh: "最里面的阅览室。一本书摊在讲台上，标题是空白的。“这本要一个『主角』，”管理员说，“告诉它你最喜欢做什么。”",
    zhIntent: "说最喜欢读书。",
    canDo: "说出喜欢「我喜欢读书」——动词的叶子",
    requiredPattern: "I enjoy reading.",
    sampleAnswer: "I enjoy reading.",
    hints: [
      "I enjoy r______.",
      "动词戴上 -ing 的叶子，就变成一件「事」：enjoy reading。",
      "I enjoy reading."
    ],
    skeleton: { subject: "I", verb: "enjoy reading（喜欢做的「事」）", subjectLabel: "谁", verbLabel: "喜欢做什么" },
    counterExample: "I enjoy to read.",
    counterNote: "enjoy 后面要的是「事」，动词要戴上 -ing 的叶子：enjoy reading",
    acceptRegex: "^i\\s+enjoy\\s+reading[.!]?$|^i\\s+(like|love)\\s+reading[.!]?$",
    misreadBranches: [
      {
        errorTag: "verb_form",
        npcReply: "「I enjoy to read」— the lectern tilts. The book wants a thing to hold, and you handed it a sprout with nowhere to root. Its blank title stays blank.",
        npcReplyZh: "「I enjoy to read」——讲台歪了一下。书想接住一件「事」，你递给它一根没处扎根的芽。空白的标题还是空白。",
        lampHint: "enjoy 后面用 -ing 的叶子：I enjoy reading。"
      }
    ]
  },

  // ── G6 · 动名词·thanks for：介词后的动名词 ───────────────────────
  {
    id: "library-gate-6",
    topicId: "s4-gerund",
    runeId: "rune-gerund-leaf",
    mode: "complete",
    npcLine: "The librarian slides a stamped card across the desk. \"For helping me sort the shelves. Write on the card—finish this: thank you for ___ (help) me.\"",
    npcLineZh: "管理员把一张盖好章的卡片推过桌面。“谢谢你帮我整理书架。在卡片上写完这句：thank you for ___ (help) me。”",
    zhIntent: "补全这句话：Thank you for ___ (help) me.",
    canDo: "说出感谢「谢谢你帮我」",
    requiredPattern: "Thank you for helping me.",
    sampleAnswer: "Thank you for helping me.",
    hints: [
      "Thank you for h______ me.",
      "for 是介词，后面接动词要戴 -ing 的叶子：for helping。",
      "Thank you for helping me."
    ],
    skeleton: { subject: "Thank you", verb: "for helping me（为了哪件事）", subjectLabel: "你", verbLabel: "谢的是哪件事" },
    counterExample: "Thank you for help me.",
    counterNote: "for 后面要接「事」：help 戴上 -ing 变成 helping",
    acceptRegex: "^thank\\s+you\\s+for\\s+helping\\s+me[.!]?$",
    misreadBranches: [
      {
        errorTag: "verb_form",
        npcReply: "「Thank you for help me」— the card's ink blots. For is a hook that holds things, not actions: the gratitude dangles, and the stamp refuses to land.",
        npcReplyZh: "「Thank you for help me」——卡片上的墨洇了。for 是一只挂「事」的钩子，不挂光秃秃的动作：谢意悬着，印章不肯落下。",
        lampHint: "for 后面接 -ing：Thank you for helping me。"
      }
    ]
  },

  // ── G7 · 定语从句 who/which：给东西扣个说明 ──────────────────────
  {
    id: "library-gate-7",
    topicId: "s4-relative",
    runeId: "rune-relative-clasp",
    mode: "say",
    npcLine: "A narrow book with a clasp stands apart on the shelf. \"It only opens for descriptions,\" the librarian says. \"Tell it about the man who fixed the shelves—describe him with a hook.\"",
    npcLineZh: "一本带扣环的窄书单独立在架上。“它只为描述而开，”管理员说，“跟它说说修书架的那位师傅——用一个钩子把他扣住。”",
    zhIntent: "说那位帮你的师傅很善良。",
    canDo: "用 who 描述「帮我的那个人很善良」",
    requiredPattern: "The man who helped me is kind.",
    sampleAnswer: "The man who helped me is kind.",
    hints: [
      "The man w__ helped me is kind.",
      "补充说明「人」，用 who 的扣子扣上去。",
      "The man who helped me is kind."
    ],
    skeleton: { subject: "The man", verb: "who helped me is kind（用 who 补充说明「谁」）", subjectLabel: "那个人", verbLabel: "他是谁、怎么样" },
    counterExample: "The man helped me is kind.",
    counterNote: "补充说明的那半句要有扣子：who 不能省——The man who helped me",
    acceptRegex: "^the\\s+man\\s+who\\s+helped\\s+me\\s+is\\s+(kind|nice|good|friendly)[.!]?$",
    misreadBranches: [
      {
        errorTag: "run_on",
        npcReply: "「The man helped me is kind」— the clasp rattles against an empty hook. Two sentences lean on each other with nothing tying them; the book cannot tell where one man ends and the next begins.",
        npcReplyZh: "「The man helped me is kind」——扣环在空钩子上哐当响。两句话互相靠着，却没有东西系住；书分不清哪里是那个人、哪里是下一句。",
        lampHint: "补充说明人用 who 扣住：The man who helped me is kind。"
      }
    ]
  },

  // ── G8 · 定语从句 which：给物扣说明 ─────────────────────────────
  {
    id: "library-gate-8",
    topicId: "s4-relative",
    runeId: "rune-relative-clasp",
    mode: "complete",
    npcLine: "The floating book returns, this time pointing at a shelf you tidied. \"Describe a book,\" the librarian says. \"Finish the line on the spine: this is the book ___ I read last week.\"",
    npcLineZh: "会飘的那本书回来了，这次指着你整理过的那排架。“描述一本书，”管理员说，“把书脊上的句子补完：this is the book ___ I read last week。”",
    zhIntent: "补全这句话：This is the book ___ I read last week.",
    canDo: "用 which 说清「这就是我上周读的那本书」",
    requiredPattern: "This is the book which I read last week.",
    sampleAnswer: "This is the book which I read last week.",
    hints: [
      "This is the book w____ I read last week.",
      "补充说明「东西」，用 which 的扣子扣上去。",
      "This is the book which I read last week."
    ],
    skeleton: { subject: "the book", verb: "which I read last week（用 which 补充说明「哪本」）", subjectLabel: "那本书", verbLabel: "是哪一本" },
    counterExample: "This is the book I read last week which.",
    counterNote: "扣子要扣在中间：the book which I read……which 不能拖到最后",
    acceptRegex: "^this\\s+is\\s+the\\s+book\\s+(which|that)\\s+i\\s+read\\s+last\\s+week[.!]?$",
    misreadBranches: [
      {
        errorTag: "word_order",
        npcReply: "「This is the book I read last week which」— the clasp swings loose at the end of the sentence, hooking nothing. The shelf signs: the description must stand next to the thing it describes.",
        npcReplyZh: "「This is the book I read last week which」——扣环甩在句子末尾，什么也没扣住。书架叹气：说明要站在被说明的东西旁边。",
        lampHint: "扣子跟在书后面：the book which I read last week。"
      }
    ]
  },

  // ── G9 · 宾语从句 that：把句子装进匣子 ───────────────────────────
  {
    id: "library-gate-9",
    topicId: "s4-object-clause",
    runeId: "rune-object-case",
    mode: "say",
    npcLine: "At the very back, a black book sits inside a glass case. \"This one only opens for thoughts about others,\" the librarian says. \"Tell it what you think about your friend—the friend from the city of bells.\"",
    npcLineZh: "最深处，一本黑皮书装在玻璃匣里。“这本只为『关于别人的想法』而开，”管理员说，“告诉它你怎么看你的朋友——钟声之城的那位。”",
    zhIntent: "说你认为她是对的。",
    canDo: "说出想法「我认为她是对的」——想法装进匣子",
    requiredPattern: "I think that she is right.",
    sampleAnswer: "I think that she is right.",
    hints: [
      "I think t___ she is right.",
      "把「她是对的」整句装进 that 的匣子当宾语：I think that…",
      "I think that she is right."
    ],
    skeleton: { subject: "I", verb: "think that she is right（把整句装进匣子）", subjectLabel: "谁", verbLabel: "认为什么" },
    counterExample: "I think she right.",
    counterNote: "匣子里的句子也要完整：she is right，be 不能丢",
    acceptRegex: "^i\\s+think\\s+(that\\s+)?she\\s+is\\s+right[.!]?$",
    misreadBranches: [
      {
        errorTag: "missing_be",
        npcReply: "「I think she right」— the case stays dark. The thought inside is missing its ground: right about what, says who? A sentence inside a sentence still needs its own floor.",
        npcReplyZh: "「I think she right」——玻璃匣暗着。里面装的想法缺了地基：对什么？谁说的？装进匣子的句子，也得有自己的地板。",
        lampHint: "匣子里的句子要完整：I think that she is right。"
      }
    ]
  },

  // ── G10 · 长句之梯：收官，搭一句长的 ─────────────────────────────
  {
    id: "library-gate-10",
    topicId: "s4-long-sentence",
    runeId: "rune-long-ladder",
    mode: "respond",
    npcLine: "The librarian closes the ledger and stands. The lamps dim, one by one, down the long hall. \"Last book of the night,\" she says. \"It opens only for a whole story—use everything you have built here. Why did you come, and what did you find?\"",
    npcLineZh: "管理员合上账本，站起身。长廊里的灯一盏盏暗下去。“今晚最后一本，”她说，“它只为完整的故事打开——用上你在这儿搭起来的一切。你为什么来，又找到了什么？”",
    zhIntent: "说你因为想读书而来，发现读书很有趣。",
    canDo: "搭一句长的「我来是因为想读书，我发现读书很有趣」",
    requiredPattern: "I came here because I wanted to read, and I found that reading is fun.",
    sampleAnswer: "I came here because I wanted to read, and I found that reading is fun.",
    hints: [
      "I came here because I w_____ to read, and I found that reading is fun.",
      "搭长句：because 接原因、and 接下一块、that 装想法——一块一块垒。",
      "I came here because I wanted to read, and I found that reading is fun."
    ],
    skeleton: { subject: "I", verb: "came because…, and found that…（三层搭起来的长句）", subjectLabel: "谁", verbLabel: "为什么来、发现了什么" },
    counterExample: "I came here because want to read, and found reading is fun.",
    counterNote: "每一块都要站得住：because I wanted…、found that reading is fun",
    acceptRegex: "^i\\s+came\\s+here\\s+because\\s+i\\s+wanted\\s+to\\s+read[,]?\\s+and\\s+i\\s+found\\s+that\\s+reading\\s+is\\s+fun[.!]?$",
    misreadBranches: [
      {
        errorTag: "verb_form",
        npcReply: "「I came here because want to read」— the ladder wobbles: one rung is missing its climber. Who wanted? The sentence drops the 'I' and the story falls through the gap. The last book stays shut, waiting.",
        npcReplyZh: "「I came here because want to read」——梯子晃了：有一级横木上没人。是谁想？句子丢掉了那个「I」，故事从缺口掉了下去。最后一本书合着，等着。",
        lampHint: "每一块都要有主人：because I wanted to read——I 不能丢。"
      }
    ]
  }
];

/** 图书馆每关剧情阶段文本（索引对齐 LIBRARY_GATES）。 */
export interface LibraryGateStory {
  setup: string;
  setupZh: string;
  passSpeaker: string;
  passLine: string;
  passLineZh: string;
  teaser: string;
}

export const LIBRARY_STORIES: LibraryGateStory[] = [
  {
    setup: "Through the city gate, a quiet street of bookshops, and then: the Library. Its doors are open, but the books are not. The librarian looks up. \"**Some books only open for complete sentences,**\" she says. \"**This one is waiting for a reason.** Finish what is written on its cover—**why did you stay home that day?**\"",
    setupZh: "穿过城门，一条安静的书店街，然后是：图书馆。门开着，书却合着。管理员抬起头。“**有些书只为完整的句子打开，**”她说，“**这本在等一个理由。**把封面上写了一半的句子补完——**那天你为什么待在家里？**”",
    passSpeaker: "图书管理员",
    passLine: "Because it rained. The cover springs open—the reason was the key.",
    passLineZh: "因为下雨。封面弹开了——理由就是钥匙。",
    teaser: "「书页翻动的声音里，第二本书自己滑到了桌边——封面上画着雨云和阳光。」"
  },
  {
    setup: "The second book settles on the reading table. Its cover shows two pictures pulling away from each other: a raincloud, a sunny hill. \"**Two halves, two directions,**\" the librarian says. \"**Tell it the whole story: the book was long. And the story?**\"",
    setupZh: "第二本书落在阅览桌上。封面画着两幅互相拉扯的图：一朵雨云，一座阳光下的山丘。“**两半，两个方向，**”管理员说，“**把整个故事告诉它：书很长。那故事呢？**”",
    passSpeaker: "图书管理员",
    passLine: "Long, but interesting. The two halves settle side by side—the book opens to its first page.",
    passLineZh: "很长，但是很有趣。两半并排安顿下来——书翻到了第一页。",
    teaser: "「书架深处忽然有风声。管理员示意你过去：『在书上层的，是想去读它的愿望。』」"
  },
  {
    setup: "Between the tall shelves, a book floats at eye level, its pages rustling like leaves in a slow wind. \"**This one opens for wishes,**\" the librarian whispers behind you. \"**Tell it what you want to do here—the wish must carry its to-sprout, or it withers.**\"",
    setupZh: "在高书架之间，一本书悬在视线的高度，书页像叶子一样在慢风里沙沙响。“**这本为愿望而开，**”管理员在你身后低声说，“**告诉它你想在这儿做什么——愿望要带上 to 的芽，否则会枯。**”",
    passSpeaker: "图书管理员",
    passLine: "To read this book. The pages stop fluttering and open like a held breath—the wish took root.",
    passLineZh: "想读这本书。书页停下翻动，像屏住的一口气松开了——愿望扎了根。",
    teaser: "「挂钟敲了一下。管理员看了看时辰：『阅览室黄昏就关——把你今晚的决定写下来。』」"
  },
  {
    setup: "The librarian sets a fresh slip on the desk, next to a chapter you have not finished. The clock ticks toward dusk. \"**Decisions are dated,**\" she says. \"**Write yours: what did you decide, and when will you finish?** The shelf only keeps a place for a decision made.\"",
    setupZh: "管理员在桌上放下一张新的借书条，旁边是你还没读完的一章。钟声一格格走向黄昏。“**决定是有日期的，**”她说，“**写下你的：你决定了什么，什么时候读完？**书架只给做过的决定留位置。”",
    passSpeaker: "图书管理员",
    passLine: "Decided to finish this chapter tonight. The slip stamps itself—the shelf slides open a space for you.",
    passLineZh: "决定今晚读完这一章。借书条自己盖上了章——书架为你滑出一个空位。",
    teaser: "「最里面那间阅览室的门虚掩着，门上刻着一行小字：『动词戴上叶子，才能当名字用。』」"
  },
  {
    setup: "The inner reading room smells of old paper and lamp oil. A book lies open on a lectern, its title still blank. \"**This one asks for a subject,**\" the librarian says, \"**not a person, but a thing you do.** Tell it what you enjoy—**give it a proper leaf.**\"",
    setupZh: "最里面的阅览室满是旧纸和灯油的香气。一本书摊在讲台上，标题还空着。“**这本要一个『主角』，**”管理员说，“**不是人，是你做的一件事。**告诉它你喜欢什么——**给它一片像样的叶子。**”",
    passSpeaker: "图书管理员",
    passLine: "I enjoy reading. The blank title fills itself in—the leaf took root, and the book has a subject now.",
    passLineZh: "我喜欢读书。空白的标题自己填上了——叶子扎了根，这本书有主角了。",
    teaser: "「管理员把一张盖好章的卡片推到你面前——她说这是给帮忙的回礼。」"
  },
  {
    setup: "The librarian slides a stamped card across the desk. \"**For an hour of sorting, a card of thanks,**\" she says. \"**Write it complete—the card only keeps a finished sentence.** Finish it for me.\"",
    setupZh: "管理员把一张盖好章的卡片推过桌面。“**整理了一小时书架，换一张谢卡，**”她说，“**把它写完整——卡片只收写完的句子。**替我把这句写完。”",
    passSpeaker: "图书管理员",
    passLine: "Thank you for helping me. The ink dries on the card—the gratitude has a hook now.",
    passLineZh: "谢谢你帮我。卡片上的墨迹干了——谢意有了挂钩。",
    teaser: "「书架上，一本带扣环的窄书自己立了起来，扣子一开一合，像在说话。」"
  },
  {
    setup: "A narrow book with a brass clasp stands apart on the shelf, working its clasp open and shut. \"**It hungers for descriptions,**\" the librarian says. \"**Who is the man who fixed our shelves last week? Describe him—hook the second half to the first.**\"",
    setupZh: "一本带黄铜扣环的窄书单独立在架上，扣子一开一合。“**它渴望描述，**”管理员说，“**上周修书架的那位师傅是谁？描述他——把后半句扣到前半句上。**”",
    passSpeaker: "图书管理员",
    passLine: "The man who helped me is kind. The clasp snaps shut on a sentence that finally holds itself together.",
    passLineZh: "帮我的那个人很善良。扣环咔哒扣上——这句话终于自己抱住了自己。",
    teaser: "「会飘的那本书又来了，指着你刚整理好的那排书架。」"
  },
  {
    setup: "The floating book returns, hovering over a shelf you tidied this afternoon. \"**Now describe a thing,**\" the librarian says. \"**Which one did you read? Hook it as you hooked the man—but this time, for a thing, use which.**\"",
    setupZh: "会飘的书回来了，悬在你下午整理过的那排架上方。“**现在描述一件东西，**”管理员说，“**你读的是哪一本？像扣住那个人一样扣住它——不过这回是东西，用 which。**”",
    passSpeaker: "图书管理员",
    passLine: "The book which I read last week. The clasp holds—the shelf sets it down gently, understood.",
    passLineZh: "我上周读的那本书。扣环扣住了——书架把它轻轻放下，它被读懂了。",
    teaser: "「长廊尽头，一本黑皮书躺在玻璃匣里，等着关于『别人』的想法。」"
  },
  {
    setup: "At the very back of the hall, a black book lies inside a glass case. \"**It opens only for thoughts about others,**\" the librarian says quietly. \"**Not facts—opinions. What do you think of your friend, the one from the city of bells?** Bring her here in a sentence.\"",
    setupZh: "长廊最深处，一本黑皮书躺在玻璃匣里。“**它只为『关于别人』的想法打开，**”管理员低声说，“**不是事实——是看法。你觉得你在钟声之城的那位朋友怎么样？**用一句话把她带进来。”",
    passSpeaker: "图书管理员",
    passLine: "I think that she is right. The case lifts its lid—a thought about someone else, delivered intact.",
    passLineZh: "我认为她是对的。匣盖抬起——一个关于别人的想法，完完整整地送到了。",
    teaser: "「灯一盏盏暗下去。管理员合上账本：『今晚最后一本——它要一个完整的故事。』」"
  },
  {
    setup: "The librarian closes the ledger and stands. Down the long hall, the lamps dim one by one, until only her desk light remains. \"**Last book of the night,**\" she says. \"**It opens only for a whole story. Use everything you have built here: why did you come—and what did you find?**\"",
    setupZh: "管理员合上账本站起身。长廊里的灯一盏盏暗下去，只剩她桌上那一盏。“**今晚最后一本，**”她说，“**它只为完整的故事打开。用上你在这儿搭起来的一切：你为什么来——又找到了什么？**”",
    passSpeaker: "图书管理员",
    passLine: "I came here because I wanted to read, and I found that reading is fun. The last book opens all the way—every rung of your sentence holds.",
    passLineZh: "我来这里是因为我想读书，我发现读书很有趣。最后一本书完全打开了——你这句话的每一级都站得住。",
    teaser: "「图书馆的门外，雾气里有咸味的风。远处的山坡上，一座灯塔的灯刚刚亮起——像在等你。」"
  }
];

export const getLibraryGate = (gateId: string): LanguageGate | undefined =>
  LIBRARY_GATES.find((gate) => gate.id === gateId);

export const getLibraryStory = (gateId: string): LibraryGateStory | undefined => {
  const index = LIBRARY_GATES.findIndex((gate) => gate.id === gateId);
  return index >= 0 ? LIBRARY_STORIES[index] : undefined;
};
