# 用户研究 · 语法线「小美的一天」· `its`（所属）独立课（第四十一批）

**日期**：2026-09-21 ｜ **类型**：用户研究（语法线第四十一批）｜ **研究员**：瑞思
**上游**：`deliverables/product-strategy/user-research-such-a-2026-09-21.md`（第四十批）
- 逐字 `:13`：`| **1** | such a 能不能做？ | **能做——做一课（L194），但【不与 its 合课，its 另开 L195】。**`
- 逐字 `:246`：`### 1.3 its：**可做，且是本批最干净的一个缺口** ✅`
- 逐字 `:362`：`| **targetSentence** | **It was such a big fish.** | **The cat is in its box.** |`
- 逐字 `:1118`：`| **4** | **space 场景何时启用？** | 全库唯一 0 次使用的场景。本批两课题材都不适合 | **建议下批候选**…`

**本批任务**：判定 `its`（所属）能否独立成课，给出 targetSentence、3 条带标记错句、6 张对照卡、外部依据。

**冻结快照（本轮实测）**

| 文件 | 行数 | md5 | 内容 |
|---|---|---|---|
| `src/data/grammarLessons.ts` | **38,886** | `8861c640a93a09d26308f5dbec12a39f` | **194 课** |
| `src/data/huntCases.ts` | **10,560** | `db12406a10eaabc9b5141290dce9acc0` | **203 案** |
| `src/data/grammarSeasons.ts` | **74** | `03890956408124614a7b34c1ffc349a4` | **28 季** |

> **与任务书口径一致**（194 课／203 案／28 季）✅。课号 1..194 **连续、无缺号、无重号**（实测）；`lesson-195`／`lesson-196` 均**未占用**；下一可用案号 = **204**。

---

## 📌 结论摘要（先看这六条）

| # | 问题 | **裁定** |
|---|---|---|
**1** | `its` 能不能做？ | **能做——做一课（建议 L195）。** 三条带标记错句**全部凑得出来且分属三种独立机制**（`it` vs `its` 词形／`It's` vs `Its` 撇号／`its` 不能自己站），其中**第三条有剑桥逐字背书**、**第一条有 L8 库内 5 条同型先例**。**这是全库唯一一个「只被告知是错的、从未教过对的」词**（§1 硬证据）。 |
**2** | 做几课？ | **1 课（L195）。** 不拆、不合并。 |
**3** | ⚠️ **与 L87 冲突吗？** | **不冲突，是互补——但有一处必须做对，否则会真冲突。** L87 教的是 `It's`＝「它是」的短版（**合体方向**），本课教的是 `its`＝「它的」（**所属方向**）。**同一读音的两张脸**——项目已成熟的 `两张脸` 模具。**但 §3.2 指出一个真风险**：若本课把 `*Its cold today.` 再列一遍，就是**与 L87 逐字重复**（L87 已判过）。**本课的错句必须换成反方向**（`*It's box is small.`）。 |
**4** | targetSentence | **`The cat is in its box.`**（**6 词**，与 L194 的 6 词**跳变 0**；**0 个新词**）。**但 §2.3 给出一个并列候选** `Its name is White.`（4 词）——**取决于写课方要不要「猫」这条连续剧线**。 |
**5** | ⚠️ **`space` 场景能不能用？** | **不能——本轮实测给出硬否决理由**：`space`／`rocket`／`moon`／`star`／`planet`／`ship`／`world`／`fly` **全部 194 课零出现**。把本课放进太空，**「它的」这个名字本身会让用户必须先用一批没教过的词**——**违反 D 层「每个词都教过」红线**。**`space` 继续登记，不建议本课启用**（§2.4 给理由）。 |
**6** | ⚠️ **本批独立发现一个真缺陷（延续第四十批同一处）** | **L87 的 `deepDive` 与 `summary` 已经写下「`Its` 是『它的』」这条断言，但全库从未教过它。** 逐字（`:16570`）：`It's 是「它是」的短版，Its 是「它的」——读起来一样，写法差一小撇，意思差一条街。`**⇒ 用户在 L87 被告知「存在一个词叫 its、意思是『它的』」，然后 107 课内再也没见过它。** 这不是「缺口」，是**悬空断言**——本课正是把它落地。 |

**下一可用课号 = L195**；**下一可用案号 = 204**（两者实测均未占用）。

---

## §0 本轮实读口径声明

### 0.1 关键口径：`its` 必须**大小写不敏感**检索（任务书提示的坑，本轮实测踩中）

任务书要求「必须用 node 词边界正则（不要用 grep），且必须用 `(?<![A-Za-z'-])word(?![A-Za-z'-])` 排除连字符标识符假命中」。

**⚠️ 本轮实测发现：只写小写 `its` 会漏掉 100% 的库内命中。** 因为 `its` 在英语里**几乎总在句首或紧跟在名词后**，而库内 15 处**全部是句首大写 `Its`**：

```
小写 its 命中 = 0 处
大写 Its 命中 = 15 处
```

**⇒ 口径修正：`/(?<![A-Za-z'-])[Ii]ts(?![A-Za-z'-])/g`**（大小写敏感地排除 `It's`——因为 `'` 已被 lookahead 排除，所以这个正则**天然不会**匹配 `It's`；本轮同时验证了 `[Ii]t['’]s` 在库内 0 处，说明库内不用弯撇号写法）。

### 0.2 复核任务书的三个数字

| 任务书断言 | 本轮实测 | 裁定 |
|---|---|---|
| 库内 11 处 `its` | **15 处**（结构化字段），另有 4 处散文/选项 | ⚠️ **数字偏小**（第四十批也曾实测为 15，两次独立测量一致） |
| `its` 作「所属」的正面用例 = 0 | **0** ✅ | **成立**（§1.1 硬证据） |
| 11 处「全部是 L87 的 `It's` 缩写坑的错项或干扰项」 | **12 处在 L87，另 3 处分属 L88／L94／L96** | ⚠️ **方向对、范围偏窄**——**这三处说明这个坑会「传染」到后面 9 课**（§1.3） |

---

## §1 可做性判定：**能做** ✅

### 1.1 硬证据：`its` 是全库唯一「只被告知是错的」词

本轮**逐字段遍历 194 课的全部字符串字段**（`/tmp/audit.ts`，走 `allStrings()` 递归）：

```
=== DEFINITIVE 'its' AUDIT (every string field, every lesson) ===
  total lines/fields containing 'its': 15
  L87  contrast[].wrong          "Its cold today."
  L87  contrast[].wrongMark      "Its"
  L87  deepDive.paragraphs[]     "那一小撇很重要：It's 是「它是」的短版，Its 是「它的」——…"
  L87  summary.points[]          "Its ❌ —— 少一小撇就成了「它的」"
  L87  guided[].options[]        "Its"
  L87  guided[].tokens[]         "Its"
  L87  guided[].wrongToken       "Its"
  L87  guided[].answer           "Its"
  L87  guided[].options[]        "Its"
  L87  practice[].distractors[]  "Its"   ×3
  L88  practice[].distractors[]  "Its"
  L94  practice[].distractors[]  "Its"
  L96  practice[].distractors[]  "Its"

  POSITIVE uses (learner sees a correct sentence): 0
  NEGATIVE uses (learner sees it flagged wrong / as a decoy): 11
  OTHER (prose / spot-answer / tokens): 4
```

**关于那 4 处 `OTHER` 的逐条裁定**（这是最容易误判成「正面用例」的 4 处）：

| 位置 | 逐字内容 | **裁定** |
|---|---|---|
| `L87 deepDive.paragraphs[]` | `It's 是「它是」的短版，Its 是「它的」——读起来一样，写法差一小撇，意思差一条街。` | **不是正面用例**——这是**散文里的元语言说明**（说的是「有这么个词」），不是**用户要学/要说的英文句子**。而且它在 `deepDive` 里，是**折叠的进阶卡**，不是必读。 |
| `L87 summary.points[]` | `Its ❌ —— 少一小撇就成了「它的」` | **纯否定**（自带 ❌）。 |
| `L87 guided[].tokens[]` | `["Its", "cold", "today."]` | **是错句的词块**（同一条的 `wrongToken: "Its"`）。 |
| `L87 guided[].answer` | `"Its"` | ⚠️ **最容易误判的一处**——本轮实测该题的 `kind` 是 `"spot"`：<br>`kind: "spot", promptZh: "有人是这样说的，你帮他看看：哪个词块不太对？", tokens: ["Its","cold","today."], wrongToken: "Its", answer: "Its", correctionZh: "尾巴上要有一小撇：It's cold today。"`<br>**⇒ spot 题的 `answer` 是「用户要圈出来的那个错词」，不是正确答案！** |

**⇒ 结论：`its` 的正面用例 = 0，确凿成立。** 且经核查，**`its` 是本族唯一如此的成员**——

```
=== POSITIVE-USE SCAN for the whole my/your/his/her/its family (real objects) ===
  my     positive-use lessons:  68
  your   positive-use lessons:  42
  his    positive-use lessons:   3
  her    positive-use lessons:  13
  its    positive-use lessons:   0   <<< ZERO
  our    positive-use lessons:   4
  their  positive-use lessons:   1
  mine   positive-use lessons:  10
  yours  positive-use lessons:   5
  hers   positive-use lessons:   2
  ours   positive-use lessons:   0   <<< ZERO
  theirs positive-use lessons:   1
  whose  positive-use lessons:   7
```

**⚠️ 一条必须写清的诚实更正**：`ours` 也是 0。**但 `ours` 与 `its` 性质不同**——
- `ours` 是 **L33 已建立模具里的一个空格**：L33 逐字 `deepDive`：`一家人都这样：your/yours、her/hers、our/ours——带 s 的那个独立用，不带的贴名词。`**⇒ 用户见过 `ours`（在 `our/ours` 的对照里），只是没单独练过。** 且 `ours` 与 `our` 同形，**不会产生错误**（不会有人把 `ours` 写成 `our's`——L33 已判过 `her's` 型）。
- `its` **既没有正面用例，也没有模具位置**——它只在**错句**里出现过。**且它是唯一一个「读音相同、拼写差一个撇号、意思完全不同」的成员**（`its` vs `It's`）。`my/your/his/her/our/their` 都没有这个对手。

