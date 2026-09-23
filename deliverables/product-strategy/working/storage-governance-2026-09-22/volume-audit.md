# 存储体积精简专项 · 逐字段审计报告

日期：2026-09-22
范围：`Card` / `WordDetails` / `SentenceDetails` / `Review` / `Schedule` / `DiaryEntry` / `HuntAttempt` / `HuntResult` / `GateAttempt` / `RuneState` / `MistakeGeneration`
方法：`grep -rn` 穷举每个字段的**全部读取点**（排除写入点、类型声明、storage 归一化、测试），配合两个新增的量测测试。
约束遵守：**未修改 `src/` 下的任何产品代码**，只新增测试文件。

> ⚠️ 审计期间 `src/` 被并行修改过（`Review.diffJson` 在 19:48–19:50 之间被标记废弃、`reviewArchiveService.ts` 在 19:56 前后出现）。本报告的结论以 **2026-09-22 20:00 的仓库状态**为准，并在相关条目里明确标注「已落地 / 未落地」。

---

## 0. 结论速览

| # | 精简项 | 一年模型节省（SV3 口径） | 占一年总量 | 读取点 | 用户会失去什么 | 结论 |
|---|---|---|---|---|---|---|
| 1 | `Review.diffJson` | **1,882 KB** | **16.2%** | **0** | **没有任何损失**（可重算） | ✅ 可删（写入侧已停发；归一化未停发） |
| 2 | `WordDetails.synonyms` / `antonyms` / `confusedWords` | **314 KB** | 2.7% | **0 / 0 / 0** | 无（无 UI、无导入列、永远写空串） | ✅ 可删 |
| 3 | `SentenceDetails.translation` | **74 KB** | 0.6% | **0** | 无（= `card.back` 的第二份拷贝） | ✅ 可删 |
| 4 | `HuntAttempt.id` / `.tokenIndex` | 90 KB | — | 0 / 0 | 无（只做长度统计） | ✅ 可删 |
| 5 | `GateAttempt.id` / `.raw` / `.nodeId` / `.hintsUsed` / `.attemptIndex` | 244 KB | — | 0（全部） | 无（页面用组件内 state） | ✅ 可删 |
| 6 | `HuntResult.id` | 19 KB | — | **0** | 无 | ✅ 可删 |
| 7 | `RuneState.xp` / `.unlockedAt` | 4.5 KB | — | 0 / 0（UI 只用 `mastery`） | 无 | ✅ 可删 |
| 8 | `MistakeGeneration.prompt` | 每条 0.2 KB | — | **0** | 无（`settings` 已存同样信息） | ✅ 可删 |
| 9 | `Schedule.easeFactor/intervalDays/reviewCount/lapseCount` | 609 KB | 5.2% | 有 | 见 §5 —— **不可安全重算** | ❌ 需产品决策 |
| 10 | `Review.answer` | 385 KB | 9.2% | 有（错词本） | 看不到「我当时写的是什么」 | ❌ **不可删（真数据）** |

**确认可删项合计 ≈ 2,627 KB / 11,606 KB = 22.6%**（一年模型，SV3 富字符串口径）
按用户 lg1 基线（4.0M 字符/12 月、5.45M 字符/18 月 ⇒ ≈0.242M 字符/月）折算，**等价于把撞墙时间从 ~14 个月推后到约 ~17 个月**。

另外发现 2 条**结构性**问题（比字段级精简更重要，见 §6）：

- 🔴 `reviews` 数组**永不裁剪**，而唯一能压它的 `compactReviewHistory` 已实现却**零调用方**。
- 🔴 `Review.diffJson` 的摘除只做了一半：写入侧停发，但 `normalizeReview` 仍给**每一条**补 `"diffJson":"[]"`。

---

## 1. 逐字段对照表

图例：读取点数 = 排除写入点 / 类型声明 / storage 归一化 / 测试后的**真实消费者**数量。
「透传」= 那个读取点本身只是为了再写回去（归一化 / 迁移），**不是真实消费者**。

### 1.1 `Card`（5,110 张 / 2,498.8 KB / 占一年总量 22%）

| 字段 | SV3 体积 | 占比 | 读取点 | 删掉的代价 | 结论 |
|---|---|---|---|---|---|
| `front` | 209.6 KB | 8.4% | 多 | 内容本体，全站显示 | 不可删 |
| `back` | 139.7 KB | 5.6% | 多 | 释义 | 不可删 |
| `note` | 89.8 KB | 3.6% | 6（`exportService:35,65`、`LibraryPage:333,593,892,1761`、`grammarReviewService:372,385,453`） | 备注 / 来源锚点（语法复习的题面提示） | 不可删 |
| `sourceId` | 0.0 KB（该模型全空） | — | 12（`lessonService:233,268,293`、`diaryService:355`、`huntService:380`、`grammarWeakSpotsService:478`…） | 语法卡/日记卡/hunt 卡的来源追溯、弱点归因 | 不可删 |
| `unitId` | 199.6 KB | 8.0% | 多 | 词书归属 | 不可删 |
| `tags` | 159.7 KB | 6.4% | 多 | `tags.includes("语法")` 是语法复习队列的筛选条件 | 不可删 |
| `status` | 169.7 KB | 6.8% | 多 | 掌握度 / 暂停 | 不可删 |
| `priority` | 159.7 KB | 6.4% | 多 | 重点标记 | 不可删 |
| `createdAt` | 379.3 KB | 15.2% | 4（`LibraryPage:261`、`learningTelemetry:109,119,125,173`、`statsService:398`） | 周报「新词数」、最新卡排序、遥测 | 不可删 |
| `updatedAt` | 379.3 KB | 15.2% | 3（`syncService:59` **云同步冲突方向判定**、`statsService:262` 兜底、`LibraryPage:291`） | **云端同步会失去冲突判定依据** | 不可删 |
| `prioritySource` | ~0（可选，缺省不写） | — | 5（`LibraryPage:254,258,323,1072`、`reviewService:538,574`） | 手动星被算法误摘 | 不可删 |
| `suspendedFrom` | ~0（仅暂停时写） | — | 1（`cardService:539`） | 恢复暂停卡时还原不到原状态 | 不可删 |
| `masteredAt` | ~0（仅 mastered 时写） | — | 2（`statsService:262`、`reviewService:49`） | 周报「本周掌握数」会退回用 `updatedAt`（口径漂移） | 不可删 |
| `mistakeGraduatedAt` | ~0 | — | 1（`MistakeBookPage:1243`） | 错词本「已毕业」标记失效 | 不可删 |

**结论：`Card` 里没有可删字段。** 两个最大的时间戳字段各有真实消费者（`createdAt` 供统计、`updatedAt` 供云同步），删除会造成功能损失。

### 1.2 `WordDetails`（3,650 条 / 2,660.3 KB / 23%）

