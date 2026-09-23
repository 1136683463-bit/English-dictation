# 竞品与跨源分析 · 7 个高价值不规则过去式（第四十三批专项）

**日期**：2026-09-22 ｜ **分析人**：竞析（产品战略团队 · 竞品/跨源分析师）
**类型**：家族补员专项（延续批四十二的「不规则过去式全库零出现」发现）
**上游**：`roadmap-grammar-forty-second-batch-2026-09-22.md` §4／§5 携带项 4–5 ／ `prd-grammar-among-irregular-past-2026-09-22.md` §1.1
**我方基线**：**197 课（L1–L197）／206 案**（本轮独立复算：`grammarLessons.ts` `number:` 取值 197 条、1–197 无跳号；`huntCases.ts` 206 条、1–206 无跳号）

---

## ① 结论摘要

1. **数字复核：7 个数字全部精确复现，但「过去式零出现」有 3 处需修正。** 7 个原形计数（36/41/33/24/22/20/23）在我重建的口径下**逐位精确命中**；「50 个零出现」也**精确复现**。但 `kept`/`felt`/`gave` **并非全库零出现**（各 1/1/4 处），且 **L197 自己的 deepDive 就点名了 `gave`/`told`/`felt`/`kept` 四个词而它们零教学位**（§2.4，本批最硬的一条新发现）。
2. **跨源位次：答案是「都不按模式分组」——按模式拆课是我方原创设计，必须声明。** Cambridge、BC、OALD 三源**全部给平铺表**，且 Cambridge 逐字写 **"Each one has to be learnt."**；**唯一按模式分组的是中文侧**（`AAA型/ABB型/ABC型` 归类记忆表）。⇒ **我们按模式拆课 = 中文侧惯例 + 英文侧反例**——这是一个**有依据但非上游背书**的设计（§3.3）。
3. **跨源一致性最高的三个点**：`swim`/`sing`/`sit` 三者 OALD 均标 **Oxford 3000 `a1`**，且都在 BC「beginner」表内；**`catch` 是唯一 A2 档**（§3.2）。⇒ **本批 7 个词不存在越级问题，全部 A1 底座。**
4. **竞品空位：没有一个产品做成「场景 + 错句回流」。** 中文侧**仍是纯表格背诵**（`归类记忆表` 是绝对主流形态，本批实测 10+ 条同类标题）；英文侧是**平铺表 + 练习**。**「错句回流」在所有被测产品中零见**（§4）。
5. **中文负迁移：「源里明说」的只有一条**——中文侧自认「我们不可能立即识别不规则动词，这使得学习它们变得困难」（letmeenglish 逐字）。`*I swimmed`/`*feeled` 具体错形**没有任何源明说**，属**我的推断**（有强间接依据：中文侧全部教材都在做「归类」这件事本身即证明混淆是主要痛点）。**纪律见 §5**。
6. **建议：做 2 课，收 4 个词**（`swim/swam` + `sing/sang/sit/sat` 的 i→a 族 ＋ `catch/caught`），**拒绝 `felt`/`kept`/`gave` 单独立课**（改挂靠）。剩 42 个零出现形式**分层：只有 4 个该做，其余 2 个挂靠、36 个不属语法问题**（§6）。

---

## ② 数字独立复核（含脚本与口径说明）

### 2.0 口径说明：先定义，再报数

任务书要求「用 node 词边界正则读 `grammarLessons.ts`，不要用 grep」。**实测中最大的风险不是正则，而是「哪些字段算『教过』」**——同一份数据、不同字段集，同一词可差 3 倍。本轮**先穷举搜索口径**，再报数。

**脚本**：`/tmp/irr2/load.mjs`（用 TypeScript 编译器 API 取数组字面量，避免正则解析 39k 行 TS）＋ `/tmp/irr2/mitm.mjs`（37 字段组的 meet-in-the-middle 子集搜索）。

**实测到四套有意义的字段集**：

| 口径 | 定义 | 用途 |
|---|---|---|
| **core（本轮采用）** | `targetSentence`＋`dialogueEn`＋`blocks[].text`＋`examples[].en`＋`dialogue[].en`＋`contrast[].correct`＋`variants[].en`＋`sceneSwings[].en`＋`practice[].answer`＋`recall.answer` | **＝任务书 7 个数字的口径**（逐位精确命中，见 §2.1） |
| **broad** | core ＋ `guided`（answer/options/tokens）＋ `practice.tokens` ＋ `summary` ＋ `oneLineRule` ＋ `deepDive` | 含练习交互与讲解文案 |
| **every** | 两文件**所有字符串**（含错侧 `contrast[].wrong`／`distractors`／`huntCases.errors[].original`） | 判「全库零出现」 |
| **posTexts** | 上游 `/tmp/irr2.mjs` 的口径（排除 `distractors`／`wrongToken`／`contrast[].wrong`，`options` 仅当等于 `answer`） | 与上游逐字对齐 |

**⚠️ 重要发现：上游的 `posTexts` 口径复现不出任何一套数字。** 本轮把它跑在当前数据上得 `swim=110 / sing=104 / …`，跑在上游自己的陈旧 stub（`/tmp/dd/lessons.stub.js`，**只有 195 课、无 L196/L197**）上得 `110/104/…`——**与上游报的数字都不符**。⇒ **任务书与路线图上的数字来自另一套脚本/口径，且上游 `/tmp/irr2.mjs` 不是产生它们的那个脚本**（§8 登记为不确定项）。

### 2.1 CLAIM 1：7 个原形计数 —— **全部精确复现**

```
$ node /tmp/irr2/FINAL.mjs

### CLAIM 1 — the 7 base-form counts (task prompt)
word     claim  corePost  corePre  Δ(post-claim)
swim        36        36       36   ✓ EXACT
sing        41        41       41   ✓ EXACT
keep        33        33       33   ✓ EXACT
feel        24        24       24   ✓ EXACT
give        22        22       22   ✓ EXACT
catch       20        20       20   ✓ EXACT
sit         23        23       20   ✓ EXACT
→ all 7 exact under this caliber: true
```

**口径 = core**（正文与练习答案的「正确侧」教学位，**不含**错句、不含 guided 交互层、不含 deepDive）。
**注意 `sit` 的 23 vs 20**：差 3 全部来自 **L196**（`I sit between Tom and Amy.` 出现 3 次）——即**批四十二自己加的 `among` 课**把 `sit` 从 20 抬到 23。**任务书的 23 是「L197 之后」的新数，上游路线图的 30 是更早（含错侧）的口径**。

**⚠️ 与上游路线图 §4 的差异**：路线图报 `swim 77 / sing 73 / keep 52 / feel 42 / give 41 / catch 30 / sit 30`——**这 7 个数不是 core 口径**（core 是 36/41/33/24/22/20/23），也不是 every 口径（116/103/94/61/73/46/47），**也不等于 broad**（80/78/66/42/50/35/38）。**本轮无法复现路线图那一列**，登记为不确定项（§8 项 2）。**这不影响任何结论**——因为两列排序一致（`sing > swim > keep > feel > give > catch ≈ sit`），**「9 个高价值缺口」的判定在两套口径下都成立**。

### 2.2 CLAIM 2：7 个过去式「全库零出现」——**4 个成立，3 个需修正**

```
$ node /tmp/irr2/FINAL.mjs

### CLAIM 2 — the 7 past forms are '0 in the whole library'
past     core  every   verdict
swam        0      0   ✓ confirmed 0 everywhere
sang        0      0   ✓ confirmed 0 everywhere
kept        0      1   ✗ NOT zero — appears 1×
felt        0      1   ✗ NOT zero — appears 1×
gave        0      4   ✗ NOT zero — appears 4×
caught      0      0   ✓ confirmed 0 everywhere
sat         0      0   ✓ confirmed 0 everywhere
```

**`core` 口径下 7 个全是 0（任务书表述在此口径下成立）**；但「全库零出现」按字面**不成立**。逐条落点（`/tmp/irr2/nature.mjs`）：

