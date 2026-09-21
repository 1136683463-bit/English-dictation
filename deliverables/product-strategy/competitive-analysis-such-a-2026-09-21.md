# 竞品与外部权威源分析：`such a` + 冠词收口课（第 40 批）

**日期**：2026-09-21 ｜ **类型**：竞析（竞品 + 外部权威源） ｜ **作者**：竞析
**主题**：`such a` / `so` vs `such` 的跨源位次、体系归属复核、竞品空位、中文负迁移、可做性判断
**上游**：`user-research-so-that-such-2026-09-21.md` §1.3（逐字裁定「`such a` 本批不做」）＋ `roadmap-grammar-thirty-ninth-batch-2026-09-21.md` §5 携带项
**本批附带**：① 独立复核 `such a` 的体系归属（上一批判为 Determiners 族）② 独立复核「语义空卡」定性
**本批不做**：不改任何代码/数据。纯研究交付。

---

## ① 结论摘要

| # | 结论 | 证据强度 |
|---|---|---|
| **1** | **`so` 与 `such` 在跨源里 100% 同课，无一家拆开。** British Council 专课标题就是 `Intensifiers: 'so' and 'such'`，**一节里三个小节**（`Adjectives and adverbs` / `Nouns` / `Saying the result`）；Cambridge 专页标题就是 `Such or so?`。**上一批「合课＝一课两件事」的推理与跨源实践相反**——跨源从来就是把它们当成「同一个判断的两面」来教的。 | **强**（2 源逐字，见 §2.2） |
| **2** | **`such a` 的体系归属应判「双重归属」，上一批的单一定性需修正。** 词类＝**Determiner**（剑桥面包屑逐字 `Grammar > Nouns, pronouns and determiners > Determiners > Such`）；**教学位＝程度/强调**（BC 归 `Intensifiers`；剑桥自己写 `We can use such (as a determiner) before a noun phrase to **add emphasis**`）。**判据**：`such` 的 a/an 位置问题来自它是限定词（占限定词槽），但**它被教出来的唯一理由是「和 so 二选一」**——这是程度判断，不是限定词判断。 | **强**（3 源面包屑+逐字，见 §2.3） |
| **3** | **判据（discriminator）是「后面跟的是词还是东西」——4 源同一句话，措辞几乎一致。** 剑桥：`We use such, not so, before a noun`／`We use so, not such, before adjectives`（各带一条 `Not:`）；BC：`With a noun or adjective + noun, we use such`／`We can use so with an adjective or adverb`。**这正是一个天然的「二选一」教学形状**，与 L20 `because/so`、L166 `too many/too much`、L18 `in/on/at` 同型。 | **强**（逐字，见 §2.2） |
| **4** | **但 `such a` 单独成课确实装不满，上一批这一条我复核后同意。** 三条候选错句里 **2 条是 `a` 站哪儿**（与 L89 `What a + 东西` 同源），**只有 1 条是 `so`/`such` 选错**（且 L193 刚教过 `so…that`，其 `contrast` 已埋了 `He was such hungry that…` 这条错项）。**⇒ 该做成「和 L193 连体的一课」，不是独立一课。** | **强**（源码实扫，见 §5） |
| **5** | **⚠️ 本批最重要的发现不是 `such a`，是一个真实缺陷：错词本的「例句」字段存的是含错原文，631/631 = 100%。** `GrammarHuntPage.tsx:326` 的 `const sentence = activeCase.tokens.join(" ")` 存的是**题面错句**；错词本/复习页把它当例句展示——用户为「happy」建卡，例句会是 **`My mother happy today because I called her from the station.`**。**讽刺之处**：`huntService.ts:274` 的注释逐字记录了**同一类错误已于 2026-09-21 在句子卡路径上修过**（"此前直接返回 `caseItem.tokens.join(" ")`，即**含错原文**"），**错词本这条路径漏修**。 | **强**（代码逐字 + 全库 631/631 复算） |
| **6** | **「语义空卡」定性复核：你的判断成立，且比上一批说的更对。** 60 处里 **41 处收的是实词**（`happy` / `tired` / `cake` / `best` / `window` / `boat` / `fun`…）——**这些是合法且有用的词汇卡**，收 `happy` 对用户无害甚至有益；**19 处收的是封闭类词**（`at` / `very` / `next` / `me` / `It` / `few` / `most` / `none` / `may` / `looks` / `long` / `that` / `every`）——这些才真是空卡。**⇒ 不是「60 处真问题」，是「19 处小瑕疵 + 41 处无问题」；上一批的「真问题」定性偏高，你的「教学精度问题而非缺陷」更准。** **但真正的缺陷在 §1.5，优先级应高于这 60 处。** | **强**（逐条分类，见 §6） |
| **7** | **`several` 与 `a bit` 都不该搭车，但理由不同。** `several`＝**A2 限定词**，属 **some/any/much/many/a few/a lot of 数量族**（L30/L114/L167），**与 `such a` 的「程度/强调」不是一族**——硬塞＝把两族混一课。`a bit`＝**A2 程度副词**（OALD 逐字 `used as an adverb … rather; to some extent synonym a little`），**族对了**（和 `so`/`too`/`quite` 同族），**但它是英式口语标记**（OALD 逐字 `especially British English`），与零基础线所需的「中性书面骨架」不搭；且我方 L76 `much + 更…` / L66 `too…to` / L71 `enough` 已把程度轴占了。**⇒ 两个都拒绝，理由分别登记。** | **强**（2 源逐字 + 我方线位实扫，见 §5.3） |
| **8** | **竞品空位：7 款产品，无一款做「场景 + 错句回流」。** 最接近的 Cambridge 有 6 条 `Not:` 反例，**但它只列不回流**（错句无来源、无归因、不会因学员做错而再现）；中文侧仍是「格式表 + 例句 dump」（letmeenglish 逐字承认"很多学习者常卡在…"却只给 5 个格式 + 10 道选择题）。**但我们不能拿空位替「做」背书**——见 §5 的裁定。 | **强**（矩阵见 §3） |

**一句话给主理人**：`such a` **该做，但必须与 L193 连体（1 课，不是 2 课）**——理由不是"我们缺这个词"（虽然 `such` 全库只有 6 处、`such a` 只 1 处，且全在 L193 的讲解里），而是**跨源把它和 `so` 锁死在同一节课里，拆开教反而造假**。**但本批真正的收获得在别处**：错词本例句字段存的是含错原文（631/631），这是一个**比那 60 处「语义空卡」严重得多、且修法更简单**的真缺陷，建议**优先于 `such a` 排期**。

---

## ② 跨源位次表（等级 / 单元 / 逐字引用 + URL）

### 2.1 位次总表

