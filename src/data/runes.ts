import type { GrammarRune } from "../types";

/**
 * 语言符文定义（GRAMMAR_ADVENTURE_PLAN §4）。
 * P0 只启用站台世界（S0）的 4 张；其余世界符文先定义 id 位，图鉴按 30 格展示空格。
 * 稀有度：常见 common / 少见 uncommon / 稀有 rare / 传说 legendary。
 */

export const STATION_RUNES: GrammarRune[] = [
  {
    id: "rune-subject-heart",
    topicId: "s0-skeleton",
    stage: "S0",
    worldId: "station",
    name: "主语之心",
    glyph: "heart",
    rarity: "common",
    oneLineRule: "每句英文都有一颗跳动的「谁」——先找到主语，句子才有主人。",
    spells: ["I wait.", "She goes.", "The train leaves."]
  },
  {
    id: "rune-verb-bone",
    topicId: "s0-skeleton",
    stage: "S0",
    worldId: "station",
    name: "谓语之骨",
    glyph: "bone",
    rarity: "common",
    oneLineRule: "主语后面必须站一个动词，少了它，句子就塌了。",
    spells: ["I am here.", "He runs.", "They arrived."]
  },
  {
    id: "rune-be-anchor",
    topicId: "s0-be",
    stage: "S0",
    worldId: "station",
    name: "be 之锚",
    glyph: "anchor",
    rarity: "common",
    oneLineRule: "「我是 / 你在 / 他是」的地基是 am / are / is——它们是句子的锚。",
    spells: ["I am ready.", "You are safe.", "It is late."]
  },
  {
    id: "rune-there-eye",
    topicId: "s0-there",
    stage: "S0",
    worldId: "station",
    name: "there 之眼",
    glyph: "eye",
    rarity: "common",
    oneLineRule: "「有」一只眼睛：There is / There are，先看见它，再说有什么。",
    spells: ["There is a light.", "There are two trains.", "Is there a platform?"]
  }
];

