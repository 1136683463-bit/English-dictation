# 复习 / 强化 / 判题区域「测试通过但行为是错的」缺陷审计

审计日期：2026-09-21
审计范围：`reviewService.ts` / `grammarReviewService.ts` / `grammarBoostService.ts` / `diffService.ts` / `GrammarReviewPage.tsx` / `GrammarBoostPage.tsx`
复现套件：`src/edge/verify/jd10-defects.test.ts`（17 个用例）

```
npx vitest run src/edge/verify/jd10-defects.test.ts
Test Files  1 passed (1)
     Tests  17 passed (17)
```

> 审计期间仓库里有另一个进程在并发修改产品代码，并**修掉了其中一条缺陷（FAIL-1）**。
> 每条缺陷在下结论前都用当时最新的源码重新跑过复现；FAIL-1 的修复状态在正文里单独标注。
> 最终基线哈希：
>
> | 文件 | sha256（前 12 位） |
> |---|---|
> | `src/services/reviewService.ts` | `a9eede6eba0b` |
> | `src/pages/GrammarReviewPage.tsx` | `45df6ae2e8ba` |
> | `src/pages/ReviewPage.tsx` | `38db449c1662` |
> | `src/services/grammarReviewService.ts` | `46332d91c598` |
> | `src/services/grammarBoostService.ts` | `35b3f2ed3d85` |
> | `src/services/diffService.ts` | `4d3f4f78363e` |

**结论速览**：8 条确认缺陷中，FAIL-1 已被并发进程修复；**其余 7 条在最终基线上仍然存活**
（逐条复核输出见 §2 各条「存活确认」，汇总见 §8）。

---

## 0. 关于你给的那个实例（`rebuild` → `recall`）

**已被并发进程修复，不是本文的发现。** 审计开始时 `GrammarReviewPage.tsx:25` 已经是：

```ts
const reviewModeForTask = (task: GrammarReviewTask): ReviewMode =>
  task.mode === "cloze" ? "cloze" : task.mode === "rebuild" ? "rebuild" : "recall";
```

`types.ts` 的 `ReviewMode` 也加了 `"rebuild"`，`storage.normalizeReviewMode` 也认它（这条很关键，否则从 localStorage 读回时 `rebuild` 会被规范化成 `recognize` —— 已确认补上了）。

但**同一条缺陷的另一半没被修**，见 FAIL-2：`isMasteredByOutput` 只认 `mode === "recall"`，而**通用复习页 `/review` 对语法句子卡写的正是 `recall`**（`ReviewPage.chooseMode`：句子卡一律 `recall`）。所以「拼词块 + 自己写」这条路径被堵上了，**「通用页自评 + 自己写」这条更大的路径还开着**。

---

## 1. 写入点 × 读取点对照表（`mode` / `rating` / `status`）

### 1.1 `review.mode` 写入点

| # | 写入点 | 写入值 | 触发时机 |
|---|---|---|---|
| W1 | `GrammarReviewPage.tsx:33-34` | `cloze` / `rebuild` / `recall` | 语法复习页作答（按 task.mode 映射） |
| W2 | `ReviewPage.tsx:31-32` `chooseMode` | 句子卡 → `recall`；单词新卡 → `recognize`；单词旧卡 → `spelling` | 通用复习页作答 |
| W3 | `SpellingPage.tsx:413` | 恒为 `spelling` | 拼写页作答 |
| W4 | `storage.ts:424-444` `normalizeReviewMode` | 白名单外的值 → `recognize` | 每次从 localStorage 读取 |

### 1.2 `review.mode` 读取点

| # | 读取点 | 期望语义 | 与写入点对照 |
|---|---|---|---|
| R1 | `grammarReviewService.ts:432` `isMasteredByOutput` | `"recall"` = **自由输出** | ⚠️ **W1(retain rebuild 后) 的 `recall` 只来自 free_type ✅；但 W2 的 `recall` 是「照着题面抄」❌** |
| R2 | `statsService.ts:283,310,387,420` | `"spelling"` = 单词拼写 | ✅ W3 一致；W1/W2 不写 spelling，不污染 |
| R3 | `unitService.ts:19` | `"spelling"` = 单词复习数 | ✅ 同上 |
| R4 | `dynamicBookService.ts:35` | `"spelling"` = 错词书毕业判据 | ✅ 同上 |
| R5 | `TodayPage.tsx:239` (`modeLabel`) | 展示用文案 | ✅ 6 个值都有标签（含 `rebuild: "拼句"`） |
| R6 | `ReviewPage.tsx:22-29` (`modeLabel`) | 展示用文案 | ✅ 同上 |

**结论（1.2）**：`mode` 的枚举映射现在只有一处口径冲突 —— R1 vs W2，即 FAIL-2。

### 1.3 `review.rating` 写入点

| # | 写入点 | 取值规则 |
|---|---|---|
| W5 | `GrammarReviewPage.tsx:29-32` `ratingForOutcome` | `revealed → 1`；`attempts <= 1 → 4`；否则 `3` |
| W6 | `ReviewPage.tsx:187-198` | 用户手点 1/2/3/4（1、2 需二次确认） |
| W7 | `SpellingPage.tsx:417` | 对 → `4`，错 → `1` |

### 1.4 `review.rating` 读取点

| # | 读取点 | 口径 | 对照 |
|---|---|---|---|
| R7 | `reviewRating.ts:23-34` | `>=3` 正确 / `<=2` 错误 | ✅ 三个写入点语义一致（4=最熟、1=忘了） |
| R8 | `reviewService.ts:425-448` | 1→lapse+10min；2→1 天；3→维持/放大；4→拉长 | ✅ 与 R7 一致 |
| R9 | `MistakeBookPage.tsx:133` `rating >= 4` | 「已拼对」 | ✅ 与「4=熟练」一致 |
| R10 | `reviewService.ts:482` `isMasteredBySpacedRepetition` | `rating === 4` | ⚠️ 见 FAIL-3/FAIL-4 |

**结论（1.4）**：rating 的**写入语义**没问题（PASS-B / PASS-C）。问题在**读取方的分支口径**（FAIL-3、FAIL-4）。

### 1.5 `card.status` 写入点

| # | 写入点 | 写入值 | 备注 |
|---|---|---|---|
| W8 | `reviewService.ts:34` `applyMasteredStatus` | `mastered` | 幂等，保留原 `masteredAt` |
| W9 | `reviewService.ts:496-506` `applyReviewWithUndo` | `mastered` / `review` | 每复习一次重算 |
| W10 | `MistakeBookPage.tsx:137` | `mastered` | ⚠️ **这是 `MistakeInsight.status`（UI 推断的展示态），不是 `Card.status`** —— 已确认命名撞车但无数据污染 |
| W11 | `cardService.ts:252,438`、`storage.ts:1018` | `new` | 建卡时 |
| W12 | `importService.ts:331` | `new` | 导入 |

