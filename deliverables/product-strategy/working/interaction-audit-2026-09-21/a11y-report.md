# 焦点管理 + 无障碍语义专项验证报告

- 项目：`/Users/liujun/Documents/英语听写`（React 18 + TS + Vite + vitest/jsdom）
- 日期：2026-09-21
- 方式：jsdom 真实挂载 + `document.activeElement` 读取 + DOM 扫描；源码侧用 TypeScript AST 静态清点做交叉校对
- 产品代码：**未改动任何 `src/` 下的产品代码**，只新增测试与辅助文件
- 新增测试：3 个文件，共 35 个用例（19 fail / 16 pass；fail 即本报告确认的缺陷）

---

## 0. 运行结果

```
npx vitest run src/edge/verify/a11y1-focus-loss.test.tsx \
               src/edge/verify/a11y2-dom-scan.test.tsx \
               src/edge/verify/a11y3-confirm-dialog.test.tsx

 Test Files  3 failed (3)
      Tests  19 failed | 16 passed (35)
```

新增文件：

| 文件 | 用例 | 通过 | 失败 |
|---|---|---|---|
| `/Users/liujun/Documents/英语听写/src/edge/verify/a11y1-focus-loss.test.tsx` | 17 | 5 | 12 |
| `/Users/liujun/Documents/英语听写/src/edge/verify/a11y2-dom-scan.test.tsx` | 12 | 8 | 4 |
| `/Users/liujun/Documents/英语听写/src/edge/verify/a11y3-confirm-dialog.test.tsx` | 6 | 3 | 3 |

辅助文件（仅测试用，不含产品逻辑）：

- `/Users/liujun/Documents/英语听写/src/edge/verify/probe-pages.tsx` —— 把 `SpeakButton` / `ConfirmDialog` 这类共享组件挂进极小页面，便于扫描其可读名。

> **关于行号**：核验期间有另一个会话在并发编辑本仓库，部分文件行号发生过位移。
> 报告里所有行号都在写作前后各核对了一遍（逐行 `sed -n Np` 比对内容），与当前工作区一致。
> 若后续再改动这些文件，请以「文件 + 代码片段」为准，行号仅作定位参考。

### 方法局限（先说清楚，避免误读）

1. **jsdom 不实现原生 Tab 顺序**。`keydown` 派发 `Tab` 不会移动焦点，所以「连按 Tab 看焦点是否离开对话框」在本环境**恒为「没离开」，不能作为有 trap 的证据**。第 6 条改用可验证的替代证据：对话框打开期间背景元素**是否仍能拿到焦点**（有 trap 或对背景加 `inert`/`aria-hidden` 时应为「不能」）。
2. **jsdom 里 `element.click()` 不会移动焦点**（真实浏览器里点击会让按钮获得焦点）。所以焦点用例统一用「先 `.focus()` 再 `.click()`」模拟键盘用户的 Tab→Enter 动线。
3. jsdom 未实现 `ResizeObserver` / `window.matchMedia`（`LibraryPage`、`GrammarDiaryPage`、`StatsPage`、`Segmented` 会用到），测试内已补 no-op 垫片，否则这些页面挂载即抛。
4. 「装饰性 svg 的 `aria-hidden`」只报事实、不断言通过/失败 —— Lucide 图标默认不带，是否要全局加属于设计决策，不适合当硬失败。

---

## 1. 焦点丢失（P0，重点）—— 确认的缺陷

### 结论

**12 条真实动线里，12 条在动作完成后 `document.activeElement === <body>`。全站没有任何一处把焦点交回页面。**

根因统一：判题反馈出现后，被点击的按钮（以及整个题目 DOM）被 React 卸载，浏览器按规范把焦点退回 `<body>`；代码里没有任何「卸载后重新聚焦到新题/反馈区」的补偿。

### 为什么这不是 jsdom 假象（元验证）

同文件内有两道元验证，均通过：

- jsdom 实现了规范行为：被聚焦元素从 DOM 移除 → `activeElement` 退回 `<body>`
- 这些「下一题 / 下一张」按钮在判题后**确实被卸载**（不是仍在 DOM 里只是失焦）

```
[元验证] 「下一张」判题后仍在 DOM = false
```

两条合起来，浏览器里发生的是同一件事。

### 清单：哪些页面 / 哪些动作会丢焦点

| # | 页面 | 动作（复现步骤） | 动作后焦点 | 证据 |
|---|---|---|---|---|
| 1 | `GrammarLessonPage` 正课·前测 | 点选项答题 → 点「下一题」 | `BODY` | `[课程页/前测] 判题后=BUTTON.lesson-option["is"] → 点下一题后=BODY(焦点丢失)` |
| 2 | `GrammarLessonPage` 正课·前测第 2 题 | 答对比题 → 点「看看结果」 | `BODY` | `[课程页/前测对比] 点看看结果后=BODY(焦点丢失)` |
| 3 | `GrammarLessonPage` 看段 | 点「下一步：搭装与对错」换步 | `BODY` | `[课程页/看段] 点下一步后=BODY(焦点丢失)` |
| 4 | `GrammarLessonPage` guided 段 | 拼装判题通过 → 点「下一题」 | `BODY` | `[课程页/guided] 判题后=BUTTON.lesson-chip.ghost["picture."] → 点下一题后=BODY(焦点丢失)` |
| 5 | `GrammarReviewPage` | 填空答对 → 点「下一张」 | `BODY` | `[复习页] 点下一张后=BODY(焦点丢失)` |
| 6 | `GrammarReviewPage` | 答完最后一卡 → 点「完成复习」进结算页 | `BODY` | `[复习页/结算] 完成后=BODY(焦点丢失) \| 结算页=true` |
| 7 | `GrammarReviewPage` | 自由输出（textarea）提交 | `BODY` | `[复习页/自由输出] 提交后=BODY(焦点丢失)` |
| 8 | `GrammarBoostPage` | 答对 → 点「下一题」 | `BODY` | `[强化页] 点下一题后=BODY(焦点丢失)` |
| 9 | `GrammarBoostPage` | 自由产出（textarea，档 3）提交 | `BODY` | `[强化页/自由产出] 使用 tier=3` / `[强化页/自由产出] 提交后=BODY(焦点丢失)` |
| 10 | `GrammarHuntPage` | 点词块选中 → 选罪名 | `BODY` | `[侦探页] 点词后=SPAN.hunt-token.inspecting["go"] → 选罪名后=BODY(焦点丢失)` |
| 11 | `GrammarHuntPage` | 全部命中 → 破案结算 | `BODY` | `[侦探页/结算] 破案=true 焦点=BODY(焦点丢失)` |
| 12 | `GrammarHuntPage` | 误判（点没问题的词）→ 反馈卡出现 | `BODY` | `[侦探页/误判] 反馈卡=true 焦点=BODY(焦点丢失)` |

