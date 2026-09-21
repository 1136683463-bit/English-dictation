# 竞品分析：第二十二批选题（L139 起）· 竞析报告

| 字段 | 值 |
|---|---|
| 报告 | 竞品分析（竞析）· 语法线「小美的一天」第二十二批 |
| 日期 | **2026-09-20** |
| 轮次 | 第二十二批（批二十一 L134–L138 交付后，**B 档系列已全部结清**） |
| 课号起点 | **L139 起**（现库 **138 课／147 案／21 季**，本轮独立复算） |
| 本轮任务 | **B 档结清后的第一次选题研究**——按批二十一路线图 §6.2 三方向（A 档复现型大章／C 档选题／换轴）做跨源取证，**逐候选给档**，并回答两个形态问题（复现型章／换轴） |
| 上游输入 | `roadmap-grammar-twenty-first-batch-2026-09-20.md`（**§6.2 批二十二三方向／§6.2 序 1–6 结账表／§6.3 携带项／§7 决策记录**，逐节实读）· `competitive-analysis-grammar-twenty-first-batch-2026-09-20.md`（批二十一竞析，**§0–§8＋附录 A／B**，逐节实读，作为转述级基线）· `data-audit-grammar-seventeenth-batch-2026-09-19.md`（数析，**§1.6 丁 12 项散点真空白**——本批候选的主要上游来源）· `competitive-analysis-grammar-sixteenth-batch-2026-09-19.md`（批十六竞析，**§「Conjunctions: time」与 `as soon as` 的首次记载**） |
| 我方快照（本轮独立复算） | `src/data/grammarLessons.ts`（**26,108 行／138 课**）· `src/data/huntCases.ts`（**8,181 行／147 案**）· `src/data/grammarSeasons.ts`（**21 季**，末项 season-21 `{134,138}`）· `src/pages/GrammarPathPage.tsx`（`:276` m23 `afterLesson: 138`）· `src/data/grammarZeroTerms.ts`（**29 词**） |
| 快照时点 | **本轮复算全部在同一时点完成**（本轮实读 mtime ＝ **2026-09-19 21:54**；**未再发生批二十一记录过的那类取证中途写入**；`git status` 仍显示 ` M`——**§9.2 未核实①保留该项风险声明**） |

---

## §0 本轮结论速览（8 条，先读这里）

1. **本批最重要的发现：`as soon as` 是本轮候选池里唯一「跨源四层全有、且我方时间家族已铺好地板」的项，但它不是零课位——它在 BC 的「参考层」有明确落点，在 Cambridge 有专门的语法页 `Conjunctions: time`。** 逐条证据：① **Cambridge 语法页 `conjunctions-time`**（本轮 WebFetch 直连实取）明文把 **`when`／`once`／`as soon as` 放在同一小节**——"**When, once, as soon as** – We use when, once and as soon as to talk about a specific point in time when something happened or will happen."，例句 `We always have an ice cream as soon as we get to the beach.`／`As soon as we hear any news, we'll call you.`；**且同页给出本候选最硬的一条规则**（❌will）："I will call you as soon as I get to the office." 对 **"as soon as I will get to the office"**（明标错）。② **Cambridge 词典 `soon` 条**（本轮直连）给 **`as soon as` 独立标位 B1**（"at the same time or a very short time after"），而 `soon` 本身是 **A2**。③ **BC 参考层**（本轮直连）`verbs-time-clauses-if-clauses` 明文 **"We do not normally use will in time clauses and conditional clauses."**＋`I'll come home when I finish work. (NOT will finish work)`——**与 Cambridge 同一条规则，说明「时间从句里不用 will」是跨源共识**。④ **中文侧**（本轮 sitemap 复算＋直连）**`conjunctions` 专文的「时间关系」节把 `as soon as` 与 `when`／`while`／`before`／`after`／`since`／`until` 并列成表**，逐字例句 `The baby stopped crying as soon as she saw her mother.`（那个小婴儿一看到妈妈就不哭了）——**中文侧把它明确归入时间家族**。→ **判 B（可成 3 课小章，见 §4）**。
2. **`neither/either/both` 三连体：本轮证据比批十七更厚（词典 CEFR 双源齐），但它的「2 课可行」判断本轮改判为「3 课封顶、且必须切在 `both` 与 `neither/either` 的分界上」**：① **Cambridge 词典给三个独立段位**——`both` **A1**（"（referring to）two people or things together"）／`neither` **B2**（"not either of two things or people"）／`either` **B1**（"used when referring to a choice between two possibilities"）；② **Cambridge 语法页 `both`** 与 **`neither-neither-nor`**（本轮双页直连）给**唯一一条可作一课一增量的硬轴**——**否定侧**：`both` 页逐字 **"We don't normally use both（of）+ not to make a negative statement about two people or things. Not: Both of these shirts aren't dry yet."** 与 `neither` 页 **"We use neither, not none, when we are talking about two people or things"**；③ **中文侧 `both` 专文（本轮直连）给了六条可照抄的 ❌**（`She is learning both the languages.`❌／`Both them enjoy hiking.`❌／`Both we prefer pop music.`❌／`I saw both them.`❌／`Both of them didn't win the prize.`❌／`Both my sister and your brother aren't going to the party.`❌），**其中三条正是「both 与否定」这一轴**；④ **中文侧 `either-neither` 专文（本轮直连）有首屏自测对**（`A: I don't like eating ice cream. B: ＿＿＿（Neither/Either） do I.` → 答案 `Neither do I.`）＋病灶句「實在太像了，使得很多人搞不清楚怎麼用才是對的」。→ **判 B−（可成 2–3 课，但第 3 课须为收口，见 §4）**；**注意其硬伤是「三连体实质只有两条轴」**（`both`＝两者都／`neither-either`＝两者都不与二选一），**不是批十七记的「2 课可行」那么宽裕**（见 §7 口径校正 2）。
3. **`would rather` 本轮判 B−：词典义项级 B1 成立，但「一班岗两条轴」的容量天然只有 2 课。** Cambridge 词典 `rather` 条**独立 headword「would rather」标 B1**（"used to show that you prefer to have or do one thing more than another"，注 `(also 'd rather)`）；Cambridge 语法页 `would-rather-would-sooner`（本轮直连）给**两条轴且只给两条**：① **同一个人**用 `would rather（not）+ 原形`（`I'd rather stay at home than go out tonight.`／`I'd rather not go out tonight.`）；② **换人**用过去式（`I'd rather you stayed at home tonight.`／`She'd rather you didn't phone after 10 o'clock.`），**且明文把两条轴常见的错标出**："Don't use -ing or to-infinitive（I'd rather walk）"／"attach not to the second clause（I'd rather they didn't tell anyone）"。**Murphy 中级 U59 标题逐字＝`prefer and would rather`**（与批十八 U61／批二十一 U62 同属 U53–U68 的 `-ing`／`to` 十六课连续块）——**但 U59 在 U60 之前，是本族唯一「不在 `to + -ing` 块内」的项**。**中文侧零专文**（sitemap 复算：`rather` 只命中 `rather-than`，是「而不是」义，与本项无关）→ **判 B−（2 课，`would rather` 本尊＋否疑；换人版作第 2 课或折卡，见 §4）**。
4. **`seem/appear` 本轮由 D 升到 C：Cambridge 给了三条本轮才取到的原文，把批二十「上游无课位、零底座」的判读部分推翻。** 新证据：① **Cambridge 词典 `seem` 条标 B1**（"to give the effect of being; to be judged to be"，形式标注 `[ + to infinitive ]`／`[ + (that) ]`／`[ after so ]`）；② **Cambridge 词典 `appear` 条的 **SEEM** 义项标 B1**（"to seem"，`[ L or I, not continuous ]`＋`[ + to infinitive ]`／`[ + (that) ]`），**且该页有专门的 Grammar 小节 `Appear or seem?`**（appear 用于事实／事件，seem 也可用于个人感受）；③ **BC B1-B2 课程位在册**：`Stative verbs`（本轮直连）把 **`appear`／`seem` 与 `be`／`feel`／`hear`／`look`／`see`／`smell`／`taste` 并列在「senses and perceptions」表内**，并给「Not usually used in the present continuous form」的规则。**但这不构成课程位级空白可填——因为 `Stative verbs` 是状态动词总课，不是 `seem` 专课**。→ **判 C（不单开，可作感官章的第 4 件或折卡）**；**注意 `sound` 不在 BC 的这张表内**（本轮逐条复核），**而我方五格已铺满——这是「我方比 BC 多一格」的一条硬事实，见 §7 口径校正 4**。
5. **`the same as` 判 C（不单开）：词典给 A2 但形态是「比较结构的附属品」，不是独立结构。** Cambridge 词典 `same` 条把 `the same as` 收在 **EXACTLY LIKE** 义项下、**标 A2**（"exactly like"，例 `People say I look just the same as my sister.`）；**BC A1-A2 的 `Comparative adjectives` 页本轮直连确认不含 `the same as`、也不含 `as … as`**（该页只教比较级 + `than`）；**中文侧 sitemap 复算 `same` 零命中**（**无任何 slug 含 `same`**）。**我方有 2 处 GL／1 处 HC 的 `same` 命中**（`They look the same!` L~、`Are they the same?` L138——**批二十一收口课内，说明「一样不一样」的语义场我方已在用**）。→ **不单开课**；**且它的语用（「A 和 B 一样」需要两个可比对象）与「小美的一天」单人视角不合，见 §3 序 5**。
6. **提议家族（`shall we`／`why not`／`what about`）：本轮判 `shall we` D（不排期，理由与批十一不同）、`why not` C（可折入），并校正一处口径——任务书与批二十一记录的「`what about` 我方已有 23 处」是「**`what about` ＋ `how about` 两串的 GL 合计**」，**`what about` 单独只有 3 处**（本轮状态机复算，见 §7 口径校正 5）。** ① **`shall` 词典标 A2（SUGGEST 义）＋B1（FUTURE 义）**（本轮直连：`shall modal verb (SUGGEST)` ＝ **A2 formal in US**，"used, with 'I' or 'we', to make a suggestion"，例 `Shall I close this window?`／`Shall we go out for dinner tonight?`）；② **Cambridge 语法页 `suggestions`（本轮直连）逐字证实一个关键事实：该页收了 `How about`／`What about`／`Why not`／`Why don't`／`Let's` 五种，但全文没有 `shall we`**——**即上游的「提议」语法页并不把 `shall we` 与 `let's` 并列**；③ **`why not...?` 词典独立条目标 B1**（"used to make a suggestion or to express agreement"，例 **`Why not use my car?`**／`'Yes, why not?'`）；④ **我方现状（状态机逐字复算）**：**`what about` GL 3**——**2 处在英文句字段**（L45 `:8230` `I enjoy drawing. What about you?`／L75 `:13910` `What about you?`），**1 处在 L75 的中文讲解**（`:13914` 逐字「老位上的 `What about` 是「你呢」（第 45 课）」）；**`how about` GL 20 ＋ HC 1**（**GL 裸 grep 是 21，差额 1 处是 L75 上方的中文注释行 `// ── 第十一批 · L75 咱们去…吧（Let's + How about）…`，非内容字段**）；**两者合计 GL 23 ＋ HC 1 ＝ 24**。→ **`shall we` D**（词典段位低且上游不并列＋我方零场景）；**`why not` C**（可作 L75 提议章的第 2 课折入，不单开）；**提议家族整体不构成一批**。
7. **`will have`（将来完成）：判 C，且理由与批十六不同——本轮多了一条「BC 已给课程位」的硬证据。** **BC B1-B2 第 8 课 `Future continuous and future perfect`（本轮直连实取）**明文给出 `will/won't have + past participle` 的形式与规则（"describing something that will be completed before a specific time in the future"），例句 `The guests are coming at 8 p.m. I'll have finished cooking by then.`／`By the time we arrive, the kids will have gone to bed.`；**Murphy 中级 U24 标题逐字＝`will be doing and will have done`**（与中级 U21／U22 `will and shall 1/2`、U23 `I will and I'm going to` 连续）。**但我方词架零**（`will have` GL 0／HC 0；**注意 `will` 本身 GL 268 处、L12 已教**）。→ **判 C**：**跨源课程位这次是「有」（BC 有课、Murphy 有单元）**，**但它是纯时态格子、与「小美的一天」的日常场景耦合弱（要用「到那时已经做完」的将来完成场景），且批十六已把它与 `have sth done` 一起判过跨级**；**本轮不改判，但把「无课程位」这个理由撤下**（见 §7 口径校正 6）。
8. **「复现型大章」与「换轴」两个形态问题本轮各有一份跨源答案（§5／§6）**：**① 复现型——四源全都有，但形态各不相同：Murphy 用「Study guide + Additional exercises」（**两个独立的复现装置，都在书末，不占正课单元号**）；BC 用「Grammar test（每课内嵌，不是独立章）+ 分档索引（A1-A2／B1-B2／C1）」（**没有跨课复习章**）；Duolingo 用「路径内嵌 practice 会话 + 单元末 Legendary 挑战 + 已完结节点可重玩」（**按间隔重复切，不是内容重编**）。→ **结论：上游没有一家做「把已教结构重新编成新章」这件事。** 我方若做，**必须承认这是我方自创形态**（§5.3）；**并且它与我方现有 `GrammarReviewPage`（SM-2）／`GrammarRevisitPage`（关 2 回访）／`GrammarReauditPage`（关 3 旧案重审）／`GrammarBoostPage`（趁热练）四个复现装置存在职能重叠风险**——**须先做职能分工表**（§5.4）。**② 换轴——BC 的「free-resources」把 Listening／Reading／Writing／Speaking／Grammar／Vocabulary 分成六个独立栏目**（本轮直连实取菜单），**即上游把技能轴与语法轴彻底分开、不做混合课**；**我方的冒险阅读（`adventureReaderService.ts`）与语法线零耦合**（`grep -c grammar` 在 `AdventurePlayPage.tsx`／`adventureService.ts` ＝ **0/0**）。→ **判：不做「语法+读写」混合课**；**若要做，只有一种不破红线的形态——把读写/听力当「复现通道」而不是「新结构」**（§6.3）。

---

## §1 复核结果：逐源列出取到／未取到的页面与要点

### 1.1 British Council LearnEnglish（BC）——三档全目 ＋ 5 个候选页

