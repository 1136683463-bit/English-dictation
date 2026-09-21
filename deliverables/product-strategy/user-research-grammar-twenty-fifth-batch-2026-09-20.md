# 用户研究综合报告 · 第二十五批（用户研究 · 批二十五选题）
> **选题一句话推荐**：**取轴 B「两者」，做 3 课（`both` 立岗 → `neither` 切开 → 两张一起收口）**；**轴 A「让步链」本轮不取，建议继续押后**（§7 判定：`though` 旧判例口径**是「已宣布 although／「虽然」这个概念教过」，不是「已宣布 though 教过」**，但**轴 A 仍有四条独立成本问题未解**——详见 §7 与 §2）。

**日期**：2026-09-20 ｜ **类型**：用户研究（批二十五选题）｜ **成员**：瑞思
**方法**：本轮**不采信任何转述**，全部结论由下列实读产生。

- **实读源文件（9 个）**：`src/data/grammarLessons.ts`（**27842 行**／**147 课**）／`src/data/huntCases.ts`（**8577 行**／**156 案**）／`src/data/grammarSeasons.ts`（**71 行**，season-1–season-24）／`src/data/grammarZeroTerms.ts`（**31 行**，词表**实际 29 个术语**）／`src/data/grammarLessons.test.ts`（内容红线原文 `:1-230`）／`src/services/grammarAmbushService.ts`（`GRAMMAR_WORDS` 表 `:161-194` ＋ `pickClozeWord` `:195-215`）／`src/services/grammarBoostService.ts`（`hashText :182-188`／`mulberry32 :190-198`／`keywordIndexes :249-257`／`buildCloze :261-300`／`KNOWN_VERBS :327-341`／`FUNCTION_FAMILIES :280-305`／`courseVocabulary :420-432`）／`src/services/huntService.ts`（`GRAMMAR_ERROR_TAG_LABELS :16-28`）／`src/pages/GrammarPathPage.tsx`（里程碑区间 `:242-298`）。
- **词次口径（本轮统一，两法互校）**：**词次 ＝ 整词命中数**，用**两套独立正则**分别跑：① `(^|[^A-Za-z])w([^A-Za-z]|$)`（本机 `ugrep` 坑的告警写法，node 里安全）；② `(?<![A-Za-z])w(?![A-Za-z])`（零宽断言法）。**两法结果在全部受检词上一致**（`too` 300/301 一处差异系行尾边界计数写法，不影响档位判断）。**注释内命中不计**，`bothRight` 等字段名按「非词次」单列。
- **本机工具坑复核（按任务书要求）**：`grep -oniE "(^|[^A-Za-z])when([^A-Za-z]|$)"` 在本机 **ugrep** 下返回 0（**错误**），而 `grep -c "When"` 返回 240（**正确**）；`grep -c "bothRight"` ＝ **316/324**（**字段名，非词次**），`grep -oE "[^A-Za-z]both[^A-Za-z]"` ＝ **0**。→ **本报告全部词频由 node 脚本产出**，`grep` 只用于定位行号。
- **⚠️ 中文字面量不过滤（按任务书要求）**：本轮**不做「只留纯英文串」的过滤**——`though` 的 3 处全在中英混排段落中（§7 逐字），过滤会得到错误的 0。**本报告所有中英混排段落按原文整行扫描**。
- **实跑测试**：`npx vitest run` → **Test Files 61 passed (61) ／ Tests 800 passed (800)**，Duration **6.82s**（与批二十四交付后基线 **800 一致，干净**）。另单跑 `grammarLessons.test.ts`＋`grammarSeasons.test.ts` → **16 passed**。
- **引擎独立复刻**：本轮**独立复刻** `grammarBoostService` 的 `hashText`＋`mulberry32`＋`keywordIndexes`＋`buildCloze`（`/tmp/ruisi25/cloze.mjs`／`cloze2.mjs`／`cloze3.mjs`），对 **22 个候选句各跑 300–400 种子**实测 cloze 落点分布；另**独立复刻** `grammarAmbushService` 的 `pickClozeWord` 三级回退（`/tmp/ruisi25/ambush.mjs`），实测 12 个候选句的关 2 空位落点。
- **上游复核**：`/tmp/murphy_int_norm.txt`（中级 TOC，**11016 字符**）与 `/tmp/murphy_ess_norm.txt`（初级 TOC，**13966 字符**）逐字复核（§1.2）；`/tmp/c23_both.txt`／`/tmp/c23_neither.txt`／`/tmp/c23_either.txt`（Cambridge 词典页，批二十三缓存原件）逐字复核（§1.3）。

---

## 0. 结论先行

### 推荐方案：做轴 B「两者」**3 课小章 · L148–L150**（档位 **B−**，诚实标注见 §5.6）

**核心理由一句话**：**批二十四交付 `either` 后，轴 B 的造词成本已从 4 词降到 2 词（`both`＋`neither`），落回历史上限（3 词）以内；而轴 A 的四条押后理由本轮复核后「三条仍成立、一条部分消解但被新问题抵消」**——**成本账的变化让轴 B 从「超限」变成「可做」，这正是本批要做的事；轴 A 则仍不宜开工。**

### 0.1 本轮最重要的发现（四条，全部由实读产生）

1. **★ `both`／`neither` 的「轴 B 成本账」确实变了，且变化幅度精确可写**〔实读〕：

   | 项 | 批二十三／二十四时的账 | **本轮（批二十四交付后）的账** |
   |---|---|---|
   | 必造词 | `both` ＋ `neither` ＋ `nor` ＋ `either` ＝ **4 个** | **`both` ＋ `neither` ＝ 2 个**（加倒装 `nor` 才 3 个） |
   | `either` 状态 | **GL 0／HC 0**（真零） | **GL 87／HC 10**（**L146 占 49、L147 占 38**——**实读**） |
   | 是否超历史上限 | **✅ 超**（批二十造 3 词为历史最高） | **❌ 不超**（2 词，与批二十二持平；即使加 `nor` 也只 3 词，正好触顶不越顶） |
   | 判定 | 「造词 3–4 个超历史上限」 | **「2 词，回落到先例之内」** |

   → **任务书要的判定：是的，这个变化让轴 B 从「超限」变成「可做」。** **但需诚实标注：2 词仍是「造词课」档，不是零成本升格**（对照批二十四是 1 词）。

2. **★ 「两者」轴的场景零件本轮找到两件现成资产，且都是批二十四刚做完的两杯场景的直系**〔实读〕：
   - **`huntCases.ts:8449` 逐字 `title: "桌上的两杯"`**（**案 #154，`id: "hunt-like-tea-too"`，L145 的案件**），`scene` 逐字 `"晚饭后，桌上还剩着一杯茶和一杯咖啡"`——**⚠️ 直接复用会与 L145 撞车**（同一张桌子），**须换物**。
   - **`huntCases.ts:6995-6997` 逐字 `id: "hunt-whose-book-mine"` ／ `number: 121` ／ `title: "两本一样的书"` ／ `scene: "茶几上两本封面一样的书，旁边压着一张字条"`**（**L112 的案件**）；**`huntCases.ts:7171` 逐字 `id: "hunt-she-has-got"` ／ `number: 125` ／ `title: "姐姐的新包"` ／ `scene: "沙发上并排摆着的两个包，旁边一张购物单"`**（**L116 的案件**）；**`huntCases.ts:8227-8230` 逐字 `id: "hunt-but-vs-although"` ／ `number: 149` ／ `title: "便签上的两张脸"` ／ `scene: "桌上并排摆着的两张便签，写着同一个意思"`**（**L140 的案件**）。
   - **→ 「两个东西并排摆着」这个画面，库里已经出现过三次**（案 #121 的两本书／案 #125 的两个包／案 #149 的两张便签）——**其中 #121 与 #125 是「两个同类实物」，#149 是「两张写着同一意思的便签」**（L140 的对比场景）。**→ 「并排」这个视觉语言是库内既有资产，不必新造；但「两个同类实物」的先例只有 #121／#125 两次，且都不是「两个都／两个都不」的语义**——**这是轴 B 的现成视觉语言，语义上仍是新的**。
   - **但 `title: "两本一样的书"` 已被案 #121 占用**：**本批若也用「两本书」，须换 title，且要显式切开**（§6）。

3. **★ 轴 A 的四条押后理由，本轮逐条复核：三条成立、一条部分消解但被新问题抵消**〔实读〕：

   | 批二十四的四条理由 | 本轮复核结果 | 实读依据 |
   |---|---|---|
   | ① `though` 已在 L139／L141 出现 3 次、且都是引述旧判例，开课会冲突 | **⚠️ 部分消解**（§7 判定为「宣布概念已教，不是宣布 though 已教」），**但冲突仍存在**（正文逐字用 `though` 引原案） | `:26189`／`:26190`／`:26577` 逐字见 §7 |
   | ② `though` 的独立增量只剩句尾 `though`，与批二十四句尾教学动作撞车 | **✅ 仍成立**（批二十四已交付，句尾位置刚用完） | 批二十四 `L145` oneLineRule 逐字「too 站在句子尾巴上」／`L146` 逐字「还是站句尾」 |
   | ③ `unless` 第 1 课会变成 ❌will 规则的第三次应用 | **✅ 仍成立，且数字更精确**：will 规则本批实测**集中在 L47(1)／L48(15)／L49(6)／L109(1)／L142(7)／L143(4)／L144(2)**——**L48＋L142/143 两次完整应用已用掉，`unless` 是第三次** | 见 §2.3 |
   | ④ `in case` 连 `case` 都是零 | **✅ 仍成立**：`case` GL 0／HC 1（HC 那处是注释里的「如 case 9」，**非教学**）／`in case` 0／`in spite of` 0／`despite` 0／`even` 0 | `huntCases.ts:11` 逐字 `* 作为「生词提示」展示（如 case 9 的 advice / information）。`（**注释行**） |

   → **轴 A 的降级理由从「四条」变成「三条＋一条需先解口径」**，**仍不足以开工**。