| 字段 | SV3 体积 | 占比 | 读取点 | 删掉的代价 | 结论 |
|---|---|---|---|---|---|
| `sourceSentence` | 648.7 KB | 24.4% | 9（`ReviewPage:441,497`、`LibraryPage:337,613,623,862,927,1133`、`SpellingPage:756`、`WordsPage:687`、`exportService:52`） | 复习页例句、材料自动关联（三处 probes）、导出 | 不可删 |
| `englishDefinition` | 377.8 KB | 14.2% | 4（`LibraryPage:1108,1112`、`ReviewPage:495`、`WordsPage:509`） | 用户填的英文释义 | 不可删 |
| `collocations` | 263.8 KB | 9.9% | 5（`LibraryPage:1108,1113`、`ReviewPage:496`、`SpellingPage:755`、`WordsPage:516`、`exportService:51`） | 搭配 | 不可删 |
| `chineseDefinition` | 228.1 KB | 8.6% | 4（`dictionaryService:121`、`MistakeBookPage:122,448,576,1264`、`cardService:193`） | 错词本释义回退源 | 不可删（但与 `card.back` 重复，见 §4） |
| `partOfSpeech` | 171.1 KB | 6.4% | 8 | 词性 | 不可删 |
| `phonetic` | 164.0 KB | 6.2% | 11 | 音标 | 不可删 |
| `word` | 142.6 KB | 5.4% | 12（`dictionaryService:117,194`、`WordsPage:87,110`、`UnitsPage:285,313`、`ImportPage:56`、`importService:300`、`cardService:186`…） | 去重判定、词典搜索 | 不可删（但与 `card.front` 重复） |
| `cardId` | 121.2 KB | 4.6% | 多 | 外键 | 不可删 |
| **`synonyms`** | **92.7 KB** | **3.5%** | **0** | **无** | ✅ **可删** |
| **`antonyms`** | **92.7 KB** | **3.5%** | **0** | **无** | ✅ **可删** |
| **`confusedWords`** | **128.3 KB** | **4.8%** | **0** | **无** | ✅ **可删** |
| `audioUrl` | 92.7 KB | 3.5% | 8（`LibraryPage:1047,1720`、`SpellingPage:266,280,794,803`、`WordsPage:634`、`SentencesPage:160,168`） | 真人发音播放 | 不可删 |

**三个零读取字段的证据（穷举）：**

```
$ grep -rn "synonyms|antonyms|confusedWords" src/ --include="*.ts" --include="*.tsx" \
    | grep -v "\.test\." | grep -v "src/edge/" | grep -v "storage.ts" | grep -v "types.ts"
src/services/cardService.ts:265:    synonyms: "",
src/services/cardService.ts:266:    antonyms: "",
src/services/cardService.ts:267:    confusedWords: "",
```

全部命中都是**写入点**（`createWordInput` 造 `WordDetails` 时写空串）：

| 位置 | 性质 |
|---|---|
| `src/types.ts:72-74` | 类型声明 |
| `src/services/storage.ts:381-383` | **归一化透传**（不是消费者） |
| `src/services/storage.ts:427-429` | 归一化时补空串（`fillMissingDetails`，**写入**） |
| `src/services/storage.ts:1107-1109` | 内置核心词种卡（**写入空串**） |
| `src/services/cardService.ts:265-267` | 建卡（**写入空串**） |
| `src/edge/verify/mg9-field-survival.test.ts` 等 | 测试 |

**关键加成**：这三个字段既**没有 UI 输入框**（`WordsPage.tsx` 的高级字段只有「英文解释 / 搭配 / 备注」），也**没有导入列**（`importService.ts:235-260` 的列映射表里没有它们）。事实上永远写 `""`。所以 314 KB 的节省**全部来自键名开销**（`"synonyms":"",` = 13 字符、`"antonyms":"",` = 13、`"confusedWords":"",` = 18，合计 44 字符/条 × 3,650 条 = 160,600 字符 = 157 KB 字符口径 / 314 KB UTF-16）。

> 风险：极低。唯一理论风险是「历史备份里有值」——`normalizeWordDetails` 会读进来。但没有任何 UI 能显示或编辑它们，所以**即使有值也是死数据**。若要求绝对保守，可只停止写入、归一化时仍保留旧值（一次迁移即可清空，因为新写入不再产生）。

### 1.3 `SentenceDetails`（1,460 条 / 606.5 KB / 5%）

| 字段 | 体积 | 占比 | 读取点 | 删掉的代价 | 结论 |
|---|---|---|---|---|---|
| `grammarNote` | 176.8 KB | 29.2% | 7（`GrammarReviewPage:109` 解析 `[tag]`、`LibraryPage:338,1124,1128`、`ReviewPage:501`、`grammarReviewService:372`、`grammarWeakSpotsService:423`、`huntService:382`） | 弱点归因、找错卡的罪名讲解、复习页语法提示 | 不可删 |
| `sentence` | 151.1 KB | 24.9% | 3（`LibraryPage:613,623,927` 三处材料关联 probes） | 材料 ↔ 句子卡自动关联会少一条判据（仍可用 `card.front` 兜底） | 不可删（但与 `card.front` 完全重复，见 §4） |
| `keywords` | 85.5 KB | 14.1% | 5（`SentencesPage:163,165`、`LibraryPage:339,1118,1120`、`ReviewPage:498`、`exportService:64`） | 关键词标签 | 不可删 |
| **`translation`** | **74.1 KB** | **12.2%** | **0** | **无** | ✅ **可删** |
| `cardId` | 48.5 KB | 8.0% | 多 | 外键 | 不可删 |
| `audioUrl` | 37.1 KB | 6.1% | 4（`SentencesPage:160,168,176,187`、`LibraryPage:1047,1720`） | 句卡真人发音 | 不可删 |

**`translation` 零读取的证据：**

```
$ grep -rn "sentenceDetails?\.translation\|sentenceDetails\.translation\|details\.translation" src/ --include="*.ts" --include="*.tsx"
（除 storage.ts:403 归一化外，无输出）
```

`storage.ts:403` 的 `translation: asString(value.translation) || card?.back || ""` 是**归一化透传**（不是消费者），并且它自己就承认了「这个值与 `card.back` 同源」——`card?.back` 就是它的回退值。

写入侧 `cardService.ts:444-449` 同时写两份：
```ts
const card: Card = { ... back: input.translation, ... };
const details: SentenceDetails = { cardId: id, sentence, translation: input.translation, ... };
```
即**同一字符串存两遍**。

### 1.4 `Review`（10,950 条 / 4,199.8 KB / 36% —— 最大单项）

| 字段 | 体积 | 占比 | 单条 | 读取点 | 删掉的代价 | 结论 |
|---|---|---|---|---|---|---|
| **`diffJson`** | **1,882.0 KB** | **44.8%** | 88 字节 | **0** | **无**（可重算，见 §3） | ✅ **可删 / 已半落地** |
| `reviewedAt` | 834.1 KB | 19.9% | 39 字节 | 多（`statsService:275,309,386,407`、`computeStreak:549`、`mistakeBookService:100,110,123`、`libraryPage:672`…） | 连胜 / 日历 / 错词本按日分组全部失效 | 不可删 |
| `id` | 406.3 KB | 9.7% | 19 字节 | 3（`TodayPage:232`、`LibraryPage:1951` **React key**、`reviewService:452` 撤销） | `key` 退化为索引会引发列表复用 bug；撤销失效 | 不可删 |
| **`answer`** | **385.0 KB** | **9.2%** | 18 字节 | 4（`mistakeBookService:97,99,104`、`MistakeBookPage:125,577,1236`） | **看不到「我当时写的答案」**，字母级差异对照（`compareLetters`）也失去输入 | ❌ **不可删（真数据）** |
| `cardId` | 363.6 KB | 8.7% | 17 字节 | 多 | 外键 | 不可删 |
| `mode` | 363.6 KB | 8.7% | 17 字节 | 8（`statsService:283,310,387,420`、`dynamicBookService:35`、`grammarReviewService:507`、`unitService:36`、`reviewRating:18`） | 「拼写正确率」等分模式统计失效 | 不可删 |
| `rating` | 213.9 KB | 5.1% | 10 字节 | 多（`reviewRating.ts:23,33` 是唯一权威） | 掌握判定、错词判定全失效 | 不可删 |

