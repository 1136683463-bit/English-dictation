# 瑞思 · 第 51 批用户研究与内容缺口分析：「缺了一块」标签的准确性与是否该改

- **批次**：第 51 批（承接批五十「52 张无标注卡被 UI 一律称作『缺了一块』」的待决项）
- **范围**：只做研究，**不改任何代码 / 数据**（本批报告未产生任何 `src/` 改动；探针文件已删除，见 §7）
- **本批主题**：`wrongMark === null && !bothRight` 时渲染的「缺了一块」标签，**该不该改、怎么改**
- **日期**：2026-09-23
- **全库量级（本批实测）**：204 课 / 对照卡 **1228** 张 / 有值 `wrongMark` **674** 张 / `bothRight` 且无值 **502** 张 / 无标注错卡 **52** 张 / 多词 `wrongMark` **65** 张
- **核查脚本**：`/tmp/*.cjs`、`/tmp/*.ts`（本批临时只读脚本，未落盘到项目内；关键脚本正文见 §2.2、§2.3）
- **渲染探针**：临时 vitest 探针（已删除，见 §7.2），实测四张卡的 DOM 输出见 §2.4

---

## ① 结论摘要

| # | 结论 | 把握度 |
|---|---|---|
| 1 | **39/9/2/2 四个数字全部复现，一个不差。** 用「错句词数 vs 正句词数 + 词集合是否相同」的宽松口径（= 批五十一任务书口径）读全库 1228 张对照卡：**真缺词 39 / 等长·语序反 9 / 等长·替换 2 / 多词 2**，合计 52。 | 高 |
| 2 | **但这四个数字是「残差桶」口径的产物，不是「缺词」口径。** 39 这个桶的定义是「既不等长、也不更长的剩余全部」——它**内部还混着 3 张改写卡**（`I like the boy is tall.` / `Yes.` / `How long it takes?`，都是既删又插）。真正「字面就是挖掉连续一块」的只有 **36 张**。另 3 张（`This is the book I read it.`、`It cold today.`、以及 3 张只差逗号的）词数相等或更短，属边界情形。 | 高 |
| 3 | **该改——但只改文案，不改数据，也不要按类型分文案。** 我的结论是 **(b) 换一句更宽的中性说法**，且**保留「整句都有问题」这个更弱的说法，不再声称「缺东西」**。理由：这枚标签的作用是**定位**（哪句有问题），不是**诊断**（缺了什么）——而它现在承担的诊断任务，下一行 `whyZh` 已经在做，且做得比标签好。 | 高 |
| 4 | **「引导 vs 诊断」的关键事实：这枚标签根本不在用户判断之前出现。** 它渲染在 `revealed` 分支（`GrammarLessonPage.tsx:354` 的 `) : (` → 第 356-360 行），**必须在用户点完 A/B 之后才出现**。官方设计意图写在 `LessonContrastCard` 的 docstring：「先展示错/对双句让用户判断哪句正确（Noticing 训练），再揭示答案 + 为什么」（第 217-220 行）。**所以它 100% 是事后诊断文案，不是事前提示**——「引导作用」这个辩护前提在本代码里不成立。 | 高 |
| 5 | **这直接推翻 (a) 的主要理由。** 任务书问「精确性对引导作用的实际影响」——答案是不必讨论引导作用，因为**没有引导作用可言**：用户看到这枚标签时，已经选完、已经知道自己对错（`lesson-verdict-banner` 就在下一行），此时唯一还缺的信息就是「错在哪」，而这正是「缺了一块」会**说错**的地方。 | 高 |
| 6 | **建议文案（唯一推荐）**：`<span className="lesson-contrast-hole">整句都要看</span>`。备选 `这句要改一改` / `换个说法才行`。三选全部**零术语清白**、**不触发挫败话术红线**（§4.3 实测）。推荐理由：「缺了一块」把范围**缩小**到一个位置（且常常指错），「整句都要看」把范围**放宽**到整句——**放宽的引导永远是安全的，缩小的引导必须正确**。 | 高 |
| 7 | **9 张「等长·语序反」的讲解完全讲清了「是谁站哪儿不对」。** 9 张里 8 张明确说出位置（`词的站位不换` / `Is it 开头是问句` / `Are they 开头是问句` / `whose 后面直接跟东西` / `两段之间要点个逗号` / `but 站中间，前面点个逗号`），只有 `lesson-85-whose` 用「后面直接跟东西」代替了「位置」二字但仍准确。**⇒ 「标签不准确但讲解准确」成立**，且这**加强**而非削弱了改的建议：一行里两句话自相矛盾（标签说「缺」、讲解说「位置」），比两句都含糊更糟。 | 高 |
| 8 | **选 (c) 的成本高于收益，不做。** 理由有三：① 判定规则要在渲染层做词级对齐（`wrong` 是否 `correct` 的子序列），这是一段**新的算法**，而项目已有的同族定位算法 `locateMarkedTokens` 曾因同类的「自己写匹配」踩坑 14 处；② 16 张的规模不值得新增一个带算法的分支；③ 更根本的是——**(c) 是在为一句本就不该说的话做精细化**。用户不需要知道「是缺还是错位」，`whyZh` 会告诉他。 | 高 |
| 9 | **外部依据成立**：Nielsen Norman Group 的启发式 #9 明确要求错误信息「precisely indicate the problem」；WCAG 2.2 的 Error Identification（3.3.1）要求「the item that is in error is identified and the error is described to the user in text」。逐字引用与 URL 见 §6。**两者都指向「说错 = 缺陷」**，即 (a) 不成立。 | 中高 |
| 10 | **本批无数据改动需求。** 52 张的 `wrong`/`correct`/`whyZh` 三字段全部自洽且教学正确；问题**只在渲染层的一句常量文案**。这也意味着修复成本极低：**一行字**。 | 高 |