**⇒ 任务书的判断成立：`its` 是全库唯一一个「只被告知是错的、从未教过对的」词。** ✅

### 1.2 三条带标记错句（对照卡的基础）——**全部凑得出来** ✅

任务书给了 4 个待核方向。本轮**逐个独立核实**（不照抄）——**其中 3 个成立、1 个否决**：

#### 错句 ① `*The cat is in it box.`（用 `it` 替 `its`）✅ **成立，机制独立**

| 项 | 内容 |
|---|---|
| **错句** | `The cat is in it box.` |
| **标记** | `wrongMark: "it"` |
| **正确** | `The cat is in its box.` |
| **中文母语者为什么会这么说** | **中文的「它的」是一个词（「它」＋「的」），英语是两个词。** 学习者脑子里「它」＝`it`（第 2 课就学了），于是**把 `it` 直接贴到东西前面**。中文没有「所属标签要变形」这一步——「它的盒子」里「它」和「我的盒子」里「我」长得一样。**⇒ 这是「中文零标记的所属」负迁移。** |
| **库内先例（同型坑，L8 已判过）** | L8 逐字 `wrong: "This is I book." / wrongMark: "I"`；`wrong: "He name is Tom." / wrongMark: "He"`；`wrong: "I like she cat." / wrongMark: "she"`——**同一机制（主角词直接贴到东西前）已判过 3 次**，本次是把 `it` 这个成员补上。 |
| **⚠️ 为什么不是 `*The cat is in it's box.`** | 因为 `It's`＝`it is`，**`in it's box` 在英语里是另一个错**（且与错句 ② 重复）。**本课应覆盖「少了 s」而不是「多了撇号」**——多了撇号是错句 ② 的活。 |

#### 错句 ② `*It's box is small.`（撇号乱放／`Its` 写成 `It's`）✅ **成立，机制独立**

| 项 | 内容 |
|---|---|
| **错句** | `It's box is small.` |
| **标记** | `wrongMark: "It's"` |
| **正确** | `Its box is small.` |
| **中文母语者为什么会这么说** | **过度泛化规则。** 学习者刚在 L87 学到一条强规则：「东西的所属要在尾巴上加一小撇」（`Grandma's`／`my brother's`——L111 刚强化过）。**于是他把同一个动作套到 `it` 上，得到 `It's`。** ⇒ **这是「L87＋L111 两条规则的错误交叉」**——L87 说「`It's` 带撇号才是对的」、L111 说「所属要加撇号 `s`」，**两条都对，叠在 `it` 上就错**。 |
| **库内先例（同类「过度泛化撇号」）** | L85 逐字 `wrong: "Who's book is this?" / wrongMark: "Who's"`——**完全同型**（`who's` vs `whose`，读音像、写法不同、一个带撇号一个不带）。L85 的 `whyZh` 逐字：`谁是「谁」，whose 是「谁的」——两家人读起来像、写法不同：whose 一个词，who's 是 who is 的缩写。`**⇒ 本课可用同一套话术模具。** |
| **⚠️ 与 L87 的关系** | **这是反方向的同一对。** L87 判的是「该有撇号却没有」（`Its cold today.` ❌ → `It's cold today.` ✅）；本课判的是「不该有撇号却加了」（`It's box is small.` ❌ → `Its box is small.` ✅）。**两条合起来，`It's`／`Its` 这一对才算教全。** |

#### 错句 ③ `*The box is its.`（`its` 当名词用、自己站）✅ **成立，有剑桥逐字背书**

| 项 | 内容 |
|---|---|
| **错句** | `The box is its.` |
| **标记** | `wrongMark: "its"` |
| **正确** | `The box is its own.`（**⚠️ 见下「落地限制」**）或改写为 `The box is **its** box.` |
| **中文母语者为什么会这么说** | **中文的「是它的」可以独立成句。** 「这个盒子是它的」是一句完整、自然的中文——「它的」在这里**自己站**。**英语的 `its` 做不到**：它必须贴着一个东西。⇒ **这是「中文所属词能独立成句」负迁移。** |
| **⚠️ 外部权威逐字背书** | 剑桥 `It's or its?` 逐字：**`We don't use its as a possessive pronoun.`** ＋ **`Possessive determiner its is not used alone. We repeat the noun which is being referred to.`**（§4.1 有完整 URL 与上下文） |
| **⚠️ 库内先例（同型坑）** | L112 逐字 `wrong: "This book is my." / wrongMark: "my"`，`whyZh`：`短版不能站句尾：my 是贴在东西前面的小标签（my book）；句尾收住要用长版 【mine】。`——**同型（贴东西的小标签不能自己站）已判过**。L189 逐字 `wrong: "These are they books." / wrongMark: "they"` 也是同一族。 |
| **🔴 落地限制（必须写明，否则写课方会踩坑）** | **`own` 在全库 194 课零出现**（本轮实测：`*** 'own' appears in NO lesson ***`）。⇒ 若把「正确」写成 `The box is its own.`，**`own` 会立刻成为 D 层缺陷**（练习答案含未教词 → 测试红）。**⇒ 建议把这条卡的「正确」写成 `The box is its box.`**（更笨但 100% 安全），或在 `deepDive` 里提一句 `its own`（`deepDive` 不参与 D 层）。 |

#### ❌ 否决：`*Its name is Mimi.`（大写混淆）——**不成立**

| 项 | 裁定 |
|---|---|
| 任务书猜测的机制 | 「大写混淆」 |
| **本轮实测** | **英文里 `Its` 句首大写是正确写法**（`Its name is White.` 里 `Its` 大写完全对）。**「大写混淆」在英语里不是一个错**——`Its`（句首）与 `its`（句中）是同一个词的两种书写位置。**⇒ 没有错句可造。** |
| **⚠️ 真正的坑在别处** | **`Mimi` 不是库内词**（实测 `mimi` 在 194 课零出现）。若用它，会同时踩 D 层红线。**⇒ 名字候选里只有 `White`（L17）／`Lily`（L36）／`Little`（L70）可用**（§2.3 实测）。 |

**⇒ 三条错句机制独立**（① 中文所属无标记 → `it`；② 撇号过度泛化 → `It's`；③ 中文所属可独立站 → `its` 单独用），**可做** ✅

### 1.3 附带发现：`Its` 干扰项已「传染」到后面 3 课

本轮实测的分布（`/tmp/verify3.cjs`）：

```
=== A. Every standalone Its/its in grammarLessons.ts, with field + kind ===
  L87   line 16522  field=wrong          WRONG-SENTENCE
  L87   line 16523  field=wrongMark      wrongMark
  L87   line 16570  field=?              PROSE
  L87   line 16579  field=?              PROSE
  L87   line 16588  field=options        OPTION(含干扰)
  L87   line 16610  field=tokens         wrongTokens
  L87   line 16611  field=wrongToken     wrongToken
  L87   line 16612  field=answer         answer==Its(错)
  L87   line 16630  field=options        OPTION(含干扰)
  L87   line 16639  field=distractors    DISTRACTOR
  L87   line 16652  field=distractors    DISTRACTOR
  L87   line 16665  field=distractors    DISTRACTOR
  L88   line 16848  field=distractors    DISTRACTOR
  L94   line 18004  field=distractors    DISTRACTOR
  L96   line 18410  field=distractors    DISTRACTOR

  by lesson: {"87":9,"88":1,"94":1,"96":1}
```

**L88／L94／L96 三处逐字**（均为 `distractors: ["Its"]`，对应的正确答案都是 `It's` 句）：
- L88 `:16848`：`promptZh: "看窗外，你想说：今天天气很好。"` / `tokens: ["It's","nice","today."]` / **`distractors: ["Its"]`**
- L94 `:18004`：`promptZh: "说今天的天气，你想说：今天天气很好。"` / `tokens: ["It's","nice","today."]` / **`distractors: ["Its"]`**
- L96 `:18410`：`promptZh: "复习第 87 课：今天真冷。"` / `tokens: ["It's", "cold", "today."]` / **`distractors: ["Its"]`**

**⇒ 意义**：这个干扰项被**当成纯拼写诱饵**用了 9 次（L87 三次 + L88/L94/L96 各一次 + L87 的 options 两次）。**用户被反复训练「`Its` 是错的」，却从没见过「`Its` 对的时候长什么样」。** ⇒ **本课不是在补一个新词，是在把已有的 9 次否定收口。**

### 1.4 一个「闸门看不见」的技术发现（解释为什么这个缺口能存活 107 课）

本轮**逐字复刻**了 `grammarLessons.test.ts:407-448` 的 `buildPools()`（同一个函数、同一份字段清单），实测：

```
=== 1. WHERE DOES 'its' ENTER THE VOCAB POOL? ===
  'its' first pooled at: L87
  'it\'s' first pooled at: L24
```

**根因**（`buildPools` 逐字第 418 行）：

```ts
for (const contrast of lesson.contrast ?? []) {
  addWord(contrast.correct);
  addWord(contrast.wrong);   // ← ⚠️ 错句也进词表池！
}
```

**⇒ L87 的错句 `wrong: "Its cold today."` 把 `its` 送进了「已教过的词」词表池。** 于是：
- **D 层守门**（`练习答案的每个词都要在本课（含此前累计）教过`）**永远不会报 `its` 缺失**——它认为 L87 教过。
- 但 L87 教的**是一句错话**。
- **⇒ 这个缺口对自动守门是隐形的，只能靠人工审计发现。** 这也解释了为什么它能存活 107 课（L87→L194）。

