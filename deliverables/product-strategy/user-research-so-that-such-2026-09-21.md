# 用户研究 · 语法线「小美的一天」· `so ... that` 与 `such a`（结果与程度）

**日期**：2026-09-21 ｜ **类型**：用户研究（语法线第三十九批候选）｜ **研究员**：瑞思
**上游**：`roadmap-grammar-thirty-eighth-batch-2026-09-21.md:81`（逐字：`| 6 | \`so ... that\` / \`such a\` | 待办 | 若做须先验证能否凑 3 条带标记错 |`）
**本批候选**：`so ... that`（结果：「太…以至于」）与 `such a`（「这么…的一个」）

---

## 📌 TL;DR（本报告的五条裁定）

| # | 问题 | **裁定** |
|---|---|---|
| **1** | 能不能做？ | **能做，但只能做「一课半」。** `so ... that` 稳（**3 条带标记错轻松凑齐，且质量高**）；`such a` **勉强够 3 条**（能凑，但 2 条与 L89 `What a nice day!` 的「a 站哪儿」高度同源，边际价值低）。**建议：只做 `so ... that` 一课（L193），`such a` 不做。** |
| **2** | 拆几课？ | **1 课（不做 `such a`）**。理由见 §2：`such a` 与本批唯一的对照词 `so` 合课会变成「一课两个新结构」；而它单独成课则与 **L89 已教的 `What a + 东西`** 撞车（同一个「a 站哪儿」的坑）。 |
| **3** | 每课 targetSentence | **L193 `The wind was so strong that the window broke.`（9 词）**——见 §3。 |
| **4** | `so that`（L186）会不会干扰？ | **会，而且是本批最大的风险——但可控，且恰好是这一课最值钱的部分。** 见 §4：`so`(L20 所以) / `so that`(L186 是为了) / `so ... that`(新，太…以至于) 是**三张脸**，库内已有成熟模具（`两张脸` GL=96／`四张脸排一行`）。**L186 的 summary 已经提前把这三者排过一行**（`:37240` 逐字 `so（所以）／so that（是为了）—— 一个说结果，一个说目的`），本课是**补第三张脸**，属收口型补员。 |
| **5** | 与 `too ... to`（L66）的关系 | **⚠ 必须正面处理：`too ... to` 是同一件「太…以至于」的另一套说法，且 L66 已有一条带标记错句 `The box is too heavy that I can't carry it.`（`:12417`）。** 这意味着 `so ... that` 在中文侧**不是缺口而是「第二套说法」**——但本项目判定它仍值得做，因为 `too ... to` **装不下「两件事两个人」**（`too heavy to carry` 只能是同一件事），而 `so ... that` 能装整句话。**不做 `so that` 式的「换词」判定，做「同一个中文两把椅子」判定**（见 §3.4）。 |

**总进度**：**192 课／201 案／28 季**；`grammarLessons.test.ts` 未在本轮改动数据，**未重跑**（本批为纯研究，零代码改动——见 §6.10 诚实声明）。

---

## §0 本轮实读口径声明

### 0.1 冻结快照（本轮实测）

| 文件 | 行数 | 内容 |
|---|---|---|
| `src/data/grammarLessons.ts` | **38,497** | **192 课** |
| `src/data/huntCases.ts` | **10,470** | **201 案** |
| `src/data/grammarSeasons.ts` | **74** | **28 季** |
| `src/components/AdventureScene.tsx` | 476 | 14 个合法场景 ID |

> **与任务书口径一致**（192 课／201 案／28 季）✅。**下一可用课号 = L193**（实测 192 课连续、无缺号、无重号）；**下一可用案号 = 202**（实测 201 案，max=201）；`lesson-193` / `lesson-194` / 案 202 / 203 在库内**均未占用**（实测见 §6.4）。
> **末课 L192 已从任务书写的 9 词口径核实**：`We walked through the forest and across the bridge.` → 最长分句 **9 词**。

### 0.2 ⚠️⚠️ 任务书两处断言与实测不符（必须纠正）

本批的自我核查要求「全库检索字符串再定位」，本轮照做后**发现任务书给的背景数字有两处硬错误**：

| 任务书原文 | **本轮实测** | 判定 |
|---|---|---|
| 「`too ... to` → **0**」 | **GL=51 处，遍布 L66／L71／L145／L166 四课**；`too + 词 + to` 结构在 **L66 是立岗结构**（`:12390` `grammarLabel: "太…了装不下 · too…to"`，`:12398` `targetSentence: "It is too heavy to carry."`） | ❌ **任务书错**。且 `L66` 已有一条**带标记错句**：`:12417` `wrong: "The box is too heavy that I can't carry it."` / `wrongMark: "that"` |
| 「`so that`（目的用法）→ 5 处，已在 L186 教过」 | **GL=61 处**（行数 51 行），按课 `{"102":1,"186":58,"187":1,"188":1}` | ⚠️ **数字偏小约 12 倍**，但**结论方向对**（L186 确为立岗课）。另 **L102 那 1 处不是目的用法**：`:19420` `{ who: "npc", en: "So that was last night!", zh: "小美把电话记录本合上。" }` —— 这是 `So`（所以/那么）＋`that`（那个）的**假命中**，非 `so that` 结构 |
| 「`such` → 全库 0」 | **GL=0、HC=0**（真词口径与宽口径**都是 0**，无差异） | ✅ **任务书对** |
| 「`enough to` → 1 处（L71）」 | **GL=24 处，全部在 L71**（按课 `{"71":24}`） | ⚠️ **数字偏小**，但**归属课对** |

**⇒ 本批最重要的方法学教训**：任务书给的「全库 N 处」不可直接引用，**必须自己重数**。`too ... to` 这一条尤其关键——它把本批从「全新缺口」降级为「已教结构的第二套说法」，**直接改变了可做性判定的性质**。

### 0.3 工具与口径

| 口径 | 定义 | 本批用途 |
|---|---|---|
| **真词口径**（唯一词频口径） | `(?<![A-Za-z-])词(?![A-Za-z-])`，`gi`——**连字符也算词内** | 词频、结构共现 |
| **宽口径**（仅作对照） | `(?<![A-Za-z])词(?![A-Za-z])` | 暴露连字符假命中 |
| **课程块口径** | 按 `^\s{4}id: "lesson-…",` 切块，块起始行号＝归属依据 | 逐课归因 |
| **词表池口径**（复刻 `grammarLessons.test.ts` D 层） | `targetSentence`＋`examples`＋`blocks`＋`dialogue`＋`contrast`＋`variants`＋`sceneSwings`＋`guided`＋`recall`＋`practice.tokens`，**累计** | 「新词」判定 |

**脚本**（本轮落在 `/tmp/`，可复跑）：`/tmp/sosuch.js`（词频＋课程块索引）、`/tmp/dcheck.js`（D 层新词体检）、`/tmp/verify.js`（词数＋难度＋撞车）、`/tmp/collide.js`（对**全库全部英文句**做 Jaccard 撞车检测）、`/tmp/selfcheck.js`（本报告 §5 的自核命令）。

> ⚠️ **本轮未用 `grep`**（任务书要求）：本地 `grep` 是 ugrep，上游已实测它对 `swim`／`room`／`want` 等词**假返回 0**，且失效「随词而变」——不是一个可挑着用的工具。**全部词频走 node 词边界正则。**

### 0.4 连字符假命中实测（本批当场复现）

```bash
node -e 'const S=require("/tmp/sosuch.js");console.log("so loose="+S.cnt(S.loose("so"),S.GL)+" strict="+S.cnt(S.strict("so"),S.GL));'
# → so loose=247 strict=241   （6 处假命中）
```

6 处假命中**全部是 `id:` / `huntCaseIds:` 字段里的连字符标识符**：

