# 备份导出 / 导入专项验证（MG4）

- 日期：2026-09-22
- 范围：`exportJson` → `restoreDataFromJson` / `parseBackupJson` 的完整往返、边界、覆盖语义、诊断文案、导出安全
- 被测修订（只报发现，未改产品代码）：
  - `src/services/storage.ts` sha256 `12a72ec76c8300450388b30dc9a3a66dc1908eb1fb39081f64378a52eb8bc1f8`
  - `src/services/exportService.ts` sha256 `bafb95bf1832893d5aa263b9711dca9e0f958b910aca49a2cad40fa83a8d4d19`
  - `src/pages/SettingsPage.tsx` sha256 `da5f76594b2ab2e65e855fca8df99be917d38a21edf468330608d0d3b892b44c`
  - 审计期间有另一个会话在并发修改 `src/services/storage.ts`（见文末「审计期间的上游变更」），本报告结论以该哈希为准。
- 新增测试（4 个文件，44 条用例，全部通过）：
  - `src/edge/verify/mg4a-backup-roundtrip.test.ts`（5 条）
  - `src/edge/verify/mg4b-import-boundaries.test.ts`（15 条）
  - `src/edge/verify/mg4c-import-overwrite.test.tsx`（10 条）
  - `src/edge/verify/mg4d-export-secrets-and-repairs.test.ts`（14 条）

---

## 1. 完整往返对照表

**方法**：`makeAppData(partial)` 造一份每个字段都有可辨认值的 AppData（三类卡 × 五种状态、进度、遥测、设置、日记、侦探记录、季/关卡、词书、材料、错词生成、冒险、语言之门、符文），走 `exportJson` → `restoreDataFromJson`，递归 diff（数组按 `id`/`cardId`/`runeId` 对齐，避免把重排误报成字段差异）。断言：往返差异以 30 行为准，且第二次导入 0 差异（迁移幂等）、返回值与落盘一致（0 差异）。

### 1.1 顶层字段判定

| 字段 | 判定 | 差异行数 | 明细 |
|---|---|---|---|
| `schemaVersion` | 原样保留 | 0 | — |
| `unitGroups` | 原样保留 | 0 | — |
| `units` | **有丢失** | 7 | `.length` 3→7（补齐 core-100 unit 2-5）；`unit_mine.updatedAt` 被改写；`unit_mine.completedAt` **消失** |
| `cards` | 有新增（迁移补齐） | 9 | 5 张非 mastered 卡被补 `masteredAt: null`；3 张卡 `sourceId: ""` → `undefined` |
| `wordDetails` | 有新增（迁移补齐） | 4 | 为缺详情的词卡补 3 条空详情 |
| `sentenceDetails` | 原样保留 | 0 | — |
| `materials` | 原样保留 | 0 | — |
| `materialSegments` | **有丢失** | 2 | 孤儿句段被清理（有意的规范化） |
| `reviews` | **有丢失** | 2 | 孤儿复习记录被清理（有意的规范化） |
| `mistakeGenerations` | 原样保留 | 0 | — |
| `adventures` | 原样保留 | 0 | — |
| `huntAttempts` | 原样保留 | 0 | — |
| `huntResults` | 原样保留 | 0 | — |
| `grammarLessonsDone` | 原样保留 | 0 | — |
| `diaryEntries` | 原样保留 | 0 | — |
| `schedules` | 有新增（迁移补齐） | 6 | 5 张无计划卡被补「立即到期」默认计划 |
| `dictionaryEntries` | 原样保留 | 0 | — |
| `seededWordVersions` | 原样保留 | 0 | — |
| `languageGates` | 原样保留 | 0 | — |
| `gateAttempts` | 原样保留 | 0 | — |
| `runeStates` | 原样保留 | 0 | — |
| `settings` | 原样保留 | 0 | — |
| `grammarLessonStagesDone` | 原样保留 | 0 | — |
| `grammarBoostsDone` | 原样保留 | 0 | — |

顶层键：**消失 0 个，多出 0 个**。

### 1.2 变化明细 × 输入 × 输出 × 结论

