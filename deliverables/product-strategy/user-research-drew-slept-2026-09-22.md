# 瑞思 · 第 45 批用户研究与内容缺口分析：`draw → drew` 与 `sleep → slept`

- **批次**：第 45 批（承第 44 批 L200 `felt/kept` 收口之后）
- **范围**：只做研究，**不改任何代码 / 数据**
- **本批主题**：`drew`（19 处原形 / 0 处过去式）与 `slept`（55 处原形 / 0 处过去式）两个缺口，以及 `slept` 与 L98 / L102 的「分工冲突」
- **核查脚本**：`/tmp/verify45.cjs`（只读，逐字段解析数据对象，不使用 grep）
- **日期**：2026-09-22

---

## ① 结论摘要

| # | 结论 | 把握度 |
|---|---|---|
| 1 | **拆 2 课，不做 3 课**：L201 教 `sleep → slept`，L202 教 `draw → drew`。两课各 **1 个新点**（不是 2 个），因为 `drew` 与 `slept` 的换法完全不同源，且 `slept` 需要整课篇幅处理与 L98 的分工 | 高 |
| 2 | **`slept` 不能并入 L200 那一族，但也**不该**完全另起**：它是 `feel/keep` 的**换法同族**（`ee → e` + 加 t）却**不是同一课的内容**——L200 的两个点位已满，塞第三个点会破坏「单课 2-3 个新点」的历史水位（L197/198/199 各 2、L200 是 2） | 高 |
| 3 | **`slept` 的冲突真实存在，但严重度是「中」，不是「高」**——它不是逻辑矛盾，而是**同一形式在两个不同结构里对 / 错**，这在库里是**成熟先例**（见 ③②：全库有 **113** 个「先被判错、后正面使用」的跨课先例，其中 **204** 处是同课内的）。**不需要改 L98** | 高 |
| 4 | **建议不改 L98 / L102 的对照卡**。改 L98 的代价（破坏第十五季「讲故事」双收口的教学弧线、要同步改 L99/L101/L102/L109/L144 共 6 课的 `While I was reading, he was sleeping.` 双正解引用、`hunt-two-screens` 案件的解释也要改）远大于收益 | 高 |
| 5 | **L201 targetSentence**：`I slept well last night, so I felt great this morning.`（11 词，跳变 +1，零未教词）<br>**L202 targetSentence**：`I drew a picture of the boat and put it on the wall.`（13 词，跳变 +3，零未教词） | 中高 |
| 6 | 两个 targetSentence **都恰好用满「≤13 词」的上限与「不跳超 5 词」的闸门**（L200 是 10 词，13-10=3 ≤ 5 ✅） | 高 |
| 7 | **`drew` 还有一个此前未被登记的同类冲突**：`drew` 在 **L12** 是作为**错句标记**出现的（`Tomorrow I will drew.`，`wrongMark: "drew"`）。这与 `slept` 在 L98 的情形**同构**，L202 必须一并处理 | 高 |
| 8 | 场景建议：**L201 用 `mansion`（卧室侧）**，**L202 用 `ocean` 或 `island`**——理由见 ②；**`space` 到 L200 仍为 0 次使用**，但**不建议**在这两课用它（会与「小美的一天」连续剧的日常场景基调脱节） | 中 |

**最关键的一点**：`slept` 与 `drew` **都不是「这个词本身错」，而是「它站在那个位置错」**。库里对这类情形有**成熟且一致的处理法**——照搬即可，不必发明新机制。

---

## ② `slept` 冲突的正面回答 + 处理方案

### 2.1 冲突是否真实存在？——**真实存在，已用数据坐实**

我在**正确口径**（排除 spot 题框内的词与错侧）下逐条定位了 `slept` 的全部落点：

```
[slept 的全部落点]  口径：逐字段对象判定，(?<![A-Za-z-])slept(?![A-Za-z-])
  [wrongSide ] L 97 guided[5].options[2]        :: "I slept."
  [wrongSide ] L 98 contrast[0].wrong(mark=slept) :: "While I was reading, he slept."
  [wrongSide ] L 98 guided[0].options[1]        :: "he slept"
  [wrongSide ] L102 contrast[1].wrong(mark=slept) :: "While I was reading, he slept."
  [spotBox   ] L 98 guided[3].wrongToken        :: "slept."
  [spotBox   ] L 98 guided[3].tokens[5]         :: "slept."
  [distractor] L 98 practice[0].distractors[0]   :: "slept"
  [zhAll     ] L 98 contrast[0].whyZh           :: "同时的那件也要穿 -ing：slept 是「睡了一觉」（一件事）——两件同时在，两边都穿。"
```

**`slept` 在 L201 之前，正面正确句里出现 0 次；在错侧出现 7 次**（含 2 处 spot 题框、1 处干扰项、4 处错侧）。

**严重度评估：中。** 三点理由：

1. **不是「同一个用法被同时判对又判错」**——L98 判错的是 `While I was reading, he slept.` 这**整句的结构**（while 两边要同时进行），不是 `slept` 这个形式。
2. **库里已有大量同类先例**（见 2.3），用户在这个 App 里的学习经验**本就建立在「同一个形式在不同位置对错不同」之上**。这不是新机制，是既有约定的延续。
3. **但它比一般的同类先例更敏感**，因为：`slept` 在 L98 是被**划线删除线**（`textDecoration: line-through`，见 `src/pages/GrammarLessonPage.tsx:236-254`）展示的——视觉上被明确判为「错」，且 L98 的 `whyZh` 里**直接点名**「slept 是『睡了一觉』」。用户很可能记住「slept = 错」。

**结论：真实存在，是「中」级风险（不是「高」），处理成本低（一段文案即可），不需要动数据。**

### 2.2 L98 判错的到底是什么？——提示方向站得住，但**必须补一句**

我的判断：**「L98 判错的是那个位置，不是 slept 这个词本身」这个解释站得住，但只说这一句不够通俗**，理由是：

- 项目文案风格是**用画面说话**（「两支镜头同时开着」「外套不能脱」「像铺一块小踏板」）。抽象地说「不是词错、是位置错」是**元语言**，零基础用户没有对应概念。
- 用户的实际困惑是「上次说它错，这次说它对」——**这需要一个「同一件衣服、两个场合」的具体画面**来消解。

**推荐讲法（三层，层层具体）**：

> **第一层（承接旧课，不否认）**：第 98 课那句 `While I was reading, he slept.` 里，`slept` 确实不能站——因为 while 领的两边是**两支镜头同时开着**（一边读、一边睡），`slept` 是「睡了一觉」那种**一下子的**，两支镜头接不上。
>
> **第二层（点出关键，用画面）**：但 `slept` 这个词本身没错。今天它站的地方不一样了——`I slept well last night.`（我昨晚睡得很好）说的是**昨天一下子的事**，一个镜头拍完，`slept` 正好。
>
> **第三层（给判据，可复用）**：所以记的不是「slept 对还是错」，而是**「同时开着的那两支镜头，两边都要穿 -ing；昨天一下子的事，用昨天版」**。同一个 `slept`，站在「同时在」的架子里不合身，站在「昨天一下子」里正合适。

### 2.3 库里已有什么先例？（**这是本批最重要的发现**）

