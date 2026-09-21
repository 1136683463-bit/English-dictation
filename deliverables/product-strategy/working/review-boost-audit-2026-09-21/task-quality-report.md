# 生成题全库扫描报告（复习题 + 趁热练题）

> 扫描日期：2026-09-21
> 扫描脚本（回归保留）：
> - `src/edge/verify/gq1-review-tasks.test.ts`（复习卡 cloze / rebuild / free_type）
> - `src/edge/verify/gq2-boost-items.test.ts`（趁热练 三档 × 全题型）
> 运行：`npx vitest run src/edge/verify/gq1-review-tasks.test.ts src/edge/verify/gq2-boost-items.test.ts --testTimeout=600000`
> 机器可读明细：`.rvfind/gq1-findings.json`、`.rvfind/gq2-findings.json`
>
> **本次未修改任何 `src/` 下的产品代码**（只新增扫描测试 + 本报告）。
> **⚠️ 扫描期间源码正被另一进程持续修改**（`grammarBoostService.ts` 在本次扫描的 2 小时内
> 变更了 3 次，行号随之漂移）。因此：
> - 所有**统计数字**已在新旧修订上复跑一致，缺陷全部可复现；
> - 所有**行号**以如下快照为准，并同时给出**代码锚点**（可直接搜索的原文），
>   行号漂移时以锚点为准。
>
> 冻结快照（sha256 前 8 位）：
> `grammarBoostService.ts 819c5cab`、`grammarReviewService.ts 46332d91`、
> `grammarLessons.ts ad37a95a`（193 课）、`huntCases.ts 2be0c024`（202 案）、
> `huntService.ts`（并发修复后：`addHuntGapSentences` 走 `correctedSentenceOf`）。
>
> **并发修复已确认落地**（扫描期间被另一进程改掉、本扫描已复跑确认消失）：
> ① 复习 cloze「答案词仍留在题面」泄题（原 13 例 → 0，`uniqueIndexes`）；
> ② 复习单词语卡题面变成光秃秃 `____`（原 12 例 → 0，改走来源锚点）；
> ③ hunt 卡把「含植错的案件原文」当正确句（原 146 道 cloze → 0，`correctedSentenceOf`）。
> ③ 的修复同时引入了本报告 2.6 的新 P0（中文括注被写回句子）。

---

## 0. 覆盖面（证明方法）

### 0.1 复习卡（GQ1）

复习题是「卡」现场生成的，所以先把**所有可能进 SM-2 复习队列的卡**枚举出来。入队链路已逐条核对（全部经 `addSentence` 且 `tags` 含「语法」）：

| 卡源 | 代码位置 | 入队的句子 |
|---|---|---|
| 课核心句 | `lessonService.addLessonCoreSentence`（lessonService.ts:209） | `lesson.targetSentence` |
| 课内错句 | `lessonService.addLessonMistakeSentence`（lessonService.ts:487），调用点 `GrammarLessonPage.tsx:1189 / 1217 / 1325 / 1382 / 1560 / 1599` | `guided[i].answer`、`practice[i].answer`、`recall.answer`、output 段（半提示变体句 + 核心句） |
| 找错案件缺口 | `huntService.addHuntGapSentences`（huntService.ts:318，卡构造在 `:268` `sentenceForError`） | **整段案件原文（含植错）** `tokens.join(" ")` |
| 日记句 | `diaryService.addDiarySentenceToReview`（diaryService.ts:349） | 用户自写句（非库内容，本扫描不覆盖） |

- 枚举卡数：**3666**；每卡生成 3 型（rc=0 → cloze，rc=1 → rebuild，rc≥2 → free_type）= **10998 道题**。
- 来源分布：课内 `guided` 单词语答案 371、其余为整句卡（课核心 / practice / recall / variants）+ hunt 案件卡 745（202 案，走 `addHuntGapSentences` 真实链路建卡）。
- 检查口径与产品代码同一函数、同一常量（`contentTokenIndexes` / `buildClozeOptions` / `judgeGrammar*`），不是另写一套模拟。

### 0.2 趁热练（GQ2）

- 调用矩阵：**193 课 × 三档 × 16 轮 = 62,532 次出题调用**，另加 **11 个罪名 × 三档** 的弱点驱动调用形态（`weakSpotTag`）。
- 去重后题目：**6575 道**（按 `id|sourceRef|tier` 去重；同题在多轮反复出现只计一次）。
- 题型分布：contrast 4107、rebuild 386、arrange 211、spot/cloze/replace/recall/produce/variant/fix 各 193、translate 175、bothright 152。
- 题量达标：三档均满足 `BOOST_TIER_META` 声明值（档 1=4、档 2=5、档 3=3），**0 例空态**。

### 0.3 「真词」判定依据（用于干扰项质量）

三层判定，从严到宽：① 词典原形（`bundledDictionary` 12000 条）→ ② 规则屈折还原（-s/-es/-ed/-ing/-ies）→ ③ 应用自身语料（193 课全部英文字段 + 202 案 tokens）。任一层命中即视为真词；都不命中才判为「硬造词」。

---

## 1. 全库统计表

### 1.1 复习卡（GQ1，3666 卡 / 10998 题）

