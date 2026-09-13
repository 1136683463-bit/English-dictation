# 学习时长采集 二期预研（P2-R19）

- 日期：2026-09-13
- 参与成员：数析（Metric · 数据分析师）
- 关联 PRD：`deliverables/product-strategy/prd-stats-weekly-report-2026-09-13.md` 第 6 节 R19 行、第 8 节 Non-goals（「本期不做学习时长指标的页面展示」）
- 性质：研究/分析交付物。**本文不改动任何产品代码**，仅为二期接入提供方案对比与推荐。

---

## TL;DR

推荐**方案 A：Review 增加可选 `durationMs` 字段**作为二期主路径。理由：与既有数据模型同构（`HuntResult.durationMs` 已有先例，`src/types.ts:434`）、写入点唯一（`applyReviewWithUndo` 构造 review 处，`src/services/reviewService.ts:412-420`）、向后兼容只需在 `normalizeReview` 加一行透传、存储增量可忽略（年增约 0.3 MB）、对 R1-R18 全部指标**零污染**（所有指标只读 `rating/reviewedAt/cardId/mode`，不读新字段）。方案 B（独立 session 事件流）作为**扩展路径**保留：当二期口径从「复习耗时」扩大到「全场景学习时长」（课程/日记/侦探等非复习场景）时，以 statsTelemetry v1 独立 key 模式叠加，而非替代方案 A。

## 核心结论卡片

| 维度 | 方案 A：Review.durationMs | 方案 B：独立 session 事件流 |
|---|---|---|
| 数据粒度 | 单卡单次复习 | 会话级（可多场景） |
| 覆盖场景 | 仅复习类页面（Review/Spelling/GrammarReview） | 任意场景，含课程/日记/侦探 |
| 写入点 | 1 处（`applyReviewWithUndo`）+ 3 个页面计时 | 每场景各 1 个采集点 + 新模块 |
| 向后兼容 | normalize 透传一行，零迁移 | 天然独立 key，零迁移 |
| 存储成本（年） | ≈ +0.3 MB（并入 AppData 主 key） | ≈ 0.2 MB 封顶（MAX 1000 截断） |
| 对 R1-R18 污染 | 无（字段不被任何既有口径读取） | 无（旁路 key 不进 AppData） |
| 历史数据可回填性 | 否（接入前无 durationMs，为 undefined） | 否 |
| 实施成本（二期） | S（约 0.5–1 天） | M（约 2–3 天） |
| **结论** | ✅ **推荐主路径** | 保留为全场景扩展路径 |

---

## 1. 数据结构草案与向后兼容迁移

### 1.1 方案 A：Review 增加可选 durationMs

```ts
// src/types.ts — Review 接口增量（二期）
export interface Review {
  id: string;
  cardId: string;
  mode: ReviewMode;
  rating: Rating;
  answer: string;
  diffJson: string;
  reviewedAt: string;
  /** R19（二期）：本次复习作答耗时（毫秒）。采集前的历史记录为 undefined；
   *  统计口径中 undefined 一律视为「未知」而非 0，不参与均值/求和。 */
  durationMs?: number;
}
```

向后兼容迁移写法（严格套用 `normalizeReview` 既有模式，`src/services/storage.ts:403-417`）：

```ts
const normalizeReview = (value: unknown, cardIds: Set<string>): Review | null => {
  if (!isRecord(value)) return null;
  const cardId = asString(value.cardId);
  if (!cardIds.has(cardId)) return null;

  return {
    id: asString(value.id) || uid("review"),
    cardId,
    mode: normalizeReviewMode(value.mode),
    rating: normalizeRating(value.rating),
    answer: asString(value.answer),
    diffJson: asString(value.diffJson, "[]"),
    reviewedAt: validIsoOrNow(value.reviewedAt),
    // R19：可选字段透传——非法值（负数/NaN/非有限数）直接丢弃，不兜底为 0
    ...(Number.isFinite(value.durationMs) && (value.durationMs as number) > 0
      ? { durationMs: Math.round(value.durationMs as number) }
      : {})
  };
};
```

要点：