**最关键的一句话**：任务书把选择框成「精确 vs 宽泛」的权衡，但**这枚标签根本没有「引导」职责**——它在用户答完之后才出现，所以它是**诊断文案**；而诊断文案**说错就是缺陷**，不存在「宽泛一点也可以」的空间（NN/g 与 WCAG 都明说）。因此答案不是 (a) 的「容忍 25% 不精确」，而是 **(b) 换掉那句做了诊断的措辞，换成不做诊断的措辞**。

**第二关键的一句**：这 16 张「不成立」里，**有 13 张的错句并不比正句短**（9 张等长、2 张多一个 `not`、2 张等长替换）——「缺了一块」在这 13 张上是**用户一眼就能证伪的假话**：错句明明跟正句一样长甚至更长，屏幕上却写着「缺了一块」。剩下 3 张（`I like the boy is tall.` / `Yes.` / `How long it takes?`）错句确实更短，但缺口不止一块、还伴随删旧词，属「半成立」。**一句话说错四分之一，其中四分之三的错还是一眼可见的**——这不是风格问题。

---

## ② 四类数字核实（含脚本）

### 2.1 全库口径确认（先钉住分母）

| 指标 | 实测 | 与 `src/types.ts:596-598` 注释 | 一致？ |
|---|---|---|---|
| 对照卡总数 | **1228** | 未写总数 | — |
| `wrongMark` 有值 | **674** | 674 | ✓ |
| `bothRight: true` 且无值 | **502** | 502 | ✓ |
| 无标注错卡（`!wrongMark && !bothRight`） | **52** | 52 | ✓ |
| 多词 `wrongMark`（含空格） | **65** | 65 | ✓ |
| 课数 | **204** | — | — |
| 每课对照卡张数分布 | 6 张 ×201 课、7 张 ×2 课、8 张 ×1 课 | — | — |

`src/types.ts:596-598` 的三行注释**在本批仍然准确**（批五十曾发现注释数字过期，现已同步）。这是一个正面确认。

### 2.2 四类划分的复现脚本（宽松口径 = 任务书口径）

```js
// /tmp/classify.cjs —— 读 /tmp/unmarked.json（由 vite-node 导出 52 张无标注卡）
const toks = s => s.toLowerCase().replace(/[.,!?;:]+/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
const sameMultiset = (a, b) => a.length === b.length && [...a].sort().every((t, i) => t === [...b].sort()[i]);
const isSubseq = (a, b) => { let i = 0; for (const t of b) { if (i < a.length && a[i] === t) i++; } return i === a.length; };

for (const r of rows) {                    // rows = 52 张
  const a = toks(r.wrong), b = toks(r.correct);
  let kind;
  if (a.join(" ") === b.join(" ")) kind = "纯标点";                       // 0 张
  else if (sameMultiset(a, b))     kind = "等长·语序反";                   // 9 张
  else if (a.length === b.length)  kind = "等长·替换";                     // 2 张
  else if (a.length > b.length && isSubseq(b, a)) kind = "多词";           // 2 张
  else                             kind = "真缺词（残差桶）";              // 39 张
}
```

**实测输出（逐张可核）**：

```
SUM: {"真缺词(残差桶)":39, "等长·语序反":9, "多词":2, "等长·替换":2}  TOTAL: 52
```

**⇒ 39 / 9 / 2 / 2 全部复现，任务书数字准确。**

### 2.3 但 39 这个桶的边界是「残差」，不是「缺词」

同一个脚本把 `等长·语序反` 里**只差标点**的 3 张剔出来单看：

```
等长·语序反 (9) 中只差标点的：
   lesson-91-before        Before I eat I wash my hands.  ||  Before I eat, I wash my hands.
   lesson-92-when          When it is sunny I run.        ||  When it is sunny, I run.
   lesson-140-but-vs-although  It is raining but I will go out. || It is raining, but I will go out.
```

再用「**错句 = 正句挖掉一段连续词**」这个严格口径重算（`/tmp/contig.cjs`）：

| 严格口径 | 张数 | 说明 |
|---|---|---|
| ① 错句恰是正句挖掉**连续一块** | **36** | 「缺了一块」字面完全成立 |
| ② 等长·单块替换/换序 | **11** | 9 张语序反 + `It cold today.`（`it`→`it's`）+ 3 张标点卡里的 1 张 |
| ③ 两块以上 / 重写 | **5** | 2 张多 `not`、`I like the boy is tall.`、`Yes.`、`How long it takes?` |

