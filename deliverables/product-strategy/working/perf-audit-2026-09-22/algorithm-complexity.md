# 数据规模 / 算法复杂度专项验证（PF2 轮次）

日期：2026-09-22
范围：`/Users/liujun/Documents/英语听写`（React 18 + TS + Vite + vitest）
本文件只报告发现，**未修改 `src/` 下的任何产品代码**（仅新增测试文件）。

---

## ⚠️ 0. 基线变动声明（必读）

**本轮测量期间，有并行工作在同一棵工作树上修改了 `src/`**，命中了我正在测的两个 P0：

| 时间 | 文件 | 改动 | 影响我的哪条发现 |
|------|------|------|------------------|
| 08:47:50 | `src/services/storage.ts` | `saveData` 新增 `shouldSkipMigration`：数据已归一化时**跳过 `migrateData`** | §5（每次落盘重跑迁移） |
| 09:00:01 | `src/services/reviewService.ts` | `getWeakCardInsights` 改为**先建 `reviews`/`schedules` 索引**再遍历 | §3.4 / §1.3 的 #1 #2 |

我在 **08:44–08:58** 的测量窗口里量到的是**修复前**的行为；**09:01 起重测**得到修复后的行为。
下表两列都是实测，**均标注测量时刻**，避免把已修的问题当现存缺陷上报。

> 我**没有**修改这些产品代码。上表的两处改动来自并行会话（`git diff` 可见，且带 2026-09-22 的性能修正注释）。

---

## 0.1 结论速览（当前代码状态，09:01 后重测）

| # | 发现 | 文件:行号 | 复杂度 | 修复前实测 | **当前实测** | 状态 / 严重度 |
|---|------|-----------|--------|------------|--------------|---------------|
| 1 | `getWeakCardInsights` 每卡各扫全部复习记录 + 各查一次计划 | `src/services/reviewService.ts:307-352` | ~~O(cards × reviews)~~ → **O(n + m)** | n=20000 → **3487ms** | **8.79ms** | ✅ **已被并行修复** |
| 2 | `buildSpellingQueue(mistakes)` 经 #1 | `spellingQueueService.ts:58` | ~~O(cards × reviews)~~ → **线性** | n=20000 → **1462.7ms**；n=5000 → 105.8ms | **8.88ms**（20000）/ 2.67ms（5000） | ✅ **已随之修复** |
| 3 | `migrateData` 嵌套线性 `find` | `storage.ts:362/389/1195` | **O(cards²)** | n=20000 → 903ms | **931ms**（函数本身未改） | ⚠️ **仍存在**，但**落盘路径已绕过**（见下） |
| 4 | 落盘每次重跑全量迁移 | `AppContext.tsx:60` → `storage.ts:1299` | ~~迁移+序列化+写盘~~ → **仅序列化+写盘** | n=5000 → 9.3ms（当时含迁移） | **10.3ms**（纯序列化+写盘） | ✅ **已被并行修复**（配额问题仍在） |
| 5 | 错词本页两轮 `O(条目 × reviews)` 同形计算 | `MistakeBookPage.tsx:128`、`:408`、`:421` | **O(条目 × reviews)** | 5000 卡 → 199ms | **208.7ms** | ⚠️ **仍存在** — **P1** |
| 6 | `buildDailyDirective` O(units × cards) + 每本一次 `buildSpellingQueue` | `dailyDirectiveService.ts:194-204`、`:174`、`:76-91` | **O(units × cards)** | n=20000 → 27.2ms | **27.79ms** | ⚠️ **仍存在** — P1 |
| 7 | `getUnitStats` 每卡 `schedules.find` | `unitService.ts:26` | **O(本卡数 × 卡数)** | 2400 卡词书 → 57ms | **62.2ms** | ⚠️ **仍存在** — P1 |
| 8 | `getWeeklyStatsReport` 7 天 × 全量扫描 + 无 memo | `statsService.ts:383-399`、`StatsPage.tsx:107` | O(7 × reviews) | n=20000 → 82ms | **~80ms** | ⚠️ **仍存在** — P1 |
| 9 | localStorage 配额断点 | 体积算术 | — | 约 6600 卡（jsdom 字符口径）；真实浏览器口径待确认 | 同 | ⚠️ **仍存在** — **P0** |
| 10 | `statsService.ts:409` `[...prev, review]` 追加 | `statsService.ts:409` | **O(单卡历史²)** | 单卡 4000 条 → 浪费 244ms | 同（未改） | ⚠️**可疑但未证实**（端到端未支配） — P2 |
| 11 | `summarizeHuntProgress` 每案 `huntResults.some` | `huntService.ts:432` | O(cases × results) | 2000 条 → 3.1ms | 同 | P2 |
| 12 | `listHuntCasesWithLock` 每案扫全部课 | `huntService.ts:80`、`:105` | O(cases × lessons) | 0.24ms | 同 | P2 |

**当前代码里仍值得修的三项**：#5（错词本 208ms）、#7（`getUnitStats` 每卡的 `schedules.find`）、#9（配额断点）。
**#3 的 O(cards²) 未被修**，但 `saveData` 现在只在**数据不满足归一化标记**时才走迁移（导入备份 / 重置 / 版本升级）——日常答题路径已绕过它，所以严重度从 P0 降到 **P1（仅导入/升级时卡）**。

**确认的缺陷**（当前代码）：#5 #6 #7 #8 #9。
**已修复（本轮并行）**：#1 #2 #4。
**可疑但未证实**：#10。
**排除（曾怀疑、实测否定）**：`diversifyReviewModes`（§3.1）、`computeWeakSpotsReport` 随卡片规模（§3.5）。

---

## 1. 全库扫描清单表（「按全库扫描逐个排查」）

n 的规模标注：**197 课 / 206 案**为固定题库；**卡片数 / 复习记录数**随用户使用持续增长（重点）。

### 1.1 复习页路径

| 函数 | 文件:行号 | 复杂度 | 调用频率 | n 的规模 |
|------|-----------|--------|----------|----------|
| `listDueGrammarReviewCards` | `services/grammarReviewService.ts:62` | O(cards + schedules) | 进入复习页 1 次 + `useMemo` | 卡片数（增长） |
| `buildGrammarReviewSession` | `services/grammarReviewService.ts:135` | O(语法卡 log 语法卡) | 进入页面 1 次（`useState` 初值，`GrammarReviewPage.tsx:52`） | 语法卡数（增长） |
| `diversifyReviewModes` | `services/grammarReviewService.ts:148` | O(会话²)，会话 ≤ **10** | 组会话时 1 次 | 常量 10（受 `GRAMMAR_REVIEW_SESSION_LIMIT` 保护） |
| `summarizeGrammarMastery` | `services/grammarReviewService.ts:196` | O(cards + schedules) | 每次 `data` 变化（`useMemo`，`:47`） | 卡片数（增长） |
| `buildGrammarReviewTask` | `services/grammarReviewService.ts:362` | O(句长²)（`uniqueIndexes` 里对每个候选扫全句 token） | 每张题 1 次 | 句长（常量级） |

### 1.2 拼写 / 组队路径

