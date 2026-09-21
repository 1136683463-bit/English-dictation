# 趁热练（课后强化训练三档）深度验证报告

验证日期：2026-09-21（报告最后校对：源码 md5 `GrammarBoostPage.tsx` = `d69d9394e7756ac045fbb62f92f6988d`、`grammarBoostService.ts` = `c99799cdb0a6fbe43441fffa9f6667a8`；9 条缺陷全部在该版本上复现）
验证对象：`src/pages/GrammarBoostPage.tsx` + `src/services/grammarBoostService.ts` + `src/services/grammarBoostAiService.ts`
验证方式：**真实 UI 驱动**（jsdom + `createRoot` + 真实点击/输入事件），复用 `src/edge/harness.tsx` / `src/edge/verify/fixtures.ts` / `src/edge/verify/drive.ts`

---

## 0. 重要前提：被测源码在验证期间被并发修改

验证过程中 `src/pages/GrammarBoostPage.tsx` 与 `src/services/grammarBoostService.ts` 被**另一个进程持续修改**（mtime 从 21:13 起多次变动，`git status` 显示大量 `M`），课程库也从 192 课增长到 **193 课**。

因此：

- 本报告的**行号以报告生成时刻的文件内容为准**（见每条缺陷的行号标注）；
- 报告生成时刻的基线：`GrammarBoostPage.tsx` md5 = `d69d9394e7756ac045fbb62f92f6988d`、`grammarBoostService.ts` md5 = `c99799cdb0a6fbe43441fffa9f6667a8`（**两条命令在所有 9 条缺陷测试上复现**，见文末运行结果）；
- 有一条缺陷（`firstTryCount` 少算一题）在我提出后**被对方当场修掉**，已转为通过 —— 我把它记在 §5「验证过但当前无问题」，并保留其测试作为回归护栏。

全量测试基线（`vitest run`，报告生成时刻）：`27 failed | 1567 passed`，其中 13 个失败文件中绝大多数（`grammarLessons.test.ts`、`grammarSeasons.test.ts`、`p1/p3/p6`、`pr*` 等）是**并发改动造成的既有失败**，与本任务无关（典型症状是 `expected 193 to be 192`）；本任务新增文件的失败**全部**是下面登记的 9 条已确认缺陷。

---

## 1. 已确认的缺陷

### P1-1 · 改错题答对后，「对了！」确认的是一句**错句**

- **文件:行号**
  - 缺陷点：`src/services/grammarBoostService.ts:738`（`guided.spot` 派生时 `answer: spotStep.tokens.join(" ")`，即**错句**）
  - 渲染点：`src/pages/GrammarBoostPage.tsx:1199`（`<strong>{currentItem?.answer}</strong>`）
- **复现步骤**
  1. `seedAppData({ grammarLessonsDone: ["lesson-13-now"], grammarLessonStagesDone: { "lesson-13-now": [1] } })`
  2. 挂载 `/grammar/boost/lesson-13-now?tier=1`（档 1 第一题在全库每课都是 `guided.spot`）
  3. 在第 1 题的词块里点中被标错的词（`sleep`）
  4. 读反馈区文本
- **实际行为**：反馈区显示 `对了！He is sleep now.` —— 「对了！」后面紧跟的是**题面那句错句**；正确形式只出现在下面的 `把 sleep 换成 sleeping：He is sleeping now。` 副行里。
- **期望行为**：`BoostItem.answer` 的契约是「完整**正确**句（判题基准）」（`grammarBoostService.ts:119` 注释），且 UI 直接把它当作答对确认展示。应显示 `He is sleeping now.`。
- **证据**（`bo9-answer-semantics.test.tsx`）
  ```
  × BR-ANSWER-1：guided.spot 改错题的 answer 不得是题面那句错句（当前为已确认缺陷）
    → guided.spot 的 answer 是错句：
  × UI 证据：答对后的确认行确实渲染了 answer
    → expected '对了！He is sleep now.' ... （反馈区文本）
  ✓ 对照：contrast+wrongMark 派生的改错题 answer 是正确句（两类口径不一致的证据）
  ```
  全库扫描统计：**193/193 课**的 `guided.spot` 题 `answer === 题面错句`；而 `contrast+wrongMark` 派生的改错题 `answer` 是正确句 —— 同一题型两种口径。
  另外 `bo1` 里的通用断言 `feedback 里应含 item.answer`（`bo1-tier-chains.test.tsx` BO1-b）之所以**通过**，正是因为二者相等 —— 这本身也是危害的佐证：断言无法区分「正确句」与「错句」。
- **严重度**：**P1**（功能错误）。档 1 是全库每课的固定首题，命中率 100%；对零基础用户，「对了！+ 错句」会直接强化错误形式，与「答案必须与题面语义一致」的红线冲突。

---

### P1-2 · 档 3 收尾 AI 批改成功后，completed 事件的 `aiUsed` 仍记 `false`

- **文件:行号**
  - 写入点：`src/pages/GrammarBoostPage.tsx:327`（`aiUsed: aiUsedRef.current`，位于 `finishTier` 内；校对时仍在该行）
  - 置位点：`src/pages/GrammarBoostPage.tsx:426`（`aiUsedRef.current = true`，位于 `runAiCorrection` 成功分支）
  - 调用点：`src/pages/GrammarBoostPage.tsx:335`（`void runAiCorrection(...)`，在 `appendGrammarEvent` **之后**才发起）
