# 竞品分析：第二十五批选题（L148 起）· 竞析报告

| 字段 | 值 |
|---|---|
| 报告 | 竞品/跨源分析（竞析）· 语法线「小美的一天」第二十五批 |
| 日期 | **2026-09-20** |
| 轮次 | 第二十五批（批二十四 L145–L147 `too`／`either` 交付后） |
| 课号起点 | **L148 起**（现库 **147 课／156 案／season-24**，本轮独立复算） |
| 本轮任务 | 两轴逐候选判档 · **复核批二十四四条押后理由** · **「句尾 though」独立增量专项** · **轴 B 成本变化判定** · 「同义换词 vs 新结构」甄别 · 课量建议 · 两轴对照与推荐 · Non-goals 依据 |
| 上游输入 | `competitive-analysis-grammar-twenty-fourth-batch-2026-09-20.md`（转述级基线）· `roadmap-grammar-twenty-fourth-batch-2026-09-20.md`（含 §1.1 四条裁决理由、§8 开放问题 1）· `roadmap-grammar-twenty-third-batch-2026-09-20.md`（§6.2 候补池） |
| 我方快照（本轮独立复算） | `src/data/grammarLessons.ts`（**147 课**，末课 `number: 147`）· `src/data/huntCases.ts`（**156 案**）· `src/data/grammarSeasons.ts`（**24 季**，末项 `season-24`） |
| 跨源取到情况 | **Cambridge 语法页 12 页 ＋ 词典 CEFR 14 条** · **BC 三档索引 ＋ 参考层 3 页 ＋ 专课 4 页** · **Murphy 双册官方 TOC 本机原件（md5 复算一致）** · **中文侧 english.cool sitemap 871 URL ＋ 10 篇实取** · **Oxford 词典 CEFR 4 条** |
| 口径 | **Murphy 只核 TOC 标题层，单元内部例句未核**（沿批二十三／二十四口径，见 §9） |

---

## §0 本轮结论速览（先读这里）

1. **【本轮最重要发现】「句尾 though」撑不起一课。** 跨源把「句尾 `though`」当作**附注**而非独立语法点：**BC 把它压在一个小节 `though` 之下的最后一句**（逐字 "**Though can also go at the end of the second phrase.**"），**Cambridge 把它压在一个小节 `Though meaning 'however'` 之下的一句话**（逐字 "**we can use though (but not although or even though) with a meaning similar to however or nevertheless. In these cases, we usually put it at the end of a clause**"）。**两个上游都给「一句话 ＋ 2–3 例」，没有任何一家给它独立单元位**——**Murphy 双册 TOC 里的 `though` 全部寄生在 U113 里，没有一格叫「句尾 though」。** → **批二十四主理人的第 ① 条理由（`though` 独立增量只剩句尾）在语义上成立，但结论要反着用：不是「只剩一个增量所以课小」，而是「只剩一个附注所以不成立一课」。**
2. **轴 A 的课量必须从 3 课重算到 2 课。** 批二十四报的是「U113／U114／U115 三格对三课」。**剔掉撑不起来的 `though` 后，U113 剩下的 `even though`／`in spite of`／`despite` 三词与 U115 的 `unless` 是两个逻辑（让步 vs 否定条件），加 U114 `in case` 是第三个**——**但 `in spite of`／`despite` 在 Cambridge 是独立页（`In spite of and despite`）且中文侧有专文**，**这意味着它可以是第 2 课的下半，而不是第 1 课的三分之一**。**净结论：轴 A 是 2 课（不是 3 课），且必须重切。**
3. **轴 B 的成本变化是真实的、且是决定性的。** `either` 已交付（**实测 GL 87 词次，全部落在 L146／L147**），**本轴只剩 `both`＋`neither`（＋构件 `nor`）＝ 2 词必造 ＋ 1 个半构件**。**历史最高是批二十的 3 词**——**2 词位落在上限内，这确实是「可做」与「不可做」的分界。** 但**词位不是唯一门槛**：见 §3。
4. **【新发现】轴 B 的真实风险不是造词成本，是「课程位三格相隔极远 ＋ 其中一格根本不是本轴」。** Murphy 双册归一化 TOC 逐字复算：**初级 U82 `82botheitherneither`（Determiners and pronouns 块）＋ 中级 U89 `89both/bothofneither/neitherofeither/eitherof`（Pronouns and determiners 块）＋ 初级 U42 `42too/eithersoamI/neitherdoIetc.`（Auxiliary verbs 块，U40–U43）**。**三个位置跨两册、跨三个区块**——**这不是「连续课位链」（对照 U113–U115 的零间隔）**。**且 U42 已被批二十四自己判为「另一个话题，不能塞进本轴」——该判定本轮复核成立且证据更硬（Cambridge 把它放在 `So` 页的 `So am I, so do I, Neither do I` 一节，属 `Spoken English`）。**
5. **`both` 与 `neither` 的档位差是三条证据链一致的「三档」。** Cambridge 词典：**`both` = A1**／**`neither` = B2**（`neither ... nor` 亦 B2）；Oxford：**`both` = A1**／**`neither` = A2**；BC 参考层：**两词被压在同一个 beginner 表里**（逐字 "**If we are talking about two people or things, we use the quantifiers both, either and neither**"）。→ **跨源在「该不该同课」上分裂：Cambridge 词典说差三档、BC 说同一格。我方应取「分课」但不必拆到 2 课起步。**
6. **批二十四四条押后理由的复核结论：3 条成立、1 条已失效。** ① `though` 增量薄 → **成立且本轮升级为「不成立一课」**；② `though` 句尾与 `too`／`either` 句尾动作撞 → **成立（且 L145 的 `grammarLabel` 逐字 `也一样 · too 站句尾` 证明句尾位置是本批的主教学动作）**；③ `unless` 第 1 课＝❌will 规则第三次应用 → **成立，实测该规则已在 L48／L142／L143／L144 四处出现，第三次以上的应用已成常态**；④ `in case` 连 `case` 都在库为零 → **成立**（实测 GL `case` 0／HC 仅 1 处且是注释里的英文词 "case 9"，非教学内容）。**失效的是哪条？——没有一条失效，但第 ① 条的「所以押后」被本轮改写为「所以降课量」**；**真正被本轮推翻的是批二十四自己报的「3 课」这个数字**。
7. **推荐：轴 B 优先，但只开 2 课且必须重切。** **B 轴 2 词必造 ＋ 词位在上限内 ＋ 中文侧有独立专文 3 篇（`both`／`neither-nor`／`nor`）＋ `either` 已铺好「两张脸」的对举壳**；**A 轴 2 课但 `in case` 的课量封顶 1 课。** **若主理人要「档位更强的那条」：A 轴（有跨源连续课位链，档位 A）；要「成本更低的那条」：B 轴（2 词位 vs A 轴的 4–5 词位）。两条不能同年连排——见 §6.3。**

---

## §1 逐候选档位判定

### 1.1 轴 A 候选全表

