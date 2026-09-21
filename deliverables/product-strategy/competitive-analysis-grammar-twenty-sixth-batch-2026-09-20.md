# 竞品分析：第二十六批选题（L151 起）· 竞析报告

| 字段 | 值 |
|---|---|
| 报告 | 竞品/跨源分析（竞析）· 语法线「小美的一天」第二十六批 |
| 日期 | **2026-09-20** |
| 轮次 | 第二十六批（批二十五 L148–L150 `both`／`neither` 交付后） |
| 课号起点 | **L151 起**（现库 **150 课／159 案／25 季**，本轮独立复算） |
| 本轮任务 | 四轴逐候选判档（A 让步与条件链 · B `all` · C `seem`／`appear` · D `would rather`）· **轴 A「2 课」可行性专项复核** · **轴 B `all` 课程位专项** · 「同义换词 vs 新结构」甄别 · 课量建议 · 四轴对照与推荐 · Non-goals 依据 |
| 上游输入 | `competitive-analysis-grammar-twenty-fifth-batch-2026-09-20.md`（含 §2「句尾 though 撑不起一课」、§4 课量重算 3→2）· `roadmap-grammar-twenty-fifth-batch-2026-09-20.md`（§6 携带项 2「轴 A 2 课须先验 6 条对比卡」、§8 开放问题 2「`all` 未评估」）· `competitive-analysis-grammar-twenty-fourth-batch-2026-09-20.md`（§1.1 轴 A／C／D 前三轮判定）· `roadmap-grammar-twenty-fourth-batch-2026-09-20.md`（§8 开放问题 1） |
| 我方快照（本轮独立复算） | `src/data/grammarLessons.ts`（**150 课**，末课 `number: 150`）· `src/data/huntCases.ts`（**159 案**）· `src/data/grammarSeasons.ts`（**25 季**，末项 `season-25 {min:148,max:150}`） |
| 跨源取到情况 | **Cambridge 语法页 18 页（实取）＋ 词典条 9 条** · **BC 参考层 4 页（WebFetch）＋ 三档索引（WebFetch 通道 18 课／本机 Wayback 缓存通道 A1-A2 14 slug、B1-B2 33 slug、C1 14 slug，两通道数字有出入见 §8 ④）** · **Murphy 双册官方 TOC 本机原件（md5 复算）** · **中文侧 english.cool 状态码 14 条 ＋ letmeenglish 状态码 7 条 ＋ 实取 8 篇** · **Oxford 词典 CEFR 7 条（`cefr=` 属性实取）** |
| 口径 | **Murphy 只核 TOC 标题层，单元内部例句未核**（沿批二十三／二十四／二十五口径，见 §8） |

---

## §0 本轮结论速览（先读这里）

1. **【本轮最重要发现】轴 A 的「2 课」经复核成立，但成立的方式与批二十五的设想不同。** 批二十五把 2 课切成「让步一课（`even though` ＋ `in spite of`／`despite`）＋ 条件一课（`unless`）」。**本轮逐词核过后判定：这个切法仍然会撞造词线**（第 1 课 3 个短语条目／6 个词位）。**能站住 2 课的唯一切法是「`unless` 一课 ＋ `in case` 一课」**——两词各有独立课程位（Murphy 中级 **U115** 与 **U114**，**首尾相邻**）、各有独立规则页（Cambridge `Unless` 页 3 节含 2 条 typical errors；`In case (of)` 页含核心禁忌句）、各有独立语义（**否定条件 vs 预防**）。**`even though`／`though`／`in spite of`／`despite` 在本课量下无处安放，只能作对照位或认读位。**
2. **`unless` 能撑一课（6 条对比卡可凑满，本轮逐条列出）。** 增量来源：① `unless` ＝ **'except if'**（Cambridge 逐字 "We use the conjunction unless to mean 'except if'."）；② **`unless` 与 `if … not` 的等价**（Cambridge 有专节 `Unless and if … not`）；③ **不用 will／would**（Cambridge typical errors 逐字 "We don't use will or would in the clause after unless"，**中文侧同一条逐字 ❌`Unless the weather will get better, …`**）；④ **不用于「已知为真」**（Cambridge 逐字 "We don't use unless for things that we know to be true."）；⑤ **不能与 `if` 连用**（Cambridge `Conditionals: other expressions` 页逐字 "We don't use unless and if together"＋❌`unless if it rains`）；⑥ **不能用于疑问句**（中文侧独立专文逐字 "unless 不能出現在疑問句中"＋❌`What will you do unless you get the loan?`）。
3. **`in case` 能撑一课，但「6 条」要靠自造补足。** 跨源硬增量只有两条：① **`in case` ≠ `if`**（Cambridge 逐字 "We don't use in case to mean 'if'."＋对举例）；② **`in case` ＋ 名词 ＝ `in case of`**（同页逐字 "In case of is a preposition … We use in case of + noun"）。**中文侧实证为零**（`english.cool/in-case/` **404**，`letmeenglish.com/in-case/` **404**）——**这是它「封顶 1 课」而不是「可开 2 课」的依据。**
4. **【轴 B 新发现】`all` 的课程位是真的，而且比 `both` 更硬。** Murphy 中级 **U90 标题逐字 `90alleverywhole`**（前接 **U89 `both/bothofneither/neitherofeither/eitherof`**，**零间隔**）＋ **初级 U80 标题逐字 `80everyandall`**（前接 U79 `somebody/anything/nowhereetc.`，后接 **U81 `allmostsomeanyno/none`**）——**`all` 在两册各占一格，且初级册那一格是「every and all」的独立单元**。**这是本项目自批二十四以来第二次拿到「跨源连续课位链」。**
5. **`all` 与 `every` 的分工在跨源里是独立单元，这一点被三源一致证实。** Cambridge **有两个独立对比页**（`All or every?` 与 `Each or every?`，**面包屑逐字 `Grammar > Easily confused words > …`**，**`All or every?` 页含 4 条 typical errors**）；BC 参考层 `Quantifiers` 把两词放在**同一小节**（逐字 "We use the quantifiers every and each with singular nouns to mean all"）；**Murphy 初级 U80 的标题就是 `every and all`**。→ **`all` 与 `every` 是「必须成对处理」的一课，不是两课。**
6. **【轴 B 判档】`all` ＝ B＋（可开 1–2 课），不是 A。** 课程位是「与 `every`／`whole` 共用一格」（U90 三词一格、U80 两词一格），**不是我方意义的单点课位**；**且 `every` 在我方是「已用 142 词次但全非量词义」的半熟状态**（本轮实测：`every` 后接词分布 **`day` 110／`night` 6／`morning` 1，无第四种搭配**）——**第 2 课的增量要落在「`every` 从频率副词升级为量词」上，这是一次真正的「旧词新脸」。**
7. **轴 C `seem`／`appear` 维持 B，且「与 L125–L127 `look` 的语义距离」本轮判定为「够远、不阻断」，但课量必须封顶 2 课。** 理由：本轮取到 Cambridge **`appear` 页的 `Appear or seem?` 小节逐字两条明文禁用**（`It appears crazy` ✗／`It appeared a good choice` ✗）与**中文侧独立专文的第三条 ❌ 逐字 `❌ It appears like you're depressed.`** ——**「`appear` 不能接 `like`／`as if`／`as though`」是跨源一致的硬规则，而 `look` 完全不做这件事**。**阻断项解除，但第 3 课仍无来源**（跨源只给一条两词分工线）。
8. **轴 D `would rather` 维持 B−，2 课封顶，本轮新增一条硬证据**：**Cambridge 语法页的 `Would rather, would sooner` 页与中文侧独立专文**在「**两个动词**」上完全一致——Cambridge `typical errors` 逐字 "**We don't use would rather or would sooner with an -ing form or a to-infinitive**"；letmeenglish `I'd rather … than …` 专文逐字 "**還需要注意的是，在使用這個結構時，我們必須使用兩個動詞。**"——**但 `english.cool/would-rather/` 本轮三度实测 404**（**中文侧主站零专文，只有 letmeenglish 一篇**）。
9. **推荐：轴 B `all` 优先（2 课），轴 A 顺延或极简（2 课但必须换切法），轴 C／D 继续顺延。** **核心理由是成本门**：轴 B 必造词 **1–2 个**（`all` ＋ 可选 `each`），**在我方历史 1–3 词的上限内**；轴 A 2 课最低配置仍需 **`unless` ＋ `in case` ＝ 2 词位**（**若不碰 `even though`／`in spite of`／`despite`，则与轴 B 同成本**）——**两轴成本本轮罕见地打成平手，胜负手改由「与已交付内容的距离」决定：轴 A 距离 L139–L144 太近（连词家族第 4 连排），轴 B 距离 L148–L150 更近但语义场不同（`both` 是两个 vs `all` 是三个以上，是同一张表的下一步）。**

---

## §1 逐候选档位判定

### 1.1 轴 A 候选全表（让步与条件链）