- **机制**：`finishTier` 先同步写 `completed` 事件（读 `aiUsedRef.current`，此时还是 `false`），**之后**才 `void runAiCorrection(...)`；批改是异步的，成功置位发生在事件写入之后。于是 `aiUsed` 结构性恒为 `false`。
- **影响口径**：`grammarTelemetry.ts:827` 声明 `aiUsedRate = 带 aiUsed 的完成 / 档 3 完成` ——「AI 使用率」这个指标的分子**永远记不上**，恒为 0（实测 `summarizeGrammarTelemetry().boost.aiUsedRate === 0`，而用户确实看到了 AI 批改卡）。这会直接误导「档 3 的 AI 投入是否值得」的产品决策。
- **复现步骤**
  1. `seedAppData({ grammarLessonsDone:[...], grammarBoostsDone:{"lesson-13-now":[1,2]}, settings: {...defaultSettings, ...aiSettings()} })`
  2. `stubFetch({ content: '<合法批改 JSON>' })`
  3. 挂载 `?tier=3`，三题各写一句错句、点「看答案」收尾 → 点「完成这一档」
  4. 断言页面出现「AI 看了看你写的这几句」（确实成功），再读 `grammar_boost_completed.aiUsed`
- **实际行为**：`aiUsed: false`，`aiUsedRate: 0`
- **期望行为**：`aiUsed: true`，`aiUsedRate > 0`
- **证据**（`bo4-correction-observability.test.tsx`）
  ```
  × AI 返回批改并渲染到页面 → completed 事件的 aiUsed 应为 true
    → 用户确实用上了 AI 批改，但 completed.aiUsed 记成了 false: expected false to be true
  × 汇总口径：aiUsedRate 在 AI 成功批改后应 > 0
    → AI 使用率恒为 0（分子永远记不上）: expected 0 to be greater than 0
  ✓ AI 降级（未配置）→ completed 事件的 aiUsed 应为 false（对照组）
  ```
- **严重度**：**P1**（功能/指标错误，无用户可见文案问题，但指标失真）。

---

### P1-3 · 答完一题、还停在反馈区就退出 → **不记 abandoned**（放弃率被低估）

- **文件:行号**
  - 自增点：`src/pages/GrammarBoostPage.tsx:340`（`answeredRef.current += 1`，位于 `advance` 内）
  - 守卫：`src/pages/GrammarBoostPage.tsx:190`（`if (answeredRef.current <= 0) return;`）
- **机制**：`answeredRef` 只在 `advance()` 里自增，而 `advance` 由反馈区的「下一题 / 完成这一档」按钮触发；判题本身只写 `step_result`、不碰 `answeredRef`。于是「答了一题、看完反馈直接关页面」这条真实动线被记成「0 题放弃」。
- **复现步骤**
  1. 进 `?tier=1`，在第 1 题点对错词位置（进入 pass 反馈区，按钮为 `["He","is","sleep","now.","下一题"]`）
  2. **不点「下一题」**，直接 `unmount()`（等价于关页面/点浏览器返回）
  3. 读遥测
- **实际行为**：`step_result` 1 条、`started` 1 条、**`abandoned` 0 条**
- **期望行为**：`abandoned` 1 条、`answered: 1`
- **证据**（`bo6-exit-telemetry.test.tsx`）
  ```
  × BR-EXIT-1：答完 1 题（停在反馈区）就退出也应记 abandoned（当前为已确认缺陷）
    → 答过题就离开，abandoned 应记 1 条（否则放弃率被低估）: expected +0 to be 1
  ✓ 答 1 题并推进到下一题后退出：记 1 条 abandoned，answered=1、total=声明题量
  ✓ 答 0 题后点「先回去」→ 不记 abandoned
  ```
  对照探针（同一会话多点一次「下一题」）证明确实是这个 ref 的时机问题：
  ```
  A  （答1题后直接离开）  → step_result=1, abandoned=0
  A2 （答1题 + 点下一题）→ step_result=1, abandoned=[{...answered:1,total:4}]
  ```
- **严重度**：**P1**（埋点口径错误）。`abandonRate = abandoned / started` 是**唯一**能算放弃率的口径；这个 bug 使分母包含这些会话而分子缺失 → 放弃率被系统性**低估**，与 2026-09-20 修掉的「0 题也记放弃」正好反向。

---

### P2-4 · 未准入的课也记 `started` / `offered` 埋点

- **文件:行号**
  - 曝光 effect：`src/pages/GrammarBoostPage.tsx:144-157`
  - 进档 effect：`src/pages/GrammarBoostPage.tsx:159-171`
  - 准入门禁：`src/pages/GrammarBoostPage.tsx:241`（`if (!canBoostLesson(data, lessonId)) return ...`；校对时仍在该行）
- **机制**：两个埋点 effect 都写在门禁 `return` **之前**。用直链打开一节没学过的课（`?tier=1&from=receipt`）时，页面显示「先上完这一课」（用户没进任何档），遥测却记下 `started { tier:1, questionCount:4, entryPoint:"direct" }` 与 `offered { entryPoint:"settlement" }`。
- **复现步骤**：`seedAppData({ grammarLessonsDone: [] })` → 挂载 `/grammar/boost/lesson-13-now?tier=1&from=receipt` → 等一拍 → 读遥测
- **实际行为**（5 种参数全中）
  ```
  ?tier=1&from=receipt → 空态=true  事件=["grammar_boost_started:1:settlement"]
  ?from=receipt        → 空态=true  事件=["grammar_boost_offered:settlement"]
  ?tier=1              → 空态=true  事件=["grammar_boost_started:1:direct"]
  ?from=card           → 空态=true  事件=["grammar_boost_offered:card"]
  ?tier=3&from=reaudit → 空态=true  事件=["grammar_boost_started:3:reaudit"]
  ```
  同一种「页面不可用」，**不存在的课**（`if (!lesson) return`，在埋点 effect 之前）则一条事件都不记 —— 两种记账行为不一致。
- **期望行为**：未准入的课不记任何 boost 埋点。
- **证据**（`bo6-exit-telemetry.test.tsx`）
  ```
  × BR-EXIT-2：未准入的课不应记任何 boost 埋点（当前为已确认缺陷）
    → 未准入的课却记了埋点：
    ?tier=1&from=receipt → grammar_boost_started
    ?from=receipt → grammar_boost_offered
    ?tier=1 → grammar_boost_started
    ?from=card → grammar_boost_offered
    ?tier=3&from=reaudit → grammar_boost_started
  ✓ 对照组：不存在的课一条事件都不记
  ```
