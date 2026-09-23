# 竞析 · 第 53 批：`editOp` 操作层落地评估（ERRANT 复核 + 5 处字面猜改造）

> 路径 `/Users/liujun/Documents/英语听写`
> 日期 2026-09-23 ｜ 角色：竞析（竞品与外部权威源分析）
> 范围：① ERRANT 操作层复核与枚举建议 ② 插入类型核实 ③ 跨源核查 ④ 移动型处置 ⑤ 5 处字面猜改造 ⑥ 上批三处成果复核
> 全部结论由 node + vite-node **类型化读取** `src/data/huntCases.ts` 与**真实导出的产品函数**实测得出，**未使用本地 grep**（本地 `grep` 是 ZCode 包装的 ugrep，存在假返回风险）。凡需检索处一律用 `/Applications/ZCode.app/Contents/Resources/tools/ripgrep/rg`。

---

## ① 结论摘要

1. **ERRANT 是「一层操作 × 多层子类」的交叉表，不是并列枚举。** 原文（UCAM-CL-TR-938 §5.3.1，逐字）：「All edits are **minimally classified in terms of edit operation**; i.e. whether tokens are missing (M), replaced (R) or unnecessary (U)」；紧接着 Table 5.2 明确标出三层：「**Operation Tier** / Part Of Speech Tier / Token Tier / Morphology Tier」，其中 **`R:WO`（Word Order）与 `R:ORTH`（Orthography）不是操作，是被钉死在 R 列上的子类**——表里 WO 与 ORTH 在 M 列、U 列都是「—」（impossible combination）。所以上批的表述需要**一处纠正**：`M/U/R` 是第一层（操作层，**3 值**），`WO / ORTH / VERB:TENSE …` 是第二层（子类层，**55 值**），两层是**前缀拼接**关系（`R:WO`），不是并列的 5 个枚举值。

2. **插入（U）在本项目大量存在，共 86 处，目前被散落在 10 个 tag 里、且没有一个 tag 叫「插入」。** 判据是「`correction` 把 `original` 全部词按原序包含、且词数更多」：**补在前 67 处**（`happy → is happy`）、**补在后 17 处**（`next → next to`）、**两头补 2 处**（`soon → as soon as`）。按现有 `tag` 归属：`missing_be` 21 / `fragment` 18 / `word_order` 15 / `article` 12 / `preposition` 8 / `verb_form` 6 / `tense` 3 / `comparison` 2 / `run_on` 1。**另有 3 处词数变多但词序对不上**（`many → a lot of`、`don't → am not`、`must → had to`），按 ERRANT 口径属 `R:`（替换）而非 `M:`。
   ⚠️ **注意 ERRANT 的 M 与「补词」不是同一件事**：ERRANT 的 `M:` 定义是 `[ε → B]`（**原侧为空**），本项目是「原位有错词、要把它扩成一个短语」，在 ERRANT 里对应 `R:` 而非 `M:`。所以**不要照抄 `insert` 到 ERRANT 的 M**——本建议的枚举值是本项目的操作层，不是 ERRANT 的复刻。

3. **移动型建议：不真执行移动（保持现状 + 补 `editOp: "move"` 标注）。** 我用真实 `correctedSentenceOf` 逐条试算了 12 处「把 X 移到 Y 前/后」模板，**机械搬运 12 处里 10 处会产出新病句**（标点归属错乱、跨句粘连），因为移动必然同时改动**标点归属与相邻词顺序**，而当前机制只有「槽位替换 / 槽位删除」两种原子操作。成本高（要引入 span 模型 + 标点重分配）、收益低（`explanation` 已把语序讲清，用户也能自己读出正确句），**建议不执行**。

4. **缺省值风险：把缺省当 `replace` 会造成 86 处错误，占全库 10.8%。** 必须显式标注的是 **`delete` 62 + `move` 22 = 84 处**（另 2 处是纯说明型 `explain`，见下），其余 **710 处**（`insert` 86 + `orient` 14 + `replace` 610）缺省当替换**无害**——因为它们的 `correction` 本身已含原词或就是完整的最终文本。**你担心的「13 处移动型与 13 处括注式会不会又被误当成替换」——答案是：不会（若保留中文兜底），但代价是它们也得不到正确处理。**

5. **5 处字面猜的改造：改为「读 `editOp` 优先 + 保留一道中文兜底」，但不是每处都改。** 逐处判定见 §5：**3 处必改**（生产代码 `huntService.ts:69`、`:337`；断言 `rv3:132`）、**2 处必须改但改法不同**（`huntService.test.ts:255` 是在测试里复刻实现，应改为**直接调用产品函数**而不是再写一遍正则；`rv9:69` 的选择器应改为 `editOp === "delete"`，否则批五十一改文案后它已经选不中「移动误删」这类目标了）。

6. **上批三处成果复核：① 部分成立（5/7 修好，2 处新病句残留）② 成立 ③ 不成立（病句未归零，实测 5 案）。**
   - **① 跨 span 修正**：批五十二声称「7 处全修」，实测 **7 处里 5 处已消除，但 `hunt-when-vs-as-soon` 与 `hunt-close-23` 产生了新的相邻重复「As as」**（`soon → as soon as` 在原 token 位置整段替换，而原 token 前面本来就有一个 `As`）。**这两处是 pre-existing**（HEAD 版本同样存在），不是批五十二引入的，但批五十二的「判据」没能覆盖它们。
   - **② 两个冗余错点**：**成立**。`hunt-slept` 与 `hunt-looking-forward-weekend` 各删 1 个错点（4→3），`went went` / `to to` 类的相邻重复确实消失。
   - **③ 全库病句归零**：**不成立**。批五十二口径下的三项（相邻重复 / 含中文 / 修正==原词）确实全为 0：**但那个「0」是口径造成的**——它用的是**朴素 `===` 相邻比较**，而两处残留是 `As` 与 `as`（大小写不同），朴素比较**看不见**。改用「忽略大小写 + 去标点」口径：**相邻重复 2 处**。此外还有 **8 处跨 span span 残留**（产物含 `it is it` / `he is he` / `the key is the key` / `a dress a beautiful dress` / `a house an old house` / `better good`）与 **12 处标点被吞**。**三项归零的准确表述应为：「三项在朴素口径下为 0；放宽为忽略大小写后有 2 处相邻重复；另有 20 处其他形态缺陷未被该口径覆盖」。**

7. **最不确定的一点**：`insert` 与 `replace` 的**边界是词序子序列判据**，而这条判据对「改正词与错词共用同一个词」的条目会误判方向。最典型是 `hunt-team-message#20`（`original="think she will not"`、`correction="not"`）：`correction` 只有一个词、比 `original` 短，我判为 `replace`，但**语义上它是「把 not 留下、把 think she will 删掉」**——按 ERRANT 是 `U:`（unnecessary，删多余词）而不是 `R:`。这类「多词 original + 单/少词 correction」共 **8 处**（就是那 8 处跨 span 条目），**它们的正确操作类型我无法从数据层唯一确定**——必须由人工在回填时逐条判定。这直接影响 `editOp` 的回填质量，也是我唯一建议「回填后必须人工复核这 8 条」的理由。

---

## ② ERRANT 操作层的复核与枚举建议

### 2.1 你上批的论据：成立，但有一处需要纠正

**成立的部分**：「ERRANT 把操作层与子类层分离，本项目 `tag` 对应子类层、缺的正是操作层」——**完全正确**，且比上批表述得更有力，因为我现在拿到了原始文献。

**需要纠正的部分**：上批把 `M/U/R` 与 `WO / ORTH` 说成同一层里的并列项（「把『操作层』（M 替换/U 插入/R 删除）与『子类层』（WO 换位 / ORTH 标点大小写 / VERB:TENSE 等）分离」），紧接着又说「缺的正是操作层」。这两句合看没问题，但如果落地时照「5 个并列枚举」实现（`"replace" | "insert" | "delete" | "move" | "orth"`，即上批的方案 A），就**把 ERRANT 的两层压成了一层**——最直接的证据是 `R:WO`：WO 是挂在 R 前缀下的**子类**，不是与 R 并列的操作。本批的枚举建议**接受这个压缩**（理由见 2.4），但必须把「为什么可以压」写清楚。

### 2.2 原文依据（逐字引用，含页码）

来源：Christopher Bryant, *Automatic Annotation and Evaluation of Error Types for Grammatical Error Correction*, UCAM-CL-TR-938（ERRANT README 第 9 行明确指引：「In particular, **see Chapter 5 for definitions of error types**」）。

**§5.3.1 Operation tier（p.72）**：

> 「All edits are minimally classiﬁed in terms of edit operation; i.e. whether tokens are missing (M), replaced (R) or unnecessary (U) (Table 5.3).」

**§5.3.1 继续（p.73）——这条正是本项目第 51/52 批踩过的坑，ERRANT 也踩过**：