| 候选 | ① 跨源逐字证据 | ② 课程位 | ③ 规则页 | ④ 档位 | ⑤ 理由 |
|---|---|---|---|---|---|
| **`unless`** | **Cambridge `Unless` 页**（面包屑逐字 `Grammar > Words, sentences and clauses > Conjunctions and linking words > Unless`）：**逐字 "We use the conjunction unless to mean 'except if'."**；**专节 `Unless and if … not`**（逐字 "Unless and if … not both mean 'except if'"）；**Warning 框逐字**（"In speaking, we use unless to introduce an extra thought or piece of information"）；**typical errors 两条逐字**："**We don't use unless when we mean if**"／"**We don't use will or would in the clause after unless**"；**Cambridge `Conditionals: other expressions` 页**（面包屑逐字 `Grammar > Verbs > Conditionals and wishes > …`）**逐字两条禁用**："We don't use unless for impossible conditions"／"**We don't use unless and if together**"（❌`unless if it rains`）；**BC `conditionals-zero-first-second`（B1／B2）逐字**："**It is also common to use this structure with unless, as long as, as soon as or in case instead of if.**"（**无独立小节**）；**Cambridge 词典 `unless` 逐字 `B1`**／**Oxford `unless` `cefr="b1"`**；**中文侧 `english.cool/unless/`（200）独立专文**，逐字 "**Unless 的中文意思就是「除非…否則…」或「如果不…就…」**"／"**Unless 後面一定是肯定句，否則會出現「雙重否定」的問題**"／"**unless 不能出現在疑問句中**"，**三条 ❌** 含 `Unless the weather will get better, the soccer game will be cancelled. ❌` | **✅ 有**（**Murphy 中级 U115 标题逐字 `115unlessaslongasprovided`**——**三词共用一格**） | **✅ 有且厚**（Cambridge 独立页 3 节 ＋ 2 条 typical errors；Cambridge 第二页再补 2 条 Warning；中文侧独立专文 3 条 ❌） | **A−** | **四轴里唯一「独立规则页 ＋ 独立中文专文 ＋ 独立典型错误 ＋ 上游单元位」四项齐备的候选**。**不写满 A 的唯一理由仍是课程位三词共用**（`as long as`／`provided` 我方也全零：本轮实测 GL 0／0） |
| **`in case`** | **Cambridge `In case (of)` 页**（面包屑逐字 `Grammar > Verbs > Conditionals and wishes > In case (of)`）：**逐字定义 "In case is a conjunction or adverb. In case of is a preposition."**；**核心禁忌逐字 "We don't use in case to mean 'if'."**；**对举例逐字**（`Let's take our swimming costumes in case there's a pool at the hotel.` = 不知道有没有／`… if there's a pool …` = 知道了才带）；**另有 `In case of` 专节**（逐字 "We use in case of + noun to mean 'if and when something happens'"）；**例句** `Shall I keep some chicken salad for your brother in case he's hungry when he gets here?`／`In case I forget later, here are the keys to the garage.`／`She knows she's passed the oral exam, but she doesn't want to say anything just in case.`（**副词用法**）；**BC 逐字**："It is also common to use this structure with unless, as long as, as soon as or in case instead of if."＋例句 `I'll give you a key in case I'm not at home.`（**无独立小节**）；**中文侧 `english.cool/in-case/` 本轮实测 404**；**`letmeenglish.com/in-case/` 与 `in-case-of/` 均 404**（本轮新增）；**Cambridge 词典 `in case` 条目三度实取失败**（返回 `referee` 条目，URL 落地为 `?q=in-case`）——**CEFR 未取到** | **✅ 有**（**Murphy 中级 U114 标题逐字 `114incase`——独占一格**） | **✅ 有**（Cambridge 独立页 2 节） | **B＋** | **课程位是本轴最干净的（U114 独占单元）**，**但中文侧实证连续两轮为零**（404 × 3 处）→ **零基础讲解的脚手架 100% 自造**；**规则层只有两条硬增量**（≠if；+of＝介词）→ **撑 1 课，撑不住 2 课** |
| **`even though`** | **BC `contrasting-ideas-although-despite-others`（B1／B2）逐字**："**Even though is slightly stronger and more emphatic than although.**"；**Cambridge `Although or though?` 页有 `even though` 小节**；**Cambridge `Even` 页小节 `Even though and even if`**（逐字 "**even though carries the same meaning as although**"）；**中文侧 `english.cool/even-though/`（200）独立专文**，页题逐字「Even though 跟 Even if 的用法差在哪？來搞懂！」，**逐字** "**even though 的意思是「雖然」，表達一種「事實」**"，两条 ❌（`I wouldn't date Sam even he were handsome and muscular.`／`Even I've polished and cleaned the vase, it still looks old.`） | **⚠️ 半有**（**U113 标题 `113althoughthougheventhoughinspiteofdespite` 内含**——**五词共用一格**） | **✅ 有**（Cambridge 页内小节 ＋ 中文侧独立专文） | **B** | **唯一增量是「强度」**（BC 逐字 "slightly stronger"）——**比我方已教 `although`（L139–L141）强一点，不构成新结构**；**中文侧 ❌ 两条是 `even` vs `even though` 混淆，属词汇层** |
| **`in spite of`** | **Cambridge `In spite of and despite` 页**，**Warning 框逐字**："**We don't use a that-clause after in spite of or despite. We use in spite of the fact that or despite the fact that**"；**BC 逐字**："**After in spite of and despite, we use a noun, gerund (-ing form of a verb) or a pronoun.**"；**中文侧 `english.cool/although-despite/`（200）**（**该篇全页不提 `in spite of`**，只讲 `despite`） | **⚠️ 半有**（U113 标题内） | **✅ 有** | **B** | **新东西是「接名词／-ing 不接从句」**——**是「连词 vs 介词」的分界，我方零覆盖**；**但无独立课程位、中文侧无独立专文** |
| **`despite`** | 同 `in spite of`（**同一页**）；**Cambridge `despite` 未取到独立 CEFR**（前批取到 `B1` preposition）；**中文侧 `english.cool/despite/`（200）是独立专文**，逐字 "**despite 可以放在句首或句中，與同義詞 in spite of 可以互相抽換**" | **⚠️ 半有**（同 `in spite of`） | **✅ 有** | **B** | **与 `in spite of` 是「同一条规则的两个拼法」**（中文侧逐字「可以互相抽換」）——**必须同课** |
| **`though`（让步义）** | **BC 逐字**："**Though can be used in the same way as although.**"；**中文侧 `english.cool/although/`（200）页题逐字「「although」正確用法是？跟 though 一樣嗎？」** | **❌ 无独立课位**（只作 U113 的并列词之一） | **✅ 有** | **C** | **上游明说它就是 `although`**——**纯同义换词**（沿批二十五判定） |
| **`though`（句尾义）** | **BC 逐字**："**Though can also go at the end of the second phrase.**"；**Cambridge `Although or though?` 小节 `Though meaning 'however'`**；**中文侧逐字** "只有 though 可以放在句尾（這時候會作為副詞）" | **❌ 无**（**Murphy 双册 TOC 无一格与「句尾」有关**） | **⚠️ 附注级**（一句话＋2–3 例） | **C** | **批二十五已判「撑不起一课」，本轮复核成立**（**五家源全无独立单元位**） |

**轴 A 档位排序（强→弱）**：`unless`（A−）＞ `in case`（B＋）＞ `even though`（B）＝ `in spite of` ＝ `despite`（B）＞ `though` 让步义（C）＝ `though` 句尾义（C）。

**⚠️ 与批二十五的差异登记**：批二十五把 `even though`／`in spite of`／`despite` 判为「1–2 课、必须换切分点」，**本轮维持该档位判定，但明确它们在本轮建议的 2 课方案里没有位置**（见 §2.4）。

### 1.2 轴 B 候选全表（`all`）

