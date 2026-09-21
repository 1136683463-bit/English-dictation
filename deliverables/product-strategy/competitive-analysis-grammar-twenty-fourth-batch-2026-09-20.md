# 竞品分析：第二十四批选题（L145 起）· 竞析报告

| 字段 | 值 |
|---|---|
| 报告 | 竞品/跨源分析（竞析）· 语法线「小美的一天」第二十四批 |
| 日期 | **2026-09-20** |
| 轮次 | 第二十四批（批二十三 L142–L144 `as soon as` 交付后） |
| 课号起点 | **L145 起**（现库 **144 课／153 案／season-23 季**，本轮独立复算） |
| 本轮任务 | 7 候选逐项判档 · 造词成本核算 · **「同义换词 vs 新结构」甄别** · 课量建议 · 上游连续课位链核查 · Non-goals 依据 |
| 上游输入 | `competitive-analysis-grammar-twenty-third-batch-2026-09-20.md`（转述级基线）· `roadmap-grammar-twenty-third-batch-2026-09-20.md`（含生产实录 E 节） |
| 我方快照（本轮独立复算） | `src/data/grammarLessons.ts`（**144 课**，末课 `number: 144`）· `src/data/huntCases.ts`（**153 案**）· `src/data/grammarSeasons.ts`（末项 `season-23`） |
| 跨源取到情况 | **Cambridge 语法页 17 页 ＋ 词典 CEFR 10 条** · **BC 三档索引 ＋ sitemap ＋ 参考层 3 页 ＋ 专课 3 页** · **Murphy 双册官方 TOC 本机原件（md5 复核一致）** · **中文侧 english.cool 10 篇实取（2 篇 404）** · **Oxford 词典 CEFR 5 条** |
| 口径 | **Murphy 只核 TOC 标题层，单元内部例句未核**（沿批二十三口径，见 §7） |

---

## §0 本轮结论速览（7 条，先读这里）

1. **【本轮最重要发现】Murphy 中级 U113／U114／U115 确认是连续三单元，且语义连贯。** 本机 TOC 归一化后逐字：**`113althoughthougheventhoughinspiteofdespite` ＋ `114incase` ＋ `115unlessaslongasprovided`**——**首尾相接、中间零间隔**（前接 U112 `even`，后接 U116 `as (…)`），**且位于 `Conjunctions and prepositions` 大类的开篇**。**这是本项目近年批次罕见的「上游连续课位链」，天然支撑 2–3 课。**
2. **`although` 的课程位已被我方消耗一半**：**L139–L141 已教 `although`／`but` 分工**（`grammarLabel` 逐字 `虽然 · although 站最前面`／`两张脸 · although 站前面 / but 站中间`／`收口 · 零新知（两张脸排一行）`）。**但 `even though`／`though`／`in spite of`／`despite` 全库仍零**（实测 `even though` 0／`though` 仅 3 处且**全是引述旧判例**／`in spite of` 0／`despite` 0）。→ **U113 这一格是「半消耗」状态。**
3. **`neither`／`either`／`both` 的 4 词成本判断：不建议按一课 4 词报，建议拆成 `both` 单课（2 词位）＋ `either`/`neither` 合并课（3 词位）。** 四词在库**全为真零**（`neither`／`either`／`both`／`nor` GL 0 且 HC 0），**确实会破历史最高 3 词的上限**。**但四词不同层**：`both` 是 **A1**（Cambridge＋Oxford 一致），`neither` 主义 **B2**（Cambridge），`nor` 是**纯句法构件**。**同课并教等于把 A1 与 B2 塞进一格。**
4. **「同义换词」红线本轮触发两条，`once` 是最明确的一条。** Cambridge 逐字 **"We use once as a conjunction meaning 'as soon as' or 'after'"**——**上游用 `as soon as` 给 `once` 释义**；中文侧逐字 **"once 還可以用來表示「一旦、只要、一…就…」"**——**与我方 L142–L144 `as soon as` 的中文释义「一…就…」逐字相同**。→ **`once` 封顶 ≤1 课，建议不排期。**
5. **BC 侧本轮取到两条此前未记录的硬证据**：① **`B1-B2` 有专课 `contrasting-ideas-although-despite-others`**（页题逐字 **"Contrasting ideas: 'although', 'despite' and others"**，Level **B1 Intermediate／B2 Upper intermediate**）——**`even though`／`in spite of`／`despite` 在 BC 的课程位**；② **`conditionals-zero-first-second` 逐字**："**It is also common to use this structure with unless, as long as, as soon as or in case instead of if.**"——**`unless`／`as long as`／`in case` 在 BC 是同一句列举，不是独立课。**
6. **`seem`／`appear` 定 B（不升 A）**：两词在 Cambridge 词典均 **B1**；BC 参考层 `Link verbs` 标 **elementary** 且两词同列（逐字 "After appear and seem we often use to be:"）；BC `B1-B2` 专课 `stative-verbs` 表内含两词（逐字 `appear, be, feel, hear, look, see, seem, smell, taste`）。**但 Murphy 双册 TOC 两词全 0 —— 无课程位。**
7. **`would rather` 维持 B−，本轮取到一条关键反证**：**Murphy 中级 U59 标题逐字 `preferandwouldrather`**（确认成单元，本批最硬课程位之一）；**但我方 L62 已教 `would like`**（`grammarLabel` 逐字 `客气想要 · would like`），**两词共享 `would + 原形` 同一个句法壳** → **`would rather` 不是从零造词，是「同一个 would 的第二站」，成本比上位批次估的低、课量必须封顶。**

---

## §1 逐候选的档位判定

**判档口径（沿用本项目体系）**：**A** ＝ 跨源有课程位＋我方有缺口；**B** ＝ 有规则页但无课程位，或须造词但成本可控；**B−** ＝ B 偏弱；**C** ＝ 只有零散例句、无规则页、无课程位；**D** ＝ 跨源基本不收。

### 1.1 `seem` / `appear`（看起来好像）——**档位：B**

| 源 | 逐字要点 |
|---|---|
| **Cambridge 语法页 `seem`** | 页题逐字 **"Seem"**（面包屑 `Grammar > Verbs > Using verbs > Seem`）；**无 Warning 框**；17 例含 `She seems very young to be a teacher.`／`It seems that the village shop will have to close down.`／`It seemed as though time was standing still.`／`There seems to be a mistake in these calculations.`；**无独立对比节，只有 See also 指 `Appear` 页** |
| **Cambridge 语法页 `appear`** | 页题逐字 **"Appear"**；**无 Warning 框**；**有专节 `Appear or seem?`**；例句 `There appears to be a problem with the car.`／`His car appears/seems to have broken down.` |
| **Cambridge 语法页 `appear-or-seem`** | **逐字对比句**："**We mostly use appear to talk about facts and events.**"＋**两条明文禁用**：`It appears crazy` 不用（应用 `It seems crazy that we should have to pay twice!`）／`It appeared a good choice` 标错（应用 `It seemed a good choice at the time.`） |
| **Cambridge 词典 CEFR** | `seem` 逐字 **`B1`**（"to give the effect of being; to be judged to be"）；`appear` 的 `SEEM` 义逐字 **`B1`**（语法码 `L or I, not continuous`） |
| **Oxford 词典 CEFR** | `seem` 逐字 **`A2`**，标 **`ox3000`**；`appear` 的 look/seem 义逐字 **`B1`**，标 `[Oxford 3000]` |
| **BC 参考层 `Link verbs`** | **Level 逐字 `elementary`**；两词同在 link verbs 表；**逐字规则**："**After appear and seem we often use to be:**"；例 `She seemed an intelligent woman.`／`She appeared to be an intelligent woman.`／`He seemed to be angry.` |
| **BC `B1-B2` 专课 `stative-verbs`** | Level 逐字 **`B1 Intermediate`／`B2 Upper intermediate`**；感官/感知类表逐字含 **`appear, be, feel, hear, look, see, seem, smell, taste`**；例 `He seems happy at the moment.`；**`appear` 另列于「可静态可动态」表** |
| **Murphy 双册 TOC** | **`seem` 初级 0／中级 0／中级全目 0；`appear` 初级 0／中级 0／中级全目 0**——**双册标题层两词完全缺席** |
| **中文侧 `english.cool/seem/`** | 页题逐字 **「「seem」正確用法是？跟 appear 用法差在哪？ – 英文庫」**（**两词对比即页面主题**）；逐字定位句："**Seem 在文法中被歸類為「連綴動詞」 (linking verbs)，後面可以接「形容詞」、「不定詞」或「名詞子句」。**"；**含三条 ❌**，其一逐字 `It appears like you're depressed.` |

- **② 课程位**：**❌ 无**。Murphy 双册 0；BC A1-A2（18 课）／B1-B2（36 课）／C1（14 课）**三档全目无 `seem`／`appear` 专课**（`stative-verbs` 是**共表课**，与批十八 `look` 同型——须诚实标注）。
- **③ 规则页**：**✅ 有且厚**。Cambridge 两页＋一页专属对比（**含两条 ❌**）；BC 参考层 `Link verbs`（elementary，含规则句）＋ `stative-verbs`（B1-B2）；中文侧**一篇专文且以「跟 appear 差在哪」为标题**。
- **④⑤ 档位 B ＋理由**：**「有规则页、无课程位」是 B 档标准特征**。中文侧以「seem vs appear」为标题，**是「两词该合并处理」的跨源依据**。**不升 A 的理由是 Murphy 双册全 0、BC 三档无专课**。**须标注一处口径分裂**：**Cambridge 标 B1／Oxford 标 A2／BC 参考层标 elementary**——**以 A2/elementary 为主、B1 为辅**（**比我方现教内容略高，未跨级**）。

### 1.2 `would rather`（宁愿）——**档位：B−（维持）**