### 检查后**没问题**的项

| 页面 / 动作 | 结果 | 证据 |
|---|---|---|
| `GrammarDiaryPage` 切换题组（3 句 / 5 句 / 10 句） | **焦点正确落在被点的按钮上** | `[日记页] 切组前=TEXTAREA.diary-input[""] → 切组后=BUTTON.diary-count-btn.on["10 句"]` |
| `GrammarDiaryPage` 点「写完了，一次性批改」 | **焦点正确停在按钮上**（该按钮未卸载） | `[日记页/批改] 提交后=BUTTON.primary-button["写完了一起批改"]` |
| 点位图（chip）本身 | **不丢**：选中操作不卸载按钮 | 见 #4 的「判题后」半边：`BUTTON.lesson-chip.ghost["picture."]` |

> 注：日记页两条之所以没丢，是因为被点元素没被卸载 —— 这反过来印证了「丢焦点的都是被卸载的按钮」这一根因。

### 影响

键盘 / 读屏用户每次「答一题 → 进下一题」都要**从页面开头重新 Tab**。以正课 guided 段（6 题）为例，每题的焦点重建成本 = 重新穿过顶部返回按钮、段标、题面提示才能到词块库；一节课就是 6 次、一档强化题 4 次、侦探一局 2 次以上。这是本报告最严重的一项。

### 期望

在判题反馈渲染后，把焦点移到新题的第一个可交互元素，或移到反馈区本身（`tabIndex={-1}` + `focus()`），并配 `aria-live` 播报。至少应保证焦点**仍然落在页面内容区**而不是 `<body>`。

---

## 2. 图标按钮的可读名 —— 完整清单（P1）

### 方法

两道独立证据交叉校对：

1. **静态（TypeScript AST）**：遍历全部 `.tsx`（排除 `*.test.tsx`），用 AST 判定「button 子树里没有任何可见文本」（字符串字面量 / JSX 文本 / 模板字面量），且子树里含图标元素或 `svg`。共 382 个 `<button>`。
2. **动态（jsdom 渲染）**：挂载 17 个页面（含共享组件探针页），对渲染结果的 `textContent` 去空白后为空、且含 `svg` 的 `button` 逐个读取 `aria-label` / `aria-labelledby` / `title`。

静态共 **47 个**无文字按钮；DOM 首屏可见 **21 个**（其余在弹窗 / 展开态 / 二级页里，静态清单覆盖）。

判定口径：
- **合格** = 有 `aria-label` 或 `aria-labelledby`
- **弱名称** = 只有 `title`（ACCNAME 里 title 是**最后兜底**，只在无其它名称来源时生效；多数屏幕阅读器对纯 title 播报不稳定）
- **无名称** = 三者全无 → 屏幕阅读器只读「按钮」

### 汇总

| 分类 | 数量 |
|---|---|
| 无文字按钮（静态） | 47 |
| — 有 `aria-label` | 28 |
| — **仅 `title`（弱名称）** | **16** |
| — **无任何名称（P1）** | **3** |

### 2a. 无任何名称（P1，屏幕阅读器只读「按钮」）—— 3 个，全部在 `SentencesPage`

| 文件:行号 | 图标 | 按钮作用 | 可读名 |
|---|---|---|---|
| `/Users/liujun/Documents/英语听写/src/pages/SentencesPage.tsx:188` | `Trash2` | 移除该句的真人发音（有 audioUrl 时才渲染） | **无** |
| `/Users/liujun/Documents/英语听写/src/pages/SentencesPage.tsx:192` | `Star` | 把该句标为重点 / 取消重点（用 `className` 表示选中，无 `aria-pressed`） | **无** |
| `/Users/liujun/Documents/英语听写/src/pages/SentencesPage.tsx:195` | `Trash2` | 删除该句子卡 | **无** |

复现：进入「句子库」→ 页面有至少一张句子卡 → 用 Tab 走过卡片右侧的操作区。
实际：三个按钮的可访问名均为空。期望：每个都补 `aria-label`（如「移除「{card.front}」的真人发音」/「把「{card.front}」标为重点」/「删除「{card.front}」」）；重点按钮建议同时补 `aria-pressed={card.priority}`。

证据（DOM，`[SentencesPage] 无文字按钮:`）：

```json
[
  { "index": 2, "className": "icon-button", "ariaLabel": "播放发音", "nameSource": "aria-label" },
  { "index": 3, "className": "icon-button danger-icon", "ariaLabel": null, "nameSource": "none" },
  { "index": 4, "className": "icon-button ",         "ariaLabel": null, "nameSource": "none" },
  { "index": 5, "className": "icon-button",          "ariaLabel": null, "nameSource": "none" }
]
```

断言输出：`SentencesPage 有 3 个无名称图标按钮: expected 3 to be +0`

> 对照：同一项目的 `LibraryPage`（同类卡片操作）**已正确补了** `aria-label`，例如
> `/Users/liujun/Documents/英语听写/src/pages/LibraryPage.tsx:1771` 的 `aria-label={card.priority ? \`取消「${card.front}」的重点标记\` : \`把「${card.front}」标为重点\`}`、
> `:1784` `恢复「…」`、`:1793` `暂停「…」`。
> 也就是说 `SentencesPage` 是漏做，不是有意取舍。

