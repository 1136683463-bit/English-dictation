# 瑞思 · 用户研究与内容缺口分析
## `gave`（give 的昨天版）：可做性、立课 vs 挂靠、对照卡与外部依据（第 47 批）

- 日期：2026-09-22
- 范围：`src/data/grammarLessons.ts`（**203 课**）+ `src/data/huntCases.ts`（**212 案**）+ `src/data/grammarSeasons.ts`（28 季）＋ **全库字段遍历（38,760 个字符串字段，55 种槽签名）**
- 性质：**纯研究**——本报告不改任何代码与数据
- 上游：第 43 批（L197/L198/L199）· 第 44 批（L200 felt/kept + L201**曾建议给 gave 立课**）· 本批 L203 已上线
- ⚠️ **本批三处独立结论与简报/上批不同**：① 简报的 `give 25/5` **可复现，但口径有两处瑕疵**（正侧漏掉答案槽、错侧混进 3 句正确句）——§2.1；② **「立课还是挂靠」我判「立课」，与第 44 批竞析报告的「挂靠、不立课」相反**——§3.4、§7 U4；③ 「`gave` 正侧 0」的表述需修正：它在 `huntCases` 里作为**正确 token** 出现 3 处——§2.2。

---

## ① 结论摘要

### 立课还是挂靠：**两种都可行，但我独立判断倾向「立课」，且必须同时挂 L63 的回流题**

| 方案 | 判定 | 一句话理由 |
|---|---|---|
| **立 L204，只收 `gave` 1 个点** | **✅ 推荐（首选）** | `gave` 是**已承诺未交付**：L199 的 `contrast[5].whyZh` 逐字承诺「give 变 gave」，而 `gave` 在**句子位置出现 0 次**。承诺必须由一课来兑现，加一张回流卡兑现不了「从未见过这个词用在句子里」。 |
| **纯挂靠 L63（加对照卡/回流题）** | ⚠️ **不能单独用** | L63 的 6 张对照卡**全部**服务于「先给谁、后给什么」的站位，**没有一张讲动词形状**（§3.2 逐条列出）。塞一张 `gived → gave` 会让这一课的轴线从「站位」漂移到「形状」；而且 L63 在 L197 之前，用户当时还没有「昨天版换零件」的概念底座。 |

**若立课（L204）的 targetSentence：**

> **`I gave her the book, and she gave me a big cake.`**
> 中文意图：**我把那本书递给了她，她回赠了我一大块蛋糕。**
> 12 词 · 最长分句 **12 词**（L203 是 14 词，上限 19，**跳 −2，完全在闸门内**）· 未教过的词 **0 个**（逐词核对见 §6 核查 5）

**为什么选 `mansion`（"小美的一天"连续剧场景）：** 见 §4.1。

### 三条带标记的中式错句（都能凑出来，且与库内 0 重复）

| # | 错句 | 标记词 | 中文母语者为什么会这么说 | 库内重复 |
|---|---|---|---|---|
| 甲 | `I gived her the book, and she gave me a big cake.` | `gived` | **-ed 是学到的第一条昨天版规矩**（L10 教的），且汉语「给」的过去表达对形态零要求——中文母语者的默认动作就是「动词 + ed」 | **0**（全库 `gived` 命中 0 处） |
| 乙 | `I gave her the book, and she give me a big cake.` | `give` | **「昨天」这个信号只落在前半截**。用户认到 `gave` 之后，把 `and` 后面的半句当成「新的一句、另起炉灶」——中文没有「一句里时态要一路贯穿」的要求 | **0**（全库无此句，亦无「gave … give」同句并存） |
| 丙 | `I gave to her the book, and she gave me a big cake.` | `to her` | **to 是「给」的中文肌肉记忆**（give … to …／「给到她」）。用户学过 `give it to me`（L63），把它**过度推广**到「东西是实实在在的一样东西」的场合——而 L63 的规矩恰恰是「小词才要翻身垫 to」 | **0**（全库 `gave to her/him/me` 命中 0 处） |

**关键工具发现：`gave` 不是「0 出现」——它在 `huntCases` 里作为正确 token 出现 3 处**（#9 / #20 / #27，均 `reviewed: true`）。用户**读到过** `gave`，缺的是**被讲解**。这修正了简报「正侧 0」的表述，也让 L204 的落点更自然（§3.4）。

---

## ② 可做性判定

### 2.1 ⚠️ 先修正简报的数字口径：`give 正侧 25 / 错侧 5` **可复现，但正侧 25 漏掉了答案槽、错侧 5 里混进了 3 句正确句**

简报给的表是：

| 形式 | 正侧 | 错侧 |
|---|---|---|
| `give` | **25** | 5 |
| `gives` | 0 | 1 |
| **`gave`** | **0** | 1 |
| `given` | 0 | 0 |

我用 **8 种正侧口径 × 6 种错侧口径**穷举（脚本 `.gave-count.mts` + `.gave-repro.mts` + 子集和搜索），**只有一组组合能逐字复现 25/0/0/0 与 5/1/1/0**，它就是简报用的口径：

**正侧 25 的口径 = `targetSentence + dialogueEn + examples[].en + contrast[].correct + variants[].en + sceneSwings[].en + dialogue[].en + blocks[].text + guided[].tokens[] + guided[].options[] + practice[].tokens[] + practice[].answer + recall.answer`（**不含** `guided[].answer` / `guided[].replaceBase` / `recall.noteZh` / `summary.points[]` / `oneLineRule` / `grammarLabel` / 全部讲解散文).** 逐条对上 25 处（见 §6 核查 4）。

**这个口径有两个问题，必须说清，否则后续批次会跟着算错：**

1. **正侧 25 偏高但方向保守**：它**漏掉**了 `guided[].answer`（3 处）、`guided[].replaceBase`（1 处）、`summary.points[]`（4 处）、`oneLineRule`（2 次出现）、`recall.answer`（1 处）等**明确的正面教学位**。按「全字段 · 排除 spot.answer + bothRight.wrong」的完整口径，`give` 正侧是 **58 字段 / 67 次出现 / 35 个不同字符串**。
2. **错侧 5 里只有 2 处是真错句**，另 3 处是 `bothRight: true` 卡的 `wrong` 字段——**那里装的是正确句**：
   - `L68 contrast[3].wrong = "Please give the gift to me."`（bothRight 卡，`correct = "I bought the gift for my mom."`）
   - `L68 contrast[5].wrong = "Please give me the book."`（bothRight 卡）
   - `L199 contrast[5].wrong = "Please give me the book."`（bothRight 卡）
   真正的错侧只有 `L63 guided[5].options[1] = "Please give me it."` 与 `options[2] = "Please give it me."` 两处。

**严格口径（排除 spot 题 `answer` + `bothRight` 卡的 `wrong`）下 `give` 的真错侧 = 2 处**（就是上面那两条 `give me it` / `give it me`，都是 L63 站位题的错误选项）。

> **对结论的影响**：**零**。`gave` 在所有口径下都是「句子位置 0 处、只有 1 处讲解散文里的点名」（§2.2），`gived` / `given` 全库 0 处。数字口径问题只影响可追溯性，不影响任何判断。

### 2.2 ★核心事实：`gave` 是**已承诺未交付**

**承诺方（L199，已上线）**：`contrast[5]`（`bothRight: true`）的 `whyZh` 逐字是：

> 「两句都对——第 63 课那句的 give 也有自己的昨天版：**give 变 gave**（跟今天的 sit → sat 一样，都是里面的 i 换成 a）。give 的位置规矩在第 63 课，形状在今天的 sat 这条线上。」

这张卡的 `wrong` 字段是 `"Please give me the book."`、`correct` 是 `"I sat next to her and caught the bus."`。

**交付情况**：