| # | 页面 | 取到情况 | CEFR 段位 | 本轮要点（原文级／逐条） |
|---|---|---|---|---|
| BC-1 | A1-A2 索引 **18 课全目** | ✅ **本轮 WebFetch 直连实取**（与批二十一逐条比对一致） | **A1 Elementary／A2 Pre-intermediate** | 18 课原序：`Adjectives and prepositions`／`Adjectives ending in '-ed' and '-ing'`／`Articles: 'a', 'an', 'the'`／`Articles: 'the' or no article`／`Comparative adjectives`／`Infinitive of purpose`／`Nouns: countable and uncountable`／`Past continuous and past simple`／`Possessive 's`／`Prepositions of place: 'in', 'on', 'at'`／`Prepositions of time: 'at', 'in', 'on'`／`Present simple`／`Present simple: 'have got'`／`Present simple: 'to be'`／`Quantifiers: 'few', 'a few', 'little' and 'a bit of'`／`Question forms`／`Using 'there is' and 'there are'`／`Verbs followed by '-ing' or infinitive` → **本批 8 个候选零课程位**（`as soon as`／`neither`／`either`／`both`／`would rather`／`seem`／`appear`／`the same as`／`shall we`／`why not`／`will have` **逐一复核，均不在 18 课标题内**） |
| BC-2 | B1-B2 索引 **36 课全目** | ✅ **本轮 WebFetch 直连实取**（落盘比对：与批二十一本机存档 `bc-b1b2-new.html` 逐条一致） | **B1 Intermediate ＋ B2 Upper intermediate** | 36 课原序：`Adjectives: gradable and non-gradable`／`British English and American English`／`Capital letters and apostrophes`／`Conditionals: third and mixed`／`Conditionals: zero, first and second`／`Contrasting ideas: 'although', 'despite' and others`／`Different uses of 'used to'`／**`Future continuous and future perfect`**／`Future forms: 'will', 'be going to' and present continuous`／`Intensifiers: 'so' and 'such'`／`Modals: deductions about the past`／`Modals: deductions about the present`／`Modals: permission and obligation`／`Modifying comparatives`／`Passives`／`Past ability`／`Past habits: 'used to', 'would' and the past simple`／`Past perfect`／`Phrasal verbs`／`Present perfect`／`Present perfect simple and continuous`／`Present perfect: 'just', 'yet', 'still' and 'already'`／`Question tags`／`Reflexive pronouns`／`Relative clauses: defining relative clauses`／`Relative clauses: non-defining relative clauses`／`Reported speech: questions`／`Reported speech: reporting verbs`／`Reported speech: statements`／**`Stative verbs`**／`The future: degrees of certainty`／**`Using 'as' and 'like'`**／`Using 'enough'`／`Verbs and prepositions`／`Verbs followed by '-ing' or infinitive to change meaning`／`Wishes: 'wish' and 'if only'` → **本批**：**`will have` 有课程位（第 8 课）**；**`seem`／`appear` 有「表内落点」（第 30 课 `Stative verbs`，非专课）**；**`as soon as` 零课程位**；**`neither/either/both`／`would rather`／`the same as`／`shall we`／`why not` 零课程位** |
| BC-3 | C1 索引 **14 课全目** | ✅ **本轮 WebFetch 直连实取**（批二十一记「Wayback 存档取到」，**本轮直连成功，存档缺口进一步收窄**） | **C1 Advanced** | 14 课原序：`Advanced passives review`／`Advanced present simple and continuous`／`Avoiding repetition in a text`／`Contrasting ideas`／`Ellipsis`／`Emphasis: cleft sentences, inversion and auxiliaries`／`Inversion after negative adverbials`／`Inversion and conditionals`／`Modals: probability`／`Participle clauses`／`Patterns with reporting verbs`／`Possession and noun modifiers`／`Unreal time`／`Word order in phrasal verbs` → **本批 8 个候选零课程位** |
| BC-4 | `b1-b2-grammar/future-continuous-future-perfect`（**本批新取，`will have` 唯一课程位**） | ✅ **本轮 WebFetch 直连实取原文** | **B1 Intermediate ＋ B2 Upper intermediate** | **逐字**：future perfect ＝ "will/won't have + past participle"，"describing something that will be completed before a specific time in the future"；主例句 **`The guests are coming at 8 p.m. I'll have finished cooking by then.`**／`On 9 October we'll have been married for 50 years.`／`Will you have gone to bed when I get back?`／`I won't have written all the reports by next week.`／**`By the time we arrive, the kids will have gone to bed.`**／`I'll have finished in an hour and then we can watch a film.`；**同页明文 `by the time` ＝ "at some point before"**；**同页 `as soon as` 零命中**（本轮逐字复核）。→ **这是本批「`will have` 有课程位」的唯一原文级依据** |
| BC-5 | `b1-b2-grammar/stative-verbs`（**本批新取，`seem`／`appear` 的表内落点**） | ✅ **本轮 WebFetch 直连实取原文** | **B1 Intermediate ＋ B2 Upper intermediate** | **逐字规则**："Stative verbs describe a state rather than an action."／"They aren't usually used in the present continuous form."／"Stative verbs often relate to:" 四类（thoughts and opinions／feelings and emotions／**senses and perceptions**／possession and measurement）／"A number of verbs can refer to states or actions, depending on the context."；**senses and perceptions 表逐字＝`appear, be, feel, hear, look, see, seem, smell, taste`**（**`sound` 不在表内——本轮逐条复核**）；"Other verbs like this include: agree, appear, doubt, feel, guess, hear, imagine, look, measure, remember, smell, weigh, wish." → **`seem`／`appear` 在 BC 是「状态动词表内成员」，不是课程位**；**`sound` 缺席是本批一条可用事实**（§7 口径校正 4） |
| BC-6 | `b1-b2-grammar/question-tags`（**本批新取，查 `shall we` 是否有落点**） | ✅ **本轮 WebFetch 直连实取原文** | **B1 Intermediate ＋ B2 Upper intermediate** | **逐字复核结论：全页 `shall` ＝ 0**——反向疑问句只给 `isn't it?`／`wasn't it?`／`doesn't she?`／`couldn't they?`／`will you?`／`aren't I?` 六种；**`shall we` 既不在反问句课，也不在任何其他 B1-B2 课** → **`shall we` 在 BC 三档 68 课的真零位本轮第三次确认** |
| BC-7 | `english-grammar-reference/verbs-time-clauses-if-clauses`（**本批新取，`as soon as` 的规则级落点**） | ✅ **本轮 WebFetch 直连实取原文** | 参考层（页内标 **Level: beginner**） | **逐字规则**："In time clauses we often use present tense forms to talk about the future."／**"We do not normally use will in time clauses and conditional clauses."**；例句 `I'll come home when I finish work.`／`You must wait here until your father comes.`／`They are coming after they have had dinner.`／`It will be nice to see Peter when he gets home.`；**❌ 明写**："I'll come home when I finish work. **(NOT will finish work)**"；**例外**："we can use will if it means want to or be willing to"（`We should finish the job early if George will help us.`）。**同页 `as soon as` ＝ 0**（本轮逐字复核）→ **这是「时间从句不用 will」的 BC 侧原文，与 Cambridge `conjunctions-time` 同规则**；**但 `as soon as` 本身不在本页** |
| BC-8 | `free-resources` 菜单（**本批新取，用于「换轴」专节**） | ✅ **本轮 WebFetch 直连实取** | — | **六个技能栏目逐字**："Listening"／"Reading"／"Writing"／"Speaking"／"Grammar"／"Vocabulary"（＋"Business English"／"General English"）；**分档方式**：大多数技能按 CEFR 单档分（"A1 listening"／"B1 reading"），**Grammar 与 Vocabulary 用合并带（"A1-A2 grammar"／"B1-B2 vocabulary"）** → **上游把「技能轴」与「语法轴」做成两个互不混合的栏目体系**（本批「换轴」专节的跨源依据，§6.1） |
| BC-9 | `a1-a2-grammar/comparative-adjectives`（**本批新取，查 `the same as` 是否在 A1-A2 有落点**） | ✅ **本轮 WebFetch 直连实取原文** | **A1-A2** | **逐字复核结论：`the same as` ＝ 0／`as … as` ＝ 0**——该页只教比较级 + `than`（`Their house is cleaner than ours.`／`Traffic is slower in the city than in the countryside.`／`After the race I was more tired than Anne.`）→ **`the same as` 在 BC A1-A2 段无落点** |
| BC-10 | `free-resources/grammar` 总索引（**本批新取，用于「复现章」专节**） | ✅ **本轮 WebFetch 直连实取** | — | **逐字**："organised into two sections, organised by English level"＋"also a grammar reference"；栏目＝`A1-A2 grammar`／`B1-B2 grammar`／`C1 grammar`／`English grammar reference`；**互动练习内嵌于课内**（"When you do the interactive exercises, you can see how well you've done."）→ **BC 无独立复习章**（§5.1） |

**BC 小结（本批三条）**：**① `will have` 有课程位（B1-B2 第 8 课）——这是本批唯一「BC 给课程位」的候选；② `seem`／`appear` 有表内落点（`Stative verbs`），但不构成课程位；③ 其余 6 个候选（`as soon as`／`neither/either/both`／`would rather`／`the same as`／`shall we`／`why not`）在 BC 三档 68 课全部零课程位。** 另有两条**形态级事实**：**BC 的技能栏目与语法栏目互不混合**（BC-8）；**BC 无独立复习章**（BC-10）。

### 1.2 Cambridge Dictionary（Cambridge）——语法页 ＋ 词典 CEFR

| # | 页面 | 取到情况 | CEFR | 本轮要点（**原文级**） |
|---|---|---|---|---|
| CAM-1 | **`grammar/british-grammar/conjunctions-time`**（**本批最关键的一页**） | ✅ **本轮 WebFetch 直连实取**（**新取，批十六竞析记过此页但未逐字抽出**） | **无 CEFR** | **① 「When, once, as soon as」小节逐字**："We use **when, once and as soon as** to talk about a specific point in time when something happened or will happen."＋例句 `When we were in Greece, we went to as many islands as possible.`／`They always close their curtains once they get home in the evening.`／**`As soon as we hear any news, we'll call you.`**；**② ❌will 规则逐字（**本批最硬的一条**）**："I will call you as soon as I get to the office." 对 **"as soon as I will get to the office"**（明标错）；同页 `When people walk into the room, they will feel something special`（Not: `When people will walk into the room`）；**③ `Before and after` 小节**："We use before and after to talk about the order of events in the past or future."＋`She'll pick you up before she comes here.`／`After she comes here, she'll pick you up.`；**④ `Until` 小节**："We use until to talk about something that continues up to a time in the past or future."（`I'm going to wait until the January sales start to buy a new jacket.`）；**⑤ 首屏例表六条**：`She was in a bad car accident when she was young.`／`We can't play loud music after everyone has gone to bed.`／`Brush your teeth before you go to bed!`／`I'll wait with you until the bus comes.`／`I'll call you once I arrive.`／**`We always have an ice cream as soon as we get to the beach.`**；**⑥ 页末补一条**："These conjunctions can also be followed by -ing or -ed forms instead of subject + verb." → **上游把 `as soon as` 与 `when`／`once`／`before`／`after`／`until` **放在同一页同一体系**——**这就是「时间家族」的原文级授权**（与本批 §4 的章设计直接相关） |
| CAM-2 | **`dictionary/english/soon`** | ✅ **本轮 WebFetch 直连实取** | **`soon` ＝ A2 ／ `as soon as` ＝ B1 ／ `as soon as possible` ＝ A2** | **逐字**：`soon` **A2** "in or within a short time; before long; quickly"；**`as soon as` B1** "at the same time or a very short time after"；`as soon as possible` **A2** "If you do something as soon as possible, you do it as quickly as you can" → **本候选的段位证据：结构级 B1，且 `soon` 这个词本身 A2（我方零底座，须造词）** |
| CAM-3 | `grammar/british-grammar/linking-verbs`（查 `seem`／`appear`） | ✅ **本轮 WebFetch 直连实取**（批十九／二十沿用缓存，**本轮重取**） | 无 CEFR | **逐字复核结论：正文 `seem` ＝ 0（只出现在页脚导航列表里）**；`appear` 在正文只作**介词短语后的普通动词**出现（`A face appeared at the window. It was Pauline.`）；**本页不给 `seem`／`appear` 的形容词／不定式格式** → **批二十记「`linking-verbs` 名单含 look/sound/smell/taste/feel」成立，但 `seem`／`appear` 在本页不是教学对象**（**本轮口径细化，见 §7 口径校正 3**） |
| CAM-4 | **`dictionary/english/seem`**（**本批新取**） | ✅ **本轮 WebFetch 直连实取** | **B1** | **逐字**：`seem` **B1** "to give the effect of being; to be judged to be"；形式标注 **`[ I + adv/prep, L ]`／`[ + to infinitive ]`／`[ + (that) ]`／`[ after so ]`**；例 `He's 16, but he often seems (to be) younger`／`It seems (that) she can't come`／`I seem to know more about him than anyone else.` → **`seem` 的段位是 B1，形式标注里有独立的不定式格** |
| CAM-5 | **`dictionary/english/appear`**（**本批新取**） | ✅ **本轮 WebFetch 直连实取** | **BE PRESENT ＝ B1 ／ SEEM ＝ B1 ／ PERFORM ＝ B1 ／ BECOME AVAILABLE ＝ B2** | **逐字**：**SEEM 义项 B1** "to seem"，标注 **`[ L or I, not continuous ]`**＋`[ + to infinitive ]`／`[ + (that) ]`／`[ + adv/prep ]`；**BE PRESENT B1** "to start to be seen or to be present"；**PERFORM B1**；**BECOME AVAILABLE B2**。**同页有 Grammar 小节**：`Appear` 的用法（后接形容词或 to-infinitive）＋**`Appear or seem?` 对照**（appear 用于事实/事件，seem 也可用于个人感受）→ **`appear` 有专门的语法对照小节，是本批候选里除 `as soon as` 外第二个「Cambridge 给专节」的项** |
| CAM-6 | **`dictionary/english/both`**（**本批新取**） | ✅ **本轮 WebFetch 直连实取** | **A1** | **逐字**：`both`（predeterminer, determiner, pronoun）**A1** "（referring to）two people or things together"；例 `Both my parents are teachers.`／`Both Mike and Jim have red hair.`／`I loved both of them.`／`Are both of us invited, or just you?`／`I felt both happy and sad at the same time.` → **三连体里段位最低的一项，A1** |
| CAM-7 | **`dictionary/english/neither`**（**本批新取**） | ✅ **本轮 WebFetch 直连实取** | **B2** | **逐字**：`neither` **B2** "not either of two things or people"；例 `We've got two TVs, but neither works properly.`／`Neither of my parents likes my boyfriend.`／`Neither one of us is interested in gardening.`／`'Which one would you choose?' 'Neither. They're both terrible.'`；**`neither ... nor` 亦标 B2**（"used when you want to say that two or more things are not true"，例 `Neither my mother nor my father went to university.`）→ **三连体里段位最高的一项，B2** |
| CAM-8 | **`dictionary/english/either`**（**本批新取**） | ✅ **本轮 WebFetch 直连实取** | **B1（两义）／B2（一义）** | **逐字**：`either`（adverb）**B1** "used in negative sentences instead of 'also' or 'too'"（`I don't eat meat and my husband doesn't either.`／`'I haven't either.'`）；`either`（determiner, pronoun, conjunction）**B1** "used when referring to a choice between two possibilities"（`Either candidate would be ideal for the job.`／`'Either will do.'`／`We can either eat now or after the show - it's up to you.`／`Either you leave now or I call the police!`）；`either`（determiner）**B2** "both"（`I was sitting at the table with smokers on either side of me.`）→ **两条轴（否定附和 B1 ＋ 二选一 B1）都落在 B1** |
| CAM-9 | **`grammar/british-grammar/both`**（**本批新取**） | ✅ **本轮 WebFetch 直连实取** | 无 CEFR | **本轮最关键的一条（本批 §4 三连体章的设计轴）逐字**："**We don't normally use both（of）+ not to make a negative statement about two people or things**"，紧接 **"Not: Both of these shirts aren't dry yet."**；另一条用法：`both` 在 `be` 之后（`These films are both famous with people of all ages...`，**Not: These films both are famous …**）；`both … and` 起加强作用（`Both Britain and France agree on the treaty.`／`She played both hockey and basketball when she was a student.`）；短答不说 `the both`（`Both?`／**Not: The both.**）；`both of` 在介词后优先（`He shouted at both of them.`／`That'll be so nice for both of you.`） |
| CAM-10 | **`grammar/british-grammar/neither-neither-nor`**（**本批新取**） | ✅ **本轮 WebFetch 直连实取** | 无 CEFR | **逐字（本批第二硬）**："**Neither allows us to make a negative statement about two people or things at the same time.**"／"Neither goes before singular countable nouns."／"We use **neither of** before pronouns and plural countable nouns which have a determiner（my, his, the）before them"／"**We use neither, not none, when we are talking about two people or things**"（典型错误小节的原文）／"**Take care to spell neither correctly: not 'niether' or 'neighter'.**"；**正式/口语差异**："In formal styles, we use neither of with a singular verb when it is the subject. However, in informal speaking, people often use plural verbs"（`Neither of them were interested in going to university.`）；**`neither ... nor`**："We can use neither as a conjunction with nor. It connects two or more negative alternatives."（`Neither Brian nor his wife mentioned anything about moving house.`／`Neither Italy nor France got to the quarter finals last year.`）；**`not … either` 是 less formal 替代**："The less formal alternative is to use **and … not … either**"（`Italy didn't get to the quarter finals last year and France didn't either.`）；**短答**：`Neither can I.`／`Neither have I.`／`Neither did I.`／`Me neither.` |
| CAM-11 | **`grammar/british-grammar/would-rather-would-sooner`**（**本批新取**） | ✅ **本轮 WebFetch 直连实取** | 无 CEFR | **逐字**："We use **would rather** or **'d rather** to talk about preferring one thing to another."；**同人轴**："would rather（not）+ base form"（`I'd rather stay at home than go out tonight.`／`I'd rather not go out tonight.`／`We'd rather go on Monday.`／`I'd much rather make a phone call than send an email.`）；**换人轴**："For present/future use past simple; for past use past perfect"（`I'd rather you stayed at home tonight.`／`I'd rather they did something about it instead of just talking about it.`／**`Would you rather I wasn't honest with you?`**／`I'd rather you hadn't rung me at work.`）；**否定位**："the negative comes on the clause that follows"（`She'd rather you didn't phone after 10 o'clock.`）；**短答**："We often use **I'd rather not** as a short response to say no to a suggestion or request."；**同族**：`would sooner`／`would just as soon`（"They mean approximately the same as would rather"；"**would rather is more common than both**"）；**典型错误逐字**："Don't use -ing or to-infinitive（I'd rather walk）"，"attach not to the second clause（I'd rather they didn't tell anyone）" |
| CAM-12 | **`dictionary/english/rather`**（查 `would rather` 的段位） | ✅ **本轮 WebFetch 直连实取** | **`would rather` ＝ B1** | **逐字**：headword **`would rather`** 标 **B1**，注 **`(also 'd rather)`**，义 "used to show that you prefer to have or do one thing more than another"，例 `I'd rather have a beer.` → **本候选最硬的段位证据（义项级 B1）** |
| CAM-13 | `grammar/british-grammar/suggestions`（**本批新取，提议家族**） | ✅ **本轮 WebFetch 直连实取** | **无 CEFR** | **逐字复核结论：本页收了五种提议，`shall we` 不在其中**——① `How about + -ing`（`How about starting a book club?`）；② `What about + -ing`（`What about opening your present now?`）；③ `How about + present simple`（`How about I pick you up at eight o'clock on my way to the airport?`）；④ `How about / what about + noun phrase`（`how about some lunch?`／`What about a coffee?`）；⑤ **`Why not …? and why don't …?`**（`Why not take a break in the south-west?`／`Why not treat yourself to a meal at the Icon Restaurant?`／`Why don't you take some time out and rest?`／`Why don't we stop now and work on this tomorrow morning?`）；⑥ **`Let's … and let's not …`**（`Let's call Michael and see if he knows how to fix it.`／`Let's make a curry tonight.`／`Let's not argue about this.`／`Let's not spend all night talking about my problems.`）→ **`shall we` 在 Cambridge 的「提议」专页里缺席**（**这是本批判 D 的关键一条**） |
| CAM-14 | **`dictionary/english/why-not`**（**本批新取**） | ✅ **本轮 WebFetch 直连实取** | **B1** | **逐字**：`why not...?` **B1** "used to make a suggestion or to express agreement"；例 **`Why not use my car? You'll fit more in.`**／`'Let's go out for an Italian tonight.' 'Yes, why not?'` → **`why not` 的段位是 B1，且上游同时承认它两个岗（提议＋同意）** |
| CAM-15 | **`dictionary/english/shall`**（**本批新取**） | ✅ **本轮 WebFetch 直连实取** | **`shall`（SUGGEST）＝ A2 ／（FUTURE）＝ B1** | **逐字**：`shall modal verb (SUGGEST)` **A2 formal in US** "used, with 'I' or 'we', to make a suggestion"（`'I'm cold.' 'Shall I close this window?'`／`Shall we go out for dinner tonight?`／`Shall I call him tomorrow?`）；`shall modal verb (FUTURE)` **B1 old-fashioned** "used instead of 'will' when the subject is 'I' or 'we'"；**反问句尾**（`So we'll see you at the weekend, shall we (= is that right)?`） |
| CAM-16 | `grammar/british-grammar/shall`（**本批新取**） | ✅ **本轮 WebFetch 直连实取** | 无 CEFR | **逐字**："**We use shall I and shall we to make offers and suggestions, and to ask for advice.**"（`Shall I carry your bag?`／`Shall I call again on Thursday?`／`What shall we do with this?`）；**位置**："Shall comes first in the verb phrase（after the subject and before another verb）."；**只配 I/we**："Used mostly with I and we."；**反问尾**："I'll phone you later, shall I?"；**典型错误**："Use should, not shall, for advice"（`In my opinion, we should book another hotel.`）→ **Cambridge 语法页承认 `shall I/we` 是提议，但与 `suggestions` 页不交叉（两页各写一套）**——**本条与 CAM-13 合起来说明上游对「提议家族」的归类本身是分裂的** |
| CAM-17 | **`grammar/british-grammar/have-something-done`**（**C 档复核，本批重取**） | ✅ **本轮 WebFetch 直连实取** | **无 CEFR** | **逐字复核（口径零变化）**：① "have + object + -ed form"（"used when someone does something for us that we ask or instruct"，`We're having the house painted next week.`／**`I had my hair cut.`**）；② **Warning 逐字**："a warning that the pattern differs from perfect tenses"（`I had my hair cut.` ＝ `Someone cut my hair.` 对 `I've cut my hair.`／`I'd cut my hair.`／`I cut my own hair.` ＝ 自己做）；③ 受害型（`They've had their car stolen`／`Hundreds of people had their homes destroyed by the hurricane`）；④ 让人做（`have + object + infinitive without to`，`I'll have Harry book you a taxi.`／`He had Kay make us all some tea.`）；⑤ 经历（`have + object + -ing form or infinitive without to`，`We had a man singing to us as we sat in the restaurant having our meal.`／`Her story had us laughing so much.`）→ **本批复核结论：口径零变化**（§8 表） |
| CAM-18 | `grammar/british-grammar/as-as`（查 `as soon as` 是否落在此页） | ✅ **本轮 WebFetch 直连实取** | 无 CEFR | **逐字复核结论：本页是 `as … as` 比较结构，`as soon as` 只作为例子里的一部分出现一次**（`Can you come as soon as possible?`，**属 possibility/ability after as…as 小节的例句**）→ **`as soon as` 的规则落点是 `conjunctions-time`（CAM-1），不是 `as-as`** |

