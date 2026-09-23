# 课程页键盘交互专项验证报告

日期：2026-09-21
范围：`GrammarLessonPage` / `GrammarBoostPage` / `GrammarReviewPage` / `GrammarHuntPage` / `GrammarRevisitPage`（+ 顺带扫到 `SpellingPage` / `ReviewPage` / `ConfirmDialog`）
方法：jsdom 真实挂载 + 派发真实 `KeyboardEvent`（`bubbles: true`，React 合成事件挂在外层容器上）

**重要环境说明（会影响结论的可复现性）**：本轮验证期间，有另一个 agent 在**并行修改 `src/`**，且修改内容恰好落在我这一轮的点上。观察到并已在报告中标注的变化：

1. `src/components/ConfirmDialog.tsx`：本轮开始时只有「打开时聚焦」1 处 `.focus()`；结束时已补齐 focus trap（Tab/Shift+Tab 循环）+ 背景 `inert` + 关闭时归还焦点。
2. 新增 `src/components/useReturnFocus.ts` 并接入 `GrammarLessonReviewPage` / `GrammarLessonPage` / `GrammarBoostPage` / `GrammarHuntPage`（修「判题后焦点掉 body」）。
3. `GrammarLessonPage.arrangeUndoLast`：补上判题去抖复位 + 已通过的题不撤销通关（修 D4）。

因此**本报告描述的是「撰写时刻」的源码状态**：已被修好的条目（D4、D6 的一部分、ConfirmDialog 的焦点管理）在报告里改为**验证「修好后行为」**的用例，并标明「已修」；仍未修的条目保持 willing-to-fail 断言（名字里带 `【确认缺陷 FAIL】`）。此外还观察到两次并行改动引入的 TDZ 白屏崩溃（见 D6 末尾），都在数分钟内被改好。

---

## 0. 新增测试文件与运行结果

```bash
node_modules/.bin/vitest run src/edge/verify/kb1-lesson-enter.test.tsx \
  src/edge/verify/kb2-boost-keyboard.test.tsx \
  src/edge/verify/kb3-review-hunt.test.tsx \
  src/edge/verify/kb4-arrange-keyboard.test.tsx \
  src/edge/verify/kb5-focus.test.tsx \
  src/edge/verify/kb6-aria-and-keys.test.tsx \
  src/edge/verify/kb8-revisit-keyboard.test.tsx
```

```
 ✓ src/edge/verify/ix1-arrange-keyboard.test.tsx (4 tests) 66ms   ← 既有的参考用例，一并回归
 ✓ src/edge/verify/kb8-revisit-keyboard.test.tsx (5 tests) 146ms
 ✓ src/edge/verify/kb2-boost-keyboard.test.tsx (8 tests) 202ms
 ✓ src/edge/verify/kb3-review-hunt.test.tsx (8 tests) 365ms
 ✓ src/edge/verify/kb5-focus.test.tsx (11 tests) 519ms
 ✓ src/edge/verify/kb4-arrange-keyboard.test.tsx (10 tests) 687ms
 ✓ src/edge/verify/kb6-aria-and-keys.test.tsx (18 tests) 478ms
 ✓ src/edge/verify/kb1-lesson-enter.test.tsx (8 tests) 771ms

 Test Files  8 passed (8)
      Tests  72 passed (72)
```

（`ix1-arrange-keyboard.test.tsx` 是本轮之前已有的参考用例，一并跑通，未做改动。）

新增文件（全部在 `/Users/liujun/Documents/英语听写/src/edge/verify/`）：

| 文件 | 覆盖 |
|---|---|
| `kbd.ts` | 键盘派发基建：`fireKey` / `fireWindowKey` / `fireComposingEnter`（含 `keyCode 229` 覆盖）/ `focusableIn` / `accessibleName` / `buttonsWithoutName` |
| `kb1-lesson-enter.test.tsx` | 课程页忆段 + 产出段输入框回车 |
| `kb2-boost-keyboard.test.tsx` | 趁热练 window 回车 / 输入框回车 / 自定义 Tab |
| `kb3-review-hunt.test.tsx` | 复习页 free_type 回车；侦探页 `role=button` 词块 Enter/Space |
| `kb4-arrange-keyboard.test.tsx` | 拼装区键盘等价性（拖拽 vs 键盘）；橡皮擦 vs 点击移除的对照 |
| `kb5-focus.test.tsx` | 焦点管理（判题后 / 换题 / 换段 / 弹窗进出 / inert 范围 / useReturnFocus 接入探针） |
| `kb6-aria-and-keys.test.tsx` | aria-* 清单 + 按键边界（KB6-* / KB7-*） |
| `kb8-revisit-keyboard.test.tsx` | 次日回访页填空框回车 |

命名沿用仓库既有的 **willing-to-fail** 约定（参考 `jd10-defects.test.ts`）：已确认缺陷的用例断言「缺陷仍然存在」，命名为 `【确认缺陷 FAIL】`；修好后用例会失败，正是把断言翻过来的提醒。

**未修改 `src/` 下任何产品代码。**

---

## 1. 确认的缺陷

### D1【P1 · 无障碍阻断】拼写页全局劫持 Tab —— 全文任何位置都无法用 Tab 移动焦点

