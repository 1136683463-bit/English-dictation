# 拖拽交互专项验证报告

- **范围**：`src/pages/GrammarLessonPage.tsx` 的 `renderArrangeArea` 与四个辅助函数（`arrangeAdd` / `arrangeRemove` / `arrangeMove` / `arrangeUndoLast`）
- **方法**：jsdom + 真实 DOM 事件驱动（`dragstart / dragover / drop / dragend`），复用 `src/edge/harness.tsx` 与 `src/edge/verify/drive.ts`
- **日期**：2026-09-21
- **产品代码**：未改动任何 `src/` 下的产品代码（仅新增测试文件）
- **行号基准**：报告写作期间 `GrammarLessonPage.tsx` 正被并发编辑（文件从 3555 行增长到约 3570 行、题库从 581 增至 584 道 arrange）。本报告行号以**写作时刻**的文件为准，每条都附了函数名，便于在行号漂移后重新定位。

---

## 0. 结论速览

| 编号 | 问题 | 位置 | 严重度 | 状态 |
| --- | --- | --- | --- | --- |
| D4 | 橡皮擦静默撤销「已通过」的题，用户既无「下一题」也无任何提示 | `arrangeUndoLast` / `:1322-1334` | **P1** | **已确认**（`it.fails` 固化） |
| D1 | 橡皮擦后重摆同长度 = 完全无反馈的死点 | `arrangeUndoLast` / `:1322-1334` | **P1** | **已确认** |
| D2 | practice 超载态拖动重排 → 旧反馈被抹掉且不重判 = 无反馈 | `arrangeMove` `:1319` | **P1** | **已确认** |
| D3 | `arrangeMove` 不更新去抖 ref，与 D1 叠加放大 | `arrangeMove` `:1302-1320` | **P2** | **已确认** |
| D5 | 拖拽中途列表变化 → `dragChip.index` 指向已变的块（搬错块） | `:2062-2080` | **P2** | **已确认** |
| D6 | 拖到区外且浏览器未派发 `dragend` → 拖拽态永久残留 | `:2068` / `:2117` | **P2** | 已确认（机制），真实触发频率未证实 |
| **K1** | **键盘无任何重排路径**：「插到中间」不可达 | 整个拼装区无 `onKeyDown` | **P1（无障碍）** | **已确认** |
| Q2 | `===`（move）与 `>=`（add）的不一致 | `:1319` vs `:1280` | — | **判定为有害**，见第 2 节 |

**任务第 2 条的明确结论**：`next.length === answerWordCount(...)` 在 guided 段（584 道，无干扰项）**恒成立，是无害差异**；但在 practice 段（1002 道，**全部**超载）**不成立，是有害缺陷**（即 D2）。所以「摆满才拖得动所以无害」这个猜测**只对了一半**——它对 guided 成立，对 practice 不成立。判定依据见第 2 节。

---

## 1. 桩了什么、真实浏览器里由谁提供

### 1.1 环境实测

```
[DG0] jsdom 拖拽 API 可用性: {"DragEvent":"undefined","DataTransfer":"undefined","MouseEvent":"function"}
```

jsdom 25 既不提供 `DragEvent` 也不提供 `DataTransfer`。`new DragEvent(...)` 抛 `TypeError`。因此本套用 **`MouseEvent` + 最小 `DataTransfer` 桩**：

| 桩的部分 | 实现 | 真实浏览器里由谁提供 |
| --- | --- | --- |
| 事件对象 | `new MouseEvent(type, {bubbles:true,cancelable:true})`，type 字符串仍是 `dragstart`/`dragover`/`drop`/`dragend` | 浏览器合成 `DragEvent`（继承 `MouseEvent`） |
| `dataTransfer` 属性 | 用 `Object.defineProperty` 手挂的内存 Map 桩（`setData`/`getData`/`clearData`/`types`/`effectAllowed`/`dropEffect`/`setDragImage`） | 浏览器实现的 `DataTransfer`，`drop` 时携带同一实例 |
| `draggable=false` 的拦截 | **jsdom 不实现**：即使 `draggable=false`，手工派发事件也一定会到达 handler | 浏览器**真的不会**为 `draggable=false` 的元素发起拖拽 |

React 18 的合成事件按 `type` 分发，不校验事件构造器，所以 `MouseEvent` 顶替 `DragEvent` 能让页面的 `onDragStart` / `onDragOver` / `onDrop` / `onDragEnd` 正常执行——这一点由 DG1 的「不抛错」用例正面证明（页面在 `onDragStart` 里写 `event.dataTransfer.setData(...)`，若 `dataTransfer` 缺失会抛 `TypeError`，测试会捕获到）。