| 函数 | 文件:行号 | 复杂度 | 调用频率 | n 的规模 |
|------|-----------|--------|----------|----------|
| `buildSpellingQueue`（global） | `services/spellingQueueService.ts:35` | O(cards + schedules) | 进入拼写页 1 次 + `queueKey` 变化 | 卡片数（增长） |
| `buildSpellingQueue`（unit, smart） | 同上 `:70-95` | O(cards + schedules) | 同上 | 卡片数（增长） |
| `buildSpellingQueue`（mistakes） | 同上 `:58` | ~~O(cards × reviews)~~ → **线性**（经已修复的 `getWeakCardInsights`） | 错词本入口 / `?mode=mistakes` | 卡片数 + 复习记录数 |
| `getDueCards` | `services/reviewService.ts:110` | O(cards + schedules) | 每次 `buildSpellingQueue` / `getLearningStats` / `ReviewPage` 都会调 | 卡片数（增长） |
| `getNewCardsForToday` | `services/reviewService.ts:164` | O(cards + reviews)（经 `countFirstReviewedToday` → `getFirstReviewByCardId`） | 同上，且**每次调用都重建首评索引** | cards + reviews（增长） |
| `getMistakeGroupsByDate` | `services/mistakeBookService.ts:114` | O(reviews) | 错词本页 1 次（`useMemo`，`:325`） | 复习记录数（增长） |
| `getMistakeCards` → `getWeakCardInsights` | `services/reviewService.ts:354→297` | 线性（已修复） | mistakes 队列每次构建 | 卡片数 + 复习记录数 |

### 1.3 统计 / 首页 / 词库路径

| 函数 | 文件:行号 | 复杂度 | 调用频率 | n 的规模 |
|------|-----------|--------|----------|----------|
| `getWeakCardInsights` | `services/reviewService.ts:297` | **线性**（已修复：`reviews` + `schedules` 各建一次索引，`:307-330`） | ReviewPage `:115`+`:116`、StatsPage `:194`、UnitsPage `:241`、SpellingPage（经 mistakes 队列） | 卡片数 + 复习记录数 |
| `getWeakCards` | `services/reviewService.ts:182` | O(cards + reviews) | `getLearningStats` 内部 `:225`、`getWeakStats` `:368` | 都增长 |
| `getLearningStats` | `services/reviewService.ts:207` | O(cards + reviews)，**内部约 28 次全量遍历**（见 §2.4） | **5 个页面直接调用、无 memo** + 1 处 memo | 都增长 |
| `getWeeklyStatsReport` | `services/statsService.ts:265` | O(7 × reviews + cards)，内部约 21+ 次全量遍历 | StatsPage `:107`（无 memo） | 都增长 |
| `getDueForecast` | `services/statsService.ts:639` | O(schedules + cards) | StatsPage `:185`（无 memo） | 卡片数 |
| `computeStreak` | `services/statsService.ts:549` | O(reviews) | AppLayout `App.tsx:102` **每次渲染** | 复习记录数 |
| `computeStreakWithGrace` | `services/statsService.ts:584` | O(reviews) | StatsPage `:132` **和** `:211`（同一页面 2 次）、UnitsPage/`dailyDirectiveService.ts:106`、`milestoneService.ts:69` | 复习记录数 |
| `getUnitStats` | `services/unitService.ts:15` | **O(本卡数 × 卡数)**（`schedules.find`，`:26`） | UnitsPage `:1216` 在 `section.units.map` 里**每本一次**（无 memo）+ `:210` | 卡片数 × 词书数 |
| `getVocabularyGoalStats` | `services/unitService.ts:49` | O(cards + schedules) | UnitsPage `:212`（`useMemo`） | 卡片数 |
| `getCardsForUnit` | `services/unitService.ts:5` | O(cards log cards) | UnitsPage `:211` | 卡片数 |

### 1.4 每日指令 / 错词本 / 侦探路径

| 函数 | 文件:行号 | 复杂度 | 调用频率 | n 的规模 |
|------|-----------|--------|----------|----------|
| `buildDailyDirective` | `services/dailyDirectiveService.ts:93` | **O(units × cards)** | UnitsPage `:214`（`useMemo`，每次 `data` 变化） | 词书数 × 卡片数（都增长） |
| ↳ `dueCountOf` | 同上 `:194-199` | O(cards) **每本一次** | 循环内 | units × cards |
| ↳ `queueFor` → `buildSpellingQueue` | 同上 `:114-115` | O(cards + schedules) **每本一次** | 循环内 | units × cards |
| ↳ `getDeadUnits` | 同上 `:76-91` | O(units × cards) | `:174` 调用一次 | units × cards |
| `getMistakeInsight` | `pages/MistakeBookPage.tsx:128` | **O(reviews)** 每条目一次 | `:421` 每条目 + `:408` 每组每轮（**同形两轮**） | 条目数 × reviews |
| `summarizeHuntProgress` | `services/huntService.ts:427` | **O(cases × huntResults)** | GrammarHuntPage `:45`（`useMemo`） | 206 × 结算数（增长） |
| `listHuntCasesWithLock` | `services/huntService.ts:99` | **O(cases × lessons)** | GrammarHuntPage `:43`（`useMemo`） | 206 × 197（固定） |
| `computeWeakSpotsReport` | `services/grammarWeakSpotsService.ts:304` | O(遥测事件 + diaryEntries + **cards** + huntCases) | GrammarPathPage `:637`、BoostPage `:137`、ReplayPage `:31`、Ambush `:106`、WeeklySummary `:89` | 遥测上限 3000（固定）+ 卡片数（**部分增长**） |
| ↳ `huntCases.find`（按 `caseId`） | 同上 `:331` | O(cases) 每条 hunt 事件一次 | 循环内 | 事件数 × 206 |
| ↳ `data.diaryEntries.find` | 同上 `:339` | O(diaryEntries) 每条 diary 事件一次 | 循环内 | 事件数 × 条目数（都增长） |
| ↳ `data.cards.find` | 同上 `:385` | O(cards) 每条 hunt 来源复习事件一次 | 循环内 | 事件数 × 卡片数 |
| ↳ `grammarLessons.find` | 同上 `:350`、`:366` | O(197) 每条事件一次 | 循环内 | 事件数 × 197 |
| `findActiveIntervention` / `buildWeakSpotNarrative` | 同上 `:246` / `:130` | 各自**内部再算一遍** `computeWeakSpotsReport` + 再扫遥测 | GrammarPathPage `:639`、`:641` | 同上 × 2 |
| ↳ `lessonOfTag`：`huntCases.find` 嵌套在 `grammarLessons` 循环里 | 同上 `:158-166` | **O(197 × huntCaseIds × 206)** | 每次调用 | 固定但乘积大 |

### 1.5 存储 / 启动路径

| 函数 | 文件:行号 | 复杂度 | 调用频率 | n 的规模 |
|------|-----------|--------|----------|----------|
| **`migrateData`** | `services/storage.ts:979` | **O(cards²)**（见 §5） | **仅在数据未归一化时**（导入备份 / 重置 / 版本升级；`saveData` 的 `shouldSkipMigration` 快速路径已跳过日常路径） | 卡片数（增长） |
| ↳ `normalizeWordDetails` | 同上 `:362` | `cards.find(word)` + `cards.find(id)` **每条一次** → O(cards²) | 同上 | 卡片数 |
| ↳ `normalizeSentenceDetails` | 同上 `:389` | 同上 → O(cards²) | 同上 | 卡片数 |
| ↳ `ensureDefaultUnits` | 同上 `:1195` | `cards.findIndex` 每条无 `unitId` 卡一次 → O(cards²) 最坏 | 同上 | 卡片数 |
| ↳ `restructureOversizedUnits` | `services/bookRestructureService.ts:108` | O(units × cards)（`getUnitWordCards` 扫全库） | 每次 `applyStartupMigration` | units × cards |
| ↳ `syncUnitCompletion` | `services/learningTelemetry.ts:192` | O(cards + units) | 同上 | 卡片数 |
| `saveData` | `services/storage.ts:1299` | `shouldSkipMigration` 命中 → **仅 `JSON.stringify` + `setItem`** | **每次操作**（`AppContext.tsx:60`） | 全量 AppData（增长） |
| `writeRaw` | 同上 `:1264` | `JSON.stringify(整个 AppData)` | 同上 | 全量（增长） |
| `AppProvider` 自动推送 effect | `AppContext.tsx:170-190` | **每次 `data` 变化都 `JSON.stringify(整个 AppData)`** 做同步比对 | 每次渲染（有 `isDataSyncConfigured` 早退） | 全量（增长） |

