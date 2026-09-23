# 版本升级路径专项验证（MG3）

- **日期**：2026-09-22
- **范围**：任意历史版本的 `AppData`（`schemaVersion` 0–8 / 缺失 / 非法）升级到当前版本 `APP_SCHEMA_VERSION = 8`
- **被测代码**：`src/services/storage.ts`（`7e83192fcf089e4312c44e29715f3175377a63b9b8ff2b237660af9b7f050012`）
  - 注意：验证期间另一条工作流正在并发修改 `storage.ts`（可选项字段白名单修复）。本文所有结论均基于上述 revision；行号以该 revision 为准。
- **新增测试**（未改动任何 `src/` 产品代码）：
  - `src/edge/verify/mg3a-version-matrix.test.ts` — 6 例
  - `src/edge/verify/mg3b-backfill.test.ts` — 54 例
  - `src/edge/verify/mg3c-idempotency.test.ts` — 17 例
  - `src/edge/verify/mg3d-corrupt-degrade.test.ts` — 30 例
  - `src/edge/verify/mg3e-startup-path.test.ts` — 11 例（jsdom + 真实 localStorage）
  - **合计 118 例，全部通过**；全库 `npx vitest run`：174 文件 / 2087 例通过。
- **命名约定**（沿用 `jd10-defects.test.ts`）：用例名带 `FAIL-<n>` = 已确认缺陷，断言写的是「缺陷仍然存在」，修好后该用例会失败，正好提醒翻转断言；`对照 PASS-<n>` = 验证过没问题的方向。

---

## 结论速览

| 编号 | 问题 | 严重度 |
|---|---|---|
| FAIL-13 | `loadData` 返回值与落盘内容不一致（页面看到的数据落后磁盘一次迁移） | **P0** |
| FAIL-2 / FAIL-3 | 全掌握的大词书被拆分后，完成时间被改写成迁移时刻；已完成词书数 1→2 | **P0** |
| FAIL-14 | 存储写不下时 `loadData` 抛错且无兜底 → 应用挂载失败 | **P0** |
| FAIL-7 | 用户删掉的内置词书 / 分组在下次迁移被自动重建（卡片也被重新归位） | **P1** |
| FAIL-4 | 速通徽标随学习推进蔓延，最终 5 本内置书全带「3天速通」 | **P1** |
| FAIL-6 | 用户自建分组叫「核心100」时，5 本内置书挂到不存在的分组 id | **P1** |
| FAIL-8 | 无归属的用户词卡被自动塞进内置「核心100」词书 | **P1** |
| FAIL-1a–1e | 老数据第 1 次迁移不收敛（要打开两次应用数据才稳定） | **P1** |
| FAIL-5 | 空串 / 空白串课 id 进入进度统计 | **P2** |
| FAIL-9 / FAIL-10 | 补种去重的边界（非词卡同名词、带标点）会重复插入 | **P2** |
| FAIL-12 | 与 FAIL-1/FAIL-13 同源，真实启动路径上的表现 | **P1** |

**最重要的两条**：
1. **升级不会丢用户的卡片、复习记录、关卡进度**——所有版本号（含缺失、0、99、非法值）都能迁移，用户内容零丢失（第 1 条矩阵）。
2. 但**升级后的数据要「打开两次」才稳定**，且**第一次页面看到的数据与磁盘不一致**（FAIL-12 / FAIL-13），根因是 `loadData` 里迁移跑了两遍、返回第一遍结果、落盘第二遍结果。

---

## 1. 版本号矩阵

构造同一份「有内容的」历史数据（2 张卡 + 1 条复习记录 + 自建词书/分组 + 关卡进度 + 日记），把 `schemaVersion` 换成各种取值，走真实 `parseBackupJson`。

| schemaVersion | 能否迁移 | 迁移后版本 | 用户卡片 | 复习记录 | 自建词书 | 自建分组 | 关卡进度 | 补种内置词 |
|---|---|---|---|---|---|---|---|---|
| **缺失**（无该字段） | 是 | 8 | 保留 | 保留 | 保留 | 保留 | 保留 | 115 张 |
| 0 | 是 | 8 | 保留 | 保留 | 保留 | 保留 | 保留 | 115 张 |
| 1 | 是 | 8 | 保留 | 保留 | 保留 | 保留 | 保留 | 115 张 |
| 2 | 是 | 8 | 保留 | 保留 | 保留 | 保留 | 保留 | 115 张 |
| 3 | 是 | 8 | 保留 | 保留 | 保留 | 保留 | 保留 | 115 张 |
| 4 | 是 | 8 | 保留 | 保留 | 保留 | 保留 | 保留 | 115 张 |
| 5 | 是 | 8 | 保留 | 保留 | 保留 | 保留 | 保留 | 115 张 |
| 6 | 是 | 8 | 保留 | 保留 | 保留 | 保留 | 保留 | 115 张 |
| 7 | 是 | 8 | 保留 | 保留 | 保留 | 保留 | 保留 | 115 张 |
| **8**（当前） | 是 | 8 | 保留 | 保留 | 保留 | 保留 | 保留 | 115 张 |
| **99**（未来版本） | 是 | 8 | 保留 | 保留 | 保留 | 保留 | 保留 | 115 张 |
| `null` | 是 | 8 | 保留 | 保留 | 保留 | 保留 | 保留 | 115 张 |
| 字符串 `"8"` | 是 | 8 | 保留 | 保留 | 保留 | 保留 | 保留 | 115 张 |
| 负数 `-1` | 是 | 8 | 保留 | 保留 | 保留 | 保留 | 保留 | 115 张 |
| 小数 `6.5` | 是 | 8 | 保留 | 保留 | 保留 | 保留 | 保留 | 115 张 |
| `NaN` | 是 | 8 | 保留 | 保留 | 保留 | 保留 | 保留 | 115 张 |
| 对象 `{}` | 是 | 8 | 保留 | 保留 | 保留 | 保留 | 保留 | 115 张 |

