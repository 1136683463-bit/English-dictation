# 老数据行为一致性审计（MG 系列，2026-09-22）

**范围**：字段不全 / 字段是旧名 / 早期版本结构的老用户数据，在新代码下**每一项功能**是否正确
（不只是「能加载」）。
**入口**：`seedAppData` → `parseBackupJson` → `applyStartupMigration(migrateData(raw))`
—— 与 `loadData` / `restoreDataFromJson` 同一条管线，也和 `AppContext.commitData → saveData` 的每次写回同一条。
**是否改产品代码**：未改。仅新增测试文件（`src/edge/verify/mg5..mg9` + `mgLegacy.ts`）。

> **行号说明**：本报告在 `HEAD = 22d53c2` 上完成，但审计过程中**另一个会话正在并发编辑
> `src/services/storage.ts`（+77 行）与 `src/pages/GrammarPathPage.tsx`（+14 行）**，
> 因此 storage.ts 的行号会漂移。每条引用都同时给出**函数/常量名**——
> 请以符号名为准定位（例如「`normalizeSchedules` 的 `createDefaultSchedule` 兜底」），
> 括号里的行号是撰写时刻的值。

---

## 0. 执行摘要

| 结论 | 条目 |
|---|---|
| 确认缺陷（4 项） | ① 无 `tags` 的语法卡从语法复习链路整体消失（P1）；② 老句子卡 `back` 为空 → `/review` 题面等于答案（P1，hunt/diary 来源不在修复范围）；③ 无 `unitId` 的老词卡被编入内置「核心100」，与「学习范围锁定」叠加后用户的词会从全局队列消失（P1）；④ 「已破案」判定用 `found === 案件当前实际错数`，历史 `total` 与现版本不一致时已破案被少算（P2） |
| 可疑但未证实 | ⑤ 缺 `seededWordVersions` 时补种 100 词（机制确认，但对真实老用户的影响取决于该字段上线时间）；⑥ `normalizeDiaryEntries` 丢弃缺 `questionId` 的行程（机制确认，历史数据是否真的缺该字段未能确证） |
| 验证后无问题 | 三关卡回填与解锁、`recoveryCount` 康复摘星、`nextReviewAt` 三种脏值形态、`reviews` 缺失时的弱点/掌握/连胜、日记 `status`/`issues` 补默认值、`huntResults` 缺失、`fillMissingDetails` 补出的空详情渲染、全站 15 个页面无 `NaN/undefined/null/Invalid Date` |

**数字口径要点**：老数据升级后，**课程进度、侦探统计、日记统计、词书卡数**都与老数据实际内容一致；
**语法掌握数（`共 M 句`）** 与 **到期数** 在两类老数据下会偏小/偏大（见 §5）。

---

## 1. 老数据 → 语法模块

夹具：`src/edge/verify/mgLegacy.ts`；用例：`src/edge/verify/mg5-legacy-grammar.test.tsx`（23 tests，全绿）。

### 1.1 只有 `grammarLessonsDone`、没有 `grammarLessonStagesDone`

| 功能 | 实际行为 | 正确？ | 证据 |
|---|---|---|---|
| 迁移回填 | `grammarLessonStagesDone[lessonId] = [1]` | ✅ | `storage.ts` `migrateData` 末尾「F1 旧数据回填」段（撰写时刻 :1043-1053）；用例「迁移时回填…=[1]」 |
| 课程地图关卡状态 | 关 1 `done`、关 2 `open`、关 3 `locked` | ✅ | 用例「课程地图：已完成课的关 1 显示为『已走过』…」断 `.lesson-stage-node` 三态 |
| 次日回访入口 | 解锁；页面正常出题，不显示锁定空态 | ✅ | `lessonService.ts:164-166`（无完成时间戳 → 按已满次日窗）；用例「次日回访页可直接进入并渲染题目」 |
| 旧案重审入口 | 关 2 未完成 → 锁定，给明确引导，不崩、无占位词 | ✅ | `lessonService.ts:174`；用例「旧案重审页在关 2 未完成时给明确引导」 |
| 页头「X / N 课」 | 计入已回填的课 | ✅ | 用例「关 1 完成后可见页码」 |
| 关 2 解锁时间戳来源 | 遥测无记录 → 直接解锁（**不会**永久锁关） | ✅ | `lessonService.ts:165-166`；本项是易错点，已验证 |

> 附：季内「X / Y 课」的分子恒 ≤ 分母（用例逐季校验），无越界显示。

### 1.2 卡片没有 `tags` / 没有 `sourceId`

