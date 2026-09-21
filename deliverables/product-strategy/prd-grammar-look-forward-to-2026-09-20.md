# PRD：第二十一批 · 盼着那一天（look forward to · 5 课 L134–L138）

**日期**：2026-09-20 ｜ **类型**：功能规格书（PRD）｜ **成员**：析客（需求分析）
**上游输入**：主理人裁决（批二十一＝「盼着那一天」大章 5 课 L134–L138、单拱、B＋ 档、**「所有 B 档系列课程」的收官批**；采纳瑞思次序，L135 为考点承载课）；本批三研究（瑞思 `user-research-grammar-twenty-first-batch-2026-09-20.md`／数析 `data-audit-grammar-twenty-first-batch-2026-09-20.md`／竞析 `competitive-analysis-grammar-twenty-first-batch-2026-09-20.md`，均 2026-09-20）；上批 PRD `prd-grammar-five-senses-2026-09-19.md`（格式与护栏基线）

## 📝 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1 | 2026-09-20 | 初稿：5 课（L134–L138）＋5 案（#143–#147），开 season-21、m23；单拱「盼着那一天」；**档位诚实标注为 B＋（造词 ＋ 认读升格）**；`forward` 认读升格（L133 种子位转正）；L135 定为 **cloze 考点承载课**；L138 收口课承担两条切开；**本批为 B 档系列收官批** |

## 📌 TL;DR

1. **批二十一＝5 课（L134–L138）「盼着那一天」单拱大章**：认整块（L134 `I am looking forward to the weekend.`）→ **换人换形／考点承载**（L135 `She looks forward to the summer.`）→ 盼的是做某事（L136 `I am looking forward to seeing you.`）→ 说不和问（L137 `Are you looking forward to the summer?`）→ **零新知收口＋两条切开**（L138 两站排一行）。开 **season-21（{134,138}）＋m23（afterLesson 138）**，批量 **138 课、147 案**。
2. **这是「所有 B 档系列课程」的收官批**（主理人已定，本 PRD 不重新论证）。**收官的两层含义（必须写进生产单）**：① **它是 B 档候补清单里最后一个尚未交付的项目**——`have sth done`（C）维持撤出、形容词＋介词（B−）维持折卡、机制强化（D）不做、`seem`／`appear`（D）不排期，**本批交付后批二十二的候补清单里将不再有 B 档及以上项目**（竞析 §4.5 结账表逐条）；② **`look forward to` 已连续两批被列为候补第一**（批二十路线图 §6.2 序 1 原话），**本批是它的履约批，不是新选题**。→ **若本批被砍或缩量，B 档序列将出现「无候补可上」的空档**（瑞思 §0）。
3. **主理人裁决：采纳瑞思次序（「换人换形」占 L135、「名字版」占 L136），不采纳竞析的「名字版 L135／切开 L136」**——理由是一条 cloze 硬事实：**`She looks forward to the summer.` 是本族唯一能把空位压回考点词的形式**（空位落 `looks`，因为 `looks` 在 `GRAMMAR_WORDS` 词表内；而 `forward`／`looking` 在 ambush 引擎里**永不成空位**）。→ **L135 必须是「考点承载课」**（§1.2 裁决记录）。
4. **造词成本＝2 词封顶，且 `forward` 降级为「造词 ＋ 认读升格」**：`forward` 是**唯一必造**（GL 2／HC 0，**两处全在 L133 认读种子位**，不进练习），`seeing` 推荐造（可被 L87 `It's nice to see you.` 正向复用）；**名词侧零造词**（`weekend` GL 真词次 9／`summer` 3／`party` 2／`birthday` 152）；**`trip`（真词次 0）／`holiday`（双 0）两词禁用**（§3）。
5. **L134 必须做「认读升格」**：`I am looking forward to the weekend.` 已在 L133 出现 **2 处**（`examples` 第 4 条 `:24969` ＋ `contrast` ⑥ `:25009`，文案写着「以后再说它」）——**本批正是那个「以后」**。话术**照搬批十九 L127 → 批二十的成例**（L92 `:17175`「第 78 课你见过…（当时只是认读）——今天它转正了」）。**三条护栏：不得写「L133 已经教过」（它不在 `practice`／`guided`／`recall` 里）；不得改动 L133 一个字；种子位进 L134 的 `examples` 与 `practice` 是「转正」，不是「复用旧考点」**（§3.3）。
6. **cloze「假友好」是设计前提，不是缺陷**（本批技术核心）：ambush 引擎 **16/16 全走第 ① 档**（数析 §2.1；**本 PRD 独立复刻实跑 20 句，落点全部落在 `am`／`is`／`Are`／`look`／`looks`**），**`forward`／`looking`／`seeing` 成空位率 0%**。→ **考点承载压在 `contrast` 与 `guided.spot` 上（每课 ≥2 道，正是 G-boost 护栏在守的那条）**；**本批只有 `She looks forward to the summer.`（L135）与 `We look forward to the weekend.`（L134／L135／L138）两种形态能把空位压回考点词 `looks`／`look`**（§4.1 逐句登记、§4.6 逐课保障句）。boost 引擎侧 `forward` 可落 **22.6%–34.9%**，不必改。
7. **两条切开（L138 承担）**：① **与批十九 `look` 家族**——`look forward to` 是 `look` 的**第三张脸**（第一：`look + 什么的词`；第二：`look at` 动作义），**L134 就要显式点明「这个 look 不是看」**；② **与批十八 `be used to` 的「同族第二站」**——上游原文（Cambridge `To` 页）把 `be used, get used, listen, look forward, object, reply, respond` **并列在同一句**（竞析 CAM-1 当场复取），**L138 做「两站排一行」**：`I am used to getting up early.` 对 `I am looking forward to getting up early.`（**同一个 to、同一个名字版、意思完全不同**）。
8. **L138 须与 L122 的「两张脸」显式区分**：L122 切的是 **`to` 前面**（`used to` 对 `be used to`，有 be 没 be）；**本批切的是 `to` 后面**（跟东西 对 跟做的事）——**两课不同轴，须在 oneLineRule 里点明**（§5.3）。
9. **零术语红线：本批是双重高危**。29 词表内**含「介词」「宾语」「形容词」「副词」**；批十八／十九额外禁词**含「不定式」「动名词」「非谓语」**。→ **`look forward to` 的语言学描述正是「介词 to + 动名词」，三个红线词全命中**——**全批必须改写成「一整个块」「后面跟的那件事」「一个 to 两张脸」，并禁用「门牌」二字**（防与 L67 的 `at` 门牌串台，§6.3 替换表）。
10. **案件 5 案（#143–#147）**：每案 4 错＝新错 2＋旧错 2、单 token 可修、≥1 净词、`reviewed: true`；罪名全落 **10 枚举**、**不碰 comparison**；旧错只取 **L10／L11／L19／L25**；**避开 `fragment`／`run_on` 连续同型**（本批 0 处）；番外 5 案冻结；**`guided.spot` 的 `wrongToken` 必须与 `tokens` 元素逐字相等（含尾标点）**——**本批的 `<1>` 号新错型＝`to` 后面错跟原样**（`I am looking forward to see you.` ❌，`verb_form` 承载），**库里该方向恰好空着**（数析 §3.2：17 处 `wrong:` 全是「错跟名字版」方向）。
11. **G-boost 硬护栏**：每课 `contrast` 6 条中 **≥2 条带 `wrongMark`（本批推荐 3 条）**；`wrongMark` 不得为纯标点；双正解卡 `diffScore < 90`（**本 PRD 以真 `diffService` 逐组实跑留档，最高 75**）。

## 🎯 核心结论卡片

| 项目 | 内容 |
|---|---|
| 推荐方案 | 5 课 L134–L138「盼着那一天」单拱：认整块 1 → 换人换形 1 → 盼的是做某事 1 → 说不和问 1 → 零新知收口 1；5 案 #143–#147；开 season-21＋m23 |
| 优先级 | P1（内容生产批次）；无 P0 阻断项 |
| 预期影响 | **B 档系列四批（18／19／20／21）在本批结清**；本项目第一次以「认读升格 ＋ 造词」双成本结构开课（`forward` 有 2 次面熟但 0 处考点）；`look` 的第三张脸正式立起（与批十九两张脸切开）；中文侧「盼」这个字第一次正式启用（库内仅 2 处、全在 L133 种子位） |
| 资源需求 | ≈3.0 人日（内容 2.5＋展示层 0.25＋走查 0.25）；两段式 |
| 风险等级 | 中高（① **cloze 假友好**——ambush 侧考点词成空位率 0%（§4）；② **`look` 观感风险**——批十九＋批二十已连占 9 课，本批再连占 5 课＝ **`look` 连续 14 课在场**（数析 §3.3）；③ **零术语头号陷阱**——「介词」「不定式」「动名词」三词全命中本批核心（§6.3）；④ **与批十八的重复感**——「`to` 后面穿名字版」是 L120 已教内容；⑤ 复习卡引擎 C 的退化干扰项（`forwardes`／`lookinges`，竞析 §7 建议 1，**工程项，须先修**）） |
| 硬性范围红线 | 课量 5 不扩不缩（**第 6 课无真实增量**）；一课一增量；L138 零新知；六段式；每课 1 案（4 错＝新 2＋旧 2、单 token 可修）；对比卡 6 条（**≥2 条带 wrongMark，本批推荐 3 条**）；零术语词表 29 逐课自查；comparison 不进案件；tagStats=10 不动；**L1–L133 一字不动**；番外 5 案冻结；covers 池内取（cover17–cover21，**解唯一**）；**禁用 `trip`／`holiday`**；**不得写 `look to something` 作「期待」义** |

## §1 批次定位与选题裁决

### 1.1 命题（B 档系列收官批）

批十八（`be used to`，6 课）→ 批十九（`look + 什么的词`，3 课）→ 批二十（五种感官，6 课）→ **批二十一（`look forward to`，5 课）**。**四批之后，B 档系列结清。**

**这一批要回答的是**：B 档线的最后一项何时结清、以及用它结清什么。

**答案（主理人已定）**：**结清，且用它把「同一个 `to`」与「同一个 `look`」两条旧线一次收口**。

**「收官」的两层含义（写进生产单，逐条）**：

1. **它是 B 档候补清单里最后一个尚未交付的项目**（竞析 §4.5 结账表逐条实读）：批十八（B1 开局）→ 批十九（B）→ 批二十（B−）→ **批二十一（B＋，本批）**，四批已交付／本批交付；**剩余候补项最高只到 B−（形容词＋介词·折卡）与 C（`object to`／`have sth done`），且均已判「不单开」**；机制强化（D）与 `seem`／`appear`（D）**不排期**。→ **本批交付后批二十二的候补清单里将不再有 B 档及以上项目。**
2. **`look forward to` 已连续两批被列为候补第一**（批二十路线图 §6.2 序 1 原话「已连续两批被列为候补第一」）——**本批是它的履约批，不是新选题**；批二十已把它判为 B＋ 并逐条记录档位（词典义项级 B1 `[+ -ing verb]`＋语法专页＋Common mistakes 专条＋两张词表的 prepositional verb＋`To` 页与批十八同族同句），**本批只接手落地，不重新论证档位**。

> **一句话（生产单可抄）**：「**这是 B 档系列的最后一批——`look forward to` 已连续两批排候补第一，今天兑现；交付后候补池里不再有 B 档以上的项目。**」

**为什么是 5 课（三条理由，逐条）**：

1. **增量恰好 4 项 ＋ 收口 1 次**：① 认整块（`forward` 升格 ＋ 后面跟「东西」）；② **换人换形**（`I am looking` → `She looks`，**两个词变一个词**）；③ **盼的是做某事**（后面那件事穿名字版）；④ **说不和问**（`not` 跟 be 走、`Are` 搬句首）；⑤ 收口（零新知，两站排一行）。**每格一个真实增量。**
2. **第 6 课起无真实增量**——同骨架只能换名词（`party`／`birthday`），**破「一课一增量」**（瑞思 §3.1 丙方案逐条判 ❌；竞析 §4.1 同判）。
3. **单头结构，比批十八少 1 课**：批十八是 `be used to` ＋ `get used to` ＋ `used to` **三头并列**（6 课）；批二十是四词并列（6 课）；**本批是单头 `look forward to`**（`object to` 判 C，不上正课），故 **5 课**。

### 1.2 三研究结论与主理人裁决（含 L135/L136 次序裁决记录）

| 方案 | 三研究结论 | 主理人裁决 |
|---|---|---|
| **甲·`look forward to` 大章 5 课 L134–L138** | **三研究一致推荐**：瑞思 §0「推荐：L134–L138 五课大章」；数析 §8「可生产性：高」；竞析 §4.1「首选方案：大章 5 课」 | **✅ 拍板：甲 5 课单拱** |
| **乙·3 课小章（L134–L136）** | 竞析 §4.2 备选 A：**不推荐**（放弃「两站排一行」＝放弃收官） | ❌ 不做 |
| **丙·4 课（砍收口）** | 竞析 §4.3：**不推荐**（砍收口与「B 档收官批」定位直接冲突） | ❌ 不做 |
| **丁·6 课** | 瑞思 §3.1 丙方案 ❌、竞析 §4.1「不取 6 课」：第 6 课只能换名词 | ❌ 不做 |
| `object to` 上正课 | 三研究一致维持 **C**（`object` 全族双 0；无情感抓手；缺配套名词）；**竞析 §7 建议 3 补了一条「三引擎都真友好」的技术加分项，但仍不足以升档** | ❌ 不上正课（**连折入认读也不做**——本批 5 课容量已满，且它与「盼」不同族） |
| `have sth done` | 维持撤出（7 词全 0；`have my` GL 1 处不足以构成垫子） | ❌ 维持撤出 |
| 形容词＋介词 | 维持折卡（六族只覆 1/6：`good at` GL 52／HC 6） | ❌ 不单开 |
| 机制强化 | 维持 D（不做） | ❌ 不做 |

#### L135／L136 次序裁决记录（**三研究分歧处，以主理人裁决为准**）

| 项 | 竞析的方案 | 瑞思的方案 | **主理人裁决** |
|---|---|---|---|
| L135 | **「名字版」**（`seeing` 上场） | **「换人换形」**（`She looks forward to the summer.`） | **✅ 采纳瑞思** |
| L136 | **「切开课」**（东西 对 做事，零新知） | **「名字版」**（`I am looking forward to seeing you.`） | **✅ 采纳瑞思** |

**采纳瑞思的理由（一条硬事实，逐条写清）**：

- **`She looks forward to the summer.` 是本族唯一能把空位压回考点词的形式**。本 PRD 独立复刻 `grammarAmbushService.ts:195-213` 的 `pickClozeWord` 实跑 20 句：`I am looking forward to the weekend.` → 空位 **`am`**；`She is looking forward to the trip.` → 空位 **`is`**；`Are you looking forward to the summer?` → 空位 **`Are`**；**唯二落在考点词上的是 `She looks forward to the summer.` → 空位 `looks`**（`looks` 在 `GRAMMAR_WORDS` 表内 `:174`）与 `We look forward to the weekend.` → 空位 `look`；**`forward`／`looking` 成空位率 0/20 = 0%**（两词都不在表内）。
- **`looks` 是考点词**：本课的增量正是「前面换个人，那个词也跟着换」——**空位落在它身上＝考点被真考到**。
- → **L135 必须占据「考点承载课」这个位置**（`variants[0]` 逐字＝`She looks forward to the summer.`）；**「名字版」课不需要这个位置**（它的考点承载压在 `contrast` 与 `guided.spot` 上就够）。
- **同时采纳另外两条**：① **`forward` 已不是零**——L133 收官课已埋认读种子（`examples` 第 4 条 ＋ `contrast` ⑥ bothRight），**本批须写「认读升格」**（照搬批十九 L127 → 批二十的成例话术），**造词成本降为「造词 ＋ 认读升格」**；② **禁用词**：`trip`（GL 真词次 0，`trip` GL 1 处是 id 串 `hunt-trip-time`）／`holiday`（双 0）——**两词禁用**；**名词侧只用 `weekend`（9）／`summer`（3）／`party`（2）／`birthday`（152）**。

**竞析方案的可取处（不丢，折进 L134／L138）**：竞析要求「L136 切开课把 `Look at the clouds!`／`The sky looks dark.`／`I am looking forward to the weekend.` 三张脸同屏」——**本 PRD 的处置：三张脸同屏改在 L134 的 `contrast` 里做一次（第三张脸「入场即点名」），L138 收口课再做一次「两站排一行」**（切开位置从 L136 挪到 L134 ＋ L138，**内容一字不减**）。

### 1.3 批次定位：单拱大章 5 课；档位 B＋（诚实标注）

**单拱（判据沿用批十五起：单拱＝全批共享一条场景线）**。**本批是本系列第 4 个 5 课章**——**本 PRD 实读 `grammarSeasons.ts` 20 季的章长清单**：`12,12,10,7,5,3,5,6,6,5,4,3,8,8,8,8,8,6,3,6`（**第 21 季＝本批，长度 5**）；**此前三个 5 课季 ＝ season-5 `{42,46}`／season-7 `{50,54}`／season-10 `{67,71}`**——**故本批与本系列的三个先例同长**，**低于批十七 8 课／批十八 6 课／批二十 6 课**。

**场景线（单拱一句话）**：**「盼着的那一天」——从「我盼着周末」到「她盼着夏天」、「盼着见到你」、「你盼着吗」，最后两站排一行。**

`L134 书桌前翻日历（sparkle）` → `L135 窗边想夏天（mansion）` → `L136 校门口等人（campus）` → `L137 课间问同学（campus）` → `L138 本子最后一页排一行（sparkle）`。**scene 只用库内既有值**（实读在用 11 种：`mansion` 41／`campus` 35／`city` 22／`sparkle` 8／`school` 5／`island` 5／`train` 3／`mystery` 3／`magic` 2／`forest` 2／`snow` 1）——**本批取 `sparkle` 2／`mansion` 1／`campus` 2，不引入新场景 id**。

**档位标注（诚实标注，本批纪律——本批最重要的一条）**：

| 项 | 本批（批二十一） | 对照：批十八 | 对照：批二十 |
|---|---|---|---|
| 新造词 | **2 个**：`forward`（GL 2／HC 0）＋`seeing`（双 0） | 0 个（`used`／`used to` 有 L93／L100 垫子） | 3 个动词（全 0） |
| **认读升格** | **1 句**：`I am looking forward to the weekend.`（L133 种子位 2 处 → 本批转正） | — | — |
| 名词侧造词 | **0 个**（`weekend` 9／`summer` 3／`party` 2／`birthday` 152） | — | 0 个 |
| `-ing` 侧造词 | **1 个**（`seeing`；`looking` **零造词**——L27 `looking for` 十处教学句） | — | — |
| 结论 | **B＋｜造词 ＋ 认读升格**（须新造 `forward`／`seeing` 两词；`look forward to` 整串库内 0） | 「升格课：给已有句子发身份」 | 「造词课：3 个动词全造」 |

> **对外口径（本批必须遵守）**：写「**B＋ 档：须新造 `forward`／`seeing` 两个词；`look forward to` 整串在库内从未出现（GL 0／HC 0）；但 L133 已给过 2 次面熟（认读种子位，不进练习）——故本批的成本结构是「造词 ＋ 认读升格」，不是「零成本升格」，也不是「纯造词课」**」。**不得**写「库内有现成句子」、**不得**写「两文件全 0」（那会让生产单低估 1 处既有占用的对撞风险）。
> **折扣与增项并列（不得只写好话）**：折扣＝① `forward` 与 `seeing` **都是「不可替代」的**（`forward` 是本族的身份词，换掉就不是 `look forward to`；`seeing` 是「盼着做某事」的第一例）；② **cloze 假友好**（§4）；③ **`look` 观感风险**。增项＝① **名词侧零造词**（四个厚词全在库）；② **`looking` 零造词**（L27 十处教学句）；③ **接口最厚**——`I am used to getting up early.` 全句 GL 30 处、`getting up` GL 47 处（批十八的现成物件）；④ **cloze 有一解**（L135 的 `looks`）。

## §2 拆课方案与逐课规格

### 2.1 课量决策：5 课（L134–L138）——为什么不是 6 课

**容量账（逐条）**：

| 账 | 数 |
|---|---|
| **内容自然容量** | **5 格**：① 认整块（`forward` 升格 ＋ 后面跟「东西」）② **换人换形**（考点承载课）③ 盼的是做某事（名字版）④ 说不和问 ⑤ 零新知收口（两站排一行）。 |
| **增量数** | **4 项 ＋ 收口 1 次**（瑞思 §0 原文「增量恰好 4 项 + 1 次收口」）。 |
| **为什么不是 6 课** | **第 6 课无真实增量**——同骨架只能换名词（`party` 2／`birthday` 152）；且 `birthday` 与批十七 L117 的 `Grandma's birthday` 有交叠，**作主句会「批次串味」**（瑞思 §1④）。 |
| **为什么不是 3 课** | 砍掉「名字版侧」或「否疑」其一（瑞思 §3.1 甲方案代价）；**且会丢掉与批十八的「同族第二站」对照位**（竞析 §4.1 第 2 条）。 |
| **一课一增量检查** | L134（认整块＋升格）→ L135（换人换形）→ L136（名字版侧）→ L137（否疑）→ L138（零新知）。**五课五个落点，无一重复。** |
| **对标先例** | 批十八＝6 课（三头并列）；本批＝**单头**（`object to` 判 C 不上正课）——**故 5 课，比批十八少 1**。 |

**课表（课注 id 已冻结）**：L134 `lesson-134-looking-forward-to-the-weekend`｜L135 `lesson-135-she-looks-forward-to`｜L136 `lesson-136-looking-forward-to-seeing-you`｜L137 `lesson-137-are-you-looking-forward-to`｜L138 `lesson-138-two-stations`。**五个 id 已实读确认全库无冲突**（`grep 'lesson-13[4-8]' src/data/grammarLessons.ts` 无输出）。

