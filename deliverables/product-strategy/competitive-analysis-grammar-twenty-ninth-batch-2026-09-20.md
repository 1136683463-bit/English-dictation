# 竞品/跨源分析 · 语法线「小美的一天」第二十九批

**日期**：2026-09-20 ｜ **分析**：竞析（竞品/跨源分析师）｜ **上游**：批二十八路线图 §6 携带项（轴 A `none`／`no one`／`nobody` 首选）＋ 主理人本批三条轴命题
**口径（沿用前批，未改）**：**A 档**＝跨源有**课程位**（教材独立单元/课时）＋我方有缺口；**B 档**＝跨源**有规则页但无课程位**，或须造词但成本可控；**B−**＝介于 B 与 C 之间；**C 档**＝只有零散例句；**D 档**＝跨源基本不收。
**关键概念**：**课程位** ＝ 上游当作独立教学单元（专门一课/单元）；**规则页** ＝ 只有参考性页面但不成课。
**本批基准**：**156 课（L1–L156）、165 案、28 季**（本轮实测，见 §0.1）。

> **研究声明**：所有引文均标注来源（URL 或书名＋Unit）。**我查证的**与**我记得/未核实的**严格分列（§8）。凡未亲自取到的页面一律登记「未核实」，不做推断。

---

## §0 本轮本地实证（先立口径，后文全引用它）

### 0.1 我方缺口（本轮实测，逐词计数）

**方法**：`src/data/grammarLessons.ts`（**29584 行**，本轮实测）按 `\n    number: N,` 切块（**156 块，编号 1–156 无缺口，max=156**）；块内做**严格词边界**计数（`(?<![A-Za-z])词(?![A-Za-z])`，沿用批二十七的修正口径，排除子串误报）；对照 `src/data/huntCases.ts`（**8973 行／165 案**，实测）、`src/data/grammarSeasons.ts`（**28 季**，`grep -c 'id: "season'`＝28）。

| 候选词 | GL（课内） | HC（案内） | 判定 |
|---|---|---|---|
| `none` | **0** | **0** | **真零**（大小写两轮均 0） |
| `nobody` | **0** | **0** | **真零** |
| `no one` | **0** | **0** | **真零**（`No one` 亦 0） |
| `nothing` | **71** | **5** | **已教**（L84 正课 `There is nothing in the box.`） |
| `way` | **1** | **1** | **真零（教学位）**：课内唯一命中在 **L140 对白** `{ who: "npc", en: "Say it another way?", zh: "妈妈看你写在便签上的句子。" }`；案内唯一命中在 **`hunt-photo-album`（相册里的一页）** 的 `"On", "the", "way", "home,"` —— **两处都不是教学位**（详见 §3.3） |
| `ways`（复数） | **0** | **0** | **真零** |
| `of` | **128** | **24** | 存在但**全是介词本义**（`one of`／`out of`／`because of` 类），**无 `× of the` 量词层教学位** |
| `all of` / `All of` | **4**（2 组） | **0** | **非教学位**：L151 的 `// R9` 替换题干扰项 `All of my books are good.` ＋ L151 对比卡 ❌`All of books are good.` —— **都不是要教 `all of`，而是拿它当反例/干扰项打掉**（见 §4.2，这里有一处口径风险） |
| `both of` | **0** | **0** | **真零** |
| `none of` | **0** | **0** | **真零** |

### 0.2 我方已教完的「都」家族（轴 A 的直接上游）

| 课 | 标题 | grammarLabel | 目标句 |
|---|---|---|---|
| L148 | 两个都好 | 两个都 · both 站最前面 | `Both books are good.` |
| L149 | 两本都不好 | 两个都不 · neither 上，both 让位 | `Neither book is good.` |
| L150 | 两个排一行（收口） | 收口 · 零新知（两个的脸） | `Both books are good.` |
| L151 | 全都好 | 三个以上都 · all 也站最前面 | `All the books are good.` |
| L152 | 每个都到了 | 差在哪儿 · 好多个一起／一个一个来 | `Every student is here.` |

> **⇒ 肯定侧 `both`／`all`／`every` 三张脸已经全部交付；否定侧（三个以上的「一个都不」）是真空白。** 轴 A 的命题「肯定侧已教完，否定侧空白」**本轮复核成立**。

### 0.3 「自带不／不再请 not」这条规矩的**已教次数**（轴 A 的减分项，本轮复算）

**方法**：对每课块内扫四条中文标记（`自带「不」`／`不再请 not`／`两个「不」`／`带着「不」`／`已经带着`），逐课计数。

| 课 | 命中标记 | 该课一句话规则（逐字） |
|---|---|---|
| L83 | `自带「不」`×1 | 说不清或者先不说是什么，用 something；问句和「不 / 没」里换成 anything——第 30 课 some/any 的老规矩。 |
| **L84** | **`自带「不」`×9 ＋ `不再请 not`×4 ＋ `两个「不」`×5** | **说「什么也没有」用 nothing——它自带「不」，句子里不再请 not；someone 是「有人」，一个人配 is。** |
| L86 | `自带「不」`×4 | 一句问主人（Whose…?）、一句说位置（next to…）——把身边的东西说清楚，这一季的本事全在这一问一答里。 |
| **L149** | **`两个「不」`×2 ＋ `带着「不」`×1 ＋ `已经带着`×1** | **同一个「两个」，两张脸：没有「不」用 both（Both books are good）；有「不」的时候，最前面换 neither（Neither book is good）。** |
| **L150** | **`两个「不」`×1 ＋ `带着「不」`×1 ＋ `已经带着`×1** | 收口课，同款复现。 |

> **⇒ 这条规矩在库内的真实状态**：**L84 立规矩（`nothing` 自带「不」＋不再请 not）→ L149 第 2 次（`neither` 自带「不」）→ L150 第 3 次（收口复现）**。
> **轴上还有一条同族规矩**：**L146 `too → either`（「有『不』就换词」的第 1 次）**，L149 的 `oneLineRule` 自身逐字承认「**今天是第三次，换的是最前面那个词**」。
> **⇒ 若 `none` 单开一课把「`none` 不再请 not」当第 1 增量，那它就是这条规矩的**第 4–6 次应用**（口径不同则计数不同，详见 §2.2 与 §5）。这是本批**最重要的减分项**，也是我上一轮把它压成「1 课」而非「2 课」的核心原因。

---

## §1 逐候选档位判定

### 1.1 轴 A 候选

| 候选 | ① 跨源逐字证据 | ② 课程位 | ③ 规则页 | ④ 档位 | ⑤ 理由 |
|---|---|---|---|---|---|
| **`none`** | **Cambridge 独立页 `No, none and none of`**（面包屑本轮实取逐字 `Grammar > Nouns, pronouns and determiners > Quantifiers > No, none and none of`）。**拆句逐字**（本轮新核）：`No and none of are determiners. None is a pronoun. No, none and none of indicate negation.`；`No` 节 "**We use no directly before nouns:**"；`None` 节 "**None is the pronoun form of no. None means 'not one' or 'not any'.**"；单复数 "**When none is the subject, the verb is either singular or plural depending on what it is referring to.**"（例 `None ever comes.`／`None ever come.`）；**Warning** "**We don't use none where we mean no one or nobody.**"（❌`… and luckily none was injured.` 正解 `… and luckily no one was injured.`）；`None of` 小节 **5 条**："**We use none with of before the, demonstratives (this, that), possessives (my, your) or pronouns:**"／"**We don't use none of when there is already a negative word (not, n't) in the clause:**"（❌`She doesn't remember none of us.` 正解 `She doesn't remember any of us.`）／"**When we are referring to two things or people, we use neither of rather than none of:**"（❌`None of us said anything.` 正解 `Neither of us said anything.`）／"**In formal styles, we use none of with a singular verb when it is the subject.**"／"**However, in informal speaking, people often use plural verbs:**"；**Typical error** "**We don't use none directly before nouns. We use no + noun or none of + noun**"（❌`None children in my group …` 正解 `No children in my group caused any trouble.`）。**CEFR：Cambridge 词典 `none` ＝ `B1`（本轮实测，pronoun 单条）／ Oxford `none` ＝ `a2`（`fkcefr="a2"`、`ox3000="y"`，定义逐字 `not one of a group of people or things; not any`）**。**中文侧**：`english.cool/none/` **404**（本轮实测）；`english.cool/quantifiers/` **200**，含独立小节逐字 "**none 為 not one 的合併，表示「一個都不…」**"／"**none 後面若需要接名詞，就要使用 none of**"／"**none 會強調在某個範圍內都不…，no 則沒有限定範圍～**"；**本轮新增 200 页 `english.cool/indefinite-pronouns/`**，逐字 "**none 表示「一個都沒有」**"／"**它的意思是「一個都沒有、半個都不剩」，語氣比 not any 更強烈、更乾脆**"（例 `I opened the cookie jar, but none were left.`）。**Murphy 双册归一化 TOC 逐字**：初级 U77 `77not+anynonone`（四词一格）／初级 U81 `81allmostsomeanyno/none`（五词一格）／中级 U86 `86no/none/anynothing/nobodyetc.`（两行，第一行 `no/none/any`）／中级 U88 `88all/allofmost/mostofno/noneofetc.`（四词一格） | **✅ 有，4 处，但全部共用** | **✅ 有且厚**（独立页＋3 条 Warning／Typical error／5 条 `None of` 规则＋中文侧 2 页各 1 节） | **B＋** | **复核成立，与批二十七／二十八一致**。**规则页厚度本轮再增**：中文侧从「1 页 1 节」变「2 页各 1 节」（`quantifiers` ＋ `indefinite-pronouns`），**且新增一条「语气比 not any 更强」的中文侧独立表述**。**不升 A 的理由仍是课程位四条全部共用**（四词／五词／两行／四词） |
| **`no one`** | **Cambridge 独立页 `No one, nobody, nothing, nowhere`**（面包屑本轮实取逐字 `Grammar > Nouns, pronouns and determiners > Pronouns > No one, nobody, nothing, nowhere`）。**逐字** "**No one, nobody, nothing and nowhere are indefinite pronouns.**"／"**We use no one, nobody, nothing and nowhere to refer to an absence of people, things or places. We use them with a singular verb:**"；**`No one or nobody?` 节** "**No one and nobody mean the same. Nobody is a little less formal than no one. We use no one more than nobody in writing:**"；**复数回指逐字**（本轮新核）"**We often use the plural pronoun they to refer back to (singular) no one or nobody when we do not know if the person is male or female:**"（例 `No one remembers the titles of the books they've read.`）；拼写 "**We write no one as two separate words or with a hyphen: no one or no-one but not noone.**"；禁用 "**We don't use nobody, no one, nothing, nowhere after no, not, never or other words which have a negative meaning (hardly, seldom).**"（❌`Not: I can't do nothing.`）；强度 "**Nobody, no one, nothing, nowhere are stronger and more definite than not … anybody/anyone/anything/anywhere**"。**CEFR：Cambridge `no one` ＝ `A2`／Oxford `no one` ＝ `a1`（`fkcefr="a1"`、`fkox3000="y"`，定义逐字 `not anyone; no person`，例 `No one was at home.`）**。**中文侧**：`english.cool/no-one/` **404**（本轮实测）。**Murphy**：初级 U78 `78not+anybody/anyone/anythingnobody/no one/nothing`（六词一格）／中级 U86 第二行 `nothing/nobodyetc.` | **⚠️ 有但均无独立格**（六词一格／一行） | **✅ 有**（独立页，但**与 `nobody`／`nothing`／`nowhere` 四词同页**） | **B** | **复核成立**。**新增减分证据**：BC 参考页 `indefinite-pronouns` 里**连 `none` 都收**（7 条规则），**说明上游把这类词当「一类」处理，不是逐个成课**；且该页明文 "**We do not use another negative in a clause with nobody, no one or nothing**" —— **对我方是 L84 已教规矩的复述** |
| **`nobody`** | 同 `no one`（共页）；**对比逐字** "**Nobody is a little less formal than no one.**"；**CEFR：Cambridge `nobody` ＝ `A2`（pronoun＋noun 两条）／Oxford `nobody` ＝ `a1`（`fkcefr="a1"`，定义逐字 `not anyone; no person`，例 `Nobody knew what to say.`）**；**Oxford `no one` 条逐字** "**No one is much more common than nobody in written English.**"／**Oxford `nobody` 条逐字** "**Nobody is more common than no one in spoken English.**" | **⚠️ 同上**（初级 U78 ＋ 中级 U86 第二行） | **✅ 同上** | **B** | **复核成立。** 「书面/口语分工」两源互相印证（Cambridge：写作多用 `no one`；Oxford：口语多用 `nobody`、书面多用 `no one`）——**这是真规则，但它是「同一意思的两种说法」的语域差异**（§5 判「半新」） |
| **`nothing`（对照，已教）** | Cambridge 同页（与 `no one` 共页）；**CEFR：Cambridge `nothing` ＝ `A2`（pronoun 主条）＋ `B2`×3** | 同上 | ✅ | **已教（L84）** | **两轴论本轮复核成立**：Cambridge 把 `none` 放在 `Quantifiers` 页、把 `nothing` 放在 `Pronouns` 页（**两页面包屑本轮各自实取，逐字见上两行**）；Murphy 中级 U86 第一行 `no/none/any` vs 第二行 `nothing/nobody etc.` **两行分列** ⇒ **`none` 是「范围里的零」，`nothing` 是「东西的零」，两条不同轴**（§2.3 专项复核） |

