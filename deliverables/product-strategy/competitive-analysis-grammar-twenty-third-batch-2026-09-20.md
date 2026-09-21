# 竞品分析：第二十三批选题（L142 起）· 竞析报告

| 字段 | 值 |
|---|---|
| 报告 | 竞品分析（竞析）· 语法线「小美的一天」第二十三批 |
| 日期 | **2026-09-20** |
| 轮次 | 第二十三批（批二十二 L139–L141 `although` 让步与转折交付后） |
| 课号起点 | **L142 起**（现库 **141 课／150 案／season-1 至 season-22**，本轮独立复算） |
| 本轮任务 | **`as soon as` 首选专章（B 档）的「补缺口＋复核」**——批二十二已到原文级，本轮**逐字重取四源**、**补 `once`／`by the time` 两条判断课量的缺口**、**复核四个备选候选并标注口径变化**、**出具 L109 形式冲突的跨源参考** |
| 上游输入 | `roadmap-grammar-twenty-second-batch-2026-09-20.md`（**§6.2 序 1 `as soon as` 首选／§6.3 携带项 1 L109 冲突**，逐节实读）· `competitive-analysis-grammar-twenty-second-batch-2026-09-20.md`（批二十二竞析，**§0–§9＋附录**，逐节实读，作为转述级基线） |
| 我方快照（本轮独立复算） | `src/data/grammarLessons.ts`（**26,686 行／141 课**，末课 `number: 141`）· `src/data/huntCases.ts`（**8,313 行／150 案**）· `src/data/grammarSeasons.ts`（**22 季**，末项 `season-22`）· `src/pages/GrammarPathPage.tsx`（`:284` m24 `afterLesson: 141`） |
| 快照时点 | **本轮复算全部在同一时点完成**（本轮实读 mtime ＝ **2026-09-19 23:5x**；`git status` 仍为 ` M`——**未提交状态与批二十一／二十二记录一致，见 §7 未核实①**） |

---

## §0 本轮结论速览（7 条，先读这里）

1. **【口径校正·本轮最重要】Cambridge `conjunctions-time` 的「When, once, as soon as」小节，本轮直连逐字取到的原文是 "We *can* use when, once, *as* and as soon as to talk about a specific point in time when something happened or will happen"——比批二十二转述的 "We use when, once and as soon as…" 多了 `can`、多了 `as`。** 批二十二的引文**漏了一个并列项（`as`）并把情态动词 `can` 读成了零**（见 §6 口径校正 1）。**这不影响判档**（该小节仍把 `as soon as` 与 `when`／`once`／`as` 并列），**但影响「同小节恰好三项」这一表述**——**正确的表述是「同小节四项：`when`／`once`／`as`／`as soon as`」**。**同时本轮确认 `once` 在 Cambridge 有独立语法页**（批二十二只记了「See also 指过去」未实取）。
2. **❌will 规则三源原文本轮全部实取，且 Cambridge 侧的位置比批二十二记的更硬**：Cambridge `conjunctions-time` 的 **Warning 框**逐字 "**We don't use will after conjunctions referring to future time**"，其**第二条例句就是 `as soon as`**（`I will call you as soon as I get to the office.` 对 `Not: … as soon as I will get to the office.`）；**BC 参考层**逐字 "We do not normally use will in time clauses and conditional clauses."（四条例句全部标 `(NOT …)`）；**中文侧 `after` 专文**逐字 "after 帶出的那個子句也習慣用現在式代替未來式…要寫 after class ends，而不是 after class will end"＋❌`I'll call you after class will end.`。**三源规则同轴，且 Cambridge 把 `as soon as` 直接放在该 Warning 的例句位**（见 §5.3）。
3. **`once` 与 `as soon as` 是「同义换词」，不是新结构——这是本轮「不扩到 4 课」的决定性证据。** ① **Cambridge `once` 专页**逐字："**We use once as a conjunction meaning 'as soon as' or 'after'**"，且该页有与 `conjunctions-time` 同型的 ❌will 警告（"**We don't use shall or will in the clause with once**"，`Once I pass all my exams, I'll be fully qualified.` 对 `Not: Once I will pass …`）；② **Cambridge 词典**给 `once` 的两个义项：**(ONE TIME) A2**／**(AS SOON AS) B2**（"as soon as, or from the moment when"，`Once I've found somewhere to live I'll send you my address.`）——**即 `once` 的「一…就…」义官方定义就是 `as soon as` 本身**；③ **中文侧 `once` 专文**逐字把它列作 "**once 還可以用來表示「一旦、只要、一…就…」的意思**"，并说它 "當連接詞使用"；④ **Murphy 双册 `once` 字面 0**（初级／中级／中级全目块三通道，**去空白归一化后复算**）。→ **若把 `once` 独立成课，就是「同一个意思换个词」，违反「一课一增量」**（见 §5.2）。
4. **`by the time` 与 `as soon as` 是「新结构」，但它的真搭档是「完成视点」——因此它不属于本批。** ① **Murphy 中级 U120 标题逐字 `by and until by the time…`**（去空白归一化逐字 `120byanduntilbythetime`，**本轮唯一命中**；初级 0）——**这是 `by the time` 唯一的课程位，且与 `until`（我方 L109）同单元**；② **BC B1-B2 第 8 课 `Future continuous and future perfect`** 明文 `by the time` ＝ "at some point before"（例 `By the time we arrive, the kids will have gone to bed.`）；③ **Cambridge `by-and-until` 页本轮探测为「空壳页」（HTTP 200 但只有模板，无内容）**，**`by the time` 未取得独立规则页**（见 §7 未核实②）；④ **中文侧 `by` 专文**有一条逐字例 `By the time he came home, his wife had gone to bed.`（**过去完成视点**）。→ **`by the time` 的语义内核是「到那时已完成」，与我方零底座的 `will have` 绑定**（批二十二 §3 序 9 已判 `will have` 为 C），**故 `by the time` 不并入本批**（见 §4.3）。
5. **`seem`／`appear` 升 C＋ 复查口径两处**：① **Cambridge 词典 `seem` 本轮直连给 B1 并附 Grammar 小节**，逐字 "Seem means 'appear in a particular way'. We can use it as a **linking verb** (like be) or with a **to-infinitive**. **We do not normally use seem in the continuous form**"（**批二十二只记了 CEFR 与形式标注，没收这条 Grammar 原句**）；② **`would rather` 的段位证据本轮重取，结论须收窄**：Cambridge 词典**页面上 `would rather` 独立条目标 B1**（"used to show that you prefer to have or do one thing more than another"），但**它挂在 `rather` 条下的 PREFERENCE 义项区，同一页另有三个 `rather` 的段位（SMALL AMOUNT B1／MORE EXACTLY B2／`rather than` B1）**——**批二十二「headword 独立标 B1」的说法本轮成立，但要注明（a）它没有独立词条页（与 `as soon as` 本轮取到独立页形成对比）；（b）它是 `rather` 条内的第 4 个段位标注**（见 §6 口径校正 3）。
6. **`neither／either／both` 与 `will have` 本轮为纯复核，口径零变化**：三段位（`both` A1／`either` B1 两义／`neither` B2）**本轮逐页重取一致**；`will have` 的 BC 课程位（B1-B2 第 8 课）与 Murphy 中级 U24 **本轮复算一致**，**且本轮补到 Cambridge 的 `Future perfect simple` 专页**（批二十二 §3 序 9／§7 校正 6 记「Cambridge 语法落点须另找」——**本轮找到并实取**，见 §2 表注）。→ **两项档位不变**（`neither/either/both` B−／`will have` C）。
7. **「L109 形式冲突」的跨源参考本轮取到三条，且三条方向一致**：跨源教材对「同一从句的现在版／过去版」**不做「一刀切」的规则，而是按「主句的时间」定从句**：① **Cambridge `conjunctions-time`** 把「现在／将来」与「过去」两栏并列在同一张首屏例表里（`I'll call you once I arrive.` 对 `She was in a bad accident when she was young.`）；② **Cambridge `until` 专页**把同一 `until` 的三种情况分列——"We use **present** verb forms to refer to the **future** after until"（`I can't wait until the summer holidays begin.` 对 `Not: … until the summer holidays will begin.`）／"We also use the **present perfect** after until"／"We use the **past simple and past perfect** to talk about events in the **past**"（`He was the headteacher until he retired in 1968.`）；③ **`once` 专页**同型：`Once I pass all my exams, I'll be fully qualified.`（现在版表将来）**与**词典 `Once I've found somewhere to live I'll send you your address.`（完成版表将来）**并存**。→ **跨源的处置是「按主句时间切换版本」，不是我方 L109 那种「前后两版必须一致」的单一规则**——**这正是我方的冲突点（见 §5.4 与 §4.2）**。

---

## §1 复核结果：逐源列出取到／未取到的页面与要点

### 1.1 Cambridge Dictionary（Cambridge）——本轮 16 页，**14 页直连实取**

