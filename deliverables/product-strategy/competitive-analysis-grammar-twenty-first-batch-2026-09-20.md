# 竞品分析：第二十一批课程（L134 起）· 竞析报告

| 字段 | 值 |
|---|---|
| 报告 | 竞品分析（竞析）· 语法线「小美的一天」第二十一批 |
| 日期 | **2026-09-20** |
| 轮次 | 第二十一批（批二十 L128–L133 交付后） |
| 课号起点 | **L134 起**（现库 133 课／142 案） |
| 本轮定位 | **`look forward to` 一族，B+ 档大章；主理人已定，不重新论证做不做**；本轮任务是**补足跨源证据、逐条落到原文、补缺口**，并明写设计依据 |
| 上游输入 | `roadmap-grammar-twentieth-batch-2026-09-19.md`（**§1.2 推迟裁决／§6.2 候补清单序 1／§6.2 三条硬前置／附录 §7 未核实**，逐节实读）· `competitive-analysis-grammar-twentieth-batch-2026-09-19.md`（批二十竞析，**§0／§1／§2／§3／§4／§5／§8／附录 B 逐节实读**，作为转述级基线）· `competitive-analysis-grammar-eighteenth-batch-2026-09-19.md`（批十八竞析，`be/get used to` 基线） |
| 我方快照（本轮独立复算） | `src/data/grammarLessons.ts`（**25,140 行／133 课**，`lesson-(\d+)-` 边界法复算）· `src/data/huntCases.ts`（**7,962 行／142 案**）· `src/data/grammarSeasons.ts`（**20 季，末项 season-20 `{128,133}`**）· `src/pages/GrammarPathPage.tsx`（`:270` m22 `afterLesson: 133`）· `src/data/grammarZeroTerms.ts`（**29 词**，含「介词」「形容词」「副词」「宾语」）· `src/services/grammarAmbushService.ts`（`:160-187` `GRAMMAR_WORDS` 词表／`:190-193` `CLOZE_STOP_WORDS`／`:195-212` `pickClozeWord` 三档逻辑） |
| **⚠️ 快照时点说明（本轮须先读）** | **本批开工前 `grammarLessons.ts` 曾发生一次变更**（复算时 mtime ＝ 2026-09-19 20:52，`git status` 显示 ` M`）。**变更后 `forward` 从「两文件全 0」变为「GL 2／HC 0」**——两处均在 **L133（批二十收口课）的认读种子位**内（`examples` 第 4 条 `{ en: "I am looking forward to the weekend.", zh: "我盼着周末。（认读一句，混个脸熟）" }` ＋ `contrast` ⑥ 的 `wrong: "I am looking forward to the weekend."`）。→ **本报告所有「我方现状」数字以变更后为准**；**批二十／批二十一路线图记的「`forward` 两文件全 0」已过期**（见 §8-9）。**这不是批二十一的新增内容，是批二十交付物的一处补写**（L133 的种子位本就规划存在，见批二十路线图 §1.2 配套裁决③）。 |
| 本轮范围 | ① `look forward to` **逐条落到原文＋补缺口**；② `object to` 跨源位置复核；③ **`be used to` 与 `look forward to` 的「同族」教材证据**（本批最关键）；④ `have sth done`／形容词＋介词／机制强化**口径复核** |

---

## §0 本轮结论速览（8 条，先读这里）

1. **`look forward to` 本轮完成「四处原文级取证 ＋ 一处补缺口」，证据链比批二十更完整、且全部为直连 200 当场复取**：① **Cambridge 语法专页 `Look forward to`**（HTTP 200，逐字复核）；② **Cambridge Common mistakes 专条 `Word patterns: look forward to`**（HTTP 200，**明文 `Do not say 'look forward to do something', say look forward to doing something`**）；③ **Cambridge 词典页 `look forward to something`**（HTTP 200，**义项级双 CEFR：B1 `[+ -ing verb]`／B2 正式信尾**）；④ **Cambridge `prepositional-verbs`**（HTTP 200，`look forward to` **同时出现在「介词动词」与「短语介词动词」两张词表内**＋规则句 "The object can be a noun phrase, a pronoun or the -ing form of a verb"）。**四条本轮全部当场 HTTP 200 复取，不是转述**。
2. **本批最关键的一条原文（「同族」的教材级背书）本轮逐字复核成立，且原文比批二十记的更长**：Cambridge 语法页 `To` 的 **`To as a preposition: after verbs`** 节逐字为——"Some verbs are followed by the preposition **to**, including **be used, get used, listen, look forward, object, reply, respond**: We listened to that CD you lent us. It's great. **I object to your remarks.** The bank hasn't replied to my letter yet." → **上游在一句话里把 `be used`／`get used`（批十八已教）／`look forward`（本批）／`object`（本批备选）并列**。**这是本批「同族第二站」话术唯一需要的原文级授权**，且**它同时把 `object` 一并收进来**（本批它判 C 不上正课，但在这一句里与 `look forward` 平级）。
3. **Murphy 证据本轮锁定为「同块」层级，且比批二十的表述更精确——不是「U62 附近」，而是「U60／U61／U62 三课连续块内的 U62」**：中级册 TOC 逐字为 `60 Preposition (in/for/about etc.) + -ing`／**`61 be/get used to (I'm used to)`**／`62 Verb + preposition + -ing (succeed in -ing / insist on -ing etc.)`。**`forward` 在双册 TOC 与双册 PDF 内嵌流中均为 0**（本轮双通道复算）。→ **`look forward to` 的可写依据是「与批十八 U61 同一个三课连续块（U62）」，不是「Murphy 有独立单元」**。**注意 U62 属「同一块」这一事实本身就是「同族」的第二条教材级证据——`be used to` 与 `look forward to` 在 Murphy 是相邻单元。**
4. **BC 三档索引本轮全部直连/存档复点，`look forward to` 零课程位——本轮补上了批二十记「C1 由存档取到」的缺口**：**A1-A2 18 课全目（直连）／B1-B2 36 课全目（直连）／C1 14 课全目（Wayback 存档 curl 200，逐条抽出）**。**B1-B2 最近邻课 `Verbs and prepositions` 本轮再次实取原文：明文不列 `look forward to`、不列 `object to`、且明文「不讲规则」**（"There are no grammatical rules to help you know which preposition is used with which verb"）。**BC 侧的规则级落点仍只在 A1-A2 第 1 课（形容词＋介词）与参考层**——**批二十口径复核无变化**。
5. **`look forward to` 的「补缺口」本轮做了两处，都补到了**：① 批二十 §8 未核实① 记「Murphy 单元内部例句未核」——本轮**仍未核**（只有 TOC），**但已把它从「最大缺口」降级为「不影响结论的缺口」**（因为「同族」依据已由 Cambridge `To` 页与 U61/U62 相邻关系独立成立，不再依赖 Murphy 正文）；② 批二十未查 **BC 参考层 `-ing forms` 页**——本轮查了：**明文把 -ing 定义为 "the object of a preposition" 的用法**（"As the object of a preposition: Some people are not interested in learning English."），**且评论区含 `I look forward to hearing your kind response.` 与 `I got used to waking up early.` 两句同页并列**。
6. **`object to` 本轮复核判读维持 C 档，且比批二十多一条「上游把它与 `look forward` 并列」的加分项**：Cambridge `To` 页把 `object` 与 `look forward` 放在同一句（§0-2）；`prepositional-verbs` 词表**不含** `object to`（本轮逐条复核：两张词表共 27 条，无 `object`）；**语法专页 `object-to` 仍不存在**（本轮直连 HTTP 200 但返回 `Say or tell?`——**该 slug 未登记，复核批二十一致**）；**中文侧 sitemap 复算 `forward` 命中仅两篇（即 `look-forward-to` 两篇），`object` 家族三篇均无关**。→ **维持 C：可作本批第 4/5 课的折入认读句，不单开课**。
7. **`have sth done`／形容词＋介词／机制强化：三项口径零变化**（逐条见 §1.5）。`have sth done` 我方 7 词复跑仍全 0（`will have` 0／`haircut` 0／`repaired` 0／`had my` 0／`cut` 0／`checked` 0／`fixed` 0）；形容词＋介词**本轮复算 `good at` GL 52／HC 6，与批二十一致**（批十九「raw 48」仍不引），其余八式仍全 0；**本轮唯一的新发现不在内容侧而在词架侧——`forward` 已不是「全 0」**：**`forward` GL 2／HC 0，两处全在 L133 的认读种子位内**（`examples` 第 4 条 ＋ `contrast` ⑥）→ **底座的正确表述从「零底座」改为「假底座（2 次面熟，不进练习）」**，**见 §8-9**。
8. **cloze「假友好」本轮用真代码实测，结果比批二十的预判更复杂——全仓有 3 个 cloze 引擎，「永远不成空位」只对其中一个成立**：以源码逐行复刻三处判定逻辑后本地复跑——**A 引擎（关 2 回访问卷 `grammarAmbushService.pickClozeWord`）**：`look forward to` 系句全部落「档 1」，空位永远是 `am`／`is`／`are`／`look`／`looks`，**`forward` 与 `seeing` 永不成空位（批二十预判成立）**；**B 引擎（Boost `buildCloze`）**：关键词池＝长度≥3 且非功能词，**`forward`／`looking` 都会进池**（24 种种子实测出现 `forward`／`looking`／`weekend` 三种空位），**但它的干扰项设计是好的**（功能词走同族替换表、实词走课程词池）；**C 引擎（复习卡 `buildClozeOptions`）**：同样会把 `forward`／`looking` 挖空（按 `reviewCount % 关键词数` **轮转，必然轮到**），**且干扰项生成器未同步 Boost 已做的修正——实测 `forward` → `[forward, forwards, forwardes, forwarded]`、`looking` → `[looking, lookings, lookinges, lookinged]`，三个干扰项里至少两个不是英语词**。→ **「假友好」在 A 引擎成立；处置口径见 §7：① 先修 C 引擎（对齐 Boost 的 2026-09-19 修正，成本一处函数）；② 考点承载从 cloze 移到 `contrast` 与 `guided.spot`（`targetSentence` 不进 B 引擎池，故核心句的 cloze 无法承载考点）；③ `object to` 是唯一「三引擎都真友好」的样本。**

---

## §1 复核结果：逐源列出取到／未取到的页面与要点

### 1.1 British Council LearnEnglish（BC）

| # | 页面 | 取到情况 | CEFR 段位 | 本轮要点（原文级／逐条） |
|---|---|---|---|---|
| BC-1 | A1-A2 索引 **18 课全目** | ✅ **本轮直连 WebFetch 逐条实取** | **A1-A2**（A1 Elementary／A2 Pre-intermediate） | 18 课原序：`Adjectives and prepositions`／`Adjectives ending in '-ed' and '-ing'`／`Articles: 'a', 'an', 'the'`／`Articles: 'the' or no article`／`Comparative adjectives`／`Infinitive of purpose`／`Nouns: countable and uncountable`／`Past continuous and past simple`／`Possessive 's`／`Prepositions of place: 'in', 'on', 'at'`／`Prepositions of time: 'at', 'in', 'on'`／`Present simple`／`Present simple: 'have got'`／`Present simple: 'to be'`／`Quantifiers: 'few', 'a few', 'little' and 'a bit of'`／`Question forms`／`Using 'there is' and 'there are'`／`Verbs followed by '-ing' or infinitive` → **`look forward to` 零／`object to` 零／`verb + preposition + -ing` 专课零**（**复核批二十一致**） |
| BC-2 | B1-B2 索引 **36 课全目** | ✅ **本轮直连 WebFetch 逐条实取**（与本机存档 `bc-b1b2-new.html` 逐条比对一致） | **B1 Intermediate ＋ B2 Upper intermediate** | 36 课全目（含 `Different uses of 'used to'`／`Past habits: 'used to', 'would' and the past simple`／`Stative verbs`／**`Verbs and prepositions`**／**`Verbs followed by '-ing' or infinitive to change meaning`**／`Wishes: 'wish' and 'if only'`）→ **`look forward to` 零／`object to` 零**。**最近邻仍为第 34 课 `Verbs and prepositions` 与第 35 课 `Verbs followed by '-ing' or infinitive to change meaning`** |
| BC-3 | C1 索引 **14 课全目** | ✅ **本轮 Wayback 存档 curl 200 实取并逐条抽出**（落盘 `/tmp/bc_c1_wb.html`，149,745 bytes；**补上批二十「由 WebFetch 取到但未落盘」的缺口**） | **C1 Advanced** | 14 课原序：`advanced-passives-review`／`advanced-present-simple-continuous`／`avoiding-repetition-text`／`contrasting-ideas`／`ellipsis`／`emphasis-cleft-sentences-inversion-auxiliaries`／`inversion-after-negative-adverbials`／`inversion-conditionals`／`modals-probability`／`participle-clauses`／`patterns-reporting-verbs`／`possession-noun-modifiers`／`unreal-time`／`word-order-phrasal-verbs` → **`look forward to` 零／`object to` 零**（**与批十九／批二十逐条一致**） |
| BC-4 | `b1-b2-grammar/verbs-and-prepositions`（**§ 复核项**） | ✅ **本轮直连 WebFetch 实取原文**（页面本机亦无 `look forward`：regex 复算 `bc-b1b2-new.html` ＝ 0） | **B1 Intermediate** | **明文不列 `look forward to`／不列 `object to`**；`to` 组的五个组合逐条为 `listening`／`introduce`／`refer`／`responded`／`apologised`；**规则原文**："There are no grammatical rules to help you know which preposition is used with which verb"（建议整组记）→ **批十八／十九／二十「BC 的动词＋介词课不收 `look forward to`」本轮第三次复核成立，无口径变化** |
| BC-5 | `grammar/english-grammar-reference/ing-forms`（**本轮新取，批二十未查**） | ✅ **本轮直连 WebFetch 实取** | 参考层（跨 beginner／intermediate／advanced） | **四项小节标题**：`We can use the -ing form of a verb`／`-ing forms as nouns`／`-ing forms as adjectives`／`Patterns with -ing forms`；**本轮最关键的规则句（正文）**："**As the object of a preposition**: Some people are not interested in learning English." → **这是 BC 侧把「-ing 形式作介词的后接成分」写成正文小节的原文**；**评论区**含 `I look forward to hearing your kind response.`（Alex）与 `I got used to waking up early in the morning.`／`I used to wake up early in the morning.`（Jonathan R）**两句同页出现** → **`look forward to` 与 `used to` 家族在 BC 参考层同页对照**（**注意：评论区，引用须标注来源层级**） |
| BC-6 | `a1-a2-grammar/adjectives-prepositions` | ⚠️ 沿用批二十 Wayback 实取（`bca_adjprep.html`，2026-04-20 快照），**本轮未重取** | **A1-A2** | 规则句（批二十逐字）"Remember that a preposition is followed by a noun or a gerund (-ing form)." → **BC 侧「介词后接 -ing」的唯一正文规则句，位于 A1-A2 段第 1 课**（**本轮沿用，见 §9 未核实①**） |
| BC-7 | 参考层 `'to'-infinitives` | ⚠️ 沿用批二十存档（`bc-inf.html`，Wayback 2024-09-10），**本轮未重取** | 三档同页 | 评论区规则原文（Kirk 老师）："**if 'to' were a preposition, then the form after it would have to be an '-ing' form … because prepositions require subsequent verb forms to be in the '-ing' form in English. This is one of the few rules that has no exceptions in English!**" → **沿用；引用须标「BC 参考层评论区·LearnEnglish Team 回复」** |