| 候选 | ① 跨源逐字证据 | ② 课程位 | ③ 规则页 | ④ 档位 | ⑤ 理由 |
|---|---|---|---|---|---|
| **`all`** | **Murphy 中级 U90 标题逐字 `90alleverywhole`**（**前接 U89 `89both/bothofneither/neitherofeither/eitherof`，后接 U91 `91eachandevery`——三格零间隔**）；**Murphy 初级 U80 标题逐字 `80everyandall`**（**前接 U79 `somebody/anything/nowhereetc.`，后接 U81 `allmostsomeanyno/none`**）；**Cambridge `All` 页**（面包屑逐字 `Grammar > Nouns, pronouns and determiners > Quantifiers > All`）：**10 个小节逐字** `All as a determiner`／`All with no article`／`All of`／`All without of`／`All with personal pronouns`／`All as a pronoun`／`All as an adverb`／`All meaning 'completely' or 'extremely'`／`All: not all`／`All: after all`；**Warning 两条逐字**："**We don't normally say all people; we say everybody or everyone**"／"**After all does not mean 'finally' or 'at last'**"；**定义句逐字**："**All means 'every one', 'the complete number or amount' or 'the whole'.**"；**另有两处 See also 指向独立对比页**（`All or every ?`／`All or whole ?`）；**Cambridge `All or every?` 页**（面包屑逐字 `Grammar > Easily confused words > All or every?`）：**逐字** "All and every are determiners."／"**All refers to a complete group. Every refers to each member of a complete group**"；**4 条 typical errors 逐字**（不用 `every` 于限定词前／不可数名词／复数名词／`every` 不能单独站）；**Cambridge `All or whole?` 页**（面包屑逐字 `Grammar > Easily confused words > All or whole?`）：**逐字** "**We can use all and the whole with of the**"；**2 条 typical errors**（❌`all a bar`／❌`throughout whole country`）；**BC 参考层 `quantifiers` 逐字**："**Note: with all and both, we don't need to use of**"；**BC 三档索引本轮逐条点完：`all`／`every`／`each` 零专课**（A1-A2 档仅有 `Quantifiers: 'few', 'a few', 'little' and 'a bit of'` 一课；**索引课数两个通道有出入，见 §8 未核实项 ④**）；**Cambridge 词典 `all` 逐字 `A1`**（determiner）／`A2`（adverb "completely"）；**Oxford `all` `cefr="a1"`**（三义全 A1，`ox3000`）；**中文侧 `letmeenglish.com/all-both/`（200）独立专文**，页题逐字「一次搞懂 all／both 用法！the 與 of 差異＋例句與練習」，**逐字规则** "**我們使用 all + 名詞（中間沒有 the）來指一個普遍人/事/物的狀態**"／"**如果名詞之前沒有限定詞 the/my/Tom's，all/both + of 就不能直接加在名詞之前**"／**「all/both 句中和動詞的排列順序」整节**（動詞之前／Be動詞之後／助動詞之後／疑問句中放主詞之後），**含 10 道练习** | **✅ 有，但共用**（**中级 U90 三词一格 ＋ 初级 U80 两词一格**）；**BC 零专课** | **✅ 有且厚**（Cambridge 主页面 10 节 ＋ 两个独立对比页 ＋ 4＋2 条 typical errors ＋ BC 参考层 ＋ 中文侧独立专文含 10 题练习） | **B＋** | **本批规则页最厚的候选**（**Cambridge 三个页面 ＋ 8 条 typical errors**，比 `both` 的 10 小节还多一层对比页）；**CEFR 两源一致 A1**（对零基础最友好）；**课程位比 `both` 更硬**（U90 与 U89 零间隔、初级 U80 是「every and all」独立题目）——**但仍是共用格，不升 A** |
| **`every`（量词义）** | **Cambridge `Every` 页**（面包屑逐字 `Grammar > Nouns, pronouns and determiners > Determiners > Every`）：**逐字** "**Every is a determiner.**"／"**We use every + singular noun to refer individually to all the members of a complete group of something**"；**`Every: regular situations` 节逐字** "We use every with a singular noun to refer to something that happens regularly"（例 `I leave the house every morning at 6 am.`／❌`every mornings`）；**`Every one or everyone?` 节**／**`Every other` 节**（逐字 "We use every other to mean 'alternate'"）；**typical errors 两条逐字**："We don't use every on its own, without a noun"／"**We don't use every with a plural noun**"；**Cambridge `Each or every?` 页**逐字 "**It is often similar in meaning to every, but we use every to refer to a group or list of three or more things**"；**BC 参考层逐字** "We use the quantifiers every and each with singular nouns to mean all"；**BC 三档索引零专课**；**Cambridge 词典 `every` 逐字 `A1`**（ALL 义 ＋ REPEATED 义，**共两次 A1**）／`B2`（GREATEST）／`C1`（`every now and again/then`）／`C2`（`every so often`）——**注意：无 B1 标位**；**Oxford `every` `cefr="a1"`（义1）＋ `b1`（义2）＋ `b2`（`every other`）**；**中文侧两篇（200）**：`english.cool/each-vs-every/` 页题逐字「「each」和「every」差在哪？用法一次搞懂」，**逐字** "**every 是「全部加起來一起看」，強調的是整體、沒有例外**"；`letmeenglish.com/every-each/` 页题逐字「every 和 each 的用法和區別」，**逐字** "**當事物只有兩個時，必須使用 each。當事物超過兩個時，可以選擇 each 或 every。**" | **✅ 有，但共用**（**中级 U90 含 `every`；初级 U80 标题 `every and all` 是以 `every` 开头的独立单元；中级 U91 `eachandevery`**） | **✅ 有且厚**（Cambridge 独立页 ＋ `Each or every?` 对比页 ＋ BC 参考层 ＋ 中文侧两篇独立专文） | **B** | **课程位是「三处共用」**（U80／U90／U91）；**且我方 `every` 已用 142 词次，全部是 `every day／night／morning` 的频率副词义**（**本轮实测无第四种搭配**）——**要教的是「同一个词的另一个身份」，不是新词**；**增量真实但薄，只能作 `all` 课的下半或第 2 课的一半** |
| **`each`** | **Cambridge `Each` 页**（面包屑未取到，页题逐字 "Each"）：**逐字** "**Each is a determiner or a pronoun.**"；**小节逐字** `Each: meaning and use`／`Each of`／`Each + pronouns and possessives`／`Each referring to a subject`；**逐字** "**We use each to refer to the individual things or persons in a group of two or more**"；**`Also` 见 `Both`**；**Cambridge `Each or every?` 页含 2 条明文禁用**（❌`Almost each car`／❌`Every of us`）；**Cambridge 词典 `each` 逐字 `A1`**；**Oxford `each` `cefr="a1"`**；**中文侧两篇独立专文（200）**：`english.cool/each-vs-every/` 与 `english.cool/each-every/`（后者页题逐字「「each」用法是？跟 every 差在哪？例句一次搞懂！」，逐字 "**each 是「一個一個分開看」**"／"**它後面接的東西永遠是單數，動詞也用單數**"／"**主詞 + each + 動詞**"） | **✅ 有，但共用**（U91 `eachandevery`；初级 U82 不含 `each`） | **✅ 有**（Cambridge 独立页 ＋ 对比页 ＋ 中文侧两篇） | **B−** | **我方 `each` 真零**（GL 0／HC 0，本轮实测）；**但它与 `every` 的差异在跨源全部是「个别 vs 整体」一条线**（三源一致）——**与 `every` 同课才成立，单开无增量** |
| **`whole`** | **Cambridge `Whole` 页**（面包屑逐字 `Grammar > Nouns, pronouns and determiners > Determiners > Whole`）：**逐字** "**Whole is a determiner. We use whole before nouns and after other determiners (my, the, a/an, their) to talk about quantity.**"；**`All or whole?` 对比页逐字** "**We use a/an with whole but not with all**"／"**We use all the and not the whole with uncountable nouns**"；**Cambridge 词典 `whole` 逐字 `A2`**／`the whole of something` **`B1`**；**Oxford `whole` `cefr="a2"`＋`b2`**；**我方 `whole` GL 0／HC 0** | **✅ 有**（**U90 `alleverywhole` 第三词**） | **✅ 有**（独立页 ＋ 对比页） | **C＋** | **它是 U90 的第三词，但是「`all` 的另一种说法」**（中文侧 `all-both` 专文全页不提 `whole`）——**跨源把它做成对比页而非课程位，且中文侧零实证** |

---

## §2 轴 A 专项：`unless` 与 `in case` 能否各撑一课？

### 2.1 结论：**能，但这是轴 A 唯一的 2 课方案；`even though` 家族在本方案里无处安放。**

### 2.2 `unless` 一课的「一课一增量」与 6 条对比卡

**「一课一增量」逐字表述**：**`unless` ＝ 「除非」（except if）——一句话里有两个动作，第二个动作是第一个不发生的条件。**

| # | 对比卡（错 → 对） | 跨源依据（逐字） |
|---|---|---|
| 1 | `Unless I will hear from you, I'll see you at two o'clock.` ✗ → `Unless I hear from you, …` | **Cambridge typical errors** "**We don't use will or would in the clause after unless**"＋❌`Unless you'll pay now` |
| 2 | `Unless the weather will get better, the game will be cancelled.` ✗ → `… gets better …` | **中文侧 `unless` 专文逐字 ❌**（原文 `Unless the weather will get better, the soccer game will be cancelled. ❌`） |
| 3 | `Pete will drive unless Alex can't.` ✗ → `Pete will drive if Alex can't.` | **Cambridge typical errors** "**We don't use unless when we mean if**"（正解例逐字 `Pete will drive if Alex can't.`） |
| 4 | `We'll go to the coast tomorrow unless if it rains.` ✗ → `… unless it rains.` | **Cambridge `Conditionals: other expressions` 逐字** "**We don't use unless and if together**"＋❌`unless if it rains` |
| 5 | `What will you do unless you get the loan?` ✗ → `What will you do if you don't get the loan?` | **中文侧 `unless` 专文逐字** "**unless 不能出現在疑問句中**"＋❌ 原句 |
| 6 | `I don't know what we would have done unless we'd seen you.` ✗ → `… if we hadn't seen you.` | **Cambridge 逐字** "**We don't use unless for things that we know to be true**"（正解例 `I don't know what we would have done if we hadn't seen you.`） |

**✔ 6 条对比卡全部有跨源逐字依据，无一条需要自造。** → **`unless` 撑一课成立。**

### 2.3 `in case` 一课的「一课一增量」与 6 条对比卡

**「一课一增量」逐字表述**：**`in case` ＝ 「先做准备」——做前面那件事，不是因为后面的事发生了，而是因为后面的事可能发生。**

| # | 对比卡（错 → 对） | 跨源依据（逐字） | 性质 |
|---|---|---|---|
| 1 | `Let's take our swimming costumes if there's a pool at the hotel.`（语义错：说成「先知道才带」）→ `… in case there's a pool …` | **Cambridge 逐字 "We don't use in case to mean 'if'."＋对举例** | ✔ 跨源 |
| 2 | `In case of I forget later, here are the keys.` ✗ → `In case I forget later, …` | **Cambridge 逐字 "In case is a conjunction or adverb. In case of is a preposition."** | ✔ 跨源 |
| 3 | `In case breakdown, please press the alarm button.` ✗ → `In case of breakdown, …` | **Cambridge `In case of` 节逐字** "We use in case of + noun to mean 'if and when something happens'"＋例 `In case of breakdown, please press the alarm button and call this number.` | ✔ 跨源 |
| 4 | `I'll take cash if we need it on the ferry.`（语义错）→ `I'll take cash in case we need it on the ferry.` | **Cambridge 例 ＋ 逐字注** "（we don't know if we will need cash on the ferry）" | ✔ 跨源 |
| 5 | `just in case` 副词位置：`She doesn't want to say anything just in case I forget.` ✗ → `… just in case.` | **Cambridge 逐字** "She knows she's passed the oral exam, but she doesn't want to say anything **just in case**."（**副词用法，句尾不带从句**） | ✔ 跨源 |
| 6 | 「`in case` 后面能不能跟 `will`」 | **⚠️ 跨源未直接给**——Cambridge 未在 `In case (of)` 页给这条；`english.cool/in-case/` 与 `letmeenglish` 两处均 404 | 🔴 **须自造** |

**✔ 5 条跨源 ＋ 1 条自造。** → **`in case` 能撑一课，但第 6 条是自造**——**且中文侧零实证意味着全课脚手架（母语讲解、负迁移说明）都要自造**。**这是「封顶 1 课」的直接依据。**

### 2.4 `even though` 与 `though` 在这个课量下放哪里？

**答：只作对照位，不占独立课位。**