**位置**：`src/pages/SpellingPage.tsx:301-306`（`window` 上的 keydown）

```ts
useEffect(() => {
  const handleKey = (event: KeyboardEvent) => {
    if (!card) return;
    if (event.code === "Space" && event.target === document.body) { ... speak ... }
    if (event.key === "Tab") {
      event.preventDefault();          // ← 没有任何前置条件
      if (!event.repeat) speak(card.front, details?.audioUrl);
    }
  };
  window.addEventListener("keydown", handleKey);
```

**复现**（`kb6-aria-and-keys.test.tsx` → KB7-9）

```ts
const onInput   = fireKey(input!, "Tab");
const onBody    = fireKey(document.body, "Tab");
const onBodyShift = fireKey(document.body, "Tab", { shiftKey: true });
```

**实际行为**（测试输出）

```
KB7-9 拼写页 Tab（输入框/正文/Shift+正文）defaultPrevented: true true true
```

- Tab 键的默认行为（移动焦点）被无条件 `preventDefault`；
- 判断里既没有 `event.shiftKey`，也没有「焦点是否在输入框内」，更没有「是否已过首屏」；
- 唯一副作用是 `speak()`（重播发音）。

**期望行为**：Tab 必须保留浏览器默认的焦点移动。若要做「Tab 重播发音」这类快捷方式，必须
① 只在焦点位于答题输入框内时生效（与 `GrammarBoostPage.tsx:1223` 的条件式写法一致），
② 显式排除 `shiftKey`，
③ 提供可见的替代按钮（拼写页已有独立的发音入口）。

**影响**：键盘用户 / 读屏用户进入拼写页后**无法离开当前焦点元素**，整个页面不可导航；Shift+Tab 同样被吃掉，连往回退都不行。这是本轮严重度最高的发现（P1：无障碍阻断）。

**严重度**：P1

**修复留白 / 注意**：`SpellingPage.tsx:455` 的 `handleInputKeyDown`（输入框 Enter 提交）没有 `isComposing` 判断，中文输入法组词时的回车会被当成提交——与 D2 同类，属同样需要一并处理的相邻问题。

---

### D2【P1 · 功能错误】次日回访页填空框回车：无 `isComposing` / 无 `shiftKey` 判断

**位置**：`src/pages/GrammarRevisitPage.tsx:260`

```tsx
onKeyDown={(e) => { if (e.key === "Enter" && clozeValue.trim()) submitCloze(); }}
```

对比：`GrammarLessonPage.tsx:2813` / `:3158`、`GrammarReviewPage.tsx:270` 都写了
`!event.shiftKey && !event.nativeEvent.isComposing`；回访页两样都没有。

**复现**（`kb8-revisit-keyboard.test.tsx` → KB8-2 / KB8-3）

```ts
fireKey(field, "Enter", { isComposing: true, keyCode: 229 });   // 中文输入法组词态
fireKey(field, "Enter", { shiftKey: true });                     // 想换行
```

**实际行为**：两次都触发了 `submitCloze()`（页面出现判题反馈 `.lesson-feedback`），因为该分支既不检查 `isComposing` 也不检查 `shiftKey`。

**期望行为**：与课内/复习页同口径——组词态回车不提交，Shift+Enter 不提交。

**影响**：中文用户用拼音输入法填词时，组词确认的那次回车会把**未写完的答案**交上去并立即判为「想不起来了」（`feedback = "retry"`），用户看到的是自己没写完的答案被判错；且该页还缺 `preventDefault`，Shift+Enter 的换行意图也被吞掉。

**严重度**：P1（功能错误 + 直接打断中文输入）

---

### D3【P1 · 无障碍阻断】趁热练输入框劫持 Tab，正常焦点移动被吃掉

**位置**：`src/pages/GrammarBoostPage.tsx:1223-1226`

```tsx
// Tab：按一级提示（和「想不起来，要一级提示」等价，顺手不用找链接）
if (event.key === "Tab" && currentItem.hints && hintLevel < currentItem.hints.length && outcome === "idle") {
  event.preventDefault();
  setHintLevel((value) => value + 1);
}
```

**复现**（`kb2-boost-keyboard.test.tsx` → KB2-2 / KB2-3）

```ts
const event = fireKey(field, "Tab");
expect(event.defaultPrevented).toBe(true);          // 默认行为被吃掉
const shiftTab = fireKey(field, "Tab", { shiftKey: true });
expect(shiftTab.defaultPrevented).toBe(true);       // Shift+Tab 同样被吃
```

**实际行为**：只要还停留在写整句的题、且提示没用完，输入框上的 **Tab 和 Shift+Tab 都被 `preventDefault`**，副作用是「提示 +1」。提示用完（`hintLevel >= hints.length`）后 Tab 才恢复默认行为。

**期望行为**：Tab 是键盘用户移动焦点的唯一手段，不应被劫持。若一定要做「Tab 要提示」，至少应：排除 `shiftKey`（否则连往回退都不行）、把该行为做成可关闭/可发现（页面上已有 `<button>想不起来，要一级提示 <kbd>Tab</kbd></button>` 作为等价入口），或改用不冲突的快捷键（如 `Ctrl+/`）。