| 位置 | `gave` 出现 | 用户能否见到「gave 用在句子里」 |
|---|---|---|
| 句子槽（targetSentence / examples[].en / contrast[].correct / variants[].en / sceneSwings[].en / dialogue[].en / guided[].answer / practice[].answer / recall.answer） | **0** | ❌ |
| 讲解散文（`contrast[5].whyZh`） | **1** | ❌（只是「点名」，不是句子） |
| 错侧（`L199 practice[2].distractors[0] = "gave"`） | **1** | ❌（是干扰项，用户被要求**别**选它） |
| `huntCases`（#9 / #20 / #27 的正确 token） | **3** | ⚠️ 读到了，但那是找错环节，且**没有任何一课讲解它** |

**结论**：`gave` 的缺口不是「没见过」，而是**「点名了、许了诺、从没兑现」**。用户在 L199 读到「give 变 gave」，往后 4 课（L200–L203）一次都没再见过 `gave` 用在句子里。**这是一条对用户可见的欠条。**

### 2.3 三条错句的可做性——逐条论证

#### 甲 `*I gived her the book.`（加 -ed）——**可以做，成因最硬**

- **负迁移机制**：L10「昨天去了公园」教的第一条（也是唯一一条）普适规矩就是「昨天的事 → 动词加 -ed」（`played` / `walked` / `watched`）。项目在 L197–L203 连续 7 课反复讲「这批老朋友**不加 -ed**」——**恰恰说明「加 -ed」是零基础用户的第一反射**。`give` 是 Oxford 3000 A1 档高频词，`gived` 是最自然的过度推广。
- **可做性证据**：全库 `gived` **命中 0 处**（课时 + 案件，词边界）。
- ⚠️ **一个诚实的弱项**：第 44 批的报告登记过「`gived` 我在全部可访问源里一处也没见到，纯推理」（该报告 §9 不确定项 I4）。**本轮我也没在任何可访问权威源里抓到 `gived` 的书面证据**。但注意：**「权威源不列 `gived`」不等于「学习者不说 `gived`」**——权威源只列正确形式，从不列学习者的错形。项目自身先例足够：L199/L200/L201/L202/L203 的对照卡第 1 张**全部**是 `*sitted` / `*feeled` / `*sleeped` / `*drawed` / `*weared` 型。**`gived` 与这条既有生产线完全同构**，是这一族最标准的一张卡。

#### 乙 `*I gave her the book, and she give me a big cake.`（半句不换）——**可以做，而且这是本族的标准第 2 张卡**

- **负迁移机制**：中文的「昨天」是一个**句首时间状语**（「昨天我把书给了她，她给了我一块蛋糕」）——**汉语动词形态零变化**，「昨天」这个词管到哪儿完全靠语义，不靠形态标记。用户改成 `gave` 之后，把 `and` 后面的半句当成**另起一句**，动词就滑回原样。
- **项目先例**（这是本族最稳定的一张卡，L197–L203 每课第 2 张全是它）：
  - L197 `contrast[2]`：`*I thought about it and know the answer.` → 「两件事都是昨天做的——前半截用了 thought，后半截也要跟着穿昨天版」
  - L199 `contrast[1]`：`*I sat next to her and catch the bus.`
  - L203 `contrast[2]`：`*...and I want to wearing it again today.`
- **可做性证据**：全库无此句，亦无「同一字段内 `gave` 与 `give` 并存且都当动词用」的构造。

#### 丙 `*I gave to her the book.`（多垫一块 to）——**可以做，而且是本批唯一「有权威源逐字背书」的错型**

- **负迁移机制**：`to` = 「给」的中文肌肉记忆 + **对 L63 的过度推广**。L63 教的是「东西换成小词 `it` 时才要翻身垫 `to`」（`give it to me`）。用户把这条**只适用于小词的规矩**推广到「东西是 `the book` 这种实实在在的一样东西」的场合——而 L63 的 `deepDive.paragraphs[1]` 明写 `*give the book me` 不行、`paragraphs[2]` 明写「小词太轻，站不住前面那个位子」。
- **权威源逐字背书**（Cambridge `Word patterns: give`，见 §5 V1）：该页**专门有一条**讲这个错，逐字是
  > "When the indirect object comes before the direct object, don't say 'give to someone something', just say give someone something:"
  > 页面上给出的错句是 `He gave to his mother the flowers.`
  **Cambridge 的正文错例用的正是 `gave`！** 这既是可做性证据，也是「这题值得教」的权威依据。
- **可做性证据**：全库 `gave to her` / `gave to me` / `gave to him` **命中 0 处**；`give to someone` 型讲授 0 处。

#### 关于 `*I given her a book.`（given 当昨天版）——**建议不做**

- `given` 是**做过版**（`have given`，L21/L23 那条线），不是昨天版。把它当错句讲，会把 L203 刚建立的「wore vs worn」区分（L203 `contrast[1]` 明写「worn 不是一个人出场用的形状——它得跟着 have／had」）**回退成混乱**。
- 更关键：`given` 全库**课时 0 处、案件 0 处**，用户**从未见过** `given`。拿一个用户没见过的形式做错句，等于在错侧的槽位里**第一次引入新形式**——这是本项目从 L202/L203 起明确的做法（L203 `deepDive` 末段：「还有一个形状叫 worn——那个得跟着 have／had 一起出场，今天先不碰」）。**⇒ 与 L203 一致：`given` 只登记、不进对照卡。**

**可做性总判：✅ 能凑出 3 条带标记的中式错句**（甲/乙/丙），成因真实且互不重叠（形状 / 一致性 / 站位），全部与库内 0 重复。

---

## ③ 立课 vs 挂靠——独立论证

### 3.1 先看项目先例，但我不照抄

| 先例 | 做法 | 与 `gave` 的可比性 |
|---|---|---|
| `felt` / `kept`（L200） | **立课**（2 个点，同一条换法） | 可比：都是「换零件」族；但 `gave` 只有 1 个点 |
| `lose` / `break`（简报说走了挂靠 L46） | — | ⚠️ **本条不成立**：实测 **L46 里 `lose` / `break` 命中 0 处**（L46 是 `enjoy reading and I want to travel` 的收口课）。该先例经我独立核实**在库里找不到**，不采用。 |
| `gave` 上批（批 44）曾挂靠 L199 | 已发生 | ⚠️ **恰恰是「挂靠失败」的实证**：挂靠 L199 的结果就是那张 `contrast[5]` 卡——**只点名、没交付**。挂靠 = 用户见过承诺，见不到用法。 |
| `among`（L196，1 个点） | **立课** | ✅ 直接可比：**项目有「单课只收 1 个点」的既有先例**，L196 全课就是 `among` 一个点 |

**⇒ 先例给出的结论是：单点立课在本项目合法（L196），而 `gave` 的挂靠先例（L199）恰好留下了欠条。**

### 3.2 为什么不在 L63 加对照卡（挂靠最自然的那个点，也不合适）

L63 `Please give me the book.` 的 6 张对照卡**全部**服务「先给谁、后给什么」的站位，**一张都不讲动词形状**（逐条）：

| # | 卡 | 讲的是 |
|---|---|---|
| 1 | `*Give me it.` → `Give it to me.` | it 要翻身垫 to |
| 2 | `*Give the book me.` → `Give me the book.` | 两样东西挤一块会撞车 |
| 3 | 双正解 `Give me the book.` / `Give the book to me.` | 两种站位都对 |
| 4 | 双正解 `Pass me the pen.` / `Give me the pen.` | pass 和 give 同一套站位 |
| 5 | 双正解 `There is a book on the desk.` / `Please give me the book.` | 第 26 课的书走到今天 |
| 6 | 双正解 `Can I have a milk tea?` / `Could you help me?` | 给与请两个方向 |

**在 L63 塞一张 `gived → gave`，会让这一课的轴线从「站位」漂到「形状」**——而 L63 的 `grammarLabel` 就是「给东西 · give me the book / give it to me」，站位是它的全部内容。

