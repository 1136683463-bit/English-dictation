# 用户研究综合报告 · 第二十二批（让步与转折 · 3 课）
**日期**：2026-09-20 ｜ **类型**：用户研究（批二十二选题）｜ **成员**：瑞思
**方法**：
- **实读**（状态机提取，非 grep 裸匹配）：`src/data/grammarLessons.ts`（**26,108 行／138 课／L1–L138**）与 `src/data/huntCases.ts`（**8,181 行／147 案／#1–#147**）。**提取器口径**：逐行剥离 `//` 行注释与 `/* */` 块注释后，只取**双引号内的串**（转义与续行按 JS 字面量解析），再按 `^\s{4}number: N,$` 切课／切案边界；**每个词计数均带行号映射**。**这一步是本批「零缺口」判定的可信度来源**——批十七／十八／二十的若干旧计数（如 `both` raw 221）就是被字段名 `bothRight`／注释文本污染的。
- **对照复算**：任务书给的 10 个「零缺口」词逐个复跑（§1.1）；同时把 5 个「已有厚度」词一并复算，**发现口径差并逐条记录**（§1.1 末段：`too`／`enough`／`what about`／`look forward to` 四个口语径与任务书所给数不同，均已注明复算口径）。
- **上游实读**（本机原件／缓存）：Murphy **Intermediate 4th** TOC（`/tmp/murphy_int.pdf`，425 单元）与 **Essential 4th** TOC（`/tmp/murphy_ess.pdf`，115 单元）逐单元抽出；BC 三档索引本机存档（`/tmp/bc-a1a2-new.html`／`bc-b1b2-new.html`／`bc_c1_live.html`）；Cambridge 缓存页与 english.cool 站点地图（`/tmp/ec_all.txt`）。**本轮上游只用于给档位，不用于推翻我方实读**。
- **测试基线**：`npx vitest run` → **61 文件 / 799 项全绿**（Duration 7.39s，与批二十一记录一致，**零漂移**）。
- **形态验证**：独立复刻 `grammarAmbushService.ts:195-213` 的 `pickClozeWord` 三级回退（含 `:160-187` 的 `GRAMMAR_WORDS` 与 `:190-193` 的 `CLOZE_STOP_WORDS` 逐字表）跑候选句；独立复算 `grammarLessons.test.ts:163-178` 的「同一句最多出现在 6 课」红线头寸。

> **标注约定**：**〔实读〕**＝本轮亲自跑出的数或逐字抄下的行；**〔推断〕**＝我方对数据或上游的解释；**〔未核实〕**＝上游未取到原文、只能转述。

---

## 0. 结论先行

**本批是 B 档系列结清后的第一个新选题**——批二十一路线图 §6.2 原话：「候补池里已无 B 档及以上项目……批二十二的选题不能再沿用本清单，须由新一轮选题研究产生」。因此下面**不引用任何旧候补清单**，全部重新论证。

### 推荐方向

> **首选：开一条新的高价值结构线——「让步与转折」3 课（L139–L141），档位 = B 档〔实读〕。**
> **一句话**：`although/though`（虽然）是**跨源四层全有、课程位硬（BC B1-B2 第 6 课 `Contrasting ideas: 'although', 'despite' and others` ＋ Murphy 中级 U113 逐字 `although though even though in spite of despite`）、而我方两文件真零（`although` GL 0／HC 0；`though` GL 0／HC 2 且两处都在案 #7 的错句里）**的项；且**中文「虽然……但是……」的成对负迁移是全库唯一已被案件显式植错、却从未被任何一课教过的结构**（案 #7 `hunt-because-so` 第 2 处错＝`Though`＋`but` 并存，`correction: "去掉 but"`，而该案挂在 **L12**——**「先考后教」倒挂**，与批十七 `-ed/-ing` 形容词判进课的理由完全同型）。

**课量：3 课**（L139 立岗／L140 与 L19 `but` 切开／L141 零新知收口）。**不取 2 课**（切开位是本章唯一独立价值，且不切开就与 L19 `but` 撞车）；**不取 4 课**（第 4 课只能靠 `despite`／`in spite of` 换词——**它们是 `although` 的同义换挡，不是新结构**，且 `despite` 后跟名词的用法会把一课变两课）。

### 备选

| 序 | 方向 | 档位 | 一句话判读 |
|---|---|---|---|
| **备选 1** | **`as soon as` 3 课**（时间家族第六格） | **B 档〔实读〕** | 跨源四层全有（Cambridge `conjunctions-time` 把 `when/once/as soon as` 同一小节＋词典 `as soon as` 标 B1＋BC 参考层＋中文侧 `conjunctions` 专文并列成表），**我方 `as soon as` GL 0／HC 0**；**但我方已有 `when`/`after`/`before`/`until`/`while` 五格**，第六格的**语义差只有一刻度**（「当…的时候」对「一…就…」）——**这是本方向唯一的硬伤**，也是竞析 §4.1 首选它的同一理由（见 §3 分歧说明） |
| **备选 2** | **`seem/appear` 3 课**（感官家族第六／七张脸） | **C 档〔实读〕** | 词典义项级 B1 有（`seem` B1／`appear` SEEM 义 B1），**但 BC 只有「表内落点」（`Stative verbs`）不是专课，Murphy 双册 TOC 零命中**；且**与 L125 `It looks nice.` 语义距离小**——我方五格已铺满，再加两张脸是**同族扩员而非开新线** |
| **备选 3** | **`neither/either/both` 2–3 课** | **B− 档〔实读〕** | 真零成立（三个词 GL＋HC 全 0，**且本轮确认 `both` 的旧计数 221 全是字段名 `bothRight`**）；**但造词成本 4 个（`both`＋`neither`＋`either`＋`nor`）超本项目先例上限**（批二十 3 个已是历史最高），且三连体实质只有两条轴 |
| **备选 4** | **`would rather` 2 课** | **B− 档〔实读〕** | 词典义项级 B1＋Cambridge 专页＋Murphy 中级 U59 逐字 `prefer and would rather`〔实读〕——**上游比备选 3 更硬**；**但「一班岗两条轴」天然只撑 2 课、无收口位**，且**中文侧零专文**（本站 `rather` 只命中 `rather-than`「而不是」义） |

### 明确不推荐

| 方向 | 判定 | 依据 |
|---|---|---|
| **方向 1「A 档复现型大章」** | **本批不做** | ① **上游四源无一家做「把已教结构重新编成新章」**（Murphy 用书末 Study guide ＋ Additional exercises，**不占正课单元号**；BC 只有课内嵌 Grammar test；我方另有 SM-2／关 2／关 3／趁热练四个复现装置）；② **我方 138 课的收口课已是这个形态**（§2 补充实读 15 课，最近三批 L124／L133／L138 全是「零新知·四句/五张脸/两站排一行」）——**再做纯复现章 = 重复已做过 15 次的事**；③ **「一课一增量」在纯复现课里没有落点**（§3 逐条）；④ **测试红线已接近上限**：`grammarLessons.test.ts:163-178` 要求**同一练习句最多出现在 6 课**，而 L138 的脊柱句 `I am used to getting up early.` 已用满 5 课、`It looks nice.` 已用满 5 课〔实读〕——**复现章每课 4 题都要从这些句子里挑，头寸只剩 1–4 次** |
| **方向 3「换轴（读写/听力）」** | **不做混合课** | BC 把 Listening／Reading／Writing／Speaking／Grammar／Vocabulary 做成**互不混合的六个栏目**；我方语法线与冒险阅读**耦合为零**（`grep -c grammar` 在 `AdventurePlayPage.tsx`／`adventureService.ts`／`AdventurePage.tsx` ＝ **0／0／0**〔实读〕）。**若做，只能把读写当「复现通道」而非「新结构」**——但这条通道我方已有关 2／关 3／趁热练三条，**边际收益最低** |
| **C 档 `have sth done`** | **维持不单开** | 口径零变化：BC 三档 68 课零课位／Murphy 仅中级 U46（跨级）／**我方词架本轮复算仍近零**（`haircut` 0／`repaired` 0／`fixed` 0／`checked` 0／`cut` 0／`had my` 0〔实读〕）。**新增一条本轮实读**：招牌名词侧其实**有现成的**（`cleaned` GL 126／`window` GL 164／`door` GL 139），**造词成本比批二十一记的「7 词全 0」低**——**但档位不变**：跨级 ＋ 「同一个 have」的对撞面**比「同一个 to」更硬**（`have X done` 的库内命中全是现在完成时） |

---

## 1. 关键发现（实读证据）

### 1.1 任务书给的 10 个「零缺口」词——逐词复核，**10/10 全部成立**

