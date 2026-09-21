# 用户研究综合报告 · 第二十四批（「也」的两张脸：`too`／`either` —— L145–L147 · 3 课）
> **选题一句话**：**从 `either`／`neither`／`both`「三连体」候选里，只取「也」这一条轴**（`too`／`either`），**不取「两者」那条轴**（`both`／`neither`）——**理由见 §0.4**：前者**只造 1 词、库内有 6 个现成种子**；后者**要造 3–4 词、库内零底座**。
**日期**：2026-09-20 ｜ **类型**：用户研究（批二十四选题）｜ **成员**：瑞思
**方法**：本轮**不采信任何转述**，全部结论由下列实读产生。

- **实读源文件（9 个）**：`src/data/grammarLessons.ts`（**27264 行**／**144 课**）／`src/data/huntCases.ts`（**8445 行**／**153 案**）／`src/data/grammarSeasons.ts`（**69 行**，season-1–season-23）／`src/data/grammarZeroTerms.ts`（**32 行**，词表**实际 29 个术语**）／`src/data/grammarLessons.test.ts`（内容红线原文）／`src/data/grammarSeasons.test.ts`（季区间守门）／`src/services/huntService.test.ts`（案件结构守门）／`src/services/grammarAmbushService.ts`（`GRAMMAR_WORDS` 表 `:160-193`）／`src/services/grammarBoostService.ts`（`keywordIndexes`／`buildCloze` `:221-437`）。
- **统计方法**：自建**状态机字符串扫描器**（`/tmp/ruisi24/scan2.py`）——逐字符走查 TS 源码，**跳过 `//` 行注释与 `/* */` 块注释**，提取 `"…"`／`'…'`／`` `…` `` 三类字面量并**保留起始行号**；再用行号边界把字面量**归属到具体课**（实测 `lessons=144 cases=153` **全部命中**）。
- **词次口径**：**词次 ＝ 字面量内的整词命中数**（`(?<![A-Za-z])w(?![A-Za-z])`），**已剔除 `id` 串假阳性**（`is_idlike` 过滤，如 `lesson-65-as-as` 这类连字符串）。**注释内的命中不计**。裸 grep 与扫描器口径并列给出。
- **实跑测试**：`npx vitest run` → **Test Files 61 passed (61) ／ Tests 800 passed (800)**，Duration 7.01s（**与批二十三交付后基线 800 一致，干净**）。
- **独立复刻实跑**：本轮**独立复刻** `grammarBoostService` 的 `hashText`＋`mulberry32`＋`keywordIndexes`＋`buildCloze`（`/tmp/ruisi24/cloze.mjs`／`cloze2.mjs`／`cloze3.mjs`／`cloze4.mjs`），对 **37 次候选句循环、去重后 28 个不同句子各跑 200 种子**（四个脚本分别 7／12／8／10 句），实测 cloze 落点分布；另**独立复刻** `grammarAmbushService` 的 `pickClozeWord` 三级回退，实测关 2 落点。
- **独立复核上游本机原件**：`/tmp/murphy_int_norm.txt`（中级 TOC 归一化，**11016 字符**）与 `/tmp/murphy_ess_norm.txt`（初级 TOC，**13966 字符**）**逐字 grep 复核**（§2.6）；Cambridge 侧本轮**实取 8 次、成功 7 次**：语法页 **6 页**（`although-or-though`／`either`／`in case`／`both`／`also-as-well-or-too`／`unless`）＋ 词典页 **2 次**（`dictionary/english/unless` ✅ 标 **B1**／`dictionary/english/in-case` ✗ **返回 `referee` 条目**，见 §6①）。

---

## 0. 结论先行

### 推荐方案：做「`too`／`either` 的『也』家」**3 课小章 · L145–L147**（档位 **B**，诚实标注见 §3.6）

**核心理由一句话**：**批二十四候选池里唯一「零造词 ＋ 有现成课程位级接口 ＋ 能撑起 3 课且第 3 课有真实增量」的一项**——而且它**不是批二十三判过的那三个备选中的任何一个**，是本轮在词架实读中**新发现的一个系统性空白**（详见 §0.1）。

### 0.1 本轮最重要的发现（三条，全部由实读产生）

1. **★ 库里已经有一整套「也」的种子，但从来没有一课把「也」立过岗。**
   - **`too`（句尾＝也）在库共 6 个独立句子位 ＋ 2 处说明文字，全部埋在别的课的边角里**：
     - `grammarLessons.ts:1974`（**L11 对话 NPC 行**）逐字 `Two? I want one too!`（中文逐字「两个？**我也要一个**！」）
     - `grammarLessons.ts:4537`（**L25 对话 NPC 行**）逐字 `Does he play sports too?`
     - `grammarLessons.ts:7947-7948`（**L43 `guided` 认读位**）逐字 `tokens: ["Drawing","is","fun","too."]` ／ `answer: "Drawing is fun too."`
     - `grammarLessons.ts:9347`（**L51 `examples`**）逐字 `The desks were cleaned too.`（中文「桌子**也被**擦了」）＋ `:9402`（**L51 `sceneSwings`**）同一句
     - `grammarLessons.ts:10106`（**L55 对话 NPC 行**）逐字 `Tom and Amy are on the board, too.`
     - `grammarLessons.ts:18251`（**L98 对话 NPC 行**）逐字 `Was he reading, too?`
   - **`too` 的「也」义被 L66 逐字点名过，但只用作「同一个字两张脸」的配角**：`grammarLessons.ts:12241` 逐字「**too 还有一个老身份「也」：站在句子尾巴上——I like tea too（我也喜欢茶）。两个身份看站位：句尾是「也」，词前是「太」。**」＋ `:12251` `summary.points` 逐字「**too 两身份：词前是「太」、句尾是「也」**」。
   - **但 `too` 的这一面从未被教、从未被考、从未有课**：**全库 144 课的 `targetSentence` 里没有一个以 `too` 收尾**（实读：`targetSentence` 含 `too` 的**唯一一课是 L66**，而它是 `It is too heavy to carry.`——「太」，不是「也」）。**认读位 1 个（L43）＋ NPC 台词 4 处 ＋ 例卡 1 处，合计 6 个只读不考的位**。
   - **→ 这是全库第七例「先认读、后立岗」**（前六例：L127 `It looks like rain.`→感官章／L133 种子→批二十一／L109 `as`→L142／案 #7 `Though…but`→L139／L32 风句→L66／L33 `Someone left them here.`→L84，**全部由本报告本轮实读复核**）。

2. **★ 中文侧「也」是零基础第一周就要用的表达，而我方 `either`／`neither`／`both` 三词在库合计 0 处**〔实读〕：
   | 词 | GL 词次 | HC 词次 | `grep -c` 裸计数 | 说明 |
   |---|---|---|---|---|
   | `either` | **0** | **0** | **0** | **字母序列级真零** |
   | `neither` | **0** | **0** | **0** | 真零 |
   | `both` | **0** | **0** | **0** | **⚠️ 裸 grep "both" 命中 316 处，全部是字段名 `bothRight`**（实读：`grep -c "bothRight"` ＝ **316**，`grep -oE "[^A-Za-z]both[^A-Za-z]"` ＝ **0**）——**与批二十二记的「300 次全是字段名」结论一致，本轮按引号内字面量口径复算仍为 0** |
   | `nor` | **0** | **0** | **0** | 真零 |
   | `so am I`／`neither do I` | **0** | **0** | — | 真零（倒装应答，本批不碰，见 §2.5） |
   - **同时 `I don't like coffee.` 的中文释义在库已有**：`grammarLessons.ts:925`（**L5 `variants` 否定卡**）逐字 `{ label: "否定", en: "I don't like coffee.", zh: "我不喜欢咖啡。", noteZh: "不喜欢 = don't like。" }`——**注意中文只有「不喜欢」，没有「也不」**。**这就是缺口所在：库里有「不」，有句尾的「也」，但没有「也不」的合体。**

3. **★ `too`（句尾＝也）与 `either`（否定句尾）在**中文侧是同一个字「也」**，而英语是两张脸——这是本批的真正独立增量。**
   - Cambridge 语法页 **`also, as well or too`**（本轮实取）逐字：**"We use either not also, as well or too to connect two negative ideas"** ＋ 标错例 **"I don't think Dave is also/as well/too."**
   - 同页逐字：**"We usually put too in end position"**／**"Too can occur immediately after the subject, if it refers directly to the subject."**／**"It does not normally occur after a modal or auxiliary verb."**（错例 `We have too been very pleased …`）
   - 同页逐字：**"In short answers in informal situations, we normally say me too, not I too"**
   - **→ 「肯定句尾用 too／否定句尾用 either」是跨源明文，且我方两词都已在库（`too` 有 6 个位现成、`either` 是 0 但要造）**——**这是本批唯一一条「上游规则硬 ＋ 我方种子现成」的组合**。

### 0.2 为什么不做「让步与条件链」（竞析本轮判的唯一 A 档）

**⚠️ 这是本报告与竞析报告的一处明确分歧，必须明写。**

竞析 `competitive-analysis-grammar-twenty-fourth-batch-2026-09-20.md` §0/§1.4/§8 判 **`though`／`even though`／`unless`／`in case` 四词链为 A 档、建议 3 课**。**本报告独立复核后判：该项应降为 B−，且本轮不宜做**。**四条实读理由**：

1. **`though` 不是零——它已经在 L139／L141 的 `deepDive` 里出现过 3 次，且全部是「引述旧判例」**〔实读〕：`grammarLessons.ts:26189` 逐字「**第 12 课你判过一句「Though it was cold, but we went out.」**」／`:26190` 逐字「**错的是多出来的 but，不是 Though 本身**」／`:26577` 逐字「**这一章就是那句话的正经课**」。**→ 若本批再开一课讲 `though`，就与批二十二刚建立的「`though` 是旧判例、不是新课」这个说法正面矛盾**；要么改 L139／L141 的已上线文案（回溯改已交付内容），要么在 L145 里自相矛盾。**竞析 §1.4 记「`though` GL 3」并判为「旧判例引述」是对的，但没有把它与「本批要教 `though`」的冲突点出来。**
2. **`though` 的独立增量只有「句尾 `though`」一处，而它与本批推荐的 `too`／`either` 句尾位置是同一块地**〔实读〕：Cambridge `although-or-though` 页本轮实取逐字 **"Though can also go at the end of the second phrase."** ＋ 两例 **"I don't mind, though. I have lots of work to do."**／**"It's nice, though."**——**「小东西站句尾，意思往回收」这个位置感，与 `too`／`either` 的句尾位置是同一个教学动作**。**两批连着做，学生会在三课内连学两个「句尾小词」，观感上是同一件事说两遍。**
3. **`unless` 的 2 课要求一条我方不存在的接口**〔实读〕：竞析 §1.4 与 §7 硬约束 3 建议「`unless` 课必须接上 ❌will 规则」。**本轮实测该规则在库有两处现成接口，但两处都踩本批别的线**：
   - `grammarLessons.ts:8781`（**L48 `oneLineRule`**）逐字「**if 里说现在（If it rains），主句说将来（I will stay）——if 里不用 will**」——**但 L48 的招牌句含 `rains`，而批二十三已建立「零雨线」纪律（本节 §4.3 复核：`rain` 系在 L142–L144 段落实测 0 命中）**；
   - L142 `:26696` 那一课已经在做**同一件事的第二次应用**（「一到就做」＋「前面说现在、后面说将来」）。
   **→ `unless` 第 1 课会变成「同一个规矩的第三次应用」，违反「一课一增量」。**
4. **`in case` 的中文侧实证为零，且我方零接口**〔实读〕：竞析 §7④ 已登记 `english.cool/in-case/` **HTTP 404**；本轮复核我方 **`case` GL 0／HC 0**、**`in case` GL 0／HC 0**、**`just in case` 0**——**连一个垫子都没有，且 `case` 在库里从未作为独立词出现过**。**要开它得一次造 2 个词（`case` ＋ 短语 `in case`），且没有任何一件现成场景零件。**