| # | 页面 | 取到情况 | CEFR | 本轮要点（**原文级**） |
|---|---|---|---|---|
| C-1 | **`grammar/british-grammar/conjunctions-time`**（**本批第一关键页**） | ✅ **本轮 curl 直连实取（455,382 bytes，原文级）** | 无 CEFR（页脚注明语法书面向 **B1-B2**） | **① 定义句逐字（本轮校正批二十二引文）**："**When, after, before, until, since, while, once, as and as soon as are subordinating conjunctions which can be used to connect an action or an event to a point in time.**"——**九项并列，`as soon as` 在末位**；**② 首屏例表九行**（`She was in a bad car accident when she was young.`／`We can't play loud music after everyone has gone to bed.`／`Brush your teeth before you go to bed!`／`I'll wait with you until the bus comes.`／`I've been very busy since I started my new job.`／`No one left the cinema while the movie was on.`／**`I'll call you once I arrive.`**／**`We always have an ice cream as soon as we get to the beach.`**／`I bumped into her as I came out of the bank.`）——**九宫格逐格对齐「事件／连词／时间」三列**；**③ 非谓语补条逐字**："**Many of these time conjunctions can be followed by -ing or -ed forms instead of subject + verb.**"（**批二十二记的是「These conjunctions can also be followed…」，本轮原文是 Many of these… can be**——**见 §6 口径校正 2**）；**④ ❌will 的 Warning 框逐字**："**We don't use will after conjunctions referring to future time**"＋两例：`When people walk into the room, they will feel something special.`（`Not: When people will walk into the room …`）与 **`I will call you as soon as I get to the office.`（`Not: … as soon as I will get to the office.`）**；**⑤ 「When, once, as soon as」小节逐字**："**We can use when, once, as and as soon as to talk about a specific point in time when something happened or will happen**"＋三例（`When we were in Greece, we went to as many islands as possible.`／`They always close their curtains once they get home in the evening.`／`As soon as we hear any news, we'll call you.`）；**⑥ 其余小节**：`Before, after and until`（"either the main clause or the subordinate clause can come first"；`She'll pick you up before she comes here.`）／`Until as a time conjunction means up to a time in the past or future`（`I'm going to wait until the January sales start to buy a new jacket.`）／`We spell until with one l.（Not: untill）`／`While`（`Can you wait in the car while I run into the shop?`）／`We don't use during instead of while`（`Not: … during I study.`）；**⑦ See also 里 `Once` 是独立页**（本轮已取，见 C-2） |
| C-2 | **`grammar/british-grammar/once`**（**本轮新取·批二十二的缺口**） | ✅ **本轮直连实取（446,667 bytes）** | 无 CEFR | **页面归类逐字**："Grammar > **Adjectives and adverbs > Adverbs > Time adverbs > Once**"＋"**Once is an adverb or conjunction.**"；**副词义**："We use once as an adverb to mean '**one single time**'"（`I've only met Jane's husband once.`）／"We say **once a + singular** time expression and **once every + plural**"（`They go for dinner together once a month.`／**`Not: They go for dinner once the month.`**）／"We also use once to mean '**at a time in the past but not now**'…we often use it **in mid position**"（`My father once worked on an oilrig.`／`She was once a schoolteacher but she hated it.`）；**连词义（本批决策依据）逐字**："**We use once as a conjunction meaning 'as soon as' or 'after'**"（`Once I've picked Megan up, I'll call you.`／`My boss is a nice man once you get to know him.`）＋**❌will 警告逐字**："**We don't use shall or will in the clause with once**"（`Once I pass all my exams, I'll be fully qualified.` 对 **`Not: Once I will pass …`**）→ **`once` 的连词义＝官方定义的 `as soon as`；同页另有「一次」义与「曾经」义两个干扰义项** |
| C-3 | **`grammar/british-grammar/until`**（**L109 冲突的跨源参考 ①**） | ✅ **本轮直连实取（450,595 bytes）** | 无 CEFR | **① 现在版表将来逐字**："**We use present verb forms to refer to the future after until**"（`I can't wait until the summer holidays begin.` 对 **`Not: … until the summer holidays will begin.`**）；**② 完成版表将来**："**We also use the present perfect after until** to refer to actions or events that will continue up to a point in the future"（`We'll sit here till Donna has finished.` 对 `Not: … until Donna will have finished.`）；**③ 过去版逐字（本批 L109 参考的核心）**："**We use the past simple and past perfect to talk about events in the past**"（**`He was the headteacher until he retired in 1968.`**／`We couldn't put down the new floor till the plumber had finished.`）；**④ 位置警告**："We don't normally put the until -clause before the main clause"（`No one left the room until the talk ended.` 对 `Not: Until the talk ended no one left …`）——**与我方 L109 的句序一致**；**⑤ 首屏例含 `rain`**："**Let's wait here till the rain stops.**（till + subordinate clause）"——**跨源用「雨停」配 `until`，且用 `stops`（现在版）**；**⑥ `by` 分工**："We use **by**, not until, to talk about something that will happen before a particular time or deadline"（`The movie will be finished by 9 pm.` 对 `Not: … until/till 9 pm.`）→ **`by`／`until` 的切开是跨源共识，且例句用了 `movie`（我方 L109 `examples` 第 2 条逐字 `We waited until the movie ended.`——同场景词）** |
| C-4 | **`dictionary/english/as-soon-as`**（**本轮新取·批二十二用的是 `soon` 页的附属条**） | ✅ **本轮直连实取（HTTP 200）** | **B1** | **独立 headword 页存在**；逐字义 "**at the same time or a very short time after**"；**六条例句**（`As soon as I saw her, I knew there was something wrong.`／`As soon as I said it, I regretted it.`／`He registered to vote as soon as he turned eighteen.`／`I knew I had to have it as soon as I saw it.`／**`As soon as she finishes knitting one sweater, she starts another.`**／`As soon as I arrived, I felt I belonged there.`）；另有 `as soon as possible` 短语条（**A2**）与 American Dictionary 条（`We'll come as soon as we can.`）→ **「一…就…」的 B1 段位本轮在独立词条页二次确认** |
| C-5 | **`dictionary/english/soon`**（逐字复核批二十二） | ✅ **本轮直连实取** | **`soon` ＝ A2 ／ `as soon as` ＝ B1 ／ `as soon as possible` ＝ A2** | **逐字复核一致**：`soon` **A2** "in or within a short time; before long; quickly"；**`as soon as` B1** "at the same time or a very short time after"；`as soon as possible` **A2** "If you do something as soon as possible, you do it as quickly as you can"；**另本轮补到三条 Idioms（页内无 CEFR）**：`sooner or later`／**`no sooner ... than`**／**`would (just) as soon`** → **批二十二拒引的 `no sooner ... than` 本轮确认在 `soon` 页只在 Idioms 列表里、无独立释义、无 CEFR**（**我方不引，口径合理**） |
| C-6 | **`dictionary/english/once`** | ✅ **本轮直连实取（HTTP 200）** | **（ONE TIME）＝ A2 ／（AS SOON AS）＝ B2** | **① 副词义 A2** "one single time"（`I went sailing once, but I didn't like it.`／`We have lunch together once a month.`）；**② 连词义（AS SOON AS）B2** 逐字 "**as soon as, or from the moment when**"（`Once I've found somewhere to live I'll send you your address.`）；**③ 同页其他段位**：`at once` **C1**／`for once` **B2**／`once again` **B1**／`(every) once in a while` **B2**／`once and for all` **C2**；**④ US 词典条**：`once conjunction (AS SOON AS)` "as soon as, or when"（`Once you've tried their ice cream, you'll be back for more.`）→ **`once` 作「一…就…」是 B2，比 `as soon as` 的 B1 高一档 → 教学顺位在 `as soon as` 之后** |
| C-7 | **`grammar/british-grammar/future-perfect-simple-…`**（**本轮新取·补批二十二的「须另找」缺口**） | ✅ **本轮直连实取** | 无 CEFR | **逐字**："**Future perfect simple: form** — We use **will/shall + have + the -ed form** of the verb."；"**Future perfect simple: use — Events finished by a certain time in the future**"；"**We use the future perfect form when we look back to the past from a point in the future. We usually use a time phrase, for example by tomorrow, for three years**"；例句 `Do you think she'll have seen the doctor by four o'clock?`／`I think they'll have got there by six o'clock.`／`Next month I will have worked for the company for six years.`；**注**："**Shall I, shall we and shan't I, shan't we in future perfect questions are rare.**"→ **`will have` 的 Cambridge 语法落点本轮找到并实取**（批二十二 §9.2 未核实④的缺口**本轮关闭**）——**但该页 `by the time` 逐字 0 命中**（`by` 只在 `by four o'clock`／`by six o'clock` 里） |
| C-8 | **`grammar/british-grammar/as-when-or-while`**（**本轮新取·`as soon as` 与 `when` 的刻度参考**） | ✅ **本轮直连实取** | 无 CEFR | **逐字**："**As, when and while are conjunctions. In some uses as, when and while can mean the same, but they can also have slightly different meanings.**"；"We can use as, when and while to mean '**during the time that**', to connect two events happening **at the same time**"；**关键的刻度句**："**We can use when to introduce a single completed event that takes place in the middle of a longer activity or event.**"；"**Depending on the context, when can mean 'after' or 'at the same time'**"（`When you open the file, check the second page.`＝after／`I eat ice cream when I am on holiday.`＝at the same time）；**"We often use just with when or as to express things happening at exactly the same time"**（**`The phone always rings just when I'm closing the front door.`**）→ **这是「`when` 的刻度」的官方说明：`when`＝「当…时／可以兼表 after」，要表「紧接」需加 `just`；`as soon as` 则是「紧接」的专用式**（**§5.1 的核心依据**） |
| C-9 | **`grammar/british-grammar/by-and-until`**（**探 `by the time` 的独立页**） | ⚠️ **本轮 curl 取到 HTTP 200 但内容为模板空壳（5,097 bytes，正文全为导航＋「Explore the English Grammar」说明，无任何 `by the time` 内容）** → **判定为「不存在该 slug」** | — | **`by the time` 在 Cambridge 语法层本轮未取到独立页**；**`by the time` 的 Cambridge 侧落点只在词典／例句层与 `until` 页的 `by` 对比小节**（见 C-3 ⑥）→ **见 §7 未核实②** |
| C-10 | **`grammar/british-grammar/present-simple-i-work`**（**探「现在版表将来」是否有独立页**） | ✅ **本轮直连实取** | 无 CEFR | 该页只给 **form／spelling／use（permanent situations 等）**，**未取到「present simple for future」小节**——**「现在版表将来」在 Cambridge 的落点是分布式的**（在 `conjunctions-time`／`until`／`once` 各自的 Warning 里），**不在 `present-simple` 页** → **这解释了为什么该规则必须按「连词」逐页引**（见 §5.3） |

**Cambridge 小结（本轮三条）**：**① `as soon as` 与 ❌will 的证据本轮全部复取成立，但有一处引文须校正（`can`＋`as`，§6 校正 1）与一处「-ing/-ed 补条」措辞须校正（§6 校正 2）；② 本轮补齐了两个批二十二的缺口——`once` 语法页（独立页，连词义＝「as soon as／after」）与 `will have` 的 `Future perfect simple` 页；③ `by the time` 在 Cambridge 语法层无独立页（探测为空壳），它的位置只在词典／例句层。**

### 1.2 British Council LearnEnglish（BC）——参考层 1 页 ＋ 三档索引复核

| # | 页面 | 取到情况 | CEFR | 本轮要点（**原文级**） |
|---|---|---|---|---|
| B-1 | **`english-grammar-reference/verbs-time-clauses-if-clauses`**（**❌will 的 BC 侧原文**） | ✅ **本轮 WebFetch 直连实取** | **页内双档标注：`Level: beginner`（talking about the future 节）／`Level: intermediate`（making hypotheses 节）** | **逐字**："**We do not normally use will in time clauses and conditional clauses.**"＋**四条例句全部带 `(NOT …)`**：`I'll come home when I finish work. (**NOT** will finish work)`／`We won't be able to go out if it rains. (**NOT** will rain)`／`It will be nice to see Peter when he gets home. (**NOT** will get home)`／`You must wait here until your father comes. (**NOT** will come)`；**例外逐字**："but we can use will if it means **want to** or **be willing to**"；**逐字复核结论：全页 `as soon as` ＝ 0**（批二十二记「同页 `as soon as` ＝ 0」**本轮成立**）；**另复核：全页 `by the time` ＝ 0**（本轮新查） |
| B-2 | **A1-A2 索引（18 课）** | ✅ **本轮 WebFetch 直连实取**（与批二十二逐条一致） | **A1 Elementary／A2 Pre-intermediate** | 18 课标题本轮复点：**`as soon as`／`once`／`by the time` 三项均零课程位**（逐条比对）；**时间相关课只到 `Past continuous and past simple`／`Prepositions of time: 'at', 'in', 'on'`**——**A1-A2 无任何「时间从句连词」专课** |
| B-3 | **B1-B2 索引（36 课）** | ✅ **本轮 WebFetch 直连实取** | **B1 Intermediate／B2 Upper intermediate** | 36 课标题本轮复点；**本批新增的三项复核**：**`as soon as` 0／`once` 0／`by the time` 0**；**`by the time` 的落点在第 8 课 `Future continuous and future perfect` 内**（**表内落点，非课位**）；**`once` 在 36 课标题里零**（**含 `Past habits: 'used to', 'would' and the past simple` 与 `Past perfect` 两课均不含**） |
| B-4 | **C1 索引（14 课）** | ✅ **本轮 WebFetch 直连实取** | **C1 Advanced** | 14 课标题复点：**三项零课程位**（`Unreal time`／`Participle clauses`／`Inversion and conditionals` 等均不含时间从句连词专课） |
| B-5 | `grammar/english-grammar-reference` 总索引 | ✅ **本轮 WebFetch 直连实取（此前 404 的 URL 变体本轮命中）** | — | **逐字结构**：参考层按**七个主题**组织，逐条为 **"Pronouns"／"Determiners and quantifiers"／"Possessives"／"Adjectives"／"Adverbials"／"Nouns"／"Verbs"**；**逐字复核结论：七个主题标题里 `conjunctions`／`time`／`clauses`／`verb forms` 四个词一个都没有**；**`as soon as`／`once`／`by the time` 在参考层索引里零**（**它们在参考层是「页内小条目」不是「页」**）→ **这是「参考层无独立页」的一条硬事实** |

**BC 小结（本轮两条）**：**① ❌will 的 BC 侧原文本轮逐字复取成立（"We do not normally use will in time clauses and conditional clauses."＋四条 `(NOT …)`），且全页 `as soon as` ＝ 0／`by the time` ＝ 0——即 BC 的这条规则是「通用式」，不分连词；② BC 三档 68 课对 `as soon as`／`once`／`by the time` 全部零课程位（本轮逐档复点），参考层亦无独立页（七主题索引里无 conjunctions／time）。**

### 1.3 Murphy（本机双册官方 TOC 原件）

**取到情况**：`/private/tmp/murphy_ess.txt`（初级 4th Contents，18,714 bytes）·`/private/tmp/murphy_int.txt`（中级 4th Contents，14,143 bytes）·`/private/tmp/murphy_full.txt`（中级全目块含附录页，14,198 bytes）·PDF 原件 `murphy_ess.pdf`（99,745 bytes）／`murphy_int.pdf`（62,514 bytes）。**本轮方法**：`tr -d ' \n\r\t'` 去空白归一化后再 `grep -ao`（**批二十二的方法级校正本轮沿用**；**注意须用 `grep -a`，否则二进制判定会假 0——本轮实测：不加 `-a` 时全部候选返回 0**，**这是本轮的第二个方法级校正，见 §6 口径校正 4**）。归一化后字符数：初级 **17,176**／中级 **12,841**／中级全目 **12,896**。