**影响**：焦点被锁在输入框内，键盘用户无法在答题过程中跳到任意按钮（提交、看答案、离开），只能靠 Shift+Tab 之外的手段（jsdom 无法模拟的真实浏览器里也出不去）；这是无障碍阻断，且**未在任何提示文案里说明会失去 Tab 功能**。

**对比说明**：这个劫持只挂在输入框自身的 `onKeyDown` 上（测试中实测正文上的 Tab `defaultPrevented === false`），比拼写页的全局劫持温和——所以是 P1 而非 P0。

**严重度**：P1

---

### D4【P1 · 功能错误·已修】拼装区「撤销」按钮曾永久卡住判题去抖 —— 验证期间已修复

**位置**：`src/pages/GrammarLessonPage.tsx:1338-1365`（`arrangeUndoLast`），对照 `:1292-1306`（`arrangeRemove`）

判题去抖依赖 `lastJudgedLengthRef`：

```ts
const lastJudged = lastJudgedLengthRef.current;
if (next.length >= answerLen && next.length !== lastJudged) {
  lastJudgedLengthRef.current = next.length;
  judgeArrange(stage, next);
}
```

**原始复现**（也可用鼠标复现）

```text
1. 把 5 个词块按正确顺序摆满 → 判 pass，出现「下一题」
2. 点右上角的「移除最后一个词」图标按钮（aria-label="移除最后一个词"）
3. 把被移除的词块从词块库点回来 → 顺序又完全正确，长度 = 答案词数
```

**原始行为**：撤销按钮不重置 `lastJudgedLengthRef`。撤销后重摆回同一长度，`next.length === lastJudged` 成立 → 不再判题 → 页面既无通过反馈也无「下一题」，正确的句子摆在眼前却什么都没有。

**当前状态（KB4-4 / KB4-4b / KB4-6b 验证）**：`arrangeUndoLast` 已补

```ts
lastJudgedLengthRef.current = null;
const alreadyPassed = stage === "guided" ? guidedFeedback === "pass" : practiceFeedback === "pass";
setOrder(order.slice(0, -1));
if (alreadyPassed) return;          // 已通过的题：擦除不撤销通关
```

- KB4-4：已通过的题擦一块 → 仍保留 `lesson-feedback pass` 与「下一题」；摆回后仍 pass ✅
- KB4-4b：未通过的题擦一块 → 反馈清空；摆回同一长度 → **重新判题**（不再无反馈） ✅

**严重度**：P1（**已修**）

---

### D5【P1 · 功能错误·部分已修】通过态下操作拼装区词块会撤销整题通过 —— 修复漏了点击路径

**位置**：`src/pages/GrammarLessonPage.tsx:1292-1306`（`arrangeRemove`，由拼装区词块的 `onClick={() => remove(pos)}` 触发，约 `:2073`）

| 交互 | 代码 | 已通过的题被操作后 |
|---|---|---|
| 橡皮擦（`aria-label="移除最后一个词"`） | `arrangeUndoLast` | ✅ 保住 pass 与「下一题」（本轮已修） |
| **点拼装区词块**（`Enter`/`Space`/点击同效） | `arrangeRemove` | ❌ `setGuidedFeedback("idle")` 无条件执行 → pass 与「下一题」一起消失 |

**复现**（`kb4-arrange-keyboard.test.tsx` → KB4-6，与 KB4-6b 成对照）

```text
1. 摆满正确顺序 → pass，出现「下一题」
2. 焦点仍在某个拼装区词块上（键盘用户答完后焦点就在这里）
3. 再按一次 Enter / 再点一下 → onClick={() => remove(pos)}
```

**实际行为**

```
KB4-6 当前行为（缺陷）：点词块移除仍会把「通过」撤销（橡皮擦已修，点击路径漏了）
KB4-6 当前行为（缺陷）：「下一题」消失，用户必须重摆
KB4-6 误触后恢复代价：4 次移除 + 5 次添加
```

对照 KB4-6b：同样「已通过的题被擦一块」，橡皮擦路径的 `feedbackClass` 仍为 `pass`、`下一题` 仍在。

**期望行为**：`arrangeRemove` 采用与 `arrangeUndoLast` 相同的守卫（`if (alreadyPassed) return;` 或把 `setGuidedFeedback("idle")` 也纳入已通过判断）。

**影响**：键盘用户在「通过」之后多按一次 Enter（很自然的动作，焦点就在刚操作过的词块上），整题通过状态消失、无法继续；恢复方式是「全清 + 按顺序重摆」共 9 次操作。这是 D4 的余留形态，两条等价路径行为不一致本身就是缺陷。

**严重度**：P1（部分已修）

### D6【P2 · 无障碍】判题 / 换题 / 换段后焦点丢失到 `body`（验证期间部分修复；忆段与产出段仍未修）

**位置**：`GrammarLessonPage` / `GrammarBoostPage` / `GrammarReviewPage` / `GrammarHuntPage`。验证过程中有并行改动新增了 `src/components/useReturnFocus.ts` 并接入四页；但课程页的**依赖键漏了两个状态**，所以忆段（recall）与产出段（output）判题后焦点仍丢。

**复现与证据**（`kb1-lesson-enter.test.tsx` KB1-7；`kb5-focus.test.tsx` KB5-1 / KB5-2 / KB5-3 / KB5-7 / KB5-7b）