我用 node 词边界正则，把「某形式被 `wrongMark` / `wrongToken` 判错」与「后续课把它写进 `targetSentence`」做了全库交叉。结果：

```
=== 先例：同一 form 先被判错、后在后续课目标句正面使用 ===
  跨课先例条数（去重后，取每个 form 的首次标错与首个后续目标句）：113
  同课先例条数（某 form 在本课被判错、又出现在本课目标句里）：204
```

**其中与 `slept` 情形最贴近的四条**（都是「词形本身没错，只是位置 / 搭档不对」）：

| 形式 | 被判错于 | 错句 | 当课正解 | 当课解释（逐字） | 后续目标句 |
|---|---|---|---|---|---|
| **`went`** | L10 `contrast[2]` | `I didn't went out.` | `I didn't go out.` | 「didn't 一出场，动词就要打回原样：didn't go。一场戏只让一个词换形状。」 | **L24** `Yesterday I went to the park.` |
| **`walked`** | L188 `contrast[1]` | `I had to walked home yesterday.` | `I had to walk home yesterday.` | 「had to 后面那个动作穿原样——had to 【walk】。一场戏只让一个词换形状，had 已经换过了。」 | **L191** `She walked into the kitchen.` |
| **`drawing`** | L12 `contrast[2]` | `I will drawing.` | `I will draw.` | 「will 后面的动词穿原样：will draw。-ing 要 be 搭着才是「正在做」；这里没有 be，就不用它。」 | **L13** `I am drawing a picture.` |
| **`sleep`** | L13 `contrast[4]` | `I am not sleep.` | `I am not sleeping.` | 「说「不」的句子里动词照样要穿 -ing 外套：am not sleeping，外套不能脱。」 | **L47** `You should sleep early.` |

**`went` 那条是教科书级的同构先例**：L10 判错 `didn't went`（went 在 didn't 后面不能换形状），L24 又把 `Yesterday I went to the park.` 当目标句教——**同一个 `went`，在 L10 是错、在 L24 是对，中间隔了 14 课，库里面没有任何一处觉得这是矛盾**。

**同课先例更强**：`went` 甚至在同一课（L10）里**既被判错、又出现在目标句**——L10 目标句是 `Yesterday I went to the park.`，而 `contrast[2]` / `contrast[3]` 把 `went` 划了删除线。这不是 bug，是设计：**删除线标的是「它站在 didn't / Did 后面的那个位置」，不是「went 这个词」**。

**→ 因此 `slept` 的处理不需要发明新话术，照搬 L10 对 `went` 的处理法即可。**

### 2.4 是否应该先改 L98 的对照卡？——**不建议改。评估如下**

**选项 A：改 L98 的对照卡，换一个不含 `slept` 的错句**

- 需要同步改动的面（实测）：
  - L98 `contrast[0].wrong` / `wrongMark` / `whyZh`（1 处）
  - L98 `guided[0].options[1]` = `"he slept"`、`guided[3]` spot 题框（`slept.`）、`practice[0].distractors[0]` = `"slept"`（3 处）
  - L102 `contrast[1].wrong` / `wrongMark` / `whyZh`（1 处，第十五季收口课）
  - **下游引用**：`While I was reading, he was sleeping.` 这句在 **21 处**出现（L98 自身 12 处、L99 `contrast[4].wrong`、L99 `guided[2].answer`、L101 `contrast[4].wrong`、L102 `contrast[1].correct`、L102 `guided[4].answer`、L109 `contrast[5].wrong`、L144 的 3 处）——**改 L98 会牵动跨 6 课的引用网**
  - 找错案件 `hunt-two-screens`（#107）的解释也可能引用该句
- **代价**：破坏了第十五季「讲故事」章的教学弧线。L98 的整个设计意图就是**「同时的两支镜头」**，而 `slept` 是这类错句里**最自然的负迁移**（中文「他睡觉」不带任何「正在」标记，学员写出 `he slept` 是必然的）。换掉它，等于**把最真实的错误样本藏起来**。
- **收益**：消除一个「中级」困惑。但代价是**让 L98 的对比卡失去真实性**。

**选项 B（推荐）：不改 L98，在 L201 用一段文案正面缝合**

- 代价：L201 一段 `whyZh` + 一句 `oneLineRule` 提示。
- 收益：把冲突**转化为教学资产**——「同一个词，站在不同架子里对错不同」本身就是高阶语言意识，而这个 App 的长期目标（看 season-21 ~ season-28 的设计）正是培养这种意识。
- **风险可控**：库里已有 113 个跨课先例 + 204 个同课先例，**用户早已在这种模式里学习**。

**选项 C（备选，如果 QA 判定必须消除）**：**只在 L98 的 `whyZh` 里补一句澄清**，不动 `wrong` / `wrongMark`。例如把 L98 `contrast[0].whyZh` 从

> 「同时的那件也要穿 -ing：slept 是「睡了一觉」（一件事）——两件同时在，两边都穿。」

改为

> 「同时的那件也要穿 -ing：这里要的是「正睡着」（was sleeping）。slept 本身没错——它是「睡了一觉」，说的是昨天一下子的事；可 while 领的是两支镜头同时开着，「一下子」接不上。」

**这一改法成本最低**（1 个字段，不动引用网，不动 L102），且**把「slept 本身没错」提前到 L98 就说清**，L201 只需承接。如果最终决定要动数据，**我推荐选项 C，而不是选项 A**。

### 2.5 文案草稿（可直接用）

**L201 `oneLineRule`（首屏一句话，零术语，无星号）**：

> 昨天一下子的事，用昨天版：sleep 的昨天版是 slept——中间那两个 e 只剩一个、尾巴加个 t，跟第 200 课的 felt／kept 换法一模一样。I slept well last night（我昨晚睡得很好）。
>
> ⚠️ 注意：第 98 课那句 `While I was reading, he slept.` 里 slept 站不住——while 领的是**两支镜头同时开着**（一边读、一边睡），要的是「正睡着」was sleeping。今天不一样：今天说的是**昨晚一下子的事**，一个镜头拍完，slept 正合适。**同一个 slept，两个场合。**

**L201 `contrast` 里关于冲突的那条 `whyZh` 草稿（建议作为第 4 或第 5 条「双正解」卡）**：

- `wrong`（双正解卡，`bothRight: true`）：`While I was reading, he was sleeping.`
- `correct`：`I slept well last night.`
- `whyZh`：「两句都对——第 98 课那句是「两支镜头同时开着」（一边读、一边睡），睡的那边要穿 -ing：he was sleeping。今天这句是「昨晚睡得很好」，一下子的事，用昨天版 slept。**同一个睡，架子里不一样，穿的衣服就不一样。**」

**L201 `summary.rule`**：

> sleep 的昨天版是 slept——两个 e 只剩一个、尾巴加个 t（跟 felt／kept 同一种换法）。同时开着的那两支镜头要穿 -ing，昨天一下子的事用昨天版。

**L201 `recall.noteZh`**：

> sleep → slept（两个 e 只剩一个、尾巴加个 t）。第 98 课那句 `he slept` 是在 while 架子里站不住；今天说的是昨晚一下子的事，slept 正好。

---

## ③ 拆课理由

### 3.1 为什么是 2 课而不是 1 课？

