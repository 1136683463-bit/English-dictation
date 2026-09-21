# 数据盘点：第二十二批·候选池盘点（三方向）

**日期**：2026-09-20 ｜ **类型**：实读代码/文件盘点（无数仓）｜ **成员**：数析

**方法**：单遍状态机提取引号内字符串（六态：`code`／`line_comment`／`block_comment`／`dq`／`sq`／`bt`；注释内字符串一律不入账，反斜杠转义按两字符吞掉），再按顶层 `^    number: N,` 切块，得「行号 → 课号（GL）／案号（HC）」映射。**GL 命中 25,051 条串／实词口径 24,770 条**（英文口径 15,620 条）；**HC 命中 5,997 条串／实词口径 5,850 条**（英文口径 4,757 条）。**id 串假阳性单独剔除**（`hunt-xxx-yyy`／`lesson-xxx` 等 kebab 形 ≥ 3 段，共 GL 281／HC 147 条）。**抽词器逐字复刻并实跑**：`grammarAmbushService.ts:160-213`（`GRAMMAR_WORDS` ＋ `CLOZE_STOP_WORDS` 30 词 ＋ 三级回退）与 `grammarBoostService.ts:243-395`（`FUNCTION_WORDS` 33 词 ＋ `keywordIndexes` 长度 ≥3 硬门 ＋ `buildCloze`），**复刻可信度用真服务交叉验证**（`vite-node` 直接 import 真服务，非临时 vitest 探针）：ambush 侧 **10/10 逐字一致**、boost 侧 **5/5 逐字一致**。boost 落点率用 **252 组现实 sourceRef 种子**（7 个形状合理的 lesson-id × 6 题型源 × 6 index）。封面指派用**二分阈值 ＋ 全枚举**（max-min-gap 目标）。**所有断言一律带行号。**

**范围**：批二十二＝**选题未定**，本盘点覆盖**三个方向**：
- **方向 1（A 档复现型大章）**——候选池：`as soon as`／`neither`·`either`·`both`（含 `neither...nor`／`either...or`／`both...and`）／`would rather`／`seem`·`appear`／`the same as`／`shall we`·`why not`·`what about`／`how about`／sensory `like` 扩展／`will have`
- **方向 2（C 档 `have sth done`）**——即批二十一候补清单序 1；本盘点复核其词架
- **方向 3（换轴：读写/听力）**——本盘点给「换轴」的基建现状数据

> **📌 本批盘点的三条结构性事实（先看这三条）**
> 1. **方向 1 的候选池几乎全是「纯零」**——`as soon as`／`neither`／`either`／`both`／`nor`／`would rather`／`seem`／`appear`／`shall`／`the same as` **在 GL ＋ HC 两文件全 0 处**（§1）；`what about` 仅 3 处、`how about` 仅 GL 19＋HC 1、`looks like` 仅 5 处。**这不是「缺口」，是「空地」——造词成本从「补缺口」升级为「开新区」。**
> 2. **方向 1 真正的拦路虎不是造词，是「可生产性」**：复现型大章的**数据判据在本项目全库不存在**——现有 138 课里**每个「大章」只有 1 课收口课，从未有过整章复现**（§3）。**方向 1 的核心风险＝「整章复现」与现有「1 课收口」的形态无法用数据区分。**
> 3. **方向 2 的词架比批二十一记录的更空**：`will have` 0／`cut` 0／`fixed` 0／`haircut` 0／`had my` 0／`checked` 0／`repaired` 0／`have my` **1**（§1.5）。**批二十一记的「`have my` GL 1」经本轮复算确认成立**，且那 1 处（L23 `:4171` `Don't worry. I have my key here.`）**是「我拿着我的钥匙」义，与使役义无关**——**不构成垫子，反而构成同形干扰源**。

---

## 指标概览

| 指标 | 本期（实读·当前态） | 上期（批二十一交付后） | 状态 |
|---|---|---|---|
| 课程 / 案件 / 错点 | **138 课 / 147 案 / 562 错点** | 138 / 147 / 562 | ✅ 与批二十一交付一致 |
| 罪名（错点/承载案） | verb_form **131/87**·plural **102/96**·sv_agreement **89/66**·preposition **62/57**·tense **50/42**·word_order **47/35**·article **29/23**·missing_be **24/20**·fragment **14/13**·run_on **14/12** | 同左 | ✅ 10 项枚举稳定；`comparison` 仍 0（沿用批十八起口径） |
| 封面池 | **117 张用 138 次（单次 96·二用 21·三用 0）**；二用张＝**cover1–cover21**（L1–L21 ↔ L118–L138 两段**严格一一对应**） | 117／138（单次 96·二用 21） | ✅ 与批二十一交付一致 |
| 案号 | max **#147**，1–147 **连续无跳号无重号**；`reviewed` **147/147＝100%** | max #147 | ✅ 下号 **#148** |
| 课号 | 1–138 **连续无跳号无重号** | 1–138 | ✅ 下号 **L139** |
| 基建 | season-21 `{134,138}` 已在位（**21 季**）；m23 `afterLesson:138` 已在位（**23 里程碑**）；episode 止「一百三十八」 | 同左 | ✅ 须续 **season-22 / m24 / 一百三十九** |
| **方向 1 候选池** | **`as soon as` 0/0**·**`neither` 0/0**·**`either` 0/0**·**`both` 0/0（`bothRight` 字段名除外）**·**`nor` 0/0**·**`would rather` 0/0**·**`seem`/`seems`/`seemed` 0/0**·**`appear`/`appears`/`appeared` 0/0**·**`shall` 0/0**·**`the same as` 0/0** | — | 🔴 **几乎全零（§1）** |
| **方向 2 `have sth done` 词架** | **`will have` 0/0**·**`cut` 0/0**·**`fixed` 0/0**·**`haircut` 0/0**·**`had my` 0/0**·**`checked` 0/0**·**`repaired` 0/0**·**`have my` 1/0** | 批二十一记「`will have` 0／`haircut` 0／`repaired` 0／`had my` 0／`cut` 0／`checked` 0／`fixed` 0；`have my` GL 1」 | ✅ **逐条复算全部一致**（§1.5） |
| 测试 | **61 文件 / 799 项全绿**；`tsc --noEmit` **0 错（exit 0）** | 61/798 | ✅ 基线 +1 项（批二十一新增的干扰项断言） |
| G-boost | **67 项全绿**（boost 50 ＋ review 17）；thin（＜2 改错题）＝**0 课**；`wrongToken` 违规 **0**；纯标点 `wrongMark` **0** | 50＋17 | ✅ 四护栏全守 |
| **cloze 落点（本批核心）** | ambush：**25/25 全走第①档或第②档**，其中 **19/25 落 `am/is/are/will/would/shall/had/have/like/about/not/as/look`**；boost：候选位 2–5 个，**目标词可落率 18.7%–52.4%** | 批二十一：ambush 16/16 落 `am/is/are/look/looks/was` | 🟡 **「假友好」在方向 1 略好、在方向 2 与批二十一同样糟**（§5） |

---

## 洞察

1. **方向 1（复现型大章）的候选池不是「有缺口要补」，是「整块空地」——`as soon as`／`neither`／`either`／`both`／`would rather`／`seem`／`appear`／`shall`／`the same as` 两文件全 0 处。** 实读（已剔除 id 串假阳性）：`as soon as` **GL 0／HC 0**、`as soon` **0/0**、`neither` **0/0**、`either` **0/0**、`both` **0/0**、`nor` **0/0**、`rather` **0/0**、`seem`/`seems`/`seemed` **各 0/0**、`appear`/`appears`/`appeared` **各 0/0**、`shall` **0/0**、`the same as`／`same as` **0/0**。**注意一个必然踩的坑**：`both` 在裸 `grep` 下 GL **300** 处——**全部是 `bothRight:` 字段名**（`grep -o -i "both[a-zA-Z]*"` 结果只有 `bothRight` 一种；排除该字段后 GL 0／HC 0）。**裸 grep 会把「裸 `both` 300 处」误报成「在库」**（§1.1）。

2. **方向 1 里唯一「半有」的三项，成本结构各不相同：`how about`（GL 19／HC 1）是唯一有真实教学位的；`what about`（GL 3）是「你呢」义、不是「怎么样」义；`looks like`（GL 5／HC 0）是 L127 的认读种子。** 实读：`how about` **GL 19 处全在 L75**（`:13881`／`:13905`／`:13934`／`:13939`／`:14006` 等，含 `How about going to the park?`），**HC 1 处**（`#84 :5326`）；`what about` **GL 3 处**（L45 `:8230` `I enjoy drawing. What about you?`／L75 `:13910` `What about you?`／L75 `:13914` 讲解「`What about` 是「你呢」（第 45 课）；`How about` 才是「怎么样」」）；`looks like` **GL 5 处**，全部是 **L127 认读种子** `It looks like rain.`（`:8977` L49 首次弱曝／`:23804`／`:23839`／`:23843`／`:23869`，文案写着「今天只认脸，不学新花样——以后再说它」）；`sound like`／`smell like`／`taste like`／`feel like` **四串全 0/0**（§1.2）。

3. **方向 1 的真正拦路虎是「可生产性」而不是「造词」：全库 138 课里没有任何一课的「复现比」达到「整章复现」的量级。** 实读每案 `explanation` 的「回流」标记：**全库 562 条错点里只有 103 条含「回流」（18.3%）**；**「全部错点都是回流」的纯复现案只有 10 案**（#95／#103／#110／#119／#126／#127／#133／#136／#142／#147）；**最近的批二十一 #147 是 4/4 全回流**，而 #143–#146 都是 **2/4**。→ **「复现型大章」若要成立，需要连续多课都达到 #147 那种 4/4 的复现比——本项目从未有过「连续两案全回流」的先例**（#142 与 #147 之间隔了 4 案）。**这是方向 1 最硬的数据风险**（§3.4）。

4. **「复现型章」与「收口课」在数据上无法区分——这是方向 1 的核心风险，而且我找到了判据的缺失点，也找到了唯一可用的近似判据。** 实读：全库 `grammarLabel` 含「收口」的课共 **14 课**（L41／L46／L49／L54／L78／L86／L94／L102／L110／L118／L124／L127／L133／L138），**其中含「零新知」字样的是 9 课**（L78 起）。**任务书列的 9 课（L54／L78／L94／L102／L110／L118／L124／L133／L138）与实读的 14 课不一致**——任务书漏了 L41／L46／L49／L86／L127（L54／L110 两课虽有「收口」字样但**无「零新知」标注**）。**唯一可用的结构性近似判据是「季末位置」**：**14 课收口课 100% 落在所属季的 `max`（末课）**——但**21 季里只有 14 季有收口课，7 季没有**（season-1／2／3／8／9／10／11），**且现状统一是「一季一课收口」，从无「整季复现」**。**另一条判据「首现词数」经实读后失效**：全库 138 课平均 **4.86** 个首现词/课、L90–L138 平均 **2.20**；**零首现词的课有 15 课**（L35／L42／L75／L91／L94／L96／L97／L100／L102／L106／L115／L116／L123／L125／L132），**其中只有 L94／L102 两课在收口名单里**——**而收口课 L41／L78／L133 各有 3 个首现词（高于 L90–L138 均值）**。→ **「零新知」在数据上与「首现词数」不挂钩；收口课的判别只能靠「季末位置 ＋ `grammarLabel` 人写文案」，没有任何结构性字段**。这是方向 1 的核心风险（§3.3／§3.4）。

5. **方向 1 里 `as soon as` 的入伙前景最差：时间家族已把 `when`／`after`／`before`／`until`／`while` 五格占满，且各格都已有专属课与专属案。** 实读：`when` **GL 267 处**（L92 **67**·L97 **53**·L99 **33**·L101 **23**·L102 **18**·L27 20）＋**HC 16 处**（#36／#41／#101／#103／#106／#108／#110／#111）；`after` **GL 167**（L90 **63**·L106 37·L91 21·L94 17·L110 11）＋**HC 10**；`before` **GL 79**（L91 **56**·L92 10）＋**HC 6**；`until` **GL 64**（L109 **60**·L110 4）＋**HC 8**；`while` **GL 86**（L98 **60**·L99 14）＋**HC 10**。**五格合计 GL 663 处／HC 50 处**——**`as soon as` 是第六格，且它同时需要 `as`（GL 70 处，其中 L65 的 `as tall as` 占 61 处）与 `soon`（双 0）**。→ **`as soon as` 的麻烦不是造 `soon` 一个词，而是 `as` 已被「一样」占满（L65 的 61/70＝87%）——`as soon as` 里的 `as` 是第三个意思**（§1.3／§2.1）。

6. **方向 2（`have sth done`）的词架经本轮独立复算**：**`will have` 0/0**（直接 `grep -o -i "will have"` 也是 0）、**`cut` 0/0**、**`fixed` 0/0**、**`haircut` 0/0**、**`had my` 0/0**、**`checked` 0/0**、**`repaired` 0/0**、**`have my` GL 1／HC 0**。**批二十一记录的七项全零 ＋ 「`have my` GL 1」全部复算一致。** 逐句实读那 1 处：`L23 :4171` `"Don't worry. I have my key here."` ——**这是「我拿着我的钥匙」的普通 have 义，与「请人做」的使役义无关**，**既不是垫子也不是干扰源**（学生不会把「我拿着钥匙」和「我剪头发」联想在一起）。**`'ll` 缩写也全 0**：`'ll` 在 GL／HC 各 **0** 处（`grep -o "'ll"` 也是 0）——**整个库里从来没有出现过 `'ll`**（§1.5）。

7. **方向 2 的辅助名词需要新造：`hair` 0／`shoes` 0（GL）／`car` GL 7（L107／L111）／`bike` GL 76（L3／L115–L118，最厚）／`window` GL 159（最厚）。** 实读：`hair` **GL 0／HC 1**；`shoes` **GL 0／HC 6**；`car` **GL 7**（L107 `:19935` 等）；`bike` **GL 76**（L3／L115／L116／L117／L118）；`window` **GL 159**（横跨 L32–L96）。→ **若做 `have sth done`，`bike`（76 处）与 `window`（159 处）是最省成本的「被修的东西」**；`hair`（0 处）是中文里最自然的「请人剪」场景，但**须新造**。**`cut`／`repaired`／`checked`／`fixed` 四个过去分词全部须新造**——**方向 2 的成本是「1 个结构 ＋ 4 个过去分词 ＋ 1–2 个名词」，远高于批二十一**（§2.2）。

