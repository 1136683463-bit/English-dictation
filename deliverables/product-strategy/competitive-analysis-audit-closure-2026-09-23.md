# 竞品与外部权威源分析 · 第 50 批：审计口径的收口

**项目**：英语听写 / 语法课 App（`/Users/liujun/Documents/英语听写`）
**批次**：第 50 批　**日期**：2026-09-23
**角色**：竞析（竞品与外部权威源）
**数据基线**：`src/data/grammarLessons.ts` **204 课**；`src/data/huntCases.ts` **213 案**

**主核查脚本**（只读，不改任何数据）——本批已按批四十九「携带项」建议归档到 `deliverables/`：

| 脚本 | 用途 |
|---|---|
| `working/audit-closure-2026-09-23/recount.mjs` | 三分类首扫（口径与任务书不同口径，暴露分歧）|
| `working/audit-closure-2026-09-23/final.mjs` | 口径 A/B 对账 + 上批三处复核 |
| `working/audit-closure-2026-09-23/locked.mjs` | 锁定口径：T（任务书）vs S（语义）双跑 |
| `working/audit-closure-2026-09-23/authoritative.mjs` | 不变量 + diff 四象限 |
| `working/audit-closure-2026-09-23/lattice.mjs` | 「错侧」三判据 P1/P2/P3 对照 |
| `working/audit-closure-2026-09-23/selfaudit.mjs` | 对本批推荐口径做反向自审 |

复跑方式：先用 `esbuild` 把两个数据文件打成 ESM（脚本头部已注明），再 `node <脚本>`。**全部使用 node 读数据，未用 grep**（本机 grep 为 ugrep，会假返回 0）。

---

## 1. 结论摘要

| # | 判定 | 结果 |
|---|---|---|
| 1 | 三数字 499 / 110 / 65 | **可复现，但不是 674 张的完整划分**——第三个数字 65 是**误分类**，不是一类设计 |
| 2 | 我上批「口径高估错误率」的担忧 | **半成立**：在 `wrongMark` 字段上**不成立**（任务书判断正确）；在**我上批的侦察口径上完全成立** |
| 3 | 你说的 `says` 4:0 例子 | **仍成立**，且是**「侦察口径」的错**，不是数据设计的错 |
| 4 | 两件事是否被混为一谈 | **是**。任务书 §6 把「数据设计」与「侦察口径」写成了同一个缺陷 |
| 5 | 安全侦察口径 | **P3：词 == 该卡 `wrongMark` 所指的词**（三判据中唯一同时避开两个陷阱的那个）|
| 6 | 跨源核查 | **成立**：题面点选位置与讲解改正形式是两套独立机制，Cambridge 官方页面本身就在示范这个区别 |
| 7 | 上批三处复核 | ①✅ 已修 ②✅ 已改（含一处残留）③✅ 13 处 |

**一句话**：任务书的 499/110/65 **不是错的数字，是一张「口径表」而不是一张「语义表」**——它数的是「字符串在哪出现」，而任务书把它当成「语义属于哪一类」来读。前两个数字（499/110）在统一口径下**方向正确**；第三个（65）**性质相反**。

---

## 2. 三数字复核

### 2.1 口径必须先说清：样本是什么

```
真实错卡（bothRight ≠ true）          726
  ├─ wrongMark 有值                   674   ← 三数字的样本
  └─ wrongMark 空/缺                   52   ← 已被任务书排除，正确
bothRight 双正解卡                    502   ← 已排除，正确
  其中 wrongMark 有值的                 0   ← 构造上恒为 0，排除无漏
contrast 卡合计                      1228
```

**样本选择无误**。674 是正确分母。

### 2.2 口径 T（复现任务书的那个口径）

```js
// token 化：小写 → 非 [a-z0-9'] 字符转空格 → 折叠空格 → 切分
const norm = s => String(s ?? "").toLowerCase().replace(/[^a-z0-9' ]/g, " ").replace(/\s+/g, " ").trim();
const toks = s => norm(s).split(" ").filter(Boolean);
const T = (mark, sentence) => toks(sentence).includes(norm(mark));  // 整串 mark 作为一个完整 token
```