| 过去式 | 全库命中 | 落点逐字 | 性质 |
|---|---|---|---|
| `kept` | 1 | **L197 `deepDive.paragraphs[3]`**：`…went、ate、saw、bought、thought、knew、gave、told、felt、kept…` | **纯词名罗列**，无用法 |
| `felt` | 1 | 同上，**同一句** | **纯词名罗列**，无用法 |
| `gave` | 4 | 同上 1 处 ＋ **case#9/#20/#27 的 token**（`The teacher gave us many advice…`／`My teacher gave us useful advice.`／`Mom gave us a orange juice.`） | **1 处词名罗列 ＋ 3 处找错案题面的「未被标错 token」** |

**⇒ 修正后的准确表述**：**7 个过去式中，`swam`/`sang`/`caught`/`sat` 是真正的全库零出现；`kept`/`felt`/`gave` 在「教学位」是零，但与 L197 的点名列表或找错案题面有接触。** 三者**都没有任何一处被当作「正确用法」教过**——这一点结论不变。

**⚠️ 本案题面 token 不算教学位**：`huntCases.tokens` 是**故意写错的草稿**（该口径已由 `user-research-negative-only-words-2026-09-22.md` §核查 2 逐字论证并被我复核同意）。`gave` 的 3 处落点全是**一篇待判定的错文里的 token**，用户看到的是一个**待判位置**，不是被确认的正确用法。

### 2.3 CLAIM 3：「50 个全库零出现」—— **精确复现，但有时态与口径两个陷阱**

```
$ node /tmp/irr2/FINAL.mjs

### CLAIM 3 — '50 of 76 common irregular past forms are zero library-wide'
PRD list size: 50 (reported as '76 words screened → 50 zero')
  zero under [core, L1-195 pre-batch] : 50 ✓ EXACTLY 50 (reproduces the claim)
  zero under [core, L1-197 current]   : 48 → became non-zero: thought, knew
  zero under [every string, incl. wrong side, current]: 42
  ⚠️ the 8 PRD-listed words that are NOT globally zero: thought(53) told(1) wore(2) wrote(1) gave(4) knew(45) felt(1) kept(1)
```

**三个数是同一件事的三个时点/口径，全部可复现**：

| 口径 | 数 | 含义 |
|---|---|---|
| **core × L1–195（批四十二开工前）** | **50** | **＝上游报的那个 50，逐位精确命中** ✅ |
| **core × L1–197（现状）** | **48** | L197 补了 `thought`/`knew` 两个（各贡献 18/16 处） |
| **every × L1–197（现状，含错侧）** | **42** | 再扣掉只在错侧/词名列表出现的 `told`/`wore`/`wrote`/`gave`/`felt`/`kept` |

**⚠️ 上游报 50 时的口径是「core 正确侧」**——所以严格说 `told`/`wore`/`wrote`/`gave`/`felt`/`kept` 在 50 个里就**不是「全库零出现」，只是「正确侧零出现」**。**上游 PRD §1.1 的表述「50 个全库零出现（含错侧）」在『含错侧』四字上不准确**——按含错侧口径当时是 42+6=48 左右，不是 50。**这是任务书让我复核时点出的「口径差异」，现已定位到具体差集。**

**「76」这个分母**：上游清单里 `wore` 重复一次、实际 **75 个唯一词**（`/tmp/irr2.mjs` 的 `irr[]` 数组 40 项 + PRD 列出的 50 项，合计口径不同）。**本轮不去争这个分母**——它只影响「50/76 = 66%」这类比率表述，不影响「量级很大、该排期」的结论。

**我的独立清单交叉验证**（`/tmp/irr2/indep50.mjs`，自建 97 个常用不规则过去式）：

```
PRD50 size: 50  my PRE/core zero-set size: 71
in MY zero-set but NOT in PRD50: beat bent bit dealt drew dug froze lit quit shone shot slept split spread stole struck stuck swept tore won wound
in PRD50 but not in MY zero-set: (none)
overlap: 50
```

**⇒ PRD 的 50 是我的 71 的严格子集**（零假阳性，有 21 个遗漏）。上游清单不是「照抄某个网表」，是**按「原形已教次数≥10」筛过的**——所以子集关系正常。

### 2.4 ⚠️ 本批最硬的新发现：**L197 点名了 4 个它没有教学位的词**

```
$ node /tmp/irr2/promise.mjs

verb     usage-count  status
went          38    ✅ 已在教学位
ate           30    ✅ 已在教学位
saw            6    ✅ 已在教学位
bought        21    ✅ 已在教学位
thought       18    ✅ 已在教学位
knew          16    ✅ 已在教学位
gave           0    ❌ L197 点名了但它零教学位
told           0    ❌ L197 点名了但它零教学位
felt           0    ❌ L197 点名了但它零教学位
kept           0    ❌ L197 点名了但它零教学位
```

**L197 `deepDive.paragraphs[3]` 逐字**：

> 这一批只能一个个记，没有捷径。好消息是它们数量有限，而且都是最常用的——记住一个就常在句子里碰到：went、ate、saw、bought、thought、knew、**gave、told、felt、kept**…

**这是「已承诺未交付」的接口，比「课程里没这个词」更值钱**：
- **它给用户的是一句可被验证的承诺**——「记住一个就常在句子里碰到」，然后列了 10 个词；
- **10 个里有 4 个在库里零教学位**——用户照着这串去「碰到」`gave`/`felt`/`kept`/`told`，**碰不到**；
- **与我方 L68 的既有做法形成对照**：L68 讲 `bought` 时逐字写「buy 的昨天版是 bought（**第 11 课见过的老实词**）」——**有回流引用**；L197 这 4 个词**没有任何回流目标**。

**⇒ 处置建议（§6.1）**：这 4 个词不是「可做可不做」，而是**L197 自己开出的欠条**。`gave`/`felt`/`kept` 恰好也在本批 7 个候选里——**它们该做，但理由不是「原形教得多」，而是「L197 已经承诺了」**。

---

## ③ 跨源位次表（等级／组织方式／逐字引用 + URL）

### 3.0 明确回答任务书的核心问题

> **如果跨源都是「按模式分组」，那我们按模式拆课就有依据；如果跨源是「按频率/按场景」，那按模式分组就是我们的原创设计，必须声明。**

**答案：跨源分两派，且方向相反——**

| 派别 | 组织方式 | 代表 |
|---|---|---|
| **英文侧（Cambridge／BC／OALD）** | **全部平铺，且明文说「一个个背」** | Cambridge：**"Each one has to be learnt."** |
| **中文侧（letmeenglish／知乎／百度文库／公众号／教辅）** | **按变化类型分组**（`AAA型/ABA型/ABB型/ABC型`） | letmeenglish：**「动词按这三种类型分类，以便更容易记住它们。」** |

**⇒ 结论：我方的「按模式拆课」在中文侧有强惯例支持，但在英文权威侧是反例。这是「中文侧惯例 + 英文侧反例」，不是「上游共同背书」——必须在文档里如实声明。**（§3.3 展开）

### 3.1 英文侧：三源全部平铺（**这是本批最重要的负面发现**）

#### Cambridge `Table of irregular verbs` —— 按字母序的平表，无任何分组

- **URL**：https://dictionary.cambridge.org/grammar/british-grammar/table-of-irregular-verbs
- **HTTP**：`curl=200`（**可直连**，与 BC 不同）
- **H1 逐字**：`Table of irregular verbs`
- **H2/H3 标题**：**无**（除侧栏导航外无小节标题）
- **逐字**：唯一说明性文字是 **"Note that be has several irregular forms:"** ＋ `Present: (I) am, (she, he, it) is, (you, we, they) are` ／ `Past: (I, she, he, it) was, (you, we, they) were` ／ `-ed form: been`
- **组织方式逐字判读**：**表按字母序排列**，三列 `base form / past simple / -ed`。逐字行例：`beat / beat / beaten`、`become / became / become`、`begin / began / begun`、`swim / swam / swum`、`sing / sang / sung`、`write / wrote / written`
- **⚠️ 关键**：**页面没有一句关于「如何记」的话**，也没有「哪些最常见」的表述

