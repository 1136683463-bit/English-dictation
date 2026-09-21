# 第十九批候选竞品研究：`look + 形容词` 升格（原文级复核）＋ look 家族边界

**作者**：竞析（竞品分析）｜**日期**：2026-09-19｜**批次**：语法线第十九批（课号自 L125 起）
**上游**：`roadmap-grammar-eighteenth-batch-2026-09-19.md` §6.2（批十九候补清单，一次提交）＋ §7（决策记录）＋ §附录 A（实读源清单）；批十八竞析（`competitive-analysis-grammar-eighteenth-batch-2026-09-19.md`，乙项为「转述级」）
**本轮口径**：批十八已把候选圈定（第 1 项 `look + 形容词` 升格为首选，第 2／3／4／5 项维持原判），本轮**不再重跑五源全目**，只做三件事——① 把 `look + 形容词` 的**跨源证据逐页落到原文**（批十八是「转述级」，本轮升到「原文级」）；② 新增**边界专节**（`look + 形容词` 对 `look like`／`look at` 的隔离设计）；③ 新增 **`feel` 可行性专节**（批十八建议「只取 look 一族＋1 个 feel」，本轮核查它能否撑起第 3 课）。第 2–5 项**只做复核并标注有无口径变化**。

**本机复核基线（本轮实读）**：`src/data/grammarLessons.ts` **md5 `ab2f56a6497b007548c9b8552bbe7f63`／23,398 行／124 课**（批十八记 `0646475e…`／22,238 行／118 课——**已交付批十八 6 课，基线前移**）·`src/data/huntCases.ts` **md5 `d3d6ec77f6b082f5c0813c790a025fd7`／7,565 行／133 案**（尾案 `:7560` #133）·`src/data/grammarSeasons.ts` **md5 `d99de30f015d52fb241f30ab66f45f8c`**（`:54` 末项 season-18 `{min:119,max:124}`，**18 季**）·`src/pages/GrammarPathPage.tsx` **`:255` m20 `afterLesson: 124`**（共 20 个里程碑）·`src/data/grammarZeroTerms.ts` **md5 `e767bfea6f2e0c7b4ad83ec530eccbab`**（**29 词**，含「形容词」）·`src/services/grammarAmbushService.ts` **md5 `84b306b40e881c4f9b8c8d000851686c`**（`:160-187` 词表，**逐字复核**）。

---

## §0 本轮结论速览（7 条）

1. **`look + 形容词` 的原文级证据全部取到，且「同页并列」形态比批十八记录更硬**：Cambridge 词典 `look` 义项 **(SEEM) 标 A2** 本轮**逐字实取**（HTML 里是 `class="epp-xref dxref A2"`，本轮实测义项级标位正是 **A2**，同页 SEE＝A1／SEARCH＝A1／DIRECTION＝B2）；**同一义项块内**「**+ 形容词**」（`You look well!`／`The roads look very icy.`／`That dress looks nice on you.`）与「**look like + 名词短语**」（`He looked like a friendly sort of person.`／`The twins look just like their mother.`）与「**look as if / as though + 从句**」（`She looked as if she hadn't slept all night.`／`He looked as though he might fall at any moment.`）**三条同段顺序排开、不下小标题**——这是「三兄弟同页并列」的**词典级**先例；Cambridge **语法页 `Look`** 则把它们**切进同页的三个连续小标题**（`Look as a linking verb` → `look like + noun phrase` → `look as if / as though + clause`）。
2. **BC 侧本轮取到「课程层唯一落点」的原文，且三档索引全目复核完毕**：参考层 `where-adjectives-go-in-a-sentence`（**Level: beginner**）原文逐字＝"We use adjectives to describe nouns." / "Most adjectives can be used **in front of a noun**:" / "or **after a link verb like be, look or feel**:"＋例句 `They have a beautiful house.`／`We saw a very exciting film last night.`／`Their house is beautiful.`／**`That film looks interesting.`**；**A1-A2 18 课／B1-B2 36 课全目本轮逐条复点**（18＋36 两份清单完整取到，见 §1.1），`look` 家族课**仍然零**；**C1 14 课全目本轮改由存档取到**（批十八记 403，本轮取到清单，仍无 look 家族课）。
3. **Murphy 中级 U99 标题逐字复核无误**：`99 Adjectives: a nice new house, you look tired`——**标题第二半就是 `you look tired`**，位于 `Adjectives and adverbs` 块，**U98 `Adjectives ending in -ing and -ed (boring/bored etc.)` 之前、U100 `Adjectives and adverbs 1 (quick/quickly)` 之后**；**初级册（4th）无对应单元**（本轮**逐字复点**：初级 `look` 仅出现在 **U113 `listen to, look at etc. (verb + preposition)`** 标题里，动作义；初级**无 `feel`／`sound`／`smell`／`taste` 任何单元**）；**`look like` 相关单元复核为中级 U117 `like and as`／U118 `like as if`**（无独立 `look like` 单元）。
4. **中文侧 `look + 形容词` 三篇内容级落点本轮全部逐字落地，4 条副词误用 ❌ 原样记下**：`linking-verbs`（**`He looks smart.` 对 `He looks angrily at her.` 的显式切开**＋`Her skin feels smooth. ⭕️` 对 `Her skin feels smoothly. ❌`）、`sense-verbs`（**五词「……起來」**＋明文"**所以後面是加形容詞**"＋**❌ 四条**）、`adjectives`（**明列 `get / become / look / sound / smell / taste / feel / seem / appear` 后可接形容词**＋`This dress looks nice.`）。**`look-like` 专文直连本轮复取仍 404**（`<title>Page not found</title>`）；sitemap 869 条里 `look` 家族**只有 `look-forward-to` / `look-forward-to-2` 两条**。
5. **`feel` 撑不起第 3 课——这是本轮最重要的负面结论**。跨源位置：**BC 无 `feel` 课**（仅 beginner 参考页把它与 look 并列举例＋B1-B2 stative 表收录）；**Cambridge 词典 `feel` (EXPERIENCE) 标 A1** `[ L or T ]`（`My eyes feel really sore.`／`He's still feeling a little weak…`）；**Murphy 初级／中级双册 TOC `feel` 全 0**（逐字复点）；**中文侧 `feel` 无专文**（挂 `linking-verbs` 的「……起來」类与 `sense-verbs` 的五词表内）。**我方词架实测**：`feel` 课文件 **28 处全部集中在 L76（23）／L78（5）**，且**全部是同一个句子 `I feel much better today.` 的变体**（含 target、tokens、answer、wrong／correct、replaceBase）——**不是「feel＋形容词」的复现池，是「much + 比较级」一课的单句回响**；`feels` **全库 0**；`felt` **全库 0**；`seem`／`appear`／`sound`／`smell`／`taste` **课＋案两文件全 0**。→ **建议第 3 课不押 `feel`，改为「同一个 look、两张脸」的隔离收口课**（见 §4.1／§6）。
6. **边界隔离有现成三段先例，且本轮拿到「动作义 vs 描述义」的上游明文**：Cambridge 语法页 `Look` **明文"does not take an object"** 对 **`Look at, see or watch?` 页明文"Warning: When look has an object, it is followed by at: Look at the rain. It's so heavy. Not: Look the rain."**——**两页分工把「不带东西的 look」与「带 at 的 look」正面对照**（我方话术可用依据）；中文侧 `linking-verbs` 的 `He looks smart.` 对 `He looks angrily at her.` 与 `sense-verbs` 的 `The kid looks happy.` 对 `The kid is looking happily at the photo.` 是**两处**「同一个 look、两张脸」的显式切开（批十八只记了一处）。
7. **我方现状逐条复核：`look + 形容词` 共 16 处（同构池 14＋变体 2），本轮补出完整清单与字段归属**（**16 处全为 `dialogue[].en`、`who:"npc"`**；**其中 L121／L123 两处是批十八新交付课自带、批十八只记了 L121**）；**`look` 从未进过任何一课 `grammarLabel`（124 课全量 regex 复算＝0）**；**`look`／`looks` 在 cloze 词表内**（本轮逐字复核 `:172`）；**`look at` 支另有 7 处、`look for` 支另 3 课**（动作义，**与 `look + 形容词` 必须隔离**）；**`look like` 全库仅 1 处**（L49 `:8977` `It looks like rain.`，天气义）；**HC 侧 5 处 `look`／`Look`**（#25 `I look younger,` 是**合法句**、#35／#59 `Look at…`、#62 `Look!`、#44 `look in`）**无一处针对 `look + 形容词` 设错**——**零冲突、零负迁移池**。

---

## §1 复核结果：逐源列出实际取到／未取到的页面与要点

### 1.1 British Council LearnEnglish（BC）

