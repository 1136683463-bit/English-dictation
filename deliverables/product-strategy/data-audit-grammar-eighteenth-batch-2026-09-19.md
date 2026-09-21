# 数据盘点：第十八批·大章节候选（6–8 课）

**日期**：2026-09-19 ｜ **类型**：实读代码/文件盘点（无数仓）｜ **成员**：数析
**方法**：状态机提取引号内字符串（跳 `//` 与 `/* */`、按顶层 `  {` 块归属「行号→课号/案号」）。GL 命中 **21,363 条串**（英文串 13,298／讲解串 8,065，口径 `^[A-Za-z0-9'’,.!?;: -]+$`）；HC 命中 **5,258 条串**（英文 4,193／讲解 1,065）。**抽词器逐字复刻双份实跑**：`grammarAmbushService.ts:160-212`（`GRAMMAR_WORDS` 145 词＋`CLOZE_STOP_WORDS` 30 词＋三级回退）与 `grammarBoostService.ts:238-257 / 260-384`（`FUNCTION_WORDS` 33 词＋`keywordIndexes` 长度≥3 硬门＋`buildCloze`），对 12 个候选句各跑 **40 随机种子＋24 现实 sourceRef 种子**；另**建临时真 vitest 探针实跑 `buildRevisitQuiz` / `buildBoostItems`**（跑完即删，见附录）。封面指派用**二分答案＋穷举（min-gap / max-sum 双目标）**。所有 raw 计数用 `grep -c` 交叉验证。
**口径声明（重要）**：报告**一律以工作区现状为准**。审计期间 `grammarLessons.ts` 被并行改写一次（md5 `a936067…` → `83a505c…`，行数不变 22238），已**冻结快照 `83a505c00c1dfb533679b3eedd658bc3` 并全部复跑**；下文所有数字均出自该快照，与当下工作区逐字一致（§附录「未核实」记录时间线）。
**范围**：候选池＝甲 `be/get used to`（B1 开局章·主候选）／乙 `look + 形容词` 升格／丙 形容词＋介词折卡。

---

## 指标概览

| 指标 | 本期（实读） | 上期（批十七审计） | 状态 |
|---|---|---|---|
| 课程 / 案件 / 错点 | **118 课 / 127 案 / 482 错点** | 110/119/450 | ✅ 全线上行 |
| 罪名（错点/承载案） | verb_form **109/72**·plural **88/82**·sv_agreement **67/54**·preposition **58/53**·word_order **42/30**·tense **39/31**·article **28/22**·missing_be **23/19**·run_on **14/12**·fragment **14/13** | 103/66·80/75·61/49·56/51·40/28·36/28·24/18·22/18·14/12·14/13 | ✅ 枚举 10 不动，`comparison` HC 仍 **0** |
| 封面池 | **117 张用 118 次（单次 116·二用 1·三用 0）**；**L50–L117 共 68 张为新生成资产** | 49 张/110 次（单次 0·二用 37·三用 12） | 🔴 **池口径整体换挡——批十七「二用升三用」方案未执行**（§5） |
| 案号 | max **#127**，1–127 **连续无跳号**；`reviewed` **127/127** | max #119 | ✅ 下号 **#128** |
| 课号 | 1–118 **连续无跳号无重号**（`lessonService.ts:157` 用 `number - 1`） | 1–110 | ✅ |
| 基建 | season-17 `{111,118}` 已在位（**17 季**）；m19 `afterLesson:118` 已在位（**19 里程碑**）；episode 止「一百一十八」 | season-16/m18 | ✅ 须续 season-18/m20 |
| **`be used to`／`get used to`／`got used to`** | GL **0 / 0 / 0**、HC **0 / 0 / 0**（四种形态合计 **0**） | 0/0/0 | ✅ **真空白确认** |
| **`used to`（从前常）** | GL **120 处 / 113 串**（L93 47·L94 8·L100 48·L101 7·L102 10）；HC **3**（#102·#109×2） | 同 | ⚠️ 已教两轮，话术对撞面 **6 行**（§2.4） |
| **`look + 形容词`** | **14 处**（非 12），**14/14 在 `dialogue`、14/14 说话人 = `npc`、0 处作 target／0 处进讲解练习** | 研究称 12 处 | ✅ 结论方向对，**数字须上修 +2**（§3.2） |
| 测试 | **58 文件 / 732 项全绿**；`tsc --noEmit` **0 错**（审计中途曾 1 文件红，见附录） | 58/721 | ✅ 基线已上移 |
| G-boost | **50 项全绿**；thin(＜2 改错题)＝**0 课**；contrast 带 mark **416**；纯标点 mark **0** | 42 项；thin=0；contrast 660 | ✅ 三护栏全守 |

## 洞察