| 项 | 本轮逐字复核结果（**去空白归一化 ＋ `grep -a`**） |
|---|---|
| **`as soon as`** | **初级 0／中级 0／中级全目块 0**（`assoonas` 三通道全 0）→ **Murphy 双册无本结构**（**批二十二结论本轮成立**） |
| **`once`** | **初级 0／中级 0／中级全目 0**（`once` 三通道全 0）→ **Murphy 双册无 `once` 任何单元**（**本轮新增复核项**）。**注意：Murphy 的时间从句单元不含 `once`——它与 `as soon as` 同命运** |
| **`by the time`** | **初级 0／中级 1／中级全目 1**（逐字 `bythetime`）→ **唯一命中：中级 U120 标题逐字 `by and until by the time…`**（去空白逐字＝`120byanduntilbythetime`）；**初级 0**（初级的时间介词块＝**U104 `from…to until since for`**／**U105 `before after during while`**）→ **`by the time` 有中级单元位，且与 `until` 同单元**（**这是本批判断课量的关键一条**） |
| **时间家族邻居（对照，本轮复取）** | **初级**：**U96 `still yet already`**／**U97 `and but or so because`**／**U98 `When…`**（逐字 `98When`）／**U99 `If we go… If you see… etc.`**／**U100 `If I had… If we went… etc.`**／**U101 `a person who… a thing that/which…（relative clauses 1）`**／**U102 `the people we met the hotel you stayed at（relative clauses 2）`**／**U104 `from…to until since for`**／**U105 `before after during while`**；**中级**：**U25 `when I do and when I've done if and when`**（逐字 `25whenIdoandwhenIvedoneifandwhen`）／**U113 `although though even though in spite of despite`**／**U114 `in case`**／**U115 `unless as long as provided`**／**U116 `as (as I walked… / as I was… etc.)`**／**U117 `like and as`**／**U118 `like as if`**／**U119 `during for while`**／**U120 `by and until by the time…`** → **Murphy 的时间连词家族是「分散在初级 U98／U104–105 与中级 U25／U116／U119／U120」的两层结构；`as soon as`／`once` 两词在整个家族里都不出现** |
| **`until`／`when`／`while`／`before`／`after`／`soon`（单字复核）** | `until` 初 1（U104 标题）／中 1（U120 标题）；**`when` 初 1（U98 标题）／中 4（U12 `for and since when…? and how long…?` ＋ U25 标题两处 ＋ 全目）**；`while` 初 1（U105）／中 1（U119）；`before` 初 1（U105）／中 0；`after` 初 1（U105）／中 0；**`soon` 三通道全 0** → **`soon` 这个字在 Murphy 双册标题层完全缺席，与 `as soon as` 一致**（**批二十二「`as soon as` 双册全 0」的原因之一：连构词要件 `soon` 都不在册**） |

**Murphy 小结（本轮三条）**：**① `as soon as`／`once`／`soon` 三者在 Murphy 双册全 0——「时间从句的紧接义」在 Murphy 是完全的空白；② `by the time` 有中级 U120 单元位（与 `until` 同单元，标题逐字 `by and until by the time…`）——它是本批「可扩课量」的唯一 Murphy 支撑；③ Murphy 的时间家族把「介词岗」（初级 U104／U105）与「从句岗」（初级 U98／中级 U25）分成两层，且中级 U25 `when I do and when I've done` 是「现在版／完成版表将来」的专单元——这正是我方 L138 之后最贴近的一块。**

### 1.4 中文侧 english.cool（869 篇 sitemap 复算 ＋ 5 篇直连实取）

**取到情况**：本机缓存 `/private/tmp/ec-urls.txt`（**869 行**）／`/private/tmp/ec_slugs.txt`（**855 条唯一 slug**）；本轮**逐词 regex 复算**并**直连复核 5 篇**（`conjunctions` 与 `after` 本机已有全文、`until` 本机已有全文；**本轮新取 `once` 与 `when` 两篇**）。

| # | 篇目 | 取到情况 | 本轮要点（**原文级**） |
|---|---|---|---|
| E-1 | **`https://english.cool/conjunctions/`**（**`as soon as` 的中文侧落点**） | ✅ **本机全文已存（`ec_conjunctions.body.txt`，14,942 bytes）＋本轮逐字复核** | **① 从属连接词总表逐字（本批决策依据）**："**時間關係：when, while, before, after, since, as soon as, until**"——**七项并列**（**批二十二记录「七项并列」本轮成立**）；紧接四组：`因果關係：because, since, as`／`轉折關係：although, though, even though`／`條件關係：if, unless, as long as`；**② `as soon as` 小节逐字**："as soon as 表示「**一…就…**」"＋两例：**`The baby stopped crying as soon as she saw her mother.`（那個小嬰兒一看到媽媽就不哭了）**／**`As soon as I walked out of my house, it started to rain.`（我才踏出家門就開始下雨了）**——**两个例句都是纯过去版（`stopped … saw`／`walked … started`，主句与从句同在过去）**，**即中文侧给出的两例都不含「将来」**（**与我方要做的「主句将来＋从句现在」不同型——这一点须生产期注意：中文侧不给现在版表将来的示范**）；**③ `when` 小节逐字**："when 表示「當…時」，也就是**兩件事是發生在同一時間的**"＋例 `I will tell Peter the news when I meet him tomorrow.`（**主句将来＋从句现在**，**与我方要做的同型**）；**④ `while` 小节**：`My phone rang while I was taking a shower.`（**`phone`／`rang` 同句——替代场景词在跨源也是这个搭配**）／`While my mom was cooking, my dad was setting the table.`＋对比义（`Jay likes to go out, while his wife prefers to stay indoors.`）；**⑤ `before`／`after` 小节**：`Before you left the room, please turn off all the lights.`／`The kid went outside after he finished all the homework.`（**过去版**）；**⑥ 全页无「用现在式代替未来式」的说明**（**批二十二记的「该规则在 `after` 专文」本轮成立**，见 E-2） |
| E-2 | **`https://english.cool/after/`**（**中文侧的 ❌will 规则所在页**） | ✅ **本机全文已存（`ec2_after.html`）＋本轮逐字复核** | **逐字（本批中文侧最硬的一条）**："這裡是大家最容易拿不準的一點：**明明在講「之後」的事，整句卻常常用現在式或過去式，不用未來式。即使是還沒發生的事，after 帶出的那個子句也習慣用現在式代替未來式。所以講「下課後我會打給你」，要寫 `after class ends`，而不是 `after class will end`**。"＋**❌`I'll call you after class will end.` 明标错**；**页末要点条**："👉 當連接詞：後面接完整句子，且**用現在式代替未來式**" → **中文侧把 ❌will 规则写在 `after` 专文，不在 `conjunctions` 总表**（**须分页引用，批二十二已记，本轮复核成立**） |
| E-3 | **`https://english.cool/once/`**（**本轮新取·课量判断的关键页**） | ✅ **本轮 curl 直连实取（HTTP 200）** | **五节结构逐字**：① `once 一次、一回`（频度：`once a/an + 單數時間名詞`／`once every + 單數/複數`，`My teacher checks our assignments once a week.`）；② `once 曾經`（`My father was once the president of this company.`）；③ `once 以前、從前`（含 `once upon a time`）；**④ `once 一旦、只要`（本批依据）逐字**："**once 還可以用來表示「一旦、只要、一…就…」的意思，用來指「某件事只要一發生，另一件事就會跟著發生」的情況。在這裡，once 當連接詞使用，用來連接兩個完整的句子。**"＋三例：**`Once you pass all the tests, you will get a certificate.`**／`Once you have made the decision, there is no turning back.`／`I will call you once we have arrived at the hotel.`；**⑤ `once 其他用法`**（惯用语：`once again / once more`／`once in a while`／`once in a lifetime`／`once in a blue moon`／`at once`／`all at once`）→ **中文侧把 `once` 的「一…就…」义明确标注为「一…就…」——与 `as soon as` 的中文释义逐字相同**（**这是「同义换词」判断的中文侧证据**） |
| E-4 | `https://english.cool/until/`（**L109 的中文侧对照**） | ✅ **本机全文已存（`ec_until.body.txt`，3,088 bytes）＋本轮复核** | 该页只给 `not until` 的**倒装与强调句**（`You will not understand this book until you get older.` ＝ `Not until you get older will you understand this book.` ＝ `It is not until you get older that you will understand this book.`）——**未给「until 从句用现在版表将来」**；**该规则在中文侧仍只在 `after` 专文里**（**故 `until` 侧的 ❌will 引用须落到 Cambridge／BC，不能引中文侧**） |
| E-5 | `https://english.cool/when/` | ✅ **本轮直连实取（HTTP 200）** | 三节：**① `when` 作疑问词**（直接问句＋间接问句，`I'd like to know when I can get my luggage back.`）；**② `when` 作关系副词**（`the month when he worked on the farm.`／`Saturday is the day when Leo usually walks his dog.`，逐字 "文法書稱之為**關係子句**"）；**③ `when` 作「當…時」**（`Jessie moved to New Zealand when she was thirty years old.`）→ **中文侧 `when` 页不以「时间从句连词」为主，第三节最短——`as soon as` 的对照面在中文侧也不厚**（**批二十二记「`when` 与 `as soon as` 只差一个刻度」在中文侧同样成立**） |
| （sitemap 复算） | 869 条 regex 复算（**本轮逐词**） | — | **`once` 命中 1 篇＝`once`（本轮新取，是真专文）**；**`soon` 命中 1 篇＝`get-well-soon`（无关）**；**`as-soon` 命中 0**（**`as soon as` 的落点仍是 `conjunctions` 总表页，其 slug 不含任何相关词——内容级检索才可取到**）；**`by-the-time` 命中 0**（**`by the time` 在 sitemap 层零专文**；**唯一出处是 `by` 专文的「某時間前」节**）；**`until` 命中 2 篇**（`until`／`until-vs-till`）；**`when` 2 篇**（`when`／`when-while`）；**`while` 4 篇**（`meanwhile`／`when-while`／`whereas-while-2`／`while-meanwhile`）→ **中文侧的时间连词篇目分布**：`until`／`when`／`while`／`after`／`once` **各有专文**，**`as soon as` 与 `by the time` 都只有「总表里的一个小节」** |

**中文侧小结（本轮三条）**：**① `as soon as` 的中文侧落点仍是 `conjunctions` 总表（七项并列＋两例），且该总表不含 ❌will 规则（规则在 `after` 专文）；② `once` 本轮取到独立专文，其「一…就…」义的**中文释义与 `as soon as` 逐字相同**——这是「扩到 4 课会变成换词」的中文侧证据；③ `by the time` sitemap 零专文，唯一出处是 `by` 专文的「某時間前」节（逐字例 `By the time he came home, his wife had gone to bed.`）。**

---

## §2 对比表（含 CEFR）

**口径**：**「课程位」＝ BC 三档 68 课标题／Murphy 单元号**；**「规则级落点」＝ Cambridge 语法页／BC 参考层／词典义项**——**两者分开记，不混称**。**我方现状为两文件实测**（`grammarLessons.ts` ＝ GL／`huntCases.ts` ＝ HC，**词边界 `\b` 口径，本轮统一**）。

