# 数据盘点：第二十一批·look forward to（造词成本 ＋ cloze 假友好）

**日期**：2026-09-20 ｜ **类型**：实读代码/文件盘点（无数仓）｜ **成员**：数析

**方法**：单遍状态机提取引号内字符串（六态：`code`／`line_comment`／`block_comment`／`dq`／`sq`／`bt`；注释内字符串一律不入账，反斜杠转义按两字符吞掉），再按顶层 `^    number: N,` 切块，得「行号 → 课号（GL）／案号（HC）」映射。GL 命中 **24,072 条串**（英文口径 `^[A-Za-z0-9'’,.!?;: -]+$` **14,964 条**）；HC 命中 **5,796 条串**（英文口径 **4,594 条**）。**抽词器逐字复刻并实跑**：`grammarAmbushService.ts:160-213`（`GRAMMAR_WORDS` **144 唯一词** `:161-186` ＋ `CLOZE_STOP_WORDS` 30 词 `:190-193` ＋ 三级回退）与 `grammarBoostService.ts:243-249 / 249-395`（`FUNCTION_WORDS` 33 词 ＋ `keywordIndexes` 长度≥3 硬门 ＋ `buildCloze`），对 **16 句候选**跑 ambush 三级档位 ＋ boost 侧 **252 组现实 sourceRef 种子**（7 个形状合理的 lesson-id × 6 题源 × 6 index）。**复刻可信度用真服务交叉验证**（临时 vitest 探针，跑完即删）：真 `buildCloze` 在 `lesson-120-used-to-doing:t1:variants:1` 输出 `I am not used to ___ up early.` / `getting`，在 `lesson-128-it-sounds-great:t1:variants:1` 输出 `It does not ___ great.` / `sound`，与我的 Node 复刻**逐字一致**（§2.0）。封面指派用**二分答案（瓶颈指派）＋ 全枚举**（max-min-gap 目标）。

**口径声明（重要）**：报告**以工作区现状为准**。审计期间 `grammarLessons.ts` **被并行改动过一次**（见「未核实」§U1）——`forward` 族的核心数字因此**有两种状态**，本报告**一律以冻结态为准**：md5 **`92af8abf9f0f981dc4a75acf965093df`**、**25,139 行**、字节 1,189,812、mtime 2026-09-19 20:52:23。`huntCases.ts` 审计全程 md5 恒为 **`cdf2a735f8600a18dbc466488a370895`**（7,961 行）。**改动内容**：L133（收官课）新增一句 `forward` 认读种子（`:24969` examples ＋ `:25009` contrast bothRight），使 `forward` 从 **0 → 2**。所有数字出自冻结态。

**范围**：批二十一＝**`look forward to` 一族（B+ 档，大章 5 课）**，且为**「所有 B 档系列课程」的收官批**。本批核心＝**造词成本** ＋ **cloze「假友好」的量化与处置**。
> **对本批定性的一处重要修正（实读结论，请主理人注意）**：任务书说「`forward` 两文件全 0（必造）」——**该结论在批二十交付后已部分失效**：`forward` 在冻结态是 **GL 2 处／HC 0**，2 处全部来自 **L133 收官课新埋的 1 句认读种子** `I am looking forward to the weekend.`（`examples:24969` ＋ `contrast:25009`，文案写着「以后再说它」）。**故本批的准确成本结构是「词须立岗、句已现成」——从「造词＋造句」降级为「造词＋认读升格」**（§1.1／§1.5／§附录 A5）。

---

## 指标概览

| 指标 | 本期（实读·冻结态，批二十交付后） | 上期（批二十审计·批二十交付前） | 状态 |
|---|---|---|---|
| 课程 / 案件 / 错点 | **133 课 / 142 案 / 542 错点** | 127 / 136 / 518 | ✅ 批二十交付 ＋6 课／＋6 案／＋24 错点 |
| 罪名（错点/承载案） | verb_form **125/83**·plural **98/92**·sv_agreement **85/64**·preposition **60/55**·tense **47/39**·word_order **47/35**·article **28/22**·missing_be **24/20**·fragment **14/13**·run_on **14/12** | 121/80·95/89·75/59·60/55·44/36·43/31·28/22·24/20·14/13·14/12 | ✅ 10 项枚举稳定，`comparison` HC 仍 **0**（§4 口径说明） |
| 封面池 | **117 张用 133 次（单次 101·二用 16·三用 0）**；二用张＝**cover1–cover16**（L1–L16 ＋ L118–L133 两段） | 117 张/127 次（单次 107·二用 10） | 🔴 **批二十把「二用池」从 10 张扩到 16 张**（§6） |
| 案号 | max **#142**，1–142 **连续无跳号无重号**；`reviewed` **142/142＝100%** | max #136 | ✅ 下号 **#143** |
| 课号 | 1–133 **连续无跳号无重号** | 1–127 | ✅ 下号 **L134** |
| 基建 | season-20 `{128,133}` 已在位（**20 季**）；m22 `afterLesson:133` 已在位（**22 里程碑**）；episode 止「一百三十三」 | season-19/m21 | ✅ 须续 season-21／m23 |
| **`forward` 全族** | **GL 2／HC 0**（`forward` 仅 L133 认读种子 2 处；`look forward to` **0**、`look forward` **0**、`forwards` **0**） | GL 0／HC 0 | 🟡 **批二十收官课已埋 1 句认读种子**——`forward` 不再是绝对零 |
| **`object` 全族** | **GL 0／HC 0**（`object`／`objects`／`objected`／`object to`／`objection`／`objecting` 全零） | GL 0 | 🔴 仍是纯空地 |
| **`to + -ing` 底座** | **GL 81 处／37 个不同句**（L120 **33**·L122 **24**·L124 **12** 占 **69 处＝85%**）；**HC 2 处**（#129/#131） | GL 81 处／26 句 | ⚠️ **高度集中在批十八 L120–L124** |
| `to + -ing` 错卡 | **GL 17 处落在 `wrong:` 字段** ＋ **1 处 `❌` 标记**（L122 `:22911`） | — | ✅ 反面例子**有货**（§3.2） |
| `look` 家族 | `look` **174**·`looks` **183**·`looking` **17**·`looked` **1**；`Look at` **22**·`looks like` **5** | — | 批十九（L125–127）**287 处** ＋ 批二十（L128–133）**42 处**（§3.3） |
| 测试 | **61 文件 / 798 项全绿**；`tsc --noEmit` **0 错（exit 0）** | 61/785 | ✅ 基线已上移 |
| G-boost | **50 项全绿**；thin（＜2 改错题）＝**0 课**；`wrongToken` 违规 **0**；纯标点 `wrongMark` **0** | 50 项；thin=0 | ✅ 三护栏全守 |
| **cloze 落点（本批核心）** | ambush：**16/16 全走第①档**，空位＝`am/is/are/look/looks/was`——**`forward`／`looking` 永不落空（16/16＝0%）**；boost：`forward` 可落 **22.6–34.9%**、`looking` 可落 **0–35.7%** | ambush 8/8 第①档 | 🔴 **「假友好」确认：ambush 侧考点词 100% 逃逸**（§2） |

## 洞察

1. **本批的门槛仍是「贵」，但比批二十预估的便宜一点：`forward` 已有 1 句认读种子在 L133。** 实读冻结态：`forward` GL **2 处**（同 1 句，落在 `examples:24969` ＋ `contrast:25009`）、HC **0**；`look forward to`／`look forward`／`forwards`／`looking forward to` 的「独立条」仍为 **0**（现有 2 处全部是被 L133 那句 `I am looking forward to the weekend.` 带出来的）。**批二十的盘点结论「`forward` 是绝对零」在批二十收官时已被自家改动作废**——收官课按惯例埋了一句认读种子（与 L127 `It looks like rain.` 同款做法：`examples` ＋ `bothRight` 双重落位）。**数析判定：造词清单仍成立（`forward` 必须正式立岗），但「零起点」变成「1 句认读起点」——本批可以直接引用 L133 那句做回流接口**（§1.1）。

2. **配套词几乎不用造：名词侧「盼着的事」四件全在库，`-ing` 侧「盼着做的事」五件在库，时间词两件在库。** 实读（**已剔除 id 串假阳性**，`hunt-trip-time` 这类 id 会让 `trip` 假阳性——这是本批最容易踩的坑）：`weekend` GL **9 真词**（L15/24/29×4/40/49×3/133×2）＋HC **5 真词**；`birthday` GL **152 真词**（L56 38·L111 59·L117 16·L118 18 为主）＋HC **9**；`party` **2/2**；`summer` **3/5**；`photo` **3/6**；`letter` **8/0**；**`trip` GL 真词 0／HC 真词 1**（#66 `:4183` token `"trip."`）；**`holiday` 双 0**。**结论：「盼着某件事」可以做到零造词**（§1.2）。

3. **真正稀缺的是「盼着做什么」那一侧的最自然表达——`seeing`／`meeting`／`visiting` 三词双文件全 0，但替代品极厚。** 实读：`seeing` **0/0**、`meeting` **0/0**、`visiting` **0/0**；而在库的 `-ing` 家常菜是 `reading` **598/44**、`drawing` **141/9**、`going` **126/16**、`swimming` **69/6**、`playing` **37/9**、`cooking` **11/3**、`waiting` **6/2**、`helping` **7/2**、`coming` **3/0**、`traveling` **6/0**。**结论：「盼着做某事」不必新造词**——用 `playing`／`reading`／`swimming` 即可成句；**若要写那句最高频的 `I am looking forward to seeing you.`，成本就是 1 个 `seeing`**（§1.3）。

4. **时间词是「一半有、一半零」：`tomorrow` 在库（GL 37 真词），`soon`／`next week` 双零。** 实读：`tomorrow` GL **37/3**；`this weekend` GL **3/0**；`tonight` GL **2/0**；**`soon` 0/0、`next week` 0/0、`next month` 0/0、`next year` 0/0、`later` GL 0／HC 1**。**结论：时间词可零造词**（`tomorrow` ＋ `this weekend` 足够）；若产品坚持要 `soon`，成本 = 1 个新副词，且**库里没有任何同义替代**（`later` 也基本为 0）（§1.4）。

5. **总成本结论：必造 1 个（`forward`），推荐造 2 个（`forward` ＋ `seeing`），可零造词绕开其它全部。** 逐方案：A 零造词版（除 `forward`）→ 0 额外词；B 最小造词版（＋`seeing`）→ 1 额外词；C 完整版（＋`trip`／`soon`／`holiday`）→ 4 额外词，**不建议**（`holiday` 与 `weekend` 语义重叠）；D 撤出主候选 → 但**「所有 B 档系列课程收官」的产品定性已定**，撤出等于 B 档线断尾。**数析建议：B 方案（总计 2 个新词）**（§1.5）。

6. **`to + -ing` 的正面教学句在库里确有 26 句，但它们**不是**「复现接口」，因为它们的 `to` 前面站的是 `used to`／`be used to`——语义与 `look forward to` 不同族。** 实读正面槽位逐条（`targetSentence`／`variants`／`examples`／`sceneSwings`／`dialogue`／`recall`／`summary`／`oneLineRule`／`deepDive`）：**26 句集中在 L120（12 句）／L122（5 句）／L124（2 句）／L121（1 句）**，全部形如 `I am used to getting up early.`／`She is used to walking to school.`／`I am used to walking to school.`。**唯一可作的接口是「形式层」**（`to` 后面跟名字版 `-ing` 这条手感），**不是「语义层」**——`look forward to` 的语义重心是「盼」，`be used to` 是「习惯了」，学习者不会自动迁移。**更关键的是 `-ing` 词只有两个**：`getting`（35 处）＋`walking`（29 处）占 64/81＝**79%**，`look forward to` 若要用它做复现，只能复现「`to` ＋ `-ing`」的**形状**，拿不到新词（§3.1）。

