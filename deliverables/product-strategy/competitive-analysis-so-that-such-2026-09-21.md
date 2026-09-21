# 竞品与外部权威源分析：`so ... that`（结果）与 `such a`（第 39 批）

**日期**：2026-09-21 ｜ **类型**：竞析（竞品 + 外部权威源） ｜ **作者**：竞析
**主题**：`so ... that` 结果结构 / `such a` 的跨源位次、竞品空位、中文负迁移、可做性判断
**上游**：`roadmap-grammar-thirty-eighth-batch-2026-09-21.md` §5 携带项 #6（"`so ... that` / `such a`｜待办｜**若做须先验证能否凑 3 条带标记错**"）
**本批附带**：独立复核 `pickCorrectionWord` 垃圾词数字（题目称 115 处）
**本批不做**：不改任何代码/数据。纯研究交付。

---

## ① 结论摘要

| # | 结论 | 证据强度 |
|---|---|---|
| **1** | **`such` 在我方全库是绝对的零，而不是"少"。** 用词边界正则扫 `targetSentence` + `dialogueEn` 共 **384 条**学习者可见英文句子：`such` = **0**、`such a/an` = **0**、`so ... that` 同句 = **0**。整文件 raw 扫（含中文讲解与注释）`such` 也是 **0**。**这是一个从未被触碰的结构。** | **强**（node 实扫，命令见 §7） |
| **2** | **跨源位次高度一致：`so ... that` / `such a` 是 B1 内容，且永远是"配对教"。** BC LearnEnglish 把它放在 **B1-B2 档**的专课 `Intensifiers: 'so' and 'such'`（**36 课里的第 10 课**）；Cambridge 的中英词典给 `such a` = **A2**、`such` 的"of this kind"义 = **B2**；OALD 给 `such` = **A2/B1**、`so` = **a1/a2/b1**。**没有任何一家把它放在 A1 或 A2 的"基础课位"。** | **强**（4 源实取） |
| **3** | **"和谁一起教"有跨源共识：`so` 与 `such` 必须成对出场**，判据是「后面接的是词还是名词块」。Cambridge 有一整页 `Such or so?`（属 `Easily confused words` 分类），**六条 `typical errors` 全是 "so/such 选错"**；BC 专课同一节里 `so`/`such` 并列，还额外带 `so much/so many` 的例外。**两个结构在跨源里从不单独出现。** | **强**（Cambridge + BC 逐字） |
| **4** | **但它与我们已教的 L186 `so that`（目的）存在真实冲突，且冲突是"必然发生"的。** L186 的 `oneLineRule` 明写「说『是为了让谁做什么』用 so that」；而 `so ... that` 与 `so that` 在**中文里都翻成「以至于/为了」相近的因果块**，中文侧最细的一家（english.cool）**专门写了一篇 `so-that-such-that` 来拆这个对**，逐字承认这是混淆点。**我方 L186 的 `contrast` 已有 5 条对照，但全部围绕 `in order to` / `because...so`，一条都没预告 `so ... that`。** | **强**（原文两处 + 源码逐字） |
| **5** | **竞品空位：8 款产品，无一款做「`so...that` 的场景 + 错句回流」。** `so/such` 辨析内容**大量存在但全是静态**：Cambridge 是参考页 + 错误节，BC 是课程页，中文侧是「表格/规则 + 例句 dump」。**「错句回流成课」这一形态 0 命中**——Cambridge 的 `typical errors` 是最接近的，**它只列不回流**。 | **强**（矩阵见 §3） |
| **6** | **中文负迁移：只有 1 条有源支撑，其余全是我的推断。** 有源的是：**中文侧自认的 `so`/`such` 混淆点**（english.cool + letmeenglish 两处逐字）；Cambridge `Such or so?` 页的 **6 条典型错误里 3 条直指"该用 such 时用了 so"**（虽未标注中文母语者，但 `so` 可作"所以"连词是中文学习者独有的超载）。**其余 4 条（如"太…了以致于"直译导致 so...that 泛化）我没找到任何源明说，本报告一律标为推断。** | **中**（1 源明说 + 4 条推断，逐条标注见 §4） |
| **7** | **我的判断：不做。** 理由三条且**互相独立**：(a) **位次太靠后**——4 源一致把它放 B1，我方当前在 L186-L192 才刚走到"目的/方式"层，而 `so...that` 是**结果从句 + 形容词/副词/名词三形态 + that 可选**，比我方已教的任何一个结构都"厚"；(b) **与 L186 冲突**——同形不同义的 `so that` 紧邻在 L186，新课必须回头改 L186 的对照，**属于"改旧课"而非"加新课"的成本**；(c) **边际收益低**——`so...that` 是**写作偏好型结构，不是错误高发型**：我方 201 案 748 个植错点里，**没有一案的罪名是围绕它植的**，`so`/`such` 选错在中国学习者的错句库里**不是高频项**（见 §4 的诚实声明）。**→ 建议明确拒绝，理由与"难不难"无关。** | **中**（判据见 §5） |
| **8** | **115 这个数字复核成立（且口径要写清）。** 独立复算：`correction` 字段 **748** 个 → `pickCorrectionWord` 返回非空 **640** 个 → 其中**非纯英文单词 115 个**（去重后 63 种）。构成：**尾部标点型 102 处**（如 `first.` / `books.` / `reading,`）+ **中文括号说明型 13 处**（如 `（去掉 to）` / `（So 与 do I 对调）`）。**影响 86/201 案**，按钮「把 N 个改正词加入错词本」的 N **被高估 115 个槽位**。 | **强**（3 次复算同值） |
| **9** | **最小修法：两处改动，且顺序有讲究。** ① **先判原始 `correction` 里有没有中文**（CJK）→ 有则整条跳过；② **再剥首尾非字母字符**。**必须先判再剥**：若只剥不判，`（So 与 do I 对调）` 会被剥成 **`So`**、`（rather 跟在 would 后）` 剥成 **`rather`**、`（drink → drinking 或去掉）` 剥成 **`drink`**——**三个语法上干净、语义上完全错的假改正词会被静默写进错词本**。该修法实测：**入库 627 个干净词、垃圾 0、现有 525 个正确词取值 0 处被改动。** | **强**（模拟实测） |
| **10** | **一处遗留问题，本修法不解决，建议单独排期。** 修完后仍有 **60 处「入库词 == 原词」**（`happy` / `is happy`、`cake` / `a cake`、`best` / `the best`）——**只是加/改了功能词，没有词形可学**（missing_be 13 / article 11 / word_order 11 / run_on 8 / preposition 7 / verb_form 5 / fragment 5）。这**不是垃圾字符**，是**语义空卡**，属另一个问题域。 | **强**（实测分类） |

**一句话给主理人**：`so ... that` / `such a` **该拒绝**——不是因为它不重要（4 源都给 B1 专课），而是因为**它在我们这条线上的位置错了**：它要吃掉 L186 的 `so that`，要引入"结果从句"这层我方尚未建立的语法骨架，而且**它不治任何中国学习者的高频错**。**顺手把 `pickCorrectionWord` 修了**——那是真实的脏数据（115 处垃圾词、86 案受影响），修法两行、零回归。

---

## ② 跨源位次表（等级 / 单元 / 逐字引用 + URL）

### 2.1 位次总表

