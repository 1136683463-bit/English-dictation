# 瑞思 · 用户研究与内容缺口分析
## 「只在负面位置出现的词」复核（第 42 批）

- 日期：2026-09-22
- 范围：`src/data/grammarLessons.ts`（195 课）+ `src/data/huntCases.ts`（204 案）+ `src/data/grammarSeasons.ts`（28 季）
- 性质：**纯研究**——本报告不改任何代码与数据
- 上游：第 41 批路线图 §7「93 个词只出现在负面位置」（竞析独立发现）；本批复核 12 个实词

---

## ① 结论摘要

### 做哪几个词

**做 2 课、3 个新点**，全部安排在 L196 之后（season-29）：

| 课 | 新点 | 词数 | targetSentence | 中文意图 |
|---|---|---|---|---|
| **L196** | `among`（1 个点） | 6 词 | `The cat is among the boxes.` | 猫在一堆箱子中间 |
| **L197**（可被否） | `loud` + `careful`（2 个点） | 8 词 | `My brother is loud, but I am careful.` | 弟弟声音大，我很仔细 |

**L196 是硬结论**（`among` 是全应用唯一无处正确呈现的词）；**L197 是软建议**（见下方「两处修正」与 §6 不确定项 1）。

### 拒绝哪几个（9 个）

`dog`、`afternoon`、`uniform`、`blackboard`、`grandpa` **已覆盖**（L4/L5/L24/L107/L111/L112 已有正确呈现）；
`wear`、`knock`、`end`、`bore` **本轮不做**（均为「某个变形已是正确形态、只有基础形/个别形缺失」，与 `among` 的「全应用无一正确」不同级——详见 §2）。

### ⚠️ 对「12 词」前提的两处重要修正（务必先读）

本批的给定前提是「这 12 个词只在负面位置出现，用户从未见过正确用法」。**复核后这个前提有两处需要修正**：

**修正一：3 个词在课程库里已有正确呈现。** `uniform`（L4 `contrast.correct`）、`afternoon`（L24 `contrast.correct`）、`blackboard`（L107 `contrast.bothRight`，渲染时画勾）**各有 1 处被明确告知「这样说对」**。上游把它们计入「只在负面位置」，是因为它们命中的**行**里有一行字段名是 `wrong`——但同一张对照卡里就有一行 `correct`。**只看行数会误判。**

**修正二：扩到全 `src/` 后，`loud`/`careful`/`end`/`wear`/`afternoon` 在课程库之外有正确的用户可见用例。** 权威数据文件只有两个，但用户可见的内容源不止两个。实测（详见核查 6）：

| 词 | 课程库外的**正确**用户可见用例 | 出处 |
|---|---|---|
| `afternoon` | `...a shelf you tidied **this afternoon**.` | 图书馆关卡脚本 `libraryGateScripts.ts:396` |
| `afternoon` | `It is your first **afternoon** at North Hill School.` | 冒险模式 `adventureService.ts:90` |
| `loud` | `Begin where the clocks are **loud**.` | 冒险模式 `adventureService.ts:142` |
| `careful` | `I need a **careful** walker.` / `The lamp needs a **careful** walker.` | 冒险模式 `adventureService.ts:246,257` |
| `careful` | `Mia walked into class with a **careful** plan` | AI 故事模板 `aiService.ts:430` |
| `wear` | `I **wear** ______ today.` | 日记提示 `diaryQuestions.ts:109` |
| `end` | `...at the **end** of the sentence.` 等 **9 处** | 关卡脚本 + AI 模板 + 冒险模式 |
| `among` | **0 处**（课程库 0、关卡脚本 0、冒险模式 0、日记 0、AI 模板 0）| 仅测试文件 `grammarLessons.test.ts`（用户不可见）|

**修正的含义**：`among` 的缺口**在全应用范围内都成立**（它是 12 词里唯一一个「整个 App 任何用户可见位置都没有正确用法」的词）——**这是本报告最稳的结论，也是 L196 应当先做的直接理由**。
而 `loud`/`careful` 的「从未见过正确用法」**在全应用范围不成立**——它们作为**故事台词/生词卡**出现过正确形式。它们真正的缺口是「**课程从不把它们当正确形式教**」。这是一个**更弱但仍成立**的缺口（详见 §2 与 §6 不确定项 1），所以 L197 排在 L196 之后、且我把它标为**可被产品否掉**。

### 拆几课

**拆 2 课，因为 `among` 与 `loud`/`careful` 不同族**：

- `among` 属**位置词族**（L79–L86 大章的一员，与 L81 `between` 对照：两个 vs 一群）。
- `loud`/`careful` 属**「怎么样 vs 怎么做」族**（与 L58 `-ly`、L59 `good→well` 同源：形容样子的词 vs 做事的样子词）。

两族在库里各有自己的教学词汇与先例，合并会同时破坏两条对照链。所以：

- **L196 = `among` 单点**（对齐项目历史先例：L191 是 1 个点）
- **L197 = `loud` + `careful` 两点**（对齐项目历史先例：L192 是 2 个点）

### 我最不确定的一点

**L197（`loud` + `careful`）该不该做——因为冒险模式已经把这两个词以正确形态教过一遍了。**

我原本以为这两个词是「从无正确用法」，复核后**推翻了**：`careful` 在冒险模式奇幻章**第一章**就有一张生词卡（`The lamp needs a careful walker.`，用户能在「本章生词」抽屉里看到并收藏），`loud` 在城市章第一章也有正确台词（`Begin where the clocks are loud.`）。**所以「用户从未见过正确用法」对这两个词不成立。**

它们真正的缺口只剩一条：**课程内这条 `-ly` 对照链断了一环**——`quick` 的两面都亮了（`She is quick.` 是 L58 的 `bothRight` 卡、`She runs quickly.` 是 target），而 `careful`/`loud` 只被划掉、从没在课程里正面出现过。补齐它符合项目「两张脸」的一贯手法；但用户既已在冒险模式见过词卡，**也可以认为这一环不必补**——最低成本替代是给 L58 加一张对照卡（一行数据）。

**这是产品判断，数据不能替我决定。** 若否，本批缩为 **L196 一课 1 个点**，其余结论不变。（详见 §6 不确定项 1。）

**相比之下 L196 我不留疑**：`among` 是全应用（课程 + 关卡脚本 + 冒险模式 + 日记 + AI 模板）**唯一一个任何用户可见位置都没有正确用法**的词，且项目已为它的用法写了守护断言却从无课程——补它没有争议。

---

## ② 12 词逐个判定

### 判定方法说明（关键）

复核发现上游口径需要收紧。上游把「只在负面位置出现」定义为「未以正确形态出现过」，但**同一串字符在不同字段里的教学身份完全不同**：

| 字段 | 用户看到的是什么 | 判定 |
|---|---|---|
| `targetSentence` / `examples[].en` / `dialogue[].en` / `blocks[].text` | 要学的正确句 | **POS** |
| `contrast[].correct`（`bothRight:false`） | 揭晓的正确句（画勾 `CheckCircle2`）| **POS** |
| `contrast[].wrong`（`bothRight:true`） | **也是**正确句（画勾，两句都对）| **POS** |
| `contrast[].wrong`（`bothRight:false`） | 划掉的错句 | NEG |
| `practice/guided/variants[].answer` / `.tokens` | 要产出的正确句 | **POS** |
| `[].distractors` / `wrongToken` / 非答案的 `options[]` | 干扰项 | NEG |
| `huntCases[].tokens[i]` 且 `i ∉ errors[].tokenIndex` | **仍是含错草稿里的一句**——注意这是「没被标错」，不是「被表扬」 | **灰区** |
| `huntCases[].errors[].original` | 点名要改的错词 | NEG |

那个灰区是本批最大的口径分歧点：`huntCases` 的 `tokens` 整体是一篇**故意写错的**草稿（`correctedSentenceOf` 的注释写明「把案件题面的**错句**按 errors 修正成正确句」），所以「clean token」只是「本案没揪它」，它出现在一篇错文里。用户确实会**看到**这个词（在找错页的题面），但看到的是一个**待判定的位置**，而不是一个被确认正确的用法。

下面因此给两套计数：**A = 用户被明确告知「这样说对」的次数**（严格口径）；**B = A + 在找错草稿里「未被标错」的次数**（宽松口径）。

---

### 一、已覆盖（4 个）——不做课

#### 1. `uniform` — 已覆盖，不做

- **A 口径 = 1 处正确呈现**：L4 `contrast[5].correct` = `I want a uniform.`（配 `bothRight:false` 的错句 `I want an uniform.` 一起展示，用户看到划掉的错句与画勾的对句并排）。
- 严格说这是**唯一**一处，属「弱覆盖」；但这正是 L4 这一课的教学意图本身——`a` vs `an` 的选法。用户看完这张对照卡，就见过 `a uniform` 这个正确形式一次。
- **不做课理由**：`uniform` 是 A2 名词（OALD `Topics Education a2` / `Law and justice a2`），不含新语法点。为它单开一课等于教词汇，违背本项目「一课一个语法点」的定位。若担心只有 1 次曝光，**建议的做法是给 L4 的 practice 加一道含 `a uniform` 的正确题**（一行数据，不是一课）。
- **外部位次**：OALD `uniform` 名词，`[countable, uncountable]`，`Topics ... a2`；iciba 标 `高中/CET4/CET6/考研/GRE/TOEFL/IELTS`。

#### 2. `dog` — 已覆盖，不做（且原判定有误）

- **原判定**：「`dog` 在 L5 作为 `dogs` 的干扰项出现」。
- **实况**：`dog` 在 L5 出现 4 处，形态各异：
  - `contrast[].wrong` = `I like dog.`（NEG，正确是 `I like dogs.`）
  - `guided[0].options` = `["dog","dogs","a dog"]`（`dog` 与 `a dog` 是干扰项，`dogs` 是答案）
  - `deepDive.paragraphs[0]`（**中文**）= 「说「我喜欢狗」……所以 dog 要变成好几个的形式 dogs，表示「狗这一类」」
- 另外 `dog` 在 **3 个找错案里是 clean token**：hunt#46「找狗启事」`tokens[1]`= `dog`（第一句 `Our dog Coco is lost.`——这句本身没有错，错误在后面的 `where is he` / `think` / `at the school`）、hunt#118、hunt#123。
- 课程库外**无**正确用例（唯一其他命中是 `speechService.test.ts` 里的 `the quick brown fox jumps over the lazy dog` 测试字符串——用户不可见；以及词典条目）。
- **判断**：这是一条**假缺口**。`hunt#46` 的案名就叫「找狗启事」，题面第一句 `Our dog Coco is lost.` 用户读到的是 `dog` 单数正确用法。用户在 L5 学的是「泛指要用 `dogs`」，`dog` 这个词本身他们早已认识（OALD `dog` 名词 `Topics Animals a1`，即最基础档）。
- **不做课理由**：单复数取舍（`dog` vs `dogs`）L5 已教透，且 L5 深挖卡用中文讲明了这条道理；`dog` 若单独做一个「正确用法」课，与 L5 完全重复。

#### 3. `afternoon` — 已覆盖，不做

- **课程库 A 口径 = 1 处正确呈现**：L24 `contrast[].correct` = `I went to the park yesterday afternoon.`（错句 `...have gone to...yesterday afternoon.` 划掉）。
- **课程库 B 口径 = 6 处**：另加 hunt#17 / #32 / #43 / #62 / #79 五个案子的 clean tokens（其中 hunt#62 有整条解释句直接教用法：`「在下午」用 in：in the afternoon——in 管一天里的时段（第 18 课学过）。`；hunt#79 有 `下午是大块时间，用 in：in the afternoon——第 18 课的老规矩。`）。
- **课程库外另有 2 处正确的用户可见用例**（核查 6 实测）：
  - `libraryGateScripts.ts:396`（图书馆关卡脚本）：`The floating book returns, hovering over a shelf you tidied **this afternoon**.`
  - `adventureService.ts:90`（冒险模式校园章）：`It is your first **afternoon** at North Hill School.`