结果：**只在错句 499 | 两边都有 110 | else 65** —— **逐字复现**。

### 2.3 那 65 是什么：不是「只在正确句」，是「整串匹配失败」

`T` 要求 `wrongMark` 整串等于句中的**一个 token**。全库有 **65 张卡的 `wrongMark` 是多词**：

| 例 | `wrongMark` | `wrong` | `correct` |
|---|---|---|---|
| L1c4 | `Am I` | `Am I Xiaomei.` | `I am Xiaomei.` |
| L13c5 | `you are` | `What you are doing?` | `What are you doing?` |
| L16c4 | `to be` | `You must not to be late.` | `You must not be late.` |
| L19c3 | `and I like bananas` | `I like apples, and I like oranges, and I like bananas.` | `I like apples, oranges, and bananas.` |

这 65 张里，`mark` 是 `wrong` 的**连续子串**的有 **65/65**；而**整串作为一个 token 命中 `wrong` 的只有 0/65**（因为在 `wrong` 里它们是多个词）。

**⇒ 它们整批掉进了 `T` 的 else 分支，被贴上了「只在正确句」的标签。**
**⇒ 而它们与「只在正确句」毫无关系**：65 张里 `mark` 整串 `raw` 出现在 `correct` 的只有 **8 张**，任一词出现在 `correct` 的 **60 张**。

验算：这 65 张用语义口径归类后 → **60 张进「两边都有」、5 张进「只在错句」、0 张进「只在正确句」**。

### 2.4 一个决定性不变量：第三桶在构造上是空集

```
mark ⊄ wrong 的卡数 = 0 / 674
```

因为 UI 渲染强制要求 `mark` 是 `wrong` 的子串：

```tsx
// src/pages/GrammarLessonPage.tsx:239
if (mark && item.wrong.includes(mark)) {   // 不在 wrong 里就整段不画删除线
```

**⇒「划的词只在正确句（= 该补进去的）」这一类，在本库不可能存在。**
任务书表格描述的第三类（65 处「该补进去的」）**在数据里没有对应物**——它是口径的产物。

### 2.5 口径 S（语义口径）：逐词 OR + 词边界

```js
const esc = w => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const wb  = (w, s) => new RegExp(`(?<![A-Za-z-])${esc(w)}(?![A-Za-z-])`).test(norm(s));
const S = (mark, sentence) => toks(mark).some(w => wb(w, sentence));   // 标记的任一词出现在句中
```

| 口径 | 只在错句 | 两边都有 | 只在正确句 | 合计 |
|---|---|---|---|---|
| **T**（任务书）| 499 | 110 | **65**（＝误分类）| 674 |
| **S**（语义）| **501** | **173** | **0** | 674 |

**两口径的差，全部来自那 65 张多词卡**（60 张迁移到「两边都有」，5 张到「只在错句」），另有 3 张单字卡（L111c0 / L117c3 / L118c0，`mark="Grandma"` 对 `Grandma's`）因撇号切分差异在 S 下归入「两边都有」。

**逐项对账**：

```
只在错句  499 + 5 − 3 = 501   （+5 来自多词卡，−3 来自 Grandma 家族迁出）
两边都有  110 + 60 + 3 = 173  （+60 来自多词卡，+3 来自 Grandma 家族迁入）
只在正确句     65 − 65 = 0    （65 张全部是误分类，无一真实）
                合计 = 674 ✓
```

### 2.6 三数字的最终裁定

| 数字 | 任务书读法 | 裁定 |
|---|---|---|
| **499** | 划的词只在错句（多出来/该换掉的）| **方向正确、量级略偏**（S 口径 501）|
| **110** | 划的词两边都有（位置缺东西）| **方向正确、量级偏低**（S 口径 173）|
| **65** | 划的词只在正确句（该补进去的）| **❌ 不成立**。它是「整串 token 匹配失败的 65 张多词卡」，其中 60 张实属「两边都有」|