**封面（数析 §6.3 唯一解 · 池内复用）**：`L134←cover17`｜`L135←cover18`｜`L136←cover19`｜`L137←cover20`｜`L138←cover21`。
- **实算依据（数析 §6.3）**：现有 **117 张图、133 次使用**（单次池 101 张 `cover17`–`cover117`／二用池 16 张 `cover1`–`cover16`／三用 0）；**二用张＝`cover1`–`cover16`，对应 L1–L16 ＋ L118–L133**；`cover1`–`cover16` 在 L134 处的 min-gap 仅 **1–16**（`cover16`→L133 是批二十刚落的最扎眼一张，gap 仅 1），**全部远低于 35 可用线**；`cover17`–`cover99` 共 83 张可用；**`cover100` 在 L134 的 gap ＝ 34，出局**。
- **最优指派＝min-gap 117，二分答案 ＋ 全枚举验证：同 min-gap 解数 ＝ 1（唯一）**——`cover17`（前次 L17 → 新用 L134）＝117；`cover18`（L18 → L135）＝117；`cover19`（L19 → L136）＝117；`cover20`（L20 → L137）＝117；`cover21`（L21 → L138）＝117。**本 PRD 已逐张实读封面资产确认 `lesson-17.jpg`–`lesson-21.jpg` 五张齐全（`src/assets/lessons/` 实读 117 张、编号连续）**。
- **瑞思 §2.4 的「语义优先互换」建议本 PRD 不采纳**：瑞思建议 `L134←cover18`／`L135←cover17`／`L136←cover21`／`L137←cover20`／`L138←cover19`（**集合相同、min-gap 不变**）——**本 PRD 按数析的唯一最优解逐位指派**（`cover17`→L134 起顺次），**理由**：① 五张 gap 全 117，**任何错位都会让 min-gap 从 117 掉到 116**（瑞思自己也写明这点）；② **瑞思的「语义相称」是基于 5 张图目视的主观判断，且其报告同时写着「建议指派（可互换，语义优先）」＝非硬需求**；③ **`cover` 在 `types.ts:590` 为可选字段，缺省回退 scene SVG，语义不匹配不阻断上线**。→ **写死：按 cover17–cover21 顺次指派；若生产期目视认为语义明显不符，唯一允许的池内换法是五张内部互换（集合不变），须登记且须同时登记 min-gap 变化**。
- **本批禁用**：❌ `cover1`–`cover16`（二用张，段距 1–16）；❌ `cover100`+（L134 的 gap ≤ 34，低于 35 线）；❌ `cover118`+ **资产不存在**（实读 `src/assets/lessons/` 共 117 张）。

**episode 写法**：`小美的一天 一百三十四`／`一百三十五`／`一百三十六`／`一百三十七`／`一百三十八`（末项实读 `:24952`「一百三十三」；**先例充足**：L103「一百零三」…L133「一百三十三」共 31 例）。

**scene 取值**：L134 `sparkle`（书桌前）→ L135 `mansion`（窗边）→ L136 `campus`（校门口）→ L137 `campus`（课间）→ L138 `sparkle`（本子最后一页）。**不引入新场景 id**。

### 2.2 逐课规格

> **通用说明（5 课共同）**：六段＝① 看（情景讲解）→ ② 跟（guided：choose／arrange／spot／replace）→ ③ 忆（recall）→ ④ 练（practice ≥4 题）→ ⑤ 破（侦探挑战＝huntCaseIds）；本批 5 课**全部配 recall**（`grammarLessons.test.ts:69-88` 对 `number >= 13` 硬断言三字段非空）。所有字段名与形态沿用 `types.ts:478-618`。**结构性参数沿用批十八／十九／二十逐课同规格**（实读 L119–L133 十五课全部一致）：`examples` 4 条／`contrast` 6 条（**其中 3 条带 `wrongMark`**）／`variants` 3 条／`practice` 5 条（≥4，含 1 道否定或疑问变体）／`guided` 6 条／`sceneSwings` 3 条／`dialogue` 3 行（2 npc + 1 me）／`huntCaseIds` 1 个。
> **全批话术纪律（本批最重要的一条）**：**`look forward to` 的语言学描述绝不能出现**——「**介词**」「**不定式**」「**动名词**」**三词全部命中本批核心**（29 词红线表含「介词」；批十八／十九额外禁词含「不定式」「动名词」），**且「宾语」「形容词」「副词」也在 29 词表内**。→ **三字段（`grammarLabel`／`oneLineRule`／`summary.rule`）一律改写成「一整个块」「后面跟的那件事」「一个 to 两张脸」「穿名字版」**（§6.3 替换表）。**⚠️ 本批额外禁「门牌」二字**（防与 L67 `:12363` 的 `at` 门牌串台——改用「**一整个块**」）。
> **⚠️ 读法说明（本表零术语自查的写法）**：下表「一句话规则」「对比卡方向」等单元格里，**每个字段值都放在开头的「」里**；**紧随其后的括注（零术语自查：……）／（生产红线：……）是给生产的元说明，不是字段内容**——括注里出现的「介词」「不定式」「宾语」等词是**被禁清单的列举**，不会写进 `grammarLessons.ts`。**生产时填入字段的只有第一对「」内的文字**（§8 G2-b 的机检口径：仅对三字段的实际值断言）。
> **全批 cloze 纪律（本批技术核心）**：**ambush 侧空位一律落 `am`／`is`／`Are`／`look`／`looks`**（本 PRD 独立复刻实跑 20 句，§4.1 逐课登记）；**`forward`／`looking`／`seeing` 成空位率 0%**。→ **考点承载一律压在 `contrast` 与 `guided.spot`（每课 ≥2 道）**；**L135 另加「保障句」`variants[0]`**。**本批不改 `grammarAmbushService.ts`／`grammarBoostService.ts`**（数析 §2.3 处置 ⑤）。
> **全批 `to` 纪律**：**`to` 是本批的身份词，不得回避**；但**严禁写出 `look to something` 作「期待」义**（Cambridge `word-patterns-look` 明文标错："Don't say 'look something' or 'look to something', say look at something"——竞析 CAM-10）；**`look forward to` 必须整体出现**（负清单第 1 条）。
> **全批新错型清单（本批要新造的两条）**：① **`to` 后面错跟原样**（`I am looking forward to see you.` ❌，`verb_form`）——**库里该方向恰好空着**（数析 §3.2：全库 17 处 `to + -ing` 错卡**全是「错跟名字版」方向**）；② **`Do` 与 `Are` 岔路**（`Do you looking forward to the summer?` ❌，`verb_form`）——**中文没有 be，最自然的错就是请错帮手**（瑞思 §3.4）；**③ 辅助两条**：漏 `be`（`missing_be`，`I looking forward…`／`She not looking forward…`）、漏 `the`（`article`，`to summer`）。

---

**L134 我盼着周末（认整块 · `forward` 认读升格 ＋ 第三张脸入场点名）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-134-looking-forward-to-the-weekend`；`number: 134`；episode「小美的一天 一百三十四」；scene `sparkle`；cover `cover17` |
| title / grammarLabel | 「我盼着周末」/「盼着那一天 · 一整个块记三个字（这个 look 不是看）」 |
| targetSentence | `I am looking forward to the weekend.`（7 词，≤8 ✓；**逐字取 L133 `:24969`（认读升格）**；**⚠️ cloze 实跑落 `am`**——本 PRD 独立复刻实跑：`I ___ looking forward to the weekend.` / `am`，见 §4.1） |
| sceneSetupZh | 晚上在书桌前：小美翻着桌上的小日历，手指停在周六那一格——她说我盼着周末。 |
| intentZh | 我盼着周末。 |
| 场景 | 书桌前：翻日历，盼着那一格快点到 |
| 新知识点 | **只有一件（两半，本课是本批唯一有「两半」的课）**：① **`look forward to` 是一整个块**——**三个字一起记**（不是 `look` ＋ `forward` 两个词各管一段）——`look`／`forward`／`to` **排一行不拆开**；**这个 `look` 不是看**（第三张脸入场点名：第 125 课的 `look` 后面跟「什么样」，第 127 课的 `Look at` 后面跟「去哪儿看」，**今天这个后面跟「要等的那件事」**）；② **前面站着 `am`**——`am` ＋ `looking` 两个词挤一挤（第 87 课 `It's` 的老办法），**`am` 不能丢**。⚠️ **本课不碰名字版侧**（`to` 后面先给名词 `the weekend`——**给「东西」不给「做的事」**，名字版是 L136 的）；**不碰否定疑问**（L137 的）；**`forward` 本课只升格、不作错项**（**认读升格，三条护栏见 §3.3**） |
| 一句话规则（oneLineRule） | 「说「我盼着那一天」：look forward to 是一整个块——三个字排一行一起记；前面站着 am（两个词挤一挤），后面跟要等的那件事——I am looking forward to the weekend。」（**零术语自查：三字段不得出现任何禁用词** ✓——**本课最易踩「介词」「不定式」「动名词」三词**，已按 §6.3 改写为「一整个块」「要等的那件事」） |
| 完课小结（summary.rule／points） | **rule**：「说「我盼着那一天」：look forward to 是一整个块，前面站着 am，后面跟要等的那件事（I am looking forward to the weekend）。」**points**：① `I am looking forward to the weekend.`——三个字排一行；② `I am look forward to the weekend.` ❌——盼着的那个词要穿 `-ing`（`look` → `looking`）；③ `I looking forward to the weekend.` ❌——`am` 不能丢。**三处均零术语** |
| 对比卡 6 条方向 | ① **真错卡（本课头号错 · wrongMark 条 1）**：`I am look forward to the weekend.` ❌（**`wrongMark: "look"`**，`verb_form`——**盼着的那个词要穿 -ing**；whyZh「前面站着 `am`，盼着的那个词要穿 `-ing`：`I am` 【`looking`】`forward to the weekend`。（第 133 课你见过这一句，当时只认脸——今天它转正了）」；**diffScore 需生产期逐字重跑登记**——本 PRD 复刻实算同型对 86）；② **真错卡（wrongMark 条 2）**：`I looking forward to the weekend.` ❌（**`wrongMark: "looking"`**，`missing_be`——**`am` 不能丢**；whyZh「**两个词挤一挤**（第 87 课的老办法）：`I` 后面要带上 `am`，少了它这句就散了——`I` 【`am`】`looking forward to the weekend`」；**⚠️ 生产红线：`wrongMark` 与案件 #143 ② 的 `original` 必须同指一个 token（`looking`）**，**不得写成 `"I"`**——`grammarBoostService.ts:699-706` 的 `locateMarkedTokens` 会把 `wrongMark` 在 `wrong` 句里定位成改错题的下标，**与案件侧 `original` 不一致会造成同一条错两种口径**）；③ **真错卡（wrongMark 条 3）**：`I am looking forward to weekend.` ❌（**`wrongMark: "weekend"`**，`article`——**要等的那个周末要带 the**；whyZh「**要等的那个周末是特定的那一个**——带上 `the`：`to` 【`the`】 `weekend`。（第 133 课那句就是这么写的）」；**薄档补血**，`article` 库内 28/22）；④ **双正解卡（换个人 · 本课展示面）**：`She looks forward to the weekend.` ✅ 并排 `I am looking forward to the weekend.` ✅（**bothRight，`wrongMark: null`**；whyZh「**两句都对——前面换个人，后面那个块一个字不动**：我盼着用 `I am looking`，她盼着用 `She looks`（下一课细说）」；**diffScore 实跑 57 < 90 ✓**——**本 PRD 以真 `diffService` 实跑留档**）；⑤ **双正解卡（与批十八同族第一站并排 · 跨批接口）**：`I am used to the cold.` ✅ 并排 `I am looking forward to the weekend.` ✅（**bothRight，`wrongMark: null`**；whyZh「**两句都对，同一个 `to`**：第 119 课那块说「习惯了」，今天这块说「盼着」——**同一个 `to`，两张脸**（第 138 课两站排一行）」；**diffScore 实跑 57 < 90 ✓**）；⑥ **双正解卡（第三张脸 · 与批十九切开）**：`It looks nice.` ✅ 并排 `I am looking forward to the weekend.` ✅（**bothRight，`wrongMark: null`**；whyZh「**两句都对——同一个 look 三张脸**：第 125 课后面跟「什么样」（`It looks nice.`），第 127 课后面跟「去哪儿看」（`Look at the clouds!`）——**今天这个 `look` 不是看**，后面跟的是「要等的那件事」」；**diffScore 实跑 0 < 90 ✓**）。**⚠️ 生产红线**：本课 **①②③ 三条带 mark**（过线不贴线）；**双正解三组实测 57／57／0，全部 < 90 ✓**；**⑥ 是本课与批十九的切开卡，`It looks nice.` 逐字取 L125 `:23407` 一字不改**；**登记项**：本课 `contrast` 含 `Look at the clouds!`（**只出现在 ⑥ 的 whyZh 文本里，不进任何 `wrong`／`correct` 字段、不进 practice**——**负清单纪律，见 `word-patterns-look`**） |
| 变体三态 | 肯定 `I am looking forward to the weekend.`（**cloze 实跑落 `am`——登记为「假友好」**，§4.1）／否定 `I am not looking forward to the summer.`（noteZh：「不」站在 `am` 后面——**`not` 跟 `be` 走**（第 123 课的老规矩）；**复跑确认落 `am` 第 ① 档**）／疑问 `Are you looking forward to the weekend?`（noteZh：**`Are` 搬句首**，别的都不动；**复跑确认落 `Are` 第 ① 档**）。**三句的「块」与「后面那件事」都不动**（否疑动的是前面） |
| 复现题设计（practice ≥4） | 第 1 题 target＋变体逐字题（**取疑问变体 `Are you looking forward to the weekend?`**，`grammarLessons.test.ts:11-29` 硬断言）；**第 2 题保障句 `We look forward to the weekend.`**（**⚠️ 本课第二保障句**：cloze 复跑落 **`look`** 第 ① 档——**这是本批仅两句能落考点词的形态之一**，§4.1；whyZh「**换一群人：`We` 配原样的 `look`**——后面的块一个字不动」）；第 3 题复现 L133 `:24969` 种子位原句（**本课是种子位转正——它已从「认读」升级为本批主句，可以直接进练习**；whyZh「第 133 课你见过它，当时只认脸——今天它转正了」）；第 4 题复现 L87 `:16163` `It's nice to see you.`（**cloze 实跑落 `see`**（`It's nice to ___ you.`——**⚠️ 本 PRD 独立复跑值，与「落 `It's`」的设计假设不同**）；**`see` 的既有句——认得的字，今天穿上名字版**，为 L136 的 `seeing` 铺路）；第 5 题复现 L42 `:7647` 一带的 `I like reading.`（cloze 落 **like**；**穿名字版的老规矩回流**，为 L136 铺路）。**每课 ≥1 复现题 ✓**。**⚠️ 生产红线**：本课 `examples` 取 target／`She looks forward to the weekend.`／`I am used to the cold.`／`It looks nice.` 四条；**`practice` 与 `examples` 的重合不得超过「5 题里最多 4 题」（`grammarLessons.test.ts:161-171` 断言「练习整组复用例句」为红）** |
| 案件规划 | `hunt-looking-forward-weekend`（**#143**，§9）；新错 **`verb_form`（`look` → `looking`）＋`missing_be`（`I looking…` → `I am looking…`）**；旧错 `tense`（L10 `:1782` 昨天版）＋`sv_agreement`（L19 `:3423`「一个用 was、一群用 were」） |
| 六段要点 | ① 开场**认读升格**（本课第一句就说清）：「第 133 课你见过这一句——当时只是认读、混个脸熟；**今天它转正了**」；② guided：`choose`（`I ___ looking forward to the weekend.` 选项 `am`／`is`／`are`，答案 `am`）／`arrange` ≤7 token（目标句）／`arrange`（复现 L133 `:24969` 原句——**升格兑现**）／**`spot`（`tokens: ["I", "am", "look", "forward", "to", "the", "weekend."]`，`wrongToken: "look"`**——**须与 tokens 元素逐字相等**；`answer: "look"`；`correctionZh`「前面站着 `am`，盼着的那个词要穿 `-ing`：【looking】。I am looking forward to the weekend。」——**本 spot 对准本课头号错（与案件 #143① 同型同词）**；**⚠️ 不得写成 `She am looking…`**——**`She` ＋ `am` 是 L135 的错型，本课提前用会与下一课撞车**）／`arrange`（复现 L87 `It's nice to see you.`）／`replace`（把 `I am` 换成 `We`，答案 `We are looking forward to the weekend.`）；③ recall 三字段（promptZh 给翻日历的场景、intentZh「我盼着周末。」、answer＝target、noteZh「look forward to 是一整个块——前面站着 am，后面跟要等的那件事」）；④ practice 5 题；⑤ 破 `hunt-looking-forward-weekend` |
| 术语红线自查 | 用「一整个块／三个字排一行／要等的那件事／两个词挤一挤／这个 look 不是看」；**禁「介词」「不定式」「动名词」「宾语」「形容词」「副词」**——**「介词」是本课头号陷阱**（谈 `to` 时最易写，已按 §6.3 改写）；**禁「门牌」**（防与 L67 串台） |
| 走查观察点 | **「认读升格」是否被读懂**（瑞思 §6 假设；走查问「第 133 课那句你见过吗、今天要不要学」——**正确反应是「见过，今天正式学」**）；**第三张脸是否被接住**（走查问「第 125 课的 `look` 和今天这个 `look` 是不是一个意思」——**正确反应是「同一个字，后面跟的东西不一样」**）；**反向风险**：学生是否把 `look forward to` 拆成两个词记（走查问「这三个字能不能拆开写别的」——**正确反应是「一起记、别拆」**） |

---

