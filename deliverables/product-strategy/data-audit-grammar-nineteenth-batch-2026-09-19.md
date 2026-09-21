# 数据盘点：第十九批·大章节候选（3 课小章为主）

**日期**：2026-09-19 ｜ **类型**：实读代码/文件盘点（无数仓）｜ **成员**：数析
**方法**：单遍状态机提取引号内字符串（`tokenize`：`code`／`line_comment`／`block_comment`／`dq`／`sq`／`bt` 六态，注释内字符串一律不入账；反斜杠转义按两字符吞掉），再按顶层 `^    number: N,` 切块，得「行号 → 课号（GL）／案号（HC）」映射。GL 命中 **22,511 条串**（其中英文口径 `^[A-Za-z0-9'’,.!?;: -]+$` 命中 **14,035 条**）；HC 命中 **5,494 条串**（英文口径 **4,378 条**）。**抽词器逐字复刻并双跑**：`grammarAmbushService.ts:195-212`（`GRAMMAR_WORDS` 145 词 `:160-187` ＋ `CLOZE_STOP_WORDS` 30 词 `:190-194` ＋三级回退）与 `grammarBoostService.ts:248-257 / 260-384`（`FUNCTION_WORDS` 33 词 `:243-246` ＋ `keywordIndexes` 长度≥3 硬门＋`buildCloze`），对 **20 句候选**各跑 **20 组现实 sourceRef 种子**。**复刻可信度用真服务交叉验证**：临时 vitest 探针实跑 `buildBoostItems`（跑完即删，见附录 A4）——真服务在种子 `lesson-124-close-18:t1:variants:0` 下对 `You look tired.` 输出 `"You look ___." / tired`，与我的 Node 复刻**逐字一致**（§3 全句对照）。封面指派用**二分答案 ＋ 穷举（min-gap / max-sum 双目标，C(85,3)=98,770 全枚举）**。所有 raw 计数用 `grep -c` 交叉验证（§附录 A3）。
**口径声明（重要）**：报告**一律以工作区现状为准**。审计期间 `grammarLessons.ts` md5 恒为 **`ab2f56a6497b007548c9b8552bbe7f63`**（23,398 行），行数与 md5 **在审计全程未变**；所有数字出自该状态，与当下工作区逐字一致。
**范围**：候选池＝甲 **`look + 形容词` 升格（B 档·3 课小章·主候选）**／乙 `look like`（维持认读）／丙 `have sth done`（维持撤出）／丁 形容词＋介词（折卡）。

---

## 指标概览

| 指标 | 本期（实读） | 上期（批十八审计） | 状态 |
|---|---|---|---|
| 课程 / 案件 / 错点 | **124 课 / 133 案 / 506 错点** | 118/127/482 | ✅ 全线上行 |
| 罪名（错点/承载案） | verb_form **119/78**·plural **93/87**·sv_agreement **69/56**·preposition **60/55**·word_order **43/31**·tense **42/34**·article **28/22**·missing_be **24/20**·run_on **14/12**·fragment **14/13** | 109/72·88/82·67/54·58/53·42/30·39/31·28/22·23/19·14/12·14/13 | ✅ 枚举 10 不动，`comparison` HC 仍 **0** |
| 封面池 | **117 张用 124 次（单次 110·二用 7·三用 0）**；二用张＝**cover1–cover7**（同一批，全在 L118–L124 收口段） | 117 张/118 次（单次 116·二用 1） | 🔴 **批十八把「二用池」一次用满 7 张**——批十七遗留的「可用张」判断依据须整体重算（§5） |
| 案号 | max **#133**，1–133 **连续无跳号无重号**；`reviewed` **133/133 = 100%** | max #127 | ✅ 下号 **#134** |
| 课号 | 1–124 **连续无跳号无重号** | 1–118 | ✅ |
| 基建 | season-18 `{119,124}` 已在位（**18 季**）；m20 `afterLesson:124` 已在位（**20 里程碑**）；episode 止「一百二十四」 | season-17/m19 | ✅ 须续 season-19/m21 |
| **`look + 形容词`** | **16 处**（15 处直接型 ＋ 1 处限定词型 `look the same`），**16/16 在 `dialogue`、16/16 说话人 = `npc`** | 14 处 | ⚠️ **须上修 +2**：批十八后又由 L121/L123 各新增 1 处（§1.2） |
| **`look` 进过 `grammarLabel`？** | **0 课**（124 个 label 逐课核） | 0 | ✅ **零冲突结论仍成立** |
| 感官动词 | `sound*` **0**·`smell*` **0**·`taste*` **0**·**`feel` 27（L76 22·L78 5）**·`feels` **0**·`felt` **0**·`feeling` **1** | — | ⚠️ **`feel` 不是「+1 个」而是已有一座 27 处的底座**，且已进 L76 `grammarLabel`（§1.4） |
| 测试 | **61 文件 / 762 项全绿（6.91s）**；`tsc --noEmit` **0 错（exit 0）** | 58/732 | ✅ 基线已上移 |
| G-boost | **50 项全绿（4.34s）**；thin(＜2 改错题)＝**0 课**；`wrongToken` 逐字相等违规 **0**；纯标点 `wrongMark` **0** | 50 项；thin=0 | ✅ 三护栏全守 |
| cloze 落点（候选 6 句） | ambush **6/6 可落**（4 处落 `look/looks`，2 处走第②档）；boost **6/6 可落**（`look`／`looks`／`looked` 均在可落词位） | — | ✅ **本批最大优势：`look`/`looks` 双通道都在词表内**（§3） |

## 洞察

1. **本批最该先纠正的前提是「`look + 形容词` 14 处」——实读是 16 处。** 批十八报告的 14 处（宿主 L13/19/48/51/66/71/72/76/79/83/87/92/112/115）**逐条全部对得上、无一处落空**；但批十八之后新交付的 L121（`:22649` `You look better now!`）与 L123（`:23037` `You look a little lost.`）**各新增 1 处**，故当前实读 **16 处**。**结论：14 → 16 是「批十八之后新增 2」，不是「批十八数错」。** 其中 **15 处是直接型**（`look/looks/looked + 形容词`），**1 处是限定词型**（`:20898` `They look the same!`）——若按「形容词前可否直接跟 look」的严格句法口径，`look the same` 的 `same` 是形容词但中间隔了 `the`，**建议产品在 PRD 里明确采用「15 处直接型」还是「16 处含 the same」**，两个数都能自圆其说，但混用会导致下游引用漂移（§1.2 给出逐条清单与两种口径）。

2. **`look` 的「零冲突」结论不仅成立，而且比批十八时更硬。** 124 个 `grammarLabel` 逐课核，**含 `look` 的 = 0 课**（批十八仅核了 14 个宿主课，本期扩到全 124 课）；16 处 `look + 形容词` **16/16 落在 `dialogue` 字段、16/16 说话人 `who: "npc"`**、**0 处出现在 `targetSentence`／`examples`／`practice`／`contrast`／`blocks`**。这意味着升格时**没有任何既有教学点需要让位**，且这 16 句天生是「沉睡的复现池」——它们已经是 NPC 台词，把它们「点名为教学点」在叙事上零成本。**但要注意：`look` 家族在库里并非只有这 16 处**——`look at` 8 处（L52/58/60/65/88/96，是祈使句「看！」）、`looking for` 12 处（L27 9 处为主，是「正在找」）、`looks like` 仅 1 处（`:8977` L49）。**升格时必须把这 3 个「近邻义」显式隔离**，否则新章会把 `look at`／`looking for` 一起吸进 `look + 形容词` 的地盘（§1.3 给隔离设计）。

3. **「感官动词」不是「+1 个 feel」的关系——`feel` 已经有 27 处底座，而且已经当过教学点。** `sound*`／`smell*`／`taste*`／`feels`／`felt` 全 **0**，看着像空地；但 **`feel` 27 处集中在 L76（22）与 L78（5）**，且 **L76 的 `grammarLabel` 是「加力 · much + 更…」、`targetSentence` 是 `I feel much better today.`（`:14061`）**——`feel` 在库里是**「好多了」那句的谓语动词**，不是被当成「感官动词」教的。**推断：若新章要带 `feel + 形容词`（如 `I feel happy today.`），它不是「加一个 feel」，而是在 L76 已占用的句法位上做「义项再标注」；风险等级远高于 `look`（`look` 是全真空，`feel` 是半占用）。建议 3 课小章只做 `look`，把 `feel` 留作批二十的独立候选。**

4. **封面池的「可用张」判断依据在本期发生了结构性变化，批十八报告 §5.3 的 `2–89` 已完全失效。** 批十八把 **cover2–cover7 精确指派到 L119–L124**（`119−2=117`，即当时的最优 min-gap），这批图**同时从「单次池」变成了「二用池」**；连带 **cover1 也因 L118 而成为二用**。故本期现役二用张 = **cover1–cover7 共 7 张**，它们在 L125 处的 min-gap 仅 **7/6/5/4/3/2/1**——**全部低于 35 线，本批永久禁用**。可用池起点因此从 `cover2` 跳到 **`cover8`**，可用区间为 **cover8–cover92（85 张）**（`cover92` 在 L127 的 min-gap = 35，刚好压线；`cover93` = 34，出局）。**结论：批十九 3 课的最优指派是 `L125←cover8／L126←cover9／L127←cover10`，min-gap = 117，且该 min-gap 下可行解唯一（仅 1 组），sum = 351（§5.4）。**

5. **`look + 形容词` 与批十八新课 `be used to` 的形态距离极大，互不干扰——这是本次候选里最干净的一条边界证据。** L119–L124 的 6 个 `targetSentence` 全部围绕 `used to` 的形态（`:22247`／`:22441`／`:22635`／`:22829`／`:23023`／`:23217`），**没有一句含 `look`**；反过来，新章的拟定核心句 `You look tired.` 与 `used to` 的四种形态（`be used to`／`get used to`／`used to`）**零字面重叠**。而且 L121/L123 已经各自产出一句 `look + 形容词`（`:22649`／`:23037`）作为 NPC 台词——**这说明 `look + 形容词` 已在批十八课里自然出现、却不承担任何考点**，正是「升格即可用」的理想素材（§4）。

