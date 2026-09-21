# 竞品与外部权威源分析：移动方向介词族（第 38 批）

**日期**：2026-09-21 ｜ **类型**：竞析（竞品 + 外部权威源） ｜ **作者**：竞析
**主题**：`through` / `around` / `into` / `across` / `along` 的跨源位次、竞品空位、中文负迁移、拆分建议
**上游**：`roadmap-grammar-thirty-seventh-batch-2026-09-21.md` §5 携带项 #5（"移动方向介词族 待办；上批延后；5 词超先例，建议拆 2 课或转词汇线"）
**本批不做**：不改任何代码/数据。纯研究交付。

---

## ① 结论摘要

| # | 结论 | 证据强度 |
|---|---|---|
| **1** | **本族是「跨源教学孤儿」——不是超纲，而是被系统性忽略。** Cambridge 有五页、BC **三档 68 课全目零命中**、OALD 五词全是 **Oxford 3000**，但**无一家把它做成「一课教几个」的课程单元**。Cambridge 把它们散在 5 个不同分类下（`Prepositions and particles` 2 页 + `Easily confused words` 3 页）。 | **强**（5 源实取） |
| **2** | **BC 是最硬的反证**：A1-A2 18 课（含 `Prepositions of place: 'in', 'on', 'at'`）、B1-B2 36 课、C1 14 课——**三档共 68 课，`prepositions of movement`／`direction` 专课 = 0**。BC 教静态位置、教 time、教 `verbs and prepositions`，**就是不教移动方向**。 | **强**（三轮全目实取） |
| **3** | **中文侧 100% 是「表格/图片 + 例句 dump」，且「场景」是缺失项**。最接近教学化的是 letmeenglish 的移动介词专页——**其核心教学块 `常見的行動介系詞` 正文为空，整节只有一张 PNG 图**（700×847，实测下载确认）。**更狠的是段落级实测**：该页把 `through`/`across`/`past`/`under`/`up`/`towards`/`below` **七个词的教学完全排除在正文之外**（正文段各词计数 = 0），**它们只活在图片像素与四选一选项里**。 | **强**（原文 + 图片 + 分段计数实取） |
| **3b** | **中文侧最细的一家实质上已放弃 `along`**：`along` 在 letmeenglish 移动专页的**正文段 0 次、练习段 0 次**，在 `across-over-through` 专页 0 次，在那张 14 格教学图里也不存在。**→ 这是我 §5.2 拒绝 `along` 的独立第三源证据。** | **强**（三轮零命中实测） |
| **4** | **中文侧自认的痛点恰好是我们的形态**：搜狐《英语常用介词》原文承认「**英语常用介词的误用常源于母语思维的负迁移**」＋「**介词冗余与缺失**」（及物动词后误加介词）——**这两个坑正是我们「错句回流 + 10 类归因」的射程**，而中文侧只给了结论、没给机制。 | **中**（单一源明说，需补） |
| **5** | **竞品空位判定：8 款产品，无一款做「移动方向介词的场景 + 错句回流」**。`through/across` 的辨析内容**大量存在但都是静态列表**；**「错句回流成课」这一形态在 8 款里 0 命中**。 | **强**（矩阵见 §3） |
| **6** | **拆分建议：2 课，不是 3 课，更不是 1 课。** L191 `into`（单课单点，A1 唯一词）＋ L192 `through/across`（一对，Cambridge 同页）。**建议拒绝 `along` 与 `around`**——理由见 §5，**且这两个拒绝理由与「中文难度」无关**（见 §5.4 一致性声明）。 | **中**（判据见 §5） |
| **7** | **一处内部风险**：`介词` 是 `grammarZeroTerms.ts` **明令红线词**（第 31 行），全库 `grammarLessons.ts` 正文命中 **3 次**但**全在 JS 注释里**（非课程内容）。新批的 `grammarLabel` 必须避开，沿用 `位置词`（已 20 次）。 | **强**（读源码确认） |

**一句话给主理人**：这个族**该做**（跨源全承认、我方全零、竞品全空），但**只能做 2 课、且第 2 课要压成一对**——`along`／`around` 我建议**明确不做**，不是因为他们难，而是因为**它们在跨源里连「和谁一起教」都没有共识**（Cambridge 把 along 和 **alongside** 配对、around 和 **round** 配对——**都不是移动方向的教学配对**），**并且中文侧最细的一家（letmeenglish）在实测里对这两个词是彻底的零命中**。

---

## ② 跨源位次表（含等级 / 单元 / 逐字引用 + URL）

### 2.1 位次总表

| 词 | Cambridge 词典语法页 | Cambridge 中文词典 CEFR | OALD CEFR / Oxford3000 | BC LearnEnglish | 中文侧 | 与谁一起教（跨源共识） |
|---|---|---|---|---|---|---|
| **into** | `/grammar/british-grammar/in-into`（`In, into`） | **A1** | **A1** ／ ox3000 ✅ | **无专课** | letmeenglish 移动页（图） | 与 **in** 成对（位置 vs 方向） |
| **through** | `/grammar/british-grammar/through`（`Across, over or through?`） | **A2** | **A1** ／ ox3000 ✅ | **无专课** | english.cool 有专文 | **与 across、over 三方成组** |
| **across** | `/grammar/british-grammar/across`（**与 through 同页**） | **A2** | **A1** ／ ox3000 ✅ | **无专课** | letmeenglish 有专文 | **与 through、over 三方成组** |
| **along** | `/grammar/british-grammar/along`（`Along or alongside?`） | **A2** | **A2** ／ ox3000 ✅ | **无专课** | 未见专文 | **与 alongside 成对（不是移动方向配对）** |
| **around** | `/grammar/british-grammar/around-or-round`（`Around or round?`） | **A2** | **A1** ／ ox3000 ✅ | **无专课** | english.cool 环岛专文（非介词课） | **与 round 成对（英式/美式变体）** |

> **等级口径注意**：Cambridge 中英词典给 `through`/`across`/`along`/`around`/`past` = **A2**、`into` = **A1**、`over` = **B1**；OALD 牛津 3000 词表把 **5 词全部标 A1**（`along` 词表标 **A2**，但 OALD 单页 badge 为 a1——**两处口径不一致，本表两列并陈，不合并**）。**五词全部落在 A1-A2**，即「零基础第二年会遇到」。

### 2.2 逐字引用（≥4 处，全部本轮实取）

**引 1 — Cambridge 把 through/across 的**错误用法**单独立节（这是全库唯一一家）**
URL：`https://dictionary.cambridge.org/grammar/british-grammar/through`（页面 canonical 已核，H1 = `Across, over or through?`）

> **"Across, over and through: typical errors"**
> "When moving from one side to another while surrounded by something, we use **through** not **across**: `We cycled through a number of small villages.` **Not: `We cycled across a number of small villages`.**"
> "When we talk about something extending or moving from one side to another, we use **across** not **on**: `The papers were spread across the table.` **Not: `The papers were spread on the table`.**"
> "We don't use **through** when we're talking about periods of time from start to finish and we mention a specific number of days, weeks, etc: `We haven't seen each other much over the last four years.` **Not: `We haven't seen each other much through the last four years`.**"

**同页的正面判据（逐字）**：
> "When we talk about movement from one side to another but 'in something', such as long grass or a forest, we use **through** instead of **across**: `I love walking through the forest.` (**through** stresses being in the forest as I walk) **Not: `I love walking across the forest`.**"

> **竞析判读**：Cambridge 给的判据是「**是否在里面走**」——`through` = 在内部走，`across` = 平面跨越。**这正是我方「零术语叙事」可以翻译成画面的那一刀**（如「钻进去走」vs「平着过去」）。**且 Cambridge 是全库唯一给「典型错误」的源——它的形态是「错句 + Not:」，而我们的形态是「错句 + 归因标签 + 回流」，比它多一层。**

**引 2 — Cambridge `in/into` 的方向对（我方 L18 的直接续篇）**
URL：`https://dictionary.cambridge.org/grammar/british-grammar/in-into`（H1 = `In, into`）

> "In and into are prepositions. **In, into: position and direction**"
> "We use **in** to talk about where something is in relation to a larger area around it: `A: Where's Jane? B: She's in the garden.`"
> "We use **into** to talk about the movement of something, usually with a verb that expresses movement (e.g. **go, come**). It shows where something is or was going: `A: Where's Jane? B: She's gone into the house.` `Helen came into the room.`"
> **"With some verbs (e.g. put, fall, jump, dive) we can use either in or into with no difference in meaning:** `Can you put the milk in/into the fridge?`"