**L135 她盼着夏天（换人换形 · **cloze 考点承载课**）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-135-she-looks-forward-to`；`number: 135`；episode「小美的一天 一百三十五」；scene `mansion`；cover `cover18` |
| title / grammarLabel | 「她盼着夏天」/「换人换形 · 我盼着／她盼着（两个词变一个词）」 |
| targetSentence | `She looks forward to the summer.`（6 词，≤8 ✓；**⚠️ 本课是本批的 cloze 保障课**——本 PRD 独立复刻实跑：`She ___ forward to the summer.` / **`looks`**，**落点即考点词**（`looks` 在 `GRAMMAR_WORDS` 表内 `:174`），§4.2） |
| sceneSetupZh | 下午在窗边：外面太阳很好，小美看着窗台上的小盆栽——她说妹妹已经盼着夏天了。 |
| intentZh | 她盼着夏天。 |
| 场景 | 窗边：想着夏天，说别人盼什么 |
| 新知识点 | **只有一件**：**前面的词换人，「盼」的那个词跟着变**——`I am looking`（我盼着，两个词）→ **`She looks`（她盼着，一个词）**：**`-ing` 收回去、`s` 长出来**，后面的 `forward to the summer` **一个字不动**。**这是第 126 课「换人换形」的同一条老规矩落到新块上**（L126 `:23593` grammarLabel 逐字：「换人换形 · you look / she looks」）。**⚠️ 生产红线：本课不得讲「前面站谁它听谁的」**（那是 L122 `:22900` 批十八的内容，本批完全不讲——§5.2 分工表）。**本课新名词＝`the summer`**（GL 3 处；`in summer` 已在 L18 `:3311`／L25 `:4585` 教过；**`for the summer` 先例已有**，L46 `:8417`） |
| 一句话规则（oneLineRule） | 「说「她盼着那个夏天」：前面换个人，后面那个词也跟着换——她配带 s 的 looks（She looks forward to the summer）。**我盼着是两个词挤一挤（I am looking），她盼着是一个词（looks）——后面的块一个字不动。**」（**零术语自查 ✓**——**本课最易踩「第三人称」「三单」两词，一律写「她配带 s 的 looks」**） |
| 完课小结（summary.rule／points） | **rule**：「说「她盼着那个夏天」：前面换个人，后面那个词也跟着换（She looks forward to the summer）——我盼着是 I am looking，她盼着是 She looks，**后面的块不动**。」**points**：① `She looks forward to the summer.`——她配带 s 的 `looks`；② `She look forward to the summer.` ❌——她是单个的，要带小尾巴（第 25 课的老规矩）；③ `She am looking forward to the summer.` ❌——**她配 `is`，不配 `am`**（第 126 课的老规矩）。**三处均零术语** |
| 对比卡 6 条方向 | ① **真错卡（本课头号错 · wrongMark 条 1）**：`She look forward to the summer.` ❌（**`wrongMark: "look"`**，`sv_agreement`——**她是单个的，要带小尾巴**；whyZh「**她配带 s 的 `looks`**：`She` 【`looks`】`forward to the summer`。（第 126 课的老规矩：你配原样、她带 s）」；**⚠️ 本对 diffScore 实跑 92 ≥ 90——超线，禁止用作双正解**（本 PRD 实跑留档）；**本卡是错卡（非双正解），`diffScore` 门只对 `bothRight` 生效（`grammarBoostService.ts:744-753` 实读），故 92 不影响本卡**——**登记项：若生产期把它误配成双正解会被静默丢弃**）；② **真错卡（wrongMark 条 2）**：`She am looking forward to the summer.` ❌（**`wrongMark: "am"`**，`sv_agreement`——**她配 `is`，不配 `am`**；whyZh「**换了人，前面那个词要跟着换**：`She` 配 【`is`】——`She is looking forward to the summer`（第 126 课的老规矩）」；**diffScore 实跑 71 < 90**——**登记项：若生产期想把它改作双正解卡可用，但本 PRD 定稿为错卡**（错卡价值更高：它是「换人换形」的反面）；③ **真错卡（wrongMark 条 3）**：`She looks forward to summer.` ❌（**`wrongMark: "summer"`**，`article`——**要等的那个夏天要带 `the`**；whyZh「要等的那个夏天是特定的那一个——带上 `the`：`to` 【`the`】 `summer`」；**与 L134 ③ 同型回流，`article` 28/22 薄档补血**）；④ **双正解卡（同一个人、两种主语写法 · 本课展示面）**：`I am looking forward to the weekend.` ✅ 并排 `She looks forward to the summer.` ✅（**bothRight，`wrongMark: null`**；whyZh「**两句都对，块还是同一个块**：换个说法、换个人——我盼着用 `I am looking`，她盼着用 `She looks`」；**diffScore 实跑 43 < 90 ✓**）；⑤ **双正解卡（与批十九的 `looks` 切开 · 切割线在「后面跟什么」）**：`She looks tired.` ✅ 并排 `She looks forward to the summer.` ✅（**bothRight，`wrongMark: null`**；whyZh「**两句都对——同一个 looks，后面跟的东西不一样，说的就不是一件事**：`She looks tired.` 后面跟「什么样」（第 126 课），`She looks forward to the summer.` 后面跟「要等的那件事」（今天）」；**diffScore 实跑 33 < 90 ✓**；**⚠️ `She looks tired.` 是 L126 的既有句，须逐字取、一字不改**）；⑥ **双正解卡（复数主语 · 换人换形的第二格）**：`We look forward to the weekend.` ✅ 并排 `She looks forward to the summer.` ✅（**bothRight，`wrongMark: null`**；whyZh「**两句都对**：**一群用 `look`（不带 s）、她一个用 `looks`（带 s）**——换的是前面站的是谁」；**diffScore 实跑 58 < 90 ✓**）。**⚠️ 生产红线**：本课 **①②③ 三条带 mark**；**④⑤⑥ 实跑 43／33／58，全部 < 90 ✓**；**⚠️ 登记项**：**① 的对句 `She look forward to the summer.` 与正确句的 diffScore 实跑 92 ≥ 90**——**本 PRD 定稿为错卡（非双正解），而 `diffScore` 门只对 `bothRight` 条目生效**（`grammarBoostService.ts:744-753` 实读：`if (!contrast.bothRight) return;` 与 `if (similarity >= 90) return;` 是两条独立分支），**故 92 不影响本卡**；**但若生产期把它误配成双正解，会被静默丢弃——须逐条核 `bothRight` 标记** |
| 变体三态（**本课保障位，逐字写死**） | **肯定＝`She looks forward to the summer.`（复练 cloze 实跑落 `looks` ✅——考点词）**／否定＝`She is not looking forward to the summer.`（8 词 ≤8 ✓；noteZh「说「不」要请 `is` 站队——`not` 跟 `be` 走（第 123 课的老规矩）；**复跑确认落 `is` 第 ① 档**」）／疑问＝`Is she looking forward to the summer?`（7 词 ≤8 ✓；noteZh「**`Is` 搬句首**，别的都不动；**复跑确认落 `Is` 第 ① 档**」）。**⚠️ 三态的空位登记（本 PRD 实跑）**：肯定 **`looks`（考点词 ✓）**／否定 **`is`**／疑问 **`Is`**——**三态里只有肯定态落在考点词上**，**这正是 L135 被指定为「cloze 保障课」的技术含义（§4.2）** |
| 复现题设计（practice ≥4） | 第 1 题 target＋变体逐字题（**取疑问变体 `Is she looking forward to the summer?`**）；**第 2 题保障句＝本课肯定态 `She looks forward to the summer.`**（**重复一次、确保 cloze 落 `looks`**——**本课是唯一一课「保障句 ＝ target」的课**，理由：**全族只有这一句能落考点词**）；第 3 题复现 L134 上一课句 `I am looking forward to the weekend.`（cloze 落 **am**；**上一课回流**）；第 4 题复现 **`We look forward to the weekend.`**（cloze 落 **`look`**；**第二保障句——本批仅两句落考点词，另一句就是它**，§4.1）；第 5 题复现 L126 `:23598` `You look tired.`（cloze 落 **look**；**「换人换形」老规矩的正向回流**）。**每课 ≥1 复现题 ✓**。**⚠️ 生产红线**：本课 `examples` 取 target／`I am looking forward to the weekend.`（**第 134 课**）／`She looks tired.`（**第 126 课**）／`We look forward to the weekend.` 四条 |
| 案件规划 | `hunt-she-looks-forward`（**#144**，§9）；新错 **`sv_agreement`（`look` → `looks`）＋`article`（`summer` → `the summer`）**；旧错 `plural`（L11 `:1964` 复数）＋`sv_agreement`（L25 `:4528` 三单） |
| 六段要点 | ① 开场引 L126 `:23593`（「换人换形 · you look / she looks」——**逐字引用它的 grammarLabel 话术，但一字不改原课**）＋L134 的块；② guided：`choose`（`She ___ forward to the summer.` 选项 `looks`／`look`／`is looking`，答案 `looks`）／`arrange` ≤6 token（目标句）／**`spot`（`tokens: ["She", "look", "forward", "to", "the", "summer."]`，`wrongToken: "look"`**——**须与 tokens 元素逐字相等**；`answer: "look"`；`correctionZh`「她是单个的——要带小尾巴：【looks】。She looks forward to the summer.」）／`arrange`（复现 L126 `You look tired.`）／`arrange`（复现 L134 的目标句）／`replace`（把 `She` 换成 `We`，答案 `We look forward to the summer.`——**换人换形的第二格：一群用原样**）；③ recall 三字段（promptZh 给窗边想夏天的场景、intentZh「她盼着夏天。」、answer＝target、noteZh「前面换个人，后面那个词也跟着换——她配带 s 的 looks」）；④ practice 5 题；⑤ 破 `hunt-she-looks-forward` |
| 术语红线自查 | 用「换人换形／配带 s 的 looks／一群用原样／后面的块一个字不动」；**禁「第三人称」「三单」「主谓一致」**——**「三单」在本批的替换说法是「她配带 s 的 looks」，已逐字自查** |
| 走查观察点 | **cloze 保障是否生效**（**本批头号技术读数**：走查盯回访问卷里 `She ___ forward to the summer.` 的空位是不是 `looks`——**若落点在别处，说明 `GRAMMAR_WORDS` 或课序被改动，须即刻回流**）；**「两个词变一个词」是否被理解**（走查问「`I am looking` 换成 `She` 之后还剩几个词」——**正确反应是「一个词：looks」**）；**反向风险**：学生是否以为「`-ing` 永远不能和 `She` 一起用」（走查问「`She is looking forward to the summer.` 对不对」——**正确反应是「对——那是另一种说法」**） |

---

**L136 盼着见到你（盼的是做某事 · 后面那件事穿名字版）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-136-looking-forward-to-seeing-you`；`number: 136`；episode「小美的一天 一百三十六」；scene `campus`；cover `cover19` |
| title / grammarLabel | 「盼着见到你」/「盼的是做某事 · 后面那件事穿名字版」 |
| targetSentence | `I am looking forward to seeing you.`（7 词，≤8 ✓；**⚠️ cloze 实跑落 `am`**——`I ___ looking forward to seeing you.` / `am`，§4.1） |
| sceneSetupZh | 傍晚在校门口：小美在等好朋友，手里攥着两张电影票——她说我盼着见到你。 |
| intentZh | 我盼着见到你。 |
| 场景 | 校门口：等人，盼着见面的那一刻 |
| 新知识点 | **只有一件**：**`to` 后面从「东西」变成「一件事」**——上一课后面跟 `the weekend`（要等的那一天），**今天后面跟「见到你」这件事**；**那件事要穿名字版**：`see` → `seeing`（`I am looking forward to seeing you.`）。**⚠️ 生产红线（本批最要紧的一条）**：**本课不得重用批十八的「前面站谁它听谁的」话术**（L122 `:22900`）——**只做一次点名**（「第 120 课学过的那条规矩，今天换一件事」），**不得重讲**。**规矩的母版逐字见 L120 `:22519`**（`有 be 站着的 to，认名字版`）——**本课把它从「习惯了」换成「盼着」，其余一字不改**（这是「同族」而非「重复」的关键） |
| 一句话规则（oneLineRule） | 「盼的是「做某事」的时候，那件事要穿上名字版：I am looking forward to seeing you——**这条规矩你在第 120 课学过，今天换一件事**：上次跟的是「习惯了」，这次跟的是「盼着」。」（**零术语自查 ✓**——**「动名词」是本课头号陷阱**（谈 `seeing` 时最易写），已按 §6.3 改为「名字版」；**禁「宾语」「介词」「不定式」**） |
| 完课小结（summary.rule／points） | **rule**：「盼的是「做某事」：后面那件事穿名字版（I am looking forward to seeing you）——第 120 课那条规矩，今天换一件事。」**points**：① `I am looking forward to seeing you.`——那件事穿名字版；② `I am looking forward to see you.` ❌——**后面跟的是那件事，不是让人去做它**；③ `I am looking forward to the weekend.`（第 134 课）／`I am looking forward to seeing you.`（今天）——**一个跟「那一天」、一个跟「那件事」**。**三处均零术语** |
| 对比卡 6 条方向 | ① **真错卡（本课头号错 · 本批要新造的错型 · wrongMark 条 1）**：`I am looking forward to see you.` ❌（**`wrongMark: "see"`**，`verb_form`——**后面那件事要穿名字版**；whyZh「**后面跟的是「那件事」，不是让人去做它**——那件事要穿上名字版：`to` 【`seeing`】 `you`。（第 120 课那条规矩，今天换一件事）」；**⚠️ 本卡是本批最重要的新错型**：**数析 §3.2 实读全库 17 处 `to + -ing` 错卡，方向单一（全是「错跟名字版」）；「错跟原样」方向恰好空着**——**本卡把它填上**）；② **真错卡（wrongMark 条 2）**：`I am looking forward seeing you.` ❌（**`wrongMark: "forward"`**，`preposition`——**`to` 是这块的一部分，丢不得**；whyZh「**这块是三个字一起记**：`look` ＋ `forward` ＋ `to`——**丢一个就不成块了**：`looking` 【`forward to`】 `seeing you`」；**`preposition` 60/55 是本结构级必带**；**⚠️ 说明**：本卡与批十八 L120 ③（`:22474` `I am used getting up early.` 的「to 丢了」型）**形状相近但换词族**——**差异化落在「三个字一起记」这句本批自建话术上**，**不得照抄批十八的「有 be 站着的 to」**）；③ **真错卡（wrongMark 条 3）**：`I am looking forward for seeing you.` ❌（**`wrongMark: "for"`**，`preposition`——**用错小词**；whyZh「**这块是三个字一起记**：`look` ＋ `forward` ＋ `to`——`to` 不能换成 `for`：`looking forward` 【`to`】 `seeing you`」）；④ **双正解卡（穿名字版的老规矩回流 · 展示面）**：`I like reading.` ✅ 并排 `I am looking forward to seeing you.` ✅（**bothRight，`wrongMark: null`**；whyZh「**两句都对——后面那件事都穿名字版**：第 42 课那句 `reading`，今天这句 `seeing`——**换的是那件事，规矩是同一条**」；**diffScore 实跑 14 < 90 ✓**）；⑤ **双正解卡（同族第一站并排 · 跨批接口 · 本课脊柱卡）**：`I am used to getting up early.` ✅ 并排 `I am looking forward to seeing you.` ✅（**bothRight，`wrongMark: null`**；whyZh「**两句都对——同一个 `to`、后面都穿名字版**：第 120 课那句是「习惯了」，今天这句是「盼着」」；**diffScore 实跑 38 < 90 ✓**）；⑥ **双正解卡（`see` 的既有句 · 认得的字今天穿名字版）**：`It's nice to see you.` ✅ 并排 `I am looking forward to seeing you.` ✅（**bothRight，`wrongMark: null`**；whyZh「**两句都对**：第 87 课那句里的 `see`，今天穿上名字版变成 `seeing`——**认得的字，换一件衣服**」；**diffScore 实跑 0 < 90 ✓**）。**⚠️ 生产红线**：本课 **①②③ 三条带 mark**——**三条全落在「这块本身」上**（`see`／`forward`／`for`），**本课是全批考点密度最高的一课**；**双正解三组实测 14／38／0，全部 < 90 ✓**；**⚠️ 登记项**：**`I am looking forward to the weekend.` 并排本课 target 的 diffScore ＝ 71**（**可用但偏近，本课不用**——**L134 ④ 已用同一句作展示面**）。**⚠️ 卡号重排说明**：**本课 ④⑤⑥ 为三条双正解卡（与 L136 原稿的 ③④⑤ 相比整体后移一位）**——**生产期按本表编号落盘**。 |
| 变体三态 | 肯定 `I am looking forward to seeing you.`（**cloze 实跑落 `am`——假友好，登记项**）／否定 `I am not looking forward to seeing you.`（noteZh：「不」站在 `am` 后面——`not` 跟 `be` 走；**复跑确认落 `am` 第 ① 档**）／疑问 `Are you looking forward to seeing you?`（**⚠️ 语义不通，禁用**）→ **定稿疑问态＝`Are you looking forward to seeing me?`**（noteZh：**`Are` 搬句首**；**复跑确认落 `Are` 第 ① 档**；**⚠️ 主语换了、后面 `you` 要跟着换成 `me`**——**这是本课唯一的「跟着变」处，须在 noteZh 里点明**）。**⚠️ 变体三态的生产红线**：**疑问态的 `me` 是本批唯一一次「换了主语，后面也跟着换」**，**生产期须逐字核 `seeing me` 与 `seeing you` 不混用** |
| 复现题设计（practice ≥4） | 第 1 题 target＋变体逐字题（**取疑问变体 `Are you looking forward to seeing me?`**）；**第 2 题复现 L120 `:22441` `I am used to getting up early.`**（cloze 落 **am**；**「同族第一站」的正面接口——两块 `to`、同一条名字版规矩**；whyZh「第 120 课学过这条规矩——今天换一件事」；**⚠️ 本句是「点名复用」，不得改写、不得重讲规矩**）；第 3 题复现 **`I am looking forward to getting up early.`**（**⚠️ 生产红线：本句是 L138 收口课的主句（两站排一行），不得在 L136 提前用掉**）→ **定稿第 3 题＝复现 L87 `:16163` `It's nice to see you.`**（**cloze 实跑落 `see`**（本 PRD 独立复跑）；**`see` 的既有句——认得的字，今天穿上名字版**；whyZh「第 87 课那句里的 `see`，今天穿上名字版：`seeing`」）；第 4 题复现 L42 `:7647` 一带的 `I like reading.`（**cloze 实跑落 `like`**）；第 5 题复现 L134 的 `I am looking forward to the weekend.`（cloze 落 **am**；**「一个跟东西、一个跟做的事」的对照**）。**每课 ≥1 复现题 ✓**。**⚠️ 生产红线**：本课 `examples` 取 target／`I am used to getting up early.`（**第 120 课**）／`It's nice to see you.`（**第 87 课**）／`I like reading.` 四条；**`I am looking forward to getting up early.` 全批只在 L138 出现，L134–L137 不得提前使用** |
| 案件规划 | `hunt-looking-forward-seeing`（**#145**，§9）；新错 **`verb_form`（`see` → `seeing`）＋`preposition`（`for` → `to`）**；旧错 `tense`（L10 `:1782` 昨天版）＋`plural`（L11 `:1964` 复数） |
| 六段要点 | ① 开场**一次点名**（不重讲）：「第 120 课学过一条规矩——`to` 后面那件事要穿名字版；**今天换一件事**：上次跟的是「习惯了」，今天跟的是「盼着」」（**⚠️ 严禁展开讲「前面站谁它听谁的」**）；② guided：`choose`（`I am looking forward to ___ you.` 选项 `seeing`／`see`／`saw`，答案 `seeing`）／`arrange` ≤7 token（目标句）／**`spot`（`tokens: ["I", "am", "looking", "forward", "to", "see", "you."]`，`wrongToken: "see"`**——**须与 tokens 元素逐字相等**；`answer: "see"`；`correctionZh`「后面那件事要穿名字版：【seeing】。I am looking forward to seeing you.」——**⚠️ 本 spot 的 tokens 末项是 `"you."`（带尾标点），`wrongToken` 是中间元素 `"see"`（不带标点），逐字相等 ✓**）／`arrange`（复现 L120 `I am used to getting up early.`）／`arrange`（复现 L87 `It's nice to see you.`）／`replace`（把 `seeing you` 换成 `the weekend`，答案 `I am looking forward to the weekend.`——**把「那件事」换回「那一天」**）；③ recall 三字段（promptZh 给校门口等人的场景、intentZh「我盼着见到你。」、answer＝target、noteZh「那件事要穿名字版——这条规矩第 120 课学过，今天换一件事」）；④ practice 5 题；⑤ 破 `hunt-looking-forward-seeing` |
| 术语红线自查 | 用「那块／那件事穿名字版／三个字一起记／第 120 课那条规矩」；**禁「动名词」「介词」「不定式」「宾语」**——**「动名词」是本课头号陷阱**（讲 `seeing` 的类别时必写），**三字段已逐字自查** |
| 走查观察点 | **「那条规矩你学过」与「今天换一件事」的分工是否被读懂**（走查问「`to` 后面为什么要穿名字版——今天新学的吗」——**正确反应是「第 120 课学过规矩，今天换了一件事」**）；**`see` → `seeing` 的拼写是否过关**（**`seeing` 是本批新造词，双 0**——走查盯 `I am looking forward to see you.` 的改对率）；**反向风险**：学生是否以为「`to` 后面只能跟名字版、不能跟东西」（走查问「`I am looking forward to the weekend.` 对不对」——**正确反应是「对——那件事也可以是一天」**） |

---

