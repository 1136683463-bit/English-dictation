# PRD：第十三批课程 · 找东西（8 课：L79–L86 · 大章节）

**日期**：2026-09-19 ｜ **类型**：功能规格书（PRD）｜ **成员**：析客（需求分析）
**上游输入**：主理人裁决（8 课 L79–L86＝「找东西」大章节；开 season-13 + m15）；本批三研究（瑞思/竞析/数析 2026-09-19）；用户要求「一个章节的课程多一些」

## 📝 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1 | 2026-09-19 | 初稿：8 课（L79–L86）＋8 案（#88–#95），开 season-13、m15；本批定位「第一个大章节」 |

## 📌 TL;DR

1. **批十三＝8 课（L79–L86）**：方位三课（next to／in front of·behind／between）→ put → 不定代词两课（something·anything／nothing·someone）→ whose → 失物招领处收口；开 season-13（{79,86}）＋m15（afterLesson 86），总课量 86。
2. **用户要求的大章节落地：8 课**——批十一 4 课、批十二 3 课为全库最小两季；首次按「一个功能场景承载多语法点」组章，章内结构＝场景锚 → 每课一增量 → 章末零新知收口。
3. **一课一增量**：L79 只教 next to／L80 只教前后一对／L81 只教 between A and B／L82 只教 put 三态同形／L83 只教 something·anything／L84 只教 nothing 自带否定＋someone／L85 只教 whose；L86 零新知全复现。
4. **三层证据**：L83/L84＝A 档（BC 参考页 beginner 硬证据＋中文侧 -thing/-body 零覆盖＋L30 平台）；L79/L80/L81/L85＝B 档（跨源课程级无位，靠中文专文全收＋我方错点账 46 条，对外标「跨源无位」）；L82/L86＝自研项（零先例）。
5. **两处硬账**：① cloze（R-B8 词表 144 词）不含 next/between/behind/front/something/anything/nothing/whose → 核心句空位全落 is，唯 L82 `I put my bag next to the door.` 落 put（正中考点）——每课须核验 variants ≥1 句让主考点落空（G12）；② season-13＋m15＋8 案随批上线，不落则 `grammarSeasons.test.ts` 先红。
6. **案件 8 案（#88–#95）**：4 错＝新 2＋旧 2；新错主力 preposition（全库已 46，第二高）→ **每案只放 1 条**，另一条轮换其他罪名；不碰 comparison；不引番外 5 案。

## 🎯 核心结论卡片

| 项目 | 内容 |
|---|---|
| 推荐方案 | 8 课 L79–L86「找东西」大章节：方位 3 → put 1 → 不定代词 2 → whose 1 → 收口 1；8 案 #88–#95 |
| 优先级 | P1（内容生产批次）；无 P0 阻断项 |
| 预期影响 | 开 season-13（首个 8 课大季）；补「描述世界」缺口（方位/不定代词近零）；批量 86 |
| 资源需求 | ≈5 人日（内容 4＋展示层 0.25＋走查 0.5＋验收 0.25）；两段式跨 2 周 |
| 风险等级 | 中（cloze 空位系统性落 is；8 课中段疲劳 L82；put 与 L10 张力；L84 双重否定；封面单次池 20 张吃紧） |
| 硬性范围红线 | 课量 8 不扩不缩；一课一增量；L86 零新知；六段式；每课 1 案（4 错＝新 2＋旧 2、单 token 可修）；对比卡 6 条；禁用词表；comparison 不进案件；tagStats=10 不动；L1–78 零改动；封面池外零新资产 |

## §1 问题陈述与批次定位

### 1.1 解决什么问题

- **章节太薄是用户点名问题**：S11＝4 课、S12＝3 课为全库最小两季——本批以 8 课组章直接响应。
- **方位链 100% 空白**：next to / in front of / behind / between 两文件全 0；L18 `:3179` 口诀只覆盖 in/on/at；旁证 L26 `:4654/:4655/:4657` 与案 `:1400/:1401/:1995`——把骨架接到「前后左右中间」。
- **不定代词近零**：something 2·anything 1·**nothing 0**·someone 6（L33 台词＋L50/51/54 举例）；接口极佳（L30 `:5389` some/any 老规矩）；BC 参考页 `indefinite-pronouns` 直标 **beginner**。
- **put 缺位**：课程 0、案内仅 `:1202`——本章只有「在哪」没有「放哪」；cloze 唯一自然命中考点的一课。
- **whose 半缺口**：全库 2 处同一句（L33 `:5946` 对白）；L27 疑问词家族缺最后一位。
- **系统账**：瑞思建议 8 课含天气；竞析把天气正名「L6 深化章、须换角度」并入批十四「寒暄」功能章；主理人裁决＝**本批不含天气**（§7）。

### 1.2 前置已铺完（本批直接衔接）

| 前置 | 行号 | 本批怎么用 |
|---|---|---|
| L18 in/on/at 口诀 | `:3179`（target `:3163`） | L79 门牌家族扩员 |
| L26 方位尾巴 | `:4654`（under the chair）`:4655`（on the table）`:4657`（near here） | L79/L80/L81 复现 |
| L19 and/but | `:3347` | L81 between A and B（and 是老熟人） |
| L30 some/any 体系 | `:5374`／`:5389` | L83「东西版」（疑问否定换 any 回流） |
| L32 祈使省主语 | `:5738` | L82 put 句情境 |
| L33 Whose umbrellas…? | `:5946` | L85 对白转正 |
| L68 What a nice bag! | `:12493` | L86 认读一句（不单开课） |
| L10 过去式 | `:1696` | L82 张力面（三态同形 vs 昨天版） |
| L27 疑问词四员 | — | L85 whose＝家族最后一位 |