8. **方向 2 有一个批二十一没记的**额外**优势：库里已有 `got him to go`（L108）与 `had me come`（L107）两条「让人做」的使役课，`have sth done` 的「同一个 have」对撞面是**有邻居的**。** 实读：`have` 相关 — L21 `I have done my homework.`（`have` ＋ 过去分词 ＝ 现在完成时）、L107 `The teacher had me come early.`（`had` ＋ 人 ＋ 原形）、L115／L116 `have got`／`has got`、L108 `I got him to go with me.`。→ **`have sth done` 与 L21「have ＋ 过去分词」是真对撞（同形不同义），与 L107「had ＋ 人 ＋ 原形」是近邻（同词不同位置）**。批二十一记「强干扰源：`have X done` 的 GL 命中全是现在完成时」——**本轮实读确认这条成立，且新增一条：L107 的 `had me come` 是「同一个 had 的第二个用法」，比批二十一记的更近**（§4.2）。

9. **方向 3（换轴）的基建已经就位，且比预期厚：`listen` 题型在 138 课里 100% 可用（每课都有），全库三档总题量 1,656 题。** 实读（`buildBoostItems` 真服务跑全库 138 课 × 3 档）：**总题量 1,656**，题型分布 `rebuild 276`·`arrange 151`·`spot 138`·`listen 138`·`cloze 138`·`recall 138`·`produce 138`·`variant 138`·`fix 138`·`translate 125`·`bothright 97`·`replace 41`。**`listen` 138/138 课可用**（素材来源 `grammarBoostService.ts:770-792`：从 `contrast` 的「正确句 vs 典型错句」配对派生；**源码注释 `:768` 写「全库 660 组」——该注释已过期**，实读现态 **828 组（其中非 bothRight 的 528 组才是 listen 可用素材）**）。**`contrast` 题型 0/138**——**「对比判断」不在 Boost 题型里**（它只在课内六段式出现）。→ **换轴不需要新引擎，`listen` 已是全库覆盖；换轴的真正缺口是「读」侧**（全库无阅读理解/朗读类题型，`translate` 125 课可用是唯一接近的）（§6.3）。

10. **封面池已达「二用 21 张」的临界，L139 起的最优指派是唯一的且 min-gap ＝ 117。** 实读：**117 张封面被用 138 次**，单次 **96 张**（cover22–cover117），二用 **21 张**（cover1–cover21，对应 L1–L21 ↔ L118–L138 **严格一一对应**），三用 **0 张**。**L139 起可用池（五位都在 ≥35 线以上）＝ cover22–cover104 共 83 张**（cover105 在 L139 的 gap ＝ 34，出局）。**最优指派 min-gap ＝ 117，解数 ＝ 1（唯一）**：`L139←cover22／L140←cover23／L141←cover24／L142←cover25／L143←cover26（若 5 课）；3 课版＝cover22–cover24；6 课版＝cover22–cover27`——**任何批量的最优解都是「从 cover22 起连续取」，且唯一**。**注意**：批二十一用了 cover17–cover21，本批接着 cover22 起，**「二用池」将从 21 张扩到 21+K 张**（§7）。

11. **cloze 落点在方向 1 比批二十一好，在方向 2 与批二十一同样糟。** ambush 侧（25 句实跑）：**`You seem tired today.` 落 `seem`（第②档）、`She seems happy at school.` 落 `seems`（第②档）、`He seemed sad yesterday.` 落 `seemed`（第②档）**——**`seem` 族是唯一能让 ambush 空位落在考点词上的候选**（因为 `seem` 不在 `GRAMMAR_WORDS` 表内、句子前两词是 `You`/`She`/`He`（都不在表内）→ 走第②档实词回退时 `seem` 是第一个长度 ≥3 的非停用词）；而 **`as soon as` 三句全落 `will`/`As`/`as`、`neither` 族全落 `likes`/`like`/`is`/`are`、`would rather` 全落 `would`**——**考点词 `soon`／`neither`／`rather` 永不落空**。**方向 2 更糟：`I will have my hair cut tomorrow.` 落 `will`、`She had her bike repaired yesterday.` 落 `had`、`I have my car checked every year.` 落 `have`**——**`cut`／`repaired`／`checked` 三个考点词 100% 逃逸**，与批二十一的 `forward` 同病（§5）。

12. **boost 侧的落点率反过来：方向 1 的目标词可落 18.7%–52.4%，方向 2 的 20.2%–24.6%。** 实读（252 组种子）：**`Either you or he is right.` → `Either` 可落 52.4%（最高，候选位只有 2 个）、`Shall we go to the park?` → `Shall` 52.4%、`Her dress is the same as mine.` → `same` 36.5%、`It smells like rain.` → `like` 36.5%**；**最低的是 `I will call you as soon as I get home.` → `soon` 20.2%（5 个候选位）、`I will have my hair cut tomorrow.` → `cut` 20.2%**。**方向 1 的 `seem` 族（3 候选位）可落 32.1%，是「ambush ＋ boost 双通道都友好」的唯一候选族**（§5.3）。

13. **罪名承载：方向 1 的候选里，`neither/either/both` 与 `as soon as` 承载面最宽（可带薄档 `missing_be`／`article`／`fragment`／`run_on` 中的 3 个），`seem/appear` 承载面最窄（只能带 2 个）。** 实读 10 项枚举（`huntService.ts:331-342`）现况：`verb_form` **131/87**（最厚）·`plural` **102/96**·`sv_agreement` **89/66**·`preposition` **62/57**·`tense` **50/42**·`word_order` **47/35**·`article` **29/23**（薄）·`missing_be` **24/20**（薄）·`fragment` **14/13**（最薄）·`run_on` **14/12**（最薄）。逐候选的承载预判见 §4。**薄档的现状是「fragment 与 run_on 各只有 14 处」——方向 1 若想带薄档，`as soon as`（从句＋主句，易出残句/流水句）与 `neither...nor`（并列结构）是唯一两个能自然带 `fragment`／`run_on` 的候选**（§4）。

14. **方向 1 有「造词课的量级」问题：一个候选至少 2–3 个新词（`as soon as` ＝ `soon` ＋ `as` 的新义 ＋ 可能的 `join`；`neither...nor` ＝ `neither` ＋ `either` ＋ `both` ＋ `nor` 四个词），而现有大章的造词量级是 0–3 个。** 实读批型对照（批二十一 §7 表）：批十八 **0 新造词**／批十九 **0**／批二十 **3 个动词**／批二十一 **2 个**（`forward`＋`seeing`）。**方向 1 的 `neither/either/both` 一格就是 4 个新词（`neither`／`either`／`both`／`nor`），`as soon as` 是 2 个（`soon` ＋ `as` 第三义）——两者都超出「3 个」的先例上限**。**唯一符合量级的是 `seem/appear`（2 个词：`seem`＋`appear`）与 `would rather`（2 个词：`rather`＋`would` 的新用法，但 `would` 已在库）**（§2）。

---

## 1. 候选缺口逐词盘点（本批核心）

**判定口径**：「在库」＝该词/串在 GL 或 HC 的**引号内字符串**里至少出现过 1 次；「零」＝两文件引号内字符串 **0 次**。数字给「处（词次）」。**双口径**：凡有 id 串假阳性风险的词，给「剔除后」与「裸 grep」两个数。**重要方法论警告**：本轮发现 **`both` 在裸 `grep -o -i` 下 GL 300 处**，**全部是 `bothRight:` 字段名**——这是本批最大的假阳性陷阱。

### 1.1 方向 1 主候选：逐词（GL＋HC）

| 词／串 | GL 处 | GL 串 | HC 处 | HC 串 | 判定 |
|---|---|---|---|---|---|
| **`as soon as`** | **0** | 0 | **0** | 0 | 🔴 **整串零** |
| **`as soon`** | **0** | 0 | **0** | 0 | 🔴 零 |
| `soon` | **0** | 0 | **0** | 0 | 🔴 **零**（`later` GL 0／HC 1，也基本零） |
| `as`（对照） | **70** | 34 | **9** | 5 | ⚠️ **在库但被 L65 独占**：L65 **61 处（87%）全是 `as tall as`；L71 6／L109 2／L78 1** |
| **`neither`** | **0** | 0 | **0** | 0 | 🔴 零 |
| **`either`** | **0** | 0 | **0** | 0 | 🔴 零 |
| **`nor`** | **0** | 0 | **0** | 0 | 🔴 零 |
| **`both`（剔除 `bothRight`）** | **0** | 0 | **0** | 0 | 🔴 零（**裸 grep GL 300＝全是 `bothRight` 字段名**） |
| `neither...nor` | **0** | 0 | **0** | 0 | 🔴 整串零 |
| `either...or` | **0** | 0 | **0** | 0 | 🔴 整串零 |
| `both...and` | **0** | 0 | **0** | 0 | 🔴 整串零 |
| **`would rather`** | **0** | 0 | **0** | 0 | 🔴 整串零 |
| **`would rather not`** | **0** | 0 | **0** | 0 | 🔴 整串零 |
| `rather` | **0** | 0 | **0** | 0 | 🔴 零 |
| `would`（对照） | **有** | — | — | — | ✅ 在库（L62 `would like`／L69 `Would you mind`／L70 `Would you like`），**但与 `would rather` 不同岗** |
| **`seem`** | **0** | 0 | **0** | 0 | 🔴 零 |
| **`seems`** | **0** | 0 | **0** | 0 | 🔴 零 |
| **`seemed`** | **0** | 0 | **0** | 0 | 🔴 零 |
| **`appear`** | **0** | 0 | **0** | 0 | 🔴 零 |
| **`appears`** | **0** | 0 | **0** | 0 | 🔴 零 |
| **`appeared`** | **0** | 0 | **0** | 0 | 🔴 零 |
| **`the same as`** | **0** | 0 | **0** | 0 | 🔴 整串零 |
| **`same as`** | **0** | 0 | **0** | 0 | 🔴 整串零 |
| `same`（单词） | **2** | 2 | **1** | 1 | 🟡 **不是零**：GL `L112 :20898` `They look the same!` ＋ `L138 :25939` `Are they the same?`；HC `#31 :?` 1 处 |
| **`shall`** | **0** | 0 | **0** | 0 | 🔴 零 |
| **`shall we`** | **0** | 0 | **0** | 0 | 🔴 整串零 |
| **`why not`** | **0** | 0 | **0** | 0 | 🔴 整串零（`why` 单词 GL 8 处：L20 7／L109 1，**全是「为什么」问句，不是提议**） |
| **`what about`** | **3** | 3 | **0** | 0 | 🟡 **有 3 处但全是「你呢」义**：L45 `:8230` `I enjoy drawing. What about you?`／L75 `:13910` `What about you?`／L75 `:13914` 讲解明文「`What about` 是「你呢」（第 45 课）」 |
| **`how about`** | **19** | 13 | **1** | 1 | ✅ **唯一有真实教学位的**：GL **19 处全在 L75**（`:13881`／`:13905`／`:13934`／`:13939`／`:14006`／`:14023`…）；HC `#84 :5326` |

### 1.2 方向 1 次候选：感官 `like` 扩展

| 词／串 | GL 处 | HC 处 | 判定 |
|---|---|---|---|
| **`sound like`** | **0** | **0** | 🔴 整串零 |
| **`smell like`** | **0** | **0** | 🔴 整串零 |
| **`taste like`** | **0** | **0** | 🔴 整串零 |
| **`feel like`** | **0** | **0** | 🔴 整串零 |
| **`looks like`** | **5** | **0** | 🟡 **全是 L127 认读种子** `It looks like rain.`（L49 `:8977` 弱曝／L127 `:23804`·`:23839`·`:23843`·`:23869`） |
| `look like`（不带 s） | **0** | **0** | 🔴 零 |
| `sound`／`sounds` | **68**／**110** | **9**／**9** | ✅ **极厚**（L128 48／L132 29 为主） |
| `smell`／`smells` | **18**／**67** | **3**／**3** | ✅ 厚（L129 42） |
| `taste`／`tastes` | **18**／**60** | **3**／**4** | ✅ 厚（L130 45） |
| `feel`／`feels` | **57**／**54** | **9**／**4** | ✅ 厚（L131 42） |

> **实读裁定**：**五个感官动词的 8 个形态合计 **452 处**（串口径：`sound` 68／`sounds` 110／`smell` 18／`smells` 67／`taste` 18／`tastes` 60／`feel` 57／`feels` 54），但 `X + like` 这个搭配整串几乎全零**——只有 `looks like` 有 5 处（且是认读种子）。→ **感官 `like` 扩展是「词汇零成本、搭配全新建」的典型**：不用造动词，但要新建 5 个搭配（`sound/smell/taste/feel + like`），且 `looks like` 已有认读位可做接口（与批二十一 `forward` 的「认读升格」同型）。

### 1.3 时间家族现状（判断 `as soon as` 能否入伙）

| 词 | GL 处 | GL 分布（处数） | HC 处 | HC 案 |
|---|---|---|---|---|
| **`when`** | **267** | L92 **67**·L97 **53**·L99 **33**·L101 **23**·L102 **18**·L27 20·L98 9·L56 7·L94 6·L78 4·L35 3·L57 3·L85 3·L93 2·L109 13·L96 1·L100 1 | **16** | #36／#41／#101／#103／#106／#108／#110／#111 |
| **`after`** | **167** | L90 **63**·L106 **37**·L91 **21**·L94 **17**·L110 **11**·L92 9·L9 4·L10 2·L77 1·L108 1·L109 1 | **10** | #24／#37／#99／#100／#103 |
| **`before`** | **79** | L91 **56**·L92 **10**·L94 6·L90 2·L100 1·L102 1·L107 1·L109 1·L122 1 | **6** | #32／#41／#100 |
| **`until`** | **64** | L109 **60**·L110 4 | **8** | #118／#119／#126 |
| **`while`** | **86** | L98 **60**·L99 14·L102 6·L101 4·L109 2 | **10** | #107／#108／#110／#111 |
| **五格合计** | **663** | — | **50** | — |
| **`as soon as`（对照）** | **0** | — | **0** | — |

> **实读裁定（回答「`as soon as` 能否入伙」）**：
> 1. **五格已被五课 + 五案占满**：`when`←L92／L97／L99、`after`←L90、`before`←L91、`until`←L109、`while`←L98——**每一格都有专属 `grammarLabel` 与专属案**（L90 `:16722` `After I do my homework, I watch TV.`；L91 `:16911` `Before I eat, I wash my hands.`；L92 `:17100` `When it is sunny, I run.`；L98 `:18237` `While I was reading, he was sleeping.`；L109 `:20309` `I waited until the rain stopped.`）。
> 2. **`as soon as` 是第六格，且它与 `when` 语义最近**（「一…就…」＝ `when` 的紧邻义）。**实读库里 `when` 的 267 处中有 53 处在 L97（`when + 当时正做着`），是 `when` 的「时间点」义**——`as soon as` 的「紧接」义**与它只差一个语义刻度**。→ **入伙的代价是「要与已占满的 `when` 显式切开」，而不是「找一块空地」。**
> 3. **两处硬成本**：`soon` **双 0**（须造）＋ `as` 的**第三义**（L65 的 `as tall as` 占 `as` 的 61/70＝87%，`as soon as` 里的 `as` 与学生已学的「一样」完全不同岗）。→ **`as soon as` 的造词成本是「1 个新词 ＋ 1 个旧词新义 ＋ 1 处与 `when` 的语义切开」，量级高于批二十一的 `forward`**。

