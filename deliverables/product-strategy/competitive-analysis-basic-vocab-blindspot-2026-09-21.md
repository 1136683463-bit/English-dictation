# 跨源竞品分析 · 基础词盲区的跨源档位判定（第三十六批 · 覆盖面盲区专项）

**日期**：2026-09-21 ｜ **分析人**：竞析（产品战略团队 · 竞品/跨源分析师）
**类型**：覆盖面盲区专项（不是 B 档前沿普查——本轮的对象是「188 课里 GL 词边界＝0 的极基础高频词」）
**上游**：`b-tier-frontier-survey-2026-09-20.md`（批三十一 26 项普查）／`competitive-analysis-b-tier-closure-2026-09-21.md`（批三十五 · B 档收口）
**我方基线**：**188 课（L1–L188）／197 案／28 季**（本轮独立复算：`grammarLessons.ts` 中 `number:` 取值 1–188 **无跳号无重号**；`huntCases.ts` 的 `number:` 197 条；`grammarSeasons.ts` 的 `season-*` 28 组、末组 `season-28` 区间 182–188）

---

## §0 本批要回答的问题与三条前置结论

| # | 问题 | 处置 |
|---|---|---|
| 1 | 主理人实测为零的 **22 项**（任务书写 23，清单实为 22——见 §0.2 口径说明），逐项什么档位？是语法缺口还是词汇缺口？ | **§1（逐项）＋ §4.1（汇总表）** |
| 2 | 「该进语法线」与「该进词汇线」的分界线在哪？跨源依据是什么？ | **§2** |
| 3 | 我方已教的相关家族，缺口有多大？ | **§3（逐族实测）** |
| 4 | 该做哪几课？每课教什么？ | **§4** |

### 0.1 先行校正：主理人的两个数字与我的复算差 1%（口径已对齐）

主理人用 `the`＝2764／`good`＝606 验证文件完整。**本轮独立复算结果**：

| 口径 | `the` | `good` | 说明 |
|---|---|---|---|
| `\bthe\b`（普通词边界，不归一弯引号） | **2778** | **606** | 主理人的 `good`＝606 **与之逐字吻合** |
| `(?<![A-Za-z'-])the(?![A-Za-z'-])`（本轮口径，含撇号与连字符排除） | **2774** | **598** | 本报告全文一律用**此口径** |
| `\bthe\b`（归一弯引号后） | 2778 | 606 | 与第一行同 |

**⇒ 差 1% 的来源已定位**：`'d`／`'s` 这类**撇号缩写**会把 `\b` 判定为词边界（`'the` 里 `the` 前面是 `'`，`\b` 成立），而本轮的 lookbehind 集合会排除它们；`good` 的 8 处差值全在 `good-bye`／`good-looking` 一类**连字符复合词**上。**结论：两个口径都验证了「文件完整」，不是文件缺内容**——**22 项在两个口径下全部仍为 0**（§1.0 表用的是本轮口径）。**这条校正须登记**：主理人的 2764 与本轮的 2774 相差 10，本轮无法复现 2764 这个精确值（见 §5 项 1）。

### 0.2 一轮前置结论：本批 22 项**全部不是「B 档缺口」**

**B 档的定义**（沿用批三十一至批三十五）：**有规则页无课程位，或造词成本可控**。
本批 22 项里，**没有一项的规则页形态是「有独立语法页但没排课」**——这是一次**性质不同的缺口**：

| 本批落点分布（**互斥分类**，逐项依据见 §1） | 项数 | 项名 |
|---|---|---|
| **A. 只有词典条目**（Cambridge 语法侧 302 或本来无页） | **8** | `try`／`sad`／`fine`／`slow`／`young`／`dirty`／`excuse me`／`welcome` |
| **B. 有「专属对切/易混页」**（页题含该词，但形态是 `X or Y?`） | **6** | `their`（`There, their or they're?`）／`through`（`Across, over or through?`）／`around`（`Around or round?`）／`bring`（`Bring, take and fetch`）／`wake`（`Wake, wake up or awaken?`）／`different`（`Different from, different to or different than?`） |
| **C. 有「以该词为题的独立页」**（非易混类） | **6** | `hope`（`Hope` ＋ `Word patterns: hope`）／`learn`（`Word choice: learn, teach, or study?`）／`important`（`Part of speech: important`）／`thank you`（`Please and thank you`）／`hello`（`Greetings and farewells: hello, goodbye, Happy New Year`）／`okay`（`Okay, OK`） |
| **D. 只在「大类页内的名单/表格」出现**（该页页题不含此词，无自己的页） | **2** | `theirs`（Cambridge `Pronouns: possessive` 八行表内一格）／`decide`（Cambridge `Verb patterns` 的 to-inf 词阵 ＋ BC 第 18 课正文名单） |
| **合计** | **22** | **⚠️ 见 §0.4 的口径说明** |
| （追加复核项）`during` | 1 | **介词家族普查中浮出的「已用未教」项**（GL 11 处全在 L98 的错题里） |

**⚠️ 一处必须登记的口径差**：**主理人清单逐字为 2（物主）＋2（介词）＋6（动词）＋7（形容词）＋5（交际）＝ 22 个词**，任务书写「23 项」。**本轮按 22 项逐项判定，并把介词家族普查中浮出的 `during`（已用未教）作为第 23 项一并复核**（§3.2／§4.1 第 23 行）——**若主理人的 23 项另有第 23 个词，请指出，我下批补判**（§5 项 0）。

**⇒ 关键判断（本轮最重要的一条）**：**本批 22 项里，「有规则页无课程位」这个 B 档特征真正成立的只有 6 项**（§0.2 的 A 类 8 项**连规则页都没有**，只剩词典条目）。**B 档缺口是「有规则页、只差排课」；本批的主体（A 类 ＋ B 类的一半）是「上游压根没把它当语法点」。** ⇒ **处置路径完全不同：本批主体应移交词汇线，语法线只领其中的「同架子缺格」与「有真实并列/禁用规则」部分**（§2／§4）。

### 0.3 二轮前置结论：主理人点名的六组接口，跨源**四组判「同架子」，两组判「非同轴」**

| 主理人问的接口 | 跨源是否有「一个单元」 | 判定 |
|---|---|---|
| `their` ↔ 我方 L8 `my`/`her` | **✅ 有。BC 参考层 `Possessives: adjectives` 是一张七格表；Cambridge `Determiners (the, my, some, this)` 把 `Possessives` 单列一类** | **同一架子，缺格成立**（§1.1） |
| `through`/`around` ↔ 我方 L18／批十三 位置词 | **⚠️ 半有。上游不把它们与 `in/on/at` 合讲，而是挂在 `Easily confused words` 下的「三方向词对切页」；`Across or through?`/`Movement`/`Time` 三个 h2/h3** | **同家族但不同位；`through` 有结构增量，`around` 无**（§1.2） |
| `learn`/`decide`/`hope`/`try` ↔ 我方 L15 `want to` | **✅ 有。Cambridge `Verb patterns: verb + infinitive or verb + -ing?` 的 h2 逐字 `Verbs followed by a to-infinitive`，名单里 `want`／`decide`／`learn`／`hope`／`try` **同格并列**；Murphy 中级 U54 标题逐字 `Verb + to… (decide to… / forget to… etc.)`** | **同轴的，缺员成立**（§1.3） |
| `sad`/`fine`/`slow`/`young`/`dirty`/`important`/`different` ↔ 我方 L4／L125 | **⚠️ 上游按「形容词」整体当一个单元（BC `Adjectives` 七分节、Cambridge `Adjectives: order` 十格表），但不把个体形容词当语法点** | **整体是语法缺口，个体是词汇缺口**（§2 的分界线核心） |
| `hello`/`thank you`/`excuse me`/`welcome`/`okay` ↔ 配不配当语法教 | **❌ 上游当「Functions / Spoken English」大类，不当语法**（Cambridge 面包屑逐字 `Grammar > Using English > Functions`／`> Spoken English`） | **全部移交词汇/功能短语线**（§1.4） |
| `bring`/`wake` ↔ 我方「昨天版」 | **⚠️ 上游把它们放在 `Easily confused words`（辨析页）＋`Table of irregular verbs`（一张表）** | **`bring` 半个语法缺口（有真实原话规则），`wake` 无**（§1.5） |
| `theirs` ↔ 批十七 `mine`/`yours` | **✅ 有。Cambridge `Pronouns: possessive` 页一张八行表，`they→their→theirs` 是同一行** | **同一架子，缺格成立**（§1.1） |

---

## §1 二十二项逐项跨源判定（＋`during` 复核）

### 1.0 复算：22 项全为真零（四文件独立复现）

**口径**：词边界 `(?<![A-Za-z'-])…(?![A-Za-z'-])`（弯引号先归一为直引号），四文件全库命中。

| 项 | GL | HC | GS | GZT | 判 |
|---|---|---|---|---|---|
| `their` | **0** | 1 | 0 | 0 | **真零**（HC 那 1 处是案 37 的认读 token） |
| `theirs` | **0** | 0 | 0 | 0 | **真零** |
| `around` | **0** | 0 | 0 | 0 | **真零** |
| `through` | **0** | 0 | 0 | 0 | **真零** |
| `learn` | **0** | 2 | 0 | 0 | **真零**（HC 案 20 作错题 token） |
| `decide` | **0** | 0 | 0 | 0 | **真零** |
| `hope` | **0** | 1 | 0 | 0 | **真零**（HC 案 29 认读） |
| `try` | **0** | 0 | 0 | 0 | **真零** |
| `bring` | **0** | 3 | 0 | 0 | **真零**（HC 案 38／58 作错题 token） |
| `wake` | **0** | 0 | 0 | 0 | **真零** |
| `sad` | **0** | 0 | 0 | 0 | **真零** |
| `fine` | **0** | 0 | 0 | 0 | **真零** |
| `slow` | **0** | 0 | 0 | 0 | **真零** |
| `young` | **0** | 0 | 0 | 0 | **真零**（`younger` 亦 0） |
| `dirty` | **0** | 0 | 0 | 0 | **真零** |
| `important` | **0** | 0 | 0 | 0 | **真零** |
| `different` | **0** | 0 | 0 | 0 | **真零**（`difference`／`differently` 亦 0） |
| `hello` | **0** | 0 | 0 | 0 | **真零**（`hi` 仅 L1 一处 1 次） |
| `thank you` | **0** | 0 | 0 | 0 | **真零**（`thanks` 11 处全在 L70，`thanking` 0） |
| `excuse me` | **0** | 0 | 0 | 0 | **真零**（`excuse` 一词全库 0） |
| `welcome` | **0** | 3 | 0 | 0 | **真零**（HC 案 40／49／50 的题面招呼语） |
| `okay` | **0** | 0 | 0 | 0 | **真零**（`ok` 缩写亦 0） |

**⇒ 22 项全部真零，主理人的实测复现成立。** 其中 8 项在 HC 有认读痕迹（**无一进 GL、无一作教学位**）。

**⚠️ 一条必须同表登记的「准零」**：`theirs` 的**近形** `hers` GL 18／`ours` GL 1／`yours` GL 21／`mine` GL 174——**长版家族只缺 `theirs` 一格**（§3.1）。

---

### 1.1 物主词组：`their` / `theirs`

**① 跨源逐字证据**

- **Cambridge `/grammar/british-grammar/pronouns-possessive`**（**HTTP 200，title 逐字核过：`Pronouns: possessive ( my, mine, your, yours, etc.) - Cambridge Grammar`**；面包屑逐字 `Grammar > Nouns, pronouns and determiners > Pronouns > Pronouns: possessive (my, mine, your, yours, etc.)`）：**H1 一条，H2 两条**（`Typical errors`／`Learn more with +Plus`）——**即：该页没有把 «determiner» 与 «pronoun» 分成两个 h2，而是用一张表并列**。逐字正文：
  - "**We use pronouns to refer to possession and 'belonging'.**"
  - "**There are two types: possessive pronouns and possessive determiners.**"
  - "**We use possessive determiners before a noun.**"
  - "**We use possessive pronouns in place of a noun:**"
  - **表格逐字（八行，本轮逐格抄回）**：表头 `personal pronoun`／`possessive determiner`／`possessive pronoun`；行：`I｜my｜mine`／`you (singular and plural)｜your｜yours`／`he｜his｜his`／`she｜her｜hers`／`it｜its｜its*`／`we｜our｜ours`／**`they｜their｜theirs`**／`one｜one's｜one's*`
  - **⚠️ 表格下方第一个例句就是 `their` / `theirs` 的对切**："That's not [determiner]**their** house. [pronoun]**Theirs** has got a red front door."（**两个词在同一个例句里成对出现**）
  - **`Not:` 五条逐字**：`Not: Are those gloves her's?`／`Not: … proud of it's ability …`／`Not: … get the my hair cut …`／**`Not: It's your.`**（**「短版不能光站句尾」的明文禁令——正是我方 L112 已教的那条**）／**`Not: Lots of ours friends …`**（**长版误用为短版的禁令**）