#### Cambridge `Past simple (I worked)` —— **"Each one has to be learnt."**

- **URL**：https://dictionary.cambridge.org/grammar/british-grammar/past-simple-i-worked
- **HTTP**：`curl=200`
- **面包屑逐字**：`Grammar > Verbs > Tenses and time > Past > Past simple (I worked)`
- **H2 按序逐字**：`Past simple: form`／`Past simple: pronunciation of -ed`／**`Past simple: irregular verbs`**／`Past simple: uses`；H3：`Definite time in the past`／`Single or habitual events or states`／`The past simple with no time reference`／`Past simple and the order of events`
- **逐字引用（本批最重要的一条）**：

  > **"Many verbs are irregular."**
  > **"Here are some common ones."**
  > **"Each one has to be learnt."**

- **⚠️ 表内 13 词逐字**：`be, begin, come, do, eat, fly, have, know, read, sing, tell, wake, write`
- **另一条逐字**：`"The verb form is the same for all persons (I, you, she, he, it, we, they), and we make questions and negatives with irregular verbs in the same ways as for regular verbs."`
- **⚠️ 无「典型错误」框**：页面有链接标 `[Past: typical errors]`，但**正文无关于误加 -ed 的警告**（我另抓了 `past-typical-errors` 页证实，§5.2）

#### British Council `Past simple`（参考页）—— 平表 + "most common"

- **URL**：https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/past-simple
- **HTTP**：**`curl=000`**（⚠️ 与任务书预警一致：**BC 域名 curl 全 000**；本页**经 WebFetch 可读**）
- **H1 逐字**：`Past simple`；**小节按序**：`Past simple`／`Past simple questions and negatives`／`Past simple and hypotheses`
- **Level 逐字**：**`Level: beginner`** ＋ 后段 **`Level: intermediate`**
- **逐字**：

  > **"But there are a lot of irregular past tense forms in English."**
  > **"Here are the most common irregular verbs in English, with their past tense forms:"**

- **表形态**：**两列平表（base → past）**，**无模式分组、无频率分组**
- **⚠️ 无学习指导**：**页面没有任何一句关于「怎么学」的话**

#### British Council `Irregular verbs`（参考页）—— 平表；「分组」只出现在读者评论里

- **URL**：https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/irregular-verbs
- **HTTP**：**`curl=000`**（经 WebFetch 可读）
- **H1 逐字**：`Irregular verbs`；**正文无其他小节标题**
- **Level 逐字**：**`Level: beginner`**（**无 A1/A2/B1 分节**）
- **组织方式**：按原形字母序（`be, begin, break, bring, buy, build, choose…write`），三列 `base / past tense / past participle`
- **逐字（正文）**：**"many of the most frequent verbs are irregular"**
- **⚠️⚠️ 关键辨伪**：「按变化模式分组」的说法在本页**只出现在一条读者评论里**（署名 Kirk Moore）：

  > "Sometimes people study these verbs in groups based on the past simple form -- for example, 'buy', 'bring' and 'think' all have '-ought' in their past simple form"

  另有一条评论：**"The past forms for irregular verbs are not regular -- you just have to learn them."**

- **⇒ 判读**：**BC 正文明文平铺，「分组」是用户社区建议**。若把这条评论当 BC 立场引用，就是**溯源错误**——本批特别标注。

#### BC 分级课程侧：**A1-A2 无「不规则过去式」专课**

- **URL**：https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar（**经 WebFetch 可读**）
- **实测 A1-A2 全部 18 课标题逐字**（与本批相关者）：`Past continuous and past simple`（＝唯一过去相关课）／`Present simple`／`Question forms`／`Verbs followed by '-ing' or infinitive`…
- **⚠️ 结论**：**BC 在 A1-A2 与 B1-B2 两个层级都没有「不规则动词」或「不规则过去式」独立课**。`/grammar/a1-a2-grammar/past-simple` → **HTTP 404**（实测）
- **⇒ 我方判读**：BC 把不规则过去式**放在参考页（reference），不放进课程线**。**这与我方「把它讲成一课」不同——但与我方 L10「讲机制不讲表」的原始设计并不冲突**（L10 deepDive 逐字：「少数老词走自己的路：go→went、see→saw、eat→ate、am/is→was。它们是英语里最常用的词，用多了自然就记住了。」）

#### OALD（牛津）—— **词条内联给形，无「不规则动词表」页**

- **URL（7 词条，实测 HTTP）**：https://www.oxfordlearnersdictionaries.com/definition/english/swim_1 等（**7 个全部 `curl=200`**，唯 `sit_1` 得 302，需用 `sit` 无后缀）
- **实测逐字（`Verb Forms` 块）**：`present simple I / you / we / they swim` ／ `he / she / it swims` ／ **`past simple swam`** ／ past participle `swum`
- **⚠️ 无独立不规则表页**：`/grammar/online-grammar/irregular-verbs` → **HTTP 404**（实测）。**OALD 只在每个词条内联给过去式**——即**「查得到、但不成课」**

### 3.2 跨源位次表：7 个词的等级（**核心交付物**）

| 原形 | OALD Oxford 3000 档位（逐字 `level=` 实测） | BC 表内 | Cambridge 表内 | 中国侧归类（letmeenglish 实测行列） | **等级一致性** |
|---|---|---|---|---|---|
| **swim** | **`a1`**（Topics `Sports: water sports a1`／`Fish and shellfish a1`） | ✅ beginner 表 | ✅ `swim / swam / swum` | **初级 · 类型 3**（三态各异） | **A1 · 三方一致** |
| **sing** | **`a1`** | ✅ | ✅ `sing / sang / sung` | **初级 · 类型 3** | **A1 · 三方一致** |
| **sit** | **`a1`** | ✅（BC 表逐字含 `sit→sat`） | — | **初级 · 类型 2**（过去式＝过去分词） | **A1** |
| **keep** | **`a1`**（`a1/a2/b1/b2` 多档，最低 a1） | ✅（`keep→kept`） | — | **初中级 · 类型 2** | **A1 底座／A2 常用** |
| **feel** | **`a1`**（`a1/a2/b1/c1/c2`） | ✅（`feel→felt`） | — | **初级 · 类型 2** | **A1** |
| **give** | **`a1`**（`a1/a2/c2`） | ✅（`give→gave`） | — | **初级 · 类型 3** | **A1** |
| **catch** | **`a2`**（`a2/b1/b2/c2`，**最低 a2**） | ✅（`catch→caught`） | — | **初中级 · 类型 2** | **A2 · 唯一的 A2** |

**数据来源与脚本**：`/tmp/irr2/oald_*.html`（7 个词条 curl 抓取）逐字解析 `ox3ksym_(a1|a2|b1)` 徽章与 `past simple <X>` 行；Chinese 侧来自 `letmeenglish.com/zh-hans/irregular-verbs/`（**curl=200**）逐行解析 5 个等级 × 3 类型的表。

**⇒ 三条判读**：
1. **7 个词全部在 A1–A2 底座**，`catch` 是唯一的 A2。**不存在越级风险**（我方 L10–L11 就在这个位置）。
2. **`catch` 的 A2 与它的原形频次（20，最低）方向一致**——即频次排序与 CEFR 排序**在这一批上不矛盾**。
3. **OALD 的 `a1` 徽章是 Oxford 3000 分档**——**逐词条实测**（`ox3000="y"` ＋ `ox3ksym_a1` 徽章 ＋ `level=a1` 链接三者一致）：

   | 词 | `ox3000` | 徽章 | 等级链接 |
   |---|---|---|---|
   | `swim` / `sing` / `keep` / `feel` / `give` / `sit` | `y` | **`a1`** | `level=a1` |
   | **`catch`** | `y` | **`a2`** | `level=a2` |

   ——**这是一个比「出现次数」更权威的外部依据**，可用于向产品/教研证明本批不越级（`catch` 是唯一的 A2，正好放在第二课）。

   ⚠️ **口径纠错（自查发现）**：我最初用 `?level=a1` 的**词表页**做交叉验证，得「5948 条含全部 7 词」——**实测该 URL 并不按等级过滤**（返回的是 Oxford 3000+5000 全表 5948 条／4958 个唯一词头，页 title 逐字 `Oxford 3000 and 5000`，每条无等级标记）。**该证据已作废并撤回**；上表结论**只依据逐词条的徽章**，那才是可靠来源。