1. **本批最该纠正的既有认知是封面池——它不是「快枯竭」，而是「刚换过一次血」。** 工作区现状是 **117 张图、118 次使用（单次 116／二用 1／三用 0）**，且 `lesson-50..117.jpg` 全部是 **09-19 11:02–11:14 新生成的资产**（`.workbuddy/memory/2026-09-19.md` 记载「L50–L113 共 64 张新生成」＋「追加 L114–L117」）。批十七 PRD 写定的 `L111←cover29／L112←cover42／…／L118←cover1` 八张「二用升三用」方案**并未落地**；实际落地的是 **L111–L117 一一对应 cover111–117、L118 回落 cover1**（非恒等映射仅此一处，`:22046`）。**结论：批十八可自由使用 cover2–cover89（88 张满足 ≥35 线），最优指派是 cover2–cover7 贴 L119–L124，最小间距 117（§5）。**
2. **`be/get used to` 的「真空白」结论完全成立，四种形态全库 0/0（§2.2）。** `be used to` GL 0／HC 0、`get used to` 0／0、`got used to` 0／0、`be used to doing` 0／0；连 `using to` 的错形都 0。而 `used to`（从前常）已有 **120 处**存量（L93 47·L100 48 为两大本营）——**新章不是补空白，是在一座已封顶的房子旁边盖第二座**，两座房子共用一根梁：`to`。
3. **批十七登记的「L93 明文『to 后面永远穿原样』记 `:17294`」行号需更正——该句在 `:17362`。** 实读 `:17294` 的原文是 `oneLineRule: "说「从前常这样、现在不这样了」用 used to——后面跟原样：I used to play here。"`（**说的是「跟原样」，没有「永远」也没有「to 后面」**）；含「to 后面永远穿原样」三字连读的原句在 **`grammarLessons.ts:17362`**（L93 `deepDive` 段）：`"后面跟原形：used to play（不穿 -ing、不穿 -ed）——跟 want to travel、Let me help 一个规矩：to 后面永远穿原样。"`。全库同义表述共 **6 行**：`:2719`／`:2760`／`:2803`（L15 want to）、`:8065`（L44 to buy）、`:8443`（L46 to travel）、`:17362`（L93）。**推断：话术对撞面比批十七估的更宽（6 行而非 1 行），但强烈版本只有 :17362 一行，割接成本可控。**
4. **L93/L100 的对比卡与练习是第二处、也是更硬的对撞面——它们把 `used to + -ing` 直接判为错。** 实读 `:17314` `contrast.wrong = "I used to playing here."`＋`:17317` 判词「used to 后面跟原形：play——不穿 -ing 外套」；`:17423` guided `options: ["live in Beijing", "living in Beijing", "lived in Beijing"]` 正确答案 `live in Beijing`，**`living in Beijing` 是明设的干扰项**；L100 同构（`:18641`／`:18708` `options: ["used to play", "use to play", "used to playing"]`）。**批十八若教 `be used to doing`，这三处必须在同一批内做「同一个 to、两张脸」的对位改写，否则用户在 L93 学会的东西会在 L119 被反向惩罚。**
5. **`-ing` 的「大底座」与「窄接口」并存，这是甲最被低估的成本。** 「名字版」话术底座极厚（L42/L43/L45/L46/L64/L67/L69/L75/L77/L78 共 **146 处**「名字版」，且 `reading` 单形 **584 处**）；但「习惯」章真正要用的几个动名词几乎为零：**`getting` 2（L16·L109）、`working` 0、`walking` 0、`driving` 0、`using` 0、`cleaning` 0、`shopping` 0**。**推断：`be used to doing` 的 -ing 位置只能吃 `reading／drawing／getting up／sleeping／cooking` 这几个存量厚的词，否则要同步造词——这会直接顶到「词汇控制在核心 500 词」的红线。**
6. **乙（`look + 形容词` 升格）是三项里唯一「零冲突」的候选，且底座比研究说的还厚 2 处。** 实读 **14 处** `look + 形容词`（§3.2 逐条），**全部落在 `dialogue` 字段、全部说话人 `who: "npc"`、无一处出现在 `targetSentence`／`examples`／`practice`／`contrast`**；更关键的是 **`look` 从未出现在任何一课的 `grammarLabel` 里**（14 个宿主课的标签分别是 正在做／连词／条件句／幕后句／too…to／enough／How often／much／next to／something／It's／when／mine／have got）。**推断：升格不会与任何既有教学点抢位，且 14 句天然构成「复现池」——但它们同构度极高（12/14 是「主语＋look(s)＋形容词」），场景偏窄。**
7. **cloze 侧两条通道全部可落，唯一死角仍是 `As`，且本批候选句把短词问题放大了。** ambush 通道 12 句**全部走第 ① 条（语法承载词）命中**，落点分别是 `am`／`is`／`was`／`play`／`looks`／`look`（§3.1）；boost 通道按 `keywordIndexes`（`:253` 要求 `clean.length >= 3`）把 `am/is/was/to/my/up` 全部排除，**`As`（2 字母）在 boost 档 1 永远不会成为空位**——`GRAMMAR_WORDS` 里 ≤2 字母的共 **6 个**（`am`·`is`·`be`·`do`·`go`·`as`），全部只能作 ambush 空位。**`used to` 的 `to` 同样永不落 boost 空位**（2 字母且不在表内），意味着 `be used to` 的考点词在 boost cloze 里只能落在 `used`／`getting`／`looks` 上——**落点是够的（每句 2–4 个可落词位，实跑验证）**。
8. **G-boost 三护栏全守且比批十七更强：thin＝0、逐字相等违规＝0、纯标点 mark＝0。** `grammarBoostService.test.ts` 实跑 **50 项全绿**（批十七为 42 项）。实读三条断言的现状：① `:161-182`「全库每课 ≥2 道可换改错题」——thin 数组为空；② `:185-196`「`guided.spot` 的 `wrongToken` 与 `tokens` 逐字相等」——违规数组为空；③ `:199-208`「`wrongMark` 不得为纯标点」——违规数组为空。**本批新课只要照抄「1 道 guided.spot ＋ contrast 带 mark ≥1 条」的模板即可自动过线**（当前全库每课 guided spot 恒为 1，contrast 带 mark 最少 1 张，有 11 课压在这条 2 道线上，见 §6）。
9. **基建侧 season-17／m19 已随批十七落地，批十八须续 season-18／m20，且 season 测试会先红。** `grammarSeasons.ts:52` 末项 `{id:"season-17", … min:111, max:118}`（共 17 季）；`GrammarPathPage.tsx:247-249` 末项 `can-do-m19 / afterLesson:118`（共 19 个里程碑）。`grammarSeasons.test.ts` **4 项守门**（区间覆盖／互不重叠／label·hint 非空／最高课号被覆盖）——**忘加 season-18 立刻红，不会静默**。**`can-do-m*` 全仓测试引用数 = 0（纯纪律项，无守门）。** episode 写法：`一百一十八`（`:22044`）→ **下一个写「一百一十九」**。

---

## 1. 语料盘点（逐短语读上下文）

口径：**GL** ＝ `src/data/grammarLessons.ts`（21,363 条引号串）；**HC** ＝ `src/data/huntCases.ts`（5,258 条）。「处」＝短语出现次数，「串」＝承载该短语的字符串条数。**讲解串里的英文片段同样会被命中**，故表内同时给「处」与「串」。

### 1.1 `used to`（从前常）—— 存量分布（逐课）

| 课 | 行范围 | `used to` 处/串 | `use to` 处/串 | 说明 |
|---|---|---|---|---|
| L93 | 17279–17467 | **47 / 44** | **10 / 8** | 第一大本营。target `I used to play here.`（`:17289`） |
| L94 | 17468–17656 | 8 / 8 | 1 / 1 | 章收口复现（非新教） |
| L100 | 18606–18795 | **48 / 44** | 6 / 6 | 第二大本营。target `I used to play here every day.`（`:18616`） |
| L101 | 18796–18986 | 7 / 7 | 0 / 0 | 偶发复现 |
| L102 | 18987–19176 | 10 / 10 | 2 / 2 | 章收口回流 |
| **GL 合计** | — | **120 / 113** | **19 / 17** | — |
| HC #102 | 6159–6200 | 1 / 1 | **1** | 老操场：`I use to play here.`（tokenIndex 1，`use→used`） |
| HC #109 | 6467–6508 | 2 / 2 | **2** | 老习惯：同上 ＋ `She used to playing here.`（tokenIndex 8，`playing→play`） |