| 源 | 侧 | 等级 / 位次 | 覆盖内容 | 与谁一起教 | URL 可达性 |
|---|---|---|---|---|---|
| **British Council LearnEnglish** | 英 | **B1-B2 档专课**（Language level 栏逐字 `B1 Intermediate` / `B2 Upper intermediate`） | `so` + 形容词/副词；`such` + 名词/形容词+名词；`so much / many / little / few` 例外；`that` 分句（`Saying the result` 节） | **✅ so 与 such 同课**（标题即 `Intensifiers: 'so' and 'such'`） | ✅ WebFetch 200 |
| **British Council · A1-A2 档** | 英 | **无 `so`/`such` 课** | — | — | ✅ A1-A2 课表实取，逐字确认无 |
| **Cambridge · `Such or so?`** | 英 | 面包屑逐字 **`Grammar > Easily confused words > Such or so?`** | **6 条 `typical errors` 全部是 so/such 选错**；含 `Not: This is a so wonderful kitchen!` | **✅ 成对教**（页名即"A 或 B"） | ✅ WebFetch 200 |
| **Cambridge · `Such`** | 英 | 面包屑逐字 **`Grammar > Nouns, pronouns and determiners > Determiners > Such`** | `such a/an` 位置（逐字 `We use such before the indefinite article, a/an`＋`Not: We had a such awful meal`）；`Such … that` 独立节 | — | ✅ WebFetch 200 |
| **Cambridge · `So`** | 英 | 面包屑逐字 **`Grammar > Using English > Spoken English > So`** | 逐字 `so is a degree adverb`；`We don't use so before an adjective + a noun (attributive adjective). We use such` | — | ✅ WebFetch 200 |
| **Cambridge 中英词典（`such`）** | 中英 | 逐字释义 **`（用于名词或名词短语前表示强调）如此，这么`** | 逐字 `Such We can use such (as a determiner) before a noun phrase to add emphasis`；逐字 `Such or so? Such is a determiner; so is an adverb.` | — | ✅ WebFetch 200 |
| **OALD 牛津高阶（`such`）** | 英 | 词类逐字 **`such determiner, pronoun`**；CEFR **A2**（首义）/ B1（他义）/ A1（`such as`） | 格式框 `such a/an…`；例句 `It's such a beautiful day!` | — | ✅ WebFetch 200 |
| **OALD 牛津高阶（`so`）** | 英 | 词类逐字 **`adverb`**；CEFR **A1**（`to such a great degree`） | `so + adj/adv` | — | ✅ WebFetch 200 |
| **perfect-english-grammar.com** | 英 | 无 CEFR 标注（页面自述难度靠 LEVEL TEST 分流） | 逐字 `We use 'such' before a noun or an adjective + a noun. If there is 'a' or 'an', it goes after 'such'.` ＋ **两条 `NOT:`** | **✅ so 与 such 同页**（标题 `'SO' AND 'SUCH'`） | ✅ curl 200（WebFetch 亦 200） |
| **letmeenglish（中文侧最教学化）** | 中 | 无等级标注；专页 `so-such` | **5 个格式并列**（so / such a / such / so much / so many），每个都带 `(that…)` 可选件；**10 道选择题** | **✅ so 与 such 同页** | ✅ curl 200 |
| **english.cool（英文庫）** | 中 | 无等级标注；专文 `such` | `such` 两义 + `such…that` + **`so` vs `such` 对照** ＋ **⚠️ 小提醒（a 的位置）**；带 ❌/⭕️ | **✅ so 与 such 同页同节** | ✅ curl 200 |
| **Murphy《English Grammar in Use》** | 英 | **抓不到**（详见 §8 项 1） | — | — | ❌ |
| **牛津 Practical English Usage (Swan)** | 英 | **抓不到**（详见 §8 项 2） | — | — | ❌ |

> ⚠️ **等级口径注意（复核上一批的结论）**：**BC 把 so/such 放 B1-B2，A1-A2 档完全没有。** 但**词典侧的两源都把它标得比 BC 早**：OALD 给 `so` 的 `to such a great degree` 义标 **A1**、给 `such` 标 **A2**。**⇒ 真正的口径是「词典 A1/A2 可查，课程给 B1 专课」**——课程更晚是因为它要处理 `that` 分句与 `so much/many` 例外这一整包，不是因为单个词的用法难。**我方要把 `such a` 做成一课、但不碰 `that` 分句与 `so much/many` 例外**，这个切法是站得住的。

### 2.2 逐字引用（本批实取 ≥ 4 处；**so/such 是否同课**在最前）

**引 1 — BC：`so` 与 `such` 是同一节课的三个小节（"同课"的最硬证据）**
URL：`https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/intensifiers-so-such`
（页面标题逐字 = `Intensifiers: 'so' and 'such'`；Language level 栏逐字 = `B1 Intermediate` / `B2 Upper intermediate`）

> **Adjectives and adverbs**
> "We can use so with an adjective or adverb to make it stronger."（例：`It's so hot today!`）
> **Nouns**
> "With a noun or adjective + noun, we use such to make it stronger."（例：`It's such a hot day today!`）
> **Saying the result**
> "We often use these so and such structures with that and a clause to say what the result is."（例：`It was so cold that the water in the lake froze.`）

**⇒ 关键**：小节名是 `Nouns` 与 `Adjectives and adverbs`——**BC 是按「后面跟什么」分小节的，而 so 与 such 就分居这两节的两侧**。它们**不是两节课，是一节课的判断两面**。

**引 2 — 剑桥 `Such or so?`：判据 + 两条互逆的 `Not:`（`a so` 与 `such kind` 都被逐字点名）**
URL：`https://dictionary.cambridge.org/grammar/british-grammar/such-or-so`
面包屑逐字 = **`Grammar > Easily confused words > Such or so?`**

> "Such is a determiner; so is an adverb."
> "We use such, not so, before a noun, even if there is an adjective before the noun"（例：`They're such snobs!` / 错例 `They're so snobs`）
> "We use such, not so, before a noun phrase with the indefinite article a/an"（例：`This is such a wonderful kitchen!` / 错例 **`This is a so wonderful kitchen!`**）
> "We use so, not such, before adjectives"（例：`You're so kind.` / 错例 **`You're such kind.`**）
> "We use so, not such, before adverbs"（例：`She always dresses so elegantly.` / 错例 `She always dresses such elegantly.`）

**引 3 — 剑桥 `Such` 页：`such a` 的限定词身份与 a 的位置（体系归属｜逐字）**
URL：`https://dictionary.cambridge.org/grammar/british-grammar/such`
面包屑逐字 = **`Grammar > Nouns, pronouns and determiners > Determiners > Such`**

> "We use such before the indefinite article, a/an:"（例：`We had such an awful meal at that restaurant!` / 错例 **`We had a such awful meal`**）
> "He is such a bad-tempered person that no one can work with him for long."

**引 4 — 剑桥 `So` 页：`so` 的程度副词身份 +「不能用 so 修名词」的明文禁令**
URL：`https://dictionary.cambridge.org/grammar/british-grammar/so`
面包屑逐字 = **`Grammar > Using English > Spoken English > So`**

> "so is a degree adverb that modifies adjectives and other adverbs"
> "We don't use so before an adjective + a noun (attributive adjective). We use such"（例：`She emailed us such lovely pictures of her and Enzo.` / 错例 `Not: … so lovely pictures …`）
> "We use such not so to modify noun phrases"

**引 5 — 剑桥中英词典（中文侧口径 + 体系归属的双语版本）**
URL：`https://dictionary.cambridge.org/zhs/%E8%AF%8D%E5%85%B8/%E8%8B%B1%E8%AF%AD-%E6%B1%89%E8%AF%AD-%E7%AE%80%E4%BD%93/such`

> "（用于名词或名词短语前表示强调）如此，这么"
> "Such We can use such (as a determiner) before a noun phrase to add emphasis"
> "Such or so? Such is a determiner; so is an adverb."

**引 6 — perfect-english-grammar：a 的位置 + **两条**互逆错例（英文侧第三源）**
URL：`https://www.perfect-english-grammar.com/so-and-such.html`

> "We use 'so' before an adjective or adverb (without a noun)."
> "We use 'such' before a noun or an adjective + a noun. If there is 'a' or 'an', it goes after 'such'."
> "She was such a beautiful woman (= she was a very beautiful woman)."
> **"NOT: 'she was a so beautiful woman'."**
> **"NOT: 'she was a such beautiful woman'."**

**引 7 — letmeenglish（中文侧自认的痛点，逐字）**
URL：`https://letmeenglish.com/zh-hans/so-such/`

