# 统计板块增量设计 + 任务分解（批次 1 口径收尾 + 批次 2 R6 重构）

- 日期：2026-09-13
- 作者：高见远（架构师）
- 前置文档：`stats-weekly-gap-analysis-2026-09-13.md`（差距分析，含全部 file:line 证据）
- 已确认决策：Q2 追认变体口径不迁移方案 C；错词榜 Top 3 + 查看全部；Q1 保持现状（新卡不到期）；priority 康复摘星本轮一并处理
- 约束：最小变更；只做设计不改代码；不破坏现有 400 绿测试

---

## 0. 设计总览

| 任务 | 内容 | 依赖 | 预估改动文件数 | 预估工时 |
|---|---|---|---|---|
| T1 | R8：rating 判定单源化 + 值域校验 | 无 | 5（1 新建） | 0.5d |
| T2 | R2：薄弱词唯一权威源 + priority 康复摘星 | T1 | 6 | 1d |
| T3 | R5：到期数收敛 + 行动逻辑抽离 statsActions | T2 | 3（1 新建） | 0.5d |
| T4 | R15 补测：statsTelemetry.test.ts | 无（可并行） | 1（新建） | 0.2d |
| T5 | R6：入口收敛 + 渐进披露 + 移动端首屏 + 桌面四屏 | T3 | 4（1 新建组件） | 2.5d |

实施顺序：**T1 → T2 → T3 → T5**，T4 任意时间插入。T1/T2/T3 完成后即形成 R6 重构的安全网（单源判定 + 权威口径 + 可测的行动逻辑纯函数）。

---

## T1 — R8 收尾：rating 判定函数单源化 + 值域校验

### 目标文件
- 新建 `src/services/reviewRating.ts`
- 新建 `src/services/reviewRating.test.ts`
- 改 `src/services/statsService.ts`（删 :258-259 本地定义）
- 改 `src/services/reviewService.ts`（删 :204 本地定义）
- 改 `src/services/mistakeBookService.ts`（删 :67 本地定义）

### 改动点

**1. 新建 `reviewRating.ts`（唯一权威，零运行时依赖，仅 import types）**

```ts
// R8：rating 判定的唯一权威来源。statsService / reviewService / mistakeBookService
// 一律从这里 import，禁止再写本地副本（此前 3 处定义，口径漂移测试无法发现）。
export const isValidRating = (value: unknown): value is Rating =>
  Number.isInteger(value) && (value as number) >= 1 && (value as number) <= 4;

export const isCorrectReview = (review: Review) =>
  isValidRating(review.rating) ? review.rating >= 3 : false;

export const isWrongReview = (review: Review) =>
  isValidRating(review.rating) ? review.rating <= 2 : true; // 非法值静默归类为错误
```

非法值处理策略（已确认方向的具体化）：
- **统计归类**：非法 rating（非整数 / 0 / 5 / NaN）一律计入「错误」侧——宁多报错不漏错，与"非法数据按坏处理"的防御原则一致；同时保证 `isCorrect && isWrong` 互斥且对所有值完备（每个 review 恰好落入一侧），现有聚合（正确率、趋势、薄弱词）不会出现"总数对不上"。
- **上报**：`isWrongReview` 命中非法值分支时 `console.warn`，模块级 `Set<string>` 按 `review.id` 去重（同一 id 只 warn 一次，避免聚合循环刷屏），warn 内容含 `id/rating/mode/reviewedAt`。判定函数保持**引用透明**（同输入同输出），warn 是唯一副作用，不影响可测性。
- **不动存量数据**、不改 `storage.ts:394-401` 的 `normalizeRating`（加载层钳制保持不变；本任务是统计层防御，两层职责不同：加载层修复落盘数据，统计层防御内存态/同步/测试构造的异常对象）。

**2. 三处迁移**
- `statsService.ts:258-259`：删除本地 `isCorrectReview`/`isWrongReview`，改为 `import { isCorrectReview, isWrongReview } from "./reviewRating"`。
- `reviewService.ts:204`：删除本地定义，同上 import。
- `mistakeBookService.ts:67`：删除本地定义，改为 `export { isWrongReview } from "./reviewRating"` —— 再导出保持既有 API，`MistakeBookPage.tsx:42` 等调用方**零改动**。

### 数据结构/接口变化
无数据模型变化。新增 3 个导出函数；`mistakeBookService.isWrongReview` 签名不变。

