# 课程页六段流程 · 状态机验证报告

- 验证对象：`src/pages/GrammarLessonPage.tsx`（六段：前测 → ①看 → ②跟 → ③忆 → ④练 → ⑤破 → 收据）、
  `src/pages/GrammarRevisitPage.tsx`（回访）、`src/pages/GrammarReauditPage.tsx`（重审）
- 契约版本（源码 sha256）：
  - `GrammarLessonPage.tsx` = `c41f977e296c808317ae4a4b42368e7c08afd4acc67ad59347b02abf15c1aaca`
    （复跑时已变为 `87792e378bb7da63366c3a61eb96b03e1b932e9d5bc3fc27b46bf8f10b85f73a`：文件被并发追加了内容，**本报告引用的全部行号与 12 条缺陷在两种修订下均不变**，
    62 个用例在新修订上同样全通过 —— 已逐条 `grep` 复核行号）
  - `GrammarRevisitPage.tsx` = `d725195a608772c492439d0b9d7bf4d6f3034efa8795e1bc2d577ec3ac593dd4`
  - `GrammarReauditPage.tsx` = `f4535dc384011d4571cdde5c4c88832e354de1e81d43f1de2d47a5e0202078ab`
- **未修改 `src/` 下任何产品代码**；只新增测试文件（`src/edge/verify/st*.test.tsx`）。
- 说明：验证期间有另一位 agent 在并发修改同一文件（`useReturnFocus` / 焦点相关），
  期间出现过两次**瞬时崩溃**（TDZ：变量在声明前被读取，见附录 D）。上述哈希是本报告的基线；
  崩溃属于那一轮的中间态，最终修订已恢复正常，不作为本报告的缺陷计数。

---

## 0. 结论摘要

| # | 条目 | 结果 |
|---|------|------|
| 1 | 段间状态残留 | **4 个确认缺陷**（其中 3 个是「无出口」死路）+ 6 条 PASS |
| 2 | 段内子步骤边界 | **1 个确认缺陷**（成功路径无反馈）+ 9 条 PASS + 2 条可疑 |
| 3 | 收据数字 vs localStorage | **3 个确认缺陷**（数字虚报 / 结论与队列矛盾 / 确证区出现错句）+ 11 条 PASS |
| 4 | 回访 / 重审状态机 | **3 个确认缺陷**（含 1 个指标恒为 0）+ 11 条 PASS |
| 5 | 重复进入与幂等 | **1 个确认缺陷**（StrictMode 下退出遥测翻倍）+ 9 条 PASS |

新增测试：**5 个文件 / 62 个用例 / 全部通过**（62 passed）。
确认缺陷：**12 条**（P0×3 · P1×7 · P2×2）。可疑但未证实：**4 条**。

---

## 1. 段间状态残留（重点）

### 1.1 段对矩阵

覆盖方式：全部经**真实 UI 出口**驱动（`回去再看一遍讲解` / `看懂了，试一试` / `进入练习` /
`最后一步：说出来` / `再学一遍这一课`），逐条检查 6 类关键 state：
拼装序（`guidedOrder` / `practiceOrder`）、反馈（`guidedFeedback` / `practiceFeedback`）、
miss 计数（`guidedMisses` / `practiceMisses`）、提示（`guidedHint` / `practiceHint`）、
判题去抖 ref（`lastJudgedLengthRef`）、追问面板（`whyWrongOpen`）。

| A→B | 出口路径 | 结论 | 依据 |
|-----|----------|------|------|
| pretest→watch | 前测结果页 →「开始上课」 | PASS | 讲解段无答题卡 / 无输入框 |
| pretest→practice | 前测全对 →「直接去练习」 | PASS | 练习段干净起始（无残留 build / feedback） |
| pretest→guided | 前测结果页 →「开始上课」→ 讲解→看懂了 | PASS | 同上 |
| watch→guided | 「看懂了，试一试」 | PASS | `resetGuided` 生效：index/misses/feedback/hint 归零 |
| guided→watch | 「回去再看一眼讲解」 | PASS | 离段本身无副作用（快照只在 practice/challenge 写） |
| **guided→guided** | 「回去再看一眼讲解」→ 回讲解 →「看懂了，试一试」 | **FAIL-3 / FAIL-3b** | `guidedOrder` 未随 `resetGuided` 清空；答对后回段**出口全无** |
| recall→watch | 「回去再看一眼讲解」 | PASS | recall 有独立重置（`gotoStage("recall")` 四处 setState） |
| recall→practice | 「进入练习」 | PASS | 忆段输入 / 反馈不泄漏 |
| practice→practice | 「回去再看一遍讲解」→ 原路走回练习 | **FAIL-1** | `practiceOrder` 未随 `gotoStage("practice")` 清空；去抖 ref 亦未清（FAIL-2） |
| **practice→guided** | 练习判题 →「回去再看一遍讲解」→ 进引导段 | **FAIL-2** | 去抖 ref 残留 → 引导段首题 arrange 拼满不判题、无出口 |
| practice→challenge | 完课 | PASS | 完课判定固化（`practiceDone` + 已完课集合双保险） |
| challenge→watch | 「再学一遍这一课」 | PASS | 重走引导段可正常推进 |
| output→practice | 「回去再看一遍讲解」→ 原路返回 | PASS | 落回 output 子态（`outputStep>=0`），见 ST2 PASS-6 |

### 1.2 确认的缺陷

---

#### [P0] FAIL-1 · 练习段答完一题回讲解再回来：第 1 题开局就摆着上一题的答案

- **文件:行号**
  - 症状：`src/pages/GrammarLessonPage.tsx:1162-1175`（`gotoStage("practice")` 的全量重置分支）
    与 `:1146-1160`（快照恢复分支）—— 两条分支都重置了
    `practiceIndex / practicePicked / practiceFeedback / practiceMisses / practiceHint /
    practiceDone / outputActive / outputValue / outputTokens / outputAttempts /
    outputOutcome / outputHint / outputHintLevel / outputStep`，
    **唯独漏了 `setPracticeOrder([])`**。
  - 对照：`practiceNext`（`:2006`）与 `guidedNext`（`:1453`）
    在**题内推进**时确实会 `setPracticeOrder([])` —— 说明这是遗漏，不是有意保留。