| 路径 | 输入 | 输出 | 结论 |
|---|---|---|---|
| `units.length` | 3 | 7 | **有意规范化**：`ensureDefaultUnits` 补齐内置词书 |
| `units[unit_mine].updatedAt` | `2024-03-05T08:30:00.000Z` | 本次迁移时刻 | **有意但扰民**：`syncUnitCompletion` 认为该书不完整，每次迁移都刷新 `updatedAt` |
| `units[unit_mine].completedAt` | `2024-03-06T09:45:00.000Z` | `undefined` | **非预期丢失**（见缺陷 D1） |
| `units[core-100-unit-2..5]` | 不存在 | 迁移生成 | **有意规范化**：内置词书补齐 |
| `cards[*].masteredAt`（非 mastered） | 缺省 | `null` | **有意规范化**（类型契约要求非 mastered 恒为 null） |
| `cards[*].sourceId` | `""` | `undefined` | **有意但语义等价**：空串被归一为缺省 |
| `wordDetails[card_word_review/graduated/noplan]` | 缺详情 | 空详情（`chineseDefinition` 取自 `card.back`） | **有意规范化** |
| `materialSegments[segment_orphan]` | 完整对象 | `undefined` | **有意规范化**：孤儿句段清理（会在诊断里报告） |
| `reviews[review_orphan]` | 完整对象 | `undefined` | **有意规范化**：孤儿复习记录清理（会在诊断里报告） |
| `schedules[card_word_review/suspended/graduated/…]` | 缺计划 | `{easeFactor:2.5, intervalDays:0, reviewCount:0, lapseCount:0, nextReviewAt:本次时刻}` | **有意规范化**：无计划卡补「立即到期」计划 |

**小结**：整体往返质量好——22 个顶层字段里 15 个零差异，所有差异都属可解释的规范化，**唯一真正的非预期丢失是 `Unit.completedAt`**。

---

## 2. 导入路径的边界

### 2.1 非法输入（都不崩、都不动用户数据）

| 输入 | 行为 | 结论 |
|---|---|---|
| `{}` | 抛 `Error("这不是可识别的听写工坊 JSON 备份。")` | ✅ 好：中文、可理解，且**先校验后写盘**，旧数据完整 |
| `null` | 同上 | ✅ |
| `[]` | 同上 | ✅ |
| `"hello"` | 同上 | ✅ |
| 非法 JSON `{ this is not json` | 抛 `SyntaxError: Expected property name or '}' in JSON at position 2 (line 1 column 3)` | ⚠️ 缺陷 D4：引擎原文直接展示给用户 |
| 部分备份（只有 `cards` / 只有 `settings`） | 正常导入，其余字段取默认值 | ✅ 关键结论：**所有顶层字段都非 undefined**（实测 `undefined 顶层字段 = []`），下游 `.length` 不会崩 |
| 缺 `seededWordVersions` | 触发核心词补齐：0 → **115 张卡**、6 本词书 | ⚠️ 缺陷 D5：导入小备份会静默放大数百倍数据量 |
| `schemaVersion: 99` | 静默改写为 `8`，未来字段（顶层 `futureFeature`/`newTopLevelList`、卡片级 `futureSrsField`）**全部丢弃** | ⚠️ 缺陷 D3：静默降级，无任何提示 |
| 别人的备份（合法结构、内容不同） | 全量替换，卡片/复习记录整体换掉；对方的 `aiProvider.apiKey`、`dataSync`（含 `enabled`/`baseUrl`/`token`）一并装进本机 | ⚠️ 见 3 与 5 |
| 超大（约 3MB 起，视内容而定） | 抛 `QuotaExceededError`（原始名），旧数据因写入原子性保住 | ⚠️ 缺陷 D2（P0） |
| 大但不过配额（如 1.7MB / 4000 卡） | 无体积门槛，静默接受并整体替换 | ⚠️ 缺陷 D6：诊断里有 4MB 软阈值，导入侧却不设门槛 |

### 2.2 部分字段备份的默认值（实测）

| 场景 | 结果 |
|---|---|
| 只有 `cards`（1 张） | `units=6`、`schedules=1`、`wordDetails=1`、`dictionaryEntries` 回退内置词典、`settings.dailyNewWords=10`、`settings.aiProvider.apiKey=""` |
| 只有 `settings` | `settings.dailyNewWords=33` 保留，未给的 `dailyReviewLimit=30` 取默认；`cards=[]`、`reviews=[]` |
| 顶层 undefined 字段 | **0 个** ✅ |