- **判断**：`afternoon` 在 L18（`in the morning` 那课）就已属「一天里的时段」教学组，L24 又作为错误对比的正确面出现，另有 5 个找错案 + 2 处关卡/冒险台词在用。**这是 12 词里覆盖最厚的一个。**
- **不做课理由**：`afternoon` 是 A1 时间名词（OALD `Topics Time a1`），`in the afternoon` 的介词规则属 L18 的教学范围，已覆盖。缺口是**假缺口**。上游把它计入「只在负面位置」，是因为命中的 3 行里有 1 行是 `wrong`、2 行是 `correct` 与 `whyZh`——**只看行数会误判**。

#### 4. `blackboard` + `grandpa` — 不该单独成课（具体名词）

**`blackboard`**
- **A 口径 = 1 处正确呈现**：L107 `contrast[].bothRight` = `The teacher had me clean the blackboard.`（`bothRight:true`，所以这句在揭晓时**画勾**、并被标为「两句都对——这就是今天的反转」）。
- **不做课理由**：`blackboard` 是具体名词，且它出现的那句是 L107「让我做」课的双正解**变奏**（教学对象是 `had + 人名 + 动作穿原样`，不是 `blackboard`）。为它做课等于教词汇。

**`grandpa`**
- **A 口径 = 2 处正确呈现**：L111 `examples`（有 `Grandpa's birthday is in October.`）+ L111 `contrast[].bothRight`（同一句被标「两句都对——换个人（Grandpa）：撇号 s 照样贴在东西前面」）；L111 `practice[5].tokens` / `answer` = `My grandpa's car is new.`；L112 `practice[2].tokens` / `answer` = `That book is my grandpa's.`。
- 注意 `grandpa` 的**裸形**（不带 `'s`）确实只作为干扰项出现（L111 `practice[5].distractors: ["grandpa"]`——要的是 `grandpa's`）。但这是**所有格的正常考法**：L111 教的就是「人后面加撇号 s」，`grandpa` 只是被换进来的一个人名，与 `Grandma` 完全同构（L111 的 target 正是 `Grandma's birthday is in May.`）。
- **不做课理由**：OALD `grandpa` 是 `(informal)` 名词、`Topics Family and relationships a1`、**且无 Oxford 3000 标记**（见 §4 表：`grandpa` 是 12 词里唯一一个 `ox3000-senses=0` 的）。它是个幼儿口语词。教它等于教词汇，不做。

---

### 二、本轮不做，但缺口成立、建议排后续批（4 个）

这四个与 `among`/`loud`/`careful` 的**关键差别**：它们不是「全族无一正确用法」，而是**基础形缺、某个变形已正确**。做课的价值在于「补一个变形」，而不是「立一个新点」——优先级低于 `among`。

#### 5. `wear` — 课程库内缺口成立，且全应用内**也没有**正确用例；但性质是形态学，本轮不做

- **课程库 A 口径 = 0，B 口径 = 0**；**全应用扫描也只在 1 处用户可见文本里出现，且那一处是填空提示**（不是完整正确句）：
  - `diaryQuestions.ts:109`：`{ id: "d-like-color-v2", ..., zh: "今天你身上有什么颜色？", hint: "I wear ______ today." }` —— 这是日记页的**填空提示模板**（`hint`），用户要往里填词。**它把 `wear` 放在正确位置（主语后、动词位），但是个空格模板，不是一句完整英文**。所以严格讲，用户「见过 `I wear ___` 这个架子」，但**没见过一句完整的 `I wear ...`**。
- 课程库内 5 处负面：
  - L39 `contrast[].wrong` = `The boy who wear glasses is my brother.`（错在 `who` 后面要加 s）
  - L39 `guided[5].options` 含 `wear`（答案是 `wears`）
  - L41 `contrast[].wrong` = `I know the boy who wear glasses.`
  - hunt#28 `tokens[22]` = `wear`（错误，`correction: "wore"`）
- **但**：`wears` 在 L39 是 target（`The boy who wears glasses is my brother.`），全课正确呈现 **20+ 处**（target + 4 个 examples + dialogue + 4 张对照卡的 correct 面 + guided/practice/recall）。
- **不是「从未教过 wear」**：L39 教的正是 `wears`。用户学的是「who 后面动词加 s」，`wear` 裸形只是这条规则的**反例素材**。
- **真正的缺口是 `wore`**：`wore` 全库 0 处正确使用（唯二出现是 hunt#28 的 `correction` 与 `explanation` 中文里）。
- **建议**：不单独为 `wear` 做课。若要做 `wore`，应并入「不规则过去式」批（见 §6 不确定项 2）。
- **对比 `among`**：`among` 是全应用 0 处正确（连填空提示都没有），`wear` 至少有一处 `I wear ___` 的架子，且其同族 `wears` 在课程里被教得很透。**这是两者优先级的差别。**

#### 6. `knock` — 缺口成立，形态学性质，本轮不做

- L99 `guided[5]`：`replaceTarget` = 「把 the phone rang 换成「有人敲门」」，`options: ["someone knocked","someone knock","someone was knocking"]`，答案是 `someone knocked`。
- 所以 `knocked` 在 L99 **是正确答案**（A 口径 = POS），只有 `someone knock` 是干扰项。`knock` 的裸形只出现在题干中文（`有人敲门（knock）`）与那个干扰项里。
- **不做课理由**：`knock` 在 L99 是「一下子用昨天版」这个点的**换词素材**，用户已从 `knocked` 学到了这个词的用法。缺口是「裸形未出现」的形态学缺口，不是语法缺口。OALD `knock` 动词，`Topics Health problems b1`。若做，也只能并入不规则/规则过去式批。

#### 7. `end` — **课程库内缺口成立，但全应用内有 9 处正确用例**；不做课

- 课程库 A 口径 = 0。唯一出现：L109 `guided[5].options` 里 `I waited until the movie will end.`（干扰项，答案是 `ended`）。
- 课程库内 `ended` 是 L109 `examples`（`We waited until the movie ended.`）+ `guided[5].explain`（`两边都用昨天版——ended。`）——**正确答案**。
- **⚠️ 全应用扫描发现 `end` 有 9 处正确的用户可见用例**，且形态齐全（含**名词**与**动词**两种词性）：
  - `libraryGateScripts.ts:258`（关卡脚本）：`...the clasp swings loose at the **end** of the sentence...`（名词）
  - `lighthouseGateScripts.ts:181 / 259`（灯塔关卡）：`...looking at you the way people look at a journey's **end**.`（名词）
  - `lighthouseGateScripts.ts:219`：`...the streets **end** at a dark shore.`（**动词原形**）
  - `adventureService.ts:332`：`...a door at the far **end** of the street.`（名词）
  - `aiService.ts:292 / 367 / 438`（AI 生成文本，用户可见）：`By the **end** of the review...` / `At the **end** of the lesson` / `By the **end**, the difficult words felt less distant`
- **不做课理由**：`end` 在用户可见内容里出现 9 次正确用法，且 `end`（名词）在 OALD 是 `Topics Literature and writing a1`（A1 档，最基础），用户不可能不认识。"课程里没把 `end` 当正确形式教"是事实，但它**不是一个需要课来补的语法点**——它是 `until` 那课（L109）的换词素材，规则（`until` 后面用昨天版）已教。**并且这一条是本报告的判断，不是数据结论**——若产品认为「课程内也应正面出现」有价值，最低成本的做法是给 L109 的 `examples` 加一句含 `end`/`ended` 的正面例子（一行数据），而不是开课。

#### 8. `bore` — 缺口成立，但项目已在同一课用别的形式覆盖

- A 口径 = 0。唯一出现：L113 `guided[0].options: ["bored","boring","bore"]`，答案是 `bored`，`bore` 是干扰项。
- 而 `bored` / `boring` 在 L113 都是 target 级正确用法（`I am bored.` / `The book is boring.`），并在 L117 / L118 复现。
- **不做课理由**：`bore` 这个形是「感到版/让人版」这一课**故意放进去的第三种形态**（用来考「不能用原形」）。它不是一个要教的词，而是这个考点的**第三个选项**。若为了它开课，会与 L113 的教学意图冲突。

---

### 三、缺口成立、本轮建议做（3 个）——`among`、`loud`、`careful`

**但这三个的缺口强度不同，必须分开说**：

| 词 | 课程库内正确用法 | 全应用内正确用法 | 缺口性质 | 建议 |
|---|---|---|---|---|
| `among` | **0** | **0** | **全应用无处正确呈现**（连冒险模式/关卡脚本都没有）| **硬结论：做 L196** |
| `loud` | **0** | 1（冒险模式台词）| 课程从不正面教；用户可能偶然在台词里见过 | 软建议：做 L197 |
| `careful` | **0** | 3（冒险模式台词 + **生词卡** + AI 模板）| 用户见过，但**全站在名词前面**，没站过 `is` 后面 | 软建议：做 L197 |

**共同点**：三者都**不是「换个形态就对了」**——`among` 是全新位置词（库里从没立过「在一群东西中间」）；`loud`/`careful` 缺的是「这个词能单独站、站 `is` 后面」这一面（而库里只把他们划掉）。

**不同点（决定优先级）**：`among` 在**全应用**范围内都无处正确呈现——这是 12 词里唯一一个。`loud`/`careful` 在冒险模式里已作为正确台词出现过，所以它们的缺口是「**课程内的**正面教学缺失」，而不是「用户从未接触」。

#### 9. `among` — **全应用唯一无处正确呈现的词**；本轮做（L196）

- **A 口径 = 0，B 口径 = 0**（`amongst` 也是 0——全族无任何正确呈现）。
- **课程库内仅 2 处，都是 L81 的 `distractors`**：`practice[2].distractors: ["among"]`（题面 `球在两个盒子之间`）、`practice[4].distractors: ["among"]`。
- **课程库外也全为 0**（核查 6 实测）：关卡脚本 0、冒险模式 0、日记提示 0、AI 模板 0。**唯一提到它的非课程文件是测试** `src/data/grammarLessons.test.ts:1089-1099`（用户不可见）：
  ```ts
  it("数量线索：题干说「两个」不该用 among，说「那些」不该用 between", () => {
    ...
    if (/(两个|那两|两者|一对)/.test(prompt) && answerWords.includes("among")) {
      offenders.push(`${lesson.id} 题干「${prompt}」说的是两个，答案却用 among（${step.answer}）——among 用于三个以上`);
  ```
  即：**项目已经为 `among` 的用法写了守护断言（批四十二新增），却从未给它一节课。** 用户看不到这条断言。
- **L81 甚至留下了一条自认矛盾的批注**（源码原文）：
  > `// 批四十二修：题干原写「那些盒子中间」（三个以上）却以 between 作答、把 among 当干扰项——题干意图与答案矛盾。改为明确的两个盒子，与 between 的用法（两头点名）一致。`
  即：**上游已经发现「三个以上本该用 among」这件事**，处理方式是**把题干改成两个**，而没有补 `among` 这一课。这正是缺口的来源——它被识别过，但只被「绕开」，没被「补上」。
- **为什么该做（本报告最硬的结论）**：
  1. **全应用 0 处正确呈现**——12 词里唯一一个。用户在任何界面都不会遇到 `among` 的正确用法。
  2. `among` 是 OALD **`ox3000` 全 3 个义项都标记**的词（见 §4），是核心 3000 词，不是偏词。
  3. 它是 L79–L86「找东西」大章（8 课）**唯一缺席的位置词**——该章已教 `next to`(L79) / `in front of`+`behind`(L80) / `between`(L81) / `put`(L82) / `something`(L83) / `nothing`(L84) / `whose`(L85) / 收口(L86)，而「在一群东西中间」这个高频位置从未立过。
  4. L81 已经埋好了对照面（两个 vs 一群），是最省的接续点。
  5. **项目已有守护断言却无课程**——这是一处明确的自相矛盾，补课能同时消解它。

#### 10. `loud` — **课程库内是真缺口，全应用范围内已被台词覆盖**；本轮建议做（L197，可被否）