- **复现步骤**
  1. 进 L13（`lesson-13-now`）→ 前测全对 →「直接去练习」
  2. 练习第 1 题按答案摆满 5 块（`I am reading a book.`）→ 判为通过
  3. **不点「下一题」**，直接点「回去再看一遍讲解」
  4. 原路走回：「下一步：搭装与对错」→「下一步：变奏」→「看懂了，试一试」→ 做完引导段 → 忆段 →「进入练习」
- **实际 vs 期望**
  - 期望：回到练习段第 1 题，拼装区为空、词块库全可点、无反馈。
  - 实际：题号确为「第 1 / 5 题」，但拼装区**已摆着上一题的 `I am reading a book.`**，
    词块库里这 5 块**已被禁用**（`practiceOrder` 判定为「已选」），其余 2 个干扰项可点；
    `practiceFeedback` 是 `idle`，所以**没有通过反馈、也没有任何前进出口**。
- **证据**（`ST1 · FAIL-1`）
  ```
  builtChips → ["I","am","reading","a","book."]     // ★ 期望 []
  bank 禁用数 → 5                                     // ★ 期望 0
  .lesson-feedback → null                             // ★ 期望是「干净初始态」
  forwardExits → []                                   // ★ 期望 ["下一题"] 或可通过判题拿到
  ```
- **严重度**：**P0**（进度丢失 + 无出口：用户看到一句「已经做好」的第 1 题，不知道该干什么；
  唯一出路是手动移除一块再放回，且这一步会被记成第二次判题）

---

#### [P0] FAIL-2 · 引导段首题 arrange 拼满答案不判题，整屏无出口（判题去抖 ref 跨段残留）

- **文件:行号**
  - `src/pages/GrammarLessonPage.tsx:1307`：
    `if (next.length >= answerLen && next.length !== lastJudged) { … judgeArrange(...) }`
  - `lastJudgedLengthRef` 的**全部重置点只有 5 处**：`:1318`（`arrangeRemove`）、
    `:1348`、`:1386`、`:1453`、`:2006`（`practiceNext`）。
    `gotoStage(...)`（`:1124-1178`）**没有任何一处重置它**。
- **复现步骤**
  1. 进 L13 → 前测全对 →「直接去练习」
  2. 练习第 1 题按答案摆满（5 词）→ 判为通过 → `lastJudgedLengthRef = 5`
  3. 点「回去再看一遍讲解」→ 进讲解 →「下一步：搭装与对错」→「下一步：变奏」→「看懂了，试一试」
  4. 引导段第 1 题是 **arrange 且答案也是 5 词**（`I am drawing a picture.`）——
     按答案一次性摆满 5 块
- **实际 vs 期望**
  - 期望：判题通过，出现「下一题」。
  - 实际：`5 !== 5` 不成立 → **判题被整段跳过**；无反馈、无出口。用户必须自己移除一块再放回才能脱身。
- **证据**（`ST1 · FAIL-2`）
  ```
  first.step.kind === "arrange"   且 5 词  ==  practice Q1 的 5 词   ← 去抖碰撞条件成立
  builtChips → 5 块（已摆满）
  .lesson-feedback → null            // ★ 拼满正确答案后没有任何反馈
  forwardExits → []                  // ★ 没有任何前进出口
  —— 移除一块再放回后 ——
  .lesson-feedback.pass 出现，forwardExits → ["下一题"]
  ```
- **影响面（全库扫描）**：首题为 `arrange` 的课 **96 课**，其中首题答案词数与
  `practice[0]` 相同的 **82 课**（L13/L12/L22/L23/L25/L30/L32… 均在其列）。
  另有「任一 guided arrange 题与 practice[0] 撞词数」的课 **185 课**（潜在面更广）。
- **严重度**：**P0**（功能完全卡死、无出口、无提示；触发路径是页面自己提供的正规按钮）

---

#### [P0] FAIL-3 · 引导段答对后回讲解再回引导段：拼装序残留 + 出口全无

- **文件:行号**：`src/pages/GrammarLessonPage.tsx:992-998`（`resetGuided`）
  ```
  setGuided(createGuidedState());
  setGuidedFeedback("idle");
  setGuidedMisses(0);
  setGuidedHint(null);
  setMistakeSaved(false);
  // ★ 缺 setGuidedOrder([])
  ```
  调用点：`gotoStage("guided")`（`:1126`）。
- **复现步骤**
  1. 进 L13 → 前测全对 → 转进引导段（「直接去练习」→「回去再看一遍讲解」→ 三步 →「看懂了，试一试」）
  2. 引导段第 1 题按答案摆满 → 判为通过（出现「下一题」）
  3. **不点「下一题」**，点「回去再看一遍讲解」
  4. 点「看懂了，试一试」回到引导段
- **实际 vs 期望**
  - 期望：回到第 1 题的干净初始态（空拼装区、反馈 idle、无通过态）。
  - 实际：题号回到「第 1 / 6 题」、`guidedFeedback` 被重置成 `idle`（所以**通过反馈和「下一题」一起消失**），
    但拼装区**仍摆着上一轮的正确句子**、词块库 5 块**全部禁用** → **页面完全无出口**。
- **证据**（`ST1 · FAIL-3`）
  ```
  ③ 回到第 1 题       → /第 1 \/ \d+ 题/  ✓
  .lesson-feedback   → null                     // resetGuided 清了 feedback
  builtChips         → ["I","am","drawing","a","picture."]   // ★ 应 []
  bank.every(disabled) → true                    // ★ 用户无法改动任何一块
  forwardExits       → []                        // ★ 无出口，彻底卡死
  ```
- **严重度**：**P0**（整段卡死；用户按页面自己提供的按钮走就会踩到）

---

#### [P1] FAIL-3b · 引导段摆块未提交就回讲解：回段后拼装序同样残留

- **文件:行号**：同 FAIL-3（`resetGuided` 缺 `setGuidedOrder([])`）
- **复现步骤**：进引导段 → 只摆 2 块（未达判题阈值）→「回去再看一眼讲解」→「看懂了，试一试」
- **实际 vs 期望**：期望干净第 1 题；实际回段后拼装区仍是那 2 块（`["a","drawing"]`）。
  此态下用户还能继续点词块（未禁用满），所以**不致死路**，但「干净初始态」的契约被破坏，
  且用户会以为自己刚才的操作被保留了下来。
- **证据**：`ST1 · FAIL-3b` — `builtChips` 与离段前完全一致
- **严重度**：**P1**（状态污染，与 FAIL-3 同根因，修复时一并覆盖）