```ts
field.focus();
fireKey(field, "Enter");           // 提交
await flushAsync();
// 输入框被卸载或被 disabled → 焦点掉到 body
```

测试输出（报告撰写时的状态）

```
KB1-7 判题后焦点: BODY
KB5-1 忆段判题后焦点: BODY
KB5-1 课程页 useReturnFocus 依赖键: ${stage}:${guided.index}:${practiceIndex}:${guidedFeedback}:${practiceFeedback}
KB5-2 换段后焦点: BUTTON.lesson-chip「book.」            ← 已修
KB5-3 换题后焦点: A.ghost-link「回这一课看看」            ← 已修
KB5-7 复习页判题后焦点: BUTTON.primary-button「完成复习」  ← 已修
KB5-7b useReturnFocus 接入情况：复习页 true | 课程页 true | 趁热练 true | 侦探页 true
```

**根因（精确到行，读源码可复核）**：`GrammarLessonPage.tsx:664-667`

```ts
const stageRef = useReturnFocus<HTMLElement>(
  true,
  `${stage}:${guided.index}:${practiceIndex}:${guidedFeedback}:${practiceFeedback}`
);
```

依赖键里**没有 `recallOutcome` 与 `outputOutcome`**。忆段（`:560`）与产出段（`:550`）判题只改这两个 state，依赖键不变 → `useReturnFocus` 的 effect 不重跑 → 焦点照旧停在 `body`。KB5-1 用两条 willing-to-fail 断言把这个缺口钉住（`depKey` 不含 `recall`、不含 `output`），修好后会主动失败提醒翻转。

**期望行为**：依赖键补上 `recallOutcome` / `outputOutcome`。

**影响**：课程页是全站题量最大的页面（guided 6 题 + practice 数题 + recall + output 2 题），忆段与产出段是其中**需要打字**的两段——恰恰是键盘用户最需要焦点留在近处的两段。每答一题仍要重头 Tab。复习页 / 趁热练 / 换段 / 完课收据页已修好，实测焦点落到了 `BUTTON.lesson-chip`、`A.ghost-link`、`BUTTON.primary-button` 等页面内元素。

**严重度**：P2

**方法论备注**：jsdom **不做**真实浏览器的 UA 级焦点迁移（元素被 `disabled` 时不会自动移走焦点，对 disabled 元素调 `blur()` 也是 no-op——实测 `KB5-3 jsdom 下 disabled 元素 blur() 是否无效: true`）。所以：
- KB1-7 / KB5-1 的断言可靠（元素被**卸载**时 jsdom 同样掉到 `BODY`）；
- 要验证 `useReturnFocus` 的「只在焦点确实丢了时补」判据，必须**先手工把焦点摆到 `body`**（KB5-3 / KB5-7 都这么做），否则会得到 jsdom 假绿。

**验证期间观察到的并行改动风险（供协调者注意）**：`useReturnFocus` 的接入过程里出现过两次 TDZ 运行时崩溃，都是「hook 调用写在它引用的 state 声明之前」：`GrammarLessonPage` 的 `Cannot access 'practiceIndex' before initialization`、`GrammarReviewPage` 的 `Cannot access 'total' before initialization`。两次都在数分钟后被改好，但这类崩溃会让整页白屏（React 无 error boundary）——接入时需保证 hook 位于其依赖键所引用变量之后。

### D7【P2 · 无障碍】拼装区没有键盘等价的重排路径

**位置**：`src/pages/GrammarLessonPage.tsx:2004-2095`（`renderArrangeArea`）与 `:1292`（`arrangeMove`）

`arrangeMove` 只从 `onDrop` 回调里调用：

```tsx
onDrop={(event) => {
  event.preventDefault();
  event.stopPropagation();
  if (dragChip) {
    if (dragChip.from === "build") move(dragChip.index, pos);   // ← 唯一调用点
    else add(dragChip.index, pos);
  }
  finishDrag();
}}
```

整个拼装区**没有任何 `onKeyDown`**（KB4-2 断言 `onkeydown` 不在 DOM 中），提示文案也只为鼠标用户写：

```
点词块选上、再点取消；拖动词块可以调整位置
```

**复现**（`kb4-arrange-keyboard.test.tsx` → KB4-3）

```text
1. 摆一个「中间两词互换」的错序 → 判 retry
2. 想只换中间两个词：把第 3 块移除，再从词块库点它
3. 它只落到末尾（KB4-3 断言：末位 === 被移除的那个词）
4. 唯一可行路径：全清（5 次移除）+ 按正确顺序重摆（5 次添加）
```

**实际行为**（测试输出）

```
KB4-3 只换两个词的位置：需要 5 次移除 + 5 次添加（拖拽只需 1 次拖动）
```

**结论（有意区分「确认」与「可疑」）**：

- ✅ **确认**：拼装区**没有**任何「把某个词块插到指定位置」的键盘或点击手段。`arrangeAdd` 的 `at` 参数只有两个来源——拖拽 drop 位置、以及默认的末尾追加；点击路径永远走末尾。
- ✅ **确认**：顺序**仍然可达**（全清后按正确顺序重摆，KB4-3 断言最终 `pass`）。所以这是「低效 + 无提示」，不是「不可完成」。
- ⚠️ **可疑但未证实**：是否存在「必须中间插入、全清重摆也到不了」的题？没有找到——`guided`/`practice` 的答案词都来自同一份词块库，全清后按答案顺序逐块点即可复现任意顺序。**故不主张**「键盘用户无法完成 arrange 题」。

