# 用户研究 · 语法线「小美的一天」· 移动方向族补员（through / around / into / across / along）

**日期**：2026-09-21 ｜ **类型**：用户研究（语法线第三十八批候选）｜ **研究员**：瑞思
**上游**：`user-research-verb-to-family-2026-09-21.md` §5.3 携带项 7（逐字：`**移动方向介词族**（through／around／into／across／along 全零）| 批三十六延后 | 未评估`）
**本批候选**：`through`／`around`／`into`／`across`／`along` 五员（任务书实测全族 GL=0）

---

## 📌 TL;DR（本报告的五条裁定）

| # | 问题 | **裁定** |
|---|---|---|
| **1** | 5 个词拆几课？ | **拆 3 课（L191–L193）。** 不是 5 课、也不是 1 课。拆课轴不是「5 个词÷2」，而是**三件不同的「看什么」**：① 进到里面（`into`，看终点）② 横着过去（`across`／`through`，看**怎么过去**）③ 贴着走＋兜圈（`along`／`around`，看**路线形状**）。 |
| **2** | 负迁移最强、最该先教的是哪个？ | **`into` 第一**——因为它的中文对译陷阱最隐蔽：中文「进」本身带「进到里面」的意思，学习者会把「进」翻成 `in`（`*I walked in the room.`）。**`through`／`across` 第二**（剑桥中文侧实测把两者**都译成「穿过」**，见 §2.2 逐字）。`along`／`around` 第三（中文「沿着」是直译，反而好学）。 |
| **3** | `into` vs `in`／`across` vs `cross`／`through` vs `across` 各自成课吗？ | **`into` vs `in` 成课（L191，独立一课）；`through` vs `across` 成课（L192，两者必须同课对照）；`across` vs `cross` 不成课**——`cross` 全库 GL=**0**（实测），它是**动词**，属另一条轴，且我方零基础用户尚不需要它。 |
| **4** | 是否捎带 `over`／`under`／`past`／`off` 的移动用法？ | **不捎带。** 实测这四词在库里**没有任何移动义**：`over` GL=1（唯一 1 处是 L41 `:7640` 的 `over there`＝「那边」，静态指远）；`off` GL=1（L137 `:26326` `Two months off!`＝放假）；`past` **真词 GL=0**（那 3 处是 `lesson-24-past-vs-perfect` 这类**带连字符的标识符**假命中）；`under` GL=26 **全部是 L26 的静态「在下面」**（且它已进「方位八位」清单）。**四者移动义为零 ≠ 缺口，而是「另一条轴（上下／越过／经过）」**，应单独立项。 |
| **5** | 是否新建季？ | **新建 `season-29`（L191–193，3 课）会踩红线**——`grammarSeasons.test.ts` 实测「≤3 课小季 ≤3」**已顶格**（现有 `season-6`／`season-12`／`season-19` 正好 3 个）。**建议把 L191–L193 并入 `season-28`**（`max: 190` → `193`，成为 12 课大季），**不新建季**。 |

**总进度**：**190 课／199 案／28 季**；`grammarLessons.test.ts` **28 项全绿**（本轮实跑，非引用旧数）。

---

## §0 本轮实读口径声明（必读）

### 0.1 冻结快照

| 文件 | 行数 | 内容 |
|---|---|---|
| `src/data/grammarLessons.ts` | **38,119** | **190 课** |
| `src/data/huntCases.ts` | **10,383** | **199 案** |
| `src/data/grammarSeasons.ts` | **74** | **28 季** |
| `src/components/AdventureScene.tsx` | 476 | 14 个合法场景 ID |

> ⚠️ **与上游文档的口径差异**：`user-research-verb-to-family-2026-09-21.md` §0.1 记录的是 189 课／198 案（37,925 行）。**本轮实测已是 190 课／199 案（38,119 行）**——即批三十七（`learn to`／L190）**已落地**。本报告一律以本轮实测的 190 课为基线。
> **本轮下一可用课号 = L191**（实测 190 课连续无缺号无重号）；**下一可用案号 = 200**；`lesson-191`／`hunt-into-` 等前缀在库内均未占用。

### 0.2 工具坑：ugrep 词边界假阴性（本轮当场复现，**不是重复上游结论**）

```bash
# 逐词对比：ugrep 带词边界 vs node 词边界（同文件同词）
node -e 'const S=require("/tmp/glscan2.js");console.log(S.c("under"))'   # → 26
grep -oniE "(^|[^A-Za-z])under([^A-Za-z]|$)" src/data/grammarLessons.ts | wc -l   # → 26   ✅ 一致
node -e 'const S=require("/tmp/glscan2.js");console.log(S.c("swim"))'    # → 118
grep -oniE "(^|[^A-Za-z])swim([^A-Za-z]|$)" src/data/grammarLessons.ts | wc -l   # → 0    ❌ 假阴性
node -e 'const S=require("/tmp/glscan2.js");console.log(S.c("room"))'    # → 24
grep -oniE "(^|[^A-Za-z])room([^A-Za-z]|$)" src/data/grammarLessons.ts | wc -l   # → 0    ❌ 假阴性
node -e 'const S=require("/tmp/glscan2.js");console.log(S.c("want"))'    # → 294
grep -oniE "(^|[^A-Za-z])want([^A-Za-z]|$)" src/data/grammarLessons.ts | wc -l   # → 0    ❌ 假阴性
# huntCases.ts 同样：
node -e 'const S=require("/tmp/glscan2.js");console.log(S.c("swim",S.HC))'  # → 16
grep -oniE "(^|[^A-Za-z])swim([^A-Za-z]|$)" src/data/huntCases.ts | wc -l        # → 0    ❌ 假阴性
```

**⇒ 结论比上游更糟：ugrep 的失效是「随词而变」的**——`under`／`walked`／`forest`／`beach`／`island` 正确，而 `swim`／`room`／`want`／`pass` 全部假返回 0。**它不是一个可以「挑着用」的工具**。本轮**全部词频一律走 node 脚本、词边界口径**。

### 0.3 三种口径

| 口径 | 定义 | 本批用途 |
|---|---|---|
| **词边界口径** | `(^\|[^A-Za-z])词([^A-Za-z]\|$)`，`gi` | **词频唯一口径** |
| **连续子序列口径** | 标点／空白归一后做子串匹配 | **查重唯一口径** |
| **课程块口径** | 按 `^\s{4}id: "lesson-…",` 切块 | **逐课归因唯一口径** |
| **词表池口径** | `targetSentence`＋`examples`＋`blocks`＋`dialogue`＋`contrast`＋`variants`＋`sceneSwings`＋`guided`＋`recall`，**不含 practice 自身 tokens** | **新词判定唯一口径**（复刻 `grammarLessons.test.ts` D 层） |

**脚本**（本轮落在 `/tmp/`，可复跑）：`glscan2.js` ＝课程块索引（`.lessons`／`.c()`／`.lessonsOf()`／`.cont()`／`.prac`）。

```bash
node -e 'const S=require("/tmp/glscan2.js");console.log("lessons:",S.lessons.length);'
# → lessons: 190
```

### 0.4 ⚠️ 本轮新发现的第二个口径坑：连字符标识符假命中

**这是上游文档未记录、而本批直接踩到的陷阱**：`past` 用**宽词边界**（只排除字母）会得到 GL=**3**，但那 3 处**全是 `id:` 字段里的连字符标识符**：

```
:4433  id: "lesson-24-past-vs-perfect",
:6318  id: "lesson-34-past-continuous",
:6497  huntCaseIds: ["hunt-past-rainy-day"]
```

**改用「真词口径」**（`(^|[^A-Za-z-])past([^A-Za-z-]|$)`，连字符也算词内）：

```bash
node -e '
const S=require("/tmp/glscan2.js");
const strict=new RegExp("(^|[^A-Za-z-])past([^A-Za-z-]|$)","gi");
console.log("真词 past =",(S.GL.match(strict)||[]).length);'
# → 真词 past = 0
```

**⇒ 本批对 `past` 的断言一律用「真词口径」= 0。** 同法普查其它候选词，发现同样假命中的还有：`corner`（宽 1 → 真 0）、`room`（宽 24 → 真 23）、`forest`（宽 5 → 真 4）；`island`／`tree`／`beach` 无差异。

### 0.5 逐字引用纪律

引文一律给「文件 : 行号（课号）」三元组。课号↔行号对应由课程块口径保证（例：`:15010` ∈ L79，该课块起于 `:14915`）。

### 0.6 零术语口径

**红线词表 29 词**（`src/data/grammarZeroTerms.ts` 逐字）：主语／谓语／宾语／表语／定语／状语／单数／复数／三单／原形／时态／一般过去时／一般现在时／现在进行时／过去进行时／现在完成时／情态动词／比较级／最高级／从句／语序／可数／疑问句／否定句／被动语态／第三人称／形容词／副词／**介词**。

> ⚠️ **本批的头号术语风险：这条轴的名字本身（「介词」）就是红线词。** 实测项目自建替代词汇：**`位置词` GL=20**（L79／L80／L81／L82／L83，逐字见 `:14918` `grammarLabel: "位置词 · next to"`、`:15010` 「in／on／at／under／near／next to —— 位置词家族」）。
> **本轮为移动方向族提议的家族名 = `走法词`**（经红线自查：**零术语 ✅**，且 GL=**0**，未被占用、不与 `位置词` 撞车）。
> **本报告正文（§0–§3、§5）是研究方法记录**，在引用红线词表本身与既有文档逐字时不可避免地出现术语；**面向学习者的文案只在 §4**。

### 0.7 红线基线实测（本轮独立复算，190 课全量）

| 断言 | 实测 | 状态 |
|---|---|---|
| 课号连续无缺号／无重号 | **190 课，L1–L190 连续，缺号 0、重号 0** | ✅ |
| 案号连续无缺号／无重号 | **199 案，1–199 连续，缺号 0、重号 0** | ✅ |
| 季覆盖 190 课 | `season-1`…`season-28` 合计覆盖 **190** | ✅ |
| ≤3 课小季 | **3 个**（`season-6` 3 课／`season-12` 3 课／`season-19` 3 课），**上限 3** | ⚠️ **已顶格，本批不得新建小季** |
| 严格 3 标记 + 3 双正解 | **82 / 190**（与任务书给的 82/190 一致 ✅） | ⚠️ 非强制，但新批应对齐近课水位 |
| 难度断崖（单句最长词数） | **超过 5 词的相邻对 = 0**（最大跳变 7 出现在 L85→L86／L86→L87／L102→L103，均为**收口课拼接句**拆开后的单句，非越线） | ✅ |
| 季体量分布 | 最大 12 课；`season-28` 现 **182–190（9 课）** | ✅ |
| `grammarLessons.test.ts` | **28 项全绿**（本轮实跑） | ✅ |

```bash
npx vitest run src/data/grammarLessons.test.ts
# → Test Files  1 passed (1)
# →       Tests  28 passed (28)
```

> ⚠️ **与上游口径差异**：上游记「27 项全绿」，**本轮实测 28 项**（上游之后新增过断言）。以 28 为准。

---

## §1 第一裁定：5 个词拆 **3 课**

### 1.1 先看「超先例」到底超在哪——**用实测数字界定，不靠印象**

任务书警告「5 个词超先例（历史单课最多 3 个新词）」。**本轮把这条先例量化了**（词表池口径，全 190 课）：

```bash
# /tmp/newload.js —— 逐课累计词表池，算「目标句里的新词数」
node /tmp/newload.js
# → 目标句最大新词数 = 3
# → 新词数分布: {"0":91,"1":72,"2":19,"3":8}
```

**⇒ 历史确证：190 课里，**没有任何一课的目标句新词超过 3 个**（3 词档仅 8 课，全在 L1–L17 的起步段）。**5 个新词挤进 1 课 = 目标句新词数直接跳到 5，是历史记录的 1.67 倍。**

**但「拆几课」不能只看「5÷3≈2」**——那会得到 2 课（3+2），而 3+2 的切法在本族人造出一条**不存在的界线**。真正的切分轴是「学习者要看什么」。

### 1.2 拆课轴：三个「看什么」——这是本族唯一站得住的切法（对 5 个词各查牛津义项定义，逐字见 §4.2）

| 轴 | 词 | 学习者要看的**那一样东西** | 牛津义项定义（逐字） |
|---|---|---|---|
| **轴甲·看终点** | `into` | 看**走到哪里去了**（进到里面） | `to a position in or inside something`（CEFR **A1**） |
| **轴乙·看怎么过去** | `across`／`through` | 看**中间隔着什么**（空场／有东西包着） | `across`：`from one side to the other side of something`（A1）；`through`：`from one end or side of something/somebody to the other`（A1） |
| **轴丙·看路线形状** | `along`／`around` | 看**走的是直线还是圈** | `along`：`from one end to or towards the other end of something`（**A2**）；`around`：`in a circle`（A1） |

**⇒ 三轴各是一件独立的「看什么」。`into` 与 `across` 的区别不是「两个词」，而是「看终点」与「看中间」——两件不同的观察任务。**

### 1.3 为什么不是 2 课（3+2 的致命问题）

若强行 3+2，第 2 课只能从「轴乙＋轴丙」里各切一个词，于是得到两种切法，**两种都错**：