---

#### [P1] FAIL-4 · 练习段答对后误点词块：出口消失，同一题被判两次

- **文件:行号**：`src/pages/GrammarLessonPage.tsx:1307`（`arrangeAdd` 的重判条件）
  —— 只要「块数 ≥ 答案词数」且「与上次判题长度不同」就重判；
  答对后拼装区与词块库**仍可点**（`renderArrangeArea` 未按 `passed` 禁用 `add`）。
- **复现步骤**
  1. 进 L13 →「直接去练习」
  2. 第 1 题按答案摆满 → 通过（「下一题」出现）
  3. **多点一个干扰项**（如 `is`）→ 立刻翻成 retry，「下一题」消失
  4. 点掉刚加的干扰项 → **既无 pass 也无 retry，出口仍然没有** → 必须整段重摆
- **实际 vs 期望**
  - 期望：答对之后拼装区应锁定（或至少误触不改变已通过的结论）。
  - 实际：答对→误触→移除是一串纯操作噪音，却产生两条记录：
    ```
    lesson_step_result: practice#0 a1 true   （真答对）
    lesson_step_result: practice#0 a2 true   （误触后重摆，凭空多一条）
    ```
    并且 `saveMistakeIfNeeded(practiceMisses>0)` 在最终通过时把**已经答对的句子**
    当作「错过」处理（入队 + 拉黑 `practiceFirstTry`）。
- **证据**（`ST1 · FAIL-4`）
  ```
  ① 答对        → forwardExits ["下一题"]
  ② 多点一块    → .lesson-feedback.retry，forwardExits []
  ③ 移除多余块  → .lesson-feedback === null，forwardExits []   ★ 无出口
  ④ 重摆        → 恢复出口
  practice step 事件 → ["#0 a1 true", "#0 a2 true"]            ★ 同一题被判两次
  ```
- **独立佐证**：另一位 agent 的 `src/edge/verify/kb4-arrange-keyboard.test.tsx`
  KB4-6 从**橡皮擦 vs 点击**两条等价路径的角度记录了同一现象
  （「修复只覆盖了橡皮擦，漏了点击路径」）—— 两条独立路径指向同一处未收敛的语义。
- **严重度**：**P1**（出口消失 + 遥测污染）

---

### 1.3 验过没问题的部分（方法与结论）

| 用例 | 方法 | 结论 |
|------|------|------|
| PASS-1 前测→讲解 | 前测全对 → 转讲解，查有无答题卡/输入框 | 前测态不泄漏 |
| PASS-2 练习推进后回讲解 | 答 3 题推进到第 4 题 → 回讲解 → 原路返回 | 快照 `practiceIndex=3` 被消费，**恢复到第 4 题**且该题可正常判题 |
| PASS-3 忆段→练习 | 忆段答对 → 进入练习 | 忆段输入框消失、build 为空、feedback 为 null |
| PASS-4 忆段往返 | 忆段答错 → 回讲解 → 原路回忆段 | `gotoStage("recall")` 四处重置全部生效（输入清空、反馈重置） |
| PASS-5 完课后再学一遍 | 完课 → 挑战段 →「再学一遍这一课」 | 不弹续学卡、完成态保持、可正常重走 |

> 关于 `whyWrongOpen`（追问面板）：`guided` / `output` 段的入口都带
> `!whyWrongOpen` 守卫，`practice` 段带 `whyWrongStepRef.current === practiceIndex` 守卫，
> 换题后面板不再显示（实测第 2 题误答时无面板、入口正常）—— 已验证无残留。

---

## 2. 段内子步骤边界

### 2.1 确认的缺陷

#### [P1] ST2-FAIL-1 · output 第 1 档凭自己写对：静默换句，无任何反馈

- **文件:行号**：`src/pages/GrammarLessonPage.tsx:1638-1644`（`submitOutput` 的通过分支）
  ```
  if (passed) {
    if (outputStep < outputPlan.length - 1) {
      advanceOutputStep();   // ← 清空输入、切到第 2 句
      return;                // ← 直接返回，不设任何反馈
    }
    setOutputOutcome("pass");  // 只有最后一档才给反馈
  ```
- **复现步骤**
  1. 进 L13 → 走到产出段（两档）
  2. 第 1 档：点提示阶梯到 level 3 拿到句子 → 照抄进输入框 →「提交」
- **实际 vs 期望**
  - 期望：写对了给一句确证（项目「确证仪式」的取向）。
  - 实际：画面**静默跳到**「最后一步 · 说出来（2 / 2）」——输入框清空、句子换了、
    **没有反馈、没有过渡按钮**。
- **证据**（`ST2 · FAIL-1`）
  ```
  提交后档位 → 最后一步 · 说出来（2 / 2）
  .lesson-feedback → null                                     ★ 无反馈
  buttons → ["提交","想不起来？给我一点提示","回去再看一眼讲解"]  ★ 无过渡按钮
  lesson_step_result → {"section":"output","stepIndex":0,"attempts":1,"passed":true}
  对照组（同一档走「照着打一遍」放弃路径）：
    .lesson-feedback.pass 存在，buttons 含「下一句（这次没有提示）」
  ```
- **要点**：**放弃者拿到确认卡，成功者什么也没有** —— 反馈方向与激励方向相反。
- **严重度**：**P1**（体验与情感过滤：成功路径的反馈缺失，且是六段终点前的最后一击）

### 2.2 可疑但未证实

| 编号 | 现象 | 判定 |
|------|------|------|
| ST2-S1 | 中段「再看两组对错」的「最后一步：说出来」按钮**不依赖是否判过卡**（`:2960` 附近无条件渲染），两组对比题可被整体跳过 | 代码可读，未构造「用户只靠 UI 就会跳过」的完整路径 —— 记为可疑 |
| ST2-S2 | 中段 contrast 的 `stepIndex` 用 `offset + 2`（`:2938` 附近），与 practice 常规题的 `0..4` 在**同一 section 内撞号**（实测记录为 `contrast#2`、`contrast#3`，而题 3/4 也是 `#2`、`#3`） | 已实测撞号；未证实下游有按 `(section, stepIndex)` 去重的消费方 —— 记为可疑 |

### 2.3 验过没问题的部分