### 测试（reviewRating.test.ts，6 用例）
describe 命名：`"reviewRating 值域与对错判定（R8）"`
1. `合法 rating：1/2 为错，3/4 为对`
2. `非法 rating（0/5/2.5/NaN/undefined）一律计入错误侧`
3. `非法 rating 不计入正确侧（isCorrect=false）`
4. `每个 review 恰好落入一侧（isCorrect 与 isWrong 互斥且完备）`
5. `非法值首次触发 console.warn 且同 id 不重复`（vi.spyOn(console, "warn")）
6. `合法值不触发 warn`

### DoD
- 全库 `grep "rating <= 2\|rating >= 3"` 仅剩 `reviewRating.ts` 一处实现；
- 6 个新用例通过；既有 400 用例全绿（口径等价，无行为变化）。

---

## T2 — R2 同源化：薄弱词唯一权威函数 + priority 康复摘星

### 目标文件
- 改 `src/services/reviewService.ts`（抽权威函数、康复逻辑、prioritySystem 口径）
- 改 `src/types.ts`（Schedule 加可选字段）
- 改 `src/services/storage.ts`（normalizeSchedules 透传）
- 改 `src/pages/TrainingPage.tsx`（迁移数据源）
- 改 `src/pages/ReviewPage.tsx`（迁移数据源）
- 改 `src/services/reviewService.test.ts`（新增用例）

### 改动点

**1. 薄弱词唯一权威源（追认变体口径：priority ‖ 最近一次低分 ‖ 近 14 天低分）**

- `reviewService.ts` 新增导出：
```ts
// R2：薄弱词滑动口径的唯一权威实现（Q2 已追认为正式口径）。
// 健康度、Today 摘要、Training/Review 页的薄弱词数字必须全部源于此函数。
export const getWeakCards = (data: AppData): Card[] => { ... }
```
  实现 = 现 `getLearningStats` 内 :115-138 的滑动口径逻辑原样抽出（含 `recentWrongSince`、`latestReviewByCardId`、`recentWrongCardIds` 的构建），判定用 T1 的 `isWrongReview`。
- `getLearningStats`（:106-191）内部改为调用 `getWeakCards`，`weakCards`/`weakWords` 返回值不变（纯重构）。
- **迁移不同源调用方**：
  - `TrainingPage.tsx`：`getWeakStats` import（:15）删除；:27 `weakStats.weakWords` → `stats.weakWords`（`getLearningStats` 已在调用，:26 的 `getWeakStats(data)` 整行删除）；:41、:127、:138 同步替换。
  - `ReviewPage.tsx`：:114 的 `getWeakStats(data)` 保留但只用 `consecutiveErrorWords`；:291、:400 的 `weakStats.weakWords` 改为权威源数字（`getLearningStats(data).weakWords`，或与 consecutive 拆分两次调用——见下方取舍）。
  - `getWeakStats`（reviewService.ts:276-283）：保留导出防外部断裂，但 `weakWords` 字段改委托 `getWeakCards` 计数（不再用 insights 长度），并加注释 `@deprecated 薄弱词计数请用 getLearningStats().weakWords / getWeakCards；本函数仅继续提供 consecutiveErrorWords / recentErrorWords`。
  - `LibraryPage.tsx:46,233` 已用 `getLearningStats` ✅ 不改。`StatsPage.tsx:124` 健康度输入 ✅ 已是权威源，不改。
- 取舍说明：ReviewPage 的"N 个错词 · M 个连续错误"中，N 迁移后与 StatsPage/TrainingPage 同源；M（连续错误）是另一个指标、口径本就不同（insights 的 consecutiveWrongCount≥2），文案已作区分，保留不动。

**2. priority 康复摘星（用户决策 4 的判定方案）**

判定规则：
- **参与对象**：仅 `card.priority === true && card.prioritySource !== "manual"` 的卡（含 legacy 无 source 的卡——与 `reviewService.ts:410` 现有 `?? "system"` 语义一致）。**手动标星永不自动摘除**。
- **康复计数**：`Schedule` 新增可选字段 `recoveryCount?: number`；在 `applyReviewWithUndo`（reviewService.ts:373-410）中：
  - `rating >= 3`（用 T1 判定）→ `recoveryCount = (recoveryCount ?? 0) + 1`；
  - `rating <= 2` → `recoveryCount = 0`（清零重来）；
  - 非 priority 或 manual 卡 → 不维护该字段（保持 undefined）；
  - `recoveryCount >= PRIORITY_RECOVERY_THRESHOLD`（新常量 `= 2`，与 WEAK_WORD_PENALTY 同风格集中在常量区，注释 R2）→ 本次写入 `priority: false`、删除 `prioritySource`、`recoveryCount` 归零。
