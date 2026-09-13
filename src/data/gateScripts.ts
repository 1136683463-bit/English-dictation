import type { LanguageGate } from "../types";

/**
 * 站台世界 8 道语言之门（GRAMMAR_ADVENTURE_PLAN §10 P0）。
 * 手写种子内容——P0 的全部意义是验证"误读支线"手感，脚本质量直接决定信号质量。
 *
 * 红线（§12）：
 * 1. 每关至少一次玩家自己写英文（8 关全部 say/complete 模式，无纯选项关）；
 * 2. NPC 台词（含误读支线）必须语法正确——由 gateScripts.test.ts 脚本校验；
 * 3. 反馈不出现 "wrong / incorrect" 字样——同上校验。
 *
 * 示例 A/B/C（§3）原样落地为 gate-1 / gate-2 / gate-5。
 */

/** 每关剧情阶段（story）的完整文本，索引对齐 STATION_GATES。 */
export interface GateStory {
  /** 剧情铺垫英文（v1 起用 `**bold**` 标记目标句型，渲染时转为 <strong>）。 */
  setup: string;
  setupZh: string;
  /** 通关台词的说话人（结算页归属，v1.x settle 闭环新增）。 */
  passSpeaker: string;
  passLine: string;
  passLineZh: string;
  teaser: string;
}

export const STATION_WORLD_ID = "station";