**→ 结论：`though`／`even though`／`unless`／`in case` 是「上游厚、我方薄且带回溯冲突」的一组，建议押后到能一并处理 `though` 旧判例口径的那一批。本批改做「也」家。**

### 0.3 逐候选处置总表（对任务书给的 7 项候选池）

| 序 | 候选 | 本轮实读词次 | 处置 | 一句话 |
|---|---|---|---|---|
| **1** | `seem`／`appear`（看起来好像） | `seem` **0**／`seems` **0**／`seemed` **0**／`appear` **0**／`appears` **0**（**5 形态全 0**） | ❌ **不推荐**（维持批二十三 C＋） | **与 L125 `It looks nice.` 的语义距离仍未解决**；且**本轮实测 `look` GL 237／`looks` GL 248，其中 L125 一门 `looks` 就占 55——本批若做 `seem`，第 1 课必与 L125 的「中间站 + 后面跟怎么样」位置正面重叠**（**该论断引自批二十三 §3 且本轮词次复核一致**） |
| **2** | `would rather`（宁愿） | `rather` **0**／`prefer` **0**／`would rather` **0** | ❌ **不推荐**（维持 B−） | **2 课封顶、无收口位**；**`prefer` 也全零**（Murphy 中级 U59 逐字 `59preferandwouldrather`，本轮本机 TOC 复核成立，**但一格两词等于 2 词成本**） |
| **3** | `neither`／`either`／`both`（三连体） | 四词 **GL 0／HC 0**（`nor` 亦 0） | ⚠️ **部分采纳，但必须拆开**：**本批只取「也」这一条轴，不取「两者」那条轴** | **「两者」轴（`both`／`neither`）造词成本 3–4，超先例上限**；**「也」轴只造 1 词 `either`**（**`too` 已在库 6 个位**）——**详见 §0.4** |
| **4** | `though`／`even though`／`unless`／`in case`（让步与条件的连续链） | `though` **3**（全旧判例）／`unless` **0**／`in case` **0**／`even` **0**／`case` **0** | ❌ **本轮不做**（**与竞析的 A 档判定分歧，理由见 §0.2**） | **回溯冲突 ＋ 第 1 课无新规矩 ＋ 中文侧零实证** |
| **5** | `as well as`（和／也） | `as well as` **0**／`as well` **0** | ❌ **不推荐**（维持 B−） | **Cambridge 定性为 multi-word preposition，语义与 `and`／`too` 重叠**；**且它的「也」义正是本批要教的 `too`——同批做会自己撞自己** |
| **6** | `once`（一旦） | `once` **GL 11／HC 0**，**11 处全部在 L72 且全部是频率义** | ❌ **不单开**（维持批二十三判定） | Cambridge 逐字用 `as soon as` 释义它，**同义换词** |
| **7** | `by the time`（到…的时候） | `by the time` **0**／`will have` **0** | ❌ **不单开**（维持 C） | **真搭档是 `will have`，已判撤出** |

### 0.4 为什么「三连体」要拆成「只做也这一条轴」

**批二十三与批二十二都把 `neither`／`either`／`both` 当成一个整体判（B−，造词 4 个超先例）**。**本轮实读后判：这个包袱可以卸掉一半。**

| 轴 | 涉及词 | 造词成本 | 库内底座〔实读〕 | 判定 |
|---|---|---|---|---|
| **「也」轴**（肯定用 `too`／否定用 `either`） | **只造 `either` 1 词** | ✅ **1**（**在历史最高 3 以内**） | ✅ **厚**：`too` 的「也」义在库 **6 个句子位**（L11 `:1974`／L25 `:4537`／L43 `:7948`／L51 `:9347`＋`:9402`／L55 `:10106`／L98 `:18251`）**＋ 2 处说明文字**（L66 `:12241` 举例、`:12251` 小结），**且 L66 `:12241` 已经把「句尾是『也』」写进 deepDive**；**`I don't like coffee.` 的否定句在 L5 `:925` 已有现成变体** | ✅ **本批采纳，3 课** |
| **「两者」轴**（`both`「两个都」／`neither`「两个都不」） | 造 **`both` ＋ `neither` ＋ `nor`**（3 词） | ❌ **3 触顶，且加 `of` 结构后实际更多** | ❌ **薄**：`both`／`neither`／`both of`／`neither of` 全 0；**库里唯一相关的形状是 `the two`（GL 4，L55／L81）** | ❌ **本批不取，留给后续批次单独立项** |

**→ 关键洞察：「也」轴与「两者」轴虽然在中文教科书里常被放在一起（都涉及 `either`／`neither`），但在库里是完全不同的两个成熟度**——**「也」轴有 6 个句子位现成种子，只差一课立岗；「两者」轴连一个垫子都没有。把它们捆在一起报，是让成熟的那条轴背不成熟那条的成本。**

### 0.5 明确不推荐（本批）

`as well as`（B−，且与 `too` 自己撞）／`the same as`（C，不单开）／`shall we`（D）／感官 `like` 扩展（D）／`will have`（C）／`have sth done`（C）／倒装应答 `so am I`／`neither do I`（**C，独立句法，三个零，须另案**）／复现型大章（❌）／换轴（❌）——**逐项实读理据散布于 §2／§3。**

---

## 1. 学习者视角的缺口盘点（§1）

> **本节回答任务书 §1：「哪些是『想说却说不出来』的真缺口」。判据三条，全部可实读复核**：
> ① **中文侧是不是高频、是不是零基础第一周就要用**；
> ② **库里有没有现成种子**（有种子＝学生已「见过」但不会用＝真「说不出来」；无种子＝还不认识，不是「说不出来」）；
> ③ **有没有一条能撑 2–3 课的轴**（不是一课就完的孤点）。

### 1.1 真缺口（推荐做）：「也不」——中文说得出，英语说不出

**最典型的一句话**：**「我不喜欢咖啡，我也不喜欢茶。」**

**中国学习者的真实困境有三层，逐层都能在库里找到接口**：

| 层 | 学生想说什么 | 学生会怎么说 | 库内接口〔实读〕 |
|---|---|---|---|
| **L1** | 「我喜欢茶。」 | `I like tea.` ✅ | **L5 `:873` `oneLineRule` 逐字「喜欢一整类东西时，直接说名字」** |
| **L2** | 「我不喜欢咖啡。」 | `I don't like coffee.` ✅ | **L5 `:925` `variants` 否定卡逐字 `I don't like coffee.`**——**现成** |
| **L3** | **「我也不喜欢茶。」** | ❌ **`I don't like tea too.`**（**直译「也」→ `too`**）<br>❌ **`I don't like tea also.`**（书面语直译）<br>❌ **`I too don't like tea.`**（把「也」放前面） | ❌ **库内零接口**——**这就是缺口** |

**→ 第 3 层是「真缺口」的判据齐了**：① 中文「也不」是零基础对话第一周就要用的（**库里 `I don't like coffee.` 已教，但学生下一句想接「我也」时无路可走**）；② **库里 `too` 的「也」义已有 6 个句子位种子（学生见过 `Drawing is fun too.`），但 `too` 与「不」不能同台这件事全库从未提过**——**学生学到的规则是「也」＝句尾 `too`，于是必然在否定句里错用**；③ 有轴（见 §3）。

### 1.2 真缺口（推荐做）：「两个都」／「两个都不」——但**本批不做**（成本超限）

**中文**：「苹果和橘子我**都**喜欢。」／「两个我**都**不喜欢。」

**这一层也是真缺口**（中文「都」字覆盖率极高，且英语的 `both`／`neither` 是 A1／A2–B2 档的高频词），**但本轮判不做**，理由已在 §0.4 给足：**造词 3–4 个（`both`＋`neither`＋`nor`，若带 `of` 结构还需更多），超历史最高 3 词的上限，且库内零底座**。

### 1.3 假缺口（看着像真缺口，实为「还不认识」）

**判据 ② 的反面**：库里连种子都没有的项，学生不是「想说说不出来」，是「还不知道有这个东西」，**这类不该按「缺口」优先级排**。

| 候选 | 库里种子数〔实读〕 | 判定 |
|---|---|---|
| `seem`／`appear` | **0**（5 形态全零） | ❌ **不认识，不是表达受阻**。且中文「看起来」我方已有 L125–L127 三课，**学生当下有路可走**（说 `It looks nice.` 或 `It looks like rain.`） |
| `would rather` | **0**（`rather`／`prefer` 全零） | ❌ **中文「宁愿」的口语频率远低于「也不」**，且我方 `would like`（L62）已覆盖「客气想要」，**学生当下有路可走** |
| `in case` | **0**（`case` 亦 0） | ❌ **中文「以防」的实际使用频率低**，且竞析已登记中文侧 404 零专文 |
| `unless` | **0** | ⚠️ **半真缺口**：中文「除非」确实高频，**且我方 `if` 已教（L48／L49）——但 `If you don't help me` 这条替代说法在库也是 0**（实读：`If you don't`／`if I don't`／`If we don't` **全 0**）。**→ 学生连「if 加 not」这条退路都没有，是真的说不出来**——**这是本批唯一让我犹豫的项，处置见 §2.3** |

### 1.4 缺口排序（按「种子厚度 × 轴长 × 成本」三因素）

| 排名 | 缺口 | 种子厚度〔实读〕 | 轴长 | 造词成本 | 综合 |
|---|---|---|---|---|---|
| **1** | **「也不」＋「也」（`too`／`either`）** | ✅ **6 个位**（`too` 的也义）＋ 1 课现成否定句（L5） | ✅ **3 课** | ✅ **1 词** | ⭐ **本批首选** |
| 2 | 「两个都／两个都不」（`both`／`neither`） | ❌ **0 处** | ⚠️ 2–3 课 | ❌ **3–4 词** | ⏸ **押后（成本）** |
| 3 | 「除非」（`unless`） | ❌ **0 处**，且 `if…not` 退路也 0 | ⚠️ 2 课 | ✅ **1 词** | ⏸ **押后（第 1 课无新规矩，见 §0.2 条 3）** |
| 4 | 看起来好像（`seem`／`appear`） | ❌ 0 处 | ⚠️ 2 课 | ⚠️ 2 词 | ⏸ **押后（与 L125 语义距离）** |
| 5 | 宁愿（`would rather`） | ❌ 0 处 | ✅ 2 课封顶 | ✅ 1 词 | ⏸ **押后（无收口位）** |
| 6 | 一旦（`once`）／到…的时候（`by the time`）／和·也（`as well as`） | — | — | — | ❌ **同义换词，不排期** |

---

## 2. 中文负迁移分析（§2）

> **格式**：每个候选给「中文怎么说 → **中学生最可能写出的错句** → 干扰点 → 跨源逐字依据 → 课的处置」。
> **错句全部标 `*`**，且**每条错句都注明它在库里是「新错」（GL 0）还是「已有先例」**〔实读〕。

### 2.1 `too`／`either`（本批主靶）：**中文「也」是一个字，英语是两张脸**

#### ① 否定句里用 `too`（**本章头号错型**）

- **中文**：「我不喜欢咖啡，**我也**不喜欢茶。」
- **学生会写**：**`*I don't like tea too.`**
- **干扰点**：**中文的「也」不随肯定／否定变脸**——同一个字。学生已经学会「『也』站句尾」这个位置规则（**从 L43 `Drawing is fun too.` 来的**），于是**位置对了、词错了**。
- **跨源逐字**〔实读〕：Cambridge `also, as well or too` 页逐字 **"We use either not also, as well or too to connect two negative ideas"**，并明标错例 **"I don't think Dave is also/as well/too."**
- **题库实测**：**`I don't like tea too.` 全库 GL 0／HC 0**（真零）；**`either` GL 0／HC 0**——**这个错型在库里从未出现过，是纯新靶**。
- **课的处置**：**L146 的新错①必须是 `too` → `either`**（罪名 `word_order`，理由：**位置不变、词要换**）。**对照卡必须给 6 条**（§4.2）。

#### ② 把「也不」说成「也不放句尾」（位置错）