- **连带修正（不做则康复无效）**：`lapseCount >= 3` 是终身累计值，若保留它作为"系统关注"的独立兜底，摘星后会被立即算回。两处同步改：
  - `reviewService.ts:172-174` `prioritySystem`：改为 `card.priority && card.prioritySource !== "manual"`；
  - `LibraryPage.tsx:254-256` `isSystemPriority`：同步改为同一表达式（删 `|| lapseCount >= 3` 兜底）。
  - 影响声明：`applyReviewWithUndo:408-410` 的 lapseCount≥3 自动置位逻辑**保持不变**（新 lapse 仍会进系统关注）；仅"历史 lapse≥3 但从未被置位 priority"的卡不再算系统关注，prioritySystem 数字可能略降——属口径修正而非 bug，需在 PR 描述中注明。
- **存储兼容**：`types.ts:161` `Schedule` 加 `recoveryCount?: number`；`storage.ts` `normalizeSchedules`（:816-823 显式构造对象处）加一行透传：
  `...(item.recoveryCount !== undefined ? { recoveryCount: Math.max(0, Math.round(asNumber(item.recoveryCount, 0))) } : {})`
  旧数据无此字段 → undefined，天然向后兼容，无需迁移版本号。

### 数据结构/接口变化
- `Schedule.recoveryCount?: number`（新增可选字段）；
- 新增导出 `getWeakCards`、`PRIORITY_RECOVERY_THRESHOLD`；
- `getWeakStats.weakWords` 语义切换为权威口径（值可能变化，属预期）。

### 测试（reviewService.test.ts 新增，7 用例）
describe：`"getWeakCards 权威口径（R2）"` 与 `"priority 康复摘星（R2）"`
1. `getLearningStats.weakWords 与 getWeakCards 过滤 word 后数量一致`（同源回归）
2. `getWeakStats.weakWords 委托权威口径，与 getLearningStats 一致`
3. `系统置位 priority 连续 2 次 rating≥3 后自动摘除且清 prioritySource`
4. `仅 1 次 rating≥3 不摘除（recoveryCount=1）`
5. `两次正确中间夹一次 rating≤2，计数清零重新累计`
6. `manual 标星连续正确也不摘除`
7. `康复摘星后该词（无近期低分）退出 getWeakCards`

### DoD
- TrainingPage / ReviewPage / StatsPage / LibraryPage 四页薄弱词数字同源（代码上均指向 getLearningStats/getWeakCards）；
- 上述 7 用例通过；既有 reviewService 18 用例中 :249-268（priority 计入薄弱词）与 :290-318（自动置位）按新口径微调后全绿；
- 全套 400+ 用例绿。

---

## T3 — R5 收尾：到期数收敛 + 行动逻辑抽离

### 目标文件
- 新建 `src/services/statsActions.ts` 与 `src/services/statsActions.test.ts`
- 改 `src/pages/StatsPage.tsx`

### 改动点

**1. 到期数保留 2 处、删 2 处（PRD-R5 验收②）**
- **保留①**：行动队列行 1 `清到期复习`（StatsPage.tsx:251-261）。`amount` 由 capped 的 `duePlanCount`（:247，`min(due, goal, 12)`）改为**真实 `stats.dueTotal`**——消除"显示数与实际到期数不一致"的次生口径问题；链接 `limit=${duePlanCount}` 参数保留（那是训练量上限，不是展示数）。
- **保留②**：风险条 `复习负债` metric（StatsPage.tsx:233-243）。
- **删除①**：复习概览 `当前到期` 行（StatsPage.tsx:668）。
- **删除②**：`未来 7 天预计到期 N 张` 条（StatsPage.tsx:622-625，R9 残留的单数字卡，已被 14 天曲线替代）。
- **薄弱词数**：复习概览 `薄弱词` 行（:669）删除；权威位置 = 行动队列行 2 amount（已有）+ 健康度展开层 weakWords 维度行补词数（StatsPage.tsx:362-374 渲染时，对 `dimension.key === "weakWords"` 的行追加 `（N 个）`，数据源 `healthInput.weakWords`，service 层不动）。