---

## 3. 导入是否会破坏当前数据（最高风险项）

### 结论（明确）：**是全量替换，不是合并；未导出进度会被静默覆盖——但 UI 有二次确认，这一点做对了。**

#### 3.1 服务层：全量替换，无合并、无保护

`src/services/storage.ts:1244`

```ts
export const restoreDataFromJson = (json: string): AppData => {
  const restored = parseBackupJson(json);
  saveData(restored);   // 整个 localStorage 键被覆盖写，无 diff、无备份、无回滚
  return restored;
};
```

实测判据：

| 验证 | 结果 |
|---|---|
| 本机 2 张卡 + 1 条复习，导入 1 张卡的备份 | 本机卡片与复习**全部消失**，落盘同 |
| 导入备份 → 用户学新词 → 再导入同一份旧备份 | 导入后学的新词**静默消失**（不可撤销） |
| 同 `id` 卡片的字段 | 本机的 `status: mastered` / `note` 被备份的 `new` / `""` 覆盖 → **确认没有任何按 id 的合并逻辑** |

#### 3.2 UI 层：有二次确认（这块是好的）

`src/pages/SettingsPage.tsx:382-403` 只解析、不写盘；`:1145-1189` 弹 `ConfirmDialog`。实测真实渲染（`mountPage` + `FileReader`）：

| 验证项 | 结果 |
|---|---|
| 选文件后是否直接覆盖 | ❌ 不覆盖：先弹确认框，确认前本机数据零改动 |
| 弹窗文案 | 「恢复后，本机当前数据将被备份文件完全覆盖，此操作不可撤销。」 ✅ 明确说明覆盖 |
| 影响范围对比 | 展示「本机当前 2 张卡片 / 1 条复习 …」vs「备份文件 1 张卡片 / 0 条复习 …」 ✅ 真实数字 |
| 确认按钮文案 | 「确认覆盖」 ✅ |
| 取消 | ✅ 数据保持原样 |
| 确认后 | ✅ 备份生效，提示「已恢复 N 张卡片、M 条复习记录」 |
| 非法 JSON / `{}` | ✅ 只报错，不弹确认框，不动数据 |

**用户后果**：导入前的未导出进度确实会被永久覆盖，但由于有明确文案 + 数量对比 + 不可撤销声明，**这是「已充分告知的风险」，不是静默数据丢失**。唯一残留风险是 D2（下条）——确认之后写入失败时，界面与磁盘会分叉，而用户看不到任何提示。

---

## 4. 诊断报告的正确性

`summarizeStartupRepairs`（`src/services/storage.ts:1292`）与迁移实际改动的比对：

**造一份必然被修复的老数据**（v5 + 1 条孤儿复习 + 1 个孤儿句段 + 1 张缺 `masteredAt` 的 mastered 卡 + 1 张非 mastered 却带 `masteredAt` 的卡）：

```
[修复报告] 共 3 条：
  - 旧版本数据结构（v5）已自动迁移到 v8
  - 1 条无效复习记录（找不到对应卡片）已自动清理
  - 1 个无效句段（找不到所属材料）已自动清理

[实际 diff] 共 52 行；症状类 5 行
[字段级修复] 4 行（未出现在报告里）：
  - cards[card_ok].unitId added undefined → "core-100-unit-1"
  - cards[card_ok].masteredAt added undefined → "2024-01-01T00:00:00.000Z"
  - cards[card_wrong_masteredAt].masteredAt changed "2024-05-05..." → null
  - cards[card_wrong_masteredAt].unitId added undefined → "core-100-unit-1"
```

| 验证项 | 结果 |
|---|---|
| 症状类条目数与实际清理数 | ✅ **一致**：3 条报告对应 3 类真实症状，孤儿条数（3 条孤儿时文案为「3 条」）也准确 |
| 干净数据 | ✅ 报告为空，不误报 |
| 字段级修复 | ⚠️ **全部漏报**：52 行实际改动里只有 5 行被纳入报告，`masteredAt` 补写/归 `null`、`unitId` 补写都不计 |
| 文案口径 | ⚠️ 文案是「修复了 N **类历史问题**」，不是「修复了 N 项」；类别数语义上没错，但用户看到「3 类」而实际被改写了 52 处字段，容易低估 |

