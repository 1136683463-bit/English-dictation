# 瑞思 · 用户研究与内容缺口分析
## 3 个高价值的「换零件」过去式：拆课方案与内容设计（第 44 批）

- 日期：2026-09-22
- 范围：`src/data/grammarLessons.ts`（**199 课**）+ `src/data/huntCases.ts`（**208 案**）+ `src/data/grammarSeasons.ts`（28 季）＋ **全 `src/`（479 个文件，词边界复核）**
- 性质：**纯研究**——本报告不改任何代码与数据
- 上游：第 43 批（`user-research-irregular-past-2-2026-09-22.md`）已做 L197/L198/L199（think·know／swim·sing／sit·catch）
- ⚠️ **本批再次推翻简报的一处前提**——见 §2.0「简报数字第三次不复现」

---

## ① 结论摘要

### 拆几课：**2 课**（L200、L201），不是 1 课也不是 3 课

| 课 | 新点 | 词数 | targetSentence | 中文意图 | 场景 |
|---|---|---|---|---|---|
| **L200** | `felt` + `kept`（2 个点，**同一条换法**） | 10 | `I felt cold in the snow, but I kept reading.` | 雪地里我觉得冷，可还是一直往下看 | `snow` |
| **L201** | `gave`（**1 个点，单独成课**，但挂第 63 课的回流题） | 8 | `I gave her the book and she smiled.` | 我把书递给了她，她笑了 | `magic` |

**为什么是 2 课：**

1. **`felt` / `kept` 合成 L200——这是全批唯一「同一条换法恰好凑满 2 个点」的组合。** 逐字母实测（核查 3）：
   - `keep → kept`：`e→p@2 , p→t@3`（两个 e 只剩一个，尾巴加 t）
   - `feel → felt`：`e→l@2 , l→t@3`（两个 e 只剩一个，尾巴加 t）
   两个词的差异位置**完全同构**（第 2、3 位），都是「长音 ee 收短 + 尾巴补一个 t」。讲一句「两个 e 只剩一个、尾巴加个 t」同时拿到两个词——这是本批最高的压缩比，**不能拆开**。
2. **`gave` 单独成 L201**——它的换法是**纯净的 i→a，别的字母一个都不动**（实测 `give → gave` 逐字母差异只有 `i→a@1`，长度 4→4）。这跟 L199 里的 `sit→sat`（`i→a@1`，长度 3→3）**是逐字同构的一条**，但跟 `kept`/`felt` 的换法毫无关系。`give` 只有 1 个词，凑不出「2 个点同一条换法」；所以它必须**自己领一课**，而那一课的讲法不是「教一个孤立的词」，而是「**回过头把 i→a 这条线第三次点名**：第 198 课 swim／sing、第 199 课 sit、今天 give」。
3. **为什么不是 1 课**（把 3 个词塞进一课 = 3 个新点、两条互不相干的换法）：违反项目「一课一条换法」的既有节奏，且 3 个点超过实测的 2 点容量上限（见 §2.2）。
4. **为什么不是 3 课**（每个词一课）：`kept`/`felt` 拆开会让两课讲**同一句话**（「两个 e 只剩一个、尾巴加个 t」），第二课对用户是零新知的重复；而且 L201 已经只教 1 个点，再拆出 `felt` 会连续两课都只有 1 个点，节奏塌掉。

**`gave`：立新课，但必须挂 L63 的回流题。** 详细评估见 §3。

---

## ② 3 词的分组判定与理由

### 2.0 ⚠️ 先修正简报的前提：这 3 个词的数字**第三次**在本机不复现

简报给的「正确句口径：`keep` 46 / `give` 35 / `feel` 34，过去式全 0」，**我用了 40 种口径组合（含 4 种文本过滤 × 4 种字段过滤 × 全部顶层字段子集 + 4 种计数度量）都复现不出来**。实测三个正式口径：

| 口径（严格定义见 §6 开头） | keep | give | feel | tell | write | mean |
|---|---|---|---|---|---|---|
| **口径 A · 全字段口径（课时）** 字段数／出现次数 | **84／94** | **66／73** | **59／61** | 6／6 | 3／3 | 1／1 |
| **口径 B · 正确句口径（课时）** 字段数／出现次数 | **48／48** | **36／36** | **37／38** | 6／6 | 1／1 | 1／1 |
| **口径 C · 全库全字段（课时+案件）** | 92／102 | 73／80 | 68／70 | 6／6 | 4／4 | 1／1 |
| *（参考）剔错句侧但含 deepDive* | 77 | 58 | 49 | 6 | 3 | 1 |
| **简报「正确句口径」** | **46** | **35** | **34** | 6 | 1 | 1 |

**只有 `tell`(6) / `write`(1) / `mean`(1) 三个数在「正确句口径」行逐字对上**（`tell` 的 6 处全部是 `Tell me about…`，见核查 5）；`keep`/`give`/`feel` 三个核心数**在任何单一口径下都对不上**——最接近的口径 B 是 **48/36/37**，差 **+2/+1/+3**。

**但结论层面完全不受影响**：这 3 个原词确实被大量教过（口径 B 48/36/37 处，口径 A 84/66/59 处），**而 3 个过去式在课时里一处都没有**。这符合第 43 批登记过的同一现象（`swim` 等 7 词的简报数字也不复现）。**本报告一律采用上面的 A/B/C 三口径实测值，并登记为不确定项 1。**

### 2.1 ⚠️ 必须同时修正的第 43 批遗留错误：L197 的 deepDive 里**没有**那串词

第 43 批报告 §2.0「修正一」写：

> 实测这 3 个词各命中 **1 个字段**，全部来自同一个字段：
> `L197-irregular-past deepDive.paragraphs[3]` …… 记住一个就常在句子里碰到：went、ate、saw、bought、thought、knew、**gave、told、felt、kept**…

**这段文字在今天的库里不存在。** L197 的 `deepDive.paragraphs[3]` 实际全文是：

```
这一批只能一个个记，没有捷径。好消息是它们数量有限，而且都是最常用的——
你在前面几课已经碰过好几个了：went（第 10 课）、ate（第 10 课）、saw（第 10 课）、
bought（第 11 课）、thought 和 knew（就是今天这两个）。剩下的以后再一个一个补。
```