| 候选 | Murphy（册别＋单元号） | BC（含 CEFR） | Cambridge（含 CEFR） | 中文侧 | 我方现状（GL／HC 复算） |
|---|---|---|---|---|---|
| **① `as soon as`（一…就…·本批首选）** | **双册三通道全 0**（`assoonas`；**且 `soon` 单字也三通道全 0**——连构词要件都不在册）；**时间家族邻居厚**：初 U98 `When…`／U104 `from…to until since for`／U105 `before after during while`；中 U25 `when I do and when I've done if and when`／U116 `as`／U119 `during for while`／U120 `by and until by the time…` | **三档 68 课零课程位**（A1-A2 18／B1-B2 36／C1 14 本轮逐档复点）；**规则级落点在参考层**＝`verbs-time-clauses-if-clauses`（**`Level: beginner`**）**"We do not normally use will in time clauses and conditional clauses."**＋四条 `(NOT …)`；**参考层七主题索引里无 `conjunctions`／`time` 类目**（**参考层无独立页**） | **语法页 `conjunctions-time`**：**九项定义句**（`when, after, before, until, since, while, once, as and as soon as`）＋**首屏九宫格**（`We always have an ice cream as soon as we get to the beach.`）＋**「We can use when, once, as and as soon as…」小节**＋**Warning 框把 `as soon as` 直接作例句**（`Not: … as soon as I will get to the office.`）；**词典独立词条 `as soon as` ＝ B1**（"at the same time or a very short time after"，六例）；**`soon` 本词 A2**／**`as soon as possible` A2**；**语法书整体面向 B1-B2** | **`conjunctions` 专文「時間關係」七项并列**（`when, while, before, after, since, as soon as, until`）＋**两例**（`The baby stopped crying as soon as she saw her mother.`／`As soon as I walked out of my house, it started to rain.`）；**❌will 规则在同站 `after` 专文**（"用現在式代替未來式"，❌`I'll call you after class will end.`）；**sitemap `as-soon` 零专文**（落点靠内容级检索） | **`as soon as` GL 0／HC 0；`soon` GL 0／HC 0（真零）**；**时间家族地板已铺满**：`when`（L92／L97 两课）／`after`（L90）／`before`（L91）／`until`（L109）／`while`（L98）；**接口课全在**：L109 `until`／L92 `when`／L49 `if`（同型时序规则）／L12 `will`；**替代场景词在库**：`phone` GL 56／HC 9（**逐课分布：L99 占 42、L102 占 11、L4／L100／L101 各 1——不在 L109**）、`rang` GL 67／HC 8（**L99 占 50、L102 占 13、L101 占 2、L98／L100 各 1——不在 L109**）、`movie` GL 49／HC 1（**L29 占 24、L109 占 9、L31／L75 各 4、L15／L76 各 3、L38 占 2——散在七课**）、`ended` GL 8（**8 处全在 L109**）／HC 0、`stops` GL 9（**L109 占 8、L94 占 1**） |
| **② `once`（一…就…／一旦）** | **双册三通道全 0**（`once` 初级／中级／中级全目**全 0**）→ **Murphy 双册无任何单元** | **三档 68 课零课程位**（本轮复点） | **有独立语法页 `once`**（"Grammar > Adjectives and adverbs > Adverbs > Time adverbs > Once"）：**连词义逐字 "We use once as a conjunction meaning 'as soon as' or 'after'"**＋**❌will 警告 "We don't use shall or will in the clause with once"**（`Not: Once I will pass …`）；**词典义项两档**：**(ONE TIME) A2**（"one single time"）／**(AS SOON AS) B2**（"as soon as, or from the moment when"）；**同页其他段位**：`at once` C1／`for once` B2／`once again` B1／`(every) once in a while` B2／`once and for all` C2 | **有独立专文 `once`**（本轮新取）：五节结构，**第四节逐字把「一…就…」义列为 once 的第四义**（"**once 還可以用來表示「一旦、只要、一…就…」的意思**"）＋三例（`Once you pass all the tests, you will get a certificate.`／`Once you have made the decision, there is no turning back.`／`I will call you once we have arrived at the hotel.`）；**另三义是干扰项**（一次／曾经／从前）＋一节惯用语 | **`once` GL 11／HC 0，但 11 处全部集中在 L72「多久一次」一课**（逐字 `I read once a month.`／`once a week／twice a week／three times a week`／`once a month` 选项与讲解）——**即 `once` 的「一…就…」义我方 GL 0**；**但它与 `as soon as` 的语义学同一件事**（见 §5.2） |
| **③ `by the time`（到…的时候）** | **初级 0／中级 1**——**唯一命中：中级 U120 标题逐字 `by and until by the time…`**（与 `until` 同单元）；**初级时间介词块＝U104 `from…to until since for`／U105 `before after during while`，均不含 `by the time`** | **三档 68 课零课程位**；**表内落点在 B1-B2 第 8 课 `Future continuous and future perfect`**（逐字 "**by** or **by the time** mean '**at some point before**'"＋唯一例句 **`By the time we arrive, the kids will have gone to bed.`**）；**参考层 `verbs-time-clauses-if-clauses` 全页 `by the time` ＝ 0** | **语法层探测 `by-and-until` 为空壳（HTTP 200 但无正文）→ 未取到独立页**；**落点在 `Future perfect simple` 专页**（"We use the future perfect form when we look back to the past from a point in the future. **We usually use a time phrase, for example by tomorrow, for three years**"，**该页 `by the time` 逐字 0**）；**`until` 页有 `by` 的分工节**（"We use **by**, not until, to talk about something that will happen before a particular time or deadline"，`The movie will be finished by 9 pm.` 对 `Not: … until/till 9 pm.`） | **sitemap `by-the-time` 零专文**；**唯一出处是 `by` 专文的「某時間前」节**，逐字例 **`By the time he came home, his wife had gone to bed.`**（**过去完成视点**）→ **中文侧把它归在「by＝某时间前」的介词义下，不归时间从句家族** | **`by the time` GL 0／HC 0（真零）**；**其语义搭档 `will have` GL 0／HC 0**（批二十二与路线图复验一致）；**`until`／`by` 的切开我方 L109 已教**（L109 `contrast` 第 3 条逐字 ❌`I waited by the rain stopped.`，whyZh「by 是『到某个点之前把事做完』」）；**`movie`／`ended` 在库**（L109 场景句 `We waited until the movie ended.`） |
| **④ `seem`／`appear`（备选 A·C＋）** | **双册三通道全 0**（`seem`／`appear` 均 0） | **课程位零**；**表内落点＝B1-B2 第 30 课 `Stative verbs`**（`appear, be, feel, hear, look, see, seem, smell, taste`）；**⚠️ 表内 `sound` 缺席** | **词典 `seem` ＝ B1**＋**本轮新取到 Grammar 小节逐字**："Seem means 'appear in a particular way'. We can use it as a **linking verb** (like be) or with a **to-infinitive**. **We do not normally use seem in the continuous form**"；**词典 `appear` 的 BE PRESENT ＝ B1**（本轮复取一致）；**批二十二记的 `Appear or seem?` 小节本轮未重取**（见 §7 未核实④） | **`seem` 专文一篇**（七句式＋`appear` 明文分工＋硬禁用 "Appear 後面不能加 like/as if/as though"）；**`appear` 零专文**；**sitemap `appear` 0** | **`seem`／`seems`／`seemed`／`appear`／`appears` 全 0（真零）**；**感官五格已铺满**（`looks`／`sounds`／`smells`／`tastes`／`feels`）——L125–L133 六课已立岗 |
| **⑤ `would rather`（备选 B−）** | **中级 U59 `prefer and would rather`**（**U53–U68 `-ing`／`to` 十六课连续块内，U59 在 U60 之前**）；**初级 0** | **三档 68 课零课程位** | **词典 `would rather` 独立条目标 B1**（"used to show that you prefer to have or do one thing more than another"，注 `(also 'd rather)`）；**同页 `rather` 的另三条段位**：SMALL AMOUNT **B1**／MORE EXACTLY **B2**／`rather than` **B1**（**口径细化见 §6 校正 3**）；**语法专页 `would-rather-would-sooner`** 两条轴＋两条典型错误 | **零专文**（sitemap `rather` 只命中 `rather-than`＝「而不是」义） | **`would rather` GL 0／HC 0；`rather` GL 0／HC 0（真零）**；**语用场已有**：`would` GL 163／HC 11（**`would you like` GL 52**，L62–L66 批九已教）／`let's` GL 60 |
| **⑥ `neither`／`either`／`both`（备选 B−）** | **初 U82 `both either neither`**／**中 U89 `both/both of neither/neither of either/either of`**／**初 U42 `too/either so am I / neither do I etc.`（附和轴，中级无）** | **三档 68 课零课程位** | **三段位本轮逐页复取一致**：`both` **A1**（"（referring to）two people or things together"）／`either` **B1**（**本轮实取到的是 adverb 义 "used in negative sentences instead of 'also' or 'too'"**；determiner 义批二十二记 B1）／`neither` **B2**（"not either of two things or people"）；**两页硬轴**（`both` 不用否定／`neither` 不用 `none`） | **两篇专文＋10 条 ❌**（`both` 六条＋`either-neither` 首屏自测对＋病灶「實在太像了」） | **三项全 0**（`both` 的裸 grep 假阳性全为 `bothRight` 字段名，批十七已复算，本轮复核成立）；**接口课现成**：L25／L34／L26（there be）／L19／L20（连接词家族，**仅 2 课可复现**） |
| **⑦ `will have`（备选 C）** | **中级 U24 `will be doing and will have done`**；**初级 0** | **B1-B2 第 8 课 `Future continuous and future perfect` ＝ 有课程位**（本轮复取一致）；**参考层 0** | **本轮新取到 `Future perfect simple` 专页**（"We use **will/shall + have + the -ed form**"／"**Events finished by a certain time in the future**"／"**look back to the past from a point in the future**"／"**We usually use a time phrase, for example by tomorrow, for three years**"）→ **批二十二 §9.2 未核实④「Cambridge 语法落点须另找」本轮关闭**；**`by the time` 在该页 0 命中** | **`future-perfect-tense` 专文一篇**（`will have + P.P.`＋否定／疑问＋`for` 持续义；**无 ❌、无小試身手**） | **`will have` GL 0／HC 0；`will` 本身 GL 268（L12 已教）；`by the time` GL 0**；**L21 `I have done my homework.` 是同形干扰源**（批二十二已记） |

**表注（三条口径）**：① **「课程位」与「规则级落点」本表分两列内记**——**本批三个时间项（`as soon as`／`once`／`by the time`）课程位全零**，**规则级落点分别落在 Cambridge 语法页（有）／Cambridge 语法页（有）／Cambridge 语法页（无，仅词典＋例句）**；② **CEFR 段位本批新增四条**：`as soon as` **B1**（独立词条页二次确认）／`once (AS SOON AS)` **B2**／`once (ONE TIME)` **A2**／**`soon` A2**——**即「一…就…」的专用式 `as soon as` 比 `once` 的同一义**低一档**（B1 vs B2），**教学顺位 `as soon as` 在前，`once` 在后**；③ **`by the time` 无任何 CEFR 段位**（三源皆无），**这本身是一条判据**（见 §3 序 3）。

---

## §3 三问制正当性表（① 跨源课程位 ② 中文侧实证 ③ 我方接口）

**口径**：①＝**课程位**（BC 三档 68 课／Murphy 单元号）与**规则级落点**（Cambridge 语法页／BC 参考层／词典义项）**分开记**；②＝中文侧**专文或专表**；③＝**我方两文件实测**（含造词成本与切开成本）。档位沿用 A／B／C／D 四档。

| 序 | 候选 | ① 跨源课程位 | ② 中文侧实证 | ③ 我方接口 | 造词成本 | **档** | 判读 |
|---|---|---|---|---|---|---|---|
| **1** | **`as soon as`（一…就…）** | **课程位零**（BC 68 课／Murphy 双册三通道全 0，**含 `soon` 单字**）；**规则级落点最厚**：**Cambridge 语法页九项定义句＋首屏九宫格＋专小节＋Warning 例句位**；**词典独立词条 B1**；**BC 参考层同规则**（"…time clauses and conditional clauses."） | **中—强**：`conjunctions` 专文**七项并列成表**＋两例逐字；**但零专文**（sitemap `as-soon` 0）；**❌will 规则在同站 `after` 专文**（须分页引） | **强**：时间家族五格全铺满（`when` 两课／`after`／`before`／`until`／`while`）；**L109 的 `oneLineRule` 逐字已留口**（"前面一直做，后面那道线一到就停"）；**L49 已教同型规则**（"if 里说现在，主句说将来"）；**L12 已教 will**；`as soon as`／`soon` 双 0 | **1 新词（`soon`）＋ 1 旧词新串（`as soon as`；`as` 已在库）** | **B（维持批二十二判读）** | **可单开 3 课小章（§4.1）**。**本轮补强两条**：① **`when` 的刻度有官方原文**——Cambridge `as-when-or-while` 逐字 "when can mean 'after' or 'at the same time'"＋"We often use **just** with when or as to express things happening at **exactly the same time**"（**说明 `when` 要表「紧接」须借 `just`，`as soon as` 是专用式**，§5.1）；② **CEFR 顺位 `as soon as` B1 ＜ `once` B2**，**教学顺位它在前**（§5.2）。**⚠️ 唯一硬约束不变**：**L109 的形式冲突须先裁**（§4.2／§5.4） |
| **2** | **`once`（一…就…／一旦）** | **课程位零**（BC 68 课／Murphy 双册三通道全 0）；**但规则级落点是「有独立页」**：Cambridge `once` 页（连词义＝"as soon as"；❌will 警告同型）；**词典 (AS SOON AS) B2** | **强**：**独立专文 `once`**（本轮新取），**第四节把「一…就…」列为其一义**＋三例；**但同页另有三义（一次／曾经／从前）＋一节惯用语** | **中**：`once` GL 11 **全部是 L72「多久一次」的一次义**（`once a month` 等）——**「一…就…」义 GL 0**；**接口：L72 已有 `once` 的形（学生认过这个词）** | **0 新词（`once` 已在库 L72）＋ 1 新义（但该义与 `as soon as` 逐字同义）** | **C（不单开）** | **不单开：它与 `as soon as` 是「同义换词」而非新结构。** 决定性证据三条：**① Cambridge 官方把 `once` 的连词义定义为 "as soon as"**；**② 中文侧专文把 `once` 的该义中文释义写成「一…就…」——与 `as soon as` 的中文释义一字不差**；**③ CEFR 上 `once (AS SOON AS)` ＝ B2 ＞ `as soon as` B1**，**即它是同一功能的「更高档表述」**。→ **处置：作 `as soon as` 第 2 课的「换个说法」对照位（不占独立课）**，**或作第 3 课的收口素材**（§4.1） |
| **3** | **`by the time`（到…的时候）** | **课程位：Murphy 中级 U120 有（与 `until` 同单元）**；BC 零课位（**表内落点在第 8 课**）；**Cambridge 语法层无独立页**（探测空壳）；**无任何 CEFR 段位**（三源皆无） | **弱**：**sitemap 零专文**；**唯一出处 `by` 专文「某時間前」节**（`By the time he came home, his wife had gone to bed.`），**且该例是过去完成视点** | **弱**：`by the time` GL 0／HC 0；**语义搭档 `will have` 也 GL 0**；**`until`／`by` 的切开 L109 已教**（❌`I waited by the rain stopped.`）；`movie`／`ended` 在库但**都只在 L109 一课**（`ended` GL 8 全在 L109） | **0 新词 ＋ 1 新串（`by the time`）＋ 须并 `will have`（1 新串）** | **C（并入 §4.3 备选，不进本批）** | **不进本批，理由三条**：**① 它的语义内核是「到那时已完成」**——**跨源两条原文都把它与完成视点绑定**（BC 第 8 课逐字 "at some point before"＋例句 `By the time we arrive, the kids will have gone to bed.`；中文侧唯一条例 `had gone to bed`）；**② 与我方零底座的 `will have` 绑定**（`will have` GL 0／HC 0，批二十二判 C）；**③ 无 CEFR 段位**（三源皆无）——**段位证据比 `once` 还薄**。→ **它不构成 `as soon as` 的第 4 课**（**语义轴不同：「紧接」vs「截止前完成」**），**而是独立的一条线** |
| **4** | **`seem`／`appear`（看起来好像）** | **课程位零**（BC 68 课／Murphy 双册全 0）；**表内落点 BC `Stative verbs`**；**词典双 B1**；**本轮补到 Cambridge `seem` 的 Grammar 小节**（"use it as a linking verb (like be) or with a to-infinitive"／"do not normally use seem in the continuous form"） | **强**：`seem` 独立专文（七句式＋分工＋硬禁用） | **强**：与 L128 `It ＋ 动词 ＋ 形容词` 同骨架，**只换动词**；感官五格已铺满；两文件全 0 | **2 新词（`seem`＋`appear`）＋ 0 附带（本批最低成本）** | **C＋（维持批二十二判读）** | **维持备选 A**：**课程位仍零**＋**与 L125「看起来」的语义距离小**（第 1 课有重复风险）→ **不作首选**。**本轮口径变化**：Cambridge 的 Grammar 小节原句**给了它一条可用的「同骨架」证据**（`seem` 可当 linking verb 用，**与我方 L125–L133 的 `look／sound／smell／taste／feel` 同型**）——**但它同时带来一条新约束**（"do not normally use seem in the continuous form"，**而这句在零术语下不能教**，路线图已记） |
| **5** | **`would rather`（宁愿）** | **课程位零**（BC）；**Murphy 中级 U59**；**词典 `would rather` 标 B1**（**本轮口径细化：它挂在 `rather` 条下，同页另有三个 `rather` 段位**，§6 校正 3） | **弱**：**零专文**（`rather-than` 是另一义） | **中**：`would rather`／`rather` 双 0；**语用场已有**（`would you like` GL 52） | **1 新词（`rather`）＋ 1 旧词新岗（`would`）** | **B−（维持）** | **维持：2 课封顶**（同人版／换人版），**第 3 课只能靠「与 would like 切开」撑，而那是换词**；**中文侧零专文是硬伤** |
| **6** | **`neither`／`either`／`both`（三连体）** | **课程位零**（BC）；**Murphy 初 U82／中 U89＋初 U42 附和轴**；**三段位齐（A1／B1／B2）本轮复取一致** | **强**：两篇专文＋10 条 ❌ | **中**：三项全 0；**连接词家族只有 L19／L20 两课可复现** | **4 新词（`both`／`neither`／`either`／`nor`）→ 超先例上限（批二十 3 个）** | **B−（维持）** | **维持：3 课封顶，第 3 课必须是「否定位置」这条轴**；**成本四候选里最高** |
| **7** | **`will have`（将来完成）** | **课程位「有」**：BC B1-B2 第 8 课＋Murphy 中级 U24；**本轮补到 Cambridge `Future perfect simple` 专页**（批二十二 §9.2 未核实④**本轮关闭**） | **中**：`future-perfect-tense` 专文（**无 ❌／无小試身手**） | **弱**：`will have`／`by the time` 双 0；**L21 是同形干扰源** | **0 新词 ＋ 1 新串** | **C（维持，理由仍为「课程位在但场景不在」）** | **维持不单开**：将来完成要求「到那时已经做完」的完成视点，**与「小美的一天」单日线叙事不合**；**且 U24 属中级册（跨级）**。**本轮新增一条**：**Cambridge 的 `Future perfect simple` 页把它的搭档写成「time phrase：by tomorrow／for three years」——即 `by the time` 不是必需，`by ＋ 时间点` 也行**（**这降低了 `by the time` 的并入必要性**，§4.3） |