### 1.2 轴 B 候选（`way`）

| 候选 | ① 跨源逐字证据 | ② 课程位 | ③ 规则页 | ④ 档位 | ⑤ 理由 |
|---|---|---|---|---|---|
| **`way`（名词本义：路/方法）** | **Cambridge 独立页 `Way`**（面包屑本轮实取逐字 `Grammar > Nouns, pronouns and determiners > Using nouns > Way`）。**逐字** "**Way is a noun and adverb.**"；`Way as a noun` "**As a noun the most common meanings of way are 'method or style', 'route, direction, road' and 'distance':**"（例 `I make cheese sauce a different way from my mother.`／`The hospital is on Sandford Road. Do you know the way?`／`Which way shall we go?`／`It's a long way from here on foot. You can take a bus.`）；**方法义搭配逐字** "**We can use a to-infinitive or an -ing form after way when it means 'method':**"（`There's an easier way to do that.` 或 `There's an easier way of doing that.`）；**副词义逐字** "**We can use way informally as a degree adverb to mean 'a lot':**"（`The project is way behind schedule.`／`She had way more chances than me.`）；**页尾自认不全** 逐字 "**You will find other meanings of way and expressions with way in a good learner's dictionary.**"。**CEFR：Cambridge 词典 `way` noun 分义 A2／B1／B2（本轮实测：`a route, direction, or path:`＝A2；`used to talk about the direction in which something is facing:`＝B1；`happening in the opposite way:`＝B2；`an action that can produce the result you want; a method:`＝A2；`a distance or a period of time:`＝B1）／ Oxford `way` ＝ `a1`（首义 `method/style` 逐字 `cefr="a1"`、`ox3000="y"`，定义 `a method, style or manner of doing something`；另有 `a2`×4、`b1`×2）**。**BC A1-A2 18 课全目逐字复点，零 `way` 专课**（本轮实取 A1-A2 课目：Adjectives and prepositions／Adjectives ending in '-ed' and '-ing'／Articles: 'a','an','the'／Articles: 'the' or no article／Comparative adjectives／Infinitive of purpose／Nouns: countable and uncountable／Past continuous and past simple／Possessive 's／Prepositions of place／Prepositions of time／Present simple／Present simple: 'have got'／Present simple: 'to be'／Quantifiers: 'few','a few','little' and 'a bit of'／Question forms／Using 'there is' and 'there are'／Verbs followed by '-ing' or infinitive）。**Murphy 双册归一化 TOC：`way` 逐字命中 0**（本轮 Python 全文本复算；初级 13966 字／中级 11016 字两文件均 0） | **❌ 无课程位**（Cambridge 语法页是「词条式页面」，不是教学单元；BC 68 课全目零专课；Murphy 双册 0 命中） | **✅ 有**（Cambridge 独立页 3 节） | **B−（本义）／C（各短语分档见下）** | **`way` 本义有独立页但页面自认不全**（"You will find other meanings … in a good learner's dictionary."），**且上游无任何课程位**；**CEFR 分裂**（Cambridge A2/B1/B2 vs Oxford a1）；**它更像「词典词条」而不是「语法单元」** |
| **`the way to`（去…的路）** | **Cambridge `Way` 页逐字**（同页）：`Do you know the way?`／`Which way shall we go?` —— **注意：本轮在该页逐字检索，未取到 `the way to + 地点` 的独立规则句**；`the way to` 的规则出现在 **`In the way or on the way?` 页**（见下行）。**Oxford `way` 条**：`the way to` 命中 8 次（多为例句内） | **❌ 无独立格** | **⚠️ 仅作为例句成分** | **C** | **`the way to` 在 Cambridge 语法页里没有独立小节**；规则只藏在 `on the way to` 的说法里 |
| **`on the way`（在路上）** | **Cambridge 独立页 `In the way or on the way?`**（面包屑本轮实取逐字 `Grammar > Easily confused words > In the way or on the way?`）。**逐字** "**On the way**" 节："**We use on the way or on my/his/our way (to) when we talk about the route, direction or path to somewhere:**"（例 `We could leave early and have breakfast on the way.`／`I was on my way to Peter's house when I met him in the street.`）；延长义逐字 "**We can use on the way to (plus a noun or an -ing form of a verb) to mean 'close to' doing or completing something:**"（`Brazil is on the way to becoming one of the world's strongest economies.`）。**另：Cambridge `Way` 页内也有同名小节** "**In the way, on the way**"，逐字 "**We use on the way to mean in the middle of the journey:**"（`I'm on my way. I'll be there in 20 minutes or so.`／`They're on their way.`） | **❌ 无课程位** | **✅ 有，且是「独立对比页」**（`In the way or on the way?` 在 `Easily confused words` 类目下——**与批二十八 `for` 拿到 A− 的「对比页」形态同款**） | **B−** | **这是轴 B 里跨源形态最好的一个**：**有独立对比页（`Easily confused words` 类目）＋两处独立小节**。**但页内 3 条规则全是「`in` vs `on` 的辨析」，不是新句型**；**且它要配「问路」场景才有意义**（见 §3.2） |
| **`by the way`（顺便说一下）** | **Cambridge：`by-the-way` slug 本轮实测 302 → 重定向到语法总入口**（`final=https://dictionary.cambridge.org/grammar/british-grammar/`，本轮实测） ⇒ **无独立页**。**Oxford `by the way` 条逐字**："**(abbreviation BTW) (also by the by/bye) (informal) used to introduce a comment or question that is not directly related to what you have been talking about**"（例 `By the way, I found that book you were looking for.`）—— **牛津把它标 `(informal)`，且是 idiom 条** | **❌ 无课程位** | **❌ 无**（只有词典 idiom 条） | **C** | **它是**语用插入语**，不是句子结构；**中文对应「对了」「顺便说」是口语习惯**，对零基础不是必需 |
| **`in this way`（这样）** | **Cambridge：`in-this-way` slug 本轮实测 302 → 重定向语法总入口** ⇒ **无独立页**；**`the-way-that` slug 同样 302**（本轮实测）⇒ **`the way (that) …` 结构在 Cambridge 语法页也无独立小节** | **❌ 无课程位** | **❌ 无** | **C** | **`in this way` 是书面连接语**（= thus），**与零基础口语场景相性差**；`the way (that)` 是中级结构（本批不做，登记 §8） |
| **`way` 的短语总量（参考）** | **Oxford `way` 词条 idiom 条数量本轮实测：`way_idmg_*`＋`way_idm_*` 共 130+ 个条目**（含 `all the way`／`find your way (to…)`／`lose your way`／`get in the way of`／`by a long way`／`no way` 等）；**其中带 CEFR 标位者极少**（`fkcefr` 出现在主干义项与少数 idiom 上） | — | — | **不单独成档** | **⇒ 上游把 `way` 当「一个词典条目＋大量短语」，即「词汇量问题」而不是「语法单元问题」**——**这是轴 B 判低档的结构性原因** |