```
:2372  huntCaseIds: ["hunt-because-so", "hunt-word-order"]
:3689  id: "lesson-20-because-so",
:34480 id: "lesson-175-so-do-i",
:34720 huntCaseIds: ["hunt-so-do-i"],
:37148 id: "lesson-186-so-that",
:37338 huntCaseIds: ["hunt-so-that-early"],
```

**⇒ 本批所有断言一律用真词口径。** `such`／`that`／`enough`／`too` 四词的宽／严口径差异分别为 `0／3／2／5`（见 §6.1），**均已在数字里扣除**。

### 0.5 逐字引用纪律

引文一律给「文件 : 行号（课号）」三元组。课号↔行号对应由课程块口径保证（例：`:12417` ∈ L66，该课块起于 `:12387`）。

### 0.6 零术语口径

**红线词表 29 词**（`src/data/grammarZeroTerms.ts` 逐字）：主语／谓语／宾语／表语／定语／状语／单数／复数／三单／原形／时态／一般过去时／一般现在时／现在进行时／过去进行时／现在完成时／情态动词／比较级／最高级／从句／语序／可数／疑问句／否定句／被动语态／第三人称／形容词／副词／**介词**。

> ⚠️ **本批的头号术语风险**：`so ... that` 与 `such a` 的语法书解释**必然用到「形容词／副词／名词／从句／结果状语从句」**——**全部是红线词**。
> **实测项目自建替代词汇（可直接复用）**：
> - 「那个『怎么样』的词」**GL=61**（逐字先例 `:23936` oneLineRule `说「看着怎么样」：look 自己站中间，后面直接跟那个「怎么样」的词——It looks nice。`）
> - `样子词` **GL=30**（L58／L59 链）
> - `老规矩` **GL=152**（用于「a 站那个词后面」这类回顾）
> **本轮为这两个结构提议的家族名**：
> - `so ... that` → **`太…了，所以…`**（经红线自查：**零术语 ✅**，且**库里已有同一个中文锚**：`:12403` L66 逐字 `说「太…了（所以）不能…」用 too + 词 + to + 动作`）
> - `such a` → **`这么…的一个`**（零术语 ✅）
> **本报告正文（§0–§5）是研究方法记录**，在引用红线词表本身与既有文档逐字时不可避免地出现术语；**面向学习者的文案建议只在 §3 给出**。

---

## §1 可做性判定：`so ... that` 稳，`such a` 勉强

### 1.1 `so ... that`：3 条带标记错句 —— **轻松凑齐，且质量高** ✅

对照卡的标准是「3 带标记错句 ＋ 3 双正解」（实测近 10 课**多为 3+3**，见 §6.8）。`so ... that` 的错句来自**三条互相独立的错误机制**，不是同一个坑的变体（另有 E4 一条备选，但建议不取，理由见下表）：

| # | 带标记错句 | 标记 | 正解 | 中文母语者为什么会这么说（成因） |
|---|---|---|---|---|
| **E1** | **`It was very hot that we couldn't work.`** | `very` | `It was so hot that we couldn't work.` | **中文「太…了」在程度轴上兼了「很」的职**。中文说「天很热，我们干不了活」用「很」就够，而英语的 `very hot` **只能到此为止**（说「很热」，句子结束），要接「所以干不了」必须换 `so`。学习者按中文直译，把「很」写成 `very`——**这是国际公认的典型错误，剑桥 `so` 页逐字点名**：`We do not use very in this structure`（§5.3 引文 1），并给出 `Not: They drove very fast that …` |
| **E2** | **`I was so late that missed the bus.`** | `that`（后缺「谁」） | `I was so late that I missed the bus.` | **中文后半截可以省略主语**：「我太迟了以至于没赶上车」——中文的「没赶上车」**天然承前省略**「我」。英语的 `that` 后面必须**重新把「谁」说一遍**。这是**本项目已两次处理过的同型陷阱**：L186 `:37186` 逐字 `中文「是为了能歇会儿」可以不说「你」，英语这半截得把「谁」带上`，其案件 `hunt-so-that-early`（案 195）用 `tag: "fragment"` 处理同一机制（`src/data/huntCases.ts:10185`，案 195，见 §6.3） |
| **E3** | **`It was such hot that we stayed home.`** | `such` | `It was so hot that we stayed home.` | **中文「这么／那么」一个词管两头**：「这么热」（程度，配 `so`）与「这么好的天」（带东西，配 `such`）。中文侧**不区分**后面跟的是「怎么样」还是「什么东西」——学习者按中文的「这么」直接选了 `such`。**剑桥 `Such or so?` typical errors 节逐字点名**：`We use so , not such , before adjectives`（§5.3 引文 3） |
| E4（备用） | `The bag is so heavy that I can't carry.` | `that`（后缺「它」） | `The bag is so heavy that I can't carry it.` | 与 E2 同族但**机制相反**：中文「重得拿不动」的「拿」**宾语也可以省**。⚠️ **此条与 L66 `:12423` 的 `It is too heavy to carry it.`（多一个 `it`）方向相反**，两条同时出现会让用户困惑——**建议不取，留 E1/E2/E3 三条即可** |

**⇒ 可做性：✅ 成立。** 三条错句**分属三种独立机制**（程度词选错／后截缺主语／前后件选错），且 **E1／E3 有剑桥两处逐字背书**、E2 有库内 L186 与案 195 的同型先例。**这是高质量的一组，不是硬凑的。**

### 1.2 `such a`：3 条 —— **能凑，但边际价值低** ⚠️

| # | 带标记错句 | 标记 | 正解 | 成因 |
|---|---|---|---|---|
| **S1** | `She is such kind.` | `such` | `She is so kind.` | 中文「她这么善良」——「这么」后**没有东西**，学习者照搬中文语序放 `such`。**剑桥逐字点名**：`We use so , not such , before adjectives` / `Not: You're such kind .` |
| **S2** | `It is a so nice day.` | `a so` | `It is such a nice day.` | **「一个」的位置**：中文「这么好的一个天」里，**「一个」在「这么」后面**；英语 `such a` 的 `a` 在 `such` **后面**，而 `so` **根本不带 `a`**。学习者按中文把 `a` 放前面。**剑桥逐字点名**：`We use such , not so , before a noun phrase with the indefinite article a/an` / `Not: This is a so wonderful kitchen!` |
| **S3** | `She is so kind teacher.` | `so kind` | `She is such a kind teacher.` | 与 S2 同源（该用 `such a` 却用 `so`），但**错点更隐蔽**：S2 留下一个显眼的 `a so`，S3 是**把一个东西前面直接挂了 `so kind`**，用户读起来"顺"（因为 `so kind` 本身合法），**自查不出来** |

**⇒ 可做性：⚠️ 勉强成立（3 条齐），但有两条否决理由：**

1. **S2／S3 与 L89 撞车**：L89 的立岗课就是 **`What a nice day!`**（`:16887` `targetSentence`），其带标记错句已经教过 **`wrong: "What nice day!"` / `wrongMark` 漏 a**（`:16906` 逐字 `「一个天」要带 a——而且 a 站在描写的词后面：What a nice day!（漏了 a 句子就缺口）`）。**S2／S3 是同一个「a 站哪儿／要不要 a」的坑，换了个句式**——属本项目判定过的「**换词**」——批三十七逐字判据：`「缺员若只让已知句型换一个动词，则它不是一课，它是一个词表项。」`
2. **`such a` 单独成课装不满**：去掉 S2／S3 后只剩 S1 一条真错句 → **凑不出 3 条独立机制的带标记错**。
3. **合课会变成「一课两个新结构」**：本项目历史上一课最多同时教 2 个**同族近义**的新结构（L20 `because / so`、L166 `too many / too much`、L18 `in / on / at`——**实测 `grammarLabel` 含 `/` 的课共 34 例**），而 `so`（程度）与 `such a`（程度＋东西）**不同族**（一个是「怎么样」，一个是「这么…的一个东西」），合课＝**一课两件事**。