> 「A special case concerns edits such as [Man→ The man] or [The man→ Man], which ostensibly look like replacement edits, but actually denote missing or unnecessary words. We hence treat them as such and **ignore the orthographic case change**.」

即：**「看起来像替换、其实是插入/删除」是一个已知的、必须在分类器里特判的形态**。本项目的 `happy → is happy` 就是这个形态，而现有代码把它当替换处理——**恰好**得到正确结果（因为 `correction` 自含原词），但这是巧合，不是设计。

**Table 5.3 The forms of edits in terms of operation（p.73）**：

| Type | Form |
|---|---|
| Missing | `[ε→ B]` |
| Replacement | `[A→ B]` |
| Unnecessary | `[A→ ε]` |

**Table 5.2（p.72）——三层结构的原文标题**：

> 「**Operation Tier**」（列头：Type / Missing / Unnecessary / Replacement）
> 「**Part Of Speech Tier**」（行：`M:ADJ U:ADJ R:ADJ` … `M:PUNCT U:PUNCT R:PUNCT`）
> 「**Token Tier**」（行：Contraction `M:CONTR U:CONTR R:CONTR`；Morphology `- - R:MORPH`；**Orthography `- - R:ORTH`**；Other `M:OTHER U:OTHER R:OTHER`；Spelling `- - R:SPELL`；**Word Order `- - R:WO`**）
> 「**Morphology Tier**」（行：`R:ADJ:FORM`、`R:NOUN:INFL`、`R:NOUN:NUM`、`M/U/R:NOUN:POSS`、`M/U/R:VERB:FORM`、`R:VERB:INFL`、`R:VERB:SVA`、`M/U/R:VERB:TENSE`）
> 「Table 5.2: There are **55 total possible error types**. This table shows all of them except UNK, which indicates an uncorrected error. **A dash indicates an impossible combination.**」

**⇒ 对两个关键问题的直接回答：**

| 问题 | 答案 |
|---|---|
| `M/U/R` 与 `WO`/`ORTH` 是并列还是两层？ | **两层。** `M/U/R` 是操作层（3 值），`WO`/`ORTH` 是子类层（挂在 R 下，即 `R:WO` / `R:ORTH`）。**它们不能并列成同一个联合类型**——`WO` 的完整类型名是 `R:WO`，单独写 `"wo"` 会丢掉操作信息。 |
| `R:WO` / `R:ORTH` 的完整含义 | `R:WO` = **在同一操作（替换）下、词集完全相同仅顺序不同**；`R:ORTH` = **同一操作下、仅大小写/空白不同**。两者都被 ERRANT 归入 R 列，因为原侧非空、新侧非空。 |

**§5.3.3 Word Order: WO（p.77）逐字**：

> 「We restrict our deﬁnition of word order errors to **only include edits whose tokens exactly match on both sides of the edit**; e.g. [house white→ white house]. We also investigated allowing majority matches, e.g. [ I saw the man → the man saw me ], but found **exact matches were qualitatively more reliable in practice**.」
> 「1. The alphabetically sorted lists of lower cased tokens on both sides of the edit are identical.」

**⇒ 这就是我上批判据的来源，也是本项目 5 处纯英文同词集重排（`is it → it is`）算移动的依据。ERRANT 自己明确否决了「多数匹配」（majority matches）——这支持「`is it → it is` 算 WO、但 `think she will not → not` 不算」的分界。**

**§5.3.3 Orthography: ORTH（p.76）逐字**：

> 「Although the deﬁnition of orthography can be quite broad, we use it here to **only refer to edits that involve case and/or whitespace changes**; e.g. [ﬁrst→ First] or [Bestfriend→ best friend].」
> 「1. The lower cased form of both sides of the edit **with all whitespace removed** results in the same string.」

**⇒ 这是本批最重要的口径发现：ERRANT 的 `ORTH` 严格排除标点。** 上批把「13 条补标点 + 1 条改首字母」合成一个「只改标点/大小写 14 条」的类，但按 ERRANT 口径：**只有 1 条是 `R:ORTH`**（`may → May`，`hunt-birthday-list#14`），**13 条是标点改动，ERRANT 会把它们归到 `R:PUNCT`（Part Of Speech Tier 的标点行）而不是 `R:ORTH`**。而且 ERRANT 的 `R:PUNCT` 定义里还专门有一条 rule 处理「标点变化连带上一个词大小写变化」（p.75：「The following special PUNCT rule captures edits where a change in punctuation also affects the case of the following word」）——本项目 `hunt-nice-day#6`（`day? → day!`）正属此类。

**§5.3.1 关于 `UNK`（p.73）**：

> 「Finally, any gold edit of the form [A→ A] or [ε→ ε] is labelled **Unknown (UNK)**, since it ultimately has no effect on the text. These are normally gold edits that humans detected, but were unable or unsure how to correct.」

**⇒ 本项目正需要这个值**：全库有 **2 处**「`correction` 是纯中文位置说明、无法机械执行」——`hunt-would-rather-walk#6`（`（rather 跟在 would 后）`）与 `hunt-prefer-tea#7`（`（drink → drinking 或去掉）`）。ERRANT 用一个显式的「已知但无法执行」档位表达它们，而不是靠下游正则兜底。

**交叉验证（v3.x 实现层）**：`errant/commands` 的评估器带 `-cat {1,2,3}` 开关，README 逐字：「The `-cat {1,2,3}` flag can be used to **evaluate error types at increasing levels of granularity**」——**granularity 分级是 ERRANT 的一等公民**，这从工具接口层再次证明分层不是论文里的说辞。

### 2.3 插入类型核实：**存在，且是第二大操作类型**

**方法**：判据为「把两侧按标点/撇号剥离、小写、切词后，`original` 的全部词**按原序连续出现**在 `correction` 里，且 `correction` 词数更多」；多出的词按位置分方向。

**结果（794 条错点，213 案）**：

| 形态 | 数量 | 例 |
|---|---|---|
| **补在原词之前** | **67** | `happy → is happy`；`at → is at`；`few → a few`；`nice → a nice` |
| **补在原词之后** | **17** | `next → next to`；`soon → as soon as`（此条为「两头补」中的后置变体）；`most → Most of`；`need → need to` |
| **两头补** | **2** | `soon → as soon as`（`hunt-when-vs-as-soon#6`、`hunt-close-23#10`） |
| **插入型合计** | **86** | 涉及 **70 案** |
| 词数变多但词序对不上（应为 `replace`） | 3 | `many → a lot of`；`don't → am not`；`must → had to` |

**补词词表（top）**：`to`×16、`is`×13、`a`×8、`am`×7、`as`×7、`the`×5、`of`×5、`it`×4、`I`×4、`will`×3、`was`×2、`were`×2、`who`×2、`does`×2、`like`×2（其余各 1）。

**「它现在被归在哪一类里？」——答案是：被归进 10 个不同的 `tag`，且没有任何一个 tag 表示「插入」**：

```
missing_be     21        ← 最集中（少个 be，补进去）
fragment       18        ← 少主语/少连词，补一块
word_order     15        ← 少 of/to/like（如 None → None of）
article        12        ← 少 a/the
preposition     8        ← 少 to
verb_form       6        ← 少 to
tense           3        ← 少 will
comparison      2        ← 少 the
run_on          1        ← 少 and
```

**⚠️ 一个必须写进文档的发现：现有 `correctedSentenceOf` 对插入型的处理「恰好」是对的，但机制是错的。**

我用「只把该 `tokenIndex` 的 token 换成 `correction`」这一现有机制，对 86 处插入型逐条试算：**86/86 全部安全，零相邻重复**。原因是 `correction` 自含原词（`is happy` 里的 `happy` 就是原词），所以整段塞回同一个槽位得到的就是正确结果。

**但这不是「插入」被正确实现了，而是「替换」的语义恰好覆盖了它**——因为本项目的插入全部是「原位扩展」而非「在空位相邻处插入」。**代价是**：一旦有人写出真正的「纯插入」（`correction` 不含原词，如 `original="happy"`、`correction="so happy"` —— 字面上这就是替换），下游无法区分。**这正是 `editOp` 存在的意义：把「靠 `correction` 恰好含原词」的巧合，变成可断言的合同。**

### 2.4 枚举建议（可直接落地）

**建议的枚举：7 值，英文小写下划线命名。**