> "so 和 such 都能用来加强语气（相当于 very/really），但很多学习者常卡在：到底该用 so + 形容词/副词，还是 such / such a + 名词？"
> "such a + (形容词) + 可数单数名词 + (that…)"
> "such + (形容词) + 不可数名词或复数名词 + (that…)"

**引 8 — english.cool（中文侧唯一给出 a 位置「小提醒」+ ❌/⭕️ 的源，逐字）**
URL：`https://english.cool/such/`

> "So 後面可以接形容詞/副詞，而Such 後面接名詞。"
> "💡 小提醒：如果 such 後面接的是單數名詞，就必須是 such a/an，不可以顛倒過來，寫成 a/an such。"
> "❌ Timmy is a such quiet cat."
> "⭕️ Timmy is such a quiet cat."

### 2.3 【复核项】`such a` 的体系归属：**双重归属，上一批的单一定性需修正**

上一批（`user-research-so-that-such-2026-09-21.md` §5）把 `such a` 判为 **Determiners 族**，并据此推出「该与 `such a + 名词` 一起教，不该与 `so + 形容词` 一起教」。**本批复核结论：一半对，一半错，且错的正是推出结论的那一半。**

**三条实测证据：**

| 归属轴 | 证据（逐字） | 指向 |
|---|---|---|
| **词类（word class）** | 剑桥 `Such` 页面包屑 `Grammar > Nouns, pronouns and determiners > **Determiners** > Such`；OALD 词类栏 `such **determiner**, pronoun`；剑桥词典 `Such is a **determiner**; so is an adverb.` | **✅ Determiner** —— 上一批这一半**对** |
| **教学位（teaching slot）** | BC 把它放在 **`Intensifiers: 'so' and 'such'`** 专课里（不是放在 Determiners 课里）；BC A1-A2 的 `Determiners and quantifiers` 课表**逐字没有 `such`** | **❌ 不是 Determiners** —— 上一批这一半**错** |
| **剑桥自己的调和语** | `We can use such (**as a determiner**) before a noun phrase to **add emphasis**`——**括号里给词类，主句给功能** | **⇒ 功能是「强调」＝程度** |

**⇒ 修正后的定性**：
> **`such a` 的词类是限定词，教学位是程度/强调。**
> **它的「限定词」身份只解释一件事：为什么 `a` 的位置会出错（因为它占限定词槽，与 `a/an` 互斥、且顺序固定）。**
> **它被教出来的理由只有一件：和 `so` 二选一。**

**这个区分直接决定合课判断**：
- 若按「限定词族」判 ⇒ 该和 `a/an` 系列（L3/L4/L89）合课 ⇒ **上一批的推论**。
- 若按「教学位」判 ⇒ **该和 `so` 合课 ⇒ 就是 BC / 剑桥 / perfect-english-grammar / 两个中文源的实际做法。**

**⇒ 跨源 5 家（BC、剑桥专页、perfect-english-grammar、letmeenglish、english.cool）全部按「教学位」组织，无一家按「词类」组织。** 上一批的「`so` 与 `such a` 不同族，合课＝一课两件事」这条推理，**与全部 5 家课程化来源的实际编课方式相反**。

---

## ③ 竞品矩阵与空位判定

### 3.1 七款产品矩阵

| # | 产品 | 侧 | 覆盖到哪一步 | 「so / such / such a」做到什么程度 | 形态 | 留的空位 |
|---|---|---|---|---|---|---|
| **1** | **Cambridge Dictionary Grammar** | 英 | **内容最强** | `Such or so?`（**4 条互逆 `Not:`**）＋`Such`（`such a/an` 位置 + `Not: a such awful meal`）＋`So`（`degree adverb` + `Not: so lovely pictures`）＋`So much and so many` 例外块 | **参考页 + 错误节** | **不是课程**：无课号、无顺序、无练习闭环；**错句只列不回流**（无来源、无归因、不会因学员做错而再现）；**同一件事分散在 3 个分类下**（`Easily confused words` / `Determiners` / `Spoken English`） |
| **2** | **British Council LearnEnglish** | 英 | **有专课** | **B1-B2 专课 `Intensifiers: 'so' and 'such'`**，三个小节（`Adjectives and adverbs` / `Nouns` / `Saying the result`） | **课程（一课三节）** | **一课吃三形态 + 结果分句**；**无场景人物线**（例句 `It's so hot today!` 孤立）；**无错句层**；**无回流** |
| **3** | **OALD 牛津高阶** | 英 | 词典层 | `such` = **determiner** / **A2**；`so` = **adverb** / **A1**；格式框 `such a/an…` | 词典 | 无课程、无辨析页、**无错误层**；`(that)` 括号写法对零基础不可读 |
| **4** | **perfect-english-grammar** | 英 | 单页解释 | **两条互逆 `NOT:`**（`a so beautiful woman` / `a such beautiful woman`）＋`that` 可省 ＋`so much/many` | **长页 + 课后练习** | 有错句但**无场景、无来源、无回流**；练习是纯填空；**无人物线** |
| **5** | **letmeenglish**（中文侧最教学化） | 中 | 有专页 | **5 格式 + 10 道选择题**；逐字自认「很多学习者常卡在…」 | **格式列表 + 例句 dump + 选择题** | **无场景、无错句、无归因**；`(that…)` 直接照抄 OALD 式括号；**格式给全了，但不解释为什么** |
| **6** | **english.cool（英文庫）** | 中 | 有专文 | `such` 两义 + `such…that` + **`so` vs `such` 对照** ＋ **⚠️ a 的位置小提醒（唯一给 ❌/⭕️ 的中文源）** ＋ 3 题自测 | **长文博客 + 单选题** | **有错例，但无场景串、无回流**；`a such` 的反例只有 1 条，且**不解释为什么中文母语者会错** |
| **7** | **多邻国 / 扇贝 / 英语兔 / 句乐部** | 中 | **未取到专项证据** | 本轮定向检索**未取到**这几家如何教 `so/such` 的可引用页面。英语兔官网（`yingyutu.com`）**逐字只有产品线描述**（`语料库`/`分级外刊`/`原版书`/`情境口语`/`课程`），**无语法点明细、无 `such` 专页**；扇贝首页无语法内容。**不冒充结论** | — | — |

### 3.2 空位判定（三条）

**空位 A：「场景」在 7 款里 0 命中。**
最强的英文侧（BC）用 `It's so hot today!` / `It's such a hot day today!` 这类**孤立例句**；中文侧（letmeenglish）用**格式表**；english.cool 用**对照句对**。**没有任何一家把 `so`/`such` 的判断放进一条连续的人物线里。** 我方「小美的一天」在这里**是真的空**。

**空位 B：「错句回流」在 7 款里 0 命中。**
Cambridge 有 4 条 `Not:`、perfect-english-grammar 有 2 条 `NOT:`、english.cool 有 1 条 ❌——**三家都只列不回流**：错句没有来源、没有归因、不会因为学员做错而再次出现。**Cambridge 离我们最近（它连错例都编号了），就差这一层。** 我方「错案 → 11 类归因标签 → 回流」是完整闭环。

**空位 C：中文侧的错例不解释「为什么中文母语者会错」。**
- letmeenglish：**0 条错例**（只有格式表 + 选择题）。
- english.cool：**1 条错例**（`a such quiet cat`），且**只给正误、不给机制**——不解释这是「中文『这么好的一个天』里『一个』在『这么』后面」造成的。
- **两家都没有「一个中文母语者会怎么错」的机制解释。全部是"你应该怎么说"，没有"你为什么会说错"。**