**外加时序问题（决定性）**：L63 在 L197 之前。用户在 L63 时**还没有**「昨天版要换零件」的概念底座（那条线是 L197 才铺的）。在 L63 讲 `gave` 要么超前，要么只能在 L197 之后**回填**——既然无论如何都要回填，就不该选一个轴线冲突的挂靠点。

### 3.3 为什么「只挂靠、不立课」会是错的

**挂靠能加的最多是「一张对照卡」或「一道回流题」。但用户的缺口不是「没听过这个形式」，而是「没在句子里用过这个词」：**

- 一张对照卡能让用户**再读一遍** `gave`（他 L199 已经读过了）——不新增任何**用法信息**。
- 一道回流题（如 `Please give me the book.` 加干扰项 `gave`）用户**已经被考过一次**：L199 `practice[2]` 的 `distractors[0]` **就是 `gave`**。再加一道是重复付出、零收益。
- 而 L204 能提供的、挂靠给不了的东西有三件：**① `gave` 的两个句型各自怎么用**（`gave her the book` / `gave the book to her`）**② 否定与疑问里 `gave` 要穿回 `give`**（`didn't give` / `Did you give`——这是 L203 刚建立的「说不用 didn't 领、后面穿原样」在昨天版上的延伸）**③ 一个可复述的换法**（`i → a`，接 L198/L199 那条线）。

### 3.4 ★我独立判断：**立 L204，同时挂 L63 的回流题**

**理由三条，按权重排序：**

1. **欠条必须兑现（决定性）**。L199 的 `contrast[5].whyZh` 是一句**对用户可见的承诺**：「give 变 gave」。用户读到它、然后 **4 课不见 `gave` 用在句子里**。承诺的兑现方式是「给这个词一课」，不是「在别处补一句」。**这是产品诚信问题，不只是内容排期问题。**

2. **`gave` 的新点数不止 1 个——它是 1 个**形状**点 + 1 个**在昨天版上重演的站位点**，而站位点只能在新课里讲。L63 教了「先给谁、后给什么」的**现在版**；`gave` 让同一个站位在**昨天版**上重演一次（`gave her the book` 仍然不垫 `to`，只有小词才翻身）。**这条「老站位换新形状」的交叉点，挂 L63 会破坏 L63 的轴线、挂 L199 又离 `give` 太远**——只有立一课才放得下。

3. **单点立课在本项目有先例（L196 `among`），且本批的结构代价为零**。L204 只需标准档（`blocks=2 / contrast=6 / guided=6 / practice=5 / examples=4 / sceneSwings=3 / deepDive=y / recall=y`），与 L197–L203 **完全同构**；`grammarSeasons.ts` 的 `season-28` 上界从 `max: 203` 改成 `max: 204` 即可（该文件有显式硬护栏注释与 `grammarSeasons.test.ts` 守门，必须同步改，否则新课会在路径页**静默消失**）。

**⇒ 明确结论：立 L204（`gave`，1 个点），并在 L204 的对照卡里放一张指向 L63 的「双正解」回流卡。**

### 3.5 我明确否掉的两个替代方案

- **不立 L204，改在 L63 与 L199 各加一张卡**：两张卡都兑现不了欠条（用户还是没在句子里用过 `gave`），且要动两节已上线课 —— 成本更高、收益更低。
- **把 `gave` 与 `given` 合成一课立 L204**：`given` 是**做过版**（`have given`，L21/L23 那条线），把两个不同形状放一课会重演 L203 刻意避免的混淆（L203 `deepDive` 末段明写「worn 那个得跟着 have／had 一起出场，今天先不碰」）。**`given` 只登记，不进 L204。**

---

## ④ 对照卡设计（若立 L204）

### 4.1 课程骨架

| 项 | 值 |
|---|---|
| id / number | `lesson-204-gave` / `204` |
| title | **「递过去了」** |
| grammarLabel | **`昨天版 · give 变 gave`** |
| episode | 小美的一天 二百零四 |
| **scene** | **`mansion`** |
| 段位（`seasonId`） | `season-28`（`max` 203 → **204**） |
| cover | 沿用封面池 `lesson-87.jpg`（`cover87`）——2026-09-20 起封面池复用是既定做法（L192–L203 依次复用 `lesson-75…86.jpg`，13 张池子轮转，最大复用 4 次） |
| blocks | 2 |
| contrast | **6**（3 带标记错句 + 3 双正解） |
| guided | 6 |
| practice | **5**（含一道 C 层新句 + 一道疑问变体） |
| examples | 4 |
| sceneSwings | 3 |
| deepDive / recall / summary / variants | 各 1（与 L197–L203 同构） |

**targetSentence：`I gave her the book, and she gave me a big cake.`**
中文意图：**我把那本书递给了她，她回赠了我一大块蛋糕。**

**为什么选 `mansion`：**

1. **`mansion` 是本项目「家里的事」的既有叙事空间（65 课，全库最多）**——`gave` 的原型场景是「把东西交到人手上」，发生在屋子里最自然。
2. **与前后课的场景不撞**：L201 `mansion` → L202 `island` → L203 `city` → 若 L204 用 `mansion`，与 L201 隔了两课，不会形成「连着同一张插画」的观感。若改用 `sparkle`（末次 L137）或 `desert`（只 1 课）会显得刻意。
3. **`space` 明确保留**：它是 14 个合法场景里**唯一 0 课**的（实测），首次登场应当留给一节能承载太空叙事的课；「递东西」与太空无关，**不建议**在这一课消耗它（与第 44 批的判断一致）。
4. **与 L63 的对照可读**：L63 是 `campus`（手工课上请同桌递书），L204 是 `mansion`（在家里把书递给家人／同伴）——同一件事在两个场景里各发生一次，第 63 课「先给谁、后给什么」的老规矩在 L204 复现时不显得是同一课的翻版。

**英文全字段（供实现）：**

```
targetSentence: "I gave her the book, and she gave me a big cake."
dialogueEn:     "I gave her the book, and she gave me a big cake."
blocks:
  [0] text: "I gave her the book"        role: "我把那本书递给了她（give 的昨天版是 gave）"
  [1] text: "and she gave me a big cake" role: "她回赠了我一大块蛋糕（还是先给谁、后给什么）"
examples:
  [0] { en: "I gave her the book, and she gave me a big cake.", zh: "我把那本书递给了她，她回赠了我一大块蛋糕。" }
  [1] { en: "I gave her the book.",                          zh: "我把那本书递给了她。" }
  [2] { en: "She gave me a big cake.",                       zh: "她回赠了我一大块蛋糕。" }
  [3] { en: "Please give it to me.",                         zh: "请把它递给我。（第 63 课：小词才要翻身垫 to）" }
variants:
  [0] 肯定 { en: "I gave her the book.",        zh: "我把那本书递给了她。" }
  [1] 否定 { en: "I didn't give her the book.", zh: "我没把那本书递给她。",
             noteZh: "说「不」用 didn't 领，后面的词穿回原样——didn't 【give】。第 32 课的老规矩。" }
  [2] 疑问 { en: "Did you give her the book?",  zh: "你把那本书递给她了吗？",
             noteZh: "Did 搬到句首，后面的词穿回原样——【give】" }
sceneSwings:
  [0] { sceneZh: "说把书递给了她、她回赠了蛋糕", en: "I gave her the book, and she gave me a big cake.", zh: "我把那本书递给了她，她回赠了我一大块蛋糕。" }
  [1] { sceneZh: "只说她的回赠",               en: "She gave me a big cake.",                        zh: "她回赠了我一大块蛋糕。" }
  [2] { sceneZh: "东西在前、末尾垫 to 的说法",  en: "I gave the book to her.",                        zh: "那本书我给了她。" }
guided answers（6 道，含 1 道 spot、1 道 replace）:
  见 §4.4
practice answers（5 道，含 1 道 C 层新句）:
  见 §4.5
recall:
  promptZh: "生日那天，小美把一本自己挑的书递到朋友手上，朋友回赠了她一大块蛋糕。凭记忆，写出她那句英文。"
  intentZh: "我把那本书递给了她，她回赠了我一大块蛋糕。"
  answer:   "I gave her the book, and she gave me a big cake."
  noteZh:   "give 的昨天版是 gave（i 换成 a）——先给谁、后给什么（第 63 课）。"
summary:
  rule: "give 的昨天版是 gave（i 换成 a，跟第 199 课 sit 变 sat 一个换法）——站位照第 63 课的老规矩：先给谁、后给什么。"
  points: 见 §4.6
deepDive:
  title: "gave 的两个说法"
  paragraphs: 见 §4.6
```