| 候选 | ① 跨源逐字证据 | ② 课程位 | ③ 规则页 | ④ 档位 | ⑤ 理由 |
|---|---|---|---|---|---|
| **`though`（让步连词义）** | **BC `contrasting-ideas-although-despite-others`（B1 Intermediate／B2 Upper intermediate）小节 `though` 逐字**："**Though can be used in the same way as although.**"；**Cambridge `Although or though?` 小节 `Although and though meaning 'in spite of'` 与 `Although and though meaning 'but'`**；**中文侧 `english.cool/although/` 页题逐字「「although」正確用法是？跟 though 一樣嗎？」** | **❌ 无独立课位**（Murphy 双册 TOC：`though` 只作为 U113 标题 `113althoughthougheventhoughinspiteofdespite` 的**并列词之一**，**无单独一格**） | **✅ 有**（Cambridge 专页＋BC 小节＋中文侧专文） | **C** | **上游明说它就是 `although`**（BC 逐字 "in the same way as"）；**我方 L139–L141 已做完 `although` 的完整三课**；**中文侧也把它做成 `although` 专文的补充小节**。→ **纯同义换词，见 §4** |
| **`though`（句尾＝however 义）** | **BC 逐字**："**Though can also go at the end of the second phrase.**"（例 `We waited ages for our food. The waiter was really nice, though.`）；**Cambridge 逐字**："**we can use though (but not although or even though) with a meaning similar to however or nevertheless. In these cases, we usually put it at the end of a clause**"（例 `I don't mind, though.`／`It's nice, though.`）；**BC C1 `contrasting-ideas` 亦有**："**I soon made friends, though.**"；**中文侧 `english.cool/although/` 逐字**："**只有 though 可以放在句尾（這時候會作為副詞），且是很口語的表達方式**" | **❌ 无**（无任何一格） | **✅ 有，但全是「一句话＋例」级别** | **C**（**附注级**） | **两家上游都只给它一句话**；**它不出现在任何 TOC 标题里**；**它是「语用补充」不是「结构」**——**专项见 §2** |
| **`even though`** | **BC 逐字**："**Even though is slightly stronger and more emphatic than although.**"；**Cambridge `Although or though?` 有 `even though` 小节**（`Even though I earn a lot of money every month, I never seem to have any to spare!`）；**Cambridge `Even` 页有独立小节 `Even though and even if`**（并指向独立页 `even-though-and-even-if`），逐字："**even though carries the same meaning as although**"（"in spite of the fact that"）"**gives more emphasis than although**"；**中文侧 `english.cool/even-though/` 页题逐字「Even though 跟 Even if 的用法差在哪？來搞懂！」——是独立专文，且与 `even if` 对举** | **⚠️ 半有**：**Murphy U113 标题内含它**（`113althoughthougheventhoughinspiteofdespite`）；**Cambridge 有独立页 `even-though-and-even-if`**；**但 BC 只给一个小节、无独立课** | **✅ 有**（Cambridge 独立页 ＋ 中文侧独立专文） | **B** | **它比 `though` 强**：**中文侧是独立专文（不是 `although` 的附注），且专文的核心是 `even though` vs `even if` 的分工——这是我方零覆盖的语义对立**。**但课程位是「五词共用一格」（U113），不是单点课位** → **不升 A** |
| **`in spite of`** | **Cambridge 独立页 `In spite of and despite`** 逐字（页题）；**Warning 框逐字**："**We don't use a that-clause after in spite of or despite. We use in spite of the fact that or despite the fact that**"；**另一条警告：`in spite of` 是三词、`despite` 后永不加 `of`**（错例 `… inspite the long queues or … despite of the long queues.`）；**BC 逐字**："**After in spite of and despite, we use a noun, gerund (-ing form of a verb) or a pronoun.**"；**中文侧 `english.cool/although-despite/` 页题逐字「差在哪？Although, though, even though, despite 用法上的差別！」**——**逐字结论："despite 是介系詞 (prep.)，意思為「儘管、雖然」"**；**注意：该页明确说「The page does not mention 'in spite of' anywhere」** | **⚠️ 半有**：**U113 标题含它**；**BC 与 `although` 同课**（section headings 逐字含 `in spite of / despite` 与 `although / even though`）；**无独立课** | **✅ 有**（Cambridge 独立页＋Warning 框＋BC 小节＋中文侧半篇） | **B** | **它的「新」不在词义而在句法：接名词／-ing，不接从句**——**这是我方零覆盖的「连词 vs 介词」分界**。**中文侧逐字把它定性为 prep. 且指出「despite 為介系詞」**——**对零基础是真正的结构新知**。**但两词共享一条规则，且无独立课程位** |
| **`despite`** | 同 `in spite of`（**同一页**）；**Cambridge 词典 CEFR = B1**（"despite" preposition）；**中文侧 `english.cool/despite/` 是独立专文**（页题逐字「「despite」正確用法是？來看例句一次搞懂！」），**逐字**："**despite 可以放在句首或句中，與同義詞 in spite of 可以互相抽換**" | **⚠️ 半有**（同 `in spite of`，U113 标题内） | **✅ 有** | **B** | **与 `in spite of` 是「同一条规则的两个拼法」**（中文侧逐字「可以互相抽換」）——**必须同课，不能各开一课** |
| **`unless`** | **Cambridge 独立页 `Unless`**，**小节逐字**：`Unless`／`Unless and if … not`／`Typical errors`；**typical errors 两条逐字**："**We don't use unless when we mean if**" ＋ "**We don't use will or would in the clause after unless**"；**例句** `Unless it rains, we'll go for a picnic by the river tomorrow.`／`They won't come unless you invite them.`；**Cambridge 词典 CEFR = B1**（"except if"）；**BC 逐字**："**It is also common to use this structure with unless, as long as, as soon as or in case instead of if.**"（**在 `conditionals-zero-first-second` 的 First conditional 节内，无独立小节**）；**中文侧 `english.cool/unless/` 独立专文**，**页题逐字「「Unless」正確用法是？ 可以用在疑問句嗎？」**，**逐字结论**："**Unless 後面一定是肯定句，否則會出現「雙重否定」的問題**"／"**unless 不能出現在疑問句中**"／"**unless後的副詞子句即使是在描述未來的事，也不能加will喔❌**"；**三条 ❌ 逐字**：`Unless the weather will get better, the soccer game will be cancelled. ❌`／`Unless we will come up with a better plan, they will work with another company. ❌`／`What will you do unless you get the loan? ❌` | **✅ 有**：**Murphy 中级 U115 标题逐字 `115unlessaslongasprovided`**（**但与 `as long as`／`provided` 共用一格**） | **✅ 有**（Cambridge 独立页＋typical errors＋中文侧独立专文＋BC 点名） | **A−** | **列出的四条证据里最厚的一条**：**独立规则页 ＋ 独立中文专文 ＋ 独立 typical errors 两条 ＋ 上游单元位**。**不写满 A 的理由只有一条：课程位是三词共用（U115），不是我方意义的单点课位**。**但 `as long as`／`provided` 我方也全零（实测 `as long as` GL 0／`provided` GL 0）——这既是成本也是「上游把三者当一体」的证据** |
| **`in case`** | **Cambridge 独立页 `In case (of)`**，**逐字定义**："**In case is a conjunction or adverb. In case of is a preposition.**"；**核心禁忌逐字**："**We don't use in case to mean 'if'.**"；**对举例**：`Let's take our swimming costumes in case there's a pool at the hotel.`（不知道有没有）vs `Let's take our swimming costumes if there's a pool in the hotel.`（知道了才带）；**Cambridge 词典 `case` 词条**：**`(just) in case` = B1**／**`in that case` = B2**／**`in any case` = B2**；**BC 逐字**："**It is also common to use this structure with unless, as long as, as soon as or in case instead of if.**"＋例 `I'll give you a key in case I'm not at home.`（**无独立小节**）；**中文侧 `english.cool/in-case/` 本轮实测 HTTP 404**；**中文侧 sitemap 871 URL 中 `in-case` slug 0 命中**；**中文侧从属连词总表（`english.cool/conjunctions/`）逐字**："**條件關係：if, unless, as long as**"——**不收 `in case`** | **⚠️ 半有**：**Murphy 中级 U114 标题逐字 `114incase`——独占一格**（**这是全批最干净的课程位之一**） | **✅ 有**（Cambridge 独立页） | **B＋** | **课程位是本批最干净的一个**（U114 独占单元，前后零间隔），**但中文侧实证为零**（专文 404 ＋ 总表不收）→ **这与批二十四判它 A 档的口径冲突**。**本轮修正：课程位强 ≠ 档位 A，A 档还要求「我方有缺口」之外的教学可用性**；**中文侧零实证意味着「零基础讲解的脚手架要全自造」**。→ **B＋（比 `unless` 低半档，比 `even though` 高半档）** |

**轴 A 档位排序（强→弱）**：`unless`（A−）＞ `in case`（B＋）＞ `even though`（B）＝ `in spite of` ＝ `despite`（B）＞ `though` 让步义（C）＝ `though` 句尾义（C）。

### 1.2 轴 B 候选全表

| 候选 | ① 跨源逐字证据 | ② 课程位 | ③ 规则页 | ④ 档位 | ⑤ 理由 |
|---|---|---|---|---|---|
| **`both`** | **Cambridge 语法页 `Both`**（面包屑逐字 `Grammar > Nouns, pronouns and determiners > Quantifiers > Both`），**10 个小节逐字**：`Both with nouns`／`Both with pronouns`／`Pronoun + both`／`Both of + object pronoun`／`Both as a pronoun`／`Both: position`／`Both in short answers`／`Both of or neither of in negative clauses`／`Both … and as a linking expression`／`Both: typical errors`；**typical errors 逐字**："**We don't use both with a negative verb; we use either instead**" ＋ "**When we use the verb be as a main verb, both comes after the verb**"；**negative clause 小节逐字**："**We usually use neither of rather than both of … not in negative clauses**"；**position 小节逐字**："**If both refers to the subject of a clause, we can use it in the normal mid position**"（例 `They both wanted to sell the house.`）；**short answers 逐字**："**We use both on its own in short answers**"；**CEFR：Cambridge 词典 `both` = A1**（"predeterminer, determiner, pronoun"，"（referring to） two people or things together"）／**Oxford `both` = A1**；**Murphy 双册**：**初级 U82 标题逐字 `82botheitherneither`**（前接 U81 `allmostsomeanyno/none`，后接 U83 `alotmuchmany`）＋**中级 U89 标题逐字 `89both/bothofneither/neitherofeither/eitherof`**（前接 U88 `all/allofmost/mostofno/noneofetc.`，后接 U90 `alleverywhole`）；**中文侧 `english.cool/both/` 独立专文**，**6 个小节逐字**：`both A and B`／`both + 複數名詞`／`both of 的用法`／`both of + 複數代名詞`／`代名詞（Pronoun）`／`注意：both 不可用於否定句中`；**9 条 ❌ 逐字**（含 `Both them enjoy hiking. ❌`／`Both of them didn't win the prize. ❌`／`Both we prefer pop music. ❌`／`My mom asked both us to clean our rooms. ❌`）；**BC 参考层 `quantifiers`** 小节逐字 `both, either and neither`："**If we are talking about two people or things, we use the quantifiers both, either and neither**"（Level: beginner）；**BC 三档 68 课全目零专课**（A1-A2 18 课／B1-B2 36 课／C1 14 课，本轮逐条复点） | **✅ 有，但共用**：**初级 U82（三词一格）＋ 中级 U89（六词一格）** | **✅ 有**（Cambridge 专页 10 小节＋中文侧独立专文 9 条 ❌＋BC 参考层） | **B＋** | **规则页是本轮全部候选里最厚的**（Cambridge 一节 10 个小节，比 `unless` 的 3 节还多）；**中文侧 9 条 ❌ 是全部候选中最多**；**但课程位是「三词／六词共用一格」**——**不升 A**。**CEFR A1 使它对零基础完全友好** |
| **`neither`** | **Cambridge 语法页 `Neither, neither … nor and not … either`**（面包屑逐字 `Grammar > Words, sentences and clauses > Negation > Negation > …`），**6 个小节逐字**：`Neither as a determiner`／`Neither … nor`／`Not with neither and nor`／`Neither do I, Nor can she`／`Not … either`／`Neither: typical errors`；**typical errors 逐字**：用 `neither, not none` 指两件事、避免 `both (of) + not`、拼写；**例**：`Neither parent came to meet the teacher.`／`Neither of us went to the concert.`／`Neither Brian nor his wife mentioned anything about moving house.`／`Neither can I.`／`Nor does Gina.`／`Me neither.`；**CEFR：Cambridge 词典 `neither` = B2**（"determiner, pronoun, conjunction, adverb"），**`neither ... nor` 亦 B2**／**Oxford `neither` = A2**；**Murphy**：**初级 U82**（含 `neither`）＋**中级 U89**（含 `neither of`）＋**初级 U42 标题逐字 `42too/eithersoamI/neitherdoIetc.`**；**中文侧 `english.cool/neither-nor/` 独立专文**（页题逐字「「neither.. nor..」的正確用法是？跟 either or 差在哪？」），**逐字规则**："**動詞必須隨 nor 之後的 B 做單複數變化**"（就近原则）＋"**後面需使用倒裝，將主詞與動詞倒過來**"；**两条 ❌ 逐字**（`They aren't going to neither travel nor go on vacation.`／`She can't neither talk nor walk.`，均标「語意錯誤」）；**BC 参考层 `quantifiers` 同一小节**（逐字 `both, either and neither`）；**BC 三档 68 课全目零专课** | **✅ 有，但共用**（同 `both`） | **✅ 有**（Cambridge 专页 6 小节＋中文侧独立专文） | **B** | **比 `both` 低一档的理由有两条**：**① CEFR 分裂**——**Cambridge 标 B2／Oxford 标 A2，跨两源差两档，比我方现教段位（B1 段）高一档**；**② 半轴已被批二十四消耗**——**批二十四已交付 `either`（实测 GL 87 词次，全在 L146／L147）**，`neither` 与它构成同一对举轴（Cambridge 把 `neither` 放在 `Negation` 大类下，与 `not … either` 同页），**`neither` 的第 1 课有极大概率变成「`either` 的第二次应用」** |
| **`nor`** | **Cambridge 语法页**：`nor` **不作为独立页存在**，只作为 `Neither, neither … nor and not … either` 页里的 `Neither … nor` 节＋`Neither do I, Nor can she` 节出现；**逐字**（经 WebFetch 转述）：**"It is used as a conjunction with 'neither,' connecting 'two or more negative alternatives,' and can sound formal. After a negative clause, subject and verb invert: 'nor did we see the cathedral.'"**；**Cambridge 词典 `nor` = B2**（"mainly UK neither"）；**BC 三档 68 课全目零专课**；**Murphy 双册 TOC `nor` = 0**（**两个归一化件均实测 0 命中**——**注意：TOC 标题层的 `nor` 全 0，但 `neither` 的标题里没带 `nor`**）；**中文侧 `english.cool/nor/` 独立专文**，**页题逐字「「nor」正確用法是？來學 nor 的各種用法！」**，**5 个小节逐字**：`nor 用來連接兩個句子`／`nor 和 neither 連用`／`nor 用於附和`／`補充 1：neither here nor there`／`補充 2：什麼時候不能用 nor？`；**逐字**："**nor 是對等連接詞（FANBOYS 之一），所以從句可以獨立成句**"（`She didn't stay at home. Nor did she go to school.`）；**两条 ❌ 逐字**：`I don't want to eat rice nor noodles. ❌`／`The cat isn't under the table nor in the closet. ❌`（逐字解释："**當 not 否定多個項目時，要用 or 而不是 nor**"）；**注意：中文侧这一篇是本轮唯一专门解释「什么时候不能用 nor」的页面** | **❌ 无独立课位**（Murphy 双册 0；BC 三档 0；无剑桥独立页） | **⚠️ 半有**：**无独立规则页**，只有 `neither` 页里的两个小节＋一篇中文侧独立专文 | **C＋** | **它是「构件」不是「话题」**：**Cambridge 把它挂在 `neither` 页下**；**Murphy TOC 全 0**；**但中文侧有独立专文且核心是「误用禁区」**（❌ 用 `nor` 连接 `not` 否定项）——**这是真知识点，但撑不住课**。→ **只在 `neither` 课内带一笔，不单开** |
| **倒装应答 `so am I`／`neither do I`** | **Murphy 初级 U42 标题逐字 `42too/eithersoamI/neitherdoIetc.`**——**它在 `Auxiliary verbs` 块（U40–U43，逐字 `40Iam,Idon’tetc.`／`41Haveyou?Areyou?Don’tyou?etc.`／`42too/eithersoamI/neitherdoIetc.`／`43isn’t,haven’t,don’tetc.`）**，**与 U82（Determiners and pronouns 块）相隔 40 个单元**；**Cambridge 侧**：**无独立页**——**它在 `So` 页的 `So am I, so do I, Neither do I` 节内**（**面包屑逐字 `Grammar > Using English > Spoken English > So`**），**逐字**："**We also use not … either, nor or neither when we want to give a negative meaning**"（例 `Nor/Neither do I.`）；**中文侧 `either-neither` 专文逐字**："**neither 當副詞（也不）：以倒裝句的形式獨立成一個句子**"；**BC 三档 68 课全目零专课** | **✅ 有，但属另一话题**（**初级 U42 是独立单元**） | **✅ 有（但在 `So` 页内，不独立）** | **C（对本轴）／独立候选待评估** | **批二十四判「不属本轴」本轮复核成立，且证据升级**：**Cambridge 把它归在 `Spoken English > So`，即「口语中的 so 用法之一」，不是限定词话题**；**Murphy 把它放在 Auxiliary verbs 块，与限定词块相隔 40 格**。→ **它是独立句法话题，不得塞进 `both`／`neither` 课** |

