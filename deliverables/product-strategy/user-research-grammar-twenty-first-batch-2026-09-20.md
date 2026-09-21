# 用户研究综合报告 · 第二十一批（look forward to · 5 课）

**日期**：2026-09-20 ｜ **类型**：用户研究（批二十一选题）｜ **成员**：瑞思
**方法**：**全扫** `src/data/grammarLessons.ts`（**25,139 行／133 课**，md5 `92af8abf9f0f981dc4a75acf965093df`）与 `src/data/huntCases.ts`（**7,961 行／142 案**，md5 `cdf2a735f8600a18dbc466488a370895`）——**状态机提取引号内串、跳过 `//` 与 `/* */` 注释、行号→课号映射**（自建 `scan_grammar.py`，逐条带行号复核）；`forward` 族 **4 形态全量**（`forward`／`forwards`／`forward to`／`looking forward`）；`look` 家族**大小写敏感 + 词边界**的逐课分布；`to + <verb>-ing` 全量清单（排除专名 `Beijing` 干扰后 **79 处／10 课**）；名词侧九词 GL／HC **真词次 vs id 串双口径**；`-ing` 形式侧 **19 形态**计数；`object` 族 5 形态复核；**逐字复刻 `grammarAmbushService.ts:194-208` 的 `pickClozeWord`**（12 句候选实跑 cloze 落点）；**`vite-node` 实跑 `diffService.compareText/diffScore`**（34 对候选句对，验证 bothRight 卡的 `<90` 硬线）；**封面池穷举实算**（117 张 × L134–L138 五课的 min-gap）；**5 张封面目视**（`lesson-17/18/19/20/21.jpg`）；实读 L133（`:24947-25136`）、L120–L124（`:22431-23396`）、L125–L127（`:23397-23978`）、L76（`:14050`）、L87（`:16141`）、L27（`:4887`）、L67（`:12346`）；`npx vitest run` 全量基线。

**⚠️ 实读口径声明（本轮独有，必读）**：本轮首扫（20:47–20:51）时 `forward` **两文件全 0**，与批二十路线图 §6.2 前置①「两文件全 0」**逐字一致**；**复扫（20:53）时该值变为 GL 2 处**——L133 的认读种子位已被另一进程落盘（文件 mtime `Sep 19 20:52`）。**本文所有 `forward` 数据以 20:53 的冻结版本（md5 `92af8abf…`）为准，并同时并列首扫值**，避免「种子位到底在不在」成为下一批的账目纠纷（详见 §1-①）。

---

## 0. 结论先行

**推荐：L134–L138 五课大章「盼着那一天」——`look forward to` 一族**。`look forward to` 整块立岗（L134 `I am looking forward to the weekend.`）→ **换人换形**（L135 `She looks forward to the summer.`）→ **盼的是做某事**（L136 `I am looking forward to seeing you.`）→ **说不和问**（L137 `Are you looking forward to it?`）→ **零新知收口 ＋ 与批十八／十九切开**（L138）。**5 课、5 案（#143–#147）、封面 `cover17`–`cover21`**。

**本批是「B 档系列课程的收官批」**（主理人已定，本报告不再论证要不要做）。**收官的两层含义必须写进生产单**：① **它是 B 档候补清单里最后一个尚未交付的项目**——`have sth done`（C）维持撤出、形容词＋介词（B-）维持折卡、机制强化不做、`seem`／`appear`（D）不排期，**本批交付后批二十二的候补清单里将不再有 B 档及以上项目**；② **`look forward to` 已连续两批被列为候补第一**（批二十路线图 §6.2 序 1 原话「已连续两批被列为候补第一」），本批是它的**履约批**，不是新选题。→ **若本批被砍或缩量，B 档序列将出现「无候补可上」的空档**，这是本批与批十八–二十最本质的区别。

**5 课方案的四条理由（一句话版）**：① **增量恰好 4 项 + 1 次收口**（认整块／换人形／名字版侧／否疑），**第 6 课起无真实增量**（同骨架只能换名词，破「一课一增量」）；② **造词成本 2 词封顶**（`forward` 必造、`seeing` 推荐造），但**名词侧零造词**（`weekend` GL 真词次 9／`summer` 3／`party` 2／`birthday` 152）；③ **cloze「假友好」有解**——`She looks forward to the summer.` 的空位**实跑落在 `looks`**（`looks` 在 `GRAMMAR_WORDS` 表内），**是本族唯一能把空位压回考点词的形式**，L135 因此被指定为「**考点承载课**」；④ **与批十九、批十八各有一处真切开点**（`look` 第三张脸／同一个 `to` 第二站），且**两处切开的库内原文接口都已实读到手**（L127 `:23800`／L120 `:22519`）。

**形态红线（六条）**：① **5 课不外扩到 6 课**（第 6 课无增量）；② **一课一增量**（L138 零新知）；③ **每课 `contrast` 6 条中 3 条带 `wrongMark`**；④ **每课 1 案（4 错＝新 2＋旧 2）**，罪名只用 10 枚举、**不碰 `comparison`**；⑤ **旧错回流只取 L10／L11／L19／L25 等已教点**；⑥ **`forward` 的 2 处种子位不构成「已教」**（`examples` 第 4 条 ＋ `contrast` ⑥，均不进 `practice`／`guided`／`recall`——`guided`/`practice` 实读确认 0 处 `forward`）。**另：与批二十零交集天然成立**（批二十六课 `targetSentence` 不含 `to`，本批五课全部含 `to`——两批无重叠句）。

| 关键判断 | 裁决 | 理由（一句话） |
|---|---|---|
| 本批做不做？ | **做（主理人已定）** | B 档系列收官批；已连续两批候补第一 |
| 5 课还是 3 课？ | **5 课** | 增量 4 项＋收口 1 次；3 课会砍掉「名字版侧」或「否疑」其一 |
| 6 课能不能撑？ | **不能** | 第 6 课只能在同一骨架换名词（`party`／`birthday`），零新结构 |
| `forward` 是造词吗？ | **是（必造）** | 首扫两文件全 0；现有 2 处**全在 L133 种子位**，非教学内容 |
| 名词侧要造词吗？ | **不用** | `weekend` 9／`summer` 3／`party` 2／`birthday` 152（GL 真词次）；**`trip` 真词次 0、`holiday` 双 0——两词禁用** |
| cloze 友好吗？ | **假友好，但有一解** | `I am looking forward to the weekend.` 实跑落 **`am`**；**只有 `She looks forward to …` 落 `looks`（考点词）** |
| 与批十八重复吗？ | **不重复** | 批十八切的是 `used to` vs `be used to`（同一族的两个形）；本批切的是 `be used to` vs `look forward to`（**同形不同义**） |
| 与批十九重复吗？ | **不重复** | 批十九是「看」（后面跟「什么样」）；本批的 `look forward to` **根本不是看**（后面跟「要等的那件事」） |
| 封面够吗？ | **够（本批自己算过）** | 候选池＝`cover17`–`cover21`（5 张）；**gap 最优解 L134←`cover17` … L138←`cover21`（五张 gap 全 = 117，理论上限）**；`cover1`–`cover16` 全禁（二用张，gap 仅 1–16）；目视后可按语义在**同一组五张内**重排 |
| 案号 | **#143–#147** | 5 课各 1 案；#143–#146「新 2 ＋ 旧 2」，**#147 收口照 L124／L133／L142 先例四点全回流** |

---

## 1. 关键发现（实读证据）

### ① `forward` 族：**首扫全 0，复扫 GL 2 处（全在 L133 种子位）——两个值都必须写**

| 形态 | GL（20:47 首扫） | GL（20:53 复扫，冻结版） | HC | 逐条行号 |
|---|---|---|---|---|
| `forward` | **0** | **2 串** | **0** | `:24969`／`:25009` |
| `forwards` | 0 | 0 | 0 | — |
| `forward to` | 0 | 2 串 | 0 | `:24969`／`:25009` |
| `looking forward` | 0 | 2 串 | 0 | `:24969`／`:25009` |

**两处逐字抄出（认读种子位，实读原文）**：

- `:24969`（L133 `examples` 第 4 条）：`{ en: "I am looking forward to the weekend.", zh: "我盼着周末。（认读一句，混个脸熟）" }`
- `:25009`（L133 `contrast` 第 6 条）：`wrong: "I am looking forward to the weekend."` ＋ `wrongMark: null` ＋ `bothRight: true` ＋ `whyZh: "认读一句，混个脸熟：这句话说的是「我盼着周末」——今天只认脸，不学新花样（以后再说它）。"`

**三条护栏的实读复核（逐条通过）**：`guided` 六步 **0 处** `forward`／`practice` 五题 **0 处** `forward`／`recall` 的 `answer` 为 `It looks nice.`——**种子位确实只出现在 `examples` 与 `contrast` 两处，未越界**（复扫逐字段实读，非抽查）。

**对批二十一路线图前置①的诚实修正（本条最要紧）**：批二十路线图 §6.2 前置①写「`forward`／`forwards`／`looking forward` **两文件全 0**（**唯一不可替代成分，必造**）」。**该断言在批二十交付前成立、交付后不成立**——批二十按主理人裁决（PRD §1.2「主理人裁决取『加』，但只作认读种子位」）在 L133 落了 1 句、2 处。→ **批二十一的正确表述是「`forward` 已有 1 次见面、2 处字面占用，但 0 处作考点、0 处进练习——不构成『已教』，仍须整课造」**；**不得**再写「两文件全 0」（那会让生产单低估 1 处既有占用的对撞风险）。

**与「批二十的六课 `targetSentence` 不含 `to`」的关系**：L133 的种子位在 `examples`／`contrast`，**不在 `targetSentence`**，故批二十的 G11 红线（六课 `targetSentence` 不含 `to`）**未被打破**；但**全批 `to` 命中数 ≠ 0**（L133 两处）——批二十路线图 §6.2 已把它登记为「全批 `to` 命中数并单列」，本批认账。

### ② `look` 家族现状：**全库 375 处，L125–L133 九课占 351＝93.6%（实读，大小写敏感）**

逐形态 × 逐课分布（GL，词边界匹配，大小写分别计）：

| 形态 | GL 总 | 分布（课: 次数） |
|---|---|---|
| `look`（小写） | **144** | 19:1／27:2／65:1／83:1／87:1／92:1／112:1／121:1／123:1／**125:32／126:61／127:37**／128:3／133:1 |
| `looks` | **183** | 13:1／48:1／49:1／51:1／66:1／71:1／72:1／79:1／115:1／124:1／**125:56／126:37／127:42**／128:9／130:2／131:1／132:1／**133:25** |
| `looking` | **17** | 13:1／**27:10**／37:1／73:2／126:1／**133:2** |
| `looked` | **1** | **76:1** |
| `Look`（大写祈使） | **30** | 52:1／58:2／60:2／86:1／88:1／89:1／96:1／**127:21** |
| **合计** | **375** | **L125–L133 占 351（93.6%）**；**L1–L124 仅 24 处** |

**对本批的三条直接后果（实读支撑）**：