| 源 | 侧 | 位次 / 单元 | 覆盖内容 | 与谁一起教 |
|---|---|---|---|---|
| **British Council LearnEnglish** | 英 | **B1-B2 档**专课 `Intensifiers: 'so' and 'such'`（B1-B2 共 36 课，此课列第 10） | `so` + 形容词/副词；`such` + 名词块；**"Saying the result" 一节专讲 `that` 分句**；`so much/many/little/few` 例外 | **so 与 such 同页并列**；`Using 'enough'` 也在同档（第 33 课） |
| **Cambridge Dictionary Grammar** | 英 | 专页 **`Such or so?`**，归在 **`Easily confused words`** 分类 | **6 条 `typical errors` 全部是 so/such 选错**；对照表；`so much/many` 例外 | **成对教**（页面标题就是"A 或 B"） |
| **Cambridge 中英词典（CEFR 口径）** | 英 | `such` = **A2**（首义）/ **B2**（"of this kind"义）；`so` = **A2→C1** 跨四档 | 词典义项 + 语法框 | — |
| **OALD 牛津高阶** | 英 | `such` = **A2 / B1**（含 `OPAL W` `OPAL S` 徽章）；`so` = **a1 / a2 / b1** | 词条格式 `such a/an…`；`so… (that)…` | **不成课**，只在词条里给格式 |
| **牛津 Practical English Usage** | 英 | **抓不到**（详见 §8 项 2） | — | — |
| **Murphy《English Grammar in Use》** | 英 | **抓不到**（本项目历史已确认为"永久不可得源"，本批未重复无效尝试） | — | — |
| **letmeenglish（中文侧最教学化）** | 中 | 专页 `so-such` | **5 条格式并列**：`so + 形容词/副词 + (that…)`、`such a + (形容词) + 可数单数名词 + (that…)`、`such + (形容词) + 不可数/复数名词 + (that…)`、`so much + 不可数 + (that…)`、`so many + 复数 + (that…)` | **so 与 such 同页**，且**五个格式全部带 `(that…)` 可选件** |
| **english.cool（英文庫）** | 中 | 专文 `so-that-such-that` | **专门拆 `so…that` vs `such…that` vs `so that` vs `such that` 四方**；带 ❌/⭕️ 错例 | **四方并列**，且**把 `so that`（目的）拉进同一篇对比** |
| **learn-en.org** | 中 | 词条页 `such` | 标题承诺"常见错误及例句解析"，**正文实测无错误节**（见 §8 项 5） | 只有 `so (adv.)` 一行同义注 |

> **等级口径注意**：**没有任何一家把 `so...that` / `such a` 放在 A1-A2 的基础课位。** BC 把它排在 B1-B2 档；Cambridge 词典给 `such` 首义 A2 但**"such…that" 与 "such a" 属另一义项**（B2 附近）；OALD 给 `such` = A2/B1。**我方当前 L192 处于"零基础第 192 课"，从"零起点 vs 绝对位次"看并不越级，但从"我方自身难度曲线"看它是首次引入「结果从句」这一层。**

### 2.2 逐字引用（本轮实取，≥4 处）

**引 1 — BC 把 `so`/`such` 与 `that` 分句放在同一节课里（这是"配对教"的最硬证据）**
URL：`https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/intensifiers-so-such`
（页面标题 = `Intensifiers: 'so' and 'such'`；Language level 栏明写 B1 Intermediate / B2 Upper intermediate）

> **Adjectives and adverbs**
> "With an adjective or adverb, 'so' intensifies: `It's so hot today!`"
> **Nouns**
> "With a noun or adjective + noun, use 'such': `You're such an angel!`"
> **Saying the result ("that" clauses)**
> "These structures often combine with 'that' plus a clause: `It was so cold that the water in the lake froze.`"
> "`He was such a good teacher that we all passed the exam.`"
> "`There's so much noise that I can't think!`"

> **竞析判读**：BC 把 `so`/`such` 的**三种形态**（形容词/副词、名词、much/many 例外）和**结果分句**压进**一节**。这意味着**跨源认为这是"一个教学单元"，不是三个**。若我方要做，**必须一次吃下三形态 + 结果分句**——这就是我 §5 判"不做"的第一条理由的量化依据。

**引 2 — Cambridge 的 6 条典型错误，全部是 so/such 选错（且带 `Not:` 反例）**
URL：`https://dictionary.cambridge.org/grammar/british-grammar/such-or-so`（H1 = `Such or so?`；分类 = `Easily confused words`）

> **"Such is a determiner; so is an adverb."**
> **"We use such + noun phrase and so + adjective or adverb phrase."**
> 对照：`Those are such good chocolates.` / `Those chocolates are so good.`
> `She is such a great cook.`（**Not: `She is so great cook.`**）
> `That was so unpleasant.`（**Not: `That was such unpleasant.`**）
> `Why do you drive so fast?`（**Not: `Why do you drive such fast?`**）
> 比例例外：**"So but not such can also be used in front of much, many, little, few to add emphasis"**——`So much food was wasted every day.`（**Not: `Such much food…`**）

**Typical errors 四条（逐字）**：
> ① "Use `such`, not `so`, before a noun even with an adjective: `They're such snobs!`（**Not: `They're so snobs…`**）"
> ② "Use `such` before a noun phrase with `a/an`: `This is such a wonderful kitchen!`（**Not: `This is a so wonderful kitchen!`**）"
> ③ "Use `so`, not `such`, before adjectives: `You're so kind.`（**Not: `You're such kind.`**）"
> ④ "Use `so`, not `such`, before adverbs: `She always dresses so elegantly.`（**Not: `She always dresses such elegantly.`**）"

> **竞析判读**：**这四条错误全部是"同一个词选错"，没有一条是"结构搭错"。** 也就是说跨源共识里，这个知识点的**难点是二选一**，不是构造。**这恰好是我方"侦探纠错 + 归因标签"形态最擅长的事**——但见 §5：**擅长不等于值得做**。

**引 3 — Cambridge 把 `such` 的 `that` 分句单独立节，并给出 `such a … that` 的完整例句**
URL：`https://dictionary.cambridge.org/grammar/british-grammar/such`（H1 = `Such`）

> **Heading: `Such … that`**
> "We can use a that-clause after a noun phrase with such:"
> "`He is such a bad-tempered person that no one can work with him for long.`"
> "`It was such a long and difficult exam that I was completely exhausted at the end.`"
>
> **Heading: `Such as a determiner`**
> "We use such before the indefinite article, a/an:"
> "`We had such an awful meal at that restaurant!`"
> **Incorrect form noted: "`We had a such awful meal …`"**

**同源另一页给出 `so ... that` 的正面规则 + 一条明确的禁用警告**
URL：`https://dictionary.cambridge.org/grammar/british-grammar/so`（H1 = `So`）

> **Section: `So and that-clauses`**
> "`so + that` acts as a conjunction introducing clauses of reason and explanation":
> "`They both went on a diet so that they could play more football with their friends.`"
> "`so + adjective or adverb` can precede a that-clause": "`It was so hot that we didn't leave the air-conditioned room all day.`"
> **Warning（逐字）："We do not use very in this structure."**
> 反例已被页面标出：**`They drove very fast that …`** ↔ 正例 **`They drove so fast that they escaped the police car that was chasing them.`**

> **竞析判读**：**`so ... that` 与 `so that` 在 Cambridge 是同一页的两个小节。** 这直接说明我方若做新课，**不可能不碰 L186**——同一页面、同一分类，跨源自己就没把它们分开。

**引 4 — Cambridge `So much and so many`：`such` 与 `so` 的例外块（第三形态）**
URL：`https://dictionary.cambridge.org/grammar/british-grammar/so-much-and-so-many`

> "Use `so` before much, many, little, and few."
> "`There were so many people on the beach it was difficult to get into the sea.`"
> "`You've eaten so little and I've eaten so much!`"
> "Use `so much`, not `so`, before comparatives: `I feel so much better after I've been for a run in the park.`（**Not: `so better`**）"
> 同页回指：**"`such` is used instead of `so` before an attributive adjective (adjective + noun) and to modify noun phrases"**——`She emailed us such lovely pictures`（**Not: `so lovely pictures`**）

**引 5 — OALD：两个词的 CEFR 位次与格式框（英侧词典口径）**
URL：`https://www.oxfordlearnersdictionaries.com/definition/english/such`