| 检查项 | 命中 | 总数 | 判定 |
|---|---|---|---|
| A1-1 cloze 空位数 ≠ 1（多词句） | **0** | 3295 | ✅ 干净 |
| A1-1 cloze 空位原词 ≠ answer | **0** | 3295 | ✅ 干净 |
| A1-1 cloze answer 为空 | **0** | 3666 | ✅ 干净 |
| A1-2 正确答案数量 ≠ 1（判分口径） | **0** | 3666 | ✅ 干净 |
| A1-2 答案不在选项里 | **0** | 3666 | ✅ 干净 |
| A1-2 选项重复（归一化后） | **0** | 3666 | ✅ 干净 |
| A1-2 干扰项与答案判分等价 | **0** | 3666 | ✅ 干净 |
| A1-3 挖空词不是「可挖实词」（<3 字母/非字母） | **120** | 3666 | ⚠️ P1（见 2.1） |
| A1-3 题面泄漏答案（答案词仍在题面） | **4** | 3666 | ⚠️ P1（全部来自 2.6 的中文括注污染，见该节） |
| A1-4 选项不足 4 个 | **656** | 3666 | ⚠️ P1（见 2.2） |
| A1-4 只有 1 个选项 | **291** | 3666 | ⚠️ P1（见 2.2） |
| A1-5 题面无上下文也无来源锚点（不可作答） | **0** | 371 单词语卡 | ✅ 干净 |
| A2-1 打乱词块 ≠ 原句多重集 | **0** | 3666 | ✅ 干净 |
| A2-2 打乱后恰好等于原句（多词句） | **1** | 3666 | ⚠️ P0（见 2.3） |
| A2-2 词块数 < 2（单词语卡） | **371** | 3666 | ⚠️ P0（见 2.3） |
| A2-3 首尾同形兜底失效 | **1** | 3 张首尾同形卡 | ⚠️ P0（同 2.3） |
| A3-1 free_type 题面含完整答案 | **1** | 3666 | ⚠️ P2（见 2.4） |
| A4-1 sentence 词数 < 2 | **371** | 3666 | ⚠️ P2（见 2.5） |
| A4-1 sentence 无句末标点 | **451** | 3666 | ⚠️ P2（同 2.5） |
| A4-2 rebuild/free_type 的 `answer` 恒空 | 3666 × 2 | — | ✅ 模式约定，非缺陷 |
| B-1 hunt 卡面含非 ASCII（中文括注混入） | **4** 卡 / **12** 题 | 745 hunt 卡 | 🔴 P0（见 2.6） |
| B-1b hunt cloze 的正确答案是中文括注片段 | **3** | 745 | 🔴 P0（见 2.6） |
| B-1c 同一案件产生 front 相同的重复卡 | **202 句 / 543 张多余** | 745 | ⚠️ P1（见 2.6b） |
| B-2 题面结构与答案不一致 | **0** | 10998 | ✅ 干净 |
| C-1 干扰项不是真英语词 | **8** | 3666 题的全部干扰项 | ⚠️ P1（`mustn't` + hunt 中文碎片，见 2.7） |
| C-2 有效干扰项 < 2 | **1825**（达标率 50.2%） | 3666 | ⚠️ P1（见 2.8） |
| D-1 正解被判错 | **0** | 3666 × 3 型 | ✅ 干净 |
| D-2 错序 rebuild 被判对 | **0** | 3666 | ✅ 干净 |
| D-3 free_type 照抄原句未通过 | **0** | 3666 | ✅ 干净 |
| D-3 空串/纯空格/明显错句被判通过 | **0** | 3666 | ✅ 干净 |
| D-4 cloze 边界（空/空格/全角）被判对 | **0** | 3666 | ✅ 干净 |
| D-4 cloze 大小写不宽容 | **0** | 3666 | ✅ 干净 |

### 1.2 趁热练（GQ2，6575 题 / 62532 次调用）

| 检查项 | 命中 | 总数 | 判定 |
|---|---|---|---|
| A-1 answer 为空 / promptZh 为空 | **0** / **0** | 6575 | ✅ 干净 |
| A-1 answer 不是完整句（已排除 choose/replace/spot） | **0** | 6575 | ✅ 干净 |
| A-2 cloze 空位数 ≠ 1 / 答案不在选项 / 选项重复 | **0** / **0** / **0** | 193 | ✅ 干净 |
| A-3 rebuild 词块非排列 / arrange 拼不出答案 | **0** / **0** | 597 | ✅ 干净 |
| A-3 词块顺序已预解 / 词块库 < 答案词数 | **0** / **0** | 597 | ✅ 干净 |
| A-4 题型专属字段缺失（listen/bothright/spot/choose/replace/cloze） | **0** | 6575 | ✅ 干净 |
| A-4 听力二选一两项归一化相同 | **0** | 193 | ✅ 干净 |
| A-5 弱点驱动出的不可作答题 | **0** | 25344 次调用 | ✅ 干净 |
| B-1 bothRight 素材被当成「写错了」的题面 | **11** | 6575 | 🔴 P0（见 2.9） |
| B-1′ 听力干扰项取自 bothRight 条目 | **1** | 193 | ⚠️ P1（见 2.10） |
| B-2 语义不一致（题面与答案同句 / 双正解两句相同 / 变式样例句=答案 / 产出无中文意图 / spot 标注同形） | **0** | 6575 | ✅ 干净 |
| B-5 变式题 label（肯定/否定/疑问）与答案形式不符 | **2** | 193 | ⚠️ P1（见 2.11） |
| B-6 中文多解但只认一解 | **34** | 6575（产出类 561） | ⚠️ P1（见 2.12） |
| C-1 cloze 干扰项是硬造词（`ned` / `to's`） | **2** | 193 | 🔴 P0（见 2.13） |
| C-2 有效干扰项 < 2 | **66**（达标率 65.8%） | 193 | ⚠️ P1（见 2.14） |
| C-2 答案词仍留在题面（可照抄） | **1** | 193 | ⚠️ P1（见 2.15） |
| D-1 正解被判错 | **0** | 6575 | ✅ 干净 |
| D-2 错答/空答/空格/全角被判对 | **0** | 6575 | ✅ 干净 |
| D-3 判分过严（全大写/全角标点/首尾空格） | **0** | 6575 | ✅ 干净 |
| D-4 出题不确定、无法回放 | **0** | 193 课 × 三档 | ✅ 干净 |

---

## 2. 非 0 项明细（确认的缺陷）

### 2.9 🔴 P0 · bothRight（双正解）素材被当成「这句写错了」的题面

**严重度最高的一项**。`LessonContrast.bothRight === true` 表示「**两种说法都对**」（课程正文里明确写「两句都对」），但出题侧有三个通道没有过滤它：

| 通道 | 代码位置 | 后果 |
|---|---|---|
| 档 1 正误判断候选池 | `grammarBoostService.ts:815`（锚点 `(lesson.contrast ?? []).slice(0, 4).forEach((contrast, index) => {`，紧跟 `:816 candidates.contrast.push({`）——**无 bothRight 过滤** | 题面问「这句话有问题吗？」，正确回答被写死为「有点问题」；而题面其实是对的 |
| 档 3 自己改错候选池 | `grammarBoostService.ts:1319`（锚点 `for (const [index, contrast] of (lesson.contrast ?? []).entries()) {`，紧跟 `:1322 candidates.fix.push({`）——**无 bothRight 过滤** | 题面「这句写错了——请你把它改对」给一句本来没问题的句子，标准答案却是**另一句话** |
| 复习混题 | `grammarBoostService.ts:688`（`const pickFirstUnseenContrast = (`）→ `:628`（`const pickReviewContrast = (`）——**无 bothRight 过滤** | 同上 |

**用户会看到什么**（11 道去重后）：
- 档 1：屏幕显示 `How much milk is there?`，问「这句话，你觉得有问题吗？」——用户选「没问题」→ 判「还差一点，这句里确实藏着一处问题，再找找看。」（`GrammarBoostPage.tsx:553`）。**用户答对了却被判错。**
- 档 3：屏幕显示「这句写错了——请你把它改对，整句写出来」+ 样例句 `It's cold today.`，标准答案是 `It is cold today.`——**两句都对**（L87 正文原话：「长的短的都在……意思一模一样」），用户写出样例句本身却判错。