- **Cambridge `/grammar/british-grammar/determiners-the-my-some-this`**（**title 逐字已核**）：逐字 "**Determiners include the following common types:**" ＋ 五类名单逐字 `Articles: a/an, the`／`Demonstratives: this, that, these, those`／**`Possessives: my, your, his, her, its, our, their, x's (possessive 's)`**／`Quantifiers: (a) few, fewer, (a) little, many, much, more, most, some, any, etc.`／`Numbers: one, two, three, etc.`；**页下名单逐字（横向抄回）**含 `her`／`his`／`my`／`their`／`the`／`these`／`all`／`every` 等（**`their` 单列一条目**）
- **BC 参考层 `/grammar/english-grammar-reference/possessives-adjectives`**（**title 逐字 `Possessives: adjectives`**）：**表逐字** `I / me / my`／`you / you / your`／`he / him / his`／`she / her / her`／`it / it / its`／`we / us / our`／**`they / them / their`**；例句逐字 `That's our house.`／`My car is very old.`／`He's broken his arm.`／`She's washing her hair.`；**唯一禁令逐字** "That bird has broken its (NOT it's) wing."
- **BC 参考层 `/grammar/english-grammar-reference/possessives-pronouns`**（**title 逐字 `Possessives: pronouns`**）：**表逐字** `I｜me｜my｜mine`／`you｜you｜your｜yours`／`he｜him｜his｜his`／`she｜her｜her｜hers`／`it｜it｜its｜-`／`we｜us｜our｜ours`／**`they｜them｜their｜theirs`**；**`Not:` 逐字含 `NOT Is that car your's/her's/our's/their's?`**（**把 `their's` 与其余三个一起点名——即「`theirs` 不能写撇号」**）
- **BC 课程层 `Possessive 's`**（**A1 Elementary ＋ A2 Pre-intermediate**）：全文**只教名词 `'s`**，**不含任何物主限定词/代词**（本轮实读：该页 "possessive 's is used to talk about the relationship between people or to say who owns something"，**`their`／`theirs`／`mine` 全页 0**）
- **BC A1-A2 十八课全目（本轮实取 18 条标题）**：`Adjectives and prepositions`／`Adjectives ending in '-ed' and '-ing'`／`Articles: 'a', 'an', 'the'`／`Articles: 'the' or no article`／`Comparative adjectives`／`Infinitive of purpose`／`Nouns: countable and uncountable`／`Past continuous and past simple`／**`Possessive 's`**／`Prepositions of place: 'in', 'on', 'at'`／`Prepositions of time: 'at', 'in', 'on'`／`Present simple`／`Present simple: 'have got'`／`Present simple: 'to be'`／`Quantifiers: 'few', 'a few', 'little' and 'a bit of'`／`Question forms`／`Using 'there is' and 'there are'`／`Verbs followed by '-ing' or infinitive`——**「物主词」作为一个单元的课位＝0**（**唯一沾边的 `Possessive 's` 是名词所有格**）
- **Cambridge 词典**（**`epp-xref dxref` span 实存，标位可用**）：`their` → `determiner` **A1**（义项一逐字 "of or belonging to them:"）／**义项二 B1**（逐字 "used to refer to one person in order to avoid saying \"his or her\":"——**单数 they 的用法，本轮不建议进 A1 线**）；`/dictionary/english/theirs` → `pronoun` **A2**，title 逐字 `THEIRS | English meaning - Cambridge Dictionary`，定义逐字 "the one(s) belonging to or connected with them:"
- **中文侧**：**`english.cool/possessive/` 200**（页题逐字「**所有格（possessive）是什麼？有哪些？用法整理！**」）——**H2 四条**：`（一）人稱代名詞的所有格`／`（二）名詞的所有格`／`（三）事物的所有格`／`（四）雙重所有格`；**（一）节内表格逐字含 `they → their office 他們的辦公室`**（**逐格抄回：主格 `they`／所有格 `their office 他們的辦公室`**），并附明文提醒「**⚠️ 特別留意 it 的所有格是 its，直接加 s 就好，沒有 ’ 唷！**」。**`english.cool/possessive-pronouns/` 200**（页题逐字「**所有格代名詞是什麼？怎麼用？（含例句）**」）——**表逐字含「他們/它們/牠們的 Their food is yummy. ＝ Theirs is yummy.」**，且**页末明文总结逐字**：「**看完應該不難發現，以上除了 mine、his 和 its 之外，其他都是把所有格…**」（**即把 `theirs` 归入「所有格 + s」的规则组**）
- **中文侧 404（本轮实测）**：`english.cool/their/` → **404**（**single-word 无专文**——**但这不是缺口**：它被 `possessive` 与 `possessive-pronouns` 两篇**整表收录**）

**② 是语法缺口还是词汇缺口：判「语法缺口」**

三条判据，全部来自上游原话：
1. **上游把它当一个单元**——BC 的表**以人称代词为主轴七行铺开**，Cambridge 的表**同一行并列 determiner/pronoun**；**`their` 与 `my`/`her` 在同一张表的同一列**。
2. **它有结构规则，不是「记一个词义」**——`their` 的规则是「**站名词前**」（与 `my`/`her` 同规则）；`theirs` 的规则是「**不能跟名词、不能加撇号、可作句尾**」（BC 明文 `NOT Is that car their's?`；Cambridge 明文 `Not: It's your.` 的同型）。
3. **我方 L112 已教这条规则的「长版/短版」判据**——逐字 "东西是谁的，看后面有没有词：后面跟着东西，用短版 my（my book）…后面空了、句尾收住，用长版 mine"（L112 `oneLineRule`）⇒ **`theirs` 是这条已教规则的直接外推**。

**③ 档位：`their` ＝ B＋（本批最高）／`theirs` ＝ B**

- **`their` 给 B＋ 的理由**：**① 跨源四层（Cambridge 语法页一张八行表 ＋ BC 参考层两张表 ＋ BC 课程层 `Possessive 's`（把「谁的」这个语义格占住了）＋ 中文侧两篇整表）**；**② CEFR A1（本批仅有的几个 A1）**；**③ 与 L8 是同一句话术的换格**（L8 `oneLineRule` 逐字 "my / your / his / her 是小标签，永远贴在东西或人的前面"——**`their` 就是这张名单的第 7 格，且 L8 的名单里已经列了 `your`/`his`，等于半数成员已教**）；**④ 3 标记可满足**（`their` / `there` / `they're` 是 Cambridge 单开一页的三选一，见下）。
- **`theirs` 给 B（不给 B＋）**：**①「不跟名词」这条规则的认知负荷低于 `their`**，且我方 L33／L112 已把 `mine`／`yours`／`hers` 教过（GL 174／21／18）；**② 它的缺口是家族第 4 格**（`mine`/`yours`/`hers` 已教，`ours` GL 1 只算认读，`theirs` 真零）——**1 课装 1 格偏轻，应与 `their` 合课**（§4.2）。
- **⚠️ 一条新证据（本轮独取）**：**Cambridge `/grammar/british-grammar/there-their-or-they-re`**（**HTTP 200，title 逐字 `There, their or they’re ? - Grammar - Cambridge Dictionary`**；面包屑逐字 `Grammar > Easily confused words > There, their or they’re?`）——**逐字 "There, their and they’re are commonly confused in English, as they sound the same."**、**"There is an adverb which refers to places: The shop you need is over there."**。**⇒ 上游为 `their` 单开了一张三选一页（本批 22 项里，只有 `their`／`bring`／`wake`／`different`／`through`／`around` 六项有「专属页/专属对切页」这个待遇）。**

**④ 能否撑一课：`their` 单独 1 课（可撑）／`theirs` 合入同课（撑不起独立课）**

- **`their` 的 3 条可标记错**（全部来自上游逐字）：① `their` ↔ `there` 混（Cambridge 页 H1 三选一逐字）；② **`their` 后漏东西**（`This is their.` → 应用 `theirs`；依据 Cambridge `Not: It's your.` 同型禁令）；③ **`they` 与 `their` 位置混**（`They is my friend.` 型 → 主格/标签格之辨；依据 L8 已教话术「主角位 vs 标签位」）。
- **成本核算**：`their` 造 1 个词位；`theirs` 造 1 个词位；**`there` GL 已很厚**（`there` 家族：`there is`／`there are` 两课已教）⇒ **三选一的错面是现成的**。

---

### 1.2 介词组：`through` / `around`

**① 跨源逐字证据**

- **⚠️ 假页复现（本轮最重要的方法学发现）**：`/grammar/british-grammar/through` → **HTTP 200，但页面 H1 逐字是 `Across, over or through?`**（不是 `Through`）；`/grammar/british-grammar/around` → **HTTP 200，但 H1 逐字是 `Around or round?`**。**两个 slug 的 `<link rel="canonical">` 都指向自己**（`.../british-grammar/through`／`.../british-grammar/around`）——**即：它们不是假页，而是 Cambridge 用「短 slug」承载了「对切页」的正文**。**⇒ 口径：`through` 与 `around` 都「没有以自己命名的独立规则页」，但它们各有一张挂着易混词大类的对切页**（详见 §5 项 2 的校正说明）。
- **Cambridge `/grammar/british-grammar/across-over-or-through`**（**title 逐字核过**；面包屑逐字 `Grammar > Easily confused words > Across, over or through?`）：**H2 四条**逐字 `Across`／`Over`／**`Across or through?`**／**`Across, over and through: typical errors`**；**h3 两条**逐字 `Movement`／`Time`。关键正文逐字：
  - `Across` 节："**We use across as a preposition (prep) and an adverb (adv). Across means on the other side of something, or from one side to the other of something which has sides or limits such as a city, road or river:**" ＋ `We took a boat [PREP]across the river.`
  - `Over` 节："**We use over as a preposition and an adverb to refer to something at a higher position than something else, sometimes involving movement from one side to another:**"
  - **`Across or through?` → `Movement` 节（本批最硬的一条介词规则）**："**When we talk about movement from one side to another but 'in something', such as long grass or a forest, we use through instead of across:**" ＋ `I love walking through the forest. (through stresses being in the forest as I walk)` ＋ **`Not: I love walking across the forest.`** ＋ `When my dog runs through long grass, it's difficult to find him.` ＋ **`Not: When my dog runs across long grass …`**
  - **`Time` 节**："**When referring to a period of time from start to finish, American English speakers often use through where British English speakers say from … to/till …**" ＋ `The office is open Monday through Friday, 9 am–5 pm. (preferred British form: from Monday to Friday)` ＋ **Warning**："**We use over, not through, to refer to periods of time from start to finish when a number is specified (of days, weeks, etc.):**" ＋ `Over the last few days, I have been thinking a lot about quitting my job.`
  - **`typical errors` 三条**逐字："**When moving from one side to another while surrounded by something, we use through not across:**"（`We cycled through a number of small villages.`／**`Not: We cycled across a number of small villages.`**）／"**When we talk about something extending or moving from one side to another, we use across not on:**"（`The papers were spread across the table.`／**`Not: The papers were spread on the table.`**）／"**We don't use through when we're talking about periods of time from start to finish and we mention a specific number of days, weeks, etc:**"（`We haven't seen each other much over the last four years.`／**`Not: We haven't seen each other much through the last four years.`**）
- **Cambridge `/grammar/british-grammar/around-or-round`**（**title 逐字 `Around or round ? - Grammar - Cambridge Dictionary`**；面包屑逐字 `Grammar > Easily confused words > Around or round?`）：**H2 ＝ 0、h3 ＝ 0（整页连续正文）**；**`Not:` ＝ 0、Warning ＝ 0**。正文逐字：
  - "**Around and round are prepositions or adverbs. We use around and round when we refer to movements in circles or from one place to another. Around and round can both be used. Around is more common in American English. Round is a little more common in speaking:**"
  - `The earth goes round the sun. (movement in circles)`／`We spent a very pleasant day walking round the town. (movement from one place to another)`／`Now they are retired, they are planning a trip around the world.`
  - "**We also commonly use around and round in phrasal verbs:**"（`Can you pass these application forms around to all the people present?`）
  - "**Around and round also mean 'in different places' and 'here and there':**"（`I know she's around somewhere in the office.`）
  - "**Around can also mean 'approximately':**"（`I'd say around 500 years.`）
  - **页尾 `See also:` 三链逐字**：`About`／`Approximations (around four o'clock)`／`Verbs`
- **Cambridge 词典（`epp-xref` span 实存）**：`through` → `preposition` **A2**（义项一逐字 "from one end or side of something to the other:"）**＋ B1**（"from the beginning to the end of a period of time:"）；**第二组 preposition 义项 B1／B1**（"as a result of:"／"by; using:"）；`adjective` **C1**。`around` → `preposition` **A2／A2**（"in a position or direction surrounding, or in a direction going along the edge of or from one part to another (of):"／"in order to face in the opposite direction:"）；`adverb` **A2**（"approximately:"）。
- **BC 层（三档 68 课全目逐条复点，沿用批三十二／批三十四已落盘的 18＋36＋14 三份清单）**：**A1-A2 十八课里「移动方向词」课位 ＝ 0**（`Prepositions of place: 'in', 'on', 'at'` **只讲 in/on/at 三个，本轮直读正文逐字确认：`in`／`on`／`at` 三节，`under`／`behind`／`between`／`next to`／`in front of` / `around`/`through` **全页 0**）；**B1-B2 三十六课无介词课**（唯一沾边 `Verbs and prepositions` 是**动词+介词搭配**，不是方向词）；参考层**无 `Prepositions` 页**（`Adjectives` 页的导航里介词类目缺失）。
- **中文侧**：**`english.cool/through/` 200**（页题逐字「**「through」用法是？一次搞懂意思與常見例句！**」）——**H2 两条**：`through 的意思和用法`／`through 的道地口語搭配`；**h3 五条逐字**：`1. through 表示「穿過、貫穿」`／`2. through 表示「透過、藉由」`／`3. through 表示「從頭到尾、完成」`／`4. Monday through Friday 是美式講法`／`5. through 當介系詞 vs 副詞`。**正文逐字（与我方 L18 同轴）**：「**through 跟 across 都翻成「過」，但畫面完全不一樣。through 是「鑽進某個立體空間裡再出來」…across 是「從某個面的這一側到另一側」，比較平面…你穿過森林是 through，但走過廣場那種「橫越一個平面」就是 across。**」——**⚠️ 这条与我方 L18 的「in/on/at 三格口诀」是同一手法（画面法）**。**`english.cool/around/` → 404**（**全站无 `around` 专文**）；**`english.cool/places-prepositions/` 200**（页题逐字「**【地方介系詞】In, On, At？地點要用哪個？**」）——**h3 名单逐字共 14 条**：`點：at + 某個定點`／`面：on + 接觸面`／`空間：in + 大範圍的地點/內部`／…／`above 在上方`／`over 在正上方`／`below 在下方`／`under 在正下方`／`in front of 在前方`／`in back of / behind 在後方`／`by / beside / next to 在旁邊`／`between 在～之間`／`among 在～之中`／`near 在附近`——**⚠️ 这份 14 项名单里 `around` 与 `through` 都缺席**（**中文侧把「地点介词」与「移动方向词」明确分成两篇，`through` 单独成篇、`around` 无篇**）。
- **中文侧第二站**：`letmeenglish.com` sitemap **HTTP 526（Cloudflare 源站错误）**——**本轮完全不可达**（见 §5 项 3）。

**② 是语法缺口还是词汇缺口：`through` ＝ 语法缺口／`around` ＝ 词汇缺口**

