import type { LanguageGate } from "../types";

/**
 * 回声城世界（S2 谓语动词）· 批 1：G1–G3 现在系统（PRD-echo-city-content §2 教学点地图）。
 *
 * 世界机制：城市会复读你说过的每句话，时间线会错乱——
 * 说错时间，城市把你拉进错误的一天；说错人，城市把动作安到别人身上。
 * 误读支线统一四拍模板：①「」复读玩家句子 → ②城市具象反应 → ③错误时间后果 → ④lampHint 点拨。
 *
 * 红线与站台一致（gateScripts.test.ts 口径）：
 * 1. 每关玩家自己写英文（say/complete/respond）；
 * 2. NPC 台词语法正确——引文「…」内是玩家错句的原样复读，属机制资产，测试豁免「」内文本；
 * 3. 反馈不出现 wrong/incorrect/错误 字样。
 */

export const ECHO_WORLD_ID = "echo-city";

/** 回声城的门按关卡序排列（1–10，本批 1–3）。 */
export const ECHO_GATES: LanguageGate[] = [
  // ── G1 · 一般现在（自述）：承接站台结尾 teaser「有人在念你刚才说过的那句话」──────
  {
    id: "echo-gate-1",
    topicId: "s2-present-simple",
    runeId: "rune-present-clock",
    mode: "say",
    npcLine: "The walls repeat what you said at the station. Tell me—where do you live?",
    npcLineZh: "城墙在复读你在站台说过的话。告诉我——你住在哪儿？",
    zhIntent: "说你住在老钟楼附近。",
    canDo: "说清「我住在老钟楼附近」——每天都做的事用原形",
    requiredPattern: "I live near the old clock tower.",
    sampleAnswer: "I live near the old clock tower.",
    hints: [
      "I l___ near the old clock tower.",
      "每天都如此的事，动词用原形：live，不加任何尾巴。",
      "I live near the old clock tower."
    ],
    skeleton: { subject: "I", verb: "live near the old clock tower（住在哪儿）", subjectLabel: "谁", verbLabel: "住在哪里" },
    counterExample: "I lives near the old clock tower.",
    counterNote: "I 后面的动词不加 s——s 是留给他/她/它的",
    acceptRegex: "^i\\s+(live|'m living|stay)\\s+near\\s+the\\s+old\\s+(clock\\s+)?tower[.!]?$",
    misreadBranches: [
      {
        errorTag: "sv_agreement",
        npcReply: "「I lives here」— the walls repeat it, and a small door opens on a house that is not yours. The city has found another person with that name.",
        npcReplyZh: "「I lives here」——城墙复读着这句话，一扇小门在你不是屋主的房子上打开了。城市找到了另一个同名的人。",
        lampHint: "I 后面的动词用原形 live，不加 s——带 s 的是他/她/它的事。"
      }
    ]
  },

  // ── G2 · 三单：复读市民转述妹妹的日常 ──────────────────────────────
  {
    id: "echo-gate-2",
    topicId: "s2-third-person",
    runeId: "rune-third-sting",
    mode: "complete",
    npcLine: "The Echoers repeat what they hear. They say your sister works here. Finish their line: she ___ (go).",
    npcLineZh: "复读市民复读着听到的一切。他们说你妹妹在这儿工作。补全他们那句：she ___ (go)。",
    zhIntent: "补全这句话：She ___ (go) to work by tram.",
    canDo: "讲清「她坐电车上班」——她后面动词带小刺",
    requiredPattern: "She goes to work by tram.",
    sampleAnswer: "She goes to work by tram.",
    hints: [
      "She g___ to work by tram.",
      "她（she）后面的动词要带一根小刺：go → goes。",
      "She goes to work by tram."
    ],
    skeleton: { subject: "She", verb: "goes to work by tram（怎么上班）", subjectLabel: "谁", verbLabel: "做什么、怎么去" },
    counterExample: "She go to work by tram.",
    counterNote: "she 后面的动词少了那根小刺 -s，城市认不出她",
    acceptRegex: "^she\\s+(goes|takes)\\s+(a\\s+tram|the\\s+tram|tram|it)\\s+to\\s+work[.!]?$|^she\\s+goes\\s+to\\s+work\\s+by\\s+(tram|the\\s+tram)[.!]?$",
    misreadBranches: [
      {
        errorTag: "sv_agreement",
        npcReply: "「She go」— the Echoers repeat it to the square. But the bells ring for a crowd: the city thinks you mean many sisters.",
        npcReplyZh: "「She go」——复读市民把这句话带回了广场。可钟声为一群人敲响：城市以为你有好几个妹妹。",
        lampHint: "只有她一个人：go 要带上那根小刺，变成 goes。"
      }
    ]
  },

  // ── G3 · 主谓一致（复数对照 G2）：市民合唱 ────────────────────────
  {
    id: "echo-gate-3",
    topicId: "s2-sv-agreement",
    runeId: "rune-agreement-chain",
    mode: "say",
    npcLine: "Listen—the whole square is answering for you: your friends, where do they live?",
    npcLineZh: "听——整个广场在替你回答：你的朋友们，他们住在哪儿？",
    zhIntent: "说你的朋友们住在河对岸。",
    canDo: "说清「我的朋友们住在河对岸」——一群人配素面的动词",
    requiredPattern: "My friends live across the river.",
    sampleAnswer: "My friends live across the river.",
    hints: [
      "My friends l___ across the river.",
      "一群人（复数）的动词反而素面朝天：live，不加 s。",
      "My friends live across the river."
    ],
    skeleton: { subject: "My friends", verb: "live across the river（住在哪一侧）", subjectLabel: "谁（一群人）", verbLabel: "住在哪里" },
    counterExample: "My friends lives across the river.",
    counterNote: "朋友们是复数，动词不需要 s——链子配错对，全城走调",
    acceptRegex: "^my\\s+friends\\s+(live|are\\s+living|stay)\\s+across\\s+the\\s+river[.!]?$",
    misreadBranches: [
      {
        errorTag: "sv_agreement",
        npcReply: "「My friends lives」— the square repeats it, and the chain snaps: the bells ring one voice short. The city hears a single stranger, not your friends.",
        npcReplyZh: "「My friends lives」——广场复读着这句话，链子断了：钟声少了一个声部。城市听见的是一个陌生过客，不是你的朋友们。",
        lampHint: "一群人配素面的动词：friends 是复数，live 不加 s。"
      }
    ]
  },

  // ── G4 · 现在进行：漏 be 城市静止 ──────────────────────────────
  {
    id: "echo-gate-4",
    topicId: "s2-present-cont",
    runeId: "rune-ing-wave",
    mode: "complete",
    npcLine: "Listen—the bells cannot stop today. Finish Cora's line: the bells ___ (ring) again.",
    npcLineZh: "听——今天的钟停不下来。补全珂拉那句：the bells ___ (ring) again。",
    zhIntent: "补全这句话：The bells ___ (ring) again.",
    canDo: "说清「钟声又在响了」——正在发生要请 be 推动",
    requiredPattern: "The bells are ringing again.",
    sampleAnswer: "The bells are ringing again.",
    hints: [
      "The bells a__ ringing again.",
      "正在发生的事，be 和 -ing 要一起出现：are + ringing。",
      "The bells are ringing again."
    ],
    skeleton: { subject: "The bells", verb: "are ringing again（正在发生的动作）", subjectLabel: "什么", verbLabel: "正在做什么" },
    counterExample: "The bells ringing again.",
    counterNote: "少了 are——正在发生的波纹缺了推力，同刻凝固在半空",
    acceptRegex: "^the\\s+bells\\s+are\\s+ringing\\s+again[.!]?$",
    misreadBranches: [
      {
        errorTag: "missing_be",
        npcReply: "「The bells ringing」— the city waits. Nothing moves. Without *are*, your sentence stands still in time.",
        npcReplyZh: "「The bells ringing」——城市在原地等，什么都没有移动。少了 are，你的句子凝固在时间里。",
        lampHint: "正在发生的事，要请 be 来推动：The bells are ringing。"
      }
    ]
  },

  // ── G5 · 一般过去·规则动词：档案馆登记你的来路 ────────────────────
  {
    id: "echo-gate-5",
    topicId: "s2-past-regular",
    runeId: "rune-past-trace",
    mode: "say",
    npcLine: "The archive opens its ledger. When did you arrive in this city?",
    npcLineZh: "档案馆翻开了登记簿。你是什么时候到这座城的？",
    zhIntent: "说你昨天晚上到的。",
    canDo: "讲清「我昨晚到的」——过去的事动词留痕",
    requiredPattern: "I arrived yesterday evening.",
    sampleAnswer: "I arrived yesterday evening.",
    hints: [
      "I a______ yesterday evening.",
      "发生过的事，动词要留下痕迹：arrive → arrived。",
      "I arrived yesterday evening."
    ],
    skeleton: { subject: "I", verb: "arrived yesterday evening（到达的时间）", subjectLabel: "谁", verbLabel: "什么时候做了什么" },
    counterExample: "I arrive yesterday evening.",
    counterNote: "说的是昨晚的事，arrive 要留下痕迹变成 arrived，否则档案里你是还没出发的人",
    acceptRegex: "^i\\s+(arrived|got here|came|got in)\\s+(yesterday\\s+evening|yesterday|last night)[.!]?$",
    misreadBranches: [
      {
        errorTag: "tense",
        npcReply: "「I arrive yesterday evening」— the ledger shivers. The city writes you down as someone who has not left yet. Time has not moved for you.",
        npcReplyZh: "「I arrive yesterday evening」——登记簿颤了一下。城市把你写成了「还没有出发的人」。你的时间没有走动。",
        lampHint: "yesterday 是过去的门票：arrive 要变成 arrived。"
      }
    ]
  },

  // ── G6 · 过去·不规则①（go/come/see）：城市的旧方言 ────────────────
  {
    id: "echo-gate-6",
    topicId: "s2-past-irregular-1",
    runeId: "rune-past-trace",
    mode: "complete",
    npcLine: "Cora points down the street. Finish the old song: she ___ (go) home last night.",
    npcLineZh: "珂拉指向街道那头。补全这首老歌：she ___ (go) home last night。",
    zhIntent: "补全这句话：She ___ (go) home last night.",
    canDo: "讲清「她昨晚回家了」——go 的旧方言是 went",
    requiredPattern: "She went home last night.",
    sampleAnswer: "She went home last night.",
    hints: [
      "She w___ home last night.",
      "go 是城市的旧方言，它的过去式不是加 -ed，是 went。",
      "She went home last night."
    ],
    skeleton: { subject: "She", verb: "went home last night（昨晚回了家）", subjectLabel: "谁", verbLabel: "做了什么" },
    counterExample: "She go home last night.",
    counterNote: "go 的过去式是不规则的 went——用原形，街道会把你拉回错的那天",
    acceptRegex: "^she\\s+went\\s+home\\s+(last\\s+night|yesterday)[.!]?$",
    misreadBranches: [
      {
        errorTag: "tense",
        npcReply: "「She go home last night」— the street repeats it, and the lamps flicker: the city pulls you back to a day she has not left yet. The old dialect refuses the plain word.",
        npcReplyZh: "「She go home last night」——街道复读着这句话，路灯闪烁：城市把你拉回她还没离开的那天。旧方言不接受这个素面的词。",
        lampHint: "go 的旧方言形式是 went：She went home last night。"
      }
    ]
  },

  // ── G7 · 过去·不规则②（take/buy/eat/have）+ 时间状语：夜市三问 ──────
  {
    id: "echo-gate-7",
    topicId: "s2-past-irregular-2",
    runeId: "rune-past-trace",
    mode: "respond",
    npcLine: "The night-market elder holds up three fingers. \"Last week. The night train. Tell me — what did we do?\"",
    npcLineZh: "夜市老人竖起三根手指。“上周。夜班车。告诉我——我们做了什么？”",
    zhIntent: "说你们上周坐了夜班车。",
    canDo: "讲清「我们上周坐的夜班车」——take 的亲戚是 took",
    requiredPattern: "We took the night train last week.",
    sampleAnswer: "We took the night train last week.",
    hints: [
      "We t___ the night train last week.",
      "take 的过去式是 took——它不守 -ed 的规矩。",
      "We took the night train last week."
    ],
    skeleton: { subject: "We", verb: "took the night train last week（坐了什么、什么时候）", subjectLabel: "谁", verbLabel: "做了什么" },
    counterExample: "We take the night train last week.",
    counterNote: "last week 的事，take 要用它的不规则过去式 took",
    acceptRegex: "^we\\s+took\\s+(the\\s+)?night\\s+train\\s+(last\\s+week|last\\s+night)[.!]?$",
    misreadBranches: [
      {
        errorTag: "tense",
        npcReply: "「We take the night train last week」— the elder laughs. The market lanterns dim: the city hears you planning a trip that already happened. The road back to the inn stays dark.",
        npcReplyZh: "「We take the night train last week」——老人笑了。市集灯笼暗下去：城市听见你在计划一段已经发生的旅程。回旅馆的路还黑着。",
        lampHint: "上周的事用过去式：take → took。We took the night train last week。"
      }
    ]
  },

  // ── G8 · 将来·will：城东门只对"将来"显形 ─────────────────────────
  {
    id: "echo-gate-8",
    topicId: "s2-future-will",
    runeId: "rune-future-gate",
    mode: "say",
    npcLine: "The east gate is only half here. Tell me—when will it show itself? Say what the gate will do at dawn.",
    npcLineZh: "城东门只有一半在这里。告诉我——它什么时候才会现身？说说黎明时这扇门会做什么。",
    zhIntent: "说这扇门在黎明时会打开。",
    canDo: "说清「这扇门会在黎明打开」——will 开路",
    requiredPattern: "The gate will open at dawn.",
    sampleAnswer: "The gate will open at dawn.",
    hints: [
      "The gate w___ open at dawn.",
      "还没发生的事，让 will 先开门——will 后面的动词用原形 open。",
      "The gate will open at dawn."
    ],
    skeleton: { subject: "The gate", verb: "will open at dawn（将来会发生的事）", subjectLabel: "什么", verbLabel: "会发生什么" },
    counterExample: "The gate will opened at dawn.",
    counterNote: "will 后面只能跟原形——opened 是过去的事，进不了将来的门",
    acceptRegex: "^the\\s+gate\\s+(will|'ll)\\s+open\\s+at\\s+dawn[.!]?$",
    misreadBranches: [
      {
        errorTag: "verb_form",
        npcReply: "「The gate will opened」— the gate flickers at the edge of tomorrow. It hears a door that has already closed. A picture of a finished day. It cannot walk through.",
        npcReplyZh: "「The gate will opened」——门在明天的边缘闪烁。它听见的是一扇已经关上的门，一张已经结束的日子的照片。它走不进来。",
        lampHint: "will 是一扇门，只让原形通过：will open，不是 will opened。"
      }
    ]
  },

  // ── G9 · be going to（计划）vs will（意愿）：Omar 谈明天的生意 ──────
  {
    id: "echo-gate-9",
    topicId: "s2-future-going-to",
    runeId: "rune-future-gate",
    mode: "complete",
    npcLine: "Omar from the station kiosk waves—he has plans. Tomorrow, the market... He points at his schedule board. Finish it: I ___ (be) going to visit the clock tower.",
    npcLineZh: "站台小卖部的 Omar 挥着手——他带着计划来的。明天，市集……他指指日程板。补全它：I ___ (be) going to visit the clock tower。",
    zhIntent: "补全这句话：I ___ (be) going to visit the clock tower.",
    canDo: "说清「我打算去钟楼」——计划用 be going to",
    requiredPattern: "I am going to visit the clock tower.",
    sampleAnswer: "I am going to visit the clock tower.",
    hints: [
      "I a_ going to visit the clock tower.",
      "写进日程的计划用 be going to：I 后面请 am 帮忙。",
      "I am going to visit the clock tower."
    ],
    skeleton: { subject: "I", verb: "am going to visit（按计划要做的事）", subjectLabel: "谁", verbLabel: "计划做什么" },
    counterExample: "I going to visit the clock tower.",
    counterNote: "going to 前面少了 am——计划缺了落地的支点",
    acceptRegex: "^i\\s*(am|'m)\\s+going\\s+to\\s+visit\\s+the\\s+clock\\s+tower[.!]?$",
    misreadBranches: [
      {
        errorTag: "missing_be",
        npcReply: "「I going to visit」— Omar's schedule board stays blank. The plan has no anchor: a trip on paper that never touches the ground.",
        npcReplyZh: "「I going to visit」——Omar 的日程板还是一片空白。计划没有落点：一段只停在纸上的旅程，永远碰不到地面。",
        lampHint: "be going to 要有 be 当支点：I am going to visit。"
      }
    ]
  },

  // ── G10 · 现在完成 + 全线混合：大钟敲响，三条时间线同时敞开 ─────────
  {
    id: "echo-gate-10",
    topicId: "s2-present-perfect",
    runeId: "rune-perfect-bridge",
    mode: "respond",
    npcLine: "The great bell rings. Cora stands below it, looking up. One last thing. This city—you have lived inside it for days now. Tell me what you have experienced. What have you seen?",
    npcLineZh: "大钟敲响。珂拉站在钟下，仰头看着。最后一件事。这座城市——你已经在里面生活了好几天。告诉我你经历过什么。你见到过什么？",
    zhIntent: "说你从没见过一座会说话的城市。",
    canDo: "说出经历「我从没见过会说话的城市」",
    requiredPattern: "I have never seen a talking city.",
    sampleAnswer: "I have never seen a talking city.",
    hints: [
      "I h___ never seen a talking city.",
      "经历过的事，用 have + 过去分词搭桥：have + seen。",
      "I have never seen a talking city."
    ],
    skeleton: { subject: "I", verb: "have never seen（经历之桥：到现在为止从未）", subjectLabel: "谁", verbLabel: "经历过什么" },
    counterExample: "I have never saw a talking city.",
    counterNote: "桥面要用过去分词 seen——saw 是过去时的砖，搭不了完成之桥",
    acceptRegex: "^i\\s+(have|'ve)\\s+never\\s+seen\\s+a\\s+talking\\s+city[.!]?$",
    misreadBranches: [
      {
        errorTag: "verb_form",
        npcReply: "「I have never saw」— the bridge shudders and holds. The city tilts: a finished moment is holding up a sentence that reaches into now. It almost carries you—almost.",
        npcReplyZh: "「I have never saw」——桥身晃了一下，撑住了。城市倾斜：一块属于过去时刻的砖，撑着一句伸到此刻的话。它几乎载动你——差一点。",
        lampHint: "完成之桥用过去分词：have + seen。saw 是过去的砖。"
      }
    ]
  }
];

