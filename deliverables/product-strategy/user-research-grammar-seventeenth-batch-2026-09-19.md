# 用户研究综合报告 · 第十七批（A2 收尾缺口重排 · 8 课 L111–L118）

**日期**：2026-09-19 ｜ **类型**：用户研究（批十七选题）｜ **成员**：瑞思
**方法**：实读批十六四研究（瑞思／竞析／数析／路线图 §4.6「批十七预告」）；**全扫** `src/data/grammarLessons.ts`（20,613 行／110 课，md5 `faa827970c06a0d9512a4e4211d31eb0`）与 `src/data/huntCases.ts`（6,949 行／119 案，md5 `554641ab06b9a08af610a6888ab3cedf`）——状态机跳注释＋引号串提取（GL 19,811 串其中英文 12,411；HC 4,962 串其中英文 4,201），行号→课号／案号映射，raw grep 交叉验证；**BC A1-A2 官方 18 课全目逐条点目**（`/private/tmp/bc-a1a2-new.html` 实读）；Murphy 初级／中级 TOC 原件实读；封面池二分图最大最小间距实算（非贪心）；`npx vitest run`（**58 文件 721 项全绿**）。

**三处对给定背景的校正（实读优先）**：
1. **测试基线不是 57／714**——工作区实跑 **58 文件 / 721 项全绿**（Duration 6.69s）。批十六路线图记 685（交付前），L103–L110＋8 案落地后自然增长；**批十七立项基线按 721 写**。
2. **L66 确认已教 `too...to`**——`It is too heavy to carry.`（L66 `:12101` target、`:12098` dialogue），GL 命中 44 处；**不是空白，是批九旧账，勿重开**。
3. **批十六路线图 §4.6 的「A2 之后走什么」前提须修正**——本轮用 **BC A1-A2 官方 18 课全目逐条点目**，实测**尚余 4 处课程位空缺**（§1 ①）。批十一「A2 结构收官」宣告**不完整**：**批十七的正面答案不是「跳 B1」，是「先把 A2 关账」**。

## 0. 结论先行

**推荐乙·A2 收尾缺口补课章 8 课（L111–L118，单拱）**——章题「**我一直想说的那些**」，把 BC A1-A2 官方 18 课点目后剩下的**四处真课程位缺口**（物主 `'s`／形容词挂门牌／-ed·-ing 分工／几个一点点）＋`have got` 换挡两课＋收口一课，一次把跨源 A2 课程位补齐。
**备选甲·B1 开局章 6 课（L111–L116，单拱）**——`be/get used to` 3 课＋`have sth done` 2 课＋收口 1 课。**B1 段确有两源课程位**（BC B1-B2 有 `Different uses of 'used to'` 专课，原文即「`I used to drive on the left` vs `I'm used to driving on the left`」），**但我方 `used to` 已被 L93＋L100＋两案打得很深，且 `to` 后面接 `-ing` 与既有「to 后面永远穿原样」（L93 `:17294`）正面冲突**——认知负荷与话术风险双高，**建议列批十八首选**。

**一句话取舍**：乙的四处缺口**全部有 BC A1-A2 官方课位背书**（跨源位置＝**A 档**，非「词典型·中文需求驱动」），且**零件几乎全在库**（L8 `:1350` 小标签、L67 `:12295` 门牌话术、L1 `:90` be＋形容词平台、L30 `:5389` 数得清／数不清）；甲的两处是 **B1 段**，虽有课位但**认知负荷高＋词架不足**（详见 §1 ⑦）。

| 关键判断 | 裁决 | 理由 |
|---|---|---|
| 「A2 之后走什么」该正面回答吗？ | **该；答案是「先关账」** | BC A1-A2 官方 18 课逐条点目：**尚余 4 处课程位空缺**（§1 ①），**跨源 A2 并未真正闭环** |
| 这 4 处是什么档？ | **A 档（跨源官方课位）** | BC A1-A2 索引 18 课**逐条在册**：`Possessive 's`／`Adjectives and prepositions`／`Adjectives ending in '-ed' and '-ing'`／`Quantifiers: 'few', 'a few', 'little' and 'a bit of'`；Murphy 初级亦各有独立单元（U64／U112／U84）——**非批次十一型（中文需求驱动），不得与「词典型」混述** |
| 丙（have sth done）能升 B1 吗？ | **能，但不进本批** | `will have` **全库 0**；`cut`／`fixed`／`painted`／`repaired`／`checked`／`built`／`paid`／`given` 等**及物 PP 全 0**（§1 ⑦）——**词架不足，强行做即一课注水** |
| 丁（be/get used to）能进本批吗？ | **能，列备选** | 两文件 **0**＝真空白＋BC B1-B2 课位在册；**但同形隔离成本高**（`used to` GL 113 处已两课两案），且 `to + -ing` 与 L44 `:7997`／L93 `:17294`「to 后面永远穿原样」冲突 |
| 戊（机制强化）／己（look like） | **均不做** | 戊：boost 三档＋回马枪全量落地且有测试守门（批十六路线图 `:189` 明判「无增量空间」）；己：`look like` GL **仅 1 处**（L49 `:8909` 天气义），BC 直标 **B1-B2**，中文侧零专文——**三度三缺**，维持认读 |