- **`through` 判语法缺口**：**它有真正的结构规则，且上游为这条规则单开了 h3 ＋ 三条 `Not:`**（`through` vs `across` 的「在内部 / 在面上」之分）。**这条规则与我方 L18 已教的「in＝里面」是同一张图的两个用法**（L18 逐字 "in 是「在里面」（in the box）"）——**`through` 的增量是「从里面穿过去」，是 in 的移动版**。
- **`around` 判词汇缺口**：**上游整页没有一条规则，唯一定义是「圆形或从一处到另一处」（and `round` 是变体）；`Not:` ＝ 0、Warning ＝ 0**；**两条语义（大约 ≈ `about`；在附近 ≈ `near`/`here and there`）在我方都已有词**（`about` GL 38／`near` GL 29）。**⇒ 它只是「多一个词」，不是一个结构。
- **⚠️ 一条反直觉的统计事实（本轮实测）**：**`during` GL 11 处全是「反例」**——L98 逐字 `wrong: "During I was reading, he was sleeping."`（`whyZh` 逐字 "**during 后面只能跟「名字」（during the class），跟不了小句子**"）。**即：我方唯一一次出现 `during` 是拿它当错题**。**⇒ `during` 属于「已用未教」，与 `through`/`around` 的「真零」是两类**（**登记进 §3.2**）。

**③ 档位：`through` ＝ B／`around` ＝ C**

- **`through` 给 B**：**① 规则页 ✅（h3 一节 ＋ 三条 `Not:`/Warning，本批最厚的「真规则」之一）**；**② 课程位 ❌**（BC 三档 0；**但本轮新取到一条关键落点**：BC A1-A2 第 6 课 `Infinitive of purpose` 的 `go to` 结构与我方 L9 同轴——**说明 BC 把「去哪儿」放在 `to` 上，不放在方向词上**）；**③ CEFR A2 首义（标位可用）；④ 空缺格（GL 真零）**；**⑤ 3 标记可满足**（见下）。
- **`around` 给 C**：**① 无规则（H2＝0，`Not:`＝0）**；**② 无课程位（BC 三档 0 ＋ 参考层 0）**；**③ 中文侧 404（无专文）**；**④ 唯一增量是「≈ about」的副词义（A2）与「in different places」——都是同义换词**。**C 档定义三条全中**（只有零散例句、无规则页、无课程位）。
- **⚠️ 与我方已教的关系（先划界）**：**`through` 与我方批十三的 `in front of`/`behind`/`next to`/`between` 不是同一格**——前四者是**静态位置**，`through` 是**移动路径**。**给 `through` 定档时必须说清这一点**：它要接的是 **L9 `go to + 地点`**（GL 159 处，`go to` 极厚），**不是批十三的位置词家族**。**⇒ 接口课是 L9（或 L18 的「里面」图），不是 L79–L81。**

**④ 能否撑一课**

- **`through` 单独 1 课（可撑）**——**3 条可标记错**：① `across` 误用（`I walked across the forest.` → `through`；**Cambridge 逐字 `Not:`**）；② `on` 误用（`The papers were spread on the table.`；**Cambridge `typical errors` 逐字 `Not:`**）——**⚠️ 但这条是 `across` 的错，我方未教 `across`，须换成 `in` 型**；③ **时段型的 `through` 误用**（`through the last four years` → `over`；**Cambridge Warning 逐字 `Not:`**）——**⚠️ 我方未教 `over`，这条建议**只作认读**，不入练习**。**⇒ 实际可用的新错只有错 ① 一条**（**这一条决定了 `through` 只能做「跟 `across` 对切」的半课，不是一个完整课**——**降档风险见 §5 项 4）。
- **`around` 撑不起（不做）**。

---

### 1.3 基础动词组：`learn` / `decide` / `hope` / `try`

**① 跨源逐字证据（本组的证据是本批第二厚的一组）**

- **Cambridge `/grammar/british-grammar/verb-patterns-verb-infinitive-or-verb-ing`**（**title 逐字核过：`Verb patterns: verb + infinitive or verb + -ing? - Cambridge Grammar`**；面包屑逐字 `Grammar > Verbs > Verb patterns > Verb patterns: verb + infinitive or verb + -ing?`）：**H2 六条逐字**：
  1. **`Verbs followed by a to-infinitive`**
  2. `Verbs followed by -ing`
  3. `Verbs followed by a to-infinitive or -ing`
  4. `Verbs followed by an infinitive without to`
  5. `Verbs followed by -ing or an infinitive without to`
  6. `Verbs followed by a direct object and a to-infinitive`
- **H2-1 的动词名单（本轮逐词抄回，按原序）**：`afford, demand, like, pretend, agree, fail, love, promise, arrange, forget, manage, refuse, ask, hate, mean (= intend), remember, begin, help, need, start, choose, **hope**, offer, **try**, continue, intend, plan, **want**, **decide**, **learn**, prefer`——**⚠️ 主理人点名的四个词（`learn`／`decide`／`hope`／`try`）与我方已教的 `want` 在同一个 h2 的同一张名单里**，**这是「同轴」最硬的原文级证据**。
- **该节例句逐字（含我的四个目标词中的三个）**：`She hopes to go to university next year.`／`My mother never learnt to swim.`／`Did you remember to ring Nigel?`／`I can't afford to go on holiday.`／`It began to rain.`
- **变义小节例句逐字**：`I didn't mean to make you cry.`／**`I tried to email Simon but it bounced back.`**（**`try to` 的逐字例句，落在我四个目标词之一**）
- **全页 `Not:` 四条逐字**：`Not: I always enjoy to cook.`／`Not: We haven't finished to eat.`／`Not: They made us to wait …`／`Not: She'd love getting a job nearer home.`
- **⚠️ 页内组织的诚实记录**：**该页「不用单一表格装所有 to-inf 动词」**——H2-1 下列的是**一个纯词阵（word array）**，另有两张表专门处理 `hate/like/love/prefer` 与 **变义动词**（`go on, need, remember, try, mean, regret, stop, want`）。
- **H2-2 `Verbs followed by -ing` 名单逐字**：`admit, deny, finish, mind, avoid, dislike, give up, miss, (can't) help, enjoy, imagine, practise, (can't) stand, fancy, involve, put off, consider, feel like, keep (on), risk`——**⚠️ 我方已教其中 3 个**（L42 `like + -ing`／L45 `enjoy`／L64 `finish`／L77 `keep`）。
- **H2-6 `Verbs followed by a direct object and a to-infinitive` 名单逐字**：`advise, hate, like, persuade, request, ask, help, love, prefer, teach, challenge, instruct, need, recommend, tell, choose, intend, order, remind, want, forbid, invite`
- **Cambridge `/grammar/british-grammar/hope`**（**title 逐字 `Hope - Grammar - Cambridge Dictionary`**；面包屑逐字 `Grammar > Verbs > Using verbs > Hope`）：**H2 两条** `Hope as a verb`／`Hope as a noun`。关键逐字：
  - "**After hope, we often use present verb forms even when there is reference to the future:**" ＋ `We hope she passes her driving test next week.`／`I just hope the bus is on time tomorrow.`
  - **Warning 逐字**："**We don't normally use hope in the negative:**" ＋ `I hope it doesn't rain.` ＋ **`Not: I don't hope it rains.`**（**本批唯一一条 `hope` 的明文禁令**）
  - "**The past continuous of hope is used to make polite statements and, especially, polite requests:**" ＋ `I was hoping to have a word with you, Professor O'Malley.`
- **Cambridge `/grammar/british-grammar/word-patterns-hope`**（**⚠️ 本轮新取的第二落点，title 逐字 `Word patterns: hope - Grammar - Cambridge Dictionary`**；面包屑逐字 `Grammar > Common mistakes in English > Word patterns > Word patterns: hope`）：**全页仅 2 句正文，但两句都是硬规则**："**When the verb hope is followed by another verb, that verb must be in the infinitive with 'to'.**" ＋ "**Don't say 'hope to doing something', say hope to do something:**" ＋ 错例 `I hope to hearing from you soon.` ／ 正例 `I hope to hear from you soon.`——**⚠️「`hope` 后必须 to + 原形」被单开了一页「常见错误」条目。**
- **Cambridge `/grammar/british-grammar/learn`**（**title 逐字 `Word choice: learn, teach, or study? - Cambridge Grammar`**）：逐字 "**To learn is to get new knowledge or skills.**" ＋ `I want to learn how to drive.`／"**When you teach someone, you give them new knowledge or skills.**" ＋ `My dad taught me how to drive.`／"**When you study, you go to classes, read books, etc. to try to understand new ideas and facts.**"——**⇒ `learn` 有独立语法落点（`Word choice` 大类）**。
- **Cambridge `/grammar/british-grammar/table-of-irregular-verbs`**（**title 逐字核过**）：逐字表格行 **`bring brought brought`**（**本轮从 HTML 表格逐格抄回**）／**`wake woke woken`**（同）；**⚠️ `learn` 在该表中 0 命中**（本轮复算：`learnt` 0／`learned` 0）——**`learn` 在表里没有位置**（见 §1.5 与 §5 项 5）。
- **BC 层**：**A1-A2 第 18 课 `Verbs followed by '-ing' or infinitive`**（**title 逐字 `Verbs followed by '-ing' or infinitive | LearnEnglish`**）——**H2 两条** `Verbs followed by the -ing form`／**`Verbs followed by to + infinitive form`**；**该节逐字**："**When want, learn and offer are followed by another verb, it must be in the to + infinitive form.**" ＋ **`I want to speak to the manager.`**／**`She's learning to play the piano.`**／**`He offered to help us wash up.`**——**⚠️ 这是「课程位」的直接证据：`learn` 与该课标题的 `to + infinitive` 同列**。**该页副名单逐字（WebFetch 实取）**：`afford, agree, ask, choose, **decide**, expect, **hope**, plan, prepare, promise, refuse, would like`——**`decide` 与 `hope` 在课程页的 to-inf 名单里**；**`try` 在该页只出现在用户评论区、不在正文名单**（**本轮明证**）。
- **BC 参考层 `Adjectives and prepositions`（A1-A2 第 1 课）**：逐字 "a preposition is followed by a noun or a gerund (-ing form)"——**与本组的 `to`（不是介词）形成对照**（**这条对照是 §2 分界线的一条支点**）。
- **中文侧**：**`english.cool/hope/` 200**（页题逐字「**Hope的正確用法？跟Wish的差別在哪？**」）——**H2 五条** `Hope當動詞用`／`Hope當名詞用`／`Hope和Wish的差別`／`小試身手`／`That's all for today!`；**正文逐字**「**Hope被當作動詞使用的時候，後面通常會接「名詞子詞」，名詞子句前的「that」可加也可不加。**」＋**明文禁令逐字**「**⚠️特別要提醒大家：Hope不可用於否定句🚫**」＋错例 **`I don't hope it snows.❌`**——**⚠️ 这条中文侧禁令与 Cambridge 的 `Not: I don't hope it rains.` 逐字同型**（**两源独立命中同一条错，是本批的「双源同禁令」首例**）。**`english.cool/decide-determine-resolve/` 200**（页题逐字「**【決定英文】decide、determine、resolve 差在哪？怎麼用？**」）——**属「同义辨析」类**（**⚠️ 即 `decide` 的中文侧落点是「近义词辨析」，不是「to + 原形」规则**）。**`english.cool/try/` → 404**；**`english.cool/learn/` 200 但页题逐字是「**【英文自學技巧】如何有效率自學英文口說？**」——⚠️ 与 `learn to do` 无关（**是一次同形异义的假命中，须登记**）。
- **Murphy（⚠️ 本机原件已丢失，本节全部为「沿用既有批次记录」并逐条标注来源）**：
  - **中级 U53–U68 是一个 16 课连续块**（批二十一逐字记录）：`53 Verb + -ing (enjoy doing / stop doing etc.)`／**`54 Verb + to… (decide to… / forget to… etc.)`**／`55 Verb (+ object) + to… (I want you to…)`／`56–58 Verb + -ing or to… 1/2/3`／`59 prefer and would rather`／`60 Preposition (in/for/about etc.) + -ing`／`61 be/get used to (I'm used to)`／`62 Verb + preposition + -ing (succeed in -ing / insist on -ing etc.)`／`63 there's no point in -ing, it's worth -ing etc.`／`64 to…, for… and so that…`／`65 Adjective + to…`／`66 to… (afraid to do) and preposition + -ing (afraid of -ing)`／`67 see somebody do and see somebody doing`／`68 -ing clauses`
  - **初级 U52 逐字 `I want to do and I enjoy doing`**（批十／批十二／批十六记录）；**初级 U53 `want you to／told you to`**；**中级 U56／U57（try, need, help）**（批十五／批十六记录）
  - **⇒ 从我方已落盘的记录可读出两条**：**① `decide to` 有一格（中级 U54 是整课，标题即点名）**；**② `try` 只有「共用格」（中级 U56 与 need／help 三词一格）**——**⚠️ 本机原件不可达，此两条为「沿用记录、本轮未复核」**（§5 项 6）。

**② 是语法缺口还是词汇缺口：四个全部判「语法缺口」**

**唯一判据，且是上游原话**：**Cambridge 把 `want`／`decide`／`learn`／`hope`／`try` 五个词写在同一个 h2（`Verbs followed by a to-infinitive`）的同一张名单里**。**它们的语法行为完全一致**（后接 `to + 原形`），**与我方 L15 `want to + 原样` 是同一条规则**。**⇒ 这不是「学四个新词」，是「同一条规则加四个成员」**。

**③ 档位：`decide` 与 `hope` 给 B／`learn` 给 B／`try` 给 B−**

| 词 | 档位 | 理由（三条） |
|---|---|---|
| **`decide`** | **B** | **① 课程位 ⚠️ 半有**（BC A1-A2 正文名单收录；**Murphy 中级 U54 标题即 `decide to…`——沿用记录**）；**② 规则页 ✅**（Cambridge H2-1 名单 ＋ BC 正文名单）；**③ CEFR A2**；**④ 我方真零 ＋ 造 1 词位** |
| **`hope`** | **B（本组最厚）** | **① 规则页 ✅✅ 两页**（`Hope` 页含 **1 条 Warning ＋ 2 条 `Not:`**；**`Word patterns: hope` 专页含明文 `Don't say 'hope to doing something'`**）；**② 课程位 ⚠️ 半有**（BC A1-A2 正文名单）；**③ CEFR A2**；**④ 中文侧独立专文 ＋ 与 Cambridge 逐字同型的禁令** |
| **`learn`** | **B** | **① 课程位 ✅ 最实**（**BC A1-A2 第 18 课正文逐字 `She's learning to play the piano.`**——**这是我方 L15 同轴的下游原文**）；**② 规则页 ✅**（`Word choice: learn, teach, or study?` 独立页）；**③ CEFR A1（本组最低）**；**④ ⚠️ 无 `Not:` 禁令**（**三个词里唯一没有明文错例的**） |
| **`try`** | **B−** | **① 课程位 ❌**（BC 正文名单 0——**本轮明证**；Murphy 中级 U56 是**三词共用格**）；**② 规则页 ⚠️ 半有**（只在 Cambridge H2-1 词阵里，**且被 H2-3「to-inf 或 -ing 都可以」第二次收录 ⇒ `try to do` / `try doing` 有变义**）；**③ CEFR A2 首义 ＋ C2（法定义）**；**④ ⚠️ 变义是 B2 段内容**（Cambridge 逐字 "I tried to email Simon but it bounced back." 放在**变义小节**，不在 H2-1） |