| 切法 | 后果 |
|---|---|
| 课1 = `into`／`across`／`through`；课2 = `along`／`around` | **课1 把轴甲和轴乙煮成一锅**——`into`（看终点）与 `across`／`through`（看中间）的判据完全不同，一课讲两套判据，正是「两件事挤一课」 |
| 课1 = `into`／`across`／`along`；课2 = `through`／`around` | **更糟**：把 `across` 与 `through` 拆到两课——而它俩**恰恰是必须同课对照的一对**（§2.2 实测：剑桥中文侧把两者都译成「穿过」，不同课对照则混淆无从消解） |

**⇒ 3 课（1＋2＋2）是唯一让「每个词都落在它该被对照的那个词旁边」的切法。**

### 1.4 为什么不是 5 课（一课一词）

| 若拆 5 课 | 会发生什么 |
|---|---|
| `across`／`through` 分两课 | **破坏了全批最有价值的一张对照卡**——`We walked across the field.` vs `We walked through the forest.`。**剑桥原文明确把这两个词放在同一页对照**（`Across, over or through?`，URL 见 §4.2），且该页有专门一节 `Across or through?`。**外部权威就是同课对照的，我方拆开是逆着教学体系走。** |
| `along`／`around` 分两课 | 「沿着走」（贴长条物）与「绕圈走」是**同一件观察任务的两种结果**（看路线形状）；分课后两课各只剩一半判据 |
| 季体量 | 5 课会造出一个 5 课小季或把 `season-28` 撑到 14 课（超现最大 12 课） |

**⇒ 5 课是「一个词一课」，把对照拆散——本批最大的产品风险。**

### 1.5 裁定

> **裁定 A（拆课）：拆 3 课，落 L191／L192／L193。**
> **轴甲（看终点）＝ 课 1：`into`。** 它必须独立一课——因为它要对照的那个词（`in`）**已被 L18 占掉**（`:3315` `My hat is in the box.`／`:3319` `oneLineRule: "「在哪」和「什么时候」都靠三个小词：in（里面 / 大块时间）…"`），这是一场**跨 170 课的对照**，信息量足够撑满一课。
> **轴乙（看中间）＝ 课 2：`across` ＋ `through`。** 两者**必须同课**（剑桥即同页对照，§4.2）。
> **轴丙（看路线形状）＝ 课 3：`along` ＋ `around`。** 两者是同一观察任务的两个答案，**也必须同课**。
> **⇒ 每课新词数 = 1／2／2，全部不超过历史极限 3** ✅

### 1.6 季与里程碑（必做的随批清单）

| 项 | 值 | 依据 |
|---|---|---|
| **季** | **并入 `season-28`**（`min: 182, max: 190` → `193`，成为 **12 课**大季） | ⚠️ **不新建季**：新建 `season-29`（3 课）会使 ≤3 课小季从 3 个变 **4 个**，`grammarSeasons.test.ts` 直接红（逐字见 §0.7）。并入后 `season-28` 12 课，与现存最大季 `season-27`（12 课）持平 ✅ |
| **季名建议** | `第二十八季 · 收口、目的、条件、不得不、他们的、正在学与走法` | 现名逐字（`grammarSeasons.ts:69`）：`第二十八季 · 收口、目的、条件、不得不与他们的` |
| **里程碑** | `can-do-m39`（`afterLesson: 193`） | 现末位 `can-do-m38`（`afterLesson: 190`，`GrammarPathPage.tsx:381`） |
| **里程碑 title** | `我能说「往哪走」` | 与 m35–m38 同型 |
| **案号** | **200／201／202**（实测 199 案连续，200–202 可用） | —— |
| **封面** | `cover74`／`cover75`／`cover76`（实测各**仅用 1 次**，为复用次数最低档；L186–L190 用的是 46／47／71／72／73） | —— |

---

## §2 拆课理由与负迁移排序

### 2.1 中文负迁移总排序（**这是本批的核心发现**）

先把五个词的中文对译摊开，看**中文侧能不能把它们分开**。用剑桥双语词典（英汉）逐条实测：

| 英文词 | 剑桥给出的中文对译（逐字，含例句对译） | 中文侧能否与邻词区分 |
|---|---|---|
| `through` | `通過`；例句对译：`They walked slowly through the woods.` → **`他們緩步穿過樹林。`** | ❌ **与 `across` 撞车**（同一个「穿过」） |
| `across` | `從`；例句对译：`She walked across the field/road.` → **`她穿過田野／橫過馬路。`** | ❌ **与 `through` 撞车**（「穿过」）；`橫過` 稍异 |
| `into` | `進入`；例句对译：`Let's go into the garden.` → `…` | ⚠️ **与 `in` 撞车**（中文「进」自带「里面」，学习者直接省掉） |
| `along` | `沿着`；例句对译：`a romantic walk along the beach/river` → `沿着海滩／河边的浪漫散步` | ✅ **可区分**（中文「沿着」是干净直译） |
| `around` | `四处`／`在…周围`；例句对译：`We sat around the table.` | ✅ **可区分**（中文「围着／绕着」） |

**⇒ 负迁移强度排序（决定教学顺序）：**

| 排名 | 词 | 中文负迁移机制 | 为什么排这个位置 |
|---|---|---|---|
| **①** | **`into`** | 中文「进」字**自带「到里面」**——学习者不觉得需要额外小词，于是把「走进房间」说成 `*I walked in the room.` | **最隐蔽**：错句本身也是**合法英文**（`in the room` 是「在房间里」），只是意思变成「在里面走」——**错误不产生「怪句子」，只产生「另一个意思」，用户自己发现不了** |
| **②** | **`across` ／ `through`** | 中文「穿过」**一个词管两种地形**（平地／有东西包着），英语强制二选一 | **最系统**：剑桥中文侧实测两者对译**都是「穿过」**（逐字见上表）；剑桥英文侧专门列了典型错误 `Not: We cycled across a number of small villages.`（§4.2 逐字） |
| **③** | **`along`** | 中文「沿着」**是干净直译**，负迁移弱 | 拟错句主要是**词序／搭配**（`*along the park` 把公园当长条物），不是「换了词」 |
| **④** | **`around`** | 中文「绕着／围着」对译清楚 | **负迁移最弱**：中文有专门说法，且库内 L115 `:21952` 已有 `他绕着车转了一圈。` 的中文锚（虽然英文句是 `It looks new!`，不带 around） |

### 2.2 逐条回答任务书的三个混淆问题

#### （1）`into` 与 `in`——**值得独立成课，且必须是本批第 1 课**

**理由 A（跨 173 课的对照）**：`in` 的立岗课是 **L18**（`:3315` `My hat is in the box.`）。到 L191 时，用户已在「`in`＝在里面」上练了 173 课，**这个锚极牢**——而它恰恰是最强的干扰源。**剑桥原文把这个对照放在同一页最显眼处**（逐字见 §4.2）：

> `Compare` 　`She's gone for a walk in the garden.`（`She is in the garden walking.`）　`She walked into the garden.`（`She entered the garden.`）

**理由 B（这一课还捎带一个「同一个词两张脸」——命中库内最成熟的模具）**：
`in` 与 `into` 都存在、都对，但**意思不同**：`walked in the room`（在里面走）vs `walked into the room`（走进去）。这与库里**已用过 7 次**的「两张脸」模具完全同型：

| 先例课 | 行号 | 逐字 |
|---|---|---|
| L104 | `:19863` | `title: "同一个 made，两张脸"` |
| L106 | `:20260` | `Let me help you.（第 74 课，我请缨）／lets him play（今天，她放手）—— 两张脸` |
| L113 | `:21544` | `感到版说「我的感受」…让人版说「它让我这样」…同一个中文「无聊」，英语分两张脸` |
| L122 | `:23406` | `title: "同一个 to，两张脸"` |
| L123 | `:23605` | `title: "两张脸的「不」，长得不一样"` |

**⇒ `in` / `into` 是这条模具的第 8 站，属于「收口性质」，不需要新造教学比喻**（`两张脸` GL 实测 = **96**）。

#### （2）`across` 与 `cross`——**不值得成课，且应从本批剔除**

| 实测 | 值 |
|---|---|
| `cross` GL（词边界） | **0** |
| `crossed`／`crosses` GL | **0／0** |
| 剑桥中英词典 `cross` 首义对译 | `越过`；例句 `It's not a good place to cross the road.` → **`这里不适宜横穿马路。`** |

**三条剔除理由：**
1. **词性不同轴**：`cross` 是**动作动词**（自己就是谓语），`across` 是**小词**（要搭在别的动词后面）。**教 `cross` 需要教「一个动词」，教 `across` 需要教「一条路线怎么描述」——两件事。**
2. **我方零基础不需要 `cross`**：库内 `walk` GL=184／`go` GL=910／`run` GL=152 已经能表达全部移动，「横穿马路」用 `walk across the road` 就说清了。**`cross` 是同一个意思的第二套说法，属「换词」**——正是批三十七判定的 **`decide to`／`hope to`／`try to` 同型**（`user-research-verb-to-family-2026-09-21.md` §3.4 逐字：`「缺员若只让已知句型换一个动词，则它不是一课，它是一个词表项。」`）。
3. **中文侧反而支持「不必学」**：剑桥给 `cross` 的中文是 `越过`／`横穿马路`，而给 `across` 的是 `穿过／橫過`——**中文用户嘴边的「过马路」两者都能对**，不构成理解缺口。

**⇒ 裁定：`cross` 不入本批。** 若未来要做，应作为「动词家族的补员」（与 `enter`／`pass` 同批），**不属移动方向族**。

#### （3）`through` 与 `across`——**值得同课对照，且是本批第 2 课的核心**

**这是本批唯一「必须同课」的一对**，三条依据：

**依据 1（外部权威就是同课对照的）**：剑桥专页标题逐字 **`Across, over or through?`**，页内设专节 **`Across or through?`**，开头逐字：

> `When we talk about movement from one side to another but 'in something', such as long grass or a forest, we use through instead of across:`

**依据 2（剑桥给的不是「两个词」而是「一条判据」）**：剑桥同页 `typical errors` 节逐字：

> `When moving from one side to another while surrounded by something, we use through not across:`
> `We cycled through a number of small villages.`
> `Not: We cycled across a number of small villages.`

**⇒ 判据是「中间是不是被东西包着」（`surrounded by something`）——一句话能讲完，但必须两个词同时在场上才能对照。**

**依据 3（中文侧实测两者不可分）**：§2.1 表已证——剑桥双语词典把 `through` 与 `across` **都译成「穿过」**（`他們緩步穿過樹林。`／`她穿過田野／橫過馬路。`）。**中文侧帮不上忙，只能靠英文侧的「地形」判据——所以这两个词必须同课，靠场景对照让用户自己看出差别。**

### 2.3 `along` 与 `around` 为什么同课（第 3 课的立课依据）

| 依据 | 内容 |
|---|---|
| **同一观察任务** | `along` 的牛津定义逐字 `from one end to or towards the other end of something`；`around` 的 `in a circle`。**两者都是「路线的形状」**——一个是「沿着长条走到底」，一个是「绕着圈走」 |
| **中文侧干净** | 逐字对译 `沿着`／`四处`——**没有负迁移干扰，正好适合做「收口型」第 3 课**（在前两课的强干扰之后给一课低难度） |
| **场景天然配对** | 「沿着海滩走」（`along`）与「绕着岛走」（`around`）**在同一个户外场景里能同时出现** |
| **难度** | `along` 牛津标 **A2**、`around` **A1**，是本族里英文侧最容易的两个 |

---

## §3 每课的 targetSentence 逐词设计

> ⚠️ **难度守门约束**（`grammarLessons.test.ts:790` 逐字断言名：`"相邻课的单句最长词数不得跳超 5 词"`）：**L190 目标句 = 5 词**，故 **L191 最长单句 ≤ 10 词**；后续同理逐级约束。本轮三课目标句全部设计为 **5 词**，跳变为 **0**，**远在门内**。

### 3.0 三课总览

| 课 | 课注 id | number | 轴 | 新词 | **targetSentence** | 词数 | scene |
|---|---|---|---|---|---|---|---|
| **L191** | `lesson-191-into-the-room` | 191 | 甲·看终点 | `into`（1） | **`I walked into the room.`** | **5** | `mansion` |
| **L192** | `lesson-192-across-and-through` | 192 | 乙·看中间 | `across`／`through`（2） | **`We walked across the playground and through the forest.`** | **9** | `forest` |
| **L193** | `lesson-193-along-and-around` | 193 | 丙·看路线形状 | `along`／`around`（2） | **`The dog ran around the tree and along the beach.`** | **10** | `island` |

**ⓘ L191 → L192 词数 5→9 = 跳 +4 ✅（≤5）；L192 → L193 词数 9→10 = 跳 +1 ✅。三课全部在门内。**

**ⓘ 若写课方希望把 L192 压短**：可改为 **`We walked across the park and through the forest.`（9 词，同样 +4 跳变）**——`park` GL=230（在词表池，逐字见 §5），比 `playground`（GL=3）更省。**两个版本都可用，推荐前者（`playground` 更贴「校园」连续剧，且 L93 `:17680` `This playground is old.` 已带过这个场景）。**

### 3.1 L191 —— `I walked into the room.`（5 词）

| # | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| 词 | I | walked | into | the | room |
| 状态 | 已教（GL=5421） | 已教（GL=9；L10 `:1837` `I walked home.`） | **新词** | 已教（GL=2772） | 已教（GL=24；L16／L18／L23…，在词表池） |

**逐词核对（D 层口径，`/tmp/pool.js` 实跑）**：`I walked into the room.` → **新词仅 `into` 1 个** ✅

**中文意图**：`我走进了那个房间。`

**为什么是这句**：
- **必须用 `walked` 而非 `went`**：`went` 是三单／过去不规则形，会把注意力从 `into` 上分走；`walked` 是 L10 已教的最规整过去形（`:1896` 逐字 `大多数动词很有规律：昨天版就是加 -ed。watch→watched、play→played、walk→walked`），**用户对它零负担**。
- **`into` 与 `in` 的对照需要「同一个动词、同一个地方」**——`walked` ＋ `the room` 与 L18 的 `is` ＋ `the box` 形成结构回响，但又不同词（不重复）。
- **`room` 在词表池已 10 课**（首见 L16），是本族最省的名词零件。

**场景设计（`mansion`，实测末次使用 L153，距今 38 课）**：
> `sceneSetupZh`：`周末在老宅帮外婆收拾东西，小美端着一摞书穿过走廊。门虚掩着，她推开那扇门，走了进去。`

**为什么选 `mansion`**：① 自有「走廊／一扇扇门」的房间结构，**是 `into` 最自然的场景**（要「进到里面」得先有「里面」）；② 实测**末次使用 L153**（距今 38 课），**不撞近期**；③ `campus` GL=57／`city` GL=38 已过载，`forest`／`desert`／`ocean` 刚被 L186–L190 连续占用，**必须避开**。

### 3.2 L192 —— `We walked across the playground and through the forest.`（9 词）

| # | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| 词 | We | walked | across | the | playground | and | through | the | forest |
| 状态 | 已教（GL=431） | 已教（GL=9） | **新词** | 已教 | 已教（GL=3，L93／L100，**在词表池**） | 已教（GL=302） | **新词** | 已教 | 已教（GL=5，L10／L75／L187，**在词表池**） |

**逐词核对**：`We walked across the playground and through the forest.` → **新词 = `across`／`through` 2 个** ✅

**中文意图**：`我们穿过操场，又穿过森林。`

**为什么是这句**：
- **它把「地形判据」直接摆在句子里**：`playground` 是**空场**（看得见两头）→ `across`；`forest` 是**被树包着**（四周都是树）→ `through`。**用户不需要读解释，读句子就能看出为什么换词**——这是本课最重要的一张王牌。
- **`and` 是 L19 已教的连接词**（`:3521` 逐字 `把两个词或两句话连起来：一个方向用 and（又……又……）`），把两段并列起来是库里用过的做法（L182–L185 全是 `and` 拼接的收口课）。
- **9 词在门内**（L190 = 5 词，跳 +4 ≤ 5 ✅）。
- **中文侧设计说明**：中文故意译成「穿过操场，又穿过森林」——**同一个「穿过」出现两次**，让用户看到中文没变而英文换了词，**这正是要教的点**。

**场景设计（`forest`，实测末次使用 L187，距今 4 课 ⚠️）**：
> `sceneSetupZh`：`学校操场后面就是那片林子。小美和同桌从操场这头走到那头，又沿着小路钻进了林子里。`

**⚠️ 场景选择的权衡（诚实登记）**：`forest` **刚被 L187 用过（距今仅 4 课）**。但本课**必须用 `forest`**——因为它是全库唯一已进词表池的「被树包着的地形」名词（`forest` GL=5，`woods` GL=0、`jungle` GL=0、`bushes` GL=0 全新词）。替代方案：**改用 `park`**（GL=230，在词池）——`We walked across the park and through the forest.`，但 `park` 是**空场**，会与 `across` 的地形判据冲突（公园里既空又有树），**反而削弱教学**。**建议保留 `forest`，接受 4 课间隔**（近 8 课场景已有 L188 `city`／L189 `campus`／L190 `ocean` 连续不同，L192 用 `forest` 与 L187 间隔 5 课，实测不违反任何断言）。

### 3.3 L193 —— `The dog ran around the tree and along the beach.`（10 词）

| # | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| 词 | The | dog | ran | around | the | tree | and | along | the | beach |
| 状态 | 已教 | 已教（GL=7，**在词表池**） | 已教（GL=2：`:2343` L12 `distractors: ["ran"]`；L126 `:24143` `I just ran a race!`；**在词表池**） | **新词** | 已教 | 已教（GL=4，L17，**在词表池**） | 已教 | **新词** | 已教 | 已教（GL=3，L15，**在词表池**） |

**逐词核对**：`The dog ran around the tree and along the beach.` → **新词 = `around`／`along` 2 个** ✅

**中文意图**：`那只狗绕着树跑，又沿着海滩跑。`

**为什么是这句**：
- **`around` 需要「绕一圈」的形状 → 树**（`tree` L17 已教，是库里唯一「可以绕着转」的现成物件）；**`along` 需要「长条」的形状 → 海滩**（`beach` L15 已教，L15 `:2918` 有 `I want to go to the beach.`）。
- **`dog` 是全库最省的主语**（GL=7，且 `ran` 的施动者用狗最自然，避免「人绕着树跑」的怪异感）。
- **`ran` 已在词表池**（L12 的 `distractors` 与 L126 的例句都把它带进来了），**但从未出现在任何一课的目标句里**——本课首次把它推到正文位。
- **10 词在门内**（L192 = 9 词，跳 +1 ✅）。

**⚠️ 需要写课方注意的一处**：`ran` 是**不规则过去形**（`run → ran`），L10 教的是「加 -ed」的规则形。**建议在 `deepDive` 里用一句带过**，或**改用规则形 `walked`**：`The dog walked around the tree and along the beach.`（10 词，同样 2 新词）——**后者更稳，推荐作为备选**（`walked` 已在词表池、且是 L10 的样板词）。

**场景设计（`island`，实测末次使用 L71，距今 120 课）**：
> `sceneSetupZh`：`海岛上的最后一天。小美蹲在沙滩边，看那只民宿的狗绕着椰子树转了两圈，又沿着海滩一路跑远。`

**为什么选 `island`**：① 实测**末次使用 L71（距今 120 课）**——是全部 14 个场景里**间隔最久**的之一（仅 `magic` L45 距今 146 课更久）；② 「树＋海滩」两种地形在岛上**同时存在**，正是本课两种路线形状所需；③ `island` 的中文标签逐字 `海岛椰风`（`AdventureScene.tsx:35`），自带热带户外感。

### 3.4 三课的「一课一增量」自查（对齐批三十七 §3.4 判据）

| 课 | 本课会让用户新学会的操作 | **是否只是换词？** |
|---|---|---|
| **L191** | ① 把「走」后面加个小词 `into`；② **新判据：说「到哪里去了」时，终点是「里面」要用 `into`，不是 `in`**；③ **同一对词两张脸**（`walked in the room` ≠ `walked into the room`） | ✅ **不是换词**——②③ 是新的判据与新的「两张脸」对照 |
| **L192** | ① 两个新小词；② **新判据：中间空着用 `across`、中间被包着用 `through`** | ✅ **不是换词**——② 是**一条二选一的判据**，库里从未有过 |
| **L193** | ① 两个新小词；② **新判据：路线是长条用 `along`、是圈用 `around`** | ✅ **不是换词**——② 同上 |

**⇒ 三课各有独立判据，均通过「一课一增量」检验。**

---

## §4 外部权威依据

> ⚠️ **抓取诚实声明**：本轮抓取**部分成功、部分失败**，逐源如实登记如下。**所有成功抓取的引文均逐字来自原始 HTML**（用 `curl` 取页后正则剥标签），**未做任何改写**。

### 4.1 抓取结果总表（诚实登记）

| 源 | URL | 结果 |
|---|---|---|
| Cambridge Grammar · `In, into` | `https://dictionary.cambridge.org/grammar/british-grammar/into` | ✅ **HTTP 200，抓到全文** |
| Cambridge Grammar · `Across, over or through?` | `https://dictionary.cambridge.org/grammar/british-grammar/across` | ✅ **HTTP 200，抓到全文** |
| Cambridge Grammar · `Along or alongside?` | `https://dictionary.cambridge.org/grammar/british-grammar/along` | ✅ **HTTP 200，抓到全文** |
| Cambridge Grammar · `At, in and to (movement)` | `https://dictionary.cambridge.org/grammar/british-grammar/at-in-and-to-movement` | ✅ **HTTP 200，抓到全文** |
| Cambridge 双语（英汉）词典 · `through`／`across`／`into`／`along`／`around`／`cross` | `https://dictionary.cambridge.org/dictionary/english-chinese-simplified/through` 等 | ✅ **HTTP 200，抓到中文对译** |
| **British Council LearnEnglish · prepositions of movement** | 尝试 6 个 URL（见下） | ❌ **全部失败：404 或域名不可达** |
| Oxford Learner's Dictionaries · CEFR 等级 | `https://www.oxfordlearnersdictionaries.com/definition/english/across_1` 等 | ✅ **HTTP 200，抓到逐义项 CEFR 标注** |
| **中文侧语法教学文章** | 知乎 `zhuanlan.zhihu.com/p/357681832`（「英语疑难解析：介词across用法详解」）／百度百科 `baike.baidu.com/item/across/4701561` | ❌ **两家均 HTTP 403 Forbidden，抓不到** |
| **EF 英孚中国** | `https://www.ef.com.cn/englishfirst/english-resources/english-grammar/prepositions-of-movement/` | ❌ **HTTP 200 但内容重定向为公司营销首页，无语法内容——等同抓不到** |

### 4.2 ⚠️ **British Council 抓不到（明确声明）**

**任务书要求「查 British Council LearnEnglish」。本轮结论：抓不到，不是「没找到」而是「站点不可达」。**

```bash
curl -sL -o /dev/null -w "%{http_code}" --max-time 20 \
  -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120" \
  "https://learnenglish.britishcouncil.org"
# → HTTP=000        （域名级不可达，非 404）
curl -sL -o /dev/null -w "%{http_code}" --max-time 20 -A "Mozilla/5.0" \
  "https://www.britishcouncil.org"
# → HTTP=000
```

**尝试过的具体 URL（全部失败）**：

| URL | 结果 |
|---|---|
| `https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/prepositions-of-movement` | **404**（WebFetch 明示 `The server returned HTTP 404 Not Found.`） |
| `https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar/prepositions-of-movement` | **404** |
| `https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2/prepositions-movement` | **404** |
| `https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2/prepositions-of-movement` | **404** |
| `https://learnenglish.britishcouncil.org/english-grammar-reference/prepositions-of-movement` | **curl HTTP=000**（域名不可达） |
| `https://learnenglish.britishcouncil.org/grammar` | ✅ **经 WebFetch 可读**（非 curl） |

**⚠️ 但这次失败给出了一条极有价值的负面证据（见 §4.3）：British Council 的 A1-A2 与 B1-B2 语法目录里都没有「prepositions of movement」这一课——这与我方缺口完全同构，是本批最强的产品论据。**

### 4.3 外部权威侧的「位置」判定：**`in/on/at` 是 A1-A2 的正式课题，移动方向族不是**

**这是本批最意外、也最有价值的发现。**

**British Council A1-A2 语法目录**（`https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar`，经 WebFetch 逐条读取）**含两课位置／时间小词**：

| 课题 | URL（站内路径） |
|---|---|
| `Prepositions of place: 'in', 'on', 'at'` | `/free-resources/grammar/a1-a2/prepositions-place` |
| `Prepositions of time: 'at', 'in', 'on'` | `/free-resources/grammar/a1-a2-grammar/prepositions-of-time-at-in-on` |

**⇒ 我把该目录的全部 18 课列了出来，其中「小词（preposition）」相关的只有上列 2 课 + `Adjectives and prepositions`——没有一课叫 `prepositions of movement`。**

**同页还有一课逐字标题：`Verbs followed by '-ing' or infinitive`**（`/free-resources/grammar/a1-a2/verbs-followed-ing-or-infinitive`）——**这正是批三十七研究的 `verb + to` 家族**，它在 BC 侧**有独立课题**。

**⇒ 「位置（in/on/at）」有、「`verb + to`」有、**「移动方向」没有**——British Council 的课程编排把我方的两个缺口（静态位置族已补全 ✅／移动方向族全零 ❌）的边界画得一模一样。**

**B1-B2 目录**（`https://learnenglish.britishcouncil.org/grammar/b1-b2-grammar`，经 WebFetch）**同样没有** prepositions of movement 课题。

**BC 的 place 课题页面内文（`/free-resources/grammar/a1-a2/prepositions-place`，经 WebFetch 逐字引用）**：

> `We can use the prepositions in, on and at to say where things are. They go before nouns.`
> `We use in to talk about a place that is inside a bigger space, such as a box, a house, a city or a country.`
> `We use on to talk about location on a surface.`
> `We use at in many common phrases, especially when we are talking about a place for a specific activity.`

**⚠️ 该页「does not mention movement or direction prepositions such as into, onto, across, or through」**（WebFetch 明确回报）——**静态位置与移动方向在 BC 侧是被完全分开的两块，且只教了前一块。**