**⇒ 裁定：`such a` 本批不做。** 它是 **L89（`What a + 东西`）与 L66（程度修饰）两条线的交汇处**，适合作为**未来某一课的对照项**（例如做「一个」系列收口时顺手带上），**不宜单独开课**。

### 1.3 最终裁定

> **裁定 A（做不做）：做，但只做 `so ... that` 一课。**
> **理由**：`so ... that` 三条错句分属三种独立机制、两条有剑桥逐字背书，**达到本项目对照卡的质量门槛**；`such a` 三条里两条是 L89 的换形状复现，**未过「一课一增量」检验**。
> **⇒ 本批产出 L193 一课**（不是任务书设想的 2 课）。

---

## §2 拆课方案：**1 课**

| 方案 | 判定 | 理由 |
|---|---|---|
| **1 课（只做 `so ... that`）** | ✅ **采纳** | 一课一个新结构，三条错句机制独立，难度可控（详见 §3） |
| 2 课（`so ... that` ＋ `such a` 各一课） | ❌ | `such a` 凑不出 3 条独立机制错句（§1.2），会退化成 L89 的复现课 |
| 1 课（两者合并） | ❌ | 一课两件事；且 `so`／`such a` 的判据不同（「怎么样」vs「这么…的一个东西」），合并后两条判据互相稀释 |
| 0 课（不做） | ⚠️ 可接受但不推荐 | `too ... to`（L66）已能表达大半「太…以至于」；但 `too ... to` **装不下「两个人／两件事」**（见 §3.4），这是 `so ... that` 唯一的不可替代位 |

---

## §3 L193 的目标句设计

### 3.0 总览

| 项 | 值 |
|---|---|
| 课注 id | `lesson-193-so-that-result`（实测未占用 ✅） |
| number | **193** |
| 轴 | 程度 → **结果**（「太…了，所以…」） |
| 新词 | **0 个**（结构课，与 L185／L186／L187／L188 同型——实测这四课目标句新词均为 **0**） |
| **targetSentence** | **`The wind was so strong that the window broke.`** |
| 词数 | 单句 **9 词**（最长分句 9） |
| 中文意图 | **`风太大了，所以窗户破了。`** |
| scene | `mansion`（⚠️ 见 §3.3 场景权衡） |
| 季 | 并入 `season-28`（`max: 192` → `193`） |

### 3.1 逐词核对（D 层口径，`/tmp/dcheck.js` 实跑）

**`The wind was so strong that the window broke.`** → 逐词首见课：

| # | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| 词 | The | wind | was | so | strong | that | the | window | broke |
| 首见 | L1 | **L32** | L1 | **L20** | L2 | L2 | L1 | **L32** | **L23** |

**新词 = 0** ✅（全部已教；`so` 首进词表池 @L20，`that` @L2）

**为什么是这句**：
- **它把「程度 → 结果」的因果关系做成了物理可见的事**：风大（程度）→ 窗户破（结果）。用户不需要读解释，**读句子就知道后半截是前半截造成的**——这是本课最重要的一张王牌。
- **`wind`／`window`／`broke` 三个词全在 L32／L32／L23 已教**，且 **L32 的立岗句就是这个场景的种子**（实测 `:5972` ∈ L32，L32 target 为 `Close the door.`，其例句含 `The wind is too strong.`）。**L66 已把这条种子「转正」过一次**（`:12479` 逐字 `The wind is too strong. → too strong to go out —— 种子转正`；`种子转正` 全库 GL=7）；本课是**同一条种子的第二个出口**——**从「太…了不能做」升级到「太…了所以它发生了」**。
- **9 词在门内**：L192 最长分句 **9 词** → 新句 **9 词**，跳变 **0** ✅（守门上限 +5）。
- **中文侧不重复**：中文译「风太大了，所以窗户破了」——**故意用「所以」而不用「以至于」**。理由见 §3.2。

### 3.2 ⚠️ 一条重要的中文侧实测发现：中文母语者嘴里没有「以至于」

**实测剑桥英汉词典的官方对译**（`/tmp/cam_zh_so.html` 逐字）：`so` 义项 `VERY` 的例句

> `I'm so tired (that) I could sleep in this chair !` → **`我太累了，连坐在这椅子上都能睡着！`**

**注意：剑桥给的中文不是「我太累了以至于…」，而是「我太累了，连…都能…」——用「连」引出结果。** 同样，`such` 的例句（`/tmp/cam_zh_such.html` 逐字）：

> `It was such a small room that the bed only just fit .` → **`那个房间实在太小了，刚够放进去一张床。`**

**⇒ 两条权威对译都把 `so/such ... that` 译成两个小句并列（「…了，所以／连…」），没有用「以至于」。**

**全库实测**：`以至于` **GL=2 处**（`:32326`、`:32435`，**都在 L166，且都是解释 `too`**，逐字 `第 66 课那个 too 说的是「太…以至于做不了」`）；`如此` **GL=0**。

**⇒ 教学含义（本批最有价值的一条）**：
1. **目标句的中文意图应写「风太大了，所以窗户破了」**——这是用户**真的会说的话**；写「风太大以至于窗户破了」会教出一个**用户从不使用的书面中文句式**，反而制造了新的负迁移。
2. **本课的对照卡必须切「`so` vs `so that`」**，而不是切「`so ... that` vs `too ... to`」——因为**中文侧「所以」一词同时对应 `so`（所以，L20）和 `so that`（是为了，L186）**，这是真正的混淆点（见 §4）。

### 3.3 场景设计（`mansion`）

> `sceneSetupZh`：`夜里刮起了大风，老宅的窗户没关严。小美缩在被子里听着风声，忽然「哗啦」一声——她赶紧开灯，看见窗玻璃碎了一地。`

**场景权衡（诚实登记）**：

| 候选 | 末次使用 | 间隔 | 判定 |
|---|---|---|---|
| `mansion` | L191 | **1 课** ⚠️ | **首选但仍需权衡**——`mansion` 是全库最常用的场景（62 课），**L191 刚用过**，间隔仅 1 课 |
| `island` | L71 | 121 课 | 间隔最久，但**「窗户被风吹破」在岛上不自然** |
| `magic` | L45 | 147 课 | 间隔最久，但**`magic` 是奇幻场景**，用「风把窗户吹破」这种写实因果会削弱它的题材 |
| `lighthouse` | L160 | 32 课 | **次选**：灯塔＋海雾＋大风**天然成立**，且「窗户」在灯塔里合理 |
| `desert` | L186 | 6 课 | ❌ 沙漠营地的窗户不自然 |

**⇒ 建议：改用 `lighthouse`（间隔 32 课，且「大风＋灯塔窗户」题材自洽）。** 若写课方坚持 `mansion`（`mansion` 的「老宅午夜」标签天然适配「夜里风把窗吹破」），**需接受 1 课间隔**——实测不违反任何断言，但**近 8 课场景为 `forest`(187)/`city`(188)/`campus`(189)/`ocean`(190)/`mansion`(191)/`city`(192)**，L193 若再用 `mansion` 会与 L191 只隔一课。

### 3.4 一课一增量自查（对齐批三十七 §3.4 判据）

| 本课会让用户新学会的操作 | 是否只是换词？ |
|---|---|
| ① 把「太…了」从 `too … to`（L66）**换一套椅子**：`so … that` | ⚠️ **这一半是「换椅子」** ——但见 ② |
| ② **新判据：`too … to` 只能装「同一件事」，`so … that` 能装「整句话＋另一个人／另一件事」** | ✅ **不是换词**——这是**容量**的区别，不是词汇的区别 |

**判据的具体内容**（这是本课的立课根基，必须写进 `oneLineRule`）：