---

## 2. 重复建索引（「一次操作里同一数据被扫描 N 次」）

### 2.1 `buildDailyDirective`：N = **20 本词书 → 80 次全量遍历**

`src/services/dailyDirectiveService.ts:194-204` 在「常规」分支里对**每一本**词书各调一次 `queueFor(unit.id)` 与 `dueCountOf(unit)`。
用 `vi.mock` 插桩实测（20 本 / 2000 卡，走到 `normal` 分支）：

```
[PF2b] buildDailyDirective（20 本词书 / 2000 卡，走到「常规」分支）
  buildSpellingQueue 调用次数: 20 次
  getDueCards 调用次数（每次=2 次全库扫描）: 20 次
  getNewCardsForToday 调用次数（每次=1 次全库扫描）: 20 次
  → 单次 buildDailyDirective 里的全量遍历总量：
     getDueCards 20×2 + getNewCardsForToday 20×1 + dueCountOf 每本一次 cards 扫描 20 = 80 次全量遍历（kind=normal）
```

**N = 80**（20 本词书规模）。词书数随用户导入增长 → 这个 N 会继续变大。
另：`getDeadUnits`（`:76-91`）内部也对每本各 `filter` 一次全库卡片（O(units × cards)），且在 `:174` 被调用。

### 2.2 `buildSpellingQueue(unit, smart)`：单次调用内 **6 次全库遍历**

`src/services/spellingQueueService.ts:70-95`：

1. `getDueCards` → `schedules.filter`（全库）+ `cards.filter`（全库）
2. `allCards.filter(unitId)`（全库）
3. `data.schedules.map` 建 Map（全库）
4. `inReviewTrack.filter(due)` + 5. `inReviewTrack.filter(upcoming)`（单本，各 1 遍）
6. `getNewCardsForToday` → `countFirstReviewedToday` → `getFirstReviewByCardId`（扫**全部 reviews**）+ `cards.filter`（全库）

且 4/5 两处的 `sort` 比较器里各做一次 Map 查找 + `localeCompare`（不是数组扫描，但常数高）。

### 2.3 `getUnitStats`：同一本词书在一次渲染里被算两遍

`src/pages/UnitsPage.tsx:1216` 在 `section.units.map` 里对每本各调一次；`:210` 又为选中的那本调一次。
插桩实测（5000 卡 / 20 本词书）：

```
[PF2f] UnitsPage（5000 卡）挂载+落定耗时 365ms
    54 × getUnitStats
```

**N = 54**（26 本词书经迁移后 → 每本 2 遍 + 选中态）。`getUnitStats` 无 memo，每次渲染重算。

### 2.4 `getLearningStats`：单次调用内部 **约 28 次**全量/近全量遍历

静态计数（`reviewService.ts:207-279`，由 PF2b 用例打印）：

```
    2  getDueCards（schedules.filter + cards.filter）
    2  getWeakCards（cards.filter + reviews 单遍）
    1  activeCards = cards.filter
    1  scheduleByCardId = schedules.map
    1  todayReviews = reviews.filter
    1  lowRatingCardIds = reviews.filter
    1  lowRatingCardIdsToday = todayReviews.filter
    1  getFirstReviewByCardId = reviews.reduce
    1  recentWrongCardIds 循环 reviews
   15  activeCards.filter × 15（mastered/priority/word/sentence/new/…）
    2  nextDueAt = activeCards.map + sort
  ── 合计约 28 次全量/近全量遍历（cards 或 reviews）
```

这 15 次 `activeCards.filter` 完全可以一趟循环统计完（都是同一个数组的不同谓词计数）。
**调用频率**：5 个页面**直接调用、无 `useMemo`**——`StatsPage.tsx:106`、`TodayPage.tsx:68`、`LibraryPage.tsx:233`、`AddPage.tsx:9`、`TrainingPage.tsx:26`；仅 `ReviewPage.tsx:114` 有 memo。

### 2.5 错词本页：同一形状的两轮 `O(条目 × reviews)` 计算

`pages/MistakeBookPage.tsx`：

- `:421` `entryInsights`：对**每个条目**调 `getMistakeInsight(entry, data.reviews)`，函数内部 `reviews.filter`（`:130-132`）
- `:408` `groupProgress`：对**每个分组的每个条目**再调一次同一函数（`:302`）

两者语义完全重叠、无索引复用。实测（5000 卡 / 50% 低分，2500 条目）：

```
[PF2d] 错词本页数据准备（5000 卡，低分占比 50%）
  getMistakeGroupsByDate 建索引（2500 条目）                       6.45ms
  页面侧 getMistakeInsight × 2500 条目（每条 filter 5000 复习）       96.20ms
  页面侧 groupProgress 再算一轮（同形，MistakeBookPage.tsx:408）       96.47ms
  → 一次性页面数据准备合计 ≈ 199.1ms
     其中「条目数 × 复习记录数」两项（entryInsights + groupProgress）占 192.7ms，
     是建索引本身的 29.9 倍
    两处形状完全相同的计算，未共用索引。
```

### 2.6 `getWeeklyStatsReport`：7 天趋势 × 全量扫描

`statsService.ts:383-399` 循环 7 天，每天对 `data.reviews` 全量 `filter` 1 次、对 `activeCards` 全量 `filter` 2 次 → 约 21 次全量遍历；另有 `weekReviews` / `prevWeekReviews` / `wrongBeforeWeekCardIds` 等各自独立成次。

### 2.7 `computeWeakSpotsReport`：嵌套 `find` 在事件循环内

`grammarWeakSpotsService.ts`：

- `:331` 每条 `hunt_verdict` 事件做一次 `huntCases.find`（O(206)）
- `:339` 每条 `diary_issue_tag` 事件做一次 `diaryEntries.find`（**随日记条目增长**）
- `:385` 每条 hunt 来源复习事件做一次 `data.cards.find`（**随卡片数增长**）
- `:350`、`:366` 每条事件做一次 `grammarLessons.find`（O(197)）
- `:158-166` `lessonOfTag`：`huntCases.find` **嵌套在** `grammarLessons` 循环里 → O(197 × huntCaseIds × 206)

且在 GrammarPathPage 里被算 **3 次**（`:637` report、`:639` narrative 内部再算、`:641` intervention 内部再算）。

---

## 3. 卡片 / 复习记录规模的实测耗时曲线

**测量方法**：`performance.now()`，每个测量预热 1 次 + 5 轮取中位数（`timeMedian`，`src/edge/verify/pf2Scale.ts`）。
**环境**：node（`// @vitest-environment node`），避开 jsdom 噪声；仅 PF2c 用 jsdom（需要 localStorage）。
**数据构造**：`scaleData({ cards: n })` — 每卡 1 条 schedule、1 条 review、40% 语法句子卡、20 张词卡/本词书。

### 3.1 复习页组会话

| 函数 | n=100 | n=1000 | n=5000 | n=20000 | 增长形态 |
|------|-------|--------|--------|---------|----------|
| `listDueGrammarReviewCards` | 0.05ms | 0.24ms | 1.18ms | 4.86ms | 线性 |
| `buildGrammarReviewSession` | 0.06ms | 0.51ms | 2.89ms | **14.22ms** | 线性（≈卡数 log） |
| `summarizeGrammarMastery` | 0.02ms | 0.12ms | 0.64ms | 1.94ms | 线性 |
| `diversifyReviewModes`（**真实输入 ≤10 张**） | 0.001ms | 0.001ms | 0.001ms | 0.001ms | **与规模无关** |
| `diversifyReviewModes`（对照：未截断输入） | 0.04ms | 0.66ms | 12.56ms | 195.56ms | O(session²) |

