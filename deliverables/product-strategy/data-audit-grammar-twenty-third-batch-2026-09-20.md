# 数据盘点：第二十三批·as soon as 与造词成本

**日期**：2026-09-20 ｜ **类型**：实读代码/文件盘点（无数仓）｜ **成员**：数析

**方法**：单遍字符状态机提取引号内字符串（六态：`code`／`line_comment`／`block_comment`／`dq`／`sq`／`bt`；注释内字符串一律不入账，反斜杠转义按两字符吞掉），再按顶层 `^    number: N,` 切块，得「行号 → 课号（GL）／案号（HC）」映射。**GL 命中 25,659 条串／剔 id 后 25,376 条**（剔 283 条 kebab 形 id 串）；**HC 命中 6,127 条串／剔 id 后 5,981 条**（剔 146 条）。英文口径（无中文、≥3 词）GL 5,776 串／HC 15 串；英文词次 GL 57,474／HC 8,022。词次一律**词边界匹配**（`(?<![A-Za-z])…(?![A-Za-z])`）、大小写不敏感，**id 串假阳性逐词单列剔除**（本批实测：`as` 裸 GL 135 → 剔 `lesson-65-as-as` 后 133；`until` 裸 GL 71 → 全为真词；`rain` 裸 105 → 真词，id `lesson-48-if-rain` 由精确词边界自然排除）。**抽词器逐字复刻并实跑**：ambush 侧 `grammarAmbushService.ts:160-213`（`GRAMMAR_WORDS` ＋ `CLOZE_STOP_WORDS` ＋ 三级回退），boost 侧 `grammarBoostService.ts:244-395`（`FUNCTION_WORDS` ＋ `keywordIndexes` ＋ `buildCloze` 种子化选位 ＋ 四类干扰项分支）。**复刻可信度用真服务交叉验证**（`vite-node` 直接 import 真服务）：ambush 侧 **10/10 逐字一致**（含档位判定），boost 侧 **5/5 逐字一致**（修正 seed 为 `sourceRef` 后）。封面指派用**全枚举**（117³ 排列，max-min-gap 目标）。**所有断言一律带行号。**

**范围**：批二十三首选＝**`as soon as`（B 档，3 课小章）**；备选＝`seem`／`appear`（C+）、`would rather`（B−）、`neither/either/both`（B−）。本盘点核心＝**① `as soon as` 的造词成本与「L109 形式冲突」的量化；② 替代场景（换场景方案）的零件可用性核验。**

> **📌 本批盘点的四条结构性事实（先看这四条）**
> 1. **`as soon as` 的造词成本比批二十二预判的低一半**：`as` **不是零**——GL **133 词次／70 串**，其中 **L65 占 120 词次（90.2%）／61 串（87.1%）**，**其余 13 词次散在 L71（10）／L109（2）／L78（1）**；**L109 `:20350` 已明文写「as 也能领一整句说「当…那会儿」」——`as` 的第二义已经在库、且是 bothRight 认读位**。真正为零的只有 **`soon`（GL 0／HC 0）**一个词（§1.2）。
> 2. **L109 冲突是「形式冲突」而非「词独占」**：**`rain` 被 12 课使用（GL 102 词次），L109 只占 44（43.1%）**——`rain` 不被 L109 独占；**真正近独占的是 `stops`（GL 9：L109 8／L94 1）与 `stopped`（GL 45：L109 41／L110 3／L139 1）**。冲突的实质是 **L109 `:20451` 把 `stops` 明设为 `distractors`（错项）**（案 #118 `:6879` 同样把 `stops.` 标为 `tense` 错点），而 `as soon as` 的正确形式恰好要 `stops`（§2）。
> 3. **换场景方案「有零件、但无净收益」——三个场景都不满足「零件齐 ＋ 不撞车」的组合**：**场景 A（电话响）零件最厚**（`phone` GL 52／`rang` GL 65，**但 `rang` 的 49 处压在 L99**，且须新造 `rings`）；**场景 B（信到了）撞车最轻**（`letter` GL 8 全是「写信」义／`arrive` GL 34 全是「人早到」义，须新造 `arrives`）；**场景 C（电影结束）号称零造词，实为「换壳」**——**`ends`（GL 2）／`ended`（GL 8）／`the movie`（GL 8）100% 在 L109**，`the movie ended` 6 处（全 L109 `:20317`／`:20373`／`:20441`／`:20442`／`:20443`／`:20466`），**换过去等于用 L109 自己的道具讲第二个规则**（§3.3）。
> 4. **复现取材头寸已有 1 句顶死红线**：`Yesterday I went to the park.` **在 6 课的 practice 答案里各出现一次**（L21 `:3942`／L24 `:4479`／L93 `:17453`／L95 `:17833`／L100 `:18781`／L104 `:19538`）——**这正是 `grammarLessons.test.ts:163` 的「同一句最多出现在 6 课」红线，本批任何新句都不得再引用它；另有 6 句已到 5 课（§6）**。

---

## 指标概览

| 指标 | 本期（实读·当前态） | 上期（批二十二交付后） | 状态 |
|---|---|---|---|
| 课程 / 案件 / 错点 | **141 课 / 150 案 / 574 错点** | 141 / 150 / 574 | ✅ 与批二十二交付一致 |
| 罪名（错点 / 承载案） | verb_form **131/87**·plural **103/97**·sv_agreement **92/68**·preposition **62/57**·tense **52/43**·word_order **47/35**·article **29/23**·missing_be **24/20**·**run_on 19/15**·**fragment 15/14** | 批二十二盘点表：verb_form 131/87·plural 102/96·sv_agreement 89/66·preposition 62/57·tense 50/42·word_order 47/35·article 29/23·missing_be 24/20·fragment 14/13·run_on 14/12 | ✅ **差额 ＝ 批二十二交付的 3 案 12 错点**：#148（run_on＋tense×2＋plural）／#149（run_on×2＋sv_agreement×2）／#150（run_on×2＋fragment＋sv_agreement）→ **run_on +5·sv_agreement +3·tense +2·plural +1·fragment +1**（**批二十二盘点表是「交付前」基线，不是交付后**） |
| 封面池 | **117 张用 141 次**（单次 93·二用 24·三用 0）；二用张＝**cover1–cover24** | 117／138（单次 96·二用 21） | ✅ 批二十二用了 cover22–cover24（L139–L141） |
| 案号 | max **#150**，1–150 **连续无跳号无重号**；`reviewed` **150/150＝100%** | max #150 | ✅ 下号 **#151** |
| 课号 | 1–141 **连续无跳号无重号** | 1–141 | ✅ 下号 **L142** |
| 案件引用 | 145/150 被引用（**5 案番外**：white-cat／sports-day／pen-pal-letter／fridge-note／term-review）；**课侧每课 1 案（127 课）／2 案（8 课）／3 案（1 课）／空案（5 课：L2·L3·L5·L6·L8）** | — | ✅ 空案课为第一季存量设计（`huntCases.ts:22-28`） |
| 基建 | season-22 `{139,141}` 在位（**22 季**）；m24 `afterLesson:141` 在位（**24 里程碑**）；episode 止「一百四十一」（`:26499`） | 同左 | ✅ 须续 **season-23 / m25 / 一百四十二** |
| **`as soon as` 族** | **`as soon as` 0/0**·**`as soon` 0/0**·**`soon` 0/0**·**`sooner` 0/0** | 同左 | 🔴 **`soon` 是唯一真零；`as` 已有 133 词次** |
| **L109 冲突** | **`stops` GL 9（L109 8 全为错项／L94 1）**·**`the rain stops` GL 3（100% 错项）**·**`rain` GL 102（12 课，L109 只占 44＝43.1%）** | 批二十二 PRD 记「L109 `:20328` 把 `I waited until the rain stops.` 明设为错项」 | ✅ **冲突实测成立，但只锁在 `stops` 一个词形（§2.3）** |
| `as` 现况 | **GL 133 词次／70 串**（L65 120／L71 10／L109 2／L78 1）；**HC 13 词次／9 串，全在 #74** | 批二十二记 GL 70 处（串口径） | ✅ 本次给词次口径；**串口径同为 70，一致** |
| 时间家族 | when **283**·after **178**·before **88**·until **69**·while **94**（GL 词次）；**`as` 连词义仅 L109 1 处认读** | 五格合计 GL 663（**串口径**） | ✅ **五格 GL 词次合计 712／HC 53；实为「五格 ＋ L109 一处 `as` 认读种子」** |
| 测试 | **61 文件 / 799 项全绿**；`tsc --noEmit` **0 错（exit 0）** | 61/799 | ✅ 基线不变 |
| G-boost | **67 项全绿**（boost 50 ＋ review 17）；**`Although`／`but` 实测不产出变形词（结论：不会产出 `Althoughs`）** | 50＋17 | ✅ 护栏守住，**但全库另有 9 道题干扰项不合格（8 道伪造词 ＋ 1 道词性不符）**（§10.3） |

---

## 洞察

1. **`as soon as` 的成本被批二十二高估了：真零只有 `soon` 一个词。** 实读（已剔 id 串）：`as soon as` **GL 0／HC 0**、`as soon` **0/0**、**`soon` 0/0**、`sooner` **0/0**；但 **`as` GL 133 词次／70 串、HC 13 词次／9 串**——**批二十二审计的「`as` GL 70 处」是串口径，本轮给词次口径 133（同 70 串，一致）**。**更关键的一条**：`as` 的第二义**已经在库里认过脸**——**L109 `:20346` `She called as I was getting out of the bath.` ＋ `:20350` `两句都对——认读一句：as 也能领一整句说「当…那会儿」`**。→ **`as soon as` 引入时，`as` 不是「第三义新造」，而是「L109 认读种子的转正」**（与批十七 `-ed/-ing` 形容词、批二十二 `though→although` 的「先考后教」同型）。**造词成本 ＝ 1 个新词（`soon`）＋ 1 处认读升格，量级与批二十一的 `forward` 相同或更低**（§1.4）。

2. **槽位新增不在时间家族内部，因为时间家族实际是「五格 ＋ 一个认读位」。** 实读 GL 词次：`when` **283**（L92 73／L97 58／L99 34／L101 23／L27 21／L102 19／L109 13）、`after` **178**（L90 72／L106 37／L91 23）、`before` **88**（L91 64／L92 11）、`while` **94**（L98 68／L99 14）、`until` **69**（L109 64）；`as`（连词义）**只有 L109 2 处词次（1 串正文＋1 串讲解）**，`since`／`till`／`whenever`／`as if` **四串全 0/0**。→ **`as soon as` 是「第六格」，但第六格的地基已经打过桩（L109 的 `as` 认读）**——**它不需要与 `when` 抢地盘，而是要把 L109 那个「当…那会儿」的 `as` 升格为「一…就…」**（§1.3）。