> **`use to` 的 17 串（GL）实读判别（11＋4＋2 = 17）**：
> ① **11 串是合法的 `didn't use to` / `Did you use to`**：`:17350`／`:17351`／`:17356`／`:17363`（含「I didn't use to play／Did you use to play」两处）／`:17372`／`:17440`／`:18661`／`:18677`／`:18678`／`:18767`／`:19049`；
> ② **4 串是错形 `I use to play`（教材故意）**：`:17308`（L93 contrast.wrong）、`:17509`（L94 contrast.wrong）、`:18635`（L100 contrast.wrong）、`:19029`（L102 contrast.wrong）；
> ③ **2 串是 guided 的干扰选项碎片**：`:17381`（`use to`）、`:18708`（`use to play`）。
> **结论：`use to` 无一处是无意错字。**

### 1.2 `be / get used to` —— 四种形态逐条核实（预期全 0）

| 模式 | GL 处 | GL 串 | HC 处 | HC 串 | 判定 |
|---|---|---|---|---|---|
| `be used to`（`am/is/are/was/were/be/been/being + used to`） | **0** | 0 | **0** | 0 | ✅ 真空白 |
| `get used to`（`get/gets/getting + used to`） | **0** | 0 | **0** | 0 | ✅ 真空白 |
| `got used to` | **0** | 0 | **0** | 0 | ✅ 真空白 |
| `BE/GET used to`（上三式合计超集） | **0** | 0 | **0** | 0 | ✅ **零底座** |
| `be used to doing` | **0** | 0 | **0** | 0 | ✅ |
| `used to + Ving`（错形，**教材故意**） | 3 处 | 3 串 | 0 | 0 | ⚠️ 见下 |

`used to + Ving` 的 3 处实读：`:17314`（L93 contrast.wrong `I used to playing here.`）、`:18641`（L100 contrast.wrong `I used to playing here every day.`）、`:18708`（L100 guided options `used to playing`）。**三处都是「反例」，不是语料。**

### 1.3 三处判定为「假空白」与否的交叉验证

| 排查 | 结果 |
|---|---|
| `using to` | **0** ——不存在「用 to」误写 |
| `got to`（使役 `get sb to do`，L108 教学点） | 实体存在，但形态是 `got him to go`（`:20150`／`:20195`），**与 `got used to` 不重叠** |
| `be used to` 的 `used` 分词用法（被动 `was used`） | **0 处**——全库连被动的 `use` 都没出现过，无「被用」义干扰 |
| `get used to` 的 `get` 义干扰（`get up` 等） | `get up` 25 处（L16 7·L107 6·L115 5·L105 4·L18 2·L103 1），是另一条线，**与 `get used to` 不冲突** |

### 1.4 L93 逐字引用与行号（批十七记 `:17294`，复核结论：**行号须更正**）

**`:17294`（L93 `oneLineRule`，逐字）：**
```
oneLineRule: "说「从前常这样、现在不这样了」用 used to——后面跟原样：I used to play here。",
```
**批十七记为「L93 `:17294` 明文『to 后面永远穿原样』」——实读不符：该行只有「后面跟原样」，无「永远」、无「to 后面」。**

**真正的强表述在 `:17362`（L93 `deepDive.paragraphs`，逐字）：**
```
"后面跟原形：used to play（不穿 -ing、不穿 -ed）——跟 want to travel、Let me help 一个规矩：to 后面永远穿原样。",
```

**全库「to 后面永远穿原样」/「to 后面的动词永远穿原样」同义行共 6 行（实读）：**

| 行号 | 课 | 强度 | 原文（节选） |
|---|---|---|---|
| `:2719` | L15 | 强 | `"变形的事已经由 wants 做完了（三单加 -s），to 后面的动词永远穿原样。"` |
| `:2760` | L15 | 强 | `"to 后面的动词永远穿原样：want to go、wants to go、wanted to go——变的只有 want 自己，to 后面从不动。"` |
| `:2803` | L15 | 强 | `"to 后面的动词永远穿原样。"` |
| `:8065` | L44 | 强 | `"垫板 to 后面永远穿原样：to buy——买东西说 buy，不说 buying。"` |
| `:8443` | L46 | 强 | `"垫板 to 后面永远穿原样：to travel——不写 traveling。"` |
| **`:17362`** | **L93** | **强** | **`"…跟 want to travel、Let me help 一个规矩：to 后面永远穿原样。"`** |

### 1.5 L100 有无类似表述 —— **有，用的是「原样」措辞（4 行）**

| 行号 | 字段 | 原文（节选） |
|---|---|---|
| `:18644` | `contrast.whyZh` | `"used to 后面跟原样：play——它不认 -ing 外套（跟 want to travel 一个规矩）。"` |
| `:18710` | `guided.explain` | `"used to + 原样：d 不丢、外套不穿。"` |
| `:18717` | `guided.explain` | `"used to + 原样——说从前的常常。"` |
| `:18752` | `guided.explain` | `"used to 后面跟原样：read——「从前的常常」换个习惯照样说。"` |

> **L100 无「永远」字样，措辞强度低于 L93 `:17362`**——**推断：若要做对位改写，`:17362` 是必须动的唯一一行；L100 的 4 行可保留（它们讲的是 `used to` 这颗「从前常」的 to，不是 `be used to` 那颗「习惯」的 to）。**

### 1.6 L93 / L100 结构容量（供判断新旧冲突面）

| 课 | 行范围 | targetSentence | oneLineRule | contrast 条数 | variants | practice | guided | blocks | dialogue | 带 `wrongMark` 的 contrast |
|---|---|---|---|---|---|---|---|---|---|---|
| L93 | 17279–17467 | `I used to play here.`（`:17289`） | `:17294` | **6** | **3** | 11 | 6（含 1 道 spot） | 2 | 3 | **2** |
| L100 | 18606–18795 | `I used to play here every day.`（`:18616`） | `:18621` | **6** | **3** | 11 | 6（含 1 道 spot） | 2 | 3 | **2** |

