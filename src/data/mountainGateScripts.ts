import type { LanguageGate } from "../types";

/**
 * 山径世界（S3 修饰与扩展）· 批 1：G1–G4（GRAMMAR_ADVENTURE_PLAN §5 第四世界）。
 *
 * 世界机制：雾中盘山路，要描述路况才能前进——形容词、比较、介词、语序，
 * 说错一样，雾就把路藏起来；说对了，前方的石板一块块显形。
 * 误读支线四拍模板：①「」复读玩家句子 → ②雾/路对这句话的反应 → ③路藏起来或走错的后果 → ④lampHint 点拨。
 *
 * 红线与既往世界一致：「」内引文豁免语法与禁用词检测。
 */

export const MOUNTAIN_WORLD_ID = "mountain";

/** 山径的门按关卡序排列（1–8，本批 1–4）。 */
export const MOUNTAIN_GATES: LanguageGate[] = [
  // ── G1 · 形容词位置（be 后作表语）────────────────────────────────
  {
    id: "mountain-gate-1",
    topicId: "s3-adjective",
    runeId: "rune-adjective-feather",
    mode: "say",
    npcLine: "The fog is thick at the trailhead. A guide ropes himself to the post. \"Before we climb—describe the path. How is it?\"",
    npcLineZh: "登山口的雾很浓。向导把自己拴在木桩上。“出发前——描述一下这条路。它怎么样？”",
    zhIntent: "说这条路很陡。",
    requiredPattern: "The path is steep.",
    sampleAnswer: "The path is steep.",
    hints: [
      "The path is s____.",
      "给路描样的词站在 be 后面：The path is + steep。",
      "The path is steep."
    ],
    skeleton: { subject: "The path", verb: "is steep（描样的词放在 be 后面）", subjectLabel: "什么", verbLabel: "怎么样" },
    counterExample: "The path steep.",
    counterNote: "少了 is——描样的词自己没有腿，站不住",
    acceptRegex: "^the\\s+path\\s+is\\s+(steep|narrow|hard|rough|long)[.!]?$",
    misreadBranches: [
      {
        errorTag: "missing_be",
        npcReply: "「The path steep」— the fog does not move. The sentence has no ground under it, and neither do your feet: the first stone of the path stays hidden.",
        npcReplyZh: "「The path steep」——雾不动。这句话脚下没有地，你的脚也没有：路的第一块石板始终不显形。",
        lampHint: "描样的词要站在 be 后面：The path is steep。"
      }
    ]
  },

  // ── G2 · 比较级：两条路里挑一条 ──────────────────────────────────
  {
    id: "mountain-gate-2",
    topicId: "s3-comparison",
    runeId: "rune-comparison-ruler",
    mode: "complete",
    npcLine: "Two trails split at the fork. The guide points at the left one. \"The right one is easy. Finish what I say about the left: this path is ___ (steep) than that one.\"",
    npcLineZh: "岔路口分出两条小径。向导指着左边那条。“右边的好走。替我把左边这句说完：this path is ___ (steep) than that one。”",
    zhIntent: "补全这句话：This path is ___ (steep) than that one.",
    requiredPattern: "This path is steeper than that one.",
    sampleAnswer: "This path is steeper than that one.",
    hints: [
      "This path is s______ than that one.",
      "两个里比一个，短词加 -er：steep → steeper。",
      "This path is steeper than that one."
    ],
    skeleton: { subject: "This path", verb: "is steeper than that one（两相比较）", subjectLabel: "这条", verbLabel: "比那条怎么样" },
    counterExample: "This path is steep than that one.",
    counterNote: "两个里比一个，steep 要带上 -er 的尺子：steeper",
    acceptRegex: "^this\\s+path\\s+is\\s+steeper\\s+than\\s+that\\s+one[.!]?$",
    misreadBranches: [
      {
        errorTag: "fragment",
        npcReply: "「This path is steep than that one」— the fork blurs. Than is a ruler asking for a measurement, and you handed it a plain word. Both trails look exactly the same in the fog.",
        npcReplyZh: "「This path is steep than that one」——岔路口模糊了。than 是一把等着刻度的尺子，你递给它一个素面的词。雾里两条路变得一模一样。",
        lampHint: "比较要带刻度：steep → steeper。This path is steeper than that one。"
      }
    ]
  },

  // ── G3 · 介词：在路上 / 在村子里 ────────────────────────────────
  {
    id: "mountain-gate-3",
    topicId: "s3-preposition",
    runeId: "rune-preposition-knot",
    mode: "say",
    npcLine: "The guide taps the map. \"Up here, prepositions are knots—tie a stray one, and the path slides off the mountain. Where are you right now?\"",
    npcLineZh: "向导敲了敲地图。“在这山上，介词就是绳结——打错一个，路就从山上滑下去。你现在在哪儿？”",
    zhIntent: "说你现在在小路上。",
    requiredPattern: "I am on the path.",
    sampleAnswer: "I am on the path.",
    hints: [
      "I am o_ the path.",
      "在一条路上用 on——路是脚下的一条线；在城/山里才用 in。",
      "I am on the path."
    ],
    skeleton: { subject: "I", verb: "am on the path（在哪儿）", subjectLabel: "谁", verbLabel: "在哪儿" },
    counterExample: "I am in the path.",
    counterNote: "路是脚下的一条线，用 on；in 是把自己塞进路里了",
    acceptRegex: "^i\\s+am\\s+on\\s+the\\s+path[.!]?$|^i\\s*'m\\s+on\\s+the\\s+path[.!]?$",
    misreadBranches: [
      {
        errorTag: "preposition",
        npcReply: "「I am in the path」— the guide stares at the ground. \"In the path? Then the path must have swallowed you.\" He squints: your outline flickers below the stones, somewhere the walking can't reach.",
        npcReplyZh: "「I am in the path」——向导盯着地面。“In the path？那路得把你吞了才行。”他眯起眼：你的轮廓在石板下方闪了一下，那地方走不过去。",
        lampHint: "在路上用 on：I am on the path。in 会把你塞进路里面。"
      }
    ]
  },

  // ── G4 · 语序：程度副词的位置 ───────────────────────────────────
  {
    id: "mountain-gate-4",
    topicId: "s3-word-order",
    runeId: "rune-order-track",
    mode: "say",
    npcLine: "Halfway up, the guide laughs at the view. \"You should tell me how you feel about this climb. Not just 'like'—how much?\"",
    npcLineZh: "爬到半山腰，向导对着景色笑。“你该告诉我你觉得这趟攀登怎么样。别只说『喜欢』——有多喜欢？”",
    zhIntent: "说你非常喜欢这条路。",
    requiredPattern: "I really like this path.",
    sampleAnswer: "I really like this path.",
    hints: [
      "I r_____ like this path.",
      "程度词站在动词前面：I really like……不是 I like really。",
      "I really like this path."
    ],
    skeleton: { subject: "I", verb: "really like this path（程度词站动词前）", subjectLabel: "谁", verbLabel: "有多喜欢" },
    counterExample: "I like really this path.",
    counterNote: "程度词走自己的轨：really 要站在 like 前面",
    acceptRegex: "^i\\s+really\\s+like\\s+this\\s+path[.!]?$|^i\\s+like\\s+this\\s+path\\s+(a\\s+lot|very\\s+much)[.!]?$",
    misreadBranches: [
      {
        errorTag: "word_order",
        npcReply: "「I like really this path」— the stones under you shuffle like puzzle pieces. The guide grabs your arm. \"Your words derailed—the path lost its track. Again, in order.\"",
        npcReplyZh: "「I like really this path」——你脚下的石板像拼图一样错位。向导抓住你的胳膊。“你的话脱轨了——路丢了轨道。再来，按顺序。”",
        lampHint: "程度词站动词前面：I really like this path。"
      }
    ]
  },

  // ── G5 · 最高级：山顶客栈的招牌 ─────────────────────────────────
  {
    id: "mountain-gate-5",
    topicId: "s3-superlative",
    runeId: "rune-comparison-ruler",
    mode: "complete",
    npcLine: "At the summit, a wooden sign sways in the wind. \"The innkeeper carved it for the last stretch,\" the guide says. \"Finish the sign, and the door opens: this is the ___ (high) inn on the mountain.\"",
    npcLineZh: "到了山顶，一块木招牌在风里晃。“客栈老板刻给最后一段路的，”向导说，“替他把招牌补完，门就开：this is the ___ (high) inn on the mountain。”",
    zhIntent: "补全这句话：This is the ___ (high) inn on the mountain.",
    requiredPattern: "This is the highest inn on the mountain.",
    sampleAnswer: "This is the highest inn on the mountain.",
    hints: [
      "This is the h______ inn on the mountain.",
      "三个以上里的第一名，短词加 -est：high → highest。",
      "This is the highest inn on the mountain."
    ],
    skeleton: { subject: "This inn", verb: "is the highest on the mountain（一群里的第一名）", subjectLabel: "这家客栈", verbLabel: "排第几" },
    counterExample: "This is the higher inn on the mountain.",
    counterNote: "一群里的第一名用 -est：higher 是两个人比，highest 才是一群里的最",
    acceptRegex: "^this\\s+is\\s+the\\s+highest\\s+inn\\s+on\\s+the\\s+mountain[.!]?$",
    misreadBranches: [
      {
        errorTag: "comparison",
        npcReply: "「This is the higher inn」— the sign creaks. Higher than what? The wind turns over the empty mountain: there is no second inn to compare against. The door stays shut.",
        npcReplyZh: "「This is the higher inn」——招牌吱呀作响。比哪家高？风翻过空荡荡的山——没有第二家客栈可以比。门关着。",
        lampHint: "一座山上只有第一名，用最高级：the highest inn。"
      }
    ]
  },

  // ── G6 · 方位介词：along / past / through ───────────────────────
  {
    id: "mountain-gate-6",
    topicId: "s3-preposition",
    runeId: "rune-preposition-knot",
    mode: "say",
    npcLine: "Past the inn, the trail narrows: a stream on the left, a cliff on the right. \"Tell me how we walk it,\" the guide says. \"Which way do we go along the stream?\"",
    npcLineZh: "过了客栈，路变窄了：左边是溪，右边是崖。“告诉我怎么走，”向导说，“我们沿着溪走哪一边？”",
    zhIntent: "说我们沿着溪边走。",
    requiredPattern: "We walk along the stream.",
    sampleAnswer: "We walk along the stream.",
    hints: [
      "We walk a____ the stream.",
      "顺着一条线走用 along——溪是一条线，你顺着它。",
      "We walk along the stream."
    ],
    skeleton: { subject: "We", verb: "walk along the stream（顺着什么走）", subjectLabel: "谁", verbLabel: "顺着什么走" },
    counterExample: "We walk on the stream.",
    counterNote: "顺着溪走用 along——on the stream 是踩着水面走",
    acceptRegex: "^we\\s+walk\\s+along\\s+the\\s+stream[.!]?$",
    misreadBranches: [
      {
        errorTag: "preposition",
        npcReply: "「We walk on the stream」— the guide looks at your boots, then at the water. \"On the stream? Are you a water strider?\" The stream ripples, unimpressed, and the trail narrows a little more.",
        npcReplyZh: "「We walk on the stream」——向导看看你的靴子，又看看水面。“On the stream？你是水黾吗？”溪水泛了泛，不为所动，路又窄了一点。",
        lampHint: "顺着一条线走用 along：We walk along the stream。"
      }
    ]
  },

  // ── G7 · so...that：程度引出结果 ────────────────────────────────
  {
    id: "mountain-gate-7",
    topicId: "s3-degree",
    runeId: "rune-order-track",
    mode: "complete",
    npcLine: "The fog grows so thick the far cliff disappears. The guide ties the rope tighter. \"Describe it. Finish the line: the fog is so thick ___ we can barely see.\"",
    npcLineZh: "雾越来越浓，远处的崖壁都消失了。向导把绳子系得更紧。“描述一下它。补全这句：the fog is so thick ___ we can barely see。”",
    zhIntent: "补全这句话：The fog is so thick ___ we can barely see.",
    requiredPattern: "The fog is so thick that we can barely see.",
    sampleAnswer: "The fog is so thick that we can barely see.",
    hints: [
      "The fog is so thick t___ we can barely see.",
      "「太……以至于」要把 that 请来搭桥：so thick that……",
      "The fog is so thick that we can barely see."
    ],
    skeleton: { subject: "The fog", verb: "is so thick that…（程度引出结果）", subjectLabel: "雾", verbLabel: "浓到什么程度" },
    counterExample: "The fog is so thick we can barely see.",
    counterNote: "「太……以至于」的桥面是 that——少了它，程度和结果接不上",
    acceptRegex: "^the\\s+fog\\s+is\\s+so\\s+thick\\s+that\\s+we\\s+can\\s+barely\\s+see[.!]?$",
    misreadBranches: [
      {
        errorTag: "fragment",
        npcReply: "「The fog is so thick we can barely see」— the sentence leans forward but never lands. The guide waits for the bridge word. \"So...so...so—and then what? Half of your thought is still hanging in the fog.\"",
        npcReplyZh: "「The fog is so thick we can barely see」——这句话往前倾着，却一直没落地。向导等着那个搭桥的词。“so……so……so——然后呢？你的半句话还挂在雾里。”",
        lampHint: "so… 后面要有 that 搭桥：so thick that we can barely see。"
      }
    ]
  },

  // ── G8 · 收官：下山前，把整条路说一遍 ─────────────────────────────
  {
    id: "mountain-gate-8",
    topicId: "s3-review",
    runeId: "rune-adjective-feather",
    mode: "respond",
    npcLine: "At the summit post, the guide unties the rope. Below, the whole trail winds through the clearing fog. \"Last thing before we go down. Look at this path—tell me everything: how is it, and how much do you like it?\"",
    npcLineZh: "在山顶的木桩旁，向导解开了绳子。山下，整条小径在散开的雾里蜿蜒。“下山前最后一件事。看看这条路——全告诉我：它怎么样，你有多喜欢它？”",
    zhIntent: "说这条路很美，你非常喜欢它。",
    requiredPattern: "The path is beautiful. I really love it.",
    sampleAnswer: "The path is beautiful. I really love it.",
    hints: [
      "The path is b_______. I r_____ love it.",
      "描述用形容词（is beautiful）；程度词站动词前（really love）。",
      "The path is beautiful. I really love it."
    ],
    skeleton: { subject: "The path / I", verb: "is beautiful / really love it（描述 + 程度）", subjectLabel: "路 / 我", verbLabel: "怎么样 / 有多喜欢" },
    counterExample: "The path beautiful. I love really it.",
    counterNote: "描样的词要站在 is 后面；程度词要站在 love 前面",
    acceptRegex: "^the\\s+path\\s+is\\s+(beautiful|lovely|great|amazing)[.!]?\\s*i\\s+really\\s+(love|like)\\s+it[.!]?$",
    misreadBranches: [
      {
        errorTag: "missing_be",
        npcReply: "「The path beautiful」— the fog hesitates mid-air, holding the picture without a frame. The guide taps the post: \"Beautiful—sure. But who says so? Give the sentence its ground.\"",
        npcReplyZh: "「The path beautiful」——雾悬在半空，像一幅没有画框的画。向导敲了敲木桩：“Beautiful——没错。但谁说的？给这句话一块地。”",
        lampHint: "描样的词站在 is 后面：The path is beautiful。"
      }
    ]
  }
];