**`answer` 不可删的完整证据链**（这是本次审计最重要的「不可删」结论）：

1. 写入：`reviewService.ts:531` `answer`（用户当场输入；`SpellingPage.tsx:429` 传 `currentAnswer`、`ReviewPage.tsx:169` 传 `answer`）。
2. 消费：`mistakeBookService.ts:97` `attempts: [{ review, answer: review.answer.trim() || "未填写" }]`；`:99` `answers: review.answer.trim() ? [review.answer.trim()] : ["未填写"]`；`:104` `const answer = review.answer.trim() || "未填写"`。
3. 展示：`MistakeBookPage.tsx:1234-1236`
   ```ts
   const primaryWrongAnswer = getPrimaryWrongAnswer(entry);
   const hasTypedWrongAnswer = Boolean(primaryWrongAnswer && primaryWrongAnswer !== "未填写");
   const diffTokens = hasTypedWrongAnswer ? compareLetters(entry.card.front, primaryWrongAnswer) : [];
   ```
   → 错词本「拼写差异对照」卡的**输入就是 `review.answer`**。
4. 无副本：全库没有任何其它字段保存用户输入（`grep` 全部写入点只有 `reviewService.ts:531`）。

**踩坑提醒**：`review.answer` 里混有**非用户输入**。`GrammarReviewPage.tsx:98` 传的是 `task.sentence`——**正确答案本身**：
```ts
let next = applyReview(latest, current.card, reviewModeForTask(task), rating, task.sentence);
```
这是已知的历史缺陷（`lessonService.ts:244` 的注释记录了同款问题的另一半）。它意味着：**按 mode 过滤不能安全地区分「真用户输入」与「答案键」**（`ReviewPage` 也用 `cloze`/`recall` 模式写真实输入）。因此不能靠「只删某些 mode 的 answer」来精简——见 §5 的产品决策项。

### 1.5 `Schedule`（5,110 条 / 1,296.7 KB / 11%）

| 字段 | 体积 | 占比 | 读取点 | 删掉的代价 | 结论 |
|---|---|---|---|---|---|
| `nextReviewAt` | 409.2 KB | 31.6% | 18+（`reviewService:115,129,275,496`、`spellingQueueService:84-92`、`dailyDirectiveService:150,166,198`、`grammarReviewService:79,84`、`statsService:447,649`、`EntryPage:9`、`unitService:44,71`…） | 到期队列、今日计划、复习预测 | 不可删 |
| `cardId` | 169.7 KB | 13.1% | 多 | 外键 | 不可删（但见 §4 规范化机会） |
| `easeFactor` | 159.7 KB | 12.3% | 2（`reviewService:491`、`storage:931`） | 见 §5 —— 间隔递推失真 | ❌ 需产品决策 |
| `intervalDays` | 159.7 KB | 12.3% | 6（`reviewService:494,516,521`、`grammarWeakSpotsService:502`、`statsService:725`、`grammarReviewService:59`） | 同上 | ❌ 需产品决策 |
| `reviewCount` | 149.7 KB | 11.5% | 6（`reviewService:550,557`、`grammarReviewService:59,155,157,209,375,401,443`） | 题型轮换（cloze/rebuild/free_type）与掌握判定 | ❌ 需产品决策 |
| `lapseCount` | 139.7 KB | 10.8% | 8（`reviewService:354,364,495,538,568`、`statsService:432,439`、`grammarReviewService:59,82`） | 弱项排序、`priority` 自动置位 | ❌ 需产品决策 |

### 1.6 `DiaryEntry`（365 条 / 343.4 KB，本模型 1 条/天；用户的模型 3 条/天 ⇒ ≈1,030 KB）

| 字段 | 体积（1/天） | 占比 | 读取点 | 删掉的代价 | 结论 |
|---|---|---|---|---|---|
| `issues` | 87.7 KB | 25.5% | 5（`GrammarDiaryPage:197,205,221,230,234`、`diaryService:350` 判空、`grammarWeakSpotsService:356` 归因） | AI 批改的逐条问题（含 `tag` 归因） | 不可删 |
| `correctedEn` | 67.0 KB | 19.5% | 3（`diaryService:350`、`GrammarDiaryPage:318,394,488`） | 批改后的句子、日记卡正面 | 不可删 |
| `answerEn` | 60.6 KB | 17.6% | 4（`diaryService:141,350`、`GrammarDiaryPage:187,318,487`） | **用户写的原句**；也是问题判空与卡片去重的依据 | 不可删（与日记卡 `front` 重复，但**日记条目先于卡片存在**，是主副本） |
| `createdAt` | 27.1 KB | 7.9% | 2（`diaryService:91,107`） | 排序 / 去重窗口 | 不可删 |
| `followUp` | 22.1 KB | 6.4% | 2（`GrammarDiaryPage:412`、`storage:787`） | 「再多说一句」的追问 | 不可删 |
| `questionZh` | 20.7 KB | 6.0% | 1（`GrammarDiaryPage:486`） | 题面文字（题库在 `diaryQuestions.ts`，理论上可由 `questionId` 查回） | ⚠️ 可重算（小） |
| `dateKey` | 15.7 KB | 4.6% | 5（`diaryService:111,125,130,145`、`GrammarDiaryPage:482`） | 按日分组 | 不可删 |
| `questionId` | 12.1 KB | 3.5% | 3（`diaryService:92,93,145`、`storage:790`） | 题库索引 / 同日去重 | 不可删 |
| `status` | 10.7 KB | 3.1% | 1（`GrammarDiaryPage:484,488`） | 「已批改 / 待批改」标记 | 不可删 |
| `id` | 7.1 KB | 2.1% | 1（`grammarWeakSpotsService:355` 由事件回指） | 弱点归因来源 | 不可删 |
| `note` | ~0 | — | 1（`GrammarDiaryPage:498`） | 批改失败原因展示 | 不可删 |

### 1.7 `HuntAttempt`（按 3 次点选/天 ⇒ 1,095 条/年，单条 294 字节）

| 字段 | 单条开销 | 读取点 | 删掉的代价 | 结论 |
|---|---|---|---|---|
| `hit` | 23 字符 | 1（`huntService:450` `hitCount`） | 找错进度「命中数」 | 不可删 |
| `guessedTag` | 27 字符 | 2（`huntService:451,453` `tagStats`） | 罪名命中/误判统计表 | 不可删 |
| `caseId` | 27 字符 | 0 直接（但为结构必需，与 `huntCases` 关联） | — | 保留 |
| **`id`** | **23 字符** | **0** | **无**（无渲染、无 key、无撤销） | ✅ **可删** |
| **`tokenIndex`** | **31 字符** | **0**（`attempt.tokenIndex` 全库无命中；`huntService` 里的 `tokenIndex` 都是 `HuntError` 的） | **无** | ✅ **可删** |
| **`createdAt`** | 31 字符 | **0** | 无 | ✅ 可删 |