---

## §2 轴 A 专项：「句尾 though」的独立增量够不够撑一课？

### 2.1 结论：**撑不起。它是附注，不是语法点。**

### 2.2 跨源逐字证据（三家一致地把「句尾」做成一句话）

| 源 | 层级位置 | 逐字 |
|---|---|---|
| **BC `contrasting-ideas-although-despite-others`（B1–B2）** | **`though` 小节的最后一句** | "**Though can also go at the end of the second phrase.**" ＋ "**This way of expressing contrasting ideas is most common in spoken English.**" ＋ 例 `We waited ages for our food. The waiter was really nice, though.` |
| **Cambridge `Although or though?`** | **`Though meaning 'however'` 小节**（页题 7 个小节中的第 6 个） | "**we can use though (but not although or even though) with a meaning similar to however or nevertheless. In these cases, we usually put it at the end of a clause**" ＋ 例 `I don't mind, though. I have lots of work to do. I'll just bring my laptop with me.`／`It's nice, though.` |
| **BC C1 `contrasting-ideas`** | **`Although, though and even though` 小节内的一个例子** | "**I soon made friends, though.**" ＋ "**He's really busy. He still offered to help, though.**" |
| **中文侧 `english.cool/although/`** | **补充 #1（`although` 和 `though` 用法一樣嗎？）的一句话** | "**只有 though 可以放在句尾（這時候會作為副詞），且是很口語的表達方式**" |
| **Murphy 双册 TOC** | **零**（`though` 只出现在 U113 标题中，**TOC 里没有任何一格与「句尾」有关**） | — |

### 2.3 为什么它撑不起一课（四条硬理由）

**① 上游没有任何一家给它独立单元位。** 这是最硬的一条。**Murphy 双册 TOC、BC 三档 68 课全目、Cambridge 语法页的 7 个小节标题——三个通道全部为零。** 对照本轮 A− 档的 `unless`：**Murphy U115 独家单元 ＋ Cambridge 独立页 3 小节 ＋ 中文侧独立专文**。**同一个标准下，`though` 句尾的「单位」是「一句话」。**

**② 它不是一个「结构」，是一个「语用变体」。** BC 自己定性：**"most common in spoken English"**；中文侧定性：**"很口語的表達方式"**。**它不产生新的句法位置规律——它只是把同一个 `though` 移到句尾并改变语义（让步 → 转折/补充）**。**我方现行 147 课的教学单位是「结构」（每课一个 `grammarLabel` 讲位置／形态分工）**——**对照本轮实测：147 课的 `grammarLabel` 里含「站」「中间」「后面」「前面」等位置词的，全部都在教「某个成分站哪儿」的**结构**；而「句尾 though」教的是「同一个词换个位置就换个意思」，**这更像 L66／L145 那种「同一个词两张脸」的**一词两义**课，而不是连词课。**

**③ 6 条对比卡凑不满（这是最致命的一条）。** 我方 147 课**全部**是 6 条 `contrast`（本轮实测：**contrast 项数分布 = `{6: 147}`，无一例外**）。6 条从哪来？（本轮实测：`guided` 项数分布 = `{6: 146, 5: 1}`；`practice` 项数分布 = `{4: 108, 5: 37, 6: 2}`）
- 能想的错项只有：`*It's nice though.`（逗号，零基础不教标点）／`*Though it's nice.`（位置）／`*It's nice. Though.`（断句）——**三条以内，且后两条是我方从未作为考点出现过的「标点／断句」维度**。
- 剩下的只能靠「对上位旧课（L139–L141 `although`／`but`）的复现卡」**和**「都是对的」卡（`bothRight`）**凑数——**本轮实测 L145 的 6 条里有 3 条是 `bothRight`（复现 L43／L51／L66）**。**但那是「立岗课」的配置，不是「附注课」的配置**：L145 的 3 条复现卡**每一条都在给 `too` 的一个新用法发身份**（L43 句尾／L51 被动句／L66 两个 too 的分身）。**「句尾 though」能复现什么？只有 L139–L141 的三课，而那三课教的是 `although`，不是 `though`。**

**④ 它撞批二十四的「句尾」动作撞得很实。** 本轮实测：**L145 的 `grammarLabel` 逐字 `也一样 · too 站句尾`**；**L146 的 6 条对比卡里有 2 条明说「照样站句尾，不站中间」**（逐字 `它不光要换词，位置也不变——照样站句尾，不站中间。`／`「也」不站中间。中文说「我也喜欢茶」，那个「也」在中间，英语的 too 要走到句尾。`）。**「句尾」这件事刚刚被连讲两课，紧接着再讲一个「句尾 though」，教学动作是同一个（「这个词要走到句子尾巴上」），只是换了个词。→ 这是 §4 甄别红线里的「同一动作换词」。**

### 2.4 那么轴 A 的课量怎么重算？

**批二十四的报法是「U113 → 第 1 课、U114 → 第 2 课、U115 → 第 3 课」。剔掉 `though` 后：**

| 原报 | 本轮修正 | 理由 |
|---|---|---|
| 第 1 课 = U113（`although`／`though`／`even though`／`in spite of`／`despite`） | **改为「`even though` ＋ `in spite of`／`despite`」一课**（`though` 剔出、`although` 已消耗） | **`although` 已被 L139–L141 拿走**（**本轮复算 `although` GL 174 词次，全在 L139–L141 及案件**）；**`though` 撑不起**（§2.3）；**剩下三词正好是一课的量**：`even though`（vs `although` 的强度差）＋ `in spite of`／`despite`（接名词/-ing 的句法差）。**这也正对上 BC 那节课的小节结构**（逐字 section headings 含 `in spite of / despite` 与 `although / even though`，**是两个小节**，不是五个）。 |
| 第 2 课 = U114（`in case`） | **保留 1 课，但封顶 1 课** | **U114 独占单元是本批最干净课程位**；**但中文侧实证为零（专文 404 ＋ 总表不收）**——**这既不构成「不能做」，也构成「不能多做」（第 2 课没有增量可分）。** |
| 第 3 课 = U115（`unless`／`as long as`／`provided`） | **保留 1 课，但主词改为 `unless` 单点** | **`as long as` GL 0／`provided` GL 0**（本轮实测）——**若三词同课，词位 = 3，触顶但可行**；**但 `unless` 的独立证据（Cambridge 独立页＋typical errors 两条＋中文侧独立专文）远厚于另两词（`provided` 跨源无独立规则页、`as long as` 本轮在 BC 只是列举）**——**建议：`unless` 立岗课，另两词作认读带入（`as long as` 至少有中文侧专文；`provided` 建议只作认读，不设考点）。** |
| **合计 3 课** | **合计 2 课（可勉强 3 课）** | **2 课是「让步一课 ＋ 条件一课」；第 3 课若存在，只能是「`unless` 与 `in case` 的两张脸」（条件的两条路：否定条件 vs 预防条件）——但这已经是「收口课」，按我方 147 课的先例（11 次收口课，逐字 `收口 · 零新知`），收口课必须由前两课已立岗的内容构成。**→ **2 课为主、3 课为上限。** |