1. **`look` 的「注意力份额」已被批十九＋批二十占满**——L125–L127 三课 288 处、L128–L133 六课 63 处。**本批再做 `look`，必须承认这是 `look` 的第四个连续批次**（批十九 `look + 形容词` → 批二十 `look` 收口课 → 本批 `look forward to`）——**这是本批最大的观感风险，须用「切开设计」正面处理**（§6-③）。
2. **`looking` 只有 17 处，且 10 处在 L27「What are you looking for?」**（`:4895`／`:4898`／`:4902`／`:4912`／`:4914`／`:4950`／`:4951`／`:5064`／`:5065`／`:13602`）——**这是本批最重要的既有资产**：`looking` 的拼写本身在库内**有 10 处真实教学句**，L136 教 `looking forward to` 时可直接**正向复用 L27 的「正在找」**（**推翻了「`looking` 也要造」的假设**，见 §3-③）。
3. **`looked` 全库仅 1 处**（L76 `:14076`），`Look` 大写 30 处（21 处在 L127）——本批**不用过去版、不用祈使**，两条都在 §5 负迁移里显式排除。

### ③ `to + <verb>-ing` 正面教学句：**79 处／10 课，批十八占 71 处＝89.9%——「同族第二站」的接口是「批十八独木」**

逐课全量（排除专名 `Beijing` 后的 `to + [a-z]{3,}ing`）：

| 课 | 处数 | 性质 |
|---|---|---|
| L29 `:5293` | 1 | **❌ 错卡**：`I am going to watching.` |
| L44 `:8062` | 1 | **❌ 错卡**：`I go to the shop to buying milk.` |
| L46 `:8440` | 1 | **❌ 错卡**：`I want to traveling.` |
| L47 `:8627-8628` | 2 | **❌ 错卡**：`I should to helping her.` |
| L93 `:17314` | 1 | **❌ 错卡**：`I used to playing here.` |
| L100 `:18641`／`:18708` | 2 | **❌ 错卡**：`I used to playing here every day.` |
| **L120** | **33** | **✅ 正面教学**（`be used to + -ing`） |
| **L121** | **2** | ✅ 复现（`:22645`／`:22686` `She is used to walking to school.`） |
| **L122** | **24** | ✅ 正面教学（两张脸对照） |
| **L124** | **12** | ✅ 收口复现 |
| **合计** | **79** | **批十八 71 处＝89.9%；其余 8 处全是错卡反面例子** |

**结论（实读，与批二十路线图 §1.2 理由③一致，本轮独立复跑同值 79/10 课）**：**「同族第二站」在库里没有第二根柱子**——**正面教学句只有批十八一家**。→ 本批的接口**不是「接上批十八现成的句式池」**，而是**「在批十八唯一一根柱子上，挂第二盏不同的灯」**：**同一个 `to`，批十八教的是「前面站谁它听谁的」（be 在 → 名字版），本批教的是「同一块 to、换一个前面的词，它就换一张脸」**。**逐条接口原文**（可作为生产期的话术锚）：

- **L120 `:22519`**（总结句）：`习惯了「做某事」：后面那件事穿名字版（I am used to getting up early）——有 be 站着的 to，认名字版。`
- **L122 `:22851`**（脊柱句）：`加不加 be，是两张脸：有 be 是「习惯了」——She is used to working late；没 be 是「从前常」——She used to work late（后面穿原样）。`
- **L122 `:22900`**（总规则）：`同一个 to，前面站谁它听谁的：前面站 used（从前的记号）→ 后面穿原样；前面站 am／is／are／get（习惯记号）→ 后面穿名字版。一个 to，两张脸。`

**⚠️ 本批与批十八的「同族」必须做成的形状（不是重复，见 §6-③ 逐条）**：批十八的切口是 **`to` 前面站谁**（`used` vs `be`，**同一个 `used to` 家族的两个形**）；**本批的切口是 `to` 后面跟的东西的「源头」不同**——`be used to` 的 `to` 后面跟的是**「你习惯的那件事」**，`look forward to` 的 `to` 后面跟的是**「你盼着的那件事」**。**两族的共同点只有一条**：**后面那件事都要穿名字版**。→ **本批不得重讲「前面站谁」，只讲「后面为什么也是名字版」+「同一块 to 换前面的词就换脸」。**

### ④ 「盼着某事」的名词侧：**可零造词，但只有 4 个词可用**

GL／HC 双口径（**真词次 = 排除 `hunt-*`／`lesson-*` 等 id 串后的引号内出现次数**；id 串单独列）：

| 词 | GL 真词次 | GL id 串 | HC 真词次 | HC id 串 | GL 所在课（实读行号） | 裁决 |
|---|---|---|---|---|---|---|
| `weekend` | **9** | 3 | **5** | 3 | L29 `:5264`／`:5281`／`:5371`、L40 `:7301`、L49 `:8959`／`:8976`、**L133 `:24969`／`:25009`** | **✅ 主用它**（且 L133 种子位本身就用它——**首尾同词，闭环**） |
| `summer` | **3** | 0 | **5** | 0 | L18 `:3311`、L25 `:4585`、L46 `:8417` | **✅ 换人形课用它**（`in summer` 已在 L18／L25 教过） |
| `party` | **2** | 0 | **2** | 0 | L57 `:10480`／`:10536`（`The party is on June 2.`） | ✅ 可用（薄，**只作换词位、不作新考点**） |
| `birthday` | **152** | 3 | **9** | 3 | L27 `:4908`／`:4924`／`:4926`、L56／L57／L60／L85／L92／L97／L111／L112／L117／L118 | ✅ 厚词（**`my birthday` 35 处**）；**⚠️ 与批十七 L117 的 `Grandma's birthday` 有交叠，作换词位可以、作主句要防「批次串味」** |
| `letter` | **8** | 0 | **0** | 1 | L23 `:4166`／`:4220`／`:4251`／`:4252`、L52 `:9536`／`:9591`、L53 `:9724`／`:9777` | ⚠️ 备选（**全部是被动／完成句**，语义偏「信」不偏「盼」） |
| `photo` | **3** | 4 | **6** | 4 | L60 `:11030`／`:11043`／`:11047` | ⚠️ 备选（薄 + 与 L60 强绑定） |
| `picnic` | **1** | 0 | 0 | 0 | L60 `:11048`（`We had a picnic in the park.`） | ❌ 太薄 |
| **`trip`** | **0** | 1 | **1** | 1 | 仅 id 串 `hunt-trip-time`（L73 `:13667`） | **❌ 禁用**（真词次 GL 0；批二十八次引用的 `trip` 是 id 串误读） |
| **`holiday`** | **0** | 0 | **0** | 0 | — | **❌ 双 0，禁用**（与批二十路线图一致） |

**关键修正（实读）**：批二十路线图 §6.2 前置①写「『盼着某事』侧可零造词（`weekend` 7＋5／`birthday` 146＋9／`party` 2＋2／`summer` 3＋5 全在库）」。本轮**独立复算得 `weekend` 9＋5**（GL 9，非 7）——**差 2 的来源已定位：L133 种子位两句各含 1 个 `weekend`**（`:24969`／`:25009`，批二十新增）。`birthday` GL 152（非 146）同理受新批次影响。→ **本报告以 9＋5／152＋9／2＋2／3＋5 为准，并把「差值是批二十新增」写清楚。**

### ⑤ `-ing` 形式侧：**`seeing` 必须造；`looking` 已有 10 处可复用；`going`／`reading` 等厚词可作对比卡**

| 形态 | GL 真词次 | HC | GL 所在课 | 裁决 |
|---|---|---|---|---|
| **`seeing`** | **0** | **0** | — | **❌ 双 0 → 必造**（但**只在 L136 造 1 次**，且**可被 L87 的 `It's nice to see you.` 正向解释**：`see` → `seeing` 的拼写规律在同批内可借力） |
| **`looking`** | **17** | 0 | L27 十处（`:4895`…`:13602`）、L73 两处、L13／L37／L126 各 1、L133 两处 | **✅ 库内已有，零造词**（**推翻批二十路线图「`looking forward` 必造」中的 `looking` 部分**：`looking` 本身有 10 处教学句） |
| `going` | 124 | 16 | L9／15／16／28／29／30／38／75／108／110 | ✅ 厚（对比卡可用） |
| `reading` | **594** | 44 | 27 课 | ✅ 最厚（**L42 主场**） |
| `playing` | 37 | 9 | 13／25／34／51／93／95／98／100／122 | ✅ |
| `meeting` | **0** | 0 | — | ❌ 禁用 |
| `visiting` | **0** | 0 | — | ❌ 禁用 |
| `coming` | 3 | 0 | L38 | ⚠️ 薄 |
| `getting` | 136 | 16 | L16／109／120／121／122／124 | ⚠️ **批十八专用，本批避让**（防串味） |
| `walking` | 39 | 6 | L120／121／122／124 | ⚠️ **批十八专用，本批避让** |
| `waiting` | 6 | 2 | L24／61／104／105／108 | ⚠️ 可用但要小心语义（`waiting for` 是另一个门牌） |
| `swimming` | 68 | 6 | L13／14／42／43／67／72 | ✅（L67 `good at swimming` 已教） |

### ⑥ `object to` 族复核：**两文件全 0，维持 C 档不上前 3 课——本轮结论不变**

| 形态 | GL 串 | HC 串 |
|---|---|---|
| `object` | **0** | **0** |
| `objects` | 0 | 0 |
| `objected` | 0 | 0 |
| `objecting` | 0 | 0 |
| `objection` | 0 | 0 |

**结论**：`object to` 的**造词成本比 `look forward to` 更高**（`object` 是零底座**抽象动词**，`forward` 至少是「方向小词」且已有 1 次见面）；**维持撤出，连认读也不给**（与批二十路线图 §6.2 序 2／批二十 PRD §1.2 一致）。

### ⑦ 零术语红线：本批是**双重高危**（29 词表 ＋ 批十八额外禁词）

**实读** `src/data/grammarZeroTerms.ts:16-25` 的 **29 词表**，其中**「介词」「宾语」在表内**；批十八／十九 PRD 的额外禁词清单**另含「不定式」「动名词」「非谓语」**。→ **`look forward to` 的语言学描述正是「介词 to + 动名词」——三个红线词（介词／不定式／动名词）全命中，且本批的核心增量就是「to 后面跟名字版」，是全项目最容易写出这三个词的一批**。

**已有的自建话术（实读库内原文，可直接复用）**：

- **「门牌」**：库内 **34 处**（L67 `:12363` `at 是它的门牌，门里穿名字版。`／`:12430` `第 18 课认识过 in / on / at 三块门牌`）——**本批可复用，但须防「两套门牌串台」**（批二十路线图 §6.2 序 3 已警告）。
- **「记号」**：库内 **26 处**（L119 `:22441` `有 be 站着——习惯的记号`）。
- **「名字版」**：库内 **202 处**（L120 `:22519`／L122 `:22910`）——**本批的主力话术**。
- **「两张脸」**：库内 **47 处**（L122 `:22851`／L127 `:23786`）。

**❌ 库内 0 处（本批须新造，不得引用既有话术）**：`朝`／`朝着` **0 处**、`期待` **0 处**。→ 批二十 PRD §388 建议的「朝着那个小牌子」**在库里没有先例**，必须自建；**`盼` 库内仅 2 处，且两处都是 L133 种子位本身**（`:24969`／`:25013`）——**「盼」这个字是本批第一次正式启用**。