**期望行为（建议，未实现）**：给拼装区词块加方向键重排（`Alt+←/→` 或 `Ctrl+←/→` 移动块位置），并在 `.lesson-token-tools-hint` 里补一句键盘说法；`aria-live` 播报「词块 X 移到第 N 位」。

**严重度**：P2（可达但等价性不足；提示文案完全没提键盘）

---

### D8【P2 · 轻微】`ConfirmDialog` 的背景 inert 是「一次性快照」

**位置**：`src/components/ConfirmDialog.tsx:58-70`（并行修改后的版本）

```ts
const overlay = overlayRef.current;
const parent = overlay?.parentElement;
if (overlay && parent) {
  const siblings = Array.from(parent.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement && child !== overlay
  );
  for (const sibling of siblings) { sibling.setAttribute("inert", ""); ... }
}
```

**复现**（`kb5-focus.test.tsx` → KB5-5b）：打开弹窗后，往同一个父容器里再插入一个兄弟按钮。

**实际行为**：`inert` 只在 effect 运行的那一瞬间对「当时的兄弟」做快照，之后新增的同层节点不受保护（断言 `insideSibling.getAttribute("inert")` 为 `null`）。

**影响**：真实页面里弹窗打开期间基本不会有新兄弟节点插入，所以实际风险低；但库化使用时这是隐藏坑。**注意**：`ConfirmDialog` 在本轮验证期间被并行补齐了 focus trap + inert + 关闭归还焦点，本条的严重度按修改后的版本评估。

**严重度**：P2（覆盖缺口，非现实高频路径）

---

### D9【P2 · 体验】趁热练反馈态：焦点在各处时回车行为不一致（按钮激活 vs 全局前进）

**位置**：`src/pages/GrammarBoostPage.tsx:740-752`（window Enter）与 `:1292`（「下一题」按钮）

```ts
const onKeyDown = (event: KeyboardEvent) => {
  if (event.key !== "Enter" || event.isComposing || event.shiftKey) return;
  const active = document.activeElement;
  if (active instanceof HTMLElement && ["BUTTON", "A", "INPUT", "TEXTAREA", "SELECT"].includes(active.tagName)) return;
  event.preventDefault();
  goNextFromFeedback();
};
```

设计意图（注释明说）是「焦点在按钮/输入框上时让原生行为处理，避免回车触发两次」。

**复现**（`kb2-boost-keyboard.test.tsx` → KB2-6 / KB2-7）：答对后焦点在 `body` 上按回车 → 正常进下一题；连按 3 次 → 只推进 1 题（测试断言 `after <= before + 1`，通过）。

**实际行为**：实测一致、无重复推进（**没有问题**）。这里记录的是**设计取舍带来的不一致**：键盘用户如果在反馈态下 Tab 到「下一题」按钮再按 Enter，靠的是按钮原生行为；如果焦点不在可交互元素上，靠的是全局监听。两条路径都能前进，但 `kbd-hint` 提示 `↵` 只在无障碍树之外（`<kbd>` 无 aria 关联），读屏用户不知道有这个快捷方式。

**期望行为**：给 `kbd-hint` 补 `aria-keyshortcuts="Enter"` 与可读说明。

**严重度**：P2（仅可发现性；功能本身已验证正确，因此**不计为缺陷**，只作为无障碍小缺口记录）

---

## 2. 验证后确认「没有问题」的项（方法与结论）

### ✅ 课程页与复习页输入框：组词态回车不提交

**方法**：`fireKey(field, "Enter", { isComposing: true, keyCode: 229 })` 与严格的 `key: "Process"` 两版都派发。

**结论**：`GrammarLessonPage.tsx:2813`（忆段）、`:3158`（产出段）、`GrammarReviewPage.tsx:270` 三处判断 `!event.nativeEvent.isComposing` **有效**——`defaultPrevented === false`、`aria-live` 反馈区不出现、判分不写入。测试：KB1-2（忆段，含 `key: "Process"` 严格版）、KB1-6（产出段）、KB3-2（复习页）。

**反面证据**：同口径的检查在 `GrammarBoostPage.tsx:1217` 与 `GrammarRevisitPage.tsx:260` **缺失**（见 D2；趁热练的 KB2-4 记录的是「宽松版组词态会被提交」，与 D2 同类）。

### ✅ Shift+Enter 在课内/复习页换行而非提交

**方法**：`fireKey(field, "Enter", { shiftKey: true })` 后断言 `defaultPrevented === false` 且无反馈。

**结论**：`GrammarLessonPage` 忆段（KB1-3）、产出段（KB1-6）、`GrammarReviewPage`（KB3-2）均正确放行。趁热练与回访页**不成立**（KB2-5 / KB8-3：`defaultPrevented === true` 且触发提交）——注意趁热练的输入框是 `<input>`（单行），Shift+Enter 本就无换行语义，但「Shift+Enter 也提交」仍与「Shift 是修饰键」的普遍预期不符，且 `GrammarLessonPage` 在同项目里已给出正确范式。

