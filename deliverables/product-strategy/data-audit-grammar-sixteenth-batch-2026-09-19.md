# 数据盘点：第十六批·大章节候选（6–8 课）

**日期**：2026-09-19 ｜ **类型**：实读代码/文件盘点（无数仓）｜ **成员**：数析
**方法**：状态机提取字符串（跳注释、行号→课号/案号映射），逐短语读上下文计数；cloze 三套抽词器**逐字复刻**＋boost 哈希种子实跑；封面指派用二分最大最小间距＋匹配回溯（**最优性证明**，非贪心估算）；boost 错卡池真 vitest 探针实跑（跑完即删）。口径＝引号内字符串，按「全英文串／讲解串」二分。
**范围**：甲 使役补完章（make/let/have/get）/ 乙 连词补完章（during·as·until）/ 丙 have sth done / 丁 混合 / 戊 机制深化。

## 指标概览

| 指标 | 本期（实读） | 上期 | 状态 |
|---|---|---|---|
| 课程 / 案件 / 错点 | **102 课 / 111 案 / 418 错点** | 94/103/386 | ✅ |
| 罪名（错点/承载案） | verb_form **93/58**·plural **73/68**·preposition **56/51**·sv_agreement **53/43**·word_order **40/28**·tense **29/23**·article **24/18**·missing_be **22/18**·run_on **14/12**·fragment **14/13** | 同序 | ✅ |
| **甲 使役** | `make`/`makes`/`making` **0/0/0**；`made` **4 全在 L68「做蛋糕」**；`make+宾+动词` **两文件 0**；`let`＋宾语 **51 处全 me**（L74 49）；`lets` **0**；`get sb to do` **0**（`get` 11 处全在 L16 `get up`） | — | ⚠️ **结构真空白＋宾语单一** |
| **乙 连词** | `during` **GL 11 全在 L98**（英文仅 1 句错例）；`until/till` **0/0**；`as` 作连词 **0**（131 处 `as` 中 120 在 L65＝比较级）；`while` L98 已教 **92 处** | — | ⚠️ during 半开、**until/as 全空白** |
| **丙 have sth done** | `have/has/had＋物主＋名词＋过去分词` **两文件 0**；被动平台 be+PP 在 L50–54 约 **145 处**；`had` 仅 3；`will have` **0** | — | ⚠️ 结构零底座、平台厚 |
| 封面 / 案号 / episode | 49 张用 102 次（**单次 4·二用 37·三用 8**）｜max #111→**下号 #112**｜止「一百零二」 | 单次 12·#103 | ⚠️ **单次池近乎枯竭** |
| 测试 | **54 文件 674 项全绿（4.26s）** | 54/674 | ✅ |

## 洞察

1. **甲＝「结构空白＋宾语位被 L74 单点占死」**：`make sb do` 全库零出现；可 `let` 的 51 处宾语**全是 `me`**（L74 占 49），L74 `:13690` 明写「让某人做（Let me…）……**今天先拿下一个最常用的**」——正是留给批十六的钩子。甲须换锚**第三人称 makes/made＋him·her·them**（L74 无第三人称先例），否则即 L74 复课。
2. **乙的空白在 until 与 as（连词），不在 during**：`during` 门槛 L98 已用 4 张讲解＋1 张 ❌ 错卡（`During I was reading` ❌）＋summary 讲透，**单开整课即重复**；真零位是 `until`（0/0）与 `as` 连词（0/0）。缝合点现成：until 天然接 L97 `when`／L98 `while` 时间从句家族。
3. **丙跨级且错型弱**：结构零底座，但零件齐（L50–54 被动 145 处＋L68 `made a cake for me`＋L53 `has been cleaned`）。`have sth done` 属**中级 U46（超 A2 级）**；且「我剪了头发」在 L68 是合法句，**无法作 contrast 错句**，只能靠 `cuted`／主谓错等弱形态承载。
4. **封面政策本批必须换挡**：单次池仅剩 **4 张**（41·45·47·48），批十五已按路线图吃掉 8 张。**批十六起靠二用升三用**：纯二用最优 **32**；混合（4 单次＋4 二用）可抬到 **36**。
5. **G-boost 护栏逐字未变、批十五执行到位但露一处隐性缺陷**：`grammarBoostService.test.ts:159-181` 逻辑未改。批十五贴线 **1 门（L96）**；**L96／L102 的 `guided.spot` 因 `wrongToken` 带标点不匹配而静默失效**（§6）。