3. **L109 的形式冲突是真的，但它是「单点」不是「系统性」——冲突只发生在 `stops` 这一个词形上。** 实读：**`rain` 被 12 课使用（GL 102 词次：L109 44／L48 11／L96 9／L12 8／L29 7／L102 7／L49 5／L127 4／L110 3／L30 2／L101 1／L139 1）——L109 只占 43.1%，`rain` 不被独占**。**近独占的是 `stops`（GL 9：L109 8／L94 1）与 `stopped`（GL 45：L109 41／L110 3／L139 1）**。而冲突的精确落点是：**L109 `:20451` `distractors: ["stops"]`（practice 第 1 题，把 `stops` 明设为错项）＋ `:20328` 的 `wrong: "I waited until the rain stops."`／`contrast` `wrongMark: "stops"`；案 #118 `:6879` 把 `stops.` 标为 `tense` 错点**。→ **`as soon as` 若用 `the rain stops` 作正确形式，等于在同一批用户眼前把 L109 判过的错突然转正**（§2.3）。

4. **换场景方案：三个场景「有零件但无净收益」——没有任何一个同时满足「零件齐 ＋ 不撞车」。** 实读：场景 A「电话响」——`phone` GL **52**（L99 41／L102 10）／HC 6、`rang` GL **65**（L99 49）／HC 5、`ringing` GL 7（L99）／HC 2；**`rings` GL 0／HC 0（须造）**、`answer` GL **9**（L97 7／L34 1／L55 1）／HC 0（**且 9 处全是「回答／没人接」义，不是「接电话」**）、**`answers` GL 0／HC 1（#36）**。场景 B「信到了」——`letter` GL **8**（L23 4／L52 2／L53 2，**全是「写信／被写」义**）／HC 0、**`arrives` GL 0／HC 0（须造）**、`arrive` GL **34**（L28 17，**全是「人早到」义**）／`arrived` GL **4**（L99）。场景 C「电影结束」——`movie` GL **49**（L29 24／L109 9）／HC 1、**`ends` GL 2／`ended` GL 8，两串 100% 在 L109**、`finish` GL **64**／`finished` GL **78**。→ **A 零件最厚（`phone` 52／`rang` 65）但须造 `rings` 且正面撞 L99（`rang` 49 在该课）；B 撞车最轻但场景感最弱且须造 `arrives`；C 的 `ends`／`ended` 是 L109 自己的道具，换过去只是「换壳」**（§3.3）。

5. **`seem`／`appear` 是备选里唯一「零附带」的**：`seem`／`seems`／`seemed`／`appear`／`appears`／`appeared` **六形态全 0/0**，且与批二十的 `It sounds great.` / 批十九的 `It looks nice.` **同骨架**（`It ＋ 感官/判断动词 ＋ 形容词`）。**但它的 cloze 双通道友好度最高**：ambush 侧空位落 `seem`／`seems`（第②档实词回退）、boost 侧落点率 **33.4%**（3 候选位），**是唯一「考点词能被抽中」的候选族**（§7）。**代价是罪名承载面最窄（10 枚举里只能带 3 类）**（§5）。

6. **`would rather`／`neither/either/both` 的造词成本比 `as soon as` 高，且各有硬伤。** 实读：`rather` **0/0**、`both` **GL 0／HC 0**（**裸 grep 陷阱：GL `bothRight` 字段名 308 处**）、`neither`／`either`／`nor` **全 0/0**、`shall` **0/0**、`why not` **0/0**；**`would` GL 158（L62 74／L70 49／L69 32）——已在库且已有三个用法（`would like`／`Would you mind`／`Would you like`）**。→ **`would rather` ＝ 1 新词 ＋ `would` 第四义**；**`neither/either/both` ＝ 3–4 个新词 ＋ 3 个新串（`neither...nor`／`either...or`／`both...and` 三串全 0/0）**，**成本是 `as soon as` 的 3–4 倍**（§4）。

7. **封面池已进入「二用 24 张」；L142 起的最优指派唯一且 min-gap ＝ 117。** 实读：117 张被用 141 次，**单次 93 张（cover25–cover117）**、二用 **24 张（cover1–cover24）**、三用 0。**全局最优＋唯一解：`L142←cover25／L143←cover26／L144←cover27`**（min-gap 117；三课版 117³ 排列里只有 1 个解达到 117）。**若 4 课：cover25–cover28（min-gap 116）；5 课：cover25–cover29（min-gap 115）**——**「从 cover25 起连续取」是任何批量的最优解**（§9）。

8. **复现取材头寸：1 句已顶死红线（6 课），6 句在 5 课（预警）。** 实读 `grammarLessons.test.ts:163` 的「同一句最多出现在 6 课」口径（practice 答案、normalize 后去重）：**顶死 6 课＝`Yesterday I went to the park.`**（L21／L24／L93／L95／L100／L104，行号见 §6）；**5 课 6 句＝`I like reading.`（L5／L42／L46／L77／L120）、`There is a book on the desk.`（L26／L37／L55／L60／L114）、`I was busy and happy.`（L81／L113／L139／L140／L141）、`I am happy.`（L113／L119／L125／L128／L134）、`I am used to getting up early.`（L120／L122／L124／L136／L138）、`It looks nice.`（L125／L126／L128／L133／L134）**。**新批若写复现题，先查这 7 句**（§6）。

9. **cloze 落点：`as soon as` 是「ambush 侧最差、boost 侧中等」的结构。** ambush 侧（逐字复刻 ＋ 10/10 交叉验证）：**8 句候选里 7 句落 `will`（第①档 `GRAMMAR_WORDS` 直接命中）**，唯一例外是前置版落 `As`——**`soon` 永不被抽中，因为 `as` 是 `GRAMMAR_WORDS` 成员而 `as soon as` 的第一个 `as` 永远先被 findIndex 命中**。boost 侧：`soon` 落点率 **20.1%**（5 位候选里 1 位），**是「中等」而非「差」**（对照 `seem` 33.4%／`Either` 50.2%）。**但 boost 侧有个好消息：`as soon as` 句的干扰项永不走②加后缀分支**（`soon` 不在 `KNOWN_VERBS`）→ **不会产出 `soons`／`soonned` 这类伪造词**（§7）。

10. **G-boost 护栏复核：`Although`／`but` 确实不会被变形，主理人结论成立。** 实测（真服务全库扫描）：**`lesson-139-although` 的 cloze 答案是 `stay`（选项 `singer/stay/bus/then`）、`lesson-140` 是 `not`（`not/there/lets/heavy`）、`lesson-141` 是 `home`（`old/find/home/apple`）——三课 12 道 cloze 题零伪造词**。**原因在源码**：`grammarBoostService.ts:327-356` 的②分支要求 `KNOWN_VERBS.has(lower)`，而 `although`／`but`／`as`／`soon`／`stops`／`ended` 全部不在表内 → 走③兜底（句内真词／课程词池）。**复核中反而发现存量 8 道题的干扰项确实是英语里不存在的词**（`cleaneding`／`takesed`／`plaies`／`wanting` 等，**共 20 个词次**；另 1 道 `Close→closed` 是真词但词性不符），**已超出本批任务范围但建议顺手修**（§10.3）。

11. **封面池与复现头寸都有「唯一的下一步」**：**封面 L142←cover25／L143←cover26／L144←cover27 是全局唯一最优解（min-gap 117）**（§9）；**复现题必须先排除 1 句顶死 6 课 ＋ 6 句到 5 课的句子**（§6）。**两条都是「照着做即可」的确定性结论，不须再做判断。**

---

## 1. `as soon as` 造词与撞车风险（本批核心）

### 1.1 `as soon as` 族逐形态（GL ＋ HC）

| 词／串 | GL 词次 | GL 串 | HC 词次 | HC 串 | 判定 |
|---|---|---|---|---|---|
| **`as soon as`** | **0** | 0 | **0** | 0 | 🔴 整串零 |
| **`as soon`** | **0** | 0 | **0** | 0 | 🔴 零 |
| **`soon`** | **0** | 0 | **0** | 0 | 🔴 **零（唯一真零的必造词）** |
| **`sooner`** | **0** | 0 | **0** | 0 | 🔴 零 |
| **`sooner or later`** | **0** | 0 | **0** | 0 | 🔴 零 |
| `as soon as possible` | 0 | 0 | 0 | 0 | 🔴 零 |

> **实读裁定**：**`as soon as` 族在库为零是本盘点最硬的一条事实**——`soon` 及其所有形态 **GL 0／HC 0**，**无任何 id 串假阳性**（kebab 形 id 里也不含 `soon`）。**唯一的「已存在」是 `as`（见下）。**

### 1.2 `as` 的现有用法分布（撞车风险的核心）

| 词／串 | GL 词次 | GL 串 | HC 词次 | HC 串 | 分布 |
|---|---|---|---|---|---|
| **`as`** | **133** | **70** | **13** | **9** | **GL：L65 120／L71 10／L109 2／L78 1；HC：全在 #74（13 词次）** |
| **`as tall as`** | **38** | 38 | **3** | 3 | **GL：L65 36／L71 2**；HC：#74 3 |
| `as smart as` | 6 | 6 | 0 | 0 | 全在 L65 |
| `as new as` | 3 | 3 | 0 | 0 | 全在 L65 |
| `as as`（连续两词） | 0 | 0 | 0 | 0 | 🔴 零（无 `as as` 连写） |
| `same as`／`the same as` | 0 | 0 | 0 | 0 | 🔴 零（`same` GL 2：L112／L138，无 `as` 搭配） |

**逐课拆解（GL 133 词次）**：

| 课 | 词次 | 串数 | 用法 | 代表行号 |
|---|---|---|---|---|
| **L65** | **120** | **61** | `as tall as` 比较级（**88 词次在 `as tall as` 串内，另 32 词次在同课 `as smart as`／`as new as`／单 `as` 卡片**） | `:11977` `He is as tall as me.`／`:12072` `as tall as`／`:12114` `as smart as` |
| **L71** | **10** | **6** | 复现 L65（`as…as` 与 `too…to`／`enough` 并列为「程度三兄弟」） | `:13168` `He is as tall as me.`／`:13240` `as`（两处卡片）／`:13242` |
| **L109** | **2** | **2** | **`as` 作连词（「当…那会儿」）的 bothRight 认读位** | `:20346` `She called as I was getting out of the bath.`／`:20350` 讲解 |
| **L78** | **1** | **1** | 收口课的 `distractors: ["as"]`（干扰项字段，不是英文用例） | `:14598` |