**L137 你盼着吗（说不和问 · `not` 跟 `be` 走、`Are` 搬句首）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-137-are-you-looking-forward-to`；`number: 137`；episode「小美的一天 一百三十七」；scene `campus`；cover `cover20` |
| title / grammarLabel | 「你盼着吗」/「说「不」和问 · 这块自己带着 are，不用请帮手」 |
| targetSentence | `Are you looking forward to the summer?`（7 词，≤8 ✓；**⚠️ cloze 实跑落 `Are` 第 ① 档（idx0）**——`___ you looking forward to the summer?` / `Are`，§4.1） |
| sceneSetupZh | 课间在校园：同学说暑假要去外婆家，小美问她盼不盼——她顺口说了一句「我不太盼着考试」。 |
| intentZh | 你盼着夏天吗？ |
| 场景 | 校园：把「不」和「问」加到盼着的句子上 |
| 新知识点 | **只有一件**：**这块自己带着 `am`／`is`／`are`——问的时候自己搬句首就够了**（`Are you looking forward to the summer?`），**不用请 `Do` 来帮忙**；**说「不」时 `not` 站在 `are` 后面**（`I am not looking forward to the summer.`——**`not` 跟 `be` 走**，第 123 课的老规矩）。**⚠️ 本课的增量不是「`not` 跟 be 走」（那是第 123 课学过的，本课只点名不重讲）**——**增量是「`Do` 还是 `Are`」这条新岔路**：**中文没有 be，最自然的错就是请错帮手**（`Do you looking…` ❌）。**⚠️ 与批二十 L132 `Does it sound good?` 正面切开**：**那块自己没有 be（`sound` 是那个词自己站中间）→ 才请帮手 `Does`；今天这块自己带着 are → 它自己搬就够了**（L132 `:24564` 一带的 `Does it sound good?` 逐字引用） |
| 一句话规则（oneLineRule） | 「想说「你盼着夏天吗」：**这块自己带着 `are`——把它搬到句首就够了**（Are you looking forward to the summer?），**不用请 `Do` 来帮忙**。说「不」：`not` 站在 `am`／`is`／`are` 后面——I am not looking forward to the summer。」（**零术语自查 ✓**——**本课最易踩「助动词」「疑问句」「否定句」「语序」四词**，一律写「帮手 `Do`」「搬句首」「说「不」」；**禁「宾语」「介词」「不定式」**） |
| 完课小结（summary.rule／points） | **rule**：「问「你盼着吗」：这块自己带着 `are`，把它搬到句首就够了（Are you looking forward to the summer?）——**不用请 Do 来帮忙**。说「不」：`not` 站在 `are` 后面。」**points**：① `Are you looking forward to the summer?`——`Are` 搬句首；② `Do you looking forward to the summer?` ❌——**这块自己带着 `are`，不用请帮手**；③ `I am not looking forward to the summer.`——`not` 跟 `be` 走（第 123 课的老规矩）。**三处均零术语** |
| 对比卡 6 条方向 | ① **真错卡（本课头号错 · 本批要新造的错型 · wrongMark 条 1）**：`Do you looking forward to the summer?` ❌（**`wrongMark: "Do"`**，`verb_form`——**这块自己带着 `are`，不用请帮手**；whyZh「**这块自己带着 `are`**——问的时候把它搬到句首就够了，**不用请 `Do` 来帮忙**：`Are` `you looking forward to the summer?`（第 132 课那块自己没有 be，才要请 `Does`）」；**⚠️ 本卡是本批第二条新错型**——**中文没有 be，请错帮手是最自然的错**（瑞思 §2.2 病灶 ④））；② **真错卡（wrongMark 条 2）**：`I not looking forward to the summer.` ❌（**`wrongMark: "not"`**，`missing_be`——**`not` 要跟 be 走，`am` 不能丢**；whyZh「说「不」要**跟着 `be` 走**：`I` 【`am`】 `not looking forward to the summer`（第 123 课的老规矩：`I am not used to it.`）」；**薄档 `missing_be` 24/22 补血**）；③ **真错卡（wrongMark 条 3）**：`Are you looking forward to summer?` ❌（**`wrongMark: "summer"`**，`article`——**要等的那个夏天要带 the**；whyZh「要等的那个夏天是特定的那一个——带上 `the`：`to` 【`the`】 `summer`」；**本批 `article` 三度回流**（L134 ③／L135 ③／本课 ③）——**⚠️ 生产红线：`article` 连用三课，L138 不得再用**）；④ **双正解卡（说「不」与问并排 · 本课展示面）**：`I am not looking forward to the summer.` ✅ 并排 `Are you looking forward to the summer?` ✅（**bothRight，`wrongMark: null`**；whyZh「**两句都对——一个说「不」、一个在问**：**两样都是动前面那个词，后面那块一个字不动**」；**diffScore 实跑 63 < 90 ✓**）；⑤ **双正解卡（跨批切开 · 与批二十 `Does` 对照）**：`Does it sound good?` ✅ 并排 `Are you looking forward to the summer?` ✅（**bothRight，`wrongMark: null`**；whyZh「**两句都是问句，问法不一样**：第 132 课那块**自己没有 `be`**，要请 `Does` 来帮忙；今天这块**自己带着 `are`**——**它自己搬句首就够了**」；**diffScore 实跑 0 < 90 ✓**——**本批最安全的一组**；**⚠️ `Does it sound good?` 逐字取 L132，一字不改**）；⑥ **双正解卡（第 123 课回流 · `not` 跟 be 走）**：`I am not used to it.` ✅ 并排 `I am not looking forward to the summer.` ✅（**bothRight，`wrongMark: null`**；whyZh「**两句都对，都是「不」跟 `be` 走**：第 123 课那句是「不习惯」，今天这句是「不盼着」」；**diffScore 实跑 50 < 90 ✓**；**⚠️ `I am not used to it.` 逐字取 L123 `:23023` 一带，一字不改**）。**⚠️ 生产红线**：本课 **①②③ 三条带 mark**；**双正解三组实跑 63／0／50，全部 < 90 ✓**；**⚠️ 登记项（本 PRD 实跑，两条）**：**① ④ 的两句是「疑问 对 否定」（`Are you looking forward to the summer?` 对 `I am not looking forward to the summer.`）＝ 63**；**② 若把 ④ 改成「肯定 对 否定」（`I am looking forward to the summer.` 对 `…not looking forward to the summer.`）＝ 88**（**接近 90 但未越线**）——**本 PRD 定稿用 ① 的 63 版本**；**⚠️ 生产期若改成 ② 的版本，须把该对重跑登记（本 PRD 实跑 88，仍可上线）**；**⚠️ 另注：否定态的用词已由 `test` 改为 `summer`**——**`test` 在本批 GL 0（实读 `grep -oiw test` 无输出），属新词，不得引入**（**`the summer` 是 L135 的既有名词，零造词**） |
| 变体三态 | 肯定 `I am looking forward to the summer.`（cloze 实跑落 **`am`——假友好**，登记项）／否定 `I am not looking forward to the summer.`（noteZh：「不」站在 `am` 后面——`not` 跟 `be` 走（第 123 课的老规矩）；**复跑确认落 `am` 第 ① 档**）／疑问 `Are you looking forward to the summer?`（＝target；noteZh：**`Are` 搬句首**，后面那块一个字不动；**复跑确认落 `Are` 第 ① 档**）。**⚠️ 生产红线（硬断言口径）**：**target 就是疑问态**——`variants` 的「肯定」卡**必须写成 `I am looking forward to the summer.`**（短句化，cloze 落 `am`）；**练习第 1 题＝与 `variants` 非肯定卡逐字一致的变体题**——**本课取疑问卡 `Are you looking forward to the summer?`（与 target 同句，属合法设计**：`grammarLessons.test.ts:11-29` 要求「含一道与 variants 非肯定卡逐字一致的题」，**未禁止该句同时是 target**——**先例**：L127／L132／L133 收口课同一句既作 target 又作练习第 1 题**）** |
| 复现题设计（practice ≥4） | 第 1 题 target＋变体逐字题（**取疑问变体 `Are you looking forward to the summer?`**）；第 2 题否定句 `I am not looking forward to the summer.`（cloze 落 **am**；**说「不」的姿态**）；第 3 题复现 L123 `:23023` `I am not used to it.`（cloze 落 **am**；**`not` 跟 be 走的老规矩回流**）；第 4 题复现 L132 的 `Does it sound good?`（cloze 落 **Does**；**切开对照题——「帮手 vs 自己搬」**，**不重复讲、只并排**）；第 5 题复现 L135 的 `She looks forward to the summer.`（cloze 落 **looks**；**上一课回流 ＋ 本批唯一能落考点词的形态之一**）。**每课 ≥1 复现题 ✓**。**⚠️ 生产红线**：本课 `examples` 取 target／`I am not looking forward to the summer.`／`I am not used to it.`（**第 123 课**）／`Does it sound good?`（**第 132 课**）四条 |
| 案件规划 | `hunt-are-you-looking-forward`（**#146**，§9）；新错 **`missing_be`（`I not looking…` → `I am not looking…`）＋`verb_form`（`Do` → `Are`）**；旧错 `sv_agreement`（L19「一个用 was、一群用 were」）＋`sv_agreement`（L25 `:4528` 三单） |
| 六段要点 | ① 开场**跨批切开**（本批与批二十最重要的接口）：「第 132 课那块（`Does it sound good?`）**自己没有 be**，所以要请 `Does` 来帮忙；今天这块**自己带着 `are`**——它自己搬就够了」＋点名第 123 课的老规矩（**只点名不重讲**）；② guided：`choose`（`___ you looking forward to the summer?` 选项 `Are`／`Do`／`Is`，答案 `Are`）／`arrange` ≤7 token（目标句）／**`spot`（`tokens: ["Do", "you", "looking", "forward", "to", "the", "summer?"]`，`wrongToken: "Do"`**——**须与 tokens 元素逐字相等**；`answer: "Do"`；`correctionZh`「这块自己带着 are——把它搬到句首就够了：【Are】 you looking forward to the summer?」）／`arrange`（复现 L123 `I am not used to it.`）／`arrange`（复现 L132 `Does it sound good?`）／`replace`（把 `you` 换成 `she`，答案 `Is she looking forward to the summer?`——**换人 ＋ 换形 ＋ 搬家，三件事一起动**）；③ recall 三字段（promptZh 给课间同学说暑假的场景、intentZh「你盼着夏天吗？」、answer＝target、noteZh「这块自己带着 are——搬到句首就够了，不用请 Do」）；④ practice 5 题；⑤ 破 `hunt-are-you-looking-forward` |
| 术语红线自查 | 用「这块／自己带着 are／搬到句首／不用请帮手／说「不」」；**禁「助动词」「疑问句」「否定句」「语序」「现在进行时」**——**「疑问句」「否定句」两词在本课头号危险**（讲否疑时最易写），**已逐字自查**；**「现在进行时」在谈 `looking` 的形状时最易写**——一律写「两个词挤一挤」 |
| 走查观察点 | **「`Do` 还是 `Are`」这条新岔路是否被接住**（**本课核心读数**：走查盯 `Do you looking forward to the summer?` 的选错率）；**与批二十 `Does` 的切开是否生效**（走查问「第 132 课那句为什么请 `Does`、今天为什么不请」——**正确反应是「那块自己没有 be，这块自己带着 are」**）；**反向风险**：学生是否以为「`Do` 永远不能用」（走查问「`Do you like it?` 对不对」——**正确反应是「对——那块自己没有 be」**） |

---

**L138 同一个 to 的两站（收口 · 零新知 ＋ 两条切开）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-138-two-stations`；`number: 138`；episode「小美的一天 一百三十八」；scene `sparkle`；cover `cover21` |
| title / grammarLabel | 「同一个 to 的两站（收口）」/「收口 · 零新知（两站排一行）」 |
| targetSentence | 复现混排（**四句排一行，逐句 ≤8 词**）：`I am used to getting up early.`（**逐字取 L120 `:22441`**）／`I am looking forward to getting up early.`（**本批新句，L136 已埋钩子**）／`She looks forward to the summer.`（本批 L135）／`Are you looking forward to the summer?`（本批 L137）。**cloze 逐句实跑登记（本 PRD 复刻实跑）**：`I am used to getting up early.` 落 **am**（① 档）／`I am looking forward to getting up early.` 落 **am**（① 档）／`She looks forward to the summer.` 落 **looks（考点词 ✓）**／`Are you looking forward to the summer?` 落 **Are**（① 档）——**本课的保障句用 `She looks forward to the summer.` 与 `We look forward to the weekend.`** |
| sceneSetupZh | 书桌前：小美把本子翻到最后一页，把两章学过的句子排成两行——上一行是「习惯了」，下一行是「盼着」。 |
| intentZh | 同一个 to，两站排一行，我一次说清楚。 |
| 新知识点 | **无——章末零新知**（收口先例 L54 `:9823`／L78 `:14362`／L94 `:17400`／L102 `:18919`／L110 `:20418`／L118 `:22040`／L124 `:23217`／L133，**八代先例**；接口零字段新增）；**复现取材＝四句全部逐字取既有**（L120 一句 ＋ 本批 L135／L137 各一句 ＋ 本批新句一句，**一字不改**）；**不引番外 5 案**（`huntService.test.ts:215` 冻结名单）。**L138 是切开课**：① **与批十九 `look` 家族切开**（第三张脸）；② **与批十八「同族第二站」收口**（两站排一行） |
| 一句话规则（oneLineRule） | 「**同一个 to，两站排一行**：上一站是「习惯了」——`I am used to getting up early.`；下一站是「盼着」——`I am looking forward to getting up early.`。**同一个 `to`、后面都穿名字版，意思完全不同。**」（**零术语自查：三字段不得出现任何禁用词** ✓——**本课三字段是全批最危险的一处**（收口课谈「两站」时天然会写「介词」「动名词」），**已逐字自查：只出现「同一个 to，两站排一行」**） |
| 完课小结（summary.rule／points） | **rule**：「同一个 `to`，两站排一行：`I am used to getting up early.`（习惯了）／`I am looking forward to getting up early.`（盼着）——**后面都穿名字版，意思完全不同**。」**points**：① `I am used to getting up early.`——第 120 课那一站（习惯了）；② `I am looking forward to getting up early.`——今天这一站（盼着）；③ `She looks forward to the summer.`／`Are you looking forward to the summer?`——**同一块，换个人、换句话说**（第 135／137 课）。**三处均零术语** |
| 对比卡 6 条方向 | ① **真错卡（跨课回流 · 收口课的旧知回流出错卡，wrongMark 条 1）**：`I am looking forward to see you.` ❌（**`wrongMark: "see"`**，`verb_form`——**后面那件事要穿名字版**；**回流 #145 ①**；whyZh「第 136 课回流：后面那件事要穿名字版——`to` 【`seeing`】 `you`」）；② **真错卡（回流 · wrongMark 条 2）**：`She look forward to the summer.` ❌（**`wrongMark: "look"`**，`sv_agreement`——**她配带 s 的 `looks`**；**回流 #144 ①**；whyZh「第 135 课回流：她配带 s 的 `looks`」）；③ **真错卡（回流 · wrongMark 条 3）**：`Do you looking forward to the summer?` ❌（**`wrongMark: "Do"`**，`verb_form`——**这块自己带着 `are`，不用请帮手**；**回流 #146 ①**；whyZh「第 137 课回流：这块自己带着 `are`——`Are` 搬句首就够了」）；④ **双正解卡（本课脊柱卡 · 两站排一行 · 与批十八收口）**：`I am used to getting up early.` ✅ 并排 `I am looking forward to getting up early.` ✅（**bothRight，`wrongMark: null`**；whyZh「**两句都对——同一个 `to`、后面都穿名字版，意思完全不同**：上一站是「习惯了」（第 120 课），下一站是「盼着」（今天）——**排一行看，两块长得像，说的不是一件事**」；**diffScore 实跑 75 < 90 ✓**——**本批最接近线的一组，须逐条登记**；**⚠️ 依据**：Cambridge `To` 页把 `be used, get used, listen, look forward, object, reply, respond` **并列在同一句**（竞析 CAM-1 当场 HTTP 200 复取，`To as a preposition: after verbs` 节））；⑤ **双正解卡（第三张脸 · 与批十九 `look` 两张脸切开 · 与 L122「两张脸」区分）**：`It looks nice.` ✅ 并排 `I am looking forward to the weekend.` ✅（**bothRight，`wrongMark: null`**；whyZh「**两句都对——同一个 `look` 三张脸**：后面跟「什么样」（第 125 课）／后面跟「去哪儿看」（第 127 课）／**后面跟「要等的那件事」**（今天）——**同一个 `look` 三张脸，看的都是「后面跟的东西不一样」**」；**diffScore 实跑 0 < 90 ✓**；**⚠️ 本课须显式区分与 L122 的两张脸**——**L122 切的是 `to` 前面**（`used to` 对 `be used to`，有 be 没 be）；**本批切的是 `to` 后面**（跟东西 对 跟做的事），**两课不同轴**（§5.3 逐字稿））；⑥ **双正解卡（换人换形 · 本批内部收口）**：`She looks forward to the summer.` ✅ 并排 `I am looking forward to the weekend.` ✅（**bothRight，`wrongMark: null`**；whyZh「**两句都对**：换个说法、换个人——我盼着用 `I am looking`，她盼着用 `She looks`，**后面那块一个字不动**」；**diffScore 实跑 43 < 90 ✓**）。**⚠️ 生产红线**：本课 **①②③ 三条带 mark（全回流、锚本批）**；**双正解三组实测 75／0／43，全部 < 90 ✓**；**④ 的 75 是本批最高分**——**生产期须重跑登记，若 ≥ 90 则改用 `She is used to walking to school.` 并排 `She looks forward to the summer.`**（备选对，**差异更大更安全**）；**⚠️ 四句同屏上限照批二十口径（五句同屏为满），本课涉及四句，未满** |
| 变体三态 | 肯定 `I am looking forward to the weekend.`（cloze 落 **am**；noteZh「本批第一课那句」）／否定 `I am not looking forward to the summer.`（noteZh：`not` 跟 `be` 走；**复跑确认落 `am` 第 ① 档**）／疑问 `Are you looking forward to the summer?`（noteZh：`Are` 搬句首；**复跑确认落 `Are` 第 ① 档**）。**⚠️ 收口课纪律**：变体**只做一组三态**（**不得**给四句各做一套——**四套＝把一课变四课，破零新知红线**） |
| 复现题设计（practice ≥4） | 第 1 题 target＋变体逐字题（**取疑问变体 `Are you looking forward to the summer?`**，cloze 落 **Are**）；**第 2 题保障句 `She looks forward to the summer.`**（**cloze 实跑落 `looks` ✓**——把「考点词落点」在收口课再站一次）；**第 3 题保障句 `We look forward to the weekend.`**（**cloze 实跑落 `look` ✓**——本批仅两句落考点词，另一句就是它）；第 4 题复现 L120 `:22441` `I am used to getting up early.`（**上一站**，cloze 落 **am**）；第 5 题复现 L125 `:23407` `It looks nice.`（**第一张脸**，cloze 落 **looks**）；第 6 题复现 **`I am looking forward to getting up early.`**（**下一站——本课脊柱句**，cloze 落 **am**）。**6 题齐全、逐题 ≤8 词**（沿用 L124／L133 收口课 6 题形态）。**⚠️ 生产红线**：**`examples` 第 4 条放 L133 `:24969` 种子位原句**（`I am looking forward to the weekend.`）——**这次是「转正」的第二次确认**（种子位从 L133 的「认读」→ L134 的「正式内容」→ L138 的「你会的第一句」）；**⚠️ 但不得把 L133 那句作为「已学证据」引用**（竞析 §4.4 处理方式 7 的第 ② 条） |
| 案件规划 | `hunt-two-stations`（**#147**，§9）；**四点＝三点锚本批 ＋ 一点锚旧课**（照 L133／L142 收口案先例逐字同构）——① `see` → `seeing`（`verb_form`，**锚 #145①**）② `Do` → `Are`（`verb_form`，**锚 #146①**）③ `look` → `looks`（`sv_agreement`，**锚 #144①**）④ `apple` → `apples`（`plural`，**旧错 L11 `:1964`**）。**⚠️ 本课 `contrast` 三条错卡＝①②③ 全回流本批**（＃145①／#146①／#144①），**与案件四点用同一组锚点**（**收口课纪律：复现不讲新**） |
| 六段要点 | ① 开场**跨批倒带**：「第 120 课学过一站——「习惯了」；这一批学了另一站——「盼着」；**今天把两站排一行**」（不用讲新规则）；② guided：`choose`（`I am ___ getting up early.`——**⚠️ 本句两解（`used to`／`looking forward to`），禁用**）→ **定稿 `choose`（`She ___ forward to the summer.` 选项 `looks`／`look`／`is looking`，答案 `looks`）**／`arrange` ≤7 token（两站主句之一）／**`spot`（`tokens: ["I", "am", "looking", "forward", "to", "see", "you."]`，`wrongToken: "see"`**——**须与 tokens 元素逐字相等**；`answer: "see"`；`correctionZh`「后面那件事要穿名字版：【seeing】」）／`arrange`（复现 L120 `I am used to getting up early.`）／`replace`（「把上一站的 `used to` 换成下一站的，怎么变？」——**答案 `I am looking forward to getting up early.`**——**把「两站」做成一次动作**）；③ recall 三字段（promptZh 给本子最后一页排两行的场景、intentZh「同一个 to，两站排一行。」、answer＝`I am looking forward to getting up early.`、noteZh「同一个 to、后面都穿名字版——一站是「习惯了」，一站是「盼着」」）；④ practice 6 题；⑤ 破 `hunt-two-stations`；⑥ 总表卡（**m23 达成句同源**） |
| 术语红线自查 | 用「两站排一行／上一站／下一站／同一个 to／后面都穿名字版」；**禁「介词」「动名词」「不定式」「宾语」「形容词」「副词」**——**本课三字段是全批最危险的一处**（收口课谈「两站」与「同一个 to」时最易写「介词」「动名词」），**三字段已逐字自查：只出现「同一个 to，两站排一行」** |
| 本课定位说明（写进生产单） | **收口课但不是新知识课**：L138 的教学价值 ＝ **兑现「两站排一行」的对照动作**（把学生在批十八与本批练过的句子**请回来并排**），不是新增结构。**故 `grammarLabel` 不得写成新句型标签**（写作「收口 · 零新知（两站排一行）」，**不写「介词 to 大章收口」**——后者含红线词） |
| 中段自走查点 | **两站会不会串台**（走查问「`I am used to getting up early.` 和 `I am looking forward to getting up early.` 哪句是「习惯了」」）；**第三张脸是否被记住**（走查问「`Look at the clouds!` 和 `I am looking forward to the weekend.` 后面跟的东西一样吗」——**正确反应是「不一样：一个跟去哪儿看，一个跟要等的那件事」**）；**反向风险**：学生是否以为「两站能互换」（走查问「把 `used to` 换成 `looking forward to` 意思变不变」——**正确反应是「变——一个习惯了、一个盼着」**） |
## §3 造词与认读升格专章（脊柱一）

> **来源**：数析 §1 造词成本专章（本批核心）＋瑞思 §1①⑤⑥（`forward` 族逐形态实读、`-ing` 形式侧）＋竞析 §4.4（造词成本的处理方式七条）。**本 PRD 的逐词计数已用 `grep -oiw` 独立复验**（不经三研究的提取器）。

### 3.1 逐词成本实读（本 PRD 独立复验，两文件）

| 词 | GL（本 PRD 复验） | HC | 判定 | 本批处置 |
|---|---|---|---|---|
| **`forward`** | **2**（**两处同 1 句，全在 L133 种子位**：`:24969`／`:25009`） | **0** | 🟡 **不是绝对零——但也不构成「已教」**（不进 `practice`／`guided`／`recall`） | **L134 立岗 ＋ 认读升格**（§3.3） |
| **`seeing`** | **0** | **0** | 🔴 须新造 | **L136 造 1 次**（可被 L87 `:16163` `It's nice to see you.` 的 `see` 正向借力） |
| `looking` | **17** | 0 | ✅ **零造词**（**L27 `looking for` 占 10 处教学句**：`:4895`／`:4898`／`:4902`／`:4912`／`:4914`／`:4950`／`:4951`／`:5064`／`:5065`／`:13602`） | 直接使用（**推翻批二十路线图「`looking forward` 必造」中的 `looking` 部分**） |
| `weekend` | **12**（真词次 **9**：L15 `:2858`／L24 `:4506`／L29 `:5264`·`:5281`·`:5370`·`:5371`／L40 `:7301`／L49 `:8959`·`:8976`／L133 `:24969`·`:25009`；**3 处是 id 串**） | **8**（真词 5） | ✅ 零造词 | **L134 主名词**（且 L133 种子位本身就用它——**首尾同词、闭环**） |
| `summer` | **3**（L18 `:3311`／L25 `:4585`／L46 `:8417`） | **5** | ✅ 零造词 | **L135／L137 主名词**（`in summer` 已在 L18／L25 教过；`for the summer` 先例已有） |
| `party` | **2**（L57 `:10480`·`:10536`） | **2** | ✅ 可用（薄） | **只作换词位、不作新考点**（本批实际未用，登记为可用池） |
| `birthday` | **155**（真词次 **152**；3 处 id 串） | **12**（真词 9） | ✅ 厚词 | **本批不用**（**与批十七 L117 的 `Grandma's birthday` 有交叠，作主句会「批次串味」**——瑞思 §1④） |
| **`trip`** | **1**（**唯一一处是 id 串 `hunt-trip-time`** → **真词次 0**） | **2**（真词 1，`#66 :4183` token `"trip."`） | 🔴 **禁用**（GL 真词次 0） | **全批 0 次** |
| **`holiday`** | **0** | **0** | 🔴 **双 0，禁用** | **全批 0 次** |
| `getting up` | 47 | 16 | ✅ 厚（批十八的现成物件） | **L138 两站并排的核心物件**（与 L120 逐字同物件，同族对照最干净） |

**结论**：**本批的造词成本 ＝ 必造 1（`forward`）＋ 推荐造 1（`seeing`）＝ 总计 2 个词**；**名词侧零造词**（四个厚词全在库）。→ **对外一律写「B＋ 档：须新造 `forward` 与 `seeing` 两个词」**；**不得**写「库内有垫子」、**不得**写「零成本」、**不得**写「两文件全 0」。

> **⚠️ 一条诚实折扣（必须与增项并列写）**：`forward` 与 `seeing` **都是「不可替代」的**——`forward` 是本族的身份词（换掉就不是 `look forward to`），`seeing` 是「盼着做某事」的第一例（本批若只用名词侧，L136 就不成立）。**批十八当年是「库内有垫子 0 造词」，本批是「2 词必造 ＋ 1 句认读升格」——档位虽然更高（B＋），成本也确实更高**（瑞思 §3.2）。

### 3.2 「认读升格」的成例与本批的写法（逐字可抄）

**库内成例（实读逐条）**：

