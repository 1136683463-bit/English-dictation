# 统计板块（学习周报页）PRD 差距分析报告

- 日期：2026-09-13
- 作者：高见远（架构师）
- 对照文档：`deliverables/product-strategy/prd-stats-weekly-report-2026-09-13.md`（19 条需求：P0×8 / P1×7 / P2×4）
- 核查方式：通读当前代码逐条核实（PRD 引用的行号已全部过时，本报告以当前代码为准）+ `npx vitest run` 实测

---

## 1. TL;DR

**19 条需求中：已实现 15 / 部分实现 4 / 未实现 0。**

代码现状远超 PRD 的假设基线——PRD 第 5 节列举的 6 项高严重度口径问题（健康度 5 处缺陷、薄弱词只增不减、双周口径、目标完成度 4 处缺陷、dictation 被排除、weekMasteredCards 被污染）**在当前代码中均已修复**，且大部分带着 `R1`–`R19` 注释标记，说明此前已按本 PRD（或其口径审计输入）做过一轮集中落地。

剩余真实差距集中在 4 条：

| 需求 | 状态 | 核心差距 |
|---|---|---|
| P0-R2 薄弱词滑动口径 | 🟡 | 已改滑动口径但**不是方案 C**，且跨页三处薄弱词数字仍不同源（TrainingPage 用 `getWeakStats`，StatsPage 用 `getLearningStats`） |
| P0-R5 伪指标清理 | 🟡 | 硬编码 10/6 已删，但到期数全页仍出现 3 处（验收要求 ≤2 处） |
| P0-R6 信息架构重构 | 🟡 | 主行动/行动队列/状态词已就位；**渐进披露折叠、移动端首屏纯 coach 卡、入口收敛 ≤8 均未做**——这是剩余唯一 L 级工作 |
| P0-R8 口径唯一来源+测试 | 🟡 | 单测已补齐（58+18 用例，全套 400 绿）；但 `isWrongReview` 仍有 **3 处定义**、rating 值域校验**完全缺失** |

测试基线：**vitest 全绿，37 个测试文件 / 400 个用例通过**（2026-09-13 实测，5.5s）。`statsService.test.ts` 已从 PRD 所述"仅 1 个用例"扩到 58 个用例，`reviewService.test.ts` 18 个用例。

---

## 2. 逐条核查表（R1–R19）

### P0