### ✅ 侦探页 `tabIndex={0}` 的元素配齐了 `role` 与键盘 handler（本清单里唯一的正例）

**位置**：`src/pages/GrammarHuntPage.tsx:608-621`

```tsx
<span
  role="button"
  tabIndex={0}
  onClick={() => handleTokenClick(index)}
  onKeyDown={(event) => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); handleTokenClick(index); }
  }}
>
```

**方法**：KB3-5 / KB3-6 逐个断言 `role === "button"`、`tabindex === "0"`、可读名非空，并派发 Enter 与 Space 各一次确认罪名面板出现。

**结论**：**没有问题**。这是「只有 tabIndex 没有 role 的 div 对读屏是未知元素」这一风险的正确写法。回车与空格都 `preventDefault`，所以空格不会带着滚动页面。

### ✅ 其余 5 处 `tabIndex` 也都有 `role` + 键盘 handler

逐处核对（`None` 表示无需 `role`，因为是原生可聚焦元素）：

| 文件:行 | 元素 | role | 键盘 handler | 结论 |
|---|---|---|---|---|
| `GrammarHuntPage.tsx:608` | `span` 词块 | `role="button"` | Enter/Space | ✅ |
| `AdventurePlayPage.tsx:308` | `span` 句块 | `role="button"` | Enter/Space | ✅ |
| `UnitsPage.tsx:1259` | `span` 唤醒条 | `role="link"` | Enter/Space | ✅ |
| `UnitsPage.tsx:1599` | `div` 导入拖放区 | `role="button"` + `aria-label` | Enter/Space | ✅ |
| `LibraryPage.tsx:1721` | `div` 卡片项 | `role="button"` + `aria-selected` | Enter/Space | ✅ |
| `AdventureWorldsPage.tsx:108` | `tabIndex={locked ? -1 : 0}` | 原生 button | — | ✅ |

**自动化覆盖**：KB6-1 / KB6-3 / KB6-4 / KB6-5 / KB6-6 在课程页 / 趁热练（选择态 + 进行态）/ 复习页 / 侦探页 / 回访页各扫一遍，断言 `tabIndexWithoutRole === []`。

### ✅ 按钮可读名：5 个页面无一个「缺名按钮」

**方法**：`accessibleName()`（aria-label → aria-labelledby → title → 文本内容）+ `iconButtonsWithoutLabel()`（含 `<svg>`、无文本、无 aria-label、无 title 的按钮）。

**结论**：课程页、趁热练（两态）、复习页、侦探页、回访页扫描结果均为空数组。所有图标按钮（返回箭头、撤销、发音 `SpeakButton`、关闭）都有 `aria-label`；`SpeakButton` 默认名 `"播放发音"`（`src/components/SpeakButton.tsx:46`）。

### ✅ 反馈区普遍带 `aria-live="polite"`

清点了命中数（KB6-7 / KB6-8 断言 `> 0` 且全部为 `polite`，不用 `assertive` 打断用户）：

- 课程页答题后：`DIV.lesson-feedback pass[aria-live=polite]`
- 侦探页判定后：`SECTION.hunt-verdict-card info[aria-live=polite]`
- 复习页 / 趁热练：pass / retry 反馈卡同样带 `aria-live="polite"`

**结论**：**没有问题**。选择 `polite` 而非 `assertive` 是对的（不打断用户正在听的题干）。

### ✅ Escape 行为：课程页 / 侦探页不误伤

**方法**：KB7-3 / KB7-4 在 `document.body` 上派发 Escape，断言页面文本逐字不变；KB3-8 在罪名选择面板展开时派发，断言面板仍展开。

**结论**：课程页与侦探页**没有**全局 Escape 处理，因此不存在「误伤」；同时这也意味着罪名选择面板**没有** Escape 关闭（用户必须再点一次词块）。这是个缺失而非缺陷（面板就在词块正下方、点词块即可收起），记为事实。

**已实现的 Escape**：`ConfirmDialog.tsx`（关闭）、`AppSelect.tsx:58`（关闭下拉）、`AdventurePlayPage.tsx:565/1205`（关词义浮层 / 关跳章弹窗）、`UnitsPage.tsx:361`（关弹窗）、`LibraryPage.tsx:367`（退出批量模式）。`ConfirmDialog` 的 Escape 用 KB5-4 验证通过。

### ✅ 判题态连按回车不会重复提交 / 重复计分

**方法**：KB1-5（课程页忆段，读遥测 `lesson_step_result` 且 `section === "recall"` 的条数）、KB2-7（趁热练，读「第 X / N 题」并断言 `after <= before + 1`）、KB7-7（趁热练，连打 5 次 window Enter）。

**结论**：**没有问题**。忆段的连按不增加计分事件（`submitRecall` 首行 `recallOutcome !== "idle"` 守卫 + 输入框被卸载）；趁热练的 window 监听在 `outcome !== "pass" && outcome !== "revealed"` 时直接 return，且推进一题后 `outcome` 立刻回到 `"idle"` 并移除监听。

**注意**：`outcome === "retry"`（答错后的重试态）**刻意不劫持回车**——注释写明「用户多半在输入框里改句子」。KB2 未把它当缺陷，因为这是有意的设计且方向正确。

