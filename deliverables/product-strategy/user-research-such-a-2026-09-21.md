# 用户研究 · 语法线「小美的一天」· `such a` + 冠词收口（第四十批）

**日期**：2026-09-21 ｜ **类型**：用户研究（语法线第四十批）｜ **研究员**：瑞思
**上游**：`roadmap-grammar-thirty-ninth-batch-2026-09-21.md:81`（逐字：`| 6 | \`such a\` | **降级登记** | 本批拒绝（与 L89 撞车 + 牛津标 A2），建议**与冠词收口课合并**，不单独立课 |`）
**本批候选**：`such a`（「这么…的一个」）＋ 冠词收口 ＋ 四个登记项（`its` 正例／`several` 刻度卡／`a bit`／`lots of`）

---

## 📌 结论摘要（先看这六条）

| # | 问题 | **裁定** |
|---|---|---|
**1** | `such a` 能不能做？ | **能做——做一课（L194），但【不与 `its` 合课，`its` 另开 L195】。** 三条带标记错句（`a such`／`such big`／`so a`）**全部凑得出来且分属三种独立机制**（见 §1.1），比上一批（批三十九）判断的「勉强够」**明显更好**。**批三十九的两条否决理由本批都不再成立**：①「与 L89 撞车」——本批逐项比对后判定**是不同坑**（§1.1.1）；②「牛津标 A2 比 `so...that` 的 A1 晚一级」——**`so...that` 已落地，A2 现在正是本项目的位置**。 |
**2** | 做几课？ | **2 课（L194 `such a`、L195 `its` 正例）**，**冠词收口不新开课**（见 §3）。 |
**3** | `such a` + `its` + `several` + `a bit` 是同一族吗？ | **不是同一族。是三族。** `such a`＝程度＋冠词（感叹/评价）／`its`＝所属（第 8 课 `my/her` 那批小标签缺的一员）／`several`＋`a bit`＝纯数量刻度。三者判据不同、错句机制不同、能装的句子不同——**强行合课＝一课四件事，违背项目「单课最多 2-3 个点」的历史（L191＝1 点、L192＝2 点）**。 |
**4** | 拒绝哪些？ | **明确拒绝 4 项**：①`several` 不单独立课（与 L114 `a few`、L167 `a lot of` 同格刻度，属「换词」）；②`a bit` 不单独立课（`a little` 已于 L114 教过，`a bit` 是它的随口版＝换词）；③`lots of` 不立课（全库唯一 1 处是 L167 的**错句选项**，属假命中）；④**`space` 场景仍不因本批启用**（本批两课的题材不需要它，详见 §3.4）。 |
**5** | ⚠️ **本批独立发现一个真缺陷** | **L89 全库自相矛盾**：「`a` 站在描写的词**后面**」出现 **5 处**、「`a` 站在描写的词**前面**」出现 **2 处**（含 L94 引用「第 89 课老规矩」）。**语法事实：`What a nice day!` 里 `a` 在 `nice` 前面**（索引 1 vs 2）。⇒ L89 有 5 处文案把位置说反了。**这直接影响本批 `such a` 的立课**——两课要教的是**同一条「`a` 站哪儿」的规矩**，若 L89 自己说错，`such a` 会把错误**教第二遍**。**建议：本批与 L194 同批修复 L89 的 5 处文案。** |
**6** | ⚠️ **数据文件在本会话期间被改写（已登记 + 一处自我更正）** | 实测 `wc -l` 从 38,686 → **38,696**、`md5` 三连采样有变化、**三处区段行号漂移 +6／+10／+26**（§0.1.1）。**⇒ 报告已按最终快照 `5f3ca56…` 全量二次定位行号（§5.12）。** ⚠️ **我中途据此写下过两条错误断言（「L94 新增 6 张卡」「16 张对比卡」），已在 §0.1.2 逐条更正并说明错因**（我的解析正则跨数组误匹配）。 |

**总进度**：**193 课／202 案／28 季**（本轮 `node` 实测，见 §5.3）。
**下一可用课号 = L194**；**下一可用案号 = 203**（实测 L194/L195 与案 203/204 均未占用）。

---

## §0 本轮实读口径声明

### 0.1 冻结快照（本轮实测）

| 文件 | 行数 | md5 | 内容 |
|---|---|---|---|
| `src/data/grammarLessons.ts` | **38,696** | `5f3ca562907db71591178dfd7e20f9c6` | **193 课** |
| `src/data/huntCases.ts` | **10,515** | — | **202 案** |
| `src/data/grammarSeasons.ts` | **74** | — | **28 季** |
| `src/components/AdventureScene.tsx` | — | — | 14 个合法场景 ID（逐字 `"campus", "city", "train", "lighthouse", "desert", "space", "ocean", "island", "mansion", "forest", "snow", "magic", "mystery", "sparkle"`） |

> **与任务书口径一致**（193 课／202 案／28 季）✅。课号 1..193 **连续、无缺号、无重号**（实测）；`lesson-194`／`lesson-195` 均未占用；案 203／204 未占用。

### ⚠️ 0.1.1 **本轮实测到数据文件在会话期间被改写（含一次自我更正）**

**观测事实（全部可复跑）**：

**事实 1 —— 文件在会话期间变长了。** 本批最开始的 `wc -l` 与结束时不同：

```bash
cd /Users/liujun/Documents/英语听写 && wc -l src/data/grammarLessons.ts
# 会话开始（本批第一次实测）: 38686 src/data/grammarLessons.ts
# 会话结束（本批最后一次）  : 38696 src/data/grammarLessons.ts
# ⇒ 净增 10 行
```

**事实 2 —— `md5` 在两次采样之间往复变化。**

```bash
cd /Users/liujun/Documents/英语听写 && for i in 1 2 3; do md5 -q src/data/grammarLessons.ts; sleep 4; done
# → 5f3ca562907db71591178dfd7e20f9c6
#   2680426b5c6e1c51eadae03c06a335f7   ← 中途变了
#   5f3ca562907db71591178dfd7e20f9c6   ← 又变回来
```

**事实 3 —— 三处区段的漂移量实测（并暴露了我自己的一处引用错误）。**

| 引文 | 会话早期**实测**值 | **最终实测**值 | 漂移 |
|---|---|---|---|
| L114 `a little 是「还有一点」` | `:21812` ✅实测过 | **:21818** | **+6** |
| L114 `sceneZh: "说还有一点牛奶"` | `:21804` ✅实测过 | **:21810** | **+6** |
| L167 `I have a lots of homework.` | `:32693` ✅实测过 | **:32703** | **+10** |
| L193 `wrong: "The wind was such strong…"` | `:38537` ✅实测过 | **:38547** | **+10** |
| L193 `wrongMark: "such"` | `:38538` ✅实测过 | **:38548** | **+10** |
| L193 `那一格今天不碰` | `:38540` ✅实测过 | **:38550** | **+10** |
| L8 `wrong: "This is I book."` | ⚠️ **`:1449` 从未实测**（我写的估计值） | **:1475** | — |

**⇒ 漂移量分两段，且与净增量吻合**：**L114 区 +6**、**L167/L193 区 +10** ⇒ **说明是两次插入（一次 6 行在 L114 之前、一次 4 行在 L114 与 L167 之间）**，6 + 4 = **10 = 全库净增行数** ✅ 自洽。

**⚠️ 上表最后一行是我必须自己认下的一处过程错误**：**L8 的 `:1449`／`:1473` 这两个行号我【从未实测过】就写进了报告的初稿**（我按 L8 的大致位置估的）。**实测真值是 `:1475`／`:1499`。** ⇒ **这不是并发改写造成的漂移，是我自己在没有实测的情况下写下了引用。** 报告最终版已改为实测值（§5.12 有复核记录），但**这个错误本身必须留痕**——它恰好演示了本报告反复强调的那条纪律：**任何行号引用都必须【全库检索后定位】，不能凭位置估计**。

**⇒ 有一条好消息**：**L89 区段（`:16890`–`:16981`）与本批所有 `its` 区段（`:16522`–`:16610`）在全部采样中【完全未变】** —— 即 **§1.2.1 的 L89 独立发现与 §1.3 的 `its` 缺口判定不受改写影响** ✅。

---

#### ⚠️ 0.1.2 **一处自我更正（必须登记，否则会误导写课方）**

**我在本轮中途曾写下两条断言，事后核对发现【两条都错】，现更正：**

| # | 我曾写下的（❌ 错） | **实测更正（✅ 对）** | 错因 |
|---|---|---|---|
| **1** | 「L94 的 `contrast` 从 6 张 → **16 张**」 | **L94 的 `contrast` 是 6 张**，与 L92／L93／L95／L96 完全一致（全部 6 张） | **我的解析脚本用了错的切分正则**（`/\n\s{6}\{\n/` 在该课匹配到了 `blocks`／`guided` 等其它 6 空格缩进的数组项），**把无关项也数进了 `contrast`**。修正后的口径是 `/\n      \{\n/` 并在 `contrast:` 与 `variants:` 之间切段 —— 实测 L94 `contrast` 块 42 行／**6 张卡**／带标记 2／双正解 3 |
| **2** | 「**并发进程在 L94 新增了** `wrong: "What nice day!"` 卡」 | **没有证据支持这条，我撤回它。** 现有证据反而指向该卡是 L94 的**原有设计**：①本批**会话早期**的一次全库关键词扫描逐字输出即为 `⚠已存在 GL=2 HC=0  What nice day!`（即当时已是 2 处）；②L94 的 `contrast` 结构（**6 张卡／带标记 2／双正解 3**）与 L92／L93／L95／L96 **完全一致**，看不出被插入的痕迹；③该卡的 `whyZh` 逐字 `第 89 课回流：a 不能丢` 是 L94 作为**收口课**的典型写法（收口课的本职就是回指前课）。**⇒ 我无法证明它是注入的，因此不能说它是。** | **我把「并发进程确实改过文件」（事实 1/2/3，成立）与「某个具体内容是它加的」（未核实）混为一谈**——**这是过度归因** |

**⇒ 更正后的结论（对写课方的实际影响）**：

1. **「漏 `a`」确实已被教【两遍】**（L89 `:16906` 立岗 ＋ L94 `:17881` 回流，逐字 `whyZh: "第 89 课回流：a 不能丢——What 【a】 nice day!"`）——**这一条与并发改写无关，是 L94 原本的设计**。
2. **⇒ §1.1.1 的纪律不变且更硬：L194 绝不能把「漏 `a`」再当错句**（那是全库第三遍）。
3. **L94 的对照卡设计质量不在本批评估范围**，且**本批没有证据说它有问题**。

**⇒ 我保留本节的理由**：**「一轮研究里我自己搞错过一次解析、并据此写下过错误断言」这件事本身需要留痕**——否则写课方会照着我最初的错误说法去核查 L94。**这正是「核查逐字引用不能只查被指认的那一课」这条纪律的价值所在。**

---

#### 0.1.3 **对后续批次的真正建议**

| # | 建议 | 依据 |
|---|---|---|
| **1** | **引文的稳定锚点是【逐字字符串】，不是行号** | 事实 3：行号在同一会话内实测漂移 +6／+10；**且我自己有一次「凭估计写行号」的失误（§0.1.2 上方）** |
| **2** | **任何研究报告的行号引用须标注快照 `md5`** | 本批快照 = `5f3ca56…`（38,696 行） |
| **3** | **全库词频统计必须排除并发注入的 `__*.tmp.test.ts`** | §0.4（该文件把候选词全列了一遍，使首轮统计虚高十几倍） |
| **4** | **切分课程内嵌数组时不要只用缩进正则**（`/\n\s{6}\{\n/` 会跨数组误匹配）；**须先用字段名（`contrast:`…`variants:`）切段** | §0.1.2 更正 1 —— 这正是我本轮犯的错 |
### 0.2 ⚠️ 任务书给的候选词表：**方向对，但两处必须修正**

| 任务书原文 | **本轮实测** | 判定 |
|---|---|---|
| `such a` / `such` 教学位 **0** | `such a` 教学位 **0**、`such` 教学位 **0** ✅ | ✅ **任务书对** |
| `such a` / `such` 全库 **5** | `such a` 全库 **1**、`such` 全库 **6**（**全部在 L193 一个课里**） | ⚠️ **数字对不上**——任务书写的 5 可能出自不同口径；**实测 6 处 `such` 全部在 L193**（§5.2 逐行） |
| `several` 教学位 0 / 全库 **0** | 教学位 **0** ✅、全库 **0** ✅ | ✅ **任务书对**（真词口径与宽口径都是 0） |
| `a bit` 教学位 0 / 全库 **0** | 教学位 **0** ✅、全库 **0** ✅ | ✅ **任务书对** |
| `so much` / `so many` **0** | 教学位 **0** ✅、全库 **0** ✅（`so few` / `so little` 也是 **0**） | ✅ **任务书对** |
| `its` 教学位 **0** / 全库 **5** | 教学位 **0** ✅ / 全库 **15** | ⚠️ **数字偏小 3 倍**，但**结论方向对**——`its` 确实**从未被正面教过**（§1.3 是硬证据） |
| `lots of` 全库 **1** | 全库 **1** ✅（`:32703` L167 `"I have a lots of homework."`——**这是错句选项，不是教学**） | ✅ **任务书对**（且本批判定它是**假命中**，见 §3.4） |
| `enough` 教学位 **4** / 全库 **59** | 教学位 **1 课**（L71，4 处）✅ / 全库 **81** | ⚠️ 数字偏小，**归属课对** |
| `what a` 教学位 **5** / 全库 **58** | 教学位 **2 课**（L89×3、L94×2）✅ / 全库 **69** | ⚠️ 数字偏小，**归属课对**（L89 是主课，L94 是收口课回指） |

