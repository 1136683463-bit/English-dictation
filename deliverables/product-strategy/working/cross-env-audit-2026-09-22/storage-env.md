# 存储与持久化的环境差异专项验证

**日期**：2026-09-22
**范围**：`/Users/liujun/Documents/英语听写`（React 18 + TS + Vite + vitest；Tauri 桌面 + 浏览器双环境）
**约束遵守**：未修改 `src/` 下任何产品代码；只新增测试文件（5 个，见文末）。

> ⚠️ **并发改动提示**：本轮执行期间，另一路会话正在同时改写 `src/services/storage.ts`
> （22:07 落盘，把配额口径改成按字节计费）。本文对**第 1 条（配额口径）**的结论
> 已按**当前代码状态**重新核实——该问题已被对方修复，本文相应转为回归护栏。
> 第 2~5 条的结论基于当前 `storage.ts` 状态重新验证，均**仍然成立**。

---

## 结论速览

| # | 问题 | 严重度 | 状态 |
|---|------|--------|------|
| 2-P0a | **真实配额耗尽时，用户全部进度被替换成初始数据，磁盘也被覆盖，且诊断报「一切正常」** | **P0 数据丢失** | 确认缺陷 |
| 2-P0b | 全新用户 + 写入被拒（隐私模式/SecurityError）→ **启动白屏**，无 ErrorBoundary 兜底 | **P0 白屏** | 确认缺陷 |
| 2-P0c | `localStorage` 不存在 / `getItem` 被拒 → **启动白屏** | **P0 白屏** | 确认缺陷 |
| 2-P1 | `setItem` 全程失败 + 已有数据 → 应用能起来但**静默丢弃整份进度**，`diagnosis.ok = true` | **P1 数据丢失** | 确认缺陷 |
| 3-P0 | 多窗口/多标签**无任何同步机制**，整份对象覆盖写 → 交替使用稳定丢进度 | **P0 数据丢失** | 确认缺陷 |
| 2-P2 | 现有测试用 `vi.spyOn(localStorage, "setItem")` **是无效桩**，且往存储里塞垃圾键 | **P2 测试可信度** | 确认缺陷 |
| 1 | 配额阈值口径（字符 vs 字节） | — | **已被同批次修复**（本文转为回归护栏） |
| 4 | `dateKey` 口径：本地 vs UTC 混用 | P2 轻微错位 | 确认缺陷（影响可控） |
| 5 | 写盘时机：学习数据**无** debounce 窗口；设置页有 500ms | P3 最多丢设置项 | 确认，可接受 |

---

## 1. 配额口径的可移植性

### 1.1 常量 × 口径 × 偏差表

| # | 位置（当前代码） | 常量 / 判据 | 口径 | 在按字节环境（WebKit）下的偏差 |
|---|------------------|-------------|------|-------------------------------|
| 1 | `src/services/storage.ts:1458` | `STORAGE_SOFT_LIMIT_BYTES = 4 * 1024 * 1024` | **字节**（最坏情况） | ✅ 正确。阈值 4MB < WebKit 容量 5,242,880 → 会触发 |
| 2 | `src/services/storage.ts:1444-1451` | `storageCostBytes(value)` | **字节**（含 U+00FF 以上字符则 `length × 2`） | ✅ 正确。对 WebKit 精确；对 Chromium 含中文数据高估一倍（**刻意**，方向安全） |
| 3 | `src/services/storage.ts:1540` | `storageCostKb * 1024 > STORAGE_SOFT_LIMIT_BYTES` | 字节 | ✅ 正确 |
| 4 | `src/pages/SettingsPage.tsx:905-907` | 展示 `storageDiagnosis.storageCostKb` | 字节 | ✅ 正确（字段已随上游改名） |
| 5 | `src/services/reviewArchiveService.ts:150` | `freedBytes = before.length - after.length` | **字符**（字段名却叫 bytes） | ⚠️ 中文数据下**偏小约 2 倍**；仅影响一句提示文案，不参与阈值判断 |
| 6 | `src/services/reviewArchiveService.ts:46` | `REVIEW_DETAIL_RETENTION_DAYS = 180`（天数） | 与配额口径无关 | ✅ 不受影响 |
| 7 | `src/services/{vocab,grammar,adventure,settings}Telemetry.ts` | `MAX_EVENTS = 3000` 等 | **条数** | ✅ 与配额口径无关；`nearCapacity`（≥80%）也是条数口径 |
| 8 | `src/services/cardService.ts:20` | `MAX_AUDIO_BYTES = 2MB`（`File.size`） | 字节（`File.size` 本身是字节） | ✅ 正确 |
| 9 | `src/pages/UnitsPage.tsx:610` | `file.size > 5 * 1024 * 1024` | 字节（同上） | ✅ 正确 |

