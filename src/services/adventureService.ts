import type {
  Adventure,
  AdventureChoice,
  AdventureLevel,
  AdventureNode,
  AdventureNodeSource,
  AdventureTemplate,
  AdventureVocabulary,
  AppData,
  Unit,
  UnitGroup
} from "../types";
import { addOrUpdateWordWithResult } from "./cardService";
import { nowIso, uid } from "./storage";

export interface AdventureTemplateMeta {
  id: AdventureTemplate;
  title: string;
  description: string;
  scene: string;
}

export interface CreateAdventureInput {
  template: AdventureTemplate;
  level: AdventureLevel;
  customPrompt?: string;
  source?: AdventureNodeSource;
  initialNode?: Omit<AdventureNode, "id" | "parentId" | "chapter" | "createdAt" | "selectedChoiceId" | "customAction" | "source">;
  title?: string;
  /** 场景插画 ID（AdventureSceneId），AI/自定义冒险创建时传入，供路线列表与继续阅读卡展示。 */
  scene?: string;
  /** 内置主题库 ID：从随机推荐创建的冒险传入，列表可还原主题专属插画。 */
  themeId?: string;
}

export interface ContinueAdventureInput {
  choiceId?: string;
  customAction?: string;
  source?: AdventureNodeSource;
  node?: Omit<AdventureNode, "id" | "parentId" | "chapter" | "createdAt" | "selectedChoiceId" | "customAction" | "source">;
}

export interface AdventureVocabularySaveResult {
  data: AppData;
  created: number;
  merged: number;
  savedCardIds: string[];
}

export const ADVENTURE_ACCUMULATION_GROUP_TITLE = "冒险积累";
export const ADVENTURE_ACCUMULATION_UNIT_TITLE = "冒险积累";
const ADVENTURE_ACCUMULATION_COLOR = "#177e78";

export interface AdventureFavoriteWordInput {
  word: string;
  translation?: string;
  phonetic?: string;
  partOfSpeech?: string;
  englishDefinition?: string;
  sourceSentence?: string;
  sourceId?: string;
  adventureId?: string;
  nodeId?: string;
}

export interface AdventureFavoriteWordResult {
  data: AppData;
  favorite: boolean;
  cardId?: string;
  created?: boolean;
  merged?: boolean;
}

export const adventureTemplates: AdventureTemplateMeta[] = [
  { id: "campus", title: "校园谜题", description: "找回失落的社团钥匙。", scene: "校园" },
  { id: "city", title: "城市寻信", description: "沿旧信线索穿过街区。", scene: "城市" },
  { id: "travel", title: "海岸列车", description: "赶上开往海边的末班车。", scene: "旅行" },
  { id: "fantasy", title: "雾林灯塔", description: "跟随会说话的灯穿过雾林。", scene: "奇幻" }
];

const templateById = (template: AdventureTemplate) =>
  adventureTemplates.find((item) => item.id === template) ?? (template === "custom"
    ? { id: "custom" as const, title: "自定义冒险", description: "由 AI 从你的方向开始创作。", scene: "自定义" }
    : adventureTemplates[1]);