**④ 能否撑一课：这一组是本批「唯一能撑一个完整章」的一组**

- **四词合起来＝1 个「to 家族加成员」章（建议 2 课，见 §4.2）**——**理由**：**① 规则只有一条**（`动词 + to + 原形`），**所以不能每个词一课**（那会变成「换词课」，撞批十九／批二十已判的「第 4 课起只能换词」硬伤）；**② 但四个词各有独立的「错面」**（见下），能凑出 3 条以上带标记的新错。
- **3 条可标记错（全部来自上游逐字）**：① **`hope` 的否定式**（`I don't hope it rains.` → `I hope it doesn't rain.`；**Cambridge Warning ＋ 中文侧 ❌ 逐字同型，双源**）；② **`hope` 后接 -ing**（`I hope to hearing from you.` → `I hope to hear from you.`；**Cambridge `Word patterns: hope` 逐字错例**）；③ **`try` 后接 -ing 的变义误用**（`try doing` 表「试试看」／`try to do` 表「努力做」；**⚠️ 只能用 Cambridge 变义小节例 `I tried to email Simon but it bounced back.` 作认读，不宜作 A2 练习**）。
- **成本核算**：`learn` 0（须造）／`decide` 0（须造）／`hope` 0（须造）／`try` 0（须造）／**但 `want to` GL 109 处是现成底座**，`need to` GL 44／`like to` GL 20／`would like to` GL 9 三条轨道已在（§3.4）——**⇒ 本组的「垫子」全部现成，只需造 4 个词位**。

---

### 1.4 常用形容词组：`sad` / `fine` / `slow` / `young` / `dirty` / `important` / `different`

**① 跨源逐字证据**

- **Cambridge `/grammar/british-grammar/adjectives-order`**（**title 逐字 `Adjectives: order - Grammar - Cambridge Dictionary`**；面包屑逐字 `Grammar > Adjectives and adverbs > Adjectives > Adjectives: order`）：**H2 两条** `Order of adjectives`／`Adjectives joined by and`；**h3 一条**。关键逐字：
  - "**When more than one adjective comes before a noun, the adjectives are normally in a particular order. Adjectives which describe opinions or attitudes (e.g. amazing) usually come first, before more neutral, factual ones (e.g. red):**" ＋ `She was wearing an amazing red coat.` ＋ **`Not: … red amazing coat`**
  - **十格顺序表逐字（本轮逐行抄回）**：`1 opinion (unusual, lovely, beautiful)`／`2 size (big, small, tall)`／`3 physical quality (thin, rough, untidy)`／`4 shape (round, square, rectangular)`／**`5 age (young, old, youthful)`**／`6 colour (blue, red, pink)`／`7 origin (Dutch, Japanese, Turkish)`／`8 material (metal, wood, plastic)`／`9 type (general-purpose, four-sided, U-shaped)`／`10 purpose (cleaning, hammering, cooking)`——**⚠️ 主理人点名的 `young` 出现在第 5 格（age）的例词里**，**`important` 未出现**。
  - **长例逐字**：`She was a 1beautiful, 2tall, 3thin, 5young, 6black-haired, 7Scottish woman.`／`What an 1amazing, 2little, 5old, 7Chinese cup and saucer!`
  - `Adjectives joined by and` 节逐字："**When more than one adjective occurs after a verb such as be (a linking verb), the second last adjective is normally connected to the last adjective by and:**" ＋ `Home was always a warm, welcoming place. Now it is sad, dark and cold.`——**⚠️ `sad` 逐字出现在这个例句里**（**表语位置 ＋ `and` 连接**）。
- **BC 参考层 `Where adjectives go in a sentence`**（**title 逐字 `Where adjectives go in a sentence | LearnEnglish`**）：逐字 "**We use adjectives to describe nouns.**"／"**Most adjectives can be used in front of a noun:**"（`They have a beautiful house.`／`We saw a very exciting film last night.`）／"**or after a link verb like be, look or feel:**"（`Their house is beautiful.`／**`That film looks interesting.`**）——**⚠️ 这一页的「两个位置」正是我方 L4（形容词放名词前）＋ L125–L133（`look/feel + 形容词`）已教的两处**。
- **BC 参考层 `Adjective order`**（**title 逐字 `Adjective order`；Level 逐字 `Level: intermediate`（另一节 `Level: advanced`）**）：逐字 "**Adjectives usually come in this order:**" ＋ 表格 `General opinion / Specific opinion / Size / Shape / Age / Colour / Nationality / Material`——**⚠️ 落 `intermediate`／`advanced`，不是 A1-A2**（**与我方 L4 只教「放前面」不冲突，但**与我方零基础线的段位不匹配**）。
- **Cambridge `/grammar/british-grammar/adjectives-and-adverbs`**（**title 逐字核过**）：H2 ＝ 0 的**索引页**；**其 H2 子项逐字含 `Adjectives: forms`／`Adjectives: order`／`Adjective phrases: functions`／`Adjective phrases: position`／`Adjectives and adjective phrases: typical errors`**——**⇒ 上游把「形容词」当一个语法大类，整体成体系，个体词不进语法**。
- **Cambridge `/grammar/british-grammar/important`**（**title 逐字 `Part of speech: important - Grammar - Cambridge Dictionary`**；面包屑 `Grammar > Common mistakes in English > Part of speech`）：**全页仅 3 句，但逐字给了一条硬规则**："**Important is an adjective meaning 'necessary or of great value'.**" ＋ "**It must have a noun or pronoun that it refers to.**" ＋ "**Don't say 'the important is', say the important thing is:**" ＋ 错例 `The important is that nobody was injured.` ／ 正例 `The important thing is that nobody was injured.`——**⚠️ 这是本组唯一有「明文 `Don't say` 规则」的词，但它是一条「搭配/词性」错，不是形容词语法**。
- **Cambridge `/grammar/british-grammar/different-from-different-to-or-different-than`**（**title 逐字核过**；面包屑 `Grammar > Easily confused words > Different from, different to or different than?`）：逐字 "**The adjective different means 'not the same'.**"／"**When we compare two or more items, it is usually followed by from. We also use different to, especially in speaking:**"（`Adam is so different from/to his brother.`）／"**In American English it is also common to say different than:**"／"**In British English, people often say different than before a clause, but many speakers consider this to be incorrect:**"——**⚠️ 这是本组第二条有真实规则的词：`different` 后接哪个介词（from / to / than）**。**但三源无一条 `Not:` 禁令**（Cambridge 明写 `many speakers consider this to be incorrect` 是**争议性表述**，不是禁令）。
- **Cambridge 词典（`epp-xref` 实存，标位可用）**：`sad` **A1**／`fine` **A1**（首义逐字 "good or good enough; healthy and well:"）／`slow` **A1**（"moving, happening, or doing something without much speed:"）／`young` **A1**（"having lived or existed for only a short time and not old:"）／`dirty` **A2**／`important` **A1**（"necessary or of great value:"）／`different` **A1**（"not the same:"）——**⚠️ 七项里六项 A1、一项 A2，是本批 CEFR 最低的一组**。
- **中文侧 `english.cool/adjectives/` 200**（页题逐字「**英文的「形容詞」是什麼？有哪些？怎麼用？**」）——**H2 六条**：`形容詞是什麼？`／**`形容詞要放哪裡？`**／`形容詞有哪些？`／`形容詞練習`／`情緒形容詞是什麼？`／`情緒形容詞搭配介系詞`——**⚠️ 这一篇是本批中文侧最有价值的证据**：**① 它把「形容词放哪里」单列一个 H2（与我方 L4 同轴）；② 它把「情绪形容词」单列（`sad` 属此类）；③ 它把「情绪形容词搭配介词」单列（`sad about` 型）**。原文逐字（`形容詞要放哪裡？` 节）："**形容詞在句子裡主要有兩個擺放位置：**" ＋ "**1️⃣ 放在名詞前面，用來修飾名詞**"（`He is a cute boy.`／`They are good students.`）＋ "**2️⃣ 放在 be 動詞後面，用來補充說明最前面的主詞**"（`He is cute.`／`The students are good.`）＋ "**除了 be 動詞以外，有些動詞後面也是可以接形容詞的，例如：get / become / look / sound / smell / taste / feel / seem / appear 等等**"（`This dress looks nice.`／`The girl seems happy.`／`He gets angry very easily.`）——**⚠️ 这份「系动词名单」比我方 L125–L133 已教的五感词还多 `get/become/seem/appear`**（见 §5 项 7）。
- **中文侧 404（本轮实测）**：`english.cool/sad/`／`fine/`／`slow/`／`young/`／`dirty/`／`important/`／`different/` ——**七个词全部 404**（**中文侧不把个体形容词当条目**）。
- **BC 层**：**A1-A2 十八课里有四课涉形容词**（`Adjectives and prepositions`／`Adjectives ending in '-ed' and '-ing'`（**Level 逐字 `A1 Elementary`／`A2 Pre-intermediate`**）／`Comparative adjectives`／`Articles: ...`）；**B1-B2 有 `Adjectives: gradable and non-gradable`**——**⚠️ 全部是「形容词类别/形式/比较」，没有一课是「教某几个形容词」**。**⇒ 上游的一致做法：个体形容词从不进语法课位，只进词汇表。**

**② 是语法缺口还是词汇缺口：这一组必须**切开**——整体是语法缺口（但已教），个体全部是词汇缺口**

| 层 | 判定 | 依据（上游原话） |
|---|---|---|
| **「形容词」作为一个语法类** | **语法缺口——但已教（L4 ＋ L125–L133 ＋ L17/L31/L65/L66/L71）** | BC `Where adjectives go in a sentence` 的「两个位置」逐字；Cambridge `Adjectives: order` 的十格表；中文侧 `形容詞要放哪裡？` 的两条 |
| **`sad`/`fine`/`slow`/`young`/`dirty`/`important`/`different` 这七个词本身** | **词汇缺口（七个全判词汇）** | **① 三源都不把它们当语法点**（中文侧七个词 404；BC 零课；Cambridge 只有 `important`／`different` 两个「易错词/词性」页）；**② 它们没有结构规则**（除了 `different + from/to/than` 一条介词搭配）；**③ 它们的「教法」是认读＋产出，不是讲规则** |

**⚠️ 唯一的半个例外：`different`**——它有一条**真实的搭配规则**（`different from`／`to`／`than`），**且是 `Easily confused words` 类目下的独立页**。**但这条规则的性质是「介词搭配」不是「形容词语法」**，且**三源都没有 `Not:` 禁令**（Cambridge 明写是「许多人认为不正确」的**争议**）。**⇒ 判「词汇缺口 ＋ 一条搭配提示」，不进语法线。**

**③ 档位：七个全部 `C`（`different` 给 `C＋`）**

- **全判 C 的依据**：**C 档定义三条**——**① 只有零散例句**（剑桥词典例句 ＋ 中文侧不收录）**② 无规则页**（七个词里只有 `important`／`different` 有页，且都不是「形容词规则页」）**③ 无课程位**（BC 三档 68 课 0）——**三条全中**。
- **`different` 给 C＋（不上 B）**：它多一条**独立易混页**（`Different from, different to or different than?`），**但该页无 `Not:`、无 Warning、且明写争议** ⇒ **不足以构成 B 档「有规则页」的要件**。**⚠️ 且它是我方**零基础 A1→A2** 线最不该碰的一类（争议用法）。**
- **⚠️ 一条必须点名的「负向发现」**：**`sad` 是这七个里唯一出现在「上游语法页正文例句」中的一个**（Cambridge `Adjectives: order` 的 `Home was always a warm, welcoming place. Now it is sad, dark and cold.`）——**但那条例句的位置是「表语 ＋ and 连接」示例，教的是 `and` 的用法，不是 `sad`**。**⇒ 复现 ≠ 教学位（沿用批三十五对 `way` 的同一判据）。**

**④ 能否撑一课：七个词全判「不可」**

- **不做的三条理由**：**① 一课装七个形容词＝换词课**（撞批十九／批二十已判的「零词架硬伤」——**`sad`/`fine`/`slow`/`young`/`dirty` 五词 GL 真零 ⇒ 就是「全库零词架」的回填**）；**② 无 `Not:` 可用**（`important` 一条 `Don't say` 是「the important is」型**搭配错**，与本线已教的任何一课不同轴）；**③ 上游不支持**（个体形容词从来不进语法课位）。
- **成本核算（本轮实测，供词汇线参考）**：`sad` 0／`fine` 0／`slow` 0（`slowly` 仅 1）／`young` 0（`younger` 0）／`dirty` 0／`important` 0（`importance`／`importantly` 0）／`different` 0（`difference`／`differently` 0）——**七个词全为真零，即「零认读垫子」**。**⚠️ 与 §3.3 的对照极强烈**：同族里 `good` GL 598／`cold` GL 299／`nice` GL 250／`new` GL 218／`tired` GL 169／`happy` GL 163——**说明我方形容词库不是「薄」，而是「只教了一半，另一半一个没碰」**。

---

### 1.5 不规则/功能组：`bring` / `wake` / 交际五词

#### 1.5.1 `bring` —— **B−（半个语法缺口）**

**① 跨源逐字**：
- **Cambridge `/grammar/british-grammar/bring-take-and-fetch`**（**title 逐字 `Bring, take and fetch - Grammar - Cambridge Dictionary`**；面包屑逐字 `Grammar > Easily confused words > Bring, take and fetch`）：**H2 三条**逐字 `Bring`／`Take`／`Fetch`。关键逐字：
  - "**Bring means moving something or someone. The movement is either from where the listener is to where the speaker is, or from the speaker to the listener.**"
  - **"Bring is an irregular verb. Its past tense and -ed form are both brought."**（**不规则明文**）
  - `Can you bring me my grey sweater?` ＋ **`Not: Can you take me my grey sweater?`**
  - `Do you want me to bring my guitar?`
  - **`Take` 节明文**："**Take means movement with something or someone from where the speaker or listener is to a different place:**" ＋ `You have to fill in this form and then take it to the English Department` ＋ **`Not: … and then bring it to the English Department`**
  - **`Bring or take?` 对切表逐字**：`She visits her father every morning and she always takes him the day's newspaper.`（`seen from the viewpoint of the doer – she`）／`She visits her father every morning and she always brings him the day's newspaper.`（`seen from the viewpoint of the receiver – him`）——**⚠️ 这是本批最漂亮的一条「同一件事两个词」的对切规则，且我方的「方向」概念已在 L9 `go to` ＋ L63 `give me the book / give it to me` 里铺好**。
  - **⚠️ `Take` 节内另有一条我方**已教**的对照**：`take him the day's newspaper`——**双宾结构与我方 L63／L68 同型**。
