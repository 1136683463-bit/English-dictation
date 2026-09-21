# SM-2 间隔重复算法正确性审计报告

审计对象：`src/services/reviewService.ts`（SM-2 核心）、`src/services/grammarReviewService.ts`（会话组装）、
`src/services/storage.ts`（归一化）、`src/types.ts`（`Schedule` / `Card` / `Rating`）。

复现测试：`src/edge/verify/sm1-transitions.test.ts`、`sm1b-ui-crash.test.tsx`、`sm2-fidelity.test.ts`、
`sm3-recovery.test.ts`、`sm4-session.test.ts`、`sm5-robustness.test.ts`、`sm6-cross.test.ts`、
`sm7-reachability.test.tsx`、`sm8-mastered-loop.test.ts`（共 **107 个断言，全部通过**）。
未修改 `src/` 下任何产品代码。

> **审计期间工作树被并发编辑**（`git status` 显示 `reviewService.ts`、`grammarReviewService.ts`、
> `storage.ts`、`types.ts` 等 30+ 文件处于 modified 状态，`grammarReviewService.ts` 的 mtime 晚于
> 本次审计开始时间）。已发现的 2 处缺陷在审计过程中被第三方修改修掉（见 §6「审计期间已修复」），
> 本报告的所有结论与行号**以报告撰写时刻的工作树为准**，并已对两处修复做了回归保护测试。

---

## 结论摘要

| 编号 | 问题 | 严重度 | 状态 |
|---|---|---|---|
| D1 | 连续 rating 4 使 `intervalDays` 指数爆炸 → `addDays` 抛 `RangeError`，整页崩溃且卡死 | **P0** | 确认的缺陷 |
| D2 | 语法 rating 3 分支不放大 + 不更新 ease → 卡永远停在 1 天，`reviewCount` 无限增长 | **P1** | 确认的缺陷 |
| D3 | `markCardsPriority` 写 `priority:true` 但不写 `prioritySource` → 手动重点被当系统卡自动摘星 | **P1** | 确认的缺陷 |
| D4 | `normalizeCard` 丢弃 `prioritySource` / `suspendedFrom` / `mistakeGraduatedAt` → 每次落盘永久丢失 | **P1** | 确认的缺陷 |
| D5 | `priorityManual` 与 `prioritySystem` 对 `source === undefined` 的卡双计，两阵营计数之和 > priority | **P2** | 确认的缺陷 |
| D6 | mastered 语法卡仍进复习会话，且（配合新 `keepsMasteredStatus`）形成不可降级循环 | **P2** | 确认的缺陷 |
| D7 | `diversifyReviewModes` 贪心不回溯：**有解**时仍有 28–31% 的输入残留相邻同型 | **P2** | 确认的缺陷（设计局限） |
| D8 | `normalizeSchedules` 有下限无上限：`intervalDays=1e9` / `easeFactor=1e308` 原样通过 | **P2** | 确认的缺陷（加固缺口） |
| D9 | `easeFactor = NaN`（未归一化路径）→ rating 3/4 抛 `RangeError` | **P2** | 确认的缺陷 |
| I1 | `interleaveBySource` 的 while 上界**不会丢卡**（穷举 24 张内所有分布，0 反例） | — | 不变量成立 |
| I2 | `summarizeGrammarMastery` 三计数之和恒等于 `total` | — | 不变量成立 |
| I3 | `prioritySource === "manual"` 的卡确实永不被自动摘星 | — | 不变量成立 |
| I4 | 「相邻不同源」在单源/独占分布下**不可能**成立（数学上无解，非缺陷） | — | 不变量有条件成立 |
| N1 | 语法卡 rating 3 不放大间隔（R09 Step1） | — | 有意设计 |
| N2 | ease 上限 3.2 生效；下限 1.3 在 rating 1/2 分支生效 | — | 有意设计 |
| N3 | rating 3 用旧 ease、rating 4 用新 ease 相乘（顺序不一致） | — | 有意设计（规格未规定） |

---

## 第 1 条 · 算法自洽性

### 1.1 状态迁移表（rating × 当前状态 → 新状态）

公式来源 `reviewService.ts:440-463`（四个分支：`rating===1` :440 / `===2` :445 / `===3` :449 / else :459）。
`intervalDays` 列是落盘值，`+Nd` / `+10min` 是 `nextReviewAt` 的实际偏移。

**word / phrase 卡（非语法句卡）**

| 当前态 | rating | 新 ease | 新 intervalDays | nextReviewAt | lapseCount |
|---|---|---|---|---|---|
| ease 2.5, i=0 | 1 | 2.25 | 0 | **+10min** | +1 |
| ease 2.5, i=0 | 2 | 2.40 | 1 | +1d | 不变 |
| ease 2.5, i=0 | 3 | 2.50 | 3（`max(1, round(1×2.5))`） | +3d | 不变 |
| ease 2.5, i=0 | 4 | 2.62 | 3（`max(3, round(1×2.62×1.3))`） | +3d | 不变 |
| ease 2.5, i=3 | 3 | 2.50 | 8 | +8d | 不变 |
| ease 2.5, i=3 | 4 | 2.62 | 10 | +10d | 不变 |
| ease 1.3, i=30 | 1 | 1.30（下限） | 0 | +10min | +1 |
| ease 1.3, i=30 | 2 | 1.30（下限） | 1 | +1d | 不变 |
| ease 1.3, i=30 | 3 | 1.30 | 39 | +39d | 不变 |
| ease 1.3, i=30 | 4 | 1.42 | 55 | +55d | 不变 |
| ease 3.2, i=100 | 1 | 2.95 | 0 | +10min | +1 |
| ease 3.2, i=100 | 3 | 3.20（上限） | 320 | +320d | 不变 |
| ease 3.2, i=100 | 4 | 3.20（上限） | 416 | +416d | 不变 |

**语法句卡（`type === "sentence" && tags.includes("语法")`）**

| 当前态 | rating | 新 ease | 新 intervalDays | nextReviewAt |
|---|---|---|---|---|
| ease 2.5, i=0 | 3 | 2.50 | **1** | +1d |
| ease 2.5, i=3 | 3 | 2.50 | **3**（原样，不放大） | +3d |
| ease 2.5, i=30 | 3 | 2.50 | **30**（原样） | +30d |
| ease 2.5, i=3 | 4 | 2.62 | 10（正常放大） | +10d |
| ease 2.5, i=30 | 4 | 2.62 | 102 | +102d |