| 源 | 逐字要点 |
|---|---|
| **Murphy 中级 U59** | **标题逐字（去空白）＝`59preferandwouldrather`**，即原文 **`prefer and would rather`**。**上位批次线索成立**。上下文：前接 U58 `Verb + -ing or to… 3 (like/would like etc.)`，后接 U60 `Preposition (in/for/about etc.) + -ing` |
| **Murphy 初级 TOC** | **`prefer` 0／`rather` 0**——**初级册完全无此结构**（**只在 B1-B2 段**） |
| **Cambridge 语法页 `would-rather`** | 页题逐字 **"Would rather, would sooner"**；**无 Warning 框但有 `typical errors` 节**；例 `I'd rather stay at home than go out tonight.`／`I'd rather you didn't go out tonight`／`I'd rather not fly. I hate planes.`／`She would rather have spent the money on a holiday.`；**typical errors 两条逐字**：① "**We don't use would rather or would sooner with an -ing form or a to-infinitive**"；② "**we attach not to the second clause, not to would rather or would sooner**"（正解例 `I'd rather they didn't tell anyone`）；**不同主语的时态**：现在/将来用 **past simple**，过去用 **past perfect**（`I would rather they did something about it instead of just talking about it.`／`I'd rather you hadn't rung me at work.`） |
| **Cambridge 词典 `would rather`** | phrase 条目，CEFR 逐字 **`B1`** |
| **Cambridge 语法页 `prefer`** | 页题逐字 **"Prefer"**；**该页不教 `would rather`**，只在例句出现 `rather than`（`I'd prefer to go skiing this year rather than go on a beach holiday.`）——**Cambridge 把两词分两页，与 Murphy 合为一单元相反** |
| **BC 三档索引** | **`would rather` 三档 68 课全零**；接近的只有 `wishes-wish-if-only`（B1-B2）与 `unreal-time`（C1），**均不含 `would rather`** |
| **中文侧 `english.cool/prefer/`** | 页题逐字 **「「prefer」的正確用法是？（含例句）」**；**逐字结论：would rather 本身不教**；**三条 ❌**：`We prefer sushi than pizza. (X)`（注 "**prefer 後面不可以接 than**"）／`I prefer to call instead of to text. (X)`（注 "**instead of 後面絕對不能用 to + V**"）；**另警告「不要說 preferring」** |
| **中文侧 sitemap** | **`would-rather` slug 0 命中**；`english.cool/would-rather/` 直连 **HTTP 404**；**`prefer` 命中 1 篇** |

- **② 课程位**：**✅ 有（中级 U59）**——**本批最硬的一条**。**但 U59 是 `prefer and would rather` 两词共用一单元，不是我方「一课一增量」意义下的单点课位。**
- **③ 规则页**：**✅ 有**（Cambridge 专页 ＋ 词典 phrase 条目 B1）。
- **④⑤ 档位 B− ＋理由**：**有课程位却仍不升 A，两条理由都硬**：**① 课程位是两词共用**，而 **`prefer` 我方也全零**（GL 0）——**要做就是 2 词起**；**② 中文侧零专文**（`would-rather` 404，**唯一相关页是 `prefer` 专文且明确不教 `would rather`**）——**中文实证只有半篇**。**但也不降到 C**：Murphy 有独立单元位（**比批二十三 `as soon as` 双册全 0 强**），Cambridge 有专页且有 `typical errors`。→ **B− 准确。**

### 1.3 `neither` / `either` / `both`（三连体）——**档位：`both` 单列 B／`either`＋`neither` 合并 B**

| 源 | 逐字要点 |
|---|---|
| **Murphy 初级 U82** | **标题逐字＝`82botheitherneither`**，即原文 **`both either neither`**。上下文：前接 U81 `all most some any no/none`，后接 U83 `a lot much many` |
| **Murphy 初级 U42** | **标题逐字＝`42too/eithersoamI/neitherdoIetc.`**，即原文 **`too/either so am I / neither do I etc.`**——**「简短应答的倒装」，与 U82 是两回事**（同一册里 `either`／`neither` 出现两次、分属两个知识点）。它在 `Auxiliary verbs` 块（U40–U43），**与 U82 相隔 40 个单元** |
| **Murphy 中级 U89** | **标题逐字＝`89both/bothofneither/neitherofeither/eitherof`**，即原文 **`both/both of neither/neither of either/either of`**。上下文：前接 U88 `all/all of most/most of no/none of etc.`，后接 U90 `all every whole` |
| **Murphy 中级 U82** | ＝ `myself/yourself/themselves etc.`（**编号双册不同指，须按册标注**） |
| **Cambridge 语法页 `neither`** | 页题逐字 **"Neither, neither … nor and not … either"**；**无 Warning 框**；**有 `Neither as a determiner` 节**（含 `neither of`）；**有 `Neither … nor` 节**（说明 `nor` 连接否定并列项，**含主语-动词倒装注记**）；例 `Neither of us went to the concert.`／`Neither Brian nor his wife mentioned anything about moving house.`／`He hadn't done any homework, neither had he brought any of his books to class.`／`We didn't get to see the castle, nor did we see the cathedral.`／`Neither can I.`／`Me neither.` |
| **Cambridge 语法页 `either`** | 页题逐字 **"Either"**；**无 Warning 框**；**定义句逐字 "Either is a determiner, a pronoun, an adverb or a conjunction."**；**四张脸全齐**：determiner／pronoun／adverb（`It was a really nice hotel, and it wasn't very expensive either.`）／conjunction（`Either we go by train or we rent a car. Which do you prefer?`）；**`either … or` 节逐字 "Either … or … connects two choices"** |
| **Cambridge 语法页 `both`** | 页题逐字 **"Both"**；**无 Warning 框但有 `Both: typical errors` 节**，**两条逐字**：① "**We don't use both with a negative verb; we use either instead**"；② "**When we use the verb be as a main verb, both comes after the verb**"（正例 `These films are both famous…`／错例 `These films both are famous…`）；**另有 `Both of or neither of in negative clauses` 节**（**否定句优先 `neither of` 而非 `both of … not`**） |
| **Cambridge 词典 CEFR** | **`both` 逐字 `A1`**；**`neither` 主义逐字 `B2`**（`neither … nor` 义亦 `B2`）；**`either` 逐字 `B1`（adverb 义）／`B1`（determiner/pronoun/conjunction 义）／`B2`（determiner「both」义）** |
| **Oxford 词典 CEFR** | **`both` 逐字 `A1`**（`/a1/`，`ox3000`）；**`neither` 逐字 `A2`**（`oxford3000-5000`）；**`either` 逐字 `A2` ＋ `B2`** |
| **BC 三档索引 ＋ 参考层** | **三词在三档 68 课全零课位**；**参考层 `specific-general-determiners`（Level 逐字 `beginner`）逐字不含三词**（只讲 `the`／possessives／demonstratives／`a/an`／`any`／`another`／`other`）——**BC 的 determiner 页也没收到这三词** |
| **中文侧（4 篇）** | **`both`**：页题逐字「「both」正確用法是？來看例句搞懂！」，**三条 ❌**：`She is learning both the languages. ❌`／`Both them enjoy hiking. ❌`／`Both of them didn't win the prize. ❌`。**`either-neither`**：页题逐字「「either」和「neither」正確用法是？來看例句搞懂！」，**无 ❌**，**给单复数规则**（逐字要点：「either 本身…視為單數」「neither 本身…視為單數」）。**`neither-nor`**：页题逐字「「neither.. nor..」的正確用法是？跟 either or 差在哪？」，**两条 ❌ 标「語意錯誤」（双重否定）**：`They aren't going to neither travel nor go on vacation.`／`She can't neither talk nor walk.`；**逐字邻近原则**："**動詞必須隨 nor 之後的 B 做單複數變化**"＋例 `Neither you nor Kenny can speak French.`／`Neither the teacher nor the students were in the classroom yesterday.`。**`either-or`**：页面逐字规则（动词随 `or` 后的 B）：`Either you or Jason has to finish the report before 6 o'clock.`／`Either Jenny or the girls are going to prepare lunch tonight.` |
| **我方实测** | **`neither`／`either`／`both`／`nor` GL 0 且 HC 0；`either of`／`both of`／`neither of`／`so am I`／`neither do I` 全 0**——**六个构件全库真零** |

- **② 课程位**：**✅ 有，本批最厚**：**初级 U82（三词一单元）／中级 U89（带 `of` 版）／初级 U42（倒装应答）**。**注意 U82 与 U89 是「同一组词的两层」**：初级 U82 无 `of`，中级 U89 专讲 `of`。
- **③ 规则页**：**✅ 三词各有独立页**（Cambridge `neither`／`either`／`both`），**其中 `both` 与 `neither` 页各带错误清单**。
- **④⑤ 档位 B ＋理由**：**课程位是「三词一单元」而不是「一词一单元」**——Murphy 自己就把 `both either neither` 压成 U82 一格。**这既是档位高的理由，也是课量必须压的理由**。三词 CEFR 相差一整档（`both` A1 vs `neither` B2），**不该捆在一课**（见 §2.3）。→ **按词拆成两条报，两条都是 B。**

### 1.4 `though` / `even though` / `unless` / `in case`（让步与条件的连续链）——**档位：A（本批唯一 A 档）**