### 1.4 方向 1 配套名词（若做 `as soon as` 的「一…就…」场景）

| 词 | GL 处 | 主要所在课 | HC 处 | 判定 |
|---|---|---|---|---|
| `join` | **0** | — | **0** | 🔴 零（「一…就加入」场景须造） |
| `gate` | **0** | — | **2** | 🟡 HC 有 2 处 |
| `club` | **0** | — | **1** | 🟡 GL 零／HC 1 |
| `playground` | **2** | L93·L100 | **0** | ✅ 薄但在库 |
| `weekend` | **61** | L29·L40·L49·L133–L136·L138 | **8** | ✅ 极厚 |
| `summer` | **107** | L18·L25·L46·L134–L138 | **12** | ✅ 极厚 |
| `phone` | **51** | L99·L100·L102 | **6** | ✅ 在库 |
| `party` | **13** | L57·L134·L135 | **2** | ✅ 在库 |
| `letter` | **8** | L23·L52·L53 | **0** | ✅ 在库 |
| `trip` | **0** | — | **1** | 🔴 GL 零 |
| `test` | **2** | L134 | **0** | 🟡 极薄（批二十一「不引入」清单里） |

> **实读裁定**：**方向 1 的场景词可零造词**（`weekend` 61／`summer` 107／`phone` 51／`party` 13 全在库），**唯一「零」的是 `join`（0/0）与 `trip`（GL 0）**——**若写 `I will call you as soon as I get home.` 这类句子，场景词成本为 0**。

### 1.5 方向 2 `have sth done` 词架复核（逐条复算批二十一记录）

| 词／串 | 本轮 GL | 本轮 HC | 批二十一记录 | 一致性 | 所在行号 |
|---|---|---|---|---|---|
| **`will have`** | **0** | **0** | GL 0 | ✅ 一致 | —（独立 `grep -o -i "will have"` 也 ＝ 0） |
| **`cut`** | **0** | **0** | GL 0 | ✅ 一致 | — |
| **`fixed`** | **0** | **0** | GL 0 | ✅ 一致 | — |
| **`haircut`** | **0** | **0** | GL 0 | ✅ 一致 | — |
| **`had my`** | **0** | **0** | GL 0 | ✅ 一致 | — |
| **`have my`** | **1** | **0** | GL 1 | ✅ 一致 | **GL L23 `:4171`** `"Don't worry. I have my key here."` |
| **`checked`** | **0** | **0** | GL 0 | ✅ 一致 | — |
| **`repaired`** | **0** | **0** | GL 0 | ✅ 一致 | — |
| **`'ll`（缩写）** | **0** | **0** | 未记 | 🆕 新增 | —（独立 `grep -o "'ll"` 也 ＝ 0） |

> **`have my` 那 1 处的逐句审判（本批最值得记的一条）**：`L23 :4171` 的 `"Don't worry. I have my key here."` ——**这是普通 `have`（我拿着我的钥匙），不是使役义**。批二十一记「1 处不足以构成垫子」**成立**；**本轮追加一条更强的结论**：它不只不是垫子，**还是一个「同形干扰源」**——它教给学生的是「`have my` ＋ 东西 ＝ 我有我的东西」，**与 `have my hair cut`（请人剪）的语序完全相同**（`have` ＋ `my` ＋ 名词），**学生最可能的迁移错误是把 `cut` 当另一个名词**。→ **方向 2 的「造词成本」不是「8 个零」，而是「8 个零 ＋ 1 个反向干扰源」**。
>
> **辅助名词复核（方向 2 省成本的关键）**：`hair` **GL 0／HC 1**（须造）；`shoes` **GL 0／HC 6**；`car` **GL 7**（L107 `:19935`·L111）；`bike` **GL 76**（L3／L115／L116／L117／L118）；`window` **GL 159**（横跨 L32–L96）；`phone` **GL 51**。→ **`bike`（76）与 `window`（159）是「被修的东西」里最省成本的**。

### 1.6 方向 3（换轴）的候选池（本盘点只给基建数据，不定选题）

| 题型 | 全库可用课数 | 总题量（三档） | 来源（行号） |
|---|---|---|---|
| `listen` | **138/138 ＝ 100%** | **138** | `grammarBoostService.ts:770-792`（从 `contrast` 句对派生，正确 vs 典型错句，<3 词丢弃） |
| `cloze` | **138/138** | **138** | `:794-812`（`poolOf` 去 target/blocks 后逐句 `buildCloze`） |
| `spot`（改错） | **138/138** | **138** | `:717` 附近（`contrast` spot ＋ `guided.spot` 派生） |
| `rebuild`／`arrange`／`recall`／`produce`／`variant`／`fix` | **138/138** | 276／151／138／138／138／138 | 档 2／档 3 |
| `translate` | **125/138** | **125** | `:994-1012`（examples／sceneSwings 里未用过的句子） |
| `bothright` | **97/138** | **97** | `:747-762`（`contrast` 里 `bothRight:true` 且 diff < 90） |
| `replace` | **41/138** | **41** | `:830-847`（`guided.replace` 派生） |
| **`contrast`（对比判断）** | **0/138** | **0** | **不在 Boost 题型里**（只在课内六段式） |
| **阅读理解 / 朗读** | **0/138** | **0** | **全库无此类题型** |

> **实读裁定**：**「换轴」里「听」这一轴已 100% 就位（`listen` 138/138）**，且素材是现成的 **528 组**可用 `contrast` 句对（每课 6 条；`contrast` 总组数 **828** ＝ 138 × 6，其中 `bothRight` **300** 条不做 listen）。**「读」这一轴的唯一接近物是 `translate`（125/138）**——它是「给中文写英文」的产出题，不是阅读理解。→ **方向 3 若走「听力」，成本接近 0（引擎现成）；若走「阅读」，须新引擎**。

---

## 2. 造词成本对比（逐候选）

**口径**：成本 ＝ 须在两文件里**首次引入并立岗**的「新词／新串」数量。参照现有批型的先例上限：批十八 **0**／批十九 **0**／批二十 **3**／批二十一 **2**。

### 2.1 方向 1 逐候选成本表

| 候选 | 必造新词 | 附带成本（旧词新义／切开） | 成本量级 | 与先例比 |
|---|---|---|---|---|
| **`as soon as`** | **`soon`（1）** | `as` 的**第三义**（L65 `as tall as` 占 61/70＝87%）；**与 `when`（267 处）显式切开** | **1 新词 ＋ 2 附带** | ≈ 批二十一（2） |
| **`neither`／`either`／`both`** | **`neither`＋`either`＋`both`＋`nor`（4）** | 三者的**位置规则**（`neither...nor`／`either...or`／`both...and` 三串全 0）；**与 L19 `and/but`／L20 `because/so` 的连接词家族切开** | **4 新词 ＋ 3 新串** | 🔴 **超先例上限（3）** |
| **`would rather`** | **`rather`（1）** | `would` 已在库但**不同岗**（L62 `would like`／L69 `Would you mind`／L70 `Would you like` ＝ 客气请求）；**`would rather` 是「宁愿」＝ 第三个 would 用法** | **1 新词 ＋ 1 附带** | ≈ 批二十一（2） |
| **`seem`／`appear`** | **`seem`＋`appear`（2）** | **零附带**：与批二十 L128 `It sounds great.` 同骨架（`It ＋ 感官动词 ＋ 形容词`），**`seem` 只是换了动词**；**且 `seem` 族是唯一的 cloze 双通道友好候选** | **2 新词 ＋ 0 附带** | ✅ **≈ 批二十一（2）** |
| **`the same as`** | **`as` 的第二义（`same as` 整串）** | `same` 已在库 **GL 2**（L112 `They look the same!`／L138 `Are they the same?`）＋**`as` 的「像」义**（与 L65 「一样」的 `as...as` 双 as 结构**同形不同数**） | **0–1 新词 ＋ 2 附带** | ≈ 批二十一 |
| **`shall we`／`why not`／`what about`／`how about`** | **`shall`（1）** | `why not`／`what about` **双 0**；**`how about` GL 19（L75 已成课）＋HC 1，是最省的一项**；**`what about` 3 处全是「你呢」义（须切开）** | **1 新词（`shall`）＋ 3 串新建** | 🟡 中 |
| **感官 `like` 扩展** | **0 新词（5 个动词全在库）** | **5 个搭配整串新建**（`sound/smell/taste/feel/look + like`）；`looks like` 已有 5 处认读种子可转正 | **0 新词 ＋ 5 新串** | 🟡 **词最省、串最多** |
| **`will have`（若走方向 1 的将来时复现）** | **0** | `will` 已极厚（GL 229／HC 22），**`will have` 整串 0** | **0 新词 ＋ 1 新串** | ✅ 低 |

### 2.2 方向 2 成本表

| 项 | 数量 | 明细 |
|---|---|---|
| 必造新词 | **8** | `cut`／`fixed`／`haircut`／`had my`／`checked`／`repaired`／`will have`／`'ll`（全部双 0） |
| 反向干扰源 | **1** | `have my` GL 1（L23 `:4171`，普通 have 义，语序与使役同形） |
| 可选辅助名词 | **0–2** | `bike` 76／`window` 159 在库（省）；`hair` 0／`shoes` 0（须造） |
| **成本量级** | **8 新词 ＋ 1 干扰源** | 🔴 **≈ 批二十（3）的 2.7 倍；≈ 批二十一（2）的 4 倍** |

### 2.3 三方向成本对比（一句话）

| 方向 | 最小成本版 | 完整版 | 判据 |
|---|---|---|---|
| **方向 1（复现型大章）** | **`seem`／`appear`（2 新词、0 附带）** | `neither/either/both`（4 新词 ＋ 3 新串） | **最小成本版 ≤ 批二十一；完整版超先例上限** |
| **方向 2（`have sth done`）** | **8 新词（无法压缩）** | 8 新词 ＋ 名词 | 🔴 **成本最高，且无压缩空间** |
| **方向 3（换轴）** | **0 新词（听力轴：引擎＋素材全现成）** | 阅读轴须新引擎 | ✅ **成本最低** |

---

## 3. 复现型章可行性数据（方向 1）

### 3.1 全库 138 课的 `grammarLabel` ＋ `targetSentence`（逐课，供判断哪些结构可做「复现型」）

> **完整 138 行表（`grammarLabel` ＋ `targetSentence` ＋ episode ＋ 逐字段行号）见 §附录 A0**（任务书要求「138 课全量」——A0 是逐课全量表）。此处先给**按「结构可复现度」的分组**，供快速判断。

**按「结构可复现度」分组（本盘点的核心判断）：**

| 组 | 结构族 | 课号 | 可复现性（数据判据） |
|---|---|---|---|
| **G1** | `be` 动词族 | **L1／L2／L7／L8／L33／L50–L54／L87** | ✅ **全库最厚**（`am/is/are/was/were` 到处都是） |
| **G2** | 时间从句族 | **L90／L91／L92／L97／L98／L99／L109** | ✅ **厚（GL 663 处）**，但**五格已占满**（§1.3） |
| **G3** | 感官族 | **L125–L133**（9 课，**跨 season-19{125,127} ＋ season-20{128,133} 两季**） | ✅ **极厚（452 处）**，`looks like` 已有种子 |
| **G4** | `to` 族 | **L119–L124／L134–L138**（11 课） | ✅ 厚（`to` 无处不在），**但已连占两批** |
| **G5** | 连接词族 | **L19／L20**（`and/but`／`because/so`） | ⚠️ 薄：**只有 2 课，`and/but` 与 `because/so` 各一课**——**`neither...nor` 若入伙，家族只有 2 课可复现** |
| **G6** | 使役族 | **L103–L110**（`make/let/have/get`） | ✅ 厚（8 课），**与方向 2 的 `have` 同族** |

### 3.2 现有「收口课」清单（零新知）——实读 14 课，任务书列 9 课

**实读（`grammarLabel` 含「收口」）＝ 14 课**（并给出**该课所属季**与**季内位置**）：

| 课 | 行号 | 所属季 | 季内位置 | `grammarLabel` | 含「零新知」 | `targetSentence` | `intentZh` | contrast 条数 |
|---|---|---|---|---|---|---|---|---|
| **L41** | `:7463` | season-4 | 季末（L35–41） | `收口 · 两句话拼一句` | ❌ | `I know the boy who wears glasses.` | — | **6** |
| **L46** | `:8394` | season-5 | 季末（L42–46） | `收口 · 名字版 + 小垫板` | ❌ | `I enjoy reading and I want to travel.` | — | **6** |
| **L49** | `:8954` | season-6 | 季末（L47–49） | `收口 · 建议 + 条件` | ❌ | `You should take an umbrella if it rains.` | — | **6** |
| **L54** | `:9893` | season-7 | 季末（L50–54） | `收口 · 谁重要谁上台` | ❌ | `The pictures were taken by the teacher.` | 照片是老师拍的。 | **6** |
| **L78** | `:14432` | season-12 | 季末（L76–78） | `收口 · 跨季大团圆（零新知）` | ✅ | `I run every day, and I keep reading.` | 我每天跑步，也一直在读书。 | **6** |
| **L86** | `:15955` | season-13 | 季末（L79–86） | `收口 · 大团圆（零新知）` | ✅ | `Whose bag is this? It is next to the door.` | — | **6** |
| **L94** | `:17470` | season-14 | 季末（L87–94） | `收口 · 大团圆（零新知）` | ✅ | `It's cold today. What a nice day!` | 今天真冷。多好的天啊！ | **6** |
| **L102** | `:18989` | season-15 | 季末（L95–102） | `收口 · 大团圆（零新知）` | ✅ | `I was reading at eight. It was raining. When you called, I was reading.` | 八点我在看书。下着雨。你打电话时我正在看书。 | **6** |
| **L110** | `:20488` | season-16 | 季末（L103–110） | `收口 · 四张脸排一行` | ❌ | `My mom makes me do my homework.` | 把这些事串起来说一遍。 | **6** |
| **L118** | `:22043` | season-17 | 季末（L111–118） | `收口 · 零新知（六行排一行）` | ✅ | `Grandma's birthday is in May.` | 把这章学过的说法一次说一遍。 | **6** |
| **L124** | `:23209` | season-18 | 季末（L119–124） | `收口 · 零新知（四句排一行）` | ✅ | `I used to walk to school.` | 把这章学过的说法一次说一遍。 | **6** |
| **L127** | `:23787` | season-19 | 季末（L125–127） | `收口 · 零新知（喊人看 vs 说样子）` | ✅ | `The sky looks dark.` | — | **6** |
| **L133** | `:24951` | season-20 | 季末（L128–133） | `收口 · 零新知（五张脸排一行）` | ✅ | `It looks nice.` | 把这章学过的说法一次说一遍。 | **6** |
| **L138** | `:25917` | season-21 | 季末（L134–138） | `收口 · 零新知（习惯了的 to vs 盼着的 to）` | ✅ | `I am used to getting up early.` | 把这章学过的说法一次说一遍。 | **6** |