**BC 小结**：**`look forward to`／`object to` 在 BC 三档 68 课仍是零课程位**（三份全目本轮**全部重新复点，C1 本轮首次落盘**）；**B1-B2 最近邻课 `Verbs and prepositions` 明文不收本结构且不教规则**（第三次复核）。**本轮 BC 侧的新增量只有一条，但它正好补在批二十的缺口上：参考层 `-ing forms` 页把「-ing 作介词的后接成分」写成了正文小节（"As the object of a preposition"）**——与 A1-A2 第 1 课的规则句（"a preposition is followed by a noun or a gerund (-ing form)"）互为**正文级双证**（一条在 A1-A2 课程层，一条在参考层）。→ **下游对外可写「BC 无课程位；但 BC 在 A1-A2 课程正文与参考层正文两处都写明『介词后面遇到动词要用 -ing 形式』，本批的规则不是我方自创」。**

### 1.2 Cambridge Dictionary（Cambridge）

| # | 页面 | 取到情况 | CEFR 标签 | 本轮要点（**原文级**） |
|---|---|---|---|---|
| CAM-1 | **`grammar/british-grammar/to`**（**本批最关键的一页**，批十八已取，**本轮直连 HTTP 200 当场复取**） | ✅ **curl 直连 200**（落盘 `/tmp/cam_to_live.html`，453,480 bytes） | **无 CEFR** | **逐字原文（`To as a preposition: after verbs` 节）**："Some verbs are followed by the preposition **to**, including **be used, get used, listen, look forward, object, reply, respond**: We listened to that CD you lent us. It's great. **I object to your remarks.** The bank hasn't replied to my letter yet. See also: Prepositional verbs / Phrasal-prepositional verbs" → **上游在同一句里把批十八（`be used`／`get used`）、本批（`look forward`）、备选（`object`）并列**。**这是「同族」的教材级授权，也是本批 §5 话术的原文依据**（**批二十 §1.2 记该页在批十八缓存中、本轮首次当场复取原文；比较结果：逐字一致，无口径变化**） |
| CAM-2 | `grammar/british-grammar/look-forward-to` | ✅ **本轮直连 HTTP 200 当场复取**（落盘 `/tmp/cam_lft_live.html`） | **无 CEFR** | **逐字原文**："Look forward to something means to be pleased or excited that it is going to happen. **The 'to' in look forward to is a preposition, so we must follow it by a noun phrase or a verb in the -ing form**: `I'm looking forward to the holidays.` … `We're looking forward to going to Switzerland next month.` **Not: … looking forward to go to Switzerland …**"；**第二条 ❌**："If the second verb has a different subject, we use the **object form of the pronoun**, not the subject form: `We're looking forward to him arriving next week.` **Not: `We're looking forward to he arriving next week.`**"；**信尾**："We also use look forward to at the end of formal letters… We use the **present simple** form: `I look forward to your reply.`／`I look forward to hearing from you soon.`" → **两条现成 ❌（`to go`／`he arriving`）本轮逐字复核一致** |
| CAM-3 | **`grammar/british-grammar/word-patterns-look-forward-to`**（Common mistakes 专条） | ✅ **本轮直连 HTTP 200 当场复取**（落盘 `/tmp/cam_wp_lft_live.html`） | **无 CEFR** | **§ 要求的「那句明文」逐字复核成立**："When look forward to is followed by a verb, that verb should be in the **-ing** form. **Do not say 'look forward to do something', say look forward to doing something.** `I look forward to meet you at the conference.`／`I look forward to meeting you at the conference.`" → **标题层级为 `Grammar > Common mistakes in English > Word patterns > Word patterns: look forward to`**（**专条，不是正文段落**） |
| CAM-4 | **`dictionary/english/look-forward-to`** | ✅ **本轮直连 HTTP 200 当场复取** | **义项级双标位：B1／B2** | **逐字原文**：`B1 to feel pleased and excited about something that is going to happen: I'm really looking forward to my holiday.` **`[ + -ing verb ] She was looking forward to seeing the grandchildren again.`**；**`B2 [ + -ing verb ] formal used at the end of a formal letter…: look forward to hearing from you／I look forward to hearing from you.／look forward to receiving something…`**；More examples：`I'm looking forward to seeing Julie.`／`She was looking forward to the meal.`／`I'm not looking forward to the trip.`／`They had looked forward to that holiday for months.`／`I always look forward to seeing my parents.` → **`[+ -ing verb]` 是词典给的形式标注，B1／B2 是词典给的段位**（**本候选最硬的段位证据**） |
| CAM-5 | **`grammar/british-grammar/prepositional-verbs`**（§ 要求的 "The object can be a noun phrase, a pronoun or the -ing form of a verb"） | ✅ **本轮直连 HTTP 200 当场复取** | **无 CEFR** | **规则句逐字**："**Prepositional verbs always have an object, which comes immediately after the preposition. The object (underlined) can be a noun phrase, a pronoun or the -ing form of a verb**: `Somebody broke into his car…`／`I don't want to listen to it any more.`／`Getting to the final depends on winning the semi-final!`"；**本轮新发现（批二十未记）：`look forward to` 在本页出现两次、分属两张词表**——① **`Prepositional verbs` 表**（break into／cope with／get on／deal with／get off／depend on／go into／lead to／**look forward to**／get over／listen to／look after／look at／look for／do without）；② **`Phrasal-prepositional verbs` 表**（catch up with／get on with／look out for／come up against／listen out for／look up to／do away with／look down on／put up with／face up to／**look forward to**／watch out for／get away with／look in on）→ **原文把 `look forward to` 定性为「介词动词」（两句）**：`We look forward to meeting you on the 22nd. (anticipate with pleasure)`／**`Look forward to` 页末 "See also: Look forward to"**（**两张表都收它，说明上游对它的归类本身有摇摆——这点须诚实标注**） |
| CAM-6 | `grammar/british-grammar/verb-patterns`（总索引） | ✅ 沿用批二十直连实取（`camg_verb-patterns.html`），**本轮 regex 复核条目数** | 无 CEFR | **原文**："Click on a topic to learn more about verb patterns."；**逐条抽出＝11 条（批二十记「8 专条」）**：`Hate, like, love and prefer`／`Hear, see, etc. + object + infinitive or -ing`／`Help somebody (to) do`／**`Look forward to`**／`Stop + -ing form or to-infinitive`／`Verb patterns: verb + infinitive or verb + -ing?`／`Verb patterns: verb + that-clause`／`Verb patterns: with and without objects`／`Would like`／`Would rather, would sooner` → **口径校正见 §8：正确表述为「11 条（其中前 5 条是具名专条，后 6 条是通用条目）」**（**批二十记「8 专条」不准确**） |
| CAM-7 | **`dictionary/english/object-to`** | ✅ **本轮直连 HTTP 200 当场复取** | **无 CEFR 标位** | 词条类型＝**collocation（搭配条）**："to feel or express opposition to or dislike of something or someone: `His mother objects to his tattoos.`／`We don't object to her personally…`"；More examples 六条 **全为 `object to` + 名词短语**（`the teaching of religion`／`these standardized tests`／`the pipeline`…）→ **`object to + -ing` 在本页仍无例句**（复核批二十一致） |
| CAM-8 | **`grammar/british-grammar/object-to`**（**本轮再次探测**） | ✅ **curl 直连 HTTP 200，但返回的是 `Say or tell?`**（`<title>Say or tell ? - Grammar - Cambridge Dictionary`） | — | → **该 slug 未在 Cambridge 语法区登记**（复核批二十一致，第二次确认）。**`object to` 至今在 Cambridge 无语法专页、无 Common mistakes 专条、无词典 CEFR 标位** |
| CAM-9 | `grammar/british-grammar/verb-patterns-verb-infinitive-or-verb-ing` 等 4 页（`-ing`／`to` 家族对照页） | ✅ 沿用批二十缓存，**本轮 regex 复扫** | 无 CEFR | 各页 `look forward` 命中 ＝ 2（**全部来自页脚目录导航，不是正文**）→ **正文均不含本结构**（复核批二十一致） |
| CAM-10 | `grammar/british-grammar/word-patterns-look`（**本轮新取，用于查「look 的 word pattern」是否与本批冲突**） | ✅ 批二十直连实取，本轮复核 | 无 CEFR | **逐字原文**："**When look has an object, the correct preposition to use is at. Don't say 'look something' or 'look to something', say look at something**: She looked to the photo on her desk and smiled.／She looked at the photo on her desk and smiled." → **重要：这条明文禁的正是 `look to something`——与本批 `look forward to` 不冲突（本批是 `look forward` 整体＋`to`），但 `look` 与 `to` 直接相邻的写法在上游是被标错的**。→ **写入 §6 切开专节作为负清单依据** |
| CAM-11 | `grammar/british-grammar/have-something-done`／`verb-patterns-with-and-without-objects`／`to` 之外的复核页 | ✅ 沿用批二十实取缓存，本轮**未重取** | 无 CEFR | `have sth done` 口径无变化（见 §1.5） |
| CAM-12 | `grammar/british-grammar/linking-verbs`／`look`／`look-at-see-or-watch` | ⚠️ 沿用批十九实取缓存（`audit19/`），**本轮未重取** | `look` (SEEM) ＝ **A2** | 批十九已落地；**本轮不重取**（见 §9 未核实②） |

**Cambridge 小结（本轮新增/新发现 3 条）**：**① `To` 页的「同族一句列举」本轮当场复取，逐字与批十八缓存一致**（`be used, get used, listen, look forward, object, reply, respond`）——**本批最硬的依据，可放心引用**；**② `prepositional-verbs` 里 `look forward to` 同时出现在两张词表（介词动词表＋短语介词动词表），且两张表的示范句都指向 `-ing`／名词短语**——**这解决了批二十「它到底算哪一类」的悬置，答案是「上游自己也不统一，两处都收」**；**③ `word-patterns-look` 明文禁 `look to something`**——**这是本批与批十九 `look` 家族切开时最需要的小心点（负清单第 1 条）**。

### 1.3 Murphy（本机官方 TOC 原件 ＋ PDF 内嵌流二次验证）

**取到情况**：`/private/tmp/murphy_int.txt`（中级 4th TOC 抽文）·`/private/tmp/murphy_ess.txt`（初级 4th TOC 抽文）·`/private/tmp/murphy_full.txt`（中级全目块）·`/private/tmp/murphy_toc_clean.txt`（双册去空白分节）。**本轮 PDF 内嵌流解压复核**：`murphy_ess.pdf`（99,745 bytes／57 streams／解压后 302,502 bytes）／`murphy_int.pdf`（62,514 bytes／25 streams／解压后 264,645 bytes）——**`forward`／`Forward` 在两册解压全文与原始字节中均为 0**（逐字节复算）。**仍为官方 TOC 抽文＋内嵌流，非正文**（见 §9 未核实①）。