4. **★ 轴 B 的 cloze 友好度是本轮实测最好的一批，但有一个必须写明的结构性问题**〔实读，两引擎各跑 300–400 种子〕：
   - **趁热练侧（boost `buildCloze`）**：`Both books are good.` 关键词池 `Both／books／good`，**`Both` 落点 35.8%／`good` 33.5%／`books` 30.8%**；`Neither book is good.` 同型 **`Neither` 35.8%**；**`Both are good.`（4 词短句）池只有 `Both／good`，落点 `Both` 52.0%／`good` 48.0%**——**考点词可稳定落空位 ≥30%，优于批二十三 `soon` 的 16.5–27.0% 与批二十二 `although` 的 16.5–21.5%** ✅
   - **关 2 侧（ambush `pickClozeWord`）⚠️ 结构性假友好**：**`both`／`neither` 均不在 `GRAMMAR_WORDS` 表内**（实读 `grammarAmbushService.ts:161-194` 全表逐项核对，**表内无 `both`／`neither`／`nor`**），**句子里只要有 `are`／`is`（在表内）就先被抽走**——实测 `Both books are good.` → 落 `are`（`Both books ___ good.`）／`Neither book is good.` → 落 `is`。**→ 与批二十四 `either` 完全同型（批二十四 §附录 B 已判「`either` 不在表内故永不成空位」）**。**处置沿用批二十四：考点承载压在 `contrast` ＋ `guided.spot`，不改引擎**（理由：改表会动全库 147 课关 2 行为，回归面远超单批收益）。

---

## §1 两者轴的缺口盘点

### 1.1 中文学习者说「两个都」「两个都不」的真实困难在哪？

**〔推断〕**（用户心理／中文频率——本轮无法实测用户，标注为推断）：

中文的「都」是一个**总括副词**，位置固定在**主语之后、动词之前**：

- 「两个**都**好」——「都」在「两个」和「好」中间。
- 「两个**都**不甜」——「都」在「两个」和「不」中间。

**这个位置习惯带来两个连锁困难**：

1. **位置困难**：英语的 `both` 站**最前面**（贴着那个「两个」），不在中间。中文「两个都好」4 个字里，英语要写成 `Both are good.`——**中文的「都」在中间，英文的 `both` 跑到队首**。这与批二十四 `too` 的困难**镜像相反**（`too` 是中文「也」在中间、英语跑句尾；`both` 是中文「都」在中间、英语跑队首）。**→ 两批连着做，位置感的教学动作是「同一件事、两个方向」，不是重复**（§6 详述）。
2. **「不」的处理困难**：中文说「两个都不」，是**在「都」后面加一个「不」**（「两个都**不**好」）——**加字**。英语**不能这么干**：`Both are not good.` 不是标准说法，**要把队首那个词整个换掉**（`both` → `neither`）。**这是「换词」而不是「加字」**——**与批二十四 L146 `too`→`either` 同一条机制**（「有『不』就换个词」），**但换的位置在队首、不在句尾**。**→ 这是本批最大的负迁移点**（§3 逐条）。

**〔推断〕中文频率**：中文「都」在库内共 **653** 处字面命中（GL，**含大量非「两个都」义的「都」**），「两个」**172** 处，「都不」**32** 处，「两个都」**7** 处。**「两个都／两个都不」作为独立义项的中文专文（`两个都` 义的 ✗ 清单）本轮无法取到**（未核实 §8①）。

### 1.2 上游课程位（Murphy 双册 TOC 本机原件逐字复核）

| 源 | 逐字 | 本轮复核 |
|---|---|---|
| **Murphy 初级 U82** | 归一化串 `:...80everyandall81allmostsomeanyno/none82botheitherneither83alotmuchmany84(a)little(a)fewAdjectives...` | **✅ 复核一致**（本机 `/tmp/murphy_ess_norm.txt` 逐字命中 `82botheitherneither`） |
| **Murphy 中级 U89** | 归一化串 `:...87much,many,little,few,alot,plenty88all/allofmost/mostofno/noneofetc.89both/bothofneither/neitherofeither/eitherof90alleverywhole91eachandevery...` | **✅ 复核一致**（本机 `/tmp/murphy_int_norm.txt` 逐字命中 `89both/bothofneither/neitherofeither/eitherof`） |
| **Murphy 初级 U42** | （批二十四已复核）`42too/eithersoamI/neitherdoIetc.` | **✅ 沿用**（倒装应答，本批**不碰**） |
| **两单元关系** | U82 是**无 `of` 的初级版**；U89 是**有 `of` 的中级版**（`both of`／`neither of`／`either of`） | **→ 上游把「两者」拆成两层，本批只做初级层（无 `of`）** |

**→ 课程位结论：`both`／`neither` 有**双册课程位**（初级一格＋中级一格），是批二十三以来第二厚的课程位（仅次于批二十四轴 A 的 U113–U115 三连）。** 但**本批只取初级 U82 那一层**（`both`／`neither` 不带 `of`）——**`of` 版留作后续增量**（§5.5）。

### 1.3 上游规则页与 CEFR（Cambridge 缓存原件逐字复核）

| 源 | 逐字 | 复核 |
|---|---|---|
| **Cambridge 语法页 `both`** | `` `Both: typical errors` `` 节两条逐字：① **"We don't use both with a negative verb; we use either instead"**；② **"When we use the verb be as a main verb, both comes after the verb"**（正例 `These films are both famous…`／错例 `These films both are famous…`）；**另有 `Both of or neither of in negative clauses` 节** | **⚠️ 本处出现一处「上游自相矛盾」，必须写明**：按 ① 「有『不』用 `either`」，则「两个都不好」应是 `either` 而不该是 `neither`；**但 Cambridge 同页又有 `Both of or neither of in negative clauses` 节标题**——**即上游在同一页里既说「否定用 either」又说「否定句优先 neither of」**。**这两条不是同一层**：①讲的是**「也」义**（`I don't like it either`），②讲的是**「两者都不」义**（`neither of them is good`）。**→ 本批只做 ② 这一层，且必须在 `contrast` 里显式切开**（§6.3） |
| **Cambridge 语法页 `neither`** | 页题逐字 **"Neither, neither … nor and not … either"**；有 `Neither as a determiner` 节（含 `neither of`）；有 `Neither … nor` 节（含**主语-动词倒装注记**）；例 `Neither of us went to the concert.`／`Neither can I.`／`Me neither.` | **⚠️ 全页四处都在讲 `of` 版／倒装版／应答版**——**本批的「无 `of`、无倒装、无应答」形态在上游规则页里没有直接对应句**。**这是本批的一处诚实折扣**：**`Neither apple is good.` 这种最简形态须由我方从 `neither of` 形式反推**（`neither of them is good` → 去掉 `of them` → `neither apple is good`）。**→ 标注为「须自建规则表述」**（§5.6） |
| **Cambridge 词典 CEFR** | **`both` 逐字 `A1`**；**`neither` 主义逐字 `B2`**（`neither … nor` 亦 `B2`） | **⚠️ 两词 CEFR 相差一整档（A1 vs B2）**——**这正是上游把两词压在一格（U82）而我方必须拆两课的理由**（§5.5） |

**→ 规则页结论：`both` 页厚（带两条 typical errors）＋`neither` 页中厚（带 `of` 与倒装）**。**两词不同档，须拆课**。

### 1.4 「两个都」和已教的「也」（`too`／`either`）在语义上是什么关系？

**〔实读 ＋ 推断〕** 这是本批**最需要写清楚的一条**，因为批二十四刚教完「也」：

| 维度 | 批二十四（已交付） | 本批（轴 B） | 关系 |
|---|---|---|---|
| 中文义 | 「也」（同一个「也」） | 「两个都」「两个都不」 | **不同的中文字**（「也」vs「都」）——**不是同一个义项的两张脸** |
| 位置 | **句尾**（`I like tea too.`） | **队首**（`Both books are good.`） | **镜像位置** |
| 涉及「不」时 | 句尾换词（`too`→`either`） | **队首换词**（`both`→`neither`） | **同一机制、不同位置**（§6.2 详述） |
| 词数 | 1 个（`either`） | 2 个（`both`／`neither`） | 本批造词成本更高 |
| 上游课程位 | 初级 U42（倒装应答，**与 `too`／`either` 的「也」义是两回事**） | 初级 U82＋中级 U89 | **轴 B 的课程位更厚** |

**→ 三条关系结论（写清以免被误读为重复批二十四）**：

1. **不是同一义项的两张脸**——批二十四是「同一个『也』的两张脸」（`too`／`either`）；**本批是「同一个『都』的两个词」（`both`／`neither`）**。**中文侧的字不同、英语侧的机制同型**。
2. **共享的机制是「有『不』就换个词」**——批二十四在**句尾**换（`too`→`either`），本批在**队首**换（`both`→`neither`）。**→ 这是同一条老规矩（L83 首次应用 `something`→`anything` ／批二十四第二次 ／本批第三次）的第三次应用**（**⚠️ 这一点必须诚实标注，与 §2.3 `unless` 的「第三次应用」同型——但性质不同**：§2.3 的第三次应用是「整课只有一个规矩」，本批的第三次应用是**机制复用、课的主增量另有其物**，详见 §5.6）。
3. **语义距离足够远**：「也」讲的是**追加**（我跟上）；「两个都」讲的是**总括**（两个一起）。**两者在中文里从不互相替换**。

---

## §2 让步链的缺口盘点

### 2.1 中文「虽然…但是…」「即使…也…」「除非…」「万一…」分别对应英语什么？

| 中文 | 英语主体 | 上游课程位 | 我方状态 |
|---|---|---|---|
| 「虽然…但是…」 | `although`／`though`／`even though`；转折侧 `but`／`however` | 中级 U113（`although though even though in spite of despite`） | **✅ `although`＋`but` 已教（L139–L141，实读 `although` 三课占 70/52/52）**；`though`／`even though` 未教 |
| 「即使…也…」 | `even if`（假设）／`even though`（事实） | **Murphy 双册无 `even if` 独立单元**（实读：中级 TOC `evenif` 无命中）；**BC `C1` 专课 `contrasting-ideas` 逐字含 `even if`** | ❌ 未教、**上游只到 C1** |
| 「除非…」 | `unless` | 中级 U115（`unless as long as provided`） | ❌ 未教（GL 0／HC 0） |
| 「万一…」 | `in case` | 中级 U114（`in case`） | ❌ 未教（`in case` GL 0／HC 0；`case` GL 0） |