> **竞析判读**：`into` 的跨源唯一配对是 **`in`**，而**我方 L18 已经教了 `in`（"My hat is in the box."）**。→ **`into` 的最佳落点是「L18 的方向版」，教学配对在库内已存在。** 且 Cambridge 明说 `into` 常与 **go/come** 搭配——我方 `go`（L9）与 `come` 亦在库内。

**引 3 — BC A1-A2 全目：教静态位置，不教移动方向**
URL：`https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2`（Level 标注 **A1-A2 grammar**）
该页 18 课全目（逐条实取）：`Adjectives and prepositions`／`Adjectives ending in '-ed' and '-ing'`／`Articles: 'a', 'an', 'the'`／`Articles: 'the' or no article`／`Comparative adjectives`／`Infinitive of purpose`／`Nouns: countable and uncountable`／`Past continuous and past simple`／`Possessive 's`／**`Prepositions of place: 'in', 'on', 'at'`**／`Prepositions of time: 'at', 'in', 'on'`／`Present simple`／`Present simple: 'have got'`／`Present simple: 'to be'`／`Quantifiers`／`Question forms`／`Using 'there is' and 'there are'`／`Verbs followed by '-ing' or infinitive`

> **→ `prepositions of movement` 专课 = 0。**

**BC `Prepositions of place` 页正文（逐字）**：URL `https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2/prepositions-place`，Level = **A1 Elementary / A2 Pre-intermediate**
> 只覆盖 `in`（inside a larger space）／`on`（a surface or similar）／`at`（common phrases and exact spots）。
> 例句逐字：`Please put the book on the shelf.`／`They live in Helsinki.`／`You should keep milk in the fridge.`／`Mette is studying at the library.`
> **"No movement or direction prepositions like through, across, into, along, or around are mentioned — only place/location usage."**（本轮 WebFetch 原文判读）

> **竞析判读**：**BC 的静态位置课与我方 L18/L79/L80/L81 是同一条线，而 BC 在这条线上停住了。** 我方若接上移动方向，就是**在同一梯度上比 BC 多走一段**——这是本项目最好的「位次证据」形态：不是超前，是**补一段 BC 自己空着的连续梯度**。

**引 4 — 中文侧：移动介词页的「核心教学块」是空的（只有一张图）**
URL：`https://letmeenglish.com/prepositions-of-movement/`（H1 = `行動介系詞的用法`）
页面结构逐字（H2 序列）：`行動介系詞的基本概念` → **`常見的行動介系詞`** → `如何表達上下車/船/飛機等` → `get on/get off 的用法` → `get in/get out of 的用法` → `如何表達乘坐交通工具去某地` → `行動介系詞 – 練習題`

> **`常見的行動介系詞` 这一节的 HTML 全文（实测）**：
> `<h2 class="wp-block-heading">常見的行動介系詞</h2>` 紧跟 `<figure class="wp-block-image size-full"><img ... src=".../2022/06/jiexici_xingdong_n.png" width="700" height="847"/></figure>` —— **H2 之后没有任何 `<p>` 正文，直接进入下一节。**
> **即：该站把 15 个移动介词的全部教学，压成了一张 PNG。**

我下载并查看了该 PNG（`https://letmeenglish.com/wp-content/uploads/2022/06/jiexici_xingdong_n.png`，实测 **HTTP 200，2,376,354 字节，PNG 700×847 RGBA**）。图内是**盒子的卡通示意 + 英文短语标签**，共 **14 格**（我目视逐格点过），标签为：
`into the box`／`out of the box`／`around the box`／`away from the box`／`toward the box`／`past the box`／`on to the box`／`off the box`／`over the box`／`under the wall`／`through the pipe`／`across the bridge`／`up the stairs`／`down the stairs`

> **⚠️ 注意三处实测事实（这三点比"只有一张图"更狠）**：
> **(1) 该页「正文」里几乎没有任何目标词。** 我把该页按 `練習題` 切成「正文段」与「练习段」两半做词边界计数，结果：
>
> | 词 | 正文段 | 练习段 |
> |---|---|---|
> | `through` | **0** | 6 |
> | `across` | **0** | 6 |
> | `past` | **0** | 2 |
> | `under` | **0** | 2 |
> | `up` | **0** | 4 |
> | `towards` | **0** | 4 |
> | `below` | **0** | 2 |
> | `along` | **0** | **0** |
> | `around` | **0** | **0** |
> | `into` | 1 | 8 |
> | `over` | 1 | 8 |
> | `down` | 1 | 8 |
>
> **即：该页把 through/across/past/under/up/towards/below 七个词的教学内容，完全不放进正文——它们只出现在图片像素里和四选一练习的选项里。**
> **(2) `along` 与 `around` 在这个「移动介词专页」里，连练习选项都没进（计数 = 0）。** 交叉验证：`across-over-through` 专页 `along` = 0（实测 `false`）；那张 14 格教学图里也无 `along`。**→ 中文侧最教学化的一家，实质上放弃了 `along`。**（这正是我 §5.2 拒绝 `along` 的独立第三源证据。）
> **(3) 该页的介词总数是 15 个**（含 `to` 6+31 ／ `from` ／ `by` ／ `on` ／ `off` ／ `out of`），**不是一个课程单元的量级**——即中文侧一站就把我方能拆 2–5 课的族一次讲完。

> **竞析判读**：**这张图同时证明两件事**——(a) **中文侧确实认为这 15 个词该一起教**（一次性 15 格，vs 我方历史单课最多 3 个新词的纪律，**是我们的 5 倍**）；(b) **但它的教学介质是「静态图 + 标签」，没有句子、没有场景、没有错句。** 图里是"盒子 + 箭头"，**不是"小美穿过夜市"**。→ **我们的场景叙事是这一格市场上不存在的形态。**

**引 5 — 中文侧另一家的「易错点」写法（他们知道坑，但只写到结论）**
URL：`https://www.sohu.com/a/944155292_100144070`（《初中英语语法专项：介词》）
> **"2. across/through/over：表"移动方式（穿过/越过）"**
> "**across：从物体"表面穿过"（平面移动）**"
> "**through：从物体"内部穿过"（空间穿透）**"
> "**over：从物体"上方越过"（不接触，有高度差）**"
> 例句逐字：`walk across the street（过马路，从路面表面过）`／`swim across the river（游过河，从水面过）`／`go through the forest（穿过森林，从树林内部过）`／`walk through the door（穿过门，从门内空间过）`／`jump over the fence（跳过栅栏，从上方越过）`／`fly over the city（飞过城市，从上空过）`
> **易错点提醒（逐字）**：
> "**学生易混淆over和across**" — "记住「over是'越过'（向上+向前），across是'穿过'（平面向前）」"，例 `jump over the desk`（跳过桌子）vs `walk across the floor`（走过地板）
> "**判断用through还是across，关键看「是否进入物体内部」**" — "穿过「空间/立体区域」（如森林、公园、隧道）用through，穿过「平面/表面」（如街道、广场、操场）用across"
> "「穿过门/窗户/隧道」均用through"
> **全文不使用表格**（本轮原文明说）

> **竞析判读**：**这是中文侧最好的一篇**——判据（表面 vs 内部）与 Cambridge 一致，且**点名了「学生易混淆 over 和 across」**。但它**止步于「记住」**：给的是**口诀**（"向上+向前"／"平面向前"），**没有给学生的错句实例、没有归因、没有回流机制**。**这就是我们的空位。**

### 2.3 Cambridge 各页定位（供设计参考，逐字）

| 页面 | canonical URL | H1 | 关键逐字 |
|---|---|---|---|
| `Along or alongside?` | `/grammar/british-grammar/along` | `Along or alongside?` | "As a preposition, **along** means '**in a line next to something long and thin**', e.g. a road, a path: `There were lots of shops along the main street.`" |
| `Around or round?` | `/grammar/british-grammar/around-or-round` | `Around or round?` | "We use **around** and **round** when we refer to **movements in circles or from one place to another**… `The earth goes round the sun.` (movement in circles)" |
| `On, onto` | `/grammar/british-grammar/on-onto` | `On, onto` | "We use **onto** to talk about **direction or movement to a position on a surface**, usually with a verb that expresses movement: `The cat climbed onto the roof.`" |
| `At, in and to (movement)` | `/grammar/british-grammar/at-in-and-to-movement` | `At, in and to (movement)` | "We use **to** when we are talking about **movement in the direction of a point, place, or position**: `Let's all go to the cinema tonight!`" |

> **⚠️ 重要结构性发现**：**Cambridge 的 `Prepositions and particles` 索引页没有 through/across/along/around 的条目**——它只列 `At, in and to (movement)`／`In, into`／`On, onto`／`Near and near to`／`Above`／`Below`／`Beneath`／`Beyond`／`Over`／`Under`／`By`／`From`／`To`。**`through`/`across`/`along`/`around` 被归到了 `Easily confused words` 类**（因为他们的页面标题是辨析形态）。**这是"这族没有独立课程位"的最直接结构证据。**