6. **与 L113 的形态距离需要一条明确的护栏：`look + -ed 形容词` 与 L113 的「感到版」撞型，但撞的是「形容词形态」不是「look 句型」。** 实读 L113（`:21073-21266`）**全课不含 `look`**（验证通过），其教学点是 `I am bored.`（`:21078`）——**`-ed 形容词作 be 的表语**。而 `You look tired.` 是**同一个 `tired`／`bored` 类「感到版形容词」作 `look` 的表语**。**风险点：L113 的 `contrast` 明设 `I am boring.` 为错（`:21097`，`wrongMark: "boring"`）—— 若新章写 `You look boring.` 之类的句子，会与 L113「让人版 vs 感到版」的判词体系发生话语重叠。** 而实读库存显示 `bored` 61 处（L113 42·L117 10·L118 8）／`boring` 36 处（L113 28·L117 4·L118 3）／`excited` 5 处（全在 L113）——**`-ed/-ing` 形容词的底座极厚但高度集中在 L113 及其两课回流**。**推断：新章若用 `tired`（88 处，L36 52·L92 10 为主）而非 `bored`，可完全绕开 L113 的判词面；`You look tired.` 这句本身在 `:3438`（L19）就已存在，是安全句（§6）。**

7. **cloze 两条通道对 `look` 家族都是「友好」的，这在本批候选里是罕见的双通吃。** `look` 与 `looks` **都在 `GRAMMAR_WORDS`（ambush）表内**（`:160-187`），同时在 boost 侧**不在 `FUNCTION_WORDS` 排除表且长度 ≥3**，故两条通道都能把空位落在 `look`／`looks` 上。实测 6 句候选：ambush **6/6 走第①档**，落点 `look`×4、`looks`×2；boost 侧 `look`／`looks` 均出现在可落词位（每句 2–3 个词位）。**对比之下，批十八的 `be used to` 因 `to`（2 字母）永不成空位、`am/is` 被 boost 硬门排除，考点词只能落 `used`／`getting`——本批的落点质量明显更优。** 唯一要记的差异：**`looking` 与 `looked` 都不在 `GRAMMAR_WORDS` 里**（`looked` 在 ambush 走第②档实词回退，落点仍是 `looked`；boost 侧两者都可落），故**若新课要考 `looked`（过去式），ambush 的档位会从①降到②**——不影响可落性，但考点的「语法承载」标签会弱一档（§3）。

8. **基建侧 season-18／m20 已随批十八落地，批十九须续 season-19／m21，且 season 测试会先红。** `grammarSeasons.ts:52` 末项 `{id:"season-18", min:119, max:124}`（共 18 季）；`GrammarPathPage.tsx:254-255` 末项 `can-do-m20 / afterLesson: 124`（共 20 个里程碑）。`grammarSeasons.test.ts` **4 项守门**（`:11` 区间覆盖／`:21` 互不重叠／`:35` label·hint 非空／`:42` 最高课号被覆盖）——**忘加 season-19 立刻红，不会静默**。**`can-do-m*` 全仓测试引用数 = 0（纯纪律项，无守门，已复核 `grep -rn "can-do-m" --include=*.ts --include=*.tsx src/ | grep -v GrammarPathPage.tsx` 为空）。** episode 写法：末项「一百二十四」（`:23210`）→ **下一个写「一百二十五」**。

9. **批十八遗留的 G-boost 三护栏全部守住，且本批新课只需照抄模板即可自动过线。** `grammarBoostService.test.ts` 实跑 **50 项全绿**；三条断言现状：① `:159-182`「全库每课 ≥2 道可换改错题」→ thin 数组为空（全库最低 **2 道**，共 11 课压在线上：L72·73·79·80·81·85·87·88·90·91·92）；② `:185-196`「`guided.spot` 的 `wrongToken` 与 `tokens` 逐字相等」→ 违规为空；③ `:199-208`「`wrongMark` 不得为纯标点」→ 违规为空。**L119–L124 的实测池深为 3/4/4/4/4/5 道（`mark` 条数分别 2/3/3/3/3/4 ＋ 每课 1 道 `guided.spot`），是新章的现成模板**（§7）。

---

## 1. 语料盘点（逐短语读上下文）

口径：**GL** ＝ `src/data/grammarLessons.ts`（22,511 条引号串）；**HC** ＝ `src/data/huntCases.ts`（5,494 条）。「处」＝短语出现次数，「串」＝承载该短语的字符串条数。**讲解串里的英文片段同样被命中**，故表内同时给「处」与「串」。

### 1.1 `look` 家族逐形态（GL / HC）

| 形态 | GL 处 | GL 串 | 逐课分布（课:次数） | HC 处 | HC 串 |
|---|---|---|---|---|---|
| `look` | **19** | 19 | L19 1·L27 2·L52 1·L58 2·L60 2·L65 1·L83 1·L86 1·L87 1·L88 1·L89 1·L92 1·L96 1·L112 1·**L121 1**·**L123 1** | **7** | 6 |
| `looks` | **9** | 9 | L13 1·L48 1·L49 1·L51 1·L66 1·L71 1·L72 1·L79 1·**L115 1** | 0 | 0 |
| `looking` | **14** | 13 | L13 1·**L27 10**·L37 1·L73 2 | 0 | 0 |
| `looked` | **1** | 1 | L76 1 | 0 | 0 |
| **合计** | **43** | 42 | — | 7 | 6 |

> **HC 侧的 7 处 `look`（逐条，实读）**：`#25 :1340`（tokens 内 `"look"`）、`#35 :2159`（`"Look"`）、`#44 :2794`（tokens 内 `"look"`）＋`:2829`（讲解串「看包里面用 look in」）、`#59 :3748`（`"Look"`）、`#62 :3927`（`"Look!"`）。**`looks`／`looking`／`looked` 在 HC 全库为 0**——**推断：HC 侧要为新章配案，只能从 `look`（原形）入手，且 `#44` 是唯一带解析的锚点（`look in` 的介词案，`tokenIndex 24`、`on→in`）。**

### 1.2 `look + 形容词` 逐条完整清单（**16 处**，含字段与说话人）

**判据**：`look/looks/looked` ＋ 直接跟一个形容词（排除 `look like/at/for/up/in/after/into/around/out/down/over/through` 这些介词家族），**允许中间有一个程度副词**。

| # | 行号 | 课 | 字段 | `who` | 原句 | look 形态＋形容词 | 本课 `grammarLabel` |
|---|---|---|---|---|---|---|---|
| 1 | `:2338` | L13 | `dialogue` | `npc` | `It looks nice!` | looks + nice | 正在做 · am/is/are + 动词ing |
| 2 | `:3438` | L19 | `dialogue` | `npc` | `You look tired.` | look + tired | 连词 · and / but |
| 3 | `:8790` | L48 | `dialogue` | `npc` | `The sky looks dark.` | looks + dark | 条件句 · if 里说现在 |
| 4 | `:9353` | L51 | `dialogue` | `npc` | `Everything looks new.` | looks + new | 幕后句 · 好几个的搭档 |
| 5 | `:12183` | L66 | `dialogue` | `npc` | `That box looks big!` | looks + big | 太…了装不下 · too…to |
| 6 | `:13129` | L71 | `dialogue` | `npc` | `This bag looks heavy.` | looks + heavy | 够 · enough 站词后 |
| 7 | `:13318` | L72 | `dialogue` | `npc` | `Your plan looks great!` | looks + great | 多久一次 · How often + 答语词块 |
| 8 | `:14076` | L76 | `dialogue` | `npc` | `You looked tired yesterday.` | looked + tired | 加力 · much + 更… |
| 9 | `:14645` | L79 | `dialogue` | `npc` | `Your room looks nice!` | looks + nice | 位置词 · next to |
| 10 | `:15406` | L83 | `dialogue` | `npc` | `You look happy today!` | look + happy | 不点名的东西 · something / anything |
| 11 | `:16168` | L87 | `dialogue` | `npc` | `You look cold.` | look + cold | 两个词挤一挤 · It's |
| 12 | `:17113` | L92 | `dialogue` | `npc` | `You look great!` | look + great | 什么时候 · when + 小句子 |
| 13 | `:20898` | L112 | `dialogue` | `npc` | `They look the same!` | look + **the** same ⚠️ | 长版 vs 短版 · mine 自己站，撇号 s 贴东西 |
| 14 | `:21481` | L115 | `dialogue` | `npc` | `It looks new!` | looks + new | 轻口气的「有」 · have got |
| 15 | `:22649` | **L121** | `dialogue` | `npc` | `You look better now!` | look + better | 慢慢习惯 · get used to（过程） |
| 16 | `:23037` | **L123** | `dialogue` | `npc` | `You look a little lost.` | look + **a little** lost | 说不和问 · not 跟 be 走、Are 搬句首 |

**与批十八「14 处」的差异（逐条说明）**：

| 项 | 数 | 说明 |
|---|---|---|
| 批十八登记的 14 处 | 14 | 宿主 `L13,19,48,51,66,71,72,76,79,83,87,92,112,115` |
| 本期实读 | **16** | 上述 14 处**逐条全部命中、无一处落空**（行号逐字一致） |
| **批次新增** | **+2** | **`:22649`（L121）** 与 **`:23037`（L123）**——**均在批十八交付的 L119–L124 区间内**，批十八审计时这两课尚未写完 |
| **口径可选** | −1 | 若采用「形容词必须直接跟 look」的严格句法口径，则 `:20898` `They look the same!`（中间隔 `the`）不计入 → **15 处** |