**→ 覆盖盘点：已教的 `although`（L139）＋`but`（L140）覆盖了第一行的「虽然…但是…」这一格**。**未覆盖的是：`though`（位置与强度）、`even though`（强调）、`unless`（除非）、`in case`（万一）**。

### 2.2 已教的 `although`（L139）／`but`（L140）覆盖了哪部分？未覆盖的是哪些？

**已覆盖**〔实读〕：
- **`although` 站最前面领一整句**（L139 `:26110` 逐字 `grammarLabel: "虽然 · although 站最前面"`；`targetSentence` 逐字 `"Although it is raining, I will go out."`）
- **`but` 站中间接两半**（L140 `:26304` 逐字 `grammarLabel: "两张脸 · although 站前面 / but 站中间"`）
- **「中文成对说、英语只留一个」这条负迁移规则**（L139 `:26123` oneLineRule 逐字「**中文的「虽然…但是…」成对说，英语只留一个**」）

**未覆盖**〔实读〕：
- **`though`**——**GL 3／HC 2，三处 GL 全是 L139／L141 深挖卡里引述案件原句**（§7 逐字）。**其中 `:26190` 逐字「不是 Though 本身」是「独立使用 `though`」的唯一一处**。
- **`even though`**——**GL 0／HC 0**（**本轮两法实测均为 0**）
- **`even`**——**GL 0／HC 0**（⚠️ **注意：`even` 全零**——这意味着 `even though`／`even if` 两族都无垫子）
- **`unless`**——**GL 0／HC 0**
- **`in case`**——**GL 0／HC 0**；**`case` GL 0／HC 1（注释行）**；**`in spite of` GL 0／HC 0**；**`despite` GL 0／HC 0**

### 2.3 轴 A 的四条成本问题，本轮逐条复核（这是 §0.1③ 的展开）

**① `though` 回溯冲突——⚠️ 部分消解，但未归零**（**§7 是专门判定，此处只记结论**）：
- **消解的部分**：`:26189`「今天它转正了」与 `:26577`「这一章就是那句话的正经课」**在逐字语境里，宣布的是「`although`／『虽然』这个概念转正了」**，而 `:26190` 明写「**不是 Though 本身**」——**两句都没有宣布「`though` 这个词教过」**。**→ 严格按字面，批二十五开一课讲 `though` 不构成「宣布已教过又再教」。**
- **未归零的部分**：**两条文案的引文逐字用的是 `Though`**（`「Though it was cold, but we went out.」`），**且均说「第 12 课你判过一句」＋「今天它转正了」**。**学习者读到「今天它转正了」时，最自然的读法是把「它」= 那句引文 = `Though` 那一句**。**→ 若批二十五再开一课说「今天我们学 though」，会把 L139 的「今天」与批二十五的「今天」叠在同一件事上，产生「上次说转正了、这次又转正」的观感重复**。
- **→ 本轮判定：冲突从「正面矛盾」降级为「观感重复」，级别降了，但**没有消失**。**若要做轴 A，前置项应是**修改 L139／L141 文案**（把「它转正了」的指代明确为「这个『虽然』」而非引文），**而不是「直接开课」**。

**② 句尾 `though` 与批二十四撞车——✅ 仍成立，且本轮实测更硬**：
- 批二十四已交付并**实测 `too` 的句尾教学动作在库内密度**：`too` GL **300/301**，其中 **L145 起的新增段落占绝大部分**（三课 `:27263-27743` 区段）。
- **Cambridge `although-or-though` 页（批二十四已取）逐字**：「**Though can also go at the end of the second phrase.**」——**句尾 `though` 是该词唯一的独立增量**。
- **→ 两批连着做两个「句尾小词」，观感上确实是同一件事说两遍。✅ 理由成立。**

**③ `unless` 的第三次应用——✅ 仍成立，本轮给出精确数字**〔实读〕：
- **❌will 规则在库内按课分布**（正则 `if 里不用 will|if 里说现在|不带 will|不用 will|不请 will`，按课归属实测）：
  `L47(1) ／ L48(15) ／ L49(6) ／ L109(1) ／ L142(7) ／ L143(4) ／ L144(2)`
- **即：L48 是第一次完整应用（15 处）**，**L142／L143 是第二次（7＋4 处）**，**`unless` 第 1 课就是第三次**。
- **⚠️ 一处重要订正**：**批二十四 §0.2③ 曾记「L142 `:26696` 那一课已经在做同一件事的第二次应用」，本轮数字显示 L142 有 7 处、L143 有 4 处，合计 11 处**——**第二次应用不是一课的偶发，是批二十三整章（L142–L144）的主体之一**。**`unless` 作为第三次应用，能与它切开的空间更小。**
- **→ 理由成立，且强度比批二十四时更高。**

**④ `in case` 零垫子——✅ 仍成立**〔实读〕：
- **`in case` GL 0／HC 0；`case` GL 0／HC 1**；**`in spite of` GL 0／HC 0；`despite` GL 0／HC 0；`even` GL 0／HC 0**。
- **`huntCases.ts:11` 那唯一一处 `case`** 逐字：`* 作为「生词提示」展示（如 case 9 的 advice / information）。`——**文件头注释，非教学内容**。
- **→ 理由成立。**

### 2.4 轴 A 的额外新问题（本轮新增，批二十四未记）

**⑤ `even` 全零，使轴 A 的「强度层」失去全部支撑**〔实读〕：
- 批二十四把轴 A 描述为「`though`／`even though`／`unless`／`in case` 四词链」。**本轮实测 `even` GL 0／HC 0**——**这意味着「`even though` 比 `although` 更强」这个上游规则点（BC `contrasting-ideas-*` 逐字 "Even though is slightly stronger and more emphatic than although."），在我方库里连一个 `even` 都没有**。
- **→ 若要教 `even though`，须同时造 `even`＋`though` 两词**（或把 `even though` 当整串造）——**造词成本不低于轴 B，且携带回溯冲突**。

**⑥ 「即使…也…」（`even if`）在上游只有 C1 位**〔实读〕：
- **Murphy 双册 TOC 无 `even if` 独立单元**（本轮 `grep -o "evenif"` 于两份归一化 TOC：**均无命中**）；**BC 只有 `C1 Advanced` 专课 `contrasting-ideas` 逐字含 `even if`**。
- **→ 「即使」这一格在本批不能开**（超纲），**而它是中文让步链里与「虽然」并列的高频格**。**轴 A 若只做「虽然／除非／万一」，会缺掉中文让步链最常用的一格**——**教学完整性上是残的**。

**→ 轴 A 小结：从「四条理由」变成「四条理由＋两条新问题」。建议继续押后，且**押后的前置项是「修 L139／L141 文案口径」**，而非「等一个更好的时机」。**

---

## §3 中文负迁移分析

### 3.1 轴 B（`both`／`neither`）的典型中式错句

| # | `*错句` | 干扰点（中文侧来源） | 判定 |
|---|---|---|---|
| B1 | `*Both apples are not good.` | 中文「两个都**不**好」是**在「都」后加一个「不」**——加字思维直接搬到英语 | **⚠️ 本批头号负迁移。** 上游明文（Cambridge `both` typical errors 逐字 "We don't use both with a negative verb"）；**正解须整个换队首词**（`Neither apple is good.`） |
| B2 | `*Both apple is good.` | 中文「两个苹果」的「个」不分单复，英语 `both` 后面那个东西**须带上 s** | 机制复用：L11 逐字 `oneLineRule: "两个以上要加 s。"`（GL 实测「两个以上」共 33 处，L11 是主场） |
| B3 | `*Both are apples good.` | 中文「两个**都**好」的「都」在中间——搬位置会插到中间 | **位置负迁移**，与 B4 同族 |
| B4 | `*Apples both are good.` ／`*These films both are famous.` | 同上（「都」在中间） | ⚠️ **上游明文标错**（Cambridge 逐字错例 `These films both are famous…`）。**但注意：上游的正解是 `These films are both famous…`——即 `both` 站 `be` 之后。我方本批采用的最简形态（`Both apples are good.`）是把 `both` 放句首、后面直接跟那个东西**——**两种都对（`both` 作 PRONOUN 放句首 vs 作 ADVERB 放 be 后），但同课并存会混淆**。**→ 本批只做句首形态，`are both` 形态留作后续增量**（§5.5） |
| B5 | `*Neither apples are good.` ／`*Neither apples is good.` | 中文「两个都不」里「两个」是复数，英语 `neither` 后面**习惯只说一个**（`neither apple`） | ⚠️ **上游中文侧注意到「neither 本身视为单数」**（批二十四竞析已登记：「either 本身…視為單數」「neither 本身…視為單數」）。**但 `neither apple is` 与 `neither of them are` 在真实英语里两可**——**本批采用最简的 `neither + 单数东西 + is`**，**并在 `contrast` 里明确切开** |
| B6 | `*Neither apples are not good.` | 双重否定：中文「两个都不」已经含「不」，学生再补一个 `not` | **⚠️ 上游中文侧明文标「語意錯誤（双重否定）」**（批二十四竞析已登记 `They aren't going to neither travel nor go on vacation. ❌`）——**`neither` 本身已含「不」，后面不再补 `not`** |

### 3.2 轴 A（让步链）的典型中式错句（供对照，本批不做）