### 2.4 Cambridge 的「常见错误」库里没有移动介词

URL：`https://dictionary.cambridge.org/grammar/british-grammar/common-mistakes-in-english`
Cambridge 设有 **`Common mistakes in English` → `Prepositions`** 子库，**30 个条目**（逐条实取）：`afternoon`／`a lot`／`attention`／`back to`／`beach`／`course`／`day`／`decrease`／`difference`／`experience`／`floor`／`home`／`increase in or increase of?`／`interest`／`island`／`knowledge`／`last but not least`／`leave`／`need`／`newspaper`／`occasion`／`on the one hand...on the other hand`／`opinion`／`pleased`／`point of view`／`reason`／`responsible`／`rise`／`row`／`solution`／`take into consideration`／`television`／`train`／`world`／`worry`

> **→ 30 条里，与「移动方向」沾边的只有 `train` 一条**（且它是 `get on` vs `get in` 的**交通工具**搭配，不是路径介词）。

**`train` 页逐字（这条对我们直接有用）**：URL `https://dictionary.cambridge.org/grammar/british-grammar/train`
> "Remember to choose the correct preposition with **train**. **Don't say 'get in/into the train', say `get on the train`**: `I got on the train and sat down.` To talk about leaving a train, **don't say 'get out of', say `get off`**: `You need to get off the train at the last stop.` During the journey, you are **on the train**, not 'in the train'."

**`beach` 页逐字**：URL `https://dictionary.cambridge.org/grammar/british-grammar/beach`
> "**Don't say 'in the beach', say on the beach**: `We spent the whole day playing in the beach.` → `We spent the whole day playing on the beach.`"

**`leave` 页逐字**：URL `https://dictionary.cambridge.org/grammar/british-grammar/leave`
> "To talk about going away from somewhere to go somewhere else, **don't say 'leave to' a place, say leave for a place**: `Trains leave to London every 30 minutes.` → `Trains leave for London every 30 minutes.`"

**`home` 页逐字**（与我方 L9 一致）：URL `https://dictionary.cambridge.org/grammar/british-grammar/home`
> "We use **home as an adverb with verbs of movement** such as get, go, come, arrive, travel, drive. **We don't use to**: `I'm going home now.` **Not: `I'm going to home now`.**"

> **竞析判读**：Cambridge 的 `Common mistakes` 里**「移动」相关的错，全是「动词 + 介词搭配」，没有一条是「路径介词本身选错」**。→ **`through` vs `across` 这种"路径形状选错"的错，Cambridge 只在 `through` 页的 `typical errors` 里提了 3 条**，从未进入错误库。**这是"路径介词错误被系统性漏掉"的又一个独立证据。**

### 2.5 牛津 Practical English Usage（PUE）——**部分抓不到**

| 尝试 | 结果 |
|---|---|
| `https://elt.oup.com/catalogue/items/global/grammar_vocabulary/practical_english_usage/` | **HTTP 202，0 字节**（无内容） |
| `https://www.oxfordlearnersdictionaries.com/grammar/online-grammar` | **200**，但内容是 **`Learn & Practise Grammar (Beta)` 的产品介绍页**——**无 PUE 正文，无目录，无介词主题列表** |
| OALD 词条页（**替代证据，已实取**） | `through`/`across`/`into`/`around`/`past`/`over`/`off` **全部 `ox3000="y"`**，badge 指向 `wordlists/oxford3000-5000?list=ox3000&level=a1` |

> **明说：PUE 原件本轮未取到**。尝试的是官方两处（`elt.oup.com` 目录页 + `oxfordlearnersdictionaries.com/grammar/online-grammar`）。**替代位次证据**：OALD 牛津 3000 词表（`level=a1` 列表页实测 200，逐词核到 `through`/`across`/`into`/`along`/`around`/`past` 均在列表内）。**本批的「课程位」判定不依赖 PUE。**

---

## ③ 竞品矩阵与空位判定

### 3.1 八款产品矩阵

| # | 产品 | 侧 | 覆盖到哪一步 | 「移动方向介词」做到什么程度 | 形态 | 留的空位 |
|---|---|---|---|---|---|---|
| **1** | **Cambridge Dictionary Grammar / EGT** | 英 | 有内容 | **全库最强**：5 页覆盖 5 词，`through` 页有 **3 条 `typical errors`**（含 `Not:` 错例）；`In, into` 有 position/direction 对照 | **参考页 + 错误节** | **不是课程**——无课号、无顺序、无练习闭环；错误只列不回流；`through`/`across`/`along`/`around` **连独立索引条目都没有** |
| **2** | **British Council LearnEnglish** | 英 | **空** | **三档 68 课，专课 = 0**。教 `Prepositions of place: 'in', 'on', 'at'`（A1-A2）、`Prepositions of time`、`Verbs and prepositions`（B1-B2）——**就是不教移动方向** | 课程 | **整段落缺失**。他们的位置线停在我方 L18/L79-L81 的位置 |
| **3** | **OALD（牛津高阶）** | 英 | 词典层 | 五词全 **Oxford 3000**（A1/A2 词表级）；`into` 首义 `to a position in or inside something` | 词典 | 无课程、无辨析、无错误层 |
| **4** | **LDOCE（朗文）** | 英 | 词典层 | `through` 首义 `ENTER into one side or end of an entrance, passage, hole etc and out of the other side`；`across` 首义 `CROSS from one side of something to the other`；**有 `get through/make it through` 等短语格** | 词典 | 无课程；释义用 `ENTER`/`CROSS` 等大写语义词标（对零基础不可读） |
| **5** | **letmeenglish（中文侧最教学化）** | 中 | 有专页 | **`prepositions-of-movement` 专页**（15 词全含）＋**`across-over-through` 专页**；但核心块 `常見的行動介系詞` **正文为空、只有一张 PNG**；`across-over-through` 页逐字定义了 `across 強調穿越某個表面或區域的行為`／`over 常用來描述在…上方越過`／`through 用來描述從一端進入並從另一端離開` | **图片/短文 + 练习** | **无场景、无错句、无归因**；两页各自独立；练习是**纯四选一**（`The thief escaped through / across / into the window.`——**给 3 个候选让选，等于不给判据**） |
| **6** | **english.cool（英文庫）** | 中 | 有专文 | **`through` 有独立专文**（副标题式分 5 节：穿過／透過／從頭到尾／Monday through Friday／介系詞 vs 副詞）；**有「易混淆警告」逐字**：`through 和 across 都翻成「過」，但畫面不同——through 是「鑽進某個立體空間裡再出來」…across 是「從某個面的這一側到另一側」`；`by 是「直接用這個方法、工具」，through 則是「中間還經過一個人或管道」` | **长文（博客）+ 练习题** | **只有 through 一词有专文**（across/along/around/into 无）；**无场景串、无错句回流**；且 **`places-prepositions` 专文（地方介系詞）不含任何移动义**（本轮核实） |
| **7** | **搜狐/微信公号系（中考线）** | 中 | 有讲义 | `across/through/over：表"移动方式（穿过/越过）"`——**判据正确**（表面 vs 内部），**但形态是"记住"+"口诀"**；另有专文自认「**英语常用介词的误用常源于母语思维的负迁移**」＋「**介词冗余与缺失**」 | **讲义/口诀 + 真题** | **止步于"知道"**：无错句实例库、无归因、无回流；**内容同质化极高**（多篇逐字雷同） |
| **8** | **多邻国 / 扇贝 / 百词斩 / 流利说** | 中 | 未取到专项证据 | **本轮 4 次定向检索均未取到「这几家如何教介词」的可引用页面**——只取到官网首页与商店页。**不冒充结论**（见 §7 项 3） | — | — |

### 3.2 空位判定（三条）

**空位 A：「场景」在全部 8 款里 0 命中。**
最强的中文侧（letmeenglish）用的是**盒子 + 箭头**（静态示意图）；最强的英文侧（Cambridge）用的是**孤立例句**（`We cycled through a number of small villages.`）。**没有任何一家把移动介词放进一条连续的人物线里。** 我方「小美的一天」的差异化在这里是**真的空**——而且比位置介词（BC/Cambridge 都做）更空。

**空位 B：「错句回流」在全部 8 款里 0 命中。**
Cambridge **有**错句（`Not: We cycled across a number of small villages.`）——**但它只列不回流**：错句没有来源、没有归因、不会因为学员做错而再次出现。**这是离我们最近的一款，而它就差这一层。** 我方「错案 → 10 类归因标签 → 回流」是完整闭环。