const offlineStories: Record<Exclude<AdventureTemplate, "custom">, Array<Omit<AdventureNode, "id" | "parentId" | "chapter" | "createdAt" | "selectedChoiceId" | "customAction" | "source">>> = {
  campus: [
    {
      title: "The Quiet Hall",
      englishText: "It is your first afternoon at North Hill School. A small paper bird lands on your desk. It says, \"The music club key is missing. Please help before sunset.\" You follow a faint sound into the quiet main hall. Three doors are open, and a friendly student waits near the stairs.",
      chineseText: "这是你在北山学校的第一个下午。一只小纸鸟落在桌上，说音乐社的钥匙不见了。你循着微弱的声音来到安静的大厅，面前有三扇敞开的门。",
      sentenceTranslations: ["这是你在北山学校的第一个下午。", "一只小纸鸟落在你的桌上。", "它说：\"音乐社的钥匙丢了。请在日落前帮忙。\"", "你循着微弱的声音走进安静的主大厅。", "三扇门敞开着，一位友善的学生在楼梯旁等候。"],
      summary: "A paper bird asks you to find the missing music club key.",
      choices: [
        { id: "library", label: "Go to the library", description: "Follow the quietest path.", promptHint: "Search the library for a clue." },
        { id: "music", label: "Check the music room", description: "Look where the key was last used.", promptHint: "Inspect the music room." },
        { id: "ask", label: "Ask the student", description: "Find out what they noticed.", promptHint: "Talk to the student." }
      ],
      vocabulary: [
        { word: "missing", translation: "丢失的", partOfSpeech: "adjective", sentence: "The music club key is missing." },
        { word: "follow", translation: "跟随", partOfSpeech: "verb", sentence: "You follow a faint sound into the hall." },
        { word: "quiet", translation: "安静的", partOfSpeech: "adjective", sentence: "The main hall is quiet." }
      ]
    },
    {
      title: "A Mark in Blue",
      englishText: "Your choice leads you to a blue mark shaped like a star. The mark appears on an old timetable, then points toward the rooftop garden. On the way, you hear a short melody from above. It sounds like someone is waiting for you.",
      chineseText: "你选择的路线带来一个蓝色星形记号。它出现在旧课表上，并指向屋顶花园。途中，你听到上方传来一段短旋律，像是有人在等你。",
      sentenceTranslations: ["你的选择带你找到一个星形的蓝色记号。", "这个记号出现在一张旧课表上，随后指向屋顶花园。", "路上，你听到上方传来一段短旋律。", "听起来像是有人在等你。"],
      summary: "A blue star clue points to the rooftop garden.",
      choices: [
        { id: "stairs", label: "Take the stairs", description: "Reach the roof quietly.", promptHint: "Take the stairs to the rooftop." },
        { id: "ask_keeper", label: "Find the caretaker", description: "Ask about the melody.", promptHint: "Ask the caretaker about the clue." },
        { id: "read_note", label: "Read the timetable again", description: "Look for another detail.", promptHint: "Study the timetable carefully." }
      ],
      vocabulary: [
        { word: "appear", translation: "出现", partOfSpeech: "verb", sentence: "The mark appears on an old timetable." },
        { word: "toward", translation: "朝向", partOfSpeech: "preposition", sentence: "It points toward the rooftop garden." },
        { word: "melody", translation: "旋律", partOfSpeech: "noun", sentence: "You hear a short melody from above." }
      ]
    },
    {
      title: "The Club Door",
      englishText: "At the rooftop garden, you find the student tuning a small guitar. The key was safe in a flowerpot all along. The student smiles and explains that the paper bird was a club welcome test. Together, you open the music room just before sunset.",
      chineseText: "在屋顶花园，你发现那位学生正在给小吉他调音。钥匙一直安全地放在花盆里。原来纸鸟是音乐社的欢迎测试。你们在日落前一起打开了音乐教室。",
      sentenceTranslations: ["在屋顶花园，你发现那位学生正在给一把小吉他调音。", "钥匙原来一直安全地放在花盆里。", "学生笑着解释，纸鸟是社团的欢迎测试。", "你们一起在日落前打开了音乐教室。"],
      summary: "You find the key and receive a warm welcome from the music club.",
      choices: [
        { id: "restart", label: "Start a new route", description: "Try another choice from this story.", promptHint: "Begin another campus route." },
        { id: "celebrate", label: "Celebrate with the club", description: "Stay for the first song.", promptHint: "Celebrate with the music club." }
      ],
      vocabulary: [
        { word: "safe", translation: "安全的；完好的", partOfSpeech: "adjective", sentence: "The key was safe in a flowerpot." },
        { word: "explain", translation: "解释", partOfSpeech: "verb", sentence: "The student explains the welcome test." },
        { word: "together", translation: "一起", partOfSpeech: "adverb", sentence: "Together, you open the music room." }
      ]
    }
  ],
  city: [
    {
      title: "The Letter at Noon",
      englishText: "At a small city cafe, the owner gives you a letter with no address. On the back, someone wrote: \"Begin where the clocks are loud.\" Outside, the old clock tower rings twelve times. A map on the wall shows three possible streets.",
      chineseText: "在一家城市小咖啡馆，店主交给你一封没有地址的信。背面写着：从钟声最响的地方开始。外面的老钟楼正好敲响十二下。",
      sentenceTranslations: ["在一家小城市咖啡馆里，店主给了你一封没有地址的信。", "信背面有人写着：\"从钟声最响亮的地方开始。\"", "外面的老钟楼敲了十二下。", "墙上的地图显示有三条可能的街道。"],
      summary: "An unaddressed letter sends you toward the clock tower.",
      choices: [
        { id: "market", label: "Walk through the market", description: "Follow the busy street.", promptHint: "Search the market near the tower." },
        { id: "river", label: "Follow the river", description: "Take the quieter route.", promptHint: "Follow the river for a clue." },
        { id: "tower", label: "Enter the tower", description: "Ask the clock keeper directly.", promptHint: "Go inside the clock tower." }
      ],
      vocabulary: [
        { word: "address", translation: "地址", partOfSpeech: "noun", sentence: "The letter has no address." },
        { word: "tower", translation: "塔楼", partOfSpeech: "noun", sentence: "The old clock tower rings twelve times." },
        { word: "possible", translation: "可能的", partOfSpeech: "adjective", sentence: "The map shows three possible streets." }
      ]
    },
    {
      title: "The Red Window",
      englishText: "A red window catches your eye. Behind it is a repair shop full of clocks, radios, and old photographs. The owner recognizes the handwriting on the letter. She gives you a photo of a bridge and says, \"The person you seek always watched the evening lights there.\"",
      chineseText: "一扇红窗吸引了你的注意。窗后是一家修理店，里面摆满钟、收音机和旧照片。店主认出了信上的字迹，并给你一张桥的照片。",
      sentenceTranslations: ["一扇红色的窗户吸引了你的目光。", "窗后是一家修理店，摆满了钟表、收音机和旧照片。", "店主认出了信上的笔迹。", "她给你一张桥的照片，并说：\"你寻找的人总在那里看傍晚的灯光。\""],
      summary: "A repair-shop owner gives you a photo of a bridge.",
      choices: [
        { id: "bridge", label: "Go to the bridge", description: "Follow the photo before dark.", promptHint: "Go to the bridge in the photo." },
        { id: "ask_owner", label: "Ask about the writer", description: "Learn more before leaving.", promptHint: "Ask the shop owner about the letter writer." },
        { id: "inspect_photo", label: "Inspect the photo", description: "Look for a hidden detail.", promptHint: "Study the photograph closely." }
      ],
      vocabulary: [
        { word: "repair", translation: "修理", partOfSpeech: "verb", sentence: "The shop can repair old clocks." },
        { word: "recognize", translation: "认出", partOfSpeech: "verb", sentence: "The owner recognizes the handwriting." },
        { word: "bridge", translation: "桥", partOfSpeech: "noun", sentence: "She gives you a photo of a bridge." }
      ]
    },
    {
      title: "Evening Lights",
      englishText: "At the bridge, you meet an old man with a sketchbook. He wrote the letter for his granddaughter, who moved away years ago. He only wanted to know whether the city still felt kind. You tell him about the cafe, the shop, and every person who helped. He closes the sketchbook with a grateful smile.",
      chineseText: "在桥上，你遇到一位拿着速写本的老人。他写这封信是想知道这座城市是否依然友善。你告诉他咖啡馆、修理店，以及每个帮助过你的人。他感激地合上速写本。",
      sentenceTranslations: ["在桥上，你遇到一位拿着速写本的老人。", "他是为多年前搬走的孙女写这封信的。", "他只想知道这座城市是否依然让人感到友善。", "你告诉他咖啡馆、修理店，以及每一位帮助过你的人。", "他带着感激的微笑合上速写本。"],
      summary: "You show the letter writer that the city is still kind.",
      choices: [
        { id: "restart", label: "Start a new route", description: "Try another city path.", promptHint: "Begin another city route." },
        { id: "draw", label: "Draw the lights", description: "Add your memory to the sketchbook.", promptHint: "Draw the city lights with him." }
      ],
      vocabulary: [
        { word: "granddaughter", translation: "孙女；外孙女", partOfSpeech: "noun", sentence: "He wrote the letter for his granddaughter." },
        { word: "whether", translation: "是否", partOfSpeech: "conjunction", sentence: "He wanted to know whether the city was kind." },
        { word: "grateful", translation: "感激的", partOfSpeech: "adjective", sentence: "He gives you a grateful smile." }
      ]
    }
  ],
  travel: [
    {
      title: "Platform Seven",
      englishText: "Rain begins as you arrive at Platform Seven. A traveler named Mina has lost her ticket and the last coast train leaves in forty minutes. Her bag has a shell, a train map, and a note that says, \"Meet me where the sea begins.\" You decide to help.",
      chineseText: "当你到达七号站台时，下起了雨。一位名叫米娜的旅人丢了车票，而最后一班海岸列车四十分钟后出发。她的包里有贝壳、列车图和一张字条。",
      sentenceTranslations: ["你到达七号站台时，雨开始下了起来。", "一位名叫米娜的旅人丢了车票，而最后一班海岸列车四十分钟后出发。", "她的包里有一个贝壳、一张列车地图和一张纸条，写着：\"在大海开始的地方见我。\"", "你决定帮忙。"],
      summary: "Help Mina find her ticket before the last coast train leaves.",
      choices: [
        { id: "desk", label: "Visit the ticket desk", description: "Ask about a lost ticket.", promptHint: "Talk to the ticket desk staff." },
        { id: "bench", label: "Check the benches", description: "Search where Mina waited.", promptHint: "Look around the station benches." },
        { id: "guard", label: "Ask the station guard", description: "Find the fastest route.", promptHint: "Ask the guard for help." }
      ],
      vocabulary: [
        { word: "platform", translation: "站台", partOfSpeech: "noun", sentence: "You arrive at Platform Seven." },
        { word: "traveler", translation: "旅行者", partOfSpeech: "noun", sentence: "Mina is a traveler." },
        { word: "leave", translation: "离开；出发", partOfSpeech: "verb", sentence: "The last train leaves in forty minutes." }
      ]
    },
    {
      title: "A Helpful Stranger",
      englishText: "Near the station clock, a child is using a ticket as a bookmark. The ticket is Mina's, but the child looks worried. You sit beside him and learn that he cannot find his father in the crowd. Mina suggests making an announcement together. Soon, his father runs over and thanks you both.",
      chineseText: "在车站钟旁，一个孩子正用一张车票当书签。票是米娜的，但孩子看起来很担心。你们得知他在人群中找不到父亲，于是一起广播。很快，他的父亲跑来感谢你们。",
      sentenceTranslations: ["在车站的钟旁，一个孩子正把车票当书签使用。", "车票是米娜的，但孩子看起来很担心。", "你坐在他身边，得知他在人群中找不到父亲。", "米娜提议一起广播。", "很快，他的父亲跑过来，感谢你们两人。"],
      summary: "You recover the ticket while helping a child find his father.",
      choices: [
        { id: "board", label: "Board the train", description: "Catch the train while there is time.", promptHint: "Board the coast train with Mina." },
        { id: "snack", label: "Buy a small snack", description: "Bring something for the ride.", promptHint: "Get a snack before the train." },
        { id: "window", label: "Choose a window seat", description: "Watch for the sea.", promptHint: "Choose a good window seat." }
      ],
      vocabulary: [
        { word: "bookmark", translation: "书签", partOfSpeech: "noun", sentence: "The child uses the ticket as a bookmark." },
        { word: "crowd", translation: "人群", partOfSpeech: "noun", sentence: "He cannot find his father in the crowd." },
        { word: "announcement", translation: "广播；公告", partOfSpeech: "noun", sentence: "You make an announcement together." }
      ]
    },
    {
      title: "Where the Sea Begins",
      englishText: "The train reaches the coast as the clouds open. Mina's grandmother is waiting near the small blue station. Mina gives her the shell from her bag and laughs with relief. Before you leave, she writes your name in her travel notebook: \"The best trips begin with a helpful stranger.\"",
      chineseText: "当云层散开时，列车抵达海岸。米娜的祖母正在蓝色小站旁等候。米娜把贝壳交给她，终于轻松地笑了。临别前，她在旅行本上写下你的名字。",
      sentenceTranslations: ["云层散开时，列车抵达了海岸。", "米娜的祖母正在那座蓝色小站旁等候。", "米娜把包里的贝壳交给祖母，如释重负地笑了。", "离开前，她在旅行笔记本上写下你的名字：\"最棒的旅行始于一位乐于助人的陌生人。\""],
      summary: "Mina reaches the coast and remembers your kindness.",
      choices: [
        { id: "restart", label: "Start a new route", description: "Try another travel decision.", promptHint: "Begin another travel route." },
        { id: "walk_beach", label: "Walk to the beach", description: "See the sea before you go.", promptHint: "Walk to the beach with Mina." }
      ],
      vocabulary: [
        { word: "coast", translation: "海岸", partOfSpeech: "noun", sentence: "The train reaches the coast." },
        { word: "relief", translation: "宽慰", partOfSpeech: "noun", sentence: "Mina laughs with relief." },
        { word: "stranger", translation: "陌生人", partOfSpeech: "noun", sentence: "A helpful stranger changed the trip." }
      ]
    }
  ],
  fantasy: [
    {
      title: "The Lamp in the Mist",
      englishText: "A small golden lamp waits outside your door. When you lift it, a calm voice says, \"The forest path is hidden by mist. I need a careful walker.\" Beyond the village, three trails disappear between tall trees. The lamp glows brighter near one of them.",
      chineseText: "一盏小金灯在门外等着你。当你拿起它，一个平静的声音说：森林小路被雾遮住了，我需要一位细心的行者。村外有三条小径消失在高树间。",
      sentenceTranslations: ["一盏小金灯在你的门外等候。", "当你拿起它，一个平静的声音说：\"森林小路被雾遮住了。我需要一位细心的行者。\"", "村子外，三条小径消失在高大的树木之间。", "小灯在其中一条小径旁发出更明亮的光。"],
      summary: "A talking lamp asks you to find a path through the misty forest.",
      choices: [
        { id: "glow", label: "Follow the glow", description: "Trust the lamp's light.", promptHint: "Follow the lamp into the mist." },
        { id: "village", label: "Ask the village baker", description: "Learn an old forest rule.", promptHint: "Ask the village baker for advice." },
        { id: "listen", label: "Listen to the trees", description: "Wait for a natural sign.", promptHint: "Listen carefully to the forest." }
      ],
      vocabulary: [
        { word: "mist", translation: "薄雾", partOfSpeech: "noun", sentence: "The forest path is hidden by mist." },
        { word: "careful", translation: "小心的", partOfSpeech: "adjective", sentence: "The lamp needs a careful walker." },
        { word: "trail", translation: "小径", partOfSpeech: "noun", sentence: "Three trails disappear between the trees." }
      ]
    },
    {
      title: "The Sleeping Gate",
      englishText: "Deep in the forest, you find a stone gate covered with silver leaves. The lamp tells you that the gate wakes only when someone offers a true memory. You remember a moment when a friend helped you feel brave. The leaves move, and a narrow path opens toward a lighthouse.",
      chineseText: "在森林深处，你找到一扇覆满银叶的石门。灯告诉你，只有献上一段真实的记忆，门才会醒来。你想起朋友曾如何让你感到勇敢。叶子移动，一条小路通向灯塔。",
      sentenceTranslations: ["在森林深处，你发现一扇覆满银叶的石门。", "小灯告诉你，只有当有人献上一段真实的记忆时，这扇门才会苏醒。", "你想起朋友曾帮助你感到勇敢的那一刻。", "银叶移动起来，一条狭窄的小路向灯塔展开。"],
      summary: "A true memory opens the sleeping gate to the lighthouse.",
      choices: [
        { id: "lighthouse", label: "Walk to the lighthouse", description: "Follow the new path.", promptHint: "Walk toward the lighthouse." },
        { id: "ask_lamp", label: "Ask the lamp a question", description: "Learn why the gate was asleep.", promptHint: "Ask the lamp about the gate." },
        { id: "leaf", label: "Keep one silver leaf", description: "Carry a small reminder.", promptHint: "Pick up a silver leaf." }
      ],
      vocabulary: [
        { word: "covered", translation: "覆盖着的", partOfSpeech: "adjective", sentence: "The gate is covered with silver leaves." },
        { word: "memory", translation: "记忆", partOfSpeech: "noun", sentence: "The gate wakes with a true memory." },
        { word: "narrow", translation: "狭窄的", partOfSpeech: "adjective", sentence: "A narrow path opens toward the lighthouse." }
      ]
    },
    {
      title: "The Lighthouse Keeper",
      englishText: "At the lighthouse, an old keeper thanks the lamp for bringing you. The mist was not dangerous; it simply made people forget that they could ask for help. The keeper raises the light, and the forest becomes clear again. The little lamp becomes quiet, but its warm glow remains in your hand.",
      chineseText: "在灯塔里，一位老守灯人感谢小灯带你前来。雾并不危险，它只是让人忘记自己可以求助。守灯人点亮灯塔，森林重新变得清晰。小灯安静下来，温暖的光仍留在你手中。",
      sentenceTranslations: ["在灯塔里，一位年老的守灯人感谢小灯把你带来。", "雾并不危险；它只是让人们忘记自己可以寻求帮助。", "守灯人举起灯光，森林再次变得清晰。", "小灯安静下来，但它温暖的光依然留在你的手中。"],
      summary: "The lighthouse clears the mist and leaves you with a warm light.",
      choices: [
        { id: "restart", label: "Start a new route", description: "Try another forest path.", promptHint: "Begin another fantasy route." },
        { id: "return", label: "Return to the village", description: "Share the light with others.", promptHint: "Return to the village with the lamp." }
      ],
      vocabulary: [
        { word: "dangerous", translation: "危险的", partOfSpeech: "adjective", sentence: "The mist was not dangerous." },
        { word: "remain", translation: "留下；仍然存在", partOfSpeech: "verb", sentence: "Its warm glow remains in your hand." },
        { word: "clear", translation: "清晰的", partOfSpeech: "adjective", sentence: "The forest becomes clear again." }
      ]
    }
  ]
};