### 4.4 Cambridge Grammar 逐字引用（**三处以上，全部 HTTP 200 抓到原文**）

#### 引用 ①　`In, into` —— 「进到里面」是独立课题

**URL**：`https://dictionary.cambridge.org/grammar/british-grammar/into`
**页面标题逐字**：`In, into - Grammar - Cambridge Dictionary`
**章节归属逐字**：`Grammar > Prepositions and particles > In, into from English Grammar Today`

**逐字原文（原文含内嵌链接，此处保留文字与标点，链接文字已还原）**：

> `In and into are prepositions.`
>
> `In, into : position and direction`
>
> `We use in to talk about where something is in relation to a larger area around it:`
> `A: Where's Jane? B: She's in the garden . I've left my keys in the car.`
>
> `We use into to talk about the movement of something, usually with a verb that expresses movement (e.g. go , come ). It shows where something is or was going:`
> `A: Where's Jane? B: She's gone into the house . Helen came into the room.`
>
> `Compare`
> `She's gone for a walk in the garden.` → `She is in the garden walking.`
> `She walked into the garden.` → `She entered the garden.`

**⇒ 这条引文是 L191 立课的直接外部依据**：① «into» 与 «in» 是**同一课题内的对照**；② 剑桥给的对照句结构 `walk in the garden` vs `walk into the garden` **与我设计的 `walked in the room` vs `walked into the room` 完全同型**；③ 逐字 `It shows where something is or was going`——**「看终点」正是剑桥给 `into` 的定位**。

**同页另一条（`into` 的教学难点）**：

> `With some verbs (e.g. put , fall , jump , dive ) we can use either in or into with no difference in meaning:`
> `Can you put the milk in/into the fridge? Her keys fell in/into the canal.`

**⇒ 这条支持「不要把 `into` 教成绝对规则」**：某些动词两种都对。**建议写课方在 `deepDive` 里诚实说明「有些动词两种都行」（但 `walk` 不在此列）**，避免用户学到一条过硬的规则后被 `put in/into` 打脸。

#### 引用 ②　`Across, over or through?` —— `across` 与 `through` 的判据

**URL**：`https://dictionary.cambridge.org/grammar/british-grammar/across`
**页面标题逐字**：`Across, over or through ? - Grammar - Cambridge Dictionary`
**章节归属逐字**：`Grammar > Easily confused words > Across, over or through? from English Grammar Today`

**逐字原文（节选，`Across` 段与 `Across or through?` 专节全文）**：

> `Across`
> `We use across as a preposition (prep) and an adverb (adv). Across means on the other side of something, or from one side to the other of something which has sides or limits such as a city, road or river:`
> `We took a boat [PREP]across the river.`
> `[PREP]Across the room, she could see some old friends. She got up and went to join them.`
> `My neighbour came [ADV]across to see me this morning to complain about our cat.`
>
> `Across or through?`
> `Movement`
> `When we talk about movement from one side to another but 'in something', such as long grass or a forest, we use through instead of across:`
> `I love walking through the forest. (through stresses being in the forest as I walk)`
> `Not: I love walking across the forest.`
> `When my dog runs through long grass, it's difficult to find him. (through stresses that the dog is in the grass)`
> `Not: When my dog runs across long grass …`

**⚠️ 这条引文对本批有决定性意义——请注意剑桥给的正面例句逐字是 `I love walking through the forest.` 与 `When my dog runs through long grass...`：**

| 剑桥例句（逐字） | 我的 L192／L193 设计 | 关系 |
|---|---|---|
| `I love walking **through the forest**.` | L192：`We walked across the playground and **through the forest**.` | **同一地形（forest）、同一动词（walk）** ✅ |
| `When my **dog runs through** long grass...` | L193：`The **dog ran around** the tree and **along** the beach.` | **同一施动者（dog）＋同一动词家族（run）** ✅ |

**⇒ 我方两句的核心搭配与剑桥的正面例句**高度重合**，这不是模仿，而是同一判据下的自然表达——外部权威独立验证了这两句的选词。**

**同页 `typical errors` 节逐字（本批最有力的一条教学依据）**：

> `Across, over and through: typical errors`
> `When moving from one side to another while surrounded by something, we use through not across:`
> `We cycled through a number of small villages.`
> `Not: We cycled across a number of small villages.`
> `When we talk about something extending or moving from one side to another, we use across not on:`
> `The papers were spread across the table.`
> `Not: The papers were spread on the table.`

**⇒ 剑桥把 `through` vs `across` 明确标为 `typical errors`（典型错误）——这正是我方对照卡要防的错。** 而且剑桥的**错句示范逐字是 `We cycled across a number of small villages.`**——**与我在 §5.2 设计的 `*We walked across the forest.` 完全同型**（把「被包着的地形」配上 `across`）。

#### 引用 ③　`Along or alongside?` —— `along` 的定位与「长条物」约束

**URL**：`https://dictionary.cambridge.org/grammar/british-grammar/along`
**页面标题逐字**：`Along or alongside ? - Grammar - Cambridge Dictionary`
**章节归属逐字**：`Grammar > Easily confused words > Along or alongside? from English Grammar Today`

**逐字原文（`Along` 段全文）**：

> `Along and alongside are prepositions or adverbs.`
>
> `Along`
> `As a preposition, along means 'in a line next to something long and thin', e.g. a road, a path:`
> `There were lots of shops along the main street.`
> `I saw three different boats along the bank of the river.`
> `We use along as an adverb with verbs of motion meaning 'together with':`
> `Why don't you come along with us to the party?`
> `They said they'd bring the bikes along and we can ride to the swimming pool.`

**⇒ 这条给出 `along` 的唯一硬约束逐字：`'in a line next to something long and thin'`——「长条」是必须的。** 这直接支撑 §5.3 的错句 `*We walked along the park.`（公园不是长条，`park` 不是 `road`／`path`）。

**⚠️ 同时暴露一个风险**：剑桥把 `along` 与 **`alongside`** 做成同页对照（`Along or alongside?`）。`alongside` 在我方全库 **GL=0，也是缺口**。**建议本批不引入 `alongside`**（它属「贴旁边」的位置轴，与 L79 的 `next to`／L80 的 `in front of` 同族，**应并入静态位置族的后续补员**，不属移动方向族）。

#### 引用 ④　`At, in and to (movement)` —— 印证「移动」是独立课题

**URL**：`https://dictionary.cambridge.org/grammar/british-grammar/at-in-and-to-movement`
**页面标题逐字**：`At, in and to (movement) - Grammar - Cambridge Dictionary`
**章节归属逐字**：`Grammar > Prepositions and particles > At, in and to (movement) from English Grammar Today`

**逐字原文（节选）**：

> `We use to when we are talking about movement in the direction of a point, place, or position:`
> `Let's all go to the cinema tonight!`
> `When you come to my place, you'll see our new pet rabbit.`
> `We often use the combination from … to … when we are talking about moving from one point to another:`
> `Is it far from your house to the nearest shop?`
>
> `Warning: Go in is a commonly used phrasal verb meaning 'enter'. We don't use it to talk about travelling to or moving in the direction of a place:`
> `Why don't you go in? (phrasal verb meaning 'enter')`
> `When did you go to Barcelona? (preposition to)`
> `Not: When did you go in Barcelona?`
>
> `We say that we arrive at a place, when we see it as point, but we arrive in a larger area (e.g. a city or a country). We don't use to with arrive:`
> `I arrived at the station just in time. (arrive at a place)`
> `Not: I arrived to the station …`

**⇒ 三条用途**：① 剑桥把「移动」**单列为 `(movement)` 课题**，与静态的 `At, on and in (place)` **互为平行页**——**与我方「位置词家族已建／走法词家族全零」的分法完全同构**；② 逐字 `Not: The papers were spread on the table.`／`Not: When did you go in Barcelona?`——**剑桥的 `Not:` 格式正是我方 `wrong:`／`whyZh` 对照卡的原型**，可作为对照卡的格式背书；③ **`from … to …` 与 `arrive at/in` 全库 GL=0，也是缺口**（见 §6 携带项）。

### 4.5 Oxford CEFR 档位（**外部「档位」依据**）

**URL 模板**：`https://www.oxfordlearnersdictionaries.com/definition/english/<词>_1`
**抓取方式**：`curl` 取 HTML，正则读 `<li class="sense" ... cefr="a1" ...>` 属性的逐义项标注。

| 词 | 牛津义项 | **CEFR** | 逐字定义 | 逐字例句 |
|---|---|---|---|---|
| `into` | 1 | **A1** | `to a position in or inside something` | `Come into the house.` ／ `She dived into the water.` |
| `into` | 5 | A2 | `used to show a change in state` | `The fruit can be made into jam.` |
| `into` | 7 | B1 | `about or in connection with something` | `an inquiry into safety procedures` |
| `across` | 1 | **A1** | `from one side to the other side of something` | `He walked across the field.` ／ `I drew a line across the page.` |
| `across` | 2 | **A1** | `on the other side of something` | `There's a bank right across the street.` |
| `through` | 1 | **A1** | `from one end or side of something/somebody to the other` | `The burglar got in through the window.` |
| `through` | 4 | A2 | `past a barrier, stage or test` | `Go through this gate, and you'll see the house on your left.` |
| `around` | 1 | **A1** | `surrounding somebody/something; on each side of something` | `The house is built around a central courtyard.` |
| `around` | 3 | **A1** | `in a circle` | `They walked around the lake.` |
| `along` | 1 | **A2** | `from one end to or towards the other end of something` | `They walked slowly along the road.` |
| `along` | 2 | **A2** | `in a line that follows the side of something long` | `Houses had been built along both sides of the river.` |

**对照：本批判定「不捎带」的四词**：

| 词 | 移动义 CEFR | 逐字定义／例句 | 结论 |
|---|---|---|---|
| `over` | **A1**（移动义确在 A1） | `from one side of something to the other; across something`：`a bridge over the river`／`They ran over the grass.`；`so as to cross something and be on the other side`：`She climbed over the wall.` | ⚠️ **移动义是 A1**（比 `along` 还早）——**这加强了「应单独立项」的判断，而非「可捎带」**：它自成一套（上下／越过），需自己的课 |
| `under` | A1（`in, to or through a position that is below something`） | `Have you looked under the bed?` | **已教**（L26 静态义，进「方位八位」）；**移动义**（`walked under the bridge`）属上述「上下轴」 |
| `past` | A1（**但全是时间义**） | 4 个义项逐字全为时间：`gone by in time`（`in past years/centuries`）／`gone by recently; just ended`／`belonging to an earlier time`／`connected with the form of a verb used to express actions in the past` | ❌ **牛津 `past` 入口以时间义为主**（`past_1`）；**移动义（`walked past the shop`）须查 `past_2`（副词／介词）**——**本轮未抓到 `past_2`，故「`past` 移动义的档位未核实」，登记进 §6** |
| `off` | **A2**（`down or away from a place; at a distance in space or time`） | `I called him but he ran off.`／`I gave up riding after I fell off.` | ❌ **A2，比本批五词晚**；且 `off` 的 5 个义项里 1 个 A2、其余为「取下／关闭／休假／打折」——**移动只是它第 3 顺位的用法** |

**⇒ 档位判读（决定教学顺序的外部依据）**：

| 结论 | 依据 |
|---|---|
| **五词全在 A1–A2**，与库里 L191 的位置（A1/A2 末段）**匹配** | Oxford 实测：`into`／`across`／`through`／`around` = **A1**，`along` = **A2** |
| **教学顺序建议：A1 三词（`into`／`across`／`around`）在前，A2 两词（`through` 的 A2 义项／`along`）在后** | 但**本轮的设计顺序是由「看什么」决定的**（§1.2），非由 CEFR 决定；两者**不冲突**：轴甲的 `into` 是先 A1；轴乙的 `across`（A1）+`through`（A1 首义）；轴丙的 `around`（A1）+`along`（A2） |

### 4.6 中文侧依据（**诚实声明：正式语法教学文章抓不到**）

| 尝试的源 | URL | 结果 |
|---|---|---|
| 知乎「英语疑难解析：介词across用法详解」 | `https://zhuanlan.zhihu.com/p/357681832` | ❌ **HTTP 403 Forbidden** |
| 百度百科 `across` 词条 | `https://baike.baidu.com/item/across/4701561` | ❌ **HTTP 403 Forbidden** |
| 百度「库库」`cross 和across的区别` | `https://kuku.baidu.com/landing/tscp_doc/101939c5a30468deb33b358b6ab320d6` | ⚠️ WebFetch 从**搜索结果页摘要**读到该文标题，**但正文未抓到** |
| EF 英孚中国 `prepositions of movement` | `https://www.ef.com.cn/englishfirst/english-resources/english-grammar/prepositions-of-movement/` | ❌ **HTTP 200 但重定向到公司营销首页，无语法内容** |
| `yygrammar.com`／`hjenglish.com`／`xdf.cn` | 首页 | ⚠️ 首页可达（HTTP 200），**但本轮未定位到具体文章 URL；返回内容为空壳（size=84）** |

**⇒ 中文侧「正式语法教学文章」本轮抓不到，不编造。** 但**中文侧最硬的证据本轮已拿到**——**剑桥双语（英汉）词典**给出的官方对译（这是一手权威、非二手教学文章），逐字见 §2.1 与下方 §4.7。