### 1.2 因此哪些结论是「逻辑等价的」，哪些不是

**等价（可在 jsdom 里确定地验证）**：
- 三个 helper 的下标运算与结果顺序（`arrangeAdd` / `arrangeRemove` / `arrangeMove` / `arrangeUndoLast` 是纯状态运算）
- 判题触发条件（`>=` / `===` / 去抖 ref）
- `dragChip` / `insertAt` 的清理时机
- 键盘同等性（「有没有 handler」这件事与浏览器无关）

**不等价（jsdom 无法证实，已在各条下标注）**：
- 「浏览器是否会为某个元素发起拖拽」——`draggable={!selected}`（`:2111`）的真实拦截效果。jsdom 里只能验证「即使发起了，页面是否守得住」。
- **`dragend` 的真实派发时机**。D6 里「拖到区外漏发 dragend」是刻意构造的异常路径；真实浏览器对「拖到窗口外松手 / Esc 取消 / 拖到非投放区」通常仍会派发 `dragend`，所以 D6 的触发频率**未证实**（`drop` 缺失 + `dragend` 缺失的组合属于规范允许但实现上少见的情形）。
- 触摸设备/指针事件。项目只用了 HTML5 DnD，`draggable` 在 iOS Safari 与多数触屏浏览器上**不产生任何拖拽**——这意味着拼装区在 iPad/触屏笔记本上等于完全没有重排手段。**这是静态事实推断，本次未在真实触屏设备上实测**，列为「可疑但未证实」。

### 1.3 jsdom 的另一个限制（影响第 5 节）

jsdom **不实现原生 `<button>` 的 Enter/Space 默认激活行为**（不做 default action → 不派 `click`）。因此键盘的「加块/移除块」在测试里用 `click()` 代表（真实浏览器里 Enter/Space 的结果就是 click）；而「键盘重排」用 `fireKey()` 直接派发方向键/`Backspace`/`Delete` 来验证**有没有 handler**——这一条不受该限制影响。

---

## 2. 第 2 条（核心）：`===` 与 `>=` 的不一致是否构成真实缺陷

### 2.1 判定：**有害缺陷**，但不是在所有题上都发生

关键在于两类题的**词块总数与答案词数的关系完全不同**（DG0 数据扫描，真实数据）：

```
[DG0] 数据事实: {"guided":584,"guidedWithDistractors":0,"practice":1002,"practiceWithDistractors":1002,"practiceOverloaded":1002}
[DG4c] D2 影响面：practice 1002/1002 道超载｜guided 0 道超载
```

| 段 | 题量 | 有无干扰项 | 词块总数 vs 答案词数 | `arrangeMove` 的 `next.length === answerWordCount` 是否成立 |
| --- | --- | --- | --- | --- |
| guided | 584 | **全部没有**（`guidedWithDistractors=0`） | 相等 | **恒成立** → 拖动一定判题 → **无害** |
| practice | 1002 | **全部有**（`practiceWithDistractors=1002`） | 词块总数 **大于** 答案词数（1002/1002 全部超载） | 只在恰好摆到「答案词数」时才成立；摆上干扰项后不成立 → **有害** |

所以任务里那个猜测（「`next.length === answerLen` 恒成立，因为摆满才拖得动」）**对 guided 成立、对 practice 不成立**。

### 2.2 guided 侧：无害，且拖动确实能救回

`arrangeMove` `:1319` 在 guided 恒成立，因此拖动重排一定重新判题。两个正面证据：

```
[DG3] guided 满额拖动重排：["am","I","drawing","a","picture."] -> ["I","drawing","a","picture.","am"]｜反馈 retry -> retry
[DG3] guided 满额拖动后是否重新判题：true（反馈=retry）
[DG3] 拖动换回答案序：["I","am","drawing","a","picture."]｜反馈=pass｜文案="am 和 drawing 手拉手，谁也不许缺席。（刚才错过的句子已进入复习队列）"
[DG3c] 倒序摆满：["picture.","a","drawing","am","I"]｜反馈=retry
[DG3c] 拖动序列 4->0,4->1,4->2,4->3 后：["I","am","drawing","a","picture."]｜反馈=pass
```

反过来也验了「摆不满时拖动不会误判」：

```
[DG3] 未摆满拖动：["am","reading","I"]｜反馈=idle
```

**guided 侧结论：无害差异。** 不构成缺陷。

### 2.3 practice 侧：有害 —— 拖动把反馈抹掉，还不重判（D2）