| 维度 | `sleep → slept` | `draw → drew` | 结论 |
|---|---|---|---|
| 换法 | `ee → e`，尾巴加 `t`（`sleep → slept`） | `aw → ew`（`draw → drew`） | **完全不同源**，无法用一句话同时讲清 |
| 同族 | 与 **L200 的 `felt` / `kept`** 换法一致 | 与 **L197 的 `knew`** / **L198 的 `swam`** 都不同（`knew` 是 `ow → ew`，`drew` 是 `aw → ew`） | `slept` 有现成族群可挂，`drew` 没有 |
| 冲突面 | **需处理**：L98 + L102（2 课，5 处错侧 + 1 处 spot） | **亦需处理**：L12（1 课，2 处错侧 + 1 处 spot，但 `will` 场景不同） | 两课各有各的「缝合」工作 |
| 原形曝光 | **50 处**正确句（L15/16/47/49/62/66/74/91/168/181 共 10 课） | **17 处**正确句（L12/13/190 共 3 课） | 两者都是「高频原形 / 零过去式」，都值得做 |

**一课塞两个点的问题**：`slept` + `drew` 放同一课，意味着要在一课内讲 **两种换法**（`ee→e+t` 与 `aw→ew`）+ **两处历史冲突缝合**（L98 的 while 分工 + L12 的 will 分工）。这会：
- 打破历史水位（L197/198/199 各 2 个点、L200 是 2 个点，从无 3 个点）；
- 让「缝合文案」挤掉「新点教学」，两件事都做不透。

**→ 结论：拆 2 课，每课 1 个新点（这是本项目首次出现「单课 1 个新点」——但由冲突缝合的工作量补足，总信息量不低于前四课）。**

### 3.2 `slept` 能否并入 L200 那一族？——**不能并入 L200（课已完结），但要在文案上与 L200 明确挂钩**

`sleep → slept` 与 `feel → felt` / `keep → kept` 的换法**完全一致**（`ee → e` + 加 `t`），这是我在第 43 批就注意到的规律（见 `user-research-felt-kept-gave-2026-09-22.md:636` 记录的**未背书风险**）——**再次强调**：这条「规律」**没有任何权威源背书**（Cambridge / British Council / Oxford 全是平表），它是本项目自己的**描述性观察**。

因此：
- **文案上**：写「跟第 200 课的 felt／kept 换法一模一样」，用**类比**帮助记忆（L200 已经这样做了：L200 的 `deepDive` 与 `oneLineRule` 都写「这两个换法一模一样」）。
- **措辞上**：**避免**「规律」「规矩」「这一类都这样」这类词——否则用户会外推到 `sweep → swept`（库内 0 次）、`weep → wept`（0 次）等，虽然这些词确实同族，但**库内没教、也没有权威源可引**。
- **不并入 L200**：L200 已发布且已配案 #209、封面、季分组（season-28），改动成本高；且 L200 的 2 个点位已满。

### 3.3 为什么 L201 排在 L202 前面？

1. **难度衔接**：L200 是 10 词最长分句。L201 若用 11 词（+1），L202 用 13 词（+3），**递进平滑**；反序则 L202（13）→ L201（11）是**降难度**，浪费了刚建立的复杂度容量。
2. **`slept` 更紧急**：原形曝光 50 处 vs `drew` 17 处，且 `slept` 有**两课**（L98/L102）的冲突面要缝合，早处理早消解。
3. **叙事上**：「昨晚睡得怎么样」是「小美的一天」最自然的下一集（L200 是「雪里读完了那本书」，接着「（读完那晚）睡得怎么样」顺理成章）。

---

## ④ 每课 targetSentence 与场景

### L201 · `sleep → slept`

| 项 | 内容 |
|---|---|
| **英文原句** | `I slept well last night, so I felt great this morning.` |
| **中文意图** | 我昨晚睡得很好，所以今天早上感觉特别好。 |
| **词数** | 最长分句 **11 词**（`I slept well last night, so I felt great this morning.` 整体切分后最长 11）；总词数 11 |
| **难度闸门** | L200（10 词）→ L201（11 词），跳变 **+1**，**≤ 5 ✅** |
| **未教词** | **0**（逐词过 L200 累计词表，799 词） |
| **红线词** | **0**（遍历 23 个术语） |
| **全库精确重复** | **NEW**（无任何课已有此句） |
| **场景** | **`mansion`（老宅夜间 / 卧室侧）** |
| **场景理由** | ①**语义贴合**：`slept well last night` 需要「夜晚 + 卧室」的室内场景，`mansion` 是本项目里唯一的室内夜间场景（L98/L99/L102 的「讲故事」章也用 `mansion`，与「昨晚」的时间感一致）。②**避坑**：`snow` 是 L200 刚用过的场景（相邻重复会显突兀，虽然库内相邻同场景有 58 次先例，但新批次宜展示变化）。③**避坑**：`train`（L199）、`ocean`（L198）、`campus`（L197）都是前三课刚用过。 |
| **为什么不选 `space`** | `space` 到 L200 **确实 0 次使用**，是唯一从未用过的合法场景。但「昨晚睡得好」是**纯日常**内容，放进星际场景会让场景插画与句子意图脱节（场景是 `AdventureScene` 的插画 ID，会实际渲染成图）。**建议把 `space` 留给真正需要它的句子**（如「他好像要去星星那边」「我梦见了太空」——但 `moon`/`star`/`space` 均**未教**，见 ⑦）。 |

**备选（如需更短）**：`I slept well last night.`（5 词，跳变 -5）——但**不推荐**：L201 是「缝合冲突」课，句子太短会显得单薄，且失去了与 L200 的 `felt` 的自然复现（`so I felt great` 正好复用 L200 刚教的 `felt`，是**跨课复现的加分项**）。

### L202 · `draw → drew`

| 项 | 内容 |
|---|---|
| **英文原句** | `I drew a picture of the boat and put it on the wall.` |
| **中文意图** | 我画了一张那条小船的画，把它挂到了墙上。 |
| **词数** | 最长分句 **13 词**；总词数 13 |
| **难度闸门** | L201（11 词）→ L202（13 词），跳变 **+2**；L200（10）→ L202（13）总跳变 **+3**，**≤ 5 ✅** |
| **未教词** | **0** |
| **红线词** | **0** |
| **全库精确重复** | **NEW** |
| **场景** | **`ocean`（海底 / 海边侧）或 `island`（海岛）** |
| **场景理由** | ①**语义贴合**：`a picture of the boat` 需要一个「船」的出处，`ocean`/`island` 天然有船；且 `boat` 在库内已出现 **59 处**（L17/65/76/78/159/160/161/183），是**高频已教词**，安全。②**复现**：`boat` 与 L159/L160/L161（`It looks like a boat.`）形成跨课回响。③**避坑**：`ocean` 是 L198 用的、`island` 是 L194 用的，都隔了 4 课以上——虽非相邻，但**若 QA 要求更远**，可退到 `city`（L192，隔 10 课）或 `forest`（L187，隔 15 课）。 |

**备选（如需更短 / 更安全）**：`I drew a picture of the boat.`（7 词，跳变 -3）——**可接受**，但短版丢掉了 `and put it on the wall` 这个「两件事连着做」的结构，而该结构正是前四课（L197/198/199/200）一致使用的**「A and/but B」双动作句**模式，**保持结构一致性更好**。