> **⚠️ 这不是本批要修的东西**（改 `buildPools` 会影响全库 194 课的基线）。**登记为本报告的独立发现**（§7 不确定项 1）：**词表池把 `contrast.wrong` 计入「已教过的词」，是一个系统性盲区**——任何只在错句里出现过的词，都会伪装成「教过了」。**建议后续单独立项审计「词表池里的词，有多少只出现在错句/干扰项里」。**

---

## §2 targetSentence

### 2.1 推荐：**`The cat is in its box.`**（6 词）

| 项 | 内容 |
|---|---|
| **英文原句** | `The cat is in its box.` |
| **中文意图** | 猫在它自己的盒子里。 |
| **词数** | **6 词**（单句） |
| **与 L194 的衔接** | L194 = **6 词**（实测 `L194 longest clause: 6`）。**本课 6 词 → 跳变 0** ✅（守门上限是「不得跳超 5 词」，实际要求 ≤11 词）。 |
| **新词数** | **0 个**（逐词实测：`the`@L4、`cat`@L3、`is`@L1、`in`@L18、`its`@L87〔但那是错句进的池，见 §1.4〕、`box`@L18）✅ |
| **C 层新句风险** | 与全库 3,997 条句子的**最高 Jaccard = 0.57**（vs L80 `The cat is behind the box.`）——**远低于 0.80 红线** ✅ |
| **为什么是这句** | ① **`its box` 让「必须贴东西」变成不可回避的**—— `its` 后面紧跟一个东西，用户看一眼就知道它不能自己站（正对错句 ③）；② **`cat` 是小美的连续剧角色**（L80 逐字 `sceneSetupZh: "小美到处找猫，最后发现猫蹲在门后头。"`；L3/L26/L79/L80/L86 都有猫），**L80 的猫就在门后头**——本课「猫在它自己的盒子里」是**同一条线的自然下一格**；③ **`box` 与 L80 的 `box` 呼应**（L80 逐字 `The cat is behind the door.`，其练习里有 `There is nothing in the box.`）。 |
| **场景（scene）** | **`mansion`**（L80 找猫用的就是 `mansion`；`mansion` 全库 62 课、是「家里」的默认场景）。次选 `campus`（57 课）。**不用 `space`——见 §2.4。** |

### 2.2 为什么不用别的候选（本轮实测逐条）

```
=== 2. CANDIDATE TARGET SENTENCES — EXACT D-LAYER CHECK ===
  OK   Its name is White.        4w  its(L87) name(L8) is(L1) white(L17)
  OK   Its name is Lily.         4w  its(L87) name(L8) is(L1) lily(L36)
  MISS Its name is Mimi.         4w  … mimi(**UNTAUGHT**)
  OK   The cat is in its box.    6w  the(L4) cat(L3) is(L1) in(L18) its(L87) box(L18)
  OK   Its box is small.         4w  its(L87) box(L18) is(L1) small(L3)
  OK   Its door is open.         4w  its(L87) door(L23) is(L1) open(L23)
  OK   Its home is here.         4w  its(L87) home(L9) is(L1) here(L1)
  OK   The cat likes its box.    5w  the(L4) cat(L3) likes(L5) its(L87) box(L18)
  OK   Its food is in the bowl.  6w  its(L87) food(L171) is(L1) in(L18) the(L4) bowl(L193)
  OK   The dog knows its name.   5w  the(L4) dog(L5) knows(L160) its(L87) name(L8)
  OK   Its box is new.           4w  its(L87) box(L18) is(L1) new(L1)
  MISS The box is its own.       5w  … own(**UNTAUGHT**)
  OK   Its name is Little White. 5w  its(L87) name(L8) is(L1) little(L70) white(L17)
```

**逐条裁定**：

| 候选 | 裁定 | 理由 |
|---|---|---|
| `Its name is White.` | **并列候选（见 §2.3）** | 4 词、0 新词、且**句首大写 `Its`——用户必须学会「大写也是它的」**（这在英语里是真实的书写要求，但**不能当错句教**，见 §1.2 否决项）。 |
| `Its box is small.` | ⚠️ **建议用作「双正解卡」而非目标句** | 4 词、0 新词。**但 `box` 没有「属于谁」的语境**——用户看不出为什么是 `its` 而不是 `the`。**放在对照卡里当「也对的一句」正好**（§4 卡片 C）。 |
| `Its door is open.` | ❌ 否决 | `door` 的「主人」不明（哪扇门？属于谁的？）——**`its` 的所属感被抽掉了**，用户学不到东西。 |
| `Its home is here.` | ❌ 否决 | `home` 与 `its` 的搭配牵强（英语更常说 `This is its home.`），且**「它自己的家」需要语境支撑**，4 词装不下。 |
| `The cat likes its box.` | ⚠️ 次选 | 5 词、0 新词，机制没问题。**但 `likes`@L5 离得很远（189 课），且「喜欢自己的盒子」不如「在自己的盒子里」自然。** |
| `Its food is in the bowl.` | ❌ 否决（本课） | 6 词、0 新词，**但 `food`@L171、`bowl`@L193 都是刚教的词，会抢走本课焦点**（本课的新点应该是 `its`，不是复现 `bowl`）。 |
| `The dog knows its name.` | ❌ 否决 | 5 词、0 新词，**但 `knows`@L160 离得远，且「狗知道自己的名字」在中文里不自然**（中文会说「狗认得它的名字」）。 |
| `The box is its own.` | 🔴 **硬否决** | **`own` 在 194 课零出现**——D 层会红（§1.2 错句 ③ 的落地限制）。 |
| `Its name is Mimi.` | 🔴 **硬否决** | **`mimi` 在 194 课零出现**——D 层会红。 |

### 2.3 并列候选：`Its name is White.`（4 词）——**如果写课方要「起名字」的剧情**

| 项 | 内容 |
|---|---|
| 词数 | **4 词**（L194 的 6 词 → **跳变 −2**，下坡，安全） |
| 新词 | **0 个**（`white`@L17） |
| Jaccard | **0.33**（vs L8 `His name is Tom.`）——远低于 0.80 ✅ |
| 优点 | ① **`Its name is …` 与 L8 的 `His name is Tom.`（逐字 `:1501`）逐字同框**——**直接复用 L8 的「小标签贴东西前面」模具**，只需把 `His` 换成 `Its`；② **句首大写 `Its` 是真实的书写要求**，用户会在练习里自然见到两种大小写；③ 4 词更短，节奏更轻。 |
| 缺点 | ⚠️ **`name` 是「名字」，不是「所属物」**——这条句子教的是「它的**名字**」，而 `its` 的核心是「它**的**东西」。**用户可能学会「`Its` 后面跟 name」，而不是「`its`＝它的」。** |
| **⇒ 裁定** | **推荐 `The cat is in its box.`（所属更纯）；若写课方判断「给猫起名」的剧情更好写，`Its name is White.` 是合格替代**，但**必须配一条 `its box` 型的卡**（如双正解卡 C）来补「所属物」这一面。 |

### 2.4 🔴 `space` 场景：**本轮给出硬否决理由**（不是「不适合」，是「不能用」）

任务书建议「可考虑 space（全库唯一未用场景），若不适合请说明」。**本轮实测发现「不适合」还不够——是「会直接踩红线」**：

```
=== A. SPACE-scene vocabulary availability ===
  space      *** ABSENT from all 194 lessons ***
  rocket     *** ABSENT from all 194 lessons ***
  moon       *** ABSENT from all 194 lessons ***
  star       *** ABSENT from all 194 lessons ***
  planet     *** ABSENT from all 194 lessons ***
  spaceship  *** ABSENT from all 194 lessons ***
  astronaut  *** ABSENT from all 194 lessons ***
  galaxy     *** ABSENT from all 194 lessons ***
  orbit      *** ABSENT from all 194 lessons ***
  sky        present (45 occurrences)
  light      present (42 occurrences)
  bright     *** ABSENT from all 194 lessons ***
  shine      *** ABSENT from all 194 lessons ***
  glow       *** ABSENT from all 194 lessons ***
  fly        *** ABSENT from all 194 lessons ***
  travel     present (61 occurrences)
  ship       *** ABSENT from all 194 lessons ***
  world      *** ABSENT from all 194 lessons ***
  earth      *** ABSENT from all 194 lessons ***
  sun        present (7 occurrences)
```

**⇒ 逻辑链**：本课的 targetSentence 必须是 **`its` 的所属句**。要造出「太空里某个东西属于另一个东西」，**必然要用到一个太空名词**（`rocket`／`moon`／`star`／`ship`／`planet`——**全部零出现**）。**唯一的替代是拿库内已有的词硬凑**（如 `The cat is in its box.` 放在太空——**但猫在太空里就是 `sparkle`（其他奇想）的题材，不是 `space`（星际太空）的写实因果**，这正是第四十批 §3.4 逐字给出的同一条理由）。

**⇒ 裁定：`space` 不为本课启用。** 建议留给**未来的「想象／愿望」类课**（第四十批 `:1118` 逐字建议：`I want to go to space.`——`want`@L4、`go`@L9 全在池里，**`space` 会是唯一新词**）。**本课登记为「第 2 次因词汇红线否决 `space`」**（第一次是第四十批）。

> **说明**：`space` 的插画与渲染**完全就绪**（`AdventureScene.tsx:458 space: SpaceScene`，`:108` 有 `ascn-space-sky` 渐变）——**卡的不是素材，是词汇。** ✅ 实测确认。

---

## §3 与 L87 的分工与冲突风险（**正面回答**）

### 3.1 L87 到底教了什么（逐字复核）

L87 逐字字段（本轮实测）：