| # | `*错句` | 干扰点 | 来源 |
|---|---|---|---|
| A1 | `*Though it was cold, but we went out.` | 中文「虽然…但是…」成对说 | **⚠️ 本案已是库内既有判例**：`huntCases.ts:327-360`（案块实体范围；`:328` 逐字 `id: "hunt-because-so"`，`:329` 逐字 `number: 7`，`:330` 逐字 `title: "因为所以"`）**案 #7**，`tokens` 内含 `"Though","it","was","cold,","but","we","went","out."`（**实读 `:343` 逐字 `"Though",`**），`errors[1]` 逐字 `original: "but"` ／ `correction: "去掉 but"`（**`:365`**）／ `explanation: "同样的道理：Though 和 but 不能同时出现，留一个就够。"`（**实读 `:366`**） |
| A2 | `*Although Randy has a lot of friends, but he still feels very lonely.` | 同上 | 中文侧 `although` 专文逐字 ❌（批二十四竞析已登记） |
| A3 | `*Unless the weather will get better, the soccer game will be cancelled.` | 中文「如果天气**会**变好」的「会」跟着跑进 `unless` 里 | 中文侧 `unless` 专文逐字 ❌（**直接打在 ❌will 规则上**） |
| A4 | `*Even I've polished and cleaned the vase, it still looks old.` | 中文「即使」直接用 `even` 拖一整句 | 中文侧 `even though` 专文逐字 ❌ |
| A5 | `*Both of them didn't win the prize.`（轴 B 交叉） | 中文「他们两个都没」 | 中文侧 `both` 专文逐字 ❌（批二十四竞析已登记） |

---

## §4 场景设计：轴 B 的场景锚（零件逐词实测）

### 4.1 零雨线纪律复核（按任务书要求）

〔实读〕**`rain` 系资产按课分布实测**（正则 `(?<![A-Za-z])w(?![A-Za-z])`，按课归属）：
```
rain     总 12 课 | L142+ 命中：0
rains    总  8 课 | L142+ 命中：0
raining  总 11 课 | L142+ 命中：0
rainy    总  3 课 | L142+ 命中：0
stops    总  2 课 | L142+ 命中：0
stopped  总  3 课 | L142+ 命中：0
the movie 总 1 课 | L142+ 命中：0
ends     总  1 课 | L142+ 命中：0
ended    总  1 课 | L142+ 命中：0
umbrella 总  8 课 | L142+ 命中：0
```
**→ 复核结论：批二十三建立的「零雨线」纪律在 L142–L147 段**确实零命中**，纪律执行干净。本批（L148–L150）继续不碰 `rain`／`raining`／`rainy`／`stops`／`stopped`／`the movie`／`ends`／`ended`／`umbrella`。**

**⚠️ 一处须提醒**：`although` 的 L139 已用雨（`:26192` 逐字「场景也是接着第 109 课那场雨的」）。**本批三条场景全部避开天气**（§4.3）。

### 4.2 场景锚的候选零件（逐词实测词次，两法一致）

**候选零件池 A：「两本书」**

| 词 | GL | HC | 说明 |
|---|---|---|---|
| `book` | **434** | 37 | **厚** |
| `books` | **54** | 29 | **厚**（`a book` 的复数形态在库常见） |
| `good` | **303** | 43 | **厚** |
| `new` | **188** | 11 | 厚 |
| `heavy` | **69** | 6 | 中厚 |
| `desk` | **112** | 16 | 厚 |
| `two` | **66** | 270 | 厚 |
| `are` | **641** | 88 | 厚 |
| `is` | **2402** | 224 | 厚 |
| `library` | **32** | 4 | 中 |

**候选零件池 B：「两个苹果」**

| 词 | GL | HC | 说明 |
|---|---|---|---|
| `apple` | **52** | 19 | 厚 |
| `apples` | **112** | 19 | **厚** |
| `good` | **303** | 43 | 厚 |
| `big` | **26** | 3 | 中 |
| `table` | **36** | 6 | 中 |
| `fruit` | **0** | 1 | ❌ **几乎零**（HC 1 处） |
| `plate` | **0** | 0 | ❌ **真零** |
| `sweet` | **0** | 0 | ❌ **真零** |
| `fresh` | **0** | 1 | ❌ **几乎零** |

**候选零件池 C：「两个包／两件东西」**

| 词 | GL | HC | 说明 |
|---|---|---|---|
| `bag` | **231** | 24 | **厚** |
| `bags` | **0** | **8** | ⚠️ **GL 零、HC 8**——**复数形态在 GL 里从未出现**（用它会成为本批的新形态，但 `bag` 极厚） |
| `heavy` | **69** | 6 | 中厚 |
| `new` | **188** | 11 | 厚 |
| `red` | **3** | 2 | ⚠️ 薄（**`I have a red cup.` GL 1 处**） |

### 4.3 场景锚选定（三条，按课）

**⚠️ 三条场景全部避开**：① 雨系（零雨线）；② L145 的「桌上两杯」（`huntCases.ts:8449` 已占用）；③ L114 的「果盘」（`grammarLessons.ts:21269` 逐字 `sceneSetupZh: "果盘端上桌：苹果还剩几个，糖果却几乎见底了——小美数了数。"`）。

| 课 | 场景锚 | 出现地点 | 零件实读（全部在库） |
|---|---|---|---|
| **L148** | **书桌上摊着两本一样的书，封面颜色不一样** | mansion（小美房间的书桌） | `book` 434／`books` 54／`good` 303／`new` 188／`desk` 112／`two` 66／`are` 641 |
| **L149** | **同一张书桌——小美把两本书拿起来，两本都不满意** | mansion（同上，单拱） | `neither`（本批造）／`book` 434／`good` 303／`is` 2402／`two` 66 |
| **L150** | **书桌抽屉里翻出那张字条：两行并排写着** | mansion（同上，收口） | 收口课零新知，只用 L148／L149 已出现的零件 |

**⚠️ 两处与既有资产的切开交代（必须写进 PRD）**：
1. **`huntCases.ts:6997-6998` 案 #121 已用 `title: "两本一样的书"` ／ `scene: "茶几上两本封面一样的书，旁边压着一张字条"`**（L112 的案件）。**→ L148 的场景锚选「书桌上」而非「茶几上」**，且 **L148 的 `title` 不得用「两本一样的书」**（案 #121 已占）。**若主理人认为「两本书」在视觉上仍与案 #121 太近，退路是改用「两个包」**（`bag` 231／`bags` 0+HC8／`heavy` 69）——**但 `bags` 在 GL 里真零，会多出一个新形态，故推荐首选「两本书」。**
2. **`huntCases.ts:8449` 案 #154（L145）已用「桌上两杯」**。**→ 本批三条场景不再用杯／茶／咖啡**（`cup` 123 虽厚，但避开更干净）。

### 4.4 cloze 落点实测（决定考点能否被抽到）

**① 关 2（ambush `pickClozeWord` 复刻，`/tmp/ruisi25/ambush.mjs`）**：

| 句子 | 落点 | 空位文本 | 判定 |
|---|---|---|---|
| `Both books are good.` | **`are`** | `Both books ___ good.` | ⚠️ 抽走 `are`，**`Both` 完好**——**考点不在空位** |
| `Neither book is good.` | **`is`** | `Neither book ___ good.` | ⚠️ 同上 |
| `Both are good.`（4 词） | **`are`** | `Both ___ good.` | ⚠️ 同上（`Both` 仍完好） |
| `I like both.` | **`like`** | `I ___ both.` | ⚠️ 抽走 `like`（`like` 在表内且更靠前） |

**→ 结构性结论（与批二十四 `either` 完全同型）**：**`both`／`neither`／`nor` 均不在 `GRAMMAR_WORDS` 表内**（实读 `grammarAmbushService.ts:161-194` 全表逐项核对：表含 `both`？**否** ／ `neither`？**否** ／ `nor`？**否**），**而 `are`／`is` 在表内且必在句中**——**故关 2 空位永远落在 `are`／`is` 上，本批两个考点词永不成空位**。

**② 趁热练（boost `buildCloze` 复刻，`/tmp/ruisi25/cloze3.mjs`，每句 400 种子）**：

| 句子 | 关键词池 | 落点分布（400 次） | **考点词命中率** |
|---|---|---|---|
| `Both books are good.` | `Both/books/good` | **Both 35.8%**／good 33.5%／books 30.8% | ✅ **35.8%** |
| `Both books are new.` | `Both/books/new` | **Both 35.8%**／new 33.5%／books 30.8% | ✅ **35.8%** |
| `Neither book is good.` | `Neither/book/good` | **Neither 35.8%**／good 33.5%／book 30.8% | ✅ **35.8%** |
| `Neither book is new.` | `Neither/book/new` | **Neither 35.8%**／new 33.5%／book 30.8% | ✅ **35.8%** |
| **`Both are good.`**（4 词） | `Both/good` | **Both 52.0%**／good 48.0% | ✅ **52.0%**（最佳） |
| **`Neither is good.`**（4 词） | `Neither/good` | **Neither 52.0%**／good 48.0% | ✅ **52.0%**（最佳） |
| `Are both books good?` | `both/books/good` | **both 35.8%**／good 33.5%／books 30.8% | ✅ 35.8%（**注意小写 `both`**） |
| `Both apples are good.` | `Both/apples/good` | **Both 35.8%**／good 33.5%／apples 30.8% | ✅ 35.8% |
| `Both bags are heavy.` | `Both/bags/heavy` | **Both 35.8%**／heavy 33.5%／bags 30.8% | ✅ 35.8% |

**→ 结论：趁热练侧 `both`／`neither` 可稳定落空位 35.8%（短句可达 52.0%）**——**优于批二十三 `soon`（16.5–27.0%）／批二十二 `although`（16.5–21.5%）／批二十四 `either`（26.0%）** ✅ **本批是近四批里 cloze 友好度最好的一批。**

