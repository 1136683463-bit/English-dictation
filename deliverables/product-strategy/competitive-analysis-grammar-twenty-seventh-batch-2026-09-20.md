# 竞品/跨源分析 · 语法线「小美的一天」第二十七批

> **作者**：竞析（产品战略团队 · 竞品/跨源分析师）
> **日期**：2026-09-20
> **我方现状**：**152 课（L1–L152）、161 案、26 季**（本轮实测：`src/data/grammarLessons.ts` 逐字解析得 **152** 个 lesson 对象；`number` 字段 1–152 连续无缺）
> **最近批次**：批二十四 `too`/`either`｜批二十五 `both`/`neither`｜批二十六 `all`/`every`（收口 L147／L150、正课 L145–146／L148–149／L151–152）
> **本批四条轴**：A 让步与条件链（已连押三批）｜B「都」家族否定侧｜C 时间副词家族｜D `whether`/`since`
> **档位口径（沿用前批，未改）**：**A 档**＝跨源有**课程位**（教材独立单元/课时）＋我方有缺口；**B 档**＝跨源**有规则页但无课程位**，或须造词但成本可控；**B−**＝介于 B 与 C 之间；**C 档**＝只有零散例句；**D 档**＝跨源基本不收

---

## §0 本轮新增的本地实证（先立口径，后文全部引用它）

### 0.1 我方缺口（本轮实测，逐词计数）

**方法**：以 `src/data/grammarLessons.ts`（28808 行）按 `id: "lesson-…", number: N` 切成 152 块，块内做词边界计数；对照文件 `src/data/huntCases.ts`（161 案）。

| 候选词 | GL（课内） | HC（案内） | 出现在哪些课 | 判定 |
|---|---|---|---|---|
| `none` | **0** | **0** | — | **真零** |
| `nobody` | **0** | **0** | — | **真零** |
| `no one` | **0** | **0** | — | **真零** |
| `nothing` | **71** | **5** | **L83 / L84 / L85 / L86** | **已教**（L84 正课 `There is nothing in the box.`） |
| `ago` | **0** | **0** | — | **真零** |
| `yet` | **0** | **0** | — | **真零** |
| `already` | **2** | **0** | **L54（1，注释性复现）／L120（1，对白 `You are already up!`）** | **认读级，未成课** |
| `still` | **1** | **0** | **L56（1，`still in + 月份` 的动词用法，非「还」义）** | **非本篇义** |
| `just` | **4** | **0** | **L24（3，`just` 作「刚刚」的认读提示）／L126（1，对白 `I just ran a race!`）** | **认读级** |
| `whether` | **0** | **0** | — | **真零** |
| `since` | **0** | **0** | — | **真零** |
| `unless` | **0** | **0** | — | **真零**（沿批二十五/二十六） |
| `in case` | **0** | **0** | — | **真零**（沿批二十五/二十六） |
| `though`（独立词） | **0** | **0** | — | **真零** |

> **⚠️ 逐字纠正一条历史记录**：批二十五/二十六两轮的 `though` GL 计数里含 `although` 的**子串误命中**。本轮用 `(?<![A-Za-z])though(?![A-Za-z])` 严格边界重算，**独立 `though` ＝ 0**；`although` 出现在 L139（18 次）／L140／L141，属已教内容。**后文凡涉 `though` 一律以「0」为准。**

### 0.2 对比卡的**真实结构**（本轮最重要的口径修正）

前批（含批二十六）一律把「6 条对比卡」当成「6 条都要是**新错例**」。**本轮实测 152 课的 `contrast` 数组，逐课统计「新错例数 / 双正解复现数」**：

| 结构（新错例, 双正解复现） | 课数 | 代表课 |
|---|---|---|
| **(3, 3)** | **53 课** | **L139–L152 全部 14 课**（逐课核过） |
| (6, 0) | 41 课 | 早期课（L1–L2 等） |
| (2, 4) | 36 课 | 中期课 |
| (4, 2) | 13 课 | 各章**收口课**（L141／L144／L147／L150 实测均为 (4,2)） |
| (5, 1) | 9 课 | 过渡课 |

**结论（贯穿全篇的判据）**：**近 14 课（L139–L152）的稳定配方是「3 条新错例 ＋ 3 条双正解复现」**。**这一条直接改写了 §2 的答案**——`unless` 的新错例门槛**不是 6 条，而是 3 条**；另 3 条是**回流老课**的双正解卡（如 L149 回流 L83／L146，L151 回流 L11／L7／L148）。**批二十六「6 条全须跨源」的标准是错的，主理人用「❌will 两条」否掉方案在方向上对，但门槛算错了。**

### 0.3 ❌will 规则的已教次数（主理人论据复核）

**方法**：扫全部 152 课，找 `wrongMark` 字段含 `will` 的对比卡。

| 课 | 题目 | 被判错的片段 |
|---|---|---|
| L12 | 明天要画画（`will` 正课） | `wills` / `not will` |
| L29 | 我打算去看电影 | `will going` |
| **L48** | **如果下雨就不去（`if` 正课）** | **`will rain`** |
| **L49** | 你应该试试（收口） | **`will rain`** |
| **L109** | 我一直等到雨停 | **`will`** |
| **L142** | 我一写完就来吃 | **`will`** |
| **L143** | 那段时间和那一刻 | **`will`** |
| **L144** | 时间家族排一行（收口） | **`will` ×2** |

**主理人说的「7 课」（L47/48/49/109/142/143/144）本轮实测得 8 课命中（多出 L12／L29，但 L12 是 `will` 正课自身、L29 是 `will going to` 混形，非同一规矩）。** 就「从句里不请 will」这一条规矩本身，**L48（正课）→ L109 → L142 → L143 → L144（收口）共 5 课直接教过，L49 复现过 1 次** ⇒ **主理人结论成立：这是第 7–8 次应用**。**「一课一增量」红线在这里确实被踩。**

---

## §1 逐候选档位判定

### 1.1 轴 A 候选

| 候选 | ① 跨源证据（逐字＋来源） | ② 课程位 | ③ 规则页 | ④ 档位 | ⑤ 理由 |
|---|---|---|---|---|---|
| **`unless`** | **Cambridge `Unless` 页**（面包屑逐字 `Grammar > Words, sentences and clauses > Conjunctions and linking words > Unless`）：**逐字 "We use the conjunction unless to mean 'except if'."**；**逐字 "Unless is a conditional word (like if), so we don't use will or would in the subordinate clause"**；**专节 `Unless and if … not` 逐字 "both mean 'except if'"**；**typical errors 两条逐字**："**We don't use unless when we mean if**"（对比例 `Pete will drive if Alex can't.`）／"**We don't use will or would in the clause after unless**"（对比例 `Unless you pay now, …`／`Not: Unless you'll pay now …`）；**Warning 框逐字** "In speaking, we use unless to introduce an extra thought or piece of information"；**逗号规则逐字** "When unless comes before the main clause, we use a comma"；**Cambridge `Conditionals: other expressions` 页两条逐字禁用**："**We don't use unless for impossible conditions**"／"**We don't use unless and if together**"（❌`unless if it rains`）；**Cambridge 词典 `unless` 逐字 `B1`**；**Oxford `unless` `cefr="b1"`**；**中文侧 `english.cool/unless/`（本轮实测 200）独立专文**，逐字 "**Unless 的中文意思就是「除非…否則…」或「如果不…就…」**"／"**Unless 後面一定是肯定句，否則會出現「雙重否定」的問題**"／"**unless 不能出現在疑問句中**" | **✅ 有**（**Murphy 中级 U115 标题逐字 `115unlessaslongasprovided`**——**三词共用一格**） | **✅ 有且厚**（Cambridge 独立页 3 节 ＋ 2 条 typical errors；第二页再补 2 条 Warning；中文侧独立专文 3 条 ❌） | **A−** | 四项齐备（独立规则页＋中文专文＋典型错误＋上游单元位）。**不写满 A 的唯一理由是课程位三词共用** |
| **`in case`** | **Cambridge `In case (of)` 页**（面包屑逐字 `Grammar > Verbs > Conditionals and wishes > In case (of)`）：**逐字 "In case is a conjunction or adverb. In case of is a preposition."**／"**We use in case to talk about things we should do in order to be prepared for possible future situations**"／"**We use in case of + noun to mean 'if and when something happens'**"；**核心禁忌逐字 "We don't use in case to mean 'if'."**；**例句逐字** `Let's take our swimming costumes in case there's a pool at the hotel.`／`I'll take cash in case we need it on the ferry.`／`She knows she's passed the oral exam, but she doesn't want to say anything just in case.`（副词用法）；**BC `conditionals-zero-first-second`（B1／B2）逐字** "It is also common to use this structure with unless, as long as, as soon as or in case instead of if."（**无独立小节**）；**中文侧连续两轮实证为零**：`english.cool/in-case/` **404**、`letmeenglish.com/in-case/` **404**（批二十六）；**本轮新增**：`english.cool` **855 条 slug 全索引**（`/tmp/ec_slugs.txt`）**无 `in-case`** ⇒ **中文侧三度为零**；**Cambridge 词典 `in case` 条目四度实取失败**（返回 `referee`） | **✅ 有**（**Murphy 中级 U114 标题逐字 `114incase`——独占一格**） | **✅ 有**（Cambridge 独立页 2 节） | **B＋** | 课程位是本轴最干净的（U114 独占单元），**但中文侧连续三轮为零** ⇒ 零基础脚手架 100% 自造；**规则层只有两条硬增量**（≠if；+of＝介词）⇒ **撑 1 课，撑不住 2 课** |
| **`though`（让步义）** | **BC `contrasting-ideas-although-despite-others`（B1／B2）逐字** "**Though can be used in the same way as although.**"；**同页逐字** "Although, even though, in spite of and despite are all used to link two contrasting ideas"；**逐字** "**Even though is slightly stronger and more emphatic than although.**" | **✅ 有**（**Murphy 中级 U113 标题逐字 `113althoughthougheventhoughinspiteofdespite`**——五词共用一格） | **✅ 有**（BC 参考页；Cambridge `Although or though?` 页） | **C** | **跨源逐字自认「同法」**（in the same way as although）⇒ **纯同义换词**；**我方独立 `though` GL 0**，但与 L139–L141 已教的 `although` 是**同一张脸** |
| **`though`（句尾义）** | **BC 同页逐字** "**Though can also go at the end of the second phrase. This way of expressing contrasting ideas is most common in spoken English.**"（无独立标题层级） | **共用**（U113 同一格） | **⚠️ 无独立页**（仅在 `although/even though` 页内一句话＋1 例 `People still do it, though.`） | **C** | 跨源只给「一句话＋1 例」，**附注级** |
| **`even though`** | **BC 逐字 "Even though is slightly stronger and more emphatic than although."**；**Cambridge `Even though and even if` 页** | **共用**（U113 同一格） | **✅ 有**（Cambridge 独立对比页） | **B** | 独立规则页有，**但增量只有「强度」一条**；且**中文侧专文主体是 `even though` vs `even if`（条件 vs 事实），不是我方现能承载的语义场** |
| **`in spite of`／`despite`** | **BC 逐字 "After in spite of and despite, we use a noun, gerund (-ing form of a verb) or a pronoun."** vs **"After although and even though, we use a subject and a verb."**；**BC 逐字 "In spite of = despite"**；**Cambridge `In spite of and despite` 独立页** | **共用**（U113 同一格） | **✅ 有**（Cambridge 独立页） | **B** | **两者共享一条规则（接名词/-ing）且共享 U113 一格**；差异只在「接什么成分」⇒ **半新（换形）** |

