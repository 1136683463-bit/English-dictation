# 竞品/跨源分析 · 语法线「小美的一天」第二十八批

**日期**：2026-09-20 ｜ **分析**：竞析（竞品/跨源分析师）｜ **上游**：批二十七路线图 §6 携带项 4／5／6 ＋ 主理人本批三条轴命题
**口径（沿用前批，未改）**：**A 档**＝跨源有**课程位**（教材独立单元/课时）＋我方有缺口；**B 档**＝跨源**有规则页但无课程位**，或须造词但成本可控；**B−**＝介于 B 与 C 之间；**C 档**＝只有零散例句；**D 档**＝跨源基本不收。
**关键概念**：**课程位** ＝ 上游当作独立教学单元（专门一课/单元）；**规则页** ＝ 只有参考性页面但不成课。

> **本批特别声明（前批 §6 携带项 1 的制度后果）**：批二十七主理人拦下一处**研究引文失实**，并把「逐字引用抽检」列为验收步骤。**本轮所有引文一律标注来源，我查证的与我不确定的严格分列（§8）。凡我未亲自取到的页面，一律登记为「未核实」，不做推断。**

---

## §0 本轮新增的本地实证（先立口径，后文全部引用它）

### 0.1 我方缺口（本轮实测，逐词计数）

**方法**：`src/data/grammarLessons.ts`（**29196 行**，本轮实测）按 `\n    number: N,` 切块（**154 块，编号 1–154 无缺口**），块内做**严格词边界**计数（`(?<![A-Za-z])词(?![A-Za-z])`，**排除 `although` 命中 `though` 一类子串误报**——沿用批二十七的修正口径）；对照 `src/data/huntCases.ts`（**163 案**，实测）与 `src/data/grammarSeasons.ts`（**27 季**，实测）。

| 候选词 | GL（课内） | HC（案内） | 判定 |
|---|---|---|---|
| `none` | **0** | **0** | **真零**（大小写两轮均 0） |
| `nobody` | **0** | **0** | **真零** |
| `no one` | **0** | **0** | **真零**（`No one` 亦 0） |
| `nothing` | **71** | **5** | **已教**（L84 正课 `There is nothing in the box.`） |
| `ago` | **0** | **0** | **真零** |
| `since` | **0** | **0** | **真零** |
| `days` | **1** | **4** | **课内仅 L134 对白 `Only two days to go!`（非教学位）**；案内 4 处全为 `three day`→`three days` 型复数题（`#66 calendar-note`／`#85 feel-better` 等） |
| `weeks` | **0** | **0** | **真零（课内＋案内均 0）** |
| `years` | **0** | **0** | **真零（课内＋案内均 0）** |
| `hours` | **0** | **3** | **课内零**；案内 3 处：`#8 tense-jump` 的 `We talk for hours` ／ `#102 old-playground` 的 `two hour`→`two hours`（同一案内 2 处命中）——**全部不是教学点** |
| `months` | **2** | 0 | L56／L137 场景句，**非教学位** |
| `minutes` | **17** | **3** | **L73 教学位（`ten minutes`）＋ L20／L82 案内复数题** |
| `day`（单数） | **241** | **42** | 多为 `every day`／`day` 名词本体 |

> **□ 主理人命题复核（逐条）**
> - **「`days` GL 1」——成立。** 唯一命中在 **L134 `{ who: "npc", en: "Only two days to go!", zh: "同桌在课间掰着手指数。" }`**（L134 = `lesson-134` 我盼着周末），是**同桌对白**，不是教学位。
> - **「`weeks` GL 0／`years` GL 0／`hours` GL 0」——三条全部成立。**
> - **「数字＋时间词复数」在教学位上的覆盖**：**只有 `minutes` 一个词进过教学位**（**L73** `It takes ten minutes.` ＋ 案 `#82 trip-time` 的 `ten minute.`→`minutes.`）。**`days`／`weeks`／`years`／`hours` 在教学位上是全空。**

### 0.2 `for` ＋ 时长（轴 C 的核心缺口）

**方法**：对 `grammarLessons.ts` 全文跑三组模式（本批新写）：
`for (a|an|two|…|\d+|a few|many) + [≤18 字符] + (day|week|month|year|hour|minute|time|while)s?` ／ `for (a )?long time` ／ `for hours`。

**结果：三组全部零命中。**

| 观察 | 逐字读数 |
|---|---|
| `for` 总 GL | **156** |
| `for` 在课内的**实际分布** | `for you.`（**30**）／`for my mom.`（**16**）／`for me?`（**8**）／`for me.`（**5**）／`for the weekend`（**4**，L40／L49）／`for the summer`（**1**，L46）／`for tomorrow?`（**2**）——**全部是「给谁／为了什么／为哪个场合」，无一例表「持续多久」** |
| `for` ＋ 时长 | **零命中**（三组模式全 0） |
| HC 里的 `for` ＋ 时长 | **仅 3 处，且全在案内**：`#8 tense-jump` `We talk for hours and laugh a lot.`（**但 `talk` 本身是要改错的 token，不是教学内容**）／`#12 new-phone` `I waited for a hour in a shop.`（**错误点只有 `the`→`a` 与 `a`→`an`**）／`#102 old-playground` `Two hour are here.`（**错误点是 `hour`→`hours` 与 `are`**） |

> **⇒ `for` ＋ 一段时间的「持续多久」义，我方在教学位上是真零。批二十七登记的这条待评估项，本轮复核成立且证据更硬（不只是「零」，而是「`for` 的 156 次命中全在另一条义项上」）。**

### 0.3 我方已有的「时间长度」相关教学位（轴 B／轴 C 的邻居盘点）

| 课 | 逐字 `grammarLabel` | 逐字目标句 | 与时长轴的关系 |
|---|---|---|---|
| **L73** | `要花多久 · How long does it take? + It takes…` | `How long does it take?` / `It takes ten minutes.` | **问「要花多久」——但主语是 `it`（那段路/那件事），不是「我持续」** |
| **L72** | `多久一次 · How often + 答语词块` | `How often do you run?` | 频率轴（`twice a week`），非长度轴 |
| **L28** | `多久一次 · always / often / never` | — | 频率轴 |
| **L109** | `等到…为止 · until + 小句子` | `I waited until the rain stopped.` | **已经有 `waited` ＋ 「等」语义——本批的「邻居」** |
| **L97／L98／L99** | `那时候 · when + 当时正做着` ／ `两件同时 · while + 都在穿 -ing` ／ `哪件用哪个版本 · 进行 vs 昨天版` | `When you called, I was reading.` / `While I was reading, he was sleeping.` | **过去进行块——已在 `during` 做对照（见下）** |
| **L90／L91／L92／L109** | `先后 · after + 小句子` ／ `先后 · before + 小句子` ／ `什么时候 · when + 小句子` ／ `等到…为止 · until + 小句子` | — | **连词＋小句子一族已成立** |
| **L10／L11／L24** | `说昨天的事` ／ `好几个 + 特殊的昨天版` ／ `过去 vs 完成` | `Yesterday I went to the park.` / `I ate two sandwiches.` | **过去简单式底座已浇好；L24 已立「具体时间点⇒昨天版」判据** |

> **L98 的 `during` 对照（本批新发现，逐字）**：L98 的 `contrast` 卡逐字——
> `whyZh: "during 后面只能跟「名字」（during the class），跟不了小句子——要说一整句，得用 while 领路。"`；
> 其 `deepDive.summary` 逐字含 **`"during ❌ 跟小句子 —— 它只认名字（during the class）"`**，且段末逐字 **`"今天只作对照，混个脸熟。"`**
> **⇒ `during` 已在 L98 以「只认名字」的对照位出现过（认读级，非教学位）。这是我方对「介词＋名词」这一格唯一的既有点位。**

### 0.4 对比卡的**真实结构**（沿用批二十七的口径修正，本轮复算到 L154）

**方法**：对最近 24 课逐课统计 `contrast` 数组的「新错例数（有 `wrongMark`）」/「双正解复现数（`bothRight: true`）」。

| 课 | total | bothRight | 新错例 | 课 | total | bothRight | 新错例 |
|---|---|---|---|---|---|---|---|
| L131 | 6 | 3 | 3 | L143 | 6 | 3 | 3 |
| L132 | 6 | 3 | 3 | L144 | 6 | 2 | 4 |
| L133 | 6 | 2 | 4 | L145 | 6 | 3 | 3 |
| L134 | 6 | 3 | 3 | L146 | 6 | 3 | 3 |
| L135 | 6 | 3 | 3 | L147 | 6 | 2 | 4 |
| L136 | 6 | 3 | 3 | L148 | 6 | 3 | 3 |
| L137 | 6 | 3 | 3 | L149 | 6 | 3 | 3 |
| L138 | 6 | 2 | 4 | L150 | 6 | 2 | 4 |
| L139 | 6 | 3 | 3 | L151 | 6 | 3 | 3 |
| L140 | 6 | 3 | 3 | L152 | 6 | 3 | 3 |
| L141 | 6 | 2 | 4 | **L153** | **6** | **3** | **3** |
| L142 | 6 | 3 | 3 | **L154** | **6** | **3** | **3** |

**⇒ 稳定配方 = 「3 条带标记新错 ＋ 3 条双正解（回流老课）」**。**本批三轴一律按「每课只需 3 条真新错」评估**，凡拿不出 3 条的，直接说拿不出。

### 0.5 两条与本批直接冲突的**库内既有承诺**（本轮实测，逐字）

| # | 位置 | 逐字 | 对本批的后果 |
|---|---|---|---|
| **1** | **L151 `variants` 否定卡**（`src/data/grammarLessons.ts:28490`） | **`{ label: "否定", en: "I don't like coffee.", zh: "我不喜欢咖啡。", noteZh: "这是第 5 课的老句子（all 管肯定侧，否定侧下一批再看）。" }`** | **库里已对用户明文许下「否定侧下一批再看」**——**「下一批」从 L152 的批次算起，本批正是它** |
| **2** | **L152 `variants` 否定卡**（`:28684`） | **`{ label: "否定", en: "I don't like coffee.", zh: "我不喜欢咖啡。", noteZh: "第 5 课的老句子（every 管肯定侧）。" }`** | **`every` 的否定卡没有承诺**——**两条卡的措辞不同，本批只兑现 L151 那一条** |

> **⚠️ 与批二十七的关系**：批二十七主理人在 §1.1 拦下的是瑞思**误引 L152**（瑞思称 L152 有「否定侧下一批再看」，实测在 **L151**）。**本轮独立复核确认：该句确实存在，位置是 L151 第 28490 行。** **⇒ 瑞思的方向没错、位置错了；这枚钩子是真的、可兑现的。**

### 0.6 「自带不＋不再请 not」这条规矩的**已教次数**（轴 A 的减分项，本轮复算）

**方法**：扫全部 154 课，搜 `自带「不」`／`两个「不」`／`不再请 not`／`不加 not` 四个逐字串。