const customOfflineContinuation = (parent: AdventureNode): Omit<AdventureNode, "id" | "parentId" | "chapter" | "createdAt" | "selectedChoiceId" | "customAction" | "source"> => ({
  title: `A Quiet Turning Point · ${parent.chapter + 1}`,
  englishText: `After ${parent.title}, the path ahead becomes quiet, but your choice leaves a clear sign. You gather your courage, follow the next clue, and discover that the new world is changing around you.`,
  chineseText: `在“${parent.title}”之后，前方的道路安静下来，但你的选择留下了清晰的线索。你鼓起勇气跟随下一个提示，发现这个新世界正在你身边发生变化。`,
  sentenceTranslations: [`在“${parent.title}”之后，前方的道路安静下来，但你的选择留下了清晰的线索。`, "你鼓起勇气跟随下一个提示，发现这个新世界正在你身边发生变化。"],
  summary: `你沿着“${parent.title}”留下的新线索继续前进。`,
  choices: [
    { id: "observe", label: "Observe the clue", description: "Look more carefully before moving on.", promptHint: "Observe the next clue carefully." },
    { id: "step_forward", label: "Step forward", description: "Trust your instinct and continue.", promptHint: "Step forward and continue the story." }
  ],
  vocabulary: [
    { word: "courage", translation: "勇气", partOfSpeech: "noun", sentence: "You gather your courage." },
    { word: "clue", translation: "线索", partOfSpeech: "noun", sentence: "You follow the next clue." }
  ]
});