### 1.2 轴 B 候选

| 候选 | ① 跨源证据（逐字＋来源） | ② 课程位 | ③ 规则页 | ④ 档位 | ⑤ 理由 |
|---|---|---|---|---|---|
| **`none`** | **Cambridge `No, none and none of` 页**（面包屑逐字 `Grammar > Nouns, pronouns and determiners > Quantifiers > No, none and none of`）：**逐字 "No, none and none of indicate negation."**；**逐字 "None is the pronoun form of no. None means 'not one' or 'not any'."**；**两节逐字** `None`／`None of`；**Warning 框逐字** "**We don't use none where we mean no one or nobody.**"（正例 `luckily no one was injured.`）；**Warning 框逐字** "**We don't use none of when there is already a negative word.**"（正解 `She doesn't remember any of us.`）；**Warning 框逐字** "**Use neither of rather than none of with two things.**"；**典型错误逐字** "**We don't use none directly before nouns. We use no + noun or none of + noun.**"（❌`None children in my group …`）；**单复数逐字** "When none is the subject, the verb is either singular or plural depending on what it is referring to."（`None ever comes.`／`None ever come.`）；**Cambridge 词典 `none` 逐字 `B1`**；**Oxford `none` `cefr="a2"`**；**中文侧**：`english.cool/none/` **404**，**但 `english.cool/quantifiers/`（本轮实测 200）含独立小节**，逐字 "**none 為 not one 的合併，表示「一個都不…」**"／"**none 後面若需要接名詞，就要使用 none of，表示在某個範圍內的對象「都不…」**"／"**no 跟 none 都有「全無」的意思…none 會強調在某個範圍內都不…，no 則沒有限定範圍**"＋**一节 `no / none 比較`** | **✅ 有**（**Murphy 初级 U77 标题逐字 `77not+anynonone`**——**四词共用一格**；**Murphy 中级 U86 标题逐字 `86no/none/any nothing/nobodyetc.` 第一行 `no/none/any`**；**Murphy 中级 U88 标题逐字 `88all/allofmost/mostofno/noneofetc.`**） | **✅ 有且厚**（Cambridge 独立页 ＋ 3 条 Warning ＋ 1 条典型错误 ＋ 中文侧 `quantifiers` 专节） | **B＋** | **课程位 3 处但全部共用**（U77 四词／U86 两行／U88 四词）；**规则页是轴 B 最厚的**；**CEFR 分裂**（Cambridge B1 vs Oxford A2）⇒ 对零基础偏难 |
| **`no one`** | **Cambridge `No one, nobody, nothing, nowhere` 页**（面包屑逐字 `Grammar > Nouns, pronouns and determiners > Pronouns > No one, nobody, nothing, nowhere`）：**逐字** "These four words are indefinite pronouns… to refer to an absence of people, things or places."；**专节 `No one or nobody?` 逐字** "**Nobody is a little less formal than no one**"＋"**no one is preferred in writing**"；**拼写逐字** "no one or no-one but not noone"；**专节 `Nobody or not … anybody, etc.`**；**典型错误逐字** "Not: Not anything will make me change my mind."／"Not: I can't do nothing."／"Not: She talks to hardly no one."；**例句逐字** `Nobody ever goes to see her. She's very lonely.`／`No one remembers the titles of the books they've read.`／`I knew nobody at the party.`／`She told no one, not even her mother.`；**Cambridge 词典 `no one` 逐字 `A2`**；**Oxford `no one` `cefr="a1"`**；**中文侧**：`english.cool/nobody/` 与 `no-one/` 均 **404**；**855 条 slug 全索引内无 `nobody`／`no-one`** | **⚠️ 有但**：**`nobody`／`no one` 在 Murphy 两册均无独立单元**——**只作为中级 U86 标题第二行的 `nothing/nobody etc.` 出现** | **✅ 有**（Cambridge 独立页 ＋ 3 条典型错误） | **B** | **有规则页、无独立课程位**（与 `nothing` 挤在 U86 第二行）；**CEFR A1/A2 友好** |
| **`nothing`（对照）** | **Cambridge 同页**（与 `no one` 共页） | 同上（U86 第二行） | ✅ | **已教（L84）** | **我方 L84 正课逐字 rule**："说「什么也没有」用 nothing——**它自带「不」**，句子里不再请 not"；**深挖卡逐字** "**nothing 和 not 不同台**"／"I don't have anything——not + anything，**两个「不」其实是一个意思的两种说法**" ⇒ **`nothing` 已经把「自带不＋不再请 not」这条规矩教掉了** |

### 1.3 轴 C 候选

| 候选 | ① 跨源证据（逐字＋来源） | ② 课程位 | ③ 规则页 | ④ 档位 | ⑤ 理由 |
|---|---|---|---|---|---|
| **`ago`** | **Cambridge `Ago` 页**（面包屑逐字 `Grammar > Adjectives and adverbs > Adverbs > Time adverbs > Ago`）：**逐字定义** "a period of time that is completed and goes from a point in the past up to now."；**位置逐字 "Ago follows expressions of time:"**（❌`Not: They arrived in Athens ago six weeks.`）；**Warning 框逐字** "**We normally use ago with the past simple. We don't use it with the present perfect:**"（✔`I received his letter four days ago.`／❌`Not: I have received his letter four days ago.`）；**对比段逐字** "for duration, we use **for** (not ago)"（例 `When I was at school, I studied Russian for five years.`）／"we use **before or earlier or previously**"（指过去某点之前）；**Cambridge 词典 `ago` 逐字 `A2`**；**Oxford `ago` `cefr="a1"`**；**中文侧 `english.cool/ago/` 本轮实测 404**，**855 条 slug 全索引内无 `ago`**（相邻的 `before-ago`／`ago-before` 亦 404） | **✅ 有**（**Murphy 初级 U19 标题逐字 `19forsinceago`**——**三词共用一格**；**U19 前接 U18 `Howlonghaveyou…?`，后接 U20 `IhavedoneandIdid`，零间隔**） | **✅ 有**（Cambridge 独立页 ＋ 1 条 Warning 含双例对比） | **B＋** | **课程位在初级 U19（三词一格）**；**规则页虽独立但只有「位置＋时态」两条**；**CEFR A1/A2 友好**；**中文侧为零** |
| **`yet`** | **Cambridge `Yet` 页**（面包屑逐字 `Grammar > Words, sentences and clauses > Conjunctions and linking words > Yet`）：**8 个小节逐字** `Yet as an adverb`／`Yet with negative statements`／`Yet with questions`／`Yet with affirmative statements`／`Yet with superlatives`／`Yet as a conjunction`／`Yet for emphasis`／`As yet`／`Have yet to and be yet to`；**逐字** "mostly in negative statements or questions in the present perfect"＋"**It usually comes in end position.**"；**Warning 框逐字** "**We don't use yet to refer to something that has happened. We use already**"；**另页 `Already, still or yet?` 逐字** "Already = things which have happened or may have; **Yet = things which have not happened or may not have**"；**Cambridge 词典 `yet` 逐字 `A2`**；**Oxford `yet` `cefr="a2"`（＋`b2`）**；**中文侧 `english.cool/yet/`（本轮实测 200）独立专文**，页题逐字「「yet」正確用法是？ 一次搞懂 yet 的 5 種用法！」，**5 节逐字**：`至今、迄今`／`還沒、尚未`／`better yet`／`yet another`／`然而、卻` | **✅ 有**（**Murphy 初级 U16 标题逐字 `16I'vejust… I'vealready… Ihaven't…yet (presentperfect2)`**——**三词共用一格**；**Murphy 中级 U111 标题逐字 `111stillanymoreyetalready`**——**四词共用一格**）**＋ BC 独立课**（`present-perfect-just-yet-still-already`，**B1／B2**） | **✅ 有且厚**（Cambridge 独立页 9 节 ＋ 1 条 Warning ＋ 对比页；**BC 独立正课**；中文侧独立专文） | **A−** | **跨源课程位＋规则页四源齐备（Murphy 两册＋BC 正课＋Cambridge＋中文专文）**——**但前提是我方有现在完成时** |
| **`already`** | **Cambridge `Already, still or yet?` 页**（面包屑逐字 `Grammar > Easily confused words > Already, still or yet?`）：**3 节逐字** `Already or yet?`／`Already, yet or still?`／`Negatives with already, still, yet`；**逐字** "Already: used for things that have happened (or may have happened) before the moment of speaking"；**位置对比逐字**（Warning 段）"**yet usually goes after the main verb; still usually goes after the subject**"（`I haven't finished yet.` vs `I still haven't finished.`）；**BC 逐字** "Already can come between the auxiliary and the main verb or at the end of the clause."；**Cambridge 词典 `already` 逐字 `A2`／`B1`**；**Oxford `already` `cefr="a2"`（＋`b1`）**；**中文侧 `english.cool/already/`（本轮实测 200）独立专文**，逐字 "**Already 的意思就是「已經」、「早已」**"＋**分时态四节**（過去完成式／現在完成式／過去簡單式／現在簡單式與現在進行式） | **✅ 有**（**Murphy 初级 U16 三词一格**；**Murphy 中级 U111 `stillanymoreyetalready` 四词一格**）**＋ BC 独立课** | **✅ 有**（Cambridge 对比页 ＋ BC 正课 ＋ 中文侧独立专文） | **A−** | 同 `yet`。**我方已有非成课的 2 处痕迹**（L54 注释／L120 对白）⇒ **认读基础比 `yet` 好** |
| **`still`** | **Cambridge `Already, still or yet?` 页逐字** "**Still refers to the continuation of a situation**"（例 `I still meet my friends from my schooldays now and then.`，并明文标注 ❌`I already meet my friends`／❌`I yet meet my friends`）；**逐字** "**Negatives with still: situation should have changed but hasn't**"（`I still haven't found my passport.`）；**对比表逐字**（`Is your sister still at university?`／`…at university yet?`／`…already at university?` 三问三答）；**BC 逐字** "**Still comes between the subject (the bus, they, etc.) and auxiliary verb (haven't/hasn't).**"；**Cambridge 词典 `still` 逐字 `A2`／`B1`**；**Oxford `still` `cefr="a1"`**；**中文侧 `english.cool/still-yet-already/`（本轮实测 301→200）独立专文**，逐字 "**still 是「仍然、還是、依舊」**"／"**用來表示「某個狀況仍然在持續中，並未停止或改變」**"＋**专节「still 用於現在完成式」**（逐字 "則較常以「否定」的形式出現"／"強調這件事是「說話者預期早就應該完成，但實際上還沒完成的」"） | **✅ 有**（**Murphy 中级 U111 四词一格**；**初级 U95 标题逐字 `95stillyetalready`**——**三词共用一格，独立于 U16**）**＋ BC 独立课** | **✅ 有** | **A−** | **比 `yet` 多一个课程位**（初级 U95 是 `still yet already` 的合并单元，与 U16 分开）——**这是本轴课程位最硬的一处** |