**11 个样本（全部）**：

| # | itemId | 档 | 题型 | 题面（= bothRight 的 wrong） | 标准答案 |
|---|---|---|---|---|---|
| 1 | `boost-lesson-76-much-better-t1-contrast-0` | 1 | contrast | `How much milk is there?` | `I feel much better.` |
| 2 | `boost-lesson-76-much-better-t3-fix-0` | 3 | fix | `How much milk is there?` | `I feel much better.` |
| 3 | `boost-lesson-77-keep-doing-review-lesson-76-much-better-0` | 1 | contrast | `How much milk is there?` | `I feel much better.` |
| 4 | `boost-lesson-77-keep-doing-review-lesson-76-much-better-0-t2` | 2 | contrast | `How much milk is there?` | `I feel much better.` |
| 5 | `boost-lesson-87-its-cold-t1-contrast-0` | 1 | contrast | `It's cold today.` | `It is cold today.` |
| 6 | `boost-lesson-87-its-cold-t3-fix-0` | 3 | fix | `It's cold today.` | `It is cold today.` |
| 7 | `boost-lesson-114-a-few-t1-contrast-0` | 1 | contrast | `There are few apples.` | `There are a few apples.` |
| 8 | `boost-lesson-114-a-few-t3-fix-0` | 3 | fix | `There are few apples.` | `There are a few apples.` |
| 9 | `boost-lesson-115-have-got-review-lesson-114-a-few-0` | 1 | contrast | `There are few apples.` | `There are a few apples.` |
| 10 | `boost-lesson-115-have-got-review-lesson-114-a-few-0-t2` | 2 | contrast | `There are few apples.` | `There are a few apples.` |
| 11 | `boost-lesson-169-id-like-t3-fix-1` | 3 | fix | `I'd like a cup of tea.` | `I would like a cup of tea.` |

数据侧原文（`grammarLessons.ts` L76 / L87 / L114 / L169 的 `contrast[].whyZh`）确认这些条目自述「两句都对」：
> L87 contrast[0]：`wrong: "It's cold today." , correct: "It is cold today.", bothRight: true, whyZh: "两句都对——长的短的都在……意思一模一样。"`

**注**：`GrammarLessonPage.tsx:806` 的前测取对比组时**已经**做了过滤（`find((item) => !item.bothRight) ?? lesson.contrast?.[0]`），`buildTierOne` 里 spot / bothright / listen 三条通道**都**过滤了（`grammarBoostService.ts:792 / 840 / 862` 三处，锚点 `if (contrast.bothRight) return;`）——**只有 contrast 候选池与 tier3 fix 候选池漏了**。所以这是遗漏而非设计。

---

### 2.1 ⚠️ P1 · 复习 cloze 挖空词不满足「可挖实词」口径

- 位置：`grammarReviewService.ts:404-408`（锚点 `const uniqueIndexes = indexes.filter((index) => {` / `const candidates = uniqueIndexes.length > 0 ? uniqueIndexes : indexes;`）+ `:418`（锚点 `const answer = cleanToken(tokens[pickedIndex] ?? "")`）
- 判据（服务内 `contentTokenIndexes`，`:224`）：候选须 `clean.length > 2` 且不在 `STOP_WORDS`。**但当 `uniqueIndexes` 为空时会回退到 `indexes`，而 `indexes` 在「无候选」时被塞入下标 0**（`:231` `if (indexes.length === 0) indexes.push(0)`）——于是 `cleanToken` 后的 answer 可能只有 1-2 个字母。
- 命中 **120 / 3666**（3.3%）。用户看到的是「挖掉一个 2 字母词」的题，难度低于设计意图。

样本（5 个，共 117）：

| 卡 id | 来源 | answer | 题面 |
|---|---|---|---|
| `lesson:lesson-91-before#practice1` | lesson-91-before practice[1] | `you` | `Do you wash your hands before ____ eat?` |
| `lesson:lesson-98-while#practice2` | lesson-98-while practice[2] | `was` | `While I was cooking, he ____ reading.` |
| `lesson:lesson-108-got-him-to#practice1` | lesson-108-got-him-to practice[1] | `you` | `Did ____ get him to go with you?` |
| `lesson:lesson-99-when-rang#guided2` | lesson-99-when-rang guided[2] | `was` | `While I ____ reading, he was sleeping.` |
| `lesson:lesson-102-phone-story#guided4` | lesson-102-phone-story guided[4] | `was` | `While I ____ reading, he was sleeping.` |

**用户会看到什么**：句子挖掉 `was` / `you` 这类功能词——「可挖」但不是「语法承载词」。这些题仍然可作答（不算 P0），但语法诊断价值低。注：L98 的 `was` 有第二个 `was` 留在题面里（见 2.16「可疑但未证实」）。

---

### 2.2 ⚠️ P1 · 复习 cloze 选项不足 4 个（其中 291 题只有 1 个选项）

- 位置：`grammarReviewService.ts:298`（锚点 `const buildClozeOptions = (answer: string, tokens: string[]): string[] => {`）。三个来源：① 功能词同族替换表；② 已知规则动词变形；③ **句内其他词**（`for (const token of tokens)`）。**没有课程词汇池兜底**（boost 侧有 `courseVocabulary()`，review 侧没有）。
- 影响：当答案不在两张表里、且句内词又都等于答案时，候选为空 → 只有答案一个选项。
- 命中 **656 / 3666**（选项数分布：4 个 = 3010、3 个 = 309、2 个 = 56、**1 个 = 291**）。只有 1 个选项的题 **点一下就通过**，等于没有选择题。

样本（6 个单选项，共 291）：

| 卡 id | 来源 | 选项 | card.front |
|---|---|---|---|
| `lesson:lesson-05-like#guided0` | lesson-05-like guided[0] | `["dogs"]` | `dogs` |
| `lesson:lesson-05-like#guided5` | lesson-05-like guided[5] | `["likes"]` | `likes` |
| `lesson:lesson-08-my#guided3` | lesson-08-my guided[3] | `["I"]` | `I` |
| `lesson:lesson-08-my#guided5` | lesson-08-my guided[5] | `["her"]` | `her` |
| `lesson:lesson-09-go#guided0` | lesson-09-go guided[0] | `["to"]` | `to` |
| `lesson:lesson-09-go#guided3` | lesson-09-go guided[3] | `["school"]` | `school.` |

