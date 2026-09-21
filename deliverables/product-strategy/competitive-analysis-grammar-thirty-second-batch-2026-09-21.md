# 竞品分析：第三十二批选题（生产级复核 + 逐课规格）· 竞析报告

| 字段 | 值 |
|---|---|
| 报告 | 竞品/跨源分析（竞析）· 语法线「小美的一天」第三十二批 |
| 日期 | **2026-09-21** |
| 本轮任务 | **对批三十一普查清单的前 2 项做生产级复核**（`be able to` / `whole` 一线）· 8 项候选逐项复核表 · **`had better` 专项**（含与 L76 `much better` 撞车评估）· **`whole` 专项**（2 条 `all` 做不到的硬规则）· 「同义换词 vs 新结构」甄别 · 逐课规格跨源支撑 |
| 上游输入 | `b-tier-frontier-survey-2026-09-20.md`（批三十一普查综合）· `competitive-analysis-b-tier-survey-semi-modal-2026-09-20.md`（516 行）· `competitive-analysis-b-tier-survey-phrasal-2026-09-20.md`（549 行） |
| 我方快照（本轮独立复算） | `src/data/grammarLessons.ts`＝**169 课**（末课 `number: 169`，`lesson-169-id-like`）· `src/data/huntCases.ts`＝**178 案** · `src/data/grammarSeasons.ts`＝**33 季**（末季 `season-33`，`min: 166, max: 169`） |
| ⚠️ 快照口径说明 | 任务书给的「162 课／171 案／31 季」**低于本机实测值**——本轮实测三文件在 **2026-09-21 00:52–01:09** 之间被并发写入（L163–L169 为新增），**本报告全部数字以 01:09 快照为准**（§7 项 1） |
| 跨源取到 | **Cambridge 语法页 22 页直连（全部核对 `<title>`）**（含本轮实取 `Had better`／`Whole`／`All or whole?`／`So that or in order that?`／`As long as and so long as`／`As if and as though`／`Be expressions (be able to, be due to)`／`Contractions`／`Modality: other modal words and expressions`／`Even`／`If`／`All`／`Some`／`Much, many, a lot of…`／`Quantifiers`／`Determiners`／`Easily confused words` 索引）· **Cambridge 词典 10 条（title 双核 + CEFR badge 实读）** · **Oxford 3 条** · **BC 12 页**（A1-A2 18 课全目 ＋ B1-B2 36 课全目 ＋ 参考层 5 页）· **中文侧 12 页 200／约 25 页 404** |
| ⚠️ 方法学坑（本轮再次触发，全部已规避） | ① **Cambridge 200 ＋ 邻近页**：`/grammar/british-grammar/better` → **200 但 title 是 `Had better`**（md5 与 `had-better` 页**完全相同**）；`/several` → **302 回语法总入口**；`/comparatives` → **200 但 title 是 `Even`**；`/had-better-or-would-rather` → 200 但 title 是 `Had better`。**→ 每一条都核过 `<title>`。** ② **BC 直连 403**（本机 `curl` 全 000／403），**BC 层全部经 WebFetch**。 ③ 中文侧 `letmeenglish/*` 需 **301 跟随**（`/had-better/` → `/had-better-it-is-time/`）。 |
| 口径 | Cambridge 语法页**只取 `<article class="di">` 正文，剔除全站侧栏导航**（沿用批三十／三十一口径）；**词频一律用词边界**（批三十一 §4.3 纪律） |

---

## §0 本轮结论速览（7 条）

1. **8 项复核后：7 项维持、1 项下调。** `whole` 维持 B（**两条硬规则本轮逐字复取，成立且比批三十一记的更完整**）；`several` 维持 B；`had better` 维持 B（**但撞车评估结论见 §3，比我方担心的更严重也更可利用**）；`so that` 维持 B；`as long as` 维持 B；`even if` 维持 B；`as if` 维持 B（缓排）。**唯一修正：`be able to` 从 B＋ 下调至 `B`**（理由：本轮实取 BC A1-A2 全目 18 课 **0 命中 `able to`**，BC 参考层 `Ability` 正文**也 0**——**「课程位」只剩 B1-B2 一门共表课，且它不是专课**，§1.1）。

2. **⚠️ 本轮最重要的结构性发现：`be able to` 的「课程位」本轮被证伪。** 批三十一据 BC `Past ability` 判它有「真课程位」；**本轮逐字复核该页 h1／小节**：h1 是 `Past ability`（**不是 `Be able to`**），小节逐字 `General ability`／`Ability on one occasion – successful`／`Ability on one occasion – unsuccessful`，正文逐字 "**When we talk about achieving something on a specific occasion in the past, we use was/were able to (= had the ability to) and managed to**"——**BC 自己把 `be able to` 与 `managed to` 并列**，且**全课主线是 `could` 的分工**。**⇒ 这不是 `be able to` 的课程位，是 `could` 的课程位。** 加上 BC A1-A2 **18 课 0 命中** ＋ BC 参考层 `Ability` 正文 **0 命中**，**「跨级」问题不再成立——它根本没有课程位**。

3. **`had better` 与 L76 `much better` 不撞车——而且跨源给了我们一条现成的分界线。** 本轮逐字复取 Cambridge `Had better` 页正文：**`better` 共 39 处，逐条归类后只有三串**——`had better`（含 `'d better`／`had we better`／`hadn't you better`）、`be better`（h2 `Had better or be better, be best?`）、`better to be safe than sorry`（谚语例）；**`comparative` 0 次、`comparison` 0 次、`much better` 0 次**。**Cambridge 的 `Easily confused words` 索引里没有 `Better?` 条目**（B 段逐字只有 `Been or gone?／Begin or start?／Beside or besides?／Between or among?／Born or borne?／Bring, take and fetch／Can, could or may`）——**上游不把二者当易混点**。但 Cambridge `Had better` 页**自己给了一条与形容词 `better` 的分工规则**（h2 `Had better or be better, be best?`），**这条正是我方 L76 需要的安全边界**（§3）。

4. **`had better` 与 L47 `should` 是「半新结构」，不是同义换词**——判定依据是**跨源三条明文**：① Cambridge 逐字 "**The question form of had better … means the same as should, but is more formal**"（**上游自己承认疑问形 = should**）；② 但同一页有 **4 条 `Not:`**（`I'd better to go` ✗ 等）；③ **BC 三档 68 课 0 命中 `had better`**、**BC `Suggestions and obligations` 正文逐字只有 `should`／`must`／`need to`**（WebFetch 明证 "The phrase 'had better' does not appear in the page body"）。**⇒ 上游把 `should` 当课、把 `had better` 当规则页 ⇒ 它与 L47 是「同一语义轴的更硬一档」，不是换词**（§3③）。

5. **`whole` 的两条 `all` 做不到的硬规则，本轮逐字复取成功，且实际是四条 `Not:`。** ① "**We use a/an with whole but not with all:**" ❌`all a day`；② "**We use all the and not the whole with uncountable nouns:**" ❌`the whole advice`；③ **本轮新取到**："**We don't use all before a and an:**" ❌`She ate all a bar …`；④ **本轮新取到**："**We can't omit the before whole with a singular noun:**" ❌`throughout whole country`。**⇒ ③④ 是批三十一没记的两条，`whole` 的硬规则从 2 条升到 4 条**（§4）。

6. **`whole` 与 L151 `all` 的切分成立，且切分线比批三十一写的更干净。** 本轮实取 L151 的 6 条 contrast：**没有任何一条是 `whole` 的对比句**（3 条双正解：`Both books`／`All my books`／`I ate two sandwiches`；3 条改错：`All student`／`All of books`／`All the books is`）。**⇒ L151 的 6 个槽位里有一个空位正好是 `whole`**（§4.3）。

7. **本批 Top 2 = `whole`（1 课）＋ `had better`（1 课）。** 理由：**两者都是「规则页厚 ＋ 本批唯一有明文 `Not:` 增量」**，且**都不与我方已教内容同义**（§2）。**`be able to` 本批不排**——课程位被证伪 ＋ `able` 真零 ＋ BC 参考层不收（§2.3）。

---

## §1 八项候选复核表

**判档口径（沿用批三十一，不变）**：
- **A 档**：跨源有**课程位**（教材有独立单元／课时）＋ 我方有缺口
- **B 档**：跨源**有规则页**但**无课程位**，或我方须造词但成本可控
- **B＋／B−**：B 的上下微调 ｜ **C 档**：只有零散例句 ｜ **D 档**：跨源基本不收

**⚠️ 本节所有 Cambridge 页面均核 `<title>`**；行内「未核」＝未复核，不得作判档主依据。

### 1.1 `be able to`（能够）——**档位：B（⚠️ 修正：从 B＋ 下调）**

| 字段 | 内容 |
|---|---|
| **① 跨源逐字证据** | **⚠️ slug 陷阱复现**：`/grammar/british-grammar/be-expressions-be-able-to-be-due-to` **200**，**title 逐字 `Be expressions ( be able to, be due to ) - Cambridge Grammar`**（**注意不是 `- Grammar - Cambridge Dictionary`，是 `- Cambridge Grammar`，与其他页不同**）；面包屑逐字 `Grammar > Verbs > Using verbs > Be expressions (be able to, be due to)`；**h2 六个** `Be about to`／`Be able to`／`Be due to`／`Be likely to`／`Be meant to`／`Be supposed to`；`Be able to` 节下 **h3 两个** `Abilities`／`Past achievement: could or was/were able to?`。正文逐字："**Be able to is like can. We use it to talk about abilities. We often use it in places where it is not possible to use can. For example, it isn't possible to use can after another modal verb:**"／"**She won't be able to concentrate. Not: She won't can concentrate.**"／"**He should be able to work in a team. Not: He should can work in a team.**"／"**Be able to is a more formal alternative to can:**"／`Past achievement` 节逐字 "**We usually use was/were able to, not could to talk about past achievements in affirmative clauses. This is because they are facts, rather than possibilities:**"／`Only one person was able to beat the record. Not: Only one person could beat the record.`／"**We use couldn't or, more formally, wasn't/weren't able to in negative clauses:**"。**BC `Past ability`（B1／B2，WebFetch 实取）——⚠️ 本轮复核改判**：**h1 逐字 `Past ability`**（**不是 `Be able to`**）；**Language level 逐字 `B1 Intermediate`／`B2 Upper intermediate`**；**小节逐字** `Grammar explanation`／`General ability`／`Ability on one occasion – successful`／`Ability on one occasion – unsuccessful`／`Language level`；正文逐字 "**Do you know how to use could, was able to and managed to to talk about past abilities?**"／"**We usually use could or couldn't to talk about general abilities in the past.**"／"**When we talk about achieving something on a specific occasion in the past, we use was/were able to (= had the ability to) and managed to (= succeeded in doing something difficult).**"／"**Could is not usually correct when we're talking about ability at a specific moment in the past.**"——**⚠️ 全课是 `could` 的主线，`able to` 与 `managed to` 并列出场，`able to` 不是课题。** **BC 参考层 `Ability`（Level: beginner ＋ intermediate，WebFetch 实取）**：小节逐字 `Ability: can and could 1`／`2`／`could have 1`／`2`；**明证 "Does 'able to' appear anywhere in the page body? … only within a quoted learner comment … There is no occurrence of 'able to' in the main article text authored by the British Council."** **Cambridge 词典 `ABLE`**（200，页题逐字 `ABLE \| English meaning - Cambridge Dictionary`）：**badge 实读 `A2`×1 ＋ `C2`×1**，`be able to do something` 义项逐字 "**(A2) to have the necessary physical strength, mental power, skill, time, money, or opportunity to do something**"。**Oxford `able_1`**（200，页题逐字 `able adjective - Definition, pictures, pronunciation and usage notes`）：`cefr="a2"`×1 ＋ `cefr="c1"`×1，`ox3000="y"`。**中文侧 `letmeenglish.com/can-could-be-able-to/` 200 独立专文**（sitemap 实取），页题逐字「**can、could 與 be able to 差在哪？用法解析＋例句與練習**」，独立小节含 `can/could VS be able to`，**逐字**："**be able to 通常和 can 很相似，我們可以用來代替 can 來表示能力；但是 be able to 比較正式且較不常見。**"／"**但 can 只有現在或過去式 can–could，在其它的形式中(不定詞、動名詞、現在完成式……等)應該用be able to。**"／"**但當我們想表達某人在特殊情況下做了某事，必須要用 was/were able to，或 managed to＋原形動詞。**"＋**明文 ❌** `(不能說 could escape)`／`(不能說 could find)`；**`english.cool/be-able-to/` 404／`/able-to/` 404／`/able/` 404**（三式均试）。 |
| **② 课程位** | **⚠️ 本轮修正：❌ 无（批三十一记「✅ 有，B1-B2」——本轮判定该结论不成立）。** 三条逐字依据：**① BC `Past ability` 的 h1 是 `Past ability`，不是 `Be able to`**，且**该课把 `able to` 与 `managed to` 并列**、主线是 `could` 的分工；**② BC A1-A2 索引 18 课全目 0 命中 `able to`**（本轮 WebFetch 实取，逐条核过）；**③ BC B1-B2 索引 36 课全目 0 命中 `able to`**（同上；`Past ability` 是唯一相关课，且它是 `could` 的课）。**BC 参考层 `Ability` 正文 0 命中**（明证见 ①）。**Murphy 中级 U26 `can, could and (be) able to`**（批十九／批二十既有记录，本轮未核，§7 项 3）——**这是唯一潜在的课程位，但它是三词共用一个单元，不是 `able to` 专位。** |
| **③ 规则页** | **⚠️ 有但共页**：Cambridge 六项一页（`Be able to` 是其中一个 h2 ＋ 一个 h3）；**中文侧有 1 篇独立专文（letmeenglish，本轮 sitemap + 直取确认）**——**⚠️ 修正批三十一的「中文侧零」**。 |
| **④ CEFR** | **Cambridge `A2`（`able` 形容词）／Oxford `a2`（＋`c1`）**——**双源一致 A2**，但**语法落点（BC `Past ability`）在 B1-B2**。 |
| **⑤ 档位** | **B（⚠️ 修正：B＋ → B）** |
| **⑥ 判定理由（修正说明）** | **批三十一给 B＋ 的唯一理由是「有课程位（BC 正课），但跨级到 B1-B2」。本轮逐字复核该课，发现它 h1 是 `Past ability`、主线是 `could`、`able to` 与 `managed to` 并列 ⇒「课程位」这条判据不成立。** 降为 B 后仍**不降到 B−**，理由三条：**① 规则页的增量仍在**——h3 `Past achievement: could or was/were able to?` 是**独立小节**，逐字 "**We usually use was/were able to, not could to talk about past achievements in affirmative clauses**"，**这是一条硬规则**；**② 两条 `Not:` 是真格位增量**（`won't can` ✗／`should can` ✗——**这正是我方 L14 `can` 教的「情态动词不叠加」纪律的反向应用**）；**③ 中文侧有独立专文**（修正批三十一的「零」）。**⇒ B（规则页有 ＋ 无课程位 ＋ 须造词），本批不排期**（§2.3）。 |