| 字段 | 逐字内容 |
|---|---|
| `id` | `lesson-87-its-cold` |
| `title` | `今天真冷` |
| `grammarLabel` | `两个词挤一挤 · It's` |
| `targetSentence` | `It's cold today.` |
| `oneLineRule` | `两个词可以挤一挤：It is 挤成 It's——短的这版口语里天天用，意思一模一样。` |
| `summary.rule` | `两个词挤一挤：It is → It's（短的这版口语天天用）——尾巴那一小撇不能丢。` |
| `summary.points[2]` | `Its ❌ —— 少一小撇就成了「它的」` |
| `deepDive.paragraphs[2]` | `那一小撇很重要：It's 是「它是」的短版，Its 是「它的」——读起来一样，写法差一小撇，意思差一条街。写的时候记得把尾巴带上。` |
| `contrast[1]` | `{"wrong":"Its cold today.","wrongMark":"Its","correct":"It's cold today.","whyZh":"短版的尾巴上有一小撇：It's——那一撇是把 is 挤掉后留下的记号，丢了它就成了「它的」。"}` |
| `guided[3]`（spot） | `{"kind":"spot","promptZh":"有人是这样说的，你帮他看看：哪个词块不太对？","tokens":["Its","cold","today."],"wrongToken":"Its","answer":"Its","correctionZh":"尾巴上要有一小撇：It's cold today。","explain":"少一小撇就成了「它的」。"}` |

**⇒ L87 的语法点是「合体」**（`It is` → `It's`），**`Its` 只是它的错误反面**（少了一小撇）。**L87 从头到尾没有解释「它的」该怎么用、放在哪、能不能自己站。**

### 3.2 ⚠️ 冲突风险（正面回答）：**风险真实存在，但有一个明确的规避动作**

| 风险 | 严重度 | **规避动作** |
|---|---|---|
| **R1：错句逐字重复** | 🔴 **高** | L87 已判 `*Its cold today.`（`contrast[1]` ＋ `guided[3]` spot ＋ `summary.points[2]` ＋ `deepDive`，**同一句出现 4 次**）。**若本课再把 `*Its cold today.` 列一遍 → 用户看到「同一句错话被判两次」**，既啰嗦又会让用户以为这是本课的新内容。<br>**⇒ 动作：本课的 3 条错句完全不含 `*Its cold today.`。** 错句 ② `*It's box is small.` 是**反方向**（多了撇号），错句 ①③ 是另外两个机制。**三条与 L87 的 `*Its cold today.` 零重叠** ✅（本轮实测三条在 194 课**均未被使用过**：`free (not used)`）。 |
| **R2：`whyZh` 话术重复** | 🟡 **中** | L87 已说 `那一撇是把 is 挤掉后留下的记号，丢了它就成了「它的」`。本课若也说「丢了撇号就成了它的」，是**同一句话说两遍**。<br>**⇒ 动作：本课的话术焦点反过来**——L87 说「**别丢撇号**」，本课说「**别乱加撇号**」＋「**它的必须贴东西**」。**两句合起来才是完整的一对。** |
| **R3：用户困惑「同一句话怎么两次都错」** | 🟡 **中** | 若两课都只说「撇号」而不说清**方向**，用户会觉得矛盾。<br>**⇒ 动作：本课的 `oneLineRule` 必须显式说出「两张脸」的分工**（§4.3 给逐字草案）——**`It's`＝「它是」的短版（第 87 课）；`its`＝「它的」。读起来一样，用起来差一条街。** |
| **R4：与 L85（`who's` vs `whose`）撞车** | 🟢 **低** | L85 已用「两家人」框架讲过一对同音异形（`whose`／`who's`）。本课用同一套模具——**这不是撞车，是复用**（项目惯例：L85 的 `whyZh` 逐字 `两家人读起来像、写法不同`）。**⇒ 动作：明确引用第 85 课**（把新知识挂在旧框架上）。 |

### 3.3 ⇒ 两课分工表（**这是本报告对「冲突」问题的正式答案**）

| 维度 | **L87**（已上线） | **L195**（本课） |
|---|---|---|
| 语法点 | **合体**：`It is` → `It's`（两个词挤一挤） | **所属**：`its`＝「它的」（小标签贴东西前面） |
| 方向 | 「**别丢**撇号」（该有却没写） | 「**别乱加**撇号」（不该有却写了） |
| 错句 | `*Its cold today.` | `*It's box is small.` |
| 正确句 | `It's cold today.` | `Its box is small.` |
| 用户学到的 | `It's` ＝ 它是 | `its` ＝ 它的 |
| 一句话 | **它是** | **它的** |
| 共同框架 | **同一个读音 /ɪts/，两张脸**（项目成熟的 `两张脸` 模具） | ← 同 |
| 引用关系 | — | 本课**开头即引用第 87 课**（`It's` 已学过） |
| **互补性** | **缺了本课，`It's`／`Its` 这一对只有一半**——用户只知道「`Its` 是错的」，不知道「`Its` 什么时候是对的」 | ← **本课把另一半补上** |

**⇒ 正式裁定：不冲突，是互补。** 第四十批 `:298` 逐字已给同向判断：`**⇒ 结论：不构成撞车，是互补。但 L195 的 contrast 不应把 Its cold today. 再列一遍**（L87 已判过），应列 It's box is small.（反方向）＋ I1 ＋ I3。`——**本轮独立复核后同意，并补上「R1–R4 四条风险 + 对应规避动作」。**

### 3.4 一个值得写进 `deepDive` 的收口（本轮新增建议）

**两课合起来构成一条完整的「同音异形」教学线**，建议本课 `deepDive.title` 用 **`一个读音，两张脸`**（与 L194 的 `so 和 such：一个看「有多」，一个看「什么样的一个」`、L193 的 `so 的三张脸` 同一模具）。逐字草案：

```
今天这个 its 和第 87 课的 It's 读起来一模一样（都是 /ɪts/），写起来只差一小撇，
但两张脸管的事完全不同：
  It's ＝ 它是（it is 挤一挤的短版——第 87 课）
  its  ＝ 它的（贴在东西前面——今天学的）
分辨方法只有一个：看这句话是在说「它是…」，还是在说「它的…」。
说「它是」→ 带撇号；说「它的」→ 不带撇号、后面还要跟一个东西。

第 85 课你见过同一类事：whose（谁的）和 who's（谁是）也是一个读音、两家人。
英语里这种「听起来一样、写法差一点」的词不多，但每一个都得单独记。
```

---

## §4 对照卡 6 张的设计

**结构要求**：3 张带标记错句（`wrongMark` ≠ null）＋ 3 张双正解（`bothRight: true`）。

### 4.1 三张带标记错句

| # | `wrong` | `wrongMark` | `correct` | 机制 |
|---|---|---|---|---|
| **W1** | `The cat is in it box.` | `it` | `The cat is in its box.` | 中文零标记所属 → `it` 顶替 `its` |
| **W2** | `It's box is small.` | `It's` | `Its box is small.` | 撇号过度泛化（反 L87 方向） |
| **W3** | `The box is its.` | `its` | `The box is its box.` | 中文所属可独立站 → `its` 单独用（剑桥背书） |

**逐条 `whyZh` 草案（零术语，逐条已过红线扫描——§5.A 实测全 clean）**：

```
W1 whyZh: 「它的」是一个词 its——it 只能当主角，贴在东西前面的那个要带 s：its box。
          第 8 课那批小标签（my／her）也是这么贴的。

W2 whyZh: It's 是「它是」的短版（第 87 课）；「它的」是 its。
          这一句要说的是「它的盒子」，所以不能用 It's。

W3 whyZh: its 不能自己站——它后面必须跟着一个东西（its box）。
          要自己站，得换第 112 课那种带 s 的（mine／theirs）。
```

> **⚠️ W2 与 L87 的分工必须在 `whyZh` 里显式点出「第 87 课」**——这是 §3.2 R1/R3 的规避动作。

### 4.2 三张双正解 —— **该对照什么？选择理由**

任务书问了三件事，**本轮逐条回答**：

**问题 1：是否该对照 L87 的 `It's cold today.`（撇号有 vs 无）？**
❌ **不推荐作为双正解卡。**
- **理由**：双正解卡的定义是「**两句都对，只是说法不同**」。而 `It's cold today.` 与 `Its box is small.` **不是同一个意思的两种说法**——它们是**两个不同的句子**，放在同一张双正解卡里**没有任何对照价值**（用户看不出「为什么两句都对」）。
- **正确做法**：与 L87 的对照**应该放在「带标记错句」里**（W2 就是这个对照），而**不是**放在双正解里。第四十批 `:298` 逐字同意这一点：`L195 的 contrast 不应把 Its cold today. 再列一遍（L87 已判过），应列 It's box is small.（反方向）`。**⇒ 本轮把这条判断精确化：L87 的关系是「错句反方向」而不是「双正解」。**

**问题 2：是否该对照 L8 的 `my/your/his/her`（同一族的小标签）？**
✅ **推荐——这是最重要的一张。**
- **理由**：`its` 的**正确用法**就是「跟 `my`／`her` 一样贴在东西前面」。**用户已经会 `my`／`her`（L8 教过）**，**把 `its` 挂到这条已知框架上，是本课最省力的教法**（L189 就用了同一招：`grammarLabel` 逐字 `他们的 · their 贴前面／theirs 自己站`，`oneLineRule` 逐字 `说「他们的」用 their，它跟 my、her 一样贴在东西前面`）。
- **具体选哪句**：**L18 的 `My hat is in the box.`**（逐字实测 PRESENT，出现在 6 个字段里）——**⚠️ 这是本轮的关键发现：它与本课目标句 `The cat is in its box.` 是逐字同框**（`X is in the box`），**Jaccard = 0.50**（低于 0.80 红线 ✅）。**⇒ 同一句话框架，只把 `My hat` 换成 `The cat`／`my` 换成 `its`**——用户一眼看出「这就是第 8 课那批小标签，只不过这次贴的是『它』的东西」。**这是 6 张卡里教学价值最高的一张。**