---

## §3 轴 B 专项：`both`／`neither` 的课程位与轴长

### 3.1 `both` 单独：课程位情况

| 源 | 逐字 | 判读 |
|---|---|---|
| **Murphy 初级 U82** | 标题归一化逐字 `82botheitherneither`（前接 U81 `allmostsomeanyno/none`，后接 U83 `alotmuchmany`） | **有课程位，但三词共用一格** |
| **Murphy 中级 U89** | 标题归一化逐字 `89both/bothofneither/neitherofeither/eitherof`（前接 U88 `all/allofmost/mostofno/noneofetc.`，后接 U90 `alleverywhole`） | **有课程位，但六词共用一格** |
| **BC 三档 68 课全目** | **零专课**（A1-A2 18 课逐条点完：`Adjectives and prepositions`／`Adjectives ending in '-ed' and '-ing'`／`Articles: 'a', 'an', 'the'`／`Articles: 'the' or no article`／`Comparative adjectives`／`Infinitive of purpose`／`Nouns: countable and uncountable`／`Past continuous and past simple`／`Possessive 's`／`Prepositions of place`／`Prepositions of time`／`Present simple`／`Present simple: 'have got'`／`Present simple: 'to be'`／`Quantifiers: 'few', 'a few', 'little' and 'a bit of'`／`Question forms`／`Using 'there is' and 'there are'`／`Verbs followed by '-ing' or infinitive`——**无 `both`**） | **BC 侧无课程位** |
| **BC 参考层 `quantifiers`（Level: beginner）** | 小节逐字 `both, either and neither`："**If we are talking about two people or things, we use the quantifiers both, either and neither**"；另 `Members of groups` 节逐字 `Both (of) the chairs in my office are broken.`／"**with all and both, we don't need to use of**" | **有规则页，三词同表** |
| **Cambridge 语法页 `Both`** | **10 小节**（含 `Both: position`／`Both in short answers`／`Both of or neither of in negative clauses`／`Both: typical errors`） | **规则页很厚** |
| **中文侧 `english.cool/both/`** | 独立专文，**6 小节 ＋ 9 条 ❌** | **中文侧独立专文** |
| **CEFR** | Cambridge **A1** ／ Oxford **A1** | **两源一致 A1** |

**判定**：**`both` = B＋ 档**。**规则页最厚（Cambridge 10 小节 ＋ 中文 9 条 ❌）、CEFR 最低（A1，两源一致）——这两条都是「可做」的强信号**；**唯一短板是课程位共用**（U82／U89 都是多词一格，BC 零专课）。

### 3.2 `neither` 单独：课程位情况

| 源 | 逐字 | 判读 |
|---|---|---|
| **Murphy 初级 U82／中级 U89** | 含 `neither`（同 `both`） | **课程位与 `both` 绑定** |
| **Murphy 初级 U42** | 标题逐字 `42too/eithersoamI/neitherdoIetc.` | **另一话题（倒装应答）** |
| **BC 三档 68 课全目** | **零专课** | **BC 侧无课程位** |
| **BC 参考层 `quantifiers`** | 同小节 `both, either and neither` | **规则页在，但是共表** |
| **Cambridge 语法页** | **`Neither, neither … nor and not … either`**，**6 小节 ＋ `Neither: typical errors`**；**面包屑在 `Negation > Negation` 下** | **规则页厚，但归在「否定」大类——与 `both` 归在「数量词」大类不同** |
| **中文侧** | **两篇**：`english.cool/neither-nor/`（页题「「neither.. nor..」的正確用法是？跟 either or 差在哪？」）＋ `english.cool/either-neither/`（页题「「either」和「neither」正確用法是？來看例句搞懂！」） | **中文侧独立专文，且 `either`／`neither` 常同篇** |
| **CEFR** | Cambridge **B2** ／ Oxford **A2** | **两源分裂两档** |

**判定**：**`neither` = B 档**，低于 `both` 半档到一档。**理由①：CEFR 分裂（B2 vs A2），比我方现教段位高一档；理由②：它与已交付的 `either` 同轴**——**批二十四实测 `either` GL 87 词次全部落在 L146／L147**，**`neither` 极易变成「`either` 课的第三次应用」。**

### 3.3 倒装应答 `so am I`／`neither do I`：独立单元，不得塞进本轴

**本轮复核结论：批二十四判定成立，且证据更强。**

| 源 | 逐字 | 判读 |
|---|---|---|
| **Murphy 初级 U42** | 标题归一化逐字 `42too/eithersoamI/neitherdoIetc.`；**块头逐字 `Auxiliaryverbs`（U40–U43）**；**同块三格**：`40Iam,Idon’tetc.`／`41Haveyou?Areyou?Don’tyou?etc.`／`42too/eithersoamI/neitherdoIetc.`／`43isn’t,haven’t,don’tetc.` | **是独立单元，且属「助动词」块——与限定词块（U82）相隔 40 格** |
| **Murphy 中级 U89** | 标题逐字 `89both/bothofneither/neitherofeither/eitherof`——**不含 `so am I`／`neither do I`** | **中级册的 `neither` 课不含倒装应答** |
| **Cambridge** | **无独立页**；在 `So` 页的 `So am I, so do I, Neither do I` 小节内；**面包屑逐字 `Grammar > Using English > Spoken English > So`**；逐字（转述）：**"We also use not … either, nor or neither when we want to give a negative meaning"**（例 `Nor/Neither do I.`） | **Cambridge 把它当「口语中的 so 用法之一」，连独立页都不给** |
| **BC 三档 68 课全目** | **零专课** | **BC 侧无课程位** |
| **BC C1 `emphasis-cleft-sentences-inversion-auxiliaries`** | **`C1 Advanced`**；小节逐字 `Cleft sentences`／`Cleft sentences beginning with it`／`Cleft sentences beginning with what`／`Inversion with negative adverbials`／`Little, no sooner and not`／`Emphatic auxiliaries`——**本轮逐字核过，全页无 `so do I`／`neither do I`／`nor do I`** | **BC 侧也不给（C1 的倒装课都不含它）** |
| **我方数据** | **`so am I` GL 0／`neither do I` GL 0／`nor` GL 0**（本轮 python 词边界复算） | **三个真零** |

**判定**：**它是独立句法话题（倒装 ＋ 简短应答），属 `Auxiliary verbs`／`Spoken English` 语义场，不属限定词话题。→ 不进本轴，须单独立项评估。**

### 3.4 关键问题：`both`／`neither` 能不能撑 2–3 课而不重复？

**用「我方已有 `either` 的经验」做标尺**（批二十四 L146 的 `either` 课）：

| 轴 | 可分的课 | 增量来源 | 判断 |
|---|---|---|---|
| **`both` 的「位置」轴** | **第 1 课** | **`Both: position` 小节**（逐字 "**If both refers to the subject of a clause, we can use it in the normal mid position**"；例 `They both wanted to sell the house.`／`They had both been refused entry to the nightclub.`／`They were both very nice, kind and beautiful.`）＋ **typical errors 逐字** "**When we use the verb be as a main verb, both comes after the verb**" | **✅ 可开**：**这是新的句法位置规律**（`both` 跟 be 动词后、跟助动词后、跟实义动词前），**与我方 L145／L146 的「句尾」动作方向相反（一个往后、一个往中间插）** |
| **`both` 的「否定」轴** | **第 2 课（或并入 `neither` 课）** | **Cambridge 逐字**："**We don't use both with a negative verb; we use either instead**" ＋ "**We usually use neither of rather than both of … not in negative clauses**"；**中文侧 `both` 专文整节逐字** `注意：both 不可用於否定句中` ＋ **3 条 ❌**（`Both of them didn't win the prize. ❌`／`Both of them aren't ready. ❌`／`Both my sister and your brother aren't going to the party. ❌`） | **⚠️ 这条与已交付的 `either` 课高度重合**：**L146 的核心就是「有『不』就换词」（`too`→`either`）**；**`both` 的否定禁忌是「同一条规矩第四次应用」**（❌will 规则已用三次、too→either 是第四次）——**封顶，只能作第 1 课的一个考点，不能独立成课** |
| **`both … and` 的「连接」轴** | **可并入第 1 课** | **Cambridge 小节 `Both … and as a linking expression`**（例 `Both Britain and France agree on the treaty.`／`She played both hockey and basketball when she was a student.`）；**中文侧第 1 节逐字** `both A and B`＋"**當 both A and B 作為主詞連接兩個名詞的時候，動詞必需為複數。**" | **⚠️ 与 L19／L20（`and`／`but`／`because`／`so`）是同一语义场**——**它带来一条新规则（动词复数），但不足以单独成课** |
| **`neither` 的「`neither … nor`」轴** | **第 2 课主词** | **Cambridge 小节 `Neither … nor`**（例 `Neither Brian nor his wife mentioned anything about moving house.`）；**中文侧 `neither-nor` 专文逐字**："**動詞必須隨 nor 之後的 B 做單複數變化。**"（就近原则）＋"**句中前後的 A 和 B 兩個項目在文法上必須對等**"；**两条 ❌ 逐字**（`They aren't going to neither travel nor go on vacation.`／`She can't neither talk nor walk.`，均标「語意錯誤」） | **✅ 可开**：**「就近原则」是新规则**（我方零覆盖）——**但这条规则在零术语条件下极难讲**（**需要「单复数」概念的完整铺垫，我方 L25 已教三单，勉强可用**） |
| **`neither` 的「倒装应答」轴** | **❌ 不得开** | 见 §3.3 | **另一话题** |
| **`nor` 的「误用禁区」轴** | **❌ 不得单开** | **中文侧 `nor` 专文两条 ❌ 逐字**（`I don't want to eat rice nor noodles. ❌`／`The cat isn't under the table nor in the closet. ❌`）；**Murphy 双册 TOC `nor` = 0**；**Cambridge 无独立页** | **它是构件，且其「禁区」是 `not … or` 的正误判断——撑不起课** |