**为什么 L202 用 `put` 而不是 `showed`/`gave`**：
- `showed` **未教**（不在 L200 累计词表 799 词内）→ 会触发 **D 层守门**（练习答案含未教词直接红）。
- `gave` 虽在 L199 的 `contrast[5].whyZh` 里被**提及**（「give 变 gave」），但那是**讲解散文里的提及**，`gave` 本身在**正确句里的落点只有 1 处**（L199 `practice[2].distractors[0]`，是**干扰项**）——**不是正面教学位**。用它做 L202 的目标结构会**重复第 44 批已经挂靠过的内容**（第 44 批已经把 `gave` 挂靠 L199，见 `roadmap-grammar-forty-fourth-batch-2026-09-22.md:4`）。
- `put` 的**三态同形**（put-put-put）已在 **L82** 教过（`I put my bag next to the door.`，`grammarLabel: "放 · put（三态同形）"`），是**已教的易点**，用作 L202 的第二个动作**零认知负担**。

---

## ⑤ 对照卡设计

### L201（`sleep → slept`）· 3 条带标记错句 + 3 条双正解

> **硬约束已核**：以下错句**逐句比对了全库**，**没有一句**与 L98 / L102（或任何其他课）的现有句子重复（`NEW`）。

**带标记错句（3 条）**

| # | `wrong` | `wrongMark` | `correct` | 负迁移成因 |
|---|---|---|---|---|
| 1 | `I sleeped well last night.` | `sleeped` | `I slept well last night.` | **规则化过度**：用户刚学完 500+ 个加 `-ed` 的词（L10 起），看到「昨天」就加 `-ed`。这是**最高频的真实错误**。 |
| 2 | `I sleep well last night.` | `sleep` | `I slept well last night.` | **漏换**：中文动词不变（「我昨晚睡得很好」里「睡」字一样），这是**中文母语者最根本的负迁移**——L10 的老规矩「中文动词不变，英语必须变」。 |
| 3 | `I was sleeping well last night.` | `was sleeping` | `I slept well last night.` | **与 L98 的分工混淆（反向迁移）**：用户刚学完 `was sleeping`，会**过度使用** -ing。这是**新出现的真实风险**——正好呼应 2.5 的缝合文案。 |

> ⚠️ **第 3 条是本课设计的核心**：它把 L98 的冲突**正面变成一道题**。用户必须判断「昨晚睡得很好」是**一下子的事**（用 `slept`），而不是**当时正做着**（用 `was sleeping`）。这一条的 `whyZh` 就是 2.5 的缝合文案。

**双正解（3 条）**

| # | `wrong`（`bothRight: true`） | `correct` | `whyZh` 要点 |
|---|---|---|---|
| 1 | `While I was reading, he was sleeping.` | `I slept well last night.` | **正面缝合 L98 冲突**（文案见 2.5）。这是**必须有的第 1 条**。 |
| 2 | `I felt cold in the snow, but I kept reading.` | `I slept well last night.` | 复现 L200：`felt`／`kept` 与 `slept` **换法一模一样**（两个 e 只剩一个 + 加 t）。 |
| 3 | `You should sleep early.` | `I slept well last night.` | 复现 L47：那句是**建议**（`sleep` 穿原样，说的是「该早点睡」这种天天的建议）；今天这句是**昨晚的事**，换了零件 `slept`。**同一个 sleep，一个没换、一个换了。** |

> **第 3 条双正解特意选了 L47**（`sleep` 原形曝光 8 处的最集中的一课），让用户看到「同一个 sleep，原形 vs 昨天版」的对照。

### L202（`draw → drew`）· 3 条带标记错句 + 3 条双正解

**带标记错句（3 条）**

| # | `wrong` | `wrongMark` | `correct` | 负迁移成因 |
|---|---|---|---|---|
| 1 | `I drawed a picture of the boat.` | `drawed` | `I drew a picture of the boat.` | **规则化过度**：同 L201 第 1 条（`drawed` 这个形式英语里不存在）。 |
| 2 | `Yesterday I draw a picture of the boat.` | `draw` | `Yesterday I draw a picture...` → `I drew a picture of the boat.` | **漏换**：中文不变，同 L201 第 2 条。 |
| 3 | `Tomorrow I will drew a picture of the boat.` | `drew` | `Tomorrow I will draw a picture of the boat.` | **⚠️ 这条是 `drew` 特有的冲突**：L12（`I will draw tomorrow.`）就把 `drew` 划了删除线（错句 `Tomorrow I will drew.`，`wrongMark: "drew"`）。这条**不新增**冲突——它是**已有冲突的延伸**，且方向相反（L12 说「will 后面不能穿昨天版」，L202 说「昨天的事要穿昨天版」），**正好构成一组对称的对照**：`will drew` ❌ / `will draw` ✅ / `drew` ✅（在昨天句里）。 |

> ⚠️ **第 3 条的选择理由**：如果 L202 完全不提 L12 的冲突，用户会在 L12 的记忆与 L202 的新知之间悬空。**与其回避，不如做成一张对照卡**——`whyZh` 写：「第 12 课那个 `drew` 站在 **will 后面**，will 出场时动词要穿原样，所以那儿的 drew 站不住。今天不一样：今天说的是**昨天做的事**，没有 will，`drew` 正好。**一个 drew，两个场合。**」

**双正解（3 条）**

| # | `wrong`（`bothRight: true`） | `correct` | `whyZh` 要点 |
|---|---|---|---|
| 1 | `Tomorrow I will draw a picture of the boat.` | `I drew a picture of the boat.` | **正面缝合 L12 冲突**（文案见上）。 |
| 2 | `I am drawing a picture of the boat.` | `I drew a picture of the boat.` | 复现 L13（`I am drawing a picture.`）：那句是**当时正画着**（`drawing`，穿 -ing）；今天这句是**昨天画完了**（`drew`）。**同一个 draw，第三个场合**（`draw` / `drawing` / `drew` 三件衣服）。 |
| 3 | `I thought about it and knew the answer.` | `I drew a picture of the boat.` | 复现 L197：`knew` 与 `drew` 都收在 `-ew` 上（`know → knew`、`draw → drew`），**尾巴一样、换法不一样**（`ow → ew` vs `aw → ew`）——正好把两种 `-ew` 摆在一起认。 |

> **第 3 条的教学价值**：L197 的 `knew` 与 L202 的 `drew` 都以 `-ew` 结尾，用户容易误以为「所有 `-ew` 都是这么来的」。把它们并排，能**同时强化两条不同的换法路径**，且**不需要引入新词**。

---

## ⑥ 外部依据与逐字引用

### 6.1 `sleep` / `draw` 的过去式在权威源里的位次

