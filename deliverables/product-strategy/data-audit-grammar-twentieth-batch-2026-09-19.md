# 数据盘点：第二十批·候选与造词成本（主候选 look forward to）

**日期**：2026-09-19 ｜ **类型**：实读代码/文件盘点（无数仓）｜ **成员**：数析
**方法**：单遍状态机提取引号内字符串（六态：`code`／`line_comment`／`block_comment`／`dq`／`sq`／`bt`，注释内字符串一律不入账，反斜杠转义按两字符吞掉），再按顶层 `^    number: N,` 切块，得「行号 → 课号（GL）／案号（HC）」映射。GL 命中 **23,027 条串**（英文口径 `^[A-Za-z0-9'’,.!?;: -]+$` **14,346 条**）；HC 命中 **5,594 条串**（英文口径 **4,450 条**）。**抽词器逐字复刻并实跑**：`grammarAmbushService.ts:195-213`（`GRAMMAR_WORDS` 148 唯一词 `:160-187` ＋ `CLOZE_STOP_WORDS` 30 词 `:190-193` ＋ 三级回退）与 `grammarBoostService.ts:243-246 / 249-395`（`FUNCTION_WORDS` 33 词 ＋ `keywordIndexes` 长度≥3 硬门 ＋ `buildCloze`），对 **16 句候选**跑 ambush 三级档位 ＋ boost 侧 **20 组现实 sourceRef 种子**。**复刻可信度用真服务交叉验证**（临时 vitest 探针，跑完即删）：真 `buildCloze` 在 `lesson-125-it-looks-nice:t1:variants:1` 输出 `It does not ___ nice.` / `look`，与我的 Node 复刻**逐字一致**（§4.3）。封面指派用**二分答案 ＋ 全枚举**（min-gap 目标，C(83,3)=91,881 组全枚举）。所有关键零值用 `grep -ow` **独立复验**（§附录 A3）。
**口径声明（重要）**：报告**一律以工作区现状为准**。审计期间 `grammarLessons.ts` md5 恒为 **`63360ca17f2aaaee392d5cf4e0dcb54c`**（23,980 行）、`huntCases.ts` md5 恒为 **`539eb614ce9a08c4c6c728126cb650f3`**（7,697 行），行数与 md5 **在审计全程未变**；所有数字出自该状态。**例外**：`grammarBoostService.ts` 在审计期间被并行改动（15:29，md5 `d9387d72011582a5da974e2a5a1cd526`）——§7 已按改动后的现状记录。
**范围**：候选池＝甲 **`look forward to`／`object to` 一族（主候选）**／乙 **感官动词大章（备选）**。本批核心＝**造词成本盘点**（两个方向各需造多少词、造什么、能否复用）。

---

## 指标概览

| 指标 | 本期（实读） | 上期（批十九审计） | 状态 |
|---|---|---|---|
| 课程 / 案件 / 错点 | **127 课 / 136 案 / 518 错点** | 124/133/506 | ✅ 全线上行 |
| 罪名（错点/承载案） | verb_form **121/80**·plural **95/89**·sv_agreement **75/59**·preposition **60/55**·tense **44/36**·word_order **43/31**·article **28/22**·missing_be **24/20**·run_on **14/12**·fragment **14/13** | 119/78·93/87·69/56·60/55·42/34·43/31·28/22·24/20·14/12·14/13 | ✅ 枚举 10 不动，`comparison` HC 仍 **0** |
| 封面池 | **117 张用 127 次（单次 107·二用 10·三用 0）**；二用张＝**cover1–cover10**（L1–L10 ＋ L118–L127 两段） | 117 张/124 次（单次 110·二用 7） | 🔴 **批十九把「二用池」从 7 张扩到 10 张**（§6） |
| 案号 | max **#136**，1–136 **连续无跳号无重号**；`reviewed` **136/136＝100%** | max #133 | ✅ 下号 **#137** |
| 课号 | 1–127 **连续无跳号无重号** | 1–124 | ✅ |
| 基建 | season-19 `{125,127}` 已在位（**19 季**）；m21 `afterLesson:127` 已在位（**21 里程碑**）；episode 止「一百二十七」 | season-18/m20 | ✅ 须续 season-20/m22 |
| **`forward` 全族** | **GL 0／HC 0**（`forward`／`forwards`／`forward to`／`look forward to`／`looking forward` 全零，含注释内亦为 0） | GL 0／HC 0 | 🔴 **主候选核心词＝纯空地，须 100% 新造** |
| **`object to` 全族** | **GL 0／HC 0**（`object`／`objects`／`objected`／`objection` 全零） | GL 0 | 🔴 同样纯空地 |
| 感官动词 | `sound*` **0**·`smell*` **0**·`taste*` **0**·`feels` **0**·`felt` **0**·**`feel` GL 26／HC 3**·`feeling` **1** | sound/smell/taste 0；feel 27 | ⚠️ **与批十九结论一致**：`feel` 是**已占用**的谓语位（L76 核心句） |
| `to + -ing` 底座 | **GL 81 处／26 个不同句子**（L120 33·L122 24·L124 12 占 69 处）；**HC 2 处** | — | ✅ 批十八已打厚，但**高度集中在 L120–L124** |
| 测试 | **61 文件 / 785 项全绿**；`tsc --noEmit` **0 错（exit 0）** | 61/774 | ✅ 基线已上移（审计期内一次并行改动造成的 4 项红已自行消解） |
| G-boost | **50 项全绿**；thin（＜2 改错题）＝**0 课**（全库最低 2 道，11 课压线）；`wrongToken` 违规 **0**；纯标点 `wrongMark` **0** | 50 项；thin=0 | ✅ 三护栏全守 |
| cloze 落点（候选 16 句） | ambush：**16/16 可落**——`look forward to` 族 **8/8 全走第①档但空位落在 `am/is/are/look/looks`**；感官族 **5/5 走第②档（空位＝`sounds`／`smells`／`tastes`，恰好是考点词）** | — | ⚠️ **主候选的空位质量是「假友好」——`forward` 永不成空位**（§4） |

## 洞察

1. **本批的门槛不是「难」，是「贵」：主候选 `look forward to` 在库里是一块彻底的空地，连一块砖都没有。** 逐形态实读（GL＋HC 双文件、含注释、`grep -ow` 独立复验）：`forward` **0**、`forwards` **0**、`forward to` **0**、`look forward to` **0**、`looking forward` **0**、`object` **0**、`object to` **0**。**这与批十九的 `look + 形容词`（16 处沉睡复现池、升格零成本）是两种完全不同的生产形态**——批十九是「给已有句子发身份」，批二十主候选是「先造出这门语言里最基础的词，再造句子」。**数析的判定：这不是「升格课」，是「造词课」**（§1 逐词清单）。

2. **但「造词」并不意味着「贵到不能做」——因为库里已有一个高度同构的先例：批十八的 `be used to + -ing`。** 实读：L120 一课就有 **33 处 `to + -ing`**（其中 `getting` 25＋`walking` 7），L122 **24 处**，L124 **12 处**——**新结构所需的「名字版（-ing）跟在 to 后面」这一整条手感，批十八已经教完并打了三层复现**。**`look forward to` 的教学增量因此只有两件事**：① 认识 `forward` 这个词；② 知道这里 `to` 是「门牌」而不是「垫板」（同一个判据 L120 已立：有 be 站着的 to 认名字版）。**推断：语法的教学成本低，词汇的造词成本高——本批的成本结构是「词贵、句便宜」**（§1.5）。

3. **「盼着什么事」那一侧的名词几乎不用造：`weekend`／`summer`／`party`／`birthday` 全在库，只有 `trip`／`holiday` 是 0。** 实读：`weekend` GL **7 串**（L15/24/29×3/40/49×2）＋HC **5 串**；`summer` GL **3**＋HC **5**；`party` GL **2**（L57 两处「The party is on June 2.」）＋HC **2**；`birthday` GL **146 串**（L56/111/117/118 为主）＋HC **9 串**——**这四个词甚至已经出现在「计划／日期」的句法位里，与本结构完全同构**。**0 的只有 `trip`（GL 0，HC 仅 1 处 token `"trip."` 在 #66 `:4183`）与 `holiday`（双 0）**。**结论：「盼着某件事」的落地句可以零造词**：`I am looking forward to the weekend.`／`...to my birthday.`／`...to the party.` 三句全部由在库词构成（§1.2）。

4. **真正贵的是「盼着做什么」那一侧——`see you` 有 4 处但全是 `nice to see you`（不定式），`-ing` 形式 `seeing` 双文件 0；`meeting`／`visiting` 也是双 0。** 实读：`see you` GL **4 串**（L87 `:16163`／`:16219`／`:16311` 全是 `It's nice to see you.`；L107 `:19948` 是 `The teacher wants to see you.`）——**4 处全是 `to + 原形`，没有一处 `to + seeing`**；`seeing` **0／0**；`meeting` **0／0**；`visiting` **0／0**。**而可用的既有 `-ing` 词是另一批**：`playing` **37／9**、`reading` **565／41**、`swimming` **66／6**、`cooking` **11／3**、`helping` **7／2**、`waiting` **6／2**。**结论：「盼着做某事」不必新造词——用 `playing`／`reading`／`going` 这类既厚又熟的 `-ing` 词即可**（§1.3），代价只是「盼着见你」这种最高频的中文表达在英语侧要改成「盼着一起玩／盼着去」之类（**产品需确认这是否可接受**）。

5. **时间词是这一族的另一半刚需，而它们的状态是「一半有、一半零」：`tomorrow` 在库（GL 37），`soon`／`next week`／`next month` 全零。** 实读：`tomorrow` GL **37 串**（L12 31 处为主，L13/16/29 各 2）＋HC **3 串**；`tonight` GL **2**；**`soon` GL 0／HC 0、`next week` 0／0、`next month` 0／0、`next year` 0／0**。**好消息**：`next` 本身 GL **140 处**（主力是 L79 `next to` 的 118 处，语义不同），`week` GL **39**、`month` GL **8**、`year` GL **7**——**即 `next week` 是「两个都在库、只是没搭过」的组合，不是生词**。**推断：`soon` 若不想造，可整句改用 `tomorrow`／`this weekend`（都在库）**（§1.4）。