7. **`to + -ing` 的「错卡」（反面例子）确实有一批，但它们是**「`to` 后面错跟原形／错跟 `-ing`」的两类混淆**，不是「`look forward to` 专属错型」。** 实读 `wrong:` 字段：**GL 17 处** 落在 `contrast.wrong`／`guided.options` 里，逐条为 L15 `:2728` `I want to going home.`／L29 `:5293` `I am going to watching.`／L44 `:8062` `I go to the shop to buying milk.`／L46 `:8440` `I want to traveling.`／L47 `:8627` `I should to helping her.`（＋`:8628` `wrongMark`）／L93 `:17314` `I used to playing here.`／L100 `:18641` `I used to playing here every day.`（＋`:18708` 选项）／L108 `:20255` `I get him to going with me.`（选项）／L120 `:22466` `I am used to geting up early.`／L122 `:22848` `She used to working late.`／L122 `:22860` `I used to walking to school.`／L124 `:23349` `I don't used to walking to school.`（选项）。**`❌` 标记只有 1 处**：L122 `:22911` `She used to working late ❌ —— 两头都占`。**结论：反面底座很厚（17 处），`look forward to` 的「`to` 后面错跟原形」错型（`I am looking forward to see you.`）可以直接挂进这条既有记忆链**（§3.2）。

8. **`look` 家族在批十九＋批二十之后已经极厚（L125–L133 合计 329 处），这对 `look forward to` 是**双刃**：`look` 本身零造词成本，但「`look` ＋ 形容词」的用法已被感官章连占 9 课，`look forward to` 里的 `look` 是**第三个意思**（不是「看起来」），存在同形干扰。** 实读：`look` GL **174**（L125 **32**·L126 **61**·L127 **58**·L128 3·L133 1，前 21 课合计仅 19 处）；`looks` GL **183**（L125 **56**·L126 37·L127 42·L128 9·L133 25）；`looking` GL **17**（**L27 占 10 处，全是 `looking for`「正在找」**·L133 2·L13 1·L37 1·L73 2·L126 1）；`looked` GL **1**（L76）；`Look at` **22**（L127 占 14）；`looks like` **5**（L127 占 4）。**关键实读**：`looking` 的 17 处里有 **10 处是 L27 的 `looking for`**——那才是库里现成的 `look` ＋ `-ing` 底座（`What are you looking for?` 是 L27 的 `targetSentence:4898`）。**`look forward to` 的 `looking` 与它同形不同义，这是本批要正面切的第三张脸**（§3.3）。

9. **cloze「假友好」量化确凿：ambush 侧 16/16 全走第①档，空位一律落在 `am/is/are/look/looks/was`，`forward`／`looking` 落空率 0%。** 根因实读：`forward`（7 字母）与 `looking` 都**不在 `GRAMMAR_WORDS` 表内**（该表 144 唯一词，**不含 `forward`／`looking`／`forwards`**），而 `am/is/are/look/looks/was` 都在表内——`findIndex` 取**第一个命中**，`am`（idx1）永远排在 `looking`（idx2）前面。**逐句实读**（§2.1）：`I am looking forward to the weekend.` → 档①，空位 **`am`**；`She is looking forward to the trip.` → 档①，空位 **`is`**；`Are you looking forward to the weekend?` → 档①，空位 **`Are`**（idx0）；`I look forward to the weekend.` → 档①，空位 **`look`**；`She looks forward to the weekend.` → 档①，空位 **`looks`**。**16 句无一例外**（§2）。

10. **但 boost 侧**不假**：`forward`／`looking` 都满足「长度 ≥3 且非功能词」，可成空位，实测落点约 1/3（三候选位均分）。** 实读 boost 复刻（252 组种子）：`I am looking forward to the weekend.` → 候选位 `looking/forward/weekend` 三选一，**`forward` 可落 29.4%、`looking` 可落 35.7%**；`I am not looking forward to the test.` → 四候选位（`not/looking/forward/test`），`forward` 可落 **22.6%**；`What are you looking forward to?` → 三候选位（`What/looking/forward`），**`forward` 可落 34.9%**（最有利，因为 `forward` 是句末词且 `to` 被 fw 表排除）。**结论：本批的 cloze 要靠 boost 档 1 兜底，ambush 侧不可依赖**（§2.2）。

11. **处置建议（本批核心可执行结论）：ambush 侧必须靠 `contrast`／`guided.spot`／`practice.distractors` 承载考点，cloze 只当「`am/is/are` 复习位」用；boost 侧让 `forward` 自然落到 1/3 概率即可。** 具体三条：① **必须为每课配 ≥2 道 `contrast` 或 `guided.spot`**（G-boost 护栏 `grammarBoostService.test.ts:161-183` 已断言每课改错题 ≥2 道，这正是本批的救命通道）；② **`practice.distractors` 要放 `forward` 的混淆项**（如 `forward` vs `for`／`front`／`before`），因为 cloze 的干扰项池 `courseVocabulary()` 会过滤 `-ing` 结尾词——`looking` 不会进干扰项池，只能靠 practice 手工覆盖；③ **`variants` 三态必须齐**（肯定／否定／疑问），因为 ambush 的 `buildRevisitQuiz` 对 `variants` 做 `cloze/rebuild` 轮换（`grammarAmbushService.ts:244-253`），三态齐才能保证 3–5 题的题量（§2.3）。

12. **罪名承载：`look forward to` 能植的错型在 10 枚举内至少有 6 类，且能顺带带上 4 个薄档罪名的 3 个。** 实读枚举（`huntService.ts:331-342` 权威 10 项：`tense`／`sv_agreement`／`missing_be`／`article`／`plural`／`preposition`／`fragment`／`run_on`／`word_order`／`verb_form`）：`verb_form` 是**本结构的主罪名**（`forward to see` → `forward to seeing`；库里 `verb_form` 已有 **125/83**，最厚）；`preposition` 是**结构级必带**（`look forward to` 的 `to` 丢不掉，库里 **60/55**）；`sv_agreement`（`She look forward to` → `looks`，**85/64**）；`missing_be`（`She looking forward to` → 漏 `is`，**24/20**，薄档）；`tense`（`I was looking forward to` 与 `I am` 混淆，**47/39**）；`article`（`to the weekend` 的 `the`，**28/22**，薄档）；`word_order`（`I am looking to forward the weekend.`，**47/35**）。**`fragment`（14/13）与 `run_on`（14/12）承载难度高**——本结构是短句，难写出残句／流水句，**建议不硬塞**（§4）。

13. **封面池被批二十消耗到「二用池 16 张」，但最优指派反而更干净：`L134←cover17／L135←cover18／L136←cover19／L137←cover20／L138←cover21`，min-gap ＝ 117，解数 = 1。** 实读：单次张 **101 张**（cover17–cover117），二用张 **16 张**（cover1–cover16，对应 L1–L16 ＋ L118–L133）；**可用池（在 L134–L138 五位都 ≥35 线）＝ cover17–cover99 共 83 张**（`cover99` 在 L134 的 gap ＝ 35 压线过；**`cover100` 在 L134 的 gap ＝ 34，出局**）。**瓶颈最优解唯一**：cover17–cover21，五张的 gap **全为 117**（对应 L17–L21），**同 min-gap 解数 ＝ 1**（§6）。

14. **基建三项（season-20／m22／episode「一百三十三」）全部落地，批二十一须续 season-21／m23，且守门测试会先红。** 实读：`grammarSeasons.ts:58` 末项 `{id:"season-20", min:128, max:133}`（**20 季**）；`GrammarPathPage.tsx:269-274` 末项 `can-do-m22 / afterLesson: 133`（**22 里程碑**）；episode 末项「小美的一天 一百三十三」（`:24952`），**下一个写「一百三十四」**。`grammarSeasons.test.ts` **4 项守门**（`:12` 区间覆盖／`:22` 互不重叠／`:36` label·hint 非空／`:43` 最高课号被覆盖），**忘加 season-21 立刻红**；`can-do-m*` 全仓测试引用数 ＝ **0**（`grep -rn "can-do-m" src --include=*.ts --include=*.tsx | grep -v GrammarPathPage.tsx` **无输出**），**纯纪律项、无守门**（§5）。

15. **案号与课号两条连续性完好，下一个可用案号 #143；番外案名单仍是 5 案（#16–#20）。** 实读：案号 1–142 **连续无跳号无重号**、`reviewed` **142/142**；每案错点数分布 **4 处 119 案／2 处 10 案／3 处 10 案／5 处 2 案（#42/#43）／6 处 1 案（#34）**。**番外案＝#16 hunt-white-cat／#17 hunt-sports-day／#18 hunt-pen-pal-letter／#19 hunt-fridge-note／#20 hunt-term-review 共 5 案**；空 `huntCaseIds` 的课 ＝ L2/3/5/6/8 共 5 课。**唯一被两课引用的同一案 ＝ `hunt-my-sister`（L14＋L25）**；引用总数为 **138**（分配：1 案 119 课 ＋ 2 案 8 课 ＋ 3 案 1 课 ＋ 0 案 5 课；唯一 id 137 个，逐条见 §附录 A4）（§5.4）。

---

## 1. 造词成本专章（本批核心）

**判定口径**：「在库」＝该词在 GL 或 HC 的**引号内字符串**里至少出现过 1 次（含讲解串里的英文片段）；「须新造」＝两文件引号内字符串 **0 次**；数字同时给「词次（处）」与「承载串数（串）」，并**排除 id 串假阳性**——`hunt-trip-time`／`hunt-weekend-plan`／`hunt-photo-album` 这类 id 会让 `trip`／`weekend`／`photo` 假阳性，**这是本批最容易踩的坑**（§附录 A3 有逐条核查结果）。凡是 id 串与真词混在一起的词，本报告**双口径都给**。

### 1.1 `look forward to` 族逐形态（GL＋HC 双文件，冻结态）

| 形态 | GL 处 | GL 串 | HC 处 | HC 串 | 判定 |
|---|---|---|---|---|---|
| `forward` | **2** | 2 | **0** | 0 | 🟡 **不再是绝对零**：2 处同 1 句，全在 L133（§注） |
| `forwards` | **0** | 0 | **0** | 0 | 零（英式副词形，不需要） |
| `forward to` | **2** | 2 | **0** | 0 | 🟡 同 L133 认读句带出 |
| `look forward to` | **0** | 0 | **0** | 0 | 🔴 **整串 0**（库里从没出现过这个搭配） |
| `look forward` | **0** | 0 | **0** | 0 | 🔴 整串 0 |
| `looking forward` | **2** | 2 | **0** | 0 | 🟡 同 L133 认读句带出 |
| `looking forward to` | **2** | 2 | **0** | 0 | 🟡 同 L133 认读句带出 |
| `object`／`objects`／`objected`／`object to`／`objection`／`objecting` | **0** | 0 | **0** | 0 | 🔴 **全零**（§5） |
| `toward`／`towards`／`backward`／`forwarded` | **0** | 0 | **0** | 0 | 零（无近邻干扰，也无可复用同族） |