| 用例 | 覆盖 | 结论 |
|------|------|------|
| PASS-1 | guided 6 题逐题推进（L13 展示序 arrange/spot/choose/arrange/replace/arrange） | 题号 1→6 单调递增；每题目入口态干净（build 空、feedback null）；末题出口为「下面自己来」 |
| PASS-2 | guided 有无「上一题」/跳题 | 第 1 题无「上一题」（`buttons().some(/上一题/)===false`）；第 2 题也无；顶栏段点是纯展示 `<span>`，不可点 |
| PASS-3 | practice 5 题逐题推进 | 题号单调；末题出口「最后一步：说出来」；L13 `contrast=6>2` 故插入中段对比 |
| PASS-4 | practice 换题逐项清空 | 第 1 题故意错→改对→下一题；第 2 题 build 为空、无上一题反馈、无上一题追问入口；**miss 计数从 0 起算**（首错即出「为什么我拼的不对？」） |
| PASS-5 | recall 提示阶梯 | 错 1 次**不给**「想不起来，看答案」；错 2 次才给；揭示后输入框消失、出口「进入练习」；遥测三条 `a1/a2/a3 pfalse`，句面哈希一致 |
| PASS-6 | output 两档 + 提示阶梯 | level 0→1→2→3 逐级揭示（level 2 仍不揭示答案）；level 3 才出「照着打一遍」；**跨档后提示层级与答案揭示均重置**；第 1 档记 `free_type_hint#0` |
| PASS-7 | 中段对比卡 | 两张卡各记一条 `practice/contrast`；出口在 |
| PASS-8 | 移除词块重摆 | `arrangeRemove` 清去抖 ref → 清空后重摆可正常判通过 |
| PASS-9 | output 最后一档 | 写对后出现 `.lesson-feedback.pass` 与「完成这一课」 |
| PASS-10 | output 答错 | retry + 「为什么这句总写不对？」入口；**不揭示答案**；记 `free_type`（未用提示）+ `passed:false` |

---

## 3. 收据数字 vs localStorage 事实

### 3.1 对照表

走完整课（前测 → 看 → 跟 → 忆 → 练 → 产 → 收据）后，逐项核对：

| 收据上的数字 / 文案 | localStorage 事实来源 | 实测 | 结论 |
|---|---|---|---|
| 「第 **N** 课完成」 | `grammarLessons[{id}].number` | `第 13 课完成` ✓ | PASS-1 一致 |
| 「本季第 **i** / **t** 课」分子 | `grammarLessonsDone ∩ 本季区间` 的课数 **+ 1** | 完课瞬间 i=1（done=[]）、落盘后 i=2（done=[L13]） | PASS-2 两渲染自洽；**但已完课重进时虚报**（FAIL-1） |
| 「本季第 i / **t** 课」分母 | `season.max - season.min + 1` | 第二季 13–24 → `12` ✓ | 一致 |
| 角标点亮圆点数 | 同上（分子） | 与分子相同 ✓ / **已完课重进时同样多 1** | FAIL-1 |
| 「前测里拿不准的 **W** 处」 | `section==="pretest" && passed===false` 的 step 数 | 两题都错 → `2` ✓ | PASS-3 一致 |
| 「还差什么」列表项数 | `reviewNotes`（**笔记文本去重**，会话内 state） | 全对路径 `0` 项 | PASS-4 与 reviewNotes 自洽；**但与队列矛盾**（FAIL-2） |
| 「上面这些句子已排进复习队列，明天会自动来见你」 | `schedules.nextReviewAt > now` + `status==="new"` | 当天 `listDueGrammarReviewCards()` 返回 **0** ✓ | PASS-5 一致 |
| 「你现在能说出这些新句子」列表 | `targetSentence` + 去重后的 `variants` | 3 项 = 核心句 + 2 变体（核心句不与同文变体重复） ✓ | PASS-6 一致 |
| 「一句话」规则 + 规则行例句 | `summary.rule` / `summary.points` | 规则一致 ✓ | PASS-7 一致（但例句位有问题，见 FAIL-3） |
| 「一次通过」语义 | `grammar_lesson_completed.guidedFirstTry / practiceFirstTry` | 全程无重试 → 两者皆 `true` ✓ | PASS-10 一致 |
| 三块区块标题 | — | 「这一课掌握了什么 / 你现在能说出这些新句子 / 还差什么」 ✓ | PASS-8 一致 |
| 出口链接（趁热练 / 去复习 / 返回地图 / 挑战案） | 路由常量 + `huntCaseIds` | 全部命中目标 href ✓ | PASS-9 一致 |

### 3.2 确认的缺陷

#### [P2] ST3-FAIL-1 · 已完课重进再完课：季角标比事实大 1

- **文件:行号**：`src/pages/GrammarLessonPage.tsx:580`
  ```
  const index = Math.min(total, doneInSeason.size + 1);   // 无条件 +1
  ```
  上方注释说明「完课页出现时本课尚未写入完成态，所以手动补 1」——
  但 `markLessonDone` 落盘（`:2021` 附近）与 `setPracticeDone(true)` 同步发生，
  **+1 没有区分「本课是否已在 `grammarLessonsDone` 里」**。
- **复现步骤**
  1. 预置 `grammarLessonsDone: ["lesson-13-now"]`（模拟「学第二遍」）
  2. 进 L13 走完整课到收据
- **实际 vs 期望**
  - 期望：角标分子 = 本季真实已完课数（= 1），圆点点亮 1 个。
  - 实际：`本季第 2 / 12 课`，点亮 **2** 个 —— 本课已在集合里，+1 是纯多余。
- **证据**（`ST3 · FAIL-1`）
  ```
  done（事实）           → ["lesson-13-now"]        → doneInSeason = 1
  角标                   → 第二季 · 进阶篇本季第 2 / 12 课   ★ 应为 1 / 12
  .hero-corner-dots i.on → 2                          ★ 应为 1
  ```
  同一用例里「首次完课」路径的角标是正确的（完课瞬间 1，落盘后与集合大小自洽）——
  说明缺陷只在「本课已在集合里」时显形。
- **严重度**：**P2**（进度虚报，影响成长感知；不丢数据、不阻断流程）

---

#### [P1] ST5-FAIL-2 · 收据说「本课没有留下漏洞」，同屏又说「已排进复习队列」