**空位 C：中文侧仍是「表格/口诀 + 例句 dump」。**
- letmeenglish 移动页：**H2 + 一张 PNG**（本节已实证正文为空）。
- letmeenglish `across-over-through` 页：**3 段定义 + 8 题四选一**。
- 搜狐讲义：**分类 + 口诀**（"向上+向前"／"平面向前"），**明说不用表格但用了 bullet 列表**。
- **三家都没有「一个中文母语者会怎么错」的实例。** 没有 `*I went through the road`、没有 `*enter into the room`——**全部是"你应该怎么说"，没有"你为什么会说错"。**

> **→ 结论：空位判定成立。** 我方在这一族的差异化**不是"内容谁有谁没有"（Cambridge 有跨源最强的内容），而是**形态**：**把"辨析"变成"角色在场景里走一遍" + 把"错误"变成"可归因可回流的案子"。**

---

## ④ 中文负迁移证据（区分「源里明说」与「竞析推断」）

### 4.1 【源里明说】——有 URL 可核

| # | 明说内容 | 逐字原文 | 来源 URL | 强度 |
|---|---|---|---|---|
| **N1** | **介词误用源于母语负迁移** | "**英语常用介词的误用常源于母语思维的负迁移。学习者容易将汉语的表达习惯直接套用于英语介词的选择中，导致空间或逻辑关系表达出现偏差。**" | `https://www.sohu.com/a/1078711410_123000256` | **中**（单一源；且该页底部自标「含AI生成内容」→ **降级为"中文侧确实这么说"，不作为语言学证据**） |
| **N2** | **「介词冗余与缺失」是中国学习者的另一类常见错误** | "**介词冗余与缺失是另一类常见错误。在及物动词后误加介词，或在必须使用介词的不及物动词后遗漏介词，都会破坏句子的语法完整性与语义准确性。**" | 同上 | **中**（同上降级；但此坑与我方 `preposition` 标签 64 次的历史分布**方向一致**） |
| **N3** | **中文侧自认学生「易混淆 over 和 across」** | "**学生易混淆over和across**，记住「over是'越过'（向上+向前），across是'穿过'（平面向前）」，如「jump over the desk」（跳过桌子）vs「walk across the floor」（走过地板）" | `https://www.sohu.com/a/944155292_100144070` | **中-强**（明确点名混淆对，并给判据） |
| **N4** | **中文侧自认 through/across 的判据是「是否进入物体内部」** | "**判断用through还是across，关键看「是否进入物体内部」**"；"穿过「空间/立体区域」（如森林、公园、隧道）用through，穿过「平面/表面」（如街道、广场、操场）用across" | 同上 | **强**（与 Cambridge 独立一致） |
| **N5** | **中文侧自认 through 与 across 都译「过」而画面不同** | "**through 和 across 都翻成「過」，但畫面不同——through 是「鑽進某個立體空間裡再出來」…across 是「從某個面的這一側到另一側」**"；例句 `We walked across the street to grab some bubble tea.` | `https://english.cool/through/` | **强**（**本批最有价值的一条**：明确指出"中文都译成『过』"是混淆根源） |
| **N6** | ** Cambridge 自认 `arrive` 不能用 `to`** | "We say that we **arrive at** a place, when we see it as point, but we **arrive in** a larger area (e.g. a city or a country). **We don't use to with arrive**: `I arrived at the station just in time.` **Not: `I arrived to the station`** … `It was 4 pm when we arrived in Italy.` **Not: `… when we arrived to Italy`.**" | `https://dictionary.cambridge.org/grammar/british-grammar/at-in-and-to-movement` | **强**（**直接支撑 `*arrive into/to` 类错误**） |
| **N7** | **Cambridge 自认 `get in/into the train`、`get out of` 是错的** | "**Don't say 'get in/into the train', say `get on the train`** … **don't say 'get out of', say `get off`** … During the journey, you are **on the train**, not 'in the train'." | `https://dictionary.cambridge.org/grammar/british-grammar/train` | **强**（**直接支撑"中文『上车』一律用『进』→ 误用 into"**） |
| **N8** | **Cambridge 自认 `leave to` 是错的** | "**don't say 'leave to' a place, say leave for a place**: `Trains leave to London every 30 minutes.` → `Trains leave for London every 30 minutes.`" | `https://dictionary.cambridge.org/grammar/british-grammar/leave` | **强** |

### 4.2 【竞析推断】——**我推断，非源明说**

> **以下 5 条是我根据 N3–N7 的判据与中文语法事实做的推断，没有任何一个抓到的源逐字写过它们。标注为推断。**

**推断 I1：`*I went through the road`（该用 across）——来源是中文「过」的一词多义。**
- 依据：N5 明说「through 和 across 都翻成『過』」＋ N4 明说判据是「是否进入内部」。中文「过马路」的「过」**不携带"表面/内部"信息**，学生按中文选词只能随机。
- **推断**：中文母语者说「过马路」时，最自然的英文候选是 `cross`／`across`／`through` 三者竞争，而 `through` 因为在教材里常被解释为「穿过」（更"形象"）而被过度选中。
- **置信度：中**。**没有语料库数据支撑频率**，仅判据推演。

**推断 I2：`*enter into the room`（多了 into）——来源是「进入」的双字结构。**
- 依据：N2 明说「及物动词后误加介词」是常见错误类别。
- **推断**：中文「进入」是一个**双音节动词**，其「入」字本身已有"向内"义；学生把「进入」整体映射到 `enter into`（因为「入」≈`into`），产生冗余。同理「进来」→ `come in to`。**注意**：`enter into` 在英语中**确实存在但只用于抽象义**（`enter into an agreement`）——这让学生更难自查。
- **置信度：中高**（`enter` 在 OALD 标注 `[intransitive, transitive] to come or go into something`，**词典自己就用 `into` 释义**，这正是诱因）。
- ⚠️ **本轮未取到任何源逐字讨论 `enter into the room`**（3 次定向检索失败，见 §7）。

**推断 I3：`*arrive into` / `*arrive to`——来源是「到达」的介词空缺感。**
- 依据：**N6（Cambridge 明说 `Not: I arrived to the station`）**——**这是有明说支撑的**，Cambridge 主动列了 `arrive to` 的错误。`arrive into` 则是我从 `arrive to` 外推的。
- **推断**：中文「到」没有介词，学生感到"缺一块"，于是补一个。补 `to` 被 Cambridge 点名；补 `into` 是同一机制的另一分支。
- **置信度**：`arrive to` **高**（Cambridge 明说）；`arrive into` **中**（外推）。

**推断 I4：`*get into the bus` / `*get out of the train`——「上车」中文单字导致 into/on 不分。**
- 依据：**N7（Cambridge 明说 `Don't say 'get in/into the train', say get on the train`）**。
- **推断**：中文「上车／下车」只有一个「上／下」，**不区分"跨上去（on）"还是"钻进去（in）"**。英语的切分依据是**交通工具的"平台性"**（公交/火车/飞机 = on；出租车/私家车 = in），**这个维度中文完全没有**。
- **置信度：高**（Cambridge 明说 + 中文维度确实缺失）。**这条是本族里"最硬的中文负迁移"——比我推断 I1 硬。**

**推断 I5：中文教材以「穿过」对译 through、以「横过／跨过」对译 across，但学生对「森林」与「马路」的差别没有语感。**
- 依据：N3/N4（中文侧自己给的判据是"空间/立体 vs 平面/表面"）＋ N5（都译「过」）。
- **推断**：判据本身是**几何词汇**（空间/立体/平面/表面），**对零基础用户不可操作**——他们不知道"马路算平面、森林算立体"。**我方「零术语叙事」正好可以解决这个**：不用"平面/立体"，用**"脚底贴着走"vs"人钻在里面走"**。
- **置信度：中高**（判据难度是推断，但"几何词汇对零基础不可用"与本文档 §1 的立项前提一致）。

### 4.3 我方库内已验证的 `preposition` 错案（本批自查补充）

我方 `huntCases.ts` 的 `preposition` 标签共 **64 次**（全库 199 案）。逐条抽出前 20 条，**全部是静态位置/时间/固定搭配**，无一条路径介词：

> `arrive at 用于较小的地方（station、airport 这类具体的点），arrive in 用于城市和国家。`／`go home 中间不加 to——home 在这里自己就是「目的地」`／`「在左边」用 on the left——on 管方位。`／`「去商店」中间要垫 to：go to the shop——to 带路到地方。`／`在学校门口用 at：at the school gate——at 管具体的点（门、车站）。`／`在桌子上（表面）用 on：on the table。in 是「在里面」。`／…