**⚠️ 对任务书「中文里各自的对译陷阱」的回答，本轮的依据来源是**剑桥双语词典的官方对译**（一手），不是中文教学文章（二手、抓不到）。**

### 4.7 剑桥双语（英汉）词典官方对译（**本批「中文陷阱」的一手证据**）

**URL 模板**：`https://dictionary.cambridge.org/dictionary/english-chinese-simplified/<词>`

| 词 | 剑桥给出的英文定义（逐字） | 剑桥给出的中文对译（逐字） | 剑桥给出的中英例句对（逐字） |
|---|---|---|---|
| `through` | `from one end or side of something to the other` | `通過` | `They walked slowly through the woods.` → **`他們緩步穿過樹林。`** |
| `across` | `from one side to the other of something with clear limits, such as an area of land, a road, or a river` | `從` | `She walked across the field/road.` → **`她穿過田野／橫過馬路。`** |
| `into` | `to the inside or middle of a place, container, area, etc.` | `進入` | `Let's go into the garden.` |
| `along` | `from one part of a road, river, etc. to another` | `沿着` | `a romantic walk along the beach/river` → `沿着海滩／河边的浪漫散步` |
| `around` | `in a position or direction surrounding, or in a direction going along the edge of or from one part to another (of)` | `四处` | `We sat around the table.` |
| `cross` | `to go across from one side of something to the other` | `越过` | `It's not a good place to cross the road.` → **`这里不适宜横穿马路。`** |

**⇒ 这张表是本批「负迁移排序」的核心证据（§2.1）：**

> **`through` 与 `across` 的剑桥官方中文对译都含「穿过」**（`他們緩步穿過樹林。`／`她穿過田野／橫過馬路。`）。**中文侧无法区分这两个词——这正是负迁移的实证，也是「`through` 与 `across` 必须同课对照」的外部依据。**
>
> **`into` 的官方对译是「進入」，而 `in` 是「在…里面」**——中文两个说法**看起来分得开**，但**中文口语里「我进房间了」和「我在房间里」都能说「进／在」，用户会顺手用 `in`**。剑桥在 `In, into` 页专门用 `Compare` 把两者并排，**说明连剑桥都把这里当高风险混淆点**。

### 4.8 外部依据小结（回答任务书「这些词在教学体系里的位置」）

| 问题 | 外部答案 | 源 |
|---|---|---|
| 这些词在英文教学体系的哪个等级？ | **A1–A2**（Oxford 逐义项：`into`／`across`／`through`／`around` = A1；`along` = A2） | Oxford Learner's Dictionaries（§4.5） |
| 和什么一起教？ | **`in` / `into` 同课题**（剑桥 `In, into`）；**`across` / `over` / `through` 同页**（剑桥 `Across, over or through?`）；**`along` / `alongside` 同页**（剑桥 `Along or alongside?`）；**移动 vs 静态分成两个平行课题**（剑桥 `At, in and to (movement)` vs `At, on and in (place)`） | Cambridge Grammar（§4.4） |
| 权威课程体系有没有把它编成独立课题？ | **British Council 的 A1-A2 与 B1-B2 目录都没有 `prepositions of movement` 课题**；只有 `prepositions of place: in/on/at` 与 `prepositions of time: at/in/on` | British Council（§4.3，**站点部分不可达，但目录页经 WebFetch 读到**） |
| 「`in/on/at` 位置 vs 移动方向」是被分开教的吗？ | **是，且权威侧只教了位置那一块。** BC place 页「does not mention movement or direction prepositions such as into, onto, across, or through」 | British Council（§4.3） |

**⇒ 产品论据（本批最强的一条）**：**我方「位置词家族已建（L18／L26／L79／L80／L81，九位齐）、走法词家族全零」的分法，与 British Council 的课程编排分法完全一致——而 BC 也只做了前一半。这意味着移动方向族是「A1–A2 里被主流体系漏掉的一块」，不是「超纲内容」。**

---

## §5 每课错句清单（对照卡 `wrongMark` 用）

> **设计约束**（对齐 §0.7 与任务书）：每课 **6 张对照卡 = 3 张带 `wrongMark` 的错句 + 3 张 `bothRight` 双正解**（近课水位；全库严格 3+3 为 82/190）。
> **全部错句已经「连续子序列口径」全库查重，实测 cont=0**（见 §5.4 输出），**即无一是库内已有句子**。

### 5.1 L191 错句（`into`）——**本批负迁移最强的一课**

| # | wrong | wrongMark | correct | 为什么中文母语者会这么说（负迁移机制） |
|---|---|---|---|---|
| ① | `I walked in the room.` | `in` | `I walked into the room.` | **中文「进」自带「到里面」**——用户说「我走进了房间」，脑子里「进」＝到里面，于是只翻出 `in`（L18 教的「在里面」）。**这句本身是合法英文**，意思是「我在房间里走」——**错误不产生怪句子，用户自己发现不了**，这是它排第一的原因 |
| ② | `I walked into room.` | `room` | `I walked into the room.` | 中文「走进房间」**可以不说「那个」**（「我进房间了」完全通顺）。英语 `room` 是可数名词，单数光身出场要带 `a`／`the`——**L1 `:2870` 附近已教过同型错**（`I am student.` → `I am a student.` 逐字 `whyZh: "说「我是一名学生」，a 不能丢"`），本课是同一坑在 `into` 上的复现 |
| ③ | `I walked to the room.` | `to` | `I walked into the room.` | **中文「走到房间」与「走进房间」只差一个字**，而 `to` 是 L9 教的第一批小词（`I go to the library.`），用户最熟练——**顺手就用 `to`**。`to` 只说「朝那个方向去」，**不说「进去了」** |

### 5.2 L192 错句（`across` / `through`）——**判据二选一的错**

| # | wrong | wrongMark | correct | 为什么中文母语者会这么说（负迁移机制） |
|---|---|---|---|---|
| ① | `We walked across the forest.` | `across` | `We walked through the forest.` | **中文「穿过森林」的「穿过」一个词管所有地形**。用户不知道英语要看「中间有没有东西包着」——**这正是剑桥 `typical errors` 逐字给的错句同型**（`Not: We cycled across a number of small villages.`） |
| ② | `We walked through the playground.` | `through` | `We walked across the playground.` | **反向错误（同一判据的另一半）。** 用户学会 `through` 之后**过度泛化**：操场是空场，没有东西包着，应该用 `across`。**中文「穿过操场」照样说「穿过」**，中文侧无提示 |
| ③ | `We walked through the road.` | `through` | `We walked across the road.` | **中文「穿过马路」是最高频的「穿过」**（每天过马路），用户会把最熟的「穿过马路」直译成 `through the road`。**而马路是「有清楚边界、中间空着」的平地**——剑桥 `across` 定义逐字就点了 `a road`（`such as a city, road or river`） |

**⚠️ 本课对照卡设计说明**：
- **①② 成对**（一个方向错、一个反向错），**同课出现才能真正把判据讲清**——这是 §1.5 「两者必须同课」的教学理由在对照卡上的体现。
- **③ 是最有价值的一张**：它用用户**每天都做的事**（过马路）来锚定 `across`。剑桥 `across` 定义里逐字含 `a road`，**外部权威直接支持这个例句选择**。
- **错句 ① 的 `wrongMark` 建议标 `across` 而非整段**——因为用户的错就在这一个词上（库里 `wrongMark` 既标单词也标多词，如 L1 `:2836` `wrongMark: "Am I"`）。

### 5.3 L193 错句（`along` / `around`）——**「长条」与「圈」的错**

| # | wrong | wrongMark | correct | 为什么中文母语者会这么说（负迁移机制） |
|---|---|---|---|---|
| ① | `The dog ran around the beach.` | `around` | `The dog ran along the beach.` | **中文「在海滩那边跑」可以说「绕着海滩跑」**（口语里「绕着」有时指「在那一片」）。用户想表达「在海滩那一片跑」时，会选 `around`。**但 `beach` 是长条地形**，剑桥 `along` 定义逐字要求 `'in a line next to something long and thin'` |
| ② | `The dog ran along the tree.` | `along` | `The dog ran around the tree.` | **反向错误。** 中文「沿着树跑」虽然别扭，但用户学会 `along`＝「沿着」后会把「沿着」硬套到任何名词上。**`tree` 是圆柱体，不是长条**——`along` 的「沿途」义要求一条线（路／河／岸），**树没有「沿途」** |
| ③ | `The dog ran along the park.` | `along` | `The dog ran along the beach.` | **中文「沿着公园跑」＝「在公园边上跑」，通顺。** 用户把 `park` 当「一条边」，但 `park` 是**区域**不是**长条**。**剑桥 `along` 的正例逐字是 `There were lots of shops along the main street.`／`I saw three different boats along the bank of the river.`——全是 `street`／`river` 这类长条物**，`park` 不在其列 |

### 5.4 双正解卡（`bothRight`）设计——**每课 3 张**

**ⓘ `bothRight` 卡的用途**：库里 `bothRight: true` 的卡表示「两句都对，但意思不同／来自不同课」——**不是纠错，是对照**（逐字见 L18 `:3402` 附近与 §5.5 样例）。

#### L191（`into`）的 3 张双正解卡

| # | wrong 位（实为对照句） | bothRight | correct | whyZh 建议 |
|---|---|---|---|---|
| ④ | `My hat is in the box.` | ✅ | `I walked into the room.` | `两句都对——第 18 课那个 in 说「在盒子里面」，今天这个 into 说「走进去了」。同一个「里」，一个是停在里头、一个是走到里头。` |
| ⑤ | `I walked to the room.` | ✅ | `I walked into the room.` | `两句都对——第 9 课那个 to 只说「朝房间去」（到没到、进没进都不管），今天 into 说「进去了」。` |
| ⑥ | `She came into the room.` | ✅ | `I walked into the room.` | `两句都对——换个人（she）、换个来的动作（came），into the room 那截原地不动：同一个走法，随你换谁走、怎么走。` |

**⚠️ ④ 的依据**：L18 `:3315` `targetSentence: "My hat is in the box."`（实测 `cont=3`／`prac=1`，复现水位低 ✅）。**这张卡是「跨 173 课的对照」，是本课最有价值的一张。**

#### L192（`across` / `through`）的 3 张双正解卡

| # | wrong 位 | bothRight | correct | whyZh 建议 |
|---|---|---|---|---|
| ④ | `We walked across the playground.` | ✅ | `We walked across the playground and through the forest.` | `两句都对——操场是空场，看得见两头，用 across；林子把四周裹住了，用 through。同一趟路，两段地形不一样。` |
| ⑤ | `We walked through the forest.` | ✅ | `We walked across the playground and through the forest.` | `两句都对——只走林子那段就用这一句。中文「穿过」两个字，英语按中间有没有东西分开说。` |
| ⑥ | `I walked home.` | ✅ | `We walked across the playground and through the forest.` | `两句都对——第 10 课那个 home 后面不垫小词（walk home 不是 walk to home）；今天这两个小词后面都要跟地名。` |

**⚠️ ⑥ 的依据**：L10 `:1837` 逐字 `{ en: "I walked home.", zh: "我走路回了家。" }`（实测 `cont=1`／`prac=0`，水位极低 ✅）。**这张卡把 L10 的「home 不垫小词」与今天的「要垫小词」并排，是一个真实的对照点。**

#### L193（`along` / `around`）的 3 张双正解卡

| # | wrong 位 | bothRight | correct | whyZh 建议 |
|---|---|---|---|---|
| ④ | `The dog ran along the beach.` | ✅ | `The dog ran around the tree and along the beach.` | `两句都对——海滩是长条，顺着走用 along；树是个柱子，绕着转用 around。一趟跑下来，两种走法都用了。` |
| ⑤ | `I sit next to the window.` | ✅ | `The dog ran around the tree and along the beach.` | `两句都对——第 79 课那个 next to 是「停着不动，挨在旁边」；今天这两个是「动着走」：一个贴着走、一个绕圈走。` |
| ⑥ | `There is a cat under the chair.` | ✅ | `The dog ran around the tree and along the beach.` | `两句都对——第 26 课那个 under 说「东西在哪」（停着不动）；今天的 around／along 说「怎么走」（在动）。` |

**⚠️ ⑤ 的依据**：L79 `:14915` `targetSentence: "My desk is next to the window."` 与 `:15095` `answer: "I sit next to the window."`（在词池）。**为避免与 L79 目标句重复，建议用 `:15095` 的 `I sit next to the window.`**（实测 `prac=1` ✅ 水位低）。
**⚠️ ⑥ 的依据**：L26 `:4828` 逐字 `{ en: "There is a cat under the chair.", zh: "椅子下面有一只猫。" }`（实测 `prac=2`／`cont=3` ✅ 水位低）。**它是库里「静态位置」的标志句，与今天「移动」的对照最直接。**

### 5.5 错句清单的实测（全库查重，必须为 0）