| 词 | 本轮安排 | 依据 |
|---|---|---|
| **`even though`** | **不作独立课；若轴 A 开课，只在 `unless` 课的「不」字家族对照位出现一次**（与 L139–L141 `although` 的强度梯度做一句对照） | **BC 逐字 "Even though is slightly stronger and more emphatic than although."——增量只有「强度」**；**中文侧专文的主体是 `even though` vs `even if`（条件 vs 事实），不是我方现在能承载的语义场** |
| **`though`（两义）** | **0 课（沿批二十五）** | **让步义：BC 逐字 "in the same way as although"（纯同义换词）**；**句尾义：五家源只给「一句话＋2–3 例」（附注级）** |
| **`in spite of`／`despite`** | **不作独立课**（本轮口径比批二十五更保守） | **两者共享一条规则（接名词/-ing）且共享 U113 一格**；**若要带入，只能占 `in case` 课的一个对照位（`despite the rain` vs `although it rained`）** |
| **`as long as`／`provided`** | **认读带入，不设考点**（沿批二十五） | **`provided` 跨源无独立规则页**；**`as long as` 与 `unless` 同 U115 一格、BC 只列举**；**我方两词 GL 0** |

### 2.5 轴 A 的 2 课表（本轮修订版）

| 课 | 主词 | 一课一增量 | 必造词位 | 上限 |
|---|---|---|---|---|
| **第 1 课** | **`unless`** | 「除非」＝ except if；**从句里不用 will；不能说成 if；不能问句** | **1**（`unless`） | 1 课 |
| **第 2 课** | **`in case`** | 「先做准备」＝ 不是发生了才做，是可能发生就先做 | **1**（`in case`） | 1 课 |
| **合计** | — | — | **2 词位** | **2 课（无第 3 课）** |

**⚠️ 与批二十五报法的差异**：批二十五的 2 课是「让步（`even though` ＋ `in spite of`／`despite`）＋ 条件（`unless`）」。**本轮改为「否定条件（`unless`）＋ 预防条件（`in case`）」。** 理由：**前者的第 1 课是 3 个短语条目／6 个词位，破线；后者的两课各 1 词位，在限内。**

---

## §3 轴 B 专项：`all` 的课程位与 `all`／`every` 分工

### 3.1 `all` 的课程位：三源一致「有」，且比 `both` 硬

| 源 | 逐字 | 判读 |
|---|---|---|
| **Murphy 中级 U90** | 标题归一化逐字 **`90alleverywhole`**；上下文逐字 **`…89both/bothofneither/neitherofeither/eitherof90alleverywhole91eachandevery…`** | **有课程位（三词共用）**，**且与 U89、U91 零间隔** |
| **Murphy 初级 U80** | 标题归一化逐字 **`80everyandall`**；上下文逐字 **`…79somebody/anything/nowhereetc.80everyandall81allmostsomeanyno/none82botheitherneither…`** | **有课程位（两词共用）**，题目本身就是「`every` 和 `all` 的分工」 |
| **BC 三档索引** | **A1-A2 14 课全目 / B1-B2 33 课全目 / C1 14 课全目本轮逐条点完**——**`all` 零专课**（唯一相关课 `Quantifiers: 'few', 'a few', 'little' and 'a bit of'`） | **BC 侧无课程位** |
| **BC 参考层 `quantifiers`** | 逐字 "Note: **with all and both, we don't need to use of**"；小节 `every and each` 逐字 "We use the quantifiers every and each with singular nouns to mean all" | **有规则页，但三词同表** |
| **Cambridge `All` 页** | **10 个小节 ＋ 2 条 Warning**（见 §1.2） | **规则页厚** |
| **中文侧 `letmeenglish.com/all-both/`** | 独立专文，**含 4 节规则 ＋ 10 道练习**，逐字 "**all/both: 句中和動詞的排列順序**"（**三条位置规则**） | **中文侧独立专文，且是 `all` ＋ `both` 合篇** |

**判定**：**`all` ＝ B＋ 档**。**规则页最厚（Cambridge 三页 ＋ 8 条 typical errors）、CEFR 最友好（两源一致 A1）、课程位比 `both` 硬（U89→U90 零间隔）**；**唯一短板是课程位与 `every`／`whole` 共用。**

### 3.2 `all` 与 `every` 的分工在跨源里的地位：**独立单元级**

**这是本轮的一个明确发现：跨源把「`all` vs `every`」当作必须成对处理的教学单元，而不是两个词各自的顺带一提。**

| 源 | 逐字证据 | 层级 |
|---|---|---|
| **Murphy 初级 U80** | 标题逐字 **`80everyandall`**——**上游直接把两者做成同一课的题目** | **独立单元** |
| **Cambridge `All or every?`** | **独立页**，面包屑逐字 `Grammar > Easily confused words > All or every?`；**4 条 typical errors** | **独立页（对比页）** |
| **BC 参考层** | 同一小节内逐字 "We use the quantifiers **every and each** with singular nouns to mean **all**"——**用 `all` 给 `every`／`each` 释义** | **同一小节** |
| **中文侧** | **两篇独立专文**（`each-vs-every` 页题「差在哪？」，`letmeenglish/every-each` 页题「用法和區別」）——**但两篇都只对 `each`，不对 `all`** | **`each`／`every` 有专文；`all` 在 `all-both` 篇** |

**我方实测对照**：
- **`every` GL 142 词次，`every` 后接词分布 ＝ `day` 110／`night` 6／`morning` 1——无第四种搭配**（本轮复算）；**HC 17 处亦全为时间语**。
- **`all` GL 5 词次**：`at all`（L69，1 处 ×2）／`You're all wet`（L109 对话，1 处）／**`lesson-117-all-i-wanted` 的 id 与 `hunt-all-i-wanted` 的 id（各 2 处）**——**无一处是量词义的 `all`**。
- **`each` GL 0／HC 0；`whole` GL 0／HC 0；`none` GL 0／HC 0**（本轮实测）。

**→ 结论**：**我方 `every` 是「已用但只用一个义项」的半熟词，`all` 是真零。跨源给的正是「把这两个身份摆到同一张表上」的课**——**这与 L148–L150 的「两个的脸」结构同型，可直接复用「排一行」的教学动作。**

### 3.3 `all` 能否撑 1–2 课？

| 课 | 增量来源（跨源逐字） | 判断 |
|---|---|---|
| **第 1 课：`all` 立岗** | **Cambridge `All` 页 `All as a determiner` 节逐字 "All means 'every one', 'the complete number or amount' or 'the whole'."** ＋ **`All with no article` 节**（`All children love stories.` 不用 the）＋ **中文侧 `all-both` 专文逐字 "我們使用 all + 名詞（中間沒有 the）"** ＋ **Cambridge `All or whole?` 逐字 "We can use all and the whole with of the"** | **✅ 可开**：**「all ＋ 名字（不带 the）＝ 全部的」是一条新的限定词规则**，与我方 L30（`some`／`any`／`much`／`many`）同族但**位置与搭配完全不同** |
| **第 2 课：`all` vs `every`（排一行）** | **Cambridge `All or every?` 逐字 "All refers to a complete group. Every refers to each member of a complete group"** ＋ **`Every` 页 typical errors 两条**（❌`Every was decorated`／❌`every days`）＋ **BC 逐字 "with all and both, we don't need to use of"** | **✅ 可开**：**「`all` + 复数／不可数 ＝ 整体；`every` + 单数 ＝ 逐个」是真正的取舍规则**；**且 `every` 在我方是「旧词新脸」——同一词从「每天」升格为「每一个」** |
| **第 3 课（若有）：`all` 的位置轴** | **中文侧 `all-both` 专文整节逐字**（動詞之前／Be動詞之後／助動詞之後／疑問句中放主詞之後）＋ **Cambridge `All as an adverb` 节逐字** "When all refers to the subject of a clause, it usually comes in the normal mid position for adverbs" | **⚠️ 与批二十五的 L148 `both` 位置课同型**——**批二十五已用「站最前面」动作；再来一次「站中间」是动作疲劳**（**对照 L145－L146「句尾」连用两次的教训**）→ **封顶，作第 2 课的考点，不单开** |
| **`whole` 轴** | **Cambridge `All or whole?` 页 ＋ `Whole` 页** | **❌ 不单开**（**它只有一条规则：`a/an` 配 whole 不配 all；不可数用 all the 不用 the whole**）——**是第 1 课的一个考点** |
| **`each` 轴** | **Cambridge `Each or every?` 页 2 条禁用（❌`Almost each car`／❌`Every of us`）＋ 中文侧两篇专文** | **⚠️ `each` 与 `every` 的差异（个别 vs 整体）与第 2 课重复**；**`each of` ＋ 复数名词配单数动词是新规则** → **作 `each` 认读位，不单开** |

**判定：`all` ＝ 2 课（1 课立岗 ＋ 1 课分工），3 课为上限且第 3 课必须是收口课。** **`each`／`whole` 作认读，不设独立考点。**

---

## §4 「同义换词 vs 新结构」甄别

> **判定标准**（沿批二十四／二十五红线）：若候选**只是已教内容的另一种说法**（同义、同句法、只换词），**课量必须封顶甚至不排期**。
> **已教同类内容基线（本轮实测）**：`although`／`but`（L139–L141）· `as soon as`／`when`（L142–L144）· `too`／`either`（L145–L147）· `both`／`neither`（L148–L150）· `some`／`any`／`much`／`many`（L30）· `look`（L125–L127，GL 242）· `would like`（L62）· `if`（L48）· `will`（L12，GL 622）