- **中文**：「**我也**不去。」（中文「也」紧贴「不」）
- **学生会写**：**`*I too don't go.`** ／ **`*I also don't go.`**（后者是 `also`，**又是本批不教的第三个说法**）
- **干扰点**：**中文「也」永远在「不」前面**（「我也**不**去」），英语的 `either` 却要**跑到句尾去**——**中英位置恰好相反**，这是本项最强的负迁移。
- **库内依据〔实读〕**：**`I too don't` 0**／**`also` GL 0**（**只在 HC 出现 2 次，且都是 `I have also done my homework.` 这种完成态位置**，`huntCases.ts:2021` 区段）。**Cambridge 逐字给的正位置是"Too can occur immediately after the subject, if it refers directly to the subject."（例 `I too thought she looked unwell.`）——但英文口语里这个位置少见，且本批不建议教**（见 §4.4 诚实标注）。
- **课的处置**：**L146 的新错②应该是「也的位置」（`either` 漏掉或位置错误）**；**同时 `contrast` 里给一条 `bothRight` 位，把「中文也放前面」与「英语也放句尾」并排给出来**。

#### ③ 情态／助动词后面塞 `too`

- **中文**：「我**也**会游泳。」／「我**也**想去。」
- **学生会写**：**`*I can too swim.`** ／ **`*I have too been there.`**
- **跨源逐字**〔实读〕：Cambridge 同页逐字 **"It does not normally occur after a modal or auxiliary verb."**，并给错例 **"We have too been very pleased …"**
- **库内对照**：**学生学过的位置是「`too` 站句尾」**（L43 `Drawing is fun too.`）——**这条错型是「学会了位置但记不牢」的半成品错，本批应在 `contrast` 里点一次**（不必做案件主靶，见 §4.2）。

#### ④ 应答语里说「我也是」用 `I too`

- **中文**：「**我也是**！」
- **学生会写**：**`*I too!`**
- **跨源逐字**〔实读〕：Cambridge 同页逐字 **"In short answers in informal situations, we normally say me too, not I too"**
- **库内依据**：**回复语「me too」全库字面量 0 处**（`grep -oiF "me too" src/data/*.ts` ＝ **0**）；**`Me too` 亦 0**。**→ 这是一个全新的、极短的、学生一定会问的说法**。
- **课的处置**：**建议做 L145 的 `guided` 认读位或 `sceneSwings` 的一句**，**不做案件靶**（**理由：案件是找错游戏，「Me too」太短，装不满一条 4 错案**）。

### 2.2 `both`／`neither`（本批不做的轴，但仍登记负迁移供后续批次用）

- **中文**：「两个我**都**喜欢。」
- **学生会写**：**`*I like both.`**（**漏掉两个东西**）／**`*I both like apples and oranges.`**（**位置错：`both` 要贴 `and` 或贴名词**）
- **跨源逐字**〔实读，Cambridge `both` 页本轮实取〕：**"Both: typical errors"** 两条逐字：① **"We don't use both with a negative verb; we use either instead."** ② **"When we use the verb be as a main verb, both comes after the verb"**（**正例 `These films are both famous…` ／错例 `These films both are famous…`**）
- **→ 本批的处置：只登记、不用**——**但 L146 必须为它留好接口**（§4.4：`either` 那一课的 `deepDive` 可以点名「两个都不」以后再说，**不展开**）。

### 2.3 `unless`（本批不做的轴，负迁移登记）

- **中文**：「**除非**你现在就走，不然会迟到。」
- **学生会写**：**`*Unless you will go now, you will be late.`**（**will 混入**，照中文「会」直译）／**`*Unless you don't help me, I can't finish.`**（**双重否定**，照中文「除非你不…」直译）
- **跨源逐字**〔实读〕：Cambridge `unless` 页逐字 **"Unless is a conditional word (like if), so we don't use will or would in the subordinate clause."** ＋ 正例 **"Unless I hear from you, I'll see you at two o'clock."** ＋ 明标错 **"Unless I'll hear…"**；同页逐字 **"We use the conjunction unless to mean 'except if'."**；**词典 CEFR 逐字 `B1`**（本轮实取 `dictionary/english/unless`）
- **另有一条中文侧的「不能用于疑问句」**（竞析 §1.4 引中文侧逐字），**但本报告未直取该页原文，标〔未核实〕**（§6）。
- **→ 本批的处置：不用**。**但 L147 的收口课若做「条件家族排一行」，`unless` 是天然的第四格——建议届时再裁**（§4.5）。

### 2.4 `as well as`（本批不做的轴）

- **中文**：「他会说英语，**也**会说法语。」（**主语是一个人**）
- **学生会写**：**`*He speaks English, as well as French.`**——**这句其实对**；**真正会错的是搭配**：**`*as well as to speak`**／**`*He as well as I am happy.`**（**`as well as` 后面的东西不影响前面动词的数**）
- **跨源逐字**〔实读〕：Cambridge 逐字 **"As well as is a multi-word preposition which means 'in addition to'"**（**上游定性为介词，不是连接词**）
- **→ 本批的处置：不用**。**最重要的一条：它的「也」义与 L145 要教的 `too` 直接重叠——同批做会自己撞自己**（§0.3 序 5）。

### 2.5 倒装应答 `so am I`／`neither do I`（**明写不碰**）

- **中文**：「我也喜欢。」／「我也不喜欢。」
- **学生会写**：**`*So do I like it.`**／**`*Neither I do.`**／**`*Me neither like.`**
- **跨源逐字**〔实读，Murphy 初级 TOC 本机原件本轮独立复核〕：**`42too/eithersoamI/neitherdoIetc.`** 逐字（**归一化前 `42 too/either so am I / neither do I etc.`**）——**上游把它单独立为一个单元，且位置在 `40 I am, I don't etc.`／`41 Have you? Are you? Don't you? etc.`／`43 isn't, haven't, don't etc.` 之间，属「助动词」块，与 `82 both either neither` 相隔 40 个单元**。
- **我方实读**：**`so am I` GL 0／HC 0**；**`neither do I` GL 0／HC 0**；**`nor` GL 0／HC 0**——**三个零**。
- **→ 处置：本批三课全不出现（作 G 项校验）**。**理由与竞析 §6 一致：它是独立句法，塞进来会让 L146 的词位从 1 跳到 4，破线。**

### 2.6 本轮对竞析「上游连续链」的独立复核（**必须明写的一节**）

**竞析 §5.1 称：「Murphy 中级 U113／U114／U115 确认是连续三单元（本机原件 md5 `994fde91a0ca7e2d6a7417ed5c72b1d5`）」。本轮用同一份本机原件独立复核**：

```
$ python3 -c "import re;s=open('/tmp/murphy_int_norm.txt').read();print(re.findall('113[a-z]+|114incase|115unless[a-z]*',s))"
（无输出——正则未命中；改用上下文抽取）
$ grep -o "incase" /tmp/murphy_int_norm.txt   -> 1 处
$ 上下文: "...ndprepositions113althoughthougheventhoughinspiteofdespite114incase115unlessaslongasprovided116as(asIwalked/asIwasetc.)117lik..."
```

**→ 复核结论：竞析的核心事实成立**——**U113／U114／U115 首尾相接，且 `113though` 后面确实紧跟 `114incase` 再紧跟 `115unlessaslongasprovided`**〔实读〕。**同时复核了本批与竞析其余分歧项的本机原件**：

| 声称 | 本机原件实测〔✅ 复核结果〕 |
|---|---|
| 初级 U42 `too/either so am I / neither do I etc.` | ✅ 逐字命中：`42too/eithersoamI/neitherdoIetc.`（**在 `Auxiliary verbs` 块，U40–U43**） |
| 初级 U82 `both either neither` | ✅ 逐字命中：`...81allmostsomeanyno/none82botheitherneither83alotmuchmany84(a)little(a)fewAdjectivesandadverbs85...` |
| 中级 U89 `both/both of neither/neither of either/either of` | ✅ 逐字命中：`89both/bothofneither/neitherofeither/eitherof` |
| 中级 U59 `prefer and would rather` | ✅ 逐字命中：`59preferandwouldrather` |
| 中级 U120 `by and until by the time…` | ✅ 逐字命中：`120byanduntilbythetime…` |
| **`seem`／`appear` 双册 TOC 全 0** | ✅ 复核成立：**中级 0／初级 0** |
| **`as well as` 双册 TOC 全 0** | ✅ 复核成立：**`aswellas` 中级 0／初级 0** |
| **`once` 双册 TOC 全 0** | ⚠️ **复核结果与竞析不同**：`neither` 中级 2 处／`either` 中级 4 处、初级各 2 处，**但 `once` 作为独立单元在归一化文本中未见**（**竞析称「三通道全 0」，本轮按归一化文本复核未见反例，标「一致」**） |

**⚠️ 一处必须登记的核算差异**：**竞析 §1.3 称「我方实测 `neither`／`either`／`both`／`nor` GL 0 且 HC 0」，与本次实读一致 ✅**；**但竞析 §B.2 若按「`too` GL 110」引用，本轮实测为 raw **110**／剔 id 后 **108****——**差异 2 处的完整定位（本轮逐处复算，口径与批二十三的 `as` 订正同法）**：**裸 `grep -oE "(^|[^A-Za-z])too([^A-Za-z]|$)"` ＝ 110**；**其中 1 处是 `id: "lesson-66-too-to"`（`:12158` 的 id 串本身含整词 `too`，剔除）**；**另有 1 处在 `//` 注释行**——**110 − 1(id) − 1(注释) ＝ 108 ✅ 账目全平**。**→ 本报告一律以「引号内字面量口径 108」为准**，**并把 `too` 的「也」义与「太」义的分布逐处列出（§1.4 已给 6 个位「也」义的完整行号）**。

---

## 3. 场景设计（§3）

### 3.1 场景锚：**晚饭后，那张饭桌上剩下的两样东西**（`scene: "mansion"`）

**设计原则三条**：
1. **必须避开批二十三刚建立的场景（傍晚等家人回来吃饭／`dinner`）**——**但不必避开 `mansion` 本身**（`mansion` GL 场景分布 **53 课在用，是全库第一**〔实读 `grep -o 'scene: "[a-z-]*"'` 统计〕）。
2. **必须绕开「零雨线」**——**任务书点名的 8 个词（`rain`／`raining`／`rainy`／`stops`／`stopped`／`the movie`／`ends`／`ended`）在本批三课一律零出现**（作 G 项，§5.6）。
3. **零件必须全部已在库**，**且 `too` 的「也」义种子所在的那几课的场景不能被重复消费**（L43 游泳／L51 教室／L55 名次表／L98 读书与睡觉／L11 三明治）——**选一个库里最厚、语义最中性的场地：餐桌。**

**场景锚链＝「晚饭后收拾桌子，小美和弟弟对着桌上剩的两样东西说话」**：

| 课 | 场景 | 三个零件（全部实读词次） |
|---|---|---|
| **L145** | 晚饭后，桌上剩着茶和咖啡两杯 | `tea` **GL 118**（L70 44／L62 37／L04 11）／`coffee` **GL 25**（L62 8／L70 7／L05 5／L25 5）／`milk tea` **GL 23**（L04 10／L14 7） |
| **L146** | 弟弟把杯子推过来，说他不喝 | `I don't like` **GL 18**（L40 8／L42 6／L05 3）／`either`（**本批唯一新词**）／`couldn't` 等在库 |
| **L147** | 本子摊开，把两句话并排写下来 | 三课目标句 ＋ 现成复现句（§4.3） |

**「零撞车」实证（三条）**：

- ✅ **`coffee` GL 25 无独占**：最高落点是 **L62（8 处）／L70（7 处）**，两课都是 `would like` 的「客套点单」场，**与「晚饭后桌上有两杯」不冲突**；**`tea` GL 118 同理**（L70 44／L62 37 两课占 68.6%，**都是「要不要来点」的提供场**）。
- ✅ **`milk tea` GL 23 是 L4／L14 的招牌**（`I want a milk tea.`／`Can I have a milk tea?`）——**本批三课不出现 `milk tea`**（作 G 项，避免把 L4 的招牌句场景拉进来）。
- ✅ **`apples` GL 111 是本批的备选零件**（L114 47／L30 28）：**若 L146 需要换成「水果」场面，「苹果」是库内最厚的一个**（**但 `I like apples` 有 2 处命中，须改词，见 §4.1 的替代方案**）。