- 不写默认值。`durationMs?: number` 缺省即 `undefined`，与 `Card.masteredAt`（`types.ts:27`）、`Card.prioritySource`（`types.ts:23`）的可选字段先例一致，旧数据零迁移。
- 非法值**丢弃字段**而非钳到 0——避免「未知」与「0ms 秒答」混淆污染均值。
- `AppData.schemaVersion` 是否需要 +1：参照 `Card.masteredAt` 的 R13 先例（可选字段、normalize 兜底），**不需要**升 schemaVersion；normalize 每次加载都执行（`storage.ts:924`），天然完成「迁移」。
- 写入点：`applyReviewWithUndo` 构造 review 处（`reviewService.ts:412-420`）增加 `...(durationMs ? { durationMs } : {})`，函数签名追加可选末参，三个调用方（`ReviewPage.tsx:167`、`SpellingPage.tsx:412`、`GrammarReviewPage.tsx:68`）各自传入页面计时值。`undoReview`（`reviewService.ts:318-339`）按 reviewId 整条删除，无需改动。

### 1.2 方案 B：独立 session 事件流

完全复刻 statsTelemetry v1 模式（`src/services/statsTelemetry.ts:1-15`：独立 localStorage key、append-only、MAX 1000、schemaVersion、静默失败、内存降级）：

```ts
// 新模块 src/services/sessionTelemetry.ts（二期）
const SESSION_KEY = "study-session-events-v1";
const MAX_EVENTS = 1000;

export interface StudySessionEvent {
  kind: "study_session";
  schemaVersion: 1;
  ts: string;                 // 会话结束时间（nowIso）
  /** 场景：review / spelling / grammar_review / lesson / hunt / diary … */
  scene: string;
  /** 有效学习时长（毫秒，已扣除后台/暂停，已钳制）。 */
  durationMs: number;
  /** 会话内完成的复习数（复习类场景）或条目数。 */
  itemCount: number;
  /** 是否异常中断（页面关闭/崩溃后恢复发现的未完成会话）。 */
  interrupted?: boolean;
}
```

- 读取/写入/截断/降级逻辑逐行复用 statsTelemetry 的 `readEvents/writeEvents/appendStatsEvent` 三段式（`statsTelemetry.ts:58-87`），仅换 key 与事件类型。
- 天然向后兼容：不进 AppData、不进导出、不进迁移，旁路零侵入。
- 与方案 A 的关系：**互补不互斥**。B 管「总的在场学习时长」，A 管「单卡作答耗时」；二期若两个口径都要，先 A 后 B。

## 2. 采集点与计时口径

### 2.1 方案 A：单卡作答计时（复习页起止点怎么定）

三个复习入口的统一起止口径：

| 页面 | 起点 | 终点 |
|---|---|---|
| ReviewPage（recognize/recall） | 卡片正面渲染完成（current card 切换的 effect） | 用户点击评分按钮（调用 `applyReviewWithUndo` 前） |
| SpellingPage（spelling/dictation） | 题目呈现（输入框 focus 就绪） | 提交答案并触发评分 |
| GrammarReviewPage（cloze） | 任务句呈现 | 判定完成调用 `applyReview` |

计时实现：`performance.now()` 差值（单调时钟，不受系统时间回拨影响；`reviewedAt` 用墙钟、durationMs 用单调钟，各司其职）。

**暂停/切后台怎么办**（Tauri 桌面 + 浏览器双环境）：

1. 监听 `document.visibilitychange`：进入 hidden 时挂起累计，回到 visible 时恢复——**只累计前台可见时间**。
2. 单卡挂起超过 60s 后直接判定本次计时无效（`durationMs` 缺省不写），理由：用户大概率离开，恢复后的思考已不连续，计入只会污染分布。
3. 页面卸载（路由跳走/关窗）时未提交评分的卡片：不写任何记录——方案 A 的优势，未完成的作答根本不产生 Review，天然无脏数据。

**钳制口径**：

- 最小值：`durationMs < 500` 视为异常（连点/误触/测试数据），丢弃字段。500ms 低于人类读题+反应下限。
- 最大值：`durationMs > 120_000`（2 分钟）按无效处理，丢弃字段。单卡作答超 2 分钟几乎必然是挂起漏检，而非真实思考；宁可丢数据不可留长尾毒化均值。
- 区间内原样记录，不做 winsorize；截尾留给分析侧按 P99 处理。