**里面既没有 `gave`、也没有 `told`、没有 `felt`、没有 `kept`**（全库检索「同时含 gave 与 told 的字段」命中 0 处，见核查 6）。第 43 批把一个**不存在的句子**当成了既成事实写进报告，并据此把「0 出现」改判为「1 处点名」。

**实际结论**：`kept` / `felt` / `gave` / `told` / `meant` 在**课时里是彻底的 0 出现**（不只是「0 处句子」，连一处点名都没有）。第 43 批的「修正」本身是错的，本报告推翻它。

### 2.2 结论：**按「变化方式」分组，一课 2 个点是硬上限**

`L191`（1 个点）、`L192`（2 个点）、`L197`/`L198`/`L199`（各 2 个点）实测结构完全一致：`blocks=2`、`contrast=6`、`guided=6`、`practice=5`、`examples=4`、`sceneSwings=3`（核查 7）。**这是项目的标准档，一课塞 3 个点以上没有先例。**

| 组 | 换法（逐字母实测） | 词 | 本批处理 |
|---|---|---|---|
| **A 组** | 两个 `ee` 只剩一个 **+ 尾巴加 `t`**（差异位置都在第 2、3 位） | `keep`→`kept`、`feel`→`felt` | **L200（2 个点，一课装下）** |
| **B 组** | **纯净 i→a**，其余字母一个都不动（差异只有第 1 位） | `give`→`gave` | **L201（1 个点）** |

**关键判断：`kept`/`felt` 能不能合成一课？——能，而且是本批唯一该合的。** 理由是实测的逐字母同构：

```
keep → kept    逐字母差异: e→p@2 , p→t@3   [长度 4→4]
feel → felt    逐字母差异: e→l@2 , l→t@3   [长度 4→4]
```

两个词**连差异的位置都相同**（第 2 位、第 3 位），讲法可以逐字共用。对比下面这条**不能**合成一课的证据：

```
give → gave    逐字母差异: i→a@1           [长度 4→4]   ← 只有第 1 位变
tell → told    逐字母差异: e→o@1 , l→d@3   [长度 4→4]   ← 第 1 位和第 3 位，两处
write→ wrote   逐字母差异: i→o@2           [长度 5→5]   ← 只有第 2 位变，但方向不同（i→o 不是 i→a）
```

`give` 与 `kept`/`felt` 的差异位置**零重叠**（一个只看第 1 位，一个只看第 2、3 位），讲不出同一句话。

**关键判断：`gave` 该不该挂靠已教课？——挂 L199 比挂 L63 更贴切，但都不能取代立课。**

- **挂 L199（swim/sing/sit/catch）最贴切**：`give→gave` 与 `sat` 是**逐字同构**（都是 `i→a@1`）。L199 的 `deepDive.paragraphs[1]` 已经明写：「第一种：里面的元音换一下，尾巴不动。swim → swam、sing → sang（第 198 课）、sit → sat（今天）——都是 i 换成 a，词还是那么短。」**`gave` 恰好是这句话等着的第 4 个成员**，而且 `give` 是 4 个字母、`gave` 也是 4 个字母，「词还是那么短」这句评语对 `gave` 逐字成立。
- 但 **L199 已经上过了**（它是已发布课程，不能回头加新点），所以 `gave` 必须以独立课的形式把这条线接下去。
- **挂 L63（give 的主课）反而不合适**——理由见 §3。

### 2.3 为什么 `tell`/`write`/`mean` 本批不做

3 个词的原词存量极低（口径 B 正确句口径：`tell` 6、`write` 1、`mean` 1；`mean` 的那 1 处还是 `At eight, I mean.`——是插入语「我是说」，**根本不是动词 mean 的用法**，见核查 8）。按第 43 批确立的口径（存量决定「值不值得做」），这 3 个词达不到立课门槛。`tell→told` 的换法（`e→o@1 , l→d@3`，两处不连续）也凑不出同伴。

---

## ③ `gave` 挂靠 L63 vs 立新课——评估

**结论：立 L201，但在 L201 里放一道 L63 的回流题；不在 L63 里加对照卡。**

### 3.1 为什么不在 L63 加对照卡

L63 `Please give me the book.` 的教学点是**「先给谁、后给什么」的站位**（`give me the book` / `give it to me`），**不是动词形状**。它的 6 张对照卡已经排满，全部服务于站位：

| # | 卡 | 讲的是 |
|---|---|---|
| 1 | `Give me it.` → `Give it to me.` | it 要加强 to |
| 2 | `Give the book me.` → `Give me the book.` | 两样东西的顺序 |
| 3 | `Give me the book.` / `Give the book to me.`（双正解） | 两个站位都对 |
| 4 | `pass` / `give`（双正解） | 递东西两兄弟 |
| 5 | 第 26 课 `There is a book on the desk.`（双正解） | 同一本书 |
| 6 | `Can I have a milk tea?` / `Could you help me?`（双正解） | 给与请两个方向 |

**6 张卡没有一张在讲「动词换形状」**，这是 L63 有意为之的设计边界——它的主题标签就是「给东西」，站位是它的全部内容。**在 L63 里塞一张 `gived → gave` 的卡，会让这一课的讲解重心从「站位」漂移到「动词形状」**，而这恰好是项目一直在避免的事（每课一条线）。

### 3.2 为什么在 L201 放 L63 的回流题是对的

L201 的主题是**动词形状**（`gave`），但 `give` 这个词的**站位门规**是 L63 教的、且只有 L63 教过。所以：

- L201 的 `blocks[0].role` 写「我把书递给了她（give 的昨天版是 gave）」——**只讲形状**。
- L201 的一条双正解卡指向 **L63**（`Please give me the book.`），说明**同一个「先给谁、后给什么」的站位，一个在现在、一个在昨天**。
- L201 的一道练习是 `Please give me the book.`（L63 原句回流）——**用老站的句子当昨天版新站的脚手架**，符合项目既有的「跨课复现」做法（L199 的 practice 里就有 `I went to the park yesterday.` 和 `My desk is next to the window.` 两道纯回流题）。

**一句话**：`gave` 的**位置**在 L63，`gave` 的**形状**在 L201。两者不该混在一课。

### 3.3 立课的额外收益：补上 `felt` 的项目内空档

实测发现（核查 9）：项目的运行时过去式识别表 `src/services/languageGateService.ts` 的 `IRREGULAR_PAST` 里**已经有 `give: "gave"` 和 `tell: "told"`，但没有 `keep` 和 `feel`**：

