# 竞品分析：B 档前沿普查（动词短语 × 程度数量）· 竞析报告

| 字段 | 值 |
|---|---|
| 报告 | 竞品/跨源分析（竞析）· **第三十一批 B 档前沿普查** |
| 日期 | **2026-09-20** |
| 本轮任务 | **15 项从未评估候选的跨源档位判定**（A 组动词短语 7 项 · B 组程度数量 8 项）＋ **「与已教内容重叠」甄别** ＋ **动词短语「词汇点 vs 语法点」专项** ＋ **造词成本** ＋ **排期建议** |
| 我方快照 | `/Users/liujun/Documents/英语听写/src/data/grammarLessons.ts`（**160 课**，末课 `number: 160` · `lesson-160-seem-to` · 31009 行）· `src/data/huntCases.ts`（**169 案**，末案 `number: 169` · 9149 行）· `grammarSeasons.ts`（**30 季**） |
| 跨源取到 | **Cambridge 语法页 24 页直连**（含新取 `Phrasal verbs and multi-word verbs`／`Quantifiers`／`Lots, a lot, plenty`／`Plenty`／`Most, the most, mostly`／`Enough`／`Too`／**`Whole`**／**`All or whole?`**／`Little, a little, few, a few`／**`Common mistakes in English` 三个索引页**）· **Cambridge 词典 16 条 CEFR**（含 7 个短语动词独立词条）· **Oxford 词典 12 条 CEFR** · **BC 实取 8 页 ＋ 三档 68 课全目** |
| ⚠️ 未取到 | **Murphy 双册 TOC**——本机归一化文件**不在本机**（`find` 全盘 0 命中），`cambridge.org` 403、`archive.org` 超时。**本报告 Murphy 层全部标注「沿用既有记录、本轮未复核」**（§7 项 1）。**BC 直连 curl 全程 403/超时**，改用 WebFetch 取到（§7 项 2） |
| 口径 | **词次 ＝ 引号内字符串的整词命中**（ASCII 边界 `(?<![A-Za-z])w(?![A-Za-z])`，**跨行引号不计断行**）；**整行 `//` 注释剔除**；**id 串假阳性逐条复看** |

---

## §0 本轮结论速览（7 条）

1. **【最重要发现】Cambridge 把 `look after`／`look for` 明确归为 `Prepositional verbs`（介词动词），不是 `Phrasal verbs`（短语动词）。** 逐字证据在 `Phrasal verbs and multi-word verbs` 页：`look after (a child)` 与 `look for` 都列在 **`H2: Prepositional verbs`** 的名单里，而 `Phrasal verbs` 名单里**一个都没有**。**→ A 组 7 项在跨源里不是同一类**：`give up`／`come back`／`go on`／`find out` 是短语动词；**`look after`／`look for` 是介词动词；`take care of` 是「动词＋名词＋介词」的固定搭配**（§3.1）。**这项切分直接决定它们的档位不同。**
2. **BC 有 B1-B2 专课 `Phrasal verbs`，且有 C1 专课 `Word order in phrasal verbs`——动词短语是唯一「有真课程位」的一组。** 逐字：B1-B2 页题 `Phrasal verbs`、Level `B1 Intermediate`／`B2 Upper intermediate`；C1 页题 `Word order in phrasal verbs`、Level `C1 Advanced`。**→ 断句规则（可分/不可分/代词必夹中间）在跨源是一个独立教学单元，不是我方要造的。**
3. **但 A 组 7 项作为「词」仍然是零课程位**——BC 那两课教的是**规则**（哪类可分、代词放哪），**不以任何一个具体短语为标题**。逐字复核：B1-B2 `Phrasal verbs` 页正文里 **7 个候选只有 `look after` 出现 1 次**（在 `Non-separable` 节作例子：`Who looks after the baby when you're at work?`），**其余 6 个词频全 0**。**→ 「规则有课位、词无课位」是本组的关键区分**（§3.2）。
4. **`enough` 与 `most` 的「已教」判定本轮复核完毕，两条结论都与任务书的猜测不同。**
   - **`enough` GL 82（不是 83），且 100% 集中在 L71 一课**（`lesson-71-enough`）。**它不是「已高频在用」，而是「一课教会、密度极高」**——L71 一课独占 82 词次（第 10 季「本领与分寸」）。**且 L71 已明说 `enough` 两个岗位**：逐字 `enough 两处岗：名词前（enough money）、词后（old enough）——今天主攻词后，名词前认读。` **→ `enough` 作为候选是「已交付」，本轮不重复开课**（§1.13）。
   - **`most` GL 36，100% 集中在 L31，且 36/36 全是「最高级 `the most + 形容词`」义**（逐条复看：`the most beautiful`／`most biggest` 错句／`most tall` 错句，**无一处量词义**）。**→ 任务书给的「GL 30」偏低（实测 36）；量词 `most`（大多数）我方是真零缺口**，与批二十九 §7 项 10 的登记**逐条一致**（§1.14）。
5. **档位定：`plenty of` ＝ B−／`a couple of` ＝ B−／`several` ＝ B／`whole` ＝ B／`most`（量词）＝ B（本轮最高）／`too much` ＝ B−／`a lot of` ＝ C＋（不作新结构）**。**B 组 8 项没有一项升 A**——`several`／`whole`／`most` 的 Murphy 单元位按既有记录**全是与其他词共用一格**，BC 三档 68 课**零专课**（§7）。
6. **A 组 7 项档位：`give up` ＝ B−／`look after` ＝ B−／`take care of` ＝ C／`come back` ＝ C＋／`go on` ＝ C／`find out` ＝ C＋／`look for` ＝ C＋**。**全组最高只到 B−，无一项够 B。** 三条压制理由：**① 上游把它们当词汇点不当语法点**（Cambridge `Phrasal verbs` 页逐字 "**For a complete list of the most common phrasal verbs, see the Cambridge International Dictionary of Phrasal Verbs.**"——**上游自己把「清单」推给词典而不是语法书**）；**② 我方是语法线，短语动词的正确去处是词汇线**；**③ 词频全零意味着场景零件也要现造**（`care` GL 0／`find` GL 1／`back` GL 2，§4）。
7. **§2 红线本轮触发 3 条，且是本批最有价值的发现**：**`a lot of` 对 L30（`much`／`many`）**、**`plenty of` 对 L71（`enough`）**、**`whole` 对 L151（`all`）**——三者跨源都逐字写「同义」。**`a lot of` 因此从 B− 降到 C＋（不立岗）**；`whole` 保住 B（因为它有独立的 `All or whole?` 易混页＋一条 `all` 做不到的硬规则），`plenty of` 保住 B−（同上）。**详见 §2。**

---

## §1 逐候选档位判定

**判档口径**：**A** ＝ 跨源有课程位＋我方有缺口；**B** ＝ 有规则页但无课程位，或须造词但成本可控；**B−**／**B＋** 为 B 的上下微调；**C** ＝ 只有零散例句、无规则页、无课程位；**D** ＝ 跨源基本不收。**「课程位」＝上游当作独立教学单元（专门一课/一单元）；「规则页」＝只有参考性页面但不成课。**

**⚠️ 计数口径**（沿用批二十三／三十，本轮三口径复核）：`GL` ＝ `src/data/grammarLessons.ts` 引号内整词命中（整行 `//` 注释剔除）；`HC` ＝ `huntCases.ts` 同口径。**为与前批数字可比，本报告列 `GL`／`HC` 两列，并额外标出「占课分布」**（同一数字落在几课，比总数更能说明是不是真缺口）。

### 1.1 `take care of`（照顾）——**档位：C**

**跨源逐字（全部本轮实取）**：

- **Cambridge 词典 `TAKE CARE OF SOMEONE/SOMETHING`**（`dictionary/english/take-care-of` **200**，页题逐字 `TAKE CARE OF SOMEONE/SOMETHING - Cambridge English Dictionary`）：义项 **4 条**，其中 **① 标 `B1`** 逐字 "**to protect someone or something and provide the things that that person or thing needs :**"（例 `Take good care of that girl of yours, Patrick - she's very special.`／`Do you think you're responsible enough to take care of a pet?`）；**② 标 `C1`** 逐字 "**to deal with something:**"；**③** "**to be responsible for someone or something:**"；**④** "**Take care of something also means to do whatever needs to be done in a situation :**"。
- **Cambridge `Word patterns: take care`**（`grammar/british-grammar/take-care` **200**，面包屑逐字 `Grammar > Common mistakes in English > Word patterns > Word patterns: take care`）——**这是本轮找到的最硬一条**，逐字 "**The correct preposition to use after take care is of.**"＋"**Don't say 'take care about/for something or someone', say take care of something or someone:**"（错句 `Please take care about my plants while I am on holiday.` 对正句 `Please take care of my plants while I am on holiday.`）。
- **Cambridge `Phrasal verbs and multi-word verbs` 页**：`take care of` **全文 0 次**（整词与子串双口径均为 0）——**它连「多词动词」的名单都没进**。
- **中文侧**：`english.cool/take-care-of/` **404**（本轮实测）；`english.cool/take-care/` **连接超时 000**；**已取到的 `english.cool/phrasal-verb/` 页 20 个短语动词清单里无 `take care of`**。
- **CEFR**：Cambridge 词典 **`B1`**（首义）；**Oxford `take-care-of` 404**（`definition/english/take-care-of` 无此词条——**Oxford 根本没设这个搭配词条**）。

**判档**：**② 课程位 ❌ 无**——**Murphy 按既有记录无单元**（本轮未复核，§7）；**BC 三档 68 课零专课**（A1-A2 18／B1-B2 36／C1 14 三份全目本轮实取，见 §1.9 引文）；**Cambridge 未把它列入任何多词动词名单**。**③ 规则页 ⚠️ 只有一条**——`Word patterns: take care` 是**「错误纠正型」单句页**（全页正文仅 2 句），**不是语法参考页**。**④ CEFR B1**（词典首义）／Oxford 无词条。**⑤ 档位 C**：**「只有零散例句、无规则页、无课程位」三条全中**。**⑥ 理由**：`take care of` 在跨源的定位是**「一个搭配 + 一条介词纠错」**，**不是语法点**；且它的语法含量**全部落在介词 `of` 上**，而 `of` 我方**已有 201 词次**（L80 `in front of` 48／L111 撇号 s 7／L157 `none of` 24 等）——**这条「介词纠错」对我方零增量**。**→ 判 C，不做**。

### 1.2 `give up`（放弃）——**档位：B−**

**跨源逐字（全部本轮实取）**：

- **Cambridge 词典 `GIVE UP`**（`dictionary/english/give-up` **200**，页题逐字 `GIVE UP | English meaning - Cambridge Dictionary`）：义项 **14 条**，`B2`×1 逐字 "**to stop doing something before you have finished it, usually because it is too difficult :**"（例 `I've given up trying`）；`B1`×2 逐字 "**If you give up a habit, such as smoking, or something such as alcohol, you stop doing it or using it:**"／"**to stop doing a regular activity or job :**"。
- **CEFR**：Cambridge **B2（主条）／B1×2**；**Oxford `give up` = `a2`**（`cefr="a2"`、`fkcefr="a2"`、`ox3000="y"`，首义逐字 `to stop trying to do something`，**第二义亦标 `a2`** `to stop doing or having something`）——**⚠️ 双源差两档**。
- **Cambridge `Phrasal verbs and multi-word verbs` 页**：`give up` **全文 0 次**（整词 / 子串双口径 0）——**不在页上任何名单里**。
- **BC `Phrasal verbs`（B1-B2 专课）**：`give up` **不出现**（本轮逐词复核，7 个候选只有 `look after` 出现）。
- **中文侧 `english.cool/phrasal-verb/`**（200，页题逐字「**「片語動詞」(Phrasal Verb) 是什麼？ 有哪些？**」）：**20 个短语动词清单里 `Give up 放棄` 在列**，例句逐字 "**Don’t give up so easily!**"。**⚠️ 但该页同时逐字给了「不必背规则」的结论**："**沒有什麼大原則來區分某個片語動詞是否需要受詞輔助，學習時也沒有必要執著在這個文法規則上，只要多聽、多閱讀，自然而然就會知道每個片語動詞該怎麼使用！**"
- **中文侧专文** `english.cool/give-up/` **404**（本轮实测）。

**判档**：**② 课程位 ❌ 无**（BC 两课都不以它为例；Cambridge 页 0 次；Murphy 按既有记录无单元）。**③ 规则页 ❌ 无专页**——**它的规则含量只能寄生在 `Phrasal verbs` 通页的「可分」通则里**。**④ CEFR 分裂**：Cambridge **B2/B1** vs Oxford **a2**（差两档，须标注）。**⑤ 档位 B−**：**它比 `take care of` 高一档，唯一理由是「它是真正的短语动词」**（＝能吃到 BC 两课的「可分／代词夹中间」通则），**但这一条增量不是我方要教的规则**（§3.3）。**⑥ 理由**：**`give up` 的语法增量是「代词宾语必须夹在中间」（`give it up` ❌`give up it`）——这条规则我方已有同型**（L63 `give me the book / give it to me` 逐字已教「东西用代词就换 to」；L68 `buy sb sth / buy sth for sb`）**，是「宾语换位置」的第三次应用**（§2.1）。

### 1.3 `look after`（照看）——**档位：B−**

**跨源逐字（全部本轮实取）**：