### 1.3 轴 C 候选（`of` 层）

| 候选 | ① 跨源逐字证据 | ② 课程位 | ③ 规则页 | ④ 档位 | ⑤ 理由 |
|---|---|---|---|---|---|
| **`all of`** | **Cambridge `All` 页**（面包屑本轮实取逐字 `Grammar > Nouns, pronouns and determiners > Quantifiers > All`），**10 小节**逐字：`All as a determiner`／`All with no article`／`All of`／`All without of`／`All with personal pronouns`／`All as a pronoun`／`All as an adverb`／`All meaning 'completely' or 'extremely'`／`All: not all`／`All: after all`。**`All of` 节逐字**："**We use all of before personal pronouns (us, them), demonstrative pronouns (this, that, these, those) and relative pronouns (whom, which). The personal pronoun is in the object form:**"（`I need to speak to all of you for a few minutes.`／`He brought gifts for all of us.`）；**可选性逐字** "**With demonstratives (this, that, these, those) we can say all of or all without of:**"（`All (of) this has to go out into the rubbish bin.`）；**名词短语内可选逐字** "**We often use of after all in definite noun phrases (i.e. before the, possessives and demonstratives), but it is not obligatory:**"（`All (of) the workers were given a pay-rise at the end of the year.`／`I gave all (of) my old books to my sister when she went to university.`）；**`All without of` 节逐字** "**We use all, not all of, before indefinite plural nouns referring to a whole class of people or things:**"（`All cats love milk.` ❌`All of cats love milk.`）＋"**We use all, not all of, before uncountable nouns.**"（`All junk food is bad for you.` ❌`All of junk food is bad for you.`）；**短答逐字** "**All of them.**" ❌`Them all.`。**BC `quantifiers` 页 `Members of groups` 节（`Level: intermediate`）逐字**："**but if we are talking about members of a specific group, we use of the as well**"（`Few of the snakes in this zoo are dangerous.`／`Most of the boys at my school play football.`／`He's spent all (of) the money that we gave him.`／`Both (of) the chairs in my office are broken.`）＋**注逐字** "**Note: with all and both, we don't need to use of. We can say all the … and both the … .**"。**Murphy**：中级 U88 `88all/allofmost/mostofno/noneofetc.`（四词一格） | **⚠️ 半有**：**中级 U88 四词共用一格**（`all of`／`most of`／`no`／`none of`）；**初级侧无对应单元**（初级 U81 是 `allmostsomeanyno/none`，**不含 `of`**） | **✅ 有**（Cambridge `All of` 独立小节＋BC `Members of groups` 独立节） | **B** | **关键逐字**：`of` 在 `all` 后是**可选**（"it is not obligatory"），**但在人称代词后是必需**（"We use all of before personal pronouns"）⇒ **这是一条真规则，但它的教学点是「什么时候必须加 of」而非新句型** |
| **`both of`** | **Cambridge `Both` 页**（面包屑本轮实取逐字 `Grammar > Nouns, pronouns and determiners > Quantifiers > Both`）；**批二十五台账逐字**：该页含独立小节 `Both of + object pronoun`；**且 `grammar/british-grammar/both-both-of-neither-neither-of-either-either-of` 这个 URL 返回同页**（批二十五实测）⇒ **`both of` 是 `Both` 页内的节，不是独立页**。**BC `quantifiers` 逐字**：`Both (of) the chairs in my office are broken.`＋"**Note: with all and both, we don't need to use of.**" | **⚠️ 半有**：中级 U89 `89both/bothofneither/neitherofeither/eitherof`（六词一格） | **✅ 有**（页内节） | **B** | **与 `all of` 同一条规矩**（BC 用一句 "Note: with all and both, we don't need to use of." 把两词合并处理） |
| **`none of`** | **Cambridge `No, none and none of` 页内 `None of` 小节**（5 条规则，逐字见 §1.1 `none` 行）；**注意**：**该页标题本身就是 `No, none and none of`** ⇒ **`none of` 与 `none` 同页**，是节不是页 | **⚠️ 半有**：中级 U88（四词一格） | **✅ 有**（同页小节） | **B** | **它是 `none` 的形态变体**（`none` + `of` + 限定词），**与 `none` 同页同节** ⇒ **与轴 A 撞车的风险最高**（§4.3 专项） |
| **`most of`（对照）** | **Cambridge `Most, the most, mostly` 页**（本轮实取）；`most of` 规则逐字 "**When we are talking about the majority of a specific set of something, we use most of the + noun.**"／"**When we use most before articles (a/an, the), demonstratives (this, that), possessives (my, your) or pronouns (him, them), we need of:**"（`Most of the information was useful.` ❌`Most the information …`）／"**When there is no article, demonstrative or possessive pronoun, we don't usually use of:**"（❌`Most of rivers are below their normal levels.`）。**我方现状**：`most` GL **32 次但全在 L31**（「最能比 · -est / most」＝形容词最高级，**不是量词义**）⇒ **量词 `most` 本身是零** | — | — | **C（本批不列候选）** | **`most of` 落在同一页/同一教材格，但 `most`（量词义）我方完全没教** ⇒ **它是另开的轴，不属于本批**（登记 §7） |

---

## §2 轴 A 专项（本轮最重要）

### 2.1 直接回答主理人的三个问题

| 主理人的问题 | 本轮答案 |
|---|---|
| **① 确定的课量** | **1 课：`none`（＋`none of` 作课内结构），`no one`／`nobody` 作对照位 0 课。** **✅ 确认上一轮判定，不修正。** |
| **② 每课能否凑满 6 条对比卡？** | **能。** **配方 3 条带标记新错 ＋ 3 条双正解**：**3 条新错本轮逐条核到且全部单源可验**（§2.2）；**3 条双正解从库内既有课直接取**（L84／L149／L151，§2.4）。**L153／L154／L155／L156 实测均为 (3 wrongMark, 3 bothRight)** ⇒ 配方已固化，本课照抄即可。 |
| **③ `none` 与 `nothing` 的边界，两源是否真分页分格？** | **✅ 复核成立：两源真的分页、分格。** **逐字见 §2.3。** |
| **④ `none of` 那一层要不要在本课带？会与轴 C 撞车吗？** | **要带，且不撞车。** **理由：Cambridge 把 `none` 与 `none of` 放在同一页（页名就叫 `No, none and none of`）** ⇒ **分不开**；**而轴 C（`all of`／`both of`）是另一页另一轴**（§4.3 专项）。 |
| **⑤ 为什么不能更多（2 课）？** | **`no one`／`nobody` 的真新错只有 1 条**（§2.5），**且它们的第 1 条硬增量与 L84 已教规矩同源**（§0.3：这条规矩 L84 立规、L149／L150 已复现）⇒ **拆成 2 课必然破「一课一增量」**。 |

### 2.2 `none` 的 3 条真新错（逐条可验，本轮全部重新取原文）

| # | 增量（中文一句话） | 跨源逐字依据（可复跑） | 我方回流位 |
|---|---|---|---|
| **①** | **`none` 不能直接接名词；要接名词必须走 `none of + the/my/this/them`（或换成 `no + 名词`）** | **Cambridge `No, none and none of` 页 `Typical error` 逐字**："**We don't use none directly before nouns. We use no + noun or none of + noun.**"（❌`None children in my group …` 正解 `No children in my group caused any trouble.`）＋ **`None of` 小节逐字** "**We use none with of before the, demonstratives (this, that), possessives (my, your) or pronouns:**"（`None of his old friends knew what had happened to him.`／`None of it was your fault.`） | **L151 `All the books are good.`**（`all` 直接接 `the`／`my`）＋ **L84 `There is nothing in the box.`**（`nothing` 直接站，**后面什么都不接**）—— **三条对比：`all` ＋名词、`nothing` ＋零、`none` 必须 `of`** |
| **②** | **两个东西用 `neither of`，不用 `none of`** | **Cambridge 同页逐字**："**When we are referring to two things or people, we use neither of rather than none of:**"（❌`Not: None of us said anything.` 正解 `Neither of us said anything.` ——**语境逐字就是两个人**：`We sat down at the table, just the two of us.`） | **⚠️ 直接回流 L149（`Neither book is good.`）**—— **做成跨批回流卡**（这是本课最干净的一张「新错」，因为上游给了 ❌ 原文） |
| **③** | **`none` 是代词，单独站（后面不接名词）；`none of` 才带范围** | **Cambridge 同页逐字**："**No and none of are determiners. None is a pronoun.**"／"**None is the pronoun form of no. None means 'not one' or 'not any'.**"（例 `But none came.`／`My father had none.`／`None.`）；**中文侧 `english.cool/quantifiers/` 逐字** "**none 為 not one 的合併，表示「一個都不…」**"／"**none 後面若需要接名詞，就要使用 none of**"；**中文侧 `english.cool/indefinite-pronouns/` 逐字** "**它的意思是「一個都沒有、半個都不剩」，語氣比 not any 更強烈、更乾脆**" | **L84 `nothing`**——同为「一个词自带不」，**但轴不同**（东西 vs 范围，§2.3） |

> **⇒ 3 条成立。强度自评**：**② 最强**（上游直接给 ❌／正解对照，且回流 L149）；**① 次强**（Typical error 是独立框，且与 L151 形成「`all` 直接接 vs `none` 必须 `of`」的对照）；**③ 最弱**（是词性说明而非禁用句，靠中文侧两页独立表述补强）。
> **⚠️ 我主动排除的第 4 条**：**「`none` 不再请 not」**（Cambridge 逐字 "**We don't use none of when there is already a negative word (not, n't) in the clause:**"）。**排除理由：这是 L84 已立规矩的第 4 次应用**（§0.3）。**它应作课内 `variants`／`deepDive` 的复现点，不占 3 条新错名额。**
> **⚠️ 我主动排除的第 5 条**：**「`none of` 配单数动词」**（Cambridge 逐字 "In formal styles, we use none of with a singular verb when it is the subject." ＋ "**However, in informal speaking, people often use plural verbs:**"）。**排除理由：两源并存（单复数皆可）＋中文侧逐字 "none of + 可數名詞 + 單數/複數動詞"** ⇒ **对零基础立考点会与 L151「一群用 are」打架**（详见 §8③）。