| # | 页面 | 取到情况 | CEFR 标签 | 本轮要点（**原文级**） |
|---|---|---|---|---|
| BC-1 | `english-grammar-reference/where-adjectives-go-in-a-sentence` | ✅ **本轮实取（WebFetch 原文）**；批十七／批十八已取，本轮逐字重核 | **Level: beginner** | **逐字原文**："We use adjectives to describe nouns." → "Most adjectives can be used **in front of a noun**:" → "**or after a link verb like be, look or feel:**"。例句原文：`They have a beautiful house.`／`We saw a very exciting film last night.`／`Their house is beautiful.`／**`That film looks interesting.`**。**全页无 "Not:" 错例**（最接近的是评论区教师回复「不宜把 not + 形容词放名词前」，给 `an unfashionable dress`／`She didn't buy a fashionable dress.`）；`sound` **只出现在评论区**（"It sounds interesting"），**正文不提 sound**。→ **`look + 形容词` 的课程层唯一落点确认，段位＝参考层 beginner（参考页不是课程页）** |
| BC-2 | A1-A2 索引（**18 课全目**） | ✅ **本轮完整取到**（WebFetch 逐条） | **A1-A2 grammar 段** | 18 课全目（原序）：`Adjectives and prepositions`／`Adjectives ending in '-ed' and '-ing'`／`Articles: 'a', 'an', 'the'`／`Articles: 'the' or no article`／`Comparative adjectives`／`Infinitive of purpose`／`Nouns: countable and uncountable`／`Past continuous and past simple`／`Possessive 's`／`Prepositions of place: 'in', 'on', 'at'`／`Prepositions of time: 'at', 'in', 'on'`／`Present simple`／`Present simple: 'have got'`／`Present simple: 'to be'`／`Quantifiers: 'few', 'a few', 'little' and 'a bit of'`／`Question forms`／`Using 'there is' and 'there are'`／`Verbs followed by '-ing' or infinitive`。→ **`look` 家族课零、stative／linking 课零**（确认批十八判读） |
| BC-3 | B1-B2 索引（**36 课全目**） | ✅ **本轮逐条复点**（本机 2026-04-21 存档 `bc-b1b2-new.html` 实读，比 WebFetch 的单课页更完整——WebFetch 直连返回的是单课页而非索引） | **B1 Intermediate ＋ B2 Upper intermediate** | 36 课（原序）：`Adjectives: gradable and non-gradable`／`British English and American English`／`Capital letters and apostrophes`／`Conditionals: third and mixed`／`Conditionals: zero, first and second`／`Contrasting ideas: 'although', 'despite' and others`／`Different uses of 'used to'`／`Future continuous and future perfect`／`Future forms: 'will', 'be going to' and present continuous`／`Intensifiers: 'so' and 'such'`／`Modals: deductions about the past`／`Modals: deductions about the present`／`Modals: permission and obligation`／`Modifying comparatives`／`Passives`／`Past ability`／`Past habits: 'used to', 'would' and the past simple`／`Past perfect`／`Phrasal verbs`／`Present perfect`／`Present perfect simple and continuous`／`Present perfect: 'just', 'yet', 'still' and 'already'`／`Question tags`／`Reflexive pronouns`／`Relative clauses: defining relative clauses`／`Relative clauses: non-defining relative clauses`／`Reported speech: questions`／`Reported speech: reporting verbs`／`Reported speech: statements`／`Stative verbs`／`The future: degrees of certainty`／`Using 'as' and 'like'`／`Using 'enough'`／`Verbs and prepositions`／`Verbs followed by '-ing' or infinitive to change meaning`／`Wishes: 'wish' and 'if only'`。→ **`look` 家族课零**（确认） |
| BC-4 | C1 索引（**14 课全目**） | ⚠️ **直连仍失败**（curl 三次超时／WebFetch 单课页），**本轮改由存档取到全目** | **C1 grammar 段（C1 Advanced）** | 14 课（原序）：`Advanced passives review`／`Advanced present simple and continuous`／`Avoiding repetition in a text`／`Contrasting ideas`／`Ellipsis`／`Emphasis: cleft sentences, inversion and auxiliaries`／`Inversion after negative adverbials`／`Inversion and conditionals`／`Modals: probability`／`Participle clauses`／`Patterns with reporting verbs`／`Possession and noun modifiers`／`Unreal time`／`Word order in phrasal verbs`。→ **`look` 家族课零**；**批十八「C1 403 未复核」的缺口本轮补上** |
| BC-5 | `b1-b2-grammar/stative-verbs` | ✅ **本轮实取（WebFetch 原文）** | **B1 Intermediate ＋ B2 Upper intermediate** | 规则原文："**Stative verbs describe a state rather than an action. They aren't usually used in the present continuous form.**"；动词表**逐条**：agree, believe, doubt, guess, imagine, know, mean, recognise, remember, suspect, think, understand, dislike, hate, like, love, prefer, want, wish, appear, be, **feel**, hear, **look**, see, seem, **smell**, **taste**, belong, have, measure, own, possess, weigh。**`sound` 不在表内**（复核批十八一致）。错例用的是删除线式而非 "Not:" 标签：`I'm not knowing the answer.`／`She's really liking you.`／`He's seeming happy at the moment.` → **不能当 `look + 形容词` 的课位证据，仍只能作背景** |
| BC-6 | 参考层总索引 `english-grammar-reference` | ✅ 本轮实取 | 无段位标（侧栏分 A1-A2／B1-B2／C1） | 七大类：`Pronouns`／`Determiners and quantifiers`／`Possessives`／`Adjectives`／`Adverbials`／`Nouns`／`Verbs`。`Adjectives` 类下 7 页：`Where adjectives go in a sentence`／`Adjectives with '-ing' and '-ed'`／`Adjective order`／`Comparative and superlative adjectives`／`Intensifiers`／`Mitigators`／`Noun modifiers`。→ **无 `Linking verbs` 条目、无 `look` 条目**（**复核批十八判读一致**） |
| BC-7 | `b1-b2-grammar/using-as-and-like`（`look like` 的上游） | ✅ 沿用批十八实读（本轮未重取，见 §8 未核实②） | **B1＋B2** | `He looks like his dad.`／`She looks like her mother.`／`He looks as if he hasn't slept.` → **`look like` 仍在 B1 段**，维持认读 |
| BC-8 | 参考层 `verb-phrases` 等 | ✅ 批十八已取，本轮沿用 | beginner＋intermediate＋advanced 三档同页 | **无 `look + 形容词`、无系动词条目**（与批十七／十八一致） |
| BC-9 | `used-to`／`be-used-to`／`adjectives-with-ing-and-ed` 参考页 | ❌ 仍 404（批十七已记，本轮未重试穷举） | — | 维持原口径 |

**BC 小结**：`look + 形容词` **三档 68 课零课程位**（A1-A2 18／B1-B2 36／C1 14 三份全目本轮**全部完整复点**，批十八的 C1 缺口已补）；唯一落点是**参考层 beginner 一页**。→ **批十八「BC 无课位」判读完全成立，本轮无口径变化。**

### 1.2 Cambridge Dictionary（Cambridge）

| # | 页面 | 取到情况 | CEFR 标签 | 本轮要点（**原文级**） |
|---|---|---|---|---|
| CAM-1 | `dictionary/english/look`（词典页） | ✅ **本轮直连实取**（HTTP 200，md5 `b55f3c8698d0444e8aa15d95e4df22ec`，**与批十八缓存逐字节相同**） | **义项级标位**：SEE＝**A1**／SEARCH＝**A1**／**SEEM＝A2**／DIRECTION＝**B2**／HOPE(`be looking to`)=**C2** | 义项 **(SEEM)** **逐字原文**：`A2 [ L, I usually + adv/prep ] to appear or seem:` 例 **`You look well!`**／**`The roads look very icy.`**／`That dress looks nice on you.`／`He has started to look his age (= appear as old as he really is).`／`It's looking good (= things are going well).` → **同块内紧跟三条**：`look like` `He looked like a friendly sort of person.`／`look like` `The twins look just like their mother.`／`look as if` `She looked as if she hadn't slept all night.`／`look as though` `He looked as though he might fall at any moment.`／`it looks like` `It looks like rain (= as if it is going to rain).` **More examples 段另有**：`You look thoughtful.`／`You look lovely with your hair up.`／`The walls look a bit bare - can't we put some pictures up?`／`Those gloves look nice and warm.`／`When she came home from school she really didn't look well.` → **「三兄弟同段并列、不下小标题」的词典级先例**（见 §5） |
| CAM-2 | `grammar/british-grammar/look`（语法页） | ✅ **本轮直连实取**（HTTP 200，md5 `e51cb29446b98bf1d76ec6b1aac5e387`，**与批十八缓存逐字节相同**） | **无 CEFR 标签** | **`Look as a linking verb` 专节逐字原文**："We often use look as a linking verb like **appear, be, become, seem**. As a linking verb, **look does not take an object** and it is followed by a phrase or clause which gives more information about the subject (a complement):" 例 **`That picture looks old.`**／**`That jacket looks very expensive.`**；**紧接** "Look as a linking verb is sometimes followed by like, as if or as though:" → 小标题 **`look like + noun phrase`**（`He looks like someone famous.`／`It looks like a nice day outside.`）→ 小标题 **`look as if / as though + clause`**（`She looks as if she is going to cry.`／`They looked as though they had seen a ghost.`）→ `See also: Linking verbs`。**同页另三节**：开篇 `Look`（动作义）原文 "We use the verb look to mean 'turn our eyes in a particular direction to see something'. **It is followed by at** to refer to the person or thing which we see: `He's looking at me.` **Not: He's looking me.**"＋警告 "We don't use look with if or whether. We use see instead"；`Look as a discourse marker`（`Look, too many people have died in this war.`，**我方不引**）；`See also: Look at, see or watch?` |
| CAM-3 | `grammar/british-grammar/linking-verbs` | ✅ **本轮直连实取**（HTTP 200，md5 `d30fd80d…`；页面 `<title>`＝`Verbs: types`，canonical＝`/grammar/british-grammar/linking-verbs`） | **无 CEFR 标签** | **逐字原文**："Some main verbs are called **linking verbs** (or copular verbs). These verbs are **not followed by objects**. Instead, they are followed by phrases which give extra information about the subject (e.g. noun phrases, adjective phrases, adverb phrases or prepositional phrases)."；名单**逐条**：appear / feel / **look** / seem / sound / be / get / remain / smell / taste / become；四条例句按短语类型标注：`A face appeared at the window.`（prepositional phrase）／`He's a cousin of mine.`（noun phrase）／**`This coat feels good.`（adjective phrase）**／`She remained outside…`（adverb phrase）。→ **「为什么后面不用副词」的答案在这页；但全页不提 look 单点，且名单含 sound／smell／taste——我方不铺五词的依据也在这页**（**`sound` 在此名单内，但 BC stative 表里没有**，两源不一致，须记） |
| CAM-4 | `grammar/british-grammar/look-at-see-or-watch` | ✅ **本轮直连实取**（HTTP 200，md5 `…`；批十八已读，本轮逐字重核） | **无 CEFR 标签** | **边界专节的关键页**。逐字原文：`Look at` 节 "When we look at something, **we direct our eyes in its direction and pay attention to it**:" 例 `Come and look at this photo Carina sent me.`／`Look at the rabbit!`；**明文警告**："**Warning: When look has an object, it is followed by at: `Look at the rain. It's so heavy.` Not: `Look the rain.`**"；`See` 节 "See means noticing something using our eyes."；`Watch as a verb` 节 "Watch is similar to look at, but it usually means that we look at something for a period of time…" → **「不带东西的 look」对「带 at 的 look」的上游明文分工** |
| CAM-5 | `dictionary/english/feel`（**本轮新取**） | ✅ 本轮直连实取（HTTP 200，md5 `…`） | **(EXPERIENCE) 标 A1** `[ L or T ]`；(OPINION) 标 **B1** | 义项 **(EXPERIENCE)** 原文："`A1 [ L or T ] to experience something physical or emotional:`" 例 `"How are you feeling?" "Not too bad, but I've still got a slight headache."`／`How would you feel about moving to a different city?`／`He's still feeling a little weak after his operation.`／**`My eyes feel really sore.`**／`I never feel safe when Richard is driving.`／`Never in her life had she felt so happy.`／`My suitcase began to feel really heavy after a while.`；另 `feel like something / doing something` **B1**／`feel the cold`／`not feel a thing`。→ **`feel` 有 A1 词典标位（比 look 的 A2 还早一格），但那是「感觉／觉得」的宽义项**；**`[ L ]` 标记只在 A1 义项上出现一次**，**无「feel + 形容词」小标题、无 ❌** |
| CAM-6 | `dictionary/english/sound`（**本轮新取，用于排除五词路线的对照**） | ✅ 本轮直连实取（HTTP 200） | **(SEEM) 义项标 A2**（`sound good, interesting, strange, etc.`）＋`sound like/as if/as though` **B1**＋`sound angry, happy, rude, etc.` **B2** | 逐字：`sound good, interesting, strange, etc. A2 to seem good, interesting, strange, etc. from what is said or written: `**`Your job sounds really interesting.`**／`sound like/as if/as though B1 … `**`That sounds like a good idea.`**／`sound angry, happy, rude, etc. B2 to seem angry, happy, rude, etc. when you speak: `**`He sounded very depressed when we spoke on the phone yesterday.`** 另 (NOISE) 义项无 CEFR。→ **`sound` 的「起来」义也是 A2、且 `+ like` 被切成独立 B1 小条**（**与 look 同构**），但**我方词架零**（课＋案 0） |
| CAM-7 | `dictionary/english/smell` | ✅ 本轮直连实取 | **(CHARACTERISTIC) 标 B1** `[ I , L only + adj ]` | 逐字："`B1 [ I , L only + adj ] to have a particular quality that others can notice with their noses:`" 例 `My hands smell of onions.`／**`That cake smells good.`**／`There's something in the fridge that smells mouldy.`；另 (DISCOVER) **B1**。→ **`smell + 形容词` 标位是 B1，比 look／sound 晚一整段** |
| CAM-8 | `dictionary/english/taste` | ✅ 本轮直连实取 | **(FOOD/DRINK) B1**（含 `taste good, bad, sweet, etc.` 小条 B1） | 逐字：`taste good, bad, sweet, etc. B1 to have a particular flavour: `**`This sauce tastes strange.`** → **同样是 B1** |
| CAM-9 | `dictionary/english/seem` | ✅ 本轮直连实取 | **(SEEM) 标 B1** `[ I + adv/prep , L ]` | 逐字："`B1 to give the effect of being; to be judged to be:`" 例 `He's 16, but he often seems (to be) younger.`／`The children seemed (as if/as though/like they were) tired.`／`She seemed happy enough this morning.` → **B1** |
| CAM-10 | `grammar/british-grammar/look-forward-to` | ✅ 批十八实取（本轮沿用） | 无 CEFR | 明文 "The 'to' in look forward to is a preposition, so we must follow it by a noun phrase or a verb in the -ing form"＋`Not: … looking forward to go to Switzerland …` → **`look` 家族第三个成员，B1 段，我方本轮不碰（防与批十八 `to + -ing` 同窗）** |
| CAM-11 | `grammar/british-grammar/have-something-done`／`adjectives-and-adjective-phrases-typical-errors` | ✅ 批十八实取（本轮沿用） | 无 CEFR | **无一条 look/feel + 形容词 vs 副词错例**；主错型是 -ed/-ing 混用（`Not: That was such an interested lecture.`）→ **`-ed/-ing` 邻页参考**（我方已在 L113 教） |