const customOfflineOpening: Omit<AdventureNode, "id" | "parentId" | "chapter" | "createdAt" | "selectedChoiceId" | "customAction" | "source"> = {
  title: "A New Beginning",
  englishText: "A new idea begins with a single step. You notice a strange clue nearby and realize that someone may be waiting for your help. The first decision is yours.",
  chineseText: "一个新的想法从第一步开始。你注意到附近有一条奇怪的线索，并意识到或许有人正在等待你的帮助。第一个决定由你来做。",
  sentenceTranslations: ["一个新的想法从第一步开始。", "你注意到附近有一条奇怪的线索，并意识到或许有人正在等待你的帮助。", "第一个决定由你来做。"],
  summary: "A strange clue invites you to begin.",
  choices: [
    { id: "follow", label: "Follow the clue", description: "Take the first step.", promptHint: "Follow the strange clue." },
    { id: "wait", label: "Look around", description: "Learn more before deciding.", promptHint: "Look around for more information." }
  ],
  vocabulary: [
    { word: "single", translation: "单一的；一个的", partOfSpeech: "adjective", sentence: "A new idea begins with a single step." },
    { word: "nearby", translation: "附近", partOfSpeech: "adverb", sentence: "You notice a strange clue nearby." }
  ]
};

const offlineExtensionBeats = [
  {
    title: "A New Lead",
    englishText: (parent: AdventureNode, chapter: number) => `After chapter ${parent.chapter}, you leave ${parent.title} behind and find a brass token beneath a loose stone. Its number matches a door at the far end of the street. You pocket the token and head there before the light fades.`,
    chineseText: (parent: AdventureNode) => `第 ${parent.chapter} 章之后，你离开“${parent.title}”，在一块松动的石头下发现一枚黄铜代币。它的编号与街道尽头的一扇门相同。你收起代币，趁天还没黑就赶往那里。`,
    translations: (parent: AdventureNode) => [`第 ${parent.chapter} 章之后，你离开“${parent.title}”，在一块松动的石头下发现一枚黄铜代币。`, "它的编号与街道尽头的一扇门相同。", "你收起代币，趁天还没黑就赶往那里。"],
    summary: "A numbered token points to a locked door.",
    choices: [{ id: "door", label: "Try the door", description: "See whether the token is a key.", promptHint: "Try the numbered token in the door." }, { id: "trace", label: "Trace the number", description: "Look for the same mark nearby.", promptHint: "Search for another place with the same number." }],
    vocabulary: [{ word: "token", translation: "代币；信物", partOfSpeech: "noun", sentence: "You find a brass token." }, { word: "loose", translation: "松动的", partOfSpeech: "adjective", sentence: "It lies beneath a loose stone." }]
  },
  {
    title: "A Wider Circle",
    englishText: (parent: AdventureNode) => `Inside the new place, a tired messenger recognizes the mark from ${parent.title}. She spreads a hand-drawn map across the table and points to three people who may know the truth. You choose one name and copy the route into your notebook.`,
    chineseText: (parent: AdventureNode) => `在新的地方，一位疲惫的信使认出了“${parent.title}”中的记号。她把一张手绘地图铺在桌上，指向三个可能知道真相的人。你选中一个名字，把路线抄进笔记本。`,
    translations: (parent: AdventureNode) => [`在新的地方，一位疲惫的信使认出了“${parent.title}”中的记号。`, "她把手绘地图铺在桌上，指向三个可能知道真相的人。", "你选中一个名字，把路线抄进笔记本。"],
    summary: "A messenger expands the search to three new people.",
    choices: [{ id: "map", label: "Study the map", description: "Find the safest route.", promptHint: "Study the hand-drawn map for the safest route." }, { id: "messenger", label: "Question the messenger", description: "Learn what she saw.", promptHint: "Question the messenger about the mark." }],
    vocabulary: [{ word: "messenger", translation: "信使", partOfSpeech: "noun", sentence: "A tired messenger recognizes the mark." }, { word: "route", translation: "路线", partOfSpeech: "noun", sentence: "You copy the route into your notebook." }]
  },
  {
    title: "The Hidden Workshop",
    englishText: (parent: AdventureNode) => `The route from ${parent.title} ends at a quiet workshop filled with unfinished machines. A young engineer shows you a device that records sounds from the past. When she turns it on, your earlier clue answers with three clear knocks.`,
    chineseText: (parent: AdventureNode) => `从“${parent.title}”得到的路线把你带到一间安静的工坊，里面摆满未完成的机器。一位年轻工程师向你展示能记录过去声音的装置。她打开装置后，你之前的线索用三声清晰的敲击回应。`,
    translations: (parent: AdventureNode) => [`从“${parent.title}”得到的路线把你带到一间安静的工坊，里面摆满未完成的机器。`, "一位年轻工程师向你展示能记录过去声音的装置。", "她打开装置后，你之前的线索用三声清晰的敲击回应。"],
    summary: "A strange machine reveals a message hidden in sound.",
    choices: [{ id: "record", label: "Replay the recording", description: "Listen for a name.", promptHint: "Replay the recording and listen for a name." }, { id: "machine", label: "Inspect the machine", description: "Find out how it works.", promptHint: "Inspect the sound machine carefully." }],
    vocabulary: [{ word: "workshop", translation: "工坊；车间", partOfSpeech: "noun", sentence: "You enter a quiet workshop." }, { word: "record", translation: "记录；录音", partOfSpeech: "verb", sentence: "The device records sounds from the past." }]
  },
  {
    title: "Before the Storm",
    englishText: (parent: AdventureNode) => `The three knocks lead away from ${parent.title} just as dark clouds gather. A shopkeeper warns that the road will flood by midnight, but she lends you a red lantern and a dry coat. You have one hour to reach the next landmark.`,
    chineseText: (parent: AdventureNode) => `就在乌云聚集时，那三声敲击把你从“${parent.title}”引向远处。店主警告说道路会在午夜前被水淹没，但她借给你一盏红灯笼和一件干外套。你只有一小时抵达下一个地标。`,
    translations: (parent: AdventureNode) => [`就在乌云聚集时，那三声敲击把你从“${parent.title}”引向远处。`, "店主警告说道路会在午夜前被水淹没，但她借给你一盏红灯笼和一件干外套。", "你只有一小时抵达下一个地标。"],
    summary: "A storm creates a clear time limit for the journey.",
    choices: [{ id: "shortcut", label: "Take the shortcut", description: "Move quickly through the old lane.", promptHint: "Take the old lane as a shortcut before the flood." }, { id: "shelter", label: "Find shelter", description: "Wait for a safer moment.", promptHint: "Find shelter and study the clue while it rains." }],
    vocabulary: [{ word: "flood", translation: "洪水；淹没", partOfSpeech: "verb", sentence: "The road will flood by midnight." }, { word: "landmark", translation: "地标", partOfSpeech: "noun", sentence: "Reach the next landmark." }]
  }
];