**用户会看到什么**：卡片 `dogs` 生成 cloze，题面「语法课：小美的一天 ⑤ 你喜欢什么——这句里的词是什么？」+ 唯一选项 `dogs`，点它即「对了！」。
**根因链**：`GrammarLessonPage.tsx:1185 / 1321` 把 `guided[i].answer` 入队，而 choose/replace/spot 三型的 answer 是**单个词**（全库 371 张这样的卡）→ 单词语卡没有可挖的上下文，也没有句内词可作干扰项。

---

### 2.3 🔴 P0 · rebuild 词块数 = 1（371 题）与「首尾同形」兜底失效（1 题）

- 位置：`grammarReviewService.ts:380`（锚点 `if (scrambled.length > 1 && scrambled.join(" ") === tokens.join(" ")) {`）
  ```ts
  const scrambled = [...tokens];
  /* Fisher-Yates */
  if (scrambled.length > 1 && scrambled.join(" ") === tokens.join(" ")) {
    [scrambled[0], scrambled[scrambled.length - 1]] = [scrambled[scrambled.length - 1], scrambled[0]];
  }
  ```
  ① `scrambled.length > 1` 的守卫意味着**单词语卡不做任何检查**，`scrambled = ["am"]`；
  ② 交换首尾在**首尾词相同时**是恒等变换，兜底失效。

**用户会看到什么**：
- 371 题：屏幕只有一个词块，点一下 → 立即判对并进入下一题（「做题」退化为点击）。
- 1 题：`lesson-65-as-as#guided5`，卡片 `as smart as`，词块显示顺序就是 `as smart as`——**不用做就对了**。

样本（5 个词块数 = 1，共 371）：

| 卡 id | 来源 | sentence | scrambled |
|---|---|---|---|
| `lesson:lesson-01-am#guided0` | lesson-01-am guided[0].choose | `am` | `["am"]` |
| `lesson:lesson-01-am#guided3` | lesson-01-am guided[3].spot | `is` | `["is"]` |
| `lesson:lesson-02-is#guided0` | lesson-02-is guided[0].choose | `is` | `["is"]` |
| `lesson:lesson-03-have#guided0` | lesson-03-have guided[0].choose | `have` | `["have"]` |
| `lesson:lesson-04-want#guided0` | lesson-04-want guided[0].choose | `an` | `["an"]` |

首尾同形兜底失效（全库仅 3 张首尾同形卡，命中 1 张）：

| 卡 id | front | scrambled | 判定 |
|---|---|---|---|
| `lesson:lesson-65-as-as#guided5` | `as smart as` | `["as","smart","as"]` | ❌ 等于原句，首尾都是 `as`，交换后不变 |
| `lesson:lesson-65-as-as#guided0` | `as tall as` | 已打乱 | ✅ |
| `lesson:lesson-187-as-long-as#guided0` | `as long as` | 已打乱 | ✅ |

---

### 2.4 ⚠️ P2 · free_type 题面复述答案（1 张卡）

- 位置：`grammarReviewService.ts:358`（锚点 `const sourceHint = card.note.trim()`）——`sourceHint = \`${card.note.trim()}——把那句话自己写出来\``，直接把 `card.note` 拼进题面。
- 命中 1 张：`lesson:lesson-127-two-look-faces#guided3`，`card.front = "look"`，`card.note = "语法课：小美的一天 一百二十七 同一个 look，两张脸（收口）"`。
- **用户会看到什么**：题面「语法课：小美的一天 一百二十七 同一个 look，两张脸（收口）——把那句话自己写出来」，答案就是 `look`——**答案已经写在题面里**。

### 2.4b ✅ 「note 含完整 front 的卡」统计（任务重点项）

任务要求「统计全库里有多少张卡的 note 包含其 card.front 的完整文本」——**全库 3666 张卡中仅 1 张**（上表），且它正是 `front` 为单词 `look`、被课名/课标题偶然包含的情形（`两张脸（收口）` 不含 look，是 `同一个 look` 这半句含）。
方法：对每张卡做 `note.includes(front.trim())` 的**完整子串**判定（非分词、非模糊），命中即计数。其余 3665 张的 note 形如「语法课核心句：小美的一天 ① 我是谁」「找错案件：搬家那天（时态变形）」，**不含英文整句**，不构成泄题。

---

### 2.5 ⚠️ P2 · sentence 不是合法英文句（词数 < 2 = 371，无句末标点 = 451）

- 根因同上（2.2 / 2.3）：`guided[i].answer` 入队时是单词语。
- 样本：`lesson:lesson-01-am#guided0`（`am`）、`lesson:lesson-01-am#guided3`（`is`）、`lesson:lesson-01-am#guided4`（`am`）、`lesson:lesson-02-is#guided0`（`is`）；无句末标点如 `lesson:lesson-09-go#guided0`（`to`）、`lesson:lesson-08-my#guided3`（`I`）。
- **用户会看到什么**：free_type 的题面退化成「把那句 1 个词的句子自己写出来」（`grammarReviewService.ts:363`）——用户被要求「写一句 1 个词的句子」。

---

### 2.6 🔴 P0 · hunt 来源卡的卡面混入中文修正括注（4 张卡 × 3 型 = 12 道题）

> **扫描过程中此处的旧缺陷已被并发修复**：`huntService.correctedSentenceOf`（`huntService.ts:292`）
> 现在会把案件原文按 `errors[]` 替换成**修正后的句子**再入队（旧版是 `tokens.join(" ")` 直接把植错原文当卡面，
> 全库 146 道 cloze 的「正确答案」是案件里的错词）。**该旧缺陷已消失**，本报告只登记修复后暴露的**新**缺陷。
>
> 上一版报告中的「170 案 free_type 反证」也随之失效：现在卡面就是修正句，`judgeGrammarFreeType(card.front, card.front)` 恒满分。

**新缺陷**：`correctedSentenceOf` 的删词分支只认 `/^（?去掉/`，而数据里有一类 correction 是**给用户看的括注**
（描述「怎么改」而不是「改成什么」），既不以「去掉」开头、也不该被当作词写回句子——于是整段中文被写进卡面：

- 位置：`huntService.ts:292-310`（`correctedSentenceOf`），替换发生在 `:307`
  `tokens[index] = \`${correction.replace(/[.,!?;:]+$/, "")}${trailing}\``
- 4 处数据源（`huntCases.ts`）：

| 案件 | tokenIndex | original | correction（不该被写回句子） |
|---|---|---|---|
| `hunt-why-dont-you-rest` | 8 | `you` | `（与 don't 对调）` |
| `hunt-so-do-i` | 0 | `So` | `（So 与 do I 对调）` |
| `hunt-would-rather-walk` | 6 | `rather` | `（rather 跟在 would 后）` |
| `hunt-prefer-tea` | 7 | `drink` | `（drink → drinking 或去掉）` |