**修复前的缺陷（已由同批次另一路修复，此处留档以免回归）**

旧实现 `LOCAL_STORAGE_SOFT_LIMIT_KB = 4096` 配合 `Math.round((raw ?? "").length / 1024)`：
- `.length` 永远数**字符**；
- 在 WebKit（按字节计）上，一份 2,600,000 字符的含中文数据**实付 5,200,000 字节**（已达容量 99%），
  但旧口径读数只有 2,539 KB < 4096 → **「接近上限，建议导出备份」这条唯一的提前警告在 macOS 桌面端从不出现**；
- 用户直接从「一切正常」跳到「写入失败」，而写入失败又触发下面的 P0a。

**「把写失败当成数据没了」的地方 —— 这就是 P0a**

- `src/services/storage.ts:1287` `writeRaw(migrated)` **在 try 块内**；
- `src/services/storage.ts:1290` 的 `catch` 文案是「**本地数据损坏（无法解析）**，已自动重置为初始状态」——
  它**不区分**「数据坏了」与「数据好但写不下」，两者走同一条重置路径。
- 对比 `src/services/storage.ts:1301`（损坏分支内的 `writeRaw(initial)`，**有** try/catch 保护）：
  注释明确写「写不下也照样返回初始数据，比白屏好」——**同一种失败，两个分支的保护不对等**：
  正常分支的写入（1287）没有这层保护，异常直接落进 catch，被误判为「数据损坏」。

### 1.2 「把写失败当成数据没了」的地方 —— 这就是 P0a

---

## 2. 存储不可用时的降级

### 2.1 情形 × 白屏 × 提示 × 数据可救 表

| 情形 | 白屏？ | 有提示？ | 用户数据可救？ | 严重度 |
|------|--------|----------|----------------|--------|
| **A. `localStorage` 完全不存在**（`delete window.localStorage`） | **是**（启动即抛 TypeError） | 无（界面都没了） | ❌ 不可救——导出入口在界面里 | **P0** |
| **B. 全新用户 + `setItem` 抛 SecurityError** | **是**（启动即抛 DOMException） | 无 | ❌ 不可救（无数据可救，但用户体验=应用坏了） | **P0** |
| **C. 已有数据 + `setItem` 全程抛**（配额满/权限被撤） | 否（能起来） | ❌ **无提示**（`diagnosis.ok = true`） | ⚠️ 仅当用户**立刻**去设置页导出——但导出的是**已被替换的初始数据**，那 2.7MB 原数据已在磁盘上被覆盖 | **P0** |
| **D. `getItem` 返回 null**（站点数据被外部清理） | 否 | ❌ **无提示**（`diagnosis.ok = true`） | ❌ 不可救（磁盘上已无此数据；且与「全新安装」不可区分） | **P1** |
| **E. `JSON.parse` 抛**（数据被外部改坏） | 否 | ✅ 有（设置页「已自动重置」，含「可用 JSON 备份恢复」） | ⚠️ 需事先有备份；损坏的原数据会被初始数据覆盖 | **P2** |
| **F. `getItem` 抛 SecurityError**（Safari 隐私模式） | **是**（读在 try 之外） | 无（诊断文案已写好但看不到） | ❌ 不可救 | **P0** |
| **G. 损坏 + 写入也被拒** | 否（有 try/catch 兜住） | ✅ 有 | ⚠️ 坏数据不被进一步写坏 | P3 |

### 2.2 重点问题的回答

