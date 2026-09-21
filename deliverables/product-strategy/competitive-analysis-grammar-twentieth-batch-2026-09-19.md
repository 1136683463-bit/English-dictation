# 竞品分析：第二十批课程候补（L128 起）· 竞析报告

| 字段 | 值 |
|---|---|
| 报告 | 竞品分析（竞析）· 语法线「小美的一天」第二十批 |
| 日期 | 2026-09-19 |
| 轮次 | 第二十批（批十九 L125–L127 交付后） |
| 上游输入 | `roadmap-grammar-nineteenth-batch-2026-09-19.md` §6.2／§7／§5-6（**实读**）· `competitive-analysis-grammar-nineteenth-batch-2026-09-19.md`（批十九竞析，**逐节实读**，转述级基线）· `competitive-analysis-grammar-eighteenth-batch-2026-09-19.md`（批十八竞析，**§1.1–1.4／§2／§8 实读**） |
| 我方快照 | `src/data/grammarLessons.ts`（**23,980 行／127 课**，逐词 regex 复算）· `src/data/huntCases.ts`（**7,697 行／136 案**，逐词复算）· `src/data/grammarSeasons.ts`（**19 季，末项 season-19 {125,127}**）· `src/pages/GrammarPathPage.tsx`（`:262` m21 `afterLesson: 127`）· `src/data/grammarZeroTerms.ts`（**29 词**，含「形容词」「副词」「介词」）· `src/services/grammarAmbushService.ts`（`:160-187` 词表，`look`／`looks` 在、五词其余不在） |
| 本轮范围 | ① `look forward to`／`object to` 一族 **原文级取证**；② 感官动词五词**跨源复核**；③ `have sth done`／形容词＋介词**复核**；④「小章之后回大章还是继续小章」竞品形态意见 |

---

## §0 本轮结论速览（8 条，先读这里）

1. **`look forward to` 本轮拿到「四源全齐」的原文级证据，且比批十九路线图 §6.2 记的更多两条**：① Cambridge 语法页 `Look forward to`（沿用批十八实取，本轮逐字复取）；② **Cambridge 新增 `Word patterns: look forward to`（Common mistakes 类，本轮首次取到，明文 `Do not say 'look forward to do something', say look forward to doing something`＋错例 `I look forward to meet you at the conference.`）**；③ **Cambridge 词典页 `look forward to something` 义项级 CEFR ＝ B1（`[+ -ing verb]`）／B2（正式信尾）**，**这是本候选第一次拿到「词典义项级 CEFR 标位」——批十八只记「无 CEFR」**；④ **Cambridge `Verb patterns` 总索引页把 `Look forward to` 与 `Hate/like/love/prefer`／`Hear, see, etc. + object + infinitive or -ing`／`Help somebody (to) do`／`Stop + -ing form or to-infinitive` 并列为 8 个专条之一**（**这是本章「to + -ing 第二族」最硬的课位级证据**）。
2. **`object to` 本轮首次实取原文**（批十八未做）：Cambridge 词典页 `object to someone/something` 是**搭配条（collocation）**，**无 CEFR 标位**（义项级与 `object` 名词条同页，动词 (OPPOSE) 义只在美式 Academic 词典里给 `[ I ] I don't think anyone will object to leaving early.`）；**语法页 `object-to` 不存在**（直连返回的是 `Say or tell?`，即该 slug 未登记，页面侧栏也无该条）。**`object to` 比 `look forward to` 少一整层证据**（词典搭配条 vs 词典义项条＋语法专页＋Common mistakes 专页＋Verb patterns 总索引条目）。
3. **Murphy 双册 TOC 原件本轮逐字复算：`forward` ＝ 0／0（初、中两册全 0）**；「`look forward to` 在 Murphy 中级册内」**这一说法在本机原件上无法证实**——中级 U60／61／62 标题逐字为 `60 Preposition (in/for/about etc.) + -ing`／**`61 be/get used to (I'm used to)`**／`62 Verb + preposition + -ing (succeed in -ing / insist on -ing etc.)`，**U62 的标题内举例是 `succeed in` 与 `insist on`，不是 `look forward to`**；初级册 U112 `afraid of…, good at… etc. of/at/for etc. (prepositions) + -ing` 与 U113 `listen to…, look at… etc. (verb + preposition)` **是 `to + -ing` 家族的小学段课位，但标题里没有 `look forward to`**。→ **须口径校正：写「Murphy 中级 U62 是 `verb + preposition + -ing` 单元（标题内举例 succeed in／insist on），`look forward to` 未见于双册 TOC 抽文」。**
4. **BC 三档 68 课全目本轮全部复点，`look forward to`／`object to` 课位仍是零**；**B1-B2 唯一的近邻课 `Verbs and prepositions`（第 34 课）本轮实取原文——它明确不列 `look forward to`、不列 `object to`、且「不讲 -ing 规则」**（原文："There are no grammatical rules to help you know which preposition is used with which verb"）。**新发现的教材级落点在 A1-A2 段**：A1-A2 第 1 课 `Adjectives and prepositions` 有逐字规则句 "**Remember that a preposition is followed by a noun or a gerund (-ing form).**"——**这是 BC 侧「介词后接 -ing」的唯一原文级规则句，位于 A1-A2 段**（我方以此作为「`to` 后接 -ing」的教材级背书）。
5. **中文侧两篇本轮全部直连 HTTP 200 实取原文**（批十八是缓存）：`look-forward-to` 给出**最直接的病灶描述**——"很多人一看到 to 就會反射動作加上原形動詞，但是 look forward to 的 to 是介系詞，後面如果遇到動詞要加上 ing 才對唷"＋**首屏自测对**（`I look forward to visit you tomorrow. ❌` 对 `I look forward to visiting you tomorrow. ⭕️`）；`look-forward-to-2` 是「期待」三词辨析（`look forward to`／`expect`／`anticipate`），**明文 `look forward to + N/Ving`**。**两篇全在 869 条 sitemap 内（本轮 regex 复算）**。
6. **感官动词五词：`look` 已被批十九占用，不应算作家族第五个成员；剩余四词撑不起一个章。** 证据：① **BC `stative-verbs` 表含 `feel`／`look`／`smell`／`taste`、不含 `sound`**（本轮 Wayback 复取一致）；② **Cambridge 词典义项 CEFR 阶梯＝`feel` A1／`sound` A2／`smell` B1／`taste` B1**（**四词三档，不存在同一段位**）；③ **Murphy 双册 TOC 五词全 0**；④ **我方 `sound`／`smells`／`tastes`／`feels`／`felt` 课＋案两文件全 0**；⑤ `feel` 27 处**逐行复算＝L76 占 22 处、L78 占 5 处**（**全部是 `I feel much better today.` 同一句及其题目回显**，见 §6.3 口径校正——批十九记「全在 L76 同一句」不完整）。→ **判：四词大章不成立；能做的最大自然容量＝2–3 课小章，且须同步造 `sound`／`smell`／`taste` 底座。**
7. **`have sth done`／形容词＋介词：两轮口径均无变化**（详见 §1.5／§7）。**形容词＋介词本轮实测 `good at` GL 52／HC 6**（**与批十九路线图记的「raw 48」不同，属计数口径差异**——批十九记 GL 52＋HC 6 与「48 处」两处并存，本轮以 **GL 52／HC 6** 为准并标注差异）；`interested in`／`afraid of`／`similar to`／`proud of`／`worried about`／`full of`／`keen on`／`familiar with` **两文件全 0**（复核一致）。`have sth done` 招牌句零件本轮复跑仍全 0（`will have` 0／`haircut` 0／`repaired` 0／`had my` 0／`cut` 0／`checked` 0／`fixed` 0，两文件）。
8. **「小章之后回大章还是继续小章」——竞品侧无「章节大小交替」的形态先例可抄，但我方有可用的替代原则**：**BC 全部是单点课（无章概念）**、**Murphy 是固定单元号顺序（无章）**、**Duolingo 是功能话题单元（无章，且本轮三次尝试仍全败，不引数据）**。→ **上游形态给不了「交替」背书**；**唯一可用的原则是「内容自然容量决定章长」**（见 §4.4）。**建议批二十取大章并明写「这是内容容量决定的，不是节奏调节」。**

---

## §1 复核结果：逐源列出取到／未取到的页面与要点

### 1.1 British Council LearnEnglish（BC）