**结论（回答「会不会与 L65 撞车」）**：

1. **L65 占 `as` 词次的 90.2%（120/133）、串数的 87.1%（61/70）** —— **`as` 在库的「主流义」确实是「一样」（`as…as` 两头卡住）**。
2. **但 `as soon as` 里的 `as` 与 L65 的 `as` 不同岗**：L65 是**成对使用**（第一个 `as` 挂在形容词前，第二个 `as` 挂在比较对象前，**两个 `as` 缺一不可**——L65 `:12009` 明写「两头都要卡住：少一头 as，「一样」就散架」）；`as soon as` 也是**成对**但**中间是副词 `soon` 而非形容词**、**语义是「一…就…」而非「一样」**。
3. **撞车点不在 L65，而在 L109**：**L109 `:20350` 已经明确给了 `as` 的第二个意思（「当…那会儿」）** —— `as soon as` 是这个意思的**紧邻延伸**，而不是新义。→ **`as soon as` 的 `as` 应当挂靠 L109 的认读种子，而不是「绕开 L65」**（§1.3）。
4. **一条可量化的风险**：`as` 的三个意思（`as…as` 一样 ／ `as` 当…那会儿 ／ `as soon as` 一…就…）**在库里已有两个**。**新增后 `as` 词次将从 133 涨到约 160–180（若 3 课各 8–10 处）**，**「一样」义占比从 90.2% 降到约 70%** —— **这是可接受的范围**，但**课的文案必须显式写「这个 as 不是第 65 课那个」**。

### 1.3 时间家族七格现状（判断 `as soon as` 算第几格）

| 词 | GL 词次 | GL 串 | 逐课分布（词次） | HC 词次 | HC 案 |
|---|---|---|---|---|---|
| **`when`** | **283** | 267 | L92 **73**·L97 **58**·L99 **34**·L101 **23**·L27 21·L102 19·L109 13·L98 10·L56 7·L94 6 | **16** | #101·#106·#36·#103·#110·#41·#108·#111 |
| **`after`** | **178** | 167 | L90 **72**·L106 **37**·L91 **23**·L94 17·L110 11·L92 9 | **11** | #99·#37·#100·#103·#24 |
| **`before`** | **88** | 79 | L91 **64**·L92 11·L94 6 | **7** | #100·#32·#41 |
| **`while`** | **94** | 86 | L98 **68**·L99 14·L102 6·L101 4 | **10** | #107·#110·#111·#108 |
| **`until`** | **69** | 65 | L109 **64**·L110 4·L139 1 | **9** | #118·#126·#119 |
| **`as`（连词义）** | **2** | **2** | **L109 2（1 处正文 bothRight ＋ 1 处讲解）** | 0 | — |
| **`as soon as`** | **0** | 0 | — | 0 | — |
| `since`／`till`／`whenever`／`as if` | **0/0/0/0** | 0 | — | 0/0/0/0 | — |
| **五格合计** | **712** | 664 | — | **53** | — |

> **实读裁定（回答「第六格还是第七格」）**：
> 1. **时间家族在库里是「五格 ＋ 一个认读位」，不是六格。** `when`／`after`／`before`／`while`／`until` 五格各有专属课（L92／L90／L91／L98／L109）与专属案；**`as` 作连词义只有 L109 `:20346` 一处正文，且被标为 `bothRight: true`（「两句都对」的认读位）——它不是一格，是一颗种子**。
> 2. **`as soon as` 应当算「第六格」，但它的地基是 `as` 的认读种子（L109），不是 `when` 的紧邻义。** 五格里与 `as soon as` 语义最近的是 `until`（L109，「一直等到那道线」）——**因为 `until` 教的就是「两道动作之间的时间线」，而 `as soon as` 是这条线的「零延迟版」**。→ **`as soon as` 与 L109 的关系是「同一条线的两个刻度」，而不是「新开一格」**。
> 3. **与 `when` 的关系须显式切开**：`when` 283 词次里 **L97 的 58 处是「when ＋ 当时正做着」**（过去进行时被打断）、**L92 的 73 处是「when ＋ 天气/习惯」**——**`as soon as` 的「一…就…」是「两个先后动作的紧接」，与 `when` 的「同一时刻」不同**。**这一条建议写进课的对比卡**（与批二十二 L140 切开 `but`／`although` 的做法同型）。

### 1.4 造词成本汇总（对照批型先例）

| 项 | 数量 | 明细 | 依据 |
|---|---|---|---|
| **必造新词** | **1** | **`soon`**（GL 0／HC 0） | §1.1 |
| **旧词认读升格** | **1** | **`as`（连词义）**——L109 `:20346`／`:20350` 已有 bothRight 认读位 | §1.2 |
| 可选新词 | 0–2 | 换场景方案下的 `rings`（0/0）或 `arrives`（0/0），见 §3 | §3 |
| **成本量级** | **1 新词 ＋ 1 认读升格** | 批二十一＝2 新词（`forward`／`seeing`）；批二十二＝2 新词（`although`／`though`） | — |

> **实读裁定**：**`as soon as` 的成本低于批二十二的预估（批二十二 PRD 写「须新造 soon ＋ `as` 的第三义」）。** 修正为：**`as` 不是第三义，是 L109 已认过的第二义的紧邻延伸**——**成本 ＝ 1 个新词**，**持平或低于近两批**。

---

## 2. L109 形式冲突的量化

### 2.1 `rain` 是否被 L109 独占？（逐课列出所有含 `rain` 的课）

**`rain` GL 102 词次，涉及 12 课**：

| 课 | 词次 | 代表句／行号 | 义 |
|---|---|---|---|
| **L109** | **44** | `:20306` `I waited until the rain stopped.` | 雨停（主角） |
| L48 | 11 | `:8795` `If it will rain, I will stay at home.`（错项） | if 条件句 |
| L96 | 9 | — | 过去进行（`raining` 同课 52） |
| L12 | 8 | `:2148` `It will rain.` | 将来时 |
| L29 | 7 | `:5278` `It is going to rain.` | be going to |
| L102 | 7 | — | 收口 |
| L49 | 5 | — | should ＋ if |
| L127 | 4 | `It looks like rain.` | look 认读 |
| L110 | 3 | `:20547` `I waited until the rain stopped.`（回流） | L109 复现 |
| L30 | 2 | `:5571` `It is going to rain.` | be going to 复现 |
| L101 | 1 | — | 过去进行 |
| **L139** | **1** | `:26192` 讲解「接着第 109 课那场雨」 | 语义承接 |

> **实读裁定**：**`rain` 不被 L109 独占**——**L109 只占 44/102 ＝ 43.1%**，另 11 课共 58 处。**`rain` 在本项目是「公共道具」（一个高频天气词），不是某个课的专属词。**
>
> **`raining` 更不是 L109 的**：**GL 251 词次**，**L141 57／L96 52／L140 52／L139 46** —— **批二十二（L139–L141）独占 155 词次（61.8%）**，L109 只有 0 处（L109 用 `stopped` 不用 `raining`）。

### 2.2 `stops`／`stopped` 逐词分布与所在课

| 词 | GL 词次 | GL 串 | 逐课 | HC 词次 | HC 案 |
|---|---|---|---|---|---|
| **`stops`** | **9** | 9 | **L109 8 · L94 1** | **2** | **#118 2** |
| **`stopped`** | **45** | 44 | **L109 41 · L110 3 · L139 1** | **10** | #118 4·#17 2·#119 2·#126 2 |
| `stop` | 8 | 8 | L109 3·L19 2·L20 2·L16 1 | 6 | #17·#119·#126 |
| `stopping` | **0** | 0 | — | 0 | — |
| `rain` | 102 | 102 | 12 课（见 §2.1） | 17 | #118·#38·#43·#105·#111·#119·#126·#57 |

**`stops` 的 9 处逐处（GL）**：

| 课 | 行号 | 文本 | 角色 |
|---|---|---|---|
| L109 | `:20328` | `I waited until the rain stops.` | 🔴 **contrast 的 `wrong`（错项）** |
| L109 | `:20329` | `stops` | 🔴 **`wrongMark`（错点标记）** |
| L109 | `:20390` | `until the rain stops ❌ / will stop ❌ —— 两边都得用昨天版` | 🔴 summary 里的错例 |
| L109 | `:20400` | `until the rain stops` | 🔴 guided choose 的 `options` **第一个选项（错项）** |
| L109 | `:20422` | `stops.` | 🔴 guided spot 的 `wrongToken` |
| L109 | `:20423` | `stops.` | 🔴 同上（`answer`） |
| L109 | `:20424` | `stops.` | 🔴 同上（`tokens` 内） |
| L109 | `:20451` | `distractors: ["stops"]` | 🔴 **practice 第 1 题的干扰项** |
| L94 | `:17492` | `Oh — the wind stops. What a nice day!` | 🟢 **正确句**（一般现在时，风停了） |

**`stopped` 的正确／错项分布**：**GL 45 处里，44 处是正确形式**（L109 41 ／L110 3 ／L139 1，全部作正确句或正确选项），**唯一「错项身份」在 HC**：**案 #17 `:832-833` `stopped` 是 `tense` 错点**（`original: "stopped"` → 但上下文是「比赛是上周五停的」的正确过去式，注意该案是「stop → stopped」的**另一个方向**）。→ **`stopped` 在 GL 侧 100% 正确；`stops` 在 GL 侧 8/9 是错项身份。**

### 2.3 冲突的精确量化（结论）

| 冲突维度 | 实测 | 是否真冲突 |
|---|---|---|
| `rain` 被 L109 独占？ | **否**——12 课共用，L109 占 43.1% | 🟢 不冲突 |
| `the rain stopped` 整串 | **GL 36 词次／36 串（L109 33／L110 2／L139 1）＋ HC 1（#118 `:6879`）** | 🟡 **近独占（L109 占 91.7%）** |
| `the rain stops` 整串 | **GL 3 词次／3 串（全在 L109：`:20328`／`:20390`／`:20400`，全部是错项）** | 🔴 **100% 错项身份** |
| `stops` 单字 | **GL 9：L109 8（8/8 错项身份）／L94 1（正确）** | 🔴 **L109 内 100% 错项** |
| 案 #118 | **`stops.` 被标 `tense` 错点（`:6869`／`:6884`／`:6879` `correct: "stopped."`）** | 🔴 案层红线 |
| L139 场景承接 | `:26192` 明写「接着第 109 课那场雨」 | 🟡 场景连续，非语法冲突 |