> **注（L133 认读种子的逐句抄录——本批唯一的 `forward` 起点）**：
> - `:24969`（L133 `examples` 第 4 条）`{ en: "I am looking forward to the weekend.", zh: "我盼着周末。（认读一句，混个脸熟）" }`
> - `:25009`（L133 `contrast` bothRight 条）`wrong: "I am looking forward to the weekend.", wrongMark: null, correct: "It looks nice.", bothRight: true, whyZh: "认读一句，混个脸熟：这句话说的是「我盼着周末」——今天只认脸，不学新花样（以后再说它）。"`
>
> **这是本批可以直接引用的唯一现成接口**：`I am looking forward to the weekend.` 已在 L133 出现过 **2 个槽位**（`examples` ＋ `contrast`），文案明确写着「以后再说它」——**批二十一正是那个「以后」**。按批十九 L127 → 批二十的成例（`L78 认读升级` 的模式，见 `:17175` 「第 78 课你见过…当时只是认读——今天它转正了」），**本批可以对 L133 那句做同款「认读升级」话术**，成本为零。
>
> **独立复验**（`grep -o -i -w`，不经我的提取器）：`grep -c "look forward\|looking forward"` 在 `grammarLessons.ts` ＝ **2**（两行，均 L133）；`grep -o -w -i "forward" src/data/huntCases.ts | wc -l` ＝ **0**；`object` 在两文件的 `grep -ow` 计数**全为 0**。**结论：`forward` 的「词」是新的（库里只有 1 句认读），但「句」已有现成的。**

### 1.2 「盼着什么事」——名词侧逐条（**结论：可做到零造词**）

| 名词 | GL 处（真词） | GL 所在课（行号·**已剔除 id 串**） | HC 处（真词） | 判定 |
|---|---|---|---|---|
| **`weekend`** | **9** | L15 `:2858`／L24 `:4506`／L29 `:5264`·`:5281`·`:5370`·`:5371`／L40 `:7301`／L49 `:8959`·`:8976`／**L133 `:24969`·`:25009`** | **5** | ✅ **在库，且 L133 已有 `the weekend` 搭配** |
| **`birthday`** | **152** | L27 5·L52 1·**L56 38**·L57 11·L60 1·L85 2·L92 2·L97 1·**L111 59**·L112 1·**L117 16**·**L118 18** | **9** | ✅ **底座极厚**（`my birthday` 先例已有） |
| **`party`** | **2** | L57 `:10480`·`:10536`（`The party is on June 2.`） | **2** | ✅ 在库（底座薄：仅 L57 一课） |
| **`summer`** | **3** | L18 `:3311`／L25 `:4585`（`It rains a lot in summer.`）／L46 `:8417`（`Any plans for the summer?`） | **5** | ✅ 在库（`for the summer` 先例已有） |
| **`photo`** | **3**（另有 4 处 id 串） | L22 `:4140`（`photo` 真词）／L39 `:7272`／L60 `:11030`·`:11043`·`:11047` | **6**（另有 4 处 id 串） | ✅ 在库 |
| **`letter`** | **8** | L23 `:4166`·`:4220`·`:4251`·`:4252`／L52 `:9536`·`:9591`／L53 `:9724`·`:9777` | **0**（1 处 id 串 `hunt-pen-pal-letter`） | ✅ 在库 |
| **`trip`** | **0（真词）** | GL 仅 1 处 id 串 `hunt-trip-time` `:13667`——**不计** | **1 真词**（#66 `:4183` token `"trip."`；另有 1 处 id 串 `hunt-trip-time` `:5163`） | ⚠️ **GL 须新造**；HC 有 1 处 token 可作锚点 |
| **`holiday`** | **0／0** | — | **0／0** | 🔴 须新造（**建议不做**：`weekend`／`summer` 已够用） |
| **`September`** | **5** | L56 `:10333`·`:10347`·`:10355`·`:10443`·`:10445` | **1** | ✅ 在库（月份，可作「盼着的时间点」） |
| `vacation`／`weekends`／`parties` | **0／0** | — | **0／0** | 不需要 |

> **实读裁定**：「盼着**某件事**」这一侧**可以做到零造词**——`I am looking forward to the weekend.`（L133 已有原句！）／`...to my birthday.`／`...to the party.`／`...to the summer.`／`...to the photo.`／`...to the letter.` 六句全部由在库词构成，**其中第一句连词序都是现成的**。
> **唯一取舍点**：`trip`（旅行是「盼」的经典场景）需 1 个新名词。**替代方案**：整句改用 `weekend`／`summer`／`birthday`（都在库且更贴「小美的一天」的日常场景）。

### 1.3 「盼着做什么」——`-ing` 侧逐条（**结论：不必造词，但最高频那句要 1 个 `seeing`**）

| `-ing` 词 | GL 处／串 | GL 主要所在课 | HC 处／串 | 判定 |
|---|---|---|---|---|
| **`reading`** | **598／569** | L42 58·L45 54·L46 41·L64 56·L77 32·L95 40·L97 45·L98 56·L99 32·L101 41·L102 44·L120 14 | **44／44** | ✅ **库里最厚的 `-ing`** |
| **`drawing`** | **141／141** | L13 18·L34 26·L67 40·L45 8·L64 7·L43 7·L95 6 | **9／9** | ✅ 在库 |
| **`going`** | **126／114** | **L29 82**（`be going to` 将来时搭档）·L75 20·L38 5·L108 5 | **16／15** | ⚠️ **在库但与 `be going to` 撞型**，建议避开 |
| **`swimming`** | **69／67** | L43 56·L67 6·L14 4·L42 1·L72 1·L13 1 | **6／6** | ✅ 在库且厚 |
| **`playing`** | **37／37** | L13 7·L34 9·L95 6·L98 5·L51 3·L100 3·L93 2·L25 1·L122 1 | **9／9** | ✅ 在库 |
| **`cooking`** | **11／11** | L98 7·L99 4 | **3／3** | ✅ 在库 |
| **`helping`** | **7／7** | L47 `:8627`·`:8628`·`:8630`（**全是错例** `I should to helping her.`）／L61 4 | **2／2** | ⚠️ 在库但**带着错例记忆**，慎用 |
| **`waiting`** | **6／6** | L24 2·L61 1·L104 1·L105 1·L108 1 | **2／2** | ✅ 在库 |
| **`traveling`** | **6／6** | L44 1·L46 4（含错例 `:8440`）·L108 1 | **0** | ⚠️ 在库，但 4 处里含错例 |
| **`coming`** | **3／3** | L38 `:6969`·`:6970`·`:6972` | **0** | ✅ 在库（薄） |
| **`seeing`** | **0／0** | — | **0／0** | 🔴 **须新造**（若写 `...to seeing you.`） |
| **`meeting`** | **0／0** | — | **0／0** | 🔴 须新造 |
| **`visiting`** | **0／0** | — | **0／0** | 🔴 须新造 |
| `travelling`（双写） | **0／0** | — | **0／0** | 不需要（单写形在库） |

> **实读裁定**：**「盼着做某事」不必造词**——`I am looking forward to playing football.`（`football` GL 61 处、L13 `:2332` 即有 `They are playing football.`）／`...to reading.`／`...to swimming.`／`...to cooking.` 全部由在库词构成。
> **唯一的取舍点**：`I am looking forward to seeing you.` 这句**最自然、最高频**的中文映射，需要新造 `seeing`（1 个词）。
> **数析建议**：**若要保留这句，成本就是 1 个 `seeing`；这是本批最值得花的那 1 个词**——因为 `see you` 在库已有底座（GL **20 处 `see`**，其中 `It's nice to see you.` 在 L87 有 3 处、`The teacher wants to see you.` 在 L107），`seeing` 只是它的名字版，造出来能被 L87 正向复用。

### 1.4 时间词逐条

| 时间词 | GL 处（真词） | HC 处（真词） | 所在课（行号） | 判定 |
|---|---|---|---|---|
| **`tomorrow`** | **37** | **3** | L12 31 处（`:2136`·`:2139`·`:2144`·`:2149`·`:2150` 等）·L13 2·L16 2·L29 2 | ✅ **在库，可直接用** |
| **`this weekend`** | **3** | **0** | L29 `:5264`·`:5281`·`:5371` | ✅ 在库 |
| `tonight` | **2** | 0 | L29 `:5337`／L78 `:14454` | ✅ 在库 |
| **`soon`** | **0** | **0** | — | 🔴 须新造（**库内无任何同义替代**：`later` GL 0／HC 1） |
| **`next week`** | **0** | **0** | — | ⚠️ 组合须新造（`next` 与 `week` 均在库，但**整串 0**） |
| `next month`／`next year` | **0／0** | **0／0** | — | 同上 |
| `later` | **0** | **1**（#? `:3763`） | — | 基本为 0 |

> **实读裁定**：**时间词可零造词**——`tomorrow`（37 处）与 `this weekend`（3 处）都是现成的。**若产品要 `soon`，成本是 1 个新副词**，且**没有任何同义替代**（`later` 也几乎不在库）。
> **注意**：`next week` 这类「`next` ＋ 周期词」的组合，**库里整串为 0**——属于**新句法搭配**而不仅是新词，**建议改用 `tomorrow`／`this weekend` 规避**。

### 1.5 总成本结论（**本批最关键的一问**）

| 方案 | 做法 | 额外造词数 | 可行性 | 风险 |
|---|---|---|---|---|
| **A. 零额外造词版** | `I am looking forward to the weekend.`（L133 已有）／`...to my birthday.`／`...to playing football.`／`...to reading.` | **0**（`forward` 已由 L133 埋种，正式立岗即可） | ✅ **可行** | 只能用 `-ing` 家常菜；「盼着见你」这个最高频表达要绕开 |
| **B. 最小造词版（推荐）** | A ＋ `I am looking forward to seeing you.` | **1**（`seeing`） | ✅ **推荐** | 无——`seeing` 可被 L87 `It's nice to see you.` 正向复用 |
| **C. 完整造词版** | B ＋ `...to the trip.` ＋ `...soon.` ＋ `...to the holiday.` | **4**（`seeing`／`trip`／`soon`／`holiday`） | ✅ 可行 | 造词数上升；`holiday` 与 `weekend` 语义重叠，**不建议** |
| **D. 完全不造词（撤出主候选）** | 改做 `object to` 或其它候选 | — | ❌ **不建议** | **`object` 全族双 0、且无「盼」的情感抓手**（§5）；且**本批是「所有 B 档系列课程」的收官批**，撤出等于 B 档线断尾 |

> **注（`forward` 的定性）**：`forward` 的**词是新造的**（库里只有 1 句认读、且无任何搭配位：`look forward to`／`put forward` 后者对 A2 用户过难，**不构成复用**），但**句已有现成的**（L133 `I am looking forward to the weekend.` 已在 `examples` ＋ `contrast` 双槽位）。**故「必造 1 个词（`forward`）＋ 推荐 1 个词（`seeing`）＝ 总计 2 个」是本批的准确成本结论**；L133 的认读种子把「起步成本」从「造词＋造句」压到「造词＋**升格课**」（§附录 A5 有「认读升级」成例逐条）。

---

## 2. cloze 落点专章（假友好的量化与处置）

### 2.0 复刻可信度交叉验证（**先证方法可信，再报数字**）