### 2b. 仅靠 `title` 命名（弱名称，P2 建议补 `aria-label`）—— 16 个

| 文件:行号 | 图标 | 按钮作用 | 现有名称 |
|---|---|---|---|
| `/Users/liujun/Documents/英语听写/src/pages/UnitsPage.tsx:1201` | `Trash2` | 删除分组 | `title="删除分组"` |
| `/Users/liujun/Documents/英语听写/src/pages/UnitsPage.tsx:1322` | `X` | 关闭导入引导提示条 | `title="关闭提示"` |
| `/Users/liujun/Documents/英语听写/src/pages/UnitsPage.tsx:1334` | `X` | 关闭导入结果提示条 | `title="关闭提示"` |
| `/Users/liujun/Documents/英语听写/src/pages/UnitsPage.tsx:1400` | `X` | 关闭「创建自定义词书」弹窗 | `title="关闭弹窗"` |
| `/Users/liujun/Documents/英语听写/src/pages/UnitsPage.tsx:1463` | `ArrowLeft` | 章节前移 | `title="前移章节"` |
| `/Users/liujun/Documents/英语听写/src/pages/UnitsPage.tsx:1466` | `ArrowRight` | 章节后移 | `title="后移章节"` |
| `/Users/liujun/Documents/英语听写/src/pages/UnitsPage.tsx:1471` | `X` | 删除章节 | `title="删除章节"` |
| `/Users/liujun/Documents/英语听写/src/pages/UnitsPage.tsx:1514` | `X` | 关闭「导入词书」弹窗 | `title="关闭弹窗"` |
| `/Users/liujun/Documents/英语听写/src/pages/UnitsPage.tsx:1764` | `X` | 关闭词书详情弹窗 | `title="关闭弹窗"` |
| `/Users/liujun/Documents/英语听写/src/pages/UnitsPage.tsx:2025` | `X` | 把词移出词书 | `title="移出词书"` |
| `/Users/liujun/Documents/英语听写/src/pages/WordsPage.tsx:651` | `Trash2` | 移除真人发音 | `title="移除真人发音"` |
| `/Users/liujun/Documents/英语听写/src/pages/WordsPage.tsx:659` | `Star` | 设为重点 / 取消重点 | `title={card.priority ? "取消重点" : "设为重点"}` |
| `/Users/liujun/Documents/英语听写/src/pages/WordsPage.tsx:666` | `Trash2` | 删除单词 | `title="删除单词"` |
| `/Users/liujun/Documents/英语听写/src/pages/MistakeBookPage.tsx:913` | `ChevronRight`/`ChevronDown` | 展开 / 收起这条故事生成记录（`aria-expanded` 也缺失） | `title={isExpanded ? "收起内容" : "展开内容"}` |
| `/Users/liujun/Documents/英语听写/src/pages/MistakeBookPage.tsx:919` | `MbCopy`/`MbCheck` | 复制这条故事内容（复制成功态只靠图标切换） | `title="复制内容"` |
| `/Users/liujun/Documents/英语听写/src/pages/SpellingPage.tsx:778` | `Volume2` | 重新播放该词的发音（40px 大图标按钮） | `title="播放发音"` |

复现（以 `UnitsPage` 为例）：进入「词书」→ 有分组时，分组标题右侧的垃圾桶按钮；Tab 到它。
实际：只有 `title`。期望：补 `aria-label`（可与 title 同文案）。

证据（DOM）：

```
[图标按钮] 共 21 个无文字按钮；aria-label 13 个；仅 title 2 个；无任何名称 6 个
  [仅 title] UnitsPage（词书） #3 .icon-button title="删除分组"
  [仅 title] UnitsPage（词书） #10 .icon-button title="删除分组"
[仅 title 命名] 共 2 个：UnitsPage（词书）#3.icon-button(title="删除分组") | UnitsPage（词书）#10.icon-button(title="删除分组")
```

> 说明：#3 与 #10 是同一模板渲染的两处（分组标题 + 分组内容区各一个），DOM 首屏只暴露 2 个；静态清单里 `UnitsPage` 的其余 `title`-only 按钮在弹窗 / 章节编辑展开态里，需要交互后才出现，所以 DOM 首屏计数只到 2。

### 2c. 检查后没问题的项

- 全站 **28 个**无文字图标按钮已有 `aria-label`，且用词具体（不是笼统的「按钮」）。质量较好的样例：
  - `src/components/SpeakButton.tsx:37` `aria-label={ariaLabel ?? "播放发音"}`
  - `ReviewPage.tsx:427` `aria-label={card.priority ? "取消重点" : "标记重点"}`
  - `src/pages/GrammarLessonPage.tsx:2093` `aria-label="移除最后一个词"`（配 `title`）
  - `src/pages/AdventurePlayPage.tsx:1255/1265` 「上一句」「下一句」
  - `src/pages/AdventurePage.tsx:549` `` aria-label={`删除路线 ${adventure.title}`} ``
- 无「图标按钮靠子元素文本兜底」的隐患：所有无文字按钮都已在本清单里。

---

## 3. `aria-live` 的正确性（P1）—— 全部是「新插入」

### 结论

**判题反馈的 live region 是判题后才新插入的元素，不是「预先存在、内容变化」。**

多数屏幕阅读器（NVDA / JAWS / VoiceOver）对**动态插入**的 live region **不会播报** —— 它们需要在插入时就已存在（或至少在 DOM 中稳定存在一段时间），随后**内容变化**才会触发播报。因此当前实现的 `aria-live="polite"` 在这些读屏器上等于**无效**：判题结果不会被读出来。

### 逐页检查

| 页面 | 答题前 live region 数 | 判题后 live region 数 | 结论 |
|---|---|---|---|
| `GrammarReviewPage` | **0** | 1 | 新插入 |
| `GrammarLessonPage`（正课·前测） | **0** | 1 | 新插入 |
| `GrammarBoostPage` | 0 | 1 | 新插入 |
| `GrammarRevisitPage` | 0 | 0（初始态无可答的题） | 无 live region |
| `GrammarReauditPage` | 0 | — （未解锁态） | 无 live region |
| `GrammarReplayPage` | 0 | — （未解锁态） | 无 live region |