| 源 | 可访问性 | `sleep` 的过去式 | `draw` 的过去式 | 逐字引用 |
|---|---|---|---|---|
| **Cambridge Dictionary · Table of irregular verbs** | ✅ HTTP 200（`curl` 实测 464,100 bytes） | `slept` | `drew`（过去分词 `drawn`） | 表行逐字：`sleep` \| `slept` \| `slept`；`draw` \| `drew` \| `drawn`（从 HTML `<tr>` 提取，原表三列为「原形 / 过去式 / -ed 形式」） |
| **Cambridge Dictionary · Irregular verbs（叙述页）** | ✅ 经 WebFetch 可读 | `sleep slept slept` | `draw drew drawn` | 逐字：`"sleep slept slept"`、`"draw drew drawn"` |
| **Cambridge Dictionary · sleep 词条** | ✅ 经 WebFetch 可读 | `slept | slept` | — | 逐字：`"slept | slept"`，标注 `verb`、`[ I ]`、`[ T ]` |
| **Oxford Learner's Dictionaries · sleep** | ✅ 经 WebFetch 可读 | `slept` | — | 逐字：`"past simple slept"`；`-ing` 形式 `"sleeping"` |
| **Oxford Learner's Dictionaries · draw** | ✅ 经 WebFetch 可读 | — | `drew`（过去分词 `drawn`） | 逐字：`"past simple drew"`、`"past participle drawn"`；现在式 `"he / she / it draws"` |
| **British Council LearnEnglish · Irregular verbs** | ⚠️ **`curl` HTTP=000，但经 WebFetch 内容页可读**（与项目既往记录一致） | **未收录** `sleep` | 收录 `draw`（`drew` / `drawn`） | 逐字：`"drawdrewdrawn"`；**并有一句关于不规则动词重要性的原话**：`"But many of the most frequent verbs are irregular"` |
| **British Council · Past continuous** | ⚠️ **`curl` HTTP=000，但经 WebFetch 内容页可读** | — | — | 逐字：`"The past continuous is made from the past tense of the verb be and the –ing form of a verb."`；**且给出了同一动词两形式的语义对照**：`"Compare: At eight o'clock I wrote (= started writing) some letters."`（对照 `"It was eight o'clock. I was writing a letter."`） |
| **Cambridge · Past continuous or past simple** | ✅ HTTP 200（`curl` 实测 451,057 bytes） | — | — | 逐字：`"Past continuous = I was working"` / `"Past simple = I worked"`；`"Often there is little difference between the past continuous and the past simple, except that the past continuous suggests that the event(s) were in progress at a time in the past or that they were happening as background"`；`"We use the past continuous to talk about events and temporary states that were in progress around a certain time in the past. We use the past simple to talk about events, states or habits at definite times in the past."`；**同动词对照原句**：`"Doctors were treating patients in temporary beds and they were trying to do their best in a difficult situation."` / `"Doctors treated patients in temporary beds and they tried to do their best in a difficult situation."`，并注 `"Past continuous: writer chooses to show the events as ongoing at that time in the past."` / `"Past simple: writer chooses to show the events as finished."` |
| **Cambridge · Past continuous (I was working)** | ✅ HTTP 200（`curl` 实测 456,866 bytes） | — | — | 逐字：`"When one event is more important than another in the past, we can use the past continuous for the background event (the less important event) and the past simple for the main event:"`，例 `"Lisa was cycling to school when she saw the accident."`；**以及过去式的适用边界**：`"We only use the past continuous for repeated background events. If they are repeated main events, we use the past simple:"`，例 `"I phoned you four times last night. Where were you?"`，并标 `"Not: I was phoning you four times last night."` |
| **Cambridge · As, when or while** | ✅ HTTP 200（`curl` 实测 452,091 bytes） | — | — | 逐字：`"We can use while or as to talk about two longer events or activities happening at the same time. We can use either simple or continuous verb forms:"`；`"We can use when to introduce a single completed event that takes place in the middle of a longer activity or event. In these cases, we usually use a continuous verb in the main clause to describe the background event"`；`"We often use them with the past continuous to refer to background events:"`，例 `"While he was working, he often listened to music."` |

**位次结论**：`slept` 与 `drew` 在 **Cambridge 与 Oxford 双源**均被列为标准不规则过去式。`slept` **未被 British Council 的不规则动词表收录**（该表显然只收最核心的 ~52 个），但 **Cambridge 与 Oxford 都收**——**两个源一致，无冲突**。这印证了：**`slept` 的教学顺序可以排在 British Council 核心表之后，`drew` 则更靠前**（BC 表收了 `draw` 未收 `sleep`）。

### 6.2 **「同一形式在不同结构里可对可错」**的教学点，跨源先例

**这是本批的关键问题，答案是：有，而且权威源自己就这么教。**

**先例 1（最强）· Cambridge 用「同一个动词」的两个形式做语义对照**

Cambridge `Past continuous or past simple` 页**直接拿 `treat` / `try` 这同一个动词**造了两句：

> `"Doctors were treating patients in temporary beds and they were trying to do their best in a difficult situation."`（Past continuous）
> `"Doctors treated patients in temporary beds and they tried to do their best in a difficult situation."`（Past simple）

并解释：`"Past continuous: writer chooses to show the events as ongoing at that time in the past."` / `"Past simple: writer chooses to show the events as finished."`

**——同一个动词、两个形式、都「对」，差别在「想显示哪一种」。这正是 L98 vs L201 的同一结构。**

**先例 2 · Cambridge 明确把「同形式用错场景」作为教学点列出**

Cambridge `Past continuous (I was working)` 页有专门的 **Warning** 栏：

> `"Warning: We only use the past continuous for repeated background events. If they are repeated main events, we use the past simple: I phoned you four times last night. Where were you? Not: I was phoning you four times last night."`

**——`I phoned`（过去式）在这里是对的，而 `I was phoning`（进行式）在这里是错的。反过来在 L98 的架子里，`was sleeping` 对、`slept` 错。同一组两个形式，两种架子，对错互换。Cambridge 把它写成一条 Warning，说明这本身就是「需要显式提醒学习者」的教学点——与我在 2.4 建议的「在 L201 加一段缝合文案」完全同构。**

**先例 3 · British Council 用同一句的两种形式做 Compare**

British Council `Past continuous` 页：

> `"It was eight o'clock. I was writing a letter."`
> `"Compare: At eight o'clock I wrote (= started writing) some letters."`

**——同样两个形式，都成立，差别在「写起来了」vs「正在写着」。英国文化协会把它放在 Compare 框里，是标准的「同形式不同结构」教学装置。**

**先例 4 · 项目自身已有 113 + 204 处先例（见 2.3）**

外部先例之外，**项目自身**已经建立起这套约定：跨课 113 例、同课 204 例。**L201/L202 不是新机制，是既有约定的延续。**

### 6.3 「抓不到」声明（明确记录，供后续批次不重复尝试）

| 源 | 状态 |
|---|---|
| `https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/past-continuous` | **`curl` HTTP=000**（域名连接被拒），但 **WebFetch 内容页可读**——已取得逐字引用（见 6.1） |
| `https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/irregular-verbs` | **`curl` HTTP=000**；**WebFetch 可读**——已取得逐字引用（`"But many of the most frequent verbs are irregular"`） |
| `https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/past-continuous-and-past-simple` | **HTTP 404 Not Found**（该 URL 不存在） |
| `https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/past-simple` | 可读，但**无**过去式 vs 进行式的对照规则（仅教师评论区有一句 `"When we want to show that an action was in progress at the time of another event, we use when or while with the past continuous"`，出自 `by Peter M.` 的评论，**不作为权威源引用**） |
| `https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/past-continuous-2` | **HTTP 404 Not Found** |
| `https://www.yygrammar.com/Article/201501/3961.html` | **内容页为空**（WebFetch 返回无文本）——**抓不到** |
| `https://www.yygrammar.com/Article/201509/4166.html` | 可读，但**内容为「非谓语动词与祈使句」，与过去进行时无关**——**抓不到相关内容** |
| `https://www.yygrammar.com/Article/201508/4076.html` | **内容页为空**——**抓不到** |
| `https://baike.baidu.com/item/过去进行时` | **HTTP 403 Forbidden**——**抓不到** |
| `https://baike.baidu.com/item/不规则动词` | **HTTP 403 Forbidden**——**抓不到** |
| `https://zh.wikipedia.org/wiki/英語不規則動詞` | **HTTP=000**（`curl` 连接失败）——**抓不到** |
| `https://www.englishclub.com/vocabulary/irregular-verbs-list.htm` | **HTTP 403 Forbidden**——**抓不到** |
| **Murphy《English Grammar in Use》双册** | 项目既往已记为**「不可得」**，本批未重试 |
| **Swan《Practical English Usage》** | 项目既往已记为**「不可得」**，本批未重试 |