```bash
node -e '
const S=require("/tmp/glscan2.js");
const W=["I walked in the room.","I walked into room.","I walked to the room.",
"We walked across the forest.","We walked through the playground.","We walked through the road.",
"The dog ran around the beach.","The dog ran along the tree.","The dog ran along the park."];
for(const s of W) console.log("  cont="+S.cont(s)+"  prac="+((S.prac[s]||[]).length)+"  "+s);'
# → cont=0  prac=0  I walked in the room.
# → cont=0  prac=0  I walked into room.
# → cont=0  prac=0  I walked to the room.
# → cont=0  prac=0  We walked across the forest.
# → cont=0  prac=0  We walked through the playground.
# → cont=0  prac=0  We walked through the road.
# → cont=0  prac=0  The dog ran around the beach.
# → cont=0  prac=0  The dog ran along the tree.
# → cont=0  prac=0  The dog ran along the park.
```

**⇒ 九条错句**全部 `cont=0`**，都是真新错句**（不撞库内已有句子，符合对照卡「错句也要新」的惯例）。

### 5.6 案件（`huntCase`）建议

| 项 | L191 | L192 | L193 |
|---|---|---|---|
| **案号** | **200** | **201** | **202** |
| **案 id** | `hunt-into-the-room` | `hunt-across-and-through` | `hunt-along-and-around` |
| 前缀占用 | ✅ 可用 | ✅ 可用 | ✅ 可用 |

**⚠️ 案件设计的红线约束（实测）**：① 每案错误 **2–6** 处（实测分布 `{2:19, 3:22, 4:154, 5:2, 6:1}`——**4 处最常见**）；② 须留至少一个「干净词」做陷阱（`huntService.test.ts` 断言 `leaves every case with at least one clean (decoy) token`）。

---

## §6 自检与不确定项

### 6.1 本轮**已核实**（列此以明确边界）

| # | 项 | 实测结果 |
|---|---|---|
| 1 | **移动方向族五词全零** | `through`／`around`／`into`／`across`／`along` **GL=0／HC=0／SE=0，且 targetSentence 命中全为 0** ✅（命令见 §7.1） |
| 2 | **关联词也全零** | `toward`=0／`towards`=0／`onto`=0／`cross`=0／`crossed`=0／`crosses`=0／`enter`=0／`entered`=0／`passed`=0 ✅ |
| 3 | **`past` 真词 = 0** | 宽词边界 3 处**全是连字符标识符**（`lesson-24-past-vs-perfect` 等）；真词口径 = **0** ✅（本轮新发现的口径坑，§0.4） |
| 4 | **`over` = 1，静态指远** | 唯一 1 处 L41 `:7640` `Who is the boy over there?` ✅ |
| 5 | **`off` = 1，非移动** | 唯一 1 处 L137 `:26326` `Two months off!`（放假）✅ |
| 6 | **`under` = 26，全静态** | 全部属 L26／L79／L80／L81／L86 的「在下面」；**targetSentence 命中 = 0** ✅ |
| 7 | **静态位置族已建九位** | `in`(488)／`on`(287)／`at`(532)／`under`(26)／`near`(29)／`next to`(121)／`in front of`(29)／`behind`(64)／`between`(63)；**L86 `:16381` 逐字点名「方位八位」** ✅ |
| 8 | **静态族仍有次要缺口** | `beside`=0／`above`=0／`below`=0／`inside`=0／`opposite`=0／`against`=0 —— **登记为携带项**（§6.3） |
| 9 | **下一可用课号／案号** | **L191–L196** ✅ 全可用；**案 200–202** ✅ 全可用 |
| 10 | **季红线** | 28 季；**≤3 课小季 = 3 个（已顶格）** → **本批不得新建季** ✅ |
| 11 | **难度守门** | 超 5 词跳变的相邻对 = **0**；L190 = 5 词 → L191 上限 10 词 ✅ |
| 12 | **目标句新词先例** | **历史最大 = 3**（分布 `{0:91, 1:72, 2:19, 3:8}`）→ 本批 1／2／2 全在门内 ✅ |
| 13 | **场景用量** | 首选 `mansion`（61 课，**末次 L153，距今 38 课**）／`forest`（3 课，末次 L187，距今 4 课 ⚠️）／`island`（5 课，**末次 L71，距今 120 课**）✅ |
| 14 | **封面** | `cover74`／`75`／`76` 各**仅用 1 次** ✅ |
| 15 | **复现水位** | 拟复现句最高 **`My hat is in the box.` prac=1／`I sit next to the window.` prac=1／`There is a cat under the chair.` prac=2／`I walked home.` prac=0 —— 全部 ≤6 ✅（余量 ≥4） |
| 16 | **重放题预算** | **实算 11 道／上限 26（余量 15）** ⚠️ **与上游记的「23／26」差异大，见 §6.2 第 1 条** |
| 17 | **`grammarLessons.test.ts`** | **28 项全绿**（本轮实跑） |
| 18 | **错句全查重** | 九条 `wrongMark` 错句全部 `cont=0`（§5.5）✅ |
| 19 | **`cross` 应剔除** | GL=0；牛津中文对译 `越过`；剑桥中文 `这里不适宜横穿马路。`——**证据链完整** ✅ |

### 6.2 本轮**未核实**（诚实登记）

| # | 未核实项 | 为什么 | 影响 |
|---|---|---|---|
| **1** | **重放题预算的真实水位（11 还是 23）** | 我用 `/tmp/replay2.js` 复刻测试算法得到 **29**（懒匹配）／用逐题切分得到 **11**。**上游记 23、我算 11——两者差 12**。差异来源我定位到「practice 题块切分方式」（`\n\s{6}\{\s*\n` 切分 vs 懒匹配正则），但**我未能唯一确定测试实际用的切法**（测试代码是内联在 `it()` 里的，我读过 `:689`–`:736` 但**未逐行复刻其对 `exhibit` 数组的构造**，特别是 `contrast.whyZh` 是否入 `exhibit`） | ⚠️ **本批三课新增题会消耗预算，但余量究竟 15 还是 3 不确定。建议写课方在新增课后实跑 `npx vitest run src/data/grammarLessons.test.ts` 确认**。**若余量仅 3，三课新题极可能触碰上限** |
| 2 | **五词在 `bundledDictionary.ts` 的词条内容** | 本轮未查该文件 | 该词典是通用词典数据，**不构成教学依据**（批三十七已判定同型），影响低 |
| 3 | **`past` 移动义的 CEFR 档位** | 牛津 `past_1` 入口 4 个义项**全是时间义**；移动义应在 `past_2`（副词／介词），**本轮未抓 `past_2`** | 只影响「捎带四词」的排序建议，不影响五词主线 |
| 4 | **中文侧正式语法教学文章** | 知乎／百度百科 **403**；EF 中国页**重定向到营销页**；`yygrammar`／`hjenglish`／`xdf` **未定位到具体文章 URL** | **中文侧依据只有剑桥双语词典的官方对译（一手），没有中文教学文章（二手）**。任务书要求的「中文侧语法教学文章」**未达成，已如实声明** |
| 5 | **British Council 的完整语法目录** | 域名 `learnenglish.britishcouncil.org` 经 `curl` **HTTP=000 不可达**；仅 `/grammar`／`/grammar/a1-a2-grammar`／`/grammar/b1-b2-grammar`／`/free-resources/grammar/english-grammar-reference` 四页**经 WebFetch 可读** | 「BC 没有 prepositions of movement 课题」的结论**基于这四页**（A1-A2 目录 18 课已列全）；**若 BC 另有隐藏课题，本轮看不到** |
| 6 | **`along` 与 `alongside` 的分工** | `alongside` 全库 GL=0，**本轮未评估** | 见 §4.4 引用 ③：建议 `alongside` **并入静态位置族**，不进本批 |
| 7 | **真人首玩计时与「地形判据」的理解难度** | 需真人（延续批三十四／三十五／三十七的登记） | §1 的「3 课可行」是**内容可行性判断，非学习效果判断** |
| 8 | **`through` 的 A2 义项是否应在本批教** | 牛津 `through` 义项 3／4／5 为 A2（`sit through a concert`／`drive through a red light`／`Tuesday through Friday`） | **本批只教 A1 首义（穿过）**；A2 义项（「从头到尾」）**登记为携带项** |
| 9 | **`into` 的 `be into`／`change into` 义项** | 剑桥 `In, into` 页含 `Into : enthusiasm, interest`（`He's really into his work.`）与 `Change into , turn into` | 牛津标 `be into` 为 **informal**、`change into` 为 **A2** —— **本批只教 A1 首义（进入）**，其余登记 |
| 10 | **`enter` 的缺席是否算缺口** | `enter` GL=0（实测） | 与 `cross` 同轴（动词），**本批未评估**，登记为携带项 |

### 6.3 携带项登记（供路线图）

| # | 携带项 | 状态 | 建议 |
|---|---|---|---|
| **1** | **「上下／越过」轴**（`over`／`under` 移动义／`above`／`below`） | 本轮判定**不捎带**，但**牛津标 `over` 移动义为 A1**（§4.5），是真实缺口 | **单独立项**：「越过／翻过」（`jump over the wall`／`climb over`）。⚠️ 注意 `over` 的静态义（`over there`）已在 L41 出现，**需先切分** |
| **2** | **「经过」轴**（`past` 移动义／`pass`／`by`） | `past` 真词 GL=0；`pass` GL=12（**全是「递给」义**，L63 `:11822` `Please pass me the pen.`）；`by` GL=137（多为「被谁」／「乘」） | **单独立项**：「从他身边走过」（`walk past`）。**须先与 L63 的 `pass`（递）切分** |
| **3** | **`cross`／`enter`（动词）** | `cross` GL=0／`enter` GL=0 | **并入「动词家族补员」**，不属移动方向族（§2.2） |
| **4** | **`alongside`／`beside`／`opposite`／`against`** | 全 GL=0 | **并入静态位置族补员**（第七／八张脸），不属本批 |
| **5** | **`above`／`below`／`inside`／`outside`** | `above`=0／`below`=0／`inside`=0；`outside` GL=9（L19／L48／L142） | 同第 4 项 |
| **6** | **`from … to …`** | 剑桥 `At, in and to (movement)` 逐字列为常用搭配（`Is it far from your house to the nearest shop?`）；**我方全库未查**（本轮未测） | **建议单测**：这可能是又一个全零缺口 |
| **7** | **`arrive at`／`arrive in`** | 剑桥同页逐字专用 `Warning` 讲 `arrive` **不接 `to`**（`Not: I arrived to the station`）；牛津未测我方 | **建议单测**，可能与 `into` 的「终点」轴合并成一课 |
| **8** | **`into` 的引申义**（`be into`／`change into`／`turn into`） | 剑桥 `In, into` 页有专门章节 | 缓排（`be into` 是 informal、`change into` 是 A2） |
| **9** | **`through` 的 A2 义项**（「从头到尾」） | 牛津 A2（`sit through a concert`／`Tuesday through Friday`） | 缓排 |
| **10** | **`around` 的「大约」义** | 牛津义项 2：`approximately`（`around six feet tall`） | **与本批「绕圈」义同形不同义**——若未来做「大约」，注意与 L191–L193 的对照 |
| **11** | **重放题预算水位不确定** | §6.2 第 1 条 | ⚠️ **写课前先实跑确认** |
| **12** | **`space` 场景全库 0 次** | 实测 `space`=0（14 个合法场景里唯一从未使用） | **建议后续批次优先启用**（本批三课未用，因 `into`／`across` 需要「有边界的空间」，太空不合适） |

---

## §7 自我核查记录（含命令与输出）

> **任务书要求**：「核查逐字引用不能只查被指认的那一课——必须全库检索字符串再定位」。**本轮所有断言一律全库检索，且词频一律 node 词边界口径。**

### 7.1 【必附命令 1】移动方向族全库词边界扫描

```bash
node -e '
const S=require("/tmp/glscan2.js");
const ws=["through","around","into","across","along","toward","towards","onto","over","off","past","under","up","down","by","cross","enter","passed"];
console.log("word      GL   HC   SE   targetSentence命中课");
for(const w of ws){
  const t=S.lessons.filter(L=>new RegExp("(^|[^A-Za-z])"+w+"([^A-Za-z]|$)","i").test(L.target||""));
  console.log(w.padEnd(9)+String(S.c(w)).padEnd(5)+String(S.c(w,S.HC)).padEnd(5)+String(S.c(w,S.SE)).padEnd(5)+(t.length?"L"+t.map(l=>l.num).join(","):"—"));
}'
```

**输出（逐字）**：

```
word      GL   HC   SE   targetSentence命中课
through  0    0    0    —
around   0    0    0    —
into     0    0    0    —
across   0    0    0    —
along    0    0    0    —
toward   0    0    0    —
towards  0    0    0    —
onto     0    0    0    —
over     1    1    0    —
off      1    0    0    —
past     3    9    0    —
under    26   0    0    —
up       204  9    0    L120,138,173
down     6    0    0    —
by       137  7    0    L52,54
cross    0    0    0    —
enter    0    0    0    —
passed   0    0    0    —
```

**⇒ 任务书给的五词全零断言：完全成立 ✅**（且 targetSentence 命中全为 0）。

### 7.2 【必附命令 2】ugrep 假阴性当场复现

```bash
for w in under walked through pass hope swim want forest beach room island; do
  u=$(grep -oniE "(^|[^A-Za-z])${w}([^A-Za-z]|$)" src/data/grammarLessons.ts | wc -l | tr -d ' ')
  n=$(node -e "const S=require('/tmp/glscan2.js');console.log(S.c('$w'))")
  flag=""; [ "$u" != "$n" ] && flag="  ❌ 不一致"
  echo "  $w  ugrep=$u  node=$n$flag"
done
```