**注意**：`tagStats` / `guessCount` 这两个 `summarizeHuntProgress` 的产出**自身也没有 UI 消费者**——
```
$ grep -rn "tagStats\|guessCount" src/ --include="*.ts" --include="*.tsx"
（除 huntService.ts 定义与测试外，无页面引用）
```
`GrammarHuntPage.tsx` 只用 `summary.solvedCaseIds` / `.totalMisses` / `.hitCount` / `.totalCases`（`:46,400,404,408`）。
→ 这意味着 `HuntAttempt` 整张表**只为了「命中数」一个数字而在永久增长**。这是产品决策项，见 §5。

### 1.8 `HuntResult`（按 1 案/天 ⇒ 365 条/年，单条 318 字节）

| 字段 | 读取点 | 删掉的代价 | 结论 |
|---|---|---|---|
| `caseId` | 1（`huntService:441` 破案判定） | 「已破案 N / 共 M」失效 | 不可删 |
| `found` | 2（`huntService:441`、`GrammarHuntPage:268`） | 破案判定 | 不可删 |
| `misses` | 2（`huntService:465` 累计误判、`GrammarHuntPage:270`） | 「累计误判」 | 不可删 |
| **`id`** | **0** | **无**（只在结算弹窗用 `settledResult`，那是内存态） | ✅ **可删** |
| `stars` | 1（`GrammarHuntPage:271` → 结算弹窗） | 结算星级展示 | 不可删（但可重算，见 §3） |
| `durationMs` | 1（`GrammarHuntPage:272,718` → 结算弹窗） | 「用时」展示 | 不可删 |
| `total` | 1（`GrammarHuntPage:269`） | 结算展示 | 不可删（可重算） |
| `finishedAt` | **0**（`result.finishedAt` 全库无命中） | **无** | ✅ 可删 |

⚠️ 注意 `stars` / `durationMs` / `total` / `finishedAt` 的**唯一读取点全是结算弹窗的瞬时内存值**（`settledResult` state），而持久化的 `huntResults` 数组**只被读了 `caseId`/`found`/`misses`**。所以严格说：持久化侧的 `stars`/`durationMs`/`total`/`finishedAt`/`id` 都是零读取。
这一条同时适用于 `tokenIndex`（`HuntAttempt`）——需要区分「内存态被读」与「持久化值被读」。

### 1.9 `GateAttempt`（按 3 次/天 ⇒ 1,095 条/年，单条 568 字节 —— 低频实体里最大）

| 字段 | 单条开销 | 读取点 | 删掉的代价 | 结论 |
|---|---|---|---|---|
| `gateId` | 27 字符 | 3（`languageGateService:712,716`、`AdventureWorldsPage:25,27,71`） | 世界地图关卡点亮 | 不可删 |
| `topicId` | 27 字符 | 1（`runeService:44` NPC 记忆） | 分主题记忆 | 不可删 |
| `verdict` | 27 字符 | 2（`languageGateService:712`、`runeService:17`） | 符文熟练度推进 | 不可删 |
| `errorTags` | 30 字符 | 1（`runeService:45`） | NPC 记忆的「被记得的错处」 | 不可删 |
| **`raw`** | **24 字符** | **0**（`attempt.raw` 全库仅 `languageGateService:696` **写入**） | **无** | ✅ **可删** |
| **`nodeId`** | **27 字符** | **0** | **无**（值本身是写死的 `gate-node-${gateIndex+1}`，不指向真实节点） | ✅ **可删** |
| **`adventureId`** | 27 字符 | **0** | 无（页面注释明写「P0 不依赖 adventureId」`GatePlayPage.tsx:31`） | ✅ 可删 |
| **`id`** | **23 字符** | **0** | 无 | ✅ **可删** |
| **`hintsUsed`** | **30 字符** | **0** | 无（页面用组件内 `useState`，`GatePlayPage:104`） | ✅ **可删** |
| **`attemptIndex`** | **33 字符** | **0** | 无（同上，`GatePlayPage:105`） | ✅ **可删** |
| **`createdAt`** | 31 字符 | **0** | 无 | ✅ 可删 |

**`countGateAttempts` 是死函数**：`languageGateService.ts:715` 定义，**唯一命中是 `GatePlayPage.tsx:15` 的 import**，函数体从未被调用。`recallTopicMemory`（`runeService.ts:43`）同样**零调用方**——NPC 记忆（PRD §6.2）尚未接线。

### 1.10 `RuneState`（约 50 个符文）

| 字段 | 单条开销 | 读取点 | 删掉的代价 | 结论 |
|---|---|---|---|---|
| `runeId` | 23 字符 | 1（`runeService:23`） | 符文识别 | 不可删 |
| `mastery` | 27 字符 | 2（`runeService:23,31`、`AdventureWorldsPage:32`） | 「符文 N / 50」计数 | 不可删 |
| **`xp`** | **23 字符** | **1，但是自增**（`runeService:32` `xp: current.xp + …`） | **无**（UI 从不读取绝对值；`AdventureWorldsPage` 只看 `mastery !== "unseen"`） | ⚠️ **可删**（见下方口径提示） |
| **`unlockedAt`** | **31 字符** | **0** | 无 | ✅ **可删** |

> 口径提示：`xp` 是「**为了再写回去**」的读取点（读旧值 +1 写回），不是真实消费者。
> 唯一写入者是 `chargeRuneForVerdict`，唯一读取者是它自己。删除它不影响任何用户可见内容。

### 1.11 `MistakeGeneration`（按 1 条故事/天估算，单条 7.1 KB）

| 字段 | 单条 | 占比 | 读取点 | 删掉的代价 | 结论 |
|---|---|---|---|---|---|
| `story` | 3.0 KB | 41.9% | 多（`MistakeBookPage:653,710,714-798`） | 结构化故事的正文、翻译、覆盖度、词汇提示 | 不可删（但内部有冗余，见下） |
| `wordSnapshots` | 1.8 KB | 24.7% | 4（`MistakeBookPage:216,654,716,723,823,872`） | 单词弹窗的「常见错写」、故事词表 | 不可删（但 `wrongAnswers` 是 `review.answer` 的拷贝） |
| `content` | 1.4 KB | 20.4% | 3（`MistakeBookPage:711,919,927`） | 「复制内容」按钮、折叠预览、非结构化故事的正文 | 不可删 |
| `settings` | 0.2 KB | 2.5% | 5（`MistakeBookPage:725-729`） | 生成参数的展示 chips | 不可删 |
| **`prompt`** | **0.2 KB** | **2.4%** | **0** | **无** | ✅ **可删** |
| `cardIds` | 0.2 KB | 2.3% | 4（`MistakeBookPage:468,716,719,910`） | 重练 URL、词数展示 | 不可删（但见 §4） |
| `coverage` | 0.1 KB | 2.0% | 3（`MistakeBookPage:717,718,719`） | 覆盖度 chips、重练 ID 回退 | 不可删（但可重算） |
| `createdAt` / `id` / `dateKey` / `title` / `type` | 各 ≤0.1 KB | ≤1% | 均有 | 排序 / 识别 | 不可删 |