- **严重度**：**P2**（埋点口径）。`startRate = started / offered` 与三档漏斗分子被未准入会话污染。

---

### P2-5 · 课内入口 `?from=lesson` 被记成 `direct`，无法归因

- **文件:行号**：`src/pages/GrammarBoostPage.tsx:63-64`
  ```ts
  const entryPoint: "settlement" | "card" | "reaudit" | "direct" =
    fromParam === "receipt" ? "settlement" : fromParam === "card" ? "card" : fromParam === "reaudit" ? "reaudit" : "direct";
  ```
- **机制**：映射只认 `receipt/card/reaudit`，其余一律落 `direct`。而正课页的档位条（`src/pages/GrammarLessonPage.tsx:2086`）用的正是 `from=lesson`；`GrammarStartedEvent.entryPoint` 的类型里甚至没有 `"lesson"`（`grammarTelemetry.ts:377-381` 只在 **offered** 的类型里有）。
- **复现步骤**：进 `?tier=1&from=lesson`，读 `grammar_boost_started[0].entryPoint`
- **实际行为**：`startedByEntry.direct` 里（实测 `direct`）；而 `offered` 侧记录的是 `lesson`（正课页自己 append）
- **期望行为**：`entryPoint === "lesson"`，使 `startedByEntry.lesson` 可算
- **后果**：`startedByEntry.lesson` **结构上恒为 0**；同一入口 startRate 结构性偏低（分子记 `direct`、分母记 `lesson`），W1 新增的第三个入口「学完当课立刻练」的转化率永远无法归因。
- **证据**（`bo6-exit-telemetry.test.tsx`）
  ```
  × BR-EXIT-3：课内入口 ?from=lesson 应记 entryPoint=lesson（当前为已确认缺陷）
    → 课内入口被记成了 direct（应为 lesson）；startedByEntry 会把它算进 direct
  ✓ 其余入口映射正确（receipt→settlement / card→card / reaudit→reaudit / 无参数→direct）
  ```
- **严重度**：**P2**（埋点口径）。

---

### P2-6 · 零术语红线：档 1 变形/选择题答错文案含「主语」

- **文件:行号**：`src/pages/GrammarBoostPage.tsx:587`
  ```ts
  setFeedback("还差一点——想想主语是谁，搭档要跟着变。");
  ```
- **红线依据**：`src/data/grammarZeroTerms.ts:17-24` 的 `GRAMMAR_ZERO_TERMS` 词表含「主语」；该表是运行时校验（`grammarExplainService` 的三道校验）与守门测试（`grammarLessons.test.ts:110/119/128`，作用域＝`grammarLabel`/`oneLineRule`/`summary.rule`）**共用同一张表**。此处的 setFeedback 文案不在那三个字段的作用域内，故守门测试没有覆盖到 —— 属于作用域缝隙。
- **复现步骤**
  1. 全库逐课进 `?tier=1`
  2. 前 3 题按正确答案作答推进
  3. 第 4 题（`replace` 或 `choose`）点一个错误选项
  4. 读页面全部渲染文本
- **实际行为**：**41/192 课**在这一刻把「主语」直接显示给用户（例：`lesson-01-am`、`lesson-02-is`、…）。实测输出：
  ```
  lesson-01-am [答错-replace] 零术语「主语」
  lesson-02-is [答错-replace] 零术语「主语」
  ...（bo8 报告前 10 条，全库共 41 课）
  ```
- **期望行为**：零越线（改文案，例如「想想句首那个『谁』」—— 项目既有的零术语替换体系见 `IMPLEMENTATION_NOTES.md` 的替换表：「主语」→「句首那个『谁』」）。
- **证据**（`bo8-redlines.test.tsx`）
  ```
  × BR-RED-1：档 1 答错文案不得含零术语（当前为已确认缺陷）
    → 档 1 渲染文本越线：lesson-01-am [答错-replace] 零术语「主语」...
  ✓ 档 1 全库：**排除已知的 replace/choose 答错文案**后，其余渲染文本零越线
  ✓ 三档全库：题面/选项/讲解/提示/样例句都不得含术语（tier 1/2/3 × 193 课，0 处）
  ```
  即：**除了这一处**，题干/选项/讲解/提示/样例句/听力文本等用户可见字段全库零越线。
- **严重度**：**P2**（文案，但踩的是项目明文红线，且影响 21% 的课）。

---

### P2-7 · `lesson-90-after` 的 cloze 题面丢了一个逗号，与判分基准不一致

- **文件:行号**：`src/services/grammarBoostService.ts:310`（`const answer = cleanWord(words[pickedIndex] ?? "")`）与 `:313`（空位替换）
  ```ts
  const answer = cleanWord(words[pickedIndex] ?? "");          // "homework, " → "homework"
  const lastChar = words[pickedIndex]?.slice(-1) ?? "";
  clozeWords[pickedIndex] = /[.?!]/.test(lastChar) ? `___${lastChar}` : "___";
  ```
  只有 `.?!` 会随空位保留；词内/词尾的**逗号**在 `clozeWords[pickedIndex]` 被整体替换时丢失。
- **数据来源**：`src/data/grammarLessons.ts:17089` 的否定变体 `After I do my homework, I don't watch TV.`
- **复现步骤**：`buildBoostItems("lesson-90-after", 1, {})` → 找 `kind === "cloze"` 的题
- **实际行为**
  ```
  clozeText   = "After I do my ___ I don't watch TV."
  clozeAnswer = "homework"
  answer      = "After I do my homework, I don't watch TV."
  options     = ["letter","homework","library","hadn't"]
  用户补全后看到的完整句 = "After I do my homework I don't watch TV."   ← 无逗号
  答对后反馈里给的标准句   = "After I do my homework, I don't watch TV."  ← 有逗号
  ```