- **Cambridge `/grammar/british-grammar/table-of-irregular-verbs`**：表格行逐字 **`bring brought brought`**。
- **Cambridge 词典**（`epp-xref` 实存）：`bring` → `verb` **A2**（"to take or carry someone or something to a place or a person, or in the direction of the person speaking:"；**第二义 B1**）
- **BC 层**：三档 68 课 0；**中文侧 `english.cool/bring/` → 404**（**本轮实测**）。

**② 语法/词汇**：**半个语法缺口。** 理由：**它有真规则（方向/视角），且是三源都拿来讲的一条规则**；**但它的"语法含量"落在与 `take` 的对切上，而 `take` 我方 GL 22 处（L20／L54）从未教过** ⇒ **`bring` 单独教「方向」等于只教一半**。

**③ 档位 `B−`**：**规则页 ✅（三 h2 ＋ 2 条 `Not:` ＋ 一张对切表）；课程位 ❌（BC 0／Murphy 记录亦 0）；CEFR A2 ✅；造 1 词位（`brought` 亦须造：GL `brought` 0／`brings` 0／`bringing` 0，本轮实测）**。**不上 B 的理由：它要成课必须把 `take` 一起拉进来（2 个词位 ＋ 一条视角规则），成本是我方 L15 型课的 2 倍。**

**④ 能否撑一课**：**能，但必须与 `take` 合课**（1 课）。**3 条可标记错**：① `bring`/`take` 视角混用（Cambridge `Not: Can you take me my grey sweater?`）；② `bring` 的昨天版（`bringed` → `brought`；依据 **Cambridge 明文 `Its past tense and -ed form are both brought`**）；③ 双宾位置（`bring the book me` → `bring me the book`；依据对切表例句 `she always takes him the day's newspaper`）。**⚠️ 但错 ③ 与我方 L63 已教同型，不能算「新错」** ⇒ **实际可用的新错 2 条。**

#### 1.5.2 `wake` —— **C（不做）**

**① 跨源逐字**：
- **Cambridge `/grammar/british-grammar/wake-wake-up-or-awaken`**（**title 逐字 `Wake, wake up or awaken? - Grammar - Cambridge Dictionary`**；面包屑逐字 `Grammar > Easily confused words > Wake, wake up or awaken?`）：**H2 ＝ 0（整页连续正文）**；正文逐字：
  - "**Wake and wake up are verbs which mean 'stop sleeping or end someone else's sleep'. They are used in everyday language.**"
  - `I woke (up) suddenly when the alarm clock went off.`／`I woke (up) the children. (or I woke the children up.) They had to be in school early.`
  - "**Wake up has a similar meaning to wake. It is sometimes used as a stronger form of wake.**"
  - **"We use wake up! as a command:"** ＋ `Wake up! It's time to get going.` ＋ **`Not: Wake!`**（**唯一一条 `Not:`**）
  - "**The verbs waken, awaken and awake have a similar meaning but are used in more literary contexts, often to refer to emotions or things as well as people:**"（`Cautiously, trying not to waken him…`／`Different images can awaken new emotions within us.`）——**⚠️ 上游自己把 `waken/awaken/awake` 判为 `literary`**
- **Cambridge `/grammar/british-grammar/table-of-irregular-verbs`**：表格行逐字 **`wake woke woken`**。
- **Cambridge 词典**：`wake` → `verb` **A1**（"to (cause someone to) become awake and conscious after sleeping:"）
- **BC 层**：**A1-A2 第 8 课 `Past continuous and past simple` 正文含 `When I woke up this morning, it was snowing.`**（批十四已逐字落盘）——**⚠️ 这是 `woke up` 唯一一条上游课程位证据，但它是「过去进行」课的**例子**，不是 `wake` 的课**。
- **中文侧**：**`english.cool/wake/` → 404**（本轮实测）。

**② 语法/词汇**：**词汇缺口（不是语法缺口）**。理由：**① 上游的两条「规则」都不在 `wake` 上**——一条是「`wake up` 是强调形」（词形选择），一条是「`Wake!` 不能单用」（**短语动词的固定性**）⇒ **两者都是词汇/搭配层**；**② 它的「不规则」只有三个形（wake/woke/woken）**，**我方 L10–L11「昨天版」的机制完全覆盖**（L10 逐字 "看到 yesterday，动词就要换形状…中文动词不变，英语必须变"）。

**③ 档位 `C`**：**课程位 ❌（BC 三档 0；唯一落点是「过去进行课的例句」）；规则页 ⚠️（一条 `Not: Wake!` ＋ 一条词域说明，H2＝0）；中文侧 404；CEFR A1（唯一优点）**。**⇒ 三条 C 档要件里中两条半。**

**④ 能否撑一课**：**不能**。**唯一增量是「`Wake!` 不能单说」**（一条 `Not:`），**撑不起四段结构**（我方每课需 `targetSentence` ＋ `blocks` ＋ `contrast` ≥3 ＋ `variants` ＋ `sceneSwings` ＋ `deepDive` ＋ `guided` 4 题）。**⚠️ 且它的替换对象 `get up` 我方已极厚**（`get up` GL 37／`getting up` GL 84／`got up` GL 42——**本轮实测**：**⇒ 场景位已被占满，`wake up` 进来会与 L120 `I am used to getting up early.`（36 处）抢同一格**）。

#### 1.5.3 交际五词：`hello` / `thank you` / `excuse me` / `welcome` / `okay` —— **全部词汇/功能短语缺口，全部 D＋／C，无一进语法**

**① 跨源逐字（五词逐一）**

| 词 | 上游落点（逐字） | 面包屑/页题 | 关键逐字 | CEFR |
|---|---|---|---|---|
| **`hello`** | Cambridge `/grammar/british-grammar/greetings-and-farewells` | **title 逐字 `Greetings and farewells: hello, goodbye, Happy New Year - Cambridge Grammar`**；面包屑逐字 **`Grammar > Using English > Functions > Greetings and farewells`** | **H2 三条** `Saying hello`／`Saying goodbye`／`Congratulating and celebrating`；`Saying hello` 表格逐字：`Good morning/afternoon/evening`／`Hello`／`Morning`／`Hi`／`Hi there`（列头 `more formal`／`less formal`）；对白逐字 `A: Hi. / B: Hello, how are you?` ／ `Fine, thanks. How about you?` | **A1** |
| **`thank you`** | Cambridge `/grammar/british-grammar/please-and-thank-you` | **title 逐字 `Please and thank you - Grammar - Cambridge Dictionary`**；面包屑逐字 **`Grammar > Using English > Spoken English > Please and thank you`** | **H2 一条 `Please` ＋ 三个 h3**（`Word order`／`Please with imperatives`／`Please as a verb`）；**`Thank you` 段正文逐字**："**We use expressions with thank you and thanks to respond to something politely and to show we are grateful for something. Thanks is more informal than thank you. We often add other words to make the response stronger:**" ＋ `Thank you.`／`Thank you very much (indeed).`／`Thanks very much (indeed).`／`Thanks a lot.` ＋ **`Not: Thank you a lot.`**（⚠️ **唯一的 `Not:`**）；`Please` 段逐字 **"Word order: We usually put please at the end of a request with could, can and would, but we can also put it at the beginning or in the middle."** ＋ 三格对照表（`Could you say that again, please?`＝最常见；`Please could you do that again?`＝更强像命令；`Could you please say that again?`＝中间位置更强）——**⚠️ 这一条「`please` 三个位置」是真规则，但我方 L32 已教 `please`（GL 95 处／8 课）** | **A1（exclamation）／A2** |
| **`excuse me`** | **Cambridge 无 `excuse me` 独立语法页**（本轮实测：`/grammar/british-grammar/excuse-me` → **302 回语法总入口**；`sorry`／`sorry-and-excuse-me` 均 302） | — | **只有词典条目**：title 逐字 `EXCUSE ME | English meaning - Cambridge Dictionary`；词性 `phrase`／`idiom`；**A1／A2** | **A1** |
| **`welcome`** | **Cambridge 无 `welcome` 独立语法页**（`/grammar/british-grammar/welcome` → **302**） | — | **只有词典条目**（title 逐字 `WELCOME |...`）：`exclamation` **A2** ＋ `verb` B2/B1 ＋ `adjective` B1×4 ＋ `noun` B1/C2 —— **⚠️ 四个词性、跨四档，是本组最分散的一个**。**中文侧 `english.cool/welcome/` 200**（页题逐字「**「welcome」用法是？welcome aboard 是什麼意思？**」）——**H2 五条**：`一、welcome 當感嘆詞的用法`／`二、welcome 當動詞的用法`／`三、welcome 當名詞的用法`／`四、welcome 當形容詞的用法`／**`五、welcome 常見錯誤用法`**；正文逐字「**welcome 總共有四種詞性，分別是感嘆詞、動詞、名詞、形容詞…但許多用法細節都需要多多留意。如果不想再說出錯誤的中式英文**」 | **A2（exclamation）** |
| **`okay`** | Cambridge `/grammar/british-grammar/okay-ok` | **title 逐字 `Okay, OK - Grammar - Cambridge Dictionary`**；面包屑逐字 **`Grammar > Using English > Spoken English > Okay, OK`** | **H2 三条** `Okay as a discourse marker`（下辖 h3 `Agreeing`／`Changing topic or closing a conversation`／`Checking understanding`）／`Okay as an adjective`／`Okay as an adverb`；开头逐字 **"We use okay (also spelt OK) in informal language. We use it in different ways, as a discourse marker, adjective or adverb."**；`Agreeing` 节逐字 "**We use okay as a response token to show that we understand, accept, or agree with what someone is saying:**" ＋ `A: I'll see you at 5 in front of the library. / B: OK. See you later.` | **A1／A2（词典 `/dictionary/english/ok` 实取：exclamation A1＋A2＋A2；adjective A2＋A1＋A2；adverb A2）** |

**② 语法/词汇：五个全判词汇/功能短语缺口**

**判据是面包屑**（本轮最硬的一条方法学收获）：**Cambridge 把 `hello`／`okay`／`thank you` 放在 `Grammar > Using English > Functions / Spoken English` 下，而不是 `Verbs`／`Conjunctions`／`Prepositions`**。**`Using English` 是 Cambridge 语法书里的「使用篇」，与 `Verbs`／`Words, sentences and clauses` 并列——即上游自己承认「这些不是语法点，是用法」**。**⇒ 五个词全部移交词汇/功能短语线。**

**③ 档位（五词分两档）**

| 词 | 档位 | 理由 |
|---|---|---|
| **`thank you`** | **C＋（五词最高）** | **① 有独立页（`Please and thank you`）且有一条真 `Not:`（`Not: Thank you a lot.`）**；**② 有真规则（`please` 三个位置）——但已被我方 L32 占用**；**③ CEFR A1**；**④ 我方已有 `thanks` GL 11（L70）＋ `please` GL 95（8 课）作底座** ⇒ **只需造 `thank you` 一个短语** |
| **`hello`** | **C** | 有页（Functions 大类）＋ 有一张正式/非正式对照表；**但零 `Not:`、零规则**；我方 `hi` 仅 L1 一处 1 次（**垫子极薄**） |
| **`okay`** | **C** | 有页（Spoken English 大类）＋ 三个 h2；**但零 `Not:`、零规则，且上游自己标 `informal`**；**词典 `/okay` slug 302（须走 `/ok`）——⚠️ 一个 slug 陷阱** |
| **`welcome`** | **C** | **无语法页**（302）＋ 只有词典条目 ＋ **四词性跨四档**；中文侧有专文（五 h2 含「常见错误用法」节）；**⚠️ 我方已在 HC 案 40／49／50 用过 `Welcome to our shop!` 三次（题面招呼语）——这是「认读垫子」** |
| **`excuse me`** | **D＋** | **无语法页（302）＋ 无中文侧（`excuse-me` 404）＋ 唯一落点是词典条目**；**A1**；**我方 `excuse` 一词全库 0**（**连认读垫子都没有**）⇒ **跨源基本不收，仅保留「有词典条目」这一条** |

**④ 能否撑一课：五词全部「不能」**

- **理由**：**① 五词全部零 `Not:` 或只有一条与本线无关的 `Not:`**（`thank you` 那条是 `Thank you a lot.`，**中方母语者负迁移概率低，不如 `very thanks` 型**）；**② 上游把它们排除在语法之外**（`Using English` 大类）；**③ 它们没有四段结构可拆**（无 `blocks`／无 `contrast` 可设计 —— **`hello` 的「对」是 `hi`，`thank you` 的「对」是 `thanks`，全是同义换词**）。
- **⇒ 五词全部移交词汇/功能短语线（§4.2）**。
- **⚠️ 一条必须登记的重叠风险**：**`welcome` 已在 HC 用作题面招呼语（3 处）**；**`thanks` 已在 L70 作 `No, thanks.` 教过（11 处）**；**`please` 已在 L32／L61／L63／L68／L69／L70 六课里出现（95 处）**——**⇒ 若词汇线补这五个词，须先与语法线的这些复现位对账，避免「同一句被两个产品线各收一次」**。

---

## §2 「语法 vs 词汇」的分界线

### 2.1 判定标准（四条，按优先顺序判，第一条命中即定）

> **一条缺席词该进语法线，当且仅当它满足以下任一条；四条全不满足者，一律进词汇线。**