| 逐字串 | 命中次数 | 落在哪些课 |
|---|---|---|
| `自带「不」` | **14** | **L83 / L84 / L86** |
| `两个「不」` | **8** | **L84 / L149 / L150** |
| `不再请 not` | **4** | **L84** |
| `不加 not` | **1** | **L153** |

**L84 正课 `oneLineRule` 逐字**：`"说「什么也没有」用 nothing——它自带「不」，句子里不再请 not；someone 是「有人」，一个人配 is。"`
**L84 深挖卡逐字**：`"nothing 和 not 不同台"`／`"I don't have anything——not + anything，两个「不」其实是一个意思的两种说法"`。

> **⇒ 「一句里不请两个不」这条规矩，L84／L86 已立 ＋ L149／L150／L153 三次复现 ＝ 至少 3–5 次在场。** **轴 A 若要讲「不能再加 not」，这是第 4–6 次应用，不是新知。**

---

## §1 逐候选档位判定

### 1.1 轴 A 候选

| 候选 | ① 跨源逐字证据 | ② 课程位 | ③ 规则页 | ④ 档位 | ⑤ 理由 |
|---|---|---|---|---|---|
| **`none`** | **Cambridge 独立页 `No, none and none of`**（面包屑逐字 `Grammar > Nouns, pronouns and determiners > Quantifiers > No, none and none of`）；**逐字** "**No, none and none of indicate negation.**"／"**None is the pronoun form of no. None means 'not one' or 'not any'.**"；**`None of` 小节四条规则逐字**："**We use none with of before the, demonstratives (this, that), possessives (my, your) or pronouns:**"／"**We don't use none of when there is already a negative word (not, n't) in the clause:**"（❌`Not: She doesn't remember none of us.` 正解 `She doesn't remember any of us.`）／"**When we are referring to two things or people, we use neither of rather than none of:**"（❌`Not: None of us said anything.` 正解 `Neither of us said anything.`）／"**In formal styles, we use none of with a singular verb when it is the subject.**"＋"**However, in informal speaking, people often use plural verbs:**"；**`Typical error` 逐字** "**We don't use none directly before nouns. We use no + noun or none of + noun**"（❌`None children in my group …`）；**Warning 逐字** "**We don't use none where we mean no one or nobody.**"；**单复数逐字** "**When none is the subject, the verb is either singular or plural depending on what it is referring to.**"（`None ever comes.`／`None ever come.`）；**CEFR：Cambridge 词典 `none` 逐字 `B1`／Oxford `none` 逐字 `a2`（Oxford 3000 标 `level=a2`）**；**中文侧**：直连 `english.cool/none/` **404**（本轮实测），**但 `english.cool/quantifiers/` 实测 200 且含独立小节 `none`**，逐字 "**none 為 not one 的合併，表示「一個都不…」**"／"**none 後面若需要接名詞，就要使用 none of**"／"**none 會強調在某個範圍內都不…，no 則沒有限定範圍～**"；**Murphy**：**初级 U77 标题逐字 `77not+anynonone`**（四词一格）／**初级 U81 逐字 `81allmostsomeanyno/none`**（五词一格）／**中级 U86 标题逐字 `86no/none/anynothing/nobodyetc.`（第一行 `no/none/any`）**／**中级 U88 逐字 `88all/allofmost/mostofno/noneofetc.`** | **✅ 有，4 处，但全部共用**（四词／五词／两行／四词） | **✅ 有且厚**（独立页＋3 条 Warning＋1 条 Typical error＋5 条 `None of` 规则＋中文侧独立小节） | **B＋** | **见 §2 复核：与批二十七结论一致。** **本轮新增两条反向证据**：**① 规则页比批二十七描述的还厚**（`None of` 小节本轮取到 5 条规则，其中 2 条是新逐字）；**② 但「`none of` 后面必须跟限定词」这条**——**Cambridge 的原文是「用 `none with of before the/demonstratives/possessives/pronouns`」，是「可以跟这些」，不是「必须跟」** ⇒ **批二十七把这条读成了禁令，本轮修正为「许可清单」**（见 §8①） |
| **`no one`** | **Cambridge 独立页 `No one, nobody, nothing, nowhere`**（面包屑 `Grammar > Nouns, pronouns and determiners > Pronouns > No one, nobody, nothing, nowhere`）；**逐字** "**No one, nobody, nothing and nowhere are indefinite pronouns.**"／"**We use no one, nobody, nothing and nowhere to refer to an absence of people, things or places.**"／"**We use them with a singular verb**"；**`No one or nobody?` 小节逐字** "**No one and nobody mean the same. Nobody is a little less formal than no one.**"／"**We use no one more than nobody in writing**"；**拼写逐字** "**We write no one as two separate words or with a hyphen: no one or no-one but not noone.**"；**禁用逐字** "**We don't use nobody, no one, nothing, nowhere after no, not, never or other words which have a negative meaning (hardly, seldom).**"（❌`Not: I can't do nothing.`／❌`Not: She talks to hardly no one.`）；**强度逐字** "**Nobody, no one, nothing, nowhere are stronger and more definite than not … anybody/anyone/anything/anywhere**"；**CEFR：Cambridge 词典 `no one` 逐字 `A2`／Oxford `no one` 逐字 A1（Oxford 3000 标 `level=a1`，并逐字 "**No one is much more common than nobody in written English.**"）**；**中文侧**：`english.cool/no-one/` 与 `nobody/` 均 **404**（本轮实测） | **⚠️ 有但均无独立格**：初级 U78 标题逐字 `78not+anybody/anyone/anythingnobody/no one/nothing`（六词一格）；中级 U86 第二行 `nothing/nobodyetc.` | **✅ 有**（独立页＋4 条禁区＋拼写条） | **B** | **复核成立**：规则页独立但**它是「四词同页」**（`no one`／`nobody`／`nothing`／`nowhere` 共享），**且 `nothing` 我方已教（L84）** ⇒ 规则页里关于「自带不／不再请 not」的那半页**对我方是复述** |
| **`nobody`** | 同上（与 `no one` 同页）；**对比逐字** "**Nobody is a little less formal than no one.**"；**CEFR：Cambridge 词典 `nobody` 逐字 `A2`／Oxford `nobody` 逐字 A1（Oxford 3000 `level=a1`），并逐字 "**Nobody is more common than no one in spoken English.**"** | **⚠️ 同上**（初级 U78 ＋ 中级 U86 第二行） | **✅ 同上** | **B** | **复核成立。** **⚠️ 本轮新增一条硬证据**：**两源对 `no one`／`nobody` 的「书面/口语」分工是互相印证的**（Cambridge：`no one` 写作多；Oxford：`nobody` 口语多，`no one` 书面多）⇒ **这确实是一条真规则，不是我方为凑课量编的** |
| **`nothing`（对照，已教）** | Cambridge 同页（与 `no one` 共页） | 同上 | ✅ | **已教（L84）** | **批二十七的「两轴论」本轮复核成立**：Cambridge 把 `none` 放在 `Quantifiers` 页、把 `nothing` 放在 `Pronouns` 页，**两页分列**；Murphy 中级 U86 第一行 `no/none/any` vs 第二行 `nothing/nobody etc.` **两行分列** ⇒ **`none` 是「范围里的零」，`nothing` 是「东西的零」，两条不同轴** |

### 1.2 轴 B 候选

| 候选 | ① 跨源逐字证据 | ② 课程位 | ③ 规则页 | ④ 档位 | ⑤ 理由 |
|---|---|---|---|---|---|
| **`ago`** | **Cambridge 独立页 `Ago`**（面包屑 `Grammar > Adjectives and adverbs > Adverbs > Time adverbs > Ago`）；**逐字定义** "**The adverb ago refers to a period of time that is completed and goes from a point in the past up to now.**"；**位置规则逐字** "**Ago follows expressions of time**"（❌`Not: They arrived in Athens ago six weeks.`）；**Warning 逐字** "**We normally use ago with the past simple. We don't use it with the present perfect:**"（❌`Not: I have received his letter four days ago.`）；**时长对照逐字** "**If we refer to how long something lasted, we use for (not ago):**"（例 `When I was at school, I studied Russian for five years.`）；**CEFR：Cambridge 词典 `ago` 逐字 `A2`／Oxford `ago` 逐字 A1（`level=a1`），定义逐字 "**used in expressions of time with the simple past tense to show how far in the past something happened**"，搭配逐字 "**two weeks/months/years ago**"／"**The letter came a few days ago.**"／"**How long ago did you buy it?**"**；**BC 逐字（`when-time-and-dates`，`Level: elementary`）**："**We use ago with the past simple to say how long before the time of speaking something happened**"＋例 "**I saw Jim about three weeks ago.**"／"**We arrived a few minutes ago.**"；**BC `past-simple`（`Level: beginner`）逐字**："**we often use expressions with ago with the past simple:**"＋例 "**I met my wife a long time ago.**"；**Murphy：初级 U19 标题逐字 `19forsinceago`（三词一格）／中级 TOC `ago` 零命中** | **⚠️ 半有**：**初级 U19 三词共用**（`for`／`since`／`ago`），**中级无 `ago` 单元**；**BC 三档 68 课全目（A1-A2 18／B1-B2 36／C1 14，本轮逐条复点）无 `ago` 专课** | **✅ 有**（Cambridge 独立页＋1 条 Warning＋1 条时长对照） | **B＋** | **复核成立，且比批二十七的台账更清楚**：**课程位是「三词一格」但 U19 前后零间隔**（`18Howlonghaveyou…` → `19forsinceago` → `20Ihavedone…andIdid`）；**BC 把它放在两个参考页里当句子成分（非独立课）**；**规则页只有 2 条规则（位置＋不用完成时）** ⇒ **2 条硬增量，不足以单开一课** |
| **`days`／`weeks`／`years`／`hours`（形态缺口）** | **本批新增查证**：**Cambridge 的 `ago` 页典型搭配是「时间量 ＋ ago」**，逐字 "**Ago follows expressions of time**"；**Oxford 的 `ago` 词条 headword 搭配逐字 "two weeks/months/years ago"**；**BC `when-time-and-dates` 逐字例 "I saw Jim about three weeks ago."／"We arrived a few minutes ago."**；**BC `how-long` 页逐字例 "We have been waiting for twenty minutes."／"They lived in Manchester for fifteen years."**；**BC `past-simple` 逐字例 "I lived abroad for ten years."** | — | — | **不单独成档（它是轴 B／轴 C 共享的**造词成本**，不是独立候选） | **⇒ 我方要开 `ago`，必须同时造 `days`／`weeks`／`years` 中的复数形态（见 §3.3 成本表）** |
| **`for` ＋ 一段时间** | **Cambridge 同页逐字（`Ago` 页内）**："**If we refer to how long something lasted, we use for (not ago):**"；**Cambridge `For` 页**（面包屑 `Grammar > Prepositions and particles > For`）**小节逐字** `For: purpose`／`For someone`／**`For: duration`**／`For: exchange`／`For meaning because`／`For in multi-word verbs`；**`For: duration` 逐字** "**We use for with a period of time to refer to duration (how long something lasts)**"；**Warning 逐字** "**Don't confuse for and in when referring to time:**"（对照例 `We're going to Cape Town for two months.` vs `We're going to Cape Town in two months.`）；**Cambridge 独立对比页 `For or since?`**（面包屑 `Grammar > Easily confused words > For or since?`）**逐字** "**We use for with a period of time in the past, present or future.**"／"**We use since with a point in time in the past.**"／"**For refers to periods of time, e.g. 3 years, 4 hours, ages, a long time, months, years.**"／"**Since refers to a previous point in time.**"；**Warning 逐字** "**We don't use since with periods of time:**"（❌`She's been on the phone since hours.` 正解 `She's been on the phone for hours.`）；**Cambridge `Present perfect simple (I have worked)` 页逐字** "**We use the present perfect simple with for and since to talk about a present situation that began at a specific point in the past and is still going on in the present.**"＋例 "**That house on the corner has been empty for three years.**"（❌`Not: … since three years.`）／"**That house on the corner has been empty since 2006.**"（❌`Not: … for 2006.`）——**⚠️ 该页没有 `I have been here for three days.` 逐字**（我逐字问过，回答是「No such sentence appears」）；**BC `how-long` 页（`Level: beginner`）逐字** "**We use for to say how long**"／"**We can also use a noun phrase without for**"／"**We use since with the present perfect or the past perfect to say when something started**"；例 "**We have been waiting for twenty minutes.**"／"**They lived in Manchester for fifteen years.**"／"**I've worked here twenty years.**"；**BC `present-perfect-simple-continuous`（B1／B2）逐字** "**We often use for, since and how long with the present perfect simple to talk about ongoing states.**"／"**We often use for, since and how long with the present perfect continuous to talk about ongoing single or repeated actions.**"；**Murphy：初级 U19 `19forsinceago`／初级 U104 标题逐字 `104from…tountilsincefor`／中级 U12 标题逐字 `12forandsincewhen…?andhowlong…?`** | **✅ 有，三处，全部共用**（U19 三词／U104 五词／中级 U12 四词） | **✅✅ 有且厚**（独立页 `For`＋独立对比页 `For or since?`＋Warning 两条＋`Present perfect simple` 页的 for/since 段＋BC 两页） | **A−** | **本批三条轴里跨源证据最厚的一个**：**① 有独立对比页（`For or since?`）——「对比页」在上游是独立课位的信号**；**② Murphy 三处课程位；③ BC 两页专段 ＋ Level: beginner 级**；**④ CEFR 友好（Oxford `for` 时长义逐字标 `a1`）**。**扣掉半档的唯一理由：三处课程位全是共用格，且它必须与 `since` 成对才成立** |