const createOfflineExtension = (parent: AdventureNode): Omit<AdventureNode, "id" | "parentId" | "chapter" | "createdAt" | "selectedChoiceId" | "customAction" | "source"> => {
  const chapter = parent.chapter + 1;
  const beat = offlineExtensionBeats[(chapter - 4) % offlineExtensionBeats.length];
  return {
    title: `${beat.title} · ${chapter}`,
    englishText: beat.englishText(parent, chapter),
    chineseText: beat.chineseText(parent),
    sentenceTranslations: beat.translations(parent),
    summary: beat.summary,
    choices: beat.choices,
    vocabulary: beat.vocabulary
  };
};

const createNode = (
  chapter: number,
  payload: Omit<AdventureNode, "id" | "parentId" | "chapter" | "createdAt" | "selectedChoiceId" | "customAction" | "source">,
  source: AdventureNodeSource
): AdventureNode => ({
  ...payload,
  id: uid("adventure_node"),
  chapter,
  source,
  createdAt: nowIso()
});

const withPromptTitle = (template: AdventureTemplate, customPrompt: string) => {
  const meta = templateById(template);
  const prompt = customPrompt.trim();
  return prompt ? `${meta.title}：${prompt.slice(0, 24)}` : meta.title;
};

export const createAdventure = (data: AppData, input: CreateAdventureInput): { data: AppData; adventure: Adventure } => {
  const offlineOpening = input.template === "custom" ? customOfflineOpening : offlineStories[input.template][0];
  const root = createNode(1, input.initialNode ?? offlineOpening, input.source ?? "offline");
  const timestamp = nowIso();
  const adventure: Adventure = {
    id: uid("adventure"),
    title: input.title?.trim() || withPromptTitle(input.template, input.customPrompt ?? ""),
    template: input.template,
    ...(input.scene ? { scene: input.scene } : {}),
    ...(input.themeId ? { themeId: input.themeId } : {}),
    level: input.level,
    customPrompt: input.customPrompt?.trim() ?? "",
    createdAt: timestamp,
    updatedAt: timestamp,
    currentNodeId: root.id,
    nodes: [root]
  };

  return { data: { ...data, adventures: [adventure, ...data.adventures] }, adventure };
};