**结论**：`card.status` 只有 W8/W9 两个真实写入点，口径自洽。W10 是同名不同物，不构成缺陷。

### 1.6 `schedule.intervalDays` 写入点与读取点（**本报告最重的一块**）

| # | 位置 | 角色 | 值 |
|---|---|---|---|
| W13 | `reviewService.ts:427` | **写**：rating=1 | `0`（语义 = 「10 分钟后再来」） |
| W14 | `reviewService.ts:432` | **写**：rating=2 | `1` |
| W15 | `reviewService.ts:439` | **写**：rating=3 语法卡 | `max(1, intervalDays \|\| 1)` |
| W16 | `reviewService.ts:441` | **写**：rating=3 其他卡 | `max(1, round(intervalDays * ease))` |
| W17 | `reviewService.ts:446` | **写**：rating=4 | `max(3, round(intervalDays * ease * 1.3))` |
| W18 | `cardService.ts:277,456` / `storage.ts:845` | **写**：新建卡 | `0` |
| R11 | `grammarReviewService.ts:60` | **读**：到期判据 | `neverQueuedSchedule = intervalDays === 0 && reviewCount === 0 && lapseCount === 0` —— 注释明写「从未进过复习队列」 |
| R12 | `statsService.ts:701-706` | **读**：成熟度分桶 | `< 2 → "new"（新学）` |

**结论**：`intervalDays === 0` 曾被赋予**两个互斥语义** —— W13/W18 写「0」表示「马上/还没排」，R11 读「0」表示「从未进过队列，永不到期」。这不是笔误，是**哨兵值撞车**，直接产生 FAIL-1（已被并发进程修复：R11 改成三字段联合判据，混淆面收窄）。

**残留观察**：W18（新建卡）写 `intervalDays: 0` 与 W13（rating=1）写 `0` 仍然同值，只是现在靠 `reviewCount`/`lapseCount` 才能分辨。任何**未经过 `applyReviewWithUndo` 就改动 `reviewCount`/`lapseCount` 的代码路径**都会重新打开这个洞 —— 全库 grep 确认目前没有这样的路径（只有 `createInitialSchedule`、`createDefaultSchedule`、`normalizeSchedules` 会写这三个字段，且都是「全初始值」组合）。建议后续给 `Schedule` 加显式的 `neverScheduled` 标记，把语义从「值的组合」升级为「独立字段」。

---

## 2. 确认的缺陷

### FAIL-1（P0）~~`rating=1` 把 `intervalDays` 打成 0，卡片被语法复习队列**永久排除**~~ —— **审计期间已被并发进程修复**

> **状态更新（2026-09-21 21:33）**：该缺陷在我出结论后被仓库里并发的另一个进程修复，实现是
> `neverQueuedSchedule(schedule)`（`grammarReviewService.ts:59-60`）：把哨兵值从「`intervalDays === 0`」
> 改成「`intervalDays === 0 && reviewCount === 0 && lapseCount === 0`」（三字段都还是初始值）。
> 我在修复后重跑了原复现，确认漏洞已闭合：任何一次真实复习都会让 `reviewCount` +1（看答案还会让 `lapseCount` +1），
> 所以「刚失败的卡」与「刚入队的新卡」被干净分开了。下面保留原始诊断（方法学价值），但**不需要再修**。
>
> 修复后实测（四种起始状态都正确）：
> ```
> [JD20] 首次复习就失败 (rc0 lc0 iv5): after(rating1) rc=1 lc=1 iv=0 | +11min=1 +2d=1
> [JD20] 复习过一次后失败 (rc1 lc0 iv3): after(rating1) rc=2 lc=1 iv=0 | +11min=1 +2d=1
> [JD20] 多次失败后 (rc2 lc2 iv1):      after(rating1) rc=3 lc=3 iv=0 | +11min=1 +2d=1
> [JD20] 从未排过的新卡 (rc0 lc0 iv0):  after(rating1) rc=1 lc=1 iv=0 | +11min=1 +2d=1
> ```
>
> 我的复现套件里 FAIL-1 那条已被该进程改写为「修复后」断言（现 17 用例全过）。

**以下为原始诊断（保留）**

**文件:行号**
- 写入：`src/services/reviewService.ts:427`（`rating === 1` 分支 `intervalDays = 0`）
- 读取：`src/services/grammarReviewService.ts:68`（`if (intervalDays ?? 0) === 0 return false`）

**为什么测试没发现它**
1. `grammarReviewService.test.ts:34-41` 的 `makeSchedule` 夹具默认 `intervalDays: 1`，且每处调用都显式传 `intervalDays` 之外的值 —— 夹具**永远不构造 `intervalDays === 0` 且 status 非 new 的卡**，R11 那条 `return false` 从未被触发。
2. `reviewService.test.ts:70-98` 那条「rating3 语法卡不放大」的用例断言的是 `intervalDays`，**没有任何用例把 `applyReview` 的产物再喂回 `listDueGrammarReviewCards`** —— 两个服务各自被测，串起来的那一步（写入→过滤）没有测试覆盖。
3. 现有测试全部是**单次操作断言**，没有「复习一次 → 看它还会不会回来」的回合制用例。

**真实后果（用户会看到什么）**
用户在语法复习页点「想不起来了，看答案」，页面弹出反馈：**「这张卡很快会再来见你。」** —— 然后这张卡**再也不会出现**。不是 10 分钟后，不是明天，是永远：

```
[JD3] 复习前 due 张数: 1 intervalDays= 5
[JD3] rating=1 后 intervalDays= 0 nextReviewAt= 2026-09-21T13:20:15.214Z lapse= 1
[JD3] rating=1 后（10 分钟后到期）due 张数: 0
[JD3] 11 分钟后 due 张数: 0
```

```
[JD10 · FAIL-1] 看答案后即使过了 10 分钟、过了 1 天，卡也不会回到语法复习会话  ✓
```

即：**用户最需要重练的卡（看答案才算过的那些）被系统静默丢弃**。这张卡还会留在 `getWeakCardInsights` 的薄弱榜里、出现在错词书里，但从复习队列里消失 —— 「薄弱」与「练不到」同时成立。

**最小复现**

```ts
const base = makeAppData(grammarCard("c1"));       // intervalDays: 5, 已到期
expect(listDueGrammarReviewCards(base)).toHaveLength(1);

const after = applyReview(base, base.cards[0], "recall", 1, "I am drawing a picture.");
expect(after.schedules[0].intervalDays).toBe(0);                        // 通过
expect(listDueGrammarReviewCards(after)).toHaveLength(0);               // 通过（= 缺陷）
const in11min = new Date(Date.now() + 11 * 60 * 1000);
expect(listDueGrammarReviewCards(after, in11min)).toHaveLength(0);      // 通过（= 缺陷）
expect(buildGrammarReviewSession(after, 10)).toHaveLength(0);           // 通过（= 缺陷）
```