/** 山径每关剧情阶段文本（索引对齐 MOUNTAIN_GATES）。 */
export interface MountainGateStory {
  setup: string;
  setupZh: string;
  passSpeaker: string;
  passLine: string;
  passLineZh: string;
  teaser: string;
}

export const MOUNTAIN_STORIES: MountainGateStory[] = [
  {
    setup: "At the base of the mountain, the fog stands like a wall. A guide ropes himself to a post and waits. \"**The path tells no secrets to plain silence,**\" he says. \"**Describe it to me—how is it?** Say it true, and the first stones will show themselves.\"",
    setupZh: "山脚下，雾像一堵墙立着。向导把自己拴在木桩上等着。“**路不会对沉默说话，**”他说，“**描述给我听——它怎么样？**说实话，第一批石板就会显形。”",
    passSpeaker: "向导",
    passLine: "The path is steep. Hm—the fog lifts its hem: the first three stones are visible now.",
    passLineZh: "这条路很陡。嗯——雾掀起了衣角：前三块石板露出来了。",
    teaser: "「往上走了十步，小径忽然分成两条——一条缓，一条陡。」"
  },
  {
    setup: "The fork splits in the mist: one trail easy, one trail steep. \"**Two paths, one choice,**\" the guide says. \"**But you cannot choose what you cannot measure.** Compare them for me—which one is steep?\"",
    setupZh: "岔路口在雾里分开：一条缓，一条陡。“**两条路，一个选择，**”向导说，“**但量不出来的东西，选不了。**替我比较一下——哪条更陡？”",
    passSpeaker: "向导",
    passLine: "This path is steeper than that one. Good—the needle of the fog swings left. Follow where your measurement points.",
    passLineZh: "这条路比那条陡。好——雾的指针偏向了左边。朝着你的刻度指向的地方走。",
    teaser: "「越往上风越大。向导忽然停下，敲了敲地图：『刚才那句话里的绳结，我得考考你。』」"
  },
  {
    setup: "The wind presses the fog against the slope. The guide spreads the map flat. \"**Up here, the knots of small words hold the path to the mountain.** Tie one loose, and the whole trail slides away. **So tell me plainly: where are you right now?**\"",
    setupZh: "风把雾压在坡上。向导把地图铺平。“**在这座山上，是小词的结把路拴在山壁上。**松一个，整条路就滑走。**所以直说：你现在在哪儿？**”",
    passSpeaker: "向导",
    passLine: "On the path. The knot holds—the trail tightens under your boots and stops swaying.",
    passLineZh: "在路上。结打住了——路在你靴底绷紧，不再摇晃。",
    teaser: "「拐过一道弯，整座山谷忽然在雾下面露出来——向导咧嘴笑了。」"
  },
  {
    setup: "Halfway up, the fog opens below like a sea. The guide leans on his staff, grinning. \"**A view like this deserves a sentence with feeling in it,**\" he says. \"**Tell me how you feel about this climb—not just 'like'. How much?** Mind the order of your words: the path is listening.\"",
    setupZh: "爬到半山腰，脚下的雾像海一样铺开。向导拄着杖咧嘴笑。“**这样的景色，配得上一句有分量的话，**”他说，“**告诉我你觉得自己这趟爬得怎么样——别只说『喜欢』。有多喜欢？**当心语序：路在听。”",
    passSpeaker: "向导",
    passLine: "I really like this path. The stones hum in order under your feet—each word landed on its right track.",
    passLineZh: "我非常喜欢这条路。脚下的石板按顺序嗡嗡作响——每个词都落在了自己的轨道上。",
    teaser: "「山顶的轮廓在雾里若隐若现。向导说：『顶上那座客栈的招牌，据说只有最高的比较级才读得懂。』」"
  },
  {
    setup: "At the summit, a wooden sign sways in the wind. \"**The innkeeper carved it for the last stretch,**\" the guide says. \"**One mountain, one first place—not a race between two, but the crown of all.** Finish the sign, and the door swings open.\"",
    setupZh: "到了山顶，一块木招牌在风里晃。“**客栈老板刻给最后一段路的，**”向导说，“**一座山只有一个第一名——不是两家的比赛，是全部里的王冠。**替他把招牌补完，门就开。”",
    passSpeaker: "向导",
    passLine: "The highest inn on the mountain. The door swings open—and the view from the top is worth every stone.",
    passLineZh: "山上的最高处那家客栈。门开了——山顶的景色配得上每一块石板。",
    teaser: "「客栈里暖烘烘的，歇过脚，向导指向一条更窄的小路：『下山走这边，路上有溪。』」"
  },
  {
    setup: "Past the inn, the trail narrows: a stream on the left, a cliff on the right. \"**A stream is a line, not a floor,**\" the guide says, uncoiling his rope. \"**Walk it the way you would trace a sentence—follow its direction.** Tell me how we walk the stream.\"",
    setupZh: "过了客栈，路变窄了：左边是溪，右边是崖。“**溪是一条线，不是一块地，**”向导解开绳圈说，“**走它就像读一句话——顺着它的方向。**告诉我我们怎么沿溪走。”",
    passSpeaker: "向导",
    passLine: "We walk along the stream. Your words follow the water's line—the trail widens under your feet.",
    passLineZh: "我们沿着溪走。你的话顺着水的线条——脚下的路宽了些。",
    teaser: "「越往下走雾越浓。向导忽然停下，把绳子又紧了紧：『得说清楚这雾有多大。』」"
  },
  {
    setup: "The fog thickens until the far cliff vanishes entirely. The guide ties the rope a notch tighter. \"**Fog like this has two halves,**\" he says. \"**How thick it is—and what it does to us.** One word joins the halves. Finish the line.\"",
    setupZh: "雾越来越浓，直到远处的崖壁完全消失。向导把绳子又收紧一格。“**这样的雾有两半，**”他说，“**它有多浓——以及它把我们怎么了。**有一个词把两半接起来。把这句补完。”",
    passSpeaker: "向导",
    passLine: "So thick that we can barely see. The bridge word lands—the rope pulls taut, and the two halves of the fog meet in your sentence.",
    passLineZh: "浓到我们几乎看不见。搭桥的词落了地——绳子绷紧，雾的两半在你的句子里接上了。",
    teaser: "「雾开始散了。向导说：『就在这儿歇吧——回头看，把你今天走的这条路，全说给我听。』」"
  },
  {
    setup: "The fog loosens in wide ribbons. From the summit post, the whole trail winds below you like a sentence written on the mountain. \"**Last thing before we go down,**\" the guide says, \"**look at it. How is it—and how much do you like it?** Say it all, and the mountain will remember your voice.\"",
    setupZh: "雾散成一条条宽缎带。从山顶的木桩望下去，整条小径像一句写在山上话。“**下山前最后一件事，**”向导说，“**看看它。它怎么样——你有多喜欢它？**全说出来，山会记住你的声音。”",
    passSpeaker: "向导",
    passLine: "The path is beautiful, and I really love it. The mountain repeats your words back, softer—and the way down opens clear and wide.",
    passLineZh: "这条路很美，我非常喜欢它。山把你这句话轻轻念了回来——下山的路清清楚楚地铺开了。",
    teaser: "「山脚下的岔口，一条路通往一片屋檐连绵的城——雾里传来书页翻动的声音。」"
  }
];

export const getMountainGate = (gateId: string): LanguageGate | undefined =>
  MOUNTAIN_GATES.find((gate) => gate.id === gateId);

export const getMountainStory = (gateId: string): MountainGateStory | undefined => {
  const index = MOUNTAIN_GATES.findIndex((gate) => gate.id === gateId);
  return index >= 0 ? MOUNTAIN_STORIES[index] : undefined;
};