6. **`object to` 这一半基本可以判「不做」——它连「盼着」那侧的情感抓手都没有，而它需要的名词（`decision`／`rule`／`price`／`idea`）在库里几乎全零。** 实读：`decision` **0／0**、`rule` **0／0**、`price` **0／0**、`question` **0／0**、`idea` GL 7／HC 0、`plan` GL 1／HC 2、`noise` GL 10／HC 4。**再叠加一条纪律证据**：批十九路线图 `:340` 与竞析 `:324` 都把它与 `look forward to` 并列登记为「B1 下一个硬结构」，但**批十九用户研究 `:190` 与路线图 `:124` 均把二者一起列入「全批不引入」**。**数析建议：批二十若要碰 `to + -ing` 家族，只做 `look forward to`，`object to` 单独立项或撤出**（§1.6）。

7. **感官动词（备选）的真实成本结构与主候选**相反**：它不需要造名词（`soup` 除外），但需要造 3 个新动词 ＋ 一批形容词，而且 `look` 已被批十九占用。** 实读：`sound*` **0／0**、`smell*` **0／0**、`taste*` **0／0**（`sounds`／`smells`／`tastes` 全零）；形容词侧 `good` **112／23**、`nice` **171／15**、`great` **7／0**、`cold` **204／9**、`hot` **25／5** 都在库，但 **`sweet` 0／0、`soft` 0／0、`strange` 0／0、`terrible` 0／0、`delicious` 0／0、`sour` 0／0、`salty` 0／0、`fresh` GL 0／HC 1**——**「味道／气味」类形容词几乎全空**。**更关键的排除项**：**`look` 已被批十九 L125–L127 连占 3 课**（3 课 `grammarLabel` 全部含 `look`），若感官章再纳入 `look`，同一个词会连上 4–6 课，**这是明确的形态红线**（§2.4）。

8. **`feel` 的 27 处（精确口径 26 个词次＋1 个 `feeling`）全部集中在 L76（21）与 L78（5），且 L76 的 `targetSentence` 就是 `I feel much better today.`** 逐条实读 28 行（27 处 `feel`＋1 处 id 串 `hunt-feel-better`）：L76 占 **21 个词次**（含 `targetSentence:14061`／`blocks:14063`／`dialogue:14075` 的 `Are you feeling better?`／`variants:14122`／`practice tokens:14161/14176/14204`／`answer:14232`），L78 占 **5**（`wrong:14466` 的 `I feel very better today.` 对照＋`correct:14468/14474`＋`tokens:14604`＋`answer:14606`）。**批十九报告说「27 处」，我实读是 27 处 `feel` 词次 ＋ 1 处 id 串——两者能对上（27 是词次口径）**。**结论：`feel` 不是「+1 个词」，而是「已被 L76 的 `much + 比较级` 占用的谓语位」——批十九的裁定（留作批二十独立候选）在数据上依然成立**（§2.3）。

9. **cloze 两条通道对主候选是「假友好」：ambush 侧 `looking forward to` 永远落不到 `forward` 上，落点退回 `am/is/are`（第①档）或 `look/looks`——考点词反而逃掉了。** 实读复刻（16 句全跑）：`I am looking forward to the trip.` → 档①，空位 **`am`**；`I look forward to the trip.` → 档①，空位 **`look`**；`She looks forward to the weekend.` → 档①，空位 **`looks`**。**根因**：`forward`（7 字母）与 `looking` 都**不在 `GRAMMAR_WORDS` 表内**，而 `am/is/are/look/looks` 都在——**`findIndex` 取第一个命中，`am` 永远排在 `looking` 前面**。**对比之下感官族是「真友好」**：`That sounds good.` → 档②，空位 **`sounds`**；`It smells good.` → 档②，空位 **`smells`**；`This soup tastes nice.` → 档②但空位 **`soup`**（`tastes` 被 `soup` 挤掉，`soup` 恰好是唯一需造的名词）。**boost 侧两族都友好**：`looking`（7）／`forward`（7）／`trip`（6）三词位各占约三分之一，`sounds`／`smells` 稳定占 55%（11/20）。**结论：主候选的「考点空洞」需要靠 `contrast`／`guided.spot` 承载，cloze 不能担纲**（§4）。

10. **封面池在批十九又消耗了 3 张单次张，可用池从 85 张降到 83 张，但最优指派反而更干净：`L128←cover11／L129←cover12／L130←cover13`，min-gap ＝ 117，可行解唯一。** 实读：单次张 **107 张**（cover11–cover117），二用张 **10 张**（cover1–cover10，对应 L1–L10 ＋ L118–L127）；可用张（在 L128–L130 三位都 ≥35 线）＝ **cover11–cover93 共 83 张**（`cover93` 在 L130 的 gap ＝ 37，压线过；`cover94` ＝ 36 亦过；**`cover94` 之后的边界由 `cover94`–`cover117` 在 L128 的最小 gap 决定：`cover117` 在 L128 的 gap ＝ 11，出局**——精确边界见 §6.3）。**最优解唯一**：`cover11`（L11 用过）／`cover12`／`cover13`，三张的 gap 全为 117，**min-gap ＝ 117，同 min-gap 解数 ＝ 1**（§6.4）。

11. **案号与课号两条连续性都完好，下一个可用案号 #137；番外案名单只有 5 案（#16–#20）。** 实读：案号 1–136 **连续无跳号无重号**、`reviewed` **136/136**；每案错点数分布 **4 处 113 案／3 处 10 案／2 处 10 案／5 处 2 案／6 处 1 案**（2–3 处集中在早期案 2–20、6 处是 #34、5 处是 #42/#43）。**未配课的番外案＝#16 hunt-white-cat／#17 hunt-sports-day／#18 hunt-pen-pal-letter／#19 hunt-fridge-note／#20 hunt-term-review 共 5 案**；空 `huntCaseIds` 的课 ＝ L2/3/5/6/8 共 5 课（批十九审计记录一致，纪律沿用）。**唯一**被两课共用的案件 ＝ `hunt-my-sister`（L14＋L25），其余 130 个 id 均一课一用（§7）。

12. **基建侧批十九的三项（season-19／m21／episode「一百二十七」）全部落地，批二十须续 season-20／m22，且守门测试会先红。** 实读：`grammarSeasons.ts:56` 末项 `{id:"season-19", min:125, max:127}`（**19 季**）；`GrammarPathPage.tsx:261-262` 末项 `can-do-m21 / afterLesson: 127`（**21 里程碑**）；episode 末项「小美的一天 一百二十七」（`:23788`），**下一个写「一百二十八」**。`grammarSeasons.test.ts` **4 项守门**（`:12` 区间覆盖／`:22` 互不重叠／`:36` label·hint 非空／`:43` 最高课号被覆盖），**忘加 season-20 立刻红**；`can-do-m*` 全仓测试引用数 ＝ **0**（`grep -rn "can-do-m" src --include=*.ts --include=*.tsx | grep -v GrammarPathPage.tsx` **无输出**），**纯纪律项、无守门**（§5）。

---

## 1. 造词成本专章（本批核心）

**判定口径**：「在库」＝该词在 GL 或 HC 的**引号内字符串**里至少出现过 1 次（含讲解串里的英文片段）；「须新造」＝两文件引号内字符串 **0 次**；数字同时给「词次（处）」与「承载串数（串）」，并**排除 `hunt-*` 形式的 id 串**（`hunt-trip-time` 这类 id 会让 `trip` 出现假阳性——这是本批最容易踩的坑，已验证 `trip` 在 GL 的真词次是 **0**、HC 是 **1**，见 §1.2 注）。

### 1.1 `look forward to` 族逐形态（GL＋HC 双文件）

| 形态 | GL 处 | GL 串 | HC 处 | HC 串 | 判定 |
|---|---|---|---|---|---|
| `forward` | **0** | 0 | **0** | 0 | 🔴 须新造 |
| `forwards` | **0** | 0 | **0** | 0 | （不需要，英式副词形） |
| `forward to` | **0** | 0 | **0** | 0 | 🔴 须新造 |
| `look forward` | **0** | 0 | **0** | 0 | 🔴 须新造 |
| `looking forward` | **0** | 0 | **0** | 0 | 🔴 须新造 |
| `look forward to` | **0** | 0 | **0** | 0 | 🔴 须新造 |
| `looking forward to` | **0** | 0 | **0** | 0 | 🔴 须新造 |
| `object`／`objects`／`objected`／`objection` | **0** | 0 | **0** | 0 | 🔴 全零 |
| `object to` | **0** | 0 | **0** | 0 | 🔴 须新造 |
| `toward`／`towards`／`backward`／`onward` | **0** | 0 | **0** | 0 | 零（无近邻干扰，也无可复用同族） |

> **独立复验**（`grep -o -i -w`，不经我的提取器）：`grep -c "look forward\|looking forward"` 在两文件均为 **0**；`forward`／`object`／`holiday`／`soon`／`smell`／`sound`／`taste` 的 `grep -ow` 计数**两文件全为 0**。**结论：主候选的核心词在库里是「绝对零」，不存在任何隐藏的沉睡复现池。**

### 1.2 「盼着什么事」——名词侧逐条（**结论：几乎不用造词**）