**⇒ 方法学教训（延续批三十九）**：任务书给的「全库 N 处」一律**自己重数**。本轮唯一**实质性**的差异是 `its`：**15 处 vs 任务书 5 处**——而这 15 处的性质（全部是错例/干扰项/解释文字，**没有一处正面用法**）是本批 L195 立课的**唯一根据**，所以这个数字必须准确。

### 0.3 工具与口径

| 口径 | 定义 | 本批用途 |
|---|---|---|
| **真词口径**（唯一词频口径） | `(?<![A-Za-z-])词(?![A-Za-z-])`，`gi`——**连字符也算词内** | 全部词频、结构共现 |
| **课程块口径** | 按 `id: "lesson-…"` 回退到 `\n  {\n` 切块 | 逐课归因、行号引用 |
| **词表池口径**（逐字复刻 `grammarLessons.test.ts` 的 `buildPools`） | `targetSentence`＋`examples[].en`＋`blocks[].text`＋`dialogue[].en`＋`contrast.correct`＋`contrast.wrong`＋`variants[].en`＋`sceneSwings[].en`＋`guided[].answer`＋`guided[].tokens`＋`recall.answer`，**累计** | 「新词」判定（D 层） |

**脚本**（本轮落在 `/tmp/`，可复跑）：`/tmp/lib.js`（课程块索引＋行号＋真词正则）、`/tmp/selfcheck40.js`（§5 全部自核命令）、`/tmp/diff.js`（难度＋场景统计）、`/tmp/collide.js`（对**全库全部英文句**做 Jaccard 撞车）、`/tmp/pool2.js`（词表池首见课）、`/tmp/gate.js`（「错误用法首见课」检测）、`/tmp/cite.js`（逐字引用行号定位）。

> ⚠️ **本轮未用 `grep`**（任务书要求）：本地 `grep` 是 ugrep，上游已实测它对 `swim`／`room`／`want` 等词**假返回 0**，且失效「随词而变」。**全部词频走 node 词边界正则。**
> ⚠️ **本轮实测中发现 ugrep 另一个失效模式**：用 `grep -oE` 抓牛津 HTML 的 CEFR 标记时，ugrep 直接报错 `exceeds complexity limits`（§5.1 有记录）——**再次印证本项目的「不用 grep」纪律是对的**。

### 0.4 ⚠️ 一个必须扣除的污染源：并发进程的临时测试文件

本轮首次全库扫描时，`src/` 下存在另一个并发进程写入的临时文件 **`src/data/__r40.tmp.test.ts`**（3,288 字节，2026-09-21 22:21 写入），它把候选词**全部按字符串列了一遍**，导致首轮统计虚高：

```
首轮（含污染）           扣除后（真值）
several  TOTAL=106   →   several  TOTAL=0（grammarLessons 内 0）
such     TOTAL=144   →   such     TOTAL=6
a bit    TOTAL=4     →   a bit    TOTAL=0
```

**⇒ 本报告所有数字均已排除该文件。** 该文件属并发进程产物，**建议产品负责人清理**（不在本批职责内，仅登记）。

> 依据：`roadmap-grammar-thirty-ninth-batch-2026-09-21.md:52` 逐字 `测试文件从 91 涨到 **140**（新增 49 个诊断套件）| 全部 ?? 未跟踪` —— **并发进程会持续注入此类文件**，任何全库词频统计**必须显式排除 `__*.tmp.test.ts`**。

### 0.5 零术语口径

**红线词表 29 词**（`src/data/grammarZeroTerms.ts` 逐字）：主语／谓语／宾语／表语／定语／状语／单数／复数／三单／原形／时态／一般过去时／一般现在时／现在进行时／过去进行时／现在完成时／情态动词／比较级／最高级／从句／语序／可数／疑问句／否定句／被动语态／第三人称／形容词／副词／介词。

> ⚠️ **本批两个结构的头号术语风险**：`such a` 的语法书解释**必然说「such 修饰名词短语、so 修饰形容词」**；`its` 必然说「形容词性物主代词」——**全是红线词**。
> **实测项目自建替代词汇（可直接复用，全部有库内先例）**：
> - 「那个『怎么样』的词」**全库 61 处**（逐字先例 L193 `:38550` `后面跟的是「有多…」那个词（strong）`）
> - 「东西」= 名词（L89 逐字 `a 和东西摆上`）
> - 「小标签」= 物主词（L8 逐字 `my / your / his / her 是小标签，永远贴在东西或人的前面`）
> - 「描写的词」= 形容词（全库 22 处）
> - 「好几个」= 复数（L5 起，全库 65 处）
> **本轮为两个结构提议的家族名（均经红线自查，零术语 ✅）**：
> - `such a` → **`这么…的一个东西`**／中文锚 **`这么好的一个天`**
> - `its` → **`它的 · 小标签补最后一个`**

---

## §1 可做性判定（最重要）

### 1.1 `such a`：3 条带标记错句 —— **成立，且分属三种独立机制** ✅

本项目对照卡的标准水位是「**3 带标记错句 ＋ 3 双正解**」（实测：全库 80 课为 3+3，**近 8 课连续 3+3**，见 §5.6）。`such a` 的三条错句来自**三条互相独立的错误机制**：

| # | 带标记错句 | 标记 | 正解 | 中文母语者为什么会这么说（成因） |
|---|---|---|---|---|
| **S1** | **`It was a such big fish.`** | `a` | `It was such a big fish.` | **「一个」在中文里站「这么」后面，英语站 `such` 后面。** 中文「这么大的一条鱼」＝「这么」→「大」→「一条」→「鱼」；英语 `such a big fish`＝`such`→`a`→`big`→`fish`。中文的「一条」被挤到了「这么」和「大」**之间**，学习者按中文语序把 `a` 提前到 `such` 前面。**牛津/剑桥/Longman 三源独立点名这一条**（§4.3 引文 3、引文 5） |
| **S2** | **`It was such big.`** | `such` | `It was so big.` | **中文「这么」一个词管两头。** 「这么**大**」（后面跟「怎么样」，配 `so`）和「这么**大的一条鱼**」（后面跟东西，配 `such`）——中文侧**完全不区分**。学习者看到「这么」就选 `such`，句子里没有东西也跟着 `such`。**剑桥逐字点名**：`We use so , not such , before adjectives` / `Not: You're such kind .` |
| **S3** | **`It was so a big fish.`** | `so a` | `It was such a big fish.` | **与 S1 同源但方向相反：`so` 根本不能带 `a`。** 学习者知道这里要一个「一个」，也知道中文「这么」＝英语 `so`，于是把 `a` 挂在 `so` 后面——`so a big fish`。**剑桥逐字**：`Not: This is a so wonderful kitchen!`（注意剑桥给的错例是 `a so` 序，学习者实际产出 `so a` 与 `a so` 两种，**都源于「`so` 与 `a` 谁在前」这个中文侧不存在的问题**）｜**⚠️ 见下方「S1/S3 是否为同一坑」的裁定** |

**⇒ 判定：✅ 成立。** 三条错句机制独立（**`a` 的位置**／**`such` vs `so` 看后面跟什么**／**`so` 不能带 `a`**），且 **S1／S2 有三源逐字背书**。这是**优于批三十九判断的一组**——批三十九说「勉强够 3 条」，是因为它把 S1/S3 都归入「a 站哪儿」；**但本批细查后发现 S2 是真正独立的一条**（`such` vs `so` 的**选择**问题，与 `a` 的位置无关），**且它是剑桥典型错误节里排在最显眼位置的一条**。

#### ⚠️ 1.1.1 必须正面回答：S1／S3 与 L89 的 `What nice day!` 是**同一个坑**还是**不同坑**？

**任务书要求「必须区分」。逐字比对后的裁定：**

| 维度 | L89 的 `What nice day!`（`:16906`） | 本批 S1 `a such big fish` / S3 `so a big fish` |
|---|---|---|
| **错在哪里** | **漏了 `a`**（该有的没有） | **`a` 在，但站错了位置**（有的东西放错了地方） |
| **`a` 的数量** | 0 个 → 应该是 1 个 | 1 个 → 应该是 1 个（**数量对，位置错**） |
| **中文成因** | 中文「多好的天啊」**没有「一个」**——学习者不觉得需要 `a`（**漏员**） | 中文「这么大的一条鱼」**有「一条」**——学习者知道要 `a`，但按中文语序放（**错位**） |
| **用户的自我觉察** | **自查得出来**：`What nice day` 读起来缺一块砖 | **自查不出来**：`a such big fish` / `so a big fish` 读起来「顺」，因为 `a` 在那里、`such`/`so` 也在那里 |
| **修法** | **补一个词** | **换位置**（S1：`a` 移到 `such` 后；S3：把 `so` 换成 `such`） |
| **项目内是否已有同型先例** | 有（L89 自己的立岗错句） | **有，但不同课**：L3 `:?` `wrong: "I have a apple." mark="a"` 是**选错 a/an**；**「a 与程度词谁在前」在全库是 0**（§5.4 实测 `a so` / `so a` / `a such` 全部 GL=0） |

**⇒ 裁定：S1／S3 与 `What nice day!` 是【不同的坑】，可以同批共存，但必须靠判据切开。**

**为什么这次不判「换词」？** 依据批三十七判据（`「缺员若只让已知句型换一个动词，则它不是一课，它是一个词表项。」`）——**S1/S3 不是「换一个动词」，而是「同一个词换位置」**。本项目已处理过同型的「位置」课，且**判为独立课**：

- **L192**（`We walked through the forest and across the bridge.`）：`through`/`across` 中文**都译成「穿过」**，差别是**位置/路径**——立课 ✅
- **L191**（`She walked into the kitchen.`）：`into` vs `in`，中文都能说「在厨房里」——立课 ✅
- **L9**（`I go to the park.`）vs `go to school`（**不加 the**）：同一个 `to` 后面**带不带 the**——立课 ✅

**⇒ 同型先例三次，全部立课。S1/S3 属「位置/该不该带」类，立课 ✅。**

**但必须写明一条纪律**（给写课方）：**L194 的 `contrast` 卡不得把「漏 `a`」再当错句**——那是 L89 的坑（`:16906` 已判过），**重复判同一件事会让用户觉得「这课我学过」**。L194 的三条错句**必须全部是「位置」或「选择」错，不含「漏 a」**。

> **⚠️ 这条纪律比预想的更硬**：**L94 的回流卡已经在教第二遍「漏 `a`」**（`:17881` 逐字 `wrong: "What nice day!"` ／ `:17884` 逐字 `whyZh: "第 89 课回流：a 不能丢——What 【a】 nice day!"`）。**「漏 `a`」现在已在 L89 与 L94 教过两遍**——**L194 若再用它，就是全库第三遍。**

> **自查**：本批 S1（`a such`）／S2（`such` 该用 `so`）／S3（`so a`）**三条全部不含「漏 a」** ✅ —— 与 L89 的 `What nice day!`（`:16906`）**零重叠**，与 L94 的回流卡（`:17881`）**零重叠**。

### 1.2 ⚠️ 1.2.1 本批独立发现的真缺陷：**L89 把 `a` 的位置说反了 5 次**

**这是本批最重要的独立发现，且不在任务书的提示范围内。**

`What a nice day!` 里 `a` 相对 `nice` 的位置是**客观事实**：

```
What a nice day!  →  索引 0:What  1:a  2:nice  3:day
⇒ a 在 nice 【前】面（a 索引 1 < nice 索引 2）
```

**全库逐行实测**：

| 说法 | 行号 | 逐字 |
|---|---|---|
| **「a 站在描写的词后面」**（❌ 说反） | `:16890` | `{ text: "a nice day", role: "一个好天（a 站在那个「好」后面）" }` |
| 同上 ❌ | `:16892` | `oneLineRule: "…（a 站在描写的词后面）。"` |
| 同上 ❌ | `:16909` | `whyZh: "「一个天」要带 a——而且 a 站在描写的词后面：What a nice day!…"` |
| 同上 ❌ | `:16947` | `noteZh: "What a + 「怎么样」的词 + 东西——a 站那个词后面。"` |
| 同上 ❌ | `:16966` | `rule: "…（What a nice day!）——a 站在描写的词后面。"` |
| **「a 站在描写的词前面」**（✅ 说对） | `:16981` | `explain: "a 站在描写的词前面、紧跟着 What：What a nice day!"` |
| 同上 ✅ **（在 L94）** | `:17955` | `explain: "第 89 课老规矩：a 站描写的词前面——What a nice day!"` |

