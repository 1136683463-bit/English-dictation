# 冒险模块指标体系与数据依据

> 作者：数析（Metric）｜ 日期：2026-09-13
> 输入文档：GRAMMAR_ADVENTURE_PLAN.md §11、ADVENTURE_UX_PLAN.md §五、PRODUCT_PLAN.md、GRAMMAR_PRODUCT_PLAN.md
> 代码核查：`src/services/storage.ts`、`learningTelemetry.ts`、`grammarTelemetry.ts`、`adventureService.ts`

---

## 0. 边界声明（先读这段）

**这是一个自用、无后端、无真实用户群、当前无任何冒险模块埋点的本地应用。** 全部数据落在 `localStorage`（`personal-vocab-app-data-v1`，AppData schema v8）。因此：

1. **本文所有指标都是"框架设计"，不是"数据分析结论"。** 除了第 5 节引用的公开市场数据，本文不出现任何"当前值为 X"的表述——当前没有可统计的数据。
2. **所有目标值均为假设，待验证。** 下文标注「假设」的阈值，来源是 GRAMMAR_ADVENTURE_PLAN §11 的设计直觉或行业经验的迁移，在自有数据积累前不得作为考核依据。
3. **N=1 的统计特殊性。** 自用产品意味着"留存率、完成率"这类比率指标的分母是事件数（门数、章节数、会话数），不是用户数。单个用户的二值结果（回访/不回访）不构成"率"，只能做**纵向时间序列追踪**（本周 vs 上周）。下文对每个指标都给出了 N=1 口径。
4. **本框架的价值定位**：V2（语言之门、符文）改造上线后，用什么信号验证"手感"是否成立、何时该改机制而不是加内容。即 GRAMMAR_ADVENTURE_PLAN §11 那句"P1 结束时主动重玩率低于 10% 就改机制"的可执行化。
5. **好消息：采集基建已有先例。** `grammarTelemetry.ts` 已实现一套纯本地的事件日志（append-only、主键上限 + 归档键滚动、可导出 JSON）。冒险模块埋点应复用同一模式新建 `adventureTelemetry.ts`，不需要后端、不需要第三方 SDK，隐私与离线原则不受影响。

---

## 1. 北极星指标与指标树

### 1.1 北极星：**周冒险有效会话数**（Weekly Qualified Adventure Sessions, WQAS）

**定义**：一个自然周内，"主动进入冒险模块，且完成至少 1 个章节节点推进（V1）或至少 1 次语言之门提交（V2）"的会话数量。

**为什么是它而不是别的**：

| 候选 | 否决/采用理由 |
|---|---|
| 周冒险有效会话数 ✅ | 一个指标同时编码了三件事：**主动回访**（会话发起）、**完成价值动作**（节点/门完成，排除"点开就退"）、**频次**（会话数而非天数，能区分"每天来一点"和"一周突击一次"）。与 App 已有的全局北极星「周有效学习日」（`learningTelemetry.ts` 的 `learningDaysLast7`）同构，可以无缝挂进现有统计体系。 |
| 主动重玩率 | 是趣味性的诊断指标，不适合做北极星——重玩本身不产生学习进展，刷重玩可以"刷"高它。 |
| 章节完成数 | 只奖励推进，不奖励回访；且会被"一次玩 10 章"扭曲。 |
| 收词数 | 是副产品指标，收词多不等于愿意回来。 |

**目标（假设，待验证）**：稳定期 WQAS ≥ 3/周（即冒险成为每周学习习惯的一部分，而非一次性新鲜感）。P0 验证期不设目标，只记录基线。

### 1.2 指标树（三层）