### 1.4 轴 D 候选

| 候选 | ① 跨源证据（逐字＋来源） | ② 课程位 | ③ 规则页 | ④ 档位 | ⑤ 理由 |
|---|---|---|---|---|---|
| **`whether`** | **Cambridge `Whether` 页**（面包屑逐字 `Grammar > Words, sentences and clauses > Conjunctions and linking words > Whether`）：**4 节逐字** `Whether in indirect questions`／`Whether … or`／`Whether … or not`／`Typical errors`；**定义逐字 "Whether is a conjunction."**；**逐字** "We can't leave out whether (or if)."／"**We don't use either in indirect questions.**"；**第三条典型错误逐字** "**We use whether, not if, before a to-infinitive**"（✔`I'm not sure whether to get a new laptop.`／❌`if to get`）＋拼写警告（不写作 weather／wheter／wheather／wether）；**另页 `If or whether?` 逐字三禁**："**whether, not if, before to-infinitives**"／"**whether, not if, directly before 'or not'**"／"**whether, not if, after prepositions**"；**BC `reported-speech-questions`（B1／B2）逐字** "These use **if** or **whether** to report the question, with **if** being more common."；**Cambridge 词典 `whether` 逐字 `B1`**；**Oxford `whether` `cefr="b1"`**；**中文侧 `english.cool/whether/`（本轮实测 200）独立专文**，页题逐字「「whether、whether or not 」正確用法是？」，**两大用法逐字**：「是否」引導名詞子句（當主詞／補語／同位語／受詞）＋「不管…/不論…」 | **⚠️ 无独立课程位**。**Murphy 初级／中级 TOC 归一化全文（13966／11016 字符）内 `wheth` 零命中**（本轮逐字复核 3 个文件均 0）；**中级只有 `25whenIdoandwhenI'vedoneifandwhen`／`38ifIdo…andifIdid…`／`39ifIknew…IwishIknew…`** ⇒ **`whether` 全书无单元**；**BC 只在 B1-B2 的转述问句课内作为 `if` 的并列项出现（无独立小节）** | **✅ 有**（Cambridge 独立页 ＋ 对比页 ＋ 3 条典型错误；BC 一节） | **D＋** | **四轴里唯一「上游教材无课程位（Murphy 两册全无）」的候选**；**且 BC 把它压在 B1-B2、Cambridge 词典标 B1 ⇒ 对零基础明显超纲** |
| **`since`** | **Cambridge `Since` 页**（面包屑逐字 `Grammar > Words, sentences and clauses > Conjunctions and linking words > Since`）：**7 节逐字** `Since: time`／`Since and tenses`／`Since + -ing`／`Since, since then`／`Since: reason`／`Since: typical errors`；**逐字** "refer back to a previous point in time"；**时态逐字** "we can use the past simple or present perfect after since and **the present perfect in the main clause**"（`They haven't received any junk mail since they moved house.`）；**逐字** "It's been years since I rode a bike."；**典型错误逐字三禁**：不用 `since` 于**长度**（`She was waiting for four hours.` ❌`since four hours`）／`since` 不用 `once` 表原因／**"Use since, not ago, after 'it's a long time'"**；**Cambridge 词典 `since` 逐字 `A2`／`B1`／`B2`**；**Oxford `since` `cefr="a2"`**；**中文侧 `english.cool/since/`（本轮实测 200）独立专文**，逐字 "**since 是「自從」的意思，表示「某個情況從過去的某時間開始，就一直持續著」**"／"**since 前面的主要子句會用「現在完成式」來表示**"＋第二节「since 既然、因為」 | **✅ 有**（**Murphy 中级 U12 标题逐字 `12forandsincewhen…?andhowlong…?`**——**共用格**；**Murphy 初级 U19 标题逐字 `19forsinceago`**；**初级 U104 逐字 `104from…tountilsincefor`**） | **✅ 有**（Cambridge 独立页 ＋ 3 条典型错误；中文侧独立专文） | **C＋** | **课程位三处但全部共用**；**且规则的承重墙是「现在完成时」（主句必须 have done）——那是我方 L21–L24 教过的内容，但 `since + 从句 + 现在完成主句` 是复合结构（两件已教的东西拼一张新脸）** |

---

## §2 轴 A 专项（本轮最关键）：去掉 ❌will 之后，`unless` 还剩几条？

### 2.1 直接回答

**批二十六给 `unless` 列的 6 条对比卡，逐条对照本轮的 ❌will 审计（§0.3），结果是：**

| 批二十六编号 | 卡片内容 | 是不是 ❌will 规则？ | 判定 |
|---|---|---|---|
| 1 | `Unless I will hear from you, …` ✗ → `Unless I hear from you, …` | **是**（Cambridge typical errors "We don't use will or would in the clause after unless"） | **❌ 必须删** |
| 2 | `Unless the weather will get better, …` ✗ → `… gets better …` | **是**（中文侧同一条规则的另一例） | **❌ 必须删**（与 #1 同规矩，双重撞车） |
| 3 | `Pete will drive unless Alex can't.` ✗ → `Pete will drive if Alex can't.` | **否**——这是 **`unless` ≠ `if`** 的语义禁用 | ✅ 保留 |
| 4 | `We'll go to the coast tomorrow unless if it rains.` ✗ | **否**——这是 **`unless` ＋ `if` 不能连用** | ✅ 保留 |
| 5 | `What will you do unless you get the loan?` ✗ → `… if you don't get the loan?` | **否**——这是 **`unless` 不能用于疑问句** | ✅ 保留 |
| 6 | `I don't know what we would have done unless we'd seen you.` ✗ → `… if we hadn't seen you.` | **否**——这是 **`unless` 不用于「已知为真」** | ✅ 保留 |

> **⚠️ 但第 6 条的跨源出处需更正**：批二十六把这条挂在 Cambridge 逐字 "We don't use unless for things that we know to be true" 之下。**本轮逐字复核该句的完整上下文**，Cambridge 原文是："**We don't use unless for things that we know to be true:** You won't be able to get a ticket for the match unless you're prepared to pay a lot of money for it. (The speaker doesn't know if you're prepared to pay a lot of money for a ticket.)"——**它给的正例是 `unless … prepared to pay`，而 `I don't know what we would have done if we hadn't seen you.` 是紧接其后、属于 `Unless and if … not` 等价段的例子**。**批二十六把两个不同小节的例子与规则错配了**。⇒ **第 6 条不能算「有跨源逐字依据」，须重挂或自造。**

### 2.2 结论：**`unless` 的跨源硬增量 = 3 条（#3／#4／#5），不是 4 条，更不是 6 条**

**逐条列剩余候选（本轮重挂后）**：