```ts
/**
 * 「怎么改」——操作层（机器可读）。
 *
 * 对齐 ERRANT 的操作层（Bryant 2019, UCAM-CL-TR-938, Table 5.2：
 * 「All edits are minimally classified in terms of edit operation; i.e. whether
 * tokens are missing (M), replaced (R) or unnecessary (U)」）——
 * 但**不是它的复刻**，因为本项目的 `correction` 是「人写给人看的说明」而非
 * 「对齐后的编辑对」，两者形态不同（详见 §2.2 / §2.4 的偏离说明）。
 *
 * 与 `tag` 的分工：`tag` 答「这是什么错」（子类层，11 值，教学命名）；
 * `editOp` 答「这一处机械上该怎么改」（操作层，7 值，分派用）。
 * 典型反例证明两者不可互推：
 *   - tag=word_order 的 95 条里，真删 / 移动 / 替换 都有（10 / 22 / 63）。
 *   - tag=verb_form 的 162 条里，delete 31 条（「去掉 to」）与 insert 6 条（补 to）并存。
 */
export type HuntEditOp =
  /** 换词：该槽位原词整体换掉，新文本不含原词或仅含其变形。
   *  判据：非空、非中文指令、非插入、非移动、非纯标点。
   *  例：move → moved；many → a lot of；must → had to。
   *  下游：tokens[i] = correction（保留原尾标点）。 */
  | "replace"
  /** 原位扩展（本项目口径）：correction = 新增词 + 原词（或 原词 + 新增词），
   *  original 的全部词按原序出现在 correction 里且 correction 更长。
   *  ⚠️ 在 ERRANT 里这属 R: 而非 M:（M 是 [ε→B] 原侧为空），不要照抄。
   *  例：happy → is happy（补在前 67）；next → next to（补在后 17）；soon → as soon as（两头 2）。
   *  下游：与 replace 同（因 correction 自含原词，整槽替换即正确）。 */
  | "insert"
  /** 删除：该槽位整个移除。
   *  判据：correction 以「去掉」「删」开头（含「（去掉 X）」括注式）。
   *  例：so → 去掉 so；to → （去掉 to）。
   *  下游：tokens.splice(i, 1)。 */
  | "delete"
  /** 换位：原词**不删**，只是位置要换到别处；correction 里的「去掉」是历史文案噪音。
   *  判据（二分）：① 中文位移指令（移到/放到/对调/互换/搬到/调换/顺序调整）；
   *                ② 两侧去标点小写后词集完全相同（sorted 相等）但序不同
   *                   —— 即 ERRANT §5.3.3 的 R:WO 判据原文
   *                   「The alphabetically sorted lists of lower cased tokens on both
   *                    sides of the edit are identical.」
   *  例：white.（在 cat 后）→ 把 white 移到 cat 前面（22 处中的 17 处）；
   *      is it → it is（5 处，无中文提示，只能靠词集判据认出）。
   *  ⚠️ 下游**不要执行**（见 §4）：保持原词不动，由 explanation 讲。
   *  绝不能当 delete —— 那会产出跨句粘句病句（批五十一实测）。 */
  | "move"
  /** 大小写/空白（ERRANT R:ORTH 严格口径）：
   *  「The lower cased form of both sides of the edit with all whitespace removed
   *   results in the same string.」
   *  例：may → May（全库仅 1 处，hunt-birthday-list#14）。
   *  下游：tokens[i] = correction（**必须连同 correction 的大小写一起写回**）。 */
  | "orth"
  /** 标点（ERRANT 归 R:PUNCT，非 R:ORTH）：
   *  只动标点，字母一个没变。含「补句内逗号」「改句末标点」「补句末句号」。
   *  例：eat → eat,（run_on 断句，8 处）；swim → swim.（补句末句号，3 处）；day? → day!（1 处）。
   *  ⚠️ 下游必须**用 correction 自己的尾标点覆盖**原 token 的尾标点，
   *  否则修正会被吞（实测 12 处被吞，见 §5.4）。
   *  另注：hunt-id-like-tea#0「Id → I'd」是撇号补入，ERRANT 归 R:CONTR；
   *  本项目只有 1 处，建议并入 punct 并在注释里点名，不单列值。 */
  | "punct"
  /** 已知有错、但 correction 是纯说明、**无法机械执行**（ERRANT 的 UNK 对应物）：
   *  「These are normally gold edits that humans detected, but were unable or unsure
   *   how to correct.」（UCAM-CL-TR-938 §5.3.1）
   *  判据：含汉字、且不含「去掉/删」、且不是位移指令。
   *  例：（rather 跟在 would 后）；（drink → drinking 或去掉）（仅 2 处）。
   *  下游：**保持原词不动**，绝不把中文写回句子。 */
  | "explain";
```

**判据阶梯（必须按此优先级，命中即停；顺序不能换）**：

| 序 | 值 | 判据 | 为什么必须在这个位置 |
|---|---|---|---|
| 1 | `move` | 中文位移词，**或** 两侧 sorted 词集相等且序不同 | 有中文位移指令的条目**也**以「去掉」开头（`去掉（white 放到 cat 前面）`）；若先判 delete 就错 |
| 2 | `delete` | 以「去掉」「删」开头 | 必须在 insert 之前：`去掉 X` 剥掉前缀后剩 `X`，可能被误当插入 |
| 3 | `insert` | `original` 全部词按原序连续出现在 `correction` 里，且 `correction` 词数更多 | 必须在 orth/punct 之前：`is → is a` 词集不同，不冲突；但必须早于 replace |
| 4 | `orth` | 去全部空白后小写相同、且原值与修正值不同 | ERRANT 严格口径；**必须在 punct 之前**，否则 `day? → day!` 会被 punct 抢走（两者都「只动标点」） |
| 5 | `punct` | 去标点后相同、且原值与修正值不同 | 兜住 13 处标点改动 |
| 6 | `explain` | 含汉字（走到这里说明既不是位移、也不是删除） | 必须在 replace 之前，否则中文会被当替换文本写回句子 |
| 7 | `replace` | 其余 | 兜底 |

**全库分布（794 条，7 值闭合）**：

| editOp | 数量 | 占比 |
|---|---|---|
| `replace` | 608 | 76.6% |
| `insert` | 86 | 10.8% |
| `delete` | 62 | 7.8% |
| `move` | 22 | 2.8% |
| `punct` | 13 | 1.6% |
| `explain` | 2 | 0.3% |
| `orth` | 1 | 0.1% |
| **合计** | **794** | 100% |

**操作层 × 子类层交叉表**（两轴各自闭合于 794）：

| tag ＼ editOp | replace | insert | delete | move | orth | punct | explain | 合计 |
|---|---|---|---|---|---|---|---|---|
| article | 17 | 12 | 0 | 0 | 0 | 0 | 0 | 29 |
| comparison | 10 | 2 | 1 | 0 | 0 | 0 | 0 | 13 |
| fragment | 2 | 18 | 5 | 0 | 0 | 3 | 0 | 28 |
| missing_be | 5 | 21 | 0 | 0 | 0 | 0 | 0 | 26 |
| plural | 129 | 0 | 0 | 0 | 0 | 0 | 0 | 129 |
| preposition | 53 | 8 | 6 | 0 | 0 | 0 | 0 | 67 |
| run_on | 1 | 1 | 8 | 0 | 0 | 8 | 0 | 18 |
| sv_agreement | 143 | 0 | 0 | 0 | 0 | 0 | 0 | 143 |
| tense | 80 | 3 | 1 | 0 | 0 | 0 | 0 | 84 |
| verb_form | 124 | 6 | 31 | 0 | 0 | 0 | 1 | 162 |
| word_order | 44 | 15 | 10 | 22 | 1 | 2 | 1 | 95 |
| **合计** | **608** | **86** | **62** | **22** | **1** | **13** | **2** | **794** ✅ |

**表读法（三条最有信息量的）**：
- `word_order` 一行最能说明「`tag` 不能代理 `editOp`」：同一个 tag 下 6 种操作全都有（22 移动 / 15 插入 / 10 删除 / 44 替换 / 2 标点 / 1 大小写）。
- `plural` / `sv_agreement` 是**纯 replace**（129 + 143 = 272 条，全库最大两块）——它们可以安全缺省。
- `verb_form` 的 delete 31 条（「去掉 to」）比 replace 124 条更需要被单独标注。

**与上批方案 A 的三处差异（请按本批口径落地）**：

| 项 | 上批方案 A | 本批建议 | 理由 |
|---|---|---|---|
| 值数 | 5（`replace/insert/delete/move/orth`） | **7**（+`punct`、+`explain`） | `orth` 按 ERRANT 严格口径只有 1 处；把 13 处标点混进去会让「只改大小写」这个信号失效；`explain` 是 ERRANT `UNK` 的对应物，缺了它这 2 处无处安放 |
| `insert` 的含义 | 「插入」 | 「**原位扩展**」 | 全库无「纯插入」，若按 ERRANT 的 `[ε→B]` 定义会 0 命中 |
| 与 ERRANT 的关系 | 「对齐」 | 「**借鉴分层，不复刻值**」 | `insert` ≠ `M`；`punct` = ERRANT 的 `R:PUNCT`；`orth` = ERRANT 的 `R:ORTH` |

---

## ③ 跨源核查：还有谁做「操作层 + 子类层」双层？