**16ms 帧预算**：`buildGrammarReviewSession` 在 **n=20000 时 14.2ms**，已逼近一帧；其余未超。
**重要修正**：`diversifyReviewModes` 的**真实调用形状**是 `diversifyReviewModes(buildGrammarReviewSession(data))`（`GrammarReviewPage.tsx:52`、`drive.ts:97`），输入恒为已截断的 ≤10 张，单独成本 0.001ms、与规模无关。它的 O(session²) 只在**未截断输入**下出现——那是测量构造，不是产品路径。会话上限 10 是这条路径唯一的保护，建议保持。

### 3.2 拼写页组队列

**修复前（08:44–08:58 测量）**：

| 函数 | n=100 | n=1000 | n=5000 | n=20000 | 增长形态 |
|------|-------|--------|--------|---------|----------|
| `buildSpellingQueue(global)` | 0.06ms | 0.41ms | 2.23ms | 8.70ms | 线性 |
| `buildSpellingQueue(unit, smart)` | 0.10ms | 0.72ms | 4.63ms | **21.93ms** | 线性 |
| `buildSpellingQueue(unit, all)` | 0.07ms | 0.67ms | 4.00ms | 15.69ms | 线性 |
| **`buildSpellingQueue(mistakes)`** | 0.16ms | **10.44ms** | **105.79ms** | **1462.71ms** | **≈O(n²)** |

`mistakes` 模式修复前：规模 10x → 耗时 63.7x；规模 4x → 13.8x。**超线性确认**。

**修复后（09:01 重测，`getWeakCardInsights` 索引化之后）**：

| 函数 | n=100 | n=1000 | n=5000 | n=20000 | 结论 |
|------|-------|--------|--------|---------|------|
| `buildSpellingQueue(global)` | 0.06ms | 0.42ms | 2.41ms | 8.72ms | 不变 |
| `buildSpellingQueue(unit, smart)` | 0.09ms | 0.69ms | 3.82ms | 19.22ms | 不变（线性） |
| `buildSpellingQueue(unit, all)` | 0.08ms | 0.66ms | 3.84ms | 14.90ms | 不变（线性） |
| **`buildSpellingQueue(mistakes)`** | 0.09ms | 0.52ms | **2.67ms** | **8.88ms** | **已降为线性**（n=20000 从 1462.71ms → 8.88ms，**快 165 倍**） |

**16ms 帧预算（当前代码）**：`mistakes` **已不再超帧**；`smart` 仍在 n=20000 时 19.2ms 首次超帧。

### 3.3 每日指令

| 函数 | n=100 | n=1000 | n=5000 | n=20000 |
|------|-------|--------|--------|---------|
| `buildDailyDirective` | 0.22ms | 1.40ms | 6.63ms | **27.22ms** |

**16ms 帧预算**：**n=20000 时 27.2ms** 超帧。此曲线是在 `unitCount = cards/20`（即 n=20000 时 1000 本词书）下测得；词书数由用户导入决定，是独立变量。另测「units × cards 乘积」对照：10 本/500 卡 0.73ms → 100 本/5000 卡 9.38ms（乘积 100x，耗时 12.9x）。

### 3.4 统计 / 首页 / 词库 / 错词本

**修复前（08:44–08:58 测量）**：

| 函数 | n=100 | n=1000 | n=5000 | n=20000 | 增长形态 |
|------|-------|--------|--------|---------|----------|
| `getLearningStats` | 0.23ms | 1.70ms | 8.44ms | 33.38ms | 线性 |
| `getDueCards` | 0.03ms | 0.38ms | 2.01ms | 10.76ms | 线性 |
| `getNewCardsForToday(word)` | 0.02ms | 0.23ms | 1.21ms | 6.06ms | 线性 |
| `getWeakCards` | 0.02ms | 0.25ms | 1.31ms | 6.20ms | 线性 |
| **`getWeakCardInsights(words, limit30)`** | 0.07ms | **5.44ms** | **140.53ms** | **3487.26ms** | **≈O(n²)** |
| **`buildSpellingQueue(mistakes)`** | 0.16ms | **10.44ms** | **105.79ms** | **1462.71ms** | **≈O(n²)** |
| `getUnitStats`（单本） | 0.07ms | 0.19ms | 0.83ms | 4.44ms | ≈线性 |
| `getVocabularyGoalStats` | 0.06ms | 0.55ms | 2.37ms | 16.13ms | 线性 |
| `getMistakeGroupsByDate` | 1.31ms | 1.54ms | 4.49ms | 15.16ms | 线性 |
| `getWeeklyStatsReport` | 0.51ms | 4.14ms | 19.96ms | 81.53ms | 线性 |
| `computeStreak` | 0.03ms | 0.18ms | 0.87ms | 4.20ms | 线性 |
| `getDueForecast` | 0.05ms | 0.38ms | 2.16ms | 8.41ms | 线性 |

**修复后（09:01 重测）**：

| 函数 | n=100 | n=1000 | n=5000 | n=20000 | 结论 |
|------|-------|--------|--------|---------|------|
| **`getWeakCardInsights(words, limit30)`** | 0.03ms | 0.33ms | **2.14ms** | **8.79ms** | **已降为线性**（20000 卡 3487ms → 8.79ms，**快 397 倍**） |
| **`buildSpellingQueue(mistakes)`** | 0.09ms | 0.52ms | **2.67ms** | **8.88ms** | **已降为线性**（20000 卡 1462.7ms → 8.88ms，**快 165 倍**） |
| `getLearningStats` | 0.24ms | 1.81ms | 9.34ms | 34.99ms | 不变（线性） |
| `buildDailyDirective` | 0.22ms | 1.41ms | 7.41ms | 27.79ms | 不变（unit × cards） |
| `buildSpellingQueue(unit, smart)` | 0.09ms | 0.69ms | 3.82ms | 19.22ms | 不变（线性） |

**归因证据（修复前的实测，保留作为该修复的验收基线）**：

```
[PF2d · 修复前] getWeakCardInsights：每卡复习数固定 4，卡片数递增
  500 卡 / 2000 复习      2.39ms
  1000 卡 / 4000 复习     11.16ms
  2000 卡 / 8000 复习     41.86ms
  4000 卡 / 16000 复习   144.05ms
  → 卡片 500→4000（8x），耗时 2.4→144.0ms（60.4x）
     若为 O(cards × reviews) = O(cards² × 每卡复习数)，8x 规模应产生 ~64x 耗时；
     实测 60.4x ⇒ 确认是乘积项

[PF2d · 修复后] 同一测量
  → 卡片 500→4000（8x），耗时比已回到 ≈线性（断言从 >16x 改为 <20x，现通过）
```

修复前的两行：
- `reviewService.ts:292-295` `getCardReviews(data, cardId)` — 每张卡都 `data.reviews.filter(...)`（O(m)）
- `reviewService.ts:320` `data.schedules.find(...)` — 每张卡都线性查计划表（O(m)）

修复后（`reviewService.ts:307-330`）：一次遍历 `reviews` 建 `Map<cardId, Review[]>`（顺带按时间排好）、一次建 `Map<cardId, Schedule>`，主循环只查表。

**16ms 帧预算（当前代码）**：`getWeakCardInsights` 与 `buildSpellingQueue(mistakes)` **已不再超帧**。
仍超帧的：`buildSpellingQueue(unit, smart)` 19.2ms、`getLearningStats` 35.0ms、`buildDailyDirective` 27.8ms（均在 n=20000）。

### 3.5 弱点分析（`computeWeakSpots` / `computeWeakSpotsReport`）

| 函数 | n=100 | n=1000 | n=5000 | n=20000 |
|------|-------|--------|--------|---------|
| `computeWeakSpotsReport` | ~0.00ms | ~0.00ms | ~0.00ms | ~0.00ms |