| 源 | 逐字要点 |
|---|---|
| **Murphy 中级 U113** | **标题逐字＝`113althoughthougheventhoughinspiteofdespite`**。前接 **U112 `even`**（逐字 `112even`） |
| **Murphy 中级 U114** | **标题逐字＝`114incase`**，即原文 **`in case`** |
| **Murphy 中级 U115** | **标题逐字＝`115unlessaslongasprovided`**，即原文 **`unless as long as provided`**。后接 **U116 `as (as I walked… / as I was… etc.)`** |
| **三单元连续性** | 归一化后直接相读：**`…111stillanymoreyetalready112even` ＋ `113although…` ＋ `114incase` ＋ `115unless…` ＋ `116as(…)`**——**中间零间隔、零其他单元插入**；**且整块位于 `Conjunctions and prepositions` 大类下**（块头逐字 `Conjunctionsandprepositions` 出现在 U113 之前，**前一块是 `Adjectives and adverbs` 的 U98–U112**）→ **U113 是整块开篇单元** |
| **Murphy 初级 TOC** | **`though` 0／`unless` 0／`incase` 0／`although` 0**——**初级册完全无这四词**。初级连词块只到 U97–U102（逐字 `97andbutorsobecause`／`98When…`／`99Ifwego…`／`100IfIhad…`／`101apersonwho…`／`102thepeoplewemet…`） |
| **Cambridge 语法页 `although-or-though`** | 页题逐字 **"Although or though ?"**（归在 `Easily confused words` 下）；**有 Warning 框，逐字**："**When the though/although clause comes before the main clause, we usually put a comma at the end of the clause.**"；**六节齐备**：`Although and though meaning 'in spite of'`／`with -ing clauses`／`with reduced clauses`／`Although and though meaning 'but'`／`Though meaning 'however'`／`As though`；**逐字点出 `even though` 可引导缩略从句，强调时用 `even` 配 `though`（不用 `although`）**；例 `Everyone enjoyed the trip to the final although we lost the match!`／`Though it was rainy, we put on our jackets and went for a walk.`／`Even though I earn a lot of money every month, I never seem to have any to spare!` |
| **Cambridge 语法页 `unless`** | 页题逐字 **"Unless"**；**有 Warning 框**（逐字 "In speaking, we use unless to introduce an extra thought or piece of information:"＋三句对话式例句）；**定义句逐字 "We use the conjunction unless to mean 'except if'."**；**有专节 `Unless and if … not`**（**两者都表 'except if'**）；例 `Unless I hear from you, I'll see you at two o'clock.`／`They won't come unless you invite them.`／`I'll make dinner unless somebody else wants to.` |
| **Cambridge 语法页 `in-case`** | 页题逐字 **"In case (of)"**；**无 Warning 框**；**关键区分句逐字 "We don't use in case to mean 'if'."**（**并给对照：`in case` 表未知／`if` 表等到知道**）；例 `In case I forget later, here are the keys to the garage.`／`Let's take our swimming costumes in case there's a pool at the hotel.`／`I'll take cash in case we need it on the ferry.` |
| **Cambridge 词典 CEFR** | **`although` 逐字 `B1`**（列两次）；**`though` 逐字 `B1`（"despite the fact that"）与 `B2`（"but"／"despite this"）**；**`unless` 逐字 `B1`**；**`in case` 的 CEFR 未取到**（见 §7 未核实③） |
| **BC `B1-B2` 专课 `contrasting-ideas-although-despite-others`** | 页题逐字 **"Contrasting ideas: 'although', 'despite' and others"**；Level 逐字 **`B1 Intermediate`／`B2 Upper intermediate`**；**section headings 逐字**：`Grammar explanation`／`in spite of / despite`／`although / even though`／`though`／`Language level`；**规则四条逐字**："**After in spite of and despite, we use a noun, gerund (-ing form of a verb) or a pronoun.**"／"**After although and even though, we use a subject and a verb.**"／"**Even though is slightly stronger and more emphatic than although.**"／"**Though can be used in the same way as although.**"＋"**Though can also go at the end of the second phrase.**"；**19 例**含句尾 `though` 实例 `It's illegal to use mobile phones while driving. People still do it, though.` |
| **BC `C1` 专课 `contrasting-ideas`** | Level 逐字 **`C1 Advanced`**；九个连词逐字："**Although, despite, even if, even though, in spite of, much as, though, whereas and while are all used to link two contrasting ideas…**"——**BC 把同族内容在 B1-B2 与 C1 各开一课，C1 扩到 `even if`／`much as`／`whereas`／`while`** |
| **BC `B1-B2` 专课 `conditionals-zero-first-second`** | Level 逐字 **`B1 Intermediate`／`B2 Upper intermediate`**；**关键句逐字**："**It is also common to use this structure with unless, as long as, as soon as or in case instead of if.**"；唯一例句 `I don't want to stay in London unless I get a well-paid job.` |
| **中文侧 `unless`** | 页题逐字 **「「Unless」正確用法是？ 可以用在疑問句嗎？來看例句一次搞懂！」**；**逐字释义**："**Unless 的中文意思就是「除非…否則…」或「如果不…就…」**"；**逐字**："**Unless 其實可以看成 'If not'**"＋**例外：不能用于疑问句**；**两条 ❌**，其一**直接打在 ❌will 规则上**：**`Unless the weather will get better, the soccer game will be cancelled. ❌`**（另一条 `What will you do unless you get the loan? ❌`） |
| **中文侧 `even-though`** | 页题逐字 **「Even though 跟 Even if 的用法差在哪？來搞懂！」**；**逐字释义**："**even though 的意思是「雖然」，表達一種「事實」，特別是已經發生的事、某個總是會發生的事實**"；**逐字点出中文负迁移**：「**雖然…，但是…」不對應**；**两条 ❌**：`I wouldn't date Sam even he were handsome and muscular.`／`Even I've polished and cleaned the vase, it still looks old.`；**对比 `even if`（事实 vs 假设）／`though`／`although`（强度差）** |
| **中文侧 `although`** | 页题逐字 **「「although」正確用法是？跟 though 一樣嗎？」**；**逐字 ❌**：**`Although Randy has a lot of friends, but he still feels very lonely. ❌`**＋逐字解释「**although 跟 but 不能连用，留一个就够**」；**although vs though**：句首句中都行，**但只有 `though` 能放句尾当副词，且 although 更正式** |
| **中文侧 `in-case`** | ❌ **HTTP 404**（见 §7 未核实④） |
| **中文侧 `conjunctions`**（本机全文已有） | 从属连词总表逐字：「**時間關係：when, while, before, after, since, as soon as, until**」「**因果關係：because, since, as**」「**轉折關係：although, though, even though**」「**條件關係：if, unless, as long as**」——**总表里没有 `in case`**（**它在中文侧连一个小节都没进**） |
| **我方实测** | **`even though`／`unless`／`in case`／`in spite of`／`despite`／`even` GL 0 且 HC 0；`case` GL 0／HC 1；`though` GL 3／HC 2（3 处全是引述 L12 旧判例，非教学）**；**`although`／`but` 已教：L139–L141 三课** |

- **② 课程位**：**✅ 有，且是本批唯一的「连续三单元链」**：**Murphy 中级 U113／U114／U115 首尾相接，U113 是 `Conjunctions and prepositions` 大类开篇**。**另有 BC 两课**（`contrasting-ideas-*` B1-B2 与 C1）**与 `conditionals-zero-first-second`（B1-B2）**。
- **③ 规则页**：**✅ 四词各有落点**（Cambridge `although-or-though`／`unless`／`in-case`；**`even though` 无独立页但在 `although-or-though` 内有专节点**）。
- **④⑤ 档位 A ＋理由**：**本轮唯一满足「跨源有课程位 ＋ 我方有缺口」的候选，证据密度是批二十三以来最高**：**① Murphy 连续三单元**（**恰是批二十三「`as soon as` 双册全 0」的完全反面**）；**② BC 两课**（B1-B2 ＋ C1，**BC 自己就分两档两课**）；**③ Cambridge 四页各带 Warning／错误清单**；**④ 中文侧三篇专文**，**其中两篇带中文负迁移实证**（「雖然…但是…」成对使用 ✗、`Unless … will` ✗）。**唯一「半消耗」是 `although` 已被 L139–L141 用掉**——**但这正好让本批切分点更清楚：`although` 是「两张脸」，`even though`／`though` 是「强度与位置」，`unless`／`in case` 是「条件的两张脸」。**

### 1.5 `as well as`（和／也）——**档位：B−**

| 源 | 逐字要点 |
|---|---|
| **Murphy 双册 TOC** | **`aswellas` 初级 0／中级 0／中级全目 0**——**双册标题层完全缺席** |
| **Cambridge 语法页 `as-well-as`** | 页题逐字 **"As well (as)"**；**无 Warning 框**；**关键定义句逐字**："**As well as is a multi-word preposition which means 'in addition to'**"——**Cambridge 明确称它为 `multi-word preposition`（多词介词），不称连词**；例 `She has invited Jill as well as Kate.`／`When they go to Austria, they like walking as well as skiing.`／`I might as well paint the bedroom myself; no one else is going to do it.`／`We may as well go out tonight because there's not much on TV.`；**该页不与 `and` 对比** |
| **Cambridge 语法页 `as-well-as-or-as-well`** | 页题逐字 **"Also, as well or too ?"**；**无 Warning 框但有 `Also, as well and too: typical error` 节，逐字**："**We don't use as well at the beginning of a clause.**"＋**错例 `Not: As well I think everybody else did.`**；**该页不讨论 `as well as` 的主谓一致** |
| **Cambridge 词典 `as well (as)`** | CEFR 逐字 **`A1`**，定义逐字 "in addition (to)" |
| **BC 三档索引 ＋ sitemap** | **`as-well-as` 在三档 68 课与参考层专页目录里均 0**——**无课程位、无规则页** |
| **中文侧 `as-well-as-usage`** | 页题逐字 **「「as well as」用法是？和 as well 差在哪？例句一次搞懂！」**；**逐字释义**："**as well as 的核心意思就是「以及、不僅⋯也」**"＋"**後面接的東西不會改變主詞的單複數，它只是補充說明**"；**❌ 三条**：**`The teacher, as well as the students, are going on the trip. ❌`**（**正解是 `is`**）／`My brother plays the guitar as well the piano.`（判错）／`My coworker is tired, and I'm tired as well as.`（判错）；**与 `and` 对比逐字要点**：`and` 两边平等、主语变复数；**`as well as` 焦点在第一项**；**专节讲主谓一致**（动词随前面的主语） |
| **我方实测** | **`as well as` GL 0／HC 0；`also` GL 0／HC 2；`too` GL 110／HC 13**（**`too` 是高频已教词**） |

- **② 课程位**：**❌ 无**（Murphy 双册 0；BC 三档 0）。
- **③ 规则页**：**⚠️ 半有**——Cambridge 有一页，**但是「搭配词典式」短页，且把它定性为 `multi-word preposition` 而不是连词**；**另一页的典型错误讲的是 `as well`（句首误用），不是 `as well as` 的主谓一致**；**BC 零**。
- **④⑤ 档位 B− ＋理由**：**规则页有但薄且「定性不合」**——**上游当介词，我方若按「连接词」教就与上游定性冲突**；**中文侧有一篇好专文（含主谓一致 ❌ 三条，且明确与 `and` 对比）是它不掉到 C 的唯一支撑**。**课程位为零 ＋ 上游定性为介词，两重原因只能到 B−。**

### 1.6 `once`（一旦）——**档位：C**