| # | 对比卡（错 → 对） | 跨源依据（逐字） | 性质 |
|---|---|---|---|
| 1 | `Pete will drive unless Alex can't.` ✗ → `Pete will drive if Alex can't.` | **Cambridge `Unless` 页 typical errors 逐字** "**We don't use unless when we mean if**"＋Cambridge 原文对比例 `Pete will drive if Alex can't.` | **✔ 跨源（硬）** |
| 2 | `We'll go to the coast tomorrow unless if it rains.` ✗ → `… unless it rains.` | **Cambridge `Conditionals: other expressions` 逐字** "We don't use unless and if together"＋❌`unless if it rains` | **✔ 跨源（硬）** |
| 3 | `What will you do unless you get the loan?` ✗ → `What will you do if you don't get the loan?` | **中文侧 `english.cool/unless/` 逐字节标题** "**Unless不能出現在疑問句**"＋❌`What will you do unless you get the loan?`／✔`What will you do if you don't get the loan?` | **✔ 跨源（硬，但只有中文侧一家）** |
| 4 | `Unless the government had raised food prices, there would not have been so many protests.` ✗ → `If the government had not raised food prices, …` | **Cambridge `Conditionals: other expressions` 逐字** "**We don't use unless for impossible conditions**"＋❌ 原文 | **✔ 跨源（硬）——批二十六漏列的第四条！** |
| 5 | 「`unless` 后面出现「不」⇒ 双重否定」：`Unless you don't hurry, …` ✗ | **中文侧 `english.cool/unless/` 逐字** "**Unless 後面一定是肯定句，否則會出現「雙重否定」的問題**" | **✔ 跨源（中文侧一条，Cambridge 无对应）** |
| 6 | `Unless I'll hear from you, …` ✗ → `Unless I hear from you, …` | Cambridge typical errors "We don't use will or would in the clause after unless" | **🔴 禁区：❌will 规矩已教 5 课（L48/L109/L142/L143/L144），第 7–8 次应用** |
| 7 | 「逗号规则」：`Unless it rains we'll go for a picnic.` ✗ → `Unless it rains, we'll go …` | **Cambridge `Unless` 页逐字** "**When unless comes before the main clause, we use a comma**" | **⚠️ 半可用——但 L139/L140/L141 已把「领一整句＋逗号」教过（`Although it is raining, I will go out.`）⇒ 又撞车** |

> **⚠️ 第 4 条（不可能的条件的 `unless`）必须点明其代价**：它要求 `if + had + 过去分词 … would have + 过去分词`（**第三条件句**）。**我方全 152 课内 `have been doing`／`had done` 零命中，`if had` 零命中** ⇒ **它虽属「跨源硬增量」，但语法承载是 B2，零基础不可用**。**算上它反而是负资产。**

### 2.3 **轴 A 的实际判定**

> ## 🔴 **轴 A 不成立（本批不排期）。**

**理由链（三条独立成立，任一条即可否）**：

1. **凑不满 3 条新错例的门槛（§0.2 的真实配方）**。**去掉两条 ❌will 后，可用硬增量只剩 3 条（#1／#2／#3），第 4 条（impossible conditions）是 B2 负载、第 5 条只有中文单源、第 6 条是禁区、第 7 条撞 L139–L141。** ⇒ **3 条新错例刚好等于门槛，但其中 #3 只有中文侧一家、无 Cambridge 支撑；#5 同样只有中文侧一家。** **一条课的 3 条新错例里若 2 条是单源中文侧，强度不足以立课。**
2. **「❌will」不是可选项而是 `unless` 的招牌考点**。Cambridge `Unless` 页把它写进 **typical errors**（最高等级标注），中文专文把它做成**带 ⭕️/❌ 的独立小节**。**删掉它，`unless` 一课的三分之二教学价值随之蒸发**——**这正是主理人否决的真正含义：不是「换个说法」，是「这个知识点本身已经教过 5 遍了」。**
3. **连词家族连排疲劳已达 4 批**：L139–L141（`although`/`but`）→ L142–L144（`as soon as`/`when`）→ L145–L147（`too`/`either`）→ L148–L152（`both`/`neither`/`all`/`every`）。**再排 `unless` 就是第 5 批连词/功能词连排。**

**⇒ 轴 A 实际课量：0 课（本批）。** **`in case` 单独不成立**（§1.1：中文侧三度为零、脚手架全自造、撑 1 课已是上限，**凑不出与任何东西配对的第 2 课**）。**`even though`／`though`／`in spite of`／`despite` 全部 0 课**（§1.1 档位 C／B，且 `though` 跨源自认同法）。

**⇒ 若仍要在轴 A 上保留火种，唯一天花板是：等 `unless` 的「否定条件」与别的**非**连词内容配对时再上——但那已经是另一次立项，不在本批。**

---

## §3 轴 B 专项：`none`／`no one`／`nobody` 的课程位

### 3.1 Murphy 单元核实（线索已逐字核实 ✅，但**标题细节与你给的两条不同**）

**你给的线索**：`81allmostsomeanyno/none`／`88all/allofmost/mostofno/noneofetc.` —— **两条都对，但都不完整。本轮取到 4 处课程位**：

| 册／单元 | 标题（归一化逐字） | 上下文（逐字） | 判读 |
|---|---|---|---|
| **初级 U77** | `77not+anynonone` | `…76someandany77not+anynonone78not+anybody/anyone/anythingnobody/no one/nothing79somebody/anything/nowhereetc.80everyandall81allmostsomeanyno/none82botheitherneither…` | **✅ 课程位：`not + any` → `no` → `none`（四词一格）** |
| **初级 U78** | `78not+anybody/anyone/anythingnobody/no one/nothing` | 同上串 | **✅ 课程位：`nobody`／`no one`／`nothing` 与 `not + anybody/anyone/anything` 对照（六词一格）** |
| **初级 U81** | `81allmostsomeanyno/none` | 同上串 | **✅ 课程位（五词一格）——你给的第一条线索** |
| **中级 U86** | `86no/none/anynothing/nobodyetc.` | `…85someandany86no/none/anynothing/nobodyetc.87much,many,little,few,alot,plenty88all/allofmost/mostofno/noneofetc.89both/…` | **✅ 课程位：`no/none/any` ＋ `nothing/nobody etc.`（两行）** |
| **中级 U88** | `88all/allofmost/mostofno/noneofetc.` | 同上串 | **✅ 课程位（四词一格）——你给的第二条线索** |

> **⚠️ 三处纠正（对照你的线索）**：
> 1. **`81allmostsomeanyno/none` 是初级 U81，不是中级**；
> 2. **中级那一格是 `88all/allofmost/mostofno/noneofetc.`——它管的是 `none of` 的分量分配，不是 `none` 本身**；**`none` 本身在中级的主格是 U86 `no/none/any`**；
> 3. **`nobody`／`no one` 在中级是 U86 标题的第二行（`nothing/nobody etc.`），在初级是 U78（与 `not + anybody` 对照）——两册都不是独立单元。**

### 3.2 与 `nothing` 的关系（本轮最重要的轴 B 发现）

| 维度 | `nothing`（已教 L84） | `none`（未教） | `no one`／`nobody`（未教） |
|---|---|---|---|
| **指什么** | 东西（thing） | **一个范围里的「都不」**（人/物皆可） | **人** |
| Cambridge 同页？ | ✅ **与 `no one`／`nobody`／`nowhere` 同页** | ❌ **独立页 `No, none and none of`** | ✅ 与 `nothing` 同页 |
| Murphy 同格？ | **中级 U86 第二行**（`nothing/nobody etc.`） | **中级 U86 第一行 ＋ 初级 U77 ＋ U81 ＋ 中 U88** | **中级 U86 第二行 ＋ 初级 U78** |
| CEFR | Cambridge `A2` | **Cambridge `B1` vs Oxford `A2`（分裂）** | Cambridge `A2`／Oxford `A1` |
| 我方现状 | **71 次（L84 正课）** | 0 | 0 |

> **关键判定：`nothing` 与 `none` 不是「同一个东西的两种说法」，而是「两个不同的轴」。** `nothing` 是**东西**（thing 轴：something / anything / nothing），`none` 是**范围里的零**（quantity 轴：all / most / some / none）。**跨源把它俩分在 Cambridge 的两个不同页面、Murphy 的两行不同标题里。** ⇒ **我方 L84 教的 `nothing` 不会让 `none` 变成「重复」**——**这是轴 B 最大的好消息**。
> **但坏消息是**：**`nothing` 已经教掉了 `none` 最容易讲的那条规矩**——「**自带不，不再请 not**」（L84 深挖卡逐字："**nothing 和 not 不同台**"）。**Cambridge 给 `none` 的两条 Warning 里的第一条正是同一条**（"We don't use none of when there is already a negative word."）⇒ **`none` 一课会再次踩「同一规矩第二次应用」的边**（程度比 ❌will 轻，但同向）。

### 3.3 能否撑 1–2 课？

| 课 | 主词 | 一课一增量 | 必造词位 | 硬增量条数 | 上限 |
|---|---|---|---|---|---|
| **第 1 课** | **`none`（＋`none of`）** | 「**一个都不**」＝ not one：**`none` 单独站（代词），要接名词就必须 `none of + the/my/this`** | **1**（`none`；`no` 我方 GL 32 但**全为 `no answer` 等非量词义** ⇒ 若带 `no + 名词` 则 **2**） | **3 条硬**：① 不能直接接名词（Cambridge "We don't use none directly before nouns"＋❌`None children`）；② 已有否定词就不能再用 `none of`（Cambridge Warning）；③ **两个东西用 `neither of` 不用 `none of`**（Cambridge Warning）——**③ 直接回流 L149！** | **1 课** |
| **第 2 课** | **`no one`／`nobody`** | 「**一个人也没有**」＝ 人的零：**一个配 is（单数）**；**writing 用 `no one`、speaking 用 `nobody`** | **2**（`no one` ＋ `nobody`） | **2 条硬**：① 不用 `no`／`not`／`never`／`hardly` 之后再补（Cambridge 原文 "They are not used after no, not, never, hardly, or seldom; instead use anyone, anybody, anything, anywhere"＋❌`She talks to hardly no one`／❌`I can't do nothing`）；② **`no one` 的写法**（Cambridge "no one or no-one but not noone"） | **1 课（弱）** |

**⇒ 轴 B 能撑：1–2 课。** **我推荐 1 课（`none`）＋「`no one`/`nobody`」并入同课作对照位**——理由：第 2 课的 2 条硬增量里，第 ① 条是**「不会再有第八次」意义上的重复**（`nothing` 已教同规矩），第 ② 条是**拼写**（零基础课不设拼写考点）。**而「人 vs 物」的对照塞进第 1 课末尾，正好复用 L152 `every` 的「一个一个」壳。**