**⇒「三类都是合理设计」这个结论：两类成立，第三类不存在。**
**⇒ 但任务书的核心论点（`wrongMark` 的语义没问题）依然成立**——因为 499 与 110 两类合起来就是全部真相的两个桶，第三桶是口径空转，不是设计缺陷。**详见 §3。**

---

## 3. 核心辨析：「wrongMark 语义」vs「侦察口径」

你的问题问得准：**这两件事是不是被我混为一谈了？** 答案是**是**，而且是在**两个层面同时**混的。

### 3.1 两个命题，必须分开

| | 命题 A（数据设计）| 命题 B（侦察口径）|
|---|---|---|
| 内容 | `wrongMark` 这个字段的语义，是不是「被划的词＝错的词」？ | 用「词出现在哪一侧」统计分布，能不能当「词被用错」？ |
| **判定** | **❌ 不是**，而且**从来不是** | **❌ 不能**，这是**真缺陷** |
| 状态 | 批 47 已澄清（三类设计），本批**再加一层确认** | 批 44/46 零星出现，批 49 在 `says` 上被抓到 |
| 谁的问题 | 无（不是问题）| **侦察脚本的问题** |

**任务书 §6 的推理链有问题**：

> 「我独立量化：110/674 处（16.3%）的『被划的词』同时也出现在正确句里——口径**系统性高估错误率**。这是第 4 次同类缺陷。」

这句话把命题 A 和命题 B 缝在了一起。**前半句是命题 A 的观察，后半句是命题 B 的结论**——中间的推论「被划词也在正句 ⇒ 高估错误率」**不成立**，因为：

> `wrongMark` **从来不是**「这个词错了」，它是「**看这里**」。划 `pen`（`I have pen.` → `I have a pen.`）是指这个位置有问题，`pen` 本身拼写、词形全对。

**你上批第 2 段的自我推翻（「划 pen 是指这个位置缺东西，不是 pen 错了」）是正确的**，本批复核确认。**但第 3 段紧接着又踩了一次**——只不过这次的地点从「数据」换到了「我自己的侦察脚本」。

### 3.2 你上批的 4:1 量化，问题不在「16.3%」这个数，而在「高估」这个词

「高估错误率」这个措辞预设了「那个比例本该是错误率」。但 `wrongMark` 的表达对象**根本不是错误率**，所以谈不上高估或低估——**它是另一件事的度量**。

用本批的 diff 结构量化（LCS 对齐 `wrong` 与 `correct`）：

| 类别 | 定义 | 张数 | 占比 |
|---|---|---|---|
| ① 划词 = 删除词，句中有插入 | 真·同位置换掉（`I have pen.`→`I have a pen.` 式）| **497** | 73.7% |
| ② 划词 = 删除词，纯删除 | 真·多出来（`I go the library.`→`I go to the library.` 式）| **83** | 12.3% |
| ③ 划词 = 锚点，句中有插入 | 划的是位置，缺的东西在别处 | **83** | 12.3% |
| ④ 划词 = 锚点，无插入 | 语序/大小写/标点 | **11** | 1.6% |

**①+② = 580（86.1%）**：划的词本身确实被替换/删除。
**③+④ = 94（13.9%）**：划的只是「位置」。

**94 这个数，就是「共现」的真实规模**（而任务书说的 110 是口径产物，任务书说的 65 是误分类）。**94 张全部是合理设计**——我逐张核对了它们的 `whyZh`：

- `L3c0 mark="pen"` / `whyZh`：「一个能数的东西不能光着出现，前面要给它配一个 a」← **讲解讲的正是这个位置**
- `L9c0 mark="school"` / `whyZh`：「『去哪里』中间要垫一个 to」← **同上**
- `L94c1 mark="eat"` / `whyZh`：「after 后面要有一整句——那个 I 不能省」← **划的是从句起点**