| # | 页面 | 取到情况 | CEFR 段位 | 本轮要点（原文级／逐条） |
|---|---|---|---|---|
| BC-1 | A1-A2 索引 **18 课全目** | ✅ **本轮直连实取**（WebFetch 逐条） | **A1-A2** | 18 课原序：`Adjectives and prepositions`／`Adjectives ending in '-ed' and '-ing'`／`Articles: 'a', 'an', 'the'`／`Articles: 'the' or no article`／`Comparative adjectives`／`Infinitive of purpose`／`Nouns: countable and uncountable`／`Past continuous and past simple`／`Possessive 's`／`Prepositions of place…`／`Prepositions of time…`／`Present simple`／`Present simple: 'have got'`／`Present simple: 'to be'`／`Quantifiers…`／`Question forms`／`Using 'there is' and 'there are'`／`Verbs followed by '-ing' or infinitive`。→ **`look forward to` 零／`object to` 零／`verb + preposition` 零**（本轮直连复点，与批十九一致） |
| BC-2 | A1-A2 第 1 课 `adjectives-prepositions`（**本轮新取正文**，Wayback 存档 `20260421105742`） | ✅ **本轮实取原文** | **A1 Elementary / A2 Pre-intermediate** | **本轮 BC 侧最有价值的新取原文**：规则句逐字 "**Remember that a preposition is followed by a noun or a gerund (-ing form).**"；分组原文：`With at`（good/bad/amazing/brilliant/terrible→skills，`I'm not very good at drawing.`）／`With about`（angry/excited/happy/nervous/sad/stressed/worried）／`With of`（**`She was afraid of telling her mum.`／`I'm frightened of having an accident.`／`He's scared of flying.`**——**三句全是「介词 + -ing」的活例**）／`With to`（`He's married to the director.`／`I'm addicted to my phone.`／`It's similar to the old one.`）／`With for`／`With in`。→ **这是 BC 侧「`to`／`of`／`about` 后面遇到动词要换 -ing」的唯一规则级原文**；**但它的落点是「形容词 + 介词」，不是 `look forward to`**（**注意：`to` 组给的例子全是名词短语，无一条 `to + -ing`**） |
| BC-3 | B1-B2 索引 **36 课全目** | ✅ **双通道复点**（本机存档 `bc-b1b2-new.html` 逐条＋Wayback `20260421095441` WebFetch 逐条，**两份一致**） | **B1 Intermediate ＋ B2 Upper intermediate** | 36 课原序（两次一致）：…`Different uses of 'used to'`／…／**`Stative verbs`**／…／**`Verbs and prepositions`**／**`Verbs followed by '-ing' or infinitive to change meaning`**／`Wishes: 'wish' and 'if only'`。→ **`look forward to` 课零／`object to` 课零／`verb + preposition + -ing` 专课零**（**最近邻＝第 34 课 `Verbs and prepositions` 与第 35 课 `Verbs followed by '-ing' or infinitive to change meaning`**） |
| BC-4 | C1 索引 **14 课全目** | ✅ **本轮 Wayback WebFetch 取到全目** | **C1 Advanced** | 14 课原序：`Advanced passives review`／`Advanced present simple and continuous`／`Avoiding repetition in a text`／`Contrasting ideas`／`Ellipsis`／`Emphasis: cleft sentences, inversion and auxiliaries`／`Inversion after negative adverbials`／`Inversion and conditionals`／`Modals: probability`／`Participle clauses`／`Patterns with reporting verbs`／`Possession and noun modifiers`／`Unreal time`／`Word order in phrasal verbs`。→ **三项均零**（**与批十九记录逐条一致**，C1 缺口维持已补状态） |
| BC-5 | `b1-b2-grammar/verbs-and-prepositions`（**§6.2 明确要求复核**） | ✅ **本轮双通道实取**（直连 403 → WebFetch 原文；Wayback 快照二次复核，两份要点一致） | **B1 - Intermediate** | **规则原文**："When a verb is part of a longer sentence, it is often followed by a specific preposition."／"**There are no grammatical rules to help you know which preposition is used with which verb**"（建议整组记）。**全目组合逐条**：`for`＝wait for／apologised for／applied for／ask for／prepare for；`from`＝protect from／recovered from／saved from／suffer from；`in`＝believe in／specialises in／**succeed in**；`of`＝approve of／died of／smells of；`on`＝depend on／based on／concentrate on／relying on／agree on；**`to`＝listening to／introduce to／refer to／responded to／apologised to**；`with`＝agree with／provide with／deal with。→ **明文不列 `look forward to`、不列 `object to`**；**「to」组的五个组合全无 `look forward to`**；**页面不教「介词后接 -ing」规则**（它只在例句里出现 `apologised for being late`／`protect you from getting burnt`／`saved someone from drowning`）。**结论：批十八／十九「BC `Verbs and prepositions` 不含 `look forward to`」本轮逐条复核成立，无口径变化。** |
| BC-6 | `b1-b2-grammar/stative-verbs` | ✅ **本轮 Wayback 复取原文** | **B1 Intermediate / B2 Upper intermediate** | 规则逐字："Stative verbs describe a state rather than an action. They aren't usually used in the present continuous form."；**主表逐条**：agree／believe／doubt／guess／imagine／know／mean／recognise／remember／suspect／think／understand／dislike／hate／like／love／prefer／want／wish／appear／be／**feel**／hear／**look**／see／seem／**smell**／**taste**／belong／have／measure／own／possess／weigh；**「sometimes stative」小表**另列 agree／appear／doubt／**feel**／guess／hear／imagine／**look**／measure／remember／**smell**／weigh／wish。→ **`sound` 两表都不在**（复核批十九一致）；**`look` 与 `feel` 都在**（**但这不是 `look + 形容词` 的课位证据**，是「不用进行时」的用法页） |
| BC-7 | `a1-a2-grammar` 第 18 课 `verbs-followed-ing-or-infinitive` | ✅ **本轮 Wayback 存档实取原文**（`20260421105742`，落盘 `bca_verbs_ing.html`） | **A1 Elementary / A2 Pre-intermediate** | 直连 404，存档取到。规则原文："A verb can be followed by another verb. The second one usually needs to change into the **-ing form** or the **to + infinitive** form. Which form you need depends on what the first verb is."；`-ing` 组：enjoy／admit／mind（＋avoid／can't help／consider／dislike／feel like／finish／give up／miss／practise／suggest）＋`like`／`love` 两者皆可；`to + infinitive` 组：want／learn／offer（＋afford／agree／ask／choose／decide／expect／hope／plan／prepare／promise／refuse／would like）。→ **明文不出现 `look forward to`、不出现 `preposition`**（本轮 regex 复算＝0／0）。**课位在 A1-A2（不是 B1-B2），这是 A2 段「动词后接什么」的官方课** |
| BC-8 | 参考层 `infinitives`（`'to'-infinitives`） | ✅ 本机存档（Wayback 2024-09-10，`bc-inf.html`／`bc-inf.txt`） | beginner＋intermediate＋advanced 三档同页 | **本轮在评论区取到 LearnEnglish 团队的规则级原文（值极高）**：**"if 'to' were a preposition, then the form after it would have to be an '-ing' form (\*'an opportunity to escaping') because prepositions require subsequent verb forms to be in the '-ing' form in English. This is one of the few rules that has no exceptions in English!"**（Kirk 老师，2022-08-10）＋另一条 "**'to' and 'towards' are prepositions here and so a verb following them goes in the '-ing' form**"（2023-11-14）。→ **这是「`to` 后接 -ing」在 BC 侧的规则级英文表述**（**注意：是评论区，不是正文；引用时须标「BC 参考层评论区·LearnEnglish Team 回复」**） |
| BC-9 | `b1-b2-grammar/using-as-and-like`（`look like` 上游） | ⚠️ **沿用批十八／十九实读缓存**（本轮未重取，见 §8 未核实②） | **B1＋B2** | `He looks like his dad.`／`She looks like her mother.`／`He looks as if he hasn't slept.` → **`look like` 仍在 B1 段，维持认读口径** |

**BC 小结**：`look forward to`／`object to` **三档 68 课零课程位**（三份全目本轮**全部完整复点**）；**B1-B2 最近邻课 `Verbs and prepositions` 明文不收 `look forward to`／`object to`，且不教 -ing 规则**；**「介词/`to` 后接 -ing」的规则级原文本轮在两个地方取到**——A1-A2 第 1 课正文（"a preposition is followed by a noun or a gerund (-ing form)"）与参考层评论区（"prepositions require subsequent verb forms to be in the '-ing' form… no exceptions"）。→ **下游对外一律写「BC 无课位；教材级规则只在 A1-A2 的形容词＋介词课与参考层出现」。**

### 1.2 Cambridge Dictionary（Cambridge）

| # | 页面 | 取到情况 | CEFR 标签 | 本轮要点（**原文级**） |
|---|---|---|---|---|
| CAM-1 | `grammar/british-grammar/look-forward-to` | ✅ **双通道**：批十八缓存 `b18_cam_lookfwd.html`（md5 `5b564d4afba6dcc60e4091ae9d49dd8c`）**逐字复核**＋本轮再次取到等价内容 | **无 CEFR 标签** | **逐字原文（§6.2 要求的整句）**："Look forward to something means to be pleased or excited that it is going to happen. **The 'to' in look forward to is a preposition, so we must follow it by a noun phrase or a verb in the -ing form**: `I'm looking forward to the holidays.` … `We're looking forward to going to Switzerland next month.` **Not: … looking forward to go to Switzerland …**"；**第二条 ❌（本轮新记）**："If the second verb has a different subject, we use the **object form of the pronoun**, not the subject form: `We're looking forward to him arriving next week.` **Not: `We're looking forward to he arriving next week.`**"；**信尾用法**："We also use look forward to at the end of formal letters… We use the **present simple** form: `I look forward to your reply.`／`I look forward to hearing from you soon.`／`We look forward to receiving payment…`"。→ **两条现成 ❌ 素材（`to go`❌／`he arriving`❌）**，**是本章最硬的错卡来源** |
| CAM-2 | **`grammar/british-grammar/word-patterns-look-forward-to`**（**本轮首次发现并实取，批十八／十九均未记**） | ✅ **本轮 curl 直连 HTTP 200**（落盘 `camw_word-patterns-look-forward-to.html`，md5 `52f1cdd5e2acdbaecaadd575bb9fdfd3`） | **无 CEFR 标签** | **逐字原文**："When look forward to is followed by a verb, that verb should be in the **-ing** form. **Do not say 'look forward to do something', say look forward to doing something.** `I look forward to meet you at the conference.`／`I look forward to meeting you at the conference.`" → **这是「Common mistakes in English → Word patterns」类下的专条，标题级条目（不是正文段落）**；**证据等级与语法页并列，构成「双专页」** |
| CAM-3 | **`grammar/british-grammar/word-patterns` 总索引**（**本轮首次实取**） | ✅ **本轮 curl 直连 HTTP 200**（落盘 `camw_index.html`，md5 `9595526009e9bcf6035caddf45cc4d95`） | **无 CEFR 标签** | 全文："Word patterns — Some words need to be followed by prepositions, objects, or particular verb forms. It is not always easy to know which words follow which patterns."；**102 条 word-patterns 专条全目**（本轮完整抽出），其中与「`-ing` 家族」相关的条目逐条：`avoid doing something`／`be worth doing something`／`consider doing something`／`enjoy doing something`／`have difficulty doing something`／**`look forward to`**／`stop doing something or stop to do something?`／`succeed`／`think of doing something`／`would appreciate`。→ **`look forward to` 在 Cambridge 是「词条级单列」** |
| CAM-4 | `grammar/british-grammar/word-patterns-succeed`（**本轮新取，用作同族对照**） | ✅ curl 直连 200 | 无 CEFR | 逐字："**Succeed is usually followed by the preposition in.** Don't say 'succeed something', say succeed in something: `I hope you will succeed your new job.`／`I hope you will succeed in your new job.` **When succeed in is followed by a verb, that verb is usually in the -ing form**: Don't say 'succeed to do something' or 'succeed doing something', say **succeed in doing something**: `They finally succeeded in catching the killer.`" → **同族第二成员的完整现成素材**（若批二十要做「一族」而非单点，这是可并列的第二条） |
| CAM-5 | `grammar/british-grammar/word-patterns-think-of-doing-something`（**本轮新取**） | ✅ curl 直连 200 | 无 CEFR | 逐字："When talking about deciding to do something, think is usually followed by **of/about and the -ing form**. Don't say 'think to do something', say think about/of doing something: `I'm thinking to have my hair cut short.`／`I'm thinking about having my hair cut short.`" → **同族第三成员**（**注意：这条的错例同时是 `have sth done` 的句子——两候选在此页交汇，见 §7 口径校正**） |
| CAM-6 | **`dictionary/english/look-forward-to`**（**本轮首次实取词典页**，批十八／十九只记语法页） | ✅ **本轮 curl 直连 HTTP 200**（落盘 `camd_look-forward-to.html`，md5 `6cd4485944190941f388379127755d5a`） | **义项级双标位：B1（`to feel pleased and excited about something that is going to happen`）／B2（正式信尾）** | **逐字原文**：`look forward to something` 词条下 **`B1 to feel pleased and excited about something that is going to happen: I'm really looking forward to my holiday. [ + -ing verb ] She was looking forward to seeing the grandchildren again.`**；**`B2 [ + -ing verb ] formal used at the end of a formal letter…: look forward to hearing from you／I look forward to hearing from you.／look forward to receiving something…`**；More examples：`I'm looking forward to seeing Julie.`／`She was looking forward to the meal.`／`I'm not looking forward to the trip.`／`They had looked forward to that holiday for months.`／`I always look forward to seeing my parents.` → **本轮最强的新增证据：`look forward to` 有词典义项级 CEFR ＝ B1（且 `[+ -ing verb]` 是词典给的形式标注）**；**「批次候选首次拿到词典义项标位」（批十九 `look + 形容词` 也是词典义项级，但那是在 `/look` 页的 SEEM 义项下，不是独立词条）** |
| CAM-7 | **`dictionary/english/object-to`**（**本轮首次实取**，批十八／十九未取） | ✅ **本轮 curl 直连 HTTP 200**（落盘 `camd_object-to.html`，md5 见 §8） | **无 CEFR 标位** | 逐字原文（**词条类型＝collocation，不是义项**）：`object to someone/something` **collocation** — "to feel or express opposition to or dislike of something or someone: `His mother objects to his tattoos.`／`We don't object to her personally, but we are upset with the way she was appointed.`"；More examples：`Some people object to the teaching of religion in schools.`／`Many teachers object to these standardized tests…`／`Environmental groups do not object to the pipeline, only its proposed route.`／`Her brothers had never objected to him before.`／`He objects to the label "magician".` → **注意：该页 6 条例句全是「`object to` + 名词短语」，无一条 `object to + -ing`** |
| CAM-8 | `dictionary/english/object`（**本轮新取，用于查 `object to` 的标位与形式）** | ✅ curl 直连 200 | **(OPPOSE) 义在英式主体无 CEFR；只在「Cambridge Academic Content Dictionary」块给 `[ I ] I don't think anyone will object to leaving early.`／`[ + that clause ] She objected that the price was too high.`** | 名词义项标位在：**(THING) B1**／**(GRAMMAR) B1**／**(PURPOSE) C1**。→ **`object to + -ing` 本轮在 Cambridge 只拿到这一条美式学术词典例句（`will object to leaving early`）**；**英式主体未给 (OPPOSE) 义项标位，也未给 `[+ -ing verb]` 标注**。→ **`object to` 的证据强度明显低于 `look forward to`** |
| CAM-9 | **`grammar/british-grammar/verb-patterns`（总索引）**（**本轮首次实取**） | ✅ curl 直连 200（落盘 `camg_verb-patterns.html`，md5 `d094c4b43494bd655cc790bc2e126d09`） | 无 CEFR | 逐字："**Verb patterns** refer to what follows a verb… The meaning of the verb is often in the whole pattern, not just in the verb. Click on a topic to learn more about verb patterns."；**8 个专条全目**：`Hate, like, love and prefer`／`Hear, see, etc. + object + infinitive or -ing`／`Help somebody (to) do`／**`Look forward to`**／`Stop + -ing form or to-infinitive`／`Verb patterns: verb + infinitive or verb + -ing?`／`Verb patterns: verb + that-clause`／`Verb patterns: with and without objects`／`Would like`／`Would rather, would sooner`。→ **`Look forward to` 与 `Hear, see, etc. + object + infinitive or -ing` 并列在同一个索引里（两条都在我方视野内：前者是批二十候选，后者是「感官动词」候选的上游落点）** |
| CAM-10 | **`grammar/british-grammar/prepositional-verbs`**（**本轮首次实取，§6.2 未要求但属关键**） | ✅ curl 直连 200（落盘 `camg_prepositional-verbs.html`，md5 `208f35eb885cdbb12c29bd46d5e35ec7`） | 无 CEFR | **逐字原文**："**Prepositional verbs** have two parts: a verb and a preposition which cannot be separated from each other"，**词表逐条**：break into／cope with／get on／deal with／get off／depend on／go into／lead to／**look forward to**／get over／listen to／look after／look at／look for／do without；**规则句逐字**："**Prepositional verbs always have an object, which comes immediately after the preposition. The object can be a noun phrase, a pronoun or the -ing form of a verb**"，例 `Getting to the final depends on winning the semi-final!` → **「`look forward to` 属 prepositional verb、其后可接 -ing」的上游体系级定位页** |
| CAM-11 | `grammar/british-grammar/verb-patterns-verb-infinitive-or-verb-ing` | ✅ curl 直连 200（**与批十八／十九缓存同一页**） | 无 CEFR | `-ing but not to-infinitive` 词表：admit／deny／finish／mind／avoid／dislike／give up／miss／(can't) help／enjoy／imagine／practise／(can't) stand／fancy／involve／put off／consider／**feel like**／keep (on)／risk；❌ 全带 `Not:` 标签（`I always enjoy cooking. Not: I always enjoy to cook.`）。→ **本轮 regex 复核：全页无 `look forward to`、无 `object to`** |
| CAM-12 | `grammar/british-grammar/verb-patterns-with-and-without-objects` | ✅ curl 直连 200 | 无 CEFR | **`Verbs followed by a direct object and an -ed clause` 节**：词表 feel (oneself)／have／need／find／leave／want／get／like；例 **`I get my car mended locally.`／`They had the whole house repainted.`／`We need everything cleaned and tidied by the end of the day.`** → **`have sth done` 的上游第二落点（本轮复核，口径不变）** |
| CAM-13 | `grammar/british-grammar/have-something-done` | ✅ **本轮复取直连 200**（md5 `bfded7df91e227dbf624bc0f844ae2a3`） | 无 CEFR | 逐字原文无变化："We use **have + object + -ed form** when we talk about someone doing something for us which we ask or instruct them to do. It emphasises the process/action rather than who performs it: `We're having the house painted next week.`"；**明文警告（关键）**："**This pattern is not the same as the present perfect or past perfect.** Compare `I had my hair cut.`＝Someone cut my hair. 对 `I've cut my hair.`／`I'd cut my hair.`／`I cut my own hair.`"；**坏事用法**："when something bad happens… `They've had their car stolen.`／`Hundreds of people had their homes destroyed by the hurricane.`"；**另三节**：`Asking or instructing`（`I'll have Harry book you a taxi.`）／`Talking about an experience`（`We had a man singing to us…`）。→ **复核结论：口径零变化；「同形异义（完成时 vs have sth done）」的警告原文仍在，我方批二十序 2「维持撤出」的依据不变** |
| CAM-14 | `grammar/british-grammar/linking-verbs` | ⚠️ 沿用批十九实取（本轮未重取） | 无 CEFR | 名单：appear／feel／**look**／seem／sound／be／get／remain／smell／taste／become；`This coat feels good.`（adjective phrase） → **`sound` 在此名单内但不在 BC stative 表内（两源不一致，沿用批十九记录）** |
| CAM-15 | `grammar/british-grammar/look`／`look-at-see-or-watch`／`dictionary/english/look` | ⚠️ 沿用批十九实取（本轮未重取） | look (SEEM)＝**A2** | `Look as a linking verb` 专节／`Not: Look the rain.` → **批十九首课的骨架来源，本轮不重取** |