| 源 | 逐字要点 |
|---|---|
| **Cambridge 语法页 `once`** | 页题逐字 **"Once"**；**无 Warning 框**；**定义句逐字 "Once is an adverb or conjunction."**；**核心判据句逐字**："**We use once as a conjunction meaning 'as soon as' or 'after'**"——**上游自己用 `as soon as` 给 `once` 释义**；**另有逐字注记**：`once` 从句里**不用 `shall`／`will`**；例 `Once I've picked Megan up, I'll call you.`／`My boss is a nice man once you get to know him.`／`Once I pass all my exams, I'll be fully qualified.` |
| **Cambridge 语法页 `conjunctions-time`**（批二十三已取，沿用） | 九项定义句（`when, after, before, until, since, while, once, as and as soon as`）＋**「We can use when, once, as and as soon as…」小节**——**`once` 与 `as soon as` 同小节并列** |
| **Murphy 双册 TOC** | **`once` 初级 0／中级 0／中级全目 0**——**与 `as soon as` 同命运，双册完全缺席** |
| **BC 三档索引**（批二十三已取） | **`once` 三档 68 课全零** |
| **中文侧 `once`**（批二十三已取，沿用） | **第四节逐字**："**once 還可以用來表示「一旦、只要、一…就…」的意思，用來指「某件事只要一發生，另一件事就會跟著發生」的情況。在這裡，once 當連接詞使用，用來連接兩個完整的句子。**"＋三例 `Once you pass all the tests, you will get a certificate.`／`Once you have made the decision, there is no turning back.`／`I will call you once we have arrived at the hotel.` |
| **我方实测** | **`once` GL 9 处／HC 0**——**9 处全部在 L72「多久一次」**（`I read once a month.` 等），**即频率义已教、连词义零** |

- **② 课程位**：**❌ 无**（Murphy 双册 0；BC 三档 0）。**③ 规则页**：**✅ 有**（Cambridge 独立页；中文侧独立专文）。
- **④⑤ 档位 C ＋理由**：**按档位定义「有规则页」应为 B——本轮判 C，理由是「同义换词」红线优先于档位**。**判据是两源逐字**：**Cambridge「we use once as a conjunction meaning 'as soon as' or 'after'」；中文侧「一旦、只要、一…就…」**——**与我方 `as soon as` 的中文释义「一…就…」逐字相同**，**而 L142–L144 刚教完 `as soon as`**。**它是「已教内容的同义表达」，价值不在新结构而在同一个结构的另一个词**（§3.2）。**若仍要动，上限 1 课，且必须做成「换词不换结构」的对照课。**

### 1.7 `by the time`（到…的时候）——**档位：C（维持不单开）**

| 源 | 逐字要点 |
|---|---|
| **Murphy 中级 U120** | **标题逐字＝`120byanduntilbythetime…`**，即原文 **`by and until by the time…`**——**有单元位，但与 `by`／`until` 同单元** |
| **Murphy 初级 TOC** | **`bythetime` 0**（初级时间介词块＝`104from…tountilsincefor`／`105beforeafterduringwhile`） |
| **Cambridge 语法页 `by`** | 页题逐字 **"By"**；**`by the time` 有专节**；**逐字要点**：`by the time` 意为 `when`，连接「较早完成」与「较晚发生」两事；**例** `By the time you wake up, I'll have finished work!`／`Unfortunately the man had died by the time the ambulance arrived.`；**❌will 规则逐字**："**Not: By the time you will wake up**"——**即从句用现在简单式表将来** |
| **BC 三档索引**（批二十三已取） | **`by the time` 在 68 课标题里零**；**唯一落点在第 8 课 `Future continuous and future perfect` 内**（**表内落点，非课位**） |
| **中文侧 sitemap**（批二十三已取） | **`by-the-time` 零专文**；**唯一出处是 `by` 专文的「某时间前」节**（逐字例 `By the time he came home, his wife had gone to bed.`） |
| **我方实测** | **`by the time` GL 0／HC 0**；**`will have` 上位批次已判「不单开」** |

- **② 课程位**：**⚠️ 半有**——**中级 U120 有它，但与 `by and until` 同单元**（**非独立课位**）。**③ 规则页**：**✅ 有**（Cambridge `By` 页内专节，**含 ❌will 明文**；中文侧仅在 `by` 专文里一节）。
- **④⑤ 档位 C ＋理由**：**它是 `by the time` ＋ `will have` 的复合体**，**单独讲会与 `until`（L109 已教）的分工重叠**。**Murphy 自己就把 `by`／`until`／`by the time` 压进 U120 一格**，**Cambridge 的 `By` 页也把 `by the time` 与 `by` 一般用法同页**——**上游的「一课」给的是三者分工，不是我方要的「by the time 从句」单点**。→ **维持 C，不单开。**

---

## §2 造词成本核算

> **方法声明**：**我无法访问我方词库表**，本节「已存在／不存在」判定**基于本轮对 `grammarLessons.ts` 与 `huntCases.ts` 的字符串实测**（**只测「该词是否在库文本中出现过」，不等于「已作为教学词登记」**）。**词频与「是否已进 `KNOWN_VERBS`」须由另一位同事核**（沿本项目分工）。

### 2.1 应造词清单

| 候选 | 应造词清单 | 实测现状 | 净新造词位 |
|---|---|---|---|
| **`seem`／`appear`** | `seem` 族（`seem`／`seems`／`seemed`）＋ `appear` 族（`appear`／`appears`／`appeared`）＋ `to be`（**GL 4，已在库**） | **两族 GL 0 且 HC 0** | **2 词位**（按词位计 `seem`／`appear`） |
| **`would rather`** | `would rather`（结构词块）＋（**若连 U59 一起做**）`prefer` | **would rather GL 0；prefer GL 0；`would` GL 163（**L62 `would like` 已教**）** | **1 词位（只做）／2 词位（连 `prefer`）** |
| **`both`（单列）** | `both` ＋ `both of` ＋（可选）`both … and` | **both GL 0／HC 0；both of 0** | **2 词位** |
| **`either`＋`neither`（合并）** | `either` ＋ `neither` ＋ `nor` ＋（可选）`either of`／`neither of` | **三词 GL 0 且 HC 0；两 `of` 短语 0** | **3 词位（触顶）** |
| **`though` 链** | `even though` ＋ `though` ＋ `unless` ＋ `in case` ＋（可选）`in spite of`／`despite`／`even` | **even though 0／unless 0／in case 0／in spite of 0／despite 0／even 0；though GL 3（旧判例引述）；case GL 0** | **4 词位（超上限 1）＋2 可选** |
| **`as well as`** | `as well as` ＋（可选）`as well` | **as well as GL 0；`too` GL 110（已在库）** | **1 词位** |
| **`once`** | `once`（连词义）——**本词 GL 9 处已在库，但全是频率义** | **once GL 9（L72）／HC 0** | **0 新词、1 个「旧词新义」** |
| **`by the time`** | `by the time` ＋（若单开）`will have` | **by the time GL 0／HC 0** | **1–2 词位** |

### 2.2 与历史最高值（3 词）的对照

| 候选 | 新造词位 | 与「上限 3」的关系 |
|---|---|---|
| `seem`／`appear` | 2 | ✅ 在上限内 |
| `would rather` | 1（或 2） | ✅ 在上限内 |
| `both` 单列 | 2 | ✅ 在上限内 |
| **`either`＋`neither`** | **3** | ⚠️ **正好触顶**（**这就是「必须拆开」的核心原因**） |
| **`though` 链（四词）** | **4** | ❌ **超上限 1 词**（**必须摊到 3 课，见 §4**） |
| `as well as` | 1 | ✅ 在上限内 |
| `once` | 0 | ✅ **零新词** |

### 2.3 特别评估：`neither`／`either`／`both` 的 4 词成本

**问：一次报 4 词会怎样？答：会创下单课新造词数新高（4 > 3），违反「一课一增量」。但更重要的是——这四个词不该被当成同一层的词。**

| 词 | Cambridge CEFR | Oxford CEFR | 层次判定 |
|---|---|---|---|
| `both` | **`A1`**（"predeterminer, determiner, pronoun"） | **`A1`**（`ox3000`） | **易词**：**中文侧教的是「两个都」（`Both of them enjoy hiking.`），概念极简** |
| `either` | **`B1`**（两义均 B1） | **`A2`**（＋`B2` 第二义） | **中词**：两源分裂在 A2–B1 |
| `neither` | **`B2`**（主义与 `neither … nor` 义均 B2） | **`A2`** | **难词**：**两源差两档** |
| `nor` | **无独立 CEFR 标注**（只作为 `neither … nor` 构件出现） | （未取） | **纯构件**：**本身不表意**，只在 `neither … nor` 与倒装（`nor did we see the cathedral.`）里出现 |

**三条判定：**

1. **`both` 必须单列**：它是 **A1 档**，**与 `neither` 的 B2 差三档**。捆在一课等于**让零基础学生在同课同时吃 A1 与 B2 两个难度**，**违反难度梯度纪律**。**单列成本 2 词位，在上限内。**
2. **`either`＋`neither` 必须合并、且 3 词位触顶**：两词**在中文侧是同一篇专文**（页题逐字「「either」和「neither」正確用法是？」），**在 Cambridge 是两页但对举**（`either` 页讲四张脸、`neither` 页讲 `neither … nor` 与 `not … either`）；**加上构件 `nor` → 3 词位，正好等于上限**。**再往上加就超线。**
3. **倒装应答（Murphy 初级 U42 `too/either so am I / neither do I etc.`）必须另案，不能塞进这一课**：**我方 `so am I` GL 0／`neither do I` GL 0**——**这是第三个零。若塞入，词位会到 4–5，直接破线**。**建议：倒装应答不进本批候选池**（**`too` 虽在库 110 处，但 `so am I` 型倒装是独立句法，须单独立项评估**）。

**结论**：**4 词不宜按一课报。建议报成两课：`both` 单课（2 词位）＋ `either`/`neither` 合并课（3 词位）。总 5 词位摊两课，单课最高 3 词位，不破历史上限。**

---

## §3 「同义换词 vs 新结构」甄别（本批最重要的一节）

> **判定标准**：若候选**只是已教内容的另一种说法**（同义、同句法、只换词），**课量必须封顶甚至不排期**。
> **已教同类内容基线**：`although`／`but`（L139–L141）· `as soon as`／`when`（L142–L143）· `look`（L125–L127）· `would like`（L62）· `until`（L109）· `if`（L49）· `will`（L12）