### 1.3 批次定位：第一个大章节——8 课的组章说明

本批是十二季以来**第一个 8 课大章节**：竞析 §⑤ 实读六部竞品**无一做「章」**（BC 全单点课；Duolingo 语法隐含在功能话题单元），可抄的只有「功能场景承载语法」一个原则。组章正当性按三问制分三层：**A 档 L83/L84**（BC beginner 硬证据＋中文侧空白＋L30 平台在库）／**B 档 L79/L80/L81/L85**（跨源课程级无位，靠中文专文全收＋我方接口与错点账，对外须明标「跨源无位」）／**自研项 L82/L86**（零跨源先例，理由＝cloze 命中缺口＋收口传统 9 先例）。章内结构固定为「**场景锚（同一地点）→ 每课一增量 → 章末零新知收口**」；命名「找东西」：东西在哪（方位三课）→ 把它放好（put）→ 说不清是什么（不定代词两课）→ 这是谁的（whose）→ 失物招领处收口。

## §2 拆课方案与逐课规格

### 2.1 课量决策：8 课（L79–L86）

| 方案 | 取舍 | 裁决 |
|---|---|---|
| 6 课 | 砍 L82 put＋砍 L85 nothing——put 是 cloze 唯一命中考点、nothing 是双重否定唯一落点 | ✗ |
| 7 课 | 只砍 L82——本章断「放哪」半边，放弃唯一 cloze 命中 | ✗ |
| **8 课** | 方位 3＋put 1＋不定代词 2＋whose 1＋收口 1；一课一增量；8 案 #88 起 | **✓ 拍板（主理人）** |

课表：L79 `lesson-79-next-to`｜L80 `lesson-80-front-behind`｜L81 `lesson-81-between`｜L82 `lesson-82-put`｜L83 `lesson-83-something`｜L84 `lesson-84-nothing`｜L85 `lesson-85-whose`｜L86 `lesson-86-lost-and-found`

### 2.2 逐课规格

**L79 就在旁边（next to）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-79-next-to`；episode「小美的一天 七十九」；scene `mansion`；cover `cover1`（单次池首用最早，距今 78 课） |
| title / grammarLabel | 「就在旁边」/「位置词 · next to」 |
| targetSentence | `My desk is next to the window.`（6 token） |
| 场景 | 小美在书房收拾，说书桌紧挨着窗户 |
| 新知识点 | **只有一件**：next to＝「紧挨着」，两个词一起住——接 L18 `:3179` 口诀扩员；L26 尾巴复现 |
| 对比卡方向（6 条） | ① `My desk is next the window.` ❌（漏 `to`）→ `next to`——漏 to 头号坑（preposition 46 条同族）；② `My desk is next to window.` ❌（漏 `the`）→ `the window`（article 先例 17/12）；③ 双正解：`My hat is in the box.`（L18 `:3163`）✅ 并排 `My desk is next to the window.` ✅——老门牌与新门牌同台；④ 对照卡（near vs next to）：`Is there a park near here?`（L26 `:4657`）✅ 并排 target ✅——near 是「不远」，next to 是「紧挨着」；⑤ 复习卡 L26 `:4654`：`There is a cat under the chair.` ✅；⑥ 复习卡 L18 `:3179`：口诀三小词各回一句 ✅ |
| 变体方向 | 肯定 target（cloze 落 **is**——主考点落空，靠保障句）/ 否定 `My desk is not next to the window.`（noteZh：不在旁边）/ 疑问 `Is your desk next to the window?`（noteZh：问对方书桌挨着窗吗） |
| 复现题设计 | guided 复现 L18 原句 `My hat is in the box.`；practice 第 1 题 target＋变体逐字题；**第 2 题保障句 `He sits next to me.`（cloze 落 sits——主考点 next 落空）**；第 3 题复现 L26 原句 `There is a cat under the chair.` |
| 案件规划 | 新案 `hunt-desk-map`「书桌地图」（#88，§6） |
| 六段要点 | 开场召回 L18 口诀；比喻＝门牌家族新员「紧挨着，两个词一起住」；deepDive：next to 三连＋漏 to/漏 the 各一错；arrange ≤6 token |

**L80 前面、后面（in front of / behind）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-80-front-behind`；episode「小美的一天 八十」；scene `mansion`；cover `cover2`（距今 77 课） |
| title / grammarLabel | 「前面、后面」/「位置词 · in front of / behind」 |
| targetSentence | `The cat is behind the door.`（6 token） |
| 场景 | 小美到处找猫，猫躲在门后 |
| 新知识点 | **只有一件**：前后一对——in front of（脸朝那边）／behind（背朝那边）；增量＝「面朝哪边」 |
| 对比卡方向（6 条） | ① `The ball is in front the door.` ❌（漏 `of`）→ `in front of`；② `The cat is behind of the door.` ❌（**多 `of`**）→ `behind`——一卡两侧都收；③ 双正解（前后配对）：`The school is in front of the park.` ✅ 并排 target ✅——一个脸朝、一个背朝；④ 复习卡（L79）：`My desk is next to the window.` ✅；⑤ 复习卡 L26 `:4654`：`There is a cat under the chair.` ✅；⑥ 复习卡 L18：`She is at home.` ✅ |
| 变体方向 | 肯定 target（cloze 落 **is**——主考点落空）/ 否定 `The cat is not behind the door.`（noteZh：不在门后）/ 疑问 `Where is the cat?`（noteZh：问猫在哪——Where 老熟人） |
| 复现题设计 | guided 复现 L79 原句 `My desk is next to the window.`；practice 第 1 题 target＋变体逐字题；**第 2 题保障句 `The cat sits behind the door.`（cloze 落 sits——主考点 behind 落空）**；第 3 题复现 L26 原句 `There is a cat under the chair.` |
| 案件规划 | 新案 `hunt-cat-hiding`「猫躲哪了」（#89，§6） |
| 六段要点 | 开场召回 L79（贴旁边）；比喻＝「脸朝哪边、背朝哪边」；deepDive：in front of / behind 各两句＋漏 of/多 of 对照；arrange ≤6 token |