**Cambridge 小结（三兄弟如何被切开——本轮核心取证）**：
- **词典页（CAM-1）**：**同段并列、不下小标题**——`look + 形容词` 三个例句之后**紧接**五行 `look like…` / `look as if…` / `look as though…` / `it looks like…`，**用粗体词条标签区分而不另起标题**（HTML 层是 `class="lab"` 的 `look like`／`look as if` 小标签）。
- **语法页（CAM-2）**：**同页切开、连续三个小标题**——`Look as a linking verb`（**形容词**）→ `look like + noun phrase`（**名词短语**）→ `look as if / as though + clause`（**从句**），且**第二节开头的过渡句**明写 "Look as a linking verb is **sometimes followed by like, as if or as though**"——**先给本体，再给两个「延伸」**。
- **动作义（CAM-4）**：**另开一页**（`Look at, see or watch?`），用 "When look has an object, it is followed by **at**" ＋ `Not: Look the rain.` 把**带东西的 look** 从**带形容词的 look** 里划出去。
→ **三段分工＝我方「同一个 look、两张脸」话术的现成骨架**（见 §5）。

### 1.3 Murphy（本机官方 TOC 原件）

**取到情况**：`/private/tmp/murphy_int.txt`（中级 4th TOC 抽文，14055 字符）·`/private/tmp/murphy_ess.txt`（初级 4th TOC 抽文，19077 字符）·`/private/tmp/murphy_full.txt`（中级全目 A–Z 块，16023 字符）·`/private/tmp/int_clean.txt`（去空白中级全目，6943 字符）·`/private/tmp/murphy_toc_clean.txt`（双册去空白＋分节标记，2277 字符）。**均为官方 TOC 抽文，非正文；单元内部例句、页码、练习量仍未核实**（与批十八「未核实 2」同）。

| 项 | 本轮逐字复核结果 |
|---|---|
| **中级 U99** | 标题逐字（去空白后原样）：`99Adjectives:anicenewhouse,youlooktired` → **还原＝`99 Adjectives: a nice new house, you look tired`**。**位于 `Adjectives and adverbs` 块**：`98 Adjectives ending in -ing and -ed (boring/bored etc.)` → **`99`** → `100 Adjectives and adverbs 1 (quick/quickly)` → `101 Adjectives and adverbs 2 (well, fast, late, hard/hardly)`。**标题第二半即 `you look tired`——批十八判读成立，本轮逐字确认单元号 99 与标题两半均无误** |
| **中级 U98** | `Adjectives ending in -ing and -ed (boring/bored etc.)`——**我方 L113 已教「感到版 vs 让人版」**（`grammarLabel: "感到版 vs 让人版 · -ed 说感到、-ing 说它让人"`，`:21070`），**与 U99 相邻的中级顺序与我方 L113→L125 的顺序同构**（**新一轮可用的「顺序背书」**） |
| **中级 U100/101** | `Adjectives and adverbs 1 (quick/quickly)`／`Adjectives and adverbs 2 (well, fast, late, hard/hardly)`——**U99 之后才教「形容词 vs 副词」**（**即：Murphy 把 `you look tired` 放在「副词」之前教**，**这与我方「先教 look + 形容词、不碰副词辨析」的切法一致**） |
| **初级册（4th）全书** | **无 `look + 形容词` 单元**（**逐字复点**：初级 `look` 仅出现在 **U113 `listen to, look at etc. (verb + preposition)`** 标题里，动作义）；**`feel`／`felt`／`sound`／`smell`／`taste`／`seem`／`appear` 全 0**（去空白后逐词 regex 复算）；初级形容词块＝`85 old/nice/interesting etc. (adjectives)`／`86 quickly/badly/suddenly etc. (adverbs)`／`87 old/older expensive/more expensive`…**无系动词条目** |
| **中级 U117/118** | `117 like and as`／`118 like as if`——**`look like` 的中级位（B1 段）**，**无独立 `look like` 单元**（批十八判读成立） |
| **中级 U130/131** | `Adjective + preposition 1/2`——复核批十七／十八，无变化 |
| **中级其他** | `18 used to (do)`（我方 L93／L100 已教）／`61 be/get used to… (I'm used to…)`（**批十八 L119–L124 刚教**）／`46 have something done`（维持撤出）／`26 can, could and (be) able to` 等——**均无变化** |
| **口径注意** | **`look + 形容词` 在中级册是「一个单元的半边标题」**（U99），**不是独立单元**；初级册**完全没有**。→ **段位表述须写「中级单册半边标题 / 小学段零」** |

### 1.4 中文侧 english.cool（869 篇 sitemap）

**取到情况**：sitemap 本机缓存 `/private/tmp/ec-urls.txt`（**869 条** `<loc>`，本轮重新计数＝869，与批十八一致）＋本轮直连 5 次探测（`look-like` 404／`linking-verbs` 200／`sense-verbs` 200／`形容詞` 404／`adverb-adjective` 200）。**sitemap 里 `look` 家族只有 `look-forward-to` / `look-forward-to-2` 两条**（本轮 regex 复算）。