**判定**：
- **`both` 可开 1 课（位置轴），第 2 课无独立增量**（否定轴＝`either` 规矩第四次应用、连接轴＝`and` 语义场）。
- **`neither` 可开 1 课（`neither … nor` 轴）**，**但第 2 课会立刻变成「`either` 的第三次应用」**。
- **合轴长度：2 课（`both` 一课 ＋ `neither`／`nor` 一课），3 课为上限且第 3 课必须是收口课。**

---

## §4 「同义换词 vs 新结构」甄别

> **判定标准**（沿批二十四红线）：若候选**只是已教内容的另一种说法**（同义、同句法、只换词），**课量必须封顶甚至不排期**。
> **已教同类内容基线（本轮实测）**：`although`（GL 174，L139–L141）· `but`／`and`／`because`／`so`（L19／L20）· `as soon as`／`when`（L142–L144）· `too`（GL 301 词次，L145–L147）· `either`（GL 87 词次，L146–L147）· `if`／`will`（L48／L12）· `between`（L81）

| 候选 | 判定 | 跨源逐字依据 | 课量含义 |
|---|---|---|---|
| **`though`（让步义）** | **🔴 纯同义换词（本轮最明确）** | **BC 逐字**："**Though can be used in the same way as although.**"；**Cambridge 把它与 `although` 做成同一页的两个小节**（`Although and though meaning 'in spite of'`／`… meaning 'but'`）；**中文侧页题逐字「跟 though 一樣嗎？」**——**即中文侧的主题就是「两词是不是一样」** | **0 课（不排期）** |
| **`though`（句尾义）** | **🔴 同义换词 ＋ 附注级**（见 §2） | 见 §2.2（五条逐字） | **0 课** |
| **`even though`** | **🟡 半新结构（划得来）** | **① 上游明确定性强弱**：BC 逐字 "**Even though is slightly stronger and more emphatic than although.**"／Cambridge 逐字 "**gives more emphasis than although**"；**② 中文侧是独立专文且核心是 `even though` vs `even if` 的对举**（页题逐字「Even though 跟 Even if 的用法差在哪？」）；**③ 中文侧两条 ❌ 是真新错型**：`I wouldn't date Sam even he were handsome and muscular. ❌`／`Even I've polished and cleaned the vase, it still looks old. ❌`——**逐字解释**："**even 單獨出現的時候，不具有連接詞的功能，也沒有雖然或儘管的意思，所以是不行的喔！**" | **可开（与 `in spite of`／`despite` 同课，占 1/2 课）** |
| **`in spite of`／`despite`** | **🟢 新结构**（连词 vs 介词的分界） | **Cambridge `In spite of and despite` 页 Warning 框逐字**："**We don't use a that-clause after in spite of or despite. We use in spite of the fact that or despite the fact that**"；**BC 逐字**："**After in spite of and despite, we use a noun, gerund (-ing form of a verb) or a pronoun.**"；**中文侧 `although-despite` 页逐字结论**："**despite 是介系詞 (prep.)，意思為「儘管、雖然」**"＋"**despite 是無法直接加上子句的，必須先加上 the fact that 再接子句。**"；**我方零覆盖**：**实测 GL `in spite of` 0／`despite` 0／`spite` 0／`provided` 0** | **可开（1/2 课）** |
| **`unless`** | **🟢 新结构（本轮最纯之一）** | **Cambridge `Unless` 页有 `Unless and if … not` 专节**＋**typical errors 两条逐字**："**We don't use unless when we mean if**"／"**We don't use will or would in the clause after unless**"；**中文侧 `unless` 专文逐字**："**Unless 後面一定是肯定句，否則會出現「雙重否定」的問題**"＋"**unless 不能出現在疑問句中**"＋**三条 ❌ 逐字**（含 `What will you do unless you get the loan? ❌`） | **可开，1 课** |
| **`in case`** | **🟢 新结构（语义对立最干净）** | **Cambridge 逐字**："**We don't use in case to mean 'if'.**"＋**对举例**（`in case there's a pool` = 不知道有没有／`if there's a pool` = 知道了才带）——**「先做准备」vs「条件成立才做」是我方零覆盖的语义对立**；**但中文侧实证为零（专文 404 ＋ 总表逐字 `條件關係：if, unless, as long as` 不收它）** | **1 课封顶** |
| **`both`** | **🟢 新结构** | **Cambridge `Both: position` 逐字**："**If both refers to the subject of a clause, we can use it in the normal mid position**"（例 `They both wanted to sell the house.`）＋**typical errors 逐字**："**When we use the verb be as a main verb, both comes after the verb**"——**「both 站哪儿」是我方从未涉及的句法位**；**中文侧 9 条 ❌ 逐字（含 `Both them enjoy hiking. ❌`／`My mom asked both us to clean our rooms. ❌`）全部是纯新错误类型** | **可开，1 课（上限）** |
| **`neither`** | **🟡 半新结构（有「`either` 影子」）** | **Cambridge 逐字**："**Neither … nor**"节＋**中文侧逐字**："**動詞必須隨 nor 之後的 B 做單複數變化。**"（就近原则）——**这是新规则**；**但 `neither` 的另一半（`neither of` 否定）与已交付的 `either` 是同一对举轴**（Cambridge 把二者放同一页 `… and not … either`） | **可开，1 课（上限）** |
| **`nor`** | **🔴 构件，不表意** | **Cambridge 无独立页**（只作 `neither` 页的两个小节）；**Murphy 双册 TOC = 0**；**中文侧专文的两条 ❌ 全是「什么时候不能用」** | **不单开** |
| **倒装应答 `so am I`／`neither do I`** | **🟢 新结构，但不属本轴** | **Murphy 初级 U42 独立单元**；**Cambridge 归于 `Spoken English > So`**；**我方三个真零**（`so am I`／`neither do I`／`nor` 全 0） | **另案立项（0 课，本轴内）** |

---

## §5 课量建议

### 5.1 轴 A

| 候选 | 建议课量 | 为什么不能更多 |
|---|---|---|
| **`even though`** | **1/2 课**（与 `in spite of`／`despite` 合课） | **它与 `although` 的差异只有「强度」一条**（BC 逐字 "slightly stronger and more emphatic"）——**第 2 课没有增量可分** |
| **`in spite of`／`despite`** | **1/2 课** | **两词是「同一条规则的两个拼法」**（中文侧逐字「可以互相抽換」）；**分开开课＝同一规则讲两遍** |
| **`unless`** | **1 课** | **第 2 课只能是「`unless` vs `if not` 的等价/不等价」**（Cambridge 已有专节 `Unless and if … not`）——**但这一节与我方 L48 的 `if` 课重叠，且中文侧已把结论压成两句话（「可以看成 If not」＋「不能用于疑问句」）**。→ **1 课封顶，`as long as` 认读带入、`provided` 只作认读** |
| **`in case`** | **1 课（封顶）** | **中文侧实证为零**（专文 404、总表不收）——**第 2 课的脚手架要 100% 自造，且「预防」这个语义与我方 D 档的 `in case of`（介词）会立刻分裂** |
| **`though`（两义）** | **0 课** | **见 §2；让步义是纯同义换词、句尾义是附注** |
| **`although`（补课）** | **0 课** | **L139–L141 已完整做完三课，且 L141 的 `grammarLabel` 逐字 `收口 · 零新知（两张脸排一行）`——本批再做即纯重复** |
| **轴 A 合计** | **2 课（上上限 3 课）** | **3 课的第 3 课必须是「条件的两张脸（`unless` vs `in case`）」收口课**，**这是收口课而非新内容课** |

### 5.2 轴 B

| 候选 | 建议课量 | 为什么不能更多 |
|---|---|---|
| **`both`** | **1 课** | **第 2 课的三个可能来源全部被封**：否定轴＝`either` 规矩第四次应用（**本轮实测该「换词」规矩已在 L83／L146 用过**，第三次以上已成常态）；连接轴＝L19／L20 语义场；短应答轴＝**属倒装，另一话题** |
| **`neither`（＋`nor` 认读）** | **1 课** | **`nor` 不单开**（Murphy TOC 0／Cambridge 无独立页）；**第 2 课会变成 `either` 的第三次应用** |
| **倒装应答** | **0 课（本轴内）** | **另案**（§3.3） |
| **轴 B 合计** | **2 课（上上限 3 课）** | **3 课的第 3 课必须是收口课**（「两个都／两个都不排一行」） |

### 5.3 两轴各自的上限对照

| 轴 | 建议课量 | 必造词位 | 单课最高造词 | 是否破历史上限（3 词） |
|---|---|---|---|---|
| **A 轴** | **2 课** | **`even though`（2 词）＋ `in spite of`（3 词）＋ `despite`（1 词）＋ `unless`（1 词）＋ `in case`（2 词）＝ 9 词位** | **第 1 课 6 词位（`even though`／`in spite of`／`despite`）** | **❌ 破线（远超）** |
| **B 轴** | **2 课** | **`both`（1）＋ `neither`（1）＋ `nor`（1 半构件）＝ 2 词必造 ＋ 1 构件** | **第 2 课 2 词位（`neither`＋`nor`）** | **✅ 不破线（≤3）** |

**⚠️ 这是本轮最重要的成本对比**：**A 轴的第 1 课若按「`even though` ＋ `in spite of` ＋ `despite`」同课，造词位 = 6，是我方历史最高（批二十 3 词）的两倍。** **必须重切或降课量**——见 §6。

**注**：**A 轴的分词位统计口径说明**——`even though`／`in spite of` 在词典层是「多词条目」，我方 `courseVocabulary` 的实际计数单位会因实现而异（**本报告不做实现层断言**）；**但即便按「短语算 1 个条目」计，A 轴第 1 课也是 3 个条目（`even though`／`in spite of`／`despite`），仍触顶；按词计则 6，破线。**

