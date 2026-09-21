# 指标评审：语法模块 AI 触点全量实读

**日期**：2026-09-21
**类型**：数据审计（数析）
**参与成员**：数析（数据分析师）、路径（路线图规划师，独立复测）
**范围**：2026-09-19 → 2026-09-21（对比上轮 2026-09-19 审计）

---

## 📌 TL;DR

- **核心目标**：回答"AI 到底帮到用户了吗"，并把每个数字落到可追溯的文件行号。
- **关键决策**：行为类指标**当前不可算**（无遥测导出文件），故全部指标以实读代码 + 脚本实测量为口径。
- **下一步**：补 `ai_explain_*` 汇总段（当前事件写得进、读不出）。

---

## 🎯 核心结论卡片

| 项目 | 内容 |
|------|------|
| 推荐方案 | 三项 P0：合并课内配额 / 补汇总段 / 修 rateExplain |
| 优先级 | P0 |
| 预期影响 | 让"AI 有效吗"从不可算变为可算；课内延迟回到门禁内 |
| 资源需求 | ≈1.0 人日（三项） |
| 风险等级 | 低 |

---

## 数据源声明

全库**无遥测导出文件**（`find` 无 `grammar-telemetry*.json` 命中）。故「本期」= 实读代码 + 可执行脚本实测量的口径与规模；行为类指标（触发率/有用率/降级率）**当前不可算**，本报告不用估算值填充。

---

## 关键指标概览

| 指标 | 本期（实读确认） | 上期（9-19 审计） | 变化 | 状态 |
|---|---|---|---|---|
| 语法模块 AI 落点总数 | **8 处**（课内 2 / 课后 4 / 日记 1 / 周报 1） | 4 处 | +4 | ✅ |
| 课内 AI 调用点 | **2 处**（watch 追问 + 答错追问，同一服务） | 0 处 | +2 | ✅ |
| 课内最坏 AI 等待 | **40s = +6.7%**（4 次×10s 钳制） | 推算 ≤16s（+2.7%） | **+24s** | ❌ **破 +30s 门禁** |
| 单次超时钳制 | 追问/小结 10s；boost 8–10s；**日记 ≥15s（默认 120s）** | 同 | — | ⚠️ 日记不在钳制内 |
| 缓存 TTL | explain/boost 批改/课小结 30d；周报 7d；**变式题无 TTL** | 计划 30d | — | ⚠️ 一处漏 TTL |
| 本地匹配命中（真实错法实测） | **6.6%–32.6%**（三类真实错法） | 未测 | — | ⚠️ 低于直觉 |
| 本地结构兜底覆盖 | **100%**（2430/2430 样本） | 0 | +100pp | ✅ 意外主力 |
| 预写素材（可引用源） | **3435 条 / 192 课**（均 17.9/课） | 110 课 | +82 课 | ✅ |
| AI 反馈可回收 | 答错追问 ✅ / **问一句 ❌** | 均 ❌ | 半修 | ⚠️ 文档与代码矛盾 |
| AI 指标聚合段 | **0 个**（explain/why-wrong 无汇总） | 无 | — | ❌ 事件写得进、读不出 |
| S5 当场重测 | 事件实现 **0 条** | 计划 P2 | — | ❌ 目标永不可算 |
| 测试 | 1109 通过 / 92 文件（基线） | 826 全绿 | +283 | ✅ |

*（来源：`src/services/grammarExplainAiService.ts:26`、`grammarBoostAiService.ts:26-30`、`diaryService.ts:284`、`storage.ts:76`；`grammarExplainService.ts:225`、`GrammarLessonPage.tsx:1720/1740`）*

---

## 洞察

### 1. AI 触点已铺 8 处，但延迟预算被自己的代码击穿

四处课内/课后触点是：watch 深挖卡追问（`GrammarLessonPage.tsx:1606`，配额 ≤2/课，`grammarExplainService.ts:225`）、答错追问（`:1673`，课级保险丝 `aiCallsThisLessonRef < 2`，`:1720`）、趁热练整档合批批改（`GrammarBoostPage.tsx:380`）、档 3 变式题生成（`:436`）。