**结论**：`summarizeStartupRepairs` 的**数字与它自己覆盖的三类症状是一致的、没有虚报**；它的局限是**只覆盖 3 类症状、漏报字段级修复**。UI（`SettingsPage.tsx:874-893`）也如实写「自动修复了 N 类历史问题」，用词与实现相符。归为 **P2 细节**（不虚报，只是完整性有限）。

---

## 5. 导出内容的安全性

### 结论（明确）：**会泄露密钥。`exportJson` 把 `settings.aiProvider.apiKey` 与 `settings.dataSync.token` 以明文写进备份文件。**

`src/services/exportService.ts:5`

```ts
export const exportJson = (data: AppData) => JSON.stringify(data, null, 2);
```

实测（`mg4d`）：

```
[导出安全] 含 API Key=true 含云同步 token=true 含中转站地址=true
  出现位置: "apiKey": "sk-live-SUPERSECRET-0123456789", | "token": "MY-SYNC-SECRET-TOKEN"
```

| 验证项 | 结果 |
|---|---|
| 导出 JSON 含明文 API Key | ✅ 确认（`settings.aiProvider.apiKey`） |
| 导出 JSON 含云同步令牌 | ✅ 确认（`settings.dataSync.token`） |
| 导出 JSON 含中转站地址 | ✅ 确认（`settings.aiProvider.baseUrl`、`settings.dataSync.baseUrl`） |
| 有无字段级脱敏 | ❌ 无：导出 = 内存对象原样序列化，逐字段与输入相等（diff 为空） |
| 是否只影响 JSON 备份 | ✅ 是：`exportAnkiCsv` / `exportMarkdown` 不含密钥 |
| UI 有没有提醒「备份含密钥」 | ❌ 没有。设置页 `:810` 反而写着「**API Key 只保存在本机**」 |
| 反向面 | 导入别人的备份 → 对方的 `apiKey` 装进本机，且对方 `dataSync.enabled=true` 会让本机数据被推到对方地址 |

**用户后果**：用户按提示「导出 JSON 备份」后，把文件发给朋友、贴到论坛求助、提交到 Git 仓库或交给客服排障，API Key 与同步令牌随之外泄——可直接被盗刷额度；`dataSync.token` 还能让持有者读写用户的同步服务端数据。而界面文案「API Key 只保存在本机」会强化「导出是安全的」这一错误预期。

**严重度：P0（安全）**。

---

## 缺陷清单

### D1 · `Unit.completedAt` 在每次迁移中被丢弃 — P1

- **位置**：`src/services/storage.ts:230-251`（`normalizeUnit` 保留了 `completedAt`）→ 但 `src/services/learningTelemetry.ts:192-228`（`syncUnitCompletion`）在「词书整体未全部掌握」时**主动删除** `completedAt`
- **复现**：造一本带 `completedAt` 但含非 mastered 卡的词书 → 导出 → 导入
- **实际**：`completedAt: "2024-03-06T09:45:00.000Z"` → `undefined`（同时 `units[].updatedAt` 被刷新为迁移时刻）
- **期望**：`completedAt` 表示「整本全部掌握的打点时间」。词书在备份文件里本来就带着非 mastered 卡，这条记录只该在**状态真的从掌握变回未掌握时**清除，而不该在「读一份静态备份」时被判定为陈旧并抹掉
- **用户后果**：整本通关的打点时间反复丢失（每次启动/导入都丢），词书列表里「已通关」的时间信息与依赖它的统计不可靠
- **备注**：`syncUnitCompletion` 自身是幂等的，问题在于它在**迁移管线**里被无条件调用——静态数据被当成「当前状态」重新裁决。类型上 `completedAt` 是可选的，所以不会崩，只会静默消失

### D2 · 导入写不下时内存与磁盘分叉，且永久静默失败 — P0