---

## §6 两个轴的档位对比与推荐

### 6.1 档位对照表

| 维度 | **轴 A：让步与条件链** | **轴 B：「两者」轴** | 谁更强 |
|---|---|---|---|
| **最高档位候选** | **`unless` = A−** | **`both` = B＋** | **A 轴** |
| **课程位形态** | **Murphy 中级 U113／U114／U115 首尾相接（零间隔）——本批唯一「连续课位链」** | **初级 U82 ＋ 中级 U89 ＋ 初级 U42，跨两册三区块，散点** | **A 轴（结构性优势）** |
| **课程位粒度** | **U114 `in case` 独占一格（最干净）；U113／U115 是多词共用** | **U82 三词一格／U89 六词一格** | **A 轴** |
| **BC 侧课程位** | **B1-B2 `contrasting-ideas-although-despite-others`（小节含 `in spite of / despite` 与 `although / even though`）＋ `conditionals-zero-first-second`（`unless`／`in case` 只在 First conditional 内被点名）** | **BC 三档 68 课全目零专课**；只在参考层 `quantifiers` 的 beginner 表里 | **A 轴** |
| **Cambridge 规则页厚度** | `Unless` 3 节（含 typical errors 2 条）／`In case (of)` 2 节／`In spite of and despite`（Warning 框）／`Although or though?` 7 节 | **`Both` 10 节**／`Neither, neither … nor …` 6 节 | **B 轴**（页更厚） |
| **中文侧实证** | `unless` 独立专文（3 ❌）／`even-though` 独立专文（2 ❌）／`although-despite` 对比专文（1 ❌）／`despite` 独立专文（0 ❌）／**`in case` 404** | **`both` 独立专文（9 ❌）／`neither-nor` 独立专文（2 ❌）／`nor` 独立专文（2 ❌）／`either-neither`** | **B 轴**（❌ 数量 13 vs 6） |
| **CEFR 落点** | `unless` **B1**／`though` **B1（连词）B2（副词）**／`despite` **B1**／**`in case` 无独立标注，`(just) in case` = B1** | `both` **A1**／`neither` **B2**／`nor` **B2** | **B 轴**（`both` A1 对零基础友好） |
| **必造词位** | **9 词位（A 轴最低配置 2 课）** | **2 词位 ＋ 1 构件** | **B 轴（决定性优势）** |
| **与已交付内容的撞车风险** | **高**：`although` 已消耗（L139–L141）／`though` 两义全是同义换词或附注／`unless` 的 ❌will 规则是第三次以上应用 | **中**：`either` 已交付（87 词次），`neither` 有「`either` 影子」 | **B 轴** |
| **批二十四押后理由状态** | **四条中 3 条成立，第 1 条被本轮升级为「不成立一课」，导致原报 3 课必须降为 2 课** | **原理由「造词 3–4 个超上限」已失效（现为 2 词位）** | **B 轴（状态变化更有利）** |

### 6.2 哪个更强？

**分两种问法：**

- **问「档位更高」**：**A 轴**。**它是本批唯一有「跨源连续课位链」的轴（U113–U115 零间隔），且 `unless` 单点达到 A− 档。** 按本项目的档位体系，**「跨源有课程位 ＋ 我方有缺口」正是 A 档的定义**——**A 轴在定义上更强。**
- **问「本批更该做」**：**B 轴**。**因为档位定义没考虑两个东西：造词成本和撞车风险。** **A 轴 2 课要 9 词位（或至少 3 个短语条目）**，**是我方历史上限的 2–3 倍**；**B 轴 2 词位在上限内**。**且 A 轴的核心课位（`although`）已被前两批吃掉一半，剩下的缝里全是我方已教内容。**

### 6.3 关键约束：两轴不能同年连排

**两轴共享同一个「句尾／位置」教学动作**：
- **A 轴**：`though` 句尾（**本报告判不成立**）＋ `in spite of` 的后置成分（**接名词/-ing**）
- **B 轴**：`both` 的中间位（Cambridge `Both: position`）＋ `neither` 的句首位（倒装）

**撞车点**：**批二十四刚用「句尾」动作连讲两课（L145 `也一样 · too 站句尾`、L146「照样站句尾，不站中间」）。** **若批二十五立刻再开一个「位置」轴，观感上是第三批连续的「成分站哪儿」。** → **建议：两轴择一，另一轴顺延，且顺延的那一轴在开批前先做一次「位置动作是否疲劳」的走查。**

### 6.4 我的推荐

**推荐：轴 B 优先（批二十五），轴 A 顺延（批二十六）。**

**理由（四条，按权重排序）**：

1. **成本门是硬门，档位门是软门。** **A 轴 2 课需 9 词位（或 3 个短语条目）；B 轴 2 课只需 2 词位。** **我方历史最高造词是 3 词（批二十），且批二十一／二十二／二十三／二十四连续四批都做到了 1–2 词。** **在 A 轴上破线会创下本项目的新高，且这个新高不是「必须付的代价」——因为 A 轴的高档位来自课程位，而不是来自「非做不可」。** 而 **B 轴的成本恰好因为批二十四交付 `either` 而落入上限内——这个窗口是批二十四亲手打开的，不用可惜。**
2. **A 轴的「缝」比批二十四估的更窄。** **批二十四报 3 课时的核心假设是「U113／U114／U115 三格对三课」。本轮把 `though` 剔出后，U113 剩下的内容与 U115 在逻辑上跨度更大（让步 → 否定条件），而 U114 独占但汉语实证为零。** **结果：A 轴不是「3 课高质量」，而是「2 课勉强 ＋ 1 课可做可不做」。**
3. **B 轴自身的证据质量比批二十三／二十四估的高。** **批二十三／二十四把 B 轴判 B−，主要理由就是造词成本。** **成本一变，B 轴的其余证据（Cambridge `Both` 10 小节／中文侧 13 条 ❌／`both` A1）反而是本批最厚的。** **且 `both` 的 A1 落点完美匹配「零基础」的产品定位**——**对照 A 轴的 `unless` B1／`in spite of`／`despite` B1，B 轴在难度梯度上更稳。**
4. **B 轴有一个「我方自研增量」是 A 轴没有的。** **`both` 与 `neither` 天然构成「两个都／两个都不」的对举**，**而我方 L146 已经建立「肯定用 A／否定用 B」的对举壳**（逐字 `两张脸 · 肯定用 too／否定用 either`）。**B 轴可以直接复用这个壳（`两张脸 · 两个都用 both／两个都不用 neither`），教学动作零成本迁移**；**A 轴则要从零建「让步」这个语义场。**

### 6.5 若主理人仍选 A 轴：最低风险配置

**若因档位考虑必须做 A 轴，建议：**

- **课量降到 2 课**（不是批二十四报的 3 课）
- **第 1 课重切为「`even though` ＋ `in spite of`／`despite`」**（**`though` 剔出，`although` 不碰**）——**但这仍是 3 个短语条目／6 个词位，必须把 `in spite of` 降为认读（只考 `despite`）才可能落回上限内**
- **第 2 课 `unless` 单点**，`as long as`／`provided` 只做认读
- **`in case` 延后**（**中文侧零实证 ＋ 与本批第 1 课的「让步」语义场距离过远**）
- **开工前置项：先解批二十四 §8 开放问题 1（`though` 旧判例口径）**——**L139 逐字「今天它转正了」／L141 逐字「这一章就是那句话的正经课」**，**若本批要做 `though`，会与我方既有台词自相矛盾；本报告的建议是「不做 `though`」，这条前置项因此可以不阻塞。**

---

## §7 Non-goals 依据

| 项 | 判定 | 依据 |
|---|---|---|
| **`though`（全部义项）** | **不做（第一优先 Non-goal）** | **① 让步义：BC 逐字 "Though can be used in the same way as although."——纯同义换词**；**② 句尾义：五家源全部只给「一句话＋2–3 例」，无一家给独立单元位（§2.2）**；**③ 我方 L139–L141 已做完 `although` 三课且 L141 已收口**；**④ `though` 旧判例口径（批二十四 §8 开放问题 1）未解，一做就自相矛盾** |
| **`nor`** | **不做（不单开）** | **① Cambridge 无独立页（只作 `neither` 页的两小节）**；**② Murphy 双册 TOC 实测 0 命中**；**③ BC 三档 68 课全目 0**；**④ 中文侧虽有独立专文，但两条 ❌ 全是「什么时候不能用」——是禁区不是结构** |
| **倒装应答 `so am I`／`neither do I`／`nor do I`** | **不做（本批；须单独立项）** | **① Murphy 初级 U42 是独立单元，且属 `Auxiliary verbs` 块（U40–U43），与限定词块 U82 相隔 40 格**；**② Cambridge 把它归在 `So` 页的 `Spoken English` 大类下，连独立页都不给——上游把它当「口语 so 用法之一」**；**③ 我方 `so am I` GL 0／`neither do I` GL 0／`nor` GL 0——三个真零**；**④ BC 三档 0（连 C1 的倒装课 `emphasis-cleft-sentences-inversion-auxiliaries` 都不收它）** |
| **`as long as`／`provided`（单开）** | **不做（不单开）** | **① 两者与 `unless` 共用 Murphy U115 一格**——**上游的「一课」给的是三者分工**；**② `provided` 跨源无独立规则页（Cambridge `Conjunctions` 页的多词表逐字含 `provided that`，但无独立页；BC 只在 `conditionals-zero-first-second` 里列举）**；**③ 我方 `as long as` GL 0／`provided` GL 0——两个真零，若单开则每课词位 1 但课量无增量** |
| **`in spite of`（单开）** | **不做（不单开）** | **① 它与 `despite` 是同一规则的两个拼法（中文侧逐字「可以互相抽換」）**；**② Cambridge 把两者做成同一页**；**② BC 把它与 `although` 放同一课**——**上游没有一节课叫「in spite of」** |
| **`even if`** | **不做（本批）** | **① 它是 `even though` 的对举项，属条件语义场（而非让步）**；**② 中文侧把它与 `even though` 同篇（`even-though` 专文），做 `even though` 时可以认读带入，但不设考点**；**③ 我方 `even` GL 实测 0——`even` 本身还是零，`even if` 无从谈起** |
| **`both … and`（连接义）** | **不做（不单开）** | **① 它是 `both` 课的一个小节**（Cambridge `Both … and as a linking expression`）；**② 与 L19／L20 的 `and` 语义场重叠**——**唯一新知识是「动词复数」一条**，可作 `both` 课的考点，不单开 |
| **`neither of` ＋ `both of` 的「of 规则」** | **不做（不单开）** | **① Cambridge 把 `both of`／`neither of` 的前置结构放在各自页的同一节（`Both of + object pronoun`／`Neither as a determiner`）；中文侧 `both` 专文有 `both of + 複數代名詞` 一节但明确 `則一定要使用 of 隔開`**；**② 这是「同一个词 + of」的形态变体，不是新话题** |

