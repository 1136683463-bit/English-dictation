# 数据盘点：语法课后强化训练可生产性与指标体系

**日期**：2026-09-18 ｜ **类型**：实读代码/文件盘点（本地项目无数仓、无真实用户数据）｜ **成员**：数析（数据分析师）
**主交付物**：`prd-grammar-boost-2026-09-18.md`

**方法**：实读源文件 + 抽样统计；实读文件：`src/services/{grammarTelemetry,grammarReviewService,grammarWeakSpotsService,grammarOutputService,lessonService,diaryService,aiHttpClient,huntService,grammarAmbushService,storage}.ts`、`src/data/{grammarLessons,huntCases,grammarSeasons}.ts`、7 个 grammar 页面。

**数据源说明**：无遥测导出文件（全库 `find -name "*telemetry*"` 仅命中规范文档，无 `.json` 事件导出物），故「本期」= 代码与数据实读口径，「上期」= 9/12–9/13 已归档基线。

---

## 指标评审: 2026-09-18（语法板块 · 课后强化训练前置数据盘点）

### 关键指标概览

| 指标 | 本期 | 上期 | 变化 | 状态 |
|---|---|---|---|---|
| 单课完课时长 | 不可取数（无导出） | 2.6min → 打样 10.0min（600188ms） | +7.4min | 口径待复测（`d1-grammar-r-pilot-verdict-2026-09-13.md:21`） |
| practice 一次通过率 | 可算，无样本 | 100%（20/20） | 0 | 目标 70–85% 曾挂起（`metrics-review-grammar-first-batch-2026-09-13.md:39`） |
| output 无提示一次通过 | 可算，无样本 | 0/9 → 打样 2/2 | 触顶解除 | 达标（同上 `:24`） |
| 关 2 次日回访率 | 可算，无样本 | 门槛 ≥40% | — | 未达验证窗（`prd-grammar-three-stages-2026-09-13.md:40`） |
| 周有效输出句数（北极星） | 可算，口径有噪声 | — | — | 需修去重键（见洞察 1） |
| 内容素材存量 | 75 课/84 案/310 处植错/1187 唯一句 | 71 课/80 案/294 错 | +4/+4/+16 | 充足（`data-audit-grammar-eleventh-batch-2026-09-18.md:12-13`） |

---

## 1. 可选指标现状（事件依据 · 口径 · 可算性）

| 指标 | 事件依据（文件:行） | 计算口径 | 可算性 |
|---|---|---|---|
| 完课率 | `grammar_lesson_started`（`GrammarLessonPage.tsx:393`）+ `grammar_lesson_completed`（`:930`） | 按 lessonId 去重后相除；started 仅按挂载 ref 去重，重进会重复记（`:388-393`），completed 可多次触发（`:914-945` 可重跑） | 可算（须双向去重） |
| 单课时长 | `completed.durationMs`（`grammarTelemetry.ts:74`） | 跨重启累计：`lessonTimeAccumulator`+`localStorage`（`GrammarLessonPage.tsx:82-113,926-934`） | 可算（R23 已修） |
| practice/guided 一次通过率 | `completed.guidedFirstTry/practiceFirstTry`（`:71-73`）+ 汇总 `:400-401,457-458` | 完课事件中布尔为真占比 | 可算（汇总函数已内置） |
| output 一次通过率 | `lesson_step_result`（`:78-88`，`section=output`，`stepKind=free_type/free_type_hint`，`attempts`） | `attempts==1 && passed`；阈值 90（`GrammarLessonPage.tsx:793`） | 可算（无内置汇总，需自算） |
| 关 2 到达率 | `grammar_revisit_started.hoursSinceStage1`（`:37-43`，`GrammarRevisitPage.tsx:70`） | 20–28h 有效窗 ÷ 关 1 完成课；解锁阈值 20h（`lessonService.ts:101`） | 可算 |
| 关 2 完成率 | `grammar_revisit_completed`（`:46-56`，`GrammarRevisitPage.tsx:119`） | ÷ `revisit_started`；完成制无正确率门槛（`GrammarRevisitPage.tsx:16`） | 可算；一次通过率 = `firstTryCount/totalCount` |
| 关 3 到达率 | 无 started 等价事件（`GrammarReauditPage.tsx` 全程无进关埋点） | — | **不可算** |
| 关 3 完成率 | 无埋点；仅状态 `grammarLessonStagesDone`（`GrammarReauditPage.tsx:107`；`storage.ts:167-168`） | 读 AppData 而非事件 | 半可算（非遥测） |
| 复习到效率 | `grammar_review_result`（`:117-126`） | 无「到期队列规模」事件 → 分母缺失 | **不可算**（仅能算通过率/attempts） |
| 掌握度分布 | `summarizeGrammarMastery`（`grammarReviewService.ts:103-121`） | mastered / inProgress(reviewCount>0) / notStarted(=0) / total | 可算（读 AppData）；两套 mastered 口径并存（见洞察 1） |
| 罪名弱点分布 | `computeWeakSpotsReport`（`grammarWeakSpotsService.ts:76-182`）、`weeklyErrorTagCounts`（`grammarTelemetry.ts:295-314`） | 频率×新近加权（半衰期 7 天，`:22`），Top3（`:23`） | 可算；注释与代码权重不符（见洞察 1） |
| 周有效输出句数（北极星） | `computeWeeklyEffectiveOutput`（`grammarOutputService.ts:56-104`） | 课程 output 通过事件 + 日记 done 条目，按 ISO 周去重 | 可算；课程侧去重键含时间戳（见洞察 1） |
| 段级停留 | `section_dwell`（`:152-158`，`GrammarLessonPage.tsx:442`） | 按段累计 totalMs/samples，≥1s 过滤 | 可算（六段预算核验） |
| 侦探破案率/误报率 | `hunt_case_settled`/`hunt_verdict`（`:129-140,:98-105`） | 汇总 `:462-466,461` | 可算 |