**94 张里 83 张的划词直接出现在自己的 `whyZh` 里**（我用「划词是否出现在该卡自己的讲解文本中」做判据）。剩下 11 张是同一件事的弱表达（如 `L141c1 mark="raining"`、讲解讲的是逗号）。**没有一张是缺陷。**

### 3.3 `says` 的例子：你的承认是对的，但结论要再进一步

复核 L38 的四处（`says` 在批 49 的 neg 侧）：

| 槽位 | 句子 | `says` 在 diff 里的角色 | 是错误位点吗 |
|---|---|---|---|
| `contrast[0].wrong` | `She says she will comes.` | 保留（未删未插）| ❌ 删除词是 `comes` |
| `contrast[2].wrong` | `She says she come.` | 保留 | ❌ 无删除，插入 `will` |
| `contrast[5].wrong` | `She says she will coming.` | 保留 | ❌ 删除词是 `coming` |
| `guided[0].options` | `She says` | — | ❌ **它就是正确答案**（`options[0]`，`answer="She says"`）|

**且这里还有一层你没提到的污染**：`guided.options` 里 **`== answer` 的选项槽占 410 / 1224 = 33.5%**（`choose`/`replace` 两种题型各 33.5%）。**批 49 把整个 `options` 数组算进「错侧」，等于把 410 个正确答案算成了错侧槽位。** `practice.distractors` 侧干净（`==answer` 为 **0/1067**）。

**⇒ 安全 neg 侧 = 726 + 1224 + 1067 − 410 = 2607**（批 49 写 3017）。

**关于 `say`/`says`/`said` 的裁定，我用「错误位点」口径重算后有三点修正**：

| 形式 | 批 49「错侧」| 安全口径「真错用」| 修正说明 |
|---|---|---|---|
| `say` | 5 | **5** | 不变（含 L38c3 `She say she will come.`——**`say` 确是真错处**）|
| `says` | 4 | **0** | 你的判断**完全正确** |
| `said` | 3 | **2** | 剔掉 1 处误收（`She said` 是 L38c6 的**错误位点之一**，见下）|

**⚠️ 一处需要你知道的例外**：`L38 contrast[6]`（`She said me she will come.` → `She says she will come.`）的 diff 删除词是 **`[said, me]` 两个**——`said` 在这里**确实是错误位点之一**（要改成 `says`）。批 49 说「`said` 真错用 0」在这张卡上**不成立**。但这不影响你的修复结论：你已把 `wrongMark` 改成 `me`（§6 复核 ✅），而 `said` 出现在「应该改成 `says`」的位置上，**「不能光把那个人摆在后面」的讲解仍然成立**——只是「`said` 本身没错」这句话，**只对*「say 后面带人」这一侧*成立，对*「主句时态要跟 `She says` 一致」这一侧不成立**。这是任务书 §6 修复文案的一处**轻微过度声明**（不影响功能，影响教学精确性）。

### 3.4 你的「4 次同类缺陷」表，有一条归错了类

| # | 缺陷 | 我的裁定 |
|---|---|---|
| 1 | `spot.answer` 是错词 | **真缺陷**（把错误算成正例）|
| 2 | `bothRight.wrong` 是正确句 | **真缺陷**（把正确算成错误）|
| 3 | 口径未随数字标注 | **真缺陷**（可复现性）|
| **4** | **「错侧」≠ 被划** | **⚠️ 归因错位**：`wrongMark ≠ 被划` 不是缺陷；**「用共现当错误」才是缺陷** |

**第 4 条的错处不在数据里，在侦察方法里。** 前三条都是「数据里有东西与它的名字不符」，需要改数据；第 4 条是「我的脚本假设了一个数据里没有的语义」，需要改脚本。**把方法缺陷记成数据缺陷，会导致修错地方**——比如去改 `wrongMark` 的数据（本批已证明不该改）。

**⇒ 建议把这行改成**：「#4｜侦察口径把『共现』当『错误』｜批 44 起潜伏、批 49 在 `says` 上暴露｜**性质：方法缺陷（不是数据缺陷）**」。