| 同一个中文 | `too … to`（L66） | `so … that`（新） | 差别 |
|---|---|---|---|
| 太累了，走不动 | `I am too tired to walk.` ✅ | `I am so tired that I can't walk.` ✅ | 两者都可 |
| 风太大了，所以**窗户破了** | ❌ **装不下**（`too` 后面只能跟「不能做的那件事」，而「窗户破」不是人做的） | ✅ `The wind was so strong that the window broke.` | **这是 `so … that` 的唯一不可替代位** |
| 我太累了，所以**她先走了** | ❌ **装不下**（`too … to` 前后必须同一个人） | ✅ `I was so tired that she left first.` | 同上 |

**⇒ 推荐的目标句 `The wind was so strong that the window broke.` 恰好落在「`too … to` 装不下」的那一格**（窗户破不是「谁做的动作」）——**这不是巧合，是选句的第一标准**。

> 另：`too … to` 与 `so … that` 的**共存**必须写进 `deepDive`（进阶折叠卡，**有意保留术语**，见 `grammarLessons.test.ts` 的 `EXEMPT_PATH` 逐字 `deepDive 是进阶折叠卡，设计上就带术语`）。**面向学习者的文案建议**：`L66 那个 too…to 是「太…了，做不了」；今天这个 so…that 是「太…了，所以出事了」——一个说做不了，一个说真发生了。`

---

## §4 `so that`(L186) vs `so ... that`(新) 干扰风险评估 —— 正面回答

### 4.1 风险结论：**会干扰，且是本批最大风险；但可控，且是本课最值钱的部分**

**任务书问得很准。** 经过实测，这个风险比任务书设想的**更大**——因为全库不是「两个形近结构」，而是**三张脸**，且**第四张脸也长得像**：

| 脸 | 结构 | 中文 | 立岗课 | 实测行号 |
|---|---|---|---|---|
| **脸 1** | `so`（连词） | **所以** | **L20** | `:3706` oneLineRule 逐字 `说「因为」用 because 接原因，说「所以」用 so 接结果——英语只用其中一个，不成对出现。` |
| **脸 2** | `so that`（目的） | **是为了** | **L186** | `:37151` grammarLabel 逐字 `是为了 · so that` |
| **脸 3** | **`so … that`（结果）** | **太…了，所以…** | **本课（新）** | 全库 **0**（§6.2） |
| 脸 4 | `So do I`（我也是） | 我也是 | L175 | `:34487` target 逐字 `So do I.` |
| 脸 5 | `too … to` | 太…了做不了 | L66 | `:12398` `targetSentence: "It is too heavy to carry."` |
| 脸 6 | `too`（句尾「也」） | 也 | L145 | `:27902` 逐字 `同一个 too 的另一张脸`；L66 已自陈 `:12480` `too 两身份：词前是「太」、句尾是「也」` |

### 4.2 关键实测：**L186 已经提前把三张脸排过一行了**

这不是本课引入的新混乱——**L186 的老师已经预埋了解药**。逐字（`src/data/grammarLessons.ts`）：

- `:37232`（L186 deepDive）`顺带切一刀：第 20 课那个 so 是「所以」（It was cold, so I stayed at home.），说的是已经发生的结果；今天这个 so that 说的是目的——还没发生，是奔着它去的。`
- `:37240`（L186 **summary.points 第 3 条**）`so（所以）／so that（是为了）—— 一个说结果，一个说目的`
- `:37197`（L186 contrast 双正解卡）`两句都对——第 173 课那句前后是同一个人（我早起、我赶车），用 in order to 正合适；今天多了一格：后一件事是别人做的，就用 so that。`

**⇒ 这三处合起来说明：`so`（所以）与 `so that`（是为了）的对照，L186 已经教过一次。** 本课做的是**补第三张脸**（`so … that`＝「太…了，所以…」），**不是开新战场**。

### 4.3 ⚠️ 但 L186 的那句话有一个**现在才暴露的缺口**

`:37240` 逐字说 `so（所以）／so that（是为了）—— **一个说结果，一个说目的**`。

**问题**：这句话把 `so` 判定为「说结果」。**这在 L186 的语境下没问题**（`so` 是「因为→所以」的连词）。**但本课要教的是 `so … that` 也说结果**——于是用户会看到：

| 中文 | 英语 | `so` 在干什么 |
|---|---|---|
| 天冷，**所以**我待在家 | `It was cold, **so** I stayed at home.` | 连词「所以」，**两件独立的事** |
| 风太**大**了，**所以**窗户破了 | `The wind was **so** strong **that** the window broke.` | **程度＋结果，一件事的因果** |

**⇒ 这构成一个真实的干扰点：「结果」的位置上现在有两个说法。** 但**两者的判据是清晰的**：

- `so`（连词）**前面是一个完整的小句**（`It was cold`），**后面也是一个完整的小句**（`I stayed at home`）——**两件事并列，谁也不是谁的程度**。
- `so … that`**前面是「太＋怎么样」**（`so strong`）——**后面那个结果是这个程度的后果**，且**程度词必须紧跟 `so`**。

**⇒ 本课 `oneLineRule` 建议（零术语版）**：
> `说「太…了，所以出事了」用 so … that——The wind was so strong that the window broke.（风太大了，所以窗户破了）。so 后面紧跟着那个「怎么样」的词（so strong），后面再把出的事说出来。跟第 20 课那个 so 分工很清楚：第 20 课那个 so 前面是一整件事（It was cold），前后两件事谁也不管谁；今天这个 so 前面只有一个「怎么样」的词，后面那件事是这个「怎么样」闹出来的。`

### 4.4 干扰风险的**量化**与结论

| 风险项 | 实测 | 缓解 |
|---|---|---|
| 三张脸撞在同一个中文「所以」上 | 是（§4.3） | 用「前面是一整件事 vs 前面是一个『怎么样』的词」这条**结构判据**切开；L186 已预埋 `:37240` |
| `so that`（目的）与 `so … that`（结果）**形近** | **是，且是本批最危险处**——差一个 `that` 的位置，中文「是为了」vs「所以」 | **剑桥逐字背书这是真实混淆**：`So that (but not in order that ) can also mean 'with the result that'`（§5.2）——**英语母语侧 `so that` 本身也能表结果**！**⇒ 本课必须明确「我们教的是 `so … that` 分开写的那一个」，不要把 `so that` 当结果用**（否则会与 L186 打架） |
| `So do I`（L175）的 `So` 倒装 | 是（形近） | 低风险：L175 的判据是**倒装语序**（`So do I` vs `So I do`），与程度无关 |
| `too … to`（L66）同义 | 是（§3.4） | **正面拥抱**：写成「同一个中文两把椅子」，容量不同（`too … to` 装不下「窗户破」） |

> **引文出处**：`https://dictionary.cambridge.org/grammar/british-grammar/so-that-or-in-order-that`，逐字 `So that (but not in order that ) can also mean 'with the result that'` （完整上下文见 §4.2 引文 4）。

**⇒ 裁定 B（干扰风险）：可控，成立。** 关键护栏三条：① 判据用「`so` 前面是一整件事 / `so … that` 前面是一个『怎么样』的词」；② 明确**不把 `so that`（连写）当结果用**（避免与 L186 打架）；③ 与 `too … to` 用「容量」区分（§3.4），不做「同义替换」处理。

---

## §5 外部权威依据与逐字引用

> ⚠️ **抓取诚实声明**：本轮抓取**部分成功、部分失败**，逐源如实登记如下。**所有成功抓取的引文均逐字来自原始 HTML**（`curl` 取页后正则剥标签），**未做任何改写**。

### 5.1 抓取结果总表（诚实登记）