### 3.1 甄别结果总表

| 候选 | 判定 | 跨源逐字依据 | 课量含义 |
|---|---|---|---|
| **`seem`／`appear`** | **🟡 半新结构**（新句法壳、旧语义场） | **BC `stative-verbs` 把两词与 `look` 列同一表**（逐字 `appear, be, feel, hear, look, see, seem, smell, taste`）——**与 L125–L127 已教的感官族同表**；**但** `to be` 补语（BC 逐字 "**After appear and seem we often use to be:**"）与 `It seems that…` 从句（Cambridge 例 `It seems that the village shop will have to close down.`）**是全新句法**（**L125–L127 的 `look` 只教了 `look + 形容词`**） | **可开，2–3 课** |
| **`would rather`** | **🟡 半新结构**（新结构、共享 `would + 原形` 壳） | 我方 **L62 已教 `would like`**；**Murphy 中级 U59 标题逐字 `prefer and would rather`**——**上游把它与 `prefer` 并列，说明它是「偏好」语义场里的新结构**；**Cambridge `typical errors` 逐字**："**We don't use would rather or would sooner with an -ing form or a to-infinitive**"——**这条 ❌ 是真新知识点（原形不带 to，与 `would like to` 恰好相反）** | **可开，2 课封顶** |
| **`both`** | **🟢 新结构**（数量词，全新句法位） | **Cambridge 逐字**："**Both … and as a linking expression**"／`Both: typical errors` 逐字 "**When we use the verb be as a main verb, both comes after the verb**"（正例 `These films are both famous…`／错例 `These films both are famous…`）——**`both` 的位置规则是我方从未涉及的句法**；**中文侧 ❌ 三条**（`Both them enjoy hiking. ❌`／`Both of them didn't win the prize. ❌`）**是纯新错误类型** | **可开，2 课** |
| **`either`＋`neither`** | **🟢 新结构**（否定一致＋倒装构件，全新） | **Cambridge `neither` 页逐字**："**Neither … nor**"节 ＋ 倒装例 `nor did we see the cathedral.`／`He hadn't done any homework, neither had he brought any of his books to class.`／`Neither can I.`／`Me neither.`——**倒装与否定一致是我方零覆盖的句法层**；**中文侧 `neither-nor` 逐字**："**動詞必須隨 nor 之後的 B 做單複數變化**"——**邻近原则是全新规则** | **可开，2–3 课** |
| **`though`／`even though`** | **🔴 同义换词倾向**（**与 L139–L141 `although` 高度重叠**） | **BC 逐字**："**Even though is slightly stronger and more emphatic than although.**"／"**Though can be used in the same way as although.**"——**上游明说 `though` 就是 `although`、`even though` 只是「稍强」**；**中文侧 `although` 专文标题逐字「跟 though 一樣嗎？」**——**中文侧也把两词当同一件事**；**BUT**：**句尾 `though`**（BC 逐字 "**Though can also go at the end of the second phrase.**"＋例 `People still do it, though.`）**与 `in spite of`／`despite` 接名词／-ing**（BC 逐字 "**After in spite of and despite, we use a noun, gerund…**"）**是新东西** | **1–2 课（必须换切分点）** |
| **`unless`** | **🟢 新结构**（否定条件，全新逻辑） | **Cambridge 逐字**："**We use the conjunction unless to mean 'except if'.**"＋**专节 `Unless and if … not`**；**中文侧逐字**："**Unless 其實可以看成 'If not'**"＋**例外：不能用于疑问句**（`What will you do unless you get the loan? ❌`）——**「except if」与「if not」的等价与不等价是我方零覆盖的逻辑层**；**且中文侧 ❌`Unless the weather will get better, …` 直接复用我方已教的 ❌will 规则** | **可开，2 课** |
| **`in case`** | **🟢 新结构（最纯的一个）** | **Cambridge 逐字**："**We don't use in case to mean 'if'.**"——**「先做准备」与「条件成立才做」的语义对立，我方零覆盖**；**但中文侧零专文（404）＋中文侧总表也不收它** | **1 课封顶** |
| **`as well as`** | **🔴 同义换词倾向**（与 `and`／`too` 重叠） | **Cambridge 逐字**："**As well as is a multi-word preposition which means 'in addition to'**"——**语义即 `and`＋`too`**；**中文侧逐字对比**：`and` 两边平等、主语变复数；**`as well as` 焦点在第一项**；**唯一新知识是主谓一致**（中文侧 ❌ `The teacher, as well as the students, are going on the trip. ❌`） | **≤1 课或不排期** |
| **`once`** | **🔴 纯同义换词（本轮最明确）** | **Cambridge 逐字**："**we use once as a conjunction meaning 'as soon as' or 'after'**"——**上游用 `as soon as` 给 `once` 释义**；**中文侧逐字**："**once 還可以用來表示「一旦、只要、一…就…」**"——**与我方 `as soon as` 的中文释义「一…就…」逐字相同**；**Murphy 双册 `once` 三通道全 0**（**连课程位都没有**） | **封顶 1 课，建议不排期** |
| **`by the time`** | **🔴 同义换词倾向**（与 `when`／`until` 重叠） | **Cambridge `By` 页逐字**：`by the time` **意为 `when`**；**Murphy 中级 U120 标题逐字 `by and until by the time…`**——**与 `until` 同单元，即「分工课」不是「新结构课」** | **不单开（维持 C）** |

### 3.2 `once` 专项判定（本轮最明确的「同义换词」）

| 源 | 逐字 | 判读 |
|---|---|---|
| **Cambridge 语法页 `once`** | "**We use once as a conjunction meaning 'as soon as' or 'after'**" | **上游用 `as soon as` 释义 `once`** |
| **Cambridge `conjunctions-time`**（批二十三已取） | "**We can use when, once, as and as soon as to talk about a specific point in time**" | **`once` 与 `as soon as` 同小节并列** |
| **中文侧 `once`** | "**once 還可以用來表示「一旦、只要、一…就…」的意思**" | **中文释义与 `as soon as` 的「一…就…」逐字相同** |
| **中文侧 `conjunctions`** | "**時間關係：when, while, before, after, since, as soon as, until**" | **总表里 `once` 甚至不在列**（**总表只收 `as soon as`**） |
| **Murphy 双册** | 初级 0／中级 0／中级全目 0 | **零课程位** |

**结论**：**`once` 是「已教内容（`as soon as`）的同义表达」**。**唯一可能的新增量是「`once` 还可表 `after`（先后）」这一层**——**但 `after` L90 已教、`when` L92／L97 已教**。→ **按红线：课量必须封顶。建议不排期；若排，≤1 课且必须是「换词不换结构」的对照收口课。**

### 3.3 `even though`／`though` 专项判定（本批最难的切分点）

**「同义」的一面（逐字）**：BC **"Even though is slightly stronger and more emphatic than although."**／BC **"Though can be used in the same way as although."**／中文侧 `although` 专文标题 **「跟 though 一樣嗎？」**／中文侧 `even-though` 逐字 **"even though 的意思是「雖然」，表達一種「事實」"**——**与 `although` 的「雖然」同义**。

**「新结构」的一面（逐字）**：**句尾 `though`**（BC **"Though can also go at the end of the second phrase."**＋例 `People still do it, though.`）——**这是 `although` 绝对不能做的位置**（**L139–L141 教的是「站前面 vs 站中间」两张脸，句尾是第三张脸**）；**`in spite of`／`despite` 接名词／-ing**（BC **"After in spite of and despite, we use a noun, gerund (-ing form of a verb) or a pronoun."**）——**接续成分完全不同**；**中文负迁移**：中文侧 `even-though` 逐字点出「**雖然…，但是…」不对应**＋❌ `I wouldn't date Sam even he were handsome and muscular.`／❌ `Even I've polished and cleaned the vase, it still looks old.`——**两条都是「even 与 even though 混淆」的中式错型**。

**结论**：**`even though`／`though` 不能按「`although` 的换词版」教**（**那会撞 L139–L141 红线**）；**独立增量必须落在「句尾 though」＋「强度梯度（though < although < even though）」＋「`in spite of`／`despite` 接名词」三处**。**→ 1–2 课，必须换切分点。**

### 3.4 `seem`／`appear` 与 L125–L127 `look` 的边界

**「同义」的一面（逐字）**：**BC `stative-verbs` 把 `look`／`seem`／`appear` 列同一表**（逐字 **`appear, be, feel, hear, look, see, seem, smell, taste`**）——**三词同族**；**中文侧 `linking-verbs`（批十八已取）也把 get/become/look/sound/smell/taste/feel/seem/appear 列为一类**。

**「新结构」的一面（逐字）**：**`to be` 补语**（BC 参考层逐字 **"After appear and seem we often use to be:"**，例 `She seemed an intelligent woman.`／`She appeared to be an intelligent woman.`）——**`look` 不接 `to be`**；**`It seems that…` 从句**（Cambridge 例 `It seems that the village shop will have to close down.`）；**`It seems as if／as though`**（Cambridge 例 `It seems as if he wants everyone to feel sorry for him, but I don't.`／`It seemed as though time was standing still.`）；**`there seems to be`**（Cambridge 例 `There seems to be a mistake in these calculations.`）；**两词分工 ❌**（Cambridge `appear-or-seem` 逐字 **"We mostly use appear to talk about facts and events."**＋**两条明文禁用**：`It appears crazy` 不用／`It appeared a good choice` 标错）。

**结论**：**`seem`／`appear` 是「新句法壳、旧语义场」**——**与 L125–L127 的 `look` 共享「看起来」语义，但句法位置完全不同**（`look + 形容词` vs `seem + to be／that 从句／as if`）。**→ 不触发同义换词红线，可开 2–3 课。但切分点必须打在两词差异上（`appear` 偏事实、`seem` 偏主观），不能只做「look 的换词版」。**

---

## §4 课量建议