- **文件:行号**：`src/pages/GrammarLessonPage.tsx:3549-3581`（「还差什么」区块）
  - `:3555` `{reviewNotes.length > 0 ? <ul>…</ul> : <p className="receipt-rule">本课没有留下漏洞——真棒。</p>}`
  - `:3576`（同块内）「上面这些句子已排进复习队列，明天会自动来见你」（**无条件渲染**）
  - `reviewNotes` 只在 `saveMistakeIfNeeded` / `revealOutput` / `revealRecall` /
    前测答错时 push —— **全程没错过题时它为空**，但完课本身仍会把核心句送进 SM-2 队列。
- **复现步骤**：进 L13 → 前测全对 → 全程一次通过（含产出段两档都用提示阶梯后**照抄通过**）→ 到收据
- **实际 vs 期望**
  - 期望：「还差什么」的说法应与复习队列的真实内容一致。
  - 实际：同一块里同时出现
    「本课没有留下漏洞——真棒。」与「上面这些句子已排进复习队列，明天会自动来见你」，
    而 `localStorage` 里确实有 1 张 `sourceId=lesson:lesson-13-now` 的卡。
- **证据**（`ST5 · FAIL-2`）
  ```
  gap 区块文本 → "本课没有留下漏洞——真棒。上面这些句子已排进复习队列，明天会自动来见你去复习"
  .receipt-points li 数 → 0
  cards(sourceId=lesson:lesson-13-now) → ["I am drawing a picture."]   ★ 队列里确实有卡
  ```
- **严重度**：**P1**（收据自相矛盾；用户会得出「本课没有需要复习的东西」的错误结论，
  而队列里明明有卡，明天真的会来）

---

#### [P1] ST3-FAIL-2 · 收据「这一课掌握了什么」把带 ❌ 的错句当范例展示

- **文件:行号**：`src/pages/GrammarLessonPage.tsx:3473-3490`
  ```
  const splitAt = point.indexOf("——");
  const example = splitAt >= 0 ? point.slice(0, splitAt).trim() : "";   // ← 前半段进 .rule-eg
  …
  {example && <span className="rule-eg">{example}</span>}                // :3488 大字范例位
  ```
  `summary.points` 里存在形如 `I was read ❌ ／ I read ❌ —— 少外套、少搭档都不行` 的条目，
  前半段**整段含错句**，被原样渲染进确证区最显眼的位置。
- **复现步骤**：预置 `grammarLessonsDone:["lesson-01-am"]` →
  进 `lesson-95-was-doing` 走完整课到收据
- **实际 vs 期望**
  - 期望：确证区（「这一课掌握了什么」）不出现错误形式；若必须对照，应有明确的「不要这样说」标记。
  - 实际：`.rule-eg` 大字位直接显示 `I was read ❌ ／ I read ❌`。
- **证据**
  - `ST3 · FAIL-2`（挂页面）：`.rule-eg` 中出现 `❌`
  - `ST3 · FAIL-2b`（语料面，纯数据）：
    ```
    受影响课程数        → 84
    受影响条目总数      → 102
    其中进 .rule-eg 位  → 101
    ```
- **严重度**：**P1**（红线相关：「确证仪式」上把错句摆在正面位置，与项目「杜绝裸错句被当示范记住」的既有纪律冲突）

### 3.3 验过没问题的部分

见 3.1 对照表右列 PASS-1…PASS-11（11 条）。补充方法说明：

- 数字核验一律「同一份事实算两次」：页面文案里的数字 vs 用 `localStorage` 重算的结果，
  不依赖页面内部 state。
- 「明天会自动来见你」这类**时间承诺**用 `listDueGrammarReviewCards(data)` 在
  完课当下求值（返回空）+ 逐卡检查 `nextReviewAt`/`intervalDays`/`reviewCount`/`lapseCount` 四字段，
  确认卡是 `status:"new"` + 全零排期（即被 `neverQueuedSchedule` 主动挡下），不是「碰巧没到期」。

---

## 4. `GrammarRevisitPage` / `GrammarReauditPage` 状态机

### 4.1 phase 转移与出口

| 页面 | phase 链 | 出口 | 结论 |
|------|----------|------|------|
| 回访 | `quiz → ambush → done` | 完成页 →「下一关：旧案重审」`/grammar/lesson/{id}/reaudit` ✓ | PASS-1 全程可达 |
| 回访 | `locked`（关 1 未完成） | 「回到正课」+「返回课程地图」；**不记 started** ✓ | PASS-7 |
| 重审 | `cases → ambush → done` | 完成页 →「返回课程地图」+「趁热练」软入口 ✓ | PASS-4 全程可达 |
| 重审 | `locked`（关 2 未完成） | 「去做回访关」+「返回课程地图」 | 已由 p5 覆盖 |
| 重审 | 「无内容可做」早退 | —— | **不可达（死代码）**，见 PASS-5 |

### 4.2 确认的缺陷

#### [P1] ST4-FAIL-1 · 已完成关 2 重进回访页：完成页显示「0 / N 题一次提取成功」

- **文件:行号**：`src/pages/GrammarRevisitPage.tsx:116`
  ```
  在快忘记的时候回来提取了一次——这一课的记忆刚被加固了一遍。{firstTryCount} / {quiz.length} 题一次提取成功。
  ```
  `firstTryCount` 是组件内 state（`:46`，初值 `0`），只在本次会话答对时自增。
- **复现步骤**
  1. 关 1 已完成 → 进 `/grammar/lesson/lesson-13-now/revisit` → 答完全部 4 题（全对）→ 答对回马枪 → 完成
  2. **重进同一 URL**
- **实际 vs 期望**
  - 期望：完成页回显**历史事实**（上一轮 4/4）。
  - 实际：`0 / 4 题一次提取成功` —— 用户看到「我上次一道都没答上」。
- **证据**（`ST4 · FAIL-1`）
  ```
  第一轮 grammar_revisit_completed → { "firstTryCount": 4, "totalCount": 4, "ambushFirstTry": false }
  重进页面文本                     → "0 / 4 题一次提取成功"        ★ 应为 4 / 4
  ```
  与 st4 同源的另一面：st3 的 `ST3 · FAIL-1` 是「分子虚大 1」，这是「分子虚小到 0」——
  两处都是**把会话内 state 当成历史事实**渲染。
- **严重度**：**P1**（数据回显错误，直接打击「回访有效」的确证感）

---

#### [P1] ST4-FAIL-2 · StrictMode 下回访 / 重审的 started 事件各重复上报（2 条）