- **课程库口径 A = 0，B = 0**（`loud`、`louder`、`loudest` 全 0）。
- 课程库内 4 处负面：L58 `contrast[].wrong` = `He reads loud.`（正确是 `reads loudly`）、L59 `guided[5].options` 含 `loud`（答案是 `loudly`）、hunt#67 `tokens[13]` = `loud`（错误，`correction: "loudly"`）+ 其 `explanation`（`「喊得声音大」要加 -ly 的样子词：shouts loudly。`）。
- 中文侧出现 3 处（L58/L59 `deepDive`、L59 `guided[5]`），都写成 `loud→loudly` 的形式。
- **⚠️ 但全应用扫描发现 1 处正确的用户可见用例**：冒险模式城市章 `adventureService.ts:142`
  > `"At a small city cafe, the owner gives you a letter with no address. On the back, someone wrote: \"Begin where the clocks are **loud**.\""`
  （中文对译：`从钟声最响的地方开始`——**这里 `loud` 正是「站 is 后面」的形容样子用法**，恰好就是 L197 想教的那一面。）
- **所以缺口要重新表述**：不是「用户从未见过 `loud` 的正确用法」，而是「**课程从不把 `loud` 当正确形式教**（只在课程里把它划掉）」。这是一条**更弱**的缺口——用户可能在冒险模式里见过它站 `is` 后面，但没人告诉他「这和 `loudly` 是同一个词的两张脸」。
- **为什么仍建议做**：`loudly` 在 L58 是 target 级正确用法，而 `loud` 只被划掉——**这条 `-ly` 转换链在课程内是不对称的**。冒险模式那处台词恰好可以**回流**进 L197 当双正解卡（`Begin where the clocks are loud.`），把「用户偶然见过的」变成「用户被教过的」。**但这条建议可被产品否掉**（见 §6 不确定项 1）。

#### 11. `careful` — **课程库内是真缺口，全应用范围内已被台词/生词卡覆盖**；本轮建议做（L197，可被否）

- **课程库口径 A = 0**。课程库内 3 处负面：L58 `guided[5].options` 含 `careful`（答案是 `carefully`）、L58 `practice[3].distractors: ["careful"]`、L58 `practice[4].distractors: ["careful"]`。
- 课程库内中文侧 4 处（L58 `oneLineRule`、`contrast[].whyZh`、`guided[5]`、`deepDive`；L59 `deepDive`），都写成 `careful→carefully`。
- 课程库内 `carefully` 是 target 级正确用法（`He does his homework carefully.` 在 L58 examples；`She reads carefully.` 在 practice×2 的 answer）。
- **⚠️ 全应用扫描发现 3 处正确的用户可见用例**：
  - 冒险模式奇幻章 `adventureService.ts:246`（故事正文）
    > `"...a calm voice says, \"The forest path is hidden by mist. I need a **careful** walker.\""`
    中文对译：`我需要一位细心的行者`
  - 冒险模式生词卡 `adventureService.ts:257`（**带词卡，用户会专门学它**）
    > `{ word: "careful", translation: "小心的", partOfSpeech: "adjective", sentence: "The lamp needs a **careful** walker." }`
  - AI 故事模板 `aiService.ts:430`
    > `? "Mia walked into class with a **careful** plan"`
- **所以缺口要重新表述**：`careful` 作为**词**用户见过（甚至见过带词卡的专门教学），但**都站在名词前面**（`a careful walker` / `a careful plan`）；**没有一处站在 `is` 后面**。而 `careful` 与 `carefully` 的对照恰恰全在「站 `is` 后面」vs「站动作后面」这个位置上。
- **为什么仍建议做**：`careful` 是 L58 `oneLineRule` 里点名的**原型例子**（`大多是形容样子的词加 -ly 变来——quick→quickly、careful→carefully`），而 `quick` 的两面都亮了（`She is quick.` 是 `bothRight` 卡，`She runs quickly.` 是 target）。`careful` 是这条对照链上**唯一断掉的一环**。
- **额外收益**：L197 可以把冒险模式那两张卡（`The lamp needs a careful walker.`）**回流**为双正解卡——这样「同一个词三个位置」（名词前 / `is` 后 / 加 `-ly` 站动作后）一次立全，且复用了用户已经在冒险模式里见过的句子。**同样可被产品否掉**（见 §6 不确定项 1）。

---

## ③ 拆课方案

### 为什么拆 2 课（族不同）

| | `among` | `loud` / `careful` |
|---|---|---|
| 所属族 | **位置词族**（L79–L86 大章） | **「怎么样 vs 怎么做」族**（L58/L59） |
| 对照对象 | L81 `between`（两头点名） | L58 `-ly` 转换（`quick`→`quickly`） |
| 教学词汇 | 位置词、两头点名、and 牵手 | 形容样子的词、样子词、站后面 |
| 若合并会怎样 | 同时破坏两条对照链；且 L196 一课要塞 3 个新点，超出项目常规（2–3 个点，L191 是 1 个、L192 是 2 个） | 同左 |

**结论：拆 2 课。L196 = 1 个点；L197 = 2 个点。**

---

### L196 · `among`

| 字段 | 值 |
|---|---|
| 课号 | 196 |
| 建议 id | `lesson-196-among` |
| 建议 title | 一堆东西中间 |
| 建议 grammarLabel | 位置词 · among（一群里面） |
| 建议 scene | `mansion`（与 L195 同场景，接续「找猫」剧情） |
| targetSentence | **`The cat is among the boxes.`** |
| 中文意图 | 猫在一堆箱子中间 |
| 词数 | 6 词 |
| 最长分句 | 6 词 —— **与 L195 的 6 词完全持平，跳升 0**（守门上限 +5） |
| episode | 小美的一天 一百九十六 |

**为什么这句**

1. **全部词都已教过**，无越级：`the`（L1+）、`cat`（L3 examples `I have a small cat.`）、`is`（L1+）、`boxes`（L81 examples `The ball is between the two boxes.`）。**`among` 是唯一新词。**
2. **与 L81 的直接对照**：L81 教 `between the two boxes`（两个），L196 教 `among the boxes`（一堆）——同一批 `boxes`、同一场景物件，只把「两个」换成「一群」，用户能一眼看出差别。
3. **与 L195 剧情连续**：L195 是「猫在它的盒子里」（`The cat is in its box.`，scene=`mansion`），L196 顺势「猫在一堆箱子中间」，是同一条找猫线的下一格。
4. **`scene: mansion` 是库里使用最多的场景（63 课），安全**；`space` 场景（本批背景提到的「从未用过」）**本轮不建议用**——`among` 的教学需要一屋子可数的箱子，`space` 里没有「一堆东西」的具象对子，硬用时用户要同时处理新场景与新位置词（见 §6 不确定项 4）。

**建议的对照卡方向（3 错 + 3 双正解）**

- 错：`The cat is between the boxes.`（只给一群、两头没点名）→ 正：`The cat is among the boxes.`
- 错：`The cat is among the two boxes.`（两个不能用 among）→ 正：`The cat is between the two boxes.`
- 错：`The cat is among boxes.`（among 后面要带 the）→ 正：`The cat is among the boxes.`
- 双正解：`The ball is between the two boxes.`（L81 回流，两个）
- 双正解：`The cat is in its box.`（L195 回流，只有一个）
- 双正解：`My hat is in the box.`（L18 回流，单数）

**零术语核查**：上述教学话术须用「位置词 / 两头点名 / and 牵手（L81 用语）/ 一群」——已核 `among`、`一群`、`两头点名` 均不在 29 词红线表内。

---

### L197 · `loud` + `careful`

| 字段 | 值 |
|---|---|
| 课号 | 197 |
| 建议 id | `lesson-197-loud-careful` |
| 建议 title | 声音大、很仔细 |
| 建议 grammarLabel | 形容样子的词 vs 做事的样子词 · loud / careful |
| 建议 scene | `campus`（承接 L58 的运动会/同学场景） |
| targetSentence | **`My brother is loud, but I am careful.`** |
| 中文意图 | 弟弟声音大，我很仔细 |
| 词数 | 8 词 |
| 最长分句 | 8 词 —— 从 L195 的 6 词跳 +2（守门上限 +5，**通过**） |
| episode | 小美的一天 一百九十七 |

**为什么这句**

1. **全部词都已教过**：`my`（L1+）、`brother`（L2 target `He is my brother.`）、`is`、`loud`（新）、`but`（L19 `The snow is cold but fun.`）、`I`、`am`、`careful`（新）。**只有 `loud`/`careful` 两个新点。**
2. **一句里同时亮出两个新点，且各自站在「形容样子的词」的位置**（在 `is` 后面）——这正是本项目要给 `careful`/`loud` 补的那一面：它们**能单独站**，且站的位置和 `carefully`/`loudly` 不同。
3. **`but` 让两个新点形成自然对比**：弟弟（声音大）vs 我（很仔细），恰是「两个不同的人各有一个特点」，避免为了塞两个词而造出别扭句。
4. **`but` 已教过 L19**，不引入新连词负担。

**建议的对照卡方向（3 错 + 3 双正解）**

- 错：`My brother is loudly.`（`loudly` 不站 `is` 后面）→ 正：`My brother is loud.`
- 错：`I am carefully.`（同上）→ 正：`I am careful.`
- 错：`My brother is loud, but I am carefully.` → 正：`My brother is loud, but I am careful.`
- 双正解：`He reads loudly.`（L58 回流——**`loudly` 站动作后面**）
- 双正解：`She does her homework carefully.`（L58 回流）
- 双正解：`My brother shouts loudly.`（同一个人、同一个嗓子，**两张脸**）

**⚠️ 这一课必须处理好 `loud` 的「两张脸」**

L58 现在把 `He reads loud.` **判为错句**。但 OALD 明确说 `Loud` **也能当副词**（`Loud is very common as an adverb in informal language.`——见 §4）。严格说 `read loud` 在口语里可接受（`read out loud` 更是固定说法）。**所以 L58 的这张对照卡存在被外部标准挑战的风险**，而 L197 正好是修正它的机会：

- 建议 L197 不动 L58 的数据（本批不改代码），但在 L197 的对照卡里把条件说清楚：`loud` 站 `is` 后面是「形容样子的词」；要修饰动作时通常用 `loudly`（`shouts loudly`），而 `too loud` / `so loud` / `loud enough` 这几种说法里 `loud` 也常直接跟在后面。
- 建议把「`He reads loud.`」这个例子在后续批次里换成 `He reads loudly.` 之外的、无争议的对子（如 `He speaks loudly.`），因为「读书声音大」在标准英语里的常见说法就是 `read aloud` / `read out loud`，用 `loud` 作反例不够干净。**这一条建议列入 §6 不确定项 3，交由产品决定。**

**零术语核查**：`形容样子的词`（L58 已用，3 处）、`样子词`（L58/L59 已用，30 处）、`站后面`、`两张脸`（L195 已用）均在红线表外。**不得**使用「形容词」「副词」。

---

### 两课的季分组（硬护栏提醒）

`src/data/grammarSeasons.ts` 的 `min/max` 区间过滤是**必需机制**：课号不落在任何区间内会在路径页被**静默过滤**（整课不显示、无报错）。当前 `season-28` 是 `min: 182, max: 195`。

**所以上 L196/L197 必须同时做两件事**：

1. 追加 `{ id: "season-29", label: "...", hint: "...", min: 196, max: 197 }`（或把 `season-28` 的 `max` 扩到 197——但按项目先例，新批开新季更清晰）；
2. 同步 `grammarSeasons.test.ts` 的基线断言（该测试守门区间与课数）。

另需随批更新（按第 41 批路线图的同款清单）：`GrammarPathPage.tsx` 的 `can-do-m43`、`src/edge/**` 的课数/案数计数、`grammarLessons.test.ts` 的难度断崖守门（新两课会自动纳入，需确认 `L195(6) → L196(6) → L197(8)` 序列无越界——已核：6→6 跳 0、6→8 跳 +2，均 ≤5）。

---

## ④ 外部依据与逐字引用

### 抓得到的源