### 1.3 轴 C 的配对候选（主理人指名要回答）

| 候选 | ① 跨源逐字证据 | ② 课程位 | ③ 规则页 | ④ 档位 | ⑤ 理由 |
|---|---|---|---|---|---|
| **`since`** | **Cambridge 独立页 `Since`**（面包屑 `Grammar > Words, sentences and clauses > Conjunctions and linking words > Since`）；**7 节逐字**：`Since`／`Since: time`／`Since and tenses`／`Since + -ing`／`Since, since then`／`Since: reason`／`Since: typical errors`；**时态逐字** "**we can use the past simple or present perfect after since and the present perfect in the main clause**"；**`it + be + time + since` 逐字** "**We can use the past simple, present perfect or past perfect after since with the expression it + be + time + since.**"；**typical errors 四条逐字**，其中两条与本批直接相关："**We don't use since with extended periods of time. We use for**"／"**We use since, not ago, after 'it's a long time' when we refer back to a point in time**"（❌`Not: It's a long time ago your last letter.` 正解 `It's a long time since your last letter.`）；**CEFR：Cambridge 词典 `since` 逐字 副词 `B2`／介词 `A2`／连词 `B1`（两义均 B1）**；**Oxford `since` 逐字 `a2`**；**中文侧 `english.cool/since/` 实测 200**，六节逐字含 `since 自從`／`since 既然、因為`，**核心逐字** "**since 後面的主要子句會用「現在完成式」來表示**" | **✅ 有，三处全部共用**（初级 U19／初级 U104／中级 U12） | **✅ 有且厚**（独立页 7 节＋4 条 typical errors＋中文专文 200） | **C＋** | **复核成立（批二十七判 C＋，本轮不变）**：**承重墙是复合结构**——**主句现在完成 ＋ `since` ＋ 从句过去式**。**我方 L21–L24 有现在完成、L10 有过去式，但「两件拼一起」是第三张脸**；**且 Cambridge 词典三义全在 A2–B2，对零基础偏难** |

---

## §2 轴 A 专项：`none`／`no one`／`nobody` 的课量建议

### 2.1 直接回答主理人的三个问题

| 主理人的问题 | 本轮答案 |
|---|---|
| **`none` 能否撑一课（含 3 条真新错）？** | **能。✅** **本轮逐条核到 3 条，且三条全部单源可验**（见 2.2） |
| **`nobody`／`no one` 能否撑一课（含 3 条真新错）？** | **不能。❌ 只凑到 2 条，且第 2 条是拼写（我方零基础课不设拼写考点）。** |
| **合并一课？** | **❌ 不合并。** **本轮给出第三条路：`none` 单独 1 课，`no one`／`nobody` 降为「对照位」放进同一课末尾（不占独立课）。** |
| **原因（一句话）** | **`none` 与 `no one`／`nobody` 的第 1 条硬增量是同一条规矩的两种说法**（"不能再加 not"），**而这条规矩 L84 已教、L149／L150／L153 已复现 3 次**（§0.6）⇒ **拆成 2 课就是第 5–7 次应用，「一课一增量」必破。** |

### 2.2 `none` 的 3 条真新错（逐条可验）

| # | 增量 | 跨源逐字依据 | 我方回流位 |
|---|---|---|---|
| **①** | **`none` 不能直接接名词；要接名词必须 `none of + the/my/this/them`** | **Cambridge `Typical error` 逐字** "**We don't use none directly before nouns. We use no + noun or none of + noun**"（❌`None children in my group …`）＋ **`None of` 小节逐字** "**We use none with of before the, demonstratives (this, that), possessives (my, your) or pronouns:**" | **L151 `All the books are good.` 的「限定词直接接」骨架**（对照：`all` 直接接 `the`，`none` 必须 `of`） |
| **②** | **两个东西用 `neither of`，不用 `none of`** | **Cambridge 逐字** "**When we are referring to two things or people, we use neither of rather than none of:**"（❌`Not: None of us said anything.` 正解 `Neither of us said anything.`——**示例语境就是「两个人」**：`We sat down at the table, just the two of us.`） | **⚠️ 直接回流 L149（`Neither book is good.`）——这是加分**，做成跨批回流卡 |
| **③** | **`none` 单独站时是代词（后面什么都不接）；`none of` 才带范围** | **Cambridge 逐字** "**None is the pronoun form of no. None means 'not one' or 'not any'.**"＋"**None is a pronoun.**"；**中文侧逐字** "**none 為 not one 的合併，表示「一個都不…」**"／"**none 後面若需要接名詞，就要使用 none of**" | **L84 `nothing`（`I have nothing.`）**——同为「一个词自带不」，但**轴不同**（东西 vs 范围） |

> **⇒ 3 条成立。第 3 条的强度最弱（是词性说明而非禁用），但它带一条中文侧独立小节支撑，且与 L84 形成「两条轴」的对照——这正好是 §5 要的「新结构」证据。**

### 2.3 `no one`／`nobody` 的增量清点（为什么撑不起第二课）

| # | 增量 | 跨源逐字 | 判定 |
|---|---|---|---|
| ① | **不用在 `no`／`not`／`never`／`hardly`／`seldom` 之后**（❌`I can't do nothing.`／❌`She talks to hardly no one.`） | Cambridge 逐字 "**We don't use nobody, no one, nothing, nowhere after no, not, never or other words which have a negative meaning (hardly, seldom).**" | **🔴 不是新知**：**规则本身与 L84 教的「自带不＋不再请 not」同一条**；**且 `hardly`／`seldom` 两词我方 GL 实测均为 0**（`hardly` GL 0／HC 0）⇒ **例句里的反例词我方用户没见过** |
| ② | **`no one` 写作两词或连字符，不写 `noone`** | Cambridge 逐字 "**We write no one as two separate words or with a hyphen: no one or no-one but not noone.**" | **🔴 拼写考点——零基础 6–10 分钟课不设**（沿用批二十七同款裁决） |
| ③ | **书面用 `no one`／口语用 `nobody`** | Cambridge 逐字 "**We use no one more than nobody in writing**"＋"**Nobody is a little less formal than no one.**"；Oxford 逐字 "**Nobody is more common than no one in spoken English.**"／"**No one is much more common than nobody in written English.**" | **🟡 真规则，但它是「同一意思的两种说法」的语域差异**（§5 判「半新」）——**够做 1 条对比卡的 `whyZh`，不够撑一课的一课一增量** |
| ④ | **配单数动词** | Cambridge 逐字 "**We use them with a singular verb**" | **🔴 我方 L84 已教同款**：`Someone is at the door.`／`Someone are at the door.`❌（L84 对比卡逐字 "someone 是「一个人」：配 is——第 26 课单好几个判断的老规矩。"） |

> **⇒ `no one`／`nobody` 的真新错 = 1 条（③）。距离 3 条差 2 条。** **❌ 撑不起第二课。**

### 2.4 课量建议（最终）

| 方案 | 课量 | 判定 | 理由 |
|---|---|---|---|
| `none` 一课 ＋ `nobody` 一课 | 2 课 | **❌ 否** | 第二课只有 1 条真新错（§2.3），且第 ① 条是 L84 已教规矩的第 5–7 次应用（§0.6） |
| 两词合并一课 | 1 课 | **❌ 否** | Cambridge **明文警告** "**We don't use none where we mean no one or nobody.**"——**两词是「不能互换」的关系**，合并会把「用哪个」和「都不用」混成一锅；**且两词的轴不同**（范围 vs 人） |
| **`none` 1 课 ＋ `no one`/`nobody` 作对照位** | **1 课** | **✅ 推荐** | **① `none` 有 3 条独立可验的新错；② 对照位复用 L151 已许下的钩子（§0.5），口径一致；③ 造词成本最低（见 2.5）；④ 与 L84 形成「两条轴」对照，符合 §5 的「新结构」判据** |

### 2.5 必造词位与「一课一增量」