**严重度 P0**。这是「复习机制的地基漏了一块」：语法复习页唯一的失败出口（看答案）会把卡从系统里删掉。

**修复方向（未实施）**
`intervalDays` 不该同时承载「间隔天数」和「从未排过」两个语义。可选：
- R11 改用 `reviewCount === 0 && lapseCount === 0 && intervalDays === 0` 之类的组合判据；或
- 给 `Schedule` 加独立的 `neverScheduled?: boolean`；或
- 更简单：`rating === 1` 时写 `intervalDays = 0` 之外的值（如保留原值，因为 `nextReviewAt` 已经表达了「10 分钟后」，`intervalDays` 只用于分桶展示）。

---

### FAIL-2（P0）通用复习页 `/review` 把「照着题面抄」写成两次自由输出 → 语法卡被误判掌握

**文件:行号**
- 写入：`src/pages/ReviewPage.tsx:31-32`（`chooseMode`：`if (card.type === "sentence") return "recall"`）
  + `src/pages/ReviewPage.tsx:223`（`promptText = mode === "recognize" ? card.front : card.back || card.front`）
  + `src/pages/cardService.ts:428` / `src/services/lessonService.ts:223,476`（语法句子卡 `back` 写空串 `input.translation = ""`）
- 读取：`src/services/grammarReviewService.ts:431-436`（`isMasteredByOutput` 按 `mode === "recall"` 过滤）
- 后续写入：`src/pages/GrammarReviewPage.tsx:94`（`isMasteredByOutput(...)` → `applyMasteredStatus`）

**为什么测试没发现它**
这正是你点出的那个模式，而且**在 rebuild 修好之后依然存在**：
1. `grammarReviewService.test.ts:279-293` 的 `isMasteredByOutput` 用例是**合成直参** —— `ratings.map((rating, index) => ({ cardId: "c1", mode: "recall", rating, id }))`。它测的是「给定两条 recall 记录，函数返回 true 吗」，**完全不涉及「谁会写 recall」**。
2. 没有任何测试**驱动真实页面**（`/review` 或 `/grammar/review`）写 review 后，再把写出的 `reviews` 喂给 `isMasteredByOutput`。`r6c-ui-judging.test.tsx` 驱动了页面，但只断言 `rating` 与 UI 状态，不碰 `mode`，也不碰掌握判定。
3. `reviewService.test.ts` 全程用 `makeWordCard`（`type: "word"`），**从不构造语法句子卡走通用页的路径**。

**真实后果（用户会看到什么）**

语法课核心句写入时 `translation` 是空串（`addLessonCoreSentence` → `addSentence({ translation: "" })`），而通用复习页的题面是 `card.back || card.front` —— **回退成 `front`，也就是答案本身**。实测：

```
[JD9] 题面 (h2): "I think she is tired."
[JD9] 提示语: 看提示，回忆英文
[JD9] 题面 === 答案: true
[JD9] 用户抄题面即可满分：题面与答案逐字相同 = true
```

于是用户在通用复习页看到 `I think she is tired.` 摆在屏幕上，写着「看提示，回忆英文」，照抄一遍 → 满分。用户点「4 熟练」两次：

```
[JD9] reviews: [{"mode":"recall","rating":4},{"mode":"recall","rating":4}]
[JD9] isMasteredByOutput(自评, 零自由输出) = true
```

**用户在「语法句型掌握进度」条上看到「已掌握 N」+1，而这 N 里有一批卡从来没被独立输出过一次。** 掌握度是这一个页面最核心的正向反馈，现在它的一半可以由「抄两遍 + 自评熟练」制造。

**最小复现**

```ts
let data = makeAppData(grammarCard("g2", 1, 0));            // 语法句子卡
data = applyReview(data, data.cards[0], "recall", 4, "");   // 通用页点「熟练」×2
data = applyReview(data, data.cards[0], "recall", 4, "");
expect(isMasteredByOutput(data.reviews, "g2")).toBe(true);  // 通过（= 缺陷）：零自由输出
```

**严重度 P0**。区别于你给的实例：那个是「1 次被算成 2 次」，这个是「0 次被算成 2 次」。

**存活确认（最终基线）**
```
[JD21] FAIL-2 存活: true
```
即 `ReviewPage.chooseMode` 仍对句子卡返回 `"recall"`，`isMasteredByOutput`（`grammarReviewService.ts:480`）仍按 `mode === "recall"` 过滤。

**修复方向（未实施）**
`isMasteredByOutput` 不能只靠 `mode` 区分来源，因为 `recall` 有两个含义冲突的写入方。可选：给语法复习页写一条独立 mode（如 `free_type`），或让 `isMasteredByOutput` 额外要求 `answer` 非空且与 `diffJson` 一致，或让通用页对句子卡写 `recognize` 而不是 `recall`。

---

### FAIL-3（P1）`rating=3` 分支把语法句子卡的间隔**锁死在 1 天**（无进展的死亡螺旋）

**文件:行号**：`src/services/reviewService.ts:437-443`

```ts
const isGrammarSentenceCard = card.type === "sentence" && card.tags.includes("语法");
if (isGrammarSentenceCard) {
  intervalDays = Math.max(1, intervalDays || 1);   // ← 恒等于 1
}
```

**为什么测试没发现它**
`reviewService.test.ts:70-98` 只断言**单次**结果（`expect(grammarResult.data.schedules[0].intervalDays).toBe(3)`，传入的正是 `intervalDays: 3`）。**没有连续多次的轨迹断言**，所以「每次都是 `max(1, 3||1)` = 3 → 但第二次传 3 还是 3 → 因为原值没被改」看不出来：单次用例里原值恒为 3，看不出它其实**永远等于原值**，而真机里原值会先被别的分支改掉。具体来说，真机上 `intervalDays` 被 rating=1 打回 0 之后，`max(1, 0 || 1)` = 1，之后再走 rating=3 就永远是 1。

实测轨迹：

```
[JD4-A] rating=3 轨迹
#1 interval=1  ease=2.50 count=1 status=review
#2 interval=1  ease=2.50 count=2 status=review
#3 interval=1  ease=2.50 count=3 status=review
#4 interval=1  ease=2.50 count=4 status=review
#5 interval=1  ease=2.50 count=5 status=review
#6 interval=1  ease=2.50 count=6 status=review
```