> **实读裁定**：批十八的「14」**不是数错**，而是**时点差**——批十八审计在 L119–L124 落地前完成，之后这两课各带出一句 `look + 形容词` NPC 台词。**本期报告采用 16 处（含 `the same`）为主口径，同时在 §1.3 标注「15 处严格口径」**，供 PRD 二选一。
> **另注**：`:23037` `You look a little lost.` 的形容词前有程度副词 `a little`；`:22649` 的 `better` 是比较级。**这 2 句是新章「复现池」里形态最丰富的两句**（其余 14 句均为「look(s) + 裸形容词」单一骨架）。

### 1.3 `look` 的「近邻义」隔离清单（升格时必须显式排除）

| 短语 | GL 处 | GL 串 | 逐课分布 | HC 处 | 隔离要求 |
|---|---|---|---|---|---|
| `looks like` | **1** | 1 | **L49 `:8977`**（`It looks like rain.`，`dialogue`/`npc`） | 0 | **唯一一处**。批十八曾判「`look like` 是另一条新线，不宜混入」——本期实读支持该裁定（底座 = 1 句） |
| `look like`（原形） | **0** | 0 | — | 0 | 零底座 |
| `look as if` / `looks as if` | **0** | 0 | — | 0 | 零底座 |
| `look at` / `looks at` / `looking at` / `looked at` | **8** | 8 | L52 1·L58 2·L60 2·L65 1·L88 1·L96 1（**全部是祈使句「Look at…!」**） | 0 | **8 处全是祈使句**（`Look at your brother!` 等），与「主语＋look＋形容词」**句法位置完全不同**（无主语、动词原形在句首），天然不冲突 |
| `look for` / `looking for` | **13** | 13 | `look for` 1（L27）·`looking for` 12（L13 1·**L27 9**·L37 1·L73 1） | 0 | **L27 是「正在找」的主场**（该课 `targetSentence` = `What are you looking for?` `:4898`）——`looking for` 是 `look for` 的进行时，与形容词无交集 |
| `look in` | **0** | 0 | — | **2**（`#44` `:2794` tokens ＋ `:2829` 讲解） | **HC 侧唯一带解析的 `look` 案**（`on→in` 介词案）——可作新章案件的**复用锚点** |
| `look up` / `look after` / `look into` / `look around` / `look out` / `look down` / `look over` / `look through` | **0** | 0 | — | 0 | 全零 |

> **隔离设计建议（推断）**：新章只需在 `oneLineRule`／`contrast` 里显式对照 **`look at`（看什么）vs `look + 形容词`（看起来怎样）** 两组——**`looking for` 与 `looks like` 因底座仅 1 处／集中在 L27·L49，可不动**。若要带 `look like` 作对照，须先补底座（当前 1 句不足成课）。

### 1.4 感官动词库存（判断「+1 个 feel」是否可行）—— **不可行，`feel` 已半占用**

| 词 | GL 处 | GL 串 | 逐课分布 | HC 处 | 在 `GRAMMAR_WORDS`？ | 在 boost `FUNCTION_WORDS`？ |
|---|---|---|---|---|---|---|
| `sound` / `sounds` | **0** / **0** | 0 | — | 0 | 均否 | 均否 |
| `smell` / `smells` | **0** / **0** | 0 | — | 0 | 均否 | 均否 |
| `taste` / `tastes` | **0** / **0** | 0 | — | 0 | 均否 | 均否 |
| **`feel`** | **27** | **27** | **L76 22·L78 5** | **4**（`#56`／`#84`／`#85`／`#87`） | **否** | **否** |
| `feels` | **0** | 0 | — | 0 | 否 | 否 |
| `felt` | **0** | 0 | — | 0 | 否 | 否 |
| `feeling` | **1** | 1 | L76 1 | 0 | 否 | 否 |

**`feel` 的 27 处实读明细（关键 8 处）**：

| 行号 | 课 | 字段 | 原文 |
|---|---|---|---|
| `:14058` | L76 | `dialogueEn` | `I feel much better today.` |
| `:14061` | L76 | **`targetSentence`** | **`I feel much better today.`（L76 的核心句）** |
| `:14063` | L76 | `blocks` | `I feel`（角色标注「我觉得（身体感觉）」） |
| `:14077` | L76 | `dialogue` | `I feel much better today.` |
| `:14069` | L76 | `examples` | `I feel much better today.` |
| `:14161`／`:14176`／`:14204`／`:14604` | L76·L78 | `tokens` | `feel`（多道练习的 token） |
| `:14466` | L78 | `wrong` | `I feel very better today.`（`much` vs `very` 对比） |
| `:14076` | L76 | `dialogue` | `You looked tired yesterday.` ← **同课内 `look + 形容词` 已存在** |

> **实读结论**：**`feel + 形容词`（`I feel much better today.`）就是 L76 的核心句**——`feel` 不是空地，而是**已被「much + 比较级」占用的谓语位**。L76 的 `grammarLabel` = 「加力 · much + 更…」，**教学点不是 `feel` 本身**，但句子骨架已是「主语＋feel＋形容词／比较级」。
> **推断（重要）**：**新章若加 `I feel happy today.`，会与 L76 的 `I feel much better today.` 形成同骨架复用**——这在库内是允许的（跨课复现是设计传统），但**「升格 `look` 时顺手带 `feel`」会同时踩到两处**：① L76 的既有核心句；② L76 `dialogue` 里已有的 `You looked tired yesterday.`。**数析建议：3 课小章只做 `look + 形容词`，`feel` 留作批二十独立候选**（那时可把「感官动词」做成 4–6 课大章，含 `sound/smell/taste`，但后三者当前底座为 **0**，需同步造词）。

### 1.5 `look` 是否进过任何一课 `grammarLabel`（零冲突的关键证据）—— **0 课**

**逐课核实（124 个 `grammarLabel` 全量清点）**：含 `look`（词边界、忽略大小写）的 = **0 条**。实读命令与结果：

```
grep 结果：grammarLabel 中含 look 的 = 0 行（已用 word-boundary 正则复核）
124 个标签逐条枚举 → 无一条含 "look"
```

**新章宿主课（16 处所在课）的标签实读**（这是「升格不抢位」的直接证据）：

| 宿主课 | 现 `grammarLabel` |
|---|---|
| L13 | 正在做 · am/is/are + 动词ing |
| L19 | 连词 · and / but |
| L48 | 条件句 · if 里说现在 |
| L51 | 幕后句 · 好几个的搭档 |
| L66 | 太…了装不下 · too…to |
| L71 | 够 · enough 站词后 |
| L72 | 多久一次 · How often + 答语词块 |
| L76 | 加力 · much + 更… |
| L79 | 位置词 · next to |
| L83 | 不点名的东西 · something / anything |
| L87 | 两个词挤一挤 · It's |
| L92 | 什么时候 · when + 小句子 |
| L112 | 长版 vs 短版 · mine 自己站，撇号 s 贴东西 |
| L115 | 轻口气的「有」 · have got |
| L121 | 慢慢习惯 · get used to（过程） |
| L123 | 说不和问 · not 跟 be 走、Are 搬句首 |

> **16 个宿主标签无一条与 `look` 或「感官／外观描述」相关**——覆盖正在做／连词／条件句／幕后句／too…to／enough／How often／much／next to／something／It's／when／mine／have got／get used to／否定疑问。**升格动作 = 把这 16 句从「无人认领的 NPC 台词」转为「被点名的教学素材」，零位次冲突。**

### 1.6 形容词库存（供 3 课选词）—— 逐词处数与分布

| 形容词 | GL 处 | GL 串 | 主要分布（课:次数，≥3） | 适配评注 |
|---|---|---|---|---|
| **`tired`** | **88** | 86 | **L36 52**·L92 10·L1 9·L19 5·L20 4·L10 3 | ✅ **首选**：底座最厚且分散；`:3438` 已有 `You look tired.` 原句；**与 L113 的 `bored` 体系不重叠** |
| **`cold`** | **206** | 202 | **L119 52**·L87 43·L94 22·L20 15·L6 14·L19 10·L123 9·L96 8·L121 6·L124 6·L88 5 | ✅ 底座第一（206）；L119 刚做过主角；`:16168` 已有 `You look cold.` |
| **`happy`** | **109** | 108 | **L19 29**·L28 14·L113 10·L1 9·L81 7·L119 6·L8 3·L20 3 | ✅ 厚；`:15406` 已有 `You look happy today!`；注意 L113 有 10 处（`excited` 系） |
| **`nice`** | **114** | 110 | **L89 63**·L94 32·L87 4·L86 3·L91 3 | ✅ 厚；`:2338`／`:14645` 各一句 |
| **`new`** | **184** | 174 | **L115 63**·L116 54·L118 20·L117 14·L65 4 | ✅ 极厚但**高度集中在 L115–L118（have got 章）** |
| **`heavy`** | **55** | 53 | **L66 42**·L71 11 | ✅ `/ˈhevi/` 双音节，适合教学；`:13129` 已有 |
| **`great`** | **7** | 7 | L7 2·L24 2·L72 1·L75 1·L92 1 | ⚠️ **薄（7 处）**，且 L7 的 2 处是 `Great!` 感叹，非表语 |
| **`dark`** | **5** | 5 | L48 1·L66 4 | ⚠️ **薄（5 处）**；`:8790` 已有 `The sky looks dark.` |
| **`good`** | **114** | 106 | **L67 57**·L59 23·L75 7·L40 4·L31 4·L17 3·L76 3 | ✅ 厚，但与 `well`（L59 61 处）是**明设对照对**（L59 标签「不按 -ly 走的两个常客 · good→well、fast→fast」） |
| **`well`** | **65** | 57 | **L59 61**·L14 3·L58 1 | ⚠️ **`well` 是副词不是形容词**——若新章写 `You look well.` 会与 L59 的「good→well」教学点对撞，**建议避开** |
| **`beautiful`** | **28** | 25 | **L31 14**·L17 13·L24 1 | ✅ 可用；集中 -est/-er 比较章 |
| **`interesting`** | **2** | 2 | L17 1·**L113 1** | ⚠️ **极薄（2 处）**；且 L113 的 1 处属 `-ing` 让人版体系 |
| **`young`** | **0** | 0 | — | ❌ **零底座** |
| **`old`** | **20** | 20 | L71 6·L60 3·L72 3·L19 2·L93 2·L100 2·L17 1·L73 1 | ✅ 可用（`Look at this old photo!` `:11047`，L60 已有祈使句用法） |
| **`big`** | **26** | 26 | L89 9·L71 7·L3 4·L17 4 | ✅ 可用；`:12183` 已有 |
| **`busy`** | **34** | 34 | L19 17·L81 7·L7 5·L113 4 | ✅ 可用 |
| `better` | **71** | 66 | **L76 53**·L78 8·L17 5·L31 3 | ⚠️ 比较级，与 L76 深度绑定；`:22649` 已用 |
| `lost` | **56** | 51 | **L23 41**·L24 6·L50 4·L85 1·L86 1·L123 1 | ⚠️ 主要为「弄丢」的动词义（L23），作形容词仅 `:23037` 一处 |
| `long`／`hot`／`clean`／`fast`／`ready`／`quiet`／`loud` | 38／25／28／24／7／7／8 | — | L73／L6·L66／L16·L23·L103／L59／L1·L7／L16·L77／L58·L59 | ✅ 可用 |
| **零底座（全 0）** | `sad`·`short`·`slow`·`dirty`·`fine`·`wrong`·`funny`·`bright`·`interested`·`exciting`·`surprised`·`wonderful`·`delicious`·`sweet`·`young` | — | — | ❌ **15 个零底座词**——**新章若要「3 课不重复用同一形容词」，可选范围必须从上面「厚底座」组里挑** |