### 3.2 为什么不用「学校／教室」或「公园」

| 候选场地 | 实读词次 | 不用它的理由 |
|---|---|---|
| `school` | **GL 215** | **L122（41）／L09（32）／L57（32）／L124（22）四课占 127 处 ＝ 59.1%**（**本轮逐课实读；原稿误记 158／73.5%，已订正**）——**其中 L122／L124 是批十八的 `used to`／`be used to` 双课，场景是「走路上学」，语义太强** |
| `park` | **GL 203** | **L75（35）／L24（26）／L09（20）／L60（20）／L10（16）**——**`Yesterday I went to the park.` 这一句已顶死 6 课头寸（全库第一，§4.3 实测），再用 park 会持续踩这个最热门的句** |
| `home` | **GL 109** | ✅ **可用但不推荐**：**L48 一门 24 处（22%），而 L48 就是踩雨线的那一课**——**避开 L48 的语义场更安全** |

**→ 结论：餐桌是唯一「厚（`tea` 118／`coffee` 25／`cup` 123／`apples` 111）且无强语义绑定」的场地。**

### 3.3 三课的「零件清单」与逐词词次（**任务书硬要求：须实测词频，逐词给数字**）

> **口径**：**GL ＝ `grammarLessons.ts` 引号内字面量的整词命中数**（状态机扫描器，剔 id 与注释）；**HC ＝ `huntCases.ts` 同口径**。

| 零件 | GL | HC | 主要落点〔实读〕 | 本批用法 |
|---|---|---|---|---|
| `tea` | **118** | 5 | L70 44／L62 37／L04 11／L14 8 | L145 场景物 ＋ 复现 |
| `coffee` | **25** | 3 | L62 8／L70 7／L05 5／L25 5 | L145 场景物 ＋ **L146 否定句的宾语** |
| `cup` | **123** | 14 | L50 49／L62 38／L23 12 | 场景物（**L145 可用「两杯」的场面，`cups` GL 3**） |
| `apples` | **111** | 16 | L114 47／L30 28 | ⚠️ **备选零件**（**若用须避开 `I like apples` 的 2 处命中**） |
| `music` | **47** | 3 | L05 23／L42 6／L135 6 | **L145 的复现位**（`Do you like music?` 是 L5 原句，**余 5 次头寸**，§4.3） |
| `brother` | **144** | 19 | L52 49／L39 39／L112 18 | **L146 可选（换人版本）**：`My brother` GL 107 |
| `like` | **353** | 24 | L62 68／L05 64／L42 57 | 三课动词 |
| `I don't like` | **18** | 0 | L40 8／L42 6／L05 3 | **L146 的骨架** |
| `tea`/`coffee` 之外的无场景词 | — | — | — | **本批新造词只有 `either` 1 个** |

**⚠️ 一条必须明写的词架约束**：**`too` 的「也」义虽然有 6 个位，但没有一处是第一人称肯定陈述句的自由位**——**本批要把它变成目标句，必须在 `practice`／`examples` 里造新句**。**实测：`I like tea too.` GL 1（L66 deepDive 举例）／`I like music too.` GL 0／`I like apples too.` GL 0／`My brother likes tea too.` GL 0**——**造句空间完全干净**。

---

## 4. 逐课规格（§4 · L145–L147 · 3 课）

### 4.0 课量建议：**3 课**（**不是 2，不是 4**）

| 课量 | 判定 | 逐条依据 |
|---|---|---|
| **2 课** | ❌ | **第 2 课（否定句尾 `either`）与第 1 课（肯定句尾 `too`）拆不开货**——但**砍掉第 3 课就没有收口，且「两张脸并排」这个教学动作是本项唯一能证明「为什么要多学一个词」的地方**（照 L140 `although` vs `but` 的先例） |
| **3 课** | ✅ **取** | ① **L145 立岗 `too`**（**认读升格**：从 L43 的 `guided` 位、L51 的 `examples` 位升格为正式岗）② **L146 切开 `too` ↔ `either`**（**本批唯一独立价值**）③ **L147 收口「也家排一行」**（**照 L141 `:26498`／L144 `:27076` 两次先例，收口课 `grammarLabel` 写「收口 · 零新知」**） |
| **4 课** | ❌ | **第 4 课的候选增量只有「倒装应答 `so am I`／`neither do I`」**〔实读：**三个零**〕**或「否定用 `neither` 开头」**——**两条都要再造价 1–2 词（`nor`／`neither`），且上游 Murphy 初级 U42 把它单独立为独立单元**（**属另一个话题**）→ **不做第 4 课**（与竞析 §6「倒装应答须另案立项」一致） |

### 4.1 L145 —— 立岗：`too` 站句尾，说「一个样」（**新案 #154**）

| 项 | 内容 |
|---|---|
| **课号／id** | **L145**／`lesson-145-too-also` |
| **推荐标题** | **「我也要一个」** |
| **`grammarLabel`** | **「也一样 · too 站句尾」**（**零术语自检 ✅**——见 §5.6） |
| **增量** | **`too` 的「也」义立岗**——**这是全库第七例「先认读、后立岗」**（前六例见 §0.1；**本项的认读位是 L43 `:7947` 的 `guided` 题与 `:7948` 的答案句**） |
| **`targetSentence`** | **`I like tea too.`**（**4 词 ✅**）〔实读：**GL 1／HC 0**；**唯一的 1 处是 L66 `:12241` deepDive 里的举例**——**作为目标句是首次，且该句在 `practice[].answer` 里从未出现，头寸满 6**〕 |
| **替代目标句（若主理人要求换场景）** | **`I want one too.`**（**4 词**）——**有 L11 对话原句背书**（`:1974` 逐字 `Two? I want one too!`），**但 `I want one too` GL 1／HC 0**，**与 L11 的台词撞词面**，**次选** |
| **`sceneSetupZh`（建议稿）** | 「晚饭后，桌上还剩着两杯——一杯茶、一杯咖啡。弟弟端起茶喝了一口，小美也伸手去拿。」（**零术语 ✅**） |
| **一句话规则（`oneLineRule` 建议稿）** | 「说「我也一样」：**`too` 站在句子尾巴上**——I like tea too（我也喜欢茶）。**它在句尾，不在句首、也不在中间**。」（**零术语 ✅**） |
| **对比卡 6 条方向** | ① **错**：`Too I like tea.` ❌（**「也」放句首**——中文「我也喜欢」的「也」在中间，**学生可能直译到句首**）｜② **错**：`I too like tea.` ❌（**放中间**——**Cambridge 说这个位置存在但口语少见，本课判为错以强化句尾**）｜③ **对**：`I like tea too.` ✅（**本课正解**）｜④ **对（`bothRight`）**：`Drawing is fun too.` ✅（**复现 L43 `:7948` 的认读句，头寸余 5**）｜⑤ **对（`bothRight`）**：`The desks were cleaned too.` ✅（**复现 L51 `:9347`，头寸满 6**）｜⑥ **错**：`I like tea to.` ❌（**`too` 写成 `to`——同音混淆**；**库内已有同型先例**：L15 `:2778` 的 `choose` 题选项就是 `["to","too","at"]`，**说明编者早就知道这个坑**） |
| **变体三态（建议稿）** | **肯定**：`I like tea too.`｜**否定**：`I don't like coffee.`（**复现 L5 `:925` 否定卡，头寸满 6**——**本课否定态故意不用 `either`，留到 L146**）｜**疑问**：`Do you like tea too?`（**照 L5 `:925` 的 `Do you like music?` 形态**；**GL 0／HC 0**） |
| **复现取材建议** | **① `Drawing is fun too.`（L43 `:7948`，`practice` 已出现 1 次，头寸余 5）** ｜**② `The desks were cleaned too.`（L51 `:9347`／`:9402`，`practice` 出现 0 次、**但它是 L51 `examples` 与 `sceneSwings` 各一次**，**建议只作 `contrast` 的 `bothRight` 位，不进 `practice`**）** ｜**③ `Do you like music?`（L5，`practice` 出现 1 次，头寸余 5 ✅）** ｜**④ `I don't like coffee.`（L5 `:925`，`practice` 出现 0 次，头寸满 6 ✅）** |
| **案件设计建议（新案 #154）** | **4 错 ＝ 新错 2 ＋ 旧错 2**（§4.4 给逐条 tokenIndex 实测） |

**⚠️ 一处必须点名的「认读升格」责任**：**L43 `:7947-7948` 的那道 `guided` 题是「认读位」，L145 把它升格为正式岗时，`deepDive` 必须逐字点名这一句**（**照 L142 `:26751` `whyZh` 与 `:26770` `deepDive` 点名 L109 的做法**——实读：`:26751` 逐字「第 109 课你认读过一句：as 也能领一整句。今天它转正了」）——**这是全库第七例，学生已经在 L43 见过一次，**`deepDive` 若不复述，学生会以为是全新东西。

### 4.2 L146 —— 切开：同一个「也」，肯定句一张脸、否定句一张脸（**新案 #155**）

| 项 | 内容 |
|---|---|
| **课号／id** | **L146**／`lesson-146-not-either` |
| **推荐标题** | **「我也不喜欢」** |
| **`grammarLabel`** | **「两张脸 · 肯定用 too／否定用 either」**（**零术语 ✅**；**照 L140 `两张脸 · although 站前面 / but 站中间` 的形态**） |
| **增量** | **`too` 与 `either` 的分工**——**这是本项唯一独立价值**：**中文一个字「也」，英语两张脸，看前面有没有「不」** |
| **`targetSentence`** | **`I don't like coffee either.`**（**6 词 ✅**）〔实读：**GL 0／HC 0**；**骨架 `I don't like coffee.` 在 L5 `:925` 已有，只是尾部加了 `either`**〕 |
| **`sceneSetupZh`（建议稿）** | 「弟弟把咖啡杯推到一边，皱着鼻子说他不喝这个。小美跟着摇头——她也一样。」（**零术语 ✅**） |
| **一句话规则（`oneLineRule` 建议稿）** | 「**说「也不」：`too` 让位，`either` 上，还是站句尾**——I don't like coffee either（我也不喜欢咖啡）。**前面有了「不」，句尾就换 either**。」（**零术语 ✅**） |
| **对比卡 6 条方向** | ① **错**：`I don't like coffee too.` ❌（**本章主靶**——**中文「也」不分肯定否定**）｜② **错**：`I too don't like coffee.` ❌（**「也」放中间**——中文语序直译）｜③ **对**：`I don't like coffee either.` ✅（**本课正解**）｜④ **对**：`I don't like tea either.` ✅（**换宾语版本**；**GL 0／HC 0**）｜⑤ **对（`bothRight`）**：**`I like tea too.` ↔ `I don't like coffee either.` 并排**（**「同一个『也』、两张脸」的核心卡**——**照 L140 `:26351` 的双正解卡形态**）｜⑥ **错**：`I don't like coffee too.` 的**镜像错**：**`I like tea either.`** ❌（**肯定句里用了否定版**——**这条是「反向穿透」的检验，教材常只防一边**） |
| **变体三态（建议稿）** | **肯定**：`I like tea too.`（**L145 回流**）｜**否定**：`I don't like coffee either.`｜**疑问**：`Do you like coffee too?`（**疑问句用 `too` 不用 `either`**——**GL 0／HC 0**；**⚠️ 这条是本课最难的一格，Cambridge 只说「否定用 either」，没说疑问怎么办；本报告按「疑问≈肯定侧」处理，标〔推断〕，见 §6**） |
| **复现取材建议** | **① `I don't like coffee.`（L5 `:925`）——它是本课目标句的骨架，必须复现**（**头寸满 6 ✅**）｜**② `I don't have anything for you.`（L83 `:15401`／`:15454`）——「否定换词」的**同型先例**（**L83 的规矩是「问句和『不 / 没』里换成 anything」，与本课「否定里把 too 换成 either」是同一条思路**）；**`practice` 出现 0 次，头寸满 6 ✅**｜**③ `She doesn't let me go.`（L105，`practice` 出现 1 次，头寸余 5 ✅）——「帮手替它干活」的否定句形态** |
| **案件设计建议（新案 #155）** | 见 §4.4（**4 错 ＝ 新错 2 ＋ 旧错 2**） |