| 功能 | 实际行为 | 正确？ | 证据 |
|---|---|---|---|
| 迁移 | `tags` 缺失 → 补 `[]`（不是 `undefined`，调用方 `.includes` 不崩） | ✅ | `storage.ts` `normalizeCard` 的 `tags: asStringArray(value.tags)`（撰写时刻 :330） |
| **语法复习队列** | **只缺 `tags` 的同一张语法卡完全进不了队列** | ❌ **P1** | `grammarReviewService.ts:38-39`（`isGrammarSentenceCard`）；用例「★ 无 tags 的语法句子卡会从语法复习队列里静默消失」 |
| 「共 M 句」分母 | 只数得到带标签的卡 → 分母偏小 | ❌ **P1（同源）** | `grammarReviewService.ts` `summarizeGrammarMastery` 的标签过滤（撰写时刻 :203）；用例「★ 缺 tags 也会漏掉『已掌握』统计」 |
| `sourceId` 缺失 | 不影响到期队列（它只用于交错与展示，不是筛选条件） | ✅ | 用例「有无 sourceId 不影响到期队列」 |
| 复习页渲染 | 空态正确、无占位词 | ✅ | 用例「复习页在『无 tags 卡』数据下渲染」 |
| 负向对照 | 补上 `tags` 后同一张卡立刻回队列 | ✅ | 用例「负向对照：把 tags 补上后…」 |

**机制与历史**（`git` 确证）：
- 筛选条件是 `card.tags.includes("语法")`（`grammarReviewService.ts:39`、`203`；`reviewService.ts:37`、`486`）。
- 日记来源卡的标签**在 `af1b9f1`（2026-09-22 01:00）之前一直是 `"日记"`**，该提交才改成 `"语法,日记"`
  （`git log -S 'tags: "语法,日记"' -- src/services/diaryService.ts` → `af1b9f1`；
  `7ad13f5`/`61813a4`/`da58aae` 上均为 `tags: "日记"`）。
- 也就是说：**2026-09-12 ~ 2026-09-22 之间从日记入队的句子卡，全部只有 `"日记"` 标签**，
  在今天的代码下永远进不了语法复习队列。
- 这类卡**不会**被任何迁移修复（`migrateData` 只原样透传 `tags`，不做语义补全）。

**用户后果**：用户在日记里订正过的句子，曾经「入队成功」，升级后从语法复习里整体消失，
且界面无任何提示；掌握数分母同时偏小，用户看到的是「已掌握 1 / 共 1 句」这种虚假满分。

### 1.3 `schedules` 缺 `recoveryCount`

| 功能 | 实际行为 | 正确？ | 证据 |
|---|---|---|---|
| 迁移 | 保持 `undefined`（**不写 0**，不伪造康复进度） | ✅ | `storage.ts` `normalizeSchedules` 内 `...(item.recoveryCount !== undefined ? {...} : {})`（撰写时刻 :936-939）；用例「迁移后 recoveryCount 保持 undefined」 |
| 系统置位卡（无 `prioritySource`）首次通过 | 从 0 起算 → `recoveryCount = 1`，不摘星 | ✅ | `reviewService.ts:512-518`；用例「第一次通过后计数从 0 起算，不误摘星」 |
| 连续 2 次 ≥3 | 摘星并清 `prioritySource` | ✅ | `reviewService.ts:518`、`545-549`；用例「连续 2 次通过才摘星」 |
| 低分一次 | 清零重来，保持置位 | ✅ | `reviewService.ts:516`；用例「低分一次即清零重来」 |
| `prioritySource === "manual"` | 永不自动摘星、不维护该字段 | ✅ | `reviewService.ts:512`、`527`；用例「手动标星卡…无论通过几次都不摘星」 |

> 结论：`recoveryCount` 缺失是**向后兼容良好**的字段（注释 `types.ts:174-175` 的说法与实际一致）。
> 注意 `prioritySource` 的丢失是另一回事——该缺陷在本轮开始前已由 `mg1-card-fields.test.ts` 覆盖并修复，本轮复核确认修复有效。

---

## 2. 老数据 → 间隔重复

用例：`src/edge/verify/mg6-legacy-scheduling.test.tsx`（22 tests，全绿）。

### 2.1 `schedules` 完全缺失 → `normalizeSchedules` 补默认计划

补出来的计划是 `intervalDays: 0 / reviewCount: 0 / lapseCount: 0 / nextReviewAt: now`
（`storage.ts` 的 `normalizeSchedules` 末尾「给缺计划的卡补 `createDefaultSchedule`」兜底）。

**实际行为（分卡片状态）**：

| 卡片状态 | 通用复习队列（`getDueCards`） | 语法复习队列（`listDueGrammarReviewCards`） | 判定 |
|---|---|---|---|
| `status: "review"` / `"learning"` | **立刻到期、立刻进场** | **不进场**（被 `neverQueuedSchedule` 排除） | ⚠️ 两条口径不一致，见下 |
| `status: "new"` | 不进场，走每日新词配额 | 不进场 | ✅ 正确 |
| `mastered` / `suspended` | 不进场 | 不进场 | ✅ 正确 |

- **不是「永远不进」**：一旦复习过一次（`reviewCount` 或 `intervalDays` 或 `lapseCount` 任一非初始），
  语法队列即恢复正常（用例「补出默认计划后卡不会『永远不进』复习」）。