> **实读裁定（这是本批第一个要裁的事）**：**冲突是真的，但它是「一个词形的冲突」，不是「场景或语义的冲突」。**
> 1. **冲突点精确锁定为 `stops`（现在版）这一个形式**：**L109 与案 #118 把 `until the rain stops` 判为错，理由写得很死（`:20331`「前面用了昨天版 waited，后面也得跟昨天版」／`:20382`「两边都得用昨天版」）**；**`as soon as` 的正确用法恰恰是 `as soon as the rain stops, I will go out`（从句现在版表将来）**。
> 2. **`rain`／`stopped`／`the rain stopped` 不构成冲突**：`rain` 公共道具、`stopped` 在 GL 侧全对、`the rain stopped` 只在 L109／L110／L139 三课出现且全是正确句。
> 3. **量化冲突规模**：**受影响的写法只有 1 种（`as soon as + 一般现在时从句`）**，**受影响的学生记忆只有 1 条（L109 的「两边都用昨天版」）**，**受影响的课只有 1 课（L109）＋ 1 案（#118）＋ 2 案回流引用（#119／#126）**。
> 4. **两条可行切法（数据支持）**：
>    - **切法甲（保留雨景，改动词）**：把 L109 的雨景换成「**风停／电影结束／信到**」——**L109 自己就提供了 `the movie ended`（`:20441` replace 的 `replaceTarget`；practice `:20466` `We waited until the movie ended.`）**，**`movie` GL 49（L29 24／L109 9）**, **该场景的所有权本来就有 L29 的一半**。
>    - **切法乙（换时态对比轴）**：`as soon as` 用「**将来 + 现在版**」，同时在课里**显式点出与 L109 的差别**（「第 109 课说昨天的事，两边都用昨天版；今天说等下的事，后面用现在版」）——**这与 L109 `:20336` 的对比卡「「等到…为止」后面不请 will」正好形成对照**，**风险是把两个规则摆在一起讲，对零基础用户可能过载**。

---

## 3. 替代场景可用性（换场景方案的核验）

### 3.1 场景 A「电话响」

| 词 | GL 词次 | GL 串 | 逐课 | HC 词次 | HC 案 | 判定 |
|---|---|---|---|---|---|---|
| `phone` | **52** | 51 | **L99 41**·L102 10·L100 1 | **6** | #12·#108·#31·#111 | ✅ **极厚** |
| `ring` | **9** | 9 | **L99 8**·L102 1 | **2** | #111 2 | ✅ 在库 |
| **`rings`** | **0** | 0 | — | **0** | — | 🔴 **须造** |
| `rang` | **65** | 62 | **L99 49**·L102 13·L101 2·L100 1 | **5** | #108 3·#111 2 | ✅ **极厚** |
| `ringing` | **7** | 7 | **L99 7** | **2** | #108 2 | ✅ 在库 |
| `answer` | **9** | 9 | **L97 7**·L34 1·L55 1 | 0 | — | 🟡 薄（但语义是「回答」，不是「接电话」） |
| **`answers`** | **0** | 0 | — | **1** | #36 1 | 🔴 **GL 零** |
| `answered` | **0** | 0 | — | 0 | — | 🔴 零 |
| **`the phone rings`** | **0** | 0 | — | **0** | — | 🔴 **整串零** |
| `the phone` | **44** | — | L99 为主 | 0 | — | ✅ 在库 |
| `answer the phone` | **0** | 0 | — | 0 | — | 🔴 整串零 |

> **实读裁定**：**场景 A 的「主体」极厚（`phone` 52／`rang` 65／`ring` 9／`ringing` 7，全部集中在 L99「when the phone rang」），但「零件」缺两块**：**`rings`（0/0）与 `answer` 的「接电话」义（库里 `answer` 9 处全是「回答／没人接」义）**。→ **场景 A 若要写 `I will answer the phone as soon as it rings.`，须新造 `rings`（1 词）并给 `answer` 立新义（接电话）。总成本 ＝ 1–2 词。**
>
> **⚠️ 撞车警告**：**L99 是「when ＋ 过去进行」专课（`I was reading when the phone rang.`），`rang` 的 49/65 在这个课里**。**用「电话响」做 `as soon as` 的场景，会与 L99 的「响是一下子」讲解正面相遇**（L99 `:18448`「响是一下子的事：穿 -ing 就成了「一直在响」」）——**而 `as soon as it rings` 恰好又是「现在版 ＋ 将来」。语义邻居很近，须显式切开。**

### 3.2 场景 B「信到了」

| 词 | GL 词次 | GL 串 | 逐课 | HC 词次 | HC 案 | 判定 |
|---|---|---|---|---|---|---|
| `letter` | **8** | 8 | **L23 4**·L52 2·L53 2 | **0** | — | 🟡 **薄**（且三课都是「写信／被动」义，不是「信到了」） |
| `letters` | **0** | 0 | — | 0 | — | 🔴 零 |
| `arrive` | **34** | 33 | **L28 17**·L58 7·L72 6·L78 3·L100 1 | **2** | #6 2 | ✅ 厚（但全是 `I always arrive early.` 一型） |
| **`arrives`** | **0** | 0 | — | **0** | — | 🔴 **须造** |
| `arrived` | **4** | 4 | **L99 4** | **1** | #6 1 | 🟡 薄 |
| **`the letter arrives`** | **0** | 0 | — | 0 | — | 🔴 **整串零** |
| `get` | **120** | 116 | L121 27·L108 26·L120 12 | **19** | #117·#133·#129·#130 | ✅ 极厚 |
| **`get home`** | **0** | 0 | — | **0** | — | 🔴 **整串零** |

> **实读裁定**：**场景 B 是三场景里最省的「词」但最薄的「场景」**：`arrive` 34／`letter` 8 在库，**只须造 `arrives` 一个词**。**但两处硬伤**：① **`letter` 的 8 处全在 L23「have written a letter」／L52「The letter was written by Xiaomei.」／L53「The letter has been written.」——全部是「写信／被写」，没有一处是「信到了」**；② **`arrive` 的 34 处里 30 处是 `I always arrive early.`（频率副词专课 L28），语义是「人早到」不是「物到达」**。→ **场景 B 的场景感最弱（信在库里的形象是「被写出来的」，不是「寄到的」）。**

### 3.3 场景 C「电影结束」

| 词 | GL 词次 | GL 串 | 逐课 | HC 词次 | HC 案 | 判定 |
|---|---|---|---|---|---|---|
| `movie` | **49** | 49 | **L29 24**·L109 9·L31 4·L75 4·L15 3·L76 3·L38 2 | **1** | #38 1 | ✅ **厚** |
| `movies` | **0** | 0 | — | 0 | — | 🔴 零 |
| `end` | **1** | 1 | **L109 1** | 0 | — | 🟡 极薄 |
| **`ends`** | **2** | 2 | **L109 2**（`:20442`／`:20465`） | **0** | — | 🔴 **100% 在 L109** |
| **`ended`** | **8** | 8 | **L109 8**（其中 6 处在 `the movie ended` 串内：`:20317`／`:20373`／`:20441`／`:20442`／`:20443`／`:20466`） | **0** | — | 🔴 **100% 在 L109** |
| `ending` | **0** | 0 | — | 0 | — | 🔴 零 |
| `finish` | **64** | 59 | **L64 22**·L16 11·L55 9·L77 9·L24 2 | **6** | #73·#64·#86 | ✅ 极厚 |
| `finishes` | **0** | 0 | — | 0 | — | 🔴 零 |
| `finished` | **78** | 78 | **L64 38**·L21 14·L77 6·L69 4·L78 4 | **7** | #73 6·#29 1 | ✅ 极厚 |
| `the movie` | **8** | — | **L109 8（全部）** | 0 | — | 🔴 **L109 独占** |
| **`the movie ends`** | **1** | 1 | **L109 `:20442`** | 0 | — | 🔴 **L109 独占** |
| **`the movie ended`** | **6** | 6 | **L109 6** | 0 | — | 🔴 **L109 独占** |
| `waited until` | **32** | 32 | L109 29·L110 2·L139 1 | 0 | — | 🟡 L109 独占 90.6% |

> **实读裁定（回答「哪个场景零件最齐、与既有课最不撞」）**：
>
> | 场景 | 零造词？ | 零件厚度 | 与既有课的撞车 | 与 L109 的关系 | 综合 |
> |---|---|---|---|---|---|
> | **A 电话响** | 🔴 **须造 `rings`** | `phone` 52／`rang` 65（**最厚**） | 🔴 **正面撞 L99（`rang` 49 处在该课）** | 🟢 无关 | 🥈 **零件最厚，但撞 L99** |
> | **B 信到了** | 🟡 **须造 `arrives`** | `letter` 8（薄）／`arrive` 34（但全是「人早到」） | 🟢 弱（L23／L52／L53 是写信／被动） | 🟢 无关 | 🥉 **撞车最轻，但场景感最弱** |
> | **C 电影结束** | ✅ **零造词**（`movie` 49／`ends` 2／`ended` 8 全在库） | `movie` 49（中）／`ended` 8（薄） | 🔴 **`ends`／`ended`／`the movie` 100% 在 L109** | 🔴 **就是 L109 自己的道具**（`:20441` replace／`:20466` practice） | 🔴 **不是「换场景」，是「换壳」** |
>
> **→ 实读结论**：**三个场景都不满足「零件最齐 ＋ 与既有课最不撞」的组合。**
> - **「零件最齐」＝ 场景 A**（`phone` 52／`rang` 65 远超其他），**代价是新造 `rings` ＋ 与 L99 切开**。
> - **「与既有课最不撞」＝ 场景 B**，**代价是场景感弱（`letter` 8 处全是「写信」）＋ 新造 `arrives`**。
> - **「零造词」＝ 场景 C，但它是伪零**：**`ends`／`ended` 只在 L109 出现，换过去等于用同一批道具讲第二个规则——「换场景」的目的（避开 L109 记忆）完全达不到。**
>
> **建议的第四方案（本盘点新增，数据支持）**：**不换场景、直用 `the rain stops`，而是把冲突显式做成教学内容**——**L109 `:20382` 已经给了现成的对照句式**（「前半截是「一直等」（waited），后半截是那道线（the rain stopped）」），**`as soon as` 正好是「那道线一到就做」**。**这条方案零新造场景词、零撞 L99、且把 L109 的既有记忆变成垫脚石而非绊脚石。**
>
> **⚠️ 与 `movie` 相关的一条硬事实**：**`movie` 的 49 处里 L29 占 24（`I am going to watch a movie.`），L109 占 9** —— **若做场景 C，须用 L29 的「看电影」义（`watch a movie`）而不是 L109 的「电影结束」义（`the movie ended`）**，否则就是 §3.3 表的「换壳」。