**`prompt` 零读取的证据：**
```
$ grep -rn "generation\.prompt\|\.prompt\b" src/pages/MistakeBookPage.tsx src/services/  → 只有写入
src/services/mistakeBookService.ts:248:    prompt: input.prompt,      ← 写入
src/services/storage.ts:645:    prompt: asString(value.prompt),  ← 归一化透传
```
它存的是 `buildStructuredMistakeStoryPrompt(input)` 的结果（`MistakeBookPage.tsx:531,565`），
而 `settings` 字段已完整保存同一份信息（`level/scene/length/tone/bilingual`）——**可重建**。

**条目级冗余（不只是字段）**：
- `story.englishStory`（1.4 KB）**被 `content` 完整包含**（`MistakeBookPage.tsx:549` 把 `storyResult.englishStory` 拼进 `content`）→ 同一段英文存两份。
- `story.chineseTranslation` 同样被 `content` 包含（`:550`）。
- `story.missingWords` / `usedWords` 被 `content` 的「已使用词汇 / 未写入词汇」行包含（`:552-553`）。
- `coverage.usedCardIds` / `missingCardIds` 可由 `cardIds` + `story.usedWords` 推出（`MistakeBookPage:540-545` 就是这么算出来的）。
- `wordSnapshots[].wrongAnswers` 是 `entry.answers` 的拷贝，而 `entry.answers` 来自 `review.answer`（`MistakeBookPage:125` → `:577`）→ 第三次存储。

---

## 2. 「一年模型」下的每项节省

### 2.1 基线

| 口径 | 总量 | 说明 |
|---|---|---|
| **SV3（本报告量测）** | 六个数组合计 **11,606 KB = 11.33 MB** | 长字符串填成真实用户形态（`sourceSentence` 45B、`englishDefinition` 26B、`grammarNote`、日记 `issues`…） |
| **lg1（用户实测）** | 12 月 **4.0M 字符**（≈4.0MB payload）、18 月 5.45M 字符写不下 | 占位串（`"释义"` / `"def"` / `"[]"`）；换算率 ≈ **0.242M 字符/月** |

SV3 比 lg1 富约 1.45×（5.80M 字符 vs 4.0M）。**下面同时给两个口径**，并明确标注每个数字属于哪一个。

### 2.2 各实体占比（SV3）

| 实体 | 条数 | 体积 | 占比 | 单条 |
|---|---|---|---|---|
| `reviews` | 10,950 | 4,199.8 KB | **36%** | 392 B |
| `wordDetails` | 3,650 | 2,660.3 KB | 23% | 747 B |
| `cards` | 5,110 | 2,498.8 KB | 22% | 501 B |
| `schedules` | 5,110 | 1,296.7 KB | 11% | 260 B |
| `sentenceDetails` | 1,460 | 606.5 KB | 5% | 425 B |
| `diaryEntries` | 365 | 343.4 KB | 3% | 964 B |
| **合计** | | **11,605.5 KB** | 100% | |

> 与用户提供的一年构成（reviews 37% / cards 25% / wordDetails 21% / schedules 17%）基本吻合；差异来自 SV3 的 `wordDetails` 更富、`schedules` 更轻。

### 2.3 逐项节省

| 精简项 | SV3 节省 | 占 SV3 总量 | 换算到 lg1 基线（÷1.45） | 等价月数（÷0.242M 字符） |
|---|---|---|---|---|
| `Review.diffJson`（完全停发） | **1,882 KB** | **16.2%** | **≈1,297 KB** | **≈3.3 个月** |
| ├ 其中「写入侧已停发」的部分 | 406 KB | 3.5% | ≈280 KB | ≈0.7 个月 |
| ├ 其中「归一化仍补 `"[]"`」的残值 | 278 KB | 2.4% | ≈192 KB | ≈0.5 个月 |
| └ 其中「历史真实 diffJson」的存量 | 1,198 KB | 10.3% | ≈826 KB | ≈2.1 个月 |
| `WordDetails.synonyms`+`antonyms`+`confusedWords` | **314 KB** | 2.7% | ≈217 KB | ≈0.6 个月 |
| `SentenceDetails.translation` | **74 KB** | 0.6% | ≈51 KB | ≈0.1 个月 |
| `HuntAttempt.id`+`tokenIndex`+`createdAt` | 90 KB | 0.8% | ≈62 KB | ≈0.2 个月 |
| `GateAttempt` 六字段（id/raw/nodeId/adventureId/hintsUsed/attemptIndex/createdAt） | 244 KB | 2.1% | ≈168 KB | ≈0.4 个月 |
| `HuntResult.id`+`finishedAt`+`stars`+`durationMs`+`total`（持久化侧） | 32 KB | 0.3% | ≈22 KB | ≈0.1 个月 |
| `RuneState.xp`+`unlockedAt` | 4.5 KB | 0.04% | ≈3 KB | ≈0.01 个月 |
| `MistakeGeneration.prompt`（365 条/年） | 73 KB | 0.6% | ≈50 KB | ≈0.1 个月 |
| **确认可删合计** | **≈2,713 KB** | **≈23.4%** | **≈1,870 KB** | **≈4.7 个月** |

**撞墙点推后**：lg1 实测断点在 14～18 个月之间。节省 4.7 个月 ⇒ **从 ~14 个月推后到 ~18 个月**。
（若只做最高价值的一项 `diffJson`：推后约 3 个月 → ~17 个月。）

### 2.4 用**用户自己的实测值**独立换算（避免模型差异）

用户给出：单条 review 215 B，其中 `answer` 25 B + `diffJson` 42 B。

```
diffJson: 42 B = 21 字符 → 10,950 条 = 229,950 字符 = 449 KB
          占 lg1 一年总量（4.0M 字符）的 5.5%
          ⇒ 449 KB / 2 = 224,550 字符 ÷ 242,000 字符/月 ≈ 0.93 个月（约 28 天）
```
即：**只删 `diffJson` 一项，按你自己的实测就是约 1 个月寿命**。与 SV3 口径的 3.3 个月差异，来自 SV3 用了更长的 diff 内容（63 字符 vs 21 字符）。**建议以 0.9～3.3 个月为区间，取 1 个月作为保守承诺。**

---

## 3. 长字符串字段：可重算 vs 不可重算

### 3.1 可重算（删了能算回来 —— 纯冗余）

| 字段 | 重算方式 | 入参是否仍在存储里 | 验证 |
|---|---|---|---|
| `Review.diffJson` | `compareText(expected, answer, strictPunctuation)`（`diffService.ts:207`） | ✅ `expected` 由 `card.front`/`card.back` 决定、`answer` 就在 `review.answer` | **SV3 实测**：`compareText("approach","aproach")` 输出 `[{"token":"aproach","expected":"approach","status":"spelling"}]`，与设备上存的 63 字符**逐字节一致** |
| `HuntResult.stars` | `computeStars(misses)`（`huntService.ts:200`：`≤0→3 / ≤2→2 / else→1`） | ✅ `misses` 仍存 | 代码即公式 |
| `HuntResult.found` / `total` | `= HuntCase.errors.length`（案件库在 `src/data/huntCases.ts`） | ✅ 内置数据 | `buildHuntResult` 自己就是这么写的（`huntService.ts:245-246`） |
| `MistakeGeneration.coverage.usedCardIds` / `missingCardIds` | 由 `cardIds` + `story.usedWords` 反查（`MistakeBookPage:540-545` 的原始算法） | ✅ 三者都存 | 生成时就是这么算的 |
| `MistakeGeneration.prompt` | 由 `settings` + 词表重建（`buildStructuredMistakeStoryPrompt`） | ✅ `settings` 完整保存了同样的参数 | 生成时就是这么算的 |
| `DiaryEntry.questionZh` | 由 `questionId` 查 `src/data/diaryQuestions.ts` | ✅ `questionId` 仍存 | 题库是内置常量 |
| `Review.answer` **（仅 GrammarReviewPage 写入的那些）** | `= card.front`（`GrammarReviewPage.tsx:98` 传 `task.sentence`） | ✅ | ⚠️ 但**无法按 mode 安全区分**（`ReviewPage` 也用 cloze/recall 写真实输入）→ 不作为精简项 |