- **「立刻涌进」是真的**：`status=review` 的卡在通用队列（`/review`、`/spelling`、首页到期数）**立刻**出现。
  用例「★ 复习轨道卡（status=review）缺计划 → 立刻计入『到期』」断言 3 张卡一次性到期。
- **判定**：
  - 语法复习队列的排除是**有意设计**（`grammarReviewService.ts:71-79` 注释：避免空态文案「明天会排进这里」与「第 1 / 1 张」自相矛盾）→ ✅ 正确。
  - 通用队列把「排期未知」当作「今天就该复习」→ 属于**可接受的保守取向**（宁可早复习，不丢卡），
    但会让老用户首次打开时到期数骤然变大（§5 对照表）。**P2 体验**。
  - **两条队列的判定差异本身值得注意**：同一张卡在 `/review` 里要复习、在 `/grammar/review` 里被排除，
    用户在两处看到不一致的「今天要做的事」。**P2**。

### 2.2 `nextReviewAt` 的过去 / 非法 / 缺失

| 输入形态 | 迁移结果 | 是否到期 | 正确？ | 证据 |
|---|---|---|---|---|
| 合法过去时间 `2024-01-01…` | 原样保留 | ✅ 到期 | ✅ | 用例「过去时间 → 视为到期」 |
| 缺失（键不存在） | 补 `now` | ✅ 到期 | ⚠️ 语义被改写（排期未知 → 今天到期） | `storage.ts` `validIsoOrNow`（撰写时刻 :129-132）；用例「缺失 → 补成『现在』」 |
| 非法字符串 `"2026-13-45T99:99:99Z"` | 改写为 `now` | ✅ 到期 | ⚠️ 同上，但**不泄漏 Invalid Date**（关键正确性） | 用例「★ 非法字符串 → 被改写成『现在』」 |
| `""` / `null` / `0` / 数字时间戳 | 改写为 `now` | ✅ 到期 | ⚠️ 同上 | 用例「空字符串 / null / 数字时间戳」逐形态断言 |
| 未来时间（对照） | 原样保留 | ❌ 不到期 | ✅ | 用例「未来时间 → 不立刻到期」 |

> 关键正确性结论：**任何脏值都不会让 `Invalid Date` 泄漏到页面**（`validIsoOrNow` 兜底），
> 复习页在脏值数据下无占位词（用例「复习页在『脏 nextReviewAt』数据下不显示 Invalid Date 等占位词」）。
> 唯一语义代价：脏值一律被拉成「现在到期」，即**老卡被提前催复习**，不会丢卡、不会卡死。

### 2.3 `reviews` 缺失

迁移补空数组（`storage.ts` 的 `createInitialData()` 基线 + `reviews` 归一化），下游不崩。

| 功能 | 实际行为 | 正确？ | 证据 |
|---|---|---|---|
| 弱点统计 `getWeakCardInsights` | 无历史 → 产出空（不把卡误判为薄弱）；`wrongCount = 0`、`score` 有限 | ✅ | `reviewService.ts:342`；用例「弱点统计：不崩，且不把『无错记录』的卡误判为薄弱」 |
| 薄弱词 `getWeakCards` | 只把用户置位的卡算薄弱（`priority` 口径） | ✅ | 用例同上（两处口径差异已记录，非缺陷） |
| 错词本 | 空分组，不凭空多条目 | ✅ | 用例「错词本：无 reviews → 空分组」 |
| 连胜天数 `computeStreak` | `0`（不是 `NaN`） | ✅ | 用例「连胜天数：无 reviews → 0」 |
| 掌握数 | 只数 `status === "mastered"` 的卡，不凭空报 | ✅ | 用例「掌握判定：无 reviews →『已掌握 0』」 |
| 「连续 2 次输出通过」判定 | `isMasteredByOutput([])` → `false`；1 条满分记录 → `false` | ✅ | `grammarReviewService.ts:505-510`；用例「reviews 完全缺失…」+「只有 1 条 recall 满分记录」 |
| ⚠️ 历史 `rebuild` 混记成 `recall` | 2 条 `recall` 满分 → 判「已掌握」（**含 1 次拼词块**） | ⚠️ 已知且已被代码注释追认（`grammarReviewService.ts:495-504`：按宽口径保留、不追溯撤销） | 用例「★ 历史数据里 rebuild 与 free_type 都记成 recall」 |
| `stats` / `today` / `spelling` 页面 | 无占位词、有实际内容 | ✅ | 用例「三个页面…都不出现占位词」 |

---

## 3. 老数据 → 日记 / 侦探 / 词汇

用例：`src/edge/verify/mg7-legacy-diary-hunt-vocab.test.tsx`（37 tests，全绿）。

### 3.1 `diaryEntries` 缺 `status` / `issues`

