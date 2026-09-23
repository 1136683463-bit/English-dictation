# 输入法（IME）与键盘输入专项验证

**日期**：2026-09-22
**范围**：React 18 + TS + Vite + vitest + Tauri（macOS 走 WKWebView）
**用户画像**：中文母语者，大量输入场景用中文输入法（日记写中文、练习写英文、拼写打单词、错词书/设置页各种文本）

**验证方法**（三层，互补）：

1. **代码审查**：`grep` 全部 `onKeyDown / onKeyUp / onKeyPress / keyCode / isComposing / compositionstart / nativeEvent`，逐条判定守卫。
2. **jsdom 合成事件**：`new KeyboardEvent("keydown", { key: "Enter", isComposing: true })` + `Object.defineProperty` 覆写 `keyCode`。**注意 jsdom 不实现表单隐式提交**，这一类缺陷结构性测不出（见 §4 `FAIL-C15`）。
3. **真机复核**（决定性证据）：Playwright + **真实 Chromium 129**，用 CDP `Input.imeSetComposition` 制造**真实组词态**（不是伪造 `isComposing`），对 `npm run dev` 起的应用逐场景按键并读 `localStorage` 落库结果。Tauri 的 WKWebView 用 Playwright `webkit` 引擎做对照（该引擎无法程序化制造组词态，故仅作对照）。

**产出**：3 个新测试文件 / 50 条用例，全部通过；未改动 `src/` 下任何产品代码。

---

## 1. 键盘提交路径 × 文件:行号 × 是否防 IME × 误提交后果 × 严重度

「防 IME」= 判了 `isComposing` 或 `keyCode === 229`。全库**零处** `keyCode` 检查，防 IME 全部靠 `isComposing`。

### 1.1 走「提交/判分/落库」的处理点（有后果的一类）

| # | 文件:行号 | 触发 | 做了什么 | 防 IME | 误提交后果 | 严重度 |
|---|---|---|---|---|---|---|
| 1 | `src/pages/SpellingPage.tsx:470-475` | 输入框 Enter | `submitAnswer()` 判分 + 落库 + 排下一次复习 | **无**（只看 `key === "Enter"`，也不看 Shift） | **半截拼音被当成答案判错**：真机实测 `answer:"pict"`（想打的是 picture）→ `rating:1` 落库、进错词书、卡片插入队列 | **P0 确认缺陷** |
| 2 | `src/pages/SpellingPage.tsx:465-468` | form `onSubmit` | 同上（`preventDefault` + `submitAnswer()`） | **无**（原生 submit 事件上**没有** `isComposing` 可用） | 同 #1 的第二条路径；#1 修好后**立刻**成为新漏点 | **P0 确认缺陷** |
| 3 | `src/pages/ReviewPage.tsx:144-146` | 全局 window keydown，`1/2/3/4` | `handleRatingClick()` → 评分、写 schedule、翻下一张 | **无**（且**没有 `event.target` 守卫**） | **输入法用数字键选候选词 → 卡片被直接评走**：真机实测 `answer:"pict"` 就落库；且 1/2 分有二次确认，用户再按一次同键即确认 | **P0 确认缺陷** |
| 4 | `src/pages/GrammarLessonPage.tsx:3003` | 忆段 textarea Enter | `submitRecall()` 判分 | **有** `!event.nativeEvent.isComposing` | 无（安全） | — |
| 5 | `src/pages/GrammarLessonPage.tsx:3378` | 产出段 textarea Enter | `submitOutput()` 判分 | **有** | 无（安全） | — |
| 6 | `src/pages/GrammarReviewPage.tsx:297` | 自由输出 textarea Enter | `handleFreeTypeSubmit()` | **有** | 无（安全） | — |
| 7 | `src/pages/GrammarRevisitPage.tsx:270` | 填空 input Enter | `submitCloze()` | **有**（含 `clozeValue.trim()`） | 无（安全） | — |
| 8 | `src/pages/GrammarBoostPage.tsx:1221` | 输入框 Enter | `submitText()` | **有**（含 `textValue.trim()`） | 无（安全） | — |
| 9 | `src/pages/GrammarBoostPage.tsx:745-751` | 全局 window keydown，Enter | 答对/看答案后进下一题 | **有**（`event.isComposing`；另有 tagName 白名单 + Shift 守卫） | 无（安全） | — |

