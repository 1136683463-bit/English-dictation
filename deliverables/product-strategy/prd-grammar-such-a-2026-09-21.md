# PRD · `such a`（这么…的一个）+ 三项修复

- 日期：2026-09-21
- 批次：第四十批
- 交付：L194 `It was such a big fish.` + 案 #203 + **三项修复**（L89 语义错误 / 错词本例句存错句 / pr1 断言把缺陷当契约）
- 性质：**质量批**——修复是本批主体，L194 是补上 L193 留的接口

---

## 0. 一句话

本批修掉一个**教错了的语法点**（L89 四处把 `a` 的位置说反）、一个**存错了的内容**（错词本 100% 的例句都是含错句）和一个**把缺陷当契约的断言**；然后兑现 L193 留下的 IOU，补上 `such a`。

---

## 1. 修复一：L89 把 `a` 的位置说反了（4 处）

### 1.1 缺陷

L89「多好的天啊」教 `What a + 东西`，核心错句是 `What nice day!`（缺 `a`）。但它的文案里**四处说「a 站在描写的词后面」**：

| 位置 | 原文 |
|---|---|
| `blocks[].role` | 「一个好天（a 站在那个「好」**后面**）」 |
| `oneLineRule` | 「What a + nice + day!（a 站在描写的词**后面**）」 |
| `contrast[1].whyZh` | 「而且 a 站在描写的词**后面**：What a nice day!」 |
| `summary.rule` | 「…——a 站在描写的词**后面**」 |

**客观事实**：`What a nice day!` 里 `a` 索引 1、`nice` 索引 2 ⇒ **`a` 在 `nice` 前面**。

更严重的是**同一课内部自相矛盾**：`guided` 的 explain 写的是正确的「a 站在描写的词**前面**、紧跟着 What」——一课里 4 处错、1 处对。

### 1.2 为什么现有守门抓不到

**这是语义错误，不是术语泄漏**。29 个红线词表和「全字段遍历零术语」断言都只查术语，抓不到「说反了」这类事实性错误。这是本项目第一次发现**语义层守门缺失**。

### 1.3 修法与验证

4 处统一改为「a 紧跟在 What 后面」（保留 `a` 在前的正确事实，同时说清它紧跟谁）。修后全库「a 站在…后面」= **0 处**，仅剩 1 处正确的「前面」表述。

---

## 2. 修复二：错词本例句 100% 是含错句

### 2.1 缺陷

用户为 `happy` 建错词卡，卡上的例句是：
```
My mother happy today because I called her from the station.
```
——**正是要改的那句错**。实测 **全库 202/202 案** 都是这样（不是部分）。

### 2.2 根因

`huntService.ts` 里 `correctedSentenceOf()` **已经写好了完整的修正逻辑**，注释里还写着「同一类错误已在句子卡路径修过」——但它**没有 export**，所以 `GrammarHuntPage.tsx:326` 只能退化成：

```ts
const sentence = activeCase.tokens.join(" ");   // ← 题面错句
```

### 2.3 修法（一行 + 一个 export）

```ts
// huntService.ts: 加 export
export const correctedSentenceOf = …

// GrammarHuntPage.tsx: 改用修正句
const sentence = correctedSentenceOf(activeCase);
```

### 2.4 连带修掉的一处数据错误

修复后暴露：`hunt-call-mother` 的第二个错点写作 `tokenIndex: 13, original: "glad", correction: "is glad"`，但 token 13 是 `very`（13 与 14 分别是 `very`/`glad`）。机械插入 `is` 得到 **`She very is glad`** 这个病句。

**修法**：插入点上移到 `very`（`tokenIndex: 12, original: "very", correction: "is very"`）——`is` 该插在 `very` 之前。修后修正句为 `She is very glad to hear my voice.` ✓

### 2.5 验证

| 项 | 修前 | 修后 |
|---|---|---|
| 例句是错句的案 | **202 / 202** | **0** |
| 修正句含中文垃圾 | — | 0 |
| 修正句含错序（`very is` 等） | 1 | **0** |

---

## 3. 修复三：`pr1` 断言把旧缺陷当契约

并发进程已把 `GRAMMAR_ERROR_TAG_PLAIN` 的 11 条全部改成零术语大白话（代码注释：「2026-09-21 术语清理」），但 `pr1-promises.test.tsx` 的两条断言还要求 plain **含**「主语」「形容词」：

```ts
expect(GRMAR_ZERO_TERMS_HIT(plain)).toEqual(expect.arrayContaining(["主语", "形容词"]));
expect(offenders.length).toBeGreaterThanOrEqual(6);   // 要求 6 个罪名含红线词
```