### 1.2 `whole`（整个）——**档位：B（维持）**

| 字段 | 内容 |
|---|---|
| **① 跨源逐字证据** | **Cambridge `Whole`**（`/grammar/british-grammar/whole`，**200，title 逐字 `Whole - Grammar - Cambridge Dictionary`**；面包屑逐字 `Grammar > Nouns, pronouns and determiners > Determiners > Whole`）：正文**共 4 条规则段 ＋ 1 段 `See also`**（本轮按 `<p>` 逐段核过，`h2`/`h3` 均为 0）逐字——"**Whole is a determiner. We use whole before nouns and after other determiners (my, the, a/an, their) to talk about quantity. We use it to describe the completeness of something:**"（例 `I've wanted to be an actor my whole life.`／`Please can you check the whole document?`／`I thought the whole experience was very interesting.`）／"**We use the whole of when whole is followed by another determiner (my, her, this, the):**"（`She had been in the same job for the whole of her life. (or … for her whole life.)`）／"**We often use the whole of with periods of time to emphasise duration:**"（`At dawn, he would finally fall into bed and stay there the whole of the next day.`）／"**We also use whole as an adverb:**"（`He took the cake and swallowed it whole.`）；**页尾 `See also` 逐字指 `All or whole?`**。**Cambridge `All or whole?`**（`/grammar/british-grammar/all-or-whole`，**200，title 逐字 `All or whole ? - Grammar - Cambridge Dictionary`**；**面包屑逐字 `Grammar > Easily confused words > All or whole?`**）：**h2 四个**逐字 `All or whole for single entities`／`All the with uncountable nouns`／`All and whole with plural nouns`／`All and whole: typical errors`。正文逐字："**All and whole are determiners.**"／"**We use them before nouns and with other determiners to refer to a total number or complete set of things in a group.**"（对比栏逐字 `All the cast had food poisoning.` 注 `all + determiner + noun` ／ `The whole cast had food poisoning.` 注 `determiner + whole + noun`）／"**All my family lives abroad. or My whole family lives abroad.**"／"**We often use all and the whole with of the:**"（`She complains all of the time. or She complains the whole of the time.`）／**核心硬规则一** "**We use a/an with whole but not with all:**"（正 `I spent a whole day looking for that book and eventually found it in a little old bookshop on the edge of town.` ＋ **❌ `Not: … all a day …`**）；**h2 `All or whole for single entities`** 逐字 "**We use the whole or the whole of to refer to complete single things and events that are countable and defined:**"（`The whole performance was disappointing from start to finish.`）／"**When we can split up a thing into parts, we can use either whole or all with the same meaning:**"（`You don't have to pay the whole (of the) bill at once.` ＝ `… all (of) the bill …`；`She ate the whole orange.` ＝ `She ate all of the orange.`）；**硬规则二**（h2 `All the with uncountable nouns`）逐字 "**We use all the and not the whole with uncountable nouns:**"（`She was given all the advice she needed.` ＋ **❌ `Not: She was given the whole advice …`**；`All the equipment is supplied.`）；**硬规则三＋四**（h2 `All and whole: typical errors`）逐字 "**We don't use all before a and an:**"（`She ate a whole bar of chocolate in one go.` ＋ **❌ `Not: She ate all a bar …`**）／"**We can't omit the before whole with a singular noun:**"（`We travelled throughout the whole country.` ＋ **❌ `Not: … throughout whole country.`**）。**BC `Quantifiers` 参考页**：**`whole` 本轮逐词复核 0 命中**（WebFetch 明证 "**'whole': Does not appear anywhere on the page.**"）。**Cambridge 词典 `WHOLE`**（200，title 逐字 `WHOLE \| English meaning - Cambridge Dictionary`）：**badge 实读 `A2`×1／`C2`×1／`B1`×1**，`A2` 首义逐字 "**complete or not divided:**"（`I spent the whole day cleaning.`／`After my exercise class, my whole body ached.`／`The whole town was destroyed by the earthquake.`）。**Oxford `whole_1`**（200，title 逐字 `whole adjective - Definition, pictures, pronunciation and usage notes`）：`cefr="a2"`×1 ＋ `cefr="b2"`×2，`ox3000="y"`；`[only before noun]` 逐字，首义 "**full; complete**"（`Jenna was my best friend in the whole world.`／`It seems I've spent my whole life travelling.`）。**中文侧 `english.cool/quantifiers/`（200，页题逐字「來一次搞懂「數量詞」(Some, Any, Much 等)」）有 `whole` 独立小节**，逐字 "**whole 意思為「整個的、整體的」，表示「事物的整體」或「事物的每一部分」**"＋"**whole + 單數名詞**"（`I finally finished reading the whole novel.`／`I ate a whole package of chips.`）；**同页 `all / whole 比較` 独立小节**逐字 "**all 和 whole 都有「全部」的意思，但 whole 會比 all 更強調完整性，且 whole + 單數名詞，而 all + 複數可數名詞/不可數名詞。**"（对比例 `The boy played video games all day.` 对 `I had a headache, so I lied in bed the whole day.`／`I spent my whole vacation doing this project.`）；**`english.cool/whole/` 404**；**`letmeenglish.com/whole/` 404**（sitemap 965 URL 逐条核过，**无 `whole` 专文**）。 |
| **② 课程位** | **❌ 无。** BC 三档 **68 课 0 命中**（本轮 A1-A2 18 课 ＋ B1-B2 36 课全目逐条核过）；**BC 参考页 `Quantifiers` 连词都不收**（明证见 ①）。**Murphy：按既有记录无独立单元**（初级 U81 五词一格／中级 U88 四词一格，沿用批二十四记录，本轮未核）。 |
| **③ 规则页** | **✅ 有且厚（本批最厚）**：**Cambridge 两张独立页**（`Whole` 官网页 ＋ `All or whole?` 归 `Easily confused words` 类目）＋ **4 条明文 `Not:`** ＋ **中文侧两个独立小节（含一条对比）**。**⚠️ 修正批三十一的「2 条 `Not:`」——本轮实取 4 条**（§4）。 |
| **④ CEFR** | **A2（Cambridge 首义／Oxford 首义）**。 |
| **⑤ 档位** | **B（维持，不加不减）** |
| **⑥ 判定理由** | **维持 B 的三条依据全部本轮复核成立**：① **独立页**（`Whole` title 逐字核过）；② **独立易混页**（`All or whole?` 面包屑逐字 `Grammar > Easily confused words`——**「有独立易混页」是批三十 `each` 判 B 的关键判据**）；③ **硬规则从 2 条增到 4 条**。**不给 B＋**：**BC 零收录（连参考页词表都不进）＋ CEFR 只到 A2 ＋ 场景零件零（`whole` GL 0／HC 0，本轮实算）**。**不给 B−**：4 条 `Not:` 是真语法增量，不是同义换词（§4.2）。 |

### 1.3 `several`（几个）——**档位：B（维持）**

| 字段 | 内容 |
|---|---|
| **① 跨源逐字证据** | **⚠️ Cambridge 无独立页，本轮三重实测**：`/grammar/british-grammar/several` → **HTTP 302，`location` 逐字 `https://dictionary.cambridge.org/grammar/british-grammar/`（回总入口）**；`/several_1` → 302；`/several-or-a-few` → 302。**`Quantifiers` 索引页正文 `several` 0 命中**（本轮实取，页题逐字 `Quantifiers - Grammar - Cambridge Dictionary`，类目清单逐字含 `A bit`／`All`／`Any`／`Both`／`Either`／`Enough`／`Least, the least, at least`／`Less`／`Little, a little, few, a few`／`Lots, a lot, plenty`／`Many`／`More`／`Most, the most, mostly`／`Much, many, a lot of, lots of: quantifiers`／`No, none and none of`／`Plenty`／`Some`／`Some and any`——**`several` 不在名单内、无链接条目**）。**`Much, many, a lot of, lots of: quantifiers` 页 `several` 0 命中**（本轮对 article 正文与整页双算，均 0）。**BC `Quantifiers` 参考页**：逐字 "**Some quantifiers can be used only with count nouns:**"——**count-noun 名单逐字 `(not) many each either (a) few several both neither fewer`**（**`several` 在列**）。**Cambridge 词典 `SEVERAL`**（200，title 逐字 `SEVERAL \| English meaning - Cambridge Dictionary`）：**badge 实读 `A2`×1**，词性逐字 `determiner, pronoun`，释义逐字 "**some; an amount that is not exact but is fewer than many:**"（`I've seen "Gone with the Wind" several times.`／`Several people have complained about the plans.`）。**Oxford `several_1`**（200，title 逐字 `several determiner - Definition, pictures, pronunciation and usage notes`）：`cefr="a2"`×1，`ox3000="y"`，释义逐字 "**more than two but not very many**"（`Several letters arrived this morning.`／`He's written several books about India.`／`Several of the paintings were destroyed in the fire.`）。**中文侧 `english.cool/several/` 404；`english.cool/quantifiers/` 的 H2 清单里无 `several`**（本轮实取该页「數量詞一覽」表，逐字含 `some`／`any`／`a few`／`a little`／`few`／`little`／`many`／`much`／`each`／`every`／`all`／`whole`／`both`／`no`／`none`——**`several` 确实不在**）；**`letmeenglish.com/several/` 404**（sitemap 核过）；`letmeenglish.com/countable-uncountable/` **200**（sitemap 内），**但本轮未取正文核 `several` 是否在内（§7 项 5）**。 |
| **② 课程位** | **❌ 无**（Murphy 按既有记录与其他词共用一格；BC 三档 68 课 0；**Cambridge 无独立页，本轮 302 三度实测**）。 |
| **③ 规则页** | **❌ 无专页**——**只有 BC 名单里的一格**。**⚠️ 这是本批唯一「无规则页却够 B」的项**。 |
| **④ CEFR** | **A2 双源一致**（Cambridge `A2` ／ Oxford `a2`），**且两源释义逐字高度接近**（Cambridge `some; an amount that is not exact but is fewer than many` ／ Oxford `more than two but not very many`——**Oxford 的「下限两个以上」写得更死**）。 |
| **⑤ 档位** | **B（维持）** |
| **⑥ 判定理由** | **维持 B 的理由是 B 档定义的第二个分支：「我方须造词但成本可控」。** 三条：① **我方真零**（`several` GL **0**／HC **0**，本轮词边界实算）；② **语义独立于 `a few`**——Oxford 逐字把下限写死（"**more than two**"），**而我方 L114 的 `oneLineRule` 逐字是「「还有几个」说 a few」——没有下限，可以指两个**；③ **零件齐备**（`books` 521／`students` 一词多课，可数复数资源充足）。**不给 B＋**：**无独立规则页 ＋ BC 只给一格 ＋ Murphy 是共用格**。**不给 B−**：语义刻度是真的（「三到九」这条刻度我方零覆盖）。**⚠️ 保留项**：**它是本批 8 项里唯一「规则页为 0」的 B 档**——**风险是「无硬规则可教」，须靠「与 `a few`／`many` 的三段刻度」造课**（§5、§6.4）。 |