**方法〔实读〕**：状态机提取引号内串（跳注释），再按课／案边界归属。**计数单位＝引号串内的词次**。

| 词 | GL | HC | 复核结论 | 备注（本轮新获得的信息） |
|---|---|---|---|---|
| `seem` | **0** | **0** | ✅ 真零 | 含 `seems/seemed/seeming` 全 0；**`seem` 连注释里都没出现过** |
| `appear` | **0** | **0** | ✅ 真零 | 含 `appears/appeared/apparently` 全 0；`appear` 与 `seem` **同为零底座** |
| `would rather` | **0** | **0** | ✅ 真零 | 更严口径：**`rather` 单词本身 GL 0／HC 0**（不只是短语零） |
| `as soon as` | **0** | **0** | ✅ 真零 | 更严口径：**`soon` 单词本身 GL 0／HC 0**（`sooner` 亦 0） |
| `neither` | **0** | **0** | ✅ 真零 | — |
| `either` | **0** | **0** | ✅ 真零 | — |
| `both` | **0** | **0** | ✅ 真零 | **本轮复现了批十七的「假命中」**：裸 grep `both` 在 GL 得 **300 次**，**全部是字段名 `bothRight`**〔实读〕；引号串内 = 0 |
| `shall we` | **0** | **0** | ✅ 真零 | **`shall` 单词本身 GL 0／HC 0**（但 `shall` 在 `grammarAmbushService.ts:168` 的 `GRAMMAR_WORDS` 表内——**引擎词表比语料宽**） |
| `why not` | **0** | **0** | ✅ 真零 | — |
| `the same as` | **0** | **0** | ✅ 真零 | **`same` 单词本身有 2 处**：`They look the same!`（L112）与 `Are they the same?`（L138 `:25939`）——**但两处都不是 `the same as`**，是「一样不一样」的口语问法 |
| `will have` | **0** | **0** | ✅ 真零 | 更严口径：**真正的过去完成 `had + 过去分词` 也全 0**（`had been/done/gone/left/seen/...` 逐式复算无命中）；`I'd/he'd` 缩写 GL 0 |

**复核结论**：**10 个词全部真零，任务书的扫描可信**。**本轮唯一补正**：`both` 的「300」与 `same` 的「2」两处需要按字段／语义拆开看——**拆开后仍为零缺口**。

**顺带复核：任务书给的 5 个「已有厚度」词（这 5 个不是缺口，但口径须对齐）**

| 词 | 任务书给的数 | 本轮状态机复算（引号串内） | 裸 grep（含注释／代码／id） | 结论 |
|---|---|---|---|---|
| `too...to` | 62 | **56**（`too` 与 `to` 同串 40 字内） | **122**（`too` 独立词） | **口径不同，均非 62**——**任务书的数应为另一种正则口径〔推断〕** |
| `enough` | 79 | **89**（GL 79 ／ HC 10） | **80**（GL 单文件） | **`79` 恰等于 GL 单文件裸 grep**〔实读〕——**任务书的口径是「GL 单文件、含注释」，不含 HC** |
| `what about`／`how about` | 23 | **23**（`what about` 3 ＋ `how about` 20） | **24**（GL 单文件裸 grep） | ✅ **与任务书一致**（**批二十二竞析 §7 校正 5 已指出**：「23 是两串合计，`what about` 单独只有 3」——**本轮独立复算证实**） |
| `look forward to` | 226 | **23**（GL，引号串内；L134 5／L135 16／L137 1／L138 1） | **30**（全 `src/` 目录）／**619**（全 `deliverables/` 也计入） | **226 无法复现**——**本轮把范围放到 `src/`＋`deliverables/` 两处裸 grep 仍只有 619**〔实读〕；**建议不引 226** |
| `get sb to do` | 43 | **12**（严：`get [a-z]+ to [a-z]+`）／**97**（宽松：`get/gets/getting/got` ＋ 词 ＋ `to`） | 12（严，GL 单文件裸 grep） | **口径敏感，跨度 12–97**；**建议按「严口径 12」引用** |

> **⚠️ 一条方法学提醒（写进下一批的交接）**：本批的「零缺口」结论之所以可信，是因为**零在三种口径下都是零**（状态机引号串／裸 grep／含注释）——**而「厚度」数在三种口径下能差 3–10 倍**（`look forward to` 的 23 对 226）。→ **今后引用「已有厚度」时必须写明口径；引用「零缺口」时口径不敏感，可直接引**。

### 1.2 哪些是**成体系的缺口**，哪些是**散点**

**判据**：一个缺口成体系 ＝ ① 有**共同语义场**（能共享一个场景锚）；② 能撑**≥2 个真实增量**（不是换词）；③ 与库内已有结构**有显式接口**。

| 缺口 | 规模 | 语义场 | 增量数 | 体系性判定 |
|---|---|---|---|---|
| **让步家族**（`although`／`though`／`even though`／`despite`） | **GL 0／HC 2**（HC 2 处在案 #7 的**错句**里，见 §1.7） | ✅ 「虽然…但是…」——**单一语义场** | **3**（立岗／与 `but` 切开／收口） | ✅ **成体系，可成章** |
| **`as soon as`** | GL 0／HC 0 | ✅ 时间先后（与 `when/after/before/until/while` 同场） | **3**（立岗／与 `when` 切开／六格收口） | ✅ **成体系** |
| **`neither/either/both`** | GL 0／HC 0 | ⚠️ 「两者」——**可共享场景但只有两条轴** | **2 真 ＋ 1 收口** | ⚠️ **半成体系**（2–3 课，第 3 课须为收口） |
| **`would rather`** | GL 0／HC 0（含 `rather` 本身 0） | ✅ 「宁愿」 | **2**（本尊／否疑） | ⚠️ **2 课封顶、无收口位** |
| **`seem/appear`** | GL 0／HC 0 | ✅ 判断来源（与五感官同场） | **2–3** | ⚠️ **同族扩员，非新线** |
| **散点** | `shall we` 0／`why not` 0／`the same as` 0／`will have` 0 | ❌ **彼此无语义场** | 各 1 | ❌ **散点，不成体系**（本判定与批十七 §2 T8／批十八 §T7 一致，本轮复核维持） |

**四类真散点的共性〔推断〕**：它们都是**功能词／语用**项，**在「小美的一天」的单人日常视角里找不到共同场景锚**。批十七已就此判过「强凑即稀释一课一增量」，本轮复核**不推翻**。

### 1.3 重点评估一：`seem/appear`——**C 档，不成章（维持批二十一的「不排期」并补一条新理由）**

- **词架〔实读〕**：`seem` GL 0／HC 0；`appear` GL 0／HC 0。**两个词的本体是零底座**——须新造 2 个词。
- **上游〔实读／未核实〕**：Cambridge 词典 `seem` 条标 **B1**（`[+ to infinitive]`／`[+ (that)]`）；`appear` 的 **SEEM** 义标 B1。**但 BC 侧只有「表内落点」**——`Stative verbs`（B1-B2 第 30 课）把 `appear`／`seem` 与 `be/feel/hear/look/see/smell/taste` 并列在 senses and perceptions 表内，**这不是 `seem` 专课**；**Murphy 双册 TOC 逐单元抽出：`seem`／`appear` 零命中**〔实读，本机原件〕。
- **成章潜力判定：❌ 不成章**。三条理由：① **零课程位**（同批二十一口径）；② **与 L125 语义距离小**——`It looks nice.`（L125 `:23397`）与 `You seem tired.` 对学生是**同一句的中英直译对**，L139 极易变成 L125 的重播；③ **骨架完全同型**（`It ＋ 动词 ＋ 形容词`），**「一课一增量」只剩换词**（`looks`→`seems`），这正是批二十 L128–L131 已经用过四次的形态——**再用第五次是疲劳，不是增量**。
- **诚实标注**：**若动，档位是 C 档（缺课位＋需造词），不得写成 B 档**。

### 1.4 重点评估二：`would rather`——**B− 档，可成 2 课，但本批不首选**