---

## §4 轴 C 专项：`ago` 与 `yet`/`already`/`still`

### 4.1 `ago` 的课程位（线索已逐字核实 ✅）

| 源 | 逐字 | 判读 |
|---|---|---|
| **Murphy 初级 U19** | 标题归一化逐字 **`19forsinceago`**；上下文逐字 **`…17Haveyouever…?(presentperfect3)18Howlonghaveyou…?(presentperfect4)19forsinceago20Ihavedone(presentperfect)andIdid(past)…`** | **✅ 有课程位——但三词共用一格（`for`／`since`／`ago`），且 U18→U19→U20 零间隔** |
| **Murphy 中级** | **`since`／`ago` 只出现在 U12 `forandsincewhen…?andhowlong…?`**（`for`＋`since` 两词）；**`ago` 在中级 TOC 零命中** | **中级无 `ago` 单元** |
| **Cambridge `Ago` 页** | 独立页（面包屑 `Grammar > Adjectives and adverbs > Adverbs > Time adverbs > Ago`）＋ **1 条 Warning 含双例** | **✅ 有规则页** |
| **BC 三档索引** | **A1-A2 18 课／B1-B2 33 课／C1 14 课，逐条核过：无 `ago` 专课**（`ago` 仅作为 `reported-speech-statements` 里的时态回退词出现） | **BC 零专课** |

> **⚠️ 你给的线索（「Murphy 初级可能有一个 `for/since/ago` 或 `past continuous` 相关单元」）——前半对：是 U19 `for since ago`（三词一格）；`ago` 与 `past continuous` 无关**（初级 U13/U14 是 `I was doing`）。

**⇒ `ago` 档位 B＋：课程位有但三词共用；规则页独立但只两条（位置＋不用现在完成）。**

### 4.2 `yet`／`already`／`still` 线（线索已逐字核实 ✅，**且比线索更强**）

| 源 | 逐字 | 判读 |
|---|---|---|
| **Murphy 初级 U16** | 标题逐字 **`16I'vejust… I'vealready… Ihaven't…yet (presentperfect2)`** | **✅ 课程位：三词共用一格** |
| **Murphy 初级 U95** | 标题归一化逐字 **`95stillyetalready`**；上下文逐字 `…94always/usually/oftenetc.(wordorder2)95stillyetalready96Givemethatbook!…` | **✅ 课程位：三词一格——`still` 的独立课程位！** |
| **Murphy 中级 U111** | 标题归一化逐字 **`111stillanymoreyetalready`**；上下文逐字 `…110Wordorder2:adverbswiththeverb111stillanymoreyetalready112even…` | **✅ 课程位：四词一格** |
| **BC（本轮新发现，前批未登记）** | **独立正课** `present-perfect-just-yet-still-already`，**页题逐字 "Present perfect: 'just', 'yet', 'still' and 'already'"**，**级别标注 "B1 Intermediate"/"B2 Upper intermediate"**；**逐字规则**：`just` "a short time before"＋"Just comes between the auxiliary verb (have/has) and the past participle."；`yet` "**only used in negative sentences and questions**"＋"Yet comes at the end of the sentence or question."；`still` "**only used in negative sentences**"＋"**Still comes between the subject and auxiliary verb**"；`already` "Already can come between the auxiliary and the main verb or at the end of the clause." | **✅ 独立课程位（BC 把它当成一课）——这是本轴最硬的一处** |
| **Cambridge 对比页** | `Already, still or yet?`（面包屑 `Grammar > Easily confused words > …`），3 节，**Warning 逐字** "We don't use yet to refer to something that has happened. We use already" | **✅ 有规则页** |
| **中文侧** | **`english.cool/still-yet-already/` 独立专文**（301→200）＋ **`english.cool/already/` 独立专文** ＋ **`english.cool/yet/` 独立专文** ＝ **本批全部候选里中文侧最厚的一条线** | **✅✅ 中文实证最厚** |

**⇒ 这条线的档位是 A−（`yet`/`already`/`still` 三词同档），但有一个硬门槛 ↓**

### 4.3 ⚠️ 硬门槛：这条线的承重墙是**现在完成时**

**跨源一致把它绑在现在完成时上**：
- **BC 逐字**："These words are often used with **the present perfect** because they are related to the present moment."
- **BC 逐字**（`yet`）："Yet comes at the end of the sentence or question."（框架全部 `Have you finished … yet?`／`I haven't finished it yet.`）
- **Murphy**：U16 在 **Present perfect 章**内；U95 在 **Word order 章**内但内容仍是 `still/yet/already`＋现在完成；**中级 U111 也在现在完成相关块附近**
- **中文侧 `english.cool/still-yet-already/` 逐字节标题**：「**still 用於「現在完成式」**」

**我方现状（关键）**：
- **我方已有现在完成时**：**L21（`have + 做过版`）／L22（`have been to`）／L23（`have + 做过版` 结果义）／L24（昨天版 vs 做过版，逐字含 "看到 just（刚刚）或不报时间，用做过版。**just 先混个脸熟，不用考**"）** ⇒ **`have done` 的骨架已教，且 L24 已明文登记 `just` 为待转正词**。
- **L53** 已教 `has been cleaned`（被动＋完成）／**L54** 有 `already` 的复现注释。
- **⇒ 门槛已过。** 这条线不需要先补现在完成时，**可以直接排**。

### 4.4 `ago` 与我方已教的「昨天版」（L10）是什么关系（**这是本轴的核心甄别**）

| 维度 | L10「昨天版」 | `ago` |
|---|---|---|
| 逐字规则 | **L10 oneLineRule 逐字** "看到 yesterday，动词就要换形状：go 的昨天版是 went。中文动词不变，英语必须变。" | **Cambridge 逐字** "used with the past simple"＋"**Ago follows expressions of time**" |
| 时态 | **过去简单式**（`went`／`ate`／`didn't go`／`Did you go`） | **过去简单式**（同） |
| 结构 | **`yesterday` 站句首或句尾**（L10 guided 逐字 "说哪一天干了啥，开头放时间点 Yesterday"） | **时间量 + `ago` 站句尾**（❌`ago six weeks` 语序禁用） |
| 中文 | 「昨天」 | 「三天前」 |
| 新东西 | — | **① 时间量前置＋`ago` 后置的语序；② 与现在完成时的禁用（❌`I have received his letter four days ago.`）；③ 与 `for`（时长）的分工** |

**⇒ 判定：`ago` ＝ 「同一时态（过去简单式）的**新语序 ＋ 新禁用**」——🟡 **半新（换位置）**，比 `though`（纯换词）强，比 `none`（新轴）弱。**增量是真的（语序＋❌完成时），但只有 2 条。**

---

## §5 轴 D 专项：`whether` 与 `since`

### 5.1 `whether`

| 维度 | 证据 | 判读 |
|---|---|---|
| **Murphy 课程位** | **初级 13966 字符／中级 11016 字符／全书 11071 字符 TOC 三份归一化文本，`wheth` 命中 0／0／0**（本轮逐字复核）；中级只有 `25whenIdoandwhenI'vedoneifandwhen`／`38ifIdo…andifIdid…`／`39ifIknew…IwishIknew…`／`40ifIhadknown…` | **🔴 无课程位——Murphy 两册全无 `whether` 单元** |
| **BC 课程位** | 只在 `reported-speech-questions`（**B1／B2**）里作为 `if` 的并列项：**逐字** "These use **if** or **whether** to report the question, with **if** being more common."（**无独立小节**） | **🔴 无课程位** |
| **规则页** | **Cambridge 独立页 `Whether`**（4 节＋典型错误）＋ **独立对比页 `If or whether?`**（逐字三禁） | **✅ 有且厚** |
| **CEFR** | **Cambridge 词典 `whether` 逐字 `B1`**；**Oxford `whether` `cefr="b1"`** | **🔴 两源一致 B1** |
| **中文侧** | `english.cool/whether/` **独立专文（200）** | ✅ 有 |
| **与已教 `if`（L48/L49）的关系** | **Cambridge `If or whether?` 逐字** "Both can report indirect yes-no questions and questions with 'or'; **if** is more common."／"**Whether** is often preferred in more formal contexts." ⇒ **两者在间接问句里可互换**；`whether` 的独立价值只在**三个禁用位**：**to-infinitives 前／`or not` 前／介词后** | **🟡 半新（换词＋三个禁区）** |
| **是否超纲** | **是。** 我方 L35–L38 教的是**疑问词（where/what/when）引导的间接问句**（L35 逐字 "问句住进句子里，要换鞋"），**`whether` 引导的是「yes-no 型」间接问句 —— 与 L35–L38 的 `wh-` 型不是同一格**；**且承重墙是「两选一／or not」** | **⇒ 超纲（B1），本批不排** |

### 5.2 `since`

| 维度 | 证据 | 判读 |
|---|---|---|
| **Murphy 课程位** | **中级 U12 标题逐字 `12forandsincewhen…?andhowlong…?`**；**初级 U19 标题逐字 `19forsinceago`**；**初级 U104 逐字 `104from…tountilsincefor`** | **✅ 有，但三处全部共用格** |
| **规则页** | **Cambridge 独立页 `Since`**（7 节＋3 条典型错误）＋**中文侧独立专文** | **✅ 有** |
| **CEFR** | **Cambridge 词典 `since` 逐字 `A2`／`B1`／`B2`（三义分列）**；**Oxford `since` `cefr="a2"`** | **A2–B2** |
| **承重墙** | **Cambridge 逐字** "we can use the past simple or present perfect after since and **the present perfect in the main clause**"；**中文侧逐字** "**since 前面的主要子句會用「現在完成式」來表示**" | **复合结构：主句现在完成 ＋ `since` ＋ 从句过去式** |
| **我方基础** | **L21–L24 已教现在完成时**（`have done`）；**L34/L95–L99 已教过去进行与过去简单式** | **两件都教过，但拼成 `since` 句是第三张脸** |
| **档位** | — | **C＋** |