复现步骤（practice 第 1 题，答案 `I am reading a book.`，词块 5 + 干扰项 `is`/`draw` = 7 块）：

1. 点满全部 7 块 → `arrangeAdd` 的 `>=` 成立 → 判错，显示提示
2. 把第 0 块拖到拼装区容器上（区内重排）

实测：

```
[DG3] practice 尽量摆满：块数=7｜反馈=retry
[DG3] 超载态拖动后：块数=7｜反馈=idle
[DG4c] 超载态拖动重排：["am","reading","a","book.","is","draw","I"]｜反馈=idle｜文案=""
```

- **实际**：反馈面板整块消失（`idle`，`feedbackText === ""`），且不再判题
- **期望**：长度 7 ≠ 5，`===` 不成立 → 不判题 **可以接受**；但 `arrangeMove` 在判题之前已经把反馈置成了 `idle`（`:1312-1318`），于是**用户此前得到的提示被抹掉，而新提示不会来**
- **危害**：practice 是 1002/1002 全部超载的段。用户摆上干扰项后看到提示，想靠拖动调整顺序，一拖之下提示消失、页面再无任何反馈。`feedbackText === ""` 是最硬的证据：提示面板里的「为什么我拼的不对？」入口也随之消失。

对照实验定位了差异根源——同样在超载态，只要走「长度变化」的路径就能拿回反馈：

```
[DG4c] 点掉一块再摆回：块数=7｜反馈=retry（走 add 路径 ≥ 条件，所以能恢复）
```

**判定依据**：`arrangeMove` `:1319` 用的是 `===`，而 `arrangeAdd` `:1280` 在注释里明确记录了「`===` 条件永不再成立 → 超载状态永远无反馈」这款**已被修过一次**的 bug（`:1274-1277` 的注释）。`arrangeMove` 漏掉了同一次修复：它既没改成 `>=`，也没有配套的「长度变化才重判」判据。因此这不是风格不一致，是**同类缺陷在第二个函数上的残留**。

---

## 3. 第 1 条：三种拖拽路径与 `arrangeMove` 下标修正矩阵

### 3.1 三条路径都工作

| 路径 | 触发点 | 实测结果 |
| --- | --- | --- |
| 库 → 拼装区（空区/区容器） | `:2044-2051` → `add(index, order.length)` | 追加到末尾 ✓ |
| 库 → 拼装区（落在某块上） | `:2074-2081` → `add(index, pos)` | 插到该块**之前** ✓ |
| 拼装区内重排（落在某块上） | `:2074-2081` → `move(from, pos)` | 见 3.2 矩阵 ✓ |
| 拼装区内重排（落在区容器） | `:2044-2051` → `move(index, order.length)` | 移到末尾 ✓ |
| 拼装区 → 库（移除） | `:2094-2099` → `remove(dragChip.index)` | 移除该块、回到库中可用 ✓ |
| 拼装区最后一块拖回库 | 同上 | 回到空态占位提示 ✓ |

```
[DG2] 库→空区：["a","drawing"]
[DG2] 拖第 0 块到第 1 块上：["I","am","reading","a"] -> ["I","am","reading","a"]（无变化）
```

### 3.2 `adjusted = to > from ? to - 1 : to` 的逐位置验证

4 块钱的全部 12 个 `(from, to)` 组合逐个验过（`from === to` 是页面显式 no-op）。判定基准取「拖到第 `to` 块上 = 插到该块之前」这一常见拖拽语义：

```
[DG2b] arrangeMove 矩阵（拖到第 to 块上 = 插到该块之前）:
ok   from=0 to=1 ["I","am","reading","a"] -> ["I","am","reading","a"]  期望 ["I","am","reading","a"]
ok   from=0 to=2 ["I","am","reading","a"] -> ["am","I","reading","a"]  期望 ["am","I","reading","a"]
ok   from=0 to=3 ["I","am","reading","a"] -> ["am","reading","I","a"]  期望 ["am","reading","I","a"]
ok   from=1 to=0 ["I","am","reading","a"] -> ["am","I","reading","a"]  期望 ["am","I","reading","a"]
ok   from=1 to=2 ["I","am","reading","a"] -> ["I","am","reading","a"]  期望 ["I","am","reading","a"]
ok   from=1 to=3 ["I","am","reading","a"] -> ["I","reading","am","a"]  期望 ["I","reading","am","a"]
ok   from=2 to=0 ["I","am","reading","a"] -> ["reading","I","am","a"]  期望 ["reading","I","am","a"]
ok   from=2 to=1 ["I","am","reading","a"] -> ["I","reading","am","a"]  期望 ["I","reading","am","a"]
ok   from=2 to=3 ["I","am","reading","a"] -> ["I","am","reading","a"]  期望 ["I","am","reading","a"]
ok   from=3 to=0 ["I","am","reading","a"] -> ["a","I","am","reading"]  期望 ["a","I","am","reading"]
ok   from=3 to=1 ["I","am","reading","a"] -> ["I","a","am","reading"]  期望 ["I","a","am","reading"]
ok   from=3 to=2 ["I","am","reading","a"] -> ["I","am","a","reading"]  期望 ["I","am","a","reading"]
[DG2b] 与「插到目标块之前」语义不符的组合：0 个 → 无
```