**方法**：临时 vitest 探针（`src/services/__probe_b21.test.ts`，跑完即删）直接调用真 `buildBoostItems(lessonId, 1)`，dump 真实 `clozeText`／`clozeAnswer`／`sourceRef`，与我的 Node 复刻逐字比对。

| 课 | 真服务输出（sourceRef） | 真 `clozeText` | 真 `clozeAnswer` | 我的复刻 | 一致？ |
|---|---|---|---|---|---|
| L120 批十八 | `lesson-120-used-to-doing:t1:variants:1` | `I am not used to ___ up early.` | `getting` | `I am not used to ___ up early.` / `getting` | ✅ **逐字一致** |
| L128 批二十 | `lesson-128-it-sounds-great:t1:variants:1` | `It does not ___ great.` | `sound` | `It does not ___ great.` / `sound` | ✅ **逐字一致** |

> **结论：复刻可信**。两例覆盖「`be used to + -ing`」与「感官动词」两种本批最相关结构，且**真服务的答案分别落在 `getting`／`sound`**——证明复刻正确复现了 `keywordIndexes` 的「长度 ≥3 且非功能词」筛选与 `mulberry32` 确定性抽取。

### 2.1 ambush 侧逐句实读（**16 句全走第①档，考点词 100% 逃逸**）

`grammarAmbushService.ts:195-213` 的三级回退：① `GRAMMAR_WORDS`（**144 唯一词**，`:161-186`）取 `findIndex` 第一个命中 → ② 实词（长度 ≥3、非 `CLOZE_STOP_WORDS`）→ ③ 第 2 词。

| 候选句 | 档 | 空位词 | 空位句 | `forward` 能成空位？ | `looking` 能成空位？ |
|---|---|---|---|---|---|
| `I am looking forward to the weekend.` | **①** | **`am`** | `I ___ looking forward to the weekend.` | ❌ | ❌ |
| `I am looking forward to seeing you.` | **①** | **`am`** | `I ___ looking forward to seeing you.` | ❌ | ❌ |
| `She is looking forward to the trip.` | **①** | **`is`** | `She ___ looking forward to the trip.` | ❌ | ❌ |
| `We are looking forward to the party.` | **①** | **`are`** | `We ___ looking forward to the party.` | ❌ | ❌ |
| `Are you looking forward to the weekend?` | **①** | **`Are`**（idx0） | `___ you looking forward to the weekend?` | ❌ | ❌ |
| `I am not looking forward to the test.` | **①** | **`am`** | `I ___ not looking forward to the test.` | ❌ | ❌ |
| `I look forward to the weekend.` | **①** | **`look`** | `I ___ forward to the weekend.` | ❌ | ❌ |
| `She looks forward to the weekend.` | **①** | **`looks`** | `She ___ forward to the weekend.` | ❌ | ❌ |
| `I am looking forward to my birthday.` | **①** | **`am`** | `I ___ looking forward to my birthday.` | ❌ | ❌ |
| `I am looking forward to the summer.` | **①** | **`am`** | `I ___ looking forward to the summer.` | ❌ | ❌ |
| `I am looking forward to playing football.` | **①** | **`am`** | `I ___ looking forward to playing football.` | ❌ | ❌ |
| `I am looking forward to reading.` | **①** | **`am`** | `I ___ looking forward to reading.` | ❌ | ❌ |
| `He is looking forward to tomorrow.` | **①** | **`is`** | `He ___ looking forward to tomorrow.` | ❌ | ❌ |
| `I am looking forward to Monday.` | **①** | **`am`** | `I ___ looking forward to Monday.` | ❌ | ❌ |
| `What are you looking forward to?` | **①** | **`are`** | `What ___ you looking forward to?` | ❌ | ❌ |
| `I was looking forward to the trip.` | **①** | **`was`** | `I ___ looking forward to the trip.` | ❌ | ❌ |

> **根因（实读）**：`forward`（7 字母）与 `looking` 都**不在 `GRAMMAR_WORDS` 表内**——该表 144 唯一词覆盖 be 全变位／助动词／情态／高频谓语／疑问程度词，**`look`／`looks` 在表内（`:174`），但 `looking`／`looked` 不在**；`am`／`is`／`are`／`was`／`were` 全在（`:166`）。`findIndex` **取第一个命中**，故 `am`（idx1）永远赢过 `looking`（idx2）与 `forward`（idx3）。
> **量化**：ambush 侧 **16/16 ＝ 100% 落第①档**，**`forward` 成空位率 0/16 ＝ 0%**，**`looking` 成空位率 0/16 ＝ 0%**。**这就是「假友好」的精确量化：cloze 显示「有题」，但题目考的是 `am/is/are`（第 1 课就学过的内容），考点词一个都没考到。**

### 2.2 boost 侧逐句实读（**不假：`forward` 可落约 1/3**）

`grammarBoostService.ts:249-256` 的 `keywordIndexes`：**长度 ≥3 且不在 `FUNCTION_WORDS`（33 词，含 `is`/`am`/`are`）**——**没有 `GRAMMAR_WORDS` 那种「谓语优先」机制**，故 `looking`／`forward`／`weekend` 都是平权候选，`buildCloze` 用 `mulberry32(hashText('cloze:' + sourceRef))` 从中随机取一个。

**实测口径**：**252 组种子**（7 个形状合理的 lesson-id × 6 题源 `variants/sceneSwings/practice/examples/dialogue/recall` × 6 个 index）。

| 候选句 | boost 候选位（实读） | 三/四向落点分布 | **`forward` 可落** | **`looking` 可落** |
|---|---|---|---|---|
| `I am looking forward to the weekend.` | `looking`／`forward`／`weekend` | looking 36% · weekend 35% · **forward 29%** | **29.4%** | **35.7%** |
| `I am looking forward to seeing you.` | `looking`／`forward`／`seeing` | looking 36% · seeing 35% · **forward 29%** | **29.4%** | **35.7%** |
| `She is looking forward to the trip.` | `looking`／`forward`／`trip` | looking 36% · trip 35% · **forward 29%** | **29.4%** | **35.7%** |
| `We are looking forward to the party.` | `looking`／`forward`／`party` | looking 36% · party 35% · **forward 29%** | **29.4%** | **35.7%** |
| `Are you looking forward to the weekend?` | `looking`／`forward`／`weekend` | looking 36% · weekend 35% · **forward 29%** | **29.4%** | **35.7%** |
| `I am not looking forward to the test.` | `not`／`looking`／`forward`／`test` | not 28% · test 27% · looking 23% · **forward 23%** | **22.6%** | **22.6%** |
| `I look forward to the weekend.` | `look`／`forward`／`weekend` | look 36% · weekend 35% · **forward 29%** | **29.4%** | **0%（无 `looking`）** |
| `She looks forward to the weekend.` | `looks`／`forward`／`weekend` | looks 36% · weekend 35% · **forward 29%** | **29.4%** | **0%（无 `looking`）** |
| `I am looking forward to my birthday.` | `looking`／`forward`／`birthday` | looking 36% · birthday 35% · **forward 29%** | **29.4%** | **35.7%** |
| `I am looking forward to the summer.` | `looking`／`forward`／`summer` | looking 36% · summer 35% · **forward 29%** | **29.4%** | **35.7%** |
| `I am looking forward to playing football.` | `looking`／`forward`／`playing`／`football` | looking 28% · football 27% · forward 23% · playing 23% | **22.6%** | **28.2%** |
| `What are you looking forward to?` | `What`／`looking`／`forward` | What 36% · **forward 35%** · looking 29% | **34.9%** | **29.4%** |

> **实读裁定**：boost 侧 **`forward` 可成空位 22.6%–34.9%**，**`looking` 可成空位 0%（无 `-ing` 形的句子）–35.7%**。**本批的 cloze 题必须优先从 boost 档 1 出，不能指望 ambush 侧的回访问卷。**
> **`keywordIndexes` 的隐藏规则（对本批有利）**：`FUNCTION_WORDS` 含 `is`／`am`／`are`——**故 boost 侧不会抽 be 动词**；而 `be going to` 的 `going`（长度 5）会被抽。**这意味着 boost 侧抽到的必然是「`looking`／`forward`／`weekend`／`trip` 这类实词」，恰好是本批的考点词**。
> **`courseVocabulary()` 的干扰项限制（对本批不利）**：`grammarBoostService.ts:426` 明确**过滤掉 `-ing`／`-ed` 结尾且长度 >4 的词**（注释：「只收基础形式：屈折形式不作为干扰项候选」）。**故 `looking`／`going` 等不会出现在 `clozeOptions` 里**——干扰项只能来自句内词与基础形词池，**`looking` 的正误辨识必须靠 `practice.distractors` 手工覆盖**。

### 2.3 处置建议（可执行）

**结论：本批必须把考点从 cloze 挪到「改错」与「点选」通道。**

| # | 处置 | 依据（实读） | 落地动作 |
|---|---|---|---|
| **①** | **每课配 ≥2 道 `contrast` 或 `guided.spot`** | `grammarBoostService.test.ts:161-183` 已断言「改错题库：全库每课 ≥2 道可换」——**这是本批唯一能直接考 `forward` 的通道** | 每课至少写 2 条 `contrast`，`wrongMark` 指向 `forward`／`looking`／`to` |
| **②** | **`practice.distractors` 手工放 `forward` 混淆项** | `courseVocabulary():426` 过滤 `-ing` 结尾词，`looking` 进不了自动干扰项池 | 干扰项用 `for`／`front`／`before`／`forward`（注意 `grammarLessons.test.ts` 断言「干扰项不得与答案词重复」） |
| **③** | **`variants` 三态必须齐（肯定／否定／疑问）** | `grammarAmbushService.ts:244-253` 对 `variants` 做 `cloze/rebuild` 轮换、`slice(0,3)` 截到 3–5 题——**三态齐才能保证题量** | 否定版用 `am not looking forward to`；疑问版用 `Are you looking forward to` |
| **④** | **ambush 侧接受「空位＝`am/is/are`」** | 16/16 实读，无法规避（除非改 `GRAMMAR_WORDS` 表——**不建议**，会全库回归） | **主动把 `am/is/are` 当作「顺带复习」**，在 `explain` 里明确写「这个空位是 be 动词，本课的看点是后面的 `looking forward to`」 |
| **⑤** | **本批不要指望 cloze 承担考点** | ambush 0% ＋ boost 仅 22.6–34.9% | 课程设计的考点密度放在 `contrast`（每课 ≥2 条）与 `practice`（每课 4–5 题）上 |

> **可选改动（需产品拍板，数析不推荐）**：若要让 ambush 侧也友好，可给 `GRAMMAR_WORDS` 加 `looking`——**但这会影响全库 133 课的回访问卷**（`looking` 在 L27、L124–L133 均出现），**回归面远超本批收益**。**数析建议：不动词表，用通道组合解决。**

---

## 3. 语料盘点（逐短语读上下文）

### 3.1 `to + -ing` 正面教学句全量（**批十八 `be used to` 是唯一同行者**）

**口径**：严格 `\bto\s+[a-z]+ing\b`（**大小写敏感**，以排除 `to Beijing` 这类专名——用不敏感口径会误收 38 处「`to Beijing`／`to Something`」，**这是本批的第二个坑**，见 §附录 A3）。

**总量实读**：**GL 81 处／37 个不同句；HC 2 处／2 个不同句。**