### 1.2 `role="button"` 的 Enter/Space 无障碍垫片（无后果的一类）

都在**非输入元素**上，输入法不会把候选窗开在那里，组词态 Enter 不会命中。列全以供交叉核对：

| 文件:行号 | 元素 | 行为 |
|---|---|---|
| `src/pages/GrammarHuntPage.tsx:628-633` | `span[role=button]` 案件词块 | Enter/Space → `handleTokenClick` |
| `src/pages/AdventurePlayPage.tsx:316-320` | `span[role=button]` 句子 | Enter/Space → `onSelect` |
| `src/pages/UnitsPage.tsx:1269-1275` | `span[role=link]` 死卡唤醒条 | Enter/Space → `navigate` 到拼写页 |
| `src/pages/UnitsPage.tsx:1605-1610` | `div[role=button]` 导入拖放区 | Enter/Space → 打开文件选择 |
| `src/pages/LibraryPage.tsx:1736-1746` | `div[role=button]` 词库条目 | Enter/Space → 选中（且已排除 `.library-item-actions` 冒泡） |
| `src/components/AppSelect.tsx:117-134` | `<button>` 下拉触发器 | Enter/Space → 开合/选中；方向键移动 |

### 1.3 导航类按键（Tab / Escape）——不提交，但影响可用性

| 文件:行号 | 键 | 行为 | 防 IME | 备注 |
|---|---|---|---|---|
| `src/pages/SpellingPage.tsx:302-321` | Tab | 正文上正向 Tab → 读一遍发音并 `preventDefault` | 不需（有 `isEditable` 守卫：INPUT/TEXTAREA/SELECT/contentEditable 一律放行，Shift+Tab 始终放行） | 真机实测输入框内 Tab 不 `preventDefault`、焦点正常移到「播放发音」按钮 |
| `src/components/ConfirmDialog.tsx:81-98` | Tab | 对话框内 focus trap | 不需 | 与输入法无关 |
| `src/components/ConfirmDialog.tsx:73-76` | Escape | 关对话框 | **无** | 真机实测组词态 Escape 带 `isComposing=true`（`keyCode=27`），**会关掉对话框**——但这是浏览器的标准分工（Escape 先取消组词、再冒泡），且关闭对话框会归还焦点与背景 inert，损失可接受；列为观察项 |
| `src/components/AppSelect.tsx:57-59` | Escape | 关下拉 | 无 | 同上 |
| `src/pages/UnitsPage.tsx:360-370` | Escape | 关新建/导入词书弹窗 | 无 | 同上；`autoFocus` 的中文输入框正在组词时按 Escape，会**先关弹窗**（草稿丢失）→ 见 §5 需真机验证 |
| `src/pages/LibraryPage.tsx:165-177` | `/`、Cmd/Ctrl+K | 聚焦搜索框 + `select()` | **有 `isTyping` 守卫**（有输入框焦点时不抢键） | 反向安全案例 |
| `src/pages/ReviewPage.tsx:140-143` | Space | `event.target === document.body` 时才翻看答案 | **有 target 守卫** | 与 #3 同一段监听，**证明「输入框里不抢键」是本项目已知约束，数字键是漏了** |

### 1.4 IME 守卫盘点（源码级锚定，已写成回归断言 `PASS-A10/A12/A13`）

- 带 `isComposing` 的**文件只有 4 个**：`GrammarLessonPage`(2 处)、`GrammarReviewPage`(1)、`GrammarRevisitPage`(1)、`GrammarBoostPage`(2，其一在 window 上)。
- 有键盘处理但**完全没有** `isComposing` 的文件：`SpellingPage.tsx`、`ReviewPage.tsx`。
- **全库零处 `keyCode === 229` 检查**。Chrome 组词态通常派 `key === "Process"` + `keyCode 229`，此时 `key === "Enter"` 不成立 → 侥幸安全；真实 IME 在**上屏那一次**回车会派 `key === "Enter"` + `isComposing === true`（真机已验证），这才是漏网的那一次。