- **⚠️ Cambridge 归类逐字**（`Phrasal verbs and multi-word verbs` 页，`H2: Prepositional verbs` 名单内）：`**look after (a child)**` —— **与 `listen to`／`depend on`／`deal with`／`look at`／`look for`／`look forward to` 同列**。**同页 `H2: Phrasal verbs` 的名单里没有它。**
- **Cambridge 同页的对比例句逐字**（`Prepositional verbs or phrasal verbs?` 节）："**Could you look after my bag while I go and buy the tickets?**" 下注 "**Prepositional verb: the object is after the preposition.**"＋**❌ `Not: Could you look my bag after …`** —— **这是「不可分」的逐字证据，且是明文的 `Not:`**。
- **Cambridge 词典 `LOOK AFTER SOMEONE/SOMETHING`**（**200**）：义项 3 条，**首义标 `A2`** 逐字 "**to take care of or be in charge of someone or something:**"（例 `We look after the neighbours' cat while they're away.`／`Don't worry about Mia - she can look after herself.`）；**释义里直接用了 `take care of`** ← **两词同义的上游逐字证据**。
- **BC `Phrasal verbs`（B1-B2 专课）`Non-separable` 节**：**`look after` 是本页唯一出现的候选词**，逐字例 "**Who looks after the baby when you're at work?**" ＋ 代词版 "**Who looks after her when you're at work?**"（**用来演示「不可分」**）。
- **CEFR**：Cambridge **A2**（首义）；**Oxford `look after` = `a2`**（`cefr="a2"`、`ox3000="y"`，首义逐字 `to be responsible for or to take care of somebody/something/yourself`——**释义里同样用了 `take care of`**）→ **双源一致 A2**。
- **中文侧**：`english.cool/look-after/` **404**；**`english.cool/phrasal-verb/` 页里 `look after` 是「不可分」的招牌例子**，逐字 "**不可分開的及物片語顧名思義就是不能拆成兩組來寫的，"look after" 就是個絕佳的例子。**"＋**❌ `I will look your cat after.`**。

**判档**：**② 课程位 ⚠️ 半有（唯一一项）**——**BC B1-B2 `Phrasal verbs` 专课的 `Non-separable` 节用它当例**；**但「以它为标题的单元」仍然 0**。**③ 规则页 ✅ 有（两层）**：Cambridge **明文 `Not:` 一条**（`Not: Could you look my bag after …`）＋中文侧**明文 ❌ 一条**（`I will look your cat after.`）。**④ CEFR A2 双源一致**（本批 15 项里**唯一双源一致的**，见 §5 表）。**⑤ 档位 B−**：**是本组第二高**。**⑥ 理由**：**A2 双源一致 ＋ 上游 `Not:` 逐字 ＋ 词典释义直接等于 `take care of`** ⇒ **它是「一条真规则（介词动词不可分）＋一个高频义」**；**但它与 `take care of` 是同一件事的两种说法**（两本词典互相用对方释义），**同课会撞车 → 两者取一**（§2.1）。**取 `look after` 不取 `take care of`**：**A2 双源一致 vs B1 单源、有明文 `Not:` vs 只有介词纠错句、且 `look` 我方 282 词次 vs `care` GL 0**（§4）。

### 1.4 `come back`（回来）——**档位：C＋**

**跨源逐字（全部本轮实取）**：

- **Cambridge 词典 `COME BACK`**（**200**）：义项 4 条，**首义标 `A2`** 逐字 "**to return to a place :**"（例 `I'll come back and pick you up in half an hour.`／`We've just come back from Amsterdam.`）。
- **CEFR**：Cambridge **A2**；**Oxford `come back` = `a2`**（`cefr="a2"`、`fkcefr="a2"`、`ox3000="y"`，首义逐字 `to return`）→ **双源一致 A2**。
- **Cambridge `Phrasal verbs and multi-word verbs` 页**：**`come back` 整词 0 次**；**但同页 `Phrasal verbs` 的「无宾语」名单里有 `get back`**（逐字名单 `break down / get back / move in/out / carry on / go off / run away / drop off / hang on / set off / eat out / join in / wake up`）——**`get back` 与 `come back` 同义同型**。
- **Cambridge `Word choice: come`**（**200**，面包屑 `Grammar > Common mistakes in English > Word choice > Word choice: come`）：逐字 "**Come is used to talk about movement towards where the speaker is.**"＋"**To talk about movement to another place, away from the speaker, don't say 'come', say go:**"（错句 `If I came there again one day…` 对正句 `If I went there again one day…`）—— **⚠️ 这条规则只讲 `come` vs `go` 的方向，不讲 `come back`**。
- **中文侧**：`english.cool/come-back/` **404**；**`english.cool/phrasal-verb/` 20 清单里 `Come back 回來、東山再起` 在列**。
- **BC 三档 68 课全目**：零 `come back` 专课。

**判档**：**② 课程位 ❌ 无**。**③ 规则页 ❌ 无专页**——**只有「无宾语」名单里的同义替补 `get back`**。**④ CEFR A2 双源一致**。**⑤ 档位 C＋**：**CEFR 最低（A2 双源一致）＋ 中文侧 20 清单收录 ＋ 但零规则页零课程位**。**⑥ 理由**：**`come back` 的全部语法含量 = `come`（我方 202 词次）＋ `back`（我方 GL 2 词次）**，而 `back` 的 2 处**都不是教学位**（L136 对白 `I am coming back next week!` 认读／L153 对白 `Is Dad back?`）——**它是一条纯词汇组合，无规则**。**→ C＋，不做**（§3.2）。

### 1.5 `go on`（继续）——**档位：C**

**跨源逐字（全部本轮实取）**：

- **Cambridge 词典 `GO ON`**（**200**）：义项 **15 条**，`B1`×2 逐字 "**to happen :**"／"**to continue :**"；`B2`×1 逐字 "**to start talking again after a pause :**"；`C2`×1 逐字 "**to talk in an annoying way about something for a long time :**"（例 `This war has been going on for years.`／`Please go on with what you're doing and don't let us interrupt you.`）。
- **⚠️ Cambridge `Phrasal verbs and multi-word verbs` 页里有 `go on` 的逐字例句**（`Meaning` 节，用来演示「猜不出意思」）：逐字 "**The lecture went on till 6.30. (continued)**"。
- **CEFR**：Cambridge **B1×2／B2／C2**；**Oxford `go on` 义项 14 条，标位只有 `b1`×1**（`to happen`）＋**`c2`×1／`c1`×1**，**其余 11 义 `cefr` 属性为空**——**⚠️ Oxford 的主义「继续」在它自己的切分里没有单独标位**。
- **中文侧**：`english.cool/go-on/` **404**（本轮实测）；**`english.cool/phrasal-verb/` 的 20 清单里无 `go on`**。
- **BC 三档 68 课全目**：零 `go on` 专课。

**判档**：**② 课程位 ❌ 无**。**③ 规则页 ❌ 无专页**（它只作 `Meaning` 节的例句出现，**上游用它是为了证明「短语动词意思猜不出来」，不是为了教它**）。**④ CEFR B1（Cambridge）／b1 + 大量未标位（Oxford）**。**⑤ 档位 C**：**三项全中，且是本组唯一「上游拿它当反面教材（意思不可猜）」的**。**⑥ 理由**：**它的 15 个义项里只有一个（`continue`）与我方现教段位相关，而 `continue` 的语法含量是零**（`go on + -ing` vs `go on + to do` 的差别是 **B2 级**、且与其他 `-ing/to` 动词零散分布，**不构成零基础一课**）。**→ C，不做**。

### 1.6 `find out`（查明）——**档位：C＋**

**跨源逐字（全部本轮实取）**：

- **Cambridge 词典 `FIND (SOMETHING) OUT`**（**200**）：义项 3 条，**首义标 `A2`** 逐字 "**to get information about something because you want to know more about it, or to learn a fact or piece of information for the first time :**"（例 `How did you find out about the party?`／`I'll just go and find out wh-`）。
- **⚠️ Cambridge `Word choice: find out or find?`**（**200**，面包屑逐字 `Grammar > Common mistakes in English > Word choice > Word choice: find out or find?`）——**本轮找到的第二条硬规则**，全文逐字：

> "**To talk about discovering where a thing or person is or how to obtain or achieve something, don't say 'find out', say find:**"（错句 `We need to find out a solution to this problem.` → 正句 `We need to find a solution to this problem.`）
> "**To talk about getting information about something, or learning a piece of information for the first time, say find out.**"
> "**Find out is followed by 'about', 'that', or a question word:**"（例 `She'll be absolutely thrilled when she finds out about our surprise.`／`I just found out that a new shop has opened on my street.`／`The report aims to find out why people are unhappy at work.`）

- **⚠️ 同页 `See also` 指 `Word patterns: find`**（**200**，本轮实取），逐字 "**When the verb find is followed by an adjective, it also needs an object noun or pronoun.**"＋"**To talk about feeling a particular way about something, don't say 'find easy/difficult', say find it easy/difficult:**"（错句 `I find difficult to understand his accent.`）—— **这条讲的是 `find` ＋形容词的「形式宾语 `it`」，不是 `find out`**。
- **Cambridge `Word choice: know or find out?`**（**200**，本轮实取）逐字 "**To know something means to already have information about something.**"／"**To find out something means to learn new information for the first time.**"（对比 `Can you know what time the train leaves?` 对 `Can you find out what time the train leaves?`）。
- **CEFR**：Cambridge **A2**（首义）；**Oxford `find out` = 全部义项 `cefr` 属性为空**（首义 "**to get some information about something/somebody by asking, reading, etc.**"）——**⚠️ Oxford 未标位**。
- **中文侧**：`english.cool/find-out/` **404**；**`english.cool/phrasal-verb/` 20 清单里 `Find out 發現` 在列**。
- **BC 三档 68 课全目**：零 `find out` 专课。

**判档**：**② 课程位 ❌ 无**（**Cambridge `Word choice` 是「错误纠正页」，不是教学单元**）。**③ 规则页 ✅ 有（三页：`find out or find?` ＋ `know or find out?` ＋ `Word patterns: find`）**——**是本组规则页最厚的一项**。**④ CEFR A2（Cambridge）／未标（Oxford）**。**⑤ 档位 C＋**：**规则页最厚，但课程位零，且规则页的性质是「纠错」不是「教学」**。**⑥ 理由**：**`find out` 的真规则是「`find` 与 `find out` 的分工」（找东西 vs 获信息）——这是一条辨析规则，不是一条造句规则**；而且它**要求用户先会 `find`（GL 1 词次）**，**造词成本落在 `find` 上**（§4）。**→ C＋，不做**。

### 1.7 `look for`（寻找）——**档位：C＋**（任务书标 GL 1，本轮复核 **1** ✅）

**跨源逐字（全部本轮实取）**：

- **⚠️ Cambridge 归类逐字**（`Phrasal verbs and multi-word verbs` 页，**`H2: Prepositional verbs` 名单内**）：`**look for**` —— **与 `look after`／`look at`／`look forward to` 同列**（**同页 `Phrasal verbs` 名单内无它**）。
- **Cambridge 词典 `LOOK FOR SOMEONE/SOMETHING`**（**200**，页题逐字 `LOOK FOR SOMEONE/SOMETHING - Cambridge English Dictionary`）：**只有 1 个义项、无 CEFR 标位**，逐字 "**to try to find something or someone:**"（例 `I'm looking for my keys.`／`The police are still looking for three men in connection with the robbery.`／`She plans to look for a job abroad when she finishes college.`）。
- **Cambridge `Word patterns: look`**（**200**，面包屑 `Grammar > Common mistakes in English > Word patterns > Word patterns: look`）逐字 "**When look has an object, the correct preposition to use is at.**"＋"**Don't say 'look something' or 'look to something', say look at something:**"（错句 `She looked to the photo on her desk and smiled.`）—— **⚠️ 这条只讲 `look at`，不讲 `look for`**。
- **Cambridge `Word choice: look, look at, see, or watch?`**（**200**）逐字 "**Look (at) is used when you are trying to see something or someone. Look cannot be followed directly by an object.**"（例句里含 `I've looked everywhere, but I can't find my keys.`）——**同样不讲 `look for`**。
- **CEFR**：**Cambridge 词典该词条无标位**；**Oxford `look for` 义项 `cefr` 属性为空**——**⚠️ 双源均未标位**（本批唯一）。
- **中文侧三处**：`english.cool/look-for/` **200 但是假页**——页题逐字「**「look forward to」用法是？加 V-ing？**」（**即 `look for` 被 `look forward to` 的 slug 吃掉**，§7 项 4）／`english.cool/phrasal-verb/` 20 清单里**无 `look for`**／`english.cool/look/` **200 也是 `look forward to` 页**。
- **我方现存 1 处逐字**（`src/data/grammarLessons.ts:5060`，**L27** `lesson-27-question-words`）：**它在错句里**——`wrong: "What are you look for?"` → `correct: "What are you looking for?"`，`whyZh` 逐字「**「正在找」用进行时 looking：What are you looking for？are 后面的动词要穿 -ing 外套。**」——**⚠️ 该处教学点是「进行时 `-ing`」，`look for` 只是路过词**（与批二十九 `way` 那条提醒同型）。

**判档**：**② 课程位 ❌ 无**。**③ 规则页 ⚠️ 三页都在讲 `look at`，专项 0**。**④ CEFR 双源均未标位**——**这是本批唯一「无 CEFR 可引」的候选，须诚实标注**。**⑤ 档位 C＋**：**与我方现存 1 处同为「路过词」性质，且上游三页全在讲 `look at`——**它拿不到任何属于自己的规则页**。**⑥ 理由**：**`look for` 的语法增量是「`look` 后面跟的是介词不是宾语」**（= 介词动词通则），**而这条通则我方已由 `look like`（L159）／`look forward to`（L134–L138）／`look` 系动词（L125–L133）三次覆盖**——**再加一课就是 `look` 家族的第六次**（§2.1）。