- **期望行为**：题面回填后与 `answer` 完全一致。
- **证据**（`bo8-redlines.test.tsx`）
  ```
  × BR-RED-2：cloze 题面回填后必须等于 answer（当前为已确认缺陷）
    → lesson-90-after: 题面「After I do my ___ I don't watch TV.」+「homework」
       →「After I do my homework I don't watch TV.」≠ answer「After I do my homework, I don't watch TV.」
  ✓ cloze 题面回填后与 answer 的差异只在标点层（已知缺陷的严重度界定）
  ```
  **影响面极小**：全库 193 课扫描只有这 1 处；去标点后完全相同（证明是纯标点差异，没有词被吃掉）。故定为 P2 而非 P1。
- **严重度**：**P2**（答案与题面语义不一致，1 处）。

---

### P2-8 · 实现与声明不符：`round` 对「起点题」无任何作用

- **声明**：`src/pages/GrammarBoostPage.tsx:102-106`
  > 「这一档此前已练过几轮（复练时轮转题型顺序，避免每次都从同一道题开头）。
  >  从遥测反查「同课同档的历史完成次数」——**练得越多，起点越往后轮转**。」
- **实现**：`src/services/grammarBoostService.ts:939-943`
  ```ts
  const slots = ["spot", ...rotatingSlots.slice(rotation), ...rotatingSlots.slice(0, rotation)];
  ```
  `slots` 恒以 `"spot"` 开头（注释：「spot 固定占一个槽位，不参与轮空」），所以 `rotation` 只重排第 2–4 题，第一题恒为同一道 `guided.spot`。
- **实测**
  ```
  round 改变题目组合：档1 = 192/192 课（校对时课程库已增至 193 课，比例同）
  round 改变「起点题」：档1 = 0/192 课    ← 声明说会轮转，实际完全不动
  round 改变题目组合：档2 = 0/192 课；档3 = 0/192 课   ← round 参数对这两档完全被忽略
  ```
  （`BR-ROT-1` 校对时实测：`193/193 课的起点题不随 round 变化`）
  `buildBoostItems` 只把 `round` 传给 `buildTierOne`（`grammarBoostService.ts:1328-1330`），档 2/3 的签名里根本没有该参数。
- **换池的真实来源**：`seen`（近 7 天已练题源未练优先，`grammarBoostService.ts:527-534`）。它**确实**能换掉起点题（`spot` 池平均 4.7 道）：
  ```
  seen 改变起点：档1 = 192/192 课
  例：lesson-01-am: boost-...-t1-spot → boost-...-t1-spot-contrast-0
  ```
  所以「每次都是同一题开头」在真实使用中**不成立**（`seen` 兜住了）；有问题的只是**声明与实现不符**，以及「练得越多起点越往后」这个机制实际不存在。
- **证据**（`bo9-answer-semantics.test.tsx`、`bo5-rotation.test.tsx`）
  ```
  × BR-ROT-1：档 1 提高 round 应改变起点题（当前 round 对起点无作用）
    → 193/193 课的起点题不随 round 变化（例：lesson-01-am,lesson-02-is,lesson-03-have）
  ✓ 换池的真实来源是 seen：把上一轮的题源全部标记已练后，起点题会变
  ✓ 档 2 / 档 3：round 参数被完全忽略（服务层只把它交给档 1）
  ```
- **复练重叠率实测**（真实 UI：做完一档 → 重进同档）
  ```
  档 1 相邻轮次平均重叠率 = 2.5%（完全重复的课：0/192）  ← 换池有效
  档 2 相邻轮次平均重叠率 = 25.1%（完全重复的课：0/192）
  档 3 相邻轮次平均重叠率 = 44.3%（完全重复的课：0/192）
  ```
  档 3 重叠率高是**池深决定的**：`produce` 锚点全库每课只有 1 个（`target` 与 `recall` 常为同一句），档 3 本地只有 3 题，第二轮必然重复 1–2 题。属于设计边界，非代码 bug。
- **严重度**：**P2**（声明与实现不符 / 注释误导；对用户无直接可见危害，因为 `seen` 已兜底）。

---

### P2-9 · 重复点同一自评选项会重复记账

- **文件:行号**：`src/pages/GrammarBoostPage.tsx:779-799`（`boost-self-eval-btn` 的 onClick 无幂等守卫）
- **复现步骤**：档 1 完成后连点三次「挺顺利」
- **实际行为**：写 3 条 `grammar_boost_step_result { sourceRef: "self-eval:easy" }`
- **期望行为**：要么只记一条（幂等），要么保留「可改选」语义但去重
- **证据**（`bo7-self-eval.test.tsx`）
  ```
  ✓ 重复点同一选项：每次都记一条（无幂等守卫）   ← 记录现状
  ✓ 重复点不同选项：两条都记录，选中态跟随最后一次
  ```
  注：自评本身被 `summarizeBoost` 显式排除（`grammarTelemetry.ts:957-960` 的 `!sourceRef.startsWith("self-eval:")`），所以**不污染一次通过率**（已验证，见 §5）。重复记账只影响自评分布统计。
- **严重度**：**P2**（统计噪音，无用户可见影响）。

---

## 2. 逐条清单项的验证结论

| 清单项 | 结论 |
|---|---|
| **1. 三档完整作答链路** | ✅ **基本成立，含量与声明一致**；发现 P1-1（改错题答对确认的是错句） |
| **2. 档位独立性** | ✅ **承诺兑现**，无缺陷 |
| **3. AI 降级四情形** | ✅ **「功能不消失」成立**，无缺陷 |
| **4. 档 3 收尾批改** | ⚠️ 渲染/0-1-3 句/强度跟随设置**全部正确**；发现 P1-2（`aiUsed` 恒 false） |
| **5. 复练轮转** | ⚠️ 换池**有效**（`seen`）；发现 P2-8（`round` 声明与实现不符） |
| **6. 退出与放弃埋点** | ❌ 发现 P1-3（答 1 题退出不记 abandoned）、P2-4（未准入也记账）、P2-5（`from=lesson` 丢归因） |
| **7.「换你来说」自评** | ✅ **不是假功能**（按设计只记录）；发现 P2-9（重复记账） |
| **红线：零术语** | ❌ 发现 P2-6（「主语」，41 课） |
| **红线：Affective Filter** | ✅ 全库零越线 |
| **红线：无倒计时/排名/体力** | ✅ 零越线 |
| **红线：答案与题面语义一致** | ❌ 发现 P2-7（L90 逗号）+ P1-1（spot answer 是错句） |