---

## 4. 安全的侦察口径建议（可执行判据）

### 4.1 三层判据，按可靠性排序

统计「某词在某侧的分布」时，**必须声明用的是哪一层**，三层不可混用：

| 层 | 判据 | 可回答的问题 | 不可回答的问题 |
|---|---|---|---|
| **P3（推荐）** | **词 == 该卡 `wrongMark` 指的词** | 「该词是否被教学认定为错误位点」 | 无 `wrongMark` 的 52 张（整句错，须单列）|
| **P2（可接受）** | 词 ∈ `wrong` **且** 词 ∉ `correct` | 「该词只出现在错句」 | 缺词型（`pen` 在正句里也有）会被误排 |
| **P1（禁用）** | 词 ∈ `wrong` | ❌ 什么都回答不了 | —— |

**P1 是本批要封的口径**：它把「词出现在一个含错的句子里」当作「词错了」。`says` 的 4 处全部是 P1 的产物，其中 1 处还是**正确答案**。

**P2 的实测缺陷**：`say` 在 P2 与 P3 下都是 5（不受影响），但 `said` 在 P2 下是 3、P3 下是 2——**P2 会把 `contrast[6]` 的 `said` 收进来**（因为 `said` 确实不在 `correct` 里），而这张卡的 `wrongMark` 是 `me`。**P2 的方向正确，但不精确**；若某个词只是「碰巧不在正确句里」，P2 会误收。

### 4.2 推荐口径 P3 的完整定义（可直接粘贴）

```js
// ── 第 1 步：只取「真错卡 + wrongMark 非空」──
//   bothRight 卡的 wrong 装的是正确句（types.ts:585 逐字），必须排除
//   wrongMark 空的 52 张是整句错，无单一错词，必须单列而非混入
const cards = [];
for (const l of grammarLessons)
  for (const c of (l.contrast ?? [])) {
    if (c.bothRight === true) continue;
    const m = (c.wrongMark ?? "").trim();
    if (!m) continue;
    cards.push({ lesson: l.number, mark: m, wrong: c.wrong, correct: c.correct });
  }

// ── 第 2 步：判据 = 词是否就是 wrongMark 指的词 ──
const norm = s => String(s ?? "").toLowerCase().replace(/[^a-z0-9' ]/g, " ").replace(/\s+/g, " ").trim();
const toks = s => norm(s).split(" ").filter(Boolean);
const isErrorLocus = (word, card) => toks(card.mark).includes(norm(word));

// ── 第 3 步：另两个槽位 ──
//   guided.options  : 必须逐项与 answer 比对，只把 != answer 的项算错侧（否则 33.5% 反向）
//   practice.distractors : 可直接使用（实测 ==answer 的为 0/1067）
const optionIsWrongSide = (option, item) => norm(option) !== norm(item.answer);
```

### 4.3 报告里必须写的两句话（防止下次再混）

1. **「本表的『错侧』口径 = P3 / P2 / P1」**（三选一，写在表头）。
2. **「`wrongMark` 的语义是『看这里』（位置指示），不是『这个词错了』」**——任何以 `wrongMark` 为输入的分析，结论措辞不能用「错误率」「错用」而不加限定。

### 4.4 若必须用 P1，唯一安全的写法

若某次分析确实需要「词出现在错句里」这个宽口径，**只能用于「曝光量/共现量」，并强制改名为「`wrong`-侧共现」**，且在报告中**禁止**与正侧相减、相除、或用「危险」类措辞。**P1 不可用于任何跨形状比较**（这正是 `says` 的 4:0 陷阱）。

### 4.5 对本批推荐口径的自审（自带盲区声明）