**冲突面清单（实读，逐条）**：
- `:17314` `wrong: "I used to playing here."` ＋ `:17317` 判词「不穿 -ing 外套」
- `:17423` `options: ["live in Beijing", "living in Beijing", "lived in Beijing"]`，answer `live in Beijing`——**`living in Beijing` 是明设干扰项**
- `:17425` `explain: "used to 后面跟原形：live——不穿 -ing、不穿 -ed。"`
- `:18641` `wrong: "I used to playing here every day."` ＋ `:18644` 判词
- `:18708` `options: ["used to play", "use to play", "used to playing"]`，answer `used to play`
- `:18752` `explain: "used to 后面跟原形：read…"`

> **实读结论：对撞面共 6 组（8 行）**，其中 3 处（`:17314`／`:17423`／`:18708`）把 `-ing` 写成「错误答案」，是最硬的割接点。

### 1.7 复现接口：`-ing`「名字版」底座（§4 详表）

| 短语门 | GL 处 | 分布（课号:次数，≥3） |
|---|---|---|
| `like + Ving` | 60 | L42 **36**·L46 11·L5 4·L67 3·L77 3 |
| `enjoy + Ving` | 75 | L45 **40**·L46 20·L64 7·L77 3·L78 3 |
| `finish + Ving` | 44 | L64 **31**·L77 6·L69 3 |
| `good at + Ving` | 35 | L67 **33**·L77 2 |
| `mind + Ving` | 32 | L69 **32** |
| `keep + Ving` | 63 | L77 **40**·L78 23 |
| `prep(at/in/of/for/about/with/on/by) + Ving` | 56（去 8 处 `to Beijing` 假命中后 **48**） | L67 **37**·L75 9（`about going`）·L77 2 |

**「名字版」话术口号密度（实读串数）**：L42 10·L43 12·L45 19·L46 14·L64 21·**L67 18**·L69 14·L75 4·**L77 24**·L78 10 ＝ **146 处**。L67 的 oneLineRule（`:12363`）写的是「good at **+ 名字版**：good at drawing——**at 是它的门牌，门里穿名字版**」——**这句是批十八最直接的「垫脚石」：介词门里穿名字版与新章的 `to + doing` 同构。**

---

## 2. 罪名承载预判（10 枚举零扩展）

`GrammarErrorTag`（`types.ts:419-430`）为 **11 元联合**（含 `comparison`）；`huntService.ts:331-342` 的 `GRAMMAR_ERROR_TAGS` 为 **10 元**（不含 `comparison`），`huntService.test.ts:109` 断言 `tagStats` 长度 **= 10**。**HC 里 `tag: "comparison"` 实读 = 0 处**——`comparison` 仍是「只进类型、不进题库」的死枚举。

| 罪名 | 错点次数 | 承载案数 | 批十七 | 批十八可承载候选 |
|---|---|---|---|---|
| `verb_form` | **109** | **72** | 103/66 | ★ `used to + Ving`（#102/#109 已是 verb_form 主力）、`be use to`、`He is used to work` |
| `plural` | **88** | **82** | 80/75 | 复现位（`two dogs` / `hours` 已成 #109/#102 的第 4 点） |
| `sv_agreement` | **67** | **54** | 61/49 | ★ `She are used to` / `He get used to` |
| `preposition` | **58** | **53** | 56/51 | ★ `be used for` / `used to` 的 to 缺失；丙候选的 `good in` 型 |
| `word_order` | **42** | **30** | 40/28 | 复现位 |
| `tense` | **39** | **31** | 36/28 | ★ `I am used to get up`（用了现在版去顶 -ing 位） |
| `article` | **28** | **22** | 24/18 | 复现位 |
| `missing_be` | **23** | **19** | 22/18 | ★ `I used to getting up early` 里 be 丢失 |
| `run_on` | **14** | **12** | 14/12 | 复现位 |
| `fragment` | **14** | **13** | 14/13 | 复现位 |
| **合计** | **482** | — | 450 | — |

**实读：每案错点数分布** = 2 错 ×10 案／3 错 ×10 案／**4 错 ×104 案**／5 错 ×2（#42·#43）／6 错 ×1（#34）。**批十七的 8 案（#120–127）全为 4 错**，其罪名配比：`plural` 8·`verb_form` 6·`sv_agreement` 6·`article` 4·`tense` 3·`word_order` 2·`preposition` 2·`missing_be` 1。**推断：批十八若沿用「新 2＋旧 2」的四点模板，`verb_form`（`used to + Ving`）与 `sv_agreement`／`missing_be`（`She is used to`）是天然新点，`preposition` 可作为第三支点。**

**课-案引用配比（实读）**：118 课中 **113 课有引用**、5 课空（**L2·L3·L5·L6·L8**，第一季基础课，属 huntCases.ts 头注释「决策⑤」的既定番外定位）；引用总数 **123**（1 案 ×104 课、2 案 ×8 课、3 案 ×1 课）。**`hunt-my-sister` 被 2 课引用**（L14 与 L25，`:2674`／`:4699`），是全库唯一复用案。

---

## 3. cloze 落点预演

### 3.1 ambush 通道（`grammarAmbushService.ts:160-212` 逐字复刻）

`GRAMMAR_WORDS` 实读 **145 词**（`:160-187`），`CLOZE_STOP_WORDS` **30 词**（`:190-194`），三级回退见 `:195-212`。

| 候选句 | 命中档 | 空位下标 | clozeText | clozeAnswer | 语法承载词？ |
|---|---|---|---|---|---|
| `I am used to getting up early.` | ① | 1 | `I ___ used to getting up early.` | **`am`** | ✅ |
| `She is used to the cold weather.` | ① | 1 | `She ___ used to the cold weather.` | **`is`** | ✅ |
| `I am getting used to my new school.` | ① | 1 | `I ___ getting used to my new school.` | **`am`** | ✅ |
| `He was used to working at night.` | ① | 1 | `He ___ used to working at night.` | **`was`** | ✅ |
| `I used to play here.`（旧句对照） | ① | 3 | `I used to ___ here.` | **`play`** | ✅ |
| `That film looks interesting.` | ① | 2 | `That film ___ interesting.` | **`looks`** | ✅ |
| `You look tired.` | ① | 1 | `You ___ tired.` | **`look`** | ✅ |
| `I used to play here every day.` | ① | 3 | `I used to ___ here every day.` | **`play`** | ✅ |
| `She used to live in Beijing.` | **②** | 1 | `She ___ to live in Beijing.` | `used` | ❌（`live` 不在表内，退实词） |
| `It looks like rain.` | ① | 1 | `It ___ like rain.` | `looks` | ✅ |
| `We are used to walking to school.`（备） | ① | 1 | `We ___ used to walking to school.` | `are` | ✅ |
| `My dad is used to driving at night.`（备） | ① | 2 | `My dad ___ used to driving at night.` | `is` | ✅ |