> 徽章：**A2**（首义，链到 Oxford 3000 列表）+ **B1**（另两义）；另有 **`OPAL W` / `OPAL S`** 徽章。
> 格式框：**"`such a/an…`"** —— 例 **`Why are you in such a hurry?`**
> 格式框：**"`such is something that… (formal)`"** —— 例 **`Such is the elegance of this typeface that it is still a favourite of designers.`**
> 另有：`The damage was such that it would cost thousands to repair.` / `This issue was of such importance that we could not afford to ignore it.`

URL：`https://www.oxfordlearnersdictionaries.com/definition/english/so_1`

> 徽章：**a1 / a2 / b1**（按义项分档）
> 格式框：**"`so… (that)…`"** —— 例 **`She spoke so quietly (that) I could hardly hear her.`**
> 格式框：**"`so… that` (formal)"** —— 定义 "in such a way that"，例 **`The programme has been so organized that none of the talks overlap.`**
> 格式框：`so as to do something` —— 例 `We went early so as to get good seats.`

> **口径提示**：OALD 把 `so…(that)…` 标为**普通**、`so… that` 标为 **(formal)**；`such is something that…` 也标 **(formal)**。**"that 可选"在 OALD 是用括号 `(that)` 表达的**——这是一个可以直接翻译成我方话术的细节（"那个 that 可带可不带"）。

**引 6 — `so that`（目的）在 Cambridge 是独立页，且明说可以省略 that 并另有"结果"义**
URL：`https://dictionary.cambridge.org/grammar/british-grammar/so-that-or-in-order-that`

> "So that is much more common, while in order that is more formal."
> `I'll go by car so that I can take more luggage.`
> **"After so in informal situations, that is often dropped."** —— `I've made some sandwiches so (that) we can have a snack on the way.`
> **"So that (but NOT in order that) can also mean 'with the result that.'"** —— `The birds return every year around March, so that April is a good time to see them.`

> **竞析判读 — 这条是本批最关键的一条**：Cambridge **自己承认 `so that` 可以表"结果"**（`so that April is a good time to see them`），**并且 `that` 可以省**。**也就是说 `so (that) ...` 的"目的"与"结果"在跨源里是一条连续带，不是两个词。** 我方 L186 把 `so that` 钉在"目的"上并教了「so that 后面跟谁 + 能做什么」——**这个教法本身没错（BC/Cambridge 都以目的为 first sense），但它把"结果"这一半彻底留白了，而留白处正是新课要占的位置。这是"必须回头改 L186"的技术依据。**

**引 7 — 中文侧最细的一家：四方对比专文（`so…that` / `such…that` / `so that` / `such that`）**
URL：`https://english.cool/so-that-such-that/`

> **Main distinctions（逐字）**：**"so 講「所以」、so that 講「為了」、such that 講「使得」"**
> `so`：结果连词 —— `I was really tired, so I went to bed early.`（我超累，所以就早點睡了。）
> `so that`：目的 —— `I left home early so that I could catch the first train.`（我提早出門，為了能趕上第一班車。）
> `such that`：正式，表"使得" —— `Arrange the chairs such that everyone can see the screen.`（把椅子排成讓每個人都看得到螢幕的樣子。）
>
> **so… that… vs such… that…（混淆点节）**：
> 两者都表 **"如此⋯⋯以致於"**；**"so 後面接形容詞／副詞，such 後面接名詞。"**
> `It was so cold that my fingers went numb.`（天氣冷到我手指都凍麻了。）
> `He is such a nice person that everyone in the office likes him.`（他人好到辦公室裡每個人都喜歡他。）
> 判据：检查 `that` 前核心词是形容词还是名词——**"形容詞（difficult、tired）用 so，名詞（a nice person、a mess）用 such。"**
> ⭕️ `He is such a nice person that everyone likes him.` ／ ❌ **`He is so a nice person that everyone likes him.`**
> **警告：拆开的 `such… that…` 与连写的 `such that（使得）` 不同。**

> **竞析判读**：**这是一篇"因为我方要教的东西会让学习者混淆，所以中文侧专门写了一篇来拆"的文献。** 它拆的对象正是我方 L186（`so that` = 為了）与新课（`so…that` = 如此…以致於）。**中文侧最细的一家认为这三者必须一起讲——而我们一起讲的空间只剩"回头改 L186"。**

**引 8 — 中文侧教学化程度最高的一家：五格式并列且全部带 `(that…)`**
URL：`https://letmeenglish.com/so-such/`

> "so 和 such 都能用來加強語氣（相當於 very/really）"
> 学习者困难点（逐字）：**"到底該用 so + 形容詞/副詞，還是 such / such a + 名詞？"**
> 格式（逐字）：
> - `so + 形容詞或副詞 + ( that …)`
> - `such a +（形容詞）+可數單數名詞 + (that… )`
> - `such +（形容詞）+ 不可數名詞或複數名詞 + ( that… )`
> - `so much + 不可數名詞 + (that…)`
> - `so many + 複數名詞 + ( that… )`
>
> 例句：`He is so good (that) he gets bored when he plays against me.` / `It had been such a terrible day (that) I just wanted to go to bed.` / `We had such terrible weather (that) we decided to go back home.` / `She always cooks so much food that we have to throw half of it away.` / `There were so many people at the concert (that) we didn’t really enjoy it.`

> **竞析判读**：**五个格式、五个例句，全部是"格式 → 一个孤立例句"。** 没有场景、没有人物、没有"你会怎么说错"。**这是中文侧形态的样本：它把跨源共识（五形态）完整抄了下来，但形态仍是 dump。** 我方若做，差异化确实存在（场景 + 错句）——**问题仍是"值不值"，见 §5。**

**引 9 — 中文侧的其他样本（用于 §3 竞品矩阵）**
URL：`https://english.cool/such/`
> "So 後面可以接形容詞/副詞，而 Such 後面接名詞。" —— 单选题答案 `such, so, such`。
> 错误警告（逐字）：**"如果 such 後面接的是單數名詞，就必須是 such a/an ，不可以顛倒過來，寫成 a/an such."**
> ❌ `Timmy is a such quiet cat.` ⭕️ `Timmy is such a quiet cat.`
> 例句对：`She is so smart.` vs `She is such a smart girl.` / `The book is so good.` vs `It's such a good book.`

URL：`https://dictionary.cambridge.org/grammar/british-grammar/determiners-such`（Cambridge，`Determiners: such`）
> "When it refers to a singular countable noun, such is followed by a or an."
> **"Don't say `such person/event/situation`, say `such a person, event, situation`."**
> 反例：`We had such good holiday in Greece last year.` → 正例：`We had such a good holiday in Greece last year.`

URL：`https://letmeenglish.com/so-therefore/`（用于 §4 的 `so` 连词侧写）
> "so 通常出現在句子的中間，而 therefore 則出現在一個新句子的開頭"
> "相較於 so，therefore 更加正式"
> **错误（逐字）："`So I stayed at home, it was raining.`（錯誤）"** —— 页面解释：不能把结果分句放在原因分句前面。

---

## ③ 竞品矩阵与空位判定

### 3.1 八款产品矩阵