**Cambridge 小结（本轮新增三页，全部与 `look forward to` 直接相关）**：**① `Word patterns: look forward to`（Common mistakes 专条，明文 `Do not say 'look forward to do something'`）；② `dictionary/english/look-forward-to`（词典义项级 **B1**＋`[+ -ing verb]`＋B2 信尾；**这是本候选第一次拿到词典级 CEFR 标位**）；③ `prepositional-verbs`（`look forward to` 在词表内＋"The object can be a noun phrase, a pronoun or **the -ing form** of a verb"）。**→ `look forward to` 的证据链本轮从「一页语法页」升级为「**四条独立页面 ＋ 词典义项级 CEFR**」。`object to` 的链条则是「一条搭配条（无 CEFR）＋一条美式学术词典例句」，**两者不可同档表述**。

### 1.3 Murphy（本机官方 TOC 原件）

**取到情况**：`/private/tmp/murphy_int.txt`（中级 4th TOC 抽文）·`/private/tmp/murphy_ess.txt`（初级 4th TOC 抽文）·`/private/tmp/murphy_full.txt`（中级全目块）·`/private/tmp/murphy_toc_clean.txt`（双册去空白＋分节）。PDF 内嵌流已解压复核（`murphy_ess.pdf` 57 streams／311KB、`murphy_int.pdf` 50 streams／330KB），**`forward`／`object` 在两册 PDF 全文中均为 0**（逐字节复算）。**仍为官方 TOC 抽文，非正文**（见 §8 未核实①）。

| 项 | 本轮逐字复核结果 |
|---|---|
| **`look forward to`（本轮重点）** | **`forward` ＝ 初级 0／中级 0**（去空白后 regex 复算；PDF 流二次验证＝0／0）。→ **「Murphy 中级册内有 `look forward to` 单元」在本机原件上无法证实**；**§7 记口径校正** |
| **中级 U60** | 标题逐字（去空白）：`60Preposition(in/for/aboutetc.)+-ing` → 还原＝**`60 Preposition (in/for/about etc.) + -ing`**——**「介词 + -ing」的中级总课位**，**位于 U61 之前、U59（prefer/would rather）之后** |
| **中级 U61** | `61 be/get used to (I'm used to)`——**批十八 L119–L124 已教**（我方 6 课），**本轮复核单元号与标题无误**（**与 U60／U62 相邻，三课构成 `介词+-ing` 连续块**） |
| **中级 U62** | 标题逐字：`62Verb+preposition+-ing(succeedin-ing/insiston-ingetc.)` → 还原＝**`62 Verb + preposition + -ing (succeed in -ing / insist on -ing etc.)`**——**标题内举例是 `succeed in`／`insist on`，不是 `look forward to`**。→ **`to + -ing` 家族在中级册有连续三课（U60／U61／U62），`look forward to` 的落点只可能是 U60 或 U62 的正文内举例（未核）** |
| **中级 U65／66／67** | `65 Adjective + to…`／**`66 to… (afraid to do) and preposition + -ing (afraid of -ing)`**／`67 see somebody do and see somebody doing`——**U66 是「`to + 原形` 对 `介词 + -ing`」的显式对照单元**（**与 BC-2「`afraid of telling`／`frightened of having`／`scared of flying`」同构**）；**U67 是感官动词的上游落点（`see somebody do/doing`）** |
| **中级 U130／131** | `Adjective + preposition 1/2`——复核批十七／十八／十九，**无变化** |
| **初级册全书** | **`look` 只出现在 U113 `listen to…, look at… etc. (verb + preposition)` 标题里（动作义）**；**U112 ＝ `afraid of…, good at… etc. of/at/for etc. (prepositions) + -ing`**。→ **初级册有 `介词 + -ing` 课位（U112）与 `动词 + 介词` 课位（U113），但 `look forward to` 不在任何标题内**；**`feel`／`sound`／`smell`／`taste`／`seem`／`appear` 初级册全 0**（逐词复算） |
| **中级 U99** | `99 Adjectives: a nice new house, you look tired`——**批十九 L125–L127 已交付**（复核无误，仍在 `Adjectives and adverbs` 块，前 U98 `-ing/-ed`、后 U100 `quick/quickly`） |
| **中级 U117／118** | `117 like and as`／`118 like as if`——`look like` 的中级位，**无独立 `look like` 单元**（复核一致） |
| **中级 U46** | `46 have something done`——**`have sth done` 的唯一 Murphy 落点，跨级（B1-B2 块 U42–45 被动之后）**，口径无变化 |
| **中级其他（本轮复算）** | `18 used to (do)`（我方 L93／L100 已教）／`26 can, could and (be) able to`／`53 Verb + -ing (enjoy doing/stop doing etc.)`／`54 Verb + to… (decide to…/forget to… etc.)`／`55 Verb (+object) + to… (I want you to…)`／`56–58 Verb + -ing or to… 1/2/3`／`59 prefer and would rather`／`63 there's no point in -ing, it's worth -ing etc.`／`64 to…, for… and so that…`——**均无变化**。→ **中级册 `53–67` 是一个 15 课连续块（`-ing`／`to` 家族），`60–62` 是其中的「介词 + -ing」三课；`look forward to` 的位置只能在这三课正文内（未核）** |

**Murphy 小结（本轮最重要的口径发现）**：**双册 TOC 里 `forward` 是 0**。中级册的 `to + -ing` 家族落在 **U60／U61／U62 三课**（`Preposition + -ing` ／ `be/get used to` ／ `Verb + preposition + -ing (succeed in -ing / insist on -ing etc.)`），**批十八的 `be used to` 在 U61 已被逐字证实，而 U62 的标题内举例是 `succeed in`／`insist on`**。→ **`look forward to` 的 Murphy 依据只能写「中级 U62 所属的 `verb + preposition + -ing` 块（标题内举例为 succeed in／insist on；`look forward to` 未见于 TOC 抽文）」，不得写成「Murphy 中级有 `look forward to` 单元」。**

### 1.4 中文侧 english.cool（869 篇 sitemap）

**取到情况**：sitemap 本机缓存 `/private/tmp/ec-urls.txt`（**本轮 regex 复算 `/look-forward-to/` 与 `/look-forward-to-2/` 两条均在**）＋**本轮两篇全部直连 HTTP 200 实取原文**（`ec_lft_live.html` 95,616 bytes md5 `f83657c97d146bd1d40f4fcab758dc72`／`ec_lft2_live.html` 94,727 bytes md5 `9a84fee75b286a4c55b854fc06cfdf31`）＋另取四篇对照（`causative-verbs`／`gerund-infinitive-verb`／`to-for`／`sense-verbs` 缓存）。