### 1.8 `too much`（太多）——**档位：B−**

**跨源逐字（全部本轮实取）**：

- **⚠️ Cambridge `Too` 页有独立 h3**（`grammar/british-grammar/too` **200**，页题逐字 `Too - Grammar - Cambridge Dictionary`）：**`H3: Too much, too many, too few and too little`**——与原 h2 `Too meaning 'more than enough'` 下的其他 h3（`Too before adjectives and adverbs`／`Too before adjective/adverb + to-infinitive`）**平级**。正文逐字："**When we want to talk about quantities which are more or less than enough, we use too much, too many, too few and too little before a noun:**"；四例逐字 `There's too much salt in this soup. (too much + uncountable noun)`／`There were too many dogs on the beach. (too many + countable noun)`／`I don't like this book because there are too few pictures in it.`／`The trip was cancelled because there was too little interest in it.`
- **⚠️ 同页另有一条明文 Warning（`Too and very` 节）** 逐字 "**We use very to add emphasis to an adjective or an adverb, but it does not mean the same as too.**"；**`Very much and too much` 节**逐字 "**We often use very much to emphasise verbs such as like, dislike, hope, doubt. We do not use too much in this way with these verbs:**"（❌ `Not: I like it too much …`）。
- **同页正文里的禁用** 逐字：**❌ `Not: This coffee is too much sweet.`**／**❌ `Not: It happened too much quickly.`**——**两条都在证明「`too` 直接加形容词时不能用 `too much`」**。
- **Cambridge 词典 `TOO MUCH`**（**200**，页题逐字 `TOO MUCH | English meaning - Cambridge Dictionary`）：**只有 1 个义项、标 `A2`**，逐字 "**(A2) more than someone can deal with:**"（例 `I can't take care of six children at my age - it's too much.`／`One person can't manage all this work - it's too much.`）——**⚠️ 注意词典义是「受不了」而不是「太多」**（**量词义的释义在 `Too` 语法页里，词典页没有对应义项**）。
- **中文侧 `english.cool/too-much/` 404**；`english.cool/too/` **200**（本轮未细查内容）。
- **BC 三档 68 课全目**：零 `too much` 专课；**但 BC A1-A2 有 `Quantifiers: 'few', 'a few', 'little' and 'a bit of'` 专课**（**含 `a bit of`，不含 `too much`**）。

**判档**：**② 课程位 ⚠️ 半有（h3 级）**——**`Too much, too many, too few and too little` 是独立 h3（与 `Too before adjectives` 平级），但它是 `Too` 页内的切分，不是单元**；Murphy 按既有记录无独立单元；BC 0。**③ 规则页 ✅ 有（一个 h3 ＋ 两条明文 Warning ＋ 两条 `Not:`）**。**④ CEFR A2（词典）**。**⑤ 档位 B−**：**规则页成立，但降一档的理由是我方已有 `too`**——**L66 `too…to`（`too heavy to carry`）＋ L71 `enough`（`light enough to carry`）构成「程度三兄弟」，`too much` 是这组的第三个成员**（§2.2）。**⑥ 理由**：**`too much` 的规则增量只有「`too much` + 不可数 / `too many` + 可数」这一条**——**而 `many` 我方 L30 已教（38 词次）、`much` L30 已教（117 词次）**，**⇒ `too much` 是「已教两词 ＋ 已教 `too`」的合体，零新词位**（§2.2）。

### 1.9 `a lot of`（许多）——**档位：C＋（⚠️ 从 B− 下调，见 §2.1）**

**跨源逐字（全部本轮实取）**：

- **Cambridge `Lots, a lot, plenty` 页**（`grammar/british-grammar/lots-a-lot-plenty` **200**，页题逐字 `Lots, a lot, plenty - Grammar - Cambridge Dictionary`，面包屑 `Grammar > Nouns, pronouns and determiners > Quantifiers > Lots, a lot, plenty`）：导语逐字 "**We use lots, a lot and plenty in informal styles to talk about quantities, amounts and degree. Lots and a lot are similar in meaning to much and many. Plenty means 'enough' or 'more than enough'. Lots is even more informal than a lot:**" ← **⚠️ 这是本轮最硬的一条「同义换词」证据**。规则逐字：`H3: Lots, a lot, plenty with a noun` "**When we use lots, a lot or plenty with a noun, we need of:**"（`I've got lots of plans for today.`／`There'll be a lot of your friends there.`／**❌ `Not: We've got plenty time.`**）。
- **Cambridge `Much, many, a lot of, lots of: quantifiers` 页**（**200**，页题逐字 `Much, many, a lot of, lots of : quantifiers - Cambridge Grammar`）：**`H2: Much, many with a noun`** 逐字 "**We use much with singular uncountable nouns and many with plural nouns:**"；**`H3: Questions and negatives`** 逐字 "**We usually use much and many with questions (?) and negatives (−):**"；**⚠️ `H3: Affirmatives`** 逐字 "**In affirmative clauses we sometimes use much and many in more formal styles:**"＋"**In informal styles, we prefer to use lots of or a lot of:**"（例 `I went shopping and spent a lot of money.` ＋ **❌ `Not: I went shopping and spent much money.`**）；**`H2: A lot of, lots of with a noun`** 逐字 "**We use a lot of and lots of in informal styles. Lots of is more informal than a lot of. A lot of and lots of can both be used with plural countable nouns and with singular uncountable nouns for affirmatives, negatives, and questions:**"。
- **CEFR**：Cambridge 词典 `A LOT (OF)`（**200**，页题 `A LOT (OF) | English meaning - Cambridge Dictionary`）—— **⚠️ 该词条只有 1 个义项、标 `A1`** 逐字 "**(A1) a large amount or number of people or things:**"；**Oxford `lot` = `a1`**（`cefr="a1"`、`fkcefr="a1"`、`ox3000="y"`，首义逐字 `a large number or amount`）→ **双源一致 A1（本批最低级）**。
- **BC `Quantifiers` 参考页**（页题逐字 `Quantifiers`，Level 逐字 `Level: beginner` ／ `Level: intermediate`）：**`a lot of` 与 `lots of` 同列在「能配可数与不可数」的名单**（逐字 "**We can use these quantifiers with both count and uncount nouns:**"）。
- **中文侧 `english.cool/a-lot-of/` 连接重置 000**；**`english.cool/quantifiers/`（200）里 `much/many` 节末尾逐字**："**「很多」的用法除了以上的 many/much，口語中更常使用 a lot of / lots of，後面加可數或不可數名詞都可以喔**" ← **⚠️ 中文侧也把它写成 `many/much` 的替代表达**。
- **我方现存 3 处**：`GL` `a lot` = **3**（L25 `It rains a lot.`／L25 `It rains a lot in summer.`／L118 `You learned a lot this week!`）；**`HC` = 2 处，且其中一处是教学位**——`hunt-uncountable`（案 9）逐字 `original: "many"` → `correction: "a lot of"`，`explanation` 逐字「**advice 是不可数名词，不能用 many 修饰。改成 a lot of advice 或者 some advice。**」← **⚠️ 我方已在案 9 里把 `a lot of` 当作 `many` 的替代表达教过**。

**判档**：**② 课程位 ❌ 无**——**`Lots, a lot, plenty` 是与其他两项共页的规则页，不是单元**；**BC 三档 68 课无专课**（A1-A2 18 课全目里只有 `Quantifiers: 'few', 'a few', 'little' and 'a bit of'`，**不含 `a lot of`**）；Murphy 按既有记录无独立单元。**③ 规则页 ✅ 有且厚（Cambridge 两页 ＋ BC 一节 ＋ 中文侧一节）**。**④ CEFR A1 双源一致——本批最低**。**⑤ 档位 C＋**：**⚠️ 这是本批唯一因 §2 红线从 B 下调的项。** **⑥ 理由**：**上游两页都逐字写它是 `much`／`many` 的 informal 替代表达**（"Lots and a lot are similar in meaning to much and many."＋"In informal styles, we prefer to use lots of or a lot of:"）；**我方 L30 已教 `much`／`many`（117＋38 词次）**，**且案 9 已用它做过答案**——**⇒ 它是纯同义换词，按红线「必须下调甚至判不做」：判「不立岗」**（可保留认读位）。

### 1.10 `plenty of`（充足的）——**档位：B−**

**跨源逐字（全部本轮实取）**：

- **⚠️ Cambridge 有独立页 `Plenty`**（`grammar/british-grammar/plenty` **200**，页题逐字 `Plenty - Grammar - Cambridge Dictionary`，面包屑 `Grammar > Nouns, pronouns and determiners > Quantifiers > Plenty`）：**两个 h2 ＋ 一个 `typical errors` 节**，逐字：`H2: Plenty as a pronoun` "**We use plenty as a pronoun to mean 'enough' or 'more than enough':**"（例 `About one hundred pounds should be plenty.`／`That's plenty. Thanks.`）；`H2: Plenty of as a quantifier` "**We use plenty of as a quantifier before both countable and uncountable nouns to mean 'a lot', 'a large quantity':**"（例 `Don't worry there are plenty of options.`／`We've got plenty of rice.`／`Plenty of people have dropped out of school early and have still been very successful in their careers.`）；**`H2: Plenty: typical errors`** 逐字 "**Take care to spell plenty correctly: not 'planty'.**"＋"**We use plenty of before nouns:**"（`There's no rush. We've got plenty of time.` ＋ **❌ `Not: We've got plenty time.`**）。
- **⚠️ 同页 `See also` 逐字指两项：`Lots, a lot, plenty` ＋ `Many`** —— **上游自己把它与 `a lot`／`many` 挂钩**。
- **CEFR**：Cambridge 词典 `PLENTY`（**200**）**标 `B1`**（`dictionary/english/plenty`，**证明义 `B1`**，逐字 "**enough, more than enough, or a large amount of something:**"／`PLENTY OF SOMETHING` 页例 `Make sure you give yourself plenty of time to get ready.`）；**Oxford `plenty` = `b1`**（`cefr="b1"`、`fkcefr="b1"`、`ox3000="y"`，首义逐字 `a large amount; as much or as many as you need`）→ **双源一致 B1**。
- **BC `Quantifiers` 参考页**：**`plenty of` 在「更口语的说法」名单**（逐字 "**These more colloquial forms are also used with both count and uncount nouns:**"）。
- **中文侧 `english.cool/plenty-of/` 404**。
- **我方现存 GL 0／HC 0**（`plenty` 两文件均 0）。
- **⚠️ 关键：`Plenty` 页的 `typical errors` 逐字把 `plenty of` 定义成 `enough`**（"We use plenty as a pronoun to mean 'enough' or 'more than enough'"）——**而我方 L71 已教 `enough`（82 词次）**（§2.2）。

**判档**：**② 课程位 ❌ 无**。**③ 规则页 ✅ 有且厚（独立页 3 节 ＋ 一条 `Not:` ＋ BC 一节）**——**规则页厚度在 B 组排第二**（仅次 `whole` 的易混页）。**④ CEFR B1 双源一致**——**B 组最高（与 `most` 同）**。**⑤ 档位 B−**：**降一档的唯一原因是 §2.2 的 `enough` 对撞**（上游逐字用它定义 `plenty`），**以及 `plenty` 提供的新增量只有「口语程度差」一条**。**⑥ 理由**：**它有独立页（B 档特征），但 ① 与我方 L71 `enough` 同义（上游逐字）、② 全部规则只有「`of` 不可省」一条（与 `a lot of` 同型）、③ 场景零件零**（`plenty` GL 0）⇒ **B− 而非 B**。

### 1.11 `several`（几个）——**档位：B**

**跨源逐字（全部本轮实取）**：

- **⚠️ Cambridge 无独立页**：直连 `grammar/british-grammar/several` 返回 **200 但页题是通用页** `English Grammar Today on Cambridge Dictionary`（**⚠️ 这正是任务书警告的 slug 陷阱——200 ＋ 邻近页；我核对了 title 才判定「不存在」**，§7 项 3）。**`several` 实际只出现在 `Quantifiers` 索引页的类目名单里**（`Quantifiers` 页逐字 "**A quantifier is a word or phrase used to talk about quantities, amounts or degree.**"；其类目清单逐字含 `Some`／`No, none and none of`／`Little, a little, few, a few`／`Many`／`Much, many, a lot of, lots of: quantifiers` 等，**`several` 本身无链接条目**）。
- **BC `Quantifiers` 参考页**：逐字 "**Some quantifiers can be used only with count nouns:**" —— **`several` 在该名单内**（**BC 把它当成员，不当单元**）。
- **CEFR 双源一致 A2**：**Cambridge 词典 `SEVERAL`（200，页题逐字 `SEVERAL | English meaning - Cambridge Dictionary`）标 `A2`**，义项逐字 "**(A2) more than two but not very many**"（`determiner` 词性）；**Oxford `several` = `a2`**（`cefr="a2"`、`fkcefr="a2"`、`ox3000="y"`，首义逐字 `more than two but not very many`——**两源释义逐字几乎相同**）。
- **中文侧 `english.cool/several/` 404**；`english.cool/quantifiers/`（200）**该页 H2 清单里无 `several`**（清单为 `some`／`any`／`a few`／`a little`／`few`／`little`／`many`／`much`／`each`／`every`／`all`／`whole`／`both`／`no`／`none`）。
- **我方 GL 0／HC 0**。