**oneLineRule（首屏一句话规则，零术语已核）：**

> give「给」的昨天版是 gave——里面的 i 换成 a，别的字母一个都不动，也不加 -ed：I gave her the book（我把那本书递给了她）。这个换法跟第 198 课的 swim 变 swam、第 199 课的 sit 变 sat 是同一条。句子的站位还是第 63 课的老规矩——先给谁（her）、后给什么（the book）；下半句她回赠我一大块蛋糕，照样是 gave me a big cake。

### 4.2 对照卡 6 张（3 带标记错句 + 3 双正解）

| # | wrong | wrongMark | correct | whyZh |
|---|---|---|---|---|
| **1** | `I gived her the book, and she gave me a big cake.` | `gived` | `I gave her the book, and she gave me a big cake.` | give 的昨天版不是加 -ed——它换的是里面的零件：i 换成 a，就成了 gave。第 198 课的 swim 变 swam、第 199 课的 sit 变 sat 走的都是这一条。 |
| **2** | `I gave her the book, and she give me a big cake.` | `give` | `I gave her the book, and she gave me a big cake.` | 两件事都是昨天做的——前半截用了 gave，后半截的 give 也要跟着换。中文一句里有几个动作都靠「昨天」那个词管着，英语里每个动作都要自己换。 |
| **3** | `I gave to her the book, and she gave me a big cake.` | `to her` | `I gave her the book, and she gave me a big cake.` | 先给谁、后给什么——her 直接站在 gave 后面，中间不垫 to：gave 【her】 the book。第 63 课的老规矩：东西是 the book 这种实实在在的一样东西，就不用翻身；只有换成小词 it 才要绕到后面垫 to（give it to me）。 |
| **4**（双正解） | `Please give me the book.` | `null` | `I gave her the book, and she gave me a big cake.` | 两句都对——第 63 课那句是现在请人把书递过来（give 穿原样）；今天这句是昨天已经把书递出去了（gave 换了零件）。同一个「先给谁、后给什么」的老站位，昨天今天两班岗。 |
| **5**（双正解） | `I sat next to her and caught the bus.` | `null` | `I gave her the book, and she gave me a big cake.` | 两句都对——第 199 课那句的 sat 跟今天的 gave 是同一条换法（里面的 i 换成 a）；而且第 199 课那张卡早就点过名：give 变 gave。今天这一课就是把那句点名接完。 |
| **6**（双正解） | `I bought a gift for my mom.` | `null` | `I gave her the book, and she gave me a big cake.` | 两句都对——第 68 课那个 for 是「为你办」（买给你的），to 是「递到手」；今天这句 gave her the book 走的正是「递到手」那一家，只是换成了昨天。 |

**双正解对照对象的库内存在性已逐个核实**（§6 核查 7）：`Please give me the book.` 存在于 **L63/L68/L199**；`I sat next to her and caught the bus.` 存在于 **L199**；`I bought a gift for my mom.` 存在于 **L68**。

**⚠️ 注意 `Please give me the book.` 已被 L68[5] 与 L199[5] 用作 bothRight 的 `wrong` 字段**——L204 将是**第 3 次**使用。这在项目里是正常的（实测 bothRight 卡有 **106 个字符串被复用**，最多复用 **7 次**：「It's cold today.」）。若希望避免，**替代句**：`Give it to me.`（L63 有，**未被任何 bothRight 卡用过**）。

**关于第 5 张卡（`sat`）的取舍**：这张卡是**全批最重要的一张**——它把 L199 那句「点名」正式**回收**。若第 44 批报告的「挂 L199」方案已落地成课，则此卡必须保留以完成闭环；若未落地，此卡**就是**闭环本身。

### 4.3 三条错句的成因（供文案与后续走查）

| # | 成因归类 | 用户的中文思路 | 为什么这个错值得拦 |
|---|---|---|---|
| 1 `gived` | **规矩过度推广** | 「昨天 → 动词加 -ed」是 L10 教的唯一普适规矩 | 全库 `gived` 0 处 ⇒ 用户第一次在这里被明确拦住 |
| 2 `she give` | **时态贯穿意识缺失** | 汉语靠句首「昨天」管全句，动词形态不变 | 这是本族最稳定的第 2 张卡（L197–L203 每课都有同型） |
| 3 `gave to her` | **只适用于小词的规矩被推广到大东西** | 「给」= to 的肌肉记忆 + 把 L63 的 it 规矩用错地方 | **有 Cambridge 逐字错例背书**（`He gave to his mother the flowers.`）——本批唯一有权威源直接支撑的错型 |

### 4.4 guided（6 题，与 L197–L203 同构：1 choose + 2 arrange + 1 spot + 1 arrange(回流) + 1 replace）

| # | kind | promptZh | 关键字段 |
|---|---|---|---|
| 1 | `choose` | 生日那天，你想说昨天把那本书递给了她。 | `before: "I"`, `after: "her the book yesterday."`, `options: ["gave","gived","gives"]`, `answer: "gave"`, `explain: "说昨天的事用 gave——里面的 i 换成 a，不加 -ed；gives 是「他/她给」，多一个小 s。"` |
| 2 | `arrange` | 你想说你把书递给了她，她回赠了你一大块蛋糕。 | `tokens: [I, gave, her, the, book,, and, she, gave, me, a, big, cake.]`, `answer: "I gave her the book, and she gave me a big cake."`, `explain: "昨天给了她书（I gave her the book）＋ 她回赠了蛋糕（and she gave me a big cake）——两个都给过了，两个都用 gave。"` |
| 3 | `arrange`（回流 L63） | 先复习一下——第 63 课学过：请把那本书递给我。 | `tokens: [Please, give, me, the, book.]`, `answer: "Please give me the book."`, `explain: "复现第 63 课：先给谁（me）、后给什么（the book）——今天换成了昨天，站位没变。"` |
| 4 | `spot` | 有人是这样说的，你帮他看看：哪个词块不太对？ | `tokens: [I, gived, her, the, book, yesterday.]`, `wrongToken: "gived"`, `answer: "gived"`, `correctionZh: "give 的昨天版是 gave——里面的 i 换成 a，不加 -ed：I 【gave】 her the book。"`, `explain: "这批老朋友不加 -ed，各有各的样子。"` |
| 5 | `arrange`（回流 L199） | 再对照一句——第 199 课学过：我坐到了她旁边，赶上了公交车。 | `tokens: [I, sat, next, to, her, and, caught, the, bus.]`, `answer: "I sat next to her and caught the bus."`, `explain: "复现第 199 课：sat 跟今天的 gave 是同一条换法（i 换成 a）——那一课还点过名，说 give 变 gave。"` |
| 6 | `replace` | 句子变身：「I gave her the book.」把 her 换成 my mom，怎么变？ | `replaceBase: "I gave her the book."`, `replaceTarget: "把 her 换成 my mom"`, `options: ["I gave my mom the book.","I gave to my mom the book.","I gived my mom the book."]`, `answer: "I gave my mom the book."`, `explain: "换个人——gave 照样不加 -ed；my mom 直接站在 gave 后面，中间不垫 to（第 63 课的老站位）。"` |

**⚠️ 实现注意（三处硬约束）：**