### ✅ 侦探页 Space 不滚动页面

**方法**：KB3-6 派发 `fireKey(token, " ")` 并断言 `defaultPrevented === true`（标题里问的「Space 在按钮上滚动页面 vs 激活按钮」在这个元素上被正确解决：`preventDefault` 阻止滚动 + 手动触发激活）。

**结论**：**没有问题**。原生 `<button>` 的 Space 由浏览器处理（keyup 时触发 click），自定义 `role="button"` 的 `span` 则显式 `preventDefault` 阻止滚动——`GrammarHuntPage` 的处理方式和原生语义一致。

### ✅ 课程页 / 复习页正文上的 Space 不被拦截（页面仍可滚动）

**方法**：KB7-2 在 `document.body` 上派发 Space，断言 `defaultPrevented === false`。

**结论**：**没有问题**。这两页没有全局 Space 处理。（`ReviewPage.tsx:139` 与 `SpellingPage.tsx:297` 有 `Space` → 重播发音，两者都限定 `event.target === document.body`，不会劫持输入框里的空格——这是好写法，可作参照。）

---

## 3. 检查了哪些元素 / 结果清单

| 页面 | 检查项 | 结果 |
|---|---|---|
| `GrammarLessonPage` 忆段输入框 `:2813` | Enter 提交 / 组词态 / Shift+Enter / 连按 | ✅ 全对 |
| `GrammarLessonPage` 产出段输入框 `:3158` | Enter 提交 / 组词态 / Shift+Enter | ✅ 全对 |
| `GrammarLessonPage` 拼装区 `:2004-2095` | 词块原生 button / Tab 序列 / 键盘重排 / 通过态可点性 / 橡皮擦 | ✅ 原生 button、可聚焦；撤销按钮有 `aria-label`。❌ D5（点词块仍撤销通关）、D7（无键盘重排；提示只讲鼠标）。D4 已修 |
| `GrammarLessonPage` 撤销按钮 | `aria-label="移除最后一个词"` | ✅ 有可读名 |
| `GrammarLessonPage` 段进度点 `:2125` | `aria-label`（`第 N / M 段`）、内部 span 纯装饰 | ✅ |
| `GrammarLessonPage` 段容器 | `section.lesson-stage[aria-label]` 逐段命名 | ✅ |
| `GrammarBoostPage` window Enter `:742` | 反馈态前进 / 连按 / 焦点在按钮时让位 | ✅（可发现性见 D9） |
| `GrammarBoostPage` 输入框 `:1217` | Enter 提交 | ✅ |
| `GrammarBoostPage` 输入框 `:1217` | 组词态回车 / Shift+Enter | ❌ 缺失判断（KB2-4 / KB2-5） |
| `GrammarBoostPage` 输入框 `:1223` | 自定义 Tab | ❌ D3（劫持 Tab / Shift+Tab） |
| `GrammarBoostPage` 档位卡 | 原生 button、可 Tab、有可读名 | ✅ |
| `GrammarBoostPage` 选项/发音/看答案 | 图标按钮可读名 | ✅ 无缺名 |
| `GrammarReviewPage` free_type `:270` | Enter / 组词态 / Shift+Enter | ✅ 全对 |
| `GrammarReviewPage` 选项 / 词块 / 拼装区 | 全在 Tab 序列内、disabled 不可聚焦 | ✅ |
| `GrammarHuntPage` 词块 `:608` | `role=button` + `tabIndex=0` + Enter/Space + 可读名 | ✅（正例） |
| `GrammarHuntPage` 罪名按钮 | Tab 可达 + 可读名 | ✅ |
| `GrammarHuntPage` Escape | 不误伤（也无面板关闭） | ✅ 无副作用 / ⚠️ 无关闭 |
| `GrammarHuntPage` 判定区 | `aria-live="polite"` | ✅ |
| `GrammarRevisitPage` 填空框 `:260` | Enter / 组词态 / Shift+Enter | ❌ D2 |
| `GrammarRevisitPage` 按钮 | 可读名 | ✅ |
| `SpellingPage` window `:301` | Tab / Shift+Tab | ❌ D1（全局劫持） |
| `SpellingPage` 输入框 `:455` | Enter + 组词态 | ❌ 无 `isComposing`（D2 同类，未单独建用例） |
| `ConfirmDialog` | 打开聚焦 / Escape / focus trap / 关闭归还 / inert 范围 | ✅（并行修改后）；⚠️ D8 inert 一次性快照 |
| `ReviewPage` window `:139` | Space 限定 `target === body` | ✅ 好写法 |

**未覆盖（明确声明）**：`AdventurePlayPage` 词义浮层（`role="dialog"`，有 Escape 关闭但无 focus trap / 无焦点归还）、`AppSelect` 下拉的完整键盘遍历（ArrowUp/Down + Enter 已有 handler，未逐键验证）、`OnboardingGuide` / `LibraryTour`（`role="dialog"`，未验证焦点管理）。这几处不在本轮「课程页」范围内，留作下一轮。

---

## 4. 缺陷汇总（按严重度）