| 先例 | 原始认读位 | 升级课 | 升级话术（实读行号） |
|---|---|---|---|
| L14 → L59 | L14 认读 | L59 `well/fast` | `:10949` `// R8 跨课复现：第 14 课（认读种子转正——逐字拼一次）` |
| L78 → L92 | L78 `When it is sunny, I run in the park` 认读 | L92 `when 从句转正` | `:17175`「**第 78 课你见过 When it is sunny…（当时只是认读）——今天它转正了**」 |
| L68 → L84 | L68 感叹句认读 | L84 失物招领收口 | `:16019`／`:16038`「第 68 课的感叹句（多好的包啊）今天只认读」 |
| **L133 → 本批** | **L133 `I am looking forward to the weekend.`（`:24969` examples ＋ `:25009` contrast ⑥）** | **L134 ＋ L138** | **本批须写同款「认读升级」话术** |

**本批的话术母版（照搬 `:17175` 的句式，逐字可抄）**：

> 「**第 133 课你见过 `I am looking forward to the weekend.`（当时只是认读、混个脸熟）——今天它转正了：会自己说，还知道三个字要一起记。**」

**L133 种子位的原文（逐字抄出，生产期一字不改地引用）**：

- `:24969`（L133 `examples` 第 4 条）：`{ en: "I am looking forward to the weekend.", zh: "我盼着周末。（认读一句，混个脸熟）" }`
- `:25009`（L133 `contrast` 第 6 条）：`wrong: "I am looking forward to the weekend."` ＋ `wrongMark: null` ＋ `bothRight: true` ＋ `whyZh: "认读一句，混个脸熟：这句话说的是「我盼着周末」——今天只认脸，不学新花样（以后再说它）。"`

**⚠️ 三条护栏（本批最要紧的纪律，逐条写死）**：

1. **不得写「L133 已经教过」**——它**不在 `practice`／`guided`／`recall` 里，不构成「已教」**（瑞思 §1① 三条护栏实读复核：`guided` 六步 0 处 `forward`／`practice` 五题 0 处 `forward`／`recall.answer` 是 `It looks nice.`）。**正确表述是「你见过它、当时只是认读」**。
2. **不得改动 L133 一个字**（G14 零回归红线）——**升格＝在 L134／L138 里引用它，不是编辑原课**。
3. **升格后它就是正式内容**——**L134 的 `examples` 与 `practice` 可以逐字用它**（**这是「转正」，不是「复用旧考点」**）；**L138 可以把它当「你会的第一句」回引**，**但不得作为「已学证据」引用**（竞析 §4.4 处理方式 7 第 ② 条）。

### 3.3 「造词课怎么上」的三条硬纪律

1. **`forward` 单独占第 1 课（L134），不藏在长句里**——**`blocks` 必须把整块拆成可见部件**（沿用批十八 L119 的块状拆法），**建议三块**：`{ text: "I am looking", role: "我盼着（两个词挤一挤）" }`／`{ text: "forward", role: "朝前（新词·就往前面看）" }`／`{ text: "to the weekend", role: "朝着那个周末（要等的那件事）" }`。**`forward` 的中文意象用「往前面看」**（中文侧 `look-forward-to` 逐字：「look 为「看」，forward 為「向前地」，to 代表「朝著…」，所以 look forward to 整個意象就會是「往前面看」，類似成語所說的引頸期盼之意」——**竞析 EC-1，本轮当场 HTTP 200 复取**）；**⚠️ 禁引「引颈期盼」四字进三字段**（书面语负担），**只在 `deepDive` 里可用**。
2. **新旧比例硬纪律（沿用批十七–二十）**：**每课 `targetSentence` 里新词 ≤1**（L134＝`forward`，L136＝`seeing`，L135／L137／L138＝**0 个新词**）；**对比卡 6 条中至少 3 条的正确答案必须是库内词句**——本批逐课满足：L134 ④⑤⑥／L135 ⑤⑥（＋④）／L136 ③④⑤／L137 ④⑤⑥／L138 ④⑤⑥ 全部是库内老词句（`It looks nice.`／`She looks tired.`／`I am used to the cold.`／`I am used to getting up early.`／`I am not used to it.`／`Does it sound good?`／`I like reading.`／`It's nice to see you.` 均在库）。
3. **造词课档位诚实标注**（本批对外口径的核心）：**B＋ 档不得写成 A 档**；对外写「**B＋ 档：跨源有词典义项级 CEFR（B1 `[+ -ing verb]`）＋两个 Cambridge 专页 ＋ Common mistakes 专条 ＋ 两张词表的 prepositional verb ＋ `To` 页与批十八同族同句授权；但 BC 三档 68 课无课程位、Murphy 双册 TOC 无正文、我方只有 2 次面熟（L133 种子位，不进练习），须先造词架（本批只造 `forward` ＋ `seeing` 两词）**」。

> **⚠️ 本批的两条负清单（竞析 §9.3，防下游误用）**：
> ① **不得写 `look to something` 作「期待」义**——Cambridge `word-patterns-look` 明文标错（"Don't say 'look something' or 'look to something', say look at something"，竞析 CAM-10）；**`look forward to` 必须整体出现**。
> ② **不得写「`forward` 是 B1 词」**——**段位依据一律挂在 `look forward to something` 条（B1／B2）**，`forward` 单词本身无词典 CEFR 数据（竞析 §9.2 未核实 ⑥）。

## §4 cloze「假友好」的处置专章（脊柱二）

> **来源**：数析 §2（cloze 落点专章，16 句实跑）＋竞析 §7（三引擎复核）＋瑞思 §1⑧（`pickClozeWord` 逐字复刻 12 句实跑）。**本 PRD 独立复刻 `grammarAmbushService.ts:195-213` 的 `pickClozeWord` 实跑 20 句**（不经三研究的脚本），结果与数析／瑞思**逐字一致**。

### 4.1 ambush 侧逐句实跑（本 PRD 独立复刻，20 句）

**机制实读（`grammarAmbushService.ts:160-213`，逐字）**：① `GRAMMAR_WORDS`（**145 词条目／144 唯一词**，`look`／`looks` 在表内 `:174`；`am`／`is`／`are`／`was`／`were` 全在 `:166`）取 `findIndex` **第一个命中** → ② 实词回退（长度 ≥3 且非 `CLOZE_STOP_WORDS` 30 词） → ③ 第 2 词。**`forward`／`looking`／`seeing` 均不在表内** → **三词永不成空位**。

| 本批相关句 | 档 | 空位词 | 判定 |
|---|---|---|---|
| **`I am looking forward to the weekend.`**（L134 target） | **①** | **`am`** | ❌ **假友好**（落 be，非考点词） |
| **`She looks forward to the summer.`**（**L135 target**） | **①** | **`looks`** | ✅ **真友好**（**`looks` 在表内，落在考点词上**） |
| **`We look forward to the weekend.`**（L134／L135 保障句） | **①** | **`look`** | ✅ **真友好**（**本批仅两句落考点词**） |
| `I am looking forward to seeing you.`（L136 target） | **①** | **`am`** | ❌ 假友好 |
| `I am not looking forward to seeing you.`（L136 否定） | **①** | **`am`** | ❌ 假友好 |
| `Are you looking forward to seeing me?`（L136 疑问） | **①** | **`Are`** | ⚠️ 边界（落 be） |
| **`Are you looking forward to the summer?`**（**L137 target**） | **①** | **`Are`**（idx0） | ⚠️ 边界（落 be——**登记项**） |
| `I am not looking forward to the summer.`（L137 否定） | **①** | **`am`** | ❌ 假友好 |
| `I am looking forward to the summer.`（L137 肯定变体） | **①** | **`am`** | ❌ 假友好 |
| `She is not looking forward to the summer.`（L135 否定） | **①** | **`is`** | ❌ 假友好 |
| `Is she looking forward to the summer?`（L135 疑问） | **①** | **`Is`** | ⚠️ 边界 |
| **`I am used to getting up early.`**（L138 上一站） | **①** | **`am`** | ❌ 假友好 |
| **`I am looking forward to getting up early.`**（L138 下一站） | **①** | **`am`** | ❌ 假友好 |
| `I am looking forward to it.`（L134 备选肯定） | **①** | **`am`** | ❌ 假友好 |
| `I look forward to the weekend.` | **①** | **`look`** | ✅ 真友好（本批未用作 target） |
| `She looks forward to summer.`（L135 ③ 错卡的正确侧对照） | **①** | **`looks`** | ✅ 真友好 |
| `Is she looking forward to the summer?` | **①** | **`Is`** | ⚠️ 边界 |
| `I am looking forward to my birthday.`（备选） | **①** | **`am`** | ❌ 假友好 |
| `I am looking forward to the party.`（备选） | **①** | **`am`** | ❌ 假友好 |
| `He is looking forward to the summer.` | **①** | **`is`** | ❌ 假友好 |
| `We look forward to the weekend.` | **①** | **`look`** | ✅ 真友好 |

**量化结论**：**ambush 侧 20/20 全走第 ① 档**；**`forward` 成空位率 0/20 = 0%**、**`looking` 0/20 = 0%**、**`seeing` 0/20 = 0%**；**落考点词（`look`／`looks`）的仅 4 句 / 5 次**（`She looks forward to the summer.`／`She looks forward to summer.`／`We look forward to the weekend.` ×2／`I look forward to the weekend.`）。

### 4.2 四条处置（缺一不可，逐条落地）

| # | 处置 | 本批的具体做法 | 依据 |
|---|---|---|---|
| ① | **指定一课做「cloze 保障课」** | **L135 的 `variants[0]`（肯定）逐字 ＝ `She looks forward to the summer.`** → 复练 quiz 的 cloze **实跑落 `looks`（考点词）**；**该句同时是本课 `targetSentence`（本批唯一「保障句＝target」的课）** | 本 PRD 实跑（§4.1）；瑞思 §1⑧ |
| ② | **考点承载压在 `contrast` 与 `guided.spot`** | **每课 6 条 `contrast` 里 3 条带 `wrongMark` 的真错卡**，**全部对准本批新错**（L134：`look`／`I`／`weekend`；L135：`look`／`am`／`summer`；L136：`see`／`forward`／`for`；L137：`Do`／`not`／`summer`；L138：`see`／`look`／`Do` 回流）；**`guided` 六步里每课 1 道 `spot`**（点错词，**不走 cloze 通道**——实读 `LessonGuidedStep.kind: "spot"`） | 竞析 §7 建议 2；**G-boost 护栏 `grammarBoostService.test.ts:161-183` 已断言每课改错题 ≥2 道**——**这正是本批的救命通道** |
| ③ | **`practice` 里放「非 be 开头」的句子提密度** | `practice` 是**点词成句**（不走 cloze，实读 `LessonPracticeStep` 无 cloze 字段），**故 practice 是安全的密度位**——**L134 第 2 题 `We look forward to the weekend.`／L135 第 4 题同一句／L138 第 3 题同一句**（**本批「真友好」的落点全在 practice**） | 数析 §2.3 处置 ③ |
| ④ | **逐课登记实跑落点** | **本 PRD 已逐课登记**（§4.1 表 ＋ §2.2 逐课「变体三态」栏）：L134 肯定落 **`am`**（假）／L135 肯定落 **`looks`**（**真**）／L136 肯定落 **`am`**（假）／L137 疑问落 **`Are`**（边界）／L138 两站句落 **`am`**（假）。**「假友好」写在 L134／L136／L138 的生产单上**，避免生产期误以为 cloze 已在考 `forward` | 本 PRD §4.1 |

**一句话结论（写进生产单）**：**「cloze 是假友好」不是本批的缺陷，而是本批的设计前提**——**只要 L135 承担保障位、其余四课把承载压到 `contrast` 与 `spot`，本族的 cloze 反而变成「`am`／`is`／`are` 练手位」，与批十八（`I am used to …` 落 `am`）完全同构，学生不会有新的不适**（瑞思 §3.3）。

### 4.3 boost 引擎侧（不假，不必改）

**实读（数析 §2.2，252 组种子）**：boost 的 `keywordIndexes` 判据是「长度 ≥3 且不在 `FUNCTION_WORDS` 33 词内」（`grammarBoostService.ts:249-256`）——**没有 `GRAMMAR_WORDS` 那种「谓语优先」机制**，故 `looking`／`forward`／`weekend` 平权候选，`buildCloze` 用 `mulberry32(hashText('cloze:' + sourceRef))` 从中抽取。**`forward` 可落 22.6%–34.9%**（`I am looking forward to the weekend.` 29.4%／`I am not looking forward to the test.` 22.6%（**数析原句；本批不引 `test`——见下方注**）／`What are you looking forward to?` 34.9%）。

> **⚠️ 一条口径校正（竞析 §8-2，本 PRD 采纳）**：批二十把「`forward`／`looking` **永不成空位**」当优点写——**该表述只对 ambush 引擎成立**。**全仓有 3 个 cloze 引擎**：**A（关 2 回访问卷，ambush）**：不成空位；**B（Boost 选词填空）**：**会成空位**（且干扰项质量好）；**C（复习卡 `grammarReviewService.ts:217-236`）**：**会成空位**，**且干扰项生成器退化**（**实测 `forward` → `["forward","forwards","forwardes","forwarded"]`、`looking` → `["looking","lookings","lookinges","lookinged"]`**——**三个干扰项里至少两个不是英语词**）。→ **对外表述改为**：「**`look forward to` 的 cloze 有两种命运：在回访问卷里空位落在 `am`／`look`／`looks` 上；在 Boost／复习里可能落在 `forward` 上——两种都不是坏事，但复习引擎的干扰项当前会退化，须先修。**」

### 4.4 G-boost-d 双正解卡 diffScore 实跑登记表（本 PRD 以真 `diffService` 实跑）

**实跑方法**：`import { diffScore, compareText } from "src/services/diffService"`，`diffScore(compareText(correct, wrong, false))`（**`strictPunctuation = false`，与 `grammarBoostService.ts:748` 的调用逐字一致**；门线：`>= 90` 直接 `return`，静默丢弃）。

| 课 | 卡 | 句对（correct ／ wrong） | **diffScore** | 判定 |
|---|---|---|---|---|
| L134 | ④ | `I am looking forward to the weekend.` ／ `She looks forward to the weekend.` | **57** | ✅ |
| L134 | ⑤ | `I am looking forward to the weekend.` ／ `I am used to the cold.` | **57** | ✅ |
| L134 | ⑥ | `I am looking forward to the weekend.` ／ `It looks nice.` | **0** | ✅ |
| L135 | ④ | `She looks forward to the summer.` ／ `I am looking forward to the weekend.` | **43** | ✅ |
| L135 | ⑤ | `She looks forward to the summer.` ／ `She looks tired.` | **33** | ✅ |
| L135 | ⑥ | `She looks forward to the summer.` ／ `We look forward to the weekend.` | **58** | ✅ |
| L136 | ④ | `I am looking forward to seeing you.` ／ `I like reading.` | **14** | ✅ |
| L136 | ⑤ | `I am looking forward to seeing you.` ／ `I am used to getting up early.` | **38** | ✅ |
| L136 | ⑥ | `I am looking forward to seeing you.` ／ `It's nice to see you.` | **0** | ✅ |
| （登记） | — | `I am looking forward to seeing you.` ／ `I am looking forward to the weekend.` | **71** | ⚠️ 偏近，不用 |
| L137 | ④ | `Are you looking forward to the summer?` ／ `I am not looking forward to the summer.` | **63** | ✅ |
| L137 | ⑤ | `Are you looking forward to the summer?` ／ `Does it sound good?` | **0** | ✅ |
| L137 | ⑥ | `I am not looking forward to the summer.` ／ `I am not used to it.` | **50** | ✅ |
| L138 | ④ | `I am looking forward to getting up early.` ／ `I am used to getting up early.` | **75** | ✅（**本批最高分**） |
| L138 | ⑤ | `I am looking forward to the weekend.` ／ `It looks nice.` | **0** | ✅ |
| L138 | ⑥ | `I am looking forward to the weekend.` ／ `She looks forward to the summer.` | **43** | ✅ |

**⚠️ 已登记的越线对（≥90，**禁止用作双正解**）**：`She looks forward to the summer.` ／ `She look forward to the summer.` **92**（**此对是 L135 ① 的错卡，非双正解——`diffScore` 门只对 `bothRight` 生效**）。
**⚠️ 已登记的偏近对（可用但本批不用）**：**`I am looking forward to the summer.` ／ `I am not looking forward to the summer.` ＝ 88**（**「肯定 对 否定」差一个 `not`，接近 90**——**本批的双正解卡一律不并排「同句的肯定与否定」**；**L137 ④ 用的是「疑问 对 否定」的 63**）；`I am looking forward to seeing you.` ／ `I am looking forward to the weekend.` **71**；`I am looking forward to the summer.` ／ `I am looking forward to the weekend.` **71**；`Is she looking forward to the summer?` ／ `She looks forward to the summer.` **71**；`We look forward to the weekend.` ／ `She looks forward to the summer.` **58**。
**全 16 组上限 75 ✓（最高＝L138 ④ 的 75，未越线）**；**最低 0（L134 ⑥／L136 ⑤／L137 ⑤／L138 ⑤——四组跨批切开卡）**。

### 4.5 复习卡引擎 C 的工程修复（**前置项，与内容无关但须并行**）

**问题实读（竞析 §7.1／建议 1）**：`grammarReviewService.ts:217-236` 的 `buildClozeOptions` **对答案无条件加 `-s/-es/-ed/-ing/-d`**——**实测 `forward` → `["forward","forwards","forwardes","forwarded"]`**、**`looking` → `["looking","lookings","lookinges","lookinged"]`**、`weekend` → `["weekend","weekendes","weekended"]`。**`grammarBoostService.ts:273-277` 的修正注释已把病因与口径写死**（「只对**动词**做变形……形容词/名词加这些后缀会造出 `coldes`、`nursed` 这类不存在的词」；「**实测 22% 的 cloze 题有 ≥2 个这种干扰项，用户不懂语法也能一眼排除，题目失去意义**」），**但只修了 Boost 引擎，复习引擎未同步修**。

**⚠️ 本批的具体暴露面**：**`forward`（方向小词）与 `looking`（-ing 形式）一旦被轮转选中，选项里会出现 `forwardes`／`lookinges` 这类词**——**用户一眼排除，题目白送**。**这不是本批新增的问题，但本批是第一个「targetSentence 里含库外新词 ＋ 长 -ing 形式」的批次，暴露面最大。**

**处置（逐条）**：① **对齐 Boost 的已修版本（只对动词变形）**——**改一处函数（`grammarReviewService.ts:217-236`），可独立于本批内容先行**；② **若本批开工前来不及，须登记为「已知降级」并在遥测里单列**（**不得静默**）；③ **本批不改 `grammarAmbushService.ts`／`grammarBoostService.ts`**（数析 §2.3 处置 ⑤ 明写「不动词表，用通道组合解决」）。

### 4.6 逐课「保障句」清单（每课 ≥1，让主考点不落空）

| 课 | 保障句 | cloze 实跑落点 | 是否考点词 |
|---|---|---|---|
| **L134** | `We look forward to the weekend.`（第 2 题） | **`look`** | ✅ **是** |
| **L135** | `She looks forward to the summer.`（第 2 题 ＝ target） | **`looks`** | ✅ **是** |
| **L136** | ⚠️ **无——本课无「落考点词」的保障句**（**本课的保障改由 `contrast` ①②③ 三条 ＋ `spot` 承担**，三条 `wrongMark` 全落在块本身 `see`／`forward`／`for` 上） | — | — |
| **L137** | ⚠️ **无同型保障句**（**改由 `contrast` ①（`Do`）＋ `spot`（`Do`）承担**；**`Are` 是边界落点，登记项**） | — | — |
| **L138** | `She looks forward to the summer.`（第 2 题）＋ `We look forward to the weekend.`（第 3 题） | **`looks`／`look`** | ✅ **两句均是** |

> **⚠️ 一句诚实结论（写进生产单）**：**本批 5 课里只有 3 课（L134／L135／L138）能配出「落考点词」的保障句**；**L136／L137 无此形态**（因为它们的 `targetSentence` 是 `I am looking…`／`Are you looking…` 型，空位必落 `am`／`Are`）。→ **这两课的考点承载 100% 压在 `contrast` 与 `guided.spot` 上**（**L136 三条 mark 全在块上，是全批密度最高的一课；L137 两条 mark 在 `Do`／`not` 上**）。**这不是缺陷，是「假友好」下的必然分工**。

## §5 两条切开专章（脊柱三）

### 5.1 切开一：与批十九 `look` 家族（`look` 的第三张脸）

**风险形态（数析 §3.3 实读）**：`look` 家族全库 **375 处**（本 PRD 复验：`look` 小写 144 ＋ `Look` 大写 30 ＝ 174 词边界／`looks` 183／`looking` 17／`looked` 1），**L125–L133 九课占 351 ＝ 93.6%**。→ **本批再做 `look`，必须承认这是 `look` 的第四个连续批次**（批十九 `look + 什么的词` → 批二十 `look` 收口课 → **本批 `look forward to`**）——**若 L125–L138 连占，`look` 将连续 14 课在场**（数析 §3.3 形态红线）。**这是本批最大的观感风险，须用「切开设计」正面处理。**

**切开的三句（本批须同屏切开的三句，逐字）**：

| 脸 | 句子 | 后面跟什么 | 我方已教位置 |
|---|---|---|---|
| **第一张：什么样** | `It looks nice.`（**逐字取 L125 `:23407`**） | **后面跟「什么样」** | L125–L127（批十九已交付） |
| **第二张：去哪儿看** | `Look at the clouds!`（**⚠️ 只在 `whyZh` 文本里引用，不进任何 `wrong`／`correct` 字段、不进 practice**） | **后面跟「去哪儿看」** | L127 已认读并切开 |
| **第三张：盼着的那件事（本批新增）** | `I am looking forward to the weekend.` | **后面跟「要等的那件事」** | **L133 认读种子位 → 本批 L134 转正** |

**切法（三条准则，逐条给依据）**：