- **位置**：`src/services/storage.ts:1244-1248`（`restoreDataFromJson` 先迁移后写盘，无 try/catch）与 `src/services/storage.ts:1230`（`saveData` 无配额保护）；UI 在 `src/pages/SettingsPage.tsx:156-176`（`confirmDangerOp` 直接 `setData`），`ConfirmDialog` 确认回调无 try/catch
- **复现**：设置页 → 数据与安全 → 恢复 JSON → 选一份约 2.9MB（7000 卡）的合法备份 → 确认覆盖
- **实际**（实测）：
  - 界面数据范围显示「卡片 7000」（`setData` 成功，内存已换）
  - 磁盘仍是导入前的 1 张卡（`saveData` 抛 `QuotaExceededError: The 5000000-code unit storage quota has been exceeded.`）
  - 确认框**仍然开着**、页面无任何错误提示、React 只把错误打到 `console.error`
  - **后续任何操作都不再落盘**：再改设置（`updateData`）也不抛错、磁盘 `dailyNewWords` 停在导入前的值 → 用户以为保存成功，实际全部丢失
- **期望**：写盘失败时应当回滚内存状态、关闭弹窗、明确提示「这份备份太大，本机空间不够；请先导出并清理，或换用更小的备份」
- **用户后果**：用户「看起来」成功恢复了备份，但一刷新打回原形；此后所有学习进度都不再保存，且看不到任何异常——**P0 数据丢失**。触发门槛低：本环境配额 500 万字符，而迁移会为每张卡补 `wordDetails` + `schedule`，**落盘体积约为备份的 1.9 倍**，所以约 1.7MB 以上的备份在真实浏览器里就有风险（实测 4000 卡/1.71MB 通过，7000 卡/2.99MB 失败）
- **补充**：写入本身是**原子的**（失败的 `setItem` 没有破坏旧数据），这一点是好的；问题在于失败没有被感知与上报

### D3 · `schemaVersion` 更高的备份被静默降级，未来字段丢失 — P1

- **位置**：`src/services/storage.ts:979-1025`（`migrateData` 无条件 `schemaVersion: APP_SCHEMA_VERSION`）
- **复现**：导入 `{ schemaVersion: 99, futureFeature: {...}, newTopLevelList: [...] , cards: [{ ..., futureSrsField: 0.42 }] }`
- **实际**：`schemaVersion` 静默改为 `8`；`futureFeature`、`newTopLevelList`、`futureSrsField` 全部丢弃；无任何提示或拒绝
- **期望**：读到高于本机的版本号时，应当拒绝导入或至少明确警告「这份备份来自更新的版本，部分内容可能无法识别」
- **用户后果**：用户在新版上导出、在旧版上导入（或降级/回滚版本），新字段被静默抹掉；若再次导出，原始备份里的新数据就永久消失了

### D4 · 非法 JSON 的错误原文直接暴露给用户 — P2

- **位置**：`src/pages/SettingsPage.tsx:392-397`（`catch` 里 `error.message` 直出）
- **复现**：恢复一个内容为 `{ this is not json` 的文件
- **实际**：界面显示 `Expected property name or '}' in JSON at position 2 (line 1 column 3)`
- **期望**：与 `{}` 那条一致的中文说明（如「这个文件不是合法的 JSON 备份，请确认选对了文件」）
- **用户后果**：非技术用户看到英文引擎报错，不知道下一步该做什么。同一路径上 `{}` 的文案是好的，说明这是遗漏而非设计
- **严重度**：P2

### D5 · 缺 `seededWordVersions` 的备份被静默放大 115 张卡 — P2

- **位置**：`src/services/storage.ts:1057-1129`（`seedCoreWords` 在版本标记缺失时补内置核心词）
- **复现**：导入 `{ schemaVersion: 8, cards: [] }`
- **实际**：`cards` 0 → **115**，`units` 0 → 6
- **期望**：导入的备份应当忠实还原；只有「首次安装」才该播种内置词
- **用户后果**：用户导入一份小备份后，词库里凭空多出上百张核心词卡（混进复习队列）。对真实老备份影响有限（都带该标记），但对「手工整理过的备份」「测试文件」「只含设置的备份」会明显走样
- **严重度**：P2