**L81 夹在中间（between A and B）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-81-between`；episode「小美的一天 八十一」；scene `campus`；cover `cover3`（距今 77 课） |
| title / grammarLabel | 「夹在中间」/「位置词 · between A and B」 |
| targetSentence | `I sit between Tom and Amy.`（6 token） |
| 场景 | 教室换座位，小美坐在汤姆和艾米中间 |
| 新知识点 | **只有一件**：between 两头都要点名，中间用 and 牵起来（and 是 L19 `:3347` 老熟人） |
| 对比卡方向（6 条） | ① `I sit between Tom to Amy.` ❌（`to`）→ `and`——「从…到…」误用 to（负迁移头号）；② `I sit between Tom.` ❌（只给一头）→ 两头都要点名，话要说完；③ 双正解：`I was busy and happy.`（L19 `:3347`）✅ 并排 target ✅——and 两岗：连两句话、牵两头；④ 复习卡（L79）：`My desk is next to the window.` ✅；⑤ 复习卡（L80）：`The cat is behind the door.` ✅；⑥ 复习卡 L26 `:4655`：`There are three apples on the table.` ✅ |
| 变体方向 | 肯定 target（cloze 落 **sit**——主考点落空）/ 否定 `I don't sit between Tom and Amy.`（noteZh：不坐中间）/ 疑问 `Who sits between Tom and Amy?`（noteZh：谁坐他俩中间——who 老熟人） |
| 复现题设计 | guided 复现 L80 原句 `The cat is behind the door.`；practice 第 1 题 target＋变体逐字题；**第 2 题保障句 `The shop is between the bank and the park.`（cloze 落 shop——主考点 between 落空）**；第 3 题复现 L19 原句 `I was busy and happy.` |
| 案件规划 | 新案 `hunt-seat-plan`「座位表」（#90，§6） |
| 六段要点 | 开场召回 L19（and 连接两样）；比喻＝「两头都要点名，中间用 and 牵起来」；deepDive：between A and B 三连＋to 误用对照；arrange ≤6 token |

**L82 把它放那儿（put · 三态同形）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-82-put`；episode「小美的一天 八十二」；scene `mansion`；cover `cover4`（距今 76 课） |
| title / grammarLabel | 「把它放那儿」/「放 · put（三态同形）」 |
| targetSentence | `I put my bag next to the door.`（8 token；cloze **唯一自然落 put**＝正中考点） |
| 场景 | 小美放学进门，把书包放在门边 |
| 新知识点 | **只有一件**：put 三天长一个样——今天、昨天、明天都是 put（不加 -ed）；接 L32 祈使情境＋L79 位置收尾 |
| 对比卡方向（6 条） | ① `I putted my bag next to the door.` ❌（乱加 `-ed`）→ `put`——与 L10 昨天版张力：老规矩加 -ed，put 这条不长个子；② `I put my bag next the door.` ❌（漏 `to`）→ `next to`——L79 刚学的回流（preposition）；③ 双正解：`I went to school yesterday.`（L10）✅ 并排 `I put my bag next to the door.` ✅——老规矩 vs 不长个子，两家人；④ 复习卡（L32 `:5738`）：`Close the door.` ✅（动词开头，省主语）；⑤ 复习卡（L79）：`My desk is next to the window.` ✅；⑥ 复习卡（L80）：`The cat is behind the door.` ✅（与 target 同一构图） |
| 变体方向 | 肯定 target（cloze 落 **put**——主考点即空位，本批唯一）/ 否定 `I don't put my bag on the desk.`（noteZh：不放在桌上）/ 疑问 `Where do you put your bag?`（noteZh：你把包放哪） |
| 复现题设计 | guided 复现 L79 原句 `My desk is next to the window.`；practice 第 1 题 target＋变体逐字题；**第 2 题保障句 `I put my bag on the desk.`（cloze 落 put——主考点落空再落一次）**；第 3 题复现 L32 原句 `Close the door.` |
| 案件规划 | 新案 `hunt-pack-bag`「收书包」（#91，§6） |
| 六段要点 | 开场召回 L79（贴旁边）＋L32（动词开头）；比喻＝「放，三天长一个样」；deepDive：put 三连（今天/昨天/明天各一句）＋putted 对照；arrange ≤7 token |