**用户会看到什么**（4 张卡 × cloze/rebuild/free_type 三型，实际内容已复现）：

| 卡面（= 判分基准 = 复习题的「正确句子」） |
|---|
| `（So 与 do I 对调） I do. So do I. She can both sing and dance herself.` |
| `I would rather walk. I （rather 跟在 would 后） would walk. She would rather stay at home` |
| `I prefer tea to coffee. I prefer （drink → drinking 或去掉） tea. She prefers walking to running.` |
| `Why don't you take a rest? Why （与 don't 对调） don't rest? She can swim` |

三型各自的坏法（逐条复现）：

| 卡 | 型 | 用户看到/遇到 |
|---|---|---|
| `hunt-so-do-i` | cloze | 题面 `（So 与 do I 对调） I do. So do I. She can both ____ and dance herself.`，选项 `["sing","i","对调）","与"]`——两个选项是中文片段 |
| `hunt-so-do-i` | rebuild | 词块库含 `（So` / `与` / `对调）`——三级中文碎片混在英文词块里 |
| `hunt-would-rather-walk` | cloze | 题面 `I would rather walk. I ____ 跟在 would 后） would walk. …`，**正确答案是 `（rather`**，选项 `["she","跟在","walk","（rather"]`——无论选什么都荒谬；`（rather` 这个「答案」还缺右括号 |
| `hunt-prefer-tea` | rebuild | 词块库含 `（drink` / `→` / `或去掉）` |
| `hunt-why-dont-you-rest` | cloze | 题面 `…Why （与 don't 对调） don't rest? She ____ swim`，选项 `["you","can","she","swim"]`——题面自己就含中文 |

**影响面**：全库 202 案 / **745 张 hunt 卡**中，**4 张**（0.5%）卡面被污染；换算成题 = **12 道**（每卡 3 型），其中 **2 道 cloze 的正确答案是中文片段**。
**判定为确认缺陷**：`gq1` 的断言 `B-1`（卡面必须是纯 ASCII）与 `B-1b`（cloze 答案不得含中文）都守住了，数量上界已入 `BASELINE`。
**同类残留（未污染卡面但仍可疑）**：`pickCorrectionWord`（`huntService.ts:57`）只挡了「去掉」开头与**整条都被括号包住**的括注；`（drink → drinking 或去掉）` 这类**部分带括号**的仍会被取词，进错词本。

---

### 2.6b ⚠️ P1 · 同一案件产生多张 front 完全相同的复习卡（543 / 745 张是重复）

2026-09-21 的 hunt 修复（`correctedSentenceOf`）让**同案每张卡的正面都变成同一句修正后的完整句**，
但建卡循环仍按「每个错点一张卡」执行（幂等键 = 案件 + 罪名 + 原错词，`huntService.ts:334`）：

- 位置：`huntService.ts:330-346`（`for (const error of caseItem.errors)` + `addSentence({ sentence: correctedSentence, ... })`）
- 实测：**202 案全部产生重复**，745 张卡中 **543 张是多出来的重复**（202 个不同句子）。
  例：`hunt-moving-day` 4 处植错 → **4 张卡，front 完全相同**。

**用户会看到什么**：同一场复习（上限 10 张）里连着出同一句话多次。
实测（把全库 hunt 卡设为到期）：`hunt-moving-day` 一案就占用 4 个槽位；
全库最大 errors 数为 7，即一案最多可吃掉 7 / 10 个槽位。复习容量被重复句挤占，用户观感是「连续四遍同一句」。
**注**：全库层面（把 202 案全部卡设为到期）抽样会话里未出现同句重复，是因为队列按来源交错且只取前 10 张——
但**单案场景（用户刚结案一个案子，第二天复习）必然命中**，已单独复现。

---

### 2.7 ⚠️ P1 · 复习 cloze 干扰项含「字典里查不到的真词」（1 例）

- 位置：`grammarReviewService.ts:298`（锚点 `const buildClozeOptions = (answer: string, tokens: string[]): string[] => {`）。
- 机制（已复现）：`FUNCTION_FAMILIES`（`:245-269`）里 `can't` 同时出现在**两个**族里——`["shouldn't","mustn't","can't"]`（第 7 项）与 `["can't","couldn't","won't"]`（第 9 项）。`:296` 用 `.find()` 取**第一个**命中的族，于是 `can't` 拿到的是 `shouldn't / mustn't` 作干扰项（这是合理的语法混淆项，**不是造词**）。
- 命中 1 例（`lesson-163-myself` 的否定变体句）：题面 `I ____ do it myself.`，答案 `can't`，选项 `["can't","mustn't","shouldn't","it"]`。
- **判定为残留在扫描口径上、非产品缺陷**：`mustn't` 是合法英语缩写（扫描器的三层真词判定都不覆盖「词典未收的缩写词形」）。但**真实的可用性问题**是：`mustn't` 的本课上下文里从未出现（该课只教 `can / can't`），属超纲干扰项。
- 说明：历史注释提到的 `forwardes` / `lookinged` / `coldes` / `drinked` / `wents` / `thinked` / `don'ted` / `shouldn'tes` / `haven'ted` 在**复习题里已 0 残留**（约 520 个去重干扰项全查）。

### 2.8 ⚠️ P1 · 复习 cloze 有效干扰项 < 2（1825 / 3666 = 49.8%）

判据：干扰项须同时满足「真词 + 槽位相容（动词类槽位之间不互通）」。达标率 **1841 / 3666 = 50.2%**。
样本（8 个）：

| 卡 id | answer | options | 题面 | 有效数 |
|---|---|---|---|---|
| `lesson:lesson-01-am#guided2` | `Xiaoming` | `["Xiaoming","i","am"]` | `I am ____` | 0 |
| `lesson:lesson-01-am#practice0` | `tired` | `["am","i","tired"]` | `I am ____` | 0 |
| `lesson:lesson-02-is#guided1` | `are` | `["are","my","you","friend"]` | `You ____ my friend.` | 0 |
| `lesson:lesson-01-am` | `Xiaomei` | `["i","Xiaomei","am"]` | `I am ____` | 1 |
| `lesson:lesson-01-am#practice2` | `hungry` | `["hungry","am","i"]` | `I am ____` | 1 |
| `lesson:lesson-01-am#practice3` | `not` | `["tired","i","not","am"]` | `I am ____ tired.` | 1 |
| `lesson:lesson-01-am#recall` | `Xiaomei` | `["i","Xiaomei","am"]` | `I am ____` | 1 |
| `lesson:lesson-01-am#variant1` | `not` | `["tired","i","not","am"]` | `I am ____ tired.` | 1 |