| 候选 | 判定 | 跨源逐字依据 | 课量含义 |
|---|---|---|---|
| **`unless`** | **🟢 新结构（本批最纯之一）** | **Cambridge 逐字 "We use the conjunction unless to mean 'except if'."＋专节 `Unless and if … not`**；**中文侧逐字 "Unless 其實可以看成 'If not'"＋"unless 不能出現在疑問句中"**——**「否定条件」是逻辑层，不是我方已教的任何一个句式** | **可开，1 课** |
| **`in case`** | **🟢 新结构（语义对立最干净）** | **Cambridge 逐字 "We don't use in case to mean 'if'."＋对举例**——**「可能发生 vs 已经发生」的对立，我方零覆盖**；**但中文侧实证为零（404 × 3）** | **1 课封顶** |
| **`even though`** | **🔴 同义换词（强度差异）** | **BC 逐字 "Even though is slightly stronger and more emphatic than although."**；**Cambridge 逐字 "even though carries the same meaning as although"** | **0 课（作对照位）** |
| **`in spite of`／`despite`** | **🟡 半新（换形）** | **BC 逐字 "After in spite of and despite, we use a noun, gerund (-ing form of a verb) or a pronoun."** vs **"After although and even though, we use a subject and a verb."**——**差异只在「接什么成分」** | **0 课（本批）／最多作 `in case` 课对照位** |
| **`though`（两义）** | **🔴 同义换词 ＋ 附注级** | **BC 逐字 "in the same way as although"**／**"Though can also go at the end of the second phrase."** | **0 课** |
| **`all`** | **🟢 新结构（限定词位置与搭配）** | **Cambridge 逐字 "All means 'every one', 'the complete number or amount' or 'the whole'."**＋**`All with no article` 节**（`All children love stories.`）＋**`All as an adverb` 节（中间位）**——**「all ＋ 名字不带 the」与「all 站中间」都是我方格子里没有的位置** | **可开，1 课（＋1 课分工）** |
| **`every`（量词义）** | **🟡 半新结构（旧词新脸）** | **Cambridge 逐字 "We use every + singular noun to refer individually to all the members of a complete group"**；**典型错误逐字 "We don't use every with a plural noun"（❌`every days`）**——**我方 110 处 `every day` 全是对的，但从来不是「每一个」** | **与 `all` 同课（1 课的一半）** |
| **`each`** | **🟡 半新（与 `every` 同轴）** | **Cambridge `Each or every?` 逐字 "It is often similar in meaning to every, but we use every to refer to a group or list of three or more things"**——**与 `all`／`every` 是同一张表** | **认读，不单开** |
| **`whole`** | **🔴 同义换词** | **Cambridge `All or whole?` 逐字 "We can use all and the whole with of the"**——**与 `all` 可互换** | **0 课（作第 1 课考点）** |
| **`seem`／`appear`** | **🟡 半新结构（新句法壳、旧语义场）** | **BC `Link verbs` 逐字 "After appear and seem we often use to be:"**；**Cambridge `Appear` 页 `Appear or seem?` 小节两条明文禁用**（❌`It appears crazy`／❌`It appeared a good choice`）；**中文侧逐字 "Appear 後面不能加 like/as if/as though 🚫"＋❌`It appears like you're depressed.`**——**`look` 完全不接 `to be`、也不受这条禁用约束** | **2 课封顶** |
| **`would rather`** | **🟡 半新结构（共享 `would + 原形` 壳）** | **Cambridge typical errors 逐字 "We don't use would rather or would sooner with an -ing form or a to-infinitive"**；**letmeenglish 专文逐字 "我們必須使用兩個動詞"**——**「原形不带 to」与 L62 `would like to` 恰好相反，是真新知识点** | **2 课封顶** |

---

## §5 课量建议

### 5.1 轴 A

| 候选 | 建议课量 | 为什么不能更多 |
|---|---|---|
| **`unless`** | **1 课** | **第 2 课只能是「`unless` vs `if not` 的等价／不等价」**（Cambridge 已有专节）——**与我方 L48 `if` 课重叠**；**`as long as`／`provided` 认读带入，提供不了第 2 课的独立增量** |
| **`in case`** | **1 课（封顶）** | **跨源只有 2 条硬增量 ＋ 中文侧实证为零**（404 × 3）——**第 6 条对比卡已须自造，第 2 课无来源** |
| **`even though`／`though`／`in spite of`／`despite`** | **0 课（对照位）** | **见 §2.4** |
| **轴 A 合计** | **2 课** | **两课各 1 词位，均在上限内；无第 3 课** |

### 5.2 轴 B

| 候选 | 建议课量 | 为什么不能更多 |
|---|---|---|
| **`all`（立岗）** | **1 课** | **第 3 课的位置轴与 L148 `both` 位置课动作重合**（「站最前面」刚用过） |
| **`all` vs `every`（分工）** | **1 课** | **`each` 轴与 `every` 轴在跨源是同一条线**（Cambridge `Each or every?` 与 `All or every?` 两页内容高度交叉）——**第 3 课无独立来源** |
| **`whole`／`each`** | **0 课（考点／认读）** | **`whole` 与 `all` 可互换；`each` 与 `every` 同轴** |
| **轴 B 合计** | **2 课（上上限 3 课）** | **3 课的第 3 课必须是收口课** |

### 5.3 轴 C

| 候选 | 建议课量 | 为什么不能更多 |
|---|---|---|
| **`seem`／`appear`** | **2 课** | **① 上游零课程位**（Murphy 双册 TOC 两词全 0，本轮复核）；**② 两词分工跨源只有一条线**（Cambridge 逐字 "We mostly use appear to talk about facts and events."＋中文侧「appear 更正式、只描述客观现象」）——**撑不起第三课**；**第 3 课只能是「与 L125–L127 `look` 三词排一行」的收口课**（**我方自研增量**） |

### 5.4 轴 D

| 候选 | 建议课量 | 为什么不能更多 |
|---|---|---|
| **`would rather`** | **2 课** | **① 上游一个单元（U59）且与 `prefer` 共用**；**② `would like` 的 `would + 原形` 壳已在 L62 付过账**；**③ 第三课只能是「`would rather you did`（不同主语＋过去式）」**——**跨源标位更高（Cambridge 把它与过去完成并列），建议留后续批次** |

---

## §6 四轴档位对比表与推荐

### 6.1 档位对照表

| 维度 | **轴 A：`unless`／`in case`** | **轴 B：`all`** | **轴 C：`seem`／`appear`** | **轴 D：`would rather`** |
|---|---|---|---|---|
| **最高档位候选** | **`unless` = A−** | **`all` = B＋** | **`seem`／`appear` = B** | **`would rather` = B−** |
| **课程位形态** | **Murphy 中级 U114／U115 相邻两格**（**零间隔**） | **中级 U89→U90 零间隔 ＋ 初级 U80 独立题目**（**两册各一格，跨册不连续**） | **❌ 双册全 0** | **中级 U59 一格（与 `prefer` 共用）** |
| **课程位粒度** | **U114 独占（最干净）／U115 三词共用** | **U90 三词一格／U80 两词一格** | **无** | **两词一格** |
| **Cambridge 独立规则页** | `Unless` 页 3 节（含 2 条 typical errors）＋ `Conditionals: other expressions` 页 2 条禁用；`In case (of)` 页 2 节 | **`All` 页 10 节 ＋ `All or every?` 页 ＋ `All or whole?` 页 ＋ `Every` 页 ＋ `Each or every?` 页（5 页）** | `Seem` 页 ＋ `Appear` 页（含 `Appear or seem?` 小节） | `Would rather, would sooner` 页 ＋ `Prefer` 页 |
| **BC 侧** | `conditionals-zero-first-second` 一句列举（**无独立小节**） | 参考层 `quantifiers` 一条 Note（**三档索引均为零专课**） | 参考层 `Link verbs`（elementary）＋ `stative-verbs`（B1-B2 共表） | **三档索引均零专课、且参考层无页** |
| **典型错误条数（Cambridge）** | `unless` **2＋2**／`in case` **0**（但 1 条核心禁忌） | **`all` 2＋4＋2＋`every` 2＋`each` 2 ＝ 12 条** | 0（**但 `appear` 页 2 条明文禁用**） | **2** |
| **中文侧实证** | `unless` 独立专文（**3 ❌**）／**`in case` 404 × 3** | **`letmeenglish/all-both` 独立专文（4 节 ＋ 10 题）＋ `each-vs-every`／`every-each` 两篇** | `english.cool/seem` 独立专文（**3 ❌**）＋ `letmeenglish/you-seem` | **`english.cool/would-rather` 404 × 3**；`letmeenglish/id-rather-than` 独立专文（**唯一中文实证**） |
| **CEFR** | `unless` **B1**（两源一致）／`in case` **未取到** | **`all` A1（两源一致）**／`every` A1／`each` A1／`whole` A2 | `seem` Cambridge **B1** vs Oxford **A2**（**分裂**）／`appear` **B1** | `would rather` Cambridge **B1** |
| **必造词位** | **2**（`unless` ＋ `in case`） | **1–2**（`all` ＋ 可选 `each`） | **2**（`seem` ＋ `appear`） | **1**（`would rather`；连 `prefer` 则 2） |
| **我方现状** | `unless` **0／0**／`in case` **0／0**／`case` **GL 0／HC 1（注释）** | **`all` GL 5（全非量词义）／`every` GL 142（全为时间语）／`each` 0／`whole` 0** | `seem` **0／0**／`appear` **0／0** | `would rather` **0／0**／`prefer` **0／0**／`would` GL 163（L62） |
| **与已交付内容的撞车风险** | **高**：连词家族已连排 4 批（L139–L144） | **中**：与 L148–L150 同季相邻，但语义场是「两个 → 三个以上」的**下一步** | **中**：与 L125–L127 `look` 同族（BC 同表） | **中**：共享 `would + 原形` 壳（L62） |
| **批二十五押后理由状态** | **四条理由全部成立；本轮把课量口径从「让步＋条件」改为「否定条件＋预防条件」** | **无押后理由（本轴首次评估）** | 无变化 | 无变化 |

### 6.2 哪个更强？