| # | 状态 | 当前代码证据 | 差距说明 |
|---|---|---|---|
| **R1** 健康度公式下沉+修复 | ✅ | 常量区 `statsService.ts:11-22`（权重/82/62 阈值/薄弱惩罚 8）；纯函数 `computeHealthScoreBreakdown` `statsService.ts:78-127`，`hasActivity=false→null`（:79）、无数据维度剔除重归一化（:110-118）、`dueReviewGoal<=0` 到期维度剔除（:103-106）；视图层只调用 `StatsPage.tsx:126`；单测 8+4 用例 `statsService.test.ts:65-131,350-394` | 无实质差距。注：Q1（新卡立即到期）已通过 `getDueCards` 排除 `status="new"` 落地（`reviewService.ts:39-60`），`createInitialSchedule` 的 `nextReviewAt=now`（:33）仍在但不再造成 dueTotal 恒 >0 |
| **R2** 薄弱词滑动口径 | 🟡 | 滑动口径已实现：`reviewService.ts:115-138`（priority ‖ 最近一次低分 ‖ 近 14 天低分；lapseCount 显式不参与）；验收①有测试 `reviewService.test.ts:204-268` | ①**非方案 C**——未复用 `getWeakCardInsights score>0`，是自定义变体，需产品追认；②priority 通道仍只增不减（lapseCount≥3 自动置位 `reviewService.ts:408`，永不自动摘除）；③**跨页不同源**：健康度/行动卡用 `getLearningStats.weakWords`（`StatsPage.tsx:124`），TrainingPage 用 `getWeakStats`（`TrainingPage.tsx:27,41`，基于 score>0 集合），StatsPage 风险条用 `getWeakCardInsights`（`StatsPage.tsx:203`）——三处口径可产出三个不同数字，验收②未达成 |
| **R3** 空数据/新手态 | ✅ | `StatsPage.tsx:158-183`：无复习记录全页替换为引导态（"完成 3 天学习后生成第一份周报"+导入/添加双动作）；健康度 null 路径 `statsService.ts:79` | 机制与 PRD 字面不同：门控用 `data.reviews.length===0` 而非 `hasLearningActivity`（后者含 activeCards>0，`statsService.ts:487`）。"有卡无复习"用户也进引导态——验收标准（0 复习 0 卡片不出数字）满足，比 PRD 更保守 |
| **R4** "周"口径统一 | ✅ | 页头 chip 直接渲染 `weekRangeLabel`（自然周）`StatsPage.tsx:310-328`；趋势图已命名"最近 7 天复习趋势"（:483）；新词统一首次复习口径 `statsService.ts:303-306`；句子按 cardId 去重 :344-350；target=0 不参与平均 :377-382；无效日期过滤 :294-295；单测 6 用例 `statsService.test.ts:142-211` | 无 |
| **R5** 伪指标清理 | 🟡 | 「学习建议」硬编码 10/6 已删，下周建议为动态纯文案 `StatsPage.tsx:615-621` | **到期数仍 3 处**（验收要求 ≤2 处且一致）：行动队列"清到期复习 X 张"（:256，且 capped 到 12，与真实 dueTotal 可能不一致）、风险条 metric（:238）、复习概览"当前到期"（:668）；另 `stats-due-forecast`"未来 7 天到期 N 张"（:622-625）是第 4 个到期相关数字。薄弱词数出现在行动队列+复习概览，PRD 指定的权威位置"健康度展开层"反而没有 |
| **R6** 信息架构重构 | 🟡 | 单一主行动 coach 卡+一个主按钮 `StatsPage.tsx:383-390`；今日行动队列 :393-431；状态词统一行动指令取向 :44-51；KPI 3+1 指标行 :435-475 | **未完成过半**：①移动端首屏非纯 coach 卡——hero 区 coach+queue 双卡移动端纵向堆叠，首屏含队列；②**无渐进披露**——除健康度展开层外全部板块常显，PRD 第 7 节"可展开区 A–D 默认折叠"未实现；③**入口未收敛**——全页 11 个 Link，/review 目的地 4 个入口、/spelling?mode=mistakes 3+ 个入口（验收：≤8 且同 destination 仅 1 权威入口）；④桌面四屏结构未按第 7 节重组 |
| **R7** streak+每周宽限 | ✅ | `computeStreakWithGrace` `statsService.ts:585-625`：自然周 1 次、自动消耗、不可积攒、跨周重置、保断不加天、起点自然终止、今天在途豁免；UI 火焰+天数+宽限状态 `StatsPage.tsx:343-351`；单测 7 用例含跨周/跨月 `statsService.test.ts:272-348` | 微小缺口：streak=0（真断签）时不渲染任何 streak/宽限信息，断签回归者看不到"宽限已用/可用"说明；验收①-④场景均可通过 |
| **R8** 口径唯一来源+测试 | 🟡 | 单测大幅补齐：`statsService.test.ts` 58 用例、`reviewService.test.ts` 18 用例，全套 400 用例全绿 | ①**`isWrongReview` 仍有 3 处定义**：`statsService.ts:259`、`reviewService.ts:204`、`mistakeBookService.ts:67`（export）——验收①未达成；②**rating 值域校验全库缺失**（grep 无任何 1-4 范围检查），非法 rating（如 0/5/NaN）会被 `rating<=2`/`rating>=3` 静默归入某一侧——验收③未达成 |

### P1