| # | 文章 | 取到情况 | 要点（**原文级**） |
|---|---|---|---|
| EC-1 | `linking-verbs`「【連綴動詞】Linking Verbs 怎麼用？有哪些？」 | ✅ 本轮实读（缓存 `b18_ec_linking.html` md5 `4b5c1fb4…`，canonical `https://english.cool/linking-verbs/`） | **`look + 形容词` 的中文最硬单篇**。四类表逐格原文：**①「be 動詞」am、is、are、was、were、been**／**②「保持…..」keep、stay、remain**／**③「變成……」become、grow、turn、get、go**／**④「……起來」look、smell、sound、taste、feel、seem、appear**。定性句原文："**句子出現這一群動詞時，後面會需要加上名詞或形容詞，來補充說明主詞的身分／狀態**"。**明文 ❌ 对照（逐字）**：`Her skin feels smooth. ⭕️`（➡「滑順」修飾的是主詞 skin，所以用形容詞 smooth）对 **`Her skin feels smoothly. ❌`**（➡ 用副詞 smoothly 會變成是修飾動詞 feel，跟句意不符）；第四类例句原文：`He smells nice.`／**`You look upset.`**／`The proposal sounds great.`／`Coffee tastes bitter.`／`The wall feels rough.`；`seem`／`appear` 另给 `He seems nice.`／`She appears normal.`。**小补充＝同一个 look 的显式切开（逐字）**：**`He looks smart.` 他看起來很聰明。** ➡ "smart 是補充說明主詞 he 的狀態，此時 look 是指「看起來……」，屬於連綴動詞" 对 **`He looks angrily at her.` 他很生氣地看著她。** ➡ "angrily 是修飾 look 這個動作，此時 look 是指「看著」的動作，不屬於連綴動詞"。收口句："連綴動詞後面的字會補充說明主詞的身分／狀態，根據句意選擇用名詞或形容詞。" |
| EC-2 | `sense-verbs`「英文「感官動詞」有哪些？來搞懂 hear、feel、see 等用法！」 | ✅ 本轮实读（`ec2_sense-verbs.body.txt` md5 `7f3605ad…`） | **五词「……起來」类逐字**：`👀 看起來：look` / `👂 聽起來：sound` / `👃 聞起來：smell` / `👅 嚐起來：taste` / `👐 摸起來、感覺起來：feel`。**明文规则（逐字）**："這類感官動詞都是描述透過感官的動作，帶給別人什麼印象，**所以後面是加形容詞**，好修飾主詞。"**❌ 四条逐字**：**`The idea sounds great!（不是 greatly）`**／**`Wow! Your skin feels so smooth.（不是 smoothly）`**／**`The dinner smells so good. 😋（不是 well）`**／**`The medicine tastes so bitter. 😓（不是 bitterly）`**。**再补 `+ like + 名词` 五例同篇并列**：`The pretty little girl looks like a doll.`／`You sound exactly like your mom.`／`Gross! Your room smells like a fish market.`／`Some people say kangaroo tastes like chicken.`／`I don't know what this is. It feels like a stone.` **末尾「動腦時間」＝同一 look 的第二处切开（本轮新记）**：`The kid looks happy.`（那个孩子看起來很開心）对 **`The kid is looking happily at the photo.`**（那个孩子正開心地看著照片），提示句 "look 是誰做的？"＋解释"第一句的 look 是別人做的…所以「開心」修飾的是 the kid，要用形容詞 happy。第二句的 look 是 the kid 自己做的，「開心」修飾的是…動作，所以是用副詞 happily"。**另有小補充 `see / watch / look` 三词辨析**（`look`＝「轉移視線去看」「定睛去看」，例 `What are you looking at?`／`Look at the street performer.`／`He is looking at the photos.`）→ **动作义与描述义在同篇被分工** |
| EC-3 | `adjectives`「英文的「形容詞」是什麼？有哪些？怎麼用？」 | ✅ 本轮实读（缓存 `ec_adj.html` md5 `eccb52c3…`，canonical `https://english.cool/adjectives/`） | 形容词两位置原文：`1️⃣ 放在名詞前面，用來修飾名詞`／`2️⃣ 放在 be 動詞後面，用來補充說明最前面的主詞`；**再补一句（逐字）**："**除了 be 動詞以外，有些動詞後面也是可以接形容詞的，例如：get / become / look / sound / smell / taste / feel / seem / appear 等等，因此同樣能運用在這個句型中。**" 例句原文：**`This dress looks nice.`**（這件洋裝看起來很不錯）／`The girl seems happy.`／`He gets angry very easily.`／`They became sleepy.`／`We felt tired after a long day.` |
| EC-4 | `look-like` 直连 | ❌ **本轮复取仍 404**（`<title>Page not found – 英文庫</title>`；`/look-like` 与 `/look-like/` 两式均试） | **`look like` 在中文侧无专文**（复核批十八，无变化） |
| EC-5 | `形容詞` 直连 | ❌ 404（**真 slug 是 `adjectives`**——批十八记的是站内搜索式中文 slug，本轮补正真实 slug，见 §7） | 无口径变化 |
| EC-6 | `adverb-adjective`「副詞怎麼修飾形容詞？」 | ✅ 本轮实取（HTTP 200，94KB） | **`look`／`feel`／連綴動詞 提及 0 次**（逐行 regex 复算）→ **`look + 形容词` 的落点确认只有 EC-1／EC-2／EC-3 三篇**（批十八判读成立） |
| EC-7 | `sense-verbs`／`linking-verbs` sitemap 归属 | ✅ 复算 | **两篇均在 869 条 sitemap 内**（`https://english.cool/sense-verbs/`／`https://english.cool/linking-verbs/`）→ **「无标题级专文」应精确表述为「无 `look` 专文；有 `連綴動詞` 与 `感官動詞` 两篇主题专文」**（见 §7 口径校正） |

### 1.5 Duolingo

**未核实**。本轮三次尝试：`duolingo.com` 首页 HTTP 200（**11KB 空壳，内容／skill 列表不可取**，与批十七记录同）；`blog.duolingo.com/what-are-linking-verbs/` **404**（本轮新试，无该文）；未再试 fandom／duome（批十七三次全败，本轮不重复）。**本轮不引任何 Duolingo 数据**，沿用批九–十八存档（存档本身为「未核实」）。

---

## §2 对比表

| 候选 | Murphy（册别＋单元号） | BC（含 CEFR 段位） | Cambridge | 中文侧 | 我方现状 |
|---|---|---|---|---|---|
| **甲 `look + 形容词`**（批十九首选） | **中级 U99 标题第二半＝`you look tired`**（`99 Adjectives: a nice new house, you look tired`，**本轮逐字复核**，在 U98 -ing/-ed 之后、U100 形容词 vs 副词之前）；**初级册零**（`look` 只在 **U113 `listen to, look at etc. (verb + preposition)`** 标题里，动作义；`feel/sound/smell/taste/seem/appear` 初级全 0） | **三档 68 课零课程位**（A1-A2 18／B1-B2 36／C1 14 **三份全目本轮全部完整复点**）；**唯一落点＝参考层 beginner 一页**："after a link verb like **be, look or feel**"＋**`That film looks interesting.`**（**原文级**）；B1-B2 `Stative verbs` 把 look/feel/smell/taste 收进表（**`sound` 不在**）但**不教接形容词** | **词典层标 A2**：义项 **(SEEM)** `[ L, I usually + adv/prep ] to appear or seem`，例 **`You look well!`**／**`The roads look very icy.`**／`That dress looks nice on you.`（**同段紧跟 `look like`／`look as if`／`look as though`／`it looks like` 五条**）；**语法层两页**：`Look` 页 `Look as a linking verb`（"**does not take an object**"＋`That picture looks old.`／`That jacket looks very expensive.`，**紧接 `look like + noun phrase` 与 `look as if/as though + clause` 两个小标题**）＋ `Linking verbs`（名单含 look／sound／smell／taste／feel，例 `This coat feels good. (adjective phrase)`）；**动作义另开一页**（`Look at, see or watch?`：`Not: Look the rain.`） | **无 `look` 专文；三篇内容级落点（全部原文级）**：`linking-verbs`（四类表第四类＝「……起來」look/smell/sound/taste/feel/seem/appear＋`Her skin feels smooth. ⭕️` 对 `Her skin feels smoothly. ❌`＋**`He looks smart.` 对 `He looks angrily at her.` 显式切开**）、`sense-verbs`（五词表＋**明文"所以後面是加形容詞"**＋**❌ 四条**＋`look like…` 五例同篇并列＋**末尾 `The kid looks happy.` 对 `The kid is looking happily at the photo.` 第二处切开**）、`adjectives`（**明列 get/become/look/sound/smell/taste/feel/seem/appear 后接形容词**＋`This dress looks nice.`）；`look-like` 直连**仍 404** | **认读垫子 14 处（同构池）＋2 处（变体）＝ 16 处**（**完整清单见 §3.1**：L13/19/48/51/66/71/72/76/79/83/87/92/115/121＋变体 L112／L123，**全为 `dialogue[].en`＋`who:"npc"`**；L121 是批十八交付课自带、L123 批十八未记）；**0 处作 target／dialogueEn／answer、0 处进 guided／practice**（本轮逐字段复算）；**`look` 从未进 `grammarLabel`**（124 课 0 命中）；**cloze 词表内有 `look`／`looks`**（`:172` 逐字复核）；HC 侧 **5 处**（#25 `I look younger,` **合法句**／#35 #59 `Look at…`／#62 `Look!`／#44 `look in`）**无一处针对本项设错** |
| **乙 `look like`**（维持认读） | **中级 U117 `like and as`／U118 `like as if`**（**无独立单元**，本轮复核） | **B1＋B2**：`Using 'as' and 'like'`（`He looks like his dad.`）——**仍在 B1 段** | **词典 (SEEM) 义项内与 `look + 形容词` 同段并列**（`He looked like a friendly sort of person.`）＋**语法页 `Look` 内独立小标题 `look like + noun phrase`**（`He looks like someone famous.`／`It looks like a nice day outside.`） | **无专文**（`look-like` 404 两式均试）＋**`sense-verbs` 里 `look like…feel like` 五例同篇并列**（正文级落点，**非标题级**） | **仅 L49 `:8977` `It looks like rain.`（天气义）＋0 处 target**；**`looks like` 全库 1 处**（本轮复算） |
| **丙 `have sth done`**（维持撤出） | **中级 U46 `have something done`**（U42–45 被动块后）；**初级册零** | **三档零课位**（`Passives` 在册但不含此条） | `have-something-done` 页（**无 CEFR**）＋`get` 页给「less formal 版」 | `causative-verbs` 有节（`I had my hair cut.`）；**`haircut` 直连 404** | 招牌句四零件全库零；**`will have` 0／`'ll` 0**（本轮复算）→ **维持撤出** |
| **丁 形容词＋介词**（维持折卡） | **初级 U112 `afraid of…, good at… etc. (prepositions) + -ing`**（本轮逐字复现）／**中级 U130–131 `Adjective + preposition 1/2`** | **A1-A2 课程位**：`Adjectives and prepositions`（18 课清单第 1 条，**本轮复点仍在第 1 条**）＋B1-B2 `Verbs and prepositions` | 本轮未单页重取（批十七／十八口径）；`To` 页 "after adjectives" 节可作旁证 | **无独立专文**（`good-at`／`afraid-of` 404）；`interested in` 有单篇节 | 六族只覆 **1/6**（仅 `good at`，L67）→ **维持折卡** |

---

## §3 三问制正当性表（逐候选给档）

判据（沿用批十四起）：① **跨源 A1-A2／强功能位有无课程位**；② **中文侧实证强弱**；③ **我方接口（平台／垫子／错点池）是否现成**。