| # | 产品 | 侧 | 覆盖到哪一步 | 「so...that / such a」做到什么程度 | 形态 | 留的空位 |
|---|---|---|---|---|---|---|
| **1** | **Cambridge Dictionary Grammar** | 英 | **内容最强** | **5 页覆盖**：`Such or so?`（**6 条 typical errors，全部带 `Not:` 反例**）＋ `Such`（`Such … that` 独立节，2 例句）＋ `So`（`So and that-clauses` 节 + **"We do not use very in this structure"** 警告）＋ `So much and so many`（例外块）＋ `Determiners: such`（`such a` vs `such`） | **参考页 + 错误节** | **不是课程**——无课号、无顺序、无练习闭环；**错误只列不回流**（错句没有来源、没有归因、不会因学员做错而再现）；五页**分散在 3 个分类下**（`Easily confused words` / `Determiners` / `Adverbs`） |
| **2** | **British Council LearnEnglish** | 英 | **有专课** | **B1-B2 档第 10 课 `Intensifiers: 'so' and 'such'`**（36 课之一）；含 `Saying the result ("that" clauses)` 节，**3 个 `that` 分句例句**；同档另有 `Using 'enough'`（第 33 课） | **课程（一课多形态）** | **一课吃三形态 + 结果分句**；**无场景人物线**（例句是 `It's so hot today!` 这类孤立句）；**无错句层**（无 typical errors 节）；**无回流** |
| **3** | **OALD（牛津高阶）** | 英 | 词典层 | `such` = **A2/B1** + `OPAL W`/`OPAL S`；格式框 `such a/an…`、`such is something that… (formal)`；`so` = **a1/a2/b1**，格式框 `so… (that)…`、`so… that (formal)`、`so as to do` | 词典 | 无课程、无辨析页、**无错误层**；`(that)` 括号写法对零基础不可读 |
| **4** | **letmeenglish**（中文侧最教学化） | 中 | **有专页** | `so-such` 专页：**5 个格式 + 5 个例句**，格式全部带 `(that…)` 可选件；逐字承认困难点是"到底该用 so + 形容词/副词，还是 such / such a + 名词？" | **格式列表 + 例句 dump** | **无场景、无错句、无归因**；`(that…)` 直接照抄 OALD 式括号写法；**五个格式五条例句，一条不落，但也不解释为什么** |
| **5** | **english.cool（英文庫）** | 中 | **有专文** | **`so-that-such-that` 四方对比专文**（so / so that / such that / so…that / such…that）；**带 ⭕️❌ 错例**；另有 `such` 专文（`a such` vs `such a` 错误警告） | **长文（博客）+ 单选题** | **把四方拉进一篇文章，但仍是"规则 + 错例"**；**无场景串、无错句回流**；`so...that` 与 `such...that` 各自只有 1 个例句 |
| **6** | **learn-en.org** | 中 | 词条页 | 标题承诺 **"常见错误及例句解析"** 与"避免中国学习者…"，**正文实测无错误节**（见 §8 项 5） | 词条 | **标题与正文不符**（承诺的"常见错误"不存在）；`such vs so` 只剩同义注一行 |
| **7** | **搜狐/微信公号系（中考线）** | 中 | 讲义 | **本轮未取到 `so...that`/`such a` 的可引用专页**（检索返回的是"中式风格"装修内容，见 §8 项 4）；**不冒充结论** | — | — |
| **8** | **多邻国 / 扇贝 / 百词斩 / 流利说 / 句乐部** | 中 | 未取到专项证据 | **本轮定向检索未取到这几家如何教 `so...that` 的可引用页面**——只取到官网首页与商店页，**均未描述语法点或纠错功能**。句乐部（中文侧"用句子学英语"产品）逐字只提到 **"自动算好每个知识点的最佳复习时间"**、**"直接问 AI 英语老师"**，**无 `错句` 功能描述**。**不冒充结论** | — | — |

### 3.2 空位判定（三条）

**空位 A：「场景」在全部 8 款里 0 命中。**
最强的英文侧（BC）用的是 `It's so hot today!` / `You're such an angel!` 这类**孤立例句**；最强的中文侧（letmeenglish）用的是**格式表**（`so + 形容詞或副詞 + ( that …)`）。**没有任何一家把 `so...that` 放进一条连续的人物线里。** 我方「小美的一天」的差异化在这里**是真的空**。

**空位 B：「错句回流」在全部 8 款里 0 命中。**
Cambridge **有**错句（**6 条，全部带 `Not:`**）——**但它只列不回流**：错句没有来源、没有归因、不会因为学员做错而再次出现。**这是离我们最近的一款，而它就差这一层。** 我方「错案 → 10 类归因标签 → 回流」是完整闭环。

**空位 C：中文侧仍是「格式表 + 例句 dump」。**
- letmeenglish：**5 格式 + 5 例句**，`(that…)` 直接照抄。
- english.cool：**四方对比**（本篇最细），但仍是无场景的规则长文。
- Cambridge 的 `Determiners: such`：**`Don't say… say…` 一个格式对**。
- **三家都没有「一个中文母语者会怎么错」的机制解释。** 全部是"你应该怎么说"，**没有"你为什么会说错"**——**这正是 §4 我找不到源支撑的原因**。

> **→ 空位判定成立，但它这次不能替我方的"做"背书。** 差异化是真的（场景 + 回流两层全空），**但"有差异化空间"与"值得占用一课"是两个问题**。**§5 给出后者的答案：不。**

---

## ④ 中文负迁移证据（严格区分「源里明说」与「竞析推断」）

### 4.1 源里明说（有 URL 支撑）

| # | 内容 | 来源 | 性质 |
|---|---|---|---|
| **M1** | **`so`/`such` 的混淆是中文侧自认的痛点。** letmeenglish 逐字：**"到底該用 so + 形容詞/副詞，還是 such / such a + 名詞？"**；english.cool 逐字：**"such 和 so 两个单词意思相近，都表示'如此、这样、这么'的意思，使用时很容易混淆"**（该句取自 Bing 检索摘要，正文 403） | `https://letmeenglish.com/so-such/`；`https://zhuanlan.zhihu.com/p/66745706`（仅摘要可得） | **源里明说**（letmeenglish 正文实取；知乎仅摘要） |
| **M2** | **`a such` 语序错误是中文侧点名的一条。** english.cool 逐字：**"如果 such 後面接的是單數名詞，就必須是 such a/an ，不可以顛倒過來，寫成 a/an such."**，并把 **`Timmy is a such quiet cat.`** 标为 ❌ | `https://english.cool/such/` | **源里明说** |
| **M3** | **`so…that` 与 `so that` 的冲突是中文侧专门写文来拆的。** english.cool 逐字：**"so 講「所以」、so that 講「為了」、such that 講「使得」"**；并明确警告拆分写法与 `such that（使得）` 不同 | `https://english.cool/so-that-such-that/` | **源里明说** |
| **M4** | **`so`（所以）的语序误用有中文侧明说。** letmeenglish 逐字：**"`So I stayed at home, it was raining.`（錯誤）"**，并解释不能把结果分句放前 | `https://letmeenglish.com/so-therefore/` | **源里明说** |
| **M5** | **Cambridge 给了 6 条 so/such 选错的反例**（`Not: She is so great cook.` / `Not: That was such unpleasant.` / `Not: Why do you drive such fast?` / `Not: They're so snobs…` / `Not: This is a so wonderful kitchen!` / `Not: You're such kind.`） | `https://dictionary.cambridge.org/grammar/british-grammar/such-or-so` | **源里明说**（但**该页未标注错误来自中文母语者**——属"学习者语料"，非"中文母语者语料"） |
| **M6** | **`such` 单用（不加 a）是 Cambridge 点名的错误。** 逐字：**"Don't say `such person/event/situation`, say `such a person, event, situation`."** | `https://dictionary.cambridge.org/grammar/british-grammar/determiners-such` | **源里明说** |

> **口径纪律声明**：**M5 是唯一"有错例但未标注母语背景"的一条，我把它保留在"明说"但加了括注。** Cambridge 该页的语料来源是 Cambridge Learner Corpus（全世界的学习者），**§8 项 6 记录了我没能取到该语料的"中文子库"专项数据。**

### 4.2 竞析推断（**无源支撑，一律标为推断**）