### 2.3 `none` 与 `nothing` 的边界——**两轴论复核（主理人指定）**

**结论：两源真的分页、分格。✅ 复核成立，且本轮证据比上一轮更硬（两页面包屑各自实取）。**

| 证据源 | `none` | `nothing` | 是否分列 |
|---|---|---|---|
| **Cambridge 语法页** | 页名 `No, none and none of`，**面包屑逐字** `Grammar > Nouns, pronouns and determiners > **Quantifiers** > No, none and none of` | 页名 `No one, nobody, nothing, nowhere`，**面包屑逐字** `Grammar > Nouns, pronouns and determiners > **Pronouns** > No one, nobody, nothing, nowhere` | **✅ 两页分列（`Quantifiers` vs `Pronouns`）——本轮两页各自实取，逐字可复跑** |
| **Cambridge 词典词类** | `none` ＝ **pronoun** 单条（**B1**） | `nothing` ＝ **pronoun ＋ adverb ＋ noun**（pronoun 主条 **A2**，另有 B2×3） | **✅ 分列**（一个只作代词，一个跨三类） |
| **Murphy 中级 U86** | 标题逐字 `86no/none/anynothing/nobodyetc.` —— **第一行 `no/none/any`** | 同标题 —— **第二行 `nothing/nobody etc.`** | **✅ 同行不同组（两行分列）** |
| **Murphy 初级** | U77 `77not+anynonone`／U81 `81allmostsomeanyno/none` | U78 `78not+anybody/anyone/anythingnobody/no one/nothing` | **✅ 分属两个单元**（U77/U81 vs U78） |
| **BC 参考页** | **`none` 在 `quantifiers` 页**（`both, either and neither` 节表格例 `None of the supermarkets were open.`） | **`nothing` 在 `indefinite-pronouns` 页**（"We use pronouns ending in -body or -one for people, and pronouns ending in -thing for things"；例 `Nothing happened.`） | **✅ 分列两页** |
| **中文侧** | `english.cool/quantifiers/` 独立小节 `none`：**"none 會強調在某個範圍內都不…，no 則沒有限定範圍～"** | `english.cool/indefinite-pronouns/`：**`none` 也在，但归类为「不定代名詞」**；`nothing` 未在该页单列 | **⚠️ 中文侧部分重叠**（`indefinite-pronouns` 页把 `none` 也收了）—— **登记 §8⑦** |

> **⇒ 一句话边界（可直接写进课）**：**`nothing` 说「东西的零」（盒子里什么都没有），`none` 说「范围里的零」（一群人/一堆东西里，一个都没有）。**
> **⚠️ 提醒主理人**：**Cambridge 明文警告两词不能互换**——逐字 "**We don't use none where we mean no one or nobody.**"（❌`… and luckily none was injured.` 正解 `… and luckily no one was injured.`）。**这条要作为本课 `deepDive` 的收尾，防学员把 `none` 当「没有人」用。**

### 2.4 `none` 一课的 6 张对比卡（建议配方，全部单源可验）

| 卡 | 类型 | 内容 | 依据 |
|---|---|---|---|
| **1** | **带标记新错** | ❌`None of us said anything.`（针对两个人时）→ ✅`Neither of us said anything.`，`wrongMark: "None"` | Cambridge `No, none and none of` ❌原文 |
| **2** | **带标记新错** | ❌`None children in my group caused any trouble.` → ✅`No children in my group caused any trouble.`，`wrongMark: "None"` | Cambridge 同页 `Typical error` ❌原文 |
| **3** | **带标记新错** | ❌`She doesn't remember none of us.` → ✅`She doesn't remember any of us.`，`wrongMark: "none"` | Cambridge 同页 `None of` 小节 ❌原文（**同时是 L84 规矩的复现**） |
| **4** | **双正解** | `All the books are good.`（L151）↔ `None of the books are good.`，`bothRight: true`，`whyZh` 点明「肯定侧直接接 `the`，否定侧必须 `of`」 | Cambridge `Typical error` ＋ L151 课内原句 |
| **5** | **双正解** | `There is nothing in the box.`（L84）↔ `There is none in the box.`，`bothRight: true`，`whyZh` 点明「东西的零 vs 范围里的零」 | Cambridge 两页分列（§2.3） |
| **6** | **双正解** | `Neither book is good.`（L149）↔ `None of the three books is good.`，`bothRight: true`，`whyZh` 点明「两个用 `neither`，三个以上用 `none of`」 | Cambridge `None of` 小节＋L149 课内原句 |

### 2.5 `no one`／`nobody` 的增量清点（为什么撑不起第二课）

| # | 增量 | 跨源逐字 | 判定 |
|---|---|---|---|
| ① | 不用在 `no`／`not`／`never`／`hardly`／`seldom` 之后（❌`I can't do nothing.`） | Cambridge 逐字 "**We don't use nobody, no one, nothing, nowhere after no, not, never or other words which have a negative meaning (hardly, seldom).**"；**BC `indefinite-pronouns` 逐字** "**We do not use another negative in a clause with nobody, no one or nothing**" | **🔴 不是新知**：与 L84 的「自带不／不再请 not」**同一条规矩**（§0.3）；**且 `hardly`／`seldom` 我方 GL 未教**，反例词用户没见过 |
| ② | 配单数动词 | Cambridge 逐字 "**We use them with a singular verb:**"（`Nobody ever goes to see her.`）；**BC 逐字** "**We use a singular verb after an indefinite pronoun**" | **🔴 我方 L84 已教同款**（L84 逐字 "someone 是「有人」，一个人配 is"） |
| ③ | 复数回指用 `they`（新核到的第 3 条） | Cambridge 逐字 "**We often use the plural pronoun they to refer back to (singular) no one or nobody when we do not know if the person is male or female:**"（`No one remembers the titles of the books they've read.`）；**BC 逐字** "**When we refer back to an indefinite pronoun, we normally use a plural pronoun**" | **🟡 真规则（两源印证）**，但**对零基础偏难**（`they` 指单数，与「一个人配 is」直觉冲突）—— **可作本课的 1 张对照卡，不占独立课** |
| ④ | 拼写：`no one`／`no-one`，**不写 `noone`** | Cambridge 逐字 "**We write no one as two separate words or with a hyphen: no one or no-one but not noone.**" | **🔴 拼写考点——零基础 6–10 分钟课不设**（沿用批二十七／二十八同款裁决） |
| ⑤ | 书面用 `no one`／口语用 `nobody` | Cambridge 逐字 "**No one and nobody mean the same. Nobody is a little less formal than no one. We use no one more than nobody in writing:**"；Oxford 逐字 "**Nobody is more common than no one in spoken English.**"／"**No one is much more common than nobody in written English.**" | **🟡 真规则，但它是「同一意思的两种说法」的语域差异**（§5 判「半新」）—— **够做 1 条卡的 `whyZh`** |

> **⇒ `no one`／`nobody` 的真新错 = 2 条（③ 强 ＋ ⑤ 半新），且第 ③ 条对零基础偏难、第 ① ② 条是复述。** **❌ 撑不起第二课。**

### 2.6 课量建议（最终，含与上一轮的差异）

| 方案 | 课量 | 判定 | 理由 |
|---|---|---|---|
| `none` 一课 ＋ `no one`／`nobody` 一课 | 2 课 | **❌ 否** | 第二课真新错仅 2 条（其中 1 条半新、1 条偏难）；**且第 ① ② 条与 L84／L149／L150 同源**（§0.3） |
| 三词合并一课 | 1 课 | **❌ 否** | **Cambridge 明文警告** "**We don't use none where we mean no one or nobody.**"——**三词是「不能互换」的关系，合并会把「用哪个」和「都不用」混成一锅**；**且轴不同**（范围 vs 人） |
| **`none` 1 课 ＋ `no one`／`nobody` 作对照位** | **1 课** | **✅ 推荐（= 上一轮结论，确认不修正）** | **① `none` 有 3 条独立可验的新错；② 对照位复用 L151 已许下的钩子；③ 造词成本低（§2.7）；④ 与 L84 形成「两条轴」对照，符合 §5 的「新结构」判据** |

> **⚠️ 与上一轮的差异（自我抽检）**：**上一轮我写「`no one`／`nobody` 的真新错 = 1 条」，本轮复算为 2 条**——**新增的第 ③ 条（复数回指用 `they`）是上一轮漏掉的**，本轮在 Cambridge 页与 BC 页**两源取到逐字**。**但结论不变**：因为 ③ 与零基础直觉冲突（「一个人配 is」刚教过），**它仍是「对照卡素材」而非「独立课增量」**。

### 2.7 必造词位与「一课一增量」

| 课 | 主词 | 一课一增量（中文一句话） | 必造词位 | 硬增量条数 | 上限 |
|---|---|---|---|---|---|
| **第 1 课** | **`none`（＋`none of`）** | 「**一个都不**」＝ not one：**单独站是代词；要带范围就必须 `none of + 限定词`**；**两个东西不用它（用 `neither of`）**；**不能拿来指人**（指人用 `no one`／`nobody`） | **1**（`none`）；若课上带 `no + 名词` 则 **2**——**`no` 我方 GL 实测 32 处，逐条看过全是 `No, thanks.`／`no answer`／`No problem` 类非量词义** ⇒ **「`no` ＋名词」作量词义仍是新词位** | **3 条**（§2.2 全条） | **1 课** |
| **对照位（不占课）** | **`no one`／`nobody`** | 「**一个人也没有**」：**跟单数动词**；**写作用 `no one`、口语用 `nobody`**；**回指用 `they`** | **2**（`no one` 两词算一个词位 ＋ `nobody`） | **2 条（1 强 1 半新）** | **0 课** |

**造词成本核查（本轮实测 `src/data/bundledDictionary.ts`，12000 条／3 行）**：`none` ✅ 有词条／`nobody` ✅／`nothing` ✅／`way` ✅／`both` ✅／`all` ✅／`neither` ✅／`anyone` ✅／`anybody` ✅；**`no one` 短语条 0**（与批二十八台账一致）。**⇒ 造词只是「课程词表登记」，不是词典缺条。**