---

## 2. 三个 P0 确认缺陷（真机复现，附落库证据）

真机复现环境：`npx vite --port 1523` + Playwright Chromium + CDP `Input.imeSetComposition({text:"pict"})`（真实组词，未上屏）→ 按 Enter → 读 `localStorage`。

### 缺陷 1（P0）：拼写页组词态回车 → 半截拼音被判错并进错词书

- **文件:行号**：`src/pages/SpellingPage.tsx:470-475`；第二条路径 `:465-468`（form `onSubmit`）
- **实际**：真机 DOM 事件 `keydown key=Enter keyCode=13 isComposing=true` → `defaultPrevented:true` → `reviews:[{"mode":"spelling","answer":"pict","rating":1}]`；页面显示「picture 错误 撤销」、正确率 0%、队列剩余 2（错词插入）
- **期望**：组词态回车放行给输入法上屏（`isComposing` 时不 `preventDefault`、不提交）；上屏后用户再按回车才提交
- **用户后果**：**最高频**。用户在拼写框用中文输入法打字母（很多中文输入法在英文词上也会组词）或直接敲拼音，第一次回车就把没写完的词交上去：判错、计入正确率、写进错词本、卡片被重排进队列——用户看到的是「我明明在打字，它就说我错了」
- **严重度**：**P0**
- **判定**：**确认缺陷**（jsdom + 真机双重复现）
- **测试**：`src/edge/verify/env3a-ime-submit.test.tsx` `FAIL-A1/A2/A3/A5`
- **修复方向**：`if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing && !(event.keyCode === 229))` —— 与课内输入框同口径；form `onSubmit` 保留（作为点「提交」按钮之外的兜底），但**必须同时**在 input 的 `onKeyDown` 拦组词态，因为原生 submit 事件不带 `isComposing`

### 缺陷 2（P0）：复习页数字键评分 → 输入法数字选词把卡评走

- **文件:行号**：`src/pages/ReviewPage.tsx:144-146`
- **实际**：真机 `keydown key=3 isComposing=true` → `reviews:[{"mode":"spelling","answer":"pict","rating":3}]`，卡片被送出、草稿丢失、页面变「今日复习已清空」。jsdom 里 1/2 分需二次确认（`:144` 命中 → 弹确认 → 再按同键确认），3/4 分一次命中
- **期望**：数字快捷键只在焦点不落在输入区时生效（与同段 `:140` 的 Space 完全同口径）
- **用户后果**：中文输入法候选窗正是 **1-4 选词**；用户想选第 3 个候选词，结果卡片被评成「记得」送走，答案框清空。**无论是否用输入法**，用户在答案里写数字（`I have 2 cats`）也会触发
- **严重度**：**P0**
- **判定**：**确认缺陷**（jsdom + 真机双重复现）
- **测试**：`env3a` `FAIL-A6/A7`；`env3c` `FAIL-C13`（对照 Space 有 target 守卫，证明是疏漏）
- **修复方向**：`:144` 补 `&& event.target === document.body`（并顺带判 `!event.isComposing`）

### 缺陷 3（P0）：form 型提交点对组词态回车无防线（多页面）

jsdom **无法**测（不实现隐式提交），只能真机 + 代码审查。