---

## 2. 数据缺口与新增事件设计（7 个）

现有 16 类事件（`grammarTelemetry.ts:198-214`）**没有任何「进入可选训练」的意图/曝光/放弃事件**：只有 started→completed 两端，缺「看了没进」「进了没做完」「拒绝继续」三段。建议新增（沿用 append-only + 同名风格，全部带 `lessonId/tier` 以便分层与配对）：

| 事件名 | 关键字段 | 触发点 | 与既有事件关系 |
|---|---|---|---|
| `grammar_boost_offered` | lessonId, entryPoint("card"\|"settlement"), recommendedTier, ts | 课程卡片渲染 `GrammarPathPage.tsx:436`；完课结算区块 `GrammarLessonPage.tsx:1875` | 紧随 `grammar_lesson_completed`（`:930`）之后 |
| `grammar_boost_started` | lessonId, tier(1\|2\|3), questionCount, source | 强化页挂载（新建路由，对标 `GrammarRevisitPage.tsx:70`） | 与 `grammar_lesson_completed` 同课配对键 |
| `grammar_boost_step_result` | lessonId, tier, itemKind("derived"\|"ai"), sourceRef(stepIndex/句哈希), attempts, passed, ts | 每题判题（对标 `:578 recordStepResult`） | 复用 `lesson_step_result` 字段语义，便于合并分析 |
| `grammar_boost_abandoned` | lessonId, tier, answered, total, dwellMs, lastSection | 组件卸载且未完成 | 唯一能算「放弃率」的事件，现全库缺失 |
| `grammar_boost_completed` | lessonId, tier, total, firstTryCount, durationMs, aiUsed | 末题通过 | 结构镜像 `grammar_revisit_completed`（`:46-56`）→ 支撑「强化 vs 关 2」配对 |
| `grammar_boost_ai_result` | lessonId, tier, questionIndex, ok, latencyMs, degraded, degradeReason | AI 批改返回/超时/未配置 | 对标 `aiHttpClient.ts:11-12` 未配置分支；喂「降级率/延迟」 |
| `grammar_boost_item_repeat` | lessonId, sourceRef, seenCount7d | 出题时命中近 7 天已练句 | 支撑「素材重复率」先行信号 |

---

## 3. 新功能指标体系与决策门（单用户可重复测量）

单人自用 + 关 2 有 20h 冷却（`lessonService.ts:101`），同课无法做 A/B；改用**课间交替配对**：单数课做强化、双数课不做，以课为单位比较关 2 `firstTryCount/totalCount`（`grammarTelemetry.ts:49-51`）。