| 课 | 主词 | 一课一增量（中文一句话） | 必造词位 | 硬增量条数 | 上限 |
|---|---|---|---|---|---|
| **第 1 课** | **`none`（＋`none of`）** | 「**一个都不**」＝ not one：**单独站是代词，要带范围就必须 `none of + 限定词`**；**两个东西不用它（用 `neither of`）** | **1**（`none`；`no` 我方 GL **32** 但**全为 `No, thanks.`／`no answer` 等非量词义** ⇒ 若课上带 `no + 名词` 则 **2**） | **3 条**（§2.2 全条） | **1 课** |
| **对照位（不占课）** | **`no one`／`nobody`** | 「**一个人也没有**」：**跟单数动词**；**写作用 `no one`、口语用 `nobody`** | **2**（`no one` 两词算一个词位 ＋ `nobody`） | **1 条**（§2.3 ③） | **0 课** |

> **⚠️ 对照位的落地口径建议**：放进第 1 课的 `sceneSwings`／`variants` 各 1 格（**不占 `contrast` 的 3 条新错名额**），并在 `deepDive` 用一句 Cambridge 逐字反向点明「**`none` 不能拿来指人**」（"We don't use none where we mean no one or nobody."）⇒ **这正好兑现 L151 那张卡上「否定侧下一批再看」的承诺**。

---

## §3 轴 B 专项：`ago`

### 3.1 课程位复核（主理人线索：Murphy 初级 U19）

| 源 | 逐字 | 判读 |
|---|---|---|
| **Murphy 初级 U19** | 标题归一化逐字 **`19forsinceago`**；上下文逐字 **`…17Haveyouever…?(presentperfect3)18Howlonghaveyou…?(presentperfect4)19forsinceago20Ihavedone(presentperfect)andIdid(past)…`**（本轮从 `/private/tmp/murphy_ess_norm.txt` 逐字复读，偏移 925） | **✅ 课程位成立——但三词共用一格，且 U18→U19→U20 零间隔** |
| **Murphy 初级 U104** | 标题归一化逐字 **`104from…tountilsincefor`**（上下文逐字 `…103at8o'clockonMondayinApril104from…tountilsincefor105beforeafterduringwhile…`，**本轮新取到，批二十七未登记**） | **✅ 第二处课程位——五词共用（`from…to`／`until`／`since`／`for`）；`ago` 不在此格** |
| **Murphy 中级** | **`ago` 在 11016 字符的归一化 TOC 里零命中**；`for`／`since` 只在 **U12 `12forandsincewhen…?andhowlong…?`**；`howlong` 另有两处（U11 `11howlonghaveyou(been)…?`／U12） | **中级无 `ago` 单元（复核成立）** |
| **BC 三档索引** | **A1-A2 18 课／B1-B2 36 课／C1 14 课，本轮逐条复点：无 `ago` 专课**（`ago` 仅作为 `past-simple` 与 `when-time-and-dates` 两个参考页的句子成分出现） | **BC 零专课（复核成立）** |
| **Cambridge `Ago` 页** | 独立页，1 条 Warning（"**We normally use ago with the past simple. We don't use it with the present perfect:**"）＋ 1 条时长对照（"**If we refer to how long something lasted, we use for (not ago):**"） | **✅ 规则页独立，但只有 2 条规则** |

> **⇒ `ago` 档位复核：B＋（与批二十七一致）。课程位「三词一格」，规则页「独立但仅 2 条」。**

### 3.2 `ago` 的典型搭配（主理人问：`three days ago`／`two weeks ago`／`a year ago`）

**逐字查证结果**：

| 源 | 逐字搭配 | 形态 |
|---|---|---|
| **Oxford `ago` 词条** | "**two weeks/months/years ago**"；"**The letter came a few days ago.**"；"**She was here just a minute ago.**"；"**a short/long time ago**"；"**How long ago did you buy it?**" | **复数 ＋ ago（`weeks/months/years`）；也收 `a few days`／`a minute`／`a long time`** |
| **Cambridge `Ago` 页** | "**They arrived in Athens six weeks ago.**"（❌`Not: They arrived in Athens ago six weeks.`）；"**I received his letter four days ago.**"（❌`Not: I have received his letter four days ago.`） | **复数 ＋ ago** |
| **Cambridge 词典 `ago`** | "**He left the house over an hour ago.**"；"**We made the booking three months ago.**"；"**Your mother called about an hour ago.**"；"**It was on my desk a minute ago.**" | **混合：`an hour`／`three months`／`a minute`** |
| **BC `when-time-and-dates`** | "**I saw Jim about three weeks ago.**"／"**We arrived a few minutes ago.**" | **复数 ＋ ago** |
| **BC `past-simple`** | "**I met my wife a long time ago.**" | **`a long time`** |

> **⇒ 结论：`ago` 的典型搭配是「数量词 ＋ 时间单位（多为复数或 `a + 单数`）＋ `ago`」。** **最小充分集是「复数时间单位」，但跨源同时大量收 `a + 单数`（`a year ago`／`an hour ago`／`a minute ago`）——这是好消息：可以用 `a` 开路，不强制先造复数。**

### 3.3 我方造词成本（主理人问：需要造几个词？）

**我方现状（§0.1 实测）**：`days` GL 1（**非教学位**）／`weeks` 0／`years` 0／`hours` 0；`minutes` 已有教学位（L73）。**词典侧不受限**：`src/data/bundledDictionary.ts`（**12000 条**）**逐个 headword 实测：`ago` ✅／`none` ✅／`nobody` ✅／`week` ✅／`year` ✅／`hour` ✅／`day` ✅／`month` ✅／`minute` ✅（`no one` 短语条 0）** ⇒ **造词只是「课程词表登记」，不是词典缺条**。

| 课的设计选择 | 必造词位 | 逐字依据 | 成本 |
|---|---|---|---|
| **A．只用 `a + 单数`**（`a year ago`／`an hour ago`／`a minute ago`） | **0–1**（`ago` 本身） | Cambridge 词典例 "**over an hour ago**"／"**about an hour ago**"／"**a minute ago**"；Oxford "**a short/long time ago**" | **最低**。**但 `a minute ago` 的 `minute` 我方 L73 已有（虽是 `ten minutes`）** ⇒ **`a minute` 形态基本免费** |
| **B．用复数**（`three days ago`／`two weeks ago`／`a few years ago`） | **1（`ago`）＋ 1–3（`days`／`weeks`／`years`）** | Oxford headword 搭配逐字 "**two weeks/months/years ago**"；Cambridge "**six weeks ago**"／"**four days ago**"；BC "**about three weeks ago**"／"**a few minutes ago**" | **中**。**每加一个复数单位就是 1 个新词位**（我方 L11 已教「两个以上加 s」的老规矩，**复数形态可复用，但词本身是新的**） |

> **⇒ 造词成本判定：`ago` 一课最少 1 个词位（`ago`），若走典型搭配（复数）则 2–3 个词位。** **建议走 A 案：用 `a year ago`／`an hour ago`／`a minute ago` 打底（0 个额外的复数词），把 `three days ago` 留作对照位——因为 `days` 我方 GL 实测是 1（L134 对白），做复数位只需登记**。

### 3.4 `ago` vs L73 `How long does it take?`：撞车还是不同轴？

**这是我的核心甄别，本轮给逐字对照**：

| 维度 | **L73**（已教） | **`ago`**（候选） |
|---|---|---|
| **逐字目标句** | **`How long does it take?` / `It takes ten minutes.`** | Cambridge 逐字 "**They arrived in Athens six weeks ago.**" |
| **逐字规则** | **L73 `oneLineRule`** "问「要花多久」用 How long does it take——答语 It takes ten minutes（take 表「花时间」）。" | Cambridge 逐字 "**Ago follows expressions of time**"＋"**We normally use ago with the past simple.**" |
| **主语是谁** | **`it`——那段路、那件事本身**（L73 深挖卡逐字 "这个「它」不是小美、不是公交车，是那段路、那件事本身。"） | **动作的发出者**（`They arrived`／`I received`／`She was here`） |
| **时间方向** | **往后看：还要多久（未来）** | **往回看：多久以前（过去）** |
| **动词形态** | **`takes`（现在式，三单）** | **过去简单式**（`arrived`／`received`／`was`） |
| **中文** | 「要花多久？」 | 「（多久）以前」 |
| **是否同一格** | **❌ 不同轴。** **L73 问的是「耗时预算」（还有多久才到/才完），`ago` 说的是「追溯起点」（那事发生在多久之前）。** **两者的 `how long` 是同一个 `How` 家族的两岗**——**L73 深挖卡已明说** "**How long 量时间：同一个 How，问的东西不同。**" | — |

> **⇒ 判定：不撞车，但相邻。** **L73 的 `How long does it take?` 是「未来耗时」，`How long ago…?` 是「过去距今」——Cambridge 词典逐字收了 "**How long ago did you buy it?**"，BC `past-simple` 收了 "**How long ago**" 的同族。**
> **⚠️ 但有一条真撞车风险（务必登记）**：**若 `ago` 一课引入 `How long ago…?` 这个问句，它就与 L73 共享 `How long` 前缀 ⇒ 用户会混。** **建议：`ago` 只做陈述句（`She came two days ago.`），`How long ago…?` 做认读位（混个脸熟），不做考点。** 这条与 L73 深挖卡「How long 量时间：同一个 How，问的东西不同」的既有口径**完全兼容**。

### 3.5 `ago` 能撑几课？

| 硬增量清点 | 跨源逐字 | 条数 |
|---|---|---|
| **① 位置**：`ago` 跟在时间量**后面**，不能提前 | Cambridge 逐字 "**Ago follows expressions of time**"（❌`Not: They arrived in Athens ago six weeks.`） | 1 |
| **② 时态**：只配**过去简单式**，**不配现在完成时** | Cambridge Warning 逐字 "**We normally use ago with the past simple. We don't use it with the present perfect:**"（❌`Not: I have received his letter four days ago.`） | 1 |
| **③ 与 `for` 的分工**：说「持续多久」用 `for`，不用 `ago` | Cambridge 逐字 "**If we refer to how long something lasted, we use for (not ago):**"（`When I was at school, I studied Russian for five years.`） | 1（**但这条同时是轴 C 的内容 ⇒ 与 `for` 课共享，不能两边都算全额**） |
| **④ 与 `before`／`earlier`／`previously` 的分工**（更早的过去点） | Cambridge 同页逐字 "**If we refer to a point in time before a specific time in the past, we use before or earlier or previously, often with the past perfect:**"（`We had got their invitation four days before.`） | **🔴 不可用：要求过去完成时（past perfect）——我方实测 `had done`／`had been` 在全 154 课零命中，属超纲** |

> **⇒ `ago` 的真新错 = 2 条（① ②）＋ 1 条共享（③）。** **距离 3 条硬增量差 1 条；且 §3.3 显示它至少要造 1 个词位、典型形态还要造 2–3 个复数词。**
> **⇒ 课量判定：`ago` 单开 1 课勉强（靠 ③ 补齐 3 条），但它与 `for` 共享 ③ ⇒ 两者必须一起排或都不排（见 §4.3）。**

---