**③ 干扰项安全（本轮核对）**：
- **`both`／`neither`／`nor` 均不在 `KNOWN_VERBS` 表内**（实读 `grammarBoostService.ts:327-341` 全表核对：**三词全不在**）→ **不会产出 `boths`／`neithers`／`neithered`／`norring` 这类伪词** ✅。
- **`both`／`neither` 不在 `FUNCTION_FAMILIES` 的 20 组同族表内**（实读 `:280-305` 区段逐组核对：`["in","on","at"]`／`["a","an","the"]`／`["this","that","these"]`／`["my","your","his"]` 等，**三词全不在任何一组**）→ 走「课程词汇池」分支（`courseVocabulary()`，实读注释逐字「约 430 个词」）**配长度相近的真词**——**都是库里学过的词，属合规干扰项** ✅。
- **⚠️ 一处风险**：`Neither` 有**独立发音争议**（英式 `/ˈnaɪ.ðə/` 与 `/ˈniː.ðə/` 并存，实读 `/tmp/c23_neither.txt` 逐字两条音标）——**本批不处理发音**（课程无音频教学动作），**登记为未核实项**（§8）。

---

## §5 逐课规格（推荐 3 课 · L148–L150）

> **课注 id 已按库内命名惯例给出**（`lesson-<n>-<slug>`），**并与既存 id 做冲突检查**：`lesson-148`／`lesson-149`／`lesson-150`／`lesson-151` 在库内**均无命中**〔实读〕；`season-25` 无命中；`number: 157/158/159/160` 在案件文件均无命中。

### 5.1 L148 —— `both` 立岗

| 字段 | 内容 |
|---|---|
| **课注 id** | `lesson-148-both` |
| **number** | 148 |
| **title** | 两本都好 |
| **grammarLabel** | 两个都 · both 站最前面 |
| **目标句** | `Both books are good.`（**4 词 ✅**） |
| **场景** | mansion（小美房间书桌：摊着两本书，封面不一样，小美说两本都好） |
| **blocks** | `{ text: "Both books", role: "两本书（两个都——both 站最前面）" }` ／ `{ text: "are good", role: "都好（两个东西，用 are）" }` |
| **一句话规则** | 说「两个都」：both 站最前面，后面那对东西要带上 s——Both books are good（两本都好）。中文的「都」在中间，英语的 both 要走到最前面。 |
| **对比卡 6 条方向** | ① `*Both book is good.`（`wrongMark: "book"` → `books`，**L11 老规矩：两个以上要加 s**）② `*Both books is good.`（`wrongMark: "is"` → `are`，**L26 老规矩：好几个东西用 are**）③ `*Books both are good.`（`wrongMark: "both"` → 队首，**位置负迁移 B3**）④ **双正解卡**（`bothRight: true`）`The two books are good.`——**L81 `:15022` 逐字 `The ball is between the two boxes.` 是库内唯一的 `the two` 形态**（GL 4 处全在 L81），**这一卡是「两个东西」的另一种说法** ⑤ **双正解卡** `We are happy.`（**L07 逐字 `targetSentence: "We are happy."`，practice 复用仅 1 课、余量 5**）——**「我们两个都开心」的老朋友** ⑥ **双正解卡** `I ate two sandwiches.`（**L11 逐字 `targetSentence: "I ate two sandwiches."`，practice 复用 2 课、余量 4**）——**「两个」这个数在第 11 课就学过了** |
| **变体三态** | 肯定 `Both books are good.`／否定 ⚠️ **本课不给否定变体**（**「两个都不」是 L149 的正课**——**L148 的否定态直接写成「下一课看有『不』怎么说」**，照 L145 `:27334` 逐字成例：`{ label: "否定", en: "I don't like coffee.", zh: "我不喜欢咖啡。", noteZh: "不喜欢 = don't like（下一课看句尾换哪个词）。" }`）／疑问 `Are both books good?`（**实测 GL 0／HC 0，未用过 ✅**） |
| **复现取材建议** | practice 4 题中：**1 题本课目标句 ＋ 1 题疑问变体 ＋ 2 题跨课复现**。跨课复现候选（**均实测未超预算**）：`We are happy.`（**1 课／余量 5**）／`I ate two sandwiches.`（**2 课／余量 4**）／`It is cold today.`（**3 课／余量 3**）／`I have a new bag.`（**2 课／余量 4**）。**⚠️ 禁用 `I am happy.`（6 课／余量 0，已满）与 `There is a book on the desk.`（5 课／余量 1，留给更需要的批）** |
| **案件设计建议** | 新错 `word_order`：`Both` 跑中间（`*Books both are good.`）；旧错回流 **L11 复数**（`book`→`books`）＋**L26 there be／are**（`is`→`are`）＋**L25 三单**。**案号 157**，`huntCaseIds: ["hunt-both-books"]`。**新错型方向**：库内 `word_order` tag 共 **54** 处（实读 `huntCases.ts` tag 统计），**「小词站错队首／队尾」这个方向批二十四已开（案 #154 `too` 站错位置），本批可复用同一 tag 但换成队首** |

### 5.2 L149 —— `neither` 立岗 ＋ 与 `both` 切开

| 字段 | 内容 |
|---|---|
| **课注 id** | `lesson-149-neither` |
| **number** | 149 |
| **title** | 两本都不好 |
| **grammarLabel** | 两个都不 · neither 上，both 让位 |
| **目标句** | `Neither book is good.`（**4 词 ✅**） |
| **场景** | mansion（**同一张书桌**：小美把两本书拿起来翻了翻，两本都不满意——单拱第二课） |
| **blocks** | `{ text: "Neither book", role: "两本书都不（both 让位，neither 上）" }` ／ `{ text: "is good", role: "不好（只说一个，用 is）" }` |
| **一句话规则** | 说「两个都不」：neither 站最前面，后面那个东西只说一个——Neither book is good（两本都不好）。中文是加一个「不」（两个都**不**），英语要整个换人：both 让位，neither 上。 |
| **对比卡 6 条方向** | ① **本批头号**：`*Both books are not good.`（`wrongMark: "Both"` → `Neither`，**B1 负迁移；上游 Cambridge `both` typical errors 逐字 "We don't use both with a negative verb; we use either instead"**）② `*Neither books are good.`（`wrongMark: "books"` → `book`，**B5：neither 后面只说一个**）③ `*Neither book is not good.`（`wrongMark: "not"` → 去掉，**B6 双重否定；上游中文侧明文「語意錯誤」**）④ **双正解卡** `Both books are good.`（**L148 回流：一正一反摆一起**）⑤ **双正解卡** `I don't have anything for you.`（**L83 逐字 `oneLineRule`「问句和「不 / 没」里换成 anything——第 30 课 some/any 的老规矩」**）——**「有『不』就换词」这条老规矩的第二次应用** ⑥ **双正解卡** `I don't like coffee either.`（**L146 逐字 `targetSentence`**）——**批二十四刚教的「句尾换词」，与本课「队首换词」并排**（**⚠️ 这一卡是本批与批二十四切分的核心教学动作，见 §6.2**） |
| **变体三态** | 肯定 ⚠️ **本课不给肯定变体**（**肯定态是 L148**，**此处写成「上一课那张脸」**，照 L146 `:27527` 逐字成例：`{ label: "肯定", en: "I like tea too.", zh: "我也喜欢茶。", noteZh: "第 145 课——没有「不」，句尾用 too。" }`）／否定 `Neither book is good.`（**即目标句**）／疑问 `Are both books good?`（**回流 L148**，**本课不给 `neither` 的疑问**——**上游 `neither` 疑问态在 Cambridge 页里只有 `Neither can I.` 这类应答，不是本课形态**） |
| **复现取材建议** | practice 4 题：**1 题目标句 ＋ 1 题 L148 肯定态回流 ＋ 2 题跨课复现**。候选：`I don't like coffee either.`（**实测 practice 复用 0 课 ❌ 未用过**——⚠️ **但它刚在 L146／L147 的 examples／variants 里出现，进 practice 会拉高 examples 复用率，须核 `grammarLessons.test.ts:144-161` 的「practice 不得整组复用 examples」断言**）／`I don't have anything for you.`（**须实测复用余量**）／`My hands are clean.`（**实测 practice 复用 0 课 ✅**）／`They are good.`（**0 课 ✅**） |
| **案件设计建议** | 新错 **`word_order`**：「有『不』时队首没换词」（`*Both books are not good.`）；旧错回流 **L11 复数**（`books`→`book`）＋**L19 was/were**＋**L30 some/any「有『不』就换词」**。**案号 158**，`huntCaseIds: ["hunt-neither-book"]`。**标题建议避开「两本一样的书」**（案 #121 已占，`huntCases.ts:6997`） |

### 5.3 L150 —— 收口（零新知）

| 字段 | 内容 |
|---|---|
| **课注 id** | `lesson-150-close-25` |
| **number** | 150 |
| **title** | 两个排一行（收口） |
| **grammarLabel** | 收口 · 零新知（两个的脸） |
| **目标句** | `Both books are good.`（**4 词 ✅**，与 L148 同句——**照 L147 `:27662` 成例：收口课 `targetSentence` 逐字 `"I like tea too."`，与立岗课 L145 同句**） |
| **场景** | mansion（**同一张书桌**：抽屉里翻出那张字条，两行并排写着） |
| **blocks** | `{ text: "Both books are good", role: "两本都好（没有「不」的那张脸）" }` ／ `{ text: "Neither book is good", role: "两本都不好（有「不」的那张脸）" }` |
| **一句话规则** | 同一个「两个」，两张脸：没有「不」用 both（Both books are good）；有「不」的时候，队首换 neither（Neither book is good）——看队首那个词有没有「不」。 |
| **对比卡 6 条方向** | ① L148 回流：`*Both book is good.` ② L149 回流：`*Both books are not good.` ③ L149 回流：`*Neither books are good.` ④ L149 回流：`*Neither book is not good.` ⑤ **双正解卡**：`Both books are good.` ←→ `Neither book is good.`（**两张脸排一行**）⑥ **双正解卡**：`We are happy.`（**L07**）或 `I ate two sandwiches.`（**L11**）（**「两个」的老朋友**） |
| **变体三态** | 肯定 `Both books are good.`／否定 `Neither book is good.`／疑问 `Are both books good?`（**照 L147 `:27720-27723` 成例：收口课三态＝前两课各一张脸 ＋ 疑问**——实读逐字 `肯定 en: "I like tea too."` ／ `否定 en: "I don't like coffee either."` ／ `疑问 en: "Do you like tea too?"`） |
| **复现取材建议** | practice 4 题：**2 题本课两张脸 ＋ 1 题疑问 ＋ 1 题跨课复现**。**⚠️ 注意 `grammarLessons.test.ts:154-161` 断言：≥4 题的练习里**最多 3 题**重复 `examples`**——**收口课的 examples 通常就是本课两张脸，故第 4 题必须来自别的课** |
| **案件设计建议** | 收口案（**照 `hunt-close-22`／`hunt-close-23`／`hunt-close-24` 成例**，`huntCases.ts:8491` 区段）。**案号 159**，`huntCaseIds: ["hunt-close-25"]` |