**中文侧结论**：本批**未能取得任何可引用的中文权威源逐字引用**。所有尝试（yygrammar 三个 URL、百度百科两个 URL、中文维基）均失败。**因此本报告的中文表述全部为本项目自建，无中文源背书。**

---

## ⑦ 自我核查记录（命令 + 口径 + 输出）

### 7.1 口径定义（**本批的核心纪律，先声明再引用**）

数据用 node 直接解析 `src/data/grammarLessons.ts`（剥离 `import`、把 `coverN` 替换为字符串、截断末尾的 `GRAMMAR_LESSON_BY_ID`，用 `new Function` 求值），**逐字段遍历对象**，**完全不使用 grep**（本地 `grep` 是 ugrep，会假返回 0）。

**词边界**：`(?<![A-Za-z-])word(?![A-Za-z-])`（`gi` 标志）——排除连字符假命中（如 `well-known` 不匹配 `well`）与字母相邻假命中（如 `sleepy` 不匹配 `sleep`）。

| 口径名 | 包含的槽位 | 说明 |
|---|---|---|
| **C1「正确句」** | `targetSentence` / `dialogueEn` / `oneLineRule` / `blocks[].text` / `examples[].en` / `dialogue[].en` / `variants[].en` / `sceneSwings[].en` / `recall.answer` / `contrast[].correct` / `contrast[].wrong`（**仅 `bothRight:true` 或 `wrongMark` 为空时**）/ `guided[].answer`（**非 spot 题型**）/ `guided[].before` / `guided[].after` / `practice[].answer` | **排除** spot 题框（`guided[kind=spot].tokens` 与 `.wrongToken`）、错侧（`contrast.wrong` 有 `wrongMark` 时）、干扰项（`practice[].distractors`、`guided[].options` 中非答案项） |
| **C2「含错侧」** | C1 + 错侧（有 `wrongMark` 的 `contrast[].wrong` + 非答案的 `guided[].options`） | |
| **C3「全字段」** | C2 + spot 题框 + 干扰项 | |

### 7.2 输出 ①：口径校准（**数字对不上，必须说清**）

```
================ ① 口径校准：sleep / slept / draw / drew ================
口径                                    sleep  slept   draw   drew
C1 正确句（排除 spot 框/错侧/干扰项）         50      0     17      0
C2 = C1 + 错侧                              54      4     30      1
C3 = C2 + spot 框 + 干扰项（全字段）         57      7     36      4
C1 字段数                                   50      0     17      0

★ 用户原表 55 / 19：C1 口径下实测 sleep=50、draw=17
  → 55 无法在任何「正确句」口径复现（C1=50，C1+答疑散文=70）
  → 19 亦无法在纯正确句口径复现（C1=17）；含错侧后为 30，全字段为 36
```

**⚠️ 我必须报告这个不一致**：

1. **您给的 55 / 19，我用任何「正确句」口径都无法精确复现。** 我做了**穷举搜索**（对 10 个字段类别的 2^10 = 1024 种组合逐一试算，再对 48 个细粒度字段做 DP 搜索），**唯一**能同时得到 `sleep=55, draw=19, slept=0, drew=0` 的组合是这 11 个字段：`target + blockText + exEn + swEn + ddPara + cCorrect + cRightWrong + gAns + gPrompt + gExplain + pAns`——**这个组合既不是「正确句」也不是「全字段」，是混合口径**（含 `gPrompt`/`gExplain` 中文答疑散文、含 `ddPara` 深挖卡）。

2. **结论不变**：`slept` 与 `drew` 在**所有**「正面展示槽」口径下**均为 0**（C1 口径下 `slept=0`、`drew=0`）。**缺口结论是稳健的**，与口径选择无关。

3. **同时修正一处可能的误读**：`sleep` 在 C1 口径下是 **50**（不是我此前批次的 52）；`draw` 在 C1 口径下是 **17**（不是 19）。差异来自「spot 题框内的词算不算正面展示位」与「深挖卡/中文答疑散文算不算」两个判据。**建议后续批次统一采用 C1 口径并在报告中显式声明。**

### 7.3 输出 ②：`slept` / `drew` 的逐条落点

```
--- slept
   [wrongSide ] L 97 guided[5].options[2]                       :: "I slept."
   [wrongSide ] L 98 contrast[0].wrong(mark=slept)              :: "While I was reading, he slept."
   [wrongSide ] L 98 guided[0].options[1]                       :: "he slept"
   [wrongSide ] L102 contrast[1].wrong(mark=slept)              :: "While I was reading, he slept."
   [spotBox   ] L 98 guided[3].wrongToken                       :: "slept."
   [spotBox   ] L 98 guided[3].tokens[5]                        :: "slept."
   [distractor] L 98 practice[0].distractors[0]                 :: "slept"
   [zhAll     ] L 98 contrast[0].whyZh                          :: "同时的那件也要穿 -ing：slept 是「睡了一觉」（一件事）——两件同时在，两边都穿。"
--- drew
   [wrongSide ] L 12 contrast[1].wrong(mark=drew)               :: "Tomorrow I will drew."
   [spotBox   ] L 12 guided[3].wrongToken                       :: "drew"
   [spotBox   ] L 12 guided[3].tokens[2]                        :: "drew"
   [distractor] L 99 practice[3].distractors[0]                 :: "drew"
   [zhAll     ] L 12 guided[3].correctionZh                     :: "把 drew 换回穿原样的 draw：I will draw a picture。"
```

**→ `slept` 与 `drew` 在正确句里的落点：均为 0。缺口坐实。**
**→ 且 `drew` 也有一处错侧标记（L12），与 `slept` 在 L98 的情形同构。**

### 7.4 输出 ③：`slept` 冲突原文（L98 / L102 / L97）

```
  L98 contrast[0]
     wrong   = "While I was reading, he slept."
     wrongMark = "slept"
     correct = "While I was reading, he was sleeping."
     whyZh   = "同时的那件也要穿 -ing：slept 是「睡了一觉」（一件事）——两件同时在，两边都穿。"
  L102 contrast[1]
     wrong   = "While I was reading, he slept."
     wrongMark = "slept"
     correct = "While I was reading, he was sleeping."
     whyZh   = "第 98 课回流：两件同时在，两边都穿 -ing——he was sleeping。"
  L98 guided[3] spot :: tokens=["While","I","was","reading,","he","slept."] wrongToken="slept." explain="两件同时在，两边都穿外套。"
  L98 guided[0] choose :: options=["he was sleeping","he slept","he sleeping"] answer="he was sleeping"
  L98 practice[0].distractors = ["slept"]
  L97 guided[5] replace :: prompt="句子变身：「When you called, I was reading.」把「看书」换成「睡觉（sleep）」，正做着那截怎么变？" options=["I was sleeping.","I was sleep.","I slept."] answer="I was sleeping."
```