**用户会看到什么**：`I am ____` 的四选项是 `i / am / tired / hungry` 之类——`I am hungry` 的语境里 `I`、`am` 已经出现在题干中，`am` 与 `hungry` 词性完全不同，「一眼可排除」的干扰项超过 2 个。占全部复习 cloze 的 49.8%。
对照：**同一指标在 boost 侧为 65.1%**（见 2.14）——差异来源是 boost 有课程词汇池兜底（`grammarBoostService.ts:407 courseVocabulary()`），review 没有。

---

### 2.10 ⚠️ P1 · 听力二选一的干扰项本身也合法（1 例）

`boost-lesson-114-a-few-t1-listen-0`：播放 `There are a few apples.`，选项 `["There are a few apples.", "There are few apples."]`。后者是 `bothRight` 条目里的「另一句也对」（只差 a，语义相反但语法正确）。
判分唯一（比对播放文本，`judgeBoostListen`），所以不算判错；但**选项本身不具排他性**，用户若没听清可能凭「两句都对」的印象乱选。属听辨题素材选择问题。

### 2.11 ⚠️ P1 · 变式题 label 与答案形式不符（2 例）

- 位置：`grammarBoostService.ts:1302`（锚点 `candidates.variant.push({`），题面在紧随的 `promptZh: \`这句话还能换个说法——把它说成「${target.label}」的样子。\``——直接引用数据侧 `variant.label` 拼题面「把它说成「${target.label}」的样子」，未校验答案形式。
- 样本：

| itemId | 题面 | 答案 | shapedFrom | 问题 |
|---|---|---|---|---|
| `boost-lesson-66-too-to-t3-variant-否定` | 把它说成「否定」的样子 | `It is too heavy for me.` | `It is too heavy to carry.` | 不是否定句（数据侧 L66 variants[1].label 写「否定」） |
| `boost-lesson-89-what-a-day-t3-variant-否定` | 把它说成「否定」的样子 | `What a bad day!` | `What a nice day!` | 不是否定句（数据侧 L89 标注如此） |

**用户会看到什么**：「把它说成『否定』的样子」→ 用户写 `It is not too heavy to carry.` → 判错（答案要 `It is too heavy for me.`）。**这是真实判错场景**。
（说明：这两处的 label 是数据侧人工标注问题，出题侧把 label 直接当题面用放大了它。）

### 2.12 ⚠️ P1 · 中英对照题「多解但只认一解」（34 题）

判据：题面的中文提示在全库范围内对应 ≥2 种已被课程教过的英文写法，而判分只认其中一种（`judgeBoostProduce` / `judgeBoostRecall` 用 `diffScore ≥ 90 / 70`，只认近似原文）。
全库中文多解条目：**16 组**；受影响的题：**34 道**（产出类共 561 道，占 6.1%）。

| itemId | 档 | 题面（中文） | 只认 | 另一合法写法（课程内已教） |
|---|---|---|---|---|
| `boost-lesson-10-went-t2-recall-target-0` | 2 | 我昨天去了公园。 | `Yesterday I went to the park.` | `I went to the park yesterday.`（L24 sceneSwings，同课也教） |
| `boost-lesson-24-past-vs-perfect-t3-produce-target-0` | 3 | 我昨天去了公园。 | `Yesterday I went to the park.` | `I went to the park yesterday.` |
| `boost-lesson-15-want-to-t2-translate-examples-0` | 2 | 我想睡觉。 | `I want to sleep.` | `I would like to sleep.`（L62 examples） |
| `boost-lesson-68-buy-for-t2-recall-target-0` | 2 | 我给妈妈买了份礼物。 | `I bought a gift for my mom.` | `I bought my mom a gift.`（同课 sceneSwings） |
| `boost-lesson-54-focus-t2-translate-examples-1` | 2 | 窗户昨天被打扫了。 | `The window was cleaned yesterday.` | `The windows were cleaned yesterday.`（L51 examples） |
| `boost-lesson-103-makes-me-t3-produce-target-0` | 3 | 妈妈让我先写作业。 | `My mom makes me do my homework.` | `She lets him play after dinner.` / `The teacher had me come early.` / `I got him to go with me.`（L110 recall，同一使役句型另一动词） |

**用户会看到什么**：中文「我明天要去公园」类提示写成 `I went to the park yesterday.` → 部分对了（90% 线以下）→ 提示「已经对了一部分（xx%），再调整一下」→ 用户不知道差在哪、反复改也不通过。前 5 类是**语序/同义替换**型（真实高频），第 6 类是同义动词型。

### 2.13 🔴 P0 · 趁热练 cloze 干扰项是硬造词 / 非词（2 例，修过一次的残留）

- 位置：`grammarBoostService.ts:424`（锚点 `const base = lower.replace(/ies$/, "y").replace(/ing$/, "").replace(/ed$/, "").replace(/s$/, "");`，属 `:438` 锚点 `const pool = courseVocabulary().filter(` 之前的后缀生成分支）与 `:487`（锚点 `const courseVocabulary = (): string[] => {`）的入池正则。
- 命中（全库去重 2 个），**机制已逐条追到源码**：

| 干扰项 | itemId | 答案 | 题面 | 生成机制（已复现） |
|---|---|---|---|---|
| `ned` | `boost-lesson-161-need-to-t1-cloze-variants:1` | `need` | `I don't ___ to buy milk.` | `:424` 的 base 还原链 `lower.replace(/ies$/,"y").replace(/ing$/,"").replace(/ed$/,"")…` 把 **`need` 结尾的 `ed` 当成过去式后缀剥掉**，得 `base = "ne"`；`ne` 是 `-e` 结尾 → 走紧随的 `else if (/e$/.test(base)) push(\`${base}d\`)` → **`ned`** |
| `to's` | `boost-lesson-139-although-t1-cloze-variants:1` | `stay` | `Although it is raining, I will not ___ at home.` | 课程词汇池 `:487`（`const courseVocabulary = (): string[] => {`）从 L139 的 dialogue 行 `"Two 'to's on one page!"` 提取词条；其内部的 `raw.replace(/^[.,!?;:'"\u2019(\[]+/, "")...` 只剥**首尾**标点，`'to's` → **`to's`**，再通过 `^[a-z]+('[a-z]+)?$` 正则入池。这是「被引用的词形（mention）」，不是真实词语 |

**用户会看到什么**：`I don't ___ to buy milk.` 的四选项是 `bus / guests / need / ned`——`ned` 不是词（一眼排除）；`Although it is raining, I will not ___ at home.` 的四选项是 `to's / stay / their / month`——`to's` 也不是词（那是课文里在「说这个词」而不是「用这个词」）。
**说明**：这与 `grammarBoostService.ts:399-424` 注释里记录的两次修复**不矛盾**——已修的是「无条件加 `-es/-ed/-ing`」与「三单形再变形」两类；这两例分别是**去后缀还原过切**（`need` → `ne` → `ned`）与**词汇池收入引用词形**（`to's`），属**残留**而非回归。

