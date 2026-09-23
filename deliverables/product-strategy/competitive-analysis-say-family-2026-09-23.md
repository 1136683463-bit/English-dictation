# 竞品与外部权威源分析 · 第 49 批：`say` 家族的形状不均衡

**项目**：英语听写 / 语法课 App（`/Users/liujun/Documents/英语听写`）
**批次**：第 49 批　**日期**：2026-09-23
**角色**：竞析（竞品与外部权威源）
**数据基线**：`src/data/grammarLessons.ts` **204 课**；`src/data/huntCases.ts` **213 案**

**主核查脚本**（只读，不改任何数据）：

| 脚本 | 用途 | 运行方式 |
|---|---|---|
| `/tmp/sayfam/load.mjs` | 数据加载器（从 `.ts` 里做括号配对抽出数组字面量，越过 `import coverN` 依赖）| `node -e "import('/tmp/sayfam/load.mjs')…"` |
| `/tmp/sayfam/verify.mjs` | `say/says/said` 三形状 × 正/错/排除 三侧计数 + 逐槽台账 + 口径敏感性 | `node /tmp/sayfam/verify.mjs` |
| `/tmp/sayfam/verify2.mjs` | `guided.options` 毛刺 + L38 结构档案 + `comparison` 13 处 | 同上 |
| `/tmp/sayfam/verify3.mjs` | `IRREGULAR_PAST` 49 对逐项复核 + L190–L204 结构 | 同上 |
| `/tmp/sayfam/verify4.mjs` | 批四十八注释「18 项」逐字对账 + 找错案 | 同上 |
| `/tmp/sayfam/verify5-7.mjs` | 案 29/33/47 档案 + 卡片预算 + **用户产出位 vs NPC 搭台位** | 同上 |

> **脚本位置说明**：本批脚本落在 `/tmp/sayfam/`（临时目录）而非 `deliverables/`，与批四十七/四十八的惯例不同。若要长期可复跑，建议迁到 `deliverables/product-strategy/`。

---

## ① 结论摘要

**1. 数字复核 —— 三行表全部逐字复现。**

| 形式 | 正侧 | 错侧 | 任务书 | 一致 |
|---|---|---|---|---|
| `say` | **2** | **5** | 2 / 5 | ✅ |
| `says` | **21** | **4** | 21 / 4 | ✅ |
| `said` | **1** | **3** | 1 / 3 | ✅ |

口径与批四十七/四十八完全一致（Node 词边界正则 `(?<![A-Za-z-])W(?![A-Za-z-])`，`gi`；正侧 10 个答案键槽位 / 错侧 3 个被判错槽位 / 其余排除）。**但我必须指出这批数字里有一处「形状（shape）」与「用法（usage）」的混同**——见结论 3。

**2. 判定 ——（a）不处理。不立课、不加卡、不挂靠、不改任何数据。**
理由集中在一点：**这个不均衡不是缺陷，而是「一张课的主句子就只有一个形状」的必然结果。** `says` 的 21 处正例里有 **19 处（90.5%）在 L38 一课之内**，且这 19 处是**同一句 `She says she will come.` 在 8 个槽位上的复现**（§3.2）。`say` 的 2 处零散正例（L7 `Say cheese!`、L140 `Say it another way?`）与 `said` 的 1 处（L105 `Your mom said no?`）都是 **NPC 搭台台词**，不是教学样本。**「正侧某个形状多、另一个少」在单主角句的课程结构下是恒真命题，它不承载任何信息。**

**3. ⚠️ 但核查过程中发现了本批真正值得报的一件事 ——「错侧」的数字被读错了。**
任务书表格里 `says` 错侧 **4** 处，直觉读法是「`says` 这个形状被用错 4 次」。**逐处核对后，这个读法不成立**（§2.4）：

| 槽位 | 句子 | `says` 是错的那一点吗 |
|---|---|---|
| L38 contrast[0].wrong | `She says she will comes.` | ❌ 不是——**标的是 `comes`**，`says` 原样出现在正确句里 |
| L38 contrast[2].wrong | `She says she come.` | ❌ 不是——标的是 `come` |
| L38 contrast[5].wrong | `She says she will coming.` | ❌ 不是——标的是 `coming` |
| L38 guided.options | `She says` | ❌ 不是——**`She says` 就是这道题的标准答案**（`options[0]`，`answer="She says"`）|

**⇒ `says` 的「真错用量」是 0，不是 4。** 台账值 4 全部是「`says` 恰好出现在一个含错的句子里」或「`says` 是正确选项」。**这不是数据错误，是口径必须说清楚的地方**——同一件事在批四十七也出现过（`lose`/`break` 因 `spot.answer` 口径被误判），本批是它在一个新维度上的重演。**⇒ 若任务书表格的「错侧」列被用来判断「哪个形状更危险」，会得出与事实相反的结论：`says` 恰恰是全库**唯一零错用**的形状。**