证据：

```
[复习页] 答题前 live region 数=0
[复习页] 判题后 live region 数=1；DIV.lesson-feedback pass[aria-live=polite]
[课程页] 初始（前测）live region 数=0
[课程页] 前测答题后 live region 数=1
```

### 相关代码位置

反馈区都在条件渲染里，条件成立时才挂载：

- `/Users/liujun/Documents/英语听写/src/pages/GrammarReviewPage.tsx:360` `{outcome === "pass" && (<div className="lesson-feedback pass" aria-live="polite"> …`
- `/Users/liujun/Documents/英语听写/src/pages/GrammarReviewPage.tsx:372` `{outcome === "revealed" && (<div className="lesson-feedback retry" aria-live="polite"> …`
- `/Users/liujun/Documents/英语听写/src/pages/GrammarLessonPage.tsx:2941`、`:2958`（practice）、`:2732`、`:2745`（guided）、`:2310`（前测）等共 12 处 `lesson-feedback … aria-live="polite"`
- `/Users/liujun/Documents/英语听写/src/pages/GrammarBoostPage.tsx:1259`（pass）、`:1301`（retry）
- `/Users/liujun/Documents/英语听写/src/pages/GrammarHuntPage.tsx:643`、`:653` —— 同样是条件渲染的反馈卡

复现：进入任一答题页 → 用 devtools 观察 DOM → 答题前搜 `[aria-live]` 无结果；答题后才出现。

期望：把一个常驻的（页面挂载时就存在、内容初始为空）的 live region 放在题目卡附近，判题时只更新其文本内容。例如：

```tsx
<p className="sr-only" role="status" aria-live="polite">{feedbackText}</p>  {/* 始终挂载 */}
```

### 注意：`aria-live` 数量并非越多越好

静态清点显示全站有 **47 处** `aria-live`（全部 `polite`；`GrammarLessonPage` 17、`AdventurePlayPage` 5、`ImportPage` 4、`GrammarBoostPage` 3、`WordsPage` 3、`GrammarRevisitPage`/`GrammarReviewPage`/`GrammarReplayPage`/`ReviewPage`/`GrammarHuntPage` 各 2、其余 5 个文件各 1）。这 47 处**全部在条件渲染里**，同一时刻只会有 1 处存在，所以不存在「多处同时播报」的问题；但也因此**每一处都落在「新插入不播报」的同一个坑里**。

### 检查后**没问题**的项

- `GrammarHuntPage` 的 `aria-live` 用法本身没有重复/嵌套问题（`:643` 提示卡 与 `:653` 反馈卡是互斥的两支）。
- 未发现 `aria-live="assertive"` 的滥用（全站只用 `polite`），符合「不打断用户」的取向。

---

## 4. 语义结构（P2）

### 4a. 标题层级

| 页面 | h1 | h2 | h3 | 结论 |
|---|---|---|---|---|
| `GrammarLessonPage`（正课·前测） | **0** | **0** | **0** | **全页零标题**（P2） |
| `GrammarReviewPage` | 1 | 0 | 0 | 合格 |
| `GrammarBoostPage` | 1 | 0 | 0 | 合格 |
| `GrammarHuntPage` | 1 | 29 | 0 | 合格（29 个 h2 = 28 季 + 1；数量多但层级正确） |
| `GrammarDiaryPage` | 1 | 2 | 0 | 合格 |
| `GrammarPathPage` | 1 | 1 | 0 | 合格 |
| `GrammarReplayPage` | 1 | 0 | 0 | 合格 |
| `GrammarRevisitPage` | 1 | 0 | 0 | 合格 |
| `GrammarReauditPage` | 1 | 0 | 0 | 合格 |
| `SentencesPage` | 1 | 1 | 0 | 合格 |
| `ReviewPage` | 1 | 1 | 0 | 合格 |
| `LibraryPage` | 1 | 1 | 0 | 合格 |
| `UnitsPage` | 1 | 4 | 0 | 合格 |
| `WordsPage` | 1 | 0 | 0 | 合格 |
| `StatsPage` | 1 | 0 | 0 | 合格 |
| `ImportPage` | 1 | 6 | 0 | 合格 |
| 探针页 | 1 | 0 | 0 | — |

- **无跳级**：17 个页面全部 `层级跳级=false`（不存在「h3 而前面没 h2」这类问题）。
- **唯一问题**：`GrammarLessonPage` **一个标题都没有**。该页顶部栏用的是 `<strong>` + `<span>`（`/Users/liujun/Documents/英语听写/src/pages/GrammarLessonPage.tsx:2137` 的 `lesson-topbar-title`，里面是 `<strong>`），段内小标题用的是 `<h2>`，但**页面级 h1 缺失**，且整页在**非完课态**下连 h2 也没有（`:2196`/`:2219`/`:2228`/`:2249` 的 h2 都在完课结算或特定分支里）。

  证据：`[h1 唯一性] GrammarLessonPage（正课·前测）: h1 x0（全页标题总数 0）`
  复现：进入任意一课（首次学习，未完课）→ 查看标题元素 → 无。
  期望：给正课页一个 h1（课程标题），或在顶部栏用 `<h1>` 代替 `<strong>`。这样读屏用户能用「按标题跳转」快速定位「我在哪一课」。
  其它页面均通过 `PageHeader` 组件（`/Users/liujun/Documents/英语听写/src/components/PageHeader.tsx:13` 的 `<h1>{title}</h1>`）保证了 h1 唯一。

### 4b. 列表语义：全站 **0 个** `ol`/`ul`/`role=list`