> **⚠️ 一条要提醒的跨源硬点**：**Cambridge `Since` 页典型错误逐字 "Use since, not ago, after 'it's a long time'"**（正例 `It's a long time since your last letter.`）——**这条把 `since` 与 `ago` 直接绑在一起**。**若轴 C 真排 `ago`，`since` 会成为它的天然第 2 课**（Cambridge 两页互相 See also，Murphy U19 两者同格）。**这是本批唯一一条「跨轴课位链」线索，但代价是两课都要过现在完成时门槛——`ago` 只需要「不搭」，`since` 需要「一定搭」。**

---

## §6 「同义换词 vs 新结构」甄别（核心红线）

> **判据**：**新结构** ＝ 逻辑层/语法层多出一个我方零覆盖的机制；**同义换词** ＝ 同一个意思的另一种说法（只是换个词、换个体）；**半新（换形/换位）** ＝ 结构在同一格，但接的成分或位置变了。

| 候选 | 判定 | 跨源逐字证据 | 课量后果 |
|---|---|---|---|
| **`unless`** | 🟢 **新结构（本批最纯之一）** | **Cambridge 逐字 "We use the conjunction unless to mean 'except if'."＋专节 `Unless and if … not`** ——「**否定条件**」是逻辑层，不是我方任一已教句式 | **结构上新，但 3 条硬增量里 1 条 ❌will 已教 5 课 ⇒ 见 §2，本批 0 课** |
| **`in case`** | 🟢 **新结构（语义对立最干净）** | **Cambridge 逐字 "We don't use in case to mean 'if'."＋对举例** ——「**可能发生 vs 已经发生**」的对立，我方零覆盖 | **1 课封顶**（中文侧三度为零） |
| **`though`** | 🔴 **同义换词** | **BC 逐字 "Though can be used in the same way as although."** | **0 课**（与 L139–L141 的 `although` 同一张脸） |
| **`even though`** | 🟡 **半新（换强度）** | **BC 逐字 "Even though is slightly stronger and more emphatic than although."** | **0 课／最多作对照位** |
| **`in spite of`／`despite`** | 🟡 **半新（换形）** | **BC 逐字 "After in spite of and despite, we use a noun, gerund … or a pronoun."** vs **"After although and even though, we use a subject and a verb."** | **0 课** |
| **`none`** | 🟢 **新结构（新轴）** | **Cambridge 逐字 "None is the pronoun form of no. None means 'not one' or 'not any'."** ——**指代轴（一个范围里的零）与 L84 `nothing` 的「东西轴」是两条轴**（两源分页分格） | **1 课可开** |
| **`no one`／`nobody`** | 🟡 **半新（人的零）** | **Cambridge 逐字** "These four words are indefinite pronouns… absence of people, things or places."／"**Nobody is a little less formal than no one**" | **0–1 课（弱）；合并入 `none` 课更优** |
| **`ago`** | 🟡 **半新（换位置＋新禁用）** | **Cambridge 逐字 "Ago follows expressions of time:"** ＋ **"We normally use ago with the past simple. We don't use it with the present perfect:"** | **1 课（可）** |
| **`yet`／`already`／`still`** | 🟢 **新结构（新范畴：时间副词的位置与期待）** | **BC 独立正课**；**Cambridge 逐字** "Still refers to the continuation of a situation"／"Yet = things which have not happened"／"Already = things which have happened" | **2 课（`yet`＋`already` 一课；`still` 一课）** |
| **`whether`** | 🟡 **半新（三个禁区）** | **Cambridge `If or whether?` 逐字三禁**（to-infinitives／`or not` 前／介词后） | **0 课（B1 超纲）** |
| **`since`** | 🟡 **半新（复合结构）** | **Cambridge 逐字 "the present perfect in the main clause"** | **0–1 课（C＋，与 `ago` 配对方可考虑）** |

**📌 红线结论**：
- **纯同义换词（0 课）**：`though`（让步义）——**跨源自己承认「同法」**。
- **半新（换形/换位）⇒ 必须与主角同课，不得单开**：`in spite of`／`despite`／`even though`／`whether`／`since`／`no one`／`nobody`。
- **真新结构（可单开）**：`unless`（但撞 ❌will 红线）、`in case`、**`none`**、**`yet`／`already`／`still`**、`ago`（弱）。

---

## §7 四轴档位对比表 ＋ 推荐

### 7.1 全候选档位总表

| 轴 | 候选 | 课程位 | 规则页 | CEFR | 必造词位 | 档位 | 本批课量 |
|---|---|---|---|---|---|---|---|
| **A** | `unless` | ✅ 中级 U115（三词一格） | ✅✅ 3 节＋2 typical errors＋2 Warning＋中文专文 3 ❌ | B1（两源一致） | 1 | **A−** | **0**（🔴 红线） |
| **A** | `in case` | ✅ 中级 U114（独占格） | ✅ 2 节 | **未取到**（词典条 4 度失败） | 1 | **B＋** | **0**（无配对课） |
| **A** | `even though` | ✅ 共用（U113） | ✅ 独立对比页 | B1-B2 | 1 | **B** | 0 |
| **A** | `in spite of`／`despite` | ✅ 共用（U113） | ✅ 独立页 | B1-B2 | 2 | **B** | 0 |
| **A** | `though`（让步） | ✅ 共用（U113） | ⚠️ 同页一句 | B1-B2 | 1 | **C** | **0（同义换词）** |
| **A** | `though`（句尾） | ✅ 共用 | ⚠️ 无独立页 | — | 1 | **C** | 0 |
| **B** | **`none`** | ✅ **初级 U77 ＋ U81 ＋ 中级 U86 ＋ U88（四处全共用）** | ✅✅ 独立页＋3 Warning＋1 典型错误＋中文 `quantifiers` 专节 | **分裂：Cambridge B1 vs Oxford A2** | **1** | **B＋** | **1** |
| **B** | `no one` | ⚠️ 无独立格（中级 U86 第二行） | ✅ 独立页（与 `nothing` 共页） | A2／A1（两源友好） | 1 | **B** | **并入上課** |
| **B** | `nobody` | ⚠️ 初级 U78 ＋ 中级 U86 第二行 | ✅ 同上 | A2／A1 | 1 | **B** | **并入上課** |
| **C** | **`ago`** | ✅ **初级 U19（`for since ago` 三词一格）** | ✅ 独立页＋1 Warning（含 ❌） | **A2／A1** | **1** | **B＋** | **1** |
| **C** | **`yet`** | ✅ **初级 U16 ＋ 中级 U111 ＋ BC 独立正课** | ✅✅ Cambridge 9 节＋BC 正课＋中文专文 | A2／A2 | 1 | **A−** | **1–2** |
| **C** | **`already`** | ✅ 同上（U16＋U111＋BC） | ✅✅ 对比页＋BC＋中文专文 | A2／A2 | 1（已有 2 处认读） | **A−** | **1–2** |
| **C** | **`still`** | ✅ **初级 U95（`stillyetalready` 三词一格）＋ 中级 U111 ＋ BC** | ✅✅ 同上 | A2／A1 | 1（已有 1 处非本篇义） | **A−** | **1** |
| **D** | `whether` | 🔴 **Murphy 两册全无** | ✅✅ 独立页＋对比页＋3 禁 | **B1（两源一致）** | 1 | **D＋** | **0（超纲）** |
| **D** | `since` | ✅ 中级 U12 ＋ 初级 U19／U104（全共用） | ✅ 独立页＋3 典型错误 | A2–B2 | 1 | **C＋** | **0（本批）** |

### 7.2 推荐

> ## 推荐：**轴 C 优先（`yet`/`already`/`still` 2 课），轴 B 次之（`none` 1 课），轴 A 本批 0 课，轴 D 不排。**

**推荐排序与理由**：

| 序 | 轴／候选 | 课量 | 为什么 |
|---|---|---|---|
| **1** | **轴 C：`yet`（＋`already`）1 课** | **1** | **① 课程位四源齐备且含 BC 独立正课**（`present-perfect-just-yet-still-already`）——**这是本批最强的一处课程位**；**② 中文侧三篇独立专文，本批最厚**；**③ CEFR A2 两源一致，对零基础最友好**；**④ 门槛已过**（L21–L24 已教现在完成时）；**⑤ 我方已有 2 处 `already` 认读（L54／L120）⇒ `already` 是「转正」不是「从零起」，正好符合「转正」批次节奏** |
| **2** | **轴 C：`still` 1 课** | **1** | **① 初级 U95 `stillyetalready` 是独立于 U16 的第二个格**（两格可撑两课）；**② 语义独立**（「还」＝持续）与 `yet`/`already`（已完成/未完成）**不在同一轴**；**③ BC 逐字 "Still comes between the subject and auxiliary verb" 是一条**位置**硬规则（与我方 L28 `always/often/never` 的位置壳同族但不重合）** |
| **3** | **轴 B：`none` 1 课** | **1** | **① 「都」家族否定侧的唯一正主**（Chinese-side 与 `all`/`both`/`every` 成对）；**② 课程位四处（U77／U81／U86／U88）——数量是本批最多的**；**③ 造词成本最低（1 词位）**；**④ 硬增量 3 条中 1 条回流 L149（`neither of` 用于两个）——这是加分不是减分，正好做成跨批回流卡** |
| **4** | 轴 A | **0** | **见 §2 的 🔴 判定** |
| **5** | 轴 D | **0** | `whether` 是**四轴唯一 Murphy 两册全无课程位**且 CEFR B1 的候选 ⇒ **超纲**；`since` C＋，**留待与 `ago` 配对时一并考虑** |
| — | **`ago`（轴 C 附单）** | **0（本批）／1（下批可）** | 档位 B＋ 但**只有 2 条硬增量**，且**它的天然搭档 `since` 是 C＋**。**建议下一批做「`ago` ＋ `since`」配对课**（跨源同格 U19，Cambridge 两页互相 See also） |