**2. 行动逻辑抽离为纯函数（为 T5 入口收敛铺路）**
- 新建 `src/services/statsActions.ts`，把 StatsPage.tsx:44-51（getReportStatus）、:194-293（primaryAction / riskBands / topRisk / todayPlan 构建）原样上移为纯函数：
```ts
// R5/R6：周报页全部行动入口的唯一构建处。入口收敛（同 destination 去重、
// 总数 ≤8）在这里以纯函数保证，视图层只渲染不决策。
export const buildStatsActions = (input: {...}): {
  reportStatus: string;
  primaryAction: { label: string; to: string };
  todayPlan: TodayPlanStep[];      // 已按主行动去重
  riskBands: RiskBand[];
  topRisk: RiskBand;
} => ...
```
- 输入为已算好的 stats/weekly/派生值，函数内不再读 AppData 全量（latestMaterial、dailySentences 等作为参数传入）。StatsPage 改为一次调用 + 渲染。
- 本任务只做"原样上移 + 到期数两处删除"，**去重规则在 T5 实现**（避免一个任务混两类变更）。

### 数据结构/接口变化
新增 `buildStatsActions` 及相关类型导出；无数据模型变化。

### 测试（statsActions.test.ts，6 用例）
describe：`"buildStatsActions（R5/R6）"`
1. `有到期时主行动为清到期复习（/review）`
2. `无到期有薄弱词时主行动为练错词（/spelling?mode=mistakes）`
3. `无负债时主行动为继续训练（/training）`
4. `队列行 1 amount 展示真实 dueTotal（不被 cap 12 截断）`
5. `topRisk 选择优先级：red > blue > 首项`
6. `reportStatus：due>0 先清到期 / weak>0 先稳错词 / 阈值分档`

### DoD
- StatsPage 全页到期相关数字恰好 2 处且数值一致（UI 走查）；薄弱词数字恰好 2 处；
- 6 个新用例 + 400 既有用例全绿；StatsPage.tsx 视图层不含行动决策逻辑。

---

## T4 — R15 补测：statsTelemetry.test.ts（独立，可并行）

### 目标文件
- 新建 `src/services/statsTelemetry.test.ts`

### 改动点
复刻 `grammarTelemetry.test.ts` 的环境模式（6 用例结构），覆盖 `statsTelemetry.ts` 的验收③：
1. `无 localStorage 时内存降级：track 后 listStatsEvents 可读`（node 环境天然无 window，直接走内存路径）
2. `clearStatsTelemetry 清空内存事件`
3. `超过 1000 条截断最旧、保留最新`
4. `buildStatsTelemetryExport 输出 {version:1, exportedAt, totalEvents, events} 结构`
5. `track 自动补齐 kind/schemaVersion:1/ts`
6. `localStorage 写入抛错时静默不抛`（vi.stubGlobal 构造抛错 storage）

### DoD
6 用例通过；statsTelemetry.ts 源码零改动（若测试暴露缺陷另议）。

---

## T5 — R6 重构：入口收敛 + 渐进披露 + 移动端首屏 + 桌面四屏

依赖 T3 的 `buildStatsActions`。预估 2.5d，是本批唯一大项。

### 目标文件
- 新建 `src/components/CollapsibleSection.tsx` 与 `src/components/CollapsibleSection.test.tsx`
- 改 `src/pages/StatsPage.tsx`（结构重组）
- 改 `src/styles.css`（折叠区样式 + 少量结构调整）
- 改 `src/services/statsActions.ts` / `.test.ts`（入口去重规则 + 计数断言）

### T5a 入口收敛：最终 Link 清单（≤8）

去重规则（实现于 `buildStatsActions`）：
- 队列行与主行动 destination 相同（同 path 前缀）时，该行降级为**非链接展示行**（保留计划信息，不可点击）；
- 风险条 `tone === "green"`（无风险）时不渲染为 Link；
- 错词榜由 Top 5 收为 **Top 3 + 查看全部**；
- 队列行 4「材料补练」**删除**（/library 主导航可达，与训练行动语义弱相关；latestMaterial 信息不再上页——此为收敛代价，已含在已确认的入口方案内）。

最终完整 Link 清单（按页面位置）：