**判档**：**② 课程位 ❌ 无**（Murphy 按既有记录无独立单元；BC 三档 68 课 0；**Cambridge 无独立页**）。**③ 规则页 ❌ 无专页**——**只有 BC 名单里的一格 ＋ Cambridge 索引页的类目**。**④ CEFR A2 双源一致（且两源释义逐字相同）**。**⑤ 档位 B**：**⚠️ 注意——它是本组少数「无规则页却够 B」的项**，**理由是「我方有真缺口 ＋ 造词成本极低」**（B 档定义的第二个分支：`我方须造词但成本可控`）。**⑥ 理由**：**`several` 的规则增量 = 「可数复数 + 三到九个左右」**，**而我方数量词轴已有 L30（`some`/`any`/`much`/`many`）与 L114（`a few`/`few`）两课** ⇒ **`several` 是这条轴上的第三个位置**，**它有独立语义（比 `a few` 多、比 `many` 少）**，**且 CEFR A2 与 `a few`（L114）同档**（§2.3 判定它**不是**同义换词）。

### 1.12 `a couple of`（两三个）——**档位：B−**

**跨源逐字（全部本轮实取）**：

- **Cambridge 词典 `A COUPLE OF SOMEONE/SOMETHING`**（**200**，页题逐字 `A COUPLE OF SOMEONE/SOMETHING - Cambridge English Dictionary`）：**1 个义项、无 CEFR 标位**，逐字 "**two or a few things that are similar or the same, or two or a few people who are in some way connected :**"（例 `We'll see you in a couple of weeks.`／`Repeat this action a couple of times.`／`I just wanted to add a couple of things.`／`She talked it over with a couple of her friends.`）。
- **Cambridge 词典 `COUPLE`**（**200**）：**标 `B1`×2** 逐字 "**(B1) two or a few things that are similar or the same, or two or a few people who are in some way connected :**"（**与上面那条一字不差**）／"**(B1) two people who are married or in a romantic or sexual relationship, or two people who are together for a particular purpose :**"（例 `The doctor said my leg should be better in a couple of days.`）。
- **BC `Quantifiers` 参考页**：**`a couple of` 是本批唯一在 BC 有「独立列举 ＋ 例句」的项**——逐字 "**These more colloquial forms are used only with count nouns:**" ＋ BC 给了它的专属例句（"**I'll be back in a couple of minutes.**"，`Level: intermediate` 段内）。
- **CEFR**：Cambridge **词条无标位／`couple` 标 B1**；**Oxford `couple` = `a2`**（`cefr="a2"`、`ox3000="y"`，前两义逐字 `two people or things`／`a small number of people or things` **均标 a2**）→ **⚠️ 双源差一档（B1 vs A2）**。
- **中文侧 `english.cool/a-couple-of/` 404**；`english.cool/quantifiers/` 页 H2 清单**无 `a couple of`**。
- **我方 GL 0／HC 0**（`couple` 两文件均 0）。

**判档**：**② 课程位 ❌ 无**。**③ 规则页 ❌ 无专页**——**只有 BC 名单里的一格 ＋ 一条专属例句**。**④ CEFR 分裂（Cambridge B1 词条无标位 / Oxford a2）**。**⑤ 档位 B−**：**它比 `several` 低半档的理由是「口语化程度更高」**——**BC 逐字把它归入 "These more colloquial forms"（更口语的形式），而不是主名单**；Cambridge 也把它放在 `Lots, a lot, plenty` 的 informal 语境里（"We use lots, a lot and plenty in informal styles"）。**⑥ 理由**：**它与 `several`／`a few` 在语义上高度重叠**（都是「少量、几个」），**差别是 `a couple of` 更口语且可指「恰好两个」**——**但上游没有一条硬规则把这条差别固定下来**（两本词典都用 `two or a few` 这个模糊释义）⇒ **与 `several` 二选一**（§6）。

### 1.13 `enough`（足够）——**档位：已交付（不重复开课）** ⚠️ 任务书 GL 83 复核为 **82**

**⚠️ 先答任务书的问题：「它在哪一课、以什么形态出现？」——答案：L71，整整一课，82 词次全落在这一课。**

- **我方实取**（`src/data/grammarLessons.ts:13363`，`lesson-71-enough`，`number: 71`）：
  - `grammarLabel` 逐字 "**够 · enough 站词后**"
  - `oneLineRule` 逐字 "**说「够」用 enough——它站词的后面（light enough）；后半段接 to + 动作收尾（to carry）。**"
  - `targetSentence` 逐字 "**The bag is light enough to carry.**"
  - **⚠️ 该课已明说 `enough` 有两个岗位**，`explanation` 逐字 "**enough 还有一个岗位在名词前面：enough money（钱够）、enough time（时间够）。今天你先记住词后那句（light enough），名词前这句认得、听得懂就行——用起来一样是「够」。**"
  - **`variants` 三条逐字**：肯定 `The bag is light enough to carry.`／否定 `The bag is not light enough.`／疑问 `Is the bag light enough to carry?`
  - **`examples` 三条逐字**：`The bag is light enough to carry.`／`He is old enough.`／**`We have enough money.`** ← **名词前岗位已在例句里出现**
  - **`summary` 逐字**："**enough money —— 名词前的老位子（认读）**"
  - **季归属**：第 10 季「本领与分寸」（`season-10`，min 67 max 71）
- **配套案件**：`hunt-enough-bag`（案 80，**HC 9 词次**）＋ `hunt-feel-better`（案 85，1 词次）——**我方已有 2 个专用案件**。
- **跨源逐字（本轮实取，用于确认「已交付的形态与上游一致」）**：
  - **Cambridge `Enough` 页**（**200**，页题逐字 `Enough - Grammar - Cambridge Dictionary`，面包屑 `Grammar > Nouns, pronouns and determiners > Quantifiers > Enough`）：导语 "**Enough is a determiner, a pronoun or an adverb. We use enough to mean 'as much as we need or want'.**"；**三个 h3 逐字**：`Enough as a determiner`（"**We can use enough before a noun as a determiner:**"＋"**We use enough of before other determiners (the, my) and pronouns (us, them):**" ＋ ❌ `Not: You haven't eaten enough your dinner, Jason.`）／`Enough as a pronoun`／`Enough as an adverb`（"**We use enough as an adverb of degree:**"）；**Warning 逐字** "**We use enough as an adverb directly after an adjective or directly after another adverb:**" ＋ **❌ `Not: Is this box enough big …`**。
  - **BC 有 B1-B2 专课 `Using 'enough'`**（**200**，页题逐字 `Using 'enough' | LearnEnglish`，Level 逐字 `B1 Intermediate`／`B2 Upper intermediate`）——**本批唯一「以 `enough` 为标题的课程位」**，**小节逐字 6 个**：`With adjectives and adverbs`／`With verbs`／`With nouns`／`As a pronoun`／`With an adjective and a noun`／`enough of`；规则逐字 "**enough comes after adjectives and adverbs.**"／"**enough comes after verbs.**"／"**enough comes before nouns.**"／"**When enough is used with an adjective and a noun, two positions are possible but the meaning changes.**"／"**We normally only use enough of when it is followed by a determiner or a pronoun (a/an/the, this/that, my/your/his, you/them, etc.).**"
  - **CEFR**：Cambridge 词典 `ENOUGH`（**200**）**`A2`（determiner 首义）＋ `B2`＋`C1`／`A2`（adverb）**；**Oxford `enough` = `a1`**（`cefr="a1"`、`fkcefr="a1"`、`ox3000="y"`，首义逐字 `used before plural or uncountable nouns to mean 'as many or as much as somebody needs or wants'`）→ **⚠️ 分裂（A2 vs A1）**。
  - **中文侧 `english.cool/enough/` 404**（本轮实测）。

**判档**：**⑤ 档位：已交付，本轮不开课**。**⑥ 理由三条**：**① 我方 L71 已完整覆盖「词后」主岗（`light enough`）＋ 已认读「名词前」岗（`enough money`）**；**② 上游 BC 的 6 个小节里，我方未覆盖的只剩 `With verbs`（`enough` 在动词后）与 `enough of`（+限定词／代词）两条**——**两者都是 B1-B2 级、且我方现教段位是零基础**（§7）；**③ 再开一课 `enough` 必然复述 L71 的 `light enough to carry`**（该句已被 L71／案 80 使用，**触及 `grammarLessons.test.ts:163` 「同一练习句最多出现在 6 课」的红线**）。**→ 登记为「已交付」，若将来要补，唯一可开的是「`enough of`（+ 限定词／代词）」半课，且须等段位升到 B1。**

### 1.14 `most`（大多数）——**档位：B（本批最高）** ⚠️ 任务书 GL 30 复核为 **36**

**跨源逐字（全部本轮实取）**：

- **⚠️ Cambridge 有独立页 `Most, the most, mostly`**（`grammar/british-grammar/most-the-most-mostly` **200**，页题逐字 `Most, the most, mostly - Grammar - Cambridge Dictionary`，面包屑 `Grammar > Nouns, pronouns and determiners > Quantifiers > Most, the most, mostly`）：**三个平级 h2**：`Most`／`The most`／`Mostly`；**`Most` 下三个 h3**：`Most with a noun`／`Most without a noun`／（`See also` 指向 `Most`／`Least, the least, at least`／`Adjectives: comparative and superlative`）。**逐字规则**：
  - "**We use the quantifier most to talk about quantities, amounts and degree.**"
  - "**We use most with nouns to mean 'the majority of':**"（例 `She plays tennis most mornings.`／`Most tap water is drinkable.`）
  - **⚠️ Warning 逐字**："**We don't use the most with this meaning:**"（❌ `Not: … and on the most days …`）——**这条是「量词 `most` 不能带 the」的明文禁用**
  - **⚠️ 核心对比逐字**："**When we are talking about the majority of something in general, we use most + noun. When we are talking about the majority of a specific set of something, we use most of the + noun.**"（对比 `Most desserts are sweet.` ＝ `Desserts in general` ／ `He'd made most of the desserts himself.` ＝ `A specific set of desserts (at the party)`）
  - "**When we use most before articles (a/an, the), demonstratives (this, that), possessives (my, your) or pronouns (him, them), we need of:**"（正句 `Most of the information was useful.` ＋ **❌ `Not: Most the information …`**）
  - **⚠️ 第二条 Warning 逐字**："**When there is no article, demonstrative or possessive pronoun, we don't usually use of:**"（❌ `Not: Most of rivers are below their normal levels.`）
  - "**We use most of before geographical names:**"（`Most of England and Wales should be dry throughout the day.`）
  - `Most without a noun` 逐字 "**We can leave out the noun with most when the noun is obvious:**"（`Some children brought a packed lunch but most had a cooked meal in the canteen.`）
- **BC `Quantifiers` 参考页**：**`most` 在「可数/不可数都能配」名单**，例句逐字 "**Most children start school at the age of five.**"；**`Members of groups` 节**（`Level: intermediate`）逐字 "**but if we are talking about members of a specific group, we use of the as well**"（例 `Most of the boys at my school play football.`）——**与 Cambridge 同一条规则**。
- **CEFR**：Cambridge 词典 `MOST`（**200**，页题逐字 `MOST | English meaning - Cambridge Dictionary`）**`A2`×3＋`B2`**（determiner 块）；**Oxford `most` = `a1`×2**（`cefr="a1"`）＋`ox3000="y"`，首义逐字 `the largest in number or amount`、**第二义逐字 `more than half of somebody/something; almost all of somebody/something`** ⇒ **双源 A1–A2 之间**。
- **⚠️ 我方现状（本轮逐条复看）**：`most` GL **36**，**36/36 全在 L31 `lesson-31-superlative`**，**且 36/36 全是最高级义**——逐条实读包括 `This is the most beautiful flower.`／错句 `This is the most biggest apple.`／错句 `He is the most tall in our class.`／`the most beautiful` 选项／`most 只配长词` 讲解。**⚠️ 无一处是量词义「大多数」。** `HC` 4 处**也全是最高级义**（案 40 `hunt-superlative-market`：`original: "most"` → `correction: "去掉 most"`，`explanation` 逐字「**most 和 -est 只能用一个：the cheapest。**」）。
- **中文侧 `english.cool/most/` 是假页**（**200 但页题逐字「【實用英文單字】英文最美的8個單字！ 幫你寫作變更有美感！】」——完全无关**，§7 项 4）；`english.cool/quantifiers/` 页 H2 清单里**无 `most`**。
- **与批二十九 §7 项 10 逐条一致**：该批登记「**量词 `most` 我方完全没教 ⇒ 是另开的轴，不属本批（`none` 批）**」——**本轮复核成立并升级为正式候选**。