- **词架〔实读〕**：`would rather` GL 0／HC 0；**`rather` 单词 GL 0／HC 0**；**`prefer` 亦 0**。→ 须新造 `rather` 1 个词（`would` 本身有 L62 `:11403` `would like` 的 74 处垫子）。
- **上游〔实读，本机原件〕**：**Murphy 中级 U59 标题逐字＝`59 prefer and would rather`**——**这是本轮从本机 PDF 原件逐单元抽出的**，位于 U53–U68 的 `-ing`／`to` 十六课连续块内（U59 在 U60 `Preposition + -ing` 之前）。**这是本项最硬的课程位证据**。Cambridge 另有 `would-rather-would-sooner` 专页〔未核实：本轮未直取，引自批二十二竞析〕。
- **成章潜力判定：⚠️ 2 课封顶**。① **「一班岗两条轴」**：同人轴（`I'd rather stay at home.`）＋换人轴（`I'd rather you stayed.`）——**第三条轴不存在**；② **无收口位**（2 课不够排一行）；③ **中文侧零专文**（本站 `rather` 只命中 `rather-than`「而不是」义，**与本项无关**）。
- **与批二十一路线图的关系**：路线图未列此项。**本轮把它从「散点」升到「B− 可成 2 课」**，理由＝**Murphy U59 逐字证据**（旧记录只记到 U59 存在，**未把它与 `would rather` 绑定过**）。
- **诚实标注**：**B− 档**（有课程位但容量只够 2 课、且中文侧无实证）。

### 1.5 重点评估三：`as soon as`——**B 档，3 课可行（本批备选 1）**

- **词架〔实读〕**：`as soon as` GL 0／HC 0；**`soon` 单词 GL 0／HC 0；`sooner` 0**。→ 须新造 `soon` **1 个词**。
- **是否构成时间家族第五名成员？→ 是，且接口最厚的一格**：
  - **家族现状〔实读〕**：`when` GL 286／`after` GL 180／`before` GL 90／`until` GL 70（L109 一门占 65）／`while` GL 95（L98 一门占 68）。→ **五格各有专属课**：L90 `after`／L91 `before`／L92 `when`（`:17105` oneLineRule 逐字「它跟 after/before 是同一个三人组」）／L98 `while`／L109 `until`（`:20301` label「等到…为止 · until + 小句子」）。
  - **接口**：L92 `:17105` 已把家族写成「三人组」，L109 已教「那道线一到就停」——**`as soon as` ＝ 把 L109 的「线」和 L92 的「一整句」合起来**，接口是现成的。
  - **上游〔实读，本机缓存〕**：Cambridge `conjunctions-time` 页（竞析已直取）把 `when`／`once`／`as soon as` 放在**同一小节**；词典 `as soon as` 标 **B1**（`soon` 本体是 A2）；BC 参考层 `verbs-time-clauses-if-clauses`；**中文侧 `conjunctions` 专文把 `as soon as` 与 `when/while/before/after/since/until` 并列成表**〔实读：`/tmp/ec_conjunctions.body.txt` 内 `as soon as 表示「一…就…」`＋例句〕。
- **硬伤（诚实标注）**：**第六格与第五格 `when` 的语义差只有一刻度**（「当…的时候」对「一…就…」）。**这不是否决项，但它是本章最大的观感风险**——化解办法是**把「切开」独立成一课**（L140），用**同一个开头、同一个后半句、只差两三个词**的并排形态呈现（照 L92 `contrast` 的 `bothRight` 形态）。
- **上游课程位**：**BC 零课程位**（B1-B2 36 课全目无 `as soon as`）；**Murphy 双册 TOC 零命中**〔实读：本机两册 PDF 逐单元抽出，`as soon as` 与 `soon as` 均 0〕。→ **档位 = B（有词典义项级 CEFR ＋ 参考层落点，但无课程位级专课）**。

### 1.6 重点评估四：`neither/either/both`——**「三连体·2 课可行」复核：成立，但比批十七记的更窄**

- **词架〔实读〕**：三个词 GL 0／HC 0。**但本轮实测造词成本更高**：`nor` 亦 0，且 `neither` 的 `sv_agreement` 考点要跟 `of them` 结构一起造——**实需 4 个新词（`both`／`neither`／`either`／`nor`）**，**超本项目先例上限**（批二十 3 个已是历史最高；批二十一 2 个）。
- **批十七判定**：数析 §1.6 判「`neither/either/both` 是三连体（可成章）……作为 2–3 课小章可行」。
- **本轮复核：仍成立，但「2 课可行」须加两条限定**：
  ① **三连体实质只有两条轴**——`both` ＝ 「两者都」；`neither/either` ＝ 「两者都不」对「二选一」。**`either` 与 `neither` 是同一轴的肯定/否定两面**（不是两个独立增量）。
  ② **造词成本 4 个已超上限**——**这一条是批十七未算的**（批十七只算「2 课可行」，未与批二十的 3 词成本结构对照）。
- **成章潜力判定：⚠️ 2–3 课，本批不首选**（成本结构劣于备选 1）。

### 1.7 **最重要的新发现：`although` 家族是「先考后教」倒挂**

这是本轮唯一一条**跨源四层全有 ＋ 课程位硬 ＋ 我方真零 ＋ 且已被案件植错却从未教过**的项。

**① 我方真零〔实读〕**：
- `although` **GL 0 ／ HC 0**
- `though` **GL 0 ／ HC 2**——**HC 的 2 处都在案 #7 `hunt-because-so` 的错句里**：`:343` token `"Though"` 与 `:366` 的 explanation 逐字「同样的道理：Though 和 but 不能同时出现，留一个就够。」
- `even though` 0／0；`despite` 0／0；`in spite of` 0／0；**`even` 单词本身 GL 0／HC 0**（**零底座**）

**② 「先考后教」倒挂的事实链〔实读〕**：
- 案 #7 `hunt-because-so`（`huntCases.ts:328`）**第 2 处错是 `Though`＋`but` 并存**，`tag: "run_on"`，`correction: "去掉 but"`。
- **该案挂在 L12**（`grammarLessons.ts:2307` `huntCaseIds: ["hunt-because-so", "hunt-word-order"]`）。
- **L12 是 `will 将来时`**（`:2129`），**L20 才是 `because/so`**（`:3596`，`:3612` oneLineRule 逐字「英语只用其中一个，不成对出现」）。
- → **学生在第 12 课就要判一道「虽然…但是…不能并存」的题，而这个结构全库 138 课没有一课教过。**
- **同型先例**：批十七把 `-ed/-ing` 形容词判进课的理由之一就是「**全库唯一的『先考后教』倒挂**」（该批竞析 §③ 逐字）。**本轮这条比它更硬**：`-ed/-ing` 倒挂是在**案件里出现同型错**，本项是**案件里直接植入了这个结构本身的错**。

**③ 库内已有「半个」接口〔实读〕**：
- **L19 `:3429` oneLineRule 逐字**：「把两个词或两句话连起来：一个方向用 and（又……又……），**反着来用 but（但是）**」。
- **L19 `:3493` deepDive 逐字**：「两边反着来，用 but：**cold but fun（虽然冷但好玩）**——but 前后在「唱反调」。」
- → **L19 的 deepDive 已经把「虽然」这个中文词写出来了，但只给了 `but` 这一条路**——**`although` 是同一个语义场的另一半，接口是现成的**。
- 另一处：L20 `:3629` contrast 逐字「中文「因为……所以……」成对出现，英语 because 和 so 只能来一个」——**`although` 与 `but` 的关系是同一条规矩的第二次应用**（都是「中文成对、英语二选一」）。

**④ 上游课程位最硬〔实读／未核实〕**：
- **BC B1-B2 第 6 课逐字＝`Contrasting ideas: 'although', 'despite' and others`**〔实读，本机存档 `/tmp/bc-b1b2-new.html` 逐条抽出〕——**这是 `although` 的课程位级专课**。
- **Murphy 中级 U113 逐字＝`113 although though even though in spite of despite`**〔实读，**本机原件 `/tmp/murphy_int.pdf` 逐单元抽出**〕——**一整个单元专讲让步**。
- **中文侧有专文**〔实读：站点地图 `/tmp/ec_all.txt` 内 `/although-despite/`、`/although/`、`/despite/`、`/even-though/` 四个 slug〕。

**⑤ 场景可行性〔实读〕**：`cold` GL 267（L87 一门 43）／`happy` GL 124／`tired` GL 155／`fun` GL 61／`snow` GL 17（L19 一门 10）／`rain` GL 103／`busy` GL 34／`late` GL 79／`hard` GL 2。→ **「虽然冷，但是我们很开心」这个句子所需的每一个零件都在库内**（**且 L19 有 `The snow is cold but fun.` 与 `It was windy, but we were happy.` 的现成底盘**）。

---

## 2. 主题分析表

> **频率×痛感**：频率＝中文侧该结构的日常使用频率；痛感＝学生出错时的「被看出来」程度与中文负迁移强度。**两项都是〔推断〕**，依据是上游明文与库内已有案件分布。