**实读结论：12/12 可落；10/12 走第 ① 档（语法承载词），2 处走第 ② 档退实词。** 值得注意：**`to`／`my`／`up` 因在停用词表或长度为 2 从不被抽**，所以「`to` 后面接什么」这个真正的考点**在 ambush 通道不会被抽空**——落点永远落在 `am/is/was/used/play/looks` 上。**推断：这其实是好事（考 be 动词的形态选择比考虚词 to 更有区分度），但若产品想让空位落在 `used` 上以考「带 d 不带 d」，需依赖 `She used to live in Beijing.` 这类不含表内词的长句（走第 ② 档）。**

**真服务交叉验证（临时 vitest 探针，跑完即删）**：
```
AMBUSH lesson-93-used-to        ["I used to play here. => [play] I used to ___ here.",
                                  "Did you use to play here? => [Did] ___ you use to play here?"]
AMBUSH lesson-100-used-to-story ["I used to play here every day. => [play] I used to ___ here every day.",
                                  "Did you use to play here? => [Did] ___ you use to play here?"]
AMBUSH lesson-113-bored-boring  ["I am bored. => [am] I ___ bored.", "Are you bored? => [Are] ___ you bored?"]
AMBUSH lesson-115-have-got      ["I have got a new bike. => [have] I ___ got a new bike.",
                                  "Have you got a new bike? => [Have] ___ you got a new bike?"]
```
——**我的复刻脚本与真服务输出逐字一致**（同上表推导），复刻可信。

### 3.2 boost 档 1 通道（`grammarBoostService.ts:238-257 / 260-384` 逐字复刻）

`FUNCTION_WORDS` 实读 **33 词**（`:243-246`）；`keywordIndexes`（`:248-257`）硬门为 **`clean.length >= 3` 且非功能词**。

| 候选句 | boost 可落词位（下标,词） | 现实 sourceRef 种子（24 组）实得答案 | `to`/`am`/`is` 能否成空位 |
|---|---|---|---|
| `I am used to getting up early.` | (2,used)(4,getting)(6,early.) | `early`×10 `used`×9 `getting`×8 | ❌（`am`,`to` 均被排除） |
| `She is used to the cold weather.` | (2,used)(5,cold)(6,weather.) | `weather`×10 `used`×9 `cold`×8 | ❌ |
| `I am getting used to my new school.` | (2,getting)(3,used)(6,new)(7,school.) | `school`×8 `used`×7 `getting`×6 `new`×6 | ❌（`my` 是功能词） |
| `He was used to working at night.` | (1,was)(2,used)(4,working)(6,night.) | `night`×8 `used`×7 `was`×6 `working`×6 | ❌ |
| `I used to play here.` | (1,used)(3,play)(4,here.) | `here`×10 `used`×9 `play`×8 | ❌（`to` 排除） |
| `That film looks interesting.` | (1,film)(2,looks)(3,interesting.) | `interesting`×10 `film`×9 `looks`×8 | — |
| `You look tired.` | (1,look)(2,tired.) | `tired`×14 `look`×13 | — |
| `I used to play here every day.` | (1,used)(3,play)(4,here)(5,every)(6,day.) | `day` `every` `here` `play` `used` | ❌ |

**真服务交叉验证（同一探针）**：
```
BOOST lesson-93-used-to   ["I didn't use to play here. => [play] I didn't use to ___ here."]
BOOST lesson-115-have-got ["I have not got a new bike. => [bike] I have not got a new ___."]
BOOST lesson-113-bored-boring ["I am not bored. => [not] I am ___ bored."]
```
——**落点稳定且答案词是真考点；无一处落到 `to` 上。**

### 3.3 短词死角（含 `As` 已知问题）—— **本批候选句一并标注**

`GRAMMAR_WORDS` 中 **≤2 字母的 6 个词**：`am`·`is`·`be`·`do`·`go`·`as`。它们在两条通道的行为**不对称**：

| 词 | ambush（正则无长度门） | boost（`length>=3` 硬门） |
|---|---|---|
| `am` / `is` / `be` / `do` / `go` / `as` | ✅ 可成为空位 | ❌ **永不成为空位** |

**实读验证**：`'As'.length === 2` → `keywordIndexes` 过滤掉 → `As` 在 boost 档 1 永不成为空位；而 `As` 确实在 `GRAMMAR_WORDS` 表内（`:181` 行 `"as", "than", "about", "mind", "would", "please", "let's",`），故 ambush 可抽。**批十八若写含 `as` 的句子（如「as early as」习惯表达），须按同一口径标注：ambush 可抽 / boost 永不抽。** 候选句里 `I get up as early as six.` 实测 boost 可落词位 = `get`(1)／`early`(4)／`six.`(6)，**`as` 两处均不在列**。

**另一条同源限制**：`to`（2 字母）与 `up`／`my` 永远出不了 boost 空位 —— 即**`be used to` 的句法枢纽 `to` 在整个 boost 层不做空位**。**推断：这对教学是中性偏好（避免用户去猜虚词），但意味着「`to` 后面接 -ing」这一核心新知识在 boost 通道只以 `getting`／`working`／`used` 的形态被考到，需要在 ambush 与课程对比卡里补足。**

---

## 4. 基建护栏

| 项 | 实读现状 | 行号 | 批十八动作 |
|---|---|---|---|
| season 分组 | 共 **17 季**；末项 `{id:"season-17", label:"第十七季 · 我一直想说的那些", min:111, max:118}` | `grammarSeasons.ts:52` | **追加 `season-18`**（区间须 ≥119 起，且 `min > 118` 否则 `grammarSeasons.test.ts:22` 的「互不重叠」红） |
| season 守门测试 | **4 项**：区间覆盖／互不重叠／label·hint 非空／最高课号被覆盖 | `grammarSeasons.test.ts:12/22/36/43` | 忘加即红，不会静默 |
| 里程碑 | 共 **19 个**；末项 `can-do-m19 / afterLesson: 118` | `GrammarPathPage.tsx:247-249` | **追加 `can-do-m20`（afterLesson 125 或 124）** |
| 里程碑守门 | 全仓 `can-do-m*` 测试引用数 = **0** | — | ⚠️ **纯纪律项，无守门**（批十八漏加不会红，需人工核） |
| 关 1 解锁 | `const prev = grammarLessons.find((item) => item.number === lesson.number - 1);` | `lessonService.ts:157` | 课号必须 1–124 连续，**缺号永久锁死** |
| 课号连续性 | **1–118 连续、无跳号、无重号**（118 个 `number:`，去重后仍 118） | — | ✅ |
| episode 写法 | 末项 `小美的一天 一百一十八` | `:22044` | **下一个写「一百一十九」**（既有两种格式先例：「一百零七」…「一百一十八」） |
| 封面字段 | `cover?: string`（可选） | `types.ts:590` | 缺省回退 scene SVG——**池耗尽不阻断上线** |