| # | 判据 | 跨源依据（可复核的原话） | 本批命中项 |
|---|---|---|---|
| **判据 1** | **上游把它与「我方已教的某个词」写在同一张表、同一行、或同一份名单里** | Cambridge `Pronouns: possessive` 的八行表（`my/mine` 与 `their/theirs` 同行）；Cambridge `Verb patterns` 的 `Verbs followed by a to-infinitive` 名单（`want` 与 `decide/learn/hope/try` 同名单）；BC `Possessives: adjectives` 的七行表 | **`their`／`theirs`／`decide`／`learn`／`hope`／`try`（6 项）** |
| **判据 2** | **它的「教法」是一条结构规则，而不是一个词义**——即上游给了**明确的并列/禁用/位置**表述 | Cambridge `Across or through?` 的 h3 `Movement`（"we use through instead of across" ＋ `Not:`）；Cambridge `Bring, take and fetch` 的视角对切表（＋ 2 条 `Not:`）；Cambridge `Word patterns: hope`（"Don't say 'hope to doing something'"） | **`through`／`bring`（2 项，`hope` 已由判据 1 覆盖）** |
| **判据 3** | **它有「可标记错」（3 标记约束可满足）**——即存在一个**替换后语法错**的位置 | 本线既有标准（沿用批三十四／批三十五：**`several`／`in case` 判不做的主因就是「3 标记不可满足」**） | **`their`／`theirs`／`through`／`decide`／`learn`／`hope`／`try`／`bring`（8 项）** |
| **判据 4** | **它是封闭词类的成员**（代词/限定词/介词/连词/助动词）——**开放词类（名词/动词/形容词/副词）默认不进语法线** | **上游的分类法本身**：Cambridge 语法目录的八大类里，`Pronouns`／`Determiners`／`Prepositions and particles`／`Conjunctions` 是「结构类」；`Nouns`／`Verbs`／`Adjectives and adverbs` 是「开放类」——**本批 22 项中，命中的封闭类成员只有 `their`／`theirs`／`through`／`around` 四个** | **`their`／`theirs`／`through`（`around` 命中但无规则，被 §2.2 排除）** |

**⚠️ 四条之外的一条否决条件（本批新增）**：

> **否决条**：**若上游把这个词的落点放在 `Using English > Functions`／`Spoken English`／`Word choice`／`Word patterns`／`Easily confused words` 之下，而它本身没有任何结构规则（无并列、无禁用、无位置表述），则不论它多基础，一律判词汇线。**

**依据**：**Cambridge 的面包屑本身就是上游的自我分类**——`Grammar > Using English > Functions > Greetings and farewells`（`hello`）与 `Grammar > Verbs > Verb patterns > Verb patterns: verb + infinitive`（`want to`）**在目录树的不同层**。**⇒ 「在 `Verbs`/`Pronouns` 下有页」是语法，「在 `Using English`（使用篇）下有页」是用法。**

### 2.2 分界线的三条推论

**推论 1：这条线不按「难易」划，按「有没有第二条正确说法」划。**
本批五个交际词（`hello`/`thank you`/`excuse me`/`welcome`/`okay`）**全部有同义替换**（`hi`／`thanks`／`sorry`／`You're welcome`／`all right`）⇒ **替换后句子仍语法正确 ⇒ 3 标记不可满足 ⇒ 不是语法点**。**这正是批三十四判 `several` 与批三十五判 `in case` 的同一条红线。**

**推论 2：开放词类里的「**个体词**」永远不进语法线——但**该词类的「位置/顺序」进**。**
- **进**：`Adjectives: order`（十格表）／`Where adjectives go in a sentence`（两个位置）／`Adverbs and adverb phrases: position`——**我方 L4（形容词放名词前）／L125–L133（`look + 形容词`）／L58（-ly 副词站动词后）正是这三条**。
- **不进**：`sad`／`fine`／`slow`／`young`／`dirty`／`important`／`different` 七个词，以及 `bring`／`wake` 的**词形本身**（`brought`／`woke` 只进词汇线的词形表）。
- **⚠️ 但「不规则动词表」是例外中的例外**：Cambridge `Table of irregular verbs` 是**一整页语法书内容**（`Grammar > Verbs > Table of irregular verbs`）——**它是语法线的一页表，不是 100 个词汇条目**。**⇒ 我方 L10–L11「昨天版」的做法（讲机制不讲表）与之等价。**

**推论 3：「认读垫子」不改变判定，但改变处置顺序。**
**本批 8 项在 HC 有认读**（`their`／`learn`／`hope`／`bring`×2／`welcome`×3），**4 项在上游课程页的例句里**（`sad` 在 `Adjectives: order`、`woke up` 在 BC `Past continuous`）。**依据**：批三十五对 `way` 的判定——**「复现 ≠ 教学位」**。**⇒ 垫子只用来决定「造的词位是 1 个还是 0 个」，不用来决定档位。**

### 2.3 一览：22 项的分类结论（＋1 项复核）

| 分类 | 项数 | 项名 |
|---|---|---|
| **语法缺口（该进语法线）** | **8** | `their`／`theirs`／`through`／`decide`／`learn`／`hope`／`try`／`bring` |
| **词汇缺口（该进词汇线）** | **14** | `around`／`wake`／`sad`／`fine`／`slow`／`young`／`dirty`／`important`／`different`／`hello`／`thank you`／`excuse me`／`welcome`／`okay` |
| **合计** | **22** | ＝ 主理人清单的实际项数（§0.2 口径说明） |
| **（追加复核项）`during`** | **1** | **判「已用未教」：不新增课，L98 已把它当错题用（唯一规则是「后面只能跟名字」）** |
| **⚠️ 语法缺口 8 项里，`try` 与 `bring` 是「半个」**（都需与另一词合课起） | — | **⇒ 实际可开课的语法项 ＝ 6 项整 ＋ 2 个半项** |

---

## §3 我方已教家族盘点（逐族实测）

**口径**：词边界 `(?<![A-Za-z'-])…(?![A-Za-z'-])`；四文件（GL＝`grammarLessons.ts`／HC＝`huntCases.ts`／GS＝`grammarSeasons.ts`／GZT＝`grammarZeroTerms.ts`）。

### 3.1 物主词家族 —— **缺口 = 1 格（`their`）＋ 1 格（`theirs`）**

| 词 | GL | HC | 逐课分布（GL 前六） | 教学位 |
|---|---|---|---|---|
| `my` | **1113** | 134 | L2×23／L3×2／L7×3／**L8×48**／L9×3／L10×1（81 课命中） | **✅ L8 教**（`grammarLabel: "物主词 my / her"`） |
| `your` | **145** | 9 | L2×4／**L8×10**／L16×3／L18×1／L19×2／L21×9（48 课） | ✅ L8 教（同课名单） |
| `his` | **24** | 4 | **L8×14**／L37×1／L58×4／L106×1／L108×2／L178×2（6 课） | ✅ L8 教（同课名单） |
| `her` | **110** | 19 | **L8×26**／L9×2／L16×2／L21×4／L23×4／L24×2（20 课） | ✅ **L8 教（在 grammarLabel 里）** |
| `its` | **15** | 0 | L87×12／L88×1／L94×1／L96×1（4 课） | ⚠️ **未教**（全在 `It's` 与天气课里，属拼接形） |
| `our` | **14** | 11 | L31×7／L32×2／L33×1／L65×1／L75×3（5 课） | ⚠️ **未教**（无教学位） |
| **`their`** | **0** | **1** | **ZERO** | **❌ 缺口**（HC 案 37 认读 1 处） |
| **`theirs`** | **0** | **0** | **ZERO** | **❌ 缺口** |
| `mine` | **174** | 11 | **L33×39**／L35×2／L65×2／L85×2／L111×1／**L112×52**／L117×14／L118×5／L157×33／L158×6（13 课） | ✅ **L33／L112 教**（含 `This one is mine.` 作 target） |
| `yours` | **21** | 2 | L33×7／**L112×9**／L157×4／L182×1（4 课） | ✅ L112 教（长版对切） |
| `hers` | **18** | 2 | L8×1／**L33×11**／L34×2／L85×2／L157×2（5 课） | ✅ L33 教 |
| `ours` | **1** | 0 | L33×1（1 课） | ⚠️ **仅认读 1 处**（L33 内） |

**家族结论（三条）**：
1. **短版（determiner）七格：已教四格（`my`/`your`/`his`/`her`，全部在 L8 一句话的名单里），未教三格（`its`/`our`/`their`）**。
2. **长版（pronoun）七格：已教三格（`mine`/`yours`/`hers`）＋ `ours` 仅认读 1 处，未教 `theirs`（及其余）**。
3. **⇒ 缺口是 2 格（`their`／`theirs`），且都落在「`they` 这一行」**——**L8 的 `oneLineRule` 逐字已把 `their` 该在的位置说出来了**（"my / your / his / her 是小标签，永远贴在东西或人的前面"），**名单只列了四格**。**⇒ 这是「同一句话续写两格」的最小成本课，不是新规则。**

### 3.2 介词家族 —— **缺口 = 2 个真零（`around`／`through`）＋ 1 个「已用未教」（`during`）**

| 词 | GL | HC | 教学位 | 备注 |
|---|---|---|---|---|
| `in` | **497** | 154 | **✅ L18**（`在哪儿 · in / on / at`） | 极厚 |
| `on` | **295** | 129 | **✅ L18** | — |
| `at` | **528** | 95 | **✅ L18** | — |
| `to` | **3193** | 313 | ✅ L9／L15／L44／L173 等多课 | 全库最高 |
| `for` | **258** | 37 | ✅ L68／L156（`for + 一段时间`） | — |
| `with` | **59** | 12 | ⚠️ 无独立课 | 多在搭配里 |
| `of` | **453** | 49 | ✅ L80（`in front of`）／L157（`none of`） | — |
| `from` | **134** | 11 | ⚠️ 无独立课（`from…to` 未教） | — |
| `by` | **136** | 7 | ✅ L52（`by my brother` 被动施动） | — |
| `about` | **38** | 7 | ⚠️ 无独立课 | — |
| `under` | **26** | 0 | ✅ L26 认读 ＋ **L79 deepDive 点名为家族成员** | L79 逐字 "in／on／at（第 18 课）＋under／near（第 26 课）＋今天的 next to" |
| `over` | **1** | 1 | ❌ 几乎真零（L41 一处） | **未教** |
| `behind` | **63** | 2 | **✅ L80**（`位置词 · in front of / behind`，L80×45） | — |
| `between` | **62** | 4 | **✅ L81**（`位置词 · between A and B`，L81×55） | — |
| `near` | **29** | 4 | ✅ L26 认读／L79 deepDive 对照（"near 是「不远」"） | — |
| **`around`** | **0** | **0** | **❌ 真零** | **缺口** |
| **`through`** | **0** | **0** | **❌ 真零** | **缺口** |
| `during` | **11** | 0 | **⚠️ 已用未教**（L98 全部 11 处**都在错题里**：`wrong: "During I was reading, he was sleeping."`，`whyZh` 逐字 "during 后面只能跟「名字」（during the class），跟不了小句子"） | **不是缺口，是「错题专用词」** |

**家族结论（三条）**：
1. **静态位置家族（批十三）已完整**：L18（in/on/at）＋L79（next to）＋L80（in front of/behind）＋L81（between）＋L26（under/near 认读）——**L79／L80／L81 三课的 deepDive 逐字都在自我点名「位置词家族」，说明我方自己就把它们当一个家族**（L81 deepDive 逐字：**"方位词家族现在已经很能打了：in／on／at（第 18 课）、under／near（第 26 课）、next to（第 79 课）、in front of／behind（第 80 课）、between（今天）"**）。
2. **移动方向家族 = 0**（`through`／`around`／`across`／`along`／`past`／`into` 全零——`into` 本轮实测 GL **0**）。**⚠️ 这是一个整族的空白，不是两个词的空白**（**登记进 §5 项 8**）。
3. **⇒ `through` 的接口是「移动方向」这个新族，不是批十三的位置族。** **`around` 无族可接（它是副词性用法占多数）。**

### 3.3 形容词家族 —— **30 词逐词实测：已教 20 个、真零 10 个**

| 词 | GL | HC | 词 | GL | HC | 词 | GL | HC |
|---|---|---|---|---|---|---|---|---|
| `good` | **598** | 55 | `bad` | 3 | 0 | `big` | **36** | 3 |
| `small` | 1 | 1 | `long` | **105** | 8 | `short` | 2 | 0 |
| `new` | **218** | 12 | `old` | 18 | 10 | `hot` | 24 | 5 |
| `cold` | **299** | 14 | `happy` | **163** | 49 | **`sad`** | **0** | 0 |
| **`fine`** | **0** | 0 | **`slow`** | **0** | 0 | `fast` | 27 | 6 |
| **`young`** | **0** | 0 | **`dirty`** | **0** | 0 | `clean` | 23 | 9 |
| **`important`** | **0** | 0 | **`different`** | **0** | 0 | `same` | 2 | 1 |
| `beautiful` | **38** | 4 | `nice` | **250** | 16 | `heavy` | **79** | 6 |
| `light` | 42 | 3 | **`empty`** | **0** | 0 | `full` | 3 | 0 |
| `easy` | 5 | 0 | `hard` | 7 | 3 | `busy` | **53** | 2 |
| `tired` | **169** | 18 | `hungry` | 18 | 0 | **`afraid`** | **0** | 0 |
| **`funny`** | **0** | 1 | **`lazy`** | **0** | 0 | **`expensive`** | **0** | 0 |

**逐词清单补全（前表未列的 GL 逐课）**：`small` L31×1／`short` L17×1＋L179×1／`bad` L17×1＋L31×1＋L89×1／`same` L112×1＋L138×1／`full` L24×1＋L63×1＋L166×1／`easy` **L43×5**（全部）／`hard` L110×1＋L121×1＋L139×1＋L173×4／`warm` L19×3＋**L131×7**／`ready` L1×2＋L7×4＋L91×1＋L129×1＋L142×1＋L153×1／`hungry` L1×3＋L7×2＋L19×2＋L20×2＋L30×1＋L114×1＋L163×1＋**L186×6**。

**家族结论（四条）**：
1. **常用 30 词里，真零的有 10 个**：`sad`／`fine`／`slow`／`young`／`dirty`／`important`／`different`／`empty`／`afraid`／`funny`／`lazy`／`expensive`（**实为 12 个**）。
2. **已有的是「高频的」那一半**：`good` 598／`cold` 299／`nice` 250／`new` 218／`tired` 169／`happy` 163／`long` 105／`heavy` 79／`busy` 53／`light` 42／`beautiful` 38／`big` 36／`fast` 27／`hot` 24／`clean` 23／`old` 18／`hungry` 18——**⇒ 分布极不均：不是「形容词教得少」，是「只教了语义高频的一批」。**
3. **形容词的「教法」我方齐备**：**前位置**（L3 `new bag` 作 `blocks` 逐字 `"新背包"`／L89／L94／L116 `a new bag`）＋**后位置**（L125–L133 的 `look/sound/smell/taste/feel + 形容词` 六课）＋**比较**（L17／L31／L65／L66／L71）＋**形容词＋介词**（L67 `good at + 名字版`）。**⇒ 缺的只有「词」，没有「法」。**
4. **⚠️ 与 §1.4 的联动**：**上游 `Adjectives: order` 十格表里唯一被我方点名过的格子是 `age`（`young`，第 5 格）——而我方 `young` 真零**；**`high or tall`／`elder, eldest or older, oldest` 这两条上游易混页，我方 `tall`（L65 `as tall as`）已教 ⇒ `young` 若进词汇线可与 L65 联动**（**登记进 §4.2**）。