**不随卡片规模增长**——它的输入是遥测事件（上限 `MAX_EVENTS = 3000` 条，`grammarTelemetry.ts:15`），测试数据里没有遥测事件，故为 0。
它的真实规模风险来自**遥测事件数 × 内层 `find`**（`huntCases` 206 / `grammarLessons` 197 / `diaryEntries` / **`cards`**），其中 `:385` 的 `data.cards.find` 是唯一随卡片增长的内层项。**本条未实测其随遥测满载的增长曲线**，列为「可疑但未证实」。另外它在 GrammarPathPage 一次渲染里被算 3 次（`:637`/`:639`/`:641`），这是确定的浪费（见 §4）。

---

## 4. 幂等 / 缓存缺失

| 候选 | 文件:行号 | 单次成本（5000 卡） | 同一次渲染算几次 | 不缓存的实际代价 |
|------|-----------|---------------------|------------------|------------------|
| `getLearningStats` | `reviewService.ts:207` | 9.3ms | 页面各 1 次；**5 个页面无 memo**（StatsPage/TodayPage/LibraryPage/AddPage/TrainingPage） | 每次渲染固定 9.3ms，随规模线性上涨（n=20000 → 35ms） |
| `getWeakCardInsights` | `reviewService.ts:297` | 2.1ms（修复前 363ms） | ReviewPage **2 次**（`:116` limit=3 + `getWeakStats` 内部 limit=全部，`:365`） | 修复后 ≈4ms；且 **`limit` 不影响内部成本**（先算完全部卡再 `slice`，`:342-351`）——仍建议让 `limit` 参与剪枝 |
| `getWeeklyStatsReport` | `statsService.ts:265` | 46.5ms | StatsPage 1 次（**无 memo**，`:107`） | 每次渲染 46.5ms；n=20000 → 82ms |
| `getDueForecast` | `statsService.ts:639` | 2.1ms | StatsPage 1 次（无 memo，`:185`） | 小，但与 weekly 同属「每次渲染重算」 |
| `computeStreakWithGrace` | `statsService.ts:584` | 2.9ms | **同一页面 3 次**（`StatsPage.tsx:132` + `:211` + `milestoneService.ts:69` 经 `buildMasteredMilestone`） | 每渲染浪费 5.8ms |
| `computeStreak` | `statsService.ts:549` | 2.9ms | AppLayout + 页面各 1 次（`App.tsx:102` + `TodayPage.tsx:72`） | 同一次导航 2 次 |
| `getUnitStats` | `unitService.ts:15` | 6.1ms/本（2400 卡词书 62ms） | **UnitsPage 54 次**（`:1216` 每本 + `:210`） | 5000 卡 / 26 本时约 330ms/渲染；卡数与词书数同时增长 → 平方级 |
| `buildDailyDirective` | `dailyDirectiveService.ts:93` | 7.4ms | UnitsPage 1 次（有 memo） | 有 memo，但内部 80 次全量遍历（§2.1） |

**实测汇总**（PF2e / PF2f，5000 卡）：

```
[PF2e] StatsPage（StatsPage.tsx）每次渲染的固定开销（5000 卡 / 15000 复习）
  getWeeklyStatsReport（:107，无 memo）                              46.49ms
  getDueForecast（:185，无 memo）                                     2.14ms
  → StatsPage 一次渲染的「全库重算」合计 ≥ 48.6ms（还不含 stats/streak/weakInsights/maturity）

[PF2f] StatsPage（5000 卡）挂载+落定耗时 582ms
     3 × computeStreakWithGrace
     1 × getLearningStats
     1 × getWeeklyStatsReport
     1 × getDueForecast
     1 × getWeakCardInsights
```

`computeStreakWithGrace` 实测 **3 次**（不止静态读到的 2 个调用点——`buildMasteredMilestone` 经 `milestoneService.ts:69` 又调一次）。

**`AppContext.tsx:170-190` 的额外未缓存项**：该 effect 在**每次 `data` 变化**时执行 `JSON.stringify(data)`（第 173 行）做「是否已同步」比对——这是又一次全量序列化，且只在配置了云同步时才有意义，当前实现无论是否配置都会先 `isDataSyncConfigured` 早退（✅ 已早退，影响可控）。

---

## 5. 存储层规模问题（每次操作全量序列化）

### 5.1 事实链（**当前代码**，已被并行修改）

```
AppContext.commitData（src/AppContext.tsx:60）
  → saveData（src/services/storage.ts:1299）
    → shouldSkipMigration(data) 判断
        ├─ 满足（schemaVersion 匹配 + 关键数组齐全）→ 直接 writeRaw   ← 新增的快速路径
        └─ 不满足 → migrateData(data) → writeRaw                      ← 导入/重置/升级时才走
    → writeRaw → JSON.stringify(整个 AppData) + localStorage.setItem
```

**改动前后对比**（`storage.ts` 于 08:47:50 被改）：

| | 改动前 | 改动后 |
|---|--------|--------|
| 日常答题路径 | 迁移 + 序列化 + 写盘 | **仅序列化 + 写盘** |
| `saveData(5000 卡)` | 9.3ms（迁移被预热掩盖，见下注） | 10.3ms（纯 stringify + setItem） |
| 导入备份 / 重置 / 版本升级 | 迁移 + 序列化 + 写盘 | 不变（仍需迁移，命中 O(cards²)） |

> **⚠️ 一处测量踩坑，必须写明**：我在 `pf2c` 里同时测 `saveData(data)` 与 `migrateData(data)`，得到
> 「`saveData` 9.3ms < `migrateData` 60ms」的**不可能结果**（`saveData` 内部必然调用 `migrateData`）。
> 为此专门加了 `pf2j-measurement-selfcheck.test.ts` 排查，结论：**不是测量误差，而是测量期间代码被改**——
> 08:47 之后 `saveData` 已跳过迁移，所以它确实比单独调 `migrateData` 快。
> 教训：在共享工作树上做计时，必须记录每个被测文件的 mtime，并复测确认基线未变。

### 5.2 三段拆解（jsdom，中位数 3 轮，**09:01 重测**）

| 卡片数 | `saveData` 总耗时 | `JSON.stringify` | `migrateData`（单独调） | 体积（UTF-16） | 写盘 |
|--------|-------------------|------------------|--------------------------|----------------|------|
| 100 | 0.2ms | 0.2ms | 0.3ms | 147 KB | ✓ |
| 1000 | 2.2ms | 2.0ms | 5.9ms | 1468 KB | ✓ |
| 5000 | **10.3ms** | 10.3ms | 102.9ms | 7409 KB | ✓ |
| 20000 | **写入失败** | 38.0ms | **1176.2ms** | 29810 KB | ✗ QuotaExceeded |

**读法**：`saveData` 一列现在≈`JSON.stringify` 一列（差一个 `setItem`）——迁移已被跳过。
`migrateData` 一列是「导入备份 / 重置 / 版本升级」时的成本，**仍随卡片数平方增长**。

`migrateData` 单独曲线（未受修复影响）：

| n | 耗时 | 形态 |
|---|------|------|
| 100 | 0.22ms | — |
| 1000 | 3.85ms | 17.6x（规模 10x） |
| 5000 | 62.98ms | 16.4x（规模 5x） |
| 20000 | **931.15ms** | 14.8x（规模 4x） |

**超线性确认（≈O(n²)）。** 来源（`storage.ts`，未改）：
- `:362` `normalizeWordDetails` — 每条 `wordDetails` 做 **2 次** `cards.find`（`cards.find(word)` + `cards.find(id)`)
- `:389` `normalizeSentenceDetails` — 同上
- `:1195` `ensureDefaultUnits` — 每条无 `unitId` 的卡做 `cards.findIndex`（最坏 O(cards²)）
- `bookRestructureService.ts:108` `restructureOversizedUnits` — 每本超限书 `getUnitWordCards` 扫全库
- 线性部分（无问题）：`normalizeSchedules`（Set + Map）、`fillMissingDetails`（2×filter）