| 盲区 | 规模 | 处置 |
|---|---|---|
| `wrongMark` 为空的真错卡（整句错）| **52 张** | P3 **天然漏掉**，必须单列。经查这 52 张**不含 `say`/`says`/`said`**，故不影响 §3.3 的三形状裁定 |
| 被划词也出现在正确句里 | **169 / 674** | P3 **不回避**（它认位置，不认词形）——**这是特性不是缺陷** |
| 同一 `wrongMark` 在 `wrong` 中出现多次（歧义标注）| **7 张**：`L66c1:it.` `L75c0:to` `L142c0:will` `L143c2:will` `L144c0:will` `L144c3:will` `L170c1:both.` | P3 的计数不受影响（本批数的是「该卡是否含此词」），但**若要定位到第几个词**，必须走 `locateMarkedTokens`（`grammarBoostService.ts:215`）用正确句消歧 |

---

## 5. 跨源轻量核查：题面点选标记 vs 讲解改正标记

**结论：是两套独立机制，且有权威源可引。**

### 5.1 Cambridge Dictionary Grammar —— 官方页面本身就示范这个区别

**URL**：https://dictionary.cambridge.org/grammar/british-grammar/adjectives-and-adjective-phrases-typical-errors
（可访问，2026-09-23 抓取）

Cambridge 的「typical errors」板块用**两栏并列**呈现错误与正确：

> Correct: "His late wife Betty was related to my mother."
> **Not**: "His wife was late"

> Correct: "The trip was a complete disaster from start to finish."
> **Not**: "The disaster was complete"

> Correct: "The only person who can sort this out is Keith."
> **Not**: "The person was only"

> Correct: "The new results are clear from the diagram shown."
> **Not**: "… from the shown diagram"

**这四组每一组里，被质疑的单词在「正确句」与「Not:」句中同时出现**（`late` / `complete` / `only` / `shown`），差别只在**位置**。

**⇒ 权威源自己的处理方式，正是本项目 `wrongMark` 的处理方式**：「标记的是*位置*，不是*词形*」——`His wife was late` 里 `late` 拼写正确，Cambridge 也不会说 `late` 这个词错了，它说的是「这个位置放错了」。**这与 `I have pen.` 划 `pen`、`I sit between Tom to Amy.` 划 `to` 完全同构。**

同一站点的另两处逐字引用（本批同时抓取）：

> 「**Say does not take an indirect object.**」——https://dictionary.cambridge.org/grammar/british-grammar/say-or-tell

及其反例（同一页）：
> **Not**: "And then she said me …"
> **Not**: "… he said me."

**⇒ 这两条正是 L38 `contrast[6]`（`She said me she will come.`）的权威依据，逐字对应。**

以及批 49 已引、本批复核仍在的一行：
> 「The past simple of say is said, the past simple of tell is told」

### 5.2 教具侧的独立机制（第二源）

**URL**：https://dictionary.cambridge.org/grammar/british-grammar/verb-patterns-verb-infinitive-or-verb-ing（可访问）

同一站点在讲解 verb patterns 时，把**改正形式单独作为一句正确例句**列出，错误形式另起一行以 `Not:` 标注：

> "I always enjoy cooking." / **Not**: "I always enjoy to cook."
> "We haven't finished eating yet." / **Not**: "We haven't finished to eat."
> "Let me show you this DVD I've got." / **Not**: "They made us to wait …"

**⇒ 呈现层上「正确的形式」（讲解展示）与「错误的位置」（题面标记）是**两条各自独立的数据**，Cambridge 用两个不同的视觉单元承载。本项目用 `wrongMark`（题面划掉）与 `【】`（讲解改正形式）承载同一分工——**这是行业通行的双轨做法，不是本项目自创，因此也不该被当成「不一致」**。

### 5.3 抓取失败与限制（诚实声明）

以下尝试**失败**，不作依据：`learnenglish.britishcouncil.org` 多个路径（404）、`test-english.com`（403）、`englishclub.com`（403）、`grammaring.com`（403）、`englishgrammar.org`（403）、`cambridge.org/elt/blog`（403）、`teachingenglish.org.uk`（404/超时）。

**⇒ 我未能找到「点选/点击错词」这一交互形态的权威练习页逐字引用。** §5.1/§5.2 证明的是**「改正形式单独呈现、与被标记的位置分开」在权威源中确有独立地位**，**不能**证明「点击式题面 + 讲解改正」这个组合在主流产品里普遍存在。**这一条仍是开放项**（见 §8）。