- **问「档位更高」**：**轴 A**。**`unless` 是 A−，且 U114／U115 是本轮唯一的连续课位链。** 按本项目档位体系（跨源有课程位 ＋ 我方有缺口 ＝ A 档的构成要件），**轴 A 在定义上更强**。
- **问「本批更该做」**：**轴 B**。**理由①：成本更低**（**1–2 词位 vs 轴 A 的 2 词位**——**本轮两轴成本罕见地接近，但轴 B 更低**）；**理由②：CEFR 更稳**（**`all` A1 两源一致 vs `unless` B1／`in case` 未知**——**B 轴完美匹配「零基础」的产品定位**）；**理由③：教学动作零成本迁移**（**轴 B 可直接复用 L148–L150 刚建立的「排一行／两张脸」壳；`all` vs `every` 就是「同一个位置换词换脸」，与我方连续三批的切分法一致**）；**理由④：轴 A 的动作疲劳风险更实**（**L139–L144 是连词家族连排 3 批；再排就是第 4 批**）。

### 6.3 关键约束：轴 A 与轴 B 不能同年连排

**两轴都依赖「位置」动作**：
- **轴 A**：`in case` 的「先做准备」要把「做」的动作提到前面（顺序感）；
- **轴 B**：`all` 的中间位（Cambridge `All as an adverb`）＋ `all` 与 `every` 的搭配位。

**撞车点**：**L145／L146 刚用「句尾」动作连讲两课，L148 刚用「站最前面」**——**批二十六若再开一个「位置」轴，是连续第三批的「成分站哪儿」。** → **建议：两轴择一；若选 B，则 A 顺延一批；若选 A，则 B 顺延。**

### 6.4 我的推荐

**推荐：轴 B `all` 优先（批二十六，2 课），轴 A 顺延（批二十七）。**

**理由（四条，按权重排序）**：

1. **成本门是硬门。** **轴 B 1–2 词位；轴 A 2 词位但必须放弃 `even though`／`in spite of`／`despite` 三个高分候选**——**放弃之后轴 A 只剩 `unless` ＋ `in case`，其「让步」语义场的主角全部落空，档位优势被削弱。** 而**轴 B 用一个词位换来 5 个 Cambridge 页面 ＋ 12 条典型错误的支撑**。
2. **轴 B 的 CEFR 落点对零基础更安全。** **`all`／`every`／`each` 三词两源一致 A1**（Oxford `cefr="a1"` 实取）；**轴 A 的 `unless` 是 B1、`in case` 连标位都取不到**。**对照我方现教段位，B 轴更稳。**
3. **轴 B 是「中文一个『都』字」的第三格，闭环价值高。** **批二十四教 `too`／`either`（也）、批二十五教 `both`／`neither`（两个）、本批 `all`（三个以上）**——**中文「都」的三向对应是本项目已经登记在册的携带项**（**批二十五路线图 §6 携带项 4 逐字**：「中文「都」对应 `both`（肯定）／`neither`（否定）／`all`（三个以上）——**`all` 未教且本批不碰**」）。**本批做 `all` 即关闭该携带项。**
4. **轴 B 有一个「我方自研增量」轴 A 没有。** **`every` 的「旧词新脸」**——**142 词次的 `every day` 已经在我方语料里躺了 100 多课，本批第一次把它抬到主位讲「每一个」**。**这是我方独有、跨源没有的教学机会**（上游的 `every` 课都是从头教的）。

### 6.5 若主理人仍选轴 A：最低风险配置

- **课量固定 2 课**，**第 1 课 `unless` 单点、第 2 课 `in case` 单点**（**不要按批二十五的「让步＋条件」切**——那会破造词线）
- **`as long as`／`provided` 认读不带考点**；**`even though`／`though`／`in spite of`／`despite` 全部推到批二十七**
- **开工前置项**：① 先通读 `english.cool/as-long-as/`（**本轮只确认 200，未通读**）；② 为 `in case` 的第 6 条对比卡（`in case` 从句里能否用 will）**先做一次跨源补查或明确标注为自造**

---

## §7 Non-goals 依据

| 项 | 判定 | 依据 |
|---|---|---|
| **`though`（全部义项）** | **不做** | **① 让步义：BC 逐字 "Though can be used in the same way as although."（纯同义换词）**；**② 句尾义：五家源全部只给「一句话＋2–3 例」，无一家给独立单元位**（**批二十五已判，本轮复核成立**）；**③ 我方 L139–L141 已做完 `although` 三课且 L141 已收口** |
| **`even though`** | **不做（本批）** | **① 唯一增量是「强度」**（BC 逐字 "slightly stronger and more emphatic than although"）；**② 中文侧专文的主体是 `even though` vs `even if`（条件 vs 事实），属条件语义场，不是本批能承载的**；**③ 课程位是五词共用一格** |
| **`in spite of`（单开）** | **不做** | **① 与 `despite` 是同一规则的两个拼法**（中文侧逐字「可以互相抽換」）；**② Cambridge 把两者做成同一页**；**③ BC 把它与 `although` 放同一课** |
| **`as long as`／`provided`（单开）** | **不做** | **① 与 `unless` 共用 Murphy U115 一格**；**② `provided` 跨源无独立规则页**；**② 我方两词 GL 0——单开则每课 1 词位但无增量** |
| **`whole`（单开）** | **不做** | **① Cambridge `All or whole?` 逐字 "We can use all and the whole with of the"——与 `all` 可互换**；**② 中文侧 `all-both` 专文全页不提 `whole`——中文侧实证为零** |
| **`each`（单开）** | **不做** | **① 与 `every` 的差异在跨源只有一条线**（Cambridge 逐字 "It is often similar in meaning to every, but we use every to refer to a group or list of three or more things"）；**② `each of` ＋ 复数名词是唯一新规则，可作 `all` 课考点** |
| **`all` 的位置轴（单开第 3 课）** | **不做** | **① 与 L148 `both` 位置课动作重合**（**L148 已用「站最前面」，GrammarLabel 逐字 `两个都 · both 站最前面`**）；**② 中文侧 `all-both` 把位置规则与 `both` 合写一节——上游也没有单开** |
| **`none`／`most of`／`a lot of`** | **不做（本批）** | **我方 `none` GL 0／`most of` GL 0／`most` GL 32 但全在 L31 最高级（`most beautiful`）**——**属「数量词家族」的后续批次，本批不扩轴** |
| **`would rather` 的第 3 课** | **不做** | **`would rather you did`（不同主语＋过去式）属虚拟层，Cambridge 把它与过去完成并列，标位更高** |

---

## §8 未核实项

| # | 项 | 现状 | 影响 |
|---|---|---|---|
| **①** | **Murphy 单元内部例句、页码、练习量** | **本机只有官方 TOC 抽文**（`/private/tmp/murphy_int.txt` 本轮 md5 复算 = `994fde91a0ca7e2d6a7417ed5c72b1d5`，**与批二十四／二十五登记值一致** ✅；`murphy_ess.txt` = `6b839c0a736b13a7af38872cdf0fbaf7` ✅；`murphy_full.txt` = `52f8be43fe1b5a2dffb0b2bfedaadff4`，**与 `murphy_int.txt` 同源不同抽法，本轮两件交叉核过 U87–U91／U113–U115 标题一致**） | **不影响判档**（判据是「有无单元位」）；**影响「上游一课给多少例句」的容量估算** |
| **②** | **`in case` 的词典 CEFR 标注** | **三度实取失败**（`dictionary.cambridge.org/dictionary/english/in-case` 全部 302 到 `referee?q=in-case`）；**Oxford 侧未取** | **影响 `in case` 的难度定位**——**不影响档位**（**判据是课程位：Murphy U114 独占单元 ＋ Cambridge 独立语法页**） |
| **③** | **Murphy 中级 U90 内部 `all`／`every`／`whole` 的篇幅配比** | **无正文** | **若 U90 内 `all` 占大半页，`all` 的档位可上调半档**——**但「三词共用一格」的课程位形态不变** |
| **④** | **BC 三档索引的课数：两个通道不一致** | **WebFetch 通道**：`a1-a2-grammar` 页列出 **18 课**（本轮实取）；**本机 Wayback 缓存 HTML 通道**：抽出 **A1-A2 14 slug／B1-B2 33 slug**（**批二十五登记 18／36**）；**C1 14 slug 两轮一致** | **两种口径下「无 `all`／`every`／`each`／`seem`／`appear`／`would rather`／`unless`／`in case` 专课」的结论一致** ✅——**课数差异不影响档位**；**但「BC 三档共 N 课」这个数字本轮不能给出**（**批二十五的 68 课这个数本轮无法复现**） |
| **⑤** | **BC 侧 `all`／`every` 是否有独立参考页** | **本轮实测：BC 参考层 `Determiners and quantifiers` 页子主题只有 5 个，`all`／`every` 只在 `Quantifiers` 页正文内** | **「BC 侧零专课、有规则页」结论成立**；**本轮只核了 BC 参考层 3 页 ＋ 4 个专课页，未穷举全部参考页** |
| **⑥** | **BC 直连多次超时** | **本轮 `learnenglish.britishcouncil.org` 直连（urllib 与 curl）多次 read timeout**；**改用 WebFetch 成功取得 `quantifiers`／`link-verbs`／`stative-verbs`／`conditionals-zero-first-second` 四页**；**B1-B2／C1／A1-A2 三档索引改用本机 Wayback 缓存 HTML（`/private/tmp/b1b2_arch.html` 等）逐条点目** | **本轮 BC 侧结论的可复现通道是「WebFetch ＋ 本机 Wayback 缓存」**；**与批二十四「sitemap 实取」口径不同**（**批二十五已登记过同一冲突**） |
| **⑦** | **`english.cool/would-rather/` 与 `in-case/`** | **本轮分别实测 404**（**三度确认**）；**`letmeenglish.com/in-case/` 与 `in-case-of/` 亦 404**（本轮新增） | **`would rather` 的中文实证只有 letmeenglish 一篇；`in case` 中文侧连续两轮为零**——**这是两者「课量封顶」的直接依据，不是信息缺失** |
| **⑧** | **`letmeenglish.com` 的 `all-both` 篇是否代表中文侧全部** | **本轮只取了 letmeenglish 一篇 ＋ english.cool 两篇 `each`／`every` 专文**；**百度百科／沪江等站未取** | **`all` 的中文侧实证为「1 篇厚文（含 10 题练习）」，不是「多源」**——**若主理人需更强中文侧证据，建议生产期补查** |
| **⑨** | **`english.cool/as-long-as/`** | **本轮未复测**（批二十五实测 200 但未通读） | **只影响轴 A 的「`as long as` 能否带入」的细节，不影响档位** |
| **⑩** | **`every` 的 27 处非时间语用法** | **本轮实测：`every` 后接词分布 = `day` 110／`night` 6／`morning` 1**；**另有 27 处出现于案件 `tokens` 与注释中的同一批 `every day`**（**逐条定性后全部是同一用法**） | **「`every` 只作频率副词」这一判定成立**；**但 `everything`（GL 1）与 `everyone`（GL 1）需在第 2 课作为「`every` 不能单独站」的对照处理** |
| **⑪** | **我方 `courseVocabulary` 对 `all`／`every` 的计数单位** | **本报告按词计，未核实现层** | **影响轴 B 的精确成本（1 词 vs 2 词）**——**两种算法下轴 B 都在历史上限内** |