### 2.2 方案 B：会话计时

- 起点：进入场景页；终点：离开场景页 / 累计无交互 5 分钟 / visibilitychange hidden 超 60s。
- 异常中断：`beforeunload` 尝试落盘 `interrupted: true` 的部分会话；失败则静默丢弃（沿用遥测「绝不影响主流程」原则）。
- 钳制：单会话 `[1000, 30 * 60 * 1000]`（1s–30min），超上限截断为 30min 并标记 `interrupted`。

### 2.3 异常中断对比结论

方案 A 的「未评分不记录」语义比 B 的「中途会话落盘」更干净：A 的脏数据入口只有挂起漏检一类，B 还有崩溃恢复、多窗口、路由竞态三类。这是推荐 A 的次要理由之一。

## 3. 存储成本估算

### 3.1 方案 A

- 每条 Review 增加 `,"durationMs":12345` ≈ **18–20 字节**（JSON 文本，含键名；5–6 位数值）。
- 复习量级估算：重度用户约 100 次/天 → 36,500 条/年 → **年增 ≈ 0.66–0.73 MB**（含 diffJson 已存在的体量不变，纯增量）。按典型用户 30–50 次/天计，**年增约 0.2–0.37 MB**。
- 全部并入 AppData 单一 localStorage key（`storage.ts` 的 STORAGE_KEY），localStorage 域级配额通常 5–10 MB；当前 AppData 本体以 cards/reviews 为主，reviews 已是无界增长数组——durationMs 使其单条增大约 3%–5%（单条含 diffJson 约 400–600 字节），不改变配额风险量级。
- 结论：**可忽略**，但顺带标记一个既有风险：reviews 数组无上限是独立问题，与 R19 无关，建议另行评估归档策略。

### 3.2 方案 B

- 单事件约 130–180 字节；MAX 1000 条 → **封顶 ≈ 0.18 MB**，独立 key，超出自动丢弃最旧（`statsTelemetry.ts:86` 同构）。
- 按每天 3–5 个会话计，1000 条覆盖约 7–11 个月，满足二期「日学习时长」趋势分析窗口需求。

### 3.3 对比

两者都不构成存储压力。差异在于：A 的增量**永久累积**在主数据里（跟随导出/云同步），B 有自我截断但数据会滚动丢失。对学习时长这种「趋势重于明细」的指标，B 的滚动丢失可接受；A 的永久保留对「单卡耗时 vs 掌握度」的纵向研究更有价值。

## 4. 对既有口径（R1-R18）的污染风险 —— 逐一过

前提：方案 A 只是给 Review 增加一个**没有任何既有代码读取**的可选字段。逐一核对：

| 指标 | 读取的 Review 字段 | 受影响？ | 依据 |
|---|---|---|---|
| 健康度（dueTotal/薄弱词等合成） | `rating`、`reviewedAt`、`cardId` | **否** | `getLearningStats`（`reviewService.ts:106-191`）只读 rating/reviewedAt/cardId |
| streak（连续学习天数） | `reviewedAt`（按本地日归组） | **否** | 只看日期，不看内容；新增字段不改变记录的存在性与时间 |
| 周环比（本周 vs 上周复习量/正确率） | `reviewedAt`、`rating` | **否** | 计数与正确率均不涉及时长 |
| 全模式正确率 | `rating`、`mode` | **否** | `isWrongReview` 只看 `rating <= 2`（`reviewService.ts:204`） |
| 记忆成熟度（masteredAt/status 分布） | Card.status / masteredAt，不读 Review 新字段 | **否** | mastered 转换逻辑在 `applyReviewWithUndo`（`reviewService.ts:407`），只依赖 rating 与 reviewCount |
| 到期预测（14 天到期曲线） | Schedule.nextReviewAt，不读 Review | **否** | 排期完全由 schedule 表驱动（`reviewService.ts:398-405`） |

补充三类间接风险及对策：