| 名词 | GL 处／串 | GL 所在课（行号） | HC 处／串 | 判定 |
|---|---|---|---|---|
| **`weekend`** | **7／7** | L29 `:5264`／`:5281`／`:5370-5371`（`What are you going to do this weekend?`）、L40 `:7301`（`I need a book for the weekend.`）、L49 `:8959`／`:8976`（`Any tips for the weekend?`） | **5／5** | ✅ **在库，且已在「计划」句法位** |
| **`summer`** | **3／3** | L18 `:3311`（讲解）、L25 `:4585`（`It rains a lot in summer.`）、L46 `:8417`（`Any plans for the summer?`） | **5／5** | ✅ 在库 |
| **`party`** | **2／2** | L57 `:10480`／`:10536`（`The party is on June 2.`） | **2／2** | ✅ 在库（但底座薄，仅 1 课） |
| **`birthday`** | **146／149** | 主力 L56（38）、L111（59）、L117（16）、L118（18） | **9／9** | ✅ **底座极厚** |
| `the weekend` | 3／3 | L40 `:7301`、L49 `:8959`／`:8976` | 0 | ✅ 定冠词搭配已有先例 |
| `my birthday` | 35／34 | L56 起 | 0 | ✅ 已有先例 |
| `a movie`／`the movie` | 25／8 | L15 `:2752`、L29 `:5267`、L109 `:20317` | 0 | ✅ 在库（可作「盼着看电影」的名词） |
| **`trip`** | **0**（真词；GL 里 `trip` 仅在 id 串 `hunt-trip-time` `:13667` 中出现，**不计**） | — | **1**（#66 `:4183` token `"trip."`，整句 `We have three day for the trip.`） | ⚠️ **GL 须新造；HC 有 1 处 token 可作锚点** |
| **`holiday`** | **0／0** | — | **0／0** | 🔴 须新造（**建议不做**：`weekend`／`summer` 已够用） |
| `weekends`／`parties`／`vacation` | 0／0 | — | 0／0 | 不需要 |

> **实读裁定**：「盼着**某件事**」这一侧**可以做到零造词**——`I am looking forward to the weekend.`／`...to my birthday.`／`...to the party.`／`...to the summer.` 四句全部由在库词构成。**产品若坚持要有 `trip`（旅行是「盼」的经典场景），成本是 1 个新名词**；HC 侧 #66 已有一个 `trip` token 可作为「回流锚点」（该案 `#66` 被 **L58** `:10830` 引用，是 `hunt-sports-report`）。

### 1.3 「盼着做什么」——动词侧逐条（**结论：不必造词，但「盼着见你」这个中文高频表达要绕开**）

| 动词 | 能否接 `-ing` | GL 处／串 | HC 处／串 | 判定 |
|---|---|---|---|---|
| **`see`** | — | **20／20** | **22／22** | 在库；**`see` 在 `GRAMMAR_WORDS` 表内**（`:160-187`） |
| **`see you`（短语）** | — | **4／4**：L87 `:16163`／`:16219`／`:16311`（`It's nice to see you.`）＋L107 `:19948`（`The teacher wants to see you.`） | **0**（HC tokens 里 `See you` 有 8 案，但是**两词序列**、非 `to + seeing`） | ⚠️ **4 处全是 `to + 原形`，无一处 `to + seeing`** |
| **`seeing`** | ✅ | **0／0** | **0／0** | 🔴 **须新造**（若要写 `...looking forward to seeing you.`） |
| `meet` | — | **10／10**（L11 `:2062`、L18 `:3251` 起 6 处、L57 `:10481`） | 4／4 | 在库（原形／`met` 8 处） |
| **`meeting`** | ✅ | **0／0** | **0／0** | 🔴 须新造 |
| `visit` | — | **8／8**（全在 L29 `:5276` 起，`be going to visit`） | 1／1 | 在库 |
| **`visiting`** | ✅ | **0／0** | **0／0** | 🔴 须新造 |
| **`playing`** | ✅ | **37／37**（L13 7·L34 9·L51 3·L93 2·L95 6·L98 5·L100 3·L122 1） | **9／9** | ✅ **在库且厚** |
| **`reading`** | ✅ | **565／569**（L42 58·L45 54·L46 41·L64 56·L77 32·L97 45·L98 56·L101 41·L102 44…） | **41／44** | ✅ **在库最厚** |
| **`going`** | ✅ | **112／114**（L29 82·L75 20 为主） | **14／15** | ✅ 在库（但 L29 是 `be going to` 的固定搭档，**若用 `going` 会与将来时撞型**，建议避开） |
| **`swimming`** | ✅ | **66／67** | 6／6 | ✅ 在库 |
| **`cooking`** | ✅ | **11／11**（L98 7·L99 4） | 3／3 | ✅ 在库 |
| **`helping`** | ✅ | **7／7**（其中 L47 `:8627`／`:8628` 是**错例** `I should to helping her.`） | 2／2 | ⚠️ 在库但**带着错例记忆**，慎用 |
| **`waiting`** | ✅ | **6／6**（L24 `:4377`、L61、L104） | 2／2 | ✅ 在库 |
| `travel` | — | **57／58** | 1／1 | 在库（`traveling` 6 处，L44/L46/L108） |
| **`seeing`／`meeting`／`visiting`／`travelling`** | ✅ | **全 0／0** | **全 0** | 🔴 四词均须新造（`travelling` 双写形为 0；`traveling` 单写形 GL 6 处存在） |

> **实读裁定**：**「盼着做某事」这一侧不必造词**——`playing`（37）／`reading`（565）／`swimming`（66）／`cooking`（11）／`waiting`（6）都是既厚又熟的 `-ing` 词，随便挑两个即可成句（如 `I am looking forward to playing football.`——`football` GL **61** 处、L13 `:2332` 即有 `They are playing football.`）。
> **唯一的取舍点**：`I am looking forward to seeing you.` 这句**最自然、最高频**的中文映射，需要新造 `seeing`（1 个词）。**替代方案**：用 `meeting`（也须造）、或用 `waiting`（在库但语义弱）、或整句换成「盼着一起玩／盼着去」。
> **数析建议**：**若要保留这句，成本就是 1 个 `seeing`；这是本批最值得花的那 1 个词**——因为 `see you` 已有 4 处底座，`seeing` 只是它的名字版，造出来能被 L87 的 `It's nice to see you.` 正向复用。

### 1.4 时间词逐条

| 时间词 | GL 处／串 | HC 处／串 | 所在课（行号） | 判定 |
|---|---|---|---|---|
| **`tomorrow`** | **37／37** | **3／3** | L12 31 处（`:2136`／`:2149`／`:2150` 等）、L13 2、L16 2、L29 2 | ✅ **在库，可直接用** |
| `tonight` | **2／2** | 0 | L29 `:5337`、L78 `:14454` | ✅ 在库 |
| `this weekend` | **3／3** | 0 | L29 `:5264`（含在 weekend 内） | ✅ 在库 |
| **`soon`** | **0／0** | **0／0** | — | 🔴 须新造 |
| **`next week`** | **0／0** | **0／0** | — | ⚠️ **组合须新造，但两个部件都在库**：`next` GL 140 处、`week` GL 39 处 |
| `next month`／`next year` | 0／0 | 0／0 | — | 同上（组合级新造） |
| `last week` | 7／7 | 2／2 | — | 在库（过去向，本结构用不上） |

> **实读裁定**：**时间词可零造词**——`tomorrow`（37 处）与 `this weekend`（3 处）都是现成的。**若产品要 `soon`，成本是 1 个新副词**（`soon` 在英语里是「不久」的高频词，但库内 `later`／`in a while` 也都为 0，**没有任何同义替代**）。
> **注意**：`next week` 这类「`next` ＋ 周期词」的组合，库里没有任何先例（`next` 的 140 处里 118 处是 `next to`「紧挨着」，另 22 处需逐条核；**本报告只确认 `next week` 整串为 0**）。若使用，属于**新句法搭配**而不仅是新词，建议改用 `tomorrow` 规避。

### 1.5 「不造新词」的替代方案评估（**这是本批最关键的一问**）

| 方案 | 做法 | 造词数 | 可行性 | 风险 |
|---|---|---|---|---|
| **A. 零造词版（全用既有 `-ing`）** | `I am looking forward to the weekend.`／`...to my birthday.`／`...to playing football.`／`...to reading.` | **0**（`forward` 仍须造 1 词，见注） | ✅ **可行** | 句意略「不地道」（英语母语者说 `look forward to seeing you`／`to the trip` 更自然）；但**语法与考点完全成立** |
| **B. 最小造词版（＋`seeing`）** | 上表 ＋ `I am looking forward to seeing you.` | **2**（`forward`＋`seeing`） | ✅ **推荐** | 无——`seeing` 可被 L87 `It's nice to see you.` 正向复用 |
| **C. 完整造词版（＋`trip`／`soon`／`holiday`）** | A/B ＋ `...to the trip.` ＋ `...soon.` | **5**（`forward`／`seeing`／`trip`／`soon`／`holiday`） | ✅ 可行 | 造词数上升；`holiday` 与 `weekend` 语义重叠，**不建议** |
| **D. 完全不造词（撤出主候选）** | 改做感官动词或其它候选 | **0 新结构词，但需 3 个新感官动词** | ✅ | 见 §2 |

> **注（无法回避的 1 个词）**：无论选哪个方案，**`forward` 这 1 个词都必须新造**——它是这个结构的**唯一不可替代成分**（`look forward to` 的语义重心全在 `forward`）。**故「完全不造词」在这条线上不可能实现；最小成本 ＝ 1 个词（`forward`），推荐成本 ＝ 2 个词（`forward` ＋ `seeing`）。**
> **造词的可复用性**：`forward` 造出来后，**只能服务 `look forward to` 这一族**（库里 `forward` 没有其它搭配位：`look forward to`／`put forward`／`forward the email` 后两者对 A2 用户过难，**不构成复用**）；`seeing` 造出来后**可被 L87 的 `see you` 正向复用**。**结论：`forward` 是「一次性投入」，`seeing` 是「可复用投入」。**

### 1.6 `object to` 的成本专评（**建议不做**）