1. **`spot` 题的 `answer` 必须写成那个**错词**（`answer: "gived"`），与 `wrongToken` 一致**。判定权威是 **`wrongToken`**：`src/edge/lessonFlow.ts:179`（判题）与 `:201`（重试）都写 `const target = step.wrongToken ?? step.answer;`，`src/edge/e0-lesson-data-invariants.test.ts:105` 同式（只断言 `target` 在 `tokens` 里）。**实测 203 道 spot 题里 201 道的 `answer === wrongToken`，2 道不等**（`L96 guided[3]` 与 `L102 guided[3]`：`wrongToken = "rain."`、`answer = "rain"`，只差一个句点）——**即「相等」不是被断言强制的硬不变量，而是既成惯例**。**但实现 L204 时必须照惯例写成相等**：否则任何按 `answer` 判定的消费者（如本报告 §6.0 的排除口径）就会把错词算成正解。
2. **`guided[].answer` 里不得出现 `gived`** 以外的错形（本项目 `guided[].answer` 一律算正面槽）。
3. **`tokens[]` 必须与 `answer` 的词集一致**（去标点、忽略大小写、排序后相等），守门见 `grammarLessons.test.ts` 第 33 行。

### 4.5 practice（5 题，A/B/C 分层已实测）

| # | promptZh | tokens | distractors | answer | 层 |
|---|---|---|---|---|---|
| 1 | 你想说你把那本书递给了她，她回赠了你一大块蛋糕。 | `I / gave / her / the / book, / and / she / gave / me / a / big / cake.` | `["gived"]` | `I gave her the book, and she gave me a big cake.` | **A**（目标句） |
| 2 | 同学问你把那本书递给她了吗。 | `Did / you / give / her / the / book?` | `["gave"]` | `Did you give her the book?` | **B**（变体，**满足否定/疑问变体题守门**） |
| 3 | 复习第 63 课：请把那本书递给我。 | `Please / give / me / the / book.` | `["gives"]` | `Please give me the book.` | **B**（回流 L63） |
| 4 | 说她回赠了你一大块蛋糕。 | `She / gave / me / a / big / cake.` | `["gived"]` | `She gave me a big cake.` | **B** |
| 5 | **C 层新句**：她递给我一本书。 | `She / gave / me / a / book.` | `["gived"]` | **`She gave me a book.`** | **C**（新句） |

**第 5 题的 C 层守门实测（§6 核查 6）**：
- 不在本课展示池（不是 A 也不是 B）✅
- 每个词都在本课（含此前累计）的词表里（未教过的词 **0 个**）✅ ⇒ **D 层不会越界**
- 与课内句子的最坏 Jaccard 重叠 **57%**（vs `She gave me a big cake.`）< 80% ✅
- 代词抹平后不与任何课内句同形 ✅
- **设计意图**：`She gave me a big cake.`（B 层）→ `She gave me a book.`（C 层）只换末尾名词——对用户是**真正需要重组的迁移**（不是换代词、不是换说法），因为换的是**给的东西**，而 `give sb sth` 的位置必须保持不动。

**⚠️ 干扰项唯一性**：本项目干扰项**不得与答案词重复**。上表每个干扰项都已逐个核过（例：第 1 题答案是 `gave`，故 `gived` 可用而 `gave` 不可用）。**⚠️ 第 2 题答案是 `Did you give her the book?`——本题答案里含 `give`，因此该题不能用 `give` 作干扰项；用 `gave` 才对**（`gave` 不在该题答案词集内）。

**跨课复现实测**：`Please give me the book.` 现已在 **L63 / L199** 出现过（2 课），加 L204 后 **3 课**，上限 6 ⇒ ✅。

### 4.6 summary / deepDive

**summary.points（5 条）：**

```
[0] I gave her the book. —— give 的昨天版是 gave（i 换成 a）
[1] She gave me a big cake. —— 同一句里两班岗：先给谁、后给什么（第 63 课）
[2] Please give me the book. —— 第 63 课的站位，动词穿原样（今天的事）
[3] I gived ❌ —— 它不加 -ed
[4] give 的位置规矩在第 63 课，形状在第 199 课那条线上——今天把它接完了
```

**deepDive.paragraphs（4 段）：**

```
[0] 中文说「我给你」，英语说 give you——先给谁、后给什么，第 63 课把这条点破过。
    give 这个词有两个说法：先给谁、后给什么（give me the book）／东西在前、末尾垫 to
    （give the book to me）。昨天版照样两个说法都活着。
[1] 昨天版的说法就是 gave：gave me the book ／ gave the book to me。
    换的是里面的零件（i 换成 a），别的字母一个都不动，也不加 -ed。
[2] 只是那条「小词要翻身」的规矩在昨天版里更容易忘：东西是 it 的时候才要垫 to
    （gave it to me），是 the book 这种实实在在的一样东西就不用垫——gave her the book。
[3] 第 199 课那张卡早就点过名：give 变 gave（跟 sit → sat 一样，都是里面的 i 换成 a）。
    今天这一课就是把那句点名接完。
```

**零术语与星号已逐条核过**（§6 核查 8：18 条中文文案零术语 0 违规、非 deepDive 字段星号 0 违规）。

---

## ⑤ 外部依据与逐字引用

| # | 源 | URL | 状态 | 逐字引用 |
|---|---|---|---|---|
| **V1** | Cambridge Grammar · **`Word patterns: give`**（Common mistakes in English › Word patterns） | https://dictionary.cambridge.org/grammar/british-grammar/give | **curl HTTP=200，444,190 bytes 直连**（`-L`） | 见下方 ① ② ③ |

**① 两种句型并列（这句话直接支撑 L204 要继承 L63 的位置规矩）：**
> "When talking about giving a physical object, the indirect object can go before or after the direct object."
> 页面例子：`He gave the flowers to his mother.` / `He gave his mother the flowers.`

**② 多垫一块 to 是 Cambridge 专门立条目的错（`gave` 出现在它的**错例**里）：**
> "When the indirect object comes before the direct object, don't say 'give to someone something', just say give someone something:"
> 页面给出的错句：`He gave to his mother the flowers.`

**③ 东西是「摸不着的」（advice / opinion / feeling）时位置更严：**
> "When the object of give is something that you cannot touch, such as advice or an opinion or feeling, the indirect object must come before the direct object."
> "Don't say 'give advice/your opinion/a shock to someone', say give someone advice/your opinion/a shock:"
> 页面给出的错句：`What he said gave an idea to me.` → 正：`What he said gave me an idea.`

| # | 源 | URL | 状态 | 逐字引用 |
|---|---|---|---|---|
| **V2** | Cambridge Grammar · **`Past simple (I worked)`** › Past simple: irregular verbs | https://dictionary.cambridge.org/grammar/british-grammar/past-simple-i-worked | **curl HTTP=200，462,883 bytes 直连**（`-L`） | 见下方 ④ |

**④ 不规则过去式必须逐个记（这正是 L197–L204 这一整条线的外部依据）：**
> "Past simple: irregular verbs
> Many verbs are irregular. Here are some common ones. **Each one has to be learnt.**
> The verb form is the same for all persons ( I, you, she, he, it, we, they ), and we make questions and negatives with irregular verbs in the same ways as for regular verbs."

⚠️ **诚实登记**：该页的示例表**只有 13 行**（`be / begin / come / do / eat / fly / have / know / read / sing / tell / wake / write`），**不含 `give`**。⇒ 引用这一页时**只能引它的规则句**（「Each one has to be learnt」），**不得声称它列了 `give`**。

| # | 源 | URL | 状态 | 逐字引用 |
|---|---|---|---|---|
| **V3** | Cambridge Grammar · **`Table of irregular verbs`** | https://dictionary.cambridge.org/grammar/british-grammar/table-of-irregular-verbs | **curl HTTP=200，464,100 bytes 直连**（`-L`） | 见下方 ⑤ |