**Cambridge 小结（本批四条）**：**① 本批唯一「规则级原文最硬」的候选是 `as soon as`（`conjunctions-time` 同小节并列 ＋ ❌will 明文）；② `seem`／`appear` 本轮首次取到词典 CEFR（双 B1）与 `Appear or seem?` 语法小节——批二十记的「零课位」指的是 BC 课程位，本轮须区分「课程位零」与「词典/语法层有页」；③ `neither/either/both` 三连体拿到两条硬轴（`both` 不用否定／`neither` 不用 `none`）＋中文侧六条 ❌；④ `shall we` 在两页（词典 A2 ＋ 语法页）都有，但 `suggestions` 提议专页不收它——上游归类分裂。**

### 1.3 Murphy（本机官方 TOC 原件 ＋ PDF 内嵌流复核）

**取到情况**：`/private/tmp/murphy_ess.txt`（初级 4th TOC 抽文，187 行）·`/private/tmp/murphy_int.txt`（中级 4th TOC 抽文，65 行）·`/private/tmp/murphy_full.txt`（中级全目块，含 U1–U145 与附录页）·`/private/tmp/murphy_ess.pdf`／`murphy_int.pdf`（PDF 原件）。**本轮方法**：去空白归一化（`tr -d ' \n\r\t'`，两册分别 13,966／11,016 字符）后逐词 grep，**避免「单词被空格拆散导致假 0」的坑**（**本轮实测：不归一化时全部候选返回 0，归一化后才取到真值——这是本批方法级的一条校正，见 §7 口径校正 1**）。

| 项 | 本轮逐字复核结果（**去空白归一化后**） |
|---|---|
| **`as soon as`（本批重点）** | **初级 0／中级 0／中级全目块 0**（`assoonas` 两册三通道全 0）。→ **Murphy 无本结构** |
| **`neither`／`either`／`both`** | **初级：`both/either/neither` 合并在 U82「`both either neither`」（去空白逐字＝`82botheitherneither`）**；**中级：U89 `both / both of  neither / neither of  either / either of`**（逐字＝`89both/bothofneither/neitherofeither/eitherof`）；**初级另有 U42 `too/either  so am I / neither do I etc.`**（逐字＝`42too/eithersoami/neitherdoietc.`）→ **Murphy 给了两条轴且只给两条**：**「两者都/都不/任一」（U82 初／U89 中）**与 **「附和别人」（U42 初）**；**U42 是初级独有，中级无对应** |
| **`would rather`** | **中级 U59 标题逐字＝`prefer and would rather`**（归一去空白＝`59preferandwouldrather`）；**初级 0**（初级 `would` 只出现在 U34 `Would you like…? I'd like…`）。**另：中级 U104 `quite, pretty, rather and fairly`** 是「rather＝相当」义，**与本项无关**（须区分） |
| **`seem`／`appear`** | **初级 0／中级 0／中级全目块 0**（两册三通道全 0）。→ **Murphy 双册无 `seem`／`appear` 任何单元、任何标题** |
| **`the same as`** | **`thesameas` 三通道全 0**；甚至 **`same` 单字也三通道全 0**（归一化后逐字复核）→ **Murphy 无本项** |
| **`shall we`／`why not`** | **`whynot` 三通道全 0**；**`shall` 初级 2 处＝U27／U28 标题 `will/shall 1`／`will/shall 2`**，**中级 2 处＝U21／U22 标题 `will and shall 1`／`will and shall 2`**——**四处的 `shall` 全在「will 的将来义」单元标题里，无一处是提议义** → **`shall we`（提议）在双册无落点；`why not` 全 0** |
| **`will have`** | **中级 U24 标题逐字＝`will be doing and will have done`**（归一去空白＝`24willbedoingandwillhavedone`，**本批唯一命中**）；**初级 0**（初级将来块＝U25 `What are you doing tomorrow?`／U26 `I'm going to…`／U27／U28 `will/shall 1/2`）→ **`will have` 有中级单元位** |
| **`sound`／`smell`／`taste`／`feel`／`look like` 族** | **四词两册三通道全 0**；**`like` 命中 5（初）／4（中），全在单元标题的「like＝喜欢」或「like and as」义**（初级 U5 `I do/work/like etc.`／U34 `Would you like…?`／U46 `What is it like?`／U72 `I like music, I hate exams`；中级 U58 `verb + -ing or to… 3（like/would like etc.）`／U117 `like and as`／U118 `like as if`）→ **感官 `like` 扩展在双册零落点**（**与批二十一判读一致**） |
| **时间家族（对照用）** | **初级 U98 `When…`／U99 `If we go…`／U105 `before after during while`／U104 `from…to until since for`**；**中级 U25 `when I do and when I've done`／U116 `as (as I walked… / as I was… etc.)`／U119 `during for while`／U120 `by and until by the time…`** → **Murphy 的时间家族分两处：初级 U98（when）／U104–105（介词岗）；中级 U25（when I do／when I've done）／U120（by and until by the time）**。**`as soon as` 仍 0**——**即 Murphy 把 `as soon as` 整个漏掉，时间从句只教 when／until／before／after／while（＋中级 as）** |
| **复现装置（§5 用）** | **初级**：`Additional exercises 252`／`Study guide 271`／`Key to Exercises 283`／`Key to Additional exercises 310`／`Key to Study guide 313`／`Index 315`；**中级**：`Additional exercises 302`／`Study guide 326`／`Key to Exercises 336`／`Key to Additional exercises 368`／`Key to Study guide 372`／`Index 373`。→ **两册都有一座「书末复现三件套」：Study guide（按「我不确定该学哪几课」索引，**U 号被重新编排**）＋ Additional exercises（**额外的练习集**）＋ 两套答案**。**注意：`Study guide` 的入口句逐字（两册页脚）＝"IF YOU ARE NOT SURE WHICH UNITS TO STUDY, USE THE STUDY GUIDE ON PAGE 271（中册 326）"** → **Murphy 的复现装置是「按需索引 + 额外练习」，不占正课单元号**（§5.1） |

**Murphy 小结（本批三条）**：**① `as soon as`／`seem`／`appear`／`the same as`／`why not` 在双册全 0——这是「Murphy 层真空白」的五个项；② `neither/either/both`（初 U82／中 U89＋初 U42 附和轴）与 `would rather`（中 U59）与 `will have`（中 U24）有单元位；③ `shall` 的四处全在 will 将来义，提议义无落点。** 另加**方法级发现**：**Murphy TOC 抽文的文本被逐字符空格拆散，任何单词级 grep 在未归一化时都会返回 0**——**本批把「归一化后复算」写成固定口径**（§7 口径校正 1）。

### 1.4 中文侧 english.cool（869 篇 sitemap）

**取到情况**：sitemap 本机缓存 `/private/tmp/ec-urls.txt`（**869 行**），**本轮逐词 regex 复算并落盘 slugs 清单**（`/private/tmp/ec_slugs.txt`，**855 条唯一 slug**）。

| # | 篇目 | 取到情况 | 本轮要点（**原文级**） |
|---|---|---|---|
| EC-1 | **`https://english.cool/conjunctions/`**（**本批新取，`as soon as` 的中文侧落点**） | ✅ **本轮 WebFetch 直连实取** | **「時間關係」节逐字列出：`when, while, before, after, since, as soon as, until`**（**七项并列成表**）；`as soon as` 例句逐字：**`The baby stopped crying as soon as she saw her mother.`（那個小嬰兒一看到媽媽就不哭了）**；`when` 例 `When I came home, my dad was watching TV.`；`while` 例 `My phone rang while I was taking a shower.`；`before` 例 `Before you left the room, please turn off all the lights.`；`after` 例 `After I took a shower, I went to bed.`；`since` 例 `I have lived in Taipei since I was little.` → **中文侧把 `as soon as` 明确归入时间家族**（**本批章设计的第二条依据**）；**注意本页不含「用现在式代替未来式」的说明**（该规则我在 `after` 专文里取到，见 EC-2） |
| EC-2 | `https://english.cool/after/`（**本批新取，`as soon as` 的邻近页**） | ✅ **本轮 WebFetch 直连实取** | **逐字**："after 的核心精神就是「在某件事之後」"；**作连词时**："用現在式代替未來式"——**`after class will end` 标错、`after class ends` 标对**；**作介词时**：`after eat` 标错（"當你想接「動詞」時，after 後面要用動名詞（V-ing），不能直接放原形動詞"）；**`after vs in`**："after 後面接的是一個「事件或時間點」，in 後面接的是一段「時間長度」"；**本页 `as soon as` ＝ 0／`when` 对比 ＝ 0** → **中文侧的「时间从句不用 will」规则落在 `after` 专文，不在 `conjunctions` 总表**（**须分页引用，见 §9.2 未核实③**） |
| EC-3 | **`https://english.cool/both/`**（**本批新取**） | ✅ **本轮 WebFetch 直连实取** | **六条规则＋六条 ❌（本批最好用的中文侧素材）逐字**：① `both A and B`（"兩者皆是；是 A 也是 B"，`both the Netherlands and Belgium`／`I dislike both Danny and Sammy.`；作主词动词用复数 `Both Canada and Argentina are far away from Taiwan.`）；② `both + 複數名詞`（`Both children were born in Taipei.`）；③ `both of` 接所有格时 of 可省（`Both of my friends can speak Mandarin Chinese.`），**接定冠词 the 时省略 of 后须去掉 the**（**`She is learning both languages.`⭕／`She is learning both the languages.`❌**）；④ `both of + 複數代名詞`**一定要用 of 隔开**（**`Both of them enjoy hiking.`⭕／`Both them enjoy hiking.`❌**）；⑤ 代词后位置（**`We both prefer pop music.`⭕／`Both we prefer pop music.`❌**；**`I saw them both.`⭕／`I saw both them.`❌**；be 后 `The watches are both quite expensive.`；助动词后 `You should both meet each other halfway`）；⑥ **否定句陷阱（本批的设计轴）**："both 一般不用於否定句，須用 neither"——**`Neither of them won the prize.`⭕／`Both of them didn't win the prize.`❌**；**`Neither my sister nor your brother is going to the party.`⭕／`Both my sister and your brother aren't going to the party.`❌** |
| EC-4 | **`https://english.cool/either-neither/`**（**本批新取**） | ✅ **本轮 WebFetch 直连实取** | **首屏自测对逐字**：题句 `A: I don't like eating ice cream. B: ＿＿＿（Neither/Either） do I.`；**揭晓 `Neither do I.`**；**四条规则逐字**：either 作副词表「也」时"它會用在附加的句子中來附和一個否定的句子"并"配合 not 一起使用"；either 作代名词时"either 本身在英文裡被視為單數，因此動詞需為單數"；neither 作副词时"會以倒裝句的形式獨立成一個句子來認同某個否定的敘述"；neither 作对等连接词时"形成 neither A nor B，專用在否定的狀況中，表示「兩者皆非」"；**病灶描述逐字**："either 和 neither 實在太像了，使得很多人搞不清楚怎麼用才是對的" → **本批第二篇中文侧专文，给了「附和」轴的现成自测对与病灶** |
| EC-5 | **`https://english.cool/seem/`**（**本批新取，`seem`／`appear` 的唯一中文侧专文**） | ✅ **本轮 WebFetch 直连实取** | **逐字**："Seem 是「看起來」或「似乎」的意思"；**定性**："連綴動詞"，"後面可以接「形容詞」、「不定詞」或「名詞子句」"；**七个句式逐字**：`Seem + adjective`／`Seem to + verb`／`Seem to have + p.p.`／`There seems to be + noun`／`It seems like + clause`／`It seems as if/as though + clause`／`It seems that + clause`；**例句**：`She seems furious.`／`He doesn't seem to care about his grades.`／`The house seems to have been trashed.`／`There seems to be a mistake here.`／`It seems like the typhoon's about to hit the country.`／`It seems as if it were just a dream.`／`It seems that she's having the baby soon.`；**`seem` 对 `appear` 的明文分工（本批最有价值的一条）**："Seem 可用來敘述客觀的事實，也可用來傳達主觀和情緒上的印象或感想"，而"**appear 則是個更正式一點的字，並且通常只會被用來描述客觀的現象**"；**明文禁用**："**Appear 後面不能加 like/ as if/ as though**"——**❌ `It appears like you're depressed.` 对 ⭕ `It seems like you're depressed.`** → **中文侧给了 `seem` 七句式 ＋ `appear` 一条硬禁用**（**这与 Cambridge 的 `Appear or seem?` 小节同轴**） |
| EC-6 | `https://english.cool/should-shall/`（**本批新取，`shall we` 的中文侧落点**） | ✅ **本轮 WebFetch 直连实取** | **逐字**："「**Shall I …?**」或「**Shall we …?**」的句型可以用來表示提議，或是想要對方做決定的提問"；例句 `Shall I close the window?`／`Shall I leave the door open?`／`Shall we go out for dinner tomorrow?`／`Shall we meet sometime next week?`；**明文体裁差异**："这种用法 more common in British English，而 American English 更自然地用 `Should we go to the park?`"；**另一条**：`shall` 在当代"相對少見"，常被 `will` 取代，主要用于第一人称 → **`shall we` 有中文侧专页落点，且该页自己承认它在美式里不自然** |
| EC-7 | `https://english.cool/future-perfect-tense/`（**本批新取，`will have` 的中文侧落点**） | ✅ **本轮 WebFetch 直连实取** | **逐字**：未来完成式描述动作"在未來某個時間點之前將已經完成"；句型"不管主詞是什麼，未來完成式的句型都會用「**will have + P.P.**」的型態"；例 `I will have finished the work by tomorrow.`；否定 `I will not have eaten dinner. = I won't have eaten dinner.`；疑问 `Will she have left the party?`；**用法二（持续）**：可表持续状态，常与 `for` 连用，与未来完成进行式可互换（`I will have learned English for two years tomorrow.`）；**本页无小試身手、无 ❌** → **`will have` 中文侧有一篇专文，但它与「小美的一天」的场景耦合须另造** |
| （检索复算） | sitemap 869 条 regex 复算（**本批逐词**） | — | **`soon` 命中 1 篇＝`get-well-soon`（无关，是「早日康复」）**；**`neither` 2 篇**（`neither-nor`／`either-neither`）；**`either` 3 篇**（`either-or`／`neither-nor`／`either-neither`）；**`both` 1 篇**（`both`）；**`rather` 1 篇＝`rather-than`（「而不是」义，与本项无关）**；**`seem` 1 篇**（`seem`）；**`appear` 0**；**`same` 0（无任何 slug 含 same）**；**`shall` 1 篇**（`should-shall`）；**`why` 1 篇＝`why-learn-english`（无关）**；**`smell`／`taste`／`feel` 全 0**；**`hair`／`fixed` 0／`cut` 2 篇均无关**（`execute-implement-carryout`／`executive-assistant-special`）→ **`the same as`／`appear`／`why not`／`what about`／`how about` 在 sitemap slug 层面零专文**（**注意：`conjunctions` 总表页含 `as soon as`，但其 slug 不含 `soon`——故 `soon` 的 1 篇命中是假阴性，`as soon as` 的中文侧落点须靠内容级检索，见 §9.2 未核实③**） |

**中文侧小结（本批三条）**：**① `as soon as` 的中文侧落点在 `conjunctions` 总表的「時間關係」节（七项并列），不在任何 slug 含 `soon` 的专文里；② `neither/either/both` 与 `seem` 各有独立专文，且中文侧的 ❌ 数量是本批全部候选里最多的（10 条）；③ `would rather` 中文侧零专文（`rather-than` 是另一个义项），`the same as` 零专文，`why not` 零专文。**

---

## §2 对比表

