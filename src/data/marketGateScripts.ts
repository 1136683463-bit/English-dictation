import type { LanguageGate } from "../types";

/**
 * 集市世界（S1 名词与限定）· 批 1：G1–G3 单复数 + 冠词（GRAMMAR_ADVENTURE_PLAN §5 第二世界）。
 *
 * 世界机制：清晨市集，要什么得说清楚——名字说不对，摊主就把错的东西递到你手里。
 * 误读支线四拍模板：①「」复读玩家句子 → ②摊主按字面理解去拿货 → ③递错的具象后果 → ④lampHint 点拨。
 *
 * 红线与站台/回声城一致：「」内引文豁免语法与禁用词检测。
 */

export const MARKET_WORLD_ID = "market";

/** 集市的门按关卡序排列（1–8，本批 1–3）。 */
export const MARKET_GATES: LanguageGate[] = [
  // ── G1 · 单复数：要两个苹果 ──────────────────────────────────────
  {
    id: "market-gate-1",
    topicId: "s1-plural",
    runeId: "rune-plural-mirror",
    mode: "say",
    npcLine: "Morning! The stall is full of fruit. What would you like—how many?",
    npcLineZh: "早上好！摊子上全是水果。想要点什么——要几个？",
    zhIntent: "说想要两个苹果。",
    canDo: "说清「我想要两个苹果」——不止一个要带尾巴",
    requiredPattern: "I want two apples.",
    sampleAnswer: "I want two apples.",
    hints: [
      "I want two a_____.",
      "两个以上，名词要照镜子戴上 -s：apple → apples。",
      "I want two apples."
    ],
    skeleton: { subject: "I", verb: "want two apples（要什么、要几个）", subjectLabel: "谁", verbLabel: "想要什么" },
    counterExample: "I want two apple.",
    counterNote: "two 后面是两个，apple 要照镜子变成 apples",
    acceptRegex: "^i\\s+(want|would like|'d like)\\s+(two|2)\\s+apples[.!]?$",
    misreadBranches: [
      {
        errorTag: "plural",
        npcReply: "「I want two apple」— the vendor looks puzzled, then hands you one apple, cut in half. \"Two apple? I only know apple. Here—one, and one more piece.\"",
        npcReplyZh: "「I want two apple」——摊主一脸困惑，然后递给你一个苹果，切成了两半。“Two apple？我只认得 apple。给——一个，外加一瓣。”",
        lampHint: "two 后面要照镜子：apple → apples。I want two apples。"
      }
    ]
  },

  // ── G2 · 单复数·不规则/复数动词呼应：梨是甜的 ─────────────────────
  {
    id: "market-gate-2",
    topicId: "s1-plural",
    runeId: "rune-plural-mirror",
    mode: "complete",
    npcLine: "Taste this—the pears arrived this morning. Finish the vendor's line: the pears ___ (be) sweet.",
    npcLineZh: "尝尝这个——梨是今早到的。补全摊主那句：the pears ___ (be) sweet。",
    zhIntent: "补全这句话：The pears ___ (be) sweet.",
    canDo: "说清「这些梨是甜的」——不止一个，动词跟着换",
    requiredPattern: "The pears are sweet.",
    sampleAnswer: "The pears are sweet.",
    hints: [
      "The pears a__ sweet.",
      "pears 是复数，be 动词也要照镜子：are，不是 is。",
      "The pears are sweet."
    ],
    skeleton: { subject: "The pears", verb: "are sweet（复数主语配 are）", subjectLabel: "什么（多个）", verbLabel: "怎么样" },
    counterExample: "The pears is sweet.",
    counterNote: "pears 是复数，is 只配单数——镜子照反了",
    acceptRegex: "^the\\s+pears\\s+are\\s+(sweet|good|fresh|ripe)[.!]?$",
    misreadBranches: [
      {
        errorTag: "plural",
        npcReply: "「The pears is sweet」— the vendor holds up a single pear and shakes his head. \"Which one? You say 'is'—I hear only one pear. But look, there are six.\"",
        npcReplyZh: "「The pears is sweet」——摊主举起一只梨，摇摇头。“哪一只？你说 is——我只听见一个梨。可你看，这儿有六个。”",
        lampHint: "复数主语配 are：The pears are sweet。"
      }
    ]
  },

  // ── G3 · a/an 冠词：一个苹果（元音垫片）────────────────────────────
  {
    id: "market-gate-3",
    topicId: "s1-article",
    runeId: "rune-article-ring",
    mode: "say",
    npcLine: "You changed your mind? Fine, fine—one piece. What would you like, just one?",
    npcLineZh: "改主意了？行，行——就一件。想要什么，只要一个？",
    zhIntent: "说想要一个苹果。",
    canDo: "说清「我想要一个苹果」——a 和 apple 之间要垫 n",
    requiredPattern: "I want an apple.",
    sampleAnswer: "I want an apple.",
    hints: [
      "I want __ apple.",
      "两个元音撞在一起会黏住。a 和 apple 之间，需要一个 n 当垫片。",
      "I want an apple."
    ],
    skeleton: { subject: "I", verb: "want an apple（只要一个）", subjectLabel: "谁", verbLabel: "想要什么" },
    counterExample: "I want a apple.",
    counterNote: "a 和 apple 两个元音撞住了，要加 n 当垫片：an apple",
    acceptRegex: "^i\\s+(want|would like|'d like)\\s+(an apple|one apple)[.!]?$",
    misreadBranches: [
      {
        errorTag: "article",
        npcReply: "「I want a apple」— the vendor squints. \"A apple? I have never heard of that fruit. You mean an apple?\" He points at the red pile.",
        npcReplyZh: "「I want a apple」——摊主眯起眼睛。“A apple？我没听过这种水果。你是说 an apple？”他指了指那堆红苹果。",
        lampHint: "两个元音撞住了：a 和 apple 之间要加 n——an apple。"
      }
    ]
  },

  // ── G4 · 指示代词：指着近处/远处的东西说话 ────────────────────────
  {
    id: "market-gate-4",
    topicId: "s1-demonstrative",
    runeId: "rune-pointer-finger",
    mode: "say",
    npcLine: "The vendor waves at two piles—one close, one far. Point with your words: which pile do you mean?",
    npcLineZh: "摊主朝两堆水果扬了扬下巴——一堆近，一堆远。用话指给我看：你要哪一堆？",
    zhIntent: "说近处的这些苹果是新鲜的。",
    canDo: "指着近处说清「这些苹果是新鲜的」",
    requiredPattern: "These apples are fresh.",
    sampleAnswer: "These apples are fresh.",
    hints: [
      "T____ apples are fresh.（近处、多个）",
      "指着近处的多个说 these；远处的那就说 those。",
      "These apples are fresh."
    ],
    skeleton: { subject: "These apples", verb: "are fresh（近处多个主语配 are）", subjectLabel: "这些（近处）", verbLabel: "怎么样" },
    counterExample: "This apples are fresh.",
    counterNote: "apples 是多个，指代词也要照镜子：this → these",
    acceptRegex: "^these\\s+apples\\s+are\\s+(fresh|good|sweet|nice)[.!]?$",
    misreadBranches: [
      {
        errorTag: "word_order",
        npcReply: "「This apples are fresh」— the vendor follows your finger to a single apple, then to the pile. \"This one? Or these? My hands can only pick one thing.\"",
        npcReplyZh: "「This apples are fresh」——摊主顺着你的手指看看那个苹果，又看看整堆。“这一只？还是这一些？我的手一次只能拿一样东西。”",
        lampHint: "多个用 these：These apples are fresh。this 只指一个。"
      }
    ]
  },

  // ── G5 · 代词·宾格：for her / for him ─────────────────────────────
  {
    id: "market-gate-5",
    topicId: "s1-pronoun",
    runeId: "rune-pronoun-shadow",
    mode: "complete",
    npcLine: "The vendor notices the girl in the green coat waiting behind you. \"Buying for someone else, too?\" Finish: these pears are for ___ (she).",
    npcLineZh: "摊主注意到你身后等着的绿大衣女孩。“也替别人买？”补全：these pears are for ___ (she)。",
    zhIntent: "补全这句话：These pears are for ___ (she).",
    canDo: "说清「这些梨是给她的」——代词的换装",
    requiredPattern: "These pears are for her.",
    sampleAnswer: "These pears are for her.",
    hints: [
      "These pears are for h__.",
      "在 for 后面，she 要换一身衣服，变成 her。",
      "These pears are for her."
    ],
    skeleton: { subject: "These pears", verb: "are for her（为谁买的）", subjectLabel: "这些梨", verbLabel: "是给谁的" },
    counterExample: "These pears are for she.",
    counterNote: "在 for 后面，she 要换装成 her——代词也有衣服要换",
    acceptRegex: "^these\\s+pears\\s+are\\s+for\\s+her[.!]?$",
    misreadBranches: [
      {
        errorTag: "word_order",
        npcReply: "「These pears are for she」— the vendor looks around. \"She? She is standing right there. Do you mean the pears are hers?\" He holds the bag out at arm's length, unsure who receives it.",
        npcReplyZh: "「These pears are for she」——摊主四下张望。“She？她就站在那儿呀。你是说这些梨是她的？”他把袋子拎在半空，不确定递给谁。",
        lampHint: "for 后面用 her：These pears are for her。"
      }
    ]
  },

  // ── G6 · 量词：how much（问价）────────────────────────────────────
  {
    id: "market-gate-6",
    topicId: "s1-quantifier",
    runeId: "rune-quantity-scale",
    mode: "say",
    npcLine: "The vendor sets the bag on the scale. \"Now—ask me the price. Say it right, and I will round it down.\"",
    npcLineZh: "摊主把袋子放上秤。“现在——问我价钱。说对了，我给你抹零。”",
    zhIntent: "问这些梨一共多少钱。",
    canDo: "问清「这些梨多少钱」——价钱用 much",
    requiredPattern: "How much are these pears?",
    sampleAnswer: "How much are these pears?",
    hints: [
      "How m___ are these pears?",
      "钱是数不清的，问价钱用 how much；数得清的问 how many。",
      "How much are these pears?"
    ],
    skeleton: { subject: "these pears", verb: "How much are（问价钱）", subjectLabel: "这些梨", verbLabel: "多少钱" },
    counterExample: "How many are these pears?",
    counterNote: "问价钱用 much——钱数不清，many 是数东西的",
    acceptRegex: "^how\\s+much\\s+(are|is)\\s+these\\s+pears[?!.]?$|^how\\s+much\\s+(do|are)\\s+(these\\s+pears|they)\\s+cost[?!.]?$",
    misreadBranches: [
      {
        errorTag: "fragment",
        npcReply: "「How many are these pears」— the vendor counts on his fingers: one, two, three... \"You want a count, not a price? I can count them all day, but the scale still says the same number.\"",
        npcReplyZh: "「How many are these pears」——摊主掰着指头数：一、二、三……“你要的是个数，不是价钱？我可以数一整天，可秤上的数字不会变。”",
        lampHint: "问价钱用 how much：How much are these pears?"
      }
    ]
  },

  // ── G7 · 特指 the：说好的那袋 ─────────────────────────────────────
  {
    id: "market-gate-7",
    topicId: "s1-the",
    runeId: "rune-article-ring",
    mode: "complete",
    npcLine: "The vendor lifts the bag you already chose. \"You remember this bag? Then ask for it—the one we agreed on.\" Finish: I will take ___ bag.",
    npcLineZh: "摊主提起你刚才选好的那袋。“还记得这袋吗？那就指名要它——我们说好的那一袋。”补全：I will take ___ bag。",
    zhIntent: "补全这句话：I will take ___ bag.（哪一袋？）",
    canDo: "说清「我就要那一袋」——说好的那个用 the",
    requiredPattern: "I will take the bag.",
    sampleAnswer: "I will take the bag.",
    hints: [
      "I will take ___ bag.（说好了的那袋）",
      "两个人都知道的那一个，用 the——不是 a bag，是 the bag。",
      "I will take the bag."
    ],
    skeleton: { subject: "I", verb: "will take the bag（特指那一袋）", subjectLabel: "谁", verbLabel: "要哪一个" },
    counterExample: "I will take a bag.",
    counterNote: "已经说好的那一袋要用 the——a bag 是随手一个，未必是这袋",
    acceptRegex: "^i\\s+(will\\s+take|'ll\\s+take|take|would\\s+like)\\s+the\\s+bag[.!]?$",
    misreadBranches: [
      {
        errorTag: "article",
        npcReply: "「I will take a bag」— the vendor's hand stops above the bag you chose. \"A bag? Any bag?\" He glances at the whole stall. \"There are thirty bags here. Which one is 'a bag'?\"",
        npcReplyZh: "「I will take a bag」——摊主的手停在你选的那袋上方。“A bag？随便哪袋？”他望向整个摊子。“这儿有三十袋。哪一袋才是『a bag』？”",
        lampHint: "说好了的那袋用 the：I will take the bag。"
      }
    ]
  },

  // ── G8 · 收官：集市全景（综合复现）────────────────────────────────
  {
    id: "market-gate-8",
    topicId: "s1-review",
    runeId: "rune-quantity-scale",
    mode: "respond",
    npcLine: "The vendor wipes the counter and smiles. \"Last order of the morning. Tell me everything: what, how many, and how much—in one breath.\"",
    npcLineZh: "摊主擦了擦柜台，笑了。“早上的最后一单。一口气告诉我：要什么、要几个、多少钱。”",
    zhIntent: "说你要三个橘子，然后问一共多少钱。",
    canDo: "一口气说清「要三个橘子，多少钱」",
    requiredPattern: "I want three oranges. How much is it?",
    sampleAnswer: "I want three oranges. How much is it?",
    hints: [
      "I want three o______. How m___ is it?",
      "三个 → oranges 戴尾巴；问钱 → how much。",
      "I want three oranges. How much is it?"
    ],
    skeleton: { subject: "I", verb: "want three oranges / How much is it（要什么 + 问价）", subjectLabel: "谁", verbLabel: "想要什么、多少钱" },
    counterExample: "I want three orange. How many is it?",
    counterNote: "orange 要照镜子变 oranges；问钱用 how much",
    acceptRegex: "^i\\s+(want|would\\s+like|'d\\s+like)\\s+(three|3)\\s+oranges[,.!]?\\s*how\\s+much\\s+(is|are)\\s+(it|they|these)[?!.]?$",
    misreadBranches: [
      {
        errorTag: "plural",
        npcReply: "「I want three orange」— the vendor weighs three oranges but writes one word on the bag: 'orange'. \"The bag is confused,\" he says. \"It thinks you want a single fruit, three times.\"",
        npcReplyZh: "「I want three orange」——摊主称了三个橘子，却在袋子上只写了一个词：“orange”。“袋子糊涂了，”他说，“它以为你要的是同一个水果，要三回。”",
        lampHint: "三个橘子：oranges 要戴 -s 的尾巴。I want three oranges。"
      }
    ]
  }
];