**输出（逐字）**：

```
  under  ugrep=26  node=26
  walked  ugrep=9  node=9
  through  ugrep=0  node=0
  pass  ugrep=0  node=12  ❌ 不一致
  hope  ugrep=0  node=0
  swim  ugrep=0  node=118  ❌ 不一致
  want  ugrep=0  node=294  ❌ 不一致
  forest  ugrep=5  node=5
  beach  ugrep=3  node=3
  room  ugrep=0  node=24  ❌ 不一致
  island  ugrep=5  node=5
```

**huntCases.ts**：

```
  hope  ugrep=0  node=1  ❌ 不一致
  swim  ugrep=0  node=16  ❌ 不一致
  want  ugrep=0  node=18  ❌ 不一致
  pass  ugrep=0  node=1  ❌ 不一致
```

**⇒ ugrep 失效是「随词而变」的：`under`／`walked`／`forest`／`beach`／`island` 正确，而 `pass`／`swim`／`want`／`room`／`hope` 全部假返回 0。它不是「可以挑着用」的工具。**（比上游结论更严重）

### 7.3 【必附命令 3】连字符标识符假命中（本轮新发现的口径坑）

```bash
node -e '
const S=require("/tmp/glscan2.js");
for(const w of ["past","corner","island","room","tree","beach","forest"]){
  const loose=new RegExp("(^|[^A-Za-z])("+w+")([^A-Za-z]|$)","gi");
  const strict=new RegExp("(^|[^A-Za-z-])("+w+")([^A-Za-z-]|$)","gi");
  const a=(S.GL.match(loose)||[]).length, b=(S.GL.match(strict)||[]).length;
  console.log("  "+w.padEnd(9)+"宽口径="+String(a).padEnd(5)+"真词口径="+String(b).padEnd(5)+(a!==b?"⚠️ 差 "+(a-b)+" 处":""));
}'
```

**输出（逐字）**：

```
  past     宽口径=3    真词口径=0    ⚠️ 差 3 处
  corner   宽口径=1    真词口径=0    ⚠️ 差 1 处
  island   宽口径=5    真词口径=5
  room     宽口径=24   真词口径=23   ⚠️ 差 1 处
  tree     宽口径=4    真词口径=4
  beach    宽口径=3    真词口径=3
  forest   宽口径=5    真词口径=4    ⚠️ 差 1 处
```

**⇒ `past` 的 3 处「命中」全是 `id:` 字段里的连字符标识符**（`lesson-24-past-vs-perfect`／`lesson-34-past-continuous`／`hunt-past-rainy-day`），**真词 = 0**。

### 7.4 【必附命令 4】`over`／`off`／`under` 逐行定位（证明无移动义）

```bash
node -e '
const S=require("/tmp/glscan2.js");
for(const w of ["over","off"]){
  const re=new RegExp("(^|[^A-Za-z])("+w+")([^A-Za-z]|$)","i");
  console.log("  --- "+w+" ---");
  S.GL.split("\n").forEach((l,i)=>{if(re.test(l)){const ln=i+1;const L=S.lessons.filter(x=>x.startLine<=ln).pop();console.log("    :"+ln+" [L"+(L?L.num:"?")+"] "+l.trim().slice(0,110));}});
}'
```

**输出（逐字）**：

```
  --- over ---
    :7640 [L41] { who: "npc", en: "Who is the boy over there?", zh: "她指了指窗边。" }
  --- off ---
    :26326 [L137] { who: "npc", en: "Two months off!", zh: "她眼睛发亮。" }
```

**`under` 的 26 处**（节选，全部属静态位置族）：

```
    :4828 [L26] { en: "There is a cat under the chair.", zh: "椅子下面有一只猫。" }
    :15002 [L79] "location 家族越攒越多：in／on／at（第 18 课）＋under／near（第 26 课）＋今天的 next to…"
    :15010 [L79] "in／on／at／under／near／next to —— 位置词家族"
    :15198 [L80] "还有第 26 课的老朋友 under（在下面）、near（不远）——位置词家族现在有六位…"
    :15394 [L81] "方位词家族现在已经很能打了：in／on／at（第 18 课）、under／near（第 26 课）…"
    :16381 [L86] "方位八位：in／on／at／under／near／next to／in front of／behind／between"
```

**⇒ `under` 的 26 处 100% 是「在下面」（静态），且 targetSentence 命中 = 0 ✅**

### 7.5 【必附命令 5】静态位置族「已建九位」实证

```bash
# 见 §7.4 的 under 输出 + 逐词扫描
node -e '
const S=require("/tmp/glscan2.js");
for(const w of ["in","on","at","under","near","next to","in front of","behind","between","beside","above","below","inside","opposite","against"]) {
  const n=S.c(w); console.log("  "+w.padEnd(13)+"GL="+String(n).padEnd(6)+(n?("L"+S.lessonsOf(w).slice(0,8).join("/L")):"★全库 0"));
}'
```

**输出（逐字，节选）**：

```
  in           GL=488   L1/L2/L3/L4/L5/L6/L7/L8
  on           GL=287   L1/L2/L3/L4/L5/L6/L7/L8
  at           GL=532   L2/L3/L4/L5/L6/L7/L8/L9
  under        GL=26    L26/L79/L80/L81/L86
  near         GL=29    L26/L79/L80/L81/L84/L86
  next to      GL=121   L78/L79/L80/L81/L82/L83/L86
  in front of  GL=29    L79/L80/L81/L86
  behind       GL=64    L79/L80/L81/L82/L86
  between      GL=63    L80/L81/L86
  beside       GL=0     ★全库 0
  above        GL=0     ★全库 0
  below        GL=0     ★全库 0
  inside       GL=0     ★全库 0
  opposite     GL=0     ★全库 0
  against      GL=0     ★全库 0
```

**⇒ 静态九位齐 ✅；「beside／above／below／inside／opposite／against 全零」是**次要缺口**，但它们是**同一族内的补员**（已有位置词家族叙事托底），**不属移动方向族**，登记为携带项 §6.3 第 4–5 条。

### 7.6 【必附命令 6】目标句新词先例（量化「超先例」）

```bash
node /tmp/newload.js
```

**输出（逐字）**：

```
=== 目标句新词数 TOP 12（历史单课新词先例）===
  L1    新词=3  [i, am, xiaomei]   I am Xiaomei.
  L2    新词=3  [he, my, brother]   He is my brother.
  L4    新词=3  [want, milk, tea]   I want a milk tea.
  L9    新词=3  [go, to, library]   I go to the library.
  L12   新词=3  [will, draw, tomorrow]   I will draw tomorrow.
  L16   新词=3  [must, finish, homework]   I must finish my homework today.
  L17   新词=3  [boat, bigger, than]   This boat is bigger than that one.
  L171  新词=3  [spicy, food, nor]   I like neither spicy food nor noodles.

目标句最大新词数 = 3
新词数分布: {"0":91,"1":72,"2":19,"3":8}
```

**⇒ 历史极限 = 3（且「3 词档」只有 8 课，全在 L1–L17 起步段）。本批三课 = 1／2／2，全部在门内 ✅**

**同时实测**：近 8 课的课新词数是 `0,0,0,0,0,0,1,1`——**L183–L190 连续 8 课几乎零新词**，说明**当前正处于「无新词」的收口段，本批引入 5 个新词是一次真实的内容扩张**（而非在饱和段硬凑）。

### 7.7 【必附命令 7】红线基线复算

```bash
node -e '
const S=require("/tmp/glscan2.js");
console.log("lessons:",S.lessons.length);
const nums=S.lessons.map(l=>l.num).sort((a,b)=>a-b);
const missing=[];for(let i=1;i<=190;i++) if(!nums.includes(i)) missing.push(i);
console.log("缺号:",missing.length?missing.join(","):"无");
const dup={};for(const n of nums) dup[n]=(dup[n]||0)+1;
console.log("重号:",Object.entries(dup).filter(([k,v])=>v>1).map(([k])=>k).join(",")||"无");
console.log("HC 案数:",(S.HC.match(/^\s{4}id: "hunt-/gm)||[]).length);
console.log("季数:",(S.SE.match(/min: \d+, max: \d+/g)||[]).length);
'
npx vitest run src/data/grammarLessons.test.ts
```

**输出（逐字）**：

```
lessons: 190
缺号: 无
重号: 无
HC 案数: 199
季数: 28
```

```
 ✓ src/data/grammarLessons.test.ts (28 tests) 141ms

 Test Files  1 passed (1)
      Tests  28 passed (28)
```

### 7.8 【必附命令 8】「≤3 课小季已顶格」

```bash
node -e '
const {readFileSync}=require("fs");
const S=readFileSync("src/data/grammarSeasons.ts","utf8");
const g=[...S.matchAll(/id: "(season-\d+)", label: "([^"]+)",[^\n]*min: (\d+), max: (\d+)/g)].map(m=>({id:m[1],label:m[2],min:+m[3],max:+m[4],n:+m[4]-+m[3]+1}));
console.log("最大季体量:",Math.max(...g.map(x=>x.n)));
console.log("≤3课小季数:",g.filter(x=>x.n<=3).length);
g.filter(x=>x.n<=3).forEach(x=>console.log("   "+x.id+" "+x.n+"课 "+x.label));
'
```

**输出（逐字）**：

```
最大季体量: 12
≤3课小季数: 3
   season-6 3课 第六季 · 建议与条件
   season-12 3课 第十二季 · 更上一层
   season-19 3课 我看到的和感觉到的
```

**⇒ **已顶格 3 个**——新建 `season-29`（3 课）会变 4 个，测试直接红。**故 §1.6 裁定「并入 `season-28`」。

### 7.9 【必附命令 9】季体量分布（确认并入后不越线）

```
season-27  12 课   [170-181]
season-28   9 课   [182-190]
```

**⇒ 并入 L191–193 后 `season-28` = 12 课，与现存最大季 `season-27`（12 课）持平，**不产生新的最大季** ✅

### 7.10 【必附命令 10】难度守门实测

```bash
node -e '
const S=require("/tmp/glscan2.js");
let maxJump=0,jumps=[];
for(let i=1;i<S.lessons.length;i++){
  const a=(S.lessons[i-1].target||"").trim().split(/\s+/).filter(Boolean).length;
  const b=(S.lessons[i].target||"").trim().split(/\s+/).filter(Boolean).length;
  const d=Math.abs(b-a); if(d>maxJump)maxJump=d;
  if(d>5)jumps.push("L"+S.lessons[i-1].num+"→L"+S.lessons[i].num);
}
console.log("最大跳变:",maxJump,"| 超5词的对:",jumps.length?jumps.join(", "):"无 ✅");
console.log("L190 词数:",(S.lessons.find(l=>l.num===190).target||"").split(/\s+/).length);
'
```

**输出（逐字）**：

```
最大跳变: 7 | 超5词的对: 无 ✅
L190 词数: 5
```

**⇒ L190 = 5 词 → L191 上限 10 词；本批三课 5／9／10 词，逐级跳变 +4／+1 ✅**

### 7.11 【必附命令 11】五词查重与复现水位

```bash
node -e '
const S=require("/tmp/glscan2.js");
const T=["I walked into the room.","We walked across the playground and through the forest.","The dog ran around the tree and along the beach.","We walked across the park and through the forest.","The dog walked around the tree and along the beach."];
for(const s of T){
  const w=s.trim().split(/\s+/).length; const p=S.prac[s]||[];
  console.log("  "+String(w).padStart(2)+"词 cont="+String(S.cont(s)).padEnd(3)+"prac="+p.length+"  "+s);
}'
```

**输出（逐字）**：

```
   5词 cont=0  prac=0  I walked into the room.
   9词 cont=0  prac=0  We walked across the playground and through the forest.
  10词 cont=0  prac=0  The dog ran around the tree and along the beach.
   9词 cont=0  prac=0  We walked across the park and through the forest.
  10词 cont=0  prac=0  The dog walked around the tree and along the beach.
```

**⇒ 五句（三主选 + 两备选）全部 `cont=0`，**库内全新** ✅

### 7.12 【必附命令 12】复现取材句水位

```bash
node -e '
const S=require("/tmp/glscan2.js");
for(const s of ["My hat is in the box.","I sit next to the window.","There is a cat under the chair.","I walked home.","I want to go to the beach."]){
  const p=S.prac[s]||[]; console.log("  "+s.padEnd(34)+"prac="+p.length+"  cont="+S.cont(s)+"  L"+p.join("/L"));
}'
```

**输出（逐字）**：

```
  My hat is in the box.             prac=1  cont=3  L18
  I sit next to the window.         prac=1  cont=1  L79
  There is a cat under the chair.   prac=2  cont=3  L79/L80
  I walked home.                    prac=0  cont=1
  I want to go to the beach.        prac=1  cont=1  L15
```

**⇒ 全部 ≤6，最高水位 2（`There is a cat under the chair.`），余量 ≥4 ✅**

### 7.13 零术语自检（家族名与季名）