| 项 | 实读 | 判定 |
|---|---|---|
| `object` 全族 | GL 0／HC 0 | 🔴 须新造 |
| 需要的名词（反对的对象） | `decision` 0／0、`rule` 0／0、`price` 0／0、`question` 0／0、`idea` GL 7／HC 0、`plan` GL 1／HC 2、`noise` GL 10／HC 4 | 🔴 **几乎全空**（唯一像样的 `noise` 只有 L121 4 处为主） |
| 情感抓手 | 「反对／不赞成」在中文学习动机里**远弱于**「期待」 | ⚠️ 教学价值低 |
| 纪律状态 | 批十九路线图 `:340` 与竞析 `:324` 均登记为「B1 下一个硬结构」；批十九用户研究 `:190`／路线图 `:124` 均列入「全批不引入」 | ✅ 无纪律冲突，但**从未被任何一版 PRD 正面立项** |
| **综合** | **造词 ≥3（`object`＋`decision/rule` 之一＋…），且无情感抓手、无复用出口** | 🔴 **建议撤出或单独立项；批二十只做 `look forward to`** |

### 1.7 造词成本总表（**本批核心结论**）

| 候选 | 必须新造的词 | 可选新造的词 | 最小造词数 | 推荐造词数 | 造词可复用性 |
|---|---|---|---|---|---|
| **甲 `look forward to`（主候选）** | **`forward`** | `seeing`（推荐）／`trip`／`soon`／`holiday` | **1** | **2** | `seeing` 可被 L87 `see you` 复用；`forward` 一次性 |
| 甲′ `look forward to` ＋ `object to` | `forward`＋`object` | `seeing`／`decision`／`rule`／`trip`／`soon` | **2** | **5+** | `object` 家族无复用出口 |
| **乙 感官动词大章（备选）** | **`sound(s)`／`smell(s)`／`taste(s)`**（3 个动词） | `sweet`／`soft`／`strange`／`delicious`／`fresh` 等形容词；`soup`（名词） | **3** | **5–8** | `sound*` 家族可与 `look`（批十九）形成「感官动词矩阵」，**复用性中等**；形容词可跨课复用 |
| 丙 维持批十九结论（撤出/折卡） | 0 | 0 | 0 | 0 | — |

> **数析结论（一句话）**：**主候选的造词成本是「1 个必须 ＋ 1 个建议 ＝ 2 个词」，这是可接受的；备选感官章的造词成本是「3 个动词 ＋ 若干形容词」，比主候选贵。从造词成本看，主候选优于备选。** 但主候选的另一个隐性成本是「cloze 落点假友好」（§4）——**产品需在两个成本之间权衡：主候选＝词贵、题面弱；备选＝词更多、但题面天然强（`sounds`／`smells`／`tastes` 直接成空位）。**

---

## 2. 语料盘点（逐短语读上下文）

口径：**GL** ＝ `src/data/grammarLessons.ts`（23,027 条引号串）；**HC** ＝ `src/data/huntCases.ts`（5,594 条）。「处」＝短语出现次数，「串」＝承载该短语的字符串条数。**讲解串里的英文片段同样被命中**，故同时给「处」与「串」。**`hunt-*` 形式的 id 串已从词频中剔除**（避免 `hunt-trip-time` 之类假阳性）。

### 2.1 批十九新课（L125–L127）的现成模板（逐课形态，供批二十照抄）

| 课 | 行范围 | 行数 | `examples` | `contrast` | `variants` | `practice` | `guided` | `sceneSwings` | `dialogue` | `blocks` |
|---|---|---|---|---|---|---|---|---|---|---|
| L125 | 23397–23590 | 194 | 4 | 6 | 3 | 5 | 6 | 3 | 3 | 2 |
| L126 | 23591–23784 | 194 | 4 | 6 | 3 | 5 | 6 | 3 | 3 | 2 |
| L127 | 23785–23981 | 197 | 4 | 6 | 3 | 5 | 6 | 3 | 3 | 2 |

> **实读方式**：用临时 vitest 探针在运行时读取 `grammarLessons` 逐课数组长度（跑完即删），与行差法交叉验证一致。**这是批二十新章的现成结构模板**（L124 同形态：191 行）。

### 2.2 感官动词逐形态（GL／HC）

| 词 | GL 处 | GL 串 | 逐课分布 | HC 处 | HC 串 | 判定 |
|---|---|---|---|---|---|---|
| `sound` | **0** | 0 | — | **0** | 0 | 🔴 须新造 |
| `sounds` | **0** | 0 | — | **0** | 0 | 🔴 须新造 |
| `sounded` | **0** | 0 | — | 0 | 0 | 不需要 |
| `smell` | **0** | 0 | — | **0** | 0 | 🔴 须新造 |
| `smells` | **0** | 0 | — | **0** | 0 | 🔴 须新造 |
| `smelled`／`smelt` | **0** | 0 | — | 0 | 0 | 不需要 |
| `taste` | **0** | 0 | — | **0** | 0 | 🔴 须新造 |
| `tastes` | **0** | 0 | — | **0** | 0 | 🔴 须新造 |
| `tasted` | **0** | 0 | — | 0 | 0 | 不需要 |
| **`feel`** | **26** | 26 | **L76 21·L78 5** | **3** | 3 | ⚠️ **已占用（见 §2.3）** |
| `feels` | **0** | 0 | — | 0 | 0 | 🔴 须新造 |
| `felt` | **0** | 0 | — | 0 | 0 | 🔴 须新造 |
| `feeling` | **1** | 1 | L76 `:14075` | 0 | 0 | 在库（1 处） |
| **`look`／`looks`／`looked`／`looking`** | **166／143／1／15** | — | **L125 31·L126 59·L127 57**（look）等 | 22／14／0／0 | — | 🔴 **已被批十九占用（见 §2.4）** |

> **独立复验**：`grep -o -i -w "sound"／"smell"／"taste"` 在两文件的计数**全为 0**（含注释）。**批十九审计的「全 0」结论在批十九交付后仍然成立。**

### 2.3 `feel` 的 27（28 行）处逐条（**实读确认：全是 L76 的同一句回响**）

| # | 行号 | 课 | 字段 | 原文 |
|---|---|---|---|---|
| 1 | `:14058` | L76 | `dialogueEn` | `I feel much better today.` |
| 2 | `:14061` | L76 | **`targetSentence`** | **`I feel much better today.`（L76 核心句）** |
| 3 | `:14063` | L76 | `blocks` | `{ text: "I feel", role: "我觉得（身体感觉）" }` |
| 4 | `:14069` | L76 | `examples` | `I feel much better today.` |
| 5 | `:14075` | L76 | `dialogue` | `Are you feeling better?`（`who: "npc"`，妈妈台词）**← 全库唯一 `feeling`** |
| 6 | `:14077` | L76 | `dialogue` | `I feel much better today.`（`who: "me"`） |
| 7 | `:14083` | L76 | `contrast.correct` | `I feel much better.` |
| 8 | `:14090` | L76 | `contrast.correct` | `I feel much better.` |
| 9 | `:14100` | L76 | `contrast.wrong` | `I feel much better today.`（作为「错」的对照侧） |
| 10 | `:14109` | L76 | `contrast.correct` | `I feel much better today.` |
| 11 | `:14116` | L76 | `contrast.correct` | `I feel much better today.` |
| 12 | `:14122` | L76 | `variants` | `{ label: "肯定", en: "I feel much better today." }` |
| 13 | `:14143` | L76 | `summary.points` | `"I feel much better today. —— 加力小词上岗"` |
| 14 | `:14152` | L76 | `guided.before` | `I feel` |
| 15 | `:14161` | L76 | `guided.tokens` | `["I", "feel", "much", "better", "today."]` |
| 16 | `:14162` | L76 | `guided.answer` | `I feel much better today.` |
| 17 | `:14176` | L76 | `guided.tokens` | `["I", "feel", "very", "better", "today."]`（错例 tokens） |
| 18 | `:14193` | L76 | `guided.promptZh` | `句子变身：「I feel much better today.」…` |
| 19 | `:14194` | L76 | `guided.replaceBase` | `I feel much better today.` |
| 20 | `:14204` | L76 | `practice.tokens` | `["I", "feel", "much", "better", "today."]` |
| 21 | `:14206` | L76 | `practice.answer` | `I feel much better today.` |
| 22 | `:14232` | L76 | `practice.answer` | `I feel much better today.` |
| — | `:14235` | L76 | `huntCaseIds` | `["hunt-feel-better"]`（**id 串，非词次**） |
| 23 | `:14466` | L78 | `contrast.wrong` | `I feel very better today.`（`much` vs `very` 的错侧） |
| 24 | `:14468` | L78 | `contrast.correct` | `I feel much better today.` |
| 25 | `:14474` | L78 | `contrast.correct` | `I feel much better today.` |
| 26 | `:14604` | L78 | `practice.tokens` | `["I", "feel", "much", "better", "today."]` |
| 27 | `:14606` | L78 | `practice.answer` | `I feel much better today.` |

> **实读结论（逐条核过）**：**`feel` 的 27 个词次分布在 28 行里（第 23 行 `:14235` 是 id 串、不是词次），全部集中在 L76（21 个词次）与 L78（5 个词次）**，且**全部是 `I feel much better today.` 这一句的变体／引用**——**没有一处是独立的第二句**。**这确认了批十九的判定：`feel` 不是「感官动词」，而是「much + 比较级」这句的谓语动词。**
> **HC 侧 `feel` 3 处**：`#56` `:3572`（token，整句 `I feel tired today.`——**注意：这句其实就是 `feel + 形容词`，但它在案件里不带考点**，该案 4 个错点是 `should to`／`rests`／`give`／`advices`）、`#85` `:5353`（token，`I feel very better today.`，考点是 `very→much`）、`#87` `:5472`（token，同形，考点 `very→much`）。**另**：`#84` `:5347` 是 id 串 `hunt-feel-better`。
> **推断**：**若批二十做感官动词章，`feel` 是「半占用」状态**——它的句法位（主语＋feel＋形容词）已被 L76 使用，但**教学点不是 `feel` 而是 `much`**。**这与批十九的裁定一致：`feel` 可留作独立候选，但不宜与 `look` 同章**（因为 `look` 已被 L125–L127 占满）。