| # | 推断 | 依据链 | 我为什么只能推断 |
|---|---|---|---|
| **I1** | **中文「太…了（所以）…」的直译会导致 `so...that` 泛化**：学习者把「太热了，睡不着」直接写成 `*It is so hot that I can't sleep.`，**即使语境只需 `too...to`**。 | 中文「太…了」同时映射到 `so...that` 与 `too...to`，两个英文结构在中文里共用同一个"太"字钩子 | **我没找到任何源明说这条。** 我检索了 `too...to` vs `so...that` 的中文对比文（今日头条那篇标题直指"用法、区别与转换"，但**正文抓回为空**，见 §8 项 4）。**推断成立，但无源。** |
| **I2** | **`so that`（目的）与 `so...that`（结果）的混淆，在中国学习者身上表现为"该用结果时用了目的"**（即把 `The bag is heavy so that I can't carry it` 说成对的）。 | 中文「以致于」和「为了」在口语里都可说成"所以"，边界模糊；且我方 L186 刚教完 `so that` = 為了 | **无源明说。** english.cool 只声明"要分辨"，**没有给中文母语者的具体错句**。**推断。** |
| **I3** | **`such a` 的「a 位置」错误（`*a such big house`）在中文母语者中比在前述 Cambridge 语料中更集中**，因为中文没有冠词，`a` 的位置对中文母语者是纯形式记忆。 | 中文无冠词系统；`a such` 是 english.cool 单独点名的一条 | **无源明说"中文母语者更集中"。** english.cool 只说了"不可以这样写"。**推断。** |
| **I4** | **`so much/many` 的例外（`so` 而非 `such`）是中文侧被系统性跳过的点**：letmeenglish 列了这两个格式，但没解释"为什么这里用 so"；Cambridge 专门立了一页。 | letmeenglish 五格式里两个是 `so much/so many`，但只有例句无判据；Cambridge 有独立页 | **这是我的判读，非源明说。** **推断。** |

> **诚实汇总**：**§4 共 6 条明说 + 4 条推断。其中明说里，M1-M4 是中文侧自认痛点（有 URL），M5-M6 是 Cambridge 的学习者错例（未标注中文母语者）。4 条推断全部无源明说。**
> **与上批的对照**：上批 §4 的 5 条推断中 2 条有源支撑。**本批更差**——**10 条里 4 条纯推断，且核心的那条（I1「太…以致于」泛化）恰恰是我在这次判断里最想要的一条，而它完全无源。** 这本身是"不做"的辅助信号（见 §5.4）。

---

## ⑤ 独立可做性判断（含「拒绝」）

### 5.1 结论先行：**建议不做。** 若主理人坚持要做，**只能 1 课，且必须先改 L186**。

### 5.2 三条独立理由

**理由 1（位次）：跨源一致把它放在 B1 的"一课吃三形态 + 结果分句"位，我方要做就得一次吃下四件事。**
- BC 是 **B1-B2 档一课**（`Intensifiers: 'so' and 'such'`），一节课里同时是 `so` + 形容词/副词、`such` + 名词、`so much/many` 例外、`that` 结果分句。
- Cambridge 拆成 5 页，但**分类边界是 `Easily confused words` ＋ `Determiners`，不是难度分级**。
- letmeenglish 的 5 格式全部带 `(that…)`。
- **→ 我方如果要"忠于跨源位次"，这一课要装：`so` + 词、`such a` + 名词、`such` + 不可数/复数、`so much/many` 例外、`that` 分句、`that` 可省。这是 6 个新单元，不是 1 个。** 我方最近几课（L191 `into`、L192 `through/across`）都是**1-2 个点**的粒度。**粒度不匹配。**

**理由 2（冲突）：与 L186 是"同页邻居"，新课必然要求回头改 L186。**
- Cambridge 把 `so ... that` 与 `so that` 放在**同一页 `So` 的两个小节**（`So and that-clauses`）。
- Cambridge `so-that-or-in-order-that` 页**自己承认 `so that` 也可以表"结果"**（`The birds return every year around March, so that April is a good time to see them.`），且 **"that is often dropped"**。
- english.cool **专门写了一篇 `so-that-such-that`** 来拆这个对，逐字区分"so 講「所以」、so that 講「為了」"。
- **我方 L186 的 `oneLineRule` 逐字是**：「说「是为了让谁做什么」用 so that——…它和第 173 课那个 in order to 分工很清楚」——**这句话把 `so that` 钉死在"目的"上。** L186 的 `contrast` 有 **6 条**对照（3 条 `wrongMark` 型：`in order to you can rest` / `so that can rest` / `so that you can resting`；3 条 `bothRight` 型：`in order to catch the bus` / `I was hungry, so I ate noodles` / `It was cold, so I stayed at home`），**一条都没预告 `so ... that`**——**它与 `so that` 的关系是"最容易被混"，而 L186 恰好把这个位置留空了。**
- **→ 新课的成本不是"加一课"，而是"加一课 + 改一课（L186 的 oneLineRule 和至少 2 条 contrast）"。** 这在我方历史上属于**改动已交付课程**，风险高于新增。

**理由 3（边际收益）：它不治任何中国学习者的高频错，我方错题库里也没有它。**
- **我方 201 案 748 个植错点的 tag 分布**（实测）：`verb_form` 152 / `plural` 128 / `sv_agreement` 128 / `word_order` 91 / `tense` 77 / `preposition` 67 / `article` 33 / `fragment` 27 / `missing_be` 26 / `run_on` 19 —— **没有任何一个 tag 是"so/such 选错"**。若为它新增一罪（如 `intensifier`），**它会成为全库最小的 tag**（0 现有案）。
- **Cambridge `Such or so?` 的 6 条错误全是"二选一选错"**，**没有一条是"结构搭不出来"**。也就是说这个知识点的失败模式**是可以靠"讲清楚一个判据"解决的**，而我方当前最稀缺的资源是**"带标记错 + 回流题余量"**（roadmap-38 §5 携带项 2 明确把"重放题余量"列为"当前最硬的瓶颈"）。
- **→ 把它塞进来，会消耗我方最紧的资源（错句库存 + 一课的名额），换来一个"不治任何高频错"的单元。**

### 5.3 如果主理人否决我的建议，最低成本的"做"法（备选，非推荐）

**1 课，且先改 L186**：`L193 · 太…了以致于 · so + 词 + that`（只做 `so...that`，**不做 `such a`**）。
- **理由**：`so...that` 是我方 L66 `too...to`（太重了拿不动）与 L71 `enough to`（够轻拿得动）的**同族第三格**——**这条线我方已经有了**（L66/L71 都是"够不够/太不太"），`so...that` 是"程度到某个结果"。**从这条线切入，成本最低、复用最强。**
- **`such a` 单独拒绝**：它属名词块，与我方 L66/L71 的形容词线**不同族**；且 Cambridge 把它归在 `Determiners`，**跟我方 L33 `article` 更近**。**要做也该挂到冠词线，不是程度线。**
- **必须同时**：改 L186 `oneLineRule`，把「so that = 為了」扩成「so that = 為了（后面跟"谁 + 能做什么"）；so + 词 + that = 太…了以致于（后面跟发生的结果）」。

### 5.4 该拒绝的候选（本批）

| 候选 | 判定 | 独立理由 |
|---|---|---|
| **`such a`** | **明确拒绝** | 跨源归 `Determiners`/`Easily confused words`，**与程度线不同族**；我方全库 `such` = **0**，做它等于**从零开一条"名词块程度"新线**，成本远高于收益 |
| **`so ... that`** | **建议拒绝；若做则 1 课 + 先改 L186** | 位次 B1、粒度不匹配（6 个新单元）、与 L186 同页邻居、**不治任何高频错**（我方 748 植错点里 0 命中） |
| **`so much / so many` 例外** | **拒绝** | 我方 L30 已教 `some/any/much/many`（`数量词 · some / any / much / many`），L166 已教 `too many / too much`。**再教 `so much/so many` 是第三次碰同一批词**，边际收益趋零 |
| **`such that`（使得）** | **拒绝** | 跨源全部标 **(formal)**（OALD 逐字 `such is something that… (formal)`）；**与零基础定位直接冲突** |

### 5.5 一致性声明（防止"用难度当借口"）