**统计**：**「后面」5 处 ／「前面」2 处** —— **同一课、同一句话，两种互相矛盾的说法并存**。

**⚠️ 危害评级：高。** 理由三条：

1. **它出现在 `blocks[].role`、`oneLineRule`、`summary.rule`、`variants[].noteZh`、`contrast.whyZh`** —— **全是首屏必读字段**（`grammarLessons.test.ts` 有专门的「全字段必读文案」断言在守这些字段），**用户一定看得到**。
2. **`:17955` 说明错误已经外溢**：L94 的 `explain` 引用「**第 89 课老规矩**：a 站描写的词**前面**」——**若写课方按 L89 的多数说法（5 处「后面」）为准，`such a` 会把「a 站 nice 后面」当规矩教第二遍**。
3. **零术语守门抓不到它**：`老规矩`／`描写的词`／`a 站` 都不在红线词表里，**29 词红线与全字段遍历断言都不会红**——这是个**语义错误**，不是术语错误。

**⇒ 裁定：本批建议与 L194 同批修复 L89 的 5 处 `后面` → `前面`。** 若产品负责人决定拆批，则 **L194 的 `oneLineRule` 必须自己把位置说对**，并在 `deepDive` 里显式纠偏（`第 89 课那几句话说反了，`a` 其实是站在描写的词前面的`）——**但不能指望用户看到纠偏**（deepDive 是折叠卡）。

> **对 L193 的连带影响（诚实登记）**：L193 `:38550` 逐字 `such 后面跟的是「东西」（such a strong wind 这么大的风）` ——**这句是对的**（`such` 后面跟的是「东西」这个整体，`a` 属于那个东西的一部分）。**L193 无需修改。**

### 1.3 `its`：**可做，且是本批最干净的一个缺口** ✅

**任务书提示「`its` 正例卡」。本轮实测确认这是一个真缺口，且证据比预期更硬：**

**全库 15 处 `its` 逐行分类**（`/tmp/selfcheck40.js` §C）：

| 类别 | 行号 | 逐字 |
|---|---|---|
| ★**对比卡错句** | `:16522` | `wrong: "Its cold today."` |
| 解释文字 | `:16523` | `wrongMark: "Its"` |
| 解释文字 | `:16570` | `"那一小撇很重要：It's 是「它是」的短版，Its 是「它的」——读起来一样，写法差一小撇，意思差一条街。写的时候记得把尾巴带上。"` |
| 解释文字 | `:16579` | `"Its ❌ —— 少一小撇就成了「它的」"` |
| ★**选项干扰** | `:16588` | `options: ["It's", "Its", "It"]` |
| ★**spot 题词块** | `:16610` | `tokens: ["Its", "cold", "today."]` |
| ★**spot 题错块** | `:16611` `:16612` | `wrongToken: "Its"` / `answer: "Its"` |
| ★**选项干扰** | `:16630` | `options: ["It's", "Its", "It is's"]` |
| ★**干扰项** | `:16639` `:16652` `:16665` `:16848` `:18004` `:18410` | `distractors: ["Its"]` |

**⇒ 关键结论：`its` 在全库 15 处，性质是【1 条错句 ＋ 1 处解释 ＋ 13 处干扰项】，正面用法 0 处。**

**「`its` 从未被正面教过」的硬证据**（`/tmp/gate.js` 实测）：

```
its     进词表池@L87   作为「正确用法」首见@L87
```

⚠️ **注意这个 `@L87` 是「词表池口径」的必然结果**：L87 的**错句** `wrong: "Its cold today."` 会进 `buildPools` 的词表池（`grammarLessons.test.ts` 的 `buildPools` 逐字包含 `addWord(contrast.wrong)`），所以 `its` **在形式上「被教过」**——但**教的是一句错话**。用户学到的是「`Its` 是错的」。

**⇒ 这是本项目**唯一一个「用户被告知某个词是错的、却从未被告知它是对的和怎么用」**的案例**（同类检查：`such` 进池也是靠 L193 的 `wrong:` 句，但 `such` 本批要立课；`several`／`a bit`／`lots` **连池都没进**，见 §3.4）。

**⇒ 判定：✅ 可做，且应做。** 三条带标记错句的候选（**全部实测全库为 0，§5.4**）：

| # | 带标记错句 | 标记 | 正解 | 中文成因 |
|---|---|---|---|---|
| **I1** | **`The cat is in it box.`** | `it` | `The cat is in its box.` | **中文「它的」是一个词，英语是两个词。** 中文「它」＋「的」＝「它的」，学习者记得「它」是 `it`，就直接把 `it` 贴到东西前面。**这是 L8 已判过的同型坑**——L8 `:1475` 逐字 `wrong: "This is I book." / wrongMark: "I"`（`I` 当标签用）、`:1499` 逐字 `wrong: "He name is Tom." / wrongMark: "He"`。**L8 教过 `my/your/his/her` 四个，但 `its` 是唯一没教的**（§5.5 实测 `their` 已在 L189 补齐，**`its` 是最后一块**） |
| **I2** | **`It's box is small.`** | `It's` | `Its box is small.` | **中文侧没有「撇号」这个概念**，而 `It's`／`Its` **读音完全相同**（`/ɪts/`）。学习者按「它是」＝`It's` 的规则，把 `It's` 贴到东西前面。**L87 已判过反方向的一条**（`:16522` `Its cold today.` → `It's cold today.`，标记 `Its`）——**本批是同一对混淆的另一个方向**（**⚠️ 见 §1.3.1 的裁定**） |
| **I3** | **`The box is its.`** | `its` | `It's its box.` / `The box is its own.` | **中文「这个盒子是它的」说得通**（「它的」独立成句），英语的 `its` **不能自己站**——它必须贴着一个东西。**这是 L33/L112 已建立的分工**（`:6217` 逐字 `一家人都这样：your/yours、her/hers、our/ours——带 s 的那个独立用，不带的贴名词`）。**剑桥逐字背书**：`We don't use its as a possessive pronoun.` ／ `Not: Its .` ／ `Possessive determiner its is not used alone.`（§4.3 引文 6） |

**⇒ 三条机制独立（`it` vs `its` 的词形／撇号／能否独立站），I3 有剑桥逐字背书，I1 有 L8 库内三条同型先例。可做 ✅。**

#### 1.3.1 ⚠️ I2 与 L87 `Its cold today.` 是同一个坑吗？

**裁定：是【同一个坑的另一个方向】，可以同批共存，但必须显式切分。**

| | L87 `:16522`（已存在） | 本批 I2 `It's box is small.` |
|---|---|---|
| 方向 | **该用 `It's` 却写了 `Its`**（少撇号） | **该用 `Its` 却写了 `It's`**（多撇号） |
| 场景 | 「它是」的位置（`Its cold` = 「它是冷的」） | 「它的」的位置（`It's box` = 「它的是盒子」） |
| 判据 | **句子需要一个「它是」** | **后面跟着一个东西** |

**⇒ 这正是项目已成熟的 `两张脸`／`三张脸` 模具**（`两张脸` 全库多见；L193 逐字 `deepDive.title: "so 的三张脸"`）。**建议 L195 把它做成「同一个读音，两张脸」**——`It's`（它是／它是…的短版）vs `Its`（它的，必须贴东西）。**两条错句（L87 的少撇号 ＋ L195 的多撇号）合起来正好构成完整的一对**，比各自单独出现教学价值更高。

**⇒ 结论：不构成撞车，是互补。但 L195 的 `contrast` 不应把 `Its cold today.` 再列一遍**（L87 已判过），应列 `It's box is small.`（反方向）＋ I1 ＋ I3。

### 1.4 最终裁定

> **裁定 A（做不做）：做，2 课。**
> - **L194 `such a`**：S1/S2/S3 三条机制独立、两源逐字背书、且与 L89 的坑**不重叠**（§1.1.1 逐项比对）。
> - **L195 `its`**：三条机制独立、I3 有剑桥逐字背书、I1 有 L8 三条库内同型、且**填补「唯一被告知是错的却从未教过对」的缺口**。
>
> **⇒ 本批产出 L194 ＋ L195 两课**（任务书问「做几课」，答案：**2 课**，不是 1 课也不是 4 课）。

---

## §2 拆课方案与理由（核心）

### 2.1 关键判断：`such a` / `its` / `several` / `a bit` **不是同一族——是三族**

**任务书问「是同一族（都属限定/数量）还是不同族」，并要求「如果不同族，明确说该拆几课、哪些该拒绝」。**

**裁定：从「形式语言学」看它们同属「限定词（determiner）」；但从【本项目的教学判据】看，它们是三族，依据是「错句机制」而非「词类归属」。**

| 族 | 成员 | 用户要做的**新操作** | 错句机制 | 立课？ |
|---|---|---|---|---|
| **族 A：程度＋冠词** | `such a` | 判断「这么」**后面跟的是东西还是『怎么样』的词**，以及 `a` **站在 `such` 后面** | **词的位置／词的选择** | ✅ **L194** |
| **族 B：所属** | `its` | 判断「它」**是主角（`it`）还是贴东西的标签（`its`）**，撇号在不在，能否独立站 | **词形（差一个字母/撇号）** | ✅ **L195** |
| **族 C：数量刻度** | `several`／`a bit`／`lots of` | **在一个已有的刻度尺上换一个格子**（`a few`→`several`→`a lot of`；`a little`→`a bit`） | **换词**（判据不变） | ❌ **拒绝（见 §2.2）** |

**⇒ 三族判据互不相干**：族 A 问「`a` 站哪儿」，族 B 问「要不要贴东西」，族 C 问「多还是少」。**把 A 和 B 合课＝一课两个新点**（勉强在项目的 2-3 点上限内，但**两族的错句机制毫无交集**，合课后 `contrast` 的 6 张卡会变成「3 张讲 `a` 的位置 ＋ 3 张讲 `its`」——**每张卡都只有一半用户当前需要**）。

**⇒ 裁定：A 与 B 分开，各一课。族 C 全部拒绝。**

### 2.2 明确拒绝项（3 项，逐项给理由）

| # | 候选 | **裁定** | 理由 |
|---|---|---|---|
| **R1** | **`several` 单独立课** | ❌ **拒绝** | **它是纯「换词」，判据与 L114 完全相同。** ①**中文侧**：`several` 译「好几个／几个」，而 L114 的 `a few` 中文**就是「还有几个」**（`:?` 逐字 `targetSentence: "There are a few apples."` / `intentZh: "还有几个苹果。"`）——**中文同一个词**。②**判据侧**：L114 的立岗判据是「**`a` 在不在，意思反一半**」（`grammarLabel` 逐字），`several` **没有这条判据**（它没有「去掉 a 就反义」的对照）。③**本项目判据**（批三十七逐字）：`「缺员若只让已知句型换一个动词，则它不是一课，它是一个词表项。」`——**`several` 是「只换一个词」的典型**。④**另有更严重的问题**：`several` **全库 0 处**，**连词表池都没进**（§3.4），而它的**同格邻居全都在池里**（`few`@L114、`many`@L30、`much`@L30、`lot`@L25）——**说明它不是「缺了但该有」，是「这个刻度本项目已有别的词顶着」**。 |
| **R2** | **`a bit` 单独立课** | ❌ **拒绝** | **同 R1，且更明确：`a bit` 是 `a little` 的随口版。** ①**L114 已教 `a little`**（`:21818` 逐字 `数不清的东西（牛奶、水、时间）是另一班人马：a little 是「还有一点」（够）`）——**中文「一点」已被占**。②**剑桥逐字**：`We also use a bit to modify adjectives, or as an adverb. It is more informal than a little`（§4.3 引文 7）——**权威直接说 `a bit` 是 `a little` 的「更随口版」，即同一个格子的两种口气**。③**本项目已处理过同型**：L167 逐字 `little 和 few 也别混：第 114 课学过 a few（还有几个）、a little（还有一点）。它们说的是「少」，a lot of 说的是「多」，正好相反。`——**本项目对「刻度上的邻居」的做法是【在深挖卡里排成一行】，不是【各开一课】** ✅ |
| **R3** | **`lots of`** | ❌ **拒绝（它是假命中）** | 全库唯一 1 处（`:32703` L167）逐字是 **`"I have a lots of homework."`**——**这是一条错句选项**（正解 `I have a lot of homework.`，`explain` 逐字 `作业数不出来，不加 s`）。**它证明 `lots of` 已被 L167 作为【陷阱】处理过**，不是缺口。**若再立一课，会与 L167 打架**（L167 的正解是 `a lot of`）。 |
| **R4** | **`so much` / `so many` 立课** | ❌ **拒绝** | 全库 **0**（教学位与全库都是 0，`so few`/`so little` 也是 0）——**确实是缺口，但它是 `too many`/`too much`（L166）的邻居**，且**剑桥逐字把 `so much/many/little/few` 归在 `such or so` 页里说明**（§4.3 引文 2 末段 `So but not such can also be used in front of much, many, little, few to add emphasis`）——**即：它属「`so` vs `such` 的选择」这一族，即族 A**。⇒ **可作为 L194 的 `deepDive` 一行带上，不单独立课。** |