```ts
/** 常见不规则动词：原形 → 过去式。误判防护见 detectTenseTag。 */
const IRREGULAR_PAST: Record<string, string> = {
  come: "came", go: "went", arrive: "arrived", leave: "left",
  take: "took", get: "got", see: "saw", say: "said",
  tell: "told", give: "gave", find: "found", bring: "brought",
  buy: "bought", meet: "met", run: "ran", eat: "ate", sleep: "slept"
};
```

**`keep→kept` / `feel→felt` 不在表里，而这两个词的过去式马上就要被教。** 这是 L200 上线时必须同时补的**代码侧**缺口（不是本报告的范围，但必须登记）：否则用户在自由写作里写 `keeped` 时，判定引擎识别不出这是「该用昨天版却用了原形」的错。

---

## ④ 每课错句与双正解设计

**设计口径**：错句必须来自中文母语者的真实负迁移；双正解必须**指出对照对象**（第几课、讲的是什么）。以下文案已通过 §6 核查 10 的零术语全字段校验（20 条全部通过）。

### 4.1 L200 `I felt cold in the snow, but I kept reading.`

- **中文意图**：雪地里我觉得冷，可还是一直往下看。
- **词数**：10（最长分句 10；L199 是 9 → 跳 **+1**，过闸门）
- **场景 `snow`**——理由见 §4.3。

#### 三条带标记错句

| # | 错句 | `wrongMark` | 负迁移成因 |
|---|---|---|---|
| 1 | `I feeled cold in the snow, but I kept reading.` | `feeled` | **最核心的错**：第 10 课教的「加 -ed 就是昨天版」管住了绝大多数词，用户会默认它管所有词。而 `feel` 的尾巴是「两个 e + 一个 l」，照 `stop→stopped` 的双写直觉还会顺手写出 `feelled`。实测全库 `feeled` 命中 **0 处**——这个词在课程里从未出现过，用户无从知道它不存在。 |
| 2 | `I felt cold in the snow, but I keep reading.` | `keep` | **中文完全没有「动词变形状」这回事**：「读书」昨天读、今天读都是同一个词。前半截已经正确换成了 `felt`，后半截却**滑回原样**——这是「半句换、半句不换」的典型漏网，也是 L199 `contrast[1]`（`sat` 换了、`catch` 没换）同一型错误的复现。 |
| 3 | `I felt cold in the snow, but I kept to read.` | `to` | **`keep` 后面要穿名字版**（第 77 课 `keep doing`），但项目里还有一整族「垫板 to」的动词（第 190 课 `learning to swim`、第 173 课 `in order to catch`）。用户把这两条规矩**互相串门**，写成 `kept to read`。第 77 课的 `contrast[0]` 拦的正是 `keep to do`，今天要拦的是它的**昨天版** `kept to read`。 |

#### 三条双正解

| # | 对照句 | 对照对象 | 为什么两句都对 |
|---|---|---|---|
| 1 | `I feel much better today.` | **L76**（`much + 更…`） | 两句都对——L76 那句说的是**今天这会儿**的感觉（`feel` 穿原样）；今天这句说的是**雪地里那会儿**（`felt` 换了零件）。**同一个 `feel`，说的时间不一样，穿的衣服就不一样。**（注意：L76 的 `feel` 是在讲 `much better` 时顺带用的，**它从没讲过 `feel` 的过去式**，所以这两句不冲突，是接力。） |
| 2 | `I keep doing my homework.` | **L77**（`keep + 名字版`） | 两句都对——L77 那句是「一直做」（`keep doing`，今天的事）；今天这句是「那会儿一直在读」（`kept reading`）。**同一个不停车，一个停在现在、一个停在昨天**；而且两句话里 `keep` 后面都是名字版，**门规一个字都没改**。 |
| 3 | `I finished the whole book.` | **L180**（`whole` 整个） | 两句都对——L180 那句是**刹车**（读完了、停下了）；今天这句是**不停车**（冷也一直读）。同一个雪天，一个说收尾、一个说没停。这是 L77「finish 是刹车、keep 是不停车」那个对照的**第三次点名**（第 77 课 → 第 78 课 → 今天）。 |

### 4.2 L201 `I gave her the book and she smiled.`

- **中文意图**：我把书递给了她，她笑了。
- **词数**：8（最长分句 8；L199 是 9 → 跳 **−1**，过闸门）
- **场景 `magic`**——理由见 §4.3。

#### 三条带标记错句

| # | 错句 | `wrongMark` | 负迁移成因 |
|---|---|---|---|
| 1 | `I gived her the book and she smiled.` | `gived` | **同一条最核心的错**：默认「加 -ed」管所有词。`give` 以 `e` 结尾，用户还会顺手写成 `giveed`（照第 25 课「有 e 就只加一个 d」的规矩推）。实测全库 `gived` 命中 **0 处**。 |
| 2 | `I gave her the book and she smile.` | `smile` | **半句换、半句不换**——前半截正确换了 `gave`，后半截的 `smile` 滑回原样。中文「她笑了」昨天今天写法相同，用户完全没有「要换」的触发点。 |
| 3 | `I gave the book her and she smiled.` | `the book her` | **站位错**：L63 教的是「**先给谁、后给什么**」（`give me the book`），用户会在换成昨天版时**把老站位一起搞乱**——以为「换了形状就得换顺序」。实测 L63 的 `contrast[1]`（`Give the book me.`）拦的正是这个错，今天要拦的是它的昨天版。 |

#### 三条双正解

| # | 对照句 | 对照对象 | 为什么两句都对 |
|---|---|---|---|
| 1 | `Please give me the book.` | **L63**（`先给谁、后给什么`） | 两句都对——L63 那句是**现在**请人把书递过来（`give` 穿原样）；今天这句是**昨天**已经把书递出去了（`gave` 换了零件）。**同一个「先给谁、后给什么」的老站位，两班岗。** |
| 2 | `We swam in the water and sang together.` | **L198**（`swim`／`sing`） | 两句都对——L198 那两个词走的是 **i 换成 a**（`swim`→`swam`、`sing`→`sang`），今天 `give`→`gave` **走的是同一条换法**，而且换完还是 4 个字母，跟原来一样短。 |
| 3 | `I bought a gift for my mom.` | **L68**（`buy sth for sb`） | 两句都对——L68 那句的 `bought` 也是换零件的（`buy`→`bought`，第 197 课点过名），站位是「**为你办**」（`for`）；今天 `gave` 站的是「**递到手**」（`to`）那一家。L68 的门规是「递到手用 to、为你办用 for」，今天把 `to` 那一家换成昨天版。 |