## 1. 关键发现（实读证据）

**① BC 官方 A1-A2 索引共 18 课，逐条点目后我方尚余 4 处课程位空缺（本轮最重要发现）**。索引逐条实读（`bc-a1a2-new.html`，`Read more about … N Log in` 抽取恰 18 条）：`Adjectives and prepositions`／**`Adjectives ending in '-ed' and '-ing'`**／`Articles: 'a', 'an', 'the'`／`Articles: 'the' or no article`／`Comparative adjectives`／`Infinitive of purpose`／`Nouns: countable and uncountable`／`Past continuous and past simple`／**`Possessive 's`**／`Prepositions of place`／`Prepositions of time`／`Present simple`／**`Present simple: 'have got'`**／`Present simple: 'to be'`／**`Quantifiers: 'few', 'a few', 'little' and 'a bit of'`**／`Question forms`／`Using 'there is' and 'there are'`／`Verbs followed by '-ing' or infinitive`。
**逐条对账（我方实读）**：14 条已覆盖（Articles→L8／L30；Comparative→L17／L31；Infinitive of purpose→L44；countable/uncountable→L30；Past cont vs past simple→L99；Prepositions of place／time→L18／L79–81；Present simple→L25；to be→L1／L2／L7；Question forms→L27；there is/are→L26；Verbs followed by -ing or infinitive→L42／L45／L46）。**空 4 条**＝§② 物主 `'s`／§③ 形容词挂门牌／§④ -ed·-ing 分工／§⑤ 几个一点点——**前两条是「半曝」，后两条是「彻底零」**。

**② 物主 `'s`（BC A1-A2 第 9 课）＝半曝，且是唯一一处「课程几乎零、话术零」**：全库 `'s` 形态 221 处，**逐条剥离缩写后**只剩 **2 处名词所有格**——L56 `:10222` `Grandma's birthday is in October.` 与 `:10278` `Grandpa's birthday is in October.`（**同一课 examples＋sceneSwings 各一次，从不作 target、不进 practice、不作对比卡**）；其余全是缩写（`It's` 142／`Let's` 58／`Who's` 12＋`who's` 7／`That's` 1）与**故意作干扰项**的 `wind's`（L88 `:16368` options）／`It is's`（L87 `:16220` options）。
**HC 侧 3 处半曝**（`#15 :687` `"grandma's"`／`#42 :2636` `"teacher's,"`／`#65 :4121` `"Dad's"`）——**全是 tokens 里的正确形态，从不作错点、不作考点**：**案件里出现过 3 次、课程里从没正面对待**，是典型的**半曝转正**。
**中文负迁移**：中文「奶奶的生日」与「我的生日」共用一套「的」，**英语分两套**（人＋`'s` vs 小标签 my）；学生最常错出 `*the birthday of Grandma`（中文「的」直译 of）与 `*Grandma birthday`（漏撇号）。

**③ 形容词挂门牌（BC A1-A2 第 1 课）＝半曝（一员已在库，家族未开）**：BC 页原文即「adjectives with prepositions like **interested in** or **similar to**」；Murphy 初级 **U112 `afraid of…, good at… etc. of/at/for etc. (prepositions)`**＝**独立单元**。
**我方实读**：`good at` GL **52 处**（L67 `:12289` target `I am good at drawing.`）——**但这只是一员**；`interested`／`afraid`／`similar`／`full of`／`proud of`／`worried about`／`ready for`／`late for` **GL＋HC 全 0**。
**接口现成得罕见**：L67 `:12295` oneLineRule＝「**at 是它的门牌，门里穿名字版**」；L67 `:12362` deepDive 明文「**第 18 课认识过 in / on / at 三块门牌**」；L67 `:12365` 明文「**英语的门牌房里，擅长只认 at**」（**只讲了一员，家族留着没开**）。**这是 L67 自己指的方向**。
**中文负迁移**：中文「在…方面很好／对…感兴趣」的那个「**在／对**」是中文思维——L67 `:12365` 已明文点破（「那个『在』是中文的思维」），**本课是把这条原则从一员扩到一族**。

**④ `-ed/-ing` 形容词（BC A1-A2 第 2 课）＝真空白，且是「先考后教」倒挂**：GL `bored`／`boring`／`interested`／`exciting`／`excited`／`amazing`／`relaxing`／`surprised`／`surprising` **全 0**；`interesting` GL **1**（L17 `:3059`，仅在「长形容词请 more 帮忙」的例子里一闪）；`tiring` GL **1**（**L92 `:17188`**，**只作 distractor，从不作正解**）；`tired` GL **87**（L1 `:90` 起，是「累」的**常用形容词**，不是本课要教的「-ed 感觉版」）。
**HC 侧 `excited` 半曝 8 处**：`#16 :771` `excite→excited` 单 token 修、`#17 :826` `We were very excited`（缺 be）——**案件里已经考过，课程里从没教过**：**全库少见的「先考后教」倒挂，批十七必须转正**。
**跨源分级须诚实标注**：BC 在 **A1-A2**（官方课位），**Murphy 却在中级 U98 `Adjectives ending in -ing and -ed (boring/bored etc.)`**——**两源对同一语法点的分级不一致**（§7 待复核 ⑤），**不得混述为「A2 双证」**。
**中文负迁移**：中文「无聊」一个词管两头（「这书很无聊」＝boring／「我很无聊」＝bored）——**中文没有 -ed/-ing 这层区分**，这是**跨语言的真缺口**，不是复习。