/** 回声城 S2 符文（示例 A 的「过去之痕」属于此世界，P0 提前启用）。 */
export const ECHO_RUNES: GrammarRune[] = [
  {
    id: "rune-past-trace",
    topicId: "s2-past",
    stage: "S2",
    worldId: "echo-city",
    name: "过去之痕",
    glyph: "trace",
    rarity: "uncommon",
    oneLineRule: "发生过的事，动词要留下痕迹：come→came，arrive→arrived。",
    spells: ["I came from Beijing.", "I arrived last night.", "She went home."]
  },
  {
    id: "rune-article-ring",
    topicId: "s1-article",
    stage: "S1",
    worldId: "market",
    name: "冠词之环",
    glyph: "ring",
    rarity: "common",
    oneLineRule: "两个元音相撞会黏住——a 和 apple 之间需要一个 n 当垫片。",
    spells: ["I want an apple.", "It is an hour.", "She has a pear."]
  },
  {
    id: "rune-plural-mirror",
    topicId: "s1-plural",
    stage: "S1",
    worldId: "market",
    name: "单复之镜",
    glyph: "mirror",
    rarity: "common",
    oneLineRule: "一个用原形，两个以上用复数——名词要戴上 -s 的尾巴。",
    spells: ["I want two apples.", "The pears are sweet.", "Two oranges, please."]
  },
  {
    id: "rune-pointer-finger",
    topicId: "s1-demonstrative",
    stage: "S1",
    worldId: "market",
    name: "指示之指",
    glyph: "finger",
    rarity: "common",
    oneLineRule: "指着近处的多个说 these，指着远处的那些说 those。",
    spells: ["These apples are fresh.", "This pear is sweet.", "Those oranges are cheap."]
  },
  {
    id: "rune-quantity-scale",
    topicId: "s1-quantifier",
    stage: "S1",
    worldId: "market",
    name: "量词之衡",
    glyph: "scale",
    rarity: "common",
    oneLineRule: "数得清的问 many，数不清的问 much——钱是数不清的。",
    spells: ["How much is it?", "How many apples?", "How much are these pears?"]
  },
  {
    id: "rune-pronoun-shadow",
    topicId: "s1-pronoun",
    stage: "S1",
    worldId: "market",
    name: "代词之影",
    glyph: "shadow",
    rarity: "common",
    oneLineRule: "在 for、to 这些词后面，she 要换一身衣服变成 her。",
    spells: ["These pears are for her.", "This apple is for him.", "Please give it to me."]
  },
  {
    id: "rune-present-clock",
    topicId: "s2-present-simple",
    stage: "S2",
    worldId: "echo-city",
    name: "现在之钟",
    glyph: "clock",
    rarity: "common",
    oneLineRule: "每天都发生的事，动词用原形——钟每天都这么走。",
    spells: ["I live near the tower.", "The bells ring at six.", "She works in the city."]
  },
  {
    id: "rune-third-sting",
    topicId: "s2-third-person",
    stage: "S2",
    worldId: "echo-city",
    name: "三单之刺",
    glyph: "sting",
    rarity: "common",
    oneLineRule: "他、她、它——后面的动词要带一根小刺：加 s。",
    spells: ["She goes to work.", "The clock keeps time.", "He lives by the gate."]
  },
  {
    id: "rune-agreement-chain",
    topicId: "s2-sv-agreement",
    stage: "S2",
    worldId: "echo-city",
    name: "一致之链",
    glyph: "chain",
    rarity: "rare",
    oneLineRule: "主语和动词要配成对——一个人一条链，一群人一对链。",
    spells: ["My friends live here.", "The bells ring together.", "She goes, they go."]
  },
  {
    id: "rune-ing-wave",
    topicId: "s2-present-cont",
    stage: "S2",
    worldId: "echo-city",
    name: "进行之波",
    glyph: "wave",
    rarity: "common",
    oneLineRule: "正在发生的事，要请 be 来推动：be + 动词-ing。",
    spells: ["The bells are ringing.", "It is raining now.", "I am waiting here."]
  },
  {
    id: "rune-future-gate",
    topicId: "s2-future",
    stage: "S2",
    worldId: "echo-city",
    name: "将来之门",
    glyph: "gate",
    rarity: "uncommon",
    oneLineRule: "还没发生的事，让 will 先开门——will 后面跟动词原形。",
    spells: ["The gate will open soon.", "I will wait for you.", "The bells will ring at six."]
  },
  {
    id: "rune-perfect-bridge",
    topicId: "s2-present-perfect",
    stage: "S2",
    worldId: "echo-city",
    name: "完成之桥",
    glyph: "bridge",
    rarity: "rare",
    oneLineRule: "经历过的事，用 have + 过去分词搭一座桥。",
    spells: ["I have seen the tower.", "She has never left the city.", "We have waited all night."]
  },
  {
    id: "rune-adjective-feather",
    topicId: "s3-adjective",
    stage: "S3",
    worldId: "mountain",
    name: "形容之羽",
    glyph: "feather",
    rarity: "uncommon",
    oneLineRule: "给东西描样的词，要站在它前面：a steep path。",
    spells: ["The path is steep.", "It is a long road.", "The fog is thick."]
  },
  {
    id: "rune-comparison-ruler",
    topicId: "s3-comparison",
    stage: "S3",
    worldId: "mountain",
    name: "比较之尺",
    glyph: "ruler",
    rarity: "uncommon",
    oneLineRule: "两个里比一个，短词加 -er；长词请 more 帮忙。",
    spells: ["This path is steeper.", "The fog is thicker here.", "This road is more dangerous."]
  },
  {
    id: "rune-preposition-knot",
    topicId: "s3-preposition",
    stage: "S3",
    worldId: "mountain",
    name: "介词之结",
    glyph: "knot",
    rarity: "uncommon",
    oneLineRule: "在路上用 on，在城里用 in，在点上用 at——结打对，路才通。",
    spells: ["I am on the path.", "She lives in the village.", "We meet at the gate."]
  },
  {
    id: "rune-order-track",
    topicId: "s3-word-order",
    stage: "S3",
    worldId: "mountain",
    name: "语序之轨",
    glyph: "track",
    rarity: "uncommon",
    oneLineRule: "副词走自己的轨：程度词站在动词前，方式词站在动词后。",
    spells: ["I really like this road.", "She walks slowly.", "We can barely see."]
  },
  {
    id: "rune-conjunction-shuttle",
    topicId: "s4-conjunction",
    stage: "S4",
    worldId: "library",
    name: "连词之梭",
    glyph: "shuttle",
    rarity: "rare",
    oneLineRule: "两句并一句，织布的梭是 and / but / because——但 because 和 so 不能同时上场。",
    spells: ["I stayed home because it rained.", "I was tired, so I slept.", "She reads and writes."]
  },
  {
    id: "rune-infinitive-sprout",
    topicId: "s4-infinitive",
    stage: "S4",
    worldId: "library",
    name: "不定之芽",
    glyph: "sprout",
    rarity: "rare",
    oneLineRule: "想说「要去做」，动词前种一个 to 的芽：I want to read。",
    spells: ["I want to read.", "She decided to stay.", "We hope to see you."]
  },
  {
    id: "rune-gerund-leaf",
    topicId: "s4-gerund",
    stage: "S4",
    worldId: "library",
    name: "动名之叶",
    glyph: "leaf",
    rarity: "rare",
    oneLineRule: "动词戴上 -ing 的叶子，就变成一件「事」：Reading is fun。",
    spells: ["Reading is fun.", "I enjoy walking.", "Thanks for helping me."]
  },
  {
    id: "rune-relative-clasp",
    topicId: "s4-relative",
    stage: "S4",
    worldId: "library",
    name: "定语之扣",
    glyph: "clasp",
    rarity: "rare",
    oneLineRule: "补充说明前面那个东西，用 who（人）或 which（物）扣上去。",
    spells: ["The book which I read is new.", "The man who helps is kind.", "This is the lamp which talks."]
  },
  {
    id: "rune-object-case",
    topicId: "s4-object-clause",
    stage: "S4",
    worldId: "library",
    name: "宾语之匣",
    glyph: "case",
    rarity: "legendary",
    oneLineRule: "想说「我觉得……」，把整个句子装进 that 的匣子里当宾语。",
    spells: ["I think that she is right.", "He said that he was tired.", "I know that you can do it."]
  },
  {
    id: "rune-long-ladder",
    topicId: "s4-long-sentence",
    stage: "S4",
    worldId: "library",
    name: "长句之梯",
    glyph: "ladder",
    rarity: "legendary",
    oneLineRule: "短句一块块搭：连词接起来、从句扣上去，长句是搭出来的，不是背出来的。",
    spells: ["I stayed home because I was tired.", "The book that I read was long.", "She said that she would come."]
  },
  {
    id: "rune-modal-key",
    topicId: "s5-modal",
    stage: "S5",
    worldId: "lighthouse",
    name: "情态之钥",
    glyph: "key",
    rarity: "legendary",
    oneLineRule: "can 是能、should 是应当、must 是必须——钥匙不同，门的分量就不同。",
    spells: ["I can see the light.", "You should rest now.", "We must say goodbye."]
  },
  {
    id: "rune-passive-curtain",
    topicId: "s5-passive",
    stage: "S5",
    worldId: "lighthouse",
    name: "被动之幕",
    glyph: "curtain",
    rarity: "legendary",
    oneLineRule: "谁做的不重要时，做事的人退到后面：be + 过去分词。",
    spells: ["The light was lit last night.", "The door is opened at dawn.", "The city was built by dreamers."]
  },
  {
    id: "rune-conditional-road",
    topicId: "s5-conditional",
    stage: "S5",
    worldId: "lighthouse",
    name: "条件之路",
    glyph: "road",
    rarity: "legendary",
    oneLineRule: "如果的事用 if 铺路：if it rains, we stay——主句用将来，if 里用现在。",
    spells: ["If it rains, we will stay.", "If you come, I will wait.", "If the light goes out, the ships stop."]
  },
  {
    id: "rune-pragmatic-lamp",
    topicId: "s5-pragmatic",
    stage: "S5",
    worldId: "lighthouse",
    name: "语用之灯",
    glyph: "lamp",
    rarity: "legendary",
    oneLineRule: "道别也有地道说法：Take care / See you again / It was nice to meet you。",
    spells: ["Take care of yourself.", "See you again someday.", "It was nice to meet you."]
  }
];

/** 全部已定义符文（P0 可用集合）。 */
export const ALL_RUNES: GrammarRune[] = [...STATION_RUNES, ...ECHO_RUNES];

/** 图鉴按 30 格展示：已定义之外的为空格（名称占位，P1/P2 逐步点亮）。 */
export const RUNE_SLOTS_TOTAL = 30;

export const getRuneById = (runeId: string): GrammarRune | undefined =>
  ALL_RUNES.find((rune) => rune.id === runeId);