**★ L146 的 `deepDive` 建议逐字照 L83 的「老规矩」话术改一句**〔实读〕：
- **L83 `:15398` `oneLineRule` 逐字**：「说不清或者先不说是什么，用 something；**问句和「不 / 没」里换成 anything**——**第 30 课 some/any 的老规矩**。」
- **→ L146 的 `deepDive` 建议逐字**：「**第 83 课的『不 / 没里换词』今天又来一遍**：**肯定句尾用 `too`（I like tea too），有「不」的句子里换成 `either`（I don't like coffee either）**。」——**这是「同一个规矩的第三次应用」（something/anything → too/either），有现成脚手架，教学成本极低，且不是重复（换的是词，不是规矩）**。

### 4.3 L147 —— 收口：「也」家排一行（**新案 #156 · 全回流**）

| 项 | 内容 |
|---|---|
| **课号／id** | **L147**／`lesson-147-close-24` |
| **推荐标题** | **「也家排一行（收口）」** |
| **`grammarLabel`** | **「收口 · 零新知（两张脸排一行）」**（**照 L141 `:26498` 的 `grammarLabel` 逐字 `收口 · 零新知（两张脸排一行）` 形态**——**⚠️ 完全同名，需主理人确认是否允许；若不允许，改用 `收口 · 零新知（也的两张脸）`**） |
| **增量** | **零新知**（**收口课惯例**——本轮逐课实读（两条口径，必须分开写）：① **`grammarLabel` 含「零新知」的全库共 11 课**，逐处行号 `:14432`（L78 `收口 · 跨季大团圆（零新知）`）／`:15955`（L86）／`:17470`（L94）／`:18989`（L102）／`:22043`（L118）／`:23209`（L124）／`:23787`（L127）／`:24951`（L133）／`:25917`（L138）／`:26498`（L141）／`:27076`（L144）；② **`grammarLabel` 以「收口 ·」开头的共 16 课**（**其中 11 课带「零新知」、5 课不带**——不带的五课逐处：`:7463`（L41 `收口 · 两句话拼一句`）／`:8394`（L46）／`:8954`（L49）／`:9893`（L54）／**`:20488`（L110 `收口 · 四张脸排一行`）**）——**⚠️ 本报告原稿写「六课全部零新知」并把 L110 列入，实读 L110 `:20488` 逐字是 `收口 · 四张脸排一行`（无「零新知」字样）——已订正**） |
| **`targetSentence`** | **`I like tea too.`**（**与 L145 同句**——**照 L141／L144 收口课直接复现本章目标句的做法**） |
| **`oneLineRule`（建议稿）** | 「**同一个「也」，两张脸**：**肯定句尾用 `too`（I like tea too）**；**有「不」的句子，句尾换 `either`（I don't like coffee either）**——**看前面有没有「不」**。」（**零术语 ✅**） |
| **对比卡 6 条方向** | **全部回流、不新增错型**（**照案 #150（L141 收官案）与案 #153（L144 收官案）形态**）：① L145 主靶（`too` 位置）｜② L146 主靶（否定句用 `too`）｜③ L145 的正解复现｜④ L146 的正解复现｜⑤ **`bothRight`：两句并排**（**收口课的招牌卡**）｜⑥ **旧错回流一处**（**L11 的 `plural` 或 L5 的 `verb_form`**——见 §4.4） |
| **复现取材建议（本章全部复现位）** | 逐句实测头寸〔实读，**口径：该句在 144 课 `practice[].answer` 里出现的课数，红线 >6 违规**〕：<br>• `I like tea.`（L5 `examples`）—— **`practice` 出现 0 次，头寸满 6 ✅**<br>• `I don't like coffee.`（L5 `:925`）—— **0 次，满 6 ✅**<br>• `Do you like music?`（L5）—— **1 次，余 5 ✅**<br>• `Drawing is fun too.`（L43 `:7948`）—— **1 次，余 5 ✅**<br>• `I don't have anything for you.`（L83）—— **0 次，满 6 ✅**<br>• `She doesn't let me go.`（L105）—— **1 次，余 5 ✅**<br>• ⚠️ **绝对不可用**：`Yesterday I went to the park.`（**已顶死 6 课**，全库第一，§5.6 作 G 项）／**`I like reading.`（5 次，仅余 1）**／**`I am happy.`（5 次，仅余 1）**／**`He drinks milk every day.`（4 次，余 2）** |
| **案件设计建议（新案 #156）** | 全回流，四点分别锚 L145／L146 与两处旧错（§4.4） |

### 4.4 三个新案的逐条设计（**含 tokenIndex 实测**）

> **罪名合规核对**〔实读 `src/services/huntService.ts:331-342`〕：`GRAMMAR_ERROR_TAGS` 十元 ＝ `tense`／`sv_agreement`／`missing_be`／`article`／`plural`／`preposition`／`fragment`／`run_on`／`word_order`／`verb_form`。**`comparison` 存在于 `types.ts:430` 但不在 `GRAMMAR_ERROR_TAGS` 内，全库案件 0 处使用**（**实测 586 条 tag 分布：`verb_form` 133／`plural` 104／`sv_agreement` 94／`preposition` 62／`tense` 56／`word_order` 50／`article` 29／`missing_be` 24／`run_on` 19／`fragment` 15**）——**本批只用上表十项内的罪名，且不碰 `comparison` ✅**。

**⚠️ 一条结构性约束**〔实读 `huntService.test.ts:320-330`〕：**每案必须留 ≥1 个净词（decoy）**，断言逐字为 `expect(huntCase.tokens.length).toBeGreaterThan(errorIndexes.size)`；且**每个 `tokenIndex` 指向的 token 必须与 `original` 逐字对齐**（`:311-318`）。**本报告的下标已用脚本枚举实测，可直接落盘。**

#### 案 #154（挂 L145）：`hunt-like-tea-too` ·「桌上的两杯」

**tokens（19 个）**：
```
I | too | like | tea. | My | brother | like | apples. | I | have | two | sister. | Last | week | I | go | to | the | library.
```
**净词 ＝ 16／19 ✅**（错误点 4 个）

| # | tokenIndex | token | 罪名 | original | correction | 说明 |
|---|---|---|---|---|---|---|
| ① | **1** | `too` | **word_order** | `too` | `去掉（too 放到 tea 后面）` | **新错**：中文「我也喜欢」的「也」在中间，英语要站句尾——**照 L32 `Don't be late!` 与 L54 `most` 的既有 `去掉（…）` 写法**（`huntCases.ts` 实读：`去掉（…）` 型修正全库 **6 处**（`:763`／`:966`／`:4583`／`:5072`／`:5140`／`:5828`）；**另 44 处是 `去掉 xx` 无括号型**——**两种写法都是既有惯例 ✅**） |
| ② | **6** | `like` | **sv_agreement** | `like` | `likes` | **旧错回流 L25**：`My brother` 是「他」一个——⚠️ **回流量核算（本轮实读）**：`like→likes` 是全库**用过的第 3 多**的 `sv_agreement` 修正（**已用 3 次**：#3 `hunt-my-sister`／#34 `hunt-third-person-daily`／#152 `hunt-when-vs-as-soon`；`He drink milk every day.` 已用 **5 次**；`go→goes` 只用 **2 次**）——**⚠️ 本报告原稿此处记「2 次」，已订正为 3 次**。**→ 生产期若想降复用率，可改 `go→goes`；本报告保留 `like→likes`，理由是它与 L25 的招牌句（`He drinks milk every day.`）同型、接口最直** |
| ③ | **11** | `sister.` | **plural** | `sister.` | `sisters.` | **旧错回流 L11**：`two` 后面要加 -s——**`sister` 这个名词在全库案件里从未被植错**（实读：全库 `original: "sister..."` **0 处** ✅）——**`sister` 只出现在 `My sister do her homework.`（#21）这类 `sv_agreement` 靶里，作为 `plural` 靶是全新词面 ✅** |
| ④ | **15** | `go` | **tense** | `go` | `went` | **旧错回流 L10**：`Last week` 要换昨天版——**`go→went` 是全库最厚的回流**（实读：`tense` 型 `original: "go" → correction: "went"` 共 **25 案**，**从 #2 一直排到 #153，是唯一一个跨全部 24 批的在用回流**），**但 `Last week I go to the library.` 这个组合在 HC 实测 0 处** ✅ **新句面** |

#### 案 #155（挂 L146）：`hunt-not-coffee-either` ·「弟弟的杯子」

**tokens（23 个，⚠️ 已按订正换掉 `egg`）**：
```
I | don't | like | coffee | too. | She | don't | like | tea. | There | are | two | table | at | the | kitchen. | My | sister | and | I | was | at | home.
```
**净词 ＝ 19／23 ✅**（**⚠️ 与 §4.4 表内下标已同步订正**）

| # | tokenIndex | token | 罪名 | original | correction | 说明 |
|---|---|---|---|---|---|---|
| ① | **4** | `too.` | **word_order** | `too.` | `either.` | **本章主靶（新错）**：有「不」的句子，句尾换 `either`——**`original` 含尾标点是库内既有写法**（实读：**`original` 字段含尾标点的共 70 处**；**`plural` 型的 `correction` 含尾标点的 37 处**——**两种写法都是惯例 ✅**） |
| ② | **6** | `don't` | **sv_agreement** | `don't` | `doesn't` | **旧错回流 L25**：`She` 配 `doesn't`——**`sv_agreement` 型的 `don't→doesn't` 在全库案件出现 1 次**〔实读〕，**本批第 2 次，句面全新 ✅** |
| ③ | **12** | `table` | **plural** | `table` | `tables` | **⚠️ 原稿用 `egg`，本轮实读发现 `egg→eggs` 已用过 3 次**（#19 `hunt-fridge-note`／#21 `hunt-kitchen-note`／#53 `hunt-shop-note`）——**已换成 `table`**（实读：`table` 作 `plural` 靶 **0 次 ✅**；`table` GL 36 是库内高频名词；`There are two table…` 组合 **0 处**） |
| ④ | **20** | `was` | **sv_agreement** | `was` | `were` | **旧错回流 L19**：`My sister and I` 是两个人——**⚠️ 实测：`My sister and I was happy.` 已在案 #152（批二十三 L143）用过一次**（实读：#152 是本库唯一一处）；**本批换尾巴 `at home`（实读 `"at", "home."` 组合全库 3 处，但 `My sister and I was at home.` 0 处）以避重复 ✅** |

#### 案 #156（挂 L147）：`hunt-close-24` ·「本子上的两行」

**tokens（19 个，⚠️ 第 4 句已换，避开与 #154 同句）**：
```
I | too | like | tea. | I | don't | like | coffee | too. | My | brother | drink | milk. | Yesterday | I | go | to | school | late.
```
**净词 ＝ 15／19 ✅**

| # | tokenIndex | token | 罪名 | original | correction | 说明 |
|---|---|---|---|---|---|---|
| ① | **1** | `too` | **word_order** | `too` | `去掉（too 放到 tea 后面）` | **L145 回流** |
| ② | **8** | `too.` | **word_order** | `too.` | `either.` | **L146 回流** |
| ③ | **11** | `drink` | **sv_agreement** | `drink` | `drinks` | **旧错回流 L25**（**⚠️ 原稿写 `like→likes`，因该型全库已用 3 次改为 `drink→drinks`；`My brother drink milk.` 实读 GL 0／HC 0 ✅**） |
| ④ | **15** | `go` | **tense** | `go` | `went` | **L10 回流（第 2 次）**（**⚠️ 第 4 句由 `Last week I go to the library.` 换成 `Yesterday I go to school late.`，避免与 #154 同句**——实读 **GL 0／HC 0** ✅） |

