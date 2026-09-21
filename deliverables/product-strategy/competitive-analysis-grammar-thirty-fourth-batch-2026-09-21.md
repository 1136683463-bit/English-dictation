# 跨源竞品分析 · 语法线第三十四批（`so that`／`as long as`／`several`）

**日期**：2026-09-21
**分析人**：竞析（产品战略团队 · 竞品/跨源分析师）
**类型**：生产级复核（对批三十一普查判档的二次判定 + 生产级支撑）
**上游**：`b-tier-frontier-survey-2026-09-20.md`（批三十一普查）、`competitive-analysis-b-tier-survey-semi-modal-2026-09-20.md`（批三十二同轴复核）、`competitive-analysis-grammar-thirty-second-batch-2026-09-21.md`（批三十二路线图）

---

## §0 本批的三条轴与并发新约束

| 轴 | 候选 | 我上次判的档 | 本轮要做的事 | **并发新约束** |
|---|---|---|---|---|
| **A** | `so that` | **B** | 复核档位；核 `in order to` 撞车；3 条带标记新错 | **L173 已教 `in order to`**（`I got up early in order to catch the bus.`） |
| **B** | `as long as` | **B** | 复核档位；核与 `if`／`unless` 关系；Murphy U115 逐字 | **L172 已教 `unless`** |
| **C** | `several` | **B** | **复核瑞思的「缓排」建议** | 无 |

### §0.1 我方现状**本轮实算**（词边界口径，`src/data/grammarLessons.ts` 185 课 ＋ `huntCases.ts` ＋ `grammarSeasons.ts`）

**复跑命令**（可验证）：

```python
import re
s=open('src/data/grammarLessons.ts',encoding='utf-8').read()
idx=[m.start() for m in re.finditer(r'id: "lesson-', s)]
blocks=[s[idx[i]:(idx[i+1] if i+1<len(idx) else len(s))] for i in range(len(idx))]
pat=lambda t: re.compile(r'(?<![A-Za-z])'+re.escape(t)+r'(?![A-Za-z])', re.I)
```

| 词 | GL 总命中 | 落在哪几课 | **目的义／量词义真零？** |
|---|---|---|---|
| `so that` | **1** | **仅 L102** | ✅ **真零**——那唯一 1 处是 `So that was last night!`（**「结果义 so + 指示 that」，不是目的义连词**） |
| `so`（词边界，大小写敏感） | **87** | 多课 | 与用户给的 **GL 87 一致** ✅（大小写不敏感口径为 159） |
| `as long as` | **0** | — | ✅ **真零** |
| `several` | **0** | — | ✅ **真零** |
| `even if` | **0** | — | ✅ 真零（本轮顺带复算） |
| `as if` | **0** | — | ✅ 真零（本轮顺带复算） |
| `unless` | **81** | **L172（76）／L185（5）** | **已教**（L172 正课 + L185 收口） |
| `in order to` | **48** | **L173（46）／L185（2）** | **已教**（L173 正课 + L185 收口） |
| `if` | **176** | L47(2)／L48(77)／L49(61)／L78(1)／L142(9)／L143(1)／L172(22)／L185(3) | **已教**（L48 正课） |

**HC／季文件复算**：

| 文件 | `so that` | `as long as` | `several` | `unless` | `in order to` |
|---|---|---|---|---|---|
| `src/data/huntCases.ts` | 0 | 0 | 0 | **6** | **2** |
| `src/data/grammarSeasons.ts` | 0 | 0 | 0 | 0 | 0 |

### §0.2 并发新教的 L173 逐字（本轮实读 `src/data/grammarLessons.ts:33986–34090`）

| 字段 | 逐字 |
|---|---|
| `title` | `为了赶上早班车` |
| `grammarLabel` | **`为了 · in order to`** |
| `targetSentence` | `I got up early in order to catch the bus.` |
| `oneLineRule` | 「说「为了」用 in order to——I got up early in order to catch the bus（为了赶上那班车，我起得很早）。**它和第 44 课那块小垫板 to 是一家人**，说的时候正式一点、清楚一点。」 |
| `blocks` | ① `I got up early`（我起得很早（做的事））／② **`in order to catch the bus`**（为了赶上那班车（为的是什么）） |
| `variants` 否定 | `I got up early in order not to miss the bus.` ／ noteZh「说「为了不」把 not 插在 to 前面。」 |
| `variants` 疑问 | `Why did you get up so early?` ／ noteZh「问原因用 Why + did。」 |
| `contrast[1]` | ❌ `I got up early in order catch the bus.`（mark=`order`）→ whyZh「**in order to 三个词一起出场**——in order 【to】 catch。」 |
| `contrast[2]` | ❌ `I got up early for to catch the bus.`（mark=`for`）→ whyZh「「为了做某事」用 in order to，**不用 for to**——for 后面跟的是东西（for you），不接动作。」 |
| `contrast[3]` | ✅双正解 `I go to the shop to buy milk.`（**L44 那块小垫板**） |

### §0.3 并发新教的 L172 逐字（本轮实读 `src/data/grammarLessons.ts:33734–33760`）

| 字段 | 逐字 |
|---|---|
| `title` | `除非下雨` |
| `grammarLabel` | **`除非 · unless`** |
| `targetSentence` | `We will go unless it rains.` |
| `oneLineRule` | 「说「除非」用 unless——We will go unless it rains（除非下雨，不然我们就去）。**它和第 48 课那个 if 正好反着**：if 说「如果下雨就不去」，unless 说「不下雨就去」。」 |
| `recall.noteZh` | 「unless 自己就含「除非不」——后面不再加 not。」 |

**→ §0 的结论**：本批要判的两项（`so that`／`as long as`）在我方**都是真零**；三项候选里 `several` 也是真零。**三轴的真零事实本轮全部独立复现**。

---

## §1 三轴逐候选档位复核表