**⑤ `few / a few / little / a bit of`（BC A1-A2 第 15 课）＝真空白**：`a few`／`few`／`a bit of`／`a bit` **GL＋HC 全 0**；`a little` GL **1**（L70 `:12871` `I am a little thirsty.`——**仅在对白里露过一次**，从未作教学目标）。对照 L30 `:5389` oneLineRule 明文「「一些」：好好说的时候用 some……**数得清的用 many，数不清的用 much**」——**`a few`／`a little` 正是这一课的下一格**（`many ↔ a few`、`much ↔ a little` 天然对位）。Murphy 初级 **U84 `(a) little (a) few`**＋**U83 `a lot much many`**＝独立单元。
**中文负迁移**：中文「没几个」与「有几个」靠一个字（没／有）区分，英语靠 **a 的有无**（`few`＝不够／`a few`＝有一些）——**中文没有「a 定生死」这层机制**。

**⑥ `have got`（BC A1-A2 第 13 课）＝真空白**：`have got`／`has got`／`I've`／`'ve`／`'s got`／`got a` **三形态两文件全 0**。跨源：BC A1-A2 `Present simple: 'have got'`（官方课位）＋Murphy 初级 **U9 `I have and I've got`**（独立单元）。
**但须诚实标注**：我方 L3 `:435` 已教 `have + a`（拥有义，target `I have a new bag.`）、L16 `:2816` 已教 `have to`（必须义）——**`have got` 是同一功能的「口气更轻」版**，属**说法换挡**而非新结构；**增量＝「一个词 vs 两个词」与缩写 `'ve`／`'s`**，认知负荷低，但**增量性质是「说法扩充」非「新能力」**（诚实标注 **C+ 档**，**不作独立章主锚**）。
**中文负迁移**：中文只有「有」一个字，学生容易**在 got 后面再补动词**（`*I have got a bike is nice.`）或**与完成时混**（把 `have got` 读成「已经得到了」——**这正是 Cambridge `have something done` 页明文警告的 "not the same as the present perfect" 同款混淆**）。

**⑦ 丙 `have sth done` 的致命伤＝过去分词词架只剩两条可用**：`have/has/had ＋ 物主 ＋ 名词` 全库**仅 1 处**（L23 `:4103` `Don't worry. I have my key here.`＝纯拥有义，非使役）；`will have` **0**（唯一 `will be` 在 L12 `:2087`）；使役 `have ＋ 宾格 ＋ 动词` 86 处**全在 L21–L24 完成时（`Have you finished…`）与 L107 使役**（已教）。
**过去分词词架实测（GL＋HC 双文件，raw grep）**：**零覆盖 40 个**——`cut`／`fixed`／`repaired`／`painted`／`checked`／`built`／`paid`／`given`／`held`／`sent`／`sold`／`told`／`thought`／`won`／`shown`／`driven`／`chosen`／`spoken`／`stolen`／`thrown`／`understood`／`worn`／`hurt`／`caught`／`brought`／`taught`／`felt`／`spent`／`lent`／`hung`／`shut`／`cost`／`hit`／`set`／`swept`／`dug`／`fought`／`stood`／`drunk`／`kept`。**可用的只有**：`cleaned`（GL 127／HC 16，L51／L53 被动厚）、`broken`（GL 79／HC 15）、`done`（GL 48）、`eaten`（GL 64）、`taken`（GL 34）、`written`（GL 13）、`seen`（GL 31）、`left`（GL 11）、`put`（GL 82）、`read`（GL 201）——**`made` GL 74 但全为「做」义，不入此表**。
**结论**：「我剪了头发」的 **`cut` 是零**、`hair` **GL 0**（`chair` 15 是椅子，勿误记）——**丙的招牌句在库里连词都没有**；勉强做只能用 `cleaned my room`，**与 L23 `I haven't cleaned my room.` 高度重叠＝重复**。**判：不进本批**。

**⑧ 封面单次池已彻底枯竭（0 张），只能二用升三用**：49 张封面共用 **110 次**；**单次池 0**（41／45／47／48 已被 L103–L106 吃掉：`cover41→:19114`／`cover45→:19301`／`cover47→:19488`／`cover48→:19675`）；**二用池 37 张**（1,2,3,4,5,6,7,8,11,13,14,15,22,23,24,25,27,28,29,30,33,34,35,36,37,38,39,40,**41,42,43,44,45,46,47,48**,49——**后 8 张即批十六刚二用的，仍属二用**）；**三用池 12 张**（9,10,12,16,17,18,19,20,21,26,31,32）。**二分图最大最小间距实算（精确最优，非贪心）**：8 课最优**最小间距 35**；6 课 35、7 课 35（**本轮实算值与数析批十六的「纯二用 32」不同——因 41/45/47/48 已升二用，池面变宽，故最优值上抬**）。**指派（8 课）**＝`L111←cover29`（36）／`L112←cover42`（35）／`L113←cover25`（35）／`L114←cover7`（38）／`L115←cover2`（35）／`L116←cover3`（35）／`L117←cover4`（35）／`L118←cover1`（39）。**`cover49` 仍禁用**（两段间距仅 9：L49 `:8889` 与 L58 `:10586`）。