**⑤ `give` 在 Cambridge 官方不规则动词表里（按纯字母序排在 `get got got` 与 `go went gone` 之间）：**
> 表格实测相邻单元格逐字为：`… get | got | got` → **`give | gave | given`** → `go | went | gone`
> 同页相邻还有 `forgive | forgave | forgiven`、`freeze | froze | frozen`。

| # | 源 | URL | 状态 | 逐字引用 |
|---|---|---|---|---|
| **V4** | British Council LearnEnglish · **`Irregular verbs`** | https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/irregular-verbs | ⚠️ **curl HTTP=000（域名被拦，与简报预告一致）**；**WebFetch 可读** | 见下方 ⑥ |

**⑥ 该页的不规则动词表里确有 `give`：**
> 经 WebFetch 逐字核对，该表内 `give` 行的三态是 **`give gave given`**。
> 同页规则句：**"Most verbs have a past tense and past participle with –ed:"** / **"But many of the most frequent verbs are irregular:"**

| # | 源 | URL | 状态 | 逐字引用 |
|---|---|---|---|---|
| **V5** | British Council LearnEnglish · **`Double object verbs`** | https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/double-object-verbs | ⚠️ **curl HTTP=403**；**WebFetch 可读** | 见下方 ⑦ |

**⑦ `give` 被官方列为双宾动词，且 BC 给了它自己的例子：**
> "Some verbs have two objects, an indirect object and a direct object"
> 结构：**"Verb + Noun (indirect object) + Noun (direct object)"**
> "Alternatively, we can use a prepositional phrase with to or for with an indirect object"
> 结构：**"Verb + Noun (direct object) + to/for + Noun (indirect object)"**
> "If the indirect object is a long phrase, we normally use to or for"
> "If the indirect object is a pronoun, we normally use the Verb + Noun + Noun pattern"
> **`give` 所在的动词清单**逐字：`give lend offer pass post promise read sell send show tell write`
> 页面里 `give` 的例子（**用的正是 `gave`**）：**`He gave his programme to the man next to him.`** / **`He gave the man next to him his programme.`**

| # | 源 | URL | 状态 | 逐字引用 |
|---|---|---|---|---|
| **V6** | Oxford Learner's Dictionaries · **`give`** 词条 | https://www.oxfordlearnersdictionaries.com/definition/english/give_1 | **curl HTTP=200，140,788 bytes 直连**（`-L`，需跟 302） | 见下方 ⑧ |

**⑧ 词条内联的动词形式表逐字为：**
> `present simple I / you / we / they` **give** ／ `he / she / it` **gives** ／ **`past simple` gave** ／ `past participle` **given** ／ `-ing form` **giving**
> 该词条同时带 **`ox3ksym_a1`** 标记（**Oxford 3000 A1 档**）——`give` 是最高频档的词，与第 43/44 批的实测一致。

| # | 源 | URL | 状态 | 逐字引用 |
|---|---|---|---|---|
| **V7** | Longman Dictionary of Contemporary English（LDOCE）· **`give`** 词条 | https://www.ldoceonline.com/dictionary/give | **curl HTTP=200，122,341 bytes 直连**（`-L`） | 见下方 ⑨ |

**⑨ LDOCE 把两个句型分别立为独立小标题，且例句里 `gave` 与 `give` 并存：**
> 义项 1（给礼物）下并列两栏：**`give somebody something`** ／ **`give something to somebody`**
> 例句逐字：**`What did Bob give you for your birthday?`**
> 例句逐字：**`I've got some old diaries that my grandmother gave me years ago.`**
> 例句逐字：**`He poured some wine into a glass and gave it to her.`**
> 义项 2（递到手上）下并列两栏：**`give somebody something`** ／ **`give something to somebody`**
> 例句逐字：**`Give me the letter, please.`** / **`a ring which was given to him by his mother`**

| # | 中文侧源 | URL | 状态 | 逐字引用 |
|---|---|---|---|---|
| **V8** | 爱词霸（金山）· `give` 词条 | https://www.iciba.com/word?w=give | **curl HTTP=200，352,719 bytes 直连** | 「**词态变化 第三人称单数 : gives ; 过去式 : gave ; 过去分词 : given ; 现在分词 : giving**」；「高分必备知识点 › 固定搭配」逐字列出 **「1.give sth to sb」** 配中文「给某人某物」 |
| **V9** | 有道词典 · `give` 词条 | https://dict.youdao.com/result?word=give&lang=en | **curl HTTP=200，706,761 bytes 直连** | 「现在分词 giving **过去式 gave** 过去分词 given」；AI 释义逐字：「**give sb. sth. ／ give sth. to sb.：给某人某物**」；「其中，sb. 是 somebody 的缩写……双宾语结构中，give 后面可以先接人，再接物，也可以用 to 引出接受者。」 |

### 5.1 抓不到的源（明确声明）

| 源 | 结果 |
|---|---|
| **British Council 域名（`learnenglish.britishcouncil.org`）的 curl** | **HTTP=000 / 403**（与简报预告一致：域名被拦）。**但内容页经 WebFetch 完全可读**——V4、V5 的逐字引用即由 WebFetch 取得。 |
| `dictionary.cambridge.org/grammar/british-grammar/verbs-two-objects` | **HTTP=520**（16 bytes）。该 slug 不存在；Cambridge 相关内容的正确 slug 是 `give`（V1）与 `table-of-irregular-verbs`（V3）。 |
| `dictionary.cambridge.org/grammar/british-grammar/verb-patterns-verb-object-object` | **HTTP=520**（16 bytes）。`verb-patterns-verb-object` 同。这两个 slug 都只返回一个 226KB 的**索引页外壳**（`title = English Grammar Today`，正文 0 字），**不是内容页**——**不得引用**。 |
| **Murphy《English Grammar in Use》双册 / Swan《Practical English Usage》** | **不可得**（简报已登记，本批未重试）。 |
| **`gived` 的任何权威源书面证据** | **抓不到**。我在 Cambridge（含 `Common mistakes` 全栏）、BC、OALD、LDOCE、爱词霸、有道的可访问内容里**一处都没找到 `gived`**。**⇒ §2.3 甲条已明确登记为「纯负迁移推论」**，其可做性依据是**项目自身先例**（L199–L203 五课的第 1 张卡全是同型），不是外部源。 |
| **中文侧「`gave` 的错型分布」统计** | **抓不到**。爱词霸/有道只提供词条与例句，不提供学习者错误的频率数据。中文侧对 `gave` 的处理是**词形表 + 固定搭配**（V8/V9），**没有「错句类型学」**。 |

### 5.2 `give` 的两种句型与过去式在英文教学里的位次（依上述源综合）

1. **`give` 的两句型是「共同核心里的一条独立条目」**：Cambridge 为它**单开一页**（`Word patterns: give`，V1），British Council 把它列进**双宾动词白名单**并给出专属例句（V5），LDOCE **把两组句型当成词条的骨架结构**重复列出（V9）。**⇒ 这不是细枝末节，是 A1 阶段就会碰到的主干。**
2. **`give` 的过去式是「必须单独记」的那一批**：Cambridge 明写 **"Each one has to be learnt."**（V2 ④），并把 `give gave given` 收进官方不规则动词表（V3 ⑤）；BC 的不规则表同样收录（V4 ⑥）；OALD 在词条内联 `past simple gave`（V6 ⑧）。**⇒「逐个记、不加 -ed」有三大源的共同背书。**
3. **★ 综合位次判断：`give` 是「双宾动词 + 不规则过去式」**两条**教学线的交点。这正是本项目 L204 该占据的位置——L63 管前一条线（站位），L204 管后一条线（形状），两条线在 `gave her the book` 这里接上。
4. **`give` 在词频上是 A1 档**（OALD `ox3ksym_a1`，V6 ⑧）⇒ **等级不构成排序障碍**；排序依据是「换法归类」（与第 43/44 批结论一致）。
5. **⚠️ 中文侧的位次偏低**：V8/V9 只给「`过去式 : gave`」一行 + 「give sth to sb」一条搭配，**没有错型讲解、没有场景、没有对照卡**。⇒ **「用连续剧场景 + 错句回流承载 gave 的双句型与形状」在中文侧仍是空位**（与第 44 批对 felt/kept 的判断一致）。