```
北极星：周冒险有效会话数 (WQAS)
│
├── L1 结果指标（证明"值得回来"）
│   ├── D1 / D7 主动回访（N=1 口径：回访二值 + 周聚合天数）
│   ├── 世界/路线完成率（节点完成 ÷ 进入）
│   ├── 主动重玩率（同一节点/门被重复进入）
│   └── 符文收集进度（V2，30 张解锁曲线）
│
├── L2 过程指标（解释"为什么回来/不回来"）
│   ├── 创建漏斗：进入创建页 → 提交 → 生成成功 → 进入第 1 章
│   ├── 语言之门三档分布：pass / near / misread（V2 核心手感指标）
│   ├── 错误后立即重试率、平均每关尝试次数
│   ├── 单次会话时长、单会话推进节点数
│   ├── 选项选择 vs 自定义行动占比
│   ├── 生词收藏率（遇到的词 → 进冒险积累词书）
│   └── 随机推荐使用率（推荐生成 → 采纳）
│
└── L3 护栏指标（证明"没有在伤害体验"）
    ├── 错误后流失率：misread/near 后 30 秒内退出会话 ★现有 8 指标缺失
    ├── AI 生成失败率：创建 / 续写 / 推荐 三类分别统计（超时、JSON 解析失败、降级离线）★缺失
    ├── 语言之门挫败信号：同一门连续 ≥3 次未 pass ★缺失
    ├── TTS 播放失败率 ★缺失
    ├── 删除路线率（事后后悔信号，低优先）
    └── 遥测存储健康：事件量逼近 localStorage 上限的告警（复用 grammarTelemetry 的 stats 模式）
```

护栏的优先级说明：GRAMMAR_ADVENTURE_PLAN 的三条红线之一是「不制造焦虑」，所以**错误后流失率**和**语言之门挫败信号**是护栏里的最高级——它们直接度量"反馈是否伤人"，比任何趣味性结果指标都更接近红线。

---

## 2. 现有 8 个趣味指标评审（GRAMMAR_ADVENTURE_PLAN §11）

评审口径：① 当前可采集性；② 需要补什么事件；③ 目标值是否合理；④ N=1 口径修正。

| # | 指标（原定义） | 可采集性 | 需要新增的事件/字段 | 目标值评审 | 结论 |
|---|---|---|---|---|---|
| 1 | 主动重玩率 >20% | ⚠️ 部分。节点有 `createdAt`，但"重复进入"无记录，无法区分"重玩"与"继续推进" | `adventure_node_viewed`（带 nodeId + 是否首次） | "同一关卡"需精确定义：V2 语境建议改为"同一语言之门/同一节点在完成后被再次进入"。20% 来自游戏行业经验的迁移，N=1 下建议改为**假设：重玩会话占总会话 ≥15%**，验证期只看不判 | 保留，定义需精确化 |
| 2 | 错误后立即重试率 >90%（5 秒内） | ❌ 不可采集。无提交时间、无判定结果落库 | `adventure_gate_submitted`（verdict + attemptIndex + 时间戳），由相邻事件时间差推导"5 秒内" | **90% 过高**，这是 Duolingo 级即时反馈+零惩罚设计的理想值。本产品的判定含"写整句"，认知成本高，**建议假设值 ≥70%，<50% 触发反馈文案复查**。原文"低于 70% 说明反馈伤人"的方向正确 | 保留，下调阈值 |
| 3 | 平均每关尝试次数 1.5–2.5 | ❌ 不可采集 | 同上，`adventure_gate_submitted` 按 gateId 聚组 | 区间合理（下限防太简单、上限防提示不够），与三档判定机制自洽。**但需排除"放弃"样本**：尝试了但没 pass 就离开的门不应拉低均值 | 保留，补口径 |
| 4 | 单次时长 8–12 分钟 | ⚠️ 无会话概念，只有节点 `createdAt` 可粗略推导 | `adventure_session_start/end`（或以前后台切换 + 页面卸载推导） | 8–12 分钟与"60 秒读 + 60 秒门 + 30 秒收尾"× 4–6 循环的设计节奏一致，合理。">20 分钟有摩擦"正确，补充下界：**<3 分钟大概是"点开就退"，应单独统计为无效会话** | 保留，补下界 |
| 5 | 世界完成率 >60% | ⚠️ V1 可按 nodes 完成状态推导；V2 世界结构未落库 | `adventure_node_completed`；V2 需 worldId/stageId 属性 | N=1 下"完成率"退化为二值（这个用户完没完）。**建议改为"进入第 1 章后 7 日内推进到最后节点的路线占比"**（分母=创建的路线数），60% 假设保留 | 保留，改口径 |
| 6 | 符文收集进度（平均已解锁/30，稳定增长） | ❌ 符文系统未实现（V2 设计） | `adventure_rune_unlocked`（runeId + 等级） | "稳定增长"不是可判定目标。**建议改为可判定形式：解锁间隔中位数 ≤7 天；连续 14 天零解锁 = 收集驱动失效**。对 N=1 这是真正可操作的信号 | 保留，改为可判定形式 |
| 7 | D1/D7 回访（D1>50%，对比 V1 复习队列） | ⚠️ 全局层面可由 `reviews.reviewedAt` 推导（现有 streak 逻辑），冒险层面无 | 由 `adventure_session_start` 时间戳推导 | D1>50% 是消费级产品标准，对 N=1 无统计意义。**改为：安装新内容后 D1/D7 是否发生冒险会话（二值记录），并以周聚合看趋势**。与 V1 复习队列对比的思路很好，保留 | 保留，改 N=1 口径 |
| 8 | 主观一句话（结算后可选填） | ❌ 无入口 | `adventure_feedback_submitted`（文本 + 关联节点） | 唯一定性指标，必须保留。补充：**填报率本身也是指标**（愿意写一句话 ≈ 情感投入度的代理） | 保留，补填报率 |