/** 集市每关剧情阶段文本（索引对齐 MARKET_GATES）。 */
export interface MarketGateStory {
  setup: string;
  setupZh: string;
  passSpeaker: string;
  passLine: string;
  passLineZh: string;
  teaser: string;
}

export const MARKET_STORIES: MarketGateStory[] = [
  {
    setup: "Morning light spills over the market stalls. A vendor stacks apples into a bright red pyramid. \"**Every apple has a name here,**\" he says, \"**and names change when there are more than one.** So—what would you like? How many?\"",
    setupZh: "晨光漫过市集的摊子。摊主把苹果码成一座亮红色的金字塔。“**在这儿，每个苹果都有名字，**”他说，“**超过一个的时候，名字会变。**那么——想要点什么？要几个？”",
    passSpeaker: "摊主",
    passLine: "Two apples. See how the word bends to hold them both? The stall hears you clearly.",
    passLineZh: "两个苹果。看，那个词为了装下它们弯了一下腰。摊子听清你说话了。",
    teaser: "「摊主从柜台下又端出一盘梨——今早刚到的，还带着露水。」"
  },
  {
    setup: "The vendor slides a tray of pears across the counter. \"**The pears arrived this morning,**\" he says, \"**fresh and cold from the orchard.** Taste one and tell me—how are they? Finish my line, and I will wrap them for you.\"",
    setupZh: "摊主把一盘梨推过柜台。“**这梨是今早到的，**”他说，“**从果园来，又新鲜又凉。**尝一个告诉我——它们怎么样？补全我这句话，我就帮你包起来。”",
    passSpeaker: "摊主",
    passLine: "The pears are sweet. Good—the tray knows it holds six, and your sentence knows it too.",
    passLineZh: "梨是甜的。好——盘子知道自己托着六个，你的句子也知道。",
    teaser: "「你忽然改了主意，只要一个——摊主的手停在了半空。」"
  },
  {
    setup: "The vendor's hand hovers over the red pyramid. \"**Just one, then?**\" he asks, \"**One single fruit—say its name properly, and it is yours.** Watch the mouth: it is easy to trip when two sounds meet.\"",
    setupZh: "摊主的手悬在红色金字塔上方。“**那就一个？**”他问，“**就一个水果——把它的名字说对，它就是你的。**当心你的嘴：两个声音碰头的时候，最容易绊倒。”",
    passSpeaker: "摊主",
    passLine: "An apple, coming right up. One, and the name rolls out smooth—no trip at all.",
    passLineZh: "一个 an apple，马上来。一个，名字滚得顺顺当当——一点也没绊着。",
    teaser: "「摊主的女儿从摊后探出头，指着远处：『爸爸，那个总买错的客人又来了——他要把整筐橙子都买走。』」"
  },
  {
    setup: "The morning crowd thickens. Two piles of apples sit on the counter—**one close to your hand, one far at the stall's edge**. \"**Point with your words,**\" the vendor says. \"**These, or those? My hands only move where your words point.**\"",
    setupZh: "早市的人渐渐多起来。柜台上摆着两堆苹果——**一堆就在你手边，一堆在摊子那头**。“**用话指给我看，**”摊主说，“**这些，还是那些？我的手只往你的话指向的地方动。**”",
    passSpeaker: "摊主",
    passLine: "These apples are fresh—your words point close, and my hand lands exactly there.",
    passLineZh: "这些苹果是新鲜的——你的话指着近处，我的手就落得刚刚好。",
    teaser: "「你转身要说谢谢，才发现身后站着一个穿绿大衣的女孩——她也在等。」"
  },
  {
    setup: "The girl in the green coat waits quietly behind you. The vendor lowers his voice: \"**Buying for her too?**\" He nods at the pears you chose. \"**Say who they are for—the words must carry the bag to the right hands.**\"",
    setupZh: "绿大衣女孩在你身后安静地等着。摊主压低声音：“**也给她买点？**”他朝你选的梨点点头。“**说说这袋是给谁的——话得把袋子送到对的手里。**”",
    passSpeaker: "摊主",
    passLine: "These pears are for her. The bag knows its way now—straight into her arms.",
    passLineZh: "这些梨是给她的。袋子认得路了——径直落到她怀里。",
    teaser: "「摊主把袋子放上秤，指针晃了晃——他在等你问价。」"
  },
  {
    setup: "The scale creaks under the bag. \"**Now ask me the price,**\" the vendor says, tapping the dial. \"**Number words are tricky here: some things are counted, some are weighed.** Get it right, and I round it down.\"",
    setupZh: "秤上的指针晃了晃。“**现在问价吧，**”摊主敲了敲表盘说，“**数词在这儿很讲究：有的东西要数，有的东西要称。**说对了，我给你抹零。”",
    passSpeaker: "摊主",
    passLine: "How much are these pears? A question with the right scale in it—there, rounded down, just for you.",
    passLineZh: "这些梨多少钱？一句带着对的『秤』的问话——给，抹了零，专门给你的。",
    teaser: "「摊主弯腰从柜台下拎出另一袋梨——和你手里那袋一模一样。」"
  },
  {
    setup: "The vendor lifts two nearly identical bags. \"**One of these is the bag we agreed on,**\" he says, \"**and the other is just any bag.** Tell me which one you will take—carefully: 'a' and 'the' point at different bags.\"",
    setupZh: "摊主拎起两个几乎一样的袋子。“**其中一个是咱们说好的那袋，**”他说，“**另一个只是随便哪一袋。**告诉我你要哪个——当心：a 和 the 指的是不同的袋子。”",
    passSpeaker: "摊主",
    passLine: "I will take the bag. The agreed one, in your words—his hands pass you exactly that.",
    passLineZh: "我要那一袋。咱们说好的那袋，就在你话里——他把正正好好那袋递了过来。",
    teaser: "「日头升高，早市慢慢安静下来。摊主擦了擦柜台：『最后一单，说吧。』」"
  },
  {
    setup: "The market is thinning out. The vendor wipes the counter and looks at you. \"**Last order of the morning,**\" he says. \"**One breath: what, how many, and how much.** Say it all, and the whole stall you learned today goes into this one bag.\"",
    setupZh: "集市渐渐散了。摊主擦着柜台看向你。“**早上的最后一单，**”他说，“**一口气：要什么、要几个、多少钱。**全说出来——你今天在这摊子上学会的，都装进这一袋里。”",
    passSpeaker: "摊主",
    passLine: "Three oranges, and how much is it. The bag closes—you have named this whole morning in one breath.",
    passLineZh: "三个橘子，一共多少钱。袋子系上了——你一口气说完了整个早上。",
    teaser: "「摊主把袋子递给你，朝街尾努努嘴——那边，一条通往回声城的路在晨雾里亮起来。」"
  }
];

export const getMarketGate = (gateId: string): LanguageGate | undefined =>
  MARKET_GATES.find((gate) => gate.id === gateId);

export const getMarketStory = (gateId: string): MarketGateStory | undefined => {
  const index = MARKET_GATES.findIndex((gate) => gate.id === gateId);
  return index >= 0 ? MARKET_STORIES[index] : undefined;
};