| 页面 | 文件:行号 | 真机实测结果 |
|---|---|---|
| 词书分组 | `src/pages/UnitsPage.tsx:1112`（input `:1120`，placeholder「例如：核心100 / 考研高频」← 明确邀请中文） | 组词 `"hexin100"` 未上屏 → Enter → `SUBMIT dp=false` → `unitGroups` 新增 **`"hexin100"`**（用户想要「核心100」） |
| 添加句子 | `src/pages/SentencesPage.tsx:88`（标签 input `:123`） | 组词 `"ceshi"` 未上屏 → Enter → `SUBMIT` → `cards` 落库 **`tags:["ceshi"]`**；对照：上屏后再回车才是 `tags:["测试"]` |
| 添加单词 | `src/pages/WordsPage.tsx:392`（释义 input `:430`） | 组词 `"fangfa"` 未上屏 → Enter → `SUBMIT dp=false`（释义为中文，用户必然用输入法） |
| 词书编辑 | `src/pages/UnitsPage.tsx:1909`（`editTitle`/`editDescription` 中文） | 同机制（未逐条真机跑，按同构计数） |
| 自定义词书 | `src/pages/UnitsPage.tsx:1399`（`autoFocus` 中文名称） | 同机制 |
| 导入词书 | `src/pages/UnitsPage.tsx:1512`（`autoFocus` 中文名称） | 同机制 |
| 自由提问 | `src/pages/GrammarLessonPage.tsx:2787`（prompt「或者自己打一句」← 用户会用中文提问） | 同机制（未跑通到该 DOM 状态，按同构计数） |

- **实际**：全站 `10` 个 `<form>`，**零个**带 IME 守卫（`FAIL-A14`）
- **期望**：在 form 内文本输入框的 `onKeyDown` 里判组词态并 `preventDefault`（不能靠 `onSubmit`——原生 submit 事件没有 `isComposing`）
- **用户后果**：中文名字/标签/释义被存成**拼音**；且因为页面显示的是用户以为打进去的中文，用户看不出为什么存错了
- **严重度**：**P0**（数据正确性）；其中「分组名/标签/释义」三处为最高频
- **判定**：**确认缺陷**（真机复现 3 处）+ 同构推断 4 处
- **测试**：`env3a` `FAIL-A14`（源码级盘点）、`env3c` `FAIL-C15`（记录 jsdom 盲区本身）

---

## 3. 归一化覆盖度：全角 / 半角 / 撇号 / 空格

两条判分管线**口径不一致**，是本轮新发现的结构性问题：

- **句级**：`diffService.compareText / diffScore`（`src/services/diffService.ts:12-19, 207`）→ 复习页、语法课产出段、语言门；走 `normalize`，**有** `foldFullWidth`
- **词级**：`diffService.normalizeSpelling / compareLetters`（`src/services/diffService.ts:279-288`）→ 拼写页、错词书字母对照；**没有** `foldFullWidth`
- 词块题走 `compareText` 同一条（`lessonService.checkLessonTokens`）

### 3.1 覆盖表