---

## 5. 封面池专章（含最优指派与最优性说明）

### 5.1 容量账（实读 `^    cover: coverN,`，**118 次命中**）

| 项 | 实读 |
|---|---|
| 使用次数总计 | **118** |
| 去重张数 | **117** |
| **单次池** | **116 张：`2–117`（全list）** |
| **二用池** | **1 张：`cover1`（L1 `:144` ＋ L118 `:22046`）** |
| **三用池** | **0 张** |
| 资产文件 | `src/assets/lessons/` 共 **117 张 jpg**（`lesson-1..117.jpg`），**md5 去重后仍 117 张（无一图重用）** |
| **无资产课** | **L118 无专属图**——`lesson-118.jpg` 不存在，回落 `cover1` |
| 版本状态 | git 仅跟踪 `lesson-1..49.jpg`（49 张）；**`lesson-50..117.jpg`（68 张）为 untracked 新资产** |
| 逐课映射 | **非恒等映射仅 1 处：L118→cover1**；`L1..L117 → cover1..117` 全部恒等 |

### 5.2 与批十七规划的差异（**关键发现，须先纠正前提**）

批十七 PRD（`prd-grammar-a2-closeout-2026-09-19.md` §21/§98-101）与路线图写定的方案是：**`L111←cover29／L112←cover42／L113←cover25／L114←cover7／L115←cover2／L116←cover3／L117←cover4／L118←cover1`（纯二用升三用 8 张）**。

**实读实际落地**：`L111←cover111（:20685）`、`L112←cover112（:20879）`、`L113←cover113（:21073）`、`L114←cover114（:21268）`、`L115←cover115（:21462）`、`L116←cover116（:21656）`、`L117←cover117（:21850）`、`L118←cover1（:22046）`。

| 张 | PRD 方案 | 实际落地 | 差异 |
|---|---|---|---|
| cover29 / 42 / 25 / 7 / 2 / 3 / 4 | 批十七三用 | **仍各用 1 次**（L29/L42/L25/L7/L2/L3/L4） | ❌ **方案未执行，8 张可用张全部退回池内** |
| cover1 | 批十七三用 | ✅ **二用（L1＋L118）** | ✔ 唯一一致项 |
| cover111–117 | 不存在于方案 | **新生成 7 张并接线** | ✅ 走「续编新图」路线 |

> **口径裁定（实读）**：批十七实际走的是**「身份映射＋批量新出图」**路线，而非「池内二用升三用」。`.workbuddy/memory/2026-09-19.md` 逐字记载：「第七至十六季封面补齐（L50–L113 共 64 张）…全部新生成」「追加：L114–L117 补齐」「约定：后续继续加课时，加完一批统一告知再批量补封面」。**因此批十七审计里那份「二用池 37 张中只有 9 张可用／天花板 35」的约束表，对批十八已经完全失效——不可直接沿用。**

### 5.3 当前可用池与天花板

约束只剩两条：① **`cover1` 禁用**（两次使用为 L1 与 L118，第三次用在 L119+ 的 min-gap = `min(119−118, 118−1)` = **1**，❌）；② 批十八新课上课位为 `L119..L124`（6 课）／至 `L125`（7 课）／至 `L126`（8 课）。

单次张 `coverN` 在课位 `p` 使用后的 min-gap = **`p − N`**（只有一段历史）。可落线 ≥35 的张：**`2–89`，共 88 张**（`cover90` 起在 L124 的天花板仅 34）；≥100 的 23 张；≥110 的 13 张。

### 5.4 最优指派（二分答案 ＋ 穷举验证）

**目标**：6 张互异、6 个课位 `L119–L124`，最大化最小间距。

**二分答案**：`max-min = 117`（`118 不可行`，已证）。**穷举验证**：在 `min-gap = 117` 前提下 **max-sum 唯一解 = 702**。

| 课 | 封面 | 前次用 | 三用后间距 |
|---|---|---|---|
| **L119** | **cover2** | L2 | **117** |
| **L120** | **cover3** | L3 | **117** |
| **L121** | **cover4** | L4 | **117** |
| **L122** | **cover5** | L5 | **117** |
| **L123** | **cover6** | L6 | **117** |
| **L124** | **cover7** | L7 | **117** |

**最优性说明**：min-gap 由「最差的 `p − N`」决定；要让它最大化，就必须取 **N 最小的 6 张（2–7）配 p 最大的 6 个位（119–124）**，此时每张的间距同为 117，且 `cover2` 用到 L119 时 `119−2 = 117` 已是该课位的上界（`p` 已被钉死）。`118` 不可行是因为 `cover2` 在 `p=119` 的间距仅 117，无法更高。

**扩展档（同一口径，可直接施工）**：

| 课量 | 指派 | min-gap | sum |
|---|---|---|---|
| **6 课（推荐）** | `L119←2、L120←3、L121←4、L122←5、L123←6、L124←7` | **117** | 702 |
| 7 课 | 上表 ＋ `L125←cover8` | **117** | 819 |
| 8 课 | 上表 ＋ `L125←cover8、L126←cover9` | **117** | 936 |

### 5.5 ❌ 禁用张清单（本批）

| 张 | 原因 | 解禁 |
|---|---|---|
| **`cover1`** | 二用距离仅 **117 → 1**（L1 与 L118）；三用天花板 = **1** | **永久**（除非重排历史） |
| **`cover90`–`cover117`** | 在 L124 的天花板 ≤ 34（**低于 35 可用线**）；且 111–117 是批十七刚用的新图 | 批十九+（更晚课位抬升后） |
| `cover118`+ | **资产不存在**（无 `lesson-118.jpg` 及以后） | 需新出图 |