**⇒ 39 桶内有 3 张不属于「缺词」**（`lesson-41-two-things` / `lesson-69-mind` / `lesson-73-how-long`）：它们**既删又插**——

```
lesson-41-two-things   I like the boy is tall.   →  I know the boy who is tall.   删:like  插:know,who
lesson-69-mind         Yes.                       →  Of course not.                删:yes   插:of,course,not
lesson-73-how-long     How long it takes?         →  How long does it take?         删:takes 插:does,take
```

**因此「真缺词」的准确数字是 36（保守 39）。** 但**这不改变结论**——两种口径下「不成立」都是 16 张（52 − 36）或 13 张（52 − 39），量级一致，结论同一。

### 2.4 渲染层实测：这枚标签什么时候出现（本批最重要的发现）

我在项目内临时建了 vitest 探针（jsdom + 真实挂载 `GrammarLessonPage`），驱动真实课次走完前测 → 讲解段，抓取 DOM。**实测输出**：

**（a）第 87 课，未标注卡 `It cold today.`（无标注、错句 3 词、正句 3 词）**

```
CARD1 BEFORE PICK:  两句话只有一句是对的——点出你认为对的那句：AIt's cold today.  BIts cold today.
   card1 .lesson-contrast-hole 数量 BEFORE = 0
CARD1 AFTER  PICK:  Its cold today. ← 有问题的是这句
                   你判断对了——这组你没问题   It's cold today.
                   短版的尾巴上有一小撇：It's——那一撇是把 is 挤掉后留下的记号，丢了它就成了「它的」。
   CARD1 .lesson-contrast-hole 数量 AFTER = 1
```

> 注：该课 `contrast[0]` 是 `bothRight` 卡，`contrast[1]` 是标注卡 `Its`，未标注卡在 `contrast[2]`（practice 段）。上例抓到的是标注卡；下例抓的是**真正的未标注卡**。

**（b）第 13 / 15 / 31 课，未标注卡（`She drawing a bird.` / `I want go home.` / `I want biggest apple.`）— 讲解段前 2 张**

```
### lesson-13-now CARD 0
  BEFORE: 两句话只有一句是对的——点出你认为对的那句：AShe drawing a bird.BShe is drawing a bird.
  CHIPS : ["缺了一块","← 有问题的是这句"]
  WRONG : "She drawing a bird.缺了一块← 有问题的是这句"
  HTML  : She drawing a bird.<span class="lesson-contrast-hole">缺了一块</span><span class="lesson-contrast-hole">← 有问题的是这句</span>

### lesson-13-now CARD 1   （有 wrongMark 的对照组）
  CHIPS : ["← 有问题的是这句"]
  HTML  : I am <span class="lesson-contrast-mark" ...>draw</span> a picture.<span class="lesson-contrast-hole">← 有问题的是这句</span>
```

**（c）第 40 课（`This is the book I read it.` → 等长·替换）与第 92 课（`When it is sunny I run.` → 只差逗号）— 讲解段前 2 张**

```
@@@@ lesson-40-which-book — MISLABELED CARD ON SCREEN @@@@
  A/B options : ["AThis is the book which I read.","BThis is the book I read it."]
  WRONG LINE  : "This is the book I read it.缺了一块← 有问题的是这句"
  CHIPS       : ["缺了一块","← 有问题的是这句"]
  FULL CARD   : "...缺了钩子（which），还多留了 it。把 it 换成 which 挂上去：the book which I read。眼光很准，继续。"

@@@@ lesson-92-when — MISLABELED CARD ON SCREEN @@@@
  A/B options : ["AWhen it is sunny, I run.","BWhen it is sunny I run."]
  WRONG LINE  : "When it is sunny I run.缺了一块← 有问题的是这句"
  FULL CARD   : "...两段之间点个逗号：When it is sunny【,】 I run——跟 after/before 一个规矩。眼光很准，继续。"
```

**三条实测结论**：

1. **标签在 `revealed` 分支内**（`picked !== null` 之后），用户**答完才看到**。同一行的 `.lesson-verdict-banner`（「你判断对了」/「你选的是×××」）也在此时出现。**⇒ 它是事后诊断文案。**
2. **紧邻的第二枚 chip `← 有问题的是这句`** 是无条件渲染的（第 359 行），已经承担了「定位」职责；`缺了一块` 是**在定位之外多做了一次诊断**。
3. **第 40 课那行卡片最能说明问题**：屏幕上从左到右是 `This is the book I read it.` + `缺了一块` + `← 有问题的是这句`，下一段 `whyZh` 却说「**缺了**钩子（which），**还多留了** it」——**标签说「缺」，讲解说「缺 + 多」**，两句话在同一张卡里互相打脸。而用户一读讲解就会发现自己刚才信的那句是错的。

### 2.5 这 16 张分布在哪儿（暴露面）

| 渲染位点 | 代码位置 | 缺词（准确） | 不成立 | 小计 |
|---|---|---|---|---|
| 讲解段 前 2 张（`slice(0, 2)`） | `GrammarLessonPage.tsx:2688` | 24 | **5** | 29 |
| 练段 中 2 张（`slice(2, 4)`） | `:3194` | 5 | **7** | 12 |
| 挑战前 后 2 张（`slice(4)`） | `:3818` | 7 | **4** | 11 |
| **合计** | | **36** | **16** | **52** |