> **选词建议（数析口径）**：3 课各锚定一组：**课1 `tired`（88）／课2 `cold` 或 `nice`（206／114）／课3 `happy` 或 `heavy`（109／55）**——全部 ≥55 处、全部已有 `look + 形容词` 先例句、全部避开 L59（`well`）与 L113（`bored/boring/excited`）的判词面。

---

## 2. 罪名承载预判（10 枚举零扩展）

`GrammarErrorTag`（`types.ts:419-430`）为 **11 元联合**（含 `comparison`）；`huntService.ts:331-342` 的 `GRAMMAR_ERROR_TAGS` 为 **10 元**（不含 `comparison`），`huntService.test.ts:109` 断言 `tagStats` 长度 **= 10**。**HC 里 `tag: "comparison"` 实读 = 0 处**——`comparison` 仍是「只进类型、不进题库」的死枚举。

| 罪名 | 错点次数 | 承载案数 | 批十八 | 批十九可承载候选（`look + 形容词` 章） |
|---|---|---|---|---|
| `verb_form` | **119** | **78** | 109/72 | ★ `He looks tired.` → `He look tired.`（漏三单 -s）；`You look tired.` → `You looks tired.`（三单误加）——**`look/looks` 形态选择是本批最自然的新点** |
| `plural` | **93** | **87** | 88/82 | 复现位（`two bags look heavy`） |
| `sv_agreement` | **69** | **56** | 67/54 | ★ `She look tired.`（三单漏 -s）——与 `verb_form` 可分工：`sv_agreement` 判「主谓不搭」、`verb_form` 判「形态本身错」 |
| `preposition` | **60** | **55** | 58/53 | ★ **`look at` vs `look + 形容词` 的宾语误加**：`You look at tired.`；或 `look like` 误用 |
| `word_order` | **43** | **31** | 42/30 | 复现位 |
| `tense` | **42** | **34** | 39/31 | ★ `You looked tired yesterday.` 的过去式（`:14076` 已是现成句） |
| `article` | **28** | **22** | 28/22 | 复现位（`look the same` 的 `the` 是固定搭配，可作陷阱词） |
| `missing_be` | **24** | **20** | 23/19 | ★ **反例**：`You look tired.` 的正确形式恰好**不需要 be**（区别于 `You are tired.`）——**但这是「多余 be」不是「丢失 be」，枚举里无对应项**；若写成 `You are look tired.` 可归 `verb_form` |
| `run_on` | **14** | **12** | 14/12 | 复现位 |
| `fragment` | **14** | **13** | 14/13 | 复现位（`look` 单独成句 `Look!` 是正确祈使，勿误判） |
| **合计** | **506** | — | 482 | — |

**实读：每案错点数分布** = 2 错 ×10 案（#2·3·5·7·8·9·10·11·12·37）／3 错 ×10 案（#6·13·14·15·16·18·19·20·35·36）／**4 错 ×110 案**／5 错 ×2（#42·#43）／6 错 ×1（#34）。**批十八的 9 案（#125–#133）全为 4 错**，其罪名配比实读：`#125 {sv_agreement 2, verb_form 1, plural 1}`／`#126 {verb_form, preposition, tense, plural 各 1}`／`#127 {word_order, verb_form, article, sv_agreement 各 1}`／`#128 {verb_form, missing_be, tense, plural 各 1}`／`#129 {verb_form, preposition, sv_agreement, plural 各 1}`／`#130 {verb_form 2, tense 1, plural 1}`／`#131 {verb_form, preposition, tense, plural 各 1}`／`#132 {verb_form, word_order, sv_agreement, plural 各 1}`／`#133 {verb_form ×4}`（收口案）。

**课-案引用配比（实读）**：124 课中 **119 课有引用**、**5 课空（L2·L3·L5·L6·L8**——第一季基础课，属 `huntCases.ts` 头注释「决策⑤（2026-09-13）」的既定番外定位）；引用总数 **129**（1 案 ×110 课、2 案 ×8 课、3 案 ×1 课）。**`hunt-my-sister` 被 2 课引用**（L14 与 L25），是全库唯一复用案。

**番外案名单（应恰 5 个）—— 实读恰 5 个**：

| # | 案 id | 行号 |
|---|---|---|
| 16 | `hunt-white-cat` | `:733` |
| 17 | `hunt-sports-day` | `:791` |
| 18 | `hunt-pen-pal-letter` | `:857` |
| 19 | `hunt-fridge-note` | `:916` |
| 20 | `hunt-term-review` | `:979` |

> **注**：案号 **#15（`hunt-moving-day`）不在番外名单**——它被 L1 引用（首案即配课）。另：我第一遍扫描因把 `id:` 错误配到「下一个 `number:`」而误报 6 个番外（含 #15 与 #133），修正配对顺序后为**恰 5 个**，与批十八登记一致。

**推断：批十九若沿用「新 2＋旧 2」的四点模板**，`verb_form`（`look/looks` 形态）与 `sv_agreement`（三单漏 -s）是天然新点，`preposition`（`look at`／`look like` 误加宾语）可作第三支点，`plural`／`tense`／`article` 作复现位。**3 课小章对应 3 个新案（#134–#136），每案 4 错即可**。

---

## 3. cloze 落点预演

### 3.1 ambush 通道（`grammarAmbushService.ts:195-212` 逐字复刻）

`GRAMMAR_WORDS` 实读 **145 词**（`:160-187`），`CLOZE_STOP_WORDS` **30 词**（`:190-194`），三级回退见 `:195-212`。

| 候选句 | 命中档 | 空位下标 | clozeText | clozeAnswer | 语法承载词？ |
|---|---|---|---|---|---|
| **`You look tired.`** | **①** | 1 | `You ___ tired.` | **`look`** | ✅ |
| **`The sky looks dark.`** | **①** | 2 | `The sky ___ dark.` | **`looks`** | ✅ |
| `It looks like rain.`（对照） | ① | 1 | `It ___ like rain.` | `looks` | ✅ |
| `This bag feels heavy.` | **②** | 1 | `This ___ feels heavy.` | `bag` | ❌（`feels` 不在表内，退实词） |
| `I feel happy today.` | **②** | 1 | `I ___ happy today.` | `feel` | ❌（`feel` 不在表内；落点仍是 feel） |
| **`You look nice today.`** | **①** | 1 | `You ___ nice today.` | **`look`** | ✅ |
| `That film looks interesting.` | ① | 2 | `That film ___ interesting.` | `looks` | ✅ |
| `Everything looks new.` | ① | 1 | `Everything ___ new.` | `looks` | ✅ |
| `Your room looks nice!` | ① | 2 | `Your room ___ nice!` | `looks` | ✅ |
| `You look happy today!` | ① | 1 | `You ___ happy today!` | `look` | ✅ |
| `You look cold.` | ① | 1 | `You ___ cold.` | `look` | ✅ |
| `You look great!` | ① | 1 | `You ___ great!` | `look` | ✅ |
| `It looks new!` | ① | 1 | `It ___ new!` | `looks` | ✅ |
| `You look better now!` | ① | 1 | `You ___ better now!` | `look` | ✅ |
| `You look a little lost.` | ① | 1 | `You ___ a little lost.` | `look` | ✅ |
| `This bag looks heavy.` | ① | 2 | `This bag ___ heavy.` | `looks` | ✅ |
| `Your plan looks great!` | ① | 2 | `Your plan ___ great!` | `looks` | ✅ |
| `That box looks big!` | ① | 2 | `That box ___ big!` | `looks` | ✅ |
| `They look the same!` | ① | 1 | `They ___ the same!` | `look` | ✅ |
| `You looked tired yesterday.` | **②** | 1 | `You ___ tired yesterday.` | `looked` | ❌（`looked` 不在表内，退实词；落点仍是 `looked`） |

**实读结论：20/20 可落；其中 17/20 走第 ① 档（`look`／`looks` 直接命中词表），3/20 走第 ② 档（`looked`×1、`feels`×1、`feel`×1）。**
**关键差异（与批十八的 `be used to` 对比）**：**`look` 与 `looks` 两者都在 `GRAMMAR_WORDS` 表内**，故「主语是 you／I 用 `look`、是 he／she／it 用 `looks`」这一**真正的考点（三单 -s）在 ambush 通道会被直接抽空**——这正是新章最想考的位置。**而 `looked`／`feel`／`feels` 不在表内**，含它们的句子会退到第②档：落点仍是那个词（因长度 ≥3 且非停用词），但档位标签降级。