| 功能 | 实际行为 | 正确？ | 证据 |
|---|---|---|---|
| 迁移 | `status` → `"pending"`、`issues` → `[]` | ✅ | `storage.ts` `normalizeDiaryEntries` 的 `status` / `issues` 两行（撰写时刻 :784 / :775-783）；用例「迁移补默认值」 |
| 日记页渲染 | 历史条目正常渲染（原句可见）、状态显示「待批改」、无占位词 | ✅ | 用例「日记页正常渲染历史条目」 |
| 进度数字 | 已写 1 条 / 覆盖 1 天 / 已批改 0 | ✅ 与内容一致 | 用例「进度条数字与老数据一致」 |
| **入复习队列** | **缺 `issues` 的条目无法入队**：`addDiarySentenceToReview` 直接返回；「加入复习队列」按钮不渲染 | ✅ 行为自洽（按钮与能力一致，非假承诺）| `diaryService.ts:352-353`；`GrammarDiaryPage.tsx:508`；用例「★ 缺 issues 的老日记无法入复习队列」 |
| 负向对照 | `issues` 有内容 → 产出卡片、带 `"语法"` 标签、`sourceId = diary:<id>` | ✅ | 用例「负向对照：issues 有内容的老日记能正常入队」 |
| 空 `issue` 列表渲染 | 不渲染空的调整列表 | ✅ | 用例「日记页在『issues 缺失』的条目上不渲染半截列表」 |
| ⚠️ 缺 `questionId` 的条目 | **整条被静默丢弃** | ⚠️ 见下 | `storage.ts` `normalizeDiaryEntries` 末段 `.filter((item) => item.answerEn && item.questionId)`（撰写时刻 :790）；用例「缺 questionZh 的老日记条目会整条被过滤掉」 |

**关于「缺 `questionId` 被静默丢弃」**：`normalizeDiaryEntries` 末段
`.filter((item) => item.answerEn && item.questionId)` 会把缺 `questionId` 的条目整条删掉，
用户**看得见的日记会凭空少掉若干条**（`summarizeDiaryProgress` 的「已写 N 条」随之变小）。
机制确证；但 `DiaryEntry.questionId` 自首个版本（`04c5ca1`）就存在，**是否能造出真实缺该字段的备份未能确证**
→ 归入「可疑未证实」（§6-⑤）。

### 3.2 `huntResults` / `huntAttempts` 缺失

| 功能 | 实际行为 | 正确？ | 证据 |
|---|---|---|---|
| 迁移 | 补空数组 | ✅ | 用例「迁移补空数组，进度汇总为 0」 |
| 进度统计 | 已破案 `[]`、累计误判 0、命中 0、罪名统计 11 项全 0 | ✅ | `huntService.ts:427-461`；用例同上 |
| 解锁 | 零进度 → 全部案件锁定、`hasUnlockedHuntCase` 为 false | ✅ | `huntService.ts:99-114`；用例「零进度老用户：全部案件锁定」 |
| 侦探页渲染 | 统计条与锁定案海正常，无占位词 | ✅ | 用例「侦探页在零进度老数据上正常渲染」 |
| 错词本 | 空分组，不凭空多条目 | ✅ | 用例「错词本在『无侦探记录』时为空分组」 |
| 有记录的旧数据 | 已破案 / 累计误判 / 命中数与 `huntResults`/`huntAttempts` 实际内容一致 | ✅ | 用例「有过破案记录的旧数据…与实际内容一致」 |
| 未知 `caseId` 记录 | 不污染页面（无占位词） | ✅ | 用例「侦探页在『案件引用了已删除卡片』…仍能渲染」 |
| **`found === 案件当前实际错数`** | 老记录 `total` 与现版本案件错数不一致时，**已破案被少算** | ❌ **P2** | `huntService.ts:428-434`；用例「★ huntResults 里 total 与当前案件实际错数不一致时，已破案数会少算」 |

**用户后果（P2）**：案件内容修订过（错点数变化）后，老用户「已破案 N」会小于他的实际战绩，
侦探页进度条与案卡星标不再点亮；数据没丢，但显示偏低。

### 3.3 词卡没有 `wordDetails`

| 功能 | 实际行为 | 正确？ | 证据 |
|---|---|---|---|
| 迁移补齐 | 每张词卡一条详情；`word` = 卡面小写、`chineseDefinition` = 卡背、其余空串（**不是 `undefined`**） | ✅ | `storage.ts` `fillMissingDetails`（撰写时刻 :410 起）；用例「迁移补齐 wordDetails：字段齐全、无 undefined 值」 |
| 拼写页 | 显示占位文案「无音标」，无 `undefined` | ✅ | 用例「拼写页在补齐的空详情上显示回退文案」 |
| 词库详情面板 | 选中卡片后正常渲染；空字段**整块不渲染**；无占位词 | ✅ | `LibraryPage.tsx:1100`；用例「词库页：补出来的空详情词卡…」 |
| 词库搜索 | 仍可按卡面 / 卡背搜到（不依赖详情字段） | ✅ | `LibraryPage.tsx:334-336` 的 searchable 拼接；用例「词库搜索：无详情老卡仍可按卡面与卡背搜到」 |
| 拼写队列 | 到期词在前、新词补足；`missingScheduleCards === 0` | ✅ | 用例「拼写队列在『无详情 + 有新词』的老数据上正常出词」 |
| **无 `unitId` 的老词卡** | **被编入内置「核心100 - Unit 1」**（归属被编造） | ❌ **P1** | `storage.ts` `ensureDefaultUnits` 的 `card.map`（撰写时刻 :1183-1203，关键行在 :1195-1197）；用例「★ 无 unitId 的老词卡被静默编入内置词书『核心100』」 |