### 3.4 `verb + to` 家族 —— **缺口 = 四个成员（`learn`/`decide`/`hope`/`try`），底座三条已铺**

| 句式 | GL | HC | 教学位 | 逐课分布 |
|---|---|---|---|---|
| **`want to`** | **109** | 3 | **✅ L15**（`want to + 原样`，`targetSentence: "I want to travel."`） | L15 起散在 30 余课（**底座最厚**） |
| `need to` | **44** | 1 | ✅ **L161**（`需要 · need 后面也跟 to`） | L161 为主 |
| `like to` | **20** | 1 | ⚠️ **半教**（L5 教 `like + 名词`；`like to` 无独立课） | 散在 |
| **`learn to`** | **0** | **0** | **❌ 缺口** | ZERO |
| **`decide to`** | **0** | **0** | **❌ 缺口** | ZERO |
| **`hope to`** | **0** | **0** | **❌ 缺口** | ZERO |
| **`try to`** | **0** | **0** | **❌ 缺口** | ZERO |
| （参照）`have to` | **58** | — | ✅ L16 | — |
| （参照）`would like to` | **9** | — | ✅ L62／L64／L70／L169 | — |
| （参照）`going to` | **93** | — | ✅ L29 | — |
| （参照）`used to` | **489** | — | ✅ L93／L100／L122 | — |
| （参照）`seem to` | **10** | — | ✅ L160 | — |
| （参照）`come to` | **2** | — | ⚠️ 仅 L38 两处 | — |
| （参照）`start to`／`begin to`／`forget to`／`remember to` | **0／0／0／0** | — | ❌ 全零 | ZERO |

**家族结论（三条）**：
1. **`to + 原形` 的「垫板」概念我方已极稳**（L15 逐字 "want 后面要垫一块小垫板 to… to 后面的动词永远穿原样"），且**上游同名单的 30 个动词里，我方已教 4 个**（`want`／`need`／`like`／`prefer`（L177））。
2. **缺口是「同名单的前排四个」**：`decide`／`learn`／`hope`／`try` —— **其中 `decide`／`learn`／`hope` 在 BC 课程页正文名单里（课程位证据），`try` 不在**。
3. **⚠️ 「变义」是 B2 段**：Cambridge 把 `try`／`remember`／`stop`／`go on`／`mean`／`regret` 单列为 `Verbs followed by a to-infinitive or -ing`（**H2-3**），**其例句 `I tried to email Simon but it bounced back.` 属变义小节** ⇒ **`try` 若做，只能做 `try to` 一面，不能碰 `try doing`**（**这条限制是降 `try` 到 B− 的直接原因**）。

---

## §4 推荐

### 4.1 二十二项目标汇总表（一页结论；第 23 行为追加复核项）

| # | 项 | 语法/词汇 | 档位 | 课程位 | 规则页 | CEFR | 我方 GL | 能撑一课？ | 处置 |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **`their`** | **语法** | **B＋** | ⚠️ 半有（BC 表收录，无课） | ✅ 表＋禁令 | **A1** | 0 | ✅ 1 课 | **✅ 进语法线（首选）** |
| 2 | **`theirs`** | **语法** | **B** | ⚠️ 半有 | ✅ 表＋禁令 | A2 | 0 | ⚠️ 与 `their` 合课 | **✅ 进语法线（合课）** |
| 3 | **`through`** | **语法** | **B** | ❌ | ✅ h3＋3 `Not:` | A2 | 0 | ⚠️ 半课（新错只 1 条） | **✅ 进语法线（备选）** |
| 4 | `around` | 词汇 | **C** | ❌ | ❌（0 `Not:`） | A2 | 0 | ❌ | **→ 词汇线** |
| 5 | **`decide`** | **语法** | **B** | ⚠️ 半有（BC 名单） | ✅ 名单＋Murphy U54 | A2 | 0 | ✅ 合课 | **✅ 进语法线** |
| 6 | **`learn`** | **语法** | **B** | ✅ **BC 第 18 课正文例句** | ✅ `Word choice` 页 | **A1** | 0 | ✅ 合课 | **✅ 进语法线（最优）** |
| 7 | **`hope`** | **语法** | **B（最厚）** | ⚠️ 半有 | ✅✅ **两页**（含明文 `Don't say`） | A2 | 0 | ✅ 合课 | **✅ 进语法线（双源禁令）** |
| 8 | `try` | 语法（半个） | **B−** | ❌ | ⚠️ 词阵＋变义 | A2 | 0 | ❌ 单独不成课 | **⚠️ 合课（不单开）** |
| 9 | `bring` | 语法（半个） | **B−** | ❌ | ✅ 对切表＋2 `Not:` | A2 | 0 | ⚠️ 须与 `take` 合 | **⚠️ 备选（成本高）** |
| 10 | `wake` | 词汇 | **C** | ❌ | ⚠️ 1 `Not:` | A1 | 0 | ❌ | **→ 词汇线** |
| 11 | `sad` | 词汇 | **C** | ❌ | ❌ | A1 | 0 | ❌ | **→ 词汇线** |
| 12 | `fine` | 词汇 | **C** | ❌ | ❌ | A1 | 0 | ❌ | **→ 词汇线** |
| 13 | `slow` | 词汇 | **C** | ❌ | ❌ | A1 | 0 | ❌ | **→ 词汇线** |
| 14 | `young` | 词汇 | **C** | ❌ | ❌（上游表里作例词） | A1 | 0 | ❌ | **→ 词汇线** |
| 15 | `dirty` | 词汇 | **C** | ❌ | ❌ | A2 | 0 | ❌ | **→ 词汇线** |
| 16 | `important` | 词汇 | **C** | ❌ | ⚠️ 词性页 1 `Don't say` | A1 | 0 | ❌ | **→ 词汇线** |
| 17 | `different` | 词汇 | **C＋** | ❌ | ⚠️ 易混页（无禁令） | A1 | 0 | ❌ | **→ 词汇线（带搭配提示）** |
| 18 | `hello` | 词汇/功能 | **C** | ❌ | ⚠️ Functions 页 | A1 | 0 | ❌ | **→ 词汇线** |
| 19 | `thank you` | 词汇/功能 | **C＋** | ❌ | ✅ `Please and thank you`（1 `Not:`） | A1 | 0 | ❌ | **→ 词汇线** |
| 20 | `excuse me` | 词汇/功能 | **D＋** | ❌ | ❌（302） | A1 | 0 | ❌ | **→ 词汇线（末位）** |
| 21 | `welcome` | 词汇/功能 | **C** | ❌ | ❌（302） | A2 | 0 | ❌ | **→ 词汇线** |
| 22 | `okay` | 词汇/功能 | **C** | ❌ | ⚠️ Spoken English 页 | A1 | 0 | ❌ | **→ 词汇线** |
| 23 | （复核）`during` | 语法（已用未教） | **C** | ❌ | ✅ `During` 独立页 | — | 11（全在 L98 错题） | ❌ | **不新增：已作 L98 的错题词，转正即可** |

### 4.2 推荐处置

#### ① 该进语法线（按优先级排序，共 4 个课题、建议 3 课）

| 优先级 | 课 | 教什么（含跨源逐字支撑） | 证据强度 |
|---|---|---|---|
| **P1** | **《他们的》= `their` ＋ `theirs`（1 课）** | **教「`they` 这一行的两个格子」**：`their + 东西`（站名词前）／`theirs`（自己站句尾、不加撇号）。**跨源逐字**：Cambridge `Pronouns: possessive` 表逐字行 **`they｜their｜theirs`** ＋ 例句 **"That's not their house. Theirs has got a red front door."**（**同一句里两格成对**）＋ `Not: It's your.`（短版不能光站句尾）＋ **BC `NOT Is that car their's?`**（`theirs` 不能加撇号）＋ **L8 逐字续写**（"my / your / his / her 是小标签" ⇒ 续 `their` 是同句扩员）。**我方接口**：**L8（L8 的名单只列了四格）**。**成本**：造 2 个词位。**可标记错 3 条**：`their`↔`there`↔`they're`（Cambridge 三选一页）／`This is their.` → `theirs`／`They is my friend.` → `Their…`。 |
| **P2** | **《想做、希望能、决定要、学着做》= `learn`/`decide`/`hope`/`try` ＋ `to`（2 课）** | **第 1 课：`hope to`／`decide to`**（两词都有上游明文禁令或独立页）；**第 2 课：`learn to`／`try to` ＋ 收口**（`learn` 有 BC 课程位、`try` 有变义警告）。**跨源逐字**：Cambridge `Verbs followed by a to-infinitive` 名单逐字含 **`hope, try, want, decide, learn`**（**与我方 L15 的 `want` 同名单**）＋ 例句 **"She hopes to go to university next year."** ／ **"My mother never learnt to swim."** ／ **"I tried to email Simon but it bounced back."** ＋ **`Word patterns: hope` 逐字 "Don't say 'hope to doing something', say hope to do something"** ＋ `Hope` 页 Warning **`Not: I don't hope it rains.`** ＋ **BC A1-A2 第 18 课逐字 "When want, learn and offer are followed by another verb, it must be in the to + infinitive form."** ＋ **中文侧 `english.cool/hope/` 逐字「⚠️ Hope 不可用於否定句」＋ ❌ `I don't hope it snows.`**（**双源同禁令**）。**我方接口**：**L15（`want to + 原样`）＋ L161（`need to`）**。**成本**：造 4 个词位（`learn`/`decide`/`hope`/`try`），底座（`want to` GL 109）全现成。**可标记错 ≥ 4 条**：`I don't hope it rains.`／`I hope to hearing from you.`／`She wants to goes.` 型（`to` 后不加 s；**依据 L15 逐字「to 后面的动词永远穿原样」，这是复现不是新知**）／`decide to going`。 |
| **P3** | **《穿过去、绕着走》= `through`（1 课，备选）** | **教 `through` vs `across`（在内部穿 / 在面上过）**。**跨源逐字**：Cambridge `Across or through?` → **h3 `Movement` 逐字 "When we talk about movement from one side to another but 'in something', such as long grass or a forest, we use through instead of across:" ＋ `Not: I love walking across the forest.`** ＋ **`typical errors` 逐字 "When moving from one side to another while surrounded by something, we use through not across:" ＋ `Not: We cycled across a number of small villages.`** ＋ **中文侧 `english.cool/through/` h3 `1. through 表示「穿過、貫穿」` 逐字「through 是「鑽進某個立體空間裡再出來」…across 是「從某個面的這一側到另一側」…你穿過森林是 through」**（**中文侧与 Cambridge 的规则逐字同型**）。**我方接口**：**L18（`in` ＝ 里面）＋ L9（`go to`）**——**不接批十三的位置族**。**⚠️ 风险**：**新错只有 1 条**（另两条依赖未教的 `across`／`over`），**判「半课」** ⇒ 建议**与后续的 `into`／`across` 合成一个「移动方向」小章**（见 §5 项 8）。 |
| **P4** | **《带过来 / 带过去》= `bring` ＋ `take`（1 课，备选）** | **教视角差（朝说话人来 / 朝别处去）＋ `brought`**。**跨源逐字**：Cambridge `Bring, take and fetch` 逐字 "**Bring is an irregular verb. Its past tense and -ed form are both brought.**" ＋ **对切表逐字**（`takes him the day's newspaper`＝doer 视角／`brings him the day's newspaper`＝receiver 视角）＋ **`Not: Can you take me my grey sweater?`** ＋ **`Not: … and then bring it to the English Department`**。**我方接口**：**L63（`give me the book / give it to me`）＋ L68（`buy sb sth / buy sth for sb`）**（**双宾结构已教两课**）。**成本**：造 2 个词位（`bring`＋`take`；**`brought`／`took` 亦须造：`took` GL 22 已有**）。**⚠️ 降级理由**：**错 ③（双宾位置）与 L63 同型，不算新错 ⇒ 实际新错仅 2 条。** |

#### ② 该移交词汇线（登记待办，按建议优先级）

| 优先级 | 词 | 移交理由（一句话） | 与主线的联动位 |
|---|---|---|---|
| **V1** | **`sad`（＋`happy` 已有对照）** | **A1 情绪词，我方 `happy` GL 163 已厚而 `sad` 真零——是「对照缺一半」** | **L7 `We are happy.`**（逐字 target）——**加一句 `I am sad.` 即完成对子** |
| **V2** | **`young`** | **上游 `Adjectives: order` 十格表第 5 格（age）的例词；我方 `old` GL 18 已有** | **L65 `as tall as`（`young` 可作 `as young as` 的对子）** |
| **V3** | **`slow`** | **A1，且有现成的反向词 `fast` GL 27（L59 已教 `fast` 不按 -ly 走）** | **L59 `She sings very well.`／`fast→fast`——`slow→slowly` 是同节课的第二个例子** |
| **V4** | **`different`（＋搭配提示 `from`）** | **A1；字母表/分类/比较三类场景都用得上** | **L17／L31（比较）／L157（`none of`）** |
| **V5** | **`important`** | **A1；有上游 `Don't say 'the important is'` 一条明文（可作词汇卡的提示语）** | 无强联动位 |
| **V6** | **`fine`** | **A1，首义逐字 "good or good enough; healthy and well:"——是 `good` 的口语替代** | **L125 `It looks nice.`（同位置替换）** |
| **V7** | **`dirty`** | **A2；与 `clean` GL 23（9 课）成对** | **L51／L53／L54（`cleaned` 被动三课）——`dirty` 是 `cleaned` 的反向状态** |
| **V8** | **`thank you`** | **唯一有真页＋真 `Not:`（`Not: Thank you a lot.`）的交际词** | **L70 `No, thanks.`（`thanks` GL 11 已在库）** |
| **V9** | **`hello`** | **A1 打招呼；我方 `hi` 仅 L1 一处** | **L1 对白 `Hi! Who are you?`（逐字）** |
| **V10** | **`okay`** | **A1/A2 回应词，上游标 `informal`** | **L70 `Yes, please. / No, thanks.`（问答对）** |
| **V11** | **`welcome`** | **A2 感叹词义；已在 HC 案 40／49／50 三次作题面** | **HC 三案（题面招呼语）——可直接转正** |
| **V12** | **`wake (up)`** | **A1，但场景位被 `get up`（GL 37/84/42）占满** | **L120 `I am used to getting up early.`（36 处）** |
| **V13** | **`around`** | **C；唯一增量是同义换词（≈ `about`／`near`）** | 无 |
| **V14** | **`excuse me`** | **D＋，本批最低档** | 无（`excuse` 全库 0） |