**⑨ 案号与罪名承载**：119 案连续 1–119、`reviewed` 全真；**下号 #120**。每案错点分布 `{2:10, 3:10, 4:96, 5:2, 6:1}`——**4 错为主流**。**罪名承载（450 错点）**：`verb_form` **103**／`plural` **80**／`sv_agreement` **61**／`preposition` **56**／`word_order` **40**／`tense` **36**／`article` **24**／`missing_be` **22**／`run_on` **14**／`fragment` **14**。
**最薄两条的最近使用**：`fragment` 最后 10 案 ＝ #28/48/49/50/75/89/99/100/101/**103**；`run_on` 最后 10 案 ＝ #18/27/28/40/100/101/**103**/107/110/**111**——**两条在批十五（#103）与批十六（#111）刚用过**，**本批不宜再连续同型**。**`comparison` 不在 10 枚举内**（`huntService.ts:331-342` 实读枚举确认），**绝不碰**。

**⑩ 展示层与基建**：`grammarSeasons.ts:50` 末项 **season-16 `{103,110}`**；`GrammarPathPage.tsx:241` 里程碑末项 **m18 `afterLesson: 110`**——**无 season-17、无 m19**；`grammarSeasons.test.ts` 4 项守门（含**「最高课号被覆盖」硬断言**——**不落 season-17 则该测试先红**）；`huntService.test.ts:215` 硬断言番外恰 5 案（`hunt-white-cat`／`hunt-sports-day`／`hunt-pen-pal-letter`／`hunt-fridge-note`／`hunt-term-review`），`:109` 断言 `tagStats` 恰 10 项——**新案不得替代或删改**。episode 止「小美的一天 一百一十」（`:20421`）。

**⑪ cloze 词表（实读 `grammarAmbushService.ts:160-193`）**：`GRAMMAR_WORDS` **169 唯一**（批十六数析记「146 唯一」——**口径差异，本轮按源码逐字抽取，以 169 为准**，§7 待复核 ⑥）；`CLOZE_STOP_WORDS` 30 条（`:190`）。**对本批候选的落点预判**：`few`／`little`／`a bit of`／`got`（作 `have got` 义）／`bored`／`boring` 等 **均不在表内**（`have` 在表内、`got` 在表内但是「get 的过去版」）。→ **本批 cloze 必须逐课实跑并写保障句**（详见 §6-3）。

**⑫ G-boost 护栏的现行实现**：实读 `grammarBoostService.ts:544-545`——`tokens.findIndex((token) => token === spotStep.wrongToken || cleanWord(token) === cleanWord(spotStep.wrongToken ?? ""))`。**注意：本轮实读该处已带 `cleanWord` 兜底**（与批十六数析 §4 记「`:502` 纯 `===` 严格匹配」不同）——**L96／L102 的 `wrongToken` 缺陷应已随工作区修复落地**（批十六瑞思 §0 已记此校正）。**本批仍按最严口径写规格**：`wrongToken` 与 token 逐字相等、不依赖兜底。

## 2. 主题分析表

| 主题 | 缺口真实性／频率×痛感 | 证据（行号） | 判定 |
|---|---|---|---|
| T1 物主 `'s`（奶奶的生日） | **半曝转正（BC A1-A2 第 9 课位）／极高**：中文「的」最高频 | GL 剥离后仅 2 处（L56 `:10222`／`:10278`，均非 target）；**HC 3 处半曝**（#15 `:687`／#42 `:2636`／#65 `:4121`，全为正确 token） | **进 L111**（章首） |
| T2 形容词挂门牌（`interested in`／`afraid of`） | **半曝（BC A1-A2 第 1 课位＋Murphy 初级 U112）／高** | L67 `:12295` 门牌话术＋`:12362`「三块门牌」＋`:12365`「门牌房里擅长只认 at」；`interested`/`afraid`/`similar`/`full of` **全 0** | **进 L112**（L67 直系扩员） |
| T3 `-ed/-ing` 形容词（我很无聊 vs 这书很无聊） | **真空白（BC A1-A2 第 2 课位）／极高**：日常情绪第一梯队 | GL 全 0；`interesting` L17 `:3059`；`tiring` L92 `:17188`（**仅 distractor**）；**HC `excited` #16 `:771`／#17 `:826`（先考后教倒挂）** | **进 L113**（必须转正） |
| T4 `few / a few / little / a bit of` | **真空白（BC A1-A2 第 15 课位＋Murphy 初级 U84）／高** | `a few`/`few`/`a bit of` 全 0；`a little` L70 `:12871` 孤例；L30 `:5389` 明文铺台阶 | **进 L114**（L30 下一格） |
| T5 `have got`（口气更轻的「有」） | **真空白（BC A1-A2 第 13 课位＋Murphy 初级 U9）／中高**（增量＝说法换挡） | `have got`/`has got`/`'ve`/`'s got` **三形态全 0**；L3 `:435`；L16 `:2816` | **进 L115–L116**（诚实标注 C+ 档） |
| T6 `be used to / get used to` | **真空白（BC B1-B2 课位在册）／高** | 两文件 0；`used to` GL 113（L93 `:17211`／L100 `:18538`） | **备选甲（不进本批）**：同形隔离成本高＋`to + -ing` 与 L44 `:7997`／L93 `:17294` 冲突 |
| T7 `have sth done` | 空白但**词架不足**／中 | `have+物主+名词` 仅 L23 `:4103`；`will have` 0；**`cut`/`fixed`/`painted`/`given` 等 40 个 PP 全 0**（§1 ⑦） | **备选甲（不进本批）** |
| T8 散点：`so that`／`as soon as`／`neither`／`either`／`would rather`／`such`／`the same as`／`both`／`already`／`yet`／`none`／`still`／`each other`／反身代词 | **真空白但无共同语义场**／中低 | 逐个实测：`so that` 仅 L102 `:18943` `So that was last night!`（**「那么」义，非目的连词**）；`already` GL 仅注释 1 处；`still` GL 仅 L56 `:10349`（月份说明）；其余 **全 0** | **均不进**：与批十五 §1-3 同一判定——**无共同语义场与场景锚，强凑即稀释一课一增量** |
| T9 `look like` | 素材近零／低 | GL **1**（L49 `:8909` 天气义）；BC **B1-B2**；中文零专文（三度确认） | **维持认读**（三度三缺） |
| T10 机制强化（boost 三档／回马枪） | 无增量空间 | 批十六路线图 `:189` 明判「已饱和且有守门」 | **不做** |
| T11 `mine / yours / one / ones` | **已教，非缺口** | L33 `:5931` target `This one is mine.`；`:5937` oneLineRule「『我的（东西）』是 mine」；`:5940` `That one is yours.` | **不进**（**本轮校正：一度误判为缺口的 `mine` 实为 L33 已教**） |