---

## 4. 备选候选造词成本

### 4.1 逐词真词次（GL ＋ HC，已剔 id 串）

| 词／串 | GL 词次 | GL 串 | HC 词次 | HC 串 | 判定 |
|---|---|---|---|---|---|
| **`seem`** | **0** | 0 | **0** | 0 | 🔴 零 |
| **`seems`** | **0** | 0 | **0** | 0 | 🔴 零 |
| **`seemed`** | **0** | 0 | **0** | 0 | 🔴 零 |
| **`appear`** | **0** | 0 | **0** | 0 | 🔴 零 |
| **`appears`** | **0** | 0 | **0** | 0 | 🔴 零 |
| **`appeared`** | **0** | 0 | **0** | 0 | 🔴 零 |
| **`rather`** | **0** | 0 | **0** | 0 | 🔴 零 |
| **`would rather`** | **0** | 0 | **0** | 0 | 🔴 整串零 |
| `would`（对照） | **158** | 144 | **11** | 10 | ✅ **在库，已有三用法**：L62 74（`would like`）·L70 49（`Would you like`）·L69 32（`Would you mind`） |
| **`both`** | **0** | 0 | **0** | 0 | 🔴 零（**裸 grep 陷阱：GL `bothRight` 字段名 308 处**） |
| **`neither`** | **0** | 0 | **0** | 0 | 🔴 零 |
| **`either`** | **0** | 0 | **0** | 0 | 🔴 零 |
| **`nor`** | **0** | 0 | **0** | 0 | 🔴 零 |
| `neither...nor`／`either...or`／`both...and` | **0/0/0** | 0 | 0 | 0 | 🔴 三串全零 |
| **`shall`** | **0** | 0 | **0** | 0 | 🔴 零 |
| `why not` | **0** | 0 | **0** | 0 | 🔴 整串零 |
| `how about` | **20** | 19 | **1** | 1 | ✅ 有真实教学位（**L75 20 处**；HC #84 1） |
| `what about` | **3** | 3 | 0 | 0 | 🟡 「你呢」义（L75 2／L45 1） |
| `same` | **2** | 2 | **1** | 1 | 🟡 L112 1／L138 1（HC #31） |

> **⚠️ 本批最大的假阳性陷阱（复算批二十二结论）**：**`both` 在裸 `grep -o -i` 下 GL 308 处——全部是 `bothRight:` 字段名**（`grep -o -E "(?i)\bboth[a-zA-Z]*"` 的唯一形态就是 `bothRight`；HC **0 处**）。**剔除字段名后 GL 0／HC 0**。

### 4.2 造词成本对照表

| 候选 | 必造新词 | 附带成本 | 成本量级 | 与 `as soon as`（1 词）比 |
|---|---|---|---|---|
| **`as soon as`** | **`soon`（1）** | `as` 认读升格（L109 已有种子）＋ 与 `when`／`until` 切开 | **1 新词 ＋ 1 升格** | — |
| **`seem`／`appear`** | **`seem`＋`appear`（2）** | **零附带**（与 L125–L133 感官族同骨架 `It ＋ 动词 ＋ 形容词`） | **2 新词 ＋ 0 附带** | 🟡 **+1 词** |
| **`would rather`** | **`rather`（1）** | `would` 第四义（**L62／L69／L70 已占三个用法**）＋ 与「客气请求」切开 | **1 新词 ＋ 1 新义** | ✅ **持平**（但附带比 `as` 重） |
| **`neither`／`either`／`both`** | **`neither`＋`either`＋`both`（3）** | **`nor`（1）＋ 三个搭配串全零（`neither...nor`／`either...or`／`both...and`）**＝ **4 新词 ＋ 3 新串** | 🔴 **4 新词 ＋ 3 新串** | 🔴 **≈ 4 倍** |
| `the same as` | 0–1（`same` 已在库 2 处） | `as` 的「像」义 ＋ 与 L65 同形不同数 | 低 | ✅ 更低（但承载面窄） |

---

## 5. 罪名承载预判

**权威枚举**：`huntService.ts:331-342` ＝ `tense`／`sv_agreement`／`missing_be`／`article`／`plural`／`preposition`／`fragment`／`run_on`／`word_order`／`verb_form`（10 项；`comparison` 在 `types.ts:419-430` 存在但不在枚举，**HC 实读 0 处**）。

**现况（本轮实读，tag 口径）**：

| 罪名 | 错点 | 承载案 | 档位 |
|---|---|---|---|
| `verb_form` | **131** | **87** | 厚 |
| `plural` | **103** | **97** | 厚 |
| `sv_agreement` | **92** | **68** | 厚 |
| `preposition` | **62** | **57** | 厚 |
| `tense` | **52** | **43** | 中 |
| `word_order` | **47** | **35** | 中 |
| `article` | **29** | **23** | **薄** |
| `missing_be` | **24** | **20** | **薄** |
| **`run_on`** | **19** | **15** | **最薄**（批二十二盘点表记 14/12，**那是交付前基线**；#148／#149／#150 各贡献 run_on） |
| **`fragment`** | **15** | **14** | **最薄**（批二十二盘点表记 14/13，**#150 贡献 +1**） |
| 错点总数 | **574** | 150 案 | 每案 4 错点（127 案）·2（10 案）·3（10 案）·5（2 案）·6（1 案） |

### 5.1 逐候选承载预判（10 枚举内）

| 候选 | 可植错型（10 枚举内） | 可带薄档？ |
|---|---|---|
| **`as soon as`** | `tense`（从句用现在版表将来——错 `as soon as I will get home`）·`verb_form`（`as soon as I getting home`）·`word_order`·**`fragment`**（只写从句 `As soon as the rain stops.`）·**`run_on`**（两句连写无标点）·`sv_agreement`（`as soon as the rain stop`） | ✅ **6 类，含 `fragment`＋`run_on` 两个最薄档** |
| **`neither...nor`／`either...or`** | `sv_agreement`（`Neither of my brothers likes`）·`verb_form`（`Either you or he is` 就近原则）·`word_order`·**`fragment`**·**`run_on`**·`preposition` | ✅ 6 类，含两个最薄档 |
| **`both...and`** | `sv_agreement`·`verb_form`·`word_order`·`plural`（`Both of my parent`） | 🟡 4 类，不带两个最薄档 |
| **`would rather`** | `verb_form`（`would rather to stay`／`would rather staying`）·`tense`·`word_order`·**`missing_be`**·`sv_agreement` | 🟡 5 类，带 `missing_be` 一个薄档 |
| **`seem`／`appear`** | `sv_agreement`（`She seem tired`）·**`missing_be`**·`verb_form`（`She seems tiredly`，与批二十的 `-ly` 错同型） | 🔴 **3 类，只带 `missing_be` 一个薄档**；不带 `fragment`／`run_on`／`article` |

### 5.2 薄档的现成承载案（供生产期选点）

- **`fragment` 14 案**：#13·#14·#17·#28·#48·#49·#50·#75·#89·#99·#100·#101·#103·**#150**
- **`run_on` 15 案**：#7·#15·#18·#27·#28·#40·#100·#101·#103·#107·#110·#111·**#148·#149·#150**
- **实读例句（供 `as soon as` 参照）**：`#150 :8291` `run_on | raining → raining,`（「Although 领完那一整句要点个逗号断开」）；`#150 :8298` `fragment | raining, → it is raining,`（「Although 后面要跟一个完整的小句子」）——**这正是 `as soon as` 从句可以照抄的两种薄档错型**。

> **实读裁定**：**`as soon as` 在罪名承载上是本批最宽的候选（6 类，含两个最薄档），而 `seem`／`appear` 最窄（3 类，只带 1 个薄档）。** 这与批二十二的预判一致，本轮复算成立。**若本批的目标之一是「补薄档」，`as soon as` 是唯一能同时带 `fragment` ＋ `run_on` 的首选。**

---

## 6. 复现取材头寸

**口径**：逐字复刻 `grammarLessons.test.ts:163-178` 的断言（`normalize` ＝ 小写 ＋ 去 `.,!?;:'"` ＋ 空白折叠；统计单位 ＝ **practice 答案**）。

### 6.1 顶到 6 课（红线：不能再被复现引用）

| 句 | 课数 | 逐课（课号 : practice answer 行号） |
|---|---|---|
| **`Yesterday I went to the park.`** | **6** | **L21 `:3942` · L24 `:4479` · L93 `:17453` · L95 `:17833` · L100 `:18781` · L104 `:19538`** |

> **实读裁定**：**这是本项目唯一顶死红线的句子**，且**批二十二交付后新增了 1 次引用**（批二十二表记「当前最差为 6」时已含此句，本轮实测仍为 6，**未越线**）。**生产期必须把此句加入「禁止再引用」清单**（否则测试会红）。

### 6.2 5 课（预警：再引 1 次即触线）

| 句 | 课数 | 逐课（课号 : 行号） |
|---|---|---|
| **`I like reading.`** | **5** | L5 `:1006` · L42 `:7798` · L46 `:8543` · L77 `:14415` · L120 `:22605` |
| **`There is a book on the desk.`** | **5** | L26 `:4854` · L37 `:6889` · L55 `:10249` · L60 `:11191` · L114 `:21444` |
| **`I was busy and happy.`** | **5** | L81 `:15177` · L113 `:21250` · **L139 `:26289` · L140 `:26483` · L141 `:26673`**（**批二十二连引 3 课**） |
| **`I am happy.`** | **5** | L113 `:21243` · L119 `:22418` · L125 `:23578` · L128 `:24160` · L134 `:25320` |
| **`I am used to getting up early.`** | **5** | L120 `:22584` · L122 `:23000` · L124 `:23372` · L136 `:25701` · L138 `:26067` |
| **`It looks nice.`** | **5** | L125 `:23550` · L126 `:23765` · L128 `:24153` · L133 `:25101` · L134 `:25313` |

### 6.3 4 课

| 句 | 课数 | 逐课 |
|---|---|---|
| `He drinks milk every day.` | 4 | L25 `:4663` · L103 `:19351` · L116 `:21832` · L126 `:23772` |
| `They were playing football.` | 4 | L34 `:6328` · L51 `:9495` · L95 `:17826` · L98 `:18401` |
| `Could you help me?` | 4 | L61 `:11368` · L63 `:11766` · L66 `:12332` · L69 `:12901` |
| `Are you used to it?` | 4 | L123 `:23173` · L124 `:23366` · L132 `:24936` · L137 `:25902` |