**判档**：**② 课程位 ⚠️ 半有**——**Murphy 按既有记录无独立单元**（初级 U81 `allmostsomeanyno/none` 五词一格／中级 U88 `all/allofmost/mostofno/noneofetc.` 四词一格，**均共用**，本轮未复核 §7）；**BC 三档 68 课零 `most` 专课**（`most` 只在 `Quantifiers` 参考页的名单里）；**Cambridge 有独立页但不是单元**。**③ 规则页 ✅ 有且厚**——**独立页 3 h2／3 h3 ＋ 两条 Warning ＋ 两条 `Not:` ＋ BC `Members of groups` 节同规则**。**④ CEFR A2（Cambridge ×3）／a1（Oxford）**。**⑤ 档位 B（本批最高）**：**⚠️ 它是本轮唯一「规则页厚 ＋ 我方真零缺口（量词义）＋ 不撞任何已教内容」三项同时成立的候选**。**⑥ 理由**：**核心增量是一条硬规则、且我方零覆盖**——"**most + 名词 = 大多数（泛）／ most of the + 名词 = ……中的大多数（特指）**"，**加两条明文禁用**（❌`the most days`／❌`Most the information`）。**这条规则与我方已教的 `all`（L151 `All the books are good.`）／`every`（L152）／`none`（L157 `None of the cups are mine.`）构成同一张「范围量词表」的最后一个空位**（§2.3）。**不升 A 的唯一理由：课程位四条全部共用（Murphy 两格共用、BC 零专课）。**

### 1.15 `whole`（整个）——**档位：B**（⚠️ 批二十六判 C＋，本轮**上调**）

**跨源逐字（全部本轮实取，两个独立落点）**：

- **⚠️ 落点一：Cambridge 有独立页 `Whole`**（`grammar/british-grammar/whole` **200**，页题逐字 `Whole - Grammar - Cambridge Dictionary`，面包屑 `Grammar > Nouns, pronouns and determiners > Determiners > Whole`——**⚠️ 注意它归 `Determiners` 大类，不在 `Quantifiers` 下**）：逐字 "**Whole is a determiner. We use whole before nouns and after other determiners (my, the, a/an, their) to talk about quantity. We use it to describe the completeness of something:**"（例 `I've wanted to be an actor my whole life.`／`Please can you check the whole document?`／`I thought the whole experience was very interesting.`）＋"**We use the whole of when whole is followed by another determiner (my, her, this, the):**"（`She had been in the same job for the whole of her life. (or … for her whole life.)`）＋"**We often use the whole of with periods of time to emphasise duration:**"＋"**We also use whole as an adverb:**"（`He took the cake and swallowed it whole.`）；**页尾 `See also` 逐字指 `All or whole?`**。
- **⚠️ 落点二：Cambridge 有独立易混页 `All or whole?`**（`grammar/british-grammar/all-or-whole` **200**，页题逐字 `All or whole ? - Grammar - Cambridge Dictionary`，**面包屑逐字 `Grammar > Easily confused words > All or whole?`**——**归「易混词」类目**）。**逐字规则四条**：
  - "**All and whole are determiners.**" ＋ "**We use them before nouns and with other determiners to refer to a total number or complete set of things in a group.**"（对比栏逐字 `All the cast had food poisoning.` 注 `all + determiner + noun` ／ `The whole cast had food poisoning.` 注 `determiner + whole + noun`）
  - "**All my family lives abroad. or My whole family lives abroad.**"
  - "**We often use all and the whole with of the:**"（`She complains all of the time. or She complains the whole of the time.`）
  - **⚠️ 核心硬规则**："**We use a/an with whole but not with all:**"（正句 `I spent a whole day looking for that book and eventually found it in a little old bookshop on the edge of town.` ＋ **❌ `Not: … all a day …`**）
  - **⚠️ 第二条硬规则（`H2: All the with uncountable nouns`）**："**We use all the and not the whole with uncountable nouns:**"（正句 `She was given all the advice she needed.` ＋ **❌ `Not: She was given the whole advice …`**；`All the equipment is supplied.`）
- **BC `Quantifiers` 参考页**：**`whole` 不出现**（**本轮对 BC 参考页逐词复核，`whole` 零命中**）。
- **CEFR 分裂**：Cambridge 词典 `WHOLE`（**200**，页题逐字 `WHOLE | English meaning - Cambridge Dictionary`）**`A2`（adjective 首义）＋ `C2`（adverb）＋ `B1`（noun）**；**Oxford `whole` = `a2`×1 ＋ `b2`×2**（`cefr="a2"` `full; complete`／`cefr="b2"` `used to emphasize how large or important something is`／`cefr="b2"` `not broken or damaged`，`ox3000="y"`）⇒ **取 A2 为主**。
- **中文侧 `english.cool/quantifiers/`（200）有 `whole` 独立小节**，逐字 "**whole 意思為「整個的、整體的」，表示「事物的整體」或「事物的每一部分」**"＋"**whole + 單數名詞**"（例 `I finally finished reading the whole novel.`／`I ate a whole package of chips.`）；**同页另有 `all / whole 比較` 独立小节**，逐字 "**all 和 whole 都有「全部」的意思，但 whole 會比 all 更強調完整性，且 whole + 單數名詞，而 all + 複數可數名詞/不可數名詞。**"（对比 `The boy played video games all day.` 对 `I had a headache, so I lied in bed the whole day.`／`I spent my whole vacation doing this project.`）；**`english.cool/whole/` 404**。
- **我方 GL 0／HC 0**（`whole` 两文件均 0）。

**判档**：**② 课程位 ❌ 无**（Murphy 按既有记录无单元；BC 三档 68 课 0；**且 BC 参考页连词都不收**）。**③ 规则页 ✅ 有且厚（本批最厚）**：**Cambridge 两张独立页（一张官网页 ＋ 一张 `Easily confused words` 类目下的对比页）＋ 2 条明文 `Not:` ＋ 中文侧两个独立小节（含一条对比）**。**④ CEFR A2（Cambridge 首义／Oxford 首义）**。**⑤ 档位 B（⚠️ 从批二十六的 C＋ 上调半档）**：**⑥ 上调理由三条**——**① 它有独立规则页（Cambridge `Whole`），批二十六判 C＋ 时按 C 档定义「无规则页」是不成立的**；**② 它有独立易混页 `All or whole?`（归 `Easily confused words` 类目），而「有独立易混页」在批三十是 `each` 判 B 的关键证据之一**（G30 §1.5）；**③ 它有两条 `all` 做不到的硬规则**（`a/an + whole` vs ❌`all a day`；不可数名词只能用 `all the` vs ❌`the whole advice`）——**这是真语法增量，不是同义换词**。**降回 B 而非 B＋ 的理由**：**BC 零收录（连参考页的名单都不进）＋ CEFR 只到 A2 ＋ 场景零件零**（`whole` GL 0）。**→ 详见 §2.4 与批二十六结论的差异说明。**

---

## §2 「与已教内容的重叠」甄别（本项目核心红线）

**判定口径**：**「教新结构」＝ 我给出一条现有课程里没有的造句规则**；**「同义换词／扩展」＝ 上游逐字写成与已教内容同义，或新项的全部语法含量可由已教内容直接推出**。**红线：若只是同义表达，档位必须下调甚至判不做。**

**已教基线（本轮实取，供逐条比对）**：

| 已教内容 | 课 | `GL` 词次（达标分布） | `grammarLabel` 逐字 |
|---|---|---|---|
| `much`／`many`／`some`／`any` | **L30** | `much` 117（L30:27 L76:75 L78:7 L131:8）／`many` 38（L30:26 …）／`some` 分布 11 课／`any` 分布 9 课 | `数量词 · some / any / much / many` |
| `most`（最高级义） | **L31** | **36（L31:36，100%）** | `最能比 · -est / most` |
| `too…to` | **L66** | — | `太…了装不下 · too…to` |
| `enough`（词后主岗） | **L71** | **82（L71:82，100%）** | `够 · enough 站词后` |
| `a few`／`few` | **L114** | `few` 95（L114:68 L117:16 L118:11） | `还有几个 vs 几乎没了 · a 在不在，意思反一半` |
| `give sb sth`／`give sth to sb` | **L63** | `give` 66（L63:53 L68:13） | `给东西 · give me the book / give it to me` |
| `buy sb sth`／`buy sth for sb` | **L68** | `for` 231（L68:68） | `买给谁 · buy sb sth / buy sth for sb` |
| `all` | **L151** | 24＋ | `三个以上都 · all 也站最前面` |
| `every` | **L152** | 34＋ | `差在哪儿 · 好多个一起／一个一个来` |
| `none`（`none of`） | **L157** | 24＋ | `一个都不 · none 后面拴 of` |
| `none`／`neither`／`both` | L148／149／157 | 30／16／24 | — |
| `look like` | **L159** | — | `看起来像 · look 后面跟 like` |
| `look forward to` | **L134–L138** | 5 课 | `盼着 · look forward to + 那件事` |
| `look`／`sound`／`smell`／`taste`／`feel`（系动词） | **L125–L133** | `look` 282 | `看起来怎样 · look 中间站` |

### 2.1 A 组（动词短语 7 项）：**7/7 全部是「已教结构的词汇化」，无一项教新结构**

**逐项甄别**：

| 候选 | 我方现存 | 逐字跨源依据 | 判定 | 档位处理 |
|---|---|---|---|---|
| `take care of` | `care` **GL 0**／`of` 201（11 课） | Cambridge 词典释义直接等于 `look after`（**两词互相用对方释义**）；`Word patterns: take care` 全页只讲「介词用 `of` 不用 `about/for`」 | **🔴 纯词汇搭配**：语法含量 = 介词 `of`，**`of` 我方已 201 词次** | **C（不做）** |
| `give up` | `give` 66（L63:53）／`up` 152 | BC C1 `Word order in phrasal verbs` 逐字 "**when the object is a pronoun … only the separated form can be used**"＋"**The pronoun must go between the verb and particle.**" | **🟡 有语法增量但撞车**：增量是「代词宾语夹中间」，**与我方 L63 `give it to me` 同型**（L63 教的是「东西用代词就换 `to`」，同一条宾语换位直觉） | **B−** |
| `look after` | `look` 282／`after` 203 | Cambridge 归 `Prepositional verbs`；**明文 `Not: Could you look my bag after …`**；BC B1-B2 专课用它演示不可分；**A2 双源一致** | **🟡 有真规则但与我方撞车**：规则是「介词动词不可分」，**与我方 L134–L138 `look forward to`（同页 `Prepositional verbs` 名单内）完全同型** | **B−** |
| `come back` | `back` **GL 2**（L136 对白／L153 对白，**均非教学位**） | Cambridge 页 `Phrasal verbs` 无宾语名单里有同义的 `get back`；词典 A2 双源一致 | **🔴 无语法**：`come`（202 词次）＋ `back` 的组合，**零规则** | **C＋（不做）** |
| `go on` | `go` 656／`on` 280 | Cambridge 页 **用它当「意思猜不出来」的反面教材**（"The lecture went on till 6.30. (continued)"）；Oxford 主义未标位 | **🔴 无语法**：15 义项，`continue` 义的语法含量为零 | **C（不做）** |
| `find out` | `find` **GL 1**（L80 对白 `I cannot find it!`） | Cambridge `Word choice: find out or find?` 逐字 "**don't say 'find out', say find**"（找东西）／"**Find out is followed by 'about', 'that', or a question word**" | **🟡 是辨析不是造句**：真规则是 `find` vs `find out` 的分工，**要求先会 `find`（GL 1）** | **C＋（不做）** |
| `look for` | `look for` **GL 1**（L27 错句里，教学点是 `-ing`） | Cambridge 归 `Prepositional verbs`；**但三张 `look` 规则页（`Word patterns: look`／`Word choice: look, look at, see, watch`）全在讲 `look at`**；双源均未标位 | **🔴 无增量**：`look` 后面跟介词的通则，**我方已由 L125–L133（系动词）、L134–L138（`forward to`）、L159（`like`）三次覆盖** | **C＋（不做）** |

**→ §2 红线结论（A 组）**：**7 项全部不教新结构。** 其中 **4 项是纯词汇组合**（`take care of`／`come back`／`go on`／`look for`），**3 项有语法增量但均与已教内容同型**（`give up` 对 L63；`look after` 对 L134–L138；`find out` 是辨析）。**A 组最高档位 B−，且两项 B− 的增量都是「已教规则的第三次应用」。**

### 2.2 B 组（程度数量 8 项）：**3 项触发红线（`a lot of`／`plenty of`／`too much`），4 项是「新轴」（`several`／`a couple of`／`most`／`whole`），1 项已交付（`enough`）**

**⚠️ 最硬的一条红线证据（`a lot of`）**——Cambridge 两页逐字：

> `Lots, a lot, plenty` 页导语："**Lots and a lot are similar in meaning to much and many.**"
> `Much, many, a lot of, lots of: quantifiers` 页 `Affirmatives` 节："**In informal styles, we prefer to use lots of or a lot of:**" ＋ **❌ `Not: I went shopping and spent much money.`**

**⇒ `a lot of` 与我方 L30（`some`/`any`/`much`/`many`，`much` 117／`many` 38 词次）是逐字同义。** 且**我方案 9（`hunt-uncountable`）已经用它当答案**（`original: "many"` → `correction: "a lot of"`，逐字讲解「**advice 是不可数名词，不能用 many 修饰。改成 a lot of advice 或者 some advice。**」）。**→ 红线触发：从 B− 下调至 C＋，判「不立岗」（可保留认读位）。**

**⚠️ 第二条（`plenty of`）**——Cambridge `Plenty` 页逐字："**We use plenty as a pronoun to mean 'enough' or 'more than enough'**"，且 `See also` 逐字指向 `Lots, a lot, plenty`＋`Many`。**⇒ `plenty` 的上游第一释义就是 `enough`——而我方 L71 已用整课教 `enough`（82 词次）。** **→ 红线下调至 B−**（保住 B− 而非降到 C 的理由：**它有独立页 ＋ 一条 `all`／`a lot` 都不共享的规则「`of` 不可省」＋ CEFR B1 双源一致**）。

