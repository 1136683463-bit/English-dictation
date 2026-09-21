# 数据盘点：语法正课 AI 结合可行性

**日期**：2026-09-19 ｜ **类型**：实读代码/数据盘点（本地项目无数仓、无遥测导出）｜ **成员**：数析（数据分析师）
**主交付物**：`prd-grammar-ai-tutor-2026-09-19.md`

**数据源说明**：全库无遥测导出文件（`find -name "grammar-telemetry*.json"` 无命中），「本期」= 实读代码/数据口径 + 可算性判定；「上期」= 9/13 D1 打样与首批复盘归档基线。实读文件：`grammarTelemetry.ts`、`grammarBoostAiService.ts`、`grammarLessonSummaryService.ts`、`grammarWeeklySummaryService.ts`、`diaryService.ts`、`aiHttpClient.ts`、`GrammarLessonPage.tsx`、`GrammarBoostPage.tsx`、`GrammarDiaryPage.tsx`、`grammarLessons.ts`、`huntCases.ts` + 4 份归档文档。

---

## 指标评审: 2026-09-19（语法正课 · AI 结合前置数据盘点）

### 关键指标概览

| 指标 | 本期（实读口径） | 上期（9/12–9/13 基线） | 变化 | 状态 |
|---|---|---|---|---|
| 单课完课时长 | 可算（`GrammarLessonPage.tsx:1018-1025`，跨重启累计 `:96-128`） | **600188ms=10.0min** | — | ⚠️ 已贴 10min 上限，**预算余量≈0** |
| guided 一次通过率 | 可算，汇总内置（`grammarTelemetry.ts:657`） | 100%（6/6） | 触顶 | 设计意图（几乎不会错） |
| practice 一次通过率 | 可算（`:658`） | 100%（4/4） | 目标 70–85% 未达 | ⚠️ 口径陷阱挂起 |
| pretest 错题率 | 可算：`lesson_step_result.section=pretest`（`:78-94`，写点 `:554-592`） | 4/12=**33.3%** | — | **唯一有效教学摩擦** |
| output 无提示通过率 | 可算：`stepKind=free_type`+`attempts==1`（`:894-899`） | 0/9→打样 2/2 | 触顶解除 | 达标但 n 极小 |
| deepDive 展开率 | 名义可算，**实际结构性失真**（见洞察 1） | 3/3 全展开 | 口径存疑 | ❌ **不可用** |
| AI 延迟/降级/缓存 | boost 可算（`:817-820,767`）；日记可算（`:821-827`） | 无实测 | — | 半可算（两条新 AI 服务零埋点） |
| 错误复发率 | **不可算**（遥测内无 tag join 链，见洞察 4） | 未测 | — | ❌ 缺事件 |
| 素材存量 | **110 课/119 案/450 错点/660 contrast**（实读脚本） | 75 课/84 案（9/18 审计） | +35/+35/+32 | ✅ 充足 |

---

### 洞察（每条附支撑数据）

**1. deepDive 只有「重开」事件，没有「阅读」，且默认展开使事件恒为空。**
事件定义仅 `lessonId+ts`（`grammarTelemetry.ts:96-101`）；写入点只在「折叠→再次展开」时触发（`GrammarLessonPage.tsx:326-328` `if (next) onExpand?.()`），而卡片初始即展开（`:320` `useState(readDeepDiveDefaultOpen)`，无偏好时默认 true，`:133-141`）。推论：新用户从不折叠→永不产生事件；该值实际只度量「先折叠过的人又打开了」，与「讲透内容被消化」负相关（推断）。且无停留时长、无读完判定、无段落数。

**2. 六段内部 0 处 AI（核实），现有 2 个新 AI 落点也零埋点。**
正课全页 `appendGrammarEvent` 共 5 类事件（`:428/:477/:621/:1018/:1568`），无任何 AI 调用。本会话新建的完课小结（`grammarLessonSummaryService.ts:140-188`）与周报小结（`grammarWeeklySummaryService.ts:167-218`）**均无遥测写入**（grep 无 `appendGrammarEvent`）——延迟/降级/缓存不可见。