export const getAdventure = (data: AppData, adventureId: string) => data.adventures.find((item) => item.id === adventureId);

export const deleteAdventure = (data: AppData, adventureId: string): AppData => ({
  ...data,
  adventures: data.adventures.filter((adventure) => adventure.id !== adventureId)
});

export const getCurrentAdventureNode = (adventure: Adventure) =>
  adventure.nodes.find((node) => node.id === adventure.currentNodeId) ?? adventure.nodes[adventure.nodes.length - 1];

export const getAdventurePath = (adventure: Adventure, nodeId = adventure.currentNodeId) => {
  const nodes = new Map(adventure.nodes.map((node) => [node.id, node]));
  const path: AdventureNode[] = [];
  const seen = new Set<string>();
  let current = nodes.get(nodeId);

  while (current && !seen.has(current.id)) {
    path.unshift(current);
    seen.add(current.id);
    current = current.parentId ? nodes.get(current.parentId) : undefined;
  }
  return path;
};

export const getOfflineContinuation = (adventure: Adventure, parent: AdventureNode) => {
  if (adventure.template === "custom") return createNode(parent.chapter + 1, customOfflineContinuation(parent), "offline");
  const nextChapter = parent.chapter + 1;
  const story = offlineStories[adventure.template];
  if (nextChapter <= story.length) return createNode(nextChapter, story[nextChapter - 1], "offline");
  return createNode(nextChapter, createOfflineExtension(parent), "offline");
};