**涉及 15 课 / 204（课号）：1、2、6、7、26、29、40、41、69、73、85、87、91、92、140。**

⚠️ **暴露面最高的是第 1 课和第 2 课**——`I am not happy today.`（第 1 课，练段）与 `You are a teacher?`（第 2 课，练段）是新用户的**第 1、2 课**。「缺了一块」在这里说的是**错句比正句更长**的假话（`not` 是多的，不是缺的）。零基础新用户在最初十分钟里拿到的第一条「错在哪」信息就是错的。

> 注：前测（pretest）**不渲染这枚 chip**。前测只取 `lesson.contrast.find(item => !item.bothRight) ?? lesson.contrast[0]`，渲染走 `PretestReviewCard`（`:395-465`），那里只显示「原句 / 你的判断 / 正确判断 / 正确说法 / whyZh」，没有 `lesson-contrast-hole`。**⇒ 5 张在前测位的卡（`It cold today.` 等）的反例不受影响，前测是干净的。**

---

## ③ 判定与理由

### 3.1 「引导作用 vs 诊断作用」——这个框架在代码里不成立

任务书要求我评估「这类标签的作用是引导用户去找问题，不是诊断问题」，据此判断精确性的影响。**我实测后的答案是：这枚标签没有引导职责。**

| 问题 | 实测答案 | 证据 |
|---|---|---|
| 标签在用户判断之前出现吗？ | **否**。在 `revealed` 分支内，`picked !== null` 之后 | `:354 ) : (` → `:356-360`；§2.4 探针 BEFORE CHIPS = 0 |
| 用户看到标签时，还知道「哪句错」吗？ | **已知道**。紧邻的 `← 有问题的是这句` 就在同一条 `<p>`；且卡片上方已有 `lesson-verdict-banner` | `:359`、`:364-374` |
| 那用户此刻缺什么信息？ | **缺「错在哪」**——这正是 `whyZh` 提供、而标签在抢答的那件事 | `:377` |
| 官方设计意图？ | 「先展示错/对双句让用户判断哪句正确（Noticing 训练），再揭示答案 + 为什么」 | `:217-220` docstring |

**⇒ 「引导作用」的辩护前提不存在。** 这枚标签 100% 是事后文案（post-answer diagnostic copy），与 `whyZh` 在同一个揭示面板里。既然不是引导，就不能用「引导可以宽泛」来豁免。

**⇒ (a) 不成立。** 「宽泛的提示可以接受」只适用于**事前**提示（用户还没答题，宽泛是为了不剧透）。事后的「为什么」宽泛 = 没回答。

### 3.2 为什么也不是 (c)：为一句不该说的话做精细化

(c) 需要一个判定式。我实测出一个**完全可靠**的判定式（在本批数据上 100% 吻合）：

```js
// 错句是否「整词缺失」——即 wrong 是 correct 的严格子序列（词级）
const toks = s => s.toLowerCase().replace(/[.,!?;:]+/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
const isSubseq = (a, b) => { let i = 0; for (const t of b) { if (i < a.length && a[i] === t) i++; } return i === a.length; };
const isMissing = c => { const a = toks(c.wrong), b = toks(c.correct); return a.length < b.length && isSubseq(a, b); };
// 实测：isMissing 命中 36 张；未命中 16 张 —— 与「挖掉连续一块」口径逐张集合相同（set equality 已验）
```

**但我不建议采用它**：

1. **收益是 16 张。** 全库 1228 张卡里，这是一条覆盖 1.3% 的分支。
2. **成本是一段新算法进渲染层。** 项目已有同族教训：`src/types.ts:603` 明确记着「历史上曾因『用裸 `indexOf` 定位』导致 14 张卡的删除线划进别的单词内部——定位一律走 `locateMarkedTokens`（词边界 + 正确句消歧），不要自己写」。在渲染层再塞一段「自己写的词级对齐」与这条纪律相悖。
3. **更根本：它仍在回答一个用户没问的问题。** (c) 的精化目标是把「缺了一块」换成一个更准确的诊断（如「这儿站错了」）。但用户此刻**不需要标签告诉他类型**——下一行的 `whyZh` 已经用教学语言讲得比任何 8 字标签都清楚。**标签的职责只有「指哪句」，那件事第 359 行已经做完了。**

**⇒ (c) 是把力气花在让一句多余的话变准确。** 正确做法是让那句多余的话**变得不多余**——即换成不做诊断、只表「这句从头到尾都得看」的说法。

### 3.3 为什么是 (b)：缩小的引导必须正确，放宽的引导永远安全

| 说法 | 声称的范围 | 在 36 张上 | 在 16 张上 | 安全性 |
|---|---|---|---|---|
| 「缺了一块」 | **一个位置**缺东西 | ✓ 正确 | ✗ 错误（其中 13 张用户一眼可证伪） | **不安全**：范围缩得太小，缩错了就自相矛盾 |
| 「整句都要看」 | **整句**从头到尾 | ✓ 成立（缺了一块 ⇒ 整句都得看） | ✓ 成立（是错位/多词/换法 ⇒ 更得整句看） | **安全**：条件更弱，36 与 16 都满足 |