**`adjusted` 修正是正确的**，12/12 全部符合「插到目标块之前」。

**一处交互事实（不算缺陷，但值得知道）**：因为落点语义是「插到目标块之前」而不是「与目标块交换」，把块拖到**紧邻的右邻居**上是 no-op。用户想「交换相邻两词」时必须把它拖到再下一个块上。这在触屏/窄屏上会显得「拖了没反应」。

---

## 4. 第 3 条：判题去抖 `lastJudgedLengthRef` 与拖动的相互作用

### 4.1 D4（P1）：橡皮擦会静默撤销「已通过」的题

**这是本次最严重的一条**，因为它发生在**已经答对之后**。

复现步骤（guided 首题 `I am drawing a picture.`）：

1. 按答案依次点 5 块 → 通过，出现「下一题」
2. 点工具条的橡皮擦（`:2132` `aria-label="移除最后一个词"`，**通过态下仍可点、未禁用**）
3. 把刚移除的 `picture.` 从库里点回来

```
[DG4e] 通过 → 橡皮擦 → 摆回「picture.」：块数=5｜反馈=idle｜「下一题」=false｜「照着拼一遍」=false｜按钮=["I","am","drawing","a","picture.","a","drawing","am","I","picture.","回去再看一遍讲解"]
```

- **实际**：拼装区内容与通过时**逐块完全相同**（`I am drawing a picture.`），但反馈面板消失、`idle`、**没有「下一题」**，也没有退回任何提示。页面上只剩词块、「回去再看一遍讲解」和一个空白的工具条。
- **期望**：内容与答案一致 → 应仍是「通过」；至少应给任何反馈。
- **为什么发生**：`arrangeUndoLast` `:1322-1334` **既不重置 `lastJudgedLengthRef`，也不重新判题**。ref 仍是 `5`，摆回后 `arrangeAdd` 的 `next.length !== lastJudged`（`5 !== 5`）为假 → 不判题。而 `arrangeRemove` `:1291` 明确重置了 ref（注释写着「否则移除后再摆回同长度不判题」）——**同一款修复在橡皮擦上再次缺失**。
- **严重度 P1**：用户已经做对，只是手抖多点了一下橡皮擦，就丢掉了题目的出口。而且**这条路自己修不回来**：

```
[DG4e] 重复橡皮擦循环后：反馈=idle（橡皮擦永不重置去抖 ref，这条路修不回来）
[DG4e] 换用「点块移除」路径：反馈=pass（arrangeRemove 重置 ref → 恢复）
```

唯一的自救方式是「点拼装区里已摆的块来移除」——但那条路的产品语义是「**移除**」而不是「撤销」，用户不会想到用「移除」去恢复「撤销」。

### 4.2 D1（P1）：橡皮擦后重摆同长度 = 完全无反馈的死点

与 D4 同一根因，发生在**答错之后**：

复现：错序摆满 → 判错 → 橡皮擦 → 摆回同长度。

```
[DG4b] 橡皮擦后重摆同长度：反馈=idle｜可推进=false｜文案=""
[DG4b] practice 橡皮擦后重摆：块数=5｜反馈=idle
```

- **实际**：反馈与提示全部消失，无法推进，也没有任何出口
- **期望**：长度回到判题门槛（5 = 答案词数）就该重新判题
- **对照**（差异唯一定位到 `arrangeRemove :1291` vs `arrangeUndoLast :1322-1334`）：

```
[DG4b] 点块移除后重摆：反馈=retry（arrangeRemove 重置了 ref，所以能重判）
```

### 4.3 D3（P2）：`arrangeMove` 不更新去抖 ref

`arrangeMove` `:1302-1320` 全函数**没有任何对 `lastJudgedLengthRef` 的写入**（`arrangeAdd :1281` 有、`arrangeRemove :1291` 有）。所以：