> **→ 空位判定成立（三空位全真），但它这次同样不能替我方的"做"背书。** §5 给出的裁定是**做**——但**做的是「与 L193 连体的一课」，不是独立课**，且**理由与空位无关**，是跨源的同课结构。

---

## ④ 中文负迁移证据（严格区分「源里明说」与「竞析推断」）

### 4.1 源里明说（有 URL 支撑，逐字）

| # | 内容 | 来源 | 性质 |
|---|---|---|---|
| **N1** | 「很多学习者常卡在：到底该用 so + 形容词/副词，还是 such / such a + 名词？」 | `https://letmeenglish.com/zh-hans/so-such/` | **源明说**：承认 so/such 二选一是学习者的卡点（但**未指明中文母语者**，也**未说明卡在哪一步**） |
| **N2** | 自测题逐字：「來考考大家，以下空格要填入 so 還是 such 🤔」→ 答案 `such, so, such`；题面 `I have never seen ___ a cute baby!` | `https://english.cool/such/` | **源明说**：把 so/such 选错做成自测题——**这是「确实会选错」的间接明说**。**注意第一题空位恰是 `such a` 的 `such`**，即中文源自己认这个点最容易错 |
| **N3** | 「如果 such 後面接的是單數名詞，就必須是 such a/an，**不可以顛倒過來，寫成 a/an such**」＋ ❌ `Timmy is a such quiet cat.` | `https://english.cool/such/` | **源明说**：`a such` 是真实错型（中文侧唯一具名给出 ❌ 的源） |
| **N4** | `Not: This is a so wonderful kitchen!` | `https://dictionary.cambridge.org/grammar/british-grammar/such-or-so` | **源明说**（英文侧）：`a so` 是典型错误 |
| **N5** | `Not: We had a such awful meal` | `https://dictionary.cambridge.org/grammar/british-grammar/such` | **源明说**（英文侧）：`a such` 是典型错误 |
| **N6** | `NOT: 'she was a so beautiful woman'.` ／ `NOT: 'she was a such beautiful woman'.` | `https://www.perfect-english-grammar.com/so-and-such.html` | **源明说**（英文侧第三源）：`a so` 与 `a such` **两个方向都被点名** |
| **N7** | `We use so, not such, before adjectives`（错例 `You're such kind.`） | `https://dictionary.cambridge.org/grammar/british-grammar/such-or-so` | **源明说**：反向错型（该 so 时用了 such） |

> **⇒ 四源交叉确认了两个真实错型：`a so + 形容词 + 名词` 与 `a such + 形容词 + 名词`。** 前者（`a so`）有 **3 家**独立点名（剑桥×2、perfect-english-grammar），后者（`a such`）有 **2 家**（剑桥、english.cool）。**这两个错型是同一件事的两面：`a` 与 `such/so` 的相对位置。**

### 4.2 竞析推断（**无源明说，一律标注**）

> ⚠️ 以下 **4 条全部是我的推断**，**我没有找到任何源明说它们是中文母语者的错因**。逐条标注推理链，供主理人自行取舍。

| # | 推断 | 推理链 | 我找不到源的原因（诚实登记） |
|---|---|---|---|
| **I1** | **中文「这么／那么」一个词同时覆盖 `so` 与 `such`，导致没有可用的判别信号。** | 中文说「这么热」（程度）与「这么好的一天」（带东西）**用的是同一个「这么」**；英语逼你二选一（`so hot` vs `such a nice day`）。中文母语者按「这么」直译，**没有内部信号告诉他该走哪边**，只能靠后面跟的是词还是东西——**而这是语法知识，不是语感**。 | 我检索了 `cn.bing.com` 多组查询（「中国学生 常犯 错误 such a so 语法 负迁移」等），**返回全是无关的「用」字字典页或通用学习站首页**。**没有找到任何中文源明说这一条。** |
| **I2** | **中文「一个」在修饰语**前**（「这么好的**一个**天」），英语 `a` 在 `such` **后**——位置感知完全相反，导致 `a such` / `a so`。** | 中文语序：`这么` + `好` + `一个` + `天`；英语语序：`such` + `a` + `nice` + `day`。**「一个」在中文里是第三个，在英语里是第二个**。学习者按中文顺序摆放 `a`，得到 `a such nice day` / `a so nice day`。 | **这条和 N3/N4/N5/N6 的错型高度吻合**（那 4 条源给出了错型本身，但**没有一家说错因是中文语序**）。**我未找到任何源做这个因果断言**——错型有源，**因果无源**。 |
| **I3** | **中文无「限定词」范畴，`such`/`a` 互斥且有序这件事在中文里没有对应物。** | 中文「这么好的一个天」里「这么」和「一个」可以共现且顺序自由（「这么一个好天」也通）；英语里 `such` 与 `a` **必须紧邻且顺序固定**。中文母语者感知不到「两者争同一个槽」。 | 无源。**I2 与 I3 是同一现象的两个说法**，此处分开登记是因为修正手段不同（I2 靠语序练习，I3 靠"槽位"概念）。**两项合并计为 1 条负迁移更稳妥。** |
| **I4** | **`such` 在中文侧对译「如此」偏书面、「这么」偏口语，教学时选词会影响可接受度。** | english.cool 给的是「如此、這麼」两个对译；剑桥中英词典给的是「如此，这么」。我方 L193 的 `whyZh` 已用「这么大的风」而非「如此大的风」。 | 无源明说。「如此」在我方**全库 GL=0**（未被占用，可用）。**这是我方的用词选择，不是负迁移证据**，登记在此以免被误当成有源结论。 |

### 4.3 负迁移小结（诚实版）

> **有源支撑的：2 条错型**（`a so` + 3 源；`a such` + 2 源）——**这两条足以撑起一课的核心错项**。
> **有源支撑的"卡点"：1 条**（letmeenglish 逐字「常卡在 so 还是 such」，但**不指明母语**）。
> **无源、纯推断的"因果"：3 条**（I1/I2/I3，I2+I3 宜合并）——**这正是空位 C 的镜像：中文侧给错型、不给机制，所以机制解释只能由我方自立，也就无法从外部源取得背书。**
> **⇒ 纪律保持：我方错项可以按「错型」取证（有源），但「为什么中文母语者会错」的讲解（`whyZh`）没有外部源可引，属我方原创内容，不应写成"研究表明"。**

---

## ⑤ 独立可做性判断（含拒绝项）

### 5.1 库内实况（本轮 node 实扫，非 grep）

| 项 | 实测 | 说明 |
|---|---|---|
| `such`（GL，词边界、排除连字符标识符） | **6 处** | **全部集中在 L193 一个课的 5 行内**（38537/38538/38540/38599/38638） |
| `such a`（GL） | **1 处** | 就是 L193 的 `whyZh` 里的 `such a strong wind 这么大的风` |
| `such a`（HC，案件库） | **0** | 案件库**完全没有** |
| L193 的 `such` 是什么角色 | **是「不碰」的对照项** | 逐字：`such 后面跟的是「东西」（such a strong wind 这么大的风）——**那一格今天不碰**。` |
| `so`（GL / HC） | **257 / 32** | 已重度占用 |
| `What a`（GL，L89） | **69** | L89 已教 |
| `several`（GL / HC） | **0 / 0** | 全库零 |
| `a bit` / `bit`（GL / HC） | **0 / 0** | 全库零 |
| `so much` / `so many`（GL / HC） | **0 / 0** | 全库零（L166 教的是 `too many/too much`，另一支） |