**这两句话是蕴含关系**：「缺了一块」⊂「整句都要看」。改文案是**把断言削弱**，因此不会在任何一张卡上变错，只会丢掉一个**本来就有 31% 出错率**的额外信息。**这是无损的。**

同时这一改动有一个额外收益：**「整句都要看」教给用户一个更好的做法。** 这 52 张卡里绝大多数的改动恰恰需要看整句——
- `You are a teacher?` → 要看**整句**才知道这是「说」还是「问」（词的站位）；
- `It cold today.` → 要看**整句**才知道 `It` 得跟后面的 `cold` 连起来（`It's`）；
- `Before I eat I wash my hands.` → 要看**整句**才知道两段之间该断（逗号）。

而「缺了一块」教用户**盯一个位置**——在这 16 张上，这个教法是**反的**：盯着位置看不出来，得退一步看整句。**⇒ 换文案不只是修 bug，还修正了一个教学暗示。**

---

## ④ 具体文案

### 4.1 推荐（唯一）

```tsx
{!mark && <span className="lesson-contrast-hole">整句都要看</span>}
```

**为什么这句比「缺了一块」好**：

1. **对 52/52 张都成立**（36 准确 ∪ 16 不成立，两者都满足）。
2. **零术语、零挫败话术**（§4.3 实测）。
3. **与项目既有措辞同族。** 库里「整句」是**成熟的教学词**（用户可见字段中出现 **32 处**，如「after 后面要有一整句：谁 + 做什么」「when 也领一整句——When it is sunny, I run」「during 后面只能跟『名字』……要说一整句，得用 while 领路」）。**用「整句」这个用户已经在别处学过的词，零学习成本。**
4. **与紧邻的第二枚 chip 不重复又互补**：`整句都要看`（范围）+ `← 有问题的是这句`（是哪句）。两枚 chip 一句话说完「哪句 · 多大范围」。
5. **不剧透、不诊断**：不声称缺 / 多 / 错位，因此不会与任何一张卡的 `whyZh` 冲突。

### 4.2 备选（同等合格，供设计取舍）

| 文案 | 语感 | 与既有风格的距离 | 备注 |
|---|---|---|---|
| **`整句都要看`** | 中性、给方法 | 近（「整句」32 处） | **推荐** |
| `这句要改一改` | 轻微、不点破 | 中（「改」字在库内常见） | 可以，但不如前者给出「往哪看」 |
| `换个说法才行` | 提示「是换不是补」 | 中（「换个说法」库内 8 处） | 更贴近 16 张的事实，但对 36 张略偏 |
| ~~`词站错了地方`~~ | — | — | **不采用**：在 36 张上错，且含「错」字 |
| ~~`这儿有问题`~~ | — | — | **不采用**：与第 359 行 `← 有问题的是这句` 三词重复 |

### 4.3 红线实测（脚本 `/tmp/gate.ts`，用项目自己的 `findZeroTermHits`）

```
候选                    零术语   挫败话术(bo8)   rv7禁用词     含「错」
缺了一块                ✓        ✓              ✓             无
这句要改一改            ✓        ✓              ✓             无
整句都要看              ✓        ✓              ✓             无
换个说法才行            ✓        ✓              ✓             无
这句不太对              ✓        ✓              ✓             无
这儿站错了              ✓        ✓              ✓             有  ← 触发 bo8「做错/答错」邻近风险，不用
```

- **零术语**：`findZeroTermHits`（项目权威实现，`src/data/grammarZeroTerms.ts`）返回空。
- **挫败话术**：`bo8-redlines.test.tsx:33` 的 `AFFECTIVE_BANNED`（含「做错/答错/错误/不正确」）与 `rv7-copy-and-consistency.test.tsx:30` 的 `DISCOURAGING`（含「正确/错误/做错/答错/**不对**/失败了」）**均未命中**。
- ⚠️ **注意 rv7 把「不对」列为禁用词**（`rv7-copy-and-consistency.test.tsx:30`）。实测：`"这句不太对".includes("不对") === false`（「不太**对**」的「对」不与前字构成连续子串），故它**当前不会**触线。但这依赖「避免连写」这一偶然条件，属**踩线**措辞；`整句都要看` 里没有「对 / 错 / 不」任何一个字，**结构性安全**——这是它相对备选的一个实际优势。
- **`src/pages/GrammarLessonPage.tsx` 目前没有任何测试断言过「缺了一块」这个字符串**（全库 grep 仅 1 处命中，即第 358 行本身；`src/` 内无测试引用）。**⇒ 改这一行不会打破任何现有测试。**

### 4.4 一处需要连带确认的地方（本批未改，供实施时核对）

第 358 行改动后，同一分支的语义读起来应是：

```
[错句]  →  整句都要看   ← 有问题的是这句
            你判断对了——这组你没问题 / 你选的是「×××」——这组要留意
            ✓ [正确句]
            [whyZh：真正讲清缺什么 / 错在哪]
            眼光很准，继续。/ 没看出来没关系——现在知道差在哪了。
```