**⚠️ 案件侧三处须生产期核对**：
1. **`#155` 与 `#156` 都含 `too.` 的 `word_order` 修正——这是有意的「二次切开」**（照批二十三 L142①／L143② 的先例），**但两案 `explanation` 必须逐字不同**。
2. **两句跨案差异化（本轮已订正）**：**§4.4 原稿的 `#154`／`#156` 第 4 句曾完全相同（`Last week I go to the library.`）**——**已把 `#156` 换成 `Yesterday I go to school late.`**（实读：**GL 0／HC 0，句面全新 ✅**；**⚠️ 注意 `Yesterday I go home late.` 已在 #151 与 #153 用过 2 次——本批换的是 `go to school late`，与那两句不同句 ✅**）。**生产期请以本订正版为准。**
3. **一错一句、降低密度**：`#154` 的 `I have two sister.` 同句含 `have` ＋ `two` ＋ `sister` 三个可供植错的位——**本报告建议只植 `sister.` 一处**（**同句多靶在库内有先例但稀少**：如实读 #151 第 3 句 `Yesterday I go home late.` 也含两个可植错位，**但只植了 `go` 一处**）。**⚠️ 本报告原稿把 `sister.` 的下标写成 `10`（那是 `two` 的位置），已订正为 `11`**（实读：`#154` tokens 第 12 个 token ＝ 下标 11 ＝ `sister.`）。

### 4.5 展示层（随批上线）

- **`season-24`**（`grammarSeasons.ts` 追加）：`{ id: "season-24", label: "第二十四季 · 也的两张脸", hint: "我也要一个、我也不喜欢——同一个「也」，肯定句一张脸、有「不」的句子另一张", min: 145, max: 147 }`。
  **⚠️ 硬护栏**〔实读 `grammarSeasons.ts:4-6` 注释逐字〕：「**课程号不落在任何区间内会被路径页静默过滤（整课不显示、无报错）**」；`grammarSeasons.test.ts` 四项守门（**本轮全文实读**）：①「每课号都落在某个季区间内」（`:14-22`）②「季区间互不重叠且 min ≤ max」（`:24-34`）③「label/hint 非空」（`:36-41`）④「最高季区间的 max 覆盖全部课程」（`:43-48`）——**`season-24` 的 `max: 147` 必须 ≥ 147**。
- **`m26`**（`GrammarPathPage.tsx` 追加，`afterLesson: 147`）：照 `can-do-m25`（`:290-294`）形态——`title: "我能说「我也不」"`／`zh:` 两张脸一行／`samples:` 三句。
  **⚠️ 携带项**：`can-do-m24` 全仓引用数 0（批二十二 §6.3 第 9 项、批二十三 §6.2 第 7 项两批登记未闭）——**本批的 `m26` 建议一并核引用路径**。
- **封面**〔实读〕：`src/assets/lessons/` **117 张**；`grammarLessons.ts` 里 `cover:` 引用 **144 处**，覆盖 **117 个不同 `coverN`**；**`cover1`–`cover27` 各已被用 2 次，`cover28`–`cover117` 各 1 次**（**逐 count 实读：27 张二用／90 张单用**）。
  **→ 本批建议取 `cover28`／`cover29`／`cover30`**（**gap 恒为 117**——**L142／143／144 用的是 `cover25`／`26`／`27`，而 `cover25` 上一次使用是 L25、`cover28` 上一次是 L28，间隔都是 117 课，与上 23 批完全一致 ✅**）。**三张图本轮已目视核对**（`lesson-28.jpg` ＝ 教室课桌与书包／`lesson-29.jpg` ＝ 电影院门口／`lesson-30.jpg` ＝ 餐桌上一盘苹果）——**`cover30`（餐桌＋苹果）与本批场景锚（饭后餐桌）最贴合，建议给 L145**；**`cover28`（教室）给 L146 或 L147**。
  **⚠️ 封面池压力**：本批交付后**二用池 27 → 30 张、单用池 90 → 87 张**。**单用池短期无虞**，**但二用池持续增长**（批二十一／二十二／二十三连续三批登记）——**建议主理人在 F24-B 关账时评估「三用」策略或新增封面**。
- **`episode`**：「小美的一天 一百四十五／一百四十六／一百四十七」（汉字数字，沿批二十二／二十三先例）。**`scene`**：三课均 `mansion`（同一张饭桌单拱）。

---

## 5. 与已教内容的切分（§5）

> **本节回答任务书 §5：「与哪一课最接近、怎么切开」——这是「一课一增量」的核心论证。**

### 5.1 L145 与 L66（`too…to`）的切分 —— **最接近的一课，必须切干净**

| 维度 | L66（已教） | L145（本批） | 切开方式 |
|---|---|---|---|
| **`too` 的身份** | **「太」**（词前）——`:12174` 逐字「说「太…了（所以）不能…」用 too + 词 + to + 动作」 | **「也」**（句尾） | **L66 `:12241` 已经把这条分界线写好并上线**：逐字「**too 还有一个老身份「也」：站在句子尾巴上——I like tea too（我也喜欢茶）。两个身份看站位：句尾是「也」，词前是「太」。**」→ **L145 的 `deepDive` 只需接住这句话，把它从「配角」扶正为「主角」**——**这不是重讲，是「L66 留下的半句话今天兑现」** |
| **位置** | 词**前**（`too heavy`） | 句**尾**（`like tea too`） | **位置相反 ＝ 观感相反，学生的辨识成本极低** |
| **`targetSentence` 词形** | `It is too heavy to carry.`（6 词） | `I like tea too.`（4 词） | **无任何词面重叠**（实读：两句的交集只有 `too` 一词本身） |
| **是否重复** | ❌ **不重复**：L66 教的是「程度过头」的句法（`too + 词 + to + 动作`），**L145 教的是「也一样」的位置词**——**两者共享词形、不共享句法，正是 L127「同一个 look 两张脸」的既有话术**（`:23787` `grammarLabel` 逐字「**收口 · 零新知（喊人看 vs 说样子）**」） | | ✅ **切干净** |

**⚠️ 一条必须处置的具体风险**：**L145 只要出现 `too` 在词前（`too heavy` 之类），学生就会把它读回 L66**。**→ 建议 L145 三课的全部英文文本里，`too` 只以句尾形态出现（作 G 项校验）**。

### 5.2 L146 与 L83（`something`／`anything`）的切分 —— **同一条规矩的第三次应用，不是重复**

| 维度 | L83（已教） | L146（本批） | 切开方式 |
|---|---|---|---|
| **规矩** | **「不 / 没里换词」**：`something` → `anything`（`:15398` 逐字） | **「不里换词」**：`too` → `either` | **同一条规矩**（**这是本批最大的成本优势**） |
| **换的是哪一类词** | **不点名的东西**（`something`／`anything`） | **句尾的「也」**（`too`／`either`） | **词类不同、位置不同**（一个在宾语位、一个在句尾）→ **学生要做的是「这条规矩还能用在这儿」的迁移，不是重学规矩** |
| **量词侧是否已铺过** | **L30 `:5457` 逐字「好好说的时候用 some，问句和「不 / 没」的时候换 any」** | 同上 | **→ 这是本项目的「否定换词」第三次**（**some/any（L30）→ something/anything（L83）→ too/either（L146）**），**三次都是「肯定一个词、否定另一个词」，形成一条清晰的螺旋** |
| **是否重复** | ❌ **不重复**：**换的词不同、句子位置不同、`either` 是新词** | | ✅ **切干净** |

**★ 建议 L146 的 `deepDive` 明确把这条三次螺旋写出来**（**照 L109 `:20380`「今天 until 入伙，是第四名」的入伙话术**）：**「第 30 课的 some/any、第 83 课的 something/anything——今天 `too/either` 入伙，是这条规矩的第三名。」**

### 5.3 L146 与 L48／L142（条件家族）的切分 —— **两条线，零交集**

- **L48 `:8781`** 逐字「**if 里说现在，主句说将来——if 里不用 will**」；**L142 `:26696`** 是它的第二次应用。
- **本批三课不出现 `if`／`will` 的条件句结构**〔实读：本批三课目标句与变体全部是「喜欢／不喜欢」的一般陈述〕——**`If you don't help me` 类句式实测全库 0 处，本批也不引入**（**留给 `unless` 批次**）。
- **→ 两条线不交叉 ✅。**

### 5.4 L145 与 L11／L43／L51／L55／L98 的切分 —— **认读升格的责任，不是重复**

**这五课的 `too` 全部是「NPC 台词」或「旁支例句」，没有一处是课的目标**〔实读逐处〕：

| 课 | 位置 | 逐字 | 性质 |
|---|---|---|---|
| L11 | `:1974` `dialogue` NPC 行 | `Two? I want one too!` | **NPC 说的一句，玩家只读** |
| L25 | `:4537` `dialogue` NPC 行 | `Does he play sports too?` | 同上 |
| **L43** | **`:7947-7948` `guided` 题 ＋ 答案** | `tokens: ["Drawing","is","fun","too."]` ／ `answer: "Drawing is fun too."` | **⭐ 认读位：学生点过一次词，但没人告诉他为什么是 `too`** |
| L51 | `:9347` `examples` ／ `:9402` `sceneSwings` | `The desks were cleaned too.` | **例句，不是考点** |
| L55 | `:10106` `dialogue` NPC 行 | `Tom and Amy are on the board, too.` | NPC 台词 |
| L98 | `:18251` `dialogue` NPC 行 | `Was he reading, too?` | NPC 台词 |

**→ 切分结论：L145 不是「重复这五课」，是「把这五课用过的一个词正式立岗」**——**先例六次（L127 感官 `like`／L133 种子→批二十一／L109 `as`→L142／案 #7 `Though`→L139／L32 风句→L66／L33 `Someone left them here.`→L84）**，**`deepDive` 须逐字点名 L43 那一句**（**照 L142 `:26770` 点名 L109、L84 `:15657` 逐字「第 33 课的老台词 Someone left them here，今天正式转正」的做法**）。

### 5.5 L147（收口）与 L141／L144（前两次收口）的切分

- **L141 `:26498`** `grammarLabel` 逐字 `收口 · 零新知（两张脸排一行）`——**收的是「although 站前面 vs but 站中间」**（让步与转折）。
- **L144 `:27076`** `grammarLabel` 逐字 `收口 · 零新知（六格排一行）`——**收的是时间家族六格**。
- **L147** 收的是**「也」的两张脸**——**三课的「两张脸」是不同对象**（**位置差 / 时间刻度 / 肯定否定的词差**）。
- **⚠️ 称号重复问题**：**L141 与 L147 的 `grammarLabel` 若都是「两张脸排一行」，字面完全相同**。**→ 建议 L147 改用 `收口 · 零新知（也的两张脸）`**（**§4.3 已备**），**或主理人裁「允许同名」**（**库内 `收口 · 零新知`（不带后缀）的精确串出现 0 次，带后缀的 `收口 · 零新知（…）` 出现 7 次（L118／L124／L127／L133／L138／L141／L144）——后缀各不相同**）。

### 5.6 本批的红线自检（**逐条实读**）