| 源 | URL | 结果 |
|---|---|---|
| **Cambridge Grammar · `Such or so ?`** | `https://dictionary.cambridge.org/grammar/british-grammar/so-or-such` | ✅ **HTTP 200，抓到全文**（含 typical errors 节） |
| **Cambridge Grammar · `So`** | `https://dictionary.cambridge.org/grammar/british-grammar/so` | ✅ **HTTP 200，抓到全文**（含 `So and that-clauses` 节） |
| **Cambridge Grammar · `Such`** | `https://dictionary.cambridge.org/grammar/british-grammar/such` | ✅ **HTTP 200，抓到全文**（含 `Such … that` 节） |
| **Cambridge Grammar · `So that or in order that ?`** | `https://dictionary.cambridge.org/grammar/british-grammar/so-that-or-in-order-that` | ✅ **HTTP 200，抓到全文** |
| **Cambridge Grammar · `Too`** | `https://dictionary.cambridge.org/grammar/british-grammar/too` | ✅ **HTTP 200，抓到全文** |
| **Cambridge 英汉（简体）词典 · `so`／`such`** | `https://dictionary.cambridge.org/dictionary/english-chinese-simplified/so`、`.../such` | ✅ **HTTP 200，抓到中文对译与例句对译** |
| **Oxford Advanced Learner's Dictionary · `so`** | `https://www.oxfordlearnersdictionaries.com/definition/english/so_1` | ✅ **HTTP 200，抓到 `so… (that)…` 义项与 **A1** CEFR 标注** |
| **Oxford Advanced Learner's Dictionary · `such`** | `https://www.oxfordlearnersdictionaries.com/definition/english/such` | ✅ **HTTP 200，抓到 `such a/an…` 与 **A2／B1** CEFR 标注**、`of such importance that` 例句 |
| **Longman Dictionary of Contemporary English · `so`** | `https://www.ldoceonline.com/dictionary/so` | ✅ **HTTP 200，抓到 `so ... (that)` 义项与 **`✗ Don't say` 错误框**（本轮最有价值的中文侧替代证据） |
| **Longman Dictionary of Contemporary English · `such`** | `https://www.ldoceonline.com/dictionary/such` | ✅ **HTTP 200，抓到 `It's such a tiny kitchen that…` 结果义项与 **`✗ Don't say: a such wonderful teacher`** |
| **爱词霸（iciba）· `so that`** | `https://www.iciba.com/word?w=so+that` | ✅ **HTTP 200，抓到释义「以便；因此」与双语例句** |
| **有道词典 · `so...that`** | `https://dict.youdao.com/w/so...that/` | ✅ **HTTP 200，抓到释义「如此……以致……」** |
| **British Council LearnEnglish** | `https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/so-such` 等 3 个 URL | ❌ **抓不到：HTTP/2 `INTERNAL_ERROR`**（DNS 正常解析到 Akamai `104.89.97.209`，但 HTTP/2 与强制 HTTP/1.1 **两次尝试均返回 `HTTP:000`**；根域与 `/grammar` 同样失败） |
| **新华词典·牛津 Practical English Usage（OUP 官方页）** | `https://elt.oup.com/catalogue/items/global/grammar_vocabulary/practical_english_usage/` | ❌ **抓不到：HTTP 202 且 `size_download=0`**（Akamai 机器人拦截，无内容返回） |
| **知乎 · 语法教学帖** | `https://zhuanlan.zhihu.com/p/357681832` 等 | ❌ **HTTP 403 Forbidden** |
| **百度百科** | `https://baike.baidu.com/item/...` | ❌ **HTTP 403 Forbidden** |
| **Collins Dictionary** | `https://www.collinsdictionary.com/dictionary/english/so`、`.../such` | ❌ **HTTP 403 Forbidden** |
| **WordReference** | `https://www.wordreference.com/enzh/so` | ❌ **HTTP 418**（`I'm a teapot`，反爬） |
| **EnglishClub** | `https://www.englishclub.com/grammar/adjectives-so-such.htm` | ❌ **HTTP 403 Forbidden** |
| **yygrammar（中国语法教学站）** | `https://www.yygrammar.com/Article/201503/4041.html` | ❌ **HTTP 200 但仅 84 字节**（空页，等同抓不到） |
| **EnglishProfile（CEFR 语法档 EGP）** | `https://www.englishprofile.org/english-grammar-profile/egp-online` | ❌ **HTTP 404** |
| **沪江英语（hjenglish）** | `https://www.hjenglish.com/new/p1288234/` | ❌ **HTTP 200 但为**站点首页**，无目标语法内容——等同抓不到** |

### 5.2 ⚠️ `so that` vs `so ... that` 的干扰——**剑桥逐字确认这是真实混淆点**

**URL**：`https://dictionary.cambridge.org/grammar/british-grammar/so-that-or-in-order-that`
**逐字**（原文，`So that or in order that ?` 页）：

> `We use so that and in order that to talk about purpose.`
> `So that (but not in order that ) can also mean 'with the result that':`
> `The birds return every year around March, so that April is a good time to see them.`

**⇒ 这一条对本批至关重要**：剑桥明确指出 **`so that`（连写）本身也能表结果**（`with the result that`）。**我方的 `so … that`（分开写）与 L186 的 `so that`（连写）在英语侧确有交叠**——剑桥把它作为一个「附加说明」放在目的用法之后，说明**在母语侧它是次要用法**。**教学含义**：本课**必须明确「我们教的是分开写的那个」**，并**明确不把 `so that` 当结果用**（否则与 L186 打架，见 §4.4）。

### 5.3 逐字引用（≥3 处，全部可访问）

#### 引文 1 —— `so ... that` 的**结果**义项定位（Cambridge Grammar · `So`）

**URL**：`https://dictionary.cambridge.org/grammar/british-grammar/so`
**逐字**（`So and that -clauses` 节，全文）：

> `We use so + that as a conjunction to introduce clauses of reason and explanation:`
> `They both went on a diet so that they could play more football with their friends.`
> `We also use so + adjective or adverb before that -clauses. We do not use very in this structure:`
> `It was so hot that we didn't leave the air-conditioned room all day.`
> `They drove so fast that they escaped the police car that was chasing them.`
> `Not: They drove very fast that …`

**⇒ 本批对 E1（`very` 误用）的权威依据**：`We do not use very in this structure` ＋ `Not: They drove very fast that …`——**剑桥把这条列进了正文（不是附录）**，说明它是高频错误。

#### 引文 2 —— **`such` 用于「这么…的一个东西」**（Cambridge Grammar · `Such`）

**URL**：`https://dictionary.cambridge.org/grammar/british-grammar/such`
**逐字**（`Such` 页，`Such … that` 节）：

> `We use such before the indefinite article , a/an :`
> `We had such an awful meal at that restaurant! Not: We had a such awful meal …`
> `Such … that We can use a that -clause after a noun phrase with such :`
> `He is such a bad-tempered person that no one can work with him for long.`
> `It was such a long and difficult exam that I was completely exhausted at the end.`

**⇒ 本批对 S2／S3（`a so` / `so kind teacher`）的权威依据**：`Not: We had a such awful meal …`。

#### 引文 3 —— **`so` vs `such` 的四条典型错误**（Cambridge Grammar · `Such or so ?`）

**URL**：`https://dictionary.cambridge.org/grammar/british-grammar/so-or-such`
**逐字**（`Such or so ?` 页，`Typical errors` 节全文）：

> `We use such , not so , before a noun, even if there is an adjective before the noun:`
> `They're such snobs! They won't speak to anyone else in the village. Not: They're so snobs …`
> `Those are such cool shoes. Where did you get them? Not: Those are so cool shoes .`
> `We use such , not so , before a noun phrase with the indefinite article a/an :`
> `This is such a wonderful kitchen! Not: This is a so wonderful kitchen!`
> `We use so , not such , before adjectives:`
> `Thank you. You're so kind. Not: You're such kind .`
> `We use so , not such , before adverbs:`
> `She always dresses so elegantly. Not: She always dresses such elegantly .`

**⇒ 本批对 S1（`such kind`）与 E3（`such hot`）的权威依据**：`Not: You're such kind .` 与 `Not: This is a so wonderful kitchen!`。