- **文件:行号**
  - 回访：`src/pages/GrammarRevisitPage.tsx:69-74`（**渲染期间**副作用 + `setStartedLogged`）
    ```
    if (lock.state !== "locked" && !startedLogged) {
      appendGrammarEvent({ kind: "grammar_revisit_started", … });
      setStartedLogged(true);        // ← 渲染期 setState，当次渲染内 guard 不生效
    }
    ```
  - 重审：`src/pages/GrammarReauditPage.tsx:73-76`（渲染期写 `startedLoggedRef`）
- **复现步骤**：以 `main.tsx` 同构（`<StrictMode>` + `AppProvider` + `MemoryRouter`）挂载两页
- **实际 vs 期望**
  - 期望：一次进入记 1 条。
  - 实际：**2 条**。生产环境 `src/main.tsx:7` 就是 `<React.StrictMode>` 包裹 —— 这不是测试专有现象。
- **证据**（`ST4 · FAIL-2` / `FAIL-2b`）
  ```
  ★ 缺陷：StrictMode 下回访 started 事件 2 条（分母翻倍）
  ★ 缺陷：StrictMode 下重审进入事件 2 条
  对照：非 StrictMode 两页均为 1 条
  两条均为 {"lessonId":"lesson-13-now","hoursSinceStage1":0}
  ```
- **严重度**：**P1**（回访率 / 重审到达率的**分母系统性翻倍**，是 F1 三关卡漏斗的核心指标）

---

#### [P2] ST4-FAIL-3 · `ambushFirstTry` 永远是 false（与同路径 `ambush_result` 矛盾）

- **文件:行号**：`src/pages/GrammarRevisitPage.tsx:184-204` 与 `:139`
  ```
  const pickAmbushToken = (tokenIndex) => {
    const attempts = ambushAttempts + 1;
    setAmbushAttempts(attempts);        // ① 排队更新 state
    …
    if (passed) {
      setAmbushDone(true);              // ② 排队更新 state
      finishRevisit();                  // ③ 同一处理函数里立即调用
    }
  };
  // finishRevisit 读的是**本次渲染闭包**里的值：
  ambushFirstTry: ambush ? ambushAttempts <= 1 && ambushDone : null
  ```
  首次命中时闭包值恒为 `ambushAttempts = 0`、`ambushDone = false` → 表达式恒 `false`。
- **复现步骤**
  1. 关 1 已完成 → 进回访 → 答完全部题 → 进回马枪
  2. **第一次就点中**正确的那个词块
- **实际 vs 期望**
  - 期望：`ambushFirstTry: true`。
  - 实际：`false`。同一秒写入的两条事件互相矛盾。
- **证据**（`ST4 · FAIL-3` / `FAIL-3b`）
  ```
  grammar_ambush_result      → {"attempts":1,"passed":true}        ← 事实：一次命中
  grammar_revisit_completed  → {"ambushFirstTry":false}            ★ 应为 true
  —— 先错后对（attempts 1/false → 2/true）——
  grammar_revisit_completed  → {"ambushFirstTry":false}            ★ 该字段没有 true 分支
  ```
- **严重度**：**P2**（指标恒 0% —— 护栏「回马枪一次命中率」在数据上无法验证；
  但因无 UI 呈现，用户不可见，故列 P2 而非 P1。若该字段已进入 PRD 验收口径，应上调 P1）
- **修复提示**：用局部变量（`const attempts = ambushAttempts + 1`）传给 `finishRevisit(attempts, true)`，
  或把 `finishRevisit` 移到 `useEffect` 里读更新后的 state。

### 4.3 可疑但未证实

| 编号 | 现象 | 判定 |
|------|------|------|
| ST4-S1 | 回访中途退出**没有任何退出遥测**（`lesson_exit` 计数为 0），退出点不可观测 | 已实测「0 条」；是否需补是产品决策，记为盲区而非缺陷 |
| ST4-S2 | 回访中途退出**不保留进度**（重进从第 1 题开始），且每次重进再加一条 `started` | 已实测；与「进入即记」口径自洽，但是否符合「次日回访」的预期未证实 |

### 4.4 验过没问题的部分

| 用例 | 方法 | 结论 |
|------|------|------|
| PASS-2 | 走完回访全流程，核对 `totalCount` / `firstTryCount` / `durationMs` | 与答题事实一致（`ambushFirstTry` 除外，见 FAIL-3） |
| PASS-4 | 3 案全部按数据解开 + 回马枪 → 三关全过 | phase 链完整；`grammarLessonStagesDone` 写入 `[1,2,3]` |
| PASS-5 | 全库 195 课扫描 `buildStage3CasePlan` | **空案数为 0** → 页面「本课暂无可重审的案件 + 跳过此关」是死代码 |
| PASS-6 | 未知课 id 挂重审页 | 「课程不存在」空态 + 返回地图出口，不白屏 |
| PASS-7 | 关 1 未完成挂回访页 | 锁态文案 + 出口；**不记 started**（口径正确） |
| PASS-8 | StrictMode 下两页各走完一次完关 | **不白屏**（上一轮修的 hooks 少调用未复发），完成页与出口都在 |
| PASS-9 | 全库扫描回访题面与答案同源 | cloze 填回占位符 == 答案；rebuild 词块多重集 == 答案分词 —— **零不匹配** |
| PASS-10 | 全库扫描回马枪题目自洽 | 195 课全部出得了题；`tokenIndex` 不越界、罪名非空、命中位置有词块 |
| PASS-11 | 重审罪名按钮与数据标签同源 | 所有植错点都能找到对应罪名按钮，按数据可解开案件 |

### 4.5 关于上一轮「revisit 完关白屏」的复查

上一轮修的是 `revisitWhy` 的 useMemo 位置（现在在 `GrammarRevisitPage.tsx:101-105`，
已在所有提前 return 之前）。复查结论：**修复有效且完整**。
- StrictMode 下走完回访完关 → DOM 非空、出现「回访完成」（PASS-8）
- 重审页的 useMemo 全部在早退之前，**未受该缺陷影响**（PASS-8 第二条已实测）

---

## 5. 重复进入与幂等

### 5.1 确认的缺陷

#### [P1] ST5-FAIL-1 · StrictMode 下 `lesson_exit` 重复上报：挂载即记一条假退出

- **文件:行号**：`src/pages/GrammarLessonPage.tsx:829-844`
  ```
  useEffect(() => {
    return () => {
      …
      appendGrammarEvent({ kind: "lesson_exit", …, section: exitStateRef.current.section, … });
    };
  }, [lessonKey]);
  ```
  StrictMode 会「挂载 → 立即卸载 → 再挂载」，于是**用户什么都没做就已记录一次退出**；
  真正卸载时再记一条。