**真实后果**：语法复习页 `ratingForOutcome` 把「试了 2 次以上才通过」映射为 `3`。所以用户**只要不是一次答对**（也就是复习页最常见的状态），这张卡就**每天都会到期、间隔永远 1 天**，同时在 `getMaturityBucket` 里永远落「新学」桶（`< 2`）。复习页每天都会把这些卡翻出来，卡池越积越大；而用户看到的「本次 X 张 / 共 Y 句」不变量（`session.length === 10`）会长期被同一批卡占满，新错题挤不进来。

对照：同参数的**非**语法句子卡走 `round(1 * 2.5) = 3`，间隔正常放大。

**最小复现**

```ts
let data = makeAppData(grammarCard("g3", 1, 0));
const trail: number[] = [];
for (let i = 0; i < 6; i += 1) {
  data = applyReview(data, data.cards[0], "recall", 3, "x");
  trail.push(data.schedules[0].intervalDays);
}
expect(trail).toEqual([1, 1, 1, 1, 1, 1]);      // 通过（= 缺陷）
expect(data.schedules[0].easeFactor).toBe(2.5); // 通过：ease 也不动
```

**严重度 P1**。（设计意图「多次尝试后通过 → 间隔不放大」是对的，但实现写成了「永远重置为 1」，把「不放大」做成了「不前进」。）

**存活确认（最终基线）**
```
[JD21] FAIL-3 存活: rating3 轨迹 = 1,1,1,1
```

---

### FAIL-4（P1）`rating=4` **没有**语法卡特判 → 间隔按 `ease × 1.3` 指数爆炸，4 次就跳到 159 天

**文件:行号**：`src/services/reviewService.ts:444-448`（`else` 分支，无 `isGrammarSentenceCard` 判断）

**为什么测试没发现它**
`reviewService.test.ts:70-98` 的用例标题就叫「语法句子卡 rating3 间隔不放大」——**只测了 rating 3，没测 rating 4**。`isMasteredBySpacedRepetition` 的用例（`:41-68`）只断言 `status`/`masteredAt`，**不断言 `intervalDays`**。所以「rating 3 刻意保守、rating 4 却比词卡还激进」这个口径不自洽从未被断言。

实测轨迹（同一张语法卡，全部一次答对）：

```
[JD4-A] rating=4 轨迹
#1 interval=3   ease=2.62 count=1 status=review
#2 interval=11  ease=2.74 count=2 status=review
#3 interval=41  ease=2.86 count=3 status=review
#4 interval=159 ease=2.98 count=4 status=mastered   ← 4 次就 159 天
#5 interval=641 ease=3.10 count=5 status=mastered
#6 interval=2667 ease=3.20 count=6 status=mastered  ← 7.3 年
```

对照词卡（`round(intervalDays * ease * 1.3)`，但词卡典型起始间隔更短）与设计声明「多次尝试后通过不放大间隔，防止未掌握卡被排远」—— **rating=4 的语法卡反而比 rating=3 的语法卡激进得多**，两条分支对「语法句子卡该多快毕业」给出了互相矛盾的答案。

**真实后果**：用户在语法复习里表现好（一次答对），卡片 4 次后就排到 159 天后 —— 语法复习页的「到期」几乎必然归零，用户回到 `/grammar/review` 看到「今天没有到期的语法复习」。这不是「学会了所以不用复习」，而是**排期跑飞**：`CARD_MASTERED_MIN_REVIEW_COUNT = 4` 的掌握线在 rating=4 路径上会在第 4 次就同时触发 mastered + 159 天，之后即便 `keepsMasteredStatus` 让卡不再降级（见 3.1），它也**再也不会回到队列**（因为间隔太长）。

注意这跟 FAIL-3 是同一函数里的**镜像缺陷**：rating 3（需要多试）不动，rating 4（一次答对）飞奔。

**最小复现**

```ts
let data = makeAppData(grammarCard("g4", 1, 0));
const trail = [];
for (let i = 0; i < 4; i += 1) {
  data = applyReview(data, data.cards[0], "recall", 4, "x");
  trail.push({ interval: data.schedules[0].intervalDays, status: data.cards[0].status });
}
expect(trail).toEqual([
  { interval: 3,   status: "review" },
  { interval: 11,  status: "review" },
  { interval: 41,  status: "review" },
  { interval: 159, status: "mastered" }     // 通过（= 缺陷）
]);
```

**严重度 P1**。

**存活确认（最终基线）**
```
[JD21] FAIL-4 存活: rating4 轨迹 = 3,11,41,159
```

---

### FAIL-5（P1）改错题（spot）的点选下标只取 `indexOf` 第一个同形词 —— 2 组题**判分完全反向**

**文件:行号**：`src/services/grammarBoostService.ts:205-223`（`locateMarkedTokens`，单词标注走 `cleaned.indexOf(markWords[0])`）

**为什么测试没发现它**
`grammarBoostService.test.ts:211-227`「改错题都能拿到可定位的下标」只断言**被接受的下标能判对**（`expect(judgeBoostSpot(item, index)).toBe(true)`）—— 这是**自证式断言**：拿 `item.spotWrongIndex` 去问 `judgeBoostSpot(item, item.spotWrongIndex)`，当然永远是 `true`。它**从不检查那个下标是不是真的落在错处**。`r6-judging.test.tsx:154` 同样只测「点标注的错词通过 / 点其他词判错」，输入仍是 `item.spotWrongIndex`。
`grammarBoostService.test.ts:199`「wrongMark 不得是纯标点」只检查 `/[a-zA-Z0-9]/`，不检查**带尾标点的标注在去标点后会不会歧义命中**。

**真实后果（用户会看到什么）**

全库 7 组对比卡的 `wrongMark` 在句中去标点后出现多次（`locateMarkedTokens` 剥掉尾标点后 `indexOf` 取第一个）。其中 **2 组的标注带句末标点（`.`），语义上明确指向句末那个词**，但判分只认句中第一个同形词 —— 于是：

```
[JD15] boost-lesson-66-too-to-t1-spot-contrast-1
[JD15]   句    =「It is too heavy to carry it.」
[JD15]   标注  =「it.」（带句末标点 → 语义上指向最后一个词）
[JD15]   接受  =下标 0 → 词「It」
[JD15]   句末词=下标 6 → 词「it.」判分=false

[JD15] boost-lesson-170-both-and-t1-spot-contrast-1
[JD15]   句    =「She can both sing and dance both.」
[JD15]   标注  =「both.」（带句末标点 → 语义上指向最后一个词）
[JD15]   接受  =下标 2 → 词「both」
[JD15]   句末词=下标 6 → 词「both.」判分=false
```

题面说「这句写错了——点出有问题的那个词」，**用户点真正多余的那个词 → 判错**；点一个本来正确的词（`It` / `both`）→ **判对**。判分与题面要求方向相反。