### 4.3 场景选择理由（避免撞车）

实测全库场景使用次数与最近使用课（核查 11）：

| 场景 | 全库次数 | 最近使用 | 本批结论 |
|---|---|---|---|
| `mansion` | **64** | **L196** | ❌ 已在 L195/L196 连用两课，再连着用第三次会腻 |
| `ocean` | 3 | **L198** | ❌ 上一课（L198）刚用过 |
| `train` | 6 | **L199** | ❌ 紧邻的 L199 刚用过 |
| `campus` | 58 | **L197** | ❌ 隔一课刚用过，且是最高频场景之一 |
| **`snow`** | **2** | **L180** | ✅ **选它**——19 课没用过，且 L180（`I finished the whole book.`）就在雪天场景，**L200 的「雪地里冷，可还是一直读」正好是 L180 那场雪的下一个镜头**：同一个雪天，L180 说「整本读完了」（刹车），L200 说「冷也一直读」（不停车）。第三张双正解卡因此能直接指着 L180 说话。 |
| **`magic`** | **2** | **L45** | ✅ **选它**——154 课没用过，是全库最久未用的非零场景。L201 的「把书递给她」需要一个**有点仪式感的「给出去」场合**；`magic` 的标签是「魔法奇幻」，接得住「一本书的交接」。 |
| `space` | **0** | 从未 | ⚠️ **本批不用**——它从零课起就空着，说明它是个**预留位**，需要一次有意的场景立项（配套叙事与美术），不该被一节过去式课顺手消耗掉。建议在路线图里单独为它立一个立项条目。 |

**为什么不给 L201 选 `space`**：`space` 是 14 个合法 id 里**唯一从未使用**的，这本身就是一条待决策的产品信息。如果一节讲 `gave` 的课占用了它，这个「首次登场」的意义就被浪费在一节与太空毫无关系的课上。保留它。

**为什么 L201 用 `magic` 而不是继续用 `campus`/`mansion`**：`campus`（58 次）与 `mansion`（64 次）已经过度使用；`magic` 只有 2 次、且第 45 课之后 **154 课**没碰过。用罕见的场景讲一个新的换零件，也能给长篇连续剧一点新鲜感。

### 4.4 「小美的一天」连续剧落点

两课都能自然落在连续剧里：

- **L200**：接 L198（`We swam in the water`，海边）→ L199（`I sat next to her and caught the bus`，车上）之后，**入冬下雪**。L180 那场雪（`I finished the whole book.`）是前情，L200 是同一个雪天的延续。
- **L201**：从雪天回到室内，**在某个有点奇妙的场合把一本书交到同伴手里**（`magic` 场景）。这个动作接得住 L194（`It was such a big fish.` 海钓）之后的连续剧气息，也给 L202+ 留了「她笑了」这个可以往下接的小钩子。

---

## ⑤ 外部权威依据与逐字引用

**核心问题**：这几个词的过去式在英文教学体系里**怎么组织**——按变化模式还是按频率？在哪个等级？

### 5.1 结论：**主流权威按「一张平表」（多为按频率或字母序），不按变化模式分组；只有 British Council 的评论区点了「可以按模式分组」这半句。**

这解释了为什么本项目的做法（按换法分组）是**有价值但不能声称是权威标准做法**：它是把描述性语言学里真实存在的模式**显式化**，而不是照抄任何一家权威的编排。

### 5.2 逐字引用（URL + 原文）

**引用 1 — British Council · Past simple（按频率组织，不是按模式）**
URL：https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/past-simple
（抓取方式：WebFetch 可读；`curl` 实测 HTTP=000，与已知情况一致）

> "But there are a lot of irregular past tense forms in English."

> "Here are the most common irregular verbs in English, with their past tense forms:"

关键：`most common` 三字直接说明这张表的组织原则是**频率**，不是变化模式。该页只有两个等级标记：

> "Level: beginner"
> "Level: intermediate"

**引用 2 — British Council · Irregular verbs（唯一提到「按模式分组」的权威来源，但只是评论区）**
URL：https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/irregular-verbs

该页正文同样是一张平表（表头 `base form` / `past simple` / `-ed`），**正文没有任何模式分组的说明**。唯一涉及分组的文字来自页面评论（Kirk Moore）：

> "Sometimes people study these verbs in groups based on the past simple form" — for example, 'buy', 'bring' and 'think' all have '-ought' in their past simple form: 'bought', 'brought' and 'thought'.

等级标记：
> "Level: beginner"

**这句话正是本项目 L199 `deepDive.paragraphs[2]` 的独立印证**——L199 已经写了「catch → caught（今天）、think → thought（第 197 课）、buy → bought（第 11 课）——都收在 -aught / -ought 上」。**同一组三个词，权威侧（British Council）与项目侧各自独立归纳出来了。**

该页给出的相关行（逐字）：
```
keep   kept   kept
feel   felt   felt
give   gave   given
tell   told   told
write  wrote  written
mean   meant  meant
sit    sat    sat
```

**引用 3 — Cambridge Dictionary · Irregular verbs（平表，无模式分组，无等级）**
URL：https://dictionary.cambridge.org/grammar/british-grammar/irregular-verbs

该页只有一张 `base form` / `past simple` / `-ed` 三列表，**没有任何模式分组的叙述**；唯一的一句散文是关于 be：

> "be has several irregular forms"

逐字表行：
```
keep   kept   kept
feel   felt   felt
give   gave   given
swim   swam   swum
sing   sang   sung
sit    sat    sat
```
**该页无 CEFR 等级标记。**

**引用 4 — Cambridge Dictionary · Irregular verbs（独立二次抓取，同结论）**
URL：https://dictionary.cambridge.org/grammar/british-grammar/irregular-verbs
第二次抓取确认：正文仍只有表 + `be` 那句注解，**没有「vowel change」「groups」「families」任何一类模式叙述**。（Cambridge 的 `/grammar/british-grammar/irregular-verbs` 与 `/verbs-irregular-verbs` 两条路径实测指向同一内容。）

**引用 5 — Oxford Learner's Dictionaries · feel（`felt` 的等级标签）**
URL：https://www.oxfordlearnersdictionaries.com/definition/english/feel_1