**L83 有个东西（something / anything）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-83-something`；episode「小美的一天 八十三」；scene `mansion`；cover `cover5`（距今 76 课） |
| title / grammarLabel | 「有个东西」/「不点名的东西 · something / anything」 |
| targetSentence | `I have something for you.`（6 token） |
| 场景 | 小美手里攥着东西，说有样东西给你 |
| 新知识点 | **只有一件**：说不清或先不说是什么，用 something；疑问和否定换 anything——**L30 `:5389` some/any 老规矩的东西版**（开场明示） |
| 对比卡方向（6 条） | ① `I don't have something for you.` ❌（没换 `anything`）→ `I don't have anything for you.`——老规矩直接回流（先例 #39 some→any×2）；② `Do you have something?` ❌（疑问换 `anything`）→ `Do you have anything?`——同一张卡的另一侧；③ 双正解：`There are some apples on the table.`（L30 `:5374`）✅ 并排 `I have something for you.` ✅——some/any 管「一些」，今天管「一个说不清的东西」；④ 对照卡（something vs anything 分工）：`I have something for you.` ✅ 并排 `I don't have anything for you.` ✅——肯定 some 侧、疑问否定 any 侧；⑤ 复习卡（L30 `:5389`）：`I don't have any candy.` ✅；⑥ 复习卡（L79）：`My desk is next to the window.` ✅ |
| 变体方向 | 肯定 target（cloze 落 **have**——主考点落空）/ 否定 `I don't have anything for you.`（noteZh：什么都没带给你）/ 疑问 `Do you have anything for me?`（noteZh：有东西给我吗） |
| 复现题设计 | guided 复现 L30 原句 `There are some apples on the table.`；practice 第 1 题 target＋变体逐字题；**第 2 题保障句 `I want something to drink.`（cloze 落 want——主考点 something 落空）**；第 3 题复现 L30 原句 `I don't have any candy.` |
| 案件规划 | 新案 `hunt-gift-box`「礼物盒」（#92，§6） |
| 六段要点 | 开场明示「这是第 30 课 some/any 的东西版」；比喻＝「有样东西，先不说是什么」；deepDive：something/anything 成对三连＋形容词后置一句认读；arrange ≤6 token |

**L84 什么都没有（nothing / someone）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-84-nothing`；episode「小美的一天 八十四」；scene `mansion`；cover `cover6`（距今 76 课） |
| title / grammarLabel | 「什么都没有」/「不点名的东西 · nothing / someone」 |
| targetSentence | `There is nothing in the box.`（6 token） |
| 场景 | 小美打开盒子，里面空空的 |
| 新知识点 | **只有一件**：nothing 自带「不」——一句话里有它就不再请 not（双重否定头号坑）；someone 是三单（接 L33 `:5946` 台词＋L26 There be） |
| 对比卡方向（6 条） | ① `I don't have nothing.` ❌（多一个 `not`）→ `I have nothing.`——自带「不」，不再请 not；② `Someone are at the door.` ❌（`are`）→ `Someone is at the door.`（sv 先例 41/32）——someone 是「一个人」，配 is；③ 双正解（一对反义）：`There is something in the box.` ✅ 并排 `There is nothing in the box.` ✅——有样东西 vs 啥也没有；④ 复习卡（L83）：`I have something for you.` ✅；⑤ 复习卡 L26 `:4657`：`Is there a park near here?` ✅；⑥ 复习卡 L33 `:5946`：`Someone left them here.` ✅ |
| 变体方向 | 肯定 target（cloze 落 **is**——主考点落空）/ 否定 `There is not anything in the box.`（noteZh：盒里没东西——换说法不带 nothing）/ 疑问 `Is there anything in the box?`（noteZh：盒里有东西吗——疑问换 anything 回流） |
| 复现题设计 | guided 复现 L26 原句 `There is a book on the desk.`；practice 第 1 题 target＋变体逐字题；**第 2 题保障句 `Someone is at the door.`（cloze 落 Someone——主考点 nothing 落空）**；第 3 题复现 L33 台词 `Someone left them here.` |
| 案件规划 | 新案 `hunt-empty-drawer`「空抽屉」（#93，§6）；**`*I don't have nothing.` 做成陷阱**（§6 表） |
| 六段要点 | 开场点名 L33（someone 老台词）＋L26（There be）；比喻＝「啥也没有——它自带『不』」；deepDive：nothing 三连＋双重否定对照＋someone 三单；arrange ≤6 token |