### 1. 三档完整作答链路

**三档题量、判分、反馈、进度与 `BOOST_TIER_META` 声明完全一致**：

```
✓ 三档直链进入：题号分母 = BOOST_TIER_META 声明值（4 / 5 / 3）
✓ 档 1 四道题逐题推进：题号、引导语、进度与实到题数一致
✓ 答对：每道题都进入 pass 反馈（「对了！」+ 反馈里能看到该题答案）
✓ 答错：进入 retry（「再试一次」），题号不前进、可重试到通过
✓ 「看答案」的可用范围：档 1 的判断/填空/改错/选择类一律没有该入口
✓ recall 首题的提示逐级展开：三级用完入口消失，题目仍可提交
✓ 五题全部答对可走完（题型交错、题号连续）
✓ 答错给「还没对上 / 已经对了一部分」，且不结算、可重试
✓ produce / variant / fix 三题都能作答并走完；variant/fix 必先给样例句
```

- 档 1 实到 4 题（`spot / listen / cloze / replace`），档 2 实到 5 题（`recall / translate / rebuild / arrange / rebuild`），档 3 实到 3 题（`produce / variant / fix`）；
- 逐题「答错 → 再试一次 → 答对」全题型走通；每题答错都进 retry 而不结算、题号不前进；
- 档 3 的 `variant` / `fix` 必先渲染 `.boost-shaped-block` 样例句与标签（否则用户不知道要写什么）；
- 进度 pill（`0 / N 题` → `N / N 题`）与题号（`第 n / N 题`）同步递进。

### 2. 档位独立性（「允许只做一档就体面退出」）

**产品承诺兑现，无缺陷。**

```
✓ 档 1 完成态：无施压文案；出口只有「再深一点 / 回这一课 / 今天先到这」
✓ 档 1 完成 → 退出 → 再进：档 1 记「走过一遍」、档 2 可做且被建议
✓ 档 3 可直达（不强制先做档 1/2）：零门禁
✓ 三档都完成后：不再推下一档，回课入口 + 选择态「三档都走过了」
✓ 全部答错后走完一档：仍写入完成态（无正确率门禁）
✓ 错到看答案也不扣分、不降级：完成态文案仍是肯定句
```

- 完成态固定文案「今天练到这也算数。」+ 出口含「今天先到这」；
- **施压话术黑名单全页面零命中**（词表：未完成 / 还没做完 / 继续加油 / 不能放弃 / 必须 / 建议完成 / 还差 / 剩余 / 不要半途 / 打卡 / 连续 / 坚持 / 失败 / 做错 / 答错 / 错误 / 正确率 / 得分 / 分数 / 排名 / 体力 / 倒计时 / 剩余时间 / 时间不多了）—— 选择态、进行态、完成态三态分别核验；
- **完成态不出现任何 `\d+%` 百分比**（正则断言）；
- 每条 `PRESSURE_PHRASES` 在完成态都断言为零；
- 边界路径全通：不存在的课 → 「课程不存在」空态；未准入 → 「先上完这一课」；非法 `?tier=4/abc/0/-1` → 回落选择态不崩；`?from=receipt/card/reaudit/direct` 都能进档。

### 3. AI 降级路径（档 3）

**「功能不消失」在四种情形下全部成立，无缺陷。**

```
✓ 未配置（默认设置）：三题不减、能走完、有降级提示、不出现阻塞话术
✓ 配置了但 fetch 抛错：同上
✓ 返回非 JSON（HTML 页面）：同上
✓ HTTP 500：同上
✓ 未配置 AI 时，档位选择卡明确写「没配置 AI 也能做」（事先说明而非事后报错）
✓ 配置 AI 后档位选择卡改为承诺「AI 会把你写的几句一起看一遍」
```

每种情形都断言了 4 件事：① 题量不减（= `BOOST_TIER_META[3].questionCount`）；② 完成态照常出现且 `grammarBoostsDone` 写入 `[1,2,3]`；③ 不出现「配置失败 / 出错了 / 不可用 / 请先配置 / 请求失败」式阻塞话术；④ `grammar_boost_ai_result` 事件如实记 `ok:false / degraded:true` 且 `degradeReason ∈ {not_configured, timeout, error, invalid}`。

三种 `degradeReason` 实测落点：未配置 → `not_configured`；fetch 抛错 → `timeout`（catch 分支的口径把所有异常都归为 timeout）；非 JSON → `invalid`（`extractJsonObject` 抛错走 catch → `timeout`）；HTTP 500 → `error`。

> 备注（可疑但未证实为缺陷）：`fetch` 抛错在 UI 上与「超时」同档文案（「AI 这次没接上——先看下面的对照。」），埋点里也统一记 `timeout`。这对用户无害（文案一致），但会让「降级原因分布」把网络错误与真超时混在一起。考虑到 `BoostDegradeReason` 类型本身就只定义 4 个值且 `catch` 无法区分来源，**不改判为缺陷，仅登记为观察**。

### 4. 档 3 收尾批改

**渲染、0/1/3 句、批改强度跟随设置全部正确**；仅 `aiUsed` 记账有缺陷（P1-2）。

```
✓ 写了 3 句：批改请求恰好带 3 条 entries，结果渲染出 corrected
✓ 写了 1 句（另两句走看答案/空文本）：批改只带真实写出的那句
✓ 0 句产出（没答题直接退出）：不发起批改请求，也不报错
✓ AI 返回的 issues 条数与 tag 缺失时都不崩（缺 tag 仍渲染 explanation）
✓ recast / comment / issues 三类字段都按设计渲染，缺字段不渲染空行
✓ 批改结果按输入顺序与用户原句一一对应（不会串句）
✓ gentle → 含 GENTLE 指令；standard / strict → 分别为 STANDARD / STRICT
✓ 设置未写 diaryCorrectionStyle 时用 standard（不是硬编码 gentle）
```

