> 【落盘说明】本文件由主理人指令落盘于 2026-09-19，归属 deliverables/product-strategy/，正文内容一字未改，仅添加本头部说明与尾部审定行。

# 数据盘点 · 答错错因追问可行性

**数析（Metric）· 2026-09-19 · 数据来源：实读代码 + 一次性模拟脚本（跑完即删，未落库）**

## 〇、关键指标概览表

| 指标 | 数值 | 证据 |
|---|---|---|
| contrast 块总数 | 708 组（118 个数组，均 6.0 组/课） | `src/data/grammarLessons.ts`（正则提取脚本统计；118 课数自 `id: "lesson-XX-*"` 计数） |
| bothRight 双正解条 | 243 组（34.3%，不可做错句素材） | 类型定义 `src/types.ts:549`；数据计数来自模拟脚本 |
| whyZh 非空 | 708/708（类型必填） | `src/types.ts:547` |
| **可用精确匹配三元组**（wrong≠correct + whyZh） | **458 组，覆盖 118/118 课** | 脚本提取 + `src/types.ts:542-550` |
| wrong 句唯一性 | 429 个唯一错句，23 个跨组重复 | 脚本统计（normalizeLessonSentence 归一后） |
| 精确匹配命中率（模拟） | 24.6%（459/1864） | 模拟测试 A |
| diffScore≥85 可达率（模拟） | 31.3%，同课被抢 3 例，全库 0 例 | 模拟测试 C |
| 词块空间可达的错句 | 172/458（37.6%）；空间外 286 | 模拟测试 F |
| 三单检测可解释错句 | 19/458（4.1%） | `src/services/lessonService.ts:315-318` + 脚本 D |
| 问一句 AI 侧可复用资产 | 素材目录/三道校验/缓存/降级/配额 全套 | `grammarExplainService.ts:55-84,184-240`；`grammarExplainAiService.ts:126-230` |

## 一、本地匹配可行性量化（最关键）

### 1.1 素材侧：458 组三元组，但只有 37.6% 落在词块错误空间内

contrast 类型为 `wrong/correct/whyZh/wrongMark/bothRight`（`src/types.ts:542-550`），数据质量好：708 组全部带 whyZh 和 wrongMark。扣除 243 组 bothRight（`src/types.ts:549`）与 wrong=correct 的组后，**458 组是真正的「错句→错因」映射素材**，每课都有（118/118），覆盖面不是问题。

关键发现是**素材与场景错位**：我用 practice 词块库（483 步，均 5.2 词块 + 1.1 干扰项，来自数据提取）逐一检验，458 条 wrong 里只有 **172 条（37.6%）能由本课词块库拼出来**。其余 62.4%（如 L01 的 "I is Xiaomei."）使用了词块库里根本不存在的词形组合——contrast 的错句是**教学设计的高频错**，而点词成句里用户实际能犯的错 = 词块库的有限组合空间。两者交集才是 arrange 场景可精确匹配的素材池。

### 1.2 模拟匹配测试（一次性脚本，已删）

从 458 组三元组生成 1864 个模拟用户错句，分五类：wrong 原句（458）、漏一词（454）、正确句漏尾词（458）、相邻换序（400）、按 wrongMark 换回错词（94）。

| 错法 | normalizeLessonSentence 精确匹配 | diffScore vs 源错句（均分） | ≥85 占比 |
|---|---|---|---|
| wrong 原句 | 100% | 100.0 | 100% |
| 漏一词 | 0% | 78.8 | 19.8% |
| 换序 | 0% | 67.6 | **0%** |
| 正确句漏尾词 | 0% | 61.0 | 1.1% |
| 换回错词 | 0% | 78.5 | 31.9% |
| **合计** | **24.6%** | — | 31.3% |

- **精确匹配**（`normalizeLessonSentence`，`lessonService.ts:8-13`）只能接住「用户一字不差拼出素材错句」——约四分之一的模拟错法。真实分布中该比例取决于用户错法与素材错句的重合度，**无法从代码推得（推断：会低于 24.6%，因为模拟的 wrong_itself 是理想对齐）**。
- **diffScore 近似匹配**（`diffService.ts:272-277`，match 计 1 分、spelling 计 0.5）对换序类完全失效（≥85 占比 0%，因逐词对位算法不认顺序交换为 spelling，见 `diffService.ts:223-267` 的贪心对位），对漏词类也只有约两成到 85 线以上。

### 1.3 建议阈值：diffScore ≥ 85，且限定同课内检索

阈值 × 误归属测试（检索时取全库最高分错句）：

| 阈值 | 可达率 | 同课内被其他错句抢走 | 全库被抢 |
|---|---|---|---|
| ≥70 | 67.0% | 42 例 | 16 例 |
| ≥80 | 44.4% | 9 例 | 6 例 |
| **≥85** | **31.3%** | **3 例** | **0 例** |
| ≥90 | 25.8% | 0 | 0 |

