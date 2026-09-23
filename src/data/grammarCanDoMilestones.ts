/**
 * can-do 能力里程碑数据（从 GrammarPathPage 抽出，2026-09-23）。
 *
 * 为什么单独成文件：React Fast Refresh 要求页面文件**只导出组件**——
 * 页面里带非组件 export 会让整文件 HMR 失效（开发时改动不热更新，
 * 用户曾因此看到过期代码）。与 parseContrastParagraph 同一处理。
 */

export interface CanDoMilestone {
  id: string;
  afterLesson: number;
  title: string;
  zh: string;
  samples: string[];
}

/** R07：can-do 锚点与 24 课对齐——12（第一季收口）/ 18（进阶过半）/ 24（全剧终）。 */
export const CAN_DO_MILESTONES: CanDoMilestone[] = [
  {
    id: "can-do-m1",
    afterLesson: 12,
    title: "我能把昨天和明天都说清楚",
    zh: "从现在到过去再到打算——第一季收官，你的句子已经能办日常的正事了。",
    samples: ["I went to the park yesterday.", "I will call my mom tonight.", "I like reading because it is fun."]
  },
  {
    id: "can-do-m2",
    afterLesson: 18,
    title: "我能说出我想要什么、我必须做什么",
    zh: "点餐、请假、开口求助——进阶过半，情态和比较让你的句子更灵活。",
    samples: ["Can I have a milk tea?", "I want to travel.", "This one is better than that one."]
  },
  {
    id: "can-do-m3",
    afterLesson: 24,
    title: "我能讲清楚已经发生和刚刚发生的事",
    zh: "完成时把「经历」和「影响」说清了——这就是进阶篇的收口。",
    samples: ["I have finished my homework.", "I have been to Beijing.", "I have lost my key."]
  },
  {
    id: "can-do-m4",
    afterLesson: 27,
    title: "我能说清楚他和她每天做什么",
    zh: "「他/她/它」后面的 -s、有没有、问什么——最顽固的小毛病全拿下，你的日常表达已经又稳又准。",
    samples: ["He drinks milk every day.", "There is a book on the desk.", "Where is my key?"]
  },
  {
    id: "can-do-m5",
    afterLesson: 34,
    title: "我能把时间和数量都说利索",
    zh: "频率、打算、数量、最、命令、远近、过去进行——巩固篇全通关，日常对话里你几乎不会再卡壳。",
    samples: ["I am going to watch a movie this weekend.", "How many books do you have?", "I was drawing at three."]
  },
  {
    id: "can-do-m6",
    afterLesson: 41,
    title: "我能一句话说两件事",
    zh: "话中话（我知道他在哪）+ 挂尾巴（戴眼镜的男生）——第四季收官，你的句子能装下别人的话和事物的样子了。",
    samples: ["I know where he is.", "The boy who wears glasses is my brother.", "This is the book which I read."]
  },
  {
    id: "can-do-m7",
    afterLesson: 46,
    title: "我能说清喜欢做的事和想做的事",
    zh: "名词形式（like/enjoy + reading）+ 小垫板（want to travel）——动词后面跟什么，你已经有手感了。",
    samples: ["I like reading.", "I enjoy reading.", "I want to travel."]
  },
  {
    id: "can-do-m8",
    afterLesson: 49,
    title: "我能给人建议、说条件",
    zh: "三兄弟（能/必须/应该）+ 条件句（如果下雨就…）——给建议、说打算，日常对话里的语用工具齐了。",
    samples: ["You should sleep early.", "If it rains, I will stay at home.", "You should take an umbrella if it rains."]
  },
  {
    id: "can-do-m9",
    afterLesson: 54,
    title: "我能让事当主角",
    zh: "幕后句（谁做的不重要）+ by（想说谁就垫）+ has been（已经做过了）——谁重要谁上台，你的句子能挑焦点了。",
    samples: ["My cup was broken.", "The cake was eaten by my brother.", "The window has been cleaned."]
  },
  {
    id: "can-do-m10",
    afterLesson: 60,
    title: "我能说清日期和日常细节",
    zh: "日期链（第几个、哪个月、几月几号）+ 做事的样子（跑得快、唱得好）+ 回忆昨天（那天有…）——日常里的小事，你能说利索了。",
    samples: ["My birthday is in May.", "She runs quickly.", "There was a bird in the park."]
  },
  {
    id: "can-do-m11",
    afterLesson: 66,
    title: "我能客气地请人帮忙、说清一样和太过",
    zh: "客气请求（Could you…?）+ 给东西（先给谁、后给什么）+ 一样与太过（as…as / too…to）——话说得体面，也说得精确。",
    samples: ["Could you help me?", "He is as tall as me.", "It is too heavy to carry."]
  },
  {
    id: "can-do-m12",
    afterLesson: 71,
    title: "我能说清擅长的、买给谁的、够不够",
    zh: "擅长（good at）+ 买给你（for 家族）+ 婉转请（Would you mind）+ 招待（Would you like）+ 够（enough）——本领说得出口，心意送得到位。",
    samples: ["I am good at drawing.", "I bought a gift for my mom.", "The bag is light enough to carry."]
  },
  {
    id: "can-do-m13",
    afterLesson: 75,
    title: "我能问频率、问时长、搭把手、约起来",
    zh: "多久一次（How often）+ 要花多久（How long）+ 让我来帮（Let me）+ 咱们去吧（Let's）——问得清楚，约得起来。",
    samples: ["How often do you run?", "It takes ten minutes.", "Let's go to the park."]
  },
  {
    id: "can-do-m14",
    afterLesson: 78,
    title: "我能给「更」加力、说清一直在做的事",
    zh: "好多了（much + 更）+ 一直在做（keep + 名词形式）+ 把一天串成一条线（跨季大团圆）——说得更有劲，也说得更连贯。",
    samples: ["I feel much better today.", "I keep doing my homework.", "I run every day, and I keep reading."]
  },
  {
    id: "can-do-m15",
    afterLesson: 86,
    title: "我能把身边的东西说清楚",
    zh: "东西在哪（next to／前后／中间）+ 怎么放（put）+ 说不清是什么（something／nothing）+ 这是谁的（whose）——指哪儿说哪儿，一件件都说明白。",
    samples: ["My desk is next to the window.", "I put my bag next to the door.", "Whose bag is this? It is next to the door."]
  },
  {
    id: "can-do-m16",
    afterLesson: 94,
    title: "我能和人聊两句，也能说说从前的事",
    zh: "说天气（It's cold／windy）+ 感叹（What a…!）+ 说先后（after／before／when）+ 说从前（used to）——校门口聊两句，话越说越长。",
    samples: ["It's cold today.", "After I do my homework, I watch TV.", "I used to play here."]
  },
  {
    id: "can-do-m17",
    afterLesson: 102,
    title: "我能把昨天的事讲成一段故事",
    zh: "那时正做着（was reading）+ 被什么打断（when／the phone rang）+ 两件同时在（while）+ 从前的习惯（used to）——昨天那个电话，你能从头讲到尾。",
    samples: ["I was reading at eight.", "When you called, I was reading.", "I was reading when the phone rang."]
  },
  {
    id: "can-do-m18",
    afterLesson: 110,
    title: "我能说清谁让谁做什么",
    zh: "推着做（makes）+ 放开做（lets）+ 分内的事（had）+ 费口舌请动（got to）+ 等到…为止（until）——家里和学校谁让谁做什么，四句话排一行。",
    samples: ["My mom makes me do my homework.", "She lets him play after dinner.", "I got him to go with me."]
  },
  {
    id: "can-do-m19",
    afterLesson: 118,
    title: "我能说清身边的人和东西",
    zh: "谁的（人后面加撇号 s）+ 我的（句尾用长版）+ 我的感受（感到版）+ 还有几个（a few）+ 有（have got／has got）——身边的事，一句话说清一件。",
    samples: ["Grandma's birthday is in May.", "This book is mine.", "I am bored."]
  },
  {
    id: "can-do-m20",
    afterLesson: 124,
    title: "我能说清「习惯了」",
    zh: "从前常（used to）+ 习惯了（be used to）+ 慢慢习惯（get used to）+ 不习惯怎么说——同一个 to，前面有 be 是一张脸，没 be 是另一张。",
    samples: ["I used to walk to school.", "I am used to the cold.", "I am getting used to it."]
  },
  {
    id: "can-do-m21",
    afterLesson: 127,
    title: "我能说出看到的东西是什么样",
    zh: "看着怎么样（It looks nice）+ 换人换形（You look tired／She looks tired）+ 同一个 look 两张脸（喊人看 vs 说样子）——看到什么就说什么。",
    samples: ["It looks nice.", "You look tired.", "The sky looks dark."]
  },
  {
    id: "can-do-m22",
    afterLesson: 133,
    title: "我能说出听到、闻到、尝到、摸到的是什么样",
    zh: "看（looks）+ 听（sounds）+ 闻（smells）+ 尝（tastes）+ 摸（feels）——五张脸一个架子，后面直接跟那个「怎么样」的词。",
    samples: ["It sounds great.", "It smells good.", "The water feels cold."]
  },
  {
    id: "can-do-m23",
    afterLesson: 138,
    title: "我能说出我盼着什么",
    zh: "盼着（look forward to）+ 换人换形（She looks forward to）+ 盼着做某事（forward to doing）+ 盼着吗（Are you looking forward to…）——同一个 to，后面跟的那件事。",
    samples: ["I am looking forward to the weekend.", "She looks forward to the summer.", "I am looking forward to seeing you."]
  },
  {
    id: "can-do-m24",
    afterLesson: 141,
    title: "我能说「虽然…」",
    zh: "虽然（Although 站最前面领一整句）+ 可是（but 站中间接两半）+ 只留一个——中文成对说，英语只留一个。",
    samples: ["Although it is raining, I will go out.", "It is raining, but I will go out.", "Although it was cold, we went out."]
  },
  {
    id: "can-do-m25",
    afterLesson: 144,
    title: "我能说「一到…就…」",
    zh: "一到就做（As soon as 站最前面领一整句）+ 前面说现在、后面说将来（第 48 课教过的同一条规矩）+ 两个刻度（when 是那段时间里，as soon as 是一到就）。",
    samples: ["As soon as I finish, I will eat.", "When I finish, I will eat.", "As soon as I get home, I will call you."]
  },
  {
    id: "can-do-m26",
    afterLesson: 147,
    title: "我能说「我也不」",
    zh: "我也一样（too 站句尾）+ 我也不（有「不」换 either）+ 都站句尾——同一个「也」，中文一个字，英语两张脸。",
    samples: ["I like tea too.", "I don't like coffee either.", "Drawing is fun too."]
  },
  {
    id: "can-do-m27",
    afterLesson: 150,
    title: "我能说「两个都」和「两个都不」",
    zh: "两个都（both 站最前面）+ 两个都不（有「不」换 neither）+ 后面那个东西带上 s、搭档用 are——同一个「两个」，两张脸。",
    samples: ["Both books are good.", "Neither book is good.", "Are both books good?"]
  },
  {
    id: "can-do-m28",
    afterLesson: 152,
    title: "我能说「全都」和「每一个」",
    zh: "全都（all 站最前面，后面可以站 the）+ 一个一个来（every 后面只说一个）+ 好多个带上 s 用 are／单个用 is——中文一个「都」字，看你从哪头数。",
    samples: ["All the books are good.", "Every student is here.", "All my books are new."]
  },
  {
    id: "can-do-m29",
    afterLesson: 154,
    title: "我能说「还没」「已经」「还在」",
    zh: "还没（yet 站句尾）+ 已经（already 站中间）+ 还在（still 站中间，紧挨着 is／have）——中文一个「还」，英语按「没发生」还是「一直在」分两个词。",
    samples: ["She hasn't come yet.", "I have already eaten.", "She is still waiting."]
  },
  {
    id: "can-do-m30",
    afterLesson: 156,
    title: "我能说「多久以前」和「持续多久」",
    zh: "多久以前（数字＋时间词＋ago 站句尾，动词穿昨天版）+ 持续多久（for 接在那块时间前面）+ 数着说的词带上 s——往回数、数时长，两条路。",
    samples: ["She left three days ago.", "I waited for an hour.", "She left two hours ago."]
  },
  {
    id: "can-do-m31",
    afterLesson: 158,
    title: "我能说「一个都不」",
    zh: "一个都不（说东西：None of the cups are mine——none 后面拴 of）+ 一个人都没有（说人：Nobody is at home——人装在词里，搭档用 is）+ 都自带「不」，后面不再请 not。",
    samples: ["None of the cups are mine.", "Nobody is at home.", "None of them are here."]
  },
  {
    id: "can-do-m32",
    afterLesson: 160,
    title: "我能说「像什么」和「好像」",
    zh: "看起来像（look 后面请 like 出场：It looks like a boat）+ 好像（seem 后面请 to 垫一下：He seems to know you）+ to 后面那个动作穿原样。",
    samples: ["It looks like a boat.", "He seems to know you.", "She seems to like the boat."]
  },
  {
    id: "can-do-m33",
    afterLesson: 162,
    title: "我能说「需要」和「大多数」",
    zh: "需要（need 后面请 to 垫一下：I need to buy some milk）+ 大多数（most 后面拴 of：Most of the students like it）+ to 后面穿原样、一群人配原样动词。",
    samples: ["I need to buy some milk.", "Most of the students like it.", "I need to go home now."]
  },
  {
    id: "can-do-m34",
    afterLesson: 185,
    title: "我能说这一章的五对说法",
    zh: "自己来（myself／himself）+ 互相（each other）+ 太多（too many／too much）+ 很多（a lot of）+ 建议（Why don't you）+ 缩写（I'd like）+ 既…又…／既不…也不… + 除非／为了 + 能够／我也是 + 宁愿／更喜欢 + 更早的事／征求同意 + 整个／最好…——成对学，一对一对说得出。",
    samples: ["I finished the whole book.", "We had better go now.", "I got up early in order to catch the bus."]
  },
  {
    id: "can-do-m35",
    afterLesson: 187,
    title: "我能说「是为了」和「只要」",
    zh: "是为了让谁做什么（so that 后面带「谁 + 能做什么」：I came early so that you can rest）+ 只要你（as long as 两个 as 各卡一头：I will go as long as you come）——换人用 so that，给底线用 as long as。",
    samples: ["I came early so that you can rest.", "I will go as long as you come.", "You can go as long as you finish."]
  },
  {
    id: "can-do-m36",
    afterLesson: 188,
    title: "我能说「昨天不得不」",
    zh: "昨天不得不（must 只管现在，过去的事用 had to：I had to walk home yesterday）+ had to 后面穿原样——同一句「不得不」，时间不同说法不同。",
    samples: ["I had to walk home yesterday.", "She had to cook dinner last night.", "I must finish my homework today."]
  },
  {
    id: "can-do-m37",
    afterLesson: 189,
    title: "我能说「他们的」",
    zh: "他们的（their 贴在东西前面，不带 s：These are their books）+ 自己站的那个带 s（theirs：These books are theirs）——第 8 课那批小标签，今天补上缺的一个。",
    samples: ["These are their books.", "These books are theirs.", "Their classroom is on the second floor."]
  },
  {
    id: "can-do-m38",
    afterLesson: 190,
    title: "我能说「我正在学做某事」",
    zh: "正在学做（前面穿 -ing、后面垫 to：I am learning to swim）+ 两层拼起来（be 加 -ing 是第 13 课的，垫板 to 是第 15 课那家的）——会了和学着，差着呢。",
    samples: ["I am learning to swim.", "She is learning to draw.", "I am swimming."]
  },
  {
    id: "can-do-m39",
    afterLesson: 192,
    title: "我能说「走进、穿过、横过」",
    zh: "走进里面用 into（She walked into the kitchen，比 in 多一层「从外面动到里面」）+ 中间钻过去用 through、一头到另一头用 across（We walked through the forest and across the bridge）——两个词中文都能翻成「穿过」，画面却不同。",
    samples: ["She walked into the kitchen.", "We walked through the forest.", "We walked across the bridge."]
  },
  {
    id: "can-do-m40",
    afterLesson: 193,
    title: "我能说「太…了，所以…」",
    zh: "太…了所以（so 和 that 一头一尾：The wind was so strong that the window broke）+ 分清 so 的三张脸——「所以」（第 20 课，站自己一句开头）／「是为了」（第 186 课，so that 连着写）／「太…了所以」（今天，中间隔着「有多…」那一小截）。",
    samples: ["The wind was so strong that the window broke.", "He was so tired that he fell asleep.", "I was hungry, so I ate noodles."]
  },
  {
    id: "can-do-m41",
    afterLesson: 194,
    title: "我能说「这么…的一个」",
    zh: "这么…的一个（a 紧跟 such，再跟「东西」：It was such a big fish）+ 分清「这么」的两条路——跟「有多…」那个词用 so（so strong，第 193 课）／跟「东西」用 such a（such a big fish，今天）。",
    samples: ["It was such a big fish.", "She is such a kind teacher.", "The wind was so strong that the window broke."]
  },
  {
    id: "can-do-m42",
    afterLesson: 195,
    title: "我能说「它的」",
    zh: "它的（its 不带小撇，跟 my／her 站同一个位置，贴在东西前面：The cat is in its box）+ 分清同一个音的两张脸——带撇的 It's 是「它是」（第 87 课）／不带撇的 its 是「它的」（今天）。判断只看一件事：能不能换成 it is。",
    samples: ["The cat is in its box.", "Its box is small.", "It's cold today."]
  },
  {
    id: "can-do-m43",
    afterLesson: 196,
    title: "我能说「在一堆东西中间」",
    zh: "混在一群里用 among（不点名，只说在这群里的中间：The cat is among the boxes）+ 分清和 between 的分工——两个、两头点名用 between（第 81 课：between Tom and Amy）／说不清哪几个、是一群，用 among。判断只看一件事：这几个东西你能一个个叫出来吗？",
    samples: ["The cat is among the boxes.", "She is among her friends.", "I sit between Tom and Amy."]
  },
  {
    id: "can-do-m44",
    afterLesson: 197,
    title: "我能说「有些词的昨天版要单独记」",
    zh: "老朋友自己的昨天版（think 的昨天版是 thought、know 的是 knew——不加 -ed，要一个个记）+ 说「不」和问句里它们反而变回原样（I didn't think about it）。这一批还有 went／ate／saw／bought（第 10 课）。",
    samples: ["I thought about it and knew the answer.", "She thought about it.", "I went to the park yesterday."]
  },
  {
    id: "can-do-m45",
    afterLesson: 198,
    title: "我能说「游过泳、唱过歌」",
    zh: "换零件的昨天版（swim 变 swam、sing 变 sang——里面的 i 换成 a，不加 -ed：We swam in the water and sang together）+ 说「不」和问句里它们穿回原样（didn't swim）。",
    samples: ["We swam in the water and sang together.", "We swam in the water.", "She sang a song."]
  },
  {
    id: "can-do-m46",
    afterLesson: 199,
    title: "我能说「坐旁边、赶上了」",
    zh: "两种换法（sit 变 sat 是换里面的元音；catch 变 caught 是整个换成 -aught、那个 gh 不发音：I sat next to her and caught the bus）+ 这批老朋友说「不」和问句里都穿回原样。",
    samples: ["I sat next to her and caught the bus.", "I caught the bus.", "I didn't catch the bus."]
  },
  {
    id: "can-do-m47",
    afterLesson: 200,
    title: "我能说「觉得冷、一直读着」",
    zh: "一对换法一样的昨天版（feel 变 felt、keep 变 kept——中间两个 e 只剩一个、尾巴加个 t：I felt cold, but I kept reading）+ 说「不」和问句里它们穿回原样（didn't feel）。这一批还有第 198 课的 swam／sang、第 199 课的 sat／caught。",
    samples: ["I felt cold in the snow, but I kept reading.", "I felt cold.", "I kept reading."]
  },
  {
    id: "can-do-m48",
    afterLesson: 201,
    title: "我能说「昨晚睡得好」",
    zh: "sleep 的昨天版是 slept（跟第 200 课的 kept／felt 一个换法：两个 e 只剩一个、加个 t）+ 分清「睡了一整觉」和「正做着」——说「做完了这件事」用 slept，说「（那阵子）正睡着」穿 -ing（was sleeping，第 98 课）。同一个形式，地方不一样，对错不一样。",
    samples: ["I slept well last night.", "He was sleeping at eight.", "I slept well last night, so I felt great this morning."]
  },
  {
    id: "can-do-m49",
    afterLesson: 202,
    title: "我能说「画了张画」",
    zh: "draw 的昨天版是 drew（aw 换成 ew）+ 分清「前面是 will 还是说昨天的事」——will 后面穿原样（will draw，第 12 课）；说昨天做的用 drew。顺便记 put 三态同形（第 82 课），昨天版还是 put。",
    samples: ["I drew a picture of the boat and put it on the wall.", "She drew a cat.", "I will draw tomorrow."]
  },
  {
    id: "can-do-m50",
    afterLesson: 203,
    title: "我能说「昨天戴了新帽子」",
    zh: "wear 的昨天版是 wore（不加 -ed：I wore my new hat yesterday）+ 分清 wear 家的三个形状——穿原样（to／don't 后面：want to wear）／「他/她」一个多一个小 s（wears，第 39 课）／说昨天用它自己的样子（wore）。",
    samples: ["I wore my new hat yesterday.", "The boy who wears glasses is my brother.", "I want to wear it again today."]
  },
  {
    id: "can-do-m51",
    afterLesson: 204,
    title: "我能说「我给了她」",
    zh: "give 的昨天版是 gave（不加 -ed：I gave her the book）+ 第 63 课的位置规矩照样管用——先给谁、后给什么（gave her the book）；东西换成小词 it 才垫 to（give it to me）。昨天说、今天说，站位一动不动，只有动词换样子。",
    samples: ["I gave her the book.", "Please give me the book.", "Please give it to me."]
  },
  {
    id: "can-do-m52",
    afterLesson: 205,
    title: "我能说「到…的时候，已经…」",
    zh: "说「到…的时候」用 By the time 开头（By the time I got home, it was dark）+ 它领的那半句用平常的版本、不请 will 出场（第 48 课的老规矩）+ 要分先后时，更早那件穿第 178 课的 had 版（the train had left）。",
    samples: ["By the time I got home, it was dark.", "By the time we got to the station, the train had left.", "By the time you wake up, I will finish it."]
  }
];