| 项 | 本轮逐字复核结果（**去空白后还原**） |
|---|---|
| **`look forward to`（本批重点）** | **`forward` ＝ 初级 0／中级 0**（TOC 抽文 ＋ PDF 解压流双通道）。→ **「Murphy 有 `look forward to` 单元」的说法在本机原件上无法证实**；**可写依据只到「同块」层级**（见下三行） |
| **中级 U60** | **`60 Preposition (in/for/about etc.) + -ing`**——**「介词 + -ing」的中级总课位**，位于 U59（`prefer and would rather`）之后、U61 之前 |
| **中级 U61** | **`61 be/get used to (I'm used to)`**——**批十八 L119–L124 已教**（我妈 6 课）。**本轮复核单元号与标题无误**。→ **U61 与 U62 相邻，`be used to` 与 `verb + preposition + -ing` 在中级册是挨着的两课** |
| **中级 U62** | **`62 Verb + preposition + -ing (succeed in -ing / insist on -ing etc.)`**——**标题内举例是 `succeed in`／`insist on`，不是 `look forward to`**。→ **本批可写「与批十八 U61 同一个三课连续块（U60–U62）内的 U62」，不得写「Murphy 中级有 `look forward to` 单元」**。**注意标题的 `etc.` 意味着正文可容更多成员——`look forward to` 属 `verb + preposition + -ing` 的形态（`to` 是介词、后接 -ing），落在 U62 的可能性最大，但本轮仍未核** |
| **中级 U53–U68 块** | 逐字：`53 Verb + -ing (enjoy doing / stop doing etc.)`／`54 Verb + to… (decide to… / forget to… etc.)`／`55 Verb (+ object) + to… (I want you to…)`／`56–58 Verb + -ing or to… 1/2/3`／`59 prefer and would rather`／**`60 Preposition (in/for/about etc.) + -ing`**／**`61 be/get used to (I'm used to)`**／**`62 Verb + preposition + -ing (succeed in -ing / insist on -ing etc.)`**／`63 there's no point in -ing, it's worth -ing etc.`／`64 to…, for… and so that…`／`65 Adjective + to…`／**`66 to… (afraid to do) and preposition + -ing (afraid of -ing)`**／`67 see somebody do and see somebody doing`／`68 -ing clauses` → **中级册的 `-ing`／`to` 家族是一个 16 课连续块（U53–U68），其中「介词 + -ing」三课（U60–U62）连续**。**批十八的 U61 在正中；本批的落点只可能在 U60 或 U62 的正文内（未核）** |
| **中级 U65／66／67** | `65 Adjective + to…`／**`66 to… (afraid to do) and preposition + -ing (afraid of -ing)`**／`67 see somebody do and see somebody doing` → **U66 是「`to + 原形` 对 `介词 + -ing`」的显式对照单元**（**与 BC `adjectives-prepositions` 的 `afraid of telling` 同构**）；**U67 是感官动词的上游落点**（批二十已用） |
| **中级 U130／131** | `Adjective + preposition 1`／`Adjective + preposition 2`——**复核批十七／十八／十九／二十，无变化** |
| **中级 U46** | **`46 have something done`**——`have sth done` 的唯一 Murphy 落点，**口径无变化** |
| **初级册（全书）** | **`look` 只出现在 U113 标题 `listen to…, look at… etc. (verb + preposition)` 里（动作义）**；**U112 ＝ `afraid of…, good at… etc. of/at/for etc. (prepositions) + -ing`**。→ **初级册有 `介词 + -ing` 课位（U112）与 `动词 + 介词` 课位（U113），但 `look forward to` 不在任何标题内**；**`object` 在两册 TOC 全 0** |

**Murphy 小结（本批口径要点）**：**双册 TOC 与双册 PDF 内嵌流里 `forward` 与 `object` 都是 0**。中级册的 `to + -ing` 家族落在 **U60／U61／U62 三课连续块**（`Preposition + -ing` ／ `be/get used to` ／ `Verb + preposition + -ing (succeed in -ing / insist on -ing etc.)`）——**批十八的 `be used to` 在 U61 已被逐字证实，本批的 `look forward to` 的 Murphy 依据只能写到「同一个三课连续块内的 U62 所属形态」**。→ **对外一律写「Murphy 中级 U60–U62 为『介词 + -ing』连续三课，`be used to` 是 U61，本批 `look forward to` 属 U62 的形态（标题内举例为 `succeed in`／`insist on`，`look forward to` 未见于 TOC 抽文）」**——**「相邻单元」本身就是「同族」的第二条教材级证据**（第一条是 Cambridge `To` 页）。

### 1.4 中文侧 english.cool（869 篇 sitemap）

**取到情况**：sitemap 本机缓存 `/private/tmp/ec-urls.txt`，**本轮 regex 复算**：`forward` 命中 **恰好两篇**（`/look-forward-to/` 与 `/look-forward-to-2/`）；`object` 命中三篇（`goal-objective-aim`／`indirect-direct-object`／`subject-verb-object-complement`，**均与 `object to` 无关**）。**本轮两篇专文全部再次直连 HTTP 200 实取原文**（`look-forward-to` 96,285 bytes／`look-forward-to-2` 95,150 bytes，**内容与批二十所记逐字一致**）。

| # | 篇目 | 取到情况 | 本轮要点（**原文级**） |
|---|---|---|---|
| EC-1 | `https://english.cool/look-forward-to/`「「look forward to」用法是？加 V-ing？」 | ✅ **本轮再次直连 HTTP 200 实取**（正文 6,337 字符；`look forward` 命中 27 处） | **首屏自测对逐字**：题句 `I look forward to visit you tomorrow.` 对 `I look forward to visiting you tomorrow.`；揭晓 `I look forward to visit you tomorrow. ❌`／`I look forward to visiting you tomorrow. ⭕️`。**病灶描述逐字（§ 要求）**："**不管你答對還答錯，都別小看這裡的 to，很多人一看到 to 就會反射動作加上原形動詞，但是 look forward to 的 to 是介系詞，後面如果遇到動詞要加上 ing 才對唷！**"；**意象拆解逐字**："look 為「看」，forward 為「向前地」，to 代表「朝著…」，所以 look forward to 整個意象就會是「**往前面看**」，類似成語所說的**引頸期盼**之意"；**规则重申**："在這裡是作為**介系詞**，所以後面要加上**名詞或動名詞**"；**四条例句逐字**：`The children look forward to their Christmas presents.`／`Are you looking forward to the graduation trip?`／`Columbus' fans look forward to watching his new YouTube video every Monday.`／`I'm quite looking forward to working with them.`（注：`quite` 可换 `much / very much / so much`）；**现在式 vs 进行式正式度**：`I look forward to meeting you.`（比較正式）对 `I'm looking forward to meeting you.`（比較口語）；**Email 四档正式度逐字**：`I look forward to your reply.`（最正式）＞`Look forward to your reply.`＞`I'm looking forward to your reply.`＞`Looking forward to your reply.`（最不正式）；**收尾句逐字**："相信看完這篇文章後…並會記得**後面的動詞要加上 ing**！雖然一開始可能還是需要**有意識地**去使用動名詞，但多練習幾次就會自然而然地用出來啦！" |
| EC-2 | `https://english.cool/look-forward-to-2/`「「期待」英文怎麼說？Look forward to? Expect?（含例句）」 | ✅ **本轮再次直连 HTTP 200 实取**（正文 6,050 字符；`look forward` 命中 11 处） | **三词辨析**：`look forward to`（盼望、期望、期待）／`expect`（預期、預料）／`anticipate`（預期、預料）。**`look forward to` 段逐字**：英文定义 "to feel pleased and excited about something that is going to happen"；"**forward 的意思為向前地，所以 look forward to 的意象就是往前看，就像在引頸期盼**"；"**要特別留意這裡的 to 為介系詞，後面須加上名詞喔**"；**形式标注逐字＝`look forward to + N/Ving`**；例句 `I'm looking forward to seeing you again.`／`The students are looking forward to the summer vacation.`／`The man isn't looking forward to the upcoming new year.`；信尾 `I'm looking forward to your reply.`／`I look forward to hearing from you.`。**`anticipate` 的对照规则（可作二期铺垫）**："留意一下 anticipate 和 expect 的用法不同，**後面不會加 to V，而是加上動名詞 (Ving)**" ＋形式标注 `anticipate + N/Ving`（例 `I anticipate getting a pay raise this year.`） |

**中文侧小结**：**`look forward to` 仍是本批最厚的中文侧证据——两篇独立专文、首屏 ❌ 自测对、病灶描述（「反射動作加上原形動詞」）与词源意象（「往前面看／引頸期盼」）全部可逐字引用**。**`object to` 中文侧零专文**（sitemap 复算，复核批二十一致，**表述口径仍限「sitemap slug 层面未发现」，见 §9 未核实③**）。**本轮新增一条可用素材**：EC-1 收尾句的「**需要有意識地**」——**与批十九中文侧对照，它给了「为什么会错」的机制解释（母语反射），可直接用作本批 L135 的错因话术底本**。

### 1.5 `have sth done`／形容词＋介词／机制强化（复核，仅标注有无口径变化）

| 候选 | 本轮复核动作 | 结果 |
|---|---|---|
| **`have sth done`** | ① 我方词架复跑 7 词；② Cambridge `have-something-done` 与 `verb-patterns-with-and-without-objects` **未重取**（沿用批二十实取，口径无变化） | **GL／HC 两文件复算**：`will have` 0／`haircut` 0／`repaired` 0／`had my` 0／`cut` 0／`checked` 0／`fixed` 0 → **与批二十逐词一致，维持撤出，零口径变化。唯一细小差异：`have my` GL 1／HC 0**（批二十记的是 `had my` 0——**两词不同，`had my` 本轮仍 0**，见 §8-3） |
| **形容词＋介词** | 我方复跑 9 词（`grep -oiw` 口径） | **`good at` GL 52／HC 6**（**与批二十复算一致**）；`interested in`／`afraid of`／`similar to`／`proud of`／`worried about`／`full of`／`keen on`／`familiar with` **两文件全 0** → **维持折卡（不单开），零口径变化；「六族只覆 1/6」表述保留**（批十九「raw 48」仍不引） |
| **机制强化** | 不做新取证 | **维持 D 档（不做）**：批十六判「无增量空间」，十七／十八／十九／二十复跑维持，本轮无新输入 |
| **（本轮新增·非候选）`forward` 词架复核** | 我方复跑 `forward`／`forwards`／`look forward`／`looking forward` 四式 | **`forward` GL 2／HC 0／`forwards` 0／`look forward` 0／`looking forward` GL 2**——**四处命中实为同一句的两处**（`I am looking forward to the weekend.` 在 **L133**：`examples` 第 4 条 ＋ `contrast` ⑥）→ **底座表述改为「假底座」**（见 §8-9）；**`object`／`object to` 两文件仍全 0**（**复核批二十一致**） |

---

## §2 对比表

| 候选 | Murphy（册别＋单元号） | BC（含 CEFR 段位） | Cambridge | 中文侧 | 我方现状 |
|---|---|---|---|---|---|
| **① `look forward to`（`to + -ing` 第二族首项·本批正课）** | **双册 TOC ＋ PDF 内嵌流全 0**（`forward` ＝初 0／中 0）；**依据只到「同块」：中级 U60–U62 连续三课**（U60 `Preposition (in/for/about etc.) + -ing`／**U61 `be/get used to`**／**U62 `Verb + preposition + -ing (succeed in -ing / insist on -ing etc.)`**）——**批十八在 U61，本批属 U62 形态，两课相邻** | **三档 68 课零课程位**（A1-A2 18／B1-B2 36／**C1 14 本轮落盘复算**）；**B1-B2 第 34 课 `Verbs and prepositions` 明文不收**（第三次复核）；**规则级落点两处正文**：A1-A2 第 1 课 `Adjectives and prepositions`（"a preposition is followed by a noun or a gerund (-ing form)"）＋**参考层 `-ing forms`（本轮新取，"As the object of a preposition"）** | **词典义项级 B1**（`[+ -ing verb]`）**＋ B2**（正式信尾）；**语法专页 `Look forward to`**（❌ `to go`／❌ `he arriving`）；**Common mistakes 专条 `Word patterns: look forward to`**（明文 `Do not say 'look forward to do something'`）；**`prepositional-verbs` 两张词表都收它**（＋"The object can be a noun phrase, a pronoun or **the -ing form** of a verb"）；**`Verb patterns` 索引具名专条之一**；**`To` 页与 `be used`／`get used`／`object` 同句列举** | **两篇独立专文**（`look-forward-to` 首屏 ❌ 自测对＋病灶描述逐字＋意象「往前面看」／`look-forward-to-2` 三词辨析＋`look forward to + N/Ving`）；**总表文 `gerund-infinitive-verb` 不收它**（批二十复算） | **`forward` GL 2／HC 0**（**两处全在 L133 认读种子位内，非本批新增**）；`forwards` 0／`look forward` 0／`looks forward` 0；**假底座·造词课**（**`forward` 只有 2 次「面熟」，且不进练习——不构成已教**）；**`look` 词根极厚**（GL `look` 词边界 174／全文 378／`looks` 186／`looking` 17／`looked` 1）；**`look at` 22 处**；**`-ing` 家族厚**（`getting up` 47／`reading` 599／`going` 129 等）；**同族第一站批十八已交付**（`am used to` 101／`be used to` 4／`get used to` 3；**`I am used to getting up early.` 全句 30 处**） |
| **② `object to`（本批备选·维持 C）** | **双册 TOC 全 0**（`object` 两册 0） | **三档 68 课零课位**；`Verbs and prepositions` 的 `to` 组（listening／introduce／refer／responded／apologised）**不含它** | **本轮新增一条加分项**：`To` 页把它与 `look forward`／`be used`／`get used` **同句列举**（`I object to your remarks.` 即该节例句）；**但**：词典仅**搭配条（collocation）无 CEFR**、**语法页 `object-to` 不存在**（本轮第二次 HTTP 200 返回 `Say or tell?` 确认）、**两词表均不收它** | **零专文**（sitemap 复算，`object` 家族三篇均无关） | **`object`／`object to` 两文件全 0**（零底座）；**cloze 侧真友好**（`I object to it.` → 空位 `object`，落档 2） |
| **③ `have sth done`** | **中级 U46 `have something done`**（跨级，U42–U45 被动块之后） | **三档 68 课零课位** | `Have something done` 专页（明文 `Not the same as the present perfect or past perfect`）＋`verb-patterns-with-and-without-objects` 的 `-ed clause` 节 | 有节级落点（`causative-verbs` 被动句型） | **零词架**（7 词全 0）；**强干扰源仍在**（`have X done` 命中全是现在完成时） |
| **④ 形容词＋介词** | **初 U112**／**中 U130–131** | **A1-A2 第 1 课课程位（A 档级）** | （批十七已记） | （批十七已记） | **六族只覆 1/6**（`good at` GL 52／HC 6） |
| **⑤ 机制强化** | — | — | — | — | **D 档不做**（维持） |