> **分布总览**：**去重句 443 条**；跨课次数分布 `1×346 · 2×57 · 3×29 · 4×4 · 5×6 · 6×1`。**7 句（6 课 1 句 ＋ 5 课 6 句）是高危区。**
>
> **供 `as soon as` 参照**：`I waited until the rain stopped.` 目前在 **1 课（L109）**；`When it is sunny, I run.` **2 课（L92／L97）**；`I was reading when the phone rang.` **2 课（L99／L102）**；`Although it is raining, I will go out.` **3 课（L139／L140／L141）**。→ **L139–L141 三课已把 `Although` 句用到 3 课，`as soon as` 若在 L142–L144 复现 L109 的句子，仍有余量。**

---

## 7. cloze 落点预演

**方法**：**逐字复刻 ＋ 真服务交叉验证**（不靠复刻自证）。
- 复刻 A：`grammarAmbushService.ts:160-213`（`GRAMMAR_WORDS` 表 ＋ `CLOZE_STOP_WORDS` 27 词 ＋ 三级回退）
- 复刻 B：`grammarBoostService.ts:244-395`（`FUNCTION_WORDS` 33 词 ＋ `keywordIndexes` 长度 ≥3 硬门 ＋ `buildCloze` 的种子化选位）
- **验证**：`vite-node` 直接 import 真服务，**ambush 侧 10/10 逐字一致**（`lesson-139-although`／`lesson-140-but-vs-although`／`lesson-141-close-22`／`lesson-109-until`／`lesson-138-two-stations`／`lesson-99-when-rang`）——**boost 侧首次 1/5，修正 seed 为 `sourceRef`（`${lessonId}:t${tier}:${source}:${index}`）后 5/5 逐字一致**（首轮失败原因是复刻用了 `item.id` 而非 `item.sourceRef`，**已定位并修正**）。

### 7.1 ambush 侧（候选句全跑）

| 句 | 空位 | 档 | 考点词是否落空 |
|---|---|---|---|
| `I will go out as soon as the rain stops.` | **will** | 第①档 | 🔴 落空（`soon` 永不落） |
| `As soon as the rain stops, I will go out.` | **As** | 第①档 | 🔴 落空（**前置版落 `As`——`as` 是 `GRAMMAR_WORDS` 成员**） |
| `I will call you as soon as I get home.` | **will** | 第①档 | 🔴 落空 |
| `I will answer the phone as soon as it rings.`（场景 A） | **will** | 第①档 | 🔴 落空 |
| `I will tell you as soon as the letter arrives.`（场景 B） | **will** | 第①档 | 🔴 落空 |
| `He will go to bed as soon as the movie ends.`（场景 C） | **will** | 第①档 | 🔴 落空 |
| `We will leave as soon as the movie ends.`（场景 C2） | **will** | 第①档 | 🔴 落空 |
| **`You seem tired today.`**（对照） | **seem** | **第②档** | ✅ **命中** |
| **`She seems happy at school.`**（对照） | **seems** | **第②档** | ✅ 命中 |
| `I would rather stay at home.`（对照） | **would** | 第①档 | 🔴 落空 |
| `Neither of my brothers likes tea.`（对照） | **likes** | 第①档 | 🔴 落空 |
| `Both of my parents are teachers.`（对照） | **are** | 第①档 | 🔴 落空 |
| `Either you or he is right.`（对照） | **is** | 第①档 | 🔴 落空 |

> **实读裁定**：**`as soon as` 在 ambush 侧的落点是「最差档」**——**8 句里 7 句落 `will`，1 句落 `As`**。**根因（源码级）**：`pickClozeWord` 的①分支用 `findIndex` 取**第一个**命中 `GRAMMAR_WORDS` 的词，而 `as` **本身就在表内**（`grammarAmbushService.ts:181` 的短语骨架词列表含 `"as"`）→ **前置式 `As soon as…` 直接落 `As`；后置式则落主句的 `will`（`will` 在表内且位置更靠前于 `soon`？不——`soon` 不在表内，所以 `will` 是第一个命中）**。**`soon` 100% 逃逸。**
>
> **唯一的安慰**：**ambush 的 cloze 题不带选项**（`RevisitQuestion` 无 `options` 字段，实测 JSON 只有 `kind/intentZh/answer/clozeText/clozeAnswer`），**所以「空位落 will」至少不会产生伪造选项**。

### 7.2 boost 侧（落点率，20 万随机种子实测）

| 句 | 目标词 | 候选位 | 落点率 |
|---|---|---|---|
| `I will go out as soon as the rain stops.` | `soon` | 2/5 | **20.1%** |
| `As soon as the rain stops, I will go out.` | `soon` | 0/5 | **20.1%** |
| `I will call you as soon as I get home.` | `soon` | 2/5 | **20.1%** |
| `I will answer the phone as soon as it rings.`（A） | `soon` | 3/5 | **19.8%** |
| `The phone will ring as soon as I sit down.`（A2） | `soon` | 3/6 | **16.7%** |
| `I will tell you as soon as the letter arrives.`（B） | `soon` | 2/5 | **20.1%** |
| `He will go to bed as soon as the movie ends.`（C） | `soon` | 2/5 | **20.1%** |
| `We will leave as soon as the movie ends.`（C2） | `soon` | 2/5 | **20.1%** |
| `You seem tired today.`（对照） | `seem` | 0/3 | **33.4%** |
| `She seems happy at school.`（对照） | `seems` | 0/3 | **33.4%** |
| `I would rather stay at home.`（对照） | `rather` | 1/4 | **25.1%** |
| `Neither of my brothers likes tea.`（对照） | `Neither` | 0/4 | **25.1%** |
| `Both of my parents are teachers.`（对照） | `Both` | 0/3 | **33.4%** |
| `Either you or he is right.`（对照） | `Either` | 0/2 | **50.2%** |

> **实读裁定**：**`as soon as` 在 boost 侧的 `soon` 落点率 20.1%（5 个候选位分之一），属「中等偏低」**——**高于「不可用」线，但显著低于 `seem`（33.4%）与 `Either`（50.2%）**。**关键结论：boost 侧 `as soon as` 句的候选位有 5 个（`will`／`call`／`soon`／`get`／`home`），这意味着「一…就…」这个考点在 5 题里只有 1 题会考到**（`soon` 落空时考的是 `will` 或 `get`）。

### 7.3 一条重要护栏结论

**`as soon as` 句不会产出伪造干扰项**：实读 `grammarBoostService.ts:327-356`，②加后缀分支要求 `KNOWN_VERBS.has(lower)`，**`soon`／`as`／`stops`／`ends`／`arrives`／`ranks` 等全部不在表内** → 走③兜底（句内真词 ＋ 课程词池）。**实测 8 句 `as soon as` 候选的 cloze 选项**（用真服务构造等价卡片验证）：**全部是句内真词或课程词池真词**。

---

## 8. 基建护栏

### 8.1 课号／案号连续性

| 项 | 实测 | 判定 |
|---|---|---|
| 课号 | **1–141，连续无跳号无重号**（141 个 `number` 锚，逐一核对） | ✅ 下号 **L142** |
| 课 id 唯一性 | **141 个 id，141 个唯一** | ✅ |
| 案号 | **1–150，连续无跳号无重号** | ✅ 下号 **#151** |
| 案 id 唯一性 | **150 个 id，150 个唯一** | ✅ |
| `reviewed` 覆盖 | **150/150 ＝ 100%**（逐案扫描 `reviewed: true`，无遗漏案） | ✅ |
| 案件引用完整性 | **引用 146 次／145 案被引用／0 个悬空 id**；**5 案番外**（white-cat／sports-day／pen-pal-letter／fridge-note／term-review） | ✅ 番外制已登记（`huntCases.ts:22-28` 决策⑤） |
| 重复引用 | **`hunt-my-sister` 被引 2 次**（唯一重复） | 🟡 已存在，非新增 |
| 每课案数 | **127 课 1 案 · 8 课 2 案 · 1 课 3 案 · 5 课 0 案**；**L130–L141 全为 1 案** | ✅ 批二十二节奏（3 课 3 案）与近期待一致 |
| 空案课 | **[2, 3, 5, 6, 8]**（第一季基础课，`huntCases.ts:22-28` 明示「不配案，维持番外定位」） | ✅ 存量设计，非缺口 |

### 8.2 季分组／里程碑／episode

| 项 | 实测 | 行号 | 判定 |
|---|---|---|---|
| season 末项 | `{ id: "season-22", label: "第二十二季 · 虽然但是", min: 139, max: 141 }` | `grammarSeasons.ts:62` | ✅ 须续 **season-23 `{142, 144}`** |
| 季数 | **22 季**（season-1 – season-22） | `grammarSeasons.ts:20-62` | ✅ |
| 里程碑末项 | `id: "can-do-m24", afterLesson: 141` | `GrammarPathPage.tsx:283-284` | ✅ 须续 **m25（`afterLesson` ＝ 本批末课）** |
| 里程碑总数 | **24 个**（m1–m24） | `GrammarPathPage.tsx:120-290` | ✅ |
| episode 末项 | `"小美的一天 一百四十一"` | `grammarLessons.ts:26499` | ✅ 下号 **「一百四十二」** |
| season 覆盖守门 | `grammarSeasons.test.ts:43`「最高季区间的 max 覆盖全部课程」 | — | 🔴 **不加 season-23 会先红** |
| episode 连续性 | 逐课核对 一百三十九 → 一百四十 → 一百四十一（连续） | `:26111`／`:26305`／`:26499` | ✅ |

### 8.3 场景（`scene` 字段）池

| scene | 使用课数 | L130+ 用法 |
|---|---|---|
| `mansion` | **50** | L130·L131·L133·L134·L138·L139·L141 |
| `campus` | 37 | L132·L135 |
| `city` | 24 | L136·L140 |
| `sparkle` | 9 | L137 |
| `island`／`school` | 5／5 | — |
| `train`／`mystery` | 3／3 | — |
| `forest`／`magic`／`snow` | 2／2／1 | — |

> **实读裁定**：**`scene` 是「背景板」字段（不是叙事连续性的载体）**——**批二十二三课用了 `mansion`／`city`／`mansion`，与 L138 的 `mansion` 相连**。**`as soon as` 若续「雨景」，L109 的 scene 是 `city`（`:20302`），L139 是 `mansion`——两个都可续，无需新 scene。**

---

## 9. 封面池专章

### 9.1 当前用量

| 项 | 实测 |
|---|---|
| 封面文件数 | **117 张**（`src/assets/lessons/lesson-1.jpg` – `lesson-117.jpg`） |
| 引用次数 | **141 次**（＝课数，每课 1 张） |
| **单次张** | **93 张 ＝ cover25 – cover117** |
| **二用张** | **24 张 ＝ cover1 – cover24** |
| 三用张 | **0 张** |
| 附注 | **cover1–cover21 对应 L1–L21 ↔ L118–L138**（批二十一的严格一一对应）；**批二十二续用了 cover22–cover24（L139←cover22／L140←cover23／L141←cover24）** |