- **请求体实测**（`bo3-ai-degrade.test.tsx` 捕获）：`entries` 数 = 用户真实写出的句子数，每条带 `intentZh / answerEn / targetEn / taskKind`；`taskKind` 三种都出现（`produce / variant / fix`）——印证「variant/fix 不该按字面比对 target」的设计已接线；
- **批量而非逐题**：整档只发 **1 次** 批改请求（`questionIndex: 0`），与 PRD §4.6「不逐题调用」一致；
- **0 句不发请求**：`runAiCorrection` 里 `entries.length === 0` 早退，实测 `fetch` 未被调用；
- **批改强度跟随设置**：`data.settings.diaryCorrectionStyle` 改 gentle/standard/strict，system prompt 分别含 `Correction style: GENTLE / STANDARD / STRICT`（整串断言，含 `AT MOST 1 issue` 仅 gentle 有）；未写该字段时落 `standard`（**不是**曾经的硬编码 gentle）；
- **渲染**：`.boost-ai-card` 渲染「你这句 / 改顺一点 / 也可以这样说 / comment / · explanation」，三条按输入顺序一一对应，无串句；
- **缓存键含用户实写句子**（`grammarBoostAiService.ts:195`），同课同档不同作答不复用。

### 5. 复练轮转

见 P2-8。核心事实：

- **换池有效**（`seen` 机制），档 1 相邻轮次平均重叠率仅 **2.5%**，全库 192 课**没有一课**完全重复；
- `round` 只重排第 2–4 题，**起点题不动**；档 2/3 的 `round` 参数完全被忽略；
- 换池在真实 UI 上走通：做完一档 → 重进同档 → 起点题被换掉（`bo5` `✓ 档 1 两轮：起点题被换掉（换池生效）`），三轮连续都有变化；
- 档 2 起点（`recall` 锚点）在 `target` 与 `recall` 同句时必然重复（`target` 池每课只有 1 个）；档 3 池只有 3 题，第二轮重复是池深问题；
- `seen` 覆盖整池时仍出满题量（档 1 = 4、档 2 = 5、档 3 = 3），**不出现空态**。

### 6. 退出与放弃埋点

见 P1-3 / P2-4 / P2-5。**三档情形本身正确**（在「点过下一题」的口径下）：

```
✓ 答 0 题退出（进入档位后立刻离开）：只有 started，没有 abandoned
✓ 答 1 题并推进到下一题后退出：记 1 条 abandoned，answered=1、total=声明题量
✓ 做完一档退出：记 completed，没有 abandoned；完成态写入
✓ 档 3 答 2 题并推进后退出：abandoned 的 tier=3、total=3
✓ 档 1 完成 → 完成态继续做档 2 → 档 2 答 0 题退出：只有档 1 的 completed，没有 abandoned
✓ StrictMode：进档再离开（0 题）→ started 只 1 条、无 abandoned
✓ StrictMode：答 1 题、点「下一题」后离开 → abandoned 只 1 条
✓ 答 1 题、点「下一题」后走页面内链接离开 → 记 abandoned（组件卸载即结算）
✓ 答 0 题后点「先回去」→ 不记 abandoned
✓ 遥测写入独立键空间：不污染 AppData
```

StrictMode 双跑守卫（`offeredLoggedRef` / `startedLoggedRef`）**有效**，`started` 与 `abandoned` 都不重复。走页面内真实链接（而不是 `unmount`）离开时结论一致。

### 7.「换你来说」的自评

**不是假功能 —— 且设计要求正好是「选了不产生后续动作」。**

```
✓ 完成态出现自评三选项，且文案是零术语的自我感受（不是对错判断）
✓ 点「挺顺利」→ 选中态 + 记一条 self-eval:easy（passed=true）
✓ 点「还不太顺」→ 记 self-eval:hard（passed=false），但页面不给任何负面反馈
✓ 点「有点想」→ 记 self-eval:ok（passed=false），与 hard 同口径
✓ 自评不打断完成态：完成态仍在、出口仍在、档位完成态不受影响
✓ 点自评前后：卡片数 / schedule / 完成态 / 事件种类都不变
✓ 自评被排除在「一次通过率」口径之外（sourceRef 前缀过滤有效）
✓ 每档都有自评（档 2 / 档 3 的 tier 字段正确）
```

- **设计依据**：`GrammarBoostPage.tsx:770` 注释 + PRD R-B16 验收均写「**只记录，不再追加任何动作**」。所以「选了 easy/hard 后 schedule 不变」是**正确行为**，不是假功能。
- 断言方式：点击前后对比 `cards.length` / `cards.schedules` 全量 JSON / `grammarBoostsDone` / `grammar_boost_completed` 条数 / `grammar_boost_started` 条数 / `sentence_card_enqueued` 条数（均为零变化）。
- 自评写的是 `grammar_boost_step_result`，`sourceRef = "self-eval:<key>"`，`passed = (key === "easy")`；该前缀被 `summarizeBoost` 显式排除，所以**不污染一次通过率**（实测全对 + 点「还不太顺」后 `firstTryRateByTier[1] === 1`）。

### 红线横切核验

- **零术语**：全库 193 课 × 三档，扫描 `promptZh / intentZh / explainZh / answer / shapedLabel / shapedFrom / clozeText / clozeOptions / contrast.sentence / contrast.correct / contrast.whyZh / correctPair / listenOptions / spotTokens / tokens / options / hints / spotCorrectionZh` **共 0 处越线**。页面骨架文案（选择态 + 三档直链，3 课取样）也 0 处。**唯一越线**是 P2-6 的运行时 feedback 文案（不在上述字段里，故需 UI 驱动才能发现）。
- **Affective Filter**：全库扫描挫败话术（做错/答错/错误/不正确/正确率/错题 等）**零命中**。「对了！」是正向确认，有意保留。
- **无倒计时/排名/体力**：`/\d{1,2}:\d{2}/` 在选择态与进行态都零命中；「约 2 分钟 / 约 4 分钟」只出现在档位时长预告（允许）；等待 1.5 秒后页面文本**逐字不变**（证明没有秒表）。
- **零门禁**：档 3 可直达、档 1 可重练、错题不阻塞、无结算分数。