**结论：阈值定 85。** 理由：① 85 线下同课冲突仅 3/1864，全库冲突为 0——配合「先同课、后全库」的两级检索，误匹配风险趋近于零；② 70-84 区间虽有 44%→67% 的可达率增益，但要吃进 51 例潜在误归属，违背「宁愿不回答也不给错误答案」的产品红线。换序类错法在 85 线为 0 命中——**不要用 diffScore 硬接换序**，arrange 场景应直接用词块序列比对（见 1.4）。

### 1.4 两类场景必须分策略（结论：是）

- **点词成句（有限空间）**：判题在摆满答案词数即触发（`GrammarLessonPage.tsx:921-922`），错误拼法是词块库 6.3 块的组合排列，**单题错法空间可全枚举**（粗估数百~千级排列）。正确做法不是拿整句去猜，而是**运行时把用户 picked 序列与同课 contrast.wrong 做词多重集+序列比对**（复用 `tokenSequencesEquivalent` 的展开口径，`diffService.ts:154-161`）；未命中素材时，`firstMismatchIndex`（`lessonService.ts:50-61`）已能给出位置级错因。
- **output/recall 自由文本（无限空间）**：`submitOutput` 走 `compareText`+`diffScore`（`GrammarLessonPage.tsx:1095-1096`，通过线 90，`:1047`），已有 `describeOutputGap`（`lessonService.ts:335-366`）给「多词/少词/顺序不对」结构化差异。此场景精确匹配命中率趋近于零（素材 458 句覆盖不了自由输入），**错因追问应直接以 AI 为主、本地只做「同类错句」的 whyZh 引用，兜底话术收口**。

## 二、三级解答链覆盖估算

以 arrange 场景为主（推断均标注）：

| 层 | 覆盖估算 | 依据 |
|---|---|---|
| L1 本地精确+近似（diffScore≥85 或词块序列命中） | 25–31% 模拟错法可达；真实错法对素材的重合率未知，**推断 15–30%** | 模拟测试 A/C；素材-场景错位（37.6% 可达上限） |
| L1.5 结构化规则错因（三单检测） | 仅 4.1% 错句可解释；但三单是「中文母语者最高频顽固错」（`lessonService.ts:309-311` 注释自证），**真实占比推断高于 4.1%** | `lessonService.ts:315-318` + 脚本 D |
| L1.9 位置级提示（firstMismatchIndex/describeOutputGap） | 100% 可给，但这是「哪里错」不是「为什么错」 | `lessonService.ts:50-61,335-366` |
| L2 AI（aiConfigured 时） | 素材目录含 contrast:N:why + deepDive + guided.explain（`grammarExplainService.ts:65-75`），可答「素材内可解释的错法」；弃权率无实据 | `grammarTelemetry.ts:180` |
| L3 兜底「答案错误再检查一下」 | 其余全部；**占比无法估算，是上线后第一个要测的数** | — |

## 三、既有基础设施复用矩阵

| 资产 | 位置 | 复用方式 |
|---|---|---|
| `buildLessonExplainContext` | `grammarExplainService.ts:55-84` | **直接复用**——错因追问的可引用素材就是同一份目录（458 条 whyZh 已在 `contrast:N:why`） |
| `validateExplainAnswer` 三道校验 | `grammarExplainService.ts:184-219` | **直接复用**——AI 层输出与缓存命中都要过；「宁愿不答」红线由 DECLINED_ANSWER（`:169`）兜住 |
| `requestLessonExplain`（10s 钳制/缓存/降级四因） | `grammarExplainAiService.ts:26,126-230` | **直接复用**，仅换 anchorRef（`watch.deepDive`→`practice.step:N`，`:1231` 处现为硬编码，需参数化） |
| `explainCacheKey`/30 天 TTL | `grammarExplainService.ts:253-259`；`grammarExplainAiService.ts:24` | 直接复用（同课同错句同模型的缓存天然命中） |
| `createExplainQuota`（≤2 次/课） | `grammarExplainService.ts:224-240` | 复用但**建议独立配额实例**：改错心流里的追问与深挖卡追问是两种心智，共享 2 次会互相挤占（建议改错追问 ≤1 次/题） |
| `rateExplain` 三按钮（有用/没讲清/讲错了） | `GrammarLessonPage.tsx:1259-1269` | **复用 UI 与 verdict 枚举**——「讲错了」正是误匹配率的度量入口 |
| `practiceWhy` 三级回退 | `GrammarLessonPage.tsx:708-716` | 直接复用为「答对后」的解释；错因链是它的镜像扩展 |
| `firstMismatchIndex`/`describeOutputGap`/`detectThirdPersonMiss` | `lessonService.ts:50-61,335-366,315-318` | 直接复用为 L1.5 层错因源 |
| `hashGrammarSentence` | `lessonService.ts:19-27` | 直接复用：错句指纹（事件里记哈希不记原文，与 `lesson_step_result.sentenceHash` 口径一致） |
| **需新建** | — | ① arrange 词块序列→contrast.wrong 的匹配器（含 85 阈值近似层）；② matchedWrongRef→whyZh 的取数；③ 错因追问入口 UI（practice retry 反馈区内，`:2200-2211` 处）；④ 事件 2 个 |