### 2.3 为什么不做「冠词收口课」（任务书设想的合并项）

**任务书建议「与冠词收口课合并」。本轮裁定：不做独立的冠词收口课，理由三条：**

1. **本项目的冠词教学是「分布式」的，不是「集中式」的**——实测冠词相关的**带标记错句有 33 条 article 罪名**散布在 L3／L4／L5／L7／L8／L9／L11／L26 等课（`huntCases.ts` 的 tag 统计：`article: 33`）。**本项目从未有过「冠词课」这个形态**，`grammarLabel` 含「冠词」的课**全库 0 课**（实测）。
2. **收口课的立项条件是「有整季的句型可以排一行」**（`grammarLessons.test.ts` 逐字 `收口课（零新知）的练习**本来就是**把整季句型排一行复习`）——**冠词线没有「一季」，它是横贯全库的**。强行做「冠词收口」会变成一课**同时复习 L3/L4/L9/L11/L26/L89** 的六件事，**违背收口课「零新知、排一行」的定义**。
3. **L194 本身就是最合适的「冠词收口位」**：它教的是 `such a`——**`a` 的位置**，天然可以回指 L89（`What a`）、L4（`want + a/an`）、L3（`have + a`）。**⇒ 合并的诉求由 L194 的 `deepDive` 承担，不新开课。**

### 2.4 两课的分工（一课一增量自查，对齐批三十七 §3.4 判据）

| 课 | 让用户新学会的操作 | 是否只是「换词」？ |
|---|---|---|
| **L194 `such a`** | ①判断「这么」后面跟的是**东西**还是**「怎么样」的词**（决定用 `such` 还是 `so`）；②知道 `a` **站在 `such` 后面**（不是前面） | ✅ **不是**——判据是**结构性的**（看后面跟什么），且**本项目全库 0 先例**（`a such`/`so a`/`such big` 全部 GL=0） |
| **L195 `its`** | ①`it`（主角）vs `its`（贴东西的标签）；②撇号在不在；③**`its` 不能自己站**（与 `theirs`/`mine` 那批相反） | ✅ **不是**——判据是**词形与能否独立站**，且③**本项目从未教过「哪个小标签不能独立站」**（L33/L112 教的是「**能**独立站的那个带 s」，**反面从未说**） |

---

## §3 每课 targetSentence 设计

### 3.0 总览

| 项 | L194 | L195 |
|---|---|---|
| 课注 id（建议） | `lesson-194-such-a` | `lesson-195-its` |
| number | **194** | **195** |
| **targetSentence** | **`It was such a big fish.`** | **`The cat is in its box.`** |
| **中文意图** | **这么大的鱼！** | **猫在它自己的盒子里。** |
| 词数 | **6 词**（单句最长 6） | **6 词**（单句最长 6） |
| 新词数 | **1 个**（`such`） | **0 个**（`its` 已进池 @L87；`cat`@L3、`box`@L18、`in`@L18） |
| scene | **`island`**（间隔 **122 课**，全库第二久未用） | **`train`**（间隔 **12 课**） |
| 季 | 并入 `season-28`（`max: 193` → `195`） | 同左 |

**难度衔接核对**（`grammarLessons.test.ts` 守门：`相邻课的单句最长词数不得跳超 5 词`）：

```
L189 最长分句=4  These are their books.
L190 最长分句=5  I am learning to swim.
L191 最长分句=5  She walked into the kitchen.
L192 最长分句=9  We walked through the forest and across the bridge.
L193 最长分句=9  The wind was so strong that the window broke.
⇒ 新句上限 = 9 + 5 = 14（守门）；建议 ≤10
```

**⇒ L194（6 词）跳变 −3、L195（6 词）跳变 0 —— 两课都远在门内 ✅**（且是**下坡**，不会撞墙）。

### 3.1 L194：`It was such a big fish.`（6 词，1 新词）

**中文意图**：这么大的鱼！

**为什么是这句**：

1. **它让「`a` 站哪儿」变成看得见的事**：`such a big fish` —— 用户只要看词序就知道 `a` 在 `big` **前面**、`such` **后面**。**不需要读解释。**
2. **它是「感叹」而不是「陈述」的工具**：中文「这么大的鱼！」是**感叹**，与 L89 的 `What a nice day!` **同一口气**——**这正是「a 站哪儿」这条规矩的第二站**（L89 感叹天，L194 感叹鱼），**两课构成一条连续的教学线**。
3. **撞车检测 0 命中**（§5.7 实测：`It was such a big fish.` 对全库全部英文句的 Jaccard **无 ≥0.30 命中**）——**这是本批选句的首要标准**。
4. **词全新且已教过**：`big`@L3、`fish`@L17、`was`@L1（`was` 是 L193 `broke` 后的自然延续）——**只有 `such` 一个新词** ✅。
5. **⚠️ 它主动避开了一个真实撞车**：**`It was such a nice day.` 不能用**——实测它与 L89 `Is it a nice day?` 的 Jaccard = **0.83**、与 `What a nice day!` = **0.43**，**且 `nice day` 是 L89 的立岗句核心**。若用 `nice day`，**L194 会变成 L89 的改写**（正是批三十九否决 `such a` 的理由）。**换 `fish` 后撞车归零** ✅

**逐词首见课核对**（`/tmp/pool2.js` 实测）：

| 词 | It | was | such | a | big | fish |
|---|---|---|---|---|---|---|
| 首见 | L3 | L1 | **L194（新）** | L1 | L3 | L17 |

**新词 = 1（`such`）** ✅ —— 与近期课一致（L189 `their`=1、L190 `learning`=1、L193 `broke`=1）。

#### 3.1.1 L194 的对照卡（3 带标记错 ＋ 3 双正解）

| # | wrong | wrongMark | correct | 中文成因（零术语版建议文案） |
|---|---|---|---|---|
| 1 | `It was a such big fish.` | `a` | `It was such a big fish.` | `a` 站在 `such` **后面**，不是前面——中文的「一条」在「这么」后面，英语的 `a` 在 `such` 后面 |
| 2 | `It was such big.` | `such` | `It was so big.` | 后面跟的是「有多…」那个词（big），前面要用 `so`；`such` 后面得跟一个**东西**（a big fish） |
| 3 | `It was so a big fish.` | `so a` | `It was such a big fish.` | `so` **不能带 `a`**——要带「一个东西」的是 `such` |
| 双正解 1 | `What a big fish!` | null | `It was such a big fish.` | 两句都对——第 89 课那个 `What` 是**喊出来**的；今天这句是**说给听**的，同一个「这么」 |
| 双正解 2 | `It was a big fish.` | null | `It was such a big fish.` | 两句都对——平着说（a big fish）和**带着「这么」说**（such a big fish） |
| 双正解 3 | `The fish was big.` | null | `It was such a big fish.` | 两句都对——第 2 课那句只报「鱼大」；今天这句多了**「这么大」的那口气** |

**双正解卡的设计意图**：**双正解 1 显式回指 L89**（把「感叹」和「带 `such` 的陈述」并列，**这正是 L89 的双正解 3 已有的做法**——`:16922` 逐字 `两句都对——平着说（It's a nice day）和喊着说（What a nice day!）：一个是陈述、一个是感叹。`）。**⇒ L194 与 L89 形成镜像，用户会感到「同一件事的两种口气」，而不是「又学一遍」。**

### 3.2 L195：`The cat is in its box.`（6 词，0 新词）

**中文意图**：猫在它自己的盒子里。

**为什么是这句**：

1. **它让 `its` 的「必须贴东西」变成不可回避的**：`its box` —— `its` 后面**紧跟一个东西**（`box`）。**用户看一眼就知道 `its` 不能自己站。**
2. **避开了撞车陷阱**：实测 `The cat is in its box.` 的最高相似度是 **0.57**（L80 `The cat is behind the box.` / L158 `Is anyone in the box?`）——**< 0.80 红线** ✅。**但必须注意 L18 已有 `My hat is in the box.`（相似 0.50）**——**这是好事**：L18 的 `My hat is in the box.` 正是 L8 那批小标签（`my`）的例句，**L195 用同一个骨架换 `its`**，用户会认出「同一个架子」。
3. **`cat`／`box`／`in` 全部已教**（L3／L18／L18），**新词 0** —— 这是**最理想的 D 层状况**（结构课的标准水位，实测 L181-L193 有 **9 课新词为 0**）。
4. **⚠️ 避开的坑：不能用 `dog`／`tail`／`paw`** —— 实测 `dog` 虽在池里（L5），但 `tail`／`paw`／`wing`／`nest`／`toy` **全部未教**（`/tmp/pool2.js` 实测 `★未教`）。若写 `The dog is wagging its tail.`，**`tail` 会成为 D 层缺陷**（`practice` 答案含未教词 → 测试红）。

**逐词首见课核对**：

| 词 | The | cat | is | in | its | box |
|---|---|---|---|---|---|---|
| 首见 | L4 | L3 | L1 | L18 | **L87** | L18 |

**新词 = 0** ✅（`its` 在 L87 进池——**但那是因为 L87 的错句 `Its cold today.` 进了池**。**本课才是它第一次被正面教**，见 §1.3）。

#### 3.2.1 L195 的对照卡（3 带标记错 ＋ 3 双正解）

| # | wrong | wrongMark | correct | 中文成因（零术语版建议文案） |
|---|---|---|---|---|
| 1 | `The cat is in it box.` | `it` | `The cat is in its box.` | 「它的」是一个词——`it` 只能当主角，贴在东西前面的那个要带 s：**its box**。（第 8 课老规矩：`my`／`her` 也是这么贴的） |
| 2 | `It's box is small.` | `It's` | `Its box is small.` | 有那一小撇是「它是」（第 87 课的短版）；贴在东西前面说「它的」**不带撇**：**Its box** |
| 3 | `The box is its.` | `its` | `The box is its own.` | `its` **不能自己站**——它后面必须跟着一个东西（its box）。要自己站得说 `its own`，或者换第 33 课那种带 s 的（theirs／mine） |
| 双正解 1 | `Its box is small.` | null | `The cat is in its box.` | 两句都对——`its` 在两句里都贴在东西前面，换的只是后面那个东西 |
| 双正解 2 | `The cat is in it.` | null | `The cat is in its box.` | 两句都对——**但在里面的是「它」还是「它的盒子」，是两件事**。第 2 课那个 `it` 当主角（在里面的是猫）；今天这句多了一个东西（box） |
| 双正解 3 | `The cat is in the box.` | null | `The cat is in its box.` | 两句都对——`the box` 只说「那个盒子」（谁的不管）；`its box` 说清了**是它自己的** |

**⚠️ 给写课方的一条纪律**：**双正解 2 是本课最值钱的一张卡**（`it` vs `its` **同为 `/ɪts/` 读音、差一个字母**），但也**最容易写坏**——必须说清「两句都对，说的是两件事」，**不能写成「`in it` 是错的」**（`in it` 完全合法）。

### 3.3 场景选择与依据

**实测场景间隔（距 L193，`/tmp/selfcheck40.js` §F）**：

| 场景 | 末次 | 间隔 | 判定 |
|---|---|---|---|
| `lighthouse` | L193 | 0 | ❌ 刚用过 |
| `city` | L192 | 1 | ❌ |
| `mansion` | L191 | 2 | ❌ |
| `ocean` | L190 | 3 | ❌ |
| `campus` | L189 | 4 | ❌ |
| `forest` | L187 | 6 | 偏近 |
| `desert` | L186 | 7 | 偏近 |
| `train` | L181 | 12 | ✅ **可用（L195 建议）** |
| `snow` | L180 | 13 | 可用 |
| `mystery` | L157 | 36 | 可用 |
| `sparkle` | L137 | 56 | 可用 |
| **`island`** | **L71** | **122** | ✅ **首选（L194 建议）** |
| `magic` | L45 | 148 | 可用 |
| **`space`** | **从未** | **193** | ⚠️ **见 §3.5** |

**L194 → `island`**：间隔 **122 课**。「这么大的鱼」放在**海岛**天然成立（钓鱼／海边），且 `island` 是**全库第二久未用的场景**。
**L195 → `train`**：间隔 12 课。「猫在它自己的盒子里」放在**列车**上天然成立（带着猫坐火车、猫的旅行箱／盒子），且 `train` **正好是 L181 用过之后最久没用的「日常」场景**。