## §4 轴 C 专项：`for` ＋ 一段时间

### 4.1 逐字目标句的核实（主理人给的 `I have been here for three days.`）

**⚠️ 先说一件必须诚实登记的事**：**我没有在任何跨源页面上取到 `I have been here for three days.` 这个逐字句。**
- 我向 Cambridge `Present perfect simple (I have worked)` 页**逐字问过这句**，返回是 "**No such sentence appears.**"（该页最接近的是 "**That house on the corner has been empty for three years.**"）；
- `Cambridge 词典 for` 词条的时长义（逐字 "**used to show an amount of time or distance**"，标 `a1`）**给的例是 "We walked for miles."**，不是这句；
- **BC `how-long` 页有近亲**："**We have been waiting for twenty minutes.**"（`Level: beginner`）。

**⇒ 句子本身完全合法且是标准教学句，但它不是跨源页面上的**逐字例句**——若 PRD 要用它，应作为「我方自造场景句」，不要挂在某一页的引文名下。**

### 4.2 `for` ＋ 一段时间：课程位与档位

| 源 | 逐字 | 判读 |
|---|---|---|
| **Murphy 初级 U19** | `19forsinceago` | **✅ 课程位（三词一格）** |
| **Murphy 初级 U104** | `104from…tountilsincefor` | **✅ 课程位（五词一格）——本轮新取到** |
| **Murphy 中级 U12** | `12forandsincewhen…?andhowlong…?` | **✅ 课程位（四词一格）** |
| **Cambridge `For` 页** | 独立页；**小节 `For: duration` 逐字** "**We use for with a period of time to refer to duration (how long something lasts)**"；**Warning 逐字** "**Don't confuse for and in when referring to time:**"（`We're going to Cape Town for two months.` vs `We're going to Cape Town in two months.`） | **✅ 有规则页（且 Warning 是「for vs in」——这是我方零覆盖的一对）** |
| **Cambridge `For or since?` 页** | **独立对比页**；逐字 "**We use for with a period of time in the past, present or future.**"／"**For refers to periods of time, e.g. 3 years, 4 hours, ages, a long time, months, years.**"／Warning "**We don't use since with periods of time:**" | **✅✅ 有独立对比页——这是本批全部候选里唯一的「对比页」** |
| **Cambridge `Present perfect simple` 页** | 逐字 "**We use the present perfect simple with for and since to talk about a present situation that began at a specific point in the past and is still going on in the present.**"（`has been empty for three years.` / ❌`since three years`） | **✅ 有专段** |
| **BC `how-long`** | `Level: beginner`；逐字 "**We use for to say how long**"／"**We can also use a noun phrase without for**"／"**We use since with the present perfect or the past perfect to say when something started**"；例 `We have been waiting for twenty minutes.`／`They lived in Manchester for fifteen years.`／`I've worked here twenty years.` | **✅ BC 参考页专节（Level: beginner——与零基础匹配度是本批最高的一页）** |
| **BC `present-perfect-simple-continuous`（B1／B2）** | 逐字 "**We often use for, since and how long with the present perfect simple to talk about ongoing states.**" | **✅ 有专段（但 B1/B2）** |
| **中文侧** | `english.cool/for/` **实测 200**，独立专文，**含小节逐字 `3. For 持續一段時間`**，例句逐字 `He was in the hospital for three months.`／`Can you stay for a while?`；`english.cool/time-prepositions/` **实测 200**，**含小节逐字 `for 為期…`**，逐字说明 "**for 後面會加上一段時間，和 since 一樣常和完成式一起使用。**" | **✅ 中文侧两页，其中一页是「时间介词总表」** |

> **⇒ 档位 A−。** **理由：三处 Murphy 课程位 ＋ Cambridge 一处独立页＋一处独立对比页 ＋ BC 一处 beginner 级专节 ＋ 中文侧两页专文。本批最厚。**

### 4.3 三个配对问题（主理人指定）

**问题一：`for` 与 `ago` 是否该配对（同一条「时间长度」的轴）？**

**答：该配对，但它们是「对台」不是「同轴」。** 逐字依据——
- Cambridge `Ago` 页：**"If we refer to how long something lasted, we use for (not ago):"** ⇒ **两词在「时长」这个话题上是互相排他的选择**；
- Cambridge `For or since?` 页：**"We use for with a period of time in the past, present or future."** ⇒ **`for` 不绑时态**；Cambridge `Ago` 页 Warning 却**明文绑过去简单式**（"We normally use ago with the past simple"）⇒ **两者的时态约束不同**；
- **BC `how-long` 页把 `for` 与 `since` 放在同一课**（逐字 "**We use for to say how long**"／"**We use since with the present perfect…**"），**没有和 `ago` 放一起** ⇒ **上游的配对是 `for`＋`since`，`ago` 另在 `when (time and dates)`／`past simple` 里**。

> **⇒ 判定：不是我该把 `for` 与 `ago` 硬绑成一条轴。上游的配对是 `for` + `since`（BC 同页、Murphy U19／U104／中级 U12 三处同格）；`ago` 与 `for` 的关系是「一条排除规则」（"use for, not ago"）。**
> **⚠️ 对课量的直接后果**：**若同一批排 `for` 课与 `ago` 课，第 ③ 条增量（"说时长用 for 不用 ago"）两边都会讲 ⇒ 撞车。建议把这条只放在 `for` 课里（正向讲 `for`），`ago` 课只用「不配现在完成时」这一条。**

**问题二：是否与 `since` 一起（批二十七判 `since` C＋，建议 `ago` 与 `since` 配对）？**

**答：`for` 与 `since` 配一对（✅ 强烈建议）；`ago` 与 `since` 配一对（❌ 建议放弃）。** 逐字依据——
- **支持 `for`＋`since`**：BC `how-long` 两词同页逐字；Murphy **U19／U104／中级 U12 三处全部同格**；Cambridge 有**独立对比页** `For or since?`；中文侧 `time-prepositions` 逐字 "**for 後面會加上一段時間，和 since 一樣常和完成式一起使用。**"；
- **反对 `ago`＋`since`**：**Cambridge `Since` 页 typical errors 逐字** "**We don't use since with extended periods of time. We use for**"（**它把 `since` 的对手指定为 `for`，不是 `ago`**）；`ago` 与 `since` 唯一的直接绑定是另一条 "**We use since, not ago, after 'it's a long time'**"——**而这条要求 `It's a long time since…` 句式，属另一课内容**（且它要求现在完成 + 从句，即 `since` 的承重墙）。

**问题三：Murphy 初级 U19 标题是 `for since ago` 三词一格——这三个词是一条轴吗？**

**答：❌ 不是。它们是「同一条『时间』标题下的两轴 + 一条排除规则」。** 逐字分层——
- **`for` 与 `since` 是同一对（时长 vs 起点）**：Cambridge 独立对比页逐字 "**For refers to periods of time**" vs "**Since refers to a previous point in time.**" ⇒ **一条轴的两端（一段时间 vs 一个时间点）**；
- **`ago` 是第三样**：Cambridge `Ago` 页把它定义成**副词**（"**The adverb ago refers to a period of time that is completed and goes from a point in the past up to now.**"），**且它的位置规则（"Ago follows expressions of time"）与 `for`／`since` 完全不同**——`for`／`since` 站**时间短语前面**，`ago` 站**时间短语后面**；
- **U19 之所以三词一格，是因为它教的是「三者都不配现在完成时」这一条共有禁忌**（U19 前接 U18 `How long have you…? (present perfect 4)`，后接 U20 `I have done and I did`）⇒ **格子是按「禁忌」聚合的，不是按「轴」聚合的**。

> **⇒ 结论：U19 的三词一格不能当作「三词一条轴」的证据。** **这条对课量的后果很大：不能因为 U19 把它们排在一起，就在我方也把三词塞进一课——那会把「时长（for）」「起点（since）」「距今（ago）」三条不同的东西压成一课。** **我方应排：`for`＋`since` 一课（对台），`ago` 单独一课（若排）。**

---

## §5 「同义换词 vs 新结构」甄别（核心红线）

**判据**：**新结构** ＝ 逻辑层/语法层多出一个我方零覆盖的机制；**同义换词** ＝ 同一个意思的另一种说法（只换词、换个体）；**半新（换形/换位）** ＝ 结构在同一格，但接的成分或位置变了。

| 候选 | 判定 | 跨源逐字证据 | 课量后果 |
|---|---|---|---|
| **`none`** | 🟢 **新结构（新轴）** | Cambridge 逐字 "**None is the pronoun form of no. None means 'not one' or 'not any'.**"；**两源分页**（`none` 在 `Quantifiers` 页，`nothing` 在 `Pronouns` 页）；**Murphy 中级 U86 两行**（`no/none/any` vs `nothing/nobody etc.`） | **1 课可开** |
| **`no one`／`nobody`** | 🟡 **半新（同一意思的两种说法）** | Cambridge 逐字 "**No one and nobody mean the same.**"；**语域分工** "**Nobody is a little less formal than no one.**"／"**We use no one more than nobody in writing**"；Oxford 逐字 "**Nobody is more common than no one in spoken English.**" | **0 课；作对照位。** **⚠️ 这条是本批最干净的一处「同义换词」自我承认（"mean the same"）** |
| **`ago`** | 🟡 **半新（换位置 ＋ 时态禁用）** | Cambridge 逐字 "**Ago follows expressions of time**"（**位置**）＋ "**We normally use ago with the past simple. We don't use it with the present perfect:**"（**禁用**） | **1 课（弱）——必须与 `for` 同批错开** |
| **`for` ＋ 一段时间** | 🟢 **新结构（我方零覆盖的机制：介词 + 时间量做状语）** | Cambridge 逐字 "**We use for with a period of time to refer to duration (how long something lasts)**"；**中文侧逐字** "**for 後面會加上一段時間**"；**我方实测 `for` 156 次全在「给谁／为了」义**（§0.2） | **1 课（强）** |
| **`since`** | 🟡 **半新（复合结构：主句现在完成 ＋ 从句过去式）** | Cambridge 逐字 "**we can use the past simple or present perfect after since and the present perfect in the main clause**" | **0–1 课（与 `for` 同课作对台，不单开）** |
| **`days`／`weeks`／`years`／`hours`（复数时间单位）** | **❌ 不是候选——是「造词」** | Oxford 逐字 headword 搭配 "**two weeks/months/years ago**" | **不排课；它是我方 L11「两个以上加 s」老规矩的新语料** |

**📌 红线结论**：
- **纯同义换词 / 自我承认同义（0–对照位）**：**`no one`／`nobody`**（Cambridge 逐字 "**mean the same**"）——**这是本批唯一一处跨源自己承认「同义」的候选，必须封顶**。
- **半新（换位/换形）⇒ 与主角同课，不得单开**：**`ago`**（与 `for` 同批但错开考点的第 ③ 条）、**`since`**（与 `for` 同课作对台）。
- **真新结构（可单开）**：**`none`**（新轴）、**`for` ＋ 一段时间**（零覆盖机制）。