**关键发现：`schemaVersion` 完全不参与迁移决策。**

`migrateData`（`storage.ts:979`）里没有一处读 `schemaVersion` 做分支——它只在出口无条件写回常量（`storage.ts:1054`）。`storage.ts:1302` 只在**生成提示文案**时读它。所以：

- 「版本升级」的真实语义 = 「用当前的归一化器把数据重解一遍」；
- 0 与 8 走的是**同一条代码路径**，产出结构完全一致（`mg3a` 用例「版本号本身不参与迁移决策」）；
- 未来版本（99）也不会被拒——只是未知字段被白名单静默丢弃，并给出一句提示（见下）。

### 唯一随版本号变化的用户可见行为：提示文案

`summarizeStartupRepairs`（`storage.ts:1294`）按版本号高低给不同文案：

| schemaVersion | 提示 |
|---|---|
| 缺失 / 0 / `null` / `{}` | 旧版本数据结构（v0）已自动迁移到 v8 |
| 3 / 7 | 旧版本数据结构（v3 / v7）已自动迁移到 v8 |
| 8 | （无提示） |
| 99 | 这份备份来自更新的版本（v99，当前支持 v8）：已按当前版本尽力读取，但更新版本新增的内容无法保留。建议升级应用后再导入。 |
| `"8"` | 旧版本数据结构（v8）已自动迁移到 v8 ← **文案自相矛盾**（P2，仅文案） |
| `-1` / `6.5` | 旧版本数据结构（v-1 / v6.5）已自动迁移到 v8 |

`"8"` 与 `null` 的情形值得注意：因为 `raw.schemaVersion !== APP_SCHEMA_VERSION` 用的是 `!==`，字符串 `"8"` 会被判为「旧版本」，然后 `asNumber` 把它读成 8，生成「v8 迁移到 v8」这句无意义文案。不影响数据，只是提示失真。

### 关于「补种 115 张内置词」

表中「补种 115 张」是因为我**故意**把 `seededWordVersions` 设为 `[]`。补种只由 `seededWordVersions` 决定（`storage.ts:1058`），与版本号无关：

- 带 `["core-100-v1"]` 的任何 `schemaVersion`（0/1/3/8/99/非法）都不补种；
- 带 `["other-v1"]`（不含当前版本）→ 补种一次并追加版本号；再迁移不重复。

内置词条实际是 **115 条**，不是 100 条（`core100Words.length = 115`）。

---

## 2. 回填逻辑正确性

### 2.1 `grammarLessonsDone → grammarLessonStagesDone` 补 `[1]`（`storage.ts:1043-1054`）

**结论：逻辑本身正确、幂等，唯一的瑕疵是空串/空白串没过滤。**

| 场景 | 结果 | 判定 |
|---|---|---|
| 旧字段有值、新字段缺失 | 每课补 `[1]`，旧字段同时保留 | 符合预期 |
| 已有关卡 `[1,2]` | **不变**，关 2 不会被冲掉 | 符合预期 |
| 已有关卡 `[2,3]`（旧字段有该课） | 补成 `[1,2,3]`，升序去重 | 符合预期 |
| 已有关卡 `[1]` | 幂等，重复迁移结果不变 | 符合预期 |
| 新字段有课、旧字段没有 | **不反向写入旧字段**（不制造假进度） | 符合预期 |
| 旧字段同一课重复 3 次 | 只补一次 | 符合预期 |
| 旧字段混入 `null/42/{}/true` | 全部丢弃，迁移不失败 | 符合预期 |
| 旧字段不是数组 | 降级为 `[]` | 符合预期 |
| 关卡序号含 `0/4/99/-1/1.5/"2"/null` | 只保留 1/2/3 | 符合预期 |

**FAIL-5（P2）空串课 id 进到进度统计**