#### 引文 4 —— **跨源位次（CEFR 等级）**（Oxford Advanced Learner's Dictionary）

**URL**：`https://www.oxfordlearnersdictionaries.com/definition/english/so_1`
**逐字**（`so` adverb 第 1 义项，**标注 A1**）：

> `to such a great degree`
> `so… (that)… She spoke so quietly (that) I could hardly hear her.`
> `He was so impressed that he jumped up and down with excitement.`

**⇒ `so… (that)…` 在**牛津侧标 A1**——即**入门级就出现**。这与本项目的定位（零基础）**完全吻合**。

**URL**：`https://www.oxfordlearnersdictionaries.com/definition/english/such`
**逐字**（`such` determiner 第 1 义项，**标注 A2**）：

> `used to emphasize the great degree of something`
> `This issue was of such importance that we could not afford to ignore it.`
> `such a/an… Why are you in such a hurry? It's such a beautiful day!`

**⇒ `such a/an…` 在牛津侧标 **A2**（比 `so… (that)…` 的 A1 **晚一级**）。**⇒ 跨源位次结论：应先教 `so … that`（A1），后教 `such a`（A2）**——这**独立支持了本批「只做 `so ... that`」的裁定**（§1.3）。

#### 引文 5 —— **Longman 的 `✗ Don't say` 错误框（对 E1／S2 的第二重背书）**

**URL**：`https://www.ldoceonline.com/dictionary/so`
**逐字**（`so` 词条第 1 义项后的 `Grammar` 框）：

> `• You use such (a) before an adjective and noun: There is not such a big difference. How can such awful things happen?`
> `• Don't use 'so' before an adjective and noun. Don't say: a so big difference so awful things`

**URL**：`https://www.ldoceonline.com/dictionary/such`
**逐字**（`such` 词条 `GRAMMAR: Word order` 框）：

> `You use such a before an adjective and a noun, or before a singular noun: I'm lucky to have such a wonderful teacher. He gave me such a fright.`
> `✗ Don't say: a such wonderful teacher a such fright`

**⇒ 两本权威词典独立给出同一对错误（`a so big difference` / `a such wonderful teacher`）**——**这是 S2 的直接依据，且是「多余／错位的 `a`」这一具体机制**。

#### 引文 6 —— **Longman 的 `so ... (that)` 义项**（第三处结果结构证据）

**URL**：`https://www.ldoceonline.com/dictionary/so`
**逐字**（`so` 第 1 义项 c）：

> `used when emphasizing the degree or amount of something by saying what the result is so ... (that)`
> `He was so weak that he could hardly stand up.`
> `There was so much smoke that they couldn't see across the hallway.`
> `Everything happened so quickly I hadn't time to think.`

**⇒ 注意最后一句 `Everything happened so quickly I hadn't time to think.`**——**`that` 可以整个省掉**。这对本课设计有直接含义：**用户的输入如果漏了 `that`，句子仍可能合法**，因此案件的 `that` 缺省**不适合**做错项；本批的三条错句都**不依赖「漏 that」**（E2 是漏「谁」、E1 是错程度词、E3 是错前后件）✅。

#### 引文 7 —— **中文侧对译（本批最有价值的一条，见 §3.2）**

**URL**：`https://dictionary.cambridge.org/dictionary/english-chinese-simplified/so`
**逐字**（`so` adverb `VERY` 义项）：

> `A2 very, extremely , or to such a degree`
> `The house is so beautiful .` → `这房子太漂亮了！`
> `I'm so tired (that) I could sleep in this chair !` → `我太累了，连坐在这椅子上都能睡着！`

**URL**：`https://dictionary.cambridge.org/dictionary/english-chinese-simplified/such`
**逐字**（`such` determiner，A2 义项）：

> `（用于名词或名词短语前表示强调）如此 ， 这么`
> `It was such a small room that the bed only just fit .` → `那个房间实在太小了，刚够放进去一张床。`

**⇒ 权威中文对译不用「以至于」**，而用「…太…了，连…都…」与「…实在太小了，刚够…」。**⇒ 本课中文意图用「风太大了，所以窗户破了」，不用「以至于」**（§3.2）。

### 5.4 ⚠️ British Council 抓不到（明确声明）

**尝试了 3 个 URL**：

```bash
curl -s -L -A "Mozilla/5.0 … Chrome/120 …" "https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/so-such"
# → HTTP:000  err:HTTP/2 stream 1 was not closed cleanly: INTERNAL_ERROR (err 2)
curl -s -L "https://learnenglish.britishcouncil.org/grammar"   # → HTTP:000（同上）
curl -s -L "https://learnenglish.britishcouncil.org/"          # → HTTP:000（同上）
curl -s --http1.1 -L "…/so-such"                               # → HTTP:000（强制 HTTP/1.1 仍失败）
nslookup learnenglish.britishcouncil.org
# → canonical name = learnenglish.britishcouncil.org.edgekey.net.
#   canonical name = e1359.a.akamaiedge.net.  Address: 104.89.97.209
```

**⇒ 声明：British Council LearnEnglish 本轮彻底抓不到。** DNS 正常（Akamai），但 **HTTP/2 返回 `INTERNAL_ERROR`，强制 HTTP/1.1 也不通**，根域与目标页同样失败。**本报告不含任何 British Council 引文**——不是没找，是**取不到**。

### 5.5 跨源位次综合结论

| 结构 | 牛津 CEFR | 剑桥 | Longman | **教学位次** |
|---|---|---|---|---|
| **`so … (that)…`** | **A1** | 有专节（`So and that-clauses`），并点名 `We do not use very` | 第 1 义项 c，有 `so ... (that)` 标签 | **A1——入门级就出现；应先教** ✅ 与本项目定位吻合 |
| **`such a/an…`** | **A2** | 有专节，`Not: We had a such awful meal` | `✗ Don't say: a such wonderful teacher` | **A2——晚一级；后教** ✅ |
| **`so that`（目的）** | （未取到单独义项） | **专页** `So that or in order that ?`：`so that is far more common than in order that` | —— | 已教（L186）✅ |

**⇒ 位次结论与项目现状的对照**：本项目 **L66（`too … to`）／L71（`enough to`）在 A2 段**，**L186（`so that` 目的）在 A2 末段**，**L192 已是 B1 门槛段**。`so … that`（牛津 **A1**）**其实应该在 L66 前后就出现**——**本批做 L193 属「迟到补员」**，这与本项目「家族开了头、缺成员」的既有模式一致（L186 开 `so that`，本批补 `so … that`）。

---

## §6 自我核查记录（命令 + 输出）

> ⚠️ **核查纪律**：所有「全库为 0 / 已教过 / 某句已被占用」的断言，**一律用 node 词边界正则在 `src/data/grammarLessons.ts` 与 `src/data/huntCases.ts` 全库验证**，并**排除连字符标识符假命中**（`(?<![A-Za-z-])word(?![A-Za-z-])`）。**未使用 `grep`。**

### 6.1 词频（真词口径 vs 宽口径）

```bash
cd /Users/liujun/Documents/英语听写 && node -e '
const S=require("/tmp/sosuch.js");
for(const w of ["such","so","that","enough","too"]) console.log(w+" GL="+S.cnt(S.strict(w),S.GL)+" HC="+S.cnt(S.strict(w),S.HC)+" [宽 GL="+S.cnt(S.loose(w),S.GL)+"]");'
```

**输出**：

```
such   GL=   0   HC=  0   [宽口径 GL=0]
so     GL= 241   HC= 34   [宽口径 GL=247]
that   GL= 226   HC= 16   [宽口径 GL=229]
enough GL=  81   HC=  9   [宽口径 GL=83]
too    GL= 419   HC= 32   [宽口径 GL=424]
```

**⇒ `such` 真词 0、宽口径也 0（**无假命中**，任务书断言成立 ✅）。`so` 有 **6 处**连字符假命中（`lesson-20-because-so` 等，见 §0.4）。