| 课 | 处数 | 性质 |
|---|---|---|
| L15 | 1 | 错例（`contrast.wrong`） |
| L29 | 1 | 错例（`contrast.wrong`） |
| L44 | 1 | 错例（`contrast.wrong`） |
| L46 | 1 | 错例（`contrast.wrong`） |
| L47 | 2 | 错例（`contrast.wrong` ＋ `wrongMark`） |
| L93 | 1 | 错例（`contrast.wrong`） |
| L100 | 2 | 1 错例 ＋ 1 `guided.options` |
| L108 | 1 | `guided.options` |
| **L120** | **33** | **正面教学主场**（`targetSentence` ＋ `examples` ＋ `variants` ＋ `sceneSwings` ＋……） |
| L121 | 2 | 1 正面 `examples` ＋ 1 `contrast`（bothRight） |
| **L122** | **24** | **正面对照主场**（两张脸切开） |
| **L124** | **12** | **收口** |
| **HC #129** | 1 | 找错案（`to getting`） |
| **HC #131** | 1 | 找错案（`to walking`） |

**`-ing` 词的实际分布（GL 81 处）**：`getting` **35**·`walking` **29**·`working` **6**·`playing` **3**·`going` **2**·`helping` **2**·`watching` 1·`buying` 1·`traveling` 1·**`geting` 1（错例拼写）**。
> **关键量化**：`getting` ＋ `walking` ＝ **64/81 ＝ 79%**；**批十八的 `to + -ing` 底座里只有 2 个高频 `-ing` 词**。

**正面教学句逐条（落在正面槽位：`targetSentence`／`variants`／`examples`／`sceneSwings`／`dialogueEn`／`dialogue`／`recall`／`summary`／`oneLineRule`／`deepDive`）**：

| 课 | 行号 | 槽位 | 句子（实读） |
|---|---|---|---|
| **L120** | `:22438` | `dialogueEn` | `I am used to getting up early.` |
| **L120** | `:22441` | **`targetSentence`** | `I am used to getting up early.` |
| **L120** | `:22446` | `oneLineRule` | 「习惯了「做某事」：后面那件事要换名字版（穿 -ing）——I am used to getting up early。同一个 to，前面有 be 站着，它认名字版。」 |
| **L120** | `:22448` | `examples` | `I am used to getting up early.` |
| **L120** | `:22449` | `examples` | `She is used to walking to school.` |
| **L120** | `:22456` | `dialogue`（me） | `I am used to getting up early.` |
| **L120** | `:22500` | `variants` 肯定 | `I am used to getting up early.` |
| **L120** | `:22501` | `variants` 否定 | `I am not used to getting up early.` |
| **L120** | `:22502` | `variants` 疑问 | `Are you used to getting up early?` |
| **L120** | `:22505` | `sceneSwings` | `She is used to walking to school.` |
| **L120** | `:22506` | `sceneSwings` | `I am not used to getting up early.` |
| **L120** | `:22507` | `sceneSwings` | `Are you used to getting up early?` |
| **L120** | `:22512` | `deepDive` | 「第 119 课说「习惯了 + 东西」：I am used to the cold。今天说「习惯了 + 做某事」：I am used to getting up early——早起是个动作，动作要换上名字版才能跟在 to 后面。」 |
| **L120** | `:22519` | `summary.rule` | 「习惯了「做某事」：后面那件事穿名字版——有 be 站着的 to，认名字版。」 |
| **L120** | `:22521` | `summary.points` | `I am used to getting up early.` |
| **L120** | `:22618` | `recall.answer` | `I am used to getting up early.` |
| **L121** | `:22645` | `examples` | `She is used to walking to school.`（第 120 课回流） |
| **L122** | `:22834` | `oneLineRule` | 「I used to walk to school.／I am used to walking to school.——后面的走法也换了。」 |
| **L122** | `:22837` | `examples` | `I am used to walking to school.` |
| **L122** | `:22839` | `examples` | `I am used to getting up early.`（第 120 课） |
| **L122** | `:22894` | `sceneSwings` | `I am used to walking to school.` |
| **L122** | `:22900` | `deepDive` | 「前面站 am／is／are／get（习惯记号）→ 后面穿名字版（I am used to walking）。一个 to，两张脸。」 |
| **L122** | `:22903` | `deepDive` | 「I am used to walking to school. 是「现在走路走惯了」……一个穿原样，一个穿名字版。」 |
| **L122** | `:22910` | `summary.points` | `I am used to walking to school.` —— 现在走惯了（有 be，穿名字版） |
| **L124** | `:23226` | `examples` | `I am used to getting up early.`（第 120 课） |
| **L124** | `:23297` | `summary.points` | `I am used to getting up early.（习惯做某事）／I am getting used to it.（慢慢习惯）` |

> **正面句共 26 条**（去重后 12 个不同句），**分布：L120 16 条·L122 7 条·L121 1 条·L124 2 条**。

**判断「同族第二站」的接口真伪 —— 结论：是「批十八独木」，不是可复现接口。**

| 判据 | 实读 | 结论 |
|---|---|---|
| 句法形状是否同构 | `be used to + -ing` 与 `look forward to + -ing` **形状完全同构**（`to` 后跟名字版） | ✅ **形式层可迁移** |
| 语义是否可迁移 | `be used to` ＝「习惯了」（状态）；`look forward to` ＝「盼着」（情绪／朝向） | ❌ **语义层不可迁移** |
| `to` 前面的成分是否同类 | `be used to` 前面是 `be`／`get`；`look forward to` 前面是 `look` 的变位 | ❌ 不同 |
| `-ing` 词能否复用 | 底座 79% 是 `getting`／`walking` 两个词 | ❌ **拿不到新词** |
| 出现课距 | 全部集中在 **L120–L124**，与 L134 相距 **10–14 课** | ⚠️ 距离尚可（不算太远） |

> **实读裁定：「批十八独木」**。这 26 句**只能作为「`to` 后面跟名字版」这一条手感的复现**（形式层接口有效），**不能作为「`look forward to` 语义的复现接口」**。**批二十一的教学增量因此不是「复用」，而是「给同一个形状挂第三张脸」**——`look forward to` 的 `to` 前面站的是 `look`（不是 `be`／`get`），这是继「`used to`（原形）vs `be used to`（名字版）」之后的**第三张 to 的脸**。
> **对本批的排课建议（推断）**：若要 `look forward to` 与批十八做形式对照，**L134–L138 里必须有一课显式回指 L120 的 `I am used to getting up early.`**（复用批二十收官课「认读升级」的同款话术：「第 120 课你见过 `to` 后面穿名字版——今天同一个位置换一张脸」）。

### 3.2 `to + -ing` 的错卡（反面例子）——**库里确实有一批，共 17 处 `wrong:` ＋ 1 处 `❌`**

| # | 课 | 行号 | 字段 | 错句（实读） | 错型 |
|---|---|---|---|---|---|
| 1 | L15 | `:2728` | `contrast.wrong` | `I want to going home.` | `want to` 后错跟名字版 |
| 2 | L29 | `:5293` | `contrast.wrong` | `I am going to watching.` | `be going to` 后错跟名字版 |
| 3 | L44 | `:8062` | `contrast.wrong` | `I go to the shop to buying milk.` | 目的 `to` 后错跟名字版 |
| 4 | L46 | `:8440` | `contrast.wrong` | `I want to traveling.` | `want to` 后错跟名字版 |
| 5 | L47 | `:8627` | `contrast.wrong` | `I should to helping her.` | `should` 后错加 `to` |
| 6 | L47 | `:8628` | `contrast.wrongMark` | `` `to helping` `` | （同上，标注） |
| 7 | L93 | `:17314` | `contrast.wrong` | `I used to playing here.` | `used to` 后错跟名字版 |
| 8 | L100 | `:18641` | `contrast.wrong` | `I used to playing here every day.` | 同上（复现） |
| 9 | L100 | `:18708` | `guided.options` | `used to playing` | 干扰项 |
| 10 | L108 | `:20255` | `guided.options` | `I get him to going with me.` | `get sb to do` 后错跟名字版 |
| 11 | **L120** | `:22466` | `contrast.wrong` | `I am used to geting up early.` | 名字版拼写错（少 t） |
| 12 | **L120** | `:22478` | `contrast.wrong`（bothRight） | `She is used to walking to school.` | **双正解条**（非错例） |
| 13 | **L122** | `:22848` | `contrast.wrong` | `She used to working late.` | **两头都占**：没 be ＋ 名字版 |
| 14 | **L122** | `:22860` | `contrast.wrong` | `I used to walking to school.` | 同上 |
| 15 | **L122** | `:22866` | `contrast.wrong`（bothRight） | `I am used to walking to school.` | **双正解条**（非错例） |
| 16 | **L122** | `:22880` | `contrast.wrong`（bothRight） | `I am used to getting up early.` | **双正解条**（非错例） |
| 17 | **L124** | `:23349` | `guided.options` | `I don't used to walking to school.` | 否定版错型（应为 `am not`） |
| ★ | **L122** | `:22911` | `summary.points` | `She used to working late ❌ —— 两头都占：既没 be，又穿了名字版` | **唯一的 `❌` 标记** |

> **实读裁定**：**反面例子确实有一批（17 处 `wrong:` 字段 ＋ 1 处 `❌`）**，但**错型分布是「`to` 后面该跟什么」的两类混淆**：
> - **一类（1/3/4/5/7/8/10）**：`to` 后面**不该**跟名字版的地方跟了名字版（`want to going`／`going to watching`／`used to playing`）
> - **二类（13/14/17）**：`to` 前面该有 `be` 而没 `be`，后面却跟了名字版（**「两头都占」**）
>
> **对本批的直接价值**：`look forward to` 的错型「**`to` 后面错跟原形**」（`I am looking forward to see you.`）**在库里恰好没有反例**——库里全是「错跟名字版」。这是**本批可以新造的错型**，且**`verb_form` 罪名（125/83，全库最厚）正好承载**。**建议：`look forward to` 的错卡写「`to` 后面跟原形」这条反向错型，与批十八的「`to` 后面跟名字版」形成完整对照。**

### 3.3 `look` 家族现状（批十九＋批二十后）

**总量（GL／HC 双文件，词边界口径）**：

| 形态 | GL 处 | GL 串 | HC 处 | HC 串 | 判定 |
|---|---|---|---|---|---|
| **`look`**（含大写 `Look`） | **174** | 164 | **24** | 22 | 小写 144 ＋ 大写 `Look` 30 ＝ 174（**校核通过**） |
| **`looks`** | **183** | 176 | **16** | 15 | 在库最厚形态 |
| **`looking`** | **17** | 16 | **0** | 0 | ⚠️ **其中 10 处是 L27 的 `looking for`「正在找」** |
| `looked` | **1** | 1 | **0** | 0 | 仅 L76 一处 |
| `Look at`（短语） | **22** | 22 | 0 | 0 | L127 占 14 |
| `looks like` | **5** | 5 | 0 | 0 | L127 占 4（`It looks like rain.`） |
| `look like`（无 s） | **0** | 0 | **0** | 0 | 零 |

**逐课分布（GL）**：