### ⑧ cloze 机制「假友好」的实测（本批最重要的技术发现）

**逐字复刻 `grammarAmbushService.ts:194-208` 的 `pickClozeWord`**（① `GRAMMAR_WORDS` 表 → ② 实词回退（len≥3 且非停用词）→ ③ 第 2 词），对 12 句候选实跑：

| 候选句 | cloze 题干（实跑） | 空位答案 | 判定 |
|---|---|---|---|
| `I am looking forward to the weekend.` | `I ___ looking forward to the trip…` | **`am`** | **❌ 假友好**（落 be 动词，非考点词） |
| **`She looks forward to the summer.`** | `She ___ forward to the weekend.` | **`looks`** | **✅ 真友好**（`looks` 在 `GRAMMAR_WORDS` 表内，落在考点词上） |
| `We look forward to the weekend.` | `We ___ forward to the weekend.` | `look` | ✅ 也友好（`look` 在表内） |
| `I am looking forward to seeing you.` | `I ___ looking forward to seeing you.` | `am` | ❌ 假友好 |
| `I'm looking forward to the weekend.` | `___ looking forward to the weekend.` | `I'm` | ❌ 假友好（缩写整体抽空） |
| `I am looking forward to my birthday.` | `I ___ looking forward to my birthday.` | `am` | ❌ 假友好 |
| `Tom is looking forward to the summer.` | `Tom ___ looking forward to the summer.` | `is` | ❌ 假友好 |

**`GRAMMAR_WORDS` 表内实读确认（`grammarAmbushService.ts:160-190`）**：`look`／`looks` **在表内**；`am`／`is`／`are`／`be` **在表内**（且 `findIndex` 取**第一个**命中）；**`forward`／`looking`／`seeing` 均不在表内**。→ **`forward` 与 `looking` 永不成空位**（与批二十路线图 §6.2 前置③逐字一致，本轮独立复刻实跑确认）。

**由此得到的本批设计铁律**：**「`I am looking forward to …` 形式永远把空位送给 `am`」**——所以 **L134 的 `practice` 不能拿它当唯一考点承载题**；**考点承载须压在 `contrast` 与 `guided.spot` 上**（与批二十路线图前置③一致）；而 **L135 的 `She looks forward to the summer.` 是全族唯一「cloze 落在考点词」的形态**，故 **L135 被指定为本批的「cloze 保障课」**（§4／§6-④）。

**同时推翻两条**：批二十路线图前置③说「`I am looking forward to the trip.` 落 `am`」**成立**；但它未指出的**例外侧**是本批的新增信息——**`She looks forward to …`（前面是「她」）落 `looks`**，**本批必须至少有一课用这个形态作 `targetSentence`**。

### ⑨ 测试基线（实跑，两个时点）

| 时点 | 文件 | 命令 | 结果 |
|---|---|---|---|
| 20:47（首扫版本） | `grammarLessons.ts` 未被 L133 种子位覆盖 | `npx vitest run` | **61 文件 / 798 项全绿**（9.05s） |
| 20:53（冻结版本，md5 `92af8abf…`） | 已含 L133 两处种子位 | `npx vitest run` | **61 文件 / 798 项全绿**（6.11s） |

**基线结论**：**61 文件 / 798 项**——与批二十路线图预期一致；**L133 种子位落盘未改变测试数**（种子位在 `examples`／`contrast`，不进任何守门断言；`grammarLessons.test.ts` 的零术语断言只守 `grammarLabel`／`oneLineRule`／`summary.rule`／`whyZh`／`explain`／`noteZh`——**L133 种子位的 `whyZh` 已实读为零术语干净**）。

---

## 2. 主题分析表

### 2.1 主题定位：**`look forward to` 是「同一个 `look` 的第三张脸」＋「同一个 `to` 的第二站」的交点**

| 维度 | 批十八（`be used to`） | 批十九（`look + 形容词`） | **本批（`look forward to`）** |
|---|---|---|---|
| 核心词 | `to` ＋ `used` | `look` | **`look` ＋ `to` ＋ `forward`** |
| 教的切口 | `to` **前面站谁** | `look` **后面跟什么** | **`to` 后面跟的那件事的「来源」**（习惯的事 vs 盼着的事） |
| 名字版 | ✅ 教（`getting`／`walking`） | ❌ 不涉及 | ✅ **复用（不是新教）** |
| 目标句长度 | 6–7 词 | 3–4 词 | **6–7 词**（本批最长） |
| 造词 | 0（`used` 有垫子） | 0（16 处垫子） | **2 词**（`forward` 必造、`seeing` 必造；**`looking` 零造词**） |
| 档位 | A（有垫子） | B（零冲突无课位） | **B+（词典义项级 CEFR B1 ＋ 两个 Cambridge 专页 ＋ `Verb patterns` 总索引 8 专条之一 ＋ `prepositional-verbs` 词表内）** |

### 2.2 需求驱动：中文侧「盼」是一个**没有英文对应单字**的高频表达

**中文负迁移的三条真实病灶（本批必须一次接住）**：

| # | 中文说法 | 学习者会造出的英文 ❌ | 病灶（中文思维） | 落点课 |
|---|---|---|---|---|
| ① | 我盼着周末 | `I am looking forward to see the weekend.`∗／`I look forward to the weekend.`（漏 `-ing`） | **「盼」后面跟的是「一件事」，中文不区分「做」和「做的事」** | **L136**（名字版侧） |
| ② | 我盼着你来 | `I am looking forward to you come.`／`I am looking forward to come.` | **中文「盼着你来」是「人 + 动作」两段，英语要把动作整块穿上名字版** | **L136** |
| ③ | 我盼着周末 | `I am look forward to the weekend.`（漏 `am`）／`I looking forward to the weekend.` | **中文「盼着」是一个动词，英语是「be ＋ looking」两个词挤在一起**（**与批二十 L133 的「两个词挤一挤」同型**） | **L134／L135** |
| ④ | 我盼着周末（问句） | `I am looking forward to the weekend?`（**只用升调、不搬词**） | **中文问句靠「吗」和升调，不需要搬家** | **L137** |

**来源标注**：`grammarZeroTerms.ts` 与库内**均无**「盼」的既有教学内容（`盼` 仅 2 处、都在 L133 种子位）——**这四条是我按中文侧表达习惯归纳的推断（推断，非实读）**，**但 ③ 的形状（`be` ＋ `-ing` 两词挤一挤）有库内实读支撑**（L87 `:16145` `两个词挤一挤 · It's`；L132 的否疑合体课已在批二十做过同型设计）。

### 2.3 库内「第三张脸」的切法先例（实读原文，直接可抄）

| 先例 | 行号 | 原文 | 本批怎么用 |
|---|---|---|---|
| L127 两张脸切开 | `:23800` | `同一个 look，两张脸：喊人去看是 Look at the clouds!（后面跟「去哪儿看」）；说看着什么样是 The sky looks dark.（后面跟「什么样」）——后面跟的东西不一样，说的就不是一件事。` | **本批抄「后面跟的东西不一样，说的就不是一件事」这个句式**，把第三张脸接上：`Look at …`（跟「去哪儿看」）／`The sky looks dark.`（跟「什么样」）／**`I am looking forward to the weekend.`（跟「要等的那件事」）** |
| L128 骨架复用 | `:24063` | `第 127 课说过「同一个 look 后面跟的东西不一样，说的就不是一件事」。今天这个 sound 也一样：它后面跟一个「怎么样」的词，就是「听起来怎么样」。` | **批二十已示范「跨批接住 L127 的句子」的写法**——本批照此接住 L128 的 `sounds`（**「同一个 look 有第三张脸」**） |
| L122 同一个 to 两张脸 | `:22900` | `同一个 to，前面站谁它听谁的…一个 to，两张脸。` | **本批把「两张脸」升级为「同族第二站」**：`be used to`（习惯的事）／`look forward to`（盼着的事）——**同一块 to、同样的名字版，换的只是前面的词** |
| L120 名字版来源 | `:22519` | `习惯了「做某事」：后面那件事穿名字版…有 be 站着的 to，认名字版。` | **L136 的话术母版**（把「习惯了」换成「盼着」即可，**其余一字不改**——这是「同族」而非「重复」的关键：**讲的是同一块 to 的同一条规矩**） |

### 2.4 封面的实算（本批自己算，逐张穷举）

**实读**：117 张图（`import cover1`–`cover117`，`grammarLessons.ts:3-119`）；**133 课 133 次引用**；**二用张恰为 `cover1`–`cover16`**（`cover1`→L1＋L118、`cover2`→L2＋L119、…、`cover16`→L16＋L133，逐张实读行号 `:22046`／`:22242`／…／`:24954` 确认）；**`cover17`–`cover117` 全部单次使用，首次使用点＝自身编号**。

**算法**：对每个候选封面 `c`，取它与 L134–L138 五课各自最近使用点的距离（min-gap），**阈值 35**（沿用批十九／二十既有可用线）。**逐张实算结果**：

| 封面 | 使用点 | L134 gap | L135 | L136 | L137 | L138 |
|---|---|---|---|---|---|---|
| `cover1`–`cover16` | **二用（如 `cover16`→L16＋L133）** | **1–16** | — | — | — | — |
| **`cover17`** | `[17]` | **117** | 118 | 119 | 120 | 121 |
| **`cover18`** | `[18]` | 116 | **117** | 118 | 119 | 120 |
| **`cover19`** | `[19]` | 115 | 116 | **117** | 118 | 119 |
| **`cover20`** | `[20]` | 114 | 115 | 116 | **117** | 118 |
| **`cover21`** | `[21]` | 113 | 114 | 115 | 116 | **117** |
| `cover22`–`cover99` | 单次 | ≤112 | … | … | … | … |
| `cover100` | `[100]` | 34 | 35 | 36 | 37 | 38 |
| `cover117` | `[117]` | 17 | 18 | 19 | 20 | 21 |

**结论（穷举实算）**：

- ❌ **`cover1`–`cover16` 本批禁用**：全部是二用张，在 L134 处的 min-gap 仅 **1–16**（`cover16`→L133 是批二十刚落的最扎眼的一张，gap 仅 1），**全部远低于 35 线**。
- ✅ **最优指派 `L134←cover17`／`L135←cover18`／`L136←cover19`／`L137←cover20`／`L138←cover21`，五张 gap 全 = 117（理论上限，解唯一）**——任何错位都会把 min-gap 拉低（如 `cover17` 若给 L135 则 min-gap 变 116）。
- **其它可行解**：`cover17`–`cover99` 任意五张都能过 35 线，但**只有上面这一个解的 min-gap 达到 117 上限**。
- **末位天花板**：`cover21` 给 L138 → gap **117**；`cover100` 给 L134 → gap 仅 34（**出局**）。
- **目视核对（5 张，实读图像）**：`lesson-17.jpg`＝海边小船（夏日感，**配 L135 `the summer` 最相称**）；`lesson-18.jpg`＝卧室窗边书桌玩具箱（配 L134 立岗可用）；`lesson-19.jpg`＝书桌画纸（配 L136／L138 可用）；`lesson-20.jpg`＝雨天校门口撑黄伞（**配 L137「盼着放假」有反差，可作备选**）；`lesson-21.jpg`＝门口母女（**配「盼着有人来」最相称，但本批 `seeing you` 若指朋友，语义需重排**）。→ **建议指派（可互换，语义优先）**：`L134←cover18`／`L135←cover17`／`L136←cover21`／`L137←cover20`／`L138←cover19`——**与 gap 最优解是同一组五张（集合相同），互换不影响 min-gap（五个 gap 值仍是 113–121 全过线）**；**唯一硬红线 = 五张必须从 `cover17`–`cover21` 里取，池外零新资产**。