### 1.4 `had better`（最好…）——**档位：B（维持）**

> **§3 为专项，此处只给复核表字段。**

| 字段 | 内容 |
|---|---|
| **① 跨源逐字证据** | **Cambridge `Had better`**（`/grammar/british-grammar/had-better`，**200，title 逐字 `Had better - Grammar - Cambridge Dictionary`，h1 逐字 `Had better`**；**面包屑逐字 `Grammar > Verbs > Modal verbs and modality > Had better`**）：**h2 五个**逐字 `Had better: form and meaning`／`Had better: negative and question forms`／`Had better or be better, be best?`／`Had better or would rather, would prefer?`／`Had better: typical errors`。正文逐字："**We use had better to refer to the present or the future, to talk about actions we think people should do or which are desirable in a specific situation. The verb form is always had, not have. We normally shorten it to 'd better in informal situations. It is followed by the infinitive without to:**"／"**Had better is a strong expression. We use it if we think there will be negative results if someone does not do what is desired or suggested:**"／"**Sometimes people say had best instead of had better, especially in informal speaking. This sounds slightly less strong and less direct:**"／"**The negative of had better is had better not (or 'd better not):**"／"**The question form of had better is made by inverting the subject and had. This means the same as should, but is more formal:**"／"**Negative questions with had better are more common than affirmative ones:**"／"**We use had better to give advice in a specific situation. We use the phrase be better or be best + to-infinitive for more general suggestions:**"／"**We don't use had better when we talk about preferences. We use would rather or would prefer.**"；**4 条 `Not:` 逐字**：`Not: I'd better to go now.`／`Not: You'd better hold a full, valid driving licence to hire a car.`／`Not: … she'd better work …`／`Not: You'd better take a boat trip across the bay and see some of the islands.`。**⚠️ slug 陷阱复现**：`/grammar/british-grammar/better` → **200，但 title 是 `Had better`**；`/had-better-or-would-rather` → **200，title 也是 `Had better`**——**两页 `article.di` 正文 md5 与 `had-better` 完全相同（`7e41e31d91df633d026caa01a9f551da`）**。**Cambridge 词典 `SOMEONE HAD BETTER DO SOMETHING`**（`/dictionary/english/had-better`，200，title 逐字 `SOMEONE HAD BETTER DO SOMETHING - Cambridge English Dictionary`）：**badge 实读 `A2`×1**，定义逐字 "**used to give advice or to make a threat:**"，例 `You'd better (= you should) go home now before the rain starts.`／`He'd better pay me back that money he owes me soon, or else.`／`It's late - we'd better get going.`／`You'd better warn her not to be late.`。**Oxford `had-better` 404**（OALD 无该 headword，两式均试）。**中文侧**：**`english.cool/had-better/` 404**（`Page not found - 英文庫`）；**`letmeenglish` 有两篇**——① `/had-better/` **301 → `/had-better-it-is-time/`**（200，页题逐字「**had better 與 It's time 用法比較：語氣差異＋例句與練習**」）；② `/you-had-better/` **200**（页题逐字「**常用口語句型之 "You'd better…" 的用法**」，sitemap 实取）；**sitemap 共 965 URL 逐条核过，`had better` 族共 2 篇**。 |
| **② 课程位** | **❌ 无。** BC 三档 **68 课 0 命中**（A1-A2 18 课 ＋ B1-B2 36 课全目逐条核过，本轮 WebFetch 实取）；**BC 参考层 `Suggestions and obligations`（Level: beginner ＋ intermediate）正文 0 命中**——**WebFetch 明证："The phrase 'had better' does not appear in the page body. It appears only in a user comment (Mayura): 'You had better do exercise every day to be fit.'"**；**BC `Modals: permission and obligation`（B1／B2）正文 0 命中**——**明证："The phrase 'had better' does not appear anywhere in the page body."**；**BC `Modality: other modal words and expressions` 页 `better` 0 命中**（Cambridge 语法页，本轮实取，h2 逐字 `Other modal words`／`Other modal expressions`／`Modality: expressions with be`——**该页 `had better`／`better` 均 0**）。**Murphy：历史批次记录零命中，本机 TOC 不可达（§7 项 3）——不得据此断言「无位」，只能说「未核实」。** |
| **③ 规则页** | **✅ 有且厚（本批次厚）**：Cambridge 独立页（**5 实 h2 ＋ 4 条 `Not:`**）＋ 剑桥词典独立条目（**A2 标位**）＋ **中文侧两篇独立专文**（**⚠️ 修正批三十一的「1 篇」——本轮 sitemap 实取为 2 篇**）。 |
| **④ CEFR** | **Cambridge 词典 `A2`**（本轮 badge 实读）；**Oxford 404**。 |
| **⑤ 档位** | **B（维持）** |
| **⑥ 判定理由** | **维持 B。不升 A**：无课程位（BC 三档 68 课 0 ＋ 参考层两页 0）。**不给 B＋**：**① 与 L47 `should` 的建议轴正面相撞**（§3③）；**② `'d better` 缩写形我方全库未付账**（`X'd` 本轮实算：**GL 47 处，100% 集中在 L169 `I'd`**；`You'd`／`He'd`／`She'd`／`We'd`／`They'd` **全为 0**——**⚠️ 修正批三十一的「`'d` 全为 0」：L169 之后已有 `I'd` 47 处，但 `had 缩写`这一格仍未付账**）。**不给 B−**：**4 条 `Not:` 是真增量**（`I'd better to go` ✗ 是中文母语者高频错型）。**→ 本批 Top 2 之一**（§2）。 |

### 1.5 `so that`（为了／以便）——**档位：B（维持）**

| 字段 | 内容 |
|---|---|
| **① 跨源逐字证据** | **Cambridge `So that or in order that ?`**（`/grammar/british-grammar/so-that-or-in-order-that`，**200，title 逐字 `So that or in order that ? - Grammar - Cambridge Dictionary`，h1 逐字 `So that or in order that ?`**；**⚠️ 面包屑逐字 `Grammar > Easily confused words > So that or in order that?`——归「易混词」大类，不是 `Verbs`／`Conjunctions`**）：**全页无 `Not:`、无 Warning 框**，正文逐字 "**We use so that and in order that to talk about purpose. We often use them with modal verbs (can, would, will, etc.). So that is far more common than in order that, and in order that is more formal:**"（`I'll go by car so that I can take more luggage.`／`We left a message with his neighbour so that he would know we'd called.`）／"**We often leave out that after so in informal situations:**"（`I've made some sandwiches so (that) we can have a snack on the way.`）／"**When referring to the future, we can use the present simple or will/'ll after so that. We usually use the present simple after in order that to talk about the future:**"（`I'll post the CD today so that you get it by the weekend. (or … so that you will get it …)`）／"**So that (but not in order that) can also mean 'with the result that':**"（`The birds return every year around March, so that April is a good time to see them.`）。**⚠️ slug 陷阱**：`/grammar/british-grammar/so-that` → **200 但 title 是 `So that or in order that ?`**（同一页）；`/dictionary/english/so-that` → **302（无独立词典条目）**。**BC**：**`'to'-infinitives` 参考页 `so that` 0 命中**（批三十一明证 "No instances of 'so that' appear in the content"）；**BC A1-A2 18 课有 `Infinitive of purpose`（h1 逐字，Level 逐字 `A1 Elementary`／`A2 Pre-intermediate`）**——**那一课教的是 `to`-inf，不是 `so that`**。**中文侧 `english.cool/so-that/` 200 独立专文**，页题逐字「**「so that、in order that」正確用法是？來搞懂！**」，两个主 h2 逐字 `一、so that 的用法`／`二、in order that 的用法`；**逐字**："**so that / in order that 都是用來接表達 目的、理由 的句子，而且常搭配情態助動詞，如 can、could、will、would 等**"／"**so that 的曝光率較高，in order that 則較為正式**"；**给出了 `so` 省略 that 后与结果义 `so` 的分辨法**："**從 so 後面句子的意思來判斷即可**"＋对比例 `He sold his car so he could buy the apartment.`（目的）对 `He sold his car, so he goes to work by bus.`（结果）。 |
| **② 课程位** | **⚠️ 半有**：**BC A1-A2 正课 `Infinitive of purpose` 是 `to`-inf 的位，`so that` 挤不进去**；**Murphy 中级 U64 标题逐字 `64 to…, for… and so that…`**（批二十／批二十一既有记录，本轮未核）——**三词共用一格**。 |
| **③ 规则页** | **⚠️ 有但是「易混对页」**：独立页存在，但**挂 `Easily confused words` 下、无一条禁用、正文 4 段**——**不是 `so that` 的完整规则页，是「二选一」页**；补强件是中文侧独立专文。 |
| **④ CEFR** | **无标位**（词典 302、语法页无 badge）。 |
| **⑤ 档位** | **B（维持）** |
| **⑥ 判定理由** | **维持 B。不给 B＋**：① 课程位是 `to`-infinitive of purpose 的位；② **BC 全站不收 `so that`**；③ Cambridge 页是「易混对页」且无禁用。**不给 B−／不做**：① 有独立页 ＋ 中文侧独立专文 ＋ Murphy 三词格；② **我方目的义 `so that` 实测真零**——`so that` GL **1**，**唯一 1 处是 L102 `So that was last night!`（`:19420`）**，是**「结果义 so + that」的指示用法**，不是目的义连词（**本轮逐字复核，成立**）。**⚠️ 红线**：与 L44（`to` + 去做什么，`I go to the shop to buy milk.`）**同语义场**（§5）。 |

### 1.6 `as long as`（只要）——**档位：B（维持）**