| 编号 | 严重度 | 一句话 | 位置 |
|---|---|---|---|
| D1 | **P1** | 拼写页全局劫持 Tab（含 Shift+Tab），全文无法移动焦点 | `SpellingPage.tsx:301-306` |
| D2 | **P1** | 回访页填空框缺 `isComposing` / `shiftKey` 判断，组词态回车提交未写完的答案 | `GrammarRevisitPage.tsx:260` |
| D3 | **P1** | 趁热练输入框劫持 Tab 与 Shift+Tab，焦点被锁在输入框 | `GrammarBoostPage.tsx:1223` |
| ~~D4~~ | ~~P1~~ | 撤销按钮漏重置判题去抖：撤销后重摆对也不再判题 —— **验证期间已修**（KB4-4 / KB4-4b 验证通过） | `GrammarLessonPage.tsx:1338-1365` |
| D5 | **P1** | 通过态下**点拼装区词块**（Enter 同效）会撤销整题通过、「下一题」消失，恢复要 9 次操作。**修复只覆盖了橡皮擦，漏了这条等价路径**（KB4-6 vs KB4-6b 对照） | `GrammarLessonPage.tsx:1292-1306`（对比已修的 `:1338-1365`） |
| D6 | P2 | 判题 / 换题 / 换段后焦点掉到 `body`。换段、趁热练换题、复习页判题、完课收据页**已修**（`useReturnFocus`，KB5-2/3/7 验证通过）；**忆段与产出段仍未修**——课程页依赖键漏了 `recallOutcome`/`outputOutcome`（KB1-7 / KB5-1 实测 BODY；KB5-1 钉住依赖键内容） | `GrammarLessonPage.tsx:664-667` |
| D7 | P2 | 拼装区无键盘重排路径（顺序可达但需全清重摆；提示只讲鼠标） | `GrammarLessonPage.tsx:2004-2095` |
| D8 | P2 | `ConfirmDialog` 的 inert 是一次性快照，之后新增的同层节点不受保护 | `ConfirmDialog.tsx:58-70` |
| D9 | P2 | 趁热练 `kbd-hint` 的回车快捷方式无 `aria-keyshortcuts`，读屏不可发现 | `GrammarBoostPage.tsx:1294` 附近 |

**没有 P0**（未发现崩溃或卡死；D5 的恢复路径存在但未被提示、代价 9 次操作）。

**计数**：确认缺陷 8 条（D1–D3、D5–D9），其中 P1 四条（D1、D2、D3、D5）；1 条（D4）在验证期间被并行修复并已由测试验证。另有 2 条列为「覆盖缺口/小缺口」而非缺陷：`SpellingPage.tsx:455` 的 `isComposing`（D2 同类）、D9 的可发现性。

---

## 5. 建议的修复优先序（仅建议，本轮未改产品代码）

1. **D1**（拼写页 Tab）——加 `event.shiftKey` 排除 + 限定焦点在答题输入框内 + 提供可见替代入口。一行条件即可解除整页键盘瘫痪。
2. **D5**（拼装区，D4 已修）——`arrangeRemove`（`:1292-1306`）采用与 `arrangeUndoLast` 相同的「已通过则不置 idle」守卫。一行判断即可消除两条等价路径的行为不一致。
3. **D2**（回访页）——把课内那两行判断（`!event.shiftKey && !event.nativeEvent.isComposing` + `preventDefault`）复制过来；顺手处理 `SpellingPage.tsx:455`。
4. **D3**（趁热练 Tab）——排除 `shiftKey`，或改成 `Ctrl+/` 这类不冲突的快捷键。
5. **D6**（焦点归还）——`useReturnFocus` 已接入四页并验证有效（换段 / 换题 / 复习页 / 收据页）。**只剩一处**：把 `GrammarLessonPage.tsx:664-667` 的依赖键补上 `recallOutcome` 与 `outputOutcome`——忆段与产出段这两段「需要打字」的地方才真正需要它。
6. **D7**（键盘重排）——给拼装区词块加 `Alt+←/→` 换位，并更新 `.lesson-token-tools-hint` 文案。

---

## 6. 复现脚本（可直接粘贴）

```ts
import { mountPage, resetStorage } from "../src/edge/harness";
import GrammarLessonPage from "../src/pages/GrammarLessonPage";
import { fireKey, fireWindowKey } from "../src/edge/verify/kbd";
import { flushAsync } from "../src/edge/verify/drive";

// D1 拼写页 Tab 劫持
const page = mountPage(<SpellingPage />, "/spelling", "/spelling");
await flushAsync();
const e = fireKey(document.body, "Tab");
console.assert(e.defaultPrevented, "Tab 被吃掉 → 整页无法用键盘移动焦点");

// D3 趁热练输入框 Tab 劫持
const input = page.container.querySelector("input.large-textarea");
const t = fireKey(input, "Tab", { shiftKey: true });
console.assert(t.defaultPrevented, "Shift+Tab 也被吃 → 焦点被锁在输入框");

// D2 回访页组词态回车
const c = fireKey(clozeField, "Enter", { isComposing: true, keyCode: 229 });
console.assert(c.defaultPrevented, "组词态回车被当成提交");
```

配套断言见 `src/edge/verify/kb2-boost-keyboard.test.tsx`、`kb4-arrange-keyboard.test.tsx`、`kb5-focus.test.tsx`、`kb6-aria-and-keys.test.tsx`、`kb8-revisit-keyboard.test.tsx`。