---

## 3. 方案对比表

### 3.1 三方案总览

| 维度 | **甲·3 课**（L134–L136） | **乙·5 课（推荐）**（L134–L138） | 丙·6 课（L134–L139） |
|---|---|---|---|
| 课序 | 认整块 → 换人形 → 名字版 | 认整块 → 换人形 → **名字版** → **否疑** → **零新知收口** | 乙 ＋ 第 6 课「换名词」 |
| 增量数 | 3 | **4 ＋ 1 次收口** | 4 ＋ 收口 ＋ **0**（第 6 课零新结构） |
| 「一课一增量」 | ✅ | ✅ | **❌ 第 6 课只能换名词（`party`／`birthday`），破线** |
| 否疑（说「不」和「问」） | **掉**（本族唯一的 be 问句形态无处安放） | ✅ L137 | ✅ |
| 与批十八切开 | 无位置（课量太紧） | ✅ **L138 专门承担** | ✅ |
| 与批十九切开 | 无位置 | ✅ L138 | ✅ |
| 造词 | `forward`＋`seeing` | **同左（2 词）** | 同左（不会因为多一课而少造） |
| 封面对 | `cover17`–`cover19` | **`cover17`–`cover21`** | `cover17`–`cover22` |
| 案号 | #143–#145 | **#143–#147** | #143–#148 |
| 预估人日 | ≈2.0 | **≈3.0**（5 课 ＋ 展示层 ≈0.25） | ≈3.5（但含一课的无效增量） |
| 结论 | ⚠️ 可用但**砍掉了「同族第二站」的对照位**（收口课的切开价值最高） | **✅ 推荐** | ❌ 不推荐（为凑整齐加了 0 增量的一课） |

### 3.2 造词成本对照（实读口径）

| 成分 | 是否必造 | GL 真词次 | HC | 造词成本 | 不可替代性 |
|---|---|---|---|---|---|
| **`forward`** | **必造** | **2（全在 L133 种子位，非教学）** | 0 | **高**（抽象方向小词，中文「盼」无对应字） | **★★★ 唯一不可替代** |
| **`seeing`** | **必造** | **0** | 0 | 中（可由 L87 `It's nice to see you.` 的 `see` 正向借力，拼写规律同批内可解释） | ★★ |
| `looking` | **不用造** | **17（L27 十处教学句）** | 0 | **零** | — |
| `weekend` | 不用造 | **9** | **5** | 零 | — |
| `summer` | 不用造 | **3** | **5** | 零 | — |
| `party` | 不用造 | 2 | 2 | 零（薄） | — |
| `birthday` | 不用造 | **152** | 9 | 零（厚） | — |
| `it`（`to it`） | 不用造 | 海量 | 海量 | 零 | — |

**结论**：**本批的造词成本＝2 词，与批十八（0 词）有本质区别、与批二十（3 动词）同级略低**。→ **对外一律写「造词课：须新造 `forward` 与 `seeing` 两个词」**；**不得**写「库内有垫子」、**不得**写「零成本」。

**⚠️ 一条诚实折扣（必须与增项并列写）**：`forward` 与 `seeing` **都是「不可替代」的**——`forward` 是本族的身份词（换掉就不是 `look forward to`），`seeing` 是「盼着做某事」的第一例（本批若只用名词侧，L136 就不成立）。**批十八当年是「库内有垫子 0 造词」，本批是「2 词必造」——档位虽然更高（B+），成本也确实更高。**

### 3.3 cloze「假友好」的处置（本批的技术核心，逐条给解）

**问题复述（实跑）**：`I am looking forward to the weekend.` 的 cloze 空位**实跑落 `am`**（`am` 在 `GRAMMAR_WORDS` 表内且是第一个命中）——**学生抽掉的是 `am`，不是 `forward`、不是 `looking`**。→ **本批的考点词永不成空位**，cloze 的「考」是**假考**。

**四条处置（缺一不可）**：

| # | 处置 | 具体做法 | 依据 |
|---|---|---|---|
| ① | **指定一课做「cloze 保障课」** | **L135 的 `variants[0]`（肯定）逐字＝`She looks forward to the summer.`** → 复练 quiz 的 cloze **实跑落 `looks`**（考点词） | 实跑（本轮）：`She ___ forward to the weekend.` 答案 `looks` |
| ② | **考点承载压在 `contrast` 与 `guided.spot`** | 每课 6 条 `contrast` 里 **3 条带 `wrongMark`** 的错卡**全部对准本批新错**（`look`／`am looking`／`to seeing`／`Do→Are`）；`guided` 六步里**每课至少 1 道 `spot`**（点错词，不依赖 cloze） | 批二十路线图 §6.2 前置③原文；**spot 题不走 cloze 通道**（实读 `LessonGuidedStep.kind: "spot"`） |
| ③ | **`practice` 里放「非 be 开头」的句子提密度** | `practice` 是**点词成句**（不走 cloze，实读 `LessonPracticeStep`），**故 practice 是安全的密度位**——把 `We look forward to the weekend.`／`She looks forward to the summer.` 放进去 | 实读 `practice` 无 cloze 字段 |
| ④ | **登记三处实跑落点** | 生产期须逐条登记：L134 肯定变体落 **`am`**（假）／L135 肯定变体落 **`looks`**（真）／L137 疑问变体落 **`Are`**（边界）——**并把「假友好」写在 L134 的生产单上，避免生产期误以为 cloze 已在考 `forward`** | 本轮实跑 7 句的落点表（§1-⑧） |

**一句话结论**：**「cloze 是假友好」不是本批的缺陷，而是本批的设计前提**——**只要 L135 承担保障位、L134 把承载压到 spot，本族的 cloze 反而变成「be 动词练手位」，与批十八（`I am used to …` 落 `am`）完全同构，学生不会有新的不适。**

### 3.4 与批十八「同族第二站」的设计差异（防重复自查表）

| 检查项 | 批十八做过了吗 | 本批若做会重复吗 | 本批的差异化做法 |
|---|---|---|---|
| `to` 后面穿名字版 | ✅ L120 逐字教过（`:22446`／`:22519`） | ⚠️ **会** | **本批不新教这条规矩**——L136 只做**一次点名复用**（`你学过的规矩，今天换一件事`），并把话术从「习惯了」换成「盼着」 |
| 「前面站谁它听谁的」 | ✅ L122 逐字教过（`:22900`） | ❌ 不提 | **本批完全不讲「前面站谁」**——只讲「前面换一个词，整张脸就换了」（`I am looking` → `She looks`） |
| `to` 的「门牌」话术 | ⚠️ L67 用 `at` 作门牌（`:12363`） | ⚠️ **会串台** | **本批不用「门牌」二字**（避免「`at` 门牌 vs `to` 门牌」两套串台）；改用 **「一整个块」**（`look forward to` 三个字一起记） |
| `to` 丢失型错卡 | ✅ L120 ③（`:22474` `I am used getting up early.`）／#129／#131 | ✅ **可复用形状、但换词族** | L144 的 `She looks forward to summer.`（漏 `the`）与 L145 的 `forward for seeing`（用错小词）**是两条不同的错**，不是「to 丢了」的第三次翻版 |
| 说「不」和「问」 | ✅ L123（`I am not used to it.`／`Are you used to the cold?`） | ⚠️ **形状相同** | **本批只做 L137 一课、且不重复讲「not 跟 be 走」**——L137 的增量是「**`Do` 还是 `Are`**」这条新岔路（中文没有 be，最自然的错就是 `Do you looking…`） |

---

## 4. 大章节设计方案（L134–L138）

**章节定位**：**season-21 · 第二十一季 · 盼着那一天**（`min: 134, max: 138`）＋ **m23（afterLesson 138）**。**单拱**：一条「**日历／本子 → 窗外 → 校门口 → 电话 → 本子最后一页**」的线。**场景 id 全部用库内既有**（`mansion`／`sparkle`／`city`／`campus`）。

| 课 | id | 主题（增量） | targetSentence（≤8 词） | blocks | 接口复现 | 案 ＃／罪名 |
|---|---|---|---|---|---|---|
| **L134** | `lesson-134-looking-forward-to` | **认整块**：`look forward to` 是**一整个块**，后面跟「要等的那件事」 | `I am looking forward to the weekend.`（7 词） | `I am looking forward to`＝「我盼着（be ＋ looking 两个词挤一挤）」／`the weekend`＝「要等的那个周末」 | 复现 L133 `:24969` 种子位原句（**认读转正**）；复现 L87 `:16145`「两个词挤一挤」的老话术 | **#143**：missing_be（`looking`→`am looking`）＋ verb_form（`look`→`looking`）＋ tense（L10 `see→saw`）＋ sv_agreement（L19 `was→were`） |
| **L135** | `lesson-135-she-looks-forward-to` | **换人换形**：前面的词换人，「盼」的那个词跟着变；**cloze 保障课** | `She looks forward to the summer.`（6 词） | `She looks forward to`＝「她盼着（她配带 s 的 looks）」／`the summer`＝「要等的那个夏天」 | 复现 L134 原句（`I am looking` → `She looks`）；复现 L126 `:23593`「换人换形」（`You look`／`She looks` 的老规矩） | **#144**：sv_agreement（`look`→`looks`）＋ article（`summer`→`the summer`）＋ plural（L11 `sandwich→sandwiches`）＋ sv_agreement（L25 `play→plays`） |
| **L136** | `lesson-136-looking-forward-to-seeing-you` | **盼的是做某事**：后面那件事要穿名字版（**复用批十八的规矩，换一件事**） | `I am looking forward to seeing you.`（7 词） | `I am looking forward to`＝「我盼着」／`seeing you`＝「见到你（那件事穿名字版）」 | **点名复用 L120 `:22519`**（`有 be 站着的 to，认名字版`）；复现 L42 `:7647`（`grammarLabel: "动词的第二份工作 · -ing"`，原文：`I like reading.` @ `:7663`）（`like + reading` 的老规矩）与 L87 `:16163`（`see` 的既有句） | **#145**：verb_form（`see`→`seeing`）＋ preposition（`for`→`to`）＋ tense（L10 `eat→ate`）＋ plural（L11 `egg→eggs`） |
| **L137** | `lesson-137-are-you-looking-forward-to-it` | **说不和问**：说「不」要请 `am`／`are` 站队；问句**是 `Are` 搬家、不是请 `Do` 帮手** | `Are you looking forward to it?`（6 词） | `Are you looking forward to`＝「你盼着吗（Are 搬句首）」／`it`＝「那件事」 | 复现 L123 `:23015`（`说不和问 · not 跟 be 走、Are 搬句首` 的既有规矩，实读原文 `:23064`／`:23103`／`:23201`）；**与批二十 L132 `Does it sound good?` 正面切开**（`be` 在 → 自己搬；`be` 不在 → 才请帮手） | **#146**：missing_be（`not`→`am not`）＋ verb_form（`Do`→`Are`）＋ sv_agreement（L19 `was→were`）＋ sv_agreement（L25 `drink→drinks`） |
| **L138** | `lesson-138-look-forward-to-close` | **零新知收口 ＋ 两处切开**（同一个 `look` 第三张脸／同一个 `to` 第二站） | `I am looking forward to the weekend.`（7 词，**取 L134 主句，收口从第一行读起**） | `I am looking forward to`＝「盼着」／`the weekend`＝「要等的那件事」 | **L138 是切开课**：① 抄 L127 `:23800`（「同一个 look，两张脸…后面跟的东西不一样，说的就不是一件事」）把第三张脸接上；② 抄 L122 `:22851`（「加不加 be，是两张脸」）把「同族第二站」接上 | **#147**：**四点全回流（锚本批 #143–#146）**——missing_be（锚 #143②）＋ article（锚 #144②）＋ verb_form（`see`→`seeing`，锚 #145①）＋ verb_form（`Do`→`Are`，锚 #146②） |