### 2.4 `look` 是否应排除（**结论：必须排除**）

| 证据 | 实读 |
|---|---|
| L125／L126／L127 的 `grammarLabel` | `看起来怎样 · look 中间站，后面跟「怎么样」`（`:23399`）／`换人换形 · you look / she looks`（`:23593`）／`收口 · 零新知（喊人看 vs 说样子）`（`:23787`）——**3 课全部以 `look` 为核心** |
| 全库含 `look` 的 `grammarLabel` | **恰好 3 条**，即 L125／L126／L127（**批十九之前为 0，批十九之后为 3**） |
| `look` 家族词次 | GL `look` **166**（L125 31·L126 59·L127 57 ＝ 147，占 89%）／`looks` **143**（L125 55·L126 37·L127 42 ＝ 134） |
| HC 侧 | L134／L135／L136 三案（`#134`／`#135`／`#136`）全部围绕 `look`，`look` 22 处、`looks` 14 处 |

> **实读裁定**：**`look` 必须排除出感官动词章。** 批十九刚用 3 课 ＋ 3 案把 `look + 形容词` 立完岗，若感官章再纳入 `look`，**同一个词连上 4–6 课**，违反「一课一增量」的既有纪律。**感官章若做，范围应是 `sound`／`smell`／`taste`（＋可选 `feel` 独立课），显式声明「`look` 已在第十九季」。**

### 2.5 感官章所需形容词逐条（**结论：基础形容词在库，「味道／气味」类几乎全空**）

| 形容词 | GL 处／串 | HC 处／串 | 判定 |
|---|---|---|---|
| `good` | **112／106** | **23／21** | ✅ 在库（最厚） |
| `nice` | **171／168** | **15／17** | ✅ 在库 |
| `great` | **7／7** | 0 | ✅ 在库（薄） |
| `cold` | **204／202** | 9／10 | ✅ 在库 |
| `hot` | **25／25** | 5／5 | ✅ 在库 |
| `warm` | **3／3**（全在 L19） | 0 | ⚠️ 薄 |
| `dark` | **48／48** | 2／2 | ✅ 在库 |
| `loud` | **8／8**（L58 4·L59 4） | 2／2 | ⚠️ 在库（但**教学点是 `loudly` 副词**，L58 `:10711`） |
| `quiet` | **7／7** | 3／3 | ✅ 在库 |
| `bad` | **3／3**（L17/31/89 各 1） | 0 | ⚠️ 薄 |
| `interesting` | **2／2**（L17·L113） | 0 | ⚠️ 薄 |
| `boring`／`bored`／`excited` | **34／59／5** | 6／10／8 | ✅ 在库（L113 主场，**已占用「-ed/-ing 形容词」**） |
| **`sweet`** | **0／0** | **0／0** | 🔴 须新造 |
| **`soft`** | **0／0** | **0／0** | 🔴 须新造 |
| **`strange`** | **0／0** | **0／0** | 🔴 须新造 |
| **`terrible`** | **0／0** | **0／0** | 🔴 须新造 |
| **`wonderful`** | **0／0** | **0／0** | 🔴 须新造 |
| **`delicious`** | **0／0** | **0／0** | 🔴 须新造 |
| **`sour`／`salty`／`smooth`** | **0／0** | **0／0** | 🔴 须新造 |
| **`fresh`** | **0／0** | **1／1**（#19 `:936` token `"fresh."`） | 🔴 GL 须新造 |
| `sad`／`young`／`perfect`(1)／`lovely`／`awful`／`bitter`／`noisy`／`funny` | 近全 0（`perfect` GL 1、`funny` HC 1） | — | 🔴 大多须新造 |

> **实读裁定**：**感官章可以只用 `good`／`nice`／`cold`／`hot`／`loud`／`quiet` 这类在库形容词**（`That sounds good.`／`This soup tastes nice.`／`It smells good.` 三句**全部零造词**），**但若要用「甜／软／怪」这类感官专属形容词，就得新造 3–5 个**。**注意 `soup`（GL 0／HC 2）与 `rice`（GL 0／HC 1）也是 0**——「尝汤」这个最自然的场景需要新造 `soup`。

---

## 3. 罪名承载预判

**10 个 HUNT 枚举**（`huntService.ts`：`tense`／`sv_agreement`／`missing_be`／`article`／`plural`／`preposition`／`fragment`／`run_on`／`word_order`／`verb_form`；`types.ts:419-430` 另列 `comparison`，**HC 侧 0 次使用**）。

### 3.1 甲 `look forward to` 可植的错

| 罪名 | 能否承载 | 具体错例（预判） | 库内先例 |
|---|---|---|---|
| **`verb_form`** | ✅✅ **主场** | `I am looking forward to go.`（→ `going`）——**这正是 Cambridge 原文级 Not 例** | L120 `:22466` 已有同型错例 `I am used to geting up early.`（`geting→getting`）；L129 `#129` `:7369` correction `to getting` |
| **`preposition`** | ✅✅ **强** | ① `I am looking forward to the weekend.` 漏 `to`（→ 补 `to`）；② `I am looking forward for the weekend.`（→ `to`） | L129 `#129` `:7369` 正是「to 不能丢」型（`getting→to getting`）；`#44` `:2794` 是 `on→in` 介词案 |
| **`sv_agreement`** | ✅ | `She look forward to the weekend.`（→ `looks`） | `#133/#134/#135/#136` 全部有 `sv_agreement`；L25 三单 -s 底座厚 |
| **`missing_be`** | ✅ **薄档可用** | `I looking forward to the weekend.`（→ 补 `am`） | 已有 20 案结构；`#128` `:7323` 刚用过（`missing_be` 在 L119–L127 段内出现 1 次） |
| **`word_order`** | ✅ | `I am looking to forward the weekend.`（词序错） | 43 处／31 案底座厚 |
| `article` | ✅ | `I am looking forward to weekend.`（→ `the weekend`） | `#127` `:7286`（L118 段）、`#124` `:7147` 刚用过；**L40 `:7301` `for the weekend` 已有 `the` 先例** |
| `tense` | ⚠️ 弱 | 结构本身与时间无关；只能靠「回流旧点」承载 | — |
| `run_on`／`fragment` | ⚠️ 需长句 | 「盼着…因为…」可造 `because/so` 与残句错 | 薄档（14／14） |
| `plural`／`comparison` | ❌ 不适用 | — | — |

> **预判：甲方向至少能稳定承载 5 个罪名的「新错」（`verb_form`／`preposition`／`sv_agreement`／`article`／`missing_be`），其中 `verb_form` ＋ `preposition` 是真正的考点双核**（与 Cambridge 的 Not 例一一对应）。**薄档罪名中 `missing_be`（24／20）、`article`（28／22）容易带；`fragment`（14／13）、`run_on`（14／12）需要造长句，成本高。**

### 3.2 乙 感官动词可植的错

| 罪名 | 能否承载 | 具体错例（预判） |
|---|---|---|
| **`sv_agreement`** | ✅✅ **主场** | `That sound good.`（→ `sounds`）／`It smell good.`（→ `smells`）——**与批十九 `look/looks` 完全同构** |
| **`verb_form`** | ✅ | `It is smell good.`（→ 去 `is`／`smells`）——**同 L125 的「中间不站 is」** |
| **`missing_be`** | ⚠️ 反过来 | 感官动词章的核心是**「不要 be」**（`It sounds good.` 而非 `It is sounds good.`）——**这其实是 `verb_form` 而非 `missing_be`** |
| `word_order`／`plural`／`tense`／`article`／`preposition` | ✅（回流型） | 与甲相同，均靠旧点回流 |
| `run_on`／`fragment` | ⚠️ 需长句 | — |

> **预判：乙方向的罪名谱与批十九 `look` 高度重叠（`sv_agreement` ＋ `verb_form`），增量有限**——这也是「备选」的直接数据理由。

### 3.3 两方向的罪名风险对比

| 项 | 甲 `look forward to` | 乙 感官动词 |
|---|---|---|
| 新错型数量 | **3–5 个**（`verb_form`／`preposition`／`sv_agreement`／`article`／`missing_be`） | **2–3 个**（`sv_agreement`／`verb_form`／`word_order`） |
| 与批十九的重叠 | **低**（批十九是 `sv_agreement`＋`verb_form`；甲的考点是「`to` 后接 `-ing`」＝`verb_form`＋`preposition`） | **高**（几乎完全重叠） |
| 与批十八的重叠 | **中**（同一个 `to + -ing` 家族，但判据不同：批十八是「有 be 认名字版」，甲是「门牌 to 认名字版」） | 低 |
| 薄档可带性 | `article` ✅／`missing_be` ✅ | `article` ✅／`missing_be` ⚠️（语义不顺） |

---

## 4. cloze 落点预演

### 4.1 ambush 通道（`grammarAmbushService.ts:195-213` 逐字复刻）

`GRAMMAR_WORDS` 实读 **148 个唯一词**（`:160-187`，共 149 条目含 1 个重复 `would`），`CLOZE_STOP_WORDS` **30 词**（`:190-193`），三级回退见 `:195-213`。