**4. `said` 该并入哪一族 —— 并入 L197–L204「昨天版」那一族，且不必新写内容。**
跨源证据在这一条上**高度一致且方向明确**：**`said` 在英文教学里是作为不规则过去式表的一行教的，不是作为转述的一部分教的**（§5.2，逐字引用 5 处）。三处硬证据：
- **Cambridge `Table of irregular verbs`** 逐字列出 `say said said`（`/grammar/british-grammar/irregular-verbs`）；
- **BC `Irregular verbs`**（页面标 **`Level: beginner`**）逐字列出 `say | said | said`，且**全页不提 reported speech**；
- **OALD `say` 词条**的 Verb Forms 行把三形状一次给全：`present simple I/you/we/they say /seɪ/ · he/she/it says /sez/ · past simple said /sed/ · past participle said /sed/`（注意 `says` 的音标 **/sez/**，是全库唯一会把三形状并置的权威位置）。

**⇒ 结论：`said` 属于 L197–L204 那一族（按「不规则过去式」教），不属于 L38（按「转述」教）。** 但**本批仍建议不处理**——因为**它已经生效了**：案 29（`hunt-homework-note`，挂靠 L21）里 `say→said` 已经是一处 `tense` 错点，用户在那里**必须亲手把 `said` 改出来**（§4.4），`IRREGULAR_PAST` 表里 `say: "said"` 也早已在册。**`said` 有正侧产出位、有错误处置位、有判定表覆盖——它是一个已被覆盖的形状，不缺口。**

**5. 与 L197–L204 那一族的关系 —— 有一处真实的**体量**落差，但它由「那一族自己的课程设计」解释，不需要为 `said` 破例。**
把 `said` 的正侧基数（**1**）放进那一族的横向对照表，差距是悬殊的（§4.3）：`felt` 35 / `gave` 35 / `drew` 22 / `wore` 21 / `slept` 21 / `kept` 20 / `thought` 19 / `swam` 18 / `sang` 18 / `sat` 18 / `caught` 18 / `knew` 17 …… **`said` 1**。**原因不是 `said` 被漏掉，而是 L197–L204 那八课每一课都是「以两个过去式为主角、正侧全课围绕它们铺开」的专课**（每课主角句如 `I thought about it and knew the answer.` / `We swam in the water and sang together.`），而 `said` **从未当过任何一课的主角**。**⇒ 要让 `said` 的正侧基数从 1 涨到 17+，需要的不是加一张卡，是给它一节专课——而那正是「立新课」，本批已判定不做（§3.4）。**

**6. 上批三处成果 —— 三处全部生效，但第三处的注释数字有一处错标（很小，可顺手改）。**

| 上批成果 | 独立复核结果 |
|---|---|
| ① `comparison` 错标修正 13 处（0 → 13）| ✅ **生效且是真改判**。13 处**全部是同一错点的 `tag` 改写**（`original`/`correction` 逐字不变），不是新增错点；覆盖 8 个案件、7 个案件挂在比较课上（§8.1）|
| ② L38 补「跟谁说」两张卡 | ✅ **生效**。`She said me she will come.`（错卡，标 `said`）＋ `She said to me she will come.`（双正解卡，`wrongMark=null`）都在；L38 对照卡 6 → 8 张（§8.2）|
| ③ `IRREGULAR_PAST` 加注说明 18 项永不触发 | ⚠️ **注已加，但「18 项」这个数字**把两项算错了归属**。注释括号里列的 18 个过去式里，**`told` 与 `brought` 属于「原有 17 项」那一批，不属于批四十四补的 32 项**；32 项里三侧全零的是 **16 项**，不是 18（§8.3）|

**⇒ 而且我实测出一个比「16 vs 18」重要得多的事实：真正永不触发的不是 18 对、也不是 49 对里的 44 对，而是「按判定条件的真正前置条件」算，`IRREGULAR_PAST` 49 对里只有 5 对能触发（§8.4）。**

**7. 顺带查出一个上批未发现的量级问题（本批最有价值的副产品）。**
`IRREGULAR_PAST` 的触发前提是「**该关卡 `sampleAnswer` 里含这个过去式**」（`languageGateService` 逐字：`const sampleHasPast = sampleTokens.includes(past)`）。全库 6 个 gate 脚本共 **50 条 `sampleAnswer`**，其中含过去时间词的只有 **6 条**。逐对核算后：**49 对里只有 5 对（`come→came` / `go→went` / `arrive→arrived` / `take→took` / `buy→bought`）能同时满足「sample 含该过去式」＋「sample 含过去时间词」⇒ 真正永不触发的是 44 对，占表的 89.8%。**
**⇒ 这不是缺陷**（那条判定的**设计意图**就是「只对已经出现过的过去式报警」，表超前是无害的），**但它的量级比批四十八注释里写的「18 项」大一个档，注释的口径该按这个改写。**

**8. 跨源位次 —— `say`/`says`/`said` 三形状的**区分**在四侧都是空白，但这是一个「没人做过」而不是「做了做不好」的空位。**
英文权威侧把三形状**并置**的位置只有一个：**词典词条的 Verb Forms 行**（OALD / Cambridge 的中英两侧都是这样，iciba / youdao 的「词态变化」块也是这样）。**没有任何一个源把「say / says / said 三个形状怎么区分」当成一个独立教学点**——Cambridge 有 `Say or tell?` 专页、Oxford 有两个词条各一份 `Which Word? say / tell` 注框、Perfect English Grammar 有 `HOW TO USE 'SAY' AND 'TELL'` 页，**它们的对立轴全是 `say` vs `tell`（选哪个词），没有一个是 `says` vs `say` vs `said`（同一个词的三个形状）**（§6.2）。
**⇒ 但我必须诚实地把这个空位降级**：三形状的区分在英语里**几乎不构成认知负担**（`says` 只是加 -s，`said` 只是不规则过去式，各自归属一条已有的通用规则），**所以「没人做」大概率是因为「不值得单独做」，而不是「做不到」。** 这与批四十八 `tell` 那一条的诚实说明是同一种纪律（§6.4）。

**9. 中文负迁移 —— 中文侧**明说**的头号陷阱是 `*say someone something`（不是三形状混淆），且我方尚未设防这一侧的对偶（`*say me`）。**
`english.cool` 逐字：**「say 後面如果要接『對誰說』，必須先加 to，寫成「say something to someone」。不可以直接寫「say someone something」，這是中文「跟我說」直接翻過去最容易犯的錯」**（§7.1）。
**⚠️ 这一处的防错我上批已经判过、批四十八也已落卡**（L38 contrast[6]，标 `said`）。**但中文侧点的是 `say`（现在时），我方落的是 `said`（过去时）**——两者是同一陷阱的两个时态外壳，**已设防，方向正确**。
**⇒ 「三形状混淆」这个中文侧痛点，我全线检索后没有找到任何源明说**（§7.3）——**因此本批不把它当作已证实的负迁移，只记为「我的推断」。**

---

## ② `say` 家族数字复核（含口径与脚本）

### 2.0 口径说明 —— 先定口径，再报数

**匹配**：** Node 词边界正则**（任务书要求，**不用 grep**）：

```js
const rx = (w) => new RegExp(`(?<![A-Za-z-])${w}(?![A-Za-z-])`, 'gi');
```
- 前后各加一个**非字母非连字符**的守卫：`[A-Za-z-]` 排除掉 `says` 里的 `say`、`saying` 里的 `say`，同时**允许** `say,` / `say.` / `say!` 这类带标点的情况。
- **必须 `i`（忽略大小写）**：本项目正句常句首大写（`Say cheese!` 在 `dialogue[1]`、`Say it another way?` 在 `dialogue[0]`）。

**三侧划分**（与批四十七 `gave` / 批四十八 `told` 口径**逐条一致**，可复现）：

| 侧 | 槽位（键名） | 理由 |
|---|---|---|
| **正侧 `pos`**（10 键）| `targetSentence` / `dialogueEn` / `examples.en` / `dialogue.en` / `contrast.correct` / `variants.en` / `sceneSwings.en` / `guided.answer`（**非 spot**） / `practice.answer` / `recall.answer` | 全部是**用户被要求产出的正确英语** |
| **错侧 `neg`**（3 键）| `contrast.wrong`（**仅 `bothRight≠true` 的真错卡**） / `guided.options` / `practice.distractors` | 全部是**被判错的英语** |
| **排除 `excluded`** | `spot.answer` / `spot.tokens` / `guided.wrongToken` / `bothRight` 卡的 `wrong` / `blocks.text` / `summary.points` / `summary.rule` / `oneLineRule` / `guided.tokens` / `guided.replaceBase` / `guided.before` / `guided.after` / `practice.tokens` / `contrast.wrongMark` / 所有讲解文本（`explain` / `whyZh` / `noteZh` / `deepDive`）| 见下 |

**四条排除口径的理由**：
1. **`spot` 题的 `answer` 不计正侧**（批四十四确立、批四十八重申）：`spot` 的 `answer` **就是那个错词块**——`types.ts:533` 逐字：「`spot`：藏了问题的那个词块（命中即通过）」。**把它算正侧等于把错误算成正确用法。**
2. **`bothRight` 卡的 `wrong` 不计错侧**：该字段**装的是正确句**。`types.ts:586` 逐字：「**`bothRight: true` + `wrongMark` 无值：498 张（双正解卡——注意它的 `wrong` 字段装的是正确句）**」。
3. **`blocks[].text` / 拼装 `tokens` / `summary` / `oneLineRule` 不计**：它们是**展示与讲解**，不是「用户产出」也不是「被告知错了」。
4. **`contrast.wrongMark` 与讲解文本是「同一处错误的第二次记录」**：`wrongMark` 是被标词、`whyZh`/`explain` 是讲解——**它们与所属卡/题是同一件事，重复计入会让「一处错误算成 2-3 处」**。批四十八把 `wrongMark` 单列在错侧，本批**进一步把它移到排除**，理由见 §2.5 的口径敏感性实测。

### 2.1 核查 0 · 基线（脚本实测输出）

```
grammarLessons   204 课
contrast 卡      1228 张
  ├ 真错卡(bothRight≠true) 726
  └ bothRight 双正解卡      502
guided 题        1223（其中 spot 204）
practice 题      1047
huntCases        213 案
槽位：正侧 6593 / 错侧 3017 / 排除 8008
```

> **对账**：批四十八实测 `contrast` **1226** 张（真错 725 + 双正解 501），本批 **1228** / 726 / 502。**差值 +2 张，正是批四十八为 L38 补的两张卡**（§8.2）。`types.ts` 注释里仍写 **670 / 498 / 52**，是批四十七时代的旧数字，**已落后两批**。

### 2.2 核查 1 · 主表：复现任务书三行表

```
形式      正侧   错侧    任务书    一致?
say         2      5     2/5     ✅
says       21      4    21/4     ✅
said        1      3     1/3     ✅
```

**三行全部逐字复现。** 口径可敏感性见 §2.5。

### 2.3 逐槽台账（正侧）

```
--- say 正侧 2 处 ---
  L  7 dialogue.en        "Say cheese!"
  L140 dialogue.en        "Say it another way?"

--- says 正侧 21 处 ---
  L 38 targetSentence     "She says she will come."
  L 38 examples.en        "She says she will come."
  L 38 examples.en        "She says she is busy."
  L 38 examples.en        "She says she will run."
  L 38 dialogue.en        "She says she will come."
  L 38 contrast.correct   "She says she will come."   ×6（卡 0/2/3/5/6/7）
  L 38 variants.en        "She says she will come."
  L 38 sceneSwings.en     "She says she will come."
  L 38 guided.answer      "She says"                    ← choose 题
  L 38 guided.answer      "She says she will come."     ← arrange 题
  L 38 practice.answer    "She says she will come."
  L 38 practice.answer    "She says she is going to run."
  L 38 recall.answer      "She says she will come."
  L 41 examples.en        "She says she likes the book which I read."
  L 41 sceneSwings.en     "She says she likes the book which I read."
  L181 dialogue.en        "The clock says eight!"

--- said 正侧 1 处 ---
  L105 dialogue.en        "Your mom said no?"
```

**⇒ 关键结构事实：`says` 的 21 处里 19 处在 L38，且这 19 处是同一句 `She says she will come.` 在 8 类槽位上的复现。** 剩下 2 处：L41 一处（「收口课」，两句话拼一句）、L181 一处（`The clock says eight!`——**这里的 `says` 是「钟面显示」的意思，不是转述**，即它根本不是同一个语法点）。

### 2.4 ★ 逐槽台账（错侧）＋「该形状是不是错的那一点」

```
--- say 错侧 5 处 ---
  L 38 contrast.wrong.real  "She say she will come."            ✅ 真错（wrongMark="say"）
  L 38 guided.options       "She say"                            ✅ 真错（干扰项）
  L 38 practice.distractors "say"                                ✅ 真错（干扰项）
  L136 guided.options       "I am looking forward to say goodbye."   ✅ 真错（干扰项）
  L136 practice.distractors "say"                                ✅ 真错（干扰项）
  ⇒ 真错用 5 / 台账 5　（100%）

--- says 错侧 4 处 ---
  L 38 contrast.wrong.real  "She says she will comes."          ❌ 标的是 comes，says 是对的
  L 38 contrast.wrong.real  "She says she come."                ❌ 标的是 come
  L 38 contrast.wrong.real  "She says she will coming."         ❌ 标的是 coming
  L 38 guided.options       "She says"                           ❌ 这就是该题标准答案（options[0]）
  ⇒ 真错用 0 / 台账 4　（0%）

--- said 错侧 3 处 ---
  L 38 contrast.wrong.real  "She said me she will come."        ✅ 真错（wrongMark="said"）
  L 38 guided.options       "She said"                           ✅ 真错（干扰项）
  L136 guided.options       "I am looking forward to said goodbye."  ✅ 真错（干扰项）
  ⇒ 真错用 3 / 台账 3　（100%）
```

**⇒ 这就是结论 3。** 台账值相等不代表性质相等。**`says` 是全库唯一「零真错用」的形状**——它的 4 处台账命中全部是「`says` 出现在一个含别的错的句子里」或「`says` 本身就是正确答案」，是**共现（co-occurrence）**，不是**错误（error）**。
- **为什么 `says` 会零真错用**：因为 L38 是 `says` 的主场，**而 L38 的 8 张卡里有 4 张在打从句动词**（`comes`/`come`/`comes`/`coming`，§3.2）——**卡片资源被从句问题占掉了**，`says` 本身只分到 1 张（contrast[3] `She say she will come.`）。
- **为什么 `say` 的错误处置反而最密（5 处）**：因为 `say` 的错误出现在**两课**——L38 的 `She say`（三单 -s 漏了）与 L136 的 `to say`（`look forward to` 后面该用 -ing）。**这是两个完全不同的知识点，只是恰巧都落在 `say` 这个原形上。**

### 2.5 口径敏感性 —— 换口径会不会改变结论

**正侧**（含 `guided.replaceBase` 与否对本批无影响，因为 `say/says/said` 在 `replaceBase` 里 0 命中）：

```
词     POS(不含replaceBase)   POS(含)   含 blocks/summary/tokens
say             2               2                 9
says           21              21                38
said            1               1                 6
```
**⇒ 正侧数字稳健**：三形状都不受 `replaceBase` 影响；若把展示与讲解也计入，则膨胀到 9/38/6——**但没有一个口径能让 `said` 超过 `say`**，主表结论不变。

**错侧**：

```
口径                                          say  says  said
N-本批 = wrong.real + options + distractors     5    4     3   ← 任务书口径
N + wrongMark                                   6    4     4
N + spot.tokens                                 5    5     3
N + wrongToken                                  5    4     3
N + spot.answer                                 5    4     3
N + options 全部候选（含正解）                    6    5     4
```
**⇒ 错侧数字不稳健——它随口径漂移。** 但**漂移的方向是一致的：`says` 始终最低或并列最低**。这与 §2.4 的性质判断吻合并互相支持。**⚠️ 反过来说：`N + options 全部候选` 这个口径是错的**（它把正确答案算进了错侧），**而任务书的 5/4/3 恰好用的是「options 全算」这一支**——所以 `says=4` 与 `said=3` 里各含 1 个「正解被当错侧」的计数。**这不是任务书的错，是这一口径本身需要加一句注。**

**`guided.options` 毛刺的全库规模**（脚本实测）：**408 道题的 `options` 数组里含「正确答案本身」**（如 `L1 choose answer="am" options=["am","is","are"]`）。**⇒ 这不是个别现象，是全库 408/1223 = 33.4% 的题的共同形态。** 命中 `say` 家族的 2 道（`L38 choose`、`L136 replace`）都属此类。
**⇒ 建议：以后任何「错侧」统计都应把 `guided.options` 拆成「干扰项（`options` 去掉 `answer`）」与「正确答案项」两栏，否则同一个数字会被两种读法撕开。**（§10 记为待办）

---

## ③ 判定与理由

### 3.1 先回答「这个不均衡是什么造成的」

把三形状按**功能位**拆开（脚本核查 26）：

| 形状 | 主角句 | 用户必须产出（guided/practice/recall 的 `answer`）| 对照卡 `correct` 侧 | 台词（`me` = 用户说）| 台词（`npc`）| 找错案里作为错词 | 找错案里作为正解 |
|---|---|---|---|---|---|---|---|
| `say` | **0** | **0** ★ | **0** | **0** | L7, L140 | 案29(`say→said`)、案47(`say→says`)| **0** |
| `says` | **1**（L38）| **1**（L38）| **6** | **1**（L38）| L181 | **0** | 案47(`say→says`)|
| `said` | **0** | **0** ★ | **0** | **0** | L105 | **0** | 案29(`say→said`)|

**⇒ 三条结构性事实：**
1. **三形状的正侧分布完全由「谁当过主角」决定。** `says` 有 21 处，是因为它是 L38 主角句的动词；`say`/`said` 各 2/1 处，是因为它们**从未当过主角**，只能靠台词偶然出现。
2. **`say` 与 `said` 都「用户产出位 = 0」**（没有任何一题要求用户打出 `say` 或 `said`），**`said` 还有一个额外的补偿通道**：案 29 要求用户把 `say` 改成 `said`（§4.4）——**`say` 连这个都没有**（案 29/47 里 `say` 都是**错词侧**，用户要做的是把它改掉，不是产出它）。
3. **`say` 的 2 处正例都是 NPC 台词**（`Say cheese!` 是班长喊的、`Say it another way?` 是妈妈说的），**用户角色（`who="me"`）从不产出 `say`**。

**⇒ 结论：这个不均衡不是「教学缺口」，而是「单主角句课程结构」在词形维度上的投影。** 一处偏多的形状 = 它是某课主角；一处偏少的形状 = 它没当过主角。**任务书表格里的 2/21/1，本质上是在问「`say` 家族里谁当过主角」——答案就是 `says`，且只有 `says`。**

### 3.2 L38 已有 8 张卡的边际教学价值评估（本批的核心权衡）

**这张账要先算清 L38 的 8 张卡在讲什么**：

| # | 打的错 | `wrongMark` | 讲的是 |
|---|---|---|---|
| 0 | `She says she will comes.` | `comes` | **从句动词**（will + 原样）|
| 1 | `I think she will not come.` | `not` | 否定搬家 |
| 2 | `She says she come.` | `come` | **从句动词**（要带 will）|
| 3 | `She say she will come.` | `say` | **主句动词的 -s** |
| 4 | `Do you think she will comes?` | `comes` | **从句动词**（问句里也不变）|
| 5 | `She says she will coming.` | `coming` | **从句动词**（-ing 不行）|
| 6 | `She said me she will come.` | `said` | **跟谁说**（上批新增）|
| 7 | `She said to me she will come.` | — | **跟谁说**·双正解（上批新增）|

**⇒ 8 张里 4 张（0/2/4/5）在打同一件事：从句动词穿原样。** 这是一个**真实的冗余**，但它有正当理由——`comes`/`come`/`coming` 是同一个规则下的三种具体错法（多 -s、缺 will、-ing），**分开列是为了让用户见过规则的三个面**。
**⇒ 真正给「形状」的卡只有 1 张（#3，`She say` → 三单 -s）**，加上上批两张覆盖 `said` 的「跟谁说」。

**边际教学价值判断（本批的核心问题）：**

| 维度 | 再加一张 `said` 形态卡的收益 | 再加一张 `say` 形态卡的收益 |
|---|---|---|
| **多掌握一个形状？** | **否**——`said` 是不规则过去式，与 L38 的「转述」知识点**不同族**（§5）。**在 L38 教 `said` 的形态，等于在数学课上教地理** | **否**——`say`（原形/复数主语）与 `says`（三单）的区分**已经在卡 #3 教了**（`She say` → `She says`）。再加「`say` 什么时候用」= 加一张讲「I/you/we/they 用原形」的卡，**这是 L1–L9 就教完的东西**（`be` 动词那几课） |
| **成本（用户多看一张卡）** | 1 张卡（L38 从 8 → 9 张）| 1 张卡 |
| **风险** | **有**——`said` 出现在 L38 但讲的是**过去时**，而 L38 的主角句是**现在时** `She says`。**同一课里既用 `says` 又讲 `said` 会制造「到底用哪个」的混淆**，而「用哪个」正是 L38 不该承担的（它的知识点是「原话照装」） | **有**——会把 L38 的知识点拉向「动词变位」，偏离「转述」 |
| **替代路径** | **已存在**：案 29 让用户亲手改出 `said`（§4.4）| **不存在**，但 `say` 的「用户产出位 = 0」**不是缺口**——`Say cheese!` / `Say it another way?` 是**固定说法（formulaic）**，用户不需要「学会产出 `say`」，只需要**认得**它 |
| **结论** | **不加** | **不加** |

**⇒ 判定：L38 的 8 张卡是「满的」，且第 9 张该不该加取决于它是否服务 L38 的知识点。`said` 的形态不服务「转述」，`say` 的原形不服务「新知识」——两张都不该加。**

**附带的结构证据**：L38 的 `contrast` 张数 **8 张 = 全库最高**（全库 204 课里 **201 课是 6 张**、2 课是 7 张、**只有 L38 是 8 张**，§8.5）。**它已经突破了本项目的默认卡数上限。** 内容总量（32 条）排全库第 7。**⇒ L38 不是「还能再塞一张」的课，它是全库最满的课之一。**

### 3.3 立新课（选项 c）的评估

**成本**：一节完整的课需要 `targetSentence` / `blocks` / `examples` / `dialogue` / `contrast`×6 / `variants` / `sceneSwings` / `recall` / `guided`×6 / `practice`×4 / `huntCaseIds`（L38 的模板共 32 条内容），**且必须通过全部守门测试**（零术语红线、D 层可抄率、新句微调检测、难度断崖——上一课 L37 与本课的单句最长词数差不得超过 5 词）。
**收益**：让 `said` 或 `say` 的「正侧基数」从 1 或 2 涨到 17+。
**⇒ 但收益的计量单位是错的。** 「正侧基数」是**结构指标**，不是**学习指标**。`said` 的问题不是「出现得少」，而是「用户能不能在需要时说对」——**而这一条已经由案 29 覆盖**（§4.4）。**⇒ 立新课（不做）。**

### 3.4 结论

**（a）不处理。不立课、不挂靠、不加卡、不改数据。** 三条理由：
1. **不均衡是结构投影，不是缺陷**（§3.1）——「谁当过主角」决定了形状分布，单主角句的课表下这是恒真命题。
2. **L38 已满**（8 张，全库最高；内容量全库第 7），第 9 张的边际收益不足以抵消「同一课混入过去时」的混淆风险（§3.2）。
3. **`said` 与 `say` 的关键缺口已被别的机制覆盖**：`said` → 案 29 的 `tense` 错点 + `IRREGULAR_PAST` 表；`say` → 案 47 的 `sv_agreement` 错点 + L38 卡 #3（§4.4、§4.5）。

**本批唯一建议落地的两处小改（都不涉及内容生产）**：
- **建议 A（注释口径）**：`languageGateService.IRREGULAR_PAST` 的批四十八注里「18 项」应改为「**32 项里的 16 项 + 原有 17 项里的 2 项**」，并把真正的触发口径补上——**按 `sampleAnswer` 前置条件算，49 对里只有 5 对可触发**（§8.4）。
- **建议 B（统计口径）**：以后「错侧」统计把 `guided.options` 拆成「干扰项」与「正确项」两栏（§2.5），否则 `says = 0 真错用` 会被读成 `says = 4 错用`。

---

## ④ 与 L197–L204 那一族的关系

### 4.1 那一族是什么

```
L197 「昨天的老朋友 · 有些词的昨天版要单独记」  I thought about it and knew the answer.
L198 「昨天版换零件 · swim 变 swam、sing 变 sang」 We swam in the water and sang together.
L199 「昨天版 · sit 变 sat、catch 变 caught」   I sat next to her and caught the bus.
L200 「昨天版 · feel 变 felt、keep 变 kept」    I felt cold in the snow, but I kept reading.
L201 「昨天版 · sleep 变 slept」                I slept well last night, so I felt great this morning.
L202 「昨天版 · draw 变 drew」                  I drew a picture of the boat and put it on the wall.
L203 「昨天版 · wear 变 wore」                  I wore my new hat yesterday, and I want to wear it again today.
L204 「昨天版 · give 变 gave」                  I gave her the book, and she gave me a big cake.
```
**⇒ 八课，每课以 1–2 个不规则过去式为主角，每课 6 张对照卡。** 起点是 L197 的 `deepDive` 逐字：「**但英语里最常说的那几十个动词偏偏不听话——它们是英语里最老的词，老到还没形成「加 -ed」这套规矩的时候就在用了，所以各留各的样子。**」以及「**这一批只能一个个记，没有捷径。**」

### 4.2 跨源站位：`said` 属于这一族（证据见 §5.2）

**这是本批在外部源上最清楚的一条。** 三个源**都把 `said` 放在不规则过去式表里**，**没有一个把 `said` 放进 reported speech 的教学页**：
- Cambridge `Table of irregular verbs`：`… run ran run · **say said said** · see saw seen …`
- BC `Irregular verbs`（`Level: beginner`）：表里 `**say | said | said**`；**该页不提 reported speech**
- BC `Reported speech`（`Level: intermediate`）**用 `said`**（如 `Andrew said that…`）**但那一页是在教「时态怎么退」**，不是在讲 `said` 这个形状怎么来

**⇒ 归属明确：`said` 该并入 L197–L204 那一族（按「不规则过去式」教）。** 但**「并入哪一族」与「要不要现在做」是两个问题**——本批对第二个问题的答案是「不做」，理由见 §4.4。

### 4.3 那一族的横向体量对照（正侧基数）

| 过去式 | 正侧 | 错侧 | 所在课 |
|---|---|---|---|
| `felt` | **35** | 7 | L200, L201 |
| `gave` | **35** | 10 | L204 |
| `drew` | **22** | 8 | L202 |
| `wore` | **21** | 4 | L203 |
| `slept` | **21** | 11 | L201 |
| `kept` | **20** | 2 | L200, L201 |
| `thought` | **19** | 4 | L197 |
| `swam` | **18** | 6 | L198 |
| `sang` | **18** | 1 | L198 |
| `sat` | **18** | 3 | L199 |
| `caught` | **18** | 3 | L199 |
| `knew` | **17** | 2 | L197 |
| **`said`** | **1** | 3 | L105（`Your mom said no?`）|
| `told` | **0** | 0 | （零）|

**⇒ 差距悬殊（1 vs 17–35），但成因清楚**：那一族每课的正侧 18+ 是「**整课围绕两个过去式铺开**」的结果（主角句 + 5 例 + 6 对照卡正句 + 3 变体 + 3 场景变奏 + 6 guided 答案 + 4 practice 答案 + recall 答案都含这两个形式）。**`said` 从未当过主角，所以它只拿到台词位那 1 处。**
**⇒ 「`said` 该不该有专课」=「`said` 该不该当主角」**。而这一判断的答案在跨源上是**中性的**（源把它当表里一行，不强推为专课），在库内是**已被覆盖的**（§4.4）。

### 4.4 `said` 已被覆盖的三条证据（这是「不做」的关键）

**① 用户必须亲手产出 `said`**：案 29 `hunt-homework-note`（「书包里的字条」，挂靠 L21「做过了 · have + 做过版」）第 16 号错点：
```
tokens[16] = "say"
→ tag: "tense"     original: "say"     correction: "said"
→ explanation 逐字：「Yesterday 说的是昨天的事，动词要换昨天版：say → said。」
```
**⇒ 这不是「出现过」，是「用户被判错、必须改成 `said`」——一个真实的正侧产出位。**

**② `IRREGULAR_PAST` 表已含 `say: "said"`**（`src/services/languageGateService.ts:36`），即判定引擎在「该用过去式却用了原形」时**已经认识 `said`**——不需要补表。

**③ 案 33 `hunt-weekend-note`** 的 `tokens[31] = "said"`——它作为**正确用法**出现在案文里（不是错点），是 `said` 的认读位。

**⇒ 三条合起来：`said` 有产出位（案29）、有认读位（案33）、有判定表覆盖（`IRREGULAR_PAST`）。它不缺口。** 缺的只是「正侧基数大」这一**结构指标**——而结构指标本身不是目标。

### 4.5 `say`（原形）的覆盖情况

| 通道 | 有吗 |
|---|---|
| 主角句 | ❌ 0 课 |
| 用户产出位（guided/practice/recall 的答案）| ❌ 0 |
| 对照卡 correct 侧 | ❌ 0 |
| 认读位（NPC 台词）| ✅ L7 `Say cheese!` / L140 `Say it another way?` |
| 找错案里作为错词 | ✅ 案 29（`say→said`，tense）、案 47（`say→says`，sv_agreement）|
| 找错案里作为正解 | ❌ 0 |
| **「`say` vs `says` 的区分」被教过吗** | ✅ **L38 对照卡 #3** 逐字：`She say she will come.` → 标 `say` → whyZh「句首那个「谁」She 是他/她/它版，**say 要加 -s**：She says。」|
| **「`say` vs `said` 的区分」被教过吗** | ⚠️ **只在案 29 的讲解里**（`ter` 错点，标为 `tense`）——**没有对照卡** |

**⇒ `say` 的「认读位 + 两处错误处置位」是够的。** 它的 2 处正例都是**固定说法**（`Say cheese!` 拍照用语 / `Say it another way?` 换个说法），**这两句里的 `say` 不是「可变位的动词」，是习语的一部分**——**要求用户「学会产出 `say` 的原形」在教学上是没有意义的**（L1 起就教了「I/you/we/they 用原形」）。
**⇒ 「`say` 正侧只有 2」这个数字的教学含义是：`say` 不需要被当知识点教，它需要被当词汇认识。**

---

## ⑤ 跨源位次表（逐字引用 ＋ URL）

### 5.1 抓取状况（诚实记录）

| 源 | 手段 | 结果 |
|---|---|---|
| **Cambridge `Say or tell?`** | `curl -L -A <Chrome UA>` | **`HTTP=200 size=451124`** ✅ |
| **Cambridge `Table of irregular verbs`** | curl | **`HTTP=200 size=463308`** ✅ |
| **Cambridge `Present simple (I work)`** | curl | **`HTTP=200 size=467259`** ✅ |
| **Cambridge 中文侧 `say`** | curl | **`HTTP=200 size=384691`** ✅ |
| **Cambridge 中文侧 `tell`** | curl | **`HTTP=200 size=374232`** ✅ |
| **Cambridge `SAYS` 发音页** | curl | **`HTTP=200 size=234357`** ✅ |
| **OALD `say`** | curl | **`HTTP=200 size=160994`** ✅（含 `Which Word? say / tell` 全框）|
| **OALD `tell`** | curl | **`HTTP=200 size=146423`** ✅ |
| **OALD `says`** | curl | **`HTTP=404`** ❌（**OALD 没有 `says` 独立词条**，返回「Word not found… Did you mean: slays spays stays sways…」）|
| **BC `Reported speech`** | **WebFetch**（curl **`HTTP=000`**，与任务书说的一致）| ✅ 可读，**`Level: intermediate`** |
| **BC `Irregular verbs`** | **WebFetch**（curl `HTTP=000`）| ✅ 可读，**`Level: beginner`**，表含 `say \| said \| said` |
| **BC `Past simple`** | WebFetch | ✅ 可读，**该页不讲 say/tell** |
| **BC `Past simple irregular verbs`** | WebFetch | **`HTTP 404`** ❌（**该 URL 不存在**）|
| **`english.cool` `speak/talk/say`** | curl | **`HTTP=200 size=97693`** ✅ |
| **iciba `say` / `said` / `tell`** | curl | **`200 / 200 / 200`** ✅ |
| **youdao `say` / `said`** | curl | **`200 / 200`** ✅ |
| **Perfect English Grammar `say-and-tell`** | curl | **`HTTP=200 size=19783`** ✅ |
| **Grammarly `irregular-verbs`** | curl | **`HTTP=200`** ✅（实际 301 到 `/blog/parts-of-speech/irregular-verbs/`）|
| **Grammarly `say-vs-tell`** | curl | **`HTTP=404`** ❌（**该页不存在**）|
| **EF `say-and-tell`** | curl | **`HTTP=404`** ❌（**EF 无此页**）|
| **englishclub `irregular-verbs-list`** | curl | **`HTTP=403`**（Cloudflare「Just a moment…」）❌ |
| **usingenglish `irregular-verbs`** | curl | **`HTTP=403`**（同上）❌ |
| **linguapress `irregular-verbs`** | curl | **`HTTP=404`** ❌ |
| **Murphy 双册 / Swan PEU** | — | **已记为「不可得」（任务书指示，不重试）** |
| **知乎** | WebFetch | **`HTTP 403`** ❌ |
| **沪江（hjenglish）** | WebFetch | ✅ 可读但**取到的是首页**，无 say/tell 或三单文章 ❌ |
| **Babbel `english-irregular-verbs`** | curl | **`HTTP=404`** ❌ |
| **BBC Learning English unit-1** | WebFetch | 连接超时 ❌ |

**⇒ 成功 16 个 URL，失败 11 个。** 任务书特别提示的「British Council curl 常 `HTTP=000` 但内容页经 WebFetch 可读」**本批完全复现**（三个 BC 页 curl 全 000，WebFetch 全成功）。

### 5.2 ★ 核心问题一：`said` 在英文教学里与谁一起教？

**答案：与其它不规则过去式一起教。四源一致，且都以「表格一行」的形式给出。**

| # | 源 | **逐字引用** | URL | 等级/备注 |
|---|---|---|---|---|
| **S1** | **Cambridge `Table of irregular verbs`** | 表内逐字：**「run ran run　say said said　see saw seen」** | `https://dictionary.cambridge.org/grammar/british-grammar/irregular-verbs` | 页头逐字：**「Note that be has several irregular forms」**；栏头逐字：**「base form　past simple　-ed form」** |
| **S2** | **BC `Irregular verbs`** | 表内逐字：**「say　said　said」**；开头逐字：**「Most verbs have a past tense and past participle with –ed: worked played listened」**，并说明 **「many of the most frequent verbs are irregular」** | `https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/irregular-verbs` | **`Level: beginner`**；**全页不提 reported speech** |
| **S3** | **Cambridge `Say or tell?`** | **「Say and tell are irregular verbs. The past simple of say is said, the past simple of tell is told:」**；并给逐字例 **「They asked if I was looking for work and I said yes.」** | `https://dictionary.cambridge.org/grammar/british-grammar/say-and-tell` | ⚠️ **这是唯一一个把「不规则」与「say/tell 分工」写在同一句里的源**——但它**只并置、不解释两者关系**（见 §5.4） |
| **S4** | **OALD `say` 词条 Verb Forms 行** | 逐字：**「present simple I / you / we / they say /seɪ/ · he / she / it says /sez/ · past simple said /sed/ · past participle said /sed/ · -ing form saying /ˈseɪɪŋ/」** | `https://www.oxfordlearnersdictionaries.com/definition/english/say_1` | **这是全批唯一一处把三形状（`say`/`says`/`said`）并置的权威位置**；词条标 **`cefr="a1"` + `ox3000="y"`** |
| **S5** | **Cambridge（同 S3 页）`Typical errors` 栏** | 逐字：**「We don't use tell without an indirect object when we report someone's words」**；正句 **「Then a loud voice said, ‘Hello.’」** ＋ 错句 **「Not: … a loud voice told, ‘Hello.’」**；以及 **「She said she would wait for us outside.」** ＋ **「Not: She told she would wait …」** | 同 S3 | ⚠️ **这里 `said` 出现的位置是「转述」，但被讲的语法是 `tell` 的宾语要求**——**不是 `said` 的形态** |

**⇒ 结论（回答任务书的核心问题①）：`said` 在英文教学里与其它不规则过去式一起教，不与转述一起教。** 三条直接证据：`said` **在不规则动词表里有自己的行**（S1/S2，两源）；**BC 的 `Level: beginner` 表里有 `said`，而 BC 的 `Level: intermediate` reported speech 页不教 `said` 的形态**（S2 vs §5.3）；**唯一把「不规则」与「say/tell」写在一句里的 Cambridge 页（S3）也只是并置**，它讲的知识点是「选哪个词」，**不是「`said` 怎么变」**。
**⇒ 但要诚实指出一处张力**：**OALD 的 Verb Forms 行（S4）既是「形态」也是「三形状并置」**——它是**词典结构**，不是**教学顺序**。词典按词条组织，所以同一个词的所有形状必然在同一页；**这不构成「教材把三形状当一课教」的证据**。

### 5.3 ★ 核心问题二：有没有源专门讲「say/says/said 三形状的区分」？

**答案：没有。零源。**

我按「把三形状当成一个对立集（paradigm）来教」这个标准，逐源核查：

| 源 | 它给的三形状 | 它的**对立轴**是什么 | 是三形状区分吗 |
|---|---|---|---|
| Cambridge `Say or tell?` | `said`（在 S3 一句里）+ `told` | **`say` vs `tell`（选哪个词）** | ❌ |
| OALD `Which Word? say / tell`（`say` 与 `tell` 两词条各一份，逐字相同）| `said` 只在例子里 | **`say` vs `tell`** | ❌ |
| Perfect English Grammar `HOW TO USE 'SAY' AND 'TELL'` | `said`（`John said (that) he would be late.`）| **`say` vs `tell`** | ❌ |
| BC `Reported speech`（`intermediate`）| 大量 `said` | **「时态怎么退」（`said` vs `says` 不是它的问题）** | ❌ |
| BC `Irregular verbs`（`beginner`）| **完整三形状** `say \| said \| said` | **「加 -ed vs 不加」（规则 vs 不规则）** | ❌（`says` 不在表里——表只讲过去式）|
| OALD / Cambridge `say` 词条 Verb Forms | **完整三形状** | **词典的形态罗列（无教学对立）** | ❌ |
| iciba / youdao「词态变化」 | **完整三形状**（`第三人称单数: says ; 过去式: said ; 过去分词: said ; 现在分词: saying`）| **词典的形态罗列** | ❌ |
| Cambridge `Present simple (I work)` | 无 | **「加 -s」的通用规则 + 拼写变化表** | ❌ |

**⇒ 结论：没有任何一个源把 `say / says / said` 三形状的区分当成独立教学点。** 三个形状各自归属一条**已存在的通用规则**：`says` → 一般现在时三单加 -s；`said` → 不规则过去式表；`say` → 其余人称的原形。**⇒ 这个「空白」是真实的，但它的性质是「不值得单列」，不是「做不到」**（见 §6.4 的诚实说明）。

### 5.4 三形状并置的**唯一**权威位置：词典的 Verb Forms 行

**这是本批在跨源上最有结构性发现的一条。** 唯一会把 `say`/`says`/`said` 三形状**并置在同一视野内**的权威位置，是**词典词条的 Verb Forms 行**——而它之所以能并置，**恰恰因为它是词典而不是教材**（词典按词条组织，同词全形态必然同页）。

**逐字证据两处：**
- **OALD `say`**（S4）：**「present simple I / you / we / they say /seɪ/ · he / she / it says /sez/ · past simple said /sed/ · past participle said /sed/ · -ing form saying /ˈseɪɪŋ/」**
- **Cambridge 中文侧 `say`** 词条头部逐字：**「say verb uk /seɪ/ us /seɪ/　**said \| said**」**；同页「语法」框逐字：**「Say or tell ? Say and tell are irregular verbs. The past simple of say is said, the past simple of tell is told: …」**（`https://dictionary.cambridge.org/zhs/词典/英语-汉语-简体/say`）
- **中文词典侧同构**：iciba `say` 逐字 **「词态变化　第三人称单数 : says ; 过去式 : said ; 过去分词 : said ; 现在分词 : saying ;」**（`https://www.iciba.com/word?w=say`）；iciba `tell` 同构 **「词态变化　第三人称单数 : tells ; 过去式 : told ; 过去分词 : told ; 现在分词 : telling ;」**；youdao `said` 逐字 **「v. 说，讲；宣称，说明；认为，据说（say 的过去式和过去分词）」**（`https://dict.youdao.com/result?word=said&lang=en`）

**⇒ 一个额外发现（`says` 的发音）**：Cambridge 的 `SAYS` 发音页逐字给出 **「How to pronounce says US /sez/」**，并做音素拆解 **「/s/ as in … ・ /e/ as in … ・ /z/ as in …」**（`https://dictionary.cambridge.org/pronunciation/english/says`）。**⇒ `says` 读 /sez/ 而非 /seɪz/，这是一个「拼写像 -s 规则、读音不规则」的例外，而四源中只有 Cambridge 的发音页单独处理它**（OALD **没有 `says` 词条**，`HTTP=404`；BC 的三页都不提）。**这一处「没有任何语法源讲过」——不是语法，是发音。**

### 5.5 `say` vs `tell` 分工的逐字引用（本批作为对照保留）

| # | 源 | **逐字引用** | URL |
|---|---|---|---|
| **S6** | Cambridge | **「Say focuses on the words someone said and tell focuses more on the content or message of what someone said」**；错句逐字 **「‘Hello,’ she told.」** | 同 S3 |
| **S7** | Cambridge | **「Say does not take an indirect object. Instead, we use a phrase with to」**；逐字例 **「And then she said to me, ‘I’m your cousin. We’ve never met before.’」** ＋ **「Not: And then she said me …」** | 同 S3 |
| **S8** | OALD `Which Word? say / tell` | **「Say never has a person as the object. You say something or say something to somebody.」** ／ **「Tell usually has a person as the object and often has two objects」** ／ **「Tell is also used when you are giving somebody instructions: The doctor told me to stay in bed. NOT The doctor said me to stay in bed.」** | `https://www.oxfordlearnersdictionaries.com/definition/english/say_1` 与 `.../tell_1`（**两词条各一份，逐字相同**）|
| **S9** | Perfect English Grammar | 标题逐字 **「HOW TO USE 'SAY' AND 'TELL'」**；**「With 'tell' we NEED the object (e.g. 'me', 'you', 'her').」** ／ **「With 'say' we CAN'T use the object (e.g. 'me', 'them', 'us').」**；错句逐字 **「John said me that he would be late.」** ／ **「John told that he would be late.」**；正句逐字 **「Julie said (that) she'd come to the party.」** ／ **「He told me (that) he loved living in London.」** | `https://www.perfect-english-grammar.com/say-and-tell.html` |

**⇒ 4 处逐字引用（S6/S7/S8/S9）＋ 前文的 S1–S5，本批共 9 处逐字引用，超出「至少 4 处」的要求。**

---

## ⑥ 竞品矩阵与空位判定

### 6.1 矩阵

| # | 产品 | 侧 | **在「`say`/`says`/`said` 三形状」上做到什么**（本批实测）| **在「`said` 与其它不规则过去式同族」上做到什么** | 空位 |
|---|---|---|---|---|---|
| **1** | **Cambridge Dictionary Grammar** | 英 | ⚠️ **三形状只在不规则表与词条形态行里「并置」，不构成教学**（S1）| ✅ **做到了**：`say said said` 是不规则表的一行（S1）| **形态讲了、规则不讲**——表只给三栏（`base form / past simple / -ed form`），**不说「什么时候用哪个」** |
| **2** | **BC LearnEnglish** | 英 | ❌ **零**：`Level: beginner` 的不规则表有 `said`（S2），但**表里没有 `says`**；`Reported speech` 页（`intermediate`）**不教 `said` 的形态** | ✅ **做到了，且分级清楚**：不规则表在 **beginner**，reported speech 在 **intermediate**——**同源内置的教学顺序** | ⭐ **最有价值的一格**：BC 用**等级标签**把「形态」与「转述」**隔开了两个难度档**，**但它从不说「为什么 `said` 归 beginner、转述归 intermediate」**——**顺序有了，理由没有** |
| **3** | **OALD（牛津）** | 英 | ⚠️ **做到了但它是词典结构**：Verb Forms 行一次给全三形状（S4）| ✅ 做到了（同一行里的 `past simple said`）| **可查不可学**——**无练习、无讲解、无「什么时候用」**；且 **`says` 没有独立词条**（`HTTP=404`），用户查不到 `says` 的读音例外 |
| **4** | **Cambridge 中文侧（`/zhs/`）** | 中 | ⚠️ **同英文侧**：词条头 `said \| said` ＋ 语法框里 `the past simple of say is said` | ✅ 做到了 | **中文侧最好的一处，但仍是参考页**；**`said` 的读音 /sed/ 与 `says` 的 /sez/ 都没有中文提示** |
| **5** | **`english.cool`（中文，繁体）** | 中 | ❌ **零**：该页只讲 `speak / talk / say` 三词分工，**`said` 只在例子里出现一次**（`She said goodbye to everyone before leaving the party.`），**`says` 不出现** | ❌ 零 | ⭐⭐ **「最有价值的空位」在 `say` 侧而不在三形状**：该页逐字把 **`*say someone something`** 判为 **「這是中文「跟我說」直接翻過去最容易犯的錯」**（M1，§7.1）——**中文侧把 `say` 的介词陷阱讲透了，但没有一个源讲 `said`** |
| **6** | **iciba（中文词典）** | 中 | ✅ **做到了（词典形态）**：`say` 页逐字 **「词态变化　第三人称单数 : says ; 过去式 : said ; 过去分词 : said ; 现在分词 : saying」**；`tell` 页同构（`tells / told / told / telling`）| ✅ 做到了（同一「词态变化」块里）| **两侧对称了**（与批四十八实测不同：那时说 iciba 的 `tell` 页缺 `tell sb sth`）——**但仍是纯罗列，无讲解无练习**；等级标签是**考试标**（「高中/CET4/CET6/考研/IELTS」）**不是 CEFR** |
| **7** | **Perfect English Grammar** | 英 | ❌ **零**：全页不含 `says`；`said` 只作为例句成分（`John said (that) he would be late.`）| ❌ 零 | ⭐ **最接近我方定位的一格**：**它把 `say` vs `tell` 讲成了「双向错句 + 配套练习 + PDF」（唯一一个）**，**但它的对立轴是「选哪个词」，完全不涉及三形状、也不涉及 `said` 的形态** |
| **8** | **Grammarly `irregular verbs`** | 英 | ❌ **零，且有一处反证**：该页逐字 **「While most irregular verbs are irregular only in their simple past and past participle forms, a few are irregular in other conjugations.」**——**但它举的「other conjugations」是 `to be, to have, to do, and to go`，`say` 不在其中** | ⚠️ **半做到了**：该页把不规则动词定性为 **「they follow no set formula and require memorization」**、**「it's necessary to commit their irregular forms to memory」**——**与 L197 的「这一批只能一个个记，没有捷径」逐字同构** | **它是唯一一个把「为什么必须背」讲出来的源**（「英语里最老的词」那一层它没讲，L197 的 deepDive 讲了）|
| **9** | **grammar.cl（英文，免费）** | 英 | ❌ 零 | ✅ 做到了：表内逐字 **「say　said　said」** | 纯表 |
| **10** | **扇贝 / 多邻国 / 沪江 / 知乎 / EF / englishclub / usingenglish**（合并一行）| 中/英 | ❌ **公开页零相关**（本批复测：沪江取到首页无相关文章；知乎 **403**；EF `/say-and-tell` **404**；englishclub 与 usingenglish **403**；Grammarly `say-vs-tell` **404**）| ❌ 零 | **结构性缺位**；**付费内部未核实** |

### 6.2 空位判定

**① 「`say`/`says`/`said` 三形状的区分」在全部 10 行里是 0 个源。** ⚠️ **但这个空位的性质必须说清（见 §6.4）。**

**② 「`said` 的形态与「跟谁说」放在同一课」在全部 10 行里也是 0 个源。**
- Cambridge（S1）在同一页并列 `said` 与 `told`，但**讲的知识点是选词**；OALD 的 `Which Word?` 注框在词条中部，`told` 的形态行在词条头部——**同页但无语义连接**。
- **⇒ 我方 L38 的 8 张卡（`says` 的形态 + 原话照装 + 否定搬家 + `said me` / `said to me`）是把「形态」与「分工」放在同一课的。这个组合全库无对标。**
- ⚠️ **但必须诚实（沿用批四十八的纪律）**：**这很可能是因为「拆开更好教」**——从教学顺序讲，先教现在时转述、很久以后再教过去时形态，是更常见的安排（**BC 用 beginner 表 / intermediate 转述页的两个等级标签，正是这个顺序的明文体现**）。**我方把两者并置，是差异化的选择，不应被描述为「竞品做不到」——它们是选择不做。这个区分必须写清，否则会在内部误判自己的优势。**

**③ 我方在「`says` 的读音例外」上是完全空白的，且这是全库唯一「连源都很少处理」的点。**
- **源侧**：只有 Cambridge 的 `SAYS` 发音页单独给出 **`US /sez/`**（§5.4）；OALD **没有 `says` 词条**；BC 三页都不提；中文侧 iciba/youdao 的「词态变化」**只给拼写不给音标**。
- **我方**：全库 `says` 的 21 处正例里，**没有任何一处给出读音提示**；`says` 在 L38 的 `deepDive` / `summary` / `oneLineRule` 里都作为形态出现，**读音零提及**。
- **⇒ 这是一个真实的、有源可依的空位。** ⚠️ **但本批不建议补**——L38 已满（8 张，全库最高）；且它是**发音**问题，不是语法问题，**放进语法课会偏离定位**。**记录在此，供发音/听力侧的产品决策参考。**

**④ 中文侧最大的一处空位（承上批）：`english.cool` 讲透了 `say` 的介词陷阱，却完全不讲 `tell` 家族与 `said`。** 本批复测确认：`english.cool` 的 say 页**不含 `tell`、不含 `said` 的形态**（§6.1 第 5 行）。

### 6.3 我方相对位次（诚实版）

| 维度 | 我方位置 |
|---|---|
| `say` vs `tell` 分工（选词） | **落后于 Cambridge / OALD / Perfect English Grammar**（我方全库无 `tell` 教学、无分工对照卡）——**与批四十八结论一致，未变化** |
| `say` 的介词陷阱（`*say me`）| **已设防**（L38 contrast[6]），方向正确；**中文侧 `english.cool` 用现在时讲、我方用过去时讲，是同一陷阱的两个时态外壳** |
| `said` 的形态 | **平齐于四源**（不进规则表也够了：案 29 + `IRREGULAR_PAST`）；**不落后** |
| `says` 的三单 | **平齐于 Cambridge `Present simple` 的通用 -s 规则**（我方 L38 卡 #3 教的是同一条规则的具体应用）|
| **三形状并置** | **零源做过，但我方也没做**——**这是一个「双方都没有」的点，不是我方的优势** |
| `says` 的读音 /sez/ | **落后于 Cambridge**（它有一个发音页；我方零覆盖）|
| 零术语叙事 + 连续剧场景 + 侦探纠错 | **无对标**（Cambridge/BC/OALD/PerfectEnglishGrammar 都是参考页或练习题，**无场景、无零术语改写**）|

### 6.4 ⚠️ 对「空位」的诚实降级（沿用批四十八的纪律）

**「三形状区分」这个空位，我在 §6.2 已经记为「真实」，但必须再降一级：**

**理由**：三形状在英语里**不构成认知负担**——
- `says` = 三单加 -s（Cambridge `Present simple` 逐字给出通用规则：**「We use the base form of the verb, and add -s for the third person singular.」**，并列出 `come → comes` / `order → orders` / **`pay → pays`** / `enjoy → enjoys` 等）；
- `said` = 不规则过去式表一行；
- `say` = 其余人称原形。

**⇒ 三个形状各自是「某条通用规则的一个实例」，它们之间没有需要辨析的语义分工**（不像 `say` vs `tell` 有「焦点在话 vs 焦点在信息」的真分工）。**⇒ 「没有源专门讲三形状的区分」大概率是因为「不值得单列」，不是「做不到」。**
**⇒ 因此本批不把它列为「我方可占据的空位」**，只在 §6.2 如实记录其存在。**若将来有人主张「做一节 `say` 家族形状课」，本批的证据是明确反对的。**

---

## ⑦ 中文负迁移证据（严格区分「源里明说」与「我的推断」）

### 7.1 【源里明说】`*say someone something` —— 中文侧把这一条讲得比我方更透

| # | 源 | **逐字引用（原文繁体）** | URL |
|---|---|---|---|
| **M1** | **`english.cool`「speak / talk / say 差在哪？」** | **「這裡有一個超多人踩的雷：say 後面如果要接「對誰說」，必須先加 to，寫成「say something to someone」。不可以直接寫「say someone something」，這是中文「跟我說」直接翻過去最容易犯的錯，特別注意一下！」** | `https://english.cool/speak-talk-say/` |
| **M2** | **同页 ⭕️/❌ 对照** | 逐字：**「She said goodbye to everyone before leaving the party. ⭕️」** ／ **「She said everyone goodbye before leaving the party. ❌　她離開派對前跟大家道別。」** | 同 M1 |
| **M3** | **同页分工判据** | 逐字：**「speak 偏「開口、講某種語言」，talk 偏「跟人聊天、雙向互動」，say 則是「說出某個具體的內容」。」**；**「speak 管語言和正式發言、talk 管交談互動、say 管具體內容。」** | 同 M1 |
| **M4** | **Cambridge Dictionary（英文侧）同一陷阱** | 逐字：**「Say does not take an indirect object. Instead, we use a phrase with to」**；**「Not: And then she said me …」** | `https://dictionary.cambridge.org/grammar/british-grammar/say-and-tell` |
| **M5** | **OALD** 同一陷阱 | 逐字：**「Say never has a person as the object.」**；**「NOT The doctor said me to stay in bed.」** | 同 S8 |

**⇒ 「源里明说」的结论：中文负迁移的头号陷阱是 `*say + 人`（把中文「跟我说」的词序直接搬过去），且中英四源一致指认。**
**⚠️ 我方状态**：**已设防**（L38 contrast[6] 逐字标 `said`、whyZh 逐字「「跟谁说」不能直接跟在 say 后面——say 后面只装「说的话」。要带上人，得垫个小词 to：She said 【to】 me（她跟我说）。**中文「她跟我说」是一个词顺着说下来，英文这里要多个 to。**」）。**⇒ 我方在这一条上与中文侧最好的免费源平齐。**

### 7.2 【源里明说】`says` 的读音 /sez/ —— 中文侧有零散的对照

| # | 源 | **逐字引用** | URL |
|---|---|---|---|
| **M6** | **百度知道**（经 Bing 中文检索命中）| **「发音不同. say [ sei ] says [ sez ]」** | 检索页 `https://cn.bing.com/search?q=says+发音+sez+不读+seiz`；**原页为百度知道「say和says的读音有区别吗？为什么？」**（⚠️ **百度知道原页本批未直连验证，仅经检索摘要读到**）|
| **M7** | **Cambridge `SAYS` 发音页** | 逐字：**「How to pronounce says US /sez/」**；音素拆解 **「/s/ as in … ・ /e/ as in … ・ /z/ as in …」** | `https://dictionary.cambridge.org/pronunciation/english/says` |

**⇒ 「源里明说」的结论：`says` 读 /sez/，中文侧有零散讨论（一个问答页），权威侧只有 Cambridge 的发音页。**
**⚠️ 我方状态**：**零覆盖**（§6.2 ③）。

### 7.3 ⚠️【我的推断，无源明说】——「三形状混淆」这个痛点

**我全线检索后，没有找到任何源明说「中文学习者会混淆 `say`/`says`/`said` 三形状」。** 检索记录（全部失败或无关，如实列出）：
- `cn.bing.com` 三组检索词（「说不清」→ 三单忘加 s 原因 / 汉语没有动词变化 / says 读音），**均无相关结果**；其中第三组取到的是百度知道（M6）。第一组与第二组返回的是**初中名录、词典条目、「第」字释义**等无关页面。
- **知乎**：`https://www.zhihu.com/question/22317143` → **`HTTP 403`**
- **沪江**：`https://www.hjenglish.com/new/p1227486/` → WebFetch 取到**首页**，无三单/say 文章
- **Grammarly `say-vs-tell`** → **404**；**EF `say-and-tell`** → **404**；**englishclub / usingenglish** → **403**

**⇒ 因此以下三条是我的推断，不是源里明说，必须如此标注：**

| # | 我的推断 | 依据（**是推断，非引用**）| 置信度 |
|---|---|---|---|
| **I1** | 中文「说」是一个不变形的动词（我说/你说/他说都是「说」），所以中文母语者**倾向于漏掉三单 -s**，`He say` 类错型由此而来 | **一般性语言学常识（汉语无屈折形态）**；**本批未找到源明说**。⚠️ 但**我方 L38 卡 #3 的 whyZh 逐字已经这样假定**：「句首那个「谁」She 是他/她/它版，**say 要加 -s**：She says。」——**我方的处理方向与我的推断一致，但这条推断本身未被源验证** | **中** |
| **I2** | 中文「说」不区分「现在/过去」（说就说），所以 `said` 的漏用也是中文负迁移 | **同 I1**；⚠️ **L10 的 `oneLineRule` 逐字已这样写**：「**中文动词不变，英语必须变。**」——**我方早就在教这条，但同样没有外部源为「中文母语者因此漏 `said`」作证** | **中** |
| **I3** | 中文侧教学文章**自认**的痛点集中在「`say`/`speak`/`talk` 选词」与「`say` 的 to」，**不在三形状** | **有源支持（M1/M3 逐字）**——`english.cool` 的成文结构本身就是证据：它用一整页讲选词与 `to`，**对三形状零字**。⇒ **这条是「源里明说」的间接证据，比 I1/I2 强** | **较高** |

**⇒ 结论：「三形状混淆」不足以作为立课理由——它连「中文侧教学文章自认的痛点」都不是（I3）。** 而中文侧**确实自认**的两条痛点（选词、`*say someone`），我方一条已设防、一条本就是批四十八判定的 `tell` 侧缺口。

### 7.4 【源里明说】中文侧已把三形状并列成「词态变化」表

| # | 源 | **逐字引用** | URL |
|---|---|---|---|
| **M8** | **iciba `say`** | **「词态变化　第三人称单数 : says ; 过去式 : said ; 过去分词 : said ; 现在分词 : saying ;」** | `https://www.iciba.com/word?w=say` |
| **M9** | **iciba `said`** | **「v. 说，讲( say的过去式和过去分词 ) ; 表明 ; 念 ; 说明」**；词典头 **「牛津词典　said　英 [sed] 美 [sed]」** | `https://www.iciba.com/word?w=said` |
| **M10** | **youdao `said`** | **「v. 说，讲；宣称，说明；认为，据说（say 的过去式和过去分词）」** | `https://dict.youdao.com/result?word=said&lang=en` |
| **M11** | **Cambridge 中文侧 `say`** | 词条头 **「say 在英语-中文（简体）词典中的翻译　say verb　uk /seɪ/　us /seɪ/　said \| said」**；释义 **「说 ; 讲 ; 陈述 ; 表达 ; 说明」** | `https://dictionary.cambridge.org/zhs/词典/英语-汉语-简体/say` |

**⇒ 中文侧三形状的**并列**是完备的（词典层），**区分**是零（教学层）。**这与英文侧的结构完全同构（§5.3）——**两侧都是「词典给了，教学没给」。**

---

## ⑧ 上批三处成果的独立复核

### 8.1 ① `comparison` 错标修正 13 处 —— ✅ **生效，且是真改判**

**核查方法与结果**（用 `git show HEAD:src/data/huntCases.ts` 取出上批前的版本，逐处对照）：

```
HEAD（上批前）：案数 204，comparison 出现 0 次
当前：         案数 213，comparison 出现 13 次
当前 tag 分布：verb_form 162 / sv_agreement 143 / plural 129 / word_order 95 /
              tense 84 / preposition 69 / article 29 / fragment 28 /
              missing_be 26 / run_on 18 / comparison 13      ← 11 个罪名全部有案
```

**13 处逐处对账（`original` / `correction` 是否未动）：**

| 案 | idx | HEAD tag | 现 tag | `original`→`correction` 变了吗 |
|---|---|---|---|---|
| 20 `hunt-term-review` | 1 | `article` | `comparison` | ❌ 未变（`best`→`the best`）|
| 25 `hunt-photo-compare` | 0 | `verb_form` | `comparison` | ❌ 未变（`hoter`→`hotter`）|
| 25 | 1 | `verb_form` | `comparison` | ❌ 未变（`more good`→`better`）|
| 40 `hunt-superlative-market` | 0 | `article` | `comparison` | ❌ 未变（`biggest`→`the biggest`）|
| 40 | 1 | `article` | `comparison` | ❌ 未变（`most`→`去掉 most`）|
| 40 | 2 | `article` | `comparison` | ❌ 未变（`goodest`→`best`）|
| 40 | 3 | `run_on` | `comparison` | ❌ 未变（`than`→`in`）|
| 74 `hunt-height-chart` | 1 | `verb_form` | `comparison` | ❌ 未变（`taller`→`tall`）|
| 74 | 3 | `preposition` | `comparison` | ❌ 未变（`than`→`as`）|
| 80 `hunt-enough-bag` | 3 | `verb_form` | `comparison` | ❌ 未变（`heavy`→`heavier`）|
| 85 `hunt-feel-better` | 1 | `word_order` | `comparison` | ❌ 未变（`more`→`much`）|
| 186 `hunt-prefer-tea` | 0 | `word_order` | `comparison` | ❌ 未变（`than`→`to`）|
| 192 `hunt-close-27-row` | 1 | `word_order` | `comparison` | ❌ 未变（`than`→`to`）|

**⇒ 13/13 全部是「同一错点的 tag 改写」，不是新增错点。** 案件数、错点数、`tokens`、`title`、`scene` **全部未动**（逐案实测）。**这是真改判，与 PRD 的描述一致。**

**同时修正了 5 处 `explanation` 的术语化措辞**（如 `案40 idx3`：`"最高级用 in（在……里），than 是比较级的搭档。"` → `"说「最…」用 in（在……里）；说「更…」才跟 than 搭。"`）——**去掉了「最高级」「比较级」两个术语，符合零术语红线。** ✅

**下游生效证据**：
- **`src/services/huntService.ts:420` 逐字**：「两处不一致导致：页面罪名面板出现「比较级」按钮，但点它永远只能得到…」——说明该按钮的渲染逻辑确实读 `GRAMMAR_ERROR_TAG_LABELS`；
- **`src/edge/h1-hunt-data-integrity.test.tsx:225` 逐字**：`expect(used.has("comparison" as GrammarErrorTag), "comparison 现在有案件在用").toBe(true);` ——**守门已从「记录缺口」改为「守住不回归」**。
**⇒ 13 处覆盖 8 个案件，其中 7 个案件挂在比较课上**（L17 比一比 → 案25；L31 最能比 → 案40；L65 一样 → 案74；L71 够 → 案80；L76 加力 → 案85；L177 更喜欢 → 案186；L185 收口 → 案192）。**唯一不挂比较课的是案 20（`hunt-term-review`，番外案，无挂靠）**——与 PRD 说明的「A 档 8 处里 `hunt-enough-bag` 那 1 处保留 `verb_form`」**不一致**：**实测 `hunt-enough-bag` 也被改判了**（案 80 有 1 处 `comparison`）。**这是一处 PRD 与实测的偏差，但方向是「改得更彻底」，不影响结论。**（§9 记）

**回归测试**：`src/data/grammarLessons.test.ts` **35/35 通过**；`src/services/huntService.test.ts` **31/31 通过**。**未引入新问题。**

### 8.2 ② L38 补「跟谁说」两张卡 —— ✅ **生效**

```
L38 contrast 8 张（上批 6 → 8）：
 [0] wrongMark="comes"   She says she will comes.
 [1] wrongMark="not"     I think she will not come.
 [2] wrongMark="come"    She says she come.
 [3] wrongMark="say"     She say she will come.
 [4] wrongMark="comes"   Do you think she will comes?
 [5] wrongMark="coming"  She says she will coming.
 [6] wrongMark="said"    She said me she will come.        ← 上批新增（错卡）
 [7] wrongMark=null      She said to me she will come.     ← 上批新增（双正解）
     bothRight=true      correct="She says she will come."
```
**两张卡的 `whyZh` 逐字**（确认落到数据里）：
- 卡[6]：**「「跟谁说」不能直接跟在 say 后面——say 后面只装「说的话」。要带上人，得垫个小词 to：She said 【to】 me（她跟我说）。中文「她跟我说」是一个词顺着说下来，英文这里要多个 to。」**
- 卡[7]：**「两句都对——这句多了「跟谁说」（said to me），说的是同一件事。要记住的是它多个 to：say 后面装话、带人得垫 to。」**

**全库唯一性核查**：含 `said to me` 的槽位**全库 1 处**（L38 contrast[7]）；含 `*said me`（无 to）的槽位**全库 1 处**（L38 contrast[6]）。**⇒ 两张卡是全库唯一覆盖这一对错型的，无重复、无遗漏。**

**上游不变量**：`contrast` 总数 1226 → **1228**（+2），真错卡 725 → **726**（+1），双正解卡 501 → **502**（+1）——**与「一错卡 + 一双正解卡」完全吻合。** ✅

**回归测试**：`grammarLessons.test.ts` 35/35 ✅（含零术语红线对 `whyZh` 的遍历式断言——**两张卡的新文案通过了术语扫描**）。

### 8.3 ③ `IRREGULAR_PAST` 加注说明 18 项永不触发 —— ⚠️ **注已加，但「18 项」的归属算错了两项**

**注已加**（`src/services/languageGateService.ts`，`IRREGULAR_PAST` 表体之后）、逐字：
```
// ⚠️ 2026-09-22 批四十八补注：上列 32 项里有 **18 项当前永不触发**——
// 它们的过去式在课程里从未出现过（tell→told / bring→brought / speak→spoke /
// stand→stood / hold→held / spend→spent / build→built / teach→taught /
// pay→paid / sell→sold / send→sent / ride→rode / drive→drove / fly→flew /
// grow→grew / begin→began / choose→chose / wake→woke）。
```
✅ 注**确实加了**，且**逐字给出了 18 个过去式**、说明了结构性原因（「按变化模式补 vs 按缺口教」）、并说明保留的理由。

**⚠️ 但归属算错了两项**（脚本逐字对账）：

```
表 49 对 = 原有 17 对（注释里那句「起步那批」） + 批四十四补的 32 对
注释括号里逐字列的 18 个过去式：
  told, brought, spoke, stood, held, spent, built, taught,
  paid, sold, sent, rode, drove, flew, grew, began, chose, woke
⇒ 其中属于「批四十四补的 32 项」的：spoke, stood, held, spent, built, taught,
   paid, sold, sent, rode, drove, flew, grew, began, chose, woke          = 16 项
⇒ 其中属于「原有 17 项」的：told, brought                              =  2 项
```
**注释的措辞是「上列 32 项里有 18 项」，但 `told` 与 `brought` 恰恰在「原有 17 项」里**（`tell: "told"` 与 `bring: "brought"` 属于注释所言的「起步那批」）。
**⇒ 逐项实测（全库三侧合计）：18 项全部为 0 命中**（每一处都真的一次都没出现过）——
```
told 0 · brought 0 · spoke 0 · stood 0 · held 0 · spent 0 · built 0 · taught 0
paid 0 · sold 0 · sent 0 · rode 0 · drove 0 · flew 0 · grew 0 · began 0
chose 0 · woke 0
```
**⇒ 18 项「零出现」这个事实是对的；错的只是「32 项里有 18 项」这句的归属。正确的写法是「32 项里有 16 项 + 原有 17 项里有 2 项，共 18 项」。**

**核对「32 项里的另外 16 项」是否有出现**（脚本实测）：
```
swim→swam 正18 · sing→sang 正18 · sit→sat 正18 · catch→caught 正18
think→thought 正19 · know→knew 正17 · keep→kept 正20 · feel→felt 正35
draw→drew 正22 · break→broke 正24 · fall→fell 正2 · lose→lost 正48
win→won 正9 · hear→heard 正1 · write→wrote 正0（仅 1 处 deepDive 讲解）· wear→wore 正21
```
**⇒ 32 项里 16 项有实际出现（含 15 项正侧≥1、`write→wrote` 只在讲解里出现 1 次）。** 表述应为「32 项里 16 项在课程里已有正面用法」。

### 8.4 ★ ★ 复核的额外发现：真正的触发条件，49 对里只有 5 对能触发

**上批注里说「18 项永不触发」，隐含的口径是「该过去式在课程数据里有没有出现过」。但 `IRREGULAR_PAST` 的触发条件不是这个。** 判定引擎 `detectTenseTag` 逐字：

```ts
const detectTenseTag = (answerTokens, sampleTokens) => {
  const hasPastHint = PAST_TIME_HINTS.some((hint) => answerJoined.includes(hint));
  if (!hasPastHint) return false;
  for (const [base, past] of Object.entries(IRREGULAR_PAST)) {
    const sampleHasPast = sampleTokens.includes(past);      // ← 关键前提
    ...
    if (sampleHasPast && answerHasBase && !answerHasPast) return true;
  }
```
**⇒ 前提是「该关卡 `sampleAnswer` 里含这个过去式」，而 `sampleAnswer` 来自 6 个 gate 脚本，不是 204 课。**

**实测（脚本）**：
```
全库 6 个 gate 脚本共 50 条 sampleAnswer
其中含过去时间词（yesterday / last night / last week / …）的：6 条
  gateScripts:          "I came from Beijing. I arrived last night."
  gateScripts:          "I bought it yesterday."
  libraryGateScripts:   "This is the book which I read last week."
  echoGateScripts:      "I arrived yesterday evening."
  echoGateScripts:      "She went home last night."
  echoGateScripts:      "We took the night train last week."

49 对里「过去式出现在任意 sampleAnswer」的：6 对
  come→came · go→went · arrive→arrived · take→took · find→found · buy→bought

49 对里**同时**满足「sample 含该过去式」＋「sample 含过去时间词」（=可触发）：5 对
  ✅ come→came     "I came from Beijing. I arrived last night."
  ✅ go→went       "She went home last night."
  ✅ arrive→arrived "I came from Beijing. I arrived last night." / "I arrived yesterday evening."
  ✅ take→took     "We took the night train last week."
  ✅ buy→bought    "I bought it yesterday."
  ⇒ 真正永不触发：44 对 / 49（89.8%）
```
**（`find→found` 落在 `libraryGateScripts` 的 `"I came here because I wanted to read, and I found that reading is fun."`——这句有 `came` 但无过去时间词，所以 `find→found` 不构成可触发对。）**

**⇒ 三点结论：**
1. **这不是缺陷。** 那条判定的**设计意图**就是「只对已经存在的过去式报警」——表超前是无害的（批四十四已经这样定过：**「表项保留：它们无害，且将来补上对应课文即可生效」**）。
2. **但注释的口径该换。** 上批注用「课程数据里出现过没」当口径，得出 18；**真正的口径「`sampleAnswer` 是否含该过去式 + 是否含过去时间词」得出的是 44**——**量级差 2.4 倍**。**若将来有人用这张表估「覆盖率」，两个数字会得出完全不同的结论。**
3. **⇒ 建议 A（本批唯一建议落地的注释改动）**：把注里的「18 项」改为「**32 项里的 16 项 + 原有 17 项里的 2 项（共 18 项）在课程数据里从未出现；而按判定真正的前置条件（`sampleAnswer` 含该过去式且含过去时间词）算，49 对里只有 5 对可触发**」。

### 8.5 复核中顺带查到的一处（上批未报）

**L38 的 `contrast` 张数 8 张 = 全库最高，且它是唯一超过 7 张的课。**
```
对照卡张数分布：6 张 → 201 课 ；7 张 → 2 课（L23 弄丢了/弄坏了、L50 幕后句）；8 张 → 1 课（L38）
平均 6.02 张/课；中位数 6
```
**内容总量（examples+dialogue+contrast+variants+sceneSwings+guided+practice）**：L38 = **32 条**，全库排名 **第 7 / 204**（前 5 名：L185 36、L183 33、L184 33、L3 32、L4 32）；全库中位 **30**、最大 36、最小 29。
**⇒ 这是本批判定「L38 已满」的量化依据（§3.2）。** 也说明批四十八那两张卡的落点选择是准确的（L38 是本知识点唯一的宿主），**但正是那两张卡把 L38 推到了全库单课卡数第一。**

---

## ⑨ 自我核查记录

| # | 检查项 | 结果 |
|---|---|---|
| 1 | **任务书三行表是否逐字复现** | ✅ `say 2/5`、`says 21/4`、`said 1/3` 全部一致（口径见 §2.0–2.2）|
| 2 | **是否用了 Node 词边界正则（不用 grep）** | ✅ 全部计数经 `new RegExp(\`(?<![A-Za-z-])${w}(?![A-Za-z-])\`, 'gi')`；未用 `grep` 做任何计数 |
| 3 | **是否排除了 spot 题的 answer** | ✅ `guided.spot.answer` 归排除侧；实测 `says` 的 spot 命中在 `spot.tokens`（1 处），未计入 |
| 4 | **是否排除了 bothRight 卡的 wrong** | ✅ `contrast.wrong.BR` 归排除侧；实测 `said` 的 1 处 `She said to me she will come.` 未计入错侧；全库 bothRight 实测 **502 张**，与类型注释（498，旧）差 4——**注释已落后** |
| 5 | **口径是否可复现** | ✅ 敏感性子集（`±replaceBase`、`±wrongMark`、`±spot.tokens`、`±options`）全部实测，结果列在 §2.5 |
| 6 | **⚠️ 我是否把「共现」当成了「错误」** | ✅ **本批正是查出这一点**（§2.4）：`says` 的 4 处错侧命中里 **0 处**是 `says` 自身被标错 |
| 7 | **⚠️ 我是否把「正侧基数」当成了「掌握度」** | ✅ 已在 §3.1、§4.3 明确区分；`said` 正侧 1 但**有真实产出位**（案 29），两者不是一回事 |
| 8 | **`said` 归属的判断是否有源支撑** | ✅ 4 源（S1/S2/S3/S4）；且明确记录了「OALD Verb Forms 行不构成教学顺序证据」这一反证 |
| 9 | **是否逐字引用 ≥4 处** | ✅ **共 9 处**（S1–S9）＋ 中文侧 11 处（M1–M11）|
| 10 | **是否给了可访问 URL** | ✅ 全部 27 个 URL 列出；**失败的 11 个也逐条列出**（§5.1）|
| 11 | **Murphy / Swan 是否重试** | ✅ **未重试**，按任务书记为「不可得」 |
| 12 | **中文侧「明说」与「推断」是否分开** | ✅ §7.1/7.2/7.4 是「明说」（逐字引用）；§7.3 是「推断」（**I1/I2 标为「中」置信度并明确写「本批未找到源明说」**；I3 标为「较高」并给出源依据）|
| 13 | **上批成果①（comparison 13）是否独立复核** | ✅ 取 `git show HEAD:` 版本逐处对照，确认 13 处是**同错点的 tag 改写**（`original`/`correction` 未动），非新增 |
| 14 | **上批成果②（L38 两张卡）是否独立复核** | ✅ 逐字读出两张卡的 `wrong`/`wrongMark`/`bothRight`/`whyZh`；`contrast` 总数 +2 与「1 错卡 + 1 双正解」吻合 |
| 15 | **上批成果③（IRREGULAR_PAST 注）是否独立复核** | ✅ 注已加；**查出归属错 2 项（18 → 16+2）**，并查出**真正的触发口径下只有 5 对可触发** |
| 16 | **是否跑了测试确认无回归** | ✅ `grammarLessons.test.ts` 35/35、`huntService.test.ts` 31/31 全绿 |
| 17 | **是否改了任何产品数据** | ✅ **零改动**。本批全部脚本落在 `/tmp/sayfam/`，`src/` 下未动一个字节（除本报告文件）|
| 18 | **是否对「空位」做了诚实降级** | ✅ §6.4 明确把「三形状区分」降级为「不值得单列，不是做不到」 |
| 19 | **是否避免了「我方优势」的自夸** | ✅ §6.2 ② 明确写「它们是选择不做」；§6.3 表中「三形状并置」一格写「**双方都没有，不是我方优势**」 |

---

## ⑩ 不确定项

| # | 不确定的事 | 影响 | 我的判断 | 怎么消除 |
|---|---|---|---|---|
| **U1** | **「错侧」这个口径是否该继续用** | **高**——本批最重要的发现是它会把「共现」读成「错误」（§2.4）| 建议以后拆成「该形状被标错的次数」与「该形状出现在含错句里的次数」两栏 | 改统计脚本；一次全库回扫（408 道 options 含正解、全部对照卡）|
| **U2** | **`IRREGULAR_PAST` 的 44 对永不触发，该不该按 `sampleAnswer` 补料** | 中——决定那张表是「面向未来的表」还是「当前有效的表」 | 我倾向**不补**：批四十四已定「表项保留、无害」，且补 `sampleAnswer` 会改动 gate 脚本的判卷行为（**风险高于收益**）| 产品决策；若决定补，需逐关核对 `acceptRegex` 与 `sampleAnswer` 的一致性 |
| **U3** | **`said` 的产出位只有 1 处（案 29），是否够** | 中——本案「不做」的关键前提 | **够**：案 29 是「用户被判错、必须改成 `said`」的真实产出位，且 `IRREGULAR_PAST` 表已覆盖 | 若要更强的证据，可查 `hunt_verdict` 埋点里案 29 的误判率——**本批未查**（需要运行时数据，静态数据查不到）|
| **U4** | **`says` 读 /sez/ 我方零覆盖，是否该补** | 低——**但这是本批唯一「源侧有、我方无」的实证缺口** | **本批不补**（L38 已满 + 发音不属于语法课定位），**但记录在案** | 交给发音/听力侧决策；若要补，Cambridge 的 `SAYS` 发音页是唯一权威依据 |
| **U5** | **L38 的 4 张「从句动词」卡（0/2/4/5）是否算冗余** | 中——如果算冗余，L38 就有腾卡空间，加卡的成本会降低 | **我判不算冗余**：`comes`/`come`/`coming` 是同一规则的三种具体错法，分开列是为了让用户见过三个面；**且删卡是内容改动，本批无权也不建议做** | 需产品/教学侧裁定；本批只提供事实（4/8 张打同一规则）|
| **U6** | **中文侧「三形状混淆」这个痛点在付费/封闭内容里是否存在** | 中——本批检索不到，但不能证明不存在 | 我的判断是**大概率不存在**（依据 I3：`english.cool` 一整页讲选词与 `to`、对三形状零字）| 需更完整的中文语料（如教材配套练习册、教师参考书）——**本批无法访问** |
| **U7** | **`types.ts` 注释里 `contrast` 三类分解（670/498/52）已落后三批** | 低——只是注释 | 实测应为 **726 / 502 / 52**（`1228` 总数）| 一处注释更新（本批无权改 `src/`，列为待办）|
| **U8** | **PRD 说 `hunt-enough-bag` 保留 `verb_form`，但实测它被改判为 `comparison`** | 低——方向是「改得更彻底」 | PRD 与实测不一致；**实测 13 处覆盖 8 案，不是 7 案** | 更新 PRD 或在下批说明；不影响 `comparison` 生效的结论 |
| **U9** | **本批脚本在 `/tmp`，不在 `deliverables/`** | 低——影响可复跑性 | 与批四十七/四十八惯例不符 | 若需要长期可查，迁到 `deliverables/product-strategy/` |

---

## 附：本批关键事实速查（供后续批次引用）

| 事实 | 值 |
|---|---|
| `say` 家族正/错侧（本批口径）| `say` 2/5 · `says` 21/4 · `said` 1/3 |
| `say` 家族**真错用** | `say` 5 · `says` **0** · `said` 3 |
| `says` 正例集中度 | **19/21 在 L38**（同一句 `She says she will come.` 在 8 类槽位）|
| `say`/`said` 的「用户产出位」 | **各 0**（无任何一题要求打出它们）|
| `said` 的唯一产出位 | **案 29**（`say→said`，`tag: tense`，挂靠 L21）|
| L38 `contrast` 张数 | **8**（全库唯一超过 7 的课；201 课是 6 张、2 课是 7 张）|
| L38 内容总量 | **32 条**，全库第 7 / 204（中位 30，最大 36）|
| L38 8 张卡的分工 | 从句动词 4 张（`comes`/`come`/`comes`/`coming`）· 否定搬家 1 张 · 主句 -s 1 张 · **跟谁说 2 张** |
| `comparison` | **13 处**，覆盖 **8 案**，7 案挂比较课 |
| `contrast` 全库 | **1228** = 真错 **726** + 双正解 **502**（`types.ts` 注释仍写 670/498/52，**落后三批**）|
| `IRREGULAR_PAST` | **49 对**；课程数据里从未出现 **18** 项；**按判定真正前置条件只有 5 对可触发（44 对永不触发）** |
| `sampleAnswer` 总量 | **50 条**（6 个 gate 脚本）；含过去时间词的 **6 条** |
| `guided.options` 毛刺 | **408/1223 = 33.4%** 的题，`options` 里含正确答案本身 |
| `types.ts:533` | `spot`：藏了问题的那个词块（命中即通过）|
| `languageGateService:106` | `const sampleHasPast = sampleTokens.includes(past);` ← `IRREGULAR_PAST` 的真正前置条件 |