| 候选 | Murphy（册别＋单元号） | BC（含 CEFR 段位） | Cambridge | 中文侧 | 我方现状（**GL／HC 双文件复算**） |
|---|---|---|---|---|---|
| **① `as soon as`（一…就…·本批首选）** | **双册三通道全 0**（`assoonas`）；**但时间家族邻居厚**：初 U98 `When…`／U104 `from…to until since for`／U105 `before after during while`；中 U25 `when I do and when I've done`／U116 `as`／U119 `during for while`／U120 `by and until by the time` | **三档 68 课零课程位**（A1-A2 18／B1-B2 36／C1 14 本轮全部直连复点）；**规则级落点在参考层**＝`verbs-time-clauses-if-clauses`（Level: beginner）**"We do not normally use will in time clauses and conditional clauses."**＋❌`（NOT will finish work）` | **语法页 `conjunctions-time` 明文把 `when, once, as soon as` 放在同一小节**＋❌will 逐字（`as soon as I will get to the office`）＋首屏例 `We always have an ice cream as soon as we get to the beach.`；**词典 `soon` 条给 `as soon as` 独立标位 B1**（`soon` 本词 A2） | **`conjunctions` 专文「時間關係」七项并列**（`when/while/before/after/since/as soon as/until`）＋逐字例 `The baby stopped crying as soon as she saw her mother.`；**`after` 专文给「用現在式代替未來式」** | **`as soon as` GL 0／HC 0；`soon` GL 0／HC 0（真空白·须造词）**。**但时间家族地板已铺满**：`when` GL 295／`after` GL 322／`before` GL 230／`until` GL 70（**全为英文语料**）；**接口课现成**：L90 `after`／L91 `before`／L92 `when`（**逐字 oneLineRule：「它跟 after/before 是同一个三人组（后面都跟一整句）」**）／L109 `until`（**逐字 ❌「I waited until the rain will stop.」——与本候选同轴**） |
| **② `neither`／`either`／`both`（三连体）** | **初 U82 `both either neither`**（去空白逐字 `82botheitherneither`）＋**初 U42 `too/either  so am I / neither do I etc.`**（附和轴）；**中 U89 `both/both of  neither/neither of  either/either of`**（**中级无附和轴**） | **三档 68 课零课程位**（本轮复点） | **词典三级段位**：`both` **A1**／`either` **B1**（两义）／`neither` **B2**；**语法页 `both`** 明文 "We don't normally use both（of）+ not…" ＋**Not: Both of these shirts aren't dry yet.**；**语法页 `neither-neither-nor`** "We use neither, not none, when we are talking about two people or things" ＋`neither ... nor` ＋拼写警告 | **两篇专文＋10 条 ❌**：`both` 六条（`both the languages`❌／`Both them`❌／`Both we`❌／`both them`❌／`Both of them didn't win`❌／`Both my sister and your brother aren't`❌）；`either-neither` 有首屏 ❌ 自测对（`Neither do I.`）＋病灶「實在太像了」 | **三项全 0**（`neither` GL 0／HC 0；`either` 0／0；`both` 0／0——**`both` 的 raw 命中全是 `bothRight` 字段名，非英文语料**，**批十七已复算过，本轮复核成立**）；**接口课现成**：L25／L34（三单·there be）、L26 `there is/are` |
| **③ `would rather`（宁愿）** | **中级 U59 `prefer and would rather`**（本族唯一「不在 `to + -ing` 块内」的项，U59 在 U60 之前）；**初级 0**；**注意中 U104 `quite, pretty, rather and fairly` 是「相当」义，不得混引** | **三档 68 课零课程位**（本轮复点） | **词典 headword `would rather` 独立标 B1**（注 `(also 'd rather)`）；**语法专页 `would-rather-would-sooner`** 给两条轴（同人＋原形／换人用过去式）＋**两条典型错误逐字**（Don't use -ing or to-infinitive／attach not to the second clause）＋`would sooner`／`would just as soon` 同族 | **零专文**（sitemap 复算：`rather` 仅命中 `rather-than`＝「而不是」义）；**`will-vs-would` 专文含 `would` 四用法但不含 `would rather`（本轮逐字复核）** | **`would rather` GL 0／HC 0；`rather` GL 0／HC 0（真空白）**；**但 `would` 本身 GL 163／HC 11、`would you like` GL 52（L62–L66 批九已教「客气档」）、`let's` GL 60**——**「说话人意愿」的语用场我方已有** |
| **④ `seem`／`appear`（看起来似乎）** | **初级 0／中级 0／中级全目块 0**（三通道全 0——**双册无任何落点**） | **课程位零；表内落点＝B1-B2 第 30 课 `Stative verbs`**（`appear, be, feel, hear, look, see, seem, smell, taste` 表内并列，规则 "They aren't usually used in the present continuous form."）；**`sound` 不在该表** | **词典 `seem` ＝ B1**（`[ + to infinitive ]`／`[ + (that) ]`）；**词典 `appear` 的 SEEM 义 ＝ B1**（`[ L or I, not continuous ]`）**＋专门 Grammar 小节 `Appear or seem?`**；**`linking-verbs` 页正文 `seem` ＝ 0**（**本轮复核：该页不教 seem**） | **`seem` 专文一篇**（七句式＋`seem` 对 `appear` 明文分工＋**`Appear 後面不能加 like/as if/as though`**＋❌`It appears like you're depressed.`）；**`appear` 零专文** | **`seem`／`seems`／`seemed`／`appear`／`appears` 五项全 0（真空白）**；**但感官五格已铺满**（`looks`／`sounds`／`smells` GL 70／`tastes` GL 64／`feels`）——**L125–L133 六课已立岗**；**`looks like` GL 5（L127 认读 `It looks like rain.`，三护栏）** |
| **⑤ `the same as`（和…一样）** | **`thesameas` 0／`same` 单字 0**（三通道） | **A1-A2 第 5 课 `Comparative adjectives` 本轮直连复核：`the same as` ＝ 0／`as … as` ＝ 0**（只教比较级 + `than`）→ **BC 无落点** | **词典 `same` 条 EXACTLY LIKE 义项标 A2**（"exactly like"，例 `People say I look just the same as my sister.`） | **零专文（sitemap `same` 命中 0）** | **`the same as` GL 0／HC 0；`same` 单独 GL 2／HC 1**——**GL 两处均在英文语料**（L112 `They look the same!` ／ L138 `Are they the same?`）；**HC 1 处是案内 `tokens` 数组里的一个词**（`the same bag` 那案的 token，**非教学位**）；**L138 逐字 `Are they the same?`（她问这两个 to 是不是一回事）** |
| **⑥ `shall we`／`why not`／`what about`（提议家族）** | **`shall` 四处全在 will 将来义标题**（初 U27／U28；中 U21／U22）**，无提议义**；**`whynot` 三通道全 0** | **三档 68 课零课程位**；**`question-tags` 课 `shall` ＝ 0**（本轮直连复核） | **词典 `shall`（SUGGEST）＝ A2**（"used, with 'I' or 'we', to make a suggestion"）；**语法页 `shall` 承认 "We use shall I and shall we to make offers and suggestions"**；**但语法页 `suggestions` 收五种提议、不收 `shall we`**（本轮双页对照）；**`why not...?` ＝ B1** | **`should-shall` 专文给 `Shall we…?` 提議用法**＋**自己承认美式不自然**（`Should we go to the park?`）；**`what about`／`how about`／`why not` 零专文** | **`what about` GL 3／HC 0（全是「你呢」义）；`how about` GL 20／HC 1（GL 裸 grep 21，差额是 1 处中文注释行）；两串合计 GL 23 ＋ HC 1 ＝ 24**——**L75 已教 `Let's`＋`How about`（逐字 oneLineRule ＋ contrast 六条都在：2 条错卡 ＋ 4 条 `bothRight`）；L45 已教 `What about you?`「你呢」义**；**`shall` GL 0／HC 0；`why not` GL 0／HC 0** |
| **⑦ 感官 `like` 扩展（`sound/smell/taste/feel like`）** | **三通道全 0**（`soundlike`／`smelllike`／`tastelike`／`feellike` 逐字） | **课程位零**；**`Stative verbs` 表内不含 `sound`**（本轮复核） | （批二十已取相关页，本轮不重取——见 §9.2 未核实⑤） | **`sense-verbs` 篇有五词表**（批十九／二十已用） | **`sounds like`／`smells like`／`tastes like`／`feels like` 四项 GL 0／HC 0；`looks like` GL 5**（**L127 认读**）→ **四项须造词架，维持不排期** |
| **⑧ `will have`（将来完成）** | **中级 U24 `will be doing and will have done`**（本批唯一命中）；**初级 0**（初级将来块 U25–U28 无 will have） | **B1-B2 第 8 课 `Future continuous and future perfect` ＝ 有课程位**（本轮直连实取：`will/won't have + past participle` ＋ `by the time` ＋ 七条例句） | （`will` 语法页本轮复核：**该页无 future perfect 小节**——`will have` 的 Cambridge 语法落点须另找，见 §9.2 未核实④） | **`future-perfect-tense` 专文一篇**（`will have + P.P.` ＋否定/疑问＋ `for` 持续义；**无 ❌、无小試身手**） | **`will have` GL 0／HC 0；`will` 本身 GL 268 处（L12 已教 `I will draw tomorrow.`）；`by the time` GL 0** |
| **⑨ C 档 `have sth done`（复核）** | **中级 U46 `have something done`**（跨级，在 U42–U45 被动块之后）——**口径零变化** | **三档 68 课零课位** | **`have-something-done` 专页（本批重取）**：三用法＋**Warning「not the same as perfect tenses」**（`I had my hair cut.` 对 `I've cut my hair.`）；**无 CEFR** | 有节级落点（`causative-verbs` 的「使役動詞的被動句型」节含 `I had my hair cut.`） | **口径零变化**：`will have` 0／`cut` 0／`fixed` 0／`haircut` 0／`repaired` 0／`checked` 0／`had my` 0；**唯一差异仍是 `have my` GL 1**（批二十一已记，本轮复核一致） |

---

## §3 三问制正当性表（①跨源课程位 ②中文侧实证 ③我方接口）

**口径**：①＝**课程位**（BC 三档 68 课／Murphy 单元号）与**规则级落点**（Cambridge 语法页／参考层）**分开记**；②＝中文侧**专文或专表**；③＝**我方两文件实测**（含造词成本与切开成本）。档位沿用 A／B／C／D 四档。

| 序 | 候选 | ① 跨源课程位 | ② 中文侧实证 | ③ 我方接口 | 造词成本 | **档** | 判读 |
|---|---|---|---|---|---|---|---|
| **1** | **`as soon as`（一…就…）** | **课程位零**（BC 68 课／Murphy 双册三通道全 0）；**但规则级落点是本批最厚**：Cambridge **`conjunctions-time` 明文同小节并列 `when, once, as soon as`** ＋ **❌will 逐字**（`as soon as I will get to the office`）；**BC 参考层同规则**（"We do not normally use will in time clauses and conditional clauses."）；**词典独立标位 B1** | **中**：`conjunctions` 专文「時間關係」**七项并列成表**（`when/while/before/after/since/as soon as/until`）＋逐字例 `The baby stopped crying as soon as she saw her mother.`；**但无独立专文**（sitemap `soon` 只命中 `get-well-soon`）；**「从句现在/主句将来」的规则在 `after` 专文里**（须分页引） | **强**：**时间家族地板已铺满**（数析口径 GL `when` 267／`after` 167／`before` 79／`until` 64／`while` 86）；**且 L92 的 oneLineRule 逐字已留口**——「它跟 after/before 是**同一个三人组**（后面都跟一整句）」；**L49 已教同型时序规则**（「if 里说现在，主句说将来——if 里不用 will」）；**L109 已出同型 ❌**（`I waited until the rain will stop.`）；`as soon as`／`soon` GL 0／HC 0 | **1 新词（`soon`）＋ 1 旧词新义（`as`）＋ 1 处切开（与 `when`）** | **B** | **可单开 3 课小章**（§4.2）。**关键判读：它的价值不在「填空地」，而在「家族已建、只缺一格」**——第四格 `until`（L109）交付时本项目已用「等的那道线」话术，本候选是**同族的紧接义**。**风险（数析 §1.3 已提，本方正面回应）**：`when` 与 `as soon as` 语义只差一个刻度 → **所以第 2 课必须是「切开课」**，把刻度差做成那一课的真实增量（§4.2）。 |
| **2** | **`neither`／`either`／`both`（三连体）** | **课程位零**（BC 68 课）；**Murphy 有单元位**：初 **U82 `both either neither`**／中 **U89 `both/both of  neither/neither of  either/either of`**／**初 U42 `too/either  so am I / neither do I etc.`（附和轴，中级无）**；**词典三段位齐（本批新取）**：`both` **A1**／`either` **B1（两义）**／`neither` **B2**；**Cambridge 两页硬轴**（`both` 不用否定／`neither` 不用 `none`） | **强**：`both` 专文**六条 ❌ 逐字**（`both the languages`❌／`Both them enjoy hiking.`❌／`Both we prefer pop music.`❌／`I saw both them.`❌／`Both of them didn't win the prize.`❌／`Both my sister and your brother aren't going to the party.`❌）；`either-neither` 专文有**首屏自测对**（`Neither do I.`）＋病灶「實在太像了，使得很多人搞不清楚怎麼用才是對的」 | **中**：三项全 0（`both` 的裸 grep 假阳性已剔除——**全为 `bothRight` 字段名**）；**接口课现成**：L25／L34（三单·there be）、L26 `there is/are`、L19／L20（`and/but`／`because/so` 连接词家族，**但只有 2 课可复现**） | **4 新词（`neither`＋`either`＋`both`＋`nor`）＋ 3 新串**（`neither...nor`／`either...or`／`both...and`）→ **超先例上限（批二十 3 个）** | **B−** | **可成 3 课，但不是「2 课」**（**改批十七判读，见 §7 口径校正 2**）：**实质只有两条轴**（`both`＝两者都／`neither`-`either`＝两者都不与二选一）＋**第三条轴是「否定位置」**（both 不用否定、neither 不用 none）——**3 课的第三课必须是这条轴的切开/收口**，否则就是换词。**成本是四候选里最高的一项。** |
| **3** | **`would rather`（宁愿）** | **课程位零**（BC 68 课）；**Murphy 中级 U59 `prefer and would rather`**（**U53–U68 的十六课连续块内，但 U59 在 U60 之前，是本族唯一不在 `to + -ing` 块内的项**）；**词典 headword 独立标 B1**（注 `(also 'd rather)`）；**Cambridge 专页给两条轴**（同人＋原形／换人用过去式）＋**两条典型错误逐字** | **弱**：**sitemap 零专文**——`rather` 只命中 `rather-than`（「而不是」义，与本项无关）；`will-vs-would` 专文含 `would` 四用法**但不含 `would rather`**（本轮逐字复核） | **中**：`would rather`／`rather` GL 0／HC 0（真空白）；**但「说话人意愿」的语用场我方已有**——`would` GL 163／`would you like` GL 52（L62–L66 批九已教客气档）／`let's` GL 60；**接口课**：L62–L66（would like／Would you mind）、L47 `should`（建议） | **1 新词（`rather`）＋ 1 旧词新岗（`would` 的第三义）** | **B−** | **可开 2 课，但 3 课无增量**：第 1 课「同人·宁愿」（`I'd rather stay at home.`）；第 2 课「换人·宁愿你…」（`I'd rather you stayed.`）＋否定（`I'd rather not`／`She'd rather you didn't`）。**第 3 课只能靠「与 would like 切开」撑，而那是换词**。**中文侧零专文是硬伤**（本批四候选里唯一零专文）。 |
| **4** | **`seem`／`appear`（看起来好像）** | **课程位零**（BC 68 课／Murphy 双册三通道全 0）；**但本轮首次取到三条正向证据**：**BC `Stative verbs` 表内并列 `appear ... seem`**（senses and perceptions 组）＋**词典双 B1**（`seem` ＝ B1；`appear` 的 **SEEM** 义 ＝ B1，`[ L or I, not continuous ]`）＋**Cambridge 专门 Grammar 小节 `Appear or seem?`** | **强**：`seem` **独立专文**（七句式逐字：`Seem + adjective`／`Seem to + verb`／`Seem to have + p.p.`／`There seems to be + noun`／`It seems like + clause`／`It seems as if/as though + clause`／`It seems that + clause`）＋**`seem` 对 `appear` 明文分工**（appear 更正式、只描述客观现象）＋**一条硬禁用**（**`Appear 後面不能加 like/ as if/ as though`**，❌`It appears like you're depressed.`）；**`appear` 本身零专文** | **强（结构接口最干净）**：**与批二十 L128 同骨架**（`It ＋ 动词 ＋ 形容词`，L128 逐字 `It sounds great.`）→ **只换动词，不新骨架**；**感官五格已铺满**（`looks`／`sounds`／`smells` GL 70／`tastes` GL 64／`feels`）；**cloze 双通道友好**（数析 §5.3：`seem` 族是**唯一** ambush 空位能落考点词的候选族）；`seem`／`seems`／`seemed`／`appear`／`appears` 五项全 0 | **2 新词（`seem`＋`appear`）＋ 0 附带**（**本批四候选里成本最低**） | **C＋（升档·由批二十 D 升）** | **升档理由与保留理由并列**：**升**——批二十判 D 的依据是「两文件全 0 且上游无课位」，本轮取到**词典双 B1 ＋ 专节 ＋ 中文专文 ＋ BC 表内落点**四条，**「上游无位」不再成立**；**保留**——**课程位仍零**，且**与 L125 `It looks nice.` 的语义距离小**（「看起来」vs「好像」对零基础几乎同义）→ **第 1 课有与 L125 重复的风险**。→ **列备选 A（§4.3），不作首选**。 |
| **5** | **`the same as`（和…一样）** | **三通道全 0**（Murphy `thesameas` 与 `same` 单字均 0）；**BC 无落点**（A1-A2 `Comparative adjectives` 本轮直连复核：`the same as` ＝ 0／`as … as` ＝ 0）；**词典 EXACTLY LIKE 义项标 A2** | **弱**：**sitemap `same` 零命中**（无任何 slug 含 `same`）→ **零专文** | **弱**：`the same as` GL 0／HC 0；`same` GL 2（`They look the same!` L112 ＋ L138 `Are they the same?`）／HC 1 | **0–1 新词 ＋ 2 附带**（`as` 的「像」义 ＋ 与 L65 `as tall as` 同形不同数的切开） | **C** | **不单开**：**上游给的段位是 A2（词典），但形态是「比较结构的附属品」**——它不是独立结构（要两个可比对象），**而「小美的一天」是单人视角**（对话里最多两人），**场景天然不友好**；**且我方 `same` 的 2 处已在用「一样不一样」这个语义**（L138 收口课正在用），**做正课会与 L138 抢话**。 |
| **6** | **`shall we`（提议·第一人称）** | **BC 68 课零**（`question-tags` 页 `shall` ＝ 0，本轮直连复核）；**Murphy `shall` 四处全在 will 将来义标题**（初 U27／U28；中 U21／U22），**无提议义**；**Cambridge 自我分裂**：词典给 **`shall`（SUGGEST）＝ A2**，语法页 `shall` 承认 "We use shall I and shall we to make offers and suggestions"，**但语法页 `suggestions` 收五种提议、不收 `shall we`**（本轮双页对照） | **中**：`should-shall` 专文给 `Shall I…?`／`Shall we…?` 提議用法＋四条例句；**但该页自己承认美式更自然用 `Should we…?`** | **弱**：`shall` GL 0／HC 0；**提议场我方已由 L75（`Let's`＋`How about`）占满**，**再开一格只能靠「第一人称 vs `Let's`」这一条细线** | **1 新词（`shall`）＋ 场景新建** | **D** | **不排期**（**理由与批十一不同，须明写**）：批十一不做是因为「提议家族未开」，**本批不做是因为「家族已开且已满」＋上游自己在 `suggestions` 专页里不收它 ＋ 中文侧自认美式不自然**。 |
| **7** | **`why not`（提议·疑问式）** | **课程位零**；**Murphy `whynot` 三通道全 0**；**Cambridge 词典独立条目 B1** ＋ **语法页 `suggestions` 明文收 `Why not …? and why don't …?`**（`Why not take a break in the south-west?`／`Why don't we stop now and work on this tomorrow morning?`） | **弱**：sitemap `why` 只命中 `why-learn-english`（无关）→ **零专文** | **弱—中**：`why not` GL 0／HC 0；**接口是 L75 的 `How about`**（同一页同一功能），**可作 L75 的第 2 课折入** | **0 新词（`why` 已在库 8 处，全是「为什么」问句）＋ 1 新串** | **C** | **不单开，可折入**：**它与 `How about` 在 Cambridge 的 `suggestions` 页里是同一小节的两种问法**（`Why not take…?`／`Why don't we…?`）——**这正是「一课一增量」的反面**（同一功能换说法）。**若生产期有余量，可作 L75 的补课或折卡**。 |
| **8** | **感官 `like` 扩展（`sound/smell/taste/feel like`）** | **三通道全 0**（Murphy `soundlike`／`smelllike`／`tastelike`／`feellike` 逐字）；**BC 课程位零**；**BC `Stative verbs` 表内不含 `sound`**（本轮复核） | **中**：`sense-verbs` 篇有五词表（批十九已取，**其中 `look like…` 五例与五词同篇并列**） | **中**：四个搭配整串全 0；**`looks like` GL 5 全是 L127 认读种子**（文案逐字「今天只认脸，不学新花样——以后再说它」） | **0 新词（五个动词全在库）＋ 4–5 个搭配整串新建** | **D** | **维持不排期**（批二十已判）：**它的第 1 课必然与 L127 的认读种子重复**，**且 `X + like` 是「同一骨架换搭配」**——**一课一增量只能靠「like ＝ 像」这一条轴撑一次**，撑不了 3 课。 |
| **9** | **`will have`（将来完成）** | **课程位这次是「有」**：**BC B1-B2 第 8 课 `Future continuous and future perfect`**（本轮直连实取 `will/won't have + past participle` ＋ 七条例句）＋**Murphy 中级 U24 `will be doing and will have done`** | **中**：`future-perfect-tense` 专文（`will have + P.P.` 句型＋否定／疑问＋`for` 持续义）；**无 ❌、无小試身手** | **弱**：`will have` GL 0／HC 0；`will` 本身 GL 268（L12 已教）；**`by the time` GL 0**（将来完成最常用的搭档词须造） | **0 新词 ＋ 1 新串（＋须造 `by the time`）** | **C** | **判 C 但理由须改写**（见 §7 口径校正 6）：**不是「跨源无位」，而是「课程位在但场景不在」**——将来完成要求「到那时已经做完」的完成视点，**「小美的一天」的单日线叙事天然用不上**；**且 Murphy U24 属中级册（跨级）**，与 U46 同一性质。**真要做，须并 `by the time` 一起做（+1 造词），且需新的时间视点场景**。 |
| **10** | **C 档 `have sth done`（复核）** | **课程位零**（BC 68 课）；**Murphy 中级 U46 `have something done`**（跨级）；**Cambridge `have-something-done` 专页本批重取，口径零变化**（含 Warning「not the same as perfect tenses」：`I had my hair cut.` 对 `I've cut my hair.`） | **中**：`causative-verbs` 节含 `I had my hair cut.`（批十六已记） | **零底座**：`will have` 0／`cut` 0／`fixed` 0／`haircut` 0／`repaired` 0／`checked` 0／`had my` 0；**`have my` GL 1（L23 `Don't worry. I have my key here.`，普通 have 义）**——**数析 §1.5 新判：它不只不是垫子，还是「同形干扰源」**（`have my ＋ 东西` 语序与使役相同） | **8 新词 ＋ 1 反向干扰源 → 无压缩空间** | **C（维持撤出）** | **口径零变化**：仍判「不单开」。**本批新增一条否决理由（数析提供，本方认可）**：`'ll` 缩写**全库 0 处**（`grep -o "'ll"` ＝ 0）——**将来时的缩写形式从未在库里出现过**，而 `I'll have my hair cut.` 是最自然的招牌句，**等于要在同一课里连开两个新区**。 |