| # | 候选 | **① 跨源逐字证据** | **② 课程位** | **③ 规则页** | **④ CEFR** | **⑤ 档位** | **⑥ 理由** |
|---|---|---|---|---|---|---|---|
| **A** | **`so that`** | **Cambridge `So that or in order that ?`**（**HTTP 200，title 逐字 `So that or in order that ? - Grammar - Cambridge Dictionary`**，**面包屑逐字 `Grammar > Easily confused words > So that or in order that?`——⚠️ 挂在「易混词」大类，不是 `Verbs` 也不是 `Conjunctions`**）：**全页 `Not:` ＝ 0／Warning ＝ 0**，正文 4 段逐字 "**We use so that and in order that to talk about purpose. We often use them with modal verbs (can, would, will, etc.). So that is far more common than in order that, and in order that is more formal:**"／`I'll go by car so that I can take more luggage.`／`We left a message with his neighbour so that he would know we'd called.`／"**We often leave out that after so in informal situations:**"／`I've made some sandwiches so (that) we can have a snack on the way.`／"**When referring to the future, we can use the present simple or will/'ll after so that.** We usually use the present simple after in order that to talk about the future:"／"**So that (but not in order that) can also mean 'with the result that':**"／`The birds return every year around March, so that April is a good time to see them.`。**Cambridge 第二个落点（本轮新取，最硬的一条）**：`Conjunctions: causes, reasons, results and purpose`（面包屑 `Grammar > Words, sentences and clauses > Conjunctions and linking words > ...`）**目的连词表逐字**："**We use the following conjunctions to talk about purposes or goals. So and so that are more common than so as and in order that. So as is rather informal. In order that is more formal than the others.**"＋表头逐字 `action`／`conjunction`／`purpose/goal`，conjunction 列逐字 **`so`／`so that`／`so as`／`in order that (formal)`**＋"**We don't usually put the subordinating clause first. When we do, it is more formal.**"。**Cambridge 第三个落点**：`So` 页（面包屑 `Grammar > Using English > Spoken English > So`）逐字 "**We use so + that as a conjunction to introduce clauses of reason and explanation:**"＋`They both went on a diet so that they could play more football with their friends.`。**Cambridge 词典**：`/dictionary/english/so-that` → **200 但 title 逐字 `WORK | English meaning - Cambridge Dictionary`（返回无关词条，无独立条目）**。**Oxford `so-that` → 404**（title 逐字 `so-that - Did you spell it correctly?`）。**LDOCE `so (that)` 200 独立条目**（title 逐字 `so (that) | meaning of so (that) in Longman Dictionary of Contemporary English | LDOCE`），**两个义项逐字**：`CAUSE` "**in order to make something happen, make something possible etc**"（`He lowered his voice so Doris couldn't hear.`／`Why don't you start out early so that you don't have to hurry?`）／`RESULT` "**used to say that something happens or is true as a result of the situation you have just stated**"。**BC 全站不收**：A1-A2 第 6 课 `Infinitive of purpose`（h1 逐字 `Infinitive of purpose`，Level 逐字 `A1 Elementary`／`A2 Pre-intermediate`）**正文 `in order to` ＝ 0、`so that` ＝ 0**；参考层 `'to'-infinitives` 逐字 "**We can also express purpose with in order to and in order not to:**"／"**or so as to and so as not to:**"——**依旧 0 `so that`**；B1-B2 36 课全目**无 `so that`**；`Conditionals: zero, first and second`（B1／B2）**0 `so that`**。**中文侧四篇独立专文（本轮 sitemap 全索引实证）**：`english.cool/so-that/` 200（页题逐字「**「so that、in order that」正確用法是？來搞懂！**」）／`english.cool/in-order-to/` 200／`english.cool/so-as-to/` 200／`english.cool/so-that-such-that/` 200（页题逐字「**so、so that、such that 用法差在哪？來看例句搞懂！**」）——**同轴 4 篇，是本批三项里中文侧最厚的一项** | **⚠️ 半有**：**BC A1-A2 第 6 课是 `to`-inf 的位（`to` 才在标题里），`so that` 挤不进去**；**Murphy 中级 U64 标题逐字 `64 to…, for… and so that…`（沿用既有批次记录，本轮未核，见 §7）**——**三词共用一格，且 `so that` 是第三位** | **✅ 有但是「易混对页」**：Cambridge `So that or in order that?` **独立页存在，但挂在 `Easily confused words` 下、`Not:` ＝ 0、Warning ＝ 0、正文仅 4 段**——**它不是 `so that` 的完整规则页，是「二选一」页**。**补强件三条**：① 目的连词表页（本节逐字）；② `So` 页的 `So and that-clauses` 节；③ **中文侧 4 篇独立专文 + LDOCE 双义项独立条目** | **⚠️ 无可靠标位**：`so that` 词典 slug 返回 `WORK` 词条（无条目）；**`in order to` 词典条目本轮 4 次实取 `cdo_elvl` 抖动为 C1／A2／B2／B1 → 判为不可用**（§7 项 3）；语法页均无 badge。**BC 的 purpose 落点标 `A1 Elementary`／`A2 Pre-intermediate`，但那一课教的是 `to`-infinitive** | **B（维持）** | **维持 B，不升不降。** 不给 B＋：**① 课程位是 `to`-inf 的位，`so that` 挤不进去（BC 全站 0 命中是明证）**；**② 规则页是「易混对页」且零禁用、零 Warning**；**③ CEFR 无可靠标位**。不给 B−／不做：**① 与 L173 的切分是干净的（§2.2 实证）**；**② 跨源给足五层证据（独立易混页 ＋ 目的连词表 ＋ So 页小节 ＋ LDOCE 双义项独立条目 ＋ 中文侧 4 篇专文）**；**③ 我方目的义 `so that` 是复算过的真零**；**④ 有 3 条可标记新错（§2.3）**。**⚠️ 与上次的一份差别**：上次我把 `so that` 的课程位记成「⚠️ 是 `to`-inf 的位」，**本轮新增了第二条课程位证据（Cambridge 目的连词表把 `so that` 列进 conjunction 列）——但那张表是「一组词一格」的连词表，不是单元位，所以不构成升档理由** |
| **B** | **`as long as`** | **Cambridge 独立页**（**HTTP 200，title 逐字 `As long as and so long as - Grammar - Cambridge Dictionary`**，**面包屑逐字 `Grammar > Words, sentences and clauses > Conjunctions and linking words > As long as and so long as`**）：**h1 逐字 `As long as and so long as`**，**`Not:` ＝ 1（全页唯一）**，正文逐字 "**As long as and so long as are conjunctions.**"／h2 `As long as` 逐字 "**We use as long as to refer to the intended duration of a plan or idea, most commonly referring to the future. We always use the present simple to refer to the future after as long as:**"＋`We are very happy for you to stay at our house as long as you like.`／`I'll remember that film as long as I live.`／**"Not: … as long as I will live."**／h2 `As long as and so long as` 逐字 "**As long as or so long as also means 'provided that', 'providing that' or 'on condition that':**"＋`You are allowed to go as long as you let us know when you arrive.`／"**So long as is a little more informal:**"＋`You can borrow the car so long as you don't drive too fast.`。**Cambridge 第二个落点**：`Conditionals: other expressions ( unless, should, as long as )`（面包屑 `Grammar > Verbs > Conditionals and wishes > ...`）h2 逐字 "**As long as, so long as, providing, etc.**"＋"**Sometimes we need to impose specific conditions or set limits on a situation. In these cases, conditional clauses can begin with phrases such as as long as, so long as, only if, on condition that, providing (that), provided (that).**"＋"**As long as is more common in speaking; so long as and on condition that are more formal and more common in writing:**"＋`You can play in the living room as long as you don't make a mess.`。**Cambridge 第三个落点（本轮新发现）**：`Long` 页正文内含节逐字 "**As long as The phrase as long as is used as a conjunction. It means 'on condition that':**"＋`As long as the weather is okay, we're going to paint the house tomorrow.`／`Jenny said she'd come to the party as long as we don't stay too late.`。**Cambridge 词典 `as-long-as` → 200，title 逐字 `AS LONG AS \| English meaning - Cambridge Dictionary`，但 `cdo_elvl` 5 次实取抖动为 C1／B1／B2／A1／A2 → 无可靠标位**（§7 项 3）。**LDOCE `as/so long as` 独立条目 200**，**两个义项逐字**："**used to say that one thing can happen or be true only if another thing happens or is true**"（`You can go out to play as long as you stay in the back yard.`）／"**used to say that one thing will continue to happen or be true if another thing happens or is true at the same time**"（`As long as we keep playing well, we'll keep winning games.`）。**BC 一句话、无小节**：`Conditionals: zero, first and second`（Level 逐字 `B1 Intermediate`／`B2 Upper intermediate`）First conditional 节逐字 "**It is also common to use this structure with unless, as long as, as soon as or in case instead of if.**"＋例 `You can go to the party, as long as you're back by midnight.`——**⚠️ 本轮三档索引全目复点：A1-A2 18 课／B1-B2 36 课／C1 14 课 ＝ 68 课，`as long as` 专课 0**。**中文侧两篇**：`english.cool/as-long-as/` 200 **独立专文**（页题逐字「**來搞懂 as long as、as soon as、as far as 的用法！(含例句）**」），**h2 逐字 `1. as long as  只要…`**，正文逐字 "**as long as 指的是如果 A 事件發生了，那麼 B 事件就能夠實現，是條件句的一種。**"／"**as long as 作為連接詞來連接兩個句子，可以放在句首或句中，代換成 so long as 也是一樣的意思。**"；`letmeenglish.com/more-conditionals/` 200（页题逐字「unless、in case 用法比較：條件句差異解析＋例句與練習」），**h2 逐字 `as long as / provided (that) / providing (that) / on condition (that) / only if 只要…的話`**，正文逐字「**我們可以使用 as long as、provided/providing (that)、on condition (that) 或 only if（而不是只用if），當我們要強調需要存在某條件以便某事可以發生或完成時。**」 | **⚠️ 半有**：**Murphy 中级 U115 三词共用一格**（既有记录标题逐字 `115unlessaslongasprovided`，**本轮未核，见 §7 项 1**）；**BC 三档 68 课 0 专课（本轮全目复点实证）；BC 只有一句列举，无独立小节** | **✅ 有（本批三项里最厚）**：**Cambridge 独立页（2 h2 ＋ 1 `Not:`）＋ 第二落点（Conditionals 页独立 h2）＋ 第三落点（`Long` 页内含节）＋ LDOCE 独立条目（双义项）＋ 中文侧独立专文（含 `so long as` 代换说明 ＋ 与 `as soon as` 的三项辨析练习）** | **⚠️ 无可靠标位**（Cambridge 词典 `cdo_elvl` 抖动；语法页无 badge） | **B（维持）** | **维持 B，不升不降。** 不给 B＋：**① 课程位是三词共用一格（U115），不是我方意义的单点课位**；**② CEFR 无可靠标位**；**③ BC 只是一句话列举**。不给 B−／不做：**① Cambridge 独立页 ＋ `Not:` 1 条（硬错点）＋ 三个落点**；**② 它有两个意思（条件「只要」＋ 持续「只要…一直」），跨源两处独立印证这个二分（Cambridge 两个 h2／LDOCE 两个义项）——这不是同义换词**；**③ 与 L142 `as soon as` 的切分在中文侧有现成练习题（§3.2）**；**④ 我方真零**。**⚠️ 与上次的一份差别**：上次我把课程位记作「⚠️ Murphy U115（未核）」，**本轮补上了 BC 三档 68 课全目复点实证的 0 ＋ Cambridge 第三落点（`Long` 页）**——**档位不变，但证据层级从「1 处未核」变成「1 处未核 ＋ 2 处本轮实取」** |
| **C** | **`several`** | **Cambridge 无独立页，本轮五重实测**：**`/grammar/british-grammar/several` → 302 回总入口**（既有记录）；**`common-mistakes-in-english` 全索引 974 条 slug 本轮逐条列举：`several` ＝ 0**（复跑：`links=sorted(set(re.findall(r'/grammar/british-grammar/([a-z0-9\-]+)"',s)))` → `[l for l in links if 'several' in l]` ＝ `[]`）；**`Quantifiers` 索引页正文 `several` ＝ 0**；**`Much, many, a lot of, lots of: quantifiers` 页 ＝ 0**；**`Little, a little, few, a few` 页 ＝ 0**；**`Word choice: few or a few?` 页 ＝ 0**；**`Determiners: typical errors` 页 ＝ 0**。**⚠️ 但本轮实取到两条真规则句（这是与批三十二口径的实质差别）**：① **`Determiners and types of noun`**（面包屑 `Grammar > Nouns, pronouns and determiners > Determiners > Determiners and types of noun`）**`several` 命中 3 处**，规则句逐字 "**Both, many, (a) few, the numbers two, three, four, etc., several, these and those are only used with plural nouns:**"＋例 `Several items were missing when we opened the box to unpack everything.`；② **`Determiners used as pronouns`**（面包屑同级）**`several` 命中 3 处**，逐字 `Several people complained about the slow service.`／`It's not just one school that is in financial difficulty; there are several.`＋**代词名单里含 `several`**。**③ 另有一条「词表里有、条目不存在」的硬证据**：`Determiners ( the, my, some, this )` 页逐字 "**Here is a list of the determiners included in this book. Many of them have individual entries:**"＋名单逐字含 **`several`**——**而 `several` 的语法页 slug 恰恰 302 回总入口（条目不存在）**。**Cambridge 词典 `SEVERAL` 200**（title 逐字 `SEVERAL | English meaning - Cambridge Dictionary`）：**badge 实读 `A2`（3/3 稳定，`epp-xref` span 存在）**，词性逐字 `determiner, pronoun`，释义逐字 "**some; an amount that is not exact but is fewer than many:**"。**Oxford `several_1` 200**（title 逐字 `several determiner - Definition, pictures, pronunciation and usage notes`）：`fkcefr="a2"`×1，`ox3000="y"`，释义逐字 "**more than two but not very many**"。**LDOCE `several` 200（本轮新取，是 §4 的决定性一条）**：主释义逐字 "**a number of people or things that is more than a few, but not a lot**"，**THESAURUS 框逐字给出与 `a few` 的直接对照**："**several: more than a few people or things, but not a large number**"／"**a number of something: several. A number of sounds more formal than several**"／"**quite a few: several – used when emphasizing that there are rather a lot of people, things etc. Quite a few sounds more informal than several and is more commonly used in spoken English**"。**LDOCE `few` 的 GRAMMAR 框逐字给出 `a few` 的下限**："**a few: A few means 'a small number, for example two or three people or things'.**"／"**few: Few means 'not many or hardly any'. It emphasizes how small the number is.**"。**BC `Quantifiers` 参考页**：逐字 "**Some quantifiers can be used only with count nouns**"＋名单逐字 `(not) many`／`each`／`either`／`(a) few`／**`several`**／`both`／`neither`／`fewer`（**⚠️ 本轮 WebFetch 三次取该页结果不一致，见 §7 项 4**）。**中文侧二度为零**：`english.cool/several/` **404**；**`english.cool` 873 条 slug 全索引本轮逐条列举，`several` ＝ 0**（复跑：`grep -i several /tmp/ec_slugs.txt` 无输出）；`english.cool/quantifiers/` 200 **但「數量詞一覽」表内无 `several`**（表内逐字含 `some`／`any`／`a few`／`a little`／`few`／`little`／`many`／`much`／`each`／`every`／`all`／`whole`／`both`／`none`）；`letmeenglish.com/several/` **404**（该站 post-sitemap 483 条 slug 本轮全索引实证无 `several`） | **❌ 无**（Cambridge 语法页 302；BC 无课；Murphy 按既有记录无独立单元——**批三十二已记，本轮未核**） | **⚠️ 无独立页，但有 2 条规则句**（**修正批三十二的「规则页为 0」口径**）：① 只接复数名词（与 `both`／`many`／`(a) few`／`these`／`those` 同句并列）；② 可作代词（`there are several.`）。**第三层补强在词典侧**：LDOCE 的 THESAURUS 框是**明文对照规则**（`several` vs `a few` vs `quite a few` vs `a number of`） | **A2 双源一致且本轮 3/3 稳定**（Cambridge `A2` ＋ Oxford `fkcefr="a2"`），**且两源释义逐字高度接近**（Cambridge `some; an amount that is not exact but is fewer than many` ／ Oxford `more than two but not very many`）；**LDOCE 给了第三条刻度（`more than a few, but not a lot`）** | **B−（修正，从 B 下调）** | **⚠️ 修正：B → B−。** **本轮支持「缓排」升级为「判不做独立课」，三条：** ① **红线触发（§5）**——`several` 是**同一意思（数量不定）的另一种说法**，唯一增量是**刻度**，**不是新结构**；② **跨源零禁用专属它**——Cambridge `Word choice: few or a few?`（专门讲 `few` vs `a few` 的纠错页）**`several` ＝ 0 命中**、`Determiners: typical errors` 页 **`several` ＝ 0 命中**（本轮双页实算）**⇒ 上游没有为 `several` 准备任何一条「❌」**；③ **若单开一课，全课 3 条带标记新错将全部是「换一个词」**，无法构造合法的错句标记——**这违反我方「每课 3 标记」的硬约束**。**⚠️ 但「缓排」的原始表述（瑞思：句法与 `a few`／`some` 全同、只差刻度）本轮被证实得更精确了**：Cambridge 逐字把 `(a) few` 与 `several` 写在**同一句**里（"…`(a) few`, the numbers two, three, four, etc., **`several`**, these and those are only used with plural nouns"）——**同句并列是「同句法槽位」的直接证据**。**⇒ 结论：不是「等一等再做」，是「不该单独成课」；建议做 L114 的补充刻度卡（§4.3）** |

---

## §2 轴 A 专项（`so that`）

### §2.1 跨源规则页与逐字（三段分工）

**跨源把 `so that` 分在三个地方讲，这三段的逐字如下**（全部本轮直取可复跑）：

| 来源 | URL／出处 | 逐字 |
|---|---|---|
| Cambridge 易混对页 | `/grammar/british-grammar/so-that-or-in-order-that`（**title 已核**：`So that or in order that ? - Grammar - Cambridge Dictionary`） | "**We use so that and in order that to talk about purpose. We often use them with modal verbs (can, would, will, etc.). So that is far more common than in order that, and in order that is more formal:**"<br>"**We often leave out that after so in informal situations:**"<br>"**When referring to the future, we can use the present simple or will/'ll after so that.**"<br>"**So that (but not in order that) can also mean 'with the result that':**" |
| Cambridge 目的连词表 | `/grammar/british-grammar/conjunctions-causes-reasons-results-and-purpose`（**title 已核**：`Conjunctions: causes, reasons, results and purpose - Cambridge Grammar`） | "**We use the following conjunctions to talk about purposes or goals. So and so that are more common than so as and in order that. So as is rather informal. In order that is more formal than the others.**"<br>表结构逐字：`action` ＋ `conjunction` ＋ `purpose/goal`，conjunction 列逐字 **`so`／`so that`／`so as`／`in order that (formal)`**<br>"**We don't usually put the subordinating clause first. When we do, it is more formal.**" |
| Cambridge `So` 页 | `/grammar/british-grammar/so`（面包屑 `Grammar > Using English > Spoken English > So`） | "**So and that-clauses We use so + that as a conjunction to introduce clauses of reason and explanation:**"＋`They both went on a diet so that they could play more football with their friends.` |

**⚠️ 三条对本批判断有决定作用的观察**：

1. **`so that` 的「专属页」是易混对页，不是规则页**——`Not:` ＝ 0、`Warning` ＝ 0、正文 4 段。**它没有一条禁用**。
2. **`in order to` 不在这张目的连词表里**（表里是 `so`／`so that`／`so as`／**`in order that`**）——**这是一个必须看清的字面差别：表里有 `in order that`，没有 `in order to`**。
3. **`So` 页给的是「结果／解释」读法**（`clauses of reason and explanation`），**跟易混页的「目的」读法不是一个**——**跨源自己把 `so that` 的两种读法分在两页**。

### §2.2 `so that` 与 `in order to` 的差别 —— **跨源是否当两个教学点？**

**答：是。跨源当两个教学点，切分干净。**

**逐字依据链（三源独立成立）**：

| # | 源 | 逐字 | 说明 |
|---|---|---|---|
| 1 | Cambridge `In order to` 独立页（**title 已核**：`In order to - Grammar - Cambridge Dictionary`；**面包屑逐字** `Grammar > Words, sentences and clauses > Conjunctions and linking words > In order to`） | "**In order to is a subordinating conjunction. We use in order to with an infinitive form of a verb to express the purpose of something. It introduces a subordinate clause. It is more common in writing than in speaking:**"／"**The negative of in order to is in order not to:**" | **`in order to` 有自己独立的一页**（与易混页同级挂在 `Conjunctions and linking words` 下）；**它的规定是「＋infinitive」** |
| 2 | Cambridge `So that or in order that?` 页末尾 | **`See also: In order to`** | **跨源用 See-also 把两页挂在一起——挂链而不合并，正是「两个教学点」的标准证据形式** |
| 3 | Cambridge `Conjunctions: causes, reasons, results and purpose` 页 | 目的连词表 conjunction 列逐字 **`so`／`so that`／`so as`／`in order that (formal)`** | **`in order to` 不在表内 ⇒ 跨源不把它归入「目的连词」类，归入 `to`-infinitive 家族** |
| 4 | BC | A1-A2 正课 h1 逐字 `Infinitive of purpose`；参考层 `'to'-infinitives` 逐字 "**We can also express purpose with in order to and in order not to:**"／"**or so as to and so as not to:**" | **BC 把 `in order to` 与 `to`-inf／`so as to` 并列为同一功能的形式**——**而 BC 全站 `so that` ＝ 0**（两页实取，0 命中） |
| 5 | 中文侧 `english.cool/in-order-to/` | 逐字 "**in order to 就跟表目的時的 to 用法是一樣的！差別在於用 in order to，感覺會比單用 to 來得正式一點。**" | **中文侧把 `in order to` 直接等同于「目的 to」**，**不放在「so that」那一篇里** |
| 6 | 中文侧 `english.cool/so-that/` | 逐字 "**so that / in order that 都是用來接表達目的、理由的句子，而且常搭配情態助動詞，如 can、could、will、would 等**" | **中文侧把 `so that` 与 `in order that` 配对**（**始终是 + 小句子**），**不是与 `in order to` 配对** |

**⚠️ 我方现状的撞车评估（这是本轴最要紧的一条）**：

L173 的 `blocks` 逐字是：

> ① `I got up early`（我起得很早（做的事））／② **`in order to catch the bus`**（为了赶上那班车（为的是什么））

L173 的 `oneLineRule` 逐字是：「说「为了」用 in order to」。

**⇒ 判定：切分干净，但**必须在课内显式处理「同一个中文词、两种接法」**。**

| 维度 | `in order to`（L173 已教） | `so that`（本批候选） | **是否同结构？** |
|---|---|---|---|
| 后面跟什么 | **动词原形**（`in order to catch`） | **一个完整小句**（`so that I could catch`） | ❌ **不同**（这正是跨源的规定逐字：`with an infinitive form of a verb` vs `with modal verbs`） |
| 是否用情态动词 | 不用（原形本身不能带 can/will） | **常带** `can／could／will／would`（Cambridge 逐字 "We often use them with modal verbs (can, would, will, etc.)"） | ❌ **不同** |
| 否定怎么做 | `in order not to`（**L173 已教**，逐字 noteZh「说「为了不」把 not 插在 to 前面。」） | 小句内否定（`so that I don't miss the bus`） | ❌ **不同** |
| 能否置句首 | ✅（english.cool 逐字 "in order to 也跟 to 一樣，可放句中或句首"） | **⚠️ 跨源逐字" We don't usually put the subordinating clause first."** | ❌ **不同（且这是 `so that` 的独有规定）** |
| 语域 | "It is more common in writing than in speaking"（Cambridge） | "so that is far more common than in order that"（Cambridge）——**口语常用** | ❌ **不同** |
| 上游怎么归类 | `to`-infinitive 家族（BC `Infinitive of purpose` A1-A2 正课） | **conjunction 家族**（Cambridge 目的连词表） | ❌ **不同** |

**→ 结论：`so that` 是「新结构」，不是「同义换词」。档位不下调（§5 详判）。**

### §2.3 3 条带标记新错（逐字依据）

**这 3 条的共同来源是「L173 刚教完 `in order to`」——每一条都建立在我们自己已经教过的东西上**，因此是真正的「新错」而不是泛错。

| # | ❌ 错句（我方句式） | **标记** | ✅ 正解 | **逐字依据** |
|---|---|---|---|---|
| **1** | `I got up early so that catch the bus.` | **`catch`** | `I got up early so that I could catch the bus.` | **Cambridge 易混页逐字 "We often use them with modal verbs (can, would, will, etc.)."** ＋ **LDOCE `so (that)` 的 `CAUSE` 义项独立例句逐字 `Why don't you start out early so that you don't have to hurry?`**（**小句带主语 + 情态／否定**）＋ **中文侧 english.cool 逐字「常搭配情態助動詞，如 can、could、will、would」**。<br>**迁移机制**：L173 的 target 是 `in order to catch`（原形）——**学生最容易把「为了」直译成 `so that catch`**。**这条错正是 L173 之后才会出现的**。 |
| **2** | `I got up early, so I could catch the bus.`（**想说「为了」却写成结果义的 `so` + 逗号**） | **`,`（逗号）／`so`** | `I got up early so that I could catch the bus.` | **Cambridge 易混页逐字 "We often leave out that after so in informal situations:"**（**省略 `that` 是合法的，但省了之后必须靠语意分**）＋ **中文侧 english.cool 逐字「在很口語的情況，that 甚至也可以省略」＋ 逐字「此時 so 表示結果，前面經常會加逗號」＋ 判别法逐字「從 so 後面句子的意思來判斷即可」**。<br>**这条的标记物必须是逗号**——因为中文侧的逐字判别法就是「前面经常加逗号＝结果义」。 |
| **3** | `I got up early in order to I could catch the bus.` | **`in order to`** | `I got up early in order to catch the bus.` 或 `I got up early so that I could catch the bus.` | **Cambridge `In order to` 页逐字 "We use in order to with an infinitive form of a verb to express the purpose of something. It introduces a subordinate clause."**——**`in order to` 后面不能接小句**。<br>**这条是「两课并存」才会产生的错**：L173 教了 `in order to`，本课教了 `so that`，学生把两者接法互串。**它也是本课与 L173 切分的显式教学点**。 |

**⚠️ 一条不能做成错题的（避免踩坑）**：**`so that` 后接 `will` 不算错**——Cambridge 逐字 "**When referring to the future, we can use the present simple or will/'ll after so that.**"（**两者都对**）。**不得把 `so that you will get it` 标成错误**（**这与 L48 `if` 里不用 will 的规则相反，必须显式切开，否则会与 L48 冲突**）。

**⚠️ 第二条不能做成错题的**：**语序**——Cambridge 逐字 "We don't usually put the subordinating clause first. When we do, it is more formal."（**是「不常用」，不是「错」**）。**只可作为「更正式」的说明，不能标记为错**。

### §2.4 目标句候选

| 候选 | 句 | 我方零件实算 | 评价 |
|---|---|---|---|
| **首选** | `I got up early so that I could catch the bus.` | `could` 46／`early` 87／`catch` 3／`bus` 18 —— **全部有货** | ✅ **与 L173 同场景同句干**（`I got up early … catch the bus`）——**两课形成最小对照对，恰好符合 L185 收口课已写下的 pairing**（逐字：「unless／in order to」是一对） |
| 备选 1 | `I left home early so that I could catch the first train.` | **中文侧 english.cool 原句逐字**（`I left home early so that I could catch the first train.`）；`train` 未算 | ✅ **中文侧原句**，脚手架可信度高 |
| 备选 2 | `She studies hard so that she can pass the test.` | `study` 3／`pass` 8／`test` **0** | ⚠️ **`test` 为零，须造词** |

**→ 建议首选与备选 1 都用**（首选作 target，备选 1 作 example，两句都是跨源逐字原句：首选句干来自 L173 与 Cambridge 的 `so that I can …` 结构，备选 1 是 english.cool 逐字原句）。

---

## §3 轴 B 专项（`as long as`）

### §3.1 Murphy U115 三词共用的逐字

**⚠️ 本轮未核（诚实登记）**。

| 项 | 内容 |
|---|---|
| 既有记录 | **Murphy 中级 4th U115 标题逐字 `115unlessaslongasprovided`**（**归一化去空白后的串**） |
| 来源批次 | 批二十四（`competitive-analysis-grammar-twenty-fourth-batch-2026-09-20.md` 附录 A）／批二十五（`competitive-analysis-grammar-twenty-fifth-batch-2026-09-20.md` §A.2，**含 md5 复算 `murphy_int.txt` = `994fde91a0ca7e2d6a7417ed5c72b1d5`**）／批二十七 |
| 当时的验证方式 | 「`/private/tmp/murphy_int_norm.txt` 逐字 grep」→ 记：`grep -o "incase" /tmp/murphy_int_norm.txt -> 1（上下文含 113…114incase115unlessaslongasprovided）` |
| **本轮复核结果** | **❌ 全部失败**：`/private/tmp/murphy_int.txt`、`murphy_ess.txt`、`murphy_int_norm.txt`、`murphy_ess_norm.txt`、`murphy_toc_clean.txt` **本机已不存在**（`ls` ＋ `find /Users/liujun /tmp -iname "*murphy*"` **双查**，只剩一个 1304 B 的 `murphy_int.html`，内容是 Cloudflare 503 错误页）；`cambridge.org` **403／503**；`assets.cambridge.org` **000**；`archive.org` **000**；`z-lib.io`／`libgen.is`／`scribd.com`／`dokumen.pub`／`vdoc.pub` **全部 000** |
| **结论** | **U115 三词共用：沿用既有批次记录，本轮未核（§7 项 1）**。**⚠️ 但本轮补上了 3 处独立于 Murphy 的课程位／规则页证据（Cambridge 三个落点 ＋ BC 68 课 0 ＋ LDOCE 独立条目），使 `as long as` 的判定不再依赖 Murphy 单条** |

**⚠️ 顺带登记**：**Murphy 中级 U64 标题逐字 `64 to…, for… and so that…`（批二十／批二十一既有记录，本轮同样未核）**——**轴 A 的课程位证据也在此项上仍是沿用值**。

### §3.2 它与 `if`／`unless` 的关系

**答：`as long as` 与 `unless` 是「同一小节的并列项」（Cambridge 明确），但跨源给了各自独立的规则页 —— 不是同义关系，是**同族相邻**。**

**逐字链**：

| # | 源 | 逐字 | 说明 |
|---|---|---|---|
| 1 | Cambridge `Conditionals: other expressions ( unless, should, as long as )` | **页题逐字含三词**：`Conditionals: other expressions ( unless, should, as long as )`；h2 逐字 `Unless`／`Should you (Should with inversion)`／`Had you (Had with inversion)`／`If + were to`／**`As long as, so long as, providing, etc.`**／`Or and otherwise`／`Supposing` | ✅ **是「同一小节的并列项」——但同一页里有 7 个 h2，`unless` 与 `as long as` 各占一个，互不隶属** |
| 2 | 同上页 `As long as` 节 | "**Sometimes we need to impose specific conditions or set limits on a situation. In these cases, conditional clauses can begin with phrases such as as long as, so long as, only if, on condition that, providing (that), provided (that).**" | ✅ **六词并列**（`as long as` 是第一位） |
| 3 | Cambridge `Unless` **独立页**（**title 已核**：`Unless - Grammar - Cambridge Dictionary`；面包屑 `Grammar > Words, sentences and clauses > Conjunctions and linking words > Unless`） | "**We use the conjunction unless to mean 'except if'.**"／"**Unless is a conditional word (like if), so we don't use will or would in the subordinate clause:**"／`Unless I hear from you, I'll see you at two o'clock.`／**"Not: Unless I'll hear from you …"**／**`Typical errors`** 两条逐字 "**We don't use unless when we mean if**"（对比例 `Pete will drive if Alex can't.`／**`Not: Pete will drive unless Alex can't.`**）／"**We don't use will or would in the clause after unless**"；**`Unless and if … not` 节逐字 "both mean 'except if'"** | ✅ **`unless` 有自己独立的一页 ＋ 2 条 typical errors**（**本轮实取，`Not:` 4 条**） |
| 4 | BC `Conditionals: zero, first and second`（B1／B2） | "**It is also common to use this structure with unless, as long as, as soon as or in case instead of if.**" | ✅ **BC 把四词写成第一条件句里「代替 if」的一组**——**无独立小节** |
| 5 | 中文侧 `english.cool/unless/` 200 | 逐字「**Unless 後面一定是肯定句，否則會出現「雙重否定」的問題**」／「**unless 不能出現在疑問句中**」／**三条 ❌ 逐字**（`Unless the weather will get better, … ❌` 等）；并逐字给出换算 `=Unless I get the loan, I will give up on my business plan. ⭕️` 对 `If I don't get the loan, …` | ✅ **中文侧 `unless` 是独立一篇，主线是「unless = if not」的否定逻辑** |
| 6 | 中文侧 `english.cool/as-long-as/` 200 | h2 逐字 **`1. as long as  只要…`**；逐字 "**as long as 指的是如果 A 事件發生了，那麼 B 事件就能夠實現，是條件句的一種。**" | ✅ **`as long as` 是独立一篇，主线是「条件成立则结果实现」的肯定逻辑** |
| 7 | 中文侧 `letmeenglish.com/more-conditionals/` 200 | 逐字「**我們可以使用 as long as、provided/providing (that)、on condition (that) 或 only if（而不是只用if），當我們要強調需要存在某條件以便某事可以發生或完成時。**」；同页 `unless (= if not) 除非` 节逐字「**我們可以在條件句中使用 unless 來表示"除非/如果……（沒有）"**」 | ✅ **同一页里两个相邻 h2**——**「同页并列、各有各的语义规定」的第三源印证** |

**→ 关系判定表**：

| 问题 | 答 | 依据 |
|---|---|---|
| `as long as` 与 `if` 是同一小节并列项吗？ | **是**（BC 逐字四词并列；Cambridge 六词并列） | 上表 #2／#4 |
| `as long as` 与 `unless` 是同一小节并列项吗？ | **是**（Cambridge 同页 7 个 h2 之两个；letmeenglish 同页相邻两节） | 上表 #1／#7 |
| 那它们**同义**吗？ | **❌ 不同义**。`unless` ＝ `except if`（**否定条件**，Cambridge 独立页逐字）；`as long as` ＝ `provided that`／`on condition that`（**肯定条件**，Cambridge `As long as and so long as` 页逐字） | 上表 #3／#2 |
| 跨源把它们当**一个**教学点吗？ | **❌ 不。两个独立页 ＋ 两篇独立中文专文 ＋ `unless` 有 2 条 typical errors／`as long as` 页有它自己的 1 条 `Not:`** | 上表 #3／#6 |

**⚠️ L172 之后的迁移风险（必须写进课里）**：L172 的 `oneLineRule` 逐字是「**它和第 48 课那个 if 正好反着**」——**学生已经建立了「if ↔ unless 互为反面」的心智模型**。`as long as` 是**第三个**条件连词，**它既不与 if 反面、也不与 unless 等价**。**必须显式做「三个条件连词的脸」的对照**，否则 L172 教的反面模型会被错误外推成 `unless = as long as`。

### §3.3 3 条带标记新错（逐字依据）

| # | ❌ 错句 | **标记** | ✅ 正解 | **逐字依据** |
|---|---|---|---|---|
| **1** | `I'll remember that film as long as I will live.` | **`will`** | `I'll remember that film as long as I live.` | **Cambridge `As long as and so long as` 页唯一的 `Not:` 逐字："Not: … as long as I will live."** ＋ 同页规定逐字 "**We always use the present simple to refer to the future after as long as:**"。<br>**⚠️ 这是本批三项里唯一一条「上游自带 `Not:` 标记」的错**——**`several` 一条都没有**。**迁移机制**：与 L48 `if`／L172 `unless` 同族（都是「条件小句里不用 will」），但需要重挂到 `as long as` 上。 |
| **2** | `As soon as you practice English every day, you will be able to pass the speaking test.`（**想表达「只要」却写成「一…就…」**） | **`As soon as`** | `As long as you practice English every day, you will be able to pass the speaking test.` | **中文侧 english.cool `as-long-as/` 的「小試身手」练习题逐字**：题② 逐字 `As long as you practice speaking English every day, you will be able to pass the speaking test.`＋**解析逐字「練習說英文是要每天做的，不會馬上就能通過考試，所以會使用 as long as」**；对照题① 解析逐字「**強調到了之後就會馬上傳訊息，有時間上的先後順序，所以會用 as soon as**」。<br>**我方接口**：**L142 已教 `as soon as`**（逐字 oneLineRule「说「一到…就…」用 as soon as」）——**这条错是 L142 ＋ 本课并存才产生的**。 |
| **3** | `We will go as long as it rains.`（**想说「除非下雨」**） | **`as long as`** | `We will go unless it rains.`（= L172 原句） | **Cambridge `Unless` 页 `Typical errors` 逐字 "We don't use unless when we mean if"**（对比例 `Pete will drive if Alex can't.`／**`Not: Pete will drive unless Alex can't.`**）——**反向同理：`as long as` 与 `unless` 是肯定／否定两面，不可互换**（Cambridge `As long as and so long as` 页逐字把它定义为 `provided that`／`on condition that`，**是肯定条件**；`Unless` 页逐字定义为 `except if`，**是否定条件**）。<br>**我方接口**：**L172 的 target 就是 `We will go unless it rains.`**——**这条错直接建立在 L172 的原句上**。 |

**⚠️ 一条不能做成错题的（跨源内部冲突，须登记）**：

> **`so long as` 的语域，Cambridge 自己两页互相矛盾**：
> - `As long as and so long as` 页逐字：**"So long as is a little more informal:"**
> - `Conditionals: other expressions` 页逐字：**"As long as is more common in speaking; so long as and on condition that are more formal and more common in writing:"**
>
> **⇒ 两页对 `so long as` 的正式度判断相反。** **处置建议：本课只教 `as long as`，不教 `so long as` 的语域差别**（在 `variants` 里提一句「也可以说 `so long as`，意思一样」即可，**不设错题、不做对比卡**）。

### §3.4 目标句候选

| 候选 | 句 | 我方零件实算 | 评价 |
|---|---|---|---|
| **首选** | `We will go as long as it rains.` 的**正向版**：`We will go as long as the weather is good.` | `will` 287／`go` 392／`weather` 未单算／`good` 高频 | ⚠️ **与 L172 同场景镜像**（`We will go unless it rains.`）——**这是最大优点（形成干净对照），也是最大风险（两句太像，可能被误读成复习课）**。**建议保留但作为「对照卡」而不是 target** |
| **首选（改）** | `You can go out as long as you finish your homework.` | **中文侧 english.cool 逐字原句**；`can` 179／`go` 392／`out` 76／`finish` 67／`homework` **104** | ✅ **零件全部充足、且中文侧原句**（脚手架 100% 可复用）；**场景自然**（家长对孩子说），**与 L172 的「约爬山」不撞场景** |
| 备选 1 | `You can play in the living room as long as you don't make a mess.` | **Cambridge 逐字原句**；`living room` **0**／`mess` **0** | ⚠️ **两个零词，成本高** |
| 备选 2 | `You can borrow the car so long as you don't drive too fast.` | **Cambridge 逐字原句**（`so long as` 版）；`borrow` **0**／`car` 3／`fast` 14 | ⚠️ `borrow` 为零；且用的是 `so long as` |
| 备选 3 | `You can have a dog as long as you promise to take care of it.` | **Cambridge 词典 `as long as` 条目逐字例句**；`dog` 未算／`promise` 未算／`take care of` 未算 | ⚠️ 三个未算零件 |

**→ 建议 target ＝ `You can go out as long as you finish your homework.`**（中文侧逐字原句、我方零件 100% 有货、场景与 L172 不撞）。

---

## §4 轴 C 专项（`several`）：复核「缓排」是否成立

### §4.1 跨源有没有「`several` 与 `a few` 不同」的明文规则？

**答：✅ 有，而且是本轮新取到的 —— 在 LDOCE 的 THESAURUS 框里，是明文对照规则。**

| # | 源 | 逐字 | 它说的是什么 |
|---|---|---|---|
| 1 | **LDOCE `several` THESAURUS 框**（**本轮新取**） | "**several: more than a few people or things, but not a large number**"<br>"**a number of something: several. A number of sounds more formal than several**"<br>"**quite a few: several – used when emphasizing that there are rather a lot of people, things etc. Quite a few sounds more informal than several and is more commonly used in spoken English**" | ✅ **明文把 `several` 与 `a few`／`quite a few`／`a number of` 放在同一格对照**——**这是「真规则」而不是「感觉」** |
| 2 | **LDOCE `few` 的 GRAMMAR 框**（**本轮新取**） | "**a few: A few means 'a small number, for example two or three people or things'. You use a few before plural nouns:**"<br>"**few: Few means 'not many or hardly any'. It emphasizes how small the number is. In formal English, you use few before plural nouns, without 'a': Few people knew he was ill. In everyday English, people usually say not many instead:**" | ✅ **给出了 `a few` 的下限（"two or three"）**——**与 `several` 的 "more than a few" 形成可教的刻度差** |
| 3 | **Cambridge `Determiners and types of noun`**（**本轮新取**） | "**Both, many, (a) few, the numbers two, three, four, etc., several, these and those are only used with plural nouns:**" | ⚠️ **规则是真的，但它是「同句并列」——`(a) few` 和 `several` 在同一句里、同一条规则下**（**这恰恰是「同句法槽位」的证据**） |
| 4 | Cambridge 词典 `SEVERAL` | "**some; an amount that is not exact but is fewer than many:**" | ✅ 有刻度（`fewer than many`），**但 `some` 也在释义里** |
| 5 | Oxford `several_1` | "**more than two but not very many**" | ✅ **下限写死（`more than two`）** |
| 6 | **BC `Quantifiers` 参考页** | "**Some quantifiers can be used only with count nouns:**"＋名单逐字含 **`several`** | ⚠️ **同句并列（与 `(a) few` 同名单）——又一次「同槽位」**（**且本轮该页三次实取结果不一致，见 §7 项 4**） |

**⇒ 「`several` 与 `a few` 的语义差别是不是真规则？」── 是**（LDOCE 两框明文），**但这条规则的形状是「刻度」而不是「结构」**。

### §4.2 「缓排」复核：成立，且应升级为「判不做独立课」

**先修正批三十二的一处口径**：

> 批三十二写「**`several` 是本批 8 项里唯一「规则页为 0」的 B 档**」「**无规则页（0 条 `Not:`）、无课程位**」。
> **本轮实测修正**：**「无独立页」成立，「规则句为 0」不成立**——Cambridge `Determiners and types of noun` 与 `Determiners used as pronouns` **两页各有真规则句**（§1 轴 C ③）。**但两条规则句都是「同句并列」（规则的主语是一串词、`several` 只是其中之一），且两页都零禁用**。

**再核「缓排」的三条理由**：

| 瑞思的理由 | 本轮复核 | 判定 |
|---|---|---|
| ① **句法与 `a few`／`some` 全同** | ✅ **成立且证据变强**：Cambridge 逐字把 `(a) few` 与 `several` 写在**同一句**（"… `(a) few`, the numbers two, three, four, etc., **`several`**, these and those are only used with plural nouns"）；BC 也把它俩放进**同一份 count-noun 名单** | **成立** |
| ② **只差刻度** | ✅ **成立且证据变强**：**LDOCE 的 THESAURUS 框是明文照刻度**（`a few` → `several` → `quite a few` → `a lot`），**且 `a few` 的下限被写死（"two or three"）** | **成立** |
| ③ **建议缓排** | ⚠️ **应升级**：不是「等一等再做」，是「**不该单独成课**」——见下 | **修正** |

**为什么「缓排」应升级为「判不做独立课」—— 三条硬理由**：

1. **红线触发（§5）**：`several` 是**同一意思（数量不定）的另一种说法**。**上游没有为它准备任何一条 `❌`**：Cambridge `Word choice: few or a few?`（**专门讲 `few` vs `a few` 的纠错页，本轮实取，`Not:` ＝ 0 但正文两条「Unfortunately, I have a few… / few…」对照**）**`several` ＝ 0 命中**；`Determiners: typical errors`（**本轮实取，`Not:` 3 条**）**`several` ＝ 0 命中**。
2. **我方「3 标记」硬约束不可满足**：**若单开一课，3 条带标记新错将全部是「换一个词」**——`several` / `a few` / `some` 三选一的句子**在语法上都是对的**，**标不出错**。**这是与 `so that`／`as long as` 的根本差别**（后两者各能标出 3 条）。
3. **跨源课程位为零**（Cambridge 语法页 302 回总入口；BC 无专课；Murphy 按既有记录无独立单元；中文侧 873 slug 全索引 `several` ＝ 0、`english.cool/several/` 404、`letmeenglish` sitemap 483 slug 无 `several`）。

### §4.3 处置建议：从「缓排 1 课」改为「L114 补充刻度卡」

**不建议开课，建议做 3 张卡挂到 L114（`只剩几个了 | 还有几个 vs 几乎没了 · a 在不在，意思反一半`）之下**：

| 卡 | 内容 | 逐字依据 |
|---|---|---|
| 刻度 1 | `a few` ＝ **两三个**（下限写死） | LDOCE `few` GRAMMAR 框逐字 "**A few means 'a small number, for example two or three people or things'.**" |
| 刻度 2 | `several` ＝ **比 a few 多、比 a lot 少** | LDOCE `several` 主释义逐字 "**a number of people or things that is more than a few, but not a lot**"；Oxford 逐字 "**more than two but not very many**" |
| 刻度 3 | `quite a few` ＝ **口语、偏多** | LDOCE THESAURUS 逐字 "**Quite a few sounds more informal than several and is more commonly used in spoken English**" |

**⚠️ 若产品侧仍决定做成一课，则必须写明**：**该课的性质是「量词刻度收口」（复习型），不是「新结构课」**；**且课内不得声明「新错」**（因为标不出）。**诚实标注：这是一课「造词课 ＋ 复习课」，跨源不给课程位。**

---

## §5 「同义换词 vs 新结构」甄别（核心红线）

**判定规则**：**若只是同一意思的另一种说法 ⇒ 档位必须下调甚至判不做。**

| 候选 | **是教新结构，还是同一意思的另一种说法？** | 逐字依据 | 档位影响 |
|---|---|---|---|
| **`so that`** | ✅ **新结构** | ① 后面跟的是**一个完整小句**（"We often use them with modal verbs (can, would, will, etc.)"）——**L173 的 `in order to` 后面是动词原形**；② **上游归类不同**：`so that` 在 **conjunction** 列的组里，`in order to` 有**自己独立的一页**且规定为 `with an infinitive form of a verb`；③ **`so that` 有一条 `in order to` 没有的独有规定**："**We don't usually put the subordinating clause first.**"；④ **否定做法不同**（小句内否定 vs `in order not to`）；⑤ **语域不同**（`so that` 口语常用／`in order to` "more common in writing than in speaking"） | **不降档**（维持 **B**） |
| **`as long as`** | ✅ **新结构** | ① **它有两个意思**，跨源两处独立印证二分：Cambridge **两个 h2**（持续 vs 条件）／LDOCE **两个义项**（"only if" vs "will continue to happen … at the same time"）；② **有自己独立的 `Not:`**（"Not: … as long as I will live."）——**同义换词不会有专属禁用**；③ **与 `unless` 是肯定／否定两面**（Cambridge 两页逐字：`except if` vs `provided that`／`on condition that`），**不是同义**；④ 上游给它**独立页 ＋ 独立中文专文**，而 `unless` 有自己的**独立页 ＋ 2 条 typical errors**——**两张页并存是「两个教学点」的形式证据** | **不降档**（维持 **B**） |
| **`several`** | ❌ **同一意思的另一种说法（刻度）** | ① **句法槽位与 `a few` 全同**——Cambridge 逐字 **同句并列**（"… `(a) few`, …, **`several`**, …  are only used with plural nouns"）；② **唯一增量是刻度**——LDOCE THESAURUS 框明文照刻度（`a few` → `several` → `quite a few`）；③ **跨源零禁用专属它**（`Word choice: few or a few?` ＝ 0／`Determiners: typical errors` ＝ 0）；④ **中文侧二度为零**（873 slug 全索引 0／`english.cool/several/` 404／letmeenglish sitemap 483 slug 无） | **⬇️ 降档：B → B−**；**并判「不做独立课」** |

**§5 与已教清单的接口复核**（本批三项只有 `so that` 需要核这条）：

| 已教 | 与本批的关系 | 结论 |
|---|---|---|
| **`in order to`（L173）** | **同一中文词（「为了」）＋ 不同接法（原形 vs 小句）** | ✅ **切分干净**（§2.2 六维表）；**但必须显式做对照，否则会产生 §2.3 的第 3 条错** |
| **`unless`（L172）** | **同页（Cambridge `Conditionals: other expressions`）但各有独立 h2／独立页** | ✅ **不同义**（`except if` vs `provided that`）；**但必须显式做对照，否则会产生 §3.3 的第 3 条错** |
| **`as soon as`（L142）** | **同属「as … as」形状家族，且中文侧 `as-long-as` 专文一篇同时讲 `as long as`／`as soon as`／`as far as`** | ✅ **不同义**（时间先后 vs 条件）；**中文侧有现成练习（§3.3 #2）** |
| **`if`（L48）** | **同属条件句家族；BC 逐字把 `as long as`／`unless`／`as soon as`／`in case` 写成「代替 `if`」的一组** | ⚠️ **`as long as` 后可用 `will`，`if`／`unless` 后不可**——**这是三词之间最危险的一处误推广；Cambridge `as long as` 页的 `Not:` 是「不用 will」，与 `if`／`unless` 同**。**⚠️ 注意：`so that` 后可以用 `will`（Cambridge 逐字），与 `if`／`unless`／`as long as` 相反——这是必须切开的第四条** |
| **`a few`／`few`（L114）／`some`／`many`／`much`（L30）** | **`several` 是同一刻度轴的第三格** | ❌ **`several` 判不做独立课**（§4） |

---

## §6 推荐

### §6.1 推荐顺序（本批 2 课）

| 顺位 | 候选 | 档位 | 课量 | 为什么是它 |
|---|---|---|---|---|
| **1** | **`so that`** | **B** | **1 课** | **最高优先，四条**：① **我方目的义真零**（GL 1 那唯一 1 处是 L102 的 `So that was last night!` 结果义指示用法，**本轮复算**）；② **与 L173 切分干净**（六维对照表，§2.2）——**并发新教 `in order to` 不但不撞车，反而给本课提供了 3 条真错中的 2 条**（§2.3 #1／#3）；③ **跨源五层证据**（Cambridge 易混独立页 ＋ 目的连词表 ＋ `So` 页小节 ＋ **LDOCE 双义项独立条目** ＋ **中文侧 4 篇独立专文**）；④ **脚手架现成**：`I got up early … catch the bus` 句干与 L173 完全相同（零件 `could` 46／`early` 87／`catch` 3／`bus` 18 全有货） |
| **2** | **`as long as`** | **B** | **1 课** | **次高，四条**：① **我方真零**（GL 0／HC 0／季 0，**本轮三项实算**）；② **跨源三个落点 ＋ 独立条目**（Cambridge 独立页 2 h2 ＋ `Conditionals: other expressions` 页独立 h2 ＋ **本轮新发现的 `Long` 页内含节** ＋ LDOCE 独立条目双义项 ＋ 中文侧独立专文）；③ **本批唯一有上游自带 `Not:` 的候选**（"Not: … as long as I will live."）；④ **与 L172 `unless` 的切分有硬依据**（`except if` vs `provided that`／`on condition that`），**且并发新教 `unless` 反而提供了 §3.3 #3 这条真错** |
| — | **`several`** | **B−**（**修正**） | **0 课** | ❌ **判不做独立课**（§4）：红线触发 ＋ 跨源零禁用 ＋ 我方 3 标记约束不可满足。**改为 L114 的 3 张刻度卡** |

### §6.2 为什么不能更多

1. **三轴里只有两项够 1 课**——`so that` 与 `as long as` 各满足「真零 ＋ 有规则页／独立条目 ＋ 有 ≥3 条带标记新错 ＋ 零件齐备」四项；**`several` 在第 3 项（带标记新错）上直接归零**（**上游没有给它任何一条 `❌`**）。
2. **合计 2 课，恰好是一批的量**——本批不需要拆成两批。
3. **`so that` 与 `as long as` 不宜再各拆 2 课**：
   - `so that` 的规则增量**实际只有 3 条**（+小句带情态／`that` 可省／≠`in order to` 的接法）＋ 1 条易混（≠结果义 `so`）——**跨源没有给第二课的位置**（`So that or in order that?` 页正文 4 段、`Not:` 0）。
   - `as long as` 的规则增量**是 2 个意思 ＋ 1 条 `Not:`**——**Cambridge 独立页只有 2 个 h2、正文 6 行**，**撑 1 课，撑不住 2 课**。
4. **`several` 若强行开课，会挤掉一个真 B 档的位置**（B 档清单里 `even if`／`as if` 都还在排队）——**而它的性质是复习型的**。

---

## §7 未核实项（诚实登记）

| # | 项 | 本轮状态 | 影响 |
|---|---|---|---|
| **1** | **Murphy 双册 TOC 完全未取到** | **❌ 本机原件已不存在**：`/private/tmp/murphy_int.txt`／`murphy_ess.txt`／`murphy_int_norm.txt`／`murphy_ess_norm.txt`／`murphy_toc_clean.txt`（`ls` ＋ `find` 双查）；`cambridge.org` **403／503**；`assets.cambridge.org` **000**；`archive.org` **000**；`z-lib.io`／`libgen.is`／`scribd.com`／`dokumen.pub`／`vdoc.pub` **全部 000** | **中**——**`as long as` 的 U115 三词共用（`115unlessaslongasprovided`）与 `so that` 的 U64 三词格（`64 to…, for… and so that…`）两条课程位证据均为沿用既有批次记录，本轮未核**。**已降级**：两轴的判定本轮各补上了独立于 Murphy 的证据（轴 A：Cambridge 目的连词表 ＋ LDOCE 条目；轴 B：Cambridge 三个落点 ＋ BC 68 课全目复点 ＋ LDOCE 条目） |
| **2** | **Cambridge 词典 slug 的假页（已知坑复现两例）** | ✅ **本轮复现**：`/dictionary/english/so-that` → **200，title 逐字 `WORK \| English meaning - Cambridge Dictionary`**（返回无关词条）；`/dictionary/english/few`／`some` 正常但 `/dictionary/english/a-few` → **200，title 逐字 `A GOOD FEW`** | **低**——**已在 §1 标注，未据此下任何判断** |
| **3** | **⚠️ 新方法学坑：Cambridge 词典的 `cdo_elvl` 不可单独采信** | ✅ **本轮实测**：`as-long-as` **5 次取值抖动为 C1／B1／B2／A1／A2**；`in-order-to` **4 次抖动为 C1／A2／B2／B1**；**对照有 `epp-xref` badge 的词条 3/3 稳定**（`several` = **A2**／`unless` = **B1**／`cat` = **A1**／`very` = **A1**）。**⇒ 引用规则：必须 `epp-xref` span 存在，`cdo_elvl` 才可用；只有 `cdo_elvl` 的一律判未标位** | **中**——**本批 `so that`／`as long as`／`in order to` 三项的 CEFR 一律记为「无可靠标位」。⚠️ 建议后续所有批次统一改用这条口径，并复核历史批次里是否误用过 `cdo_elvl` 单值**（**本轮未回溯历史批次，见项 8**） |
| **4** | **BC `Quantifiers` 参考页的 count-noun 名单** | **⚠️ 本轮 WebFetch 三次结果不一致**：一次返回逐字 "**Some quantifiers can be used only with count nouns:**"＋名单含 **`several`**；一次说页内无 `several`；一次（`determiners-quantifiers` 页）说名单不在该页。**BC 直连全部 000／403（本轮实测 5 次），无法用直连 HTML 裁定** | **低**——**批三十二「`several` 在 BC count-noun 名单里」的记录本轮未复核成立**；**但 §4 的判定不依赖它**（`several` 的判定由 LDOCE 明文 ＋ Cambridge 同句并列 ＋ 零禁用三条支撑） |
| **5** | **我方 `several` 的 HC 侧未复算** | 批三十二记 HC 0；**本轮只算了 `grammarLessons.ts`／`huntCases.ts`／`grammarSeasons.ts` 三个文件，HC 案件库的 `several` 计数未独立复算** | **低**——不影响判档（GL 真零已复算） |
| **6** | **`several` 目标句候选的零件未算** | `dog`／`promise`／`take care of`／`living room`／`mess`／`weather` 等词的词频未算；**只算了 `so that`／`as long as` 首选句的零件** | **低**——**已建议判不做独立课，无需继续算** |
| **7** | **中文侧 `letmeenglish` 本批三项全不收** | ✅ **已核**：`letmeenglish.com/so-that/`／`several/`／`as-long-as/` **三个 slug 全部 404**；**post-sitemap 483 条 slug 本轮全索引，无这三项**；其 purpose 页 `to-for-purpose/` **200 但 `so that` ＝ 0／`in order to` ＝ 0**（**该站 purpose 页教的是 `to` vs `for`**） | **已闭合**——登记为「中文侧第二源对本批零覆盖」 |
| **8** | **历史批次的 `cdo_elvl` 口径未回溯** | 本轮发现 `cdo_elvl` 抖动（项 3），**但未逐批复核历史报告里是否引用过无 badge 词条的 `cdo_elvl` 单值** | **中**——**建议由数析做一次全库回溯**（本报告只登记不追溯） |
| **9** | **english.cool 的 `as-long-as` 专文含 `as far as` 与 `as soon as`** | ✅ 已读全文；**`as far as` 一节（h2#3 含 5 个 h3 子用法）本轮未做档位评估** | **低**——**但它提示 `as far as` 是同一形状家族的第三个成员，可能是一支未评估的候选轴，建议登记进下一次普查** |
| **10** | **Cambridge `so that` 的 CEFR／English Profile 落点** | `englishprofile.org` **301／404**（本轮实测）；`so-that` 词典 slug 假页；`in order to` 条目 `cdo_elvl` 不可用 | **低**——**记「无可靠标位」，未做进一步追索** |

---

## §8 本批净产出

| # | 产出 | 内容 |
|---|---|---|
| 1 | **档位复核** | `so that` **B（维持）**／`as long as` **B（维持）**／`several` **B−（修正下调）** |
| 2 | **一处口径修正** | **`several` 的「规则页为 0」不成立**——Cambridge `Determiners and types of noun` 与 `Determiners used as pronouns` **各有真规则句**（但两句都是「同句并列」、两页都零禁用） |
| 3 | **一处结论升级** | **瑞思的「缓排」应升级为「判不做独立课」**——红线触发 ＋ 零禁用 ＋ 3 标记约束不可满足；处置从「1 课」改为「L114 的 3 张刻度卡」 |
| 4 | **一处切分判定** | **`so that` 与 `in order to` 切分干净**（六维对照，§2.2）——**并发新教 `in order to` 不撞车，反而是本课 3 条真错中 2 条的来源** |
| 5 | **一处关系判定** | **`as long as` 与 `unless` 是「同页并列、不同义」**（`provided that`／`on condition that` vs `except if`）——并发新教 `unless` 是本课第 3 条真错的来源 |
| 6 | **9 条带标记新错的逐字依据**（轴 A 3 条／轴 B 3 条／轴 C 0 条）＋ **4 条「不能做成错题」的护栏**（`so that` + `will` 合法／`so that` 语序只是不常用／`so long as` 语域跨源冲突／`as long as` 后不用 `will` 与 `so that` 后可用 `will` 相反） |
| 7 | **一条新方法学坑** | **Cambridge 词典 `cdo_elvl` 会抖动，必须与 `epp-xref` span 同时存在才可引用**（附 5 次／4 次抖动实测记录） |
| 8 | **一支可能的新候选轴** | **`as far as`**（英文.cool `as-long-as` 专文里有独立 h2 ＋ 5 个 h3 子用法）——建议登记进下一次普查 |
| 9 | **两条候选目标句** | 轴 A：`I got up early so that I could catch the bus.`（与 L173 同句干）／轴 B：`You can go out as long as you finish your homework.`（中文侧逐字原句、零件全有货） |

---

> 本报告由产品战略团队 AI 协作生成（竞析 · 跨源分析），**所有逐字引用均标注 URL 或书名＋Unit 并可在本轮复跑**；**未能核实的项已在 §7 逐条登记，请勿把 §7 的项当作已验证结论使用**。重要决策请由产品负责人审定。