**问题 3：是否该对照别的？**
✅ **推荐第三个方向：`its` 不能自己站 ↔ `mine`／`theirs` 能自己站（第 112／189 课）**
- **理由**：本课的第 3 个机制（W3）是「`its` 不能自己站」。**项目已有 `自己站` 这条成熟术语**（实测全库 **73 处**出现「自己站」），且 L112 逐字 `grammarLabel: 长版 vs 短版 · mine 自己站，撇号 s 贴东西`、L189 逐字 `These books are theirs. —— 自己站的带 s（跟 mine／yours 一类）`。
- **⚠️ 但双正解卡不能直接对照**：`This book is mine.` 与 `The box is its box.` **不是同义句**，放双正解里同样没有对照价值。
- **⇒ 正确做法**：**这条对照放在 W3 的 `whyZh` 里**（见 §4.1 W3 草案：`要自己站，得换第 112 课那种带 s 的（mine／theirs）`），**而不是单开一张双正解卡**。

#### ⇒ 双正解卡必须换一个「什么才算对」的问法

**关键认识**：`its` 的双正解**不能是「另一种说法」**（`its` 没有同义替换），**只能是「同一个所属，换一个后面跟的东西」**——这正是 L8 `contrast[5]` 与 L189 `contrast[5]` 已经在用的模具（L189 逐字 `wrong: "Their classroom is big."` / `bothRight: true` / `whyZh: 两句都对——their 在两句里都贴在东西前面，换的只是后面那个东西。`）。

### 4.3 三张双正解（最终设计）

| # | `wrong`（实际是「也对的一句」） | `wrongMark` | `correct` | `whyZh` |
|---|---|---|---|---|
| **B1** | `My hat is in the box.` | `null` | `The cat is in its box.` | `两句都对——第 8 课那批小标签 my（我的）和今天的 its（它的）一样，都贴在东西前面：my hat／its box。换的只是「谁的」：一个是我，一个是它。` |
| **B2** | `Its box is small.` | `null` | `The cat is in its box.` | `两句都对——its 在两句里都贴在东西前面（its box），换的只是后面那句话：一句说「它的盒子很小」，一句说「猫在它的盒子里」。` |
| **B3** | `The cat is in the box.` | `null` | `The cat is in its box.` | `两句都对——the box 只说「那个盒子」（谁的不管）；its box 说清了是它自己的。` |

**为什么 B3 是「两句都对」而不是错句**（⚠️ 写课方最容易写坏的一张）：
`The cat is in the box.` **完全合法**（L80 逐字 `The cat is behind the door.` 就是同一结构，L26 逐字 `There is a cat under the chair.` 也是）。**它只是没说明「谁的盒子」。** ⇒ `whyZh` **必须说「两句都对，the box 只是没说是谁的」**，**绝不能写成「the box 是错的」**。（同型纪律见第四十批 `:445` 逐字：`**双正解 2 是本课最值钱的一张卡**…必须说清「两句都对，说的是两件事」，**不能写成「in it 是错的」**`。）

**双正解卡的机制覆盖**：B1＝同一族对照（`my`／`its`）／B2＝同一个 `its` 换后面那句话／B3＝有主 vs 无主的对照（`the`／`its`）。**三张各管一个维度，不重复。**

### 4.4 `oneLineRule` / `grammarLabel` 草案（零术语，已过红线扫描）

```
grammarLabel（推荐）: 它的 · 小标签补最后一个
grammarLabel（备选1）: 它的 · 贴东西前面，自己不能站
grammarLabel（备选2）: 一个读音两张脸 · 它是 / 它的

oneLineRule:
说「它的」用 its——它跟 my、her 一样贴在东西前面，自己不能单独站。
它和 It's 读起来一样，写法差一小撇：It's 是「它是」的短版（第 87 课），its 是「它的」。
```

**红线扫描实测**（`findZeroTermHits()`，§5.A）：**全部 clean** ✅（`grammarLabel` 三个备选、`oneLineRule`、三条 `whyZh`、`deepDive.title`、`episode` **全部 0 命中**）。

> **⚠️ 一条术语风险预警**：`its` 的语法书解释**必然**说「形容词性物主代词」／「限定词」——**全是红线词**。**写课方必须全程用项目的 `小标签`／`贴东西前面`／`自己站` 三个词**（实测库内用量：`小标签` 31 处、`自己站` 73 处、`贴东西` 9 处——**三个词都是项目自建词汇，可直接复用**）。

### 4.5 `practice` / `guided` / `recall` / `huntCaseIds` 建议

| 段 | 建议 |
|---|---|
| `practice` | **≥4 题**，须含**一道 C 层新句**（本课 `exhibits = 8` < 10，**不满足素材饱和豁免** → C 层新句是硬要求）。候选 C 层新句：`Its box is new.`（0 新词，Jaccard 低）／`The cat likes its box.`（0 新词）。**⚠️ 且 C 层新句须过两道守门**：Jaccard < 0.80 ＋ **不得只是换代词**（`grammarLessons.test.ts:592` 明文）。 |
| `guided` | **6 题**（与 L190–L194 一致：实测均为 `guided=6`）。**必须含一道 spot 题**，且该题的 `wrongToken` 应指向 `its`／`It's`（承接 L87 的 spot 模具）。 |
| `recall` | **建议配置**（L190–L194 实测全部 `recall=yes`）。`answer` 用 targetSentence 原句。 |
| `contrast` | **6 张**（与 L190–L194 一致：实测均为 `contrast=6`）＝ §4.3 的 3 错 + 3 双正解。 |
| `variants` | **3 条**（与 L190–L194 一致）。**⚠️ 否定式建议**：`Its box is not small.`——**理由是与尾段 9 课风格一致**（实测 L189 `These are not their books.`／L193 `The wind was not so strong…`／L194 `It was not such a big fish.` **全部用完整式**；全库 `variants` 里 `is not` 型 19 课 vs `isn't` 型 2 课）。`isn't` 本身**已在 L26 教过，不违反规则**——只是不宜在本课再添一件合体来分散对 `its` 的注意力。 |
| `sceneSwings` | **3 条**（与 L190–L194 一致）。 |
| `huntCaseIds` | ⚠️ **需要新建一个案（案 204）**。**实测全库 203 案中没有任何一案覆盖 `its`／`it's`**（§5.D 实测：5 处 `it` 相关 error 全是 `missing_be` 型 `It → It is` 或 `word_order` 型，**没有 `its`／`it's` 的撇号题**）。**⇒ 写课方需同时造一条案**，否则 `huntCaseIds` 会指向不存在的案。 |

---

## §5 外部权威依据与逐字引用

### 5.1 抓取结果总表

| 源 | URL | 状态 | 等级标注 |
|---|---|---|---|
| **Cambridge** `It's or its?` | `https://dictionary.cambridge.org/grammar/british-grammar/it-s-or-its` | ✅ **抓到** | 属 `English Grammar Today`（剑桥自述「ideal for intermediate learners at CEFR levels B1-B2」） |
| **Cambridge** `Pronouns: possessive` | `https://dictionary.cambridge.org/grammar/british-grammar/pronouns-possessive-my-mine-your-yours-etc` | ✅ **抓到** | 同上 |
| **Cambridge** `Word choice: its or it's?` | `https://dictionary.cambridge.org/grammar/british-grammar/its-or-it-s` | ✅ **抓到** | 属 `Common mistakes in English > Word choice` |
| **OALD** `its` 词条 | `https://www.oxfordlearnersdictionaries.com/definition/english/its` | ✅ **抓到** | **`fkcefr="a1"` ＋ `fkox3000="y"`**（HTML 属性实测） |
| **British Council** LearnEnglish `Possessive pronouns` | `https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/possessive-pronouns` | ⚠️ **部分抓到（正文抓不到）** | 见 §5.5「抓不到」声明 |
| **Grammarly** `Its vs. It’s` | `https://www.grammarly.com/blog/its-vs-its/` | ✅ **抓到正文** | 非教学权威（商业语法检查器博客），**仅作旁证** |
| **iciba（爱词霸）** `its` | `https://www.iciba.com/word?w=its` | ✅ **抓到** | 中文侧词条 |

### 5.2 Cambridge 逐字引用（**3 处以上，含任务书特别指出的「不能自己站」那句**）

**引文 ① —— 任务书特别要求查的「`its` 不能自己站」（`https://dictionary.cambridge.org/grammar/british-grammar/it-s-or-its`）**

> ```
> Its is a possessive determiner (like my, your, his) which we use when referring to things or animals:
> Every house in the street has got its own garage.
> [talking about a famous American journalist]
> He joined the New York Tribune (1868), becoming its editor-in-chief and eventually its
> principal owner (1872–1905).
> We don't use its as a possessive pronoun.
> Compare
> A: Whose is this ball?
> B: Mine.
> Possessive pronoun mine used alone.
> A: Whose is this ball?
> B: The dog's.
> Not: Its.
> Possessive determiner its is not used alone. We repeat the noun which is being referred to.
> ```

**✅ 本轮明确抓到任务书要求的那句**：**`Possessive determiner its is not used alone. We repeat the noun which is being referred to.`** ＋ **`We don't use its as a possessive pronoun.`** ——**这两句逐字为错句 ③（`*The box is its.`）背书。**

> **⚠️ 一处必须写清的诚实差异**：剑桥的对比例是 **`Not: Its.`**（回答 `Whose is this ball?` 时不能说 `Its.`），**不是 `*The box is its.`**。**⇒ 剑桥背书的是「`its` 不能单独用作回答/独立成分」这一机制，不是「`*The box is its.` 这个具体句子已被剑桥写过」。** 写 `whyZh` 时应说「它自己站不住」（机制层面），**不要暗示剑桥举了这个例子**。

**引文 ② —— `its` 与 `It's` 的分工（`https://dictionary.cambridge.org/grammar/british-grammar/its-or-it-s`）**

> ```
> Word choice: its or it's?
> from English Grammar Today
> Its meaning 'of it' or 'belonging to it' does not have an apostrophe.
> The dog was chasing it's tail.
> The dog was chasing its tail.
> It's is the short form of 'it is' or 'it has':
> It's useful to listen to the radio in English.
> It's been very nice talking to you.
> ```
>
> （页面路径逐字：`Grammar > Common mistakes in English > Word choice > Word choice: its or it's?`；页面标题逐字：`Word choice: its or it's?`）