**三问制小结（一句话）**：**本批候选池的档位是「B（`as soon as`）／C（`once`·`by the time`）／C＋（`seem`／`appear`）／B−（`would rather`·三连体）／C（`will have`）」——与批二十二的结构性判断一致：没有任何一项有 BC 课程位；`as soon as` 仍是唯一「跨源四层全到、我方地板已铺好」的项。本轮的新增结论是：`once` 与 `by the time` 都**不能**作 `as soon as` 的第 4 课——**前者是同义换词（§5.2），后者是另一条语义轴且绑定 `will have`（§4.3）**。**

---

## §4 大章节组合建议

### 4.1 首选方案：**小章 3 课「电话一响我就打给你」（L142–L144）——`as soon as` 单拱**

**课量与档位**：**3 课（维持批二十二路线图 §6.2 序 1 的圈定）**。**理由先明写（三条）**：
1. **内容自然容量＝2 格（立岗／切开）＋1 格收口＝3 课**，**且第 3 格是「收口课」——`grammarLabel` 含「收口」全库 15 课，其中 L94 起连续九季每季一课（L94／L102／L110／L118／L124／L127／L133／L138／L141）**——**批二十二交的 L141 是连续第九课；本批 L144 将是第十课**（**逐条 regex 复算，见附录 B**）。
2. **不能是 2 课**：**`as soon as` 与 `when` 的语义只差一个刻度**（Cambridge `as-when-or-while` 逐字 "when can mean 'after' or 'at the same time'"，**要表「紧接」须借 `just`**）——**这个刻度差不做成一课，本结构就没有独立存在的理由**（**它是「同一位置的两种紧密度」，不是一个新结构**）。→ **切开课必须独立成课**（路线图 §6.2 的裁决，本轮从跨源再确认）。
3. **不能是 4 课**：**第 4 课只能从 `once` 或 `by the time` 里取，而两者本轮都判不可用**——`once` 是**同义换词**（§5.2 三条证据），`by the time` 是**另一条语义轴且绑定 `will have`**（§3 序 3）。→ **4 课会破坏「一课一增量」**。

**逐课表（课号-主题-增量-接口，接口逐条落到已有课）**：

| 课号 | 主题 | 增量（一课一增量） | 接口（与已有课的显式连接，全部落到现库） |
|---|---|---|---|
| **L142** | **「电话一响我就打给你」**（`as soon as` 立岗：**一…就…**；后面跟**小句子**；**主句说将来、从句说现在**） | **新词 `soon` 上线（全批唯一新词）＋ `as soon as` 整体当「一…就…」用**；**本课只碰一件将来事**：**`As soon as the phone rings, I will call you.`**（**替代场景，理由与逐词实算见 §4.2**；**主句 `I will call you` 零新串——L12 与 L141 各有逐字在库**） | **① 接 L109 `until`**：同一家族第五格，**L109 `oneLineRule` 逐字「前面一直做，后面那道线一到就停」**——**本课是「一到就做」，同一道线、两个方向**；**② 接 L49 `if`**：**同型时序规则**（L48 逐字 "if 里说现在（If it rains），主句说将来（I will stay）"＋L49 `oneLineRule` 逐字 "if 里说现在"）——**本课是这条规则的第二次应用**；**③ 接 L12 `will`**（**L12 `examples` 逐字 `I will call you tomorrow.`，且 L141 `examples` 已把它作复现引句**）；**④ 接 L99 `I was reading when the phone rang.`**——**同一个 `phone`＋`rang` 场景**（`phone` GL 56／`ring` GL 9 里 L99 占 8）；**⑤ 场景词实算**：`phone` GL 56／HC 9（**不在 L109**）、`ring` GL 9／HC 3、`I will call you` GL 8／HC 0（**零新串**）、`the phone rings` **全库 0 处（新串 +1，两词都已教过）**；**⚠️ 不用 `answer it`**（`answer it` 全库 0 处、`answer` 作英文语料仅 2 句——见 §7 未核实⑥） |
| **L143** | **「当…的时候 vs 一…就…」**（**切开课**：`when` 说「那时候」／`as soon as` 说「紧跟着」——**同一个位置、两句话只差一格**） | **零新词，只有一条刻度**：**`when` 可以兼表「当…时／之后」（Cambridge 逐字 "when can mean 'after' or 'at the same time'"），要表「分毫不差」得加 `just`（逐字 "We often use just with when or as to express things happening at exactly the same time"，`The phone always rings just when I'm closing the front door.`）；`as soon as` 是「紧接」的专用式**。**对照句**：`When the phone rings, I call you.`（每次都这样）／`As soon as the phone rings, I will call you.`（一响就打，紧跟着；**主句具体动作由生产期定，须避开 `answer it`——见 §4.2 约束 2**） | **① 直接切开 L92 `when`**（L92 `oneLineRule` 逐字 "它跟 after/before 是同一个三人组（后面都跟一整句）"——**本课把这个「三人组」升级为「同位置、不同紧密度」**）；**② 复用 L97 `when` 的第二个用法**（`When you called, I was reading.`——**L97 的 when 是「插进来的小事」，与 L143 的 when 是「每次都这样」形成三面**）；**③ 接 L109 的 `by` 对照**（**L109 已教「`by` 是到某点前做完、`until` 是等到」——本课再加「`when` 是那时、`as soon as` 是紧接」，形成四词同台的刻度尺**）；**④ 零造词**（全部用现库词） |
| **L144** | **「时间家族排一行」（收口·零新知）** | **零新知**：把本章两格与家族五格排一行——`after`（L90）／`before`（L91）／`when`（L92·L97）／`while`（L98）／`until`（L109）／**`as soon as`（L142·L143）**；**并把 `once` 作「换个说法」认读位**（**不占独立课，理由 §5.2**） | **① 直接照 L141 的收口骨架**（L141 `grammarLabel` 逐字 "收口 · 零新知（两张脸排一行）"／`oneLineRule` 逐字 "这一章两张脸排一行"）；**② 复现接口**：**L109 的 `deepDive` 标题逐字已是「时间家族排一行」**（L109 `deepDive.title` ＝ `时间家族排一行`，段落逐字 "第 90 课 after、第 91 课 before、第 92 课 when——它们都是「领一整句」的老成员。今天 until 入伙，是第四名"）——**L144 是同一块屏的第二次使用，须明写差异**（**L109 排 4 名，L144 排 6 名＋1 个换说法**）；**③ 六格各配一条 `bothRight` 对照**（照 L109 `contrast` 里三条 `bothRight` 的做法） |

**备选（同章内的顺序变体，供生产期择一）**：**① 切开前置**——L142 先切开（`when` vs `as soon as`）再立岗，**风险：学生尚不知 `as soon as` 是什么就切开**（**不推荐**）；**② 收口并进第 2 课**——**风险：2 课章无我方先例，且切开课与收口课并课会让「刻度」被家族表冲淡**（**不推荐**）。

### 4.2 L109 形式冲突的处置（**必须先裁**，本轮三条处置＋推荐）

**冲突原文（本轮实读 L109 `contrast` 逐字）**：
- **第 1 条**：❌`I waited until the rain stops.`（`wrongMark: "stops"`）→ ✅`I waited until the rain stopped.`，`whyZh` 逐字 "**前面用了昨天版 waited，后面也得跟昨天版：until the rain 【stopped】。**"
- **第 2 条**：❌`I waited until the rain will stop.`（`wrongMark: "will"`）→ ✅ 同上，`whyZh` 逐字 "「等到…为止」后面不请 will——用昨天版 【stopped】。"
- **第 4–6 条是 `bothRight`**（`as`／`when`／`while` 各一条认读）。

**跨源参考（本轮取到，§5.4 详列）**：**跨源对「同一从句的现在版／过去版」不做一刀切，而是「按主句时间切换版本」**——Cambridge `until` 页把三种情况分列（现在版表将来／完成版表将来／**过去版讲过去**，`He was the headteacher until he retired in 1968.`）；**且同页首屏例用 `rain` 配 `until` 且用现在版**（"**Let's wait here till the rain stops.**"）——**即跨源里 `the rain stops` 与 `until` 同框恰恰是正确的**。

**三条处置（照路线图 §6.3 携带项 1 的三条，本轮补跨源判定）**：