export const appendAdventureNode = (
  data: AppData,
  adventureId: string,
  parentId: string,
  input: ContinueAdventureInput
): { data: AppData; node: AdventureNode } => {
  const adventure = getAdventure(data, adventureId);
  if (!adventure) throw new Error("找不到这段冒险。");
  const parent = adventure.nodes.find((node) => node.id === parentId);
  if (!parent) throw new Error("找不到当前章节。");

  const payload = input.node ?? getOfflineContinuation(adventure, parent);
  const node: AdventureNode = {
    ...payload,
    id: uid("adventure_node"),
    parentId: parent.id,
    chapter: parent.chapter + 1,
    source: input.source ?? "offline",
    createdAt: nowIso()
  };
  const timestamp = nowIso();
  const nextAdventure: Adventure = {
    ...adventure,
    updatedAt: timestamp,
    currentNodeId: node.id,
    nodes: [
      ...adventure.nodes.map((item) =>
        item.id === parent.id
          ? { ...item, selectedChoiceId: input.choiceId || undefined, customAction: input.customAction?.trim() || undefined }
          : item
      ),
      node
    ]
  };

  return {
    data: { ...data, adventures: data.adventures.map((item) => (item.id === adventureId ? nextAdventure : item)) },
    node
  };
};

export const selectAdventureNode = (data: AppData, adventureId: string, nodeId: string): AppData => ({
  ...data,
  adventures: data.adventures.map((adventure) =>
    adventure.id === adventureId && adventure.nodes.some((node) => node.id === nodeId)
      ? { ...adventure, currentNodeId: nodeId, updatedAt: nowIso() }
      : adventure
  )
});

/** "我的路线"排序：按最近更新。 */
export const sortAdventuresForList = (adventures: Adventure[]): Adventure[] =>
  adventures.slice().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

export const saveAdventureVocabulary = (
  data: AppData,
  adventureId: string,
  nodeId: string,
  vocabulary: AdventureVocabulary[]
): AdventureVocabularySaveResult => {
  const adventure = getAdventure(data, adventureId);
  if (!adventure) throw new Error("找不到这段冒险。");
  const node = adventure.nodes.find((item) => item.id === nodeId);
  if (!node) throw new Error("找不到当前章节。");

  const selected = vocabulary.filter((item) => item.word.trim() && !item.cardId);
  let nextData = data;
  let created = 0;
  let merged = 0;
  const cardByWord = new Map<string, string>();

  selected.forEach((item) => {
    const saved = addOrUpdateWordWithResult(nextData, {
      word: item.word,
      translation: item.translation,
      phonetic: "",
      partOfSpeech: item.partOfSpeech,
      englishDefinition: "",
      collocations: "",
      sourceSentence: item.sentence || node.englishText,
      sourceId: `adventure:${adventureId}:${nodeId}`,
      unitId: "",
      note: `来自冒险：${adventure.title}`,
      tags: `冒险 ${adventure.title}`
    });
    nextData = saved.data;
    cardByWord.set(item.word.trim().toLowerCase(), saved.cardId);
    if (saved.status === "created") created += 1;
    else merged += 1;
  });

  const nextAdventure = getAdventure(nextData, adventureId);
  if (!nextAdventure) throw new Error("冒险存档更新失败。");
  const updatedAdventure: Adventure = {
    ...nextAdventure,
    updatedAt: nowIso(),
    nodes: nextAdventure.nodes.map((item) =>
      item.id === nodeId
        ? {
            ...item,
            vocabulary: item.vocabulary.map((word) => ({
              ...word,
              cardId: word.cardId || cardByWord.get(word.word.trim().toLowerCase())
            }))
          }
        : item
    )
  };

  return {
    data: { ...nextData, adventures: nextData.adventures.map((item) => (item.id === adventureId ? updatedAdventure : item)) },
    created,
    merged,
    savedCardIds: Array.from(cardByWord.values())
  };
};