| # | 篇目 | 取到情况 | 本轮要点（**原文级**） |
|---|---|---|---|
| EC-1 | `https://english.cool/look-forward-to/`「「look forward to」用法是？加 V-ing？」 | ✅ **本轮直连 HTTP 200 实取原文**（批十八为缓存） | **首屏自测对（本轮逐字）**：题目句 `I look forward to visit you tomorrow.` 对 `I look forward to visiting you tomorrow.`；揭晓 `I look forward to visit you tomorrow. ❌`／`I look forward to visiting you tomorrow. ⭕️`。**病灶描述逐字**："**不管你答對還答錯，都別小看這裡的 to，很多人一看到 to 就會反射動作加上原形動詞，但是 look forward to 的 to 是介系詞，後面如果遇到動詞要加上 ing 才對唷！**"；**意象拆解**："look 為「看」，forward 為「向前地」，to 代表「朝著…」，所以 look forward to 整個意象就會是「往前面看」，類似成語所說的引頸期盼之意"；**规则重申**："在這裡是作為介系詞，所以後面要加上**名詞或動名詞**"；**四条例句（逐字）**：`The children look forward to their Christmas presents.`／`Are you looking forward to the graduation trip?`／`Columbus' fans look forward to watching his new YouTube video every Monday.`／`I'm quite looking forward to working with them.`（并注 `quite` 可换 `much / very much / so much`）；**现在式 vs 进行式的正式度**：`I look forward to meeting you.`（比較正式）对 `I'm looking forward to meeting you.`（比較口語）；**Email 四档正式度**：`I look forward to your reply.`（最正式）＞`Look forward to your reply.`＞`I'm looking forward to your reply.`＞`Looking forward to your reply.`（最不正式）＋"建議大家少用第一句…因為這樣會有種「我在等你回覆喔，別太晚回覆我」的感覺，容易讓對方感到壓力" |
| EC-2 | `https://english.cool/look-forward-to-2/`「「期待」英文怎麼說？Look forward to? Expect?（含例句）」 | ✅ **本轮直连 HTTP 200 实取原文** | 三词辨析：**`look forward to`（盼望、期望、期待）／`expect`（預期、預料）／`anticipate`（預期、預料）**。`look forward to` 段逐字：英文定义 "to feel pleased and excited about something that is going to happen"；"**要特別留意這裡的 to 為介系詞，後面須加上名詞喔**"；**形式标注原文＝`look forward to + N/Ving`**；例句 `I'm looking forward to seeing you again.`／`The students are looking forward to the summer vacation.`／`The man isn't looking forward to the upcoming new year.`／信尾两句 `I'm looking forward to your reply.`／`I look forward to hearing from you.`；**`anticipate` 的对照规则（可用于「同族」铺垫）**："留意一下 anticipate 和 expect 的用法不同，後面不會加 to V，而是加上動名詞 (Ving)"＋形式标注 `anticipate + N/Ving`（例 `I anticipate getting a pay raise this year.`）→ **中文侧「`to + Ving` 家族」不止一篇，`look forward to` 与 `anticipate` 被同一作者放在同一篇里对照** |
| EC-3 | `https://english.cool/causative-verbs/`「「使役動詞」是什麼？有哪些？被動用法是？」 | ✅ **本轮直连 HTTP 200 实取原文** | **`have sth done` 的中文侧节级落点（复核不变）**：**被动句型逐字**——"have 也很常用在被動句型，表示「使、讓某件事被做」，而且是交由別人來做"；**规则逐字**："被動句型不同的地方在於：**受詞的後面要改加過去分詞（＝在學校聽到膩的 p.p.）**，就不再是接原形動詞囉，這是因為受詞是「被做」那些動作的關係"；**例句逐字**：`I had my hair cut.`（我剪頭髮了）／`I'll have the laptop checked asap.`／`He had his smartphone fixed.`；**get 版**：`Please get it done by next Friday.`／`The team got the report revised.`／`We got our house painted last year.`；**坏事用法**：`I had/got my cell phone stolen.`／`She had/got her leg broken.` → **复核结论：口径零变化（「有节级落点但档位不变」维持）** |
| EC-4 | `https://english.cool/gerund-infinitive-verb/`「動詞後面要接 V-ing 還是 to V.?（動名詞 vs. 不定詞）」 | ✅ **本轮新取（用于查 `to + -ing` 家族的覆盖面）** | **该篇全文 regex 复算：`look forward` ＝ 0**。→ **中文侧最厚的「V-ing vs to V」总表文并不收 `look forward to`**；它的 ❌ 例是 `I want sing. ❌`／`I finished to read the book. ❌`；**四类分法**：`to V` 组／`V-ing` 组／两者皆可意思不变组（like/start/love/begin/hate/continue/prefer/propose）／意思不同组（remember/forget）→ **中文侧「`look forward to` 单独成篇」的独立性因此更高**（总表文都不收它） |
| EC-5 | `https://english.cool/sense-verbs/`（感官动词，缓存 `ec2_sense-verbs.body.txt`） | ⚠️ 沿用批十九实取缓存（本轮未重取） | **两分类法**：「動作是別人做的感官動詞」五词（look／sound／smell／taste／feel，"它們的中文剛好都是「……起來」"）＋「動作是主詞做的感官動詞」（see／watch／hear／listen／smell／feel／notice／observe，接原V 或 V-ing）；**四条 ❌**：`The idea sounds great!`（不是 greatly）／`Your skin feels so smooth.`（不是 smoothly）／`The dinner smells so good.`（不是 well）／`The medicine tastes so bitter.`（不是 bitterly）；**like 扩展**：`look like／sound like／smell like／taste like／feel like`＋名词；**`see/watch/look` 三分**（`What are you looking at?`／`Look at the street performer.`）；**收口例**：`The kid looks happy.` 对 `The kid is looking happily at the photo.` → **批十九已全部原文级落地，维持** |
| EC-6 | `https://english.cool/linking-verbs/`（缓存 `b18_ec_linking.html`） | ⚠️ 沿用批十九实取缓存 | 四类表＋`He looks smart.` 对 `He looks angrily at her.` 的显式切开 → 批十九已落地 |
| EC-7 | `https://english.cool/to-for/`（**本轮新取**） | ✅ 直连 200 | 全文与 `look forward to` 无关（讲 `to + 动词` vs `for + 名词` 表目的、`to me` vs `for me`）；**注意其页内提醒**："這裡的 to 跟 for 都是介系詞，介系詞後面必須搭配「受格」的人稱代名詞"（`to me` 而不是 `to I`） → **与 `look forward to him arriving`（CAM-1 第二条 ❌）同构，可作二期素材** |

**中文侧小结**：**`look forward to` 本轮拿到「两篇独立专文＋首屏 ❌ 自测对＋病灶描述逐字」**，**且总表文（`gerund-infinitive-verb`）不收它** → **独立性高于批十九 `look + 形容词`（那项中文侧无 `look` 专文）**。**`object to` 中文侧本轮未找到专文**（sitemap regex 复算：`object` 家族只有 `goal-objective-aim`／`indirect-direct-object`／`subject-verb-object-complement` 三篇，**均与 `object to` 无关**——**见 §8 未核实③**）。

### 1.5 `have sth done` 与形容词＋介词（复核，仅标注有无口径变化）

| 候选 | 本轮复核动作 | 结果 |
|---|---|---|
| **`have sth done`** | ① Cambridge `have-something-done` **复取**（md5 `bfded7df91e227dbf624bc0f844ae2a3`）；② Cambridge **新增** `verb-patterns-with-and-without-objects` 的 `-ed clause` 节（`get my car mended`／`had the whole house repainted`）；③ 我方词架**复跑 7 词** | ① 口径**零变化**（`Not the same as the present perfect` 的警告原文仍在）；② **上游第二落点本轮确认（新增一条，原记只有 `have-something-done` 一页）**；③ `will have` 0／`haircut` 0／`repaired` 0／`had my` 0／`cut` 0／`checked` 0／`fixed` 0（**GL＋HC 两文件**）→ **维持撤出，无口径变化** |
| **形容词＋介词** | ① **BC A1-A2 第 1 课正文本轮首次实取**（规则级原文＋六组介词例）；② Murphy 初 U112／中 U130–131 **复核**；③ 我方**复跑 9 词** | ① **新增**：BC 侧不只是「有课程位」，本轮拿到正文规则句与六组例（含三句「介词 + -ing」活例）；② 单元号与标题无变化；③ **`good at` GL 52／HC 6**（**批十九路线图 §6.2 记「raw 48 处」——本轮复算差异见 §7 口径校正**）；`interested in`／`afraid of`／`similar to`／`proud of`／`worried about`／`full of`／`keen on`／`familiar with` **全 0** → **维持折卡（不单开），无口径变化；但「六族只覆 1/6」的表述可保留** |

---

## §2 对比表

| 候选 | Murphy（册别＋单元号） | BC（含 CEFR 段位） | Cambridge | 中文侧 | 我方现状 |
|---|---|---|---|---|---|
| **① `look forward to`（`to + -ing` 第二族首项）** | **双册 TOC 全 0**（`forward`＝初 0／中 0；**最近邻＝中级 U62 `Verb + preposition + -ing (succeed in -ing / insist on -ing etc.)`，属同一块但标题不含本词**） | **三档 68 课零课位**（A1-A2 18／B1-B2 36／C1 14 全目复点）；**B1-B2 第 34 课 `Verbs and prepositions` 明文不收**；**规则级落点＝A1-A2 第 1 课 `Adjectives and prepositions` 正文**（"a preposition is followed by a noun or a gerund (-ing form)"）＋**参考层评论区**（"prepositions require subsequent verb forms to be in the '-ing' form… no exceptions"） | **词典义项级 B1**（`[+ -ing verb]`）＋**B2**（正式信尾）；**语法专页 `Look forward to`**（两条 ❌：`to go`❌／`he arriving`❌）；**Common mistakes 专条 `Word patterns: look forward to`**（`Do not say 'look forward to do something'`）；**`Verb patterns` 总索引 8 专条之一**；**`prepositional-verbs` 词表内含 + "object can be… the -ing form"** | **两篇独立专文**（`look-forward-to` 首屏 ❌ 自测对＋病灶描述逐字／`look-forward-to-2` 三词辨析＋`look forward to + N/Ving`）；**总表文 `gerund-infinitive-verb` 不收它** | **`forward`／`forwards`／`look forward`／`looking forward` 两文件全 0**（**零底座·造词课**）；**但 `look` 家族在库极厚**（`looks` 148／`look at` 22／L125–127 刚教 `look + 形容词`）；**`-ing` 家族在库厚**（`reading` 599／`doing` 74／`playing` 37／`walking` 39 等） |
| **② `object to`** | **双册 TOC 全 0**（`object` 只出现在初级 Appendix 7 `Phrasal verbs + object` 的「object」普通名词用法，**与本结构无关**） | **三档 68 课零课位**；`Verbs and prepositions` 的 `to` 组（listening to／introduce to／refer to／responded to／apologised to）**不含它** | **仅一条搭配条（collocation）无 CEFR**；义项级只在**美式学术词典**（`I don't think anyone will object to leaving early.`）；**无独立语法页**（`object-to` 直连返回 `Say or tell?`） | **sitemap regex 复算：无专文**（`object` 家族三篇均无关） | **`object`／`object to` 两文件全 0**（零底座） |
| **③ `have sth done`** | **中级 U46 `have something done`**（跨级，在 U42–45 被动块之后） | **三档 68 课零课位** | **`Have something done` 专页**（明文 `Not the same as the present perfect`）＋**本轮新增第二落点** `verb-patterns-with-and-without-objects` 的 `-ed clause` 节 | **有节级落点**：`causative-verbs`「使役動詞的被動句型」（`I had my hair cut.`／`I'll have the laptop checked asap.`／`He had his smartphone fixed.`／`get` 版三句／`stolen`·`broken` 坏事用法） | **零词架**（`will have` 0／`haircut` 0／`repaired` 0／`had my` 0／`cut` 0／`checked` 0／`fixed` 0）；**强干扰源**：`have X done` 的 10 处 GL 命中**全是现在完成时**（`have done my homework`） |
| **④ 形容词＋介词** | **初 U112**（`afraid of…, good at… etc. (prepositions) + -ing`）／**中 U130–131**（`Adjective + preposition 1/2`） | **A1-A2 第 1 课课程位**（`Adjectives and prepositions`，**A1 Elementary／A2 Pre-intermediate**）＋**正文规则句与六组例（本轮新取）** | （本轮未取专页；批十七已记） | （批十七已记「六族只覆 1/6」） | **六族只覆 1/6**：`good at` GL 52／HC 6；**其余八式全 0** |
| **⑤ 感官动词五词** | **双册 TOC 五词全 0**（`feel`／`sound`／`smell`／`taste` 全 0；`look` 仅 U113 动作义）；**最近邻＝中级 U67 `see somebody do and see somebody doing`** | **A1-A2／B1-B2／C1 三档无「感官动词」课**；**B1-B2 `Stative verbs` 表含 feel／look／smell／taste、不含 `sound`** | 词典义项级阶梯：**`feel` (EXPERIENCE) A1**／**`sound` (SEEM) A2**（＋`sound like/as if` B1＋`sound angry, happy…` B2）／**`smell` (CHARACTERISTIC) B1 `[I, L only + adj]`**／**`taste` (FOOD/DRINK) B1**（含 `taste good, bad, sweet, etc.` B1）；语法侧 `Linking verbs` 名单含五词 | **两篇**（`sense-verbs` 五词「……起來」＋四条 ❌；`linking-verbs` 四类表＋切开） | **`sound`／`sounds`／`smell`／`smells`／`taste`／`tastes`／`feels`／`felt`／`seem`／`appear` 两文件全 0**；**`feel` 27 处（L76 22／L78 5，全是 `I feel much better today.` 同句及其回显）**；**`look` 已由 L125–L127 占用** |
| **⑥ 机制强化** | — | — | — | — | 批十六判「无增量空间」，十七／十八／十九复跑维持 |
| **⑦ A2 段剩余盘点** | — | **A1-A2 18/18 已覆盖**（批十七关账） | — | — | 形容词＋介词为第 5 处课程位，**两批均只做折卡** |