---

## 4. 全站文本红线复查

用例：`mg7` 的「MG7-D 全站文本红线：老数据下 15 个页面不出现占位词」+ 各场景内的页面级扫描。
扫描模式：`/\bNaN\b|\bundefined\b|\bnull\b|Invalid Date/`（**整页 `textContent`**，非源码字符串）。

| # | 页面 | 路径 | 结果 |
|---|---|---|---|
| 1 | 课程地图 | `/grammar` | ✅ 无占位词 |
| 2 | 语法复习 | `/grammar/review` | ✅ |
| 3 | 语法课 | `/grammar/lesson/:id` | ✅ |
| 4 | 次日回访 | `/grammar/lesson/:id/revisit` | ✅ |
| 5 | 日记 | `/grammar/diary` | ✅ |
| 6 | 侦探 | `/grammar/hunt` | ✅ |
| 7 | 拼写 | `/spelling` | ✅ |
| 8 | 词库 | `/library` | ✅ |
| 9 | 首页 | `/today` | ✅ |
| 10 | 复习 | `/review` | ✅ |
| 11 | 句子 | `/sentences` | ✅ |
| 12 | 单词 | `/words` | ✅ |
| 13 | 词书 | `/units` | ✅ |
| 14 | 统计 | `/stats` | ✅ |
| 15 | 错词本 | `/mistakes` | ✅ |
| — | 词库详情面板（选中卡后，MG7-C 内单独断言） | `/library` 详情区 | ✅ |

**负向对照**（证明不是空断言）：检测逻辑对 `"共 NaN 句"`、`"已掌握 undefined / 共 3 句"`、
`"null 条记录"`、`"Invalid Date"` 均能命中，对 `"共 3 句，全部完成"` 不误报。

**测试环境说明**：`StatsPage` 依赖 `window.matchMedia`、`Segmented`/日记历史列表依赖 `ResizeObserver`，
jsdom 不提供 → 测试内加最小垫片（与既有 `a11y2-dom-scan.test.tsx` 同款）。
这是**环境缺失，不是老数据缺陷**；真机不受影响。

---

## 5. 页面数字 vs 老数据实际内容（对照表）

用例：`src/edge/verify/mg8-legacy-progress-numbers.test.tsx`（22 tests，全绿）。

| 页面数字 | 老数据实际内容 | 显示值 | 一致？ | 说明 |
|---|---|---|---|---|
| 课程进度 `X / N 课` | `grammarLessonsDone` 3 课 | `3 / 197 课` | ✅ | `lessonService.ts:469-478` |
| 课程进度（含已删除课 id） | 1 个有效 + 1 个失配 id | `1 / 197 课` | ✅ 不虚高 | 按「现存课程」过滤计数 |
| 课程进度（重复 id） | `[A, A, B]` | `2 / 197 课` | ✅ 不虚高 | `filter` 口径天然去重 |
| 课程进度（全部完成） | 197 课 | `197 / 197 课` + 「全部课程已完成」 | ✅ 无溢出 | 且不再显示「下一课」 |
| 语法掌握 `已掌握 N / 共 M 句` | 1 mastered / 1 进行中 / 1 未开始 | `已掌握 1 / 共 3 句 · 进行中 1 · 未开始 1` | ✅ | `grammarReviewService.ts:196-214` |
| 语法掌握（含 suspended） | 1 mastered + 1 suspended | `共 1 句` | ✅ 暂停卡不计入 | 与学习统计的 `suspendedCards` 分列 |
| **语法掌握（含无 `tags` 卡）** | **实际 2 张语法句子卡** | **`已掌握 1 / 共 1 句`（100%）** | ❌ **偏小** | 同 §1.2；P1 |
| 语法掌握（零语法卡） | 0 张 | 整块不渲染 | ✅ 不显示 `0 / 0` | `GrammarReviewPage.tsx:212` |
| 地图页「语法复习 · N 张到期」 | 2 张到期 + 1 张未来 | `2 张到期` | ✅ | `GrammarPathPage.tsx:920-925` |
| 地图页「N 张到期」（零完成课） | 1 张到期卡 | **入口整体不渲染** | ⚠️ 见下 | 首访分支不给该入口 |
| 复习页 `第 1 / 10 张` | 15 张到期 | `第 1 / 10 张` | ✅ 上限生效 | 与「15 张到期」是**两个口径**，需并读才不误解 |
| 首页到期数 | 3 张 `status=review`、缺 `schedules` | `3 个单词`到期 | ⚠️ **偏大** | 补默认计划所致（§2.1）；P2 |
| 首页新词数 | 2 张 `status=new` | `2 个新词还在队列里` | ✅ 与到期分列 | 不把新卡误报成到期 |
| 词书 / 词库卡数 | 3 张卡（含 `core-100-v1` 标记） | 3 张 | ✅ 不补种 | |
| **词库卡数（无 `seededWordVersions`）** | **原 1 张卡** | **> 90 张（补种核心词）** | ❌ **凭空多出** | §6-⑤；机制确证 |
| 侦探 `已破案 N / M` | 无记录 | `0 / 案件总数` | ✅ | |
| 侦探 `已破案 N / M` | 2 条完案记录 | `2 / M` | ✅ | |
| 侦探 `已破案`（同案多结算） | 1 案 2 条结算 | `1 / M`（去重） | ✅ 累计误判仍累加 | |
| 日记 `已写 N 条 / 覆盖 N 天 / 已批改 N` | 3 条 / 2 天 / 2 条 done | `3 / 2 / 2` | ✅ 逐位一致 | `diaryService.ts:123-134` |
| 日记（缺 `status`） | 1 条但全是 pending | `已批改 0` | ✅ 与内容一致 | 数字低于直觉但非误报 |
| 拼写页「当前 N / 重点 N」 | 无 `tags`/`wordDetails` 老卡 | 与实际卡数一致 | ✅ | 空详情不影响计数 |