> Yes, the word is in the Oxford 3000 list — the label shown is "ox3000". The past simple form shown is "felt".

**引用 6 — Oxford Learner's Dictionaries · keep（`kept` 的等级与形式）**
URL：https://www.oxfordlearnersdictionaries.com/definition/english/keep_1

> "past simple kept"
> "past participle kept"

等级标签（逐字）：`A1`（not give back）、`A2`（continue doing something）、`B1`（keep a secret）。**注意：这些 A1/A2/B1 标的是 `keep` 的各个义项，不是不规则动词表的分级。**

**引用 7 — EF · Simple past（用「most common」，同样是频率口径）**
URL：https://www.ef.com/wwen/english-resources/english-grammar/simple-past-tense/

> "Some verbs are irregular in the simple past. Here are the most common ones."

该页的组织单位是**单个动词**（`to go`、`to give`、`to come`），**不是模式**。

**引用 8 — Grammarly（明确说「没有一致模式、只能背」）**
URL：https://www.grammarly.com/blog/grammar/irregular-verbs/

> "Irregular verbs are verbs that do not follow the normal pattern of conjugation to express tenses and past participles."
> "Unlike regular verbs, which take on their simple past tense and past participle forms by adding -ed or -d to their base, irregular verbs are conjugated in many unpredictable ways."
> "Irregular verbs can be challenging because they don't follow consistent patterns."

**这是本报告最需要登记的反面证据**：Grammarly 明确说「没有一致模式」。本项目的「按换法分组」做法与这句话**表面冲突**——但两者可以调和：Grammarly 说的是「**不存在能覆盖全部的单一模式**」（这是对的，`go→went` 完全无规律），本项目说的是「**在一小撮词内部存在可复用的局部模式**」（这也是对的，`keep`/`feel` 逐字母同构）。**本项目不能声称自己在教「规律」，只能声称在教「局部相同的一小撮词」**——这恰好与 British Council 评论区那句 `in groups based on the past simple form` 一致。

### 5.3 ⚠️ 抓不到的源（明确声明）

| 源 | 尝试了什么 | 结果 |
|---|---|---|
| British Council 域名（`curl` 直取） | `curl -sS -H "User-Agent: Mozilla/5.0 …" --max-time 40` 取 `/grammar/english-grammar-reference/irregular-verbs` 与 `/past-simple` | **抓不到**：`curl: (92) HTTP/2 stream 1 was not closed cleanly: INTERNAL_ERROR (err 2)`，`HTTP=000 size=0`。**与已知情况一致**；内容页经 WebFetch 可正常读取（引用 1/2 即由此获得）。 |
| `r.jina.ai` 文本代理 | `curl -sS --max-time 25 https://r.jina.ai/https://learnenglish.britishcouncil.org/...` | **抓不到**：`curl: (28) Connection timed out after 25006 milliseconds`，`HTTP=000`。 |
| `en.wikipedia.org/wiki/English_irregular_verbs` | WebFetch ×2（含 `?output=1` 变体）＋ `curl` 取 `action=raw` | **抓不到**：WebFetch 返回 `Connect Timeout Error (443, timeout 10000ms)`；`curl` 返回 `(28) Connection timed out after 30006 ms`，`HTTP=000`。同一问题也出现在 `en.m.wikipedia.org`、`simple.wikipedia.org`。 |
| `oxfordlearnersdictionaries.com/grammar/online-grammar/irregular-verbs` | WebFetch | **抓不到**：`HTTP 404 Not Found`（该路径不存在）。同一域名的**词条页**（`/definition/english/keep_1`、`/feel_1`）可读，见引用 5/6。 |
| `teachingenglish.org.uk` 不规则动词文章 | WebFetch ×2（`/article/irregular-verbs`、`/professional-development/.../irregular-verbs`） | **抓不到**：均是 `HTTP 404 Not Found`（该文章页已不存在或路径变更）。 |
| `englishclub.com`、`usingenglish.com`、`grammaring.com`、`test-english.com`、`cambridge.org/elt/blog`、`thoughtco.com`、`vocabulary.cl`、`britannica.com` | WebFetch 逐个尝试 | **抓不到**：`HTTP 403 Forbidden`（多数）／`HTTP 402 Payment Required`（thoughtco）／`HTTP 410 Gone`（lingolia）／`HTTP 404`（vocabulary.cl）。这些是反爬或已下线，非本机网络问题。 |
| 中文侧教学文章（知乎） | WebFetch 知乎搜索页与问题页 `zhihu.com/question/22612710` | **抓不到**：`HTTP 403 Forbidden`。**中文侧权威源本批未能取得**，登记为缺口。 |
| Murphy《English Grammar in Use》双册 / Swan《Practical English Usage》 | — | **不可得（已知，本批未重试）**——承接第 43 批登记。 |

### 5.4 从依据里读出的三条设计指令

1. **不能把「按换法分组」包装成权威标准做法**（引 1/3/4/8 都按频率或平表组织）。→ L200/L201 的文案**不要出现「英语里有一条规矩是…」这类断言**，只讲「这两个词换法一样」这种**就事论事的观察**。
2. **可以引用「可以按形状分组来学」这个说法**（引 2 的 British Council 评论）——这正好给 L199/L201 的 deepDive 提供独立支撑。
3. **`kept`/`felt`/`gave` 全部是 Oxford 3000 的最高频那一档**（引 5/6 + 第 43 批实测的 7 词全在 ox3000），**等级不构成排序依据**（跟第 43 批结论一致：频率决定「值不值得做」，换法决定「怎么排课」）。

---

## ⑥ 自我核查记录

**⚠️ 口径纪律声明（本报告所有数字都遵守）**：本批**绝不混用口径**。每个数字后面都写明是**口径 A（全字段）／口径 B（正确句）／口径 C（全库含案件）**中的哪一个。第 43 批因口径未说清导致数字被下游误引，本批把口径写进每张表的表头，并且**所有数字只出自同一个脚本的唯一一次运行**（脚本见核查 0）。

**工具纪律**：全部核查用 **node 词边界正则**，正则形如
```js
new RegExp(`(?<![A-Za-z-])${word}(?![A-Za-z-])`, 'gi')
```
**未使用 `grep`**（本地 grep 是 ugrep，会假返回 0）；`(?<![A-Za-z-])` / `(?![A-Za-z-])` 排除连字符标识符与更长词内的假命中。