**L85 这是谁的（whose）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-85-whose`；episode「小美的一天 八十五」；scene `mystery`；cover `cover8`（距今 75 课） |
| title / grammarLabel | 「这是谁的」/「问东西的主人 · whose」 |
| targetSentence | `Whose book is this?`（5 token） |
| 场景 | 失物堆前，小美拿起一本书问是谁的 |
| 新知识点 | **只有一件**：问「这是谁的」，用 whose 站最前面——L33 `:5946` 对白转正＋L27 疑问词家族最后一位补员 |
| 对比卡方向（6 条） | ① `Who's book is this?` ❌（同音混淆 `who's`）→ `Whose`——谁是「谁」，whose 是「谁的」，两家人读起来像，写法不同（word_order/fragment 先例）；② `Whose is this book?` ❌（顺序换位）→ `Whose book is this?`——whose 后头直接跟东西，再问是谁的；③ 双正解（家族会面）：`Where is my hat?`（L18）✅ 并排 `Whose book is this?` ✅——疑问词家族一句一个；④ 复习卡 L33 `:5946`：`Whose umbrellas are these?` ✅（老对白，今天转正）；⑤ 复习卡（L83）：`Do you have anything for me?` ✅；⑥ 复习卡（L84）：`There is nothing in the box.` ✅ |
| 变体方向 | 肯定 target（cloze 落 **is**——主考点落空）/ 否定 `This is not my book.`（noteZh：不是我的书）/ 疑问 `Whose bag is this?`（noteZh：换样东西再问一次） |
| 复现题设计 | guided 复现 L33 台词 `Whose umbrellas are these?`；practice 第 1 题 target＋变体逐字题；**第 2 题保障句 `Whose bag is this?`（cloze 落 Whose——主考点落空）**；第 3 题复现 L33 原句 `This one is mine.` |
| 案件规划 | 新案 `hunt-umbrella-owner`「伞的主人」（#94，§6） |
| 六段要点 | 开场点名 L27 家族四员＋L33 老对白；比喻＝「谁的东西」（whose 站最前）；deepDive：whose 三连＋Who's 同音对照；arrange ≤5 token |

**L86 失物招领处（收口 · 零新知全复现）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-86-lost-and-found`；episode「小美的一天 八十六」；scene `school`；cover `cover11`（距今 74 课） |
| title / grammarLabel | 「失物招领处」/「收口 · 大团圆（零新知）」 |
| targetSentence | `Whose bag is this? It is next to the door.`（10 token，两句；**≤8 词原则按单句核**——每句 5 词，生产时可微调） |
| 场景 | 学校失物招领处，小美和你一件件认领、一件件放回 |
| 新知识点 | **无——章末零新知**（收口传统 9 先例同构，接口零字段新增）；复现取材：L79 方位／L80 前后／L81 between／L82 put／L83 something／L84 nothing／L85 whose；**What a…! 认读一句，不单开课**（L68 `:12493` 转正） |
| 对比卡方向（6 条） | ① `I putted it on the desk.` ❌（`putted`）→ `put`——L82 回流（#91 锚）；② `Whose bag is this?` ✅ 并排 `It is next to the door.` ✅——复现不是新点：一句问主人、一句说位置；③ `I don't have nothing.` ❌（双重否定）→ `I have nothing.`——L84 回流（#93 锚）；④ 复习卡（L79/L80）：`My desk is next to the window.` ✅ ／`The cat is behind the door.` ✅；⑤ 复习卡（L81/L83）：`I sit between Tom and Amy.` ✅ ／`I have something for you.` ✅；⑥ 认读（L68 `:12493`）：`What a nice bag!` ✅（只认读，不入变体/复现） |
| 变体方向 | 肯定 target（cloze 落 **is**——收口课无主考点，空位落在哪都算合格，按生效词表实跑登记）/ 否定 `There is nothing in the bag.`（noteZh：包里啥也没有——L84 回流）/ 疑问 `Is this your bag?`（noteZh：这是你的包吗） |
| 复现题设计 | guided 复现 L84 原句 `There is nothing in the box.`；practice 第 1 题 target＋变体逐字题；第 2 题复现 L82 原句 `I put my bag next to the door.`；第 3 题复现 L85 原句 `Whose book is this?`；第 4 题＝章末收官惯例，复现 L80 原句 `The cat is behind the door.` |
| 案件规划 | 新案 `hunt-lost-found`「失物招领」（#95，§6）；**不引番外 5 案** |
| 六段要点 | 开场跨 8 课倒带（方位三课→put→不定代词两课→whose）；比喻＝「把身边的东西一件件说清楚」；deepDive：七课各回一句＋What a…! 认读一句；arrange ≤8 词/句 |

## §3 中文负迁移处理专章

| 课 | 干扰 | 典型错 | 话术方向 | 归入 |
|---|---|---|---|---|
| L79 | 方位「在旁边」无 to | \*next the window／\*next to window | 「紧挨着，两个词一起住——to 不能丢」；漏 the 次之（preposition 46 条同族） | 对比卡 ①② |
| L80 | 「在前面」丢 of／“behind of” 多 of | \*in front the school／\*behind of the door | 「前面两个词一起（in front of），后面一个词独住（behind）」——一卡两侧都收 | 对比卡 ①② |
| L81 | 「从…到…」误用 to | \*between the shop to the park | 「两头都要点名，中间用 and 牵起来」（and＝L19 老熟人） | 对比卡 ① |
| L82 | 过去式惯性乱加 -ed | \*I putted it | 「put 三天长一个样——今天、昨天、明天都不变」（与 L10 昨天版张力） | 对比卡 ① |
| L83 | 疑问/否定没换 anything | \*I don't have something／\*Do you have something? | 「肯定 some 侧、疑问否定 any 侧——L30 老规矩的东西版」 | 对比卡 ①② |
| L84 | 双重否定 | \*I don't have nothing. | 「nothing 自带『不』，不再请 not——一句一个『不』就够」 | 对比卡 ①（**#93 陷阱**） |
| L85 | 同音混淆 | \*Who's book is this? | 「谁是『谁』，whose 是『谁的』——听声音像，写出来两家人」 | 对比卡 ① |
| L86 | 混排错型边界 | —（不新增干扰） | 错型只用旧课锚点，不引入未教材料 | §6 案件表纪律 |

## §4 叙事设计专章

### 4.1 叙事草案（逐字采用）

> **「东西在哪 → 把它放好 → 说不清是什么 → 这是谁的 → 失物招领处。」**
> 在哪：My desk is next to the window.（第 79 课）→ The cat is behind the door.（第 80 课）→ I sit between Tom and Amy.（第 81 课）。
> 放好：I put my bag next to the door.（第 82 课——放，三天长一个样）。
> 说不清：I have something for you.（第 83 课）→ There is nothing in the box.（第 84 课）。
> 谁的：Whose book is this?（第 85 课）→ Whose bag is this? It is next to the door.（第 86 课，失物招领处收口）。

### 4.2 复用体系（不造新比喻）