- **复现步骤**：StrictMode 下挂载课程页，观察遥测；卸载后再看
- **实际 vs 期望**
  - 期望：一次进入 → 一次退出（只在真正卸载/离开时）。
  - 实际：**2 条**，且第一条的 `section` 恒为 `pretest`、`dwellMs ≈ 0`。
- **证据**（`ST5 · FAIL-1`）
  ```
  仅挂载后 → lesson_exit 条数 = 1                        ★ 用户什么都没做
            {"section":"pretest","stepIndex":0,"dwellMs":<1000}
  卸载后   → lesson_exit 条数 = 2                        ★ 一次进入共 2 条
  对照（非 StrictMode）：挂载 0 条 → 卸载 1 条 ✓
  ```
- **影响**：「在哪一段退出」的漏斗被灌入一批虚假的 `pretest` 退出 ——
  正课漏斗的最大盲区（ux-optimization 文档的原话）因此**反而被污染**。
- **对照**：同一个 effect 里 `grammar_lesson_started` **有** ref 守卫（`startedLessonRef`），
  StrictMode 下只记一条（`ST5 · PASS-5` 已实测）—— 说明这是遗漏，不是有意取舍。
- **严重度**：**P1**（退出率分母翻倍 + section 分布失真）

### 5.2 验过没问题的部分

| 用例 | 方法 | 结论 |
|------|------|------|
| PASS-1 进度幂等 | 反复进出 3 轮 → 完课 | `grammarLessonsDone` 只 1 份；`grammarLessonStagesDone[id]` = `[1]` |
| PASS-2 卡片幂等 | 完课 → 重学 → 再完课 | 本课卡数**不变**；句面无重复 |
| PASS-3 纯函数幂等 | `markLessonDone` / `markLessonStageDone` / `addLessonCoreSentence` 各调两次 | 全部幂等；关 2/3 **不写**旧「完课」字段；未知课 id 原样返回 |
| PASS-4 错句入队幂等 | `addLessonMistakeSentence` 同句同课两次 / 同句异课 | 同课只 1 份；异课各 1 份；空句不写 |
| PASS-5 started 去重 | StrictMode + 非 StrictMode | 均只 1 条（ref 守卫有效） |
| PASS-6 完课去重 | 已完课重进 | 不写第二条 `grammar_lesson_completed`；显示「趁热练」、不弹续学 |
| PASS-7 快照幂等 | 反复「推进→退出」3 轮 | `localStorage` 只 1 个 `grammar:resume:<id>` 键；`practiceIndex` 指向最后进度（3）；`savedAt` 合法 ISO |
| PASS-8 重复答错 | 同题连续错两次再答对 | 同句只入队 1 张卡 |
| PASS-9 换课不继承 | L12 完课 → 挂 L13 | L13 回到课前测，不显示 L12 收据（印证 `App.tsx:74-77` 的 `key={lessonId}` 有效） |

---

## 6. 汇总：确认的缺陷清单

| 编号 | 文件:行号 | 现象 | 严重度 |
|------|-----------|------|--------|
| FAIL-1（st1） | `GrammarLessonPage.tsx:1162-1175` | `gotoStage("practice")` 未清 `practiceOrder` → 回段第 1 题摆着上一题答案、5 块禁用、无出口 | **P0** |
| FAIL-2（st1） | `GrammarLessonPage.tsx:1307` + `:1124-1178` | `lastJudgedLengthRef` 跨段残留 → 引导段首题 arrange 拼满不判题、无出口；**82 课可命中** | **P0** |
| FAIL-3（st1） | `GrammarLessonPage.tsx:992-998` | `resetGuided` 未清 `guidedOrder` → 引导段答对后回讲解再回段：拼装序残留 + 出口全无 | **P0** |
| FAIL-3b（st1） | 同上 | 未答完就回讲解：回段后拼装序残留（脏初始态） | P1 |
| FAIL-4（st1） | `GrammarLessonPage.tsx:1307` | 答对后误点词块 → 出口消失；同一题被判两次（`a1` + `a2`） | P1 |
| FAIL-1（st2） | `GrammarLessonPage.tsx:1638-1644` | output 第 1 档凭自己写对 → 静默换句、无反馈（放弃路径反而有完整反馈） | P1 |
| FAIL-1（st3） | `GrammarLessonPage.tsx:580` | 季角标无条件 `+1` → 已完课重进再完课虚报 1 课 | P2 |
| FAIL-2（st3） | `GrammarLessonPage.tsx:3473-3490` | 收据「掌握了什么」把含 ❌ 的错句当范例；**84 课 / 102 条**受影响 | P1 |
| FAIL-1（st4） | `GrammarRevisitPage.tsx:116` | 已完成关 2 重进：完成页「0 / N 题一次提取成功」 | P1 |
| FAIL-2（st4） | `GrammarRevisitPage.tsx:69-74`、`GrammarReauditPage.tsx:73-76` | StrictMode 下 started 各记 2 条（生产即 StrictMode）→ 回访/重审分母翻倍 | P1 |
| FAIL-3（st4） | `GrammarRevisitPage.tsx:139` | `ambushFirstTry` 恒 false（闭包读更新前 state）→ 指标结构性 0% | P2 |
| FAIL-1（st5） | `GrammarLessonPage.tsx:829-844` | StrictMode 下挂载即记一条假 `lesson_exit` → 退出率翻倍 + section 失真 | P1 |
| FAIL-2（st5） | `GrammarLessonPage.tsx:3549-3581` | 收据「没有留下漏洞」与「已排进复习队列」同屏矛盾（队列里确有卡） | P1 |

## 7. 可疑但未证实

1. **ST2-S1** 中段「再看两组对错」的出口按钮不依赖是否判过卡 → 两组对比题可整体跳过（代码可读 + 出口实测常在，但未构造「用户只靠 UI 就会跳过」的完整路径）。
2. **ST2-S2** contrast 的 `stepIndex` 与 practice 常规题**在同 section 内撞号**（实测 `contrast#2/#3` vs 题 3/4 的 `#2/#3`）；未证实下游有按 `(section, stepIndex)` 去重的消费方。
3. **ST4-S1** 回访中途退出零遥测（`lesson_exit` = 0），退出点不可观测。
4. **ST4-S2** 回访中途退出不保留进度，且每次重进再加一条 `started`。