**三问制小结（一句话）**：**本批四候选的档位是「B（`as soon as`）／B−（三连体）／B−（`would rather`）／C＋（`seem`·`appear` 由 D 升）」**——**没有 A 档**（**没有任何一项有 BC 课程位或 Murphy 的独立专课；唯一有 BC 课程位的是 `will have`，而它判 C**）。**这是 B 档结清后的第一批的结构性特征：候选池整体下移到 B／B−／C，且全部落在「跨源有规则页、无课程位」这一层。**

---

## §4 大章节组合建议

### 4.1 首选方案：**小章 3 课「雨一停我就出去」（L139–L141）——`as soon as` 单拱**

**先明写本批的选址逻辑**：批十七–批二十一连续五批都在**开新区**（`be used to`／`look＋形容词`／五种感官／`look forward to`），**B 档结清后「新区」已经没有了**（本批 §3 十项里九项零课程位）。**所以本批的正确形态不是「再开一块空地」，而是「把已经铺好的地板补上一格」**——**`as soon as` 正是那一格：时间家族已有五格（`when`／`after`／`before`／`until`／`while`），且这五格每一格都有专属课与专属案**（数析 §1.3 实读）。

**为什么是 3 课（三条理由，逐条）**：
1. **内容自然容量 ≥3 格，且每格是结构性增量而非换词**：① **立岗**（`as soon as` 整体＝「一…就…」；**新词 `soon` 上线**；**主句用将来、从句用现在**）；② **切开**（与 `when` 的语义刻度：`when` 说「当…的时候」，`as soon as` 说「一…就…」——**同一个位置、两句话只差一格**）；③ **收口**（**零新知**：时间家族六格排一行）。
2. **对比 `neither/either/both` 为什么同是 3 课却不首选**：三连体的三格里有**一格是换词**（`either` 与 `neither` 是同一轴的肯定/否定两面，中文侧专文标题就叫「實在太像了」），**而 `as soon as` 的两格（立岗 / 切开）是两种不同的**动作**——**一个建结构，一个建边界**。
3. **对比 `would rather` 为什么它 2 课、本项 3 课**：`would rather` 的第 2 课（换人版）之后**没有第三种可撑的形态**（§3 序 3）；而 `as soon as` 的第 3 课是**本项目已有八次先例的「收口课」形态**（L94／L102／L110／L118／L124／L127／L133／L138，**八课全部是「把本章学过的说法一次说一遍」**）。

| 课号 | 主题 | 增量（一课一增量） | 接口（与已有课的显式连接） | 库内可用词（数析 §1.4 实读） |
|---|---|---|---|---|
| **L139** | **「雨一停我就出去」**（`as soon as` 立岗：**一…就…**；后面跟**小句子**；**主句说将来、从句说现在**） | **新词 `soon` 上线（库外，全批唯一的新词）＋ `as soon as` 整体当「一…就…」用**；**本课只碰一件将来事**——`As soon as the rain stops, I will go out.`（**⚠️ 与 L109 的形式冲突见 §4.2 开头专条**） | **① 直接接 L109 `until`**（`I waited until the rain stopped.`——**同一个「等的那道线」**，L109 的 oneLineRule 逐字「说『一直等到…为止』用 until——前面一直做，后面那道线一到就停」）；**② 接 L92 `when`**（`When it is sunny, I run.`——**同一个「领一整句」的位置**）；**③ 接 L12 `will`**（`I will call you tomorrow.` L12 `examples` 第 2 条，**全库 3 处**；L12 的 oneLineRule 逐字「说明天的事，在动词前面加 will，动词本身一点不变」）；**④ 接 L49 的时序规则逐字**（「if 里说现在，主句说将来」——本课是**同一条规则的第二次应用**）；**⑤ 场景词零造词（逐词实测，`grep -oiw` 口径）**：`rain` GL 103／HC 20（**其中 L109 一课就占 45 处**）／`stop` 8 ＋ `stopped` 44 ＋ `stops` 9 ＝ 61／`go out` GL 35／`call` GL 13／`tomorrow` GL 37／`phone` GL 51／`weekend` GL 61／`summer` GL 107 —— **全在库** |
| **L140** | **「当…的时候」还是「一…就…」**（**切开课**：`when` 对 `as soon as`） | **零新词（切开课，但有一个真增量：语义刻度）**：`When it stops raining, I will go out.`（只是「当雨停的时候」）对 `As soon as it stops raining, I will go out.`（**一停就出去——中间不耽搁**）——**同一个开头、同一个后半句，只差开头那两三个词** | **① 必须显式引用 L92 的 oneLineRule 逐字**（「它跟 after/before 是同一个三人组」→ **今天扩成六人格**）；**② 与 L97 `when + 当时正做着` 区分**（那课切的是「点/段」，本课切的是「紧接/不紧接」）；**③ 与 L109 的 ❌ 同轴复用**（`until` 后面不请 `will`——**`as soon as` 后面同样不请**，同一张禁令） |
| **L141** | **「一…就…：时间家族排一行」（收口）** | **零新知**：**六格排一行**——`when`（L92）／`after`（L90）／`before`（L91）／`until`（L109）／`while`（L98）／**`as soon as`（本批）** | **跨批钩子：L90／L91（批十四）＋ L92／L97／L98（批十五）＋ L109（批十六）＋ 本批**——**本项目第一次把「跨四批的时间家族」排一行**（**批二十一 L138 是「跨一批两站」，本课是「跨四批六格」，比它更长**）；**照抄 L94／L102／L118／L133 的收口形态**（`grammarLabel` ＝「收口 · 零新知（…排一行）」） |

**课量理由三条**：① 上表 3 格**每格一个真实增量**（立岗 / 切开 / 收口，**无空格、无换词**）；② **不取 2 课**：切开课若并入 L139，**会把「语义刻度」压成一句注解**，而那正是本候选唯一的独立价值（数析担心的「与 when 只差一个刻度」正是要靠这一课变成增量）；③ **不取 4 课**：第 4 课的唯一可能来源是 Cambridge 同小节的第三个词 **`once`**（`once they get home`）与 **`by the time`**——**`once` 是 `as soon as` 的同义替换（换词）**，**`by the time` 属 `will have` 的搭档（跨到 §3 序 9 的 C 档）**，两者都不构成第 4 课的真增量。

### 4.2 首选方案的设计细则（三条硬约束，**生产期直接可用**）

> **⚠️ 本轮发现的一条硬冲突（必须先裁，否则会串台）**：首选方案的招牌句 `As soon as the rain stops, I will go out.` 里的 **`the rain stops`（现在式）与 L109 的一号错卡逐字相同**——L109 `contrast` ① 逐字为 `wrong: "I waited until the rain stops."`／`wrongMark: "stops"`／`correct: "I waited until the rain stopped."`，且 L109 `deepDive` 逐字写着「**until the rain stops ❌ / will stop ❌ —— 两边都得用昨天版**」，`guided` 选项里也有 `"until the rain stops"`。
> **冲突性质**：**同一个短语 `the rain stops` 在 L109 是错的、在 L139 是对的**——**差别只在主句时态**（L109 主句是昨天版 `waited` → 从句也必须昨天版；L139 主句是将来 `will go out` → 从句用现在式）。**这正是「同一形式、两种命运」，对零基础用户是极硬的坑。**
> **三条处置（择一，本方建议 ①）**：**① 换场景（推荐）**——L139 不用 `rain`，改用库内同样厚的另一个「一…就…」场景（`The phone rings`／`I get the letter`／`The movie ends`），**把「雨停」留在 L109 专属**，第 2 课切开课再回引 L109 做对照；**② 保留 `rain` 但显式指认**——L139 的 `oneLineRule` 或 `deepDive` 必须逐字引用 L109 的「两边都得用昨天版」并补一句「今天前面说的是将来，所以后面用现在」；**③ 换词性**——用 `It stops raining`（**实测：`stops raining` 全库 0 处，是新组合**）避开逐字相同。
> **本轮判**：**推荐 ①**（换场景）——**理由是零基础用户的「同一短语两种命运」需要至少一课的距离**；**若生产期坚持用 `rain`，则 ② 是强制项，不得静默**。

1. **新词压缩到最小（全批只上 `soon` 一个）**：**「一…就…」的场景一律用库内词**——**实读可用（`grep -oiw` 逐词实测）**：`rain` GL 103／HC 20／`stop` 8＋`stopped` 44＋`stops` 9／`go out` GL 35／`call` GL 13／`arrive` GL 34／`finish` GL 66／`get up`（L120）／`tomorrow` GL 37／`phone` GL 51／`weekend` GL 61／`summer` GL 107／`party` GL 13／`letter` GL 8。**库外不可用（本轮实测）**：`join` 0／`get home` 0／`news` 0／`reach` 0／`club` 0／**`trip` GL 0**（**唯一 1 处是 id 串 `hunt-trip-time`，非英文语料**）。
2. **`soon` 单独占第 1 课的可见部件**：照 L119 `{ text: "I am used to", role: "…" }` 的块状拆法，**建议两块**：`{ text: "As soon as the rain stops", role: "雨一停（一…就…·新词 soon＝马上）" }`／`{ text: "I will go out", role: "我就出去（主句说将来）" }`——**并显式写「`as soon as` 不能拆开，两块是 `as soon as` ＋ 小句子」**（**防学生把 `as soon as` 与 L65 的 `as tall as` 混淆**）。
3. **❌ 卡方向（跨源三源同轴，可直接落地）**：**① 从句请 `will`**（`As soon as the rain will stop, …`❌——**Cambridge `conjunctions-time` ＋ BC 参考层 ＋ 我方 L109 同轴**）；**② 与 `when` 混用**（**不做错卡，做 `bothRight`**：`When it stops raining, I will go out.` 与 `As soon as it stops raining, I will go out.` **两句都对，但不是同一个意思**——**照 L75 的 `bothRight` 形态**）；**③ `as soon as` 后面跟原形**（`As soon as the rain stop, …`❌）。

### 4.3 备选方案 A：**小章 3 课「看起来好像」（L139–L141）——`seem`／`appear` 单拱**

**适合的场景**：若主理人认同**数析 §1.3 的风险判读**（`as soon as` 与 `when` 只差一刻度、入伙前景最差），则改取本方案。

| 课号 | 主题 | 增量 | 接口 |
|---|---|---|---|
| **L139** | **「你看起来好像累了」**（`seem` 立岗） | **新词 `seem` 上线**；**骨架直接复用 L128**（`It ＋ 动词 ＋ 形容词`：`It sounds great.` → `You seem tired.`） | **L125–L133 九课（批十九／二十）**；**中文侧 `seem` 专文七句式**；**Cambridge 词典 `seem` ＝ B1** |
| **L140** | **「看起来好像」vs「似乎是」（切开课：`seem` 对 `appear`）** | **新词 `appear` 上线**；**中文侧明文禁用直接落地**：**`Appear` 后面不能加 `like`**（❌`It appears like you're depressed.` 对 ⭕`It seems like you're depressed.`） | **Cambridge 专门小节 `Appear or seem?`**（appear 用于事实／事件，seem 也可用于个人感受）——**上游给的正是一条切开轴** |
| **L141** | **「感官排一行（加`seem`）」（收口）** | **零新知**：**六格排一行**——`looks`／`sounds`／`smells`／`tastes`／`feels`（L125–L133）＋ `seems`（本批） | **L133 收口课的延长**（L133 `grammarLabel` ＝「收口 · 零新知（五张脸排一行）」→ 本课是**第六张脸**） |

**代价（三条，明写）**：① **课程位仍零**（BC 的落点是 `Stative verbs` 的**表内**，不是专课）；② **`seem` 与 `look` 的语义距离小**——**L139 有与 L125 `It looks nice.` 重复的风险**，须靠「不靠眼睛的判断」（听说／印象）这条轴切开；③ **BC `Stative verbs` 的规则不可教**（"aren't usually used in the present continuous form" 会撞零术语红线里的「时态」，**只能作深挖卡认读**）。

**本方判**：**备选 A 的成本最低（2 新词 0 附带）、cloze 最友好（唯一双通道友好族）**，**但它的「语义轴」比 `as soon as` 细**（`as soon as` 是时间顺序，`seem` 是判断来源）。→ **若主理人把「低风险」排在「语义厚度」之前，选 A；反之选首选。**

### 4.4 备选方案 B：**小章 3 课「两个都要，还是一个都不要」（L139–L141）——`neither/either/both` 三连体**