语法卡的 rating 1/2 分支与非语法卡完全相同。

**边界结论**
- `easeFactor` 下限 1.3：rating 1（`-0.25`）与 rating 2（`-0.1`）分支都用 `Math.max(1.3, …)` 守住。
  连续 20 次 rating 1 后稳定停在 1.3（sm1 已验证）。rating 3 **不触碰** ease；rating 4 只加不减。
- `easeFactor` 上限 3.2：连续 rating 4 时第 6 次触顶并稳定（轨迹 `2.62 → 2.74 → 2.86 → 2.98 → 3.10 → 3.20`）。
  **上限真实生效**，ease 本身不溢出。
- rating 3 与 rating 4 在相同起始 `intervalDays` 上满足 `i4 >= i3`（sm1 对 `i ∈ {0,1,2,3,7,30,100}` 全部验证）——**无单调性违反**。

### 1.2 D1（P0）：连续 rating 4 → intervalDays 指数爆炸 → `RangeError` 崩溃

**文件:行号**：`src/services/reviewService.ts:56`（`addDays`）、`reviewService.ts:459-462`（rating 4 乘法分支）

```ts
const addDays = (days: number) => new Date(Date.now() + days * DAY_MS).toISOString();   // :56
...
easeFactor = Math.min(3.2, easeFactor + 0.12);                                          // :460
intervalDays = Math.max(3, Math.round((intervalDays || 1) * easeFactor * 1.3));         // :461
nextReviewAt = addDays(intervalDays);                                                   // :462
```

**数学推演**：ease 第 6 次触顶 3.2 后，rating 4 的乘数固定为 `3.2 × 1.3 = 4.16`。
`intervalDays` 序列（sm1 实测打印）：

```
r1=3  r2=11  r3=41  r4=159  r5=641  r6=2667  r7=11095  r8=46155
r9=192005  r10=798741  r11=3322763  r12=13822694  r13=57502407
第 14 次抛错: RangeError: Invalid time value
```

第 14 次 `intervalDays = 57502407 × 4.16 ≈ 239,210,013` 天，`Date.now() + 239210013 × 86400000 ≈ 2.07e16 ms`，
超出 `Date` 的合法范围 `±8.64e15 ms`，`new Date(ms).toISOString()` 抛 `RangeError`（sm1 单独验证了这一点）。

**UI 层复现（sm1b，ReviewPage）**

```
SM1-g 每次点击后的落盘状态: #1 i=3 rc=1  #2 i=11 rc=2  #3 i=41 rc=3
  #4 i=159 rc=4  #5 i=641 rc=5  #6 i=2667 rc=6  #7 i=11095 rc=7
  #8 i=46155 rc=8  #9 i=192005 rc=9  #10 i=798741 rc=10
  #11 i=3322763 rc=11  #12 i=13822694 rc=12  #13 i=57502407 rc=13
  #14 i=57502407 rc=13  #15 i=57502407 rc=13  #16 … #20 i=57502407 rc=13
SM1-g 捕获到的未处理异常: RangeError: Invalid time value ×14
```

**真实后果（用户看到什么）**：
1. 第 13 次评分落盘 `intervalDays = 57,502,407`（到期日 `nextReviewAt` 是**公元 159462 年**的合法 ISO 字符串，
   所以能被存下来，没有任何告警）。
2. 第 14 次点「熟练」时 `applyReview` 抛 `RangeError`，错误从 `ReviewPage.tsx:168 submitRating` →
   `onClick`（`ReviewPage.tsx:546`）抛到 React 事件回调外，经 `reportError` 上报。
   **项目没有任何 ErrorBoundary**（`p4-revisit.test.tsx:197` 明确记录「项目无 ErrorBoundary」）。
3. 该次评分完全不生效（`reviewCount` 停在 13），并且**之后每次点「熟练」都抛同一个错**——
   卡死在复习页，无法推进、无法离开队列（除非手动撤销或清数据）。
4. 同一张卡的 interval 已排到 15 万年之后，`nextReviewAt` 语义上早已越界。

**可达性（sm7 精确界定）**
- **默认**到期队列（`/review` 无参数）：评一次即离开队列，同一张卡无法被反复评分 → 不会触发。
- **定向训练**可达：词库详情页「练这张」→ `/review?cards=<id>`（`LibraryPage.tsx:1052`）；
  错词本「练这几个词」→ `/spelling?cards=…`；「全量复刷」`scope=all`（`SpellingPage.tsx:103`）。
  sm7 实测：定向模式下连点 16 次「熟练」，捕获 6 个 `RangeError`，`reviewCount` 停在 13。
- 键盘 `1/2/3/4` 评分（`ReviewPage.tsx:142-144`）走同一条路径，同样可达。

**为什么这是非故意偏离**：标准 SM-2 没有最大间隔，但真实实现（Anki）一律配 `maximum interval`
（默认 36500 天）兜底。本项目 `normalizeSchedules` / `applyReview` 都没有任何上限，
且 `Math.max(3, …)` 只设下限。sm2-e 里 `Math.min(57502407, 36500) === 36500` 给出对照。

**修复方向**：在 rating 3/4 分支加 `Math.min(MAX_INTERVAL_DAYS, …)`（如 36500），
并在 `normalizeSchedules` 里同样夹住 `intervalDays`。

### 1.3 D2（P1）：语法卡 rating 3 分支的「不放大」使卡永久停在 1 天

**文件:行号**：`src/services/reviewService.ts:449-458`

```ts
} else if (rating === 3) {
  const isGrammarSentenceCard = card.type === "sentence" && card.tags.includes("语法");
  if (isGrammarSentenceCard) {
    intervalDays = Math.max(1, intervalDays || 1);   // :454 —— 既不加 ease 也不乘，纯粹"维持"
  } else {
    intervalDays = Math.max(1, Math.round((intervalDays || 1) * easeFactor));
  }
```