- 文件：`src/services/storage.ts:1030`（`grammarLessonsDone: asStringArray(parsed.grammarLessonsDone)`）、`:138`（`normalizeLessonStagesDone` 的 `!lessonId` 判定）、`:1047`（回填循环）
- 复现：`parseBackupJson('{"schemaVersion":8,"seededWordVersions":["core-100-v1"],"cards":[],"grammarLessonsDone":["","  "]}}')`
- 实际：`grammarLessonsDone = ["", "  "]`；`grammarLessonStagesDone = {"": [1], "  ": [1]}`
- 期望：空白串被过滤（`asStringArray` 只做 `typeof === "string"`，没有 `trim()` 后判空）
- 用户后果：`"".length` 被算进「已学课数」—— `GrammarPathPage.tsx:613`、`GrammarLessonPage.tsx:576` 都直接拿 `grammarLessonsDone.length` 当完成课数用，空串会被计成一节课；`grammarLessonStagesDone` 里多出两个无意义的键。
- 触发条件：需要外部工具/手工编辑产出空白串课 id，正常 UI 路径不会产生。故定为 P2。

### 2.2 `seededWordVersions` 与 `seedCoreWords`（`storage.ts:1057-1130`）— 最高风险项

**结论：老用户升级后词库不会被「变脏」到重复插入的程度，但有 4 个真实边界问题。**

先说**没问题的**（这些我都实测过，不是读代码）：

| 场景 | 结果 |
|---|---|
| `seededWordVersions` 缺失 → 补种 115 张 | 正常，版本号写入后不再补 |
| 用户已有同名词卡（`achieve`），大小写不同 | **不重复**，只留用户那张 |
| 用户已有同名词卡（`achieve`），前后带空格 | **不重复** |
| 用户已有同名词卡，`wordDetails` 为空数组 | **不重复**（`migrateData` 先跑 `fillMissingDetails`，`storage.ts:966`，把词卡的详情补出来，`seedCoreWords` 才能看到它们） |
| 用户改过释义 / 笔记 / 音标 | **不被覆盖**，用户的值原样保留 |
| 用户卡片已 `mastered` / `priority: true` | **不被改**，内置卡只新增不修改 |
| 用户已有的复习计划与复习记录 | 不受影响（`intervalDays/reviewCount/lapseCount/easeFactor` 全部保留） |
| 补种卡的 `unitId` | 全部落在内置词书，不产生「无书散卡」 |
| 补种卡的状态 | 全是 `new` + `priority: false` |
| 补种只发生一次 | 卡片 id 集合稳定，不产生重复 id |

**FAIL-9（P2）非词卡与内置词同名时会重复插入**

- 文件：`src/services/storage.ts:1062`（`existingWords` 取自 `data.wordDetails`）、`:380-417`（`fillMissingDetails` 只给 `type === "word"` 的卡补详情）
- 复现：用户有一张 **sentence（或 phrase）** 卡，`front` 恰好是内置词（如 `achieve`），`wordDetails` 为空
- 实际：`migrateData({schemaVersion:0, seededWordVersions:[], cards:[{id:"other",type:"sentence",front:"achieve",...}]})` → 卡片集合为 `["sentence", "word"]`，同一个词出现两张卡
- 期望：同名文字已被用户收过，不该再插一张内置词卡
- 用户后果：词库里出现「同一词的两张卡」；只有 `wordDetails` 里那条内置词有详情，句子卡走 `sentenceDetails`，复习队列可能对同一词重复出题。触发条件是用户把内置词做成了句子/短语卡（少见，但 `GrammarHuntPage.tsx:369` 等路径会创建句子卡）。

**FAIL-10（P2）`front` 带句末标点时去重认不出**

- 文件：`src/services/storage.ts:1062`（比较用的是 `details.word.toLowerCase()`，不是 `card.front`）
- 复现：用户词卡 `front = "achieve."`（带句点），`wordDetails.word = "achieve."`
- 实际：用户那张与内置那张同时存在（`front` 分别是 `"achieve."` 与 `"achieve"`）；`migrateData` 后多出 1 张卡
- 期望：`achieve.` 与 `achieve` 视为同一个词
- 用户后果：重复词卡。正常 UI 加词会走 `normalizeWord`（`dictionaryService.ts:112`）做归一化，手工导入或外部工具可能带入标点。
- 对照：`toUpperCase()` / 前后空格两种差异**已能正确识别**，只有标点不行。

**FAIL-8（P1）无归属的用户词卡被自动塞进内置「核心100」词书**