### 9.2 L142 起可用张与最优指派

**指派规则（沿用批二十二口径）**：对每张候选张算 `gap ＝ min(|新课后号 − 该张已用课号|)`；目标是**最大化 min-gap**（「新课后与该张上一次出现的最小间隔」尽量大）。

| 批量 | 最优指派 | min-gap | 解数 |
|---|---|---|---|
| **3 课（首选）** | **L142←cover25 · L143←cover26 · L144←cover27** | **117** | **1（唯一）** |
| 4 课 | L142←cover25 · L143←cover26 · L144←cover27 · L145←cover28 | 116 | 1 |
| 5 课 | cover25–cover29 | 115 | 1 |
| 6 课 | cover25–cover30 | 114 | 1 |

> **实读裁定**：**L142 起的最优解唯一，且是「从 cover25 起连续取」。** 全枚举（117³ 排列）实测：**达到 min-gap ＝ 117 的解只有 1 个**（`(cover25, cover26, cover27)`），次优 min-gap ＝ 116（8 个解）。**任何批量的最优解都是「从 cover25 起连续取 N 张」**——**「二用池」将从 24 张扩到 24＋N 张**（3 课版 → 27 张）。
>
> **⚠️ 一条须主理人知晓的副作用**：**「连续取」的副作用是「同一段封面在课与课之间视觉相似」**——**cover25–cover27 在 L25–L27 用过（第二季），本次在 L142–L144 二用**。**若想避免「相邻课封面风格跳跃」，可用「隔位取」（cover25／cover27／cover29），但 min-gap 会降到 115（不是最优）。**

---

## 10. G-boost 复核

### 10.0 测试基线（全库）

| 命令 | 结果 | 用时 |
|---|---|---|
| **`npx vitest run`** | **61 文件 / 799 项全绿（exit 0）** | 7.98s（transform 2.84s／tests 7.86s） |
| **`npx tsc --noEmit`** | **0 错（exit 0）** | — |
| `npx vitest run src/services/grammarBoostService.test.ts src/services/grammarReviewService.test.ts` | **2 文件 / 67 项全绿**（boost 50 ＋ review 17） | 5.56s |

> **⚠️ 一条与批二十二口径的差异**：批二十二盘点表写 G-boost「67 项全绿（boost 50 ＋ review 17）」，本次同口径复算**仍为 67**；**但批二十二表在「指标概览」里写的上期值是「66/67」**——**本盘点未追查该 66 与 67 的差异来源**（推测是批二十二成文时 review 侧少记一项）。

### 10.1 护栏测试

`npx vitest run src/services/grammarBoostService.test.ts src/services/grammarReviewService.test.ts` → **2 文件 / 67 项全绿**（boost 50 ＋ review 17）。

覆盖的四道护栏（实读测试源码）：
| 护栏 | 测试位置 | 现状 |
|---|---|---|
| 全库 cloze 干扰项不得是伪造词 | `grammarBoostService.test.ts:788-800` | ✅ 绿 |
| 每道 cloze 有 4 选项、含答案、互不相同 | `:802-811` | ✅ 绿 |
| 缩略词答案的干扰项须同族 | `:813-830` | ✅ 绿 |
| review 侧干扰项须是真实词 | `grammarReviewService.test.ts:298-327` | ✅ 绿 |

### 10.2 `Although`／`but` 会不会被变形产出 `Althoughs` 类非英语词（**主理人结论复核**）

**实测方法**：直接 import 真服务（`buildBoostItems`／`buildGrammarReviewTask`／`buildRevisitQuiz`），把 `Although`／`but`／`as`／`soon` 放上 cloze 答案位。

| 探针 | 引擎 | 产出 | 是否伪造 |
|---|---|---|---|
| `lesson-139-although` 全三档 | boost | t1 答案 `stay`，选项 `singer/stay/bus/then` | ✅ **无伪造** |
| `lesson-140-but-vs-although` 全三档 | boost | t1 答案 `not`，选项 `not/there/lets/heavy` | ✅ 无伪造 |
| `lesson-141-close-22` 全三档 | boost | t1 答案 `home`，选项 `old/find/home/apple` | ✅ 无伪造 |
| `Although it is raining, I will go out.` | review | rc0 答案 `Although`，选项 `out/i/is/Although` | ✅ **`Although` 无变形** |
| `It is raining, but I will go out.` | review | rc0 答案 `raining`，选项 `will/raining/but/is` | ✅ **`but` 只作干扰项出现，无变形** |
| `I will go out as soon as the rain stops.` | review | rc0 答案 `will`，选项 `stops/would/will/shall` | ✅ 无伪造 |
| `As soon as the rain stops, I will go out.` | review | **rc0 答案 `soon`**，选项 `i/rain/soon/go` | ✅ **`soon` 可被抽中（前置式）且无变形** |

> **实读裁定（给主理人结论）**：**复核成立——`Although`／`but` 不会被变形分支产出 `Althoughs` 类非英语词。**
> **根因（源码级，可引用）**：`grammarBoostService.ts:327-356` 的②分支有两道门——**`KNOWN_VERBS.has(lower)`（白名单 105 词）＋ `!IRREGULAR_VERBS.has(lower)`**。`although`／`but`／`as`／`soon`／`stops`／`ended`／`arrives` **全部不在 `KNOWN_VERBS`** → 跳② → 走③（句内真词 ＋ `courseVocabulary()` 词池）。**review 引擎（`grammarReviewService.ts:253-283`）同款双门。**
>
> **一条重要的补充发现（前置式 `as soon as` 在 review 引擎落点是考点词）**：**`As soon as the rain stops, I will go out.` 在 `buildGrammarReviewTask` 的 rc0 里，空位恰好落在 `soon` 上**（`contentTokenIndexes` 取「长度 >2 且非 `STOP_WORDS`」的词，`STOP_WORDS` ＝ `the/and/but/because/so/a/an`——**`as` 不在停用词表里但长度 <3 被排除；`soon` 长度 4 被选中**）→ **这是本批唯一「考点词能被自动抽中」的引擎路径**。**若生产期要保 `soon` 的落点，句子应在课内以「前置式」出现（`As soon as …, I will …`）。**

### 10.3 ⚠️ 复核中发现的存量问题（超出本批范围，建议顺手修）

**全库 cloze 干扰项扫描**（真服务，轮次 0）：**141 道 cloze 题，其中 8 道题的干扰项是英语里不存在的词（共 20 个词次）**，另 1 道题的干扰项是真词但词性不符（共 9 道题受影响）：

| 课 | cloze 答案 | 伪造干扰项 | 空位句 |
|---|---|---|---|
| `lesson-04-want` | `want` | **`wanting`／`wanted`／`wants`** | `I don't ___ an egg.` |
| `lesson-15-want-to` | `want` | **`wanting`／`wants`／`wanted`** | `I don't ___ to go.` |
| `lesson-23-have-lost` | `cleaned` | **`cleaneding`／`cleaneds`／`cleaneded`** | `I haven't ___ my room.` |
| `lesson-61-could-you` | `help` | **`helping`／`helped`／`helps`** | `I could ___ you.` |
| `lesson-73-how-long` | `takes` | **`takesed`／`takess`／`takesing`** | `It ___ ten minutes.` |
| `lesson-74-help-let` | `help` | **`helps`／`helping`／`helped`** | `She doesn't let me ___.` |
| `lesson-93-used-to` | `play` | **`plaies`** | `I didn't use to ___ here.` |
| `lesson-100-used-to-story` | `play` | **`plaies`** | `I didn't use to ___ here.` |
| `lesson-32-imperative` | `Close` | `closed`（**真词**，但 `Close` 是祈使句动词、`closed` 词性不符） | `___ the door, please.` |

> **计数说明**：**伪造词题 ＝ 8 道**（`want`×2 课／`cleaned`／`help`×2 课／`takes`／`play`×2 课）；**`Close→closed` 那 1 道是真词但词性不符**，计入「受影响题」为 9 道、计入「伪造词」为 8 道。**全库轮次 0–3 × 三档扫描共 423 题次，其中 27 题次命中（去重 9 道）**。

> **实读裁定**：**护栏测试是绿的，但存量仍有 9 道题的干扰项不合格（8 道伪造词 ＋ 1 道词性不符）。** 原因：**测试的 `FABRICATED` 正则（`:783-786`）只拦截「不规则动词＋后缀」的固定清单**，而**`want→wanting`／`cleaned→cleaneding`／`takes→takesed`／`play→plaies` 不在清单里**（`want`／`help`／`play` 是规则动词，`clean`／`take` 的变形也「形式合法」但在这些空位里不成立）。**两处「护栏缝」**：
> 1. **规则动词的叠后缀**（`cleaned` → 再产出 `cleaneds`／`cleaneding`／`cleaneded`）——**因为 `cleaned` 本身在 `KNOWN_VERBS` 里**（`grammarBoostService.ts:327-341` 的表含 `"cleaned"`）。
> 2. **`y` 结尾的 `ies` 规则**（`play` → `plaies`，正确应为 `plays`；**`play` 结尾是元音 ＋ y，不该变 `ies`**）。
> **建议**：把 `FABRICATED` 正则改成「**产出词必须能在 `bundledDictionary` 或课程词池里查到**」的白名单式断言（比黑名单更彻底）。**本批任务不要求修，但若批二十三新增造词类课程（如 `as soon as` 的 `soon`），建议同批修掉——否则新增的 `soon` 也可能落入同类缝（`soon` 不在 `KNOWN_VERBS`，实测不落，但 `stops`／`ends`／`arrives` 这类「以 -s 结尾的第三人称单数」若进 `KNOWN_VERBS` 就会落）。**

> **✅ 已闭环（2026-09-20，主理人在批二十三论证期修复）**：
> 1. **引擎侧**（`grammarBoostService.ts` 的变形分支）：改为**先把答案还原成基础形、再只对基础形生成变体**——`cleaned` → `clean`（产出 `cleans`／`cleaned`／`cleaning`，全是真词）；`takes` → `take`（在 IRREGULAR 表内，整支跳过）；`-ies` 规则收窄为「辅音 + y 才变」（`play` → `plays`，不再是 `plaies`）。
> 2. **实测复验**：数析指出的 9 道题全部洁净——`L23 cleaned → [glasses, cleaned, cleans, cleaning]`／`L73 takes → [begins, well, nine, takes]`／`L93 play → [plays, play, played, playing]`。
> 3. **守门断言**（`grammarBoostService.test.ts`，新增第 51 项）：「全库 cloze 干扰项不得是伪造词（词形结构判定）」——**已验证它能抓住 8/9 个历史伪造词**（`cleaneding`／`cleaneds`／`cleaneded`／`takesed`／`takess`／`takesing`／`plaies`／`wanteds`），且对真词（`sings`／`cleans`／`played` 等）零误报；`wanting` 属「真词但语义不搭」，归干扰项质量议题、不属伪造词。
> 4. **基线**：61 文件 / **800 项**全绿（+1）、`tsc` 0 错、`build` 通过。