1. **用「后面跟什么」切，不用「`look` 有几种意思」切**——依据：Cambridge 把 `look + 什么的词`（`Look as a linking verb` 节）与 `look at`（独立页）与 `look forward to`（**`Verb patterns` 与 `Prepositional verbs` 两个页**）**分页分体系**（竞析 §6.2）；**中文侧的第二判据「谁做的」在 `look` 与 `look forward to` 上不管用**（两句的 `look` 都不是人做的动作）。
2. **必须显式声明与 L127 的分工**——**L134 的 `contrast` ⑥ 的 `whyZh` 逐字引用 L127 `:23800` 的话术母版**（「**后面跟的东西不一样，说的就不是一件事**」——**这是 L127 `oneLineRule` 的逐字原句**），并把第三张脸接上。**⚠️ L127 原文是「两张脸」，本批说「三张脸」——必须点明「今天多了第三张」**。
3. **`look like` 本批零扩 ＋ 负清单**：**不得写出 `look to something` 作「期待」义**（Cambridge `word-patterns-look` 明文标错）；**`look like` 只在 L127 认读（`It looks like rain.`），本批不引入新句**（**本批全批 `look like` 命中 0 次**）。

### 5.2 切开二：与批十八「同族第二站」（L138 收口）

**上游授权（本批最硬的一条原文，竞析 CAM-1 本轮当场 HTTP 200 复取）**：

> "Some verbs are followed by the preposition **to**, including **be used, get used, listen, look forward, object, reply, respond**: We listened to that CD you lent us. It's great. **I object to your remarks.** The bank hasn't replied to my letter yet." —— Cambridge `grammar/british-grammar/to`，`To as a preposition: after verbs` 节

→ **上游在同一句里把批十八（`be used`／`get used`）与本批（`look forward`）并列**；**Murphy 中级册**：`60 Preposition (in/for/about etc.) + -ing`／**`61 be/get used to`**／**`62 Verb + preposition + -ing`**——**批十八在 U61，本批属 U62，两课相邻**（竞析 §1.3 实读 TOC 去空白还原）——**「相邻单元」本身即「同族」的第二条教材级证据**。

**L138 的两站排一行（逐字句对）**：

| 站 | 句子 | 意思 | 出处 |
|---|---|---|---|
| **上一站** | `I am used to getting up early.` | **习惯了** | **逐字取 L120 `:22441`**（`I am used to getting up early.` 全句 GL **30 处**，`getting up` GL **47 处**——**同族第一站的物件已在库且极厚**） |
| **下一站** | `I am looking forward to getting up early.` | **盼着** | **本批 L138 新句**（**同一个 `to`、同一个名字版 `getting`、意思完全不同**） |

**⚠️ 本批与批十八的逐项分工（防重复自查表，写进生产单）**：

| 维度 | 批十八已做（L119–L124） | 本批做（L134–L138） | 重叠风险 | 处置 |
|---|---|---|---|---|
| `to` 后面穿名字版 | **L120 `:22446` 逐字教过**（`后面那件事要换名字版（穿 -ing）`） | **不新教这条规矩**——L136 只做**一次点名复用** | **高** | **L136 的 `oneLineRule` 必须写「这条规矩你在第 120 课学过，今天换一件事」**，**并写进 `deepDive`**；**严禁展开讲「前面站谁它听谁的」（L122 `:22900`）** |
| 「前面站谁它听谁的」 | **L122 `:22900` 逐字教过** | **完全不讲** | — | **本批只讲「前面换一个词，整张脸就换了」（`I am looking` → `She looks`）** |
| 「同一个 `to` 两张脸」话术 | **L122 已用**：切的是**前面**（有 be 没 be） | **L138 切的是后面**（跟东西 对 跟做的事） | **高（同一句标语，不同轴）** | **L138 的 `oneLineRule` 必须点明轴不同**（§5.3 逐字稿） |
| 「门牌」话术 | — | **L67 用 `at` 作门牌**（`:12363` `at 是它的门牌，门里穿名字版`） | ⚠️ **会串台** | **本批不用「门牌」二字**（避免「`at` 门牌 vs `to` 门牌」两套串台）；改用 **「一整个块」** |
| 否疑（说不和问） | **L123 `:23023` 已做**（`I am not used to it.`／`Are you used to it?`） | **L137 做 `not` ＋ `Are`** | **中** | **L137 只补「`Do` 还是 `Are`」这条新岔路**；**骨架直接声明「第 123 课那套」，不重讲「`not` 跟 be 走」** |
| 收口方式 | **L124 收口**：`be used to` 家族四句排一行（**章内收口**） | **L138 收口**：**跨批**两站排一行 | **低** | **L138 是本批独有增量**（**本项目第二次「两批同族收口」，第一次是批十八内部的 L124**）——**必须写明与 L124 的分工：「第 124 课把这一章四句排一行；今天把两章排一行」** |

### 5.3 L138 与 L122 的「两张脸」不同轴（**须在 oneLineRule 里点明的逐字稿**）

**L122 `:22851` 的原文（逐字）**：

> 「加不加 be，是两张脸：有 be 是「习惯了」——She is used to working late；没 be 是「从前常」——She used to work late（后面穿原样）。错在这句两头都占：既没有 be，又穿了名字版。」

**L122 `:22900` 的总规则（逐字）**：

> 「同一个 to，前面站谁它听谁的：前面站 used（从前的记号）→ 后面穿原样；前面站 am／is／are／get（习惯记号）→ 后面穿名字版。一个 to，两张脸。」

**L138 的 oneLineRule 定稿（逐字稿，生产可直接抄）**：

> 「同一个 `to`，两站排一行：上一站是「习惯了」（`I am used to getting up early.`），下一站是「盼着」（`I am looking forward to getting up early.`）——**同一个 `to`、后面都穿名字版，意思完全不同**。**第 122 课切的是 `to` 前面**（有 be 没 be）；**今天切的是 `to` 后面**（跟东西 还是 跟做事）——**两课切的是不同的地方**。」

**三条配套硬纪律**：

1. **`to` 前面的事本批一律不提**——**本批不重讲「介词」这个概念**（批十八 L120 已用「有 be 站着的 `to`，认名字版」讲过；**再讲一遍＝把 L120 重上一次**）。**依据**：零术语红线含「介词」（`grammarZeroTerms.ts:29`）——**批十八已绕过它，本批沿用同一绕法**。
2. **`I am used to getting up early.` 一字不改**（G14 零回归红线）——**切开＝在 L138 里引用它，不是编辑原课**。
3. **`deepDive` 必写第三段**（切开的落地位）：「第 124 课把这一章四句排一行；**今天把两章排一行**——第 120 课那一站是「习惯了」，今天这一站是「盼着」：**同一个 `to`、后面都穿名字版，意思完全不同**。」**缺此段则 L138 会退化为「顺手复习批十八」，与 §10 Non-goals 冲突**。

**⚠️ 术语红线：本批危险词逐条替换（§5 专用表）**：

| 危险词 | 在 29 词表内？ | 本批最易踩的课 | 替换话术（沿用库内既有体系 ＋ 本批自建） |
|---|---|---|---|
| **介词** | ✅ 在（红线） | **L134／L135／L136／L138（讲 `to` 时）** | 「**一整个块**」（本批自建，**不用「门牌」防串台**）／「后面跟的那件事」 |
| **不定式** | ❌ 不在 29 词表内——**但批十八／十九 PRD 列为额外禁词，本批同样禁** | **L136（讲 `want to` 与 `look forward to` 切开时）** | 「**原样**」（L68／L93 既有话术） |
| **动名词** | ❌ 同上，批十八／十九额外禁词 | **L136／L138（讲 `seeing`／`getting` 时，最易写）** | 「**名字版**」（L42／L43 既有体系；L120 已用「穿名字版」） |
| **宾语** | ✅ 在（红线） | **L135／L137（讲「后面跟的东西」时）** | 「**后面跟的那个东西**」「要等的那件事」 |
| **形容词／副词** | ✅ 在（红线） | **本批低风险**（本批不教这两类） | — |
| **第三人称／三单** | ✅ 在（红线） | **L135（讲 `looks` 时）** | 「**她配带 s 的 looks**」「一群用原样」 |
| **时态／现在进行时** | ✅ 在（红线） | **L137（`I'm looking forward to…` 是进行式形态，最易写「现在进行时」）** | 「**两个词挤一挤**」（L87 `:16145` `两个词挤一挤 · It's` 的既有话术） |
| **疑问句／否定句** | ✅ 在（红线） | **L137（全课）** | 「**说「不」**」「**问就把 `Are` 搬句首**」（L25 `:4562`／L123 既有） |
| **门牌** | ⚠️ **不在 29 词表内，但本批额外禁**（防与 L67 的 `at` 门牌串台） | **L134／L138** | 「**一整个块**」 |

## §6 中文负迁移处理专章（逐课）

> **来源**：瑞思 §2.2（中文侧「盼」的四条真实病灶）＋竞析 §1.4（中文侧 `look-forward-to` 两篇专文，**本轮当场 HTTP 200 复取**）＋数析 §1。**⚠️ 诚实标注**：`grammarZeroTerms.ts` 与库内**均无**「盼」的既有教学内容（`盼` 仅 2 处、都在 L133 种子位）——**四条病灶是瑞思按中文侧表达习惯归纳的推断（推断，非实读）**；**但 ③ 的形状（`be` ＋ `-ing` 两词挤一挤）有库内实读支撑**（L87 `:16145`「两个词挤一挤 · It's」）。

### 6.1 中文侧四条病灶 → 本批落点（逐条给原词与修正）

| # | 中文说法 | 学习者会造出的英文 ❌ | 病灶（中文思维） | **落点课 ＋ 原词／修正** |
|---|---|---|---|---|
| ① | 我盼着**周末** | `I am looking forward to see the weekend.`＊ ／ `I look forward to the weekend.`（漏 `-ing`） | **「盼」后面跟的是「一件事」，中文不区分「做」和「做的事」** | **L136**；❌ `I am looking forward to see you.` → ✅ `…to seeing you.`（**`wrongMark: "see"`**，`verb_form`） |
| ② | 我盼着**你来** | `I am looking forward to you come.`／`I am looking forward to come.` | **中文「盼着你来」是「人 + 动作」两段，英语要把动作整块穿上名字版** | **L136**；**同上卡（合并处理）**——**⚠️ 本批不为 ② 单开错卡**（`you come` 型的错会引入从句概念，**红线**）；② 的处置＝**在 `deepDive` 里点名「那件事要穿名字版，后面不另起一句」** |
| ③ | 我盼着周末 | `I am look forward to the weekend.`（漏 `am`）／`I looking forward to the weekend.`（漏 `am`） | **中文「盼着」是一个动词，英语是「`be` ＋ `looking`」两个词挤在一起**（与批二十 L133「两个词挤一挤」同型） | **L134**；❌ `I am look forward to the weekend.` → ✅ `…am looking…`（**`wrongMark: "look"`**，`verb_form`）／❌ `I looking forward to the weekend.` → ✅ `I am looking…`（**`wrongMark: "looking"`**，`missing_be`） |
| ④ | 我盼着周末（问句） | `I am looking forward to the weekend?`（**只用升调、不搬词**）／`Do you looking forward to the summer?`（**请错帮手**） | **中文问句靠「吗」和升调，不需要搬家；且中文没有 be，最自然的就是请 `Do`** | **L137**；❌ `Do you looking forward to the summer?` → ✅ `Are you looking forward to the summer?`（**`wrongMark: "Do"`**，`verb_form`） |

> **⚠️ 补充落点（本批新增的第 5 条）**：**「一群人 vs 一个人」的 `-s`**——中文动词不变形，**「她盼着」和「我盼着」在中文里一个字都不差**。→ **L135**：❌ `She look forward to the summer.` → ✅ `…looks…`（**`wrongMark: "look"`**，`sv_agreement`）。

### 6.2 中文侧原文（可直接引用的三条）

| 用在哪 | 原文（逐字） | 出处 |
|---|---|---|
| **L134 的「为什么人会错」话术底本** | 「**不管你答對還答錯，都別小看這裡的 to，很多人一看到 to 就會反射動作加上原形動詞**」 | english.cool `look-forward-to`（**竞析 EC-1，本轮当场 HTTP 200 复取**） |
| **L134 的 `forward` 词源意象（`deepDive` 用）** | 「look 為「看」，forward 為「向前地」，to 代表「朝著…」，所以 look forward to 整個意象就會是「**往前面看**」，類似成語所說的**引頸期盼**之意」 | 同上 |
| **形式标注（`blocks` 排布依据）** | `look forward to + N/Ving` | english.cool `look-forward-to-2`（竞析 EC-2） |

**⚠️ 三条引用红线**：① **「介系詞」「動名詞」「原形動詞」三词一律不引**（它们是中文侧的术语，**「介词」「动名词」都在红线表或额外禁词表内**）——**只用「很多人一看到 to 就会反射动作加上原形动词」这个「现象描述」**，**改写成「一看到 `to`，手就自动去写原样」**；② **不得引 EC-1 的信尾正式度四档**（`I look forward to your reply.` ＞ … ＞ `Looking forward to your reply.`——**零基础用户不需要「正式度排序」，且会引入「书信体裁」场景负担**，竞析 §9.3 负清单）；③ **不得引 `expect`／`anticipate`**（`anticipate + Ving` 属同族第三词，**超纲**——竞析 §9.3）。

### 6.3 零术语红线与替换表（本批最容易越线的三个词）

**红线词表实读**：`grammarZeroTerms.ts:16-25` ＝ **29 词**（主语／谓语／宾语／表语／定语／状语／单数／复数／三单／原形／时态／一般过去时／一般现在时／现在进行时／过去进行时／现在完成时／情态动词／比较级／最高级／从句／语序／可数／疑问句／否定句／被动语态／第三人称／形容词／副词／**介词**）；守门断言在 `grammarLessons.test.ts:105`（`grammarLabel`）／`:114`（`oneLineRule`）／`:123`（`summary.rule`）／`:200-218`（**AI 引用源三字段**：`contrast.whyZh`／`guided.explain`／`recall.noteZh`）。

**本批三个高危词（逐条给替换，这是全批最容易翻车的地方）**：

| 高危词 | 为什么高危（本批最易在哪一课写出来） | 本批替换说法 | 出处 |
|---|---|---|---|
| **「介词」** | **`look forward to` 的语言学描述就是「介词 to」**——**L134／L135／L136／L138 四课都在讲这块**，**随手就会写** | 「**一整个块**」「三个字排一行」「后面跟的那件事」 | **本批新增**（**不用「门牌」——防与 L67 `:12363` 的 `at` 门牌串台**） |
| **「不定式」** | **本批的核心对比就是「`to` 后面跟原样 vs 跟名字版」**——**L136 讲 `see` → `seeing` 时最易写「不定式」** | 「**原样**」「让人去做它」（L68／L93 既有话术） | L93 `:17362`「to 后面永远穿原样」（**既有**） |
| **「动名词」** | **L136／L138 讲 `seeing`／`getting` 的类别时几乎必然写出来** | 「**名字版**」（L42 `:7647`「动词的第二份工作 · -ing」＋L120 `:22446`「穿名字版」） | **批十八既有，本批续用** |
| 「宾语」 | L135／L137 讲「后面跟的东西」时 | 「**后面跟的那个东西**」「要等的那件事」 | **本批新增** |
| 「第三人称」「三单」 | L135 讲 `looks` 时 | 「**她配带 s 的 looks**」「一群用原样」 | L25 `:4528`（**既有**「他、她、它做事，动词后面要加个小尾巴 -s」） |
| 「现在进行时」 | **L137 谈 `looking` 的形状时最易写** | 「**两个词挤一挤**」 | L87 `:16145`（**既有**） |
| 「疑问句」「否定句」 | **L137 全课** | 「**说「不」**」「**问就把 `Are` 搬句首**」 | L25 `:4562`／L123 `:23084`（**既有**） |
| 「助动词」「情态动词」 | L137 讲帮手 `Do` 时 | 「**帮手**」「一场戏只让一个词扛变化」 | L25 `:4562`（**既有**） |
| **「门牌」** | ⚠️ **不在 29 词表内，但本批额外禁**（L67 已用 `at` 作门牌，**两套门牌会串台**） | 「**一整个块**」 | **本批自建** |

## §7 叙事设计专章

### 7.1 叙事草案（逐字采用）

> **「盼着的那一天——一个块、四张脸。」**
> 我盼着周末：`I am looking forward to the weekend.`（第 134 课，**`look forward to` 是一整个块，三个字一起记；前面站着 `am`（两个词挤一挤），后面跟要等的那件事**；**第 133 课你见过它，当时只认脸——今天它转正了**）→ 她盼着夏天：`She looks forward to the summer.`（第 135 课，**前面换个人，后面那个词也跟着换——我盼着是两个词挤一挤（`I am looking`），她盼着是一个词（`looks`）；后面的块一个字不动**）→ 盼着见到你：`I am looking forward to seeing you.`（第 136 课，**后面那件事要穿名字版——这条规矩第 120 课学过，今天换一件事**）→ 你盼着吗：`Are you looking forward to the summer?`（第 137 课，**这块自己带着 `are`，搬到句首就够了——不用请 `Do` 来帮忙**）
> 收住：两站排一行（第 138 课）——`I am used to getting up early.`（上一站：习惯了）／`I am looking forward to getting up early.`（下一站：盼着）。**同一个 `to`、后面都穿名字版，意思完全不同。**
> 一句话总结：**一个块、四张脸；同一个 `to`，两站排一行。**

### 7.2 复用体系（不造新术语——全部是既有资产 ＋ 上游现成切法）

| 话术 | 出处（行号） | 本批怎么用 |
|---|---|---|
| **「两个词挤一挤」** | L87 `:16145`（`grammarLabel: "两个词挤一挤 · It's"`） | **L134 全课的主话术**（`am` ＋ `looking`）＋ L137 的 `looking` 形状说明 |
| **「换人换形」** | L126 `:23593`（`grammarLabel: "换人换形 · you look / she looks"`） | **L135 全课的主话术**（`I am looking` → `She looks`） |
| **「名字版」／「穿名字版」** | L120 `:22446`／`:22519`（「后面那件事穿名字版」） | **L136 的核心话术＋L136 ③ 的 whyZh**（**⚠️ 只点名不重讲**） |
| **「后面跟的东西不一样，说的就不是一件事」** | L127 `:23800`（`oneLineRule` 逐字） | **L134 `contrast` ⑥ ＋ L138 `contrast` ⑤ 的 whyZh**（**第三张脸的切法母版**） |
| **「同一个 to，两张脸」** | L122 `:22851`／`:22900` | **L138 的对照母版**——**但本批切的是后面，须显式点明轴不同**（§5.3） |
| **「not 跟 be 走／搬句首」** | L123 `:23023`／`:23084` | **L137 的骨架**（**只点名不重讲**）＋ L137 的变体 noteZh |
| **「帮手」／「一场戏只让一个词扛变化」** | L25 `:4562` | L137 的 `Do` 卡与 `spot` 的 explain |
| **「昨天版」** | L10 `:1782` | 旧错回流的统一话术（#143／#145 各一处 `tense`） |
| **「两个以上要加 s」** | L11 `:1964` | 旧错回流（#144／#145／#147 的 `plural`） |
| **「认读一句，混个脸熟」** | L133 `:24969`／`:25009`（**本批的起点**） | **L134 的升格卡**（话术改成「**第 133 课你见过它，当时只认读——今天它转正了**」，照 `:17175` 的成例） |
| **「收口传统」** | L54 `:9823`／L78 `:14362`／L94 `:17400`／L102 `:18919`／L110 `:20418`／L118 `:22040`／L124 `:23217`／L133（**八代先例**） | L138 同构 |
| **跨批钩子兑现** | L125 `:23407`（`It looks nice.`）／L126 `:23598`（`You look tired.`）／L133 `:24969`（种子位）／L120 `:22441`（`I am used to getting up early.`）／L123 `:23023`（`I am not used to it.`）／L132（`Does it sound good?`）／L87 `:16163`（`It's nice to see you.`）／L42 `:7647`（`I like reading.`）／L27 `:4898`（`What are you looking for?`——**只作 `looking` 词形底座引用，不进任何字段**）／L10 `:1782`／L11 `:1964`／L19／L25 `:4528` | **本批最大特征＝四处跨批接口**（批十九的 `look` 两张脸／批十八的同族第一站／批二十的 `Does`／L133 的种子位） |

### 7.3 展示层（season-21 ＋ m23，逐字给定）

**`grammarSeasons.ts` 追加**（现有 20 季，末项 season-20 在 `:58`）：
```ts
{ id: "season-21", label: "第二十一季 · 盼着那一天", hint: "我盼着周末、她盼着夏天、盼着见到你——同一个 to，后面跟的那件事", min: 134, max: 138 }
```

**`GrammarPathPage.tsx` CAN_DO_MILESTONES 追加 m23**（现有 22 个，末项 `can-do-m22 / afterLesson: 133` 在 `:268-274`）：
```ts
{
  id: "can-do-m23",
  afterLesson: 138,
  title: "我能说出我盼着什么、盼着做什么",
  zh: "我盼着周末（I am looking forward to the weekend）+ 她盼着夏天（She looks forward to the summer）+ 盼着见到你（I am looking forward to seeing you）+ 你盼着吗（Are you looking forward to the summer?）——一个块、四张脸；同一个 to，两站排一行（第 138 课）。",
  samples: ["I am looking forward to the weekend.", "She looks forward to the summer.", "I am looking forward to seeing you."]
}
```

**⚠️ `can-do-m23` 的 `samples` 逐字约束**：**三句必须是本批的 targetSentence 原句，一字不改**；**不得写 `I am looking forward to the trip.`**（`trip` 禁用）／**不得写 `I look forward to your reply.`**（信尾体，负清单）。

**两条展示层红线**：
1. **`season-21` 的 `min` 必须 > 133**（否则 `grammarSeasons.test.ts:21-31` 的「互不重叠」先红）；**`max` 必须 = 138 ≥ 最高课号**（否则「最高课号被覆盖」先红）——**忘加 season-21 会立刻红，不会静默**（实读 4 项守门断言）。
2. **`can-do-m23` 无守门测试**（本 PRD 实读复算：`grep -rn "can-do-m" src --include=*.ts --include=*.tsx | grep -v GrammarPathPage.tsx` **无输出**，全仓引用数 ＝ 0）——**纯纪律项，漏加不会红，须人工核**（数析 §5.2 实读原文）。

## §8 验收标准

### 8.1 检查清单（G1–G15 ＋ 展示层，逐条可勾）