| 字段 | 内容 |
|---|---|
| **① 跨源逐字证据** | **Cambridge `As long as and so long as`**（`/grammar/british-grammar/as-long-as-and-so-long-as`，**200，title 逐字 `As long as and so long as - Grammar - Cambridge Dictionary`，h1 逐字 `As long as and so long as`**；**面包屑逐字 `Grammar > Words, sentences and clauses > Conjunctions and linking words > As long as and so long as`**）：**h2 两个**逐字 `As long as`／`As long as and so long as`。正文逐字："**As long as and so long as are conjunctions.**"／"**We use as long as to refer to the intended duration of a plan or idea, most commonly referring to the future. We always use the present simple to refer to the future after as long as:**"（`We are very happy for you to stay at our house as long as you like.`／`I'll remember that film as long as I live.` ＋ **❌ `Not: … as long as I will live.`**）／"**As long as or so long as also means 'provided that', 'providing that' or 'on condition that':**"（`You are allowed to go as long as you let us know when you arrive.`）／"**So long as is a little more informal:**"（`You can borrow the car so long as you don't drive too fast.`）。**⚠️ slug 陷阱**：`/grammar/british-grammar/as-long-as` → **200 但 title 是 `As long as and so long as`**（同页）。**Cambridge 词典 `AS LONG AS`**（200，title 逐字 `AS LONG AS \| English meaning - Cambridge Dictionary`）：词性逐字 `idiom`，**badge 实读为空（无 A1-C2 标位）**，**释义只有一词**逐字 "**if:**"（`You can have a dog as long as you promise to take care of it.`）——**⚠️ 这是 Cambridge Academic Content Dictionary 的释义，不是 English Grammar Today**。**BC `Conditionals: zero, first and second`（B1／B2，36 课之一）**：逐字 "**It is also common to use this structure with unless, as long as, as soon as or in case instead of if.**"——**一句话列举四个，无独立小节**。**BC A1-A2 18 课 0 命中／B1-B2 36 课标题 0 命中**（本轮实取两索引全目逐条核过）。**中文侧 `english.cool/as-long-as/` 200 独立专文**，页题逐字「**來搞懂 as long as、as soon as、as far as 的用法！(含例句）**」，独立 h2 逐字 `1. as long as 只要…`；**逐字**："**as long as 指的是如果 A 事件發生了，那麼 B 事件就能夠實現，是條件句的一種。**"／"as long as 作為連接詞來連接兩個句子，可以放在句首或句中，代換成 so long as 也是一樣的意思"。 |
| **② 课程位** | **⚠️ 半有（三词共用一格）**：**Murphy 中级 U115 标题逐字 `115 unless as long as provided`**（既有记录，本轮未核）；**BC 仅一句列举，无独立小节；BC 三档 68 课 0。** |
| **③ 规则页** | **✅ 有**：Cambridge 独立页（**2 实 h2 ＋ 1 条 `Not:`**）＋ 中文侧独立专文。**⚠️ 修正批三十一的「3 实 h2 ＋ 2 h3」——本轮逐字复取为 h2 两个**。 |
| **④ CEFR** | **Cambridge 词典无标位**（badge 实测为空）；**BC 落点是 B1／B2 课内一句话**——**无硬标位**。 |
| **⑤ 档位** | **B（维持）** |
| **⑥ 判定理由** | **维持 B。不给 B＋／A**：① 课程位是三词共用一格；② CEFR 标位缺失；③ 中文专文把 `as long as` 与 `as soon as` 同篇并列，**而我方 L142 已教 `as soon as`**（本轮实取 L142 `oneLineRule` 逐字：「说「一到…就…」用 as soon as」；L143 逐字「when 管那段时间／as soon as 管一到就」）——**同篇对举意味着混淆面已存在，这是加分项，但也说明必须与 L142 同轴处理**。**⚠️ 红线**：**与 L48／L142 共享 `❌will` 纪律**——Cambridge 逐字 `Not: … as long as I will live.`，**而我方 L48 `oneLineRule` 逐字已经是「if 里不用 will，「如果的路面用现在时铺」」**（§5）。 |

### 1.7 `even if`（即使）——**档位：B（维持）**

| 字段 | 内容 |
|---|---|
| **① 跨源逐字证据** | **⚠️ slug 陷阱复现**：`/grammar/british-grammar/even-if` → **200，但 title 逐字 `If - Grammar - Cambridge Dictionary`**——**不是独立页**。`If` 页（面包屑逐字 `Grammar > Words, sentences and clauses > Conjunctions and linking words > If`）**h2 六个**逐字 `If: conditions`／`If possible, if necessary`／`If so, if not`／**`Even if`**／`If: reporting questions`／`If and politeness`。**`Even if` 节极短，全文两句**逐字："**We can use even if to mean if when talking about surprising or extreme situations:**"／"**You're still going to be cold even if you put on two or three jumpers.**"。**Cambridge `Even` 页**（`/grammar/british-grammar/even`，200，title 逐字 `Even - Grammar - Cambridge Dictionary`；面包屑逐字 `Grammar > Adjectives and adverbs > Using adjectives and adverbs > Even`）**h2 五个**逐字 `Even: position`／`Even and comparatives`／`Even and also`／**`Even though and even if`**／`Even so`；该节逐字 "**We can use even with though and if.**"／"**We use even before if to refer to a possible unexpected or extreme event:**"（`I'm still going to go swimming in the sea even if it rains. (I don't expect rain but it is possible.)`／`I've got to get home even if it means flying the plane myself.`）。**Cambridge 词典 `EVEN IF`**（200，title 逐字 `EVEN IF \| English meaning - Cambridge Dictionary`）：**独立 headword ＋ badge `B2`**，定义逐字 "**used to say that if something is the case or not, the result is the same:**"（`Even if you take a taxi, you'll still miss your train.`／`He's really funny, even if he's also rather arrogant.`／`You will make a good profit even if rents don't go up.`）。**BC `Conditionals: zero, first and second`（B1／B2）**：批三十一记录逐字 "In conditional clauses with words like if, unless, even if, we often use present tense forms to talk about the future"＋**❌ 对比例** `Even if Barcelona will lose tomorrow, they will still be champions. (incorrect)`——**无独立小节**（本轮未复核该页，§7 项 6）。**中文侧 `english.cool/even-if/` 404**；**`english.cool/even-though/` 200 独立专文**（**本轮实取，标题逐字「Even though 跟 Even if 的用法差在哪？來搞懂！」**），**含独立 h2 `even if 的用法與例句` ＋ h3 `even if 和 even though 可以用 even 代替嗎？` ＋ 5 道小試身手**；**逐字**："**even if 在中文裡可以解釋成「即使、就算、儘管、縱使、即便」等等。它用來表達「假設」，也就是不真實或想像的情況**"／"**很多人會誤以為 even if 和 even though 可以用 even 替代，但要注意 even 單獨出現的時候，不具有連接詞的功能**"＋**两条明文 ❌ 逐字**：`I wouldn't date Sam even he were handsome and muscular. ❌`／`Even I've polished and cleaned the vase, it still looks old. ❌`。 |
| **② 课程位** | **❌ 无。** BC 三档 68 课 **0**；**BC 参考页只有一句列举**。**Murphy 中级 U113 标题逐字 `113 although though even though in spite of despite` 含 `even though` 但不含 `even if`**（批二十五／批二十七既有记录）。 |
| **③ 规则页** | **⚠️ 半有**：**无独立语法页**（是 `If` 页的一个 h2），**但有「词典级独立条目」＋ `Even` 页的独立 h2 ＋ 中文侧专文的半篇**。 |
| **④ CEFR** | **Cambridge 词典 `B2`**（本轮 badge 实读）。 |
| **⑤ 档位** | **B（维持）** |
| **⑥ 判定理由** | **维持 B。不给 B＋**：① **无独立语法页**（两处都是 h2 小节）；② **BC 无独立小节**；③ **中文侧无独立专文**（只在对举篇里占一半）。**不给 B−**：① **词典级独立条目 ＋ B2 标位**；② **语义增量是真的**——**「即使」不是「如果」的换词，是「条件成立与否都不改变结果」的新逻辑**（Cambridge 逐字 "**the result is the same**"）；③ **中文侧给了两条真 ❌**。**⚠️ 红线**：与 L48 `if` 同壳（§5）。**⚠️ 增量薄（维持批三十一判断）——本批不排。** |

### 1.8 `as if`（好像）——**档位：B（维持，须缓排）**

| 字段 | 内容 |
|---|---|
| **① 跨源逐字证据** | **Cambridge `As if and as though`**（`/grammar/british-grammar/as-if-and-as-though`，**200，title 逐字 `As if and as though - Grammar - Cambridge Dictionary`，h1 逐字 `As if and as though`**；**⚠️ `/as-if` 与 `/as-though` 两个 slug 都 200 且都指向同一页**）：**h2 实为 0（整页连续正文）**。全文逐字："**As if and as though are conjunctions.**"／"**We use as if and as though to make comparisons. They have a similar meaning. We use as if and as though to talk about an imaginary situation or a situation that may not be true but that is likely or possible. As if is more common than as though:**"（`The floods were rising and it was as if it was the end of the world.`／`It looks as if they've had a shock.`／`It looks as though you've not met before.`）／"**We can use both as if and as though followed by a non-finite clause or a prepositional phrase:**"（`She moved her lips as if to smile.`／`They were shouting as though in panic.`）／"**As if and as though commonly follow the verbs feel and look:**"／"**In informal English, like can be used in a similar way to as if, though it is not always considered correct in formal contexts:**"——**全页无 `Not:`、无 Warning 框**。**⚠️ 词典陷阱**：`/dictionary/english/as-if` → **200 但 title 是 `AS IF!`（感叹条目）**，定义逐字 "**said to show that you do not believe something is possible:**"（`"Did you get a pay rise?" "As if!"`）——**用途是反讽感叹，不是目标义（好像）**；**`AS THOUGH` 才是目标义**（200，title 逐字 `AS THOUGH \| English meaning - Cambridge Dictionary`，**badge `B2`**，定义逐字 "**as if:**"）。**BC `Unreal time`（C1，C1 14 课之一）**：Language level 逐字 `C1 Advanced`，小节逐字 `Wish and if only`／`It's (high) time`／**`As if/as though`**／`Would rather`；该节逐字（批三十一记录）"We can use as if and as though to talk about how a situation appears or seems."／"When we follow as if/as though with an unreal tense, we are saying we don't think the statement is really true."——**本轮未复核该页（§7 项 6）**。**中文侧 `english.cool/as-if/` 404、`/as-though/` 404**（本轮实测）；**`letmeenglish` sitemap 965 URL 逐条核过，无 `as if`／`as though` 专文**。 |
| **② 课程位** | **❌ 无（唯一落点是 C1 共表课的小节）**：**BC 三档 68 课 0 专课**（C1 的 `Unreal time` 是四项共表课）；**Murphy 中级 U118 标题逐字 `118 like as if`**（既有记录）——**与 `like` 共用一格**。 |
| **③ 规则页** | **⚠️ 有但是「薄页」**：独立页存在（**标题是两者并列**），**但 h2 实为 0、无一条 `Not:`、无 Warning**——**全页 6 句正文**。 |
| **④ CEFR** | **`as though` 词典 `B2`**；**`as if` 无目标义标位**（只有感叹条目）；**BC 课程位落 `C1 Advanced`**——**三源分裂，最高落点 C1**。 |
| **⑤ 档位** | **B（维持，缓排）** |
| **⑥ 判定理由** | **维持 B。不给 B＋**：① 规则页薄（无小节、无禁用、6 句）；② BC 落点 C1（跨三档）；③ 中文侧零；④ Murphy 与 `like` 共用一格。**不给 B−／不做**：语义增量是真的（**虚拟/不真实语气层，我方零覆盖**）。**⚠️ 最硬的红线：与 L159／L160 抢动词位**——Cambridge 逐字 "**As if and as though commonly follow the verbs feel and look**"，而**我方 L159 逐字 `看起来像 · look 后面跟 like`（target `It looks like a boat.`）、L160 逐字 `好像 · seem 后面跟 to`（target `He seems to know you.`）**。**⇒ 维持批三十一「须缓排」判断，本批不排**（§5）。 |

---

## §2 本批 Top 2 推荐

### 2.1 推荐：**`whole`（1 课）＋ `had better`（1 课）**

| 顺位 | 候选 | 档位 | 课量 | 场景可行性 | 与我方已教的距离 | 造词成本 |
|---|---|---|---|---|---|---|
| **1** | **`whole`** | B | **1 课** | ✅ **高**——「整天／整本书／一整个」是小美日常里天然存在的说法 | **远但同轴**（L151 `all` 的同一张范围量词表，**且 L151 有一个空槽**，§4.3） | 1 个词位（`whole`，GL 0） |
| **2** | **`had better`** | B | **1 课** | ✅ **高**——「再不…就晚了」是小美日常高频场景（现在 L168 已教 `Why don't you`，**建议轴正好接得上**） | **中**（L47 `should` 的硬度下一档；**与 L76 `much better` 不撞车**，§3） | 1 个词位（`had better` 整串）＋ **可选** `'d better` 缩写 |

### 2.2 为什么是这两项（五条理由）

1. **两者都是本批仅有的「明文 `Not:` 增量」持有者**：`whole` **4 条 `Not:`**（§4.1），`had better` **4 条 `Not:`**（§3.1）。**其余 6 项**：`several` **0 条**（无规则页，302 实测）、`so that` **0 条**（易混页无禁用，本轮实算）、`as if` **0 条**（薄页无禁用）、`even if` **0 条**（h2 小节无禁用）、`as long as` **1 条**（**且与我方 L48 已教的 `❌will` 纪律重合**）、`be able to` **4 条，但其中 2 条属 `Be about to`／`Past achievement` 节**（**只有 2 条是 `able to` 本体**，且课程位被证伪，§2.3）。

2. **两者都通过「同义换词」红线**（§5）：`whole` 的 4 条 `Not:` 证明它**不是 `all` 的换词**；`had better` 的 h2 `Had better or be better, be best?` ＋ 4 条 `Not:` 证明它**不是 `should` 的换词，也不是形容词 `better` 的换词**。

3. **场景可行性都高**：`whole` 直接挂在 L151 `all` 后（**同季或紧邻季**，`All the books are good.` → `I read the whole book.`）；`had better` 直接挂在 **L168 `Why don't you…?`（建议轴）** 与 **L47 `should`** 之间。**两者都不需要造新场景。**

4. **`whole` 的 L151 空槽证据是本批最硬的一条**（§4.3）：L151 的 6 条 contrast **没有一条碰 `whole`**——**它不是「重叠」，是「留白」**。

5. **`had better` 的撞车评估结论是「可安全排」**（§3）——**这是我方本批最担心的一条，结果跨源反向给了我们一条分界线（`had better` vs `be better`），可以把 L76 的 `much better` 与新课的 `had better` 明确切开。**

### 2.3 ⚠️ `be able to` 的破例评估：**不破例，本批不排**

**批三十一的判断是「课程位压在 B1-B2，建议破例」。本轮判定：这个「破例」的前提不成立——它根本没有课程位。**

| 批三十一的依据 | 本轮的复核结果 | 影响 |
|---|---|---|
| 「BC 正课 `Past ability` 是 `be able to` 的课程位」 | **该课 h1 逐字 `Past ability`（不是 `Be able to`）**；小节逐字是 `General ability`／`Ability on one occasion – successful`／`unsuccessful`；**正文把 `able to` 与 `managed to` 并列**（"we use was/were able to … and managed to"） | **课程位证伪** |
| 「BC 参考层 beginner 不收它，说明它在 beginner 之上」 | **BC 参考层 `Ability` 正文 0 命中 `able to`**（明证 "There is no occurrence of 'able to' in the main article text"）；**但 BC A1-A2 18 课索引也 0 命中**，**B1-B2 36 课标题也 0 命中** | **它不在 BC 的任何课位**，「跨级」这个说法失去对象 |
| 「两条 `Not:` 是真增量」 | **成立但须收窄**——**`Be expressions` 页共 4 条 `Not:`，其中 1 条属 `Be about to` 节（`I was about to call you in ten minutes`）、1 条属 `Past achievement` 节（`Only one person could beat the record`）**；**真正属 `able to` 本体的是 2 条**（`She won't can concentrate`／`He should can work in a team`） | **只够 B，不够 B＋** |

**⇒ 结论：`be able to` 从 B＋ 降至 B，本批不排。若要排，须满足三个前置条件**（**建议留给后续批次**）：① **先有 `can`／`could` 的巩固课**（我方 L14 已有 `can`，但 `could` 只在 L61 `Could you…?` 的**客气请求**义上出现——**`could` 的能力义我方零**）；② **`able` 是「真造词」**（GL **0**；**⚠️ 子串口径会有 49 处假阳性，全是 `table`／`uncountable`——本轮实测 `\bable\b` = 0**）；③ **须先决定 `managed to` 是否入课**——**跨源把两者并列**，只做 `able to` 会留下一个悬空对照。

### 2.4 明列不排（5 项）与理由

| 候选 | 本批处置 | 理由 |
|---|---|---|
| `several` | **不排（顺位 3）** | 无规则页（0 条 `Not:`）、无课程位——**须靠「与 `a few`／`many` 的三段刻度」造课**，成本高于 Top 2；且**它与我方 L114 `a few` 的距离是「量级」而非「结构」**，**建议等 `whole` 上线后作为「量词表补格」第二批处理** |
| `so that` | **不排** | 易混对页无禁用 ＋ 与 L44 同语义场；**若排须与 L44 明确切分** |
| `as long as` | **不排** | **`❌will` 纪律已被 L48／L142 消耗**（Cambridge 唯一的 `Not:` 落在这条纪律上）⇒ 增量只剩「时长义」，**且中文专文与 L142 `as soon as` 同篇** |
| `even if` | **不排** | 增量薄（h2 小节两句话）＋ 与 L48 `if` 同壳 |
| `as if` | **不排（须缓排）** | C1 落点 ＋ 与 L159／L160 抢 `look`／`seem` 动词位 |

---

## §3 `had better` 专项（本轮重点）

### 3.1 ① 跨源逐字规则（含形态特殊性）

**Cambridge `Had better` 页（`https://dictionary.cambridge.org/grammar/british-grammar/had-better`，200，title 逐字 `Had better - Grammar - Cambridge Dictionary`，h1 逐字 `Had better`，面包屑逐字 `Grammar > Verbs > Modal verbs and modality > Had better`）**——**5 个 h2 逐字**：`Had better: form and meaning`／`Had better: negative and question forms`／`Had better or be better, be best?`／`Had better or would rather, would prefer?`／`Had better: typical errors`。

**规则一（形态：`had` 不表过去）**——逐字：
> "**We use had better to refer to the present or the future, to talk about actions we think people should do or which are desirable in a specific situation. The verb form is always had, not have.**"
> "**We normally shorten it to 'd better in informal situations.**"

**⇒ 三条可教点**：① **`had` 不是过去**（"to refer to the **present or the future**"）；② **永远是 `had`，不是 `have`**（"**always had, not have**"）；③ **口语缩写 `'d better`**。

**规则二（形态：后面不带 `to`）**——逐字：
> "**It is followed by the infinitive without to:**"
> `It's five o'clock. I'd better go now before the traffic gets too bad.`
> **`Not: I'd better to go now.`**

**⇒ 这是最强的一条可教点**（`Not:` 逐字，且是中文母语者高频错型：把 `had better` 当 `want to`／`need to` 一族垫 `to`）。

**规则三（语气：强建议 ＋ 负面后果）**——逐字：
> "**Had better is a strong expression. We use it if we think there will be negative results if someone does not do what is desired or suggested:**"
> `She'd better get here soon or she'll miss the opening ceremony.`

**规则四（否定与疑问）**——逐字：
> "**The negative of had better is had better not (or 'd better not):**"
> `I'd better not leave my bag there. Someone might steal it.`
> `You'd better not tell Elizabeth about the broken glass – she'll go crazy!`

> "**The question form of had better is made by inverting the subject and had. This means the same as should, but is more formal:**"
> `Had I better speak to Joan first before I send this form off? What do you think?`

> "**Negative questions with had better are more common than affirmative ones:**"
> `Hadn't we better ring the school and tell them Liam is sick?`

**⚠️ 注意**：**`Had better` 页没有「比较级 `better`」的任何一节**——**这是 §3.2 的关键证据**。

**规则五（典型错误，4 条 `Not:` 逐字）**——逐字：

> "**We use had better to give specific advice, not to talk about obligations or requirements; instead, we use have to, have got to or must:**"
> `You have to (or must) hold a full, valid driving licence to hire a car.`
> **`Not: You'd better hold a full, valid driving licence to hire a car.`**

> "**We don't use had better to talk about preferences; instead, we use would rather or would prefer:**"
> `They offered her a job in Warsaw, but she said she'd rather work in a smaller city.`
> **`Not: … she'd better work …`**

> "**We don't use had better to make ordinary suggestions or recommendations:**"
> **`Not: You'd better take a boat trip across the bay and see some of the islands. Then you'd better find a nice restaurant for lunch.`**

**补充（`had best` 变体）**——逐字：

> "**Sometimes people say had best instead of had better, especially in informal speaking. This sounds slightly less strong and less direct:**"
> `You'd best leave it till Monday. There's no one in the office today.`

**CEFR 与词典标位**：**Cambridge 词典 `SOMEONE HAD BETTER DO SOMETHING`（`/dictionary/english/had-better`，200，title 逐字 `SOMEONE HAD BETTER DO SOMETHING - Cambridge English Dictionary`）badge 实读 `A2`×1**，定义逐字 "**used to give advice or to make a threat:**"，例 `You'd better (= you should) go home now before the rain starts.`。**Oxford `had-better` 404**（两式均试）。

**中文侧（本轮 sitemap 实取 965 URL，`had better` 族共 2 篇）**：
- `/had-better/` **301 → `/had-better-it-is-time/`**（200，页题逐字「**had better 與 It's time 用法比較：語氣差異＋例句與練習**」），逐字：「**很多學習者會把 had better 當成一般建議來用，或誤以為因為有 had 就只能用在過去**」／「**had 是 have 的過去式，但 had better 是只用在說明未來近期的情況。**」／「**在 had better 之後我們需要使用不定詞不加to (即動詞原形)。**」＋**明文 ❌**「**不能說 I'd better to take**」／「**I'd better not 是 had better 的否定形式。**」／「**在英語口語中我們通常使用縮寫形式 'd better**」＋**独立小节 `had better vs should`**（逐字「**我們經常用 should 來給建議，來表示建議某事是一件好事。我們 had better 表示緊急的建議或警告，如果你不遵守的話結果會是不好的。**」）＋ **10 道练习题**（含 `You 'd better book / better booking / 'd better to book` 三选一）。
- `/you-had-better/` **200**（页题逐字「**常用口語句型之 "You'd better…" 的用法**」），逐字：「**"You'd better + (動詞)"這結構用來給提出你認為聽者應該做的事情。這個結構通常用來表達緊迫感或重要性，有時可能顯得有些強勢。**」／「**要正確使用這個結構，你需要知道 you'd 是 you had 的縮寫。在 you'd better 之後，你需要使用動詞原型**」。

### 3.2 ② 它与比较级 `better` 在跨源里是否被当易混点？——**否，三层证据**

**⚠️ 这是本批最重要的一条否定结论。**

| 证据层 | 逐字／实测 | 判定 |
|---|---|---|
| **① Cambridge `Had better` 页正文** | 本轮对 `article.di` 正文逐字复算（`better` 共 **39 处**，逐条归类）：**全部落在 `had better`（含缩写与倒装形）／`be better`／`better to be safe than sorry` 三串**；**`comparative` 0 次／`comparison` 0 次／`much better` 0 次**；`than` 3 次全是 `more common than`／`better … than sorry` 等非比较结构 | **该页不把 `had better` 当比较结构讲** |
| **② Cambridge `Easily confused words` 索引** | 本轮实取索引页，**B 段条目逐字只有** `Been or gone?`／`Begin or start?`／`Beside or besides?`／`Between or among?`／`Born or borne?`／`Bring, take and fetch`／`Can, could or may`——**没有 `Better?` 或 `Better or had better?` 条目**（全页 `Better` 0 命中／`had better` 0 命中／`Several` 0 命中；**`whole` 仅 1 次，在 `All or whole?` 条目里**） | **上游没把二者归入「易混词」** |
| **③ Cambridge 词典 `better` 条目** | 本轮实取 `BETTER`（200，title 逐字 `BETTER \| English meaning - Cambridge Dictionary`，**badge 实读 `A1`×2 ＋ `A2`×2**）：首义逐字 "**comparative of good : of a higher standard, or more suitable, pleasing, or effective than other things or people**"；**该页有 23 处 `had better`，但全部落在一个独立的 `Grammar: Had better` 交叉引用块里**（**逐字**："Grammar — **Had better** We use had better to refer to the present or the future …"），**不是 `better` 的词义之一** | **词典把 `had better` 作为独立语法块挂靠，不作 `better` 的义项** |

**⚠️ 但跨源给了我们一条相反方向的、可用的分界线**——**Cambridge `Had better` 页的 h2 `Had better or be better, be best?`** 逐字：

> "**We use had better to give advice in a specific situation. We use the phrase be better or be best + to-infinitive for more general suggestions:**"
> `It's always better to be safe than sorry.`
> `I think it would be best to speak to the people in the video shop to see what they recommend.`

**⇒ 这是上游主动画出的分界：`had better`（具体情境的强建议）vs `be better`／`be best + to`（一般性建议）。** **而我方 L76 教的 `much better` 是第三样东西（比较级的「加力」，不是建议）。** **⇒ 三者可在同一课里做三分对照**（§3.4 的错项设计正基于此）。

### 3.3 ③ 它与我方 L47 `should` 的关系

**判定：不是同义换词，是「同一建议轴的更硬一档」——但撞车风险真实存在，须靠「硬度梯度」处理。**

**跨源三条逐字依据**：

1. **上游承认两者有交集**（Cambridge `Had better` 页 h2 `Had better: negative and question forms` 节内）逐字：
   > "**The question form of had better is made by inverting the subject and had. This means the same as should, but is more formal:**"
   
   **⚠️ 注意限定条件——「疑问形才 means the same as should」**，**上游没有说 `had better` 整体等于 `should`**。（对比 `ought to` 页：**四处逐字都写「就是 should」**——"Ought to and should are similar in meaning"／"means the same as"／"We usually use should instead"×2。**这是 `had better` 与 `ought to` 的档位分水岭。**）

2. **中文侧专文给出的是「强度差」而不是「同义」**（`letmeenglish/had-better-it-is-time/` 独立小节 `had better vs should`）逐字：
   > "**我們經常用 should 來給建議，來表示建議某事是一件好事。我們 had better 表示緊急的建議或警告，如果你不遵守的話結果會是不好的。**"

3. **上游的课程位分布证明这是两个不同的教学点**：**BC 三档 68 课有 `should`**（`Suggestions and obligations` 参考页逐字 "**We use should and shouldn't to make suggestions and give advice:**"＋`You should send an email.`／`You shouldn't go by train.`；`Modals: permission and obligation` 正文含 `must`／`have to`／`don't have to`），**但 68 课 0 命中 `had better`**。**⇒ 上游把 `should` 当课、把 `had better` 当规则页 ⇒ 二者的教学地位不同。**

**与我方 L47 的实际关系（本轮实取 L47 全部 6 条 contrast）**：

| L47 已占的槽位 | 逐字 | `had better` 是否撞 |
|---|---|---|
| `should` 不垫 `to` | ❌ `You should to sleep early.`（mark `to`） | **⚠️ 同型**——`had better` 的第一增量正是 `I'd better to go` ✗ |
| 家族动词穿原样 | ❌ `She should goes to bed.`（mark `goes`） | **部分**——`had better` 后也是原形 |
| `should` vs `must` 的口气 | ✅ 双正解（"一句是建议（should，像关心）、一句是必须（must，像命令），口气不同"） | **⚠️ 撞车**——L47 已经教了「同一句、三种口气」这个思路 |
| 疑问形搬句首 | ❌ `Should I to rest now?`（mark `to`） | **⚠️ 撞**——`Had I better…?` 同型（且更正式） |
| 否定缩成一个词 | ❌ `You don't should sleep late.`（mark `don't should`） | **⚠️ 撞**——`had better not`／`hadn't we better` 同型 |

**⇒ 结论**：**`had better` 的 5 个可教槽位里有 4 个与 L47 同型。** **唯一真正的新东西是「有负面后果的强建议」这条语义**（Cambridge 逐字 "**if we think there will be negative results if someone does not do what is desired or suggested**"）＋ **`had` 永远不是 `have`／不是过去**这条形态学。

**⇒ 处置建议（明确）**：
- **判「半新结构、1 课封顶」**（**不做 2 课**）；
- **新课的 6 条 contrast 里，最多 1 条可以让 `should` 出场**（作为「同一件事，口气更急」的双正解），**其余 5 条必须落在 L47 没占的位**；
- **`had better` 的课位应紧贴 L168（`Why don't you…?`）之后**，形成「建议三档」：**`Why don't you`（最软，L168）→ `should`（中，L47）→ `had better`（最急，新课）**。

### 3.4 ④ 3 条带标记新错（全部带跨源逐字依据）

| # | 错句 | 标记 | 跨源逐字依据 | 与我方已教的关系 |
|---|---|---|---|---|
| **1** | `I'd better to go now.` | `to` | Cambridge `Had better` 页**逐字 `Not: I'd better to go now.`**（同一段正句 `It's five o'clock. I'd better go now before the traffic gets too bad.`）；中文侧逐字「**不能說 I'd better to take**」 | **同 L47 的 `should to` 型**（❌ `You should to sleep early.`）——**同一条「家族不垫板」纪律，第三次应用** ⇒ **可作对照，不能作唯一增量** |
| **2** | `You'd better hold a licence to hire a car.` | `You'd better` | Cambridge `Had better` 页**逐字 `Not: You'd better hold a full, valid driving licence to hire a car.`**（正句 `You have to (or must) hold a full, valid driving licence to hire a car.`） | **与 L16（`must`／`have to`）／L161（`need to`）形成「必须 ≠ 最好」的切分**——**这是 L47／L16／L161 都没教过的一条边界**（L47 只对比了 `should` vs `must` 的「口气」，**没对比「义务 vs 建议」的适用域**） |
| **3** | `I'd better work in a smaller city.`（想说「我宁愿在小一点的城市工作」） | `'d better` | Cambridge `Had better` 页**逐字 `Not: … she'd better work …`**（正句 `… she said she'd rather work in a smaller city. (or … she'd prefer to work …)`）；同页 h2 节逐字 "**We don't use had better when we talk about preferences. We use would rather or would prefer.**" | **⚠️ 与我方 L169（`I'd like`，47 处 `I'd`）同形不同义**——**`I'd` 既可以是 `I would`（L169 的「想要」）也可以是 `I had`（`I'd better`）** ⇒ **这是本课最硬的一条新错，且是 L169 之后的下一个自然台阶** |

**可选第 4 条（若需强化「`had` 不是过去」）**：`I had better went home.` ❌ → `I'd better go home.` —— **⚠️ 依据强度提示**：**本轮未找到 Cambridge 的逐字 `Not:` 直接对应此句型**（4 条 `Not:` 中没有这一条）；**可依据的是中文侧逐字「had 是 have 的過去式，但 had better 是只用在說明未來近期的情況」＋「在 had better 之後我們需要使用不定詞不加to」两条合成** ⇒ **标注为「合成推导」，不是逐字禁用**。

---

## §4 `whole` 专项

### 4.1 ① 逐字给出「`all` 做不到的硬规则」——**本轮实取 4 条（批三十一记 2 条）**

**来源页**：**Cambridge `All or whole?`**（`https://dictionary.cambridge.org/grammar/british-grammar/all-or-whole`，**200，title 逐字 `All or whole ? - Grammar - Cambridge Dictionary`**；**面包屑逐字 `Grammar > Easily confused words > All or whole?`**）。**h2 四个逐字**：`All or whole for single entities`／`All the with uncountable nouns`／`All and whole with plural nouns`／`All and whole: typical errors`。

**硬规则一（`a/an` 位）**——逐字：

> "**We use a/an with whole but not with all:**"
> `I spent a whole day looking for that book and eventually found it in a little old bookshop on the edge of town.`
> **`Not: … all a day …`**

**硬规则二（不可数名词位）**——逐字（h2 `All the with uncountable nouns`）：

> "**We use all the and not the whole with uncountable nouns:**"
> `She was given all the advice she needed.`
> **`Not: She was given the whole advice …`**
> `All the equipment is supplied.`

**硬规则三（`all` 的另一条禁用，批三十一未记）**——逐字（h2 `All and whole: typical errors`）：

> "**We don't use all before a and an:**"
> `She ate a whole bar of chocolate in one go.`
> **`Not: She ate all a bar …`**

**硬规则四（`whole` 的 `the` 不可省，批三十一未记）**——逐字（同 h2）：

> "**We can't omit the before whole with a singular noun:**"
> `We travelled throughout the whole country.`
> **`Not: … throughout whole country.`**

**补充：一条「可以互换」的边界（说明哪些不算增量）**——逐字（h2 `All or whole for single entities`）：

> "**We use the whole or the whole of to refer to complete single things and events that are countable and defined:**"
> `The whole performance was disappointing from start to finish. (or The whole of the performance was disappointing …)`
> "**When we can split up a thing into parts, we can use either whole or all with the same meaning:**"
> `You don't have to pay the whole (of the) bill at once.` ＝ `You don't have to pay all (of) the bill at once.`
> `She ate the whole orange.` ＝ `She ate all of the orange.`

**⇒ 「2 条硬规则」的准确表述应为**：**`whole` 与 `all` 有一大片可互换区（单数可数、可分割的整物）＋ 4 条不可互换的明文禁区。** 批三十一记的 2 条（硬规则一、二）**是本轮复核成立的核心 2 条**；**硬规则三、四是本轮新增，可信度同级（都是 `Not:` 明文）**。

**另附 `Whole` 官网页的两条结构规则**（`/grammar/british-grammar/whole`，200，title 逐字 `Whole - Grammar - Cambridge Dictionary`）——逐字：

> "**Whole is a determiner. We use whole before nouns and after other determiners (my, the, a/an, their) to talk about quantity. We use it to describe the completeness of something:**"

> "**We use the whole of when whole is followed by another determiner (my, her, this, the):**"
> `She had been in the same job for the whole of her life. (or … for her whole life.)`

> "**We often use the whole of with periods of time to emphasise duration:**"
> `At dawn, he would finally fall into bed and stay there the whole of the next day.`

**⇒ 加 1 条**：**`the whole of + my/her/this/the`**（**`whole` 后面再接别的限定词时必须加 `of`**）——**这是第 5 条硬规则**，且**正好与我方 L151 的 `All the books`（`all` 直接接 `the`）形成干净对照**。

### 4.2 为什么这不算「同义换词」（红线判定）

**判定：`whole` 通过红线，理由三条**：

1. **上游自己把它做成易混**：`All or whole?` 挂在 **`Easily confused words`** 类目（面包屑逐字），**说明上游认为二者的差别需要专门一页处理**——**如果是同义换词，上游不会开这一页**。

2. **4 条 `Not:` 是「语法禁区」，不是「用词偏好」**：**每条都给出一个必错的句型和必对的正解**（`all a day` ✗ ／ `the whole advice` ✗ ／ `all a bar` ✗ ／ `whole country` ✗）。**同义换词的判据是「上游逐字写同义」（如 `a lot of` 的 "similar in meaning to much and many"／`plenty of` 的 "to mean 'enough'"）——`whole` 页没有这样的句子。**

3. **中文侧同样切成两段**：`english.cool/quantifiers/` 有 `whole` 独立小节 ＋ **`all / whole 比較` 独立小节**，逐字 "**all 和 whole 都有「全部」的意思，但 whole 會比 all 更強調完整性，且 whole + 單數名詞，而 all + 複數可數名詞/不可數名詞。**"——**它给的是「分工」不是「同义」。**

### 4.3 它与我方 L151 `all` 的切分是否成立？——**成立，且 L151 有一个现成空槽**

**本轮实取 L151 的全部 6 条 contrast**（逐字）：

| # | wrong | 标记 | correct | 类型 | whyZh 逐字（节选） |
|---|---|---|---|---|---|
| 1 | `All student is here.` | `student` | `All the books are good.` | 改错 | 「一个不落」说的是一群，后面那个东西要带上 s |
| 2 | `All of books are good.` | `of` | `All the books are good.` | 改错 | 英语的 all 后面也直接接——中间不加 of |
| 3 | `All the books is good.` | `is` | `All the books are good.` | 改错 | 好几样东西一起出场，搭档要用 are |
| 4 | `Both books are good.` | — | — | **双正解** | 第 148 课那句是「两个」，今天这句是「三个以上」 |
| 5 | `All my books are new.` | — | — | **双正解** | all 后面可以站 the，也可以站 my |
| 6 | `I ate two sandwiches.` | — | — | **双正解** | 第 11 课那句也是「好几个」 |

**⇒ 三条判定**：

1. **L151 的 6 个槽位里 `whole` 出现 0 次** ⇒ **没有重叠，是留白**。
2. **L151 占的是「`all` 直接接 the／my ＋ 复数 ＋ 复数搭档」这一片**（3 条改错全在这条线上）——**而 `whole` 的 5 条硬规则全部落在 L151 之外**：① `a/an` 位；② 不可数位；③ `all` 前不能加 `a/an`（**这是 `all` 的错，L151 没教**）；④ 单数名词前 `the` 不可省（**`all` 无此限制**）；⑤ `the whole of + 限定词`。
3. **最干净的切口是「单数 vs 复数」**：**L151 逐字「它管的是三个以上，一个都不落下」＋ `All the books`（复数）；`whole` 是「一整个」（单数，`the whole book`）**——`english.cool` 的对比句正是这条（`The boy played video games all day.` 对 `I had a headache, so I lied in bed the whole day.`）。

**⇒ 切分成立，且建议切口**：**「`all` 管一群（复数），`whole` 管一整个（单数）」＋ 两条明文禁区（`a whole day` ✓ ／`all a day` ✗；`all the advice` ✓ ／`the whole advice` ✗）。** **≈ 3 条增量 ⇒ 够 1 课**（§6.1）。

---

## §5 「同义换词 vs 新结构」甄别（核心红线）

**判定口径**：**「教新结构」＝ 我给出一条现有课程里没有的造句规则**；**「同义换词／扩展」＝ 上游逐字写成与已教内容同义，或新项的全部语法含量可由已教内容直接推出**。**红线：若只是同义表达，档位必须下调甚至判不做。**

**已教基线（本轮实取，供逐条比对）**：

| 已教内容 | 课 | `grammarLabel` 逐字 | `oneLineRule` 逐字（节选）／`targetSentence` |
|---|---|---|---|
| `can` | **L14** | `能 · can` | 「说「能/会」，动词前面放 can，动词一点不变：I can swim。」／`Can I have a milk tea?` |
| `must`／`have to` | **L16** | `必须 · must / have to` | 「说「必须」：must + 原样——I must go。」／`I must finish my homework today.` |
| `should`（建议） | **L47** | `情态三兄弟 · should` | 「can 能、must 必须、should 应该（给建议，比 must 轻）」／`You should sleep early.` |
| `if`（条件） | **L48** | `条件句 · if 里说现在` | 「if 里说现在（If it rains），主句说将来（I will stay）——if 里不用 will」／`If it rains, I will stay at home.` |
| `should` + `if` 收口 | **L49** | `收口 · 建议 + 条件` | 「主建议用 should，条件用 if 挂后面」／`You should take an umbrella if it rains.` |
| `to` + 去做什么（目的） | **L44** | `小垫板新用法 · to + 去做什么` | 「到地方垫一块 to（带路），去做什么再垫一块 to（说明目的）」／`I go to the shop to buy milk.` |
| `a few`／`few` | **L114** | `还有几个 vs 几乎没了 · a 在不在，意思反一半` | 「「还有几个」说 a few（a 在，够）；「几乎没了」说 few」／`There are a few apples.` |
| `as soon as` | **L142** | `一到就做 · as soon as + 小句子` | 「前面那件事一到，后面那件马上做——前面说现在，后面说将来」／`As soon as I finish, I will eat.` |
| `when` vs `as soon as` | **L143** | `差在哪儿 · when 管那段时间／as soon as 管一到就` | — |
| `all` | **L151** | `三个以上都 · all 也站最前面` | 「它管的是三个以上，一个都不落下」／`All the books are good.` |
| `every` | **L152** | `差在哪儿 · 好多个一起／一个一个来` | — |
| `need to` | **L161** | `需要 · need 后面也跟 to` | 「它和第 16 课那个「必须」不一样：must 是别人要求你，need 是这件事本身要办」／`I need to buy some milk.` |
| `most of` | **L162** | `大多数 · most 后面也要 of` | 「后面要拴一个 of……第 157 课那个 none 后面也拴 of，这两个正好一对」／`Most of the students like it.` |
| `Why don't you` | **L168** | `建议 · Why don't you…?` | 「给人建议用 Why don't you……它听着像在问，其实是在劝」／`Why don't you take a rest?` |
| `I'd like` | **L169** | `缩写 · I'd like（更口语）` | 「I would like 说快了会缩成 I'd like……那个小撇号就是被省掉的 would」／`I'd like a cup of tea.` |
| `much better`（比较级加力） | **L76** | `加力 · much + 更…` | 「给「更」加力的小词用 much：much better、much taller——它站在「更…」前面」／`I feel much better today.` |

**逐项甄别**：

| 候选 | 判定 | 逐字跨源依据 | 与我方现存 | 档位处理 |
|---|---|---|---|---|
| **`whole`** | **🟢 新结构** | `All or whole?` 归 `Easily confused words` ＋ **4 条 `Not:`**（❌`all a day`／❌`the whole advice`／❌`all a bar`／❌`throughout whole country`）＋ `Whole` 页的 `the whole of` 规则 | **L151 `all`**（同一张范围量词表，**但 L151 的 6 槽位无 `whole`**） | **B 维持，本批排 1 课** |
| **`had better`** | **🟡 半新结构（新词形＋新语义强度，旧「建议」轴的更硬一档）** | 5 实 h2 ＋ **4 条 `Not:`**（❌`I'd better to go`／❌`You'd better hold a licence`）＋ "**The verb form is always had, not have.**"＋ h2 `Had better or be better, be best?` | **L47 `should`**（**5 个槽位撞 4 个**，但「负面后果的强建议」是真新语义）／**L76 `much better`**（**不撞，§3.2**）／**L169 `I'd like`**（`I'd` 的第二种展开） | **B 维持，1 课封顶** |
| **`be able to`** | **🟡 半新结构（新词形，旧 `can` 轴）** | `Be expressions` 页 h3 `Past achievement: could or was/were able to?`（独立小节）＋ **2 条 `Not:`**（❌`won't can`／❌`should can`） | **L14 `can`**（**同一能力轴**，且两条 `Not:` 正是 L14「情态动词不叠加」纪律的反向） | **⚠️ 修正 B＋→B，不排**（§2.3） |
| **`several`** | **🟢 新轴（刻度）** | BC count-noun 名单逐字（`several` 在列）＋ **两源释义把下限写死**（Oxford `more than two but not very many`） | **L114 `a few`**（**我方无下限，可指两个** ⇒ 不是同义，是刻度）／**L30 `some`／`many`** | **B 维持，不排（顺位 3）** |
| **`so that`** | **🟡 半新结构（同目的语义场）** | `So that or in order that?` 归 `Easily confused words` ＋ "**So that is far more common than in order that**" ＋ "**So that (but not in order that) can also mean 'with the result that'**" | **L44 `to` + 去做什么**（**同「目的」位**；且 `so` 我方 L20 已教「所以」的**结果**义——**L102 唯一 1 处 `so that` 正是结果义**） | **B 维持，不排** |
| **`as long as`** | **🔴 高撞车（同 `❌will` 纪律 ＋ 同条件壳）** | Cambridge **唯一 1 条 `Not:` 就是 `Not: … as long as I will live.`**——**与我方 L48 `oneLineRule` 逐字「if 里不用 will」完全同一条纪律** | **L48 `if`**／**L142 `as soon as`**（**中文专文把两者同篇并列**） | **B 维持，不排** |
| **`even if`** | **🟡 半新结构（新逻辑，旧连词壳）** | "**We can use even if to mean if when talking about surprising or extreme situations**"＋词典 "**the result is the same**"（**「条件成立与否都不改变结果」**） | **L48 `if`**（**同壳**） | **B 维持，不排（增量薄）** |
| **`as if`** | **🟡 半新结构，但抢动词位** | "**As if and as though commonly follow the verbs feel and look**"＋（BC）"**with an unreal tense, we are saying we don't think the statement is really true**" | **L159 `look like`**／**L160 `seem to`**（**直接抢 `look`／`feel` 槽**） | **B 维持，不排（须缓排）** |

**⇒ 红线本批触发两条**：
- **`as long as`**——**唯一 1 条 `Not:` 已被 L48 消耗**；
- **`so that`**——**与 L44 同「目的」语义场**。
**两条档位均维持 B（它们仍有独立页），但课量为 0。** **`be able to` 不触红线（它是 `can` 轴的形态补充），但档位因课程位证伪而下调。**

---

## §6 逐课规格的跨源支撑

### 6.1 Top 1：`whole`（1 课）——建议课号 **L170**

**跨源支撑总表**：

| 项 | 逐字 | 来源 |
|---|---|---|
| 类属 | "**Whole is a determiner.**" | Cambridge `Whole`（200，`Grammar > Nouns, pronouns and determiners > Determiners > Whole`） |
| 位置 | "**We use whole before nouns and after other determiners (my, the, a/an, their)**" | 同上 |
| 语义 | "**We use it to describe the completeness of something**" | 同上 |
| `of` 规则 | "**We use the whole of when whole is followed by another determiner (my, her, this, the)**" | 同上 |
| 时长用法 | "**We often use the whole of with periods of time to emphasise duration**" | 同上 |
| 单复数分工 | "**whole 會比 all 更強調完整性，且 whole + 單數名詞，而 all + 複數可數名詞/不可數名詞。**" | 中文侧 `english.cool/quantifiers/` |
| CEFR | Cambridge `A2`（`complete or not divided`）／Oxford `a2`（`full; complete`，`[only before noun]`） | 两条词典（badge 实读） |

**3 条带标记新错（各带跨源逐字依据）**：

| # | 错句 | 标记 | 正确 | 跨源逐字依据 |
|---|---|---|---|---|
| **1** | `I spent all a day reading.` | `all a` | `I spent a whole day reading.` | Cambridge `All or whole?` **逐字 "We use a/an with whole but not with all:" ＋ `Not: … all a day …`**（同页另一处 `Not: She ate all a bar …`） |
| **2** | `She was given the whole advice.` | `the whole` | `She was given all the advice she needed.` | Cambridge `All or whole?` h2 `All the with uncountable nouns` **逐字 "We use all the and not the whole with uncountable nouns:" ＋ `Not: She was given the whole advice …`** |
| **3** | `We travelled throughout whole country.` | `whole` | `We travelled throughout the whole country.` | Cambridge `All or whole?` h2 `All and whole: typical errors` **逐字 "We can't omit the before whole with a singular noun:" ＋ `Not: … throughout whole country.`** |

**可选第 4 条（若要接 `of`）**：`She worked there for whole of her life.` ❌ → `… for the whole of her life.` —— **依据**：Cambridge `Whole` 页逐字 "**We use the whole of when whole is followed by another determiner**" ＋ `She had been in the same job for the whole of her life. (or … for her whole life.)`。**⚠️ 标注**：**此句型 Cambridge 未给 `Not:`，属「由正句反推」，强度低于前 3 条。**

**目标句候选（全部用已教词汇；本轮已逐词核过词频）**：

| 角色 | 候选句 | 已教零件核对（本轮实算） |
|---|---|---|
| **主目标句（建议）** | `I read the whole book.` | `read` 207（L40:40）／`book` 521（L112:60）／`the` 高频；**`whole` GL 0（新课的词）** |
| 备选 1（时长义，接 `day`） | `She stayed here the whole day.` | `stay` ／`day` 254（L89:54）／`here` |
| 备选 2（`my` 位，接 L151 的 `All my books` 双正解） | `I cleaned my whole room.` | `clean` ／`cleaned` 130（L53:58）／`room` 24（L23:5）／`my` |
| 备选 3（接 `of`，为第 4 条留位） | `She slept the whole of the morning.` | `morning` 12（L18:4）——**偏薄，建议用备选 1** |

**⚠️ 场景建议**：**挂在 L151 之后、作为「范围量词表补格」**（L151 `All the books are good.` → L157 `None of the cups are mine.` → L162 `Most of the students like it.` → **新课 `I read the whole book.`**）。**新课的 6 条 contrast 建议配置**：3 条改错（上表 1／2／3）＋ 1 条 `all` vs `whole` 的双正解（`All the students are here.` ＝ `The whole class is here.`——**依据 Cambridge 逐字 "All my family lives abroad. or My whole family lives abroad."**）＋ 2 条回收位（L151 的复数规则／L162 的 `of`）**⇒ 恰好 6 条**。

### 6.2 Top 2：`had better`（1 课）——建议课号 **L171**

**跨源支撑总表**：见 §3.1（5 h2 ＋ 4 条 `Not:` ＋ A2 标位 ＋ 中文侧 2 篇）。

**3 条带标记新错**：见 §3.4（已给全）。**6 槽位配置建议**：§3.4 的 3 条新错 ＋ **1 条 `should` 双正解**（`You should rest.` ＝ `You'd better rest.`；依据 Cambridge 逐字 "This means the same as should, but is more formal" ＋ 中文侧逐字「had better 表示緊急的建議或警告」——**这是本课唯一允许 `should` 出场的一条**）＋ **1 条 `much better` 双正解**（`I feel much better today.`（L76）为回收位，**⚠️ 必须标注「这里的 better 是比较级，不是 had better」**；依据 Cambridge h2 `Had better or be better, be best?` 逐字 "We use the phrase be better or be best + to-infinitive for more general suggestions"）＋ **1 条否定形**（`You'd better not tell her.`；依据 Cambridge 逐字 "The negative of had better is had better not (or 'd better not)"）**⇒ 恰好 6 条**。

**目标句候选**：

| 角色 | 候选句 | 备注 |
|---|---|---|
| **主目标句（建议）** | `You'd better rest now.` | `rest` 58（L168:43）／`now` 44（L16:12）；**`'d` 需新付账**（本轮实测：`X'd` 全库 47 处**全是 L169 的 `I'd`**，`You'd` **0**） |
| 全形版（若不上缩写） | `You had better rest now.` | **⚠️ 若只上全形，与「跨源逐字 'We normally shorten it to 'd better in informal situations'」的口语现实脱节**（§7 项 4） |
| 备选 1（接 L168 建议轴） | `You'd better go home now.` | `go` 680／`home` 173 |
| 备选 2（负面后果语义） | `You'd better hurry up.` | `hurry` 需核（**本轮未核**，§7 项 7） |

---

## §7 未核实项（诚实登记）

| # | 项 | 影响 | 状态 |
|---|---|---|---|
| **1** | **⚠️ 我方快照与任务书不一致**：任务书写「162 课／171 案／31 季」，**本轮实测 169 课／178 案／33 季**；且三文件在 **00:52–01:09** 之间被并发写入（期间 `grammarLessons.ts` 一度出现 `:31758` 语法错误，01:09 后恢复可解析） | **中**——**本报告全部数字以 01:09 快照为准**；**若主理人手上的口径是 162，则 L163–L169 的 7 课不在其视野内**（其中包括 **L169 `I'd like`——它直接改变 `had better` 的成本评级**） | **已标注，未解决** |
| **2** | **`be able to` 的降档**依赖「BC A1-A2 18 课 0 命中 ＋ B1-B2 36 课 0 命中 ＋ BC 参考层 `Ability` 正文 0 命中」三条 WebFetch 结论 | **中**——**这是本批唯一一处「修正批三十一」的判定**；WebFetch 是转述通道，**逐字可靠性低于直连 HTML**（BC 直连 403） | **四页交叉核过（A1-A2 索引 ＋ B1-B2 索引 ＋ `Ability` 参考页 ＋ `Past ability` 课页）** |
| **3** | **Murphy 双册 TOC 连续第二批未取到**：`cambridge.org` 403、`archive.org` 不可达、本机 `/tmp/murphy_int.html` 实测是 503 Cloudflare 错误页（1304 字节） | **中**——`had better` 的「课程位 = 无」**只靠 BC 单源**；**`had better` 唯一可能升 A 的路径就是 Murphy 有一个专单元** | **未核** |
| **4** | **`'d better` 缩写层是否入课** | **中**——本轮实测：`X'd` 全库 **47 处，100% 是 L169 的 `I'd`**（`You'd`／`He'd`／`She'd`／`We'd`／`They'd` **全 0**）。**跨源逐字 "We normally shorten it to 'd better in informal situations"，且 4 条 `Not:` 里有 2 条直接写在缩写形上（`Not: I'd better to go now.`／`Not: … she'd better work …`）** | **建议主理人裁决**：若首课上缩写形，须与 L169 的 `I'd`（`I would`）做「同一个 `'d` 两种展开」的显式对照；**若只上全形，则 4 条 `Not:` 里有 2 条用不上** |
| **5** | `letmeenglish.com/countable-uncountable/` 是否含 `several` | 低——**`several` 本批不排**；若后续排 `several`，须补核 | **未核** |
| **6** | **BC `Conditionals: zero, first and second`（`as long as`／`even if` 的落点）与 BC `Unreal time`（`as if` 的落点）本轮未逐字复核** | 低——**两项本批均不排**；批三十一记录已逐字给出 | **沿用批三十一记录** |
| **7** | `hurry` 在库词频；`rest now` 组合是否已作为某课 target | 低——仅影响备选句选择，不影响档位 | **未核** |
| **8** | **`whole` 的 `whole` 副词用法**（Cambridge 逐字 "**We also use whole as an adverb:**" `He took the cake and swallowed it whole.`） | 低——**建议不作考点**（零基础线不友好，且我方无 `swallow` 等零件） | 已知，**建议不教** |
| **9** | `as long as` 的 Murphy U115 三词共用（沿批二十四／二十五／二十七记录） | 低——本批不排 | **未核** |
| **10** | **本报告 §6 的目标句均为「候选」**，未做 D 层（本课未教词）实跑校验 | **中**——**我方有守卫测试 `D 层必须为 0`（`grammarLessons.test.ts`）**，**落课时必须跑 `cumulative.ts` 口径的实算** | **建议落课前置** |

---

## 附录 A：本批跨源 URL 与 title 核对表（可复跑）

**Cambridge 语法页**（`dictionary.cambridge.org/grammar/british-grammar/…`，全部 200 且已核 title）：`had-better`＝`Had better` ｜ `whole`＝`Whole` ｜ `all-or-whole`＝`All or whole ?` ｜ `so-that-or-in-order-that`＝`So that or in order that ?` ｜ `as-long-as-and-so-long-as`＝`As long as and so long as` ｜ `as-if-and-as-though`＝`As if and as though` ｜ `be-expressions-be-able-to-be-due-to`＝`Be expressions ( be able to, be due to )` ｜ `contractions`＝`Contractions` ｜ `modality-other-modal-words-and-expressions`＝`Modality: other modal words and expressions`（**`had better` 0 命中**）｜ `all`＝`All` ｜ `quantifiers`＝`Quantifiers`（**类目清单无 `several`**）｜ `easily-confused-words`＝`Easily confused words`（**无 `Better?` 条目**）｜ `even`＝`Even`。
**⚠️ 四类 slug 陷阱实测**：`/better` → 200 但 title 是 `Had better`（**`article.di` md5 与 `/had-better` 完全相同**）；`/had-better-or-would-rather` → 200 但 title 是 `Had better`；`/even-if` → 200 但 title 是 `If`（**不是独立页**）；**`/several` → 302 回语法总入口（无此页）**。

**Cambridge 词典**（`dictionary.cambridge.org/dictionary/english/…`，badge 实读）：`whole`＝`WHOLE`（`A2`／`C2`／`B1`）｜ `several`＝`SEVERAL`（`A2`）｜ `had-better`＝`SOMEONE HAD BETTER DO SOMETHING`（`A2`）｜ `able`＝`ABLE`（`A2`／`C2`）｜ `better`＝`BETTER`（`A1`×2／`A2`×2；23 处 `had better` 全在交叉引用块）｜ `as-long-as`＝`AS LONG AS`（**badge 空**，释义只有 `if:`）｜ `even-if`＝`EVEN IF`（`B2`）｜ `as-though`＝`AS THOUGH`（`B2`）｜ **`as-if` → 200 但 title 是 `AS IF!`（感叹条目，非目标义）** ｜ **`so-that` → 302（无独立条目）**。
**Oxford**（`oxfordlearnersdictionaries.com/definition/english/…`）：`whole_1`（`a2`／`b2`×2）｜ `several_1`（`a2`）｜ `able_1`（`a2`／`c1`）｜ **`had-better` → 404**。

**BC**（`learnenglish.britishcouncil.org/free-resources/grammar/…`，WebFetch）：`a1-a2`＝A1-A2 **18 课全目** ｜ `b1-b2`＝B1-B2 **36 课全目** ｜ `english-grammar-reference/suggestions-obligations`＝`Suggestions and obligations`（**`had better` 仅在一条用户评论里**）｜ `…/quantifiers`＝`Quantifiers`（**`whole` 0 命中；`several` 在 count-noun 名单**）｜ `…/ability`＝`Ability`（**正文 `able to` 0 命中**）｜ `b1-b2/past-ability`＝**`Past ability`**（B1／B2；**主线是 `could`**）｜ `b1-b2/modals-permission-obligation`（**`had better`／`should` 均 0 命中**）。

**中文侧**：`letmeenglish.com/had-better-it-is-time/`（200）｜ `letmeenglish.com/you-had-better/`（200）｜ `letmeenglish.com/can-could-be-able-to/`（200，**修正批三十一的「中文侧零」**）｜ `english.cool/quantifiers/`（200，**`whole` 独立小节 ＋ `all / whole 比較` 小节；`several` 0 命中**）｜ `english.cool/even-though/`（200，**两条明文 ❌**）｜ `english.cool/so-that/`（200）｜ `english.cool/as-long-as/`（200）。
**404 组**：`english.cool/{had-better,whole,several,even-if,as-if,as-though}/`＝`Page not found – 英文庫`；`letmeenglish.com/{several,whole,be-able-to,as-long-as,even-if}/`＝`Page not found`；`letmeenglish.com` **sitemap 965 URL 逐条核过**，`had better` 族 2 篇、**无 `whole`／`several`／`as if` 专文**。

## 附录 B：本批我方数字复算口径

**数据源**：`/Users/liujun/Documents/英语听写/src/data/{grammarLessons,huntCases,grammarSeasons}.ts`（**2026-09-21 01:09 快照**）。

**复算脚本**（本批新建，可复跑）：`deliverables/product-strategy/working/tmp32/final.ts`
运行：`node_modules/.bin/vite-node deliverables/product-strategy/working/tmp32/final.ts`

**口径**：**词边界**（正则 `(?<![A-Za-z])WORD(?![A-Za-z])`，大小写不敏感），**统计对象为整课 JSON 序列化文本**（含 `oneLineRule`／`examples`／`contrast`／`variants`／`guided`／`practice`／`recall`／`deepDive`）。

| 词 | GL 总 | HC 总 | 分布（前 3） |
|---|---|---|---|
| `better` | **83** | 7 | L76:58 ／ L78:8 ／ L131:8 |
| `had better` | **0** | **0** | — |
| `whole` | **0** | **0** | — |
| `several` | **0** | **0** | — |
| `able` | **0** | **0** | **⚠️ 子串口径 49 处假阳性（`table` 48／`uncountable` 1）** |
| `so that` | **1** | 0 | **L102:1（`So that was last night!`，结果义，非目的义）** |
| `as long as` | **0** | **0** | — |
| `even if` | **0** | **0** | — |
| `as if` | **0** | **0** | — |
| `should` | 174 | 11 | L47:77 ／ L49:69 ／ L168:10 |
| `must` | 119 | 13 | L16:76 ／ L47:15 ／ L161:9 |
| `need` | 71 | 11 | L161:64 |
| `all` | 127 | 19 | L151:72 ／ L157:25 ／ L152:20 |
| `X'd`（`I'd`／`You'd`／…） | **47** | **0** | **L169:47（100% 是 `I'd`；其余 5 种全 0）** |

**结构**：课 **169**（`number` 1–169 连续，无重复）｜案 **178**｜季 **33**（`season-1` … `season-33`，末季 `min: 166, max: 169`）。**⚠️ 我方守卫约束（落课时必须满足）**：每课练习 ≥4 题且含否定/疑问变体；**D 层必须为 0**（练习答案的每个词都要在本课或此前教过）；`grammarLabel`／`oneLineRule`／`summary.rule` 不得含 `GRAMMAR_ZERO_TERMS` 里的 29 个术语。

---

> 本报告由产品战略团队 AI 协作生成（竞析 · 第三十二批），重要决策请由产品负责人审定。