| 指标 | 继续 | 调整 | 止损 |
|---|---|---|---|
| 参与率（offered→started） | ≥30% | 15–30% | <15%（连续 2 周 n≥10 次曝光） |
| 分层漏斗：档1完成→档2进入→档3进入 | ≥80% / ≥50% / ≥25% | 任一项低 10pp 内 | 档1完成 <60% |
| 单档放弃率（abandoned/started） | ≤25% | 25–40% | >40% |
| AI 批改使用率（aiUsed/completed） | ≥40% | 20–40% | <20%（说明无感/太慢） |
| AI 降级率（degraded/ai_result，AI 已配置时） | ≤10% | 10–25% | >25% |
| 因果信号：强化组 − 对照组关 2 一次通过率 | ≥+10pp | ±10pp | <0 且完成率 <50% |
| 样本门槛 | 每组 ≥8 课读一次；<8 课只出方向不出结论（沿用「样本<30 滚动延期」纪律，`prd-grammar-three-stages-2026-09-13.md:216`） | | |

---

## 4. 内容素材可行性（实读原始数字）

抽样 8 课（L1/L13/L27/L35/L50/L61/L70/L75）字段计数：examples 各 4 条（8 课合计 32，全库 300/75 课）、variants 各 3（24，全库 225）、contrast 各 6（48，全库 450）、sceneSwings 各 3（24，全库 225）、guided 5–6（全库 449：choose 75/arrange 224/spot 75/replace 75）、practice 各 4（全库 301：74 课 4 题 + 1 课 5 题）、dialogue 各 3（全库 225）、targetSentence 1/1、recall 1/1（75/75 全覆盖）、blocks 2–4、deepDive 2–4 段。

派生池（去重后唯一句，≥3 词）抽样：L13=21、L27=19、L35=20、L50=18、L1=18、L61=16、L75=12、L70=9；全库 1365 槽位 → **1187 唯一句**，均 18.2/课（9–26）。分层可用量：认读/对比层（examples+contrast.wrong+dialogue）均 11.6 条（8–13）；受控产出层（variants+sceneSwings+practice+guided.answer+contrast.correct）均 10.7 条（4–18，L70 仅 4 条最薄）；自由产出锚点（targetSentence+recall+variants）均 **3.1 条（2–4）**。

**结论**：档 1/档 2 本地派生完全可行（每课 ≥10 题，且引擎现成：`grammarReviewService.buildGrammarReviewTask:207-280`、`grammarAmbushService.pickClozeWord:152-162`）；档 3 天然只有 3.1 个锚点，且这些句子已在课内出现过，若要求「不与课内重复」则每课 5 题需 AI 新造 2–3 题。**AI 生成占比估 20–35%，本地派生 65–80%**（推断，基于上述唯一句与跨课重复 168/1355=12.4%）。

**两条硬约束**：① cloze 抽词表仅 24 词（`grammarAmbushService.ts:154`），新批关键词（How often/let me 等）不在表内，会退化为抽第 2 词（同文件 `:157-159`），须扩表；② 5 课无案件可配（L2/3/5/6/8，`huntCaseIds: []`），这些课的档 3 只能靠生成。

---

## 5. AI 批改成本/性能现状

| 项 | 实读值 | 依据 |
|---|---|---|
| 未配置 AI | 直接 throw，页面逐句标失败并保留原句 | `diaryService.ts:268`；`aiHttpClient.ts:11-12`；`GrammarDiaryPage.tsx:156-167,204-215` |
| 超时 | `max(15000, provider.timeoutMs)`；默认 120000ms，下限钳制 60000 | `diaryService.ts:271`；`storage.ts:76,212` |
| 重试 | 仅 `response_format` 400 时降级重发一次；无自动重试/无并发/无流式 | `diaryService.ts:288-295` |
| token 预算 | system 提示词 1336 字符 + 风格 137–233 字符 ≈ 450–500 token（推断，3.2 字符/token）；`max_tokens: 900`；`temperature ≤0.4` | `diaryService.ts:229-246,280-281` |
| 单次成本量级 | 输入 ~450–500 + 输出 ~150–350 token ≈ 0.7–0.9k/次；按 DeepSeek/OpenAI-mini 量级假设（$0.3/M 入、$1.2/M 出）≈ $0.0005/次 | 假设，非实读报价 |
| 一课 5–10 次 | 3.5k–9k token ≈ $0.003–0.005（≈¥0.02–0.04）；75 课全量 ≈ $0.3–0.4 | 推断 |
| 真正瓶颈 | 延迟而非钱：串行 5–10 次 × 典型 3–8s = 15–80s，接近「一档 3–5 分钟」的 1/4–1/2 预算 | 推断 |