### 3.2 不可重算（真数据 —— 不能删）

| 字段 | 为什么不可重算 |
|---|---|
| `Review.answer`（拼写页 / 通用复习页写入的） | **用户输入的唯一副本**。错词本用它展示「你当时写的答案」并据此做字母级差异对照（`mistakeBookService.ts:97`、`MistakeBookPage.tsx:1236`）。删了永久失去「我当时错成了什么样」 |
| `Review.reviewedAt` | 事件发生时间，无法事后推算（`Date.now()` 在写入时就丢了）。连胜 / 学习日历 / 周报环比 / 错词本按日分组全靠它 |
| `Card.front` / `back` / `note` | 用户内容本体 |
| `Card.createdAt` | 事件时间（周报「新词数」`statsService:398`） |
| `Card.updatedAt` | **云同步冲突方向判定**（`syncService.ts:45-62` 取全库最大 `updatedAt` 与远端比较） |
| `Card.masteredAt` | 进入掌握的时刻（周报「本周掌握数」`statsService:262`）；用 `updatedAt` 兜底会因编辑而漂移 |
| `Card.mistakeGraduatedAt` | 毕业时刻，用于与 `latestWrongAt` 比较 |
| `WordDetails.phonetic` / `partOfSpeech` / `englishDefinition` / `collocations` / `sourceSentence` | 词典数据 + 用户填写，不可推导 |
| `WordDetails.chineseDefinition` | 同上（与 `card.back` 重复，见 §4） |
| `WordDetails.audioUrl` | 外部音频 URL（用户上传的真人发音，无法重新生成） |
| `SentenceDetails.grammarNote` | 含 `[tag:原错词]` 归因标记，是 hunt 卡罪名的唯一持久化位置 |
| `SentenceDetails.keywords` | 用户填写 |
| `SentenceDetails.audioUrl` | 同 `wordDetails.audioUrl` |
| `DiaryEntry.answerEn` / `correctedEn` / `issues` / `followUp` / `note` | 用户写作 + AI 批改产物（重跑模型会得到不同结果） |
| `MistakeGeneration.content` / `story` / `wordSnapshots` | AI 生成产物，重生成会变 |
| `Schedule.nextReviewAt` | 由 `Date.now()` 递推，不是纯函数（且 `grammarWeakSpotsService:515` 会人为改写） |
| `HuntResult.durationMs` | 实测耗时，不可回算 |
| `HuntAttempt.hit` / `guessedTag` | 用户每次点选的结果（动作已完成，不可重放） |
| `GateAttempt.verdict` / `errorTags` / `topicId` | 用户作答的判定结果 |

### 3.3 ⚠️ 伪「可重算」：`Schedule` 的四个数值字段

**表面上**，`easeFactor` / `intervalDays` / `reviewCount` / `lapseCount` 都是 SM-2 确定性递推的结果，
看起来可以从 `review` 序列完整重放出来（`reviewService.ts:500-523` 是纯算术）。
**实际上不能安全重算**，三个理由：

1. **存在非 review 的写入者**：`grammarWeakSpotsService.scheduleCardsForToday`（`:491-520`）会把
   `intervalDays` 直接抬到 1，这不来自任何 `review`——重放会得到错误值。
2. **算法在历史上变过**：`reviewService.ts:509-517`（R09）对「语法句子卡 + rating 3」用了**不同分支**
   （`intervalDays` 维持原样、不乘 `easeFactor`）。这个分支依赖**当时**的 `card.tags`，
   而 tags 可以被后续编辑、修复脚本（`lessonService.repairDiaryCardTags`）改动。
   用今天的 tags 重放历史会得到**与存储值不同**的结果。
3. **自愈语义丢失**：`clampIntervalDays`（上限 3,650 天）会把存量的异常值（旧版本写过的 `1e9`）
   在**下一次复习时**拉回。重放只能生成异常值本身，拿不到「已被夹过」的当前值。

⇒ **结论：`Schedule` 的数值字段属于「需产品决策」，不是「确认可删」。** 收益（609 KB / 5.2%）不值这个风险。

---

## 4. 重复存储清单

| # | 重复关系 | SV3 体积 | 条数 | 说明 |
|---|---|---|---|---|
| 1 | `wordDetails.chineseDefinition` ←→ `cards.back` | **228.1 KB** | 3,650 | `cardService.ts:262`（`chineseDefinition`）与 `:247`（`back`）都写 `input.translation`；`storage.ts:378` 归一化时以 `card?.back` 作为回退值——文件自己承认同源 |
| 2 | `schedules.cardId` ←→ `cards.id` | **169.7 KB** | 5,110 | 一对一外键（`normalizeSchedules` 强制一对一），规范化存成 `Map` 可省 |
| 3 | `sentenceDetails.sentence` ←→ `cards.front` | **151.1 KB** | 1,460 | `cardService.ts:433`（`card.front`）与 `:445`（`details.sentence`）同一次调用写两份；`storage.ts:402` 用 `card?.front` 作回退 |
| 4 | `wordDetails.word` ←→ `cards.front` | **142.6 KB** | 3,650 | `storage.ts:375,421` 用 `card.front.trim().toLowerCase()` 生成；仅作去重/检索键 |
| 5 | `cards.id` ←→ `schedules.cardId` | 129.7 KB | 5,110 | 同一标识符两处各存一遍（与外键合并视为一项规范化收益） |
| 6 | `sentenceDetails.translation` ←→ `cards.back` | **74.1 KB** | 1,460 | `cardService.ts:446`（`details.translation`）与 `:434`（`card.back`）同值；**零读取**，见 §1.3 |
| 7 | `diaryEntries.answerEn` ←→ 日记卡 `front` | **60.6 KB** | 365（本模型 1/天） | `diaryService.ts:350` `meaningfulText(entry.correctedEn || entry.answerEn)` → `:359` 成为卡片正面。**但日记条目是主副本**（卡片只在 `issues.length > 0` 时创建）→ 这张卡不能删 |
| 8 | `diaryEntries.questionZh` ←→ 题库 `diaryQuestions.ts` | 20.7 KB | 365 | 可重算（由 `questionId` 查回） |
| 9 | `mistakeGenerations.story.englishStory` ⊂ `content` | 1.4 KB/条 | — | `MistakeBookPage:549` 把 story 正文拼进 `content`，同一段英文存两份 |
| 10 | `mistakeGenerations.story.chineseTranslation` ⊂ `content` | 0.7 KB/条 | — | 同上（`:550`） |
| 11 | `mistakeGenerations.wordSnapshots[].wrongAnswers` ←→ `review.answer` | 0.5 KB/条 | — | `MistakeBookPage:125` 派生 → `:577` 再存一份（第三次存储） |