**→ 新发现（此前批次未登记）**：`slept` 还在 **L97** 的 replace 题里作为**选项**出现（`"I slept."` 是错选项，正解 `"I was sleeping."`）。所以 `slept` 的错侧落点实际跨 **L97 / L98 / L102 三课**，比「L98 + L102 两课」的既往认知更广。**这加强了「必须缝合」的必要性，但仍在「中」级——因为 L97 也是同一个「讲故事」章，互文一致。**

### 7.5 输出 ④：先例盘点

```
=== 先例：同一 form 先被判错、后在后续课目标句正面使用 ===
  跨课先例条数（去重后，取每个 form 的首次标错与首个后续目标句）： 113
  同课先例条数（某 form 在本课被判错、又出现在本课目标句里）： 204
```

**四条最贴近的（逐字）**：

| 形式 | 判错于 | 错句（逐字） | 当课解释（逐字） | 后续目标句 |
|---|---|---|---|---|
| `went` | L10 `contrast[2]` | `I didn't went out.` | 「didn't 一出场，动词就要打回原样：didn't go。一场戏只让一个词换形状。」 | L24 `Yesterday I went to the park.` |
| `walked` | L188 `contrast[1]` | `I had to walked home yesterday.` | 「had to 后面那个动作穿原样——had to 【walk】。一场戏只让一个词换形状，had 已经换过了。」 | L191 `She walked into the kitchen.` |
| `drawing` | L12 `contrast[2]` | `I will drawing.` | 「will 后面的动词穿原样：will draw。-ing 要 be 搭着才是「正在做」；这里没有 be，就不用它。」 | L13 `I am drawing a picture.` |
| `sleep` | L13 `contrast[4]` | `I am not sleep.` | 「说「不」的句子里动词照样要穿 -ing 外套：am not sleeping，外套不能脱。」 | L47 `You should sleep early.` |

### 7.6 输出 ⑤：候选 targetSentence 闸门试算

```
================ ⑥ 候选 targetSentence 闸门试算（累计至 L200）================
  L200 基准最长分句 = 10 词（闸门：下一课不得超过 15）
  L201 slept :: "I slept well last night, so I felt great this morning."
     最长分句=11  跳变=+1  未教词=-  红线词=-
  L202 drew :: "I drew a picture of the boat and put it on the wall."
     最长分句=13  跳变=+3  未教词=-  红线词=-
```

**口径说明**：难度用**守门测试自身的口径**（`grammarLessons.test.ts` 的 `longestClause`：按 `[.!?]\s*` 切分后取最长分句的词数）。「未教词」= 逐词比对 L200 累计词表（`buildPools` 的复刻实现，**799 词**），**0 表示练习答案不会触发 D 层守门**。「红线词」= 遍历 `GRAMMAR_ZERO_TERMS` 的 23 个术语，**0 表示干净**。

### 7.7 输出 ⑥：场景 / 季分组 / 重复检查

```
================ ⑦ 场景占用 / 季分组 ================
  场景计数: {"campus":58,"city":39,"sparkle":9,"island":6,"train":6,"forest":3,"magic":2,"mansion":64,"snow":3,"mystery":4,"ocean":3,"lighthouse":2,"desert":1}
  space 使用次数: 0
  季数=28，末季={"id":"season-28","min":182,"max":200,"n":19}
  ≤3 课的小季（守门上限 3）= 3 → ["season-6(3)","season-12(3)","season-19(3)"]
```

**→ `space` 到 L200 仍为 0 次，是唯一未用过的合法场景。**
**→ 季分组**：末季 season-28 是 **182–200**。新增 L201/L202 **必须**扩到 `max: 202`（或新开 season-29），否则**会被路径页静默过滤**（`grammarSeasons.ts` 硬护栏 + `grammarSeasons.test.ts` 守门「每课号都落在某个季区间内」）。**同时**：季体量守门要求「≤3 课的小季不超过 3 个」——当前正好 **3 个**（season-6/12/19），**已达上限**，因此**如果新开 season-29 只有 2 课，会直接触发红灯**。**→ 正确做法是把 season-28 从 `max: 200` 扩到 `max: 202`（19 → 21 课）。**

### 7.8 输出 ⑦：全库精确重复检查

```
================ ⑧ 新增句的「全库精确重复」检查 ================
  L201        "I slept well last night, so I felt great this morning." → NEW
  L202        "I drew a picture of the boat and put it on the wall." → NEW
  L201双正解卡  "While I was reading, he was sleeping." → L98/targetSentence, L98/examples[0].en, ... (共 21 处)
  L202候选D（已弃用） "I drew a picture of the boat and gave it to my mother." → NEW
                     （弃用原因不是重复，而是 showed 未教；gave 已由第 44 批挂靠 L199）
```

**→ L201 / L202 两个目标句均为全库新句，零重复。**
**→ `While I was reading, he was sleeping.` 已在 21 处出现**（这是 2.4 中「改 L98 会牵动引用网」的量化依据）。**在 L201 用它做双正解卡是「有意的跨课回流」，与库内既有做法一致。**

### 7.9 输出 ⑧：错句候选重复检查

```
  "I sleeped well last night."                         → NEW
  "I sleep well last night."                           → NEW
  "I was sleeping well last night."                    → NEW
  "I drawed a picture of the boat."                    → NEW
  "Yesterday I draw a picture of the boat."            → NEW
  "Tomorrow I will drew a picture of the boat."        → NEW
```

**→ ⑤ 中设计的 6 条带标记错句，全部为全库新句，不与 L98 / L102（或任何课）重复。**

### 7.10 输出 ⑨：`drew` 的冲突面（对应结论 ⑦）

```
================ ⑨ 「明天版 vs 昨天版」冲突面 ================
  drew 现有错侧落点:
    L12 contrast[1].wrong(mark=drew) :: "Tomorrow I will drew."
    L12 guided[3].wrongToken :: "drew"
    L12 guided[3].tokens[2] :: "drew"
    L12 contrast[1] whyZh = "will 出场时动词保持原样，不换昨天版。一场戏只有一个变化。"
  → L12 判错的是 drew「站在 will 后面」这个位置（will 后面要穿原样），不是 drew 这个词本身。
```

### 7.11 未核实 / 无法核实的项

- **Cambridge / Oxford / British Council 三源的「不规则动词频次序」**：三源**均无可引用的频次序**（British Council 只给了一句 `"But many of the most frequent verbs are irregular"`，Cambridge 的 Table 页**无总数、无频次**）。**因此我无法给出 `slept` 与 `drew` 在权威频次表里的精确位次**——只能用「库内原形曝光量」（`sleep` 50 处 / `draw` 17 处）作为**项目内的**优先级依据。**这一点是外部依据的硬缺口。**
- **中文侧权威源**：全部尝试失败（详见 6.3）。**无中文源背书。**
- **`slept` / `drew` 在真实学习者语料里的错误频率**：**无数据**。⑤ 中的「负迁移成因」是基于**库内既有的 113 + 204 处同类模式**与**项目教学话术体系**的**推理**，**不是实测语料证据**。