| 处置 | 内容 | 跨源判定 | 成本 | 推荐 |
|---|---|---|---|---|
| **① 换场景（路线图建议）** | 不用 `rain`，改 `The phone rings`／`The movie ends` 型，把「雨停」留给 L109 专属 | **跨源支持，但我方词架须按逐词实算收窄**：**`phone` GL 56／HC 9（逐课分布 L99 占 42、L102 占 11、L4／L100／L101 各 1——`phone` 不在 L109）＋ `ring` GL 9／HC 3（L99 占 8、L102 占 1）** → **`the phone rings` 全库 0 处（须新串，但两词都已教过、且 `rang`／`ring` 的「响」义 L99 已立岗）**；**`movie` GL 49（散在 L29／L109／L31／L75／L15／L76／L38 七课）／`ended` GL 8（全在 L109）**；**⚠️ 路线图原文提的 `I get the letter` 本轮实算须修正：`the letter` 全库 0 处、`letter` GL 8（全在 L23／L52／L53）＋HC 2，`get` GL 597／HC 47——即「letter」在库但在别的场景里，「get the letter」是新串** | **0 造词；1 处新串（`the phone rings`）** | **✅ 推荐**（**约束须按本轮实算重写**——见下「推荐方案的具体写法」） |
| **② 保留 `rain` 但显式指认** | `oneLineRule`／`deepDive` 逐字引用 L109 的「两边都得用昨天版」并补「今天前面说的是将来，所以后面用现在」 | **跨源支持度最高**（Cambridge `until` 页正是这样教的：同一 `until` 按主句时间分三种）**但我方成本最高**：**须在 L142 里同时出现「昨天版」与「今天版」两套判据**，**对零基础学生是「同一位置两种命运」的正面冲撞**，**且 L109 的第 1 条 ❌ 会直接读成「L142 教的是错的」** | **0 换词；1 处高难讲解＋须回改 L109 的 `whyZh` 使其自限**（"前面用了昨天版"——**加「这条只在过去的故事里成立」**） | ⚠️ **次选**（**若主理人愿回改 L109 文案，此方案教学价值最高**） |
| **③ 换词性** | 改 `It stops raining` | **本轮实测：全库 0 处**（`stops raining`／`stop raining` 逐字 0）——**即引入一个新搭配** | **0 造词但 +1 新串** | ❌ **不推荐**（**为了绕开一个冲突而新开一个搭配，不划算**） |

**推荐方案的具体写法（① 换场景，本轮补四条约束——每条都是本轮逐词实算的结果）**：
1. **L142 的出场句不得含 `rain`／`stops`／`ended`**——**建议 `As soon as the phone rings, I will call you.`**：**`phone` GL 56／HC 9（不在 L109）＋ `ring` GL 9／HC 3（L99 已教「响」）＋ `I will call you` GL 8／HC 0（L12 的 `I will call you tomorrow.` 逐字在库，L141 `examples` 里还作过复现引句）** → **主句 `I will call you` 是**零新串**（**跨源也有同句：Cambridge `conjunctions-time` 的 Warning 例句逐字就是 `I will call you as soon as I get to the office.`**）。**⚠️ 若坚持用 `answer it`：`answer` 作英文语料在库只有 2 句（L34／L35）、`answer it` 全库 0 处、HC 0 处——须另造一个搭配，不建议**（详见 §7 未核实⑥）。
2. **若出场句要保留「到家」义**（**跨源最常用：`when I get home`／`I'll come home when I finish work.`**）——**`home` GL 304／HC 53、`get` GL 597／HC 47，但 `get home` 全库 0 处** → **属新串（两词都教过、搭配未出现）**，**可用但须计入「新串 +1」**。
3. **L144 收口课若做家族表，横排例句里不得再放「雨停」**——**改放 L90–L109 各自的原句**（**这些句子全在库、逐字可取**）。
4. **L142 的第 2 条 `contrast`（❌will）须写清「后面不请 will」与「后面用现在版」，但不得引用「两边版本要一致」这条 L109 的判据**——**即把 L109 的判据限定在过去的故事里**（**这一步须回改 L109 的 `whyZh` 或由 L142 明写「那条规矩只在讲过去时用」**）。

### 4.3 备选方案（**按优先级，课量与理由明写**）

| 序 | 备选 | 课量 | 理由（本轮口径） | 前置条件 |
|---|---|---|---|---|
| **备选 A** | **`seem`／`appear`（3 课小章）** | **3 课** | **维持批二十二判读（C＋）**：**课程位仍零**（BC 68 课／Murphy 双册全 0），**但词典双 B1 ＋ 专节 ＋ 中文专文 ＋ BC 表内落点四条在**；**本轮新增一条可用证据**：Cambridge `seem` 的 Grammar 小节**逐字承认它可以当 linking verb 用（"We can use it as a **linking verb** (like be) or with a **to-infinitive**"）——与我方 L125–L133 的五格同骨架，只换动词、不新骨架** | **须回答与 L125 `It looks nice.` 的语义距离**（"看起来" vs "好像" 对零基础几乎同义）；**须造 2 词**（`seem`＋`appear`）；**BC 的 `Stative verbs` 规则不可教**（撞零术语红线的「时态」） |
| **备选 B** | **`would rather`（2 课，无收口位）** | **2 课** | **维持 B−**：词典 `would rather` B1 ＋ Murphy 中级 U59 ＋ 专页两条轴（同人／换人）；**但第 3 课无增量**（只能靠与 `would like` 切开撑，而那是换词）；**中文侧零专文** | **须造 `rather` 1 词**；`would` 已在库（GL 163／`would you like` GL 52） |
| **备选 C** | **`neither`／`either`／`both`（3 课，第 3 课须为否定位置轴）** | **3 课** | **维持 B−**：三段位齐（A1／B1／B2）＋Murphy 初 U82／中 U89＋初 U42＋中文侧 10 条 ❌；**成本最高**（4 新词超先例上限，批二十 3 个已最高） | **⚠️ 须主理人先裁「造词上限政策」**（路线图 §6.2 末已提） |
| **备选 D** | **`by the time`（不进本批，独立成线）** | **0 课（本轮）** | **本轮新判**：**Murphy 中级 U120 有单元位（与 `until` 同单元）**，**但 Cambridge 语法层无独立页、三源无 CEFR、中文侧零专文**；**且语义绑定完成视点**（BC 第 8 课逐字 "at some point before"＋例句 `By the time we arrive, the kids will have gone to bed.`）——**须并 `will have` 一起做**（`will have` 判 C） | **若未来做，须并造 `by the time`＋`will have` 两串，且须解决「单日线叙事用不上完成视点」**（路线图 §6.2 序 8 已记） |
| **备选 E** | **`once`（作认读位，不单开）** | **0 课（折入 L144 收口）** | **本轮新判**：**同义换词**（§5.2 三条证据）；**但它的形我方已有**（`once` GL 11 全在 L72 的「一次」义）→ **作 L144 的「换个说法」认读位最合适**（**零造词、零新课**） | **须在 L144 明写「`once` 的另一个意思是『一…就…』，跟今天这只同义」**——**注意：不得教成新结构** |

**⚠️ 课量对照（一句话）**：**首选 3 课（L142–L144）；批二十二圈定的 3 课在本轮跨源复核后维持不变**——**「能否扩到 4 课」的答案是否定的，两条可能的第 4 课来源（`once`／`by the time`）本轮双双否决**（**前者同义换词，后者另轴且绑定 C 档的 `will have`**）。

---

## §5 `as soon as` 专节

### 5.1 与 `when` 的语义刻度（**这是它唯一的独立价值**）

**跨源三条原文（本轮全部直连实取）**：
1. **Cambridge `conjunctions-time` 的并列与小节**：定义句把 **`when` 与 `as soon as` 放在同一个九项表里**（`when, after, before, until, since, while, once, as and as soon as`），**且「When, once, as soon as」小节把二者并作同一类**："We can use when, once, as and as soon as to talk about **a specific point in time** when something happened or will happen"——**即跨源承认二者是「同一功能的两个刻度」，不是两个结构**。
2. **Cambridge `as-when-or-while` 给出刻度的操作定义（本批最有价值的一条）**：逐字 "**We can use when to introduce a single completed event that takes place in the middle of a longer activity or event.**"／"**Depending on the context, when can mean 'after' or 'at the same time'**"（`When you open the file, check the second page.`＝after）／"**We often use just with when or as to express things happening at exactly the same time**"（**`The phone always rings just when I'm closing the front door.`**）→ **刻度尺：`when`＝「那时」或「之后」（松）；加 `just` 才到「分毫不差」（紧）；`as soon as` ＝「紧接」的专用式**。
3. **中文侧 `conjunctions` 的两个释义并列**：`when` 逐字 "表示「當…時」，也就是**兩件事是發生在同一時間的**"（`I will tell Peter the news when I meet him tomorrow.`）／`as soon as` 逐字 "表示「**一…就…**」"（`The baby stopped crying as soon as she saw her mother.`）→ **中文释义的差别恰好就是那个刻度**（「当…时」vs「一…就…」）。

**刻度的教学化（零术语口径，供生产期）**：**不出现「从句／连词／副词」等术语**——**用我方现成话术**（`when` 已在库的讲法是「同一个三人组」／`until` 的讲法是「那道线一到就停」）。**建议口径**：**`when` ＝「那时候」（两件事碰上了，谁先谁后不强调）；`as soon as` ＝「紧跟着」（前脚一抬、后脚就到）**。**判定句**：**「能换成 `when` 而意思几乎不变 → 是 `when` 的场合」**；**「要说『一刻也不等』→ 才是 `as soon as`」**。

**⚠️ 本刻度的风险（须生产期正面处理）**：**「只差一个刻度」既是它的独立价值，也是它最容易被读成「换词」的地方**——**所以第 2 课（L143 切开课）必须把刻度做成那节课的**唯一**增量，不得再叠任何新词或新形式**（**否则刻度会被淹没**）。

### 5.2 与 `once`／`by the time` 的关系（**课量依据**）

**① `once` ＝ 同义换词（三条证据，逐条落到原文）**

| # | 证据 | 原文（逐字） |
|---|---|---|
| 1 | **Cambridge 官方把 `once` 的连词义定义为 `as soon as`** | **语法页 `once`**："**We use once as a conjunction meaning 'as soon as' or 'after'**"；**词典 `once (AS SOON AS)` B2**："**as soon as, or from the moment when**"；**US 词典 `once conjunction (AS SOON AS)`**："as soon as, or when"（`Once you've tried their ice cream, you'll be back for more.`） |
| 2 | **中文侧专文把 `once` 的该义中文释义写成「一…就…」——与 `as soon as` 一字不差** | `once` 专文逐字："**once 還可以用來表示「一旦、只要、一…就…」的意思**"；**而 `conjunctions` 专文给 `as soon as` 的逐字是 "as soon as 表示「一…就…」"**——**两条中文释义完全相同** |
| 3 | **CEFR 上 `once` 反而更高（B2 ＞ B1）** | `once (AS SOON AS)` **B2** vs `as soon as` **B1** → **它是「同一功能的更高档说法」，不是新结构**；**且 `once` 一旦进入教学，「一次」义（A2）与「曾经」义会同时在场**（中文侧专文五节里有三节是干扰义） |

→ **结论：`once` 不能作第 4 课**。**处置：作 L144 收口课的「换个说法」认读位（零课量）**——**同时它也是「我方词形已在库」（L72 的 `once a month`）的顺水人情**。

**② `by the time` ＝ 另一条语义轴（不是「紧接」，是「截止前完成」）**

| # | 证据 | 原文（逐字） |
|---|---|---|
| 1 | **BC 把它与完成视点绑定** | B1-B2 第 8 课：`by` or `by the time` mean "**at some point before**"；**唯一例句** `By the time we arrive, the kids will have gone to bed.` |
| 2 | **中文侧唯一条例是过去完成** | `by` 专文「某時間前」节：**`By the time he came home, his wife had gone to bed.`** |
| 3 | **Murphy 把它与 `until` 放同一单元** | 中级 **U120 标题逐字 `by and until by the time…`**——**即 Murphy 的归类是「by／until 的分工」＋「by the time」**，**与 `while`／`as`／`during` 那组（U116／U119）分开** |
| 4 | **它无任何 CEFR 段位**（三源皆无） | — |

→ **结论：`by the time` 不属本批**。**它与 `as soon as` 的差别不是刻度而是轴**：**`as soon as` 管「前一发生，后立刻」（两个动作贴在一起）；`by the time` 管「到那个点，事情已经完了」（一个动作相对一个时间点的完成状态）**。**且它必须并 `will have`（GL 0／HC 0）一起做**。

**③ 课量结论（一句话）**：**`as soon as` 的 3 课，两格（立岗／切开）来自它自己的两件事（一个新词＋一条刻度），第三格是「连续第十季收口课」这条我方既有形态；`once` 与 `by the time` 都不提供第 4 格。**

### 5.3 ❌will 规则的三源原文