另外 5 组（`lesson-75-lets` 的 `to`、`lesson-142/143/144` 的 `will`）虽然两个同形词里有一个确实是错处，但**点另一个也判对**，题目的区分度被抹平（`As soon as I will finish, I will eat.` 两个 `will` 都接受，用户无需理解「as soon as 后不用 will」）。

**最小复现**

```ts
const cleaned = "It is too heavy to carry it.".split(/\s+/).map(t => t.replace(/[.,!?;:]$/g, "").toLowerCase());
const mark = "it.";                                    // 带句末标点的标注
const hits = cleaned.map((t, i) => t === "it" ? i : -1).filter(i => i >= 0);
expect(hits).toEqual([0, 6]);                          // 通过：两个同形词
// locateMarkedTokens 返回 [0]（第一个）——而标注的 "." 指的是下标 6
```

全库扫出的 7 组：

```
lesson-66-too-to[1]  mark="it."       hits=0,6   | It is too heavy to carry it. → It is too heavy to carry.
lesson-170-both-and[1] mark="both."   hits=2,6   | She can both sing and dance both. → …and dance.
lesson-75-lets[0]    mark="to"        hits=1,3   | Let's to go to the park. → Let's go to the park.
lesson-142-as-soon-as[0] mark="will"  hits=4,7   | As soon as I will finish, I will eat. → …
lesson-143-when-vs-as-soon-as[2] mark="will" hits=2,5
lesson-144-close-23[0] mark="will"    hits=4,7
lesson-144-close-23[3] mark="will"    hits=2,5
```

**严重度 P1**（前 2 组是判分反向，P1；后 5 组是区分度损失，P2）。

**存活确认（最终基线）**
```
[JD21] FAIL-5 存活: 歧义标注 7 组，其中带句末标点（硬错） 2 组
```

---

### FAIL-6（P2）`bothRight`（双正解）条目被当作「有问题的错句」出判断题

**文件:行号**
- 写入：`src/services/grammarBoostService.ts:734-753`（正误对比候选**不筛 `contrast.bothRight`**）
- 对比：`src/services/grammarBoostService.ts:710-711`（改错候选有 `if (contrast.bothRight) return;`）、`:759`（双正解候选有 `if (!contrast.bothRight) return;`）、`:781`（听力候选有 `if (contrast.bothRight) return;`）

**为什么测试没发现它**
`grammarBoostService.test.ts:272-277` 的断言是 `expect(contrast.contrast?.isWrong).toBe(true)` —— 它**断言了缺陷本身**：无论素材是不是双正解，构造时都写死 `isWrong: true`，所以断言恒真。
`grammarBoostService.test.ts:263-270`「全库每课档 1 都出得来 4 种不同题型」只数题型种类。
`r6-judging.test.tsx:125` 只测 `round 2-4` 有 contrast 题可达、判题按 `isWrong` 走 —— 同样不问素材正误。

**真实后果**：`lesson-76-much-better`、`lesson-87-its-cold`、`lesson-114-a-few` 三课的 `contrast` 数组里含 `bothRight: true` 的条目（两句都对）。这些条目会被投入 tier-1 的 contrast 槽位：

```
[JD2-Q1] tier1 contrast 抽到 bothRight 的次数：9
lesson-76-much-better round=2 题面「How much milk is there?」期望=有点问题
lesson-87-its-cold round=2 题面「It's cold today.」期望=有点问题
lesson-114-a-few round=2 题面「There are few apples.」期望=有点问题
（round=3、4 同样命中）
```

用户看到一句完全正确的英语（`It's cold today.`），题目问「这句话，你觉得有问题吗？」，**选「没问题」判错，必须选「有点问题」才算对**。同一份数据在课内前测（`GrammarLessonPage.tsx:808-816`）与双正解题（`judgeBoostBothRight`）里都正确处理了 `bothRight`，唯独 tier-1 contrast 漏了。

`round` 来自 `boostRoundCounter`（同课同档历史完成次数），所以**第 3 次及以上复练**这个用户的用户会撞上（`grammarBoostService.test.ts:896` 的 `rotatingSlots` 轮转决定了 round 0/1 不出 contrast 槽位）。

旧课点混题路径（`pickFirstUnseenContrast`，复用 `contrast[0]`）同样不筛，实测命中 4 处：

```
[JD2-Q2] lesson-77-keep-doing t1 tag=article 混入 lesson-76-much-better 的双正解句「How much milk is there?」
[JD2-Q2] lesson-115-have-got t1 tag=article 混入 lesson-114-a-few 的双正解句「There are few apples.」
```

**最小复现**

```ts
const lesson = GRAMMAR_LESSON_BY_ID.get("lesson-87-its-cold")!;
const bothSentences = new Set((lesson.contrast ?? []).filter(c => c.bothRight).map(c => c.wrong.trim()));
const hits = [];
for (let round = 0; round < 6; round += 1)
  for (const item of buildBoostItems(lesson.id, 1, { round }))
    if (item.kind === "contrast" && bothSentences.has(item.contrast!.sentence.trim()))
      hits.push({ round, isWrong: item.contrast!.isWrong });
expect(hits.length).toBeGreaterThan(0);            // 通过（= 缺陷）
expect(hits[0].isWrong).toBe(true);                // 通过（= 缺陷：双正解句被标成「有问题」）
```

**严重度 P2**（出现概率受 `round` 限制，但一旦出现就是明确的判分反向）。

**存活确认（最终基线）**
```
[JD21] FAIL-6 存活: bothRight 出题次数 = 9 | contrast[0].bothRight 课 = lesson-76-much-better,lesson-87-its-cold
```

---

### FAIL-7（P2）90 分通过线在长句上**单调放宽** —— free_type 的「输出」在这批卡上形同虚设

**文件:行号**
- `src/services/diffService.ts:272-277`（`diffScore = (matched + spelling*0.5) / tokens.length * 100`）
- `src/services/grammarReviewService.ts:418`（`FREE_TYPE_PASS_SCORE = 90`）
- 数据来源：`src/services/huntService.ts:268-271`（`sentenceForError` 返回**整段案件原文**）

**为什么测试没发现它**
`grammarReviewService.test.ts:268-277` 的 free_type 用例只用一句话 `"Yesterday I went to the park."`（6 词）—— **6 词句里错一个词 = 83 分，判不过**，于是看起来阈值是严的。测试从未用长句验证阈值。
`r6-judging.test.tsx:71-98` 同样只用 5 词的 `I am drawing a picture.`；`:89` 那条甚至明文写「只错一个词仍可能通过（记录当前口径）」，但只在 5-6 词上记录，**没测长句的退化**。

