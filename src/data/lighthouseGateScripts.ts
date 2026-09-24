import type { LanguageGate } from "../types";

/**
 * 灯塔世界（S5 特殊与语用）· 终章 6 关（GRAMMAR_ADVENTURE_PLAN §5 第六世界）。
 *
 * 终章叙事：守灯人等一句道别。S5 教学点：情态（can/must/should）、被动入门、
 * if 条件句入门、口语高频句型（语用）。六关一路收束，呼应前五个世界。
 *
 * 世界机制：灯塔的灯光只在完整的、有分量的话里保持明亮——
 * 说错，光就晃；说对，光柱扫过海面，为船照路。
 * 误读支线四拍模板：①「」复读玩家句子 → ②灯光/守灯人的具象反应 → ③话的分量丢在哪 → ④lampHint 点拨。
 *
 * 红线与既往世界一致：「」内引文豁免语法与禁用词检测。
 */

export const LIGHTHOUSE_WORLD_ID = "lighthouse";

/** 灯塔的门按关卡序排列（1–6）。 */
export const LIGHTHOUSE_GATES: LanguageGate[] = [
  // ── G1 · can：能看见 ────────────────────────────────────────────
  {
    id: "lighthouse-gate-1",
    topicId: "s5-modal",
    runeId: "rune-modal-key",
    mode: "say",
    npcLine: "At the foot of the lighthouse, an old keeper studies the dark sea. \"First question of the night—what can you see from here? Tell me about the light.\"",
    npcLineZh: "灯塔脚下，年迈的守灯人望着黑沉沉的海。“今晚第一个问题——从这儿你能看见什么？跟我说说那道光。”",
    zhIntent: "说你能看见那道灯光。",
    canDo: "说清「我能看见那道光」——can 后面用原形",
    requiredPattern: "I can see the light.",
    sampleAnswer: "I can see the light.",
    hints: [
      "I c__ see the light.",
      "「能」用 can——钥匙插进锁里，后面的动词保持原形。",
      "I can see the light."
    ],
    skeleton: { subject: "I", verb: "can see the light（能做什么）", subjectLabel: "谁", verbLabel: "能做什么" },
    counterExample: "I can sees the light.",
    counterNote: "can 后面动词保持原形——钥匙开了门，门里不再加锁",
    acceptRegex: "^i\\s+can\\s+see\\s+the\\s+light[.!]?$",
    misreadBranches: [
      {
        errorTag: "verb_form",
        npcReply: "「I can sees the light」— the beam stutters. The old keeper tilts his head. \"Can sees? Two locks on one door. The light does not know whether you can, or she does.\"",
        npcReplyZh: "「I can sees the light」——光柱抖了一下。守灯人歪了歪头。“Can sees？一扇门上挂两把锁。光分不清是你能看见，还是她能看见。”",
        lampHint: "can 后面用原形：I can see the light。"
      }
    ]
  },

  // ── G2 · must：必须道别 ─────────────────────────────────────────
  {
    id: "lighthouse-gate-2",
    topicId: "s5-modal",
    runeId: "rune-modal-key",
    mode: "complete",
    npcLine: "The keeper climbs the spiral stairs with you. \"A ship leaves at midnight. Finish the thought: we ___ (must) say goodbye soon.\"",
    npcLineZh: "守灯人跟你一起爬旋转楼梯。“半夜有一班船走。把这句补完：we ___ (must) say goodbye soon。”",
    zhIntent: "补全这句话：We ___ (must) say goodbye soon.",
    canDo: "说清「我们必须道别了」",
    requiredPattern: "We must say goodbye soon.",
    sampleAnswer: "We must say goodbye soon.",
    hints: [
      "We m___ say goodbye soon.",
      "「必须」用 must——最重的那把钥匙；后面动词原形。",
      "We must say goodbye soon."
    ],
    skeleton: { subject: "We", verb: "must say goodbye soon（必须做的事）", subjectLabel: "谁", verbLabel: "必须做什么" },
    counterExample: "We must to say goodbye soon.",
    counterNote: "must 后面直接跟原形，不加 to——情态动词自己带门",
    acceptRegex: "^we\\s+must\\s+say\\s+goodbye\\s+soon[.!]?$",
    misreadBranches: [
      {
        errorTag: "verb_form",
        npcReply: "「We must to say goodbye soon」— the keeper pauses on the stair. \"Must to? You have stacked two doors where one is enough.\" The lamp above flickers, unsure which door to open.",
        npcReplyZh: "「We must to say goodbye soon」——守灯人在楼梯上停了停。“Must to？一扇门够用的地方，你砌了两扇。”头顶的灯闪了闪，不知道该开哪扇。",
        lampHint: "must 后面直接跟原形：We must say goodbye soon。"
      }
    ]
  },

  // ── G3 · should：你该歇歇 ────────────────────────────────────────
  {
    id: "lighthouse-gate-3",
    topicId: "s5-modal",
    runeId: "rune-modal-key",
    mode: "say",
    npcLine: "At the top, the keeper pulls up a stool for you. \"You have climbed all night,\" he says. \"What should a tired traveler do? Tell me.\"",
    npcLineZh: "到了塔顶，守灯人给你拉来一张凳子。“你爬了一整夜，”他说，“一个累了的旅人应该做什么？告诉我。”",
    zhIntent: "说你该休息一下。",
    canDo: "说清「我该休息了」——should 的分量",
    requiredPattern: "I should rest.",
    sampleAnswer: "I should rest.",
    hints: [
      "I s______ rest.",
      "「应当」用 should——不重不轻的那把钥匙；后面动词原形。",
      "I should rest."
    ],
    skeleton: { subject: "I", verb: "should rest（应当做什么）", subjectLabel: "谁", verbLabel: "应当做什么" },
    counterExample: "I should rests.",
    counterNote: "should 后面动词原形——钥匙开了门，动词不用再变形",
    acceptRegex: "^i\\s+should\\s+rest[.!]?$|^i\\s+should\\s+take\\s+a\\s+rest[.!]?$",
    misreadBranches: [
      {
        errorTag: "verb_form",
        npcReply: "「I should rests」— the keeper smiles. \"Should rests? You speak like the sea: restless.\" The lamp sways; the word will not sit still on the stair.",
        npcReplyZh: "「I should rests」——守灯人笑了。“Should rests？你说话像海：停不下来。”灯晃了晃——那个词不肯在台阶上坐稳。",
        lampHint: "should 后面用原形：I should rest。"
      }
    ]
  },

  // ── G4 · 被动语态入门：灯是被点亮的 ─────────────────────────────
  {
    id: "lighthouse-gate-4",
    topicId: "s5-passive",
    runeId: "rune-passive-curtain",
    mode: "complete",
    npcLine: "The keeper wipes the great lens with a cloth. \"People ask who lights it, and I say: it is not important. Finish the line the way I do: the lamp ___ (light) every night.\"",
    npcLineZh: "守灯人用布擦拭巨大的透镜。“人们总问是谁点的灯，我说：不重要。按我的方式把这句补完：the lamp ___ (light) every night。”",
    zhIntent: "补全这句话：The lamp ___ (light) every night.（谁点的不重要）",
    canDo: "说清「这盏灯每晚都被点亮」——谁点的不重要",
    requiredPattern: "The lamp is lit every night.",
    sampleAnswer: "The lamp is lit every night.",
    hints: [
      "The lamp is l__ every night.",
      "谁做的不重要，用 be + 过去分词：is + lit。",
      "The lamp is lit every night."
    ],
    skeleton: { subject: "The lamp", verb: "is lit every night（被点亮，谁点的不重要）", subjectLabel: "灯", verbLabel: "被怎么样" },
    counterExample: "The lamp lights every night.",
    counterNote: "灯不是自己亮的——用被动 be + 过去分词：is lit",
    acceptRegex: "^the\\s+lamp\\s+is\\s+(lit|lighted)\\s+every\\s+night[.!]?$",
    misreadBranches: [
      {
        errorTag: "verb_form",
        npcReply: "「The lamp lights every night」— the keeper stops polishing. \"Lights? On its own? Then an old man has nothing to do.\" He steps aside; the lamp waits, unlit, to be lit.",
        npcReplyZh: "「The lamp lights every night」——守灯人停下擦拭。“Lights？它自己亮的？那老头子我就没事干了。”他退到一边；灯等着——被点亮的那种等。",
        lampHint: "谁做的不重要，用被动：The lamp is lit every night。"
      }
    ]
  },

  // ── G5 · if 条件句入门 ──────────────────────────────────────────
  {
    id: "lighthouse-gate-5",
    topicId: "s5-conditional",
    runeId: "rune-conditional-road",
    mode: "say",
    npcLine: "The keeper points at the horizon: gray clouds are rolling in. \"The ships only sail on quiet water. Tell me—what happens if the storm comes?\"",
    npcLineZh: "守灯人指着海平线：灰云正在压过来。“船们只在平静的水面上走。告诉我——如果风暴来了，会怎么样？”",
    zhIntent: "说如果风暴来了，船会停下来。",
    canDo: "说清「如果风暴来了，船就会停下」",
    requiredPattern: "If the storm comes, the ships will stop.",
    sampleAnswer: "If the storm comes, the ships will stop.",
    hints: [
      "If the storm c____, the ships will stop.",
      "if 的路面用现在时铺（comes）；主句用将来（will stop）。",
      "If the storm comes, the ships will stop."
    ],
    skeleton: { subject: "If the storm comes / the ships", verb: "will stop（条件 → 结果）", subjectLabel: "如果 / 船", verbLabel: "条件是什么 / 会怎样" },
    counterExample: "If the storm will come, the ships will stop.",
    counterNote: "if 里不写将来——路面用现在时铺：if the storm comes",
    acceptRegex: "^if\\s+the\\s+storm\\s+(comes|arrives)[,]?\\s+the\\s+ships\\s+will\\s+stop[.!]?$",
    misreadBranches: [
      {
        errorTag: "tense",
        npcReply: "「If the storm will come」— the horizon blurs. The keeper shakes his head slowly. \"Will come? The road laid where the road hasn't reached. You are standing on tomorrow, asking today what happens.\"",
        npcReplyZh: "「If the storm will come」——海平线糊了。守灯人缓缓摇头。“Will come？把路铺在了路还没到的地方。你站在明天，问今天会发生什么。”",
        lampHint: "if 里用现在时：If the storm comes, the ships will stop。"
      }
    ]
  },

  // ── G6 · 语用·道别（终章）────────────────────────────────────────
  {
    id: "lighthouse-gate-6",
    topicId: "s5-pragmatic",
    runeId: "rune-pragmatic-lamp",
    mode: "respond",
    npcLine: "Dawn. The lamp dims itself, its long night's work done. The keeper stands at the door, looking at you the way people look at a journey's end. \"The boat for the mainland leaves in an hour,\" he says. \"Before you go—say it in the words people really use. It was nice to have met me, wasn't it?\"",
    npcLineZh: "黎明。灯自己暗了下来，一夜的活干完了。守灯人站在门口，用看一段旅程尽头的眼神看着你。“去大陆的船一小时后走，”他说，“走之前——用人们真正会说的话。认识我，是件好事，对吧？”",
    zhIntent: "用日常的说法道别：说很高兴认识他。",
    canDo: "用地道的说法道别「很高兴认识你」",
    requiredPattern: "It was nice to meet you.",
    sampleAnswer: "It was nice to meet you.",
    hints: [
      "It was nice to m___ you.",
      "道别的地道说法：It was nice to meet you——meet 用原形，to 的芽在。",
      "It was nice to meet you."
    ],
    skeleton: { subject: "It", verb: "was nice to meet you（道别的固定说法）", subjectLabel: "这段相遇", verbLabel: "是件好事" },
    counterExample: "It was nice to met you.",
    counterNote: "to 后面用原形：to meet——过去的相遇，动词不重复过去",
    acceptRegex: "^it\\s+was\\s+nice\\s+to\\s+meet\\s+you[.!]?$|^nice\\s+to\\s+meet\\s+you[.!]?$",
    misreadBranches: [
      {
        errorTag: "verb_form",
        npcReply: "「It was nice to met you」— the keeper's hand pauses halfway to yours. \"To met? You have put yesterday's coat on a tomorrow's word.\" The light, already low, settles: it has heard worse, and it has heard warmer.",
        npcReplyZh: "「It was nice to met you」——守灯人伸到一半的手停住了。“To met？你把过去式，套在了明天的词上。”灯已经很低了，平静下来：它听过更糟的话，也听过更暖的话。",
        lampHint: "to 后面用原形：It was nice to meet you。"
      }
    ]
  }
];