**内联重复小计**（#1+#3+#4+#6）：**596.0 KB**，占 SV3 一年总量 5.1%。
**跨表重复小计**（#2+#5）：299.4 KB，占 2.6%。
**规范化总计**：≈895 KB（7.7%），但需要改数据模型（编号 2/5）或改变「详情表自带文本」的设计（#1/#3/#4/#6）——**属于产品决策范围**。

> 简化建议（若采纳）：`wordDetails` / `sentenceDetails` 的文本字段可以只保留**卡片上没有的**部分。
> `storage.ts:375,378,402,403` 的归一化已经实现了「缺失时回退 `card`」，
> 所以**读侧不需要改造**——把值留空即可，回退逻辑会自动补上。

---

## 5. 用户可见功能的代价评估（关键）

### 5.1 删了就**没有**任何损失（确认可删）

| 项 | 用户会失去什么 |
|---|---|
| `Review.diffJson` | **什么都不失去。** 它存的 `compareText(...)` 结果可由 `card.front` + `review.answer` 现场重算（SV3 已逐字节验证）。`DiffToken` 的消费组件（`DiffView.tsx`）的输入从来不来自持久化——`ReviewPage.tsx:162` 当场算，`SpellingPage.tsx:402` 也当场算 |
| `WordDetails.synonyms` / `antonyms` / `confusedWords` | **什么都不失去。** 没有 UI 显示、没有导入列、没有导出列（`exportService.ts:42-67` 的 Markdown 导出不含它们）。永远写 `""` |
| `SentenceDetails.translation` | **什么都不失去。** 唯一读取点是 `storage.ts:403` 的归一化透传；显示句子释义的地方一律走 `card.back` |
| `HuntAttempt.id` / `.tokenIndex` / `.createdAt` | **什么都不失去。** 无渲染、无 key、无撤销、无时间线 |
| `GateAttempt.id` / `.raw` / `.nodeId` / `.adventureId` / `.hintsUsed` / `.attemptIndex` / `.createdAt` | **什么都不失去。** 唯一消费者 `findPassedAttempt` 只用 `gateId`；符文只用 `topicId`/`verdict`/`errorTags`。⚠️ `raw` 是用户当时写的原句——**但没有任何地方能显示它**，且 `recallTopicMemory`（NPC 记忆）零调用方 |
| `HuntResult.id` / `.finishedAt` | **什么都不失去。** 结算弹窗用的是内存态 `settledResult` |
| `RuneState.xp` / `.unlockedAt` | **什么都不失去。** UI 只读 `mastery`（`AdventureWorldsPage.tsx:32`）；`xp` 是「读了再加一写回」的自引用 |
| `MistakeGeneration.prompt` | **什么都不失去。** `settings` 完整保存同一份生成参数并展示为 chips（`MistakeBookPage:725-729`） |

### 5.2 删了就**真的**失去功能（不可删）

| 项 | 用户会失去什么 | 证据 |
|---|---|---|
| **`Review.answer`** | **错词本里「你当时写的是什么」永久消失**，以及围绕它的字母级差异对照（红色错拼高亮、差异 chips） | `mistakeBookService.ts:97,99,104` → `MistakeBookPage.tsx:1234-1236`（`compareLetters(card.front, primaryWrongAnswer)`）、`:1283-1305`（差异对照 UI） |
| `WordDetails.sourceSentence` | 复习页的来源例句、材料自动关联（三处 probes）、Markdown 导出 | `ReviewPage.tsx:441,497`、`LibraryPage.tsx:613,623,927`、`exportService.ts:52` |
| `WordDetails.audioUrl` / `SentenceDetails.audioUrl` | 用户上传的真人发音不能播放 | `SpeakButton` 的 `audioUrl` 分支、`SpellingPage:794` |
| `SentenceDetails.grammarNote` | 语法复习的讲解 + 弱点归因（`[tag]` 标记）；hunt 卡的罪名彻底丢失 | `GrammarReviewPage:109`、`grammarWeakSpotsService:423` |
| `DiaryEntry.correctedEn` / `issues` | 日记批改结果、重练卡来源、弱点归因 | `GrammarDiaryPage:394,488`、`diaryService:350`、`grammarWeakSpotsService:356` |
| `Card.updatedAt` | **云同步冲突判定失效**（可能用旧数据覆盖新的） | `syncService.ts:45-62` |
| `Schedule.nextReviewAt` | 到期队列、今日计划、复习量预测全失效 | 18+ 处 |
| `MistakeGeneration.content` / `story` | 错词故事无法回看/复制 | `MistakeBookPage:711,919` |

### 5.3 需产品决策

| 项 | 收益 | 决策问题 | 我的判断 |
|---|---|---|---|
| **`HuntAttempt` 整表** | 一年 90 KB（+ 表本身 322 KB） | 它**只为了「命中数」一个数字**而永久增长（`tagStats`/`guessCount` 无 UI）。是否把 `hitCount`/`tagStats` 改成计数器字段，而不是保留逐次点选？ | 建议做：收益中等、语义清晰。**但这是功能取舍，不是无损清理** |
| **`Schedule` 的四个数值字段** | 609 KB（5.2%） | 见 §3.3：不可安全重算（有非 review 写入者 + 算法历史变更 + 自愈语义） | **不建议**。收益不值这个风险 |
| **`Review.answer` 的部分清理** | 385 KB（9.2%） | `GrammarReviewPage:98` 把**正确答案**写进了 `answer`（`task.sentence`）。能否只对「语法复习写入的行」清理？ | ⚠️ **现有数据无法区分**（mode 与 ReviewPage 重叠）→ 只能改写入侧（让语法复习不再写 `answer`），历史行需人工判定。**建议先修写入侧** |
| **`wordDetails`/`sentenceDetails` 的文本字段去重** | 596 KB（5.1%） | 是否接受「详情表不再自包含文本，靠 `card` 回退」？ | 读侧已具备回退逻辑（`storage.ts:375,378,402,403`），改造面比想象小。**推荐** |
| **`reviews` 归档窗口（180 天）** | 一年可压约 51% | `REVIEW_DETAIL_RETENTION_DAYS = 180` 是否可接受「180 天前的错题只剩一天一条汇总」？ | 见 §6.1。这是**唯一能解决无上限增长**的方案，但要接 Settings 入口 + 用户确认 |

---

## 6. 结构性发现（比字段级精简更重要）

### 6.1 ✅ `reviews` 无上限增长 → 归档已接线（审计期间闭环）

`src/services/reviewArchiveService.ts` 已完整实现：
- `compactReviewHistory`（`:75`）：窗口外按天汇总，幂等，保留 `cardId`/`mode`/`rating`（取该日最差）/`reviewedAt`
- `estimateCompactableBytes`（`:155`）：纯估算，供界面提示
- `REVIEW_DETAIL_RETENTION_DAYS = 180`（`:46`）

**接线状态：✅ 已闭环**（审计期间被并行修复）。
`SettingsPage.tsx:169` 的 `confirmDangerOp` 现在有 `dangerPreview.kind === "archive_history"` 分支，
调用 `compactReviewHistory(data)` 并在成功提示里报告「已归档 N 条…释放约 M KB。进度与连胜不变」。