**⚠️ 第三条（`too much`）**——Cambridge `Too` 页。**它是我方已有两课的合体**：`too`（L66 `too…to`）＋ `much`／`many`（L30，L30 的 `oneLineRule` 逐字已教「**数得清的用 many，数不清的用 much**」）。Cambridge 逐字给的规则是 "**too much + uncountable noun**／**too many + countable noun**"——**而「可数用 many／不可数用 much」我方 L30 已教**。**⇒ `too much` 的增量只剩「`too` ＋量词」这一步，是 L30 规则的直接合成。→ 下调至 B−（不给 B）。**

**逐项甄别表**：

| 候选 | 判定 | 逐字跨源依据 | 档位处理 |
|---|---|---|---|
| `too much` | **🟡 合成（非新）** | Cambridge `Too` 页 `H3: Too much, too many, too few and too little` 逐字 "too much + uncountable noun／too many + countable noun"；**该页两条禁用逐字证明「`too` 直接加形容词时不能用 `too much`」**（❌`too much sweet`／❌`too much quickly`） | 下调 **B−**（1 课封顶，且须与 L30／L66 明确切分） |
| `a lot of` | **🔴 同义换词** | 见上（"similar in meaning to much and many"＋"In informal styles, we prefer to use lots of or a lot of"） | **下调 C＋（不立岗）** |
| `plenty of` | **🟡 同义（对 `enough`）** | `Plenty` 页 "to mean 'enough' or 'more than enough'" | 下调 **B−** |
| `several` | **🟢 新轴** | BC 逐字 "**Some quantifiers can be used only with count nouns:**"（`several` 在列）；**Cambridge／Oxford 释义逐字相同**（`more than two but not very many`）——**语义独立于 `a few`（`a few` = 少量，`several` = 三到九）** | **B（保留）** |
| `a couple of` | **🟢 新轴（弱）** | BC 逐字归入 "**These more colloquial forms are used only with count nouns:**" ＋ **BC 给了专属例句**（`I'll be back in a couple of minutes.`） | **B−（保留）** |
| `enough` | **⚫ 已交付** | L71 逐字 `grammarLabel: "够 · enough 站词后"`；BC 有专课 `Using 'enough'` | **不开课** |
| `most`（量词义） | **🟢 新轴（干净）** | Cambridge 独立页两条 Warning ＋ 两条 `Not:`；**我方 36 词次 100% 是最高级义（逐条复看），量词义真零** | **B（保留，本批最高）** |
| `whole` | **🟢 新轴** | Cambridge 两条 `Not:`（❌`all a day`／❌`the whole advice`）；`All or whole?` 单独成页 | **B（保留，从 C＋ 上调）** |

### 2.3 为什么 `several`／`most`／`whole` 不算「同义」——三条逐字边界

**① `several` vs L114 `a few`**：**不是同义，量级不同。** Cambridge／Oxford 两源对 `several` 的释义逐字都是 `more than two but not very many`（**下限「两个以上」被明文写死**）；而 `a few` 我方的 `oneLineRule` 逐字是「**「还有几个」说 a few**」——**它没有下限，可以指两个**。**⇒ 这是数量轴上一个新的刻度，不是同义换词。**

**② `most`（量词义）vs L31 `most`（最高级义）**：**同一个词，两条完全不同的轴。** Cambridge 把两者切成**同一页里的两个 h2**（`Most` 与 `The most`），逐字分开：`Most` 节 "**We use most with nouns to mean 'the majority of':**"／`The most` 节 "**The most is the superlative form of many, much.**"。**⚠️ 且 `Most` 节有明文禁用 `the`**（"**We don't use the most with this meaning:**" ❌`on the most days`）——**这条正好与我方 L31 教的「最高级必须站 `the`」形成干净对照**：**同一个词，量词义不许带 `the`，最高级义必须带 `the`。⇒ 这是「同词对撞」的优质教学点，不是重叠。**

**③ `whole` vs L151 `all`**：**两词大量同义，但有两条 `all` 做不到的硬规则。** Cambridge `All or whole?` 逐字承认大量互替（"**When we can split up a thing into parts, we can use either whole or all with the same meaning**"：`She ate the whole orange.` ＝ `She ate all of the orange.`），**但明文切出两处不同**：
- 逐字 "**We use a/an with whole but not with all:**"（❌`all a day`）
- 逐字 "**We use all the and not the whole with uncountable nouns:**"（❌`the whole advice`）
**⇒ 这两条是不可互替的** —— **`whole` 保 B，`all` 的重复不是它的全部。**

### 2.4 ⚠️ 与批二十六结论的差异（`whole` 从 C＋ 上调至 B）

**批二十六判 `whole` 为 C＋。本轮复核判定：上调至 B，理由两条，均属「本轮新取证」。**

1. **批二十六很可能未取到 Cambridge `Whole` 页。** 本轮直连 `grammar/british-grammar/whole` **返回 200**，页题逐字 `Whole - Grammar - Cambridge Dictionary`，**面包屑 `Grammar > Nouns, pronouns and determiners > Determiners > Whole`**，正文 4 段（含 `the whole of` 规则与副词用法）。**按 C 档定义「只有零散例句、无规则页」，有独立页即不成立。**
2. **本轮新取到独立易混页 `All or whole?`**（**面包屑 `Grammar > Easily confused words > All or whole?`**）。**⚠️ 「有独立易混页」这个判据在批三十（`each`）是判 B 的关键证据之一**——批三十 §1.5 逐字记录 `Each or every?` 归 `Easily confused words` 类目，据此判 `each` 为 B。**同一判据本轮对 `whole` 成立。**
3. **⚠️ 诚实登记的保留**：**`whole` 的 BC 侧是零收录**（`Quantifiers` 参考页逐词复核，`whole` 零命中；三档 68 课零专课），**且 CEFR 只到 A2**。**⇒ 给 B 不给 B＋**；上调幅度为半档，**不是重判为「高价值」**。**建议：若排期，`whole` 放在 `all`（L151）之后的「同一张表补格」位置，而不是独立大章。**

---

## §3 动词短语的特殊性评估（A 组重点）

### 3.1 ① 上游把 7 项当语法点还是词汇点？——**逐项不同，分三类**

**⚠️ 这是本轮最结构性的一项发现：Amy 组 7 项在跨源里不是同一类词**，Cambridge `Phrasal verbs and multi-word verbs` 页把它们分进了**三个不同的 h2**：

| 分类（Cambridge 逐字标签） | 本批候选 | 跨源逐字证据 |
|---|---|---|
| **`H2: Phrasal verbs`**（动词 + 副词小品词） | **`give up`**／`come back`／`go on`／`find out`（**4 项**） | 该节逐字 "**Phrasal verbs have two parts: a main verb and an adverb particle.**"；**常用小品词名单逐字** `around, at, away, down, in, off, on, out, over, round, up`（**`give up` 的 `up`／`go on` 的 `on`／`find out` 的 `out` 都在内**）。**⚠️ 但名单的例词是 `bring in go around look up put away take off`——7 个候选一个都不在** |
| **`H2: Prepositional verbs`**（动词 + 介词，不可分） | **`look after`**／**`look for`**（**2 项**） | 该节逐字 "**Prepositional verbs have two parts: a verb and a preposition which cannot be separated from each other:**"；**名单逐字含 `look after (a child)`** 与 **`look for`**（**与 `listen to`／`depend on`／`look at`／`look forward to` 同列**） |
| **不在任何名单内** | **`take care of`**（**1 项**） | **`take care of` 在该页整词 0 次**；它只在 `Word patterns: take care` 这一张**纠错页**上出现（**且那是「搭配」类目，不是「动词」类目**） |

**⇒ 判定**：**`take care of` ＝ 纯词汇点**（上游只在 `Common mistakes > Word patterns` 里以「介词纠错」处置，**没进任何语法分类**）；**`look after`／`look for` ＝ 一条真语法规则（介词动词不可分）的实例**；**其余 4 项 ＝ 短语动词，其语法规则在 BC 两课里被独立成课**。

### 3.2 ② 若是词汇点，该不该进语法线？——**判定：A 组 7 项中 4 项不该进语法线**

**判定依据（三条，均有逐字支撑）**：

1. **⚠️ 上游自己把「短语动词清单」推给词典而不是语法书。** Cambridge `Phrasal verbs and multi-word verbs` 页 `Meaning` 节逐字："**For a complete list of the most common phrasal verbs, see the Cambridge International Dictionary of Phrasal Verbs.**" **⇒ 上游的分工是：语法书讲「可分／不可分」规则，词典收具体短语。**
2. **⚠️ 中文侧也明说「不必背规则」。** `english.cool/phrasal-verb/`（200）逐字："**沒有什麼大原則來區分某個片語動詞是否需要受詞輔助，學習時也沒有必要執著在這個文法規則上，只要多聽、多閱讀，自然而然就會知道每個片語動詞該怎麼使用！**" **⇒ 中文侧把短语动词定位为「多听多读」，即词汇习得。**
3. **⚠️ 我方是语法线，且现教段位是零基础（每课 6–10 分钟，一课一增量）。** 短语动词的**规则只有一条**（可分/不可分），**词条本身没有规则**——**一课讲一个词，就是词汇课。**

**⇒ 逐项处置建议**：

| 候选 | 该进哪条线 | 理由 |
|---|---|---|
| `give up`／`come back`／`go on`／`find out` | **词汇线**（不进语法线） | 它们是「动词 + 小品词」的词条，**上游清单推给词典**；**其中 `come back`／`go on` 零规则** |
| `look after`／`look for` | **语法线可收，但只有一个位置** | **它们的语法点在「介词动词不可分」这一条规则上——而这条规则我方已由 L134–L138 `look forward to` 消耗**（同页同名单）。**⇒ 若要收，只能作为该规则的新例词（扩展），不是新课** |
| `take care of` | **词汇线**（不进语法线） | **上游未收入任何语法分类**；**唯一「语法」内容是介词 `of`，我方 `of` 已 201 词次** |

### 3.3 ③ 哪些短语带语法增量？——**逐项列出，共 3 条真增量，但全部与已教同型**

| 候选 | 语法增量（逐字） | 与我方哪条已教同型 | 能否开出≥2 条可教增量 |
|---|---|---|---|
| **`give up`** | **代词宾语必夹中间**：BC C1 `Word order in phrasal verbs` 逐字 "**when the object is a pronoun (e.g. me, you, it), only the separated form can be used**"＋"**The pronoun must go between the verb and particle.**"；BC B1-B2 同规则 "**separable phrasal verbs must be separated when you use a personal pronoun**" | **L63 `give it to me`**（`grammarLabel` 逐字 `给东西 · give me the book / give it to me`——**教的正是「东西用代词时位置变」**） | **❌ 不足一课**：只有 1 条增量，且是第三次同型 |
| **`look after`** | **介词动词不可分**：Cambridge 逐字 "**Prepositional verbs have two parts: a verb and a preposition which cannot be separated from each other**"＋**❌ `Not: Could you look my bag after …`**；中文侧 **❌ `I will look your cat after.`** | **L134–L138 `look forward to`**（**Cambridge 同一名单内**，同一条「介词后接宾语」规则） | **❌ 不足一课**：1 条增量，且同页同型已是第二次 |
| **`look for`** | 同上（介词动词通则） | **L125–L133（`look` 系动词，`look` 后不直接跟宾语）＋ L159（`look like`）** | **❌ 不足一课** |
| `too much` | **`too much` + 不可数／`too many` + 可数**（Cambridge `Too` 页逐字） | **L30 `much`/`many`（逐字已教「数得清用 many，数不清用 much」）＋ L66 `too…to`** | **⚠️ 1 条合成增量** |
| `most`（量词） | **`most + 名词`（泛）vs `most of the + 名词`（特指）**（Cambridge 逐字）＋ **量词义不能带 `the`**（逐字 ❌`on the most days`） | **L151 `all`／L157 `none of`**（**同一张表的新格，非重复**） | **✅ 2 条** |
| `whole` | **`a/an + whole`**（❌`all a day`）＋**不可数只能用 `all the`**（❌`the whole advice`） | **L151 `all`**（**对照关系，非重复**） | **✅ 2 条** |
| `several` | **可数复数 + 三到九**（BC 逐字 "used only with count nouns"＋两源释义 `more than two but not very many`） | **L114 `a few`**（**量级不同，非重复**） | **✅ 2 条**（含与 `a few` 的边界） |
| `a couple of` | **口语量词 + `of` 不可省**（BC 逐字 "These more colloquial forms are used only with count nouns"＋Cambridge ❌`plenty time` 同型） | **L114 `a few`**（**更口语、可指恰好两个**） | **⚠️ 1–2 条（与 `several` 二选一）** |

**⇒ 结论**：**A 组 7 项全部「不足一课」**（每项 ≤1 条增量且与已教同型）；**B 组里 `most`／`whole`／`several` 三项各有 2 条可教增量，够开课。**

---

## §4 我方造词成本 + 场景零件是否齐备

**口径**：`GL`／`HC` 两文件的引号内整词命中（整行 `//` 注释剔除）。**「场景零件」＝ 要编一课「小美的一天」所需的名词/动词是否已在库**。

### 4.1 逐候选造词成本表