### 7.3 「为什么不能更多」——三条硬上限

1. **轴 C 封顶 2 课**：`yet`／`already`／`still` 三词**在 Murphy 两册共 3 格、BC 共 1 课**；**三词共享「现在完成时」这同一张底板**。**若开第 3 课，只能是「`just`」——但 `just` 的增量是「位置」（BC 逐字 "Just comes between the auxiliary verb and the past participle"），与 `still` 的位置规则同型 ⇒ 撞车**。**⇒ 2 课封顶。**
2. **轴 B 封顶 1 课（本批）**：`none` 与 `no one`／`nobody` **共享同一条「自带不＋不再请 not」规矩**（Cambridge Warning ×2），**而这条规矩 L84 `nothing` 已经教过**（逐字 "nothing 和 not 不同台"）。**⇒ 拆成 2 课就是同一规矩的第二次应用，「一课一增量」必破。**
3. **轴 A 封顶 0 课**：`unless` 的招牌考点（❌will）**已在 L48/L109/L142/L143/L144 五课教过**，**删掉它就凑不出 3 条强度足够的新错例**；`in case` **中文侧三度为零**、**规则层只有 2 条硬增量**，**单开则第 3 条须自造**。**⇒ 轴 A 的可行课量 ＝ 0。**

---

## §8 Non-goals 依据（本批明确不做，含依据）

| Non-goal | 判定 | 依据 |
|---|---|---|
| **`unless` 一课（本批）** | **不做** | **§2.3：去掉 ❌will 后只剩 3 条硬增量，其中 2 条只有中文单源；❌will 规矩已教 5 课（第 7–8 次应用）** |
| **`in case` 一课（本批）** | **不做** | **中文侧三度为零**（`english.cool/in-case/` 404；855 条 slug 无 `in-case`；`letmeenglish` 404×2）；**规则层只有 2 条硬增量**（≠if；+of＝介词） |
| **`even though`／`in spite of`／`despite`（单开）** | **不做** | **三者共享 Murphy U113 一格**；**`even though` 增量只有「强度」一条**（BC 逐字）；**`in spite of`／`despite` 共享「接名词/-ing」一条** |
| **`though`（两义，单开）** | **不做** | **BC 逐字自认同法 "Though can be used in the same way as although."**；句尾义**无独立规则页**（同页一句＋1 例）；**我方独立 `though` GL 真零（本轮严格边界重算）** |
| **`whether`（本批）** | **不做** | **Murphy 初级／中级 TOC `wheth` 命中 0／0**（无课程位）；**Cambridge／Oxford 两源 CEFR 一致 B1**；**BC 只在 B1-B2 转述问句课内并列出现**⇒**超纲** |
| **`since`（本批）** | **不做** | **三处课程位全部共用**；**承重墙是「主句现在完成 ＋ since ＋ 从句过去式」复合结构**；**留待与 `ago` 配对**（Cambridge 两页 See also／Murphy U19 同格） |
| **`as long as`／`provided`（沿批二十五）** | **不做** | **`provided` 跨源无独立规则页**；**`as long as` 与 `unless` 同 U115 一格**；**我方两词 GL 0** |
| **`no one`／`nobody` 单开一课** | **不单开** | **两词在 Murphy 两册均无独立单元**（中级 U86 第二行／初级 U78）；**合并入 `none` 课作对照位** |
| **`just`（单开）** | **不做** | **增量只有「位置」一条**（BC 逐字），**与 `still` 的位置规则同型**；**我方已有 4 处认读（L24 明文登记「先混个脸熟，不用考」）** |
| **拼写类考点（`noone`／`wheter`）** | **不做为考点** | **Cambridge 给了这两条**（"no one or no-one but not noone"／"not 'weather', 'wheter'…"），**但零基础课（6–10 分钟）不设拼写考点** ⇒ **只作认读提示** |

---

## §9 未核实项（诚实登记）

| # | 未核实项 | 状态 | 影响 |
|---|---|---|---|
| ① | **`in case` 的词典 CEFR** | **四度实取失败**（`dictionary.cambridge.org/dictionary/english/in-case` 落地为 `referee`，返回 B2 但**是 `referee` 的标位，不是 `in case`**）；**Oxford 侧本轮未取** | **不影响档位**（判据是课程位：U114 独占格＋Cambridge 独立页）；**但「封顶 1 课」的判断部分依赖它——若补到 A2 标位，`in case` 的封顶可能上浮到 2 课** |
| ② | **`english.cool/quantifiers/` 是「数量词」大类专文而非 `none` 专文** | **已核实**：页题逐字「來一次搞懂「數量詞」(Some, Any, Much 等)」，`none` 是其中一节 | **轴 B 的中文实证强度按「专节」而非「专文」计** —— **这是我给 `none` 档位 B＋（而非 A−）的一条依据** |
| ③ | **`english.cool` 855 条 slug 索引的完整性** | 该文件来自前批缓存（`/tmp/ec_slugs.txt`），**本轮未重新抓取全站 sitemap** | **「`none`／`nobody`／`no one`／`ago`／`in-case` 中文侧为零」这条结论依赖它**。**但四词的直连 URL 本轮已单独实测 404（`none`／`nobody`／`no-one`／`ago` 四个 URL 全 404）⇒ 结论独立成立** ✅ |
| ④ | **BC 三档索引的课数：两个通道仍不一致** | **WebFetch 通道**：`a1-a2-grammar` 页列出 **18 课**（本轮实取，逐条列出）；**本机 Wayback 缓存 HTML 通道**：A1-A2 抽到 **14 slug**（`bc-a1a2-new.html`）／B1-B2 **33 slug**（`bc-b1b2-new.html`）／C1 **14 slug**（`bc_c1_wb.html`） | **两种口径下「无 `ago`／`none`／`nobody`／`whether`／`unless` 专课」的结论一致 ✅**（**唯一例外：`yet`/`already`/`still` 在 B1-B2 有专课，两通道一致**）；**但「BC 共 N 课」本轮仍不能给出** |
| ⑤ | **BC 直连被 WAF 拦截** | `learnenglish.britishcouncil.org` 直连返回 **Access Denied**（`bc_sitemap.xml` 亦被拦）；本轮 BC 内容**全部经 WebFetch 通道取得** | **BC 证据的可信度依赖 WebFetch 的正文提取**；**本报告所有 BC 逐字引用均为 WebFetch 返回的正文，未做字节级校验**（与批二十五/二十六同一限制） |
| ⑥ | **`english.cool/still-yet-already/` 的完整正文** | **本轮只取到前 ~55 行**（`still` 部分完整＋`yet` 开头），**`already` 部分在截断之后**；另**单篇 `english.cool/already/` 已完整取到**（含四时态分节） | **`still`／`already` 的逐字引用均来自已取到的部分**；**`yet` 的中文逐字以 `english.cool/yet/`（200）为准，不用截断页** ✅ |
| ⑦ | **Cambridge `Unless` 页「We don't use unless for things that we know to be true」的段落归属** | **本轮已逐字复核**：该句属于「已知为真」段，**其正例是 `…unless you're prepared to pay…`**，**不是批二十六所配的 `I don't know what we would have done if we hadn't seen you.`**（后者属于 `Unless and if … not` 等价段） | **这是对批二十六的一处纠错**（§2.1 备注）⇒ **`unless` 第 6 条的跨源依据不成立** |
| ⑧ | **`for` ＋ 时长（`for five years`）在我方的覆盖** | **本轮实测：`for` ＋ 时长短语 GL 零命中**（`for two/three/a week` 全部 0）；**`for` 本身 GL 156 但全为其他用法**（`for you`／`for me` 等） | **影响 `ago` 与 `since` 的「与 `for` 分工」教学位**（Cambridge `Ago` 页逐字 "for duration, we use **for** (not ago)"）——**`ago` 一课若要带 `for` 对照，须造 2 个词位**（`ago` ＋ `for` 的新用法）⇒ **这是我把 `ago` 的课量压在 1 课的理由之一** |
| ⑨ | **`whether` 在 Murphy 「Index」而非 TOC 中的可能性** | **本轮只核了 TOC 归一化文本**（3 份），**未核书末 Index**（`Index` 在 TOC 末尾出现但内容未取） | **不影响「无课程位」的结论**（课程位定义＝独立单元/课时，Index 条目不构成课程位）✅ |

---

## 附：本轮实测 / 引用清单

### A. 我方文件（逐字实读）

| 文件 | 用途 | 关键读数 |
|---|---|---|
| `/Users/liujun/Documents/英语听写/src/data/grammarLessons.ts`（28808 行） | **全部缺口计数＋卡片结构＋已教基线** | **152 课**；`contrast` 每课 6 条；**L139–L152 全为 (3 新错例, 3 双正解)**；`none`／`nobody`／`no one`／`ago`／`yet`／`whether`／`since`／`unless`／`in case`／独立 `though` **全为 0** |
| `/Users/liujun/Documents/英语听写/src/data/huntCases.ts` | HC 计数 | `nothing` 5／`everyone` 3／独立 `though` **0** |
| `src/data/grammarLessons.ts` L84（逐字） | `nothing` 的已教规则 | **"nothing 自带「不」（不再请 not）"**／深挖卡 **"nothing 和 not 不同台"** |
| `src/data/grammarLessons.ts` L24（逐字） | `just` 的认读登记 | **"看到 just（刚刚）或不报时间，用做过版。just 先混个脸熟，不用考。"** |
| `src/data/grammarLessons.ts` L10／L21–L24（逐字） | 轴 C 的门槛 | **L10＝昨天版（过去简单式）；L21–L24＝现在完成时骨架已教** |
| `src/data/grammarLessons.ts` L139–L141（逐字） | 轴 A 撞车审计 | `Although it is raining, I will go out.`＋**逗号规则已教** |

### B. Murphy TOC（本机原件归一化，批二十五/二十六沿用同一份）

| 文件 | 字符数 | 本轮新增读数 |
|---|---|---|
| `/private/tmp/murphy_ess_norm.txt` | 13966 | **初级 U16 `16I'vejust…I'vealready…Ihaven't…yet(presentperfect2)`**／**U19 `19forsinceago`**／**U77 `77not+anynonone`**／**U78 `78not+anybody/anyone/anythingnobody/no one/nothing`**／**U81 `81allmostsomeanyno/none`**／**U95 `95stillyetalready`**；**`wheth` 命中 0** |
| `/private/tmp/murphy_int_norm.txt` | 11016 | **中级 U12 `12forandsincewhen…?andhowlong…?`**／**U86 `86no/none/anynothing/nobodyetc.`**／**U88 `88all/allofmost/mostofno/noneofetc.`**／**U111 `111stillanymoreyetalready`**／U113／U114／U115；**`wheth` 命中 0** |
| `/private/tmp/murphy_full_norm.txt` | 11071 | 同中级；**`wheth` 命中 0** |
| `/private/tmp/murphy_toc_clean.txt` | 2261 | 交叉印证 `19forsinceago`／`16I'vejust…Ihaven't…yet` |