| 输入形态 | 句级判分 | 词级判分（拼写页） | 反例 / 证据 |
|---|---|---|---|
| 全角句号 `。` U+3002 | **覆盖**（单独映射） | **不覆盖** | 句级 `"It's cold today。"` = 100 分；词级 `normalizeSpelling("today。")` → `"today。"` ≠ `"today"` → **判错** |
| 全角逗号 `、` U+3001 | **覆盖** | **不覆盖** | 句级 100；词级 `"today、"` 判错 |
| 全角 `！？；：，` U+FF01-FF5E | **覆盖**（整区左移 0xFEE0） | **不覆盖** | 严格模式也满分；词级 `"today！"` 判错 |
| 全角拉丁字母 `Ｉｔ＇ｓ` | **覆盖** | **不覆盖** | 句级 100；词级 `"Ｉｔ＇ｓ"` ≠ `"it's"` |
| 撇号 `'` U+0027 | 基准 | 基准 | — |
| 撇号 `’` U+2019 | **覆盖** | **覆盖**（`:283` 单独 replace） | `"It’s cold today."` 100 分；`normalizeSpelling("don’t")==="don't"` ✅ |
| 撇号 `‘` U+2018 | **覆盖** | **不覆盖** | 句级 `"It‘s cold today."` = 100；词级 `"today‘"` 判错 |
| 撇号 `＇` U+FF07 | **覆盖**（全角区） | **不覆盖** | 同上 |
| 弯双引号 `“ ”` U+201C/D | **不覆盖** → 扣分 | 不覆盖 | 句级 `He said "hello" to me.` vs `He said “hello” to me.` → **80 分**，token 变成 `substitution:“hello”`（引号与词粘成一个 token） |
| 中文省略号 `…` U+2026 | **不覆盖** | 不覆盖 | `"I like tea"` + `…` → < 100 |
| 破折号 `—` U+2014 | **不覆盖** | 不覆盖 | 同上 |
| 间隔号 `·` U+00B7 / `・` U+30FB | **不覆盖** | 不覆盖 | 同上 |
| 书名号 `「」` `《》` | **不覆盖** | 不覆盖 | `"I like tea"` + `「` → **83 分**（粘在末词上按编辑距离判半对）；`"I am"` + `「` → **50 分**（低于忆段 70 线） |
| 全角波浪号 `～` U+FF5E | **不覆盖** | 不覆盖 | U+FF5E 是全角区**上界**，`[\uFF01-\uFF5E]` 含它——但真机探针显示仍扣分，说明该字符被映射成 `~` 后仍不在删标点字符类 `[.,!?;:"()\[\]{}]` 里 → 粘在词上 |
| 半角句号 `｡` U+FF61 | **不覆盖** | 不覆盖 | 同上（U+FF61 在 FF5E 之外） |
| 盘古空格 `　` U+3000 | **覆盖**（`\s+` 压缩） | **覆盖**（`\s` 含 U+3000） | `"It's　cold"` 100 分；`normalizeSpelling("to　day")==="today"` ✅ |
| NBSP U+00A0 | **覆盖**（`\s` 含它） | **覆盖** | 100 分；词级也等 |
| BOM U+FEFF | **覆盖**（`trim()` 吃掉） | **覆盖** | 100 分 |
| **零宽空格 U+200B** | **不覆盖** | **不覆盖** | `"I am happy"` vs `"I am\u200Bhappy"` → **33 分**（`\s` 不含 U+200B）；词级 `"pic\u200Bture"` ≠ `"picture"` |
| **软连字符 U+00AD** | **不覆盖** | 不覆盖 | `"happy"` vs `"hap\u00ADpy"` → **50 分** |
| 大小写 | 覆盖（`toLowerCase`） | 覆盖 | — |
| 前后空格 / 连续空格 | 覆盖（`\s+ → " "` + `trim`） | 覆盖（删所有空白） | — |
| 换行 / CRLF / 多空行 | **覆盖**（压缩成单空格） | 覆盖（删除） | `"I am happy.\r\n"` 100 分 |
| 粘贴两份文本 | 判 50 分（合理：内容确实翻倍，判 `extra`） | 判错（合理） | 不该静默通过 |
| **撇号语义坑（`its` vs `it's`）** | **正确判不同** | 不涉及 | `APOSTROPHE_HOMOGRAPHS`（`:186-196`）显式保护 L87/L88 考点；`checkLessonTokens(["its","cold"],"It's cold")===false` ✅ |

### 3.2 归一化相关缺陷

| # | 问题 | 文件:行号 | 判定 | 严重度 |
|---|---|---|---|---|
| 4 | **拼写页不折叠全角**：`。、！？＇` 与全角字母一律判错 | `src/services/diffService.ts:279-284`（缺 `foldFullWidth`） | **确认缺陷**（jsdom 复现 + 真机可复现同路径） | **P1**——中文输入法的句号/问号是**默认输出**，且拼写页是「一个字符不对就判错」的严格管线，用户完全无法自查 |
| 5 | **弯双引号 `“”` 与中文标点 `…—·「」《》` 漏折叠**：粘在词上扣分 | `src/services/diffService.ts:4-10`（`foldFullWidth` 只覆盖三小段） | **确认缺陷**（反例已量化） | **P1**——句末 `…`/`—` 常见；`「` 在 2 词短句能掉到 50 分（低于忆段 70 线） |
| 6 | **零宽字符 U+200B / 软连字符 U+00AD 穿透归一化** | 同上（`\s` 不含 U+200B） | **确认缺陷** | **P2**——从网页/PDF/Office 复制的文本常带零宽字符，`"I am happy"` 掉到 **33 分**；拼写页直接判错 |