### 3.2 boost 档 1 通道（`grammarBoostService.ts:248-257 / 260-384` 逐字复刻）

`FUNCTION_WORDS` 实读 **33 词**（`:243-246`）；`keywordIndexes`（`:248-257`）硬门为 **`clean.length >= 3` 且非功能词**。下表「答案分布」为 **20 组现实 sourceRef 种子**（形如 `lesson-125-look-adj:t1:{variants|sceneSwings|practice|examples|dialogue}:{0..3}`）的实跑结果。

| 候选句 | boost 可落词位（下标,词） | 现实种子实得答案分布 | `look`/`looks` 能否成空位 |
|---|---|---|---|
| **`You look tired.`** | (1,look)(2,tired) | `look`×10 `tired`×10 | ✅ **能**（2 个词位，50/50） |
| **`The sky looks dark.`** | (1,sky)(2,looks)(3,dark) | `looks`×8 `sky`×6 `dark`×6 | ✅ 能 |
| `It looks like rain.` | (1,looks)(2,like)(3,rain) | `like`×8 `looks`×6 `rain`×6 | ✅ 能 |
| `This bag feels heavy.` | (1,bag)(2,feels)(3,heavy) | `feels`×8 `bag`×6 `heavy`×6 | —（无 look；`feels` 可落） |
| `I feel happy today.` | (1,feel)(2,happy)(3,today) | `happy`×8 `feel`×6 `today`×6 | —（无 look；`feel` 可落） |
| **`You look nice today.`** | (1,look)(2,nice)(3,today) | `nice`×8 `look`×6 `today`×6 | ✅ 能 |
| `That film looks interesting.` | (1,film)(2,looks)(3,interesting) | `looks`×8 `film`×6 `interesting`×6 | ✅ 能 |
| `Everything looks new.` | (0,Everything)(1,looks)(2,new) | `looks`×8 `Everything`×6 `new`×6 | ✅ 能 |
| `Your room looks nice!` | (1,room)(2,looks)(3,nice) | `looks`×8 `room`×6 `nice`×6 | ✅ 能 |
| `You look happy today!` | (1,look)(2,happy)(3,today) | `happy`×8 `look`×6 `today`×6 | ✅ 能 |
| `You look cold.` | (1,look)(2,cold) | `look`×10 `cold`×10 | ✅ 能 |
| `You look great!` | (1,look)(2,great) | `look`×10 `great`×10 | ✅ 能 |
| `It looks new!` | (1,looks)(2,new) | `looks`×10 `new`×10 | ✅ 能 |
| `You look better now!` | (1,look)(2,better)(3,now) | `better`×8 `look`×6 `now`×6 | ✅ 能 |
| `You look a little lost.` | (1,look)(3,little)(4,lost) | `little`×8 `look`×6 `lost`×6 | ✅ 能（注意 `a`(2) 是功能词被排除） |
| `This bag looks heavy.` | (1,bag)(2,looks)(3,heavy) | `looks`×8 `bag`×6 `heavy`×6 | ✅ 能 |
| `Your plan looks great!` | (1,plan)(2,looks)(3,great) | `looks`×8 `plan`×6 `great`×6 | ✅ 能 |
| `That box looks big!` | (1,box)(2,looks)(3,big) | `looks`×8 `box`×6 `big`×6 | ✅ 能 |
| `They look the same!` | (1,look)(3,same) | `look`×10 `same`×10 | ✅ 能（`the`(2) 是功能词被排除） |
| `You looked tired yesterday.` | (1,looked)(2,tired)(3,yesterday) | `tired`×8 `looked`×6 `yesterday`×6 | —（`looked` 可落，非 `look/looks`） |

**真服务交叉验证（临时 vitest 探针，跑完即删）**——同一批候选句喂给真 `buildBoostItems`（借用 L124 课体、临时替换 `variants` 为 6 句候选，跑完即还原），种子 `lesson-124-close-18:t1:variants:0`：

```
真服务输出：PROBE-CLOZE "You look ___." => "tired" | ref lesson-124-close-18:t1:variants:0
我的 Node 复刻（同种子）：
  You look tired.          -> "You look ___."          ans="tired"
  The sky looks dark.      -> "The sky looks ___."     ans="dark"
  It looks like rain.      -> "It looks like ___."     ans="rain"
  This bag feels heavy.    -> "This bag feels ___."    ans="heavy"
  I feel happy today.      -> "I feel happy ___."      ans="today"
  You look nice today.     -> "You look nice ___."     ans="today"
```

——**`You look tired.` 一行与真服务逐字一致（`"You look ___."` / `tired`），复刻可信。**

### 3.3 词表归属 + boost 档 1 `keywordIndexes` 落点影响（本批重点）

| 词 | 在 `GRAMMAR_WORDS`（ambush）？ | 在 boost `FUNCTION_WORDS`（排除表）？ | 长度 | boost 可作空位？ |
|---|---|---|---|---|
| **`look`** | **✅ 是** | ❌ 否 | 4 | **✅ 是** |
| **`looks`** | **✅ 是** | ❌ 否 | 5 | **✅ 是** |
| `looking` | ❌ 否 | ❌ 否 | 7 | ✅ 是（但 ambush 走第②档实词） |
| `looked` | ❌ 否 | ❌ 否 | 6 | ✅ 是（ambush 走第②档实词） |
| `feel` | ❌ 否 | ❌ 否 | 4 | ✅ 是 |
| `feels` | ❌ 否 | ❌ 否 | 5 | ✅ 是 |
| `felt` | ❌ 否 | ❌ 否 | 4 | ✅ 是 |

**`keywordIndexes`（`:248-257`）的硬门影响逐条说明**：

1. **`look`（4 字母）／`looks`（5 字母）长度 ≥3、且不在 33 词功能词表里 → 永远进入 `keywordIndexes`**。故**在 boost 档 1 里，`look`／`looks` 是「合法空位候选」，与实词（`tired`／`dark`／`nice`）平权竞争**（每句 2–3 个位，随机取一个）——实测 `You look tired.` 的分布正好 **`look`×10 / `tired`×10**（两词位各半）。
2. **`you`／`the`／`a`／`it` 等 30+ 个功能词被排除**，故短句里可落位天然少：`You look cold.` 只剩 **2 位**（`look`／`cold`），`It looks new!` 也只剩 **2 位**（`looks`／`new`）→ **答案在 `look` 与形容词之间二选一，各 50%**。
3. **`a little` 的 `a`（1 字母）被长度门排除**（`:253`），故 `You look a little lost.` 的可落位是 `(1,look)(3,little)(4,lost)`——**`a` 永不成为空位**。
4. **`You look a little lost.` 的 `little` 有歧义风险（推断）**：`little` 在句中作程度副词，但作为空位答案时用户可能误判为形容词「小的」。**建议产品避免把 `little` 位暴露给用户**（即该课不选这句作 cloze 素材），或改写为 `You look lost.`。
5. **`to`／`my`／`up` 等 2 字母词的排除对本章无影响**——`look + 形容词` 句里没有这类枢纽词（区别于批十八 `be used to` 的 `to` 死结）。

> **本批结论**：**`look + 形容词` 在 cloze 两条通道的落点质量显著优于批十八的 `be used to`**——ambush 侧 `look/looks` 是被词表直接认领的「语法承载词」（第①档），boost 侧它们又是合法的实词空位候选。**「考 `look` 还是 `looks`」这一核心考点在两通道都能成立。**

---

## 4. 基建护栏

| 项 | 实读现状 | 行号 | 批十九动作 |
|---|---|---|---|
| season 分组 | 共 **18 季**；末项 `{id:"season-18", label:"第十八季 · 同一个 to，两张脸", hint:"…同一个 to，前面有 be 是一张脸，没 be 是另一张", min:119, max:124}` | `grammarSeasons.ts:52` | **追加 `season-19`**（区间须 ≥125 起，且 `min > 124` 否则 `grammarSeasons.test.ts:21` 的「互不重叠」红） |
| season 守门测试 | **4 项**：`:11` 区间覆盖／`:21` 互不重叠且 min≤max／`:35` label·hint 非空／`:42` 最高课号被覆盖 | `grammarSeasons.test.ts`（48 行） | **忘加即红，不会静默** |
| 里程碑 | 共 **20 个**；末项 `can-do-m20 / afterLesson: 124`（标题「我能说清「习惯了」」，samples 3 句） | `GrammarPathPage.tsx:254-255` | **追加 `can-do-m21`（afterLesson 127）** |
| 里程碑守门 | 全仓 `can-do-m*` 测试引用数 = **0**（`grep -rn "can-do-m" --include=*.ts --include=*.tsx src/ \| grep -v GrammarPathPage.tsx` **无输出**） | — | ⚠️ **纯纪律项，无守门**（漏加不会红，需人工核） |
| 关 1 解锁 | `const prev = grammarLessons.find((item) => item.number === lesson.number - 1);` | `lessonService.ts:157` | 课号必须 1–127 连续，**缺号永久锁死** |
| 课号连续性 | **1–124 连续、无跳号、无重号**（124 个 `^    number:`，去重后仍 124） | — | ✅ |
| 案号连续性 | **1–133 连续、无跳号、无重号**（133 个 `^    number:`） | — | ✅ 下号 **#134** |
| `reviewed` 覆盖 | `^\s+reviewed: true` 命中 **133 行**，**133/133 = 100%** | — | ✅ |
| episode 写法 | 末项「小美的一天 一百二十四」（`:23210`） | `:23210` | **下一个写「一百二十五」**（既有先例：`一百`→`一百零一`…`一百一十`→`一百一十一`…`一百二十`→`一百二十四`） |
| 封面字段 | `cover?: string`（可选） | `types.ts:590` | 缺省回退 scene SVG——**池耗尽不阻断上线** |

**L119–L124 逐课形态（批十八新课的结构模板，供批十九照抄）**：