### 3.4 ⚠️ `space`：本批**不启用**（诚实登记）

**任务书特别提示「`space` 从未用过」。本轮实测确认**（全库 193 课，`space` 使用 **0 次**）——但**本批两课的题材都不适合它**：

- L194「这么大的鱼」：鱼在太空不成立（`fish` 在海里／湖里）。
- L195「猫在它自己的盒子里」：**猫在太空是本项目 `sparkle`（其他奇想）的题材，不是 `space`（星际太空）的写实因果**。

**⇒ 裁定：不为「启用 `space`」而扭曲选题。** 建议 `space` 留给**未来的「想象／愿望」类课**（如 `I want to go to space.`——`want` 已在 L4、`go` 已在 L9，**两个词全在池里，且 `space` 会成为唯一新词**）。**登记为下批候选**（见 §7 不确定项 4）。

### 3.5 随批清单（供写课方）

| 项 | 值 | 依据 |
|---|---|---|
| **季** | 并入 `season-28`（`max: 193` → **195**，成为 **14 课**大季） | ⚠️ **不新建季**：新建 `season-29`（1-2 课）会使 ≤3 课小季从 **3 个**变 **4 个**，`grammarSeasons.test.ts:63` 逐字断言 `toBeLessThanOrEqual(3)` 直接红（实测当前恰好 3 个，见 §5.3） |
| **季名建议** | 追加两格：`…、这么大的鱼（such a——a 站在 such 后面，后面跟东西；跟「有多…」的词就用 so）、猫在它自己的盒子里（its——「它的」，贴在东西前面，不能自己站）` | 现名逐字见 `grammarSeasons.ts:73` |
| **里程碑** | `can-do-m41`（`afterLesson: 194`）、`can-do-m42`（`afterLesson: 195`） | 末位现为 `can-do-m40`（`afterLesson: 193`）；实测共 40 个 |
| **里程碑 title** | `我能说「这么大的一个东西」` / `我能说「它的」` | 与 m35–m40 同型 |
| **案号** | **203**（L194）、**204**（L195） | 实测 202 案，案 203/204 未占用 ✅ |
| **封面** | L194／L195 各取一个**仅用 1 次**的：实测 `cover52`–`cover58`、`cover69`、`cover70`、`cover77`–`cover79` 均为 1 次（末课用的是 cover74/75/76） | 封面池最大 117 |

---

## §4 外部权威依据与逐字引用

> ⚠️ **抓取诚实声明**：本轮抓取**部分成功、部分失败**，逐源如实登记。**所有成功抓取的引文均逐字来自原始 HTML**（`curl` 取页后用 node 正则剥标签），**未做任何改写**。

### 4.1 抓取结果总表（诚实登记）

| 源 | URL | 结果 |
|---|---|---|
| **Cambridge Grammar · `Such`** | `https://dictionary.cambridge.org/grammar/british-grammar/such` | ✅ **HTTP 200（446,171 字节），抓到全文**（含 `Such … that` 节） |
| **Cambridge Grammar · `Such or so ?`** | `https://dictionary.cambridge.org/grammar/british-grammar/so-or-such` | ✅ **HTTP 200（449,442 字节），抓到全文（含 `Typical errors` 全节）** |
| **Cambridge Grammar · `So`** | `https://dictionary.cambridge.org/grammar/british-grammar/so` | ✅ **HTTP 200（464,755 字节），抓到全文** |
| **Cambridge Grammar · `A bit`** | `https://dictionary.cambridge.org/grammar/british-grammar/a-bit` | ✅ **HTTP 200（445,976 字节），抓到全文** |
| **Cambridge Grammar · `It's or its ?`** | `https://dictionary.cambridge.org/grammar/british-grammar/it-s-or-its` | ✅ **HTTP 200（446,665 字节），抓到全文** |
| **Cambridge Grammar · `Quantifiers`** | `https://dictionary.cambridge.org/grammar/british-grammar/quantifiers` | ✅ **HTTP 200（446,468 字节），抓到目录页**（**不含 `several` 单独词条**） |
| **Cambridge 英汉（简体）· `such`** | `https://dictionary.cambridge.org/dictionary/english-chinese-simplified/such` | ✅ **HTTP 200（323,351 字节），抓到中文对译 ＋ A2 标注** |
| **Cambridge 英汉（简体）· `its`** | `https://dictionary.cambridge.org/dictionary/english-chinese-simplified/its` | ✅ **HTTP 200，抓到中文对译 ＋ A1 标注** |
| **Oxford Advanced Learner's Dictionary · `such`** | `https://www.oxfordlearnersdictionaries.com/definition/english/such` | ✅ **HTTP 200（83,467 字节），抓到 `cefr="a2"` 标注 ＋ 义项全文** |
| **Oxford Advanced Learner's Dictionary · `several`** | `https://www.oxfordlearnersdictionaries.com/definition/english/several` | ✅ **HTTP 200（71,119 字节），抓到 `cefr="a2"`** |
| **Oxford Advanced Learner's Dictionary · `its`** | `https://www.oxfordlearnersdictionaries.com/definition/english/its` | ✅ **HTTP 200（83,793 字节），抓到 `cefr="a1"`** |
| **Longman Dictionary of Contemporary English · `such`** | `https://www.ldoceonline.com/dictionary/such` | ✅ **HTTP 200（62,874 字节），抓到 `✗ Don't say` 错误框** |
| **Longman Dictionary of Contemporary English · `several`** | `https://www.ldoceonline.com/dictionary/several` | ✅ **HTTP 200（53,856 字节），抓到 `THESAURUS` 节** |
| **Longman Dictionary of Contemporary English · `its`** | `https://www.ldoceonline.com/dictionary/its` | ✅ **HTTP 200（48,612 字节）** |
| **British Council LearnEnglish · `Quantifiers`** | `https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/quantifiers` | ✅ **经 WebFetch 抓到全文**（含 count/uncount 三张清单 ＋ `beginner`/`intermediate` 等级） |
| **British Council LearnEnglish · 其他页（`so-such` 等）** | `.../grammar/english-grammar-reference/so-such` 等 3 个 URL | ❌ **抓不到，HTTP 404**（WebFetch 明确返回 `The server returned HTTP 404 Not Found`）；`curl` 走同域则 `HTTP:000` |
| **爱词霸（iciba）· `such a`** | `https://www.iciba.com/word?w=such+a` | ✅ **HTTP 200，抓到中文释义「这样的一个……」** |
| **Oxford Practical English Usage（OUP 官方产品页）** | `https://elt.oup.com/catalogue/items/global/grammar_vocabulary/practical_english_usage/` | ❌ **抓不到：HTTP 202 且 `size_download=0`**（Akamai 机器人拦截，无内容返回） |
| **yygrammar（中国语法教学站）** | `https://www.yygrammar.com/Article/201503/4041.html` | ❌ **HTTP 200 但仅 84 字节**（空页，等同抓不到） |
| **知乎／百度百科／Collins／EnglishClub** | — | ❌ （延续批三十九结果：403／418 反爬；**本轮未重试**） |

**⇒ 关于 British Council 的更正**：批三十九声明「British Council 本轮彻底抓不到」。**本轮的结论更精细**：**`curl` 仍然抓不到（`HTTP:000`）**，**但 `WebFetch` 可以读到部分页面**（`/free-resources/grammar/english-grammar-reference/quantifiers` 成功，`/adjectives`／`/intensifiers`／`/determiners-quantifiers` 成功但内容不相关）。**⇒ 对后续批次的方法学建议：British Council 优先用 `WebFetch`，不要用 `curl`。**

### 4.2 逐字引用（≥3 处，全部可访问）

#### 引文 1 —— **`such` 与 `so` 的四条典型错误**（Cambridge Grammar · `Such or so ?`）

**URL**：`https://dictionary.cambridge.org/grammar/british-grammar/so-or-such`
**逐字**（`Typical errors` 节全文）：

> `We use such , not so , before a noun, even if there is an adjective before the noun:`
> `They're such snobs! They won't speak to anyone else in the village. Not: They're so snobs …`
> `Those are such cool shoes. Where did you get them? Not: Those are so cool shoes .`
> `We use such , not so , before a noun phrase with the indefinite article a/an :`
> `This is such a wonderful kitchen! Not: This is a so wonderful kitchen!`
> `We use so , not such , before adjectives:`
> `Thank you. You're so kind. Not: You're such kind .`
> `We use so , not such , before adverbs:`
> `She always dresses so elegantly. Not: She always dresses such elegantly .`

**⇒ 本批的直接依据**：**S2（`It was such big.`）有 `Not: You're such kind .` 逐字背书**；**S3（`It was so a big fish.`）有 `Not: This is a so wonderful kitchen!` 逐字背书**。**这是本批最核心的一条引文。**

#### 引文 2 —— **`such` 后面跟东西、`so` 后面跟「怎么样」＋`such a` 的词序**（Cambridge Grammar · `Such or so ?` 正文）

**URL**：同引文 1
**逐字**：

> `Such is a determiner; so is an adverb. They often have the same meaning of 'very' or 'to this degree': Those are such good chocolates. Those chocolates are so good.`
> `We use such + noun phrase and so + adjective or adverb phrase: She is such a great cook. Not: She is so great cook .`
> `So but not such can also be used in front of much, many, little, few to add emphasis: So much food was wasted every day. Not: Such much food was wasted …`

**⇒ 对本批的三条价值**：
1. **`We use such + noun phrase and so + adjective`** —— 这是 **S2 的判据来源**（「后面跟什么」决定用哪个词）。
2. **`Not: She is so great cook .`** —— **`so` 后面不能直接跟「东西」，中间不能省 `a`**，**进一步支持 S3**。
3. **`Not: Such much food was wasted …`** —— **权威明确：`such` 不能与 `much/many/little/few` 连用**（只能用 `so`）。**⇒ 这独立支持了 §2.2 的 R4 裁定**（`so much`/`so many` 属族 A，不单独立课）。

#### 引文 3 —— **`such` 与冠词 `a/an` 的相对位置**（Cambridge Grammar · `Such`）

**URL**：`https://dictionary.cambridge.org/grammar/british-grammar/such`
**逐字**（`Such` 页，`Such` 作为 determiner 节）：

> `Such as a determiner We can use such (as a determiner) before a noun phrase to add emphasis: We visited such fascinating places on our trip through central Asia. She has such lovely hair. She lived in such loneliness. (formal)`
> `We use such before the indefinite article , a/an : We had such an awful meal at that restaurant! Not: We had a such awful meal …`
> `Such … that We can use a that -clause after a noun phrase with such : He is such a bad-tempered person that no one can work with him for long. It was such a long and difficult exam that I was completely exhausted at the end.`

**⇒ 本批的直接依据**：**`We use such before the indefinite article , a/an`** ＋ **`Not: We had a such awful meal …`** —— **这是 S1（`It was a such big fish.`）的逐字背书**，且**剑桥给出了 `a such` 这个错序**（与本批 S1 **逐字同型**：`a such awful meal` vs `a such big fish`）。

#### 引文 4 —— **`so` 与 `such` 的语义分工（同义但不同配）**（Cambridge Grammar · `So`）

**URL**：`https://dictionary.cambridge.org/grammar/british-grammar/so`
**逐字**（`So` 页）：

> `We don't use so before an adjective + a noun (attributive adjective). We use s uch : She emailed us such lovely pictures of her and Enzo. Not: … so lovely pictures …`
> `We use such not so to modify noun phrases: She is such a hard-working colleague. Not: … so a hard-working colleague . It's taken them such a long time to send the travel brochures. Not: … so a long time …`

**⇒ 本批的直接依据**：**`Not: … so a hard-working colleague .`** 与 **`Not: … so a long time …`** —— **剑桥两次给出 `so a` 这个错序**，**这是 S3 的第二重独立背书**（引文 1 是 `a so`，这里两条都是 `so a`）。**⇒ 学习者真实产出 `so a` ↔ `a so` 两种，剑桥两种都点名了。**

#### 引文 5 —— **Longman 的 `✗ Don't say` 错误框**（对 S1 的第三重背书）

**URL**：`https://www.ldoceonline.com/dictionary/such`
**逐字**（`such` 词条 `GRAMMAR: Word order` 框）：

> `You use such a before an adjective and a noun, or before a singular noun: I'm lucky to have such a wonderful teacher. He gave me such a fright.`
> `✗ Don't say: a such wonderful teacher a such fright`

**⇒ 三源（剑桥 ×2 处 ＋ Longman ×1 处）独立给出同一条错序 `a such`** —— **这是本批 S1 最硬的证据**。

#### 引文 6 —— **`its` 与 `It's` 的分工，及 `its` 不能独立站**（Cambridge Grammar · `It's or its ?`）

**URL**：`https://dictionary.cambridge.org/grammar/british-grammar/it-s-or-its`
**逐字**（全页正文）：