---

## 1. 语料盘点（逐短语读上下文）

**甲 · 使役**（GL 命中数／其中全英文串）

| 词形 | 命中／英文 | 分布 |
|---|---|---|
| `make`·`makes`·`making` | **0·0·0** | — |
| `made` | **4／4** | L68 `She made a cake for me.` ×3＋词块 ×1 |
| `let`（非 Let's） | **55／29** | L74 **53**·L75 1·L93 1 |
| `Let's` | **56／31** | L75 **54**·L56 1·L65 1 |
| `lets` | **0** | — |
| `let`＋宾语 | **51／25** | **宾语分布 me 50／us 0／him·her·them 0**——L74 独占 49 |

HC 侧：`make` 5（#15 冠词讲解 2·#22 `can make` 3）·`made` 1（#32）·`making` 2（#22 `making→make`，**全库唯一 make 家族植错**）·`makes` **0**；`let` 6（#83 4·#84 2，全是讲解）。**`have+宾+动词`／`get sb to do`／`gets`／`got` 两文件全 0**；`get` GL 11 处**全在 L16**（`get up`）、HC 2 处全在 #31（`get in`）——使役义与「到达/变得」义皆零底座。`had` GL 仅 3（L21 ×2、L60 `We had a picnic`）。

**乙 · 连词**

| 连词 | GL | HC | 判定 |
|---|---|---|---|
| `during` | **11**（英文 2：L98 `During I was reading` ❌＋词块；余 9 讲解） | 0 | **半开**：门槛 L98 已讲透（`during the class`／`during the night` 4 处明文） |
| `until` / `till` | **0 / 0** | **0 / 0** | ✅ **真空白** |
| `as`（连词） | **0**（`As＋主语` 命中 0） | 0 | ✅ **真空白** |
| `as`（全语义） | 131：**L65 120**＋L71 10＋L78 1 | 13（全 #74） | `as…as` 框架 **49**（33 英文），**全为比较级** |
| `while` | **92**（L98 68·L99 14·L101 4·L102 6） | 10（#107 5·#110 2·#111 2·#108 1） | 批十五已教＋3 案回流 |

**丙 · have sth done**：`have/has/had＋物主＋名词＋过去分词` **0 处**。平台零件：GL `be+PP` 型 **245 处**（L52 40·L36 36·L51 35·L54 34·L50 29）；L53 `The window has been cleaned.` 带 `has been`；`will have` **0**——`I'll have my hair cut` 的时态搭档无先例。

**戊 · 机制深化（对照）**：boost 三档＋回马枪（关 2/关 3）全量落地，`grammarBoostService.ts` 1108 行／`grammarAmbushService.ts` 283 行／`grammarReviewService.ts` 均有测试守门——**机制侧已饱和**，不宜作主章。

---

## 2. 罪名承载预判（10 枚举零扩展）