#### A. Cambridge Dictionary · British Grammar — `Between or among?`

- URL：`https://dictionary.cambridge.org/grammar/british-grammar/among-or-between`
- 状态：**抓取成功**（HTTP 200，449,989 字节）

**逐字引用 1**（`among` vs `between` 的核心区分，本课 L196 的直接依据）：

> "We use between to refer to two things which are clearly separated. We use among to talk about things which are not clearly separated because they are part of a group or crowd or mass of objects:"

**逐字引用 2**（给出两个例句与括注，正好是 L196 要用的「一群」意象）：

> "Our holiday house is between the mountains and the sea. (the mountains are on one side and the sea is on the other)"
> "The ancient fountain was hidden among the trees. (surrounded by trees)"

**逐字引用 3**（`among` 的定义与搭配要求）：

> "We use among to suggest a sense of being a part of or surrounded by or included in something else. It is typically followed by a plural noun phrase:"
> "She wanted to be among friends."
> "Among his books, we found some rare first editions."

**逐字引用 4**（`between` 还能接时间/数字，而 `among` 不能——可用于对照卡说明「什么时候不用 among」）：

> "We can also use between, but not among, to connect times or numbers:"
> "They lived in New York between 1998 and 2004."
> "Not: They lived in New York among 1998 and 2004."

**对 L196 的结论**：Cambridge 给的判据是「clearly separated（两个/两头分明）」vs「part of a group or crowd or mass（一群/一片里）」，与本项目 L81「两头点名」vs 新 L196「一群里面」完全同构。**注意 Cambridge 的原句用的是 `hidden among the trees`，与本报告建议的 `The cat is among the boxes.` 结构一致（东西 + is + among + 复数名词）。**

---

#### B. Oxford Advanced Learner's Dictionary (OALD) — `among`

- URL：`https://www.oxfordlearnersdictionaries.com/definition/english/among`
- 状态：**抓取成功**（HTTP 200）

**逐字引用 5**（`among` 与「三个或更多」的关联，直接支持 L196 与 L81 的分工）：

> "used when you are dividing or choosing something, and three or more people or things are involved"
> "They divided the money up among their three children."

**逐字引用 6**（第一义项，位置感）：

> "surrounded by somebody/something; in the middle of somebody/something"
> "a house among the trees"
> "They strolled among the crowds."
> "It's OK, you're among friends now."

**Oxford 等级标记（本报告实测提取）**：`among` 的 **全部 3 个义项都带 `ox3000="y"`**，且整条目带 **`OPAL W`** 标记（Oxford Phrasal Academic Lexicon, written）。**即 `among` 是 Oxford 3000 核心词，3/3 义项全在核心表内**——这是 12 词里最"该教"的一个。

对照：`between` 的 9 个义项中 **8 个带 `ox3000="y"`**（更核心，也说明它是先教的），CEFR 标记 `A1`；`among` 的 CEFR 标记 `A2`。**这一档差正好支持「L81 先教 between（A1），L196 后补 among（A2）」的顺序。**

---

#### C. OALD — `careful` / `loud` / `loudly`（L197 的直接依据）

- `careful`：`https://www.oxfordlearnersdictionaries.com/definition/english/careful`（HTTP 200）
- `loud`（形容词）：`https://www.oxfordlearnersdictionaries.com/definition/english/loud_1`（HTTP 200）
- `loud`（副词）：`https://www.oxfordlearnersdictionaries.com/definition/english/loud_2`（HTTP 200）
- `loudly`：`https://www.oxfordlearnersdictionaries.com/definition/english/loudly`（HTTP 200）

**逐字引用 7**（**本报告最关键的一处**——OALD 专设 `Which Word?` 专栏讨论 `loud` 能不能当副词，直接关系到 L58 那张对照卡站不站得住）：

> "Which Word? loud / loudly / aloud
> Loudly is the usual adverb from the adjective loud : The audience laughed loudly at the joke. Loud is very common as an adverb in informal language. It is nearly always used in phrases such as loud enough , as loud as or with too , very , so , etc: Don’t play your music too loud. I shouted as loud as I could. Louder is also used in informal styles to mean ‘more loudly’: Can you speak louder? Out loud is a common adverb meaning ‘so that people can hear’: Can you read the letter out loud?"

**逐字引用 8**（`careful` 的定义与「站 is 后面」的用法，支持 L197 的 target 句式）：

> "giving attention or thought to what you are doing so that you avoid hurting yourself, damaging something or doing something wrong"
> "Be careful!"
> "I was careful to keep out of sight."
> "Be careful not to wake the baby."

**逐字引用 9**（`loud` 形容词定义 + 本报告建议的句子结构来源）：

> "making a lot of noise"
> "She spoke in a very loud voice ."
> "That music's too loud—please turn it down."
> "I play loud music and dance around my house."
> "Eventually, the shouting got louder ."

**逐字引用 10**（`loudly` 的副词定位）：

> "in a way that makes a lot of noise"
> "She screamed as loudly as she could."

**Oxford 等级标记（实测）**：

| 条目 | senses | 带 `ox3000` 的 senses | CEFR（Topics 标记） |
|---|---|---|---|
| `careful` | 4 | **2** | `Personal qualities a2` |
| `loud`（形容词） | 4 | 1 | `Personal qualities b1`；`Clothes and Fashion c2`；`Colours and Shapes c2` |
| `loud`（副词） | 6 | 1 | —（标 `(informal)`）|
| `loudly` | 1 | **1** | — |

**⚠️ 这张表暴露了一个重要事实**：`careful` 是 **A2**，`loud`（形容词）是 **B1**，而 `loud`（副词）被 OALD 明确标为 **`(informal)`**。也就是说：

- `careful`（A2）比 `loud`（B1）更该早教；
- `loud` 作副词是**口语非正式**用法，OALD 说它「nearly always」出现在 `loud enough`/`as loud as`/`too, very, so` 这类结构里——**L58 用 `He reads loud.` 作错例，属于一种简化处理**（`read loud` 不属于 OALD 列举的那几类结构，所以判错可接受，但边界很窄）。
- **建议**：L197 明确只教 `loud` 作「形容样子的词」（站 `is` 后面），**不要**在 L197 里回头去讨论 `loud` 作副词的情形；把 `loud` 副词的边界写进 `deepDive`（深挖卡允许保留术语、且是进阶内容）。**这正是 §3 里建议在后续批次把 L58 的 `He reads loud.` 换成更干净例子的原因。**

---

#### D. Cambridge Dictionary · British Grammar — `Adverbs: forms`（L197 的 -ly 依据）

- URL：`https://dictionary.cambridge.org/grammar/british-grammar/adverbs-forms`
- 状态：**抓取成功**（HTTP 200）

**逐字引用 11**：

> "Adverbs have a strong connection with adjectives. Adjectives and adverbs are usually based on the same word. Adverbs often have the form of an adjective + -ly."
> "He was calm when I told him."
> "That was a beautiful presentation, Carla."
> "Your work is beautifully presented, Carla."

**逐字引用 12**（**恰好把 `carefully` 当作 -l 结尾的样板词**——与 L58 的 `careful→carefully` 教学点逐字对应）：

> "Adverbs formed from adjectives ending in -l have double l:
> beautiful → beautifully, careful → carefully, hopeful → hopefully, historically → historically"

**逐字引用 13**（拼写规则：以 `-y` 结尾改 `i`；以「辅音 + e」结尾保留 `e`——**后者正好是 L58 那句「拼写把 e 留住」的外部依据**）：

> "Adverbs formed from adjectives ending in -y change the y to i:
> easy → easily, busy → busily, lucky → luckily, angry → angrily"
> "Adverbs ending in a consonant +e keep the e:
> definite → definitely, fortunate → fortunately, extreme → extremely, absolute → absolutely"

**逐字引用 14**（少数副词同形，含 `fast`——对应 L59）：

> "Some adverbs have the same form as adjectives. The most common are: fast (not fastly), left, hard, outside, right, straight, late, well, and time words such as daily, weekly, monthly, yearly."

---

#### E. Cambridge Dictionary · British Grammar — `Fast, quick or quickly?`

- URL：`https://dictionary.cambridge.org/grammar/british-grammar/fast-quick-or-quickly`
- 状态：**抓取成功**（HTTP 200）

**逐字引用 15**（同族「词形与词位」判断的权威表述，可直接支撑 L197 的对照设计）：

> "Fast and quick mean moving with great speed. Fast is both an adjective and an adverb. Quick is an adjective and the adverb form is quickly."
> "We need to have a quick chat before the meeting."
> "Fast and quick are adjectives."
> "We should do it as quickly as possible."
> "Fast and quickly are adverbs."

---

#### F. Cambridge Dictionary · British Grammar — `Adverbs and adverb phrases: typical errors`

- URL：`https://dictionary.cambridge.org/grammar/british-grammar/adverbs-and-adverb-phrases-typical-errors`
- 状态：**抓取成功**（HTTP 200）

**逐字引用 16**（说明副词类最常见错误是**拼写**——这正是 L58 `carefully` 那句「拼写把 e 留住」的落点；`carefuly` 恰好是库里出现过的错形）：

> "Many errors with adverbs are spelling errors:"
> "It happened quite accidentally."
> "Not: … quite accidentaly."
> "It's not something that can be done easily."
> "Not: … that can be done easly."
> "They were happily married for 20 years."
> "Not: They were happyly married …"
> "The building was completely destroyed."
> "Not: … completly destroyed."

---

#### G. Cambridge Dictionary · British Grammar — `Bored or boring?`（`bore` 判定依据）

- URL：`https://dictionary.cambridge.org/grammar/british-grammar/bored-or-boring`
- 状态：**抓取成功**（HTTP 200）

**逐字引用 17**（`bored`/`boring` 的分工，支持 §2「`bore` 只是 L113 考点的第三个选项」）：

> "Bored is used to describe how someone feels."
> "If something or someone is boring, they make you feel bored."

**注意**：Cambridge 该页的两组对照写成了纠错形态（`He didn't enjoy the lesson because he was boring.` / `The book was long and bored.` 配 `Not:` 式修正），**没有单独讨论 `bore` 这个词**。所以 `bore` 在权威侧**不是独立教学对象**——这反向支持「不为 `bore` 做课」。

---

#### H. Cambridge Dictionary · British Grammar — `Among and amongst`

- URL：`https://dictionary.cambridge.org/grammar/british-grammar/among-and-amongst`
- 状态：**抓取成功**（HTTP 200）

**逐字引用 18**：

> "Among and amongst are prepositions."
> "Among means ‘in the middle or included in a larger group of people or things’. Among is commonly followed by a plural noun phrase:"
> "I'm not worried about her. She's living among friends."
> "I think I've got that album among my boxes of CDs upstairs."
> "Amongst is sometimes used as an alternative to among. It is more formal and less common:"

**对 L196 的价值**：`among` **必须跟一群**（`a plural noun phrase`）这条被反复强调，且例句 `among my boxes of CDs` 与本报告建议的 `among the boxes` 结构一致。`amongst` 更正式、更少见——**L196 不需要教 `amongst`**（本报告实测库里 `amongst` 出现 0 次正确用法，也没必要引入）。

---

#### I. OALD — 其余三词（用于说明「为何不做课」）

- `wear`：`https://www.oxfordlearnersdictionaries.com/definition/english/wear`
  > "to have something on your body as a piece of clothing, a decoration, etc."
  > "He was wearing a new suit." / "to wear a shirt/hat/uniform" / "Do I have to wear a tie?"
  等级：`Topics Clothes and Fashion a1`（A1，最基础档）

- `uniform`：`https://www.oxfordlearnersdictionaries.com/definition/english/uniform`
  > "the special set of clothes worn by all members of an organization or a group at work, or by children at school"
  > "The hat is part of the school uniform ." / "Do you have to wear uniform ?"
  等级：`Topics Law and justice a2` / `Education a2`（A2）