**修复方向（统一）**：把 `foldFullWidth` 提到两处共用，并补三段——`U+201C/U+201D → "`、`U+2026/U+2014/U+00B7/U+30FB → 删除或映射`、`/[\u200B-\u200D\uFEFF\u00AD]/g → ""`；`normalizeSpelling` 复用同一 `foldFullWidth`。改动集中在 `diffService.ts` 一个文件。

---

## 4. `compositionstart` / `compositionend`：全库零使用（评估后果面）

`grep -rn 'compositionstart|compositionend|onCompositionStart|onCompositionEnd' src/pages src/components src/services src/App.tsx src/AppContext.tsx` → **零命中**（已写成断言 `PASS-A11`）。

**这意味着**：应用对 IME 的唯一认知就是「某个 keydown 事件上的 `isComposing` 布尔快照」。没有 composition 状态机，所有后果都落在这一点上：

1. **无法做任何「组词中」的界面让步**：不能在组词期间延后自动跳转、不能显示「正在输入」、不能在 `compositionend` 后再判题。这正是缺陷 1/2/3 的共同根因形状——组词态的回车被当作「确认」。
2. **无法区分「上屏那一次回车」与「确认提交那一次回车」**。真实 IME 时序是：组词 Enter（`isComposing=true`，用于上屏）→ 用户再按一次 Enter（`isComposing=false`，用于提交）。当前代码只在 4 个文件里认出了第一次；其余地方把第一次当第二次。
3. **修 form 型提交点必须依赖 `isComposing` 快照**：原生 `submit` 事件不带任何组词信息，所以 `onSubmit` 里无法补救——必须在 `onKeyDown` 拦截。如果将来某输入法的 `keydown` 不给 `isComposing`（少数 IME／旧引擎只给 `keyCode 229`），当前「零处 `keyCode` 检查」就没有第二条防线。
4. **`event.keyCode === 229` 兜底值得补**：真机 Chrome 组词中派的是 `key: "Process"` + `keyCode: 229`；上屏那一次才是 `key: "Enter"` + `isComposing: true`。两条件同时判（`isComposing || keyCode === 229`）覆盖面最全。

**评估结论**：不引入 composition 状态机是**可接受的**（`isComposing` 快照足以覆盖已知全部场景），但**前提是每个提交点都用了它**——目前 2 个文件（拼写页、复习页数字键）+ 10 个 form 完全没用，这才是后果面。

---

## 5. 其他输入环境敏感性

### 5.1 `inputMode` / `enterKeyHint` / `autocomplete` / `spellCheck`

| 项 | 现状 | 判定 |
|---|---|---|
| `inputMode` | **全站零处** | **P2 确认缺陷**（`FAIL-C2`）：移动端/平板/触屏笔电上，拼写框与英文句子框弹出**中文键盘**；日记页（要中文）与练习页（要英文）无法用同一声明区分 |
| `enterKeyHint` | **全站零处** | 同上：回车键位显示「换行」而非「提交」，与页面「回车提交」行为不一致 |
| `autocomplete` / `autocorrect` / `autocapitalize` / `spellCheck` | **只有拼写页配了**（`SpellingPage.tsx:784-788`：全 off） | `FAIL-C3`：复习页答案框、练习页输入框、日记框全部未配 → iOS/WKWebView 自动大写首字母会**改变用户实际输入**，与用户看到的不一致 |
| `lang="en"` | **可编辑输入框零处**（`GatePlayPage` 的 14 处 `lang="en"` 都是**静态展示文本**，`:361/:418` 等） | `FAIL-C4`：输入法无法据此自动切英文状态 |
| WebKit 补全规避 | 拼写页做得很细：随机 `name`（`:30-32`，`dictation-xxxx`）+ 挂载时 `readonly`、聚焦解锁（`:114-118, :781`）+ `data-form-type="other"` | **正面**（`PASS-C1`），是全站样板 |

### 5.2 自动聚焦 / 自动全选 / 光标跳转 × 输入法