**关键缺陷**：追问配额（`explainQuotaRef`，`:601`）与答错追问保险丝（`aiCallsThisLessonRef`，`:629`）是**两套独立计数器**——最坏 2×10s + 2×10s = **40s**，而 PRD 写死的「≤2 次/课，最坏 +16s」只算了其中一套（`prd-grammar-ai-tutor-2026-09-19.md:29`）。按 10.0min 单课基线，+40s = +6.7%，**直接触发 PRD 自己的「durationMs 增量 >30s 即回退」门禁**。这不是理论风险：连问两次追问后再连错两次，代码允许它发生。

### 2. 降级 5 条，课内 5 条全部静默；可见提示都在课后

`ExplainDegradeReason` 枚举 4 值 + 弃权（`grammarExplainAiService.ts:105`）：`not_configured`（未配置时入口根本不渲染，`:2449` `aiConfigured &&`）、`timeout`、`error`、`invalid`（三道校验任一不过整条丢弃，`grammarExplainService.ts:185-220`）、`declined`（固定话术「这一课没讲到这个，我不瞎猜。」`:170`）。

用户可见提示仅 2 处，且都在正课之外：趁热练档 3 的 `aiNotice`（`GrammarBoostPage.tsx:424-428`）与日记失败 `message`（`GrammarDiaryPage.tsx:240`）。从「不打扰」看是纪律；从「AI 帮到用户了吗」看是**测量黑洞**：用户问一句失败后（骨架消失、无文案、无空位），既没有正向信号也没有负向信号，连失败本身都只是事件里一个 `ok:false`。

### 3. 本地覆盖率有两个极端，差距 6–15 倍

① 对本课自己的素材：`matchWhyWrong` 对 692 条 contrast.wrong 回测 **100% 精确命中**——但这是同义反复（拿库存字符串查库存），不构成覆盖率证据。

② 对**真实错法**（脚本构造三类常见错法跑全库 192 课）：去掉冠词 **13.4%**、丢三单 -s **32.6%**、多加 not **6.6%**；按「删第 2 词」生成 1150 例，L1 精确 8.1% + L1.5 近似 6.0% = 本地链 **14.1%**，其余 **85.9% 落 AI 或兜底**。

③ 近似层误配风险实测：同课内两两 diffScore ≥85 的冲突对 **19/1096 = 1.73%**（跨课随机对 0.25%）——`matchWhyWrong` 的「同课限定 + ≥85 + 换序短路」确实把风险压到了 2% 以下，但这 1.73% 就是「讲错」的理论上限。

> **路径复核**：以"相邻换序"为代理样本扩大测试后实测——命中 348 次，其中 **138 次（39.7%）讲解完全不提「顺序」**。这比 1.73% 的理论上限更具体地暴露了问题。

### 4. 兜底层是这轮最大的意外收益，且零埋点

`explainStructuralWhy`（`grammarExplainService.ts:407`）对三类错法的覆盖率实测 **2430/2430 = 100%**（swap 1536 / missing 489 / wrong-word 405）。guided arrange 题的邻近换序变体，本地层只命中 2.7%，但**结构兜底 100% 接住**。

也就是说：AI 全挂时，用户答错仍然能拿到「哪个词放错了、为什么」——**这一层完全没有埋点**（无事件区分「AI 讲的」与「本地结构讲的」），所以「AI 到底有没有增量」在数据上不可证。

### 5. 反馈按钮：一半修好了，一半还是坏的——且文档说都修了

`rateWhyWrong` 有完整已选态 + 防重复（`GrammarLessonPage.tsx:1780-1781`，三处渲染 `:2888/2922/3121` 带 `.rated` 类与「收到，谢谢反馈」）。