- [ ] **G1 课程数据**：practice **≥4 题**且**含一道与 variants 非肯定卡逐字一致的变体题**（`grammarLessons.test.ts:11-29` 硬断言）；本批逐课列出——L134 `Are you looking forward to the weekend?`｜L135 `Is she looking forward to the summer?`｜L136 `Are you looking forward to seeing me?`｜L137 `Are you looking forward to the summer?`（**与 target 同句，属合法设计**，先例 L127／L132／L133）｜L138 `Are you looking forward to the summer?`
- [ ] **G1-b 复现题**：**每课 ≥1 复现题**；本批逐课配置——L134 复现 L133 `:24969` 种子位／L87 `:16163`／L42 `:7647`；L135 复现 L134 上一课句／`We look forward to the weekend.`／L126 `:23598`；L136 复现 L120 `:22441`／L87 `:16163`／L42 `:7647`／L134 句；L137 复现 L123 `:23023`／L132（`Does it sound good?`）／L135 句；L138 复现 L120 `:22441`／L125 `:23407`／`I am looking forward to getting up early.`（**收口课 6 题**）
- [ ] **G2 tokens／answer 词集一致＋distractors 不与答案词重复**（`grammarLessons.test.ts:31-50`／`:52-67` 硬断言）；**arrange／practice 展示序 ≠ 答案序**（`lessonService.ts:294` `shuffleTokenOrder`；`grammarBoostService.ts:225` `shuffleWithSeed` 兜底）；**⚠️ 本批 `practice.distractors` 必须手工放 `forward` 的混淆项**（数析 §2.3 处置 ②：`courseVocabulary():426` 过滤 `-ing` 结尾词，`looking` 进不了自动干扰项池）——**推荐干扰项：`for`／`front`／`before`／`forwards`**（**注意 `grammarLessons.test.ts:52-67` 断言「干扰项不得与答案词重复」；`forward` 本身不得作自己的干扰项**）
- [ ] **G2-b 零术语红线**：**29 词**（`grammarZeroTerms.ts:16-25` 逐字实读）——**三字段（`grammarLabel`／`oneLineRule`／`summary.rule`）逐课自查**（断言在 `grammarLessons.test.ts:105-130`）；**本批特别核「介词」「宾语」「形容词」「副词」「原形」「第三人称」「疑问句」「否定句」八词的 0 命中**，**＋本批额外禁「不定式」「动名词」「非谓语」「门牌」「系动词」「感官动词」六词**（非测试覆盖，人工核）；另核 AI 引用源三字段（`contrast.whyZh`／`guided.explain`／`recall.noteZh`，`grammarLessons.test.ts:200-218`）**同样 0 命中**；**另核改写后无生硬拼接**（`grammarLessons.test.ts` 的 `/的的/` 等四模式断言）
- [ ] **G3 recall 三字段非空**（`promptZh`／`intentZh`／`answer`；`grammarLessons.test.ts:69-88` 对 `number >= 13` 硬断言）；本批 5 课全部配 recall
- [ ] **G4 目标句 ≤8 词＋一课一增量**：L134 7 词／L135 6 词／L136 7 词／L137 7 词／L138 混排**逐句 ≤8 词**（四句分别为 7／8／6／7 词）；§2.2 每课「新知识点」只列一件（**L138 是零新知——已在「本课定位说明」写明**）
- [ ] **G5 罪名枚举**：5 案 tag **全落 10 枚举**（`huntService.ts:331-342` 逐字实读：tense／sv_agreement／missing_be／article／plural／preposition／fragment／run_on／word_order／verb_form）；**不碰 comparison**（`types.ts:419-430` 存在但 `GRAMMAR_ERROR_TAGS` 不含它、`huntCases.ts` 实读 **0 处**）；**本批 0 处 `fragment`／`run_on`**（数析 §4：本结构是短句，写残句／流水句难度高，**建议不硬塞**）
- [ ] **G6 案件结构**：每案 **4 错＝新错 2＋旧错 2**（**⚠️ #147 例外：三点锚本批＋一点锚旧课**，照 L133／L142 收口案先例）、**单 token 可修**、**≥1 净词**（`tokens.length > errors.length`）、`reviewed: true`、`tokenIndex` 与 `tokens` 对齐、`number` 连续（**#143–#147**，接 #142 `:7920` 之后）；旧错**只取 L10 `:1782`／L11 `:1964`／L19 `:3423`（`was/were`，**标注口径见 §9 注 2**）／L25 `:4528`**，禁引入未教材料
- [ ] **G7 tagStats=10 不动**（`huntService.test.ts:109` 断言 `toHaveLength(10)`）；**番外 5 案冻结**（`huntService.test.ts:215` 逐名单断言 `hunt-white-cat`／`hunt-sports-day`／`hunt-pen-pal-letter`／`hunt-fridge-note`／`hunt-term-review`）
- [ ] **G8 展示层硬需求**：§7.3 两条逐字落地（`season-21` `{134,138}` ＋ `can-do-m23` `afterLesson: 138`）
- [ ] **G8-b 守门测试**：`grammarSeasons.test.ts` **4 项全绿**（区间覆盖／互不重叠且 `min ≤ max`／`label`·`hint` 非空／最高课号被覆盖）；**m23 无守门，人工核**
- [ ] **G9 orphans 纪律**：5 个新案（#143–#147）**全部被 L134–L138 引用**（`huntCaseIds`），**不新增未引用案**
- [ ] **G10 episode 写法**：L134–L138 全部汉字数字（一百三十四／一百三十五／一百三十六／一百三十七／一百三十八）
- [ ] **G11 语料锁闭集（本批最硬的一条）**：
  - **`forward` 纪律**：**全批 `forward` 只出现在本批 5 课 ＋ L133 的 2 处种子位**（**L1–L132 的 `forward` 命中 ＝ 0，一字不动**）；**L133 的 2 处一字不改**。
  - **`look` 形态红线**：**`look` 家族在 L125–L133 已连占 9 课，本批再连占 5 课＝连续 14 课在场**（数析 §3.3）——**本批的压缩处置**：**`look` 只在 L134／L135／L136／L138 出现**（L137 的 `targetSentence`／`examples`／`practice`／`guided` **四字段 `look` 命中 = 0**——**L137 是全批唯一的 `look` 零课**）；**`looking` 只在「块」里出现**（`I am looking` 的形态），**不作独立词另讲**。
  - **负清单（`look to` 禁令）**：**严禁写出 `look to something` 作「期待」义**（Cambridge `word-patterns-look` 明文标错）；**`look forward to` 必须整体出现、不得拆写**。
  - **本批不引入**：`trip`／`holiday`／`meeting`／`visiting`／`soon`／`next week`／`object to`／`have sth done`／形容词＋介词／`look like`（新句）／`anticipate`／`expect`／`sounded`／`smelled`／`tasted`／`felt`／`traveling`。
  - **`to` 命中登记（本批与批二十完全不同——`to` 是本批的身份词）**：**逐课 `to` 命中数须逐条登记**，L134–L138 **每课均 > 0**（**这是设计使然，不是越线**）；**⚠️ 与批二十的零交集纪律的关系**：批二十的六课 `targetSentence` **不含 `to`**（**该纪律已随批二十交付完成，本批不继承**）——**本批的 `to` 是教学内容，须逐课登记数量即可**。
- [ ] **G12 cloze 逐课核验**（**本 PRD 以逐字复刻抽词器 ＋ 真 `diffService` 独立复跑，结果与数析 §2.1／瑞思 §1⑧ 逐字一致**）：
  - **词表状态（逐字实读）**：`forward`／`looking`／`seeing` **全部不在 `GRAMMAR_WORDS` 145 词条目内**（本 PRD 实读 `grammarAmbushService.ts:161-186`：表内含 `look`／`looks`／`see`／`sees`／`saw`，**不含 `forward`／`looking`／`seeing`**）；**三词也不在 `CLOZE_STOP_WORDS` 30 词内** → **三词永不成空位（ambush 侧）**。
  - **逐课落点（本 PRD 逐字复跑登记）**：

    | 课 | 句 | 档 | 空位词 | 是否考点词 |
    |---|---|---|---|---|
    | L134 | `I am looking forward to the weekend.`（target） | ① | **am** | ❌ 假友好 |
    | L134 | **`We look forward to the weekend.`（保障句）** | ① | **look** | ✅ **真** |
    | L134 | `Are you looking forward to the weekend?`（变体） | ① | **Are** | ⚠️ 边界 |
    | L135 | **`She looks forward to the summer.`（target ＋ 保障句）** | ① | **looks** | ✅ **真** |
    | L135 | `She is not looking forward to the summer.`（变体） | ① | **is** | ❌ |
    | L135 | `Is she looking forward to the summer?`（变体） | ① | **Is** | ⚠️ 边界 |
    | L136 | `I am looking forward to seeing you.`（target） | ① | **am** | ❌ |
    | L136 | `Are you looking forward to seeing me?`（变体） | ① | **Are** | ⚠️ 边界 |
    | L137 | `Are you looking forward to the summer?`（target） | ① | **Are** | ⚠️ 边界 |
    | L137 | `I am not looking forward to the summer.`（变体） | ① | **am** | ❌ |
    | L138 | `She looks forward to the summer.`（保障句） | ① | **looks** | ✅ **真** |
    | L138 | `We look forward to the weekend.`（保障句） | ① | **look** | ✅ **真** |
    | L138 | `I am used to getting up early.`（上一站） | ① | **am** | ❌（**与批十八同构**） |
    | L138 | `I am looking forward to getting up early.`（下一站） | ① | **am** | ❌ |

  - **保障句（让主考点不落空）**：L134 `We look forward to the weekend.`（落 **look**）／L135 `She looks forward to the summer.`（落 **looks**）／**L136 无（改由 `contrast` ①②③ ＋ `spot` 承担）**／**L137 无（改由 `contrast` ① ＋ `spot` 承担）**／L138 **两句**（落 **looks**／**look**）。**⚠️ 本批 5 课里只有 3 课能配出「落考点词」的保障句——这是「假友好」下的必然分工，须写进生产单**（§4.6 一句话结论）。
  - **⚠️ 与批二十的对照（本批劣势，须诚实标注）**：批二十的 `sounds`／`smells`／`tastes`／`feels` 走**第 ② 档但落点即考点**（「真友好」）；**本批走第 ① 档且落点在 `am`／`is`／`Are`**（「假友好」）——**唯一解法是 L135 的 `looks` 与 `We look forward to …` 的 `look`**（§4.2）。
  - **boost 侧**：`forward` 可落 **22.6%–34.9%**（数析 §2.2，252 组种子）；**本批不改 `grammarBoostService.ts`**。
  - **复习卡引擎 C 的退化干扰项**：**竞析 §7 建议 1 是前置工程项**（`forward` → `["forward","forwards","forwardes","forwarded"]`）——**若本批开工前来不及修，须登记为「已知降级」并在遥测里单列**（§4.5）。
- [ ] **G-boost（硬护栏）**：
  - **每课 contrast 6 条中 ≥2 条为「带 `wrongMark` 的真实错卡」**（**本批推荐 3 条**；口径：`wrongMark` 非空、非 bothRight、字面词能在 wrong 句里定位；`grammarBoostService.ts:699-706` 实读）；**禁止贴线**（`grammarBoostService.test.ts:161-183` 全库逐课断言 `thin === []`）。**本批逐课 3 条**——**15 个 `wrongMark` 全部含字母**：L134 `look`／`looking`／`weekend`｜L135 `look`／`am`／`summer`｜L136 `see`／`forward`／`for`｜L137 `Do`／`not`／`summer`｜L138 `see`／`look`／`Do`。**每课池深＝3 mark ＋ 1 spot ＝ 4 道**（与 L120–L123／L125–L133 持平）。
  - **`wrongMark` 不得为纯标点**（`grammarBoostService.test.ts:199-208` 断言；L89 `"?"` 已修为 `"day?"` 的前车之鉴）——**本批 15 个 `wrongMark` 均含字母 ✓**（**本批无一处带 `?` 或 `!`**）。
  - **`guided.spot` 的 `wrongToken` 必须与 `tokens` 元素逐字相等（含尾标点写法一致）**——L96／L102 曾因尾标点不一致致题目静默消失；**本批 5 处 spot 设计逐课按最严口径核对**：L134 `["I","am","look","forward","to","the","weekend."]`／`"look"`｜L135 `["She","look","forward","to","the","summer."]`／`"look"`｜L136 `["I","am","looking","forward","to","see","you."]`／`"see"`｜L137 `["Do","you","looking","forward","to","the","summer?"]`／`"Do"`｜L138 `["I","am","looking","forward","to","see","you."]`／`"see"`。**⚠️ 定稿口径（写死）**：**`wrongToken` 一律写成 `tokens` 里的逐字元素**——**中间元素不带尾标点（`"am"`／`"look"`／`"see"`／`"Do"`），末元素带尾标点**；**共同要求＝`tokens.includes(wrongToken)` 必须为 true**（`grammarBoostService.test.ts:185-196` 断言）。
  - **guided 六步覆盖 choose／arrange／spot／replace 四类**；**`kind: "spot"` 恒为 1 道/课**（全库现状，本批沿用）。
  - **G-boost-d 双正解卡的 diffScore 红线**：`grammarBoostService.ts:744-753` 对 `bothRight` 条目做 `diffScore(compareText(correct, wrong))`，**`>= 90` 直接 `return`**（静默丢弃、不报错）。**本 PRD 以真 `diffService` 逐组实跑本批全部 16 组双正解设计并留档（§4.4）**：**最高 75（L138 ④）／最低 0（四组跨批切开卡），全部 < 90 ✓**。**⚠️ 已登记的越线对（≥90，禁用）**：`She looks forward to the summer.` ／ `She look forward to the summer.` **92**（**L135 ① 的错卡，非双正解——门只对 `bothRight` 生效**）；**⚠️ 已登记的偏近对**：`I am not looking forward to the summer.` ／ `Are you looking forward to the summer?` **88**（**接近线，本批已改用 `…the weekend.` 版本，diffScore 50**）／`I am looking forward to the summer.` ／ `I am looking forward to the weekend.` **71**／`Is she looking forward to the summer?` ／ `She looks forward to the summer.` **71**。
  - **（附）全库护栏现状（数析 §7 实读）**：`contrast` 带非空 `wrongMark` 共 **434 条**、`wrongMark: null` **310 条**；**每课至少 1 条**；thin（＜2 改错题）＝ **0 课**；`wrongToken` 违规 **0**；纯标点 `wrongMark` **0**。→ **本批每课 3 条带 mark 的真错卡，过线且留余量**。
- [ ] **G13 时长 6–8 min**（5 课逐课走查；**L138 因四句同屏可略长（5–6 min）**，须按**分段计时**抽查；**L136 三条 mark 全在块上，讲解密度最高，须重点抽查**）
- [ ] **G14 旧线零回归**：**L1–L133 一字不动**（**特别声明：不改 L133 `:24969`／`:25009`（**种子位，本批的起点**）／L125 `:23407`／L126 `:23593`／`:23598`／L120 `:22438`／`:22441`／`:22446`／`:22519`／L122 `:22851`／`:22900`／L123 `:23023`／`:23084`／L132（`Does it sound good?`）／L87 `:16145`／`:16163`／L42 `:7647`／L10 `:1782`／L11 `:1964`／L19 `:3423`／L25 `:4528` 等被「认领」的句子**——**认领＝在 L134–L138 里引用，不是编辑原课**）；**不改 `grammarAmbushService.ts`／`grammarBoostService.ts`／`grammarBoostService.test.ts`／`grammarZeroTerms.ts` 四个文件**（**⚠️ 例外：`grammarReviewService.ts:217-236` 的干扰项修复是前置工程项，可独立先行**，§4.5）；`npx vitest run` 全绿（**基线：61 文件 / 798 项，数析 §A6 实跑快照**）；`npx tsc --noEmit` 0 错；build 通过
- [ ] **G15 封面**：`L134←cover17`／`L135←cover18`／`L136←cover19`／`L137←cover20`／`L138←cover21`（min-gap **117**，数析 §6.3 二分＋全枚举验证**唯一解**）；**本 PRD 已实读封面资产确认五张齐全**（`src/assets/lessons/` 实读 117 张、编号连续）；**唯一允许的池内换法＝五张内部互换（集合不变）**，须登记且须同时登记 min-gap 变化；**`cover1`–`cover16` 本批永久禁用**（二用张、段距 1–16）；**`cover100`+ 本批禁用**（L134 的 gap ≤ 34）；**`cover118`+ 资产不存在**

### 8.2 Given/When/Then

- **G-A1** Given 学习者完成 L134 When 看「第 133 课你见过这句（当时只是认读）」与今天的正式内容 Then 能说出「**见过——当时只认脸，今天转正了**」；When 看 `I am look forward to the weekend.` ❌ Then 能改成 `I am looking forward to the weekend.` 并说出「**盼着的那个词要穿 -ing**」
- **G-A2** Given 学习者完成 L134 When 看 `It looks nice.` ✅ 与 `I am looking forward to the weekend.` ✅ 并排 Then 能说出「**同一个 look 三张脸——第 125 课后面跟「什么样」，今天这个 `look` 不是看，后面跟「要等的那件事」**」
- **G-A3** Given 学习者完成 L135 When 看 `She look forward to the summer.` ❌ Then 能改成 `She looks forward to the summer.` 并说出「**她配带 s 的 looks**」；When 被问「`I am looking` 换成 `She` 之后还剩几个词」Then 能答「**一个词：looks**」
- **G-A4** Given 学习者完成 L136 When 看 `I am looking forward to see you.` ❌ Then 能改成 `I am looking forward to seeing you.` 并说出「**后面那件事要穿名字版——这条规矩第 120 课学过，今天换一件事**」；When 被问「今天新学的规矩是什么」Then **不得答「`to` 后面穿名字版」（那是第 120 课的），应答「今天换的是「盼着」这件事」**
- **G-A5** Given 学习者完成 L137 When 看 `Do you looking forward to the summer?` ❌ Then 能改成 `Are you looking forward to the summer?` 并说出「**这块自己带着 `are`——搬到句首就够了，不用请帮手**」；When 看 `Does it sound good?` ✅ 与 `Are you looking forward to the summer?` ✅ 并排 Then 能说出「**那块自己没有 be 才要请 `Does`；这块自己带着 are**」
- **G-A6** Given 学习者完成 L138 回看两站 When 逐句指认 Then 能说出「**上一站是「习惯了」（第 120 课），下一站是「盼着」——同一个 `to`、后面都穿名字版，意思完全不同**」；When 被问「第 122 课切的是哪儿」Then 能答「**切的是 `to` 前面（有 be 没 be）；今天切的是后面（跟东西 对 跟做的事）**」
- **G-A7** Given 学习者完成全批 When 看 `We look forward to the weekend.` ✅ Then **不得判错、不得要求改成 `We are looking…`**（**「一群用原样」是本批的正解之一**）；When 看 `I am looking forward to the weekend.` ✅ Then 能说出「**这是第 133 课见过的那句**」

### 8.3 三条「不得写」的硬门（本批特有，生产期逐条核）

1. **不得写 `look to something` 作「期待」义**（上游明文标错）——**`look forward to` 必须整体出现**。
2. **不得写「L133 已经教过」**——**L133 的种子位是「认读」，不是「已教」**（§3.2 三条护栏）。
3. **不得在 L136 重讲「前面站谁它听谁的」**——**那是 L122 的内容；本课只做一次点名**（§5.2 分工表）。

## §9 案件规划（5 案 · #143–#147）

**总规则**：每案 **4 错**（**#143–#146＝新错 2＋旧错 2；#147＝三点锚本批＋一点锚旧课**）；**单 token 可修**；每案 **≥1 净词**（`tokens.length > errors.length`）；零术语话术；tag **全落 10 枚举**（tagStats 固定 10 项）；`reviewed: true`；**必须配课**；**不碰 comparison**；**不引番外 5 案**；**本批 0 处 `fragment`／`run_on`**。案件编号接批二十尾案（#142 `hunt-five-senses`，`huntCases.ts:7920` 起）为 **#143–#147**。**tokens 格式沿用「4 句短句排一行」**（先例 #128／#130／#131／#132／#135／#136／#137–#142 同款），**标点跟在前一个词后面**（`huntCases.ts` 头注释 `:15` 明文）。