**总体结论：8 个指标方向全部成立，但当前 0/8 可完整采集。** 其中 4 个（重玩、重试、尝试次数、时长）在补一组事件后即可落地；2 个（世界完成率、D1/D7）需要 N=1 口径重写；1 个（符文）依赖 V2 实现；1 个（主观一句话）需要新 UI 入口。

**补充的护栏指标**（原清单全缺，按优先级）：

1. **错误后流失率**（misread/near 后 30s 内会话结束）——直接对应"反馈伤人"红线，最高优先。
2. **AI 生成失败率**（创建/续写/推荐三类）——本产品创建链路强依赖外部 AI 网关，`adventureModelService.ts` 已有多层容错，失败是现实风险；且"未配置 AI 时推荐按钮禁用"（ADVENTURE_UX_PLAN 验收 4）说明团队已知此风险。
3. **同一门连续 ≥3 次未 pass**——挫败前置信号，触发提示升级（接近提示 → 完整答案）的逻辑验证。

---

## 3. 埋点事件清单

实现建议：新建 `src/services/adventureTelemetry.ts`，复用 `grammarTelemetry.ts` 的模式（append-only 数组、主键上限 + 归档键、`buildExport` 导出）。事件公共属性：`eventId / kind / timestamp / adventureId? / sessionId?`。