---

## §3 三问制正当性表（①跨源 A1-A2／强功能位有无课程位 ②中文侧实证强弱 ③我方接口是否现成）

| 序 | 候选 | ① 跨源课程位 | ② 中文侧实证 | ③ 我方接口 | **档位** | 判读 |
|---|---|---|---|---|---|---|
| 1 | **`look forward to`** | **零课位**（BC 三档 68 课复点；Murphy 双册 TOC 0）；**但上游有四层**：词典义项级 **B1**＋`[+ -ing verb]`／**两个 Cambridge 专页**（语法页＋Common mistakes 页）／**`Verb patterns` 总索引 8 专条之一**／**`prepositional-verbs` 词表内**；**BC 的规则只在 A1-A2 形容词＋介词课与参考层** | **强**（**两篇独立专文**＋首屏 ❌ 自测对＋病灶描述逐字「很多人一看到 to 就會反射動作加上原形動詞」；**总表文不收它**） | **零底座**（`forward`／`looking forward` 全 0）——**但结构接口齐**：`look` 家族厚（`looks` 148／`look at` 22）＋`-ing` 家族厚（185 处「名字版」话术已在库）＋**同族第一站批十八已交付**（L119–L124，`to + -ing` 的第一族） | **B＋** | **比批十九的 B 档高一档**：上游从「参考层落点」升级为「**词典义项级 CEFR ＋ 两个专页 ＋ 总索引条目**」，中文侧从「无专文」升级为「**两篇独立专文**」；**唯一硬伤是零底座（造词课）**——**故记 B＋并明写「须先造词架」** |
| 2 | **`object to`** | **零课位**；上游**仅一条搭配条（无 CEFR）＋一条美式学术词典例句**；**无专页** | **零专文**（sitemap 复算） | **零底座**（`object` 全 0） | **C** | **与 `look forward to` 不同档**：**同为「to + -ing」，但一个有四页证据一个只有半页**；**且 `object to` 的语义（反对）在「小美的一天」零基础场景里天然不友好**（要造「反对某件事」的场景）→ **判 C：可作 `look forward to` 章内的第 4–5 课备选，不单独立项** |
| 3 | **`have sth done`** | **BC 三档零课位**；Murphy 仅中级 U46（跨级） | 有节级落点（`causative-verbs` 被动句型） | **零词架**（7 词全 0）＋**强干扰源**（`have X done` 10 处全是完成时） | **C（维持撤出）** | **口径零变化**：本轮唯一新增是 Cambridge 第二落点，**不改变档位**；「同一个 have 的对撞面」仍在 |
| 4 | **形容词＋介词** | **A1-A2 第 1 课课程位（A 档级）**＋初 U112／中 U130–131 | （批十七已记） | **六族只覆 1/6**（`good at` 在，其余八式全 0） | **B-（维持折卡，不单开）** | 「一课一增量」守不住（搭配是清单不是结构）；**本轮新增 BC 正文规则句，反而加强「折卡」的正当性**（规则只有一句，内容全是清单） |
| 5 | **感官动词（`sound`／`smell`／`taste`／`feel`；`look` 排除）** | **三档无专课**；Murphy 五词全 0；**唯一上游是 `Linking verbs`／`Stative verbs` 两份名单**（且 `sound` 只在其中一份） | **两篇主题专文＋四条 ❌**（**中文侧是本候选最强的一环**） | **四词全 0**（`feel` 只在 L76 一句里）＋**`look` 已被 L125–127 占用** | **B−（可做 2–3 课小章，不可做大章）** | **判读见 §6**：**四词撑不起 6 课大章**；**`look` 应排除**（已占用）；**最大自然容量＝2–3 课** |
| 6 | **机制强化** | — | — | — | **D（不做）** | 维持 |
| 7 | **A2 段剩余盘点** | **18/18 已关账** | — | — | **盘点项（非课）** | 维持；**本轮新增一条可入盘点表**：`look forward to` 是「**词典义项级 B1 ＋ 两个专页，但 BC 零课位、Murphy 零 TOC**」的活例，**与批十九 `look + 形容词`（词典义项级 A2＋语法专页＋Murphy 半边标题）**、**`be used to`（Murphy 单元级 U61）** 构成三种不同的「跨级落点形态」 |

**三问制小结**：**`look forward to` 是本轮唯一档位高于批十九首选项的候选**（B＋ 对 B），**且它与批十八同族、与批十九同词根**——**三项集中在 `to`／`look` 两个点位上，是「同族第二站」的天然形态**；**`object to` 判 C**（证据只有半页＋语义场景不友好）；**感官动词判 B− 且只能做 2–3 课**。

---

## §4 大章节组合建议

### 4.1 首选方案：**大章 5 课「期待的那件事」/ 主题名待定（L128–L132）**

**为什么是大章（5 课）而不是小章**（**这是本轮 §6.2 两个必答问题的第一个**）：
- **内容自然容量**：`look forward to` 自身的教学面 ≥4 格——① 认词（`look forward to` 整体＝「期待」，**`forward` 是库外新词，须单独一站**）；② **`to` 后面跟「做的事」（`-ing`）**（**同族第二站，与批十八 L120 的 `be used to + -ing` 显式并列**）；③ **`to` 后面跟「东西」（名词短语）**（`look forward to the holidays`／`your reply`——**这是「同一个 to 两张脸」的第二层**）；④ **换人版**（`looking forward to`，`I'm looking forward to seeing you again.`）；⑤ **收口**（零新知，与 L124／L127 同构）。→ **5 格，不是 3 格**。
- **对比批十九为什么只有 3 格**：批十九的硬伤是「**第 4 课起只能换词**」（`sound`／`smell`／`taste` 全 0）。**本候选没有这个硬伤**——它的第 2／3 课的区别是**结构性的**（`-ing` 对 名词短语），不是换词。
- **对比批十八的 6 课**：批十八是 `be used to` ＋ `get used to` ＋ `used to` 三头并列（**6 课**）；**本候选是单头 `look forward to`**（`object to` 判 C 不上前 3 课），**故 5 课（比 6 少 1）**。

| 课号 | 主题 | 增量（一课一增量） | 接口（与已有课的显式连接） |
|---|---|---|---|
| **L128** | **「我期待那件事」**（`look forward to` 整体认词，后面跟**东西**） | **新词 `forward` 上线（库外，本站唯一的新词）＋ `look forward to` 整体当「期待」用**；后面跟「东西」（`the weekend`／`your letter`／`the trip`）——**本课不碰 `-ing`**（把 `to` 后面的脸先收窄成一张） | 开场复用 **L125 `It looks nice.`**（同一个 `look`，**N+1 课回流**）；`to` 用 L67 `:12363` 的「小牌子」意象挂靠；**`look forward to` 的 `to` 与 L68 `want to travel` 的 `to` 显式切开**（**`want to` 后面跟原样、这里后面跟东西**） |
| **L129** | **「期待做那件事」**（`-ing` 上场） | **`to` 后面遇到「做的事」要换名字版**——`I'm looking forward to seeing you again.` | **与 L120 `I am used to getting up early.` 显式并列**（**同族第一站已在库**；话术「**同一个 to，前面有 be 站着认名字版——这里前面是 look forward，它照样认名字版**」）；**名字版话术直接复用 L42／L43 既有 185 处体系** |
| **L130** | **「看东西 vs 期待东西」**（同一个 `look` 三张脸切开） | **零新知（切开课）**：`Look at the clouds!`（去哪儿看）／`The sky looks dark.`（什么样）／`I'm looking forward to the weekend.`（期待）——**同一个 look 的三张脸排一行** | **直接接 L127 `The sky looks dark.`／`It looks like rain.` 的收口**（**L127 的 oneLineRule 已明写「后面跟的东西不一样，说的就不是一件事」——本课把第三张脸放进去**）；`at`／形容词／`forward to` 三种「后面跟什么」并列 |
| **L131** | **「我期待，你期待吗？」**（换人版＋说不和问） | **`I'm looking forward to…` 的换人（`She's`／`We're`）＋否定（`I'm not looking forward to…`）＋问（`Are you looking forward to…?`）** | 复用 **L123 `I'm not used to…` 的否疑骨架**（同族第一站的否疑课已在库）；`-s` 规则复用 L25／L126 |
| **L132** | **「同一个 to 的两站」（收口）** | **零新知**：把批十八（`be used to + -ing`）与本章（`look forward to + -ing`）**两站排一行**——`I am used to getting up early.` 对 `I'm looking forward to getting up early.`（**同一个 `to`、同一个名字版、意思完全不同**） | **跨批钩子：批十八六课＋本批五课在此一次收口**（**这是本项目第一次「两批同族收口」**） |

**课量理由三条**：① 上表 5 格**每格一个真实增量**（无空格）；② **与 `object to` 的取舍**：`object to` 判 C（§3），**不上前 3 课**——若生产期发现 L128–L130 容量富余，**可在 L131 或 L132 折入一句认读**（`My mother objects to the colour.`），**但不为它单开课**；③ **不取 6 课**：多出的第 6 课只能靠「`object to`＋`succeed in`／`insist on` 换词」撑（**Cambridge 的同族条目有 `succeed`／`think of`／`avoid`／`enjoy` 等——但那是清单不是结构**，**正是 `have sth done` 与形容词＋介词被判撤出／折卡的同一个理由**）。

### 4.2 备选方案 A：**`look forward to` 小章 3 课（L128–L130）**

若生产期判定「库外新词 `forward` ＋ 5 课工作量过重」：**取 L128／L129／L132 三课**（认词＋`-ing`＋收口），**L130／L131 并入他章或延后**。**代价**：放弃「同一个 look 三张脸」的切开课（**而 L127 已为它铺好接口，浪费一次钩子**）。**判：不推荐，但比「不做」好。**

### 4.3 备选方案 B：**感官动词小章 2–3 课（`sound`／`smell`／`taste`／`feel` 四词）**

见 §6。**若批二十改取此项：课量 2–3 课，且须同步造四词底座**——**判：不如首选（§6.4 逐条）**。

### 4.4 「小章之后回大章还是继续小章」——竞品形态给的意见（**§6.2 第二问**）

| 竞品 | 有没有「章」的概念 | 有没有「大小交替」的先例 |
|---|---|---|
| **BC LearnEnglish** | **没有章**——三档索引全是**平行的单点课**（A1-A2 18／B1-B2 36／C1 14），**课与课之间只有字母序，无分组、无编号段** | **无先例可抄** |
| **Murphy（双册）** | **没有章**——**固定单元号连续排布**（初级 1–115／中级 1–145），**块与块之间只有主题首尾相接**（如中级 `Present and past 1–18`／`-ing and to 53–67`／`Prepositions 121–136`） | **无先例可抄**；**但块长本身极不均**（`Present and past` 18 课／`Questions and auxiliary verbs` 4 课／`Articles and nouns` 12 课）——**「块长由内容决定」在 Murphy 是常态** |
| **Duolingo** | 有「单元（Unit）」，但**不是语法章**（是功能话题单元） | **本轮三次尝试仍全败（`duolingo.com` 返回 8,719 bytes 反爬页；未取到任何单元结构数据）→ 不引数据** |