## 3. 四方案对比表

| 维度 | 甲 B1 开局（used to 三脸＋have sth done） | 乙 A2 收尾缺口重排（推荐） | 丙 散点补漏（so that／neither／already 等） | 丁 混合（乙 6＋甲 2） |
|---|---|---|---|---|
| ① 缺口真实性 | **高**：`be/get used to` 两文件 0＋BC B1-B2 课位；`have sth done` 词架零 | **最高**：4 处缺口**全部 BC A1-A2 官方课位**（§1 ①） | 中：全 0 但**无共同语义场** | 高（乙＋甲） |
| ② 频率×痛感 | 高（「习惯」是高频话题，「剪头发」稍窄） | **极高**（中文「的」＋情绪＋「有」＋一点点，全在日常最前线） | 低中（散点，学生很少主动说） | 极高 |
| ③ 认知负荷 | **高**：每课都要新造「-ing 名字版做 to 的宾语」，且与 L93 `:17294` 正面冲突 | **低**：4 处全是既有平台的**同格扩充**（L8 `:1350` 小标签／L67 `:12295` 门牌／L1 `:90` be＋形容词／L30 `:5389` 数得清） | 中低但无递进 | 中高（跨段切换） |
| ④ 体系衔接 | 中：接 L93 `:17211`／L100 `:18538`；但需**反着说**（推翻「to 穿原样」） | **最强**：L8 `:1350`→L111；L67 `:12295`/`:12362`/`:12365`→L112；L1 `:90`→L113；L30 `:5389`→L114；L3 `:435`／L16 `:2816`→L115–L116 | 弱（无共同底座） | 强（两段各自强） |
| ⑤ 红线兼容 | 干净（`tense`／`verb_form`／`sv_agreement`） | **干净**：`word_order`（`'s` 位置）／`preposition`（门牌用错 of→at）／`verb_form`（-ed/-ing 混）／`article`（a few 的 a）／`missing_be`／`sv_agreement` | 干净但承载薄 | 干净 |
| ⑥ 容量（6–8 课） | **5–6 项**（used to 3＋have sth done 2＋收口 1），8 课必注水 | **8 项**（4 缺口×2 课深化＋1 收口），**天然 8 课** | 撑不满 | 8（乙 6＋甲 2） |
| ⑦ 形态风险 | **高**：同形三张脸（`used to`／`be used to`／`get used to`）＋推翻既有话术 | **低（单拱干净）**：全挂在「说身边那点事」一条线上；**唯一风险是 `have got` 增量偏薄**（诚实标注） | — | **双拱须明写**（批十四刚双拱、批十六单拱，连做即连续第四个大章） |
| 跨源位置／判读 | **A-（BC B1-B2 课位）**／⚠️ 备选 | **A（BC A1-A2 官方课位四条在册）**／✅ **推荐** | **C+**／❌ 不做 | B／⚠️ 次选 |

**不是丁**：甲的 2 课（used to 三脸）在乙方案里**没有落点**，硬拼成双拱既要背双线代价、又要担 `to + -ing` 的话术冲突——**与批十六「丁与甲实质等同却要背双线代价」同一逻辑**（批十六瑞思 §3）。**乙不缩 6 课**：4 处缺口×2 课＝8 项，砍任一处都掉到 6，「形容词挂门牌」「一点点」各有独立口语缺口，**非注水**。

## 4. 大章节设计方案（推荐 · 8 课 L111–L118）