| 案件 id | # | 配课 | 场景 | 定稿错误构成（原 → 修正（tag，新/旧）） |
|---|---|---|---|---|
| `hunt-looking-forward-weekend` | **143** | L134 | 书桌前：翻小日历，手指停在周六那一格 | ① `look` → `looking`（`I am look forward to the weekend.`，**verb_form**，新——**盼着的那个词要穿 -ing**；explanation「前面站着 `am`，盼着的那个词要穿 `-ing`——I am 【looking】 forward to the weekend。」）② `looking` → 补 `am`（`I looking forward to the weekend.`，**missing_be**，新——**两个词挤一挤**；**单 token 可修的补词型写法**：`correction: "am looking"`；**先例** `huntCases.ts:7141`（#124 的 `is → 去掉 is` 型，**同型反向**）／`:7379`（#129 的 `getting → to getting` 补词型）；explanation「两个词挤一挤（第 87 课的老办法）：`I` 后面要带上 `am`——I 【am】 looking forward to the weekend。」）③ `go` → `went`（`Yesterday I go to the park.`，**tense**，旧错 L10 `:1782`；**逐字先例** `huntCases.ts:7460-7466`（#131③：`go→went`，explanation「第 10 课回流：说昨天的事要换昨天版——go → 【went】。」））④ `was` → `were`（`They was happy.`，**sv_agreement**，旧错 L19；**逐字先例** `huntCases.ts:7626-7631`（#135③：`original: "was"`／`correction: "were"`／explanation「第 19 课回流：They 是一伙人，用 were 搭档——They 【were】 happy。」；**⚠️ 口径注见下**） |
| `hunt-she-looks-forward` | **144** | L135 | 窗边：看着窗台上的小盆栽，想夏天 | ① `look` → `looks`（`She look forward to the summer.`，**sv_agreement**，新——**她配带 s 的 looks**；explanation「第 126 课回流：换人换形——她配带 s 的 【looks】。」）② `summer` → `the summer`（`She looks forward to summer.`，**article**，新——**要等的那个夏天要带 the**；**先例** `huntCases.ts:7147-7151`（#124 的冠词补词型）；explanation「要等的那个夏天是特定的那一个——带上 the：to 【the】 summer。」）③ `sandwich` → `sandwiches`（`We have two sandwich.`，**plural**，旧错 L11 `:1964`；**逐字先例** `huntCases.ts:720-726`（第 17 案：`original: "apple"`／`correction: "apples"`／explanation「第 11 课回流：two 后面的可数名词要加 -s——two 【sandwiches】。」）；**`sandwich` GL 19 处在库 ✓**）④ `play` → `plays`（`He play football every day.`，**sv_agreement**，旧错 L25 `:4528`；**逐字先例** `huntCases.ts:7373-7378`（#129③：`original: "drink"`／`correction: "drinks"`／explanation「第 25 课回流：他/她/它后面的动词加 -s——He 【plays】 football every day。」）） |
| `hunt-looking-forward-seeing` | **145** | L136 | 校门口：手里攥着两张票，等好朋友 | ① `see` → `seeing`（`I am looking forward to see you.`，**verb_form**，新——**本批要新造的错型，库里该方向恰好空着**；explanation「后面跟的是「那件事」，要穿名字版——to 【seeing】 you。（第 120 课那条规矩，今天换一件事）」）② `forward` → `forward to`（`I am looking forward seeing you.`，**preposition**，新——**三个字一起记，`to` 丢不得**；**单 token 可修的补词型写法**：`correction: "forward to"`；explanation「这块是三个字一起记：look + forward + to——丢一个就不成块了：looking 【forward to】 seeing you。」）③ `eat` → `ate`（`Yesterday I eat noodles.`，**tense**，旧错 L10 `:1782`；**与 #143③ 换动词与名词**（go→eat／park→noodles），避免逐字重复；**`noodles` GL 6 处在库 ✓**；explanation「第 10 课回流：说昨天的事要换昨天版——eat → 【ate】。」）④ `egg.` → `eggs.`（`We have two egg.`，**plural**，旧错 L11 `:1964`；**`egg` GL 7 处在库 ✓**；**与 #144③ 换名词**（sandwich→egg）；explanation「第 11 课回流：two 后面是可数名词复数——two 【eggs】。」） |
| `hunt-are-you-looking-forward` | **146** | L137 | 课间：同学说暑假要去外婆家 | ① `not` → `am not`（`I not looking forward to the summer.`，**missing_be**，新——**`not` 跟 be 走，`am` 不能丢**；**单 token 可修的补词型写法**：`correction: "am not"`；explanation「说「不」要跟着 `be` 走（第 123 课的老规矩）：I 【am not】 looking forward to the summer。」）② `Do` → `Are`（`Do you looking forward to the summer?`，**verb_form**，新——**本批第二条新错型：这块自己带着 are，不用请帮手**；explanation「这块自己带着 are——把它搬到句首就够了：`Are` you looking forward to the summer?（第 132 课那块自己没有 be，才要请 Does）」）③ `was` → `were`（`They was happy.`，**sv_agreement**，旧错 L19；**与 #143④ 同句——⚠️ 见注 3 的避免重复处置**）④ `drink` → `drinks`（`She drink milk every day.`，**sv_agreement**，旧错 L25 `:4528`；**与 #144④ 换主语**（He→She），避免逐字重复；explanation「第 25 课回流：他/她/它后面的动词加 -s——She 【drinks】 milk every day。」） |
| `hunt-two-stations` | **147** | L138（**收口课案件**） | 书桌上：本子最后一页，两行句子排整齐 | ① `see` → `seeing`（`I am looking forward to see you.`，**verb_form**，**回流 #145①**；explanation「第 136 课回流：后面那件事要穿名字版——to 【seeing】 you。」）② `Do` → `Are`（`Do you looking forward to the summer?`，**verb_form**，**回流 #146①**；explanation「第 137 课回流：这块自己带着 are——`Are` 搬句首就够了。」）③ `look` → `looks`（`She look forward to the summer.`，**sv_agreement**，**回流 #144①**；explanation「第 135 课回流：换人换形——她配带 s 的 【looks】。」）④ `apple.` → `apples.`（`We have two apple.`，**plural**，旧错 L11 `:1964`；**逐字先例** `huntCases.ts:6607`／`:720-726`；**⚠️ 本句是既有多案用过的「two apple」句——生产期须核它已出现在几案（`grep` 实读 `:6607`／`:6959`），若已 ≥6 处须换名词**；**本 PRD 预估 2 处，可用**）——**沿用 #136／#142 收口案式**（三点锚新课、一点锚旧课） |

> **本批罪名分布（5 案 × 4 错 ＝ 20 处，逐案按上表实点）**：`verb_form` **5**（#143①／#145①／#146②／#147①／#147②）／`sv_agreement` **5**（#143④／#144①／#144④／#146③／#146④／#147③——**⚠️ 实为 6**，见下方校验）／`missing_be` **2**（#143②／#146①）／`article` **1**（#144②）／`preposition` **1**（#145②）／`plural` **3**（#144③／#145④／#147④）／`tense` **2**（#143③／#145③）／**`fragment` 0／`run_on` 0／`word_order` 0／`comparison` 0**。
> **校验（逐项重数）**：`verb_form` 5（#143①／#145①／#146②／#147①／#147②）＋`sv_agreement` **6**（#143④／#144①／#144④／#146③／#146④／#147③）＋`missing_be` 2（#143②／#146①）＋`article` 1（#144②）＋`preposition` 1（#145②）＋`plural` 3（#144③／#145④／#147④）＋`tense` 2（#143③／#145③）＝ **20 ✓**。
> **注 1（`sv_agreement` 偏多——本批的刻意处置）**：本批 `sv_agreement` 共 **6 处**——**理由**：L135 的新增考点本身就是「一个／一群配哪个形状」（`look` vs `looks`），**这是本课语法核心**；**旧错侧**：#143④／#146③ 取 L19，#144④／#146④ 取 L25，**两条线各两处、对称分布**。**风险与稀释**：**L136／L137／L138 三课的新错只用 `verb_form`／`missing_be`／`preposition`**（#145①②／#146①②／#147①②），**不再新增 `sv_agreement`**。**若走查显示观感疲劳，备选＝#146③ 改 `article`**（`He is the good boy.` 的 `the→a`）——**默认不改**（会打破「旧错只取 L10／L11／L19／L25」的纪律）。
> **注 2（旧错回流只取 4 课）**：`tense` 一律取 L10 `:1782`（`go→went` 型；本批出现 `go→went`／`eat→ate` 两形）／`plural` 一律取 L11 `:1964`／`sv_agreement` 取 L19（`was/were`）与 L25 `:4528`（三单）——**与批十七至二十批的回流课号完全一致**（**是既定传统，不是新引入**）。**⚠️ L19 标号的口径**：瑞思 §1⑫ 实读「『一个用 was、一群用 were』实际在 L51 `:9344`／`:9416`，**不在 L19**」；**批十七至二十批均取 L19 标号**（#132②／#135③／#138③／#140③ 实读），**本批沿用 L19 标号以保持回流课号一致**；**若产品决定改标 L51，本批两案（#143④／#146③）须同改**（并回溯登记前批）。
> **注 3（同案同句的避免重复处置——本批须处理的一处）**：#143④ 与 #146③ **两句都是 `They was happy.`**——**⚠️ 同一案池里两句逐字相同会造成「同案重复」观感**。**本 PRD 定稿处置**：**#146③ 改为 `We was happy.`**（**逐字先例** `huntCases.ts` 的 `was/were` 型；`We` ＋ `was` 同属「一群配错了」的错，**语法一致、句子不同**）；**若生产期认为 `We was` 的错感不如 `They was`，备选＝#143④ 改为 `We was happy.`**（**两案只能有一案用 `They`，另一案必换**）。
> **注 4（tokenIndex 定稿）**：上表只给「原 → 修正」，**生产时逐 token 核 `tokenIndex` 与 `tokens` 下标**。**四句排一行的下标规律**（照抄 #128／#130／#131／#132／#135／#136／#137–#142）：第 1 句从 0 起、第 2 句从「第 1 句词数」起、依次累加。**本批逐案下标**（按「4 句短句排一行」定稿）：

| 案 | tokens（逐字） | 错点下标 |
|---|---|---|
| #143 | `["I","am","look","forward","to","the","weekend.","I","looking","forward","to","the","weekend.","Yesterday","I","go","to","the","park.","They","was","happy."]` | ① 2（`look`）② 8（`looking`）③ 15（`go`）④ **20**（`was`） |
| #144 | `["She","look","forward","to","the","summer.","She","looks","forward","to","summer.","We","have","two","sandwich.","He","play","football","every","day."]` | ① 1（`look`）② 10（`summer.`）③ 14（`sandwich.`）④ 16（`play`） |
| #145 | `["I","am","looking","forward","seeing","you.","I","am","looking","forward","to","see","you.","Yesterday","I","eat","noodles.","We","have","two","egg."]` | ① 11（`see`）② **3**（`forward`）③ 15（`eat`）④ **20**（`egg.`） |
| #146 | `["I","not","looking","forward","to","the","summer.","Do","you","looking","forward","to","the","summer?","We","was","happy.","She","drink","milk","every","day."]` | ① 1（`not`）② 7（`Do`）③ **15**（`was`）④ **18**（`drink`） |
| #147 | `["I","am","looking","forward","to","see","you.","Do","you","looking","forward","to","the","summer?","She","look","forward","to","the","summer.","We","have","two","apple."]` | ① 5（`see`）② 7（`Do`）③ **15**（`look`）④ 23（`apple.`） |

> **⚠️ 净词校验（逐案）**：#143 `tokens 22 > errors 4` ✓｜#144 `20 > 4` ✓｜#145 `21 > 4` ✓｜#146 `22 > 4` ✓｜#147 `24 > 4` ✓。
> **⚠️ 标点口径（逐案须核）**：`huntCases.ts` 头注释 `:15` 明文「tokens 是原文按空格切好的词表（标点跟在前一个词后面）」——**本批五个带尾标点的原文（`weekend.`／`summer.`／`sandwich.`／`noodles.`／`egg.`／`apple.`）必须与 `tokens` 逐字一致**（先例 #134④ `"box."`／#135④ `"cup."`／#130④ `"book."` 均带尾标点）。**#146② 的 `tokens` 第 12 元素是 `"summer?"`（第二句以问号结尾）**——**逐字核**。
> **⚠️ #145② 的 `correction` 是补词型**（`forward` → `forward to`）——**单 token 可修**（`tokenIndex` 指向 `forward`，`correction` 写 `"forward to"`）；**先例** `huntCases.ts:7379`（#129 的 `getting → to getting` 补词型）。**#143② 的 `correction` 是 `"am looking"`**、**#146① 的 `correction` 是 `"am not"`**——**三处补词型写法与既有先例逐字同构**。
> **⚠️ 「本批新错型」的两条写进 `explanation` 的硬要求**：**#145①（`see` → `seeing`）的 explanation 必须含「第 120 课那条规矩，今天换一件事」**（**点名复用，不重讲**）；**#146②（`Do` → `Are`）的 explanation 必须含「这块自己带着 are」＋「第 132 课那块自己没有 be，才要请 Does」**（**跨批切开**）。

**案件表纪律**：每案 4 错**单 token 可修**（补词／删词型按既有先例：`is→去掉 is` 型参照 `huntCases.ts:7141`；`not→am not` 补词型参照 `:7379`；替换型参照 `:7365`）；新错话术走 §6 负迁移表；**旧错一律取自已教点**（L10／L11／L19／L25），**禁引入未教材料**；**#147 的四点须与 #145①／#146①／#144① 的错型逐条呼应**（收口课纪律：**复现不讲新**——与 #136／#142 同构）。

**⚠️ 逐案 `explanation` 的零术语自查（`huntCases` 侧无守门测试，纯纪律）**：本批 20 条 `explanation` **全部不得出现 29 词 ＋ 本批额外禁词**——**特别是「介词」（#145② 讲 `forward to` 时最易写）／「不定式」「动名词」（#145① 讲 `seeing` 时）／「宾语」「原形」**；**统一写「这块是三个字一起记」「那件事要穿名字版」**。

## §10 Non-goals

- **不做 `object to`**（**维持 C：零底座 ＋ 无情感抓手 ＋ 缺配套名词**；竞析 §7 建议 3 的「三引擎都真友好」是技术加分项，**仍不足以升档**）——**本批连折入认读也不做**（5 课容量已满，且它与「盼」不同族）
- **不做 `have sth done`**（维持撤出：7 词全 0；`have my` GL 1 处不足以构成垫子）
- **不做**形容词＋介词单开（**维持折卡**：六族只覆 1/6，`good at` GL 52／HC 6）
- **不做**机制强化（维持 D：批十六判「无增量空间」，十七至二十复跑维持）
- **不做 `seem`／`appear`／`become`／`get + 什么的词`／`turn + 什么的词`**（两文件全 0 且属 D 档）
- **不做第 6 课**（**第 6 课无真实增量**——同骨架只能换名词；`party` 薄、`birthday` 与批十七 L117 交叠）
- **不引入 `trip`**（GL 真词次 0，唯一 1 处是 id 串 `hunt-trip-time`）／**`holiday`**（双 0）／**`test`**（**本 PRD 实读 GL 0／HC 1——属新词，不得引入**——**L137 的否定态已由 `the test` 改为 `the summer`**）／**`meeting`／`visiting`／`soon`／`next week`／`next month`／`next year`／`vacation`／`weekends`／`parties`**（全 0）
- **不做 `looking` 的独立立岗**（**零造词——L27 `looking for` 已有 10 处教学句**；**本批 `looking` 只作为「块」的一部分出现**，**不引入 `looking for` 的第二义**）
- **不做 `look like` 的扩**（维持 L127 认读口径 `It looks like rain.`，**本批不引入新句**）
- **不写 `look to something` 作「期待」义**（**上游 Cambridge `word-patterns-look` 明文标错**——负清单第 1 条）
- **不做 `look forward to` 的过去式**（`I was looking forward to…`——**`was` 型留给将来的批次**）／**不做 `I look forward to your reply.` 信尾体**（**书信体裁场景负担**，竞析 §9.3 负清单）／**不做 `Looking forward to…` 省略主语句**（同源）
- **不做 `expect`／`anticipate`**（`anticipate + Ving` 属同族第三词，**超纲**）
- **不做**名词侧的四件库内词的额外扩（`party`／`birthday`／`photo`／`letter`——**本批只用 `weekend`／`summer` 两个**，其余登记为可用池）
- **不做**双拱（批十四破例一次后，批十五至二十一**连续第八次单拱**）
- **案量不扩**：5 课 5 案，不设「一课两案」；**不加**新枚举、不改 `tagStats`／schema、**不改 `types.ts`**
- **不动 L1–L133**（一字不改；**特别声明**：不改 L133 `:24969`／`:25009` 种子位——**升格＝引用不是编辑**；不改 L120／L122／L123／L125／L126／L127／L132／L87／L42／L10／L11／L19／L25 等被认领的句子）
- **不引**番外 5 案（`hunt-white-cat`／`hunt-sports-day`／`hunt-pen-pal-letter`／`hunt-fridge-note`／`hunt-term-review`）
- **不做**池外新资产（封面＝cover17–cover21 池内复用，数析 §6.3 唯一最优解；**五张内部互换是唯一允许的换法**；`cover1`–`cover16` 永久禁用、`cover100`+ 本批禁用、`cover118`+ 资产不存在）
- **不做** cloze 词表扩充（**数析 §2.3 处置 ⑤ 明写「不动词表，用通道组合解决」**——**本批不改 `grammarAmbushService.ts`／`grammarBoostService.ts`**）
- **不做**中文侧术语直抄（**「介系詞」「動名詞」「原形動詞」三词全部不引**——§6.2 三条引用红线）

## §11 开放问题

1. **`look` 的连续在场观感（本批最大风险）**——`look` 家族在 L125–L133 已连占 9 课（**L125–L127 三课 288 处 ／ L128–L133 六课 63 处**），**本批再连占 5 课＝连续 14 课在场**（数析 §3.3）。**本批的压缩处置**：**L137 的 `targetSentence`／`examples`／`practice`／`guided` 四字段 `look` 命中 = 0**（**全批唯一的 `look` 零课**）。**观察点**：L136／L137／L138 的完成率是否显著低于 L134（**若显著下滑，说明 `look` 的注意力份额已被批十九／二十占满**）。**默认处置**：**不动课序**（**L137 的「零 look」已是本批能做到的最大压缩**——再压会破「一课一增量」）。**备选（须主理人裁）**：**L136 与 L137 的次序对调**（把「说不和问」提前），**代价：L137 的 `look` 零课会落到 L136 的位置，且 L136 的「名字版」会与 L135 的「换人换形」相邻、失去间隔**。
2. **cloze 假友好在 L136／L137 的后果**（本批技术核心）——**这两课无「落考点词」的保障句**（§4.6）。**观察点**：**这两课的「改错题」（`contrast` 3 条 ＋ `spot` 1 道）的触达率与判对率**——**若触达率低，说明用户只走 cloze 通道，考点将 100% 逃逸**。**默认处置**：**不改课序、不改引擎**；**若走查显示触达率 < 50%，备选＝把 `grammarAmbushService.ts` 的 `GRAMMAR_WORDS` 表加 `looking`**（**数析明确不推荐：会影响全库 133 课的回访问卷，回归面远超本批收益**——**须主理人裁**）。
3. **复习卡引擎 C 的干扰项退化（前置工程项）**——竞析 §7 建议 1：`grammarReviewService.ts:217-236` 的 `buildClozeOptions` 会对 `forward` 产出 `forwardes`（**不是英语词**）。**本批的暴露面最大**（**第一个「targetSentence 里含库外新词 ＋ 长 -ing 形式」的批次**）。**默认处置**：**开工前修（对齐 Boost 的 2026-09-19 修正版）**；**若来不及，须登记为「已知降级」并在遥测里单列**（**不得静默**）。
4. **B 档系列结清后的批二十二选题**（**本批交付后的第一件产品决策**）——**本批交付后，候补池里不再有 B 档及以上项目**（candidate 池最高只到 B− 的形容词＋介词·折卡，与 C 的 `object to`／`have sth done`）。**观察点**：**批二十二的候补清单需重排**（**可能的方向：进 A 档复现型大章 ／ 开 C 档选题 ／ 换轴（读写/听力）**）。**此项超出本 PRD 范围，须主理人另开裁决**。
5. **「`She looks forward to the summer.` 是唯一 cloze 友好形态」这条事实的稳定性**——**它依赖两个条件**：① `looks` 在 `GRAMMAR_WORDS` 表内（`grammarAmbushService.ts:174`）；② 该句的第一个 `GRAMMAR_WORDS` 命中是 `looks`（**若将来有人在 `She` 之后插词，或 `GRAMMAR_WORDS` 表被改动，落点会变**）。**观察点**：**生产期须在 L135 落盘后即刻复跑一次 cloze 落点**（本 PRD 的实跑是设计态，不是落盘态）。**默认处置**：**不改 `GRAMMAR_WORDS` 表**（数析建议）。
6. **`forward` 的段位数据缺口**——Cambridge `dictionary/english/forward` **本轮未取**（竞析 §9.2 未核实 ⑥）；**故「`forward` 这个单词本身属哪一段」无数据**。**本批的处置**：**段位依据一律挂在 `look forward to something` 条（B1／B2）**，**不写「`forward` 是 B1 词」**。**观察点**：**无**（**不影响上线**）。
7. **`We was happy.` 与 `They was happy.` 的两案分派**（§9 注 3）——**同一案池里两句逐字相同会造成「同案重复」观感**。**默认处置**：**#143④ 用 `They was happy.`／#146③ 用 `We was happy.`**（**两案只能有一案用 `They`**）。**观察点**：**若走查显示 `We was` 的错感弱于 `They was`，两案对调**。
8. **`the summer` 在 L135／L137 两课的重复**（**同一个名词在两课作主名词**）——**本批的名词侧只有 `weekend`（9）与 `summer`（3）两个可作主句**（`party` 太薄、`birthday` 与批十七交叠）。**默认处置**：**L135／L137 都用 `the summer`**（**`summer` 的 `for the summer` 先例已有**，L46 `:8417`）。**观察点**：**两课的「换词位」观感**——**若走查显示重复感明显，备选＝L137 改用 `the weekend`**（**⚠️ 代价：`the summer` 是本课与 L135 的接口词，换掉会削弱两课的「同一个名词、不同脸」对照**）。
9. **L19 标号的口径**（#143④／#146③ 的 `was/were`）——瑞思 §1⑫ 实读「『一个用 was、一群用 were』实际在 L51 `:9344`／`:9416`，**不在 L19**」；**批十七至二十批均取 L19 标号**，**本批沿用**。**若产品决定改标 L51，本批两案须同改**（并回溯登记前批）。
10. **基线口径**——本 PRD 引用的测试基线是**数析 §A6 快照：61 文件 / 798 项全绿 ＋ `tsc --noEmit` exit 0**。**生产时以实跑为准并登记**（G14 写 798，若生产期再变以实跑登记）。
11. **`can-do-m23` 无守门**（数析 §5.2 实读：全仓 `can-do-m*` 测试引用数 ＝ 0）——**漏加不会红，须人工核**（G8-b 已列）。
12. **封面二用池的长期耗尽**（数析 §6.3 风险提示）——**按每批扩 5–6 张的节奏，**二用池到 2030 年前后会耗尽 117 张池**（推断）。**本批交付后二用池将从 16 张扩到 21 张（cover1–cover21），单次张从 101 降到 96。 **建议主理人评估「三用」策略或新增封面**（**产品决策，非数据结论**）。
13. **F18-B／F19-B／F20-B 三道门未回**——本批不开工等待（沿用批二十口径：**门未回不阻断开工**）；**本批的实测回收点＝F21-A（L134–L138 五课的完成率曲线），须与批十八 6 课／批二十 6 课两线并读**。

---

> 本规格书由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。