| 候选 | ① 课程位（跨源） | ② 中文侧实证 | ③ 我方接口 | 容量 | 档 | 判读 |
|---|---|---|---|---|---|---|
| **甲 `look + 形容词`** | ⚠️ **仍无课程位，但「段位」本轮更清楚**：BC **三档 68 课全目零**（唯一落点＝**beginner 参考页**）；**Murphy 中级 U99 半边标题**（**不是独立单元**）；**Cambridge 词典义项 (SEEM) 标 A2**（**词典层，非课程层**）＋**语法层专节**。→ **三段分裂的表述应统一为「A2 词义（词典）／B1 语法位（教材标题）／课程位零（BC）」** | ✅ **中强且本轮全部原文级**：**三篇内容级落点**（`linking-verbs` 四类表＋两处切开；`sense-verbs` 明文"後面是加形容詞"＋**❌ 四条**；`adjectives` 九动词明列）；**`look-like` 仍 404**；**无 `look` 标题级专文**（但有 `連綴動詞`／`感官動詞` 两篇主题专文） | ✅ **现成且零冲突**：**16 处认读垫子**（同构池 14＋变体 2，全 NPC 对白，**其中 13 处是「人／物 + look(s) + 单个形容词」完整句**）＋**HC 1 处合法句**（#25 `I look younger`，**天然可作「这句没错」的陷阱位**）＋**`look`／`looks` 在 cloze 词表内**（比 `used to` 落点好）＋**反例池现成**（竞品四条副词误用可直接转 ❌ 卡）＋**`look at`／`look for` 动作义已教**（L27／L52／L58／L60／L65／L88／L96／L37）**作对位材料** | **3 课**（2 课太薄、4 课无上游） | **B**（**维持批十八判档，不升不降**：本轮把三项证据从「转述级」升到「原文级」，**但四项判据无一改变**——BC 仍无课位、Murphy 仍是半边标题、中文仍无专文、我方仍 0 target） | **升格成立，但须按「3 课小章」的容量落刀**：证据够「开一课」、不够「撑一个大章节的语义场」（无统一场景，只能靠「我看到的和感觉到的」串）。**本轮建议独立 3 课小章而非折入他章**——折入的唯一理由（批十八：与 `used to` 同章无落点）已随批十八交付而消失，**批十九是干净的一章起点**；**且折入会把「一课一增量」破在别人章里**（见 §4.1） |
| **乙 `look like`** | ⚠️ **B1 段**：BC `Using 'as' and 'like'`（B1-B2）＋Murphy U117–118（**无独立单元**） | ❌ **弱**：**无专文**（404 两式均试）；仅 `sense-verbs` 正文五例 | ⚠️ **仅 1 处**（L49 天气义） | — | **D（维持认读）** | **不单开课**；**唯一用处＝甲章的对照卡**（Cambridge 词典同段并列／语法页连续小标题／中文 `sense-verbs` 五例同篇——**三源都给了「并列」的现成形态**，见 §5） |
| **丙 `have sth done`** | ❌ **零课位**（三档 68 课零；Murphy 仅中级 U46 跨级） | ⚠️ 中（`causative-verbs` 节内含 `I had my hair cut.`） | ❌ **零底座**（招牌句四零件全库零；`will have` 0／`'ll` 0） | — | **C（维持撤出）** | **不排期**，无口径变化 |
| **丁 形容词＋介词** | ✅ **A1-A2 课程位**（`Adjectives and prepositions`）＋Murphy 初 U112／中 U130–131 | ❌ **弱**（无独立专文） | ⚠️ **1/6**（仅 `good at`） | — | **B-（维持折卡）** | **不单开**；**与甲同日出现时须防两套话术串台**（沿用批十八纪律） |
| **戊 机制强化** | — | — | — | — | **不做（维持）** | 批十六已判无增量空间，批十七／十八复跑确认 |
| **己（本轮新增评估）`feel` 升格** | ❌ **双册零课位**（Murphy 初/中 TOC `feel` 全 0）＋**BC 无课**（仅 beginner 参考页并列举例＋B1-B2 stative 表） | ❌ **弱**：`feel` **无专文**（仅在两篇里作为五词／九动词成员出现） | ❌ **假接口**：课文件 28 处**全部是 L76 `I feel much better today.` 单句的不同字段／变体**（L76 23＋L78 5），**不是复现池**；`feels` 0／`felt` 0 | — | **C（不建议独立成课）** | **改作第 3 课的「添一句」**（见 §6）——它撑不起一课，但**够当一课里的第二张脸** |

### 3.1 我方 `look + 形容词` 认读垫子完整清单（同构池 14 处＋变体 2 处，本轮逐条实读）

| # | 课 | 行号 | 字段 | 原文 | who | 批十八是否记 |
|---|---|---|---|---|---|---|
| 1 | **L13** | `:2338` | `dialogue[].en` | `It looks nice!` | npc | ✅ |
| 2 | **L19** | `:3438` | `dialogue[].en` | `You look tired.` | npc | ✅ |
| 3 | **L48** | `:8790` | `dialogue[].en` | `The sky looks dark.` | npc | ✅ |
| 4 | **L51** | `:9353` | `dialogue[].en` | `Everything looks new.` | npc | ✅ |
| 5 | **L66** | `:12183` | `dialogue[].en` | `That box looks big!` | npc | ✅ |
| 6 | **L71** | `:13129` | `dialogue[].en` | `This bag looks heavy.` | npc | ✅ |
| 7 | **L72** | `:13318` | `dialogue[].en` | `Your plan looks great!` | npc | ✅ |
| 8 | **L76** | `:14076` | `dialogue[].en` | `You looked tired yesterday.`（**过去版**） | npc | ✅ |
| 9 | **L79** | `:14645` | `dialogue[].en` | `Your room looks nice!` | npc | ✅ |
| 10 | **L83** | `:15406` | `dialogue[].en` | `You look happy today!` | npc | ✅ |
| 11 | **L87** | `:16168` | `dialogue[].en` | `You look cold.` | npc | ✅ |
| 12 | **L92** | `:17113` | `dialogue[].en` | `You look great!` | npc | ✅ |
| 13 | **L115** | `:21481` | `dialogue[].en` | `It looks new!` | npc | ✅（批十八新增记） |
| 14 | **L121** | `:22649` | `dialogue[].en` | `You look better now!` | npc | ❌ **批十八未记**（**批十八交付课自带**） |

**另补 2 处「变体」（同构度低于上表，建议单列、不并入同构池）**：

| # | 课 | 行号 | 字段 | 原文 | who | 说明 |
|---|---|---|---|---|---|---|
| V1 | **L112** | `:20898` | `dialogue[].en` | `They look the same!` | npc | **后面是 `the same`（不是单个形容词）**——**批十八把它并进「14 处」计数**，本轮**归为变体** |
| V2 | **L123** | `:23037` | `dialogue[].en` | `You look a little lost.` | npc | **后面是「程度 + 形容词」短语**（`a little lost`）——**批十八未记**（`look` 的宾语位是形容词短语，**结构最复杂的一处**） |

→ **精确口径：同构池 14 处（上表 #1–14）＋ 变体 2 处（V1 L112／V2 L123）＝ 共 16 处 `look + 形容词` 句**。**形状分布（本轮逐句复算）**：`looks`（三单）**8 处**（L13／L48／L51／L66／L71／L72／L79／L115）／`look`（原形）**7 处**（L19／L83／L87／L92／L121／V1／V2）／**`looked`（过去版）1 处**（L76 `:14076`）。→ **【容量账重要】**：我方**已天然拥有 `looks` 8 句／`look` 7 句**——**L125「东西版」与 L126「人版」的复现池各有一半以上是现成句**（**L125 可用 L13／L48／L51／L66／L71／L72／L79／L115 的 `looks` 八句，L126 可用 L19／L83／L87／L92／L121 的 `look` 五句**），**同构度高在这里第一次变成优势**（批十八把它记为风险，本轮判定：**在 3 课小章里它是复现池，不是负担**）。

**分布观察（供容量账用）**：16 处横跨 **L13–L123**（**批十七记的 12 处集中在 L13–L92**，批十八新增 **L115／L121**，批十九本轮补 **L123**）——**垫子密度在最近三批上升**（批十七 12 处/118 课 ≈ 0.10 → 当前 16 处/124 课 ≈ 0.13，**新增 4 处里有 3 处在 L92 之后**），**说明 `look + 形容词` 已是我方写手的自然表达**（**这一点反过来支持升格：不是生造，是收编既有习惯**）。

**反面清单（必须隔离，不得混述）**：

| 支 | 落点 | 原文 | 处理 |
|---|---|---|---|
| `look at`（动作义） | L27 `:4948-4951`（wrong/correct/whyZh）／L52 `:9540`／L58 `:10656`／`:10672`／L60 `:11030`／`:11047`／L65 `:11995`／L88 `:16357`／L96 `:17872` | `Look at your sister!`／`Look at this old photo!`／`Wow, look at this boy!`／`Look at the clouds!`／`Look at the window!` | **7 处＋L27 一处错卡**（`What are you look for?` 那条属 `look for`）。**隔离设计见 §5** |
| `look for`（动作义） | L13 `:2385`／L27 `:4895/:4898/:4912/:4914/:5064`／L37 `:6750`／L73 `:13601-13602` | `I am looking for my teacher.`／`What are you looking for?`／`His mother is looking for him.` | **L27 是 target 课**（`What are you looking for?`）→ **`look` 唯一一次进 target 是「找」的意思**，**与我方新章必须显式切开** |
| `look!`（感叹） | L86 `:15976`／L89 `:16546` | `Look! A bag on the shelf.`／`Look! The sun is out!` | 祈使义，**不涉接形容词**，**可作「光杆 look 单独站」的对位** |
| `look like` | L49 `:8977` | `It looks like rain.` | **唯一 1 处**，天气义 |
| HC `look` | #25 `I look younger,`（合法句）／#35 `Look at my new room!`／#44 `look in your bag`（错点＝`on→in`）／#59 `Look at the window!`／#62 `Look!` | — | **5 处无一处针对 `look + 形容词` 设错** → **零负迁移池**（新章无「旧错点要被推翻」的风险） |

---

## §4 大章节组合建议

### 4.1 首选方案：**3 课小章「我看到的和感觉到的」（L125–L127）**