> **📌 14 课收口课的「季末位置」是 100% 规律（实读，最强的一条判据）**：**14 课全部落在所属季的最后一课（`max`）**——`season-4` 的 41＝max／`season-5` 的 46＝max／`season-6` 的 49＝max／`season-7` 的 54＝max／`season-12` 的 78＝max／`season-13` 的 86＝max／`season-14` 的 94＝max／`season-15` 的 102＝max／`season-16` 的 110＝max／`season-17` 的 118＝max／`season-18` 的 124＝max／`season-19` 的 127＝max／`season-20` 的 133＝max／`season-21` 的 138＝max。**→「收口课 ＝ 季末课」是可用的结构性判据。**
>
> **但它不能区分「复现型章」**：**21 季里有 14 季有收口课、7 季没有**（season-1／2／3／8／9／10／11 无收口课）——**「季末」是必要不充分条件**；且「复现型章」若成立，**其特征是「多个连续季末」或「一整季零新知」，而现状是「一季一课收口」**（§3.3）。
>
> **两处口径修正（实读结论，请主理人注意）**：
> - **任务书列的 9 课（L54／L78／L94／L102／L110／L118／L124／L133／L138）实为 14 课的子集**——**漏了 L41／L46／L49／L86／L127**（这 5 课 `grammarLabel` 同样以「收口」开头）。
> - **`contrast` 条数全部 ＝ 6**（**138 课无一例外**，本批实读全量核对；全库 `contrast` 总条数 **828**，其中 `bothRight` **300** 条、**可作 `listen` 素材的非 bothRight 条 ＝ 528**）——**`contrast` 条数不能用作「复现型 vs 收口课」的判据**。

### 3.3 「收口课」的数据特征：`targetSentence` 复用 ＋ 首现词数（判据缺失点）

**（a）`targetSentence` 完全复用的组（实读全库，仅 6 组）**：

| 复用句 | 课号 | 说明 |
|---|---|---|
| `Yesterday I went to the park.` | **L10 → L24** | 昨天版 vs 做过版对比 |
| `My mom makes me do my homework.` | **L103 → L110** | 使役四脸收口 |
| `Grandma's birthday is in May.` | **L111 → L117 → L118** | 三课复用（唯一三重复用） |
| `I am used to getting up early.` | **L120 → L138** | 批十八 → 批二十一跨批 |
| `I used to walk to school.` | **L122 → L124** | 批十八内部 |
| `It looks nice.` | **L125 → L133** | 批十九内部 |

> **实读裁定**：**14 课收口课里只有 4 课（L110／L118／L124／L133／L138 中的 L110/L118/L124/L133/L138）的 `targetSentence` 是逐字复用前课**——**L41／L46／L49／L54／L78／L86／L94／L102／L127 九课的 `targetSentence` 是「新拼的句子」（非逐字复用）**。→ **「`targetSentence` 复用」不是收口课的判据**（14 课里只有 5 课符合）。

**（b）首现词数（本盘点新算的判据）**：逐课统计「该课首次出现的句内词」（剔除 id 串，只看 ≥3 词的英文串）：

| 统计项 | 值 |
|---|---|
| 全库 138 课平均 | **4.86 首现词/课** |
| L90–L138 平均 | **2.20 首现词/课** |
| **零首现词的课（15 课）** | **L35／L42／L75／L91／L94／L96／L97／L100／L102／L106／L115／L116／L123／L125／L132** |
| 零首现词课中，属于收口课的 | **仅 L94／L102 两课**（**L125 是批十九的 `look` 立岗课，不是收口课**） |
| 收口课的典型首现词数 | L41 **3**·L46 **1**·L49 **2**·L54 **1**·L78 **3**·L86 **1**·L94 **0**·L102 **0**·L110 **2**·L118 **2**·L124 **1**·L127 **1**·L133 **3**·L138 **1** |

> **实读裁定（方向 1 的核心风险，正面回答「数据上怎么区分」）**：
> **只能用「季末位置」，不能用「首现词数」；且「季末位置」只能识别「1 课收口」，识别不了「整章复现」。** 三个候选判据逐一实读：
> 1. **`grammarLabel` 文案**——14 课收口课里有 5 课不带「零新知」字样（L41／L46／L49／L54／L110），**且「收口」二字纯是人写标签，无字段约束**。
> 2. **`targetSentence` 逐字复用**——14 课里只有 5 课复用（L110←L103／L118←L111+L117／L124←L122／L133←L125／L138←L120），**L41／L46／L49／L54／L78／L86／L94／L102／L127 九课是「新拼句」**。
> 3. **首现词数**——**零首现词的 15 课里只有 2 课是收口课**（L94／L102）；反过来，**收口课 L41／L78／L133 各有 3 个首现词**（比 L90–L138 的平均 2.20 还高）。**该判据失效。**
> 4. **季末位置（✅ 唯一可用）**——**14/14 收口课 ＝ 所属季的 `max`**（§3.2）。**但它只是「收口课」的判据，不是「复现型章」的判据**：现状是「一季一课收口」，**「一整季零新知」在本项目零先例**。
>
> → **「复现型大章」（连续 N 课零新知）在本项目的数据结构里没有任何字段可以承载**：现有 `GrammarLesson` 接口（`types.ts:580-621`）**没有 `isRecap`／`newWordCount`／`revisitRatio` 之类的字段**。**这是方向 1 最硬的结构性风险——须主理人裁决「是否新增字段」或「用文案纪律代替」**。
>
> **一个现成的结构性抓手（本盘点发现，可低成本利用）**：**「季末位置」已有守门测试**（`grammarSeasons.test.ts:43` 「最高季区间的 max 覆盖全部课程」）——**若把「复现型章」定义为「一整季都是季末形态」，则 season 的 `min`/`max` 字段就是它的天然容器**，无需新增 `GrammarLesson` 字段。**这是本盘点给方向 1 的唯一低成本落点。**

### 3.4 「纯复现案」的现状（错点侧判据）

**逐案实读 `explanation` 含「回流」的条数（全库 562 条错点）：**

| 统计项 | 值 |
|---|---|
| 全库错点 | **562** |
| 含「回流」的错点 | **103（18.3%）** |
| **全部错点都是回流的「纯复现案」** | **10 案**：#95／#103／#110／#119／#126／#127／#133／#136／#142／**#147** |
| 每案回流比（最近 25 案） | **#143–#146 全是 2/4；#147 是 4/4** |
| 回流目标课号 Top | **L11（29 次）· L10（15 次）· L25（10 次）· L19（8 次）** → **回流高度集中在 L10／L11／L19／L25 四课** |
| 回流引用总次数 | **103** |

> **实读裁定**：**「连续两案全回流」在本项目从未出现过**——10 个纯复现案中，最近的 #142 与 #147 之间隔了 4 案（#143–#146 全是 2/4）。→ **方向 1 若要一个「复现型大章」，须连续 N 案达到 4/4 全回流，这是本项目零先例的**。**且回流池本身很浅**：103 次回流里 **L10／L11／L19／L25 四课占了 62 次（60%）**——**复现型大章会把这四课反复挖，边际递减很快**。

### 3.5 可做「复现型大章」的结构族排序（本盘点的建议依据）

按「结构厚度 × 已被占用的课位数 × 造词成本」三维排序：

| 排序 | 结构族 | 厚度（GL 处） | 已占课位 | 造词成本 | 综合 |
|---|---|---|---|---|---|
| **1** | **感官 `like` 扩展** | 动词 **452** 处（8 形态） | L125–L133（**9 课，最厚**） | **0 新词** | 🥇 **最优**：只新建搭配串，且 `looks like` 已有 5 处种子 |
| **2** | **`seem`／`appear`** | 0（须造） | 无 | **2 新词** | 🥈 **次优**：与 L128 同骨架、cloze 双通道友好（§5） |
| **3** | **`would rather`** | 0 | 无（`would` 已在库） | **1 新词** | 🥉 中：`would` 第三义，与 L62／L69／L70 切开 |
| **4** | **`as soon as`** | `when` 267（邻居） | L90–L109（**五格全占**） | **1 新词 ＋ 2 附带** | ⚠️ **须与 `when` 切开** |
| **5** | **`neither/either/both`** | 0 | L19／L20（**仅 2 课**） | **4 新词** | 🔴 **成本最高、家族最薄** |

---

## 4. 罪名承载预判

**权威枚举**：`huntService.ts:331-342` ＝ `tense`／`sv_agreement`／`missing_be`／`article`／`plural`／`preposition`／`fragment`／`run_on`／`word_order`／`verb_form`（10 项，`comparison` 在 `types.ts:419-430` 存在但不在枚举，HC 实读 **0** 处）。

**现况（本轮实读）**：

| 罪名 | 错点 | 承载案 | 档位 |
|---|---|---|---|
| `verb_form` | **131** | **87** | 厚 |
| `plural` | **102** | **96** | 厚 |
| `sv_agreement` | **89** | **66** | 厚 |
| `preposition` | **62** | **57** | 厚 |
| `tense` | **50** | **42** | 中 |
| `word_order` | **47** | **35** | 中 |
| `article` | **29** | **23** | **薄** |
| `missing_be` | **24** | **20** | **薄** |
| `fragment` | **14** | **13** | **最薄** |
| `run_on` | **14** | **12** | **最薄** |

### 4.1 逐候选承载预判（10 枚举内）

| 候选 | 可植错型（10 枚举内） | 可带薄档？ |
|---|---|---|
| **`as soon as`** | `tense`（`as soon as` 从句用现在、主句用将来——经典错 `as soon as I will get home`）·`word_order`（`I will as soon as get home call you`）·**`fragment`**（只写从句 `As soon as the rain stops.`）·**`run_on`**（两句连写无标点）·`verb_form`（`as soon as I getting home`）·`sv_agreement` | ✅ **6 类，含 `fragment`＋`run_on` 两个最薄档** |
| **`neither...nor`／`either...or`** | `sv_agreement`（`Neither of my brothers **likes**` ← 最经典）·`verb_form`（`Either you or he **is**` 的就近原则）·`word_order`（`Neither I like tea nor coffee.`）·**`fragment`**（并列第二段丢失）·**`run_on`**（并列粘连）·`preposition` | ✅ **6 类，含两个最薄档** |
| **`both...and`** | `sv_agreement`（`Both of my parents **are**`）·`verb_form`·`word_order`·`plural`（`Both of my parent`） | 🟡 4 类，**不带 `fragment`／`run_on`** |
| **`would rather`** | `verb_form`（`I would rather **to** stay.`／`I would rather **staying**.`）·`tense`（`would rather` 后跟原形）·`word_order`（`Would rather you stay?`）·`missing_be`（**薄档**）·`sv_agreement` | 🟡 **5 类，带 `missing_be` 一个薄档** |
| **`seem`／`appear`** | `sv_agreement`（`She **seem** tired`）·`missing_be`（**薄档**，`She seeming tired.`）·`verb_form`（`She seems **tiredly**` ← 与批二十的 `-ly` 错同型） | 🔴 **3 类，只带 `missing_be` 一个薄档**；**不带 `fragment`／`run_on`／`article`** |
| **`the same as`** | `preposition`（`the same **with**`／漏 `as`）·`word_order`·`verb_form`·`article`（**薄档**，`the same as **a** yours`） | 🟡 4 类 |
| **`shall we`／`why not`／`how about`** | `word_order`（`We shall go?` 缺 `shall` 前置）·`verb_form`（`How about **go** to the park?` ← L75 已教 `going`）·`missing_be`（**薄档**）·`fragment`（只写提议半句） | ✅ **4 类，带 `missing_be`＋`fragment` 两个薄档** |
| **感官 `like` 扩展** | `preposition`（`It sounds **as** a good idea.`）·`verb_form`（`It **sound** like rain.`）·`sv_agreement`（`It **smell** like rain.`）·**`missing_be`**（薄档，`It sounding like rain.`） | 🟡 4 类 |
| **方向 2 `have sth done`** | `verb_form`（`I will have my hair **cutting**`／`have my hair **cut**` 用错形）·`word_order`（`I will have cut my hair.` ← **与完成时同形，最经典**）·`tense`（`had my hair cut` 的过去）·`missing_be`（**薄档**）·`preposition`（`have my hair cut **by**`）·`sv_agreement`（`He **have** his car checked`） | ✅ **6 类，带 `missing_be`**；**不带 `fragment`／`run_on`／`article`**（句子太短） |

### 4.2 方向 2 的「同一个 `have`」对撞面（批二十一记录的复算 ＋ 新增）

**批二十一记**：「`have X done` 的 GL 命中全是现在完成时」。**本轮实读确认并补充邻居清单**：

| 课 | `targetSentence`／关键句 | 与 `have sth done` 的关系 |
|---|---|---|
| **L21** | `I have done my homework.` | 🔴 **真对撞**：`have` ＋ 过去分词 ＝ 现在完成时，**与 `have sth done` 的词形完全一样**（都是 `have` ＋ 过去分词），**只差中间有没有名词** |
| **L107** | `The teacher had me come early.` | 🟠 **近邻**：`had` ＋ 人 ＋ 原形，**同一个 `had` 的第二个用法**（批二十一未记这条） |
| **L108** | `I got him to go with me.` | 🟡 邻居：`got ＋ 人 ＋ to ＋ 原形`，「请人做」的第三种说法 |
| **L103–L106** | `makes me do`／`made me wait`／`doesn't let me go`／`lets him play` | 🟡 使役四脸（`make/let/have/get`），**`have sth done` 是「同一族的第 5 格」** |
| **L115／L116** | `I have got a new bike.`／`She has got a new bag.` | 🟡 `have got` 又一种 `have` |

> **实读裁定**：方向 2 的对撞面**比批二十一记的更深**——**L21 是「词形完全同」的真对撞，L107 是「同一个 had、同族」的近邻**。→ **方向 2 的「强干扰源」不是一条，是两条；且 L103–L110 已把「让」的四张脸讲完（`make/let/have/get`），`have sth done` 是第五格——须防「学生以为已经学过 `had`＋人」**。

---

## 5. cloze 落点预演