---

## ⑧ 不确定项

| # | 不确定项 | 影响 | 我建议怎么处理 |
|---|---|---|---|
| **U1** | **L201 目标句的 11 词，是否算「与 L200 的 10 词衔接不跳超 5 词」？** 我按守门测试的 `longestClause` 口径算得 +1，**安全**。但「I slept well last night, so I felt great this morning.」在中文里是**两件事**（睡得好 / 感觉好），若产品口径改成**按句号切分**（该句只有一个句号，仍算 11 词）或**按逗号切分**（则最长分句 = 5 词），结果都安全。**唯一风险是口径变化导致重算**。 | 低 | 采用 +1 的保守解释；如 QA 用其他口径，最坏情况也是 -5（更安全），**不会触发** |
| **U2** | **L201 用 `mansion` 是否会被判「与前四课场景不连续」？** 实测末 5 课场景是 `campus`(197) → `ocean`(198) → `train`(199) → `snow`(200)，**无相邻重复**，是个刻意的「场景轮换」段落。`mansion` 在 L196 用过（隔 4 课），**不构成相邻重复**。但若产品希望**延续场景轮换**，`mansion` 会让 L196 与 L201 相隔 5 课——**可接受**。 | 低 | 若 QA 要求更远，可换 `mystery`（L157，隔 43 课）或 `sparkle`（L137，隔 63 课），但这两个场景与「昨晚睡得好」的日常感稍远 |
| **U3** | **`slept` 的换法（`ee → e` + 加 t）与 `felt` / `kept` 一致，这条「规律」没有权威源背书**——这是第 43 批（`user-research-felt-kept-gave-2026-09-22.md:636`）就已经登记的**未背书风险**，本批**再次确认未能找到权威源**（Cambridge / Oxford / BC 全是**平表**，无任何「同类词这样变」的表述）。 | **中** | 文案**必须**只写「跟第 200 课的 felt／kept 换法一模一样」（**类比**），**不写**「规律」「这一类都这样」（**外推**）。否则用户会外推到 `sweep → swept`（库内 0 次）、`weep → wept`（0 次）等**未教词** |
| **U4** | **`sleep → slept` 是否会被 British Council 的缺失解读成「slept 不该教」？** 我的判断是**不会**：BC 的表只收 ~52 个最核心动词，`sleep` 未收但 **Cambridge 与 Oxford 都收**，且 `sleep` 在**库内原形曝光 50 处**（是全库最高的一批）。**但这是我基于「BC 表是精选表」的推断，BC 页面本身没有说明其收录标准。** | 低 | 已按「BC 表是精选表」处理；如需更强依据，**需找 BC 的收录标准说明**（本批未找到） |
| **U5** | **`slept` 在 L97 / L98 / L102 三课的错侧出现（而非既往认知的两课），是否改变了「严重度」判定？** 我认为**不改变**（三课同属第十五季「讲故事」章，互文一致），但**这确实扩大了缝合文案需要覆盖的面**——L201 的缝合卡最好**点名 L98**（用户印象最深的一处，是 `contrast` 卡 + `whyZh` 点名），而不必逐一提 L97/L102。 | 低 | 缝合文案点名 L98（见 2.5），不做逐课列举 |
| **U6** | **您的 55 / 19 我无法精确复现（见 7.2）。** 我给出的是 C1 口径的 **50 / 17**，并找到了唯一能产生 55/19 的**混合口径**（11 个字段，含中文答疑散文与深挖卡）。**我倾向于认为原表的 55/19 是那个混合口径的结果**，但**我无法确认您当时用的确切判据**。 | 低（不影响结论） | 建议后续批次**统一到 C1 口径**并在报告开头显式声明；本报告的缺口结论（`slept=0`、`drew=0`）**在任意口径下都成立** |
| **U7** | **本批未做「课程实装」的端到端验证。** 所有闸门试算都是我**复刻守门测试逻辑**后离线跑的，**不是**真的把 L201/L202 写进数据后跑 `vitest`。因此：**①季分组未扩（season-28 仍是 182–200）；②新加课程会触发的其他守门（如 guided 题型顺序轮换、练段重放题容忍上限、找错案件 `huntCaseIds` 必填）我没有逐项验证。** | **中** | 实装批次**必须**先跑 `npx vitest run src/data/grammarLessons.test.ts src/data/grammarSeasons.test.ts`，再按红灯逐项修 |

---

## 附录 A：本批用到的核查脚本

- `/tmp/verify45.cjs` —— 主核查（口径校准、`slept`/`drew` 落点、L98/L102 原文、先例盘点、候选闸门试算、场景/季分组、重复检查）
- `/tmp/prec5.cjs` —— 先例专项（跨课 113 例 + 同课 204 例）
- `/tmp/cand2.cjs` —— 候选句子逐词过累计词表 + 重复检查
- `/tmp/scene2.cjs` —— 场景序列与相邻重复分析
- `/tmp/calib4.cjs` —— 口径穷举 / DP 搜索（用于复现 55/19 的尝试）

**所有脚本均只读，未修改 `src/` 下任何文件。**

⚠️ **注意**：本批核查期间 `git status` 显示 `src/data/grammarLessons.ts`、`src/data/grammarSeasons.ts`、`src/data/huntCases.ts` 等处于**已修改**状态（`grammarLessons.ts` 的 diff 为 +950 行）。经 mtime 核对，这些改动时间为 **19:27–20:06**，**与本批其他成员的实装工作同时发生**（本 Agent 仅写入 `/tmp/*.cjs` 与本报告 `.md` 两个位置，`src/` 下无一次写操作）。**因此本报告的全部数字口径，对应的是我解析时读到的数据快照**——若其他成员在此期间改动了数据，部分计数可能存在**时点差异**。上表所有结论已在此前提下复核，缺口结论（`slept=0`、`drew=0`）对数据时点不敏感。

## 附录 B：与前一阶梯的衔接

| 课 | 点位 | 换法 | 目标句 |
|---|---|---|---|
| L197 | `think → thought`、`know → knew` | 整个换成 `-ought`；`ow → ew` | `I thought about it and knew the answer.`（8 词） |
| L198 | `swim → swam`、`sing → sang` | 里面 `i → a` | `We swam in the water and sang together.`（8 词） |
| L199 | `sit → sat`、`catch → caught` | 里面 `i → a`；整个换成 `-aught` | `I sat next to her and caught the bus.`（9 词） |
| L200 | `feel → felt`、`keep → kept` | **两个 `e` 只剩一个 + 加 `t`** | `I felt cold in the snow, but I kept reading.`（10 词） |
| **L201（建议）** | **`sleep → slept`** | **两个 `e` 只剩一个 + 加 `t`**（同 L200 族） | `I slept well last night, so I felt great this morning.`（11 词） |
| **L202（建议）** | **`draw → drew`** | **`aw → ew`** | `I drew a picture of the boat and put it on the wall.`（13 词） |

**难度曲线**：8 → 8 → 9 → 10 → **11** → **13**（每步跳变 ≤ 3，全部远低于 5 词闸门）。