| 课号 | 主题 | 增量 | 接口 |
|---|---|---|---|
| **L139** | **「两个都喜欢」**（`both` 立岗） | **新词 `both`**；`both` ＋ 复数名词／`both of` ＋ 代词（**中文侧 ❌ 两条落地**：`Both them enjoy hiking.`❌／`Both we prefer pop music.`❌） | **L26 `there is/are`**、**L79 名词单复数**（GL 厚）、**L19／L20 连接词家族** |
| **L140** | **「两个都不」**（`neither`／`either` 立岗） | **新词 `neither`＋`either`**；`Neither of them…`／`Neither … nor …`／`either … or …` | **L25／L34（三单）**——**`neither` 是 `sv_agreement` 的天然承载**（数析 §4 判读：三连体与 `as soon as` 的罪名承载面最宽） |
| **L141** | **「两个都要，但不能说都不要」（收口·切开）** | **零新知 ＋ 一条硬轴**：**`both` 不用否定**（Cambridge 逐字 "We don't normally use both（of）+ not…"，**Not: Both of these shirts aren't dry yet.**）＋**`neither` 不用 `none`**（"We use neither, not none, when we are talking about two people or things"）——**中文侧六条 ❌ 里的三条正是这条轴** | **Cambridge 两页硬轴 ＋ 中文侧三条 ❌** ——**这是本批全部候选里「单个语法点有最多现成 ❌」的一项** |

**代价（两条）**：① **造词成本 4 个（`neither`＋`either`＋`both`＋`nor`）＋ 3 个新串 → 超先例上限**（批二十 3 个已是历史最高，且批二十一是 2 个）；② **连接词家族只有 L19／L20 两课可复现**（数析 §3.1 G5 判定「薄」）。

### 4.5 不推荐的三条（**逐条给理由，不留给下游猜**）

| 不推荐项 | 理由 |
|---|---|
| **C 档 `have sth done`** | **8 新词 ＋ 1 反向干扰源**，且 `'ll` 缩写**全库 0 处**（等于同课开两个新区）；**跨级**（Murphy U46 属中级册）；**口径零变化**（§3 序 10）。**维持批二十一起的「不单开」**。 |
| **A 档「复现型大章」** | **跨源无先例**（四源全部不做「把已教结构重新编成新章」，§5.1）；**我方数据结构无承载字段**（`GrammarLesson` 无 `isRecap`／`newWordCount`，数析 §3.3）；**且「整季零新知」在本项目零先例**（21 季里 14 季有收口课，**但每季只有 1 课**）。→ **本批不做；若要，只做「复现入口显性化」（§5.3）**。 |
| **换轴（语法+读写混合课）** | **跨源无先例**：BC 把六个技能做成互不混合的栏目（§6.1）；**我方语法线与冒险阅读零耦合**（`AdventurePlayPage.tsx`／`adventureService.ts` 的 `grammar` 命中数 ＝ **0／0**）；**且混合课会同时破两条红线**（「一课一增量」与「零术语」——读写课必然引入体裁/篇章类术语）。→ **本批不做；若做，只做「复现通道」（§6.3）**。 |

### 4.6 课量与形态对照表（供主理人一眼比较）

| 方案 | 课量 | 新词成本 | 附带成本 | 罪名承载面 | 收口形态 | 明写风险 |
|---|---|---|---|---|---|---|
| **首选 `as soon as`** | **3** | **1**（`soon`） | `as` 第三义 ＋ 与 `when` 切开 | 宽（数析 §4 判：可带薄档 3 个） | 六格排一行（**先例八次**） | 与 `when` 只差一刻度 → **靠切开课化解** |
| 备选 A `seem`／`appear` | 3 | **2**（`seem`＋`appear`） | **0** | 窄（数析 §4 判：只能带 2 个） | 六格排一行（L133 的延长） | 与 L125 `look` 距离小 |
| 备选 B 三连体 | 3 | **4** ＋3 新串 | 与 L19／L20 家族切开 | 宽 | 切开＋收口 | **超先例上限** |
| `would rather` | 2 | 1（`rather`） | `would` 第三岗 | — | 无（2 课无收口位） | 中文侧零专文 |
| `will have` | — | 0 | `by the time` 须造 | — | — | **C 档**：场景不在 |

---

## §5 「复现型章」专节（**方向 1 的核心问题**）

### 5.1 跨源怎么做复习章（逐源原文）

| 源 | 有没有「复习章／巩固单元」 | 复现是「重新编排旧材料」还是「新材料复现旧结构」 | 原文依据 |
|---|---|---|---|
| **Murphy（初级＋中级）** | **有，但是「书末装置」，不占正课单元号**：**Study guide ＋ Additional exercises ＋ 两套答案** | **重新编排旧材料（索引式）**——Study guide 按「我不确定该学哪几课」把 U 号**重新编排**，**内容还是老单元**；Additional exercises 是**额外练习集**，材料仍来自已教单元 | 两册 TOC 逐字（本轮去空白归一化后实读）：初级 `Additional exercises 252`／`Study guide 271`／`Key to Exercises 283`／`Key to Additional exercises 310`／`Key to Study guide 313`；中级 `Additional exercises 302`／`Study guide 326`／`Key to Exercises 336`／`Key to Additional exercises 368`／`Key to Study guide 372`；两册页脚逐字 **"IF YOU ARE NOT SURE WHICH UNITS TO STUDY, USE THE STUDY GUIDE ON PAGE 271（中册 326）"** |
| **BC** | **没有**——`free-resources/grammar` 只有「按档分的课」＋「参考层」两类 | **不适用（不做复习章）**；练习**内嵌在每课内** | `free-resources/grammar` 本轮直连逐字："organised into two sections, organised by English level"＋"also a grammar reference"；栏目＝`A1-A2 grammar`／`B1-B2 grammar`／`C1 grammar`／`English grammar reference`；"When you do the interactive exercises, you can see how well you've done."；**每课页内结构**（本轮实取 `adjectives-prepositions`）：首屏引子 → 例句 → **Grammar test** → **Grammar explanation**（`With at`／`With about`／`With of`／`With to`／`With for`／`With in` 六节）→ `Language level` |
| **Cambridge Dictionary 语法区** | **没有**——是 topic 库（按主题分页） | **不适用**；但**每页自带 `Typical errors`／`Common mistakes` 专条**（这是「错误侧」的复现，不是「结构侧」的复习章） | 本轮实取多页一致（`neither-neither-nor` 有典型错误小节、`would-rather-would-sooner` 有典型错误、`word-patterns-*` 是 Common mistakes 体系——批二十一已取） |
| **Duolingo** | **有，且是「路径内嵌」形态** | **新材料／老材料混排 ＋ 老节点重玩**（**按间隔重复切，不是内容重编**） | `blog.duolingo.com`（**本轮取到 1 页，另两页 404／403**）逐字：**"Practice is built into your path"**／"We've also built practice sessions into your path to ensure you're regularly revisiting material"／**"The ordering of lessons in the path is grounded in spaced repetition"**／"it's more effective to space out practice for a particular concept than to cram"／**"you'll see a mix of lessons, with some that cover brand-new concepts and some that cover previously introduced concepts you need to review"**／Legendary 在单元末（"you can practice by trying the Legendary challenges at the end of each unit"）／**老节点可重玩**（"you can tap a completed (gold) level in your path to revisit specific content"／"you can tap a completed (gold) story in your path and redo a story"） |
| **中文侧 english.cool** | **没有**——是 855 篇独立主题文 | **不适用**；但**同一主题常有多篇**（如 `until` 与 `until-vs-till`／`look-forward-to` 与 `look-forward-to-2`），**这是「同一主题的第二次展开」，不是复习章** | sitemap 855 条复算（本批） |

**跨源结论（一句话）**：**四源没有一家做「把已教结构重新编成新章」。** 它们的复现只有三种形态——**① 索引式**（Murphy Study guide：内容不变，**变入口**）；**② 内嵌式**（BC 课内 test／Duolingo 路径内 practice：内容不变，**变排程**）；**③ 重玩式**（Duolingo 老节点：内容不变，**变访问**）。→ **共同点：复现的「内容」不变，变的是「入口、排程、访问方式」。**

### 5.2 对我方「一课一增量」红线意味着什么（**三条，逐条**）

1. **「整章复现」＝ 连续 N 课零新知，与本项目红线正面冲突**：我方的收口课形态是**每章 1 课**（八次先例：L78／L94／L102／L110／L118／L124／L127／L133／L138，**`grammarLabel` 逐字含「收口 · 零新知」**），**从无「整章都是零新知」**；且数析 §3.3 实读确认**「复现型章」在 `GrammarLesson` 接口里没有任何字段可承载**（无 `isRecap`／`newWordCount`／`revisitRatio`）。
2. **上游的做法恰恰给了我们不破红线的路子**：**上游变的是「入口、排程、访问」，不是「内容」**——**而我方的四个复现装置（Review／Revisit／Reaudit／Boost）已经在做这三件事**，**只是与路径页的关系没有被显性化**。
3. **红线的真正含义不是「不许复习」，是「不许用复习冒充新课」**：数析 §3.4 的实读给了一条硬数据——**全库 562 条错点里只有 103 条含「回流」（18.3%），「纯复现案」只有 10 案，且「连续两案全回流」从未出现**（#142 与 #147 之间隔了 4 案）。→ **若做「整章复现」，错点侧会立刻暴露为「全回流」——而我方的案件机制天然不好承载**（一案四错，全回流意味着四错全部指向旧课）。

### 5.3 我方该不该做？怎么做才不破「一课一增量」（**本方建议：不新增「复现课」，做「复现入口显性化」**）

**判：不做「复现型大章」。** 三条理由：① 跨源无先例（§5.1）；② 无数据结构承载（§5.2-1）；③ **最重要的是——我方已有四个复现装置，第五个会与它们抢职能**（§5.4）。

**若主理人仍要做，唯一不破红线的形态是「换轴复现」**：**结构不新，但「用它的场合」是新的**——即 §6.3 的「复现通道」：把已教结构放进听写／找错／日记里，**以「场景／载体」为增量，而不是以「结构」为增量**。**这与上游的「变入口、变排程」是同一条路。**

### 5.4 我方四个复现装置的职能分工表（**本批必须明写，防第五个装置抢职能**）

| 装置 | 入口 | 时点 | 材料来源 | 与「新课」的关系 | 与复现型章的重叠风险 |
|---|---|---|---|---|---|
| **关 2 回访（`GrammarRevisitPage`）** | 课末自动排 | **次日** | 本课 cloze／rebuild 提取题 3–5 题 ＋ 回马枪 1 题 | 本课自身的第二次（**批二十一已实测：空位永远落 `am`／`look` 等**） | 低（只覆盖本课） |
| **关 3 旧案重审（`GrammarReauditPage`）** | 课末自动排 | 第三关 | **本课新案 ＋ 30–50% 旧罪名变式** | **跨课**（同罪名、不同案情，**「真凶换了个马甲」**） | **中——它已经在做「旧结构新案情」，这正是「复现型章」想做的事** |
| **语法复习（`GrammarReviewPage`）** | 路径页入口 | **SM-2 到期** | 进入队列的语法句卡（**上限 10 张／5 分钟**），**题型按 `reviewCount` 轮换**（填空／重组），**第 3 次起转自由输出** | 跨课、跨章 | **高——它是「全库级复现」，与「复现型章」职能重叠最直接** |
| **趁热练（`GrammarBoostPage`）** | 课末曝光 | 课后 | **三档题**，`listen` 138/138 可用、`translate` 125/138、`bothright` 97/138（数析 §1.6） | 本课为主，`listen` 素材来自 `contrast` 句对 | **中——它是「课外延展」，不是新课** |

→ **结论**：**「复现型章」想做的事，我方四个装置已经覆盖了三个维度（课内／跨课／全库）。第五个装置（复现课）只会带来「同一批句子被第五次挖」的边际递减**——**而数析 §3.4 已实测回流池很浅：103 次回流里 L10／L11／L19／L25 四课占 62 次（60%）**。

**若要做，唯一有价值的增量是「入口显性化」**（三条，可独立于内容先行）：① **在路径页把「到期复习卡数」显性化**（现在只有 `/grammar/review` 一个入口链接）；② **把「本章的复现地图」做成章末收口课的一屏**（**不新增课，只新增展示**——**这正是 L141／L133 型收口课已经在做的事**：把本章学过的说法排一行）；③ **把「跨批复现」做成里程碑**（m24 起可承载：**照 m23 的形态，`can-do-m24` 用「回头看」的口吻列出跨批复现的句子**）。

---

## §6 「换轴」专节（**方向 3 的核心问题**）

### 6.1 竞品有没有「读写／听力专项」的形态（逐源原文）

| 源 | 有没有读写/听力专项 | 与语法课的关系 | 原文依据 |
|---|---|---|---|
| **BC** | **有，而且是独立栏目体系** | **彻底分开、不做混合课**：菜单一级栏目为 `Listening`／`Reading`／`Writing`／`Speaking`／`Grammar`／`Vocabulary`，**各按 CEFR 分档** | `free-resources` 本轮直连逐字：六个技能栏目名；**分档方式**："大多数技能按 CEFR 单档分（"A1 listening"／"B1 reading"），**Grammar 与 Vocabulary 用合并带（"A1-A2 grammar"／"B1-B2 vocabulary"）**" → **语法与词汇是「带」，技能是「档」——上游把两条轴用不同的分档粒度隔开** |
| **Murphy** | **没有**（纯语法书） | 不适用；**但书末的 Study guide 是「按需索引」**（§5.1） | 两册 TOC |
| **Duolingo** | **有（reading stories／listening exercises），但内嵌在路径里** | **混合在同一个路径内**：`you'll see a mix of lessons…` ＋ 老故事可重玩 | `blog.duolingo.com` 本轮直连逐字（§5.1） |
| **Cambridge Dictionary** | **没有**（词典＋语法区） | 不适用 | 多页复核 |
| **中文侧 english.cool** | **有少量**（`listening` 类／阅读类文章），但**与语法文分列** | 不混合 | sitemap 855 条 |

**跨源结论**：**「读写／听力专项」在上游是独立栏目（BC）或路径内嵌（Duolingo），没有一家做「语法语法+读写」的混合课。** → **我方若做混合课，属于自创形态，须诚实标注，不得写「竞品也这么做」。**

### 6.2 我方现状（**实读，三条**）

1. **我方有听写（app 本行）**：`/spelling`（拼写/听写训练）、词库句段、`SettingsPage` 的「语音与听写」设置（**逐字**："听写和拼写训练都会用这个声音"／"当前设置会用于听写和发音按钮"）；**语法线内部的声音能力是 `SpeakButton`**（课程页多处引用）——**即「听」这一轴在语法线的载体是「句子朗读按钮」，不是听写题**。
2. **我方有冒险阅读**：`adventureReaderService.ts`（`splitAdventureSentences`／`groupAdventureSentences`／`getReadingProgress`）——**但它与语法线零耦合**（`AdventurePlayPage.tsx`／`adventureService.ts` 的 `grammar` 命中数 ＝ **0／0**，本轮逐文件复核）。
3. **我方有日记**：`GrammarDiaryPage.tsx`（526 行）＋ `diaryService.ts`（361 行）＋ `diaryQuestions.ts`（121 行）——**它是唯一「已与语法线耦合」的产出通道**：`diaryService` 逐字 `import { GRAMMAR_ERROR_TAGS } from "./huntService"`，**批改结果按同一套 10 罪名归因**；且日记有 `recast`（更地道的重述）与 `followUp`（一句追问）两个字段。
4. **（数析 §1.6 实读）听力轴的引擎已 100% 就位**：`listen` 题型 **138/138 课可用**（素材来自 `contrast` 的「正确句 vs 典型错句」配对，**全库 660 组句对**）；**但「读」侧零**（全库无阅读理解/朗读类题型，唯一接近的是 `translate` 125/138）。

### 6.3 若做「语法+读写」，跨源有无先例 → **无。本方建议：不做混合课，做「复现通道」**

**判：不做「语法+读写」混合课**（三条理由）：① **跨源无先例**（§6.1）；② **会同时破两条红线**——「一课一增量」（读写课若不复现旧结构，就是新内容；若复现，就没增量）与「零术语」（读写课必然引入体裁／篇章类词，**而零术语表已含「从句」「语序」等**）；③ **我方已有四条产出通道（听写／冒险阅读／日记／侦探找错），第五条的边际价值低**。

**若主理人要做，唯一不破红线的形态是「复现通道」（三条，可执行）**：

1. **结构不新，只换载体**——**每条通道只允许使用已教结构**：**照 L138 的「两站排一行」形态**，把「同一结构在不同通道里的样子」当增量（**例如：同一个 `as soon as` 句子，在听写通道里是听音写句，在日记通道里是「今天有什么事是一…就…的」的追问**）。
2. **载体优先级（按我方基建成本，数析 §1.6 提供数据）**：**① 听力轴＝最低成本**（`listen` 138/138 已就位，**不需要新引擎**）；**② 日记轴＝次低**（已有 AI 批改＋罪名归因＋recast／followUp 三件套，**只需改问题池**——`diaryQuestions.ts` 现为 121 行、**84 条题里 `hint` 字段（脚手架）是现成的**）；**③ 阅读轴＝最高成本**（全库零阅读理解题型，须新引擎，**且在「零术语」下不能用体裁词**）。
3. **明确不做什么**：**不新增「读写课」这种课型**（`GrammarLesson` 的六段式是 `看/跟/忆/练/破` ＋ `pretest`，**没有「读」段位**）；**不把冒险阅读的文本搬进语法课**（零耦合是现状，**而耦合会同时把两个模块的验收基线搅在一起**）；**不改 `GrammarLesson` 接口**（**批二十一的教训：`grammarReviewService` 与 `grammarBoostService` 已因两套引擎不同步而暴露过缺陷**——新增字段会重演）。

> **方向 3 的结论（一句话）**：**听力轴可低成本试水（题型已 100% 就位），但不构成「一批课」；阅读轴不做（零引擎＋破两条红线）。**

---

## §7 口径校正（本批须修正前批结论）