### 2.13b ✅ 其余「非真词」已清零

同口径全库复查（193 课 × 16 轮 × 档 1 cloze，共 193 题；干扰项去重后 520 个）：非真词只剩上表 2 个。历史注释提到的 `forwardes` / `lookinged` / `coldes` / `drinked` / `wents` / `thinked` / `takesed` / `don'ted` / `shouldn'tes` / `haven'ted` **全库 0 残留**。

### 2.14 ⚠️ P1 · 趁热练 cloze 有效干扰项 < 2（66 / 193 = 34.2%）

达标率 **133 / 193 = 68.9%**（另一口径 125/193 = 64.8%，差异在是否计入句内可见词）。样本（8 个）：

| itemId | 答案 | 选项 | 题面 | 有效数 |
|---|---|---|---|---|
| `boost-lesson-01-am-t1-cloze-variants-1` | `tired` | `["new","give","tired","last"]` | `I am not ___.` | 0 |
| `boost-lesson-04-want-t1-cloze-variants-1` | `want` | `["want","wanting","wanted","wants"]` | `I don't ___ an egg.` | 0（全部同词形） |
| `boost-lesson-15-want-to-t1-cloze-variants-1` | `want` | `["want","wanting","wants","wanted"]` | `I don't ___ to go.` | 0 |
| `boost-lesson-23-have-lost-t1-cloze-variants-1` | `cleaned` | `["classroom","cleaned","cleans","cleaning"]` | `I haven't ___ my room.` | 0 |
| `boost-lesson-30-some-any-t1-cloze-variants-1` | `apples` | `["doesn't","live","apples","keep"]` | `There aren't any ___.` | 0 |
| `boost-lesson-10-went-t1-cloze-variants-1` | `out` | `["takes","out","will","phone"]` | `I did not go ___.` | 1 |
| `boost-lesson-17-comparative-t1-cloze-variants-1` | `not` | `["nine","are","food","not"]` | `She is ___ older than me.` | 1 |
| `boost-lesson-28-frequency-t1-cloze-variants-1` | `candy` | `["boxes","candy","guests","wall"]` | `He never eats ___.` | 1 |

**用户会看到什么**：`I am not ___.` 的选项 `new / give / tired / last`——四个词都能填进语法位置，用户只能靠语义猜，**语法点（`not` 在 be 后）完全没被考到**；`I don't ___ an egg.` 的四个选项是 `want / wanting / wanted / wants`——考的是词形，与题干 `don't` 要原形这一点尚算相关，可接受。

### 2.15 ⚠️ P1 · 趁热练 cloze 答案词仍留在题面（1 例）

`boost-lesson-98-while-t1-cloze-variants-1`：`clozeText = "While I was reading, he ___ not sleeping."`，`clozeAnswer = "was"`，而 `was` **就在题面第 2 个词**。用户可照抄。
机制：`buildCloze`（`grammarBoostService.ts:296-394`）按 `keywordIndexes` 选挖空位，不检查该词是否在同句其他地方出现（review 侧 2026-09-21 已加 `uniqueIndexes` 修复，boost 侧未同步）。

### 2.16 ✅ 干净项（写法与证据）

| 检查项 | 方法 | 结果 |
|---|---|---|
| cloze 恰好一个正确答案 | 对每个选项跑 `judgeGrammarCloze(option, answer)`，计数 = 1 | 3666/3666 通过 |
| 干扰项与答案在判分口径下不等价 | `option.trim().toLowerCase() === answer.trim().toLowerCase()` 逐项比对 | 0 命中 |
| 选项无重复 | 归一化后 `Set` 去重 | 0 命中 |
| rebuild 词块是原句排列 | 词块与 `sentence.split` 各自 `sort().join()` 后全等 | 0 命中 |
| rebuild 反序必判错 | 交换首词与首个不同词后提交 `judgeGrammarRebuild` | 0 命中 |
| free_type 照抄原句必通过 | `judgeGrammarFreeType(sentence, sentence).passed` | 3666/3666 通过 |
| free_type 空/空格/`。`/乱码必不通过 | 四种输入逐题跑 | 0 命中 |
| free_type 全角句号与全大写必须判对 | `sentence.replace(/[.!?]$/, "。")` 与 `toUpperCase()` | 0 命中 |
| cloze 大小写宽容、首尾空格宽容 | `answer.toUpperCase()` / `` `  ${answer}  ` `` | 0 命中 |
| 趁热练 正解必判对（全题型） | 按题型构造合法 payload（contrast=有问题 / bothright=都对 / spot=标错下标 / listen=播放文本 / cloze=答案词 / choose,replace=选项文本 / rebuild,arrange=按答案取词 / 其余=整句） | 6575/6575 通过 |
| 趁热练 错答必判错 | `{text:"zzz qqq zzz", tokens:[...], tokenIndex:-1, pickedProblem:false}` 逐题跑 | 0 命中 |
| 趁热练 空/空格/全角不得通过 | 三种 payload 逐题跑 | 0 命中 |
| 趁热练 判分不过严 | 全大写 / 全角句末标点两种输入必须仍判对 | 0 命中 |
| 出题确定性（可回放） | 同参数连续两次 `buildBoostItems` 的 `JSON.stringify` 全等 | 193 课 × 三档 0 不一致 |
| arrange 词块库 ≥ 答案词数 | 逐题 `bank.length >= boostArrangeAnswerLength(item)` | 0 命中（与既有 `e0` 测试口径一致） |
| arrange 词块顺序已预解 | `tokens.join(" ") === answer.trim()` | 0 命中 |
| 听力字段齐备且二选一不重复 | `listenOptions.length === 2` 且归一化后互异，且播放文本在选项内 | 0 命中 |
| spot 标错下标不越界 | `spotWrongIndex(es)` 全部落在 `spotTokens` 范围内 | 0 命中 |
| 弱点驱动不产生坏题 | 11 罪名 × 三档 × 193 课（25344 次调用）逐题查 answer/prompt | 0 命中 |
| 三档题量达标 | 逐次调用对照 `BOOST_TIER_META.questionCount` | 0 例不足 |

---

## 3. 可疑但未证实（需人工判断，本扫描未定性为缺陷）