### D6 · 导入侧无体积门槛 — P2

- **位置**：`src/services/storage.ts:1354`（诊断有 4MB 软阈值 `LOCAL_STORAGE_SOFT_LIMIT_KB`），但 `restoreDataFromJson` 完全不校验体积
- **实际**：1.71MB / 4000 卡静默接受；约 3MB 起直接撞配额（D2）
- **期望**：解析前先看文件体积，超过阈值时提前给出「这份备份较大，可能放不下」的提示，而不是走到写盘才失败
- **用户后果**：D2 的前置条件。当作 D2 的缓解措施一并修
- **严重度**：P2

---

## 待确认 / 未证实

1. **D2 的浏览器真实配额**：实测值来自 jsdom（500 万字符）。真实 Chrome/Safari 的 localStorage 配额通常为 5–10MB，触发点会相应后移，但「写不下时内存与磁盘分叉 + 后续静默失败」的机制与配额无关。建议在真实浏览器用大备份复核一次。
2. **`Unit.completedAt` 是否还被别处读取**：本次只确认了它在往返中丢失，未逐一追查所有消费方（词书列表「已通关」展示、统计）。实际影响面可能大于「少一个时间戳」。
3. **未被备份覆盖的 localStorage 键**（导入不会恢复它们，`reset` 也不清）：`vocab-telemetry-*`、`grammar-telemetry-*`、`adventure-telemetry-*`、`settings-telemetry-*`、`stats-telemetry-*`、`grammar-boost-ai-cache-v1`、`grammar-boost-items-v1`、`grammar-lesson-summary-v1`、`grammar-explain-v1`、`grammar-why-wrong-log-v1`、`grammar-weekly-summary-v1`、`grammar-intervention-dismissed-v1`、`onboarding-done-v1`、`library-tour-done-v1`、`grammar-review-free-type`、`grammar:resume:*`、`personal-vocab-startup-repairs-v1`。**这些不在 JSON 备份的覆盖范围内**是本设计的一部分（设置页为它们提供了独立的导出按钮），但「恢复备份后遥测仍在、AI 缓存仍是旧的」这一组合是否会影响用户可见行为，本轮未验证。
4. **`AppData` 类型与归一化白名单的一致性**：本轮只针对「备份里显式给出的字段」。另有多条同族问题（`Card.prioritySource`/`suspendedFrom`/`mistakeGraduatedAt`、`Unit.dynamicKind`、`Settings.reviewOnlyDayKey`/`studyScopeUnitIds`/`reachedMilestoneIds`）由审计期间的另一会话以 `mg1`/`mg2`/`mg3` 系列覆盖，本轮未重复验证。

---

## 审计期间的上游变更（影响复现）

审计过程中，另一个会话在并发修改 `src/services/storage.ts`（`git diff` 显示 +58 行），陆续把以下字段加进归一化白名单：

| 字段 | 我首次跑往返时的状态 | 复跑时状态 |
|---|---|---|
| `Unit.dynamicKind` | 丢失 | 已保留 |
| `Card.prioritySource` / `suspendedFrom` / `mistakeGraduatedAt` | 丢失 | 已保留 |
| `Settings.studyScopeUnitIds` / `reachedMilestoneIds` | 丢失 | 已保留 |
| `Settings.reviewOnlyDayKey` | 丢失 | 已保留（见下） |

**并发现一个只在新代码里存在的瞬时缺陷**：该字段的首次实现写成 `asString(settings.reviewOnlyDayKey).trim() || undefined`，而写入侧 `UnitsPage.tsx:236` 用的是 `dayKey(new Date())`（`statsService.ts:546` 返回 **number** `20260922`）。实测该实现下 `reviewOnlyDayKey: 20260922`（number）→ `undefined`，而 `Settings.reviewOnlyDayKey?: number` 的契约要求 number —— 也就是说**写入侧产出的合法值被当作非法值丢掉**。复跑时该实现已改为 `Number.isFinite(...)`，number 可正常往返（已写成断言固定在 `mg4a` 的「reviewOnlyDayKey 的类型契约」用例里）。

本报告所有结论均以被测修订哈希为准；若上游继续改动 `storage.ts`，建议重跑四个 mg4 文件。