const getAdventureAccumulationShelf = (data: AppData) => {
  const existingUnit = getAdventureAccumulationUnit(data);
  const existingGroup = existingUnit
    ? data.unitGroups.find((group) => group.id === existingUnit.groupId)
    : data.unitGroups.find((group) => group.title.trim() === ADVENTURE_ACCUMULATION_GROUP_TITLE);
  let nextData = data;
  let group: UnitGroup;
  if (existingGroup) {
    group = existingGroup;
  } else {
    const timestamp = nowIso();
    group = {
      id: uid("unit_group"),
      title: ADVENTURE_ACCUMULATION_GROUP_TITLE,
      color: ADVENTURE_ACCUMULATION_COLOR,
      order: nextData.unitGroups.reduce((max, item) => Math.max(max, item.order), 0) + 1,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    nextData = { ...nextData, unitGroups: [...nextData.unitGroups, group] };
  }

  const existingShelfUnit = nextData.units.find((unit) => unit.groupId === group.id && unit.title.trim() === ADVENTURE_ACCUMULATION_UNIT_TITLE);
  if (existingShelfUnit) return { data: nextData, group, unit: existingShelfUnit };

  const timestamp = nowIso();
  const unit: Unit = {
    id: uid("unit"),
    title: ADVENTURE_ACCUMULATION_UNIT_TITLE,
    description: "在冒险阅读中收藏的单词",
    order: nextData.units.reduce((max, item) => Math.max(max, item.order), 0) + 1,
    color: group.color,
    groupId: group.id,
    createdAt: timestamp,
    updatedAt: timestamp
  };
  return { data: { ...nextData, units: [...nextData.units, unit] }, group, unit };
};

export const getAdventureAccumulationUnit = (data: AppData) => {
  const groupIds = new Set(
    data.unitGroups
      .filter((group) => group.title.trim() === ADVENTURE_ACCUMULATION_GROUP_TITLE)
      .map((group) => group.id)
  );
  const candidates = data.units
    .filter((unit) => unit.title.trim() === ADVENTURE_ACCUMULATION_UNIT_TITLE && unit.groupId && groupIds.has(unit.groupId))
    .sort((a, b) => {
      const aCount = data.cards.filter((card) => card.unitId === a.id).length;
      const bCount = data.cards.filter((card) => card.unitId === b.id).length;
      return bCount - aCount || a.order - b.order;
    });
  return candidates[0];
};

export const getAdventureFavoriteWords = (data: AppData) => {
  const unit = getAdventureAccumulationUnit(data);
  if (!unit) return [];
  return data.cards
    .filter((card) => card.type === "word" && card.unitId === unit.id)
    .map((card) => card.front.trim().toLowerCase())
    .filter(Boolean);
};

export const isAdventureFavoriteWord = (data: AppData, word: string) => {
  const normalized = word.trim().toLowerCase();
  return getAdventureFavoriteWords(data).includes(normalized);
};

export const toggleAdventureFavoriteWord = (
  data: AppData,
  input: AdventureFavoriteWordInput
): AdventureFavoriteWordResult => {
  const normalized = input.word.trim().toLowerCase();
  if (!normalized) return { data, favorite: false };
  const existingDetails = data.wordDetails.find((details) => details.word.trim().toLowerCase() === normalized);
  const existingCard = existingDetails ? data.cards.find((card) => card.id === existingDetails.cardId) : data.cards.find((card) => card.front.trim().toLowerCase() === normalized);
  const existingUnit = getAdventureAccumulationUnit(data);
  if (existingCard && existingUnit && existingCard.unitId === existingUnit.id) {
    const timestamp = nowIso();
    return {
      data: {
        ...data,
        cards: data.cards.map((card) => card.id === existingCard.id ? { ...card, unitId: undefined, updatedAt: timestamp } : card)
      },
      favorite: false,
      cardId: existingCard.id
    };
  }
  const shelf = getAdventureAccumulationShelf(data);
  let nextData = shelf.data;

  let cardId = existingCard?.id;
  let created = false;
  let merged = false;
  if (!existingCard) {
    const saved = addOrUpdateWordWithResult(nextData, {
      word: normalized,
      translation: input.translation ?? "",
      phonetic: input.phonetic ?? "",
      partOfSpeech: input.partOfSpeech ?? "",
      englishDefinition: input.englishDefinition ?? "",
      collocations: "",
      sourceSentence: input.sourceSentence ?? "",
      sourceId: input.sourceId,
      unitId: shelf.unit.id,
      note: input.adventureId ? `来自冒险：${input.adventureId}` : "来自冒险阅读",
      tags: "冒险 冒险积累"
    });
    nextData = saved.data;
    cardId = saved.cardId;
    created = saved.status === "created";
    merged = saved.status === "merged";
  } else {
    const timestamp = nowIso();
    nextData = {
      ...nextData,
      cards: nextData.cards.map((card) => card.id === existingCard.id
        ? { ...card, unitId: shelf.unit.id, tags: Array.from(new Set([...card.tags, "冒险积累"])), updatedAt: timestamp }
        : card)
    };
  }

  return { data: nextData, favorite: true, cardId, created, merged };
};