| 候选句 | 命中档 | 空位下标 | 空位词 | clozeText |
|---|---|---|---|---|
| **`I am looking forward to the trip.`** | ① | 1 | **`am`** | `I ___ looking forward to the trip.` |
| **`I am looking forward to seeing you.`** | ① | 1 | **`am`** | `I ___ looking forward to seeing you.` |
| **`She is looking forward to the weekend.`** | ① | 1 | **`is`** | `She ___ looking forward to the weekend.` |
| `I look forward to the trip.` | ① | 1 | **`look`** | `I ___ forward to the trip.` |
| `She looks forward to the weekend.` | ① | 1 | **`looks`** | `She ___ forward to the weekend.` |
| `We look forward to seeing you.` | ① | 1 | **`look`** | `We ___ forward to seeing you.` |
| `They look forward to the weekend.` | ① | 1 | **`look`** | `They ___ forward to the weekend.` |
| `I am looking forward to my birthday.` | ① | 1 | **`am`** | `I ___ looking forward to my birthday.` |
| **`That sounds good.`** | **②** | 1 | **`sounds`** | `That ___ good.` |
| `That sounds great.` | **②** | 1 | **`sounds`** | `That ___ great.` |
| **`This soup tastes nice.`** | **②** | 1 | **`soup`** | `This ___ tastes nice.` |
| `The soup tastes nice.` | **②** | 1 | **`soup`** | `The ___ tastes nice.` |
| `It tastes nice.` | **②** | 1 | **`tastes`** | `It ___ nice.` |
| **`It smells good.`** | **②** | 1 | **`smells`** | `It ___ good.` |
| `The soup smells nice.` | **②** | 1 | **`soup`** | `The ___ smells nice.` |
| `I object to it.` | **②** | 1 | **`object`** | `I ___ to it.` |

> **实读结论（主候选）**：**`forward` 与 `looking` 都不在 `GRAMMAR_WORDS` 表内**（`look`／`looks` 在，`looking` **不在**）→ **8 句 `look forward to` 全走第①档，但空位全部落在 `am`／`is`／`look`／`looks` 上，考点词 `forward`／`looking` 永远不会被抽空。** 这是「假友好」：**空位确实落下来了（题出得来），但落点不是考点。**
> **实读结论（备选）**：**感官族的空位恰好就是考点词**——`sounds`／`smells`／`tastes` 都不在词表里（第②档实词回退），但因**长度 ≥3 且非停用词**，空位仍落在它们身上。**这是「真友好」。**（唯一例外：`This soup tastes nice.` 的空位被 `soup` 抢走，因为 `findIndex` 取最左——句子改短成 `It tastes nice.` 即可把空位交还 `tastes`。）

### 4.2 boost 档 1 通道（`grammarBoostService.ts:249-395` 逐字复刻）

`FUNCTION_WORDS` **33 词**（`:243-246`）；`keywordIndexes`（`:249-257`）硬门为 **`clean.length >= 3` 且非功能词**。

| 候选句 | 可落词位（下标,词） | 20 组现实种子答案分布 | 考点词能否成空位 |
|---|---|---|---|
| `I am looking forward to the trip.` | (2,looking)(3,forward)(6,trip) | `looking`×7 `forward`×7 `trip`×6 | ✅ **能**（3 位各约 1/3） |
| `I am looking forward to seeing you.` | (2,looking)(3,forward)(5,seeing) | `looking`×7 `forward`×7 `seeing`×6 | ✅ 能 |
| `She is looking forward to the weekend.` | (2,looking)(3,forward)(6,weekend) | `looking`×7 `forward`×7 `weekend`×6 | ✅ 能 |
| **`That sounds good.`** | (1,sounds)(2,good) | **`sounds`×11 `good`×9** | ✅ **能（55%）** |
| `This soup tastes nice.` | (1,soup)(2,tastes)(3,nice) | `tastes`×7 `soup`×7 `nice`×6 | ✅ 能 |
| **`It smells good.`** | (1,smells)(2,good) | **`smells`×11 `good`×9** | ✅ **能（55%）** |

> **种子口径**：`lesson-128-{slug}:t1:{variants|examples|practice|sceneSwings|dialogue}:{0..3}` 共 20 组。

### 4.3 词表归属 + 复刻可信度

| 词 | 在 `GRAMMAR_WORDS`（ambush）？ | 在 boost `FUNCTION_WORDS`？ | 长度 | boost 可作空位？ | ambush 落点 |
|---|---|---|---|---|---|
| **`forward`** | ❌ **否** | ❌ 否 | 7 | ✅ 是 | **永不**（被 `am`／`look` 抢占） |
| **`looking`** | ❌ **否** | ❌ 否 | 7 | ✅ 是 | **永不**（同上） |
| `look` | ✅ **是** | ❌ 否 | 4 | ✅ 是 | ✅ 是（但只限 `I look forward to…` 这类无 be 句） |
| `looks` | ✅ 是 | ❌ 否 | 5 | ✅ 是 | ✅ 是（同上） |
| **`seeing`** | ❌ 否 | ❌ 否 | 6 | ✅ 是 | 不适用（句中位置被 `am`／`looking` 挡） |
| **`sounds`** | ❌ **否** | ❌ 否 | 6 | ✅ 是 | ✅ **是（第②档，落点即考点）** |
| **`smells`** | ❌ 否 | ❌ 否 | 6 | ✅ 是 | ✅ **是（第②档）** |
| **`tastes`** | ❌ 否 | ❌ 否 | 6 | ✅ 是 | ⚠️ 是（需句首不是名词，见 §4.1） |
| `feel` | ❌ 否 | ❌ 否 | 4 | ✅ 是 | ⚠️ 是（第②档） |
| `trip` | ❌ 否 | ❌ 否 | 4 | ✅ 是 | —（名词，非考点） |
| `weekend` | ❌ 否 | ❌ 否 | 7 | ✅ 是 | — |
| `soon`／`tomorrow` | ❌ 否 | ❌ 否 | 4／8 | ✅ 是 | — |

**真服务交叉验证**（临时 vitest 探针，跑完即删）：

```
真服务输出（当前 grammarBoostService.ts md5 d9387d72…）：
  lesson-125-it-looks-nice:t1:variants:1  | It does not ___ nice.  | look  | close/look/does/party
  lesson-126-you-look-tired:t1:variants:1 | You do not look ___.    | tired | tired/nurse/eight/often
  lesson-127-two-look-faces:t1:variants:1 | The sky ___ not look dark. | does | know/does/did/do
我的 Node 复刻（同种子）：
  It does not look nice.  -> cloze="It does not ___ nice."  ans="look"   ✅ 逐字一致
  You do not look tired.  -> cloze="You do not look ___."   ans="tired"  ✅ 逐字一致
```
——**复刻可信。**

### 4.4 cloze 结论（本批最该让产品看到的一条）

> **主候选的 cloze 是「出得来题、考不到点」**：ambush 通道 8/8 句的空位都在 `am/is/look/looks`，**`forward`／`looking` 作为考点词永远不成为空位**；boost 通道虽然三词位平权（`looking`／`forward`／`trip` 各约 1/3），但那是「随机抽实词」的结果，**不是「本课语法点被抽中」**。
> **备选的 cloze 是「出得来题、正好考到点」**：感官族的空位稳定落在 `sounds`／`smells` 上（55%）。
> **若产品选甲，需明确：主候选的考点承载要靠 `contrast`（对比卡）与 `guided.spot`（找错题），不能靠 cloze。** 实读依据：L125–L127 的 `guided.spot` 池深分别为 4 道（探针实跑），`contrast` 各 6 条——**模板是现成的**（§7）。

---

## 5. 基建护栏

| 项 | 实读现状 | 行号 | 批二十动作 |
|---|---|---|---|
| season 分组 | 共 **19 季**；末项 `{id:"season-19", label:"第十九季 · 我看到的和感觉到的", hint:"它看起来不错、你看起来很累、同一个 look 两张脸……", min:125, max:127}` | `grammarSeasons.ts:56` | **追加 `season-20`**（`min ≥ 128`，且 `min > 127` 否则「互不重叠」红） |
| season 守门测试 | **4 项**：`:12` 每课号落在某季／`:22` 互不重叠且 min≤max／`:36` label·hint 非空／`:43` 最高课号被覆盖 | `grammarSeasons.test.ts`（48 行，md5 `2c74e489…`） | **忘加即红，不会静默** |
| 里程杈 | 共 **21 个**；末项 `can-do-m21 / afterLesson: 127`（标题「我能说出看到的东西是什么样」，samples 3 句） | `GrammarPathPage.tsx:261-262` | **追加 `can-do-m22`（afterLesson 127＋N）** |
| 里程碑守门 | 全仓 `can-do-m*` 测试引用数 ＝ **0**（`grep -rn "can-do-m" src --include=*.ts --include=*.tsx \| grep -v GrammarPathPage.tsx` **无输出**） | — | ⚠️ **纯纪律项，无守门**（漏加不会红，需人工核） |
| 关 1 解锁 | `const prev = grammarLessons.find((item) => item.number === lesson.number - 1);` | `lessonService.ts:157` | 课号必须 1–128 连续，**缺号永久锁死** |
| 课号连续性 | **1–127 连续、无跳号、无重号**（127 个 `^    number:`，去重后仍 127） | — | ✅ |
| 案号连续性 | **1–136 连续、无跳号、无重号**（136 个 `^    number:`） | — | ✅ 下号 **#137** |
| `reviewed` 覆盖 | **136/136 ＝ 100%** | — | ✅ |
| episode 写法 | 末项「小美的一天 一百二十七」（`:23788`） | `:23788` | **下一个写「一百二十八」**（先例：`一百二十四`→`一百二十五`→…→`一百二十七`） |
| 封面字段 | `cover?: string`（可选，缺省回退 scene SVG） | `types.ts:590` | **池耗尽不阻断上线** |
| 零术语红线 | `GRAMMAR_ZERO_TERMS` 28 词；`grammarLessons.test.ts` 有 4 项守门（`:105` label／`:114` oneLineRule／`:123` summary.rule／`:200` 讲解三字段） | `grammarZeroTerms.ts`、`grammarLessons.test.ts` | ⚠️ **批二十新章文案须避开「介词」（`to` 是介词这一讲法不能直接出现）**——批十八已用「门牌」这个词替代 |
| 练习守门 | 每课 `practice ≥4` 且含否定/疑问变体（`:11`）；tokens 词集与 answer 一致（`:31`）；干扰项不与答案重复（`:52`）；答案跨课复现 ≤6 课（`:163`） | `grammarLessons.test.ts` | 新章照抄模板即可过线 |