| # | 位置 | 元素 | 目的地 | 条件 |
|---|---|---|---|---|
| 1 | Coach 卡 | 主行动按钮 | `/review` 或 `/spelling?mode=mistakes` 或 `/training` | 恒有 |
| 2 | 今日行动队列 | 行 1 清到期复习 | `/review?plan=today&step=due&limit=N` | due>0 且主行动≠/review |
| 3 | 今日行动队列 | 行 2 错词拼写 | `/spelling?mode=mistakes&plan=today&limit=N` | weak>0 且主行动≠mistakes |
| 4 | 今日行动队列 | 行 3 句子复盘 | `/review?plan=today&step=sentences&limit=N` 或 `/add` | 恒有（/add 与主行动从不冲突） |
| 5 | 错词与风险卡 | 风险条 | 动态（topRisk.to） | topRisk.tone ≠ green |
| 6-8 | 错词榜 | Top 3 行 | `/spelling?mode=mistakes&cardId=<id>` | mostWrongWords 非空 |
| — | 错词榜尾 | 「查看全部」 | `/mistakes` | mostWrongWords > 3；与 Top 3 同属错词榜区，按已确认方案作为榜内导航不计独立行动入口 |

计数验证：有负债典型态 = 1+2+1+3 = 7；全健康态（主行动 /training、无去重、风险条 green 非链接、错词榜空）= 1+3 = 4；最重态（主行动 /training 且三项负债并存——不可能，主行动三选一必与队列行 1 或 2 撞 destination 触发去重）数学上界 = 8。**任何数据状态下可点击跳转元素 ≤8**，由单测断言（见 DoD）。

埋点注意：`trackAction`（StatsPage.tsx:148-156）的 actionId 集合随之收敛为 `primary / plan / risk / wrong_word / wrong_all`，`statsTelemetry.ts:36` 的 actionId 注释同步更新（schema 不变，仍 v1）。

### T5b 可展开区：新增 CollapsibleSection 组件

- 项目现状：无通用折叠组件，各页就地 `useState + aria-expanded`（如 MistakeBookPage.tsx:1262）。本次首次泛化：
```tsx
// src/components/CollapsibleSection.tsx（约 50 行）
interface CollapsibleSectionProps {
  eyebrow: string;        // 如 "Report"
  title: ReactNode;       // 区标题（含 icon）
  summary?: ReactNode;    // 折叠态显示的一行摘要（如 KPI 关键数）
  defaultOpen: boolean;
  children: ReactNode;
}
```
- 交互：header 为 `<button aria-expanded>`，展开/收起切换；`prefers-reduced-motion` 下跳过高度动画（styles.css 已有 4 处同类媒体查询惯例，:4010 等）。
- 视觉：复用 `.stats-card` 容器样式，折叠态只显示 header 行 + summary，与现有 stats 区块视觉一致。
- 四个可展开区（对应 PRD 第 7 节 A–D）：
  - **A 数据报告**：KPI 行（StatsPage.tsx:435-475）+ 趋势/14 天预测（:479-536 左卡）
  - **B 错词与风险**：风险条 + 错词榜 Top 3 + 查看全部（:538-589）
  - **C 目标与建议**：本周目标 + 下周建议（:594-627，删除到期单数字条后）
  - **D 成就与概览**：北极星 + 记忆成熟度 + 复习概览（:629-700）
- 默认状态：**移动端（≤860px）A/B/C/D 全折叠；桌面 A 展开、B/C/D 折叠**。初始化用 mount 时一次性 `window.matchMedia("(max-width: 860px)").matches`（与 styles.css:24746 的 861px 桌面断点对齐），**不订阅断点变化**——local-first 单页、窗口拖拽跨越断点是极少数场景，订阅会引入受控状态同步复杂度，收益不成比例（在代码注释中写明该取舍）。

### T5c 移动端首屏纯 coach 卡：条件渲染（非 CSS 隐藏）

- 决策：**条件渲染**，不用 CSS `display:none`。理由：display:none 的队列仍含 4 个可聚焦 Link（键盘/读屏可及），且 hero 双卡 DOM 结构与移动端单卡语义顺序冲突；条件渲染一处 `isMobile` 初值驱动，无双份 DOM。
- 实现：StatsPage 顶层 `const [isMobile] = useState(() => window.matchMedia("(max-width: 860px)").matches)`（与 T5b 同一初值，不订阅）：
  - 桌面：hero 保持现状（coach + 队列双卡，styles.css:24746-24748 的 1:1.2 grid 不动）；
  - 移动端：hero 只渲染 coach 卡；「今日行动队列」整体降级为第一个 CollapsibleSection（defaultOpen=false，summary 显示 `hasTrainingDebt ? "约 10 分钟 · 先压到期" : "保持手感"`）。
- 效果：移动端首屏 = PageHeader（含周范围 chip）+ coach 卡（状态词 + 健康环 + streak + 主行动按钮），无任何第二个可点击行动入口露出。