- 拖动本身能判题（guided 恒成立，practice 恰好摆到答案词数时成立）
- 但拖动判题后 ref 保持旧值，**随后任何「长度不变」的操作都被去抖挡住**，与 D1/D4 叠加：

```
[DG4d] 拖动一次后：["a","picture.","drawing","am","I"]｜反馈=retry
[DG4d] 橡皮擦后摆回「I」：块数=5｜反馈=idle｜文案=""
```

**「摆满→判错→拖动重排→再拖动」这条序列本身不会卡住**（每次拖动都因 `===` 成立而重判）：

```
[DG3b] ① 摆满判题：["I","am","is","reading","a"] → retry（去抖 ref 已置 5）
[DG3b] ② 首次拖动：["is","I","am","reading","a"] → retry
[DG3b] ③ 再次拖动：["I","am","reading","is","a"] → retry
[DG3b] ④ 第三次拖动 → retry；⑤ 第四次拖动 → retry
```

卡住只发生在序列里**混入橡皮擦**的时候。所以 D3 本身是 P2（不单独造成死点），但它是 D1/D4 的放大器。

---

## 5. 第 4 条：边界与异常

### 5.1 `dragChip` 清理（基本齐全）

| 结束方式 | 清理点 | 结果 |
| --- | --- | --- |
| 库→区、区内重排、区→库 的 `drop` | `finishDrag()` 在每个 `onDrop` 末尾（`:2051`、`:2082`、`:2099`） | ✓ 清理 |
| 每个词块的 `dragend` | `onDragEnd={finishDrag}`（`:2068`、`:2117`） | ✓ 清理 |
| 拖到区外 | 靠 `dragend` | ✓（`drop` 没有也能清） |

```
[DG2c] dragstart 后 built.className = lesson-chip built dragging | area = lesson-build-area drag-over
[DG2c] 已通过后拖动：... 反馈=pass；区 class=lesson-build-area lit
```

**D6（P2）：`dragend` 缺失时拖拽态永久残留。** 若浏览器既没派 `drop` 也没派 `dragend`：

```
[DG2c] 漏发 dragend 后：area.className = lesson-build-area drag-over | built[0].className = lesson-chip built dragging
[DG2c] 漏发 dragend 时是否残留 .dragging：true
```

`.dragging`（不透明度 0.45）与 `.drag-over` 会一直挂着。**未证实是否会在真实浏览器触发**：规范下 `dragend` 是必须派发的（含 Esc 取消、拖出窗口）；`drop` 缺失 + `dragend` 缺失的组合属于规范允许但实现少见。**同时**：这一条即使发生也不影响判题（后续正常拖拽仍按当下源块工作，DG2c 已验证），所以只算 P2 视觉残留。

### 5.2 拖拽中途重渲染 → `dragChip.index` 指向已变的下标（**D5，P2，已确认**）

`dragChip` 存的是 **`order` 数组里的位置下标**（`:2064` `setDragChip({from:"build", index: pos})`），不是词块身份。拖拽过程中若列表被改变（另一个输入源、键盘操作、判题引发的重渲染），松手时用的是**旧下标**。

复现：拖第 2 块（`drawing`）→ 拖拽中移除第 0 块（`I`）→ 松手落在第 1 块上：

```
[DG4] 拖拽中列表变化：["I","am","drawing","a","picture."] -> ["am","drawing","a","picture."]，dragChip.index=4
[DG4] 松手后：["am","drawing","a","picture."]（index 4 越界 or 指向别块）
```

`index=4` 越界时被 `next.splice(Math.max(0, Math.min(next.length, adjusted)), 0, moved)` 的夹取救住（不崩、不丢块）。但**下标仍指向别块**时就会搬错：

```
T2: ["am","drawing","a","picture."] dragChip.index 仍是 2（=「a」）
T3: ["am","a","drawing","picture."] ← 实际搬走的是「a」（下标2），画面上却从「drawing」开始拖的
```

- **实际**：用户从画面上拖的是 `drawing`，实际被搬走的是 `a`
- **期望**：搬走用户视觉上正在拖的那一块
- **复现前提**：拖拽过程中列表发生变化。桌面鼠标单指操作时难以触发；但**键盘与鼠标并用**（Tab 到词块按 Enter 移除，同时另一手在拖）或触屏多点操作时可达
- **严重度 P2**（不崩、不丢块，只搬错一块，且下一次操作即恢复）