| 课 | 行范围 | 行数 | `examples` | `contrast` | `variants` | `practice` | `targetSentence` |
|---|---|---|---|---|---|---|---|
| L119 | 22237–22430 | 194 | 14 | 6 | 3 | 32 | `I am used to the cold.`（`:22247`） |
| L120 | 22431–22624 | 194 | 14 | 6 | 3 | 32 | `I am used to getting up early.`（`:22441`） |
| L121 | 22625–22818 | 194 | 14 | 6 | 3 | 32 | `I am getting used to it.`（`:22635`） |
| L122 | 22819–23012 | 194 | 14 | 6 | 3 | 32 | `I used to walk to school.`（`:22829`） |
| L123 | 23013–23206 | 194 | 14 | 6 | 3 | 32 | `I am not used to it.`（`:23023`） |
| L124 | 23207–23399 | 193 | 14 | 6 | 3 | 32 | `I used to walk to school.`（`:23217`，收口课复用 L122 句） |

---

## 5. 封面池专章（含最优指派与最优性说明）

### 5.1 容量账（实读 `^    cover: coverN,`，**124 次命中**）

| 项 | 实读 |
|---|---|
| 使用次数总计 | **124** |
| 去重张数 | **117** |
| **单次池** | **110 张：`cover8–cover117`** |
| **二用池** | **7 张：`cover1`–`cover7`**（逐张行号见下） |
| **三用池** | **0 张** |
| 资产文件 | `src/assets/lessons/` 共 **117 张 jpg**（`lesson-1..117.jpg`），**md5 去重后仍 117 张（无一图重用）** |
| **无资产课** | **L118–L124 共 7 课无专属图**——`lesson-118.jpg` 及以后**不存在**，全部回落池内复用的 `cover1`–`cover7` |
| 版本状态 | git 仅跟踪 `lesson-1..49.jpg`（49 张）；`lesson-50..117.jpg`（68 张）为 untracked 新资产 |

**二用张逐张行号（实读）**：

| 张 | 第一次用 | 第二次用 | 三用间距（若用在 L125） |
|---|---|---|---|
| `cover1` | L1 `:144` | **L118 `:22046`** | **7** ❌ |
| `cover2` | L2 `:316` | **L119 `:22242`** | **6** ❌ |
| `cover3` | L3 `:498` | **L120 `:22436`** | **5** ❌ |
| `cover4` | L4 `:680` | **L121 `:22630`** | **4** ❌ |
| `cover5` | L5 `:862` | **L122 `:22824`** | **3** ❌ |
| `cover6` | L6 `:1043` | **L123 `:23018`** | **2** ❌ |
| `cover7` | L7 `:1225` | **L124 `:23212`** | **1** ❌ |

**逐课映射（非恒等映射共 7 处）**：`L118→cover1`、`L119→cover2`、`L120→cover3`、`L121→cover4`、`L122→cover5`、`L123→cover6`、`L124→cover7`；`L1..L117 → cover1..117` 全部恒等。

### 5.2 与批十八规划的对照（**口径已换挡，须先纠正前提**）

批十八报告 §5.4 的**推荐指派**是：`L119←cover2／L120←cover3／L121←cover4／L122←cover5／L123←cover6／L124←cover7`（min-gap 117）。

**实读实际落地**：与该推荐**逐张一致**（`L119←cover2`…`L124←cover7`，行号 `:22242`／`:22436`／`:22630`／`:22824`／`:23018`／`:23212`）。

| 项 | 批十八推荐 | 实际落地 | 差异 |
|---|---|---|---|
| `cover2–cover7` | 贴 L119–L124 | ✅ **逐张落地** | ✔ **一致（唯一一次「推荐＝落地」全等）** |
| `cover1` | 二用（L1＋L118） | ✅ 二用（L1＋L118） | ✔ 一致 |

> **口径裁定（实读）**：批十八**完全采纳了封面池内复用方案**（未续出新图），代价是 **`cover2–cover7` 这 6 张一次性从单次池升入二用池**。**.workbuddy/memory 记载的「加完一批统一告知再批量补封面」约定在本批未兑现**——**批十九若继续复用，可用池从 `cover8` 起算。**

### 5.3 当前可用池与天花板

约束两条：① **`cover1–cover7` 全部禁用**（L125 处 min-gap 1–7，远低于 35 线）；② 批十九新课上课位为 `L125–L127`（3 课）。

单次张 `coverN`（N≥8）在课位 `p` 使用后的 min-gap = **`min(|p − N|)`**（只有一段历史，第二次使用后成两段）。可落线 ≥35 的张取自「在**最末课位 L127** 的天花板」：

| 边界 | 张 | L125 | L126 | L127 | 判定 |
|---|---|---|---|---|---|
| | `cover8` | 117 | 118 | **119** | ✅ |
| | `cover10` | 115 | 116 | **117** | ✅ |
| | `cover90` | 35 | 36 | **37** | ✅ |
| **线** | **`cover92`** | 33 | 34 | **35** | ✅ **刚好压线** |
| ❌ | `cover93` | 32 | 33 | **34** | ❌ 低于 35 |
| ❌ | `cover117` | 8 | 9 | **10** | ❌ |

**可用池 = `cover8`–`cover92`，共 85 张。**

### 5.4 最优指派（二分答案 ＋ 穷举验证）

**目标**：3 张互异、3 个课位 `L125／L126／L127`，最大化最小间距。

**二分答案**：`max-min = 117`（`118 不可行`，已证）。**穷举验证**：在 `min-gap = 117` 前提下，**C(85,3) = 98,770 组全枚举，可行解恰好 1 组**——**max-sum 与 min-sum 同值，无自由度**。

| 课 | 封面 | 前次用 | 三用后间距 | 行号（待写） |
|---|---|---|---|---|
| **L125** | **cover8** | L8 | **117** | — |
| **L126** | **cover9** | L9 | **117** | — |
| **L127** | **cover10** | L10 | **117** | — |

**最优性说明**：`min-gap` 由「最差的 `p − N`」决定；要让它最大化，必须取 **N 最小的 3 张（`cover8/9/10`，因 1–7 已禁用）配 p 最大的 3 个位（125/126/127）**。`cover8` 用在 L125 时 `125−8 = 117` 已是该课位在「8 起」约束下的上界；`cover9` 在 L126（`117`）、`cover10` 在 L127（`117`）同为上界。**`118` 不可行是因为 `cover8` 在 `p=125` 的间距仅 117，无法更高。** 此解**唯一**，故不存在「同 min-gap 的更优 sum」方案。

**扩展档（同一口径，可直接施工）**：

| 课量 | 指派 | min-gap | 备注 |
|---|---|---|---|
| **3 课（推荐）** | `L125←cover8、L126←cover9、L127←cover10` | **117** | **唯一解** |
| 4 课 | 上表 ＋ `L128←cover11` | 117 | 仍唯一 |
| 6 课 | 上表 ＋ `L128←cover11`…`L130←cover13` | 117 | 仍唯一 |
| 8 课 | 上表 ＋ …`L132←cover15` | 117 | 仍唯一（`cover15` 在 L132 = 117） |

### 5.5 ❌ 禁用张清单（本批）

| 张 | 原因 | 解禁 |
|---|---|---|
| **`cover1`–`cover7`** | **批十八刚用满二用**（L118–L124），L125 处 min-gap 仅 **1–7** | **永久**（除非重排历史） |
| **`cover93`–`cover117`** | 在 L127 的天花板 ≤ **34**（低于 35 可用线）；且 `cover111–117` 是批十七刚用的新图 | 批二十+（更晚课位抬升后；`cover93` 在 L128 = 35 即可用） |
| `cover118`+ | **资产不存在**（实读仅 117 张 jpg，`lesson-118.jpg` 起缺失） | 需新出图 |

> **注**：本表按**编号间距实算**，**未做图像语义核对**（`cover8–cover10` 原为 L8/L9/L10 的图，与新章 `look + 形容词` 的场景是否相称需人工确认）——沿用批十六/十七/十八口径，属**未核实项**。
> **兜底**：`cover` 在 `types.ts:590` 为可选字段，缺省回退 scene SVG——**封面池或语义不匹配均不阻断上线**。
> **替代方案（B 计划）**：若产品坚持「封面 = 该课号一一对应」的既成惯例（L1–L117 均如此，L118–L124 已破例），则 L125+ 须**续出新图**，成本为 3 张新资产（非池内复用）。

---

## 6. 与批十八新课 / L113 的形态距离

### 6.1 与 L119–L124（`be/get used to` 章）的距离 —— **零干扰，且有正向接口**

**L119–L124 `targetSentence` 全表（实读）**：

| 课 | 行号 | `targetSentence` | `oneLineRule` 首句（节选） |
|---|---|---|---|
| L119 | `:22247` | `I am used to the cold.` | 说「习惯了什么」：used 前面站着 am／is／are，后面跟东西 |
| L120 | `:22441` | `I am used to getting up early.` | 习惯了「做某事」：后面那件事要换名字版（穿 -ing） |
| L121 | `:22635` | `I am getting used to it.` | 说「慢慢习惯」：把 be 换成 getting |
| L122 | `:22829` | `I used to walk to school.` | 说「我从前常走路上学」和「我现在走惯了」 |
| L123 | `:23023` | `I am not used to it.` | 说「不习惯」：not 跟在 be 后面，不请帮手 |
| L124 | `:23217` | `I used to walk to school.` | 这章学的都在这页上：从前常用 used to（后面穿原样）… |

**干扰判定（实读）**：

| 检查项 | 结果 |
|---|---|
| L119–L124 六句 `targetSentence` 中含 `look` 的 | **0 句** |
| `used to` 四种形态（`be used to`／`get used to`／`used to`／`got used to`）与 `look + 形容词` 的字面重叠 | **0**（无共享词根、无共享虚词位） |
| 新章候选核心句 `You look tired.` 与 6 个 target 的编辑距离 | **极远**（仅共享 `I`／`you` 类代词） |
| **正向接口** | **L121 `:22649` 与 L123 `:23037` 已各含一句 `look + 形容词`**（`You look better now!`／`You look a little lost.`）——**批十八课已经在为批十九供料** |