**章题「我一直想说的那些」**——单拱，一条「**说说身边的人和事**」线：家里的人（L111）→ 心里的感觉（L112–L113）→ 桌上的东西有多少（L114）→ 手里的东西哪来的（L115–L116）→ 串成一段（L117）→ 收口（L118）。

| 课 | 主题 | 增量（只此一点） | 目标句（≤8 词） | 接口／复现 | 案与罪名（#120–#127） |
|---|---|---|---|---|---|
| **L111** | 奶奶的生日 | **物主 `'s`**：人后面加撇号 s，「谁的」贴在东西前 | `Grandma's birthday is in May.` | L56 `:10222`（孤例转正）·`:10278`；L8 `:1350` 小标签；HC #42 `:2636` 半曝 | `hunt-grandmas-birthday`：word_order＋preposition（旧：L10 昨天版） |
| **L112** | 我对画画感兴趣 | **形容词＋门牌**：`interested in`（一员→一族起步） | `I am interested in drawing.` | L67 `:12295` 门牌话术·`:12362` 三块门牌·`:12365`「只认 at」 | `hunt-interested-in`：preposition＋verb_form（旧：L25 三单） |
| **L113** | 我很无聊 | **`-ed/-ing` 分工**：-ed 说「我感到」、-ing 说「它让人」 | `I am bored.` | L1 `:90`（be＋形容词平台）；**HC #16 `:771`／#17 `:826` 转正** | `hunt-bored-boring`：verb_form＋missing_be（旧：L19 was/were） |
| **L114** | 只剩几个了 | **`a few / few / a little`**：a 在不在，意思反一半 | `There are a few apples.` | L30 `:5389`（some/any/much/many 下一格）；L70 `:12871` 孤例转正 | `hunt-few-apples`：article＋plural（旧：L11 复数） |
| **L115** | 我有一辆新自行车 | **`have got`**：「有」的轻口气版（我／你／我们） | `I have got a new bike.` | L3 `:435`（have＋a）；L26 `:4636` there is | `hunt-have-got-bike`：verb_form＋article（旧：L10 昨天版） |
| **L116** | 她有一个新书包 | **`has got`**：他/她/它版（换人换形） | `She has got a new bag.` | L115 直系；L25 `:4460` 小尾巴 | `hunt-she-has-got`：sv_agreement＋verb_form（旧：L19 was/were） |
| **L117** | 我一直想说的那些（串一串） | **四种说法合体**：`'s`／门牌／-ed·-ing／`a few`｜`have got` 排一行 | 复现混排，逐句 ≤8 词 | L111–L116 各 1 句 | `hunt-all-i-wanted`：verb_form＋preposition（旧：L10 昨天版） |
| **L118** | 我一直想说的那些（收口） | **零新知**：七课各 1 句＋一张总表卡 | 复现混排，逐句 ≤8 词 | 先例 L54 `:9823`／L78 `:14362`／L94 `:17400`／L102 `:18919`／L110 `:20418` | `hunt-close-17`：全回流、不新增错型 |

**8 项校验**：L111 `'s`／L112 门牌／L113 -ed·-ing／L114 一点点／L115 have got／L116 has got／L117 合体／L118 零新知——**每项独立、互不重叠**；去掉任一项即掉到 7。
**一课一增量纪律**：L111 只教「人＋`'s`」（**不碰 of 结构**）；L112 只教「门牌从 at 扩到 in」（**不碰 -ed/-ing**）；L113 只教 **-ed 与 -ing 的分工**（**不碰其他形容词**）；L114 只教 **a 的有无**（**不碰 L30 已教的 some/any/much/many**）；L115 只教 **have got**（**不碰 has got**）；L116 只教 **has got 的换形**（**不碰 have got**，L115 已教）。
**封面**（纯二用升三用，最优最小间距 **35**）：`L111←cover29`／`L112←cover42`／`L113←cover25`／`L114←cover7`／`L115←cover2`／`L116←cover3`／`L117←cover4`／`L118←cover1`。**`cover49` 禁用**（间距 9）；**批十五刚三用的 10/16/18/20/21/26/31/32 本批勿碰**。

## 5. 中文负迁移专项（逐课）