另外，判题导致 `passed` 变化（拼装区 `.lit` + 库里词块变 `ghost/disabled`）时**不会**让拖拽出错：已通过后继续拖动仍正常，顺序照改、不丢块（`[DG2d] 已通过后拖动：... 反馈=pass`）。原因是 `passed` 不改变 `order` 的长度或顺序，下标仍然有效。

### 5.3 从库里拖一个「已选中（disabled）」的词块

页面写法是正确的（`:2110-2111` `disabled={selected}` + `draggable={!selected}`）：

```
[DG2d] 库里已被选中的词块：draggable=false 且 disabled ✓
[DG4] 强行拖拽 disabled 块：["I"] -> ["I"]（页面 add 由 order.includes 守住）
```

- **真实浏览器**：`draggable={false}` 使浏览器**不发起**拖拽，事件根本不会产生 → 双重保险
- **jsdom**：不实现这层拦截，所以本套只能验证**第二重保险生效**：即使 `dragstart` 被强行发起、`dragChip` 被设成那个已选中的下标，`arrangeAdd` `:1260` 的 `if (order.includes(tokenIndex)) return;` 会拦住重复放入
- **结论：无缺陷。** 页面守得住，且不依赖浏览器的行为

### 5.4 同名重复词块（两个 `the`）

`order` 存的是 `tokens` 的**下标**，`shuffleTokenOrder` 与 `order.includes(tokenIndex)` 也都按下标处理，所以同名块是两个独立身份。全库有 **43 道** arrange 题含完全相同的重复词块（数据扫描），非个例。

以 `lesson-38-she-says`（`She says she will come.`，两个 `she`）实测：

```
[DG4] 重复词块题摆满：["She","says","she","will","come."]
[DG4] 拖第 2 块(she)到最前：["she","She","says","will","come."]
[DG4] 拖第 2 块到末尾：["She","says","will","come.","she"]
[DG4] 库里 she 块：1 个，disabled=[false]
```

- 拖动搬走的是**下标对应的那一块**，另一块不动 ✓
- 移除第 2 块后，库里两个 `she` 中恰好一个回到可用、另一个仍是 ghost ✓
- **结论：无缺陷。** 下标方案正确处理了重复词块

---

## 6. 第 5 条：键盘替代路径（**K1，P1 无障碍缺陷**）

### 6.1 结论：不能。键盘用户无法完成「调整已摆词块的顺序」

**事实**：

1. `arrangeMove` 只在 `renderArrangeArea` 的 drag 回调里被调用（区容器 `:2046-2049`、词块 `:2076-2083`），**全文件没有任何落在拼装区的 `onKeyDown`**（仅有的两处 `onKeyDown` 属于「忆」段与产出段的 `textarea`）。
2. 拼装区词块的 `onClick` 只有 `arrangeRemove`（`:2083`）；词块库词块的 `onClick` 只有 `arrangeAdd`（`:2118`）。
3. `arrangeAdd` 的 `at` 参数**只能由拖拽传**（`:2049`、`:2079`），从点击路径进入时 `at` 为 `undefined` → `next.push()`（`:1262`）→ **只能追加到末尾**。
4. 键盘可用的全部手段 = 加块（只会 append）、移除块、橡皮擦（移除最后一个）。

### 6.2 可执行证明

方向键与编辑键全部无效（页面没有任何 handler）：

```
[DG5] 拼装区按键效果：[{"key":"ArrowLeft","changed":false},{"key":"ArrowRight","changed":false},{"key":"ArrowUp","changed":false},{"key":"ArrowDown","changed":false},{"key":"Backspace","changed":false},{"key":"Delete","changed":false},{"key":"Home","changed":false},{"key":"End","changed":false},{"key":"PageUp","changed":false},{"key":"PageDown","changed":false}]
```

键盘在拼装区唯一能做的是「移除」：

```
[DG5] 激活第 1 块：["I","am","drawing","a"] -> ["I","drawing","a"]（移除，不是重排）
```

「移除 + 重加」永远只能追加到末尾，**穷举全部 5 种「移除第 i 块再加回」都到不了答案序**：

```
[DG5] 移除第 0 块「am」：["I","drawing","a","picture."]
[DG5] 把「am」加回来：["I","drawing","a","picture.","am"]（落到末尾）
[DG5] 改为移除并加回「drawing」：["I","a","picture.","am","drawing"]；目标=["I","am","drawing","a","picture."]
[DG5] 穷举「移除第 i 块再加回」全部 5 种：得到答案序的有 0 种
```

**同一道题、同一个错序，拖拽能修好**（证明缺口只在键盘路径，不是题目/判题的问题）：