| 页面 | ol | ul | li | role=list | 用 div 扮演的列表容器（示例） |
|---|---|---|---|---|---|
| `GrammarLessonPage` | 0 | 0 | 0 | 0 | `div.lesson-option-row(3)` |
| `GrammarReviewPage` | 0 | 0 | 0 | 0 | `div.lesson-option-row(4)` |
| `GrammarBoostPage` | 0 | 0 | 0 | 0 | `div.boost-tier-list(3)` |
| `GrammarHuntPage` | 0 | 0 | 0 | 0 | `div.hunt-case-list(17)` |
| `GrammarDiaryPage` | 0 | 0 | 0 | 0 | `div.diary-count-row(4)` |
| `GrammarPathPage` | 0 | 0 | 0 | 0 | `div.lesson-path-grid(12)` |
| `GrammarRevisitPage` | 0 | 0 | 0 | 0 | `div.lesson-spot-row(5)` |
| `ReviewPage` | 0 | 0 | 0 | 0 | `div.rating-row(4)` |
| `UnitsPage` | 0 | 0 | 0 | 0 | `div.unit-book-grid(5)` / `(3)` |
| `WordsPage` | 0 | 0 | 0 | 0 | `div.filter-row(7)` |
| `ImportPage` | 0 | 0 | 0 | 0 | `div.[动态类名](5)` ×2 |
| 其余 6 页 | 0 | 0 | 0 | 0 | — |

证据：`[列表语义] … ol=0 ul=0 li=0 role=list=0`（17 页全部），断言 `扫描的 17 个页面里 ol/ul/role=list 总数为 0` 通过。

**注意**：全项目 `grep` 只在 `src/pages/GrammarPathPage.tsx:64` 找到一处 `<ol className="weak-spots-list">` —— 它在「弱点」数据为空时不渲染，所以扫描的 17 个页面里都没出现。也就是说项目**知道**该怎么写列表，只是绝大多数列表式内容都用了 div。

复现：进入「侦探找错」→ 案件列表（`div.hunt-case-list` 里有 17 个子按钮）→ 读屏器读不出「列表，17 项」，也无「第几项 / 共几项」的上下文。
实际：纯 div 平铺。期望：案件列表、课程列表（`lesson-path-grid`）、词书网格（`unit-book-grid`）等真正的列表式内容改用 `<ul>/<li>`（或补 `role="list"` / `role="listitem"`）。

严重度 P2：不是「不可用」，而是丢失了读屏用户的导航效率（如「跳到下一个列表项」、总项数播报）。

### 4c. 可点区域：`<button>` vs 带 `onClick` 的 `div`/`span`

静态 AST 清点：14 处非原生可点元素，其中 6 处是真正的交互元素，**全部可键盘操作**：

| 文件:行号 | 元素 | role | tabIndex | onKeyDown（Enter/Space） |
|---|---|---|---|---|
| `/Users/liujun/Documents/英语听写/src/pages/AdventurePlayPage.tsx:308` | `<span>` | `button` | 0 | 有 |
| `/Users/liujun/Documents/英语听写/src/pages/GrammarHuntPage.tsx:608` | `<span>` | `button` | 0 | 有 |
| `/Users/liujun/Documents/英语听写/src/pages/LibraryPage.tsx:1721` | `<div>` | `button` | 0 | 有 |
| `/Users/liujun/Documents/英语听写/src/pages/UnitsPage.tsx:1259` | `<span>` | `link` | 0 | 有 |
| `/Users/liujun/Documents/英语听写/src/pages/UnitsPage.tsx:1599` | `<div>` | `button` | 0 | 有 |
| `/Users/liujun/Documents/英语听写/src/components/AppSelect.tsx:168` | `<li>` | `option` | — | 由父级组合键处理（listbox 模式，见下） |

其余 8 处是**遮罩层 / 对话框本体**的 `onClick`（只做 `stopPropagation` 或「点遮罩关闭」），不是交互控件，符合 `role="presentation"` / `role="dialog"` 的用法，不构成键盘不可达。

DOM 侧断言通过：`[role=button 可达性] 全部有 tabindex`。

**检查后没问题的项**：

- `GrammarHuntPage` 的词块（`:608`）是 `<span role="button" tabIndex={0}>` 且带完整 `onKeyDown`（Enter/Space + `preventDefault`），键盘可达性正确 —— 这正是全站唯一配了 `tabIndex` 的那个元素（用户背景里提到的 `:612`）。
- `LibraryPage:1721` 的卡片选择、`UnitsPage:1599` 的拖拽导入区、`AdventurePlayPage:308` 的句子展开，都做对了（role + tabIndex + onKeyDown 三件套齐全），并且 `UnitsPage:1259` 还额外补了 `aria-label`。
- 未发现「带 `onClick` 但无 `role`、无 `tabIndex`」的键盘不可达元素。

**唯一可疑但未证实**：`AppSelect.tsx:168` 的 `<li role="option">` 自身没有 `tabIndex` 也没有 `onKeyDown`。这是 ARIA listbox 的标准做法（焦点留在触发按钮上、用 `aria-activedescendant` 或聚焦管理在选项间移动），静态看**符合规范**，我**没有**在本次专项里构造键盘动线验证它的上下键/回车是否真的可用，故列为「可疑但未证实」，不算缺陷。

---

## 5. 装饰性元素是否被正确隐藏（P2，报事实）

DOM 扫描结果（`aria-hidden="true"` 的 svg / 全部 svg）：

| 页面 | 带 `aria-hidden` / 全部 svg |
|---|---|
| `GrammarLessonPage` | **1 / 2** |
| `GrammarHuntPage` | **32 / 32** |
| `LibraryPage` | **1 / 21** |
| `GrammarReviewPage` | 0 / 2 |
| `GrammarDiaryPage` | 0 / 2 |
| `GrammarPathPage` | 0 / 5 |
| `GrammarReauditPage` | 0 / 1 |
| `SentencesPage` | 0 / 12 |
| `ReviewPage` | 0 / 6 |
| `UnitsPage` | 0 / 14 |
| `ImportPage` | 0 / 14 |
| `WordsPage` | 0 / 2 |
| `StatsPage` | 0 / 1 |
| `GrammarBoostPage` / `GrammarReplayPage` / `GrammarRevisitPage` | 0 / 0 |
| 探针页（`SpeakButton`） | 0 / 1 |