export const STATION_GATES: LanguageGate[] = [
  // ── 第 1 关 · 示例 A：时态错位（误读支线，最出彩的一档）─────────────
  {
    id: "station-gate-1",
    topicId: "s2-past",
    runeId: "rune-past-trace",
    mode: "say",
    npcLine: "Where are you from? And when did you arrive?",
    npcLineZh: "你是从哪里来的？什么时候到的？",
    zhIntent: "告诉她你从北京来，昨天晚上到的。",
    requiredPattern: "I came from Beijing. I arrived last night.",
    sampleAnswer: "I came from Beijing. I arrived last night.",
    skeleton: { subject: "I", verb: "came + arrived（两个动作都用过去式）", subjectLabel: "谁", verbLabel: "做了什么" },
    counterExample: "I come from Beijing. I arrive last night.",
    counterNote: "说的是昨晚的事，动词要变回过去式",
    hints: [
      "I c____ from Beijing. I a______ last night.",
      "come → came；arrive → arrived（不规则的动词要换形）",
      "I came from Beijing. I arrived last night."
    ],
    acceptRegex: "^i\\s+(came|come)\\s+from\\s+beijing[.!\\s]+i\\s+(arrived|got here|came)\\s+(last night|yesterday night)[.!]?$",
    misreadBranches: [
      {
        errorTag: "tense",
        npcReply: "You come now? But the last train already left.",
        npcReplyZh: "你现在就来？可末班车已经开走了呀。",
        lampHint: "她以为你正在从北京来。把时间放回「昨晚」试试。"
      }
    ]
  },

  // ── 第 2 关 · 示例 B：骨架缺失（be 动词）─────────────────────────
  {
    id: "station-gate-2",
    topicId: "s0-be",
    runeId: "rune-be-anchor",
    mode: "say",
    npcLine: "Are you ready to board?",
    npcLineZh: "你准备好上车了吗？",
    zhIntent: "说自己准备好了。",
    requiredPattern: "I am ready.",
    sampleAnswer: "I am ready.",
    skeleton: { subject: "I", verb: "am ready（是/处于）", subjectLabel: "谁", verbLabel: "是什么" },
    counterExample: "I ready.",
    counterNote: "少了 am，句子就塌了",
    hints: [
      "I ___ ready.",
      "「I am」就是“我是”的地基，少了它，句子就塌了。",
      "I am ready."
    ],
    acceptRegex: "^i\\s*(am|'m)\\s+(ready|all set|good to go)[.!]?$",
    misreadBranches: [
      {
        errorTag: "missing_be",
        npcReply: "Ready for what? You are… what?",
        npcReplyZh: "准备好什么？你是……什么？",
        lampHint: "英语的句子里，主语后面必须站一个动词。「I am」就是“我是”的地基，少了它，句子就塌了。"
      }
    ]
  },

  // ── 第 3 关：主语 + 谓语骨架（补全模式）──────────────────────────
  {
    id: "station-gate-3",
    topicId: "s0-skeleton",
    runeId: "rune-verb-bone",
    mode: "complete",
    npcLine: "The train is late. Tell me—what do you do now?",
    npcLineZh: "车晚点了。告诉我——你现在做什么？",
    zhIntent: "补全这句话：I ___ (wait).",
    requiredPattern: "I wait.",
    sampleAnswer: "I wait.",
    skeleton: { subject: "I", verb: "wait（做）", subjectLabel: "谁", verbLabel: "做什么" },
    counterExample: "I waiting.",
    counterNote: "waiting 是「等待中」，不是一个动作",
    hints: [
      "I w___.",
      "主语 I 后面直接跟动词原形。",
      "I wait."
    ],
    acceptRegex: "^i\\s+(wait|will wait|'ll wait|am waiting|'m waiting|just wait|wait here)[.!]?$",
    misreadBranches: [
      {
        errorTag: "verb_form",
        npcReply: "You waiting? Waiting is a thing, not an action. What do you do?",
        npcReplyZh: "你“等待中”？等待是一件事，不是一个动作。你在做什么？",
        lampHint: "这里缺的是那个“做”的词。I 后面直接写 wait。"
      }
    ]
  },

  // ── 第 4 关：there be 句型 ──────────────────────────────────────
  {
    id: "station-gate-4",
    topicId: "s0-there",
    runeId: "rune-there-eye",
    mode: "say",
    npcLine: "Is anything on the bench over there?",
    npcLineZh: "那边的长椅上有东西吗？",
    zhIntent: "说长椅上有一盏灯。",
    requiredPattern: "There is a lamp on the bench.",
    sampleAnswer: "There is a lamp on the bench.",
    skeleton: { subject: "There is", verb: "a lamp（什么东西）", subjectLabel: "有", verbLabel: "什么东西" },
    counterExample: "A lamp on the bench.",
    counterNote: "少了 There is，「有」字没说出来",
    hints: [
      "There ___ a lamp on the bench.",
      "「有」一只眼睛：There is + 一个东西。",
      "There is a lamp on the bench."
    ],
    acceptRegex: "^(yes[,.!]?\\s+)?there\\s*(is|'s)\\s+a\\s+(little\\s+)?(lamp|light|small lamp|little lamp)\\s+on\\s+the\\s+bench[.!]?$",
    misreadBranches: [
      {
        errorTag: "fragment",
        npcReply: "A lamp? Where? Point at it for me.",
        npcReplyZh: "一盏灯？在哪儿？指给我看看。",
        lampHint: "她想听一个完整的句子。从 There is 开始。"
      }
    ]
  },

  // ── 第 5 关 · 示例 C：冠词 a/an ─────────────────────────────────
  {
    id: "station-gate-5",
    topicId: "s1-article",
    runeId: "rune-article-ring",
    mode: "say",
    npcLine: "The kiosk is still open. What would you like?",
    npcLineZh: "小卖部还开着。想要点什么？",
    zhIntent: "说想要一个苹果。",
    requiredPattern: "I want an apple.",
    sampleAnswer: "I want an apple.",
    skeleton: { subject: "I", verb: "want an apple（想要一个苹果）", subjectLabel: "谁", verbLabel: "想要什么" },
    counterExample: "I want a apple.",
    counterNote: "a 和 apple 两个元音撞住了，要加 n 当垫片",
    hints: [
      "I want ___ apple.",
      "两个元音撞在一起会黏住。a 和 apple 之间，需要一个 n 当垫片。",
      "I want an apple."
    ],
    acceptRegex: "^i\\s+(want|would like|'d like)\\s+(an apple|one apple)[.!]?$",
    misreadBranches: [
      {
        errorTag: "article",
        npcReply: "A apple? I've never heard of that fruit. Do you mean an apple?",
        npcReplyZh: "「啊破」？我没听过这种水果。你是说 an apple？",
        lampHint: "两个元音撞在一起会黏住。a 和 apple 之间，需要一个 n 当垫片。"
      }
    ]
  },

  // ── 第 6 关：三单（她/他 + 动词 -s）─────────────────────────────
  {
    id: "station-gate-6",
    topicId: "s2-sv",
    runeId: "rune-subject-heart",
    mode: "say",
    npcLine: "The girl in the green coat—does she go to the city too?",
    npcLineZh: "那个穿绿大衣的女孩——她也去城里吗？",
    zhIntent: "说她每天去城里。",
    requiredPattern: "She goes to the city every day.",
    sampleAnswer: "She goes to the city every day.",
    skeleton: { subject: "She", verb: "goes（去，带小尾巴 -s）", subjectLabel: "谁", verbLabel: "做什么" },
    counterExample: "She go to the city every day.",
    counterNote: "she 后面的 go 要带小尾巴 -s",
    hints: [
      "She g___ to the city every day.",
      "她/他后面的动词要带一条小尾巴：go → goes。",
      "She goes to the city every day."
    ],
    acceptRegex: "^she\\s+(goes|travels|commutes)\\s+to\\s+the\\s+city\\s+(every\\s*day|everyday|daily|each\\s+day)[.!]?$",
    misreadBranches: [
      {
        errorTag: "sv_agreement",
        npcReply: "She go? One girl, or two? If it is just her, the word needs its tail.",
        npcReplyZh: "她 go？一个还是两个？如果只是她，那个词需要它的小尾巴。",
        lampHint: "她（she）后面的动词要加 -s：go → goes。"
      }
    ]
  },

  // ── 第 7 关：过去式综合运用（买票）──────────────────────────────
  {
    id: "station-gate-7",
    topicId: "s2-past",
    runeId: "rune-past-trace",
    mode: "say",
    npcLine: "Your ticket, please. And when did you buy it?",
    npcLineZh: "请出示车票。你是什么时候买的？",
    zhIntent: "说我昨天买的。",
    requiredPattern: "I bought it yesterday.",
    sampleAnswer: "I bought it yesterday.",
    skeleton: { subject: "I", verb: "bought（买，过去式）", subjectLabel: "谁", verbLabel: "做了什么" },
    counterExample: "I buy it yesterday.",
    counterNote: "昨天买的，buy 要变回 bought",
    hints: [
      "I b___ it yesterday.",
      "buy 的过去式是不规则的：buy → bought。",
      "I bought it yesterday."
    ],
    acceptRegex: "^i\\s+(bought|got)\\s+(it|the ticket|this ticket)\\s+(yesterday|last night)[.!]?$",
    misreadBranches: [
      {
        errorTag: "tense",
        npcReply: "You buy it now? Here? But I am holding it in my hand.",
        npcReplyZh: "你现在买？在这儿？可票就在我手里呀。",
        lampHint: "他听成了你现在才买。把 buy 变回昨天：bought。"
      }
    ]
  },

  // ── 第 8 关：站台收束（道别 + will 句型）─────────────────────────
  {
    id: "station-gate-8",
    topicId: "s0-skeleton",
    runeId: "rune-verb-bone",
    mode: "say",
    npcLine: "The train is calling. One last thing—tell me you will come back.",
    npcLineZh: "车在催了。最后一件事——告诉我你会回来。",
    zhIntent: "说你会回来的。",
    requiredPattern: "I will come back.",
    sampleAnswer: "I will come back.",
    skeleton: { subject: "I", verb: "will come back（会回来）", subjectLabel: "谁", verbLabel: "会做什么" },
    counterExample: "I will came back.",
    counterNote: "will 后面的动词要用原形 come，不是 came",
    hints: [
      "I w___ come back.",
      "「会」用 will，后面的动词用原形。",
      "I will come back."
    ],
    acceptRegex: "^i\\s+(will|'ll)\\s+(come back|be back|return)[.!]?$",
    misreadBranches: [
      {
        errorTag: "verb_form",
        npcReply: "You will came back? Will is a door—only the plain word walks through it.",
        npcReplyZh: "You will came back？will 是一扇门——只有原形动词走得进去。",
        lampHint: "will 后面的动词用原形：come，不是 came。"
      }
    ]
  }
];