| 候选 | 拟植错 | 承载罪名（先例） |
|---|---|---|
| 甲 | `*My mom makes me to do…`／`*…makes me does…` | **verb_form 93/58**（L74 `Let me to help`／`Let me helps` 同型；#22 `making→make`）／**sv_agreement 53/43** |
| 甲 | `*My dad make me clean…`／`*He doesn't lets me go.` | **sv_agreement 53/43**（#34/#48 `have→has`·#90 `sit→sits`）／**verb_form 93/58**（**只可第三人称 `lets` 承载**——L74 已明示 `help` 垫 to 两可，不可作错） |
| 甲 | `*He made me to wait.` | **verb_form 93/58**（最厚；`made` 无使役先例，误答陷阱天然） |
| 乙 | `*I waited until the rain stops.` | **tense 29/23**（#1·#73·#99·#105） |
| 乙 | `*During I was reading, …` | **preposition 56/51**——**L98 已用一次，不可重复** |
| 乙 | `*As I was read, he was sleeping.` | **verb_form 93/58**（#14/#43/L34 同型） |
| 乙 | `*I was reading, he was sleeping.`（粘连） | **run_on 14/12**（#7·#15·#27·#28·#40·#87）／**fragment 14/13**（#13·#14·#17·#28·#48·#49·#50·#75·#87） |
| 丙 | `*I had my hair cuted.`／`*She have her room cleaned.` | **verb_form 93/58**（#102 反向同型）／**sv_agreement 53/43**（#34/#48） |
| 丁／戊 | 甲乙各半；戊＝复用既有错型（**零新增**） | 全枚举 |

**判定**：**甲吃全库最厚两条（146 错点／约 89 案）**，承载力最优；乙稳吃 tense／run_on／fragment 三条中薄档（后两条合计仅 28 错点，**回旋空间小**）；丙只得 verb_form 且错型偏语义。枚举**不可动**（`huntService.ts:331-342`；`huntService.test.ts:109` 断言 `toHaveLength(10)`）。

---

## 3. cloze 落点预演（三套抽词器实跑）

**① ambush R-B8**（`grammarAmbushService.ts:160-193`；`GRAMMAR_WORDS` **147 条/146 唯一**，停用词 30；①语法词→②实词≥3→③第 2 词）

| 候选句 | ambush 落点 | boost 档 1 落点（28 seed 全跑） |
|---|---|---|
| `My mom makes me do my homework.` | **makes** ✅ | homework 12·mom 8·**makes 8**（△ 8/28） |
| `My dad made me clean my room.` | **made** ✅ | room 12·dad 8·**made 8**（△） |
| `She made me wait.` | **made** ✅ | **made 16**·wait 12 ✅ |
| `He doesn't let me go.` | **doesn't** ✅ | **doesn't 16**·**let 12** ✅ 全落考点 |
| `Let me carry the box.` | **Let** ✅ | box 12·Let 8·carry 8 |
| `During the class, I was reading.` | **was**（`during` 不在词表） | reading 12·**During 8**·class 8 ✅ |
| `We waited until the rain stopped.` | **waited**（②实词，`until` 不在表） | **stopped 12**·waited 8·**until 8** ✅ |
| `As I was walking home, I saw a dog.` | **As**（①）✅ | saw 8·walking 8·home 4·was 4·dog 4 |
| `As I was reading, he was sleeping.` | **As** ✅ | sleeping 12·was 8·reading 8 |
| `I'll have my hair cut.` | **have** ✅ | **cut 12**·I'll 8·**have 8** ✅ |
| `She had her room cleaned.` | **had** ✅ | **cleaned 12**·had 8·room 8 ✅ |
| `He got his bike fixed.` | **got** ✅ | **fixed 12**·got 8·bike 8 ✅ |

**② review 会话**（`grammarReviewService.ts:142-180`，停用词仅 7、按 `reviewCount % 候选数` 轮转）：候选＝句内全部长度>2 非停用词 → **全部候选句 100% 可抽中**（含 during／until／as）。

> **技术结论**：**`As` 仅 2 字母 → 在 boost 档 1 永不成为空位**（②实词规则要求长度≥3）。若乙以 as 为主考点，boost 侧整批落空。**建议 as 课主句写 `As I was walking home, I saw a dog.`**（ambush 落 As ✅、review 全覆盖、boost 落 saw/walking），或把 as 只放 contrast 错卡（改错题不受长度限制）。`during`／`until` 落点正常，**无须改词表**。

---

## 4. 基建护栏（大章节）