- `grandpa`：`https://www.oxfordlearnersdictionaries.com/definition/english/grandpa`
  > "grandfather"（词条全文）
  > "grandma and grandpa"
  等级：`Topics Family and relationships a1`；**但是 12 词里唯一 `ox3000-senses = 0` 的词**（不在 Oxford 3000 核心词表内），且标 `(informal)`。**这是「不为 grandpa 做课」的外部依据。**

- `afternoon`：`https://www.oxfordlearnersdictionaries.com/definition/english/afternoon`
  > "the period of time from 12 o'clock in the middle of the day until about 6 o’clock in the evening"
  > "this/yesterday/tomorrow afternoon" / "in the afternoon" / "In the afternoon, they went shopping."
  等级：`Topics Time a1`（A1，最基础档）——**与库内 L18 已教 `in the morning` 同组，支持「假缺口」判定**

- `end`（名词）：`https://www.oxfordlearnersdictionaries.com/definition/english/end_1`
  > "the final part of a period of time, an event, an activity or a story"
  等级：`Topics Literature and writing a1` / `Time a2`；`end`（动词）`Topics ... a1`
- `knock`：`https://www.oxfordlearnersdictionaries.com/definition/english/knock`
  > "to hit a door, etc. in order to attract attention synonym rap"
  > "He knocked three times and waited." / "knock at/on something" / "I knocked on the door and went straight in."
  等级：`Topics Health problems b1`

- `dog`：`https://www.oxfordlearnersdictionaries.com/definition/english/dog`
  > "[countable] an animal with four legs and a tail, often kept as a pet or trained for work"
  等级：`Topics Animals a1`（A1）

- `bored`：`https://www.oxfordlearnersdictionaries.com/definition/english/bored`
  > "feeling tired and impatient because you have lost interest in somebody/something or because you have nothing to do"
  等级：`Topics Feelings a1`（A1）

---

### 抓不到的源（明确声明）

#### 1. British Council LearnEnglish — **抓不到**

- 尝试的 URL 与结果：
  - `https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/adverbs` → **HTTP 403**（curl，带完整浏览器 UA）／**HTTP 404**（WebFetch）
  - `https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/adjectives` → **HTTP 403**
  - `https://learnenglish.britishcouncil.org/grammar/b1-b2-grammar/adjectives-and-adverbs` → 连接失败（`000`）
  - `https://learnenglish.britishcouncil.org/grammar/b1-b2-grammar/adverbs-of-manner` → 连接失败（`000`）
  - `https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/adjective-order` → 连接失败（`000`）
  - `https://learnenglish.britishcouncil.org/`（站点根） → **HTTP 403**
- 尝试过的访问方式：`curl -sL` 带 Chrome UA（macOS 与 Linux 两种 UA 串）、`WebFetch` 工具、HTTP 与 HTTPS。**全部失败。**
- 结论：**British Council LearnEnglish 对本环境整体封锁（站点根即 403，非个别页面问题）。本报告不含来自 British Council 的引用。**
- 替代：Adverbs/‑ly 形成与拼写规则改用 **Cambridge Dictionary British Grammar** 的 `Adverbs: forms`（§4-D）与 `Adverbs and adverb phrases: typical errors`（§4-F），二者覆盖同一知识点且引到了 `careful → carefully` 这个本项目正需的样例。

#### 2. 中文侧权威教学源 — **部分抓不到**

- 尝试并失败的：
  - `https://zhuanlan.zhihu.com/p/...` → **HTTP 403**
  - `https://baike.baidu.com/item/among` → **HTTP 403**（返回「百度安全验证」页）
  - `https://www.zhihu.com/question/...` → **HTTP 403**
  - 经 `cn.bing.com` 检索 `among between 区别 中文` → **返回结果与查询完全无关**（结果全是「Windows 桌面图标不显示」等无关内容，聚类污染）；检索 `site:hjenglish.com among between 区别` → **解析出 0 条结果链接**。
- 抓到的（**但不足以作为权威依据**，仅作「中文侧也这样教」的旁证）：
  - 爱词霸 `https://www.iciba.com/word?w=among` 等：给出考试档位标签，**这组数据被本报告采用**（见下表）。
  - 有道 `https://dict.youdao.com/w/among/`：给出释义与例句，**未采信其权威性**（无出处标注）。
- **中文侧考试档位表**（爱词霸「牛津词典」标签，实测提取）：

| 词 | 中文侧考试档位 |
|---|---|
| `careful` | 高中 / CET4 / CET6 / 考研 / TOEFL |
| `loud` | 高中 / CET4 / CET6 |
| `wear` | 高中 / CET4 / CET6 |
| `end` | 高中 / CET4 / CET6 / 考研 / IELTS |
| `uniform` | 高中 / CET4 / CET6 / 考研 / GRE / TOEFL / IELTS |
| `dog` | 高中 / CET4 / CET6 |
| `afternoon` | 高中 / CET4 / CET6 |
| `knock` | 高中 / CET4 / CET6 |
| `bored` | **高中**（仅此一档）|
| `grandpa` | **无档位标签**（仅「简明词典 / 柯林斯 / 牛津」，无考试档）|
| `among` | 高中 / CET4 / CET6 |

**这张表的用法**：`among`、`careful`、`loud` 都在「高中/CET4」这一档，即中国学习者的**正规教学序列内**（不是超纲词）；而 `grandpa` 是**唯一一个连档位标签都没有**的词——与 OALD 的 `ox3000-senses=0` 结论一致，**双向支持「不为 grandpa 做课」**。

- **明确声明**：中文侧**未找到可引用其逐字原文的权威教学文章**（知乎、百度百科 403；搜索引擎结果被污染）。本报告对「中文侧怎么教」的判断**仅基于爱词霸的考试档位标签**，不含中文教学文章的逐字引用。

---

## ⑤ 自我核查记录

### 核查原则（按本批要求）

1. **不用 `grep`**：本地 `grep` 是 ugrep，会假返回 0。
2. **全库检索字符串再定位**：不只看「被指认的那一课」，而是扫全库（`grammarLessons.ts` + `huntCases.ts` + `grammarSeasons.ts`，并扩到整个 `src/`）。
3. **词边界正则排除假命中**：用 `(?<![A-Za-z-])word(?![A-Za-z-])`（并额外排除 `'`，避免 `grandpa's` 被当成 `grandpa`）。
4. **读真实数据对象**：用 esbuild 把 TS 转成 JS 后 `import`，对**解析后的对象**逐字段判定，而不是对源码文本行做正则（避免把注释里的词当成教学内容）。

### 环境与工具

```
$ node --version
v24.14.0

$ ./node_modules/.bin/esbuild src/data/grammarLessons.ts src/data/huntCases.ts \
    --outdir=/tmp/dd --format=esm --platform=node --log-level=error
（成功）

$ node -e "import('/tmp/dd/lessons.stub.js').then(m=>console.log('lessons',m.grammarLessons.length))"
lessons 195

$ node -e "import('/tmp/dd/hunt.stub.js').then(m=>console.log('huntCases',m.huntCases.length))"
huntCases 204
```

（`grammarLessons.ts` 有 117 行 `import coverN from "../assets/lessons/lesson-N.jpg"`，已用 `const coverN = "coverN";` 打桩；`huntCases.ts` 只 `import type`，剥离后可直接执行。）

### 核查 1 · 词边界正则基线（12 词全库计数）

命令（`/tmp/checkwords.mjs`）：

```js
const re = new RegExp(`(?<![A-Za-z-])${w}(?![A-Za-z-])`);   // 大小写敏感
const reI = new RegExp(`(?<![A-Za-z-])${w}(?![A-Za-z-])`,'i');
// 对 grammarLessons.ts / huntCases.ts / grammarSeasons.ts 逐行计数
```

输出（节选，`grammarLessons.ts` 命中行数）：

```
WORD: uniform       lessons: 3 hits -> lines 750,752,753      hunt: 0
WORD: dog           lessons: 5 hits -> lines 908,909,911,957,976   hunt: 13
WORD: afternoon     lessons: 3 hits -> lines 4489,4491,4492   hunt: 7
WORD: wear          lessons: 6 hits -> lines 7289,7290,7298,7381,7669,7670   hunt: 2
WORD: loud          lessons: 8 hits -> lines 10893,10894,10896,10914,11105,11164,11167,11169   hunt: 2
WORD: careful       lessons: 9 hits -> lines 10846,10890,10914,10971,10974,10976,11002,11008,11105   hunt: 0
WORD: among         lessons: 3 hits -> lines 15475,15486,15490   hunt: 0
WORD: knock         lessons: 2 hits -> lines 18963,18966        hunt: 0
WORD: blackboard    lessons: 1 hits -> line 20404              hunt: 0
WORD: end           lessons: 1 hits -> line 20884              hunt: 0
WORD: grandpa       lessons: 5 hits -> lines 21317..21498      hunt: 0
WORD: bore          lessons: 1 hits -> line 21633              hunt: 0
```

**结论**：12 词全部**只在** `grammarLessons.ts`（+`huntCases.ts` 的 `dog`/`afternoon`/`wear`/`loud`）出现，`grammarSeasons.ts` **全部 0 命中**。**注意 `uniform`/`afternoon` 的第 2 行命中（752 / 4491）就是 `correct:` 字段**——单看行数会误判为「全是负面」，必须看字段名（这就是核查 3 的必要性）。

（本报告正文给出的「L 编号」由 `/tmp/lessonmap.mjs` 生成：从源码扫 `id:` 与 `number:` 建立「行号 → 课号」映射，再把每个命中行号映射回课号。）

### 核查 2 · 字段身份判定（positive / negative 靠**字段名**而非行号）

命令（`/tmp/fieldcls.mjs`）从每个命中行**向上回溯**到最近的 `key:`，得到：

```
uniform     lessons:750  key=wrong        NEG
uniform     lessons:752  key=correct      POS      <-- 关键：不是「全负面」
uniform     lessons:753  key=whyZh        META
...
afternoon   lessons:4491 key=correct      POS      <-- 关键
blackboard  lessons:20404 key=wrong        NEG  ← 但该条 bothRight:true，实为 POS（见核查 4）
grandpa     lessons:21319 key=answer      POS
dog         lessons:2906  key=tokens      POS  ← 但这是 hunt 草稿 token（见核查 5）
```

**逐字段判定表**（对解析后对象，`/tmp/exhaustive.mjs`「全字段遍历」）：

```
### uniform: 3 string-field hits  | deepDive hits: 0
    by kind: {"POS/OTHER":3}
### dog: 6 string-field hits  | deepDive hits: 1
    by kind: {"POS/OTHER":4,"NEG(options-distractor)":2}
    DEEPDIVE L5 deepDive.paragraphs[0]: 说「我喜欢狗」……所以 dog 要变成好几个的形式 dogs……
### afternoon: 3 string-field hits  | deepDive hits: 0
    by kind: {"POS/OTHER":3}
### wear: 6 string-field hits  | deepDive hits: 0
    by kind: {"POS/OTHER":5,"NEG(options-distractor)":1}
### loud: 8 string-field hits  | deepDive hits: 2
    DEEPDIVE L58 …quick→quickly、careful→carefully、loud→loudly……
    DEEPDIVE L59 …quick→quickly、careful→carefully、loud→loudly——加个 -ly 就是「做得怎么样」。
### careful: 9 string-field hits  | deepDive hits: 2
    by kind: {"POS/OTHER":6,"NEG(options-distractor)":1,"NEG":2}
### among: 2 string-field hits  | deepDive hits: 0
    by kind: {"NEG":2}                          <-- 全部负面
### knock: 2 string-field hits  | deepDive hits: 0
    by kind: {"POS/OTHER":1,"NEG(options-distractor)":1}
### blackboard: 1 string-field hits  | deepDive hits: 0
    by kind: {"POS/OTHER":1}
### end: 1 string-field hits  | deepDive hits: 0
    by kind: {"NEG(options-distractor)":1}
### grandpa: 6 string-field hits  | deepDive hits: 0
    by kind: {"POS/OTHER":3,"NEG(options-distractor)":2,"NEG":1}
### bore: 1 string-field hits  | deepDive hits: 0
    by kind: {"NEG(options-distractor)":1}
```