| 候选 | 建议课量 | 为什么不能更多（硬约束） |
|---|---|---|
| **`though`／`even though`／`unless`／`in case`（首选）** | **3 课** | **① 上游给的是三单元（U113/U114/U115），不是四课**——**Murphy 把 `although` 家族压成 U113 一格、`in case` 独占 U114、`unless as long as provided` 压成 U115**，**三格对三课一一对应**。**② 词位四已超历史上限 3**，**必须摊到 3 课才不破线**。**③ 「虽然」不能做第四课**——**`although` 已被 L139–L141 用掉，且 L141 的 `grammarLabel` 已逐字写着 `收口 · 零新知（两张脸排一行）`，即我方已做过一次收口**，再做就是纯重复。**④「`in spite of`／`despite` 单开」无上游依据**——**BC 把它们放在同一课**（section headings 逐字含 `in spite of / despite` 与 `although / even though`） |
| **`neither`／`either`（含 `nor`）** | **2–3 课** | **① 上游课程位是「三词一单元」（初级 U82）＋「带 of 版一单元」（中级 U89）——两格，不是我方要的三课**。**② 词位 3 已是上限**，**第三课只能靠「合体／迁移／收口」撑**（沿本项目惯例，收口课 `grammarLabel` 写「收口 · 零新知」）。**③ 倒装应答（初级 U42 `so am I`／`neither do I`）不能算进这三课**——**独立句法、三个零，塞进来破线，必须另案** |
| **`both`（单列）** | **2 课** | **① 上游只是 U82 的三分之一**（**U82 标题 `both either neither` 一词占一格**），**中级 U89 里 `both/both of` 也只占四分之一格**——**上游从未给 `both` 独立课位**。**② 词位只有 2**，**第三课会变成「换个名词再练一遍」**（**中文侧 ❌ 三条里两条是位置与否定问题，一课讲得完**）。**③「`both … and` 单开」属并列连接词话题，与 L139–L141 的 `but` 并列层重叠** |
| **`seem`／`appear`** | **2–3 课** | **① 上游零课程位**（Murphy 双册 0、BC 三档 0）——**没有上游容量可对照，只能力守我方纪律**。**② 词位只有 2**。**③ 砍到 2 课的理由**：两词差异跨源只有一条（Cambridge 逐字 "We mostly use appear to talk about facts and events."），**撑不起第三课**。**若做 3 课，第三课必须是「与 L125–L127 `look` 三词排一行」的收口课**——**那是我方自研增量，不是上游给的** |
| **`would rather`** | **2 课封顶** | **① 上游一个单元（中级 U59）且与 `prefer` 共用**——**只做 `would rather`，上游容量是半格**。**② `would like` 我方 L62 已教，「`would + 原形`」的壳已付过账**——**第一课（新结构）与第二课（与 `would like` 对照）之后，第三课只能是「换人称／换动词」**。**③ 唯一可能撑第三课的是「`would rather you did`（不同主语＋过去式表虚拟）」**（Cambridge 逐字 `I'd rather you didn't go out tonight`），**但那是虚拟语气层，跨源标位更高**（Cambridge 把它与过去完成并列），**建议留给后续批次** |
| **`as well as`** | **≤1 课（建议不排期）** | **① 上游定性为介词**（Cambridge 逐字 "multi-word preposition"）——**我方若按连接词教就与上游冲突**。**② 唯一新知识是主谓一致**（中文侧 ❌ `The teacher, as well as the students, are going on the trip. ❌`）——**但这一课的语义层与 `and`／`too` 完全重叠**。**③ 词位只有 1，第二课无处可写** |
| **`once`** | **0 课（建议不排期）；若排 ≤1 课** | **① 上游逐字用 `as soon as` 释义它**（**「同义换词」最硬证据**）。**② Murphy 双册零课程位**。**③ L142–L144 刚教 `as soon as`**——**紧跟着教「同一个意思的另一个词」会直接撞红线**。**④ 第二课不可能存在**（**只有「一…就…」与「曾经／一次」两组义，后者 L72 已教频率义**） |
| **`by the time`** | **0 课（维持不单开）** | **① Murphy 把 `by`／`until`／`by the time` 压在一个单元（U120）**——**上游容量是一格三词**。**② Cambridge 逐字说它意为 `when`**；**`when` L92／L97 已教、`until` L109 已教**。**③ 与 `will have`（已判不单开）捆绑** |

---

## §5 上游有没有「连续课位链」

### 5.1 【本轮核心发现】Murphy 中级 U113／U114／U115 确认是连续三单元

**证据（本机原件，去空白归一化后逐字，md5 `994fde91a0ca7e2d6a7417ed5c72b1d5`）：**

```
…111stillanymoreyetalready 112even Conjunctionsandprepositions
113althoughthougheventhoughinspiteofdespite
114incase
115unlessaslongasprovided
116as(asIwalked…/asIwas…etc.) 117likeandas 118likeasif 119duringforwhile
120byanduntilbythetime…
```

| # | 事实 | 意义 |
|---|---|---|
| 1 | **U113／U114／U115 首尾相接，中间零间隔** | **确认「连续三单元」——上位批次线索成立** |
| 2 | **U113 是 `Conjunctions and prepositions` 大类的开篇单元**（块头逐字 `Conjunctionsandprepositions` 出现在 U113 前，前一块是 `Adjectives and adverbs` 的 U98–U112） | **三单元不是「散落中年段」，而是「新大类的开篇三连」——上游把它们当一整块教** |
| 3 | **语义分工清晰**：U113＝让步（`although`／`though`／`even though`／`in spite of`／`despite`）· U114＝`in case` 独占 · U115＝否定条件（`unless`／`as long as`／`provided`） | **「让步 → 预防条件 → 否定条件」是一条逻辑连贯的链，天然支撑 2–3 课** |
| 4 | **前接 U112 `even`、后接 U116 `as (…)`** | **链两端也都是连词话题**——**上游在 U111–U120 给了九格连词/介词单元**（`111stillanymoreyetalready` 起，`120byanduntilbythetime` 止） |
| 5 | **初级册对应位置全空**（`though` 0／`unless` 0／`incase` 0／`although` 0） | **整条链只在 B1-B2 段**（初级连词块只到 U102）——**「跨级」是本批第一硬约束** |

**BC 侧的独立佐证（构成第二个「链」）：**

| 课 | 页题逐字 | Level 逐字 | 内容 |
|---|---|---|---|
| `contrasting-ideas-although-despite-others` | **"Contrasting ideas: 'although', 'despite' and others"** | **B1 Intermediate／B2 Upper intermediate** | `although`／`even though`／`in spite of`／`despite`／`though`（**含句尾 `though`**） |
| `contrasting-ideas` | **"Contrasting ideas"** | **C1 Advanced** | **扩到九连词**：`Although, despite, even if, even though, in spite of, much as, though, whereas and while` |
| `conditionals-zero-first-second` | **"Conditionals: zero, first and second"** | **B1 Intermediate／B2 Upper intermediate** | **逐字**："**It is also common to use this structure with unless, as long as, as soon as or in case instead of if.**" |

**→ BC 把同族内容「B1-B2 一课 ＋ C1 一课」分两档教；把 `unless`／`as long as`／`in case` 三词压进条件句课的「替代品」一句里。** 两种上游组织方式不同，**但都指向同一结论：这一族在上游的自然容量是 2–3 格，不是 5–6 格。**

### 5.2 其他候选的「连续单元」核查

| 候选 | 有无连续链 | 逐字依据 |
|---|---|---|
| **`neither`／`either`／`both`** | **⚠️ 「散点三格」不是链** | **初级 U81 `all most some any no/none` → U82 `both either neither` → U83 `a lot much many`**（**U82 是三连体，但前后是别的量化词**）；**中级 U88 `all/all of most/most of no/none of etc.` → U89 `both/both of neither/neither of either/either of` → U90 `all every whole` → U91 `each and every`**（**U88–U91 是「限定词四连」，`both/either/neither` 只占一格**）；**初级 U42 `too/either so am I / neither do I etc.` 在 `Auxiliary verbs` 块（U40–U43），与 U82 相隔 40 个单元** |
| **`would rather`** | **⚠️ 小链（两格）** | **U58 `Verb + -ing or to… 3 (like/would like etc.)` → U59 `prefer and would rather` → U60 `Preposition (in/for/about etc.) + -ing`**——**U58／U59 相邻且都含 `would + 动词` 结构**（**U58 的 `would like` 正是我方 L62 已教**）；**U60 换话题，链只两格** |
| **`seem`／`appear`** | **❌ 无** | **Murphy 双册 TOC 两词全 0**（**连单元都没有，谈不上链**） |
| **`as well as`** | **❌ 无** | **双册 `aswellas` 全 0** |
| **`once`** | **❌ 无** | **双册 `once` 全 0** |
| **`by the time`** | **⚠️ 半有** | **中级 U120 与 `by`／`until` 同单元**（**非独立位，不算链**） |

### 5.3 本批的「链」结论

**唯一确认的连续课位链是 `though`／`in case`／`unless` 这一条（Murphy 中级 U113–U115）**，**且它是本轮唯一的 A 档候选**。**`neither`/`either`/`both` 是「散点三格」而非链**（**初级 U82 ＋ 中级 U89 ＋ 初级 U42，三处相隔很远**）——**这决定了它不能按「连续三课」排，只能按「两课摊薄」排**。

---

## §6 Non-goals 依据（本轮不该做的候选）