**方法**：**逐字复刻 + 真服务交叉验证**（不靠复刻自证）。
- 复刻 A：`grammarAmbushService.ts:160-213`（`GRAMMAR_WORDS` 正则 ＋ `CLOZE_STOP_WORDS` 30 词 ＋ 三级回退）
- 复刻 B：`grammarBoostService.ts:243-395`（`FUNCTION_WORDS` 33 词 ＋ `keywordIndexes` ＋ `buildCloze` 的种子化选位）
- **验证**：`vite-node` 直接 import 真服务，对 **5 个批二十一课**跑 `buildRevisitQuiz`／`buildBoostItems`，**ambush 10/10 逐字一致、boost 5/5 逐字一致**（复刻可信）。

### 5.1 ambush 侧（25 句候选，全实跑）

| 候选 | 句 | 档 | 空位 | 考点词是否落空 |
|---|---|---|---|---|
| `as soon as` | `I will call you as soon as I get home.` | ① | **`will`** | ❌ `soon` 逃逸 |
| `as soon as` | `As soon as the rain stops, we will go out.` | ① | **`As`** | ❌ `soon` 逃逸 |
| `as soon as` | `She smiles as soon as she sees the cake.` | ① | **`as`** | ❌ `soon` 逃逸 |
| `neither` | `Neither of my brothers likes coffee.` | ① | **`likes`** | ❌ `Neither` 逃逸 |
| `neither...nor` | `I like neither tea nor coffee.` | ① | **`like`** | ❌ `neither`／`nor` 逃逸 |
| `either...or` | `Either you or he is right.` | ① | **`is`** | ❌ `Either` 逃逸 |
| `both...and` | `Both of my parents are teachers.` | ① | **`are`** | ❌ `Both` 逃逸 |
| `would rather` | `I would rather stay at home today.` | ① | **`would`** | ❌ `rather` 逃逸 |
| `would rather not` | `She would rather not go out tonight.` | ① | **`would`** | ❌ `rather` 逃逸 |
| **`seem`** | `You seem tired today.` | **②** | **`seem`** | ✅ **命中！** |
| **`seems`** | `She seems happy at school.` | **②** | **`seems`** | ✅ **命中！** |
| **`seemed`** | `He seemed sad yesterday.` | **②** | **`seemed`** | ✅ **命中！** |
| `appear` | `The sky appears dark now.` | **②** | **`sky`** | ❌ `appears` 逃逸（`sky` 是第一个 ≥3 的非停用词） |
| `the same as` | `My bag is the same as yours.` | ① | **`is`** | ❌ `same` 逃逸 |
| `the same as` | `Her dress is the same as mine.` | ① | **`is`** | ❌ `same` 逃逸 |
| `shall we` | `Shall we go to the park?` | ① | **`Shall`** | ✅ 命中（但 `Shall` 在表内，是回退命中） |
| `why not` | `Why not take a taxi?` | ① | **`not`** | ❌ `Why`／`take` 逃逸 |
| `what about` | `What about a cup of tea?` | ① | **`about`** | ✅ 命中（`about` 在表内） |
| `sound like` | `It sounds like a good idea.` | ① | **`like`** | ❌ `sounds` 逃逸 |
| `smell like` | `It smells like rain.` | ① | **`like`** | ❌ `smells` 逃逸 |
| `taste like` | `This cake tastes like chocolate.` | ① | **`like`** | ❌ `tastes` 逃逸 |
| `feel like` | `It feels like spring today.` | ① | **`like`** | ❌ `feels` 逃逸 |
| **D2** | `I will have my hair cut tomorrow.` | ① | **`will`** | ❌ **`cut` 逃逸** |
| **D2** | `She had her bike repaired yesterday.` | ① | **`had`** | ❌ **`repaired` 逃逸** |
| **D2** | `I have my car checked every year.` | ① | **`have`** | ❌ **`checked` 逃逸** |

**统计**：
- **25/25 全走第①档或第②档**（第①档 22 句／第②档 3 句）
- **考点词命中率：4/25 ＝ 16%**（`seem`／`seems`／`seemed` 三句 ＋ `Shall`／`about` 两句回退命中）
- **方向 2 的三句：考点词命中率 0/3 ＝ 0%**（与批二十一的 `forward` 完全同病）

### 5.2 boost 侧（252 组种子，目标词可落率）

| 候选 | 句 | 目标词 | 可落率 | 候选位数 |
|---|---|---|---|---|
| `as soon as` | `I will call you as soon as I get home.` | `soon` | **20.2%** | 5 |
| `as soon as` | `As soon as the rain stops, we will go out.` | `soon` | **18.7%** | 5 |
| `neither` | `Neither of my brothers likes coffee.` | `Neither` | **22.2%** | 4 |
| `neither...nor` | `I like neither tea nor coffee.` | `nor` | **20.2%** | 5 |
| **`either...or`** | `Either you or he is right.` | `Either` | **52.4%** | **2** |
| `both...and` | `Both of my parents are teachers.` | `Both` | **32.1%** | 3 |
| `would rather` | `I would rather stay at home today.` | `rather` | **23.0%** | 5 |
| `would rather not` | `She would rather not go out tonight.` | `rather` | **23.0%** | 5 |
| **`seem`** | `You seem tired today.` | `seem` | **32.1%** | 3 |
| **`seems`** | `She seems happy at school.` | `seems` | **32.1%** | 3 |
| **`seemed`** | `He seemed sad yesterday.` | `seemed` | **32.1%** | 3 |
| `appear` | `The sky appears dark now.` | `appears` | **30.2%** | 4 |
| `the same as` | `My bag is the same as yours.` | `same` | **36.5%** | 3 |
| **`shall we`** | `Shall we go to the park?` | `Shall` | **52.4%** | **2** |
| `why not` | `Why not take a taxi?` | `not` | **30.2%** | 4 |
| `what about` | `What about a cup of tea?` | `about` | **30.2%** | 4 |
| `how about` | `How about going to the park?` | `about` | **30.2%** | 4 |
| `sound like` | `It sounds like a good idea.` | `like` | **30.2%** | 4 |
| `smell like` | `It smells like rain.` | `like` | **36.5%** | 3 |
| `taste like` | `This cake tastes like chocolate.` | `like` | **24.6%** | 4 |
| `feel like` | `It feels like spring today.` | `like` | **30.2%** | 4 |
| **D2** | `I will have my hair cut tomorrow.` | `cut` | **20.2%** | 5 |
| **D2** | `She had her bike repaired yesterday.` | `repaired` | **24.6%** | 4 |
| **D2** | `I have my car checked every year.` | `checked` | **20.2%** | 5 |

### 5.3 cloze 结论（可执行）

1. **方向 1 里只有 `seem`／`appear` 族是「ambush ＋ boost 双通道友好」**：ambush 侧 `seem/seems/seemed` 三句**全落考点词**（第②档），boost 侧 **32.1%**。→ **`seem`／`appear` 是唯一不需要额外护栏的候选**。
2. **`as soon as` 与 `neither/either/both` 的考点词在 ambush 侧 100% 逃逸**——须靠 `contrast`／`guided.spot`／`practice.distractors` 承载（与批二十一同一处置）。
3. **方向 2 与批二十一完全同病：`cut`／`repaired`／`checked` 在 ambush 侧 0% 命中、boost 侧仅 20–25%**。→ **若做方向 2，必须为每课配 ≥2 道 `contrast` 或 `guided.spot`**（G-boost 护栏 `grammarBoostService.test.ts:161-183` 已断言每课改错题 ≥2 道，是唯一的救命通道）。
4. **两个「落点极优」的形态可作设计抓手**：`Either you or he is right.`（候补位仅 2 个，`Either` 可落 **52.4%**）与 `Shall we go to the park?`（`Shall` **52.4%**）——**短句 = 少候选位 = 考点词可落率高**。**若方向 1 要「cloze 友好」，应优先选短句形态。**

---

## 6. 基建护栏

### 6.1 季分组（`grammarSeasons.ts`）

- **末项**：`:65` `{ id: "season-21", label: "第二十一季 · 盼着那一天", hint: "我盼着周末、她盼着夏天、盼着见到你——同一个 to，后面跟的那件事", min: 134, max: 138 }` ✅ **21 季**
- **下一个须续**：`season-22`（`min: 139`，`max` ＝ 本批末课）
- **守门测试**：`grammarSeasons.test.ts` **4 项**——`:12` 每课号落在某季区间（**忘加 season-22 立刻红**）／`:22` 区间互不重叠且 `min ≤ max`／`:36` `label`/`hint` 非空／`:43` 最高课号被覆盖

### 6.2 里程碑（`GrammarPathPage.tsx`）

- **末项**：`:276-282` `{ id: "can-do-m23", afterLesson: 138, title: "我能说出我盼着什么", zh: "盼着（look forward to）+ 换人换形…", samples: [...] }` ✅ **23 里程碑**
- **下一个须续**：`can-do-m24`（`afterLesson` ＝ 本批末课）
- **守门现状**：`can-do-m*` 的**测试引用数 ＝ 0**（`grep -rn "can-do-m" src --include=*.ts --include=*.tsx | grep -v GrammarPathPage.tsx` 无输出）——**纯纪律项、无守门**（沿用批二十一登记）

### 6.3 episode 与「换轴」基建

- **episode 末项**：`:25918` `"小美的一天 一百三十八"` ✅ → **下一个写「一百三十九」**
- **episode 序列连续性**：L131 `一百三十一`（`:24564`）→ L132 `一百三十二`（`:24758`）→ L133 `一百三十三`（`:24952`）→ L134 `一百三十四`（`:25142`）→ L135 `一百三十五`（`:25336`）→ L136 `一百三十六`（`:25530`）→ L137 `一百三十七`（`:25724`）→ L138 `一百三十八`（`:25918`）——**无跳号**
- **换轴基建（方向 3）**：`buildBoostItems` 真服务跑全库 138 课 × 3 档 ＝ **1,656 题**；**`listen` 138/138 课可用**（`grammarBoostService.ts:770-792`）；**`contrast`（对比判断）0/138 课**（不在 Boost 题型内）；**阅读理解/朗读类题型 0/138**（全库无）

### 6.4 案号与配比

| 项 | 值 |
|---|---|
| 最大案号 | **#147**（`hunt-two-stations`，`huntCases.ts:8140`）✅ |
| 连续性 | **1–147 连续无跳号无重号** ✅ |
| `reviewed` 覆盖率 | **147/147 ＝ 100%** ✅（**逐案核对，无缺字段**） |
| 每案错点数分布 | **4 处 124 案**·**2 处 10 案**·**3 处 10 案**·**5 处 2 案（#42／#43）**·**6 处 1 案（#34）** |
| 总错点 | **562** |
| **番外案名单（5 案，未被任何课引用）** | **#16 `hunt-white-cat`「朋友的白猫」（`:733`）／#17 `hunt-sports-day`「运动会」（`:791`）／#18 `hunt-pen-pal-letter`「写给笔友的信」（`:857`）／#19 `hunt-fridge-note`「冰箱上的便条」（`:916`）／#20 `hunt-term-review`「学期总结」（`:979`）** |
| **重名案（本轮新发现，须注意）** | **「冰箱上的便条」出现 3 次**：`#19 hunt-fridge-note`（`:916`）／`#21 hunt-kitchen-note`（`:1044`）／`#53 hunt-shop-note`（`:3369`）；**「最后一页」出现 2 次**：`#127 hunt-close-17`（`:7260`）／`#133 hunt-close-18`（`:7524`）——**id 全唯一（147 个唯一 id），但 `title` 有 2 组重名** |
| 空 `huntCaseIds` 的课 | **L2／L3／L5／L6／L8（5 课）** |
| 被两课引用的同一案 | **`hunt-my-sister`（L14 ＋ L25）**——**唯一一案两用** |
| 引用总数／唯一 id | **143 次／142 个唯一 id**（分配：1 案 **124 课**·2 案 **8 课**·3 案 **1 课**·0 案 **5 课**） |
| **批二十一 #143–#147 的罪名结构** | #143 `verb_form/preposition/tense/plural`（4 错，2 新 2 旧）·#144 `sv_agreement×3/article`（4 错）·#145 `verb_form/preposition/tense/plural`·#146 `verb_form×2/tense/plural`·**#147 `verb_form×2/sv_agreement/plural`（4/4 全回流）** |
| **下一个可用案号** | **#148**（若 5 课 → **#148–#152**） |

### 6.5 课号连续性

- **1–138 连续无跳号无重号** ✅（`grep -c "^    number:"` ＝ **138**；锚点数组逐项比对 `[1..138]` 完全一致）
- **下一个可用课号**：**L139**

---

## 7. 封面池专章

### 7.1 逐张使用次数（117 张）

| 统计项 | 值 |
|---|---|
| 封面资产总数 | **117 张**（`ls src/assets/lessons/ \| wc -l` ＝ **117**，`lesson-1.jpg`–`lesson-117.jpg`）✅ |
| 总用量 | **138 次**（138 课，**无课缺 `cover`**） |
| **单次张（用 1 次）** | **96 张 ＝ cover22–cover117** |
| **二用张（用 2 次）** | **21 张 ＝ cover1–cover21** |
| **三用张** | **0 张** |
| **二用对应关系** | **cover1→L1,L118 ／ cover2→L2,L119 ／ … ／ cover21→L21,L138**——**严格一一对应（`coverN` ↔ `L{N}` ＋ `L{N+117}`）** |

### 7.2 L139 起可用张清单

| 项 | 值 |
|---|---|
| **可用池（min-gap ≥ 35）** | **83 张：cover22–cover104** |
| 边界核查 | `cover104` 在 L139 的 gap ＝ 35（**压线过**）；**`cover105` 在 L139 的 gap ＝ 34，出局** |
| 为什么是 35 线 | 沿用批二十一起的 35 课最小间距纪律 |

### 7.3 最优指派建议（二分阈值 ＋ 全枚举）

| 批大小 | min-gap | 解数 | 指派 |
|---|---|---|---|
| **3 课（L139–L141）** | **117** | **1（唯一）** | `L139←cover22`／`L140←cover23`／`L141←cover24` |
| **4 课（L139–L142）** | **117** | **1（唯一）** | `L139←cover22`／`L140←cover23`／`L141←cover24`／`L142←cover25` |
| **5 课（L139–L143）** | **117** | **1（唯一）** | `L139←cover22`／`L140←cover23`／`L141←cover24`／`L142←cover25`／`L143←cover26` |
| **6 课（L139–L144）** | **117** | **1（唯一）** | 追加 `L144←cover27` |