- 「门牌家族」（L18 `:3179` 的口诀＋L26 `:4654–4657` 尾巴——L79/L80/L81 扩员，三课各接一块）
- 「老规矩的东西版」（L30 `:5374/:5389` some/any——L83 直接回流，L84 换 any 侧）
- 「疑问词家族」（L27 四员＋L33 `:5946` 对白——L85 补最后一位）
- 「收口传统」（9 先例 `:7395`…`:13804`——L86，章末首次）
- 「同形两义对照」（L29 `:12493`… 实为 L68 `What a` 认读一句——L86）

### 4.3 禁用词表（本批生产禁出现）

介词、方位介词、代词、不定代词、疑问词、宾语、主谓一致、三单、动词原形、过去式（术语形态）、双重否定、存在句、指示代词——全禁；用「门牌／小词／位置词／不点名的说法／谁的东西／它自己带的『不』／动词开头的句子」替代。

## §5 验收标准

### 5.1 检查清单

- [ ] G1 practice ≥4 且含变体逐字题（L79 `Is your desk next to the window?` / L80 `Where is the cat?` / L81 `Who sits between Tom and Amy?` / L82 `Where do you put your bag?` / L83 `Do you have anything for me?` / L84 `Is there anything in the box?` / L85 `Whose bag is this?` / L86 `There is nothing in the bag.`）
- [ ] G2 tokens/answer 词集一致、distractors 不重复
- [ ] G3 recall 三字段非空
- [ ] G4 arrange/practice 展示序≠答案序
- [ ] G5 罪名枚举：8 案 tag 全落 10 枚举（预期 preposition 每案 1 条、word_order/verb_form/plural/sv/article/missing_be/fragment 轮换）；**本批不碰 comparison**
- [ ] G6 案件结构：tokenIndex 对齐、errors=4（新错 2＋旧错 2）、单 token 可修、≥1 净词、reviewed=true
- [ ] G7 tagStats=10 不动（`huntService.test.ts:109`）
- [ ] **G8 展示层硬需求**：season-13（min 79, max 86）＋m15（afterLesson 86）随批上线——`grammarSeasons.ts` 在 season-12（`:42`）后追加 `{ id: "season-13", label: "第十三季 · 找东西", hint: "东西在哪、放哪、说不清是什么、这是谁的——把身边说清楚", min: 79, max: 86 }`；`GrammarPathPage.tsx` CAN_DO_MILESTONES 在 m14（`:211-216`）后追加 m15（标题「我能说清东西在哪、放哪，还会问这是谁的」，样本句 `My desk is next to the window.` / `I put my bag next to the door.` / `Whose book is this?`）
- [ ] **G8-b 守门测试**：`grammarSeasons.test.ts` 四断言全绿——「最高课号 86 落区间」与「区间不重叠」（79 > 78）
- [ ] G9 orphans 纪律：8 个新案（#88–#95）全部被 L79–L86 引用（番外案名单冻结 5 个不动，`huntService.test.ts:215`）
- [ ] G10 episode 写法：L79–L86 全部汉字数字（「小美的一天 七十九」…「八十六」）
- [ ] G11 语料锁闭集：方位词组只作位置义；something/anything/nothing/someone 只作不点名义（不新造 somebody/anybody/nobody）；whose 只作疑问（不做关系代词）；L86 零新知识点（素材逐句可追到旧课）；What a…! 只认读一句
- [ ] **G12 cloze 逐课核验**（按生产时生效词表实跑；R-B8 词表 144 词不含本批方位/不定代词/whose 词 → 核心句空位落 is）：L79 target 落 is → 保障句 `He sits next to me.` 落 sits；L80 target 落 is → 保障句 `The cat sits behind the door.` 落 sits；L81 target 落 sit → 保障句 `The shop is between the bank and the park.` 落 shop；**L82 target 落 put（主考点即空位——本批唯一）** → 保障句 `I put my bag on the desk.` 落 put；L83 target 落 have → 保障句 `I want something to drink.` 落 want；L84 target 落 is → 保障句 `Someone is at the door.` 落 Someone；L85 target 落 is → 保障句 `Whose bag is this?` 落 Whose；L86 落 is（收口课任意皆合格）——**逐课须核验 variants 至少 1 句让主考点落空**
- [ ] G13 时长 6–8 min（8 课逐课走查；L86 两句 target 核对上限）；G14 旧线零回归（L1–78 不动；54 文件 666 测试全绿 + build 通过）

### 5.2 Given/When/Then

- **G-A1** Given 学习者完成 L79 When 看对比卡 `My desk is next the window.` ❌ / `My desk is next to the window.` ✅ Then 能说出「紧挨着，两个词一起住」
- **G-A2** Given 学习者完成 L80 When 看对比卡 `in front the door` ❌ / `behind of the door` ❌ / 正确两句 ✅ Then 能说出「前面两个词一起、后面一个词独住」
- **G-A3** Given 学习者完成 L81 When 看对比卡 `I sit between Tom to Amy.` ❌ / `between Tom and Amy` ✅ Then 能说出「两头都要点名，中间用 and」
- **G-A4** Given 学习者完成 L82 When 看对比卡 `I putted my bag next to the door.` ❌ / `I put my bag next to the door.` ✅ Then 能说出「put 三天长一个样」
- **G-A5** Given 学习者完成 L83 When 看对比卡 `I don't have something.` ❌ / `I don't have anything.` ✅ Then 能说出「疑问否定换 anything——第 30 课老规矩」
- **G-A6** Given 学习者在 `hunt-empty-drawer`（#93）遇到 `don't`＋`nothing` When 修成 `nothing` 单用 Then 能说出「nothing 自带『不』」；Given 学习者在 L86 回看 7 课旧句 Then 能各自说出「这是第 N 课学的」