/** 按 id 找门。 */
export const getStationGate = (gateId: string): LanguageGate | undefined =>
  STATION_GATES.find((gate) => gate.id === gateId);

/** 站台世界的门按关卡序排列（1–8）。 */
export const listStationGates = (): LanguageGate[] => STATION_GATES;

/**
 * 每关剧情阶段文本（M1 从 GatePlayPage 迁入：剧情即内容资产，与 npcLine/hints 同文件维护）。
 * setup 改写原则（站台关卡页优化 PRD FR-1）：目标句型在剧情中自然复现 ≥2 次，
 * 用 `**bold**` 标记目标形式，与 NPC 提问构成问答同构。
 */
export const GATE_STORIES: GateStory[] = [
  {
    setup: "Rain stitches the night outside Platform Seven. The little lamp dozes by your bag, murmuring in its sleep: \"**Yesterday, I came here on the late train.** **I arrived so quietly.**\" Vera, the ticket clerk, looks up as you walk over, wet and tired.",
    setupZh: "雨在七号站台外织着夜。小灯枕着你的包打盹，梦话含糊：“**昨天，我坐晚班车来的。我到得静悄悄的。**”售票员 Vera 在你走近时抬起头，你浑身湿透，一脸疲惫。",
    passSpeaker: "Vera",
    passLine: "Ah, last night! Then you must be tired. Here, hot tea.",
    passLineZh: "啊，昨晚！那你一定累了。来，热茶。",
    teaser: "灯焰暗了一下。「下一班车进站前，小灯想问你一件事。」"
  },
  {
    setup: "The little lamp on the bench flickers awake. \"**I am here!**\" it hums, its glow warm against the cold air. It circles you once, curious: \"**You are new on this platform.** Are you ready to board?\"",
    setupZh: "长椅上的小灯醒了过来。“**我在这儿呢！**”它哼着，光在冷空气里显得格外暖。它绕着你飞了一圈，好奇地问：“**你是这站台上的新面孔。**准备好上车了吗？”",
    passSpeaker: "小灯",
    passLine: "Now I understand you. Let's go.",
    passLineZh: "现在我懂你了。走吧。",
    teaser: "「广播响了——车晚点了。站台上的人都竖起了耳朵。」"
  },
  {
    setup: "The loudspeaker crackles: the train is late. Around you, shoulders slump. \"**I wait.** That is all anyone can do,\" the little lamp sighs. \"**We wait together.**\" Vera is watching you.",
    setupZh: "广播噼啪响起：车晚点了。周围的人肩膀都垮了下来。“**我等。**谁都只能等了，”小灯叹了口气，“**我们一起等。**”Vera 正看着你。",
    passSpeaker: "小灯",
    passLine: "Waiting is hard. But you said it like someone who knows how.",
    passLineZh: "等待很难。但你说起等待的样子，像个很有耐心的人。",
    teaser: "「小灯忽然飘向长椅——它好像发现了什么。」"
  },
  {
    setup: "The little lamp drifts toward the far bench and circles back, humming with quiet excitement. \"**There is something on that bench!**\" it whispers. \"Look—**there is a little glow over there.**\"",
    setupZh: "小灯朝远处的长椅飘过去，又带着一丝兴奋的嗡鸣绕了回来。“**那条长椅上有东西！**”它压低声音，“看——**那边有一小团光。**”",
    passSpeaker: "小灯",
    passLine: "A lamp! Just like me. Go and say hello—it gets lonely on that bench.",
    passLineZh: "一盏灯！和我一样。去打个招呼吧——那条长椅上会寂寞的。",
    teaser: "「小卖部的灯还亮着。你的肚子叫了一声。」"
  },
  {
    setup: "The kiosk glows at the end of the platform. Omar the vendor is stacking fruit, humming an old song. \"**I want a hot drink** on a night like this,\" the little lamp says, eyeing the steam. \"**Do you want something too?**\"",
    setupZh: "站台尽头的小卖部还亮着灯。摊主 Omar 一边码水果，一边哼着一首老歌。“这样的夜里**我想喝杯热饮**，”小灯盯着热气说，“**你也想要点什么吗？**”",
    passSpeaker: "Omar",
    passLine: "One an apple, coming right up.",
    passLineZh: "一个 an apple，马上来。",
    teaser: "「Omar 把苹果递给你，忽然朝你身后努了努嘴。」"
  },
  {
    setup: "A girl in a green coat hurries past, chasing the same announcement board you were just reading. \"**She goes to the city every day,**\" the little lamp says. \"**She reads that board like a book.** Do you think she is going tonight too?\"",
    setupZh: "一个穿绿大衣的女孩匆匆走过，去追你刚刚看过的那块告示牌。“**她每天都去城里，**”小灯说，“**她看那块牌子就像看书一样。**你觉得她今晚也走吗？”",
    passSpeaker: "小灯",
    passLine: "Every day? Then she will be on this train tonight, for sure.",
    passLineZh: "每天？那今晚这趟车，她一定在。",
    teaser: "「检票口开了。Vera 伸出手：票。」"
  },
  {
    setup: "The gate opens. Vera holds out her hand, palm up, patient but official. \"**I bought my ticket yesterday,**\" the little lamp announces proudly. \"**I got it early.** What about you?\"",
    setupZh: "检票口开了。Vera 伸出手，掌心向上，耐心但公事公办。“**我昨天就买票了，**”小灯得意地宣布，“**我买得可早了。**你呢？”",
    passSpeaker: "Vera",
    passLine: "Yesterday? Good. Bought early, travel calm. Go on through.",
    passLineZh: "昨天？好。买得早，走得稳。过去吧。",
    teaser: "「车门开始关了。雨停了，站台的灯一盏盏亮起来。」"
  },
  {
    setup: "The doors begin to close. The rain has stopped; one by one the platform lamps bloom awake. \"**I will come back tomorrow,**\" the little lamp calls after the train. \"**I will wait right here.** And you?\"",
    setupZh: "车门开始关闭。雨停了；站台的灯一盏接一盏醒了过来。“**我明天还会回来，**”小灯朝着列车喊，“**我就在这儿等。**你呢？”",
    passSpeaker: "Vera",
    passLine: "Then this is not goodbye. Platform Seven keeps your bench warm.",
    passLineZh: "那就不是告别。七号站台会替你留着这条长椅。",
    teaser: "「回声城的方向，有人在念你刚才说过的那句话……」（下一世界，P2 解锁）"
  }
];

/** 按关卡 id 取剧情文本（找不到返回 undefined，调用方兜底跳转）。 */
export const getGateStory = (gateId: string): GateStory | undefined => {
  const index = STATION_GATES.findIndex((gate) => gate.id === gateId);
  return index >= 0 ? GATE_STORIES[index] : undefined;
};