```bash
node -e '
const ZERO=["主语","谓语","宾语","表语","定语","状语","单数","复数","三单","原形","时态","一般过去时","一般现在时","现在进行时","过去进行时","现在完成时","情态动词","比较级","最高级","从句","语序","可数","疑问句","否定句","被动语态","第三人称","形容词","副词","介词"];
for(const z of ["位置词","方位词","走法词","往哪走","走法","我能说「往哪走」"]){
  const hit=ZERO.filter(t=>z.includes(t));
  console.log("  "+z.padEnd(16)+(hit.length?"❌ 命中 "+hit.join("/"):"✅ 零术语"));
}'
```

**输出（逐字）**：

```
  位置词              ✅ 零术语
  方位词              ✅ 零术语
  走法词              ✅ 零术语
  往哪走              ✅ 零术语
  走法                ✅ 零术语
  我能说「往哪走」    ✅ 零术语
```

**⚠️ 写课方必读**：本族**唯一**的术语风险是「介词」这个词本身（红线词表第 29 项）。**建议全批统一用 `走法词`（GL=0，未被占用）指称本族，用 `位置词`（GL=20，库里既有）指称静态族。** 不得在用户可见字段写「介词」「方向介词」「介词短语」中的任何一个。
**⚠️ 第二处风险**：库里既有比喻 `穿 -ing`（GL=**96**，指动词加 -ing）与本文的「穿过」**字形相近**。**建议文案中一律用「走过去／横着过去／钻过去」，避免「穿过」这个词与 `穿 -ing 外套` 撞车**（`穿过原样` GL=0，不存在冲突；但「穿过」单独两字会与「穿」的既有用法在视觉上混）。

---

## §8 审批建议

| # | 建议 | 优先级 |
|---|---|---|
| 1 | **批准 L191／L192／L193 三课**（`into`／`across`+`through`／`along`+`around`） | 高 |
| 2 | **批准并入 `season-28`（`max: 190→193`）**，**不新建季** | 高（不批则测试红） |
| 3 | **批准 `can-do-m39`（`afterLesson: 193`，title「我能说「往哪走」」）** | 高 |
| 4 | **确认家族命名 `走法词`** | 中（影响全批文案用词） |
| 5 | **确认 `cross` 剔除本批**（§2.2 三条理由） | 中 |
| 6 | **确认「捎带四词」（`over`／`under`／`past`／`off`）不捎带**，改登记立项 | 中 |
| 7 | ⚠️ **写课前先实跑确认重放题预算余量**（§6.2 第 1 条：我算 11／上游记 23，两者差 12） | **高（可能阻塞）** |
| 8 | **确认 L192 场景用 `forest`**（与 L187 间隔 4 课）还是改用 `park` | 中 |
| 9 | **确认 L193 用 `ran`**（不规则过去形，库里从未进目标句）还是改用 `walked`（更稳） | 中 |

---

## 附录 A：本轮脚本复跑（全部落在 `/tmp/`）

```bash
# A1 五词词频（词边界；node）
node -e 'const S=require("/tmp/glscan2.js");
for(const w of ["through","around","into","across","along"]) console.log(w, S.c(w), S.c(w,S.HC), S.c(w,S.SE));'
# → through 0 0 0 ｜ around 0 0 0 ｜ into 0 0 0 ｜ across 0 0 0 ｜ along 0 0 0

# A2 真词口径（排除连字符标识符）
node -e 'const S=require("/tmp/glscan2.js");
console.log("past 真词 =",(S.GL.match(/(^|[^A-Za-z-])past([^A-Za-z-]|$)/gi)||[]).length);'
# → past 真词 = 0

# A3 目标句新词先例
node /tmp/newload.js
# → 目标句最大新词数 = 3 ｜ 分布 {"0":91,"1":72,"2":19,"3":8}

# A4 词表池成员（D 层口径）
node /tmp/pool.js
# → into/across/through/around/along 全部「❌ 不在池」（即全为新词）

# A5 季体量
node -e 'const {readFileSync}=require("fs");
const S=readFileSync("src/data/grammarSeasons.ts","utf8");
const g=[...S.matchAll(/min: (\d+), max: (\d+)/g)].map(m=>({a:+m[1],b:+m[2]}));
console.log("seasons:",g.length,"| tiny(<=3):",g.filter(x=>x.b-x.a+1<=3).length);'
# → seasons: 28 | tiny(<=3): 3

# A6 测试
npx vitest run src/data/grammarLessons.test.ts   # → Tests 28 passed (28)

# A7 重放题预算（两种口径，结果不一致 → §6.2 第 1 条）
node /tmp/replay2.js   # → 变体① 懒匹配 = 404 ｜ 变体② 排除 variants + 复习豁免 = 29
node /tmp/replay3.js   # → 精确复刻（逐题切分）= 11 / 上限 26
```

## 附录 B：本批逐字引文索引（引文全部给行号）

| 文件:行 | 课 | 逐字（节选） |
|---|---|---|
| `grammarLessons.ts:3315` | L18 | `targetSentence: "My hat is in the box."` |
| `grammarLessons.ts:3319` | L18 | `oneLineRule: "「在哪」和「什么时候」都靠三个小词：in（里面 / 大块时间）、on（上面 / 某一天）、at（某一点）。"` |
| `grammarLessons.ts:1837` | L10 | `{ en: "I walked home.", zh: "我走路回了家。" }` |
| `grammarLessons.ts:1896` | L10 | `大多数动词很有规律：昨天版就是加 -ed。watch→watched、play→played、walk→walked，看到原形就能猜到昨天版。` |
| `grammarLessons.ts:4828` | L26 | `{ en: "There is a cat under the chair.", zh: "椅子下面有一只猫。" }` |
| `grammarLessons.ts:7640` | L41 | `{ who: "npc", en: "Who is the boy over there?", zh: "她指了指窗边。" }` |
| `grammarLessons.ts:14915` | L79 | `grammarLabel: "位置词 · next to"` |
| `grammarLessons.ts:14918` | L79 | `grammarLabel: "位置词 · next to"`（同课块，`:14915` 为课块起） |
| `grammarLessons.ts:15010` | L79 | `in／on／at／under／near／next to —— 位置词家族` |
| `grammarLessons.ts:15095` | L79 | `tokens: ["I", "sit", "next", "to", "the", "window."],` |
| `grammarLessons.ts:15198` | L80 | `还有第 26 课的老朋友 under（在下面）、near（不远）——位置词家族现在有六位：in／on／at／under／near／next to／in front of／behind。` |
| `grammarLessons.ts:15394` | L81 | `方位词家族现在已经很能打了：in／on／at（第 18 课）、under／near（第 26 课）、next to（第 79 课）、in front of／behind（第 80 课）、between（今天）` |
| `grammarLessons.ts:16372` | L86 | `方位家族现在有八位：in／on／at（第 18 课）、under／near（第 26 课）、next to（第 79 课）、in front of／behind（第 80 课）、between（第 81 课）——你指哪儿说哪儿。` |
| `grammarLessons.ts:16381` | L86 | `方位八位：in／on／at／under／near／next to／in front of／behind／between` |
| `grammarLessons.ts:17680` | L93 | `{ who: "npc", en: "This playground is old.", zh: "小美望着老操场。" }` |
| `grammarLessons.ts:24143` | L126 | `{ who: "npc", en: "I just ran a race!", zh: "同桌抹了把汗。" }` |
| `grammarLessons.ts:26326` | L137 | `{ who: "npc", en: "Two months off!", zh: "她眼睛发亮。" }` |
| `grammarLessons.ts:2918` | L15 | `tokens: ["I","want","to","go","to","the","beach."],` |
| `grammarLessons.ts:3521` | L19 | `把两个词或两句话连起来：一个方向用 and（又……又……），反着来用 but（但是）。` |
| `grammarLessons.ts:19863` | L104 | `title: "同一个 made，两张脸"` |
| `grammarLessons.ts:20260` | L106 | `Let me help you.（第 74 课，我请缨）／lets him play（今天，她放手）—— 两张脸` |
| `grammarLessons.ts:21544` | L113 | `感到版说「我的感受」：I am bored（我没劲）；让人版说「它让我这样」：The book is boring（这本书没劲）——同一个中文「无聊」，英语分两张脸，看是谁没劲。` |
| `grammarLessons.ts:23406` | L122 | `title: "同一个 to，两张脸"` |
| `grammarLessons.ts:23605` | L123 | `title: "两张脸的「不」，长得不一样"` |
| `grammarSeasons.ts:69` | — | `{ id: "season-28", label: "第二十八季 · 收口、目的、条件、不得不与他们的", … min: 182, max: 190 },` |
| `grammarLessons.test.ts:790` | — | `it("相邻课的单句最长词数不得跳超 5 词", () => {` |
| `grammarLessons.test.ts:778` | — | `单次跳过 5 词（如 L44 的 3→8）已接近「零基础学不动」的边界，不允许更大。` |
| `grammarLessons.test.ts:187` | — | `it("练习答案不得跨课高频复现（同一句最多出现在 6 课，当前最差为 6）", () => {` |
| `grammarSeasons.test.ts`（季体量断言） | — | `const tiny = LESSON_GROUPS.filter((group) => group.max - group.min + 1 <= 3);` ＋ `expect(tiny.length, …).toBeLessThanOrEqual(3);` |
| `AdventureScene.tsx:12` | — | `"ocean",`（合法场景列表，含 `island`／`forest`／`mansion`） |
| `AdventureScene.tsx:35` | — | `island: "海岛椰风",` |
| `GrammarPathPage.tsx:381` | — | `id: "can-do-m38",`（`afterLesson: 190`） |
| `grammarZeroTerms.ts` | — | 29 词表（含「介词」） |

### 外部源引文索引

| 源 | URL | 引文（逐字） |
|---|---|---|
| Cambridge · `In, into` | `https://dictionary.cambridge.org/grammar/british-grammar/into` | `We use into to talk about the movement of something, usually with a verb that expresses movement (e.g. go , come ). It shows where something is or was going:`／`She walked into the garden.`／`She entered the garden.` |
| Cambridge · `Across, over or through?` | `https://dictionary.cambridge.org/grammar/british-grammar/across` | `When we talk about movement from one side to another but 'in something', such as long grass or a forest, we use through instead of across:`／`I love walking through the forest.`／`Not: I love walking across the forest.`／`We cycled through a number of small villages.`／`Not: We cycled across a number of small villages.` |
| Cambridge · `Along or alongside?` | `https://dictionary.cambridge.org/grammar/british-grammar/along` | `As a preposition, along means 'in a line next to something long and thin', e.g. a road, a path:`／`There were lots of shops along the main street.` |
| Cambridge · `At, in and to (movement)` | `https://dictionary.cambridge.org/grammar/british-grammar/at-in-and-to-movement` | `We use to when we are talking about movement in the direction of a point, place, or position:`／`Not: When did you go in Barcelona?` |
| Cambridge 双语 · `through` | `https://dictionary.cambridge.org/dictionary/english-chinese-simplified/through` | 定义 `from one end or side of something to the other`；中文 `通過`；例句对 `They walked slowly through the woods.` → `他們緩步穿過樹林。` |
| Cambridge 双语 · `across` | `https://dictionary.cambridge.org/dictionary/english-chinese-simplified/across` | 定义 `from one side to the other of something with clear limits, such as an area of land, a road, or a river`；中文 `從`；例句对 `She walked across the field/road.` → `她穿過田野／橫過馬路。` |
| Oxford · `into` | `https://www.oxfordlearnersdictionaries.com/definition/english/into_1` | CEFR **A1**：`to a position in or inside something`／`Come into the house.` |
| Oxford · `across` | `https://www.oxfordlearnersdictionaries.com/definition/english/across_1` | CEFR **A1**：`from one side to the other side of something`／`He walked across the field.` |
| Oxford · `through` | `https://www.oxfordlearnersdictionaries.com/definition/english/through_1` | CEFR **A1**：`from one end or side of something/somebody to the other` |
| Oxford · `along` | `https://www.oxfordlearnersdictionaries.com/definition/english/along_1` | CEFR **A2**：`from one end to or towards the other end of something`／`They walked slowly along the road.` |
| Oxford · `around` | `https://www.oxfordlearnersdictionaries.com/definition/english/around_1` | CEFR **A1**：`in a circle`／`They walked around the lake.` |
| Oxford · `over` | `https://www.oxfordlearnersdictionaries.com/definition/english/over_1` | CEFR **A1**：`from one side of something to the other; across something`／`a bridge over the river`／`She climbed over the wall.` |
| Oxford · `off` | `https://www.oxfordlearnersdictionaries.com/definition/english/off_1` | CEFR **A2**：`down or away from a place; at a distance in space or time`／`I called him but he ran off.` |
| Oxford · `onto` | `https://www.oxfordlearnersdictionaries.com/definition/english/onto` | CEFR **A2**：`used with verbs to express movement on or to a particular place or position`／`She stepped down from the train onto the platform.` |
| British Council A1-A2 语法目录 | `https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar` | 含 `Prepositions of place: 'in', 'on', 'at'`（`/free-resources/grammar/a1-a2/prepositions-place`）与 `Prepositions of time: 'at', 'in', 'on'`；**无一课名为 `prepositions of movement`** |
| British Council place 页 | `https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2/prepositions-place` | `We can use the prepositions in, on and at to say where things are. They go before nouns.`；**该页不提 movement／direction 小词** |

---

> 本报告由产品战略团队 AI 协作生成（研究员：瑞思），重要决策请由产品负责人审定。