- 文件：`src/services/storage.ts:1193-1199`（`ensureDefaultUnits` 里的 `wordCards.findIndex(...)` + `coreUnits[Math.floor(wordIndex / 20)]`）
- 复现：用户有 3 张 `unitId` 为空的词卡（如「文件导入」后未指定词书），`seededWordVersions` 已含 `core-100-v1`
- 实际：3 张卡全部变成 `unitId = "core-100-unit-1"`（该书的标题是「核心100 - Unit 1」、说明是「内置核心词第 1-20 个」）
- 期望：散卡保持「未分组」状态（`UnitsPage.tsx:200` 已有「未分组」视图专门展示它们）
- 用户后果：用户自己导入的词被混进内置核心词书，词书标题与内容对不上（说明写着「内置核心词第 1-20 个」，里面装的却是用户的词）。
- 加重情形：散卡数量大时（如 500 张）会被塞进第 1 本，再触发拆分 → 出现「核心100 - Unit 1 · 1 / · 2 / · 3」三本，每本 140 张，全部挂着内置文案。

**FAIL-7 补充证据（用户删书的完整链路）**

删除的入口是 `UnitsPage.tsx` 的 `confirmRemoveSelectedUnit`（`:859`），对话框文案是「删除「XXX」？单词会保留，并变成未分配。删除后 10 秒内可撤销。」实测链路：

| 步骤 | 结果 |
|---|---|
| 老数据（30 张自建词卡）首次迁移 | `core-100-unit-1` 里有 35 张（含补种与用户卡被扫进来的部分） |
| 用户删除该词书（`deleteUnit`） | 词书消失，35 张卡变成未分配；总卡数 145 |
| 下一次迁移（任何一次 `saveData` / 启动） | 词书**回来了**，且 35 张卡**又被塞回去** |
| 卡片自身进度 | 保留（`status: "mastered"` 不受影响） |

用户视角：「我删掉的词书又出现了，我摘出去的词又跑回去了」——而且用户没有第二次删除的有效手段（删了下次还会回来）。撤销窗口写的是「10 秒内可撤销」，实际是「永远会撤销」。

**对照 PASS-5**：`wordDetails` 为空的词卡不会重复插入——说明去重路径在「词卡」这一类上是可靠的。

**关于内置词条数 115 与词书分配**

`core100Words.length = 115`，但 `unitId = seededUnits[Math.floor(index / 20)]`（`storage.ts:1072`）只在 `index` 0–99 落入 5 本书里，100–114（末 15 条）**全部落到第 1 本**：

| 词书 | 实际条数 | 说明文案 |
|---|---|---|
| core-100-unit-1 | **35** | 「内置核心词第 1-20 个」 |
| core-100-unit-2 | 20 | 「第 21-40 个」 |
| core-100-unit-3 | 20 | 「第 41-60 个」 |
| core-100-unit-4 | 20 | 「第 61-80 个」 |
| core-100-unit-5 | 20 | 「第 81-100 个」 |

条数（115）与文案（100）对不上，第 1 本的说明「第 1-20 个」与实际 35 条也对不上。属既有内容问题（P2，非迁移引入）。

### 2.3 `applyStartupMigration`（`storage.ts:974`）：`restructureOversizedUnits` + `syncUnitCompletion`

**结论：对老数据的单元结构改动较大，其中 4 处会改变用户已有的分组/进度语义。**

**FAIL-2（P0）全掌握的书被拆分后，完成时间被改写成「迁移时刻」**

- 文件：`src/services/bookRestructureService.ts:145`（拆分时 `completedAt: undefined`）→ `src/services/learningTelemetry.ts:212`（`syncUnitCompletion` 发现「全掌握」又补上 `nowIso()`）
- 复现：
  ```js
  const cards = [...250 张 status:"mastered" 的词卡, unitId:"big"]
  const units = [{ id:"big", title:"已通读的书", completedAt:"2024-05-05T00:00:00.000Z", ... }]
  parseBackupJson(JSON.stringify({ schemaVersion:0, seededWordVersions:["core-100-v1"], cards, units }))
  ```
- 实际：拆出的两本书 `completedAt` 都变成**当前时刻**（实测与 `Date.now()` 相差 < 60 秒）
- 期望：保留原值 `2024-05-05`，或至少不凭空改写历史打点
- 用户后果：用户「读完这本书」的时间被重置成升级当天。所有依赖该字段的展示都失真。

**FAIL-3（P0）「已完成词书数」被拆分放大**

- 文件：`src/services/milestoneService.ts:70`（`data.units.filter(unit => Boolean(unit.completedAt)).length`）、`src/services/dailyDirectiveService.ts:185`
- 复现：同上（1 本已完成的 250 词书）
- 实际：迁移前 `completedAt` 非空的书 = 1；迁移后 = **2**（拆成两本，两本都带上完成时间）
- 期望：拆分不应改变「用户读完过几本书」
- 用户后果：里程碑计数虚高——读完 1 本的书在统计里变成 2 本，可能提前触发「读完 N 本」的庆祝；`dailyDirectiveService` 用 `unit.speedRun && !unit.completedAt` 挑速通本，被误打 `completedAt` 的书会被跳过。

**FAIL-4（P1）速通徽标随学习推进蔓延**