1. **normalize 丢字段风险（真实存在）**：当前 `normalizeReview` 是白名单重建对象（`storage.ts:408-416`），**如果二期只改 types.ts 不改 normalize，durationMs 会在每次加载时被静默剥离**。这是方案 A 唯一的实现陷阱，必须进验收标准（见第 5 节 AC-2）。
2. **undo 风险**：`undoReview` 按 id 整条过滤，durationMs 随记录一并撤销，无残留。✅
3. **导出/云同步体积**：durationMs 随 AppData 导出，增量见第 3.1 节，无风险；下游若有人用旧版解析导出文件，JSON 多一个键不影响解析（宽容解析是常态，且本项目导出消费者就是本应用自身）。

结论：**方案 A 对 R1-R18 全部指标零污染**，唯一工程风险是 normalize 白名单导致的字段静默丢失，由测试兜底。

方案 B 为旁路 key，同样零污染（statsTelemetry v1 已验证该模式：不进 AppData/迁移/导出，`statsTelemetry.ts:7`）。

## 5. 推荐方案与二期验收标准

### 5.1 推荐

**主路径：方案 A（Review.durationMs）**。

理由（按权重排序）：

1. **粒度决定问题空间**。二期最有分析价值的问题不是「今天学了几分钟」，而是「哪类卡/哪种模式耗时长且正确率低」——这必须 per-review 粒度，方案 B 给不出。
2. **工程同构成本低**。类型有 `HuntResult.durationMs` 先例、写入点唯一、normalize 模式现成、undo 天然兼容；方案 B 需要新建模块 + 每个场景各自接计时。
3. **脏数据面更小**（第 2.3 节）。
4. **不挡路**。A 落地后，若二期后半段需要全场景时长，B 以独立 key 叠加，二者 schema 互不耦合。

**B 的定位**：R19 的「路径降级」不是砍掉 B，而是把 B 降级为「二期视需求范围再启」的扩展项——若二期需求确认为「周报展示每日学习时长」且包含非复习场景，则 A+B 并行；若仅为复习场景，A 单独足够。

### 5.2 二期接入验收标准（Acceptance Criteria）

- **AC-1（兼容）**：用一期（无 durationMs）的真实数据文件启动，加载后 reviews 全部保留、无 `durationMs` 键；旧数据导出的 JSON 可被新版本无损导入。
- **AC-2（持久化）**：新增单测——`normalizeReview` 对含合法 `durationMs` 的输入透传该字段；对负数/NaN/字符串输入丢弃该字段；防止白名单重建把字段静默吃掉。
- **AC-3（口径）**：`durationMs` 实测分布满足：≥95% 样本落在 [500ms, 120s] 区间；区间外一律缺省不写（断言代码路径存在，而非依赖运行时侥幸）。
- **AC-4（零污染回归）**：R1-R18 既有单测（`reviewService.test.ts`、`statsService` 相关测试）全部通过，且新增一条回归断言——同一数据集在「reviews 全带 durationMs」与「全不带」两种输入下，`getLearningStats` 输出逐字段相等。
- **AC-5（暂停正确性）**：模拟 `visibilitychange` hidden 60s 以上，该卡提交后 `durationMs` 缺省或不含挂起时长（二选一，以实现文档为准）。
- **AC-6（不展示）**：二期展示层接入前，durationMs 不出现在任何 UI 与导出摘要中（延续本期 Non-goal 直到展示需求立项）。

## 6. R15 埋点 schema 的扩展位预留（schemaVersion 演进策略）

现状：statsTelemetry v1 的事件是 `kind + schemaVersion: 1` 字面量联合类型（`statsTelemetry.ts:21-46`），key 名带 v1 后缀（`stats-telemetry-events-v1`，`statsTelemetry.ts:17`）。

若二期要在此管道里加学习时长相关事件（如方案 B 的 session 事件、或周报页的时长卡片曝光），演进策略建议三条规则：