**三个可访问来源，两个给到了逐字证据，一个只给到结构（如实说明）。**

### 3.1 ERRANT / UCAM-CL-TR-938（**最强来源：论文 + 实现双证**）

- **URL（可访问，HTTP 200）**：https://www.cl.cam.ac.uk/techreports/UCAM-CL-TR-938.pdf
- **URL（论文页）**：https://aclanthology.org/P17-1074/ ｜ https://www.aclweb.org/anthology/P17-1074/
- **URL（实现）**：https://github.com/chrisjbryant/errant ｜ 分类器：`errant/en/classifier.py`

**逐字引用 1（分层原文，§5.3.1, p.72）**：

> 「All edits are minimally classiﬁed in terms of edit operation; i.e. whether tokens are missing (M), replaced (R) or unnecessary (U) (Table 5.3).」

**逐字引用 2（三层表标题，Table 5.2, p.72）**：

> 「Operation Tier」/「Part Of Speech Tier」/「Token Tier」/「Morphology Tier」
> 「Table 5.2: There are 55 total possible error types. This table shows all of them except UNK, which indicates an uncorrected error. A dash indicates an impossible combination.」

**逐字引用 3（WO 判据，§5.3.3, p.77）**：

> 「We restrict our deﬁnition of word order errors to only include edits whose tokens exactly match on both sides of the edit; e.g. [house white→ white house]. We also investigated allowing majority matches, e.g. [ I saw the man → the man saw me ], but found exact matches were qualitatively more reliable in practice.」

**逐字引用 4（ORTH 判据，§5.3.3, p.76）**：

> 「Although the deﬁnition of orthography can be quite broad, we use it here to only refer to edits that involve case and/or whitespace changes; e.g. [ﬁrst→ First] or [Bestfriend→ best friend].」

**逐字引用 5（实现层，`errant/en/classifier.py` 的 `classify()`）**：

> ```python
> # Missing
> elif not edit.o_toks and edit.c_toks:
>     op = "M:"
> # Unnecessary
> elif edit.o_toks and not edit.c_toks:
>     op = "U:"
> # Replacement
> else:
>     op = "R:"
>     cat = get_two_sided_type(edit.o_toks, edit.c_toks)
> edit.type = op+cat
> ```
> 以及 `get_two_sided_type()` 里的：
> ```python
> # Orthography; i.e. whitespace and/or case errors.
> if only_orth_change(o_toks, c_toks): return "ORTH"
> # Word Order; only matches exact reordering.
> if exact_reordering(o_toks, c_toks): return "WO"
> ```

**⇒ 这是「操作层（3 值，前缀）+ 子类层（55 值，后缀）」双层的最硬证据：`op+cat` 字符串拼接就是两层结构本身。**

**逐字引用 6（granularity 是一等公民，README）**：

> 「The `-cat {1,2,3}` flag can be used to evaluate error types at **increasing levels of granularity**」

### 3.2 W3C ITS 2.0 Localization Quality Issue（**第二来源：同样是「分类 + 五要素」而非扁平枚举**）

- **URL（可访问）**：https://www.w3.org/TR/its20/

**逐字引用 1（Issue 由五个信息片组成，其中 Type 是分类器）**：

> 「The data category defines five pieces of information: Information Description Value Notes **Type** A classifier that groups similar issues into categories (for example to differentiate spelling errors from grammar errors). One of the values defined in list of type values. ITS 2.0-compliant tools that use these types MUST map their internal values to these types.」

**逐字引用 2（清单里有与 insert / delete 直接对应的值）**：

> 「**omission** — Necessary text has been omitted from the localization or source.」
> 「**addition** — The translated text contains inappropriate additions.」
> 「**duplication** — Content has been duplicated improperly.」（例：A section of the target text was **inadvertently copied twice** in a copy and paste operation.）
> 「**grammar** — The text contains a grammatical error (including errors of syntax and morphology).」

**⇒ 与本项目的关系（诚实说明）**：ITS 2.0 是**单层**（Type 是一层扁平枚举），**不是**双层。它对本批的价值有两点，都不是「双层设计」的证据：
1. **它是业内「错误类型值表」的互操作基准**——ITS 明确要求「ITS 2.0-compliant tools that use these types **MUST map their internal values to these types**」，所以如果本项目将来要导出错误类型（做数据交换 / 审计），这张表是目标格式。
2. **`omission` / `addition` / `duplication` 三个值恰好描述了本项目第 51/52 批的两类真实缺陷**：`as soon as` 在原 `As` 后重复 = `duplication`；`is it` → `it is` 产生的 `it is it` 也是 `duplication`。**这说明「产物级缺陷」在行业里有标准名字，可以用它做断言命名**（比 `同句重复实词` 更通用）。

**LanguageTool 侧（部分证据，如实说明）**：LanguageTool 官方开发文档 https://dev.languagetool.org/development-overview 逐字：

> 「The rules are best put into categories that describe their purpose, and allow to enable or disable a number of rules at the same time. When creating a category, you can use the **type attribute** to describe the type of the error **according to the Quality Issue Type from the W3 Internationalization Tag Set**. This will make integration of LT with other tools easier.」

**⇒ LanguageTool 用的是「category（可自定义、用于开关）+ type（映射到 W3C ITS 的固定值）」两个属性**——**这事实上就是一种双轨：自建分类 + 标准化类型**，与本项目「`tag`（自建教学命名）+ `editOp`（标准操作层）」的结构同构。**但我没能拿到 LT 的 `subId` / 内置 category id 列表**（`dev.languagetool.org/rule-editor` 返回 404，`development-overview` 里没有 `subId`/`TYPOS`/`GRAMMAR` 等字样）。**这一条我只给到「LT 确实把自定义分类与 W3C 标准类型分开」这一层，更细的层级结构我抓不到，不作断言。**

### 3.3 抓不到的来源（如实列出）

| 来源 | 尝试 | 结果 |
|---|---|---|
| ERRANT 论文 PDF（`aclanthology.org/W17-4305.pdf`） | WebFetch | **不支持 PDF 内容类型**；改用 tech report PDF + curl 下载 + pypdf 提取成功 |
| ERRANT 技术报告 HTML 版 | 探测 | 200 但内容为 PDF 页壳 |
| `dev.languagetool.org/rule-editor` | WebFetch | **HTTP 404** |
| PyPI `errant` 页 | WebFetch | 被 Cloudflare「Client Challenge」拦下 |
| `raw.githubusercontent.com/.../classifier.py` | curl | 超时；**改用 GitHub contents API（base64 解码）成功** |
| ITS 2.0 附录 C 的完整枚举 | 页面解析 | 附录 C 的**值定义正文抓到了**（omission/addition/grammar/…），但页内锚点 `lqissue-typevalues` 指向的是 8.16 定义节，**完整 13 值清单页未逐条打印**，故本报告只引用抓到的 4 个值 |

**结论：双层设计不是我编的——ERRANT 有论文 + 源码双证；LanguageTool 有「自建 category + W3C 标准 type」的官方说明；ITS 2.0 是单层但提供了值表与「duplication」这类可直接借用的缺陷命名。**

---

## ④ 移动型处置建议：**不真执行移动**

### 4.1 现状确认（先厘清，因为它和上批描述不同）

上批报告描述 `correctedSentenceOf` 对「15/17 处移动执行了 splice 删词」。**批五十一改文案后现状已变**：

| 移动型分支 | 数量 | 现状 |
|---|---|---|
| 中文位移指令 → 走「含中文 ⇒ 保持原样」 | **17** | ✅ 不再误删（原词保留），但也没修正 |
| 纯英文同词集重排 → 走「整段替换」 | **5** | ❌ 跨 span 替换，产生 `it is it` / `he is he` / `the key is the key` |
| **合计** | **22** | **无一处得到正确结果** |
| 仍有 1 处以「去掉（」开头 → 走 splice 删词 | **1** | ❌ `hunt-umbrella-owner#5`（`去掉（this book 顺序调整：…)`）**是全库唯一残留的「移动被当删除」** |

**⇒ 批五十一的文案模板只改到了 16/17 处，漏了 `hunt-umbrella-owner#5`。** 它现在的产物是 `Whose book is this? Whose book is?`——`this` 被删掉了，第二句缺词。这是全库**唯一一处仍在执行「移动当删除」**的条目，**建议本批顺手改它的 `correction` 文案**（改成 `把 this 移到句末`），成本一行。

### 4.2 加「移动」支持的成本与风险（实测）

我实现了「把 X 拿下、插到 Y 前/后」的机械搬运，对 12 处可解析的模板逐条试算：