**这张表是对本批任务的第一个修正**：`uniform` / `afternoon` / `blackboard` **并非全负面**——它们各有 1 处 `correct`（或 `bothRight`）呈现。上游「12 个实词只在负面位置出现」的口径**偏宽**，本报告收紧为「**是否被明确告知这样说对**」。

### 核查 3 · 两口径对照（A 严格 / B 含 hunt 草稿）

命令（`/tmp/twoway.mjs`）：

```
word       A(presented-correct)  B(+hunt-clean)   NEG   VERDICT
uniform           1                1     1   COVERED (presented as correct)
dog               0                3    11   GAP-in-taught-content (only passes by in a flawed draft)
afternoon         1                6     1   COVERED (presented as correct)
wear              0                0     5   TRUE GAP (never appears correctly anywhere)
loud              0                0     4   TRUE GAP (never appears correctly anywhere)
careful           0                0     3   TRUE GAP (never appears correctly anywhere)
among             0                0     2   TRUE GAP (never appears correctly anywhere)
knock             0                0     1   TRUE GAP (never appears correctly anywhere)
blackboard        1                1     0   COVERED (presented as correct)
end               0                0     1   TRUE GAP (never appears correctly anywhere)
grandpa           0                0     3   TRUE GAP (never appears correctly anywhere)
bore              0                0     1   TRUE GAP (never appears correctly anywhere)
```

A 口径的 3 处明细：

```
-- uniform
     L4 contrast.correct: I want a uniform.
-- afternoon
     L24 contrast.correct: I went to the park yesterday afternoon.
-- blackboard
     L107 contrast.bothRight: The teacher had me clean the blackboard.
```

B 口径新增（全属 hunt 草稿的「未被标错」token）：

```
-- dog
     hunt#46 cleanToken: dog
     hunt#118 cleanToken: dog.
     hunt#123 cleanToken: dog.
-- afternoon
     hunt#17 cleanToken: afternoon.
     hunt#32 cleanToken: afternoon
     hunt#43 cleanToken: afternoon.
     hunt#62 cleanToken: afternoon!
     hunt#79 cleanToken: afternoon!
```

**结论**：把 `huntCases` 的「未标错 token」算作正向覆盖，会让 `dog` 与 `afternoon` 从「缺口」变成「覆盖」。本报告**采信这一宽口径对 `dog`/`afternoon` 的判定**（因为 hunt 题面用户确实会读），**但对 `among`/`loud`/`careful` 的判定不受影响**（它们在这两个口径下都是 0）——**这三个词的缺口是稳健的，不依赖口径选择**。

### 核查 4 · `bothRight` 的渲染语义（决定 `blackboard` 的判定）

`blackboard` 唯一命中在 L107 `contrast[].wrong`，字段名叫 `wrong`，若只看字段名会判 NEG。实测该条 `bothRight: true`，而 `src/pages/GrammarLessonPage.tsx` 在 `bothRight` 分支里渲染的是：

```tsx
) : item.bothRight ? (
  <div className="lesson-contrast-reveal">
    <p className="lesson-contrast-correct">
      <CheckCircle2 size={17} /> {item.correct}
    <p className="lesson-contrast-correct">
      <CheckCircle2 size={17} /> {item.wrong}      // <-- 也是「正确」样式
    <p className="lesson-contrast-why">{item.whyZh}</p>
    <p className="lesson-contrast-judge">两句都对——这就是今天的反转。</p>
```

**结论**：`bothRight` 的 `wrong` 字段渲染时用的是 `lesson-contrast-correct` 类 + `CheckCircle2` 对勾 + 文案「两句都对」。**所以判定必须读 `bothRight` 标志，不能只读字段名。** `blackboard` 因此归 POS（涉及 `grandpa` 的 `contrast[3].bothRight` 同理）。

### 核查 5 · hunt 草稿的性质（决定「clean token」算不算覆盖）

`src/services/huntService.ts` 中 `correctedSentenceOf` 的注释（**逐字**）：

> 把案件题面的**错句**按 errors 修正成正确句（错词本例句用）。
> 2026-09-21 批四十导出：此前页面拿不到它，只能退化成 Tokens.join(" ")，导致错词本里 631/631 张卡的例句都是**含错的原文**——用户为 happy 建卡，看到的例句正是要改的那句错。

**结论**：`tokens` 整体被项目自己定义为「**错句**」。所以某 token「不在 `errors[].tokenIndex` 里」只表示**本案没揪它**，不表示它被确认为正确。这就是本报告设立 A/B 两口径的原因，并在正文中对 `dog`/`afternoon` 明示采用了宽口径、说明理由。

### 核查 6 · 全 `src/` 树扩展检索（防「只查了两个数据文件」）

> **这是本批最重要的一次核查**——它推翻了「12 词都只在课程库负面位置」这一前提的一半。

命令 A（`/tmp/fullsrc.mjs`，扫 295 个 `.ts/.tsx/.json/.mjs/.js`，逐文件计数）：

```
files scanned: 295

uniform: 14 hits / 2 files
     11  src/data/bundledDictionary.ts
      3  src/data/grammarLessons.ts
careful: 36 hits / 5 files
     22  src/data/bundledDictionary.ts
      9  src/data/grammarLessons.ts
      3  src/services/adventureService.ts      <- 冒险模式（用户可见！）
      1  src/data/seedWords.ts
      1  src/services/aiService.ts
loud: 57 hits / 4 files
     46  src/data/bundledDictionary.ts
      8  src/data/grammarLessons.ts
      2  src/data/huntCases.ts
      1  src/services/adventureService.ts
afternoon: 14 hits / 5 files
      7 huntCases.ts / 3 grammarLessons.ts / 2 bundledDictionary.ts
      1 src/data/libraryGateScripts.ts        <- 关卡脚本（用户可见！）
      1 src/services/adventureService.ts
wear: 21 hits / 4 files
     12 bundledDictionary.ts / 6 grammarLessons.ts / 2 huntCases.ts
      1 src/data/diaryQuestions.ts            <- 日记提示（用户可见！）
end: 151 hits / 14 files
    119 bundledDictionary.ts / 4 diaryService.ts / 4 grammarBoostAiService.ts
      4 grammarExplainAiService.ts / 4 statsService.ts
      3 lighthouseGateScripts.ts              <- 关卡脚本（用户可见！）
      3 AdventurePlayPage.tsx / 3 aiService.ts / 1 grammarLessons.ts ...
among: 31 hits / 3 files
     23 bundledDictionary.ts
      5 src/data/grammarLessons.test.ts       <- 测试（用户不可见）
      3 src/data/grammarLessons.ts
```

命令 B（`/tmp/uservisible.mjs`，按**文件性质**分类每个命中，剔除测试/注释/词典）：

```
=== per-word: non-course hits by source kind ===

among: total non-course=6  USER-VISIBLE-PROSE=0
    DICTIONARY(definition only, no example sentence): 1
    TEST(not user-visible): 3
    OTHER: 2
    -> 课程库外 0 处用户可见正确用例

loud: total non-course=12  USER-VISIBLE-PROSE=1
    ADVENTURE-STORY(user-visible prose): 1
      >> services/adventureService.ts:142  "Begin where the clocks are loud."

careful: total non-course=14  USER-VISIBLE-PROSE=3
      >> services/adventureService.ts:246  "I need a careful walker."      (故事正文)
      >> services/adventureService.ts:257  {word:"careful", ..., sentence:"The lamp needs a careful walker."}  (生词卡!)
      >> services/aiService.ts:430         "Mia walked into class with a careful plan"

afternoon: total non-course=13  USER-VISIBLE-PROSE=2
      >> data/libraryGateScripts.ts:396    "...a shelf you tidied this afternoon."
      >> services/adventureService.ts:90   "It is your first afternoon at North Hill School."

wear: total non-course=10  USER-VISIBLE-PROSE=1
      >> data/diaryQuestions.ts:109        hint: "I wear ______ today."      (填空提示，非完整句)

end: total non-course=27  USER-VISIBLE-PROSE=9
      >> data/libraryGateScripts.ts:258    "...at the end of the sentence."
      >> data/lighthouseGateScripts.ts:181,259  "...a journey's end."
      >> data/lighthouseGateScripts.ts:219      "...the streets end at a dark shore."   (动词原形!)
      >> services/adventureService.ts:332       "...a door at the far end of the street."
      >> services/aiService.ts:292,367,438      "By the end of the review..." / "At the end of the lesson" / "By the end, ..."

uniform / dog / knock / blackboard / grandpa / bore: USER-VISIBLE-PROSE = 0
```

**这些非课程源确实是用户可见的**（逐文件核对其文件头注释）：

- `libraryGateScripts.ts` 头注释：`图书馆世界（S4 句子变长）· 批 1：G1–G4……误读支线四拍模板……红线与既往世界一致：「」内引文豁免语法与禁用词检测。`
- `lighthouseGateScripts.ts` 头注释：`灯塔世界（S5 特殊与语用）· 终章 6 关……六关一路收束，呼应前五个世界。`
- `adventureService.ts` 的 `offlineStories`：冒险模式的**离线故事正文**（`englishText` + `chineseText` + `sentenceTranslations` + `vocabulary` 生词卡）。
- `diaryQuestions.ts`：日记页的**提问列表**（`zh` 中文问句 + `hint` 英文填空架子）。
- `aiService.ts` 的 `generateMistakeStory`：错词本**小故事生成器的英文模板**（用户会读到生成的段落）。

**逐条排除与计入的规则**：

| 源 | 处理 | 理由 |
|---|---|---|
| `bundledDictionary.ts` | **不计入**（但记为一个信号）| 12,000 条词典数据，形态如 `{"word":"among","phonetic":"/ә'mʌŋ/","partOfSpeech":"prep.","definition":"prep. Alt. of Amongst","translation":"prep. 在...之中"}`——**只有释义，没有例句**。用户搜词能看到中文释义，所以「完全没见过这个词」的说法要打折扣 |
| `*.test.ts` / `src/edge/**` | **不计入** | 测试与验证代码，用户不可见 |
| `seedWords.ts` / `statsService.ts` / `telemetry` / 源码注释 | **不计入** | 非用户可见文本（如 `seedWords.ts` 里 `careful` 出现在 `definition: "extremely important; involving careful judgment"`，是 `crucial` 的英文释义）|
| 关卡脚本 / 冒险故事 / 日记提示 / AI 模板 | **计入** | 玩家/用户会读到 |
| `speechService.test.ts` 的 `the quick brown fox...lazy dog` | **不计入** | 测试字符串；且那是著名 pangram，不是教学内容 |

**结论（本报告的核心修正）**：

1. **`among` 是 12 词里唯一一个「全应用任何用户可见位置都没有正确用法」的词。** → L196 是硬结论。
2. **`loud` / `careful` / `afternoon` / `wear` / `end` 在课程库之外有正确的用户可见用例。** → 对它们，「用户从未见过正确用法」**不成立**；准确说法是「**课程从不把它们当正确形式教**」。这是一个更弱的缺口。
3. 因此，若只做本报告建议的 L196/L197，**`end`（9 处）与 `afternoon`（2 处）不需要任何动作**，`loud`/`careful` 的动作是「把已在冒险模式里见过的用法收进课程」，而 **`among` 的动作是「从零补上」**——三者的成本与价值都不同，不应混为一谈。

**这是本报告对上游口径的第三个修正**：复核范围若只限于 `grammarLessons.ts` + `huntCases.ts`，会漏掉关卡脚本 / 冒险故事 / 日记提示 / AI 模板这四类**同样用户可见**的内容源。本报告已扩到全 `src/` 并逐类判定。

### 核查 7 · 形态家族展开（防「只查了基础形」）

命令（`/tmp/forms.mjs` 与 `/tmp/families2.mjs`）：对每个词展开其**全部常见形态**，逐形态查「首次正确呈现」：