> **判读**：我方 `preposition` 标签的 64 案里，**`through`/`across`/`into`/`along`/`around` 相关 = 0**（与 §6 自查一致）。**即：本族的错句回流是完全的处女地，不存在"已被占用"的错案。** 且**已有的 `arrive at/in` 与 `go home` 两条，正是本族最自然的前置接口**（中文负迁移 I3 的库内落点）。

---

## ⑤ 拆分建议（与用户研究独立作答）

### 5.1 我的建议：**2 课**

| 课 | 建议目标句 | 教的新词 | 教学配对（跨源依据） | 与库内接口 |
|---|---|---|---|---|
| **L191** | `She walked into the kitchen.` | **`into`（1 个）** | Cambridge `In, into`（**position vs direction** 对照页，A1） | **L18 `in`**（"My hat is in the box."）——**同页配对，库内已在** |
| **L192** | `We walked through the forest.` | **`through` + `across`（2 个）** | Cambridge **同页**（`Across, over or through?`，H1 唯一）；两词共 1 页 = 跨源把它们绑在一起 | **L80 `behind`/`in front of`**（静态路径已教）＋ 中文侧 N3/N4/N5 的混淆对 |

**合计新词 = 3 个**。**这是有意压到与历史最高持平**（批二十的 3 个），而**不是** roadmap 上批建议的"拆 2 课"就完事——**2 课里第 2 课是"一对"，第 1 课是"单点"**，这是有理由的不对称。

**为什么 `into` 单独一课、`through/across` 合课？**
- `into` 的跨源配对是 **`in`**（一对一，position/direction），**单一对照轴**，不需要第三词；
- `through`/`across` 的跨源配对是**彼此**（Cambridge 唯一一页同时定义两者 + 唯一有 `typical errors` 的页），**必须同框才成立**——分开教就丢掉了跨源最重要的那一刀；
- **`over` 不进来（⚠️ 这是一个可被推翻的判断，见 §7 不确定项 4）**：Cambridge 的 `Across, over or through?` **页里确实含 `over`**（H1 就是三词），**所以"同页=同课"的严格口径会把 `over` 拉进 L192**。我仍排除它，理由有两条：(a) 中文侧 N3 明确把 `over` 列为**第三个混淆者**（"学生易混淆over和across"）——**三词同框会让 L192 承载 3 个新词，顶格零余量**；(b) **`over` 的跨源 CEFR 明显靠后**（Cambridge 中英词典 **B1**，是本族唯一非 A1/A2 的词），而 `through`/`across` 都是 **A2**——**等级不同轴，不宜同课**。`over` 留待后续（我方全库 `over` 仅 1 次且是 `over there` 习语，见 §6）。

### 5.2 建议**拒绝**的候选（本项目鼓励拒绝低价值候选）

| 候选 | 裁决 | 理由（三条，**均不依赖"中文难度"**） |
|---|---|---|
| **`along`** | ❌ **不做** | **(a) 跨源无教学配对**：Cambridge 的 `along` 页是 **`Along or alongside?`**——它的对照词是 **`alongside`**（一个我方全库为 0、且 OALD 未进 Oxford3000 的词），**不是任何移动方向词**。**即：连权威源都没把 `along` 放进这一族教。** **(b) 中文侧证据 = 零（本轮实测）**：`along` 在 letmeenglish 移动介词专页的**正文段 0 次、练习段 0 次**（我实测该页 19 词的分段计数，见 §2.2 引 4），在 `across-over-through` 专页 **0 次**，在那张 14 格教学图里**也不存在**；english.cool **无 along 专文**。**即：中文侧做得最细的一家，实质上放弃了 `along`。** **(c) 语义边界模糊**：Cambridge 自己给的释义是 `'in a line next to something long and thin'`——**这是一个"位置+形状"混合义，不是纯方向**，与 L79 `next to`（"紧挨着"）在中文里几乎无法区分（我方已有 3 课在教"旁边"：L79/L80/L81）。**边际收益最低。** |
| **`around`** | ❌ **不做** | **(a) 跨源位次是"变体辨析"不是"方向教学"**：Cambridge 的 `around` 页是 **`Around or round?`**——**英美变体对照**（"Around is more common in American English. Round is a little more common in speaking"）。**这是语域问题，不是方向语义问题**，对零基础无教学价值。 **(b) 我方库内已有更优落点**：全库 `绕` **6 次**已存在于既有语境；`around` 若立课，最自然的中文锚点是「环岛／到处逛」（english.cool 的环岛专文即此），**属于词汇线（`travel around`）而非语法线**——与本项目「语法课」定位不符。 **(c) 方向义与"大约"义冲突**：Cambridge 同页明说 `Around can also mean 'approximately'`——**一个词两个高频义，初次教学会分心**（这正是批三十七「拒绝同义换词」的同一条纪律）。 |
| **`past`** | ❌ **不做**（本轮未列入 5 词，我确认应继续零） | 全库 **3 次命中全部是 `past`（过去）的词形/时态用法**（`lesson-24-past-vs-perfect`／`lesson-34-past-continuous`／`hunt-past-rainy-day`），**与"经过"义无关**。若教 `past` 的移动义，**会与我方 3 课既有的 `past`（过去）形成同形干扰**——**这是"低价值且高风险"的候选**。 |
| **`toward(s)`／`onto`／`upon`／`beyond`／`throughout`** | ❌ 不做 | 全库 0（§6 自查确认）；`toward` **未进 Oxford3000 A1 列表**（本轮实测 `toward` 在 A1 列表 raw=0）、`onto`/`upon`/`beyond` 均非 A1 必学。**超本批范围，且无任何跨源课程位。** |

### 5.3 与 roadmap 上批建议的关系

上批写的是「**5 词超先例，建议拆 2 课或转词汇线**」。**我的答案是"拆 2 课"，但把它收窄到 3 个词、并明确拒绝 2 个**——即：**批次数（2 课）与上批建议一致，但承载的词从 5 个降到 3 个**。这不是打折扣，是**"1 课 1 个 + 1 课 2 个"的分配**，对比"2 课 5 个"（会让一课最高 3 个，正好顶格、零余量）。

### 5.4 ⚠️ 一致性声明：我的理由**是否**与「中文难度」一致

**明确回答：不一致，而且我是有意不一致的。**

- **「中文难度」的追问会得出不同答案**：若按"中文里最难对齐"排，**`into` 其实是最容易的**（中文「进」直接对应），**`along` 反而最难**（中文「沿着」是**有专门词**的，反而`along`与`alongside`的中文都可能是"沿着"——**中文侧会造成 along/alongside 混淆**）。**按中文难度，`along` 该排在 `through/across` 之前。**
- **我用的判据是「跨源课程位 + 跨源教学配对」，不是中文难度。** 理由：
  1. **本项目的历史纪律**（批三十七逐字）：「跨源成立的**不**等于该做，还要问边际收益」——**位次是准入线，不是优先级**；
  2. **中文难度无法从外部源验证**：我本轮**没有取到任何语料库频率数据**（见 §7 项 4），所有中文难度判断只能是推断（§4.2 全部标了推断）。**用一个不可验证的判据排优先级，会把不确定性注入批次决策。**
  3. **位次证据反而是硬的**：`into` = A1（Cambridge 中文词典 + OALD 双源 A1）；`through`/`across` = Cambridge 同页 + 两源 Oxford3000；`along` = **跨源唯独它没有方向课配对**。**这个排序可复核。**
- **但我要指出这个不一致是一个真实分歧点**：如果用户研究（瑞思侧）从中文难度出发**建议先做 `along`**，**两个研究的排序会冲突**，请主理人显式裁决（我保留我的排序，理由是它可复核；但不主张中文难度是错的判据，只主张它本轮不可验证）。

---

## ⑥ 自我核查记录（命令 + 输出）

> 按要求：**全部用 node 词边界正则**在 `src/data/grammarLessons.ts` 与 `src/data/huntCases.ts` 全库验证；**不使用 grep**（本地是 ugrep，`-oniE "(^|[^A-Za-z])word([^A-Za-z]|$)"` 会假返回 0）；**不是只查被指认的那一课**。

### 命令 1 — 移动介词族全库词边界计数（自查 1）

```bash
cd /Users/liujun/Documents/英语听写 && node -e '
const fs=require("fs");
const L=fs.readFileSync("src/data/grammarLessons.ts","utf8");
const H=fs.readFileSync("src/data/huntCases.ts","utf8");
const wb=(t,w)=>{const re=new RegExp("(^|[^A-Za-z])"+w+"([^A-Za-z]|$)","gi");return (t.match(re)||[]).length};
const fam=["through","around","into","across","along","toward","towards","onto","upon","beyond","throughout","round"];
console.log("word".padEnd(12)+"grammarLessons".padStart(16)+"huntCases".padStart(12));
let allzero=true;
for(const w of fam){const a=wb(L,w),b=wb(H,w); if(a||b)allzero=false; console.log(w.padEnd(12)+String(a).padStart(16)+String(b).padStart(12));}
console.log("ALL ZERO: "+allzero);'
```