| 课 | 典型中式错句 | 承载罪名 | 设计含义 |
|---|---|---|---|
| L111 | `*Grandma birthday is in May.`（漏撇号） | **word_order**（最贴） | **头号错**；**复用 L8 `:1350`「小标签」并升级**：「**人后面加个撇号 s，就是『谁的』**」 |
| L111 | `*The birthday of Grandma is in May.`（中文「的」直译 of） | preposition | **只作 1 张对照卡**（`of` 结构超 A2，**不主打**，与 L112 门牌课分工） |
| L112 | `*I am interested at drawing.`（拿 L67 的 at 去套所有人） | **preposition** | **本课真考点**：**门牌一家一员，得跟着词走**（interested 认 in、good 认 at）——**正面接 L67 `:12365`「门牌房里擅长只认 at」** |
| L112 | `*I am interested in draw.`（门牌后面漏名字版） | verb_form | 复用 L67 `:12312`「门牌后面穿名字版」 |
| L113 | `*I am boring.`（想说「我很无聊」说成「我很没意思」） | **verb_form** | **头号错＋本课唯一考点**：**-ed 说「我感到」、-ing 说「它让人」**；**中文「无聊」一个词管两头，这层区分中文没有**——话术用「**感到版／让人版**」，**全禁「形容词」「分词」** |
| L113 | `*I bored.`（漏 be，直译「我无聊」） | missing_be | 复用 L1 `:87`「固定搭档」；**HC #17 `:826` 同型回流呼应** |
| L114 | `*There are few apples.`（想说「有几个」说成「几乎没几个」） | **article**（a 丢失） | **本课真考点**：**a 在不在，意思反一半**；话术「**a 是『有一点点』的小招牌，丢了就变成『几乎没』**」 |
| L114 | `*I have a few money.`（可数不可数不搭） | plural／article | 接 L30 `:5389`「数得清／数不清」——**`a few` 只跟数得清的，`a little` 只跟数不清的** |
| L115 | `*I have got a bike is nice.`（got 后面又接动词） | verb_form（**不选 run_on／fragment**） | 「`have got` 是一个整体，就是『有』——后面直接跟东西」；**`run_on`／`fragment` 批十五 #103 与批十六 #111 刚用过，本批避开**（§1 ⑨） |
| L116 | `*She have got a bag.`（漏三单） | **sv_agreement** | 「他/她/它版是 **has got**」——复用 L25 `:4460` 小尾巴；**本课唯一考点** |
| L116 | `*She's got a bag.` 读成「她已经得到了一个包」 | verb_form | 对照 L21 `:3729` 完成时：**`have got` 不是「已经得到」**（Cambridge `have something done` 页同款警告）；放 1 张 bothRight 卡 |
| L117 | 混排以 verb_form／preposition 为主 | 全落 10 枚举 | **不新增错型** |
| L118 | 全回流 | 全落 10 枚举 | **零新知**：四点分别锚 L111／L113／L114／L116 |

**须写进规格**：**`*I am boring.` 是「真错」第一名**（中文「无聊」无 -ed/-ing 之分）——**L113 的 3 条对比卡全部围绕它**（`I am bored.` ✅ vs `I am boring.` ❌＋`The book is boring.` ✅），一次打透；**`*I am interested at drawing.` 是第二名**（把 L67 的 at 过度泛化）——**L112 的 3 条对比卡围绕它**。

## 6. 体验建议

1. **场景锚**：一条「**说说身边的人和事**」线——开场就说「**奶奶的生日在五月**」（家里挂历前的熟场景，接 L56 `:10208` `sceneSetupZh`），L112–L113 转「**我对画画感兴趣／我很无聊**」（美术课后／课后沙发），L114 转「**桌上只剩几个苹果**」（接 L30 `:5384` 同场景），L115–L116 转「**我有一辆新车／她有一个新书包**」，L117–L118 回到「**这些我都想说出来**」。**不跨场景跳**。
2. **零术语话术**（沿用课程自建体系；全禁「形容词／分词／名词所有格／可数不可数／助动词／时态／词性／介系词」）：
   - **L111**：复用 L8 `:1350`「**小标签**」——「my／her 是小标签，永远贴在东西前面」；**新增**「**人后面加个撇号 s ＝ 谁的**」（Grandma's）。
   - **L112**：复用 L67 `:12295`「**门牌**」＋`:12362`「**三块门牌 in/on/at**」；**新增**「**门牌一家一员：interested 认 in、good 认 at——跟着词走，别自己换**」。
   - **L113**：**新增**「**感到版／让人版**」——「**-ed 是『我感到』、-ing 是『它让人』**」（**全禁「形容词」「分词」**）。
   - **L114**：复用 L30 `:5389`「**数得清的／数不清的**」；**新增**「**a 是一块小招牌：有它＝有几个，没它＝几乎没**」。
   - **L115／L116**：复用 L3 `:442`「**说『我有什么』用 have**」＋L16 `:2816`「have to 是不得不」；**新增**「**have got 就是『有』的轻口气版，一个词变两个词**」；L116 复用 L25 `:4460`「**他/她/它加个小尾巴**」→「**has got**」。
   - **跨批钩子兑现（第四次）**：L111 引 L56 `:10222`；L112 引 L67 `:12295`／`:12365`；L113 引 **HC #16 `:771`（首次「案件回流课程」）**；L114 引 L30 `:5389`；L115 引 L3 `:442`；L116 引 L25 `:4460`。
3. **cloze 保障**（硬项，本批风险最高——§1 ⑪ 已证候选词多不在表）：`few`／`little`／`a bit of`／`bored`／`boring`／`got`（作 `have got` 义）**均不在 `GRAMMAR_WORDS`**（169 唯一）→ **L113／L114／L115 必须各写 ≥1 句保障 variant**，让主考点落在表内词上（如 L115 保障句可落 `have`／`got`；L113 保障句可落 `am`／`not`）；**8 课逐课实跑并核验「variants ≥1 句让主考点落空」**（沿用批十六 §6-3 纪律）。
4. **时长与护栏**：6–8 分钟／课；**目标句 ≤8 词**；`arrange` ≤3–8 token；**每课 ≥1 复现题**。**G-boost**：每课 `contrast` **≥2 条带 `wrongMark` 且可定位**（**推荐 3、禁止贴线**）；`wrongMark` **不得为标点**；**`guided.spot` 的 `wrongToken` 必须与 `tokens` 元素逐字相等（不带尾标点）**——`grammarBoostService.ts:544-545` 虽有 `cleanWord` 兜底，**仍须按最严口径写规格、不依赖兜底**。
5. **封面与展示层**：8 张**纯二用升三用**（§4 表）；**池外零新资产**。**season-17 `{111,118}`＋m19（afterLesson 118）随批上线**——不落则 `grammarSeasons.test.ts`「最高课号被覆盖」先红；m19 达成句「**我能说清身边的一件件事**」（样本句 `Grandma's birthday is in May.`／`I am interested in drawing.`／`I am bored.`）。
6. **episode 写法**：「小美的一天 一百一十一」…「一百一十八」（**>100 已有 2 例先例**——L103–L110 的「一百零三…一百一十」，无格式风险）。