| 结果 | 数量 | 说明 |
|---|---|---|
| 解析失败（找不到 X 或 Y） | 2 | `hunt-handout-note#8`（Y = `the glue`，句中实际是 `the` `glue` 两 token，模板写成一个短语）；`hunt-run-plan#8`（Y = `a week`，同理） |
| 机械搬运后**产物仍不合法** | 10 | 标点归属错乱（`a white. cat`）、跨句粘连（`I like tea. too My brother...`）、多余句号（`both Books are good.`） |
| 机械搬运后完全正确 | **0** | — |
| 「把 X 移到 Y 前/后」模板合计 | 12 | 其余 10 处为「对调 / 搬到 / 顺序调整」等自由文案，**结构各不相同、无法用统一模板解析** |

**失败的两个根因（都不是实现细节，是模型缺陷）**：
1. **标点归属没有模型**。`white.` 的句末句号属于「这句的末尾」而不是「white 这个 token」；把它挪到 `cat` 前面必须把句号留下、并给新的句末补标点。当前 token 数组是「词 + 尾标点」耦合结构，**移动必然破坏它**。
2. **Y 可能是多 token**。`the glue` / `a week` 在 `tokens` 里是两格，模板写成一个短语——**要正确解析必须先做短语→span 的映射**，而那正是 §6 里导致 8 处跨 span 缺陷的同一个问题。

**风险清单**：
- 引入 span 模型 → 触及 `tokens` / `tokenIndex` / `original` 三者的既有合同（`tokenIndex` 现在语义混乱：**8 处跨 span 里 6 处指向首词、2 处指向末词**，见 §6.2），**改动面会扩散到判题（`findErrorAt` 按 `tokenIndex` 精确匹配）、埋点、错词本**。
- 产出病句的风险**高于现状**：现状是「保持原样（未修正的错句）」，机械搬运后是「看似改了但改坏的句子」——后者更危险，因为用户会把它当正句抄进错词本。

### 4.3 建议：**保持现状（不执行移动）**，但做两件事

**建议（明确）**：**不真执行移动。** 三条理由：

1. **收益为零**：产物现状已经是「原词保留」——对 17 处中文位移指令来说，这**不是缺陷**（用户的错词本例句是「未修正的错句」，且 `pickCorrectionWord` 对这 17 处**全部返回空串**，它们根本不会进错词本，所以这 17 处**对用户不可见**）。
2. **成本与风险都高**：需要 span 模型 + 标点重分配（见 4.2），会波及判题与埋点。
3. **教学上不需要**：`explanation` 已经把规则讲清（「『怎么样』的词要站在东西前面：a white cat」），**用户读得懂、也能自己写出正确句**。让机器硬改反而可能改错，削弱可信度。

**但要做的两件事**：

- **事 1（必须）**：给这 22 处打 `editOp: "move"` 标注。**这不是为了执行移动，而是为了让下游「知道不能执行」**——现在下游是「**因为 `correction` 恰好含中文、恰好含 `对调`，所以碰巧跳过**」，这是巧合；标注后变成合同。
- **事 2（低成本高收益）**：把那 5 处**纯英文同词集重排**（`is it → it is` 等，无中文外壳）单独处理——它们**现在走的是「整段替换」并产生最严重的产物缺陷**（`it is it`）。既然不执行移动，**唯一正确的处理是「这 5 处也不改」**（与中文那 17 处一致），因为它们的 `original` 跨 span，按单槽替换必然残留。**这会让 3 个案件（`hunt-key-clue` / `hunt-lost-dog` / `hunt-class-intro`）的病句消失**，代价是那 3 处的句子保持未修正状态——**这是纯粹的改进**（病句 → 未修正的错句）。

**⚠️ 顺带发现（与「移动」无关，但比移动更严重）**：`correctedSentenceOf` 的尾标点保留逻辑：

```ts
const trailing = /([.,!?;:]+)$/.exec(tokens[index])?.[1] ?? "";
tokens[index] = `${correction.replace(/[.,!?;:]+$/, "")}${trailing}`;
```

**它把 `correction` 自己的尾标点剥掉、再贴上原 token 的尾标点**。这对 `move → moved` 是对的（保留原句的 `,`），但对 `punct` 型是**灾难**：`eat → eat,` 的逗号被剥掉、贴回原 token 的空尾标点 ⇒ **逗号丢失，`run_on` 的断句修正完全失效**。实测 **12 处被吞**：

```
hunt-before-dinner#8    eat → eat,        （产物：Before I eat I wash…，逗号没了）
hunt-sunny-run#3        sunny → sunny,    （产物：When it is sunny I run，逗号没了）
hunt-after-school-talk#17 sunny → sunny,  （8 处 run_on 补逗号全部失效）
hunt-two-screens#17     reading → reading,
hunt-story-parts#13     reading → reading,
hunt-phone-story#6      reading → reading,
hunt-but-vs-although#11 raining → raining,
hunt-close-22#11        raining → raining,
hunt-why-dont-you-rest#13 swim → swim.    （补句末句号，丢了）
hunt-in-order-to-bus#17   test → test.
hunt-so-do-i#11           dance → dance.
hunt-would-rather-walk#14 home → home.
```

**这是本批新发现的独立缺陷，优先级建议高于 `editOp` 落地本身**——修法一行（`editOp === "punct"` 时用 `correction` 自己的尾标点，不借用原 token 的）。

---

## ⑤ 5 处「靠字面猜」的改造方案（含缺省值风险评估）

### 5.1 5 处的现状与改造建议

| # | 位置 | 现表达式 | 现在选中 | 建议改法 | 优先级 |
|---|---|---|---|---|---|
| 1 | `src/services/huntService.ts:69`（`pickCorrectionWord`） | `trimmed.startsWith("去掉")` | **54 条**（含 1 条移动 `hunt-umbrella-owner#5`，靠 `huntService.ts:74` 的「`（` 开头且 `）` 结尾」第二道挡掉——但那条**不以 `（` 开头**，所以**实际漏了**） | 改读 `editOp === "delete"`；**保留**「含中文 ⇒ 返回空串」**作为第二道兜底**（防未来新写法的中文说明） | **高** |
| 2 | `src/services/huntService.ts:337`（`correctedSentenceOf`） | `/^（?去掉\|去掉/` | **64 条**（含 1 条移动） | 改为 `switch (editOp)`：`delete→splice`、`orth/punct→用 correction 自身尾标点`、`explain→continue`、`move→continue`（不执行）、`insert/replace→整槽替换`；**保留**「含中文 ⇒ `continue`」**作为兜底** | **高** |
| 3 | `src/services/huntService.test.ts:255` | `/^（?去掉/`（**在测试里复刻了一份实现**） | 64 条 | **不要改成读 `editOp`——直接删掉这段复刻，改为调用 `correctedSentenceOf(caseItem)` 并断言两者相等**。理由：测试里复刻实现 = 两份必须同步的真相源；本次两个正则已经**同步过一次**（上批改文案时两处一起改），下次一定会漏 | **高** |
| 4 | `src/edge/verify/rv3-free-type-anchor.test.tsx:132` | `/^（?去掉/` | **63 条**（跳过逐位比对） | 改为 `if (error.editOp === "delete") continue;`。**必须改，否则它测不出任何东西**：它用与生产代码**同一个正则**判断「哪些错点要跳过比对」，所以生产代码错它也错——**这个测试对本次缺陷零覆盖**（上批报告已指出，本批确认仍成立） | **高** |
| 5 | `src/edge/verify/rv9-hunt-card-corrected.test.ts:69` | `startsWith("去掉") \|\| includes("（去掉")` | **63 条** = 54（`startsWith("去掉")`）+ 9（仅 `includes("（去掉")`，即「（去掉 to）」那批）。**仍选中 1 条移动**——`hunt-umbrella-owner#5`（它以 `去掉（` 开头，`startsWith("去掉")` 成立） | 改为 `editOp === "delete"`；且 `:111` 的 `!/^（?去掉/` 也应改 | **中** |

**⚠️ 站点 5 是全库唯一「仍把移动当删除」的地方。** 该测试的断言是「删词后句子应比原文短」：

```ts
const caseWithDeletion = huntCases.find((item) =>
  item.errors.some((error) => error.correction.trim().startsWith("去掉") || error.correction.includes("（去掉"))
);
expect(data.cards[0].front.split(/\s+/).length).toBeLessThan(caseWithDeletion!.tokens.length);
```

它选中的是**全库第一个**命中该条件的案件，即 `hunt-because-so`（真删词型）⇒ 断言本身当前正确。**但 `hunt-umbrella-owner` 同样命中该条件**，若它在数组里排到前面，断言会选到一个**移动案**、并因为「移动被误删后句子确实变短」而**继续通过**——**即上批指出的「错误固化」并未解除，只是被「恰好没选中」掩盖。** 改为 `editOp === "delete"` 后，选择器才与「删词型」这个语义绑定。

### 5.2 缺省值风险评估（你特别问的那件事）

**你的问题**：「如果 `editOp` 缺省（没写的都当替换），那 13 处移动型与 13 处括注式会不会又被误当成替换？」