**数学推演**：当 `intervalDays ≥ 1` 时该分支退化为恒等式 `intervalDays = intervalDays`。
sm1 实测：语法卡以 `intervalDays = 1` 起连续 10 次 rating 3，`intervalDays` **恒为 1**，
而 `reviewCount` 从 1 涨到 10（`sm1-c` 用例打印 `intervalDays: 1, reviewCount: 10`）。

**真实后果（用户看到什么）——「同一张卡每次都出现」**：
语法复习页把 rating 3 判给「尝试多次后通过」（`GrammarReviewPage.tsx:29-32`：
`attempts <= 1 ? 4 : 3`）。于是**只要用户每次都要试两三次才答对**，这张卡：
- `intervalDays` 永远 = 1 → 天天到期 → **每天都会出现在复习会话里**；
- `ease` 永远 = 2.5（rating 3 不更新 ease，rating 1 才 -0.25）→ 唯一的逃生通道是某次「一次通过」（rating 4）；
- 一旦某次 rating 4 命中，间隔立刻跳到 10 天以上（`ease 2.62 × 1.3`）。
  sm1-e 实测：`[4,4,4]` → `interval 41`；`[3,3,3]` → `interval 1`。**两者相差 41 倍**。

即「一次答对」（rating 4）与「试三次答对」（rating 3）之间的间隔差距**不是成比例，而是量级差异**：
前者指数增长，后者完全冻结。这既是「试一次答对比试多次答对间隔长得不成比例」，
也是「让用户反复看到同一张卡」——两个方向的问题同时成立，只是发生在**不同用户**身上：
- 总是试错的用户：一天一次，永远刷同一张（间隔冻结）；
- 总是答对的用户：三周内就排到 41 天（间隔爆炸，见 D1 的同一根乘法）。

代码注释（`reviewService.ts:450-451`）声明「间隔维持原样（不变短也不拉长），防止未掌握卡被排远」，
**这条注释与实现一致**，所以「不放大」本身是有意设计（N1）。但「不放大」附带的设计缺口——
**没有任何让间隔在多次 rating 3 后缓慢增长的机制**——没有被任何注释或 PRD 声明，
从 sm1-e 的 41 倍差距看属于**未预料的副作用**。建议：多次 rating 3 后按 `+1 天` 递增，
或引入独立的 `streak` 计数在连续 3 次 rating 3 后允许一次放大。

### 1.4 D2 的次生效应：rating 3 不更新 ease

`applyReview` 只在 rating 1/2/4 分支写 `easeFactor`，rating 3 分支完全不写（`:452-458` 无 ease 赋值）。sm1-e 验证：语法卡 rating 3 后 `easeFactor` 保持 2.5 不变。
后果：语法卡的 ease 只被 rating 1（-0.25）单向下压、被 rating 4（+0.12）单向上抬，
**rating 3 既表达「我记得」又不参与难度建模**。属有意设计（与 N1 同源），无独立缺陷，但记录在案。

---

## 第 2 条 · 移植保真度

参照物 A：本项目自订规格 `PERSONAL_VOCAB_PRODUCT_PLAN.md` §9「复习算法」（忘记 10 分钟后 / 模糊 1 天 / 记得 `interval × ease` / 熟练 `interval × ease × 1.3`）。
参照物 B：标准 SM-2（Woźniak）：`q∈0..5`，`EF' = EF + (0.1 − (5−q)(0.08 + (5−q)0.02))`，下限 1.3 **无上限**；
`n=1→I=1`、`n=2→I=6`、`n≥3→I(n)=round(I(n−1)·EF')`；失败 `n` 归零、`I` 归 1。

### 2.1 有意偏离（非缺陷）

| # | 偏离 | 位置 | 声明处 |
|---|---|---|---|
| N1 | 语法句卡 rating 3 不放大间隔 | `reviewService.ts:452-454` | 代码注释 R09 Step1 |
| N2 | ease 上限 3.2（标准 SM-2 无上限） | `reviewService.ts:460` | — |
| N3 | rating 4 先更新 ease 再用**新** ease 相乘 | `reviewService.ts:460-461` | — |
| N4 | 6 档质量压缩为 4 档；ease 用固定差量（−0.25/−0.10/+0.12）而非标准公式 | `reviewService.ts:440-460` | `PERSONAL_VOCAB_PRODUCT_PLAN.md` §9 的 4 行表 |
| N5 | 无「n=1→1 天、n=2→6 天」固定阶梯，全靠乘法 | 同 N3 | — |
| N6 | mastered 判据是「rating=4 且 reviewCount≥4」（标准 SM-2 无此概念） | `reviewService.ts:21-22` | — |
| N7 | 所有分支有硬下限（interval 最少 1 / 3 天），无标准 SM-2 的「重置到 1 天」 | `reviewService.ts:455/461` | — |

实测对照（sm2 全部通过）：
- `interval=3, ease=2.5, rating=3` → **8**（`round(3×2.5)`，与自订规格一致）
- `interval=3, ease=2.5, rating=4` → **10**。此处旧 ease 与新 ease 巧合同值（`round(3×2.5×1.3)=round(3×2.62×1.3)=10`）；
  `interval=7` 时分叉：实现给 **24**，按规格字面（旧 ease）应是 **23** —— **1 天级的有意偏离**（sm2-b 打印 `{impl:24, literalSpec:23, withNewEase:24}`）。

### 2.2 非故意偏离（已判定为缺陷，详见对应条目）

| 偏离 | 条目 |
|---|---|
| 无 maximum interval 兜底 → interval 溢出 Date 范围并崩溃 | **D1（P0）** |
| `intervalDays=0` 被两个语义复用（「从未排期」vs「rating1 后 10 分钟再来」） | 审计期间已修复，见 §6 |
| 语法卡 mastered 不降级（新逻辑）与 standard 的失败即重置相冲突 | **D6（P2）** |

### 2.3 无单调性违反

sm1 对所有起始 `intervalDays ∈ {0,1,2,3,7,30,100}` 验证 `rating4 的 interval >= rating3 的 interval`。
`i=0/1` 时两者都是 3（平局，仍不违反）；`i=3` 时 10 vs 8；`i=100` 时 341 vs 250（sm1-a 通过）。
**结论：不存在「答得更好反而间隔更短」。**

### 2.4 ease 溢出与下限的完整结论