**章名建议**：「我看到的和感觉到的」——**单线**：**看东西 → 看人 → 回看同一个 look 的另一张脸**。

| 课 | 主题 | 接口（我方自建话术） | 增量 | 档 |
|---|---|---|---|---|
| **L125** | **「它看起来……」**（`It looks nice!`／`The sky looks dark.`／`That box looks big!`） | **不是 `is`，是 `looks`**：说「看着怎么样」时，`look` 自己站中间，**后面直接跟那个「怎么样」的词**——`It looks nice.` ＝ 我看到它，我觉得它好。**用现成垫子当教材**（L13 `It looks nice!`／L48 `The sky looks dark.`／L66 `That box looks big!` **三句全是学生见过的**）；**不引「形容词／系动词」二字**（红线 29 词里的「形容词」**必须绕开**，用「那个『怎么样』的词」） | 立岗：**东西版**（主语＝物）＋`looks` 三单形状（**与 L11–L12 的 `-s` 老规矩接上**）；**判据只有一条：中间不站 `is`**（❌ `It is looks nice.`／❌ `It looks is nice.`） | B |
| **L126** | **「你看起来……」**（`You look tired.`／`You look happy today!`／`You look cold.`） | **换主语不换形状**：`You` 前面的 look **没有 s**（**与 L125 的 `looks` 形成一课内的天然对照**；`You look` vs `It looks` ＝ 同一条规矩的两个人称形状，**我方 L11/L12 已教 `-s` 老规矩**）；**用现成垫子当教材**（L19 `You look tired.`／L83 `You look happy today!`／L87 `You look cold.`／L121 `You look better now!` **四句全是学生见过的**） | 换人版：`I look…`／`You look…`／`She looks…`（**`-s` 回来**）——**这就是「前面站谁」第一次上 `look` 家族**（**与批十八 L119–L124 的「看前面站谁」是同一把口令、不同战场，零新术语**） | B |
| **L127** | **「同一个 look、两张脸」（收口·零新知）** | **看东西的 look 与说样子的 look 排一行**：`Look at the clouds!`（**光杆喊人看**，L88 `:16357` 原句）对 `The sky looks dark.`（**L48 `:8790` 原句**）——**同一个字，一张后面跟「去哪儿看」，一张后面跟「什么样」**；再补一句 `It looks like rain.`（**L49 `:8977` 原句**——**「像什么」那张脸只给认读，不给练**） | **零新知**（三句全是老句子回流）；**兑现「同一个 look、两张脸」的切脸动作**——**这是本小章唯一的对比课，放在收口位**（**与批十八 L122 脊柱课同构：把旧句子请回来并排**） | B |

**备选方案（若主理人要 2 课）**：**砍 L126**，把「换人版」并进 L125 的第二段（**代价：一课两增量，「一课一增量」在第 1 课就破**）。**竞析不建议**——`It looks` 与 `You look` 的 `-s` 差别**必须有独立一课承载**（**这是本小章唯一真正的新知**，别的都是回流）。

**备选方案（若主理人要 4 课）**：**加第 4 课「我听起来／闻起来」**——**竞析不建议**：`sound`／`smell`／`taste` **课＋案两文件全 0**（本轮复算），中文侧虽有 `sense-verbs` 五词表，**但 Murphy 初级／中级 TOC 五词全 0、BC 三档零**，**4 课就要靠自造词架撑**（撞批十八已判的「零词架硬伤」）。

**明确不做双拱**：**本小章单拱一条线**（「我看到的和感觉到的」），**不折入他章、不并他项**——理由三条：
1. **甲项独立成章是干净的**（批十八说「折入他章」的唯一理由是与 `used to` 同窗无落点，**批十八已交付，该理由消失**）；
2. **折入会把「一课一增量」破在别人章里**（新接口与宿主章的场景／口令不共享锚，**交界处最易破例**——批十四破例一次的教训，批十五–十八连续单拱）；
3. **批十九是 A2 关账＋B1 开局之后的第二格**，**用 3 课小章试水比用 6 课合章更稳**（B1 段第二个硬结构 `look forward to`／`object to` 一族**不可与批十八同窗**的纪律仍在，**本轮不引入任何 `to` 结构**）。

### 4.2 为什么是 3 课而不是 6 课（容量账）

| 账 | 数 |
|---|---|
| **上游最大自然容量** | **3 格**：① 东西版（`It looks…`）② 人版（`You look…`）③ 切脸版（`look at` 对 `looks + 怎么样`）。**三源给的容量全部 ≤3**：BC 一页给两种位置（名词前／link verb 后）；Murphy 是**一个单元的半边标题**（U99 标题两半：`a nice new house` ＋ `you look tired`——**半边＝一格**）；Cambridge 词典同段给三条（形容词／like／as if）但**语法页明确把 like 与 as if 划为「延伸」**（"sometimes followed by"）；中文侧三篇给两格（形容词 vs like）。 |
| **6 课会多出什么** | **只能靠「换词」撑**：第 4 课起必然要铺 `sound`／`smell`／`taste`／`feel`——**五词路线**。**这一条的硬伤已实测**：`sound` 0／`smell` 0／`taste` 0／`feels` 0／`felt` 0／`seem` 0／`appear` 0（**课＋案两文件，逐词复算**）。**即：第 4 课起每一课都是「全库零词架」的造词课**（撞批十八对 `have sth done` 判的同一类硬伤）。 |
| **对标先例** | 批十八的 6 课容量账写「三张脸的实质增量只够 3 课，第 4 课起靠合体与收口撑」；**本项连「三张脸」都只有两张半**（东西版／人版／切脸版），**第 4 课没有可撑的合体对象**（`look like` 是 D 档、`sound` 家族零词架）→ **3 课封顶，且第 3 课必须是零新知收口**。 |
| **一课一增量检查** | L125（东西版·`looks`）→ L126（人版·`look`／`-s` 换位）→ L127（零新知切脸）。**三课三个落点，无一重复**。 |

---

## §5 关键边界专节：`look + 形容词` 与 `look like`／`look at` 的隔离设计

### 5.1 跨源教材是怎么切的（本轮原文级取证，四源四种切法）

| 源 | 切法 | 逐字依据（**可用作我方话术的骨架**） |
|---|---|---|
| **Cambridge 词典 `look`**（CAM-1） | **同段并列、不下小标题**：先给「+ 形容词」，**紧接**粗体小标签 `look like`／`look as if`／`look as though`／`it looks like` 五条 | `You look well!`／`The roads look very icy.` **→** `look like` `He looked like a friendly sort of person.` **→** `look like` `The twins look just like their mother.` **→** `look as if` `She looked as if she hadn't slept all night.` **→** `look as though` `He looked as though he might fall at any moment.` **→** `it looks like` `It looks like rain.` → **「并列」＝三兄弟不是互斥的备选，是同一家人的三张脸**（**我方 L127 可直接用这个形态**） |
| **Cambridge 语法页 `Look`**（CAM-2） | **同页切开、连续小标题＋过渡句**：`Look as a linking verb`（形容词）→ **"sometimes followed by **like**, **as if** or **as though**"** → `look like + noun phrase` → `look as if / as though + clause` | **过渡句原文**："Look as a linking verb **is sometimes followed by like, as if or as though**:" → **先立本体、再给延伸**（**我方 L127 可用「先说样子，再说像什么」的两段式**） |
| **Cambridge 动作义页**（CAM-4） | **另开一页，用「有没有带东西」划界** | "As a linking verb, **look does not take an object**"（CAM-2） **对** "**When look has an object, it is followed by at**: `Look at the rain. It's so heavy.` **Not: `Look the rain.`**"（CAM-4）→ **「带东西」与「不带东西」是两页的事**（**我方 L127 的判据可用「后面跟的是『去哪儿看』还是『什么样』」代替「宾语」二字**） |
| **中文 `linking-verbs`**（EC-1） | **同一个词、两个句子并排＋一句收口** | `He looks smart.` 他看起來很聰明。 **对** `He looks angrily at her.` 他很生氣地看著她。 ＋ "連綴動詞後面的字會補充說明主詞的身分／狀態，根據句意選擇用名詞或形容詞。" |
| **中文 `sense-verbs`**（EC-2） | **同一个词、两个句子并排＋提问式引导** | `The kid looks happy.` **对** `The kid is looking happily at the photo.` ＋ "小提示：**look 是誰做的？**" ＋ "第一句的 look 是別人做的…第二句的 look 是 the kid 自己做的" → **「谁做的」＝中文侧给的最口语化判据** |
| **中文 `sense-verbs` 的 like 段**（EC-2） | **同篇并列、最后给**："對了，如果你想表達看起來、聽起來、聞起來、吃起來、摸起來像是什麼，你也可以在動詞後面加上介系詞 like（像），變成 `look like`…" | 五例：`The pretty little girl looks like a doll.` 等 → **中文侧也是「先形容词、后 like」的顺序** |
| **Murphy** | **两个单元相隔 18 格**（U99 形容词半边标题 vs U117/118 `like`／`like as if`） | **上游教材根本不在同一章处理**——**这是「必须切开」的最强教材背书** |

### 5.2 三源切法的共同点（→ 我方话术可用依据，三条）

1. **三源全部把「+ 形容词」放在前面，把「+ like」放在后面**（Cambridge 语法页过渡句／中文 `sense-verbs` 的「對了…你也可以」段／Murphy 的 U99→U117）。→ **我方 L125／L126 先做形容词，L127 才给 `look like` 的认读**——**顺序与三源一致，零自造**。
2. **「并列」而非「对错」是三源的一致姿态**：Cambridge 词典同段并列、语法页连续小标题、中文两篇都是「同一个词、两个句子并排」——**没有一源说「`look like` 是错的」**。→ **我方 L127 不得把 `It looks like rain.` 设为错误答案**（**须作 §5.3 的「bothRight」式并列，或只给认读不给练**）。
3. **「谁在做这个 look」是中文侧给的判据，且与动作义挂钩**：`look at` 的 look 是「看的那个人做的动作」；`look + 什么样子` 的 look 是「别人看到的样子」。→ **我方可用「这个 look 是谁在动？」替代「系动词／宾语」等一切术语**（**与我方既有口令体系兼容：「前面站谁」的变体**）。

### 5.3 我方话术的可用依据与禁区（逐条）