**真实后果**：`hunt` 案件整段成为语法卡（`sentenceForError` 返回 `caseItem.tokens.join(" ")`），全库 hunt 段 **100% ≥10 词**，中位数 19 词：

```
[JD6] 3 词：1 处 substitution → 67 分
[JD6] 5 词：1 处 substitution → 80 分
[JD6] 10 词：1 处 substitution → 90 分   ← 恰好到线
[JD6] 15 词：1 处 substitution → 93 分
[JD6] 53 词：1 处 substitution → 98 分
[JD6] 语法句子卡句长分布：n=393，≥10 词 209 条（53.2%）
```

```
[JD7] hunt 段词数 min/median/max = 10 19 53
[JD7] hunt 段「漏 1 词」仍判通过的：199 / 201
[JD7] 漏第 2 个词 → 97 分（通过）
[JD7] 漏第 2 个词 → 93 分（通过）
```

**用户在 free_type 复习长句时，少写一个词（包括漏掉本课考点）仍然判通过，且计入「一次通过」的 rating=4** —— 而 rating=4 又触发 FAIL-4 的间隔爆炸 + `isMasteredByOutput` 的「连续两次输出通过」掌握判定。三个缺陷在此处叠加：**不完整的输出 → 判通过 → 算熟练 → 间隔飞到 159 天 → 判已掌握**。

（`hunt` 卡片自带 `grammarNote`，`buildGrammarReviewTask` 会把它作为反馈展示，所以文案是贴题的；但判分阈值没有按句长调整。）

**最小复现**

```ts
const huntCase = huntCases[0];
const sentence = huntCase.tokens.join(" ");          // 19 词
const words = sentence.split(/\s+/);
const dropped = [words[1], ...words.slice(2)].join(" ");   // 漏掉第 2 个词
expect(judgeGrammarFreeType(dropped, sentence).passed).toBe(true);   // 通过（= 缺陷）
expect(judgeGrammarFreeType(dropped, sentence).score).toBeGreaterThanOrEqual(90);
```

**严重度 P2**（阈值策略问题，但后果通过 FAIL-4 被放大）。

**存活确认（最终基线）**
```
[JD21] FAIL-7 存活: FREE_TYPE_PASS_SCORE = 90   （diffScore 仍为 matched+spelling*0.5 / tokens.length）
```

---

### FAIL-8（P2）语法复习页把**正确句**写进 `review.answer`，错词书显示成「用户写了正确答案」

**文件:行号**
- 写入：`src/pages/GrammarReviewPage.tsx:89`（`applyReview(latest, current.card, reviewModeForTask(task), rating, task.sentence)`）
- 读取：`src/services/mistakeBookService.ts:97,99,104`（`review.answer.trim() || "未填写"` 作为「用户当时的答案」）

**为什么测试没发现它**
`r6c-ui-judging.test.tsx:110-130`「free_type 写错后看答案 → rating 1」断言了 `reviews[0].rating === 1`、`schedules[0].lapseCount === 1`、`nextReviewAt` 区间和文案，**唯独没有断言 `reviews[0].answer`**。
`reviewService.test.ts` 里 `answer` 参数只做传递性检查（`:31` 传 `"aproach"`），没有语义断言。
`mistakeBookService` 没有针对语法卡的测试。

**真实后果**：实测（rating=1 路径，即「看答案」）：

```
[JD5] review.answer = "I am drawing a picture."   ← task.sentence（正确句），不是用户输入
[JD5] rating= 1
[JD5] 错词书条目数 = 1
[JD5] 展示的「答案」= ["I am drawing a picture."]
[JD5] card.type = sentence → 是否进错词书: true
```

`getMistakeGroupsByDate` 不做 `type` 过滤，语法句子卡会进错词书；错词书把 `review.answer` 当作「你当时写的是」展示。于是用户在错词书里看到一条**「你的答案：I am drawing a picture.」——而这句话完全正确**。同一张卡在 `GrammarReviewPage` 里被记为「还需要再见几次」，在错词书里却显示他写对了。

**最小复现**

```ts
const base = makeAppData(grammarCard("c8"));
const after = applyReview(base, base.cards[0], "recall", 1, "I am drawing a picture.");  // 页面的实参
const entries = getMistakeGroupsByDate(after).flatMap(g => g.entries);
expect(entries[0].answers).toEqual(["I am drawing a picture."]);   // 通过（= 缺陷）
```

**严重度 P2**（不影响排期，但直接矛盾的用户可见信息）。

---

## 3. 可疑但未证实 / 口径观察

### 3.1 已掌握语法卡「只增不减」与 FAIL-1 形成死胡同（**可疑，未证实为缺陷**）

并发进程新增的 `keepsMasteredStatus`（`reviewService.ts:36-37, 500-503`）让语法句子卡一旦 mastered 就不再降级。这与 PRD「已掌握 N 只增不减」一致，但把 FAIL-1 放大：

```
[JD19] status = mastered  masteredAt = 2026-09-21T13:27:16.295Z
[JD19] intervalDays = 0  lapseCount = 1
[JD19] 通用到期队列 getDueCards = 0
[JD19] 语法复习队列 listDue = 0
[JD19] 400 天后 语法 listDue = 0
[JD19] stats.dueTotal = 0  mastered = 1
```

即：mastered 语法卡答「看答案」后 → `lapseCount` +1、`intervalDays` 归零、**仍然显示为已掌握**、**任何队列都不再收它**。用户在一个已经排不进复习队列的卡上继续花时间，且系统同时说「你已掌握这张卡」和「这张卡你想不起来了」。

我**不把它列为独立缺陷**，因为 `keepsMasteredStatus` 的行为本身有明确的 PRD 依据；但「`lapseCount` 增长却不进任何队列」这个状态是自相矛盾的，建议在修 FAIL-1 时一并复核。

### 3.2 `buildBoostSeenIndex` 的题源键跨题型共用（**可疑，未证实有用户可见后果**）

`grammarBoostService.ts:518-519` 的 `boostSourceRef` 只由 `lessonId:tier:source:index` 组成，不含题型。实测档 3 有 **191/192 课**存在 `produce` 与 `fix` 共用 `lesson-XX:t3:target:0` 的撞号：

```
[JD18] 档 3 撞号的课数：191 / 192
lesson-01-am lesson-01-am:t3:target:0 ← produce+fix
```

`buildBoostSeenIndex` 按 `sourceRef` 判定「近 7 天已练过」，所以**练过 produce 会把 fix 也标成已练**（反之亦然），复练换池时可能一次换掉两道题。我不把它列为确认缺陷，因为 `unseenFirst` 是**排序而非过滤**（注释明写「用排序而非硬过滤——池子被练完时题目仍然出得出来」），所以最坏结果是换池粒度变粗，不会出不了题。**建议**：若复练体验被反馈「一次换太多」，这里是第一嫌疑点。