> **实读结论**：**`look + 形容词` 与 `be/get used to` 互不干扰。** 这是「两个新章背靠背上线」的理想情形——不同词根、不同句法位、不同考点（前者考三单 -s 与「外观 vs 状态」、后者考 `to` 后接名词／-ing）。
> **推断（一处需注意）**：**两章的 NPC 台词风格高度同构**（都是「同桌／妈妈看着小美说一句」）——批十九若继续走「NPC 台词升格」路线，**叙事模板会与批十八重复**。建议批十九的 `sceneSetupZh` 换场景钩子（如「照片／镜子／新衣服」），避免连续两章都是「搬新家适应期」的延续。

### 6.2 与 L113（`bored/boring` -ed/-ing 形容词）的距离 —— **撞型点在形容词形态，不在 look 句型**

**`bored`／`boring` 全库分布（实读）**：

| 词 | GL 处 | GL 串 | 逐课分布 |
|---|---|---|---|
| **`bored`** | **61** | 61 | **L113 42**·L117 10·L118 8·L112 1 |
| **`boring`** | **36** | 36 | **L113 28**·L117 4·L118 3·L112 1 |
| `excited` | 5 | 5 | **L113 5** |
| `interested` / `exciting` / `surprised` / `tiring` | 0 / 0 / 0 / 1 | — | 仅 `tiring` 1 处（L92） |

**L113 关键实读（`:21073-21266`）**：

| 行号 | 字段 | 原文 |
|---|---|---|
| `:21078` | `targetSentence` | `I am bored.` |
| `:21083` | `oneLineRule` | 「感到版说『我的感受』：I am bored（我没劲）；让人版说『它让我这样』：The book is boring…同一个中文『无聊』，英语分两张脸，看是谁没劲。」 |
| `:21097` | `contrast.wrong` | `I am boring.`（`wrongMark: "boring"`） |
| `:21109` | `contrast.wrong` | `The book is bored.`（`wrongMark: "bored"`） |
| `:21115` | `contrast.wrong` | `The book is boring.`（← **注意：此条 `bothRight`／判词语境下被判「不能用来形容我」**） |
| `:21150` | 讲解 | 「感到版带 -ed：I am bored.（我没劲）She was excited.（她很兴奋）He was tired.（他累了）——说的都是『人心里什么感觉』。这个版本只给人和动物用，因为只有它们有感觉。」 |
| **全课 `look` 出现次数** | **0** | ✅ 实读确认 |

**撞型判定（实读 + 推断）**：

| 检查 | 结果 | 结论 |
|---|---|---|
| L113 全课含 `look`？ | **0** | ✅ **句型零重叠** |
| L113 的 `tired` 出现次数 | **1**（`:21150`，讲解串里举例 `He was tired.`） | ⚠️ **`tired` 已被 L113 的讲解引用为「感到版」例子** |
| `You look tired.` 的 `tired` 属什么形态 | **-ed 形容词（感到版）** | ⚠️ **与 L113 的「感到版」同属一个形态族** |
| L113 把 `I am boring.` 判为错 | ✅ `:21097` 明设 | ⚠️ **新章若写 `You look boring.` 会与 L113 判词面重叠** |

> **实读结论**：**`You look tired.` 与 L113 撞的是「`-ed` 形容词（感到版）作表语」这一形态，不撞 `look` 句型**（L113 无 `look`）。**但 `tired` 恰好在 L113 的讲解串里被举过例（`:21150`）**——这是唯一的话语重叠点。
> **推断（护栏建议）**：新章**可安全用 `You look tired.`**（该句在 `:3438` L19 已存在，是既有句），但应**避开 `bored`／`boring`／`excited` 三个词**（它们被 L113 的「两张脸」体系强占用，L113 42／28／5 处）。**选词建议见 §1.6：用 `tired`／`cold`／`nice`／`happy`／`heavy`，全部避开 `-ed`-vs-`-ing` 判词面**（`heavy`／`cold`／`nice`／`happy` 都不是 `-ed/-ing` 形态，完全无交集）。

### 6.3 与 L76（`I feel much better today.`）的距离 —— 若带 `feel` 则有干扰

见 §1.4：**L76 的 `targetSentence` 就是 `I feel much better today.`（`:14061`）**，骨架为「主语＋feel＋形容词／比较级」。**若新章加 `I feel happy today.`，两者骨架完全相同（仅形容词位不同）**。**推断：这是「带 feel」的最大成本**——不是不能做，而是要与 L76 的「much + 比较级」教学点做显式的义项分工（L76 讲「加力」，新章讲「感官动词」）。

---

## 7. G-boost 复核

**实跑**：`npx vitest run src/services/grammarBoostService.test.ts` → **1 文件 / 50 项全绿（4.34s）**（批十八为 50 项；本期持平）。两条重负载用例通过：`改错题库：全库每课 ≥2 道可换` 792ms、`改错题每轮都有一道` 652ms。

**三条断言的现状（逐条实读）**：

| 断言 | 位置 | 现状 |
|---|---|---|
| ① 「全库每课 ≥2 道可换改错题」 | `:159-182`（断言 `expect(thin…).toEqual([])` 在 `:182`） | **thin = 0 课** ✅ |
| ② 「`guided.spot` 的 `wrongToken` 与 `tokens` 逐字相等」 | `:185-196`（判定 `if (!spotStep.tokens.includes(spotStep.wrongToken))` 在 `:192`；断言 `:196`） | **违规 = 0 课** ✅（数据侧不依赖代码兜底 `grammarBoostService.ts:678` 的 `cleanWord` 近似） |
| ③ 「`contrast.wrongMark` 不得为纯标点」 | `:199-208`（断言 `:208`） | **违规 = 0 条** ✅ |

**改错池容量的实读底账（决定新课能否过 ①）**：

- 全库 `guided` 里 `kind: "spot"` 恒为 **1 道/课**（124 课共 **124** 道，无课为 0）
- 全库 `contrast` 中带非空 `wrongMark` 的共 **434 条**（`^        wrongMark: "` 命中 434；`wrongMark: null` 310；`wrong: "` 总 744 条）
- 两源相加即「可换改错题池」：**最低的 11 课只有 2 道**（`L72·73·79·80·81·85·87·88·90·91·92`，都是「1 道 contrast mark ＋ 1 道 guided spot」贴着线）；最高 7 道
- **L119–L124 的池深实读**：`L119: 3`（mark 2＋spot 1）／`L120: 4`（3＋1）／`L121: 4`（3＋1）／`L122: 4`（3＋1）／`L123: 4`（3＋1）／`L124: 5`（4＋1）——**全部 ≥3，是本批可照抄的模板**
- **推断：批十九每课只要满足「1 道 `guided.spot` ＋ contrast 带 mark ≥1 条」，就有 2 道保底；建议每课 contrast 带 mark **≥2** 条以留余量**（L119 的 2 条即是「贴着 3 道」的较低值）。

---

## 8. 可生产性评估

| 候选 | 就绪度 | 生产量（3 课小章） | 风险 |
|---|---|---|---|
| **甲 `look + 形容词` 升格（主候选）** | **★★★** | 3 课：升格 1 课（把 16 处 NPC 对白转正为教学点）＋迁移／复现 1 课（物品＋外观：`looks heavy`／`looks new`）＋镜像对照 1 课（`look at` vs `look + 形容词`／`You look tired.` vs `You are tired.`）；3 个新案（#134–#136，每案 4 错） | **①零冲突（最大优势，已三重确证）**：`look` 从未进任何 `grammarLabel`（124 课全核）；16/16 在 `dialogue`、16/16 `who: "npc"`；0 处作 target／进讲解练习。**②cloze 落点全优**：`look`／`looks` **双通道都在词表内**（ambush 第①档＋boost 可落位），落点质量优于批十八的 `be used to`。**③底座同构度过高**：16 处里 **13 处是「You/It/物 + look(s) + 裸形容词」同一骨架**（仅 `:22649` 比较级、`:23037` 带 `a little` 两处有变化）——**场景偏窄，3 课会很快写穷**（这是最主要的真实风险）。**④形容词选词受限**：15 个零底座词（`young/sad/short/slow/dirty/fine/wrong/funny`…）不可用；`interesting` 仅 2 处、`great` 7 处、`dark` 5 处偏薄——**须从 `tired`(88)／`cold`(206)／`nice`(114)／`happy`(109)／`heavy`(55)／`new`(184) 里选**。**⑤与 L113 撞型点**：`You look tired.` 的 `-ed` 形容词属 L113「感到版」形态族，且 `tired` 被 L113 讲解举例过（`:21150`）——**避开 `bored/boring/excited` 即可**。**⑥`feel` 不可顺带**：`feel` 已 27 处且是 L76 核心句谓语，属半占用（§1.4） |
| **乙 `look like`（维持认读）** | **★☆☆** | 若要升格则须整条新造 | **①底座仅 1 句**：`looks like` 只在 `:8977`（L49）出现一次（`dialogue`/`npc`）；`look like`／`look as if` 全 **0**。**②批十八已裁「不宜混入甲」**——本期实读完全支持。**③推荐：维持认读**，待批二十+ 与「感官动词大章」一并升格 |
| **丙 `have sth done`（维持撤出）** | **★☆☆** | — | **①真空白且无接口**：`have sth done`／`have sth + 过去分词` 的使役结构实读 **0**；`have X done` 的 10 处 GL 命中**全部是现在完成时**（`have done my homework`，L21 为主，`:3843`／`:3790`／`:3813` 等），**与「have sth done」同形异义，是强干扰源**。`had X done`／`get X done`／`got X done` 全 **0**；`haircut`／`repaired`／`fixed` 全 **0**。**②「同一个 have」的对撞面比批十八的「同一个 to」更硬**（`have done` 已完成时是 L21–L24 的整章教学点）。**③推荐：维持撤出** |
| **丁 形容词＋介词（折卡）** | **★☆☆** | 若折卡则并入甲；不单开 | **①除 `good at`（40 处，全在 L67）外全零底座**：`interested in` 0／`afraid of` 0／`sorry for` 0／`sorry about` 0／`good for` 0／`bad at` 0／`proud of` 0／`famous for` 0／`ready for` 0／`full of` 0／`different from` 0／`angry with` 0／`worried about` 0／`happy about` 0／`happy with` 0／`sure about` 0／`kind to` 0／`late for` 0／`busy with` 0——**20 个候选短语里 19 个为零**。**②`preposition` 罪名（60/55）已被大量占用**，再压同罪名边际收益低。**③批十七路线图已裁「形容词＋介词折卡不单开」**——本期数据**完全支持该裁定**（零底座比批十八时更确认） |