> **实读裁定**：**任何批量的最优解都是「从 cover22 起连续取」，min-gap 恒为 117，且解数 ＝ 1（唯一）**。→ **本批的封面指派无争议空间**（与批二十一「cover17–cover21 唯一解」同型）。
>
> **⚠️ 携带项（须主理人注意）**：**批二十一交付后二用池已是 21 张；本批再取 K 张 → 二用池变为 21+K 张、单次张从 96 降为 96−K 张**。**若本批 5 课，二用池将达 26 张、单次张降至 91 张**。批二十一路线图 §6.3 携带项 1 已登记「建议主理人评估『三用』策略或新增封面」——**本批是该决策的第二个触发点**。
>
> **机制缺口（沿用登记）**：「课有 `cover` 但图缺失」不报红——**本轮实读 117 张资产全部存在**，但**机制缺口未补**。

---

## 8. G-boost 复核

**命令**：`npx vitest run src/services/grammarBoostService.test.ts src/services/grammarReviewService.test.ts`

**结果**：✅ **2 文件 / 67 项全绿**（boost **50 项**，4,281ms；review **17 项**，15ms）；总时长 5.57s。

**四条护栏逐条核对**：

| # | 护栏 | 断言位置 | 结果 |
|---|---|---|---|
| 1 | **改错题库：全库每课 ≥2 道可换** | `grammarBoostService.test.ts:161-183`（`thin` 数组断言为空） | ✅ **thin ＝ 0 课** |
| 2 | **`guided.spot` 的 `wrongToken` 必能定位** | `:185-198` | ✅ **违规 0** |
| 3 | **`contrast` 的 `wrongMark` 不得是纯标点** | `:199-210` | ✅ **违规 0** |
| 4 | **cloze 干扰项不得是伪造词 / 缩略词答案干扰项应同族** | `:774-830`（`describe("cloze 干扰项质量")`，`:788` ＋ `:813`） | ✅ **全绿** |
| **5（新增）** | **复习卡 cloze 干扰项必须是真实存在的词** | `grammarReviewService.test.ts:298-328`（banned 正则含 `forwardes`／`lookinged`／`coldes`／`weekendes`／`seeings` 等；用 5 句实测） | ✅ **绿**（**这是批二十一交付期新增的断言，本轮确认在位**） |

> **实读裁定**：**批二十一登记的四条护栏 ＋ 新增的第 5 条全部在位且全绿**。**关键点**：**第 5 条断言的 5 个测试句里包含批二十一的 3 句**（`I am looking forward to the weekend.`／`She looks forward to the summer.`／`I am looking forward to seeing you.`）——**本批若做方向 1／2，须把这 5 条测试句扩展到新候选**（如 `I will have my hair cut tomorrow.` → 须确认不产出 `cuted`／`haircuted`）。**这是本批的护栏扩面动作**。

**测试基线**：`npx vitest run` → ✅ **61 文件 / 799 项全绿**（批二十一为 61/798，**+1 项 ＝ 上述新增断言**）；`npx tsc --noEmit` → ✅ **exit 0，0 错**。

---

## 9. 可生产性评估

### 9.1 三方向可生产性对照

| 维度 | 方向 1（复现型大章） | 方向 2（`have sth done`） | 方向 3（换轴：读写/听力） |
|---|---|---|---|
| **造词成本** | 最小 **2**（`seem`／`appear`）；最大 **4**（`neither/either/both/nor`） | **8（不可压缩）** | **0（听力轴）**；阅读轴须新引擎 |
| **cloze 友好度** | 🟡 `seem` 族 **双通道友好**；`as soon as`／`neither` 族 ambush **0% 命中** | 🔴 **ambush 0% 命中**（与批二十一 `forward` 同病） | —（非 cloze 轴） |
| **罪名承载** | ✅ `as soon as`／`neither` 族可带 **`fragment`＋`run_on` 两个最薄档** | 🟡 6 类但**不带 `fragment`／`run_on`／`article`** | — |
| **结构判据** | 🔴 **无字段可承载「复现型」**（§3.3）——须新增字段或用文案纪律 | ✅ 形态明确（C 档、Murphy U46 跨级） | 🟡 「换轴」的交付物形态须定义 |
| **先例** | 🟡 **「整章复现」零先例**（现有大章都是「1 课收口」）；「连续两案全回流」零先例 | ✅ 有先例（批次型态不变，只是新结构） | 🟡 **无内容批次先例**（项目史上无「换轴批」） |
| **基建依赖** | ✅ 无（只需 season-22／m24／covers） | ✅ 无 | 🟡 **听力轴无依赖（`listen` 138/138）；阅读轴须新引擎** |
| **风险等级** | **中高**（判据缺失 ＋ 形态零先例） | **中**（成本高但形态清楚） | **中**（基建现成但交付物形态未定义） |

### 9.2 数析的建议（数据说话，不越权裁决）

1. **若选方向 1**：
   - **最省的选择是 `seem`／`appear`**（2 新词、0 附带、cloze 双通道友好、与 L128 同骨架）——**是本项目「造词课」形态的自然延续**。
   - **须先裁「复现型」的形态定义**：数据上没有字段判据（§3.3），**建议要么新增 `GrammarLesson.recap?: true` 之类的字段并加守门断言，要么明确「复现型章 ＝ N 课连排的收口课，靠 `grammarLabel` 文案纪律」**。
   - **`as soon as` 的入伙代价被低估**：不是「造 `soon` 一个词」，而是「`as` 的第三义 ＋ 与 `when`（267 处）切开」（§1.3）。
   - **`neither/either/both` 成本最高（4 新词）且家族最薄（只有 L19／L20 两课可复现）**——**数据上最不推荐**。

2. **若选方向 2**：
   - **成本是批二十一的 4 倍（8 新词 vs 2）**，且**有 1 个反向干扰源**（`have my` GL 1，L23 `:4171`）。
   - **对撞面比批二十一记的更深**：L21「词形完全同」＋ L107「同一个 `had`」（§4.2）。
   - **省成本的办法**：被修的东西用 `bike`（76）/`window`（159）而非 `hair`（0）/`shoes`（0）。
   - **须先裁两件事**（批二十一已登记）：① 是否接受跨级（Murphy 中级 U46）；② `'ll` 缩写是否单列一课（**本轮实读：`'ll` 在库 0 处，整个库从无这个缩写**）。

3. **若选方向 3**：
   - **听力轴基建 100% 就位**（`listen` 138/138 课可用、素材现成 **528 组**可用 `contrast` 句对（全库 828 组 − 300 条 bothRight）、**0 新词**）。
   - **缺口在「读」侧**：全库无阅读理解/朗读题型（0/138）；最接近的是 `translate`（125/138）。
   - **须定义交付物形态**：是「新题型」（引擎改动）还是「内容批次」（用现成 `listen` 出课）。

### 9.3 三方向的「一票否决项」

| 方向 | 一票否决项（若有则不建议做） |
|---|---|
| **方向 1** | **「复现型」无数据判据**（§3.3）——若主理人不接受「新增字段」也不接受「纯文案纪律」，则整章复现不可验证、不可守门，**建议降级为「连续 2–3 课收口课」而非「大章」** |
| **方向 2** | **8 新词 ＋ 跨级（U46）** ——若主理人不接受跨级，**直接出局**（BC 三档 68 课零课位，本批无合法落点） |
| **方向 3** | **交付物形态未定义** ——若走「阅读」则须新引擎（**本轮无法估工**）；若走「听力」则**无否决项**（基建现成） |

---

## 附录：核查留痕

### A0. 全库 138 课 `grammarLabel` ＋ `targetSentence` 全量表（逐课，带行号）

> 本表为 §3.1 的完整版（任务书要求「138 课全量」）。**行号口径**：`grammarLabel`／`targetSentence`／`episode` 三个字段在文件中的实际行号。**这张表是判断「哪些结构可做复现型」的原始依据**——按本表可一次性看出：哪些结构已被多课占用（如 `be` 动词族 L1/L2/L7/L8/L33/L50–L54/L87）、哪些结构从未有课（`as soon as`／`neither...nor`／`would rather`／`seem`）。