### 5.4 三课的 `variants` 三态与库内惯例核对

〔实读〕**库内 `variants` 的 label 组合分布**：`肯定/否定/疑问` **146 课** ／ `肯定/否定/提议（第二种）` 1 课。**→ 三课均按 `肯定/否定/疑问` 三态给，符合 146/147 的主流惯例。**

**⚠️ 一处须主理人裁**：**§5.1 与 §5.2 建议「L148 不给否定态、L149 不给肯定态」**——这与 146 课的「三态齐全」惯例**不一致**。**变通做法（推荐）**：**仍给三态，但把「不给」的那一态写成指向另一课的说明卡**（L148 的否定态写 `I don't like coffee.` ＋ noteZh「下一课看队首换哪个词」；L149 的肯定态写 `Both books are good.` ＋ noteZh「第 148 课——没有「不」，用 both」）。**→ 既有三态、又不抢下一课的增量，且与 L145 `:27334`／L146 `:27527` 的成例逐字同型。**

### 5.5 本批明确**不做**的增量（留给后续批次）

| 增量 | 为什么不做 | 实读 |
|---|---|---|
| `nor`／`neither … nor` 倒装 | **本批只造 2 词即可，加 `nor` 要多造 1 词且引入倒装（超纲）** | Cambridge `neither` 页有 `Neither … nor` 节含**主语-动词倒装注记**；Murphy 初级 U82 无 `nor` 独立位 |
| `both of`／`neither of`／`either of` | **`of` 版是中级 U89 那一层**，本批只做初级 U82 层 | **实测 `both of` GL 0／HC 0；`either of` 0；`neither of` 0** |
| `are both`（`both` 站 be 之后） | **同课并存两种位置会混淆**（§3.1 B4） | Cambridge `both` typical errors ② 讲的是这一层 |
| 倒装应答 `so am I`／`neither do I` | **三个零 ＋ 属初级 U42 另一格** | **实测 `so am I` 0／`neither do I` 0／`me too` 0** |

### 5.6 档位诚实标注：B−（不得写成 A 或 B）

| 项 | 本批 | 对照 |
|---|---|---|
| **新造词** | **2 个**：`both`（**GL 0／HC 0**）＋`neither`（**GL 0／HC 0**） | 批二十四：1 个；批二十：3 个（历史最高） |
| **场景侧造词** | **0 个**（`book` 434／`books` 54／`good` 303／`desk` 112／`are` 641／`is` 2402 全在库） | — |
| **机制复用** | **1 处**：「有『不』就换个词」（L83 首次 → L146 第二次 → **本批第三次，但在队首**） | 批二十四：1 处（同一机制的第二次） |
| **须自建规则表述** | **1 处**：`Neither book is good.` 这一形态**在 Cambridge `neither` 页里没有直接对应句**（页内全是 `of` 版／倒装版／应答版），**须从 `neither of them is good` 反推** | 批二十四：0 处 |
| **cloze 友好度** | **✅ 好**（趁热练 35.8%–52.0%；关 2 **结构性假友好**） | 批二十四：26.0%／批二十三：16.5–27.0% |
| **上游课程位** | **✅ 双册两格**（初级 U82 ＋ 中级 U89），**本批只用初级层** | 批二十：**0 格**（造词课） |
| **结论** | **B−｜2 词必造 ＋ 机制第三次应用 ＋ 须自建一条规则表述 ＋ cloze 友好** | — |

**为什么是 B− 而不是 B**：**批二十四（B）是「1 词必造 ＋ 双认读升格 ＋ 老规矩第二次应用」**；**本批是「2 词必造 ＋ 老规矩第三次应用 ＋ 须自建一条规则表述」**——**造词多 1 个、无认读升格位、且第三次应用**，**但 cloze 更友好、上游课程位更厚**。**→ 与批二十四同档或略低，定为 B− 更诚实**。**若主理人认为「2 词仍在历史先例内、上游双册课程位是加分项」，可上调为 B**——**但这须主理人裁**。

### 5.7 展示层随批清单（照批二十四 §2 成例）

| 项 | 值 | 校验 |
|---|---|---|
| **season-25** | `{ id: "season-25", label: "第二十五季 · 两个的脸", hint: "两本都好、两本都不好——同一个「两个」，看队首那个词有没有「不」", min: 148, max: 150 }` | `season-25` 无命中 ✅；**`grammarSeasons.test.ts` 守门须同步**（**⚠️ 硬护栏：课程号不落在任何区间会被路径页静默过滤**，实读 `grammarSeasons.ts:5-7` 逐字） |
| **里程碑** | `can-do-m27`，`afterLesson: 150` | `can-do-m27` **当前不存在**（实读 `GrammarPathPage.tsx:242-298` 只有 m1–m26） ✅ |
| **封面** | **⚠️ 见 §5.8** | — |
| **episode** | 「小美的一天 一百四十八／一百四十九／一百五十」 | 惯例照批二十四 |

### 5.8 ⚠️ 封面池：本批撞上「单用池耗尽」的硬墙

〔实读〕**本轮实测封面池状态**：
```
src/assets/lessons/*.jpg           = 117 个文件（lesson-1.jpg … lesson-117.jpg）
grammarLessons.ts 里 cover 引用    = 147 处，涉及 117 个不同 cover
单用（用过 1 次）= 87 张 ；二用（用过 2 次）= 30 张
cover118 / cover119 …… 不存在（import 最大为 cover117）
二用池 = cover1 … cover30（正好是 L1–L30 那批）
```

**→ 批二十四 §附录 A 已登记「封面二用池长期耗尽」，本轮实测确认**：
- **单用池 87 张仍够**（**最低未用的单用张是 cover31**），**但本批若取 cover31／32／33，会把单用池从 87 降到 84**。
- **二用池已正好 30 张（cover1–30），本批三课若都取二用，会把 cover28／29／30 推到三用**（**⚠️「三用」策略尚未被任何批次确立，实测当前最大使用次数＝2**）。
- **→ 须主理人先裁**：**① 取 cover31–33（单用池 → 84）**；**② 取 cover28–30 走「三用」（二用池 → 三用池，新增先例）**；**③ 新增封面资源**。**本轮推荐 ①**（代价最小、不新立先例）。**这是本批的 P0 前置项，不是可选项。**

---

## §6 与已教内容的切分

### 6.1 最接近的三课（按距离排序）

| 序 | 课 | 距离 | 切分方式 |
|---|---|---|---|
| **1** | **L146 `I don't like coffee either.`**（批二十四，`lesson-146-not-either`） | **最近**：**同一条机制（有「不」就换个词）** | **切开点＝位置**：L146 换的是**句尾**（`too`→`either`），本批换的是**队首**（`both`→`neither`）。**L149 contrast ⑤⑥ 两张双正解卡把这条并排摆出来**（`I don't like coffee either.` ＋ `Neither book is good.`）——**同一机制、两个位置，一眼看出区别** |
| **2** | **L11 `I ate two sandwiches.`**（`lesson-11-plural`） | **近**：**「两个」这个数＋「带上 s」** | **切开点＝教的动作**：L11 教的是**「两个以上加 s」这个尾巴**（`:1964` 逐字 `oneLineRule: "两个以上要加 s。…"`）；**本批不教 s（已会），教的是队首那个词**。**L148 practice 用 `I ate two sandwiches.` 做复现**（实测复用 2 课／余量 4） |
| **3** | **L26 `There be` ＋ L114 `a few apples`** | **中**：**「有好几个东西」这个骨架** | **切开点＝说什么**：L26／L114 说的是**「有没有／有几个」**；本批说的是**「这两个一起怎么样」**。**L148 对比卡②用 `is`→`are` 回流 L26**（`:4749` 逐字 `whyZh: "一只猫是一个，用 There is。are 只配两个以上的东西。"`）；**L114 的「果盘」场景本批不用** |

### 6.2 与批二十四的切分（这是本批最关键的一条）

**共享机制**：「有『不』就换个词」

| 批 | 应用 | 位置 | 换的词 | 实读依据 |
|---|---|---|---|---|
| **L83**（首次） | `something` → `anything` | **词本身** | `something`→`anything` | `:15398` 逐字 `oneLineRule: "说不清或者先不说是什么，用 something；问句和「不 / 没」里换成 anything——第 30 课 some/any 的老规矩。"` |
| **L146**（第二次） | `too` → `either` | **句尾** | `too`→`either` | `:27473` 逐字 `oneLineRule: "说「也不」：too 让位，either 上，还是站句尾…"` |
| **L149**（第三次） | `both` → `neither` | **队首** | `both`→`neither` | 本批 |

**→ 三条切开动作（写进 PRD §脊柱）**：
1. **位置明写**：L149 的 `oneLineRule` 必须逐字点出「**队首换人**」，与 L146 的「**句尾换词**」形成对照。**建议 L149 的 `contrast` 第 ⑥ 条就是 L146 那句**（双正解卡），**whyZh 逐字写「第 146 课换的是句尾，今天换的是队首」**。
2. **课量不同**：批二十四是 1 词 3 课；本批是 2 词 3 课（**L148 立 `both`／L149 立 `neither`＋切开／L150 收口**）——**结构与批二十四同型（立岗／切开／收口），故惯例一致、认知成本低** ✅
3. **⚠️ 位置感不要连着说了两遍**：批二十四 §0.2② 曾担心「两个句尾小词连着做观感重复」。**本批的 `both` 在队首，正好在位置的另一头**——**两批连着做，位置教学是「一头一尾」，不是重复** ✅ **这一点建议写进 PRD 作为本批的独立性证明。**