**我拒绝的理由里，没有一条是"太难"或"中文负迁移太复杂"。** 三条理由分别是**位次粒度**、**改动已交付课程的成本**、**治不了我方的稀缺瓶颈**。**如果主理人给出一课的名额并且愿意改 L186，我第 5.3 节的备选方案是可以做的——我拒绝的是"现在、以这个粒度、顺带做"，不是"这个知识点永远不该教"。**

---

## ⑥ `pickCorrectionWord` 独立复核（数字 + 最小修法）

### 6.1 复核对象（逐字引源码）

`/Users/liujun/Documents/英语听写/src/services/huntService.ts` 第 44-62 行：

```ts
/** 挑选收进错词本的词时要跳过的功能词。 */
const NON_CONTENT_WORDS = new Set(["a", "an", "the", "is", "are", "to"]);

/**
 * 从改正结果里挑一个值得收进错词本的词（如 "moved"；短语取第一个实词）。
 * 兜底规则：纯冠词（a / an / the）与「去掉 xx」这类删词型修正返回空串，调用方应跳过，避免垃圾数据。
 */
export const pickCorrectionWord = (correction: string): string => {
  const trimmed = correction.trim();
  if (!trimmed || trimmed.startsWith("去掉")) return "";

  const words = trimmed.split(/\s+/).filter(Boolean);
  const meaningful = words.find((word) => !NON_CONTENT_WORDS.has(word));
  return meaningful ?? "";
};
```

**消费点两处**（`/Users/liujun/Documents/英语听写/src/pages/GrammarHuntPage.tsx`）：
- 第 319 行 `addableCorrectionWords`：**决定按钮上显示的数字**（第 778 行 `` `把 ${addableCorrectionWords.length} 个改正词加入错词本` ``）
- 第 328 行 `addCorrectionsToMistakeBook`：**决定真正写进错词本的词**（第 343-357 行循环 `addOrUpdateWordWithResult`）

### 6.2 复核结果：**115 成立**

**方法**：node 读 `src/data/huntCases.ts`（md5 `c3052472f6465d14aedc94c07bc78a70`），**逐字复刻**上述函数实现，对全部 748 个 `correction` 字段求值，再用 `/^[A-Za-z][A-Za-z'’-]*$/` 判"是否纯英文单词"。

| 指标 | 数值 |
|---|---|
| `correction` 字段总数 | **748** |
| `pickCorrectionWord` 返回非空 | **640** |
| **其中「非纯英文单词」** | **115** ← **复核成立** |
| 垃圾词去重后种数 | **63** |
| 构成 · 尾部标点型 | **102**（`first.` / `books.` / `reading,` / `day!` / `window.` …） |
| 构成 · 中文括号/全角型 | **13**（`（去掉 to）` / `（与 don't 对调）` / `（So 与 do I 对调）` …） |
| **受影响案件数** | **86 / 201** |
| 每案垃圾词数分布 | 1 个：65 案 ｜ 2 个：14 案 ｜ 3 个：6 案 ｜ 4 个：1 案 |
| **按钮 N 被高估的槽位总量** | **115**（**全部落在被课程引用的 196 案；5 个番外案 0 处**——番外案是第 16-20 案，位于前 50 案，恰好落在"写法干净"的区间） |
| 断言口径 mismatch（可见 §6.5） | **86**（`h3-hunt-hint-retry.test.tsx` 上限 **120**，**余量 34**） |

**13 条中文括号型全文定位**（这 13 条是**必须整条跳过**的）：

| 行号 | `correction` 原文 | 当前 `pick` 结果 |
|---|---|---|
| L9469 / L9507 / L9594 / L9611 / L9764 / L9891 / L10157 / L10457 | `（去掉 to）` / `（去掉 don't）` / `（去掉 will）` 等 | **`（去掉`** |
| L9476 | `（与 don't 对调）` | **`（与`** |
| L9548 | `（去掉句尾的 both）` | **`（去掉句尾的`** |
| L9717 | `（So 与 do I 对调）` | **`（So`** |
| L9771 | `（rather 跟在 would 后）` | **`（rather`** |
| L9817 | `（drink → drinking 或去掉）` | **`（drink`** |

> **注**：13 条里 **8 条的 `pick` 结果恰好是 `（去掉`** 这同一个串——所以**去重后 63 种**给了一个错觉，实际入库时会反复写同一个垃圾 key（去重后以 `（` 开头的只有 **6 种**）。
>
> **垃圾词的分布极不均匀（实测）**：案 1-50 = **0** 处、案 51-100 = **7** 处、案 101-150 = **62** 处、案 151-200 = **45** 处——**后 100 案贡献了 108/115（94%）**。这说明该缺陷是**写作习惯漂移**：早期案件的 `correction` 写法干净（`original: "bag."` / `correction: "bags."` 是少数），**后期批量生产时把"原句标点"一起抄进了 `correction`**。

### 6.3 独立判断：**要不要剥标点？——要。括号式该不该整体跳过？——该，而且必须在剥标点之前判。**

**（a）剥标点是对的**（102 处全是"改正词 + 顺带带出来的标点"）：

| 原文 | 剥后 | 判读 |
|---|---|---|
| `original="bag." correction="bags."` | `bags` | 真改正词，**剥标点是正确的** |
| `original="ring." correction="rang."` | `rang` | 真改正词 |
| `original="read." correction="reading."` | `reading` | 真改正词 |
| `original="window." correction="the window."` | `the window` → `window` | 名词块，取实词（与现有 `is happy`→`happy` 一致） |

**（b）但括号式必须在剥标点之前判——这是我独立发现的一个新问题，比题目描述的更严重：**

若**只剥标点不判中文**，会引入 **3 个"语法上干净、语义上完全错"的假改正词**：

| `correction` 原文 | 只剥标点的结果 | 为什么危险 |
|---|---|---|
| `（So 与 do I 对调）` | **`So`** | 这是一条**语序说明**，`So` 不是改正词。它会以一个"漂亮的英文单词"身份进入错词本 |
| `（rather 跟在 would 后）` | **`rather`** | 同上 |
| `（drink → drinking 或去掉）` | **`drink`** | **最坏的一条**：`drink` 是原形，而真正的改正是 `drinking`——**错词本会教错** |

> **这三条是本批最值得记录的一点**：题目把"括号式"和"带标点词"并列为垃圾词，**但它们修法不同、且顺序不能颠倒**。只剥标点，`（去掉 to）` 会被剥成空串（正确），但 `（So 与 do I 对调）` 会被剥成 `So`（**错误且隐蔽**）——**垃圾从"一眼可见的乱码"升级成"看起来对的错词"，比不修更坏。**

**（c）最小修法（两处改动）**

```
// huntService.ts — 替换 pickCorrectionWord 的函数体（保持签名与导出名不变）

const CJK = /[\u4e00-\u9fff]/;              // 新增：中文说明守卫
const EDGE = /^[^A-Za-z]+|[^A-Za-z'’-]+$/g; // 新增：首尾非字母

export const pickCorrectionWord = (correction: string): string => {
  const trimmed = correction.trim();
  if (!trimmed || trimmed.startsWith("去掉") || CJK.test(trimmed)) return "";  // ← 改动 1

  const words = trimmed.split(/\s+/).filter(Boolean);
  const meaningful = words.find((word) => !NON_CONTENT_WORDS.has(word));
  if (!meaningful) return "";

  return meaningful.replace(EDGE, "");                                          // ← 改动 2
};
```

**实测效果**（同一份 md5 数据上模拟）：

| 指标 | 修前 | 修后 |
|---|---|---|
| 入库词数 | 640 | **627** |
| **垃圾词（非纯英文）** | **115** | **0** |
| 被跳过 | 108 | 121（+13 = 恰好是中文括号型） |
| **现有 525 个正确词取值被改动** | — | **0 处**（零回归） |
| 跳过项构成 | — | `去掉`型 64 ＋ 中文括号型 13 ＋ 纯功能词型 44 ＋ **其他 0** |