| # | 源 | 逐字原文 | 备注 |
|---|---|---|---|
| **1** | **Cambridge `conjunctions-time`（Warning 框）** | "**We don't use will after conjunctions referring to future time**"＋**两条例句**：`When people walk into the room, they will feel something special.`（`Not: When people will walk into the room …`）／**`I will call you as soon as I get to the office.`（`Not: … as soon as I will get to the office.`）** | **`as soon as` 是该 Warning 的第二条例句——即跨源把它直接放在❌will 的示范位**（**本批最硬的一条**） |
| **2** | **BC 参考层 `verbs-time-clauses-if-clauses`** | "**We do not normally use will in time clauses and conditional clauses.**"＋**四条全带 `(NOT …)`**：`I'll come home when I finish work. **（NOT will finish work）**`／`We won't be able to go out if it rains. **（NOT will rain）**`／`It will be nice to see Peter when he gets home. **（NOT will get home）**`／`You must wait here until your father comes. **（NOT will come）**`；**例外**："but we can use will if it means **want to** or **be willing to**" | **BC 是全称式规则**（不分连词），**且全页 `as soon as` ＝ 0**——**即 BC 不为 `as soon as` 单开一句，但规则覆盖它** |
| **3** | **中文侧 `after` 专文** | "**明明是講「之後」的事，整句卻常常用現在式或過去式，不用未來式。即使是還沒發生的事，after 帶出的那個子句也習慣用現在式代替未來式。所以講「下課後我會打給你」，要寫 `after class ends`，而不是 `after class will end`。**"＋**❌`I'll call you after class will end.` 明标错**；要点条："當連接詞：後面接完整句子，且**用現在式代替未來式**" | **中文侧的规则在 `after` 专文（不在 `conjunctions` 总表）**——**`until` 专文与 `once` 专文均未给该规则**，**故中文侧引用须落到 `after` 篇** |
| **（补）** | **Cambridge `once` 页（同型警告）** | "**We don't use shall or will in the clause with once**"（`Once I pass all my exams, I'll be fully qualified.` 对 `Not: Once I will pass …`） | **同规则在 `once` 页重现——说明它是「时间连词」的通用规则** |
| **（补）** | **Cambridge `until` 页（同型三档）** | "**We use present verb forms to refer to the future after until**"（`Not: … until the summer holidays will begin.`）／"**We also use the present perfect after until**"（`Not: … until Donna will have finished.`）／"**We use the past simple and past perfect to talk about events in the past**" | **同规则在 `until` 页重现，且带「过去版」第三档——这正是 §5.4 的参考** |

### 5.4 「L109 形式冲突」的跨源参考（**跨源教材怎么处理「同一个从句用现在版 vs 过去版」**）

**跨源的一致做法是三条，且三条方向相同**：

| # | 跨源做法 | 原文（逐字） |
|---|---|---|
| **1** | **按主句时间切换从句版本（不是一刀切）** | **Cambridge `until` 页**把同一 `until` 分三档并列：**现在版表将来**（`I can't wait until the summer holidays begin.`）／**完成版表将来**（`We'll sit here till Donna has finished.`）／**过去版讲过去**（**`He was the headteacher until he retired in 1968.`**／`We couldn't put down the new floor till the plumber had finished.`）→ **即「版本」由主句的时间决定，**不是我方 L109 记的「前后两版必须一致」** |
| **2** | **同一页面把两个版本并排演示（不互相判错）** | **Cambridge `conjunctions-time` 首屏九宫格**：第 7 行 `I'll call you once I arrive.`（现在版表将来）与第 1 行 `She was in a bad car accident when she was young.`（过去版讲过去）**并排在同一张表里**；**`once` 页亦然**：`Once I pass all my exams, I'll be fully qualified.`（现在版）与词典 `Once I've found somewhere to live I'll send you my address.`（完成版）**并存** |
| **3** | **「雨停」与「现在版」在跨源里是正配，不是错配** | **Cambridge `until` 页首屏例句逐字**："**Let's wait here till the rain stops.**（till + subordinate clause）"——**跨源用「雨停」配 `until` 时用的是现在版 `stops`**；**而 `conjunctions-time` 的 Warning 又用 `as soon as` 示范同样的事**（`I will call you as soon as I get to the office.`）→ **即「`the rain stops` 配 `until`」与「`as soon as I get`」在同一体系里都是对的，差别只在主句版本** |

**对我方设计的直接含义（三条）**：
1. **L109 的第 1 条 ❌ 在法律上没错，但它的 `whyZh` 把范围写宽了**——逐字 "前面用了昨天版 waited，后面也得跟昨天版" **读起来像通用规则，实际只在「讲过去」时成立**。**建议回改 L109 的 `whyZh` 加一句限定**（**例如「这条只在讲过去的事时成立」**），**否则 L142 的 `stops` 会与之正面冲突**。
2. **跨源支持我方采用「换场景」之外的另一种做法**：**把「版本随主句走」做成本章的一条明规则**（**这恰好就是 L143 切开课可以承载的第二条刻度**：**「从句穿什么版本，跟着主句的时间走」**）——**若主理人愿回改 L109 文案（处置 ②），这条规则可以在 L142／L143 里正面教**。
3. **L142 无论如何都必须有一条 ❌will 的对照**（**三源齐，是本结构最硬的考点**），**且该 ❌ 与我方 L109 的第 2 条 ❌（`until the rain will stop.`）同型**——**两课的 ❌ 必须显式互认（「L109 那条也讲过同一个道理」），否则会被读成两套规矩**。

---

## §6 口径校正（本轮 5 条，逐条写清「原文是什么」与「影响面」）

| # | 批二十二口径 | 本轮原文（逐字） | 影响面 | 处置 |
|---|---|---|---|---|
| **1** | **`conjunctions-time` 的同小节句引作 "We use when, once and as soon as to talk about a specific point in time…"**（**记「三项并列」**） | **本轮 curl 直连取到的原文是**："**We can use when, once, as and as soon as to talk about a specific point in time when something happened or will happen**"——**① 有 `can`；② 四项并列（多 `as`）** | **判档不受影响**（`as` 本就是我方已在库的形，且 L65 `as tall as` 占 `as` 的 87%）；**但「同小节恰好三项」这一表述不成立** | **改口径为「同小节四项：`when`／`once`／`as`／`as soon as`」**；**引用一律用本轮原文**。**批二十二 §0 序 1 与 §2 表①的引文须回改**（**建议在路线图 §6.2 序 1 一并回改**） |
| **2** | **非谓语补条引作 "These conjunctions can also be followed by -ing or -ed forms instead of subject + verb."** | **原文**："**Many of these time conjunctions can be followed by -ing or -ed forms instead of subject + verb.**"——**① 是 `Many of these time conjunctions`；② 是 `can be followed`（无 also）** | **判档不受影响**（**且 `-ing` 形式在零术语下基本不可教**——它是下一步的素材） | **引用改用本轮原文**；**并记一条**：`Many of these` 这个限定词**恰好支持我方「不教非谓语形式」的处置**（**跨源自己说不是全部**） |
| **3** | **「词典 headword `would rather` 独立标 B1」** | **本轮直连原文**：`would rather` **确标 B1**（"used to show that you prefer to have or do one thing more than another"），**但它出现在 `rather` 条下（PREFERENCE 义项区），同页另有 `rather` 的三条段位**：SMALL AMOUNT **B1**（"quite; to a slight degree"）／MORE EXACTLY **B2**（"more accurately; more exactly"）／`rather than` **B1**（"instead of"） | **判档不受影响**（B1 成立） | **口径细化**：**「`would rather` 是 `rather` 条内的一个 B1 落点，不是独立 headword 页」**——**含义：`would rather` 在词典层没有自己的一页**（**与 `as soon as` 本轮取到独立页（C-4）形成对比**）。**批二十二 §0 序 3 的「独立 headword」措辞须收窄** |
| **4** | **Murphy 检索方法记作「去空白归一化后逐词 grep」（批二十二 §1.3 的方法级校正 1）** | **本轮实测：仅有归一化不够——不删空白时全部候选返回 0；但 `grep` 在归一化后的长行上仍会按「二进制文件」处理而假 0，须加 `-a`**（**本轮实测：不加 `-a` 时 `assoonas`／`once`／`bythetime` 全 0，加 `-a` 后 `bythetime` 取到 2 处真命中**） | **方法面**：**若不加 `-a`，本批会误判 `by the time` 在 Murphy 双册为零**（**而它实际有中级 U120 单元位——这是本批课量判断的关键一条**） | **方法口径升级为「`tr -d` 去空白 ＋ `grep -ao`」**（**批二十二 §1.3 的方法级校正 1 须补这一条**） |
| **5** | **批二十二 §9.2 未核实④：`will have` 的 Cambridge 语法落点「须另找」** | **本轮找到并实取**：`grammar/british-grammar/future-perfect-simple-i-will-have-worked-eight-hours`（**逐字**："We use **will/shall + have + the -ed form** of the verb."／"**Events finished by a certain time in the future**"／"**look back to the past from a point in the future**"／"**We usually use a time phrase, for example by tomorrow, for three years**"） | **该未核实项本轮关闭**（**批二十二「须另找」不再成立**）；**`will have` 的档位不变（C）** | **关闭批二十二 §9.2 未核实④**；**并记一条新事实**：**该页把搭档写成「time phrase: by tomorrow／for three years」——`by the time` 不是必需**（**这降低了 `by the time` 并入的紧迫性，§3 序 3 已用**） |

**另有一条「不校正但要登记」的**：**批二十二 §0 序 1 记「Cambridge 词典 `soon` 条给 `as soon as` 独立标位 B1」——本轮复核成立**；**但本轮进一步取到 `as soon as` 的独立词条页 `dictionary/english/as-soon-as`**（**批二十二用的是 `soon` 页的附属条**）→ **两条证据并存，非校正，是补强**（**见 §2 表注②**）。

---

## §7 未核实声明（6 条，逐条写清「为什么没核」与「影响面」）

| # | 未核实项 | 原因 | 影响面 | 建议 |
|---|---|---|---|---|
| **①** | **仓库工作区为非提交状态**（`git status` ＝ ` M`，**`src/data/grammarLessons.ts`／`huntCases.ts`／`grammarSeasons.ts` 三文件均在修改列表中**） | **本轮为只读研究，未做提交**（**沿用批二十一／二十二的口径**）；**所有复算均在同一时点完成**（本轮实读 mtime ＝ 2026-09-19 23:5x） | **本轮全部计数（141 课／150 案／22 季／各词 GL／HC）都基于该未提交快照**；**若生产期落盘，须以落盘后时点重算** | 生产期登记（**与批二十一／二十二同一项，不新增**） |
| **②** | **`by the time` 在 Cambridge 语法层无独立页** | **`grammar/british-grammar/by-and-until` 探测为 HTTP 200 但内容为模板空壳（5,097 bytes，正文全为导航）**——**无法区分「该 slug 不存在」与「该页被折叠」**；**另探 `no-sooner-than` 同为 200／空壳** | **`by the time` 的规则级落点本轮只取到词典层与例句层**（**无 CEFR、无专节**）——**这加重了「`by the time` 段位证据薄」的判断**（§3 序 3），**但不影响 `as soon as` 本批** | **若未来做 `by the time`，须换途径取页**（如站内检索或 PDF 版 English Grammar Today）；**本批不阻塞** |
| **③** | **`conjunctions` 专文的「❌will 规则不在本页」是内容级判断** | **本轮复核确认该页正文无「用现在式代替未来式」字样**（**规则在 `after` 专文**）——**但该页有「延伸閱讀」链接群，未逐条跟随**（**可能链到 `after` 或别的相关页**） | **中文侧引用须落到 `after` 篇（本批已如此处理）**；**「中文侧时间家族总表不含 ❌will」这一表述的边界是「该页正文」** | 生产期若需，登记一条「`conjunctions` 页延伸阅读链接清单」 |
| **④** | **Cambridge `appear` 页的 `Appear or seem?` 语法小节本轮未重取** | **本轮 `appear` 词典页取到的是 BE PRESENT 义项的原文**（**B1**）；**批二十二记该页有 `Appear or seem?` 小节与 SEEM 义 B1**——**本轮未逐字复核这两条** | **备选 A（`seem`／`appear`）的档位不受影响**（**判 C＋ 的三条依据里最有份量的是 `seem` 页与中文专文，两条本轮都取到／复核了**） | **若备选 A 上马，生产期须补取该小节**；**本轮不阻塞** |
| **⑤** | **`neither`／`either` 的个别 CEFR 义项本轮只复取到部分** | **本轮 `either` 页取到的是 adverb 义 B1 原文**（"used in negative sentences instead of 'also' or 'too'"）；**批二十二记的 determiner／pronoun／conjunction 义 B1 与 `either (B2＝both)` 本轮未逐条重取** | **三连体判 B− 不受影响**（**段位齐这一点已由 `both` A1／`neither` B2 两条本轮原文本轮＋`either` 一条原文支撑**） | 生产期若三连体上马，按批二十二的逐条记录复核一遍 |
| **⑥** | **`answer` 作「接电话」义的我方词架未按英文语料口径单列** | **`\banswer\b` 在 GL 有 1,595 处，但绝大部分是结构字段名（`answer:`／`answers:`／`answerZh` 等）**——**本轮用 `en:` 字段过滤得到 2 句（L34 `I called you but no answer.`／L35 `Amy is the third to answer.`），HC 0 句**；**「词边界计数」与「英文语料计数」两种口径的差额本轮未逐字段穷举** | **直接影响 L142 出场句的选词**（**本轮已据此建议避开 `answer it`，改用 `I will call you`——§4.2 约束 2、附录 C 约束 2**）；**不影响 `as soon as` 的档位** | **生产期若要用「接电话」场景，须按 `en:`／`dialogueEn`／`targetSentence` 三字段穷举 `answer` 与 `pick up` 的语料实态**（**本轮已实测 `answer it`／`pick up`／`pick it up` 三串全库 0 处**） |