| 形态 | 逐课分布 |
|---|---|
| `look` | L19:1 · L27:2 · L52:1 · L58:2 · L60:2 · L65:1 · L83:1 · L86:1 · L87:1 · L88:1 · L89:1 · L92:1 · L96:1 · L112:1 · L121:1 · L123:1 · **L125:32 · L126:61 · L127:58** · L128:3 · L133:1 |
| `looks` | L13:1 · L48:1 · L49:1 · L51:1 · L66:1 · L71:1 · L72:1 · L79:1 · L115:1 · L124:1 · **L125:56 · L126:37 · L127:42** · L128:9 · L130:2 · L131:1 · L132:1 · **L133:25** |
| `looking` | L13:1 · **L27:10** · L37:1 · L73:2 · L126:1 · **L133:2** |
| `looked` | L76:1 |

**批十九／批二十的占用强度（实读汇总）**：

| 批次 | 课号 | `look` 家族合计 |
|---|---|---|
| **批十九** | L125–L127 | **287 处** |
| **批二十** | L128–L133 | **42 处** |
| 前 21 课（L1–L24 不含 L19） | — | 合计 **19 处**（`look` 家族几乎全在 L125 之后爆发） |

> **实读裁定（本批的双刃）**：
> 1. **`look` 本身零造词成本**（174 ＋ 183 处，底座极厚）——这是本批最大的成本优势。
> 2. **但 `look` 已被感官章连占 9 课**（L125–L133），`looks` 在 L125–L133 内出现 **171 处**。**`look forward to` 里的 `look` 是第三个意思**（不是「看起来」，也不是「看」），**同形干扰是本批的头号教学风险**。
> 3. **`looking` 的现成底座是 L27 的 `looking for`**（10/17 处）——`What are you looking for?` 是 L27 的 `targetSentence:4898`，`I am looking for my key.` 是 L27 `:4914` 的对话句。**`look forward to` 的 `looking` 与它同形不同义**，**批二十一等于要教 `look` 的第三张脸**（批十九教了「看起来」vs「看」，批二十一要加「盼」）。
> 4. **形态红线**：`look` 家族已在 L125–L133 连续 9 课出现，**若 L134–L138 再连占 5 课，`look` 将连续 14 课在场**——**建议批二十一的 5 课里，`look forward to` 只在 1–2 课做「主词立岗」，其余课用 `forward to` 或整块短语做复现**（推断，非实读结论）。

### 3.4 `object to` 族现状（**路线图判 C 档，不上前 3 课**）

| 形态 | GL 处 | HC 处 | 判定 |
|---|---|---|---|
| `object` | **0** | **0** | 🔴 零 |
| `objects` | **0** | **0** | 🔴 零 |
| `objected` | **0** | **0** | 🔴 零 |
| `object to` | **0** | **0** | 🔴 零 |
| `objection` | **0** | **0** | 🔴 零 |
| `objecting` | **0** | **0** | 🔴 零 |

> **实读裁定**：`object to` **全族双文件全零**（6 个形态 × 2 文件 ＝ 12 个格子全 0）。**数析同意路线图的 C 档判定**，三条独立理由：
> 1. **零底座**：连 1 处认读种子都没有（**比 `forward` 更空**——`forward` 至少被 L133 埋了 1 句）。
> 2. **无情感抓手**：「反对」是抽象态度，而「小美的一天」是**日常连续剧**（`scene` 字段用的都是 `sparkle`／`mansion`／`classroom` 这类具体场景）——`I object to the rule.` 没有可演的画面。
> 3. **缺配套名词**：`object to` 的宾语需要 `decision`／`rule`／`price`／`idea` 这类抽象名词；批二十审计已实读 **`decision` 0／0、`rule` 0／0、`price` 0／0**（`idea` GL 7／HC 0、`plan` GL 1／HC 2），**成本远高于 `look forward to`**。
>
> **建议：批二十一 5 课全部给 `look forward to`，`object to` 单独立项或撤出**（与批二十建议一致）。

### 3.5 小结（语料侧可生产性）

| 项 | 状态 | 说明 |
|---|---|---|
| 核心词 `forward` | 🟡 **1 句认读已在库** | L133 `examples:24969` ＋ `contrast:25009`；正式立岗零成本可引用 |
| 名词侧配套 | ✅ **完全不缺** | `weekend`（含 `the weekend` 搭配）·`birthday`·`party`·`summer`·`photo`·`letter`·`September` 七件全在库；仅缺 `trip`／`holiday` |
| `-ing` 侧配套 | ✅ **完全不缺** | `reading`·`drawing`·`swimming`·`playing`·`cooking`·`waiting` 六件在库；仅缺 `seeing`／`meeting`／`visiting` |
| 时间词配套 | ✅ **不缺** | `tomorrow`·`this weekend`·`tonight` 在库；`soon`／`next week` 零 |
| 形式接口 | ⚠️ **批十八独木** | 26 条 `to + -ing` 正面句句法同构、语义不同族；可做形式复现，不能做语义复现 |
| 错卡底座 | ✅ **有货（17 处 `wrong:`）** | 但全是「错跟名字版」方向；**「错跟原形」方向空着，正是本批要新造的** |
| 反面风险 | 🔴 **`look` 同形三义** | `look`（看）·`look`（看起来）·`look`（盼着）——**第三张脸是本批教学核心，也是最大混淆源** |

---

## 4. 罪名承载预判

**罪名枚举权威来源（实读）**：`huntService.ts:331-342` 的 `GRAMMAR_ERROR_TAGS` **10 项**：`tense`／`sv_agreement`／`missing_be`／`article`／`plural`／`preposition`／`fragment`／`run_on`／`word_order`／`verb_form`。（`types.ts:419-430` 另含第 11 项 `comparison`，但 **`GRAMMAR_ERROR_TAGS` 不含它**，且 HC 侧 `comparison` 承载 **0/0**——`storage.ts:685-695` 的归一化白名单含 `comparison`，`grammarBoostService.ts:608` 的 `TAG_KEYWORDS` 也含它。**本报告以 `GRAMMAR_ERROR_TAGS` 10 项为「找错案可植」口径。**）

**`look forward to` 能植的错型（10 枚举内）**：

| # | 罪名 | 库内总计（错点/承载案） | 可植错型（示例） | 判定 |
|---|---|---|---|---|
| 1 | **`verb_form`** | **125 / 83**（最厚） | `I am looking forward to see you.`（`to` 后跟原形）／`I am looking forward to seeing you.` 的 `seeing` 拼写 | ✅ **本结构主罪名** |
| 2 | **`preposition`** | **60 / 55** | `I am looking forward the weekend.`（漏 `to`）／`I look forward to seeing you.` 的 `forward to` 顺序 | ✅ **结构级必带**（`to` 丢不掉，与 HC #129/#131 的 `to getting`／`to walking` 同型） |
| 3 | **`sv_agreement`** | **85 / 64** | `She look forward to the weekend.`（三单漏 -s） | ✅ 极自然（L25 起的「老规矩」，批二十也在用） |
| 4 | **`missing_be`** | **24 / 20**（薄档） | `She looking forward to the weekend.`（漏 `is`） | ✅ **能带上薄档** |
| 5 | **`tense`** | **47 / 39** | `I am looked forward to the weekend.`／`I was looking forward to` 与 `I am` 混用 | ✅ 可行 |
| 6 | **`article`** | **28 / 22**（薄档） | `I am looking forward to weekend.`（漏 `the`） | ✅ **能带上薄档**（L133 已有 `the weekend` 搭配，可对照） |
| 7 | **`word_order`** | **47 / 35** | `I am looking to forward the weekend.`（`to`／`forward` 颠倒） | ✅ 可行（与批二十 L142 案 `well. → good.` 的 `word_order` 同型） |
| 8 | `plural` | **98 / 92** | — | ⚠️ **本结构无自然名数位**（宾语是不可数或单数事件）；**勉强可为 `the weekend` → `the weekends`，但语义变了**，不建议 |
| 9 | `fragment` | **14 / 13**（薄档） | — | ❌ **不建议硬塞**：本结构是短句，写残句（如 `Looking forward to the weekend.` 作独立句）**其实是口语合法用法**，判为 `fragment` 会教错 |
| 10 | `run_on` | **14 / 12**（薄档） | — | ❌ **不建议**：需要两句粘连，与本结构的单句形态不匹配 |

> **实读裁定**：
> - **可在 6 类罪名内自由植错**（`verb_form`／`preposition`／`sv_agreement`／`missing_be`／`tense`／`article`／`word_order` 共 **7 类**可植，`plural` 勉强）。
> - **能带上 3 个薄档罪名的 2 个**：`missing_be`（24/20）、`article`（28/22）。**`fragment`（14/13）与 `run_on`（14/12）建议不硬塞。**
> - **每个新案 4 处错**（全库主流：119/142 案是 4 处）的推荐配比：**`verb_form` 1 处（`to see`→`to seeing`，本课新错）＋ `preposition` 1 处（漏 `to`）＋ `sv_agreement` 1 处（三单）＋ `missing_be` 或 `article` 1 处（薄档补血）**——这个配比**与批二十 L142 案（`hunt-five-senses`：verb_form＋sv_agreement×2＋word_order）同构**，是**全回流＋1–2 处新错**的成熟配方。
>
> **（推断）难点预警**：本结构「错跟原形」（`to see`）与批十八的「错跟名字版」（`to going`）**方向相反**。同一个 `to` 在库里既有「必须跟名字版」（`be used to`）又有「必须跟原形」（`used to`）的先例——**本批再教「必须跟名字版」（`look forward to`），学习者的混淆面会进一步扩大**。**建议**：新案里的 `verb_form` 错只放一处，且在 `explanation` 里显式对照批十八（「第 120 课那个 `to` 后面穿名字版，今天这个 `to` 也一样」）。

---

## 5. 基建护栏

### 5.1 `grammarSeasons.ts` 末项（**须续 season-21**）

**实读**：`grammarSeasons.ts:58` 末项 ＝
```ts
{ id: "season-20", label: "第二十季 · 五种感官", hint: "听起来不错、闻着好、尝着好、摸着凉——同一个架子，换四双耳朵", min: 128, max: 133 }
```
- **总季数 20**（season-1 `{1,12}` 起，逐季连续无重叠）。
- **批二十一须追加**：`season-21`，`min: 134, max: 138`（若 5 课）。
- **守门测试（实读 `grammarSeasons.test.ts`，4 项）**：
  - `:12` 「每课号都落在某个季区间内」——**忘加 season-21 立刻红**（失败信息：「会被路径页静默过滤；请追加 season-N 分组」）
  - `:22` 「季区间互不重叠且 min ≤ max」
  - `:36` 「分组头显示用字段齐全（label/hint 非空）」
  - `:43` 「最高季区间的 max 覆盖全部课程（新批课不被尾部截断）」

### 5.2 `GrammarPathPage.tsx` 里程碑（**m22 已在位，须续 m23**）

**实读**：`GrammarPathPage.tsx:268-274` 末项 ＝
```ts
{
  id: "can-do-m22",
  afterLesson: 133,
  title: "我能说出听到、闻到、尝到、摸到的是什么样",
  zh: "看（looks）+ 听（sounds）+ 闻（smells）+ 尝（tastes）+ 摸（feels）——五张脸一个架子，后面直接跟那个「怎么样」的词。",
  samples: ["It sounds great.", "It smells good.", "The water feels cold."]
}
```
- **总里程碑 22**（`can-do-m1`–`can-do-m22`，`afterLesson` 逐级递增：…124／127／**133**）。
- **批二十一须追加**：`can-do-m23`，`afterLesson: 138`。
- **无守门**：`grep -rn "can-do-m" src --include=*.ts --include=*.tsx | grep -v GrammarPathPage.tsx` **无输出**（全仓测试引用数 ＝ 0）——**纯纪律项**。