| 课 | `grammarLabel`（行号） | `targetSentence`（行号） | episode |
|---|---|---|---|
| **L1** | `be 动词 · I am` (`:141`) | `I am Xiaomei.` (`:149`) | 小美的一天 ① |
| **L2** | `be 动词 · you are / he is` (`:313`) | `He is my brother.` (`:321`) | 小美的一天 ② |
| **L3** | `have + a` (`:495`) | `I have a new bag.` (`:503`) | 小美的一天 ③ |
| **L4** | `want + a / an` (`:677`) | `I want a milk tea.` (`:685`) | 小美的一天 ④ |
| **L5** | `like + 名词` (`:859`) | `I like music.` (`:867`) | 小美的一天 ⑤ |
| **L6** | `It is · 时间与天气` (`:1040`) | `It is three o'clock.` (`:1048`) | 小美的一天 ⑥ |
| **L7** | `be 动词 · we are / they are` (`:1222`) | `We are happy.` (`:1230`) | 小美的一天 ⑦ |
| **L8** | `物主词 my / her` (`:1403`) | `She is my friend.` (`:1411`) | 小美的一天 ⑧ |
| **L9** | `go to + 地点` (`:1585`) | `I go to the library.` (`:1593`) | 小美的一天 ⑨ |
| **L10** | `说昨天的事` (`:1767`) | `Yesterday I went to the park.` (`:1775`) | 小美的一天 ⑩ |
| **L11** | `好几个 + 特殊的昨天版` (`:1949`) | `I ate two sandwiches.` (`:1957`) | 小美的一天 ⑪ |
| **L12** | `will 将来时` (`:2131`) | `I will draw tomorrow.` (`:2139`) | 小美的一天 ⑫ |
| **L13** | `正在做 · am/is/are + 动词ing` (`:2314`) | `I am drawing a picture.` (`:2322`) | 小美的一天 ⑬ |
| **L14** | `能 · can` (`:2497`) | `Can I have a milk tea?` (`:2505`) | 小美的一天 ⑭ |
| **L15** | `want to + 原样` (`:2681`) | `I want to travel.` (`:2689`) | 小美的一天 ⑮ |
| **L16** | `必须 · must / have to` (`:2865`) | `I must finish my homework today.` (`:2873`) | 小美的一天 ⑯ |
| **L17** | `比一比 · -er / more` (`:3048`) | `This boat is bigger than that one.` (`:3056`) | 小美的一天 ⑰ |
| **L18** | `在哪儿 · in / on / at` (`:3232`) | `My hat is in the box.` (`:3240`) | 小美的一天 ⑱ |
| **L19** | `连词 · and / but` (`:3415`) | `I was busy and happy.` (`:3423`) | 小美的一天 ⑲ |
| **L20** | `连词 · because / so` (`:3598`) | `I was late because the bus was late.` (`:3606`) | 小美的一天 ⑳ |
| **L21** | `做过了 · have + 做过版` (`:3782`) | `I have done my homework.` (`:3790`) | 小美的一天 ㉑ |
| **L22** | `去过 / 见过 · have been to` (`:3965`) | `I have been to Beijing.` (`:3973`) | 小美的一天 ㉒ |
| **L23** | `弄丢了 / 弄坏了 · have + 做过版` (`:4147`) | `I have lost my key.` (`:4155`) | 小美的一天 ㉓ |
| **L24** | `对比 · 昨天版 vs 做过版` (`:4330`) | `Yesterday I went to the park.` (`:4338`) | 小美的一天 ㉔ |
| **L25** | `每天都做 · 他/她/它加 -s` (`:4513`) | `He drinks milk every day.` (`:4521`) | 小美的一天 ㉕ |
| **L26** | `存在句 · there is / there are` (`:4706`) | `There is a book on the desk.` (`:4714`) | 小美的一天 ㉖ |
| **L27** | `疑问词 · what / where / when / how` (`:4890`) | `What are you looking for?` (`:4898`) | 小美的一天 ㉗ |
| **L28** | `多久一次 · always / often / never` (`:5074`) | `I always arrive early.` (`:5082`) | 小美的一天 ㉘ |
| **L29** | `将来时 · be going to` (`:5259`) | `I am going to watch a movie.` (`:5267`) | 小美的一天 ㉙ |
| **L30** | `数量词 · some / any / much / many` (`:5442`) | `There are some apples on the table.` (`:5450`) | 小美的一天 ㉚ |
| **L31** | `最能比 · -est / most` (`:5626`) | `I want the biggest apple.` (`:5634`) | 小美的一天 ㉛ |
| **L32** | `祈使句 · 动词开头` (`:5809`) | `Close the door.` (`:5817`) | 小美的一天 ㉜ |
| **L33** | `指示代词 · this / that / these / those` (`:5991`) | `This one is mine.` (`:5999`) | 小美的一天 ㉝ |
| **L34** | `那时正在做 · was/were + 动词ing` (`:6174`) | `I was drawing at three.` (`:6182`) | 小美的一天 ㉞ |
| **L35** | `话中话 · 问句回家换鞋` (`:6357`) | `I know where it is.` (`:6365`) | 小美的一天 ㉟ |
| **L36** | `话中话 · 小挂件 that` (`:6541`) | `I think she is tired.` (`:6549`) | 小美的一天 ㊱ |
| **L37** | `话中话 · 引子可以换人` (`:6727`) | `I don't know where he is.` (`:6735`) | 小美的一天 ㊲ |
| **L38** | `话中话 · 转述别人的话` (`:6912`) | `She says she will come.` (`:6920`) | 小美的一天 ㊳ |
| **L39** | `给名词挂尾巴 · who` (`:7095`) | `The boy who wears glasses is my brother.` (`:7103`) | 小美的一天 ㊴ |
| **L40** | `给名词挂尾巴 · which` (`:7279`) | `This is the book which I read.` (`:7287`) | 小美的一天 ㊵ |
| **L41** | `收口 · 两句话拼一句` (`:7463`) | `I know the boy who wears glasses.` (`:7471`) | 小美的一天 ㊶ |
| **L42** | `动词的第二份工作 · -ing` (`:7647`) | `I like reading.` (`:7655`) | 小美的一天 ㊷ |
| **L43** | `让事情当主角 · -ing 开头` (`:7835`) | `Swimming is fun.` (`:7843`) | 小美的一天 ㊸ |
| **L44** | `小垫板新用法 · to + 去做什么` (`:8021`) | `I go to the shop to buy milk.` (`:8029`) | 小美的一天 ㊹ |
| **L45** | `enjoy 的门 · 只认 -ing` (`:8208`) | `I enjoy reading.` (`:8216`) | 小美的一天 ㊺ |
| **L46** | `收口 · 名字版 + 小垫板` (`:8394`) | `I enjoy reading and I want to travel.` (`:8402`) | 小美的一天 ㊻ |
| **L47** | `情态三兄弟 · should` (`:8580`) | `You should sleep early.` (`:8588`) | 小美的一天 ㊼ |
| **L48** | `条件句 · if 里说现在` (`:8767`) | `If it rains, I will stay at home.` (`:8775`) | 小美的一天 ㊽ |
| **L49** | `收口 · 建议 + 条件` (`:8954`) | `You should take an umbrella if it rains.` (`:8962`) | 小美的一天 ㊾ |
| **L50** | `幕后句 · 谁做的不重要` (`:9142`) | `My cup was broken.` (`:9150`) | 小美的一天 ㊿ |
| **L51** | `幕后句 · 好几个的搭档` (`:9330`) | `The windows were cleaned yesterday.` (`:9338`) | 小美的一天 五十一 |
| **L52** | `幕后句 · 想说谁就垫 by` (`:9518`) | `The cake was eaten by my brother.` (`:9526`) | 小美的一天 五十二 |
| **L53** | `幕后句 · 已经做过了` (`:9705`) | `The window has been cleaned.` (`:9713`) | 小美的一天 五十三 |
| **L54** | `收口 · 谁重要谁上台` (`:9893`) | `The pictures were taken by the teacher.` (`:9901`) | 小美的一天 五十四 |
| **L55** | `第几个 · first / second / third` (`:10083`) | `He is the first to come.` (`:10091`) | 小美的一天 五十五 |
| **L56** | `月份 · in May` (`:10272`) | `My birthday is in May.` (`:10280`) | 小美的一天 五十六 |
| **L57** | `日期 · on October 1` (`:10462`) | `School starts on October 1.` (`:10470`) | 小美的一天 五十七 |
| **L58** | `做事的样子 · 动词后面加 -ly` (`:10651`) | `She runs quickly.` (`:10659`) | 小美的一天 五十八 |
| **L59** | `不按 -ly 走的两个常客 · good→well、fast→fast` (`:10838`) | `She sings very well.` (`:10846`) | 小美的一天 五十九 |
| **L60** | `回忆版存在句 · there was / there were` (`:11025`) | `There was a bird in the park.` (`:11033`) | 小美的一天 六十 |
| **L61** | `客气请求 · Could you…?` (`:11215`) | `Could you help me?` (`:11223`) | 小美的一天 六十一 |
| **L62** | `客气想要 · would like` (`:11405`) | `I would like a cup of tea.` (`:11413`) | 小美的一天 六十二 |
| **L63** | `给东西 · give me the book / give it to me` (`:11594`) | `Please give me the book.` (`:11602`) | 小美的一天 六十三 |
| **L64** | `收尾动词 · finish + 名字版` (`:11783`) | `I finished reading the book.` (`:11791`) | 小美的一天 六十四 |
| **L65** | `一样 · as tall as` (`:11972`) | `He is as tall as me.` (`:11980`) | 小美的一天 六十五 |
| **L66** | `太…了装不下 · too…to` (`:12161`) | `It is too heavy to carry.` (`:12169`) | 小美的一天 六十六 |
| **L67** | `擅长 · good at + 名字版` (`:12349`) | `I am good at drawing.` (`:12357`) | 小美的一天 六十七 |
| **L68** | `买给谁 · buy sb sth / buy sth for sb` (`:12539`) | `I bought a gift for my mom.` (`:12547`) | 小美的一天 六十八 |
| **L69** | `客气第四档 · Would you mind + 名字版` (`:12729`) | `Would you mind opening the window?` (`:12737`) | 小美的一天 六十九 |
| **L70** | `提供 · Would you like…? + Yes, please / No, thanks` (`:12918`) | `Would you like some tea?` (`:12926`) | 小美的一天 七十 |
| **L71** | `够 · enough 站词后` (`:13107`) | `The bag is light enough to carry.` (`:13115`) | 小美的一天 七十一 |
| **L72** | `多久一次 · How often + 答语词块` (`:13297`) | `How often do you run?` (`:13305`) | 小美的一天 七十二 |
| **L73** | `要花多久 · How long does it take? + It takes…` (`:13486`) | `How long does it take?` (`:13494`) | 小美的一天 七十三 |
| **L74** | `让我来 · Let me / help + 动作穿原样` (`:13675`) | `Let me help you.` (`:13683`) | 小美的一天 七十四 |
| **L75** | `提议 · Let's + 动作穿原样` (`:13864`) | `Let's go to the park.` (`:13872`) | 小美的一天 七十五 |
| **L76** | `加力 · much + 更…` (`:14053`) | `I feel much better today.` (`:14061`) | 小美的一天 七十六 |
| **L77** | `习惯不停 · keep + 名字版` (`:14243`) | `I keep doing my homework.` (`:14251`) | 小美的一天 七十七 |
| **L78** | `收口 · 跨季大团圆（零新知）` (`:14432`) | `I run every day, and I keep reading.` (`:14440`) | 小美的一天 七十八 |
| **L79** | `位置词 · next to` (`:14623`) | `My desk is next to the window.` (`:14631`) | 小美的一天 七十九 |
| **L80** | `位置词 · in front of / behind` (`:14814`) | `The cat is behind the door.` (`:14822`) | 小美的一天 八十 |
| **L81** | `位置词 · between A and B` (`:15004`) | `I sit between Tom and Amy.` (`:15012`) | 小美的一天 八十一 |
| **L82** | `放 · put（三态同形）` (`:15194`) | `I put my bag next to the door.` (`:15202`) | 小美的一天 八十二 |
| **L83** | `不点名的东西 · something / anything` (`:15384`) | `I have something for you.` (`:15392`) | 小美的一天 八十三 |
| **L84** | `不点名的东西 · nothing / someone` (`:15574`) | `There is nothing in the box.` (`:15582`) | 小美的一天 八十四 |
| **L85** | `问东西的主人 · whose` (`:15764`) | `Whose book is this?` (`:15772`) | 小美的一天 八十五 |
| **L86** | `收口 · 大团圆（零新知）` (`:15955`) | `Whose bag is this? It is next to the door.` (`:15963`) | 小美的一天 八十六 |
| **L87** | `两个词挤一挤 · It's` (`:16145`) | `It's cold today.` (`:16153`) | 小美的一天 八十七 |
| **L88** | `名词穿外套 · windy / snowy / cloudy` (`:16335`) | `It's windy today.` (`:16343`) | 小美的一天 八十八 |
| **L89** | `多好的… · What a + 东西` (`:16525`) | `What a nice day!` (`:16533`) | 小美的一天 八十九 |
| **L90** | `先后 · after + 小句子` (`:16714`) | `After I do my homework, I watch TV.` (`:16722`) | 小美的一天 九十 |
| **L91** | `先后 · before + 小句子` (`:16903`) | `Before I eat, I wash my hands.` (`:16911`) | 小美的一天 九十一 |
| **L92** | `什么时候 · when + 小句子` (`:17092`) | `When it is sunny, I run.` (`:17100`) | 小美的一天 九十二 |
| **L93** | `从前常这样 · used to` (`:17281`) | `I used to play here.` (`:17289`) | 小美的一天 九十三 |
| **L94** | `收口 · 大团圆（零新知）` (`:17470`) | `It's cold today. What a nice day!` (`:17478`) | 小美的一天 九十四 |
| **L95** | `那时正做着 · was + 穿 -ing` (`:17659`) | `I was reading at eight.` (`:17667`) | 小美的一天 九十五 |
| **L96** | `背景句 · It was + 穿 -ing` (`:17850`) | `It was raining.` (`:17858`) | 小美的一天 九十六 |
| **L97** | `那时候 · when + 当时正做着` (`:18040`) | `When you called, I was reading.` (`:18048`) | 小美的一天 九十七 |
| **L98** | `两件同时 · while + 都在穿 -ing` (`:18229`) | `While I was reading, he was sleeping.` (`:18237`) | 小美的一天 九十八 |
| **L99** | `哪件用哪个版本 · 进行 vs 昨天版` (`:18418`) | `I was reading when the phone rang.` (`:18426`) | 小美的一天 九十九 |
| **L100** | `讲故事 · used to 回讲` (`:18608`) | `I used to play here every day.` (`:18616`) | 小美的一天 一百 |
| **L101** | `一句接一句 · 混排（then 认读）` (`:18798`) | `I was reading. It was raining. When you called, I was reading.` (`:18806`) | 小美的一天 一百零一 |
| **L102** | `收口 · 大团圆（零新知）` (`:18989`) | `I was reading at eight. It was raining. When you called, I was reading.` (`:18997`) | 小美的一天 一百零二 |
| **L103** | `让某人做 · makes + 动作穿原样` (`:19179`) | `My mom makes me do my homework.` (`:19187`) | 小美的一天 一百零三 |
| **L104** | `昨天版的「让」 · made + 动作穿原样` (`:19366`) | `He made me wait.` (`:19374`) | 小美的一天 一百零四 |
| **L105** | `不让做 · doesn't + let + 动作穿原样` (`:19553`) | `She doesn't let me go.` (`:19561`) | 小美的一天 一百零五 |
| **L106** | `让谁做 · lets + 人名 + 动作穿原样` (`:19740`) | `She lets him play after dinner.` (`:19748`) | 小美的一天 一百零六 |
| **L107** | `让我做 · had + 人名 + 动作穿原样` (`:19927`) | `The teacher had me come early.` (`:19935`) | 小美的一天 一百零七 |
| **L108** | `费了口舌请动 · got him to + 垫一块垫板` (`:20114`) | `I got him to go with me.` (`:20122`) | 小美的一天 一百零八 |
| **L109** | `等到…为止 · until + 小句子` (`:20301`) | `I waited until the rain stopped.` (`:20309`) | 小美的一天 一百零九 |
| **L110** | `收口 · 四张脸排一行` (`:20488`) | `My mom makes me do my homework.` (`:20496`) | 小美的一天 一百一十 |
| **L111** | `谁的 · 人后面加撇号 s` (`:20682`) | `Grandma's birthday is in May.` (`:20690`) | 小美的一天 一百一十一 |
| **L112** | `长版 vs 短版 · mine 自己站，撇号 s 贴东西` (`:20876`) | `This book is mine.` (`:20884`) | 小美的一天 一百一十二 |
| **L113** | `感到版 vs 让人版 · -ed 说感到、-ing 说它让人` (`:21070`) | `I am bored.` (`:21078`) | 小美的一天 一百一十三 |
| **L114** | `还有几个 vs 几乎没了 · a 在不在，意思反一半` (`:21265`) | `There are a few apples.` (`:21273`) | 小美的一天 一百一十四 |
| **L115** | `轻口气的「有」 · have got` (`:21459`) | `I have got a new bike.` (`:21467`) | 小美的一天 一百一十五 |
| **L116** | `换人换形 · has got（缩起来 's got）` (`:21653`) | `She has got a new bag.` (`:21661`) | 小美的一天 一百一十六 |
| **L117** | `合体 · 四种说法排一行` (`:21847`) | `Grandma's birthday is in May.` (`:21855`) | 小美的一天 一百一十七 |
| **L118** | `收口 · 零新知（六行排一行）` (`:22043`) | `Grandma's birthday is in May.` (`:22051`) | 小美的一天 一百一十八 |
| **L119** | `习惯了 · be used to + 东西` (`:22239`) | `I am used to the cold.` (`:22247`) | 小美的一天 一百一十九 |
| **L120** | `做的事穿名字版 · be used to + -ing` (`:22433`) | `I am used to getting up early.` (`:22441`) | 小美的一天 一百二十 |
| **L121** | `慢慢习惯 · get used to（过程）` (`:22627`) | `I am getting used to it.` (`:22635`) | 小美的一天 一百二十一 |
| **L122** | `两张脸排一行 · used to vs be used to` (`:22821`) | `I used to walk to school.` (`:22829`) | 小美的一天 一百二十二 |
| **L123** | `说不和问 · not 跟 be 走、Are 搬句首` (`:23015`) | `I am not used to it.` (`:23023`) | 小美的一天 一百二十三 |
| **L124** | `收口 · 零新知（四句排一行）` (`:23209`) | `I used to walk to school.` (`:23217`) | 小美的一天 一百二十四 |
| **L125** | `看起来怎样 · look 中间站，后面跟「怎么样」` (`:23399`) | `It looks nice.` (`:23407`) | 小美的一天 一百二十五 |
| **L126** | `换人换形 · you look / she looks` (`:23593`) | `You look tired.` (`:23601`) | 小美的一天 一百二十六 |
| **L127** | `收口 · 零新知（喊人看 vs 说样子）` (`:23787`) | `The sky looks dark.` (`:23795`) | 小美的一天 一百二十七 |
| **L128** | `听起来 · sounds 自己站中间` (`:23981`) | `It sounds great.` (`:23989`) | 小美的一天 一百二十八 |
| **L129** | `闻着 · smells good（不说 well）` (`:24175`) | `It smells good.` (`:24183`) | 小美的一天 一百二十九 |
| **L130** | `尝着 · tastes good（也不加 -ly）` (`:24369`) | `This cake tastes good.` (`:24377`) | 小美的一天 一百三十 |
| **L131** | `摸着 · feels cold（手的感觉）` (`:24563`) | `The water feels cold.` (`:24571`) | 小美的一天 一百三十一 |
| **L132** | `说不和问 · 帮手出场，感官词退回原样` (`:24757`) | `Does it sound good?` (`:24765`) | 小美的一天 一百三十二 |
| **L133** | `收口 · 零新知（五张脸排一行）` (`:24951`) | `It looks nice.` (`:24959`) | 小美的一天 一百三十三 |
| **L134** | `盼着 · look forward to + 那件事` (`:25141`) | `I am looking forward to the weekend.` (`:25149`) | 小美的一天 一百三十四 |
| **L135** | `换人换形 · looks forward to（她配 s）` (`:25335`) | `She looks forward to the summer.` (`:25343`) | 小美的一天 一百三十五 |
| **L136** | `盼的是做某事 · forward to + 名字版` (`:25529`) | `I am looking forward to seeing you.` (`:25537`) | 小美的一天 一百三十六 |
| **L137** | `说不和问 · Are 搬句首、not 跟 be 走` (`:25723`) | `Are you looking forward to the summer?` (`:25731`) | 小美的一天 一百三十七 |
| **L138** | `收口 · 零新知（习惯了的 to vs 盼着的 to）` (`:25917`) | `I am used to getting up early.` (`:25925`) | 小美的一天 一百三十八 |

---

### A1. 实读源文件清单 ＋ md5

| 文件 | 行数 | md5 | mtime |
|---|---|---|---|
| `src/data/grammarLessons.ts` | **26,108** | **`2e5f2935f1ce4dea82e8f73e7a4acade`** | 2026-09-19 21:54 |
| `src/data/huntCases.ts` | **8,181** | **`a380680f4a8f93a8df38055d00b40b2c`** | 2026-09-19 21:49 |
| `src/data/grammarSeasons.ts` | **65** | `981646310cb325848c9e590a8f9071f1` | — |
| `src/services/grammarAmbushService.ts` | — | `84b306b40e881c4f9b8c8d000851686c` | — |
| `src/services/grammarBoostService.ts` | — | `d9387d72011582a5da974e2a5a1cd526` | — |
| `src/services/grammarReviewService.ts` | — | `94074334c73cb549d81d73a2cbbea61a` | — |
| `src/pages/GrammarPathPage.tsx` | — | `1dfbe02f79d3ab60b0bb149c65c395dd` | — |
| `src/types.ts` | — | `5c0a8679f9b695e05bddd88ddeada597` | — |
| `src/assets/lessons/` | **117 个 jpg** | — | — |