**数据接入方式**：`src/data/grammarLessons.ts` 与 `huntCases.ts` 是 TS + 图片 import，无法直接 `import`。用项目自带的 esbuild 把它 bundle 成 ESM（图片解析为 `export default null` 的桩），得到 `/tmp/lessons.mjs`（2,521,370 字节，**199 课**）与 `/tmp/cases.mjs`（357,516 字节，**208 案**），然后在 node 里读真实对象。**没有读 TS 源码文本做字符串匹配**——所有计数都建立在真实数据对象上。

---

### 核查 0 · 唯一权威脚本与三个口径的严格定义

**所有数字只出自这一次运行。** 三个口径的定义（原样引用脚本里的谓词）：

```js
// 【口径 A】全字段口径（课时）：课时对象的每一个字符串字段，一个不剔。
const A = (r) => r.num !== null;

// 【口径 B】正确句口径（课时）：在 A 基础上剔三类
//   ① 错句侧  ② deepDive  ③ 叶子名属于中文字段
const WRONG = /(^|\.)(wrong|wrongMark|wrongToken|distractors|options)(\[|\.|$)/;
const DEEP  = /(^|\.)deepDive(\.|$)/;
const ZH    = /(^|\.)(zh|whyZh|explain|noteZh|role|rule|correctionZh|replaceTarget|promptZh|sceneSetupZh|
                 label|title|intentZh|dialogueZh|oneLineRule|grammarLabel|episode|scene|id|cover|kind|who|
                 before|after|sceneZh|tag|word|original|correction|explanation)$/;
const B = (r) => r.num !== null && !WRONG.test(r.path) && !DEEP.test(r.path) && !ZH.test(r.path);

// 【口径 C】全库全字段：课时 + 找错案件，一个不剔。
const C = () => true;
```

> **⚠️ 本报告在自查中修掉了自己的一个 bug（留档以免后人重踩）**：`ZH` / `WRONG` / `DEEP` 三个正则最初写成 `/\.(zh|…)$/`（**只匹配带前导点的路径**），于是**顶层字段 `oneLineRule` / `intentZh` / `dialogueZh` / `grammarLabel` / `title` 全部漏过过滤**，混进了「正确句口径」的计数——`keep` 被多算 2 处（50 而非 48）、`give` 多算 2 处（38 而非 36）。改成 `/(^|\.)(…)$/` 后修正。**这正是「口径不说清就会被误引」的一个实例**，故保留此记录。

---

### 核查 1 · 数据规模

```
课时字段 37713 | 案件字段 8125 | 合计 45838
```
（课时 + 案件共 45,838 个字符串字段，全部纳入过一遍词边界正则。）

---

### 核查 2 · 三口径全表（**本报告最重要的一张表**，字段数／出现次数）

```
┌ 表 1 · 过去式（缺口侧）字段数/出现次数
│ 词                     A 全字段口径(课时)             B 正确句口径(课时)                 C 全库全字段
│ kept                          0/0                     0/0                     0/0
│ gave                          0/0                     0/0                     3/3
│ felt                          0/0                     0/0                     0/0
│ told                          0/0                     0/0                     0/0
│ wrote                         1/1                     0/0                     1/1
│ meant                         0/0                     0/0                     0/0
└
┌ 表 2 · 原形（存量侧）字段数/出现次数
│ 词                     A 全字段口径(课时)             B 正确句口径(课时)                 C 全库全字段
│ keep                        84/94                   48/48                  92/102
│ give                        66/73                   36/36                   73/80
│ feel                        59/61                   37/38                   68/70
│ tell                          6/6                     6/6                     6/6
│ write                         3/3                     1/1                     4/4
│ mean                          1/1                     1/1                     1/1
└
```

**⚠️ 引用的数字请用这张表。** 尤其注意 **A 与 B 的差距**：`keep` 从 84（口径 A）掉到 **48**（口径 B）——少掉的 36 处全在中文讲解里（`oneLineRule`、`summary.points`、`guided[].explain`、`whyZh` 等）。**所以「keep 出现过 84 次」和「keep 在正确句里出现过 48 次」是两件事**——这正是上一批数字被下游误引的根源。

**注意 C1 与 C2 的差距来源**：`keep` 从 84（C2）掉到 **50**（C1），少掉的 34 处几乎全在中文讲解里（`oneLineRule`、`summary.points`、`guided[].explain`、`whyZh` 等）。**所以「keep 出现过 84 次」和「keep 在句子里出现过 50 次」是两件事**——这正是上一批数字被误引的根源，本报告把两者并列给出。

---

### 核查 3 · 逐字母差异（分组判定的硬证据）

```
give   → gave     逐字母差异: i→a@1   [长度 4→4]
sit    → sat      逐字母差异: i→a@1   [长度 3→3]
swim   → swam     逐字母差异: i→a@2   [长度 4→4]
sing   → sang     逐字母差异: i→a@1   [长度 4→4]
keep   → kept     逐字母差异: e→p@2 , p→t@3   [长度 4→4]
feel   → felt     逐字母差异: e→l@2 , l→t@3   [长度 4→4]
tell   → told     逐字母差异: e→o@1 , l→d@3   [长度 4→4]
catch  → caught   逐字母差异: t→u@2 , c→g@3 , ∅→t@5   [长度 5→6]
write  → wrote    逐字母差异: i→o@2   [长度 5→5]
```

**读法**：
- `keep`/`feel` 差异位置**完全相同**（`@2`、`@3`）→ 可共用一句讲法 → 合成 L200。
- `give` 差异位置 `@1`，与 `sit` 完全相同 → 同一条换法 → 与 L199 呼应，但**与 `kept`/`felt` 零重叠** → 必须独立成 L201。
- `tell` 差异位置 `@1`、`@3` **不连续**（中隔一位），凑不出同伴。
- `write` 是 `i→o@2`（**不是** i→a），方向与 A 组/B 组都不同。

---

### 核查 4 · 逐槽命中向量（**口径 B 正确句口径**，字段数）

```
┌ 表 3 · 口径 B 下逐槽命中向量（字段数）
│ 词        dialogu  targetS   blocks  example  dialogu  contras  variant  summary   guided  practic   recall
│ keep           2        2        2        4        2        8        5        4        8        6        2
│ kept           0        0        0        0        0        0        0        0        0        0        0
│ give           1        1        1        4        1        5        3        4        7        6        1
│ gave           0        0        0        0        0        0        0        0        0        0        0
│ feel           1        1        1        2        1        6        3        2        6       10        1
│ felt           0        0        0        0        0        0        0        0        0        0        0
└
```