**两个需并读才不误解的数字（P2 体验）**：
1. 地图页「N 张到期」vs 复习页「第 1 / 10 张」——15 张到期但会话只出 10 张，两处数字不同属**设计**（会话上限），
   但同一用户在同一天会看到「15」与「10」两个数字，文案未说明关系。
2. 首页「N 个单词到期」在缺 `schedules` 的老数据上会**一次性变大**（补默认计划所致），
   用户会以为「我欠了好多复习」。

---

## 6. 确认的缺陷 / 可疑但未证实

### 确认的缺陷

| # | 严重度 | 缺陷 | 文件:行号 | 复现步骤 | 实际 vs 期望 | 用户后果 |
|---|---|---|---|---|---|---|
| ① | **P1** | 无 `tags`（或只有 `"日记"` 标签）的语法句子卡**从语法复习链路整体消失** | `src/services/grammarReviewService.ts:38-39`（队列）、`:203`（掌握分母）；同口径还有 `src/services/reviewService.ts:37`、`:486`；标签写入侧 `src/services/diaryService.ts:367` | 1) 造一份 `cards:[{type:"sentence", tags:["日记"], sourceId:"diary:x", status:"review"}]` + 已到期 `schedules` 的备份；2) `parseBackupJson` 升级；3) 打开 `/grammar/review` 或调 `listDueGrammarReviewCards` | **实际**：队列为空、空态「今天没有到期的语法复习」；`共 M 句` 分母少算。**期望**：与其它语法卡一样进队列 | 2026-09-12~09-22 期间从日记入队的卡全部消失（`git log -S 'tags: "语法,日记"'` → `af1b9f1`）；用户看到「已掌握 1 / 共 1 句」的虚假满分；升级后无任何提示，且**不会被迁移修复** |
| ② | **P1** | 老句子卡 `back` 为空时 `/review` 题面**等于答案本身**；修复只覆盖 `lesson:` 来源 | 题面 `src/pages/ReviewPage.tsx:223`；修复 `src/services/lessonService.ts:244-248`（只认 `sourceId.startsWith("lesson:")`） | 1) 造 `cards:[{type:"sentence", front:"He goes to school.", back:"", tags:["语法"], sourceId:"hunt:hunt-kitchen-note"}]` + 已到期计划；2) 打开 `/review` | **实际**：「看提示，回忆英文」下方题面 = 整句答案。**期望**：题面是中文提示（或至少不等于答案） | 这道题零检验力——用户照屏幕抄一遍即满分；同时 `review.answer` 写回错题本会把「答案」当「用户写的答案」展示（`lessonService.ts:219-227` 已描述同款后果）。hunt / diary 来源卡**不在修复范围**（`repairLessonCoreSentenceTranslations` 只认 `lesson:` 前缀，且只在访问语法地图时触发） |
| ③ | **P1** | 无 `unitId` 的老词卡被**编造归属**到内置「核心100」；与「学习范围锁定」叠加后从全局队列消失 | `src/services/storage.ts` `ensureDefaultUnits` 的 `card.map`：`coreUnits[Math.max(0, Math.floor(wordIndex / 20))]?.id`（撰写时刻 :1183-1203） | 1) 造 `cards:[{type:"word", front:"apple", ...无 unitId}]`（+ 任意一个自建词书）；2) `parseBackupJson` → 卡被塞进 `core-100-unit-1`；3) 在词书页锁定自己的词书（`settings.studyScopeUnitIds: ["u-mine"]`）；4) 打开 `/spelling` 全局队列或调 `buildSpellingQueue(data, null, "standard")` | **实际**：卡的 `unitId` 变成 `core-100-unit-1`；锁定自己的词书后该卡**不在**队列里（`buildSpellingQueue` 的 `inScope`）。**期望**：未分配词保持未分配（不编造归属），或在锁定时按「未分配 = 范围外」明确提示 | ①用户没建过的 6 个内置词书（`核心100 - Unit 1..5` + `冒险积累`）**每次迁移都会注入**（`storage.ts` `seedCoreWords` 的两个返回点——撰写时刻 :1054 与 :1059——都走 `ensureDefaultUnits`），书架被塞东西；②更严重：原本「未分配」的用户自建词，被静默算进「核心100」，**锁定学习范围后从全局智能队列消失**（用户以为自己限制了范围，实际把自己的词关了） |
| ④ | **P2** | 「已破案」用 `found === 案件当前实际错数` 判定，历史 `total` 与现版本不一致时**少算战绩** | `src/services/huntService.ts:428-434` | 1) 造 `huntResults:[{caseId:"hunt-kitchen-note", found:1, total:1}]`，而该案现版本有 2 处错；2) `summarizeHuntProgress` / 打开 `/grammar/hunt` | **实际**：`solvedCaseIds` 不含该案，侦探页「已破案」不涨、案卡星标不点亮。**期望**：破案历史按记录时的口径认定为已破案（或明确按现口径重算并提示） | 案件内容修订过的老用户，战绩显示偏低；数据没丢但成就感应缺失 |