**审计工具（临时，**已跑完即删**）**：`.audit22.py`（状态机提取器 ＋ 词/串查询，含 `stats`／`word`／`phrase` 三个子命令）、`/tmp/probe22_cloze.ts`（cloze 落点复刻 ＋ 真服务交叉验证）、`/tmp/probe22_rate.ts`（252 组种子的 boost 落点率）、`/tmp/probe22_infra.ts`（全库三档题量统计）、`/tmp/l22_lessons.txt`（138 课全量表 → **已全量落进本报告 §附录 A0**）、`/tmp/l22_newword.txt`（首现词逐课表）。

> **可复现性声明**：本报告的**全部原始数据**都可从工作区当前文件重算（md5 见上表）——提取器口径已在 §A2 写全（六态 ＋ id 串剔除规则），cloze 复刻已在 §A3 用真服务验证过。**临时脚本已删，不留残留物**（`git status` 的 159 条均为原有改动，本盘点未新增任何被跟踪文件，只新增本报告一个 md）。

### A2. 提取器口径与校验

| 项 | GL | HC |
|---|---|---|
| 顶层块数（`number:` 锚点） | **138** | **147** |
| 引号内字符串总数 | **25,051** | **5,997** |
| 剔除 id 串后（实词口径） | **24,770** | **5,850** |
| 英文口径（`^[A-Za-z0-9'’,.!?;: -]+$`） | **15,620** | **4,757** |
| id 串剔除数 | **281** | **147** |

**假阳性核查（本批最容易踩的坑，逐条留痕）**：
1. **`both`**：裸 `grep -o -i "both" src/data/grammarLessons.ts` ＝ **300**；`grep -o -i "both[a-zA-Z]*" \| sort \| uniq -c` ＝ **`300 bothRight`**（**唯一形态**）；排除 `bothRight` 后 ＝ **0**。→ **报告采用「剔除后 0」**。**这是本批最大的假阳性陷阱。**
2. **`same`**：裸 grep ＝ 2（GL）／1（HC），**经实读逐句确认为真词**（`They look the same!`／`Are they the same?`）。
3. **`have my`**：GL 1 处 ＝ L23 `:4171`，**实读为真词**（普通 have 义）。
4. **`as`**：GL 70 处**全为真词**（`as tall as` 结构）。

### A3. 真服务交叉验证（复刻可信度）

| 引擎 | 验证方式 | 结果 |
|---|---|---|
| ambush `pickClozeWord` | `vite-node` import 真服务，对 **5 个批二十一课**跑 `buildRevisitQuiz`，与我的复刻逐字比对 | ✅ **10/10 一致** |
| boost `buildCloze` | 同法跑 `buildBoostItems(id, 1, {})`，与我的复刻逐字比对（含 `clozeOptions`） | ✅ **5/5 一致** |

**真服务实跑输出（批二十一 5 课的 ambush cloze 空位）**：

```
lesson-134-looking-forward-to-the-weekend  → I ___ looking forward to the weekend. / am ; ___ you looking forward to the weekend? / Are
lesson-135-she-looks-forward-to            → She ___ forward to the summer. / looks ; ___ she look forward to the summer? / Does
lesson-136-looking-forward-to-seeing-you   → I ___ looking forward to seeing you. / am ; ___ you looking forward to seeing her? / Are
lesson-137-are-you-looking-forward-to      → You ___ looking forward to the summer. / are ; ___ you looking forward to the summer? / Are
lesson-138-two-stations                    → I ___ used to getting up early. / am ; ___ you looking forward to the summer? / Are
```

### A4. 实跑命令与结果

| 命令 | 结果 |
|---|---|
| `npx vitest run src/services/grammarBoostService.test.ts src/services/grammarReviewService.test.ts` | ✅ **2 文件 / 67 项**（boost 50 ＋ review 17） |
| `npx vitest run`（全量） | ✅ **61 文件 / 799 项全绿**，8.07s |
| `npx tsc --noEmit` | ✅ **exit 0**（0 错） |
| `npx vite-node /tmp/probe22_cloze.ts` | ✅ ambush 10/10 ／ boost 5/5 一致 ＋ 25 句候选实跑 |
| `npx vite-node /tmp/probe22_rate.ts` | ✅ 24 候选 × 252 组种子 |
| `npx vite-node /tmp/probe22_infra.ts` | ✅ 138 课 × 3 档 ＝ 1,656 题 |

### A5. 未核实项

| # | 未核实项 | 原因 | 影响 |
|---|---|---|---|
| **U1** | **`git status` 有 159 条未提交改动（首次统计时 160 条，含本报告自身 —— 扣掉后 159）**（`src/data/` 4 个文件 ＋ `src/pages/` 多个） | **工作区未提交**——本报告的全部数字取自**当前工作区文件**（md5 已登记），**不是任何 git 提交态** | **若生产期有人改动 GL/HC，本报告数字须重跑**（批二十一的教训：审计期被并行改动过一次） |
| **U2** | **`comparison` 死枚举的归属** | `types.ts:419-430` 存在 `GrammarErrorTag` 含 `comparison`，但 `GRAMMAR_ERROR_TAGS`（`huntService.ts:331-342`）10 元不含它；**HC 实读 0 处** | 沿用批十八起口径：**本批继续不用** |
| **U3** | **`as soon as` 与 `when` 的「语义切开」难度** | **纯语言学判断，非数据**——本盘点只给「`when` 267 处、五格占满」的事实 | 须由瑞思／析客裁 |
| **U4** | **方向 3「阅读轴」的工程量** | **全库无阅读理解题型**（0/138）；本盘点未评估新引擎工量 | 若选阅读轴，**工量未知** |
| **U5** | **`seem`／`appear` 的上游课程位** | 批二十一记「BC 三档 68 课零感官动词课；Murphy 最近邻只到中级 U67」——**本轮未复核上游** | 段位依据须瑞思／竞析另出 |
| **U6** | **`neither/either/both` 的中文侧落点** | 本轮未查中文侧（`causative-verbs` 那类节级落点） | 方向 1 若选此项，须补中文侧核查 |
| **U7** | **封面图像语义未二次目视** | 本轮只统计张号与用量，**未看图像内容** | 沿用批二十一登记（① 风险） |
| **U8** | **`can-do-m24` 无守门** | 全仓引用数 0（`grep` 无输出） | 纪律项，须人工核（G 序列） |
| **U9** | **「首现词数」判据的稳健性** | 该判据是**本盘点新引入的**（逐课首次出现的句内词，≥3 词的英文串、剔除 id 串）；**未做人工逐课复核** | 本盘点**用它得出了「该判据失效」的否定结论**（§3.3 判据 3）——**「失效」这个结论本身可能因口径粗糙而误判**；建议生产期用第二口径（如人工标注 3–5 课）交叉验证 |
| **U10** | **`reviewed` 字段的语义** | 实读 `reviewed: true` 147/147；**未核实「true 是否等于人工校验过」**（`types.ts` 注释说「未被课程引用的案件须校验后方可上线」，但 `hunt-white-cat` 等 5 个番外案也是 `true`） | 番外 5 案的 `reviewed` 语义存疑 |

---

### A6. 复核补录（首次落盘后追加，全部为实读，非推断）

> 本节内容为本报告首次落盘后的追加实读，用于替换/加固正文中三处表述（见 A6-4 留痕表）。

#### A6-1. 季区间全表（`grammarSeasons.ts`，21 季，逐行实读）

| 季 | 区间 | 课数 | 该季的收口课 |
|---|---|---|---|
| season-1 | L1–L12 | 12 | — |
| season-2 | L13–L24 | 12 | — |
| season-3 | L25–L34 | 10 | — |
| season-4 | L35–L41 | 7 | **L41** |
| season-5 | L42–L46 | 5 | **L46** |
| season-6 | L47–L49 | 3 | **L49** |
| season-7 | L50–L54 | 5 | **L54** |
| season-8 | L55–L60 | 6 | — |
| season-9 | L61–L66 | 6 | — |
| season-10 | L67–L71 | 5 | — |
| season-11 | L72–L75 | 4 | — |
| season-12 | L76–L78 | 3 | **L78** |
| season-13 | L79–L86 | 8 | **L86** |
| season-14 | L87–L94 | 8 | **L94** |
| season-15 | L95–L102 | 8 | **L102** |
| season-16 | L103–L110 | 8 | **L110** |
| season-17 | L111–L118 | 8 | **L118** |
| season-18 | L119–L124 | 6 | **L124** |
| season-19 | L125–L127 | 3 | **L127** |
| season-20 | L128–L133 | 6 | **L133** |
| season-21 | L134–L138 | 5 | **L138** |

**实读裁定**：**有收口课的季 14／21，无收口课的季 7 个（season-1／2／3／8／9／10／11）**——**「一季一课收口」不是全库铁律**（前 11 季里有 7 季无收口课）。**本批若要「复现型大章」，`season-22` 的 `min/max` 是唯一现成的结构化容器**（§3.3 末尾）。

> **⚠️ 顺带两条对本批有用的实读（「连续收口季」的先例长度）**：
> - **season-12 → season-21 是连续 10 季都带收口课**（L78／L86／L94／L102／L110／L118／L124／L127／L133／L138）——**这是本项目「季末收口」的最长连片**。
> - **season-4 → season-7 是连续 4 季**（L41／L46／L49／L54）。
> → **若「复现型章」被定义为「季末连片复现」，本项目已有「10 连季末」的现成先例**；但**注意这 10 季的每一季都是「1 课收口 ＋ N 课新知」，不是「整季零新知」**——**「连续收口季」≠「复现型章」，后者的零先例结论不变**。

#### A6-2. `contrast` 与 `listen` 素材量（全库实读）

| 项 | 值 |
|---|---|
| `contrast` 总条数 | **828**（138 课 × 6 条，**逐课全为 6**） |
| 其中 `bothRight: true` | **300 条** |
| **可作 `listen` 素材（非 bothRight）** | **528 条** |
| `bothright` 题型可用课数 | **97/138**（`diffScore < 90` 的过滤后） |
| `listen` 题型可用课数 | **138/138** |

#### A6-3. 重名案与番外案的精确行号（供生产期引用）

| 案号 | id | title | 行号 |
|---|---|---|---|
| #16 | `hunt-white-cat` | 朋友的白猫 | `:733` |
| #17 | `hunt-sports-day` | 运动会 | `:791` |
| #18 | `hunt-pen-pal-letter` | 写给笔友的信 | `:857` |
| #19 | `hunt-fridge-note` | **冰箱上的便条** | `:916` |
| #20 | `hunt-term-review` | 学期总结 | `:979` |
| #21 | `hunt-kitchen-note` | **冰箱上的便条**（重名） | `:1044`（**被 L13 引用**，引用行 `:2490`） |
| #53 | `hunt-shop-note` | **冰箱上的便条**（重名） | `:3369` |
| #127 | `hunt-close-17` | **最后一页** | `:7260` |
| #133 | `hunt-close-18` | **最后一页**（重名） | `:7524` |

> **注意**：**`#21 hunt-kitchen-note` 是被引用的**（引用行 `:2490`，属 L14 区段）——**即「冰箱上的便条」这个标题在「被引用的案」与「番外案」之间重用**，**若生产期按标题检索会撞车**。**id 全部唯一，检索请用 id 不用 title**。

#### A6-4. 本轮修正的两处前文表述（留痕）

| # | 前文表述 | 修正后 | 依据 |
|---|---|---|---|
| 1 | 收口课「季内位置」未标注 | **14/14 全在所属季的 `max`** | §3.2 表新增「所属季／季内位置」两列 |
| 2 | 首现词数曾被当作「判据缺失」的论据之一 | **明确为「失效判据」**（零首现词的 15 课里只有 2 课是收口课） | §3.3 判据第 3 条改写 |

#### A6-5. 三处数字口径的复算与修正（留痕）

| # | 原表述 | 修正后 | 原因 |
|---|---|---|---|
| 1 | 「五个感官动词本体极厚（合计 **434** 处）」 | **452 处**（8 个形态：`sound` 68／`sounds` 110／`smell` 18／`smells` 67／`taste` 18／`tastes` 60／`feel` 57／`feels` 54） | 原数漏算 `feels`／`smells` 等形态；**修正后仍支持「极厚」结论** |
| 2 | 「全库 **660** 组 `contrast` 句对」 | **828 组**（138 课 × 6，**逐课全为 6**）；其中 `bothRight` **300** 条 → **listen 可用 528 组** | **660 是源码注释 `grammarBoostService.ts:768` 里的过期数**（`110 × 6 ＝ 660`，写在批二十之前）；**该注释至今未更新**——**这是本轮发现的一条「代码注释漂移」**，建议生产期顺手改 |
| 3 | 「`look` 家族」未在本报告展开 | 补录（供方向 1 参考）：`look` GL **223**／`looks` GL **238**／`looking` GL **215**／`looked` GL **1**（**家族合计 677**）；HC 合计 **60** | **`look` 家族在本批（L134–L138）新增 `looks` 44 处／`looking` 59 处／`look` 37 处**——**批二十一使 `look` 家族膨胀**，方向 1 若再碰感官族须计入「看腻率」风险 |

> **顺带一条对方向 1 的实测提示（来自上表第 3 行的逐课分解，全量实读）**：
> - **`looking` GL 215 处：L134–L138 占 199 处 ＝ 92.6%**（L137 55／L134 53／L136 46／L138 34／L135 11；**批二十一之前的全部 `looking` 只有 16 处**，其中 L27 9 处是 `looking for`）。
> - **`looks` GL 238 处：L134–L138 占 64 处 ＝ 26.9%**（L135 41 为主）；**批十九的 L125–L127 占 127 处 ＝ 53.4%**。
> - **`look` GL 223 处：L134–L138 占 63 处 ＝ 28.3%**（L135 35／L134 20）；**L125–L127 占 137 处 ＝ 61.4%**。
> → **实读裁定**：**批二十一使 `looking` 从「全库 16 处」暴涨 13.4 倍**（连占 5 课），**而 `look`／`looks` 的分布仍以批十九为主**。**方向 1 若选「感官 `like` 扩展」，会与**刚交付的批二十一**在同一结构族上继续叠加**——**数据上可量化的观感风险：L125–L138 连续 14 课 `look` 家族在场**（批二十一已登记此风险；**本盘点补上了精确的逐课占比**）。

---

**（报告完）**