> **注**：本表按**编号间距实算**，**未做图像语义核对**（新图与 L119+ 场景是否相称需人工确认）——沿用批十六/十七口径，属**未核实项**。
> **兜底**：`cover` 在 `types.ts:590` 为可选字段，缺省回退 scene SVG——**封面池或语义不匹配均不阻断上线**。
> **替代方案（B 计划）**：若产品坚持「封面 = 该课号一一对应」的既成惯例（L1–117 均如此），则 L119+ 须**续出新图**，成本为 6 张新资产（非池内复用）。

---

## 6. G-boost 复核

**实跑**：`npx vitest run src/services/grammarBoostService.test.ts` → **1 文件 / 50 项全绿（3.25s）**（批十七为 42 项；本期 +8）。两条重负载用例通过：`改错题库：全库每课 ≥2 道可换` 764ms、`改错题每轮都有一道` 636ms。

**三条断言的现状（逐条实读）**：

| 断言 | 位置 | 现状 |
|---|---|---|
| ① 「全库每课 ≥2 道可换改错题」 | `:161-182`（`expect(thin…).toEqual([])` 在 `:182`） | **thin = 0 课** ✅ |
| ② 「`guided.spot` 的 `wrongToken` 逐字相等」 | `:185-196`（断言 `:196`，判定 `if (!spotStep.tokens.includes(spotStep.wrongToken))` 在 `:192`） | **违规 = 0 课** ✅（数据侧不依赖代码兜底 `grammarBoostService.ts:678` 的 `cleanWord` 近似） |
| ③ 「`contrast.wrongMark` 不得为纯标点」 | `:199-208`（断言 `:208`） | **违规 = 0 条** ✅ |

**改错池容量的实读底账（决定新课能否过 ①）**：
- 全库 `guided` 里 `kind: "spot"` 恒为 **1 道/课**（118 课共 118 道，无课为 0）
- 全库 `contrast` 中带非空 `wrongMark` 的共 **416 条**（`^        wrongMark: "` 命中 416；`wrongMark: null` 292）；**每课至少 1 条**
- 两源相加即「可换改错题池」：**最低的 11 课只有 2 道**（`L72·73·79·80·81·85·87·88·90·91·92`，都是「1 道 contrast mark ＋ 1 道 guided spot」贴着线）；最高 7 道
- **推断：批十八每课只要满足「1 道 `guided.spot` ＋ contrast 带 mark ≥1 条」，就有 2 道保底；若要留余量（复练不吃紧），建议每课 contrast 带 mark **≥2** 条**。批十七 8 课的实测为 3/3/2/3/3/3/4/4 条，是本批可照抄的模板。

---

## 7. 可生产性评估

| 候选 | 就绪度 | 生产量（6 课） | 风险 |
|---|---|---|---|
| **甲 `be/get used to`（B1 开局章）** | **★★☆** | 6 课全新：3 张 `be used to`（＋名词／＋-ing）＋1 张 `get used to`（变化中）＋1 张「同一个 to，两张脸」对比课＋1 张收口；6 个新案（#128–#133，每案 4 错＝新 2＋旧 2） | **①话术对撞（最高）**：`to 后面永远穿原样` 6 行背书（`:2719/2760/2803/8065/8443/17362`），其中 `:17362` 在 L93；且 L93/L100 有 **3 处把 `-ing` 设成错误答案**（`:17314/17423/18708`）——**必须做对位改写而非补充**。**② `-ing` 接口窄**：`getting` 2／`working` 0／`walking` 0／`driving` 0／`using` 0（§1.7）——「习惯」义最常用的动名词全零，要么造词要么只用 `reading/drawing/getting up/sleeping/cooking`。**③跨级**：B1 结构，与 A2 收尾段的衔接方式未裁。**④coze 落点安全**（§3，12/12 可落） |
| **乙 `look + 形容词` 升格** | **★★★** | 6 课：升格 1–2 课（把 14 处 NPC 对白转正为教学点）＋复现／迁移课；案件可走「NPC 对白回流」路线（HC 侧 `look` 7 处，`#44` 有 `look in` 的介词案可作锚） | **①零冲突（最大优势）**：`look` 从未进过任何 `grammarLabel`；14 处全在 `dialogue`、0 处作 target、0 处进讲解练习 → 升格不抢任何既有位。**②底座偏同构**：14 处里 12 处是「主语＋look(s)＋形容词」同一骨架，场景窄（多为「看某人状态」）。**③`look like` 半曝**：`looks like` 仅 `L49:8977` 一句对话、`look like` 0、`look as if` 0——若同批要带 `look like`，那是**另一条新线**，不宜混入。**④coze 落点已验证**（`looks`／`look` 均可抽）。**⑤与甲的 `-ing` 有天然接口**：`That film looks interesting.` 同时踩中 look+adj 与 -ed/-ing 两条线（L113 已教 `interesting/boring`） |
| **丙 形容词＋介词折卡** | **★★☆** | 若折卡则并入既有课（不单开 6 课）；若升格为章则整条新造 | **①库内 adj+prep 只有 `good at`（47 处）**：`interested in` **0**／`afraid of` **0**／`sorry for/about` **0**／`good for` **0**／`bad at` **0**／`proud of` **0**——**除 good at 外全零底座**。**②`preposition` 罪名（58/53）已被大量占用**，再压同罪名边际收益低。**③批十七路线图已裁「形容词＋介词折卡不单开」**——本期数据支持该裁定 |

**推荐（数析口径）**：**甲为主（6 课），把丙折进甲的第 1–2 课**（`be used to + 名词` 与 `good at + 名词` 的「介词门里穿什么」可共用一张对照卡，见 L67 `:12363` 的「门牌」话术）；**乙留作批十九的开章首选**（就绪度最高、零冲突、且能把 14 处沉睡对白变现）。

---

## 附录：核查留痕

### A1. 测试实跑（逐次记录，含中途红）

| 时刻 | 命令 | 结果 |
|---|---|---|
| 11:46 | `npx vitest run`（后台） | 🔴 **1 文件失败 / 57 通过；731 项通过** ——`src/pages/GrammarLessonPage.tsx:1795` esbuild 转换失败：`Expected ")" but found "{"`（`{lesson.deepDive && ( <LessonDeepDiveCard … />` **未闭合就接了 `{aiConfigured && (`**）。**同一时刻 `npx tsc --noEmit` 报 `GrammarLessonPage.tsx(1795,19): error TS1005`** |
| 11:48 | `npx vitest run src/pages/GrammarLessonPage.pretestVerdict.test.tsx` | 🔴 单跑同样红（0 项执行） |
| 11:56 | （并行会话修复落地，文件 md5 变为 `de3ba978…`） | — |
| 12:0x | `npx tsc --noEmit` | ✅ **exit 0，0 行输出** |
| 12:0x | `npx vitest run` | ✅ **58 文件 / 732 项全绿（6.56s）** |
| 12:0x | `npx vitest run src/services/grammarBoostService.test.ts` | ✅ **1 文件 / 50 项全绿（4.26s）** |