---

## §3 三问制正当性表（①跨源课程位 ②中文侧实证 ③我方接口）

| 序 | 候选 | ① 跨源课程位 | ② 中文侧实证 | ③ 我方接口 | **档位** | 判读 |
|---|---|---|---|---|---|---|
| 1 | **`look forward to`** | **零课程位**（BC 三档 68 课复点；Murphy 双册 TOC＋PDF 流 0）；**但上游有「四层证据 ＋ 一层体系定位」**：词典义项级 **B1**＋`[+ -ing verb]`／**语法专页**／**Common mistakes 专条**／**两张词表的 prepositional verb**／**`To` 页与批十八同族同句** | **强**（**两篇独立专文**＋首屏 ❌ 自测对＋病灶「反射動作加上原形動詞」＋意象「往前面看」；**总表文不收它**） | **假底座**（`forward` GL 2／HC 0，**仅 L133 认读种子位两处，不进练习**）——**但结构接口最厚**：`look` 词根 GL 词边界 174 处／`looks` 186 处／`look at` 22 处；`-ing` 家族厚（`getting up` 47）；**同族第一站 L119–L124 已交付**（`am used to` 101 处；**`I am used to getting up early.` 全句 30 处**）；**L133 已放认读种子位** | **B＋（维持，不升不降）** | **上游证据本轮全部当场复取、逐字一致，档位无变化**。**硬伤从「零底座」校正为「假底座」**（**多了 2 次面熟，但都不进练习**）——**且本轮用真代码把「cloze 假友好」也实测确认了（§7）**。→ **B＋ 保留，明写「须先造词架；cloze 考点须移载」** |
| 2 | **`object to`** | **零课程位**；**上游本轮新增一条同句列举**（`To` 页），但**专页不存在（二次确认）／无 CEFR／两张词表都不收** | **零专文**（sitemap 复算） | **零底座**（`object` 全 0） | **C（维持）** | **维持批二十判读：可作本批第 4/5 课的折入认读句（`My mother objects to the colour.`），不单开课。** 本轮新增的加分项（`To` 页同句）**不足以升档**：**同句列举只证明「上游把它归在同族里」，不构成课位**；**且它的语义场景（反对）在「小美的一天」零基础场景里天然不友好**（要另造「反对某件事」的场景） |
| 3 | **`have sth done`** | BC 零课位；Murphy 仅中级 U46（跨级） | 有节级落点 | 零词架＋强干扰源 | **C（维持撤出）** | **口径零变化**（§1.5） |
| 4 | **形容词＋介词** | A1-A2 第 1 课课程位＋初 U112／中 U130–131 | （批十七已记） | 六族只覆 1/6 | **B−（维持折卡）** | 「一课一增量」守不住（搭配是清单不是结构）；**本方红线：`to` 作门牌 vs `at` 作门牌 两套话术不得串台** |
| 5 | **机制强化** | — | — | — | **D（不做）** | 维持 |
| 6 | **`look like`** | 上游把 `look like` 与 `look forward to` 分页分体系（批二十 §5.1③） | `sense-verbs` 篇把 `look like` 与 `look forward to` 分置不同节 | **L127 已认读 `It looks like rain.`** | **D（本批零扩，维持）** | **本轮新增一条负清单依据**：Cambridge `word-patterns-look` **明文禁 `look to something`**——`look` 与 `to` 直接相邻的写法在上游是被标错的，**本批须确保 `look forward to` 整体出现，不得写出 `look to` 作「期待」义** |

**三问制小结**：**本批序 1（`look forward to`）档位无变化（B＋）**，**本轮的任务不是改档，而是把「B＋ 是怎么构成的」逐条落到原文**——**四层上游证据（§1.2 CAM-1～CAM-5）＋一层体系定位（两张词表）＋两处 BC 规则正文＋两篇中文专文，全部当场 200 复取**。**序 2（`object to`）维持 C**；**序 3／4／5／6 维持原判（撤出／折卡／不做／零扩）**。

---

## §4 大章节组合建议

### 4.1 首选方案：**大章 5 课「盼着的那一天」（L134–L138）**

**先明写全批定位（主理人已裁，本报告不重新论证）**：**这是「所有 B 档系列课程」的收官批**——`be used to`（批十八，B1 开局章）→ `look + 形容词`（批十九，B）→ 五种感官（批二十，B−）→ **`look forward to`（批二十一，B＋）**，**四批之后 B 档系列结清**。**收官的含义有三条**：① 本批收口课必须**把批十八与本批两站并列排一行**（§5）；② 本批之后**不再新开 B 档章**（后续批次的候选池里已无 B 档以上项，见 §4.5 结账表）；③ 本批的**造词成本必须一次结清**（`forward` 造进去，不留尾巴）。

**为什么是 5 课（三条理由，逐条）**：
1. **内容自然容量 ≥5 格，且每格是结构性增量而非换词**：① 认词（`look forward to` 整体＝「盼着」；**`forward` 是库外新词，必须单独站一格**）；② **`to` 后面跟「做的事」（名字版 `-ing`）**——**同族第二站，与批十八 L120 显式并列**；③ **`to` 后面跟「东西」（名词短语）**（`the weekend`／`my birthday`——**「同一个 `to` 两张脸」的第二层**）；④ **换人版＋说不和问**（`She's looking forward to…`／`I'm not looking forward to…`／`Are you looking forward to…?`）；⑤ **收口（零新知）**：批十八 ＋ 本批两站排一行。
2. **对比批十九为什么只有 3 格**：批十九的硬伤是「第 4 课起只能换词」——**本候选没有这个硬伤**，它的第 2／3 课区别是**结构性的**（名字版 对 东西）。
3. **对比批十八的 6 课**：批十八是 `be used to` ＋ `get used to` ＋ `used to` **三头并列**（6 课）；**本候选是单头 `look forward to`**（`object to` 判 C，不上正课），**故 5 课（比 6 少 1）；对比批二十的 6 课（四词并列）同理少 1**。

| 课号 | 主题 | 增量（一课一增量） | 接口（与已有课的显式连接） |
|---|---|---|---|
| **L134** | **「我盼着那一天」**（`look forward to` 整体认词，后面跟**东西**；**本课不碰名字版**） | **新词 `forward` 上线（库外，全批唯一的新词）＋ `look forward to` 整体当「盼着」用**；后面跟「东西」——库内可用：`the weekend`（GL 5＋`weekend` 词形 12）／`my birthday`（35）／`the movie`（8）／`the game`（2）／`tomorrow`（37）。**把 `to` 后面的脸先收窄成一张** | 开场复用 **L125 `It looks nice.`**（同一个 `look`，**N+9 课回流**）；**与 L68 `want to travel` 的 `to` 显式切开**（**`want to` 后面跟原样，这里后面跟东西**）；**`forward` 用中文意象落地**：借 EC-1／EC-2 逐字的「**往前面看／引頸期盼**」 |
| **L135** | **「盼着做那件事」**（名字版上场） | **`to` 后面遇到「做的事」要换名字版**——`I'm looking forward to seeing you again.`（**库内 `seeing` 是 0，须造；或改用 `getting up` GL 47／`watching` 2／`buying` 9 等库内名字版**） | **与 L120 `I am used to getting up early.` 显式并列**（**同族第一站已在库，`getting up` GL 47 处**）；名字版话术直接复用 L42／L43 既有体系；**错因话术底本＝EC-1 逐字「很多人一看到 to 就會反射動作加上原形動詞」** |
| **L136** | **「同一个 `to`，两张脸」**（切开课：东西 对 做事） | **零新知（切开课）**：`I'm looking forward to the weekend.`（后面是东西）／`I'm looking forward to seeing you.`（后面是做事）——**两句话同一个开头、同一个 `to`，后面跟的东西不一样** | **直接接 L119／L124 的收口话术**（**同一个 `to`，前面站谁**）；**并且必须与 L122 的「两张脸」显式区分**（L122 切的是 `used to` 对 `be used to`——**切前面**；L136 切的是 `to` 后面——**切后面**）→ **两课的「两张脸」不同轴，须在本课 oneLineRule 里点明**（见 §5.3） |
| **L137** | **「我盼着，你盼着吗？」**（换人版＋说不和问） | **`I'm looking forward to…` 的换人（`She's`／`We're`／`They're`）＋否定（`I'm not looking forward to…`）＋问（`Are you looking forward to…?`）** | 复用 **L123 `I am not used to…`／`Are you used to…?` 的否疑骨架**（**同族第一站的否疑课已在库**）；`-s`／`is`／`are` 复用 L25／L126 |
| **L138** | **「同一个 `to` 的两站」（收口）** | **零新知**：批十八（`be used to + -ing`）与本批（`look forward to + -ing`）**两站排一行**——`I am used to getting up early.` 对 `I'm looking forward to getting up early.`（**同一个 `to`、同一个名字版、意思完全不同**） | **跨批钩子：批十八 6 课 ＋ 本批 5 课在此一次收口**（**本项目第二次「两批同族收口」，第一次是批十八内部的 L124**）；**并把 L133 的认读种子位正式转正**（`I am looking forward to the weekend.` 从「只认脸」变成本批主句） |

**课量理由三条**：① 上表 5 格**每格一个真实增量**（无空格）；② **与 `object to` 的取舍**：判 C（§3），**不上前 3 课**——若生产期容量富余，**可在 L137 或 L138 折入一句认读**（`My mother objects to the colour.`），**但不为它单开课**；③ **不取 6 课**：多出的第 6 课只能靠「`object to`＋`succeed in`／`insist on` 换词」撑（**Cambridge 的同族条目有 `succeed`／`think of`／`avoid`／`enjoy` 等——但那是清单不是结构**，正是 `have sth done` 与形容词＋介词被判撤出／折卡的同一个理由）。

### 4.2 备选方案 A：**小章 3 课（L134–L136）**

若生产期判定「库外新词 `forward` ＋ 5 课工作量过重」：**取 L134（认词）／L135（名字版）／L136（两张脸切开）三课**，**L137／L138 并入他章或延后**。**代价**：放弃「两站排一行」的收官收口（**而本批的定位恰恰是 B 档收官——放弃收口等于放弃收官**），且**L133 的认读种子位无处转正**（**它只是认读，不构成「已教」**）。**判：不推荐**——**本批与批十九不同，批十九是「第 4 课起只能换词」，本批的第 4／5 课有真增量（否疑 ／ 收口）**，砍掉它们纯属工作量考虑，不是为了守「一课一增量」。

### 4.3 备选方案 B：**4 课（L134–L137，砍收口）**

**能砍的只有收口课**（第 5 课），**但砍收口与「B 档收官批」的定位直接冲突**（§4.1 定位第 ① 条）。**判：不如 5 课；若必须减 1，宁可砍 L136（两张脸切开，与 L122 有部分重叠风险）也不砍 L138**——**理由：L136 的「切后面」增量可以由 L135 的 oneLineRule 捎带，而 L138 的「两站排一行」是全批唯一的跨批收口点，不可替代。**

### 4.4 **造词成本（`forward` 必造）的处理方式**（**本轮必须明写**）

**风险定义**：`forward` 是我方**库外新词**（**GL 2／HC 0，两处全在 L133 的认读种子位里，不进练习**），`look forward to` 是**库外新短语**——**这是本项目第二次在 B1 段开「库外新短语 ＋ 库外新词」的课**（第一次是批二十的四种感官）。**但本批与批二十有一处关键不同：批二十是四词并列（`sound`／`smell`／`taste`／`feel` 都必造），本批只有 `forward` 一个必造项**——**造词成本比批二十低得多**；**且 L133 已给过 2 次面熟**（**这是批二十留给本批的现成交接，须用上**）。