| 主题 | 缺口真实性／频率×痛感 | 证据（行号） | 判定 |
|---|---|---|---|
| **让步与转折（`although`／`though`）** | ✅ **真零 ＋ 频率高 × 痛感高** | `although` GL 0／HC 0；`though` GL 0／HC 2（`huntCases.ts:343`／`:366`，**在案 #7 错句内**）；案 #7 挂 L12（`grammarLessons.ts:2307`）而 L12 是 `will`（`:2129`）；L19 `:3429`／`:3493`；L20 `:3612`／`:3629`；BC B1-B2 第 6 课；Murphy 中级 U113 | ✅ **推荐·进课（章首）** |
| **`as soon as`** | ✅ 真零 ＋ 频率中高 × 痛感中 | `as soon as` GL 0／HC 0；`soon` 0／0；家族五格 L90 `:16712`／L91 `:16901`／L92 `:17090`（`:17105`）／L98 `:18227`／L109 `:20299`（`:20301`）；Cambridge `conjunctions-time`；中文侧 `ec_conjunctions`（`/tmp/ec_conjunctions.body.txt`） | ✅ **备选 1（B 档）** |
| **`seem/appear`** | ✅ 真零 ／ 频率中 × 痛感低 | `seem` 0／0；`appear` 0／0；与 L125 `:23397` 同骨架；BC `Stative verbs`（**表内非专课**）；Murphy 双册 TOC 零命中 | ❌ **不成章（C 档）** |
| **`would rather`** | ✅ 真零 ／ 频率中 × 痛感中 | `would rather` 0／0；**`rather` 单词 0／0**；`prefer` 0／0；Murphy 中级 U59 逐字；`would` 垫子在 L62 `:11403`（74 处） | ⚠️ **B−，2 课封顶** |
| **`neither/either/both`** | ✅ 真零 ／ 频率中 × 痛感中 | 三词 GL 0／HC 0；`nor` 0／0；**裸 grep `both` 的 300 次全是字段名 `bothRight`**〔实读〕 | ⚠️ **B−，成本超限** |
| **`shall we`／`why not`／`the same as`／`will have`** | ✅ 真零 ／ 频率低 × 无共同语义场 | 四词全 GL 0／HC 0；`same` 的 2 处（L112 `:20898`／L138 `:25939`）**都不是 `the same as`** | ❌ **散点，不进** |
| **纯复现型大章（方向 1）** | ❌ **不是缺口**（是形态） | 库内已有 **15 课**收口／合体课：L41 `:7463`／L46 `:8394`／L49 `:8954`／L54 `:9893`／L78 `:14432`／L86 `:15955`／L94 `:17470`／L102 `:18989`／L110 `:20488`／L117 `:21847`／L118 `:22043`／L124 `:23209`／L127 `:23787`／L133 `:24951`／L138 `:25917`；测试红线 `grammarLessons.test.ts:163-178` | ❌ **不做（理由见 §3）** |
| **换轴（读写／听力）** | ❌ **不是缺口**（是新工作流） | BC 六栏目分离；`grep -c grammar` ＝ 0／0／0（`AdventurePlayPage.tsx`／`adventureService.ts`／`AdventurePage.tsx`） | ❌ **不做混合课** |

### 补充实读：收口课先例（回答方向 1 的「会不会重复」）

**任务书点名 L124／L133／L138 三课，本轮全部逐字实读**：

| 课 | 行号 | title | grammarLabel | 形态 |
|---|---|---|---|---|
| L41 | `:7463` | 一句话说两件事 | 收口 · 两句话拼一句 | 结构合并 |
| L46 | `:8394` | 一句话，两种搭档 | 收口 · 名字版 + 小垫板 | 两族并排 |
| L49 | `:8954` | 你应该试试 | 收口 · 建议 + 条件 | 结构合并 |
| L54 | `:9893` | 谁上台 | 收口 · 谁重要谁上台 | 主动被动并排 |
| L78 | `:14432` | 一天的故事 | 收口 · **跨季大团圆（零新知）** | 跨季 |
| L86 | `:15955` | 失物招领处 | 收口 · **大团圆（零新知）** | 章末 |
| L94 | `:17470` | 校门口聊两句 | 收口 · **大团圆（零新知）** | 章末 |
| L102 | `:18989` | 昨天那个电话 | 收口 · **大团圆（零新知）** | 章末 |
| L110 | `:20488` | 谁让谁做什么 | 收口 · **四张脸排一行** | 章末 |
| L117 | `:21847` | 我一直想说的那些（合体） | **合体 · 四种说法排一行** | 章中 |
| L118 | `:22043` | 我一直想说的那些（收口） | 收口 · **零新知（六行排一行）** | 章末 |
| **L124** | **`:23209`** | **同一个 to，两张脸（收口）** | **收口 · 零新知（四句排一行）** | 章末 |
| **L133** | **`:24951`** | **五种感官排一行（收口）** | **收口 · 零新知（五张脸排一行）** | 章末 |
| **L138** | **`:25917`** | **同一个 to 的两站（收口）** | **收口 · 零新知（习惯了的 to vs 盼着的 to）** | 章末 |

**实读后的事实〔实读，逐课打开正文核对〕**：
1. **L124／L133／L138 三课全是「零新知」纯复现课**——每课的 `examples` 都是**前几课目标句的逐字回显**（L124 `:23224-23227` 四条分别标注「（第 122 课）／（第 119 课）／（第 120 课）／（第 121 课）」）。
2. **它们的 `guided` 里已带 `// R8 跨课复现：第 N 课` 注释**（如 L124 `:23319`、`:23336`）——**跨课复现是我方每课就有的常规动作，不是一章才做一次的事**。
3. **它们的 `practice` 已经把本章句子用满**（L138 `:26062-26096` 五题＝L120／L137／L134／L135／L136 各一）。
4. **它们与「复现型大章」的区别只有一个**：**收口课是 1 课、附在章末；复现型大章是 3+ 课、独立成章**。→ **功能完全重叠**。

**额外硬约束〔实读〕**：`grammarLessons.test.ts:163-178` 断言「同一句练习答案最多出现在 6 课」。**本轮独立复算 138 课的 438 条 practice 答案**：
- **已用满 6 课的**：1 句（`yesterday i went to the park`，出现在 L21/24/93/95/100/104）；
- **只剩 1 次头寸的**：5 句；
- **L138 脊柱句 `I am used to getting up early.` 已用 5 课**（L120/122/124/136/138）；**`It looks nice.` 已用 5 课**（L125/126/128/133/134）。
- → **纯复现章每课要出 4 道练习，只能从这些高频句里挑；上表说明「每课一增量」在纯复现课里不但没有增量落点，连「不出红线」都要精算头寸**。

---

## 3. 方案对比表

| 维度 | **方向 1：A 档复现型大章** | **方向 2：C 档 `have sth done`** | **方向 3：换轴（读写／听力）** | **★ 本轮推荐：让步与转折 3 课** | 备选 1：`as soon as` 3 课 |
|---|---|---|---|---|---|
| **缺口真实性** | ❌ **不是缺口**（是形态重排；库内已有 15 课同型） | ✅ 真缺口（词架近零） | ❌ 不是缺口（新工作流） | ✅ **真零**（`although` 0／0；`though` 仅 HC 2 在错句里） | ✅ 真零（`as soon as` 0／0；`soon` 0／0） |
| **频率 × 痛感** | —（无新结构，痛感无从谈起） | 低（书面语，日常口语少） | — | **高 × 高**（「虽然…但是…」成对负迁移，且**案 #7 已植错**） | 中高 × 中 |
| **认知负荷** | 低（零新知） | **高**（跨级 ＋ 同形异义） | 中高（同时学体裁与语法） | **中**（结构位置固定，负迁移单一） | 中低（结构同 L92/L109） |
| **体系衔接** | 弱（无新接口） | 中（接 L50-54 被动块） | 弱 | ✅ **强**：L19 `:3429`／`:3493`（`but` 唱反调）＋ L20 `:3612`／`:3629`（成对负迁移同一条规矩）＋ **案 #7 回流** | ✅ **强**：L90/L91/L92（`:17105` 三人组）/L98/L109 |
| **红线核对** | 与「一课一增量」直接冲突 | 撞 `comparison`? 不撞；但跨级 | **撞两条**（一课一增量 ＋ 零术语——读写必引体裁词） | ✅ 不撞：`although` 的讲解用「唱反调」「两个只能来一个」；**注意 `but` 已有话术，须显式切开** | ✅ 不撞（用「一到就」「紧跟着」） |
| **容量（课量）** | 3+ 课但**每课零增量** | 2–3 课 | 不定 | ✅ **3 课**（立岗／切开／收口，**每格一个真实增量**） | 3 课（立岗／切开／收口） |
| **形态风险** | **最大**：与 15 课同型重复；且练习句头寸见底 | 中（跨级＋同形异义） | 中高（新工作流，无先例） | **中**：**唯一风险是与 L19 `but` 混淆**——化解＝L140 整课切开 | **中**：**与 `when` 只差一刻度** |
| **造词成本** | **0**（但也没新东西） | 2–5 个（`haircut` 0／`cut` 0／`repaired` 0／`fixed` 0／`checked` 0；**但 `cleaned` 126／`window` 164／`door` 139 在库**） | 0 | ✅ **2 个**（`although` ＋ `though`；`even` 可选第 3）〔实读〕 | ✅ **1 个**（`soon`） |
| **档位（诚实）** | **不适用**（无新结构可标） | **C 档**（缺课位） | 不适用 | **B 档**（BC 有课程位专课 ＋ Murphy 有专单元 ＋ 词典有 CEFR；**但造 2 词，不得写成 A 档**） | **B 档**（词典 B1 ＋ 参考层，**无课程位**） |