### 6.2 结构级（本批核心断言）

```bash
cd /Users/liujun/Documents/英语听写 && node /tmp/selfcheck.js   # §B 段
```

**输出**：

```
=== B. 结构级（真词口径）===
  so that 紧邻        GL=  61 HC=  3 按课={"102":1,"186":58,"187":1,"188":1}
  so + 词 + that     GL=   0 HC=  0 按课={}
  too + 词 + to      GL=  51 HC=  2 按课={"66":38,"71":7,"145":3,"166":3}
  enough to          GL=  24 HC=  1 按课={"71":24}
  such a/an          GL=   0 HC=  0 按课={}
  too + 词 + that    GL=   1 HC=  0 按课={"66":1}
```

**⇒ 四条关键实测**：
1. **`such`／`such a`／`such an` 全库 0** ✅（任务书成立）
2. **`so` ＋ 「怎么样」的词 ＋ `that`（结果结构）全库 0** ✅ —— **本批候选确实全库未教**
3. **⚠️ `too` ＋ 词 ＋ `to` 全库 51 处，分布 L66（38）／L71（7）／L145（3）／L166（3）** ——**任务书写的「`too ... to` → 0」是错的**（§0.2）
4. **⚠️ `too + 词 + that` 有 1 处，在 L66** —— 即 `:12417` 的带标记错句（§6.3）

### 6.3 「某句已被占用」的逐字定位（本批最重要的核查）

```bash
cd /Users/liujun/Documents/英语听写 && node -e '
const S=require("/tmp/sosuch.js");
console.log("L66 target:",(S.lessons.find(l=>l.num===66).target));
console.log("L66 带标记错句:")
S.show(/(?<![A-Za-z-])too\s+[a-z]+\s+that(?![A-Za-z-])/gi,S.GL,"GL");'
```

**输出**：

```
L66 target: It is too heavy to carry.
### GL total=1
   12417: wrong: "The box is too heavy that I can't carry it.",
   →  line 12417 -> L66 (lesson-66-too-to)  wrongMark="that"
```

**⇒ 这是本批最关键的一条核查结果**：L66 **已经用一条带标记错句处理过「中文『太…了所以不能…』直译成 `too ... that`」这个坑**。
**教学含义**：本批新教 `so … that` 时，**绝不能把 `too ... that` 再当错句**（它已经在 L66 判过错了，而且 L66 的判法是「换 `to` 不换 `that`」）。本批的三条错句（§1.1）**全部绕开了这个坑** ✅。

### 6.4 序号占用与随批清单

```bash
cd /Users/liujun/Documents/英语听写 && node /tmp/selfcheck.js   # §C/§D/§E 段
```

**输出**：

```
=== C. 课号/案号/季 ===
  课数=192  min=1 max=192  缺号=无  重号=无
  案数=201  max=201
  季数=28  最大季=12  小季(≤3)=3
=== D. 序号占用（L193/L194 / 案 202/203）===
  L193 占用: 否   id 含 lesson-193: 否
  L194 占用: 否   id 含 lesson-194: 否
  案 202 占用: 否
  案 203 占用: 否
=== E. cover 复用 ===
  cover 编号 1-117；cover76=1次  cover77=1次  cover78=1次
```

**⇒ 随批清单**：

| 项 | 值 | 依据 |
|---|---|---|
| **季** | **并入 `season-28`**（`max: 192` → `193`，成为 **12 课**大季） | ⚠️ **不新建季**：新建 `season-29`（1 课）会使 ≤3 课小季从 3 个变 **4 个**，`grammarSeasons.test.ts:63` 逐字断言 `toBeLessThanOrEqual(3)` 直接红。并入后 `season-28` **12 课**，与现存最大季（`season-1`／`season-2`／`season-27` 各 12 课）持平 ✅ |
| **季名建议** | `第二十八季 · 收口、目的、条件、不得不、他们的、走向哪儿与太…了所以` | 现名逐字见 `grammarSeasons.ts:73` |
| **里程碑** | `can-do-m40`（`afterLesson: 193`） | 现末位 `can-do-m39`（`afterLesson: 192`，`GrammarPathPage.tsx:388`） |
| **里程碑 title** | `我能说「太…了，所以出事了」` | 与 m35–m39 同型 |
| **案号** | **202**（实测 201 案，案 202 未占用 ✅） | —— |
| **封面** | `cover76`（实测**仅用 1 次**，为复用次数最低档 ✅） | L186–L192 用的是 46／47／71／72／73／74／75 |

### 6.5 难度守门实测

```bash
cd /Users/liujun/Documents/英语听写 && node /tmp/verify.js   # 首段
```

**输出**：

```
===== 当前末课 L192 =====
L192 最长分句=9  「We walked through the forest and across the bridge.」
⇒ 新句最长分句上限 = 14（守门）；建议 ≤ 12
```

**⇒ 本批目标句 `The wind was so strong that the window broke.` = 9 词，跳变 0**（L192 的 9 词 → 9 词）✅ **远在门内**。

**算法核对**（`grammarLessons.test.ts:790` 逐字断言名：`"相邻课的单句最长词数不得跳超 5 词"`；`longestClause` 按 `/[.!?]\s*/` 拆句取最长）：
> 本批新句**只有一个句子**（无 `.!?` 分隔），故最长分句＝整句＝9 词。

### 6.6 撞车检测（对**全库全部英文句**，非只对 targetSentence）

```bash
cd /Users/liujun/Documents/英语听写 && node /tmp/collide.js "The wind was so strong that the window broke."
```

**输出**：

```
【The wind was so strong that the window broke.】
   0.40  L52 [example] The window was broken by the wind.
   0.33  L50 [example] The window was broken.
   0.33  L51 [field] The window was cleaned.
```

**⇒ 最高相似度 0.40（< 本项目的 0.80 红线）** ✅。

> ⚠️ **但这一条暴露了一个真实的设计张力（诚实登记）**：**L52 已有 `The window was broken by the wind.`**（幕后句）。本批目标句 `The wind was so strong that the window broke.` 与它**是同一个场景的两次叙述**——L52 是**幕后句**（窗户被风弄破了，谁做的不重要），本课是**程度＋结果**（风太大了，所以破了）。
> **判定：这不构成撞车，反而是一个加分项**——用户在 L52 学过「把事推到台前」（幕后句），本课学「说出程度和后果」，**两者正好是同一件事的两个说法**。建议在本课 `deepDive` 里**明确回指 L52**（逐字建议：`第 52 课那句 The window was broken by the wind. 说的是「窗户被风弄破了」——谁弄的不重要；今天这句说的是「风太大了，所以破了」——把风有多大说出来了。`）。**但需写课方注意：若认为 0.40 仍偏高，可换 `The wind was so strong that the door broke.` 或 `It was so cold that the water froze.`（后者 `froze` ★未进池，需另判）。**

### 6.7 三条带标记错句的**全库存在性**核查（防止与已有错句重复）

```bash
cd /Users/liujun/Documents/英语听写 && node -e '
const GL=require("fs").readFileSync("src/data/grammarLessons.ts","utf8");
const HC=require("fs").readFileSync("src/data/huntCases.ts","utf8");
for(const s of ["It was very hot that we couldn\x27t work.","I was so late that missed the bus.","It was such hot that we stayed home.","It is so a nice day.","She is such kind.","She is so kind teacher."]){
  const e=s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  const n=(GL.match(new RegExp(e,"g"))||[]).length, m=(HC.match(new RegExp(e,"g"))||[]).length;
  console.log((n||m?"⚠已存在":"新  ")+" GL="+n+" HC="+m+"  "+s);
}'
```

**输出**：

```
新    GL=0 HC=0  It was very hot that we couldn't work.
新    GL=0 HC=0  I was so late that missed the bus.
新    GL=0 HC=0  It was such hot that we stayed home.
新    GL=0 HC=0  It is so a nice day.
新    GL=0 HC=0  She is such kind.
新    GL=0 HC=0  She is so kind teacher.
```