### 4.1 逐课设计要点（生产单可直接抄）

**L134 · 认整块（增量：`look forward to` 是一整个块）**
- **判据（一句话）**：`说「盼着那一天」：look forward to 是一整个块——前面加 am／is／are，盼的那个词穿 -ing，后面跟要等的那件事。`
- **本课唯一增量**：**「三个字一起记」**（不是 `look` ＋ `forward` 两个词，是一个块）。**本课不碰名字版侧**（`to` 后面先给名词 `the weekend`）。
- **`contrast` 六条（3 条带 `wrongMark`）**：① ❌ `I am look forward to the weekend.`（`wrongMark: "look"`，verb_form，「盼的那个词要穿 -ing」）**diffScore 86**；② ❌ `I looking forward to the weekend.`（`wrongMark: "looking"`，missing_be，「`am` 不能丢」）**86**；③ ❌ `I am looking forward to weekend.`（`wrongMark: "weekend"`，article）**86**；④ ✅ 双正解 `She looks forward to the weekend.` 并排 `I am looking forward to the weekend.`（**diffScore 57 < 90 ✅**，「前面换个人，后面的块不动」）；⑤ ✅ 双正解 `I am used to the cold.` 并排目标句（**57 ✅**，「第 119 课那块也是同一个 to——今天这块跟它长得像，但说的是盼、不是习惯」）；⑥ ✅ 双正解 `It looks nice.` 并排目标句（**0 ✅**，批十九回望：「第 125 课的眼睛只看样子，今天这块不是看」）。**（三条错卡的 86 只是登记值，不设闸门——`<90` 闸门只约束双正解卡，见 L135 ① 的订正说明。）**
- **`guided`（6 步，含 1 道 `spot`）**：`choose`（`I ___ looking forward to the weekend.` 选项 `am`／`is`／`are`，答案 `am`）→ `arrange`（目标句）→ `arrange`（复现 L133 `:24969` 原句）→ **`spot`**（`tokens: ["She","am","looking","forward","to","the","weekend."]`，`wrongToken: "am"`（**逐字相等、无尾标点**），`correctionZh` 给 `is`）→ `arrange`（复现 L87 `It's nice to see you.`）→ `replace`（把 `I am` 换成 `She`，答案 `She is looking…`）。
- **`variants`**：肯定＝`I am looking forward to the weekend.`（**复练 cloze 实跑落 `am`——登记为「假友好」**）／否定＝`I am not looking forward to the weekend.`／疑问＝`Are you looking forward to the weekend?`。
- **`practice` ≥4，含 1 道变体题**：目标句 ／ **疑问变体 `Are you looking forward to the weekend?`（＝`variants` 疑问逐字，满足守门断言）** ／ 复现 L133 `:24969` 种子位原句（**此课是种子位转正，可以直接进练习**）／ **`We look forward to the weekend.`（前面是「我们」，cloze 友好形态——登记为第二保障位）**。

**L135 · 换人换形（增量：前面的词换人，整块跟着变）— cloze 保障课**
- **判据**：`说「她盼着那个夏天」：前面换个人，后面那个词也跟着换——她配带 s 的 looks（She looks forward to the summer）。`
- **本课唯一增量**：**`I am looking` → `She looks` 是「两个词变一个词」**（`-ing` 收回去、`s` 长出来），**后面的 `forward to the summer` 一字不动**。**这是 L126「换人换形」的同一条老规矩落到新块上**。
- **`contrast` 六条**：① ❌ `She look forward to the summer.`（`wrongMark: "look"`，sv_agreement，`diffScore` **92**）——**⚠️ 实读订正（本轮）**：`diffScore ≥ 90 就丢弃` 这条硬线**只适用于 `bothRight: true` 的双正解卡**（实读 `grammarBoostService.ts:748-752`：`if (!contrast.bothRight) return;` 在**前**、`if (similarity >= 90) return;` 在**后**）——**错卡（带 `wrongMark`）不走这条闸门**，故 92 **不构成出局**（错卡不在 `bothright` 候选池，不进练习派生）；**本节的 `<90` 标注一律只针对双正解卡**。② ❌ `She looks forward to summer.`（`wrongMark: "summer"`，article，**83**）③ ❌ `She looks forward for the summer.`（`wrongMark: "for"`，preposition，「块里的第三个字是 `to`，不是 `for`」）**83**；④ ✅ **双正解** `I am looking forward to the weekend.` 并排 `She looks forward to the summer.`（**43 < 90 ✅**，「换个说法，块还是同一个块」）⑤ ✅ **双正解** `We are looking forward to the weekend.` 并排（**71 ✅**）⑥ ✅ **双正解** `She looks tired.` 并排（**33 ✅**，批十九 `look + 什么样` 切开：`looks tired` 后面跟「什么样」、`looks forward to` 后面跟「要等的事」）。**（3 带 `wrongMark` ＋ 3 双正解，符合硬纪律；原第 ⑥ 条 `It looks nice.`（17）已让位给 ③——同一条切开在 L134 ⑥ 已做过一次，不必重复。）**
- **`variants`（**本课的保障位，逐字写死**）**：肯定＝`She looks forward to the summer.`（**复练 cloze 实跑落 `looks` ✅**）；否定＝`She is not looking forward to the summer.`（**5 词 → 7 词，≤8 ✅**）；疑问＝`Is she looking forward to the summer?`。
- **`practice`（≥4，含 1 道变体题）**：目标句 ／ **疑问变体 `Is she looking forward to the summer?`（＝`variants` 疑问逐字）** ／ `I am looking forward to the weekend.`（复现 L134）／ **`We look forward to the weekend.`**（前面是「我们」，cloze 友好）／ 复现 L126 `You look tired.`。
- **`guided`（6 步，含 1 道 `spot`）**：`choose`（`She ___ forward to the summer.` 选项 `look`／`looks`／`looking`，答案 `looks`）→ `arrange`（目标句）→ `arrange`（复现 L134 原句）→ **`spot`**（`She looks forward to summer.`，`wrongToken: "summer."`）→ `arrange`（复现 L126 `She looks tired.`）→ `replace`（把 `She` 换成 `We`，答案 `We look forward to the summer.`）。

**L136 · 盼的是做某事（增量：后面那件事穿名字版）**
- **判据**：`盼的是「做某事」的时候，那件事要穿上名字版：I am looking forward to seeing you——这条规矩你在第 120 课学过，今天换一件事。`
- **本课唯一增量**：**`to` 后面从「东西」变成「一件事」**。**⚠️ 生产红线：本课不得重用批十八的「前面站谁它听谁的」话术**——只做一次点名（`第 120 课那条规矩，今天换一件事`），**不得重讲**。
- **`contrast` 六条**：① ❌ `I am looking forward to see you.`（`wrongMark: "see"`，verb_form）**86**；② ❌ `I am looking forward seeing you.`（`wrongMark: "seeing"`，preposition——「`to` 不能丢」，**86**）——**✅ `wrongMark` 取值依据（实读先例）**：L120 `:22472-22474` 的「`to` 丢了」错卡为 `wrong: "I am used getting up early."` ＋ `wrongMark: "getting"` ＋ `correct: "…used to getting…"`——**`wrongMark` 标的不是丢掉的那个字，而是丢掉位置后面紧邻的那个词**；本条照此标 `"seeing"`。**⚠️ 备选形状（不推荐）**：`I am looking forward to you.` 会把 `to` 后面变成「人」、罪名落 `fragment`，但 **`fragment` 在批十五–二十各案刚用过（避让）**，故本条取「`to` 丢了」形状。**说明：错卡（带 `wrongMark`）不参与 `bothright` 派生，故 92／86 一类高相似值不触发任何闸门（见 L135 ① 订正）。**；③ ❌ `I looking forward to seeing you.`（`wrongMark: "looking"`，missing_be，「`am` 不能丢」）**86**；④ ✅ 双正解 `I am used to getting up early.` 并排（**38 ✅**，**「同族」的正面接口——两块 to、同一条名字版规矩**）；⑤ ✅ 双正解 `It's nice to see you.` 并排（**0 ✅**，L87：`see` 的既有句，**「认得的字，今天穿上名字版」**）；⑥ ✅ 双正解 `I am looking forward to the weekend.` 并排（**71 ✅**，L134 回望：一个跟东西、一个跟做的事）。**（3 带 `wrongMark` ＋ 3 双正解；原第 ③ 条 `I like reading.`（14）已让位给 ③ 的 missing_be 卡——`I like reading.` 已在 3 课 `practice` 里出现过，属高复现句，本批不再占对比卡位。）**
- **`variants`**：肯定＝`I am looking forward to seeing you.`（**cloze 实跑落 `am`——假友好，登记**）／否定＝`I am not looking forward to seeing you.`／**疑问＝`Are you looking forward to seeing me?`（换 `me` 才通——`seeing you` 里说的是「你」——问句必须换成 `me`，否则变成「你盼着见到你自己」）**。**⚠️ 生产期红线**：本课疑问变体**必须把 `you` 改成 `me`**，且该句与目标句的 `diffScore` 实跑 **57 < 90 ✅**（若做双正解卡可用）；**本课 `practice` 的变体题取此句逐字**。
- **`practice`（≥4，含 1 道变体题）**：目标句 ／ **疑问变体 `Are you looking forward to seeing me?`（＝`variants` 疑问逐字）** ／ 复现 L42 `I like reading.` ／ 复现 L120 `I am used to getting up early.` ／ `She is looking forward to seeing you.`。
- **`guided`（6 步，含 1 道 `spot`）**：`choose`（`I am looking forward to ___ you.` 选项 `see`／`seeing`／`saw`，答案 `seeing`）→ `arrange`（目标句）→ `arrange`（复现 L120 `I am used to getting up early.`）→ **`spot`**（`I am looking forward to see you.`，`wrongToken: "see"`）→ `arrange`（复现 L42 `I like reading.`）→ `replace`（把 `seeing you` 换成 `the weekend`，答案 `I am looking forward to the weekend.`）。