> **⚠️ 对照位落地口径**：放进第 1 课的 `sceneSwings`／`variants` 各 1 格（**不占 `contrast` 的 3 条新错名额**），并在 `deepDive` 用 Cambridge 逐字收尾「`none` 不能指人」（"We don't use none where we mean no one or nobody."）⇒ **兑现 L151 那张卡上「否定侧下一批再看」的承诺。**

---

## §3 轴 B 专项：`way`

### 3.1 课程位复核（主理人问：`the way to`／`on the way`／`by the way`／`in this way` 是否独立单元）

**结论：四个短语全部没有课程位。** 逐一核证如下：

| 短语 | Cambridge 语法页 | Murphy 双册 | BC 68 课全目 | 课程位判定 |
|---|---|---|---|---|
| `the way to` | **无独立页**（`Way` 页内无独立小节；本轮逐字检索 `the way to` **未取到规则句**） | **0 命中** | **0** | **❌ 无** |
| `on the way` | **✅ 有独立对比页** `In the way or on the way?`（`Easily confused words` 类目）＋ `Way` 页内小节 | **0 命中** | **0** | **❌ 无**（有规则页，无课位） |
| `by the way` | **❌ slug 302 重定向语法总入口**（本轮实测）—— 只有 Oxford 词典 idiom 条，标 `(informal)` | **0 命中** | **0** | **❌ 无** |
| `in this way` | **❌ slug 302 重定向语法总入口**（本轮实测） | **0 命中** | **0** | **❌ 无** |
| `way`（本义） | **✅ 有独立页 `Way`**（`Using nouns` 类目，**3 节**） | **0 命中** | **0** | **❌ 无**（有规则页，无课位） |

> **诚实登记**：**「Cambridge 有两页、Murphy 零页、BC 零课」** 是本轮的完整图景。**我未能在 Murphy 双册 TOC 中取到任何 `way` 字样**（两个归一化文件全文 Python 复算，各 0 命中）——**这与「`way` 是词汇条目而非语法单元」的判断一致**。

### 3.2 `way` 的规则页内容清点（能不能撑课）

**Cambridge `Way` 页 3 节的规则全部清点如下（逐字）**：

| 节 | 规则 | 我方对应缺口 |
|---|---|---|
| `Way as a noun` | "**As a noun the most common meanings of way are 'method or style', 'route, direction, road' and 'distance'**"（4 个义项） | **方法义**（`a way to do`）我方零；**路/方向义**我方只有 `go to + 地点`（L9） |
| `Way as a noun`（搭配） | "**We can use a to-infinitive or an -ing form after way when it means 'method':**"（`There's an easier way to do that.` / `There's an easier way of doing that.`） | **`way to do`／`way of doing` 两式我方零**——但这是**中级结构**（要配不定式/动名词，我方 L42–L46 有 -ing，L71+ 有不定式） |
| `Way as an adverb` | "**We can use way informally as a degree adverb to mean 'a lot':**"（`way behind schedule`／`way more chances`） | **口语程度副词，与「路」无关**——**不是零基础必需**，且**易与 `very` 混**（我方 L? 有 very） |
| `In the way, on the way` | "**We use in the way for things that are obstructing a path or stopping us from getting somewhere**"／"**We use on the way to mean in the middle of the journey:**" | **`in the way`（挡路）与 `on the way`（在路上）的辨析**——**两义都是真缺口** |
| **页尾免责声明** | "**You will find other meanings of way and expressions with way in a good learner's dictionary.**" | **上游自认这页不全** ⇒ **不能当作「完整课程单元」的依据** |

**Cambridge `In the way or on the way?` 页 2 节（逐字）**：
- `In the way`："**If something or someone is in the way or in my/his/our way, it is in the space which someone needs for a particular movement or action:**"（`She can't do her dance because the table is in the way.`）
- `On the way`："**We use on the way or on my/his/our way (to) when we talk about the route, direction or path to somewhere:**"（`We could leave early and have breakfast on the way.`／`I was on my way to Peter's house when I met him in the street.`）＋ "**We can use on the way to (plus a noun or an -ing form of a verb) to mean 'close to' doing or completing something:**"（`Brazil is on the way to becoming one of the world's strongest economies.`）

> **⇒ 可教学内容 = 2 条**（`in the way` 挡路 ／ `on the way` 在路上）**＋ 1 条延长义**（`on the way to + -ing`，中级）。

### 3.3 我方现状与造词成本（主理人问：须造几个词）

**我方实测（本轮）**：
- `way` GL **1**（L140 对白 `Say it another way?`）／HC **1**（`hunt-photo-album` 案文 `On the way home, I ate a apple`）—— **两处都不是教学位，且第二处本身是个错误句**（该案 `errors` 里 `was`／`have`／`a apple` 均有标记，`way` 只是路过词）。
- **路线/问路相关结构的真实覆盖**：`go to` **137 处**（**L9 是教学位** `go to + 地点`）；`near here` **12 处**（**L26 `There be` 课的例句** `Is there a park near here?` ——**这是问路句的近亲**）；`turn left` **1 处**（**只在 L? 祈使句课 `deepDive` 的标语举例里**：`Push（推）、Pull（拉）、Turn left（左转）`）；`get to` **0**／`How do I` **0**／`turn right` **0**。
- **词典侧**：`way` ✅ 有词条；`by the way`／`on the way`／`in the way`／`get to`／`turn left`／`turn right` **短语条 0**（词典只收单词 `left`／`right`／`station`／`hospital`／`road`／`street` 各 1 条）。

**造词成本估算（若开 `way` 一课）**：

| 项 | 词数 | 说明 |
|---|---|---|
| `way` 本体 | **1** | 词典已有，仅需课程词表登记 |
| 问路对方（若带「去…怎么走」场景） | **2–3** | `know`（GL 未测）＋ 地名/场所（`station`／`hospital`／`road` 词典已有） |
| `in the way`／`on the way` 的对比词 | **0–1** | 两短语靠 `way` ＋已教的 `in`／`on` 拼出（我方 `in`／`on` 早已教） |
| **合计** | **3–5** | **比批二十八 `ago` 的造词成本高**（`ago` 侧只需造 `days`／`weeks`／`years` 复数形态） |

### 3.4 `way` 能撑几课

| 问题 | 答案 |
|---|---|
| 能否撑 1 课？ | **勉强，但要靠「造场景」而不是「跨源课位」** —— **可教学内容 2 条硬规则**（`in the way` / `on the way`）**＋1 条中级延长义**，**距 3 条新错差 1 条** |
| 有没有更该先做的？ | **有。** `way` 的 2 条规则全是**「介词辨析」**（`in` vs `on`），**与我方已教 `in`／`on`（L? 地点介词）构成「同一条规矩的应用」**——**按 §5 红线，这属于「同一意思的另一种说法」风险区** |
| 档位 | **B−**：**有规则页（且 `on the way` 侧有独立对比页）＋无课程位＋须造词 3–5 位＋CEFR 分裂（Cambridge A2/B1/B2 vs Oxford a1）** |
| **推荐** | **本批不排期；列为「候补轴」，优先度低于轴 A。** **若主理人要开，必须限定为「`in the way` vs `on the way` 辨析一课」，且把 `by the way`／`in this way` 明确列 Non-goal**（§7） |

> **⚠️ 本轮最重要的轴 B 发现**：**Cambridge `Way` 页尾的免责声明**（"You will find other meanings of way and expressions with way in a good learner's dictionary."）**说明上游自己都不把这页当完整单元**。**这是我把 `way` 压在 B− 而不是 B 的直接依据。**

---

## §4 轴 C 专项：`of` 层（`both of`／`all of`／`none of`）

### 4.1 `of` 层的档位

| 候选 | 课程位 | 规则页 | 档位 |
|---|---|---|---|
| `all of` | **⚠️ 半有**：中级 U88 四词一格（`all of`／`most of`／`no`／`none of`）；**初级侧无**（初级 U81 是 `allmostsomeanyno/none`，不含 `of`） | **✅ 有**（Cambridge `All of` 独立小节＋`All without of` 小节＋BC `Members of groups` 独立节，`Level: intermediate`） | **B** |
| `both of` | **⚠️ 半有**：中级 U89 六词一格；`both-both-of-…` URL 重定向回 `Both` 页（批二十五实测） | **✅ 有**（页内节 `Both of + object pronoun`＋BC 同一句注） | **B** |
| `none of` | **⚠️ 半有**：中级 U88 四词一格 | **✅ 有**（与 `none` 同页同节） | **B** |

**关键 CEFR 证据（批二十五／二十八两次登记为「中级层」的复核）**：
- **BC `quantifiers` 页的 `Members of groups` 节（`of` 层的唯一 BC 出处）标 `Level: intermediate`**——**本轮实取、逐字确认标签紧随该节**。
- **对照**：同页 `some and any` 节标 `Level: beginner` ⇒ **BC 明确把 `of` 层与基础量词分层**。
- **Cambridge 侧的 `All of` 小节未标 CEFR**（Cambridge 语法页整体说明逐字："it's ideal for intermediate learners of English at CEFR levels **B1-B2**"）。

### 4.2 这一层现在该不该做（我的判定）

**判定：不该现在做（本批继续不做）。三条理由：**

1. **BC 明文分层**：`of` 层所在节是 `Level: intermediate`，而**我方现教段位在 A2–B1 段**（L148–L156 是 both/all/every/yet/already/still/ago/for）。
2. **`of` 层在库内已被「反向使用」**：**L151 的对比卡逐字** ❌`All of books are good.`，`wrongMark: "of"`，正解 `All the books are good.`，`whyZh: "中文说「所有的书」直接连着说，英语的 all 后面也直接接——中间不加 of。"` ⇒ **我方 L151 已经把「不加 `of`」当默认口径教过了**。**若现在开 `of` 层，等于要在一课内推翻自己刚立的口径，对零基础是净增负担。**
3. **⚠️ 但 L151 有一处口径风险（本轮新发现，重要）**：**L151 的 `// R9` 替换题**选项是 `["All my books are good.", "All of my books are good.", "My all books are good."]`，**`answer` 是 `All my books are good.`**。**而 Cambridge 逐字**："**We often use of after all in definite noun phrases (i.e. before the, possessives and demonstratives), but it is not obligatory:**"（例 `I gave all (of) my old books to my sister…`）⇒ **`All of my books are good.` 在跨源标准下是对的，我方把它当成了「非答案」**。**BC 也逐字** "Note: with all and both, we don't need to use of."（**无需**，非**不可**）。**⇒ 这是一处需要主理人裁决的既有课内口径问题**（§8②）。