| 候选 | 结论 | 跨源理由（逐字） |
|---|---|---|
| **`once`** | **不做（第一优先 Non-goal）** | **① 上游逐字用 `as soon as` 释义它**（"**We use once as a conjunction meaning 'as soon as' or 'after'**"）；**② 中文侧逐字「一旦、只要、一…就…」与 `as soon as` 的中文释义逐字相同**；**③ Murphy 双册零课程位**（三通道全 0）；**④ L142–L144 刚教完 `as soon as`**——**紧邻批次教同义词直接撞「一课一增量」红线**。**若坚持要做，上限 1 课且必须是「换词对照」课，不能再拆** |
| **`by the time`** | **不做（维持上位判定）** | **① Murphy 把 `by`／`until`／`by the time` 压进同一单元（U120 标题逐字 `by and until by the time…`）**——**上游课程位不是「by the time 单点」**；**② Cambridge 逐字说它意为 `when`**（**`when` L92／L97 已教**）；**③ 与 `will have` 捆绑，而 `will have` 上位批次已判不单开** |
| **`as well as`** | **不做（建议）** | **① Cambridge 逐字定性为 `multi-word preposition`**——**与我方可能采用的「连接词」框架冲突**；**② 语义与 `and`（L139–L141 并列层）＋ `too`（GL 110 高频已教）完全重叠**；**③ 唯一新知识是主谓一致一点**（中文侧 ❌ `The teacher, as well as the students, are going on the trip. ❌`）；**④ 上游课程位为零（Murphy 双册 0／BC 三档 0）** |
| **`both` 与 `either`/`neither` 合并成一课** | **不做（必须拆开）** | **① CEFR 差三档**：`both` 逐字 **A1**（Cambridge／Oxford 一致）vs `neither` 逐字 **B2**（Cambridge）——**同课并教会把 A1 与 B2 塞进一格**；**② 词位 4 会破历史最高 3 的上限**；**③ 上游也是分开的**（初级 U82 三词只是「列出」，中级 U89 另开一单元讲 `of` 版） |
| **`so am I`／`neither do I` 倒装应答** | **不做（须单独立项）** | **① 上游在初级 U42 独立成单元**（标题逐字 `too/eithersoamI/neitherdoIetc.`）——**它是独立句法，不属 `neither/either` 的限定词话题**；**② 我方 `so am I` GL 0／`neither do I` GL 0／`nor` GL 0——三个零**，**塞进 `either`/`neither` 课会破词位线**；**③ Murphy 中级 U89（`both of` 版）不含它**——**上游自己就分两处** |
| **`in spite of`／`despite` 单开一课** | **不做（可折进让步课第 2 课）** | **① BC 把它们放同一课**（`contrasting-ideas-although-despite-others`，**section headings 逐字含 `in spite of / despite` 与 `although / even though`**）——**上游一课 ＝ 我方一课，无单开依据**；**② 与 `although` 的差异只有「接什么成分」**（BC 逐字："After in spite of and despite, we use a noun, gerund…" vs "After although and even though, we use a subject and a verb."）——**属「换形」不属「换结构」** |
| **`prefer`** | **不做（除非与 `would rather` 同批报 2 词）** | **① 上游把它与 `would rather` 同单元**（U59 标题逐字 `prefer and would rather`）——**可分可合**；**② 中文侧 `prefer` 专文逐字「would rather 本身不教」**——**中文侧把两词分开**；**③ 若我校要做 `would rather`，`prefer` 是可选的第二个词位（成本 1 词位，在上限内）** |
| **`as if`／`as though`／`as long as`／`provided`** | **不做（本批）** | **① 批二十三路线图 E 节登记：`as if`／`as though`／`as long as`／`unless`／`in case` 全零是当批的 G11 语料锁闭验收门**——**即这几个词是「上一个批次刻意留白的」**；**② `as if`／`as though` 在 Murphy 中级是独立单元（U118 逐字 `likeasif`）**，**本批不做**；**③ `as long as` 与 `unless` 同单元（U115），本批已在 `unless` 课内可选带入；`provided` 是 U115 第三词，跨源无独立规则页** |

---

## §7 未核实项（诚实登记）

| # | 未核实内容 | 为什么没核 | 影响面 |
|---|---|---|---|
| **①** | **Murphy 单元内部例句、页码、练习量** | **本机只有官方 TOC 抽文**（`/private/tmp/murphy_int.txt` 等，md5 已复核与批十八／二十三一致），**非正文** | **不影响判档**（判据是「有无单元位」，TOC 足够）；**但影响「上游一课给多少例句」的容量估算**——**生产期若要仿写例句密度，须另找正文** |
| **②** | **Murphy 中级 U113–U115 各单元页数是否均等** | 同上（无正文） | **若页数不等，「三格 ＝ 三课」的换算需微调**；**连续三单元这一事实不受影响** |
| **③** | **Cambridge 词典 `in case` 的 CEFR 标位** | 两次实取（`/dictionary/english/in-case` 与 `?q=in+case`）**均返回不相关内容**（第一次返回 `referee` 条目，第二次只返回链接） | **影响 `in case` 的难度定位**——**不影响档位**（**A 档判据是课程位：Murphy U114 独占单元 ＋ BC 条件句课逐字点名 ＋ Cambridge 独立语法页**）；**建议生产期再取一次或按 `unless` 的 B1 邻近推定** |
| **④** | **中文侧 `in case` 专文** | **`english.cool/in-case/` 返回 HTTP 404**（本轮实测） | **`in case` 的中文侧实证为零**（**中文侧从属连词总表逐字也不收它**：`條件關係：if, unless, as long as`）——**这是它「课量封顶 1 课」的依据之一，不是信息缺失** |
| **⑤** | **Cambridge 词典 `by the time` 的独立 CEFR** | 未找到独立词条 | **不影响**（`by the time` 本轮判 C／不排期） |
| **⑥** | **BC `B1-B2` 索引的完整 36 课清单** | 本轮 WebFetch 只取到「`Reported speech: statements`」一节（**页面为分页/动态加载**），**改由 `sitemap.xml` 取到完整 URL 清单** | **不影响本批判档**：**BC 课位结论改以 sitemap 为准**；**但「36 课」这个数字本轮未逐条复点**（沿批二十三记录） |
| **⑦** | **`neither`／`either`／`both` 在我方词表（`KNOWN_VERBS` 等）里的登记状态** | **我无法访问词库/词表文件**（**分工声明见 §2 方法声明**） | **§2 的词位估算基于「文本是否出现过」，不等于「已作为教学词登记」——须由词频同事复核** |
| **⑧** | **`would rather`／`prefer` 在中文侧是否另有专文** | **`english.cool/would-rather/` HTTP 404**；sitemap 855 slug 里 **`would-rather` 0 命中、`prefer` 1 命中** | **中文侧 `would rather` 零专文这一结论本轮成立**（**但只核了 english.cool，不排除其他中文站有专文**） |
| **⑨** | **Oxford 词典 `nor`／`in case`／`as well as` 的 CEFR** | 本轮只取 `seem`／`appear`／`both`／`neither`／`either` 五条 | **小**：`nor` 是构件无需标位；**`as well as` 已由 Cambridge 标 A1** |

---

## 附录 A：本轮核实来源清单（全部实取，逐条可追）

### A.1 Cambridge Dictionary（语法页 17 页 ＋ 词典 CEFR 10 条）

**语法页实取（页题逐字）**：`Seem` · `Appear` · `Appear or seem?` · `Would rather, would sooner` · `Would rather, would sooner`（不同主语／过去指涉细节页）· `Prefer` · `Neither, neither … nor and not … either` · `Either` · `Both` · `Although or though ?` · `Unless` · `In case (of)` · `As well (as)` · `Also, as well or too ?` · `Once` · `By` · `Conjunctions` —— **17 页全部直连实取**。

**词典 CEFR 实取（逐字）**：`seem` **B1** · `appear`（SEEM 义）**B1** · `would rather` **B1**（phrase）· `neither` **B2**（主义）· `either` **B1**×2 ＋ **B2**×1 · `both` **A1** · `although` **B1** · `though` **B1**（"despite the fact that"）＋ **B2**（"but"／"despite this"）· `unless` **B1** · `as well (as)` **A1**。
**未取到**：`in-case`（见 §7 未核实③）。

### A.2 British Council LearnEnglish

| # | 页面 | 取到情况 | 要点 |
|---|---|---|---|
| B-1 | `grammar/b1-b2-grammar/contrasting-ideas-although-despite-others` | ✅ 实取 | 页题 "Contrasting ideas: 'although', 'despite' and others"；**B1／B2**；四条规则逐字 |
| B-2 | `grammar/c1-grammar/contrasting-ideas` | ✅ 实取 | 页题 "Contrasting ideas"；**C1**；九连词逐字 |
| B-3 | `grammar/b1-b2-grammar/conditionals-zero-first-second` | ✅ 实取 | 页题 "Conditionals: zero, first and second"；**B1／B2**；"…unless, as long as, as soon as or in case instead of if." |
| B-4 | `grammar/b1-b2-grammar/stative-verbs` | ✅ 实取 | 页题 "Stative verbs"；**B1／B2**；逐字 `appear, be, feel, hear, look, see, seem, smell, taste` |
| B-5 | `grammar/english-grammar-reference/link-verbs` | ✅ 实取 | 页题 "Link verbs"；**elementary**；"After appear and seem we often use to be:" |
| B-6 | `grammar/english-grammar-reference/specific-general-determiners` | ✅ 实取 | 页题 "Specific and general determiners"；**beginner**；**不含 `both`／`either`／`neither`** |
| B-7 | `grammar/english-grammar-reference`（总索引） | ✅ 实取 | 七主题逐字：`Pronouns`／`Determiners and quantifiers`／`Possessives`／`Adjectives`／`Adverbials`／`Nouns`／`Verbs`；**无 conjunctions／linkers 类目** |
| B-8 | `grammar/a1-a2-grammar`（18 课） | ✅ 实取 | 18 课标题复点；**本批候选零课位** |
| B-9 | **`sitemap.xml`** | ✅ 实取 | **完整 URL 清单（本轮新用的一手取法）**；据此确认 `contrasting-ideas-*`／`conditionals-zero-first-second`／`stative-verbs`／`using-as-like`；**`as-well-as`／`once`／`seem`／`would-rather`／`unless`／`in-case`／`both`／`either`／`neither` 均无独立课 URL** |

### A.3 Murphy（本机双册官方 TOC 原件，md5 复核）

| 文件 | md5 | 本轮用法 |
|---|---|---|
| `/private/tmp/murphy_int.txt`（中级 4th） | `994fde91a0ca7e2d6a7417ed5c72b1d5` | 中级 U59／U82／U89／U112–U116／U120 逐字复核 |
| `/private/tmp/murphy_ess.txt`（初级 4th） | `6b839c0a736b13a7af38872cdf0fbaf7` | 初级 U42／U81–U83／U97–U102／U104–U105 逐字复核 |
| `/private/tmp/murphy_full.txt` | — | 中级全目块交叉核对（`prefer` 1 处＝U59；`seem`／`appear`／`aswellas`／`once` 全 0） |
| `*_norm.txt`（归一化件） | — | `tr -d ' \n\r\t'` 后无空白连读（**批二十三方法级校正沿用**） |