- 上限 3.2 **真实生效**（sm1-b 轨迹第 6 次触顶后稳定）——**不是**缺陷。
- 下限 1.3 在 rating 1/2 分支生效（连续 20 次 rating 1 → 1.3）。
- 若存量数据的 `easeFactor < 1.3`（`normalizeSchedules` 已挡在主线外），rating 4 分支
  `Math.min(3.2, ease + 0.12)` 不会把它抬回 1.3：`0.5 → 0.62`（sm1-b 信息性用例）。
  后果轻微（20 次后自然回到 >1.3），且主线不可达 → **P2，仅记录**。

---

## 第 3 条 · 摘星 / 康复逻辑

### 3.1 语义

`recoveryCount`（`types.ts:169`，可选）：仅「系统置位卡」维护的连续正确计数。
`participatesRecovery = card.priority === true && card.prioritySource !== "manual"`（`reviewService.ts:478`），
含 legacy 无 `source` 的卡。`PRIORITY_RECOVERY_THRESHOLD = 2`（`:9`）。
`isCorrectReview` 判定线是 **`rating >= 3`**（`reviewRating.ts:23-24`）。

### 3.2 与注释声明一致（sm3-a 验证）

| 声明 | 实测 |
|---|---|
| 「连续 2 次 rating>=3 视为康复自动摘除」 | rating 3 也计入：`recoveryCount` 1 → 2 后 `priority` 变 false ✅ |
| 「rating<=2 清零重来」 | rating 2 后 `recoveryCount` 归 0，`priority` 保持 true ✅ |
| 「manual 卡永不自动摘除、不维护该字段」 | 连续 `[3,3,4,3,4]` 后仍 `priority:true`、`source:"manual"`、`recoveryCount === undefined` ✅ |
| 「legacy 无 source 参与康复」 | 两次 rating 3 后 `priority:false` ✅ |

**边界（rating 3 与 4 的区分）与注释一致**：注释写「rating>=3」而非「rating=4」，
`isCorrectReview(review)` 用 `review.rating >= 3`，两者文字与代码一致。

### 3.3 D3（P1）：`markCardsPriority` 的手动标星会被自动摘掉

**文件:行号**：`src/services/reviewService.ts:408-420`（`markCardsPriority`，:416 为 priority 写入点）、
调用点 `src/pages/SpellingPage.tsx:499`（「错词加入重点」按钮）

```ts
export const markCardsPriority = (data: AppData, cardIds: string[]): AppData => ({
  ...
  cards: data.cards.map((card) =>
    priorityIds.has(card.id) && !card.priority
      ? { ...card, priority: true, updatedAt: timestamp }   // ← 没有 prioritySource: "manual"
      : card
  )
});
```

这是**用户手动点「错词加入重点」**的入口，但写入的卡 `prioritySource === undefined`，
于是 `participatesRecovery` 的 `prioritySource !== "manual"` 判定把它当作
「legacy 无 source 的系统卡」（`reviewService.ts:478` 注释明说含 legacy 无 source），
纳入康复计数并被自动摘星。

**复现（sm3-b）**

```
SM3-b markCardsPriority 标星后两次答对: {"priority":false}   ← 用户加的重点被系统静默取消

对照（cardService.togglePriority，同样是一个"点星"动作）:
  togglePriority → prioritySource="manual" → 两次 rating3 后 priority 仍为 true
```

**真实后果**：用户在拼写页答错若干词，点「错词加入重点」把它们加进重点；
之后连续两次评分 ≥3（非常容易，只要「记得」或「熟练」），这些词就**静默退出重点**，
`LibraryPage` 的「我的重点」筛选与 `priorityManual` 计数随之减少。
用户会看到「我明明加过重点，怎么没了」。

**修复方向**：`markCardsPriority` 与 `cardService.togglePriority` 统一写 `prioritySource: "manual"`。

### 3.4 D4（P1）：`normalizeCard` 丢弃三个可选字段 → 落盘即永久丢失

**文件:行号**：`src/services/storage.ts:275-303`（`normalizeCard`），
管线 `loadData`（`:1148`）→ `migrateData`（`:922`）→ `saveData`（`:1173`）

`normalizeCard` 逐字段白名单重建 `Card`，只透传 `id/type/front/back/note/sourceId/unitId/tags/status/priority/masteredAt/createdAt/updatedAt`。
**未透传**：`prioritySource`、`suspendedFrom`、`mistakeGraduatedAt`。
注意 `normalizeDiaryEntries` 在审计期间刚加了同款修复（`storage.ts:729-730` 注释「逐字段重建：新字段必须显式保留，否则存一次就被抹掉」），
说明这是**已知的字段丢失模式**（`followUp` 曾漏在这里），但 `Card` 的三个字段仍未修。

**复现（sm3-d / 探测）**

```
SM3-d 输入:   [{"id":"c1",…,"priority":true,"prioritySource":"manual","mistakeGraduatedAt":"2026-09-20T…"}]
SM3-d 迁移后: [{"id":"c1",…,"priority":true,"masteredAt":null}]      ← 三个字段全消失

端到端（saveData → localStorage）:
  内存中 source = manual
  localStorage 中 = {"id":"c1",…,"priority":true,"masteredAt":null}  ← 缺失
```

`AppContext.commitData`（`AppContext.tsx:48-52`）每次 `updateData` 都调 `saveData`，
所以**用户点一次星、等一次自动保存，`prioritySource` 就永久消失**（不需要重启）。

**真实后果**：
1. **`prioritySource` 丢失** → 用户手动加的重点退化为「legacy 系统卡」→ 与 D3 合流，
   两次答对后被自动摘星（sm3-d 端到端验证：`SM3-d 重启 + 两次答对后 priority: false`）。
2. **`mistakeGraduatedAt` 丢失** → 动态错词书「连续全对毕业」标记失效（`SpellingPage.tsx`
   写入 `applyMistakeBookGraduation` 的毕业时间点时提示「已从《我的错词书》毕业」），
   毕业过的词会重新出现在错词本里。
3. **`suspendedFrom` 丢失** → `cardService.ts:539` 恢复暂停卡时 `card.suspendedFrom ?? "review"`，
   原来从 `mastered` 暂停的卡恢复后变成 `review`，掌握度倒退。