**⇒ 最重要的一条**：**L193（第 193 课、也是全库最后一课）在自己的 `whyZh` 里留了一个明写的 IOU**：
> `such 后面跟的是「东西」（such a strong wind 这么大的风）——那一格今天不碰。`

**而且我方有兑现 IOU 的既有先例**（实扫得 6 处 IOU 标记，其中 2 处已兑现）：
- `L24403`（L127 末尾）：「`It looks like rain.`（看着要下雨）……今天只认脸，不学新花样——**以后再说它**。」
- `L30807`（L156+）标题逐字：**`「以后再说它」的那个以后`**，正文逐字：`第 127 课收口的时候，末尾留过一句……那天只认脸、不学新花样，「以后再说它」。今天就是那个以后。`
- 另一处：`L28574`（说 both 只管两个，三个以上的词**今天先不碰**）→ `L29176`（**就是今天这个 all**）。

**⇒ 「L193 留了 IOU → 下一课兑现」不是我造的理由，是我方自己已经用过的编课手法，且有两次成例。**

### 5.2 裁定：**做，但只做 1 课（与 L193 连体），不做 2 课**

| 方案 | 判定 | 理由 |
|---|---|---|
| **3 课**（`so`系 / `such a` / 冠词收口 各一课） | ❌ | 三条错句撑不起三课；且会把 §2.3 的「同一判断两面」硬拆成三节课 |
| **2 课**（`such a` 独立一课 + 冠词收口一课） | ❌ | **`such a` 独立成课装不满**：三条候选错句里 2 条是 `a` 站哪儿（与 L89 同源），1 条是 `so/such` 选错（L193 的 `contrast` 已埋 `He was such hungry that…`）。**上一批这条判断我复核后同意。** |
| **1 课（独立，`such a` 自己成课）** | ⚠️ | 若硬做：错项会有 2/3 与 L89 撞车，**且违背 §2.2 引 1（跨源从不单独教 `such`）** |
| **✅ 1 课（与 L193 连体：`L194 = 那一格今天不碰`）** | **✅ 推荐** | ① **兑现 L193 自己写的 IOU**（有 2 次先例）；② **跨源 5 家都是 so/such 同课**，连体才是照着源编；③ **错项可就地取材**：L193 的 `He was such hungry that…` 是已存在的错项，升级为正式错点＋补 `a so` / `a such` 两条即可；④ **不新增语法骨架**（不碰 `that` 分句、不碰 `so much/many`）——**这两块是我方尚未建立的层，留到以后再兑现** |

**⇒ 建议做 1 课，课位 `L194`，主题「那一格今天不碰」或「这么好的一个天」。**
**可标记错 3 条**（全部有源）：
1. `a such nice day` → `such a nice day`（**源**：剑桥 `Not: We had a such awful meal` ＋ english.cool ❌ `Timmy is a such quiet cat`）
2. `a so nice day` → `such a nice day`（**源**：剑桥 `Not: This is a so wonderful kitchen!` ＋ perfect-english-grammar `NOT: 'she was a so beautiful woman'`）
3. `He was such hungry that…` → `so hungry`（**源**：剑桥 `We use so, not such, before adjectives` ＋ `Not: You're such kind.`）
**+ 1 条对照项**（不算错项）：`The wind was so strong that…`（L193）vs `such a strong wind`（本课）——**这正是 L193 那句 IOU 的字面兑现**。

### 5.3 【本批专项】`several` 与 `a bit` 该不该搭车？**两个都拒绝，理由不同**

**`several` ❌ —— 不同族硬塞**

| 轴 | 实测/取证 |
|---|---|
| 词类与等级 | OALD 逐字 `several **determiner**, pronoun`，CEFR **A2**；剑桥词典逐字 `determiner, pronoun`，**A2**，释义 `some; an amount that is not exact but is fewer than many` |
| 所属族 | **数量族**（`some/any/much/many/a few/a little/a lot of`）——**与「程度/强调」不是一族** |
| 我方该族的既有课位 | **L30**（`some / any / much / many`）、**L114**（`a few` / `few`，「a 在不在，意思反一半」）、**L167**（`a lot of`）、**L166**（`too many / too much`） |
| 判定 | **⇒ 若将来要做 `several`，正确接口是「L114 的同族补员」（`a few` 的兄弟：`a few` 可数少数 → `several` 可数「好几个」），而不是 `such a`。** **搭 `such a` 的车＝把数量族与程度族混一课，属"不同族硬塞"，拒绝。** |

**`a bit` ⚠️ —— 族对了，但**位不对**，同样拒绝**

| 轴 | 实测/取证 |
|---|---|
| 词类与等级 | OALD 逐字 `[singular] **(used as an adverb)** (especially British English) rather; to some extent synonym a little`，**A2**，例 `These trousers are a bit tight.` |
| 所属族 | **程度族**（`so` / `too` / `quite` / `rather` / `a little`）——**✅ 与 `so` 同族** |
| **拒绝理由 1：语域** | OALD 逐字 **`especially British English`**。我方这条线是**零基础中性骨架**（教的是「昨天版」「穿过原样」这类可迁移结构），**`a bit` 是英式口语标记词**，教了会与 `a little`（L114 已教、逐字 `There is a little milk.`）**撞车且更难**——`a little` 可作形容词也可作副词，`a bit` 主要是副词+`of` 结构 |
| **拒绝理由 2：轴已被占** | 程度轴我方已有 **L66 `too…to`**、**L71 `enough`**、**L76 `much + 更…`**、**L193 `so…that`**——**`a bit` 落在这条轴的"弱程度"端，是一个边际成员，不是缺口。** 对比 `such a`：它是**"程度+东西"这一格的唯一成员**，是真缺口 |
| 拒绝理由 3：池子 | `bit` 全库 **GL=0 / HC=0**——名词 `bit` 也不在词池里，做一个「`a bit` + 形容词」的课**必须新造 `bit` 词位**，成本高于 `such`（`such` 语义上不占名词位，是纯功能词） |
| 判定 | **⇒ 拒绝，但登记为「同族、日后可回收」**：若将来做「程度轴收口课」（把 `too/enough/much + 更/so…that` 排一行），**`a bit` 是那时该考虑的成员**，不是现在跟 `such a` 搭车。**「同族不等于同批」——上一批我拒绝 `along`/`around` 用的是「位次不对」的理由，这里是同一把尺子。** |

### 5.4 本批明确拒绝的其他候选（沿用前两批纪律）

| 候选 | 判定 | 理由（与前两批同一把尺子） |
|---|---|---|
| `so much` / `so many`（GL/HC 双 0） | **❌ 拒绝** | **族对了（程度+数量），但它是 BC 专课里与 `so much/many` 例外绑在同一节的"整包"**——要做就得同时引入「可数/不可数 × 多/少」四格，**那是我方 L166 `too many/too much` 已经占了一半的格子**，边际增量低。**留到「数量族收口」时与 `several` 一起处理。** |
| `how + 形容词` 感叹（`How nice!`，实扫 `How nice`=0 / `How +`=0） | **⚠️ 拒绝（本轮）** | 它与 L89 `What a + 东西` 是**同一个感叹族的另一支**（`What a + 名词` vs `How + 形容词`），**确实是真缺口**。但**它和 `such a` 争同一个位置**（都是「感叹/程度」），**同批做两课＝一课两件事**。**建议：本批做 `such a`（有 L193 的 IOU），`How nice` 记入候选池。** |
| 「冠词收口课」（把 L3/L4/L89/L114/L152 的 `a` 排一行） | **⚠️ 部分拒绝** | **上一批建议的做法，本批复核后认为不宜作为独立一课**：我方**已有 L182/L183/L184/L185 四个「排一行·零新知」收口课**，且 L185 逐字说 `这一季的八个说法是成对出现的`——**收口课是"季末"机制，不是"知识点"**。**⇒ `such a` 所带的 `a` 位置教学直接放进 L194 内部，不另开收口课。** |