**关键**：`kept` / `felt` / `gave` 在**每一个槽位**上都是 0——不是「某个槽位漏了」，是**全槽位零出现**。

---

### 核查 5 · 原形命中的课分布（**口径 B 正确句口径**）

```
┌ 表 4 · 口径 B 下原形逐课分布
│ keep   48 字段 → L77:28 L78:20
│ give   36 字段 → L63:32 L68:4
│ feel   37 字段 → L76:18 L78:4 L131:14 L132:1
│ tell    6 字段 → L41:2 L101:1 L110:1 L117:1 L185:1
│ write   1 字段 → L111:1
│ mean    1 字段 → L95:1
└
```

**`tell` 的 6 处全部是 `Tell me about …` 句式**（逐条列出）：

```
L41  dialogueEn          Can you tell me about your class?
L41  dialogue[0].en      Can you tell me about your class?
L101 dialogue[0].en      Tell me about last night.
L110 dialogue[0].en      Tell me about your week!
L117 dialogue[0].en      Tell me about your family!
L185 dialogue[0].en      Tell me about your cousin.
```

**简报的 `tell` = 6 与口径 B 逐字对上**（另 5 个词则对不上）——这说明简报用的口径比口径 B 略宽（很可能是把 `sceneSwings` 与 `guided[].before` 之类的残片也算了进去），宽出来的那一点不足以补上 `keep`/`give`/`feel` 的差值，**所以简报的 46/35/34 仍无法复现**。


---

### 核查 6 · L197 deepDive 的实际内容（推翻第 43 批的「修正一」）

```
L197 deepDive.paragraphs[3] 全文：
这一批只能一个个记，没有捷径。好消息是它们数量有限，而且都是最常用的——
你在前面几课已经碰过好几个了：went（第 10 课）、ate（第 10 课）、saw（第 10 课）、
bought（第 11 课）、thought 和 knew（就是今天这两个）。剩下的以后再一个一个补。
```

**反向验证**：全库检索「同一个字符串字段里同时含 `gave` 与 `told`」→ **命中 0 处**。如果第 43 批引的那串 `…gave、told、felt、kept…` 真的存在，这一检索必然命中。**第 43 批的「修正一」不成立，本报告推翻它。**

---

### 核查 7 · 结构基线（支撑「一课 2 个点」的容量上限）

```
平均引导题数: 5.99 | avg practice: 5.14 | avg contrast: 6.00 | avg blocks: 2.48 | avg examples: 4.18 | avg sceneSwings: 3.00

L194 blocks=2 contrast=6 guided=6 practice=5 examples=4 swings=3
L195 blocks=2 contrast=6 guided=6 practice=5 examples=4 swings=3
L196 blocks=2 contrast=6 guided=6 practice=5 examples=4 swings=3
L197 blocks=2 contrast=6 guided=6 practice=5 examples=4 swings=3
L198 blocks=2 contrast=6 guided=6 practice=5 examples=4 swings=3
L199 blocks=2 contrast=6 guided=6 practice=5 examples=4 swings=3

L191 blocks=2 :: She walked | into the kitchen              （1 个新点）
L192 blocks=3 :: We walked | through the forest | and across the bridge  （2 个新点，blocks 拆成 3 段）
L197 blocks=2 :: I thought about it | and knew the answer  （2 个新点）
```

**读法**：`blocks=2` 是 2 个新点的标准形态；第 192 课因为要放「through + across」两个介词短语才用了 3 段。**没有一课放过 3 个新点。**

---

### 核查 8 · `mean` 的唯一命中是假阳性

```
=== mean 在 L95 的命中 ===
  dialogue[1].en :: At eight, I mean.
```

`At eight, I mean.` 里的 `I mean` 是**插入语「我是说」**，不是动词 `mean`（意思是）的用法。**所以 `mean` 的实际存量是 0，不是 1**。本报告仍按 1 登记（保守），但设计上按 0 处理——它与 `write`（唯一命中在 L23 的 deepDive 讲解文本里，`write 的昨天版是 wrote`，属于「点了一句」而非教学）同属**存量不足，本批不做**。

---

### 核查 9 · 运行时缺口（本项目代码侧，必须同步补）

**文件**：`src/services/languageGateService.ts`

```ts
// 第 26-27 行
/** 常见不规则动词：原形 → 过去式。误判防护见 detectTenseTag。 */
const IRREGULAR_PAST: Record<string, string> = {
  come: "came", go: "went", arrive: "arrived", leave: "left",
  take: "took", get: "got", see: "saw", say: "said",
  tell: "told",        // ← 第 36 行
  give: "gave",        // ← 第 37 行
  find: "found", bring: "brought",
  buy: "bought", meet: "met", run: "ran", eat: "ate", sleep: "slept"
};
```

**实测结论**（行号已逐条核对）：
- ✅ `give: "gave"` **已在表里**（**第 37 行**）
- ✅ `tell: "told"` **已在表里**（**第 36 行**）
- ❌ **`keep` 与 `feel` 都不在表里**（全表 17 条，无此二词）← L200 上线后，用户写 `keeped`/`feeled` 时判定引擎识别不出

**建议**：L200 落地时同步补 `keep: "kept"` 与 `feel: "felt"` 两条。这是**代码改动，不在本报告的纯研究范围内**，仅登记。

（同一文件**第 516 行** `isIrregularPast` 用 `Object.values(IRREGULAR_PAST).includes(word)` 做反查，所以**补表会自动让 `kept`/`felt` 被识别为合法的过去式**，不需要改两处。）

**⚠️ 附带信息**：同一文件的第 26 行注释写的是「常见不规则动词：**原形** → 过去式」——**「原形」是 29 个红线术语之一**。但它**不是用户可见文案**（是源码注释），不在零术语守门的范围内（守门只遍历 `grammarLessons` 的字段）。本报告仅登记这个观察，不建议改动。

---

### 核查 10 · 8 项守门的机械核验（针对 §4 的文案）