1. **新增事件 kind，不动既有 kind**：联合类型追加新成员（如 `StudySessionEvent`，`schemaVersion: 1`）。读取端按 `kind` 判别后处理，旧事件不受任何影响。这是首选路径，成本最低。
2. **既有事件加字段 = 该 kind 升 schemaVersion**：如 `stats_page_viewed` 要加 `weekStudyMs`，则新事件写 `schemaVersion: 2`，读取端对 v1 缺省、v2 读取。**key 名不换**——事件级 schemaVersion 足以区分，换 key 会割裂历史数据（注释里「升级 schemaVersion（v1 → v2），历史数据可区分」正是此意，`statsTelemetry.ts:11`）。
3. **仅当破坏性变更（字段语义反转/单位变更）才换 key**：如 durationMs 改成秒，旧数据无法兼容解释，此时启用 `stats-telemetry-events-v2` key，旧 key 只读封存供导出。

配套建议（非阻塞）：当前 `MAX_EVENTS = 1000` 对 2 个低频事件宽裕；若二期并入 session 事件（每天 3–5 条），建议把 MAX_EVENTS 提到 3000 或按 kind 分桶截断，避免高频事件把低频的 `stats_page_viewed` 挤出窗口——这条在二期接入时随 PR 一并评审即可，本期不动。

---

## 行动清单

| # | 事项 | 时点 | 负责 |
|---|---|---|---|
| 1 | 本文档归档至 deliverables，PRD R19 行标记「预研完成，待二期立项」 | 本周期 | 数析 |
| 2 | 二期立项时确认口径范围：仅复习场景（A 单独）vs 全场景学习时长（A+B） | 二期 kickoff | 方向明 + 数析 |
| 3 | 若启动方案 A：types.ts + normalizeReview + applyReviewWithUndo 签名 + 3 页面计时，按第 5.2 节 AC 验收 | 二期 | 工程 |
| 4 | 若启动方案 B：新建 sessionTelemetry 模块，复用 statsTelemetry 三段式；同步评审 MAX_EVENTS 扩容 | 二期（可选） | 工程 |
| 5 | reviews 数组无界增长的归档策略评估（独立问题，非 R19 范围） | 另行排期 | 数析 |

## 待确认 / 假设

- **假设 1**：二期「学习时长」的核心分析问题是 per-review 粒度（耗时 vs 正确率/模式/卡类型）。若方向明确认二期只要「每日总学习分钟数」一个数，方案 B 单独更省（A 的逐卡计时可砍）。
- **假设 2**：复习量级按 30–100 次/天估算，基于单机个人项目画像；无真实分布数据（本期无埋点覆盖复习频次）。
- **待确认 Q1**：复习页三个入口是否共用同一计时工具函数，还是各页面自管？（建议共用，二期技术方案阶段定）
- **待确认 Q2**：durationMs 是否进云同步载荷（默认随 AppData 走；若同步体积敏感可入同步黑名单，但当前无此机制）。
- **待确认 Q3**：钳制阈值 [500ms, 120s] 为经验值，二期接入后 2 周按真实分布校准一次。
- **Non-goals（本期）**：不展示、不改代码、不动 R15 埋点现有事件、不评估 reviews 归档。

## 数据来源索引

| 引用 | 位置 |
|---|---|
| Review 接口现状 | `src/types.ts:96-104` |
| durationMs 先例（HuntResult） | `src/types.ts:427-436` |
| 可选字段兼容先例（masteredAt / prioritySource） | `src/types.ts:22-27` |
| statsTelemetry v1 模式（独立 key/append-only/MAX 1000/静默失败/内存降级） | `src/services/statsTelemetry.ts:1-128` |
| normalizeReview 白名单重建 | `src/services/storage.ts:403-417` |
| AppData normalize 总装与 schemaVersion 收口 | `src/services/storage.ts:888-924` |
| Review 写入点（applyReviewWithUndo） | `src/services/reviewService.ts:412-420` |
| undoReview 整条删除 | `src/services/reviewService.ts:318-339` |
| 既有指标口径（getLearningStats / isWrongReview） | `src/services/reviewService.ts:106-204` |
| 三个复习页调用点 | `src/pages/ReviewPage.tsx:167`、`src/pages/SpellingPage.tsx:412`、`src/pages/GrammarReviewPage.tsx:68` |
| PRD R19 条目 / Non-goals | `deliverables/product-strategy/prd-stats-weekly-report-2026-09-13.md:151`、`:180-189` |