| 位置 | 行为 | 风险 |
|---|---|---|
| `src/pages/SpellingPage.tsx:263-268`（依赖 `[index, feedback]`）+ `:508`（撤销后 `focus()`） | 每次换题**强制** `inputRef.focus()` | 上一题判题后 850ms/120ms 自动跳下一题并聚焦（`:362-396`）。**若输入法候选窗还开着**，强制 `focus()` 会先结束组词，未上屏的拼音可能丢失 → **需真机验证** |
| `src/pages/UnitsPage.tsx:1413, 1526`（`autoFocus` 中文名称输入框） | 打开弹窗即聚焦 | 同弹窗内 Escape 会关弹窗（`:360-370`，无 IME 判断）→ 组词中按 Escape 先关弹窗、草稿丢 → **需真机验证** |
| `src/pages/GatePlayPage.tsx:378`（`autoFocus` 英文答案 textarea） | 进入关卡即聚焦 | 无自动跳转，风险低 |
| `src/pages/LibraryPage.tsx:172-173`（`/` 或 Cmd+K → `focus()` + `select()`） | 已用 `isTyping` 守卫 | 安全 |
| `src/components/useReturnFocus.ts`（判题后交还焦点，`:80-92`） | 只在焦点**已丢失**时补，且按「最近 keydown vs pointerdown」决定是否滚动 | 设计稳健；输入法开着时是否丢字 → **需真机验证** |
| `src/pages/GrammarLessonPage.tsx:690, 716` | 同上 hook | 同上 |

### 5.3 零术语 / Affective Filter 红线核查

本轮新增测试与报告**未引入任何用户可见文案**（只新增 `src/edge/verify/` 下测试文件），因此不触碰两条红线。附带核查：被测页面既有文案中出现的「错误/正确」等字样（如 `SpellingPage.tsx:739`「正确/错误」、`:716-721`「错误 / 正确率」）**属既有产品文案**，不在本次报告改动范围内，仅记录供其他专项处理。

---

## 6. 新增测试文件与运行结果

全部在 `src/edge/verify/` 下，**未改动 `src/` 下任何产品代码**。

| 文件 | 用例数 | 覆盖 |
|---|---|---|
| `src/edge/verify/env3a-ime-submit.test.tsx` | **15** | 拼写页组词态/Shift 提交（A1-A5）、复习页数字键（A6-A8）、全库守卫盘点与 form 盘点（A9-A14） |
| `src/edge/verify/env3b-fullwidth-normalization.test.ts` | **20** | 全角/半角/撇号/空格覆盖表（B1-B16）、词块题（B17-B19）、分值越线（B20） |
| `src/edge/verify/env3c-input-env.test.tsx` | **15** | 输入框属性（C1-C4）、粘贴/换行/零宽（C5-C10）、Tab 与焦点（C11-C15） |
| `src/edge/verify/env3Fixtures.ts`（辅助，非测试） | — | 一个到期单词卡的最小数据构造（`seedWordFixture`） |

**运行结果**：

```
$ npx vitest run src/edge/verify/env3a-ime-submit.test.tsx \
                 src/edge/verify/env3b-fullwidth-normalization.test.ts \
                 src/edge/verify/env3c-input-env.test.tsx

 ✓ src/edge/verify/env3a-ime-submit.test.tsx (15 tests) 291ms
 ✓ src/edge/verify/env3b-fullwidth-normalization.test.ts (20 tests) 5ms
 ✓ src/edge/verify/env3c-input-env.test.tsx (15 tests) 172ms

 Test Files  3 passed (3)
      Tests  50 passed (50)
```

**类型检查**：`npx tsc --noEmit` 对 4 个新增文件**零错误**。

**既有测试无回归**：`kb1/kb2/kb3/kb6/kb8` 共 47 条全通过。

**关于 `npx vitest run src/edge/` 的 16 个失败文件（19 条）——均为既有失败，与本轮无关**（未改动产品代码，失败原因是另一并行会话把 `src/data/grammarLessons.ts` 从 203 课加到 **204** 课，而 `r7-invariants.test.tsx:67`、`p1-path-render.test.tsx:46`、`gq2-boost-items.test.ts:231`、`mg8-legacy-progress-numbers.test.tsx:119` 等仍断言 203；另有 `src/edge/verify/zzz-p7.test.ts`、`zzz-probe3.test.tsx` 是其他会话的临时探针文件，`zzz-probe3` 自身有 `Segmented` 导入错误）。已逐一核对，无一条来自 `env3*`。