| # | 状态 | 当前代码证据 | 差距说明 |
|---|---|---|---|
| **R9** 未来 14 天到期曲线 | ✅ | `getDueForecast` `statsService.ts:640-666`（与 dueNextWeek 同口径）；`buildDueForecastAdvice` :671-686（峰值超每日目标→建议、全空→正向文案、其余不打扰）；UI 柱状图+建议 `StatsPage.tsx:513-535`；单测 7 用例 :396-496 | 微小残留：PRD 说"替代下周负载单数字卡"，实际旧 `dueNextWeek` 单数字仍挂在下周建议下方（`StatsPage.tsx:622-625`），可随 R5/R6 一并清理 |
| **R10** 错词深链+假 affordance | ✅ | 错词榜每行 `/spelling?mode=mistakes&cardId=xxx` `StatsPage.tsx:572-574`；训练端支持 cardId 置顶起练 `SpellingPage.tsx:97-98,118,235`（`prioritizeStartCard`）；「卡片构成」已删（被成熟度替代）；「复习概览」为纯 div 无箭头无 hover `StatsPage.tsx:664-672` | 微小残留：风险条文案"到词库看来源句再巩固"跳泛 `/library`（`StatsPage.tsx:224-228`），无具体词/材料定位 |
| **R11** 健康度可解释化 | ✅ | `computeHealthScoreBreakdown` 与总分同源（`statsService.ts:78-127`）；展开层含维度得分/有效权重/贡献/"暂无数据，未参与计算"/topLever 提分指引 `StatsPage.tsx:360-382`；单测含"贡献加权和=总分" :361-368 | 无 |
| **R12** 记忆成熟度四桶 | ✅ | `getMaturityBucket` 阈值 0-1/2-6/7-20/≥21 `statsService.ts:702-707`（即 Q4 建议方案）；`getMaturityDistribution` :719-740（无 schedule 落入新学、suspended 不计）；UI 分布条+图例+空态 `StatsPage.tsx:629-675`；单测 3 用例含四桶和=总数 :498-550 | 无 |
| **R13** 周环比+北极星+口径修复 | ✅ | `masteredAt` 在 mastered 转换瞬间打点 `reviewService.ts:432-438`，`masteredTimeOf` 回退 updatedAt `statsService.ts:263`；`previousWeek` 同口径对照+hasBaseline :308-325；WeekDelta 组件（无基线显示"—"）`StatsPage.tsx:53-75`；北极星卡+里程碑叙事 :677-700 + `buildMasteredMilestone` `statsService.ts:763-776`；单测 7 用例含"markCardsPriority 后掌握数不变" :653-744 | 无 |
| **R14** 全模式正确率 | ✅ | `overallAccuracy`（全模式）主指标+`spellingAccuracy` 次指标 `statsService.ts:284-291`；UI 双层展示 `StatsPage.tsx:446-458`；单测 4 用例含 dictation-only 用户 :552-607 | 无 |
| **R15** statsTelemetry 埋点 v1 | ✅ | `src/services/statsTelemetry.ts` 完整存在：2 事件（page_viewed/action_clicked）、schemaVersion:1、独立 localStorage 键、append-only 上限 1000、无 localStorage 内存降级、写失败静默；页面集成 `StatsPage.tsx:27,130-143,148-156`（新手态不上报曝光） | 小缺口：无 `statsTelemetry.test.ts`（参照物 `grammarTelemetry.test.ts` 有 6 用例）；内存降级路径无测试守护 |
| **R16** 趋势图可读性 | ✅ | 图例（正确/错误双系列一一对应）`StatsPage.tsx:485-488`；每日数值常显（:505 `<strong>{day.reviews}</strong>`，移动端不 hover 可读）；0 值不画残影 :493-494 | 可选项"叠加 7 日正确率折线"未做（PRD 标"可选"，不算缺口） |
| **R17** "每日上限"文案 | ✅ | "按你的每日目标，约需 X 天清完" `StatsPage.tsx:236`；页面 UI 已无"每日上限"裸术语（仅服务层注释/测试名残留，用户不可见） | 无 |
| **R18** 零成本指标择优上页 | ✅ | `weekActiveDays`/`weekFixedWords`/`elapsedWeekDays` `statsService.ts:330-343`，上页于 KPI 区 `StatsPage.tsx:469-474`，均带行动含义文案；单测 2 用例 :609-651 | 复习留存率未上页——"择优"语义下可接受 |
| **R19** 学习时长采集预研 | ✅ | 预研文档已交付：`deliverables/product-strategy/preresearch-study-duration-tracking-2026-09-13.md`（推荐方案 A：Review 加可选 durationMs，明确本期不改代码）；`Review` 接口当前无 durationMs（`types.ts:100-108`），符合 Non-goal | 无 |