| 护栏 | 现状（实读） | 动作 |
|---|---|---|
| **season-16** | `grammarSeasons.ts:44` 末项 season-15={95,102}；**无 season-16** | 追加 `{min:103, max:103+N-1}`；`grammarSeasons.test.ts` **4 项守门**（区间覆盖＋互不重叠＋label/hint 非空＋最高课号被覆盖） |
| **m18** | `GrammarPathPage.tsx:226-233` m17=afterLesson 102；**无 m18** | 追加 m18（`afterLesson: 102+N`）；**全仓无测试引用 mN**（纯纪律项） |
| **episode** | 止「小美的一天 一百零二」（`:18920`） | 续「一百零三…一百一十」；**>100 写法已有 2 例先例**，无格式风险 |
| **案号** | 111 案 1–111 **连续无跳号**；`reviewed` **111/111 全 true**；`huntService.test.ts:215` 断言番外恰 5 案 | 新案 **#112 起** |
| **课-案配比** | 每课引用 `{0:5, 1:88, 2:8, 3:1}`（空案 L2/3/5/6/8 为第一季基础课）；每案错点 `{2:10, 3:10, 4:88, 5:2, 6:1}` | 8 课需 **#112–#119**（一课一案，每案 4 错点为主流） |
| **关 1 解锁** | `lessonService.ts:144` 用 `number - 1` → **缺号永久锁死且无报错** | 103 起连续无跳号（人工核对） |
| **guided.spot** | 全 102 课均存 1 张；**L96／L102 的 `wrongToken="rain"` 与 token `"rain."` 不严格相等**（`grammarBoostService.ts:502` 用 `===`）→ 两课 guided 改错题**实际不出题**，靠 contrast 顶住 | **新批 wrongToken 必须与 token 逐字相等（不带尾标点）** |

> **隐性缺陷（本批新发现）**：`grammarBoostService.ts:502` 的 `tokens.findIndex((token) => token === spotStep.wrongToken)` 是**严格相等**；L96／L102 写成 `tokens:["It","was","rain."]`＋`wrongToken:"rain"` → 索引 −1 → 该题静默消失。两课最终仍 ≥2 道（靠 contrastSpot），故测试未红。**批十六须写进规格**（对比：contrast 侧走 `locateMarkedTokens`，先 `cleanWord` 去标点，不受影响）。

---

## 5. 封面池专章：单次池枯竭 → 二用升三用（含最优性证明）

**容量账（49 张 / 102 处引用）**：**单次池仅 4 张**（cover41·45·47·48，已用 L41/45/47/48——批十五已按路线图吃掉 8 张 13·14·15·22·27·37·38·40）；**二用池 37 张**；**三用池 8 张**（10·16·18·20·21·26·31·32，第三次落 L87–L94，**批十四刚三用，本批与下批勿碰**）。

### 5.1 最优指派（二分最大最小间距＋匹配，**已证明最优**）

位置 L103–L110；目标＝「三用后最小间距」＝ `min(新位置−二次位置, 二次位置−首次位置)`。

| 方案 | 最小间距（最优值） | 说明 |
|---|---|---|
| **4 单次（L103–106）＋4 二用（L107–110）** | **单次段 58／二用段 36** | 单次段 41(62)·45(59)·47(58)·48(58) |
| 纯二用 8 张 | **32** | 6／7／8 课三档最优值均 32 |
| 若只做 6 课 | 纯二用 32 | 余 2 张留批十七 |

**结论：混合方案压倒性更优**（58／36 vs 32）。**建议 L103–L106 取 4 张单次池，L107–L110 取 4 张二用**。

### 5.2 二用升三用·8 张排序建议（按「三用后最小间距」降序）