**结论与建议表述（三条）**：
1. **竞品给不了「章节大小交替」的形态背书**——**BC 与 Murphy 连「章」都没有，不存在交替**；**Duolingo 未取到**。→ **我方不得对外写「竞品也这么做」**。
2. **唯一可抄的原则是「内容自然容量决定章长」**：**Murphy 的块长本身就从 4 课到 18 课不等**（`Questions and auxiliary verbs` 4 课／`Present and past` 18 课）——**这正好为我方 3 课小章与 8 课大章并存提供形态正当性**（**不是节奏调节，是内容驱动**）。
3. **建议的对外表述**：**「章长由内容容量决定：`look + 形容词` 只有 3 格自然容量，所以 3 课；`look forward to` 有 5 格，所以 5 课。我们不为了节奏凑课数，也不为了整齐砍内容。」** → **这比「回大章以对冲小章被感知为缩水」更稳**——**若为节奏强行把 3 格内容写成 6 课，会直接破坏「一课一增量」**（**批十九已明确「第 4 课起只能靠换词撑」**）。

### 4.5 「造词课」风险的处理方式（**本轮必须明写**）

**风险定义**：`forward` 是我方**库外新词**（两文件全 0），`look forward to` 是**库外新短语**——**这是本项目第一次在 B1 段开「库外新短语＋库外新词」的课**（批十八 `be used to` 的 `used`／`used to` 库内有 L93／L100 垫子；批十九 `look + 形容词` 全是库内老词）。

**处理方式五条（逐条可执行）**：
1. **把新词压缩到最小**：**全批只上 `forward` 一个新词**（`object to` 判 C 不上前 3 课＝**`object` 不上**；`holiday`／`trip`／`reply`／`email` 等场景词若超纲，**改用库内词**——**库内可用**：`weekend` GL 10／HC 8、`photo` 7／10、`summer` 3／5、`letter` 8／2、`birthday` 155／12、`tomorrow` 37／3、`see you` 4／0）。
2. **新词单独占第 1 课**（L128）：**不把 `forward` 藏在长句里**——**L128 的 `blocks` 必须把 `look forward to` 拆成可见部件**（复用 L119 `{ text: "I am used to", role: "…" }` 的块状拆法）。
3. **新旧比例硬纪律**：**每课 targetSentence 里新词 ≤1**；**对比卡 6 条中至少 3 条的正确答案必须是库内词句**（沿用批十七–十九的纪律）。
4. **「造词课」的档位诚实标注**：**B＋ 档不得写成 A 档**；**对外写「跨源有词典与专页证据，但 BC 无课程位、Murphy 无 TOC、我方零底座，须先造词架」**。
5. **反向验证垫子**：**批十八 L120 `I am used to getting up early.` 是本批最重要的既有接口**（**同族第一站的 `-ing` 句已在库**）——**L129 必须显式回流它**（**这是「造词课」唯一能借的力**）。

---

## §5 关键切开专节：`look forward to` 与我方已有三层关系的处理

**约定的三层关系**：① 批十九 `look + 形容词`（**同一个 look**）② 批十八 `be used to + -ing`（**同一个 to + -ing 家族**）③ 批十九已认读的 `look like`。

### 5.1 跨源教材是怎么处理这三层关系的（**原文依据**）

| 关系 | 跨源处理方式 | 原文依据 |
|---|---|---|
| **① 同一个 `look`：`look + 形容词`／`look at`／`look forward to`** | **Cambridge 把「看东西」的 look 与「看什么样」的 look 分页切开**（`Look at, see or watch?` 独立页，明文 "When look has an object, it is followed by **at**: `Look at the rain. It's heavy.` **Not: `Look the rain.`**"）；**把 `look forward to` 放到另一个体系里**（**`Prepositional verbs` 词表**，与 `listen to`／`depend on`／`look after`／`look for` 并列）——**即：Cambridge 不在同一页里并列「三张脸」，而是按体系分页**。**中文侧相反**：`sense-verbs` 把 `see/watch/look` 与 `look + 形容词` 收在**同一篇**里，用 **`look` 是谁做的** 一刀切开（`The kid looks happy.` 对 `The kid is looking happily at the photo.`）。→ **两条路都可走：分页（Cambridge）或一刀（中文侧）** | CAM-15（批十九实取）／CAM-10（本轮实取 `prepositional-verbs`）／EC-5（缓存） |
| **② 同一个 `to`：`want to travel`（原样）／`be used to + -ing`／`look forward to + -ing`** | **Cambridge 用「体系归属」切**：`want to` 属 **`Verb patterns: verb + infinitive`**（`Verbs followed by a to-infinitive` 词表）；**`be used to`／`look forward to` 属 `Prepositional verbs`**（**同一张词表内**：本轮逐字复取 `Some verbs are followed by the preposition to, including **be used, get used, listen, look forward, object, reply, respond**`——**Cambridge `To` 页把这两个词放在同一句里**）；**BC 用「规则句」切**（"a preposition is followed by a noun or a gerund (-ing form)"／"prepositions require subsequent verb forms to be in the '-ing' form… no exceptions"）；**中文侧用「反射动作」切**（`look-forward-to` 篇："很多人一看到 to 就會反射動作加上原形動詞"）。→ **三源都指向同一个判据：`to` 是什么，看它前面站的是谁**（**与我方批十八话术「同一个 to，前面有 be 是一张脸，没 be 是另一张」同构**） | **CAM-2 的 Cambridge `To` 页逐字原文（本轮实取）**：`To as a preposition: after verbs — Some verbs are followed by the preposition to, including **be used, get used, listen, look forward, object, reply, respond**: We listened to that CD you lent us. It's great. I object to your remarks.`／BC-2／BC-8／EC-1 |
| **③ `look like`（L127 已认读）与 `look forward to`** | **Cambridge 分两处**：`look like` 在 `look` 语法页的 `Look as a linking verb` 节下（`look like + noun phrase`／`look as if / as though + clause`）；`look forward to` 在 `Verb patterns` 与 `Prepositional verbs` 两个体系里（**与 `look like` 不同页、不同体系**）。**中文侧**：`sense-verbs` 篇把 `look like／sound like／smell like／taste like／feel like` 收在「感官动词 + like」一节（**与 `look forward to` 无关**——**该篇全文 `look forward` ＝ 0**）。→ **三源都不把 `look like` 与 `look forward to` 并列** → **我方应保持同一处理：L127 的 `look like` 只认读，本批不扩** | CAM-15／EC-5（缓存）＋EC-1／EC-2（本轮实取，全文 `look like` 与 `look forward to` 各在一篇，不混） |

### 5.2 派生的三条我方设计准则（**逐条**）

1. **`look` 三张脸必须用「后面跟什么」切，不能用「look 有几种意思」切**：`Look at the clouds!`（后面是「去哪儿看」）／`The sky looks dark.`（后面是「什么样」）／`I'm looking forward to the weekend.`（后面是「期待的那件事」）。**依据**：Cambridge 用体系归属分页（分页的实质就是「后面跟什么」不同）；**中文侧用「look 是谁做的」**——**两者可合流为我方的一句话：「后面站的东西不一样，说的就不是一件事」**（**L127 的 oneLineRule 已经是这句话，L130 直接续用**）。
2. **`to` 两站必须用「前面站谁」切**：**`I am used to getting up early.`（前面站着 am——习惯的记号）对 `I'm looking forward to getting up early.`（前面是 look forward——期待的说法）**——**同一个 `to`、同一个名字版、两件事**。**依据（本轮最强）**：**Cambridge `To` 页逐字把 `be used`／`get used`／`look forward`／`object` 放在同一句里列举**（"Some verbs are followed by the preposition to, including be used, get used, listen, look forward, object, reply, respond"）——**上游自己就把它们当一族**。**这是本批话术的原文级背书**。
3. **`look like` 本批零扩**：**只保留 L127 的认读句**（`It looks like rain.`）；**不得在 L128–L132 引入 `look like + 名词` 的新句**。**依据**：三源均不把 `look like` 与 `look forward to` 并列（§5.1③）；**且 `look like` 仍是四度三缺**（**若混述会同时污染两条线**）。

### 5.3 术语红线在专节的落地（**本批新增禁词的判断**）

**新增危险词＝「介词」「不定式」「动名词」**（**三者全在 29 词表内**：介词／不定式＝批十九额外禁用／动名词＝批十九额外禁用）。→ **一律替换**：
- 「介词」→ **「to 在这里不是那块小垫板，它是「朝着」那个小牌子」**（**借 L67 `:12363` 门牌意象 + L68 `:2693` 「小垫板」的对照**）；
- 「不定式」→ **「原样」**（**L68 `want to travel` 的既有话术；L93 `:17289` `I used to play here.` 的「后面跟原样」**）；
- 「动名词」→ **「名字版」**（**L42／L43 既有 185 处体系**）。
**本批最易踩的两课**：**L129（`to` 后接 -ing，讲「名字版」时最易写「动名词」）**／**L130（三张脸切开，讲 `at` 时最易写「介词」）**。

---

## §6 感官动词可行性专节（五词能否撑起一个章？`look` 是否应排除？`feel` 27 处的性质？）

### 6.1 五词跨源位置（逐源，本轮实取＋缓存）

| 词 | BC | Cambridge（**义项级 CEFR**） | Murphy 双册 | 中文侧 | 我方 |
|---|---|---|---|---|---|
| **`look`** | `stative-verbs` 表内；**三档无课** | `dictionary/english/look` **(SEEM) A2**；`Look as a linking verb` 专节 | **中级 U99 半边标题**（`you look tired`） | `sense-verbs`／`linking-verbs` 两篇 | **L125–L127 已交付（占用）** |
| **`feel`** | `stative-verbs` 表内（**两表都在**） | **(EXPERIENCE) A1** `[ L or T ]`（`My eyes feel really sore.`／`I never feel safe…`） | **0**（双册 TOC 无） | `sense-verbs`（`Your skin feels so smooth.` ❌ smoothly）／`linking-verbs`／`adjectives` | **27 处，L76 22／L78 5** |
| **`sound`** | **不在 `stative-verbs` 表内**；`linking-verbs` 名单内有 | **(SEEM) A2**（`Your job sounds really interesting.`）＋`sound like/as if/as though` **B1**＋`sound angry, happy, rude, etc.` **B2** | **0** | `sense-verbs`（`The idea sounds great!` ❌ greatly）／`linking-verbs`／`adjectives` | **0** |
| **`smell`** | `stative-verbs` 表内 | **(CHARACTERISTIC) B1** `[ I , L only + adj ]`（`That cake smells good.`） | **0** | `sense-verbs`（`The dinner smells so good.` ❌ well） | **0** |
| **`taste`** | `stative-verbs` 表内 | **(FOOD/DRINK) B1**（`Taste this sauce…`）＋`taste good, bad, sweet, etc.` **B1**（`This sauce tastes strange.`） | **0** | `sense-verbs`（`The medicine tastes so bitter.` ❌ bitterly） | **0** |

### 6.2 五词能否撑起一个章？——**不能撑 6 课大章，只能撑 2–3 课小章**