## §6 案件规划（8 案）

**总规则**：每案 4 错＝新错 2＋旧错 2；单 token 可修；每案 ≥1 净词；零术语话术；tag 全落 10 枚举（tagStats 固定 10 项）；reviewed: true；**必须配课**；**不碰 comparison**；**不引番外 5 案**；**preposition 每案至多 1 条**（全库已 46＝第二高）。案件编号接批十二尾号（#87 `hunt-full-day`，`huntCases.ts:3681`）为 **#88–#95**。

| 案件 id | 配课 | 场景 | 定稿错误构成（原 → 修正（tag，新错/旧错）） |
|---|---|---|---|
| `hunt-desk-map` | L79 | 书桌地图 | ① `next` → `next to`（preposition，新错——漏 to 头号坑，单 token 修法按 #36/#75 短语级先例）② `the` 缺失 → `the window`（article，新错——漏 the）③ `on` → `in`（in the box 复现 L18）（preposition，旧错）④ `book` → `books`（plural，旧错 L11） |
| `hunt-cat-hiding` | L80 | 猫躲哪了 | ① `of` 多出 → 去掉（\*behind of→behind）（preposition，新错——多 of 侧）② `in front` → `in front of`（fragment，新错——漏 of 侧；fragment 先例 9/8 最薄，正合落点）③ `are` → `is`（The cat is）（sv，旧错 L26）④ `chair` → `chairs`（plural，旧错 L11） |
| `hunt-seat-plan` | L81 | 座位表 | ① `to` → `and`（\*between A to B）（preposition，新错）② `sit` → `sits`（He sits…，sv，新错——现场三单）③ `is` → `are`（There are three apples，sv，旧错 L26）④ `apple` → `apples`（plural，旧错 L11） |
| `hunt-pack-bag` | L82 | 收书包 | ① `putted` → `put`（verb_form，新错——三态同形，worst 坑）② `next` → `next to`（preposition，新错——L79 回流）③ `go` → `went`（tense，旧错 L10）④ `shoe` → `shoes`（plural，旧错 L11） |
| `hunt-gift-box` | L83 | 礼物盒 | ① `something` → `anything`（\*don't have something）（article，新错——#39 some→any 同族先例）② `something` → `anything`（疑问侧 Do you have anything?）（article，新错——同一卡两侧）③ `candy` → `candies`（plural，旧错）④ `on` → `in`（in the box，preposition，旧错 L18） |
| `hunt-empty-drawer` | L84 | 空抽屉 | ① `don't` 多出 → 去掉（\*I don't have nothing.）（word_order，新错——**双重否定陷阱**）② `are` → `is`（Someone is at the door，sv，新错）③ `book` → `books`（plural，旧错 L11）④ `on` → `under`（under the chair 复现 L26）（preposition，旧错） |
| `hunt-umbrella-owner` | L85 | 伞的主人 | ① `Who's` → `Whose`（word_order，新错——同音混淆）② `Whose is this book?` → `Whose book is this?`（word_order，新错——语序换位；同案两条 word_order 按 #85 先例可）③ `one` → `ones`（These ones are mine，plural，旧错 L33）④ `umbrella` → `umbrellas`（plural，旧错 L11） |
| `hunt-lost-found` | L86 | 失物招领 | ① `putted` → `put`（verb_form，新错——L82 回流，以 #91 为锚）② `Who's` → `Whose`（word_order，新错——L85 回流，以 #94 为锚）③ `don't have nothing` 侧 `don't` → 去掉（word_order，旧错——L84 回流，以 #93 为锚）④ `next the door` → `next to`（preposition，旧错——L79 回流） |

> **案件表纪律**：每案 4 错全部单 token 可修、tokenIndex 与 tokens 对齐（生产时逐 token 核对）；新错话术走 §3 负迁移表；旧错一律取自已教点（L10/L11/L18/L26/L33），禁引入未教材料；L86 案以旧课锚复现（#91/#93/#94），不新增错型。

## §7 Non-goals

- **不做天气表达**：与 L6 高度重叠（L6 已教 It is cold/sunny/hot＋❌It is rains 对比卡；raining 就在 L6 contrast 里）——须换角度另立批十四「寒暄」功能章，本批不进
- **不做时间连词链** before/after/when 从句（真语料仅 5 处，须拆 2–3 课，留后）；**不做** used to（BC 明标 B1 两课，留后）
- **不单开感叹句课**（跨源零课位、真感叹仅 L68 一处——降为 L86 认读一句）；**不做** make 使役／look like／机制强化（批十二预告项，本批不占章位）
- **冻结** 交通方式／may·might／附加疑问／深水区
- **不做**关系代词 whose（接 L39/L40，留后）；**不新造** somebody/anybody/nobody；**不做** among/beside/by 等未入章方位词
- **案件不碰** comparison；**不加**新枚举、不改 tagStats/schema、不动 L1–78；**不引**番外 5 案
- **不做**封面池外新资产（8 课全部从单次池 20 张选）

## §8 开放问题