| # | 前批表述 | 本轮实测 | 校正动作 |
|---|---|---|---|
| **1** | （前批未记·**方法级**）Murphy TOC 抽文的检索口径——历批（批十六至批二十一）均未说明「是否去空白」 | **本轮实测：`murphy_ess.txt`／`murphy_int.txt` 的文本被逐字符空格拆散**（例：TOC 逐字为 `8 2   b o t h     ei t he r     nei the r`）。**未去空白时，`grep -oic "both"` 等全部返回 0**（**本批首轮复算即踩此坑，全部候选假 0**）；**去空白归一化后**（`tr -d ' \n\r\t'` ＋ 转小写）才取到真值（初 13,966 字符／中 11,016 字符）。→ **同一坑还导致「`as soon as` 在 Murphy 全 0」这类结论在方法上不可信**（可能只是被拆散） | **新增固定口径**：**引用 Murphy 时一律标「去空白归一化后」**；**前批所有「Murphy 全 0」的结论在本轮同口径下复算：`as soon as`／`seem`／`appear`／`the same as`／`why not` 仍为 0（真 0）；`neither`／`either`／`both`／`rather`／`shall`／`will have` 取到真值（见 §1.3）**——**前批的 0 结论在本批的候选范围内未发现假 0**（**但方法风险须登记**） |
| **2** | 批十七数析：「`neither/either/both` 是三连体，**作为 2–3 课小章可行**」；批十九／批二十一均沿用「2 课可行」 | **本轮跨源取证后发现：三连体的「轴」只有两条（`both`＝两者都／`neither`-`either`＝两者都不与二选一），但本轮取到第三条硬轴＝「否定位置」**（Cambridge `both` 页逐字 "We don't normally use both（of）+ not…" ＋ `neither` 页 "We use neither, not none…"；**中文侧六条 ❌ 里三条属这条轴**） | **改写为**：**「三连体可成 3 课（`both` 立岗／`neither`-`either` 立岗／否定位置切开＋收口），但第 3 课必须是这条否定轴，不能是换词」**；**「2 课可行」不再引用**（它会把第 3 课逼成换词课）。**同时保留批十七的另一条判读（「与 L25／L34 的三单·there be 教学重叠」）——本轮不改，且本轮把它视为可用接口而非风险** |
| **3** | 批二十竞析／批二十一竞析：「Cambridge `linking-verbs` 页的名单含 look／sound／smell／taste／feel」（**隐含：该页是 `seem`／`appear` 的可能落点**） | **本轮直连重取 `linking-verbs`：正文 `seem` ＝ 0**（**只出现在页脚导航列表里**）；`appear` 在正文只作**介词短语后的普通动词**出现（`A face appeared at the window. It was Pauline.`）；**该页不给 `seem`／`appear` 的形容词／不定式格式** | **细化表述**：**「`linking-verbs` 页的名单含 look／sound／smell／taste／feel」成立；但该页不教 `seem`／`appear`——它们的落点在 Cambridge 是「词典条目 ＋ `Appear or seem?` 小节」，不在 `linking-verbs` 页。** 引用时不得把 `seem`／`appear` 归到该页 |
| **4** | （前批未记）**BC 的感官动词覆盖面**——批十九竞析取到参考层 "after a link verb like be, look or feel"，批二十竞析取到 `Stative verbs` 表 | **本轮逐条复核 BC `Stative verbs` 的 senses and perceptions 表，逐字为 `appear, be, feel, hear, look, see, seem, smell, taste`——`sound` 不在表内** | **新增一条可对外事实**：**「BC 的状态动词表收了九词，`sound` 缺席」**——**我方已在 L128 立 `sound` 岗（批二十），即「我方比 BC 多一格」**。**引用口径：只说「BC 该表未列 sound」，不得推为「BC 认为 sound 不是状态动词」**（**该表本身是举例性质**） |
| **5** | 批二十一竞析 §「我方现状」与任务书：**「提议家族已有 `what about`（23 处）」** | **本轮状态机逐字复算（区分注释/字符串）**：**`what about` GL 3（全部在英文内容字段）／HC 0**；**`how about` GL 20（内容字段）＋ 1（中文注释行）／HC 1**；**两串合计 GL 23 ＋ HC 1 ＝ 24**。→ **「23 处」这个数正好等于两串的 GL 合计，容易被误读为「`what about` 一个词就有 23 处」** | **改写为**：**「提议家族我方已有：`what about` GL 3（**全是「你呢」义，非「怎么样」义**）＋ `how about` GL 20／HC 1；**两串合计 24 处，其中英文内容字段 23 处**」**——**且须同时明写「`what about` 的 3 处不是提议义」**（L75 的 `contrast` ④ 逐字已在讲这件事：「`What about` 是「你呢」（第 45 课）；`How about` 才是「怎么样」」） |
| **6** | 批十六竞析／批十九竞析：「`will have` **跨源无课程位**／Murphy 零命中」 | **本轮取到两条正向证据**：**BC B1-B2 第 8 课 `Future continuous and future perfect`（直连实取，明文 `will/won't have + past participle` ＋ `by the time` ＋ 七条例句）**；**Murphy 中级 U24 `will be doing and will have done`**（本批唯一命中，归一化后实读） | **改写为**：**「`will have` **有** 课程位（BC B1-B2 第 8 课／Murphy 中级 U24），判 C 的理由改为『课程位在但场景不在』（将来完成要求「到那时已经做完」的完成视点，与单日线叙事不合）＋『U24 属中级册（跨级）』＋『须并造 `by the time`』」**——**「跨源无课程位」不再引用** |
| **7** | 批二十竞析 §1.2 CAM-12／批十九竞析：「Cambridge `look` 语法页的 `Look as a linking verb` 节」与「`look like` 五条并列」——**本批候选 `the same as` 可能与该节相关** | **本轮复核：`the same as` 在 Cambridge 的落点是词典 `same` 条的 EXACTLY LIKE 义项（A2），不是 `look` 语法页**；**且 BC A1-A2 第 5 课 `Comparative adjectives` 本轮直连：`the same as` ＝ 0／`as … as` ＝ 0** | **新增负清单**：**不得写「BC 的 `Comparative adjectives` 课含 `the same as`」**（本轮实取该页只教比较级 + `than`）；**不得把 `the same as` 归到 `look` 语法页的 `look like` 条**（`look like` 与 `the same as` 是两条线） |
| **8** | 批二十一竞析 §7.2 建议 2：「targetSentence 不进 B 引擎 cloze 池（`grammarBoostService.ts:795-797`）」 | **本轮未重跑引擎**（数析本批独立实跑 252 组种子与 25 句 ambush，**结论与本批竞析无关**）；**本报告只引数析的落点数据**（`seem` 族双通道友好／`as soon as` 三句全落 `will`/`As`/`as`／`neither` 族全落 `likes`/`like`/`is`/`are`／`would rather` 全落 `would`） | **口径不变**；**新增一条本批结论**：**若做首选方案（`as soon as`），考点词 `soon` **永不落空**（ambush 三句全落 `will`/`As`/`as`）→ **考点承载须照批二十一 §7.2 建议 2 的处置：压在 `contrast` 与 `guided.spot` 上**（数析已实测；本报告不重复实测，**引用时标「数析本批实跑」**） |
| **9** | 批二十一路线图 §6.2 序 6：复习卡引擎 C 的干扰项生成器**已修复**（「已闭环（2026-09-20，本批生产期修复）」，含新增守门测试 17 项通过） | **本轮未重跑**（本报告不重复验证该项；**该结论为路线图所记的既成事实**） | **维持**；**本批唯一相关提醒**：**若首选方案的 `soon`（4 字母、规则形容词性成分）进入复习卡的 `contentTokenIndexes`，其干扰项将由已修版的「只有已知规则动词才变形」保护**——**`soon` 不是动词，故不会再产出 `soones` 类退化项**（**依据：路线图 §6.2 序 6 记的修复口径 ②**）。**引用时须标「依据路线图所记的已修版本，本报告未复验」** |

---

## §8 §3–§4 的汇总视图：十候选 × 四档（**供主理人拍板用的一页**）

| 候选 | 档 | 可否成章 | 建议课量 | 新词成本 | **一句话判读** |
|---|---|---|---|---|---|
| **`as soon as`** | **B** | ✅ **首选** | **3** | 1 | **家族已建、只缺一格**；唯一风险（与 `when` 只差一刻度）**由第 2 课切开课化解** |
| **`neither/either/both`** | **B−** | ✅ 备选 B | **3** | **4** | 轴只有两条＋一条否定轴；**成本四候选最高** |
| **`would rather`** | **B−** | ⚠️ 只能 2 课 | **2** | 1 | 词典 B1 硬；**中文侧零专文 ＋ 第 3 课无增量** |
| **`seem`／`appear`** | **C＋**（由 D 升） | ✅ 备选 A | **3** | **2** | **成本最低＋cloze 最友好**；但与 L125 `look` 距离小 |
| **`the same as`** | **C** | ❌ | — | 0–1 | 词典 A2 但是比较结构的附属品；**单人视角场景不友好** |
| **`shall we`** | **D** | ❌ | — | 1 | **上游 `suggestions` 专页不收它**；我方提议场已满 |
| **`why not`** | **C** | ❌（可折入） | — | 0 | 与 L75 `How about` 同功能换说法 |
| **感官 `like` 扩展** | **D** | ❌ | — | 0（＋4–5 新串） | 第 1 课必与 L127 认读种子重复 |
| **`will have`** | **C** | ❌ | — | 0（＋造 `by the time`） | **课程位在，场景不在** |
| **C 档 `have sth done`** | **C** | ❌ | — | **8** | 8 新词 ＋ 1 反向干扰源；**`'ll` 全库 0** |

---

## §9 复核来源清单 ＋ 未核实声明

### 9.1 本轮实读源清单

**上游交付物（4 份，本轮实读）**：`roadmap-grammar-twenty-first-batch-2026-09-20.md`（**§6.2 三方向／§6.2 序 1–6 结账表／§6.3 携带项／§7 决策记录**，逐节实读）·`competitive-analysis-grammar-twenty-first-batch-2026-09-20.md`（批二十一竞析，**§0–§8 ＋ 附录 A／B**，逐节实读，作为转述级基线）·`data-audit-grammar-twenty-second-batch-2026-09-20.md`（**数析本批，§1 逐词盘点／§1.3 时间家族／§1.5 方向 2 词架／§1.6 换轴题型数据／§2 成本表／§3 复现型章可行性／§4–§5**，逐节实读）·`competitve-analysis-grammar-sixteenth-batch-2026-09-19.md`（批十六竞析，**`as soon as` 与 `Conjunctions: time` 的首次记载**）。

**代码／数据（本轮独立复算）**：
- `src/data/grammarLessons.ts`（**26,108 行／138 课**，`id: "lesson-` 计数复算）
- `src/data/huntCases.ts`（**8,181 行／147 案**，`id: "hunt-` 计数复算）
- `src/data/grammarSeasons.ts`（**21 季**，末项 season-21 `{134,138}`）
- `src/pages/GrammarPathPage.tsx`（`:276` **m23 `afterLesson: 138`**；`CAN_DO_MILESTONES` 逐条实读）
- `src/data/grammarZeroTerms.ts`（**29 词**，逐字实读）
- `src/services/grammarReviewService.ts`（**四个复现装置的职能判读**，`GRAMMAR_REVIEW_SESSION_LIMIT = 10`／`FREE_TYPE_MIN_REVIEW_COUNT = 2` 逐字）
- `src/pages/GrammarRevisitPage.tsx`／`GrammarReauditPage.tsx`／`GrammarBoostPage.tsx`（各页头注释逐字实读）
- `src/pages/GrammarDiaryPage.tsx`（526 行）／`src/services/diaryService.ts`（361 行）／`src/data/diaryQuestions.ts`（121 行）
- `src/services/adventureReaderService.ts`／`src/pages/AdventurePlayPage.tsx`／`src/services/adventureService.ts`（**`grammar` 命中 0／0** 复核）
- **本轮新增方法**：`grammarLessons.ts` 的**状态机计数**（六态：`code`／`line_comment`／`block_comment`／`dq`／`sq`／`bt`；注释内字符串不入账），用于 `what about`／`how about` 的精确计数（§7 口径校正 5）

**外部源（**本轮新取 9 页／当场复取 6 页／沿用缓存 0 页**）**：

| 源 | 页面 | 取法 | 结果 |
|---|---|---|---|
| BC | A1-A2 索引 **18 课全目** | **WebFetch 直连** | 逐条抽出（18 条） |
| BC | B1-B2 索引 **36 课全目** | **WebFetch 直连**＋与本机存档 `bc-b1b2-new.html` 比对 | 逐条抽出（36 条，与存档一致） |
| BC | C1 索引 **14 课全目** | **WebFetch 直连**（**批二十一记「存档取到」，本轮直连成功**） | 逐条抽出（14 条） |
| BC | **`b1-b2-grammar/future-continuous-future-perfect`（新取）** | **WebFetch 直连** | `will/won't have + past participle` ＋七条例句＋`by the time`；`as soon as` 0 |
| BC | **`b1-b2-grammar/stative-verbs`（新取）** | **WebFetch 直连** | senses and perceptions 表九词（**`sound` 缺席**）＋ "not usually used in the present continuous form" |
| BC | **`b1-b2-grammar/question-tags`（新取）** | **WebFetch 直连** | **`shall` ＝ 0**（六种反向疑问句） |
| BC | **`english-grammar-reference/verbs-time-clauses-if-clauses`（新取）** | **WebFetch 直连** | "We do not normally use will in time clauses and conditional clauses." ＋ ❌（NOT will finish work） |
| BC | **`free-resources` 菜单（新取）** | **WebFetch 直连** | 六技能栏目＋Grammar/Vocabulary 用合并带 |
| BC | **`free-resources/grammar` 总索引（新取）** | **WebFetch 直连** | 两类结构＋互动练习内嵌 |
| BC | **`a1-a2-grammar/comparative-adjectives`（新取）** | **WebFetch 直连** | `the same as` ＝ 0／`as … as` ＝ 0 |
| Cambridge | **`grammar/british-grammar/conjunctions-time`（新取·本批最关键）** | **WebFetch 直连** | `when, once, as soon as` 同小节 ＋ ❌will ＋ 六条例表 ＋ `before/after` ＋ `until` |
| Cambridge | **`dictionary/english/soon`（新取）** | **WebFetch 直连** | `soon` A2／**`as soon as` B1**／`as soon as possible` A2 |
| Cambridge | **`dictionary/english/seem`（新取）** | **WebFetch 直连** | **B1** ＋ `[ + to infinitive ]`／`[ + (that) ]` |
| Cambridge | **`dictionary/english/appear`（新取）** | **WebFetch 直连** | **SEEM 义 B1** ＋ `[ L or I, not continuous ]` ＋ Grammar 小节 `Appear or seem?` |
| Cambridge | **`dictionary/english/both`（新取）** | **WebFetch 直连** | **A1** |
| Cambridge | **`dictionary/english/neither`（新取）** | **WebFetch 直连** | **B2**（含 `neither ... nor` B2） |
| Cambridge | **`dictionary/english/either`（新取）** | **WebFetch 直连** | **B1（两义）／B2（一义）** |
| Cambridge | **`grammar/british-grammar/both`（新取）** | **WebFetch 直连** | "We don't normally use both（of）+ not…" ＋ Not: Both of these shirts aren't dry yet. |
| Cambridge | **`grammar/british-grammar/neither-neither-nor`（新取）** | **WebFetch 直连** | "Neither allows us to make a negative statement…" ＋ "We use neither, not none…" ＋ 拼写警告 |
| Cambridge | **`grammar/british-grammar/would-rather-would-sooner`（新取）** | **WebFetch 直连** | 两条轴＋两条典型错误＋`would sooner` 同族 |
| Cambridge | **`dictionary/english/rather`（新取）** | **WebFetch 直连** | **headword `would rather` ＝ B1** |
| Cambridge | **`grammar/british-grammar/suggestions`（新取）** | **WebFetch 直连** | 五种提议（How about／What about／Why not／Why don't／Let's）；**`shall we` ＝ 0** |
| Cambridge | **`dictionary/english/why-not`（新取）** | **WebFetch 直连** | **`why not...?` ＝ B1** |
| Cambridge | **`dictionary/english/shall`（新取）** | **WebFetch 直连** | **SUGGEST ＝ A2**／FUTURE ＝ B1 |
| Cambridge | **`grammar/british-grammar/shall`（新取）** | **WebFetch 直连** | "We use shall I and shall we to make offers and suggestions" |
| Cambridge | **`grammar/british-grammar/linking-verbs`（当场复取）** | **WebFetch 直连** | **正文 `seem` ＝ 0**（页脚导航除外） |
| Cambridge | **`dictionary/english/same`（新取）** | **WebFetch 直连** | EXACTLY LIKE 义项 **A2**（`the same as` 例句） |
| Cambridge | **`grammar/british-grammar/as-as`（新取）** | **WebFetch 直连** | `as soon as` 只在 `as … as` 的例子里出现一次 |
| Cambridge | **`grammar/british-grammar/have-something-done`（当场复取·C 档复核）** | **WebFetch 直连** | 三用法＋Warning（not the same as perfect tenses）——**口径零变化** |
| Cambridge | `grammar/british-grammar/will`（复核） | **WebFetch 直连** | **该页无 future perfect 小节**（见 §9.2 未核实④） |
| Murphy | 初级 TOC 全目 ＋ 中级 TOC 全目 ＋ 中级全目块 | 本机原件（`/private/tmp/murphy_ess.txt`／`murphy_int.txt`／`murphy_full.txt`），**本轮新增「去空白归一化后」口径** | 逐词真值见 §1.3 |
| 中文侧 | **`https://english.cool/conjunctions/`（新取）** | **WebFetch 直连** | 時間關係七项并列＋`as soon as` 例句 |
| 中文侧 | **`https://english.cool/both/`（新取）** | **WebFetch 直连** | 六规则＋六 ❌ |
| 中文侧 | **`https://english.cool/either-neither/`（新取）** | **WebFetch 直连** | 首屏自测对＋四规则＋病灶 |
| 中文侧 | **`https://english.cool/seem/`（新取）** | **WebFetch 直连** | 七句式＋`seem`/`appear` 分工＋硬禁用 |
| 中文侧 | `https://english.cool/should-shall/`（新取） | **WebFetch 直连** | `Shall I/we…?` 提議 ＋ 美式对照 |
| 中文侧 | `https://english.cool/future-perfect-tense/`（新取） | **WebFetch 直连** | `will have + P.P.` 句型（无 ❌） |
| 中文侧 | `https://english.cool/after/`（新取） | **WebFetch 直连** | "用現在式代替未來式" ＋ `after eat`❌ |
| 中文侧 | sitemap **869 条** | 本机缓存 `/private/tmp/ec-urls.txt`，**本轮落盘 slugs 清单**（`ec_slugs.txt`，855 条唯一） | 逐词命中数见 §1.4 末行 |
| Duolingo | `blog.duolingo.com/new-duolingo-home-screen-design/`（**本轮唯一取到的一页**） | **WebFetch 直连** | "Practice is built into your path"／"grounded in spaced repetition"／Legendary／老节点可重玩 |
| Duolingo | `blog.duolingo.com/duolingo-stories/`／`blog.duolingo.com/duolingo-path/`／`blog.duolingo.com/how-duolingo-uses-spaced-repetition/` | **WebFetch 直连（三页全 404）** | **不引**（见 §9.2 未核实⑥） |