## 四、新增事件设计

**建议独立于 `ai_explain_*`，不复用其 kind。论证：** ① 语义不同——`ai_explain_requested` 的 section 锚死 watch，触发心智是「好奇」；错因追问发生在 practice retry 反馈区，触发心智是「卡壳求助」，漏斗位置完全不同；② 结果来源是混合链（本地精确/本地近似/AI/兜底），硬塞进 `ai_explain_result` 会让本地命中也被记成 AI 调用，污染既有 AI 延迟/降级率口径；③ 但 outcome 字段结构照抄 `AiExplainResultEvent`，聚合函数可共享写法。

- `practice_why_wrong_requested`：`lessonId / stepIndex / section("practice") / sentenceHash / matchSource("local_exact"|"local_fuzzy"|"rule_third_person"|"ai"|"fallback") / diffScoreAtMatch（近似时有）/ quotaState`。触发点：retry 反馈区点「为什么错了」。
- `practice_why_wrong_result`：`lessonId / stepIndex / sentenceHash / ok / source（同上四值）/ latencyMs / cached / declined / validationFailure? / citedRef?`。触发点：解答就绪（本地同步、AI 异步）。`matchSource` 与 `source` 合并即可，不必两套。
- 反馈**独立 kind** `practice_why_wrong_feedback`（verdict 三值同 `AiExplainFeedbackEvent`），但同一 verdict 枚举保证「讲错了」在全库可统算。
- 归入 `GrammarTelemetryEvent` 联合类型（`grammarTelemetry.ts:431-464`），享受既有 3000+12000 条归档机制。

## 五、验证方案（单人自用，禁 A/B → 用阈值门 + 时序自对照）

| 指标 | 口径 | 绿 | 黄 | 红 |
|---|---|---|---|---|
| 同题重试通过率 | 追问后同一步 `lesson_step_result`（attempts+1）passed 占比；周滚动 | ≥60% 有效 | 40–60% 观察 | <40% 回滚入口 |
| 错因误匹配率 | `practice_why_wrong_feedback.verdict="wrong"` 占比（含 AI 层） | <5% | 5–15%：阈值 85→90，或近似层只保留精确 | >15%：下线近似层只留精确+AI |
| 错误复发率 | 该句入 SM-2 后首刷 `grammar_review_result.passed` | 复发 <30% | 30–50%：检查 whyZh 质量 | >50%：错因层无效，回到对照 |

对照基线：上线前 4 周同段位 `lesson_step_result` 与复习通过率做前后对照（单用户时序自对照，非 A/B）。

## 六、风险（按严重度排序）

1. **本地误匹配给错误错因（最严重）**：diffScore 70–84 区间有 51 例潜在误归属（模拟 C）。缓解：85 硬阈值 + 同课优先检索 + 「讲错了」按钮监测 + 红线话术兜底；换序类（85 线 0 命中）绝不走近似层。
2. **AI 延迟打断改错心流**：10s 钳制在「刚答错想马上改」的场景里体感远差于深挖卡场景。缓解：本地层即时返回，AI 层异步流式呈现、不阻塞重试按钮。
3. **兜底话术高频出现**：素材-场景错位（62.4% 错句在词块空间外）+ 自由文本无素材，兜底占比可能超 50%（推断）。「答案错误再检查一下」连续出现即变成负体验——需监控 `matchSource="fallback"` 占比，>40% 时回内容侧补 contrast 素材而非调阈值。
4. **只问不想**：错因追问入口太显眼会把 retry 反馈区变成「问 AI 而不是自己再试」。缓解：入口默认收起（沿用「问一句」形态纪律），错 2 次后才出现（与 `revealPractice` 的 `practiceMisses>=2` 门同位）。
5. **配额与缓存穿透**：每题一个 sentenceHash，自由文本几乎不重复 → AI 缓存命中率趋近 0，配额限流成为唯一成本阀。需在 result 事件里盯 cached 字段。

## 七、假设清单

1. **模拟错句分布 = 真实错法分布**——「漏一词/换序/换错词」是构造的，真实 arrange 错法分布未测。
2. **用户错法与 458 条素材错句的重合率 15–30%**——纯推断，最大不确定项；决定 L1 层真实价值。
3. **AI 弃权率**——`declined` 字段已埋但无历史数据。
4. **词块空间可达性检验只含 practice 词块库**——guided tokens 未计入，实际可达率或略高于 37.6%。
5. **三单真实占比 > 4.1%**——基于「中文动词不变形、漏 -s 最高频」的代码注释与常识推断，无本库数据。
6. **同题重试通过率 ≥60% 算有效**——阈值参考了 F1 关 2 一次通过率 50–70% 的既有目标带，非本功能实测。

> 【审定】已落盘（2026-09-19），内容与原报告一致、一字未改；待产品负责人审定生效。