**3. 「答对了」可观测，「理解了」不可观测。**
判题事件齐备（`lesson_step_result` 的 section/stepKind/attempts/passed，`:78-94`），但：
① 练习「照着拼一遍」被记成 `passed=true, attempts+1`（`GrammarLessonPage.tsx:832`），放弃与做对在通过率里同形；
② output 提示只分「用过/没用过」（`:894-895`），1/2/3 档深度不可见（`:1895-1939`）；
③ 四处「回去再看一遍讲解」（`:1676/1752/1839/1981`）**零埋点**——这是最直接的「没懂→回看」信号却丢失；
④ 段级停留只到段（`section_dwell`，`:462-486`），watch 内部 3 子步（剧场/搭装/变奏，`:75`）无拆分。

**4. 错误复发率当前不可算。**
PRD 口径为「同 tag 7 天内再现」，但 `grammar_review_result` 无 tag 字段（`grammarTelemetry.ts:123-132`），`grammar_boost_step_result` 无 tag（`:235-246`），`weeklyErrorTagCounts` 只聚合 `diary_issue_tag`+`hunt_verdict`（`:432-451`）——**课程错句不进周错因统计**；课程错误卡也不带 tag（`lessonService.ts:393-414` 无 tag 参数）。要算复发必须先补 tag 链。

**5. 素材准备度：watch 富、recall/practice 薄；讲解「事实底稿」平均仅 312 字。**
实读 110 课：deepDive 110/110 覆盖，段落分布 2段:1／3段:20／**4段:86**／5段:3，总字数均 **312.2**（中位 325，min120/max488），中文均 127.7；`guided.explain` 659 条均 28 字（净中文 10.7）；`contrast.whyZh` 660 条均 49 字（净中文 22.1）；`recall.noteZh` 109 条均 27 字；`oneLineRule` 净中文均 23.5。

分段可喂素材（字段数/字符/中文/英文词，全库均）：pretest 7/162/40/23；**watch 51/1286/400/157（最强）**；guided 21/529/158/64；recall 4/95/44/8（最薄）；practice 22/484/92/75（`LessonPracticeStep` **无 explain 字段**，`types.ts:516-522`）；output 13/387/97/51。

抽样 10 课：均 86 字段、2243 字符、750 中文字、256 英文词；整课素材估算 **1113 token**（中位 1119，min791/max1481；按 中文字×0.75+英文词×1.3 折算，推断）。全库讲解型中文语料 1959 条/95130 字（均 48.6 字/条）——**底稿短意味着「AI 讲跑题/编造」风险高，必须锁在素材内**。

**6. 成本可忽略、延迟是硬约束；单课新增等待预算约 0。**
超时钳制仅 boost 是 8–10s（`grammarBoostAiService.ts:26-30`），完课/周报 10s（`grammarLessonSummaryService.ts:21`、`grammarWeeklySummaryService.ts:165`），**日记是 `max(15000, provider.timeoutMs)`**（`diaryService.ts:284`，默认 120000，`storage.ts:76`）——「8–10s 钳制」不覆盖日记。无流式、无并发、无自动重试（`aiHttpClient.ts:122-144` 仅 400 兼容字段降级重发一次），调用即整屏等待。

单次「AI 讲解」估算输入 0.5–0.8k + 输出 0.06–0.15k ≈ **0.6–1.0k token/次**（推断，对齐 boost 审计的 0.7–0.9k），成本量级 $0.0005/次（假设）。延迟 3–8s/次（推断）。

**预算推导**：6–10min=360–600s，D1 实测已 600s 贴顶、余量≈0；若允许新增 ≤5% 预算（18–30s），按最坏 8s/次 → 交互上限 2–3 次/课；按典型 5s → 6 次。但串行 6 段各 1 次 = +18–48s（+3–13%）将直接破 10min，且每次 3–8s 白屏。
**建议硬上限：课内交互式讲解 ≤2 次/课（最坏 +16s，+2.7%）**，其余讲解必须走「缓存优先 / 后台预取 / 完课后收据位」——完课后调用不占六段预算（`GrammarLessonPage.tsx:978-990` 已是此模式）。

---

### 新增事件设计（≥6，全部沿用 append-only 风格）