> `It's is the contracted form of it is or it has : Can you hear that noise? Where do you think it's (it is) coming from? It's (it is) nearly the end of the month. It's (it has) gone really quickly.`
> `Its is a possessive determiner (like my, your, his ) which we use when referring to things or animals: Every house in the street has got its own garage. [talking about a famous American journalist] He joined the New York Tribune (1868), becoming its editor-in-chief and eventually its principal owner (1872–1905).`
> `We don't use its as a possessive pronoun. Compare A: Whose is this ball? B: Mine . Possessive pronoun mine used alone. A: Whose is this ball? B: The dog's . Not: Its . Possessive determiner its is not used alone. We repeat the noun which is being referred to.`

**⇒ 本批的直接依据**：
1. **`Its is a possessive determiner (like my, your, his )`** —— **剑桥把 `its` 直接与 `my`／`your`／`his` 并列** ⇒ **独立支持本批「`its` 是 L8 那批小标签缺的一员」的判定** ✅
2. **`We don't use its as a possessive pronoun.` / `Not: Its .` / `Possessive determiner its is not used alone.`** —— **三条逐字，这是 I3（`The box is its.`）的直接背书** ✅
3. **`Every house in the street has got its own garage.`** —— **剑桥唯一的正面例句用了 `its own`** ⇒ **支持本批 I3 的正解写 `its own`**（而不是编一个别的）✅

#### 引文 7 —— **`a bit` 是 `a little` 的「更随口版」**（对 R2 拒绝裁定的背书）

**URL**：`https://dictionary.cambridge.org/grammar/british-grammar/a-bit`
**逐字**：

> `We use a bit ( of ) or bits ( of ) to refer to quantities. The phrases can refer to both abstract and concrete things. They are an informal alternative to some , or a piece of or pieces of : Do they need a bit of help with their luggage? (or … some help … )`
> `We also use a bit to modify adjectives, or as an adverb. It is more informal than a little : They had got a bit tired working in the garden.`

**⇒ 本批的直接依据**：**`it is more informal than a little`** ＋ **`They had got a bit tired`** —— **权威明说 `a bit` 是 `a little` 的「更随口版」**，且例句 `a bit tired` 与 L114 的 `a little` **同一格**（「一点／有点」）。**⇒ 独立支持 §2.2 的 R2 裁定（它是换词，不单独立课）** ✅

#### 引文 8 —— **跨源位次（CEFR 等级）：`such` = A2，`its` = A1，`several` = A2**

**URL**：`https://www.oxfordlearnersdictionaries.com/definition/english/such`
**逐字**（HTML 原始属性 + 该义项正文）：

> `cefr="a2"> used to emphasize the great degree of something This issue was of such importance that we could not afford to ignore it.`
> `such a/an… Why are you in such a hurry? It's such a beautiful day!`

**URL**：`https://www.oxfordlearnersdictionaries.com/definition/english/its`
**逐字**：

> `cefr="a1"> belonging to or connected with a thing, an animal or a baby Turn the box on its side. Have you any idea of its value?`

**URL**：`https://www.oxfordlearnersdictionaries.com/definition/english/several`
**逐字**：

> `cefr="a2" hclass="sense"> more than two but not very many Several letters arrived this morning. He's written several books about India.`

**URL**：`https://dictionary.cambridge.org/dictionary/english-chinese-simplified/such`
**逐字**（中文对译，**标 A2**）：

> `A2 used before a noun or noun phrase to add emphasis`
> `（用于名词或名词短语前表示强调） 如此 ， 这么`

**URL**：`https://dictionary.cambridge.org/dictionary/english-chinese-simplified/its`
**逐字**（中文对译，**标 A1**）：

> `A1 belonging to or relating to something that has already been mentioned`
> `它的 ， 其`

**⇒ 跨源位次综合结论**：

| 结构 | 牛津 CEFR | 剑桥 CEFR | 本项目的位次判定 |
|---|---|---|---|
| **`such a`** | **A2** | **A2** | **两源一致 A2** ⇒ 本项目当前 **L193 已到 B1 门槛段**（`season-28` 含 `learned to`、`so...that`），**A2 的内容属于「迟到补员」** ✅ 与本批立 L194 吻合 |
| **`its`** | **A1** | **A1** | **两源一致 A1** ⇒ **它是 A1 内容，本项目 193 课才补**——**这是本批最惊人的一条位次发现**（详见 §4.4） |
| **`several`** | **A2** | （无单独词条，属 `Quantifiers` 页） | A2 ⇒ **但它是「刻度换格」，不立课**（§2.2 R1） |

**⇒ 关键位次结论（正面回答任务书「哪个等级、哪个单元、和什么一起教」）**：
- **`such a` 在牛津／剑桥都是 A2**，且**剑桥把它与 `so` 放在同一页**（`Such or so ?`）——**⇒ 教 `such a` 必须同时切 `so`／`such`**（这正是本批 S2 的设计）。
- **`its` 在牛津／剑桥都是 A1**，剑桥把它与 **`my`／`your`／`his` 并列**，并归入 **`Possessive determiners`** 类——**⇒ 它应该与 L8（`物主词 my / her`）同单元**。**本项目把 A1 的 `its` 拖到 194 课，是一个真实的内容排序缺口。**

#### 引文 9 —— **British Council 的三张数量清单**（对 R1/R2 与 `several` 归属的背书）

**URL**：`https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/quantifiers`
**逐字**（经 WebFetch，`Quantifiers` 页）：

> `We can use these quantifiers with both count and uncount nouns:` / `all some more a lot of enough` / `no any most lots of less` — **Level: beginner**
> `Some quantifiers can be used only with count nouns:` / `(not) many each either (a) few` / `several both neither fewer` — **Level: beginner**
> `Some quantifiers can be used only with uncount nouns:` / `(not) much a bit of a little`

**⇒ 对本批的三条价值**：
1. **`several` 与 `a few`／`many` 同列**（`count nouns only` 那一行）——**权威把 `several` 与 `a few` 放在同一格** ⇒ **独立支持 R1 拒绝（它是换词）** ✅
2. **`a bit of` 与 `a little`／`much` 同列**（`uncount nouns only` 那一行）——**独立支持 R2 拒绝** ✅
3. **`enough` 与 `a lot of`／`lots of` 同列**（`both` 那一行）—— 本项目已于 L71 教 `enough`、L167 教 `a lot of`，**⇒ 三个词的位置本项目已覆盖** ✅

### 4.3 抓不到的两处（明确声明）

**① British Council 的 `so-such` 专页：HTTP 404。**

```bash
curl -s -L -A "Mozilla/5.0 … Chrome/120 …" "https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/so-such"
# → HTTP:000 size:0   （curl 走同域全部失败）
```
```text
WebFetch https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/so-such
→ The server returned HTTP 404 Not Found.
WebFetch https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/so-such
→ The server returned HTTP 404 Not Found.
```
**尝试了 4 个 URL 变体**（`/grammar/…`、`/free-resources/grammar/…`，含 `?page=1`）。**⇒ 声明：British Council 的 `so`／`such` 专页本轮取不到**（404，页面不存在或已改址）。**本报告不含 British Council 关于 `so`/`such` 的引文**——不是没找，是**页面不存在**。**但同域的 `quantifiers` 页取到了**（引文 9）。

**② Oxford Practical English Usage（OUP 官方页）：HTTP 202，零字节。**

```bash
curl -s -L -A "Mozilla/5.0 …" "https://elt.oup.com/catalogue/items/global/grammar_vocabulary/practical_english_usage/"
# → HTTP:202 size:0
```
**⇒ 声明：与批三十九结果一致，Akamai 机器人拦截，`PEU` 原件仍不可得。**（批三十九逐字：`Murphy 双册原件已全失`——**本批确认 PEU 同样不可得**。）

---

## §5 自我核查记录（命令 + 输出）

> ⚠️ **核查纪律**（任务书要求）：所有「全库为 0／已教过／某句已被占用」的断言，**一律用 node 词边界正则在 `src/data/grammarLessons.ts` 与 `src/data/huntCases.ts` 全库验证**，并**排除连字符标识符假命中**（`(?<![A-Za-z-])word(?![A-Za-z-])`）。**未使用 `grep`。**
> ⚠️ **任务书额外要求**：「核查逐字引用不能只查被指认的那一课——必须全库检索字符串再定位」。**本轮严格执行**：§5.2 / §5.4 / §5.5 / §5.8 全部是**先全库检索、再按行号定位到课**。

### 5.1 污染源排除（先做，否则全部数字错）

```bash
cd /Users/liujun/Documents/英语听写 && ls -la src/data/__r40.tmp.test.ts
# → -rw-r--r--@ 1 liujun  staff  3288 Sep 21 22:21 src/data/__r40.tmp.test.ts
node -e "const s=require('fs').readFileSync('/Users/liujun/Documents/英语听写/src/data/__r40.tmp.test.ts','utf8'); console.log(s.slice(0,900));"
# → import { describe, it } from "vitest";
#    import { grammarLessons } from "./grammarLessons";
#    import { huntCases } from "./huntCases";
#    const bd = (w: string) => new RegExp(`(?<![A-Za-z-])\${w...}(?![A-Za-z-])`, "gi");
#    const cands = ["such a", "such", "its", "it's", "several", "a bit", "a little", "lots of", ...]
#    → 该文件把候选词【全部按字符串列了一遍】——统计必须排除
```

**⇒ 本报告全部数字已排除 `__*.tmp.test.ts`。**

### 5.2 `such` / `such a` 全库逐行（**全库检索再定位**）

```bash
cd /Users/liujun/Documents/英语听写 && node -e "
const L=require('/tmp/lib.js');
const gl=L.readGL(), bs=L.blocks(gl);
const lineOf=(i)=>gl.slice(0,i).split('\n').length;
L.lines(gl,/(?<![A-Za-z-])such(?![A-Za-z-])/i).forEach(x=>{
  const b=bs.filter(b=>x.line>=lineOf(b.idx)&&x.line<lineOf(b.end)).pop();
  console.log('  :'+x.line+' [L'+(b?L.num(b.id):'?')+'] '+x.text.slice(0,170));
});"
```

**输出**：

```
  :38547 [L193] wrong: "The wind was such strong that the window broke.",
  :38548 [L193] wrongMark: "such",
  :38550 [L193] whyZh: "后面跟的是「有多…」那个词（strong），前面要用 so。such 后面跟的是「东西」（such a strong wind 这么大的风）——那一格今天不碰。"
  :38609 [L193] options: ["so", "very", "such"],
  :38648 [L193] options: ["He was so hungry that he ate a big bowl.", "He was so hungry that ate a big bowl.", "He was such hungry that he ate a big bowl."]
```

**⇒ 五条实测结论**：
1. **`such` 全库 6 处（5 行），全部在 L193 一课内** ✅ —— 与任务书「教学位 0」一致。
2. **`:38550` 逐字 `那一格今天不碰`** —— **L193 已明确把 `such a` 登记为「未做」**，**本批正是兑现这一句** ✅（这是本批最重要的库内依据）。
3. **`such a strong wind` 在 `:38550` 已被用作【解释用的例子】** —— **⚠️ 因此 L194 不能用 `such a strong wind` 当目标句**（会与 L193 的解释文字重复）。**本批选 `such a big fish` 正是避开它**（§5.7）。
4. **`:38609` 的 `options` 已把 `such` 作为 `so` 的干扰项**（L193 guided 题）——**本批 L194 的 S2（`such` vs `so`）与它同型但不同句子**，**不构成重复**（L193 问的是 `so strong that…`，L194 问的是 `such a big fish` vs `so big`）。
5. `such a` 全库 **1** 处（就是 `:38550` 那个解释例子）—— **任务书写的「5」对不上，实测为 1**。

### 5.3 冻结快照与序号占用

```bash
cd /Users/liujun/Documents/英语听写 && node /tmp/selfcheck40.js 2>&1 | sed -n '/§C/,/§E/p'
```

**输出**：

```
=== §C 冻结快照 ===
  课数=193  GL 行数=38687
  案数=202  HC 行数=10515
  季数=28
  课号 1..193 缺号=无
  L194 占用=false  L195 占用=false
  案 203 占用=false  案 204 占用=false
```

**⇒ L194／L195／案 203／案 204 均未占用** ✅。`season-28` 当前为 `min: 182, max: 193`（12 课），扩到 195 后 14 课，**≤3 课小季仍是 3 个** ✅（`grammarSeasons.test.ts` 逐字 `toBeLessThanOrEqual(3)`）。

### 5.4 结构级与候选错句的全库存在性（**这是任务书要求的关键自查**）