---

## ⑥ 自我核查记录

### 6.0 工具与口径纪律（先说清，再报数）

- **一律用 node 词边界正则读「解析后的数据对象」逐字段判定，全程不使用 `grep`**（本地 `grep` 是 ugrep，会假返回 0，简报已警告）。
- **词边界**：`(?<![A-Za-z-])w(?![A-Za-z-])`（排除连字符与字母相邻——`gives` 不命中 `give`）。
- **⚠️ 关键实现纪律（我踩过一次，登记以免后人重踩）**：**绝不在 `.test()` 上用带 `g` 标志的正则**——`lastIndex` 有状态，会让计数**少算**。我的第一版脚本因此把 `give` 正侧算成 **51** 而非 **58**。发现后改为「无 `g` 的 re 做 `test`、带 `g` 的 re 做 `match` 计数」，并在脚本头写入注释。
- **路径键必须配对课号**：字段路径本身不含课号（`contrast[5].wrong` 在 L63 与 L199 都存在），任何 `Set<path>` 的排除集都必须是 `` `${L.number}|${path}` ``。我的第一版脚本漏了这一点，导致排除集失效。
- **必须排除的两类**（否则正侧虚高、错侧虚高）：
  - **① `spot` 题的 `answer`**：**惯例上 `answer === wrongToken`**，是**要用户点出的错词**（全库 **203 道 spot 题**：`guided[3]` 199 道 + `guided[4]` 4 道；其中 **201 道 `answer === wrongToken`**，2 道只差句点）。判定权威是渲染/判题侧的 `wrongToken ?? answer`（`src/edge/lessonFlow.ts:179/201`、`src/edge/e0-lesson-data-invariants.test.ts:105`）。实测例：`guided[3].answer = "is"` / `"am"` / `"slept."` / `"putted"` / `"weared"`——**逐条跑出，全部是错词**。
  - **② `bothRight: true` 卡的 `wrong` 字段**：那里装的是**正确句**（全库 **498 处**）。
- **计数度量声明**：`f` = 含该词的字段数、`o` = 出现次数、`u` = 去重后的不同字符串数。**三者不同**（例：`give` 正侧 f=58 / o=67 / u=35）——报数必须带度量，否则跨报告不可比。

### 6.1 数据基线（核查 0）

```
$ ./node_modules/.bin/vite-node deliverables/product-strategy/.gave-check.mts
grammarLessons: 203 课（末课 lesson-203-wore / number 203）
huntCases:      212 案（末案 #212）
排除 ① spot.answer:      203 条
排除 ② bothRight.wrong:  498 条
```

### 6.2 简报数字的复现（核查 4 + 补充脚本）

```
$ ./node_modules/.bin/vite-node deliverables/product-strategy/.gave-repro.mts
共 38760 个字段，55 种槽签名

=== 正侧口径穷举（字段数 f / 出现次数 o / 去重整句数 u）===
口径                                                  give        gives        gave        given
P1 全字段 · 排除 spot.answer+bothRight.wrong           58/67/35    0/0/0        1/1/1       0/0/0
P3 展示槽(SHOW) · 排除两类                             58/67/35    0/0/0        1/1/1       0/0/0
P4 英文句槽(EN_SLOT) · 排除两类                        23/23/6     0/0/0        0/0/0       0/0/0
P5 句子槽(SENT) · 排除两类                             24/24/7     0/0/0        0/0/0       0/0/0
P7 剔掉讲解散文 · 排除两类                             40/43/17    0/0/0        0/0/0       0/0/0
★简报口径（= 句子槽 + 词块槽 + blocks.text）            25/25/9     0/0/0        0/0/0       0/0/0
简报（第 47 批）                                        25          0            0           0

=== 错侧口径穷举 ===
错侧字段名（未排 bothRight）                            3/3/2       1/1/1        1/1/1       0/0/0
★简报口径（错侧字段名 ∪ options[]里非answer的）          5/5/4       1/1/1        1/1/1       0/0/0
【严格】错侧字段名 − bothRight.wrong                     0/0/0       1/1/1        1/1/1       0/0/0
【严格】+ options[]里非answer的                          2/2/2       1/1/1        1/1/1       0/0/0
简报（第 47 批）                                        5           1            1           0
```

**⇒ 简报的 `25/0/0/0` 与 `5/1/1/0` 精确可复现（唯一组合）**，但：

- **正侧 25**：口径是「句子槽 + 词块槽 + `blocks[].text`」，**漏掉** `guided[].answer` / `guided[].replaceBase` / `summary.points[]` / `oneLineRule` / `grammarLabel` / `recall.noteZh` 等正面教学位（完整口径 **58 字段 / 67 次 / 35 串**）。
- **错侧 5**：其中 **3 处是 `bothRight` 卡里的正确句**（`L68 contrast[3].wrong = "Please give the gift to me."` / `L68 contrast[5].wrong = "Please give me the book."` / `L199 contrast[5].wrong = "Please give me the book."`），**只有 2 处是真错句**（`L63 guided[5].options[1] = "Please give me it."` / `options[2] = "Please give it me."`）。
- **⇒ 严格口径下 `give` 的真错侧 = 2 处**；`gave` 的错侧 = 1 处但**是 `practice[2].distractors[0]`（干扰项）**，不是错句。

### 6.3 `gave` 的完整落点（核查 1d / 3）

```
=== gave 在 grammarLessons 的 2 处（全库仅此）===
L199 contrast[5].whyZh           :: 两句都对——第 63 课那句的 give 也有自己的昨天版：give 变 gave（跟今天的 sit → sat 一样，都是里面的 i 换成 a）。give 的位置规矩在第 63 课，形状在今天的 sat 这条线上。
L199 practice[2].distractors[0]  :: gave      ← 干扰项，用户被要求别选它

=== gave 在 huntCases 的 3 处（都是**正确 token**）===
#9  hunt-uncountable  tokens[2]  :: The teacher gave us many advice and some informations about the exam.
#20 hunt-term-review  tokens[10] :: Last term, I learn a lot of English. My teacher gave us useful advice. ...
#27 hunt-snow-day     tokens[25] :: ... Mom gave us a orange juice.

=== 句子位置（targetSentence / examples / contrast.correct / variants / sceneSwings / dialogue / guided.answer / practice.answer / recall.answer）===
gave: 0 处     ← 这是本批最核心的一条
```

### 6.4 防重复检索（核查 6）

```
=== gived（加 -ed）                            命中 0 字段（课时 0 / 案件 0）
=== gaved                                       命中 0 字段
=== gived / gaved 正则                          命中 0 字段
=== gave ... to（位置问题）                     命中 0 字段
=== give + 昨天时间词（原样当昨天版）            命中 0 字段
=== gave 后接 it 的位置问题                     命中 0 字段
=== give to someone（多垫 to）                  命中 0 字段
=== give it me / give me it                     命中 3 字段：
     L63 contrast[0].wrong      :: Give me it.
     L63 guided[5].options[1]   :: Please give me it.
     L63 guided[5].options[2]   :: Please give it me.
=== 我设计的 3 条错句的整串精确匹配 + 子串匹配      全部「无」
```

### 6.5 targetSentence 闸门（核查 5 / 7）

```
$ ./node_modules/.bin/vite-node /tmp/l204b.mts
I gave her the book, and she gave me a big cake.
  词数 12 ； 最长分句 12 词
  L203 lc=14 → 新 L204 上限 19  ⇒ 跳 −2 ✅ 过闸
  逐词：i(已教) gave(已教) her(已教) the(已教) book(已教) and(已教) she(已教)
        gave(已教) me(已教) a(已教) big(已教) cake(已教)  → 未教过 0 个 ✅
  与 L197–L203 七课目标句的 Jaccard：19% / 12% / 25% / 11% / 5% / 21% / 9%  → 全部 <80% ✅
```