### 可疑但未证实

| # | 严重度 | 疑点 | 机制位置 | 为什么未证实 |
|---|---|---|---|---|
| ⑤ | P2 | 缺 `seededWordVersions` 时**补种 100 张内置核心词**，页面上卡数凭空多出 ~100，且这些新卡会占满今日新词队列 | `src/services/storage.ts` `seedCoreWords`（撰写时刻 :1057 起）与其早退分支 `return ensureDefaultUnits(data)`（:1059） | 机制已确证（用例「★ 无 seededWordVersions 的老数据 → 被补种 100 张内置核心词」，实测 >90 张）。**未能确证**真实老备份是否真的缺该字段——需拿到 `seededWordVersions` 上线前的真实备份样本才能定级。若存在，则为 P1（用户词库被灌入未要求的内容） |
| ⑥ | P2 | `normalizeDiaryEntries` 丢弃缺 `questionId`（或 `answerEn` 为空）的日记条目 → 「已写 N 条」静默变小 | `src/services/storage.ts:790` | 机制已确证（用例「缺 questionZh 的老日记条目会整条被过滤掉」）。`DiaryEntry.questionId` 自首版本 `04c5ca1` 即存在，**是否能造出真实缺该字段的备份未能确证**。注意：`answerEn` 为空的条目本就不该显示，这一半是合理过滤 |
| ⑦ | P2 | `getWeakCardInsights`（有错记录才算）与 `getWeakCards`（含 `priority`）两处口径不同，同一页面可能显示不同的「薄弱词数」 | `src/services/reviewService.ts:182-205` vs `:297-352` | 两函数注释已声明各自口径，`getWeakStats` 注释也说明「委托权威口径」。已用同一份数据实测两者结果不同（`insights=[]` vs `weakCards=["w2"]`），但**未逐页核对所有 UI 用法**，无法判定是否为真实显示矛盾 → 归入可疑 |
| ⑧ | P2 | 语法复习页的「已掌握 N / 共 M 句」与地图页「N 张到期」是两个独立口径，同日同数据下会给出不一致的任务量感 | `grammarReviewService.ts:196-214` vs `:135-139`（会话限 10） | 15 张到期 → 显示「15 张到期」但会话只出 10 张（用例已断言）。是否算缺陷取决于产品意图（会话上限是刻意的），仅记为**文案未说明关系** |

---

## 7. 新增测试文件与运行结果

| 文件 | 用例数 | 覆盖 |
|---|---|---|
| `src/edge/verify/mgLegacy.ts` | —（夹具） | 老数据构造工具：`legacyCard` / `legacySentenceCard` / `legacySchedule` / `legacyDiaryEntry` / `legacyHuntAttempt` / `legacyHuntResult` / `legacyBase` |
| `src/edge/verify/mg5-legacy-grammar.test.tsx` | 23 | 三关卡回填与解锁、`tags`/`sourceId` 缺失、`recoveryCount` 缺失、`reviews` 缺失下的掌握判定 |
| `src/edge/verify/mg6-legacy-scheduling.test.tsx` | 22 | `schedules` 全缺、`nextReviewAt` 五种形态、`reviews` 缺失、老句子卡 `back` 为空 |
| `src/edge/verify/mg7-legacy-diary-hunt-vocab.test.tsx` | 37 | 日记 `status`/`issues` 缺失、侦探记录缺失、`wordDetails` 补齐、16 页面红线扫描 |
| `src/edge/verify/mg8-legacy-progress-numbers.test.tsx` | 22 | 课程进度 / 掌握数 / 到期数 / 词书卡数 / 侦探 / 日记 的数字与实际内容对照 |
| `src/edge/verify/mg9-field-survival.test.ts` | 7 | **反向风险**：全字段数据往返是否丢字段（先例 `prioritySource`）+ `ensureDefaultUnits` 注入检查 |