**处理方式六条（逐条可执行）**：
1. **把新词压缩到最小（全批只上 `forward` 一个）**：`object to` 判 C 不上正课 ＝ **`object` 不上**；**`reply`／`holiday`／`email`／`concert`／`exam` 等场景词若超纲一律改用库内词**——**库内实测可用**：`the weekend`（`weekend` GL 12）／`my birthday`（35）／`the movie`（8）／`the game`（2）／`tomorrow`（37）／`the letter`（4）／`the party`（2）／`the summer`（1）。**库外不可用**：`your reply` 0／`the holidays` 0／`next week` 0／`the concert` 0／`the exam` 0／`Christmas` 0／`trip`（`the trip` 0，`trip` 词形 GL 1）。
2. **新词单独占第 1 课（L134）**：**不把 `forward` 藏在长句里**——**L134 的 `blocks` 必须把 `look forward to` 拆成可见部件**（复用批十八 L119 `{ text: "I am used to", role: "…" }` 的块状拆法），**建议三块**：`{ text: "I am looking", role: "我正（眼睛朝前）" }`／`{ text: "forward", role: "朝前（新词·就往前面看）" }`／`{ text: "to the weekend", role: "朝着周末" }`。
3. **`-ing` 侧的造词要先算清（本轮逐词实测）**：**`seeing` 0／`hearing` 0／`meeting` 0**（**库内全 0，若用须造**）；**库内可用且厚**：`getting up` GL 47（**同族第一站 L120 的现成物件，首选**）／`reading` 599／`going` 129／`playing` 37／`working` 14／`buying` 9／`watching` 2／`eating` 2。→ **L135 的示范句建议优先用 `getting up`**（**与 L120 逐字同物件，同族对照最干净**），**`seeing you` 作第二句（造或不造可裁）**。
4. **新旧比例硬纪律（沿用批十七–二十）**：**每课 targetSentence 里新词 ≤1**；**对比卡 6 条中至少 3 条的正确答案必须是库内词句**。
5. **「造词课」的档位诚实标注**：**B＋ 档不得写成 A 档**；**对外写「跨源有词典义项级 CEFR ＋ 两个专页 ＋ 两张词表 ＋ 同族同句授权，但 BC 无课程位、Murphy 无 TOC 正文、我方只有 2 次面熟（L133 种子位，不进练习），须先造词架（本批只造 `forward` 一个）」**。
6. **反向验证垫子（本批最有力的一条·本轮实测数字）**：**批十八 L120 `I am used to getting up early.` 是本批最重要的既有接口**（**`I am used to getting up early.` 全句 GL 30 处，`getting up` GL 47 处——同族第一站的 `-ing` 句已在库且极厚**）——**L135 必须显式回流它**；**再加一条 L133 的认读种子位**（`I am looking forward to the weekend.` **已在库 2 处**，虽属 `examples`／`contrast` 不进练习，**但生产期可直接取用其句式与场景**）——**这是「造词课」能借的两股力，比例行造词课（批二十）强**。
7. **L133 种子位的收割方式（本轮新增·针对快照变化）**：**L133 里那两处 `I am looking forward to the weekend.` 是本批唯一的既有面熟**——**L134 或 L135 的开场应显式认领它**（**照抄批十九 `It looks like rain.` 的处理口径：认读句进新课时「转正」，不重造**）。**注意两条护栏**：① **不得写「L133 已经教过」**（**它不在 `practice`／`guided`／`recall` 里，不构成已教**——**这与批二十路线图 §1.2 配套裁决③ 的口径一致**）；② **L138 收口课可以把 L133 那句作为「你会的第一句」回引**（**但不得作为已学证据引用**）。

### 4.5 B 档系列结账表（**收官批必附**）

| 批次 | 主题 | 档 | 课号 | 交付状态 | 本批与本批的关系 |
|---|---|---|---|---|---|
| 批十八 | 同一个 `to`，两张脸（`be/get used to`） | B1 开局 | L119–L124（6 课） | ✅ 已交付 | **同族第一站**；L138 与之并列收口 |
| 批十九 | 我看到的和感觉到的（`look + 形容词`） | B | L125–L127（3 课） | ✅ 已交付 | **同一个 `look` 的第一、二张脸**；L134 借其 `It looks nice.` 回流 |
| 批二十 | 五种感官（`sound`／`smell`／`taste`／`feel`） | B− | L128–L133（6 课） | ✅ 已交付 | **L133 留了本批的认读种子位** |
| **批二十一** | **盼着的那一天（`look forward to`）** | **B＋** | **L134–L138（5 课·本批）** | **本批** | **B 档收官** |
| （结余） | `object to`（C）／`have sth done`（C）／形容词＋介词（B−·折卡）／机制强化（D）／`seem`·`appear`（D） | — | — | **不排期** | **B 档系列结清后，候补池中已无 B 档以上项**（批二十 §6.2 序 2–6 维持原判） |

→ **「收官」的可写口径**：**本批交付后，B 档系列四批（18／19／20／21）全部结清；剩余候补项最高只到 B−（形容词＋介词·折卡）与 C（`object to`／`have sth done`），且均已判「不单开」。**

---

## §5 「同族第二站」设计专节（本批脊柱）

**本节回答一个问题：`look forward to + -ing` 与批十八 `be used to + -ing` 是什么关系，跨源怎么处理，我方怎么设计才不是重复？**

### 5.1 跨源教材怎么处理这两站（**逐条原文依据**）

| 源 | 处理方式 | 原文依据（本轮实取） |
|---|---|---|
| **Cambridge `To` 语法页** | **把它们放在同一句里列举**——**这是「同族」最硬的上游授权** | **逐字（本轮 HTTP 200 当场复取，`To as a preposition: after verbs` 节）**："Some verbs are followed by the preposition **to**, including **be used, get used, listen, look forward, object, reply, respond**: We listened to that CD you lent us. It's great. **I object to your remarks.** The bank hasn't replied to my letter yet." → **`be used`／`get used`（批十八）与 `look forward`（本批）在同一张名单里，且 `object`（本批备选）也在** |
| **Cambridge `prepositional-verbs`** | **把它们归入同一体系（介词动词），并给出同一句形态规则** | **逐字**："Prepositional verbs always have an object, which comes immediately after the preposition. **The object (underlined) can be a noun phrase, a pronoun or the -ing form of a verb**"；例 `Getting to the final depends on winning the semi-final!`；**`look forward to` 出现在两张词表内**（介词动词表＋短语介词动词表） → **`be used to`／`look forward to` 属同一大类，后续成分共享同一句规则** |
| **Murphy 中级册** | **把它们排成相邻单元** | **逐字（TOC 去空白还原）**：`60 Preposition (in/for/about etc.) + -ing`／**`61 be/get used to (I'm used to)`**／**`62 Verb + preposition + -ing (succeed in -ing / insist on -ing etc.)`** → **批十八在 U61，本批属 U62，两课相邻；U60 是共同的总课位** |
| **BC** | **把它当同一句规则的两次应用（不给单课）** | **正文级两条**：A1-A2 第 1 课 "Remember that **a preposition is followed by a noun or a gerund (-ing form)**"；**参考层 `-ing forms`（本轮新取）"As the object of a preposition"**；**参考层评论区**（Kirk）："prepositions require subsequent verb forms to be in the '-ing' form in English. This is one of the few rules that has no exceptions" | 
| **中文侧 english.cool** | **分两篇各写各的，但用的是同一套解释**：都把 `to` 定性为「介系詞」，都强调「后面接名詞／動名詞」 | **`look-forward-to` 逐字**："look forward to 的 to 是**介系詞**，後面如果遇到動詞要**加上 ing** 才對唷"；**`habit-be-used-to`／`used-to` 同站系列**（批十八已用）用的是同一套「介系詞＋V-ing」解释 → **中文侧不并列两站，但解释框架相同** |

**结论（一句话）**：**四源全部把 `be used to` 与 `look forward to` 当「同一族」处理，但没有任何一源把它们并列在同一个教学单元里做对照——它们只在「规则句」与「体系归属」层面同族，在「课位」层面各自独立。** → **这正好说明我方该做什么：不是重讲一遍 `to + -ing`（那是批十八 L120 已做的事），而是把两站并列成一条线（L138 收口课），让「同一个 `to`、同一个名字版、两件事」可见。** **上游没人做这件事，这正是我方的增量。**

### 5.2 我方怎么设计才不是重复（**与批十八的逐项分工表**）

| 维度 | 批十八已做的事（L119–L124） | 本批必须做的事（L134–L138） | **重叠风险** | 处置 |
|---|---|---|---|---|
| **`to + -ing` 形态本身** | **L120 已立岗**：`I am used to getting up early.`（**「做的事穿名字版」这个知识点已经教过**） | **不重讲形态**——L135 只讲「**前面站的是谁**」：批十八是 `am`，本批是 `look forward` | **高** | **L135 的 oneLineRule 必须显式引用 L120**（「第 120 课学过同一个规矩：后面那件事要换名字版。今天换的是前面站着的人——不是 am，是 look forward」），**并把它写进 `deepDive`** |
| **「同一个 `to` 两张脸」话术** | **L122 已用**：切的是**前面**（`used to` 对 `be used to`——有 be／没 be） | **L136 切的是后面**（后面跟东西 对 后面跟做事） | **高（同一句标语，不同轴）** | **L136 的 oneLineRule 必须点明轴不同**：「第 122 课切的是**前面**（有 be 没 be）；今天切的是**后面**（跟东西还是跟做事）——同一个 `to`，两张脸，看的是不同的地方」 |
| **否疑（说不和问）** | **L123 已做**：`I am not used to it.`／`Are you used to it?` | **L137 做 `I'm not looking forward to…`／`Are you looking forward to…?`** | **中** | **L137 只补「帮手位置因 `-ing` 而变」的新点**（`am` 系 vs `looking` 系在否疑里的表现），**骨架直接声明「第 123 课那套」**，不重讲 `not` 跟 be 走 |
| **收口方式** | **L124 收口**：批十八内部四句排一行（`used to`／`be used to`／`getting`） | **L138 收口**：**跨批**两站排一行（批十八 对 本批） | **低** | **L138 是本批独有的增量**（**本项目第一次在收口课里跨批**——L124 是批内收口），**必须写明与 L124 的分工**：「第 124 课把这一章四句排一行；今天把**两章**排一行」 |
| **认词** | `used`／`used to` 库内已有 L93／L100 垫子（**批十八不是纯造词课**） | **`forward` 是纯库外新词** | **低** | **L134 单独承担造词**（§4.4） |

### 5.3 三条设计准则（**逐条，附原文依据**）

1. **同族第二站的「站名」必须落在「前面站谁」上，不能落在「`to` 是什么」上**：**`I am used to getting up early.`（前面站着 `am`——习惯的记号）对 `I'm looking forward to getting up early.`（前面是 `look forward`——盼着的说法）**。**依据**：Cambridge `To` 页把 `be used`／`get used`／`look forward`／`object` **放在同一句里列举**——**上游的判据就是「前面站哪个动词」**；**`to` 后面跟什么，两站完全一样（都是名字版）**。
2. **两站的区别必须用「意思完全不同」收口，不能用「用法不同」收口**：L138 的两句 `I am used to getting up early.`／`I'm looking forward to getting up early.` **形态几乎一样、意思差得很远**（习惯了／盼着）——**这是零基础用户最能感知的区别**。**依据**：中文侧两篇 `look-forward-to` 与同站 `used-to` 系列**用的是同一套「介系詞＋V-ing」解释**（§5.1）——**若我方也按「用法」讲，两课必然重复；按「意思」讲才切得开**。
3. **本批不得重讲「介词」这个概念**：**批十八 L120 已经用「同一个 `to`，前面有 be 站着，它认名字版」讲过**；本批若再讲一遍「`to` 是介词」，**就是把 L120 重上一次**。→ **本批的 `to` 话术一律用「前面站谁」表述**，**`forward` 只讲中文意象（往前面看／盼着），不讲词性**。**依据**：零术语红线含「介词」（`grammarZeroTerms.ts`，29 词表）——**批十八已经绕过它，本批沿用同一绕法**。

### 5.4 同族第二站的术语红线（**本批危险词，逐条给替换**）

| 危险词 | 在 29 词表内？ | 本批最易踩的课 | 替换话术（沿用库内既有体系） |
|---|---|---|---|
| **介词** | ✅ 在（红线） | **L135／L136（讲 `to` 后面跟什么时）** | 「**`to` 在这里是「朝着」那个小牌子**」（借 L67 门牌意象 + L68 小垫板对照）——**一律不说「介词」** |
| **不定式** | ✅ 在 | **L134（讲 `want to` 与 `look forward to` 切开时）** | 「**原样**」（L68 `want to travel` 既有话术；L93 `I used to play here.` 的「后面跟原样」） |
| **动名词** | ✅ 在 | **L135（讲名字版时，最易写「动名词」）** | 「**名字版**」（L42／L43 既有体系；L120 已用「穿名字版」） |
| **宾语** | ✅ 在 | **L137（讲「后面跟的东西」时）** | 「**后面跟的那个东西**」（不用「宾语」） |
| **形容词／副词** | ✅ 在 | **本批低风险**（本批不教这两类） | — |
| **时态／现在进行时** | ✅ 在 | **L137（`I'm looking forward to…` 是进行式形态，最易写「现在进行时」）** | 「**正**（我正盼着）」（沿用库内 L128–L133 的「自己站中间」体系，或直接说「`I'm` 就是「我正」） |