最坏情形（词卡全无 `unitId` + 只有 1 本词书）：n=20000 时 **1551.61ms**。**后果**：用户首次导入一个 2 万条记录的备份 / 老数据升级时，会有约 1 秒的同步阻塞（无进度、无异步）。

### 5.3 体积 / 配额断点（未受修复影响，**当前仍然存在，P0**）

| 卡片数 | JSON 字符数 | UTF-16 体积 | 写入 |
|--------|-------------|-------------|------|
| 1000 | 751,780 | 1468 KB | ✓ |
| 3000 | 2,268,117 | 4430 KB | ✓ |
| 5000 | 3,793,430 | 7409 KB | ✓ |
| 6000 | 4,556,201 | 8899 KB | ✓ |
| 7000 | 5,318,948 | 10389 KB | ✗ 配额溢出 |
| 20000 | 15,262,904 | 29810 KB | ✗ 配额溢出 |

**jsdom 实测断点：约 6,600 卡 / 5,000,000 字符。**
**换算到真实浏览器**：Chrome/WebKit 的 5MB 配额按 UTF-16 字节计 = **2,500,000 字符**；按实测 2537 字符/卡 折算 → **约 985 卡**被 5MB 字节配额击中？——精确起见按两种口径都给：
- 按 jsdom 的「5,000,000 **字符**」口径 → 约 **6600 卡**
- 按真实浏览器「5MB **字节** = 2,500,000 字符」口径 → 约 **985 卡** 触及该上限；若浏览器按 UTF-16 code unit 计（多数实现的实际行为）= 5,000,000 字符 → 约 **6600 卡**

> 这一条我无法在 node/jsdom 里给出确定答案（jsdom 的 5,000,000 code unit 与真实浏览器 5MB 的换算取决于引擎实现）。
> **建议在真实 Chrome + 真实数据上复测一次确认断点**，这是本报告唯一需要外部确认的数字。
> 可确定的是：**`LOCAL_STORAGE_SOFT_LIMIT_KB = 4096`（`storage.ts:1326`）在约 3000 卡时被突破**，此后设置页会持续报「体积超限」。

超过配额后：**任何一次操作都会写盘失败**——内存态已更新（界面变了）、磁盘没变；`AppContext.commitData` 的 catch 只把 `saveError` 变成一条横幅（`AppContext.tsx:60-73`），**用户重启后改动全部消失**。

### 5.4 「每次操作都全量序列化」何时成为瓶颈（**当前代码**）

| 卡片数 | 单题落盘 | 一节课 30 题累计阻塞 |
|--------|----------|----------------------|
| 100 | 0.2ms | 6ms |
| 1000 | 1.9ms | 58ms |
| 5000 | 9.6ms | 287ms |
| 20000 | 写盘失败（配额） | — |

**判定（修复后）**：
- 单次落盘的**迁移开销已被消除**，现在只剩 `JSON.stringify(整个 AppData)` + `setItem`。
- **约 5000 卡**时单题 9.6ms、30 题累计 287ms —— 这是**纯序列化**的成本，仍可感知（每次评分点击后同步阻塞）。
- **约 1000–3000 卡**时累计 30 题在 58–170ms 区间，属「轻微顿感」。
- **配额断点**（§5.3）是比序列化更早、更硬的问题：一旦触及，功能直接失效。

### 5.5 长期用户模型（卡片数不变、复习记录持续累积）

复习记录是**永久追加**的（`applyReview` 只 `push`、从不裁剪，`reviewService.ts:575`）：

| 阶段 | cards | reviews | 体积 | 单次 `saveData` |
|------|-------|---------|------|-----------------|
| 第 1 周（1000 卡 × 1） | 1000 | 1000 | 1468 KB | 2.0ms |
| 第 1 月（1000 卡 × 4） | 1000 | 4000 | 2406 KB | 3.6ms |
| 第 3 月（1000 卡 × 10） | 1000 | 10000 | 4282 KB | 6.3ms |
| 第 6 月（1000 卡 × 20） | 1000 | 20000 | **7429 KB** | **10.6ms** |

**1000 张卡用半年就会超过软上限（4096KB）并在 10.6ms/次落盘上运行**——卡片数可以长期不变，这条曲线仍在上涨。

5000 卡数据的体积构成：`cards` 2616 KB + `reviews` 1576 KB + `wordDetails` 1324 KB + `schedules` 1275 KB + `sentenceDetails` 570 KB ≈ **7409 KB**。

---

## 6. 确认的缺陷 vs 可疑但未证实

### 6.1 当前代码里仍存在的缺陷（有实测证据）

| 严重度 | 缺陷 | 文件:行号 | 证据 |
|--------|------|-----------|------|
| **P0** | localStorage 配额断点：数据超过上限后每次操作都写盘失败，用户重启后改动消失 | `storage.ts` 体积算术 + `AppContext.tsx:60-73` | 5000 卡 7409 KB；6000 卡可写、7000 卡溢出（jsdom 5,000,000 字符口径）；软上限 4096KB 在约 3000 卡突破 |
| **P1** | 错词本页两轮 `O(条目 × reviews)` 同形计算，未复用索引 | `pages/MistakeBookPage.tsx:128`、`:408`、`:421` | 5000 卡 → 建索引 7.4ms、两轮各 100.6ms（合计是建索引的 27 倍） |
| **P1** | `getUnitStats` 每卡 `schedules.find` 线性查找；UnitsPage 每本调一次、共 54 次，且无 memo | `services/unitService.ts:26`、`pages/UnitsPage.tsx:1216` | 2400 卡词书 → 62.2ms/次（60 卡 → 1.7ms，即 40x 卡 → 37x 耗时）；插桩实测 UnitsPage 挂载 54 次 |
| **P1** | `buildDailyDirective` 对每本词书各调一次 `buildSpellingQueue` + 各扫一遍全部词卡 | `services/dailyDirectiveService.ts:194-204`、`:174`、`:76-91` | 20 本词书 → 80 次全量遍历（插桩实测）；n=20000 → 27.8ms（超帧） |
| **P1** | `migrateData` O(cards²)：嵌套 `find`（现只在导入/重置/升级路径命中） | `storage.ts:362/389/1195` | n=20000 → 931ms（最坏 1552ms）；10x 规模 → 17.6x 耗时 |
| **P1** | `getWeeklyStatsReport` 7 天 × 全量扫描 + StatsPage 无 memo | `services/statsService.ts:383-399`、`pages/StatsPage.tsx:107` | n=20000 → ~80ms；每渲染重算（PF2f 插桩：1 次/挂载，但无 memo 故每次渲染） |
| **P1** | `getLearningStats` 内部 28 次全量遍历 × 5 个页面无 memo | `services/reviewService.ts:207` | n=20000 → 35.0ms/次；15 次 `activeCards.filter` 可用一趟循环替代 |
| **P1** | 单题全量序列化（迁移已消除，序列化仍在） | `AppContext.tsx:60` → `storage.ts:1299` | 5000 卡单题 9.6ms、30 题累计 287ms（同步阻塞） |
| P2 | `summarizeHuntProgress` O(cases × results) | `services/huntService.ts:432` | 2000 条结算 → 3.1ms（`some` 提前返回，仍便宜） |
| P2 | `listHuntCasesWithLock` O(cases × lessons) | `services/huntService.ts:80`、`:105` | 0.24ms（题库固定，不会恶化） |
| P2 | `computeWeakSpotsReport` 在 GrammarPathPage 一次渲染算 3 次 | `pages/GrammarPathPage.tsx:637`、`:639`、`:641` | 每次 `:639`/`:641` 内部各自再调一次 `computeWeakSpotsReport` |