| 序 | 封面 | 已用 | 二次→L110 | 两段间距 | 理由 |
|---|---|---|---|---|---|
| **1** | **cover12** | 12, 67 | **43** | 55 | 二次落 L67，距今 62 课 |
| **2** | **cover17** | 17, 71 | 39 | 54 | 二次 L71，距今 32 课 |
| **3** | **cover9** | 9, 73 | 37 | **64** | 两段间距全池最宽之一 |
| **4** | **cover19** | 19, 74 | 36 | 55 | 二次 L74（批十一） |
| **5** | **cover29** | 29, 75 | 35 | 46 | 二次 L75 |
| **6** | **cover7** | 7, 76 | 34 | **69** | 两段 69 全池第一；短板是二次位置晚 |
| **7** | **cover42** | 42, 77 | 33 | 35 | 两段 35 已近 32 底线 |
| **8** | **cover25** | 25, 78 | **32** | 53 | 恰好压线，8 张中的最优选择 |
| 备 | cover1/2/3 | 1,79／2,80／3,81 | 31/30/29 | 78 | 二次落 L79–81（批十三刚用），第三次必贴太近 |
| ❌ | **cover49** | 49, 58 | 9 | 9 | **禁用**：两段间距仅 9 |
| ❌ | cover13·14·15·22·27·37·38·40 | 二次落 L95–102 | ≤10 | 62–82 | **批十五刚用，本批勿碰** |

**施工口径**：按上表 1→8 **倒序配到最晚课**（间距最大者放最晚）——纯二用＝`L110←12、109←17、108←9、107←19、106←29、105←7、104←42、103←25`（最小 32）；**混合（推荐）**＝`L107←12、108←17、109←9、110←19`（40/37/36/36）＋`L103←41、104←45、105←47、106←48`（62/59/58/58）。
**兜底**：`cover` 在 `types.ts:590` 为可选，缺省回退 scene SVG——**封面池耗尽不阻断生产**。

---

## 6. G-boost 复核（**批十六沿用**）

**测试逻辑实读**（`grammarBoostService.test.ts:159-181`）：全库**逐课**（无豁免）反复复练抽干改错池（10 轮），只统计 `kind === "spot"` 的**不同题源**，`collected.size < 2` 即 `thin` → `expect(thin).toEqual([])`。**逐字未变**。改错题两来源（`grammarBoostService.ts:498-543`）：① `guided.spot`（每课 1 道）；② contrast 卡中 `!bothRight` 且 `wrongMark` 可定位的条目。

**探针实跑（真 vitest，跑完即删）**：
- 全库 102 课 **全部 ≥2 道**，**thin＝0**。分布：{**2 道：13 课**}·3 道：28·4 道：12·5 道：9·6 道：17·7 道：23。
- **贴线（恰 2 道）13 门**：L72·73·79·80·81·85·**87·88·89·90·91·92**·**96**。**批十五贴线 1 门＝L96**（cs=2、guided=0，因 §4 缺陷）；批十五其余 7 门 3–4 道（批十四曾贴线 6 门）。
- 全库 contrast **612 张**（bothRight **197**／**带 wrongMark 367**），367 中 **366 可定位**；**唯一失败＝L89 `?`（标点 wrongMark 被 `cleanWord` 剥掉）**。
- contrastSpot 累计 **366**；guided 累计 **100**（＝102 − L96 − L102）。

### G-boost（**请写入批十六 PRD 硬需求项**）

> **G-boost**：**每课必须产出 ≥2 张「带 wrongMark 且可定位」的真实错卡（来自 contrast，`!bothRight`）**；口径＝「每课 contrast 至少 2 条：`wrongMark` 非空、非 bothRight、且字面词出现在 wrong 句里」。**推荐 3 条**，**禁止贴线**。**新增三条纪律**：① `wrongMark` **不得为标点**（L89 前车之鉴）；② **`guided.spot` 的 `wrongToken` 必须与 tokens 元素逐字相等（不带尾标点）**，否则 `:502` 严格匹配失败、题目静默消失；③ 多词语标注可用（`:190-216` 有专门测试）。

**同批其余 boost 红线**：① 档 1 **≥4 种题型**（`:218`）；② 档 2 **≥4 题**（`:411`）；③ 档 3 **produce＋variant＋fix 齐备**（`:440`）；④ 带干扰项 practice **≥2 道可抽 arrange**（`:388`）；⑤ **题源不撞号**（`:183`）。

---

## 7. 可生产性评估