> **如果 `setItem` 全程失败，用户的学习进度是不是完全丢失且无提示？**

**是。而且比「丢失」更糟——磁盘上的原始数据也会被覆盖掉。**

**确认缺陷 P0a**｜`src/services/storage.ts:1287`（抛错点）+ `1290`（误判的 catch）+ `1301`（覆盖磁盘）

- **复现方式**（`env2b-unavailable.test.tsx` 第 6b 组，**不用任何桩**，真实灌满配额）：
  1. 写入一份真实形态数据（1 张卡 + 20000 条复习记录 ≈ 2764 KB）；
  2. 用**递减块**（512KB → 128KB → 32KB → 8KB → 2KB → 512B → 64B）填满剩余额度，
     直到连 85KB 的写入也失败（这一步是复现的关键：只填大块会留下碎缝，那份初始数据恰好塞得进去）；
  3. 调 `loadData()`。
- **实际**：
  - 内存态：`cards=115`（用户的 `my-card` 已不在）、`reviews=0`；
  - **磁盘**：2764 KB → **85 KB**，用户的 `my-card` 与 20000 条记录在磁盘上**也被替换**；
  - 诊断：`ok=true`、`issues=[]`、`repaired=[]` —— **用户被告知「存储健康」**。
- **期望**：写入失败时区分「写不下」与「读不到」，**不要**用初始数据覆盖磁盘上的原数据，
  并明确提示「存储空间已满，本次启动无法保存，请先导出备份」。
- **用户后果**：用了 1.5 年的用户某天打开应用，进度**全部归零**，没有任何提示，
  且磁盘上的原数据已被 85KB 的初始数据原地覆盖——**连事后找回都不可能**。
  这正是前几轮「约 30 个月撞 5MB」结论的真实终局：撞墙那天不是「写不进去」，
  而是「数据被清空」。

**确认缺陷 P0b**｜`src/services/storage.ts:1262`（`getItem` 在 try 之外）+ `1265`（首次启动的 `writeRaw` 在 try 之外）

- **复现**：`Storage.prototype.setItem = () => { throw new DOMException("...", "SecurityError") }`，清空存储后调 `loadData()`。
- **实际**：抛 `SecurityError`；`AppContext.tsx:40` 在 `useState` 初始化里调用它，
  异常冒到 React 渲染；项目**没有 ErrorBoundary**（全仓 grep 无 `componentDidCatch` / `getDerivedStateFromError`）
  → 整棵树挂载失败，`document.body` 空白。
- **期望**：与损坏分支（`1287` 那侧）同等保护——写不下也返回可用数据撑起界面，
  让用户至少能进入设置页看到提示。
- **用户后果**：隐私模式 / 企业策略禁用存储的用户**完全打不开应用**，看不到任何说明。
  `diagnoseStoredData` 其实**已经写好**了对应文案（`storage.ts:1577`：
  「访问本地存储被浏览器拒绝，请检查隐私模式或站点权限设置」）——文案就在那儿，但用户到不了能看见它的页面。
- **衍生**：`src/services/storage.ts:1262` 的 `getItem` 同样在 try 之外，
  于是「读被拒」（情形 F，Safari 隐私模式）也白屏，且同样用不上 1577 那条文案。

**确认缺陷 P1（情形 C 的无提示部分）**｜`src/services/storage.ts:1547-1577`

- **实际**：`diagnoseStoredData` 读的是**刚刚被 `loadData` 写回去的**内容（`storage.ts:1552-1554`），
  所以 `raw !== null`，那条「读不到本地存储快照」的 issue（`storage.ts:1573`）**永远不会出现**。
  它测的是「此刻能不能读到」，而不是「这次启动是否丢过数据」——两个语义被混在了一个函数里。
- **用户后果**：即使应用起来了，用户也只会看到「存储健康 · 本地占用约 85KB」，
  完全不知道自己刚丢了 20000 条记录。

**确认缺陷 P2（测试基建）**｜`src/edge/verify/mg11-load-consistency.test.tsx:54`、`58`