### 6.2 本轮已被并行修复（保留作验收基线）

| 项 | 修复位置 | 修复前 | 修复后 |
|----|----------|--------|--------|
| `getWeakCardInsights` 的 O(cards × reviews) | `reviewService.ts:307-330`（建两个 Map 索引） | n=20000 → 3487ms；8x 卡片 → 60.4x 耗时 | n=20000 → **8.79ms**（397x 提升）；已线性 |
| `buildSpellingQueue(mistakes)` | 随上一项自动修复 | n=5000 → 105.8ms；n=20000 → 1462.7ms | n=5000 → 2.67ms；n=20000 → **8.88ms**（165x 提升） |
| `saveData` 每次重跑 `migrateData` | `storage.ts:1281-1302`（`shouldSkipMigration` 快速路径） | 5000 卡每次落盘含 63–103ms 迁移 | 仅序列化 + 写盘（5000 卡 10.3ms） |

> 这三个修复**不是本报告实施的**（见 §0 的基线变动声明）。它们的实现质量我做了交叉验证：
> `shouldSkipMigration` 检查 `schemaVersion` 与 9 个关键数组的存在性，任一项不符即退回完整迁移——
> 「外部塞进来的裸数据」仍会被归一化，没有把非法结构直接落盘的口子。

### 6.3 可疑但未证实

| 项 | 状态 | 缺什么证据 |
|----|------|-----------|
| `statsService.ts:409` 的 `[...prev, review]` 追加 | **该处自身确认 O(单卡历史²)**（深度 2x → 3.6–4.6x 耗时；50 卡 × 4000 条时 247.8ms vs `push` 写法 3.7ms，**浪费 244ms / 67.7x**）；但**端到端 `getWeeklyStatsReport` 仍近似线性**（每档约 2x），因线性项在 4–16 万条区间盖过它 | 「何时开始支配端到端」的交叉点未实测。属**写法导致的平方项 + 未来风险**。换 `push` 可零语义变更地消掉它 |
| `computeWeakSpotsReport` 随遥测 + 卡片增长 | 静态读取有 5 处内层 `find`（含 `data.cards.find`，`:385`，**随卡片数增长**），且一次渲染算 3 次 | 未实测遥测满载（3000 条）× 大卡库的曲线；测试数据无遥测事件，实测 ~0ms |
| `AppContext.tsx:173` 每次 data 变化 `JSON.stringify(data)` | 有 `isDataSyncConfigured` 早退保护 | 未配置云同步时无代价；配置后是又一次全量序列化，未单独计时 |
| localStorage 配额断点的浏览器口径 | jsdom 口径测得约 6600 卡；按「5MB = 2,500,000 字符」折算约 985 卡 —— **两者差 6.7 倍，无法在 jsdom 里判定** | **需在真实 Chrome + 真实数据上复测**。这是本报告唯一需要外部确认的数字 |

### 6.4 曾怀疑、实测否定（避免后续重复排查）

- **`diversifyReviewModes` 的 O(session²)**：真实输入恒为 ≤10 张（`GrammarReviewPage.tsx:52`、`drive.ts:97`），单独成本 0.001ms、与规模完全无关。会话上限 10 是唯一保护。**注意**：若将来放宽 `GRAMMAR_REVIEW_SESSION_LIMIT`，这条会立刻变成 O(session²)（未截断输入实测 n=20000 → 195ms）。
- **`computeWeakSpotsReport` 随卡片规模恶化**：输入是遥测事件（上限 3000），不随卡片增长（实测 4 档均 ~0.00ms）。
- **`getMistakeGroupsByDate` 建索引本身**：线性（100→20000 卡：1.31ms→15.16ms），问题在页面侧复用不足（§2.5）。
- **`getLearningStats` 是超线性的**：实测线性（8x 规模 → 9.0x 耗时），内部全是单遍 filter，无嵌套 `find`。

---

## 7. 「超过 16ms（一帧）」的规模拐点汇总（**当前代码**）

| 函数 | 首次超帧的规模 | 该规模耗时 | 状态 |
|------|----------------|-----------|------|
| ~~`getWeakCardInsights`~~ | ~~1000–5000 之间~~ | n=5000 曾是 140.5ms | ✅ **已修复**（n=5000 → 2.14ms，n=20000 → 8.79ms，**不再超帧**） |
| ~~`buildSpellingQueue(mistakes)`~~ | ~~1000–5000 之间~~ | n=5000 曾是 105.8ms | ✅ **已修复**（n=5000 → 2.67ms，n=20000 → 8.88ms，**不再超帧**） |
| `buildSpellingQueue(unit, smart)` | 20000 | 19.2ms | ⚠️ 仍存在 |
| `getLearningStats` | 20000 | 35.0ms | ⚠️ 仍存在（5 个页面无 memo） |
| `buildDailyDirective` | 20000 | 27.8ms | ⚠️ 仍存在 |
| `getWeeklyStatsReport` | 5000 | 20.0ms | ⚠️ 仍存在（无 memo） |
| `getVocabularyGoalStats` | 20000 | 16.1ms | ⚠️ 仍存在 |
| `buildGrammarReviewSession` | 未超（20000 时 12.3ms，逼近） | 12.3ms | 观察 |
| **`saveData`（单题落盘，纯序列化）** | **约 3000–5000 卡** | n=5000 → 9.6ms/次，一节课累计 287ms | ⚠️ 仍存在 |
| **localStorage 配额硬断点** | **约 6600 卡（jsdom 口径）** | 数据不再保存 | ⚠️ **仍存在，P0**（真实浏览器口径待确认，见 §6.3） |
| `migrateData`（导入/升级路径） | 约 1500–3000 卡 | n=5000 → 63ms | ⚠️ 仅导入/重置/升级时命中 |

**当前首要目标**（由用户数据增长触发、用户可感知）：
1. **localStorage 配额断点**（P0，功能失效级：改动静默丢失）。
2. **`getUnitStats` 在 UnitsPage 的 54 次调用 × 每次 62ms**（P1，首屏可感知；卡数越大越慢，且词书越多调用越多）。
3. **错词本页 200ms 级的数据准备**（P1，进入错词本可感知）。
4. **`getWeeklyStatsReport` / `getLearningStats` 的无 memo 重算**（P1，StatsPage 每次渲染 60ms+）。

---

## 8. 新增测试文件与运行结果

全部位于 `src/edge/verify/`，命名 `pf2*`：

| 文件 | 环境 | 内容 |
|------|------|------|
| `src/edge/verify/pf2Scale.ts` | — | 规模数据构造器（`scaleData`）+ 预热/多轮计时器（`timeMedian`）；非测试文件 |
| `src/edge/verify/pf2a-scale-curves.test.ts` | node | 关键路径规模曲线（复习组会话 / 拼写队列 / 每日指令 / 统计 / 错词本周报弱点），内建超线性断言 |
| `src/edge/verify/pf2b-index-reuse.test.ts` | node | 重复建索引与全库扫描计数（`vi.mock` 插桩） |
| `src/edge/verify/pf2c-storage-scale.test.ts` | jsdom | `saveData` 三段拆解、配额断点、`migrateData` 超线性、长期用户模型 |
| `src/edge/verify/pf2d-superlinear-attribution.test.ts` | node | 超线性归因（拆到具体那一行） |
| `src/edge/verify/pf2e-cache-candidates.test.ts` | node | 缓存候选的实际代价（7 个候选） |
| `src/edge/verify/pf2f-page-call-counts.test.tsx` | jsdom | 真实挂载的页面级调用计数（5 个页面插桩） |
| `src/edge/verify/pf2g-fixed-corpus.test.ts` | node | 固定题库（课程 / 案件）侧扫描成本 |
| `src/edge/verify/pf2i-append-rebuild.test.ts` | node | 追加式数组重建的平方项（含 `push` 对照） |
| `src/edge/verify/pf2j-measurement-selfcheck.test.ts` | jsdom | **测量自检**：`saveData` vs `migrateData` 的矛盾排查（发现基线被并行改动） |