> **`其他 0` 是关键**：修完之后，**没有任何一个被跳过的条目是我没能归类的**——说明这两条规则已经把 748 个 `correction` 的边界覆盖完整。

**（d）配套测试改动（我建议但不实施）**

`src/services/huntService.test.ts:130-139` 的用例**可以直接扩两行，不会破**：
```
expect(pickCorrectionWord("bags.")).toBe("bags");        // 新增
expect(pickCorrectionWord("（去掉 to）")).toBe("");       // 新增：改前会是 "（去掉"
```

`src/edge/h3-hunt-hint-retry.test.tsx:224` 的断言**在新行为下会从 mismatch=86 变成 mismatch=94**（新增 8 案：`hunt-why-dont-you-rest` / `hunt-id-like-tea` / `hunt-both-and-sing` / `hunt-neither-nor-food` / `hunt-unless-rain` / `hunt-so-do-i` / `hunt-would-rather-walk` / `hunt-shall-we-quiet`）——**仍在上限 120 内，余量 26，不破。** 该断言的语义是"防规模恶化"，**新行为是让它更诚实，方向上正确。**

### 6.4 遗留问题（本修法不解决，建议单独排期）

修完后仍有 **60 处「入库词 == 原词」**（去掉只是补了功能词/改了标点，**没有词形可学**）：

| tag | 处数 | 例子 |
|---|---|---|
| `missing_be` | 13 | `original="happy"` → `correction="is happy"` → 入库 `happy` |
| `article` | 11 | `original="cake"` → `correction="a cake"` → 入库 `cake` |
| `word_order` | 11 | `original="may"` → `correction="May"` → 入库 `May`（**只有大小写差异**） |
| `run_on` | 8 | `original="sunny"` → `correction="sunny,"` → 入库 `sunny`（**只有标点差异**） |
| `preposition` | 7 | `original="at"` → `correction="is at"` → 入库 `at` |
| `verb_form` | 5 | — |
| `fragment` | 5 | `original="test"` → `correction="test."` → 入库 `test` |

> **这不是垃圾字符，是"语义空卡"**：错词本会收到一个学员已经会的词（甚至是原词本身）。**属另一个问题域**（`correction` 与 `original` 的语义关系校验），**我建议单独排期，不要塞进这次修复。** 若要一刀切，判据是「剥标点后 `pick` 结果 `.toLowerCase() === original 剥标点后 .toLowerCase()` → 跳过」，但**那会一次跳掉 60 项（入库从 627 掉到 567，-60），impact 大于本次修复，须单独决策。**

### 6.5 一处口径提醒（我发现的历史数字不一致）

`roadmap-grammar-thirty-eighth-batch-2026-09-21.md` §5 携带项 13 记录的是 **"错词本会吸进「（去掉」这类垃圾（实测 35 处）"**。**我用尽 20 余种口径都没能复现 35**（候选值：13 / 49 / 63 / 64 / 77 / 86 / 102 / 115）。**最接近的三种解释**：
- **13** = 中文括号型（`pick` 结果以 `（` 开头）；
- **63** = 115 去重后的种数；
- **35** 可能来自**上一批数据版本**（该文件 2026-09-21 20:38 有未提交改动，`git diff HEAD` 显示 +3873 行）。

> **我无法判定 35 的口径，也不主张它是错的**——只记录：**在 md5 `c3052472…` 这份数据上，正确数字是 115（计次）/ 63（去重）。** 建议主理人以 **115** 为准，并在携带项里注明口径（"计次"还是"去重"）。

---

## ⑦ 自我核查记录（命令 + 输出）

### 7.1 我方数据实扫（`so`/`such` 的库内位次）

```bash
$ node /tmp/scan3.cjs
targetSentence 条数 = 192
dialogueEn 条数 = 192
grammarLabel 条数 = 192

=== 只在 targetSentence + dialogueEn 语料里 ===
[such] 句子数 = 0
[such a/an] 句子数 = 0
[so that] 句子数 = 2
      I came early so that you can rest.
      I came early so that you can rest.
[so ... that (同句)] 句子数 = 2
      I came early so that you can rest.
[enough to] 句子数 = 2
      The bag is light enough to carry.
[too ... to] 句子数 = 2
      It is too heavy to carry.
[so + 形容词] 句子数 = 2
      Why are you so late?
      You are so good at drawing!

=== 整文件 raw 出现次数（仅参照，含中文讲解/注释） ===
[such] raw = 0
```

> **说明**：首轮我用 `so[^."'\n]{1,90}?that` 得到 62 命中，**复核发现是正则跨行匹配到了 `so that` 与 id 字符串**（如 `lesson-186-so-that`）。**改为只在 `targetSentence`/`dialogueEn` 两个字段的语料上扫描后，正确值 = 0（`such`）/ 2（`so that`，即 L186 那一句 targetSentence 与 dialogueEn 是同一句）。**

### 7.2 `pickCorrectionWord` 复核（3 次复算同值）

```bash
$ for i in 1 2 3; do node /tmp/canonical.cjs | grep ">>>"; done
>>> 垃圾词计次 = 115
>>> 垃圾词去重 = 63
>>> （去掉 计次 = 8
>>> 含 CJK 的计次 = 13
>>> 纯尾标点型计次 = 102
>>> 垃圾词计次 = 115
... (第 2、3 次完全一致)
$ md5 -q src/data/huntCases.ts
c3052472f6465d14aedc94c07bc78a70
```

### 7.3 一处自查过的假警报（记录以免误导）

首轮复算时我得到 **123** 而非 115，**一度怀疑文件被并发修改**（该文件确有未提交改动）。**追查后确认是我自己的正则差异**：

```bash
$ node -e '...P_OK 含 ASCII 撇号 / P_NO 不含...'
含撇号口径 junk = 115
不含撇号口径 junk = 123   差值 = 8
差集 = ["doesn't","don't","Grandma's","I'd","hasn't"]
```

> **结论：115 正确；123 是我把 `doesn't` / `don't` / `Grandma's` / `I'd` / `hasn't` 这 5 个带撇号的合法词误判为垃圾导致的。** **这 5 个词应当入库**（它们是真实改正词），**修法的 `EDGE` 正则已含 `'` 与 `’`，不会误伤。**

### 7.4 修法零回归验证

```bash
$ node /tmp/fix_final.cjs
=== 最小修法（建议）===
植错点总数                 = 748
现状 pick 非空             = 640
现状 垃圾词（非纯英文）    = 115
---
修后 入库词数              = 627
修后 垃圾词                = 0
修后 被跳过                = 121
修后 现有纯英文取值被改动  = 0

=== 跳过项的构成 ===
{"去掉型":64,"中文括号型":13,"纯功能词型":44,"其他":0}
```

### 7.5 罪名分布与案件数实扫

```bash
$ node -e '...统计 huntCases 的 tag 字段...'
罪名分布: {"tense":77,"plural":128,"sv_agreement":128,"article":33,"missing_be":26,
           "preposition":67,"run_on":19,"verb_form":152,"word_order":91,"fragment":27}
案件数: 201
# → 无任何 tag 对应 "so/such 选错"（§5.2 理由 3 的依据）

$ node -e '...统计课程标签...'
L20  | 连词 · because / so | 因为我起晚了
L66  | 太…了装不下 · too…to | 太重了拿不动
L71  | 够 · enough 站词后 | 够轻拿得动
L173 | 为了 · in order to | 为了赶上早班车
L186 | 是为了 · so that | 早点来是为了让你歇会儿
L191 | 进到里面 · 用 into——不只是一个 in
L192 | 穿过 · 中间穿过去用 through，横过一头到另一头用 across
```

---

## ⑧ 抓不到的源与不确定项

### 8.1 抓不到的源