**✅ 这句 `Its meaning 'of it' or 'belonging to it' does not have an apostrophe.` 直接支撑错句 ②（`*It's box is small.`）**——**「所属的那个不带撇号」是剑桥明说的。**

**引文 ③ —— `its` 在 `possessive` 体系里的位置 ＋ `its` 的正确用法（`https://dictionary.cambridge.org/grammar/british-grammar/pronouns-possessive-my-mine-your-yours-etc`）**

> ```
> personal pronoun   possessive determiner   possessive pronoun
> I                  my                      mine
> you (singular and plural)  your            yours
> he                 his                     his
> she                her                     hers
> it                 its                     its*
> we                 our                     ours
> they               their                   theirs
> one                one's                   one's*
> *We avoid using its and one's as possessive pronouns except when we use them with own:
> The house seemed asleep yet, as I have said, it had a life of its own.
> One doesn't like to spend too much time on one's own.
> ```

**引文 ④ —— 剑桥 `Typical errors` 段（同页）**

> ```
> Typical errors
> We don't use 's after possessive pronouns:
> Are those gloves hers?
> Not: Are those gloves her's?
> 's is not used with the possessive pronoun its. It's means 'it is':
> The team is proud of its ability to perform consistently well.
> Not: … proud of it's ability …
> We don't use another determiner with a possessive determiner:
> I'm going to get my hair cut this afternoon.
> Not: … get the my hair cut …
> We don't use possessive determiners on their own. They are always at the beginning of
> noun phrases:
> That's not my book. It's yours.
> (or It's your book.)
> Not: It's your.
> We don't use possessive pronouns before nouns:
> Lots of our friends were at the party.
> Not: Lots of ours friends …
> ```

**✅ 引文 ④ 第三段 `We don't use possessive determiners on their own. They are always at the beginning of noun phrases:` 是错句 ③ 的第二次独立背书**（同一个机制，剑桥在两个页面上各说一次）。

**引文 ⑤ —— `its` 的用法定义（OALD，`https://www.oxfordlearnersdictionaries.com/definition/english/its`）**

> ```
> Definition of its determiner from the Oxford Advanced Learner's Dictionary
> its determiner /ɪts/ /ɪts/
> belonging to or connected with a thing, an animal or a baby
> Turn the box on its side.
> Have you any idea of its value?
> The dog had hurt its paw.
> The baby threw its food on the floor.
> ```

**⚠️ 一条对写课方有用的观察**：OALD 的 4 个例句里，**`its` 后面的东西全是身体部位或物品**（`side`／`value`／`paw`／`food`）——**全部紧跟名词**，**没有一句让 `its` 单独站**。**⇒ 这与剑桥的「不能自己站」相互印证。**

### 5.3 跨源位次（**任务书要求回答「哪个等级、和什么一起教」**）

| 源 | `its` 的位置 | 与什么一起教 |
|---|---|---|
| **OALD**（HTML 属性实测） | **CEFR `A1`**（`fkcefr="a1"`）；**Oxford 3000 收录**（`fkox3000="y"`） | 单独词条 `its determiner` |
| **Cambridge**（Grammar Today） | 属 `Common mistakes in English > Word choice`；语法上归 `Nouns, pronouns and determiners > Pronouns > Pronouns: possessive` | **与 `my`／`mine`／`your`／`yours`／`his`／`her`／`hers`／`our`／`ours`／`their`／`theirs` 同一张表** |
| **British Council** | 表里 `it` 行的 `possessive pronoun` 列**是空的**（见 §5.5） | 与 `my/your/his/her/our/their` 同一张表；页面标 `Level: beginner` |
| **iciba（中文侧）** | 词条标注 `高中/CET4/CET6`；释义逐字：`det. （指事物、动物或婴儿）它的，他的，她的` | 单独词条 |
| **Grammarly（旁证）** | 无等级标注 | 逐字：`Its (without an apostrophe) is a possessive pron…`；`These two tiny, three-letter words are among the most commonly confused words in the written English language, even for native English speakers.` |

**⇒ 跨源位次结论**：
1. **`its` 是 A1／beginner 级**（OALD 明标 A1；British Council 标 beginner）——**本课完全在项目难度带内**（L194 的 `such a` 是 A2，本课**比它更浅**）。
2. **所有源都把 `its` 放在 `my/your/his/her` 同一张表里**——**⇒ 与 §4.2 问题 2 的裁定（对照 L8 的 `my/our/his/her`）完全一致。**
3. **没有任何源把 `its` 与 `It's` 分开教**——**两个源（剑桥 `It's or its?`、剑桥 `Word choice: its or it's?`）都把它们作为「易混对」并列。** ⇒ **本项目把 `It's`（L87）与 `its`（L195）分作两课，是「先合体、后所属」的排布，与外部源的「并列呈现」不同——这是本项目「一次一个点」的设计选择，不是错误**（§3.3 分工表已说清）。

### 5.4 ⚠️ 「抓不到」声明（逐项说明尝试了什么）

| 目标 | 尝试 | 结果 |
|---|---|---|
| **British Council 正文**（`Be careful!` 段与表格正文） | ① `curl`（Chrome UA，HTTP/1.1）→ `HTTP:000`；② `curl`（Safari UA）→ `HTTP:000`；③ node `https.get` → `TIMEOUT / socket hang up`；④ python3 `urllib` → `SSL: CERTIFICATE_VERIFY_FAILED`；⑤ `WebFetch` ×3（含 `?page=1` 与 `#be-careful` 锚点）→ **只返回导航菜单与用户评论，正文不在抓取内容里** | ⚠️ **正文抓不到**。**唯一取到的是 `WebFetch` 一次成功返回的摘要**（见 §5.5），**以及页面标 `Level: beginner`** |
| **Oxford PEU（Practical English Usage）在线版** | `https://www.oxfordlearnersdictionaries.com/grammar/online-grammar/possessive-determiners-and-possessive-pronouns` → `HTTP:404`（页面逐字 `We're sorry. The page you have requested is not here.`）；`https://www.englishprofile.org/english-grammar-profile/egp-online` → `HTTP:404`；`https://www.englishprofile.org/wordlists/evp` → `HTTP:404` | ❌ **PEU 在线版与 English Grammar Profile 均抓不到**（404，非登录墙） |
| **中文侧教学文章**（任务书要求「中文侧教学文章」） | ① `zhihu.com/question/20743010` → `HTTP:403`＋`WebFetch` 403；② `zhuanlan.zhihu.com` → `HTTP:403`；③ `baike.baidu.com/item/its` → `HTTP:403`；④ `baike.baidu.com/item/物主代词` → `HTTP:403`；⑤ `hjenglish.com` → `HTTP:000`；⑥ `yygrammar.com` → `HTTP:200` 但**正文仅 84 字节**（空壳）；⑦ `51talk.com` → `HTTP:302`；⑧ `www.yingyu.com/e/…` → `getaddrinfo ENOTFOUND` | ⚠️ **中文侧教学文章基本抓不到**（知乎/百度百科 403，英语语法站点空壳或 DNS 失败）。**唯一成功的是 iciba 词条**（§5.3 已引，但它给的是 `高中/CET4/CET6` 标签而非教学位次） |
| Merriam-Webster | `https://www.merriam-webster.com/grammar/its-vs-its-usage` → `HTTP:403`（`SIZE:5742`＝封禁页） | ❌ 抓不到 |
| Purdue OWL | `https://owl.purdue.edu/owl/general_writing/punctuation/apostrophe_use.html` → `HTTP:404` | ❌ 抓不到 |

> **⇒ 诚实结论**：**英文侧权威（Cambridge ×3 页 + OALD ×1 页）抓取充分，逐字引用 5 处，其中含任务书特别要求的「`its` 不能自己站」那句。** **中文侧教学文章抓不到**（403/空壳/DNS 失败），**只能以 iciba 词条代偿**——**这是本报告最弱的一环，已登记为不确定项（§7.2）。**

### 5.5 British Council 的部分取证（**明确标注取证强度**）

`WebFetch` 有一次返回了该页的实质内容（**本次抓取成功，但后续 5 次重试均只得到导航菜单**——页面有反爬/间歇性渲染差异）：

> - `"Possessive pronouns do not have an apostrophe:"` — stated under `"Be careful!"`
> - `"Is that car yours/hers/ours/theirs?"` — the example given
> - `"We can use a possessive pronoun instead of a full noun phrase to avoid repeating words:"`
> - `"No, it's mine. (INSTEAD OF No, it's [my car].)"`
> - **CEFR Level: Beginner**
> - **On "its":** The beginner table lists `its` as a possessive adjective but **shows a dash (`-`) for its possessive pronoun form**. The page itself contains no explanatory statement about `its`—only the blank in the table. That explanation appears solely in the comments (e.g., a team member noting `"We don't really use the possessive pronoun 'its' by itself"`).
> - **Table:** `I/me/my/mine, you/you/your/yours, he/him/his/his, she/her/her/hers, it/it/its/-, we/us/our/ours, they/them/their/theirs`

**⚠️ 标注**：上述**表格里 `its` 的「自己站」那一格是空的（`-`）**，**与剑桥 `We don't use its as a possessive pronoun.` 完全一致**——**这是「`its` 不能自己站」的第三个独立源**。但**这些话术来自 `WebFetch` 的摘要（含页面评论区的观察），不是我从原始 HTML 逐字提取的**——**取证强度低于 §5.2 的 Cambridge/OALD 逐字引用**，使用时请以此为准。

---

## §6 自我核查记录（命令 + 输出）

> **⚠️ 口径纪律（任务书第 5 条）**：「核查逐字引用不能只查被指认的那一课——必须全库检索字符串再定位」。
> **本轮全程遵守**：所有断言都**先在全库 194 课范围内检索**，再定位到具体的课。**下面每条命令都可复现**（脚本落在 `/tmp/`，用项目自带 `vite-node` 跑，直接 import 真实数据模块——**不是正则爬文本**）。