**这是「把缺陷写成契约」**——代码变好了，断言反而红。已反转为「全部罪名的 plain 都不得命中红线词」，并加了一条反向对照（`Object.keys(...).length >= 11`）防止词表变空导致断言恒真。

---

## 4. 内容：L194 `such a`

### 4.1 裁定：做 1 课，拒绝 `its` / `several` / `a bit`

两位研究结论**部分相反**（瑞思 2 课含 `its` / 竞析 1 课），我裁定做 1 课：

| 候选 | 裁定 | 理由 |
|---|---|---|
| `such a` | **做** | L193 的 `whyZh` 明写「`such` 后面跟的是「东西」（`such a strong wind`）——**那一格今天不碰**」；本批是兑现这个 IOU |
| `its` | **拒绝（本批）** | 我核实：库内 11 处 `its` **全部是 L87 的 `It's` 缩写坑的错项/干扰项**，正面用法确实为零（真缺口）。但它属**所属**族，与 `such a` 的**程度**族不同——按项目「单课 2-3 个点」红线不该硬塞。**登记为独立待办** |
| `several` | **拒绝** | 与 L114 的 `a few` 同格（换词）；正确回收口是 L114 补员 |
| `a bit` | **拒绝** | 牛津标 `especially British English`，是 `a little` 的随口版；程度轴 L66/L71/L76/L193 已占满 |

**竞析对 `such a` 体系归属的复核修正**：上一批判「属 Determiners 族、与程度线不同族」——**词类**是 Determiner（剑桥面包屑逐字），但**教学位**是程度/强调（BC 归 `Intensifiers` 专课；剑桥自写 `such (as a determiner) ... to add emphasis`）。5 家课程化来源**全部按教学位组织**，故它该与 `so` 对照教，这正是 L194 的做法。

### 4.2 设计

- **targetSentence**：`It was such a big fish.`（6 词，scene `island`，与 L193 的 9 词顺接，难度跳变 0）
- **核心增量**：**分清「这么」的两条路**——

| 后面跟什么 | 用谁 | 例 |
|---|---|---|
| 「有多…」那个词 | **so** | It was **so** big.（它这么大）|
| 「东西」 | **such a** | It was **such a** big fish.（这么大的一条鱼）|

给用户的自测判据：**有 `a` 就是 `such`**——`a` 站在 `such` 后面，`so` 后面从来不站 `a`。

- **3 条带标记错句**（都有剑桥/朗文逐字背书）：
  1. `a such` ❌（`It was a such big fish.`）
  2. `such` + 「有多…」❌（`It was such big.`）
  3. `so a` ❌（`It was so a big fish.`）
- **3 条双正解**：对照 L193 的 `so`（有多）、L89 的 `What a`（同一个 `a` 位置）、L87 的 `It's a…`（平着说 vs 带劲说）
- **与 L89 的关系**：**不同的坑**——L89 的 `What nice day!` 是**漏 `a`**（该有没有）；本课三条是**`a` 在、但站错位置**。
- **案件 #203「船边的渔获」**：4 处错 = `a such`→`such a`（word_order）· `so a`→`such a`（word_order）· `He go`→`goes`（L25 回流）· `I see`→`saw`（L10 回流）

---

## 5. 结构指标（守门全过）

| 项 | 值 |
|---|---|
| 对照卡 | 6（3 标记 + 3 双正解）|
| guided / practice | 6 / 5 |
| scene 合法 | ✓ island |
| 零术语（全字段 + 页面级） | 0 命中 |
| 难度闸门 | 逐级不跳超 5 词 ✓ |
| 独立核验 | **13 / 13** |
| **全量测试** | **1562 / 1562 全绿**（133 文件——本会话首次全绿）|

---

## 6. 方法学教训

1. **语义层守门是缺失的**。零术语红线只能抓「用了术语」，抓不到「说反了」。L89 那 4 处错误存活了很久，因为**没有任何断言检查事实正确性**。建议登记为待补：对「方向/位置/顺序」类表述加一致性检查（如同一课内不得出现互相矛盾的表述）。
2. **断言不得把缺陷当契约**。`pr1` 写「expect 命中数 >= 6」是把「6 个罪名含术语」这个缺陷固化成契约——代码修好后断言必然失败。**登记为审查项**：凡断言里出现「不少于 N 个缺陷」的写法都要复核。
3. **export 缺失会让好代码退化成兜底**。`correctedSentenceOf` 写得好好的，因为没 export，调用方只能 `tokens.join(" ")`——这类「实现了但没接上」的缺陷不报错、不红测试，只能靠人读出来。
4. **并发套件的失败要按「归属」而非「数量」判断**。本批 7 处失败里：2 处是我的（计数），1 处是数据增长（基线漂移），2 处是并发进程自己的时序不一致（代码改了断言没改），2 处已由它自愈。