> **⚠️ 一条必须写进 Non-goals 的红线提醒**：**`ago` 与 `for` 的第 ③ 条增量是同一条**（"use for, not ago"）。**若同批两课都讲，就是同一规矩的第二次应用——同批内部撞车，比跨批撞车更伤。** **建议：第 ③ 条只计入 `for` 课；`ago` 课的 3 条新错改由「位置」「不配完成时」＋「`ago` 只跟时间量（不能跟 `since` 从句）」凑。**

---

## §6 三轴档位对比表 ＋ 推荐

### 6.1 全候选档位总表

| 轴 | 候选 | 课程位 | 规则页 | CEFR | 必造词位 | 档位 | 建议课量 |
|---|---|---|---|---|---|---|---|
| **A** | **`none`** | ✅ 4 处全共用（初级 U77／U81／中级 U86／U88） | ✅✅ 独立页＋5 条 `None of` 规则＋1 Typical error＋3 Warning＋中文侧独立小节 | Cambridge **B1**／Oxford **A2**（分裂） | **1**（`none`） | **B＋** | **1 课** |
| **A** | `no one` | ⚠️ 无独立格（初级 U78／中级 U86 第二行） | ✅ 独立页（与 `nothing`／`nowhere` 共页） | Cambridge **A2**／Oxford **A1** | 1 | **B** | **对照位（0 课）** |
| **A** | `nobody` | ⚠️ 同上 | ✅ 同上 | Cambridge **A2**／Oxford **A1** | 1 | **B** | **对照位（0 课）** |
| **B** | **`ago`** | ⚠️ 半有：初级 U19 三词一格；中级零 | ✅ 独立页（2 条规则） | Cambridge **A2**／Oxford **A1** | **1**（A 案）／**2–3**（B 案复数） | **B＋** | **1 课（弱）** |
| `days`／`weeks`／`years`／`hours`（复数形态） | — | — | — | **1–3** | **不单独成档（造词项）** | **不排课** |
| **C** | **`for` ＋ 一段时间** | ✅ 3 处全共用（初级 U19／U104＋中级 U12） | ✅✅ 独立页＋**独立对比页 `For or since?`**＋2 Warning＋BC beginner 专节＋中文侧两页 | Oxford 时长义 **A1** | **0–1**（若只讲 `for` 新义） | **A−** | **1 课** |
| **C** | `since`（配对） | ✅ 同上三处共用 | ✅ 独立页 7 节＋4 typical errors＋中文专文 | Cambridge **A2/B1/B2**／Oxford **A2** | 1 | **C＋** | **0 课（作 `for` 课的对台位）** |

> **§6.1 表注（档位口径自检）**：按定义 A 档要求「跨源有**独立**课程位」，`none`（4 处全共用）与 `for`（3 处全共用）本应同为 B＋。**本人给 `for` A− 的理由只有一条：它独占上游的「对比页」形态**——Cambridge `For or since?` 与 BC `how-long`（`Level: beginner`）**都是围绕 `for` 与 `since` 的对立独立成页的**，`none` 没有对应的独立对比页。**若主理人按「课程位共用一律不升档」的严口径，请把 `for` 一并读作 B＋——这不改变本批的 1 课建议，只改变标签。**

### 6.2 推荐

> ## **推荐：轴 C 与轴 A 同权重（各 1 课），轴 B 押后。**
> **本批建议 2 课：① `none`（＋ `no one`/`nobody` 对照位）；② `for` ＋ 一段时间（＋ `since` 对台位）。**
> **`ago` 押后或与 `for` 课**合排为同一课的第 2 段**（不单独占课）；**复数时间单位（`days`/`weeks`/`years`/`hours`）不单独立项**。

**排序与理由**：

| 序 | 轴与课 | 课量 | 理由（三条以内） |
|---|---|---|---|
| **1** | **轴 A：`none` 1 课** | **1** | **① 「都」家族否定侧的唯一正主**（肯定侧 `both`/`all`/`every` 已教完，§0.5 的钩子已许下）；**② 课程位 4 处全批最多、规则页最厚**；**③ 造词成本 1 位、CEFR A2（Oxford 侧）对零基础友好** |
| **2** | **轴 C：`for` ＋ 一段时间 1 课** | **1** | **① 跨源证据本批最厚（唯一的独立对比页 `For or since?` ＋ Murphy 三处课程位 ＋ BC `Level: beginner` 专节）**；**② 我方机制性零覆盖**（`for` 156 次命中全在「给谁／为了」义，§0.2 逐字实测）；**③ 它是 L109 `I waited until…` 的天然续课——「等」这个词我方已经教进句子了**（L109 目标句 `I waited until the rain stopped.`），**`for` 课可复用同一个 `wait`** |
| **3** | **轴 B：`ago`** | **0–1** | **① 只有 2 条独立硬增量（位置＋不配完成时），第 3 条与 `for` 课撞车**；**② 典型搭配要造 2–3 个复数词**；**③ 但它是「过去简单式」家族唯一还没排的成员（L10 `yesterday` / L11「好几个」/ L24 判据 都已教），排它会补齐一条现成的线** ⇒ **建议：若本批只排 2 课，`ago` 押后；若排 3 课，`ago` 作 `for` 课的第 2 段（不单开）** |

### 6.3 「为什么不能更多」——四条硬上限

| # | 上限 | 逐字依据 |
|---|---|---|
| **1** | **`no one`／`nobody` 封顶为 0 课** | **Cambridge 逐字自认同义**："**No one and nobody mean the same.**" ⇒ **§5 红线：同义表达课量必须封顶** |
| **2** | **`none` 封顶 1 课** | **它的第 1 条（不能再加 not）与 L84 已教规矩同源**；**第 3 条（代词性质）是词性说明不是禁用** ⇒ **硬增量实际是「2 强 ＋ 1 弱」，只能撑 1 课** |
| **3** | **`ago` 不能与 `for` 各占一课（同批）** | **Cambridge `Ago` 页逐字把「时长」指定给 `for`**："**If we refer to how long something lasted, we use for (not ago):**" ⇒ **同一条规矩不能在批内讲两次** |
| **4** | **`since` 不单开** | **它的承重墙是复合结构**（Cambridge 逐字 "**the present perfect in the main clause**"）⇒ **零基础单开一课会同时压上「现在完成」＋「从句」两堵墙**；**放 `for` 课作对台位（`for two months` vs `since 2004`）成本最低、收益最大** |

---

## §7 Non-goals 依据（本批明确不做，含依据）

| # | 不做的事 | 依据（逐字） |
|---|---|---|
| 1 | **`no one`／`nobody` 单开一课** | **Cambridge 逐字** "**No one and nobody mean the same.**"；**两词在 Murphy 两册均无独立单元**（初级 U78 六词一格／中级 U86 第二行）；**真新错仅 1 条**（§2.3） |
| 2 | **`none` 与 `no one`／`nobody` 合并一课** | **Cambridge Warning 逐字** "**We don't use none where we mean no one or nobody.**" ⇒ **两词是「不能互换」的关系，合并会把「用哪个」和「都不用」混成一锅** |
| 3 | **拼写类考点（`noone`）** | **Cambridge 逐字** "**We write no one as two separate words or with a hyphen: no one or no-one but not noone.**"——**零基础 6–10 分钟课不设拼写考点**（沿用批二十七同款裁决） |
| 4 | **`hardly`／`seldom` 作反例词** | 我方实测 **`hardly` GL 0／HC 0**，**`seldom` 未测（登记于 §8）** ⇒ **Cambridge 的反例句 ❌`She talks to hardly no one.` 里的关键词用户没见过，零基础课上无法作为错例** |
| 5 | **`ago` 与 `before`／`earlier`／`previously` 的分工** | **Cambridge 逐字** "**If we refer to a point in time before a specific time in the past, we use before or earlier or previously, often with the past perfect:**" ⇒ **要求过去完成时；我方实测 `had done`／`had been` 在全 154 课零命中 ⇒ 超纲** |
| 6 | **`How long ago…?` 作考点** | **与 L73 `How long does it take?` 共享 `How long` 前缀**（L73 深挖卡逐字 "**How long 量时间：同一个 How，问的东西不同。**"）⇒ **只作认读位，否则与 L73 撞车** |
| 7 | **`days`／`weeks`／`years`／`hours` 单独立项** | **它们是造词项不是教学项**：**Oxford 逐字 headword 搭配 "two weeks/months/years ago"**；**我方 L11 已教「两个以上加 s」的规矩** ⇒ **只需登记词位，不需排课** |
| 8 | **`since` 单开一课** | **Cambridge 逐字** "**the present perfect in the main clause**"（复合结构）＋ CEFR **B2/A2/B1 三义**（零基础偏难）⇒ **作 `for` 课对台位** |
| 9 | **用 `It's a long time since…` 句式** | **Cambridge `Since` typical errors 逐字** "**We use since, not ago, after 'it's a long time'**" ⇒ **该句式要求现在完成＋`since` 从句，是 `since` 的承重墙内容，本批不碰** |

---

## §8 未核实项（诚实登记）