**四条硬理由（逐条）**：
1. **段位不齐**：**`feel` A1／`sound` A2／`smell` B1／`taste` B1**——**四词跨三个段位**，**不存在「一个章」的段位一致性**（对比批十九 `look + 形容词`：**单个词、单一段位 A2**）。**且 `look`（A2）已占用**。
2. **上游名单自相矛盾**：**`sound` 在 Cambridge `Linking verbs` 名单内，但不在 BC `stative-verbs` 表内**（**两源不一致**，批十九已记，本轮 Wayback 复取确认）。→ **做「五词一个家族」时无法引用任一源作为完整名单依据**。
3. **中文侧是唯一强项，但它的判据与词数无关**：中文侧两篇都用「**……起來**」做五词共同标记（**中文恰好五个词都有「起来」**）——**这是中文侧独有的分法，英文侧（BC／Cambridge／Murphy）没有对应的「五词一族」**。→ **只能当「中文需求驱动」的正当性**（**批十一型**），**不能当跨源共识**。
4. **我方词架全 0**：**四词课＋案两文件全 0**（`sound`／`sounds`／`smell`／`smells`／`taste`／`tastes`／`feels`／`felt`／`seem`／`appear` 逐词复算），**唯一例外是 `feel`（27 处）**。→ **第 2 课起就是「全库零词架」的造词课**——**正是批十九判「3 课封顶」的同一个硬伤**，**且本候选比批十九更严重**（**批十九有 16 处垫子，本候选只有 1 句 `feel`**）。

**若仍要做，最大自然容量＝2–3 课**：
- **L128「它听起来不错」**（`sound`，`Your job sounds really interesting.`／`That sounds like a good idea.`）——**`sound` 是 A2、与 `look`（A2）同段位**，**可直接续用 L125 `It looks nice.` 的骨架换词**；
- **L129「闻着香／尝着怪」**（`smell`／`taste`，B1 两词合课——**两词的词典形式标注都是 `[L only + adj]`，结构完全相同**，合课是结构合并不是换词）；
- **L130「我感觉……」**（`feel`，**唯一有垫子的词**）；
- **收口**（`The cake smells good.`／`This sauce tastes strange.`／`Your skin feels smooth.`／`The idea sounds great.` 四句排一行——**中文侧四条 ❌ 的正面版**）。
→ **2–3 课（推荐 3 课），且必须同时造 `sound`／`smell`／`taste` 三词底座**。

### 6.3 `look` 是否应排除？——**应当排除，理由四条**

1. **已被批十九占用**（L125–L127 三课已交付，`season-19` 已开）——**同一批内不得再教 `look` 新义项**（**L130 若要切「同一个 look 三张脸」，那是首选方案里的「切开课」，不是感官动词章成立的理由**）。
2. **若硬把 `look` 算作第五个成员，会与 L127 的收口直接冲突**：**L127 的 oneLineRule 已明文「同一个 look，两张脸…说的就不是一件事」**——**批二十若再把它当「新成员」教一次，等于宣告 L127 没收口**。
3. **上游也不把 `look` 与四词同级**：**Cambridge `sound` 有独立小条 `sound good, interesting, strange, etc.`（A2），`smell`／`taste` 是 B1 `[L only + adj]`**，**而 `look` 的 (SEEM) 在 ASE 义项下（A2）**——**分属不同词条结构**；**BC `stative-verbs` 表内 `look` 与 `feel`／`smell`／`taste` 同列，但 `sound` 不在**——**任一源都给不出「五词一族」的整齐名单**。
4. **正确用法是「排除 `look`，但在 L130 切开课里借用它」**：`Look at the clouds!`／`The sky looks dark.`／`I'm looking forward to…` **三张脸同屏**——**`look` 以「已学过的老朋友」身份出场，不是「新教的第五个词」**。→ **这与批十九处理 `look like` 的方式一致（认读、不扩）**。

### 6.4 `feel` 27 处的性质（**口径校正**）

**逐行复算结果（本轮实算）**：**`feel` 在 `grammarLessons.ts` 共 27 处，全部集中在两课**——**L76 占 22 处、L78 占 5 处**；`huntCases.ts` 4 处（**case #56 `hunt-advice-note`／#84 `hunt-feel-better`／#85 `hunt-feel-better`（`I feel tired today.` 在 tokens 内）／#87 `hunt-full-day`**）；**`feels` 0／`felt` 0／`feeling` 1 处（L76 `Are you feeling better?`）**。

**性质判定三条**：
1. **批十九记「`feel` 27 处（全在 L76 同一句）」不完整**：**L78 有 5 处**（L78 的对比卡 `I feel very better today.` ❌ 对 `I feel much better today.`——**它是 L76 的对比卡回流，属于同一句的另一课回显**）。→ **性质上仍是「同一句 `I feel much better today.` 及其跨课回显」**，**但表述应写「L76 ＋ L78 回显」**。
2. **`feel` 的底座是「加力句的承载词」，不是「感觉动词的垫子」**：**L76 的 grammarLabel 是「加力 · much + 更…」，`feel` 只是被选中的谓语**（`I feel much better today.` 的考点是 `much`，不是 `feel`）。→ **它能为感官动词章提供的垫子只有 1 句**（`I feel much better today.`／`Are you feeling better?`）——**撑不起一课**（**对比批十九 `look` 的 16/16 全是 `look + 形容词` 同构句**）。
3. **`feel` 的词典标位（A1）比 `look`（A2）更早，但那是「感觉／觉得」的宽义项**：**Cambridge 逐字 `A1 [ L or T ] to experience something physical or emotional`**，例 `My eyes feel really sore.`／`I never feel safe when Richard is driving.`——**这些例句的形式是 `feel + 形容词`，与 `smell`／`taste` 的 `[L only + adj]` 同构**，**但 A1 义项覆盖「觉得」宽义（`How would you feel about moving…`），并非专指「起来」义**。→ **引用时必须写「A1 义项（EXPERIENCE），`[ L ]` 标记在该义项内出现，非独立小条」**（**批十九已这么记，本轮复核一致**）。

---

## §7 口径校正（本批须修正前批结论）

| # | 前批表述 | 本轮实测 | 校正动作 |
|---|---|---|---|
| 1 | 批十九路线图 §6.2：「**Murphy 中级册内单元**」（指 `look forward to`） | **双册 TOC `forward` ＝ 0／0**（PDF 流二次验证）；**中级只有 U62 `Verb + preposition + -ing (succeed in -ing / insist on -ing etc.)` 属同一块，标题内举例是 `succeed in`／`insist on`** | **改写为**：「**Murphy 中级 U62 为 `verb + preposition + -ing` 单元（标题内举例 `succeed in`／`insist on`），`look forward to` 未见于双册 TOC 抽文；依据只能写到「同块」层级**」。**不得**写「Murphy 中级有 `look forward to` 单元」 |
| 2 | 批十八／十九：「Cambridge `look-forward-to` 页**无 CEFR**」 | **语法页确实无 CEFR**；**但词典页 `dictionary/english/look-forward-to` 有义项级 CEFR ＝ B1（＋B2 信尾）**，**本轮首次取到** | **改写为**：「**语法页无 CEFR；词典义项级＝B1（`[+ -ing verb]`）／B2（正式信尾）**」——**对外必写「词典义项级 B1」，不得只写「无 CEFR」** |
| 3 | 批十九路线图 §6.2：「中文侧 sitemap 有两篇（`look-forward-to`／`look-forward-to-2`）」（**转述级，未实读**） | **两篇本轮全部直连 HTTP 200 实取原文**（批十八只取到过一篇缓存）；**病灶描述与首屏 ❌ 自测对全部逐字落地** | **升为原文级**；**下游可引用**（§1.4 EC-1／EC-2 逐字） |
| 4 | 批十九竞析：「`feel` 27 处（**全在 L76 同一句**）」 | **27 处分布＝L76 22／L78 5**（`feels` 0／`felt` 0／`feeling` 1 在 L76） | **改写为**：「**27 处集中在 L76（22）与 L78（5，L76 对比卡的跨课回显）**；性质仍是『同一句 `I feel much better today.` 及其回显』」 |
| 5 | 批十九路线图 §6.2：形容词＋介词「`good at` **raw 48 处**（数析记 40／瑞思记 GL 52＋HC 6——三记不同）」 | **本轮复算：`good at` GL 52／HC 6**（`grep -oiF` 两文件） | **以 `good at` GL 52／HC 6 为准**；**「48」不引**；**计数口径差异的说明保留**（生产引用时以实读登记为准） |
| 6 | 批十九竞析／路线图：BC `stative-verbs`「`sound` 不在表内」 | **本轮 Wayback 复取确认：`sound` 不在主表、不在 sometimes 表**（`feel`／`look`／`smell`／`taste` 都在主表） | **维持**；**并补记「`sound` 在 Cambridge `Linking verbs` 名单内」＝两源不一致须并列写出** |
| 7 | 批十八竞析：「中文侧 `causative-verbs` 的使役動詞被動句型」（转述级） | **本轮直连 200 实取原文**（`I had my hair cut.`／`I'll have the laptop checked asap.`／`He had his smartphone fixed.`／get 版三句／坏事用法两句） | **升为原文级**；**档位不变（`have sth done` 维持撤出）** |
| 8 | （新增表述）批十九／批二十路线图未记：「BC 最近邻课 `Verbs and prepositions` 是否含 `look forward to`」 | **本轮双通道实取：明文不含，且页面不教 -ing 规则** | **新增为「BC 复核结论」**（§1.1 BC-5）；**对外可写「BC 的 `verb + preposition` 课不收 `look forward to`」** |

---

## §8 复核来源清单 ＋ 未核实声明

### 8.1 本轮实读源清单

**上游交付物（3 份，本轮实读）**：`roadmap-grammar-nineteenth-batch-2026-09-19.md`（§6.2 批二十候补清单／§7 决策记录／§5 风险 6 节奏问题／§4.5 术语红线，**逐节实读**）·`competitive-analysis-grammar-nineteenth-batch-2026-09-19.md`（批十九竞析，**逐节实读**，作为「转述级」基线）·`competitive-analysis-grammar-eighteenth-batch-2026-09-19.md`（§1.1–1.4 源表／§2 对比表／§8 未核实，**实读**）。

**代码／数据（本轮独立复核，实读＋复算）**：`src/data/grammarLessons.ts`（**23,980 行／127 课**，`lesson-(\d+)-` 边界法逐课归属＋31 个候选词 regex 复算）·`src/data/huntCases.ts`（**7,697 行／136 案**，同法复算）·`src/data/grammarSeasons.ts`（**19 季**，逐季课数复算：season-18＝6／season-19＝3）·`src/pages/GrammarPathPage.tsx`（`:262` m21 `afterLesson: 127`）·`src/data/grammarZeroTerms.ts`（**29 词**，逐字实读，含「形容词」「副词」「介词」）·`src/services/grammarAmbushService.ts`（`:160-187` 词表：`look`／`looks` 在、`feel`／`sound`／`smell`／`taste`／`seem`／`appear` 不在）。

**外部源（本轮新取 18 页；沿用缓存 12 页）**：