---

## 附录 A：本轮复核来源清单（全部实取，逐条可追）

**A.1 Cambridge Dictionary（本轮 curl 直连，落盘为 `/private/tmp/camb_*.html`）**

| # | URL | 落盘 | 用在本报告 |
|---|---|---|---|
| 1 | `https://dictionary.cambridge.org/grammar/british-grammar/conjunctions-time` | `camb_conjtime.html`（455,382 bytes）／`camb_conjtime.txt` | §0 序 1·序 2、§1.1 C-1、§2、§5.1、§5.3、§5.4、§6 校正 1·2 |
| 2 | `https://dictionary.cambridge.org/grammar/british-grammar/once` | `camb_once.html`（446,667 bytes）／`camb_once.txt` | §0 序 3、§1.1 C-2、§5.2、§5.3 |
| 3 | `https://dictionary.cambridge.org/grammar/british-grammar/until` | `camb_until.html`（450,595 bytes）／`camb_until.txt` | §0 序 7、§1.1 C-3、§2、§5.3、§5.4 |
| 4 | `https://dictionary.cambridge.org/dictionary/english/as-soon-as` | `camd_as-soon-as.html`／`.txt` | §1.1 C-4、§2 表注② |
| 5 | `https://dictionary.cambridge.org/dictionary/english/soon` | （WebFetch 直连） | §0 序 1、§1.1 C-5、§2、§6 附录条 |
| 6 | `https://dictionary.cambridge.org/dictionary/english/once` | `camd_once.html`／`camd_once.txt` | §1.1 C-6、§5.2 |
| 7 | `https://dictionary.cambridge.org/grammar/british-grammar/future-perfect-simple-i-will-have-worked-eight-hours` | `camb_futperf.html`／`.txt` | §1.1 C-7、§2 ⑦、§6 校正 5 |
| 8 | `https://dictionary.cambridge.org/grammar/british-grammar/as-when-or-while` | `camb_aswhen.html`／`.txt` | §1.1 C-8、§5.1 |
| 9 | `https://dictionary.cambridge.org/grammar/british-grammar/by-and-until`（探测） | `t_probe.html`（**空壳**） | §1.1 C-9、§7 未核实② |
| 10 | `https://dictionary.cambridge.org/grammar/british-grammar/present-simple-i-work` | `camb_pres.html` | §1.1 C-10 |
| 11 | `https://dictionary.cambridge.org/dictionary/english/both` | `c23_both.html`／`.txt` | §2 ⑥ |
| 12 | `https://dictionary.cambridge.org/dictionary/english/either` | `c23_either.html`／`.txt` | §2 ⑥、§7 未核实⑤ |
| 13 | `https://dictionary.cambridge.org/dictionary/english/neither` | `c23_neither.html`／`.txt` | §2 ⑥ |
| 14 | `https://dictionary.cambridge.org/dictionary/english/appear` | `c23_appear.html`／`.txt` | §2 ④ |
| 15 | `https://dictionary.cambridge.org/dictionary/english/rather` | （WebFetch 直连） | §6 校正 3 |
| 16 | `https://dictionary.cambridge.org/dictionary/english/seem` | （WebFetch 直连） | §0 序 5、§2 ④ |

**A.2 British Council LearnEnglish（本轮 WebFetch 直连）**

| # | URL | 用在本报告 |
|---|---|---|
| 1 | `https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/verbs-time-clauses-if-clauses`（**本轮取到 URL 变体**：不带 `/grammar` 前缀的旧 URL 返 404，本变体成功） | §0 序 2、§1.2 B-1、§2、§5.3 |
| 2 | `https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2`（18 课） | §1.2 B-2 |
| 3 | `https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2`（36 课） | §1.2 B-3、§5.2 |
| 4 | `https://learnenglish.britishcouncil.org/free-resources/grammar/c1`（14 课） | §1.2 B-4 |
| 5 | `https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference` | §1.2 B-5 |
| 6 | `https://learnenglish.britishcouncil.org/grammar/b1-b2-grammar/future-continuous-future-perfect` | §2 ③⑦、§5.2 |

**A.3 Murphy（本机原件，未联网）**

| # | 文件 | 用在本报告 |
|---|---|---|
| 1 | `/private/tmp/murphy_ess.txt`（18,714 bytes）／`murphy_ess_norm.txt`（17,176 chars） | §1.3 全表 |
| 2 | `/private/tmp/murphy_int.txt`（14,143 bytes）／`murphy_int_norm.txt`（12,841 chars） | §1.3、§5.2 |
| 3 | `/private/tmp/murphy_full.txt`（14,198 bytes）／`murphy_full_norm.txt`（12,896 chars） | §1.3 全目块 |
| 4 | `/private/tmp/murphy_ess.pdf`（99,745 bytes）／`murphy_int.pdf`（62,514 bytes） | 原件存查 |

**A.4 中文侧 english.cool**

| # | 篇目 | 用在本报告 |
|---|---|---|
| 1 | `https://english.cool/conjunctions/`（本机 `ec_conjunctions.body.txt`，14,942 bytes） | §0 序 1、§1.4 E-1、§5.1、§5.3 |
| 2 | `https://english.cool/after/`（本机 `ec2_after.html`） | §0 序 2、§1.4 E-2、§5.3 |
| 3 | `https://english.cool/once/`（**本轮新取**） | §0 序 3、§1.4 E-3、§5.2 |
| 4 | `https://english.cool/until/`（本机 `ec_until.body.txt`，3,088 bytes） | §1.4 E-4 |
| 5 | `https://english.cool/when/`（**本轮新取**） | §1.4 E-5 |
| 6 | `https://english.cool/by/`（本机 `ec_by.body.txt`） | §2 ③、§5.2 |
| 7 | sitemap 复算：`/private/tmp/ec-urls.txt`（869 行）／`ec_slugs.txt`（855 slug） | §1.4 尾表 |

**A.5 我方文件（本轮独立复算）**

| # | 文件 | 实读结果 |
|---|---|---|
| 1 | `/Users/liujun/Documents/英语听写/src/data/grammarLessons.ts` | **26,686 行／141 课**（末课 `number: 141`，`id: lesson-141-close-22`） |
| 2 | `/Users/liujun/Documents/英语听写/src/data/huntCases.ts` | **8,313 行／150 案**（`id: "hunt-` 计数 ＝ 150） |
| 3 | `/Users/liujun/Documents/英语听写/src/data/grammarSeasons.ts` | **22 季**（末项 `season-22`，`min: 139, max: 141`） |
| 4 | `/Users/liujun/Documents/英语听写/src/pages/GrammarPathPage.tsx` | **`:283-284` `can-do-m24` `afterLesson: 141`**（"我能说「虽然…」"） |
| 5 | L109 `contrast`／`variants`／`sceneSwings`／`deepDive`／`summary` 逐字 | §0 序 7、§4.2、§5.4 |
| 6 | 时间家族五课 `oneLineRule` 逐字（L90／L91／L92／L97／L98）＋L109 | §4.1 逐课表 |
| 7 | 词频复算（**词边界 `\b` 口径**，GL／HC 双文件） | §2 全表、§4.2 |

---

## 附录 B：本轮实算速查（供路线图直接取用）

| 项 | 数值 | 口径 |
|---|---|---|
| 课数 / 案数 / 季数 | **141 / 150 / 22** | `number:` 计数 / `id: "hunt-` 计数 / `id: "season-` 计数 |
| `as soon as` | **GL 0 / HC 0** | 词串（含空格） |
| `soon` | **GL 0 / HC 0** | 词边界 |
| `once` | **GL 11 / HC 0**（**11 处全在 L72「多久一次」，全是「一次」义**） | 词边界 ＋ 逐课归属 |
| `by the time` | **GL 0 / HC 0** | 词串 |
| `will have` | **GL 0 / HC 0** | 词串 |
| `phone` / `ring` / `rang` | **GL 56 / 9 / 67；HC 9 / 3 / 8**（**逐课：`phone` L99 占 42、L102 占 11、L4／L100／L101 各 1；`ring` L99 占 8、L102 占 1；`rang` L99 占 50、L102 占 13、L101 占 2、L98／L100 各 1——三者均不在 L109**） | 词边界 ＋ 逐课归属 |
| `movie` / `ended` / `stops` | **GL 49 / 8 / 9；HC 1 / 0 / 3**（**`movie` 逐课：L29 占 24、L109 占 9、L31／L75 各 4、L15／L76 各 3、L38 占 2；`ended` 8 处全在 L109；`stops` 9 处里 L109 占 8、L94 占 1**） | 词边界 ＋ 逐课归属 |
| 新串（本轮实测全库 0 处） | **`the phone rings` 0／`answer it` 0／`pick up` 0／`pick it up` 0／`call back` 0／`get home` 0／`the letter` 0／`stops raining` 0／`the bus comes` 0／`goes out` 0**（**以上 GL 与 HC 双文件均 0，已逐项复核**） | 词串逐字 ＋ 双文件 |
| 零新串的可用句（本轮实测在库） | **`I will call you` GL 8／HC 0**（L12 与 L141 各有逐字，`en` 字段同一句 `I will call you tomorrow.`）；**`I will go` GL 111／HC 1**（**其中 L139–L141 三课占 15 处 ＝ `Although it is raining, I will go out.` 与 `It is raining, but I will go out.`**）；**`we will go` 型 2 处** | 词串逐字 ＋ 逐课归属 |
| `rain` | **GL 105 / HC 21**（**逐课：L109 占 45、L48 占 11、L96 占 9、L12 占 8、L29 占 7、L102 占 7、L49 占 5、L127 占 4、L110 占 3、L30 占 2、L139 占 2、L47／L101 各 1**；批二十二记 103／20，**本轮按 `\b` 口径为 105／21；⚠️ 注意 L139（批二十二）也用了 2 处 `rain`**） | 词边界 ＋ 逐课归属 |
| 时间家族接口课 | **L90 `after`／L91 `before`／L92 `when`／L97 `when`（第二用法）／L98 `while`／L109 `until`** | 逐课 `grammarLabel` 实读 |
| 收口课先例 | **`grammarLabel` 含「收口」全库 15 课＝L41／L46／L49／L54／L78／L86／L94／L102／L110／L118／L124／L127／L133／L138／L141**；**其中 L94 起连续九季每季一课 ＝ 9 课**（**L94／L102／L110／L118／L124／L127／L133／L138／L141**）——**本批 L144 将是第十六课／连续第十季** | `grammarLabel` 逐条 regex ＋ 课号归属 |
| 零术语红线 | **首屏三字段（`title`／`grammarLabel`／`oneLineRule`）禁语法书术语**（**`grammarLabel` 现有写法是「X + 小句子」「X 站最前面」型**） | 沿用批二十二 |

---

## 附录 C：给生产期的四条硬约束（本轮新增，逐条可执行）

1. **L142 的出场句不得含 `rain`／`stops`／`ended`**——**建议 `As soon as the phone rings, I will call you.`**（**`phone`／`ring` 在库且不在 L109；`I will call you` 零新串**）；**若主理人改判处置 ②（保留 `rain`），则 L109 的 `whyZh` 必须同批回改**（§4.2）。
2. **不得用 `answer it` 作 L142 的主句动作**——**本轮实算：`answer it` 全库 0 处、`answer` 作英文语料仅 2 句、HC 0 处**（**`\banswer\b` 的 1,595 处绝大多数是结构字段名 `answer:`**）；**若确需「接电话」义，须另立一个新串并计入造词成本**（§4.2、§7 未核实⑥）。
3. **L143 切开课除「刻度」外不得叠加任何新词或新形式**——**否则「只差一刻度」这个唯一增量会被淹没**（§5.1 尾）。
4. **`once` 只作 L144 的「换个说法」认读位，不得讲成新结构**——**它在本课的角色是「你已经见过这个词（L72 `once a month`），它还有一个意思跟今天这只一样」**（§5.2 ①）。

---

## §8 结论一句话（供主理人裁）

**`as soon as` 的首选地位本轮维持（B 档／3 课 L142–L144），跨源四层证据全部复核成立，且本轮校正两处引文（`can`＋四项并列 `when, once, as and as soon as`；`Many of these time conjunctions`）、升级一处 Murphy 检索口径（须加 `grep -a`，否则 `by the time` 会假 0）、关闭一处未核实（`will have` 的 Cambridge 语法页本轮找到并实取）；「能否扩到 4 课」的答案是否定的（`once` 是同义换词／`by the time` 是另一条语义轴且绑定 C 档的 `will have`）；L109 形式冲突本轮取到跨源参考——跨源的做法是「按主句时间切换版本」而非一刀切（Cambridge `until` 页三种情况分列，且首屏例就是 `Let's wait here till the rain stops.`），故推荐处置 ①（换场景，建议 `As soon as the phone rings, I will call you.`），并在 L142／L143 显式承接 L109 的 ❌will 判据。**