- `vi.spyOn(window.localStorage, "setItem")` **在本项目的 jsdom 里是空操作**：
  `Storage` 实例把方法暴露成原型上的命名属性 getter，
  spy 既没拦住写入（`spy.mock.calls.length === 0`，值照常写进存储），
  还往 localStorage 里塞了一个名为 `"setItem"` 的**垃圾键**（占用配额、出现在遍历里）。
- `window.localStorage.getItem = () => "{ 这不是 JSON"`（同文件 `58`）同样无效。
- **实际**：该文件的两条「配额满」断言其实是在**未拦截**的前提下跑的，靠巧合通过。
  真正有效的做法只有 `Storage.prototype.setItem = fn`（`mg3e-startup-path.test.ts:284` 与
  `pf5-startup.test.tsx:150` 用的是对的）。
- **用户后果**：无（测试问题），但**会掩盖真实缺陷**——本轮的 P0a 就是因为桩无效而此前未被发现。

---

## 3. 多窗口 / 多标签一致性

**确认缺陷 P0**｜结构性问题，涉及全局

- **事实 1**：全仓 grep **没有任何** `addEventListener("storage", ...)`，也没有 `BroadcastChannel`。
  （已在 `env2c-multiwindow.test.ts` 里做成结构性断言，防止将来误判。）
- **事实 2**：`AppData`（`src/types.ts:401-439`）**没有**版本号 / 修订号 / 单调时钟字段；
  `commitData`（`src/AppContext.tsx:60-73`）是「整份对象覆盖写」——
  `writeRaw` 就是一次 `localStorage.setItem(STORAGE_KEY, JSON.stringify(data))`（`storage.ts:1310-1312`）。
- **实际**：
  1. 窗口 A 复习一张卡 → 落盘；
  2. 窗口 B（内存态是打开时的快照）改一个设置 → 落盘，**把 A 的整份记录覆盖掉**；
  3. A 的界面仍显示自己的记录（内存态），**刷新一次就永久消失**，无任何提示。
  实测（`env2c-multiwindow.test.ts`）：一个窗口导入 50 张卡，另一窗口**只改一个设置**，
  那 50 张卡就被整份抹掉。
- **期望**：至少监听 `storage` 事件做「外部变更 → 重载/合并」；或引入修订号 + 冲突提示。
- **用户后果**：Tauri 多窗口、浏览器多标签、以及「白天用浏览器版、晚上用桌面版」的场景下，
  **稳定丢进度且不可恢复**。这是本轮最容易真实发生的 P0——比配额撞墙更早出现。
- **可疑但未证实（需真机验证）**：
  - Tauri 2 默认单窗口（`src-tauri/tauri.conf.json` 只配了一个窗口），
    但用户可手动开第二个实例（`src-tauri/capabilities/default.json` 的 `windows: ["main"]` 只约束权限，不阻止多实例）；
    多实例是否共享同一 WebView 数据目录需真机确认。
  - Chrome/Edge 的「多标签」是否真会同时写同一站点（用户习惯）——需真机观察。

---

## 4. 数据迁移的时区 / 区域敏感性

### 4.1 口径清单

| 用途 | 位置 | 口径 | 跨时区后果 |
|------|------|------|-----------|
| 连胜（首页/统计） | `statsService.ts:546` `dayKey()`（`getFullYear/getMonth/getDate`） | **本地** | 跨时区后**重排**：两条记录可能塌进同一天 → 连胜 -1 |
| 连胜（学习日集合） | `learningTelemetry.ts:23-28` `localDateKey()` | **本地** | 同上 |
| 周宽限日窗口 | `statsService.ts:238-243` `startOfLocalWeek()` | **本地** | 跨周日/周一时刻，两地分属不同周 → 宽限次数变化 |
| 日记归属日 | `diaryService.ts:8-13` `localDateKey()` | **本地** | ✅ 自洽 |
| **日记抽题种子** | `GrammarDiaryPage.tsx:80` `new Date().toISOString().slice(0,10)` | **UTC** | ⚠️ 与上方**不一致**（见 4.2） |
| 错词本分组 / 日期标签 | `mistakeBookService.ts:58-65` `getLocalDateKey()` | **本地** | 键是绝对的，但「是不是今天」按当前时区算 → 跨时区后历史条目相对日期挪位 |
| 复习到期排期 | `reviewService.ts` `nextReviewAt`（ISO 绝对时刻） | **绝对时间** | ✅ 不错位（只有展示分桶按本地日） |
| 到期预测分桶 | `statsService.ts:652-662` `startOfLocalDay(nextReviewAt)` | **本地** | 同一张卡的「到期日」在两地差一天（预测图柱子挪位） |
| 冒险会话去重日 | `AdventurePlayPage.tsx:512` `toISOString().slice(0,10)` | **UTC** | ⚠️ 与用户眼里的「今天」不符（见 4.2） |