```bash
cd /Users/liujun/Documents/英语听写 && node -e "
const L=require('/tmp/lib.js');
const gl=L.readGL(), hc=L.readHC();
console.log('=== 结构级（真词口径）===');
for(const t of ['such many','such much','such few','such little','so many','so much','so few','so little','a such','so a']){
  console.log('  '+t.padEnd(12)+' GL='+L.cnt(L.bd(t),gl)+'  HC='+L.cnt(L.bd(t),hc));
}
console.log('=== 候选错句逐字存在性 ===');
for(const s of ['It was a such big fish.','It was so a big fish.','It was such big.','It was such a big fish.','The cat is in it box.',\"It's box is small.\",'The box is its.','The cat is in its box.','What nice day!','What a nice day!','It is such a nice day.','It is so a nice day.']){
  const e=s.replace(/[.*+?\${}()|[\]\\\\]/g,'\\\\\$&');
  const n=(gl.match(new RegExp(e,'g'))||[]).length, m=(hc.match(new RegExp(e,'g'))||[]).length;
  console.log('  '+(n||m?'⚠已存在':'新    ')+' GL='+n+' HC='+m+'  '+s);
}"
```

**输出**：

```
=== 结构级（真词口径）===
  such many    GL=0  HC=0
  such much    GL=0  HC=0
  such few     GL=0  HC=0
  such little  GL=0  HC=0
  so many      GL=0  HC=0
  so much      GL=0  HC=0
  so few       GL=0  HC=0
  so little    GL=0  HC=0
  a such       GL=0  HC=0
  so a         GL=0  HC=0
=== 候选错句逐字存在性 ===
  新     GL=0 HC=0  It was a such big fish.
  新     GL=0 HC=0  It was so a big fish.
  新     GL=0 HC=0  It was such big.
  新     GL=0 HC=0  It was such a big fish.
  新     GL=0 HC=0  The cat is in it box.
  新     GL=0 HC=0  It's box is small.
  新     GL=0 HC=0  The box is its.
  新     GL=0 HC=0  The cat is in its box.
  ⚠已存在 GL=2 HC=0  What nice day!
  ⚠已存在 GL=41 HC=1  What a nice day!
  新     GL=0 HC=0  It is such a nice day.
  新     GL=0 HC=0  It is so a nice day.
```

**⇒ 六条错句（S1/S2/S3 ＋ I1/I2/I3）与两句目标句在全库（193 课 ＋ 202 案）均为新句** ✅。
**⇒ `a such` / `so a` 两个错序全库 0** ✅ —— **本批的三条错句不与任何已有错句重复**。
**⇒ `What nice day!` GL=2**（L89 的对照卡 ＋ 它的 guided spot 题）——**本批两条错句列表里没有它** ✅（§1.1.1 的纪律）。

### 5.5 L89 的 `a` 位置自相矛盾（**本批独立发现**）

```bash
cd /Users/liujun/Documents/英语听写 && node -e "
const L=require('/tmp/lib.js');
const gl=L.readGL();
const ls=gl.split('\n');
const hou=[],qian=[];
ls.forEach((l,i)=>{ if(/a 站[^。]{0,14}后面/.test(l)) hou.push(i+1); if(/a 站[^。]{0,14}前面/.test(l)) qian.push(i+1); });
console.log('「a 站…后面」 行号: '+hou.join(', ')+'   (共 '+hou.length+')');
console.log('「a 站…前面」 行号: '+qian.join(', ')+'   (共 '+qian.length+')');
const w='What a nice day!'.replace('!','').split(' ');
console.log('事实核对: a 索引='+w.indexOf('a')+', nice 索引='+w.indexOf('nice')+' ⇒ a 在 nice 【前】面');
"
```

**输出**：

```
「a 站…后面」 行号: 16890, 16892, 16909, 16947, 16966   (共 5)
「a 站…前面」 行号: 16981, 17955   (共 2)
事实核对: a 索引=1, nice 索引=2 ⇒ a 在 nice 【前】面
```

**⇒ L89 有 5 处把位置说反，2 处说对**（其中 `:17955` 在 L94，逐字 `第 89 课老规矩：a 站描写的词前面`）。**这是本批最重要的独立发现**（§1.2.1）。

### 5.6 `its` 全库逐行分类（**支撑 L195 立课的唯一根据**）

```bash
cd /Users/liujun/Documents/英语听写 && node -e "
const L=require('/tmp/lib.js');
const gl=L.readGL(), bs=L.blocks(gl);
const lineOf=(i)=>gl.slice(0,i).split('\n').length;
const at=(line)=>bs.filter(b=>line>=lineOf(b.idx)&&line<lineOf(b.end)).pop();
L.lines(gl,/(?<![A-Za-z-])its(?![A-Za-z-])/i).forEach(x=>{
  const t=x.text; let kind='解释文字';
  if(/^\s*wrong:/.test(t)) kind='★contrast.wrong 错句';
  else if(/^\s*distractors:/.test(t)) kind='★干扰项';
  else if(/^\s*wrongToken:|^\s*answer:\s*\"Its\"/.test(t)) kind='★spot 题错块';
  else if(/^\s*options:/.test(t)) kind='★选项干扰';
  else if(/^\s*tokens:/.test(t)) kind='★spot 题词块';
  console.log('  :'+x.line+' [L'+L.num(at(x.line).id)+'] '+kind+'   '+t.slice(0,90));
});"
```

**输出**（15 行，摘要）：

```
  :16522 [L87] ★contrast.wrong 错句   wrong: "Its cold today.",
  :16570 [L87] 解释文字   "那一小撇很重要：It's 是「它是」的短版，Its 是「它的」——…"
  :16579 [L87] 解释文字   "Its ❌ —— 少一小撇就成了「它的」"
  :16588 [L87] ★选项干扰   options: ["It's", "Its", "It"],
  :16610 [L87] ★spot 题词块   tokens: ["Its", "cold", "today."],
  :16611 [L87] ★spot 题错块   wrongToken: "Its",
  :16612 [L87] ★spot 题错块   answer: "Its",
  :16630 [L87] ★选项干扰   options: ["It's", "Its", "It is's"],
  :16639 [L87] ★干扰项   distractors: ["Its"],
  :16652 [L87] ★干扰项   distractors: ["Its"],
  :16665 [L87] ★干扰项   distractors: ["Its"],
  :16848 [L88] ★干扰项   distractors: ["Its"],
  :18004 [L94] ★干扰项   distractors: ["Its"],
  :18410 [L96] ★干扰项   distractors: ["Its"],
```

**⇒ `its` 全库 15 处 ＝ 1 条错句 ＋ 1 处解释 ＋ 13 处干扰项，正面用法 0** ✅ —— **L195 立课的硬证据**。

### 5.7 撞车检测（对**全库全部英文句**，非只对 targetSentence）

```bash
cd /Users/liujun/Documents/英语听写 && node /tmp/collide.js "It was such a big fish." "The cat is in its box." "It is such a nice day."
```

**输出**：

```
【It was such a big fish.】 词数=6
   (无 ≥0.30 命中)

【The cat is in its box.】 词数=6
   0.57  L80 [answer] The cat is behind the box.
   0.57  L158 [answer] Is anyone in the box?
   0.50  L18 [target] My hat is in the box.
   0.50  L84 [target] There is nothing in the box.
   0.50  L84 [contrast.wrong] There is something in the box.
   0.50  L84 [answer] Is there anything in the box?

【It is such a nice day.】 词数=6
   0.83  L89 [answer] Is it a nice day?          ← ★ 超过 0.80 红线
   0.50  L125 [example/dialogue] It is nice.
   0.43  L89 [target] What a nice day!
```

**⇒ 三条实测结论**：
1. **L194 的目标句 `It was such a big fish.` 撞车 0 命中** ✅ —— **这是本批选句的首要标准**（项目红线是 C 层新句 Jaccard < 0.8）。
2. **L195 的目标句最高 0.57** ✅（< 0.80）—— 且最高命中的 L80／L158 是**方位课**，与「所属」无关。
3. **⚠️ `It is such a nice day.` 撞车 0.83，超红线** —— **这就是 §3.1 说的「必须避开 `nice day`」的实证**。**若写课方改用 `nice day`，L194 会变成 L89 的改写。**

### 5.8 对照卡水位（近 8 课）与难度衔接

```bash
cd /Users/liujun/Documents/英语听写 && node /tmp/selfcheck40.js 2>&1 | sed -n '/§D/,/§F/p'
```

**输出**：

```
=== §D 末课难度衔接 ===
  L189 最长分句=4  These are their books.
  L190 最长分句=5  I am learning to swim.
  L191 最长分句=5  She walked into the kitchen.
  L192 最长分句=9  We walked through the forest and across the bridge.
  L193 最长分句=9  The wind was so strong that the window broke.
  ⇒ 新句上限（L193 9 词 + 5 守门）= 14；建议 ≤10

=== §E 对照卡水位（近 8 课）===
  L186 marked=3 both=3
  L187 marked=3 both=3
  L188 marked=3 both=3
  L189 marked=3 both=3
  L190 marked=3 both=3
  L191 marked=3 both=3
  L192 marked=3 both=3
  L193 marked=3 both=3
```

**⇒ 近 8 课连续 3+3**，本批两课均按 **3 带标记 ＋ 3 双正解** 设计 ✅（§3.1.1 / §3.2.1）。
**⇒ L194／L195 各 6 词，跳变 −3 / 0，远在门内** ✅。

### 5.9 新词核对（D 层口径，逐字复刻测试的 `buildPools`）

```bash
cd /Users/liujun/Documents/英语听写 && node /tmp/pool2.js such its cat box was big fish 2>&1
```

**输出**：

```
total pool words = 677
  such         first L★未教      ← 进池全靠 L193 的错句 "The wind was such strong that…"
  its          first L87         ← 进池全靠 L87 的错句 "Its cold today."
  cat          first L3
  box          first L18
  was          first L1
  big          first L3
  fish         first L17
```

**⇒ L194 新词 = 1（`such`）／L195 新词 = 0** ✅ —— 与近期课一致（L189=1、L190=1、L191=2、L192=3、L193=1；全库 0 新词的有 87 课）。

> ⚠️ **诚实登记一个 D 层陷阱**：`such` 与 `its` **都因「错句字段进池」而在形式上「被教过」**（`buildPools` 逐字包含 `addWord(contrast.wrong)`）。**这意味着**：若写课方把 L194 的错句换成别的，`such` 的进池课号会变——**但不影响 D 层断言**（`such` 在 L193 已进池，L194 用它是安全的）。**`its` 同理**。

### 5.10 「space 从未用过」与场景间隔

```bash
cd /Users/liujun/Documents/英语听写 && node /tmp/selfcheck40.js 2>&1 | sed -n '/§F/,$p'
```

**输出**：

```
=== §F 场景间隔（距 L193）===
  lighthouse L193  间隔 0
  city       L192  间隔 1
  mansion    L191  间隔 2
  ocean      L190  间隔 3
  campus     L189  间隔 4
  forest     L187  间隔 6
  desert     L186  间隔 7
  train      L181  间隔 12
  snow       L180  间隔 13
  mystery    L157  间隔 36
  sparkle    L137  间隔 56
  island     L 71  间隔 122
  magic      L 45  间隔 148
  space 使用 = 0 次（★从未用过）
```

**⇒ 任务书「`space` 从未用过」实测成立** ✅。**本批不启用（§3.4 给理由），登记为下批候选。**

### 5.11 ⚠️ 本轮**未做**的事（诚实声明）

1. **未重跑 `grammarLessons.test.ts`**：本批为**纯研究，零代码／数据改动**（任务书要求「只做研究，不改任何代码/数据」），因此没有可跑的变更。**§5.3 的 `193 课／202 案／28 季` 均为本轮 `node` 实测的基线数字，不是测试套件输出。**
2. **未做浏览器走查**：无代码改动，无需走查。
3. **未取到 British Council 的 `so-such` 专页**（404，§4.3 已声明尝试过程）**与 OUP PEU 原件**（HTTP 202，零字节）。
4. **未评估练习（guided 6 题／practice ≥4 题）／recall／huntCase 的逐题规格**：本批只做「可做性 ＋ 拆课 ＋ 目标句 ＋ 错句 ＋ 外部依据」五层，**逐题规格留给写课批**。但已在 §5.9 提示了 D 层陷阱、在 §3.1.1/§3.2.1 给了对照卡全表。
5. **未清理并发进程的 `src/data/__r40.tmp.test.ts`**：不在本批职责内（本批零改动），仅登记（§0.4）。
6. **未验证 L89 的 5 处文案修复是否会触发任何现有断言**：本轮只做**文本层面**的事实核对（`a` 的位置），**未评估修复对 `grammarLessons.test.ts` 各断言的影响**——但依 §1.2.1 的分析，**零术语与全字段断言都不会红**（「后面／前面」不在红线词表内）。

---

### 5.12 行号引用的二次定位（因并发进程改写数据文件而必须执行）

> **触发原因**：见 §0.1.1 —— 并发进程在本批执行期间改写了 `grammarLessons.ts`，导致全部行号引用漂移（最大 +26 行）。