```
[DG5] 拖拽修序：["am","I","drawing","a","picture."] -> ["I","am","drawing","a","picture."]｜反馈=pass
```

提示本身也只写给鼠标用户——「拖动词块可以调整位置」在 `title` 属性里（`:2084`），键盘可聚焦但不会朗读它；工具条那句 `lesson-token-tools-hint` 是纯文本，没有关联到控件的无障碍名。

### 6.3 为什么这是 P1 而不是 P2

- 这是 **guided 段的主力题型**（584 道 arrange），键盘用户**在结构上无法完成**其中「需要调序」的那部分题
- 现有唯一出口是「想不起来了，照着拼一遍」——那是**放弃**路径，把「做不到」记成「学不会」
- 触屏设备（iPad / 触屏笔记本）同样没有 HTML5 DnD 的拖拽，**受影响人群远大于纯键盘用户**（此点为静态推断，未真机实测）
- 最小修法方向（不在本次改动范围）：给拼装区词块加 `onKeyDown` 处理方向键 + 一个「移到第 N 位」的等价操作，或把 `arrangeAdd` 的 `at` 参数接到键盘路径上

### 6.4 与 IX1 的交叉（未重复）

`src/edge/verify/ix1-arrange-keyboard.test.tsx` 已覆盖「点击选中 / 点击移除 / 撤销按钮存在与 aria-label」。本次**未重复**那些断言，只把它当既有前提；DG5 补的是「拖拽有无键盘等价物」这一层（IX1 的第二个用例只断言了「词块是可聚焦的 button」，没有验「重排是否可达」）。

---

## 7. 新增测试文件与运行结果

| 文件 | 内容 | 结果 |
| --- | --- | --- |
| `src/edge/verify/dragDrive.ts` | 拖拽驱动 + DOM 读取工具（桩的实现与说明都在这） | — |
| `src/edge/verify/dg1-drag-baseline.test.tsx` | 基建可用性（jsdom API 缺失、桩不抛错）+ 数据事实 | 5 passed |
| `src/edge/verify/dg2-drag-paths.test.tsx` | 三条路径、`adjusted` 12 组合矩阵、`dragChip` 清理、disabled/重复词块 | 17 passed |
| `src/edge/verify/dg3-move-judging.test.tsx` | `===` vs `>=`、摆动救回、未摆满不误判、去抖序列 | 12 passed |
| `src/edge/verify/dg4-drag-boundaries.test.tsx` | 边界 + D1/D2/D3/D4 缺陷固化 | 14 passed |
| `src/edge/verify/dg5-keyboard-equivalence.test.tsx` | 键盘等价性（K1） | 5 passed |

```
 Test Files  5 passed (5)
      Tests  52 passed (52)
```

**关于 `it.fails`**：确认的缺陷用 `it.fails(...)` 写成可执行记录——断言文本写的是「正确行为应该是什么」，因此套件保持绿色，缺陷不会随时间被遗忘；产品代码修好后这些用例会转为失败，提示把 `it.fails` 改回 `it`。涉及 D1（2 处）、D2（1 处）、D3（1 处）、D4（1 处）。

**关于并发编辑**：写作期间 `GrammarLessonPage.tsx` 与 `src/data/grammarLessons.ts` 正被其他 agent 编辑（arrange 题量 581 → 584，practice 997 → 1002，页面文件出现过一个短暂的 `Cannot access 'practiceIndex' before initialization` TDZ，随后自行消失）。因此：
- 测试里的题量断言已改为「结构性断言」（`> 100`、`practiceWithDistractors === practiceTotal`）而非写死数字；
- 缺陷行号在写作时刻逐一复核过（`arrangeAdd :1254`、`arrangeRemove :1286`、`arrangeMove :1302`、`arrangeUndoLast :1322`）；
- 全量 `npx vitest run` 当时有 42 个失败，**均不属于本次新增的 dg 系列**（分布在 `a11y1-focus-loss`、`st0-probe*`、`p3-progress`、`grammarSeasons.test.ts` 等），且 `a11y1-focus-loss` 的失败与页面正在被加入的 `useReturnFocus`/`quizCardRef` 有关。本报告的 4 条缺陷在**全量运行中同样复现**，不受这些无关失败影响。

### 复现命令

```bash
npx vitest run src/edge/verify/dg1-drag-baseline.test.tsx \
  src/edge/verify/dg2-drag-paths.test.tsx \
  src/edge/verify/dg3-move-judging.test.tsx \
  src/edge/verify/dg4-drag-boundaries.test.tsx \
  src/edge/verify/dg5-keyboard-equivalence.test.tsx
```