| 项 | 可用依据（原文级） | 我方落点与话术建议 | 禁区 |
|---|---|---|---|
| **`look + 形容词` 的本体** | Cambridge 词典 `[L]`＋`does not take an object`＋`That picture looks old.`；BC beginner 页 "after a link verb like be, look or feel"＋`That film looks interesting.`；中文 `linking-verbs` 四类表＋`You look upset.` | **L125/L126**：「`look` 站在中间，后面直接说『看起来怎么样』」——**用「站中间」而不是「联系动词」**；**不引「形容词」二字**（红线词，**改用「那个『怎么样』的词」**） | ❌ 术语：形容词／系动词／表语／宾语（**29 词红线里的四个高危词全在这条线上**） |
| **`look at` 的隔离** | Cambridge `Not: Look the rain.`＋"When look has an object, it is followed by at"；中文 `sense-verbs` 的 `see/watch/look` 三词辨析＋`Look at the street performer.` | **L127**：`Look at the clouds!`（**L88 `:16357` 原句请回来**）对 `The sky looks dark.`（**L48 `:8790` 原句请回来**）——**两句话都学过、都合法，只有后面跟的东西不一样** | ❌ 不得说 `Look the rain.` 式的「错」在 `look + 形容词` 课上出现（**那是 `at` 的缺失，与本项无关；两件事混述＝批十七起的连续纪律所禁止**） |
| **`look like` 的隔离** | Cambridge 词典同段并列＋语法页「sometimes followed by like」＋中文 `sense-verbs` 五例同篇并列 | **L127**：`It looks like rain.`（**L49 `:8977` 唯一原句，天气义，已学过**）——**只作认读、不进练习、不作 ❌**；**若要设题，只能设 bothRight**（`It looks nice.` 与 `It looks like a nice day.` **两句都对**） | ❌ **不得出 `It looks like nice.` 这类错卡**（会把 `like` 与形容词的接法搅成一团；`look like` 是 D 档**认读**项，**不得成为考点**） |
| **`look` 的动作义家族（`look for`）** | 我方 L27 `What are you looking for?` **是 target 课**（`:4898`） | **L125 开场不得复用 `looking for`**（**避免「同一个 look 两义」在第 1 课就撞**）；**L127 可提一句「第 27 课那个 look 是『找』，今天这个是『看起来』」** | ❌ 不得把 `look for`／`looking for` 设为对比卡的错项 |
| **`look` 的感叹义** | 我方 L86 `:15976`／L89 `:16546`（`Look! …`） | **可作 L127 的第三张脸**（**光杆 `Look!` 谁都不跟**）——**三张脸排一行**：`Look!`（喊人看）／`Look at…`（看去哪儿）／`looks + 什么样子`（看着怎么样） | ❌ 三张脸**同屏最多三条**（**超过三条＝把一课变三课**） |

**§5.4 一句话隔离设计**：**L125／L126 只做「后面跟什么样子」（不出现 `at`／`like` 的句子）；L127 才把 `at`／`like`／光杆 `Look!` 三张脸请回来并列，且全部用老句子、全部不作错项。**

---

## §6 `feel` 的可行性专节（批十八建议「只取 look 一族＋1 个 feel」的核查）

### 6.1 跨源位置（本轮逐源实取）

| 源 | `feel` 的位置 | 原文／要点 | 能否撑一课 |
|---|---|---|---|
| **BC** | **无课**；**beginner 参考页**（`where-adjectives-go-in-a-sentence`）把它与 look 并列举例（"after a link verb like **be, look or feel**"）；**B1-B2 `Stative verbs`** 表内收录 `feel`（**与 look 同在表内**） | 该页**没有 `feel` 的例句**（例句只有 `Their house is beautiful.`／`That film looks interesting.`）；stative 页错例是 `I'm not knowing the answer.` 等，**无 feel** | ❌ **无课位、无例句** |
| **Cambridge 词典** | **(EXPERIENCE) 标 A1** `[ L or T ]`＋(OPINION) **B1** | `My eyes feel really sore.`／`He's still feeling a little weak after his operation.`／`My suitcase began to feel really heavy after a while.`＋`feel like something/doing something` **B1** | ⚠️ **段位够（A1）但例句的 feel 是「感到（身体／情绪）」，不是「摸起来」**——**与我方 L76 的 `I feel much better` 同义，不是新东西** |
| **Murphy** | **初级册 0／中级册 0**（本轮去空白逐词复算：`feel`／`felt`／`feeling` 双册 TOC 全 0） | — | ❌ **双册零**（**比 `look + 形容词` 还弱——后者至少有中级 U99 半边标题**） |
| **中文侧** | **无专文**；在 `linking-verbs` 的「……起來」类（`look、smell、sound、taste、feel、seem、appear`）与 `sense-verbs` 的五词表（`👐 摸起來、感覺起來：feel`）内**各占一格** | `Her skin feels smooth. ⭕️` 对 `Her skin feels smoothly. ❌`（**`linking-verbs`**，两例都以 feel 为主角）；`Wow! Your skin feels so smooth.（不是 smoothly）`（**`sense-verbs` ❌ 四条之一**）；`We felt tired after a long day.`（**`adjectives`**） | ✅ **中文侧实证反而是 feel 最强源**（**两篇的主角都是 feel**） |
| **Duolingo** | **未核实** | — | — |

### 6.2 我方词架（本轮逐条实测）

| 量 | 值 | 说明 |
|---|---|---|
| 课文件 `feel` 总命中 | **28 处** | **L76＝23／L78＝5**（**其余 122 课全 0**） |
| L76 的 23 处是什么 | **全部是同一个句子 `I feel much better today.` 的不同字段**：`dialogueEn`／`targetSentence`／`blocks[].text`("I feel")／`examples[].en`／`dialogue[].en`（`Are you feeling better?` ＋ `I feel much better today.`）／`contrast[].correct`（×2）／`contrast[].wrong`／`contrast[].correct`／`variants[].en`／`deepDive` 标题串／`guided[].before`("I feel")／`guided[].tokens`（×2）／`guided[].answer`（×2）／`guided[].tokens`／`guided[].promptZh`／`guided[].replaceBase`／`guided[].answer`／`recall[].answer`／`huntCaseIds` | **不是复现池——是一课的单句在不同字段里的重复**。**`feel` 在这课的身份是「much + 比较级」的载体，不是「feel + 形容词」的教学对象**（`grammarLabel` 原文＝`"加力 · much + 更…"`，**不含 feel**） |
| L78 的 5 处 | `contrast[].wrong`（`I feel very better today.`）／`contrast[].correct`（×2）／`guided[].tokens`／`guided[].answer` | 同为 `much` 的对比卡回响 |
| `feels` | **0**（课＋案） | **三单形状全库零** |
| `felt` | **0**（课＋案） | **过去版全库零**（**意味着 `feel` 的「昨天版」不现成**） |
| `feeling` | **1**（L76 `Are you feeling better?`） | 唯一 -ing 形式 |
| HC 侧 `feel` | **3 案 5 处**：#56 同桌的便签（`I feel tired today.` **合法句**）／#85 身体好转条（`I feel very better today.` **错点＝`very→much`**）／#87 一天记录（同错点 `very→much`） | **HC 的三处全是 `much` 的错点，不是 feel 的错点**（#85／#87 的 explanation 讲的是「给『更』加力用 much」） |
| `seem`／`appear`／`sound`／`smell`／`taste` | **课＋案全 0**（本轮逐词复算） | **五词零词架** |

### 6.3 判读：**`feel` 撑不起第 3 课，但够当一课里的第二张脸**

- **撑不起的理由（三条）**：① **跨源零课位**（Murphy 双册 0／BC 无课）——**比 `look + 形容词` 还弱**（后者有 U99 半边标题）；② **我方是「假接口」**——28 处**全是同一句的字段重复**，**没有 16 处那样的独立句池**（**判据：`feel` 的独立句子数＝1**，而 `look + 形容词` 的独立句子数＝**16**）；③ **它与我方 L76 的语法点冲突**——L76 教的是 `much + 比较级`，**`feel` 在那课只是载体**，**若第 3 课改教「feel + 形容词」，会把 L76 的载体变成新知识点**（**一课一增量在这一课被反噬**）。
- **够当第二张脸的理由（两条）**：① **中文侧两篇的主角都是 `feel`**（`Her skin feels smooth.` 对 `Her skin feels smoothly. ❌` 是 `linking-verbs` 全文唯一一组 ❌ 对照；`sense-verbs` ❌ 四条里有一条是 `feels so smooth（不是 smoothly）`）——**素材现成**；② **`feel` 在 cloze 词表外**（本轮复核 `:160-187`：**`feel` 不在 GRAMMAR_WORDS 内**）——**它不作 target 也能被抽空**？不成立：**`feel` 不在词表 → 抽空时不会被优先选中**（**落点不如 `look`／`looks`**，**这是第 3 课不宜押 feel 的技术理由**）。
- **建议落法（若主理人仍要用 feel）**：**放在 L126 的第三段作「添一句」**——`You look tired.`（L19 原句）旁边添一句 `I feel tired too.`（**同一场景、同一形容词、换主语换动词**），**只认读、不设题**；**代价**：`I feel tired too.` 是**新造句**（全库无此句），**须走「新句允许」判定**。**竞析的推荐是：不用 feel，把 L126 的第三段换成 `She looks tired.`／`They look tired.` 的「换人版」**（**用 L19 的同一个形容词，零新词、零新句**）。

---

## §7 口径校正（本批须修正前批结论）