---

## §8 未核实项

| # | 项 | 现状 | 影响 |
|---|---|---|---|
| **①** | **Murphy 单元内部例句、页码、练习量** | **本机只有官方 TOC 抽文**（`/private/tmp/murphy_int.txt` 等，**本轮 md5 复算：`murphy_int.txt` = `994fde91a0ca7e2d6a7417ed5c72b1d5`／`murphy_ess.txt` = `6b839c0a736b13a7af38872cdf0fbaf7`，与批二十四附录 A.3 登记值一致**），**非正文** | **不影响判档**（判据是「有无单元位」）；**影响「上游一课给多少例句」的容量估算** |
| **②** | **Murphy 中级 U113 里 `though` 的实际篇幅占比** | **同上（无正文）** | **若 U113 内部 `though` 占了大半页，「句尾 though 撑不起一课」的结论会略被削弱**——**但五家源的「无独立单元位」这一事实不受影响** |
| **③** | **`in case` 的词典 CEFR 标注** | **Cambridge 词典 `in case` 条目本轮未取到独立标位**（**取到的是 `case` 名词条下的 `(just) in case` = B1／`in that case` = B2／`in any case` = B2**）；Oxford 侧未取 | **影响 `in case` 的难度定位**——**不影响档位**（**判据是课程位：Murphy U114 独占单元 ＋ Cambridge 独立语法页**） |
| **④** | **Cambridge 语法页对 `both`／`neither` 有无 CEFR 标注** | **两页均无 CEFR 标注**（**只有词典条目标位**：`both` A1／`neither` B2） | **不影响判档**（**判据是课程位与规则页厚度**） |
| **⑤** | **BC 侧 `both`／`neither` 是否有独立参考页** | **实测：BC 参考层总索引只有 7 个类目**（`Pronouns`／`Determiners and quantifiers`／`Possessives`／`Adjectives`／`Adverbials`／`Nouns`／`Verbs`），**`Determiners and quantifiers` 页的子主题只有 5 个**（`Specific and general determiners`／`The indefinite article: 'a' and 'an'`／`The definite article: 'the'`／`Interrogative determiners: 'which' and 'what'`／`Quantifiers`），**`both` 只在 `Quantifiers` 页的 beginner 表内** | **本轮对 BC 侧的取法为「三档索引 ＋ 参考层索引 ＋ 参考页」三层，未逐页穷举 68 课的每一页**——**但三档索引已逐条点完（A1-A2 18 课／B1-B2 36 课／C1 14 课），无 `both`／`neither`／`nor` 专课这一结论成立** |
| **⑥** | **BC `sitemap.xml`** | **本轮两次实测均被拒**（`Access Denied`，含伪造 browser UA 的 `curl`）——**与批二十四「sitemap 实取成功」的口径冲突** | **批二十四的 sitemap 结论本轮无法复现**；**本轮的 BC 侧结论全部来自「三档索引页逐条点目」这一可复现通道** |
| **⑦** | **english.cool sitemap 的完整覆盖** | **本轮实取 `wp-sitemap-posts-post-1.xml`（871 URL）**——**但该 sitemap 可能不含页面（page）类内容**（另有 `wp-sitemap-posts-page-1.xml` **本轮未取**） | **`in-case` 404 的结论已用直连 `curl` 二次确认（`english.cool/in-case/ -> 404`），独立于 sitemap**；**`as-long-as` 本轮实测 200（有专文），但未通读其内容** |
| **⑧** | **`english.cool/though/` 的实际内容** | **本轮实测：301 重定向到 `english.cool/thoughts/`**（**即「thoughts／心得」那篇，与 though 无关**）——**该 slug 是被占用后重定向，不是 404** | **中文侧 `though` 的独立专文为零**——**与批二十四的结论一致**（**`though` 的实证全在 `although` 专文的补充小节里**） |
| **⑨** | **`as long as` 专文内容** | **本轮只确认 `english.cool/as-long-as/` 返回 200（存在）**，**未通读** | **若批二十五要做 A 轴，建议开工前通读此篇以确认它是否支持「`as long as` 与 `unless` 同课」** |
| **⑩** | **我方 `courseVocabulary` 对多词短语的计数单位** | **本报告按「词」计（`even though` = 2 词位），未核实现层** | **影响 A 轴成本的精确数字（6 vs 3 条目）**——**但两种算法下 A 轴第 1 课都触顶或破线，不影响结论方向** |

---

## §9 附录：核查留痕

### A.1 我方数据（本轮独立复算，2026-09-20）

| 项 | 命令 | 结果 |
|---|---|---|
| 课程总数 | `grep -c "number:" src/data/grammarLessons.ts` | **147** ✅（末课 `number: 147`） |
| 案件总数 | `grep -c "number:" src/data/huntCases.ts` | **156** ✅ |
| 季总数 | `grep -c 'id: "season-' src/data/grammarSeasons.ts` | **24** ✅（末项 `season-24`） |
| `though` 词边界 | python `(?<![A-Za-z])though(?![A-Za-z])`（`re.I`） | **GL 3 ／ HC 2**——**GL 3 处全部落位：2 处在 `lesson-139-although`（`:922313`／`:922441`），1 处在 `lesson-141-close-22`（`:937909`）；HC 2 处全在案 #7 `hunt-because-so` 的 `tokens` 与 `explanation`** ✅ |
| `although` | 同上 | **GL 174 ／ HC 14**（**全在 L139–L141 及案件**） |
| `even though`／`even` | 同上 | **GL 0 ／ HC 0**（**`even` 亦 0——连 `even` 本身都没有**） |
| `unless`／`in case`／`in spite of`／`despite`／`provided`／`as long as` | 同上 | **全 0／全 0** |
| `case` | 同上 | **GL 0 ／ HC 1**（**该 1 处在 `huntCases.ts` 的文件头注释里，逐字 "如 case 9 的 advice / information"，非教学内容**） |
| `both`／`neither`／`nor` | 同上 | **GL 0／0／0 ／ HC 0／0／0**（**六个真零**） |
| `either` | 同上 | **GL 87（`lesson-146-not-either` 49 ＋ `lesson-147-close-24` 38）／ HC 10** ——**批二十四「`either` 从 0 → 87 词次」的说法本轮复核成立** ✅ |
| `however` | 同上 | **GL 0 ／ HC 0** |
| 对比卡结构 | 逐课统计 `contrast` 块内 `wrong:` 计数 | **分布 `{6: 147}`——全部 147 课均为 6 条，无一例外** ✅ |
| 引导步骤结构 | 逐课统计 `guided` 块内 `kind:` 计数 | **分布 `{6: 146, 5: 1}`** |
| 练习结构 | 逐课统计 `practice` 块内 item 计数 | **分布 `{4: 108, 5: 37, 6: 2}`** |
| 收口课数量 | `grep -c "收口 · 零新知"` | **11 课** ✅（**与路线图「收口先例 11 课」一致**） |
| 目标句词数 | 逐课统计 `targetSentence` 词数 | **分布 `{3: 17, 4: 23, 5: 37, 6: 27, 7: 26, 8: 14, 10: 1, 12: 1, 14: 1}`**（**≤8 词 144 课，3 课例外**） |
| 罪名枚举 | `src/types.ts:418-428`（`GrammarErrorTag` 联合类型） | **11 项**：`tense`／`sv_agreement`／`missing_be`／`article`／`plural`／`preposition`／`fragment`／`run_on`／`word_order`／`verb_form`／`comparison` |
| 引擎词表 | `grammarAmbushService.ts:160-185`／`grammarBoostService.ts` | **两个服务的词表均不含 `although`／`though`／`either`／`neither`／`both`／`nor`／`unless`／`while`／`until`／`because`**——**即本批候选两轴在 cloze/boost 层均无预设落点**（**新发现，供生产期参考**） |

### A.2 Murphy 双册官方 TOC（本机原件，md5 复算一致）

| 文件 | md5（本轮复算） | 与批二十四登记值 |
|---|---|---|
| `/private/tmp/murphy_int.txt`（中级 4th） | `994fde91a0ca7e2d6a7417ed5c72b1d5` | **一致** ✅ |
| `/private/tmp/murphy_ess.txt`（初级 4th） | `6b839c0a736b13a7af38872cdf0fbaf7` | **一致** ✅ |

**本轮逐字取到的单元标题（去空白归一化原文）**：
- **中级**：`89both/bothofneither/neitherofeither/eitherof`（前接 U88 `all/allofmost/mostofno/noneofetc.`，后接 U90 `alleverywhole`）；`113althoughthougheventhoughinspiteofdespite`；`114incase`；`115unlessaslongasprovided`；`116as(asIwalked…/asIwas…etc.)`；`117likeandas`；`118likeasif`
- **初级**：`42too/eithersoamI/neitherdoIetc.`（块头逐字 `Auxiliaryverbs`，同块 `40Iam,Idon’tetc.`／`41Haveyou?Areyou?Don’tyou?etc.`／`43isn’t,haven’t,don’tetc.`）；`82botheitherneither`（前接 U81 `allmostsomeanyno/none`，后接 U83 `alotmuchmany`）；连词块逐字 `97andbutorsobecause`／`98When…`／`99Ifwego…`／`100IfIhad…`／`101apersonwho…`／`102thepeoplewemet…`
- **U113–U115 连续性复核**：归一化后连读为**`…111stillanymoreyetalready112even` ＋ `113althoughthougheventhoughinspiteofdespite` ＋ `114incase` ＋ `115unlessaslongasprovided` ＋ `116as(…)`**——**中间零间隔、零其他单元插入** ✅（**批二十四结论本轮独立复现成立**）
- **双册关键词实测**：**中级** `nor` 0／`unless` 1／`incase` 1／`inspiteof` 0（归一化件中为整体串，`spite` 2 来自 `inspiteof`）／`despite` 1；**初级** `nor` 0／`unless` 0／`incase` 0／`spite` 0／`despite` 0——**即 `unless`／`in case`／`in spite of`／`despite` 四词在中级 TOC 有、初级 TOC 无**（与批二十四「初级册完全无这四词」一致 ✅）