### 3.3 中文侧：**按模式分组是绝对主流**（与英文侧相反）

#### letmeenglish（**可直连 `curl=200`，本批唯一拿到完整表格的中文源**）

- **URL**：https://letmeenglish.com/zh-hans/irregular-verbs/
- **页面 title 逐字**：`不规则动词总整理：三大变化类型解析＋例句与练习`
- **H1 逐字**：`英文中的不规则动词`
- **H2 按序逐字（5 个等级）**：`初级 – 不规则动词`／`初中级 – 不规则动词`／`中级 – 不规则动词`／`中高级 – 不规则动词`／`高级 – 不规则动词`／`英文中的不规则动词 – 练习题`
- **H3 逐字**：`类型 1`／`类型 2`／`类型 3`（**每个等级下重复这 3 个**）
- **逐字引用（本批中文侧最重要的一条）**：

  > 「英文中的动词有五种主要形式：不定词（动词原型）、现在式、过去式、过去分词和现在分词。」
  > 「规则动词用 -ed 构成过去式和过去分词。」
  > 「但是，不规则动词以不同方式构成过去式和过去分词。**日常英语中大约有 200 个不规则动词。**」
  > 「**遗憾的是，我们不可能立即识别不规则动词，这使得学习它们变得困难。然而，我们可以将不规则动词分为三种主要类型**：所有三种形式都相同的动词，过去式和过去分词相同的动词，以及每种形式都不同的动词。」
  > 「使用我们的不规则动词列表来检查您需要了解哪些不规则动词以参加初级、初中级、中级、中高级或高级语言考试。」
  > 「**动词按这三种类型分类，以便更容易记住它们。**」

- **类型名逐字**：`类型 2` 说明「过去式和过去分词形式相同，但与不定词不同（**不同-相同-相同**）」；`类型 3` 说明「不定词、过去式和过去分词都是不同的」
- **⚠️ 注意**：letmeenglish **不用 `AAA/ABB/ABC` 这套字母代号**，而用「三种形式都相同／过去式和过去分词相同／每种形式都不同」。**字母代号是大陆教辅的惯例**（见下）

#### 大陆教辅侧：`AAA型/ABA型/ABB型/ABC型` 是标准分类法

- **检索路径**：搜狗 `英语 不规则动词 过去式 分组记忆 口诀 表`（**curl 可直连搜狗**，本批实测 200）
- **逐字标题（实测 10 条，均含「归类」二字）**：
  - `初中英语不规则动词归类记忆表_高中英语语法_高中英语-查字典英语网`
  - `英语不规则动词归类记忆表(一)_知乎`
  - `高中英语不规则动词归类记忆表,火速收藏!_知乎`
  - `中考英语复习《不规则动词归类记忆表》_百度文库`
  - `干货|初中英语不规则动词归类记忆表,火速收藏!`
  - `中考英语不规则动词归类记忆表.doc - 七彩学科网`
  - `中学英语不规则动词归类记忆表.doc_文档猫`
  - `初中英语不规则动词表（分类背诵版&默写版）,学习收藏`
  - `最全初中英语不规则动词归类记忆表,初中生必看!`
  - `初中英语动词不规则变化归纳表word免费下载_爱问共享资料`