---

## 6. 封面池专章（含最优指派与最优性说明）

### 6.1 容量账（实读 `^    cover: coverN,`，**127 次命中**）

| 项 | 实读 |
|---|---|
| 使用次数总计 | **127** |
| 去重张数 | **117** |
| **单次池** | **107 张：`cover11`–`cover117`** |
| **二用池** | **10 张：`cover1`–`cover10`** |
| **三用池** | **0 张** |
| 资产文件 | `src/assets/lessons/` 共 **117 张 jpg**（`lesson-1..117.jpg`），**`lesson-118.jpg` 及以后不存在** |
| 无专属资产课 | **L118–L127 共 10 课**（全部回落池内复用 `cover1`–`cover10`） |

**二用张逐张（实读行号）**：

| 张 | 第一次用 | 第二次用 | 若用在 L128 的三用间距 |
|---|---|---|---|
| `cover1` | L1 `:144` | L118 `:22046` | **10** ❌ |
| `cover2` | L2 `:316` | L119 `:22242` | **9** ❌ |
| `cover3` | L3 `:498` | L120 `:22436` | **8** ❌ |
| `cover4` | L4 `:680` | L121 `:22630` | **7** ❌ |
| `cover5` | L5 `:862` | L122 `:22824` | **6** ❌ |
| `cover6` | L6 `:1043` | L123 `:23018` | **5** ❌ |
| `cover7` | L7 `:1225` | L124 `:23212` | **4** ❌ |
| `cover8` | L8 `:1407` | **L125 `:23402`** | **3** ❌ |
| `cover9` | L9 `:1589` | **L126 `:23596`** | **2** ❌ |
| `cover10` | L10 `:1771` | **L127 `:23790`** | **1** ❌ |

> **与批十九规划的对照**：批十九 §5.4 的推荐是 `L125←cover8／L126←cover9／L127←cover10`，**实读实际落地逐张一致**（行号 `:23402`／`:23596`／`:23790`）。**代价是 `cover8`–`cover10` 从单次池升入二用池**，二用池由 7 张扩到 10 张。**批二十可用池起点因此从 `cover11` 起算。**

### 6.2 逐课映射（非恒等映射共 10 处）

`L118→cover1`、`L119→cover2`、`L120→cover3`、`L121→cover4`、`L122→cover5`、`L123→cover6`、`L124→cover7`、`L125→cover8`、`L126→cover9`、`L127→cover10`；`L1..L117 → cover1..117` 全部恒等。

### 6.3 当前可用池与天花板

约束两条：① **`cover1`–`cover10` 全部禁用**（L128 处 min-gap 1–10，远低于 35 线）；② 批二十新课上课位（以 **3 课 L128–L130** 为主假设）。

单次张 `coverN`（N≥11）在课位 `p` 使用后的 min-gap ＝ **`p − N`**（只有一段历史）。可落线 ≥35 的张取自「在**最末课位 L130** 的天花板」：

| 边界 | 张 | L128 | L129 | L130 | 判定 |
|---|---|---|---|---|---|
| | `cover11` | 117 | 118 | **119** | ✅ |
| | `cover13` | 115 | 116 | **117** | ✅ |
| | `cover90` | 38 | 39 | **40** | ✅ |
| **线** | **`cover95`** | 33 | 34 | **35** | ✅ **刚好压线（L130）** |
| ❌ | `cover96` | 32 | 33 | **34** | ❌ 低于 35（若只做 L128–L129，`cover94`＝34/35 亦可压线，**边界随课位数变化，施工时须按实际课位重算**） |
| ❌ | `cover117` | 11 | 12 | 13 | ❌ |

**可用池 ＝ `cover11`–`cover95`，共 85 张**（3 课口径；实算全枚举确认 `cover11..cover93` 在三位都 ≥35 —— 保守取 **`cover11`–`cover93`＝83 张**，`cover94`／`cover95` 为压线张，建议留作后备）。

### 6.4 最优指派（二分答案 ＋ 全枚举验证）

**目标**：3 张互异、3 个课位 `L128／L129／L130`，最大化最小间距。

| 课量 | 指派 | min-gap | 同 min-gap 解数 |
|---|---|---|---|
| **3 课（推荐）** | **`L128←cover11`、`L129←cover12`、`L130←cover13`** | **117** | **1（唯一）** |
| 4 课 | ＋ `L131←cover14` | 117 | 1 |
| 6 课 | ＋ `L131←cover14`…`L133←cover16` | 117 | 1 |
| 8 课 | ＋ …`L135←cover18` | 117 | 1 |

**最优性说明**：`min-gap` 由「最差的 `p − N`」决定；要最大化它，必须取 **N 最小的 3 张（`cover11/12/13`，因 1–10 已禁用）配 p 最大的 3 个位（128/129/130）**。`cover11` 在 L128 的间距 117 已是上界（再更大需 `N ≤ 10`，而它们全被禁用）；`cover12` 在 L129＝117、`cover13` 在 L130＝117 同为上界。**`118` 不可行**（`cover11` 在 p=128 只有 117）。**此解唯一，不存在「同 min-gap 的更优 sum」方案**（sum 恒为 351）。

### 6.5 ❌ 禁用张清单（本批）

| 张 | 原因 | 解禁 |
|---|---|---|
| **`cover1`–`cover10`** | **批十九刚用满二用**（L118–L127），L128 处 min-gap 仅 **1–10** | **永久**（除非重排历史） |
| `cover96`–`cover117` | 在 L130 的天花板 ≤ **34**（低于 35 线） | 批二十一＋（更晚课位抬升后；`cover96` 在 L131 ＝ 35 即可用） |
| `cover118`+ | **资产不存在** | 需新出图 |
| `cover94`／`cover95` | 压线张（L130 gap 34／35），**建议留作后备** | 视实际课位重算 |

> **注**：本表按**编号间距实算**，**未做图像语义核对**（`cover11`–`cover13` 原为 L11/L12/L13 的图，与新章场景是否相称需人工确认）——沿用批十六/十七/十八/十九口径，属**未核实项**。
> **兜底**：`cover` 在 `types.ts:590` 为可选字段，缺省回退 scene SVG——**封面池或语义不匹配均不阻断上线**。
> **替代方案（B 计划）**：若产品坚持「封面＝课号一一对应」的既有惯例（L1–L117 均如此，L118–L127 已破例），则 L128+ 须**续出新图**，成本为 3 张新资产。

---

## 7. G-boost 复核

**实跑命令**：`npx vitest run src/services/grammarBoostService.test.ts` → **50 项全绿（约 4.4s）**。

> **审计期内的并行改动说明（重要）**：审计开始时该文件为 50 项全绿；审计中途（15:29）`grammarBoostService.ts` 被并行改动（md5 由 `c8b04969…` → **`d9387d72…`**，行数 1450），期间一次跑出 **4 项红**（`讲解不与题目串味`＋`grammarExplainService` 3 项）；**在我完成审计前（15:44 前后）并行方又改回了绿**。**最终快照：`npx vitest run` 61 文件 / 785 项全绿；`npx tsc --noEmit` exit 0。** 本节按**最终快照**记录。

**三条护栏现状（行号为当前文件）**：

| # | 断言 | 行号 | 现状 | 实读数值 |
|---|---|---|---|---|
| ① | 「改错题库：全库每课 ≥2 道可换（复练不会卡在同一道题）」 | `:161-183` | ✅ **绿** | thin 数组为空；**全库最低 2 道**，共 **11 课压在线上**：L72·73·79·80·81·85·87·88·90·91·92（探针实跑全库确认） |
| ② | 「`guided.spot` 的 `wrongToken` 必能定位（回归：L96/L102 带尾标点曾静默失效）」 | `:185-197` | ✅ **绿** | 违规为空 |
| ③ | 「`contrast` 的 `wrongMark` 不得是纯标点（回归：L89 的 `"?"` 无法定位）」 | `:199-209` | ✅ **绿** | 违规为空 |

**批十九三课的改错池深（探针实跑，逐课）**：

| 课 | `spot` 池深 | 备注 |
|---|---|---|
| L118 | 5 | 收口课 |
| L119 | 3 | **最低** |
| L120 | 4 | |
| L121 | 4 | |
| L122 | 4 | |
| L123 | 4 | |
| L124 | 5 | 收口课 |
| L125 | **4** | 批十九新课 |
| L126 | **4** | 批十九新课 |
| L127 | **4** | 批十九收口课 |

> **说明**：池深 ＝ `guided.spot` 1 道 ＋ `contrast`（非 bothRight 且 `wrongMark` 可定位）派生若干。**L125–L127 的 4 道池深与 L120–L123 一致，说明「4 条 contrast ＋ 1 条 guided.spot」是标准配置**；**批二十新章若照抄（6 条 contrast ＋ 6 条 guided）可自动过 ① 线**。
> **另注**：`contrast` 中 `bothRight: true` 的条目**不产生**改错题（`:700` `if (contrast.bothRight) return;`），故 L127 的 6 条 contrast 里 3 条是 bothRight、只有 3 条可派生改错题——**池深 4 ＝ 3（contrast）＋1（guided.spot）**。

---

## 8. 可生产性评估