### A.3 Cambridge（本轮实取）

| # | 页 | 取到情况 | 关键逐字 |
|---|---|---|---|
| C-1 | `grammar/british-grammar/although-or-though`（`/though` 同页） | ✅ | 页题 "Although or though?"；**7 小节**；**Warning 框（逗号）**；**`Though meaning 'however'` 逐字 "we can use though (but not although or even though) with a meaning similar to however or nevertheless. In these cases, we usually put it at the end of a clause"** |
| C-2 | `grammar/british-grammar/unless` | ✅ | 页题 "Unless"；**3 小节**；**typical errors 两条逐字**（"We don't use unless when we mean if"／"We don't use will or would in the clause after unless"） |
| C-3 | `grammar/british-grammar/in-case` | ✅ | 页题 "In case (of)"；**逐字 "In case is a conjunction or adverb. In case of is a preposition."**；**核心禁忌逐字 "We don't use in case to mean 'if'."** |
| C-4 | `grammar/british-grammar/in-spite-of-and-despite` | ✅ | 页题 "In spite of and despite"；**Warning 框逐字**（"We don't use a that-clause after in spite of or despite. We use in spite of the fact that or despite the fact that"） |
| C-5 | `grammar/british-grammar/even-though-and-even-if` | ✅ | 页题 "Even"（**含小节 `Even though and even if`**）；**逐字 "even though carries the same meaning as although"**（"in spite of the fact that"）"**gives more emphasis than although**" |
| C-6 | `grammar/british-grammar/both` | ✅ | 页题 "Both"；**面包屑 `Grammar > Nouns, pronouns and determiners > Quantifiers > Both`**；**10 小节**；**typical errors 两条逐字；position 逐字；short answers 逐字；negative clauses 逐字** |
| C-7 | `grammar/british-grammar/both-both-of-neither-neither-of-either-either-of` | ✅ | **返回同页 "Both"**（**该 URL 重定向／同页**——**即 `both of`／`neither of`／`either of` 是 `Both` 页内的节，不是独立页**） |
| C-8 | `grammar/british-grammar/neither-neither-nor-and-not-either` | ✅ | 页题 "Neither, neither … nor and not … either"；**面包屑 `… > Negation > Negation > …`**；**6 小节** |
| C-9 | `grammar/british-grammar/either` | ✅ | 页题 "Either"；**面包屑 `… > Quantifiers > Either`**；**8 小节**；**两条 "Not:" 错例**（`Not: … I don't like either jackets.`） |
| C-10 | `grammar/british-grammar/so-am-i-neither-do-i` | ✅（**实际返回 `So` 页**） | 页题 "So"；**面包屑 `Grammar > Using English > Spoken English > So`**；**小节 `So am I, so do I, Neither do I`**；**逐字 "We also use not … either, nor or neither when we want to give a negative meaning"** |
| C-11 | `grammar/british-grammar/subordinating-conjunctions` | ✅（**实际返回 `Conjunctions` 页**） | 页题 "Conjunctions"；**从属连词表逐字含 `after, (al)though, as, before, if, since, that, until, when, whereas, while, once, so, as soon as, provided that`——`unless` 与 `in case` 均不在列**；**多词表逐字含 `as long as, as soon as, except that, in order that, so as to, provided that`** |
| C-12 | `grammar/british-grammar/despite-or-in-spite-of` | ⚠️ | **返回通用索引页**（非目标页）——**该 slug 不在 Cambridge 现行语法路径下**；**`In spite of and despite` 的正确 slug 见 C-4** |

### A.4 BC LearnEnglish（本轮实取）

| # | 资源 | 取到情况 | 关键逐字 |
|---|---|---|---|
| B-1 | `grammar/b1-b2-grammar/contrasting-ideas-although-despite-others` | ✅ | 页题 "Contrasting ideas: 'although', 'despite' and others"；**Level: B1 Intermediate／B2 Upper intermediate**；**小节逐字 `in spite of / despite`／`although / even though`／`though`**；**逐字 "Though can also go at the end of the second phrase."**；**"Even though is slightly stronger and more emphatic than although."**；**"After in spite of and despite, we use a noun, gerund (-ing form of a verb) or a pronoun."** |
| B-2 | `grammar/b1-b2-grammar/conditionals-zero-first-second` | ✅ | 页题 "Conditionals: zero, first and second"；**Level: B1–B2**；**逐字 "It is also common to use this structure with unless, as long as, as soon as or in case instead of if."**；**无 `unless` 独立小节；`provided` 全页不出现** |
| B-3 | `grammar/c1-grammar/contrasting-ideas` | ✅ | 页题 "Contrasting ideas"；**C1 Advanced**；**小节含 `In spite of and despite`／`Although, though and even though`／`Even if`／`While and whereas`／`Much as`**；**句尾 `though` 例逐字 "I soon made friends, though."** |
| B-4 | `grammar/c1-grammar/emphasis-cleft-sentences-inversion-auxiliaries` | ✅ | 页题 "Emphasis: cleft sentences, inversion and auxiliaries"；**C1 Advanced**；**6 小节**；**全页无 `so do I`／`neither do I`／`nor do I`** |
| B-5 | `grammar/english-grammar-reference/quantifiers` | ✅ | 页题 "Quantifiers"；**`Level: beginner` 出现 2 次、`Level: intermediate` 出现 2 次**；**小节 `both, either and neither` 逐字 "If we are talking about two people or things, we use the quantifiers both, either and neither"**；**例 `Both the supermarkets were closed`／`Neither of the supermarkets was open`**；**"nouns with both have a plural verb but nouns with either and neither have a singular verb"** |
| B-6 | `grammar/english-grammar-reference/determiners-quantifiers` | ✅ | 页题 "Determiners and quantifiers"；**子主题 5 个**（`Specific and general determiners`／`The indefinite article: 'a' and 'an'`／`The definite article: 'the'`／`Interrogative determiners: 'which' and 'what'`／`Quantifiers`）——**无 `both`／`neither` 独立子主题** |
| B-7 | **`grammar/a1-a2`（18 课全目）** | ✅ **逐条点目** | 18 课标题逐字列出（见 §3.1）——**无 `both`／`neither`／`nor` 专课** |
| B-8 | **`grammar/b1-b2`（36 课全目）** | ✅ **逐条点目** | 36 课标题逐字列出——**无 `both`／`neither`／`nor` 专课** |
| B-9 | **`grammar/c1`（14 课全目）** | ✅ **逐条点目** | 14 课标题逐字列出——**无 `both`／`neither`／`nor` 专课** |
| B-10 | `sitemap.xml` | ❌ **Access Denied**（两次，含伪 browser UA） | **与批二十四口径冲突，本轮无法复现**（见 §8 未核实项 ⑥） |

### A.5 词典 CEFR 标位（本轮实取）

| 词 | Cambridge | Oxford | 差 |
|---|---|---|---|
| `both` | **A1**（"predeterminer, determiner, pronoun"） | **A1** | **一致** |
| `either` | **B1**（adverb）／**B1**（det./pron./conj.）／另一条 **B2** | **A2** ／ **B2** | **分裂** |
| `neither` | **B2**（"determiner, pronoun, conjunction, adverb"）；**`neither ... nor` 亦 B2** | **A2** | **分裂两档** |
| `nor` | **B2**（"mainly UK neither"） | 未取到独立标位 | — |
| `though` | **B1**（conjunction "despite the fact that"）／**B2**（"but"）／**B2**（adverb "despite this"） | **B1**（conjunction） | **基本一致（副词义 B2）** |
| `although` | 未标 | 未取 | — |
| `unless` | **B1**（"except if"） | 未取到 | — |
| `despite` | **B1**（preposition） | 未取 | — |
| `in case` | **无独立标位**；`case` 条下 **`(just) in case` = B1**／`in that case` = B2／`in any case` = B2／`case`（SITUATION）= B1 | 未取 | — |

### A.6 中文侧 english.cool（本轮：**sitemap 871 URL ＋ 直连状态码 13 条 ＋ 实取 10 篇**）

| 篇目 | 状态 | 页题逐字 | ❌ 条数 |
|---|---|---|---|
| `although` | ✅ 200 | 「「although」正確用法是？跟 though 一樣嗎？」 | **1** |
| `although-despite` | ✅ 200 | 「差在哪？Although, though, even though, despite 用法上的差別！」 | **1** |
| `even-though` | ✅ 200 | 「Even though 跟 Even if 的用法差在哪？來搞懂！」 | **2** |
| `despite` | ✅ 200 | 「「despite」正確用法是？來看例句一次搞懂！」 | **0** |
| `unless` | ✅ 200 | 「「Unless」正確用法是？ 可以用在疑問句嗎？來看例句一次搞懂！」 | **3** |
| `in-case` | **❌ 404** | — | **0（实证为零）** |
| `both` | ✅ 200 | 「「both」正確用法是？來看例句搞懂！」 | **9** |
| `either-neither` | ✅ 200 | 「「either」和「neither」正確用法是？來看例句搞懂！」 | **0**（**本轮检索未见**） |
| `neither-nor`（`neither` 同篇） | ✅ 200 | 「「neither.. nor..」的正確用法是？跟 either or 差在哪？」 | **2**（**均标「語意錯誤」**） |
| `nor` | ✅ 200 | 「「nor」正確用法是？來學 nor 的各種用法！」 | **2** |
| `as-long-as` | ✅ 200（**本轮只确认存在，未通读**） | （未取） | （未核） |
| `though` | **⚠️ 301 → `thoughts/`** | （重定向到「心得／感想／想法」） | **0（中文侧无 `though` 独立专文）** |
| `conjunctions`（从属连词总表） | ✅ 200 | 「來搞懂英文「連接詞、對等連接詞、從屬連接詞」」 | **逐字「條件關係：if, unless, as long as」——不收 `in case`**；**让步组逐字「although, though, even though」** |

---

> 本报告由产品战略团队 AI 协作生成（竞析），重要结论请由主理人复核；跨源证据已逐条标注来源与取法，未核实项见 §8。