注意既有测试 `grammarBoostService.test.ts:228-233`「改错题的题源引用不撞号」**只扫档 1**，档 3 的撞号从未被断言。

### 3.3 新建语法卡当天进不了复习队列（**可疑，文案与实现已自洽**）

`addSentence` 写 `status: "new"` + `createInitialSchedule` 写 `intervalDays: 0`，两条都命中 `listDueGrammarReviewCards` 的排除分支。实测：

```
[JD17] 入队后 card.status = new  schedule = {... intervalDays:0, nextReviewAt: <now>}
[JD17] 当天：空态文案出现 = true
[JD17] 掌握度条 = 语法句型 已掌握 0 / 共 1 句
```

代码注释（`grammarReviewService.ts:57-67`）明确说这是**有意为之**：空态文案承诺「明天会排进这里」。我**不列为缺陷**，但记录一个不一致：`summarizeGrammarMastery` 把这张卡算进 `notStarted: 1` 并显示「未开始 1」，同时空态文案说「明天会排进这里」—— 数值与文案都对，但**这张卡其实要等到用户先在别处（通用复习页 / 句子复习）复习它一次，才会真正进入语法复习队列**，因为它自己不会随时间变「到期」。这个落差建议产品侧确认是否有意。

### 3.4 `MistakeInsight.status` 与 `Card.status` 同名（**已排除**）

`MistakeBookPage.tsx:137` 的 `status: "mastered"` 写的是 UI 推断的展示态（`MistakeInsight`），不是 `Card.status`。确认无数据污染。

---

## 4. 验证过、没问题的方向（附方法）

| 方向 | 结论 | 验证方法 |
|---|---|---|
| `rating` 写入语义（4=最熟 / 1=忘了） | ✅ 三个写入点完全一致 | 对照 `GrammarReviewPage:29-32`、`ReviewPage:524-547`、`SpellingPage:417`；断言见 `PASS-C` |
| `rating=1/2/4` 的 `nextReviewAt` 与页面文案 | ✅ 10 分钟 / 1 天 / 拉长，与文案一致 | `PASS-B` |
| `diffService` 缩写↔全称等价 | ✅ `It's ↔ It is` 给 100 分且逐词标 `match`（不再让用户以为自己写错） | `PASS-A`；`diffService.test.ts` 已覆盖 12 组真实句对 |
| `diffService` 撇号保护（考点保护） | ✅ `its/lets/were` 判 `substitution` 而非半分，与「用错词」同待遇 | `PASS-A`；`APOSTROPHE_HOMOGRAPHS` 表口径正确 |
| `reviewService` priority 康复摘星 | ✅ 系统置位卡连续 2 次 `rating>=3` 摘星、手动标星不动、历史 lapse 不重新置位 | `reviewService.test.ts:395-507` + `reviewRecoveryAdversarial.qa.test.ts` 已覆盖 |
| `card.status` 写入点 | ✅ 只有 `applyMasteredStatus` 与 `applyReviewWithUndo` 两处，口径自洽 | 全库 grep `status: "..."`，见对照表 1.5 |
| `mode` 在 `statsService`/`unitService`/`dynamicBookService` 的 `"spelling"` 过滤 | ✅ 只有 `SpellingPage` 写 `spelling`，不与其他页面串味 | 对照表 1.2（R2/R3/R4 vs W3） |
| `diversifyReviewModes` 的确定性 | ✅ 同输入同输出 | `grammarReviewService.test.ts:185-190` |
| `grammarReviewService` 的 session 上限 / lapse 排序 / 来源交错 | ✅ 30 张 → 10 张，相邻来源不同 | `r2-session-caps.test.tsx` 已覆盖 |

---

## 5. 既有测试的夹具失真清单（「为什么测试没发现」汇总）

| 测试文件:行 | 夹具/断言失真 | 掩盖了哪条缺陷 |
|---|---|---|
| `grammarReviewService.test.ts:279-293` | `isMasteredByOutput` 用**合成直参** `{mode:"recall", rating}` 数组，绕过页面写入 | FAIL-2（`/review` 也写 `recall`）；也是你给的 `rebuild` 实例没被发现的原因 |
| `grammarReviewService.test.ts:34-41` | `makeSchedule` 默认 `intervalDays: 1`，从不构造 `intervalDays === 0` 的非 new 卡 | FAIL-1（哨兵值撞车那条分支从未被触发） |
| `grammarReviewService.test.ts:52-68` | 夹具 `status: "review"` + `intervalDays: 1`，绕过 `addSentence` 的真实写入口径（`new` + `0`） | 3.3（新卡进不了队列） |
| `grammarReviewService.test.ts:158-159` | `modeOfAt` 复刻了**只有 `% 2`** 的 modeOf，忽略 `free_type` 分支 | `diversifyReviewModes` 的真实题型分布未被断言 |
| `grammarReviewService.test.ts:165-172` | 断言 `expect(prev === curr && tailAllSame).toBe(false)` 在「所有卡 `% 2` 相同」时被短路，实测 2 次求值全部为真 | 同上（断言恒真） |
| `reviewService.test.ts:70-98` | 「语法卡 rating3 不放大」**只测单次**且只测 rating 3，不测 rating 4 | FAIL-3（无轨迹断言）、FAIL-4（rating 4 完全没测） |
| `reviewService.test.ts:41-68` | mastered 用例只断言 `status`/`masteredAt`，不断言 `intervalDays` | FAIL-4 |
| `grammarBoostService.test.ts:272-277` | `expect(contrast.contrast?.isWrong).toBe(true)` —— **断言了缺陷本身**（构造时写死 `isWrong: true`） | FAIL-6 |
| `grammarBoostService.test.ts:211-227` | 「可定位的下标」= `judgeBoostSpot(item, item.spotWrongIndex)` 必为 `true` —— 自证式断言 | FAIL-5（从不验证下标是否落在错处） |
| `grammarBoostService.test.ts:228-233` | 「题源引用不撞号」只扫**档 1** | 3.2（档 3 有 191/192 课撞号） |
| `grammarBoostService.test.ts:199-209` | 「wrongMark 不得是纯标点」只检查 `/[a-zA-Z0-9]/` | FAIL-5（带尾标点的标注歧义未测） |
| `r6-judging.test.tsx:71-98` | free_type 只用 5-6 词句；`:89` 明文「只错一个词仍可能通过」但未测长句 | FAIL-7 |
| `r6c-ui-judging.test.tsx:110-130` | 断言 `rating`/`lapseCount`/`nextReviewAt`，**唯独不碰 `reviews[0].answer`** | FAIL-8 |
| `r6-judging.test.tsx:125,154,171` | 全部用 `item.*` 的既有字段做输入，绕开「字段本身赋错值」的可能 | FAIL-5、FAIL-6 |