| # | 源 | 尝试了什么 | 结果 | 影响 |
|---|---|---|---|---|
| **1** | **Murphy《English Grammar in Use》双册原件** | **本批未重复尝试**——本项目历史上已多次确认（上批记录：`find /Users/liujun /tmp /private/tmp -maxdepth 4 -iname "*murphy*"` → 0 命中；`/private/tmp/murphy_int.html` 1303/1304 字节 503 错误页已不存在） | **永久不可得** | **本批"课程位"判定不依赖 Murphy**：改用 **BC B1-B2 全目 36 课** ＋ **Cambridge 5 页实取** ＋ **OALD 2 词 CEFR 徽章** ＋ **中文侧 3 页实取** 四层独立证据。**建议主理人正式记 Murphy 为"永久不可得源"。** |
| **2** | **牛津 Practical English Usage（PUE）** | 官方两处：`elt.oup.com/catalogue/items/global/grammar-reference/practical-english-usage/`（**内容为空**）；`oxfordlearnersdictionaries.com/grammar/online-grammar`（**只给概述，无单元目录**） | **抓不到单元位次** | **替代证据**：OALD 两个词条的 **CEFR 徽章 + 格式框**（`so… (that)…` / `such a/an…`）。**本批的"位次"判定不依赖 PUE。** |
| **3** | **British Council 域名 curl** | **本批未用 curl**（按任务书已知情况处理） | — | 按历史记录 **`HTTP=000`**，但**目录页与课程页经 WebFetch 可读**——**本批全部 BC 证据都走 WebFetch 实取，成功**（A1-A2 18 课、B1-B2 36 课、C1 14 课三档全目 + 专课逐字） |
| **4** | **搜狐/今日头条/知乎专栏（中文侧）** | 今日头条 `toutiao.com/article/7528023679821808143/`（标题直指 `too…to…` 与 `so…that…` 的用法/区别/转换）→ **正文抓回只有横线**；知乎 `zhuanlan.zhihu.com/p/66745706`（so/such 12 要点）、`p/556284546`、`p/656728098`、`p/695686642` → **全部 HTTP 403**；`hjenglish.com` 系 → 无相关内容；`baidu.com/s?wd=…` → 内容为空 | **抓不到正文** | **中文侧只保住 3 页正文**（letmeenglish `so-such` / english.cool `so-that-such-that` / english.cool `such`）＋ **1 条检索摘要**（知乎 p/66745706 的"such 和 so…很容易混淆"）。**§4 的 M1 因此只有 letmeenglish 一头是正文实取。** |
| **5** | **learn-en.org `such` 页的"常见错误"节** | WebFetch 页面正文 | **标题承诺"常见错误及例句解析"与"避免中国学习者…"，但正文实测无错误节**（与 letmeenglish 的"核心教学块正文只有 PNG"同类问题） | **该源不能作为 M 类证据**；**这是中文侧"标题承诺 > 正文交付"的第二个样本**（上批是 letmeenglish 移动介词页）。 |
| **6** | **Cambridge Learner Corpus 的"中文母语者"子库** | 尝试 `dictionary.cambridge.org/grammar/british-grammar/common-mistakes-in-english`（**该页只是目录索引**，无具体错误正文；页面说明语料来自 "a large collection of examples of English writing from learners of English all over the world"，**未按母语分组**） | **拿不到按母语分组的错误数据** | **§4 的 M5 无法声称"这是中文母语者的错"**——已在 §4.1 加括注明示。**若主理人要求硬证据，需要采购 Cambridge Learner Corpus 或 CLC 的专项报告，不在本次可及范围内。** |
| **7** | **`so...that` 与 `too...to` 的中文对比源（用于 I1）** | 定向检索 → 今日头条 1 篇（标题命中、正文空）；百度文库 1 篇（`too...to` 句型详解，**非对比文**）；知乎 1 篇（403） | **抓不到正文** | **§4 的 I1（最有价值的那条推断）完全没有源支撑。** 已在 §4.2 逐条声明。 |
| **8** | **多邻国/扇贝/百词斩/流利说/句乐部 的语法点或纠错功能** | 3 轮定向检索（`扇贝+百词斩+语法+纠错+错句`、`多邻国+语法点`、`句乐部`） | **只取到官网首页、商店页；均无语法点或纠错功能的可引用描述**。句乐部逐字只有 **"自动算好每个知识点的最佳复习时间"** 与 **"直接问 AI 英语老师"**，**无 `错句` 功能** | **§3 的 #8 行明确写"未取到专项证据"，不冒充结论**（与上批同一纪律） |
| **9** | **人教版教材单元位次**（`so...that` 在哪册哪单元） | Bing CN 定向检索 2 轮（`人教版+高中英语+so that+语法+单元+必修`、`中考+考点+so...that`） → **全部返回人教社官网首页/百度百科/地图** | **抓不到** | **中国教材位次这一列本报告没有填。** 这是 §9 不确定项之一。 |

### 8.2 不确定项（明确标注）

| # | 不确定项 | 我的把握 | 需要谁来定 |
|---|---|---|---|
| **1** | **`so...that` / `such a` 在中国学习者的真实错误率排序。** 我**没有**任何按母语分组的语料数据（§8 项 6），**§5.2 理由 3 的"不治高频错"依据的是"我方错题库 0 命中"，不是"中国学习者里不高频"。** | **低** | 若主理人认为"我方错题库的构成本身是我的产品决策导致的，不能反证学习者需求"，**这条理由需要撤回**——**但理由 1、2 不受影响，结论仍是不做。** |
| **2** | **中国教材是否已经把 `so...that` 教过了。** 民办/公办教材位次我**完全没取到**（§8 项 9）。**如果人教版在初中就教了 `so...that`，那"位次太靠后"这条理由的强度会下降**（因为它会变成"复习"而非"新学"）。 | **低** | 需要教材位次数据 |
| **3** | **35 这个历史数字的口径。** 我用 20+ 种口径都没复现（§6.5）。**我记录的是 115/63，并认为 35 可能来自上一版数据。** | **中** | 主理人裁定以哪个为准 |
| **4** | **`（与 don't 对调）` 这类"位置调换型"修正，跳过是否会让学员觉得"这个改正没法收藏"。** 我的修法把这 13 条全部静默跳过——**UI 上按钮数字会相应减少，但学员看不到"为什么这几处不能加"**。 | **中** | 是否需要在这 13 处补一个"这是位置说明，不进错词本"的轻提示（**属产品决策，不在本批范围**） |
| **5** | **`so much / so many` 与我方 L30/L166 的重叠程度。** 我判"拒绝"依据的是**课名层面**的重复（L30 `some/any/much/many`、L166 `too many/too much`），**没有逐条比对三课的实际例句**。 | **中** | 若要严格，须做 L30/L166 与 `so much/many` 的例句级去重分析 |
| **6** | **L186 改动的最小面。** 我判断"必须改 L186 的 `oneLineRule` + 至少 2 条 contrast"——**这个"至少 2 条"是我的估算，没有逐条验证 L186 全部 contrast 在新语义下的连带影响。** | **中** | 若主理人采纳 §5.3 备选方案，须先做一次 L186 的全字段影响面走查 |

---

## ⑨ 交付清单

- **交付文件**：`deliverables/product-strategy/competitive-analysis-so-that-such-2026-09-21.md`（本文件）
- **给主理人的三条可执行结论**：
  1. **`so ... that` / `such a`：建议拒绝**（理由：位次粒度不匹配 6 单元 / 须回头改已交付的 L186 / 不治我方稀缺瓶颈）。**若坚持要做：1 课、只做 `so...that`、挂 L66-L71 的程度线、且先改 L186。**
  2. **`pickCorrectionWord`：数字 115 复核成立**（计次；去重 63），**86/201 案受影响，按钮 N 被高估 115 槽位**。最小修法两行（**先判 CJK 再剥标点**，顺序不可颠倒——否则会引入 3 个假改正词 `So`/`rather`/`drink`），**实测垃圾 0、零回归**。
  3. **一处遗留**：修后仍有 **60 处「入库词 == 原词」**（语义空卡，非垃圾字符），**建议单独排期**，不要塞进本次修复。