### 3.1 与批二十二竞析的**一处分歧**（必须明写）

**竞析 §4.1 首选 `as soon as` 3 课；本报告把 `although` 排第一、`as soon as` 排备选第一。分歧点只有一条**：

- **竞析的理由**：本批「正确形态不是再开一块空地，而是把已经铺好的地板补上一格」——`as soon as` 正是时间家族那一格，**接口最厚**。
- **瑞思的理由**：**「补一格」的代价是这一格与相邻格的语义差只有一刻度**（第六格 vs 第五格 `when`）。**而 `although` 是「开一条新线」**——它接的是 **L19/L20 的连词家族（另一条线）**，**不是往时间家族里再塞一个近义项**。**用「中文负迁移强度」这一条判**：`although…but` 成对是**学生在写作里反复犯的错**（**案 #7 就是它的实证**），而 `as soon as` 与 `when` 的混用**在库内没有任何案件证据**。
- **两条推荐并不冲突**：**本批做 `although`，`as soon as` 顺位为备选 1，可在批二十三接续**（时间家族第六格不会跑掉；而「先考后教」倒挂每多挂一批就多一次教学债）。

---

## 4. 大章节设计方案（推荐 · L139–L141 · 3 课）

**章名建议**：「虽然…但是…」——**但**（`grammarLabel` 须零术语，见 §6）

**单拱声明**：全批**一条「反着说」的线**，不折入他章。**场景锚**＝**同一天的两件事**（用库内既有 scene 值，**不引入新场景 id**）：

| 课 | scene（库内值） | 场景 |
|---|---|---|
| L139 | `city` | 早上出门：天冷，但心情好 |
| L140 | `campus` | 课间：`but` 与 `Although` 并排比 |
| L141 | `mansion` | 书桌前：本子最后一页排一行 |

〔实读〕scene 在用 11 种，**`city` 23／`campus` 37／`mansion` 48**，**三课全部零新场景**。

### 4.1 逐课规格

#### L139 · 「虽然天冷，但是我们很开心」（立岗课）

| 项 | 内容 |
|---|---|
| **课号／scene** | L139 ／ `city` |
| **增量（一课一增量）** | **`although` 上线（新词 1 个）＋「两头卡住」的位置感**：`Although` 站句首领一整句，后面再跟主句——**这是全库第一次把「虽然」的结构说出来** |
| **目标句** | `Although it was cold, we were happy.`（**7 词 ≤8**） |
| **blocks** | `{ text: "Although it was cold", role: "虽然天冷（一整句，站最前面）" }` ／ `{ text: "we were happy", role: "我们很开心（后面跟主句）" }` |
| **oneLineRule（零术语）** | 「中文说「虽然……但是……」，英语只说一半：**Although 站最前面领一整句**，后面直接跟结果——Although it was cold, we were happy。**Although 在场，「但是」就不用出场了。**」 |
| **接口复现** | ① **L19 `:3429`**（`but` 唱反调）——**显式引用并说明「今天这个放在最前面」**；② **L19 `:3432` 逐字取 `The snow is cold but fun.` 作 `bothRight` 对手句**；③ **L20 `:3612`**（「只用其中一个，不成对出现」）——**同一条规矩的第二次应用**；④ **L6 `It is`（天气）**——`it was cold` 是老座位 |
| **contrast 6 条（≥2 带 `wrongMark`）** | ① `Although it was cold, but we were happy.` ←`but`（**中文负迁移主靶**，`wrongMark: "but"`）；② `Although was cold, we were happy.` ←`was`（**缺「谁」**，`wrongMark: "was"`）；③ `Although it was cold we were happy.` ← 缺逗号（`wrongMark: null`）；④ `Although it was cold, we were happy.` vs `The snow is cold but fun.`（`bothRight: true`，**L19 回流**）；⑤ `It was cold, but we were happy.`（`bothRight: true`，**`but` 版也对——两句话一件事，只是强调的地方不同**）；⑥ `It was cold, so we stayed at home.`（`bothRight: true`，**L20 回流：so 和 although 说的不是一件事**） |
| **variants** | 肯定 `Although it was cold, we were happy.`／否定 `Although it was cold, we were not sad.`／疑问 `Were you happy although it was cold?` |
| **sceneSwings** | ① 说天冷但开心 → `Although it was cold, we were happy.`；② 说雪冷但好玩 → `Although the snow was cold, it was fun.`；③ 说累但做完了 → `Although I was tired, I finished my homework.` |
| **guided 6** | `choose`（Although／But／So）／`arrange`／`arrange`（R8 复现 L19）／`spot`（挑 `but`）／`arrange`（R8 复现 L20）／`replace`（把 `but` 句改成 `Although` 句） |
| **practice 4** | 主句 ＋ 变体疑问 ＋ **复习 L19** ＋ **复习 L20**（**逐题给 `distractors` 防多解**） |
| **recall** | `promptZh`：早上出门时天很冷，但你心情很好。凭记忆，写出你今天这一句。／`intentZh`：虽然天冷，但是我们很开心。 |
| **案** | **#148**（见 §4.2） |
| **新词** | `although`（1 个） |

#### L140 · 「句子里已经有了它，就不用『但是』」（切开课）

| 项 | 内容 |
|---|---|
| **课号／scene** | L140 ／ `campus` |
| **增量（一课一增量）** | ✅ **真增量＝「谁站最前面」的位置差**：**同一个意思、两个说法、强调的地方不一样**——`Although it was cold, we were happy.`（把「冷」放前面，**先说让步**）对 `It was cold, but we were happy.`（把「开心」放前面，**先说结果**）。**这是 L19 `but` 一课从未讲过的轴**（L19 只讲「反着来用 but」）。 |
| **目标句** | `It was cold, but we were happy.`（**7 词 ≤8**） |
| **blocks** | `{ text: "It was cold", role: "天冷（先说这个）" }` ／ `{ text: "but we were happy", role: "但是我们很开心（but 站中间）" }` |
| **oneLineRule（零术语）** | 「同一个意思，两句话都能说：`Although` 站**最前面**，先摆出让步的那半句；`but` 站**中间**，两半句手拉手。**两个都在说「反着」，站的位置不一样，先说的那个就变成了重点。**」 |
| **接口复现** | ① **L19 `:3429` 逐字**（「反着来用 but」）；② **L138 `:25930` 的「同一个 to 的两站」形态照抄**（**两句话排一行、比一比**）；③ **L92 `contrast` 的 `bothRight` 形态照抄**（两句都对、用法不同） |
| **contrast 6 条** | ① `Although it was cold, we were happy.` vs `It was cold, but we were happy.`（`bothRight: true`，**本课脊柱**）；② `Although it was cold, but we were happy.` ←`but`（`wrongMark: "but"`，**再次切开**）；③ `Although it was cold, so we were happy.` ←`so`（`wrongMark: "so"`，**L20 回流：so 说结果，although 说让步，不能同台**）；④ `Although it was cold, we were happy.` vs `The snow is cold but fun.`（`bothRight: true`，**L19 回流**）；⑤ 缺逗号；⑥ 缺「谁」（`Although was cold`） |
| **variants** | 肯定 `It was cold, but we were happy.`／否定 `It was cold, but we were not sad.`／疑问 `Was it cold although you were happy?` |
| **sceneSwings** | ① 先说让步 → `Although it was cold, we were happy.`；② 先说结果 → `It was cold, but we were happy.`；③ 说作业多但做完了 → `Although I had a lot of homework, I finished it.` |
| **guided／practice** | 与 L139 同结构；**`practice` 第 1 题须是主句**（`It was cold, but we were happy.`），**第 2 题须是变体疑问**（`grammarLessons.test.ts:11` 硬要求），后两题复习 L19／L139 |
| **recall** | `intentZh`：天冷，但是我们很开心。 |
| **案** | **#149** |
| **新词** | **0**（切开课） |