**本轮逐字取到的单元标题（去空白归一化原文）**：**中级** `59preferandwouldrather`／`89both/bothofneither/neitherofeither/eitherof`／`113althoughthougheventhoughinspiteofdespite`／`114incase`／`115unlessaslongasprovided`／`116as(…)`／`120byanduntilbythetime…`；**初级** `42too/eithersoamI/neitherdoIetc.`／`82botheitherneither`／`97andbutorsobecause`／`98When…`／`104from…tountilsincefor`／`105beforeafterduringwhile`。

### A.4 中文侧 english.cool（本轮 11 篇实取 ＋ 2 篇 404）

| 篇目 | 取到情况 | 关键逐字 |
|---|---|---|
| `seem` | ✅ | 「「seem」正確用法是？跟 appear 用法差在哪？」；**两词对比是主题**；三条 ❌ |
| `unless` | ✅ | 「「Unless」正確用法是？ 可以用在疑問句嗎？」；**❌`Unless the weather will get better, …`** |
| `even-though` | ✅ | 「Even though 跟 Even if 的用法差在哪？」；**点出「雖然…但是…」不对应**；两条 ❌ |
| `although` | ✅ | 「「although」正確用法是？跟 though 一樣嗎？」；**❌`Although …, but …`** |
| `both` | ✅ | 「「both」正確用法是？」；**三条 ❌**（含 `Both them enjoy hiking. ❌`） |
| `either-neither` | ✅ | 「「either」和「neither」正確用法是？」；单复数规则 |
| `neither-nor` | ✅ | 「「neither.. nor..」的正確用法是？跟 either or 差在哪？」；**两条「語意錯誤」❌**；**邻近原则逐字** |
| `either-or` | ✅ | 「「Either.. or..」正確用法是？」；单复数随 `or` 后 B |
| `as-well-as-usage` | ✅ | 「「as well as」用法是？和 as well 差在哪？」；**❌`The teacher, as well as the students, are …`**；**与 `and` 对比** |
| `prefer` | ✅ | 「「prefer」的正確用法是？」；**明确不教 `would rather`**；三条 ❌ |
| `conjunctions` | ✅（本机全文已有） | 四组从属连词逐字（**`in case` 不在列**） |
| `in-case` | ❌ **404** | 无专文 |
| `would-rather` | ❌ **404** | 无专文 |

### A.5 Oxford Learner's Dictionaries（本轮 5 条）

| 词 | CEFR 逐字 | 标位 |
|---|---|---|
| `seem` | **A2** | `ox3000` |
| `appear` | **B1**（look/seem 义） | `[Oxford 3000]` |
| `both` | **A1** | `ox3000` |
| `neither` | **A2** | `oxford3000-5000` |
| `either` | **A2** ＋ **B2**（两义） | `ox3000` |

---

## 附录 B：本轮实算速查（供路线图直接取用）

### B.1 我方现状（本轮独立复算）

| 项 | 实测值 |
|---|---|
| 课程数／案件数／季数 | **144 课／153 案／23 季**（末课 `number: 144`，末项 `season-23`） |
| 下一课号 | **L145** |
| L139–L141 | `although`／`but` 三课（labels 逐字：`虽然 · although 站最前面`／`两张脸 · although 站前面 / but 站中间`／`收口 · 零新知（两张脸排一行）`） |
| L142–L144 | `as soon as`／`when` 三课（labels 逐字：`一到就做 · as soon as + 小句子`／`差在哪儿 · when 管那段时间／as soon as 管一到就`／`收口 · 零新知（六格排一行）`） |
| L12（判例出处） | `Though it was cold, but we went out.`（**L139／L141 两课都引述了它**） |
| L62 | `would like`（labels 逐字 `客气想要 · would like`）——**`would + 原形` 的壳已付账** |
| L125–L127 | 感官动词（`尝着 · tastes good`／`摸着 · feels cold`／`说不和问`／`收口 · 零新知（五张脸排一行）`） |
| L72 | `once` 频率义（`I read once a month.`，**9 处**） |

### B.2 候选词在库实测（GL＝`grammarLessons.ts`／HC＝`huntCases.ts`）

| 词 | GL | HC | 判定 |
|---|---|---|---|
| `seem`／`seems`／`seemed`／`appear`／`appears`／`appeared` | **0** | **0** | **真零** |
| `would rather`／`prefer`／`prefers` | **0** | **0** | **真零** |
| `neither`／`either`／`both`／`nor` | **0** | **0** | **真零** |
| `both of`／`either of`／`neither of`／`so am I`／`neither do I` | **0** | **0** | **真零** |
| `even though`／`unless`／`in case`／`in spite of`／`despite`／`even` | **0** | **0** | **真零** |
| `as well as`／`as if`／`as though`／`as long as` | **0** | **0** | **真零**（**批二十三 G11 语料锁闭刻意留白**） |
| `by the time`／`at the time` | **0** | **0** | **真零** |
| `case` | **0** | **1** | 近零 |
| `though` | **3** | **2** | **全部是引述 L12 旧判例**（非教学） |
| `once` | **9** | **0** | **9 处全在 L72 频率义**（**连词义零**） |
| `to be` | **4** | **0** | 已在库 |
| `would` | **163** | **11** | **高频已教**（L62 `would like`） |
| `too` | **110** | **13** | **高频已教** |
| `also` | **0** | **2** | 近零 |

### B.3 档位与课量汇总（供路线图直接引用）

| 序 | 候选 | 档位 | 建议课量 | 新造词位 | 上游课程位 |
|---|---|---|---|---|---|
| 1 | **`though`／`even though`／`unless`／`in case`** | **A** | **3 课** | 4（**须摊 3 课**） | **Murphy 中级 U113／U114／U115 连续三单元** ＋ **BC B1-B2 一课 ＋ C1 一课** |
| 2 | **`neither`／`either`（含 `nor`）** | **B** | **2–3 课** | **3（触上限）** | Murphy 初级 U82（三词一格）／中级 U89（`of` 版） |
| 3 | **`both`（单列）** | **B** | **2 课** | 2 | Murphy 初级 U82（三分之一格）／中级 U89（四分之一格） |
| 4 | **`seem`／`appear`** | **B** | **2–3 课** | 2 | ❌ **无**（双册 0；BC 三档 0；参考层 `Link verbs` elementary） |
| 5 | **`would rather`** | **B−** | **2 课封顶** | 1–2 | **Murphy 中级 U59**（**与 `prefer` 共用一单元**） |
| 6 | **`as well as`** | **B−** | **≤1 课／建议不排期** | 1 | ❌ **无** |
| 7 | **`once`** | **C** | **0 课／上限 1 课** | 0（旧词新义） | ❌ **无** |
| 8 | **`by the time`** | **C** | **0 课（不单开）** | 1–2 | ⚠️ 半有（中级 U120，与 `by`／`until` 同单元） |

---

## 附录 C：给生产期的硬约束（本轮新增，逐条可执行）

1. **本批若取「让步与条件链」三课，切分点必须避开 `although`**：**L139–L141 已把 `although` 的两张脸（站前面／站中间）与 `but` 的对照教完**。**第一课必须直接落在 `even though` 的「强度（比 although 更强）」与 `though` 的「句尾位置」上**（BC 逐字："Even though is slightly stronger and more emphatic than although."／"Though can also go at the end of the second phrase."）。**禁止再讲一遍「although 站最前面」。**
2. **`in case` 与 `if` 的对立必须在第一屏就切开**：Cambridge 逐字 "**We don't use in case to mean 'if'.**"——**这是 `in case` 唯一的独立价值**（**中文侧零专文支撑，中文侧不能作例句来源，须自造场景**）。
3. **`unless` 课必须接上 L142–L144 刚落地的 ❌will 规则**：**中文侧逐字给了现成错句 `Unless the weather will get better, the soccer game will be cancelled. ❌`**——**直接复用我方已教的「时间/条件从句不用 will」纪律**（L109／L142–L144 已铺）。**这是本批最省力的一处接口。**
4. **`neither`／`either` 课不得把倒装应答（`so am I`／`neither do I`）塞进来**：**三个零（`so am I` 0／`neither do I` 0／`nor` 0）＋ 上游独立单元（初级 U42）**——**须另案立项**。
5. **`both` 必须与 `either`／`neither` 分开排**：**`both` A1 vs `neither` B2，CEFR 差三档**（**Cambridge 与 Oxford 在 `both` ＝ A1 上一致**）；**合并授课会把 A1 与 B2 塞进一格。**
6. **`seem`／`appear` 若开课，第 2–3 课必须落在「与 `look` 的分工」上，不能只做同义替换**：**BC `stative-verbs` 把三词列同一表**（逐字 `appear, be, feel, hear, look, see, seem, smell, taste`），**而我方 L125–L127 已教 `look`**——**第三课若无「`look` vs `seem` vs `appear`」对照，就会变成纯重复。**
7. **`once` 若坚持要做，只能做成「`as soon as` 的换词对照」一课，且必须明确标注为「同一个结构的另一个词」**：**Cambridge 逐字 "we use once as a conjunction meaning 'as soon as' or 'after'"**——**不能包装成「新结构」**（**否则与红线的冲突会在下一批复盘时暴露**）。

---

## §8 结论一句话（供主理人裁）

**本批唯一 A 档是「让步与条件链」（Murphy 中级 U113／U114／U115 连续三单元 ＋ BC B1-B2 ＋ C1 两课），可开 3 课，是本项目继批二十三「`as soon as` 双册全 0」之后第一次拿到上游的连续课位链；`neither`／`either` 与 `both` 是两个独立的 B 档候选（课程位厚但词位触顶，必须拆成 2–3 课与 2 课，不能按 4 词一课报）；`seem`／`appear` 是 B 档（规则页厚、课程位为零）；`would rather` 维持 B−（有 U59 课程位但与 `prefer` 共用，且我方 `would like` 已付过 `would + 原形` 的壳）；`as well as` 是 B−（上游定性为介词，语义与 `and` 重叠）；`once`（C，上游逐字用 `as soon as` 释义）与 `by the time`（C，与 `until` 同单元）应列入本轮 Non-goals 不做。**

---

> 本报告由产品战略团队 AI 协作生成（竞析），**所有逐字引用均来自本轮实取页面或本机官方 TOC 原件**，未核实项已在 §7 逐条登记。重要决策请由产品负责人审定。