| 源 | 页面 | 取法 | 落盘／md5 |
|---|---|---|---|
| BC | A1-A2 索引 18 课全目 | WebFetch 直连 | — |
| BC | B1-B2 索引 36 课全目 | 本机存档 `bc-b1b2-new.html`（2026-04-21 快照）＋**Wayback WebFetch 二次复核** | `/private/tmp/bc-b1b2-new.html` |
| BC | C1 索引 14 课全目 | **Wayback WebFetch**（本轮取到） | — |
| BC | `b1-b2-grammar/verbs-and-prepositions` | **curl 直连 403 → WebFetch 原文**；`bc_verbprep_live.html`（403 落盘，411 bytes，**失败留痕**） | — |
| BC | `b1-b2-grammar/stative-verbs` | **Wayback WebFetch** | — |
| BC | `free-resources/grammar/a1-a2/adjectives-prepositions`（**新取**） | **Wayback curl**（`20260421105742`） | `/private/tmp/bca_adjprep.html` md5 `6a845049b7d2cc4e3c27487caa5709b3` |
| BC | `free-resources/grammar/a1-a2/verbs-followed-ing-or-infinitive`（**新取**） | **Wayback curl** | `/private/tmp/bca_verbs_ing.html` md5 `b7ce0dbc2b8bf77682b8c617b6c1c397` |
| BC | 参考层 `infinitives`（`'to'-infinitives`） | 本机存档（Wayback 2024-09-10） | `/private/tmp/bc-inf.html`／`bc-inf.txt` |
| Cambridge | `grammar/british-grammar/look-forward-to` | 批十八缓存**逐字复核** | `/private/tmp/b18_cam_lookfwd.html` md5 `5b564d4afba6dcc60e4091ae9d49dd8c` |
| Cambridge | **`grammar/british-grammar/word-patterns-look-forward-to`（新取）** | **curl 直连 200** | `/private/tmp/camw_word-patterns-look-forward-to.html` md5 `52f1cdd5e2acdbaecaadd575bb9fdfd3` |
| Cambridge | **`grammar/british-grammar/word-patterns-look`（新取）** | curl 直连 200 | `/private/tmp/camw_word-patterns-look.html` md5 `44553e8d466711f415bafd20c36e5c52` |
| Cambridge | **`grammar/british-grammar/word-patterns`（总索引，新取；**102 专条全目**） | curl 直连 200 | `/private/tmp/camw_index.html` md5 `9595526009e9bcf6035caddf45cc4d95` |
| Cambridge | **`word-patterns-succeed`／`word-patterns-think-of-doing-something`（新取）** | curl 直连 200 | `camw2_word-patterns-succeed.html`／`camw2_word-patterns-think-of-doing-something.html` md5 `905b0f3690f4116914542d93503fa816` |
| Cambridge | **`dictionary/english/look-forward-to`（新取）** | curl 直连 200 | `/private/tmp/camd_look-forward-to.html` md5 `6cd4485944190941f388379127755d5a` |
| Cambridge | **`dictionary/english/object-to`／`dictionary/english/object`（新取）** | curl 直连 200 | `camd_object-to.html`／`camd2_object.html` |
| Cambridge | **`grammar/british-grammar/verb-patterns`（新取）** | curl 直连 200 | `camg_verb-patterns.html` md5 `d094c4b43494bd655cc790bc2e126d09` |
| Cambridge | **`grammar/british-grammar/prepositional-verbs`（新取）** | curl 直连 200 | `camg_prepositional-verbs.html` md5 `208f35eb885cdbb12c29bd46d5e35ec7` |
| Cambridge | **`grammar/british-grammar/verb-patterns-with-and-without-objects`（新取）** | curl 直连 200 | `camg_verb-patterns-with-and-without-objects.html` |
| Cambridge | **`grammar/british-grammar/to`（复核批十八缓存）** | 缓存逐字 | `/private/tmp/b18_cam_to.html` md5 `6765db12b8c5ddfe0c4a442a0295be2a` |
| Cambridge | `grammar/british-grammar/have-something-done`（**复取**） | curl 直连 200 | `camg_re_have-something-done.html` md5 `bfded7df91e227dbf624bc0f844ae2a3` |
| Cambridge | `adjective-phrases-typical-errors`／`verbs-followed-by-ing-or-infinitive`／`linking-verbs` | 沿用批十八／十九缓存 | `b18_cam_adjerr.html`／`camg_verbs-followed-by-ing.html` 等 |
| Cambridge | `dictionary/english/feel`／`sound`／`smell`／`taste`／`seem`／`look` | 沿用批十九缓存 `/tmp/audit19/` | `feel.html` md5 `79557414421e6fb7c1dbfc63dc5b993b` 等 |
| Murphy | 中级 4th TOC 全目 | 本机原件＋PDF 流解压复算 | `/private/tmp/murphy_int.txt`／`murphy_full.txt`／`murphy_int.pdf`（50 streams／330KB） |
| Murphy | 初级 4th TOC 全目 | 本机原件＋PDF 流解压复算 | `/private/tmp/murphy_ess.txt`／`murphy_ess.pdf`（57 streams／311KB） |
| 中文侧 | **`look-forward-to`（新取，直连 200）** | curl | `/private/tmp/ec_lft_live.html` md5 `f83657c97d146bd1d40f4fcab758dc72` |
| 中文侧 | **`look-forward-to-2`（新取，直连 200）** | curl | `/private/tmp/ec_lft2_live.html` md5 `9a84fee75b286a4c55b854fc06cfdf31` |
| 中文侧 | **`causative-verbs`（新取）**／**`gerund-infinitive-verb`（新取）**／**`to-for`（新取）** | curl 直连 200 | `ec_causative-verbs.html`／`ec_gerund-infinitive-verb.html`／`ec_to-for.html` |
| 中文侧 | `sense-verbs`（缓存）／`linking-verbs`（缓存）／`adjectives`（缓存）／sitemap 869 条 | 本机缓存 | `/private/tmp/ec2_sense-verbs.body.txt`／`b18_ec_linking.html`／`ec_adj.html`／`ec-urls.txt` |
| Duolingo | `duolingo.com/course/en/zh/Learn-English` | **curl 200 但仅 8,719 bytes 反爬页** | **失败留痕**（不引数据） |

### 8.2 未核实声明（7 条）

1. **单元内部例句未核**：Murphy 双册**只有 TOC 抽文（非正文）**——**U60／U61／U62 的正文例句、页码、练习量均未核实**；**「`look forward to` 是否出现在 U60 或 U62 的正文里」本轮无法回答**（**这是本报告最大的一处证据缺口**，须在生产期登记或人工翻书确认）。`U62` 的标题内举例是 `succeed in -ing`／`insist on -ing`，**这对 `look forward to` 只能算间接依据**。
2. **BC `using-as-and-like` 页本轮未重取**（批十八／十九实读缓存充足，且结论无变化）——**`He looks like his dad.` 系批十八原文，本轮未复核**。
3. **中文侧 `object to` 未穷举**：sitemap regex 复算**只覆盖 slug 内含 `object` 的三篇**（均无关）；**未探测其他写法**（如「反對」「介系詞 to」类 slug），**也未在站内搜索**。→ **「中文侧 `object to` 零专文」的表述应弱化为「sitemap slug 层面未发现」**。
4. **Cambridge `object-to` 语法页不存在**：直连该 slug 返回 `Say or tell?`（HTTP 200 但内容为相邻条目）——**本轮据此判定「该 slug 未登记」，但未穷举 Cambridge 的其他写法**（如 `object`、`verb-patterns-object`）。→ **`object to` 的「无语法专页」表述以此为限**。
5. **BC A1-A2 第 18 课（`verbs-followed-ing-or-infinitive`）本轮取到的是 Wayback 2026-04-21 快照**（直连 404）；**存档与线上的当轮差异未核**。同批的 A1-A2 第 1 课（`adjectives-prepositions`）同样来自该快照。
6. **Duolingo 未核实**（本轮 1 次尝试，返回 8,719 bytes 反爬页；批十九三次尝试全败）——**本报告不引任何 Duolingo 数据**；§4.4 的「Duolingo 无章」判断**基于批十九记录，本轮未复核**。
7. **封面／资产账未核**（属数析口径，本轮不做）：127 课对 117 张 jpg 的复用情况、`cover` 池余量须由数析另出。

### 8.3 本轮不引的内容（负清单，防下游误用）

- **不引** `look forward to` 的**信尾正式度四档**（`I look forward to your reply.` ＞ `Look forward to your reply.` ＞ `I'm looking forward to your reply.` ＞ `Looking forward to your reply.`）——**零基础用户不需要「正式度排序」，且会引入「书信体裁」场景负担**（EC-1 原文在册，仅备查）。
- **不引** Cambridge `look` 的 **discourse marker 义**（`Look, too many people have died in this war.`）——**强口气用法，与我方祈使义 `Look!` 冲突**（沿用批十九负清单）。
- **不引** `object to` 的 `[ + that clause ] She objected that the price was too high.`——**从句形式超出本批容量**（我方零术语红线含「从句」）。
- **不引** EC-2 的 `expect`／`anticipate` 两个词做教学内容——**该篇是「期待」三词辨析，但 `anticipate` 的 `+ Ving` 属同族第三词，超纲**；**只借它的「`look forward to + N/Ving`」形式标注**。
- **不引** Cambridge `word-patterns` 102 专条中的其余条目（`avoid doing`／`enjoy doing`／`consider doing`／`be worth doing` 等）作为本批内容——**它们是清单不是结构**（同 `have sth done`／形容词＋介词被撤出／折卡的理由）。

---

## 附录 A：批二十决策清单（供主理人拍板，5 条）

| # | 决策点 | 本轮竞析建议 | 依据 |
|---|---|---|---|
| A1 | **章量：大章（5 课）还是小章（3 课）** | **大章 5 课（L128–L132）**；若工作量受限取备选 A（3 课） | §4.1 五格逐条（无空格）；§4.4-2「内容容量决定章长」 |
| A2 | **`object to` 是否上正课** | **不上正课**（判 C）；**最多在 L131／L132 折一句认读** | §3 序 2（证据半页＋语义场景不友好） |
| A3 | **`look like` 是否在本批扩** | **不扩**（维持 L127 认读） | §5.2-3（三源均不并列；四度三缺） |
| A4 | **感官动词章是否备选保留** | **保留为备选 B（2–3 课）**，**但排在首选之后**；**`look` 排除** | §6.2 四条硬理由／§6.3 四条 |
| A5 | **造词课对外表述** | **B＋ 档；明写「跨源有词典与专页证据，但 BC 无课程位、Murphy 无 TOC、我方零底座，须先造词架」** | §4.5 第 4 条 |

## 附录 B：本轮关键原文速查（生产可直接引用，逐字）

| 用在哪 | 原文（逐字） | 出处 |
|---|---|---|
| **核心规则句（英文最硬）** | "The 'to' in look forward to is a preposition, so we must follow it by a noun phrase or a verb in the -ing form" | Cambridge `grammar/british-grammar/look-forward-to` |
| **现成 ❌ 1** | "Not: … looking forward to go to Switzerland …" | 同上 |
| **现成 ❌ 2（本轮新记）** | "Not: We're looking forward to he arriving next week." | 同上 |
| **现成 ❌ 3（本轮新取）** | "Do not say 'look forward to do something', say look forward to doing something"＋`I look forward to meet you at the conference.` | Cambridge `word-patterns-look-forward-to` |
| **词典义项标位（本轮新取）** | "B1 to feel pleased and excited about something that is going to happen… **[ + -ing verb ]** She was looking forward to seeing the grandchildren again." | Cambridge `dictionary/english/look-forward-to` |
| **同族一句列举（本轮新取）** | "Some verbs are followed by the preposition **to**, including **be used, get used, listen, look forward, object**, reply, respond" | Cambridge `grammar/british-grammar/to` |
| **`to + -ing` 体系页（本轮新取）** | "The object can be a noun phrase, a pronoun or **the -ing form of a verb**"（词表含 `look forward to`） | Cambridge `grammar/british-grammar/prepositional-verbs` |
| **BC 规则句（A1-A2 课程正文）** | "Remember that **a preposition is followed by a noun or a gerund (-ing form)**." | BC `adjectives-prepositions`（A1-A2 第 1 课） |
| **BC 规则句（参考层评论区）** | "**prepositions require subsequent verb forms to be in the '-ing' form in English. This is one of the few rules that has no exceptions in English!**" | BC `english-grammar-reference/infinitives` 评论（LearnEnglish Team，2022-08-10） |
| **中文侧病灶描述** | "很多人一看到 to 就會反射動作加上原形動詞，但是 look forward to 的 to 是介系詞，後面如果遇到動詞要加上 ing 才對唷！" | english.cool `look-forward-to` |
| **中文侧首屏 ❌ 自测对** | `I look forward to visit you tomorrow. ❌` 对 `I look forward to visiting you tomorrow. ⭕️` | 同上 |
| **中文侧形式标注** | "look forward to + N/Ving" | english.cool `look-forward-to-2` |
| **`have sth done` 警告（复核不变）** | "This pattern is not the same as the present perfect or past perfect." | Cambridge `have-something-done` |
| **感官四词段位（本轮复核）** | feel **A1** `[ L or T ]`／sound **A2**（`sound good, interesting, strange, etc.`）／smell **B1** `[ I , L only + adj ]`／taste **B1**（`taste good, bad, sweet, etc.`） | Cambridge 词典页（批十九缓存） |

---

*报告完。本轮共实读外部源 30 页（新取 18／沿用缓存 12），复核代码 6 文件，口径校正 8 条，未核实 7 条。*