---

## §6 与批十九 `look` 家族的切开专节

**本节的判据一句话**：**`look forward to` 是 `look` 的第三个义项，切它的唯一可抄方式是「后面跟什么」，不是「look 有几种意思」。**

### 6.1 `look` 的三张脸（本批须同屏切开的三句）

| 脸 | 句子 | 后面跟什么 | 我方已教位置 | 上游落点 |
|---|---|---|---|---|
| **第一张：什么样** | `The sky looks dark.`／`It looks nice.` | **后面跟「什么样」的词** | **L125–L127（批十九已交付）** | Cambridge `look` 语法页 `Look as a linking verb` 节；`dictionary/english/look` **(SEEM) A2** |
| **第二张：去哪儿看** | `Look at the clouds!` | **后面跟「去哪儿看」** | **L127 已认读并切开**（**L127 的 oneLineRule 逐字：「喊人去看是 Look at the clouds!（后面跟「去哪儿看」）；说看着什么样是 The sky looks dark.（后面跟「什么样」）」**） | Cambridge `Look at, see or watch?` 独立页（明文 `Look at the rain.` ／ `Not: Look the rain.`）；**`word-patterns-look`（本轮复核）："Don't say 'look something' or 'look to something', say look at something"** |
| **第三张：盼着的那件事（本批新增）** | `I'm looking forward to the weekend.` | **后面跟「盼着的那件事」** | **L133 已放认读种子位**（`examples` 第 4 条 ＋ `contrast` ⑥，**三护栏：不进练习、不作错项、`bothRight: true`**） | **Cambridge `Verb patterns` 专条 `Look forward to`**；**`prepositional-verbs` 两张词表**；**`dictionary` 义项 B1 `[+ -ing verb]`** |

### 6.2 跨源怎么切（**逐条原文**）

| 源 | 怎么切 `look` 的三张脸 | 原文依据 |
|---|---|---|
| **Cambridge** | **按体系分页**（不在同一页并列）：`look + 形容词` 在 `look` 语法页的 `Look as a linking verb` 节；`look at` 在 `Look at, see or watch?` 独立页；`look forward to` 在 **`Verb patterns`** 与 **`Prepositional verbs`** 两个页里（**与前者不同页、不同体系**） | CAM-12（批十九实取）／CAM-9（本轮复核）／CAM-5（本轮实取） |
| **Cambridge（本轮新增的关键一条）** | **明文把 `look to something` 标错**：`word-patterns-look` 逐字 "When look has an object, the correct preposition to use is **at**. **Don't say 'look something' or 'look to something', say look at something**" → **`look` 和 `to` 直接相邻的写法在上游是被判错的**；**`look forward to` 之所以不算错，是因为 `look forward` 是一个整体，不是 `look` 直接带 `to`** | **CAM-10（本轮复核）** |
| **中文侧** | **用一刀切**：`sense-verbs` 用「**动作是谁做的**」把 `look + 形容词`（东西看起来）与 `look at`（人做动作）分开（`The kid looks happy.` 对 `The kid is looking happily at the photo.`）——**但它不收 `look forward to`**（**该篇全文 `look forward` ＝ 0**） | EC-5（批十九缓存）＋EC-1／EC-2（**本轮直连实取，`look forward to` 单独成篇，与 `look + 形容词` 篇不混**） |
| **BC** | **不给 `look forward to` 任何位置**（三档 68 课零）；`look + 形容词` 也不单开（**只在 A1-A2 第 1 课的形容词＋介词组里以 `similar to` 等形态出现**）；**`look at` 属初级 U113 型「动词＋介词」** | BC-1／BC-2／BC-3（本轮全目复点）＋Murphy 初 U113 |
| **Murphy** | **`look` 在初级 U113 (`listen to…, look at… etc.`) 出现（动作义）**；**`look forward to` 在双册 TOC 全 0**；**唯一相关的中级位是 U62 的 `verb + preposition + -ing` 块** | §1.3 |

**跨源结论**：**四源都不在同一个教学单元里并列 `look` 的「三张脸」**——**Cambridge 分页（按体系）、中文侧一刀（按谁做的）、BC／Murphy 干脆不给 `look forward to` 位置**。→ **我方要做「三张脸同屏」是我方的增量，不是抄来的**（**须诚实标注，不得写「竞品也这么做」**）；**但切法可以从两处抄**：① Cambridge 的「按体系分页」实质就是「**后面跟什么**」不同（分页的判据是体系归属，而体系归属由后续成分决定）；② 中文侧的「**谁做的**」是第二判据。

### 6.3 三条设计准则（**逐条**）

1. **`look` 三张脸必须用「后面跟什么」切，不能用「look 有几种意思」切**：`Look at the clouds!`（后面是「去哪儿看」）／`The sky looks dark.`（后面是「什么样」）／`I'm looking forward to the weekend.`（后面是「盼着的那件事」）。**依据**：Cambridge 分页的实质是体系归属，而体系归属由后续成分决定（§6.2）；**中文侧的第二判据（谁做的）在 `look` 与 `look forward to` 上不管用**（两句的 `look` 都不是「人做的动作」）——**所以三张脸只能按「后面跟什么」切**。
2. **本批必须显式声明与 L127 的分工**：**L127 切的是两张脸（`at` 对 形容词），L134–L138 加第三张（`forward to`）**——**L134 的 oneLineRule 或 deepDive 须引用 L127 的逐字话术**（「第 127 课说过：后面跟的东西不一样，说的就不是一件事」），**并在 L136（切开课）把三句同屏**。
3. **`look like` 本批零扩，且必须遵守新发现的负清单**：**不得写出 `look to something` 作「期待」义**（**Cambridge 明文标错**，§6.2）；**`look like` 只在 L127 认读，本批不引入新句**。**依据**：批二十 §5.1③ 已证三源均不把 `look like` 与 `look forward to` 并列；**本轮新增 Cambridge `word-patterns-look` 的明文禁令，使这条纪律更硬**。

---

## §7 cloze「假友好」的处置建议（**本批最重要的技术复核**）

### 7.1 先校正一个上游口径：**cloze 不是一个引擎，是三个**

批二十 §6.2 序 1 与批二十路线图 §6.2 都写「`I am looking forward to the trip.` 落 `am`／`She looks forward to the weekend.` 落 `looks`，**`forward`／`looking` 永不成空位**」。**本轮把全仓 cloze 生产者穷举后确认：这句话只对其中一个引擎成立，对另外两个不成立**——**而这三个引擎都会在真实学习路径上出题**。

| 引擎 | 文件与函数 | 空位判据 | `forward` 会不会成空位 | 干扰项质量（本轮实测） |
|---|---|---|---|---|
| **A · 关 2 回访问卷**（ambush） | `grammarAmbushService.ts:195` `pickClozeWord` | ① `GRAMMAR_WORDS` 60+ 词表优先（be／助动词／高频谓语动词）；② 退实词（长度≥3、非 `CLOZE_STOP_WORDS`）；③ 兜底第 2 词 | **不会**（档 1 命中在前，`am`／`is`／`are`／`look`／`looks` 都被 `GRAMMAR_WORDS` 收住） | 未评估（选项仅 3 个，另一路径） |
| **B · Boost 选词填空** | `grammarBoostService.ts:261` `buildCloze` ＋ `:249` `keywordIndexes` | 关键词＝**长度≥3 且不在 `FUNCTION_WORDS` 内**；再按 `cloze:${sourceRef}` 种子从中**随机**取一个 | **会**（`forward` 是长度 7 的实词，进关键词池；24 种种子实测出现 `forward`／`looking`／`weekend` 三种空位） | **好**：功能词走同族替换表（`am/is/are`）、实词走 `courseVocabulary` 词池（长度相近的学过的词）——**这是唯一有「真干扰项」设计的引擎** |
| **C · 复习卡（Review）** | `grammarReviewService.ts:304` `contentTokenIndexes` ＋ `:217` `buildClozeOptions` | 实词＝**长度>2 且不在 `STOP_WORDS`（仅 7 词：the/and/but/because/so/a/an）**；按 `reviewCount % 关键词数` **轮转** | **会**（`forward`／`looking`／`seeing`／`weekend` 全在池内，且是**轮转**——**复习次数一多必然轮到**） | **差（本轮的硬发现）**：`buildClozeOptions` 对答案无条件加 `-s/-es/-ed/-ing/-d`，**实测**：`forward` → `["forward","forwards","forwardes","forwarded"]`／`looking` → `["looking","lookings","lookinges","lookinged"]`／`weekend` → `["weekend","weekendes","weekended"]`。**三个干扰项里至少两个不是英语词**（`forwardes`／`lookinges`／`weekendes`）——**与 `grammarBoostService.ts:275-277` 那条 2026-09-19 修正注释（「实测 22% 的 cloze 题有 ≥2 个这种干扰项，用户不懂语法也能一眼排除，题目失去意义」）描述的正是同一个 bug，但它只修了 Boost 引擎，复习引擎未同步修**。 |

### 7.2 处置建议（**四条，按优先级**）

**建议 1（最高优先·与内容无关，纯工程）：复习引擎 C 的干扰项生成器应对齐 Boost 引擎的已修版本。**
- **依据**：`grammarBoostService.ts:273-277` 的修正注释已把病因与口径写死（「只对**动词**做变形……形容词/名词加这些后缀会造出 `coldes`、`nursed` 这类不存在的词」）；**`grammarReviewService.ts:220` 仍是旧的全后缀无条件变形**。
- **本批的具体暴露面**：**`forward`（副词性成分）与 `looking`（-ing 形式）一旦被轮转选中，选项里会出现 `forwardes`／`lookinges` 这类词**——**用户一眼排除，题目白送**。**这不是本批新增的问题，但本批是第一个「targetSentence 里含库外新词＋长 -ing 形式」的批次**，暴露面最大。
- **成本**：**改一处函数（`grammarReviewService.ts:217-236`）**，**可独立于本批内容先行**；**若本批开工前来不及，须登记为「已知降级」并在遥测里单列**。

**建议 2：把考点承载压在 `contrast` 与 `guided.spot` 上，不指望 cloze。**
- **依据**：三个引擎里**只有 B 引擎会把 `forward`／`looking` 挖空**，而 B 引擎的语料池**排除了 `target` 与 `blocks` 来源**（`grammarBoostService.ts:795-797`：`source !== "target" && source !== "blocks"`）——**即 targetSentence 本身永远不进 B 引擎的 cloze 池**。→ **targetSentence 上的考点只能靠 `contrast`／`guided.spot`／`practice` 承载**。
- **本批落地**：**L136（两张脸切开）与 L138（两站收口）必须各带 ≥2 条 `contrast`，且其中至少 1 条的 `wrongMark` 落在「`to` 后面那个词」上**——**这是全批唯一能真正考「名字版」的位置**。
- **可照抄的现成 `guided.spot` 骨架**：**L133 已有 `{ kind: "spot", tokens: ["This","cake","tastes","well."], wrongToken: "well." }`**——**L135／L136 照此形态做「`to` 后面跟错脸」的 spot 题**（如 `tokens: ["I","am","looking","forward","to","see","you."]`，`wrongToken: "see."`，`correctionZh` 落到「后面那件事要换名字版」）。

**建议 3：`object to` 是 cloze 侧的「真友好」样本，可作为本批折入认读的额外理由。**
- **依据**：**三个引擎实测一致**——`I object to it.` 在 A 引擎落**档 2、空位 `object`**（§7.1 A）；在 B 引擎关键词池**只有 `object` 一个**（`it` 是功能词、`to` 被 `FUNCTION_WORDS` 收住）→ **空位必然是 `object`**；在 C 引擎同理（`contentTokenIndexes` 只挑出 `object`）。→ **`object to` 句的空位永远落在 `object` 上，考点自然承载**。
- **处置**：**若 L137／L138 折入 `My mother objects to the colour.`，它在三个引擎里都会把空位落在 `mother`／`objects`／`colour` 上**（**本轮实测 B 引擎 24 种子出现 `colour`／`objects`／`mother` 三种**）——**其中 `objects`（带 s）恰好是本结构的形态考点**。**这是 `object to` 优于 `look forward to` 的唯一技术点，但仍不足以升档**（§3 序 2：语义场景不友好）。