**精确回答（分四种情形，逐个说）**：

| 缺省当 `replace` 的条目 | 数量 | 后果 | 严重度 |
|---|---|---|---|
| **`delete`** | **62** | ❌ **把「去掉 so」当替换文本写回句子** ⇒ `I was tired 去掉 so I went home.` 这类严重病句。**62 处会全错。** | **致命** |
| **`move`（中文位移，17 处）** | 17 | ⚠️ **不会**（当且仅当保留「含中文 ⇒ 跳过」兜底）。若**同时删掉中文兜底**，则会把 `把 white 移到 cat 前面` 整段写进句子 ⇒ 中文混入卡片正面，`rv9` 的「卡正面不得混入中文」断言会立刻红。 | 高（有兜底则无） |
| **`move`（纯英文重排，5 处）** | 5 | ❌ **会，而且现在就是这样**——它们字面是「多词 → 多词」，缺省当替换**正是当前行为**，产物 `it is it` / `he is he` / `the key is the key`。**中文兜底对它们完全无效**（不含中文）。 | **致命** |
| **`explain`（2 处）** | 2 | ⚠️ 同中文移动：靠中文兜底挡住 | 低 |
| **`punct`（13 处）** | 13 | ⚠️ **无害但不生效**：整槽替换是对的，但尾标点借用逻辑会把 `correction` 的标点吞掉（§4.3 的 12 处） | 中（独立缺陷） |
| **`insert`（86 处）** | 86 | ✅ **无害**：`correction` 自含原词，整槽替换即正确（实测 86/86 安全） | 无 |
| **`orth`（1 处）** | 1 | ✅ **无害**：`may → May` 整槽替换正确 | 无 |
| **`replace`（608 处）** | 608 | ✅ 本义 | 无 |

**⇒ 结论：缺省当 `replace` 会错 84 处（62 delete + 17 中文 move + 5 英文 move），占全库 10.6%。**

**所以：`editOp` 不能设计成「可选、缺省按替换回退」的单轨制。** 上批方案 A 写的是：

> 「`editOp?: ...`，缺省时下游应按 `correction` 文案回退推断。」

**这条建议在本项目行不通**，因为「回退推断」就等于「继续靠字面猜」——**那 5 处纯英文重排永远猜不出来**（它们没有任何字面特征），而它们正是产物缺陷最严重的一批。

**我的建议（三选一，推荐第 1 个）**：

**方案 ①（推荐）：字段可选 + 但「回退推断」只允许推断出 `replace`/`insert`/`punct`/`orth`，四个「危险值」必须显式写。**
```ts
/** 缺省 = 按 correction 形态自动判定，但**只可能判成这 4 个安全值**：
 *  replace / insert / punct / orth。
 *  delete / move / explain 三个值**必须显式写出**（它们无法从字面可靠推断，
 *  且推断错的后果是病句），缺失时下游按「不修改该处」处理并记一条告警。 */
editOp?: HuntEditOp;
```
- **回填量最小**：只需显式标 **84 条**（62 delete + 22 move）+ 2 条 explain = **86 条**，占全库 10.8%。其余 708 条可缺省。
- **失败安全**：缺省路径只可能产出安全值；三个危险值缺失时**默认不动**（保守），而不是猜。
- **可渐进**：第一版只标 86 条；将来新增条目若忘标，产物不会变病句（最坏是该处未修正）。

**方案 ②：字段必填，全量回填 794 条。**
- ✅ 最强合同、无歧义
- ❌ 回填 794 条（其中 8 处跨 span 需人工判定，见 §7）
- ❌ 新增条目忘填会**编译不过**（TypeScript 可选→必填是破坏性改动），但这也是一种保护

**方案 ③：不引入字段，只改文案模板（把 5 处纯英文重排的 `correction` 也改成中文说明）。**
- ✅ 零类型改动
- ❌ **治标**：靠「含中文 ⇒ 跳过」这条兜底继续活着；且 `correction` 变成中文后，**判题反馈卡（用户可见）会显示中文指令而不是英文修正**——`hunt-verdict-correction` 渲染 `original → correction`，用户看到「is it → （语序要倒过来）」比看到 `is it → it is` 的教学价值更低
- ❌ 未来新增条目仍会自由发挥

**⇒ 明确建议：方案 ①。**

### 5.3 「保留兜底」的具体建议

**保留，但把兜底降级为「告警 + 保守不动」，不要再拿它当主路径。**

```ts
// correctedSentenceOf 里的分支（改造后）
switch (error.editOp ?? inferSafeOp(error)) {   // inferSafeOp 只会返回 4 个安全值
  case "delete":  tokens.splice(index, 1); break;
  case "move":
  case "explain":  /* 保持原词不动；move 由 explanation 讲 */ break;
  case "punct":
  case "orth":    tokens[index] = error.correction.trim(); break;  // ← 用 correction 自己的标点
  case "insert":
  case "replace": { const trailing = TAIL.exec(tokens[index])?.[1] ?? "";
                    tokens[index] = error.correction.trim().replace(TAIL, "") + trailing; break; }
}
```

**三道兜底（按优先级）**：
1. **`editOp` 缺失 + 推断不确定 → 不动**（保守）：宁可留一个未修正的错句，也不产病句。
2. **`/[\u4e00-\u9fa5]/` 检查 → `continue`**：防未来新写法的中文说明。**这条必须保留**，它是「数据层写错时」的最后一道闸。**但要加一句告警**（开发期断言：`editOp` 明确时不该走到这里）。
3. **产物自检**（新增，建议）：`correctedSentenceOf` 返回前断言产物无相邻重复词（按忽略大小写+去标点口径）。**这条能挡住本批发现的全部 2 处相邻重复 + 5 处跨 span 残留的多数形态**，而且它是「产物级」判据、不依赖数据标注是否完整——**比 `editOp` 更根本**。

### 5.4 改造顺序（建议）

1. **先修独立缺陷**（不依赖 `editOp`，立刻能验证）：
   - ① `hunt-umbrella-owner#5` 的 `correction` 文案（1 行）
   - ② 尾标点吞掉（`punct` 型用 `correction` 自己的标点）——**修掉 12 处**
   - ③ 产物自检断言（挡住相邻重复）
2. **再加字段 + 回填 86 条**（`delete` 62 + `move` 22 + `explain` 2）
3. **最后改 5 处消费方**（改完跑 `rv3`/`rv9`/`h1`/`h2` 确认）
4. **顺带**：把 `types.ts` 里 `HuntError.correction` 的文档表（现在写「删除 55 / 括注式 13」，与实测 62 / 13 不符）与本批新表同步

---

## ⑥ 上批三处成果复核（node 类型化读取，未用 grep）

### 6.1 复核①：7 处跨 span 修正 —— **部分成立（5/7）**

**批五十二声称**：「5 处 `correction` 改为单 token 形式；删除 2 个冗余错点（`hunt-slept#19`、`hunt-looking-forward-weekend#9`）」，表格列出 7 处。

**逐条复核**（用 `git show HEAD:src/data/huntCases.ts` 对比现状）：

| 案#下标 | 原 correction | 现状 | 判定 |
|---|---|---|---|
| `hunt-team-message#20` | `don't think she will` | `"not"`（原词在 idx=20，值正确） | ✅ **已消**（产 `I think she will not be late.`） |
| `hunt-frequency-habit#7` | `always goes` | `"goes"` | ✅ **已消**（产 `Lily goes always to the library`——语序仍错但**不是病句**。⚠️ 代价见 §8.1-2：`tag=word_order` 声称的「语序」在数据层已无指令表达） |
| `hunt-question-words#16` | `did you lose` | `"lose"` | ✅ **已消**（产 `When you lose it?`——疑问语序未修，但未产生重复） |
| `hunt-not-used-to#5` | `去掉 You（Are 搬句首）` | `"把 Are 搬到 You 前面"` | ✅ **已消**（改文案后走「含中文⇒不动」，`You are used to the noise?` 保持原样，**不再丢主语**） |
| `hunt-so-that-early#5` | `so that` | `"that"` | ✅ **已消**（产 `in order that you can rest`，可接受） |
| `hunt-slept#19` | `went home` | **错点已删**（4→3 个错点） | ✅ **已消**（`They went home yesterday.` 正确） |
| `hunt-looking-forward-weekend#9` | `forward to` | **错点已删**（4→3 个错点） | ✅ **已消**（`I looking forward to the weekend.` 无 `to to`） |

**⇒ 7/7 上表条目都已消除。但复核时发现 2 处新形态的同类缺陷（HEAD 已存在，非本批引入）**：

```
[152]hunt-when-vs-as-soon   原文: When I finish, I eat. As soon I finish, I will eat. …
                            产物: When I finish, I will eat. As as soon as I finish, I will eat. …
                                  ↑ 相邻重复「As as」
[153]hunt-close-23          原文: As soon as I will finish, I will eat. As soon I finish, I will eat. …
                            产物: As soon as I finish, I will eat. As as soon as I finish, I will eat. …
                                  ↑ 相邻重复「As as」
```