这个读数**比现状好**：标签只说「往哪看」，讲解说「为什么」。**无需同时改 `whyZh`、无需改数据、无需加字段。**

---

## ⑤ 那 9 张「等长·语序反」的讲解核实

**任务：这 9 张的讲解是否已经讲清了「是谁站哪儿不对」？**

| # | 课 · 错句 → 正句 | `whyZh` | 讲清了？ |
|---|---|---|---|
| 1 | L2 `You are a teacher?` → `Are you a teacher?` | 「问『你是不是老师』要把 **Are 搬到句首**：Are you……？**词的站位不换**，就成了陈述句不是问句。」 | **✓ 明确**（句首 + 站位） |
| 2 | L6 `Is it three o'clock?` → `It is three o'clock.` | 「回答别人的提问用陈述句：It is three o'clock。**Is it 开头是问句**——这里要答，不是要问。」 | **✓ 明确**（开头） |
| 3 | L7 `Are they classmates?` → `They are classmates.` | 「告诉别人『他们是同学』用陈述句：They are。**Are they 开头是问句**——这里要说，不是要问。」 | **✓ 明确** |
| 4 | L26 `Is there a park near here?` → `There is a park near here.` | 「告诉别人『这里有公园』用陈述句 There is。**Is there 开头是问句**——这里要答，不是要问。」 | **✓ 明确** |
| 5 | L29 `Are you going to watch?` → `You are going to watch.` | 「告诉别人『你打算看』用陈述句 You are。**Are you 开头是问句**——这里要答，不是要问。」 | **✓ 明确** |
| 6 | L85 `Whose is this book?` → `Whose book is this?` | 「**whose 后面直接跟东西**：Whose book（谁的书）——再问 is this。」 | **✓ 明确**（虽未用「位置」二字，但「后面直接跟」就是位置） |
| 7 | L91 `Before I eat I wash my hands.` → 加逗号 | 「**两段之间要点个逗号**：Before I eat【,】 I wash my hands——逗号是两段的分界线。」 | **✓ 明确** |
| 8 | L92 `When it is sunny I run.` → 加逗号 | 「**两段之间点个逗号**：When it is sunny【,】 I run——跟 after/before 一个规矩。」 | **✓ 明确** |
| 9 | L140 `It is raining but I will go out.` → 加逗号 | 「少了个逗号：**but 站中间，前面点个逗号断一下**——It is raining【,】 but I will go out。」 | **✓ 明确** |

**实测统计**：9 张中 **8 张**含明确位置词（`句首`/`开头`/`后面`/`站中间`/`两段之间`），第 6 张（L85）用「后面直接跟东西」表达同一意思。**9/9 都讲清了「是谁站哪儿不对」，零张含糊。**

**⇒ 「标签不准确但讲解准确」成立，且这一点加强了我的建议，理由有三**：

1. **一行之内自相矛盾，比两行都含糊更糟。** 用户在同一张卡的相邻两行读到「缺了一块」+「要把 Are 搬到句首」——一个说少东西，一个说位置不对。零基础用户会先信标签（更短、更醒目、带红色虚线框），然后在讲解里发现标签是错的。**这是制造困惑，不是制造理解。**
2. **既然讲解已经讲清了类型，标签就不必再讲一遍类型。** `whyZh` 的定位是「为什么」，做得很好；标签的定位应是「往哪看」。**两者各归其位，才是改文案的完整动机。**
3. **9 张里 8 张的讲解使用了项目自建词汇**（`句首` / `词的站位` / `开头` / `两段之间`）——即零术语红线要求的项目词表。**讲得准确且合规**，无需改动。

**⇒ 不动 `whyZh`。** 本批的修复面仍然只有第 358 行一行。

---

## ⑥ 外部依据（轻量）

### 6.1 Nielsen Norman Group · 10 Usability Heuristics，#9

- URL：https://www.nngroup.com/articles/ten-usability-heuristics/
- 逐字引用：Heuristic #9 标题为 **"Help Users Recognize, Diagnose, and Recover from Errors."** 该页写道，错误信息 "**should be expressed in plain language (no error codes), precisely indicate the problem, and constructively suggest a solution.**"
- **对应**：「precisely indicate the problem」——「缺了一块」在 16 张上**没有精确指出问题**，反而指出了**相反的问题**（说缺、实为多/换/错位）。

### 6.2 Nielsen Norman Group · Error-Message Guidelines

- URL：https://www.nngroup.com/articles/error-message-guidelines/
- 逐字引用：
  - **"Generic messages such as `An error occurred` lack context."**
  - **"Provide descriptions of the exact problems to help users understand what happened."**
  - **"Concisely and precisely describe the issue."**
  - **"Use human-readable language." / "Avoid technical jargon and use language familiar to your users instead."**
  - **"Take a positive tone and don't blame the user."**
  - **"Don't use phrasing that blames users or implies they are doing something wrong, such as invalid, illegal, or incorrect."**
  - **"Merely stating the problem is also not enough; offer some potential remedies."**
- **对应**：两条都指向本批结论。① 「precisely describe」→ (a) 不成立。② 「don't use phrasing that ... implies they are doing something wrong」→ 我**没有**推荐含「错」字的文案（`词站错了地方`），并说明理由。③ 「offer some potential remedies」→ `whyZh` 已在做，标签不必重复。