### 3.5 D5（P2）：`priorityManual` 与 `prioritySystem` 双计同一张卡

**文件:行号**：`src/services/reviewService.ts:236` 与 `:240`

```ts
priorityManual: activeCards.filter((card) => card.priority && card.prioritySource !== "system").length,
prioritySystem: activeCards.filter((card) => card.priority && card.prioritySource !== "manual").length,
```

对 `prioritySource === undefined` 的卡，两个条件**同时为真**。

**复现（sm3-c）**：`priority=1, priorityManual=1, prioritySystem=1` → 两阵营计数之和（2）> `priority`（1）。
有明确 source 时正确互斥（`priorityManual=1, prioritySystem=1, priority=2`）。

**真实后果**：`LibraryPage.tsx:257` 的 `isSystemFocused` 与 `:253` 的 `priorityCount` 用同一对反向判据，
于是一张「来源不明」的重点卡**同时出现在「我的重点」和「系统关注」两个筛选项里**。
考虑到 D4 会把几乎所有历史卡的 `prioritySource` 抹掉、D3 又持续产生无 source 的卡，
这个「来源不明」状态实际是**常态而非边缘**。

---

## 第 4 条 · 会话组装的不变量

### 4.1 `interleaveBySource` 的 while 上界 —— **不成立的反例：无（不丢卡）**

**文件:行号**：`src/services/grammarReviewService.ts:89-107`，上界在 `:100`

```ts
while (result.length < items.length && index < items.length * queues.length + queues.length)
```

**明确结论：上界是充分条件，永不提前退出导致丢卡。**

已用两种方法验证：
1. **穷举**（`/tmp/brute.mjs` 脚本 + sm4-b 参数化用例）：总数 1–24、桶数 1–8 的**所有**正整数分布
   （含「10 张全同源」「9 源各 1 张」「单源 1 张」「2 源 9+1」「无 sourceId 全空键」），
   **丢卡反例数 = 0**；最坏上界使用率 `index/bound = 24/25 = 0.96`（单桶 24 张）。
2. **推导**：每一轮只取一个元素，队列数 `Q`、总数 `N`。取空一个桶后，
   每轮最多只有 `Q-1` 次空转，且空转轮次的总数上界也不超过 `Q·(Q-1)`…
   实测最坏比例 `N/(N·Q+Q) → 1/Q`（单桶时 `Q=1`，比值为 `N/(N+1) < 1`），恒有余量。

sm4-b 详细输出：
```
全同源 10 张: 结果 10/10 迭代 10 上界 11 残留 0
9 源各 1 张:  结果 9/9  迭代 9  上界 90 残留 0
2 源 9+1:     结果 10/10 迭代 17 上界 22 残留 0
10 源各 1 张: 结果 10/10 迭代 10 上界 110 残留 0
20 源各 1 张: 结果 20/20 迭代 20 上界 420 残留 0
最坏 2 源 1+10: 结果 11/11 迭代 20 上界 24 残留 0
```

### 4.2 `interleaveBySource` 的「相邻不同源」—— **有条件成立（数学上无解时不可能）**

**明确结论：该不变量只在「最大桶 ≤ ⌈N/2⌉」时可能成立；round-robin 实现连这个条件都不满足。**

穷举（`/tmp/brute3.mjs`）：总数 2–16、桶数 2–8 的所有分布中，**可解**分布 37,729 个，
其中 round-robin 仍产生相邻同源的有 **21,346 个（56.6%）**。

反例（sm4-b 实测，全部同源）：
```
SM4-b 全同源时相邻同源的对数: 9 / 9      ← 单源，数学上无解，非缺陷
```
可解但违规的最小反例：`counts=[1,2]` → 输出 `[s0, s1, s1]`（末两位同源），
而完美解 `[s1, s0, s1]` 存在。原因：round-robin 按固定顺序轮流取，
不做「优先取剩余最多的桶」的贪心。

**真实后果**：在同源卡占多数时（例如一次新课产生多张同来源语法卡），
用户在复习会话里会连续看到同一课/同一案件的句子，「相邻卡不同来源（混题）」的设计目标打折。
**属实现局限而非崩溃级缺陷（P2）**；sm4-e 显示 `buildGrammarReviewSession` 在截断前先交错，
所以 10 张上限内仍有改善。

### 4.3 `diversifyReviewModes` 的贪心交换 —— **守恒成立，但「相邻不同型」不保证**

**文件:行号**：`src/services/grammarReviewService.ts:122-150`

**守恒性（不丢卡、不重复卡）：成立。**
sm4-c 对 6 组输入（含空数组、单元素、全同型无解、全不同型、`reviewCount` 0..9）验证：
输出长度 = 输入长度、`id` 排序集合完全相同、`Set(id).size === 输入长度`。
`session.length <= 2` 时原样返回（返回**同一引用**，sm4-c 用 `toBe` 验证）。

**退化正确性（无解时不折腾）：成立。** 全 `cloze` 会话（6 张 `reviewCount=0`）→ 原序返回
`["z0","z1","z2","z3","z4","z5"]`（sm4-c 实测）。

**「相邻不同型」：不成立（P2, D7）。**
贪心只做「向后找第一个异型，找到就换一次，不回溯」。穷举（`/tmp/brute2.mjs`）：
- n=1..8 共 9,840 个输入，可解 7,527 个，其中**仍残留相邻同型 2,124 个（28.2%）**；
- n=10（= 会话上限）共 59,049 个输入，可解 45,486 个，其中**仍残留 14,190 个（31.2%）**。
- 「输出比输入更差」的反例数 = **0**（不会把序列搞坏）。

最小反例（sm4-c 实测）：
```
输入 cloze, cloze, cloze, rebuild
输出 ["a","cloze"],["d","rebuild"],["c","cloze"],["b","cloze"]   ← 末两位仍同型
残留相邻同型对数: 1     （完美解 rebuild,cloze,cloze,cloze 时应为 0）
```
成因：`index=1` 把 `rebuild` 换到位置 1 后，位置 3 的 `cloze` 与位置 2 的 `cloze` 相邻，
但扫描已前进到 `index=2`（`cloze` vs `rebuild` 不同型，跳过），`index=3` 时向后已无元素可换。