| 候选 | 必须新造的词 | 我方词次（`GL`／`HC`） | 场景零件清点（实取） | 成本判定 |
|---|---|---|---|---|
| `take care of` | **`care`** | **`care` GL 0／HC 0** | `take` GL 83／`of` GL 201；**但 `care` 是零** | **🔴 高**：`care` 零 ∥ 且案件里也无 |
| `give up` | 无（`give` 66／`up` 152） | `give` GL 66（L63:53 L68:13）／`up` GL 152 | `give` 已有整课（L63）＋ `up` 分布 10 课 | **🟢 低**（零件全在） |
| `look after` | 无（`look` 282／`after` 203） | `look` GL 282／`after` GL 203（L90:32 L91:14 …） | **`after` 已有整课 L90／L91**；`look` 5 课 | **🟢 低** |
| `come back` | 无 | `come` GL 202／**`back` GL 2**（L136／L153 各 1，**均对白非教学位**） | `come` 10＋课；`back` 词位几乎零 | **🟡 中**：`back` 需现造教学位 |
| `go on` | 无 | `go` 656／`on` 280 | `go` 已有整课 L9／L10；`on` 18 课 | **🟢 低** |
| `find out` | **`find`** | **`find` GL 1**（L80 对白 `I cannot find it!`）／HC 1 | `find` 词位几乎零；`out` 203 | **🔴 高**：`find` 要造教学位 |
| `look for` | 无 | `look for` **GL 1**（L27 错句）／HC 0 | `look`／`for` 全在；**`keys` GL 1** | **🟡 中**（零件在，但现有 1 处是错句） |
| `too much` | 无 | `much` 117／`too` **已有 L66＋L145／L146** | `much`（L30／L76）／`soup` GL 9／`dogs` — | **🟢 低** |
| `a lot of` | 无 | `a lot` GL 3／HC 2 | `lot` GL 3 | **🟢 低**（但判不立岗） |
| `plenty of` | **`plenty`** | **`plenty` GL 0／HC 0** | 无任何现存零件 | **🔴 高**：全零 |
| `several` | **`several`** | **`several` GL 0／HC 0** | `student` GL 56／`students` 27／`books` 246（**可数复数零件充足**） | **🟡 中低**：词需造，但句式零件在 |
| `a couple of` | **`couple`** | **`couple` GL 0／HC 0** | `week` 40／`days` 55／`times` — | **🟡 中低**：同 `several` |
| `enough` | 无 | **82（L71 独占）** | 已齐 | **⚫ 已交付** |
| `most`（量词） | 无 | `most` GL 36（**全 L31 最高级义**） | `children` GL 1／`students` 27／**`books` 246／`apples` 118**（**「大多数 + 可数复数」零件充足**） | **🟢 低**：**词已在库，只需新增「量词义」这一格** |
| `whole` | 无 | `whole` **GL 0**／HC 0 | `day` 249／`week` 40／`homework` 242／`book` 513（**「整个 + 单数」零件极充足**） | **🟢 低**：**词需造，但场景零件是本批最充足的** |

### 4.2 成本汇总

- **🔴 高成本 3 项**：`take care of`（`care` 0）／`find out`（`find` 1）／`plenty of`（`plenty` 0）——**三项均已被 §2 红线淘汰或降档，成本与档位方向一致**。
- **🟡 中成本 4 项**：`come back`（`back` 2）／`look for`（现存 1 处是错句）／`several`／`a couple of`。
- **🟢 低成本 6 项**：`give up`／`look after`／`go on`／`too much`／`most`／`whole`（**零件全在库**）。
- **⚠️ 场景零件最齐的两项是 `most` 与 `whole`**：**`books` 246／`apples` 118／`day` 249／`homework` 242**——**「大多数书」「一整天」这类句子零件都是现成的**，与我方 L151 `All the books are good.`／L152 `Every student is here.` 的现成句式直接衔接。
- **⚠️ 成本低 ≠ 可排期**：`a lot of`（成本低）已判不立岗（§2.2）；`give up`／`go on`／`look after`（成本低）增量不足一课（§3.3）。

---

## §5 汇总表（15 项按档位排序）

| 排序 | 候选 | 组 | ① 跨源逐字证据＋来源 | ② 课程位 | ③ 规则页 | ④ CEFR | ⑤ 档位 | ⑥ 判定理由 | 本轮值得排期？ |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **`most`（量词义）** | B | Cambridge `Most, the most, mostly` 页独立 3 h2／3 h3 ＋ **2 条 Warning ＋ 2 条 `Not:`**（❌`on the most days`／❌`Most the information`）；BC `Members of groups` 节同规则 | ⚠️ 半有（Murphy 两格**均共用**） | ✅ 厚 | **A2×3／a1** | **B** | **本批唯一「规则页厚 ＋ 我方量词义真零 ＋ 不撞已教」三项齐备**；不升 A 因课程位四条全共用 | **✅ 是（首选）** |
| 2 | **`whole`** | B | Cambridge **独立页 `Whole`**（面包屑 `… > Determiners > Whole`）＋ **独立易混页 `All or whole?`**（`Easily confused words`）＋ **2 条 `Not:`**（❌`all a day`／❌`the whole advice`）；中文侧 `quantifiers` 两个独立小节 | ❌ 无 | ✅ **本批最厚** | **A2／a2** | **B**（**从批二十六 C＋ 上调**） | 独立页 ＋ 独立易混页 ＋ 两条 `all` 做不到的硬规则；不上 B＋ 因 **BC 零收录 ＋ CEFR 只 A2** | **✅ 是** |
| 3 | **`several`** | B | BC 逐字 "**Some quantifiers can be used only with count nouns:**"（在列）；**两源释义逐字相同** `more than two but not very many` | ❌ 无（Cambridge **无独立页**，slug 200 但 title 为通用页） | ❌ 无专页 | **A2／a2** | **B** | **无规则页却够 B**（B 档第二分支：我方须造词但成本可控）：**语义独立（下限「两个以上」写死）＋ 零件齐备** | **✅ 是** |
| 4 | **`plenty of`** | B | Cambridge **独立页 `Plenty`**（2 h2 ＋ `typical errors` ＋ **❌ `Not: We've got plenty time.`**）；**⚠️ 释义逐字等于 `enough`**；`See also` 指向 `Lots, a lot, plenty`＋`Many` | ❌ 无 | ✅ 厚 | **B1／b1**（双源一致，本组最高） | **B−**（红线下调） | **上游逐字用它定义 `plenty` ⇒ 与我方 L71 `enough`（82 词次）同义**；增量只剩「口语程度差」＋「`of` 不可省」 | ⚠️ 与 `enough` 补课二选一 |
| 5 | **`a couple of`** | B | BC 逐字 "**These more colloquial forms are used only with count nouns:**" ＋ **BC 专属例句** `I'll be back in a couple of minutes.`；Cambridge 词典 1 义项（**无标位**） | ❌ 无 | ❌ 无专页 | **B1／a2（分裂）** | **B−** | BC 归入「更口语的形式」**非主名单**；与 `several` 语义重叠且上游无硬边界 ⇒ **与 `several` 二选一** | ⚠️ 二选一 |
| 6 | **`too much`** | B | Cambridge `Too` 页 **独立 h3 `Too much, too many, too few and too little`** ＋ **2 条 Warning ＋ 2 条 `Not:`**（❌`too much sweet`／❌`too much quickly`）；词典义标 `A2` | ⚠️ 半有（h3 级） | ✅ 有 | **A2** | **B−**（红线下调） | **是 L30（`much`/`many`）＋ L66（`too…to`）的合成**，「可数 many／不可数 much」L30 已教 ⇒ 增量仅 1 条 | ⚠️ 可并课 |
| 7 | **`give up`** | A | Cambridge 词典 14 义（**B2 主条／B1×2**）；**BC 两课均不以它为例**；BC C1 规则逐字 "**The pronoun must go between the verb and particle.**"；中文侧 20 清单在列 | ❌ 无 | ❌ 无专页 | **B2/B1 vs a2（分裂）** | **B−** | **真短语动词＋有增量**（代词夹中间），**但与我方 L63 `give it to me` 同型**，是第三次应用 | ❌ 增量 <1 课 |
| 8 | **`look after`** | A | Cambridge **归 `Prepositional verbs`**＋**明文 ❌ `Not: Could you look my bag after …`**；BC B1-B2 专课 `Non-separable` 节**唯一出现的候选**；中文侧 ❌ `I will look your cat after.` | ⚠️ 半有（作例词） | ✅ 有（2 条明文 ❌） | **A2／a2（双源一致）** | **B−** | **本组唯一双源 CEFR 一致 ＋ 唯一被 BC 当例词**；但**与 L134–L138 `look forward to`（同名单）同型**，且与 `take care of` 同义（**词典互相释义**） | ❌ 增量 <1 课 |
| 9 | `a lot of` | B | ⚠️ **红线**：Cambridge 逐字 "**Lots and a lot are similar in meaning to much and many.**"＋"**In informal styles, we prefer to use lots of or a lot of:**"（❌`spent much money`）；**双源 A1** | ❌ 无 | ✅ 厚 | **A1／a1（本批最低）** | **C＋**（**从 B− 下调**） | **逐字同义换词 ⇒ 触发红线**；**且我方案 9 已用它当答案**（`correction: "a lot of"`） | **❌ 不立岗** |
| 10 | `find out` | A | Cambridge **三张纠错页**：`Word choice: find out or find?`（"**don't say 'find out', say find**"）＋`know or find out?`＋`Word patterns: find`；词典首义 **A2** | ❌ 无 | ✅ 厚（**A 组最厚**） | **A2／未标** | **C＋** | **规则页最厚但性质是「纠错」不是「教学」**；真规则是 `find` vs `find out` 辨析，**要求先会 `find`（GL 1）⇒ 成本高** | ❌ 不做 |
| 11 | `look for` | A | Cambridge **归 `Prepositional verbs`**（与 `look after` 同列）；**词典 1 义无标位、Oxford 亦无标位**；**三张 `look` 规则页全在讲 `look at`** | ❌ 无 | ⚠️ 三页均讲 `look at` | **⚠️ 双源均未标位**（本批唯一） | **C＋** | **增量（`look`+介词通则）已被 L125–L133／L134–L138／L159 三次覆盖**；现有 1 处是错句（教学点是 `-ing`） | ❌ 不做 |
| 12 | `come back` | A | Cambridge 词典首义 **A2**；**Oxford `a2`**（双源一致）；**Cambridge 页无宾语名单里有同义 `get back`**；中文侧 20 清单在列 | ❌ 无 | ❌ 无专页 | **A2／a2（一致）** | **C＋** | **`come`（202 词次）＋`back`（GL 2，均非教学位）的组合，零规则** | ❌ 不做 |
| 13 | `take care of` | A | Cambridge **`Word patterns: take care`**（全页 2 句："**The correct preposition to use after take care is of.**"）＋词典 **B1** 首义；**未进任何多词动词名单** | ❌ 无 | ⚠️ 仅 1 条纠错句 | **B1／Oxford 无词条** | **C** | **上游定位是「搭配纠错」不是语法点**；语法含量 = 介词 `of`，**我方 `of` 已 201 词次 ⇒ 零增量** | ❌ 不做 |
| 14 | `go on` | A | Cambridge 页 **拿它当「意思猜不出来」的反面教材**（"The lecture went on till 6.30. (continued)"）；词典 **B1×2／B2／C2**；Oxford **主义未标位** | ❌ 无 | ❌ 无专页 | **B1／（Oxford 多义未标）** | **C** | **15 义项，`continue` 义语法含量为零**；上游用它演示「短语动词不可猜」，**不是教它** | ❌ 不做 |
| 15 | `enough` | B | **BC 有 B1-B2 专课 `Using 'enough'`**（6 小节：`With adjectives and adverbs`／`With verbs`／`With nouns`／`As a pronoun`／`With an adjective and a noun`／`enough of`）；Cambridge `Enough` 页 3 h3 ＋ ❌`enough big` | ⚠️ **BC 有专课** | ✅ 厚 | **A2／a1** | **⚫ 已交付（L71，82 词次）** | **L71 已覆盖「词后」主岗 ＋「名词前」认读**；未覆盖的仅 `With verbs` 与 `enough of`（**B1-B2 级，段位不合**） | ❌ 不重复开课 |

**⚠️ 本轮值得排期的 B 档：`most`（量词义）· `whole` · `several`——共 3 项。**
**⚠️ 备选（需并课或二选一）：`plenty of`（对 `enough`）· `a couple of`（对 `several`）· `too much`（并 L30/L66）。**
**⚠️ A 组 7 项全部不排期**（最高 B−，且增量均 <1 课）。

---

## §6 建议排期的课量（一课一增量）

**硬标准**：**一项要开课，必须能列出 ≥2 条「可教增量」；少于 2 条的明确写「不足一课」。**

### 6.1 建议排期：3 课（B 档 3 项，各 1 课）

**第 1 课：`most`（量词义）「大多数」——建议排期顺位第 1**

| 增量 | 内容（逐字依据） |
|---|---|
| **增量 1** | **`most + 名词`（说一类东西的多数，不带 `the`）**：Cambridge 逐字 "**We use most with nouns to mean 'the majority of':**"＋例 `Most tap water is drinkable.`／`She plays tennis most mornings.`；**明文禁用** "**We don't use the most with this meaning:**"（❌`on the most days`）← **⚠️ 这条正好与 L31「最高级必须站 `the`」形成干净对照** |
| **增量 2** | **`most of the + 名词`（说某一堆里的多数，必须带 `of`＋限定词）**：Cambridge 逐字 "**When we are talking about the majority of something in general, we use most + noun. When we are talking about the majority of a specific set of something, we use most of the + noun.**"＋**❌ `Not: Most the information …`**；BC 逐字 "**if we are talking about members of a specific group, we use of the as well**" |