#### L141 · 「反着说，排一行」（收口·零新知）

| 项 | 内容 |
|---|---|
| **课号／scene** | L141 ／ `mansion` |
| **增量** | **零新知**（收口） |
| **目标句** | `Although it was cold, we were happy.` |
| **grammarLabel** | 「收口 · 零新知（反着说，两句排一行）」 |
| **oneLineRule** | 「这一章学的都在这页上：先说让步，`Although` 站最前面；两半句手拉手，`but` 站中间。**两个都在说「反着」，位置不一样。**」 |
| **examples 4 条** | ① `Although it was cold, we were happy.`（第 139 课）② `It was cold, but we were happy.`（第 140 课）③ `The snow is cold but fun.`（**第 19 课**）④ `It was cold, so we stayed at home.`（**第 20 课**） |
| **contrast 6 条** | 全 `bothRight` ＋ `wrongMark` 混合，**逐条标注「第 N 课回流」**；**必须含第 ④ 条「六行排一行」** |
| **接口** | 跨批钩子：**L19／L20（批二）＋ 本批 → 本项目第一次把「反着说」家族排一行**；形态照抄 L124 `:23209`／L133 `:24951`／L138 `:25917` |
| **案** | **#150** |
| **新词** | **0** |

### 4.2 案件设计（#148–#150，每课 1 案，4 错 ＝ 新错 2 ＋ 旧错 2）

**编号起点〔实读〕**：`huntCases.ts:8140` 最后一案 `number: 147`（`hunt-two-stations`）→ **本批从 #148 起**。

**罪名（只能用这 10 个）**：`tense`／`sv_agreement`／`missing_be`／`article`／`plural`／`preposition`／`fragment`／`run_on`／`word_order`／`verb_form`（**不碰 `comparison`**）。**库内当前分布〔实读，147 案共 562 处错〕**：`verb_form` 131／`plural` 102／`sv_agreement` 89／`preposition` 62／`tense` 50／`word_order` 47／`article` 29／`missing_be` 24／`run_on` 14／`fragment` 14。

**错型选择依据〔实读〕**：`fragment` 与 `run_on` 是**最薄的两档（各 14）**，而**让步／转折结构天然承载 `run_on`**——**案 #7 的第 2 处错就是 `Though`＋`but`，`tag: "run_on"`**。→ 本批**三次都用 `run_on` 作为「新错」的第一处**，**既对齐红线的薄档补位，又直接延续案 #7 的判例**。

| 案 | 课 | 标题 | 4 处错（**新 2 ＋ 旧 2**） | 罪名 | 依据 |
|---|---|---|---|---|---|
| **#148** | L139 | 「早上的两句话」 | **新 1**：`Although it was cold, but we were happy.` → 去掉 `but` | **`run_on`** | **案 #7 `huntCases.ts:343`／`:366` 同型**（`Though`＋`but` 同句，`correction: "去掉 but"`） |
| | | | **新 2**：`Although was cold, we were happy.` → `Although it was cold` | **`fragment`** | **L1 `:178` 逐字「英语的句子必须有动词」**；**`fragment` 为全场最薄档（14 处）** |
| | | | **旧 1**：`we was happy` → `we were happy` | `sv_agreement` | **L10 `:1765` 回流**（昨天版 be 动词） |
| | | | **旧 2**：`He drink milk every day.` → `drinks` | `sv_agreement` | **L25 `:4511` 回流**（三单加 -s） |
| **#149** | L140 | 「课间的两个说法」 | **新 1**：`Although it was cold, so we were happy.` → 去掉 `so` | **`run_on`** | **L20 `:3629` 逐字同一条规矩**（because/so 只能来一个） |
| | | | **新 2**：`Although it was cold, we were happy but.` → 去掉句尾 `but` | **`run_on`**（同案第二处，**轴不同**：一处是 so、一处是 but） | **L139 回流的一次变式**——**「二选一」在两个不同的词上都成立** |
| | | | **旧 1**：`It were cold, but we were happy.` → `It was cold` | `sv_agreement` | **L10 回流** |
| | | | **旧 2**：`I did not went out.` → `did not go` | `verb_form` | **L10 `:1808` 逐字回流**（contrast `I didn't went out.` → `I didn't go out.`；`:1811` 逐字「didn't 一出场，动词就要打回原样」） |
| **#150** | L141 | 「本子上的两句话」 | **新 1**：`Although it was cold, but we were happy.` → 去掉 `but` | **`run_on`** | **收口案复现主靶**（L139 回流的一次变式） |
| | | | **新 2**：`Although it was cold, we was happy.` → `were` | **`sv_agreement`** | **本章 be 动词位置复现**——**但考点挂的是本章句**，故计入「本章」 |
| | | | **旧 1**：`two cup` → `two cups` | `plural` | **L11 `:1947` 回流**（**#147 `huntCases.ts:8173` 已用过同型，判例在库**：`tag: "plural"`／`original: "cup."`／`correction: "cups."`） |
| | | | **旧 2**：`I am student.` → `I am a student.` | `article` | **L1 `:199` 回流**（漏 `a`） |

**四案共用一条「陷阱词」纪律**〔实读，`huntCases.ts:7-9` 逐字「每个案件都故意留了『看着可疑但其实没错』的陷阱词」〕：每个案子都要放一个合法句在 `tokens` 里（**#148 放 `The snow is cold but fun.`（L19 `:3432` 逐字）／#149 放 `We were happy although it was cold.`／#150 放 `The snow is cold but fun.`**），**玩家点它就算错**——这与「4 处错」是两回事（**陷阱词不进 `errors[]`**）。

**旧错回流池（只能用已教点）〔实读〕**：**L10**（`:1765` number／`:1767` label「说昨天的事」，target `:1775` `Yesterday I went to the park.`）／**L11**（`:1947` number／`:1949` label「好几个 + 特殊的昨天版」，target `:1957` `I ate two sandwiches.`）／**L19**（`:3413` number／`:3415` label「连词 · and / but」，target `:3423` `I was busy and happy.`）／**L25**（`:4511` number／`:4513` label「每天都做 · 他/她/它加 -s」，target `:4521` `He drinks milk every day.`）／**L1**（`:139` number，`:178` whyZh「英语的句子必须有动词」、`:199` `I am student.` 漏 `a`）／**L20**（`:3596` number／`:3598` label「连词 · because / so」，`:3615` `It was cold, so I stayed at home.`）。

### 4.3 展示层（随批上线）

- **season-22**：`{ id: "season-22", label: "第二十二季 · 反着说", hint: "虽然天冷，但是我们很开心——英语只说一半，位置不一样", min: 139, max: 141 }`——**追加到 `grammarSeasons.ts`，否则 139–141 会被路径页静默过滤**（**该文件 `:6-8` 硬护栏逐字：「课程号不落在任何区间内会被路径页静默过滤……并有 grammarSeasons.test.ts 守门」**）。
- **m24**：`{ id: "can-do-m24", afterLesson: 141, title: "我能反着说", zh: "虽然（Although 站最前面）+ 但是（but 站中间）——同一个意思，先说哪个哪个就是重点。", samples: [...] }`——**追加到 `GrammarPathPage.tsx`**（m23 在 `:276` `afterLesson: 138`）。
- **封面**：`cover139`–`cover141`——**资产池是产品决策，本轮不预判**（批二十一 §6.3 序 1 已把「封面二用池长期耗尽」挂为产品负责人事项）。

### 4.4 课量建议（**必须回答**）

**建议 3 课，不扩不缩。** 三条理由：

1. **增量恰好 3 格，每格都是真增量**：① 立岗（`although` 上线 ＋ 位置感）；② **切开**（`Although` 站最前面 对 `but` 站中间——**这一格是 L19 从未讲过的轴**）；③ 收口（零新知）。
2. **不取 2 课**：**切开位是本章唯一的独立价值**。若不切开，`although` 与 L19 的 `but` 在学生眼里就是**同一件事的两种写法**，L139 会退化成「L19 的换词课」。
3. **不取 4 课**：第 4 课的唯一可能来源是 **`despite`／`in spite of`**〔实读：两者 GL 0／HC 0，BC 第 6 课标题含 `'despite'`，Murphy U113 含 `in spite of despite`〕——**但它们是 `although` 的同义换挡，不是新结构**（**且 `despite` 后面跟名词、不跟小句子，会把一课变成两课**）。