- 文件：`src/services/bookRestructureService.ts:77-81`（每次重新挑「前 2 本**未启动**的书」）
- 复现：老数据（无 `seededWordVersions`）升级后，用户依次开始学第 1、2、3 本内置词书的第一个词
- 实际：带「3天速通」徽标的书数量变化为 `2 → 3 → 4 → 5 → 5`
- 期望：徽标是「哪几本适合速通」的一次性标记，不该随学习推进而增补（`applySpeedRunMarks` 的注释也写着「已启动的书保留现有标记」，但它对**新**未启动的书每次都重新发放）
- 用户后果：用户每开始学一本，后面一本就被打上「3天速通」。最终 5 本内置词书**全部**带徽标，徽标失去区分度；`dailyDirectiveService.ts:184` 会把它们依次作为「速通本」优先推给用户。

**对照 PASS-2**：非全掌握的书被拆分后不会获得完成时间（这条是对的）。

**没问题的部分**：

| 场景 | 结果 |
|---|---|
| 超过 200 条的书被拆分 | 正确，卡片状态与复习计划原样跟随 |
| 正好 200 条 | 不拆（阈值是「超过 200」） |
| 401 条 | 拆成 134/134/133，每本都 ≤ 200，再迁不再拆 |
| 拆分后卡片总数 | 不丢不复制（250 进 250 出，id 集合稳定） |
| 拆分出的书继承原书的分组与配色 | 正确 |
| 冒险积累词书 | 不参与拆分 |
| 空书 | 不会被误判为「全掌握」而打完成时间 |
| 原来有完成时间、后来有卡退回未掌握 | 完成时间被正确清掉 |
| 非词卡（句子卡） | 不参与词书完成度判定 |
| 全掌握的书拆分后 | 新书**确实**是好状态（不只是原值丢失，新值也是对的语义） |

---

## 3. 多次迁移的幂等性

**结论：第 2 次迁移之后逐字节稳定；但第 1→2 次不收敛，所以「每打开一次应用数据就被改一次」的现象真实存在（只发生在前两次）。**

对 7 份真实形态数据各连续迁移 3 次，`JSON.stringify` 逐字节比对：

| 数据形态 | 第1次==第2次 | 第2次==第3次 | 第3次==第4次 | 首轮长度变化 |
|---|---|---|---|---|
| 最早版本（无 schemaVersion、无 seededWordVersions） | 否 | **否** | 是 | 205 B → 92,717 B |
| 最早版本 + 已学课程（触发双写回填） | 否 | **否** | 是 | 243 B → 92,749 B |
| 当前版本干净数据 | 否 | 是 | 是 | 340 B → 5,084 B |
| 超 200 条的大词书（触发拆分） | 否 | **否** | 是 | 52 KB → 148 KB |
| 全掌握的大词书（触发拆分 + 完成打点重写） | 否 | **否** | 是 | 52 KB → 154 KB |
| 未启动的自建词书（触发速通标记） | 否 | 是 | 是 | 1.1 KB → 6.6 KB |
| 学习者已开始第一本内置词书 | 否 | 是 | 是 | 8.6 KB → 27 KB |

**不幂等的具体字段（第 1→2 次）：`FAIL-1a`–`FAIL-1e`**

- `FAIL-1a` `cards[c1].unitId`：`undefined` → `"core-100-unit-1"`（用户自己的卡第一次迁移后仍无归属，第二次才归入）
- `FAIL-1b` 补种卡的 `masteredAt`：字段不存在 → `null`（第二次迁移才补出该键）
- `FAIL-1c` `units[core-100-unit-3].speedRun`：`undefined` → `true`（徽标数量 2 → 3，用户什么都没做）
- `FAIL-1d` `units` 数组顺序：第 1 次拆分把新书追加到数组末尾（`order=3` 却排在 `order=6` 之后），第 2 次 `mergeUnits` 才把它重排到第 4 位
- `FAIL-1e` 收敛性：`parse(JSON.stringify(parse(x)))` 与第 3 次结果不同 → 用户需打开两次应用，数据才不再变

**根因**：`seedCoreWords` 在补种时用 `existingGroupTitles` 去重分组，但**此时 `ensureDefaultUnits` 还没跑**；而 `ensureDefaultUnits`（`storage.ts:1183`）才是补 `unitId`、补分组、补徽标的那一步。补种路径（`storage.ts:1057`）在返回值里只 `mergeUnits` 新词书，**没有**调用 `ensureDefaultUnits` 的卡片归属逻辑——所以补种卡在第一次迁移里没走 `unitId` 补齐，用户卡也没走。第二次迁移时 `seededWordVersions` 已含版本号，直接进 `ensureDefaultUnits` 分支（`storage.ts:1059`），这次才补齐。

**用户可见后果**：升级后第一次打开的界面里，用户自己的词还没有归属词书、内置词书还没有速通徽标；第二次打开才出现。对用户是「界面自己变了」，会让人困惑。

### 3.1 往返稳定性：`parseBackupJson(JSON.stringify(parseBackupJson(x)))`