| # | 前批结论 | 本轮实测 | 校正 |
|---|---|---|---|
| 1 | 批十八：「`look + 形容词` 我方垫子 **14 处**」（批十七 12＋L112／L115） | **本轮完整清单＝同构池 14 处 ＋ 变体 2 处 ＝ 16 处** | **三处校正**：① **批十八漏记 L121 `:22649` `You look better now!`**（**批十八交付课自带**，本轮实测）；② **L112 `They look the same!` 应归「变体」**（后面是 `the same`，**不是单个形容词**），**不占同构池名额**；③ **L123 `:23037` `You look a little lost.` 批十八完全未记**（后面是「程度＋形容词」短语）。→ **精确清单：同构 14 处（L13/19/48/51/66/71/72/76/79/83/87/92/115/**L121**）＋ 变体 2 处（L112 `the same`／L123 `a little lost`）＝ **16 处**。**形状分布：`looks` 8／`look` 7／`looked` 1** |
| 2 | 批十八：「中文侧 `形容詞` 一篇」 | **该篇 canonical slug 是 `https://english.cool/adjectives/`**；**`https://english.cool/形容詞/` 直连 404**（本轮实测） | **引用时写 slug `adjectives`**，不写中文 slug（**批十八的表述会让后续复取时 404**） |
| 3 | 批十八：「中文侧 `look + 形容词` **无标题级专文**」 | 精确：**无 `look` 专文**（`look-like` 404 两式均试），**但有 `連綴動詞`（`linking-verbs`）与 `感官動詞`（`sense-verbs`）两篇主题级专文**（**两篇都在 869 条 sitemap 内**） | **表述校正为「无 `look` 标题级专文；有两篇主题级专文（連綴動詞／感官動詞），`look + 形容词` 是其中一节／一类的主角」**——**这比我方原判更强**（**标题级专文的两篇把本项当作核心类目，而非附带提及**） |
| 4 | 批十八：「BC **C1 14 课未取到（403）**」 | **本轮由存档取到 C1 14 课全目**（`Advanced passives review`…`Word order in phrasal verbs`），**无 look 家族课** | **BC 三档 68 课全目本轮全部完整复点**，**「BC 无课位」结论不变但证据等级升级**（批十八的 403 缺口已补） |
| 5 | 批十八：「`sound` 不在 BC stative 表内」 | **复核成立**（BC stative 表逐条：…appear, be, feel, hear, look, see, seem, smell, taste…**无 sound**）；**但 Cambridge `Linking verbs` 名单内 `sound` 在**（appear / feel / look / seem / **sound** / be / get / remain / smell / taste / become） | **两源不一致须记账**：**BC 把 sound 排除、Cambridge 收进来**——**我方若引「五词」清单，须标「按 Cambridge 名单」，不可写成「BC 也这么列」** |
| 6 | 批十八：「`look like` 四度三缺」 | 复核：**BC B1-B2 课程位在（B1 段）／中文 404／Murphy U117–118／我方 1 处**——**四度不变**；**本轮新增「三源都给了并列形态」的正面证据** | **D 档不变**，**但用途升级**：从「维持认读」升为「**甲章的对照卡素材**」（§5） |
| 7 | 批十八建议：「只取 look 一族＋1 个 feel」 | **本轮核查：`feel` 撑不起第 3 课**（双册零课位／我方独立句子数＝1／不在 cloze 词表内） | **建议改为「只取 look 一族（3 课），`feel` 降为 L126 的一次性添句或直接不用」**（§6.3） |
| 8 | 批十九候选第 4 项「形容词＋介词」 | 复核：**BC A1-A2 18 课清单第 1 条仍是 `Adjectives and prepositions`**（本轮逐条复点） | **B- 维持折卡**，无变化 |

---

## §8 复核来源清单 ＋ 未核实声明

### 8.1 本轮实读源清单

**上游交付物（3 份，本轮实读）**：`roadmap-grammar-eighteenth-batch-2026-09-19.md`（§6.2 批十九候补清单／§7 决策记录／§附录 A 实读源清单）·`competitive-analysis-grammar-eighteenth-batch-2026-09-19.md`（批十八竞析，**逐节实读**，作为「转述级」基线）·`roadmap-grammar-seventeenth-batch-2026-09-19.md`（§6.2 第 3 项，`look + 形容词` 判 C+ 的原判）。

**代码／数据（本轮独立复核，实读＋复算）**：`src/data/grammarLessons.ts`（**md5 `ab2f56a6497b007548c9b8552bbe7f63`，23,398 行／124 课**，`look` 家族全量 regex＋逐字段归属＋`grammarLabel` 全量扫描）·`src/data/huntCases.ts`（**md5 `d3d6ec77f6b082f5c0813c790a025fd7`，7,565 行／133 案**，`look`／`feel` 全量＋案件号映射）·`src/data/grammarSeasons.ts`（**md5 `d99de30f015d52fb241f30ab66f45f8c`**，18 季，末项 `season-18 {min:119,max:124}`）·`src/pages/GrammarPathPage.tsx`（`:255` m20 `afterLesson: 124`）·`src/data/grammarZeroTerms.ts`（**md5 `e767bfea6f2e0c7b4ad83ec530eccbab`**，**29 词，含「形容词」「副词」「介词」**）·`src/services/grammarAmbushService.ts`（**md5 `84b306b40e881c4f9b8c8d000851686c`**，`:160-187` 词表**逐字复核**：`look`／`looks` 在、`feel`／`sound`／`smell`／`taste`／`seem`／`appear` 均**不在**）·`src/data/grammarLessons.test.ts`（`:103-130` 零术语断言覆盖 `grammarLabel`／`oneLineRule`／`summary.rule`；`:194-218` 覆盖 AI 引用源三字段）。

**外部源（本轮实取，9 页；沿用批十八缓存 6 页）**：

| 源 | 页面 | 取法 | 落盘／md5 |
|---|---|---|---|
| BC | `english-grammar-reference/where-adjectives-go-in-a-sentence` | WebFetch 原文（curl 直连超时） | 无落盘（WebFetch 返回原文） |
| BC | A1-A2 索引 18 课全目 | WebFetch | — |
| BC | B1-B2 索引 36 课全目 | 本机存档 `bc-b1b2-new.html`（2026-04-21 快照） | `/private/tmp/bc-b1b2-new.html` |
| BC | C1 索引 14 课全目 | Wayback（WebFetch） | — |
| BC | `b1-b2-grammar/stative-verbs` | WebFetch 原文 | — |
| BC | `english-grammar-reference`（参考层总索引＋Adjectives 类 7 页） | WebFetch | — |
| Cambridge | `dictionary/english/look` | **curl 直连 HTTP 200** | `/tmp/audit19/cam_look.html` md5 `b55f3c8698d0444e8aa15d95e4df22ec`（**与批十八缓存逐字节相同**） |
| Cambridge | `grammar/british-grammar/look` | **curl 直连 HTTP 200** | `/tmp/audit19/camg_look.html` md5 `e51cb29446b98bf1d76ec6b1aac5e387`（**与批十八缓存逐字节相同**） |
| Cambridge | `grammar/british-grammar/linking-verbs` | curl 直连 HTTP 200 | `/tmp/audit19/linking-verbs.html` |
| Cambridge | `grammar/british-grammar/look-at-see-or-watch` | curl 直连 HTTP 200 | `/tmp/audit19/look-at-see-or-watch.html` |
| Cambridge | `dictionary/english/feel`／`sound`／`smell`／`taste`／`seem` | curl 直连 HTTP 200（**5 页**） | `/tmp/audit19/{feel,sound,smell,taste,seem}.html` |
| Murphy | 中级 4th TOC 全目 | 本机原件 | `/private/tmp/murphy_int.txt`／`murphy_full.txt` |
| Murphy | 初级 4th TOC 全目 | 本机原件 | `/private/tmp/murphy_ess.txt` |
| 中文侧 | `linking-verbs` | 本机缓存 | `/private/tmp/b18_ec_linking.html` md5 `4b5c1fb4…` |
| 中文侧 | `sense-verbs` | 本机缓存 | `/private/tmp/ec2_sense-verbs.body.txt` md5 `7f3605ad3ca76e63ae4cd299869cddb5` |
| 中文侧 | `adjectives` | 本机缓存 | `/private/tmp/ec_adj.html` md5 `eccb52c3c4565a14de5218c1328cc0ce` |
| 中文侧 | `adverb-adjective`（**本轮新取，用于排除**） | curl 直连 HTTP 200 | `/tmp/audit19/adverb-adjective.html` |
| 中文侧 | sitemap 869 条＋`look-like` 404 探测 | 本机缓存＋curl 直连 | `/private/tmp/ec-urls.txt` |

### 8.2 未核实声明（6 条）

1. **单元内部例句未核**：Murphy 双册**只有 TOC 抽文**（非正文）——**U99 的正文例句、页码、练习量均未核实**（与批十七／十八「未核实 2」同）。**`you look tired` 是标题文字，不是正文例句**。
2. **BC `using-as-and-like` 页本轮未重取**（批十八实读缓存充足且结论无变化）——**`He looks like his dad.` 系批十八原文，本轮未复核**。
3. **Duolingo 未核实**（§1.5，三次尝试全败）——**本轮不引任何 Duolingo 数据**。
4. **BC 直连对 curl 持续超时**（三次 20–30s 超时，非 403）；本轮 BC 的 5 处取法**混用 WebFetch 与存档**，**存档快照日期 2026-04-21**（B1-B2 索引）——**存档与线上的当轮差异未核**。
5. **`look like` 的 D 档判读未做「第三轮复取」**（`look-like` 两式 404 为本轮实测，**但未穷举中文侧的其他写法**，如「看起來像」类 slug）。
6. **封面／资产账未核**（属数析口径，本轮不做）：117 张 jpg 对 124 课、`cover` 复用情况须由数析另出。

### 8.3 本轮不引的内容（负清单，防下游误用）

- **不引** `look` 的 discourse marker 义（Cambridge `Look, too many people have died…`／`Look, Mark…`）——**强口气用法，零基础用户不需要，且与我方祈使义 `Look!` 冲突**。
- **不引**「系动词／联系动词／表语／形容词」四词（**红线 29 词，「形容词」在列**）。
- **不引** `sound`／`smell`／`taste` 三词（**课＋案全 0，零词架**）。
- **不引** Cambridge `Linking verbs` 名单的完整 12 词（**会一次引入 5 个零词架词**；**若引，只引 look／feel 两词**）。
- **不引** `look forward to`（**B1 段，防与批十八 `to + -ing` 同窗**，批十八路线图 §6.2 明文）。

---

**竞析结论一句话**：`look + 形容词` **B 档维持、升格成立、3 课封顶**（原文级证据已足，段位表述＝「A2 词义／B1 半边标题／课程位零」）；**`look like`／`look at` 的隔离有 Cambridge 词典同段并列＋语法页连续小标题＋中文两篇并排切开三段现成先例**；**`feel` 撑不起第 3 课**（双册零课位、我方独立句数＝1、不在 cloze 词表内），**建议第 3 课改为「同一个 look、两张脸」的零新知收口课**。