**与近期批次的课量对照**：批十八 6 课／批十九 3 课／批二十 6 课／批二十一 5 课。**本批 3 课＝与批十九同量，是本项目「小章」的既有形态**（批十九 `season-19` ＝ `{125,127}` 恰为 3 课）。

---

## 5. 中文负迁移专项（逐课）

> **依据**：上游明文＋库内已有案件。**标〔实读〕的为库内逐字**，其余为〔推断〕。

### L139 —— **「虽然……但是……」成对出现**（**本章主靶**）

| 项 | 内容 |
|---|---|
| **中文怎么想** | 「**虽然**天冷，**但是**我们很开心」——中文里这两个词是**成对出场**的，缺一个反而不顺 |
| **学生怎么写** | `*Although it was cold, but we were happy.` |
| **为什么** | 英语的这两个词是**二选一**：`Although` 站最前面 或 `but` 站中间——**同一条规矩 L20 已经教过**（`:3612` 逐字「英语只用其中一个，不成对出现」；`:3629` contrast 逐字「中文「因为……所以……」成对出现，英语 because 和 so 只能来一个」） |
| **库内实证〔实读〕** | **案 #7 `huntCases.ts:343`＋`:366`**——`"Though"` ＋ `"but"` 同句，`tag: "run_on"`，`correction: "去掉 but"`，explanation 逐字「同样的道理：Though 和 but 不能同时出现，留一个就够。」 |
| **话术（零术语）** | 「中文说「虽然…但是…」，**两个词一起上**；英语的这两个词是**一个位置上的两个选择**——你占了最前面那个位置，「但是」就没位置站了。」 |
| **对照卡** | L139 contrast ①（带 `wrongMark: "but"`） |

### L139 —— **小句子缺「谁」**

| 项 | 内容 |
|---|---|
| **中文怎么想** | 「虽然**天**冷」——中文可以省主语 |
| **学生怎么写** | `*Although was cold, we were happy.` |
| **为什么** | `Although` 后面跟的是**一整句**（谁 ＋ 怎么样），`it` 不能丢——**L6 天气句的老座位** |
| **库内实证〔实读〕** | L1 `:178` 逐字「中文说「我小美」不用动词，但英语的句子必须有动词」——同型 |
| **话术** | 「`Although` 后面站的是**一整句**，那一句也得有自己的「谁」——天冷的那个「天」不能省。」 |

### L139 —— **`it` 的老座位（天气）**

| 项 | 内容 |
|---|---|
| **中文怎么想** | 「天冷」——中文没有「它」 |
| **学生怎么写** | `*Although the weather was cold, ...`（不算错，但绕） |
| **为什么** | 说天气用 `it`——**L6 已教**（`It is` · 时间与天气） |
| **话术** | 「说天气，句首那个位置永远是 `it`——L6 的天气老座位，今天照坐。」 |

### L140 —— **「重点放哪儿」的意识缺失**

| 项 | 内容 |
|---|---|
| **中文怎么想** | 中文「虽然…但是…」顺序固定，**学生不会意识到换位置能换重点** |
| **学生怎么写** | 只会用一种（多数用 `but`），**不知道 `Although` 版存在** |
| **话术** | 「两句话**意思一样**，但先说哪半句，哪半句就变成了这次要讲的重点——想先摆「冷」，就用 `Although` 开头；想先摆「开心」，就用 `but`。」 |

### L140 —— **`but` 与 `so` 混用**（L20 回流）

| 项 | 内容 |
|---|---|
| **学生怎么写** | `*Although it was cold, so we were happy.` |
| **为什么** | 中文「虽然…所以…」也有人说；英语 `so` 说的是**结果**（因为冷所以…），与 `Although` 的**让步**不是一件事 |
| **库内实证〔实读〕** | L20 `:3651` contrast 同型（`It rained, because I took an umbrella.` → 因果别弄反） |

### L141 —— **收口课无新负迁移**

**处理**：本课**零新知**，负迁移全部**回流前三课与 L19／L20**；`contrast` 六条**逐条标注「第 N 课回流」**（照 L138 `:25947`／`:25953`／`:25959`／`:25965` 的逐字形态）。

---

## 6. 体验建议

### 6.1 场景锚（不用大量造词的实证）

**三课场景锚＝「同一天的两件事」**，全部用库内既有 scene 值与既有名词／形容词〔实读〕：

| 课 | scene | 场景锚 | 该场景所需词 | 词的成本〔实读〕 |
|---|---|---|---|---|
| L139 | `city`（在用 23 次） | 早上出门：天冷，但心情好 | `cold`／`happy`／`snow`／`it is` | `cold` GL **267**（L87 一门 43）／`happy` GL **124**／`snow` GL **17**（L19 一门 10）／**L6 `:1055` oneLineRule 逐字**「说时间和天气，开头用 It：It is…」—— **全在库，零造词** |
| L140 | `campus`（在用 37 次） | 课间：两个说法并排比 | 同上 ＋ `but` 句 | `but` GL **68**（L19 一门 37）—— **零造词** |
| L141 | `mansion`（在用 48 次） | 书桌前：本子最后一页排一行 | 同前两课 | **零造词** |

**造词总账〔实读〕**：`although`（新）＋`though`（新，作 L140 的 `contrast` 对照词）＝ **2 个词**。`even`／`despite`／`in spite of` **本批不用**（`even` GL 0／HC 0 是真零底座；`despite` 0／0）——**留给后续批次**。

**与近期三批的成本对照**：批十九 0 造词（升格课）／批二十 **3** 个动词／批二十一 **2** 个（`forward`＋`seeing`）。→ **本批 2 个，与批二十一持平，低于批二十**。

### 6.2 零术语话术

**红线〔实读〕**：`grammarZeroTerms.ts:17-27` 逐字 29 词，**含「形容词」「副词」「介词」「从句」「语序」「时态」**。**本批高危词＝「从句」（在表内！）**——而 `although` 的语言学描述正是「连词引导的**让步状语从句**」。

| 禁写 | 改写成 | 依据 |
|---|---|---|
| ❌「although 引导**从句**」 | ✅「Although 后面跟**一整句**」 | **「从句」在 29 词表内**；「一整句」是 **L90 `:16727` 逐字已有的话术**（「after 后面要跟一个完整的小句子（谁 + 做什么）」） |
| ❌「although 是从属**连词**」 | ✅「Although 站**最前面**」 | 「连词」**不在** 29 词表（L19 `:3415` 标签就是「连词 · and / but」），**但为统一口径，本批不用它** |
| ❌「让步**状语**」 | ✅「先摆出让步的那半句」 | 「状语」在表内 |
| ❌「主句在前／**语序**」 | ✅「谁站最前面，谁就是这次要讲的重点」 | 「语序」在表内 |
| ❌ 用「时态」解释 `was/were` | ✅「昨天的事，用昨天版」（**L10 逐字话术**） | 「时态」在表内 |

**本批额外禁词**：**「从句」「状语」「主句」「语序」四词全禁**（前两个来自 29 词表，后两个是「主句/从句」这套分析用语的配套词，**用了前两个就必然引出后两个**）。

### 6.3 复现设计（**这是本批的形态核心**）

**我方已有的复现体系〔实读〕**：

| 装置 | 位置 | 作用 | 本批处置 |
|---|---|---|---|
| `recall`（忆段） | 课内 | 凭记忆写核心句 | **每课必配**（`grammarLessons.test.ts:69-77` 对 L13+ 硬要求，**且必须给 `intentZh`**） |
| `// R8 跨课复现` | `guided` 内 | 上一课句式混入 | **本批每课 ≥1 处**（L139 复现 L19、L140 复现 L20、L141 复现 L19＋L20） |
| `practice` 后两题 | 课内 | 复习前课 | **本批固定为「复习 L19＋复习 L20」** |
| `contrast` 的 `bothRight` | 课内 | 两句都对、用法不同 | **本批三课各 ≥2 条** |
| **关 2 回访（`GrammarRevisitPage`）** | 课末自动 | cloze ＋ 回马枪 | **不改**（见 §6.5 的 cloze 预警） |
| **关 3 旧案重审（`GrammarReauditPage`）** | 课末自动 | 本课新案 ＋ 30–50% 旧罪名变式 | **不改**——**它已经在做「旧结构新案情」** |
| **趁热练（`GrammarBoostPage`）** | 独立 | 四档出题 | **不改** |
| **SM-2 复习（`GrammarReviewPage`）** | 独立 | 间隔重复 | **不改** |