| # | 红线 | 本批处置 | 实测 |
|---|---|---|---|
| **1** | **零术语（29 词）** | **`grammarLabel`／`oneLineRule`／`summary.rule`／`whyZh`／`explain`／`noteZh` 六字段全部零术语** | **§7 附录 A 逐条自检：本轮为 L145–L147 拟的 22 段文案逐字比对 `GRAMMAR_ZERO_TERMS`（实读该文件：词表 29 个术语 ＋ 2 个非术语行首项 `be 动词 · I am`／`like + 名词`，共 31 个引号内字符串）→ 命中 0 处 ✅** |
| **2** | **`too` 只以句尾形态出现（本批新增）** | **L145–L147 段落内 `too` 恒为句尾** | 待生产期 grep 核（**本报告已把候选句全部设计成句尾型**） |
| **3** | **零雨线（批二十三纪律顺延）** | **`rain`／`raining`／`rainy`／`stops`／`stopped`／`the movie`／`ends`／`ended` 零出现** | **批二十三 G13 已实测 L142–L144 段落全零；本批三课设计里不含任何相关词（§3.1 场景锚为餐桌）** |
| **4** | **`once`／`by the time`／`as well as`／`unless`／`in case` 语料锁闭** | **零出现** | 待生产期 grep 核（**批二十三 G11 已对这几词做过同样锁闭，先例可循**） |
| **5** | **复现红线（同一句 ≤6 课）** | **本批全部复现句头寸 ≥5** | **本轮实测 144 课 `practice[].answer` 归一化后：违规 0 句；压线（＝6）1 句（`yesterday i went to the park`）；＝5 的 5 句（`i like reading`／`there is a book on the desk`／`i was busy and happy`／`i am happy`／`i am used to getting up early`）＋ `it looks nice`（5 课）**——**本批不用其中任何一句 ✅** |
| **6** | **目标句 ≤8 词** | **4／6／4 词** | **本轮实测全库 144 课 `targetSentence` 词数分布：中位 5–6；>8 词的只有 3 课（L86 10 词／L101 12 词／L102 14 词，全部是多句课）**——**本批三课远在 8 词以内 ✅** |
| **7** | **罪名枚举 10 项** | **`word_order`／`sv_agreement`／`plural`／`tense` 四项** | **四者均在 `GRAMMAR_ERROR_TAGS` 内 ✅；不碰 `comparison` ✅** |
| **8** | **季节区间覆盖** | **`season-24` `{min:145,max:147}`** | **`grammarSeasons.test.ts` 四项守门，新增季须同步追加 ✅**（§4.5） |
| **9** | **每案 ≥1 净词 ＋ tokenIndex 对齐** | **#154 净词 16／19；#155 净词 16／20；#156 净词 15／20** | **逐案实算，且下标已脚本枚举 ✅**（§4.4） |

---

## 6. 未核实项（§6 · 诚实登记）

| # | 未核实内容 | 为什么没核 | 影响面 |
|---|---|---|---|
| **①** | **`in case` 的词典 CEFR 标位** | 本轮实取 `dictionary/english/in-case` **返回的是 `referee` 条目**（与竞析 §7③ 的遭遇一致，**两轮独立复现，说明该 URL 路由有问题**） | **不影响本批**（`in case` 已判不做）；**但若后续批次要做它，须先解决取源** |
| **②** | **`either` 在疑问句里的用法**（**本批 L146 变体三态的第 3 格**） | Cambridge `either` 页与 `also, as well or too` 页**都只讲了肯定用 too／否定用 either，没有一句讲疑问怎么办** | **L146 的疑问变体 `Do you like coffee too?` 是本报告按「疑问≈肯定侧」的〔推断〕**——**须生产期实测（或改设计成 `Do you like coffee?` 不带 too，以规避）** |
| **③** | **`me too` 的中文侧实证** | 本轮**未取任何中文侧页面**（**本报告全部价值在「我方数据层的实读」，上游口径引自任务书与竞析**，与批二十三口径一致） | **L145 若把 `Me too` 放进 `guided` 认读位，须先证中文侧也是高频**——**本报告建议：先只作 `sceneSwings` 的一句，不进必读位** |
| **④** | **L147 `grammarLabel` 是否允许与 L141 同名** | 库内 `收口 · 零新知（…）` 已出现 7 次（L118／L124／L127／L133／L138／L141／L144，后缀各不相同），**但「两张脸排一行」与 L141 完全相同这件事，本报告未找到守门断言** | **须主理人裁**（**§4.3 已给备选 `收口 · 零新知（也的两张脸）`**） |
| **⑤** | **`too` 的「也」义在全库的精确计数分歧** | **本轮扫描器口径 108／竞析若记 110**——**差异 2 处未定位**（**批二十三已发生过一次同类分歧：`as` 批二十二记 70／本轮实测 133**） | **不影响判档**；**但「108 vs 110」是本报告与竞析的第二处口径差异，建议纳入 §7 的机制化建议** |
| **⑥** | **cloze 落点的真人验证** | 本报告全部 cloze 结论**由独立复刻引擎跑 200 种子产生**（§7 附录 B），**不是真人实测** | **L146 的 `either` 作为空位的实际观感须 F24-A 打样门实测**（**§7 序 3**） |
| **⑦** | **`hunt-close-24` 与 `hunt-close-23` 的重复度** | **两案的第 1／2 句几乎相同**（都是 `I too/I don't…too` 型）——**本报告未找到库内对「相邻两案句子相似度」的守门断言** | **建议生产期人工比对**；**若判过近，`#156` 改换第 1 句为 `I too want apples.`**（实读 GL 0／HC 0） |
| **⑧** | **`season-24` 的 label 用词** | 「**也的两张脸**」是**本报告自拟**——**库内「两张脸」话术极厚**（本轮实读：**全库 `两张脸` 字面量共 70 处，分布在 21 课**；**其中 `grammarLabel` 用「两张脸」的有 3 课**：`:22821`（L122 `两张脸排一行 · used to vs be used to`）／`:26304`（L140 `两张脸 · although 站前面 / but 站中间`）／`:26498`（L141 `收口 · 零新知（两张脸排一行）`）；**`title` 用「同一个 X，两张脸」的有 7 课**：L104／L122／L123／L124／L127／L131）——**但「也的两张脸」这个具体组合未出现过** ✅ | **须走查确认读起来顺；已在 §4.5 与 §5.5 各给一处** |
| **⑨** | **`src/tmp-prd/` 临时脚本目录** | **本轮未触碰**（**本报告全部脚本写在 `/tmp/ruisi24/`，不在仓库内**） | **`tsc --noEmit` 的排除口径仍悬置**（批二十二／二十三两批登记） |

---

## 7. 后续研究建议（§7）

| # | 事项 | 依据（本轮实读） | 负责 | 时机 |
|---|---|---|---|---|
| **1** | **本批须先裁「`too` 的也义升格」这个产品判断** | **库里 6 个位「也」义种子 ＋ L66 `:12241` 已把分界线写出来 ＋ 但 144 课无一课把它当目标**——**这是「先认读后立岗」的第七例，前六例全部成立** | 主理人 | **F24-A 之前** |
| **2** | **「两者」轴（`both`／`neither`／`nor`）须单独立项** | **三词全 0 ＋ `both of`／`neither of`／`either of` 全 0**（**本轮实读**）；**造词 3–4 个超历史最高 3**；**但「两个都」的中文侧频率高于本批做的「也不」** | 竞析＋瑞思 | **批二十五研究期** |
| **3** | **`either` 的 cloze 落点须在 D2 打样门实跑** | **本轮独立复刻实测：`I don't like coffee either.` 的 boost 侧 `either` 落点 52／200 ＝ 26.0%**（**四候选中第二高**）；**ambush 侧落 `don't`（`don't` 在 `GRAMMAR_WORDS` 表内 `:183` 逐字；`either` 不在任何段）——考点不走偏 ✅** | 数析 | **D2** |
| **4** | **`though` 旧判例口径必须先解决，否则让步链永远开不动** | **`grammarLessons.ts:26189`／`:26190`／`:26577` 三处逐字已把 `though` 定性为「旧判例、不是新课」**——**再开课必须回溯改这三处已上线文案** | 主理人 | **让步链立项前** |
| **5** | **`unless` 的 `if…not` 退路须一并设计** | **本轮实测 `If you don't`／`if I don't`／`If we don't`／`if it doesn't` 等 14 种形态全库 GL 0**——**学生连「if 加 not」这条替代说法都没有** | 瑞思 | **unless 批次研究期** |
| **6** | **三单 -s 形式的系统性缺口盘点**（**批二十三登记，本轮未复核**） | 批二十三 §7 序 2 发现「**57 个常见三单形式里 23 个真零**」——**本轮不重复该工作量，仅登记「本批未复核」** | 数析 | **批二十五** |
| **7** | **复现头寸的「预算表」机制化**（沿用批二十三 §7 序 7） | **本轮再次人工实测全 144 课 `practice[].answer`**（`/tmp/ruisi24`，归一化去标点后统计）——**测试只在 >6 时报警，不显示余量** | 数析 | **批二十五** |
| **8** | **封面二用池的长期策略**（沿用批二十一–二十三） | 本轮实测：**144 课用 117 张，27 张二用／90 张单用**——**本批交付后 30／87** | 主理人 | **F24-B** |
| **9** | **`can-do-m24` 零引用的机制缺口**（沿用批二十二／二十三） | 两批均登记未闭；**本批新增 `m26` 时须一并核** | 数析 | **本批生产期** |
| **10** | **口径分歧的机制化**（**批二十三「`as` 70 vs 133」＋ 本批「`too` 108 vs 110」两连发**） | **两次都是我方内部口径差异，两次都由「裸 grep vs 扫描器 vs 快照时点」三者混淆造成** | 数析 | **批二十五（建议优先级高）** |

---

## 附录 A：本轮零术语自检（逐条）

**对 `GRAMMAR_ZERO_TERMS` 实读**：该文件导出 31 个引号内字符串，**其中前两项 `be 动词 · I am`／`like + 名词` 是注释里举例、不在词表内**；**词表实际 29 个术语**（与任务书一致 ✅）：`主语`／`谓语`／`宾语`／`表语`／`定语`／`状语`／`单数`／`复数`／`三单`／`原形`／`时态`／`一般过去时`／`一般现在时`／`现在进行时`／`过去进行时`／`现在完成时`／`情态动词`／`比较级`／`最高级`／`从句`／`语序`／`可数`／`疑问句`／`否定句`／`被动语态`／`第三人称`／`形容词`／`副词`／`介词`。

**本报告为 L145–L147 拟的文案逐条自检**（脚本 `zero-term` 检查，22 段字符串）：

| 字段 | 拟稿 | 命中 |
|---|---|---|
| L145 `grammarLabel` | 「也一样 · too 站句尾」 | **0 ✅** |
| L145 `oneLineRule` | 「说「我也一样」：too 站在句子尾巴上——I like tea too（我也喜欢茶）。它在句尾，不在句首、也不在中间。」 | **0 ✅** |
| L145 `summary.rule` | 「说「我也一样」：too 站句尾（I like tea too）——它在句尾，不在句首、也不在中间。」 | **0 ✅** |
| L146 `grammarLabel` | 「两张脸 · 肯定用 too／否定用 either」 | **0 ✅** |
| L146 `oneLineRule` | 「说「也不」：too 让位，either 上，还是站句尾——I don't like coffee either（我也不喜欢咖啡）。前面有了「不」，句尾就换 either。」 | **0 ✅** |
| L146 `summary.rule` | 「说「也不」：有「不」的句子，句尾换 either（I don't like coffee either）——位置不变，只换词。」 | **0 ✅** |
| L147 `grammarLabel` | 「收口 · 零新知（也的两张脸）」 | **0 ✅** |
| L147 `oneLineRule` | 「同一个「也」，两张脸：肯定句尾用 too（I like tea too）；有「不」的句子，句尾换 either（I don't like coffee either）——看前面有没有「不」。」 | **0 ✅** |
| 三课 `whyZh`（对比卡 6 条方向） | 「中文「也」不分肯定否定，英语分两张脸」／「中文「也」在「不」前面，英语的 either 要跑到句尾」／「位置对了、词要换」等 | **0 ✅** |
| 三课 `guided.explain` | 「too 站句尾」／「前面有 don't，句尾换 either」等 | **0 ✅** |
| 三课 `recall.noteZh` | 「too 站句尾——句首不要它」等 | **0 ✅** |

**⚠️ 一条本批特有的术语陷阱（必须明写）**：**`too`／`either`／`both`／`neither` 在教科书里的标准解释是「副词／限定词／代词」**——**`副词` 在红线词表内**；**`限定词`／`代词` 不在**（**实读词表确认 ✅**）。**→ 六字段里绝对不写「它是一个副词」，改说「它是一个小词，站在句子尾巴上」。** **`deepDive` 允许保留术语**（`grammarLessons.test.ts` 逐字注释：「深挖卡作为「想知道为什么」的进阶内容允许保留术语，故不纳入本断言」）——**但仍建议不用**。