### 4.3 `of` 层与轴 A 的关系（撞车分析）

| 问题 | 判定 | 依据 |
|---|---|---|
| `none of` 会不会把 `none` 的增量吃掉？ | **❌ 不会，反而互补。** | **Cambridge 把 `none` 与 `none of` 放在同一页**（页名逐字 `No, none and none of`），**同一节内 5 条规则混排** ⇒ **拆不开**；**`none` 的 3 条新错里有 1 条（①）本身就是 `none of` 的规则** ⇒ **它们是同一个教学点的两面，不是两个候选** |
| 那轴 C 与轴 A 的真实关系是什么？ | **轴 C ≠ 轴 A。** **轴 A = `none` 一个新词位（否定侧的正主）；轴 C = 给已教的 `all`／`both` 加 `of` 的形态层。** | **`none of` 归轴 A（因为 `none` 单独站时是代词，`of` 是它的必需搭档）；`all of`／`both of` 归轴 C（可选形态层）** |
| 会不会重复？ | **⚠️ 有一处重叠要盯**：**`none of` 的第 3 条规则（配单复数动词）与 L151 的「一群用 are」边界模糊**（§8③）。**建议本课不立单复数考点。** | Cambridge 逐字 "In formal styles … singular verb … However, in informal speaking, people often use plural verbs" ＋ 中文侧逐字 "none of + 可數名詞 + 單數/複數動詞" |

> **⇒ 一句话**：**轴 C 推迟，但轴 A 的课内必须带 `none of`**（**因为它是 `none` 的必需搭档，Cambridge 同页同节**）。**这不是「把轴 C 提前」，而是「`none` 课的内含结构」。**

---

## §5 「同义换词 vs 新结构」甄别（核心红线）

| 候选 | 判定 | 依据（逐字） | 课量后果 |
|---|---|---|---|
| **`none`** | 🟢 **新结构（新轴）** | Cambridge 逐字 "**None is the pronoun form of no. None means 'not one' or 'not any'.**"；**两源分页**（`none` 在 `Quantifiers` 页 / `nothing` 在 `Pronouns` 页，**两页面包屑本轮各自实取**）；**Murphy 中级 U86 两行**（`no/none/any` vs `nothing/nobody etc.`）；**中文侧两页各 1 节** | **1 课可开** |
| **`no one`** | 🔴 **纯同义换词（跨源自认）** | Cambridge 逐字 "**No one and nobody mean the same.**"；**且与 L84 `nothing` 同页**（四词共享 `Nothing`／`no one`／`nobody`／`nowhere`） | **0 课；作对照位。** **⚠️ 这是本批最干净的一处「同义」自认** |
| **`nobody`** | 🟡 **半新（同一意思的两种说法＋语域分工）** | Cambridge 逐字 "**Nobody is a little less formal than no one. We use no one more than nobody in writing:**"；Oxford 逐字 "**Nobody is more common than no one in spoken English.**"／"**No one is much more common than nobody in written English.**" | **0 课（语域差异不够撑一课）** |
| **`in the way` vs `on the way`** | 🟡 **半新（介词辨析）** | Cambridge 逐字 "We use **in** the way for things that are obstructing a path…"／"We use **on** the way to mean in the middle of the journey"；**两词只差介词 `in`／`on`，而 `in`／`on` 我方早已教** | **本批不排（若排需限 1 课）** |
| **`by the way`** | 🔴 **同义换词／语用插入语** | Cambridge 无独立页（302）；Oxford 逐字 "used to introduce a comment or question that is not directly related to what you have been talking about" ＋ 标 `(informal)` | **0 课** |
| **`all of`／`both of`（轴 C）** | 🟡 **形态变体（同一个词 + `of`）** | Cambridge 逐字 "**…but it is not obligatory:**"／BC 逐字 "**Note: with all and both, we don't need to use of.**" | **本批 0 课（推迟，§4）** |
| **`none of`（轴 C 内）** | 🟢 **归轴 A 内含结构，不是独立候选** | Cambridge 页名逐字 `No, none and none of` ⇒ **同页同节** | **不另计课量** |

> **§5 结论（红线执行）**：
> - **必须封顶 0 课**：`no one`（跨源自认同义 "**mean the same**"）、`by the way`（无规则页、`(informal)`）、`all of`／`both of`（形态变体）。
> - **可开 1 课**：`none`（新轴，且有 3 条独立新错）。
> - **候补**：`way`（若开，限 `in`/`on` 辨析 1 课，且不得连带 `by the way`／`in this way`）。

---

## §6 三轴档位对比表 ＋ 推荐

### 6.1 全候选档位总表

| 轴 | 候选 | ② 课程位 | ③ 规则页 | CEFR（Cambridge/Oxford） | 造词 | 档位 | 课量建议 |
|---|---|---|---|---|---|---|---|
| **A** | **`none`** | ✅ 4 处全共用（初级 U77／U81，中级 U86／U88） | ✅✅ 独立页＋5 条 `None of` 规则＋Typical error＋Warning＋中文侧 2 页各 1 节 | **B1／a2** | **1**（`none`） | **B＋** | **1 课** |
| **A** | `no one` | ⚠️ 无独立格（初级 U78 六词一格／中级 U86 第二行） | ✅ 独立页（与 `nothing`／`nobody`／`nowhere` 共页） | **A2／a1** | 1 | **B** | **对照位（0 课）** |
| **A** | `nobody` | ⚠️ 同上 | ✅ 同上 | **A2／a1** | 1 | **B** | **对照位（0 课）** |
| **A** | `none of` | ⚠️ 中级 U88（四词一格） | ✅ 与 `none` 同页同节 | — | 0（含在 `none` 课） | **B（归轴 A）** | **课内结构，0 课** |
| **B** | `way`（本义） | ❌ 无（Murphy 0／BC 0） | ✅ 独立页 3 节（**页尾自认不全**） | **A2/B1/B2／a1** | **3–5** | **B−** | **本批 0 课** |
| **B** | `on the way` | ❌ 无 | ✅✅ **独立对比页** `In the way or on the way?` ＋`Way` 页小节 | — | 0–1 | **B−** | **0 课（候补）** |
| **B** | `the way to` | ❌ 无 | ⚠️ 仅例句成分 | — | 0 | **C** | **0 课** |
| **B** | `by the way` | ❌ 无（302 到总入口） | ❌ 无（仅词典 idiom，标 `(informal)`） | — | 0 | **C** | **0 课** |
| **B** | `in this way` | ❌ 无（302 到总入口） | ❌ 无 | — | 0 | **C** | **0 课** |
| **C** | `all of` | ⚠️ 半有（中级 U88 四词一格；初级无） | ✅ 有（Cambridge `All of` 小节＋BC 节标 `Level: intermediate`） | — | 0 | **B** | **0 课（推迟）** |
| **C** | `both of` | ⚠️ 半有（中级 U89 六词一格） | ✅ 有（`Both` 页内节） | — | 0 | **B** | **0 课（推迟）** |

### 6.2 推荐

> **本批建议 1 课：`none`（＋`none of` 内含；`no one`／`nobody` 作对照位）。** **轴 B（`way`）与轴 C（`of` 层）本批不排期。**

| 优先级 | 项 | 课量 | 理由 |
|---|---|---|---|
| **1** | **轴 A：`none` 1 课** | **1** | **① 「都」家族否定侧的唯一正主**（肯定侧 `both`／`all`／`every` 已教完，§0.2）；**② 课程位 4 处为全部候选中最多、规则页最厚**（§1.1）；**③ 3 条新错全部单源可验**（§2.2）；**④ 造词成本 1 位** |
| **2** | **`no one`／`nobody` 封顶为 0 课** | **0** | **Cambridge 逐字自认同义**："**No one and nobody mean the same.**" ⇒ **§5 红线** |
| **3** | **轴 B `way` 本批不排** | **0** | **课程位三个上游全零 ＋ 页尾自认不全 ＋ 造词 3–5 位 ＋ 仅 2 条硬规则** ⇒ **B−**，**优先度低于轴 A** |
| **4** | **轴 C `of` 层本批不排** | **0** | **BC 逐字标 `Level: intermediate`；且 L151 已立「`all` 直接接」口径** ⇒ **现在做会自相矛盾**（§4.2） |

### 6.3 「为什么不能更多」——四条硬上限

| # | 上限 | 依据 |
|---|---|---|
| **1** | **`none` 封顶 1 课** | 它的第 4 条候选增量（「不再请 not」）**与 L84 已教规矩同源**（§0.3：L84 立规 → L149 第 2 次 → L150 第 3 次）⇒ **硬增量实为「2 强 ＋ 1 中」，只能撑 1 课** |
| **2** | **`no one`／`nobody` 封顶 0 课** | **跨源逐字自认同义**（"mean the same"）＋**真新错 2 条（1 条半新、1 条偏难）** |
| **3** | **`way` 封顶 0 课（本批）** | **Murphy 双册 0 命中／BC 68 课 0 专课／Cambridge 页自认不全**；**可教规则仅 2 条** |
| **4** | **`of` 层封顶 0 课** | **BC 标 `Level: intermediate`**（与 `some and any` 的 `Level: beginner` 明分）＋ **L151 已教反向口径** |

---

## §7 Non-goals 依据（本批明确不做，含依据）