| 事件名 | 字段 | 触发点 |
|---|---|---|
| `deep_dive_impression` | lessonId, mode("default_open"/"user_open"), prefOpen | `GrammarLessonPage.tsx:319-337` 进入 watchStep2 时 |
| `deep_dive_dwell` | lessonId, dwellMs, paragraphs, reachedEnd | 同上卡片折叠/卸载时结算 |
| `lesson_reread` | lessonId, fromSection, toSection | 四处回看入口 `:1676/1752/1839/1981` |
| `practice_reveal_used` | lessonId, stepIndex, attemptsBeforeReveal | `revealPractice` `:811-834`（现被记成 passed=true） |
| `output_hint_step` | lessonId, stepIndex, level(1\|2\|3), resolvedBy("self"/"hint"/"reveal") | `:1895-1939` 与 `:918-940` |
| `ai_explain_requested` / `ai_explain_result` | lessonId, section, anchorRef, trigger, ok, latencyMs, degraded, degradeReason, cached, model, outputChars | 新讲解入口（对标 `GrammarBoostPage.tsx:386-399/445-458`） |
| `ai_explain_feedback` | lessonId, section, anchorRef, verdict("helpful"/"unclear"/"wrong") | 讲解卡底部 |
| `lesson_summary_ai_result` | lessonId, ok, latencyMs, degraded, cached, textChars | `grammarLessonSummaryService.ts:140-188` |
| `weekly_summary_ai_result` | weekStart, ok, latencyMs, degraded, cached | `grammarWeeklySummaryService.ts:167-218` |
| `lesson_recheck_result` | lessonId, sourceAnchorRef, section, attempts, passed | AI 讲解后同类题重测（配对分子） |

---

### 验证方案（单人自用，禁 A/B，用配对/交替）

四个可测信号 + 阈值 + 三档门：

- **S1 同课复学配对**：同课第 2 遍 vs 第 1 遍的 output/recall 一次通过率。≥+15pp 继续 ／ ±15pp 调整 ／ <0 止损。
- **S2 课间交替配对**：奇数课开 AI、偶数课关，比关 2 回访 `firstTryCount/totalCount` 与 output 无提示通过率；每组 ≥8 课才读数。≥+10pp 继续 ／ ±10pp 调整 ／ <0 且完成率 <50% 止损。
- **S3 错误复发率**：先补 lesson 错句 tag 链，再算「同 tag 7 天再现」。<30% 继续 ／ 30–40% 调整 ／ >40% 止损。
- **S4 deepDive 配对**：展开且 dwell ≥20s 的课 vs 跳过课，比 practice/output 一次通过率（需 `deep_dive_dwell` 上线）。
- **S5 讲解后当场重测**：`lesson_recheck_result` 一次通过率较同段基线 ≥+10pp。
- **门禁项（任一触发即回退）**：单课 durationMs 增量 >30s、AI P90 >8s、degraded >25%、AI 讲解 invalid 丢弃率 >10%。

---

### 建议

- **P0（先补观测再谈 AI）**：补上表 10 个事件，其中 `deep_dive_impression/dwell`、`lesson_reread`、`practice_reveal_used`、`output_hint_step` 是「理解吸收」的唯一可证伪入口；不补则两周后仍无配对数据。
- **P0（延迟策略写死）**：交互式 AI 讲解 **≤2 次/课**、8–10s 钳制 + 缓存（TTL 30 天，键含 contentHash+model）、全部可跳过；其余讲解放完课收据/周报后台位。
- **P1（优先段位）**：只在 **watch（素材 1286 字符/51 字段，最强）** 与 **output（素材 387 字符、无 explain 字段）** 两段试点 AI 讲解；guided/practice 的 explain 已均 28 字且被判题反馈覆盖，收益最低；recall 素材仅 95 字符，需借 targetSentence/oneLineRule 兜底。
- **P1（内容口径）**：把 AI 讲解锁在「素材内改写」——只改措辞不造答案、失败即降级到本地 explain/whyZh、输出限长（现成 40/120/200 字校验）。
- **P2**：给课程错句补 tag（改 `addLessonMistakeSentence` 签名并写入 `lesson_step_result` 或新增 `lesson_issue_tag`），否则「错误复发率」这条最硬的吸收指标永远不可算。

---

### 未核实/假设清单

1. 无遥测导出文件，所有「本期」值均为可算性判定，非实测；9/13 基线为 n=1 且试玩者已知答案。
2. Token 折算按「中文字×0.75 + 英文词×1.3」启发式，非真实计费；成本 $0.0005/次为 9/18 审计假设。
3. AI 延迟 3–8s/次为历史推断，本会话未发真实请求。
4. deepDive 默认展开导致事件恒空的推论，基于代码路径静态分析，未跑真机验证。
5. 「同类题一次通过率 +10pp」等阈值为对既有 D1/F1 判据的外推，非本会话实测。
6. huntCases 实读 **119 案/450 错点**，与简报「111 案」不一致——以实读 119 为准。

---

> 本报告由产品战略团队数析执笔，经主理人汇编落盘。重要决策请由产品负责人审定。