**L137 · 说不和问（增量：问句是 `Are` 搬家、不是请 `Do` 帮手）**
- **判据**：`说「不盼」：not 站在 am／is／are 后面——I am not looking forward to it。想问别人：把 Are 搬到句首——Are you looking forward to it?（这块自己带着 be，不用请 Do 来帮忙）。`
- **本课唯一增量**：**`be` 在的句子问句自己搬**（与批二十 L132 `Does it sound good?` 的「请帮手」正面切开——**这是本批与批二十最重要的接口**）。
- **`contrast` 六条**：① ❌ `I not looking forward to it.`（`wrongMark: "not"`，missing_be）**86**；② ❌ `Do you looking forward to it?`（`wrongMark: "Do"`，verb_form）**（实测需重跑；同类形状 86，错卡不设闸门）**；③ ❌ `You looking forward to it?`（`wrongMark: "You"`，missing_be，「想问别人，`Are` 要站到句首——`You looking` 少了那个搬家的 `Are`」）**83**；④ ✅ 双正解 `I am looking forward to it.` 并排 `I am not looking forward to it.`（**86 < 90 ✅**——**压线，生产期须逐字实跑复核**）；⑤ ✅ 双正解 `Are you looking forward to it?` 并排 `I am looking forward to it.`（**71 ✅**）；⑥ ✅ **跨批切开卡** `Does it sound good?` 并排 `Are you looking forward to it?`（**0 ✅**，whyZh：「两句都是问句，问法不一样——第 132 课那块自己没有 be，要请 Does 来帮忙；今天这块自己带着 are，它自己搬句首就够了」）。**（3 带 `wrongMark` ＋ 3 双正解；原第 ⑤ 条 `She looks forward to the summer.`（29）已让位给 ③——L135 正课已用它，不必再占一卡。）**
- **`variants`**：肯定＝`I am looking forward to it.`（落 `am`，登记为**假友好**）／否定＝`I am not looking forward to it.`／疑问＝`Are you looking forward to it?`（落 `Are`）。
- **`practice`（≥4，含 1 道变体题）**：目标句（疑问）／ **否定句 `I am not looking forward to it.`（＝`variants` 否定逐字）** ／ 复现 L123 `I am not used to it.` ／ 复现 L132 `Does it sound good?`（**切开对照题，不重复**）／ 目标肯定句。
- **`guided`（6 步，含 1 道 `spot`）**：`choose`（`___ you looking forward to it?` 选项 `Are`／`Do`／`Is`，答案 `Are`）→ `arrange`（目标句）→ `arrange`（复现 L123 `I am not used to it.`）→ **`spot`**（`Do you looking forward to it?`，`wrongToken: "Do"`）→ `arrange`（复现 L132 `Does it sound good?`）→ `replace`（把 `You are` 换成 `She is`，答案 `Is she looking forward to it?`）。

**L138 · 零新知收口 ＋ 两处切开（L134–L137 四句排一行）**
- **判据（零新知）**：`这四句排一行：盼着那一天（I am looking forward to the weekend.）／她盼着那个夏天（She looks forward to the summer.）／盼着见到你（I am looking forward to seeing you.）／问一句（Are you looking forward to it?）——一个块、四张脸。`
- **本课唯一增量 ＝ 零**（照 L124／L133 先例）。**承担两处切开**：① **同一个 `look` 的第三张脸**（`Look at the clouds!` 跟「去哪儿看」／`The sky looks dark.` 跟「什么样」／**`I am looking forward to the weekend.` 跟「要等的那件事」**）——**逐字抄 L127 `:23800` 的句式**；② **同一个 `to` 的第二站**（`be used to` 跟「习惯了的那件事」／`look forward to` 跟「盼着的那件事」）——**逐字抄 L122 `:22851` 的句式**。
- **`contrast` 六条（3 带 `wrongMark` ＋ 3 双正解，逐条实跑）**：① ❌ `I am look forward to the weekend.`（`wrongMark: "look"`，verb_form，**86**）——**锚 #143①**；② ❌ `She looks forward to summer.`（`wrongMark: "summer"`，article，**83**）——**锚 #144②**；③ ❌ `You are looking forward to it?`（`wrongMark: "You"`，word_order，**71**）——**锚 #146② 的对偶（问句忘了搬 `Are`）**；④ ✅ **双正解** `She looks forward to the summer.` 并排 `I am looking forward to the weekend.`（**43 < 90 ✅**，`I am looking` ↔ `She looks` 是一张脸的两件外套）；⑤ ✅ **切开卡（同一个 `look` 的三张脸）** `The sky looks dark.` ✅ 并排 `I am looking forward to the weekend.` ✅（**diffScore 0 < 90 ✅**，whyZh 抄 L127 `:23800`：「喊人去看是 Look at the clouds!（跟『去哪儿看』）；说看着什么样是 The sky looks dark.（跟『什么样』）；盼着那一天是 I am looking forward to the weekend.（跟『要等的那件事』）——后面跟的东西不一样，说的就不是一件事」）；⑥ ✅ **切开卡（同一个 `to` 的第二站）** `I am used to getting up early.` 并排 `I am looking forward to seeing you.`（**38 ✅**，whyZh 抄 L122 `:22851`：「两块 `to` 是同一条规矩——后面那件事都穿名字版；一个说你习惯了的那件事，一个说你盼着的那件事」）。**⚠️ 生产红线（两条）**：**a）第 ⑤ 条的「另一方」取 `The sky looks dark.`（L127 正课句，`:23802`），不取 `It looks like rain.`**——后者是 L127 的认读句，用它会与「种子位只认读」口径混淆；**b）本批引用 L127 的两句时，只可作文案引用（`contrast`／`deepDive`），不得进 `practice`／`guided`／`recall`，不得作错项**。**五句同屏上限**照批二十口径（本课 `contrast` 涉及 6 句，但只有四句属于本族＋两句引用句，未触及上限纪律）。
- **`variants`（四句排一行，零新知）**：肯定＝`I am looking forward to the weekend.`／否定＝`I am not looking forward to it.`／疑问＝`Are you looking forward to it?`。
- **`practice`（≥4，含 1 道变体题；四句各复现一次）**：`I am looking forward to the weekend.`（L134）／`She looks forward to the summer.`（L135）／`I am looking forward to seeing you.`（L136）／**`Are you looking forward to it?`（L137，＝变体题）**／`I am not looking forward to it.`（否定变体）。
- **`guided`（6 步，含 1 道 `spot`）**：`choose`（`She ___ forward to the summer.`，答案 `looks`）→ `arrange`（L134 句）→ `arrange`（L136 句）→ **`spot`**（`You are looking forward to it?`，`wrongToken: "You"`）→ `arrange`（L135 句）→ `replace`（把 `I am looking` 换成 `She looks`）。
- **`examples` 第 4 条**：**放 L133 `:24969` 种子位原句**（`I am looking forward to the weekend.`）——**这次是「转正」：种子位从 L133 的「认读」升级为 L138 的正式内容**。

---

### 4.2 五案的逐案设计（#143–#147，生产单可直接抄）

**通用硬约束（逐案自查）**：`errors.length = 4`；`tokens.length > errors.length`（≥1 个干净诱饵块）；每个 `tokenIndex` 与 `tokens[tokenIndex]` 对位（`huntService.test.ts:311-322` 守门）；`original` 拆词后必含该 token 的净词形（守门同上）；`correction ≠ original`；`reviewed: true`（`:293-309` 守门）；罪名全取自 10 枚举（**`comparison` 不进案件**）。

| 案 | id ／ 标题 | 场景 | tokens（4 句，`tokenIndex` 已逐位实算） | 4 个错（tokenIndex → 罪名 → 修正） |
|---|---|---|---|---|
| **#143** | `hunt-looking-forward-weekend` ／「日历上的那一格」 | 书桌边压着的一张周末计划条 | `I`(0) `am`(1) `look`(2) `forward`(3) `to`(4) `the`(5) `weekend.`(6) ／ `I`(7) `looking`(8) `forward`(9) `to`(10) `the`(11) `weekend.`(12) ／ `Yesterday`(13) `I`(14) `go`(15) `home.`(16) ／ `They`(17) `was`(18) `happy.`(19)　**n=20** | ① idx **2** `look`→**`looking`**（**verb_form**，新）② idx **8** `looking`→**`am looking`**（**missing_be**，新）③ idx **15** `go`→`went`（tense，**L10 回流**）④ idx **18** `was`→`were`（sv_agreement，**L19 回流**） |
| **#144** | `hunt-she-looks-forward-summer` ／「暑假的日历」 | 教室后墙贴着的暑假倒计时纸 | `She`(0) `look`(1) `forward`(2) `to`(3) `the`(4) `summer.`(5) ／ `She`(6) `looks`(7) `forward`(8) `to`(9) `summer.`(10) ／ `We`(11) `have`(12) `two`(13) `sandwich.`(14) ／ `He`(15) `play`(16) `football.`(17)　**n=18** | ① idx **1** `look`→**`looks`**（**sv_agreement**，新）② idx **10** `summer.`→**`the summer.`**（**article**，新；与 #128 `cold→the cold` 同型）③ idx **14** `sandwich.`→`sandwiches.`（plural，**L11 回流**）④ idx **16** `play`→`plays`（sv_agreement，**L25 回流**——**与 ① 同罪名、不同形状：一个是「换形」一个是「加 s」，生产期不得合并成一条**） |
| **#145** | `hunt-forward-to-seeing-you` ／「车站的留言条」 | 车站长椅上落着的一张便条 | `I`(0) `am`(1) `looking`(2) `forward`(3) `to`(4) `see`(5) `you.`(6) ／ `I`(7) `am`(8) `looking`(9) `forward`(10) `seeing`(11) `you.`(12) ／ `Yesterday`(13) `I`(14) `eat`(15) `noodles.`(16) ／ `We`(17) `have`(18) `two`(19) `egg.`(20)　**n=21** | ① idx **5** `see`→**`seeing`**（**verb_form**，新）② idx **11** `seeing`→**`to seeing`**（**preposition**，新；与 #129 ② `getting→to getting` 同型）③ idx **15** `eat`→`ate`（tense，**L10 回流**）④ idx **20** `egg.`→`eggs.`（plural，**L11 回流**） |
| **#146** | `hunt-are-you-looking-forward` ／「课间那一问」 | 课桌角上贴着的运动会报名条 | `I`(0) `not`(1) `looking`(2) `forward`(3) `to`(4) `it.`(5) ／ `Do`(6) `you`(7) `looking`(8) `forward`(9) `to`(10) `it?`(11) ／ `They`(12) `was`(13) `happy.`(14) ／ `She`(15) `drink`(16) `milk.`(17)　**n=18** | ① idx **1** `not`→**`am not`**（**missing_be**，新；与 #132 ① `don't→am not` 同族但换词）② idx **6** `Do`→**`Are`**（**verb_form**，新——**与批二十 #141 ② `sounds→sound` 正面切开：一个是「请帮手＋退回原样」、一个是「不请帮手、自己搬句首」**）③ idx **13** `was`→`were`（sv_agreement，**L19 回流**）④ idx **16** `drink`→`drinks`（sv_agreement，**L25 回流**） |
| **#147** | `hunt-close-f21` ／「最后一页」（**id 用 `-f21` 避免与 L21 的 `hunt-close-*` 命名混淆**） | 本子最后一页，这一章的四行排在上面 | `I`(0) `am`(1) `look`(2) `forward`(3) `to`(4) `the`(5) `weekend.`(6) ／ `She`(7) `looks`(8) `forward`(9) `to`(10) `summer.`(11) ／ `I`(12) `am`(13) `looking`(14) `forward`(15) `to`(16) `see`(17) `you.`(18) ／ `You`(19) `are`(20) `looking`(21) `forward`(22) `to`(23) `it?`(24)　**n=25** | ① idx **2** `look`→`looking`（**verb_form**，锚 #143①）② idx **11** `summer.`→`the summer.`（**article**，锚 #144②）③ idx **17** `see`→`seeing`（**verb_form**，锚 #145①）④ idx **19** `You`→`去掉 You（Are 搬句首）`（**word_order**，锚 #146② 的对偶形态） |