## 8. 新增测试文件与运行结果

全部位于 `src/edge/verify/`：

| 文件 | 用例数 | 结果 |
|------|--------|------|
| `st1-stage-residue.test.tsx` | 10 | ✓ 全通过 |
| `st2-substep-boundaries.test.tsx` | 11 | ✓ 全通过 |
| `st3-receipt-fidelity.test.tsx` | 14 | ✓ 全通过 |
| `st4-revisit-reaudit.test.tsx` | 16 | ✓ 全通过 |
| `st5-reentry-idempotency.test.tsx` | 11 | ✓ 全通过 |
| **合计** | **62** | **62 passed** |

运行命令与输出：

```
$ npx vitest run src/edge/verify/st1-stage-residue.test.tsx \
    src/edge/verify/st2-substep-boundaries.test.tsx \
    src/edge/verify/st3-receipt-fidelity.test.tsx \
    src/edge/verify/st4-revisit-reaudit.test.tsx \
    src/edge/verify/st5-reentry-idempotency.test.tsx

 ✓ src/edge/verify/st4-revisit-reaudit.test.tsx (16 tests) 561ms
 ✓ src/edge/verify/st1-stage-residue.test.tsx (10 tests) 1148ms
 ✓ src/edge/verify/st2-substep-boundaries.test.tsx (11 tests) 1590ms
 ✓ src/edge/verify/st5-reentry-idempotency.test.tsx (11 tests) 1687ms
 ✓ src/edge/verify/st3-receipt-fidelity.test.tsx (14 tests) 2876ms

 Test Files  5 passed (5)
      Tests  62 passed (62)
```

命名约定沿用项目既有纪律（见 `src/edge/verify/jd10-defects.test.ts`）：
`FAIL-` 前缀 = 已确认缺陷，断言写成「缺陷仍然存在」，**修好后用例会失败**、提醒翻转断言；
`PASS-` 前缀 = 验过没问题的方向。所有页面驱动都走真实 UI 出口，断言从 DOM 或
`localStorage` 读回，不读页面内部 state。

### 全量回归

```
$ npx vitest run src/edge/
 Test Files  8 failed | 85 passed (93)
      Tests  16 failed | 920 passed (936)
```
16 条失败**全部落在另一位 agent 并发编写的无障碍 / 键盘文件**中
（`a11y1-focus-loss`、`ix3-return-focus`、`kb1/kb4/kb5/kb8`、`e6-5`、`dg4-drag-boundaries`），
均为其本轮新增的 willing-to-fail 断言或焦点相关改动，**与本报告新增的 5 个文件无关**
（这 5 个文件在上述全量运行中均为 ✓）。

值得注意的交叉印证：`kb4-arrange-keyboard.test.tsx` 的 **KB4-6** 从「橡皮擦 vs 点击」
两条等价路径记录了与本报告 **st1 FAIL-4** 同源的现象。

## 9. 附录

### A. 验证用固定数据

- 主课：`lesson-13-now`（L13「正在做什么」）—— 有 `recall`、`practice` 5 题、
  `contrast` 6 组、`huntCaseIds` 2 个、引导段展示序 `arrange/spot/choose/arrange/replace/arrange`（首题 5 词 arrange）
- 收据错句样本：`lesson-95-was-doing`（`summary.points` 含 `I was read ❌ ／ I read ❌`）
- 前置「已完课」：`lesson-01-am`（关掉首课导览化 `isFirstEverLesson`）

### B. 关键源码位置（本报告引用的全部行号）

```
GrammarLessonPage.tsx
  :580        seasonProgress 的 index = doneInSeason.size + 1（ST3-FAIL-1）
  :829-844    lesson_exit 清理函数（ST5-FAIL-1）
  :992-998    resetGuided（缺 setGuidedOrder）
  :1124-1178  gotoStage（practice 两条分支都缺 setPracticeOrder；全程未重置 lastJudgedLengthRef）
  :1307       arrangeAdd 的重判条件（≥答案词数 && 长度变化）
  :1313-1322  arrangeRemove（唯一清去抖 ref 的交互路径之一）
  :1610-1653  submitOutput（:1639 advanceOutputStep 后直接 return）
  :3473-3490  收据规则行 example → .rule-eg
  :3549-3581  「还差什么」区块（reviewNotes vs 队列提示）
GrammarRevisitPage.tsx
  :46         firstTryCount 初值 0
  :69-74      渲染期 started 上报（setStartedLogged）
  :101-105    revisitWhy useMemo（上一轮白屏修复点，位置正确）
  :116        完成页回显 firstTryCount
  :184-204    pickAmbushToken（同函数内先 setState 再 finishRevisit）
  :139        ambushFirstTry 读闭包 state
GrammarReauditPage.tsx
  :49         phase
  :73-76      渲染期 reaudit_started 上报
```

### C. 硬约束复查（零术语 / Affective Filter）

本轮所有新用例的**页面文案断言**均未引入新术语；顺带复查了新增用例触及的文案：
- 产出/忆段反馈、收据文案、回访/重审文案均无「主语/谓语/时态/原声」等术语；
- 无限时 / 排名 / 体力值相关断言（挑战段实测文案为「挑战不计时、不扣分」，与约束一致）。

> 唯一与「Affective Filter」相关的新发现是 **ST3-FAIL-2**（确证区展示 ❌ 错句）——
> 这不是用词问题，而是**把错误形式放在正面位置**，与项目「杜绝裸错句被当示范记住」的
> 既有纪律冲突，建议按 P1 处理。

### D. 并发编辑造成的瞬时崩溃（不作为缺陷计数）

验证期间另一位 agent 在改同一文件，期间 `shasum` 观察到两次不同修订，其中一次出现
```
ReferenceError: Cannot access 'practiceIndex' before initialization
  at GrammarLessonPage src/pages/GrammarLessonPage.tsx:656
```
（`useReturnFocus` 的调用被放在了 `const [practiceIndex]` 声明之前 —— TDZ）。
该状态在数十秒内被下一修订修好（`quizCardRef` / `stageRef` 移到了 state 之后），
**最终基线哈希下页面正常**（62 个用例全通过，其中包含大量挂载即断言）。
若后续仍有别的 agent 并发改此文件，建议以本报告 §0 的哈希为准重新跑一遍 5 个文件。