/** 回声城每关剧情阶段文本（索引对齐 ECHO_GATES；setup 用 **bold** 高亮目标句型 ≥2 处）。 */
export interface EchoGateStory {
  setup: string;
  setupZh: string;
  passSpeaker: string;
  passLine: string;
  passLineZh: string;
  teaser: string;
}

export const ECHO_STORIES: EchoGateStory[] = [
  {
    setup: "Vera walks you to the city gate. \"**The walls repeat what you said on the platform,**\" she says, \"word for word.\" Inside, a tall keeper stands by a huge clock. \"Welcome. I am Cora, the clock keeper. **The city remembers every sentence—but it only opens for the ones said in the right time.** Now—tell me where you live.\"",
    setupZh: "Vera 送你到城门口。“**城墙会一字不差地复读你在站台说过的话**，”她说。城内，一位高个子的守钟人立在大钟旁。“欢迎。我是珂拉，守钟人。**这座城记得每一句话——但只对说对了时间的句子开门。**现在——告诉我你住在哪儿。”",
    passSpeaker: "珂拉",
    passLine: "Near the old clock tower. Good. The city hears your 'now' clearly.",
    passLineZh: "老钟楼附近。很好。城市听清了你的「现在」。",
    teaser: "「广场那头，复读市民们围住了你妹妹的话——他们想听第三个人。」"
  },
  {
    setup: "The Echoers—citizens who repeat everything—crowd the tram stop. \"**She goes to work by tram**, every morning,\" one of them murmurs, again and again. Cora smiles: \"**They keep everyone's daily life in the present tense.** But your sister's line lost its tail. Finish it for them.\"",
    setupZh: "复读市民——什么都复读的市民们——围住了电车站。“**她每天早上坐电车上班**，”其中一位一遍遍念着。珂拉笑了：“**他们用现在时保存每个人的日常。**可你妹妹那句话丢了尾巴。替他们补全吧。”",
    passSpeaker: "珂拉",
    passLine: "She goes by tram. The tail is back—the Echoers can keep her morning safe.",
    passLineZh: "她坐电车去。小刺回来了——复读市民们能守住她的早晨了。",
    teaser: "「整座广场忽然安静下来，在等你说出下一句——他们想合唱。」"
  },
  {
    setup: "The whole square falls quiet, waiting. \"**Your friends live across the river**, don't they?\" Cora whispers. \"**When many people answer together, the bells ring in one piece.** Tell the city about your friends—carefully. One stray tail, and the chorus snaps.\"",
    setupZh: "整座广场安静下来，等着。“**你的朋友们住在河对岸**，对吗？”珂拉低声说，“**一群人一起回答时，钟声是一个整体。**告诉这座城你的朋友们的事——小心点。一个错误的尾巴，合唱就断了。”",
    passSpeaker: "珂拉",
    passLine: "Across the river. Listen—the bells ring for all of them, in one voice.",
    passLineZh: "河对岸。听——钟声为他们所有人敲响，同一个声部。",
    teaser: "「城墙上，一排新挂的钟开始轻轻晃动——它们在等一场正在发生的雨。」"
  },
  {
    setup: "The new bells sway and swing. \"**The bells are ringing again**,\" Cora says, and smiles for the first time. \"**They are celebrating something that is happening right now.** Wait—can you hear how they never stop?\" The square hums with a sound that is still going on.",
    setupZh: "新挂的钟左右摇晃。“**钟声又响起来了**，”珂拉说，第一次露出微笑，“**它们在庆祝正在发生的事。**等等——你听出来了吗，它们从不停下？”广场嗡嗡作响，声音还在继续。",
    passSpeaker: "珂拉",
    passLine: "The bells are ringing again—and you heard the push behind them. The wave keeps moving now.",
    passLineZh: "钟声又响起来了——你听见了它背后的那股推力。波纹重新开始流动了。",
    teaser: "「一辆旧马车停在档案馆门口——车夫在等一个能记起昨天的人。」"
  },
  {
    setup: "A grey archway opens into the Archive. The keeper slides a heavy ledger across the desk. \"To enter,\" she says, \"tell me when you arrived.\" Cora whispers: \"**I arrived on the last train—I wrote it in the ledger myself.** Say it the way the archive needs it—\" and she taps the page: \"**yesterday's things leave a mark.**\"",
    setupZh: "一道灰色的拱门通向档案馆。管理员把一本厚重的登记簿推过桌面。“要进去，”她说，“告诉我你什么时候到的。”珂拉低声说：“**我是坐末班车到的——我亲手把它写进了登记簿。**按档案馆需要的方式说——”她敲了敲纸页：“**昨天的事要留下痕迹。**”",
    passSpeaker: "档案馆管理员",
    passLine: "I arrived yesterday evening. The ledger is satisfied—your marks are in the right place.",
    passLineZh: "我昨晚到的。登记簿满意了——你的痕迹落在了对的位置。",
    teaser: "「档案馆深处飘来一段老歌，唱到一半，动词卡在了喉咙里。」"
  },
  {
    setup: "An old song drifts from the Archive's inner rooms. \"**She went home last night**,\" the ledger keeper hums, \"**that is the old dialect.**\" She looks at you: \"The plain word won't carry it. Finish the line, and the street will remember your voice.\"",
    setupZh: "一段老歌从档案馆深处飘出来。“**她在天黑前回了家**，”登记簿管理员哼着，“**那是旧方言。**”她看着你：“素面的词带不动它。补全这句，街道就会记住你的声音。”",
    passSpeaker: "档案馆管理员",
    passLine: "She went home last night. The old dialect accepts you now—the street hums the line back.",
    passLineZh: "她在天黑前回了家。旧方言接受你了——街道把这句话哼了回来。",
    teaser: "「出了档案馆，夜色里飘来食物的香气——夜市老人朝你招手。」"
  },
  {
    setup: "The night market steams and glows. An elder looks up from his stall and holds three fingers. \"**We took the night train last week**—that is one of my three stories,\" he says. \"**Tell it back to me, and the road to your inn will light up.** Which one was it? Say it plainly.\"",
    setupZh: "夜市冒着热气，满摊灯光。老人从摊子后抬起头，竖起三根手指。“**我们上周坐了夜班车**——这是我的三个故事之一，”他说，“**把它说还给我，回旅馆的路就会亮起来。**是哪一件？说明白。”",
    passSpeaker: "夜市老人",
    passLine: "We took the night train last week. Good—your road is lit. The elder remembers you now.",
    passLineZh: "我们上周坐了夜班车。好——你的路亮了。老人记住你了。",
    teaser: "「城东的方向传来一声闷响——那扇只对『将来』显形的门，在夜里轻轻动了一下。」"
  },
  {
    setup: "At the eastern edge of the city, a gate stands half-solid: you can see street lamps through it. \"**The gate will open at dawn**,\" Cora says quietly, \"**if someone says it in the future's own words.** It only shows itself to sentences about tomorrow. Try—tell the gate what it will do.\"",
    setupZh: "在城市的东边，一扇门只有一半是实体：透过它能看到街灯。“**这扇门会在黎明时打开**，”珂拉轻声说，“**如果有人用『将来』自己的话说出它。**它只对关于明天的句子现身。试试——告诉门它将会做什么。”",
    passSpeaker: "珂拉",
    passLine: "The gate will open at dawn. The gate grows solid—the future has a handle now.",
    passLineZh: "这扇门会在黎明时打开。门凝成了实体——「将来」有把手了。",
    teaser: "「门外传来熟悉的吆喝声——是 Omar 的摊子，他在板子上写着什么。」"
  },
  {
    setup: "Omar has set up his kiosk just inside the eastern gate. \"**I am going to visit the clock tower** tomorrow,\" he announces, tapping his schedule board. \"**Plans go on the board—the board only takes going to.** Quick, before the ink dries: finish the line for me?\"",
    setupZh: "Omar 在东门里侧支起了他的小摊。“**我明天要去钟楼看看**，”他敲着日程板宣布，“**计划要写上板子——板子只收 going to 的写法。**快，趁墨还没干：替我把这句话补完？”",
    passSpeaker: "Omar",
    passLine: "I am going to visit the clock tower. On the board it goes—Omar grins: the plan is real now.",
    passLineZh: "我要去钟楼看看。写进板子了——Omar 咧嘴一笑：计划现在是真的了。",
    teaser: "「大钟忽然自己敲响了，一下，又一下——珂拉在钟楼下抬头望着你。」"
  },
  {
    setup: "The great bell swings on its own. Cora stands beneath it, hands quiet at her sides. \"**You have lived inside this city for days now**,\" she says. \"**Everything you have seen still lives in you.** The city wants to know: has anyone ever seen a talking city before you? Tell it what you have experienced.\"",
    setupZh: "大钟自己荡了起来。珂拉站在钟下，双手安静地垂着。“**你已经在这座城里生活了好几天**，”她说，“**你见过的一切都还活在你身上。**城市想知道：在你之前，有谁见过一座会说话的城市吗？把你经历的告诉它。”",
    passSpeaker: "珂拉",
    passLine: "I have never seen a talking city. The bridge holds. Cora smiles: then you are the city's first witness—and its bridge.",
    passLineZh: "我从没见过一座会说话的城市。桥稳住了。珂拉笑了：那么你就是这座城市的第一个见证人——也是它的桥。",
    teaser: "「回声城的故事在这里告一段落。更远的集市、山径、图书馆、灯塔，还在等你说出下一句话。」"
  }
];

export const getEchoGate = (gateId: string): LanguageGate | undefined =>
  ECHO_GATES.find((gate) => gate.id === gateId);

export const getEchoStory = (gateId: string): EchoGateStory | undefined => {
  const index = ECHO_GATES.findIndex((gate) => gate.id === gateId);
  return index >= 0 ? ECHO_STORIES[index] : undefined;
};