| 用例 | 结果 |
|---|---|
| 第 1 次迁移后的数据再迁一次 | 不同（仅上述 FAIL-1 字段） |
| 第 2 次迁移后的数据再迁一次 | **逐字节相同** |
| 导出 JSON（`JSON.stringify(data, null, 2)`）再导入 | 稳定 |
| 反复导出/导入 5 轮 | 长度稳定（`new Set(lengths.slice(1)).size === 1`） |
| 当前版本干净数据 | 第 1 次即收敛 |

**结论：往返稳定，但收敛点是第 2 次迁移，不是第 1 次。**

### 3.2 `FAIL-12` / `FAIL-13`（P0）`loadData` 返回值与落盘内容不一致

这是上面 FAIL-1 在真实启动路径上的直接后果，而且是独立的一条缺陷。

- 文件：`src/services/storage.ts:1213-1221`（`loadData`）与 `:1230-1233`（`saveData`）
- 机理：
  ```ts
  const migrated = applyStartupMigration(migrateData(raw));  // ← 第 1 次迁移
  summarizeStartupRepairs(raw, migrated);
  saveData(migrated);        // ← saveData 内部又跑一次 migrateData（第 2 次迁移）
  return migrated;           // ← 返回的是第 1 次的结果
  ```
  `saveData`（`storage.ts:1231`）会再调 `migrateData`，落盘的是**两次迁移后**的数据，而 `loadData` 返回的是**一次迁移后**的数据。
- 实测（真实 localStorage + `loadData`）：
  - `loadData()` 返回值里，用户卡 `c1.unitId === undefined`
  - 同一次启动写回磁盘的内容里，`c1.unitId === "core-100-unit-1"`
  - 补种卡同理：返回值里**没有** `masteredAt` 键，磁盘上有（值 `null`）
  - 逐字段比对：**116 项差异**
- 复现步骤：
  1. `localStorage["personal-vocab-app-data-v1"] = '{"cards":[{"id":"c1","type":"word","front":"custom","back":"自建词","status":"review","priority":false,"createdAt":"2024-01-01T00:00:00.000Z","updatedAt":"2024-01-01T00:00:00.000Z"}]}'`
  2. `const returned = loadData()`
  3. 比较 `returned.cards[0].unitId` 与 `JSON.parse(localStorage.getItem(...)).cards[0].unitId`
- 期望：`loadData` 返回的就是它写回的那份
- 用户后果：
  1. 页面（`AppContext.tsx:40` 用 `loadData()` 的返回值做初始 state）渲染的是「旧一版」数据，与该次启动的磁盘内容不符；
  2. 用户第一次打开时看到的界面，与他下一次打开看到的**不一样**（这正是 FAIL-12 实测到的 `无归属 → core-100-unit-1`）；
  3. 任何随后的 `commitData` 都会把磁盘版写回内存，界面会「自己变一次」。
- 严重度 **P0**：这不是「少一个字段」，而是「页面状态与持久化状态在启动瞬间就不一致」——所有依赖「读到的数据==存的数据」的假设都被破坏。

**对照 PASS-4**：稳定态下（第二次启动起）返回值与落盘内容逐字节一致，说明问题只在首次升级那一次启动。

---

## 4. 损坏数据的降级

**结论：逐条降级良好，用户不会因为一条坏记录丢掉整个词库。整体失败只发生在两种情形（无法解析的 JSON、存储写不下）。**

### 4.1 安全降级（已验证）

| 输入 | 结果 |
|---|---|
| `cards` 混入 `null` / 字符串 / 数字 / 布尔 / 数组 / `undefined` | 逐条丢弃，好卡全保留 |
| 卡片缺 `id` | 补一个新 id（不丢卡）；id 稳定后不再变 |
| `id` 是数字 / 空串 | 补新 id |
| `id` 是纯空白 `"   "` | **原样保留**（`asString(value.id) \|\| uid()` 没 trim 后判空）——坏 id 留在库里 |
| `id` 重复 | 两张卡都留；共用一条复习计划；`wordDetails` 各留一条 |
| 卡片只有 `front` | 补齐类型与状态，不丢卡 |
| `front` 与 `back` 都是空串 / 都缺失 | 丢弃（无法出题的空壳） |
| `front` 是空白、`back` 有内容 | 保留（判定是「两者都空」才丢） |
| 字段类型全错（`front` 是对象等） | 安全降级（该卡被视为空壳丢弃），不抛错 |
| `cards` 不是数组（对象/字符串/数字/布尔/`null`） | 降级为 `[]`，**其它字段不受影响** |
| 5000 张卡 | 正常处理，无栈溢出 |
| 对象里的**循环引用** | 不抛错；迁移结果本身可 `JSON.stringify`（`saveData` 不会因此失败） |
| 循环引用藏在被丢弃的字段里 | 不影响 |
| `schedules` 混入坏记录 | 丢弃，好计划保留 |
| 计划数字字段是脏值（负数 / `NaN` / 字符串） | 收敛到安全范围（`easeFactor ≥ 1.3`、`intervalDays ≥ 0` 等） |
| 同一张卡多条计划 | 只留第一条 |
| 没有计划的卡 | 自动补「现在到期」的计划 |
| `schedules` 不是数组 | 所有卡补新计划（原有计划数据丢失，但不崩） |
| `settings` 完全坏掉 | 回落默认值，数据不丢 |
| `settings` 数值越界 | 收敛到合法区间 |
| 顶层未知键 | 被忽略（白名单），不报错 |
| 20 个顶层数组字段逐个被换成对象 | 全部降级为数组，`cards` 不受影响 |