### 5.3 episode 下一个（「一百三十四」）

**实读**：`grammarLessons.ts` 的 `episode` 字段末 8 项：

| 行号 | episode |
|---|---|
| `:23594` | 小美的一天 一百二十六 |
| `:23788` | 小美的一天 一百二十七 |
| `:23982` | 小美的一天 一百二十八 |
| `:24176` | 小美的一天 一百二十九 |
| `:24370` | 小美的一天 一百三十 |
| `:24564` | 小美的一天 一百三十一 |
| `:24758` | 小美的一天 一百三十二 |
| `:24952` | **小美的一天 一百三十三**（末项） |

> **下一个写「小美的一天 一百三十四」**（中文数字，与既有格式一致）。

### 5.4 案号与配比（**下一个可用 #143**）

| 项 | 实读 |
|---|---|
| 最大案号 | **#142**（`hunt-five-senses`，@`:7919`） |
| 连续性 | 1–142 **连续无跳号无重号**（跳号/重号检测输出 `[]`） |
| `reviewed` 覆盖率 | **142/142 ＝ 100%**（未标记数 0） |
| 错点总数 | **542** |
| 每案错点数分布 | **4 处：119 案**（主流）／**2 处：10 案**（#2,3,5,7,8,9,10,11,12,37）／**3 处：10 案**（#6,13,14,15,16,18,19,20,35,36）／**5 处：2 案**（#42,#43）／**6 处：1 案**（#34） |
| 案号 1–20 特征 | 前 20 案全部是 2–4 处的**轻量番外**（与「第一季基础课不配案」的设计一致） |
| 番外案（未被任何课引用） | **#16 `hunt-white-cat`／#17 `hunt-sports-day`／#18 `hunt-pen-pal-letter`／#19 `hunt-fridge-note`／#20 `hunt-term-review` 共 5 案** |
| 空 `huntCaseIds` 的课 | **L2/3/5/6/8 共 5 课** |
| 被多课共用的案 | **`hunt-my-sister`（L14 ＋ L25）**——**唯一一个** |
| 引用完整性 | 引用总数 **138**；分配 = **1 案 119 课 ＋ 2 案 8 课（L10/12/13/14/15/20/24/25）＋ 3 案 1 课（L11）＋ 0 案 5 课（L2/3/5/6/8）**，校核 119＋16＋3＝138 ✅；**「引用但案池里没有的 id」＝ 0**（0 处悬挂引用） |

> **实读裁定**：案号侧**完全健康**，下号 **#143**；批二十一若做 5 课，需 **5 个新案（#143–#147）**。**每案 4 处错**是主流配比（119/142 ＝ 83.8%）。

### 5.5 课号连续性

**实读**：GL anchors **133 个**（首个 `1@139`，末个 `133@24949`），**跳号/重号检测输出 `[]`**——**1–133 连续无跳号无重号**。下号 **L134**。

---

## 6. 封面池专章

### 6.1 逐张统计（**117 张用 133 次**）

| 项 | 实读 |
|---|---|
| 总张数（用过的 cover 编号） | **117 张**（cover1–cover117，编号连续无跳号） |
| 使用次数总计 | **133 次**（＝ 133 课，每课都有 cover） |
| **单次张** | **101 张**（cover17–cover117） |
| **二用张** | **16 张**（**cover1–cover16**） |
| 三用及以上 | **0 张** |

**二用张的 16 组对应（实读）**：

| cover | 课号 | cover | 课号 |
|---|---|---|---|
| cover1 | L1, **L118** | cover9 | L9, **L126** |
| cover2 | L2, **L119** | cover10 | L10, **L127** |
| cover3 | L3, **L120** | cover11 | L11, **L128** |
| cover4 | L4, **L121** | cover12 | L12, **L129** |
| cover5 | L5, **L122** | cover13 | L13, **L130** |
| cover6 | L6, **L123** | cover14 | L14, **L131** |
| cover7 | L7, **L124** | cover15 | L15, **L132** |
| cover8 | L8, **L125** | cover16 | L16, **L133** |

> **实读裁定（本批最需要注意的池子变化）**：**批十九报告说「二用池 10 张（cover1–cover10）」；批二十交付后已扩到 16 张（cover1–cover16）**——即 **L118–L133 这 16 课，一课一张地把 cover1–cover16 各用了第二遍**。**`cover11`–`cover16` 正是「批二十用了 cover11–cover16」的结果**（用户来函所述正确）。
> **可用池边界（实读）**：**cover17–cover99 共 83 张**（在 L134–L138 五位都 ≥35 线）；**`cover100` 在 L134 的 gap ＝ 34，出局**。

### 6.2 L134 起可用张清单

**可用池（83 张，在 L134–L138 五位都 ≥35）：`cover17`–`cover99`**（连续编号，共 83 张）。

逐张 gap（对 L134）实读值：

| cover 段 | 对 L134 的 gap | 判定 |
|---|---|---|
| cover17 | **117** | ✅ 最大 |
| cover18–cover21 | 116–113 | ✅ |
| cover22–cover35 | 112–99 | ✅ |
| cover36–cover50 | 98–84 | ✅ |
| cover51–cover65 | 83–69 | ✅ |
| cover66–cover80 | 68–54 | ✅ |
| cover81–cover93 | 53–41 | ✅ |
| **cover94–cover99** | **40–35** | ✅ 压线过（35 为线） |
| **cover100** | **34** | ❌ **出局**（低于 35 线） |

### 6.3 最优指派建议（**沿用「二分最大最小间距」**）

**目标**：5 张互不相同、且每张与历史使用点的最小距离（min-gap）的最大值最大化。

**计算过程**（二分答案 ＋ 瓶颈指派回溯 ＋ 全枚举验证）：

| 步骤 | 结果 |
|---|---|
| 二分搜索最大可行 W | **W ＝ 117** |
| W ＝ 117 下的可用池 | **5 张**：`cover17, cover18, cover19, cover20, cover21` |
| **最优解** | **`L134←cover17`／`L135←cover18`／`L136←cover19`／`L137←cover20`／`L138←cover21`** |
| 五张的 min-gap | **全部 ＝ 117** |
| **同 min-gap 解数** | **1（唯一）** |
| 若只做 3 课（L134–L136） | 最大 min-gap 同为 **117**，解 `cover17/18/19` |

> **最优指派建议（实读结论）**：
> ```
> L134 ← cover17   (gap 117，L17 用过)
> L135 ← cover18   (gap 117，L18 用过)
> L136 ← cover19   (gap 117，L19 用过)
> L137 ← cover20   (gap 117，L20 用过)
> L138 ← cover21   (gap 117，L21 用过)
> ```
> **min-gap ＝ 117，可行解唯一**。**这是批二十「L128←cover11…L133←cover16」序列的自然延续**——每批都用「最早可用的那 5–6 张」，把二用池往后推。**若批二十一只做 5 课，二用池将从 16 张扩到 21 张（cover1–cover21），单次张从 101 降到 96。**
> **风险提示**：按此节奏，**二用池每批扩 5–6 张，到 2030 年前后会耗尽 117 张池**（推断）。**建议主理人评估「三用」策略或新增封面**（这是产品决策，非数据结论）。

---

## 7. G-boost 复核

**执行**：`npx vitest run src/services/grammarBoostService.test.ts`

**结果**：**50 项全绿**（`Test Files 1 passed (1)` / `Tests 50 passed (50)`，Duration 4.77s）。

**三条护栏现状（逐条实读断言）**：

| # | 护栏 | 断言位置 | 现状 | 说明 |
|---|---|---|---|---|
| 1 | **改错题库：全库每课 ≥2 道可换** | `grammarBoostService.test.ts:161-183` | ✅ **通过**，thin（＜2 道）＝ **0 课** | 断言 `expect(thin, ...).toEqual([])`；这是**本批 cloze 假友好的唯一救命通道**（§2.3 处置①） |
| 2 | **`guided.spot` 的 `wrongToken` 必能定位** | `:185-197` | ✅ **通过**，违规 ＝ **0** | 断言 `wrongToken` 与 `tokens` 元素**逐字相等**（不带尾标点）；回归背景是 L96/L102 曾静默失效 |
| 3 | **`contrast` 的 `wrongMark` 不得是纯标点** | `:199-209` | ✅ **通过**，违规 ＝ **0** | 回归背景是 L89 的 `"?"` 无法定位 |

**其它相关断言（实读，对本批有直接影响）**：

| 断言 | 位置 | 对本批的意义 |
|---|---|---|
| 「全库每课档 1 都出得来 4 种不同题型（素材齐备）」 | `:263-271` | 🔴 **新批课必须素材齐备**：`variants`／`sceneSwings`／`practice`／`examples`／`dialogue`／`recall` 缺一即红 |
| 「全库可出题性：每课档 1 至少 3 题且题面非空（含 5 节无案件课）」 | `:290-301` | 🔴 同上 |
| 「全库可出题性：每课档 2 至少 4 题」 | `:459-467` | 🔴 同上 |
| 「全库可出题性：每课档 3 至少 2 题」 | `:516-524` | 🔴 同上 |
| 「未知课程不写入完成态」 | `:83-87` | 新增 lesson-id 需与 `grammarLessons` 同步 |
| 「多词标注（语序类）改错题：点中任一组成词都算对」 | `:235-262` | 若本批用 `word_order` 且 `wrongMark` 含多词，此断言会校验 |

> **实读裁定**：**G-boost 三护栏全守**（与批二十一致）；**新增 5 课必须满足档 1／档 2／档 3 的素材齐备断言**——这是批二十一最容易踩的**测试门禁**。

---

## 8. 可生产性评估

| 维度 | 评估 | 依据 |
|---|---|---|
| **数据规模** | ✅ **健康**：133 课／142 案／542 错点；两条连续性完好 | §指标概览 |
| **造词成本** | 🟡 **低–中**：**必造 1（`forward`）＋ 推荐 1（`seeing`）＝ 总计 2 个词**；L133 已埋 1 句认读种子 | §1.5 |
| **配套语料** | ✅ **充足**：名词侧 7 件、`-ing` 侧 6 件、时间词 3 件在库 | §1.2–1.4 |
| **形式接口** | ⚠️ **批十八独木**：26 条 `to + -ing` 句法同构但语义不同族 | §3.1 |
| **错卡底座** | ✅ **17 处 `wrong:` ＋ 1 处 `❌`**，但方向单一（全是「错跟名字版」）；**「错跟原形」方向空着** | §3.2 |
| **cloze（核心风险）** | 🔴 **假友好确凿**：ambush **0%** 考点词可落；boost **22.6–34.9%**。**必须靠 `contrast`／`guided.spot` 承载考点** | §2 |
| **罪名承载** | ✅ **7 类可植**，能带上 2 个薄档罪名（`missing_be`／`article`） | §4 |
| **封面池** | ⚠️ **可用 83 张**（cover17–cover99），最优解唯一（cover17–21）。**二用池已扩到 16 张，长期会耗尽** | §6 |
| **测试基线** | ✅ **61 文件 / 798 项全绿；`tsc --noEmit` 0 错**（exit 0） | §7 ＋ §附录 A6 |
| **基建门禁** | ✅ 须续 3 项（season-21／m23／episode「一百三十四」）；**奇：can-do 无守门，season 有 4 项守门** | §5 |
| **形态红线** | 🔴 **`look` 已连占 9 课（L125–L133）**，若本批再连占 5 课将连续 14 课在场 | §3.3 |