**成因**：`hunt-when-vs-as-soon#6` / `hunt-close-23#10` 的 `original="soon"`、`correction="as soon as"`。原句 `As soon I finish` 里 `soon` 前已有一个 `As`；把 `soon` 这一槽整段换成 `as soon as` ⇒ `As` + `as soon as` = **`As as soon as`**。**这正是批五十二自己在 §3.1 总结的判据（「correction 含了相邻位置的词」）——只是这两处的相邻词是 `As`（大写），朴素比较没看出来。**

**⇒ 复核结论：批五十二的 7 处修复都成功，但它宣称的「全库病句归零」（见复核③）不成立，因为这 2 处是同一形态、被口径漏掉。**

### 6.2 复核②：2 个冗余错点已删 —— **成立**

```
hunt-slept                    HEAD: 4 个错点（含 idx=19 'went home'）
                              NOW : 3 个错点（idx=1 sleeped/slept；14 have/has；18 go/went）
                              产物: I slept well last night. She slept late and was sleeping at eight. He has two book. They went home yesterday.
                                    ↑ went home 正确了，不再 went went
hunt-looking-forward-weekend  HEAD: 4 个错点（含 idx=9 'forward to'）
                              NOW : 3 个错点（idx=2 look/looking；15 go/went；20 box./boxes.）
                              产物: I am looking forward to the weekend. I looking forward to the weekend. Yesterday I went home. We have two boxes.
                                    ↑ forward to 正确了，不再 to to
```

✅ **两处均成立**：错点各减 1，目标重复词消失。

⚠️ **但两个案子的产物仍含「未登记错」**（不是本批范围，仅记录）：
- `hunt-slept` 产物 `He has two book.`——`two book` 缺复数 -s，**该处未登记为错点**，×2 案（`hunt-slept` / `hunt-gave`）同形。
- `hunt-looking-forward-weekend` 产物 `I looking forward to the weekend.`——`I looking` 缺 be 动词，**该处未登记**。

### 6.3 复核③：全库病句归零 —— **不成立（口径问题）**

**批五十二的验证表**：

| 项 | 批五十二结果 | 我的复核（同口径） | 我的复核（放宽口径） |
|---|---|---|---|
| 相邻重复词 | 2 → 0 | **0**（朴素 `t[i] === t[i-1]`） | **2**（忽略大小写+标点） |
| 含中文 | 0 | **0** ✅ | 0 ✅ |
| 修正==原词（冗余错点） | 2 → 0 | **0**（严格） / 1（忽略大小写） | 1（`hunt-birthday-list#14` `may→May`，**这是真修正，不算缺陷**）✅ |

**⇒ 「相邻重复 2 → 0」的那两个「2」，被替换成了另外 2 处（`As as`）——数字恰好回到 2，但案件不同。**

**为什么朴素比较看不见**：`As` vs `as` 首字母大小写不同，`t[i] === t[i-1]` 为 `false`。**建议把断言口径写死为「忽略大小写 + 去标点」**，否则这类缺陷会持续漏检。

### 6.4 复核③的扩展：我另外发现的产物缺陷（批五十二口径未覆盖）

**用真实 `correctedSentenceOf` 全库扫描，另发现 3 类：**

**A. 跨 span 残留（8 处）**——`correction` 被塞进单个 `tokenIndex` 槽位，但 `original` 覆盖多词：

| 案#下标 | original → correction | 产物片段 |
|---|---|---|
| `hunt-word-order#4` | `a dress beautiful` → `a beautiful dress` | `She bought a dress a beautiful dress.` |
| `hunt-word-order#9` | `a house old` → `an old house` | `We visited a house an old house near the river.` |
| `hunt-photo-compare#26` | `more good` → `better` | `This photo is better good than that.` |
| `hunt-key-clue#13` | `is it` → `it is` | `I don't know where it is it.` |
| `hunt-key-clue#19` | `is the key` → `the key is` | `Do you know where the key is the key?` |
| `hunt-lost-dog#9` | `is he` → `he is` | `We don't know where he is he.` |
| `hunt-team-message#20` | `think she will not` → `not` | `I think she will not be late.`（此条**恰好正确**，因新值已在原位） |
| `hunt-class-intro#7` | `is he` → `he is` | `I know where he is he.` |

**`tokenIndex` 语义在这些条目上不一致（重要发现）**：

| 案#下标 | `tokenIndex` 指向 | span 覆盖 |
|---|---|---|
| `hunt-word-order#4` | **末词**（`beautiful.`） | ✗ 向后不匹配 |
| `hunt-word-order#9` | **末词**（`old`） | ✗ |
| `hunt-photo-compare#26` | **首词**（`more`） | ✓ |
| `hunt-key-clue#13/19` | **首词**（`is`） | ✗（尾标点差异） |
| `hunt-lost-dog#9` | **首词**（`is`） | ✗ |
| `hunt-team-message#20` | **末词**（`not`） | ✗（实为 `not be late.`） |
| `hunt-class-intro#7` | **首词**（`is`） | ✗ |

**⇒ 8 处里 6 处指向首词、2 处指向末词——`tokenIndex` 对跨 span 条目没有统一语义。** 这是 `types.ts` 文档里「tokenIndex 指向 tokens 的下标」这句话的**实质性缺口**，也是「移动该不该机械执行」这个问题的真正难点（§4.2 的 Y 找不到，同一个根因）。

**B. 标点被吞（12 处）**——见 §4.3 全列。**这是本批新发现，优先级最高。**

**C. 产物中仍有「未登记错」（抽查，非穷尽）**——用两个高置信模式扫描 12 案：

| 模式 | 未登记处数 | 例 |
|---|---|---|
| `two/three/both + 单数可数名词` | 9 | `hunt-slept`: `He has two book.`；`hunt-swam-sang`: `He has two cat.`；`hunt-late-note`: `two alarm clocks`（此条**误报**，实为 `two alarm clocks` 正确） |
| `He/She/It + 动词原形` | 4 | `hunt-seat-plan`: `She go to…`；`hunt-waited-an-hour`: `She have two book.` |
| 涉及案件 | **12** | `hunt-late-note / hunt-key-clue / hunt-family-photo / hunt-cleaned-board / hunt-help-note / hunt-seat-plan / hunt-waited-an-hour / hunt-both-and-sing / hunt-so-do-i / hunt-close-27-row / hunt-swam-sang / hunt-slept` |

⚠️ **这一项要谨慎对待**：这些是「案件题面里的其他句子本来就含错、但没被登记为错点」——**可能是设计意图**（案件故意混入未登录的干扰错，或不要求全部改对）。**我没有找到明确的设计说明支持或否定**，所以只作记录、不作缺陷认定。**但它的后果是实实在在的：产物（错词本例句 / 复习卡正面）里带着未修正的错形**——这与 `correctedSentenceOf` 的文档（「把案件题面的错句按 errors 修正成正确句」）有落差，建议产品侧明确「产物是否要求完全正确」。

---

## ⑦ 自我核查记录

**本报告用到的全部脚本（均已在交付前删除，避免污染仓库）**：

| 脚本 | 用途 |
|---|---|
| `scripts/_tmp_editop_audit.ts` | 794 条逐条分类（含中文/移动/插入候选全列） |
| `scripts/_tmp_editop_insert.ts` / `_insert2.ts` / `_insert3.ts` | 插入型方向与安全性（67/17/2、86/86 安全） |
| `scripts/_tmp_editop_verify52.ts` | 上批三处成果复核（含 HEAD 对比） |
| `scripts/_tmp_editop_real.ts` | 用**真实导出的** `correctedSentenceOf` / `pickCorrectionWord` 扫描 |
| `scripts/_tmp_editop_defects.ts` / `_precise.ts` / `_residue.ts` | 产物缺陷三类（相邻重复 / 同句重复 / 跨 span 残留） |
| `scripts/_tmp_editop_punct.ts` / `_punct2.ts` | 尾标点吞掉的量化（12 处） |
| `scripts/_tmp_editop_classify.ts` / `_classify2.ts` / `_recon.ts` | 操作层分类三版（含一次优先级 bug 的修正，见下） |
| `scripts/_tmp_editop_sites.ts` | 5 处字面猜各自的命中条数（54/64/64/63/63） |
| `scripts/_tmp_editop_moveexec.ts` | 移动机械执行试算（10/12 产病句） |
| `scripts/_tmp_editop_casecheck.ts` / `_unreg.ts` / `_two.ts` / `_movecases.ts` | 大小写口径、未登记错、单案专项 |