| # | Non-goal | 依据 |
|---|---|---|
| 1 | **`no one`／`nobody` 单开一课** | Cambridge 逐字 "**No one and nobody mean the same.**"；Murphy 两册均无独立单元（初级 U78 六词一格／中级 U86 第二行）；真新错仅 2 条且 1 条偏难（§2.5） |
| 2 | **`none` 与 `no one`／`nobody` 合并一课** | Cambridge Warning 逐字 "**We don't use none where we mean no one or nobody.**" ⇒ 三词是「不能互换」的关系 |
| 3 | **拼写类考点（`noone`）** | Cambridge 逐字 "**We write no one as two separate words or with a hyphen: no one or no-one but not noone.**"——**零基础 6–10 分钟课不设拼写考点** |
| 4 | **`hardly`／`seldom` 作反例词** | Cambridge 反例句 ❌`She talks to hardly no one.` 里的两个关键词**我方 GL 均未教** ⇒ 不能作反例 |
| 5 | **`none of` 的单复数动词考点** | Cambridge 逐字两源并存（"In formal styles … singular verb … However, in informal speaking, people often use plural verbs"）＋ 中文侧逐字 "none of + 可數名詞 + 單數/複數動詞" ⇒ **对零基础边界模糊**（§8③） |
| 6 | **`by the way`** | Cambridge 无独立页（`by-the-way` slug **302** 到语法总入口，本轮实测）；Oxford 标 `(informal)` 的 idiom 条 |
| 7 | **`in this way`／`the way (that)`** | Cambridge `in-this-way`／`the-way-that` **两个 slug 均 302**（本轮实测）⇒ 无规则页；且 `the way (that)` 是中级从句结构 |
| 8 | **`way as an adverb`（`way behind schedule`）** | Cambridge 逐字标为 "**We can use way informally as a degree adverb**"（口语程度副词）；**与「路」无关，且易与 `very` 混** |
| 9 | **`all of`／`both of`／`most of` 的 `of` 层** | BC `quantifiers` 页 `Members of groups` 节标 **`Level: intermediate`**（与 `some and any` 的 `Level: beginner` 明分）；**L151 已教「`all` 直接接」的反向口径**（§4.2） |
| 10 | **`most`（量词义）** | **我方 `most` GL 32 处全在 L31 的「最高级 `-est`／`most`」**（形容词最高级），**量词义完全空白** ⇒ 是另开的轴，不属本批 |

---

## §8 未核实项（诚实登记）

| # | 项 | 状态 | 影响 |
|---|---|---|---|
| **①** | **Cambridge `none of` 规则的读法** | **⚠️ 沿用批二十八的修正**：原文 "**We use none with of before the, demonstratives (this, that), possessives (my, your) or pronouns:**" 是**许可清单**，**不是禁令**；真禁令来自 `Typical error` "**We don't use none directly before nouns**"。**本轮复核该读法成立** | **§2.2 增量 ① 的措辞已按「不能直接接名词」写** |
| **②** | **L151 的 `All of my books are good.` 口径** | **⚠️ 本轮新发现的既有课内风险**：L151 `// R9` 替换题把 `All of my books are good.` 列为**非答案**；**而 Cambridge 逐字** "We often use of after all in definite noun phrases (i.e. before the, possessives and demonstratives), **but it is not obligatory**" ⇒ **该句在跨源标准下是合法的**（`of` 可选）。**是否需要修订 L151 题干/选项，请主理人裁决** | **中**：**影响已上线课程的正确性口径**（不是我方能自行决定的，需主编裁决） |
| **③** | **`none of` 单复数动词的教学可用性** | **两源并存已取证**（Cambridge 分 formal/informal；中文侧逐字 "單數/複數動詞"）⇒ **对零基础是否立考点，本轮未判** | **中**：若 PRD 要立「`none of` 配单数」考点，请先裁决 |
| **④** | **Cambridge 词典 `none` 的 B1 是否覆盖代词义全部** | **部分核实**：`none` 页仅 **pronoun 一条**（`hw: {'none'}`／`pos: ['pronoun']`／`levels: ['B1']`），**未见分义标位** | 低（Oxford `a2` 已足够） |
| **⑤** | **`way` 在 Murphy 双册的零命中** | **已复算**：`/private/tmp/murphy_ess_norm.txt`（13966 字）与 `murphy_int_norm.txt`（11016 字）**全文 Python 正则 `(?i)way` 均 0 命中**。**⚠️ 但这两份是「TOC 归一化文本」，不是正文全文** ⇒ **Murphy 正文里的 `way` 用法页（如 Vocabulary 部分）我未核** | **低–中**：**TOC 零命中已足够支持「无独立单元」的结论**，但**「Murphy 完全没收 `way` 语法点」这个更强说法我不主张** |
| **⑥** | **BC 三档课目的完整复点** | **A1-A2 18 课本轮逐条复点**（18 个标题全列于 §1.2）；**⚠️ B1-B2 页本轮 WebFetch 只返回 1 个标题**（"Reported speech: statements"），**与我方台账「B1-B2 36 课」不一致** | **中**：**「无 `way` 专课」的结论不受影响**（A1-A2 已逐条核），但 **B1-B2 的 36 课全目本轮未复现**——**沿用台账，不自行改写** |
| **⑦** | **中文侧 `none` 的归类** | **两页并存**：`english.cool/quantifiers/` 把 `none` 当**量词**独立成节；`english.cool/indefinite-pronouns/` 把 `none` 当**不定代名词**举例。**上游自身分类不完全一致** | 低（**两页都收 `none`，反而说明中文侧覆盖更厚**） |
| **⑧** | **`english.cool` slug 全索引新鲜度** | 缓存 `/tmp/ec_slugs.txt`（**856 行**）为前批文件；**本轮直连实测**：`none`／`no-one`／`nobody`／`way`／`by-the-way`／`on-the-way`／`some-any`／`way-usage`／`how-to-get-there`／`ask-the-way` **全 404**；**200 的有**：`quantifiers`／`indefinite-pronouns`／`all`／`each-every`／`among-of-which-one-them`／`highway-freeway-expressway` | 低（结论独立成立） |
| **⑨** | **`english.cool/all/` 是不是 `all` 的语法文** | **实测不是**：页题逐字《【所有國家與首都的英文！】越南/泰國/韓國等英文怎麼說？》—— **是国名文，不是量词文** | 低（**中文侧 `all of` 的专文我未找到**，登记为缺口） |
| **⑩** | **BC `b1-b2-grammar` 页面结构** | **本轮 WebFetch 两次都只返回 1 个标题**；**页面可能用 JS 懒加载课目**（WebFetch 拿不到） | **中**：**这是「BC 三档 68 课」口径的一处不确定**，建议主理人知悉 |
| **⑪** | **`get to`／`know` 词位** | **`get to` GL 0**（已测）；**`know` 本轮未测**（造词成本表里我按「未测」标注） | 低（不影响档位） |
| **⑫** | **Oxford `way` 首义 `cefr="a1"` 的覆盖面** | **已取到**：Oxford `way` 主干 13 个义项中 `cefr` 标注为 a1×2／a2×4／b1×2（其余无标）；**idiom 条（130+）极少带 CEFR** | 低 |

---

## 附：本轮实测 / 引用清单

### A. 我方文件（逐字实读）

| 文件 | 规模（本轮实测） | 关键实证 |
|---|---|---|
| `/Users/liujun/Documents/英语听写/src/data/grammarLessons.ts` | **29584 行** | **156 课（1–156 无缺口）**；`contrast` 每课 6 条；**L153／L154／L155／L156 实测均 (3 wrongMark, 3 bothRight)**；`none`／`nobody`／`no one`／`ways` **全 0**；`nothing` **71**；`way` **1**（L140 对白）；`all of` **4（2 组，全在 L151 的非教学位）**；`both of`／`none of`／`most of`／`some of` **全 0**；`most` **32 全在 L31（最高级义）** |
| `/Users/liujun/Documents/英语听写/src/data/huntCases.ts` | **8973 行** | **165 案**；`none`／`nobody`／`no one`／`all of`／`none of` **全 0**；`way` **1**（`hunt-photo-album` 案文 `On the way home`） |
| `/Users/liujun/Documents/英语听写/src/data/grammarSeasons.ts` | **79 行** | **28 季**（`season-1` … `season-28`）；含「课程号不落在任何区间内会被路径页静默过滤」的硬护栏注释 |
| `/Users/liujun/Documents/英语听写/src/data/bundledDictionary.ts` | **3 行／12000 条** | 逐 headword：`none` ✅／`nobody` ✅／`nothing` ✅／`way` ✅／`both` ✅／`all` ✅／`neither` ✅／`anyone` ✅／`anybody` ✅；**`no one` 短语条 0**；**`by the way`／`on the way`／`in the way`／`get to`／`turn left`／`turn right` 短语条全 0** |

### B. Murphy TOC（本机原件归一化，沿用同一份文件）

| 文件 | 字数 | 逐字命中 |
|---|---|---|
| `/private/tmp/murphy_ess_norm.txt` | **13966** | `77not+anynonone`（@11437）／`78not+anybody/anyone/anythingnobody/no one/nothing`（@11452）／`81allmostsomeanyno/none`（@11549）／`82botheitherneither`；**`way` 命中 0** |
| `/private/tmp/murphy_int_norm.txt` | **11016** | `86no/none/anynothing/nobodyetc.`（@8697）／`88all/allofmost/mostofno/noneofetc.`（@8762）／`89both/bothofneither/neitherofeither/eitherof`；**`way` 命中 0** |

### C. 跨源网页（本轮实取）