**#147 的形状说明（对 L124／L133／L142 先例的沿用与一处偏离）**：沿用点＝**全回流、零新错型、四点各锚本批前一课**（与 #133 锚 #128–#131、#142 锚 #137–#140 完全同构）。**偏离点（必须写清楚）**：#142 的四点全在批内同型重复（`verb_form`×2＋`sv_agreement`×2＋`word_order`），**#147 我改用 `verb_form`×2 ＋ `article`×1 ＋ `word_order`×1**——**理由**：本批的 `article` 是「`the summer`」这一条**独立新错**（#144②），收口课若不回显，学生会把 `the` 当成 #144 的一次性细节；**代价**是四点里 `verb_form` 出现两次（形状不同：`look→looking` 与 `see→seeing`）。**若生产期坚持「四点不同罪名」，可把 ④ 换成 `We have two egg.`→`eggs.`（`plural`，锚 #145④）**——两案并列交由主理人裁。

**⚠️ 一条负迁移防线的案件位**：**#146 ②（`Do you looking` → `Are you looking`）是全批最重要的一道错**——它是批二十 L132「请 `Does` 帮忙」的正迁移**过度套用**的实测回收点；**建议把它放在 #146 的第 2 个 token 位（前有 `I not looking…` 垫场）**，不要放首位，避免学生一进门就被「`Do` 还是 `Are`」绊住。

---
### 4.3 旧错回流的「疲劳度」实算（本批必须避开前两批的老面孔）

**实读**：全库 **559 条错项**（10 罪名分布：`verb_form` 125／`plural` 98／`sv_agreement` 85／`preposition` 60／`tense` 47／`word_order` 47／`article` 28／`missing_be` 24／`run_on` 14／`fragment` 14）。**最高频的旧错对**（逐对实算）：

| 旧错对 | 全库次数 | **批十九＋二十末 30 条里的次数** | 本批建议 |
|---|---|---|---|
| **`tense`: `go`→`went`** | **18** | **4**（#137／#139／#141／#142） | **⚠️ 本批只用 2 次、且不得连续两课都用**——建议放在 #143（L10 回流）与 #145 之间隔一课 |
| **`sv_agreement`: `was`→`were`** | **17** | **3**（#138／#140／#142） | **⚠️ 同上**：本批用 2 次（#143／#146），**不得三课连用** |
| `preposition`: `on`→`in` | 14 | 0 | ✅ 可用（但本批已有两条新 `preposition`，建议不用） |
| `preposition`: `in`→`on` | 13 | 0 | ✅ 同上 |
| **`sv_agreement`: `drink`→`drinks`** | **7** | **2**（#138／#140） | **⚠️ 本批用 1 次（#146）**，且**必须与 L25 的其他动词换着来** |
| `plural`: `box`→`boxes` | 5 | **3**（#137／#141／#142） | **❌ 本批禁用**（连续三案同一名词，观感最差） |
| `plural`: `cup`→`cups` | 4 | **3**（#135／#139／#140） | **❌ 本批禁用**（同上） |
| `verb_form`: `to`→`去掉 to` | 13 | 0 | ⚠️ 与本批 #145② 同类，**建议本批不用**（已有 `to` 丢失型） |

**→ 本批的旧错回流池（经疲劳度过滤后的推荐，逐条取「已教点 + 近两批未用/少用」）**：

| 旧错（**左列 `tense`／`plural`／`sv_agreement` 是标签名，不是给用户看的话术**） | 回流源 | 形状（**用课程自己的说法**） | 近两批状态 | 本批用法 |
|---|---|---|---|---|
| `tense`：`go`→`went` | **L10 `:1767`** | 昨天版 | 4 次（热） | #143 ③ 用一次，**#145 改用 `eat`→`ate`（L10 同课、全库仅 1 次，实读）** |
| `tense`：`eat`→`ate` | **L10 `:1846`** | 昨天版（不规则） | **0 次（冷）** | **#145 ③ ✅ 推荐** |
| `plural`：`sandwich`→`sandwiches` | **L11 `:1949`** | 好几个（`-es` 尾） | 0 次（冷） | **#144 ③ ✅ 推荐**（L11 原句就是 `sandwich`） |
| `plural`：`egg`→`eggs` | L11 | 好几个（加 `-s`） | 0 次（冷） | **#145 ④ ✅ 推荐** |
| `sv_agreement`：`play`→`plays` | **L25 `:4513`** | 他/她/它加 `-s` | 0 次（冷） | **#144 ④ ✅ 推荐** |
| `sv_agreement`：`drink`→`drinks` | L25 | 他/她/它加 `-s` | 2 次（热） | #146 ④ 用一次（**本批仅此一次**） |
| `sv_agreement`：`was`→`were` | **L19 `:3415`** | was/were | 3 次（热） | #143 ④／#146 ③ 各一次（**本批仅此两次，不三连**） |

**结论**：**本批 5 案共 10 条旧错，经疲劳度过滤后的最终取法 = `go→went`×1＋`eat→ate`×1＋`sandwich→sandwiches`×1＋`egg→eggs`×1＋`play→plays`×1＋`drink→drinks`×1＋`was→were`×2（＋#147 两条回收）**——**主动放弃 `box`／`cup` 两个被批十九／二十连用三次的名词**，这是本批对「每批都 go→went」观感疲劳的正面回应（批十九研究报告 §1⑨ 已提出该问题，本轮给出量化依据）。

**⚠️ 一条修订（覆盖 §4.2 表格中的 #145 ③）**：**#145 ③ 由 `eat`→`ate` 承担（不是 `go`→`went`）**——以避免 `go→went` 在本批出现两次；**#143 ③ 保留 `go`→`went`**（L134 立岗课，学生的第一次回流用它最稳）。

---
## 5. 中文负迁移专项（逐课）

**方法说明**：库内与红线表**均无「盼」的既有教学内容**（`盼` 实读仅 2 处、全在 L133 种子位），故本节的 ❌ 句为**我按中文表达习惯 + 库内同类病灶形状归纳的推断**；每条后面的「**形状依据**」标注它在库内**确实有同型先例**（实读），以便生产期判断该条是否可信。

| 课 | 中文（用户想说的） | 学习者会造出的 ❌ | 病灶（中文思维） | 形状依据（实读） |
|---|---|---|---|---|
| **L134** | 我盼着周末 | **`I am look forward to the weekend.`** | **「盼着」是一个动词**——中文不需要给「盼」再套一个「正在」的外壳；英语的 `looking` 必须穿上 `-ing`（`be` ＋ `-ing` 是两个词挤在一起） | L121 `:22654`（`wrong: "I am get used to it."` ❌ → `getting`，错卡逐字原文）／#130 ① 同型；L87 `:16145`「两个词挤一挤」话术已在库 |
| **L134** | 我盼着周末 | **`I looking forward to the weekend.`** | **中文「盼着」本身就带「着」，学习者以为已经表达完成**——漏掉 `am` | L119 `:22272`（`wrong: "I used to the cold."` ❌ 漏 be，`missing_be`；`:22266` 是同课另一条 `I am used to cold.` 漏 `the`）／#128 同型 |
| **L135** | 她盼着那个夏天 | **`She look forward to the summer.`** | **中文「她盼」的「盼」不变形**——英语「她」配的 `look` 要长出一条 `s` | L126 `:23626`（`She look tired.` ❌）／#135 ① 同型；L25 老规矩 |
| **L135** | 她盼着那个夏天 | **`She looks forward to summer.`** | **中文「夏天」不需要冠词**——`the summer` 的 `the` 是中文没有的 | L119 `:22266`（`wrong: "I am used to cold."` ❌ → `the cold`，`article`）／#128 同型 |
| **L136** | 我盼着见到你 | **`I am looking forward to see you.`** | **中文「盼着见到你」的「见到」不带任何标记、原样放上去**——`to` 后面在学生的经验里（L15／L44／L46／L93）**四次都是穿原样** | **⚠️ 本批最重要的负迁移**：库内**四处绝对断言**——L15 `:2760`「`to` 后面的动词永远穿原样」／L44 `:8065`「垫板 to 后面永远穿原样：to buy」／L46 `:8443`「垫板 to 后面永远穿原样：to travel」／L93 `:17362`「`to` 后面永远穿原样」 |
| **L136** | 我盼着见到你 | **`I am looking forward to you.`**（把「见到」吞掉） | **中文「盼着见到你」可以省成「盼着你」**——动作在中文里可省、在英语里不能 | L120 `:22466`（`I am used to geting up early.`）／#129 ① `get→getting` 同型（**动作那块必须出现**） |
| **L137** | 你不盼着吗？ | **`Do you looking forward to it?`** | **中文问句靠「吗」和升调，不需要搬家**——学习者看到「问句」的第一反应是请 `Do` | **⚠️ 第二重要**：批二十 L132 `:24836` 刚教完「`Does` 来帮忙」（`Does it sound good?`），**`Do` 的惯性正处在峰值** |
| **L137** | 我不盼着 | **`I not looking forward to it.`** | **中文「不盼」的「不」直接贴在动词前**——英语的 `not` 要站在 `am` 后面 | L123 `:23103`（`I am not used to it. —— not 跟 be 走，不请帮手` 逐字原文）／#132 ①（`I don't used to it.` ❌ → `am not`）同型 |
| **L138** | （收口课，无新负迁移） | — | **本课零新知，不引入新负迁移**；只做两处切开（§4.1 L138） | — |

**三条防「教坏」的红线（写进生产单）**：