---

## 6. 上批三处成果复核

### ① L38 `contrast[6].wrongMark`：`said` → `me`　✅ **已修**

```
L38 contrast[6]  wrong   = "She said me she will come."
                 wrongMark = "me"        ← 应为 "me"，实测是
                 correct   = "She says she will come."
全课 wrongMark = ["comes","not","come","say","comes","coming","me",null]
全课是否仍有 "said" 被划 = 无 ✓
同课 contrast[7] bothRight=true, wrong="She said to me she will come."  ← 双正解侧
```

**同课矛盾已消除**：`said` 不再被划，而 `contrast[7]` 仍把含 `said` 的句子声明为正确——两处不再冲突。**且 `me` 在 `wrong` 里的命中数为 1，不产生歧义标注。**

### ② `IRREGULAR_PAST` 注释去「18 项」　✅ **已改**（含一处残留）

```
条目实测 = 49 对
  前 17（原有）: come, go, arrive, leave, take, get, see, say, tell, give,
                 find, bring, buy, meet, run, eat, sleep
  后 32（批 44 补）: swim, sing, sit, catch, think, know, keep, feel, draw,
                    break, fall, lose, win, hear, write, speak, stand, hold,
                    spend, build, wear, teach, pay, sell, send, ride, drive,
                    fly, grow, begin, choose, wake
```

注释已改为结构性说明，且明确写下「**不要引用具体数字**」「要判断覆盖度请看课程侧的缺口审计，不要看这张表」——**这正是正确的收口方式**。

**⚠️ 一处残留**：注释里「18」这个数字仍以**被修正对象**的身份出现两处（「原写『18 项当前永不触发』——这个数字**不准确**」「实测可触发项**远少于 18**」）。**这是叙事而非断言，方向是对的**；但若希望未来 grep/node 扫描「本注释不再出现具体数字」能过，**需要把这两处也换成「某个数字」**。属**可选的洁癖项，非缺陷**。

### ③ `comparison` 仍是 13 处　✅ **确认**

```
huntCases（213 案）tag 分布：
  verb_form:162  sv_agreement:143  plural:129  word_order:95  tense:84
  preposition:69  article:29  fragment:28  missing_be:26  run_on:18  comparison:13
```

**⇒ `comparison = 13`，逐字一致。**

**⚠️ 一处口径提醒**：`comparison` 是 **`huntCases`（找错案）的 `tag` 值**，在 `grammarLessons.ts` 里**出现 0 次**。若后续批次用「在 grammarLessons 里搜 comparison」来复核这个数字，会得 **0**——**本批我第一次跑就掉进了这个坑**（§7）。**复核 `comparison` 必须读 `huntCases.ts`。**

---

## 7. 自我核查记录

**我在本批自己踩的坑（按发现顺序）**：

| # | 坑 | 如何发现 | 处置 |
|---|---|---|---|
| 1 | 第一次跑 `comparison` 在 `grammarLessons` 的 contrast 卡里找，得 **0**，与任务书的 13 冲突 | 怀疑口径（而非怀疑数据）| 重查发现它在 `huntCases.tag`——**「复核一个数之前先问它住在哪张表」** |
| 2 | 第一版 token 化**保留标点**，导致 `don't` / `It's` / `brother's` 被判为「不在句中」，11 张卡口径翻转 | 两种实现交叉比对时发现分歧卡 11 张 | 改为「非 `[a-z0-9']` → 空格」，**保留撇号**；分歧降至 3 张（`Grandma`/`Grandma's`）|
| 3 | 一度准备把「65 张多词卡」直接写成「第五个缺陷」 | 先跑了 9 种判据的网格搜索，发现 65 **精确等于**多词标记数 0 命中 | 改判为**「口径产物」而非数据缺陷**——**这次没犯「从数据形态反推语义」的错，因为我先跑了判据网格** |
| 4 | 曾想直接用「划词 ∉ correct」当安全判据（P2）| 在 `said` 上算出 3 而非 2，发现 `contrast[6]` 的 `said` 被误收 | 降级为「可接受但不精确」，推荐 P3 |