### 结论

**不一致**：`GrammarHuntPage` 32/32 全部标了 `aria-hidden="true"`（做得最规范），而绝大多数页面的 Lucide 图标**一个都没标**。

**但要分清两种情形**，避免误判：

1. **按钮内的图标** —— 按钮本身有 `aria-label` 时，图标不标 `aria-hidden` 一般不会造成重复播报（`aria-label` 会覆盖子树文本作为名称）。所以 `/Users/liujun/Documents/英语听写/src/pages/ReviewPage.tsx:427` 的 `Edit3`、`SentencesPage` 的 `Star`/`Trash2` 等**不是**「装饰性元素污染」问题。
2. **纯装饰性图标**（不在任何有名称的控件内、只是视觉点缀）—— 这才是真正该标 `aria-hidden` 的。例如：
   - `src/pages/GrammarLessonPage.tsx` 里大量装饰图标**已正确标注**（如 `:276/:302/:346/:384/:407/:425/:432/:447/:2259/:2560/:2568` 都有 `aria-hidden="true"`）
   - `GrammarBoostPage.tsx:1266` 的 `<CheckCircle2 size={16} />`、`:1289` 的 `<Lightbulb size={14} />`、`:1298` 的 `<Info size={14} />` —— **未标**（同文件里另有已标的，口径不齐）
   - `src/components/SpeakButton.tsx:37` 的 `Volume2`（按钮有 `aria-label`，属第 1 类，不算问题）
   - `src/pages/GrammarPathPage.tsx` 的 5 个图标 —— 未标

   **项目里已有正确做法可参照**：`GrammarHuntPage.tsx:403/428/439/451/473` 等（该页 32/32 全标）、`GrammarLessonPage.tsx` 的 12 处、`src/App.tsx` 的 `<Flame size={14} aria-hidden="true" />`。

**严重度 P2（报事实，不作为硬失败）**：Lucide 渲染出的 `<svg>` 默认**无** `role="img"` 也无 `aria-hidden`，多数读屏器会跳过无名 svg，实际影响有限；但「同一项目里 Hunt 全标、其它页全不标」的口径不一致，建议统一。我在测试里**只打印不断言**，避免把设计取舍误报成缺陷。

---

## 6. `ConfirmDialog` 的焦点管理（P0）—— 逐条验证

组件：`/Users/liujun/Documents/英语听写/src/components/ConfirmDialog.tsx`
驱动方式：走真实 UI（`LibraryPage` 批量操作 → 确认弹窗），而非直接渲染组件，这样能同时验证「触发元素」这一环。

| # | 检查项 | 结果 | 证据 |
|---|---|---|---|
| 1 | 打开时焦点进入对话框 | **通过** | `[ConfirmDialog] 打开后焦点=BUTTON.secondary-button["取消"] 在对话框内=true` |
| 2 | `Escape` 关闭 | **通过** | `[ConfirmDialog] Escape 后弹窗仍在=false` |
| 3 | 关闭后焦点**归还给触发元素** | **不通过（P0）** | `[ConfirmDialog] 触发元素="删除" 关闭后焦点=BODY 是触发元素吗=false` |
| 4 | focus trap（Tab 不跑到背后页面） | **不通过（P0）** | 见下 |
| 5 | `role` / `aria-modal` / 可读名 | **通过** | `[ConfirmDialog] role=alertdialog aria-modal=true aria-label="删除 1 张卡片？" aria-labelledby=false` |
| 6 | 点击遮罩关闭（并检查焦点去向） | 关闭**通过**，焦点归还**不通过** | `[ConfirmDialog] 点遮罩后关闭=true 焦点=BODY` |

### 6.1 打开时聚焦 —— 通过

`ConfirmDialog.tsx:38` 的 `cancelButtonRef.current?.focus()` 生效，焦点落在「取消」按钮上。这是正确的默认（破坏性操作不把焦点放在危险按钮上）。**但这是一个 `.focus()` 调用，没有记录「打开前的 activeElement」**，这正是第 3 条失败的原因。

### 6.2 Escape 关闭 —— 通过

`ConfirmDialog.tsx:34-37` 在 `window` 上挂 `keydown` 监听，`Escape` 调 `onCancel()`，能在 `useEffect` 清理里正确移除。行为正确。

### 6.3 焦点归还 —— **不通过（P0）**

**复现步骤**：
1. 进入「语料库」（`/library`），页面上至少有一张卡片
2. 键盘 Tab 到卡片操作区的「删除」按钮，回车
3. 弹窗打开（焦点正确落在「取消」）
4. 按 `Escape`（或点遮罩）关闭

**实际**：焦点停留在 `<body>`。`document.activeElement === document.body`，且 `=== 触发元素` 为 `false`。
**证据**：`[ConfirmDialog] 触发元素="删除" 关闭后焦点=BODY 是触发元素吗=false`；遮罩路径同样 `焦点=BODY`。
**期望**（WAI-ARIA APG，dialog pattern）：关闭时把焦点**归还给打开对话框的那个元素**。否则键盘用户关掉弹窗后又被扔回 `<body>`，需要从头 Tab 一遍才能回到刚才那张卡片。

**根因**：组件内部没有保存 `document.activeElement`，关闭时也没有 `restoreFocus`。`useEffect` 的清理函数只做了 `removeEventListener`（`ConfirmDialog.tsx:39` 只 `removeEventListener`）。

**修复方向**：在 `open` 变 true 的同一个 effect 里，进入前记录 `document.activeElement as HTMLElement`，在清理（或 `open` 变 false）时调 `previous?.focus?.()`。

### 6.4 focus trap —— **不通过（P0）**

**复现步骤**：打开上述弹窗 → 观察背景元素是否仍可聚焦。