**真实后果**：用户仍会遇到「连续两张选词填空」——正是 R-UX9（`grammarReviewService.ts:115-118` 注释）
声称修掉的现象（「亲测连续 2 张选词填空」），只是频率下降（约 1/3 的可解输入仍残留）。
**修复方向**：改用「按剩余数量最多的题型优先出题」的贪心，或对 `modeOf` 分组后做
「最多数量组的元素插空到其他组之间」的确定性排布（Harel-Havrah 式）。

### 4.4 `summarizeGrammarMastery` 三计数之和 = `total` —— **成立**

**文件:行号**：`src/services/grammarReviewService.ts:170-188`

sm4-d 对 6 类构造器验证 `mastered + inProgress + notStarted === total` 全部通过：
空数据、单卡（有/无 schedule）、mastered 卡、混合三态、含 suspended/word/无标签卡的过滤场景。
`mastered` 用 `continue` 先短路，所以 mastered 卡即使 `reviewCount = 0` 也计入 `mastered`
（sm4-d 验证 `{mastered:1, inProgress:0, notStarted:0, total:1}`）——**划分无重叠、无遗漏**。

**残余病灶（P2）**：`mastered` 判据是 `card.status === "mastered"`，`notStarted` 判据是 `reviewCount === 0`，
而会话侧的过滤判据（`neverQueuedSchedule`）是「三字段全 0」。三者口径不同：
一张 `lapseCount=2 / reviewCount=0` 的卡在掌握视图算「未开始」，会话却会出题（sm4-d 实测
`notStarted=1, 出题数=1`）。属旧/手工数据形态，主线不可达。

### 4.5 `listDueGrammarReviewCards` 排序 —— **成立**

**文件:行号**：`src/services/grammarReviewService.ts:81-85`

sm4-a 验证 `["a","b","c","d","e"]`（lapse 0/3/3/1/3，nextReviewAt 各异）→ 输出 `["e","c","b","d","a"]`：
lapse 3 组按时间升序 `e(2020-02) → c(2020-06) → b(2021-01)`，再 `d(lapse 1)`，再 `a(lapse 0)`。
lapse 相同时按 `nextReviewAt.localeCompare` 升序（ISO 字符串字典序 = 时间序，正确）。

**已修复的坑（见 §6）**：`lapseCount = NaN` 时 `b.lapseCount - a.lapseCount = NaN`，
`NaN !== 0` 为真 → 返回 NaN → 排序行为依赖 TimSort（sm5-d 实测 `["a","b"]`，被排到真实大 lapse 卡之前）。
属未归一化路径。

---

## 第 5 条 · 数据健壮性

### 5.1 `normalizeSchedules` 的补齐覆盖 —— **覆盖完整**

**文件:行号**：`src/services/storage.ts:862-894`

sm5-c 实测（经 `migrateData` 管线，对象直传 = 真实 `saveData` 路径）：
- **补充**：缺 schedule 的卡自动获得 `{easeFactor:2.5, intervalDays:0, reviewCount:0, lapseCount:0, nextReviewAt:now}` ✅
- **NaN / Infinity / 负值 / 非法日期**：全部替换为安全值
  `{easeFactor:2.5, intervalDays:0, reviewCount:0, lapseCount:0, nextReviewAt:now}` ✅
  （`asNumber` 的 `Number.isFinite` 兜底 → fallback 2.5；`Math.max(0, …)` 兜负值；`validIsoOrNow` 兜非法日期）
- **字符串数字**（`"2.5"` / `"3"`）：被 `Number(value)` 正确还原 ✅
- **重复 cardId**：只保留第一条（`schedulesByCardId.has(cardId)` 跳过）✅
- **孤儿 schedule**（cardId 不在 cards 中）：丢弃 ✅
- **非数组 / 非对象元素**（`null` / `"garbage"` / `[1,"x",null]`）：不抛错，转为补齐默认 ✅

**信息性发现（非缺陷）**：同一份坏 `easeFactor: NaN` 在两条路径得到**不同**修复值：
- 对象直传（`saveData`）：`asNumber` fallback → **2.5**
- JSON 字符串（`loadData` / 备份恢复）：`JSON.stringify` 把 NaN 变 `null` → `Number(null)=0` → `Math.max(1.3, 0)` → **1.3**

两者都落在合法区间 `[1.3, 3.2]` 内，无功能后果 → **P2 口径不齐但无害**。

### 5.2 D8（P2）：`normalizeSchedules` 有下限无上限

**文件:行号**：`src/services/storage.ts:874-875`

```ts
easeFactor: Math.max(1.3, asNumber(item.easeFactor, 2.5)),        // :874  无上限
intervalDays: Math.max(0, Math.round(asNumber(item.intervalDays, 0))),  // :875  无上限
```

**复现（sm5-c）**
```
SM5-c 超界值通过情况: c1.intervalDays = 1000000000  c1.easeFactor = 1e+308  c2.easeFactor = 999
```

**真实后果**：手工改坏的 localStorage / 第三方备份 / 未来某个 bug 产生的超界值会被**原样保留**，
下一次 rating 3/4 直接 `RangeError`（`intervalDays=1e9` 天 ≈ 2.7e6 年，合 8.64e16 ms > Date 上限）。
`easeFactor=999` 也不能被 rating 4 的 `Math.min(3.2, …)` 修好——rating 4 只需一次就把 ease 压到 3.2，
但**同一次**的 interval 会用 `3.2` 计算（顺序正确），所以 999 的直接影响有限；
真正的定时炸弹是 `intervalDays`。**修复方向**：与 D1 的 `MAX_INTERVAL_DAYS` 同一处加固。

### 5.3 D9（P2）：`easeFactor = NaN` 在未归一化路径抛错

**复现（sm5-b）**
```
[P1] easeFactor = NaN → rating3/4 抛 RangeError，rating1/2 不抛但留下 NaN ease
  Math.max(1.3, NaN - 0.25) === NaN
  Math.max(1, Math.round((1 || 1) * NaN)) === NaN        → addDays(NaN) → RangeError
```