**本批遵守的纪律**：
- **未用 grep**（本机 ugrep 会假返回 0），全部 node 读数据
- **未改任何数据文件**（本批只读；§6 的复核是对上批改动的验证）
- **每个数字都给出复现脚本**，并归档到 `deliverables/`
- **判据先跑网格再下结论**（§7 坑 3），避免「从数据形态反推语义」

**一处方法论自证**：任务书怀疑「我用『讲解里的 `【】` 与 `wrongMark` 不一致』当判据，扫出 168 处疑似划错对象，全是正常设计」。本批**独立验证了这个结论的机制**——`L3c0` 划 `pen` / 讲解讲 `a`、`L9c0` 划 `school` / 讲解讲 `to`：**`wrongMark` 是题面交互标记，`【】` 是讲解改正形式**（§5.1 的 Cambridge 双栏等价）。**168 处确实全是正常设计，你的判断正确。**

---

## 8. 不确定项

| # | 不确定项 | 影响 | 我的置信度 |
|---|---|---|---|
| 1 | **任务书那三个数字的具体脚本我没拿到** | 我复现了 499/110/65，但**无法确认任务书用的是不是我推断的 token 精确口径**（虽然 499+110 只能由它产生，见 §2.2）| **高**（数值唯一匹配），但**非 100%** |
| 2 | **「点击式题面 + 讲解改正」在主流产品的普遍性** | §5.1/§5.2 证明「标记位置」与「改正形式」分离有权威先例；**未找到点选交互形态的逐字引用** | **中** |
| 3 | **`said` 在 `contrast[6]` 是否真该算错误位点** | 依赖「主句该用 `says`（现在时）」这个教学立场。我按 diff 判为「是」；但该课的 `intentZh`「她说她会来」下 `said` 也说得通 | **中**（**建议产品裁定**）|
| 4 | 另有 **3 张单字卡**（`L111c0`/`L117c3`/`L118c0`，`Grandma` vs `Grandma's`）在两口径下归属不同 | 只影响「499 还是 496」的尾数 | **高**（机制已明：撇号切分）|
| 5 | `guided.options` 的 410 个 `==answer` 槽位，是否**全部**是设计意图 | 我从数据（`options` 含 `answer`）判定其为「正确答案被误算」；**若 UI 层另有「答对后再展示全部选项」的语义，则不算误算** | **低**（未读判题代码，只读了数据形态——**这恰好是本批批评的那个错误，我在此明确标注**）|

**关于第 5 项，我必须自己认领同一类风险**：任务书 §6 的正确教训是「不要从数据形态反推语义，要读判题代码」。**我在这一项上没有读判题代码**（`guided` 题的判分逻辑我没查），所以 **410 这个数字的「误算」定性，应按低置信度对待**。本批时间未及；建议下批用 `spot` 口径的方式，读 `choose`/`replace` 的判题实现再定。

---

## 9. 对任务书「三分类表」的最终建议写法

原表（**建议改**）：

| `wrongMark` 的语义 | 数量 | 判定 |
|---|---|---|
| 划的词只在错句 | 501 | ✅ 合理设计 |
| 划的词两边都有 | 173 | ✅ 合理设计 |
| 划的词只在正确句 | 0 | **不存在**（构造上是空集，§2.4）|
| 整句错、无单一错词（`wrongMark` 空）| 52 | ✅ 合理设计（须单列）|
| **合计** | **726** | ＝ 全部真错卡 ✓ |

并在表头加一句：**「本表口径 = 逐词 OR + 词边界（P3 的宽口径版本）；`wrongMark` 的语义是『看这里』，不是『这个词错了』。」**

**⇒ 这样写，三类变四类，数字能对上 726 全量，且每一类都对应真实存在的设计。**