**输出**：
```
word          grammarLessons   huntCases
through                    0           0
around                     0           0
into                       0           0
across                     0           0
along                      0           0
toward                     0           0
towards                    0           0
onto                       0           0
upon                       0           0
beyond                     0           0
throughout                 0           0
round                      0           0
ALL ZERO: true
```
**→ 任务书"全库为零"的断言：✅ 证实（12 词全部 0，两文件）。**

### 命令 2 — 静态位置族已教全（自查 2）

```bash
cd /Users/liujun/Documents/英语听写 && node -e '
const fs=require("fs");
const L=fs.readFileSync("src/data/grammarLessons.ts","utf8");
const H=fs.readFileSync("src/data/huntCases.ts","utf8");
const wb=(t,w)=>{const re=new RegExp("(^|[^A-Za-z])"+w+"([^A-Za-z]|$)","gi");return (t.match(re)||[]).length};
console.log("word".padEnd(12)+"grammarLessons".padStart(16)+"huntCases".padStart(12));
for(const w of ["in","on","at","under","near","behind","between","front","next"]) console.log(w.padEnd(12)+String(wb(L,w)).padStart(16)+String(wb(H,w)).padStart(12));'
```

**输出**：
```
word          grammarLessons   huntCases
in                       488         143
on                       287         118
at                       532          92
under                     26           0
near                      29           4
behind                    64           2
between                   63           4
front                     36           2
next                     147          19
```
**→ 任务书"静态位置介词已教全"：✅ 证实（各词均有大量命中）。**

### 命令 3 — 短语级复核（自查 3）

```bash
cd /Users/liujun/Documents/英语听写 && node -e '
const fs=require("fs");
const L=fs.readFileSync("src/data/grammarLessons.ts","utf8");
const H=fs.readFileSync("src/data/huntCases.ts","utf8");
const ph=(t,p)=>(t.toLowerCase().match(new RegExp(p.replace(/ /g,"\\s+"),"g"))||[]).length;
for(const p of ["next to","in front of","through the","across the","into the","along the","around the"]) console.log(p.padEnd(14)+String(ph(L,p)).padStart(16)+String(ph(H,p)).padStart(12));'
```

**输出**：
```
next to                   121          11
in front of                29           0
through the                 0           0
across the                  0           0
into the                    0           0
along the                   0           0
around the                  0           0
```
**→ 短语级也全零，排除"单词正则通过但短语存在"的可能。✅**

### 命令 4 — 候选目标句占用检查（自查 4）

```bash
cd /Users/liujun/Documents/英语听写 && node -e '
const fs=require("fs");
const B=(fs.readFileSync("src/data/grammarLessons.ts","utf8")+"\n"+fs.readFileSync("src/data/huntCases.ts","utf8")).toLowerCase();
for(const s of ["walked into the kitchen","walked through the forest","walked across the road","into the kitchen","through the forest","across the road","walked into","walked through"]) console.log((B.includes(s)?"USED ":"FREE ")+" \""+s+"\"");'
```

**输出**：
```
FREE  "walked into the kitchen"
FREE  "walked through the forest"
FREE  "walked across the road"
FREE  "into the kitchen"
FREE  "through the forest"
FREE  "across the road"
FREE  "walked into"
FREE  "walked through"
```
**→ §5.1 建议的两个目标句均未被占用。✅**

### 命令 5 — 叙事词（房内术语）占用检查（自查 5）

```bash
cd /Users/liujun/Documents/英语听写 && node -e '
const fs=require("fs");
const L=fs.readFileSync("src/data/grammarLessons.ts","utf8");
const H=fs.readFileSync("src/data/huntCases.ts","utf8");
for(const t of ["穿过","穿过原样","绕过","沿着","横穿","垫板","站最前面","领一整句"]) console.log(t.padEnd(10)+"L="+String(L.split(t).length-1).padStart(4)+"  H="+String(H.split(t).length-1).padStart(3));'
```

**输出**：
```
穿过        L=   0  H=  0
穿过原样      L=   0  H=  0
绕过        L=   0  H=  0
沿着        L=   0  H=  0
横穿        L=   0  H=  0
垫板        L= 174  H= 21
站最前面      L=  61  H=  0
领一整句      L=  40  H=  0
```
**→ 「穿过」「绕过」「沿着」「横穿」四个候选叙事词全部零占用（可自由造）；既有三件套术语（垫板／站最前面／领一整句）在位。✅**

### 命令 6 — 存量计数与号段（自查 6）

```bash
cd /Users/liujun/Documents/英语听写 && node -e '
const fs=require("fs");
const L=fs.readFileSync("src/data/grammarLessons.ts","utf8");
const H=fs.readFileSync("src/data/huntCases.ts","utf8");
console.log("lessons="+[...L.matchAll(/id:\s*"lesson-[^"]+"/g)].length+"  cases="+[...H.matchAll(/id:\s*"hunt-[^"]+"/g)].length);
console.log("max lesson number="+Math.max(...[...L.matchAll(/number:\s*(\d+),/g)].map(m=>+m[1])));
console.log("max case number="+Math.max(...[...H.matchAll(/number:\s*(\d+),/g)].map(m=>+m[1])));'
```

**输出**：
```
lessons=190  cases=199
max lesson number=190
max case number=199
```
**→ 与任务书"190 课／199 案"一致；下一课应为 L191、下一案应为 #200（或按既有编号惯例）。✅ 注：我方 §5.1 给的 L191/L192 号段未与现存冲突。**

### 命令 7 — 错句标签分布与 `preposition` 案性质（自查 7，本批新增）

```bash
cd /Users/liujun/Documents/英语听写 && node -e '
const fs=require("fs");const H=fs.readFileSync("src/data/huntCases.ts","utf8");
const tags={}; for(const m of H.matchAll(/tag:\s*"([a-z_]+)"/g)) tags[m[1]]=(tags[m[1]]||0)+1;
console.log("tags: "+JSON.stringify(tags));
const re=/tag:\s*"preposition"[\s\S]{0,600}?explanation:\s*"([^"]*)"/g; let m,c=0;
while((m=re.exec(H))&&c<8){c++;console.log("  "+c+". "+m[1]);}'
```

**输出（节选）**：
```
tags: {"tense":76,"plural":127,"sv_agreement":126,"article":32,"missing_be":26,"preposition":64,"run_on":19,"verb_form":151,"word_order":91,"fragment":28}
  1. 国家、城市这样的大地方用 in：live in China。at 用于具体的点，比如 at the station。
  2. be good at 是固定搭配：good at math。这类搭配要整块记，不能按中文的「在…方面」去推。
  3. arrive at 用于较小的地方（station、airport 这类具体的点），arrive in 用于城市和国家。
  4. go home 中间不加 to——home 在这里自己就是「目的地」，直接说 went home。
  ...
```
**→ `preposition` 标签 64 案全部为静态位置/时间/固定搭配；路径介词（本族 5 词）相关 = 0。✅ 本族错句回流为处女地。**

### 命令 8 — 零术语红线与 `介词` 命中位置（自查 8，本批新增，**发现一处内部风险**）```bash
cd /Users/liujun/Documents/英语听写 && node -e '
const fs=require("fs");const L=fs.readFileSync("src/data/grammarLessons.ts","utf8");
let i=L.indexOf("介词"),c=0;
while(i>0){c++;console.log("@"+i+" ctx: ..."+L.slice(Math.max(0,i-260),i+160).replace(/\s+/g," ")+"...\n"); i=L.indexOf("介词",i+1);}'
```
**输出（3 处，全部为 JS 注释）**：
```
@109642 ctx: ... // ── 第二季进阶篇 · R6（L18 介词）：高频三词 in/on/at，地点+时间双场景 ── id: "lesson-18-preposition" ...
@114200 ctx: ... // R9 变形/替换：换地方 in the box→on the desk，介词跟着变（构造迁移，复用 choose 判题） ...
@120460 ctx: ... // R8 跨课复现：上一课（L18 介词）的句式混入，抗遗忘 ...
```
**读 `src/data/grammarZeroTerms.ts`（31 行）确认**：`GRAMMAR_ZERO_TERMS` 明确包含 `"介词"`（第 32 行末项）。
**→ 断言：`介词` 是红线词；全库正文命中 3 次但**全在 JS 注释里**（课程内容 0 次）。新批 `grammarLabel` 必须避开，沿用 `位置词`（全库 20 次）。✅ 并登记一处**建议**：本族需要一个新中文标签（候选「走法词」全库 0 命中，可用）。**

### 命令 8b — letmeenglish 移动页「正文段 vs 练习段」分段词边界计数（自查 8b，本批新增，**产出 §2.2 引 4 的核心发现**）

```bash
cd /tmp && node -e '
const fs=require("fs");const t=fs.readFileSync("/tmp/le_mov.html","utf8");
const i=t.indexOf("練習題");
const prose=t.slice(0,i>0?i:t.length), prac=t.slice(i>0?i:0);
const w=["along","around","towards","toward","across","through","into","past","over","under","up","down","from","to","out of","off","on","below","by"];
console.log("word".padEnd(9)+"prose".padStart(7)+"practice".padStart(10));
for(const x of w){ const re=new RegExp("(^|[^A-Za-z])"+x.replace(/ /g,"\\s")+"([^A-Za-z]|$)","gi");
  console.log(x.padEnd(9)+String((prose.match(re)||[]).length).padStart(7)+String((prac.match(re)||[]).length).padStart(10)); }'