| 候选 | 就绪度 | 生产量 | 风险 |
|---|---|---|---|
| **甲 使役补完章** | ★★★ | 结构整条新造（零底座），但**零件全在库**（`Let me` 51 处＋`help` 家族 145 处＋`made` 4 处）；4–6 课增量（makes／made／否定 doesn't let／回收 let·help／have·get） | **与 L74/L75 语义抢位**（L74 占 `let+me` 50 处）——**须换锚第三人称 makes／made／him·her·them**；`get sb to do` 零底座需全造 |
| **乙 连词补完章** | ★★★ | 中量：**until 全空白**（零风险上新）＋**as 连词空白**＋**during 门槛可回收**；须新造 until／as 对比卡各 ≥2 张带 mark | `during` 已由 L98 讲透 → **单开专课＝重复**（须并入而非独立）；`as` 语义多（因为/作为/当…时）分级待裁定；`As` 长度 2 → boost 空位永不落（§3） |
| **丙 have sth done** | ★★ | 结构零底座须全造（含 `will have` 搭档，全库 0） | **跨级**（中级 U46）；语义型错无法作 contrast 错句，只能靠 `cuted` 类弱形态 |
| **丁 混合（甲＋乙）** | ★★ | 甲 4 课＋乙 2 课 | 双拱破例（批十四刚用）；一课一增量难守 |
| **戊 机制深化** | ★★★★ | **零新语料** | 已饱和：boost 三档/回马枪/复习轮换/弱点驱动全在位且有测试守门——**无增量空间** |

**就绪度排序：甲 ＞ 乙 ＞ 戊 ＞ 丙 ≈ 丁**。**「零新语料」达标 0 项**。
**推荐形态（甲 6–8 课）**：L103 `make sb do` 立岗（第三人称 makes）→ L104 `made` 过去版 → L105 否定/疑问（`doesn't let me`／`Does she make you…?`）→ L106 回收 `let`（第三人称 him/her/them，**与 L74 显式分工**）→ L107 `have sb do`＋`get sb to do`（**分级放宽**）→ L108 使役家族合体收口。**乙若做**：并入甲作 2 课尾章（until＋as），**不单开 during 课**。

---

## 附录：核查留痕

**测试实跑**：`npx vitest run` → **54 文件 / 674 项全绿，4.26s**（插入探针时 55/675；删后复跑 54/674 一致）。
**实读源文件（14）**：GL(19,107 行/串 18,337)·HC(6,597/4,651)·`grammarSeasons.ts`＋test·`GrammarPathPage.tsx`·`grammarAmbushService.ts`·`grammarBoostService.ts`＋test·`grammarReviewService.ts`·`huntService.ts`＋test·`lessonService.ts`:144·`types.ts`:501/590·批十五路线图·L74/L96/L98/L102 课文原文。
**md5**：GL `2680426b5c6e1c51eadae03c06a335f7`·HC `410c9f4aae4f5a71f954f55674908956`·seasons `df6560762a428c45565461b83f22fa83`·ambush `84b306b40e881c4f9b8c8d000851686c`·boost `f5b2bb56917cdd1f4bd3a02cfc54b03d`·PathPage `f32a1449204e3ac15db536f4c68b001c`。
**raw 交叉验证**：`make` GL 0／`makes` 0／`made` 4（全 L68）；`lets` **0**；`until/till` 0/0；`As+主语` 0；`get/getting` 11/1（全 L16）；`during` 11（全 L98）；contrast 612／bothRight 197／带 mark 367；错点 418；封面 49 张/102 引用。
**未核实**：① 批十六课数与形态未定（6 还是 8）；② 甲与 L74 的「抢位」裁决待产品负责人定；③ `as` 语义分级待瑞思裁定（是否拆两课）；④ §5 封面方案按**编号间距**排序、**未做图像语义核对**（cover 图内容与场景是否匹配需人工确认）；⑤ 丙是否放行（跨级 U46）待裁决；⑥ L96/L102 的 `wrongToken` 缺陷**是否回修 L95–102** 未决（与批十五「不改写前批」纪律冲突）。