---

## 3. 测试基线现状

- **框架/脚本**：vitest 2.1.9，`npm test` = `vitest run`（package.json:10）。
- **实测结果**（2026-09-13，`npx vitest run`）：**37 个测试文件全部通过，400/400 用例通过，耗时 5.5s**。
- 统计相关用例分布：
  - `statsService.test.ts`：**58 用例**（PRD 审计时仅 1 个）——健康度 8+breakdown 4、R4 口径 6、streak 7、宽限 7、到期预测 3+4、成熟度 3、R14 全模式 4、R18 零成本 2、R13 环比/北极星 7、周报表综合 1、getHealthTone 1；
  - `reviewService.test.ts`：**18 用例**，含 R2 滑动口径 4 用例（"30 天前错一次后连续 10 次正确不再计入"已覆盖）。
- **缺口**：
  - `statsTelemetry.test.ts` 不存在（R15 内存降级/截断/静默失败无测试守护）；
  - rating 值域校验本身缺失，自然也无对应测试；
  - `isWrongReview` 三处定义若口径漂移，现有测试无法发现（各测各的文件内副本）。

---

## 4. 已实现/部分实现条目对 PRD 排期的影响

PRD 排期为 5 周 + 1 缓冲（兼职 3.5 有效日/周）。按当前代码现状：

| PRD 原计划 | 现状 | 排期影响 |
|---|---|---|
| W1：R1（2d）→ R2（1d）→ R5（0.5d） | R1 完成；R2 主体完成；R5 完成一半 | **W1 整周可压缩到 ~1 天**：R2 同源化决策+统一（0.5d）+ R5 到期数收敛（0.2d） |
| W2：R2 收尾 → R4（1.5d）→ R3（0.5d）→ R8（1d）→ R15（0.5d） | R4/R3/R15 完成；R8 剩 2 个硬缺口 | **W2 压缩到 ~0.5-1 天**：isWrongReview 三合一路径、rating 值域校验、statsTelemetry 测试 |
| W3-W4：R6 重构（3.5d+1d）；并行 R7 逻辑层 | R7 完成（逻辑+上页+测试）；R6 完成约 40% | **R6 成为唯一关键路径**，可聚焦剩余 60%（折叠/移动端首屏/入口收敛），估 2.5-3d；R7 的 0.5d+ 并行投入全部释放 |
| W5：R14（0.5d）→ R9（1.5d）→ R12（1.5d） | 三条全部完成 | **整周 3.5d 释放** |
| W6：R11（1.5d）→ R13（1.5d）→ P2 R16/R17/R18（1d）→ 标定报告 | R11/R13/R16/R17/R18 全部完成 | **仅剩 M4 阈值标定**（依赖 R15 数据积累——R15 已上线，但积累期从今天起算，标定窗口需相应顺延） |
| P2-R19 预研文档 | 已交付 | 释放 |

**结论**：19 条中 15 条已完成，PRD 的 5+1 周排期可压缩为 **2 个短批次 + R6 一个主批次**（详见下节）。M1（可信度地基）DoD 四条中 ②③④ 已基本满足，唯一不达标的是 ①中"isWrongReview 单源"与 rating 校验。