| 事件名 (kind) | 触发时机 | 关键属性 | 支撑的指标 |
|---|---|---|---|
| `adventure_create_started` | 进入创建流程 | template, level, source(offline/ai/custom) | 创建漏斗第 1 环 |
| `adventure_created` | 路线创建成功落库 | adventureId, template, level, source, hasCustomPrompt, nodeCount, durationMs | 创建漏斗、路线基数（完成率分母） |
| `adventure_create_failed` | 创建失败（AI 超时/解析失败/用户取消） | stage(request/parse/save), errorType, durationMs | ★AI 生成失败率 |
| `adventure_deleted` | 删除路线确认后 | adventureId, nodeCount, completedNodeCount, ageDays | 删除率、删除时进度（后悔信号） |
| `recommendation_requested` | 点击「随机推荐」 | — | 推荐功能使用率（分母） |
| `recommendation_generated` | 4 张推荐卡返回 | count, durationMs | 推荐成功率 |
| `recommendation_failed` | 推荐生成失败 | errorType | ★AI 生成失败率 |
| `recommendation_selected` | 选中推荐卡创建 | themeId, position(1-4) | 推荐采纳率 |
| `recommendation_restored_default` | 点击「恢复默认」 | — | 推荐质量反向信号 |
| `session_start` | 进入 /adventure/:id 阅读页 | adventureId, entrySource(continue/card/deep-link), isReplay(该路线今日是否已有会话) | WQAS、会话时长、D1/D7 回访 |
| `session_end` | 离开阅读页/应用切后台 | durationMs, nodesAdvanced, gatesAttempted, endContext(completed/choice/gate-error/idle) | 会话时长、★错误后流失 |
| `node_viewed` | 章节节点展示 | nodeId, chapter, isFirstView | 主动重玩率、阅读漏斗 |
| `node_completed` | 节点推进确认（V1：选完选项生成下一章） | nodeId, chapter, source(offline/ai) | 世界/路线完成率 |
| `choice_selected` | 点击剧情选项 | nodeId, choiceId, choiceIndex, isCustom | 选项 vs 自定义占比、分支偏好 |
| `custom_action_submitted` | 提交自定义行动 | nodeId, textLength | 自定义使用率 |
| `vocab_collected` | 生词加入冒险积累词书 | word, nodeId, cardId | 收词率、学习产出 |
| `gate_shown`（V2） | 语言之门出现 | gateId, runeId, targetPattern | 门的基数 |
| `gate_submitted`（V2） | 提交答案获判定 | gateId, verdict(pass/near/misread), attemptIndex, errorTags[], latencyMs, hintLevel | ★三档分布、重试率、尝试次数、错误后流失 |
| `gate_hint_used`（V2） | 请求提示 | gateId, hintLevel | 提示够不够（尝试次数过高时归因） |
| `gate_abandoned`（V2） | 未 pass 离开该门 | gateId, attempts, lastVerdict | ★挫败信号（连续未 pass 由本事件聚合） |
| `rune_unlocked`（V2） | 符文解锁/升级 | runeId, level(1-4), worldId | 符文收集进度、解锁间隔 |
| `tts_played` / `tts_failed` | TTS 播放成功/失败 | nodeId, voiceType(online/system) | ★TTS 失败率（已知发音链路风险） |
| `feedback_submitted` | 结算页提交主观一句话 | nodeId, textLength | 主观反馈、填报率 |

**与现有数据的关系**：`Adventure.nodes[].selectedChoiceId / vocabulary[].cardId / createdAt` 提供了部分状态回溯能力，但**无法还原时序与重试行为**（同一节点多次提交、5 秒内重试、会话边界），这是必须新增事件流而非纯状态推导的根本原因。

---

## 4. UX 验收标准的度量化映射（ADVENTURE_UX_PLAN §五）

7 条验收均为一次性人工验收项，其中 3 条可转化为持续监控指标，建议纳入埋点：

| 验收条目 | 可持续度量化 |
|---|---|
| ③ 随机推荐 4 卡 + 刷新不丢 | `recommendation_generated.count` 恒等于 4；推荐→创建转化率 |
| ④ 未配置 AI 时禁用并引导 | `recommendation_requested` 在 AI 未配置时应为 0（按钮禁用生效的验证） |
| ① 3 秒内看到"继续阅读" | 可由 `session_start.entrySource=continue` 占比间接验证继续入口的可用性 |

---

## 5. 市场数据（供竞品分析报告引用）

> 以下来自公开来源，标注年份与 URL。不同机构口径差异大，引用时建议给区间不给单点。

### 5.1 语言学习 App 市场规模