```
══════ L200 ══════
① 星号守门: ✓ 0 处（deepDive 未提供，其余字段全清）
④ 重放题: 1 道（展示池 5 句）
⑤ C 层新句: 1 道  ✓ :: She felt cold, but she kept walking.
⑥ 新句微调(≥0.8): ✓ 0 条
⑦ 难度闸门: 最长分句 10 词，L199=9 → 跳 +1  ✓

══════ L201 ══════
① 星号守门: ✓ 0 处（deepDive 未提供，其余字段全清）
④ 重放题: 1 道（展示池 5 句）
⑤ C 层新句: 1 道  ✓ :: He gave me his pen.
⑥ 新句微调(≥0.8): ✓ 0 条
⑦ 难度闸门: 最长分句 8 词，L199=9 → 跳 -1  ✓
```

**零术语全字段遍历**（用与 `src/data/grammarZeroTerms.ts` **同表**的 28 个术语 + 同一条 `从句子尾` 误报阻断规则，遍历 §4 的全部 20 条文案）：

```
✓ 全部 20 条文案零术语通过
```

**逐条已核的文案槽位**：`oneLineRule`、`summary.rule`、`blocks[].role`、`contrast[].whyZh`、以及全部英文句与答案。

**关于「原形」这个红线词**：本报告的 §4 文案全部用「**穿原样**」「**原来的样子**」「**昨天版**」表述，**没有一处使用「原形」**。上表检测确认。

**② 语义守门与 ③ 题干-答案一致性**：本报告只给了设计方案，未生成最终 `guided[].answer` / `practice[].tokens`，这两项的机械核验要在写课时跑（题干-答案一致性的数量线索检查——「两个」不用 `among`、「那些」不用 `between`——本批文案不涉及 both/among，天然安全）。

---

### 核查 11 · 场景使用实测（支撑 §4.3 的选择）

```
┌ 表 6 · 场景使用（课时）
│ mansion      64 次  最近 L196    ← L195/L196 连用
│ campus       58 次  最近 L197
│ city         39 次  最近 L192
│ sparkle       9 次  最近 L137
│ island        6 次  最近 L194
│ train         6 次  最近 L199    ← L199 刚用
│ mystery       4 次  最近 L157
│ forest        3 次  最近 L187
│ ocean         3 次  最近 L198    ← L198 刚用
│ magic         2 次  最近 L45     ← ✅ 154 课未用
│ snow          2 次  最近 L180    ← ✅ 19 课未用
│ lighthouse    2 次  最近 L193
│ desert        1 次  最近 L186
│ space         0 次  从未使用     ← ⚠️ 保留给一次正式的场景立项
└
```

---

## ⑦ 不确定项

1. **简报的三个核心数字（`keep` 46 / `give` 35 / `feel` 34）在本机任何单一口径下都不复现。** 我做了 40 种口径组合的搜索（4 种文本过滤 × 4 种字段过滤 × 全部顶层字段子集 + 4 种计数度量），**没有一种能同时命中 46/35/34**。最接近的口径 B（正确句口径）是 **48/36/37**（差 +2/+1/+3）。**但 `tell`=6 / `write`=1 / `mean`=1 三个数在口径 B 下逐字对上**，说明简报的口径比口径 B 略宽、混入了 `sceneSwings` 与 `guided[].before` 之类的残片，而那一点宽度不足以补上 `keep`/`give`/`feel` 的差值。**结论层面（3 个原词存量高、3 个过去式全 0）不受影响**，但**下游引用本报告的数字时，请引用 §6 核查 2 的表并写明是口径 A / B / C 中的哪一个**，不要引用简报的 46/35/34。（第 43 批登记过同类现象，这是第二次。）

2. **第 43 批的「修正一」是错的，本报告推翻了它，但我不确定它是怎么产生的。** 第 43 批声称 L197 `deepDive.paragraphs[3]` 里点了一串名（含 `gave、told、felt、kept`），实测该段落**不含这些词**，且全库「同字段同时含 gave 与 told」命中 0 处。**可能的原因**：(a) 第 43 批是在一次尚未落地的草稿上做的核查；(b) 数字来自另一个版本的库；(c) 幻觉。**我无法判定是哪一个**——本批只能确认「今天的库里没有这段文字」。**建议：如果第 43 批的其他结论依赖这条「修正」，需要重新核一遍**（我抽查了它的分组结论，与今天的库一致，所以影响范围应该很小）。

3. **`space` 场景该不该用，我没有决定权。** 它是 14 个合法 id 里唯一从未出现过的。我在 §4.3 建议**保留给一次正式的场景立项**（配叙事 + 美术），但这属于产品决策。**如果下游认为「有场景就先用掉」，L201 可以用 `space`**（「把书递给她」在太空场景也讲得通），但我认为那样会浪费一个「首次登场」的机会。

4. **L200 的 `felt` 与 L76 的 `feel` 之间是否真构成「接力」，我只有间接证据。** L76 的 `targetSentence` 是 `I feel much better today.`，它**从没讲过 `feel` 的过去式**（实测 `felt` 在 L76 里 0 出现）。所以把 L76 那句放进 L200 的双正解卡，讲的是「同一个 feel、两班岗」——**逻辑上成立，但我没有实测过用户会不会因此把 L76 的「much better」也当成今天要学的东西**。如果写课时发现这会让 L200 的焦点漂移，**换掉这张卡、改用 L131（`The water feels cold.` 摸着凉）**——那课的 `feel` 是「摸着」这个义项，与 L200 的「觉得冷」更近，且同样是从未讲过过去式。

5. **`keep→kept` 的讲法我在文案里写的是「两个 e 只剩一个、尾巴加个 t」。这句话的准确性我没有权威源背书。** 引 1–8 里**没有任何一家**用这种方式描述 `keep`/`feel` 的变化（它们全是平表）。这句话是本项目自己的**描述性观察**，不是引用。**它是否会对用户造成「这是一条通用规律」的误导**（进而在 `sleep→slept` 之外的词上乱套），我没有实测依据。**缓解措施**：L200 的文案刻意避开了「规律」「规矩」这类词，只讲「这两个词换法一样」。**如果下游要更强地表述，请先找权威源。**

6. **中文侧教学文章的源本批完全没拿到。** 知乎（搜索页与问题页）都是 `HTTP 403`。**所以「中文母语者/中文教学体系怎么组织这几个词」这一问，本报告答不上来**——§5 的结论全部来自英文侧权威源。如果这一问重要，需要换渠道（如可访问的汉语教学期刊、或国内可直达的教学站点）。