> **基线结论**：**当前（工作区现状）＝ 58 文件 / 732 项全绿 ＋ tsc 0 错**，与批十七路线图登记的「732 项全绿」一致。上表 11:46 的红色是**审计期间并行开发的瞬时状态**，已在 11:56 被修好；**记录在此以免后续误判为批十八引入的回归**。

### A2. 实读源文件清单 ＋ md5

| 文件 | 行数 | md5（2026-09-19 12:05 快照） |
|---|---|---|
| `src/data/grammarLessons.ts` | 22,238 | **`83a505c00c1dfb533679b3eedd658bc3`** |
| `src/data/huntCases.ts` | 7,301 | `4734bc3eecd1234d09f0d0b355d472b5` |
| `src/data/grammarSeasons.ts` | 57 | `105f227979ace272c48246313b012ccb` |
| `src/services/grammarAmbushService.ts` | 283 | `84b306b40e881c4f9b8c8d000851686c` |
| `src/services/grammarBoostService.test.ts` | 828 | `1bb83e53f415b94cfb020c22603b1c0a` |
| `src/pages/GrammarPathPage.tsx` | 699 | `0e2aa0830f103617a0e8daec98be880d` |
| `src/services/grammarBoostService.ts`（补充实读） | 1,452 | `c8b049693b3eff9fa5392c1c8aa9387e` |
| `src/pages/GrammarLessonPage.tsx`（补充实读） | — | `de3ba978bae689226e5122f032e41cab` |
| `src/data/grammarSeasons.test.ts` | 52 | （守门 4 项，见 §4） |
| `src/services/huntService.ts` / `.test.ts` | — | （`GRAMMAR_ERROR_TAGS` `:331-342`；`tagStats` 长度断言 `test:109`） |

### A3. raw 交叉验证（`grep -c` 逐条对齐提取结果）

| 口径 | `grep` raw | 脚本提取 | 一致 |
|---|---|---|---|
| `^    number:` / GL | 118 | 118 课 | ✅ |
| `^    cover: cover` / GL | 118 | 118 次、去重 117 | ✅ |
| `^    number:` / HC | 127 | 127 案 | ✅ |
| `^    id: "hunt-` / HC | 127 | 127 | ✅ |
| `reviewed: true` / HC | 129 | 案内 127（余 2 处在头注释 `:18`/`:22`） | ✅ 覆盖率 **127/127 = 100%** |
| 错点（`tokenIndex:` 行）/ HC | 482 | 482（按 case 分组求和一致） | ✅ |
| `^        wrong: "` / GL | 708 | contrast 条数 708 | ✅ |
| `bothRight: true` / GL | 243 | 243（其中 19 条同时带 `wrongMark`） | ✅ |
| `^        wrongMark: "` / GL | 416 | 416（`wrongMark: null` 292，708−292=416） | ✅ |
| `kind: "spot"` / GL | 118 | 118（**每课恒 1 道**） | ✅ |
| `原形` / `原样` in GL | 40 / 237 | 快照与工作区**逐字一致** | ✅ |
| `used to`（含讲解串） / GL | 112 行 | 120 处 / 113 串 | ✅（行 ≠ 处：一行可含 2 处） |

### A4. 临时探针与工作脚本（均已清理/置于 /tmp）

- 临时测试文件 `src/services/__audit18_probe.test.ts`：**已删除**（`rm` 后 `git status` 无残留）
- 复刻脚本与快照：`/tmp/audit18/{extract,fields,scan,dump,cloze,cloze2,covers,coveropt,vocab}.py`、`/tmp/audit18/{gl,hc}.json`、`/tmp/audit18/{gl,hc}_snapshot.ts`（快照 md5 与工作区一致）
- 探针的**真实服务输出**已逐字记入 §3.1／§3.2

### A5. 未核实

1. **封面图像语义未核**——指派按**编号间距实算**。新批次要把 `cover2–cover7`（原 L2–L7 的图）贴到 L119–L124，**图像内容与新章场景是否相称（`used to` 的「从前／习惯」叙事）需人工逐张确认**；若不符，可在 **88 张可用张**内自由重排（min-gap 117 的余量极大，重排不会掉线）。
2. **`lesson-118.jpg` 缺失已实读确认，但「L118 回落 cover1 是否为有意设计」未核**——PRD 方案里 L118 本就用 cover1，故推断为有意；但**是否应补一张专属图**属产品决策，数析不裁。
3. **`lesson-50..117.jpg` 68 张新资产未纳入任何测试守门**（实读：`grammarLessons.test.ts` 10 项断言中无封面项；`grammarSeasons.test.ts` 4 项亦不涉封面）——「课有 cover 字段但资产文件缺失」在当前测试体系下**不会报红**（L118 就是活例）。属**机制缺口**，建议批十八顺手补一条资产存在性守门。
4. **`-ing` 词汇红线未核**——只统计了形态存量，**未按「核心 500 词」表逐词核对** `getting up／working／driving` 等是否在册。
5. **甲的跨级衔接（B1 结构放入 A2 收尾后的第一段）未核**——属教学/产品裁定；批十七路线图已把它列为待裁项（§389）。
6. **`comparison` 死枚举未核归属**——实读 HC 0 处、`GRAMMAR_ERROR_TAGS` 10 元不含它；**是否计划启用未在任何文档中找到决议**。
7. **`has got` 的 `'s got` 缩写形态未逐条统计**——L116 oneLineRule（`:21666`）提到「缩起来还能写成 She's got」，但**全库 `'s got` 的实际出现次数未单独统计**（本次只统计了 `has got` 62 串）。
8. **审计期间工作区被并行改写一次**（`grammarLessons.ts` md5 `a936067…` → `83a505c…`，行数同为 22238；`GrammarLessonPage.tsx` 由语法错修复为 `de3ba978…`）。**报告数字均以冻结快照 `83a505c…` 为准并已复核与当下工作区一致；若后续再有改写，课号/封面/形态数字需重跑。**