### 6.6 practice 四层与 C 层守门（核查 6）

```
素材可抄句 = examples(4) + sceneSwings(3) + 1 = 8  < 10  ⇒ 不豁免，C 层守门生效

practice 分层（严格复刻 test 的 A/B/C/D 口径）:
  [A 目标句] "I gave her the book, and she gave me a big cake."
  [B 课内原句] "Did you give her the book?"
  [B 课内原句] "Please give me the book."
  [B 课内原句] "She gave me a big cake."
  [C 新句]    "She gave me a book."
       未教过词 0 个（D 层不越界 ✅）
       最坏 Jaccard 57% vs "She gave me a big cake."  < 80% ✅
       代词抹平后不与任何课内句同形 ✅

变体题守门: "Did you give her the book?" 在 practice 里 ✅
干扰项唯一性: 第 2 题答案含 give ⇒ 该题干扰项用 gave（不含于答案）✅
跨课复现: "Please give me the book." 现 2 课[L63,L199] → +L204 = 3 课 ≤ 6 ✅
```

### 6.7 零术语 / 星号 / 语义守门（核查 8）

```
$ ./node_modules/.bin/vite-node /tmp/gate.mts
① 零术语（全字段遍历口径，findZeroTermHits）：18 条中文文案 → 0 处违规 ✅
② 星号守门（除 deepDive 外不得含 ** 或词首 *）：非豁免字段 0 处违规 ✅
③ 英文设计串零术语：28 条 → 0 处违规 ✅
④ 语义位置断言：本设计**未使用**「X 站在 Y 前面/后面」句式（该句式受
   grammarLessons.test.ts 的实现约束——文案里的顺序断言必须与课内正确句一致）；
   位置讲解一律用第 63 课既有的说法「先给谁、后给什么」✅
```

### 6.8 全库回归（证明本报告未改任何数据）

```
$ ./node_modules/.bin/vitest run src/data/grammarLessons.test.ts
 ✓ src/data/grammarLessons.test.ts (35 tests) 194ms
 Test Files  1 passed (1)
      Tests  35 passed (35)
```

### 6.9 本批用到的核查脚本（只读，均在 `deliverables/product-strategy/` 下）

| 脚本 | 用途 |
|---|---|
| `.gave-check.mts` | 主核查：基线 / 五形式正错侧 / 排除集逐条 / L63 全貌 / 近 12 课结构 / scene 分布 / 防重复检索 / huntCases 逐槽 / i→a 同族分布 |
| `.gave-count.mts` | 正侧 8 口径 × 错侧 6 口径穷举，含去重整句清单 |
| `.gave-repro.mts` | 55 种槽签名的原始计数 + 子集和搜索（定位「25」的来历） |

---

## ⑦ 不确定项

| # | 不确定项 | 影响 | 我的处置 |
|---|---|---|---|
| **U1** | **`I gived her a book.` 这个中式错句，我在任何可访问的权威源里都找不到书面证据**（Cambridge 含 `Common mistakes` 全栏、BC、OALD、LDOCE、爱词霸、有道，`gived` 命中 **0**）。 | **中**——若产品上要求「每条错句必须有外部源」，这条会不合格 | ✅ **明确登记为「纯负迁移推论 + 项目先例支撑」**：L199–L203 五课第 1 张卡全部是同型（`*sitted`/`*feeled`/`*sleeped`/`*drawed`/`*weared`）。**权威源不列错形是常态**（源只列正确形式），所以「找不到」≠「不存在」。**若决策者要求外部背书，则把「甲」换成别的错型——但族里没有更合适的第 3 个候选。** |
| **U2** | **`give` 的 `given` 到底该在哪一课兑现**：L204 明确不碰 `given`（与 L203「worn 先不碰」一致），但 `have given` 的位置在 L21/L23 那条线，而那条线在 L197 之前——将来要讲 `have given` 时，用户可能已经把 `gave` 与 `given` 混了。 | **低**——L204 的对照卡 1 与 summary.points[3] 都会说清「不加 -ed」；但不主动提 `given` | 登记给上 L204 之后的批次。**建议**：下一批做 `given`/`worn`/`broken` 这一族「做过版」时，**把 L204 明确列为前置课**。 |
| **U3** | **`L197 deepDive` 里到底有没有点过 `gave` 的名——三份报告结论矛盾**。第 43 批说「有（含 gave、told、felt、kept）」；第 44 批说「没有，第 43 批的修正本身是错的」；本批实测 **L197 的 `deepDive` 里 `gave` 命中 0 处**（与第 44 批一致）。 | **低**——不影响 L204 的立项（承诺方是 **L199** 的 `contrast[5].whyZh`，本批已逐字确认它在库里） | ✅ **采信第 44 批 + 本批实测**：L197 无此内容。**建议**：若后续报告引 L197 的「点名清单」，一律先跑词边界检索。 |
| **U4** | **「立课 vs 挂靠」我给的是「立课」，而第 44 批的竞析报告明确建议「挂靠、不立课」**（它建议挂 L199）。**两份报告结论相反。** | **中**——这是本批唯一的方向性分歧 | 我**独立判断为立课**，理由见 §3.4（三条，第一条是「欠条必须兑现」）。**关键差异**：第 44 批写报告时 L199 刚上线、`contrast[5]` 那张「点名卡」还没被当成欠条看待；**本批多了一个它当时没有的事实——`gave` 至今仍在句子位置 0 处**，也就是「挂靠方案已被执行过一次，结果是只点名没交付」。**若决策者采信第 44 批**，则最小补救是：**在 L63 与 L199 各加一张卡**——但我已论证这兑现不了欠条（§3.3）。 |
| **U5** | **`mansion` 场景会不会显得太重复**（全库 65 课，是最多的一档）。 | **低**——既有课就是这么用的 | 备选：`desert`（只 1 课）或 `forest`（3 课）。**但「递东西」是非日常场景里最不自然的一类**；若要换，`forest` 比 `desert` 好。**不建议 `space`**（保留首次登场）。 |
| **U6** | **`She gave me a book.` 作为 C 层新句，与 `She gave me a big cake.`（B 层）的 Jaccard 是 57%**，虽过阈（<80%）但偏高。 | **低**——过阈即为合规 | 若要更干净，可换成 **`I gave him a pen.`**（最坏重叠 **25%**）——但代价是丢掉「与 B 层形成最小对照」的教学意图。**我倾向保留 `She gave me a book.`**，把选择权留给实现者。 |

---

## 附录 · 一条口径更正的实测依据

```
$ ./node_modules/.bin/vite-node /tmp/spot.mts
spot 题 203 道：answer===wrongToken 201 道，不等 2 道，缺 wrongToken 0 道
  L96 guided[3] wrongToken="rain." ≠ answer="rain"
  L102 guided[3] wrongToken="rain." ≠ answer="rain"
```

**判题权威逐字（`src/edge/lessonFlow.ts:179`，`:201` 同式）：**
```ts
const target = step.wrongToken ?? step.answer;
```
**数据不变量逐字（`src/edge/e0-lesson-data-invariants.test.ts:105`）：**
```ts
const target = step.wrongToken ?? step.answer;
if (!(step.tokens ?? []).includes(target)) bad.push(`${lesson.id} guided#${index} spot 命中词不在题干`);
```
⇒ **该断言只检查「命中词在 `tokens` 里」，不检查 `answer === wrongToken`。** 本报告 §6.0 把 `spot` 的 `answer` 排除出正侧，依据的是**惯例（201/203）**与**该字段的实际语义（用户要点出的错词）**，不是被强制的等式。

**同时更正一处措辞**：如需引用「`spot` 的 `answer` 就是 `wrongToken`」，**应写「按惯例相等（201/203），判定权威是 `wrongToken`」**，不要写「由测试强制相等」——那会误导读者的后续核查。