---

## 8. 确认的缺陷 vs 可疑但未证实

### 8.1 确认的缺陷（有可执行复现 + 断言固化）

| 编号 | 一句话 | 位置 | 严重度 | 证据 |
| --- | --- | --- | --- | --- |
| **D4** | 橡皮擦静默撤销已通过的题：内容仍等于答案，却既无「下一题」也无任何提示，且这条路修不回来 | `arrangeUndoLast` `:1322-1334` | **P1** | `[DG4e]` 全组 |
| **D1** | 橡皮擦后重摆同长度 = 完全无反馈的死点，无法推进 | 同上 | **P1** | `[DG4b]` 前 3 条 |
| **D2** | practice 超载态拖动重排：旧反馈被抹掉且不重判 → 1002/1002 道题可达 | `arrangeMove :1319`（`===`） | **P1** | `[DG4c]` |
| **K1** | 键盘无任何重排路径，穷举证明「移除+重加」到不了答案序 | 拼装区无 `onKeyDown` | **P1（无障碍）** | `[DG5]` 全组 |
| **D3** | `arrangeMove` 不更新去抖 ref（D1/D4 的放大器） | `arrangeMove :1302-1320` | P2 | `[DG4d]` |
| **D5** | 拖拽中途列表变化 → 用旧下标搬错块 | `:2064` + `:2082` | P2 | `[DG4]` 第 4 条 |

### 8.2 可疑但未证实

| 项 | 为什么可疑 | 为什么未证实 | 需要的验证手段 |
| --- | --- | --- | --- |
| 触屏设备上完全无法重排 | 项目只用 HTML5 DnD（`draggable` + `dragstart`/`drop`），iOS Safari 与多数触屏浏览器不为 `draggable` 元素产生拖拽 | 本次只在 jsdom 里跑，没有真机/真浏览器 | 真机或 Playwright + 触屏模拟，手动试拖一个词块 |
| D6：`dragend` 缺失导致拖拽态永久残留 | jsdom 里构造出该路径时 `.dragging`/`.drag-over` 确实永久残留 | 规范要求 `dragend` 必派发，真实触发频率未知；且不影响判题（DG2c 已验证后续拖拽仍正确） | 真浏览器里反复拖到窗口外 / 按 Esc / 拖到浏览器 UI 上，检查 class 是否残留 |
| D5 的实际触发难度 | 逻辑上已确认会搬错块 | 需要「拖拽进行中列表被改变」。桌面单指鼠标操作难以触发；键盘+鼠标并用或触屏多点可达 | 真浏览器里用键盘移除 + 同时拖动，或触屏双指 |
| `adjust` 的「相邻右邻居 = no-op」是否造成用户困惑 | 用户想交换相邻两词时必须拖到再下一个块上；窄屏/触屏上会显得「拖了没反应」 | 这是设计选择（插到目标之前）而非 bug，缺少用户实测数据 | 可用性测试或用例回放 |
| 在 guided 段「拖动作答」的完整可完成性 | DG3c 已证明单题可从错序拖成通过 | 未逐题扫全部 584 道 guided 题的答案词数/词块是否一致（数据扫描显示 `guidedMismatch=0`，即 `tokens.length === answerWordCount` 全成立，所以理论上都可完成） | 数据扫描已覆盖，无需再验；保留为「理论已覆盖、未逐题点完」的注记 |

---

## 9. 与任务清单的逐条对应

1. **三种拖拽路径是否都工作** → ✓ 都工作；`adjusted` 12 组合全对（第 3 节）
2. **`===` 与 `>=` 是否构成真实缺陷** → **明确结论：有害。** guided（584 道）恒成立=无害差异；practice（1002 道全超载）不成立=有害缺陷 D2（第 2 节）
3. **去抖 ref 与拖动的相互作用** → 拖动本身不会卡住（每拖都重判）；**混入橡皮擦就会卡死在无反馈状态**（D1/D4）；`arrangeMove` 不更新 ref 是放大器（D3）（第 4 节）
4. **拖拽的边界与异常** → `dragChip` 清理基本齐全（D6 例外）；中途重渲染会搬错块（D5）；`draggable={!selected}` 真实拦截 + `order.includes` 双重保险，无缺陷；重复词块下标处理正确（第 5 节）
5. **键盘替代路径** → **不能**，穷举证明；P1 无障碍缺陷 K1（第 6 节）
6. **与 IX1 的交叉** → 未重复其断言；DG5 补「重排是否可达」这一 IX1 未覆盖的层面（第 6.4 节）