但 `rateExplain`（问一句回答卡，`:1655-1665`）**无守卫、无已选态**：`askRated` 状态声明于 `:600`、重置于 `:1614`，**全文件再无第三处引用**；三个按钮（`:2512-2514`）无 `rated` 类、无感谢提示、无防重复。`IMPLEMENTATION_NOTES.md:635` 明确写着「「问一句」回答卡的三按钮同样修了」——**与代码不符**，用户实测反馈②在这个入口上仍未修复。

另有两处死状态：`whyWrongQuotaRef`（`:625`）声明后**零调用**；`practice_why_wrong_requested.quotaState` 硬编码 `"available"`（`:1692`）——「配额用尽」态**永不上报**，PRD 的配额护栏在数据上无法验证。

### 6. 素材底座：3435 条可引用源 / 均 17.9 条每课，这就是 AI 的问题域上限

实读全库：192 课全部有 deepDive（749 段 / 63,373 字，均 330 字/课）；contrast 1152 条（其中 460 条 bothRight 不参与匹配、640 条有 wrongMark）、whyZh 1152 条 57,835 字（均 50 字）；guided.explain 1151 条 35,923 字；summary.points 577 条；oneLineRule 192/192 覆盖；recall.noteZh 191；variants.noteZh 508；sceneSwings 576。

`buildLessonExplainContext` 产出 `allowedSources`：deepDive 749 + contrast 1152 + guided 1151 + oneLineRule 192 + recall 191 = **3435 条，每课 15–19 条**。

含义：AI 只能在这 15–19 条里选择与改写（`validateExplainAnswer` 的 `citation` + `foreign` 两道校验硬锁，`grammarExplainService.ts:201-212`）。**这既是防幻觉的根因，也是问题域的天花板**——超出这 17.9 条的提问必然落 `declined`。

预设追问每课 2.99 条（574 条全库，190 课 3 条 / 2 课 2 条），全由 contrast/variants/oneLineRule 确定性生成。配套：guided 薄讲解 210/1151，其中 **198 条被 resolver 自动升级（94.3%）**，仅 12 条本课无素材。

### 7. 上轮 PRD 落地：P0 7/8、P1 2/3、P2 1/3；缺口集中在「读得出来」而非「写得进去」

已实现：R-AI0 埋点 4/5、R-AI1 答对补「为什么」（`practiceWhy :868`、`outputWhy :914`、pretest whyZh `:445`）、R-AI2 术语清理、R-AI3 预设追问、R-AI4 追问 UI+配额、R-AI5 三道校验+弃权、R-AI6 缓存+四降级、R-AI9 卡住追问、R-AI12 追问进弱点档案（权重 0.5）。

**未实现**：R-AI7 汇总段（三事件全写了，`summarizeGrammarTelemetry` 里**没有 explain 段落**）、R-AI8 清追问缓存出口（`clearExplainCache` 在 `src/pages` 零调用）、R-AI10 hunt 罪名追问、R-AI11 当场重测（`lesson_recheck_result` 全库 0 处）→ **S5 目标永不可算**、R-AI13 统计页面板。另：PRD 设计的 `weekly_summary_ai_result` 事件**从未实现**，周报 AI 至今零观测。

---

## 建议

1. **P0 — 合并两套课内配额（0.3 人日）**：把 `explainQuotaRef` 与 `aiCallsThisLessonRef` 合并为单一 ≤2 计数。不改则代码持续允许突破自己的 +30s 门禁。
2. **P0 — 补 `ai_explain_*` / `practice_why_wrong_*` 汇总段（0.5 人日）**：比照 `summarizeBoost` / `summarizeAiCalls` 加 `explain` 段落，输出触发率、有用率、弃权率、校验丢弃分布、降级率、真实 P90。当前这些事件写得进、读不出，等于没埋。
3. **P0 — 修 `rateExplain`（0.2 人日）**：加已选态 + 防重复，与 `rateWhyWrong` 对齐；同时修 `IMPLEMENTATION_NOTES.md:635` 的失实描述。
4. **P1 — AI 增量归因埋点（0.5 人日）**：`practice_why_wrong_result` 增 `layer`（local_exact/local_fuzzy/ai/structural/fallback）与 `model`（对齐 boost 的 `byModel`），`ai_explain_result` 补 `model`。没有这层，「AI 有没有比本地兜底多给东西」无法回答——而本地结构兜底 100% 覆盖意味着这个问题必须回答。
5. **P1 — 补 `quotaState` 真实值与变式题缓存 TTL**：前者让配额护栏可验证，后者防 `cached=true` 永久化（`grammarBoostAiService.ts:399` 无 TTL）。
6. **P2 — 若 S5 仍是验收目标，先上 `lesson_recheck_result`（2 人日）**；否则应在 PRD 中显式降级该目标，不要留在指标表里当作「待读数」。