**运行结果（09:06，当前代码）**：

```
$ npx vitest run src/edge/verify/pf2*.test.ts src/edge/verify/pf2*.test.tsx
 Test Files  10 passed (10)
      Tests  60 passed (60)
   Duration  18.28s
```

> 注：`pf2j` 是一条**元测量**用例——它存在的价值是证明「我量到的矛盾是基线变动、不是测量误差」。
> 若将来 `saveData` 又回到「每次必迁移」，`pf2j` 会失败并提示。
>
> 注：同一目录下还有一个 `src/edge/verify/pf2-answer-hotpath.test.tsx`（「答题热路径」），
> **不是本任务的产物**，它来自并行会话（命名碰巧同前缀）。上面 10 个文件才是本轮新增。

（`src/edge/verify/pf2f-page-call-counts.test.tsx` 自补了 jsdom 缺失的 `matchMedia` / `ResizeObserver`；未改动共享的 `src/edge/harness.tsx`。）

**关于 `src/` 产品代码**：我**没有修改任何产品代码**。`git status` 里 `src/` 的 `M` 条目
（`App.tsx` / `AppContext.tsx` / `reviewService.ts` / `storage.ts` 等）来自并行会话，非本任务。
我新增的只有上表 10 个文件（均为 untracked）。

---

## 9. 测量环境与可外推性

| 项 | 说明 |
|----|------|
| Node 环境（PF2a/b/d/e/g/i） | `// @vitest-environment node`，Node 自带 V8，**无 jsdom DOM 开销**；纯函数计时接近浏览器 V8 的**计算**部分 |
| jsdom 环境（PF2c/f） | `// @vitest-environment jsdom`；有 `localStorage`（配额 5,000,000 code unit）与 DOM，但对纯计算函数引入额外噪声（同函数在 jsdom 里通常比 node 慢） |
| 计时方法 | `performance.now()`；每次测量**预热 1 次**消除 JIT 冷启动，再取 **5 轮中位数**（`timeMedian`）抗离群 |
| 重复轮数 | 曲线类 5 轮；`saveData`/`migrateData` 这类较贵的用 3 轮 |

**绝对数值的可外推性**：

- ✅ **可外推（结构性结论）**：复杂度阶数、超线性比（如「8x 规模 → 60x 耗时」）、扫描次数、体积与配额算术、调用次数。这些与运行环境无关。
- ⚠️ **需打折（绝对毫秒）**：node 与真实浏览器 V8 同为 V8，**纯函数毫秒级结论量级可比**，但真实浏览器里还要叠加 React 渲染、布局、GC 竞争，**用户可感知的卡顿只会更重，不会更轻**。因此「5000 卡 140ms」在浏览器里应视为下界。
- ⚠️ **jsdom 侧的 `saveData` 绝对毫秒偏低**：jsdom 的 `localStorage` 是内存实现，真实磁盘/IndexedDB 后端通常更慢。
- ✅ **配额断点是算术**：jsdom 的 5,000,000 **字符**配额与真实浏览器配额口径不同（Chrome 按 5MB 计，换算成字符数取决于引擎按 UTF-16 code unit 还是字节计）。因此我**只报 jsdom 实测值（约 6600 卡）**，并把真实浏览器断点列为**待确认**（§6.3）。可确定的是 `LOCAL_STORAGE_SOFT_LIMIT_KB = 4096` 在约 3000 卡被突破，以及「体积/卡 ≈ 1.49 KB」这个斜率（这是纯算术）。

**数据构造与真实数据的偏差（不影响阶数，但影响绝对规模映射）**：
`scaleData` 里每卡 1 条 review、每 20 张词卡一本词书、40% 语法句子卡。真实用户可能是「更少卡片 × 更多复习」（§5.5 的长期模型更接近），此时：
- `getWeakCardInsights` 的 cards × reviews 乘积项在「卡片少、复习多」下增长更慢；
- 但**体积与落盘成本只取决于总记录数**，因此 §5.5 的 1000 卡 × 20 复习 = 10.6ms 是更贴近真实长期用户的点。

---

## 10. 建议的修复优先级（仅供排期参考，本轮未实施）

**已经由并行工作完成的（无需再排）**：`getWeakCardInsights` 索引化、`buildSpellingQueue(mistakes)`（随之自动）、`saveData` 跳过重复迁移。

**当前代码里仍待修的**：

| 优先级 | 动作 | 预期收益 |
|--------|------|----------|
| 1 | **配额困境**：复习记录裁剪/归档（`applyReview` 只 push 不删，`reviewService.ts:575`），或把 `reviews` 迁出 localStorage（IndexedDB / Tauri SQL——项目已依赖 `@tauri-apps/plugin-sql`） | 从根上压住 §5.5 的体积曲线；否则约 1000 卡 × 20 复习（半年）就逼近软上限 |
| 2 | `getUnitStats`：`unitService.ts:26` 的 `data.schedules.find` 改为调用方传入或内部建一次 `Map<cardId, Schedule>`；并给 UnitsPage `:1216` 加 `useMemo`（按 `data.cards` + `data.units` 缓存每本统计） | 2400 卡词书 62ms → ~2ms；UnitsPage 54 次调用从 330ms → 十几毫秒 |
| 3 | 错词本页：`MistakeBookPage.tsx:408` 的 `getGroupProgress` 直接复用 `:421` 的 `entryInsights`（两者形状完全相同）；并把 `getMistakeInsight` 的 `reviews.filter` 换成一次性建的 `Map<cardId, Review[]>` | 省掉一轮 100ms（5000 卡），总计 208ms → ~110ms；再索引化可到 ~10ms |
| 4 | `migrateData`：`normalizeWordDetails`/`normalizeSentenceDetails` 改传 `Map<id, Card>` 与 `Map<word, Card>`（`storage.ts:362/389`）；`ensureDefaultUnits` 同样改 Map（`:1195`） | O(cards²) → O(cards)；导入 2 万条记录的备份从 931ms → ~20ms |
| 5 | 给 `getLearningStats` / `getWeeklyStatsReport` / `getUnitStats` / `computeStreak*` 加页面级 `useMemo`（stats/weekly/forecast/streak 四份都在 `StatsPage` 渲染体内，同类模式在 5 个页面重复） | 每渲染固定开销从 60ms+ 降到 0（5000 卡）；这是**投入最小、收益面最广**的一项 |
| 6 | `buildDailyDirective`：先一次遍历建 `Map<unitId, Card[]>` 与 `Map<unitId, dueCount>`，取代 `dueCountOf`（`:194`）与逐本 `queueFor`（`:115`） | units × cards → cards；20 本的 80 次全量遍历 → 约 3 次 |
| 7 | `statsService.ts:409` 改 `push` 写法（与已修复的 `getWeakCardInsights` 同款改法） | 消掉平方项（零语义变更）；当前未支配端到端，属预防性 |
| 8 | `getLearningStats` 里 15 次 `activeCards.filter` 合并成一趟循环 | 常数级优化（约省 15 次遍历） |
| 9 | `computeWeakSpotsReport` 在 `GrammarPathPage.tsx` 的 3 次调用收敛为 1 次（`:637` 结果传给 `:639`/`:641`） | 省 2 次全量扫描（含内层 `find`） |

**验收建议**：`getWeakCardInsights` 与 `saveData` 的修复已有「修复前 vs 修复后」的实测基线（§6.2），
其对应的测试用例已内建**超线性断言**（`pf2a` / `pf2d`）——若将来有人把索引改回 `find`，这些用例会立刻失败。