### C. 跨源网页（本轮实取）

| # | 源 | 状态 | 关键逐字 |
|---|---|---|---|
| C-1 | `dictionary.cambridge.org/grammar/british-grammar/unless` | ✅（含本机字节） | "We use the conjunction unless to mean 'except if'."／"We don't use will or would in the clause after unless"／"We don't use unless when we mean if"／"When unless comes before the main clause, we use a comma" |
| C-2 | `…/conditionals-other-expressions-unless-should-as-long-as` | ✅ | "We don't use unless for impossible conditions"／"We don't use unless and if together"＋❌`unless if it rains` |
| C-3 | `…/in-case` | ✅ | "In case is a conjunction or adverb. In case of is a preposition."／"We don't use in case to mean 'if'."／"We use in case of + noun to mean 'if and when something happens'" |
| C-4 | `…/no-none-and-any`（实际落地页题 **"No, none and none of"**） | ✅ | "None is the pronoun form of no. None means 'not one' or 'not any'."／"**We don't use none where we mean no one or nobody.**"／"**We don't use none of when there is already a negative word.**"／"**We don't use none directly before nouns. We use no + noun or none of + noun.**"（❌`None children in my group …`）／"Use neither of rather than none of with two things." |
| C-5 | `…/no-one-nobody-nothing-nowhere` | ✅ | "These four words are indefinite pronouns…"／"**Nobody is a little less formal than no one**"／"**no one is preferred in writing**"／"no one or no-one but not noone"／❌`She talks to hardly no one`／❌`I can't do nothing` |
| C-6 | `…/ago` | ✅（两度实取一致） | "A period of time that is completed and goes from a point in the past up to now."／"**Ago follows expressions of time:**"／"**We normally use ago with the past simple. We don't use it with the present perfect:**"／❌`I have received his letter four days ago.`／❌`They arrived in Athens ago six weeks.` |
| C-7 | `…/yet` | ✅ | 9 节；"**It usually comes in end position.**"／"**We don't use yet to refer to something that has happened. We use already**"／"We don't use yet to talk about events that are continuing." |
| C-8 | `…/already-still-or-yet` | ✅ | "**Still refers to the continuation of a situation**"／"**Negatives with still: situation should have changed but hasn't**"／"yet usually goes after the main verb; still usually goes after the subject" |
| C-9 | `…/whether` | ✅ | "Whether is a conjunction."／4 节／"**We use whether, not if, before a to-infinitive**"／"We don't use either in indirect questions." |
| C-10 | `…/if-or-whether` | ✅ | 三禁逐字：before to-infinitives／directly before 'or not'／after prepositions |
| C-11 | `…/since` | ✅ | 7 节；"**the present perfect in the main clause**"／"Use since, not ago, after 'it's a long time'"／"She was waiting for four hours." ❌`since four hours` |
| C-12 | `…/all`／`all-or-every`／`all-or-whole`（批二十六） | 沿用 | — |
| C-13 | `dictionary.cambridge.org/dictionary/english/*` | ✅ | **`none` B1／`nobody` A2／`no one` A2／`nothing` A2／`ago` A2／`whether` B1／`since` A2·B1·B2／`yet` A2／`already` A2·B1／`still` A2·B1／`no` A1** |
| C-14 | `oxfordlearnersdictionaries.com/definition/english/*` | ✅ `cefr=` 属性 | **`ago` a1／`none` a2／`nobody` a1／`no one` a1／`whether` b1／`since` a2／`yet` a2(+b2)／`already` a2(+b1)／`still` a1(+b1)** |
| C-15 | BC `grammar/b1-b2-grammar/present-perfect-just-yet-still-already` | ✅ | **独立正课（B1/B2）**；"Just comes between the auxiliary verb (have/has) and the past participle."／"Yet comes at the end of the sentence or question."／"**only used in negative sentences and questions**"／"**Still comes between the subject … and auxiliary verb**"／"Already can come between the auxiliary and the main verb or at the end of the clause." |
| C-16 | BC `grammar/english-grammar-reference/quantifiers` | ✅ | "**Note: with all and both, we don't need to use of**"／"**None is used for more than two**"（`both, either and neither: Used for two items`） |
| C-17 | BC `grammar/b1-b2-grammar/reported-speech-questions` | ✅ | "These use **if** or **whether** to report the question, with **if** being more common." |
| C-18 | BC `grammar/b1-b2-grammar/conditionals-zero-first-second` | ✅ | "It is also common to use this structure with unless, as long as, as soon as or in case instead of if." |
| C-19 | BC `grammar/b1-b2-grammar/contrasting-ideas-although-despite-others` | ✅ | "**Though can be used in the same way as although.**"／"**Even though is slightly stronger and more emphatic than although.**"／"After in spite of and despite, we use a noun, gerund … or a pronoun." |
| C-20 | BC 三档索引 | ✅（WebFetch）／⚠️（缓存通道课数不一致，见 §9④） | A1-A2 **18 课全目**逐条核过：**无 `ago`／`none`／`nobody`／`whether`／`unless` 专课** |

### D. 中文侧（本轮实取，全部含 HTTP 状态）

| # | URL | 状态 | 关键逐字 |
|---|---|---|---|
| Z-1 | `english.cool/unless/` | **200** | "Unless 的中文意思就是「除非…否則…」或「如果不…就…」"／"**Unless 後面一定是肯定句，否則會出現「雙重否定」的問題**"／"**Unless不能出現在疑問句**"／"unless 後面接的副詞子句會和「假設語氣/條件句」的時態變化一致" |
| Z-2 | `english.cool/quantifiers/` | **200** | **「no / none 比較」节**："none 為 not one 的合併，表示「一個都不…」"／"none 後面若需要接名詞，就要使用 none of"／"**none 會強調在某個範圍內都不…，no 則沒有限定範圍**" |
| Z-3 | `english.cool/still-yet-already/` | **200（301→）** | "still 是「仍然、還是、依舊」"／"用來表示「某個狀況仍然在持續中，並未停止或改變」"／**专节「still 用於「現在完成式」」**："則較常以「否定」的形式出現"／"說話者預期早就應該完成，但實際上還沒完成" |
| Z-4 | `english.cool/already/` | **200** | "Already 的意思就是「已經」、「早已」"／四时态分节（過去完成式／現在完成式／過去簡單式／現在簡單式與現在進行式） |
| Z-5 | `english.cool/yet/` | **200** | 5 节：「至今、迄今」／「還沒、尚未」／`better yet`／`yet another`／「然而、卻」；"常用於否定句和疑問句，**通常放在句尾**" |
| Z-6 | `english.cool/whether/` | **200** | "whether 都是表示「是否」"／两用法（是否／不管…不論…）／七种句法位（主詞／補語／同位語／受詞／介系詞的受詞） |
| Z-7 | `english.cool/since/` | **200** | "since 是「自從」"／"**since 前面的主要子句會用「現在完成式」來表示**"／"當介系詞使用時，since 後面會接過去某個特定的時間點" |
| Z-8 | `english.cool/{ago,none,nobody,no-one,in-case,no-none,none-of,for-since,ago-before,before-ago}` | **全 404**（10 个 URL 实测） | **轴 B／轴 C 的 `ago`／`none` 中文侧为零的直接依据** |
| Z-9 | `/tmp/ec_slugs.txt`（**855 条 slug 全索引**，前批缓存） | ✅ | **无 `none`／`nobody`／`no-one`／`ago`／`in-case`**；**有** `indefinite-pronouns`（但该页实测为 `one/another/others` 型，`nobody` 命中 0） |
| Z-10 | `letmeenglish.com/{none,ago,yet,in-case}/` | **526（WAF 拦截）** | **本轮新增证据：letmeenglish 全站本轮不可达** ⇒ **批二十五「`in case` 中文侧为零」的结论扩展到 letmeenglish 之外仍成立**（因 english.cool 全索引亦无） |

---

## 结论一句话

> **轴 A 本批 0 课（`unless` 去掉 ❌will 后只剩 3 条硬增量、其中 2 条单源中文侧，且该规矩已教 5 课——主理人的否决成立；另发现批二十六第 6 条卡片的跨源依据挂错段落）；轴 B 1 课（`none`，课程位四处为全批最多、造词 1 位、与 `nothing` 是两条不同的轴）；轴 C 是本批真正的富矿——`yet`/`already`/`still` 档位 A−（BC 有独立正课＋Murphy 三格＋中文三篇专文），门槛（现在完成时）已过，可开 2 课，`ago` 为 B＋（Murphy 初级 U19 三词一格）留待下批与 `since` 配对；轴 D 0 课（`whether` 是四轴唯一 Murphy 两册全无课程位且 CEFR B1 的候选，超纲）。**