| # | 项 | 状态 | 影响 |
|---|---|---|---|
| **①** | **Cambridge `none of` 规则的读法** | **⚠️ 本轮修正批二十七的一处读法**：批二十七称「`none of` 后面必须跟 `the/my/this`」（禁令）。**本轮逐字取到原文是** "**We use none with of before the, demonstratives (this, that), possessives (my, your) or pronouns:**"——**这是「可以跟这些」的许可清单，不是「必须」的禁令**。**但它同时给了 `Typical error`"We don't use none directly before nouns"（这才是真禁令）** ⇒ **课上的口径应该是「`none` 不能直接接名词」，不是「`none of` 必须带限定词」**。**是否要按「必须」教，请主理人裁决** | **影响 §2.2 增量 ① 的措辞** |
| **②** | **Cambridge 词典 `none` 的 B1 标位是否覆盖代词义全部** | **部分核实**：页面显示 "**B1** for the pronoun entry"（单条），**但我没有逐条核到是否有分义标位** | 低（Oxford A2 已足够） |
| **③** | **`seldom` 我方计数** | **未测**（本轮只测了 `hardly`） | 低（不影响 Non-goals 5 的成立：`hardly` 已 0） |
| **④** | **BC 三档课数的两种口径** | **WebFetch 通道**：A1-A2 **18** 课（逐条列出）／B1-B2 **36** 课／C1 **14** 课；**本机 Wayback 缓存 HTML 通道**：A1-A2 free-resources **14** ＋ legacy **4** ＝ **18**；B1-B2 free-resources **33** ＋ legacy **3** ＝ **36**；C1 **14**。**本轮两通道首次完全一致 ✅**（批二十七登记的不一致已消解） | 低（**「无 `ago`／`for`／`since`／`none`／`nobody` 专课」的结论两通道一致**） |
| **⑤** | **`Murphy` 的「课程位」是否等于「独立单元」** | **未核实**：我手上的是**目录页（TOC）PDF 的归一化文本**（`/private/tmp/murphy_ess_norm.txt` 13966 字符／`murphy_int_norm.txt` 11016 字符／`murphy_full_norm.txt` 11071 字符），**不是正文页**。**因此我只能证明「标题里逐字含什么词」，不能证明「该单元内部有哪几个小节」** | **中**：**这是「三词一格」判定的唯一依据，也是本批对 `for` 判 A− 而非 A 的关键理由（见 §1.2 档位理由）** |
| **⑥** | **`I have been here for three days.` 的跨源出处** | **🔴 未取到**（§4.1 已详述）。**该句合法，但没有任何跨源页面用于逐字例** | **中**：**PRD 若用它，须自认为自造场景句** |
| **⑦** | **Cambridge `For` 页与 `For or since?` 页的 `See also` 互链** | **部分核实**：`For` 页**只给出链接、无对比正文**（我逐字问过："It only links out to a separate page"）；**反向（`For or since?` 页是否有 See also 回链）未核** | 低 |
| **⑧** | **中文侧广度** | **本轮只实测了 `english.cool`**（855 条 slug 全索引 ＋ 10 个直连 URL 状态）；**沪江/百度百科未取到有效语法页**（`baike.baidu.com/item/ago` **403**／`baike.baidu.com/item/for/10777` **403**／`hjenglish.com` 首页 200 但**搜索页无 `ago` 专文**）；**`letmeenglish.com` 本轮未测**（批二十七登记为 526 WAF 拦截） | **中**：**「中文侧 `ago` 为零」这条结论只覆盖 `english.cool` ＋ 沪江搜索未果，不覆盖全网** |
| **⑨** | **`english.cool` 全索引的新鲜度** | `/tmp/ec_slugs.txt`（**855 条**）为**前批缓存**；**本轮新增直连实测**：`ago`／`none`／`nobody`／`no-one`／`for-since`／`ago-before`／`before-ago`／`days`／`weeks`／`years`／`hours`／`nothing`／`no-none`／`how-long`／`for-a-while` **全 404**；**200 的有**：`for`／`since`／`time`／`time-prepositions`／`quantifiers`／`during` | 低（**结论独立成立：`ago`／`none`／`nobody` 三个 URL 本轮单独实测 404**） |
| **⑩** | **`/private/tmp/` 缓存文件是否会被清理** | **⚠️ 本批全部 Murphy 读数依赖 `/private/tmp/murphy_*_norm.txt` 与 `/private/tmp/murphy_*_norm.pdf`（各 5 页，TOC-only）** | **中**：**若清理，本批的 Murphy 引文将不可复跑** ⇒ **建议把这三份 norm 文本迁入仓库**（前批未做） |
| **⑪** | **Oxford 的 CEFR 取法** | **⚠️ 本轮实测：Oxford 页面未见显式 `cefr="…"` 属性**；我取到的是 `level=a1`／`level=a2` 链接与 `Timea1`／`preposition a2` 文本标位。**批二十七登记的「`cefr=` 属性」口径本轮未能复现** | **低**：**级别值本身清楚（`ago` a1／`none` a2／`nobody` a1／`no one` a1／`since` a2／`for` a1），只是取法不同** |
| **⑫** | **`For or since?` 页是否与 `For` 页互链** | **部分核实**：`For` 页**只有 See also 链接、无对比正文**（逐字问过："It only links out to a separate page"）；**反向回链未核** | 低 |
| **⑬** | **`none of` 单复数动词的教学可用性** | **已取到逐字**（"In formal styles, we use none of with a singular verb when it is the subject."／"However, in informal speaking, people often use plural verbs:"／`None of the products have been tested on animals… (informal)`）——**但两源并存（单复数皆可）⇒ 对零基础是否应当作考点，本轮未判** | **中**：**若 PRD 要立「`none of` 配单数」的考点，请先裁决这一条**（我方现行口径是「一个一个用 is／一群用 are」，与此并不冲突，但边界模糊） |

---

## 附：本轮实测 / 引用清单

### A. 我方文件（逐字实读）

| 文件 | 规模 | 本轮读数 |
|---|---|---|
| `/Users/liujun/Documents/英语听写/src/data/grammarLessons.ts` | **29196 行**（批二十七记 28808，已增长） | **154 课（编号 1–154 无缺口）**；`contrast` 每课 6 条；**L153／L154 均为 (3 新错, 3 双正解)**；`none`／`nobody`／`no one`／`ago`／`since` **全 0**；`days` **1**（L134 对白）／`weeks`／`years`／`hours` **0**；`for` **156**（全在非时长义） |
| `/Users/liujun/Documents/英语听写/src/data/huntCases.ts` | **8885 行** | **163 案**；`ago`／`none`／`nobody`／`no one` **全 0**；`since` **0**；`for` **29**（含 3 处时长短语，全非教学点） |
| `/Users/liujun/Documents/英语听写/src/data/grammarSeasons.ts` | **77 行** | **27 季**；`season-27` 逐字 `label: "第二十七季 · 还没、已经、还"`，`min: 153, max: 154` |
| `/Users/liujun/Documents/英语听写/src/data/bundledDictionary.ts` | **3 行（12000 条）** | 逐 headword 实测：**`ago` ✅／`none` ✅／`nobody` ✅／`week` ✅／`year` ✅／`hour` ✅／`day` ✅／`minute` ✅／`month` ✅／`for` ✅／`since` ✅**；**`no one` 短语条 0**；**`days`／`weeks`／`years`／`hours` 复数形 0（词典只收单数）** |
| `/Users/liujun/Documents/英语听写/src/data/grammarZeroTerms.ts` | 31 行 | 零术语红线词表 27 词（含 `介词`／`副词`——**本批候选全部要绕开这两个词**） |

### B. Murphy TOC（本机原件归一化，沿用同一份文件）

| 文件 | 字符数 | 本轮逐字读数（含偏移） |
|---|---|---|
| `/private/tmp/murphy_ess_norm.txt` | **13966** | `19forsinceago`（@925，上下文 `…18Howlonghaveyou…?(presentperfect4)19forsinceago20Ihavedone…`）／**`104from…tountilsincefor`（@12529，本轮新取）**／`77not+anynonone`（@11437）／`78not+anybody/anyone/anythingnobody/no one/nothing`（@11452）／`81allmostsomeanyno/none`（@11549）／`95stillyetalready`（@11925）／`48Howlongdoesittake…?`（@10293） |
| `/private/tmp/murphy_int_norm.txt` | **11016** | `12forandsincewhen…?andhowlong…?`（@455）／`11howlonghaveyou(been)…?`（@433）／`86no/none/anynothing/nobodyetc.`（@8697）／`88all/allofmost/mostofno/noneofetc.`（@8762）；**`ago` 命中 0（逐字复算）** |
| `/private/tmp/murphy_full_norm.txt` | **11071** | 同中级 |

### C. 跨源网页（本轮实取）