**贯穿性模式**：这批测试的共同点是**把产品的中间产物当作输入**（`{mode:"recall"}` 数组、`item.spotWrongIndex`、`isWrong: true`、`intervalDays: 1`），而不是**驱动真实页面/真实写入路径产出这些产物**，再断言产物本身。凡是「产物字段被赋错值」的缺陷，在这类测试里都不存在。仓库里已经有正确的做法可参考：`r6c-ui-judging.test.tsx`、`r2-session-caps.test.tsx`、`src/edge/verify/drive.ts`（驱动真实页面 + 读 `localStorage` 断言落盘结果），以及并发进程新加的 `rv1-mastery-gate.test.tsx`。

---

## 6. 红线复核（零术语 / Affective Filter）

| 检查 | 结论 |
|---|---|
| 用户可见文案无语法术语 | ✅ 复核 `GrammarReviewPage` / `GrammarBoostPage` 的全部可见字符串。唯一命中 `GRAMMAR_ZERO_TERMS` 的是历史注释与 `GRAMMAR_ERROR_TAG_LABELS`（`主谓一致`/`单复数`/`语序`/`介词`/`比较级`），后者出现在 hunt 讲解文本而非复习/强化页直接文案。**未发现新增越线** |
| 界面不出现「正确/错误/做错/答错」 | ⚠️ **1 处**：`GrammarReviewPage.tsx:374` 的 `正确的说法是：<strong>{task.sentence}</strong>`（「看答案」后的反馈）。**这是既有文案**，非本次审计引入。其余命中均在代码注释或 `grammarBoostService` 的开发注释里，不面向用户。`GrammarBoostPage.tsx:891` 的「把错的改成对的」也是可见文案，含「错的」 |
| 不允许限时 / 排名 / 体力值 | ✅ `GRAMMAR_REVIEW_TIME_BUDGET_MS` 已删除（`r2-session-caps.test.tsx` 的 R2-b 已断言全库无 `TIME_BUDGET` 导出）；复习/强化页无计时器、无排名、无体力值 |

---

## 7. 复现套件

`src/edge/verify/jd10-defects.test.ts`（17 用例，全部通过 = 下述状态成立）

```
JD10 · FAIL-1（已修 2026-09-21）看答案的卡必须能回到复习会话              (2 用例) ← 并发进程已修，断言已翻成修复后
JD10 · FAIL-2  通用复习页把「背题面」写成两次自由输出                     (2 用例) ← 存活
JD10 · FAIL-3  rating=3 把间隔锁死在 1 天                                 (2 用例) ← 存活
JD10 · FAIL-4  rating=4 的间隔指数爆炸（1→3→11→41→159 天）               (1 用例) ← 存活
JD10 · FAIL-5  spot 标注重复出现时只认第一个                              (3 用例) ← 存活
JD10 · FAIL-6  bothRight 被当成错句出判断题                               (1 用例) ← 存活
JD10 · FAIL-7  90 分线随句长放宽                                          (1 用例) ← 存活
JD10 · FAIL-8  review.answer 写正确句                                     (1 用例) ← 存活
JD10 · PASS-A/B/C  diffService 等价与撇号保护、rating 文案、跨页 rating 语义 (3 用例)
```

审计过程中的临时探针（`jd*-probe`、`gq1-probe`、`p5probe`）已全部删除。
审计本身未改动产品代码（`reviewService.ts` 的哈希与审计开始时逐字一致；
`grammarReviewService.ts` 的变动全部来自并发进程，包含 FAIL-1 的修复与 `neverQueuedSchedule` 的引入）。

---

## 8. 优先级建议

| 优先级 | 缺陷 | 一句话 | 最终基线状态 |
|---|---|---|---|
| ~~P0~~ | ~~FAIL-1~~ | ~~「看答案」= 把卡从复习系统里删掉~~ | ✅ **已修（并发进程，`neverQueuedSchedule`）** |
| **P0** | **FAIL-2** | **掌握度可以由「抄两遍 + 自评熟练」制造** | ❌ 存活 |
| P1 | FAIL-3 | 不是一次答对的卡永远 1 天间隔，卡池越积越大 | ❌ 存活 |
| P1 | FAIL-4 | 一次答对的卡 4 次后跳到 159 天，之后复习页永远空 | ❌ 存活 |
| P1 | FAIL-5 | 2 组改错题判分反向（点真错处判错） | ❌ 存活 |
| P2 | FAIL-6 | 双正解句被问「有问题吗」，选「没问题」判错 | ❌ 存活 |
| P2 | FAIL-7 | 长句漏一个词仍算「一次通过」，经 FAIL-4 放大 | ❌ 存活 |
| P2 | FAIL-8 | 错词书显示「你的答案」是那句正确句 | ❌ 存活 |

**建议的修复顺序**：FAIL-2（P0，唯一剩下的 P0）→ FAIL-3 与 FAIL-4 **必须一起改**（同一函数的两条分支对「语法句子卡该多快毕业」给出矛盾答案，只改一条会让口径更歪）→ FAIL-5（判分反向）→ FAIL-6/7/8。

**注意 FAIL-2 与 FAIL-4 的叠加效应**：两条路径会产出两种完全不同的 mastered 卡，而复习页顶部的「已掌握 N」把她们一视同仁地加起来：

```
路径 A（FAIL-2）：通用页自评「熟练」两次 + 一次真 free_type
  [JD22-A] 自评两次后 status=review   interval=11  rc=2
  [JD22-A] 一次真 free_type 后 status=mastered  interval=41  rc=3   ← 第 3 次就 mastered
  [JD22-A] reviews modes: ["recall","recall","recall"]              ← 其中 2 次是自评，不是输出

路径 B（FAIL-4）：语法复习页四次一次答对
  [JD22-B] status=mastered  interval=159  rc=4
```

路径 A 的卡在 `reviewCount = 3` 时就被置 mastered（低于 `CARD_MASTERED_MIN_REVIEW_COUNT = 4` 的 SM-2 掌握线），因为 `GrammarReviewPage.tsx:94` 的 `applyMasteredStatus` **不经 `applyReview`**，不受该阈值约束；而它写入的 `reviews` 里 3 条 `mode` 全是 `recall`，从数据上**无法区分哪两条是自评、哪一条是真实自由输出**。

—— 这也意味着：即使把 FAIL-2 的 `mode` 映射改对，**存量数据里已经混入的自评记录仍然无法追溯**（`grammarReviewService.ts:477-479` 的注释已承认同类历史数据不可追溯）。修复时需要接受这一点，或额外记录一条区分来源的字段。