**实际**：
```
[ConfirmDialog] 对话框内可聚焦=2 个；背景 tabbable=33 个；背景中被 aria-hidden/inert 屏蔽的=0 个；container 内有 inert=false
[ConfirmDialog] 对话框打开时，背景按钮仍能拿到焦点的=5/5 个：#9<BUTTON.selected> #10<BUTTON.> #11<BUTTON.> #12<BUTTON.> #13<BUTTON.>
```
断言失败：`对话框打开时背景仍有 5 个按钮可以拿到焦点 —— 没有 focus trap，Tab/读屏可以走到背后页面`。

**期望**：二选一
- 完整 focus trap：拦截 `Tab`/`Shift+Tab`，在对话框内的可聚焦元素间循环；
- 或（更简单、更稳）给背景容器加 `inert`（或 `aria-hidden="true"` + 移除 tabbable）。

**为什么这条是 P0**：`aria-modal="true"` 已经**宣称**了模态，但实际没有拦住 Tab —— 这是「声明与行为不一致」，比单纯没实现 trap 更糟：读屏器会按模态语义屏蔽背景内容，而键盘仍能 Tab 进背景，用户会落在「读屏器不读、但焦点确实在那儿」的虚空里。

**方法说明**：jsdom 不实现原生 Tab 顺序，我**没有**用「连按 Tab 看焦点是否离开」（那里恒为「没离开」，是假通过）。上表的证据是「背景按钮能否拿到焦点」与「背景有无 inert/aria-hidden」，这是在本环境里能成立的替代证据。

### 6.5 role / aria-modal / 可读名 —— 通过

`role="alertdialog"` + `aria-modal="true"` + `aria-label={title}`，符合 APG。细节建议（非缺陷）：用 `aria-labelledby` 指向 `<h2>{title}</h2>` 比 `aria-label` 更贴合内容结构；`role="alertdialog"` 对确认框是合适的。

### 6.6 附带发现（P2，同源问题）

同一「关闭后不归还焦点」的模式也出现在其它自建弹窗（静态清点）：

- `src/pages/AdventurePage.tsx:568/571`（`adv-routes-dialog`，`role="dialog"`）
- `src/pages/AdventurePlayPage.tsx:1494/1495`（`adventure-jump-dialog`，`role="alertdialog"`）、另 `:1519` 还有一个 `role="dialog"`
- `src/components/OnboardingGuide.tsx:98/101`（`onboarding-overlay` + `role="dialog"`）
- `src/pages/UnitsPage.tsx:1398/1399`（创建词书）、`:1506/1509`（导入词书）、`:1734/1741`（词书详情），以及 `:1599` 的 `import-dropzone`

这些弹窗的 `autoFocus` 能让焦点**进入**弹窗，但同样没有**归还**逻辑，也没有 trap。我**未**逐个构造完整键盘动线验证（`autoFocus` 在 jsdom 里由 React 处理，行为与浏览器一致），故列为「可疑但未证实，与 6.3/6.4 同源」。

---

## 7. 表单可访问性 —— **全部通过**

### 结论

**扫到的 17 个输入控件全部有真正的可读名（`aria-label` 或关联 `<label>`），没有一个只靠 `placeholder`。**

```
[输入框] 共 17 个；有真名称 17 个；无可读名 0 个
```

| 页面 | 控件 | 可读名来源 |
|---|---|---|
| `GrammarDiaryPage` | `textarea` ×3 | **`aria-label`**（分别是「茶和咖啡，你选哪个？」「今天穿的这件衣服舒服吗？」「你桌上现在有什么？」—— 直接用了题目文案，很合适） |
| `SentencesPage` | `textarea` ×2、`input[type=text]` ×3、`input[type=file]` ×1 | 关联 `<label>` |
| `SentencesPage` | `input[type=text]`（搜索框） | `aria-label="搜索句子"` |
| `ReviewPage` | `textarea` | 关联 `<label>` |
| `LibraryPage` | `input[type=text]`（搜索框） | `aria-label="搜索词库内容（按 / 或 Ctrl/⌘+K 快速聚焦）"` |
| `WordsPage` | `input[type=text]`（搜索框） | `aria-label="搜索单词"` |
| `ImportPage` | `input[type=text]` ×1、`textarea` ×2 | 关联 `<label>` |

### 特别核对了用户点名的风险项

**`GrammarDiaryPage` 的日记输入框**——这是全站最容易被误判的：`placeholder="用你会的词写一句英文，三个词也算数。"` 存在，且**肉眼看上去**像是「只有 placeholder」。实测**三个 textarea 都带 `aria-label`**，且用的是该题的题干（如「茶和咖啡，你选哪个？」），`hasRealName: true`：

```json
[
  { "ariaLabel": "茶和咖啡，你选哪个？",     "wrapped": false, "htmlFor": false, "placeholder": "用你会的词写一句英文，三个词也算数。", "hasRealName": true },
  { "ariaLabel": "今天穿的这件衣服舒服吗？", "wrapped": false, "htmlFor": false, "placeholder": "用你会的词写一句英文，三个词也算数。", "hasRealName": true },
  { "ariaLabel": "你桌上现在有什么？",       "wrapped": false, "htmlFor": false, "placeholder": "用你会的词写一句英文，三个词也算数。", "hasRealName": true }
]
```

这也说明了为什么只有 placeholder 会不合格：placeholder 在输入后消失，且部分读屏器不读它；用题干做 `aria-label` 则始终可读，且带上下文。

- `checkbox` / `radio` / `file` 类型均已按 `<label>` 包裹处理，无需额外名称（文件中 `input[type=file]` 两处 `label=true`）。
- 未发现无名称的 `select`（本项目用自建 `AppSelect` 组件替代，见第 4c 节）。

---

## 严重度汇总