| # | URL | 状态 | 关键逐字 |
|---|---|---|---|
| C-1 | `dictionary.cambridge.org/grammar/british-grammar/way` | ✅ | 面包屑 `Grammar > Nouns, pronouns and determiners > Using nouns > Way`／"Way is a noun and adverb."／"As a noun the most common meanings of way are 'method or style', 'route, direction, road' and 'distance':"／"We can use a to-infinitive or an -ing form after way when it means 'method':"／"We can use way informally as a degree adverb to mean 'a lot':"／"We use on the way to mean in the middle of the journey:"／**"You will find other meanings of way and expressions with way in a good learner's dictionary."** |
| C-2 | `…/in-the-way-on-the-way` | ✅ | 页题 `In the way or on the way?`／面包屑 `Grammar > Easily confused words > In the way or on the way?`／"If something or someone is in the way or in my/his/our way, it is in the space which someone needs for a particular movement or action:"／"We use on the way or on my/his/our way (to) when we talk about the route, direction or path to somewhere:"／"We can use on the way to (plus a noun or an -ing form of a verb) to mean 'close to' doing or completing something:" |
| C-3 | `…/no-none-and-none-of` | ✅（本轮再度实取） | 面包屑 `… > Quantifiers > No, none and none of`／"No and none of are determiners. None is a pronoun. No, none and none of indicate negation."／"None is the pronoun form of no. None means 'not one' or 'not any'."／`None of` 5 条（含 "We use none with of before the, demonstratives (this, that), possessives (my, your) or pronouns:"／"We don't use none of when there is already a negative word (not, n't) in the clause:"／"When we are referring to two things or people, we use neither of rather than none of:"／"In formal styles, we use none of with a singular verb when it is the subject."／"However, in informal speaking, people often use plural verbs:"）／Warning "We don't use none where we mean no one or nobody."／Typical error "**We don't use none directly before nouns. We use no + noun or none of + noun.**" |
| C-4 | `…/no-one-nobody-nothing-nowhere`（`/nothing` 同页） | ✅ | 面包屑 `… > Pronouns > No one, nobody, nothing, nowhere`／"No one, nobody, nothing and nowhere are indefinite pronouns."／"We use no one, nobody, nothing and nowhere to refer to an absence of people, things or places. We use them with a singular verb:"／"**No one and nobody mean the same. Nobody is a little less formal than no one. We use no one more than nobody in writing:**"／"We often use the plural pronoun they to refer back to (singular) no one or nobody…"／"We write no one as two separate words or with a hyphen: no one or no-one but not noone."／"We don't use nobody, no one, nothing, nowhere after no, not, never or other words which have a negative meaning (hardly, seldom)." |
| C-5 | `…/all` | ✅ | 面包屑 `… > Quantifiers > All`／10 小节（`All as a determiner` … `All: after all`）／"**We use all of before personal pronouns (us, them), demonstrative pronouns (this, that, these, those) and relative pronouns (whom, which).**"／"With demonstratives … we can say all of or all without of:"／"**We often use of after all in definite noun phrases (i.e. before the, possessives and demonstratives), but it is not obligatory:**"／"We use all, not all of, before indefinite plural nouns referring to a whole class of people or things:"／"We use all, not all of, before uncountable nouns." |
| C-6 | `…/both` | ✅ | 面包屑 `… > Quantifiers > Both`／"We use both to refer to two things or people together:" |
| C-7 | `…/most-the-most-mostly` | ✅ | "When we are talking about the majority of a specific set of something, we use most of the + noun."／"When we use most before articles (a/an, the), demonstratives (this, that), possessives (my, your) or pronouns (him, them), we need of:"／"When there is no article, demonstrative or possessive pronoun, we don't usually use of:" |
| C-8 | `…/all-of-most-of-none-of-etc` | ⚠️ **302 → `/grammar/british-grammar/`（语法总入口）** | **⇒ 该 URL 不是真页；Cambridge 无独立的 `all of / most of / none of etc.` 页**（本轮实测） |
| C-9 | `…/by-the-way`／`…/in-this-way`／`…/the-way-that` | ⚠️ **均 302 → 语法总入口**（本轮实测） | **⇒ `by the way`／`in this way`／`the way (that)` 在 Cambridge 语法区无独立页** |
| C-10 | `dictionary.cambridge.org/dictionary/english/{way,none,nobody,no-one,nothing}` | ✅ | **`way` noun 分义 A2／B1／B2（逐义实取）**／**`none` ＝ pronoun 单条 B1**／**`nobody` ＝ A2**／**`no one` ＝ A2**／**`nothing` ＝ pronoun 主条 A2 ＋ B2×3** |
| C-11 | `oxfordlearnersdictionaries.com/definition/english/{way_1,none,nobody,no-one}` | ✅ | **`way` 首义 `cefr="a1"`**（定义 `a method, style or manner of doing something`），另 a2×4／b1×2；**`none` `fkcefr="a2"` `ox3000="y"`**（定义 `not one of a group of people or things; not any`，例 `None of these pens works/work.`）／**`nobody` `fkcefr="a1"`**（`not anyone; no person`／`Nobody knew what to say.`）／**`no one` `fkcefr="a1" fkox3000="y"`**（`No one was at home.`）；**`way` idiom 条 130+**（`by the way` 标 `(informal)`：`used to introduce a comment or question that is not directly related to what you have been talking about`） |
| C-12 | BC `learnenglish.britishcouncil.org/grammar/english-grammar-reference/quantifiers` | ✅（WebFetch） | 8 节：`Quantifiers`／`Quantifiers with count and uncount nouns`／`some and any`／`Quantifiers with count nouns`／`Quantifiers with uncount nouns`／**`Members of groups`**／`both, either and neither`／`every and each`；**`Members of groups` 节标 `Level: intermediate`**，逐字 "but if we are talking about members of a specific group, we use of the as well"（`He's spent all (of) the money that we gave him.`／`Both (of) the chairs in my office are broken.`）＋"**Note: with all and both, we don't need to use of. We can say all the … and both the … .**"；`some and any` 节标 **`Level: beginner`**；`both, either and neither` 节逐字 "If we are talking about two people or things, we use the quantifiers both, either and neither"／"None of the supermarkets were open." |
| C-13 | BC `…/indefinite-pronouns` | ✅（WebFetch） | "We use indefinite pronouns to refer to people or things without saying exactly who or what they are."／"We use pronouns ending in -body or -one for people, and pronouns ending in -thing for things"／"We use a singular verb after an indefinite pronoun"／"When we refer back to an indefinite pronoun, we normally use a plural pronoun"／"**We do not use another negative in a clause with nobody, no one or nothing**" |
| C-14 | BC `grammar/a1-a2-grammar` | ✅（WebFetch） | **18 课全目逐条**（见 §1.2）；**无 `way` 专课、无 `none`／`nobody` 专课** |
| C-15 | BC `grammar/b1-b2-grammar` | ⚠️ **WebFetch 两次均只返回 1 个标题**（"Reported speech: statements"）—— **页面疑为 JS 懒加载** | **登记 §8⑩** |

### D. 中文侧（本轮实取，全部含 HTTP 状态）

| # | URL | 状态 | 关键逐字 |
|---|---|---|---|
| Z-1 | `english.cool/quantifiers/` | **200** | 页题「來一次搞懂「數量詞」」；独立小节 `none`："none 為 not one 的合併，表示「一個都不…」"／"none 後面若需要接名詞，就要使用 none of"／"**none 會強調在某個範圍內都不…，no 則沒有限定範圍～**" |
| Z-2 | `english.cool/indefinite-pronouns/` | **200（本轮新发现）** | 页题「英文的「不定代名詞」是什麼？one, another, others 等用法！」；"**none 表示「一個都沒有」**"／"它的意思是「一個都沒有、半個都不剩」，**語氣比 not any 更強烈、更乾脆**"；例 `I opened the cookie jar, but none were left.` |
| Z-3 | `english.cool/among-of-which-one-them/` | **200** | 页题「「其中」英文怎麼說？」；含 `none of them` 逐字用法："要講「其中兩個」、「其中幾個」也是同一套邏輯，換掉前面的數量詞就好，例如：two of them、some of them、**none of them**"；例 `A bunch of my coworkers signed up for the marathon, but none of them actually showed up.` —— **⚠️ 这是中文侧 `none of` 的一处独立出处** |
| Z-4 | `english.cool/{none,no-one,nobody,way,by-the-way,on-the-way,way-usage,some-any,ask-the-way}` | **全 404**（本轮实测） | — |
| Z-5 | `english.cool/all/` | **200 但内容不对** | 页题《【所有國家與首都的英文！】越南/泰國/韓國等英文怎麼說？》—— **国名文，不是量词文**（登记 §8⑨） |
| Z-6 | 中文侧 `way` 专文 | **未找到** | Bing 检索 `site:english.cool way 怎麼走/問路` **无结果**；**登记为缺口** |
| Z-7 | 中文侧 `none of` 对比文 | **检索到但未实取** | 检索结果含《英语 4 个高频易混否定词：none/no one/neither/no 用法全解》（toutiao）／《英语疑难解析：no one, nobody, none的用法区别》（知乎）—— **未实取正文，登记 §8 外** |

### E. 与批二十八台账的差异（研究自我抽检，回应「逐字引用抽检」要求）

| # | 差异 | 处理 |
|---|---|---|
| **1** | **`no one`／`nobody` 真新错条数**：批二十八记 **1 条**（语域）；**本轮复算为 2 条**（语域 ＋ **复数回指用 `they`**，两源逐字） | **§2.5 已按 2 条重写，并在 §2.6 明确「结论不变」（仍 0 课）** |
| **2** | **中文侧覆盖**：批二十八记「`none` 只有 `quantifiers` 页 1 节」；**本轮新增 `indefinite-pronouns` 页 1 节 ＋ `among-of-which-one-them` 页 `none of them` 语法点** | **§1.1 已更新为「2 页各 1 节」＋ §C 表 Z-1/Z-2/Z-3** |
| **3** | **`all-of-most-of-none-of-etc` URL**：前批未记状态；**本轮实测 302 到语法总入口** ⇒ **该 URL 不是真页** | **§C-8 登记**（**避免下批再把它当规则页**） |
| **4** | **`by-the-way`／`in-this-way`／`the-way-that` 三个 slug** | **§C-9 登记为 302**（**批二十五曾把 `both-both-of-…` 的同款现象记为「同页」，本轮沿此口径处理 `way` 系 slug**） |
| **5** | **L151 的 `All of my books are good.` 口径风险** | **§4.2／§8② 新登记**——**这是本轮最重要的「打自己人」发现** |

---

## 结论一句话

**本批建议 1 课：`none`（＋`none of` 作课内必需结构；`no one`／`nobody` 作对照位 0 课）。轴 B `way` 判 B−（课程位三个上游全零 ＋ 页尾自认不全 ＋ 造词 3–5 位 ＋ 仅 2 条硬规则），本批不排期；轴 C `of` 层判 B（BC 逐字标 `Level: intermediate`，且 L151 已立「`all` 直接接」口径），本批不排期。**
**最高优先级发现不是「还能加什么」，而是「不能再加」**：`no one`／`nobody` 被跨源逐字自认同义（"mean the same"）⇒ 封顶 0 课；`way` 与 `of` 层因课程位与学段不符 ⇒ 封顶 0 课。**总计 1 课，与批二十八路线图给出的首选一致，且本轮未发现足以加课的新证据。**