1. **bothRight 素材自身的字段语义**（`grammarLessons.ts` L76 / L87 / L114 / L169 等多处）：`contrast[].wrong` 字段在 `bothRight: true` 时装的其实是「另一句也对的话」，字段名（`wrong`）与语义相反。删除该条 `bothRight` 标记能否同时修好 2.9 的全部 11 例，需数据侧确认；本扫描只确认了「出题侧三个通道未过滤」这一事实。
2. **复习 free_type 只给「来源标题」、不给中文意图**（`grammarReviewService.ts:358`）：题面形如「语法课核心句：小美的一天 ① 我是谁——把那句话自己写出来」，而同类任务在课内 recall 段与 boost 档 2/3 都**给中文意图**（`intentZh`）。判 0 命中是因为判据只要求「有锚点」，但信息量落差是真实的（用户知道「哪一课」，不知道「哪一句」）。**统计**：3666 道 free_type 全部如此。
3. **复习 cloze 与 boost cloze 的干扰项质量差**（50.4% vs 65.8% 达标率）：review 侧缺 `courseVocabulary()` 等价兜底，是 2.2 / 2.8 的共同根因；是否值得为复习题引入课程词池需产品判断（复习题只有 10 张/次，干扰项质量对体验的影响权重待估）。
4. **`uniqueIndexes` 修复后的挖空位分布**：2026-09-21 的「只挖唯一出现词」修复让题面泄漏归零（除 2.6 的中文括注污染外），但抽走唯一词后**挖空位是否过度集中**未统计（可能反复挖同一个唯一词）。需人工抽样判断。
5. **`isRealEnglishWord` 的词典边界**：`mustn't`（2.7）这类合法缩写词不在 `bundleDictionary` 里，本扫描的「非真词」判定对**缩写形态**偏严。已用「应用语料 + 规则屈折 + 功能词表」三层兜底，但缩写词形仍可能误判。
6. **`pickCorrectionWord` 的部分括注残留**（`huntService.ts:57`）：`（drink → drinking 或去掉）` 这类**部分带括号**的 correction 仍会被取词进错词本（2.6 同类残留）。是否会产生用户可见的垃圾错词需人工确认。
7. **`scrambled` 的「不等于原句」保证是概率性的**：`if (scrambled.length > 1)` 之外的交换兜底只做一次；对 `as X as` 这类首尾同形句无效（2.3 已确认 1 例）。是否存在**首尾同形且中间词也同形**的更极端句未被语料覆盖（全库只有 3 张首尾同形卡，已全查）。

---

## 4. 修复优先级建议（按用户可感知程度）

| 优先级 | 项 | 位置 | 一句话 |
|---|---|---|---|
| **P0** | bothRight 当成错句（11 题） | `grammarBoostService.ts:815 / 1319 / 688` | 三个候选池补 `if (contrast.bothRight) return;`（`:792 / :840 / :862` 三处已这样做，照抄即可） |
| **P0** | rebuild 词块数 = 1（371 题）+ 首尾同形兜底 | `grammarReviewService.ts:374-386` | 单词语卡不应走 rebuild；首尾同形时改换「首 ↔ 中间不同词」 |
| **P0** | 硬造干扰项残留（2 例） | `grammarBoostService.ts:424` + `:487` | `ned` / `to's` 类切片/入池错误，加「结果必须能还原为词典词」的断言 |
| **P1** | 复习 cloze 选项不足 4 个（656 题，其中 291 题只有 1 个） | `grammarReviewService.ts:298` | 引入与 boost 同款的课程词汇池兜底 |
| **P0** | hunt 卡面混入中文修正括注（4 卡 / 12 题；2 道 cloze 答案就是中文片段） | `huntService.ts:292-310`（`correctedSentenceOf` 的替换分支） | 括注型 correction（含中文/括号）不该写回句子，应走删词或改写分支；数据侧 4 处可改为可替换词形 |
| **P1** | 中英对照多解只认一解（34 题） | `grammarBoostService.ts:1470-1481`（锚点 `export const judgeBoostRecall` / `export const judgeBoostProduce`） | 对已知等价改写（状语位置互换等）做白名单 |
| **P1** | 变式题 label 与答案形式不符（2 例） | `grammarBoostService.ts:1302`（`candidates.variant.push`） | 出题前校验 label 与答案形态 |
| **P1** | 趁热练 cloze 答案留在题面（1 例） | `grammarBoostService.ts:327`（`const buildCloze = (`） | 同步 review 侧的 `uniqueIndexes` 修复 |
| **P1** | 有效干扰项不足（复习 49.8% / 趁热练 34.2%） | 两侧 `buildClozeOptions` / `buildCloze` | 槽位相容性约束（动词类槽位之间不互通） |
| **P1** | 同一案件重复建卡（543 张 / 745） | `huntService.ts:330-346` | 每案只建一张卡（幂等键改为案件 + 句面哈希），罪名信息放 `grammarNote` |
| **P2** | 单词语卡（371 张） | `GrammarLessonPage.tsx:1189 / 1325` | `choose/replace/spot` 的 answer 是词不是句，入队前应取所属句 |
| **P2** | free_type 题面复述答案（1 例） | `grammarReviewService.ts:358-361` | note 含 front 时换用词数提示 |
| **P2** | free_type 无中文意图 | `grammarReviewService.ts:358-363` | 与课内 recall / boost 档 2 对齐，给出 `intentZh` |

---

## 5. 如何复跑与核对

```bash
# 两个扫描（约 25 秒）
npx vitest run src/edge/verify/gq1-review-tasks.test.ts src/edge/verify/gq2-boost-items.test.ts --testTimeout=600000

# 机器可读明细（计数为全量精确值，samples 每项最多 8 条）
cat .rvfind/gq1-findings.json
cat .rvfind/gq2-findings.json
```

**门禁语义**：

- 「当前 0 命中」的检查 = 硬断言 `toEqual([])`／`toBe(0)`：回归立刻变红；
- 「当前有已知命中」的检查 = 占比/绝对数上界（`BASELINE`，见 `gq1` 顶部与 `gq2` 中部）：
  课程库仍在增长，故 `gq1` 的上界用**占比**（扩量不误报），`gq2` 用绝对数（题型数量与课程数解耦）。
- `gq2` 的 `BASELINE.bothRightAsWrong` 等常数**下调即代表修复落地**；修好后请一并下调，避免门禁松于实际。

**已知的口径边界（不是缺陷）**：

- `rebuild` / `free_type` 的 `answer` 字段恒为空是模式约定（页面只读 `sentence`，见 `GrammarReviewPage.tsx:141/151`）；
- `choose` / `replace` / `spot` 的 `answer` 是「填进空位的词」，本就不是整句——`gq2` A-1 已排除；
- hunt 卡 id 由 `uid()` 生成（含随机数），而挖空位置以 `card.id` 为种子——`gq1` 已把 hunt 卡 id 归一化以保证可复现。