### 4.2 整体失败（2 种）

**（a）JSON 本身无法解析** → `migrateData` 抛错 → `loadData` 的 catch 走**整库重置**（`storage.ts:1222-1227`），并留下「本地数据损坏（无法解析），已自动重置为初始状态；如有 JSON 备份可在设置页恢复」。这是有意的设计，且给了用户恢复出口。

**（b）`FAIL-14`（P0）存储写不下时 `loadData` 抛错，且无兜底**

- 文件：`src/services/storage.ts:1214`（try 分支的 `saveData`）、`:1220`、`:1225`（catch 分支的 `saveData`）
- 复现：让 `localStorage.setItem(STORAGE_KEY, ...)` 抛 `QuotaExceededError`，然后调 `loadData()`
- 实际：**`loadData` 抛出 `QuotaExceededError`**。机理是 try 里的 `saveData(migrated)`（`:1220`）抛错 → 落到 catch → catch 里的 `saveData(initial)`（`:1225`）**又抛一次** → 异常逃出 `loadData`。catch 块没有对 `saveData` 做保护。
- 期望：catch 分支应吞掉写入异常、至少返回可用数据（或明确降级）
- 用户后果：`AppContext.tsx:40` 在 `useState` 初始化里调 `loadData`，异常冒到 React 渲染；项目**没有 ErrorBoundary**（`reviewService.ts:65` 的注释也点明了这一点）→ **整个应用挂载失败，白屏**。磁盘上的旧数据没被破坏，但用户打不开应用。触发条件：本地数据接近 4 MB 软上限（`LOCAL_STORAGE_SOFT_LIMIT_KB = 4096`，设置页有体积提示）或浏览器隐私模式限制。
- 注：`diagnoseStoredData`（`storage.ts:1361`）对存储访问做了 try/catch，但 `loadData` 的写入路径没有。

### 4.3 修复报告与实际修复的一致性（两处漏报）

`summarizeStartupRepairs`（`storage.ts:1294`）只报告 3 类问题：版本号不一致、孤儿复习记录、孤儿句段。以下**静默修复不会出现在报告里**：

| 静默发生的清理 | 是否报告 |
|---|---|
| 空壳卡被丢弃（`front`/`back` 都空） | **否** |
| 坏类型记录被丢弃（`null` / 字符串 / 数字） | **否** |
| 孤儿复习计划（指向不存在卡片）被清掉 | **否** |
| 重复 id 的卡合并计划 | **否** |
| 孤儿复习记录被清掉 | 是 |
| 版本迁移 | 是 |
| 孤儿句段被清掉 | 是 |

用户后果：词库里少了卡片，报告里只说「旧版本数据结构已自动迁移」，用户不知道有东西被丢了。属 P2（正常情况下不会产生这些坏记录）。

---

## 5. 明确区分：确认的缺陷 vs 可疑但未证实

### 已确认（均有可复现用例）

| 编号 | 缺陷 | 严重度 | 用例位置 |
|---|---|---|---|
| FAIL-13 | `loadData` 返回值与落盘内容不一致（116 项差异） | P0 | `mg3e-startup-path.test.ts:111` |
| FAIL-2 | 全掌握的书拆分后完成时间被改写成迁移时刻 | P0 | `mg3b-backfill.test.ts:427` |
| FAIL-3 | 已完成词书数被拆分放大（1→2，里程碑计数虚高） | P0 | `mg3b-backfill.test.ts:458` |
| FAIL-14 | 存储写不下时 `loadData` 抛错 → 应用挂载失败 | P0 | `mg3e-startup-path.test.ts`（末例） |
| FAIL-7 | 用户删掉的内置词书 / 分组被自动重建（卡片也被重新归位） | P1 | `mg3b-backfill.test.ts:608` |
| FAIL-4 | 速通徽标蔓延（2→3→4→5） | P1 | `mg3b-backfill.test.ts:488` |
| FAIL-6 | 自建分组叫「核心100」→ 5 本内置书挂到不存在的 groupId | P1 | `mg3b-backfill.test.ts:580` |
| FAIL-8 | 无归属用户词卡被塞进内置「核心100」（500 张会触发拆分） | P1 | `mg3b-backfill.test.ts:621` |
| FAIL-1a–1e | 老数据第 1 次迁移不收敛 | P1 | `mg3c-idempotency.test.ts` |
| FAIL-12 | 首次启动渲染落后磁盘（FAIL-13 的真实路径表现） | P1 | `mg3e-startup-path.test.ts:62` |
| FAIL-5 | 空串课 id 进进度统计 | P2 | `mg3b-backfill.test.ts:110` |
| FAIL-9 | 非词卡与内置词同名时重复插入 | P2 | `mg3b-backfill.test.ts:201` |
| FAIL-10 | `front` 带标点时去重失效 | P2 | `mg3b-backfill.test.ts:217` |