---

## §9 附录：核查留痕

### A.1 我方数据（本轮独立复算，2026-09-20）

| 项 | 命令／方法 | 结果 |
|---|---|---|
| 课程总数 | `grep -c "number:" src/data/grammarLessons.ts` | **150** ✅（末课 `number: 150`） |
| 案件总数 | 同上（`huntCases.ts`） | **159** ✅ |
| 季总数 | `grep -c 'id: "season-' src/data/grammarSeasons.ts` | **25** ✅（末项 `season-25 {min:148, max:150}`） |
| 末三课标签 | 逐字抽取 | `148 两本都好 \| 两个都 · both 站最前面`／`149 两本都不好 \| 两个都不 · neither 上，both 让位`／`150 两个排一行（收口） \| 收口 · 零新知（两个的脸）` |
| `all` | python 词边界 `(?<![A-Za-z])all(?![A-Za-z])` | **GL 5 ／ HC 9**；**GL 5 逐处定性**：L69 `at all`（×2）／L109 对话 `You're all wet`／L117 id `lesson-117-all-i-wanted`／`hunt-all-i-wanted` id——**无一处量词义** ✅ |
| `every` | 同上 | **GL 142 ／ HC 17**；**后接词分布 `day` 110／`night` 6／`morning` 1**——**无第四种搭配** ✅ |
| `each`／`whole`／`none`／`a lot of`／`all of`／`most of` | 同上 | **全 0 / 全 0** ✅ |
| `most` | 同上 | **GL 32**——**全在 L31 最高级（`most beautiful`）** |
| `seem`／`seems`／`seemed`／`appear`／`appears`／`appeared` | 同上 | **六个真零（GL 0／HC 0）** ✅ |
| `would rather`／`rather`／`prefer` | 同上 | **全 0 / 全 0** ✅ |
| `unless`／`in case`／`case` | 同上 | `unless` **0／0**；`in case` **0／0**；`case` **GL 0／HC 1**（文件头注释内，非教学） ✅ |
| `though`／`even though`／`in spite of`／`despite`／`even` | 同上 | `though` GL 3（**L139 ×2／L141 ×1，全为引述**）／`even though` 0／`in spite of` 0／`despite` 0／`even` 0 |
| 对比卡结构 | 逐课统计 `wrong:` 计数 | **分布 `{6: 150}`——全部 150 课均为 6 条**（合计 900 条） ✅ |
| `bothRight` 分布 | 逐课统计 | **`{0:41, 1:9, 2:13, 3:51, 4:36}`**（L148 3 条／L149 3 条／L150 2 条） |
| 收口课总数 | 统计 `grammarLabel` 含「收口」 | **18 课**（其中含「零新知」**13 课**） |
| `either`／`both`／`neither` 分课落位 | 逐课计数 | `either` 98（L146 49／L147 38／L149 9／L150 2）／`both` 154（L148 70／L149 38／L150 46）／`neither` 92（L149 54／L150 38） |
| 词表内词位 | 词边界 | `look` **242**／`would` **163**（L62）／`will` **622**／`if` **147** |

### A.2 Murphy 双册官方 TOC（本机原件，md5 复算）

| 文件 | md5（本轮复算） | 与历史登记 |
|---|---|---|
| `/private/tmp/murphy_int.txt`（中级 4th） | `994fde91a0ca7e2d6a7417ed5c72b1d5` | **与批二十四／二十五一致** ✅ |
| `/private/tmp/murphy_ess.txt`（初级 4th） | `6b839c0a736b13a7af38872cdf0fbaf7` | **与批二十四／二十五一致** ✅ |
| `/private/tmp/murphy_full.txt` | `52f8be43fe1b5a2dffb0b2bfedaadff4` | **本轮新增登记**（与 `int` 同源异抽，交叉核过 U87–U91 与 U113–U115 标题一致） |

**本轮逐字取到的单元标题（去空白归一化原文）**：
- **中级（限定词块）**：`87much,many,little,few,alot,plenty` ＋ `88all/allofmost/mostofno/noneofetc.` ＋ **`89both/bothofneither/neitherofeither/eitherof`** ＋ **`90alleverywhole`** ＋ **`91eachandevery`**——**`88→89→90→91` 四格零间隔** ✅
- **中级（让步与条件块）**：**`113althoughthougheventhoughinspiteofdespite`** ＋ **`114incase`** ＋ **`115unlessaslongasprovided`** ＋ `116as(asIwalked/asIwasetc.)` ＋ `117likeandas` ＋ `118likeasif`——**`113→114→115` 零间隔**（**批二十四／二十五结论本轮独立复现** ✅）
- **中级（Modals 块）**：`58Verb+-ingorto3(like/wouldlikeetc.)` ＋ **`59preferandwouldrather`** ＋ `60Preposition(in/for/aboutetc.)+-ing`——**`would rather` 的课程位与 `prefer` 共用一格** ✅
- **初级（限定词块）**：`79somebody/anything/nowhereetc.` ＋ **`80everyandall`** ＋ **`81allmostsomeanyno/none`** ＋ **`82botheitherneither`** ＋ `83alotmuchmany` ＋ `84(a)little(a)few`——**`80` 的题目本身就是 `every and all`** ✅
- **初级（助动词块）**：`40Iam,Idon'tetc.`／`41Haveyou?Areyou?Don'tyou?etc.`／`42too/eithersoamI/neitherdoIetc.`／`43isn't,haven't,don'tetc.`——**与限定词块相隔 40 格** ✅
- **初级（连词块）**：`97andbutorsobecause`／`98When…`／`99Ifwego…`／`100IfIhad…`／`101apersonwho…`／`102thepeoplewemet…`——**初级册无 `though`／`unless`／`in case`／`although`** ✅

### A.3 Cambridge（本轮实取 18 页）

| # | 页 | 取到情况 | 关键逐字 |
|---|---|---|---|
| C-1 | `grammar/british-grammar/all` | ✅ | 页题 "All"；面包屑 `… > Quantifiers > All`；**10 节**；**2 条 Warning**；定义句 "All means 'every one', 'the complete number or amount' or 'the whole'." |
| C-2 | `grammar/british-grammar/every` | ✅ | 页题 "Every"；面包屑 `… > Determiners > Every`；**typical errors 两条**（`Every was decorated` ✗／`every days` ✗） |
| C-3 | `grammar/british-grammar/each` | ✅ | 页题 "Each"；**4 节**；"Each is a determiner or a pronoun." |
| C-4 | `grammar/british-grammar/whole` | ✅ | 页题 "Whole"；面包屑 `… > Determiners > Whole`；"Whole is a determiner." |
| C-5 | `grammar/british-grammar/all-or-every` | ✅ | 页题 "All or every?"；面包屑 `Grammar > Easily confused words > All or every?`；**4 条 typical errors** |
| C-6 | `grammar/british-grammar/each-or-every` | ✅ | 页题 "Each or every?"；面包屑 `… > Easily confused words > Each or every?`；**2 条禁用**（❌`Almost each car`／❌`Every of us`） |
| C-7 | `grammar/british-grammar/all-or-whole` | ✅ | 页题 "All or whole?"；面包屑 `… > Easily confused words > All or whole?`；**2 条 typical errors** |
| C-8 | `grammar/british-grammar/quantifiers`（索引） | ✅ | 面包屑 `… > Quantifiers`；子页清单**含 `All`／`Both`／`Either`／`Most`／`No, none and none of`——不含 `Every`／`Each`**（**`Every` 在 `Determiners` 组下，`Each` 与之并列**） |
| C-9 | `grammar/british-grammar/nouns-pronouns-and-determiners` | ✅ | 逐字 "Common determiners are: the, those, my, her, **both, all**, several and no."——**`both` 与 `all` 在剑桥的分类里并列** |
| C-10 | `grammar/british-grammar/unless` | ✅ | 页题 "Unless"；面包屑 `… > Conjunctions and linking words > Unless`；**3 节**；**2 条 typical errors**；**1 条 Warning** |
| C-11 | `grammar/british-grammar/in-case` | ✅ | 页题 "In case (of)"；面包屑 `… > Conditionals and wishes > In case (of)`；**逐字 "We don't use in case to mean 'if'."** |
| C-12 | `grammar/british-grammar/conditionals-other-expressions-unless-should-as-long-as` | ✅ | 页题 "Conditionals: other expressions (unless, should, as long as)"；**2 条 Warning**（❌`unless if it rains`／不用 `unless` 于不可能条件） |
| C-13 | `grammar/british-grammar/seem` | ✅ | 页题 "Seem"；面包屑 `Grammar > Verbs > Using verbs > Seem`；**3 节**（連綴動詞／`to`-infinitive／`there seems to be`） |
| C-14 | `grammar/british-grammar/appear` | ✅ | 页题 "Appear"；**含 `Appear or seem?` 小节 ＋ 2 条明文禁用** |
| C-15 | `grammar/british-grammar/would-rather-would-sooner` | ✅ | 页题 "Would rather, would sooner"；面包屑 `… > Verb patterns > …`；**2 条 typical errors**；**`much rather`／`I'd rather not`／`would sooner` 三节** |
| C-16 | `grammar/british-grammar/although-or-though`（沿批二十五） | ✅ | **7 节**含 `Though meaning 'however'`；**1 条 Warning（逗号）** |
| C-17 | `grammar/british-grammar/in-spite-of-and-despite`（沿批二十五） | ✅ | **1 条 Warning**（"We don't use a that-clause after in spite of or despite"） |
| C-18 | `grammar/british-grammar/determiners`（易错索引） | ✅ | 面包屑 `Grammar > Common mistakes in English > Determiners`；**24 个子页清单，含 `Determiners: all + period of time`／`Determiners: most of or most?`**——**无 `all`／`every` 的独立错误页** |