1. **全批不得出现「`to` 后面永远穿原样」的反向表述**——库内四处已教过的绝对断言（L15／L44／L46／L93）**不得在本批被推翻或嘲讽**。**正确写法**（实读 L120 `:22519` 的既有话术可抄）：**「有 `be` 站着的那块 `to`，它认名字版」**——即**把原句限定到「垫板 to」那一族，不否定老规矩**。
2. **L136 不得重讲批十八的「前面站谁它听谁的」**（实读 L122 `:22900`）——**只做一次点名**（「第 120 课那条规矩，今天换一件事」），**不重复论证**。
3. **全批禁止出现「介词」「不定式」「动名词」「非谓语」「宾语」**（`src/data/grammarZeroTerms.ts:16-25` 实读：「介词」「宾语」在 29 词表内；「不定式」「动名词」是批十八／十九的额外禁词）。**本章的核心增量恰恰就是「`to` 后面跟名字版」——这是全项目最容易写出这几个词的一批。**

**本批的自建话术（⚠️ 三个禁用词全部落在这一章的红线上，逐条给替代）**：

| 禁用词 | 为什么本批会写到它 | ❌ 不要这样写 | ✅ 改写成（自建，库内无先例、需新造） |
|---|---|---|---|
| **介词** | `look forward to` 的语言学描述就是「介词 to」 | `to 是介词，后面要跟动名词` | **`to` 是「块里的第三个字」——`look forward to` 三个字一起记，后面跟「要等的那件事」`** |
| **不定式** | 学生会问「为什么不是 `to see`」 | `to 后面不能跟原形` | **`这块 to 后面不跟「做」，跟「做的事」——做的事要穿上名字版（seeing）`** |
| **动名词** | 名字版的学名 | `seeing 是动名词` | **`穿上名字版`**（库内 **202 处**既有话术，L120 `:22519` 原文） |
| **宾语** | 说「`to` 后面跟宾语」 | `to 后面跟宾语` | **`后面跟的那件事`／`要等的那件事`** |

**⚠️ 一条说明**：本节表格中出现的「介词」「不定式」「动名词」「宾语」**仅用于「禁止怎么写」的对照列**，**不是可写话术**——生产期**全字段（含 `deepDive`）不得出现这四个词**。

**⚠️ 本批新造话术的登记**（库内 0 处，属新资产，须在生产单上标注）：**「块」**（`look forward to` 是一整个块）／**「盼」**（库内仅 2 处、都在种子位）。**「门牌」二字本批不用**（L67 `:12363` 已把 `at` 叫作门牌，本批再用会「两套门牌串台」——批二十路线图 §6.2 序 3 已警告）。

---

## 6. 体验建议

### ① 场景锚（零术语、零生词，逐课）

- **L134（认整块）**：`mansion` 书桌，墙上挂着日历，小美指着周末那一格——`I am looking forward to the weekend.`
- **L135（换人换形）**：`sparkle` 窗外，同学说起暑假——她盼着那个夏天——`She looks forward to the summer.`
- **L136（名字版）**：`city` 车站／校门口，好朋友要来了——`I am looking forward to seeing you.`
- **L137（否疑）**：`campus` 课间，同学问「你盼着运动会吗」——`Are you looking forward to it?`
- **L138（收口）**：`mansion` 本子最后一页，四句排一行。

**一条提醒**：**`trip` 真词次 GL 0／`holiday` 双 0——全批禁用**（§1-④）；**「盼着放假」这个中文高频场景在库内没有名词可用**，**不要写 `the holiday`／`the trip`**；**统一用 `the weekend`／`the summer`／`the party`／`my birthday`／`it` 五个库内词**。

### ② 零术语话术（三条，可直接抄）

- **立岗句（L134）**：`说「盼着那一天」：look forward to 是一整个块——前面加 am／is／are，盼的那个词穿 -ing，后面跟要等的那件事。`
- **复用句（L136，抄 L120 `:22519` 的骨架、只换一个词）**：`盼着「做某事」：后面那件事穿名字版（I am looking forward to seeing you）——有 am 站着的那块 to，它认名字版。（这条规矩你在第 120 课学过，今天换一件事。）`
- **切开句（L138，抄 L127 `:23800` 的句式）**：`同一个 look，三张脸：喊人去看是 Look at the clouds!（后面跟「去哪儿看」）；说看着什么样是 The sky looks dark.（后面跟「什么样」）；盼着那一天是 I am looking forward to the weekend.（后面跟「要等的那件事」）——后面跟的东西不一样，说的就不是一件事。`

### ③ 与批十八／批十九的切开设计（三处，缺一不可）

| # | 切谁 | 切法 | 载体 |
|---|---|---|---|
| ① | **与批十九 L127「同一个 look 两张脸」** | **升级为「三张脸」**——`Look at …`（跟「去哪儿看」）／`looks + 什么样`／**`looking forward to`（跟「要等的事」）**。**关键话术：`look forward to` 根本不是「看」** | **L138 `contrast` ⑥＋`deepDive`** |
| ② | **与批十八 `be used to`「同族第二站」** | **同一块 `to`、同一条名字版规矩、不同的前面**——`be used to` 跟「习惯了的事」／`look forward to` 跟「盼着的事」。**关键话术：`后面跟的东西不一样，说的就不是一件事`（同 ① 的句式，一次讲两个切开）** | **L136 `contrast` ④（`I am used to getting up early.` 并排）＋ L138** |
| ③ | **与批二十 L132 `Does it sound good?`** | **`be` 在不在，决定问句怎么造**——`be` 不在 → 请 `Does` 帮手（L132）；**`be` 在 → 自己搬句首**（L137） | **L137 `contrast` ⑥（跨批切开卡）** |

**⚠️ 一条观感红线**：**本批是 `look` 的第四个连续批次**（批十九 `look + 形容词` → 批二十 `look` 收口 → 本批 `look forward to`）。**必须在前三课就让学生看到「这不是看」**——**建议在 L134 的 `examples` 第 3 条直接放 `It looks nice.` 并标「（第 125 课——那是看，今天不是）」**，**不要等 L138 才切**。

### ④ cloze 保障句（**逐字写死，生产期不得改动**）

| 位置 | 句子 | 实跑 cloze 落点 | 保障级别 |
|---|---|---|---|
| **L135 `variants[0]`（肯定）** | **`She looks forward to the summer.`** | **`looks`**（考点词） | **★★★ 必保**（本族唯一能把空位压回考点词的形式） |
| L134 `practice` 第 4 题 | `We look forward to the weekend.` | `look`（考点词） | ★★（第二保障位） |
| L134 `variants[0]` | `I am looking forward to the weekend.` | `am`（**假友好，登记**） | — |
| L137 `variants[2]`（疑问） | `Are you looking forward to it?` | `Are`（边界，**登记**） | — |

**⚠️ 生产红线**：**L134 的 `practice` 与 `guided` 不得全靠 `I am looking forward to …` 形态**——因为该形态的复练 cloze 空位**永远落 `am`**，**考不到 `looking`／`forward`／`to`**；**每课必须至少有 1 道 `guided.spot`**（点错词，不走 cloze 通道）。

### ⑤ 时长与目标句

**五课目标句 7／6／7／6／7 词，全部 ≤8 词 ✅**。**每课学习时长目标与批十九／二十齐平（约 3–5 分钟）**；**L136 因「名字版」是复用而非新学，可略快（约 3–4 分钟）**；**L138 收口课因四句同屏 ＋ 两处切开，可略长（约 5–6 分钟）**。

### ⑥ 展示层（≈10 行，随批上线）

- `grammarSeasons.ts` 追加 **`season-21`**：`{ id: "season-21", label: "第二十一季 · 盼着那一天", hint: "盼着周末、盼着夏天、盼着见到你——look forward to 是一整个块，后面跟要等的那件事", min: 134, max: 138 }`。**⚠️ `min` 必须 > 133、`max` 必须 ≥ 138**（`grammarSeasons.test.ts` 的「互不重叠」与「最高课号被覆盖」两条断言会守门）。
- `GrammarPathPage.tsx` 的 `CAN_DO_MILESTONES` 追加 **`can-do-m23`**（`afterLesson: 138`）：`title: "我能说出我盼着的那一天"`；`zh: "盼着那一天（I am looking forward to the weekend）+ 换人换形（She looks forward to the summer）+ 盼着做某事（I am looking forward to seeing you）+ 说不和问（I am not looking forward to it／Are you looking forward to it?）——一个块、四张脸。"`；`samples: ["I am looking forward to the weekend.", "She looks forward to the summer.", "I am looking forward to seeing you."]`。**⚠️ 实读：`can-do-m*` 无任何守门测试（全仓引用数 0）——纯纪律项，漏加不会红，须人工核。**
- 批量：**138 课、147 案**。

**封面（本批自己算，§2.4 已穷举）**：**五张必须从 `cover17`–`cover21` 里取**（`cover1`–`cover16` 全禁——二用张，gap 仅 1–16）；**gap 最优解 `L134←cover17`…`L138←cover21`（五张 gap 全 = 117）**；**目视后建议按语义重排为 `L134←cover18`／`L135←cover17`／`L136←cover21`／`L137←cover20`／`L138←cover19`（同一组五张，min-gap 不变）**；**池外零新资产**。

---

## 7. 后续研究建议

1. **F21-B 与 F9-B–F20-B 的合并关账须一次读齐十三批**——本批是 B 档系列收官批，**建议在关账读数表里单列一行「B 档系列总账」**：批十八（升格·0 造词）／批十九（升格·0 造词）／批二十（造词·3 动词）／**批二十一（造词·2 词）**四批的**首过率、完成率、误答回流率**三线并读——**这是本项目第一次能回答「造词课 vs 升格课的成本差」**（批二十路线图 §6.1 已把它列为观察项）。
2. **本批新增三个观察项**：① **`look` 第四次连续批次的「看腻率」**（走查问「`look forward to` 是不是又是看」，**正确反应是「不是看，是盼」**）；② **`I am looking forward to …` 的 cloze 空位被察觉率**（若学生反映「怎么老是抽 am」，则 L134 的考点承载须整体挪到 `spot`）；③ **`Do you looking …` 的选择率**（＝#146 ② 的选错率，**与批二十 L132 的 `Does` 正迁移做对照**——**这是本批与批二十最重要的接口读数**）。
3. **`seem`／`appear` 的词架盘点须在批二十二开工前完成**——**B 档序列在本批交付后见底**（`have sth done` C 档撤出、形容词＋介词 B- 折卡、机制强化不做、`seem`／`appear` D 档），**批二十二的候补清单必须由新一轮选题研究产生，不能沿用本批的清单**。**这是「收官批」最实际的后续动作。**
4. **形容词＋介词的折卡在批二十二可做**（本批没做——六课 `contrast` 已被切开位占满）——**若做，必须与本章的 `to` 话术显式分工**（借 L67 `:12363` 的「门牌」话术；**本章不用「门牌」，两套不撞**）。
5. **L133 种子位的转正已在本批兑现（L138 `examples`）**——**建议下一批研究复核「种子位 → 正课」这条路径的实际效果**（学生是否在 L133 记住了那张脸、到 L138 时是否有「见过」的熟悉感）；**这是本项目第一次走完「种子位 → 转正」的完整闭环**（上一例是 L14 → L59 的 `well`／`fast`，实读 `:10833`「L14 认读种子转正」）。

---

> 本研究报告由产品战略团队瑞思执笔，经主理人汇编落盘。重要决策请由产品负责人审定。