| 候选 | 就绪度★ | 生产量 | 造词成本 | 风险 | 判定 |
|---|---|---|---|---|---|
| **甲 `look forward to`（3 课小章）** | ★★★★☆ | 3 课（约 585 行）＋3 案（#137–#139） | **2 词**（`forward` 必造；`seeing` 建议造） | ① **cloze 落点假友好**——`forward`／`looking` 永不成空位，考点须靠 `contrast`／`guided.spot` 承载（§4.4）；② 名词侧零风险（`weekend`／`birthday`／`party` 在库）；③ 与批十八 `be used to` 同族但判据不同（批十八＝「有 be 认名字版」，本批＝「门牌 to 认名字版」），**须在 `oneLineRule` 显式区分，否则话语重叠** | ✅ **推荐（造词成本低到可接受，学科价值高）** |
| 甲′ `look forward to` ＋ `object to`（4–6 课） | ★★☆☆☆ | 4–6 课＋4–6 案 | **5+ 词**（`forward`／`object`／`seeing`／`decision` 或 `rule`／…） | ① `object` 家族**零底座、零复用出口**；② 名词侧 `decision`／`rule`／`price`／`question` **全 0**；③ 情感抓手弱于「期待」 | ❌ **建议撤出或单独立项**（§1.6） |
| **乙 感官动词大章（`sound`／`smell`／`taste`）** | ★★★☆☆ | 3–4 课＋3–4 案 | **3 个动词**（`sound(s)`／`smell(s)`／`taste(s)`）＋**0–5 个形容词**（`good`／`nice` 已在库即可零造形容词；要「甜／软／怪」则 ＋3–5）＋ 可选 `soup` | ① **`look` 必须排除**（批十九已占 3 课，§2.4）；② `feel` 是「半占用」状态（L76 核心句），**只能独立成课、不能与 `look` 同章**；③ 罪名谱与批十九几乎完全重叠（`sv_agreement`＋`verb_form`），**增量有限**；④ **cloze 落点质量优于甲（真友好）** | ⚠️ **可做（备选），但须显式声明「不含 look」** |
| 丙 维持批十九结论（撤出／折卡） | ★★★★★ | 0 | 0 | 无 | ⚠️ 保守选项（但批二十可以空转，不推荐） |

**综合建议（数析口径）**：

1. **主候选 `look forward to` 的可生产性判「推荐」**：造词成本是 **2 个词**（`forward` 必造、`seeing` 建议造），**不是「造一门语言」**——「盼着某事」那一侧完全可以零造词（`weekend`／`birthday`／`party`／`summer` 全在库），「盼着做某事」那一侧也有 `playing`／`reading`／`swimming` 等厚底座 `-ing` 词可用。**唯一的硬成本是 1–2 个词。**
2. **但产品必须同时接受一条「题面弱」的代价**：主候选的 cloze 空位落不到 `forward`／`looking` 上（§4）。**这意味着新课的考点承载要压在 `contrast`（正误对比）与 `guided.spot`（找错）上，而这两类恰好是批十九模板里最厚的部分（6 条／6 条）。**
3. **`object to` 建议不做**：造词 ≥3、无复用出口、无情感抓手（§1.6）。
4. **感官章若做**：**必须显式排除 `look`**（批十九已连占 3 课），并把 `feel` 单独立项（L76 已占用其句法位）。**它的 cloze 落点质量是本批候选里最好的（`sounds`／`smells` 55% 命中考点）。**
5. **无论选哪项，三条基建动作固定**：追加 `season-20`（`≥128`）／追加 `can-do-m22`（**无守门，须人工核**）／episode 写「一百二十八」。

---

## 附录：核查留痕

### A1 实读源文件清单 ＋ md5（审计结束时快照）

| 文件 | 行数 | md5 |
|---|---|---|
| `src/data/grammarLessons.ts` | 23,980 | `63360ca17f2aaaee392d5cf4e0dcb54c` |
| `src/data/huntCases.ts` | 7,697 | `539eb614ce9a08c4c6c728126cb650f3` |
| `src/data/grammarSeasons.ts` | — | `b87f24292c289881d96e87c0d294ab16` |
| `src/data/grammarLessons.test.ts` | 232 | `d19c6448baed9ec5d92eb0378948a2af` |
| `src/data/grammarSeasons.test.ts` | 48 | `2c74e48900c27445c4003ea67dd921a8` |
| `src/data/grammarZeroTerms.ts` | — | `e767bfea6f2e0c7b4ad83ec530eccbab` |
| `src/services/grammarAmbushService.ts` | — | `84b306b40e881c4f9b8c8d000851686c` |
| `src/services/grammarBoostService.ts` | 1,450 | `d9387d72011582a5da974e2a5a1cd526`（**审计中途被并行改动**） |
| `src/services/grammarBoostService.test.ts` | 831 | `431eb956742d2f2f756ecc3bb39058c3`（同上） |
| `src/services/lessonService.ts` | — | `c074a84a4ead4cf6174c4aaae9a6f014` |
| `src/pages/GrammarPathPage.tsx` | — | `34dc3188eaf81e549e663ae7c2680f83` |
| `src/types.ts` | — | `5c0a8679f9b695e05bddd88ddeada597` |
| `vite.config.ts` | — | `b043993dc2c0f4c5d747f52c18721223` |
| `package.json` | — | `339bdab6ac82c625ce5591dcbc118008` |

**改动状态**：`git log -1` ＝ `7ad13f5 新增语法第四至十五批课程与 Boost 强化训练`（Sep 19 06:33）。**工作区为 dirty**：`grammarLessons.ts`／`huntCases.ts`／`grammarSeasons.ts`／`grammarBoostService.ts`／`grammarBoostService.test.ts` 等均 `M`（未提交）。

### A2 复刻与探针留痕（全部跑完即删，**已确认 src/ 下无残留探针文件**）

| # | 探针／脚本 | 用途 | 结果 |
|---|---|---|---|
| 1 | `/tmp/audit20/extract.py`（状态机提取） | GL/HC 引号串 ＋ 行号→课/案号映射 | GL 23,027 串／HC 5,594 串；GL 1–127 连续、HC 1–136 连续 |
| 2 | 临时 vitest 探针（`src/services/__probe_audit20.test.ts`，已删） | `buildBoostItems` 真服务 cloze 输出 ＋ L124–L127 结构计数 | `lesson-125…:t1:variants:1` → `It does not ___ nice.` / `look` **逐字一致** |
| 3 | 临时 vitest 探针（`__probe2.test.ts`，已删） | 全库逐课 `spot` 池深 | **min ＝ 2**，11 课压线（L72/73/79/80/81/85/87/88/90/91/92） |
| 4 | 临时 vitest 探针（`__probe3.test.ts`，已删） | L125–L127 运行时数组长度 | 4／6／3／5／6／3／3／2（与行差法一致） |
| 5 | 临时 vitest 探针（`__probe4.test.ts`，已删） | 复核 cloze（并行改动后重跑） | 与改动前一致 |
| 6 | `/tmp/audit20/cloze.mjs`、`cloze2.mjs`（Node 复刻） | ambush 三级档位 ＋ boost 20 组种子 | 见 §4.1／§4.2 |
| 7 | `/tmp/audit20/cover.py`（二分＋全枚举） | 封面最优指派 | min-gap 117，**唯一解** |

### A3 关键零值的独立复验（不经我的提取器）

```
grep -o -i -w 计数（两文件）：forward=0  forwards=0  object=0  holiday=0  soon=0  smell=0  sound=0  taste=0
grep -c "look forward\|looking forward"：grammarLessons.ts=0  huntCases.ts=0
grep -o '"word":"forward"' bundledDictionary.ts = 1（词典条目不属课程语料；含 "look forward to" 的是 expect 条目，非独立词条）
grep -o '"word":"seeing"' bundledDictionary.ts = 0
```

### A4 口径易错点（供下游引用时避坑）

| # | 坑 | 正确口径 |
|---|---|---|
| 1 | `trip` 的 GL 计数 | **真词次 ＝ 0**；GL 里唯一命中是 id 串 `hunt-trip-time`（`:13667`）。**报数时必须剔除 `hunt-*` 串** |
| 2 | `feel` 的计数 | **词次 27（GL 26 ＋ id 串 1）**；行数 28。批十九写「27 处」用的是词次口径，**与本期一致** |
| 3 | `to + -ing` 的计数 | 宽松口径 81 处；**严格英文句子口径 63 处／26 个不同句子**。另 `to Beijing`（38 处）是**假阳性**（`Beijing` 以 `ing` 结尾），须用小写 `[a-z]` 口径剔除 |
| 4 | 封面「可用张」边界 | **随课位数变化**：3 课（L128–130）时为 `cover11`–`cover93`（保守）／`cover95`（压线）；**施工时须按实际课位重算** |
| 5 | HC 案号的 id 映射 | `id:` 行在 `number:` 行**之前**，按「下一个 `number:`」归属即可；**#136 的 `id` 是 `hunt-two-look-faces`（在 `:7655`，number 在 `:7656`）** |
| 6 | `grammarBoostService.ts` | **审计中途被并行改动**，§7 的池深与护栏行号以改动后（md5 `d9387d72…`）为准 |

### A5 未核实

1. **图像语义**：`cover11`–`cover13` 是否与新章场景相称，**未做人工比对**（沿用既有口径）。
2. **`next` 的 140 处逐条语义**：本报告只确认 `next week` 整串为 0；`next` 的 140 处中 118 处是 `next to`，**另 22 处未逐条分类**。
3. **`forward` 的发音／重音教学点**：本报告只做**词频与句法位**盘点，**未评估**该词对 A2 用户的发音难度。
4. **`seen`／`went` 等不规则形的 `-ing` 派生**：未核（本批候选不需要）。
5. **批二十的课量决策**（3 课 / 4 课 / 6 课）：本报告按 **3 课** 给封面最优解，**若产品定为 4/6/8 课，指派随之变化**（§6.4 已给四档）。
6. **`soup` 以外的感官场景名词**（`rice`／`coffee`／`tea`／`cake`）：只给了总数（`rice` GL 0，`coffee` 25，`tea` 118，`cake` 53），**未逐条核其在句中的句法位**。
7. **另一条并行分支的产出**：审计期内 `src/services/grammarExplainService.ts`（untracked，15:40 写入）与 `grammarExplainService.test.ts` 出现又消失的 4 项红，**与批二十数据无关，未追查**。
8. **`object to` 的上游教学价值**：本报告只做**成本侧**盘点，**未做竞品侧**评估（批十九竞析 `:54` 有 Cambridge `look-forward-to` 页的原文级 Not 例，但 `object to` 无对应专页记录）。

---

**（报告完）**