`Math.max(1.3, NaN - 0.25) = NaN`（`Math.max` 对 NaN 返回 NaN，不做兜底），
NaN 经 rating 3/4 的乘法污染 `intervalDays`，`addDays(NaN)` 抛 `RangeError`。
rating 1/2 分支用常量天数（0/1）故不抛，但落盘 `easeFactor: NaN` 会传播到后续每次 rating 3/4。
**主线不可达**（`normalizeSchedules` 用 `Number.isFinite` 挡住了 NaN），
但 `applyReview` 作为导出的纯函数没有自防护 → **P2**。

### 5.4 `schedule` 缺失 / 为 0 / 为负 / 非法日期的行为矩阵（sm5 实测）

| 异常 | `applyReview` 行为 | `getDueCards` 行为 | `listDueGrammarReviewCards` 行为 |
|---|---|---|---|
| schedule 完全缺失 | 用 `createInitialSchedule` 兜底，rating4 → interval 3 ✅ | 该卡不在 `dueIds` 中，**永久不出现在到期队列** | 无计划 → `null` → 过滤掉；`scheduleCardsForToday` 也救不了（会 skip） |
| `intervalDays = 0` | rating3 → 1（`\|\| 1` 兜底）；rating4 → 3 | 正常（0 天即已到期） | 三字段全 0 → 视为「从未排期」排除；否则出题 |
| `intervalDays` 为负 | `Math.max` 兜住 → `rating3` 给 1、`rating4` 给 3 ✅ | 正常到期 | 出题（`(intervalDays ?? 0) === 0` 为 false） |
| `intervalDays = NaN` | `(NaN \|\| 1) = 1` → 四分支都不产生 NaN ✅ | `new Date(…).getTime()` NaN 比较恒 false → **永不到期** | `(NaN ?? 0) === 0` 为 false → 走 `new Date(nextReviewAt) <= now`，正常出题 |
| `nextReviewAt` 非法字符串 | 被覆盖为新的合法值 ✅ | **永不到期**（静默隐身，sm5-d 实测到期数 0） | 同上，`new Date("bad") <= now` 恒 false → 不出题 |
| `nextReviewAt = ""` | 同上 | 永不到期 | 不出题 |
| `lapseCount = NaN` | `NaN + 1 = NaN` 落盘；`NaN >= 3` 为 false → **不误置位 priority** ✅ | — | 排序返回 NaN（依赖 TimSort，已记录） |
| `reviewCount = NaN` | `NaN >= 4` 为 false → **不误判 mastered** ✅ | — | — |
| `easeFactor = Infinity` | rating3 → `Infinity` → `RangeError` | — | — |
| `easeFactor = 1e308` | rating3 → `RangeError`；rating4 反而安全（`min(3.2,…)` 先夹住） | — | — |

**结论**：`applyReview` 通过 `(x || 1)`、`Math.max`、`Number.isFinite` 三重兜底
对**全部**缺失/0/负/NaN 形态安全（不产生 NaN 日期、不死循环），
唯一的崩溃面来自「无穷大/超界大数」（D1/D8/D9）。
`normalizeSchedules` 的补齐覆盖全部缺失形态（缺字段、缺条目、类型错、重复、孤儿、非数组）。
`getDueCards` 对非法日期的表现是**静默隐身**（卡永远不到期且无任何提示），
由于 `loadData` 会把非法日期改成 `now`（sm5-d 验证：迁移后到期数 1），主线不可达。

---

## 第 6 条 · 审计期间已被第三方修复的两处缺陷

以下两处在审计早期已被我确认并复现，但在报告撰写前工作树被并发编辑修复，
现记录修复前后状态，并保留回归测试（`sm6-cross.test.ts` 断言修复后的正确行为）。

### 6.1 语法卡 rating 1 后被永久排除出复习队列（原 P1）

**原实现**（`grammarReviewService.ts`）：`if (item.card.status === "new" || (item.schedule.intervalDays ?? 0) === 0) return false;`

`applyReview` 的 rating 1（「看答案」）分支也把 `intervalDays` 归零（`reviewService.ts:440-444`），
两个语义撞车 → 刚看答案的语法卡被当成「从未排过复习」而**永久排除**。
我当时实测：`SMX-a 11 分钟后的复习队列长度: 0`，三张卡全看答案后 `1 小时队列长度: 0`，
而页面文案写着「这张卡很快会再来见你」。

**现实现**（`grammarReviewService.ts:58-59`）：
```ts
const neverQueuedSchedule = (schedule: Schedule): boolean =>
  (schedule.intervalDays ?? 0) === 0 && (schedule.reviewCount ?? 0) === 0 && (schedule.lapseCount ?? 0) === 0;
```
改判据为三字段合取。sm6 回归验证：rating 1 后 `reviewCount=3 > 0` → 11 分钟后确实回到队列（`["g1"]`），
10 分钟内仍不到期；真正「从未排期」（三字段全 0）的卡仍被排除，`scheduleCardsForToday` 抬 `intervalDays` 后恢复出题。

**注意**：既有测试 `src/edge/verify/pr1-promises.test.tsx` 的 `PR1-3`
断言的是**旧（错误）行为**（「1h 后语法复习队列仍应为 0」），现在**失败**（`expected 1 to be +0`）。
该测试需要同步更新。

### 6.2 语法 mastered 卡单次失误被降级（原 P1）

**现实现**（`reviewService.ts:36-37, 498-503`）新增 `keepsMasteredStatus`：
语法句子卡一旦 `status === "mastered"`，该次复习不再把它降回 `review`。
修复的动机（注释说明）：一次「看答案」（rating 1）会把卡打回 review，导致「已掌握 N」倒退。

---

## 第 7 条 · 分类总表

### 确认的缺陷