---

## ⑥ 「语义空卡」定性复核（独立判断）

### 6.1 复核对象

上一批（`competitive-analysis-so-that-such-2026-09-21.md` §1 项 10）把 **60 处「入库词 == 原词」** 定性为 **「语义空卡」＝真问题，建议单独排期**（判据：剥标点后 `pick` 结果与原词相同 → 跳过 → 错词本从 627 掉到 567，-60）。

**你的判断：这是教学精度问题而非缺陷**（这 60 处是 `happy`→`is happy`、`cake`→`a cake` 这类，真正该学的是漏掉的 `is`/`a`，但收 `happy` 对用户无害）。

### 6.2 我的独立复算（3 次同值：60）

严格判据（剥标点 + 小写后 `pick(correction) === original`）复算得 **60 处，涉及 53/202 案**，按 tag：`missing_be 13 / article 11 / word_order 11 / run_on 8 / preposition 7 / verb_form 5 / fragment 5`——**与上一批数字完全一致，该数字成立。**

**但上一批没有拆开这 60 处。我拆开了，这是关键：**

| 分类 | 数量 | 实例 | 我的定性 |
|---|---|---|---|
| **收的是实词** | **41** | `happy`（←`is happy`）、`tired`、`cake`（←`a cake`）、`best`（←`the best`）、`window`、`boat`、`fun`、`nice`、`ready`、`tall`、`buy`、`watch`、`go`、`room`、`summer`、`reading`、`sunny`、`raining`、`swim`、`home`、`dance`、`need`、`seems`、`forward`、`walking`、`getting`、`learning`、`glad`、`biggest`、`day`、`eat`、`test`… | **✅ 不是问题。** 这些是**合法且有用的词汇卡**：`happy`/`tired`/`cake`/`window`/`boat`/`fun` 都是零基础学习者值得收的词。**用户学到 `happy` 完全没有害处**——他确实在案子里见过这个词，也确实该会。**你的判断成立。** |
| **收的是封闭类词** | **19** | `at`、`very`、`next`、`me`、`It`、`few`、`most`、`None`、`May`、`looks`、`long`、`that`、`every` | **⚠️ 这一小批是真瑕疵。** 为 `next`、`It`、`very`、`me`、`that` 建词汇卡**对用户无价值**（不是需要"学"的词）。但**影响很小**：19 处 ÷ 631 张卡 = **3%**，且**删掉它们也不损失教学**——**这是"精度"问题，不是"缺陷"。** |

### 6.3 我的结论：**你的定性成立，且比上一批的更准；但真正的缺陷在别处**

**① 「语义空卡」不是缺陷，是教学精度问题——同意你的判断。**
- 41/60（68%）**根本没问题**：收的是实词，卡片内容合法有用。
- 19/60（32%）**是小瑕疵**：收了封闭类词，删掉更好，但不删也无害（用户看到 `next` 的卡，最多困惑一下，不会学错东西）。
- **上一批把它列为「修复一之后剩下的真问题」并推上路线图（`roadmap-grammar-thirty-ninth-batch-2026-09-21.md` §5 携带项 4、§"优先"项），定级偏高。** 若按上一批建议的「一刀切跳过」，会**误删 41 张合法实词卡**（-60 里 41 张是好卡），**代价大于收益**。

**② 但我在复核过程中发现了一个真正的缺陷，上一批两批都没看见（本轮首次发现）：**

> ### ⚠️ 错词本的「例句」字段存的是**含错原文**——631/631 = **100%**
> **`/Users/liujun/Documents/英语听写/src/pages/GrammarHuntPage.tsx:326`**
> ```ts
> const sentence = activeCase.tokens.join(" ");
> ```
> `tokens` 是**题面错句**（全库实扫：202 案里 **201 案**的 `tokens` 里逐字留着植错原词）。这个 `sentence` 被写进 `sourceSentence`（同文件 `:351`），而 `sourceSentence` 在**两个用户可见位置**被渲染：
> - `src/pages/LibraryPage.tsx:1132-1136` → `<p className="source-sentence">`（词库详情页）
> - `src/pages/ReviewPage.tsx:440-442` 与 `:496` → `<p className="source-sentence">` / `<p className="answer-example">`（复习页题面与答案面）
>
> **用户实际会看到的东西**（实扫样本，逐字）：
> | 收的词 | 卡片上的"例句" |
> |---|---|
> | `happy` | `My mother happy today because I called her from the station. She very glad to hear my voice.` |
> | `likes` | `My sister like reading books. She go to the library every week.` |
> | `sandwiches` | `I have a egg and three sandwich for breakfast. My brother eat two banana.` |
> | `moved` | `Last week I move to a new home. It was small but quiet. My sister help me carry three box of books.` |
>
> **⇒ 这是"反教学"的**：用户在错词本里复习 `happy`，看到的例句里 `happy` 前面**恰好缺着 `is`**——**卡片示范的正是他要改掉的错**。以 L114 案的 `likes` 为例，例句 `My sister like reading books.` 里 `like` 就是该案要植的错。
>
> **② 讽刺之处（这条让定性无可辩驳）**：`src/services/huntService.ts:274-280` 的注释**逐字记录了同一类错误已于 2026-09-21 在句子卡路径上修过**：
> > `2026-09-21 修（P1）：此前直接返回 caseItem.tokens.join(" ")，即含错原文——与函数自己的文档（「正面 = 完整正确句」）以及调用方的意图都相反。`
>
> **⇒ 同一天、同一类错误、在 `huntService.correctedSentenceOf()` 里修好了，而 `GrammarHuntPage.tsx:326` 这条并行的路径漏修。** `correctedSentenceOf` 是**模块私有**（`huntService.ts:292` 逐字 `const correctedSentenceOf =`，**未 export**），所以页面根本调不到——**这才是根因**。
>
> **③ 修法成本**：一行——`huntService.ts:292` 加 `export`，`GrammarHuntPage.tsx:326` 改成 `const sentence = correctedSentenceOf(activeCase) ?? activeCase.tokens.join(" ");`。
>
> **④ 与 §6.3① 的优先关系**：**这个缺陷应优先于那 60 处**。理由：60 处是"卡片内容不够精"（无害），这个是"卡片内容在教错的句子"（有害，且 631 张卡 100% 命中，是 60 处的 10.5 倍）。

**⇒ 复核结论汇总**：
| 项 | 上一批定性 | 本批复核 |
|---|---|---|
| 60 处「入库词 == 原词」 | 「语义空卡」＝**真问题**，建议单独排期，判据可一刀切跳过 | **修正为"教学精度问题"**（你原判）：41 处是无问题的实词卡，19 处是真瑕疵但仅占 3%。**一刀切会误删 41 张好卡，不建议。** |
| `sourceSentence` 存含错原文 | **未发现** | **新增：真缺陷，631/631 = 100%，修法一行，建议优先于上述 60 处排期。** |

---

## ⑦ 自我核查记录（命令 + 输出）

> **纪律**：以下是本轮全部关键数字的实际命令与输出。命令一律用 `node` + 词边界正则（**排除连字符标识符假命中**），**不用 grep**（本地 grep 是 ugrep，会假返回 0）。

### 7.1 库内词频（任务书主张复核）