### 6.0 为什么用 `vite-node` 而不是纯 node

第一版尝试用 node 直接 eval 数据文件（手写剥 import / export），**失败**：

```
$ node /tmp/eval1.cjs
EVAL FAILED: Unexpected token ')'
```

⇒ 改用**项目自带**的 `./node_modules/.bin/vite-node`，**直接 import 类型化模块**，拿到的是**运行时的真实对象**（不是文本匹配）。**这是本轮方法论的升级**：所有字段级断言都基于真实对象遍历（`allStrings()` 递归走全部字符串字段）。

### 6.1 硬核对：全库 `its` / `Its` 检索（大小写两遍）

```bash
$ node -e "
const fs=require('fs');
const s=fs.readFileSync('src/data/grammarLessons.ts','utf8');
const lines=s.split('\n');
const lower=/(?<![A-Za-z'-])its(?![A-Za-z'-])/g;
const upper=/(?<![A-Za-z'-])Its(?![A-Za-z'-])/g;
let nl=0,nu=0;
lines.forEach(ln=>{ let g=new RegExp(lower.source,'g'); while(g.exec(ln)) nl++;
                    g=new RegExp(upper.source,'g'); while(g.exec(ln)) nu++; });
console.log('lowercase \"its\" occurrences:',nl);
console.log('capitalized \"Its\" occurrences:',nu);
"
lowercase "its" occurrences: 0
capitalized "Its" occurrences: 15
```

**⇒ 若只按任务书写的小写 `its` 检索，命中 0 处，会得出「库内没有 its」的错误结论。** 这是本轮**最重要的口径修正**。

### 6.2 结构基线核对

```bash
$ ./node_modules/.bin/vite-node /tmp/verify.ts
=== 0. HEADLINE FACTS ===
  lessons: 194 | hunt cases: 203 | seasons: 28
  lessons numbered 1..194 contiguous: true
  cumulative vocab after the last lesson: 781
  L194 targetSentence: "It was such a big fish."
  next free lesson number: 195
  next free hunt case number: 204
  last season max covers all lessons: true
```

**⇒ 194 课／203 案／28 季** ✅ 与任务书一致；课号连续；**L195 与案 204 均空闲**。

### 6.3 全字段遍历审计（§1.1 的证据）

```bash
$ ./node_modules/.bin/vite-node /tmp/audit.ts
=== DEFINITIVE 'its' AUDIT (every string field, every lesson) ===
  total lines/fields containing 'its': 15
  ...
  POSITIVE uses (learner sees a correct sentence): 0
  NEGATIVE uses (learner sees it flagged wrong / as a decoy): 11
  OTHER (prose / spot-answer / tokens): 4
```

**⇒ 正面用例 = 0** ✅（4 处 `OTHER` 已逐条裁定，§1.1）。

### 6.4 词表池闸门复现（§1.4 的证据）

```bash
$ ./node_modules/.bin/vite-node /tmp/verify.ts   # §1 段
=== 1. WHERE DOES 'its' ENTER THE VOCAB POOL? ===
  'its' first pooled at: L87
  'it\'s' first pooled at: L24
```

**⇒ `its` 在 L87 被「错句」送进词表池**——D 层守门因此看不见这个缺口。

### 6.5 候选句 D 层验证（§2.2 的证据）

```bash
$ ./node_modules/.bin/vite-node /tmp/verify.ts   # §2 段
=== 2. CANDIDATE TARGET SENTENCES — EXACT D-LAYER CHECK ===
  OK   Its name is White.        4w  its(L87) name(L8) is(L1) white(L17)
  MISS Its name is Mimi.         4w  … mimi(**UNTAUGHT**)
  OK   The cat is in its box.    6w  the(L4) cat(L3) is(L1) in(L18) its(L87) box(L18)
  ...
  MISS The box is its own.       5w  … own(**UNTAUGHT**)
```

**⇒ 推荐句 0 新词** ✅；`own` 与 `mimi` **硬否决** ✅。

### 6.6 Jaccard 相似度验证（§2.1 的证据）

```bash
$ ./node_modules/.bin/vite-node /tmp/partners.ts
=== Jaccard of proposed contrast partners vs the proposed target sentence ===
  My hat is in the box.         jaccard vs target = 0.50
  It's cold today.              jaccard vs target = 0.00
  These books are theirs.       jaccard vs target = 0.00
  This book is mine.            jaccard vs target = 0.11
  The cat is behind the door.   jaccard vs target = 0.38
  His name is Tom.              jaccard vs target = 0.11

=== the three proposed WRONG sentences: are they already used anywhere? ===
  "The cat is in it box."   free (not used)
  "It's box is small."      free (not used)
  "The box is its."         free (not used)
  "Its box is small."       free (not used)
```

**⇒ 三条错句均未被使用过** ✅（对照卡不会重复用句）；配对句全部实存 ✅。

### 6.7 双正解搭档句「真的存在吗」验证（§4.2 的证据）

```bash
$ ./node_modules/.bin/vite-node /tmp/partners.ts
=== candidate DOUBLE-RIGHT partner sentences: do they really exist? ===
  L87 "It's cold today." -> PRESENT (12 field(s))
  L8 "This is my book." -> PRESENT (3 field(s))
  L18 "My hat is in the box." -> PRESENT (6 field(s))
  L112 "This book is mine." -> PRESENT (11 field(s))
  L189 "These books are theirs." -> PRESENT (4 field(s))
  L33 "This one is mine." -> PRESENT (6 field(s))
```

**⇒ 所有引用的旧课句子都逐字实存** ✅（B1 用的 `My hat is in the box.` 实存于 L18 的 6 个字段）。

### 6.8 同型先例全库检索（「不能只查被指认的那一课」）

**任务书要求：不得只查 L87，必须全库检索。** 本轮针对**每条错句的机制**在全库检索同型先例：

```bash
$ ./node_modules/.bin/vite-node /tmp/precedent.ts
=== ALL contrast cards whose wrongMark is a bare pronoun (the same family) ===
  L8   mark="I"    wrong="This is I book."                -> "This is my book."
  L8   mark="Her"  wrong="Her is my friend."              -> "She is my friend."
  L8   mark="she"  wrong="I like she cat."                -> "I like her cat."
  L8   mark="My"   wrong="My am happy."                   -> "I am happy."
  L8   mark="He"   wrong="He name is Tom."                -> "His name is Tom."
  L33  mark="my"   wrong="This umbrella is my."           -> "This umbrella is mine."
  L39  mark="he"   wrong="The boy who he wears glasses…"  -> "…"
  L41  mark="he"   wrong="I know the boy who he wears…"   -> "…"
  L87  mark="Its"  wrong="Its cold today."                -> "It's cold today."
  L112 mark="my"   wrong="This book is my."               -> "This book is mine."
  L117 mark="my"   wrong="This book is my."               -> "This book is mine."
  L163 mark="my"   wrong="I can do it my."                -> "I can do it myself."
  L164 mark="her"  wrong="She can do it her."             -> "She can do it herself."
  L189 mark="they" wrong="These are they books."          -> "These are their books."
```

**⇒ 结论**：错句 ①（`it` 顶替标签）**有 L8 的 5 条同型先例** ✅；错句 ③（标签不能自己站）**有 L33／L112／L117／L163／L164 共 5 条同型先例** ✅；**⇒ 三条错句全部有库内模具可复用，不是新造机制。**

**同时验证 `who's`/`whose` 同音对（§3.2 R4 的证据）**：

```bash
$ ./node_modules/.bin/vite-node /tmp/precedent.ts   # 见 /tmp/partners.ts 的 L85 段
L85 逐字 grammarLabel: 问东西的主人 · whose
L85 逐字 contrast[0]: {"wrong":"Who's book is this?","wrongMark":"Who's","correct":"Whose book is this?",
                       "whyZh":"谁是「谁」，whose 是「谁的」——两家人读起来像、写法不同：whose 一个词，who's 是 who is 的缩写。"}
```

**⇒ L85 已建立「同音异形 = 两家人」框架**，本课可直接复用 ✅。

### 6.9 零术语红线扫描（§4.4 的证据）

```bash
$ ./node_modules/.bin/vite-node /tmp/compliance.ts
=== A. ZERO-TERM scan of my PROPOSED user-visible strings ===
  clean     grammarLabel(alt1)
  clean     grammarLabel(alt2)
  clean     grammarLabel(alt3)
  clean     oneLineRule
  clean     whyZh(卡片1)
  clean     whyZh(卡片2)
  clean     whyZh(卡片3)
  clean     deepDive.title
  clean     episode
```

**⇒ 本报告提出的全部用户可见文案 = 0 处术语命中** ✅（用的是项目自建词汇 `小标签`／`贴东西前面`／`自己站`）。

### 6.10 `space` 场景词表验证（§2.4 的证据）

```bash
$ node /tmp/final3.cjs
=== A. SPACE-scene vocabulary availability ===
  space      *** ABSENT from all 194 lessons ***
  rocket     *** ABSENT from all 194 lessons ***
  moon       *** ABSENT from all 194 lessons ***
  star       *** ABSENT from all 194 lessons ***
  planet     *** ABSENT from all 194 lessons ***
  ship       *** ABSENT from all 194 lessons ***
  world      *** ABSENT from all 194 lessons ***
  fly        *** ABSENT from all 194 lessons ***
```

**⇒ `space` 场景的词汇全部零出现**——**这是「不能用」而非「不适合」的硬理由** ✅。

### 6.11 场景用量实测（§2.1 的证据）

```bash
$ ./node_modules/.bin/vite-node /tmp/verify.ts   # §5 段
=== 5. SPACE scene usage ===
  {"campus":57,"city":39,"sparkle":9,"island":6,"train":5,"forest":3,"magic":2,
   "mansion":62,"snow":2,"mystery":4,"ocean":2,"lighthouse":2,"desert":1}
  space lessons: 0
```