### T5d 桌面四屏调整范围（最小化）

- 仅做**容器层**调整：把现有 ②③④ 三个 section（StatsPage.tsx:434-701）拆入 A–D 四个 CollapsibleSection；现 `.stats-grid-2col`（趋势+风险）与 `.stats-grid-3col`（目标+成熟度+北极星）两个 grid 拆开，各卡片独立入区（风险卡入 B、目标卡入 C、成熟度+北极星入 D）。
- 卡片内部布局、样式、KPI 数值展示**零改动**；`.stats-grid-2col` / `.stats-grid-3col` 样式类如不再被引用则删除对应 CSS（styles.css:24117、:24456、:24750-24763 的响应式规则同步清理）。
- 顺序：PageHeader → hero（coach[+队列]）→ A → B → C → D，与 PRD「首屏纯行动、下滑纯报告」一致。

### 测试
- `CollapsibleSection.test.tsx`（4 用例，参照 SpellingErrorReview.test.tsx 的 jsdom 组件测试模式）：默认折叠不渲染 children、点击 header 展开、aria-expanded 同步、defaultOpen=true 直接展开。
- `statsActions.test.ts` 追加（3 用例）：
  - `队列行与主行动同 destination 时降级为非链接`（各主行动分支）
  - `全数据状态组合下可点击入口数 ≤8`（参数化 4 组典型 AppData 快照）
  - `风险条 green 时不产出链接`
- 既有 400 用例回归全绿（StatsPage 无既有组件测试，无破坏面）。

### DoD（对应 PRD-R6 验收）
- 任意数据状态：页面可点击跳转元素 ≤8，同 destination 仅 1 个权威入口（单测断言 + UI 走查）；
- 移动端（≤860px）首屏仅 coach 卡为完整行动卡，队列与 A–D 区默认折叠（UI 走查 375px 宽）；
- 桌面端 A 区默认展开、B–D 默认折叠，折叠状态切换正常；
- 错词榜 Top 3 深链可用 + 查看全部跳 /mistakes（R10 验收不回退）；
- 埋点 actionId 集合更新后 stats_action_clicked 正常上报（手工验证 + 既有埋点测试绿）。

---

## 6. 共享约定

1. **R 注释风格延续**：所有新增/修改处用 `// R2：...` / `// R8：...` 单行注释说明口径意图，与现有代码（statsService.ts:8-22、reviewService.ts:36-38 等）一致；跨任务决策（如入口去重规则、matchMedia 不订阅的取舍）写在代码注释而非仅 PR 描述。
2. **测试命名**：`describe("<函数名> <主题>（R<编号>）")`，用例标题用中文行为描述（与 statsService.test.ts:142、reviewService.test.ts:204 现有风格一致）。
3. **测试基线保护**：每个任务提交前 `npx vitest run` 全绿；T2 涉及既有用例口径微调（reviewService.test.ts:249-268、:290-318），只允许"随口径修正更新期望值"，禁止删除用例或放宽断言。
4. **最小变更**：不动调度算法（applyReview 的间隔/ease 逻辑）、不动 R19 预留的 durationMs 方案、不重构与本批无关的页面；LibraryPage 除 prioritySystem 表达式一行外不碰。
5. **范围外跟进项**（本批不做，列入 backlog）：R7 的 streak=0 时宽限状态提示、R10 的"看来源句"深链到具体材料、M4 阈值标定（R15 满 4 周后）。

---

## 7. 风险登记

| 风险 | 等级 | 缓解 |
|---|---|---|
| T2 prioritySystem 口径修正导致"系统关注"计数下降，用户感知为重点丢失 | 低 | PR 描述注明；LibraryPage 筛选语义同步更新文案（如需） |
| T5 matchMedia 不订阅：窗口跨断点拖拽后布局不切换 | 低 | 注释声明取舍；刷新即恢复 |
| T5 删除「材料补练」行后材料入口变深 | 低 | 主导航 /library 可达；已含在确认的入口收敛方案内 |
| T2 recoveryCount 存于 Schedule，undo（undoReview）需同步恢复快照 | 中 | undoReview（reviewService.ts:318-339）已整体恢复 previousSchedule，天然覆盖新字段——需在 T2 用例中补 1 条 undo 回归断言（并入用例 3 或单列） |
| T3 队列行 1 amount 改真实 dueTotal 后大数字挤压布局 | 低 | amount 已有样式容器；>99 显示无碍，UI 走查确认 |