**一次自我纠错（记录在案）**：`_classify.ts` 第一版把「`去掉 so`」判成了 `orth`——因为「去掉 so」与「so」去标点小写后**字母序列确实相同**（我的判据没剥「去掉」前缀）。结果 `delete=0, orth=78`。`_classify2.ts` 修正为**严格优先级阶梯**（`move > delete > insert > orth > punct > explain > replace`），得到 `replace 608 / insert 86 / delete 62 / move 22 / punct 13 / explain 2 / orth 1`。**报告采用修正后的数字。**

**未使用 grep 的证明**：所有数据读取均通过 `import { huntCases } from "../src/data/huntCases"`（vite-node 类型化加载 TS 源码）+ `git show HEAD:src/data/huntCases.ts` 导出到 `/tmp` 后用 `python3` 解析。搜索类操作（找 5 处字面猜的位置、找 `去掉` 字样）用 `/Applications/ZCode.app/Contents/Resources/tools/ripgrep/rg`（ripgrep 14.1.1），**未用本地 `grep`**。

**测试全量运行**（确认我的分析不破坏既有断言，且我引用的现状可用）：

```
Test Files  1 failed | 233 passed (234)
Tests       1 failed | 2484 passed (2485)
Duration    53.32s
```

唯一失败：`src/edge/verify/kb4-arrange-keyboard.test.tsx > KB4-7`
`expected '0 / 5 块 · 点词块选上、再点取消' to contain '拖动'`
**与本报告主题（`editOp` / hunt 数据）无关**，是拼装区文案与 `aria` 测试不同步的独立问题（发生在 `src/pages/` 的课程交互层）。**我做的 5 处字面猜改造建议尚未落到代码，故不影响。**

**关键数字的核验链**（都能用同一脚本复现）：

| 数字 | 来源判据 |
|---|---|
| 794 条 / 213 案 | 直接遍历 `huntCases`，`sum(errors.length)` |
| 插入 86（67 前 / 17 后 / 2 两头 / 3 不对齐） | 词序子序列匹配 |
| 移动 22（17 中文 + 5 同词集） | 中文位移词表 + `sorted(tokens)` 相等判据（ERRANT R:WO 原文口径） |
| 删除 62 | `^（?去掉\|^（?删` |
| 标点 13 / 大小写 1 | 去标点后相同 / 去空白后小写相同 |
| 缺省当 replace 会错 84 | 62 + 22 |
| 5 处站点命中 54 / 64 / 64 / 63 / 63 | 分别施加各站点的原正则 |
| 产物缺陷：相邻重复 2 / 跨 span 残留 8 / 标点被吞 12 | 真实 `correctedSentenceOf` 产物 |

---

## ⑧ 不确定项

**按「会不会影响落地决策」排序，只列真不确定的。**

### 8.1 会直接影响回填质量（**高**）

1. **8 处跨 span 条目的 `editOp` 无法从数据层唯一确定。** 它们是「多词 `original` + 单/少词 `correction`」，按长度判据落到 `replace`，但语义上可能是 `U:`（删多余词，如 `hunt-team-message#20` 的 `think she will not → not`）。**这 8 条必须人工判定**，我的机器分类在其中至少 1 条（`hunt-team-message#20`）语义存疑。**建议：回填时把这 8 条单独列出，由课程作者逐条标注。**

2. **`hunt-frequency-habit#7` 的「教学点」与「机械修正」已脱钩（我第一版把它的 tag 记成了 `sv_agreement`，复核后确认是 `word_order`，特此更正）。** 该条 `tag="word_order"`（**标对了**）、`original="go"`、`correction="goes"`，讲解是「频率『怎么做』的词站在动词前面：always goes；『他/她』一个还要加 -s」。**问题在 `correction`**：`goes` 只表达了 -s（三单）那一半，`always` 的位置那一半**在数据层没有任何指令**——产物 `Lily goes always to the library` 里 `always` 仍站错位置，而 `tag=word_order` 声称这里已修好。**我不知道这是有意简化还是妥协**：若要修，应把 `correction` 改回`always goes`（但那样会跨 span、又踩回批五十二的病句）——**或者把该条的 `tag` 改为 `sv_agreement` 并接受「语序错不登记」**。两条路都有代价，**需要产品侧拍板**，我不建议机器替它决定。

### 8.2 会影响方案选择（**中**）

3. **`editOp` 是可选还是必填，取决于「新增数据的流程有多少人工」。** 我推荐「可选 + 危险值必填」（§5.2 方案①），但**这个建议依赖一个我不知道的前提**：新增 hunt 案的流程里，是「作者手写 `correction` 后有人复核」还是「批量生成后抽样」？若是前者，必填更安全；若是后者，可选 + 产物自检更现实。

4. **产物是否要求「完全正确」？** §6.4-C 的 12 案产物含未登记错。**如果产品要求错词本例句必须是完全正确的英文，那这 12 案都是缺陷**（修法是补登记错点或改走「只改本卡针对的那一处」）；**如果不要求**，它们就只是设计容忍。**我在仓库里找不到明确说明**——`correctedSentenceOf` 的注释说「把该案的全部植错都改正后返回」，但没说「植错之外还可能有未登记的错」。

### 8.3 外部来源的局限（**低，但影响引用强度**）

5. **LanguageTool 的层级结构我只拿到一半证据。** 我确认了它「自建 `category` + 映射 W3C ITS `type`」，但**没拿到内置 category id 清单，也没拿到 `subId` 的文档**（`rule-editor` 页 404）。所以本报告**没有**把 LanguageTool 作为「双层设计」的第二个独立证据，只把它作为「自建分类 + 标准类型双轨」的旁证。**如果你需要这一条更硬的证据，我可以另起一批专门抓 Languagetool 的 `org/languagetool/rules/*.xml` 里的 category 定义。**

6. **ITS 2.0 的完整 13 值清单未逐条打印。** 我抓到了 `omission` / `addition` / `duplication` / `grammar` / `terminology` / `mistranslation` / `untranslated` / `inconsistency` / `legal` / `register` / `locale-specific-content` / `locale-violation` / `style` 等值及其定义（正文解析成功），但**页面附录 C 的锚点指向与正文不重合**，我未能确认「恰好 13 个值」这个总数。**故本报告只引用抓到的值，不说总数。**

7. **`hunt-umbrella-owner#5` 的 `correction` 是全库唯一未统一文案的移动。** 我建议改文案（改成 `把 this 移到句末`），但**它的 `original="this"`、`tokenIndex=5`，而真错是整句语序（`Whose this book is?` → `Whose book is this?`）**——改文案只能让它走「含中文 ⇒ 不动」分支（产物 `Whose book is?`，**缺词**），**不能修复该句**。修好它需要登记一条跨 span 的错点。**这属于数据修复，超出本批（竞品分析）范围，我只报不改。**

---

## 附：本报告与上批结论的差异清单（便于交叉核对）

| 项 | 上批（五十一）说法 | 本批（五十三）实测/引用 | 差异性质 |
|---|---|---|---|
| `M/U/R` 与 `WO/ORTH` 的关系 | 「操作层」与「子类层」分离（未说清是否并列） | **两层**：`M/U/R` 3 值操作层 + 55 值子类层，`WO/ORTH` 挂在 R 下（`R:WO`/`R:ORTH`） | **口径精确化**（有原文 Table 5.2 佐证） |
| 枚举建议 | 5 值 `replace/insert/delete/move/orth` | **7 值**（+`punct` +`explain`；`orth` 收窄为「仅大小写/空白」） | **修正**（ERRANT §5.3.3 原文：ORTH 排除标点） |
| 移动总数 | 22（L1 13 + L2 2 + L3 2 + L4 5） | **22** ✅ 复现（中文位移 17 + 同词集 5） | 一致 |
| 「13 处移动」 | 「最窄口径，只数 L1」 | **L1 现为 17**（批五十一改文案后中文位移指令的检测口径变宽） | 口径随文案变化，非矛盾 |
| 标点/大小写 | 「14 条（13 补标点 + 1 首字母）」 | ✅ 14 复现，但**按 ERRANT 应拆**：13 标点（`R:PUNCT`）+ 1 大小写（`R:ORTH`） | **分类修正** |
| 插入总数 | 90 | **86**（67 前 + 17 后 + 2 两头），另 3 处词序不匹配归 replace | **修正**（口径更严） |
| 总条目 | 796 | **794**（批五十二删 2 个冗余错点） | 数据变更 |
| 移动的下游后果 | 「15/17 执行 splice 删除 ⇒ 跨句残破」 | **已变**：17 处走「含中文⇒不动」（✅ 不再误删），5 处纯英文走「整段替换」（❌ `it is it`），**1 处仍误删**（`hunt-umbrella-owner#5`） | **上批已部分修复，本批更新** |
| 全库病句 | （批五十二称归零） | **未归零**：相邻重复 2（忽略大小写口径）+ 跨 span 残留 8 + 标点被吞 12 | **纠正批五十二结论** |