**建议 4：`forward`／`looking` 的「永不成空位」诉求，只对 A 引擎成立；对 B／C 引擎应改为「成空位也是好事，只要干扰项不退化」。**
- **口径说明**：**批二十把「`forward` 永不成空位」当成一条优点在写（「cloze 真友好」的对照）**——**本轮复核认为这个表述要改**：**`forward` 成空位在 B 引擎里是有价值的**（**它考的是「整块记不记得住」**，且 B 引擎干扰项来自真实词池）；**真正的问题不是「它成不成空位」，而是「成空位时选项里有没有 `forwardes`」**（建议 1）。
- **建议的对外表述**：**「`look forward to` 的 cloze 有两种命运：在回访问卷里空位落在 `am`／`look` 上（考的是句子骨架，不考本结构）；在 Boost／复习里空位可能落在 `forward` 上（考的是整块记忆）——两种都不是坏事，但复习引擎的干扰项当前会退化成 `forwardes`，须先修。」**
- **注**：**本批的 `targetSentence` 四字段不进 B 引擎池**（建议 2 的依据），**故 L134–L138 的核心句只受 A 引擎影响**（A 引擎空位落 `am`／`look`／`looks`）——**即核心句的 cloze 一定是「假友好」，这一点无法回避，只能靠建议 2 承载考点。**

---

## §8 口径校正（本批须修正前批结论）

| # | 前批表述 | 本轮实测 | 校正动作 |
|---|---|---|---|
| 1 | 批二十 §1.2 CAM-9／批二十路线图 §6.2：「`Verb patterns` 总索引把 `Look forward to` 与……**并列为 8 个专条之一**」 | **本轮逐条抽出＝11 条**：`Hate, like, love and prefer`／`Hear, see, etc. + object + infinitive or -ing`／`Help somebody (to) do`／**`Look forward to`**／`Stop + -ing form or to-infinitive`／`Verb patterns: verb + infinitive or verb + -ing?`／`Verb patterns: verb + that-clause`／`Verb patterns: with and without objects`／`Would like`／`Would rather, would sooner`。**其中前 5 条是「具名专条」，后 6 条是「通用条目」（含 `Verb patterns:` 前缀的框架条目）** | **改写为**：「**`Verb patterns` 索引共 11 条；`Look forward to` 是其中 5 个具名专条之一**」。**「8 专条」不引**；**引用时的正确说法是「它在具名专条之列」** |
| 2 | 批二十 §6.2 序 1／批二十路线图 §6.2：「`forward`／`looking` **永不成空位**」 | **本轮穷举全仓 cloze 生产者：共 3 个引擎**。**只有 A 引擎（关 2 回访问卷）成立**；**B 引擎（Boost）与 C 引擎（复习卡）都会把 `forward`／`looking` 挖空**（B：24 种种子实测出现 `forward`／`looking`／`weekend`；C：按 `reviewCount % 关键词数` **轮转**，必然轮到） | **改写为**：「**`forward`／`looking` 在关 2 回访问卷里不成空位；在 Boost 与复习卡里会成空位**」——**并附 §7 建议 4 的处置口径**（成空位不是坏事，复习引擎的退化干扰项才是问题） |
| 3 | 批二十 §1.5：「`have sth done` 我方复跑 `will have` 0／`haircut` 0／`repaired` 0／`had my` 0／`cut` 0／`checked` 0／`fixed` 0」 | **本轮逐词复算，七词全 0，与批二十一致**；**但复跑时发现 `have my` GL 1／HC 0**（**与 `had my` 是不同词，`had my` 本轮仍 0**） | **口径无变化**；**补记一条**：**`have my` 有 1 处（GL）**，**性质待生产期确认**（**不改变「零词架」判定**——1 处不足以构成垫子） |
| 4 | 批二十 §1.4 中文侧：「两篇本轮全部直连 HTTP 200 实取原文」 | **本轮再次直连 HTTP 200，两篇内容与批二十所记逐字一致**（`look-forward-to` 96,285 bytes／`look-forward-to-2` 95,150 bytes；正文长度 6,337／6,050 字符） | **维持原文级**；**无校正**（**本轮属「复核确认」，非新增**） |
| 5 | 批二十 §1.3：「`look forward to` 的落点只可能是 **U60 或 U62** 的正文内举例」 | **本轮确认中级册 `-ing`／`to` 家族是一个 16 课连续块（U53–U68）**，其中「介词 + -ing」三课（**U60–U62**）连续；**U61 是 `be/get used to`（批十八）**，**U62 标题内举例是 `succeed in`／`insist on`** | **补精**：**`look forward to` 的 Murphy 依据应写「与批十八 U61 同一个三课连续块（U60–U62）内的 U62 形态」**——**「相邻单元」本身即「同族」的第二条教材级证据**（第一条是 Cambridge `To` 页同句列举） |
| 6 | 批十九／批二十：BC「三档 68 课零课位」 | **本轮三档全目全部重新复点（A1-A2 直连 18／B1-B2 直连 36／C1 Wayback 落盘 14）**，**零课位成立** | **维持**；**新增一条 BC 正文级证据**（参考层 `-ing forms` 的 "As the object of a preposition" 小节）——**须在对外表述里补上，因为它把「BC 侧规则落点」从一处变两处** |
| 7 | 批二十 §5.1③：「三源都不把 `look like` 与 `look forward to` 并列」 | **本轮新增第四条依据**：Cambridge **`word-patterns-look` 明文禁 `look to something`**（"Don't say 'look something' or 'look to something', say look at something"） | **强化**：**本批不得写 `look to something` 作「期待」义**；**`look forward to` 必须整体出现**（**负清单第 1 条**） |
| 8 | （前批未记）**`look forward to` 在 `prepositional-verbs` 页里到底属哪一类** | **本轮确认：两张词表都收它**——`Prepositional verbs` 表（15 条中含它）＋`Phrasal-prepositional verbs` 表（13 条中含它）；**两张表的示范句分别是 `We look forward to meeting you on the 22nd. (anticipate with pleasure)` 与页末 `See also: Look forward to`** | **新增为「上游归类摇摆」的口径**：**对外不得写「Cambridge 把 `look forward to` 定性为介词动词」**，**应写「它同时被列入介词动词与短语介词动词两张表」**——**这也解释了为什么我方不必纠结它的分类（零术语红线里根本没有这些类别名）** |
| **9** | 批二十竞析 §2／§3／§4.4／§4.5／附录 A 及批二十路线图 §6.2 序 1 前置①：「`forward`／`forwards`／`looking forward` **两文件全 0**」「零底座」「`forward` 是**唯一不可替代成分**」 | **本轮复算（快照时点 2026-09-19 20:52 之后）：`forward` GL 2／HC 0**——**两处全在 L133（批二十收口课）内**：`examples` 第 4 条 `{ en: "I am looking forward to the weekend.", zh: "我盼着周末。（认读一句，混个脸熟）" }` ＋ `contrast` ⑥ 的 `wrong: "I am looking forward to the weekend."`；**`forwards` 0／`look forward` 0／`looking forward` GL 2**（同两处） | **改写为**：**「`forward` GL 2／HC 0，两处均为 L133 的认读种子位（不进练习、不作错项），属『面熟』不属『已教』」**——**「零底座」改为「假底座」**；**「两文件全 0」不再引用**。**性质判定：这不是批二十一新增的内容，是批二十交付物本身**（**它的存在正说明 L133 的种子位已按计划落地**）；**下游引用时必须用「GL 2」这个数，不得沿用「全 0」** |
| **10** | 批二十竞析 §1.5／§7 等处的 `handles`：我方 `looking` 计数 | **本轮复算 `looking` GL 17／HC 0**（**批二十记 `looking` 未单列，其他文档曾出现 15**）；**`look` 有两个口径须区分：词边界法 174／全文出现 378**（**后者含 `looking`／`looks` 等的子串**） | **新增口径说明**：**引用 `look` 时必须标口径**（**词边界 174 对 `looks` 186 是同级可比；378 是含子串的全文计数，不可与 186 并列**）——**批二十 §1.3 记「`look` 命中 151 处」用的是第三种口径（L125 起始行起的区间计数），本报告不引** |

---

## §9 复核来源清单 ＋ 未核实声明

### 9.1 本轮实读源清单

**上游交付物（3 份，本轮实读）**：`roadmap-grammar-twentieth-batch-2026-09-19.md`（**§1.2 选题裁决「推迟到批二十一」／§6.2 批二十一候补清单序 1 及三条硬前置／附录 §7 未核实 12 条**，逐节实读）·`competitive-analysis-grammar-twentieth-batch-2026-09-19.md`（批二十竞析，**§0／§1.1–1.5／§2／§3／§4／§5／§6／§7／§8／附录 A／附录 B**，逐节实读，作为转述级基线）·`competitive-analysis-grammar-eighteenth-batch-2026-09-19.md`（批十八竞析，`be/get used to` 基线）。

**代码／数据（本轮独立复核，实读＋复算＋两个自写模拟器）**：
- `src/data/grammarLessons.ts`（**25,140 行／133 课**，`lesson-(\d+)-` 边界法复算；逐课抽取 L119–L133 的 `title`／`grammarLabel`／`targetSentence`／`oneLineRule`；38 个候选词 regex ＋ 词边界双口径复算）
- `src/data/huntCases.ts`（**7,962 行／142 案**，`id: "hunt-..."` 复算；`hunt-five-senses` 逐字实读）
- `src/data/grammarSeasons.ts`（**20 季**，末项 `season-20 {128,133}`）
- `src/pages/GrammarPathPage.tsx`（`:270` **m22 `afterLesson: 133`**；m20 = 124／m21 = 127 逐条核对）
- `src/data/grammarZeroTerms.ts`（**29 词**，逐字实读，含「形容词」「副词」「介词」「宾语」）
- **`src/services/grammarAmbushService.ts`**（`:160-187` `GRAMMAR_WORDS` 60+ 词表／`:190-193` `CLOZE_STOP_WORDS` 31 词／`:195-212` `pickClozeWord` 三档逻辑／`:230-254` `buildRevisitQuiz` 轮换规则——**逐行实读＋本地复跑 18 句**）
- **`src/services/grammarBoostService.ts`**（`:239-257` `keywordIndexes`／`:261-385` `buildCloze`＋干扰项四类策略／`:508-509` `boostSourceRef` 种子格式／`:795-800` 语料池排除 `target` 与 `blocks`——**逐行实读＋本地复跑 17 句 × 24 种子**）
- **`src/services/grammarReviewService.ts`**（`:182` `STOP_WORDS` **仅 7 词**／`:205-214` `contentTokenIndexes`／`:217-236` `buildClozeOptions`／`:304-317` 按 `reviewCount % 关键词数` 轮转——**逐行实读＋本地复跑干扰项生成**）

**外部源（本轮新取／当场复取 7 页；沿用缓存 9 页）**：

| 源 | 页面 | 取法 | 落盘／结果 |
|---|---|---|---|
| BC | A1-A2 索引 **18 课全目** | **WebFetch 直连** | 逐条抽出（18 条，无 `look forward to`） |
| BC | B1-B2 索引 **36 课全目** | **WebFetch 直连**＋本机存档逐条比对 | 逐条抽出（36 条，无 `look forward to`） |
| BC | C1 索引 **14 课全目** | **Wayback curl 200** | `/tmp/bc_c1_wb.html`（149,745 bytes）——14 条逐条抽出 |
| BC | `b1-b2-grammar/verbs-and-prepositions` | **WebFetch 直连** | `to` 组五条组合＋规则句逐字；`look forward` 命中 0 |
| BC | **参考层 `grammar/english-grammar-reference/ing-forms`（本轮新取）** | **WebFetch 直连** | 四节标题＋"As the object of a preposition" 规则句＋评论区两句（`I look forward to hearing…`／`I got used to waking up…`） |
| Cambridge | **`grammar/british-grammar/to`（当场复取）** | **curl 直连 200** | `/tmp/cam_to_live.html`（453,480 bytes）——「同族一句」逐字 |
| Cambridge | **`grammar/british-grammar/look-forward-to`（当场复取）** | **curl 直连 200** | `/tmp/cam_lft_live.html`——两条 ❌ ＋信尾段逐字 |
| Cambridge | **`grammar/british-grammar/word-patterns-look-forward-to`（当场复取）** | **curl 直连 200** | `/tmp/cam_wp_lft_live.html`——`Do not say 'look forward to do something'` 逐字 |
| Cambridge | `dictionary/english/look-forward-to`（当场复取） | **curl 直连 200** | 义项级 B1 `[+ -ing verb]`／B2 信尾逐字 |
| Cambridge | `dictionary/english/object-to`（当场复取） | **curl 直连 200** | collocation 条，无 CEFR；6 例句全为名词短语 |
| Cambridge | **`grammar/british-grammar/object-to`（本轮再次探测）** | **curl 直连 200 但返回 `Say or tell?`** | `/tmp/probe.html`——**该 slug 未登记，二次确认** |
| Cambridge | `grammar/british-grammar/prepositional-verbs`（复核） | 本机缓存 `camg_prepositional-verbs.html` | **两张词表逐条抽出**＋规则句逐字 |
| Cambridge | `grammar/british-grammar/verb-patterns`（复核） | 本机缓存 `camg_verb-patterns.html` | **11 条逐条抽出**（校正「8 专条」） |
| Cambridge | `grammar/british-grammar/word-patterns-look`（本轮新取） | 批二十 curl 落盘，本轮实读 | **`Don't say 'look something' or 'look to something'`** 逐字 |
| Cambridge | `verb-patterns-verb-infinitive-or-verb-ing` 等 4 页 | 本机缓存，regex 复扫 | 各页 `look forward` 命中 2（**全在页脚导航**，正文 0） |
| Cambridge | `have-something-done`／`verb-patterns-with-and-without-objects`／`linking-verbs`／`look`／`look-at-see-or-watch` | 沿用批十九／二十缓存，**本轮未重取** | 见 §9.2 未核实② |
| Murphy | 中级 4th TOC 全目 ＋ **PDF 内嵌流解压** | 本机原件 | `/private/tmp/murphy_int.txt`／`murphy_int.pdf`（**25 streams／264,645 bytes 解压**）——`forward` 0 |
| Murphy | 初级 4th TOC 全目 ＋ **PDF 内嵌流解压** | 本机原件 | `/private/tmp/murphy_ess.txt`／`murphy_ess.pdf`（**57 streams／302,502 bytes 解压**）——`forward` 0 |
| 中文侧 | **`https://english.cool/look-forward-to/`（当场复取）** | **curl 直连 200** | 96,285 bytes；27 处 `look forward`；病灶描述与意象逐字 |
| 中文侧 | **`https://english.cool/look-forward-to-2/`（当场复取）** | **curl 直连 200** | 95,150 bytes；11 处 `look forward`；`look forward to + N/Ving` 逐字 |
| 中文侧 | sitemap 869 条 | 本机缓存 `ec-urls.txt`，regex 复算 | `forward` 命中**恰好两篇**；`object` 家族三篇均无关 |
| Duolingo | — | **本轮未尝试** | **不引数据**（沿用批二十判定） |