### 可疑但**未**证实（需要产品判断或额外环境）

1. **`"8"` 的提示文案自相矛盾**（「v8 已自动迁移到 v8」）——已确认会输出这句，但未确认用户是否真的会看到（取决于是否会有人手工把版本号写成字符串）。
2. **纯空白卡片 id（`"   "`）会被保留**——已确认行为，但未确认下游（`key` 属性、`Map` 查找）是否会因此出问题。
3. **115 条内置词与「核心100」文案不符**——已确认条数与文案，未确认这是否是有意为之（可能是分批加入后未同步文案）。
4. **体积膨胀**：一份 69 字节的最小老数据升级后 92 KB（约 1343 倍）；一份 49 KB 的典型老数据升级后 168 KB。已确认数值，未确认在接近 4 MB 软上限的用户数据上是否会触发 FAIL-14。
5. **拆分导致的 order 重排是否影响用户看到的排序**——已确认数组顺序变化，`UnitsPage.tsx:179/208` 用 `.sort((a,b) => a.order - b.order)` 渲染，但 `order=3` 的两本书**并列**，`Array.prototype.sort` 的稳定性决定了谁在前面。未构造真实 UI 用例确认用户感知。
6. **`restructureOversizedUnits` 拆分出的新书 id 用 `uid("unit")`（含 `Date.now()` 与随机数）**——已确认每次执行都生成新 id（若前一次拆分结果未被保存就会出现 id 漂移），但正常路径下拆分结果会立刻被写回，未观察到 id 漂移。

### 验证过程中修正的错误判断（记录以免误报）

- 最初以为「补种会把用户已有词重复插入」——实测**不会**（`fillMissingDetails` 在 `seedCoreWords` 之前补齐了 `wordDetails`）。
- 最初以为「词卡存在但 `wordDetails` 缺失会导致重复」——实测**不会**，同上原因。
- 最初用 `apple` 做同名词样本——`apple` **不在**内置 115 词里，该用例是空转的；已改为用 `core100Words[0].word`（`achieve`）。
- 最初以为「用户自建同名分组会导致内置书挂到用户分组」——实测**不是**：内置分组按标题去重被跳过，内置书挂到**不存在的** `group-core-100`（FAIL-6 的真实形态不同）。
- 最初以为 `speedRun: false` 会显式写入——实测未标记的书该字段是 `undefined`（不写 `false`），断言已改为 `toBeUndefined()`。

---

## 6. 测试文件与运行结果

```
src/edge/verify/mg3a-version-matrix.test.ts     6 passed
src/edge/verify/mg3b-backfill.test.ts          54 passed
src/edge/verify/mg3c-idempotency.test.ts       17 passed
src/edge/verify/mg3d-corrupt-degrade.test.ts   30 passed
src/edge/verify/mg3e-startup-path.test.ts      11 passed
                                              ─────────
                                              118 passed
```

运行命令：

```bash
npx vitest run src/edge/verify/mg3a-version-matrix.test.ts \
               src/edge/verify/mg3b-backfill.test.ts \
               src/edge/verify/mg3c-idempotency.test.ts \
               src/edge/verify/mg3d-corrupt-degrade.test.ts \
               src/edge/verify/mg3e-startup-path.test.ts
```

全库回归（确认未引入破坏）：

```
Test Files  174 passed (174)
     Tests  2087 passed (2087)
```

`npx tsc --noEmit` 对 `mg3*.test.ts` 无报错。

**红线自查**：5 个新测试文件中，「主语/复数/时态/三单/原形/可数/疑问句/否定句/语序/比较级/最高级/从句」命中 0 次；「正确/错误/做错/答错/限时/排名/体力」命中 0 次（已把 `mg3b` 标题的「正确性」改为「行为」、`mg3d` 的「错误信息/错误类型」改为「异常信息/非法类型」）。

**未改动任何 `src/` 产品代码**：`git status` 显示本次新增的只有 5 个测试文件与 `.mgfind/`（均为 untracked）。`src/services/storage.ts` 的 `M` 状态来自并发工作流（该文件在验证期间被另一条工作流改动过：可选项字段白名单修复，75 行新增），非本次改动；本文所有结论与行号均基于 revision `7e83192f`（验证结束时该文件的哈希，与测试运行时的实际被测版本一致）。