**⇒ `space` = 0 ✅**（全库唯一未用场景，与任务书一致）；`mansion` = 62 课（推荐场景）。

### 6.12 案（huntCase）覆盖验证（§4.5 的证据）

```bash
$ ./node_modules/.bin/vite-node /tmp/precedent.ts
=== huntCases: any case with a marked 'it'/'its' token error? ===
  hunt-trip-time   token="it"  -> "does it"  tag=word_order
  hunt-desk-map    token="sit" -> "sits"     tag=sv_agreement
  hunt-seat-plan   token="sit" -> "sits"     tag=sv_agreement
  hunt-cold-morning token="It" -> "It is"    tag=missing_be
  hunt-windy-window token="It" -> "It is"    tag=missing_be
```

**⇒ 203 案中没有任何一案覆盖 `its`／`it's` 的撇号考点** ✅——**写课方需新建案 204**。

### 6.13 难度衔接验证（§2.1 的证据）

```bash
$ node -e "…lc=L194 targetSentence 最长分句…"
L187 clause=8  "I will go as long as you come."
L188 clause=6  "I had to walk home yesterday."
L189 clause=4  "These are their books."
L190 clause=5  "I am learning to swim."
L191 clause=5  "She walked into the kitchen."
L192 clause=9  "We walked through the forest and across the bridge."
L193 clause=9  "The wind was so strong that the window broke."
L194 clause=6  "It was such a big fish."
```

**⇒ L194 = 6 词**；本课 6 词 → **跳变 0** ✅（上限 5）。

### 6.14 否定式风格验证（§4.5 / §7#6 的证据 —— **一处自我更正**）

**本报告初稿误写**「`isn't` 超出 L87 范围／未实测」，**本轮补测后更正**：

```bash
$ ./node_modules/.bin/vite-node /tmp/negation.ts
=== negation style in the tail lessons (L186-L194) ===
  L186 否定变体: "I came early so that you don't wait."
  L187 否定变体: "You can't go as long as you don't finish."
  L188 否定变体: "I didn't have to walk home yesterday."
  L189 否定变体: "These are not their books."
  L190 否定变体: "I am not learning to swim."
  L191 否定变体: "She didn't walk into the kitchen."
  L192 否定变体: "We didn't walk through the forest or across the bridge."
  L193 否定变体: "The wind was not so strong that the window broke."
  L194 否定变体: "It was not such a big fish."

=== how many lessons use 'is not' vs 'isn't' in variants ===
  'is not' style: 19  | "isn't" style: 2

=== first lesson teaching isn't ===
  L25 (每天都做 · 他/她/它加 -s)
  L26 (存在句 · there is / there are)
  ...
```

**⇒ 更正后的准确说法**：`isn't` **在 L26 已教过**（L26 逐字 `noteZh: "在 is 后面加 not：isn't。好几个东西用 aren't。"`），**用它不违反 D 层**；**但尾段 9 课全部用完整式**（19:2 的压倒性风格）——**所以建议用 `is not`，理由是风格一致而非规则限制** ✅

---

## §7 不确定项（诚实登记）

| # | 不确定项 | 现状 | 建议 |
|---|---|---|---|
| **1** | ⚠️ **词表池（`buildPools`）把 `contrast.wrong` 计入「已教过的词」** | **本轮独立发现**：`grammarLessons.test.ts:418` 逐字 `addWord(contrast.wrong)`。⇒ 任何只在错句里出现过的词都会伪装成「教过了」。**`its` 正是受害者**（存活 107 课）。**这不是本课能修的**（改它会动全库 194 课基线）。 | **建议单独立项**：审计「词表池里的词有多少只出现在错句／干扰项里」。**这是系统性盲区，不止 `its` 一个词。** |
| **2** | ⚠️ **中文侧教学文章抓不到**（§5.4） | 知乎/百度百科 403、hjenglish DNS 失败、yygrammar 空壳。**中文侧只有 iciba 词条**（标 `高中/CET4/CET6`）。 | 若必须补中文侧依据，需**换人工检索**（本地浏览器打开，或用其他工具）。**本报告的「中文母语者为什么这么说」三节是基于语言迁移推理 + 剑桥/牛津的英文侧依据，不是基于中文侧文献。** |
| **3** | **`its name is …` 的「名字」vs「所属物」取舍** | §2.3 已并列两个候选。`Its name is White.`（4 词）更短、句首大写 `Its` 是真实书写要求；但**教的是「它的名字」而不是「它的东西」**。 | **需产品负责人判断**：本课要教「`its` 这个**词形**」还是「`its` 的**所属功能**」。**我倾向 `The cat is in its box.`**（所属更纯），**但这是可辩护的双选，不是硬结论。** |
| **4** | **`its` 与 `it` 的「主角词」框架是否已建立** | 本课错句 ① 依赖「`it` 只能当主角」这条框架。**实测 L8 已用同一框架判过 `I`／`she`／`he`**（§6.8），**但 `it` 这个具体成员从未被用来演示「不能贴东西」**（L87 只把它当拼写错）。 | 写课方在 W1 的 `whyZh` 里**必须回引第 8 课**（草案已含：`第 8 课那批小标签（my／her）也是这么贴的`）。**若写课方省略这句回引，本卡的教学价值会大幅下降。** |
| **5** | **`space` 场景的启用时机** | 本轮**第二次**因词汇红线否决 `space`（第一次是第四十批）。**它的插画与渲染完全就绪**（实测 `AdventureScene.tsx:458 space: SpaceScene`）——**卡的是词，不是素材**。 | **登记第四次**：建议留给「想象／愿望」类课（第四十批 `:1118` 逐字建议 `I want to go to space.`，`want`@L4、`go`@L9 全在池里）。**若第三批仍不用，建议在路线图里明确标注「`space` 是词汇受限场景，需专门立项补词」**，否则它会无限期挂着。 |
| **6** | **`variants` 的否定式该写 `is not` 还是 `isn't`** | **本轮已实测**（`/tmp/negation.ts`）：`isn't` **在 L26 已教过**（逐字 L26 `noteZh: "在 is 后面加 not：isn't。好几个东西用 aren't。"`），**所以用 `isn't` 不违反 D 层**。<br>**但风格上有强先例**：全库 `variants` 里 **`is not` 型 19 课 vs `isn't` 型 2 课**；**且尾段 9 课（L186–L194）逐字全部用完整式**——L189 `These are not their books.`／L190 `I am not learning to swim.`／L193 `The wind was not so strong that the window broke.`／L194 `It was not such a big fish.`。<br>**⚠️ 更正说明**：本报告初稿在此处写过「**超出 L87 只教 `It's` 的范围／未实测**」——**该表述不准确**（`isn't` 早已教过，不是新点），**现按实测数据更正。** | **建议写 `Its box is not small.`**——理由**不是规则限制，而是与尾段 9 课的既有风格一致**（且 L87 的合体是本课要引的**旧知识**，不宜在同一课再添一件新合体来分散注意力）。 |

---

## 附录 A：本课建议的完整字段骨架（供写课方直接取用）

```
id:               "lesson-195-its"            ← 与 lesson-194-such-a 同构
number:           195
title:            （建议）「猫的盒子」        ← 4 字，与 L193「风太大，窗户破了」/ L194「这么大的一条鱼」同风格
grammarLabel:     "它的 · 小标签补最后一个"
episode:          "小美的一天 一百九十五"      ← 实测 L193/L194 逐字为「一百九十三」/「一百九十四」
scene:            "mansion"                   ← L80 找猫用的就是 mansion
targetSentence:   "The cat is in its box."
blocks:           [{ text: "The cat is in", role: "猫在…里" },
                   { text: "its box", role: "它的盒子（its 贴在东西前面）" }]   ← 词块切分须过 blocks 断言
contrast:         6 张 = §4.1 的 W1/W2/W3 ＋ §4.3 的 B1/B2/B3
variants:         3 条（肯定 / 否定用 "is not" / 疑问）
guided:           6 题（含 1 道 spot，wrongToken 指向 its 或 It's）
practice:         5 题（★须含 1 道 C 层新句；实测 L190–L194 均为 practice=5）
recall:           配置（L190–L194 实测全部有）
huntCaseIds:      ["hunt-its-box"]            ← ⚠️ 需同时新建案 204（实测无现成案可挂）
sceneSwings:      3 条
deepDive.title:   "一个读音，两张脸"
```

## 附录 B：本轮产生的脚本清单（可复现）

| 脚本 | 用途 |
|---|---|
| `/tmp/verify.ts` | **主验证**：结构基线 ＋ 词表池定位 ＋ 13 条候选句 D 层 ＋ 全族正面用例扫描 ＋ 场景用量 |
| `/tmp/audit.ts` | **全字段遍历**：15 处 `its` 逐字段定位 ＋ 正/负/其他三分 ＋ 拼写形（`its`17／`Its`15） |
| `/tmp/precedent.ts` | **同型先例**：L112/L189/L33 对照卡 ＋ 全库「裸代词 wrongMark」清单 ＋ `own` 全库检索 ＋ 案覆盖 |
| `/tmp/partners.ts` | **搭档句实存性** ＋ Jaccard 相似度 ＋ 三条错句占用检查 |
| `/tmp/compliance.ts` | **零术语扫描**（我的全部草案文案）＋ 尾课字段结构对比 ＋ 词首见课号 |
| `/tmp/final3.cjs` | `space` 场景词表 ＋ OALD 的 CEFR/Oxford3000 HTML 属性提取 |

**运行方式**（`/tmp/*.ts` 用项目自带 vite-node）：
```bash
cd /Users/liujun/Documents/英语听写
./node_modules/.bin/vite-node /tmp/verify.ts
./node_modules/.bin/vite-node /tmp/audit.ts
./node_modules/.bin/vite-node /tmp/precedent.ts
./node_modules/.bin/vite-node /tmp/partners.ts
./node_modules/.bin/vite-node /tmp/compliance.ts
node /tmp/final3.cjs
```