### 6.3 与 L06「同一个 look 两张脸」／批二十四「两张脸」的命名冲突 ⚠️

〔实读〕**库内「两张脸」字样共 86 处**、「一张脸」26 处、「四张脸」15 处、「五张脸」6 处、「三张脸」2 处——**「X 张脸」是本库最主力的自建术语**。

**⚠️ 命名冲突**：
- **L141（批二十二收口）`grammarLabel` 逐字 `"收口 · 零新知（两张脸排一行）"`**
- **L147（批二十四收口）`grammarLabel` 逐字 `"收口 · 零新知（也的两张脸）"`**
- **批二十四 §7 D0 决策记录逐字**：`L147 grammarLabel 改用「也的两张脸」`／**理由逐字「避开与 L141 完全同名」**

**→ 本批 L150 的 `grammarLabel` 应沿用这条惯例**：**`"收口 · 零新知（两个的脸）"`**（**不写「两张脸」以免与 L141 同名；字数与 L147 的「也的两张脸」同型**）。**§5.3 已按此写。**

---

## §7 对「`though` 旧判例冲突」的独立判定（本批最关键判定）

### 7.1 逐字读 L139 `:26185-26200`（本报告逐行引，行号为 `grammarLessons.ts` 原文件行号）

```
:26186     deepDive: {
:26187       title: "这一句，案件里你判过",
:26188       paragraphs: [
:26189         "第 12 课你判过一句「Though it was cold, but we went out.」——当时你找出了那个多余的 but，把它划掉了。今天它转正了：这个「虽然」怎么说、怎么说才不错，今天正经学。",
:26190         "记住那条判例的重点：错的是多出来的 but，不是 Though 本身。「虽然天冷」那半句是好的，问题出在后面又补了一个「但是」。中文成对说，英语只留一个。",
:26191         "Although 的位置很特别：它站最前面，领着一整个小句子——Although it is raining（虽然下着雨），后面再接住「我还是要出去」。第 19 课的 but 不一样：but 站中间，把两半接起来。下一课把这两张脸摆一起看。",
:26192         "场景也是接着第 109 课那场雨的：那回小美在屋檐下一直等，等到雨停（I waited until the rain stopped.）；这回她不等了，撑着伞就出去——Although it is raining, I will go out."
:26193       ]
:26194     },
```

**L141 `:26573-26582`**：

```
:26573     deepDive: {
:26574       title: "这一页上有什么",
:26575       paragraphs: [
:26576         "这一章学了两张脸。第 139 课的 Although 站最前面，领着一整个小句子，后面点个逗号——Although it is raining, I will go out.；第 140 课的 but 站中间，把两半接起来——It is raining, but I will go out.",
:26577         "这两张脸还有一个来头：第 12 课你在案件里判过一句「Though it was cold, but we went out.」，当时你划掉了那个多余的 but。这一章就是那句话的正经课——错的是多出来的 but，不是「虽然」本身。",
:26578         "规矩只有一条：中文的「虽然…但是…」成对说，英语只留一个。前面用了 Although，后面就不带 but；想让 but 出场，前面就别放 Although。",
:26579         "两张脸排一行念一遍：Although it is raining, I will go out.／It is raining, but I will go out.——同一个意思，两种站法，你都拿到了。"
:26580       ]
:26581     },
```

### 7.2 判定：**两句宣布的是「`although`／『虽然』这个概念已教过」，不是「`though` 这个词已教过」**

**理由四条（全部落在逐字上）**：

**① `:26190` 明文把 `Though` 与「问题」切开——「不是 Though 本身」。**
逐字：「**错的是多出来的 but，不是 Though 本身。「虽然天冷」那半句是好的**」。
**→ 「不是 Though 本身」这句的作用是「给 Though 平反」**（说明 Though 不背锅），**但它同时隐含「Though 这个词本身还没被正式讲过」**——**因为如果它已被讲过，就不需要在这里特意平反**。**⚠️ 但这条论据是双刃的**：辩护式表述（「不是 X 本身」）在文案上也可以是「X 已处理过、只是别怪它」。**故 ① 单独不足以定论。**

**② `:26577` 的指代是「那句话」不是「那个词」。**
逐字：「**这一章就是那句话的正经课**」——**指的是「那句话」（`Though it was cold, but we went out.` 这个判例）**。**「正经课」的宾语是「那句话」，即「那个『虽然…但是…』的错法」。**
**→ 若作者想宣布「`though` 这个词已教」，正常写法是「这一章就是 Though 的正经课」**——**但作者写的是「那句话」，且后接 `——错的是多出来的 but，不是「虽然」本身`，把话题落回 `but` 的位置**。**故 ② 支持「宣布的是概念」。**

**③ ★ 决定性证据：L139 全课实际上只教了 `Although`，一次都没教 `though`。**
〔实读〕**`:26123` 逐字 `oneLineRule: "说「虽然…」用 Although 站最前面领一整句：Although it is raining, I will go out——中文的「虽然…但是…」成对说，英语只留一个。"`**——**规则句里是 `Although`**。
〔实读〕**`although` 在 L139–L141 三课合计 174 处（L139 70／L140 52／L141 52）**，而 **`though` 在三课合计只有 3 处**，**且 3 处全部在深挖卡的引文里**（`:26189`／`:26190`／`:26577`）。
**→ 「转正」这个动作的对象，在 L139 的规则层、例句层、练习层、对比层里出现的词是 `Although`，不是 `Though`。3 次 `though` 全是**引述他人（案件）的原句**，不是**作者在教这个字**。**这是本判定最硬的一条。**

**④ ★ 成例佐证：库内「转正」这个说法出现过 7 次，其中 3 次是「认读位→正式课」的同一动作。**
〔实读〕搜「今天它转正了」共 **7 处**，例：
- `:17175`（L92）逐字「**第 78 课你见过 When it is sunny, I run in the park（当时只是认读）——今天它转正了：会自己说，还会分清两班岗。**」
- `:25220`（L134）逐字「**第 133 课你见过 I am looking forward to the weekend.（当时只是认读、混个脸熟）——今天它转正了：会自己说，还知道三个字要一起记。**」
- `:27346`（L145）逐字「**第一次见它是第 43 课：你拼过一句 Drawing is fun too.（画画也很好玩）。当时只是「换个主角再拼一遍」，没细说那个 too。今天它转正了。**」

**→ 成例的共同结构是「**第 X 课你见过/拼过/认读过 [某个句子]（当时只是认读）——今天它转正了**」**。**在 L139 `:26189` 里，这个结构被套用在「第 12 课你判过一句 [引文]」上**——**「它」指的是「那个判例里的『虽然』这件事」**，**因为下一句立刻限定「这个『虽然』怎么说、怎么说才不错」**（**宾语是「这个『虽然』」，不是「这个词」**）。

### 7.3 结论：**批二十五若开一课讲 `though`，不会「自相矛盾」，但会「观感重复」**

| 问 | 答 |
|---|---|
| 两句是「宣布 `though` 已教过」还是「宣布 `although`／『虽然』概念已教过」？ | **后者**。**逐字证据：`although` 174 处 vs `though` 3 处（全在引文）；规则句用 `Although`；`:26577` 的宾语是「那句话」。** |
| 若批二十五开一课讲 `though`，会自相矛盾吗？ | **不会构成逻辑矛盾**（**没有一句话说「`though` 这个词教过了」**）。**但会构成观感重复**：**L139 `:26189` 说「今天它转正了」，批二十五若再说「今天我们学 `though`」，两处「今天」叠在同一件事上**——**且两课都用 `Though it was cold, but we went out.` 这句引文**。 |
| → 处置建议 | **批二十五若要开轴 A，前置项＝改 L139／L141 的指代口径**（把「它」明确为「这个『虽然』」／把 `though` 引文改成 `although` 引文或加一句「那个字我们以后单独说」）。**这是「改已交付文案」，属回溯编辑，须主理人裁**（批二十四 §6 携带项 1 已把它列为「批二十五前置项，最高优先」——**本报告确认该项有效**）。 |

### 7.4 ⚠️ 但§7 的判定**不构成本批取轴 A 的理由**（重要）

**必须说清**：**§7 只是把「冲突」从「正面矛盾」降为「观感重复」，并没有让轴 A 变成可做**。**轴 A 仍有 §2.3 的三条仍未解的成本问题**（句尾撞车 ✅仍成立／`unless` 第三次应用 ✅仍成立且数字更硬／`in case` 零垫子 ✅仍成立）**＋§2.4 的两条新问题**（`even` 全零／`even if` 只有 C1 位）。

**→ 本轮净判定：轴 A 从「四条硬理由」变为「三条硬理由 ＋ 一条须先改文案 ＋ 两条新增结构问题」——成本没有下降，反而更清楚了。建议继续押后，并把「改 L139／L141 指代口径」立为轴 A 开工的 P0 前置项（不是本批任务）。**

---

## §8 未核实项