| 编号 | 严重度 | 文件:行号 | 一句话 |
|---|---|---|---|
| D1 | **P0** | `reviewService.ts:56, 460-462` | 连续 rating4 → interval 指数爆炸 → `RangeError`，页面卡死（定向训练可达） |
| D2 | **P1** | `reviewService.ts:449-458` | 语法卡 rating3 间隔冻结在 1 天，rating4 却放大到 41 天（41 倍量级差） |
| D3 | **P1** | `reviewService.ts:408-420` + `SpellingPage.tsx:499` | 「错词加入重点」不写 `prioritySource`，两次答对后重点被静默摘掉 |
| D4 | **P1** | `storage.ts:275-303` | `normalizeCard` 丢 `prioritySource`/`suspendedFrom`/`mistakeGraduatedAt`，`saveData` 即永久丢失 |
| D5 | **P2** | `reviewService.ts:236, 240` | `priorityManual` + `prioritySystem` 双计无 source 的卡，两阵营互斥性被破坏 |
| D6 | **P2** | `grammarReviewService.ts:70-79` + `reviewService.ts:36-37` | mastered 语法卡仍进队列 + 不可降级 → 反复出现且无法退回 |
| D7 | **P2** | `grammarReviewService.ts:122-150` | 贪心不回溯：有解时 28–31% 迭代残留相邻同型 |
| D8 | **P2** | `storage.ts:874-875` | `normalizeSchedules` 无上限，`intervalDays=1e9` 原样通过 |
| D9 | **P2** | `reviewService.ts:440-448, 460-462` | `easeFactor=NaN`（非归一化路径）→ rating3/4 抛 `RangeError` |

### 有意设计（非缺陷）

- **N1** 语法句卡 rating 3 不放大间隔（`reviewService.ts:450-451` 注释明确声明 R09 Step1）
- **N2** ease 上限 3.2（sm1-b 验证真实生效）
- **N3** rating 4 先更新 ease 再用新 ease 相乘（与自订规格「字面」有 1 天级差异，规格未规定顺序）
- **N4** 4 档 rating 替代 SM-2 的 6 档质量；ease 用固定差量
- **N5** 无「n=1→1天 / n=2→6天」固定阶梯
- **N6** mastered 判据 = 「rating4 且 reviewCount≥4」
- **N7** 所有分支有硬下限，无「重置到 1 天」
- **N8** `intervalDays` 复用 0 表示两种语义（「从未排期」与「rating1 后 10 分钟再来」）——语义复用本身是设计选择，
  但曾导致 §6.1 的缺陷，现已用三字段判据区分
- **I4** 「相邻不同源」在 `最大桶 > ⌈N/2⌉` 时数学上无解（例：10 张全同源）

### 可疑但未证实

- **S1** `summarizeGrammarMastery` 的「未开始」（`reviewCount===0`）与会话侧的「从未排期」（三字段全 0）
  口径不同，`lapseCount>0 / reviewCount=0` 的卡两侧不一致（sm4-d 实测 `notStarted=1, 出题=1`）。
  该形态属旧数据/手工数据，主线不可达，**未证实会在真实使用中产生可见症状**。
- **S2** `easeFactor < 1.3` 时 rating 4 不把它抬回下限（`0.5 → 0.62`）。20 次 rating 4 后自然回到 >1.3，
  影响轻微且主线不可达（`normalizeSchedules` 已挡住），**未证实为实际缺陷**。
- **S3** D6 的「mastered 语法卡反复看答案到第 3 轮 → lapseCount 触线 → 自动置位 `priority=system`」
  （sm8-b 实测轨迹 `[{lapseCount:1,priority:false},{lapseCount:2,priority:false},{lapseCount:3,priority:true,source:"system"},{lapseCount:4,priority:true}]`）。
  逻辑上成立，但需要用户对一张「已掌握」的卡连续 3 次看答案，**未证实真实用户会这样做**。

---

## 附：`prioritySource === "manual"` 的卡是否真的永不被自动摘星？

**结论：成立。** 但有两个前置条件，缺一不可：

1. `participatesRecovery = card.priority === true && card.prioritySource !== "manual"`（`reviewService.ts:478`）——
   `manual` 卡不参与康复计数，`recoveryCount` 也不写入。
   sm3-a 实测：连续 `[3,3,4,3,4]` 后 `priority:true`、`source:"manual"`、`recoveryCount === undefined` ✅
2. **该字段必须真的存在。** D4 表明「手动标星」的卡在 `saveData` 后 `prioritySource` 消失，
   于是**退化**为 legacy 系统卡并被自动摘星（sm3-d 端到端实测 `priority:false`）。
   另外 D3 表明 `markCardsPriority`（拼写页「错词加入重点」）**从不写** `prioritySource`。

**所以准确结论是**：`applyReview` 的判定逻辑正确，
但「用户以为的 manual」与「数据里的 manual」不一致——这是 D3 + D4 的共同后果。

**`recoveryCount` 在 rating 3/4 边界上与注释一致？** 一致。
`isCorrectReview` 用 `rating >= 3`（`reviewRating.ts:23-24`），注释（`reviewService.ts:471-472`）写「rating>=3」，
sm3-a 验证 rating 3 就计 1、rating 2 清零——文字、代码、测试三者一致。

---

## 附：修复建议优先级

1. **D1（P0）**：在 `reviewService.ts` 的 rating 3/4 分支与 `normalizeSchedules` 加
   `MAX_INTERVAL_DAYS`（建议 36500，Anki 默认），并在 `addDays` 里对超界的 `days` 做兜底钳制。
   这一处同时缓解 D8。
2. **D3 + D4（P1）**：`markCardsPriority` 补 `prioritySource: "manual"`；
   `normalizeCard` 补透传 `prioritySource` / `suspendedFrom` / `mistakeGraduatedAt`
   （与刚修好的 `DiaryEntry.followUp` 同一手法：显式逐字段保留，并加防回归测试）。
   修完 D4 后，D5 的「来源不明」卡会大幅减少。
3. **D2（P1）**：为语法卡引入「连续 rating 3 计数」，达到阈值后允许一次按 `+1 天` 递增的放大，
   或把 rating 3 的语法分支改为 `intervalDays = Math.max(intervalDays, min(intervalDays + 1, cap))`。
4. **D6（P2）**：`listDueGrammarReviewCards` 增加 `card.status !== "mastered"` 过滤
   （与 `getDueCards` 对齐）；若产品确实希望已掌握卡继续复习，则需要重新定义
   `keepsMasteredStatus` 的边界（例如允许连续 3 次 rating 1 后降级）。
5. **D7（P2）**：`diversifyReviewModes` 改为按题型剩余数量做优先出题（或分组插空）。
6. **D5（P2）**：把 `priorityManual` / `prioritySystem` 的判据改为显式三分
   （`manual` / `system` / `undefined`），保证互斥且完备。