## 7. 后续研究建议

**假设待验（推断）**：① **「感到版／让人版」话术是否接得住「我很无聊」**（本批最大未知——中文一个词管两头，学生能否一次分清 `bored`／`boring`；建议 L113 后加中段自走查）；② **`have got` 的增量是否被感知为「没必要学」**（同义换挡，须在走查盯「学完仍只用 have」）；③ **`'s` 与 `of` 的互扰**——教了 `Grandma's` 后学生是否反过来错出 `*the birthday of Grandma`；④ **`a few` 的 a 丢失率**是否真高于 `a` 的其他用法（若不高，L114 增量须再评估）；⑤ **门牌家族扩员是否引发 `interested at` 型过度泛化**（L112 最大风险——L67 只教了 at 一员，扩到 in 时学生可能反向套错）；⑥ **连续第五个大章节的疲劳**——F13-B–F16-B 均未关账，判据尚无数据。

**待复核（数析）**：① 8 课 cloze **逐课实跑**（尤其 L113 `bored`／L114 `few`／L115 `got` 三处不在表内，须保障句）；② 8 案（#120–#127）能否**避开批十五 #103／批十六 #111 的 fragment／run_on**（§1 ⑨）并带上 `article`（24，最薄档之一）；③ 封面 8 张**语义核对**（本轮按**编号间距**实算最优，**未做图像语义核对**）；④ 基线按 **721**；⑤ `grammarSeasons.ts:50` 后追加 season-17 的 4 项守门验证；⑥ **cloze 词表口径**——本轮实读 169 唯一，批十六数析记 146 唯一，**差异未查明**。

**待复核（竞析）**：① **四处缺口的跨源定位**须逐条复核——本轮实读 **BC A1-A2 官方 18 课全目**（`Possessive 's`／`Adjectives and prepositions`／`Adjectives ending in '-ed' and '-ing'`／`Quantifiers: 'few', 'a few', 'little' and 'a bit of'`）；**Murphy 侧实读**：初级 **U64 `'s (Kate's camera / my brother's car etc.)`**、**U112 `afraid of…, good at… etc. of/at/for etc. (prepositions)`**、**U9 `I have and I've got`**、**U84 `(a) little (a) few`**；② **`-ed/-ing` 分级冲突须裁定**——**BC 在 A1-A2，Murphy 却在中级 U98**（§1 ④），**不得混述为「A2 双证」**；③ 中文侧专文有无（`bored/boring`／`a few`／`have got`／`'s` 四篇）——**未核**；④ `be used to`／`get used to` 的 B1 段证据（BC `Different uses of 'used to'` 页名已实读，**正文待复核**）；⑤ **`have sth done` 的 PP 词架结论须复核**（§1 ⑦ 的「40 个零覆盖」是本轮 raw grep 结果）。

**待主理人裁决**：① **乙 8 课 vs 甲 6 课**（我建议乙——跨源 A 档＋认知负荷低＋零件在库；甲列批十八首选）；② **`have got` 是否值得占两个课位**（增量性质是「说法扩充」非「新能力」，C+ 档——若认为不值，可把 L115／L116 并成一课，乙缩为 7 课，或补入 `be used to` 1 课）；③ **L113 是否与 L1 `:90` 的 `I am happy.` 抢位**（我判不抢：L1 教「be 不能丢」，本课教「-ed/-ing 分工」，但须在 L113 开场显式分工）；④ **批十七是否维持 8 课**（连续第五个大章）；⑤ **`-ed/-ing` 跨源分级表述口径**（BC A2／Murphy 中级，**不得混述**）。

**未核实**：① **无真实遥测**（样本＝1）；② 无「核心 500 词」机检资产，`bored`／`boring`／`a few`／`interested` 是否超纲**无法机检**；③ 8 案错型分布为**预判**；④ 封面**未做图像语义核对**；⑤ 中文侧四篇专文**未核**；⑥ 批十六 L103–L110 的 F16-A 走查与 F16-B 关账**均未回**，本报告的「使役已补齐」前提**未经遥测验证**；⑦ **`grammarBoostService.ts:544` 的 `cleanWord` 兜底是否为批十六修复后版本**——本轮实读带兜底，批十六数析 §4 记纯 `===`，**未核对 git 历史**。

---
> 本研究报告由产品战略团队瑞思执笔，经主理人汇编落盘。重要决策请由产品负责人审定。