**结论**：主体口径（连胜、日记归属、错词本）是**本地时区**，正确。
绝对时间戳的排期不受影响。**问题只在两处 UTC 口径与本地口径混用。**

### 4.2 确认缺陷 P2（轻微错位，非数据丢失）

**缺陷 4a**｜`src/pages/GrammarDiaryPage.tsx:80` vs `src/services/diaryService.ts:126`

- **复现**（`env2d-timezone.test.ts` ENV2d-3）：东八区，取 `2026-09-21T17:00:00.000Z`（当地 9/22 01:00）。
- **实际**：抽题种子用 UTC 日 `2026-09-21`，而日记归属/「今日条数」用本地日 `2026-09-22`。
  实测两套键抽出**不同的题**（`["d-mix-drink", …]` vs `["d-tomorrow-want-v2", …]`）。
- **期望**：抽题种子与 `summarizeDiaryProgress().todayDateKey` 用同一口径。
- **用户后果**：**东八区每天 00:00–08:00（8 小时）**内，「今天抽到的题」与「今日进度」分属两天；
  凌晨换题的时间点与用户感知的「今天」不符。

**缺陷 4b**｜`src/pages/AdventurePlayPage.tsx:512`

- **实际**：会话去重键用 UTC 日。同一时刻在上海（UTC+8）当地是 9/22，键却是 9/21。
- **用户后果**：凌晨 8 小时内，同一「本地日」的第二次进入被判成 replay（重玩），
  会话统计口径与用户感知不一致。仅影响统计，不影响进度。

### 4.3 已确认「不会错位」的部分

- 排期落盘的是 ISO 绝对时刻（`createInitialSchedule` → `nowIso()`），跨时区不变。
- 跨时区后连胜「掉一天」（上海连胜 2 → 洛杉矶连胜 1）是**预期行为**：
  同一批绝对时刻在新时区确实落在不同天。属于「旅行的自然结果」，不是缺陷
  ——但**没有任何提示**，用户会觉得连胜莫名其妙断了（可作为体验改进项，非缺陷）。

---

## 5. 写盘时机与崩溃安全

### 5.1 逐处确认

| 位置 | 写入时机 | 崩溃/强杀时丢掉什么 |
|------|----------|---------------------|
| `src/AppContext.tsx:60-73` `commitData` | **同步**：`dataRef` → `setDataState` → `saveData` 同一次调用 | **无窗口期**（已用源码断言固定：commitData 块内无 `setTimeout` / `await`） |
| `src/pages/SettingsPage.tsx:243-251` autosave | **500ms debounce**（`AUTOSAVE_DELAY_MS = 500`，`56`） | 最多 500ms 的**设置项**改动 |
| `src/pages/SettingsPage.tsx:254-266` 兜底 flush | `pagehide` + `visibilitychange`（hidden）+ 卸载清理 | 覆盖浏览器关闭/刷新/切走；**不覆盖** SIGKILL |
| `src/AppContext.tsx:37,170-190` 云自动推送 | **3000ms debounce** | 只是云副本延迟；本地已落盘 |
| `src/pages/SpellingPage.tsx:362-380` 自动前进 | 只改 UI 状态；评分已在 `setData`（`456`）落盘 | **无** |
| `src/pages/UnitsPage.tsx:219-224` 撤销条 | 只隐藏提示；删除已在操作时落盘（注释明确） | **无** |

### 5.2 结论