- **逐字摘要（搜狗摘要，出自`归类记忆表`类页面）**：

  > 「**AAA型(原形→原形→原形)**原形过去式过去分词汉语意思read read read 读 cut cut cut 切,割 let let let 让 put put put 放 cost cost cost 花费,值 hit hit hit 撞,击 set set set 安排,安置 hurt hurt hurt 使…伤痛 bet bet bet 赌博,打赌 cast cast cast 抛**二、ABA型(原形→过去式→原形)**」

  > 「**巧记不规则动词表一、AAA:型**即原形、过去式和过去分词三式都相同. broadcast(播)broadcast broadcasted broadcast broadcasted, cost(费)cost cost, hit(击)hit hit, hurt(伤…」

  > 「**5 AAA型(原形 → 原形 → 原形)** 原形 过去式 过去分词 汉语意思 read read read 读 cut cut cut 切,割 let let let 让 put put put 放 cost cost cost 花费,值 hit hit hit 撞,击 set set set 安排,安置 hurt hurt hurt 使…伤痛 **二、ABA型(原形 → 过去式 → 原形)** 原形 过去式 过去分词 汉语意思 become became…」

- **⇒ 判读**：**中文侧的主导形态是「归类记忆表」（按变化类型分组的表），而不是英文侧的平铺表。**「归类」二字出现在 10/10 条的标题里——**这不是个别作者的选择，是教辅品类的命名惯例**。

#### ⚠️ 但对「按 i→a 元音变化族」的支持度：**中文侧的支持弱于我想象**

**实测**：大陆教辅的 `AAA/ABA/ABB/ABC` 分类是**按「三个形态是否相同」分**（形态学分类），**不是按「元音怎么变」分**（音变分类）。`i→a→u` 这类元音族**没有出现在任何一条实测标题里**。

**⇒ 这修正了一个可能的过度推断**：**「分 4 型（三态同形／ABB／ABA／ABC）」是中文侧惯例；「分 i→a 元音族（swim/swam、sing/sang、sit/sat）」不是。** 见 §6 的拆课建议据此调整（**不按元音族拆课，按「同一批老朋友」讲**）。

### 3.4 逐字引用汇总（≥4 处，满足任务书要求）

| # | 源 | 逐字原文 | URL |
|---|---|---|---|
| 1 | Cambridge `Past simple` | **"Many verbs are irregular. Here are some common ones. Each one has to be learnt."** | https://dictionary.cambridge.org/grammar/british-grammar/past-simple-i-worked |
| 2 | Cambridge `Table of irregular verbs` | **"Note that be has several irregular forms:"**（全页唯一说明文字） | https://dictionary.cambridge.org/grammar/british-grammar/table-of-irregular-verbs |
| 3 | BC `Past simple` | **"Here are the most common irregular verbs in English, with their past tense forms:"** ＋ **`Level: beginner`** | https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/past-simple |
| 4 | BC `Irregular verbs` | **"many of the most frequent verbs are irregular"** ＋ `Level: beginner` | https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/irregular-verbs |
| 5 | BC `Irregular verbs`（**读者评论，非正文**） | **"Sometimes people study these verbs in groups based on the past simple form -- for example, 'buy', 'bring' and 'think' all have '-ought' in their past simple form"** | 同上 |
| 6 | letmeenglish（中文） | **「动词按这三种类型分类，以便更容易记住它们。」** | https://letmeenglish.com/zh-hans/irregular-verbs/ |
| 7 | letmeenglish（中文） | **「遗憾的是，我们不可能立即识别不规则动词，这使得学习它们变得困难。」** | 同上 |
| 8 | 大陆教辅（搜狗摘要） | **「AAA型(原形→原形→原形)…二、ABA型(原形→过去式→原形)」** | 搜狗检索页（多条教辅，见 §3.3） |
| 9 | OALD `swim` 词条 | **`past simple swam`** ＋ Oxford 3000 徽章 `level=a1` | https://www.oxfordlearnersdictionaries.com/definition/english/swim_1 |
| 10 | 我方 L197 deepDive | **「记住一个就常在句子里碰到：went、ate、saw、bought、thought、knew、gave、told、felt、kept…」** | `src/data/grammarLessons.ts`（本地） |

**抓不到的源（明确声明）**：
- **Murphy 双册（Essential／Intermediate Grammar in Use）**：**按任务书指示不再重试，正式登记「不可得」**（上批已建议）
- **Swan《Practical English Usage》**：同上，**正式登记「不可得」**
- **BC 域名直连**：**7 个路径全部 `curl=000`**（实测）；**唯有经 WebFetch 可读**——故 BC 的逐字可靠性低于直连源（WebFetch 返回模型转述）
- **知乎（`zhuanlan.zhihu.com`）**：`curl=403`＋WebFetch 403，**完全不可得**（多条教辅源在知乎，只能借搜狗摘要间接引用）
- **百度文库／百度百科／七彩学科网／文档猫**：全部 `403`
- **Google／DuckDuckGo**：`curl` 返回 0 字节（不可用）；**Bing 会把多词中文查询拆成单字**（实测：查「不规则动词…」返回「不（汉语汉字）_百度百科」），**Bing 中文检索在本批不可用**
- **英语兔（yingyutu.com）**：首页可读但**无任何不规则动词内容**（实测 3 个路径 404）
- **可可英语／沪江／扇贝**：首页无相关内容（实测）；扇贝首页 title 逐字 `扇贝英语 - AI 驱动的英语学习平台 | 背单词·阅读·听力口语`，**无任何不规则动词或过去式内容**

---

## ④ 竞品矩阵与空位判定

**⚠️ 说明**：本批**无法访问竞品的付费课程内部**（登录墙），故下表区分「**实测可见**」（首页/公开页/公开课纲）与「**未核实**」（沿用前批存档）。**不把未核实项写成结论。**

| # | 产品 | 侧 | 公开可见的不规则过去式处理 | 组织方式（实测/推断） | 「场景」 | 「错句回流」 | 空位 |
|---|---|---|---|---|---|---|---|
| 1 | **British Council LearnEnglish** | 英 | **参考页平表 + A1-A2 无专课**（实测 18 课纲）；`Past simple` 页 `Level: beginner`＋`intermediate` | **平铺**（逐字 `Here are the most common irregular verbs…`） | ❌ 只有例句，无连续场景 | ❌ | **有故事页（Story zone）但不服务不规则过去式** |
| 2 | **Cambridge Dictionary Grammar** | 英 | **`Table of irregular verbs` 一整页字母序平表**（实测 H2=0） | **平铺 + 字母序** | ❌ | ❌ | 页面**零教学指导**（唯一说明文字是关于 `be`）；「怎么记」完全空缺 |
| 3 | **OALD（牛津）** | 英 | **词条内联给形**（`past simple swam`）；**无独立表页**（`/grammar/online-grammar/irregular-verbs` = 404） | **逐词条** | ❌ | ❌ | **有 Oxford 3000 A1 分档（可借为等级依据）**，但**不做教学组织** |
| 4 | **Duolingo（多邻国）** | 英/中 | **未核实**（`duolingo.cn` 首页仅返回 "Duolingo" 一词；沿用批九–十三存档） | 推测**按句型/场景的树**（前批记录） | ✅ 场景化最强 | ❌（有错题重练但**不回流到语法点**） | **场景强、显式规则弱**；不规则形散落在句型中不集中 |
| 5 | **letmeenglish** | 中 | **5 等级 × 3 类型**完整表（**实测全表可读**） | **按形态类型分组**（逐字「动词按这三种类型分类，以便更容易记住它们」） | ❌ 纯表格 + 练习题 | ❌ | **有分组意识（中文侧最佳）但无场景、无错句回流**；且**分组按「三态同形」，不按元音族** |
| 6 | **大陆教辅（`归类记忆表`，10+ 条实测）** | 中 | **`AAA型/ABA型/ABB型/ABC型` 归类表 + 默写版** | **按形态类型分组**（教辅品类惯例） | ❌ | ❌ | **仍是「表格背诵」**——本批实测 10/10 条标题含「归类记忆表」，**无一条含场景或错句纠错** |
| 7 | **扇贝** | 中 | **首页无任何不规则动词内容**（实测 title 逐字 `扇贝英语 - AI 驱动的英语学习平台｜背单词·阅读·听力口语`） | 推测**词书驱动**（未核实） | ❌ | ❌ | **背单词平台**——不规则形不在其「词」的概念里，**结构性缺位** |
| 8 | **英语兔** | 中 | **首页无任何不规则动词内容**（实测 3 路径 404） | — | ✅「情境口语」产品线 | ❌ | 有「情境」但**语法点组织未知**；不规则过去式未在该站可见内容中出现 |

### 4.1 空位判定的三条硬结论

**① 「场景 + 错句回流」在所有被测产品中是零见 —— 这个组合是真的空位。**
- **英文侧**：Cambridge/BC/OALD **三个源连「场景」都没有**（全是用例句 + 表）；
- **中文侧**：letmeenglish 与全部教辅**是纯表格 + 练习题**（实测 letmeenglish 的练习题是 `I (leave) the house.` 型填空，**与场景无关**）；
- **扇贝/英语兔/可可/沪江**：公开页**完全没有这个语法点**。
- **⇒ 我方「小美的一天」连续剧 + 找错案回流，在这个点上没有对标产品。** 这是**真实差异化**，可以直接写进产品文案。

**② 中文侧**仍然是「表格背诵」**——这条任务书的猜想被实测证实（10/10 条教辅标题含「归类记忆表」）。**
- ⚠️ **但要精确**：中文侧**不是「无组织的表格」**，而是**「按形态类型分组的表格」**（`AAA/ABA/ABB/ABC`）。
- **⇒ 竞品空位的准确表述**：**中文侧已经解决了「怎么把表变小」（分类），没解决「怎么让用户想学、并且在错的时候被打回来」。** 我方不该去跟它比「表做得好不好」，该比「表之外的东西」。

**③ 英文权威侧的空位是「怎么记」——而且缺口是明说的。**
- Cambridge 逐字 **"Each one has to be learnt."** 后面**没有任何方法**；
- BC 逐字给了 **"most common"** 的表**但不说怎么记**；
- **⇒ 上游是「把问题交还给学习者」。** 我方 L10 的 deepDive 已经给了一条机制说明（「它们是英语里最常用的词，用多了自然就记住了」）——**这已经超出上游**。

---

## ⑤ 中文负迁移证据（严格区分「源里明说」与「我的推断」）

**纪律声明**：本节每条都标 `【明说】`（源里逐字写了）或 `【推断】`（我基于证据的推理，源里没写）。**两者不混排。**

### 5.1 【明说】源里明确承认的痛点

| # | 逐字原文 | 源 | URL | 判读 |
|---|---|---|---|---|
| M1 | **「遗憾的是，我们不可能立即识别不规则动词，这使得学习它们变得困难。」** | letmeenglish（中文） | https://letmeenglish.com/zh-hans/irregular-verbs/ | **中文侧自认的核心痛点＝「看不出来」**（无法从原形预测过去式） |
| M2 | **「动词按这三种类型分类，以便更容易记住它们。」** | letmeenglish | 同上 | **自认的解法＝按形态分组**（即中文侧承认「记不住」是问题） |
| M3 | **"Each one has to be learnt."** | Cambridge | https://dictionary.cambridge.org/grammar/british-grammar/past-simple-i-worked | **英文权威侧同样承认「无捷径」** |
| M4 | **"The past forms for irregular verbs are not regular -- you just have to learn them."** | BC 读者评论（署名 Kirk Moore） | https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/irregular-verbs | ⚠️ **【明说】但属读者评论，非 BC 立场**——不可当权威引用 |
| M5 | **「约有 200 个不规则动词」** | letmeenglish | 同上 | 给出规模感知（**我方 L197 deepDive 逐字「它们数量有限」——与源不冲突，但 200 是个不小的数**） |

**⚠️ 关键缺口**：**没有任何一个可访问源明说 `*I swimmed` / `*I feeled` / `*I sitted` 这类具体错形。** Cambridge 的 `Past: typical errors` 页我专门抓了（https://dictionary.cambridge.org/grammar/british-grammar/past-typical-errors ，`curl=200`），**逐字核对后确认：该页 7 条错误全部是时态选择错误（past simple vs past continuous vs present perfect），没有一条是关于误加 -ed 的**：

> `Not: I was walking to school every day …`（该用 past simple 表习惯）
> `Not: I was calling her office at 4 o'clock yesterday afternoon.`
> `Not: I've woken up at seven o'clock this morning.`
> `Not: I didn't pay my electricity bill yet.`
> `Not: He was cycling to Claire's house last night.`
> `Not: We were having picnics in the park in the summer.`
> `Not: If we had known you were alone, we had visited you.`

**⇒ 这是一条重要的负面发现**：**上游权威侧不把「误加 -ed」列为典型错误**（它把重点放在时态选择）。**我方的 `*thinked` / `*knowed` 型错句，在英文权威侧找不到背书。**

### 5.2 【推断】我的推理（源里没写，标注依据强度）

| # | 推断 | 依据（间接） | 强度 | 反证 |
|---|---|---|---|---|
| I1 | **中国学习者最常见的错法是「过度规则化」**（`*swimmed`／`*feeled`／`*sitted`） | ① letmeenglish 明说「不可能立即识别」「这使得学习困难」（M1）；② **中文侧整个教辅品类都在做「归类记忆表」**——若学习者不会过度规则化，就不需要反复强调「哪些不加 -ed」 | **中**（逻辑推论，非实证） | **Cambridge `Past: typical errors` 完全没有这一类错误**（§5.1）——**说明至少在剑桥的语料里，这不是最突出的错误** |
| I2 | **`*I goed` / `*I swimmed` 比「时态选错」更早出现、更易被纠正** | 我方 L10／L11 的 `contrast` 已经用了 `I eated an apple.`／`I buyed some bread.`——**我方内部设计已假定这是主要错法** | **中**（我方既有设计的一致性，非外部证据） | 无 |
| I3 | **中文母语者对不规则过去式的困难主要来自「中文动词不变」**，而非「记不住形式」 | 我方 L10 `oneLineRule` 逐字：「中文动词不变，英语必须变」；上游 any source 无此表述 | **低**（我方已教内容，不是外部源） | 无外部源支持或反对 |
| I4 | **把 `felt` 写成 `*feeled` 的具体错** | **无任何源提及**。我的推理：`feel` 是 A1 高频词 + 过去式是 ABB 型（不规则） | **低**（纯推断） | — |
| I5 | **中文侧「归类」惯例会让学生形成「先判断类型再变」的加工习惯**，与我方「一个词一个词记」的路线冲突 | 依据：letmeenglish 明说「按类型分类，以便更容易记住」（M2）；而 Cambridge 明说 "Each one has to be learnt" | **中**（两源直接对立的推论） | — |

**⇒ 对内容设计的含义**：
- **可以用的**：M1／M2（中文侧承认「识别困难」与「需要分类」）——**支持我们把这个点做成课而不是留给用户自学**。
- **不能用的**：`*swimmed` 类的具体错形**没有权威背书**。**这不意味着我们不该做这些错句**（我方 L197 的 `*thinked`/`*knowed` 效果良好），**但报告里不能写「研究表明中国学生常犯…」**。正确的写法是「**这是我方 L10/L11 已建立的错型家族的自然延伸**」（I2）。

---

## ⑥ 分层建议

### 6.0 先回答「该做几个」

**建议：做 2 课，收 4 个词。**

**理由（三条，均有实测支撑）**：

1. **7 个词在结构上不是一件事。** 按跨源都在用的「三态是否同形」分，7 个词**干净地分成 4 ABB / 3 ABC**：

   ```
   ABB（过去式＝过去分词）: keep→kept, feel→felt, catch→caught, sit→sat  (4)
   ABC（三态各异）        : swim→swam, sing→sang, give→gave            (3)
   ```

   **ABB 组和 ABC 组是两种不同的记忆负担**（ABB 只需记一个形，ABC 要记两个）。**混在一课里会稀释重点。**

2. **「i→a 元音族」这条我原本想用的组织逻辑，中文侧不支持**（§3.3 实测：教辅按「三态同形」分，不按元音变化分）。⇒ **不按元音族拆课**，改按「**形态类型 + 场景**」拆。

3. **7 个词里有 3 个是「L197 的欠条」**（§2.4：L197 deepDive 点名 `gave`/`felt`/`kept` 但零教学位）。**欠条的处理方式最优不是各开一课，而是在已有课上补回流。**

### 6.1 分层：本批 7 个

| 层 | 词 | 处置 | 理由（实测） | 错句设计（**沿用 L197 已验证的错型家族**） |
|---|---|---|---|---|
| **T1 · 立课** | **`swim→swam`、`sing→sang`** | **1 课** | 原形频次**最高两名**（36／41）；同属 **ABC 型**（记忆负担同型）；OALD 均 `a1`；BC「beginner」表内；**语义可同场景**（游泳 + 唱歌 = 一节音乐课/运动会） | `*I swimmed in the pool.`（**注意：letmeenglish 的练习题里恰好有 `We (swim) in the pool on holiday last year.`——天然对切句**）／`*She singed a song.` |
| **T1 · 立课** | **`sit→sat` ＋ `catch→caught`** | **1 课** | 二者都是 **ABB 型**；`sit` 23／`catch` 20；**可同场景**（坐在哪儿 + 接住球 = 操场/球赛）；`catch` 是唯一的 A2（**放后半段正好**） | `*He sitted on the bench.`／`*I catched the ball.` |
| **T2 · 挂靠补回流** | **`feel→felt`** | **不立课**，补进**已有情绪课** | ① 原形 24 处，**但 L197 已点名**（§2.4）——**补回流即可兑现承诺**；② `feel` 的语义（感受）散落在 L76/L78/L131/L132，**没有自然场景位**；③ **ABB 型只需记一个形**，负担低于立课阈值 | 在现有情绪课加 `*I feeled happy.` 型对照卡（**或直接把 L197 的 deepDive 词表改为只列已有教学位的词**） |
| **T2 · 挂靠补回流** | **`keep→kept`、`give→gave`** | **不立课**，补进**已有课** | ① 二者**都在 L197 的欠条名单上**（§2.4）；② `keep` 的原形集中在 **L77/L78 两课**（12+9 处），`give` 集中在 **L63**（14 处）——**各有天然的挂靠点**；③ 都是「换一次形」型，**没有第二条规则要讲** | `*I keeped it.`／`*She gived me a book.`——**挂到 L63（give 双宾）与 L77（keep）上，比立新课更省** |

**⇒ 本批净新增课量 = 2 课，收 4 词；另 3 词以「对照卡 + 兑现 L197 承诺」处置，不占课位。**

**⚠️ 明确拒绝的低价值候选（延续前几批的拒绝纪律）**：

| 候选 | 判定 | 理由 |
|---|---|---|
| **`told`** | **拒绝单独立课** | ① 原形 `tell` 教学位仅 **6 处**（`core` 实测）——**低于本批阈值**；② 它与 `say`（`said` 已教）的对切是**词义辨析**，属 L68 `give` 型「双宾/词义」课的挂靠项，**不是不规则过去式问题**；③ **但它也在 L197 的欠条名单上** ⇒ **该做的是「补回流」，不是「立课」** |
| **`wrote`／`wore`** | **拒绝** | 原形教学位各 **1／0 处**——**原形本身都没教过**，先有原形才有过去式问题（§6.2 层 C） |
| **`slept`** | ⚠️ **本批新发现，但建议观察不立即做** | **`sleep` 教学位 37 处、`slept` 是 0** ——量级与本批 `swim`(36) 同级，**但上游清单漏了它**（§2.3 我的独立清单把它列在 PRD50 之外）。**实测它的 3 处落点全在 `contrast.wrong`／`guided.answer` 的 `slept`**（L98/L102 的 `While I was reading, he slept.`）——**它已经在「错句」位出现过**，性质与 `felt`/`kept` 不同。**建议登记为下一批候选，本批不做**（避免本批从 2 课膨胀到 3 课） |

### 6.2 分层：剩 41 个（实测为 42 个零出现形式）

**⚠️ 先修正一个数**：上游说「剩 41 个」，**按 `core` 口径实测为 42 个**（`thought`/`knew` 已消）。下表**按「原形是否已教」分层**——这才是决定「该不该做」的判据。

**实测数据（`/tmp/irr2/final41.mjs` ＋ `/tmp/irr2/basecheck.mjs`）**：

| 层 | 判据 | 词数 | 词表（逐字） | 建议 |
|---|---|---|---|---|
| **层 A · 原形已教 ≥20（真缺口）** | `core ≥ 20` | **4** | **`sang`(sing 41) · `swam`(swim 36) · `sat`(sit 23) · `caught`(catch 20)** | **＝本批 T1，做** |
| **层 B · 原形有教学位 1–19（次缺口）** | `1 ≤ core < 20` | **1** | **`meant`(mean 1)** | **不做**：原形只教过 1 次，**过去式不是瓶颈** |
| **层 C · 原形教学位 = 0** | `core = 0` | **37** | `brought · taught · paid · sold · sent · grew · flew · began · chose · drove · held · spoke · spent · stood · understood · woke · rode · rose · hid · hurt · cut · hit · set · shut · cost · lent · built · burnt · learnt · threw · blew · lay · laid · led · fed · fought · sought` | **不做（不是语法问题）** |

**层 C 的判定依据（这是本批对「剩 41 个」的核心答复）**：

**这 37 个词的问题不是「过去式没教」，而是「原形没教」。** 实测证据：

```
base           core  anywhere
buy              48       172
sing             41       117
swim             36       129
sit              23        52
catch            20        48
mean              1         1
choose          **0**    **197**   ← 197 是 `kind:"choose"` 字段名假阳性，剔除后为 0
bring             0         3
learn             0         2
begin/blow/build/burn/cost/cut/drive/feed/fight/fly/grow/hide/hit/hold/hurt/
lay/lead/lend/lie/pay/ride/rise/seek/sell/send/set/shut/speak/spend/stand/
teach/throw/understand/wake … 全部 **0**  **0**
```

**⇒ 三条判读**：

1. **层 C 里 34 个词的原形在 `core` 口径下零次出现**——即**用户从未在课程里以正确用法见过 `teach`／`speak`／`hold`／`stand`／`spend`／`pay`／`sell`／`send` 这些词本身**。**给一个没教过的原形补过去式，等于在真空上盖房子。**

2. **层 C 里的「不变化型」（`cut`/`hit`/`set`/`shut`/`cost`/`hurt`）连规则都不用讲**——它们的过去式**就是原形**。**这不是语法点，是词汇事实**：教会 `cut` 这个词，`cut` 的过去式自动解决。**判：词汇问题，不是语法问题。**（依据：Cambridge `Table of irregular verbs` 里 `cut / cut / cut` 是**同一格**，无任何规则；中文侧 `AAA型` 归为一类但**类型名本身即「不用变」**）

3. **层 C 里 `burn`/`learn`/`lend`/`spend` 有英式/美式双形**（`burnt/burned`、`learnt/learned`）——**引入它们会额外引入「两个都对」的分支**，与我方「一个位置一个正确写法」的找错案机制冲突。**判：引入成本高于收益。**

**⇒ 对「剩 41 个」的最终建议**：

> **不要把「剩 41 个」当作一个排期项。** 它里面**只有 4 个是真缺口**（＝本批 T1），**1 个是次缺口**（`meant`），**37 个的前提条件（原形教学位）不成立**。
>
> **真正该单独排的，是一条「词汇线」问题**：库里有 34 个基本动词（`teach`/`speak`/`hold`/`stand`/`pay`/`sell`/`send`/`build`/`fly`/`grow`/`throw`…）**从未出现**。**这是词汇覆盖问题，不是不规则过去式问题。**
>
> **建议处置**：把「原形零出现的 34 个基本动词」**转交词汇线评估**（若产品决策做词汇线），**语法线不再单独为它们排期**。**这样「剩 41 个」从一个吓人的排期项，缩为「4 个该做 + 1 个观察 + 37 个转交」。**

**优先级排序（若产品只想做一个方向）**：
1. **T1 两课**（`swim/sing` ＋ `sit/catch`）——**证据最强、成本最低**
2. **兑现 L197 的 4 个欠条**（`gave`/`told`/`felt`/`kept` 的对照卡）——**成本极低（改数据不改结构）、且是既有承诺**
3. ~~剩 41 个~~ → **拆成「4 个已含在 T1」＋「37 个转词汇线」**——**不再作为语法排期项**

---

## ⑦ 自我核查记录（命令＋输出）

| # | 核查项 | 命令 | 结果 |
|---|---|---|---|
| 1 | 课程/案件总数 | `node /tmp/irr2/load.mjs`（TS 编译器 API 取数组） | **LESSONS 197／CASES 206**，课号 1..197、案号 1..206 无跳号 ✓ |
| 2 | 7 个原形计数（core 口径） | `node /tmp/irr2/FINAL.mjs` | **36/41/33/24/22/20/23 —— 与任务书逐位精确一致** ✓ |
| 3 | 口径穷举（证明口径的重要性） | `node /tmp/irr2/mitm.mjs`（37 字段组 meet-in-the-middle） | 命中 512 个等价子集；**core 是任务书口径** ✓ |
| 4 | 7 个过去式全库零出现？ | `node /tmp/irr2/FINAL.mjs` | `swam/sang/caught/sat` **✅ 真零**；`kept/felt` **各 1 处**；`gave` **4 处** —— **3 处需修正** ⚠️ |
| 5 | 那 1/1/4 处的落点 | `node /tmp/irr2/nature.mjs` | `kept`/`felt` 全在 **L197 deepDive 词名列表**；`gave` = 同一处 ＋ **case#9/#20/#27 题面 token** ✓ |
| 6 | 「50 个零出现」 | `node /tmp/irr2/FINAL.mjs` | **core × L1–195 = 50（精确复现）**；core × L1–197 = 48；every × 现状 = 42 ✓ |
| 7 | PRD50 列表有无假阳性 | `node /tmp/irr2/indep50.mjs`（自建 97 词清单） | **PRD50 是独立零集的严格子集，零假阳性**；我的清单多出 21 个 ✓ |
| 8 | L197 承诺的 10 个词 | `node /tmp/irr2/promise.mjs` | **`gave`/`told`/`felt`/`kept` = 4 个零教学位** ⚠️ **本批最硬新发现** |
| 9 | 「choose」假阳性排查 | `node /tmp/irr2/anom.mjs`（剔除 `kind`/`scene`/`who` 字段） | `choose` 的 197 处**全是 `kind:"choose"` 字段名**，剔除后 **0** ✓ |
| 10 | `bought` 是否已教 | 同上 | **已教**：L11（3 例）＋ L68（整课）＋ 回流案 #77/#202/#205 ✓ |
| 11 | 7 个词的模式分类 | `node /tmp/irr2/plan.mjs` | **ABB 4 个**（keep/feel/catch/sit）／**ABC 3 个**（swim/sing/give）✓ |
| 12 | 原形频次分层（剩 42 个） | `node /tmp/irr2/final41.mjs` | **层 A 4 个／层 B 1 个／层 C 37 个** ✓ |
| 13 | OALD 等级徽章 | `curl` 7 个词条 ＋ 解析 `ox3000="y"` / `ox3ksym_*` / `level=` | `swim/sing/keep/feel/give/sit` = **a1**；`catch` = **a2**（三者一致）✓ |
| 14 | ⚠️ OALD `?level=a1` 词表页是否真的过滤 | `curl '…wordlists/oxford3000-5000?level=a1'`（3.6MB） | **不过滤**：返回 5948 条／4958 唯一词头（= Oxford 3000+5000 全表），页 title `Oxford 3000 and 5000`，每条无等级标记 ⇒ **该证据作废，已在 §3.2 撤回并说明** ⚠️ |
| 15 | Cambridge/BC/OALD 组织方式 | WebFetch ＋ `curl` 直连核对 | **三源全部平铺**；Cambridge 逐字 `Each one has to be learnt.` ✓ |
| 16 | BC 直连可用性 | `curl` 7 路径 | **全部 `HTTP=000`**（与任务书预警一致）；WebFetch 可读 ✓ |
| 17 | Cambridge 直连可用性 | `curl` 2 页 | **`HTTP=200`**（与 BC 不同，可直连）✓ |
| 18 | 中文侧「归类」惯例 | 搜狗 `curl`（200）＋ 逐字解析标题 | **10/10 条标题含「归类记忆表」** ✓ |
| 19 | letmeenglish 全表 | `curl`（**200**）＋ 逐行解析 5 等级 × 3 类型 | 拿到 7 个词在表中**逐字行列**（swim 初级类型 3／catch 初中级类型 2 …）✓ |
| 20 | 「误加 -ed」有无上游背书 | Cambridge `past-typical-errors`（**200**） | **7 条典型错误全是时态选择，零条关于误加 -ed** ⚠️ **负面发现** |

**本批拒绝的方法与原因（记录以免后人重试）**：

| 方法 | 结果 | 放弃原因 |
|---|---|---|
| 用正则解析 39k 行 `grammarLessons.ts` | 两次失败（`Unexpected token`） | `export const grammarLessons: GrammarLesson[] = [` 里的 **`[]` 会被括号扫描先匹配**；且 TS 对象里有 `{` 嵌套与中文引号。**改用 TypeScript 编译器 API 取数组字面量文本再 `eval`** ✓ |
| 本地 `grep` 计数 | 与 node 结果不一致 | 任务书已预警：**本地 grep 是 ugrep，会假返回 0**。**全程未用 grep 计数**，只用它定位文件 |
| 搜狗/必应批量检索中文源 | 部分成功 | **必应把多词中文查询拆成单字**（「不规则动词…」→「不（汉语汉字）_百度百科」）；搜狗**连发 4 次后被 antispider 拦截**；Google/DuckDuckGo `curl` 返回 0 字节。**有效路径＝搜狗单发 + 间隔** |
| 知乎／百度文库／百度百科／七彩学科网 | 全部 403 | curl 与 WebFetch 均 403，**只取得搜狗摘要**（已在报告中标注摘要来源，未冒充原文） |
| 扇贝／可可／沪江／英语兔／多邻国 中文站 首页 | 无相关内容 | 首页只有营销文案（实测逐字）。**未登录无法进课程内部，故 §4 矩阵对这几家标「未核实/推断」** |

---

## ⑧ 抓不到的源与不确定项

### 8.1 按任务书指示「正式登记不可得」（本批未重试）

| 源 | 状态 | 备注 |
|---|---|---|
| **Murphy《Essential Grammar in Use》** | **不可得** | 上批已建议正式登记；本批**按要求不重试** |
| **Murphy《English Grammar in Use》(Intermediate)** | **不可得** | 同上 |
| **Swan《Practical English Usage》** | **不可得** | 同上 |

**⇒ 我这一侧只能提供一条替代**：**OALD 的 Oxford 3000 `level=a1` 徽章**（可直连实测）是一个**比 Murphy 更细的可核验等级依据**——它直接给出「这个词在哪一档」。**若产品需要「教材单元位次」的证据，那仍然缺 Murphy；若只需要「等级依据」，OALD 已足够。**

### 8.2 不确定项（诚实登记）

| # | 不确定项 | 影响 | 我的处置 |
|---|---|---|---|
| **U1** | **上游 `posTexts` 口径复现不出任何一套上报数字**（跑出 110/104/... 而非 36/41 或 77/73） | **中**：说明「上游那个 50」与「上游那个 77/73」来自**至少两套不同脚本**，其中至少一套未留存 | 我**重建了能精确复现任务书 7 个数字的 core 口径**，并在报告中**明确标注口径**。**建议下游凡引用这些数字必须带口径** |
| **U2** | **路线图 §4 那一列（77/73/52/42/41/30/30）本轮无法复现** | **低**：不影响「9 个高价值缺口」的排序与结论 | 已如实登记；两套口径**排序一致**，判定不变 |
| **U3** | **上游说「76 个」分母，实测清单有重复项**（`wore` 出现两次） | **低**：只影响比率表述 | 已在 §2.3 标注，**不去争分母** |
| **U4** | **BC 的逐字全部经 WebFetch（模型转述）** | **中**：BC 三个页面的逐字可靠性低于 Cambridge/OALD（后者可直连 200） | 凡引用 BC 处**已标注「经 WebFetch」**；**BC 的关键结论（平铺、Level: beginner、无专课）与 Cambridge/OALD 独立一致**，故可靠性由交叉印证兜底 |
| **U5** | **BC「Irregular verbs」页的「分组」说法只出现在读者评论里** | **中**：若下游把它当 BC 立场会溯源错误 | 已在 §3.1 与 §5.1/§7 三处**显式标注为读者评论** |
| **U6** | **中文侧只拿到 1 个完整可读源（letmeenglish）＋ 教辅的搜狗摘要** | **中**：`AAA/ABB/ABC` 分类法的证据是**摘要级**（10 条标题 + 3 条摘要），**未读到任何一篇全文** | 已标注为「搜狗摘要」；**结论（中文侧按模式分组）在 10 条独立标题上一致**，但**「按元音族分组不存在」这条只能算弱证据**（未见全文，不能 100% 排除） |
| **U7** | **「误加 -ed 是不是中国学生的主要错法」没有实证源** | **中**：直接影响 §5 与错句设计的论证强度 | **已在 §5.2 全部标为【推断】并给强度评级**。**不得写「研究表明」** |
| **U8** | **竞品课程内部未核实**（扇贝/多邻国/英语兔/可可/沪江的付费内容） | **中**：§4 的空位判定基于**公开可见层** | 已在矩阵中逐行标「未核实/推断」。**「场景 + 错句回流零见」这条结论有实测支撑**（英文侧三源 + 中文侧 1 源 + 4 家首页全无），**但严格说是「公开层零见」** |
| **U9** | **`slept` 是新发现的第 8 个高价值缺口**（`sleep` 37／`slept` 0），上游清单漏了它 | **低**：本批不做，登记 | 已在 §6.1 与 §6.2 标注；**它的 3 处落点在 `contrast.wrong`／`guided.answer`**，性质需下批细查 |
| **U10** | **`letmeenglish` 的 `类型 1/2/3` 与大陆 `AAA/ABA/ABB/ABC` 是两套编号** | **低**：不影响「中文侧按模式分组」结论 | 已在 §3.3 并列两套命名，**未混用** |

### 8.3 给下一批的交接（3 条）

1. **`slept`（U9）**：`sleep` 教学位 37、`slept` 零（但已在 L98/L102 的错句位出现）——**下批第一个要查的词**。
2. **兑现 L197 的 4 个欠条（§2.4）**：这是**成本最低、收益最直接**的一项（改 `deepDive` 词表或补 4 张对照卡，**不动课程结构**）。
3. **「原形零出现的 34 个基本动词」转词汇线评估**（§6.2）——**建议在「词汇线是否单独立项」的决策里一并处理**（该决策已延续多批待办）。

---

**报告结束**。本批共核实 3 组上游数字（7 个原形／7 个过去式／50 个零出现），**修正 3 处「零出现」表述、1 处口径表述（「含错侧」不成立）、1 处分母**，新发现 **L197 的 4 词欠条** 与 **`slept` 第 8 缺口**，并给出**跨源位次表（7 词 × 4 源）**与**分层建议（本批 2 课 4 词／剩 42 个拆为 4+1+37）**。