**⇒ 六条候选错句在全库（192 课 + 201 案）均为新句** ✅（E1／E2／E3 三条可用；S1／S2／S3 本批不用，但**登记在此备查**）。

### 6.8 对照卡水位核对（近课一致性）

```bash
cd /Users/liujun/Documents/英语听写 && node -e '
const S=require("/tmp/sosuch.js");
function cards(L){const c=L.body.match(/contrast:\s*\[[\s\S]*?\n\s{4}\],/);if(!c)return null;
 const blocks=c[0].split(/\n\s{6}\{/).slice(1);let mk=0,bo=0;
 blocks.forEach(b=>{const wm=b.match(/wrongMark:\s*(null|"([^"]*)")/);if(wm&&wm[1]!=="null")mk++;else bo++;});return {mk,bo};}
S.lessons.slice(-10).forEach(L=>{const r=cards(L);console.log("  L"+L.num+" marked="+r.mk+" both="+r.bo);});'
```

**输出**（近 10 课）：

```
  L183 marked=3 both=3    L188 marked=3 both=3
  L184 marked=4 both=2    L189 marked=3 both=3
  L185 marked=4 both=2    L190 marked=3 both=3
  L186 marked=3 both=3    L191 marked=3 both=3
  L187 marked=3 both=3    L192 marked=3 both=3
```

**⇒ 近 8 课连续 **3 标记 + 3 双正解**（L184／L185 例外为 4+2）。**L193 应对齐 3+3 水位** ✅（本批 §1.1 提供 3 条带标记错 + 3 条双正解候选，见 §6.9）。

### 6.9 本批的「全库为 0」断言汇总（逐条对照实测）

| 断言 | 实测 | 状态 |
|---|---|---|
| `such` 全库 0 | GL=0、HC=0（宽严口径一致） | ✅ |
| `such a` / `such an` 全库 0 | GL=0、HC=0 | ✅ |
| `so` ＋ 「怎么样」的词 ＋ `that` 全库 0 | GL=0、HC=0 | ✅ |
| 「以至于」全库 0 教学使用 | 「以至于」GL=**2**（均在 L166 解释 `too`，**不在任何目标句／对照卡里**）；「如此」GL=**0** | ⚠️ **修正**：不是 0，但**无教学使用** |
| `too ... to` 全库 0 | **GL=51**（L66／L71／L145／L166） | ❌ **任务书错**（§0.2） |
| `so that` 5 处 | **GL=61 处／51 行**，按课 `{102:1, 186:58, 187:1, 188:1}` | ⚠️ 数字偏小（§0.2） |
| L193 未占用 | 课号 192 连续无缺号；`lesson-193` 前缀未出现 | ✅ |
| 案 202 未占用 | 案数 201、max=201 | ✅ |
| `cover76` 仅用 1 次 | 实测 1 次 | ✅ |

### 6.10 ⚠️ 本轮**未做**的事（诚实声明）

1. **未重跑 `grammarLessons.test.ts`**：本批为**纯研究，零代码／数据改动**（任务书要求「只做研究，不改任何代码/数据」），因此没有可跑的变更。**§5.3 的 `28 项全绿`／`192 课／201 案` 均为本轮 `node` 实测的基线数字，不是测试套件输出。**
2. **未做浏览器走查**：无代码改动，无需走查。
3. **未取到 British Council 与 OUP PEU 原文**（§5.4 已声明尝试过程）。
4. **未评估 `so ... that` 的否定／疑问变体设计的完整性**：本批只做「可做性＋目标句＋错句」三层，**练习（guided 6 题／practice ≥4 题）／recall／huntCase 的逐题规格留给写课批**。

---

## §7 不确定项（诚实登记）

| # | 不确定项 | 影响 | 建议 |
|---|---|---|---|
| **1** | **`such a` 到底该不该完全不做？** | 本批判「不做」，依据是 S2／S3 与 L89 撞车、且牛津标 A2（比 `so…that` 的 A1 晚一级）。**但 `such a` 全库 0 是硬缺口**，中文「这么好的一个天」是高频表达 | **建议保留为下一批的首选候选**，但**与「`a` 站哪儿」的收口课合并**（把 L89 `What a + 东西`、L4 `want + a/an`、L18 `in/on/at` 的冠词线收一次），而不是单独立课 |
| **2** | **`mansion` vs `lighthouse` 的场景选择** | §3.3 给了两个方案，未定 | 推荐 `lighthouse`（间隔 32 课 vs `mansion` 的 1 课） |
| **3** | **L52 `The window was broken by the wind.` 的 0.40 相似度** | §6.6 判「不构成撞车、反而是加分项」，**但这是本研究员的价值判断，不是断言** | 建议写课方二选一：**保留并回指 L52**（推荐，教学价值高）／换 `the door broke` |
| **4** | **`so … that` 省略 `that` 的合法写法** | 剑桥/Longman 逐字 `Everything happened so quickly I hadn't time to think.`（无 `that`）——**用户漏 `that` 仍可能合法** | **案件设计不要用「漏 `that`」当错项**（§5.3 引文 6）。E1／E2／E3 三条已绕开 ✅ |
| **5** | **`so that`（连写）表结果是否要在本课明确否定** | 剑桥逐字 `So that (but not in order that ) can also mean 'with the result that'`——**英语侧确有交叠** | 建议本课**明确说「我们教的是分开写的那个」**；**不要在案件里把「`so that` 连写」判为错**（会与 L186 打架）。**这一条是本批最需要写课方裁定的地方** |
| **6** | **`too ... to` 与 `so ... that` 的取舍是否会让用户觉得「学了没用」** | L66 已能表达「太…了做不了」 | §3.4 用「容量」判据切开（`too … to` 装不下「窗户破」）。**但需写课方在 `oneLineRule` 里确实写清**，否则用户会觉得是重复课 |
| **7** | **里程碑 `can-do-m40` 的 title 措辞** | §6.4 提议 `我能说「太…了，所以出事了」`，未验证与其他 m35–m39 的句式一致性 | 写课批按 m35–m39 的实际句式再定 |
| **8** | **`such` 的中文侧对译「如此／这么」在零术语下是否可用** | §5.3 引文 7 剑桥给的是 `如此 ， 这么`；「如此」全库 GL=0（**未被占用**，可用） | 若未来做 `such a`，建议用「这么…的一个」而非「如此」 |

---

## 附录 A：本批一句话结论

> **`so ... that` 可做，做 1 课（L193），目标句 `The wind was so strong that the window broke.`（9 词，0 新词）；
> `such a` 不做（三条错句里两条与 L89 `What a nice day!` 同源，且牛津标 A2 比 `so…that` 的 A1 晚一级）。
> 最大风险是 `so`(L20 所以) / `so that`(L186 是为了) / `so ... that`(新) 三张脸撞在中文「所以」上——
> 但 L186 的 summary 已提前排过 `so（所以）／so that（是为了）` 一行，本课是补第三张脸，属收口型补员。
> ⚠️ 任务书两处背景数字有误：`too ... to` **不是 0**（实测 51 处，L66 立岗），`so that` 不是 5 处（实测 61 处）。

## 附录 B：本批脚本清单（可复跑）

| 脚本 | 用途 |
|---|---|
| `/tmp/sosuch.js` | 词频（真词／宽口径）、课程块索引、逐课归因 |
| `/tmp/dcheck.js` | D 层新词体检（累计词表池） |
| `/tmp/verify.js` | 词数＋难度守门＋候选句撞车 |
| `/tmp/collide.js` | 对**全库全部英文句**做 Jaccard 撞车（最严口径） |
| `/tmp/selfcheck.js` | 本报告 §6 的自核命令集 |
| `/tmp/pool.js` | 词表池首见课查询 |