---

## 3. 新增测试文件

全部放在 `src/edge/verify/`，命名遵循 `bo*-*.test.tsx`（bo = boost）：

| 文件 | 用例数 | 覆盖清单项 |
|---|---|---|
| `/Users/liujun/Documents/英语听写/src/edge/verify/bo1-tier-chains.test.tsx` | 11 | 1（三档链路 / 题量 / 判分 / 反馈 / 完成事件） |
| `/Users/liujun/Documents/英语听写/src/edge/verify/bo2-tier-independence.test.tsx` | 11 | 2（含施压话术与百分比扫描、边界路径） |
| `/Users/liujun/Documents/英语听写/src/edge/verify/bo3-ai-degrade.test.tsx` | 13 | 3 + 4（四情形降级 / 0-1-3 句 / 强度跟随设置 / 变式题） |
| `/Users/liujun/Documents/英语听写/src/edge/verify/bo4-correction-observability.test.tsx` | 5 | 4（`aiUsed` 记账 + 渲染完整性） |
| `/Users/liujun/Documents/英语听写/src/edge/verify/bo5-rotation.test.tsx` | 12 | 5（round/seen 对起点与整份题目的作用、两/三轮真实 UI 复练） |
| `/Users/liujun/Documents/英语听写/src/edge/verify/bo6-exit-telemetry.test.tsx` | 20 | 6（0/1/完成 × 三档 + StrictMode + 真实链接动线 + 入口归因 + 门禁记账） |
| `/Users/liujun/Documents/英语听写/src/edge/verify/bo7-self-eval.test.tsx` | 10 | 7（自评 UI/记录/无后续动作/口径隔离） |
| `/Users/liujun/Documents/英语听写/src/edge/verify/bo8-redlines.test.tsx` | 16 | 红线（零术语 / Affective Filter / 无计时 / 答案一致性 + 全库字段扫描） |
| `/Users/liujun/Documents/英语听写/src/edge/verify/bo9-answer-semantics.test.tsx` | 6 | 1+5（spot answer 契约 / round 声明核验） |

**运行结果**（`node_modules/.bin/vitest run <9 个 bo 文件> --testTimeout=300000`）：

```
 ❯ src/edge/verify/bo4-correction-observability.test.tsx (5 tests | 2 failed)
 ❯ src/edge/verify/bo6-exit-telemetry.test.tsx (20 tests | 3 failed)
 ❯ src/edge/verify/bo8-redlines.test.tsx (16 tests | 2 failed)
 ❯ src/edge/verify/bo9-answer-semantics.test.tsx (6 tests | 2 failed)
 ✓ src/edge/verify/bo1-tier-chains.test.tsx (11 tests)
 ✓ src/edge/verify/bo2-tier-independence.test.tsx (11 tests)
 ✓ src/edge/verify/bo3-ai-degrade.test.tsx (13 tests)
 ✓ src/edge/verify/bo5-rotation.test.tsx (12 tests)
 ✓ src/edge/verify/bo7-self-eval.test.tsx (10 tests)

 Test Files  4 failed | 5 passed (9)
      Tests  9 failed | 95 passed (104)
```

**9 条失败 = 9 条已确认缺陷**，命名前缀 `BR-*`，每条测试的 docblock 都写明了机制、影响面与「修复后应转绿」：

```
× BR-ANSWER-1  改错题 answer 不得是题面错句            → P1-1
× （bo4）AI 成功后 completed.aiUsed 应为 true          → P1-2
× （bo4）aimUsedRate 应 > 0                            → P1-2
× BR-EXIT-1    答 1 题（停在反馈区）退出应记 abandoned  → P1-3
× BR-EXIT-2    未准入的课不应记任何 boost 埋点          → P2-4
× BR-EXIT-3    ?from=lesson 应记 entryPoint=lesson      → P2-5
× BR-RED-1     档 1 答错文案不得含零术语（主语）        → P2-6
× BR-RED-2     cloze 题面回填必须等于 answer（L90）    → P2-7
× BR-ROT-1     提高 round 应改变起点题                  → P2-8
```

其余断言全部通过，包括两条「界定严重度」的用例：`✓ 档 1 全库：排除已知的 replace/choose 答错文案后，其余渲染文本零越线`、`✓ cloze 题面回填后与 answer 的差异只在标点层`。

---

## 4. 可疑但未证实

| # | 观察 | 为何未判为缺陷 |
|---|---|---|
| S1 | `fetch` 抛错与超时在埋点里同为 `degradeReason: "timeout"`，UI 文案也相同 | `BoostDegradeReason` 类型只有 4 个值且 `catch` 无法区分来源；对用户无可见差异。仅登记为「降级原因分布会混淆网络错误与超时」 |
| S2 | 档 2 起点（`recall` 锚点）在 `target === recall.answer` 时必然重复 | 池深问题（`poolOf` 只取 `target` + `recall` 两个锚点，全库常为同一句），非逻辑缺陷；中后段有换池 |
| S3 | 档 3 两轮重复率 44.3% | 本地池只有 3 题（`produce/variant/fix` 各 1），达 `questionCount` 后 `loadAiVariants` 不再补题（这是「本地优先」的正确行为）；无 AI 时不可能更深 |
| S4 | `lesson-76-much-better` / `lesson-87-its-cold` / `lesson-169-id-like` 的档 3 `fix` 题来自 `bothRight` 条 | `buildTierThree` 的 `fix` 候选未过滤 `bothRight`（`grammarBoostService.ts:1238-1254`），会把「两句都对」的正确句当成「这句写错了」的题面（例：L87 题面 `It's cold today.` → 要求改对，答案 `It is cold today.`）。**但我实测这三处的答案改写确实成立**（`It's` → `It is` 是可接受的「写全」动作），且它们经 `_constructedOptions`… 实际渲染为合法练习；已由并发新增的 `gq2-boost-items.test.ts` 单独守门（该文件正在覆盖此风险）。**未判为缺陷**，登记为内容质量观察 |
| S5 | 94/192 课的 `guided.spot` 讲解 `explainZh` 未逐字提到 `wrongToken` | 逐条抽样（`lesson-01-am/02-is/03-have/06-it`）看，讲解都在讲「正确的那一半」（如 `It 的搭档是 is`），是**有意的方向性提示**而非讲错。未判为缺陷 |
| S6 | 并发修改仍在进行，`GrammarBoostPage.tsx` 的行号可能已变化 | 报告给出函数名 + 代码片段以便定位；md5 已记录用于对齐 |