**一课一增量主轴**：**「`most` 不带 `the`，`most of the` 带」——与我方 L151 `All the books are good.`／L157 `None of the cups are mine.` 接成同一张表。**
**词位成本**：**0**（`most` 已在库 36 词次，`books` 246／`apples` 118／`students` 27 零件全在）。
**建议接位**：**L157 `none` 之后**（同属「范围量词」轴，且 `none` 的 `of` 规则是 `most of` 的直接前置）。

**第 2 课：`whole`（整个）——建议排期顺位第 2**

| 增量 | 内容（逐字依据） |
|---|---|
| **增量 1** | **`a/an + whole + 单数名词`**：Cambridge `All or whole?` 逐字 "**We use a/an with whole but not with all:**"（正句 `I spent a whole day looking for that book…` ＋ **❌ `Not: … all a day …`**）；词典逐字 "**We use whole before nouns and after other determiners (my, the, a/an, their)**"＋例 `my whole life`／`the whole document` |
| **增量 2** | **不可数名词只能用 `all the`，不能用 `the whole`**：Cambridge 逐字 "**We use all the and not the whole with uncountable nouns:**"（正句 `She was given all the advice she needed.` ＋ **❌ `Not: She was given the whole advice …`**） |

**一课一增量主轴**：**「`whole` 只能配单数（整个一个东西）」——与 L151 `all`（配复数/不可数）互补。**
**词位成本**：**0**（`whole` 需造词位，但 `day` 249／`week` 40／`book` 513 零件全在）。
**⚠️ 建议带 `the whole of` 作认读**（Cambridge 逐字 "**We use the whole of when whole is followed by another determiner**"），**不设考点**。

**第 3 课：`several`（几个）——建议排期顺位第 3**

| 增量 | 内容（逐字依据） |
|---|---|
| **增量 1** | **`several` ＋可数复数，且下限是「两个以上」**：Cambridge／Oxford 两源释义逐字相同 `more than two but not very many`；BC 逐字 "**Some quantifiers can be used only with count nouns:**"（在列） |
| **增量 2** | **与 `a few` 的边界**（**我方 L114 已教 `a few`／`few`，`few` 95 词次**）：**`a few` 可指两个，`several` 明文「两个以上」**；**⇒ 这是「同一张表的新刻度」而非重复** |

**一课一增量主轴**：**「`several` 比 `a few` 多、比 `many` 少」——插在 L114（`a few`）与 L30（`many`）之间。**
**词位成本**：**1 个**（`several`，GL 0／HC 0，**需新造**）；句式零件充足（`student` 56／`students` 27／`books` 246）。
**⚠️ 与 `a couple of` 二选一**：**取 `several` 不取 `a couple of`**，理由三条——**① CEFR 双源一致 A2（`a couple of` 分裂 B1/a2）**；**② 释义两源逐字相同（边界清楚；`a couple of` 是模糊的 `two or a few`）**；**③ `a couple of` 被 BC 归入「更口语的形式」非主名单**。

### 6.2 备选：3 项（需并课或二选一，**不单独占课**）

| 项 | 处置 | 理由 |
|---|---|---|
| **`too much`** | **并进 L30 的复现／认读位**，不单独开课 | **增量只有 1 条**（`too much` + 不可数／`too many` + 可数），**且 L30 逐字已教「数得清用 many，数不清用 much」** |
| **`plenty of`** | **与 `enough` 的补课二选一**，且须等段位 | **上游逐字等于 `enough`**（我方 L71 已交）；**若将来开，唯一增量是 `enough of` + 限定词/代词（B1-B2）** |
| **`a couple of`** | **与 `several` 二选一**（已选 `several`） | 见 §6.1 第 3 课 |

### 6.3 ⚠️ 明确「不足一课」的项（10 项，逐条说明）

| 候选 | 可教增量条数 | 逐条说明 |
|---|---|---|
| **`take care of`** | **0** | 唯一「语法」内容是介词 `of`，**`of` 已 201 词次**；上游未收入任何语法分类 |
| **`give up`** | **1** | 只有「代词必夹中间」；**与我方 L63 `give it to me` 同型**（`give` 已有整课 L63，53 词次） |
| **`look after`** | **1** | 只有「介词动词不可分」；**与 L134–L138 `look forward to` 同型**（Cambridge **同一名单**） |
| **`come back`** | **0** | `come`（202）＋`back`（GL 2，非教学位）的组合，零规则 |
| **`go on`** | **0** | 15 义项，`continue` 义零语法；上游拿它当反面教材 |
| **`find out`** | **1** | 只有 `find` vs `find out` 辨析；**要求先会 `find`（GL 1）⇒ 成本高** |
| **`look for`** | **0** | 通则已被 L125–L133／L134–L138／L159 三次覆盖 |
| **`a lot of`** | **0** | **红线：逐字同义换词**（"similar in meaning to much and many"）＋ **案 9 已用** |
| **`enough`**／**`most`（最高级义）** | **⚫ 已交付** | `enough` L71 已 82 词次（未覆盖仅 B1-B2 级小节）；`most` 最高级义 L31 已教（36 词次） |

### 6.4 排期小结

- **本轮建议开课 3 课**（`most` 量词义 ／ `whole` ／ `several`），**全部为零基础段可用、词位成本 ≤1、每课 ≥2 条增量。**
- **建议顺位**：**`most` → `whole` → `several`**（`most` 最优先：规则页最厚 ＋ 词已入库 ＋ 与 L31 形成「同词两义」的干净对照；`whole` 次之：规则页最厚但 BC 零收录；`several` 第三：唯一需新造词位）。
- **A 组 7 项本轮建议 0 课**（组内最高 B−，且**全部为「已教规则的第三次应用」或「零规则词条」**）。**若将来要收 A 组，唯一合理入口是把它并入词汇线**（§3.2）。

---

## §7 未核实项

| # | 项 | 状态 | 影响 |
|---|---|---|---|
| **1** | **Murphy 双册 TOC（初级/中级）** | **❌ 本轮未复核**。本机归一化文件**不在本机**（`find` 全盘 `*murphy*` **0 命中**）；`cambridge.org` **403**、`archive.org` **连接超时**。**本报告引用的 Murphy 单元号（初级 U81／U77／U78／U95／U104／U105、中级 U88／U86／U59／U99／U46／U120／U25／U113 等）全部为「沿用批二十二至批三十的既有记录」，本轮未逐条复核。** | **中**：**「Murphy 课程位全部共用」是本批 B 组不升 A 的关键论据之一**。**若 Murphy 实际有 `most` 或 `whole` 的独立单元，B 组三项应升 A。** **⚠️ 建议下一批优先补这条**（前批已有两次同样缺口） |
| **2** | **British Council 直连** | **⚠️ 部分受限，已绕过**。`curl` 直连 `learnenglish.britishcouncil.org` **全程 403（AkamaiGHost）或 HTTP/2 `INTERNAL_ERROR`**；本轮改用 **WebFetch 取到 8 页**（含 B1-B2 `Phrasal verbs`／`Using 'enough'`／`Quantifiers`／`Verbs and prepositions`＋**三档 68 课全目**）。**⚠️ 但 WebFetch 返回的是「模型转述」，逐字引文的可靠性低于直连 HTML**；本轮**凡关键逐字均已标来源页题**，**但未做 HTML 层校验**。 | **中**：**BC 那句 "For a complete list … see the Cambridge International Dictionary of Phrasal Verbs" 与两课课位是本批核心论据**，**建议下一批用可直连环境复验** |
| **3** | **Cambridge slug 陷阱（任务书警告的坑）** | **✅ 本轮实测复现 3 次**。① `grammar/british-grammar/several` → **200 但页题 `English Grammar Today on Cambridge Dictionary`**（通用页，**无 `several` 内容**）→ **判「Cambridge 无 `several` 独立页」**；② 同上 `much-more-most`／`enough-adequate`／`all-most`／`almost-most`／`couple`／`give-up`／`look-after`／`come-back`／`look-for`／`take-care-of` **全部返回 200 ＋ 通用页题** → **均判「无独立页」**；③ `prepositional-verbs` → **200 但页题 `Phrasal verbs and multi-word verbs`**（**重定向到母页**）。**✅ 本报告所有 Cambridge 结论均已核对页面 title（`<title>` ＋ `h1` ＋ 面包屑三层）** | **✅ 已处置**：**三层校验后判定，无一项误采** |
| **4** | **中文侧假页 2 处** | **✅ 已实测识别**。① **`english.cool/look-for/` 200，但页题逐字是「「look forward to」用法是？加 V-ing？」**（`look for` 的 slug 被 `look forward to` 内容占据）；② **`english.cool/most/` 200，但页题逐字是「【實用英文單字】英文最美的8個單字！」**（完全无关）。**⇒ 两处均判「中文侧无对应专文」** | **✅ 已处置**：**若不复核 title 会误记「中文侧有 `look for` 专文」，这是本批第二个 slug 陷阱** |
| 5 | **`enough`** | 词次口径（任务书 GL 83 vs 本轮 82） | **⚠️ 差 1，已定位**：`raw`（全文件整词，**含整行注释**）**= 83**；**引号内整词（剔除整行 `//` 注释）= 82**。**差的那 1 处是 L70 的整行注释**（逐字 `// ── 第十批 · L71 够轻拿得动（enough）：L66 镜像收尾…`）——**按本项目「注释内的命中不计」既定纪律取 82**。**不改变结论**（82／83 均 100% 落在 L71） |
| 6 | **`most`** | 词次口径（任务书 GL 30 vs 本轮 36） | **⚠️ 差 6，三口径均未复现 30**：**整词 = 36**（L31 独占）／**含 `almost`（L142 `Dinner is almost ready!`）的裸 grep 行数 = 30**／**唯一字符串去重 = 26**。**本报告取 36**（与批三十「`each` 的 110 全是 `teacher` 词内」同纪律：**用整词边界口径**）。**⚠️ 我未能复现恰好 30，登记供数析复核**；**但「量词义真零」在 26／30／36 三口径下均成立**（36 处逐条复看全是最高级义）⇒ **不影响档位** |
| 7 | **`most` 的 Oxford 义项** | **⚠️ 部分**：只取到前 3 义（`a1`×2＋1 义未标），**后 3 义（含 `adverb` 块）未细查** | **低**：本报告只用首两义（均 `a1`） |
| 8 | **批二十九 §7 项 10 的对齐** | **✅ 已对齐**：该批登记「`most`（量词义）是另开的轴，不属本批」，**本轮把该轴正式列为候选并判 B** —— **方向一致，本轮从「登记」升级为「排期候选」** | **✅ 无冲突** |
| 9 | **`whole` 批二十六判 C＋ 的原始依据** | **⚠️ 未取到批二十六原文**（仅从任务书转述得知）。**故 §2.4 只写「很可能未取到 `Whole` 页」，未断言其取证过程** | **中**：**若批二十六实际取到 `Whole` 页仍判 C＋，其理由需被正面回应；我未见原文，不做此判断** |
| 10 | **A 组 7 项的 `-ing`／`to` 形式** | **⚠️ 未系统查**（`giving up`／`looking for` 的 `-ing` 用法、`find out` 后的 `that` 从句） | **低**：A 组已全判不做 |
| 11 | **`several`／`a couple of` 的 Murphy 侧** | **❌ 未复核**：按既有记录两词均无独立单元，本轮无 Murphy 源（见项 1） | **中**：与项 1 同源风险 |

---

## §8 本轮与前批结论的差异一览（便于主理人复核）

| 项 | 前批／任务书记录 | **本轮复核** | 差异性质 |
|---|---|---|---|
| **`whole`** | 批二十六判 **C＋** | **B（上调半档）** | **⚠️ 结论变更**：本轮新取到 Cambridge **独立页 `Whole`** ＋ **独立易混页 `All or whole?`**；**按 C 档定义「无规则页」不成立** |
| **`enough`**／**`most`** | 任务书标 GL **83**／**30** | **`enough` 82（100% 落 L71，整课已交付）／`most` 36（36/36 最高级义，量词义确为零）** | **⚠️ 两条口径均有差（已定位）；`enough`「已教过」成立但「在使用」不成立；`most` 方向一致并升级为排期候选** |
| **`look for`** | 任务书标 GL **1** | **GL 1 ✅（L27 错句里，教学点是 `-ing`，非 `look for`）** | ✅ 一致 |
| **`list of phrasal verbs`** | — | **⚠️ 新增**：Cambridge `Phrasal verbs` 页分三类（phrasal／prepositional／phrasal-prepositional），**本批 7 项分属三类**（`look after`／`look for` 是**介词动词**不是短语动词；`take care of` 不在任何名单） | **⚠️ 本轮新增结构性发现** |
| **BC 课程位** | 前批记「BC 三档 68 课零专课」 | **⚠️ 需细分**：**`Phrasal verbs`（B1-B2）＋ `Word order in phrasal verbs`（C1）＋ `Using 'enough'`（B1-B2）三课存在**，**但它们不以本批任一词为标题** ⇒ **「词无课程位」成立，「规则无课程位」不成立** | **⚠️ 提法需精确化** |

**报告完毕 · 竞析 · 2026-09-20**——**全部词次可复跑**（引号内整词、剔除整行注释、打印所属课号）；**全部跨源引文均标注页题与 URL slug**；**Cambridge 结论均已过 title／h1／面包屑三层校验**。