1. **cloze 词表是否追加**（跨工作流）：本批 8 词（next/between/behind/front/something/anything/nothing/whose）不在 R-B8 词表 144 词内 → 空位系统性落 is；保底方案＝每课 variants 放无 be 句（G12 已落）；若追加须**竞析/主业拍板**（该词表为 boost R-B8 落盘资产、批十二记「不再改」）。
2. **封面首用最早策略**：取 cover1·2·3·4·5·6·8·11（首用 L1–L11，距今 74–85 课，重复感最低）——8 课用掉单次池 20 张的 40%；若连开批十四将吃紧，是否提前启用「三用」排序（数析 §5 建议②）。
3. **L82 put 与 L10 边界**：put 三态同形与「昨天版加 -ed」老规矩正面张力——是否在 L82 明确点出「put 是例外」还是只做「三天长一个样」比喻？默认前者（对比卡 ③ 已落）。
4. **L84 nothing 双重否定设计**：`*I don't have nothing.` 作为 #93 陷阱（第 1 错）是否合适——双重否定在中文是强调、在英语是错；默认保留（瑞思 §6 建议），走查重点观察 L84 关 2。
5. **8 课中段疲劳**：L82（第 4 课）完成率是否下滑——两段式节奏（方位 4 课一小拱、不定代词＋whose＋收口一拱）；默认打样门 L79、中段自走查 L82/L85。
6. **L86 收口取材范围**：复现点定 7 条（本批 7 课各 1）＋What a 认读 1 句——是否超 6–8 min 上限？默认两句 target、逐句 ≤8 词，生产时按实际 token 核对。

## §9 里程碑（大章节：分两段 D1–D5 / D6–D10）

| 阶段 | 产出 | 说明 |
|---|---|---|
| M0 规格冻结 | 本 PRD 评审 | 无 P0 前置项 |
| M1 打样（D1–D2） | L79 全量 + `hunt-desk-map` + 首玩走查 | 打样门：方位空位落 is 是否可接受、漏 to 话术 |
| M2 第一段生产（D2–D5） | L80/L81/L82 + 3 案 | 每段 4 课；L82 走查点（put 三态 vs L10） |
| M3 第二段生产（D6–D8） | L83/L84/L85 + 3 案 | L85 走查点（nothing 双重否定） |
| M4 收口与展示层（D8–D9） | L86 + `hunt-lost-found` + season-13/m15 | 跨 8 课唤醒走查 |
| M5 验收（D10） | §5 全量 + 路径页走查 | G8/G8-b/G9/G12 硬需求 |
| M6 上线观察 | 首过率、preposition 新错命中、cloze 落点、m15 触发 | 挂既有埋点；两段各观察一轮 |

## ✅ 行动清单

| # | 行动 | 负责方 | 时间窗 |
|---|------|--------|--------|
| 1 | L79 + `hunt-desk-map` + 打样走查（漏 to 话术定稿） | 内容 | D1–D2 |
| 2 | L80/L81/L82 + 3 案（put 三态开场话术） | 内容 | D2–D5 |
| 3 | L83/L84/L85 + 3 案（some/any 东西版、双重否定陷阱） | 内容 | D6–D8 |
| 4 | L86 + `hunt-lost-found`（跨 8 课取材＋What a 认读） | 内容 | D8–D9 |
| 5 | season-13 + m15（约 10 行） | 开发 | 随批 |
| 6 | 验收 + 路径页走查（G12 逐课 cloze 实跑） | 内容/开发 | D10 |
| 7 | M6 观察 | 产品负责人 | 上线后 1–2 周 |

## ⚠️ 待确认 / 假设 / Non-goals

- 开放问题 §8 六项（均有默认方案）
- 假设：单次封面池 20 张中取 8 张（首用最早）语义可核；episode「七十九…八十六」两文件零占用（数析实读）；课号 79–86 连续（`lessonService.ts:143` 缺号永久锁死，须人工核对）；R-B8 词表 144 词在 L79–L86 生产前不追加（否则按新表重跑 G12）
- 依赖：L79 依赖 L18/L26；L80 依赖 L79/L26；L81 依赖 L19/L26；L82 依赖 L32/L79/L10；L83 依赖 L30/L26；L84 依赖 L26/L33/L83；L85 依赖 L33/L27/L18；L86 依赖本批 L79–L85＋L68 认读
- Non-goals：见 §7（含天气留批十四、时间连词/used to 留后、感叹句降认读、机制强化不占章位）

## 📚 数据来源 & 成员产出索引

- 析客（本 PRD）；瑞思：`user-research-grammar-thirteenth-batch-2026-09-19.md`；竞析：`competitive-analysis-grammar-thirteenth-batch-2026-09-19.md`；数析：`data-audit-grammar-thirteenth-batch-2026-09-19.md`；格式基准：`prd-grammar-b1-advance-2026-09-18.md`
- 正文事实核对：`grammarLessons.ts`（L18 `:3179`/`:3163`、L19 `:3347`、L26 `:4654`/`:4655`/`:4657`、L30 `:5374`/`:5389`、L32 `:5738`、L33 `:5946`、L68 `:12493`、L10 `:1696`、收口 9 先例 `:7395`…`:13804`、episode 尾「七十八」）；`huntCases.ts`（87 案/322 错点、尾案 #87 `hunt-full-day` `:3681`、`put` 案内 `:1202`）；`grammarSeasons.ts:42`；`GrammarPathPage.tsx:211-216`；`grammarAmbushService.ts:160-187`（cloze 词表 144 词）；`grammarReviewService.ts:167-176`（复习会话抽词器）
- 红线核对：preposition 46/322＝14.3%（第二高）；tagStats=10（`huntService.test.ts:109`）；番外 5 案硬断言（`huntService.test.ts:215`）；句长 ≤8 词；封面单次池 20 张；54 文件 666 测试全绿

---

> 本报告由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。