命令：
```js
const wb=(w,s)=>{const re=new RegExp('(?<![A-Za-z0-9_-])'+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![A-Za-z0-9_-])','gi');return (s.match(re)||[]).length;};
```
输出：
```
### 任务书主张复核 ###
such (GL) = 6   ← 任务书未声明，实测 6
such a (GL) = 1
such a (HC) = 0
several GL/HC = 0 0
a bit GL/HC = 0 0
What a (GL) = 69
```
**⇒ 任务书全部成立。** 另：`such` GL 实测 **6**（任务书未声明，是本批新查出的——**6 处全部集中在 L193 的 5 行内**）。

### 7.2 `such` 的 6 处逐条归属

```
L38537: wrong: "The wind was such strong that the window broke.",
L38538: wrongMark: "such",
L38540: whyZh: "后面跟的是「有多…」那个词（strong），前面要用 so。such 后面跟的是「东西」（such a strong wind 这么大的风）——那一格今天不碰。"
L38599: options: ["so", "very", "such"],
L38638: options: ["He was so hungry that he ate a big bowl.", "...", "He was such hungry that he ate a big bowl."],
```
**⇒ `such` 全部出现在 L193（全库最后一课）之内，且 `such a` 的唯一 1 处是 L193 讲解里"不碰"的对照项。**

### 7.3 课程数与案件数

```
number: 出现次数 = 193 ；max = 193 ，min = 1
huntCases id 数 = 202
季总数 = 28 ；最后一季 max = 193（L193 落在 season-28 内 ✅）
```

### 7.4 60 处「入库词==原词」复算（3 次同值）

```
配对的 original/correction 组 = 752（对象块内配对，202 案）
pick 非空 = 631
★ 严格「入库词 == 原词」 = 60
按 tag = { missing_be: 13, article: 11, word_order: 11, run_on: 8, preposition: 7, verb_form: 5, fragment: 5 }
涉及案件 = 53 / 202
封闭类词 = 19 | 实词 = 41
```
**⇒ 数字 60 复核成立（与上一批一致）；**本批新增拆分**：41 实词 / 19 封闭类。**

### 7.5 【本轮新增】错词本例句字段缺陷复算

```
★ 错词卡总数 = 631
★ 其中例句字段（tokens.join）= 含错原文的卡 = 631
  占比 = 100%
tokens 里仍留着原错词的案件 = 201 / 202（例外 hunt-word-order 的 original/correction 语义重叠）
```
样本：
```
hunt-call-mother（2 张卡）: "My mother happy today because I called her from the station. She very glad to hear my voice."
hunt-my-sister（2 张卡）: "My sister like reading books. She go to the library every week."
hunt-breakfast（3 张卡）: "I have a egg and three sandwich for breakfast. My brother eat two banana."
```
**⇒ 缺陷成立，631/631。**

### 7.6 代码路径核查（缺陷的根因与两个显示点）

```
src/services/huntService.ts:292:const correctedSentenceOf = (caseItem: HuntCase): string => {   ← 未 export（export 计数=0）
src/pages/GrammarHuntPage.tsx:326:    const sentence = activeCase.tokens.join(" ");
src/pages/GrammarHuntPage.tsx:351:            sourceSentence: sentence,
src/pages/LibraryPage.tsx:1132-1136:  {wordDetails?.sourceSentence && (<p className="source-sentence">…)}
src/pages/ReviewPage.tsx:440-442, :496:  <p className="source-sentence"> / <p className="answer-example">
```
`huntService.ts:274-280` 注释逐字（同一类错误的既有修复记录）：
> `2026-09-21 修（P1）：此前直接返回 caseItem.tokens.join(" ")，即含错原文——与函数自己的文档（「正面 = 完整正确句」）以及调用方的意图都相反。`

测试覆盖核查：`grep -rn "sourceSentence" src/edge/ src/services/*.test.ts src/pages/*.test.tsx` → **无任何测试断言错词卡的 `sourceSentence`**（`cardService.test.ts` 的 sourceSentence 断言是通用词卡路径，非 hunt 路径）。

### 7.7 `several` / `a bit` 族归属核查

```
=== 数量族 vs 程度族在我方的课位 ===
L30   桌上有一些苹果   数量词 · some / any / much / many
L114  只剩几个了       还有几个 vs 几乎没了 · a 在不在，意思反一半
L166  人太多了         太多 · too many / too much
L167  有很多朋友       很多 · a lot of
L66   太重了拿不动     太…了装不下 · too…to
L71   够轻拿得动       够 · enough 站词后
L76   好多了           加力 · much + 更…
L193  风太大，窗户破了 太…了，所以… · so 和 that 一头一尾

a few GL/HC = 62/7   a little GL/HC = 14/0   a lot of = 70/5   bit = 0/0   several = 0/0
```
**⇒ `several` 的族（数量）已有 L30/L114/L166/L167 四个课位；`a bit` 的族（程度）已有 L66/L71/L76/L193 四个课位。**

### 7.8 跨源可达性（HTTP 状态实测）

```
✅ WebFetch 200：dictionary.cambridge.org/grammar/british-grammar/such-or-so
✅ WebFetch 200：dictionary.cambridge.org/grammar/british-grammar/such
✅ WebFetch 200：dictionary.cambridge.org/grammar/british-grammar/so
✅ WebFetch 200：dictionary.cambridge.org/zhs/词典/英语-汉语-简体/such
✅ WebFetch 200：learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/intensifiers-so-such
✅ WebFetch 200：learnenglish.britishcouncil.org/free-resources/grammar/a1-a2（课表，确认无 so/such）
✅ WebFetch 200：oxfordlearnersdictionaries.com/definition/english/such（A2/B1/A1）
✅ WebFetch 200：oxfordlearnersdictionaries.com/definition/english/so（A1）
✅ WebFetch 200：oxfordlearnersdictionaries.com/definition/english/bit（A2，a bit）
✅ curl 200 (97269 B)：english.cool/such/
✅ curl 200 (74628 B)：letmeenglish.com/zh-hans/so-such/
✅ curl 200 (23876 B)：perfect-english-grammar.com/so-and-such.html
❌ curl HTTP=000（多路径重试）：learnenglish.britishcouncil.org/grammar/... 旧路径 ×3
❌ HTTP 403：zhuanlan.zhihu.com/p/556284546 · zhihu.com/question/519496956 · baike.baidu.com/item/such · test-english.com · englishgrammar.org · englishclub.com
❌ HTTP 404：bc 旧 so-such-too-enough 路径 ×2
```

---

## ⑧ 抓不到的源与不确定项

### 8.1 抓不到的源（明确登记，含尝试路径）