```
family     | form-by-form first CORRECT appearance
learn      | learn=NONE  learns=NONE  learned=L118  learnt=NONE  learning=L190
talk       | talk=NONE  talks=NONE  talked=NONE  talking=NONE   <== ENTIRE FAMILY NEVER CORRECT
move       | move=NONE  moves=NONE  moved=NONE  moving=NONE   <== ENTIRE FAMILY NEVER CORRECT
shoe       | shoe=NONE  shoes=NONE   <== ENTIRE FAMILY NEVER CORRECT
candle     | candle=NONE  candles=NONE   <== ENTIRE FAMILY NEVER CORRECT
mile       | mile=NONE  miles=NONE   <== ENTIRE FAMILY NEVER CORRECT
laugh      | laugh=NONE  laughs=NONE  laughed=NONE  laughing=NONE   <== ENTIRE FAMILY NEVER CORRECT
thing      | thing=NONE  things=NONE   <== ENTIRE FAMILY NEVER CORRECT
during     | during=NONE   <== ENTIRE FAMILY NEVER CORRECT
among      | among=NONE  amongst=NONE   <== ENTIRE FAMILY NEVER CORRECT
wear       | wear=NONE  wears=L39  wearing=NONE  wore=NONE  worn=NONE
careful    | careful=NONE  carefully=L58
loud       | loud=NONE  loudly=L58  louder=NONE  loudest=NONE
knock      | knock=NONE  knocks=NONE  knocked=L99  knocking=NONE
bore       | bore=NONE  bores=NONE  bored=L113  boring=L113
end        | end=NONE  ends=NONE  ended=L109  ending=NONE
```

**结论**：`among` / `loud` / `careful` 与 `wear` / `knock` / `bore` / `end` 的差别，**在家族层面是清晰的**：前者是「**基础形从未正确，而 -ly 派生形已正确**」（`careful`/`loud`）或「**全族从未正确**」（`among`）；后者是「**基础形从未正确，但该词的其他变形已正确且是教学重点**」（`wears` L39、`knocked` L99、`bored`/`boring` L113、`ended` L109）。这正是本报告 §2 把 12 词切成「做 3 个 / 本轮不做 4 个 / 已覆盖+不该做 5 个」的依据。

### 核查 8 · 全库负面词普查（复现上游「99 词」并细化）

命令（`/tmp/repro.mjs`，按字段身份把全库拆成 negative-slot / positive-slot 两个词集）：

```
NEGATIVE-SLOT unique words: 600
POSITIVE-SLOT unique words: 844
NEGATIVE-ONLY words: 87
bundled dictionary entries: 12000

--- negative-only AND in bundled dictionary (28) ---
among, banana, bore, calling, candle, careful, during, end, excite, exciting, greatly,
happily, knock, laugh, learn, liking, living, loud, mile, move, nicely, passing, shoe,
taking, talk, thing, thinking, wear

--- negative-only AND NOT in bundled dictionary (59) ---
advices, arrives, beautifulest, beautifuller, bookes, breaked, buying, carefuly, carrying,
closes, cooks, eated, eating, ends, fastly, finishing, geting, gooder, goodest, goodly,
haves, having, helping, homeworks, hoter, informations, knocking, lived, losed, lots,
milks, needs, oldest, opens, passes, peoples, puts, resting, rests, returns, sandwichs,
sees, shoulds, sleeps, smarter, snowing, staying, stays, stopping, studys, tiredly,
traveling, travels, wanted, wanting, warmly, waters, wearing, wills
```

**复现结果**：本报告得到 **87 个** negative-only 词（上游口径为 93 个，差异来自词形归一化规则与是否含 `is's`/`lot's` 这类带撇号串）。其中 **28 个是词典里存在的真词**（上游口径为 30+ 个），**59 个是造出来的错形**（`eated`/`fastly`/`gooder`/`informations` 等——**这些是故意的教学素材，如上游所述，正常，不需要处理**）。

**对 12 词清单的核对**：上游列出的 12 个实词（`uniform`/`dog`/`afternoon`/`wear`/`loud`/`careful`/`among`/`knock`/`blackboard`/`end`/`grandpa`/`bore`）**全部落在本报告这 28 个真词内**，清单本身无误；差异在于**「是否真的只在负面位置」这一定性判断**（`uniform`/`afternoon`/`blackboard` 各有 1 处正确呈现；`dog`/`afternoon` 另有 hunt 草稿的正向出现）。

### 核查 9 · 系统性发现：不规则过去式的整体缺口（超出本批 12 词范围）

命令（`/tmp/irr2.mjs`，扫 40 个常见不规则过去式）：

```
irregular past forms NEVER in a correct position (37):
   wore, worn, caught, taught, thought, brought, sang, swam, began, chose, chosen,
   drove, felt, fought, flew, forgot, grew, held, hit, hurt, kept, knew, lent, meant,
   paid, rode, sold, sent, sat, spoke, spent, stood, stole, told, understood, woke, threw

irregular past forms WITH correct use (2):
   sung@L52, wrote@L23

=== spot check ===
  told: 0 total field-hits -> NONE ANYWHERE
  thought: 0 total field-hits -> NONE ANYWHERE
  wore: 2 total field-hits -> hunt#28 errors[1].correction, hunt#28 errors[1].explanation
```

**结论**：**37 个不规则过去式从未以正确形态出现过**（`told` / `thought` **在全库任何字段都不存在**）。这是一个**远大于本批 12 词的系统性缺口**，且与 `wear` 的 `wore`、`end` 的 `ended`（`ended` 是规则形，已正确）性质不同。**本报告不把这一项做成课**（超出本批授权范围），但作为**明确的后续批建议**列出（见 §6 不确定项 2），因为它会影响「是否值得为 `wear` 单开一课」的判断——`wore` 应并入不规则过去式批，而非单独处理。

### 核查 10 · 难度断崖守门（对建议 targetSentence 的实测）

命令（`/tmp/gate.mjs`，复刻 `grammarLessons.test.ts` 的 `longestClause`）：

```js
const longestClause = (sentence) =>
  Math.max(...sentence.split(/[.!?]\s*/).filter(c=>c.trim()).map(c=>c.trim().split(/\s+/).length));
```

输出：

```
L195 longest-clause = 6
=> L196 max longest-clause = 11

candidate                                 words  longestClause  gate(<=11)
The cat is among the boxes.                  6             6      PASS
My brother is loud, but I am careful.        8             8      PASS
```

**结论**：两课均通过。`L195(6) → L196(6)` 跳升 **0**；`L196(6) → L197(8)` 跳升 **+2**，均 ≤ 5。

`told`：另核 `L188`（`I had to walk home yesterday.` 6 词）、`L189`（4 词）等近邻，确认 6→6→8 的序列在库里已有同类先例（如 `L191(5) → L192(9)` 跳 +4）。

### 核查 11 · 新句式用词可用性（防「用了没教过的词」）

命令（`/tmp/avail.mjs` 与 `/tmp/final_check.mjs`，按 L1–L195 的**正确位置**累计建词表，再逐个核对候选句的每个词）：

```
=== L196: "The cat is among the boxes." ===
   words: the cat is among the boxes
   new points declared: among
   words NOT previously taught (should be empty): (none)
   longest clause = 6  (L195=6, gate: jump<=5) -> PASS

=== L197: "My brother is loud, but I am careful." ===
   words: my brother is loud but i am careful
   new points declared: loud, careful
   words NOT previously taught (should be empty): (none)
   longest clause = 8  (L195=6, gate: jump<=5) -> PASS
```

支撑明细（各词的**首次正确出现**）：

```
cat        L3 examples   ("I have a small cat.")
boxes      L81 examples  ("The ball is between the two boxes.")
boxes      L81 target 区 ("between the two boxes")
brother    L2 target     ("He is my brother.")
but        L19 examples  ("The snow is cold but fun.")
sits       L79 examples  ("He sits next to me.")
music      L5 target     ("I like music.")
too        L11 dialogue
among      *** NONE ***
loud       *** NONE ***
careful    *** NONE ***
wore       *** NONE ***
```

**结论**：两个 targetSentence 的**除 `among`/`loud`/`careful` 外的每个词都已在此前 195 课里以正确形态出现过**，无越级。

### 核查 12 · 零术语红线（对建议的中文话术逐条核）

命令（`/tmp/final_check.mjs`，从 `src/data/grammarZeroTerms.ts` 解析 29 词红线表后逐条匹配）：

```
zero-terms in table: 29
proposed Chinese copy term hits:
   猫在一堆箱子中间。                   clean
   弟弟声音大，我很仔细。                 clean
   怎么说「在一群东西中间」                clean
   昨天版                         clean
   穿过原样                        clean
   领一整句                        clean
   两张脸                         clean
   站最前面                        clean
   站句尾                         clean
   垫板                          clean
   名字版                         clean
   小标签                         clean
   换词                          clean
   穿 -ing                      clean
   紧跟在…后面                      clean
```

**结论**：建议话术全部干净。**特别核过两个高风险点**：

- **「一堆」/「一群」** 不在红线表内（红线表含「可数」但不含「一堆」/「一群」）——可用于替代「复数」概念。
- **「形容样子的词」/「样子词」** 不在红线表内（红线表含「形容词」「副词」，不含这两个自建词）——且**二者在库里已在 L58/L59 用过**（实测 `形容样子的词` 3 处、`样子词` 30 处），沿用是安全的、不是新造词。

### 核查 13 · 场景合法性

```
14 个合法场景 id：campus / city / train / lighthouse / desert / space / ocean /
                  island / mansion / forest / snow / magic / mystery / sparkle

实测全库场景分布（195 课）：
{ "mansion": 63, "campus": 57, "city": 39, "sparkle": 9, "island": 6, "train": 5,
  "forest": 3, "mystery": 4, "magic": 2, "snow": 2, "ocean": 2, "lighthouse": 2,
  "desert": 1 }   ← space: 0
```

**结论**：建议的 `mansion`（L196）与 `campus`（L197）**都在合法表内**，且分别是库里第 1、第 2 高频场景（63 / 57 课）。

**关于 `space`（本批背景特别指出的「从未用过」场景）**：本报告**不建议**把这两课放进 `space`。理由：`among` 的教学需要一个「一堆可数东西」的具象场面（一堆箱子／一丛树），`space` 里没有这种日常对子；`loud`/`careful` 更需要「两个人对比」的场面（弟弟 vs 我），`space` 也不合适。**`space` 的首次启用应留给一个真正需要太空场面的教学点**（如 `far away` / `in the sky` 这类），硬塞会同时增加新场景与新语法两个负担。**这也意味着本批两课不解决 `space` 的零使用问题**——如实说明。

### 核查 14 · 季分组硬护栏（防止课「静默消失」）

`src/data/grammarSeasons.ts` 的 `findSeasonByLessonNumber` 用 `min/max` 区间过滤，注释明写：

> ⚠️ 硬护栏（维护须知）：min/max 区间过滤是「必需机制」而非展示装饰——课程号不落在任何区间内会被路径页静默过滤（整课不显示、无报错）。
> 新增课程批次时必须同步追加 season-N 分组，并有 grammarSeasons.test.ts 守门。

**实测当前末季**：`season-28` 为 `{ min: 182, max: 195 }`，**`max` 恰为 195**。所以 L196/L197 上线**必须**新增 `season-29`（`min:196, max:197`）或扩 `season-28` 的 `max`，否则两课**不会出现在路径页且不报错**。已写入 §3 的随批清单。

### 核查 15 · 课程/案件计数基线

```
$ node -e "…" 
lesson ids: 195
numbers:    195          （grammarLessons.ts）
huntCases:  204          （huntCases.ts）
```

与本批背景一致（195 课 / 204 案 / 28 季）。**注意总量不一致**：`grammarSeasons.ts` 只有 28 个季，而 `season-28` 已到 195——说明季编号与批次编号不同步（末段 17 个小季曾被合并为 6 个大季，注释已说明）。**新增季时应按 `season-29` 编号，而不是按批次号。**

### 核查 16 · 报告内全部数值断言的逐条复核

为避免「报告自己写错数」，把报告里出现的每一个可核数值再跑一遍（`/tmp/verify_claims.mjs`）：