### 9.2 未核实声明（**6 条**）

1. **Murphy 单元内部例句仍未核**：双册**只有 TOC 抽文＋PDF 内嵌流**（**非正文**）——**U60／U61／U62 的正文例句、页码、练习量均未核实**；**「`look forward to` 是否出现在 U60 或 U62 的正文里」本轮仍无法回答**。**但本轮已把这个缺口降级**：**「同族」的依据不再依赖 Murphy 正文**——Cambridge `To` 页同句列举（§1.2 CAM-1）与 U61／U62 的相邻关系（§1.3）已各自独立成立。**若生产期需要 Murphy 正文级证据，须人工翻书或另找扫描件。**
2. **BC `adjectives-prepositions`／参考层 `infinitives` 两个 Wayback 存档本轮未重取**（沿用批二十实取，结论无变化）；**Cambridge `have-something-done`／`linking-verbs`／`look`／`look-at-see-or-watch` 四页本轮未重取**（沿用批十九／二十实取缓存）。→ **这些页的引文为「转述级」或「前批原文级，本轮未复核」，不得标为本轮实取。**
3. **中文侧 `object to` 的穷举仍不完整**：sitemap regex **只覆盖 slug 内含 `object` 的三篇**（均无关）；**未探测其他写法**（如「反對」类 slug），**也未使用站内搜索**。→ **「中文侧 `object to` 零专文」的表述仍限「sitemap slug 层面未发现」。**
4. **`look forward to` 的「`object to` 是否在 Cambridge 其他写法下存在」仍未穷举**：本轮探测 `object-to` slug 返回 `Say or tell?`（二次确认未登记），**但未穷举 `object`／`verb-patterns-object` 等替代写法**。→ **「无语法专页」的表述以此为限。**
5. **三个 cloze 引擎的模拟是「本地复刻逻辑」，不是在真实应用里跑**：本轮用自写 mjs 复刻了 `pickClozeWord`（A）／`buildCloze`（B）／`contentTokenIndexes`＋`buildClozeOptions`（C）**三处判定逻辑**，**输入句与种子为构造值**（B 引擎的 `sourceRef` 真实值依赖课程数据，本轮用 6 种来源 × 4 个 index 共 24 种组合近似）。→ **§7 的「空位集合」应读作「可能的空位集合」，不是「某一道具体题的空位」**；**建议 1（复习引擎干扰项退化）的实测结论（`forwardes`／`lookinges`／`weekendes`）是直接调用该函数逻辑得出的，这一条是确定的**。
6. **`forward` 的段位未取到词典义项级 CEFR**：**Cambridge `dictionary/english/forward` 本轮未取**（`look forward to` 是独立词条，已给 B1）；**故「`forward` 这个单词本身属哪一段」本轮无数据**。→ **本批的段位依据一律挂在 `look forward to something` 条（B1／B2），不写「`forward` 是 B1 词」。**
7. **我方快照的时点风险（本轮新暴露）**：**`grammarLessons.ts` 在本轮取证期间发生过一次写入**（复算时 mtime ＝ 2026-09-19 20:52；`git status` ＝ ` M`）——**首轮复算得到 `forward` 0，末轮复算得到 `forward` 2**。→ **本报告全部「我方现状」数字以末轮（变更后）为准**；**但该文件仍可能继续变动**（批二十的收尾工作未提交）。→ **生产期引用前须重跑一次 `forward`／`looking forward`／`object to` 三项核实**；**`git status` 显示该文件 ` M`（未提交）这一状态本身须登记**（**本报告不判断它该不该提交**）。
8. **`looking` 的历史计数口径未穷举**：本轮复算 **GL 17／HC 0**（词边界），**未核对其他文档里出现过的 `looking` 15 是何种口径**（可能是不同时点或不同文件组合）。→ **本报告只引本轮实算值；引用他处数字前须先对齐口径。**

### 9.3 本轮不引的内容（负清单，防下游误用）

- **不引** `look to something` 作「期待」义——**Cambridge `word-patterns-look` 明文标错**（§6.2／§8-7）。
- **不引** EC-1 的**信尾正式度四档**（`I look forward to your reply.` ＞ `Look forward to your reply.` ＞ `I'm looking forward to your reply.` ＞ `Looking forward to your reply.`）——**零基础用户不需要「正式度排序」，且会引入「书信体裁」场景负担**（沿用批二十负清单）。
- **不引** EC-2 的 `expect`／`anticipate` 两个词做教学内容——**`anticipate + Ving` 属同族第三词，超纲**；**只借它的「`look forward to + N/Ving`」形式标注**（沿用批二十负清单）。
- **不引** Cambridge `word-patterns` 102 专条中的其余条目（`avoid doing`／`enjoy doing`／`consider doing`／`be worth doing` 等）作为本批内容——**它们是清单不是结构**（沿用）。
- **不引** `object to` 的 `[ + that clause ] She objected that the price was too high.`——**从句形式超出本批容量**（沿用批二十负清单）。
- **不引** Cambridge `prepositional-verbs` 的 `Phrasal-prepositional verbs` 表里 `look forward to` 那条示范句 `We look forward to meeting you on the 22nd.` 作为**教学内容**（**可作依据引用，但句内 `the 22nd` 是序数日期，属批八已教内容，混入会分散考点**）。
- **不引** Duolingo 任何数据（**本轮未尝试，三次历史尝试全败**）。

---

## 附录 A：批二十一决策清单（供主理人拍板，5 条）

| # | 决策点 | 本轮竞析建议 | 依据 |
|---|---|---|---|
| **A1** | **章量：5 课大章还是 3 课小章** | **5 课大章 L134–L138**（认词／名字版／两张脸切开／否疑／两站收口）。**若必须减 1，砍 L136 不砍 L138** | §4.1 五格逐条（无空格）／§4.3（L138 是全批唯一跨批收口点） |
| **A2** | **`object to` 是否上正课** | **不上正课（维持 C）**；**最多在 L137／L138 折一句认读**（`My mother objects to the colour.`） | §3 序 2（证据仅「同句列举」，无专页无 CEFR；语义场景不友好）；**但 §7 建议 3：它在三个引擎里都真友好** |
| **A3** | **`forward` 造词的处理** | **全批只造 `forward` 一个新词**；**L134 单独占一课并用三块拆解**；**`-ing` 侧优先用库内 `getting up`（GL 47）** | §4.4 六条（新词压缩／单独占第 1 课／造词先算清／新旧比例／档位诚实／反向验证垫子） |
| **A4** | **`look` 三张脸是否同屏** | **同屏**（L136 切开课；`Look at the clouds!`／`The sky looks dark.`／`I'm looking forward to the weekend.`），**并在 L134 预埋与 `look at` 的切开**；**`look like` 零扩** | §6.1 三张脸表／§6.3 三条准则；**负清单：不得写 `look to something`** |
| **A5** | **cloze 假友好的处置** | **① 先修复习引擎 C 的干扰项生成器（对齐 Boost 已修版本）**；**② 考点承载压到 `contrast` 与 `guided.spot`（照 L133 spot 骨架）** | §7.2 四条（建议 1 成本最低、收益最大） |

## 附录 B：本轮关键原文速查（生产可直接引用，逐字）

| 用在哪 | 原文（逐字） | 出处 |
|---|---|---|
| **同族一句列举（本批脊柱·最硬）** | "Some verbs are followed by the preposition **to**, including **be used, get used, listen, look forward, object, reply, respond**: We listened to that CD you lent us. It's great. **I object to your remarks.** The bank hasn't replied to my letter yet." | Cambridge `grammar/british-grammar/to`（**本轮 curl 200 当场复取**） |
| **核心规则句** | "The 'to' in look forward to is a preposition, so we must follow it by a noun phrase or a verb in the **-ing** form" | Cambridge `look-forward-to`（本轮当场复取） |
| **现成 ❌ 1** | "Not: … looking forward to go to Switzerland …" | 同上 |
| **现成 ❌ 2** | "Not: We're looking forward to he arriving next week." | 同上 |
| **Common mistakes 明文** | "**Do not say 'look forward to do something', say look forward to doing something**" ＋ `I look forward to meet you at the conference.`／`I look forward to meeting you at the conference.` | Cambridge `word-patterns-look-forward-to`（本轮当场复取） |
| **词典义项标位** | "**B1** to feel pleased and excited about something that is going to happen… **[ + -ing verb ]** She was looking forward to seeing the grandchildren again." | Cambridge `dictionary/english/look-forward-to`（本轮当场复取） |
| **体系页规则句** | "Prepositional verbs always have an object, which comes immediately after the preposition. **The object can be a noun phrase, a pronoun or the -ing form of a verb**"（**`look forward to` 在两词表内**；示范句 `We look forward to meeting you on the 22nd. (anticipate with pleasure)`） | Cambridge `prepositional-verbs`（本轮复核） |
| **BC 参考层新取** | "**As the object of a preposition**: Some people are not interested in learning English." | BC `english-grammar-reference/ing-forms`（**本轮新取**） |
| **BC 正文规则句（沿用）** | "Remember that **a preposition is followed by a noun or a gerund (-ing form)**." | BC `a1-a2-grammar/adjectives-prepositions`（批二十实取） |
| **中文侧病灶描述** | "很多人一看到 to 就會**反射動作**加上原形動詞，但是 look forward to 的 to 是介系詞，後面如果遇到動詞要加上 ing 才對唷！" | english.cool `look-forward-to`（本轮当场复取） |
| **中文侧意象（L134 造词用）** | "look 為「看」，forward 為「向前地」，to 代表「朝著…」，所以 look forward to 整個意象就會是「**往前面看**」，類似成語所說的**引頸期盼**之意" | 同上 |
| **中文侧形式标注** | "look forward to + N/Ving" | english.cool `look-forward-to-2`（本轮当场复取） |
| **负清单（不得写 `look to`）** | "When look has an object, the correct preposition to use is **at**. **Don't say 'look something' or 'look to something', say look at something**" | Cambridge `word-patterns-look`（本轮实读） |
| **Murphy 相邻单元（同族第二条证据）** | `60 Preposition (in/for/about etc.) + -ing`／`61 be/get used to (I'm used to)`／`62 Verb + preposition + -ing (succeed in -ing / insist on -ing etc.)` | Murphy 中级 4th TOC（本机原件，去空白还原） |
| **cloze 引擎 C 的退化干扰项（工程修复依据）** | `forward` → `["forward","forwards","forwardes","forwarded"]`；`looking` → `["looking","lookings","lookinges","lookinged"]` | `src/services/grammarReviewService.ts:217-236`（**本轮本地复跑**） |
| **cloze 引擎 B 的已修注释（修复口径参照）** | "此前对所有答案无条件加 -s/-es/-ed/-ing 后缀，结果产出 `don'ted`、`shouldn'tes`、`haven'ted` 这类不是英语的"词"——**实测 22% 的 cloze 题有 ≥2 个这种干扰项，用户不懂语法也能一眼排除，题目失去意义**" | `src/services/grammarBoostService.ts:275-277`（本机源码注释） |

---

*报告完。本轮共实读外部源 22 页（当场 200 复取 10／新取 3／沿用缓存 9），复核代码 7 文件（含 3 个 cloze 引擎的本地复刻复跑），口径校正 10 条，未核实 8 条。核心结论：批二十一 `look forward to` 一族的上游证据本轮全部当场复取、逐字一致，B＋ 档维持；「同族」依据由 Cambridge `To` 页同句列举＋Murphy U61／U62 相邻关系双线独立成立；`object to` 维持 C（可折入认读）；三项复核（`have sth done`／形容词＋介词／机制强化）口径零变化；**新增两条重要发现：① 我方底座校正（`forward` 已非全 0，实为 L133 种子位的 2 次面熟，属「假底座」）；② cloze 引擎 C（复习卡）的干扰项生成器退化，须对齐 Boost 已修版本。***