注意：R15 虽已上线，但 PRD 的"W2 末上线→W6 有 4 周数据"假设已不成立——数据积累从实际上线日起算，**M4 阈值标定最早需 R15 上线满 4 周后进行**，这与 R6 何时完成解耦，是当前排期上唯一的自然时间约束。

---

## 5. 建议的实施批次（基于实际差距）

### 批次 1：口径收尾（估 1-1.5 天，无 UI 风险）

1. **R8 收尾**：`isWrongReview`/`isCorrectReview` 收敛为 1 处导出（建议放 `reviewService.ts` 或新 `reviewRating.ts`），`statsService.ts:258-259`、`mistakeBookService.ts:67` 改为引用；rating 值域校验（建议在为 stats 聚合入口加 `isValidRating`，非法值不计入任何侧）+ 对应单测。
2. **R2 同源化**：先决策——追认当前变体口径（priority ‖ 最近一次低分 ‖ 14 天窗口）还是迁移到方案 C；然后统一 `TrainingPage` 的 `getWeakStats` 与健康度所用口径，保证"健康度、摘要、行动卡"三处数字一致。注意 priority 通道的永久置位问题需要一并决策（建议：lapseCount≥3 自动 priority 的词，若连续 N 次正确自动摘除，或滑动口径中 priority 也加时间窗）。
3. **R5 收尾**：到期数收敛到 ≤2 处（建议保留行动队列+风险摘要，删复习概览"当前到期"；顺带删 R9 残留的 `dueNextWeek` 单数字条）。
4. 补 `statsTelemetry.test.ts`（复刻 grammarTelemetry.test.ts 6 用例结构，0.2d）。

### 批次 2：R6 信息架构重构（估 2.5-3 天，唯一大项）

只做剩余部分，不重做已完成部分：
- 可展开区 A–D 默认折叠（移动端+桌面第三/四屏）；
- 移动端首屏纯 coach 卡（行动队列下沉为第二屏）；
- 入口收敛：同 destination 仅 1 权威入口，全页 ≤8（错词榜 5 行深链是 R10 验收要求，建议在计数口径上与团队对齐——或收敛为 Top 3 + "查看全部"）；
- 桌面按 PRD 第 7 节四屏结构微调。
- 前置保护：批次 1 完成后测试基线已足够（400 用例），满足"R8 先于 R6"的安全网要求。

### 批次 3：观测与标定（时间约束项，非工作量项）

- R15 上线满 4 周后做 82/62 阈值回放标定（Q5），产出标定或沿用默认的二选一结论。
- 可选：R7 微小缺口（streak=0 时的宽限状态提示）、R10 残留（"看来源句"深链到具体材料）。

### 决策项状态更新（PRD 第 10 节 Q1-Q5）

| # | PRD 状态 | 当前实际 |
|---|---|---|
| Q1 新卡立即到期 | 待确认（建议默认不改） | **已通过 `getDueCards` 排除 new 卡落地**（reviewService.ts:39-60），无需再决策，但需产品知会这一口径已变更 |
| Q2 薄弱词口径方案 | 待确认（建议方案 C） | **实际落地的是变体**（非 A/B/C 任一），需重新追认或返工到方案 C |
| Q3 宽限细则 | 待确认（建议每周 1 次周一重置） | 已按建议完整落地（含"保断不加天"细化），仅需确认"宽限即将使用"页内提示不做 |
| Q4 成熟度阈值 | 待确认（建议 intervalDays 0-1/2-6/7-20/≥21） | 已按建议落地（statsService.ts:702-707） |
| Q5 82/62 标定 | W6 回放 | 数据积累期需从 R15 实际上线日重算 |

---

*本报告仅做只读分析与测试验证，未修改 src 下任何业务代码。*