| # | 源 | 尝试了什么 | 结论 |
|---|---|---|---|
| **1** | **Murphy《English Grammar in Use》的 `so and such` 单元号** | ① `cn.bing.com` 查询 `"so and such" + unit + Murphy`、`"Unit 102" "so and such"`、`Murphy ... contents` → **全部返回 Murphy 姓氏义/公司名/无关内容**（Bing 中文站把 `Murphy` 当人名处理）② `englishgrammarinuse.com/contents` 与 `/unit-102-so-and-such` → **页面为空**③ `cambridge.org` 官方 contents 页 → **HTTP 403**④ `archive.org` 本 → **连接超时**⑤ `html.duckduckgo.com` / `lite.duckduckgo.com` / `search.brave.com` → **全部 Connect Timeout（443）** | **抓不到。本批不引用、不推测单元号。** 本项目历史已登记为「永久不可得源」，本批**未重复无效尝试超过必要次数**。 |
| **2** | **牛津 Practical English Usage (Swan) 的 `so`/`such` 条目号** | `cn.bing.com` 查询 `Swan "Practical English Usage" so such entry 570/571/572` → **返回全是 SWAN 仪表/惠威音箱**（同名品牌） | **抓不到。本批不引用、不推测条目号。** |
| **3** | **知乎两篇**（`zhuanlan.zhihu.com/p/556284546`「初高中高频考点——so和such的用法辨析」、`zhihu.com/question/519496956`「such a和a such的区别」） | WebFetch 与 curl（Chrome UA）→ **均 HTTP 403**。**但 Bing 摘要给出了可引用的片段**（见下） | **正文抓不到。** 仅取到 Bing 摘要逐字：`such和so都可以表示程度，含有'如此、这么'的意思，很容易混淆。`（该摘要指向 zhihu p/556284546）＋`而"a such"并不是一个常见的英语结构。如果在某些情况下看到了类似"a such"的用法，那么很可能是语法错误`（指向 zhihu q/519496956）。**⇒ 本报告 §4 只把这两条摘要作为"存在性"证据，不当作独立源引用（与英文侧 3 源重复，无新增信息量）。** |
| **4** | **英语兔的 `such`/`so` 课程页** | `curl yingyutu.com`（HTTP 200，7333 B）→ 逐字只有产品线描述（语料库/分级外刊/原版书/情境口语/课程）；`/grammar`、`/course` → **404**；链接抓取 → **0 个含 such/so/grammar 的链接** | **抓不到**：该站是微信小程序引流页，**无公开课程目录**。**不冒充结论。** |
| **5** | **沪江/新东方/柯帕斯英语网 的 `so/such` 专文** | 三站首页均 HTTP 200 但**无 `so/such` 文章入口**；`hjenglish.com/new/p1234567/` 与 `p1210723/` 实测**只是门户首页回退**（内容无关）；`cpsenglish.com` 首页逐字只有 `THAT既非关系代词…` / `系动词是不是实义动词` 等其它文章 | **抓不到专文。不冒充结论。** |
| **6** | **British Council 旧路径** | `/grammar/english-grammar-reference/such-so-too-enough`、`/such-a-an`、`/so`、`/determiners-and-quantifiers` → **HTTP 404/000**（见 §7.8）。**新路径 `/free-resources/...` 有效**，已抓到 `intensifiers-so-such` | **✅ 绕道成功**（站点改版；目录页经 WebFetch 可读，与任务书已知情况一致） |
| **7** | **test-english / englishgrammar.org / englishclub** | WebFetch 与 curl（Chrome UA / Googlebot UA / Safari UA）→ **全部 HTTP 403** | **抓不到，不引用。** `perfect-english-grammar` 作为第 3 个英文源补上了这个缺口。 |
| **8** | **多邻国/扇贝/句乐部 的 `so/such` 教学内容** | 定向检索 → 只取到官网首页与应用商店页，**均无语法点明细** | **抓不到，不冒充结论**（延续上一批的登记）。 |
| **9** | **中文侧「中国学生 `such a` 负迁移」的机制解释** | `cn.bing.com` 多组查询（「中国学生 常犯 错误 such a so 语法 负迁移」等）→ **返回「用」字字典页 / 中国政府网 / 地图等无关结果** | **抓不到。这正是 §3.2 空位 C 的直接证据：中文侧给错型、不给机制。** |

### 8.2 不确定项（诚实登记）

| # | 不确定项 | 我的处理 |
|---|---|---|
| **1** | **BC 课程在 B1-B2 档的具体序号（"第 10 课"）** | 上一批记为"36 课里的第 10 课"。**本批未复核该序号**（只确认了它在 B1-B2 档、标题与三个小节名）。**⇒ 本报告不引用序号，只引用标题、等级与三个小节名。** 若上游 PRD 需序号，须单独复核。 |
| **2** | **`such` 的 CEFR 到底算 A2 还是 B1** | 三源不一致：OALD 首义 **A2**、他义 B1、`such as` A1；剑桥词典 `such a/an…` 义 **A2**；剑桥 `Such … that` 节无独立等级标注。**⇒ 本报告口径：`such a`（单数名词 + a）＝A2；`such ... that`＝更晚（B1 附近）。这与我方"只做 `such a`、不碰 `that` 分句"的切法一致。** |
| **3** | **§4.2 的 I1/I2/I3 推断** | **全部无源**。我在 §4.2 已逐条标注"无源明说"，**未把它们写成有源结论**。**若写课方要引用，只能作为我方原创设计假设，不得标注"研究表明"。** |
| **4** | **L194 的确切课位是否与已有季边界冲突** | 实扫：季总数 28，`season-28` 的区间是 `min=182, max=193`。**L194 会落在所有季区间之外，会被路径页静默过滤**（`grammarSeasons.ts` 的硬护栏注释逐字：`课程号不落在任何区间内会被路径页静默过滤（整课不显示、无报错）`）。**⇒ 若真要开 L194，必须同步追加 `season-29` 分组**（现有 `grammarSeasons.test.ts` 会守门）。**这是本批发现的一个生产前置条件，写课方必须知道。** |
| **5** | **`hunt-word-order` 案的 `original`/`correction` 语义** | 全库 202 案中 **201 案**的 `tokens` 里逐字留着原错词，**唯一例外 `hunt-word-order`**（`original: "is it" → correction: "it is"` 型，`tokens` 里对不上）。**⇒ 本报告 §6.3 的 631/631 不影响该案的结论方向**（该案例句同样存的是 `tokens`，只是"对不上"的方式不同），但**若生产修 `sourceSentence`，建议顺带核这一案的 `tokens` 是否需要重排**。 |
| **6** | **`several` 与 `a bit` 的最终裁定会不会被后续批次推翻** | 我给了明确拒绝 + 各自的回收条件（`several` → 数量族收口；`a bit` → 程度轴收口）。**这两个条件是否成立取决于未来的编课计划，不在本批证据范围内。** |
| **7** | **本批最关键的一条（错词本例句）是否已在某处被登记过** | 实扫 `deliverables/` 与 `IMPLEMENTATION_NOTES.md` → **未发现任何 `sourceSentence` 含错的相关记录**；`grep -rn "sourceSentence" src/edge/ src/services/*.test.ts src/pages/*.test.tsx` → **无测试断言 hunt 路径的 `sourceSentence`**。**⇒ 我判断为本轮首次发现，但无法排除此前某次口头讨论过。** |

---

## 附：本批与上一批的关系（供主理人对齐）

| 议题 | 上一批（第 39 批） | 本批（第 40 批） | 是否推翻 |
|---|---|---|---|
| `such a` 该不该做 | **不做**（3 条错句里 2 条与 L89 撞车；且与 `so` 不同族） | **做，但只做 1 课、与 L193 连体** | **部分推翻**：不做独立课的判断**保留**；但"与 so 不同族"的**归属判断被推翻**（§2.3），"合课＝一课两件事"的**推理被推翻**（跨源 5 家全部同课） |
| `such a` 的体系归属 | **Determiners 族** → 该与 `such a + 名词` 一起教 | **双重归属**：词类＝Determiner，**教学位＝程度/强调** → 该与 `so` 一起教 | **✅ 推翻**（三源面包屑+逐字） |
| 60 处「语义空卡」 | **真问题**，建议单独排期，判据可一刀切 | **教学精度问题**（你的原判）：41 处无问题、19 处小瑕疵，**一刀切会误删 41 张好卡** | **✅ 推翻定性** |
| 错词本例句字段 | **未发现** | **真缺陷，631/631 = 100%，修法一行** | **✅ 新增**，且优先级高于上述 60 处 |
| 空位 A/B/C（场景/回流/机制解释） | 成立（8 款） | **成立（7 款），三空位全真** | 一致 |

---

**报告完** ｜ 竞析 ｜ 2026-09-21