---

## 5. 验证过但当前无问题（同样是结论）

| 项目 | 验证方法 | 结论 |
|---|---|---|
| **`firstTryCount` 与页面文案同源** | 走完三档（全对 / 最后一题先错后对），比对 `.complete-hero-sub` 文案与 `completed.firstTryCount` | ⚠️ **验证期间被并发修复**。我最初测到「页面 4/4 但埋点 3/4」（off-by-one：`advance` 里 `setFirstTryCount` 异步，`finishTier` 读到旧值），随后对方把 `finishTier(finalFirstTryCount)` 改为由调用方传入并当场修绿。`bo1-tier-chains.test.tsx` BO1-e 保留为回归护栏（三档 × 全对断言） |
| **`cloze` 干扰项非伪造词** | 全库扫描 `clozeOptions`，检查 `-ed/-ing/-es` 后缀是否造出不存在的词 | ✅ 无 `don'ted`/`taked`/`drinked` 类伪词（2026-09-19/20 两次修复有效） |
| **`listen` 题的 answer 在选项里** | 全库 193 课扫描 `listenOptions.includes(answer)` | ✅ 0 处违规（否则该题无法答对） |
| **`spot` 错词下标在词块范围内** | 全库扫描 `spotWrongIndex`/`spotWrongIndexes` vs `spotTokens.length` | ✅ 0 处越界（所有改错题都点得到） |
| **`rebuild`/`arrange` 词块库含答案的每个词** | 全库扫描（含重复词按多重集扣减） | ✅ 0 处缺词（否则拼不出正确句） |
| **`variant`/`fix` 样例句 ≠ 答案** | 全库扫描 | ✅ 0 处相等；且样例句非空 |
| **`cloze` 回填与 answer 的差异只在标点** | 去标点后全库比对 | ✅ 除 P2-7 那 1 处，其余全等 |
| **三档题量全库达标** | `buildBoostItems` 逐课 × 三档 | ✅ 每课都出满 4/5/3（`r7-invariants` 也断言，阈值 193 课） |
| **`seen` 覆盖整池不出现空态** | 连续 30 轮累积 `seen` 后再取题 | ✅ 三档仍出满声明题量 |
| **StrictMode 埋点不重复** | StrictMode 下挂载 → 进档 → 离开 | ✅ `started` 1 条、`abandoned` 1 条（不重复） |
| **`?tier` 语法错误不崩** | `?tier=4/abc/0/-1` | ✅ 回落到档位选择态 |
| **`GET /grammar/boost/:badId`** | 挂载不存在的 lessonId | ✅ 显示「课程不存在」+ 返回课程地图，不崩、不记埋点 |
| **AI 变式题不覆盖本地题** | 档 3 本地已满 3 题时不请求变式题 | ✅ `loadAiVariants` 在 `items.length >= questionCount` 时整段守卫，本地优先 |
| **AI 批改结果按输入顺序对齐** | 3 条不同句子 → 检查 `originalEn` 顺序 | ✅ 无串句 |
| **自评不污染一次通过率** | 全对 + 点「还不太顺」后读 `firstTryRateByTier` | ✅ 仍为 1（`self-eval:` 前缀被 `summarizeBoost` 排除） |
| **遥测不污染 AppData** | 答 0 题进退后检查 `personal-vocab-app-data-v1` | ✅ 不含 `grammar_boost_abandoned` |

---

## 6. 建议修复优先级

1. **P1-1**（改错题 answer 是错句）—— 全库 100% 命中，零基础用户会被「对了！+ 错句」误导。修法：`guided.spot` 分支改为 `answer: resolveCorrectSentence(spotStep)`（从 `correctionZh` 或 `explain` 取正确句），与 `contrastSpot` 分支口径统一。
2. **P1-3**（答 1 题退出不记 abandoned）—— 在 `submit*` / `recordStep` 处（判题时）就自增 `answeredRef`，而不是等到 `advance`。
3. **P1-2**（`aiUsed` 恒 false）—— 把 `runAiCorrection` 的 await 结果传回，或在 `finishTier` 里改为「先启动批改、把 `aiUsed` 写进一个后续补写的 `ai_result` 事件」，或简单地把 `completed` 事件的写入推迟到 `runAiCorrection` 之后。
4. **P2-4 / P2-5**（埋点门禁与入口归因）—— 两个埋点 effect 移到 `canBoostLesson` 之后；`entryPoint` 映射加 `from=lesson`，并给 `GrammarBoostStartedEvent["entryPoint"]` 补 `"lesson"`。
5. **P2-6**（「主语」）—— 改为「想想句首那个『谁』」，并把该文案纳入零术语守门测试的作用域。
6. **P2-7**（L90 逗号）—— `buildCloze` 在替换空位时保留词尾标点（把 `/\[.?!\]/` 扩为 `/[,.;?!]/` 或直接保留 `words[pickedIndex]` 的尾部标点）。
7. **P2-8 / P2-9**（声明与实现不符 / 自评重复记账）—— 改注释或让 `round` 真的移动起点；自评加 idempotent 守卫。