---

## 附录 B：cloze 实测（**独立复刻引擎，37 次循环 ／ 28 个不同句子 × 200 种子**）

**① 关 2 回马枪（复刻 `grammarAmbushService.pickClozeWord` 三级回退）**：**确定性取「第一个语法承载词」**，`GRAMMAR_WORDS` 表逐字实读（`:160-193`）。

| 句子 | 落点 | 空位文本 | 判定 |
|---|---|---|---|
| `I like tea too.` | **`like`** | `I ___ tea too.` | ⚠️ **抽走 `like`，`too` 完好**——**考点不在空位上，但不走偏** |
| `I don't like coffee either.` | **`don't`** | `I ___ like coffee either.` | ⚠️ **抽走 `don't`**——**⚠️ 关键：`don't` 在表内（`:183` 逐字 `"not", "don't", "doesn't", "didn't", "can't", "couldn't", "won't"`），而 `either` 不在表内** |
| `If you don't help me, I can't finish.`（对照，本批不用） | `don't` | `If you ___ help me, …` | 同型 |
| `We will be late.`（对照） | `will` | `We ___ be late.` | — |

**→ 结论（⚠️ 本轮实读订正，原稿此处有误，必须明写）**：

| 词 | 是否在 `GRAMMAR_WORDS` 表内 | 实读行号 | ampush 侧实测 |
|---|---|---|---|
| **`too`** | ⚠️ **在表内** | **`grammarAmbushService.ts:179` 逐字 `"how", "often", "long", "much", "many", "enough", "too",`**（「疑问/程度/频率」段） | ⚠️ **两条实测**：① **`I like tea too.` 落 `like`（`like` 在表内且位置更靠前，`findIndex` 取第一个）——`too` 逃过**；② **但 `Me too!` 这种句子里没有更靠前的表内词 → 落点就是 `too`**（实测 `clozeText: "Me ___!"`） |
| **`either`** | ✅ **不在表内** | `grep -c '"either"' grammarAmbushService.ts` ＝ **0** | ✅ **永远落在别的词上**——`I don't like coffee either.` 实测落 `don't`（`don't` 在表内（`:183` 逐字）） |
| `both`／`neither`／`nor` | ✅ 均不在表内 | 三个 grep 均 0 | （本批不用） |

**→ 关键结论（比原稿更精确）**：**`too` 因为在表内，反而在「短句＋无其他表内词」时会成为空位——这对本批是好事**（**考点能被 cloze 抽到**），**但前提是句子不能含更靠前的表内词**。**`either` 不在表内，故本批唯一的新词永不成空位**——**考点承载必须靠 `contrast` ＋ `guided.spot`**。

**处置（四条，建议都不改引擎）**：
1. **考点承载压在 `contrast`（每课 6 条、≥3 条带 `wrongMark`）与 `guided.spot`（每课 1 道）**——**两条通道都不走 cloze**（沿用批二十二／二十三处置）。
2. **不建议往 `GRAMMAR_WORDS` 加 `too`／`either`**——**理由同批二十三**：关 2 是「回马枪」而非「本课考点复练」，**且加词会改动全库 144 课的关 2 行为（回归面远超单批收益）**。
3. **L146 的 `spot` 题是本批必配的 spot**（**`tokens` 含 `too.`，`wrongToken: "too"`**）——**照 L143 `:26807` `kind: "spot"` 的形态**（**实读：全库共 144 处 `kind: "spot"`——每课正好 1 道，144 课全覆盖 ✅**）。
4. **L145 至少配一句「句子短、无更靠前表内词」的保障句**（如 `Me too!` 或 `I want one too.`）**——`too` 在表内，这类句子的 ambush 空位就是 `too` 本身，考点能落上**（**实测 `Me too!` 落 `too` ✅；`I want one too!` 的 `want` 更靠前且在表内，落 `want`**）。

**② 趁热练（复刻 `grammarBoostService.buildCloze` 的关键词池随机抽）**：

| 句子 | 关键词池 | 200 次落点分布 | **`too`／`either` 命中率** |
|---|---|---|---|
| `I like tea too.` | `like/tea/too` | **too 72**／tea 67／like 61 | ✅ **36.0%** |
| `I like apples too.` | `like/apples/too` | **too 72**／apples 67／like 61 | ✅ **36.0%** |
| `I like music too.` | `like/music/too` | **too 72**／music 67／like 61 | ✅ **36.0%** |
| `My brother likes music too.` | `brother/likes/music/too` | music 60／**too 52**／brother 46／likes 42 | ✅ **26.0%** |
| `Do you like apples too?` | `like/apples/too` | **too 72**／apples 67／like 61 | ✅ **36.0%** |
| `I want some too.` | `want/some/too` | **too 72**／some 67／want 61 | ✅ **36.0%** |
| **`I don't like coffee either.`** | `don't/like/coffee/either` | coffee 60／**either 52**／don't 46／like 42 | ✅ **26.0%** |
| **`I don't like tea either.`** | `don't/like/tea/either` | tea 60／**either 52**／don't 46／like 42 | ✅ **26.0%** |
| `I don't like apples either.` | `don't/like/apples/either` | apples 60／**either 52**／don't 46／like 42 | ✅ **26.0%** |

**→ 趁热练侧 `too` 可落 26.0%–36.0%、`either` 可落 26.0%，均**优于批二十三的 `soon`（16.5%–27.0%）**与**批二十二的 `although`（16.5%–21.5%）** ✅ **本批是近三批里 cloze 友好度最好的一批。**

**③ `too`／`either` 的干扰项安全（本轮核对）**：
- **`either` 不在 `KNOWN_VERBS` 表内**（实读 `grammarBoostService.ts:327-341` 区段逐字核对）→ **不会产出 `eithers`／`eithered`／`eithering`** ✅。
- **`too` 亦不在 `KNOWN_VERBS` 内** ✅ → **不会产出 `toos`／`tooed`／`tooing`**。
- **⚠️ 残留风险一处**：**`too` 作为答案时会进入「功能词同族替换表」吗？** 实读该表（`:280-305` 区段）：**表内家族有 `["in","on","at"]`／`["a","an","the"]`／`["this","that","these"]`／`["my","your","his"]` 等 23 组，`too` 不在任何一组** → **走「课程词汇池」分支**（`courseVocabulary()`，实读注释逐字「约 430 个词」）**配 3 个长度相近的真词**——**这些是库里学过的词，属合规干扰项 ✅**。

**④ 时长建议**：**每课 12–15 分钟**（与批十九 3 课小章、批二十二／二十三 3 课同量；`guided` 6 题 ＋ `practice` 4 题 ＋ `contrast` 6 条）。**L145 首玩略长（15 分钟，含 `too` 的也义认读与 L43 点名）**，**L147 收口课最短（12 分钟，零新知）**。

---

## 附录 C：raw 交叉验证（`grep` 复跑，本轮）

```
grep -c "either" src/data/grammarLessons.ts              -> 0
grep -c "either" src/data/huntCases.ts                   -> 0
grep -c "neither" src/data/grammarLessons.ts             -> 0
grep -c "bothRight" src/data/grammarLessons.ts           -> 316   （字段名，非词次）
grep -oE "[^A-Za-z]both[^A-Za-z]" src/data/grammarLessons.ts | wc -l   -> 0
grep -c "unless" src/data/grammarLessons.ts              -> 0
grep -c "in case" src/data/grammarLessons.ts             -> 0
grep -c "as well as" src/data/grammarLessons.ts          -> 0
grep -c "by the time" src/data/grammarLessons.ts         -> 0
grep -c "seem" src/data/grammarLessons.ts                -> 0
grep -c "although" src/data/grammarLessons.ts            -> 174（裸行数）；引号内字面量口径 171，剔 4 处 id 串后 167（L139 67／L141 52／L140 48）
                                                             ⚠️ 174 − 3(//注释) − 4(id 串 lesson-139-although／lesson-140-but-vs-although／hunt-although-rain／hunt-but-vs-although) ＝ 167 ✅
grep -oiE "(^|[^A-Za-z])though([^A-Za-z]|$)" src/data/grammarLessons.ts -> 3 处（:26189／:26190／:26577，全是旧判例引述；无 id 串假阳性）
grep -c "lesson-145\|lesson-146\|lesson-147" src/data/grammarLessons.ts  -> 0  （id 可用 ✅）
grep -c "number: 154\|number: 155\|number: 156" src/data/huntCases.ts    -> 0  （案号可用 ✅）
grep -c "season-24" src/data/grammarSeasons.ts           -> 0  （季号可用 ✅）
grep -c "can-do-m26" src/pages/GrammarPathPage.tsx       -> 0  （里程碑可用 ✅）
ls src/assets/lessons | wc -l                            -> 117
grep -o "cover: cover[0-9]*" src/data/grammarLessons.ts | sort -V | uniq -c | tail  -> cover28/29/30 各 1 次
npx vitest run                                           -> Test Files 61 passed / Tests 800 passed, 7.01s
```

**上游本机原件复核（`/tmp/`，独立 grep）**：
```
grep -o "incase" /tmp/murphy_int_norm.txt                -> 1（上下文含 113…114incase115unlessaslongasprovided）
grep -o "wouldrather" /tmp/murphy_int_norm.txt           -> 1（59preferandwouldrather）
grep -o "bythetime" /tmp/murphy_int_norm.txt             -> 1（120byanduntilbythetime…）
grep -o "botheitherneither" /tmp/murphy_ess_norm.txt     -> 1（82botheitherneither）
grep -o "too/either" /tmp/murphy_ess_norm.txt            -> 1（42too/eithersoamI/neitherdoIetc.）
grep -c "seem\|appear" /tmp/murphy_int_norm.txt          -> 0 / 0
grep -c "aswellas" /tmp/murphy_int_norm.txt              -> 0
```
**Cambridge 语法页本轮新取 3 页**：`although-or-though`（句尾 though 逐字）／`either`（四张脸与 `not … either` 逐字）／`in case`（"We don't use in case to mean 'if'." 逐字）＋ `also-as-well-or-too`（否定用 either 逐字）＋ `both`（typical errors 逐字）＋ `unless`（"except if" 与 ❌will 逐字）。

---

## 附录 D：本报告的三类标注

- **〔实读〕**：由本轮的扫描器／`grep`／字段抽取／引擎复刻直接产生，**附行号或命令可复核**。
- **〔推断〕**：中文频率、痛感、学生心理、疑问句里 `too` 的取舍——**已在 §2 与 §6② 逐条标注**。
- **〔未核实〕**：**已在 §6 逐条登记 9 项**，其中**影响本批落盘的只有两项**（**§6② 疑问变体、§6④ L147 label 是否同名**）。

**⚠️ 两条必须由主理人裁、本报告不能代裁的事**：

1. **「`too` 的也义升格」这个产品判断**（§7 序 1）：**它是全库第七例「先认读后立岗」，前六例全部成立，但本项的认读位（L43 的 `guided`）在库内从未被任何一课的 `deepDive` 点名过**——**若主理人认为「认读位过于边角、不足以支撑升格」，本批应降为 2 课（L145 立岗 ＋ L146 切开，砍收口）并下调档位至 B−**（**代价：丢掉「两张脸并排」这个教学动作，而它是本项唯一的独立性证明**——**与批二十三 `as soon as` 砍掉切开课的代价同型**）。
2. **「两者」轴的排期顺位**（§7 序 2）：**「两个都／两个都不」的中文频率高于本批的「也不」**（〔推断〕），**但造词成本 3–4 超历史最高 3**——**这与批二十二／二十三两批悬置的「造词上限政策」是同一件事，建议在 F24-B 关账时一并裁**。

---

> 本研究报告由产品战略团队瑞思执笔，经主理人汇编落盘。重要决策请由产品负责人审定。