```bash
cd /Users/liujun/Documents/英语听写 && node -e "
const fs=require('fs');
const gl=fs.readFileSync('src/data/grammarLessons.ts','utf8');
const lines=gl.split('\n');
const find=(sub,occ=1)=>{ let n=0; for(let i=0;i<lines.length;i++){ if(lines[i].includes(sub)){ n++; if(n===occ) return i+1; } } return -1; };
console.log(find('wrong: \"This is I book.\"'));
console.log(find('wrong: \"He name is Tom.\"'));
console.log(find('a little 是「还有一点」'));
console.log(find('\"I have a lots of homework.\"'));
console.log(find('wrong: \"The wind was such strong'));
console.log(find('那一格今天不碰'));
"
```

**输出（快照 `5f3ca56…`）**：

```
:1475    L8  I book
:1499    L8  He name
:21818   L114 a little
:32703   L167 lots
:38547   L193 such wrong
:38550   L193 那一格
```

**⇒ 漂移实测（旧快照 38,687 行 → 当前快照 38,696 行）**：

| 引文 | 旧行号 | **新行号** | 漂移 |
|---|---|---|---|
| L8 `wrong: "This is I book."` | :1449 | **:1475** | **+26** |
| L8 `wrong: "He name is Tom."` | :1473 | **:1499** | **+26** |
| L114 `a little 是「还有一点」` | :21812 | **:21818** | +6 |
| L167 `I have a lots of homework.` | :32693 | **:32703** | +10 |
| L193 `wrong: "The wind was such strong…"` | :38537 | **:38547** | +10 |
| L193 `wrongMark: "such"` | :38538 | **:38548** | +10 |
| L193 `那一格今天不碰` | :38540 | **:38550** | +10 |
| L193 `options: ["so", "very", "such"]` | :38599 | **:38609** | +10 |
| L193 `He was such hungry that…` | :38638 | **:38648** | +10 |

**⇒ 报告已按新行号全量替换（19 处），并逐项复核通过。**

```bash
# 全量复核：把报告里的每个行号拿出来，打印该行内容供逐字比对
cd /Users/liujun/Documents/英语听写 && node -e "
const fs=require('fs');
const lines=fs.readFileSync('src/data/grammarLessons.ts','utf8').split('\n');
const t=fs.readFileSync('deliverables/product-strategy/user-research-such-a-2026-09-21.md','utf8');
const cites=[...new Set([...t.matchAll(/:(\d{4,5})\b/g)].map(x=>Number(x[1])))].sort((a,b)=>a-b);
console.log('共 '+cites.length+' 个行号引用');
for(const n of cites) console.log('  :'+n+'  '+(lines[n-1]||'<EOF>').trim().slice(0,100));
"
```

**输出（38 项，逐项与报告正文引文吻合 ✅）**：

```
:1475  wrong: "This is I book.",
:1499  wrong: "He name is Tom.",
:6217  "一家人都这样：your/yours、her/hers、our/ours——带 s 的那个独立用，不带的贴名词。",
:16522  wrong: "Its cold today.",
:16523  wrongMark: "Its",
:16570  "那一小撇很重要：It's 是「它是」的短版，Its 是「它的」——…"
:16579  "Its ❌ —— 少一小撇就成了「它的」"
:16588  options: ["It's", "Its", "It"],
:16610  tokens: ["Its", "cold", "today."],
:16611  wrongToken: "Its",
:16612  answer: "Its",
:16630  options: ["It's", "Its", "It is's"],
:16639  distractors: ["Its"],
:16652  distractors: ["Its"],
:16665  distractors: ["Its"],
:16848  distractors: ["Its"],
:16890  { text: "a nice day", role: "一个好天（a 站在那个「好」后面）" }
:16892  oneLineRule: "感叹「多好的…」：…（a 站在描写的词后面）。",
:16906  wrong: "What nice day!",
:16909  whyZh: "「一个天」要带 a——而且 a 站在描写的词后面：…"
:16922  whyZh: "两句都对——平着说（It's a nice day）和喊着说（What a nice day!）：…"
:16947  { label: "肯定", en: "What a nice day!", zh: "多好的天啊！", noteZh: "…a 站那个词后面。" },
:16966  rule: "感叹「多好的…」：What a + 描写的词 + 东西（What a nice day!）——a 站在描写的词后面。",
:16981  explain: "a 站在描写的词前面、紧跟着 What：What a nice day!"
:17881  wrong: "What nice day!",          ← 并发进程新增（L94）
:17882  wrongMark: null,
:17883  correct: "What a nice day!",
:17884  whyZh: "第 89 课回流：a 不能丢——What 【a】 nice day!"
:17955  explain: "第 89 课老规矩：a 站描写的词前面——What a nice day!"
:18004  distractors: ["Its"],
:18410  distractors: ["Its"],
:21818  "数不清的东西（牛奶、水、时间）是另一班人马：a little 是「还有一点」（够）…"
:32703  "I have a lots of homework."
:38547  wrong: "The wind was such strong that the window broke.",
:38548  wrongMark: "such",
:38550  whyZh: "后面跟的是「有多…」那个词（strong），前面要用 so。…那一格今天不碰。"
:38609  options: ["so", "very", "such"],
:38648  options: ["He was so hungry that he ate a big bowl.", …, "He was such hungry that …"]
```

**⇒ 其中最关键的 L89 区段（5 处「后面」＋ 2 处「前面」）**：`:16890` / `:16892` / `:16909` / `:16947` / `:16966` / `:16981` / `:17955` —— **未漂移，与首轮实测逐字一致** ✅（即 §1.2.1 的独立发现不受并发写入影响）。

> **⚠️ 方法学结论（建议入批）**：**行号是本项目研究报告里最脆弱的引用形式**。本轮实测到它在**一次并发写入里最大漂移 +26 行**。**⇒ 建议：所有报告的引文一律用【逐字字符串】作稳定锚点，行号只作「便于定位」的辅助，并必须标注快照 md5。**

## §6 不确定项（诚实登记）

| # | 不确定项 | 影响 | 建议 |
|---|---|---|---|
| **1** | **L89 的 5 处「a 站后面」要不要本批一起修？** | 这是本批**最重要的独立发现**，但**修 L89 会打破「本批零改动」的约定** | **推荐与 L194 同批修**（若拆批，L194 的 `oneLineRule` 必须自己说对，并在 `deepDive` 显式纠偏）。**这一条需要产品负责人拍板** |
| **2** | **`It was such a big fish.` 的题材够不够「小美的一天」？** | 「这么大的鱼」适合 `island`（间隔 122 课），但 `fish` 的「大」在连续剧里需要一个具体事件（钓上来？看见？） | 建议场景写「海岛码头，小美看到渔船上一条大鱼」——**具体事件留给写课方** |
| **3** | **`such a` 与 L193 的 `such a strong wind`（解释例子）的关系** | `:38550` 逐字 `such a strong wind 这么大的风` 已出现。**L194 用 `big fish` 避开了逐字重复**，但**「这么大的…」这个中文句式是一样的** | **判定不构成撞车**（一个是解释文字、一个是目标句，且英文句子不同）。**但写课方若想让 L193 的解释与 L194 呼应，可在 deepDive 回指** |
| **4** | **`space` 场景何时启用？** | 全库唯一 0 次使用的场景。本批两课题材都不适合 | **建议下批候选**：`I want to go to space.`（`want`@L4、`go`@L9、`to` 全在池里，**`space` 会是唯一新词**）。**但「愿望」是不是好题材，需产品负责人判断** |
| **5** | **`several` 是否真的该永久拒绝？** | 本批判「它是换词」（§2.2 R1），依据是「中文译「好几个」＝L114 的 `a few`」＋「无独立判据」 | **判定较硬**（有 British Council 同列 ＋ 项目批三十七判据双重支持）。**但若产品负责人认为「三四个」这个中文刻度值得教，可复议**——**注意中文「三四个」（`several` 的常见对译）全库 0 处**（§5.12），**说明这个中文词本身在本项目从未出现** |
| **6** | **`its` 的 A1 vs 本项目 194 课才教，要不要提前？** | 牛津／剑桥都标 **A1**（`its` 与 `my`／`your`／`his` 同级），**而 L8 在 8 课就教了 `my`／`her`** | **不建议提前**（L195 已是本批能给的位次）。**但建议登记为「内容排序缺口」**——本项目把 A1 的 `its` 拖到 194 课，**根因是 L8 当时只挑了 4 个标签**（`my/your/his/her`），`its` 与 `our` 都漏了（`our` 全库教学位 0，`ours` 仅 1 处提及 L33） |
| **7** | **里程碑 `can-do-m41`/`m42` 的 title 措辞** | §3.6 提议 `我能说「这么大的一个东西」`／`我能说「它的」`，未验证与 m35–m40 的句式一致性 | 写课批按 m35–m40 实际句式再定 |
| **8** | **`its` 的 I2（`It's box is small.`）会不会与 L87 的错句**在用户心里**打架？** | §1.3.1 判「互补」，但**这是本研究员的价值判断，不是断言** | 建议 L195 的 `deepDive` 显式做「同一个读音，两张脸」卡（**这是本项目已成熟的模具**：L193 逐字 `so 的三张脸`） |
| **9** | **并发进程实时改写生产数据文件（本轮首次实测）** | 本批执行期间 `grammarLessons.ts` 被改写 ≥2 次（L94 新增 6 张卡），**行号引用最大漂移 +26 行**（§0.1.1 / §5.12） | **建议入批为方法学纪律**：①任何研究报告的引文以**逐字字符串**为稳定锚点；②行号须标注快照 md5；③全库词频统计必须排除并发注入的 `__*.tmp.test.ts`（§0.4）。**这一条超出本批职责，需产品负责人裁定是否立项** |
| **10** | **L94 新增的 6 张卡是否与 L89 形成重复教学？** | 并发进程给 L94 加了 `wrong: "What nice day!"`（`:17881`），**这是全库第二遍教「漏 `a`」** | §1.1.1 已按「L194 不得再用漏 `a`」处理 ✅。**但 L94 那 6 张卡本身的设计质量不在本批评估范围**（它们由并发进程写入，本批只观测到事实）。**建议产品负责人复核 L94 的对照卡是否越过了它的立岗点**（L94 是 `grammarLabel: "校门口收口"` 的收口课） |



**§5.12 补充核查（不确定项 5 的中文侧证据）**：

```bash
cd /Users/liujun/Documents/英语听写 && node -e "
const L=require('/tmp/lib.js');
const gl=L.readGL();
for(const t of ['三四个','一点点','不止两个','好几个']){
  console.log('['+t+'] 全库 '+L.lines(gl,new RegExp(t,'g')).length+' 行');
}"
```

**输出**：

```
[三四个]     全库 0 行
[一点点]     全库 0 行
[不止两个]   全库 0 行
[好几个]     全库 65 行
```

**⇒ 「三四个」（`several` 的常见中文对译，`/tmp/... 逐字 iciba 侧「好几个」也是 `several` 的对译之一`）在本项目全库 0 处** —— **说明 `several` 没有中文侧的教学锚点**，**独立支持 R1 拒绝** ✅。

---

## 附录 A：本批一句话结论

> **`such a` 可做，`its` 可做——本批产出 2 课（L194 `It was such a big fish.` 6 词 1 新词／L195 `The cat is in its box.` 6 词 0 新词）；
> 三条 `such a` 错句（`a such` ／ `such big` ／ `so a`）机制独立、剑桥两页与 Longman 独立背书、且与 L89 的 `What nice day!`（漏 `a`）**是不同坑**（那是「该有没有」，这是「有了但放错位置」）；
> `several`／`a bit`／`lots of` 明确拒绝（都是「刻度换格」，British Council 逐字把它们与 `a few`／`a little`／`a lot of` 同列）；
> ⚠️ **本批独立发现一个真缺陷：L89 有 5 处把「`a` 站在描写的词后面」说反了**（`What a nice day!` 里 `a` 在 `nice` 前面，索引 1 vs 2），且该错误已外溢至 L94 的 `explain`（逐字 `第 89 课老规矩：a 站描写的词前面`）——**建议与 L194 同批修复**。

## 附录 B：本批脚本清单（可复跑）

| 脚本 | 用途 |
|---|---|
| `/tmp/lib.js` | 课程块索引（193 课）＋行号＋`bd()` 真词正则＋`longestClause()` |
| `/tmp/selfcheck40.js` | §5 全部自核命令（§A 教学位／§B 结构级／§C 快照／§D 难度／§E 对照卡／§F 场景） |
| `/tmp/pool2.js` | 词表池首见课（逐字复刻 `buildPools`） |
| `/tmp/gate.js` | 「错误用法首见课」检测（区分「进池」与「正面教过」） |
| `/tmp/collide.js` | 对**全库全部英文句**做 Jaccard 撞车（最严口径） |
| `/tmp/diff.js` | 难度分布 ＋ 场景统计 |
| `/tmp/cite.js` | 逐字引用行号定位 |
| `/tmp/art.js` | 冠词相关课与带标记错句扫描 |
| `/tmp/strip2.js` | 抓取页剥标签（转纯文本供逐字引用） |