| # | 源 | 状态 | 关键逐字 |
|---|---|---|---|
| C-1 | `dictionary.cambridge.org/grammar/british-grammar/ago` | ✅（本轮两度实取） | "The adverb ago refers to a period of time that is completed…"／"**Ago follows expressions of time**"／"**We normally use ago with the past simple. We don't use it with the present perfect:**"／❌`They arrived in Athens ago six weeks.`／❌`I have received his letter four days ago.`／"**If we refer to how long something lasted, we use for (not ago):**"／"If we refer to a point in time before a specific time in the past, we use before or earlier or previously, often with the past perfect:" |
| C-2 | `…/no-none-and-none-of` | ✅（本轮两度实取、分节问） | 面包屑 `Grammar > Nouns, pronouns and determiners > Quantifiers > No, none and none of`／"No, none and none of indicate negation."／"**None is the pronoun form of no. None means 'not one' or 'not any'.**"／**`None of` 5 条规则**（含 "**We use none with of before the, demonstratives (this, that), possessives (my, your) or pronouns:**"／"**We don't use none of when there is already a negative word (not, n't) in the clause:**"／"**When we are referring to two things or people, we use neither of rather than none of:**"／"In formal styles, we use none of with a singular verb…"／"However, in informal speaking, people often use plural verbs:")／Typical error "**We don't use none directly before nouns. We use no + noun or none of + noun**"／Warning "**We don't use none where we mean no one or nobody.**"／"When none is the subject, the verb is either singular or plural…"（`None ever comes.`／`None ever come.`） |
| C-3 | `…/no-one-nobody-nothing-nowhere` | ✅ | "**No one, nobody, nothing and nowhere are indefinite pronouns.**"／"We use them with a singular verb"／"**No one and nobody mean the same. Nobody is a little less formal than no one. We use no one more than nobody in writing**"／"**We write no one as two separate words or with a hyphen: no one or no-one but not noone.**"／"**We don't use nobody, no one, nothing, nowhere after no, not, never or other words which have a negative meaning (hardly, seldom).**"／❌`I can't do nothing.`／❌`She talks to hardly no one.`／"Nobody, no one, nothing, nowhere are stronger and more definite than not … anybody…" |
| C-4 | `…/for` | ✅（两度实取） | 面包屑 `Grammar > Prepositions and particles > For`；小节 `For: purpose`／`For someone`／**`For: duration`**／`For: exchange`／`For meaning because`／`For in multi-word verbs`；逐字 "**We use for with a period of time to refer to duration (how long something lasts)**"／Warning "**Don't confuse for and in when referring to time:**"／"The page does not contain a usage note comparing 'for' with 'since'" |
| C-5 | `…/for-or-since` | ✅ | 页题 "**For or since?**"（面包屑 `Grammar > Easily confused words > For or since?`）／"**We use for with a period of time in the past, present or future.**"／"**We use since with a point in time in the past.**"／"**For refers to periods of time, e.g. 3 years, 4 hours, ages, a long time, months, years.**"／"**Since refers to a previous point in time.**"／Warning "**We don't use since with periods of time:**"（❌`She's been on the phone since hours.`） |
| C-6 | `…/since` | ✅ | 面包屑 `Grammar > Words, sentences and clauses > Conjunctions and linking words > Since`；7 节；"**we can use the past simple or present perfect after since and the present perfect in the main clause**"／typical errors 四条含 "**We don't use since with extended periods of time. We use for**"／"**We use since, not ago, after 'it's a long time'**"（❌`It's a long time ago your last letter.`） |
| C-7 | `…/present-perfect-simple-i-have-worked` | ✅ | "**We use the present perfect simple with for and since to talk about a present situation that began at a specific point in the past and is still going on in the present.**"／"**That house on the corner has been empty for three years.**"（❌`Not: … since three years.`）／"**That house on the corner has been empty since 2006.**"（❌`Not: … for 2006.`）／**逐字问 `I have been here for three days.` ⇒ "No such sentence appears."** |
| C-8 | `dictionary.cambridge.org/dictionary/english/*` | ✅ | **`ago` A2／`none` B1／`nobody` A2／`no one` A2／`since` 副词 B2・介词 A2・连词 B1×2／`for` 介词分义（**TIME/DISTANCE 义 = A1**，其余 A2·B1·B2·C1·C2）** |
| C-9 | `oxfordlearnersdictionaries.com/definition/english/*` | ✅ | **`ago` A1**（定义 "used in expressions of time with the simple past tense to show how far in the past something happened"，搭配 "**two weeks/months/years ago**"）／**`none` A2**（"not one of a group of people or things; not any"；`None of these pens works/work.`）／**`nobody` A1**（"**Nobody is more common than no one in spoken English.**"）／**`no one` A1**（"**No one is much more common than nobody in written English.**"）／**`since` A2**（页面标 `preposition a2`）／**`for` A1**（时长义 "used to show a length of time"，例 `I'm going away for a few days.`）** ⚠️ Oxford 的级别本轮是以 `level=a1` 链接与 `a2` 文本标位取到的，**页面未见显式 `cefr="…"` 属性**（见 §8）** |
| C-10 | BC `free-resources/grammar/a1-a2` | ✅ | 逐字 18 课全目；**无 `ago`／`for`／`since`／`none`／`nobody` 专课** |
| C-11 | BC `free-resources/grammar/b1-b2` | ✅ | 逐字 **36** 课全目（含 `Present perfect: 'just', 'yet', 'still' and 'already'`——批二十七已用）；**无 `ago`／`for`／`since`／`none`／`nobody`** |
| C-12 | BC `free-resources/grammar/c1` | ✅ | 逐字 **14** 课；**无相关专课** |
| C-13 | BC `grammar/english-grammar-reference/how-long` | ✅ **本批新发现（重要）** | `Level: beginner`；"**We use for to say how long**"／"**We can also use a noun phrase without for**"／"**We use since with the present perfect or the past perfect to say when something started**"／"We use from … to/until to say what starts and finishes"；例 "**We have been waiting for twenty minutes.**"／"**They lived in Manchester for fifteen years.**"／"**I've worked here twenty years.**"／"**I have worked here since December.**"；**`ago` 在本页零命中** |
| C-14 | BC `grammar/english-grammar-reference/when-time-and-dates` | ✅ | `Level: elementary`；"**We use ago with the past simple to say how long before the time of speaking something happened**"；例 "**I saw Jim about three weeks ago.**"／"**We arrived a few minutes ago.**"／"**I'll see you in a month.**"／"**Our train's leaving in five minutes.**"；**`since` 本页零命中** |
| C-15 | BC `grammar/english-grammar-reference/past-simple` | ✅ | `Level: beginner`；"**we often use expressions with ago with the past simple:**"（例 "**I met my wife a long time ago.**"）／"**I lived abroad for ten years.**"／"**We went to Spain for our holidays.**" |
| C-16 | BC `free-resources/grammar/b1-b2/present-perfect` | ✅ | `B1 Intermediate`／`B2 Upper intermediate`；"**We also use the present perfect to talk about unfinished states, especially with for, since and how long.**"／"**I haven't known him for very long.**"／"**She's wanted to be a police officer since she was a child.**"／"**How long have you had that phone?**" |
| C-17 | BC `free-resources/grammar/b1-b2/present-perfect-simple-continuous` | ✅ | `B1`／`B2`；"**We often use for, since and how long with the present perfect simple to talk about ongoing states.**"／"**We often use for, since and how long with the present perfect continuous to talk about ongoing single or repeated actions.**"／"**They've been playing tennis for an hour.**" |
| C-18 | BC `grammar/english-grammar-reference/adverbials-time` | ✅ | `Level: beginner`；子课逐字 `When (time and dates)`／`How long`／`'still' and 'no longer', 'already' and 'yet'`／`How often`——**`for` 未出现；`ago` 一处 "one year ago"** |
| C-19 | BC `grammar/english-grammar-reference/quantifiers` | ⚠️ **与批二十七的读数不一致** | 本轮返回：页题 "Quantifiers"，`Level: beginner`；**"The page does not contain rule sentences about 'nobody,' 'no one,' or 'nothing,' and it does not state that 'none' is used for more than two."**；只提到 "no" 与 "none" 出现在参考表，一行 "**None of the supermarkets were open.**"。**⚠️ 批二十七登记同页有逐字 "**None is used for more than two**"——本轮复取未命中。** **⇒ 我不采信该句（见 §8 与下方的「与批二十七台账的差异」）** |
| C-20 | `dictionary.cambridge.org/grammar/british-grammar/no-one-nobody-nothing-nowhere`（第二次分节问） | ✅ | 语法页的例为 `Nobody ever goes to see her. She's very lonely.`／`No one remembers the titles of the books they've read.`／`I knew nobody at the party.`／`She told no one, not even her mother.`；**「Is there nobody here who can answer my question?」等例属词典页 `dictionary/english/nobody`，不是语法页**——**本轮已更正引用来源** |

### D. 中文侧（本轮实取，全部含 HTTP 状态）

| # | URL | 状态 | 关键逐字 |
|---|---|---|---|
| Z-1 | `english.cool/for/` | **200** | 页题「介系词 for 用法是？ 來看例句搞懂！」；**小节逐字 `3. For 持續一段時間`**；例句 "She studied for a while, then went to bed."／"**He was in the hospital for three months.**"／"Can you stay for a while?"／"He departs for New York tomorrow morning." |
| Z-2 | `english.cool/since/` | **200** | 页题「since 正確用法是？ since 的6個用法！」；"**since 後面的主要子句會用「現在完成式」來表示**"／"since 後面接「過去某個時間點」"／"since 後面接「完整的句子」"；六节含 `since 自從`／`since 既然、因為`；**无 `for`／`ago` 对比** |
| Z-3 | `english.cool/time-prepositions/` | **200** | 页题「【時間介系詞】In, On, 還是 At?…」；**小节逐字 `for 為期…`**；逐字 "**for 後面會加上一段時間，和 since 一樣常和完成式一起使用。**"／"**since 通常會和完成式一起用，後面加上一個明確的時間點。**"；例句 "**We were in Australia for two weeks.**"／"I have lived in Tainan since 2000."；**`ago` 在本页零命中** |
| Z-4 | `english.cool/quantifiers/` | **200** | 页题「來一次搞懂「數量詞」(Some, Any, Much 等)」；**独立小节 `none`**："none 為 not one 的合併，表示「一個都不…」"／"none 後面若需要接名詞，就要使用 none of"／"**none 會強調在某個範圍內都不…，no 則沒有限定範圍～**"／"none of + 可數名詞 + 單數/複數動詞"；例句 "I have many books, but none of them is/are useful." |
| Z-5 | `english.cool/during/` | **200** | 页题「during 正確用法是？…」；"During 的意思是『在…期間』"／"為介系詞，因此後面需要接名詞或名詞子句" |
| Z-6 | `english.cool/{ago,none,nobody,no-one,for-since,ago-before,before-ago,days,weeks,years,hours,nothing,no-none,how-long,for-a-while}/` | **全 404**（15 个 URL 实测） | **轴 A／轴 B 的 `ago`／`none`／`nobody` 中文侧为零的直接依据** |
| Z-7 | `/tmp/ec_slugs.txt`（**855 条 slug 全索引**，前批缓存） | ✅ | **无 `ago`／`none`／`nobody`／`no-one`／`for-since`／`days`／`weeks`／`years`／`hours`**；**有** `for`（307）／`since`（671）／`during`（239）／`time-prepositions`／`quantifiers`／`still-yet-already`（700）／`adverbs-of-time-place-frequency` |
| Z-8 | `baike.baidu.com/item/ago`／`baike.baidu.com/item/for/10777` | **403**（两度） | **百度百科本轮不可达** ⇒ **中文侧「专文」结论只覆盖 `english.cool`** |
| Z-9 | `hjenglish.com`（首页 200）＋ 搜索页 | **200 但无相关专文** | 搜索页返回的是门户首页内容，**无 `ago` 用法专文** |
| Z-10 | `letmeenglish.com` | **本轮未测**（批二十七登记 526 WAF 拦截） | — |

### E. 与批二十七台账的差异（研究自我抽检，回应批二十七 §6 携带项 1）

| # | 批二十七记录 | 本轮复核 | 处置 |
|---|---|---|---|
| **1** | `none of` 后面「必须」跟限定词 | **原文是「use none with of before the/…」——许可清单，不是禁令** | **§2.2 增量 ① 已改写**：真禁令来自 Typical error "**We don't use none directly before nouns**" |
| **2** | BC `quantifiers` 页有逐字 "**None is used for more than two**" 与 "**Note: with all and both, we don't need to use of**" | **本轮两度复取该页：未命中这两句**；页面返回的是 "no rule sentences about 'nobody,' 'no one,' or 'nothing'" | **本轮不采信（§8 未核实）**；**本批 §1.1／§2.2 的 `none` 判定不依赖该句**（3 条增量全部由 Cambridge `no-none-and-none-of` 单源支撑） |
| **3** | BC 三档课数两通道不一致（18 vs 14 等） | **本轮两通道一致（18／36／14）** | **不一致已消解**（§8④） |
| **4** | L151／L152 的「否定侧下一批再看」钩子 | **L151 `:28490` 确有**（逐字含 "（all 管肯定侧，否定侧下一批再看）"）；**L152 `:28684` 无**（逐字只有 "（every 管肯定侧）"） | **批二十七主理人判断正确**；**本批据此认为「轴 A 的钩子可兑现」** |

---

## 结论一句话

> **轴 A 复核为 `none` 1 课（B＋，3 条新错全部由 Cambridge 单源支撑、穷尽可验）＋ `no one`/`nobody` 降为对照位（0 课——Cambridge 逐字自认 "mean the same"，是「同义换词」红线）；轴 B 的 `ago` 复核为 B＋但只有 2 条独立硬增量（位置 ＋ 不配现在完成时）且第 3 条与轴 C 撞车，典型搭配须造 1–3 个词位（`a year ago` 路线可压到 1 位）——它与 L73 `How long does it take?` 不撞车（一个往后看、一个往回看，L73 深挖卡已自认「同一个 How，问的东西不同」）；轴 C 的 `for` ＋ 一段时间是本批真正的富矿，档位 A−（Murphy 初级 U19／U104 ＋ 中级 U12 三处课程位 ＋ Cambridge 唯一的独立对比页 `For or since?` ＋ BC `Level: beginner` 专节 ＋ 中文侧两页专文），而 Murphy U19 标题的 `for since ago` 三词一格**不是一条轴**（格子按「都不配现在完成时」这条共有禁忌聚合），我方应排 `for`＋`since` 一课（对台）、`ago` 押后或作同课后段；本批建议 2 课，上限 3 课，`no one`/`nobody` 与复数时间单位（`days`/`weeks`/`years`/`hours`——造词项、非教学项）均为 0 课。**