> **⚠️ 关键结论（回答方向 1）**：**我方已有 7 条复现通道**，其中**关 3（旧案重审）做的正是「旧结构新案情」**——**这正是「复现型大章」想做的事**。→ **纯复现章与关 3 职能重叠**；**若强行立章，须先出一张「职能分工表」证明不重复**——**本轮实读后判：无必要，且「一课一增量」在这一形态里没有落点**。

### 6.4 cloze 保障句（**本批必须逐句预检，附实测**）

**两套引擎、两种行为，本轮**独立复刻实跑**〔实读〕：

**① 关 2 回马枪（`grammarAmbushService.ts:195-213`）——确定性取「第一个语法承载词」**：

| 句子 | 落点 | 档位 |
|---|---|---|
| `Although it was cold, we were happy.` | **`was`** | 档 1 |
| `It was cold, but we were happy.` | **`was`** | 档 1 |
| `Although the snow was cold, it was fun.` | **`was`** | 档 1 |
| `Although I was tired, I finished my homework.` | **`was`** | 档 1 |
| `Although it was cold, we were not sad.` | **`was`** | 档 1 |

→ **`although`／`though`／`but` 成空位率 0%（5/5 全落 `was`）**——**原因〔实读〕**：`although`／`though`／`but` **都不在 `grammarAmbushService.ts:160-187` 的 `GRAMMAR_WORDS` 表内**（逐字核对：`although` false／`though` false／`but` false），而 `was` 在表内且出现在句首附近。→ **⚠️ 这是本批的「cloze 假友好」，与批二十一 `forward` 同型**。

**② 趁热练（`grammarBoostService.ts:260-284`）——在关键词池里随机抽**（`keywordIndexes`：长度 ≥3 且非 `FUNCTION_WORDS`）：

| 句子 | 关键词池 | 200 次落点分布 | **目标词命中率** |
|---|---|---|---|
| `Although it was cold, we were happy.` | `Although/was/cold/were/happy` | were 44／**Although 43**／was 40／happy 39／cold 34 | ✅ **21.5%** |
| `Although I was tired, I finished my homework.` | `Although/was/tired/finished/homework` | finished 44／**Although 43**／was 40／homework 39／tired 34 | ✅ **21.5%** |
| `Although the snow was cold, it was fun.` | `Although/snow/was/cold/was/fun` | was 69／snow 36／**Although 33**／cold 32／fun 30 | ✅ **16.5%** |

→ **趁热练侧 `although` 可落 16.5%–21.5%，不必改引擎**〔实读：本批独立复刻 `hashText`＋`mulberry32` 跑 200 种子〕。

**③ 处置建议**：
- **考点承载一律压在 `contrast`（每课 6 条、**≥3 条带 `wrongMark``）与 `guided.spot`（每课 1 道）**——**两条通道都不走 cloze**（沿用批二十一 §1.2 的处置）。
- **不改 `grammarAmbushService.ts`／`grammarBoostService.ts`**。
- **⚠️ 一条可选工程项（供主理人裁）**：若要把 `although`／`though` 纳入关 2 的回马枪考点，**须往 `GRAMMAR_WORDS` 加 2 个词**（**批十七数析 §3.1 对 `neither/either/both` 提过同样的建议**，当时判「不改引擎」）。**本报告的建议：不改**——**理由是关 2 的定位是「回马枪」而非「本课考点复练」**，`was` 落空位在容错范围内。

**④ 时长建议**：**每课 12–15 分钟**（与批十九 3 课小章同量；`guided` 6 题 ＋ `practice` 4 题 ＋ `contrast` 6 条）。**L139 首玩略长（15 分钟，含 `Although` 新词的认读）**，L141 收口课最短（12 分钟，零新知）。

### 6.5 封面与展示层

- **封面取池**〔实读〕：`src/assets/lessons/` **117 张**（`lesson-1.jpg`–`lesson-117.jpg`），`grammarLessons.ts` **117 条 import**，**138 课引用 117 张**（**21 张二用／96 张单用**；**复用最多的也只到 2 次**）；**最近 21 课（L118–L138）用的是 `cover1`–`cover21`**（**逐一顺延，gap 恒为 117**〔实读：`cover1` 在 L1→L118，`cover21` 在 L21→L138〕）。
- **本批建议取 `cover22`／`cover23`／`cover24`**〔实读：三者最近一次使用分别是 **L22／L23／L24**，按「顺延一位」的历史惯例分配给 L139／L140／L141，**gap 恒为 117**，与上 21 课完全一致〕。**此为建议，不是红线**（封面池政策是产品负责人事项）；**备选**：`cover25`–`cover27`（最近使用 L25–L27，gap 同级）。
- **season-22 ＋ m24** 随批上线（§4.3）。

---

## 7. 后续研究建议

| # | 事项 | 负责 | 时机 |
|---|---|---|---|
| 1 | **`as soon as` 3 课（备选 1）顺延为批二十三首选** | 瑞思＋竞析 | F22-B 之后 |
| 2 | **`although` 的「第 4 课」是否成立**（`despite`／`in spite of`）——**须先证「换名词不换结构」是否构成增量** | 析客 | 批二十三研究期 |
| 3 | **`even though`／`in case`／`unless` 的散点归并**（三者 GL 0／HC 0；Murphy 中级 **U113**（`even though in spite of despite`）／**U114**（`in case`）／**U115**（`unless as long as provided`）**连续三个单元**〔实读：本机原件逐单元抽出〕）——**这是一条可能撑 2–3 课的连续课位链**，**但属让步章的下游，须等本批落地后再评估** | 竞析 | 批二十三研究期 |
| 4 | **`would rather`（B−，2 课）**——Murphy 中级 U59 逐字证据在库，**中文侧零专文**是唯一硬伤 | 竞析 | 择批 |
| 5 | **`neither/either/both`（B−）成本结构复核**——4 词成本 ＋ 与 L25/L34 三单教学重叠，**须与「造词上限」政策一并裁** | 数析 | 择批 |
| 6 | **`seem/appear`（C）维持不排期**——**除非**未来出现「判断来源」这条轴的其他成员（`sound like`／`look like`）一起立章 | 竞析 | 观察 |
| 7 | **`GRAMMAR_WORDS` 是否扩容**（当前 60+ 词，不含 `although`／`though`／`but`／`so`／`because` 等**连词类**）→ **若未来做连词章，这类词的 cloze 落点会系统性偏离考点** | 数析 | 与 §6.4-③ 一并裁 |
| 8 | **「先考后教」倒挂的全库盘点**（案 #7 挂 L12 是已知一例；**是否还有别的案件植入了未教结构**）——**这是本轮提出的新研究项**，批十七只发现过 `-ed/-ing` 一例 | 数析 | 下一批研究期 |
| 9 | **封面二用池**（批二十一 §6.3 序 1 挂账）——**与本批的 `cover22/23/24` 建议直接相关** | 产品负责人 | D1 拍板 |
| 10 | **批二十一 F21-B 上线观察门**（L134–L138 完成率曲线 vs 批十八 6 课／批二十 6 课两线并读）**未回**——**本批开工不等待**（写内容 vs 读数据互不锁） | 主理人 | 1–2 周后 |

### 7.1 本报告的口径声明（诚实标注）

1. **档位**：**本批推荐项为 B 档**——**BC 有课程位专课（B1-B2 第 6 课）＋ Murphy 有专单元（中级 U113）＋ 词典有 CEFR**，**但须造 2 个词，且 BC 的课程位在 B1-B2（中高级段）而非 A1-A2**。→ **对外一律写「B 档：跨源有课程位级专课 ＋ 专单元，但我方零底座、须造 `although`／`though` 两个词」**；**不得**写成 A 档（A 档的定义是「跨源官方课位 ＋ 我方有接口/垫子」，**本项我方是零**）。
2. **`seem/appear`＝C 档**（缺课位 ＋ 需造词），**若有人重提，不得写成 B 档**。
3. **`neither/either/both` ＝ B− 档**、**`would rather` ＝ B− 档**（有课程位但容量只够 2 课）。
4. **本轮上游引用**：Murphy 双册 TOC 为**本机原件逐单元抽出**（`/tmp/murphy_int.pdf`／`murphy_ess.pdf`），**是本报告最硬的上游证据**；BC 三档索引为本机存档逐条抽出；**Cambridge 专页本轮未直取，凡引自竞析的均标〔未核实〕**。
5. **未核实项**：① Cambridge `would-rather-would-sooner`／`conjunctions-time`／`have-something-done` 三页**本轮未直连**（沿用批二十二竞析的实取记录）；② 中文侧 `although` 四篇 slug **只证存在，未读正文**（站点地图层面）。

---

> 本研究报告由产品战略团队瑞思执笔，经主理人汇编落盘。重要决策请由产品负责人审定。