> **数析总评（可生产性：高，但有三处必须前置处理）**：
> 1. **cloze 处置**（§2.3 的 5 条）——**这是本批的头号工程项**，不处理则「考点在评测里 100% 逃逸」。
> 2. **`look` 形态红线**（§3.3）——**建议 5 课里只在 1–2 课做「主词立岗」**，其余课用 `forward to` 整块或 `looking forward to` 整块复现，压缩 `look` 的连续在场。
> 3. **批十八接口的诚实标注**（§3.1）——**文案必须写「第 120 课你见过 `to` 后面穿名字版」**（形式层复用），**不能写「这个结构你学过」**（语义层未学过）。

---

## 附录：核查留痕

### A1 实读源文件清单 ＋ md5（冻结态）

| 文件 | 行数 | 字节 | md5 |
|---|---|---|---|
| `src/data/grammarLessons.ts` | **25,139** | 1,189,812 | **`92af8abf9f0f981dc4a75acf965093df`** |
| `src/data/huntCases.ts` | **7,961** | 203,921 | **`cdf2a735f8600a18dbc466488a370895`** |
| `src/data/grammarSeasons.ts` | 63 | — | `66a841f33784baca42e2e6d0f95a2b19` |
| `src/data/grammarZeroTerms.ts` | 31 | — | `e767bfea6f2e0c7b4ad83ec530eccbab` |
| `src/services/grammarBoostService.ts` | — | — | `d9387d72011582a5da974e2a5a1cd526` |
| `src/services/grammarAmbushService.ts` | — | — | `84b306b40e881c4f9b8c8d000851686c` |
| `src/pages/GrammarPathPage.tsx` | — | — | `552ba548e99fc43945d9238f0326eedf` |
| `src/types.ts` | 663 | — | （实读） |
| `src/services/huntService.ts` | — | — | （实读） |
| `src/data/grammarLessons.test.ts` | 232 | — | （实读） |
| `src/data/grammarSeasons.test.ts` | 48 | — | （实读） |
| `src/services/grammarBoostService.test.ts` | — | — | （实读） |

### A2 提取统计（实读）

| 文件 | 行数（提取器） | 串数 | 英文口径串数 | 未闭合告警 |
|---|---|---|---|---|
| `grammarLessons.ts` | 25,140 | **24,072** | **14,964** | **0** |
| `huntCases.ts` | 7,962 | **5,796** | **4,594** | **0** |

**锚点**：GL 133 个（`1@139` … `133@24949`）；HC 142 个（`1@32` … `142@7920`）。

### A3 假阳性与口径核查（**本批最容易踩的三个坑**）

| # | 坑 | 现象 | 核查方法与结果 |
|---|---|---|---|
| **1** | **id 串假阳性** | `hunt-trip-time`／`hunt-weekend-plan`／`hunt-photo-album`／`hunt-birthday-cake` 这类 id 让词「假在库」 | 逐条核（`isIdLike` 判定）：`trip` GL 总 1 **全是 id 串** → **真词 0**；`weekend` GL 总 12 **3 处是 id 串** → **真词 9**；`photo` GL 总 7 **4 处 id 串** → **真词 3**；`birthday` GL 总 155 **3 处 id 串** → **真词 152** |
| **2** | **大小写不敏感误收专名** | `to + -ing` 用 `i` 标志会误收 `to Beijing`／`to Something` **等 38 处** | 双口径对跑：不敏感口径 **119 处**（含 `to Beijing` 系列）vs **严格敏感口径 81 处** → **本报告一律用严格口径 81** |
| **3** | **`forward` 的批内变化** | 审计期内 `grammarLessons.ts` 被并行改动（L133 新增认读种子） | 冻结态 md5 `92af8abf…`；变化详情见 §U1 |

### A4 案号／引用完整性逐项核

| 检查 | 结果 |
|---|---|
| 案号 1–142 连续性 | ✅ 跳号/重号 ＝ `[]` |
| 唯一案号数 | 142 |
| `reviewed` 数 | 142／142 ＝ 100% |
| `huntCaseIds` 引用总数 | **138** |
| 唯一被引用 id 数 | **137** |
| 无引用（番外）案 | **5 案**：#16／#17／#18／#19／#20 |
| 引用但案池不存在（悬挂） | **0** |
| 被多课共用的案 | **1 个**：`hunt-my-sister`（L14＋L25） |
| 空 `huntCaseIds` 的课 | **5 课**：L2／L3／L5／L6／L8 |

### A5 「认读升级」成例逐条（**本批可复用的先例**）

| 先例 | 原始认读位 | 升级课 | 升级话术（实读行号） |
|---|---|---|---|
| L14 → L59 | L14 认读 | L59 `well/fast` | `:10949` `// R8 跨课复现：第 14 课（认读种子转正——逐字拼一次）` |
| L78 → L92 | L78 `When it is sunny, I run in the park` 认读 | L92 `when 从句转正` | `:17175` 「第 78 课你见过 When it is sunny…（当时只是认读）——今天它转正了」 |
| L68 → L84 | L68 感叹句认读 | L84 失物招领收口 | `:16019`／`:16038` 「第 68 课的感叹句（多好的包啊）今天只认读」 |
| **L133 → 批二十一** | **L133 `I am looking forward to the weekend.`（`:24969` examples ＋ `:25009` contrast）** | **L134+** | **本批须写同款「认读升级」话术** |

### A6 测试与类型基线

| 命令 | 结果 |
|---|---|
| `npx vitest run` | **61 文件 / 798 项全绿** |
| `npx tsc --noEmit` | **0 错（exit 0）** |
| `npx vitest run src/services/grammarBoostService.test.ts` | **50 项全绿**（Duration 4.77s） |

### A7 复刻可信度留痕

| 验证 | 真服务值 | 复刻值 | 一致 |
|---|---|---|---|
| `buildBoostItems("lesson-120-used-to-doing", 1)` variants[1] | `I am not used to ___ up early.` / `getting` | 同 | ✅ |
| `buildBoostItems("lesson-128-it-sounds-great", 1)` variants[1] | `It does not ___ great.` / `sound` | 同 | ✅ |
| 临时探针文件 | `src/services/__probe_b21.test.ts`（**跑完已删**） | — | — |

### A8 抽词器参数实读（供复现）

| 参数 | 值 | 行号 |
|---|---|---|
| ambush `GRAMMAR_WORDS` | **145 词条目／144 唯一词**（`would` 重复 1 次；不含 `forward`／`looking`／`forwards`） | `grammarAmbushService.ts:161-186` |
| ambush `CLOZE_STOP_WORDS` | **30 词**（全唯一） | `:190-193` |
| ambush 三级回退 | ① 语法词 `findIndex` → ② 实词（≥3 且非停用词且 `^[a-z']+$`）→ ③ 第 2 词 | `:195-213` |
| boost `FUNCTION_WORDS` | **33 词**（全唯一；含 `is`／`am`／`are`） | `grammarBoostService.ts:243-246` |
| boost `keywordIndexes` | 长度 ≥3 且非功能词；空则回退第 2 词 | `:249-257` |
| boost `buildCloze` | `mulberry32(hashText('cloze:'+seed))` 抽取；seed ＝ `sourceRef` | `:259-395` |
| boost `courseVocabulary` | **过滤 `-ing`／`-ed`／`-est`／`-ly` 结尾且长度 >4 的词** | `:411-434` |

---

## 未核实

> **§U1（重要）：审计期间源文件被并行改动一次。**
> `src/data/grammarLessons.ts` 在审计过程中发生变更（mtime 由 `2026-09-19 20:46` 变为 **`2026-09-19 20:52:23`**），`md5` 由 **`5f6d4b5e79280c07a52110104e14f758`** 变为 **`92af8abf9f0f981dc4a75acf965093df`**，**行数不变（25,139）**。变更内容经逐行 diff 确认为 **L133 收官课新增 `forward` 认读种子 2 处**（`examples:24969` ＋ `contrast:25009`）。**本报告的 §1.1／§1.2／§3.3 已按冻结态重跑，其余章节的数字在变更前后一致**（我逐项重跑过 §指标概览／案号／封面／罪名／`to + -ing`／测试）。**未能核实**：变更是否由本任务的其他成员在同一时段并行写入，以及该变更是否还有我未捕获的其它字段（我的状态机提取器在变更后重跑，GL 串数 24,072 与英文口径 14,964 **均与变更前完全相同**，故推断变更仅限这 2 处；**但这只是推断，未逐字节 diff 合并**）。

> **§U2：boost 侧 cloze 落点用「形状合理的 lesson-id」模拟，非真实 id。**
> `buildCloze` 的种子来自 `sourceRef` ＝ `${lessonId}:t${tier}:${source}:${index}`，而 L134–L138 的 `lessonId` **尚未存在**。我用 **7 个形状合理的候选 id**（`lesson-134-looking-forward-to` 等）＋ 6 题源 × 6 index ＝ **252 组种子**做统计，得到 `forward` 可落 22.6%–34.9%。**未能核实**：真实 `lessonId` 确定后的精确落点分布（会随 id 字符串变化，因为 `hashText` 对 id 敏感）。**但落点分布的「量级」是稳定的**（三候选位各占约 1/3），故处置建议（§2.3）不受影响。

> **§U3：`variants` 条数对 ambush 回访问卷题量的影响未逐课实测。**
> `buildRevisitQuiz`（`:230-254`）对 `variants` 做 `slice(0,3)` ＋ `cloze/rebuild` 交替，最后 `slice(0,5)`。我**未**对 L134–L138 的假想 `variants` 组合实跑该函数（因课尚不存在）。**推断**：`variants` 三态齐 → 3 题 ＋ 核心句 rebuild 1 题 ＝ **4 题**（在 3–5 题区间内）。

> **§U4：`next` ＋ 周期词的「组合级新造」未逐条核。**
> 我确认了 `next week` **整串为 0**，但**未**逐条核查 `next` 的 140 处 GL 出现里是否有「`next` ＋ 名词」的其它搭配（如 `next time`／`next day`）。**批二十审计说「`next` 的 140 处里 118 处是 `next to`，另 22 处需逐条核」——本次仍未核。**

> **§U5：`cover` 二用张的「视觉重复感」未评估。**
> §6 的指派只做了**数学最优（min-gap 最大化）**，**未**评估用户视觉上是否会察觉「cover17 在 L17 用过又来一次」。**批十九／批二十也在用同一策略**（cover11–cover16），故属沿用，**但主观感知未核实**。

> **§U6：`object to` 的 C 档判定沿用路线图，未重新做竞品/课程体系核查。**
> §3.4 的三条理由（零底座／无情感抓手／缺配套名词）**全部是库内实读**，**未**参照外部课程体系（如 CEFR 官方描述符）核实 `object to` 是否属于 A2/B1 必修。

> **§U7：批二十一「5 课」的具体分课未核实。**
> 本报告按「L134–L138 共 5 课」做封面与基建推演（用户来函所述）。**未能核实**：实际是否 5 课、是否有收口课／认读课的结构安排（这属于主理人与产品线的决策，非数据盘点范围）。