| 数据 | 数值 | 来源 |
|---|---|---|
| 全球语言学习 App 市场（2024） | 约 63.4 亿美元 | Straits Research，转引自 Quantumrun 统计（2026）：https://www.quantumrun.com/consulting/language-learning-apps |
| 预测（2033） | 约 243.9 亿美元，CAGR 16.15%（2025–2033） | 同上 |
| 另一口径：2024 年 120 亿美元 → 2035 年 380 亿，CAGR 11.05% | — | Market Research Future（2026-05 更新）：https://www.marketresearchfuture.com/reports/language-learning-apps-market-38354 |
| 2024 年品类 App 收入 / 下载量 | 11.1 亿美元 / 3.16 亿次 | Business of Apps，转引自 Quantumrun（同上） |

**口径提示**：MRFR 与 Straits 的 2024 基数相差近 2 倍（120 亿 vs 63 亿），主因是市场边界定义不同（是否含企业培训/线下数字化）。竞品报告中建议表述为"60–120 亿美元区间、双位数年增速"。

### 5.2 Duolingo 运营数据（财报口径）

| 指标 | 数值 | 来源 |
|---|---|---|
| DAU（2025 Q1） | 46.6M，同比 +49% | Duolingo Q1 2025 股东信：https://investors.duolingo.com/node/10926/html |
| MAU（2025 Q1） | 130.2M，同比 +33% | 同上 |
| DAU/MAU 粘性比（2025 Q1） | 35.8%（上年同期 32.1%） | Duolingo 10-Q：https://investors.duolingo.com/node/10931/ixbrl-viewer |
| DAU（2025 Q3） | >50M，同比 +36%；MAU 135M | Q3 2025 财报电话会纪要：https://www.theglobeandmail.com/investing/markets/stocks/DUOL/pressreleases/35957671/ |
| 付费订阅（2025 Q3） | 11.5M，同比 +34% | Quantumrun 转引（同上链接） |
| 2024 年收入 | 7.48 亿美元（约占品类 App 收入 2/3） | Duolingo IR，转引自 Quantumrun |

**对本产品的启示**（供分析引用，非指标承诺）：Duolingo 的 DAU/MAU 35.8% 是行业头部粘性基准；其增长策略明确以"让产品更有趣"驱动 DAU（财报原文 "making the product more fun and engaging"），与冒险模块"趣味性优先"的方向一致。但其 streak 机制的焦虑争议（GRAMMAR_ADVENTURE_PLAN §14 已引）正是本产品红线 3 要规避的。

---

## 6. 路线图度量节奏建议

### P0 验证期（自用、N=1、V2 语言之门首个世界上线后 2–4 周）

目标只有一个：**验证"手感"是否成立**。看三个信号，按优先级：

1. **语言之门三档分布 + 错误后流失率**（护栏优先）：misread 后 30 秒退出如果频繁发生，先改反馈文案与提示机制，其他都别做。
2. **错误后立即重试率 + 平均每门尝试次数**：重试率 <50% 或平均尝试 >3，说明"写句子推进剧情"的摩擦大于乐趣——对应原文"改机制而不是加内容"的决策点。
3. **主观一句话 + 会话时长**：定性校准，确认 8–12 分钟节奏是否真实成立。

此阶段**不设量化 KPI**，所有阈值是"触发复查"的假设值。每周末导出一次 telemetry JSON 人工复盘（无后端下的现实做法）。

### 放量后（若未来分享给他人/有小规模真实用户）

1. 北极星 WQAS 正式启用，目标 ≥3/周（假设），按周追踪。
2. 结果指标上线：路线完成率（7 日口径）、D1/D7、符文解锁间隔。
3. 护栏持续：AI 生成失败率（分创建/续写/推荐）、TTS 失败率——这两个在多用户下才会暴露真实的网关/网络分布。
4. 对比实验：冒险会话用户 vs 纯复习队列用户的周有效学习日（GRAMMAR_ADVENTURE_PLAN §11 已提出的对照思路，届时才有分母）。

### 不做的事

- 不接第三方分析 SDK（违背本地优先与隐私原则）。
- 不做 A/B 实验框架（N=1 无意义；放量后优先级也低于内容供给）。
- 不做实时看板（周度导出复盘足够）。