---

## 7. 判定汇总

| # | 问题 | 文件:行号 | 严重度 | 判定 |
|---|---|---|---|---|
| 1 | 拼写页组词态回车提交半截输入 | `SpellingPage.tsx:470-475` | **P0** | 确认缺陷（jsdom+真机） |
| 2 | 拼写页 form onSubmit 同缺守卫 | `SpellingPage.tsx:465-468` | **P0** | 确认缺陷 |
| 3 | 复习页数字键无 target/isComposing 守卫 | `ReviewPage.tsx:144-146` | **P0** | 确认缺陷（jsdom+真机） |
| 4 | form 型提交点无 IME 防线（7 处） | `UnitsPage.tsx:1112/1167/1399/1512/1909`、`SentencesPage.tsx:88`、`WordsPage.tsx:392`、`GrammarLessonPage.tsx:2787` | **P0** | 确认缺陷（真机 3 处）+ 同构 4 处 |
| 5 | 拼写页不折叠全角（与句级管线口径不一致） | `diffService.ts:279-284` | **P1** | 确认缺陷 |
| 6 | 弯双引号 / 中文标点 `…—·「」《》` 漏折叠 | `diffService.ts:4-10` | **P1** | 确认缺陷 |
| 7 | 零宽字符 U+200B / 软连字符 U+00AD 穿透 | `diffService.ts:4-19, 279-284` | **P2** | 确认缺陷 |
| 8 | 全站零 `inputMode` / `enterKeyHint` | 全部输入框 | **P2** | 确认缺陷 |
| 9 | 除拼写页外无 `autocomplete/autocorrect/autocapitalize/spellCheck` | `ReviewPage.tsx:463` 等 | **P2** | 确认缺陷 |
| 10 | 可编辑框零 `lang="en"` | 全部输入框 | **P2** | 确认缺陷 |
| 11 | 换题强制 `focus()` / 弹窗 `autoFocus` + Escape 关窗 在组词中是否丢字 | `SpellingPage.tsx:263-268,508`；`UnitsPage.tsx:1413,1526,360-370` | **P2** | **需真机验证**（macOS 真实中文输入法，WKWebView） |
| 12 | 组词态 Escape 冒泡关闭弹窗/下拉/对话框 | `ConfirmDialog.tsx:73`、`AppSelect.tsx:58`、`UnitsPage.tsx:361` | **P3** | **需真机验证**（实机 Escape 是否先取消组词再说；真机已证 `isComposing=true` 会冒泡到 window） |
| 13 | 拼写页 Tab 守卫不含 IME 判断（组词态 Tab 是否被候选窗优先吃掉） | `SpellingPage.tsx:302-321` | **P3** | **需真机验证** |

### 已确认安全的方向（回归基线）

- 课程页/复习页/回访页/趁热练的 5 个输入框守卫正确（`PASS-A9/A12`），且既有 `kb1/kb2/kb3/kb6/kb8` 47 条覆盖
- 全角句号/逗号/问号/感叹号/分号/冒号 + 全角拉丁字母 + 四种撇号形态在**句级判分**全部覆盖（`PASS-B1/B2/B3`），严格标点模式下也一样（`PASS-B4`）
- 大小写、前后空格、连续空格、制表符、盘古空格、NBSP、BOM、换行/CRLF 全部归一（`PASS-B5/B6/B10/B12/C5/C7`）
- `its` vs `it's` 的语义区分被显式保护（`APOSTROPHE_HOMOGRAPHS`，`PASS-B18`）
- 日记页（中文写作主场景）**无 Enter 提交路径、无 form 包裹**，组词回车不会误触发批改（`PASS-C14`）
- 拼写页 Tab 劫持只作用于正文，输入框与 Shift+Tab 放行（`PASS-C11`）；`LibraryPage` 的 `/`、Cmd+K 已带 `isTyping` 守卫
- 粘贴重复文本被判错（不静默通过），长文本/带换行粘贴不撑坏判题（`PASS-C5/C6`）