### 6.3 W3C · WCAG 2.2 SC 3.3.1 Error Identification

- URL：https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html
- 逐字引用：**"the item that is in error is identified and the error is described to the user in text."** 以及 **"The error must be indicated in text."**
- **对应**：「the item that is in error is identified」= 已由第 359 行 `← 有问题的是这句` 满足；**「the error is described」= 由「缺了一块」提供但目前有错**。WCAG 意义上的修复就是让这句描述变准确——即本批建议。
- ⚠️ **边界说明**：WCAG 3.3.1 针对的是**表单输入错误**，本场景是**语言学习内容**，属类比而非直接适用。我按「类比依据」的强度引用它。

### 6.4 未取到的依据（诚实记录）

以下 URL 我尝试抓取但返回 404 或超时，**未获得内容，故不引用**（不作为依据）：

- `https://www.nngroup.com/articles/instructional-design/` → HTTP 404
- `https://www.nngroup.com/articles/feedback-ux/` → HTTP 404
- `https://www.teachingenglish.org.uk/professional-development/teachers/knowing-subject/c/corrective-feedback` → HTTP 404
- `https://en.wikipedia.org/wiki/Corrective_feedback` → 连接 443 超时

**⇒ 我本想找的「语言学习产品里 hint 措辞」的直接先例没有拿到。** 上表 3 条是**交互/无障碍**领域的通用原则，非语言学习产品专有。**如果审阅者认为需要「语言学习产品先例」，这是一个尚未闭合的缺口**（见 §8）。

---

## ⑦ 自我核查记录

### 7.1 本批实际做了什么 / 没做什么

| 项 | 状态 |
|---|---|
| 改代码 | **没有**（`src/` 零改动） |
| 改数据 | **没有** |
| 建临时探针 | 建了（`probe/*.test.tsx` + `vitest.probe.config.ts`），**已删除**（`ls` 确认不存在） |
| 临时脚本 | 在 `/tmp/` 下（`classify.cjs`、`align.cjs`、`contig.cjs`、`deep.cjs`、`expo.ts`、`gate.ts`、`zt.ts` 等），未写入项目 |
| 项目文件净变化 | `git status` 中 `probe/`、`vitest.probe.config.ts` 均**未出现**（确认干净） |

### 7.2 我实际跑过的验证（可复现）

1. **vite-node 载入真实 `grammarLessons`**（204 课）导出 52 张无标注卡 → 计数 `1228 / 674 / 502 / 52`、`65` 多词标注，与 `types.ts` 注释一致。
2. **四种分类脚本**（宽松残差桶 / LCS 对齐 / 连续块 / 字符级）交叉验证，**宽松口径复现 39/9/2/2**；严格口径得 36/11/5。**子序列口径与连续块口径在 52 张上集合完全相同**（set equality 已断言为 true）。
3. **jsdom 探针 real-mount `GrammarLessonPage`**，走完前测 → 讲解段，抓取 `.lesson-contrast-hole` 的 `textContent` 与 `innerHTML`，**实测验证 BEFORE=0 / AFTER=2（或 1）**，即标签只在揭示后出现。
4. **用项目自己的 `findZeroTermHits`** 检查推荐文案与 9 张讲解 → 全部干净。
5. **对照 bo8 / rv7 两张红线词表**检查推荐文案 → 未命中。
6. **全库 grep 确认无测试断言「缺了一块」** → 改动不会破测试。
7. **渲染位点 exposure 计算**：watch 29 / practice 12 / challenge 11（不成立分别为 5 / 7 / 4）。

### 7.3 我在本批修正的任务书表述（重要）

| 任务书原文 | 实测 | 处理 |
|---|---|---|
| 「真缺词 **39**」 | 宽松残差桶口径下为 39，**但桶内混着 3 张「既删又插」的改写卡**；严格「挖掉连续一块」口径为 **36** | **保留 39 并注明其口径**，同时给出 36（本报告 §2.3） |
| 「**13 张**不准」 | 按「词数不减少」判据为 **13**；按「非整词缺失」判据为 **16**（13 + 3 张更短但非单块缺失的改写卡） | **两个数字都给**，说明差异来源（§2.3） |
| 「渲染代码在 `GrammarLessonPage.tsx:358`」 | **行号准确**（`{!mark && <span className="lesson-contrast-hole">缺了一块</span>}` 就在第 358 行） | ✓ 确认 |
| 「题面是一句错句，旁边有个标签写『缺了一块』」 | **时点不准**：标签**不在题面**（答题前），而在**揭示后**（答题后） | **这是本批最关键的修正**，直接改变判定（§3.1）。批五十报告写的是 `:343`，现已移到 `:358`，行号已变。 |
| 「等长·替换 2 张」 | 实测 2 张（`This is the book I read it.`、`It cold today.`）✓ | ✓ 一致 |
| 「多词 2 张」 | 实测 2 张（`I am not happy today.`、`It is not cold today.`）✓ | ✓ 一致 |
| 「等长·语序反 9 张」 | 实测 9 张 ✓，**但其中 3 张只差标点**（L91/L92/L140） | 已在 §2.3 标出 |