**学习数据（答一题 / 写一篇日记）没有 debounce 窗口，每次操作同步落盘。**
这一点很重要：**答题答到一半被强杀，不会丢已提交的那一题**。
唯一的 500ms 窗口在设置页，最多丢一个偏好项。

- **确认缺陷 P3（可接受）**：`SettingsPage` 的兜底清单里**没有 `beforeunload`**，
  只有 `pagehide` / `visibilitychange`。
  - 浏览器里关标签/刷新会触发 `pagehide`（够用）；
  - **可疑但未证实（需真机验证）**：Tauri 里点窗口关闭按钮是否触发 `pagehide` 取决于 WebView 实现；
    进程被 SIGKILL（强制退出/崩溃）时**任何**事件都不会触发 → 那 500ms 内的设置改动必定丢失。
  - **用户后果**：最多丢一个刚改的设置项（如「每日新词数」），不影响学习进度。严重度低。

---

## 本轮新增的测试文件与运行结果

| 文件 | 用例数 | 覆盖 | 结果 |
|------|--------|------|------|
| `src/edge/verify/env2a-quota-unit.test.ts` | 11 | 配额口径：`storageCostBytes` 最坏情况计费、阈值方向、修复前后对比、刻意保留的偏差、各常量口径盘点 | ✅ 11 passed |
| `src/edge/verify/env2b-unavailable.test.tsx` | 15 | 存储不可用 7 种情形 + **不用任何桩的真实配额耗尽复现（P0a）** + 桩有效性验证 | ✅ 15 passed |
| `src/edge/verify/env2c-multiwindow.test.ts` | 5 | 多窗口覆盖写、导入被抹掉、`storage` 事件无人监听、源码结构性证据 | ✅ 5 passed |
| `src/edge/verify/env2d-timezone.test.ts` | 13 | 本地/UTC 口径清单、连胜重排、日记抽题错位、到期日分桶、冒险会话键 | ✅ 13 passed |
| `src/edge/verify/env2e-write-timing.test.tsx` | 6 | `commitData` 同步性（源码断言）、500ms 窗口实测、兜底 flush 覆盖面、云推送 debounce 影响面 | ✅ 6 passed |

**合计 50 个用例，全部通过。**

运行方式：

```bash
npx vitest run src/edge/verify/env2a-quota-unit.test.ts \
               src/edge/verify/env2b-unavailable.test.tsx \
               src/edge/verify/env2c-multiwindow.test.ts \
               src/edge/verify/env2d-timezone.test.ts \
               src/edge/verify/env2e-write-timing.test.tsx
```

**全量测试基线（`npx vitest run`）**：`2343 passed / 4 failed`。
失败的 4 条**不在本轮文件内**，来自并发会话正在编写的
`src/edge/verify/env1-export-download.test.ts` 与 `src/edge/verify/env4a-export-clipboard.test.tsx`
（22:08–22:10 写入，仍在变动中）。已用 `git stash` 隔离本轮的 5 个文件后复跑确认为其自身问题。
`npx tsc --noEmit` 退出码 0。

---

## 建议的修复优先级

1. **P0a**：`storage.ts:1287` 的 `writeRaw(migrated)` 加 try/catch；
   写入失败时**保留内存态的原数据**（不要把 `initial` 返回给应用）并置一个明确的告警信号。
   —— 这是唯一会导致**不可恢复数据丢失**的缺陷。
2. **P0b/P0c**：`storage.ts:1262`（`getItem`）与 `1265`（首次启动的 `writeRaw`）
   移入 try/catch；补一个顶层 ErrorBoundary 兜底。
3. **P0（多窗口）**：监听 `storage` 事件 + 引入修订号；至少做到「外部变更时提示用户重载」。
4. **P1**：`diagnoseStoredData` 区分「此刻可读」与「本次启动丢过数据」两个语义。
5. **P2（测试）**：把 `mg11-load-consistency.test.tsx` 里的 `vi.spyOn` 换成 `Storage.prototype` 补丁，
   并清理它塞进存储的 `"setItem"` 垃圾键。
6. **P2（时区）**：统一 `GrammarDiaryPage.tsx:80` 与 `AdventurePlayPage.tsx:512` 到本地日口径。