### 9.2 未核实声明（**8 条**）

1. **我方快照的时点风险（沿用批二十一的口径并保留）**：本轮复算的 138 课／147 案／21 季数字**在同一时点完成**（本轮实读 `grammarLessons.ts` mtime ＝ **2026-09-19 21:54**，1,239,507 bytes，26,108 行），**但该文件在批二十一记录里曾发生中途写入**，**且 `git status` 至今仍显示 ` M`（未提交）**。→ **生产期引用前须重跑一次 `as soon as` 族的 0 值核实**；**本报告不判断该文件该不该提交**。
2. **Murphy 单元内部例句仍未核**：**双册只有 TOC 抽文 ＋ 全目块，没有正文**——**U59（`prefer and would rather`）／U24（`will be doing and will have done`）／U82／U89（`both/either/neither`）／U42（`too/either`）的正文例句、页码、练习量均未核实**；**「`as soon as` 是否出现在任何单元的正文里」本轮无法回答**（**TOC 层是真 0，正文层未核**）。**若生产期需要正文级证据，须人工翻书或另找扫描件。**
3. **中文侧检索仍有两处方法缺口**：① **sitemap slug 层面的检索不能替代内容级检索**——**`as soon as` 的中文侧落点（`conjunctions` 专文的「時間關係」节）的 slug 不含 `soon`**，**本轮是靠 WebFetch 该页内容才发现的**；→ **「中文侧零专文」类表述一律须标「sitemap slug 层面未发现，未做全站内容级检索」**。② **`the same as`／`appear`／`why not` 三项目的「零专文」结论同样以此为限**。
4. **`will have` 的 Cambridge 语法页落点未找到**：本轮复核 `grammar/british-grammar/will` **该页无 future perfect 小节**（页面结构为 Will: form／uses／Will and shall／Conditional sentences 等，**无 `will have + -ed`**）；**`will have` 的 Cambridge 语法落点本轮未取到**（**唯一的 Cambridge 侧证据是词典层**）。→ **「Cambridge 有 `will have` 语法页」不得写**；**本报告的 `will have` 跨源依据只写 BC 课程位 ＋ Murphy U24 ＋ 中文侧专文**。
5. **感官 `like` 扩展的 Cambridge 页本轮未重取**（沿用批二十实取缓存）；**该候选维持 D 档（批二十已判）**，**本批不重新取证属「沿用」，不得标为本轮实取**。
6. **Duolingo 的证据薄弱**：**本轮只取到 1 页**（`new-duolingo-home-screen-design`），**另三页 404**；**且该页是 2022 年的产品改版说明，不是当前形态**。→ **§5.1 的 Duolingo 行只作「复现有这种做法」的存在性证据，不作量化依据**；**引用须标来源层级与年份**。
7. **BC 与 Cambridge 的直连可用性波动**：**`curl` 在本机对本项目网络环境**对 BC 域名返回 `000`（**批十九竞析亦记「C1 直连 403／超时」**）；**本轮全部外部取证走 WebFetch**；**WebFetch 返回的是页面转换后的文本，不是原始 HTML**——**故「某页某词 ＝ 0」的结论是「转换后文本层面」。** **对 BC／Cambridge 的「明文逐字引用」不受影响**（引文均为页面可见文本）。
8. **本报告未复核的两项工程结论（沿用上游）**：① **复习卡引擎 C 的干扰项修复**（路线图 §6.2 序 6 记「已闭环」，**本报告未复验**——见 §7 口径校正 9）；② **数析本批的 cloze 落点实跑数据**（252 组种子／25 句 ambush，**本报告引其结论、未独立重跑**，引用时须标「数析本批实跑」）。

### 9.3 本轮不引的内容（负清单，防下游误用）

- **不引**「`as soon as` ＝ 与 `when` 同义」——**Cambridge `conjunctions-time` 把它们并列在同一个「specific point in time」小节，但例句语义不同**（`when` 例 `When we were in Greece…`／`as soon as` 例 `As soon as we hear any news, we'll call you.`）；**本批的话术是「同一个位置，两句话只差一格」，不是「同义」**。
- **不引** `conjunctions-time` 页末的 **「These conjunctions can also be followed by -ing or -ed forms instead of subject + verb.」**——**该形式（非限定小句）超出零基础容量，且会撞「从句」类术语**（**批十六竞析已把 -ing/-ed 非限定小句列入「不可抄」，本批沿用**）。
- **不引** Cambridge `both` 页的 **`both … and`** 作为 `neither/either/both` 章的第 3 课内容——**它与 L19 `and`／L20 连接词家族重叠，且「both A and B」是并列而非选择**；**若要出现，只能作 L141 收口课的认读句**。
- **不引** `neither` 页的 **倒装短答**（`Neither can I.`／`Neither have I.`／`Me neither.`）——**倒装属批二十已判的 D 档机制强化**（无增量空间），**且 `Neither do I.` 的中文侧首屏自测对可作为「以后」的钩子，不作本批内容**。
- **不引** `would-rather-would-sooner` 页的 **`would sooner`／`would just as soon`** 作教学内容（**同族替换词，属换词**）；**也不引 `She would rather have spent the money on a holiday.`**（**`would rather + have + -ed` 的过去虚拟式，超容量**）。
- **不引** `shall` 的 FUTURE 义与 COMMANDS 义（`This door shall be kept closed at all times.`）——**前者与 L12 `will` 重复，后者是法律文体**。
- **不引** `why not...?` 的「表示同意」义（`'Yes, why not?'`）作主课内容——**它是应答语用，且我方 L75 的 `Good idea!` 已占该位**。
- **不引** `will have` 的 `future perfect continuous`（`I will have learned English for two years tomorrow.`）——**超容量**。
- **不引** Duolingo 的 Legendary／gold-level 机制作为我方的机制借鉴——**本轮只取到一页产品改版博客，样本不足**（§9.2 未核实⑥）。
- **不引** `have my` 那 1 处（L23 `Don't worry. I have my key here.`）作任何「已有垫子」的依据——**数析 §1.5 已判它是「同形干扰源」而非垫子**。

---

## 附录 A：批二十二决策清单（供主理人拍板，6 条）

| # | 决策点 | 本轮竞析建议 | 依据 |
|---|---|---|---|
| **A1** | **本批选题：四候选里取哪一个** | **首选 `as soon as` 单拱 3 课（L139–L141）**；**备选 A `seem`／`appear` 3 课**（若把低风险排第一）；**备选 B 三连体 3 课**（若把罪名承载面排第一） | §3 三问制表（四候选档位 B／B−／B−／C＋）／§4.1–4.4 逐课设计／§4.6 对照表 |
| **A1-b** | **若取首选：`the rain stops` 的形式冲突怎么处置** | **推荐换场景**（L139 不用 `rain`，把「雨停」留给 L109）；**若坚持用 `rain`，则必须逐字引用 L109 的「两边都得用昨天版」并补「今天前面说的是将来」** | **§4.2 开头专条**（L109 `contrast` ①／`summary`／`guided` 逐字实证） |
| **A2** | **课量** | **3 课**（立岗／切开／收口）。**不取 2 课**（切开必须独立成课）；**不取 4 课**（第 4 课只能靠 `once` 换词或跨到 C 档） | §4.1 课量理由三条 |
| **A3** | **形态：是否做「复现型大章」（方向 1）** | **不做。** 改为**「复现入口显性化」**（路径页显性化到期卡数／章末收口课一屏复现地图／m24 里程碑承载跨批复现） | §5.1 跨源无先例／§5.2 无数据结构承载／§5.3 不做／§5.4 四装置职能分工表 |
| **A4** | **形态：是否「换轴」（方向 3）** | **不做混合课。** 若试水，**只做「复现通道」**：**听力轴成本最低**（`listen` 138/138 已就位），**日记轴次低**（改问题池即可），**阅读轴不做**（零引擎） | §6.1 跨源无先例／§6.2 我方现状四条／§6.3 三条约束 |
| **A5** | **C 档 `have sth done` 是否重启** | **维持不单开**（口径零变化）；**本批新增一条否决理由**：`'ll` 缩写**全库 0 处**，等于同课开两个新区 | §3 序 10／§8 表；数析 §1.5／§2.2 |

## 附录 B：本轮关键原文速查（生产可直接引用，逐字）

| 用在哪 | 原文（逐字） | 出处 |
|---|---|---|
| **`as soon as` 的体系归属（本批脊柱·最硬）** | "**When, once, as soon as** – We use **when, once and as soon as** to talk about a specific point in time when something happened or will happen." ＋ `As soon as we hear any news, we'll call you.` ＋ `We always have an ice cream as soon as we get to the beach.` | Cambridge `grammar/british-grammar/conjunctions-time`（**本轮直连实取**） |
| **`as soon as` 的 ❌ 规则** | "I will call you as soon as I get to the office." 对 **"as soon as I will get to the office"**（明标错） | 同上 |
| **时间从句不用 will（BC 侧）** | "**We do not normally use will in time clauses and conditional clauses.**" ＋ "I'll come home when I finish work. **(NOT will finish work)**" | BC `english-grammar-reference/verbs-time-clauses-if-clauses`（**本轮直连实取**） |
| **`as soon as` 的段位** | **`as soon as` B1** "at the same time or a very short time after"（同页 `soon` **A2**） | Cambridge `dictionary/english/soon`（**本轮直连实取**） |
| **中文侧时间家族七项并列** | 「時間關係：**when, while, before, after, since, as soon as, until**」＋ `The baby stopped crying as soon as she saw her mother.` | english.cool `conjunctions`（**本轮直连实取**） |
| **中文侧「从句现在、主句将来」** | 「用**現在式**代替**未來式**」（`after class will end` 错／`after class ends` 对） | english.cool `after`（**本轮直连实取**） |
| **我方时间家族已留的口（首选接口）** | 「说『当…的时候』：when 也领一整句——When it is sunny, I run；**它跟 after/before 是同一个三人组（后面都跟一整句）**。」 | `src/data/grammarLessons.ts` L92 `oneLineRule`（**本轮实读**） |
| **我方同型 ❌（首选可照抄）** | 「I waited until the rain **stops**.」❌ ／「I waited until the rain **will stop**.」❌ → 正确 `I waited until the rain stopped.` | `src/data/grammarLessons.ts` L109 `contrast` ①②（**本轮实读**） |
| **⚠️ 本批发现的形式冲突（生产期必读）** | L109 `summary.points` 逐字：「**until the rain stops ❌ / will stop ❌ —— 两边都得用昨天版**」；L109 `guided[0].options` 亦含 `"until the rain stops"`。→ **`the rain stops` 在 L109 是错项、在 L139（若用 `As soon as the rain stops…`）是对的**——**两者差别只在主句时态**；处置见 §4.2 开头三条 | `src/data/grammarLessons.ts` L109 `summary`／`guided`（**本轮实读**） |
| **我方同型规则（L49）** | 「if 里说现在（If it rains），主句说将来（I will stay）——**if 里不用 will**」 | `src/data/grammarLessons.ts` L49（**本轮实读**） |
| **三连体的否定轴（Cambridge）** | "**We don't normally use both（of）+ not to make a negative statement about two people or things**" ＋ "**Not: Both of these shirts aren't dry yet.**" | Cambridge `grammar/british-grammar/both`（**本轮直连实取**） |
| **三连体的第二硬轴（Cambridge）** | "**We use neither, not none, when we are talking about two people or things**" ＋ "**Take care to spell neither correctly: not 'niether' or 'neighter'.**" | Cambridge `grammar/british-grammar/neither-neither-nor`（**本轮直连实取**） |
| **中文侧 `both` 六条 ❌（可直接转卡）** | `She is learning both the languages.`❌／`Both them enjoy hiking.`❌／`Both we prefer pop music.`❌／`I saw both them.`❌／`Both of them didn't win the prize.`❌／`Both my sister and your brother aren't going to the party.`❌ | english.cool `both`（**本轮直连实取**） |
| **`would rather` 两条轴＋两条错误** | "We use **would rather** or **'d rather** to talk about preferring one thing to another."；同人＝`would rather（not）+ base form`；换人＝过去式（`I'd rather you stayed at home tonight.`）；**"Don't use -ing or to-infinitive（I'd rather walk）"**／**"attach not to the second clause（I'd rather they didn't tell anyone）"** | Cambridge `grammar/british-grammar/would-rather-would-sooner`（**本轮直连实取**） |
| **`would rather` 段位** | headword **`would rather` ＝ B1**（注 `(also 'd rather)`） | Cambridge `dictionary/english/rather`（**本轮直连实取**） |
| **`seem`／`appear` 段位** | `seem` **B1** "to give the effect of being; to be judged to be"（`[ + to infinitive ]`）；`appear` 的 **SEEM 义 B1**（`[ L or I, not continuous ]`）＋ Grammar 小节 **`Appear or seem?`** | Cambridge `dictionary/english/seem`／`appear`（**本轮直连实取**） |
| **`seem`／`appear` 的中文侧硬禁用** | 「**Appear 後面不能加 like/ as if/ as though**」——❌ `It appears like you're depressed.` 对 ⭕ `It seems like you're depressed.` | english.cool `seem`（**本轮直连实取**） |
| **BC 的感官表（含 `sound` 缺席）** | senses and perceptions: "**appear, be, feel, hear, look, see, seem, smell, taste**" ＋ "They aren't usually used in the present continuous form." | BC `b1-b2-grammar/stative-verbs`（**本轮直连实取**） |
| **BC 的 `will have` 课程位** | "will/won't have + past participle" ＋ `The guests are coming at 8 p.m. I'll have finished cooking by then.` ＋ `By the time we arrive, the kids will have gone to bed.` | BC `b1-b2-grammar/future-continuous-future-perfect`（**本轮直连实取**） |
| **`shall we` 不在提议专页** | `suggestions` 页收 `How about`／`What about`／`Why not …? and why don't …?`／`Let's … and let's not …`，**全页无 `shall we`** | Cambridge `grammar/british-grammar/suggestions`（**本轮直连实取**） |
| **`why not` 段位与用法** | `why not...?` **B1** "used to make a suggestion or to express agreement"（`Why not use my car? You'll fit more in.`） | Cambridge `dictionary/english/why-not`（**本轮直连实取**） |
| **Murphy 的复现装置（§5 依据）** | `Additional exercises 252`／`Study guide 271`／`Key to Exercises 283`（初级）；`Additional exercises 302`／`Study guide 326`／`Key to Exercises 336`（中级）＋页脚 **"IF YOU ARE NOT SURE WHICH UNITS TO STUDY, USE THE STUDY GUIDE ON PAGE 271（326）"** | Murphy 初级／中级 4th TOC（本机原件，**去空白归一化后实读**） |
| **Duolingo 的复现形态（§5 依据）** | "**Practice is built into your path**"／"**The ordering of lessons in the path is grounded in spaced repetition**"／"you'll see a **mix of lessons**, with some that cover brand-new concepts and some that cover previously introduced concepts you need to review"／"you can tap a completed (gold) level in your path to revisit specific content" | `blog.duolingo.com/new-duolingo-home-screen-design/`（**本轮直连实取，2022 年改版说明**） |
| **BC 的技能/语法分轴（§6 依据）** | 一级栏目："Listening"／"Reading"／"Writing"／"Speaking"／"Grammar"／"Vocabulary"；**Grammar 与 Vocabulary 用合并带（"A1-A2 grammar"），技能按单档（"A1 listening"）** | BC `free-resources`（**本轮直连实取**） |
| **我方提议场现状（L75 逐字）** | 「两句都对——老位上的 **What about** 是「你呢」（第 45 课）；**How about** 才是「怎么样」——一个词两岗，看后头跟着谁。」 | `src/data/grammarLessons.ts` L75 `contrast` ④（**本轮实读**） |

---

*报告完。本轮共实读外部源 **40 条**（**WebFetch 直连取到 39 条**——BC 10 ＋ Cambridge 20 ＋ 中文侧 8（含 sitemap 复算）＋ Duolingo 1；**本机原件 1 条**——Murphy 双册 TOC＋全目块；**Duolingo 另 3 页 404 已计入未核实⑥**），复核代码 **15 文件**（含 1 个本轮新写的状态机计数器），口径校正 **9 条**，未核实 **8 条**。核心结论：**B 档结清后的第一批，候选池整体下移到 B／B−／C，十项里九项零课程位**；**首选 `as soon as` 单拱 3 课（L139–L141，立岗／切开／收口）——它是「家族已建、只缺一格」，而不是「新开空地」**；**「复现型大章」跨源无先例、我方无数据结构承载、且会与现有四个复现装置抢职能 → 不做**；**「换轴」跨源无混合课先例 → 不做混合课，若要试水只做「复现通道」（听力轴成本最低）**；**C 档 `have sth done` 口径零变化**。*