**词典 CEFR 实取（逐字）**：`all` **A1**（determiner）＋ **A2**（adverb "completely"）＋ `all but` **C2**；`every` **A1**（ALL）＋ **A1**（REPEATED）＋ **B2**（GREATEST）；`each` **A1**；`whole` **A2** ＋ `the whole of something` **B1**；`seem` **B1**；`appear`（SEEM）**B1**；`would rather` **B1**（phrase）。

### A.4 Oxford（本轮实取，`cefr="…"` 属性）

| 词 | 义项 CEFR | 标记 |
|---|---|---|
| `all` | **a1**（三义全 A1） | `ox3000` |
| `every` | **a1**（义1）／**b1**（义2）／**b2**（`every other`） | `ox3000` |
| `each` | **a1** | `ox3000` |
| `whole` | **a2** ＋ **b2** | `ox3000` |
| `seem` | **a2** ＋ **b2** | `ox3000` |
| `appear` | **a2** ＋ **b1** ＋ **b2** | `ox3000` |
| `unless` | **b1** | — |

**⚠️ 口径分裂登记**：**`seem` 在 Cambridge 标 B1、Oxford 标 A2（低一档）；`appear` 两源均为 B1**——**沿批二十四口径，取「以 A2 为主、B1 为辅」**。

### A.5 BC LearnEnglish（本轮实取 4 页 ＋ 3 档索引 ＋ 1 份参考层索引）

| # | 资源 | 取到情况 | 关键逐字 |
|---|---|---|---|
| B-1 | `grammar/english-grammar-reference/quantifiers` | ✅（WebFetch） | **8 节**；**Level: beginner ×3／intermediate ×2**；**逐字 "Note: with all and both, we don't need to use of."**／**"We use the quantifiers every and each with singular nouns to mean all"**；例 `All the supermarkets were closed.`／`He's spent all (of) the money that we gave him.`／`There was a party in every street.`／`Each child was given a prize.` |
| B-2 | `grammar/english-grammar-reference/link-verbs` | ✅（WebFetch） | 页题 "Link verbs"；**Level: elementary**；**"After appear and seem we often use to be"**；**link verbs 全表 `be, become, appear, feel, look, remain, seem, sound, get, go, grow, taste, smell`** |
| B-3 | `grammar/b1-b2-grammar/stative-verbs` | ✅（WebFetch） | **B1／B2**；**逐字 "senses and perceptions: appear, be, feel, hear, look, see, seem, smell, taste"** |
| B-4 | `grammar/b1-b2-grammar/conditionals-zero-first-second` | ✅（WebFetch） | **B1／B2**；**"It is also common to use this structure with unless, as long as, as soon as or in case instead of if."**；例 `I'll give you a key in case I'm not at home.`；**`unless`／`in case` 均无独立小节** |
| B-5 | `grammar/a1-a2-grammar` | ⚠️ **两通道数字不一致** | **WebFetch 通道列出 18 个课标题**（本轮实取）；**本机 Wayback 缓存 HTML 通道抽到 14 个 `a1-a2/…` slug**——**两通道均无 `all`／`every`／`each` 专课** ✅（**出入登记见 §8 未核实项 ④**） |
| B-6 | `grammar/b1-b2-grammar` | ⚠️ **同上** | **本机缓存 HTML 通道抽到 33 个 `b1-b2/…` slug**（**批二十五登记 36**）；**逐条核过：无 `all`／`every`／`each`／`seem`／`appear`／`would rather`／`unless`／`in case` 专课** ✅ |
| B-7 | `grammar/c1-grammar` | ✅（本机缓存 HTML） | **14 个 `c1/…` slug 逐条核过：无上述任何候选专课** ✅ |
| B-8 | `grammar/english-grammar-reference/determiners-quantifiers` | ✅（WebFetch） | 子主题 5 个：`Specific and general determiners`／`The indefinite article`／`The definite article`／`Interrogative determiners`／`Quantifiers`——**无 `all`／`every` 独立子主题** |
| B-9 | 直连 `learnenglish.britishcouncil.org` | **⚠️ 多次 read timeout**（urllib／curl 均超时） | **本轮 BC 侧结论的可复现通道 ＝ WebFetch ＋ 本机 Wayback 缓存**（**见 §8 未核实项 ⑥**） |

### A.6 中文侧（本轮：english.cool 状态码 14 条 ＋ letmeenglish 状态码 7 条 ＋ 实取 8 篇）

| 篇目 | 状态 | 页题逐字／关键逐字 | 与候选项 |
|---|---|---|---|
| `english.cool/each-vs-every/` | ✅ 200 | 「「each」和「every」差在哪？用法一次搞懂」；**逐字** "each 是「一個一個分開看」，強調的是個別的成員；every 是「全部加起來一起看」，強調的是整體、沒有例外"；**两条 ❌**（`She had a shopping bag in every hand. ❌`／`Almost each shop … ❌`） | **轴 B** |
| `english.cool/each-every/` | ✅ 200 | 「「each」用法是？跟 every 差在哪？例句一次搞懂！」；**逐字** "each 的核心就是「個別、一個一個地」看"／"它後面接的東西永遠是單數，動詞也用單數"／"**主詞 + each + 動詞**"（**4 种用法**） | **轴 B** |
| `letmeenglish.com/every-each/` | ✅ 200 | 「every 和 each 的用法和區別」；**逐字** "**當事物只有兩個時，必須使用 each。當事物超過兩個時，可以選擇 each 或 every。**"；**1 条 ❌**（`He wore a different shoe on every foot.`） | **轴 B** |
| `letmeenglish.com/all-both/` | ✅ 200 | 「一次搞懂 all／both 用法！the 與 of 差異＋例句與練習」；**4 节规则 ＋ 10 题练习**；**逐字** "我們使用 all + 名詞（中間沒有 the）"／"all/both + of 可以用在 the/my/Tom's + 名詞 之前。但 of 經常被省略"／"**all/both: 句中和動詞的排列順序**"（**4 条位置规则**） | **轴 B（本批最厚中文侧证据）** |
| `english.cool/unless/` | ✅ 200 | 「「Unless」正確用法是？ 可以用在疑問句嗎？」；**逐字** "Unless 的中文意思就是「除非…否則…」"／"Unless 其實可以看成 'If not'"／"**unless 不能出現在疑問句中**"；**3 条 ❌**（含 `Unless the weather will get better, … ❌`） | **轴 A** |
| `english.cool/in-case/` | **❌ 404**（三度） | — | **轴 A（零实证）** |
| `letmeenglish.com/in-case/` | **❌ 404**（本轮新增） | — | **轴 A（零实证）** |
| `letmeenglish.com/in-case-of/` | **❌ 404**（本轮新增） | — | **轴 A（零实证）** |
| `english.cool/seem/` | ✅ 200 | 「「seem」正確用法是？跟 appear 用法差在哪？」；**逐字** " Seem 在文法中被歸類為「連綴動詞」"／"**Appear 後面不能加 like/as if/as though 🚫**"；**3 条 ❌**（含 `It appears like you're depressed. ❌`） | **轴 C** |
| `letmeenglish.com/you-seem/` | ✅ 200 | 「常用口語句型之 "You seem…" 的用法」；**逐字** "seem 可以有多種用法，但在這個結構中"seem + 形容詞""；**含 `It seems that`／`It seems as if`／`It seems to somebody that`／`seem to + 動詞` 四型** | **轴 C** |
| `english.cool/would-rather/` | **❌ 404**（三度） | — | **轴 D** |
| `letmeenglish.com/id-rather-than/` | ✅ 200 | 「常用口語句型之 "I'd rather … than …" 的用法」；**逐字** "**在使用這個結構時，我們必須使用兩個動詞**"；**3 例** | **轴 D（唯一中文实证）** |
| `english.cool/all/` | **⚠️ 301 → `all-countries-capitals-english/`**（**与 all 无关**） | — | **轴 B：中文侧主站无 `all` 专文** |
| `english.cool/every/` | **⚠️ 301 → `every-day-everyday/`** | — | **轴 B：中文侧主站 `every` 只有「每天 vs 日常」一篇** |
| `english.cool/whole/` | **❌ 404** | — | **轴 B：`whole` 零实证** |
| `english.cool/although/`·`although-despite/`·`even-though/`·`despite/` | ✅ 200（沿批二十五，本轮复测状态码） | 见批二十五 §A.6 | **轴 A（对照位）** |

---

> 本报告由产品战略团队 AI 协作生成（竞析），重要结论请由主理人复核；跨源证据已逐条标注来源与取法，未核实项见 §8。