**⚠️ 移交时的三条硬约束（须写进词汇线的待办里）**：
1. **`thank you`／`hello`／`okay`／`welcome` 四词的「功能」属性**：**它们的用法是「什么时候说哪句」，不是「句子里放哪」** ⇒ **词汇线须自备「场景卡」形态**，不能沿用语法线的 `blocks` 四段结构。
2. **`their` 若进语法线，`they` 的家族须同步**：**`they` GL 102（17 课）／`them` GL 25（7 课）已厚，但 `their` 一旦进课，`their` 的替换练习会大量用到 `they`** ⇒ **两线共用同一批例句时须对账**。
3. **`different` 的中文侧难点**：**A1 段英语教材一律只教 `different from`；`different than`（美式）与 `different to`（英式口语）是三源都标注「有争议」的**（Cambridge 逐字 "many speakers consider this to be incorrect"）⇒ **词汇线只收 `from`，另两个作认读不进考核。**

### 4.3 与「完成所有 B 档系列课程」这一长期目标的关系（必须说清）

**主理人问的是「这些算不算 B 档缺口」。本轮的回答是：不算。** 三条理由：
1. **B 档的定义是「有规则页无课程位，或造词成本可控」**——**本批 22 项里，没有任何一项的规则页形态是「一个词一张规则页」；它们的落点要么是词典条目（9 项），要么是「对切页/易混页」（6 项），要么是大类下的一个小节（5 项），要么是「使用篇」（3 项）。**
2. **B 档缺口是「知识点没排课」；本批是「基础词汇没进库」** ——**前者是课程表问题，后者是词表问题。**
3. **⇒ 若把本批计入 B 档，「完成所有 B 档」这个目标就变成了「补齐基础词汇」——那是一个没有终点的目标**（因为开放词类永远补不完）。**建议主理人把本批单列为「覆盖面回填（Coverage Backfill）」一类，与 B 档并列，各自有完成判据。**
4. **但本批里有 6 项属于「B 档级别的语法缺口」**（`their`／`theirs`／`through`／`decide`／`learn`／`hope` ＋ 半个 `try`／半个 `bring`）——**这 6 项（建议合并为 3 课）应计入「B 档系列」的收尾清单**，因为它们的形态是真正的「规则页＋无课程位」。

---

## §5 未核实项（诚实登记）

| # | 未核实项 | 本轮做到哪一步 | 影响 | 建议 |
|---|---|---|---|---|
| **0** | **任务书写「23 项」，但主理人清单的条目数为 22** | 清单逐字分类计数：人称/物主 **2**（`their`／`theirs`）＋介词 **2**（`around`／`through`）＋基础动词 **6**（`learn`／`decide`／`hope`／`try`／`bring`／`wake`）＋常用形容词 **7**（`sad`／`fine`／`slow`／`young`／`dirty`／`important`／`different`）＋交际用语 **5**（`hello`／`thank you`／`excuse me`／`welcome`／`okay`）＝ **22** | **低**：**本轮按 22 项全覆盖判定，未漏项**；另把介词家族普查中浮出的 `during`（GL 11、全在 L98 错题）作为第 23 行追加复核 | **若第 23 个词另有其人（例如 `across`／`into`／`along`／`over` 之一），请指出，我下批补判**——**本轮实测 `into` GL 0／`across` GL 0／`over` GL 1，四个都可能是候选**（见项 8） |
| **1** | **主理人的 `the`＝2764 这个精确值本轮无法复现** | 三种口径复算：`\bthe\b` 归一后 **2778**；lookbehind 集合 **2774**；去注释版 **2771/2767**。**均得不到 2764**（差 10）。**`good`＝606 能复现（与 `\bgood\b` 逐字吻合）** | **低**：**22 项在两个口径下全部为 0，结论不受影响** | 若主理人的 2764 来自另一个文件集（例如含 `types.ts` 或 `grammarLessons.test.ts`），**请提供口径，我下批对齐**（本轮已测：加入 `grammarLessons.test.ts` 后 `the`＝2776，仍非 2764） |
| **2** | **Cambridge「短 slug 承载长页」的性质** | 实测：`/grammar/british-grammar/through` → **200，H1 逐字 `Across, over or through?`**；`/grammar/british-grammar/around` → **200，H1 逐字 `Around or round?`**；**两者 canonical 都指向自身**（不是回指邻近页） | **中**：**这决定了 `through` 是「有规则页」还是「只有易混页」**——本轮按**「对切页」**处理（即：**不是以 `through` 单独立题的规则页**） | **⚠️ 建议下一批复核**：若 Cambridge 的 `/through` 页面在别的渲染下确实有一节叫 `Through`，则 `through` 应升 B＋ |
| **3** | **`letmeenglish.com` 全站不可达** | `sitemap.xml` **HTTP 526（Cloudflare 源站错误）**；`post-sitemap.xml` 同样 526；本轮 **0 页实取** | **中**：**批三十四／批三十五记录该站有 `more-conditionals` 等页，本批无法核 `around`／`through`／`welcome` 的中文第二源** | 下批重试；**本批中文侧结论一律只基于 `english.cool` 单源**（并已逐条标注 404） |
| **4** | **`through` 的「可标记错只有 1 条」** | 三条上游 `Not:` 里，两条依赖我方**未教**的 `across`／`over` | **中**：**这是 `through` 判「半课」而非「1 整课」的直接原因** | **若主理人决定做 `through`，建议同时把 `across`／`over` 一起纳入**（`over` GL 1、`across` GL 0——**移动方向族的整体盘点见项 8**） |
| **5** | **`learn` 的不规则形归属** | **Cambridge `Table of irregular verbs` 中 `learn` 0 命中**（`learnt` 0／`learned` 0——**逐字复算**）；而 `bring`／`wake` **都在表里** | **低**：`learn` 的「学」义在 A1 段用规则形 `learned` 即可 | **已按「规则动词」处理**；若上词汇线时要用 `learnt`（英式），须另标 |
| **6** | **Murphy 双册本机原件** | **本机 `find` 全盘 `*murphy*`：除 `pygments/styles/murphy.py` 与 `vim/colors/murphy.vim` 外 0 命中**；`/private/tmp/murphy_int.html` 实测 **1304 字节，是 503 Cloudflare 错误页**；`assets.cambridge.org` TOC PDF **直连超时（curl exit 28）**；`web.archive.org` 亦**不可达（exit 28/000）**；`www.cambridge.org` **403** | **中**：**本报告的 Murphy 层（中级 U53–U68 连续块、U54 标题、U56 三词共用格）全部为「沿用批十七／批二十一已落盘记录」，本轮未复核** | **登记为「历史记录引用」**；如需正文级证据须人工翻书 |
| **7** | **中文侧系动词名单多于我方已教** | `english.cool/adjectives/` 逐字列出 **`get / become / look / sound / smell / taste / feel / seem / appear`** 八个；**我方 L125–L133 已教 `look/sound/smell/taste/feel` 五个**，`seem` 在 L160（`seem to`）**只教了 `to` 用法、未教 `seem + 形容词`**，`get`／`become`／`appear` **全库 0** | **中**：**这是本批新发现的一条「已教家族的隐藏缺口」**（与我方另一条线 `look + 形容词` 同轴） | **登记；建议移交「感官/系动词」后续批次评估**（**不在本批 22 项范围内**） |
| **8** | **「移动方向介词族」整体未盘点** | 本轮实测：`through` 0／`around` 0／`into` **0**／`across` **0**／`along` 未测／`past` 未测／`over` **1**（L41 一处） | **高**：**§3.2 结论 2 指出「这不是两个词的空白，是一个整族的空白」——但本轮只测了 5 个词** | **⚠️ 建议下一批做「移动方向族」专项普查**（与批十三的「位置词」同规格） |
| **9** | **`/grammar/british-grammar/sorry` 与 `excuse-me` 均 302** | 实测均落到 `/grammar/british-grammar/` 总入口；**未穷举 Cambridge 是否有别名 slug**（如 `apologising`／`apologies`） | **低**：`excuse me` 已判 D＋，即使有页也不改档（**无禁令、无中文侧**） | 下批若做「礼貌用语」专项时再查 |
| **10** | **BC `Prepositions of place` 页的 `under`／`behind` 等确认** | WebFetch 直读该页两次（**title 逐字 `Prepositions of place: 'in', 'on', 'at'`**），**明证 "The other listed prepositions ('under', 'behind', 'between', 'next to', 'in front of') do not appear anywhere in the content"**；**且全页无 `Not:`** | **低**：这反而印证了我方批十三的位置词家族是**超出上游 A1-A2 课程位**的（我方做得比 BC 细） | 无需动作 |

---

## §6 本轮方法学记录（三条，供后续批次复用）

1. **Cambridge 新增两种 slug 陷阱（在批三十四「返回邻近页」之外）**：
   - **陷阱 A：短 slug 承载长页** —— `/through` 与 `/around` 都返回 **200 且 canonical 指向自身**，但 H1 是别的标题（`Across, over or through?`／`Around or round?`）。**⇒ 必须同时核 `<title>` ＋ `<h1>` ＋ `<link rel="canonical">` 三处**，只有 canonical 指向自身才能排除「假页」，但**仍不能据此认为「该词有单独立题的规则页」**。
   - **陷阱 B：302 回总入口** —— `/grammar/british-grammar/try`／`decide`／`sad`／`fine`／`slow`／`young`／`dirty`／`welcome`／`excuse-me`／`sorry`／`adjectives-and-adverbs-typical-errors` 等**均 302 到 `/grammar/british-grammar/`**（**HTTP 302，无 title**）——**这是我方判定「该词无独立语法页」的最干净证据**（比 404 更明确，因为它带 redirect_url）。**⇒ 判「无页」优先用 302 证据，不用 200 假页推断。**
2. **`english.cool` 的 sitemap 已换结构**：**旧路径 `post-sitemap.xml` → 404**；**新路径 `wp-sitemap.xml` → 200（788 字节索引）→ 内链 `wp-sitemap-posts-post-1.xml`（89,710 字节，1 条 loc 行，内含全部 URL）**。**⇒ 索引全站只须取 `wp-sitemap-posts-post-1.xml` 一次**（本轮即以此确认 22 项的 404／200 分布）。
3. **「同一页多词」的证据写法**：本轮对 `their`/`theirs` 与 `learn`/`decide`/`hope`/`try` 两组，**一律把上游的整张表/整份名单逐词抄回**（而不是只抄目标词那一格）——**因为「同轴」这件事的证据强度完全取决于「名单里还有谁」**。**⇒ 建议后续批次沿用：凡判「同架子缺格」，必须把完整名单逐字落盘。**

---

## §7 源清单（本轮实取）

| 源 | 实取方式 | 结果 |
|---|---|---|
| **Cambridge 语法页 33 页** | curl（`-A` 浏览器 UA）＋ 逐页核 `<title>`/`<h1>`/canonical/面包屑 | 200×24／302×9（302 的 9 个即「无独立页」的判据） |
| **Cambridge 词典 30 条** | curl ＋ 提取 `epp-xref` span（CEFR badge 实存才采纳） | 全部 200（`okay` slug → 302，改走 `/ok`；`as-if` 返回反讽义条、判不可用） |
| **BC 课程层 4 页**（A1-A2 索引／`Prepositions of place`／`Possessive 's`／`Verbs followed by '-ing' or infinitive`） | WebFetch（**BC 直连 curl 全 000，须走 WebFetch——本批第四次确认**） | 全部取到，18 课全目 ＋ 2 课正文逐字 |
| **BC 参考层 6 页**（`Possessives: adjectives`／`Possessives: pronouns`／`Possessives: nouns`／`Where adjectives go in a sentence`／`Adjective order`／`Adjectives`） | WebFetch | 全部取到 |
| **中文侧 `english.cool`** | curl ＋ `wp-sitemap-posts-post-1.xml` 全索引 ＋ 逐页核 `<title>`/canonical/H2/H3 | **200×14**（`possessive`／`possessive-pronouns`／`through`／`welcome`／`hope`／`decide-determine-resolve`／`adjectives`／`places-prepositions`／`prepositions-overview`／`english-greetings`／`small-talk-tips`／`interjection`／`i-am-sorry`／`you-are-welcome`）／**404×18** |
| **中文侧 `letmeenglish.com`** | curl sitemap | **HTTP 526（不可达）**——见 §5 项 3 |
| **Murphy 双册** | `find` 全盘 ＋ `/private/tmp/murphy_int.html` ＋ `assets.cambridge.org` ＋ wayback ＋ `cambridge.org` | **全部不可达**（**本报告 Murphy 层为历史记录引用**）——见 §5 项 6 |
| **本地** | `grammarLessons.ts`（188 课／37,731 行）／`huntCases.ts`（197 案／10,295 行）／`grammarSeasons.ts`（28 季）／`grammarZeroTerms.ts`／`seedWords.ts`／`gateScripts.ts`／`builtinBooks.ts` | 全部实读复算（口径见 §0.1） |

---

*报告完。本轮共实取外部源 73 页（Cambridge 语法 33／词典 30／BC 10／中文侧 14，其中 404 与 302 亦逐条落盘），复核本地代码 8 文件（含 188 课／197 案的逐课定位复算），档位判定 22 项＋1 项复核（`during`），新增方法学陷阱 2 条，口径校正 2 条（`the` 计数口径／任务书 23 vs 清单 22），未核实 11 条。核心结论：**22 项在 GL 词边界下全部为真零，但性质不是 B 档缺口，而是「基础词覆盖盲区」**；其中 **8 项属语法缺口**（`their`／`theirs`／`through`／`decide`／`learn`／`hope`／`try`／`bring`——**其中 `try`／`bring` 是「半项」，须与另一词合课**），**14 项属词汇缺口**，应移交词汇线；分界线按「①是否与已教词同表同行 ②是否有并列/禁用/位置表述 ③是否可标记（3 标记可满足） ④是否封闭词类」四条判定，并以「**落点在 `Using English`／`Word choice` 之下且无结构规则者，一律判词汇**」作否决条；**建议语法线做 3 课**（`their/theirs` 1 课 ＋ `learn/decide/hope/try` 2 课），`through`／`bring` 两项列备选、且 `through` 建议与未盘点的「移动方向介词族」（`across`／`into`／`along`／`over` 全零或近零）合并成章。*