| # | 项 | 为什么未核实 | 影响 |
|---|---|---|---|
| **1** | **中文侧「两个都／两个都不」的专文与 ✗ 清单** | **本轮未取到**（批二十三／二十四的 Cambridge 与中文侧缓存里没有「两个都」义的独立 ✗ 清单；`/tmp` 下相关缓存只有 `c23_both.txt` 等词典页） | **§3.1 的 B1–B6 六条错句里，B1／B6 有上游明文（Cambridge `both` typical errors ＋ 中文侧双重否定 ✗）；B3／B4／B5 三条是〔推断〕＋上游规则页旁证**。**若主理人要求 B3–B5 也要上游明文，须补取中文侧专文** |
| **2** | **`bags` 的 GL 真零（0）但 HC 8** | **未核 HC 的 8 处具体语境**（是否教学句／是否注释） | **§4.2 场景池 C 的「两个包」方案若被选中，须先核这 8 处**。**推荐方案（两本书）不受影响** |
| **3** | **`Neither book is good.` 形态的上游直接对应句** | **Cambridge `neither` 页内全是 `of` 版／倒装版／应答版**（§1.3 逐字），**无「无 `of` 的 `neither + 单数名词`」直接例句** | **§5.6 已列为「须自建规则表述 1 处」**——**这是本批的诚实折扣，不是阻塞项** |
| **4** | **`neither` 的两种发音取舍** | **库内无音频教学动作，本轮不处理** | 无（登记备查） |
| **5** | **`both` 作 PRONOUN（`Both are good.`）与作 DETERMINER（`Both books are good.`）在我方的分层** | **本轮只给出「两种都可用」的实测（cloze 52.0% vs 35.8%），未做教学分层研究** | **§5.1 采用 DETERMINER 形态（`Both books are good.`）作目标句，`Both are good.` 只在 cloze 建议里出现**——**若主理人认为应先教 PRONOUN 形态（更短），须重排 §5.1** |
| **6** | **封面池的三用策略** | **需要产品决策，不是研究结论** | **§5.8，P0 前置项** |
| **7** | **L148–L150 交付后 `practice` 复现预算的余量** | **本轮只实测了候选句的当前占用（§5.1／§5.2 逐句给余量），未做「交付后全库重算」** | **建议数析在交付走查时重跑；`grammarLessons.test.ts:163-177` 断言只在 >6 时报警，不显示余量（批二十四 §7 序 7 已登记同一项）** |
| **8** | **「一…就…」批（L142–L144）建立的时间家族收口与 `both` 的语序交互** | **本轮未研究**（`when`／`as soon as` 与 `both` 的共现） | 低（本批三课不含时间小句） |
| **9** | **§3.1 B4 的 `are both` 形态是否该同课给** | **需教学决策** | **§5.5 已明确不做**；若主理人认为须给，L148 的 `contrast` 第 ④ 条可改成这一组（代价：同课两位置并存） |

---

## 附录 A：raw 实测留痕（本轮全部命令的等价复现）

```
# ① 轴 A／轴 B 全部候选词（两法互校，结果一致）
node -e '... 正则 (^|[^A-Za-z])w([^A-Za-z]|$) 与 (?<![A-Za-z])w(?![A-Za-z]) ...'
  GL: both 0 / neither 0 / nor 0 / either 87 / too 300-301 / though 3 / although 174
      even 0 / unless 0 / case 0 / despite 0 / spite 0 / in case 0 / even though 0 / in spite of 0
      still 1 / whether 0
  HC: both 0 / neither 0 / nor 0 / either 10 / too 31-32 / though 2 / although 14
      even 0 / unless 0 / case 1 / despite 0 / spite 0 / in case 0 / even though 0 / in spite of 0

# ② 按课归属（行号→课 id 映射，147 课全部命中）
though     -> L139 :26189 / L141 :26577 / L139 :26190     （GL 3，全引文）
either     -> L146 49 处 / L147 38 处                       （GL 87，全在批二十四）
although   -> L139 70 / L140 52 / L141 52                   （GL 174，全在批二十二）
bothRight  -> 324 行（字段名，非词次）；裸 "both" 行 324 处，distinct 形态只有 ["bothRight"]

# ③ ❌will 规则按课分布（本批新测）
正则 /if 里不用 will|if 里说现在|不带 will|不用 will|不请 will/ 按课归属：
  L47(1) L48(15) L49(6) L109(1) L142(7) L143(4) L144(2)

# ④ 零雨线复核（本批新测）
rain 12 课 / rains 8 / raining 11 / rainy 3 / stops 2 / stopped 3 / the movie 1 / ends 1 / ended 1 / umbrella 8
→ L142+ 段全部 0 命中 ✅ 纪律干净

# ⑤ practice 复用预算（归一化去标点后按课去重）
余量 0（已满，禁用）：i am happy (6 课)
余量 1：there is a book on the desk (5 课)
余量 3：i like tea too (3) / i am used to getting up early (5→实为 5 课) / it is cold today (3) / there are a few apples (3) / i have got a new bike (3)
余量 4：i ate two sandwiches (2) / there are some apples on the table (2) / i have a new bag (2)
余量 5：we are happy (1) / these are the books which I like (1) / i have a red cup (1) / this is the book which I read (1)
0 课（未用过）：i like apples / they are good / the book is good / my hands are clean / both books are good / neither book is good / the books are new / two books are good

# ⑥ cloze 落点（复刻 buildCloze，400 种子）
Both books are good.    | Both 35.8% good 33.5% books 30.8%
Neither book is good.   | Neither 35.8% good 33.5% book 30.8%
Both are good.          | Both 52.0% good 48.0%
Neither is good.        | Neither 52.0% good 48.0%
Are both books good?    | both 35.8% good 33.5% books 30.8%

# ⑦ 关 2 落点（复刻 pickClozeWord）
Both books are good.   -> are   (Both books ___ good.)   ← 考点逃过（both 不在 GRAMMAR_WORDS）
Neither book is good.  -> is    (Neither book ___ good.) ← 同上
I like both.           -> like  (I ___ both.)
GRAMMAR_WORDS.test("both")/"neither"/"nor" -> false / false / false

# ⑧ 封面池
src/assets/lessons/*.jpg = 117；cover 引用 147 处 / distinct 117
单用 87 张（最低 cover31）；二用 30 张（cover1–cover30）；cover118+ 不存在

# ⑨ id 可用性
lesson-148/149/150/151 = 无命中 ✅ ｜ season-25 = 无命中 ✅
case number 157/158/159/160 = 无命中 ✅ ｜ can-do-m27 = 不存在 ✅

# ⑩ 测试基线
npx vitest run -> Test Files 61 passed (61) / Tests 800 passed (800), 6.82s
```

---

## 附录 B：上游原件逐字复核（`/tmp`）

```
murphy_ess_norm.txt（13966 字符）
  82botheitherneither  ✅ 逐字命中（初级 U82）
  42too/eithersoamI/neitherdoIetc.  ✅（初级 U42，本批不碰）
  上接 81allmostsomeanyno/none ，下接 83alotmuchmany

murphy_int_norm.txt（11016 字符）
  89both/bothofneither/neitherofeither/eitherof  ✅ 逐字命中（中级 U89）
  上接 88all/allofmost/mostofno/noneofetc. ，下接 90alleverywhole
  113althoughthougheventhoughinspiteofdespite / 114incase / 115unlessaslongasprovided  ✅（轴 A，本批不做）
  evenif  无命中 ✅（「即使」只有 C1 位）

c23_both.txt（Cambridge 词典页，批二十三缓存）
  "We don't use both with a negative verb; we use either instead"  ✅ 逐字
  "When we use the verb be as a main verb, both comes after the verb"  ✅ 逐字
  A1  ✅；c23_neither.txt: 主义 B2，neither … nor B2，两条音标 /ˈnaɪ.ðə/ 与 /ˈniː.ðə/  ✅
  c23_either.txt: B1（adverb 义）"used in negative sentences instead of also or too"  ✅
```

---

> 本研究报告由产品战略团队瑞思执笔，经主理人汇编落盘。重要决策请由产品负责人审定。

---

## 附录 C：零术语红线自查（本报告的范围声明）

**⚠️ 先说清口径**：**零术语红线约束的是「面向学习者的文案」**（实读 `grammarLessons.test.ts:196-222` 断言的对象是 `contrast.whyZh`／`guided.explain`／`recall.noteZh` 三个字段；`deepDive` **有意保留术语、不在断言范围**——测试注释逐字「deepDive 术语是有意保留的（进阶内容），不在本断言范围（待产品负责人拍板是否豁免）」）。

**本报告作为研究文档，本体不受红线约束**（报告里出现「主语」「复数」等词是在**分析层**使用，不是交给学习者的文案）。**但本报告给出的所有「学习者可见文案建议」已逐条自查**：

| 自查对象 | 结果 |
|---|---|
| §5.1／§5.2／§5.3 三条 `**一句话规则**`（逐字提案，是面向学习者的首屏文案） | **✅ 三条全部零术语**（脚本逐条扫描 29 词，全 0 命中） |
| §5 各课的 `blocks.role`（逐字提案，面向学习者） | **✅ 零术语**（「两本都好（两个都——both 站最前面）」「两本书都不（both 让位，neither 上）」等，全 0 命中） |
| §5 各课的 `contrast.whyZh` 方向描述（非逐字提案，是方向） | **✅ 用的都是自建术语**：「队首」「队尾」「让位」「老规矩」「带上 s」「有『不』就换个词」「两张脸」——**这些均在库内有先例**（实读：「让位」3 处全在 L146／「老规矩」109 处／「带上 s」33 处／「两张脸」86 处／「排一行」44 处） |
| **⚠️ 报告正文中出现的 29 词**（逐字统计：`主语` 3／`宾语` 3／`单数` 3／`复数` 5／`三单` 1／`语序` 1／`否定句` 1／`副词` 1，**合计 18 处**） | **全部位于分析层**：如 `:65`「中文的『都』是一个总括副词」（**语言学描述，非课文文案**）／`:93`「主语-动词倒装注记」（**引述 Cambridge 原文的翻译**）／`:546`「无 `of` 的 `neither + 单数名词`」（**描述形态**）。**→ 这些词不进任何课注字段，不构成越线** |

**⚠️ 一处须提醒生产**：**「队首」这个词在本库无先例**（实读：`队首` GL **0** ／ `队尾` GL **0**）。**§5 的规则提案用了「队首」**——**这是自建术语的新词**，**须主理人裁**（备选：**「最前面」**——实测「站最前面」在库 **36 处**，**是更稳的现成说法**）。**→ 建议把 §5 全部「队首」改为「最前面」，把「队尾」改为「句尾」**（「站句尾」在库 **25 处**、批二十四刚用过）。**这一条是本报告在文案层唯一的新造术语风险，须显式交代。**