---

## 11. 可生产性评估

### 11.1 `as soon as`（首选）的可生产性

| 维度 | 评估 | 依据 |
|---|---|---|
| 造词成本 | **1 新词（`soon`）＋ 1 认读升格（`as`）** | §1.4 |
| 场景可用性 | ✅ **雨景可直用**（`rain` 12 课共用，非独占）；换场景方案三选一均有代价（§3.3） | §2.1／§3 |
| 形式冲突 | 🟡 **1 个词形（`stops`）＋ 1 课（L109）＋ 1 案（#118）**；有两条切法（改场景／改对比轴） | §2.3 |
| cloze 落点 | 🔴 **ambush 侧 7/8 落 `will`（最差档）**；🟡 boost 侧 `soon` 20.1%（中等） | §7 |
| 罪名承载 | ✅ **6 类，含 `fragment`＋`run_on` 两个最薄档（本批最宽）** | §5.1 |
| 复现取材 | ✅ **无忧**（`I waited until the rain stopped.` 只占 1 课；7 句高危清单见 §6） | §6 |
| 基建 | ✅ season-23／m25／一百四十二／cover25–27／#151 全部就位 | §8／§9 |
| **综合** | ✅ **可生产**（成本比预估低，硬伤只有 cloze 落点与 L109 单点冲突） | — |

### 11.2 备选可生产性对照

| 候选 | 成本 | 撞车 | cloze 双通道 | 罪名承载 | 综合 |
|---|---|---|---|---|---|
| **`as soon as`** | **1 词** | 🟡 L109 单点 | 🔴 ambush 最差 ／ 🟡 boost 20.1% | ✅ **6 类（最宽）** | **首选（成本最低＋承载最宽）** |
| **`seem`／`appear`** | 2 词 | 🟢 无（与感官族同骨架） | ✅ **ambush 命中 ＋ boost 33.4%（唯一双通道友好）** | 🔴 3 类（最窄） | 🥈 **次选（落点最好、承载最窄）** |
| **`would rather`** | **1 词 ＋ `would` 第四义** | 🔴 **L62／L69／L70 已占 `would` 三用法** | 🟡 boost 25.1% | 🟡 5 类 | 🥉 **成本持平但附带最重** |
| **`neither/either/both`** | 🔴 **4 词 ＋ 3 串** | 🟡 L19／L20（连接词家族仅 2 课） | 🟡 boost 25–50% | ✅ 6 类 | 🔴 **成本最高（4 倍）** |

### 11.3 三条给主理人的量化建议

1. **`as soon as` 的造词成本重新标定为「1 个新词」**——批二十二 PRD 写的「须新造 `soon` ＋ `as` 的第三义」中，**`as` 的部分不成立**（L109 已认读）。**若因此把档位从 B 上调到 B+，数据支持**。
2. **L109 冲突的处理建议「切法乙」**（保留雨景 ＋ 显式做时态对照）——**因为换场景方案的三个场景都有代价（§3.3），而雨景本身不被 L109 独占（`rain` 只占 43.1%）**。**唯一必须避免的写法是「不解释地直接用 `as soon as the rain stops`」**（会把 L109 的错项记忆直接激活）。
3. **若本批目标含「补薄档」，则 `as soon as` 是不二之选**——**它是本批唯一能同时带 `fragment` ＋ `run_on` 的候选，而这两个档位各只有 14–15 个错点（最薄）**（§5）。

---

## 附录：核查留痕

### A1. 实读源文件清单 ＋ md5

| 文件 | 行数 | md5 |
|---|---|---|
| `src/data/grammarLessons.ts` | 26,686 | `656ac9c153cb31ca6e85667b54cc9de8` |
| `src/data/huntCases.ts` | 8,313 | `564171ced6fb9128f400064ee81c436d` |
| `src/data/grammarSeasons.ts` | 67 | `8f5553c9a058104ed3010935ddbdea17` |
| `src/data/grammarSeasons.test.ts` | — | `2c74e48900c27445c4003ea67dd921a8` |
| `src/data/grammarLessons.test.ts` | — | `d19c6448baed9ec5d92eb0378948a2af` |
| `src/data/grammarZeroTerms.ts` | — | `e767bfea6f2e0c7b4ad83ec530eccbab` |
| `src/services/grammarBoostService.ts` | — | `d9387d72011582a5da974e2a5a1cd526` |
| `src/services/grammarReviewService.ts` | — | `94074334c73cb549d81d73a2cbbea61a` |
| `src/services/grammarAmbushService.ts` | — | `84b306b40e881c4f9b8c8d000851686c` |
| `src/services/huntService.ts` | — | `ee1f22bf9bb529f68166e587e5de3468` |
| `src/pages/GrammarPathPage.tsx` | — | `9639d45265761782858a9e2c906192fd` |
| `src/pages/GrammarReviewPage.tsx` | — | `d75588859ba40123214d982f6ea188ae` |

### A2. 复刻脚本与实跑记录（均带出处）

| 脚本 | 内容 | 结果 |
|---|---|---|
| `/tmp/audit23/extract.py` | 六态状态机字符串提取 | GL 25,659 串／HC 6,127 串 |
| `/tmp/audit23/s0_baseline.py` | 基线（错点／罪名／案号／回流） | 574 错点／10 罪名／1–150 连续 |
| `/tmp/audit23/s1_soon.py` | `as soon as` 族与 `as` 分布 | `soon` 0/0；`as` GL 135→133（剔 `lesson-65-as-as`） |
| `/tmp/audit23/s2_families.py` | 时间家族 ＋ L109 ＋ 场景 ＋ 备选 | 全量逐课分布 |
| `/tmp/audit23/s6_repeat.py` | 复现头寸（复刻 test 口径） | 443 句／1 句 ×6／6 句 ×5 |
| `/tmp/audit23/realrun2.ts` | **真服务交叉验证**（`buildRevisitQuiz`／`buildBoostItems`） | ambush 输出 12 题、boost 输出 33 题，逐字核对 |
| `/tmp/audit23/cloze_replica.ts` | ambush 复刻验证 | **10/10 逐字一致** |
| `/tmp/audit23/cloze_verify2.ts` | boost 复刻验证（seed ＝ `sourceRef`） | **5/5 逐字一致** |
| `/tmp/audit23/cloze_forecast.ts` | 候选句落点预演 | §7 表 |
| `/tmp/audit23/cloze_rate2.ts` | 落点率 20 万种子实测 | §7.2 表 |
| `/tmp/audit23/gboost_full.ts` | 全库 cloze 扫描（423 题次） | 答案去重 127 种 |
| `/tmp/audit23/gboost_probe.ts` | 批二十二三课 cloze 体检 ＋ `Although`／`but` 探针 | 0 伪造／`Although` 无变形 |
| `/tmp/audit23/gboost_sweep.ts` | 全库 × 三档 × 轮次 0–3 扫描 | 27 题次含伪造干扰项（去重 9 道） |
| `/tmp/audit23/fake_verify.ts` | 用 `bundledDictionary` 交叉判定伪造词 | 20 个伪造词次／1 个真词（`closed`） |
| `/tmp/audit23/review_modes.ts` | review 引擎三模式逐轮次 | rc0 cloze／rc1 rebuild／rc≥2 free_type |
| `/tmp/audit23/mutation3.ts` | 40 轮内强制连词落空验证 | `Although` rc0 命中；`as`／`soon` 40 轮未命中 |
| `/tmp/audit23/final_probe.ts` | 前置式 `As soon as…` 落点 | **review rc0 落 `soon`** |

### A3. 本轮修正的两处前文口径（留痕）

| # | 批二十二表述 | 本轮修正 | 依据 |
|---|---|---|---|
| 1 | `as` GL「70 处」 | **70 串／133 词次**（口径是串，不是词次） | §1.2（`as` 词次 133） |
| 2 | `fragment` 14/13·`run_on` 14/12 | **`fragment` 15/14·`run_on` 19/15** | §5（tag 实读；**差额全部来自批二十二交付的 #148／#149／#150 三案**） |

### A4. 未核实（本盘点未做的事）

1. **未跑 app 端到端**：本盘点只跑服务层（`vite-node` 直接 import）与测试（`vitest`），**未在浏览器/GUI 里点一遍 L139–L141**（含 cloze 选项的渲染、选题顺序的用户感知）。
2. **未核实 `as soon as` 的发音/语音素材**：`speechService` 是否有 `soon` 的音素/TTS 覆盖**未查**（若跟读题依赖发音库，可能须补）。
3. **未核实 `bundledDictionary` 是否收 `soon`**：`fake_verify.ts` 只用它做「伪造词」判定，**`soon` 的词条是否存在未单独确认**（影响「生词提示」类功能的取材）。
4. **未核实案 #118 的 `stops` 错点在学生侧的实际表现**：本盘点只读数据，**无学习行为数据（错题率／停留时长）可验证「L109 冲突」的实际强度**。
5. **未核实「换场景」方案在叙事层的可行性**：`scene` 字段（`mansion`／`city` 等）是背景板，**「小美的一天」的剧情连续性（L109 屋檐下雨 → L139 撑伞出门）是否允许插入新场景，属产品判断，不在本盘点范围**。
6. **未逐一核对 443 条 practice 去重句的语义正确性**：§6 只统计出现次数，**未复核「6 课句」之外的句子在各自课里是否语义一致**（如 `Good morning!` 类是否被当作可复用套话）。
7. **未核实 `grammarBoostService.ts:86` 的注释「全库 221 条 bothRight」**：本轮实测 **`contrast.bothRight` 总条数 308**、**档 1 `bothright` 题型可用数 100**（`diffScore < 90` 过滤后）、**`contrast` 总条数 846**（141 课 × 6）→ **`bothRight` 一项的注释已过期**（与批二十二发现的 `:768` 注释过期同型），**但本盘点未逐一核对「221」是哪个时点的数**；**也未核实批二十二记的「bothright 97/138 课可用」为何与实测 100 题不符**（很可能是「可用课数」与「可用题数」两个口径，本轮未深究）。

---

**（报告完）**