```

**输出**：
```
word       prose  practice
along          0         0
around         0         0
towards        0         4
toward         0         0
across         0         6
through        0         6
into           1         8
past           0         2
over           1         8
under          0         2
up             0         4
down           1         8
from           7         3
to            31        17
out of         9         4
off           10         7
on            43        12
below          0         2
by             6         1
```
**→ 断言（已成为 §2.2 引 4 与 §3.2 空位 C 的硬证据）：**
- **`through`/`across`/`past`/`under`/`up`/`towards`/`below` 七个词在正文段全部 = 0**，只在练习段的选项里出现；
- **`along` 与 `around` 在两段中全部 = 0**（连选项都没进）；
- **注意口径**：本命令是在该页 HTML 文本层上做的，**图片像素内的文字（`around the box` 等）不计入**——所以 `around` 的 0 指「HTML 文本层 0」，不是「整页 0」（我在 §2.2 已区分陈述）。✅
- **交叉验证**：`along` 在 `https://letmeenglish.com/across-over-through/` 的 HTML 中亦为 0（`/(^|[^A-Za-z])along([^A-Za-z]|$)/i` 实测返回 `false`）。✅

### 命令 9 — `under`/`past`/`over`/`off` 存量上下文（自查 9，复核任务书给的"零散非教学位"）

```bash
cd /Users/liujun/Documents/英语听写 && node -e '
const fs=require("fs");const L=fs.readFileSync("src/data/grammarLessons.ts","utf8");
function ctx(w,max){const re=new RegExp("(^|[^A-Za-z])"+w+"([^A-Za-z]|$)","gi");let m,c=0;console.log("### "+w);
while((m=re.exec(L))&&c<max){c++;console.log("  @"+m.index+" ..."+L.slice(Math.max(0,m.index-90),m.index+70).replace(/\s+/g," ")+"...");} if(!c)console.log("  NONE");}
ctx("past",4); ctx("over",2); ctx("off",2);'
```

**输出**：
```
### past
  @149329 ... // 做过版核心句由 variants 肯定卡 + 破案/练习承载。零新增分词，全批复用。 id: "lesson-24-past-vs-perfect" ...
  @214989 ... // R10（L34 过去进行时）：依赖 L13 现在进行 + L10 一般过去，故排最后 ── id: "lesson-34-past-continuous" ...
  @221153 ... huntCaseIds: ["hunt-past-rainy-day"] ...
### over
  @263537 ... { who: "npc", en: "Who is the boy over there?", zh: "她指了指窗边。" } ...
### off
  @925517 ... { who: "npc", en: "Two months off!", zh: "她眼睛发亮。" } ...
```
**→ 复核任务书断言：`over` 1 次（`over there` 习语，L41）✅；`off` 1 次（`Two months off!` 名词用法，L137）✅；`past` 3 次（**全部是词形 id 与 `过去` 义，非"经过"义**）✅。**
**→ `under` 26 次（本轮另查：集中在 L26 `There is a cat under the chair.` 及其对比卡 + L79 复现）——任务书称之为"零散非教学位"，**我的复核结论是：`under` 在 L26 的 `examples`/`contrast` 里确实被当作教学例句使用，但 **L26 的 `grammarLabel` 是「存在句 · there is / there are」，不是位置介词课**——**所以任务书的措辞（"非教学位"）成立，但 `under` 并非"零散"，而是"被借用的例句词"。建议主理人知晓这一细微差别。** ⚠️**

---

## ⑦ 抓不到的源与不确定项

| # | 抓不到的源 | 尝试了什么 | 影响 | 建议 |
|---|---|---|---|---|
| **1** | **Murphy《English Grammar in Use》双册原件（任务书点名核实）** | **✅ 本轮再次确认完全不可得，且比上批更差**：`find /Users/liujun /tmp /private/tmp -maxdepth 4 -iname "*murphy*"` → **0 命中**（连上批的 `pygments/styles/murphy.py` 都未出现在 4 层内）；**上批记录的 `/private/tmp/murphy_int.html`（1304 字节 503 错误页）本轮 `ls` 已不存在** | **中**——本批「课程位」判定**不依赖 Murphy**：改用 **Cambridge 5 页实取** ＋ **BC 三档 68 课全目** ＋ **OALD 7 词 ox3000 badge** ＋ **LDOCE 2 词** 四层独立证据 | **请主理人正式确认：Murphy 记为"永久不可得源"，后续批次不再重复尝试。**（本轮是我方第 4 次以上重复确认，已无信息增量。） |
| **2** | **牛津 Practical English Usage（PUE）原件** | `elt.oup.com` 目录页 → **HTTP 202，0 字节**；`oxfordlearnersdictionaries.com/grammar/online-grammar` → 200 但**只是 `Learn & Practise Grammar (Beta)` 的产品介绍页，无正文/无目录** | **低-中**——PUE 是任务书点名的四源之一。**替代**：OALD 牛津3000 词表（已取，`level=a1`）＋ OALD 单词页 badge | 如需 PUE 正文级证据须人工翻书。**本批「等级/位次」结论已由 Cambridge ＋ BC ＋ OALD 三源交叉，PUE 缺席不改变结论。** |
| **3** | **多邻国／扇贝／百词斩／流利说的「介词教学」实证** | **4 次定向检索**（`多邻国+英语+课程+语法+介词+教学方式+评价`／`扇贝英语+百词斩+流利说+语法+介词+功能对比`／`BBC Learning English prepositions of movement`／`英语兔+介词+视频+B站`）——**全部只返回官网首页/商店页/百科条目，无任何可引用的教学内容页** | **中**——§3.1 第 8 行**留空**，**不冒充结论**。这 4 款是中文侧装机量最大的产品，**它们教不教移动方向介词，本批无法回答** | **⚠️ 我在 §3 矩阵里把第 8 行标为"未取到专项证据"而不是填"无"——请勿把该行读作"它们不做"。** 如主理人认为必需，建议人工用 App 实测（这些产品的 Web 端不暴露课程内容）。 |
| **4** | **中国学习者语料库（CLEC 等）中 `through`/`across`/`into` 的偏误频率** | **3 次检索**（`中国学生+英语+介词+负迁移+语料库+across+through+into+偏误`／`英汉+空间介词+对比+负迁移+汉语+英语+差异+研究`／`"介词错误"+中国学生+英语+例句+改错`）——**Bing 返回的均为「中华人民共和国_百度百科」「中国地图」等无关页**（引擎把查询退化为"中国"），**知网/CNKI 无入口** | **高**——**这是本批最大的不确定项。** §4.2 的全部 5 条推断（I1–I5）**没有频率数据支撑**；我无法说"`*through the road` 是中国学生的第几高频错" | **本批结论已按无频率数据处理**（所有推断标了置信度、且 §5.4 明确"中文难度本轮不可验证"）。**若主理人需要中文负迁移的量化证据，需另找语料库渠道（人工）。** |
| **5** | **`enter into the room`／`arrive into` 的逐字教学源** | **3 次检索**（含引号精确匹配 `"enter into the room" 错`／`"arrive into"`）——**全部返回 ACTA/TESOL 学术会议页或词典首页，无一家逐字讨论** | **中**——§4.2 的 **I2（`enter into`）与 I3 的 `arrive into` 分支因此是纯推断**（`arrive to` 有 Cambridge 明说支撑，见 N6） | 已如实标注「推断」+ 置信度。**建议主理人不要在下批 PRD 里把 `*enter into the room` 当作"有源支撑的典型错"引用**——它的支撑只有我的推断 I2。 |
| **6** | **BBC Learning English 的介词页** | `bbc.co.uk/learningenglish/english/course/lower-intermediate/unit-1` → **Connect Timeout（443，10s）**；`cn.bing.com` 检索 BBC 介词课 → **仅返回 BBC 门户页与百科**，无课程页 | **低**——BBC 非任务书点名四源之一；且其课程页结构与 BC 同类，**BC 的"三档零命中"已足够** | 若需补强可人工访问。**本批不列入结论依赖。** |
| **7** | **知乎专栏两篇介词长文** | `https://zhuanlan.zhihu.com/p/74325865`（《英语介词用法总结》）与 `https://zhuanlan.zhihu.com/p/363509582`（《史上最精简通透的介词语法知识》）→ **均 HTTP 403 Forbidden**（反爬） | **低-中**——知乎是中文侧代表源。**替代**：本轮改用搜狐/english.cool/letmeenglish 三家中文侧实取，**证据量已足**（N1–N5） | 记为"反爬不可得"，非内容不存在。**⚠️ 请勿引用这两篇的内容——我从未读到它们的正文，只是检索到了标题与 URL。** |