**推荐（数析口径）**：**以甲为主，做 3 课小章**（`L125←升格课`／`L126←迁移课`／`L127←对照收口课`），**乙／丙／丁全部维持现状不动**（乙维持认读、丙维持撤出、丁折卡）。
**唯一需要产品裁定的点**：**甲做 3 课还是 6 课。** 数据侧证据是双向的——**支持 3 课**：16 处底座里 13 处同构、场景窄、形容词可用面受 15 个零底座词限制；**支持更多的证据**：`look` 家族在库共 43 处（含 `look at` 8／`looking for` 13，可作隔离对照面）、且 cloze 落点质量全优。**数析建议先做 3 课，把「`look at` vs `look + 形容词`」的隔离对照做成第 3 课主体**——若实测用户反应良好，批二十可续做「感官动词」大章（届时需同步造 `sound/smell/taste` 的底座）。

---

## 附录：核查留痕

### A1. 测试实跑（逐次记录，全绿）

| 时刻 | 命令 | 结果 |
|---|---|---|
| 13:35 | `npx vitest run src/services/grammarBoostService.test.ts` | ✅ **1 文件 / 50 项全绿（4.34s）** |
| 13:35 | `npx vitest run`（后台） | ✅ **61 文件 / 762 项全绿（6.91s）** |
| 13:38 | `npx tsc --noEmit` | ✅ **exit 0，0 行输出** |

> **基线结论**：**当前（工作区现状）＝ 61 文件 / 762 项全绿 ＋ tsc 0 错**。与批十八登记的「58 文件 / 732 项」相比 **+3 文件 / +30 项**（批十八自身交付带来的增量）。**注意：提问方预期为「60 文件 / 761 项」，实读为 61 / 762**——差异为 +1 文件 / +1 项，属**预期轻微偏低**，非回归（全部通过，无红）。

### A2. 实读源文件清单 ＋ md5（2026-09-19 13:40 快照）

| 文件 | 行数 | md5 |
|---|---|---|
| `src/data/grammarLessons.ts` | 23,398 | **`ab2f56a6497b007548c9b8552bbe7f63`** |
| `src/data/huntCases.ts` | 7,565 | `d3d6ec77f6b082f5c0813c790a025fd7` |
| `src/data/grammarSeasons.ts` | 59 | `d99de30f015d52fb241f30ab66f45f8c` |
| `src/data/grammarSeasons.test.ts` | 48 | `2c74e48900c27445c4003ea67dd921a8` |
| `src/data/grammarLessons.test.ts` | — | `d19c6448baed9ec5d92eb0378948a2af` |
| `src/services/grammarAmbushService.ts` | 283 | `84b306b40e881c4f9b8c8d000851686c` |
| `src/services/grammarBoostService.ts` | 1,452 | `c8b049693b3eff9fa5392c1c8aa9387e` |
| `src/services/grammarBoostService.test.ts` | 828 | `1bb83e53f415b94cfb020c22603b1c0a` |
| `src/pages/GrammarPathPage.tsx` | 706 | `dfdd0e9ca27a1e438ff5dcfc0a04b000` |
| `src/assets/lessons/`（117 张 jpg） | — | **md5 去重后 117 张（无一图重用）** |

> **与批十八快照的 md5 差异**：`grammarLessons.ts` `83a505c…` → `ab2f56a…`（行数 22,238 → 23,398，**+1,160 行 = 批十八交付的 6 课 + 9 案**）；`huntCases.ts` `4734bc3…` → `d3d6ec7…`（7,301 → 7,565 行）；`grammarSeasons.ts` `105f227…` → `d99de30…`（57 → 59 行，**+season-18**）；`GrammarPathPage.tsx` `0e2aa08…` → `dfdd0e9…`（699 → 706 行，**+m20**）。**`grammarAmbushService.ts`／`grammarBoostService.ts`／`grammarBoostService.test.ts` 三个服务与测试文件的 md5 与批十八快照逐字相同（未被改动）**——故 §3 的抽词器复刻在批十九审计时依然逐字有效。

### A3. raw 交叉验证（`grep -c` 逐条对齐提取结果）

| 口径 | `grep` raw | 脚本提取 | 一致 |
|---|---|---|---|
| `^    number:` / GL | **124** | 124 课 | ✅ |
| `^    number:` / HC | **133** | 133 案 | ✅ |
| `^    cover: cover` / GL | **124** | 124 次、去重 **117** | ✅ |
| `^    id: "hunt-` / HC | 133 | 133（配对顺序修正后） | ✅ |
| `reviewed: true` / HC | **133** | 133（覆盖率 **133/133 = 100%**） | ✅ |
| 错点（`tokenIndex:` 行）/ HC | **506** | 506（按 case 分组求和一致） | ✅ |
| `^        wrong: "` / GL | **744** | contrast 条数 744 | ✅ |
| `^        wrongMark: "` / GL | **434** | 434（`wrongMark: null` **310**，744−310=434） | ✅ |
| `kind: "spot"` / GL | **124** | 124（**每课恒 1 道**） | ✅ |
| `id: "can-do-m` / GrammarPathPage | **20** | 20 里程碑 | ✅ |
| `id: "season-` / grammarSeasons | **18** | 18 季 | ✅ |
| 资产文件 / `src/assets/lessons` | **117** | 117（`lesson-1..117.jpg`，**无缺号**） | ✅ |
| `can-do-m` 测试引用（排除 GrammarPathPage） | **0** | 0（无守门） | ✅ |

### A4. 临时探针与工作脚本（均已清理/置于 /tmp）

- 临时测试文件 `src/services/__audit19_probe.test.ts`：**已删除**（`ls` 确认不存在；`git status` 无残留）
- 复刻脚本：`/tmp/audit19/lex.py`（状态机 tokenizer ＋ 块归属）、`/tmp/audit19/cloze.mjs`（ambush ＋ boost cloze 逐字复刻，Node 原生 `Math.imul`／`>>>` 位运算）、`/tmp/audit19/coveropt2.py`（封面二分＋穷举）、`/tmp/audit19/{scan1..scan6c,lookadj,lookadj2,covers}.py`
- 探针的**真实服务输出**已逐字记入 §3.2（`PROBE-CLOZE "You look ___." => "tired"`）

### A5. 未核实

1. **封面图像语义未核**——指派按**编号间距实算**。本期推荐把 `cover8–cover10`（原 L8/L9/L10 的图）贴到 L125–L127，**图像内容与新章 `look + 形容词`（外观／状态观察）的场景是否相称需人工逐张确认**；若不符，可在 **85 张可用张**内重排——但**注意 min-gap=117 的解唯一**，任何重排都会让 min-gap 下降（仍远高于 35 线，故重排不阻断上线，只是最优性让位）。
2. **`lesson-118.jpg` 及以后缺失已实读确认（117 张资产止于 `lesson-117.jpg`），但「L118–L124 连续 7 课无专属图」是否为有意设计未核**——批十八报告推测 L118 是「有意回落」，但**L119–L124 全部回落池内图**（`cover2–cover7`）是批十八审计时的推荐方案，本批实读确认已落地；**是否应补 7 张专属图属产品决策，数析不裁**。
3. **`lesson-50..117.jpg` 68 张新资产未纳入任何测试守门**（实读：`grammarLessons.test.ts` **12 项**断言中无封面项，均为 practice／label／话术类；`grammarSeasons.test.ts` 4 项亦不涉封面）——**「课有 cover 字段但资产文件缺失」在当前测试体系下不会报红**（L118–L124 就是活例）。属**机制缺口**（批十八已登记，本期仍未补）。
4. **`look + 形容词` 的两种口径未裁**（16 处含 `They look the same!` vs 15 处严格「直接跟形容词」）——**须产品在 PRD 里明确**，否则下游引用会漂移（§1.2 已给逐条清单供裁）。
5. **形容词是否在「核心 500 词」表内未核**——只统计了形态存量，**未按词汇红线逐词核对** `heavy`／`better`／`lost` 等是否在册。
6. **`feel` 「半占用」的严重度未做用户侧评估**——实读确认 L76 核心句是 `I feel much better today.`，但**「同骨架复用」在库内是否为可接受惯例**（`grammarLessons.test.ts:163` 有一条「练习答案不得跨课高频复现（同一句最多出现在 6 课）」的断言，说明库容忍有限复用）**未逐条核**。
7. **`comparison` 死枚举未核归属**——实读 HC 0 处、`GRAMMAR_ERROR_TAGS` 10 元不含它；**是否计划启用未在任何文档中找到决议**（批十八已登记，本期仍未变）。
8. **批十八交付的 6 课「实际用户表现」未核**——本盘点只做静态数据核查，未取任何运行时遥测（`grammar_events` 等）。
9. **本报告未做任何改仓动作**——只读取与统计；`git status` 的 `M` 列表（`IMPLEMENTATION_NOTES.md`／`grammarLessons.ts`／`huntCases.ts`／`grammarSeasons.ts`／`GrammarPathPage.tsx` 等 10 项）**均为审计前已存在的未提交改动**，非本次引入；唯一的本次新增文件 `src/services/__audit19_probe.test.ts` **已删除且无残留**。