审计当时的反例（留档）：
```
$ grep -rn "compactReviewHistory|estimateCompactableBytes|REVIEW_DETAIL_RETENTION_DAYS" src \
    | grep -v "reviewArchiveService.ts" | grep -v "/edge/"
src/types.ts:127:   * 旧值会在下一次「清理历史」时被一并清除（见 `compactReviewHistory`）。
```
那时唯一命中是 `types.ts:127` 的一句**注释** → `types.ts:127` 的承诺当时不成立。

⇒ **结论修正**：字段级精简最多推后 ~4.7 个月；归档（现已可用）才是让 `reviews` 不再无限增长的手段。
补充量测见 `sv2-archive-defers-wall.test.ts`：**墙从 14~18 个月推到约 30 个月（2.5 年）**。
（`reviews` 是最大单项：36% / 4,200 KB / 10,950 条，且只增不减——`applyReviewWithUndo` 只 push，`reviewService.ts:601`。）

**⚠️ 接线后新暴露的问题**：归档产出的汇总记录（`reviewArchiveService.ts:131-138`）**刻意不带 `diffJson`**，
但经 `migrateData` 后又被补上 `"diffJson":"[]"`（多 16 字符/条，SV4 实测）。
所以「归档 → 归一化 → 落盘」这条链上，每条汇总记录都白付这笔开销 —— **应先修 §6.2 再让用户跑归档**。

### 6.2 🔴 `diffJson` 摘除只做了一半

**已落地**（写入侧）：
- `types.ts:129` → `diffJson?: string`（可选），注释明确「全库零读取方」
- `reviewService.ts:525-542` → `review` 对象不再含 `diffJson`，`void diffJson;`

**未落地**（归一化侧）：
- `storage.ts:513` → `diffJson: asString(value.diffJson, "[]")` **仍在给每一条补值**

**后果（SV4 实测）**：
```
输入（写入侧产物，无 diffJson）：
  {"id":"r1","cardId":"c1","mode":"spelling","rating":4,"answer":"approach","reviewedAt":"…"}
迁移后：
  {…,"diffJson":"[]","reviewedAt":"…"}          ← 字段又回来了
```
- 摘除**没有让字段消失**，只让它从真实 diff（~21 字符）缩成 `"[]"`（2 字符）。
- 残值 **278 KB/年**（键名 11 字符 + 值 2 字符）× 10,950 条。
- 归档产出的汇总记录同样被补上（16 字符/条，白付）。

**同时是一个语义缺陷**：`"[]"` 不是中性的「无数据」标记，它的语义是
**「我比过了，零差异」**。而同一文件里 `mistakeGraduatedAt`（`storage.ts:351-356`）的注释明写
「缺失与垃圾都落到 `undefined`，不给一个不存在的毕业时间编造时间戳」——
两处口径相反，`diffJson` 这处**在编造内容**。

**建议**（产品代码，由你实施）：
```ts
// storage.ts:513 附近
...(typeof value.diffJson === "string" && value.diffJson ? { diffJson: value.diffJson } : {}),
```
即「有值才保留，缺失不写」——既停掉新残值，又保留历史值（等归档清理）。

---

## 7. 新增测试与运行结果

| 文件 | 用例数 | 结果 | 覆盖 |
|---|---|---|---|
| `/Users/liujun/Documents/英语听写/src/edge/verify/sv3-volume-forensics.test.ts` | 11 | ✅ 全通过 | 一年模型逐实体 / 逐字段净体积；可删项合计；`diffJson` 可重算的逐字节验证；`answer` 不可重算的对照；重复存储清单；可重算/不可重算分类；低频实体零读取字段；MistakeGeneration 冗余 |
| `/Users/liujun/Documents/英语听写/src/edge/verify/sv4-diffjson-removal-gap.test.ts` | 5 | ✅ 全通过 | `diffJson` 摘除的**归一化缺口**：① 归一化重新补值（含「编造零差异」的语义问题）；② 归档接线状态防回退断言；归档→迁移往返被补值；残值量化 |

运行命令与结果：
```
$ npx vitest run src/edge/verify/sv3-volume-forensics.test.ts src/edge/verify/sv4-diffjson-removal-gap.test.ts
 ✓ src/edge/verify/sv3-volume-forensics.test.ts (11 tests) 42ms
 ✓ src/edge/verify/sv4-diffjson-removal-gap.test.ts (5 tests) 243ms
 Test Files  2 passed (2)
      Tests  16 passed (16)
```

文件编号说明：审计过程中 `src/` 被并行修复（`compactReviewHistory` 接线、`SettingsPage` 归档入口、
以及同期的 `sv1-review-archive.test.ts` / `sv2-archive-defers-wall.test.ts`），
故本报告新增的两个文件最终编号为 **`sv3`**（逐字段体积取证）与 **`sv4`**（diffJson 归一化缺口），
避免与已存在的 `sv1`/`sv2` 冲突。

两个文件都用 `// @vitest-environment node`（纯函数/纯数据，不需要 DOM）。
`sv3` 的逐字段体积口径：`JSON.stringify({key: value}).length - JSON.stringify({}).length`，
即**删除该字段后该行会缩短的确切字符数**（含键名、引号、冒号、逗号）。

---

## 8. 建议的实施顺序

| 顺序 | 动作 | 收益（SV3） | 风险 | 严重度 |
|---|---|---|---|---|
| 1 | `storage.ts:513` 改为「有值才保留」（§6.2） | 278 KB + 止住归档残值 | 极低（不改读取语义——本来就没读取方） | 🔴 高 |
| 2 | 接上 `compactReviewHistory` 到 Settings（§6.1） | 一年可压 ~51% 的 reviews | 中（需用户确认 + 文案说明「180 天前只留汇总」） | 🔴 高 |
| 3 | 删除 `synonyms` / `antonyms` / `confusedWords`（含 `cardService.ts:265-267`（建卡）、`storage.ts:381-383,427-429,1107-1109`） | 314 KB | 极低（无 UI、无导入列） | 🟡 中 |
| 4 | 删除 `SentenceDetails.translation`（含 `cardService.ts:446`、`storage.ts:403`） | 74 KB | 低（读侧已回退 `card.back`） | 🟡 中 |
| 5 | 清理 `GateAttempt` 六字段 + `HuntAttempt.id/tokenIndex/createdAt` + `HuntResult.id/finishedAt` + `RuneState.xp/unlockedAt` + `MistakeGeneration.prompt` | 444 KB | 低（逐个已 grep 确认零读取） | 🟢 低 |
| 6 | 修 `GrammarReviewPage:98` 不再把答案写成 `answer`（§5.3） | 改善数据语义（未来可精简） | 低（只改写入侧；历史行不动） | 🟡 中 |
| 7 | 不要动 `Schedule` 的数值字段 | — | — | ⚪ 不建议 |

**明确区分**：
- **确认可删（可直接实施，无功能损失）**：顺序 1、3、4、5
- **需产品决策**：顺序 2（归档窗口与文案）、6（`answer` 语义）、§5.3 的 `HuntAttempt` 整表取舍、§4 的详情表去重
- **明确不建议**：`Schedule` 的 `easeFactor`/`intervalDays`/`reviewCount`/`lapseCount`（§3.3）
- **明确不可删**：`Review.answer`、`Review.reviewedAt`、`Card.updatedAt`、`Schedule.nextReviewAt`、`WordDetails.sourceSentence`/`audioUrl`、`SentenceDetails.grammarNote`、`DiaryEntry` 的全部内容字段