### 不确定项（诚实清单）

1. **最大不确定**：**中文负迁移的实际频率**（§7 项 4）。我给出的 5 条推断里，**只有 `*arrive to` 与 `*get into the train` 有 Cambridge 明说支撑（N6/N7）**；`*through the road`（I1）与 `*enter into the room`（I2）**是我从中文语法事实推演的，无源**。
2. **第二不确定**：**`along` 的拒绝理由 (c)「与 L79 next to 在中文里几乎无法区分」是推断**——我没有实测中国学生是否真的混淆 `along` 与 `next to`。**若用户研究提出反对，这条可以被推翻**；但 `along` 的拒绝理由 (a)「跨源无方向课配对」（Cambridge 页是 `Along or alongside?`）**是硬的、可复核的**。
3. **`under` 的"教学位"措辞**（§6 命令 9）：任务书写"零散非教学位"，我的复核显示 `under` 在 L26 被用作**教学例句词**（`There is a cat under the chair.` 出现在 `examples` 与 `contrast`）。**我判"非教学位"仍成立（因为 L26 的课名是存在句）**，但这与"零散"的措辞有细微差别，**已如实上报**。
4. **`over` 是否该进第 2 课**：Cambridge 把 `Across, over or through?` **三词同页**（H1 就是这三个词）——**严格按"同页 = 同课"的口径，`over` 也该进 L192**。我把它排除的理由是**中文侧 N3 明确把它列为第三混淆者（三词同框超载）＋ 我方 `over` 仅 1 次（`over there` 习语）**。**这是一个我可以被说服的判断**，若主理人要求"忠实于跨源同页"，则应做 3 词课（但那会让 L192 承载 3 个新词，顶格零余量）。
5. **`into` 的目标句**：我建议 `She walked into the kitchen.`（`walked into` 全库 FREE）。但 `enter` 在库内 **0 次**，`walk` 已有 184 次——**选 `walk` 是"复用高频动词"还是"动词太熟反而不注意介词"，我没有数据**。备选 `He ran into the room.`（`run` 152 次）同样 FREE。
6. **本轮所有网络源均为 2026-09-21 单次实取**，未做第二日复核。Cambridge 页面带 `© Cambridge University Press & Assessment 2026`，内容以该日为准。

---

## 附：本批实取源清单（供复核）

| 源 | URL | 结果 |
|---|---|---|
| Cambridge `Across, over or through?` | `https://dictionary.cambridge.org/grammar/british-grammar/through` | ✅ 200，443–453KB，canonical + H1 已核 |
| Cambridge `In, into` | `https://dictionary.cambridge.org/grammar/british-grammar/in-into` | ✅ 200 |
| Cambridge `On, onto` | `https://dictionary.cambridge.org/grammar/british-grammar/on-onto` | ✅ 200 |
| Cambridge `At, in and to (movement)` | `https://dictionary.cambridge.org/grammar/british-grammar/at-in-and-to-movement` | ✅ 200 |
| Cambridge `Along or alongside?` | `https://dictionary.cambridge.org/grammar/british-grammar/along` | ✅ 200 |
| Cambridge `Around or round?` | `https://dictionary.cambridge.org/grammar/british-grammar/around-or-round` | ✅ 200 |
| Cambridge `Over` | `https://dictionary.cambridge.org/grammar/british-grammar/over` | ✅ 200 |
| Cambridge `To`／`Past` | `.../to`／`.../past` | ✅ 200 |
| Cambridge `Prepositions and particles` 索引 | `https://dictionary.cambridge.org/grammar/british-grammar/prepositions-and-particles` | ✅ 200（**结构证据：无 through/across/along/around 条目**） |
| Cambridge `Common mistakes → Prepositions` 索引 | `https://dictionary.cambridge.org/grammar/british-grammar/common-mistakes-in-english` | ✅ 200（30 条全目） |
| Cambridge 错误页 `train`／`beach`／`leave`／`home`／`island`／`row` | `.../train` 等 6 页 | ✅ 200 |
| Cambridge 中英词典 | `.../zht/詞典/英語-漢語-繁體/{through,across,into,along,around,past,over}` | ✅ 200（含 CEFR badge） |
| BC A1-A2 全目 | `https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2` | ✅ WebFetch（18 课全目） |
| BC B1-B2 全目 | `.../free-resources/grammar/b1-b2` | ✅ WebFetch（36 课全目） |
| BC C1 全目 | `.../free-resources/grammar/c1` | ✅ WebFetch（14 课全目） |
| BC `Prepositions of place` | `.../a1-a2/prepositions-place` | ✅ WebFetch（A1/A2） |
| BC 参考层总索引 | `.../free-resources/grammar/english-grammar-reference` | ✅ WebFetch（**无 Prepositions 类**） |
| OALD 词条 | `oxfordlearnersdictionaries.com/definition/english/{through_1,across_1,into,along_1,around_1,past_1,over_1,off_1,enter,arrive}` | ✅ 200（`ox3000="y"` + badge level） |
| OALD 牛津3000 A1 词表 | `.../wordlists/oxford3000-5000?dataset=english&list=ox3000&level=a1` | ✅ 200，196KB（逐词核在列表内） |
| LDOCE | `ldoceonline.com/dictionary/{through,across}` | ✅ 200 |
| english.cool `through` 专文 | `https://english.cool/through/` | ✅ WebFetch（**含易混淆警告**） |
| english.cool `prepositions-overview` | `https://english.cool/prepositions-overview/` | ✅（**5 词均不在内**） |
| english.cool `places-prepositions` | `https://english.cool/places-prepositions/` | ✅（**无移动义**） |
| english.cool `by-through-via` | `https://english.cool/by-through-via/` | ✅ |
| english.cool sitemap（875 帖） | `https://english.cool/wp-sitemap-posts-post-1.xml` | ✅ 89,932 字节，875 条 |
| letmeenglish `prepositions-of-movement` | `https://letmeenglish.com/prepositions-of-movement/` | ✅ 200（**核心节正文为空，仅 PNG**） |
| letmeenglish 移动介词 PNG | `https://letmeenglish.com/wp-content/uploads/2022/06/jiexici_xingdong_n.png` | ✅ 200，**2,376,354 字节，700×847**（已下载查看） |
| letmeenglish `across-over-through` | `https://letmeenglish.com/across-over-through/` | ✅ 200 |
| letmeenglish sitemap（965 URL） | `https://letmeenglish.com/post-sitemap.xml` | ✅ 221,381 字节 |
| 搜狐《初中英语语法专项：介词》 | `https://www.sohu.com/a/944155292_100144070` | ✅ WebFetch（**N3/N4 明说**） |
| 搜狐《英语常用介词》 | `https://www.sohu.com/a/1078711410_123000256` | ✅ 200（**N1/N2 明说**；⚠️ 自标含 AI 生成） |
| 搜狐《介词辨析 through, across, over》 | `https://www.sohu.com/a/444393182_781131` | ✅ WebFetch（**无易错点**） |
| ❌ 知乎两篇 | `zhuanlan.zhihu.com/p/74325865`／`p/363509582` | ❌ **403** |
| ❌ PUE | `elt.oup.com/catalogue/.../practical_english_usage/` | ❌ **202，0 字节** |
| ❌ Murphy | 全盘 `find` | ❌ **0 命中** |
| ❌ BBC LE 课程页 | `bbc.co.uk/learningenglish/.../unit-1` | ❌ **timeout** |
| ❌ 多邻国/扇贝/百词斩/流利说 | 4 次检索 | ❌ **无可引用内容页** |

---

**竞析 · 第 38 批 · 2026-09-21**