---

## 6. 洞察（每条附支撑数据）

1. **北极星口径有噪声**：课程侧去重键为 `lesson:lessonId:stepIndex:ts(分钟)`（`grammarOutputService.ts:72`），同一句隔天重练会被重复计数；日记侧才按归一化文本去重（`:85`）。两侧不对称，周输出会偏高，建议课程侧引入句哈希。
2. **两套掌握口径并存**：`reviewService.ts:453`（rating4 且 reviewCount≥4）与 `grammarReviewService.ts:304-309`（free_type 连续 2 次通过）都会写 mastered，掌握度分布会因路径不同而口径漂移。
3. **弱点权重文档与代码不符**：注释称「复习失败 1.5 / 反复通过 0.5」（`grammarWeakSpotsService.ts:16-18`），代码两处均传 `1.0`（`:126,:135`）。弱点榜 Top3 的排序据此会偏。
4. **内容侧已可支撑分层**：84 案共 310 处植错（verb_form 74/23.9%、plural 50/16.1%、preposition 43/13.9%、sv_agreement 41/13.2%、word_order 31/10.0%、missing_be 20/6.5%、tense 17/5.5%、article 17/5.5%、fragment 9/2.9%、run_on 8/2.6%），每案 3.69 错、61/84 案恰为 4 错，可直接做难度分档素材（`grammarAmbushService.ts:231` 的 30–50% 旧案混入已在用）。
5. **关 3 是纯黑区**：无进入事件，只有状态位；关 3 的到达/放弃在数据上不可见（风险最高的一环）。

---

## 7. 建议

- **P0（≤1 人日）**：补 7 个 `grammar_boost_*` 事件，优先 `offered/started/abandoned/completed` 四件——没有 `abandoned` 就无法回答「难度分档是否有效」。
- **P0**：修 `grammarOutputService.ts:72` 去重键、统一 mastered 口径、对齐弱点权重，否则新功能上线后所有对比都建在噪声上。
- **P1**：扩 cloze 抽词表（24 → ≥60 词，覆盖批九–批十一关键词），使档 1/2 完全本地化。
- **P1**：AI 只用于档 3 增量生成与批改，逐题 8–10s 超时 + 降级到本地题，避免 120s 默认超时拖垮节奏。
- **P2**：因果验证用课间交替配对，样本 <8 课不出结论；样本增长慢是单人自用的结构性限制，建议接受「方向性证据」而非显著性结论。

---

## 未核实/假设清单

1. 无用户遥测导出文件，「本期」实测值一律缺失（仅口径可算）。
2. token 数与成本为字符折算推断，非真实计费（`max_tokens: 900` 为实读）。
3. AI 延迟 3–8s/次为推断，无请求日志佐证。
4. 「AI 生成占比 20–35%」为基于唯一句统计的推断，未做原型验证。
5. 六段时长预算 90–140/50–80/40–60/100–160/50–80/60–110s 来自 `d1-grammar-r-pilot-verdict-2026-09-13.md:33-38`，属历史基线，非 2026-09-18 实测。
6. `reviewed: true` 覆盖 84/84 为数据解析结果（grep 计数 86 含注释文本）。

---

## 📚 数据来源 & 成员产出索引

- 数析（本文件，数据盘点）
- 瑞思（用户研究）：`user-research-grammar-boost-2026-09-18.md`
- 竞析（竞品分析）：`competitive-analysis-grammar-boost-2026-09-18.md`
- 析客（PRD）：`prd-grammar-boost-2026-09-18.md`
- 路径（路线图）：`roadmap-grammar-boost-2026-09-18.md`

---

> 本报告由产品战略团队数析执笔，经主理人汇编落盘。重要决策请由产品负责人审定。