---

## AI 效能度量的缺口清单（要回答「AI 到底帮到用户了吗」）

| # | 缺口 | 现状证据 | 缺了它无法回答 |
|---|---|---|---|
| 1 | explain/why-wrong **无汇总函数** | `grammarTelemetry.ts:837` summary 无 explain 字段 | 触发率/有用率/弃权率/P90 全不可算（PRD 二级指标 6 项全空） |
| 2 | **无 AI 增量归因**（AI vs 本地结构/本地命中） | `explainStructuralWhy` 零事件；why-wrong result 无 layer 字段 | AI 相对免费兜底的边际价值 |
| 3 | **无采纳信号**（看完 corrected/recast 后做什么） | 全库无采纳/忽略/重写事件 | AI 批改是否被使用，而非仅被展示 |
| 4 | **无 token/cost 字段** | `aiHttpClient.ts` 不解析 `usage`；所有 AI 事件无 token | 成本（延迟已知是瓶颈，但成本仍零可见） |
| 5 | 反馈闭环半断（问一句） | `askRated` 死状态，`:2512-2514` 无守卫 | 问一句的有用率会被重复点击污染，且用户仍以为按钮坏了 |
| 6 | 配额状态不可见 | `quotaState` 硬编码 `"available"`（`:1692`） | 配额是否真的在拦截（PRD AC-M2-2 无法验收） |
| 7 | 周报 AI 零埋点 | `weekly_summary_ai_result` 未实现 | 8 处 AI 落点里唯一完全无观测的一处 |
| 8 | `deep_dive_impression/dwell` 无消费方 | 事件已写（`GrammarLessonPage.tsx:2436/2440`），summary 不聚合 | S4 配对（dwell ≥20s vs 跳过）与追问触发率的分母 |
| 9 | S5 分子事件缺失 | `lesson_recheck_result` 全库 0 处 | 「讲解后当场重测」永不可算 |
| 10 | 无模型维度（explain 线） | `ai_explain_result` 无 `model`；boost 有 | 换模型决策只能凭感觉 |

---

## ⚠️ 待确认 / 假设 / Non-goals

**未核实/假设**：
- 单课 10.0min 基线仍为 2026-09-13 的 n=1 单次测量，本轮未复测。
- 本地命中率与结构兜底覆盖率来自脚本构造的错法样本，**非真实用户错句**——真实错句留痕机制（`appendWhyWrongLog` + `whyWrongHitRate()`，`grammarExplainService.ts:559`）已在代码中但 `whyWrongHitRate()` 全库**仅测试调用、无 UI 出口**，故实测读数仍取不到。
- 素材基数（110/118 课）已被外部内容批次推进到 192 课，**所有以课数为分母的门禁须重定基线**。

---

## 📚 数据来源 & 成员产出索引

- 数析（数据分析师）：实读 `grammarTelemetry.ts` / `grammarExplainAiService.ts` / `grammarExplainService.ts` / `GrammarLessonPage.tsx` 等；`vite-node` 脚本实测全库（脚本 `/tmp` 临时文件，未落库）
- 路径（路线图规划师）：独立复测换序命中（348 次 / 138 条不讲顺序）、结构解释器覆盖（2924/2924）

---

> 本报告由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。