**运行结果**

```
$ npx vitest run src/edge/verify/mg5-legacy-grammar.test.tsx \
                 src/edge/verify/mg6-legacy-scheduling.test.tsx \
                 src/edge/verify/mg7-legacy-diary-hunt-vocab.test.tsx \
                 src/edge/verify/mg8-legacy-progress-numbers.test.tsx \
                 src/edge/verify/mg9-field-survival.test.ts
 ✓ mg9-field-survival.test.ts (7 tests)
 ✓ mg5-legacy-grammar.test.tsx (23 tests)
 ✓ mg6-legacy-scheduling.test.tsx (22 tests)
 ✓ mg8-legacy-progress-numbers.test.tsx (22 tests)
 ✓ mg7-legacy-diary-hunt-vocab.test.tsx (37 tests)
 Test Files  5 passed (5)
      Tests  111 passed (111)
```

```
$ npx tsc --noEmit | grep -E "mg5|mg6|mg7|mg8|mg9|mgLegacy"
（无输出 —— 新增文件类型检查干净）
```

全量套件：`Test Files 169 passed | 2 failed (171)`、`Tests 2008 passed | 4 failed (2012)`。
**4 条失败全部在 `src/edge/verify/mg3b-backfill.test.ts` / `mg3c-idempotency.test.ts`**
—— 这两个文件由**另一个会话**在 01:39 / 01:43 创建/编辑（`git status` 显示为未跟踪，
mtime 晚于本任务开始），失败内容（`grammarLessonsDone` 过滤空格串、`completedAt` 保真、三次迁移逐字节一致）
与本轮改动无交集；本轮**未触碰 `src/` 下任何产品代码**。

---

## 8. 验证方法说明（证明覆盖面，而非只报缺陷）

每一条「没问题」的结论都由**可执行断言**支撑，而非读代码判断：

1. **真实升级入口**：所有场景都走 `seedAppData`（内部 = `parseBackupJson` = `migrateData` + `applyStartupMigration`），
   与 `loadData` 完全同一条管线；并额外验证了「未经迁移直读」的 `AppContext` 路径（页面挂载即触发）。
2. **历史版本对照**：用 `git show <commit>:src/types.ts` 对照 `04c5ca1`（首个含语法模块的提交）、
   `8f44fa3`（初始提交）、`da58aae`、`7ad13f5`、`61813a4`、`af1b9f1` 的 `Card` / `Schedule` / `DiaryEntry` 形态，
   确保「字段不全」的夹具是**真实历史形态**而非臆造。
3. **负向对照**：每个关键断言都配一条反向用例，证明检测逻辑不是恒真——
   - 「补上 `tags` 后同一张卡立刻回队列」（§1.2）
   - 「未来排期的卡不进到期队列」（§2.2）
   - 「`issues` 有内容的日记能正常入队」（§3.1）
   - 占位词检测对 `NaN`/`undefined`/`null`/`Invalid Date` 四类均能命中（§4）
4. **页面级而非服务级**：字数不是结论的地方（题面等于答案、空字段块是否渲染、整页占位词）
   都在 **jsdom 挂载真实页面组件后读 `textContent`/DOM** 验证，而不是只看服务函数返回值。
5. **幂等与往返**：`mg9` 额外验证「第一次迁移结果再迁移一次不再变化」，
   覆盖「每次 `commitData → saveData` 都会重跑迁移」这一老数据持续被改写的风险。
6. **反面风险（字段被丢）**：`mg9` 用 49 条点路径逐项比对输入/输出，
   并确认白名单语义（未知字段被丢弃）——这是「字段一旦不在 `normalizeXxx` 返回对象里就永久消失」的机制说明。

**明确未覆盖**：
- 冒险（`adventures`）/ 语言之门（`gateAttempts` / `runeStates`）的老数据行为（不在本轮 5 条任务范围内，
  但 `mg9` 已确认这些字段在迁移中存活）。
- 云同步合并（`syncService`）场景下的老数据（本地与云端都为老数据、或一新一旧）。
- 真实浏览器（Tauri / 实际 localStorage 配额）下的行为；本轮全在 jsdom 中。
- ④ 的修复可行性评估（`found === total` 该按哪一版口径认定）需要产品决策，本轮只报告行为。