/** 灯塔每关剧情阶段文本（索引对齐 LIGHTHOUSE_GATES）。 */
export interface LighthouseGateStory {
  setup: string;
  setupZh: string;
  passSpeaker: string;
  passLine: string;
  passLineZh: string;
  teaser: string;
}

export const LIGHTHOUSE_STORIES: LighthouseGateStory[] = [
  {
    setup: "The library's door closes behind you, and the streets end at a dark shore. Across the water, a tower stands with a slow, sweeping light. An old keeper meets you at its foot. \"**You are the one the city keeps talking about,**\" he says. \"**Tonight the lamp needs words with weight in them. First: what can you see from here?**\"",
    setupZh: "图书馆的门在身后合上，街道的尽头是一片暗色的海岸。海对面立着一座塔，一道光缓缓扫过海面。守灯人在塔脚下迎住你。“**你就是城里人一直说的那位，**”他说，“**今晚这盏灯需要『有分量的话』。第一个问题：从这儿你能看见什么？**”",
    passSpeaker: "守灯人",
    passLine: "You can see the light. The beam steadies—an old lamp likes being looked at.",
    passLineZh: "你能看见那道光。光柱稳了稳——老灯喜欢被人看见。",
    teaser: "「守灯人开始爬旋转楼梯，回头等你：『上来吧，今晚有船要出港。』」"
  },
  {
    setup: "Halfway up the spiral stairs, the keeper stops at a small window. Far below, a ship is loading cargo. \"**That one leaves at midnight,**\" he says. \"**Everyone who has ever stood here has said one sentence at this window.** Finish mine: what must we do before it sails?\"",
    setupZh: "旋转楼梯爬到一半，守灯人在一扇小窗前停下。远远的下方，一艘船正在装货。“**那班船半夜走，**”他说，“**每个站在这扇窗前的人，都说过同一句话。**把这句补完：船开之前，我们必须做什么？”",
    passSpeaker: "守灯人",
    passLine: "We must say goodbye soon. The keeper nods slowly—the heaviest key, said lightly.",
    passLineZh: "我们很快就要道别了。守灯人缓缓点头——最重的那把钥匙，被轻轻地说出来。",
    teaser: "「塔顶到了。守灯人拉来一张旧凳子，敲了敲凳面。」"
  },
  {
    setup: "At the top, wind and sea breathe together. The keeper pulls up a worn stool and taps its seat. \"**Take it,**\" he says. \"**You have climbed all night. A tired traveler knows one word better than any other.** Tell me what you should do.\"",
    setupZh: "塔顶，风与海一起呼吸。守灯人拉来一张旧凳子，敲了敲凳面。“**坐，**”他说，“**你爬了一整夜。一个累了的旅人，比谁都更懂一个词。**告诉我，你该做什么。”",
    passSpeaker: "守灯人",
    passLine: "I should rest. You sit; the lamp above you hums, content—it understands tired things.",
    passLineZh: "我该歇歇了。你坐下；头顶的灯嗡嗡作响，很满足——它懂累的感觉。",
    teaser: "「歇够了，守灯人把你引向巨大的透镜：『来看看这盏灯的芯。』」"
  },
  {
    setup: "The great lens is taller than you. The keeper polishes it with the hem of his coat. \"**People on the shore are always asking who lights it,**\" he says. \"**And I tell them: it does not matter who. It matters that it burns every night.** Finish the line the way I say it.\"",
    setupZh: "巨大的透镜比你还高。守灯人用大衣下摆轻轻擦着它。“**岸上的人总在问：谁点的灯？**”他说，“**我说：谁点的不重要。重要的是它每晚都亮。**按我的说法把这句补完。”",
    passSpeaker: "守灯人",
    passLine: "The lamp is lit every night. The keeper smiles at the passive: a sentence that hides the hand, and keeps the light.",
    passLineZh: "这盏灯每晚都被点亮。守灯人对着这句被动态微笑：一句把手藏起来、把光留住的话。",
    teaser: "「海平线上，灰云正在压过来。守灯人眯起眼睛看了一会儿。」"
  },
  {
    setup: "Gray clouds roll in from the horizon. The keeper stands at the railing, counting the ships below. \"**Ships only sail quiet water,**\" he says. \"**The lamp does not stop storms—it tells the truth about them.** Tell me the truth: what happens if the storm comes?\"",
    setupZh: "灰云从海平线压过来。守灯人倚着栏杆数下面的船。“**船只在平静的水面上走，**”他说，“**灯不拦风暴——它只是把风暴说实话。**把实话说给我：如果风暴来了，会怎么样？”",
    passSpeaker: "守灯人",
    passLine: "If the storm comes, the ships will stop. The keeper nods: the road of if is laid—tomorrow answers today, in order.",
    passLineZh: "如果风暴来了，船就会停下。守灯人点头：if 的路铺好了——明天回答今天，规规矩矩。",
    teaser: "「天边泛白。灯一层层暗下去，像退潮。守灯人站到了门口。」"
  },
  {
    setup: "Dawn. The lamp dims itself, its long night's work done. The keeper stands at the door, looking at you the way people look at a journey's end. \"**The boat for the mainland leaves in an hour,**\" he says. \"**Before you go—say it in the words people really use when they part. Not a lesson. A farewell.**\"",
    setupZh: "黎明。灯自己暗了下来，一夜的活干完了。守灯人站在门口，用看一段旅程尽头的眼神看着你。“**去大陆的船一小时后走，**”他说，“**走之前——用人们分别时真正会说的话。不是课文，是道别。**”",
    passSpeaker: "守灯人",
    passLine: "It was nice to meet you. The keeper takes your hand, warm and brief. \"And it was nice to be met,\" he says. The light behind him rises one last time—not for the sea, but for you.",
    passLineZh: "很高兴认识你。守灯人握住你的手，温暖而短暂。“认识你，也是件好事，”他说。他身后的光最后一次亮起——不是为海，是为你。",
    teaser: "「船离岸的时候，你回头：灯塔还亮着。六个世界，五十道门，都在这道光里。」"
  }
];

export const getLighthouseGate = (gateId: string): LanguageGate | undefined =>
  LIGHTHOUSE_GATES.find((gate) => gate.id === gateId);

export const getLighthouseStory = (gateId: string): LighthouseGateStory | undefined => {
  const index = LIGHTHOUSE_GATES.findIndex((gate) => gate.id === gateId);
  return index >= 0 ? LIGHTHOUSE_STORIES[index] : undefined;
};