```
CLAIM: L195 longest-clause = 6
  actual: 6 => OK
CLAIM: L196 "The cat is among the boxes." = 6 words / lc 6
  actual: words= 6  lc= 6   => OK
CLAIM: L197 "My brother is loud, but I am careful." = 8 words / lc 8
  actual: words= 8  lc= 8   => OK
CLAIM: L191/L192/L193/L194/L195 exist（对齐「单课 1-2 个点」的项目先例）
  actual: L191=进到里面 · 用 into | L192=穿过 · through/across | L193=太…了 so…that
          L194=这么…的一个 such a | L195=它的 · 不带小撇的 its   => OK
CLAIM: lesson count 195, huntCases 204
  actual: 195 204   => OK
CLAIM: season-28 min=182 max=195
  actual: 182 195   => OK
CLAIM: seasons count = 28
  actual: 28        => OK
CLAIM: L79-L86 是 8 课的位置词大章
  actual: L79=位置词·next to | L80=位置词·in front of/behind | L81=位置词·between A and B
          L82=放·put | L83=不点名的东西·something/anything | L84=不点名的东西·nothing/someone
          L85=问东西的主人·whose | L86=收口·大团圆（零新知）   => OK
CLAIM: scene counts mansion=63 campus=57 city=39 space=0
  actual: {"campus":57,"city":39,"sparkle":9,"island":6,"train":5,"forest":3,
           "magic":2,"mansion":63,"snow":2,"mystery":4,"ocean":2,"lighthouse":2,"desert":1}
  => mansion=63 OK / campus=57 OK / city=39 OK / space 缺席 OK
```

**全部通过。** 本报告正文引用的课号、词数、最长分句数、场景计数、季区间、课程/案件总数**均已复核一致**。

---

## ⑥ 不确定项

### 1. `loud`/`careful` 是否值得单开一课（最重要）

**不确定的是什么**：**冒险模式已经把这两个词以正确形态展示给用户了**，而且不是一闪而过——

- `careful` 有一张**生词卡**：`adventureService.ts:257` 的 `{ word: "careful", translation: "小心的", partOfSpeech: "adjective", sentence: "The lamp needs a careful walker." }`。实测渲染路径 `AdventurePlayPage.tsx:1478-1488`：

  ```tsx
  {currentVocabulary.map((item) => {
    ...
    return (
      <label key={item.word} className={`adventure-vocab-card${item.cardId ? " saved" : ""}`}>
        <div className="adventure-vocab-card-top"><input type="checkbox" ... /></div>
        <small>{item.partOfSpeech} · {item.translation}</small>
        <p>{item.sentence}</p>
      </label>
    );
  })}
  ```

  即用户会看到 `adjective · 小心的` + `The lamp needs a careful walker.`，**并可勾选存进卡片**。
- 且它出现在**第一章**（`offlineStories.fantasy[0]`，`createAdventure` 用 `offlineStories[input.template][0]` 作为 root 节点，即选了这个模板立刻看到），**不是藏在深处**。
- `loud` 同理在**城市章第一章**：`Begin where the clocks are loud.`（`offlineStories.city[0]`）。

**所以问题变成**：用户已经在冒险模式里以正确形态（且带词卡）见过这两个词，**再在语法课里教一次，边际价值有多大？**

**两面的证据**：

- 支持做：`quick` 在 L58 的两面都亮了（`She is quick.` 是 `bothRight` 卡；`She runs quickly.` 是 target），`careful`/`loud` 只亮了一面——**这条对照链在课程内是不对称的**。而且冒险模式的语境是「读故事」，没有一个字在讲「`careful` 和 `carefully` 是同一个词的两张脸」——用户看到的是**词**，不是**对照**。
- 反对做：用户已见过正确形态 + 词卡；`描写的词` 这个概念库里从 L3 起就在用（L3/L17/L19/L28/L36/L58/L89/L94），用户大概率已会「站 is 后面的词」。为一处「位置差异」开课，不如**在 L58 加一张对照卡**（一行数据）经济。

**本报告的取舍**：仍**建议**做 L197，理由已从「用户没见过正确用法」改为「**课程内的对照链断了一环，且冒险模式的词卡没有讲这个对照**」。**若产品认为不必，本批缩为 L196 一课 1 个点，其余结论不变。**

**我不确定的是**：冒险模式那条路径的**实际到达率**。我核到了「选 fantasy 模板即见第一章、含 `careful` 生词卡」，但**没有核验用户实际选各模板的比例**（也无法核验），所以无法量化「多少用户已经见过 `careful` 的正确用法」。这个数只有产品侧有。

### 2. 不规则过去式的系统性缺口（37 个）是否该立批

**实测**：37 个常见不规则过去式（`told`/`thought`/`caught`/`taught`/`brought`/`wore`/`wrote`…）**从未以正确形态出现**，其中 `told`/`thought` **在全库任何字段都不存在**。这是一个远大于本批 12 词的缺口。

**不确定的是**：本项目从 L10（`Yesterday I went to the park.`）起就在教「昨天版」，且高频道不规则过去式**覆盖非常好**——`went`（72 处正确）/`ate`（53）/`lost`（59）/`made`（34）/`put`（34）/`rang`（31）/`came`（31）/`broke`（30）/`bought`（30）。所以这 37 个低频词的缺失**可能是刻意的难度控制**（零基础不该一次背 40 个不规则形），也可能是**遗漏**。

**建议**：本报告不做判断（超出本批范围）。但**建议由竞析做一次独立的「不规则过去式覆盖审计」**，并**把 `wear` 的 `wore` 归到那一批处理，而不是单独为 `wear` 开课**——这是本报告把 `wear` 判为「本轮不做」的核心理由。

### 3. L58 的 `He reads loud.` 这张对照卡是否站得住

**实测**：OALD 在 `loud` 的副词条目下专设 `Which Word? loud / loudly / aloud`，明确说 `Loud is very common as an adverb in informal language. It is nearly always used in phrases such as loud enough, as loud as or with too, very, so, etc`——**即 `loud` 当副词是被承认的**，只是限于那几类结构。

L58 把 `He reads loud.` 判为错句（正确是 `He reads loudly.`）。`read loud` 不属于 OALD 列举的 `loud enough`/`as loud as`/`too, very, so` 那几类，**所以判错在当前标准下可接受**；但这也说明**这张卡的边界很窄**，且「读书声音大」的常见标准说法其实是 `read aloud` / `read out loud`（OALD 也把 `Out loud` 列为常见副词）——用 `loud` 在这句里作反例**不够干净**。

**建议**（需要产品决定，本批不改数据）：在后续批次把 L58 的这张卡换成无争议的对子（如 `He speaks loudly.`），并在 L197 的 `deepDive` 里把 `loud` 副词的边界说清楚。**若产品认为 L58 现状可接受，L197 只需教 `loud` 站 `is` 后面的用法，不必提副词情形**——本报告的 L197 设计在这两种选择下都成立。

### 4. `space` 场景仍未启用（且其合法性我未独立核验）

**实测**：14 个合法场景里 `space` 使用 **0** 次（195 课的场景分布：`mansion` 63 / `campus` 57 / `city` 39 / `sparkle` 9 / `island` 6 / `train` 5 / `mystery` 4 / `forest` 3 / `magic` 2 / `snow` 2 / `ocean` 2 / `lighthouse` 2 / `desert` 1 / **`space` 0**）。本批背景特别指出这一事实。

**本报告的处理**：**不为启用 `space` 而把 L196/L197 放进太空**（理由见核查 13）。**代价是：本批不解决 `space` 零使用问题。** 若产品希望本批顺手启用 `space`，则需重新设计两课的场面——**这会让 `among` 的教学失去「一堆可数东西」的具象依托**，我不建议；但这是一个可以被产品否掉的判断，故列为不确定项。

**未独立核验的部分**：`space` 是否**真的**是合法场景 id？本批任务把这 14 个 id 作为给定前提，我**按前提使用**。我只实测到「195 课的场景分布里没有 `space`」，**没有去核验 `space` 是否在类型定义（`AdventureSceneId`）的合法取值内**。本报告所有场景结论（`mansion`/`campus` 合法且高频、`space` 未启用）**都建立在这一前提上**。若前提有误，请以类型定义为准。

### 5. 「本地 grep 是 ugrep」这条环境事实的本批实证

本批任务明确要求「不要用 grep，本地 grep 是 ugrep 会假返回 0；必须用 `(?<![A-Za-z-])word(?![A-Za-z-])` 的 node 正则」。**我全程未用 `grep` 做结论性检索**，所有词检索都走 `node` + `new RegExp(...)`（见核查 1–7 的命令）。

**但需要如实说明一次失误**：在核查 6 的一次中间探查里，我写了一句 `grep -c` 探针，并**据此在报告草稿里写下了一个错误结论**——「实测 `adventureService.ts` 该文件 `loud` 无独立命中，故 `loud` 仍是严格 0」。**该错误已被 `node` 复核推翻**：`adventureService.ts:142` **确实**含 `loud` 的正确用例（`Begin where the clocks are loud.`），且它在**冒险模式城市章第一章**（用户选 city 模板立刻看到）。报告正文（§2-10）与核查 6 已按 `node` 结果修正。

**这条记录保留在此，因为它正是本批任务那句警告的实证**：ugrep 的假返回差点让 `loud` 的判定出错（从「全应用 0 处」误判为「确认 0 处」，从而把 L197 的理由写得过强）。**教训：任何「某词全库 0 命中」的结论，都必须用 node 复核后再写。**

### 6. 上游「93 词」与我的「87 词」的差额

**实测**：本报告得 87 个 negative-only 词，上游为 93 个。差额 **6 个**，最可能来自**词形归一化规则不同**（带撇号串如 `is's`/`lot's` 该不该算一个词、`n't` 该不该拆、大小写如何处理）。**本报告没有逐词比对那 6 个的差集**，所以**不能断言上游的 93 是错的**——只能说在当前归一化口径下我复现出 87。

**影响评估**：这个差额**不影响本批 12 词的结论**（12 词全部在我的 28 个「真词」集合内，清单一致；差异只在定性判断）。但**若后续要用「negative-only 词数」做守护断言，必须先固定归一化口径**，否则数字会随实现漂移。

---

## 附：本报告使用的脚本

全部在 `/tmp`（临时，未写入项目）：

| 脚本 | 用途 |
|---|---|
| `/tmp/checkwords.mjs` | 12 词词边界正则全库计数（核查 1）|
| `/tmp/lessonmap.mjs` | 行号 → 课号映射 |
| `/tmp/fieldcls.mjs` | 命中行的字段身份判定（核查 2）|
| `/tmp/exhaustive.mjs` | 解析后对象全字段遍历（核查 2）|
| `/tmp/twoway.mjs` | A/B 两口径对照 + 负面位置明细（核查 3）|
| `/tmp/fullsrc.mjs` | 全 `src/` 树（295 文件）逐文件计数（核查 6）|
| `/tmp/uservisible.mjs` | 全 `src/` 树按**文件性质**分类命中，区分用户可见与否（核查 6）|
| `/tmp/noncourse.mjs` | 非课程源命中的逐条明细（核查 6）|
| `/tmp/forms.mjs` / `/tmp/families2.mjs` | 形态家族逐形展开 + 家族级正确覆盖判定（核查 7）|
| `/tmp/repro.mjs` | 全库负面词普查，复现上游口径（核查 8）|
| `/tmp/irr2.mjs` | 不规则过去式系统缺口（核查 9）|
| `/tmp/gate.mjs` | 难度断崖守门实测（核查 10）|
| `/tmp/avail.mjs` / `/tmp/final_check.mjs` | 词表可用性 + 零术语核查（核查 11、12）|
| `/tmp/verify_claims.mjs` | 报告内全部数值断言复核（核查 16）|

**本报告未修改任何项目文件。**（`git status` 里 `src/**` 的改动来自并发进行的其他批次工作，不是本报告所为；本报告只新增了 `deliverables/product-strategy/user-research-negative-only-words-2026-09-22.md` 一个文件。）