| 严重度 | 条目 | 位置 |
|---|---|---|
| **P0** | 焦点丢失：12 条动线全部落到 `<body>` | `GrammarLessonPage` / `GrammarReviewPage` / `GrammarBoostPage` / `GrammarHuntPage` 各自的条件渲染反馈区 |
| **P0** | `ConfirmDialog` 关闭后不归还焦点 | `/Users/liujun/Documents/英语听写/src/components/ConfirmDialog.tsx:32-40`（`useEffect`） |
| **P0** | `ConfirmDialog` 无 focus trap，`aria-modal="true"` 与行为不一致 | `/Users/liujun/Documents/英语听写/src/components/ConfirmDialog.tsx:44-52`（弹窗 DOM） |
| **P1** | `aria-live` 全是「判题后才插入」，读屏器不播报 | `GrammarReviewPage:360/372`、`GrammarLessonPage` 12 处、`GrammarBoostPage:1259/1301`、`GrammarHuntPage:643/653` |
| **P1** | 3 个图标按钮无任何可读名 | `/Users/liujun/Documents/英语听写/src/pages/SentencesPage.tsx:188`、`:192`、`:195` |
| **P2** | 16 个图标按钮仅靠 `title` 命名（弱名称） | 见 2b 表（`UnitsPage` ×10、`WordsPage` ×3（:651/:659/:666）、`MistakeBookPage` ×2（:913/:919）、`SpellingPage` ×1（:778）） |
| **P2** | `GrammarLessonPage` 全页零标题（无 h1） | `/Users/liujun/Documents/英语听写/src/pages/GrammarLessonPage.tsx（顶部栏 :2137 用 `<strong>`） |
| **P2** | 全站 0 个 `ol`/`ul`/`role=list`，列表类内容全用 div | `hunt-case-list`(17 项)、`lesson-path-grid`(12 项)、`unit-book-grid`(5 项) 等 |
| **P2** | 装饰性 svg 的 `aria-hidden` 口径不一致（Hunt 32/32，其余多为 0） | 见第 5 节表 |
| **P2** | 其它自建弹窗同源缺失（不归还焦点 / 无 trap） | `AdventurePage:568/571`、`AdventurePlayPage:1494/1495` + `:1519`、`OnboardingGuide:98/101`、`UnitsPage:1398/1399`、`:1506/1509`、`:1734/1741` |

---

## 确认的缺陷 vs 可疑但未证实

### 确认的缺陷（有 jsdom 渲染证据 + 断言）

1. 12 条答题动线的焦点丢失（P0）
2. `ConfirmDialog` 关闭后不归还焦点（P0）
3. `ConfirmDialog` 无 focus trap（P0）
4. `aria-live` 全部为「新插入」（P1）
5. `SentencesPage.tsx:188/192/195` 三个图标按钮无任何可读名（P1）
6. 16 个图标按钮仅靠 `title`（P2）
7. `GrammarLessonPage` 零 h1（P2）
8. 全站零语义列表（P2）
9. 装饰性 svg `aria-hidden` 口径不一致（P2，报事实）

### 可疑但未证实

1. **`AppSelect.tsx:168` 的 `<li role="option">`** 自身无 `tabIndex` / `onKeyDown`。静态看符合 ARIA listbox 规范（焦点在触发按钮、选项靠 `aria-activedescendant` 或程序化聚焦管理）。本次**未构造**它的上下键 / 回车键盘动线，无法确认实际可用性。
2. **`AdventurePage:568/571`、`AdventurePlayPage:1494/1495`+`:1519`、`OnboardingGuide:98/101`、`UnitsPage:1398/1399`、`:1506/1509`、`:1734/1741` 等自建弹窗**：与 `ConfirmDialog` 同源地缺少「焦点归还」与「trap」。已确认这些弹窗**没有** `inert`/`aria-hidden` 背景屏蔽（静态清点），但未逐个人工走完整键盘动线，因此未按 P0 断言。建议与 `ConfirmDialog` 一并按同一方案修。
3. **`aria-live` 播报是否真的失效**：结论基于「新插入的 live region 多数读屏器不播报」这一通行工程经验。本环境无真实读屏器，**无法直接实测播报**。要坐实需要 NVDA/JAWS/VoiceOver 人工验证（或接入 axe 类工具——项目未装）。
4. **`GrammarHuntPage` 的 29 个 h2**：层级正确（都在 h1 之后），但一屏 28 个「第 N 季」标题对读屏用户的「按标题跳转」列表可能过吵。属于信息架构取舍，未列为缺陷。

---

## 结论与建议修复顺序

1. **先修 P0 焦点丢失**：统一样式 —— 在反馈区渲染后把焦点移到新题的第一个可交互元素（或反馈区自身 `tabIndex={-1}` + `focus()`）。同类页面（正课 / 复习 / 强化 / 侦探）可用一个共用的 `useFocusAfterJudge` hook，避免四处各修一遍。
2. **再修 `ConfirmDialog`**：一个改动同时解决 6.3（记录并归还 `previousFocus`）与 6.4（背景加 `inert` 或做 Tab 循环）。这两条是同一次改动的自然产物，且能顺带被 `AdventurePage` / `AdventurePlayPage` / `OnboardingGuide` / `UnitsPage` 复用。
3. **修 `aria-live`**：把反馈 live region 改成**常驻 + 只换文本**。这是「让 P0 的焦点修复真正有用」的前提 —— 否则焦点回去了、结果却没被读出来。
4. **补 3 个 `SentencesPage` 图标按钮的 `aria-label`**（照抄 `LibraryPage:1771/1787/1796` 的写法即可）。
5. **P2 批量清理**：16 处 `title`-only 补 `aria-label`；正课页补 h1；列表容器改 `<ul>/<li>`；装饰性 svg 统一 `aria-hidden="true"`。

## 复现命令

```bash
cd /Users/liujun/Documents/英语听写
npx vitest run src/edge/verify/a11y1-focus-loss.test.tsx   # 焦点丢失 + 元验证
npx vitest run src/edge/verify/a11y2-dom-scan.test.tsx     # 图标按钮 / 语义 / 输入框 / live region
npx vitest run src/edge/verify/a11y3-confirm-dialog.test.tsx  # ConfirmDialog 六条
```

失败即缺陷，输出里有逐条证据（`console.log` 打印的焦点落点、按钮类名、live region 计数等）。