### 7.4 我可能出错的地方（自查）

- **「36 张字面成立」是我的严格口径，不是任务书口径。** 若审阅者认为「多一个 `not`」也算「缺了一块」（因为可以解释为「该位置缺了个空」），那 (a) 的论据会强一些。**但我不接受这个解释**：`I am not happy today.` → `I am happy today.` 是**删**掉 not，屏幕上的错句比正句**长**，任何用户都会当场证伪。
- **「整句都要看」不是唯一解。** 它是我的判断而非实测结论。若设计者更想保留一点方向感，`这句要改一改` 也在 §4.2 列为同等合格。
- **我把「引导 vs 诊断」判定为「此处无引导职责」依赖「标签在揭示后」这一实测。** 我用了 4 张卡的探针验证（L13×2、L15×2、L31×2、L40×2、L87×1、L92×1 张），**逻辑上 `:354-360` 的分支结构是全局的**，对这 52 张都成立（同一组件、同一代码路径）。但我**没有**逐张跑 52 次探针。

### 7.5 ⚠️ 会话期间发生的外部改动（影响行号，不影响结论）

**本批会话进行中，`src/pages/GrammarLessonPage.tsx` 被另一个进程修改过**（文件 mtime `2026-09-23 01:06:30`，改动为深挖卡段落分层 + 判题去抖指纹，与「缺了一块」无关；`git diff --stat` 显示 +81 / −29）。后果：

- **所有行号 +1**：任务书写的 `:357` 是改动前的行号，**当前实际在第 358 行**。本报告已全部改用**当前行号**，并在 §7.3 表内标注了这一变化。
- **渲染位点的 slice 行号也变了**：`slice(0, 2)` 在 `:2688`（原 `:2724`）、`slice(2, 4)` 在 `:3194`（原 `:3230`）、`slice(4)` 在 `:3818`（原 `:3854`）。
- **结论完全不受影响**：改动前后 `{!mark && ...缺了一块...}` 始终在 `revealed` 分支内、始终紧随 `← 有问题的是这句`。我在改动后**重新导出并比对**了 52 张无标注卡的数据（`JSON.stringify` 逐字节相同）与全库计数（`1228 / 674 / 502 / 52`，不变）。
- **教训**：本报告的**行号是易失的**，引用时应以**代码片段**为准，行号只作定位提示。

---

## ⑧ 不确定项

| # | 不确定项 | 为什么不确定 | 建议怎么闭合 |
|---|---|---|---|
| 1 | **「整句都要看」的真实体感未做用户测试。** | 我做的是数据与代码分析，没有真实用户读数。这句是否比「缺了一块」少让人困惑，**逻辑上成立但未经验证**。 | 若有埋点，可对比改前后该卡的 `contrast` 判题通过率与下一题停留时长；或做 5 人小样本回读测试。 |
| 2 | **「语言学习产品 hint 措辞」的直接先例未取到。** | §6.4 列的 4 个 URL 全部 404/超时。我只拿到交互/无障碍领域的通用原则。 | 需要审阅者决定是否补做；若不补，第 ⑥ 节应标注为「通用原则类比，非领域先例」。 |
| 3 | **第 1、2 课的反例是否已被既有遥测覆盖。** | 我发现 `I am not happy today.`（L1）与 `You are a teacher?`（L2）在练段渲染假标签，**新用户最早两条**。但我没查这两个课的判题遥测是否已记录异常。 | 查 `grammar_contrast_judge` 一类事件在 L1/L2 上的通过率是否异常低。 |
| 4 | **「36 / 39 / 52」哪个数字该进 `types.ts` 注释。** | `src/types.ts:598` 目前写「`bothRight` 省略 + 无值：52 张（整句层面有问题的错卡）」——**这个措辞本身是准确的**（「整句层面有问题」比「缺了一块」中立）。 | 建议**不动**，或在实施第 358 行改动时顺手补一句「其中 36 张为整词缺失」。这属实施决策，非本批研究范围。 |
| 5 | **`bothRight` 卡（502 张）是否也有类似的文案问题。** | 本批只审了 52 张无标注错卡。502 张双正解卡走另一条分支（`:343-353`，文案「两句都对——这就是今天的反转。」），**本批未审**。 | 若审阅者认为需要，可作为下一批主题。 |
| 6 | **`wrongMark` 有值的 674 张是否会因本次改动产生视觉不一致。** | 改动只在 `{!mark && ...}` 分支，有值卡不受影响。但**同屏可能一张卡显示「整句都要看」、邻卡显示划线 + 「← 有问题的是这句」** ——两种卡**并列时的观感差异**我无法从代码判断。 | 需要看一眼真实界面（截图或本地跑）。**这是我唯一建议实施前先看一眼的点。** |

---

## 附：本批一句话可执行结论

**改。改一行字。** `src/pages/GrammarLessonPage.tsx:358`：

```diff
- {!mark && <span className="lesson-contrast-hole">缺了一块</span>}
+ {!mark && <span className="lesson-contrast-hole">整句都要看</span>}
```

数据不动、`whyZh` 不动、不加字段、不加算法、不破现有测试。
