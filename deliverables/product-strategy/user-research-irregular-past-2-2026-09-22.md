# 瑞思 · 用户研究与内容缺口分析
## 7 个高价值不规则过去式：拆课方案与内容设计（第 43 批）

- 日期：2026-09-22
- 范围：`src/data/grammarLessons.ts`（**197 课**）+ `src/data/huntCases.ts`（**206 案**）+ `src/data/grammarSeasons.ts`（28 季）+ 全 `src/`（词边界复核）
- 性质：**纯研究**——本报告不改任何代码与数据
- 上游：第 42 批路线图 §5 携带项 4「剩余 7 个高价值不规则过去式」；第 42 批已做 L197（`thought`/`knew`）
- ⚠️ **本批推翻了简报的一处前提**——见 §2.0「简报数字不复现」与 §6 不确定项 1

---

## ① 结论摘要

### 拆几课：**4 课**（L198–L201），不是 2 课也不是 3 课

| 课 | 新点 | 词数 | targetSentence | 中文意图 | 场景 |
|---|---|---|---|---|---|
| **L198** | `swam` + `sang`（2 个点，同一条换法） | 8 | `We swam in the water and sang together.` | 我们在水里游了泳，还一起唱了歌 | `ocean` |
| **L199** | `sat` + `gave`（2 个点，同一条换法） | 10 | `I sat next to her and gave her the book.` | 我坐在她旁边，把书递给了她 | `train` |
| **L200** | `felt` + `kept`（2 个点，同一条换法） | 10 | `I felt cold in the snow, but I kept reading.` | 雪地里我觉得冷，可还是一直往下看 | `snow` |
| **L201** | `caught`（**1 个点，单独成课**） | 8 | `I got up early and caught the bus.` | 我起得很早，赶上了那班车 | `city` |

**为什么是 4 课**：这 7 个词**刚好分成 4 条互不相同的变化方式**，而本项目的单课容量是 **2 个新点**（L191/L192/L197 实测都是 `blocks=2`、`contrast=6`、`practice=5` 的同一档；见核查 7）。4 条方式 × 每课最多 2 点 → **最少 4 课**。其中 `caught` 单独成课，因为它的变化方式（尾巴换成一整串 `-aught`）与其余 6 个都不同，**凑不到「2 个点同一条换法」**——它和第 197 课的 `thought`／第 11 课的 `bought` 才是一组，而那两课已经上过了。

**为什么不是 2 课**（把 7 个硬塞成 2 课 = 每课 3.5 个点）或 **3 课**（每课 2.33 个点）：会破坏本项目一贯的「一课一条换法」节奏，且 `caught` 必然被塞进一个跟它无关的组里，讲不出道理。

---

## ② 7 词的分组判定

### 2.0 ⚠️ 先修正简报的前提：计数与「零出现」两处

**修正一：`kept` / `felt` / `gave` 不是「全库 0 出现」，而是各 1 处——但这一处等于 0。**

简报给的「正确侧 0、错侧也是 0，即从未出现过」对 `swam`/`sang`/`caught`/`sat` 成立，对另 3 个**不成立**。实测这 3 个词各命中 **1 个字段**，全部来自**同一个字段**：

```
L197-irregular-past  deepDive.paragraphs[3]
  这一批只能一个个记，没有捷径。好消息是它们数量有限，而且都是最常用的——
  记住一个就常在句子里碰到：went、ate、saw、bought、thought、knew、gave、told、felt、kept…
```

这是 L197 的 deepDive 里**一串被点名的词**，不是一句话、不是一个句子、也**没有被教**。从「用户能不能学会这个词」的角度计，它和 0 等价——**结论不变，但事实要写准**（第 42 批简报的「0」应记为「1 处点名、0 处句子」）。

**修正二：简报给的原词出现次数（`swim`=36 / `sing`=41 / `keep`=33 / `feel`=24 / `give`=22 / `catch`=20 / `sit`=23）在本机用任何单一口径都不复现。**

我试了 6 种口径（全部字段 / 非错侧 / 句子槽 / 展示槽 / 仅 `examples[].en` / 仅 `en` 结尾字段），实测量级是「全部字段 102/103/94/61/67/46/47」到「句子槽 44/49/38/27/23/23/27」之间，**没有一种落在简报的数字上**：

```
口径                     swim   sing   keep   feel   give  catch    sit
全部字段                    102    103     94     61     67     46     47
非错侧全部字段                  94     94     90     53     65     43     43
句子槽（非错侧）                 44     49     38     27     23     23     27
展示槽（非错侧）                 78     79     81     43     56     39     36
仅 examples[].en           5      6      4      2      4      4      4
仅 en 结尾字段                15     19     14      9     10      8      9
简报                       36     41     33     24     22     20     23
```

**但排名的方向是一致的**（`sing` > `swim` > `keep` > `feel` > `sit` ≈ `give` ≈ `catch` 这一段的相对位次对得上），所以简报的**结论层面没问题**——这 7 个词的原词确实都被大量教过。**本报告一律采用我自己的实测值**，并把这个不一致登记在 §6。

### 2.1 结论：**按「变化方式」分组，不按使用频率分组**

**这 7 个词确实能按变化方式分组，而且几乎正好是两两一对。**

| 组 | 变化方式 | 词 | 本课新点数 |
|---|---|---|---|
| **A 组** | 中间的字母 **i 换成 a**，其余字母一个都不动 | `swim`→`swam`、`sing`→`sang`、`sit`→`sat` | **3 个词，拆成 2 课**（L198 两个 + L199 一个，L199 再搭 `gave`） |
| **B 组** | 两个 `ee` **变短成一个 e**，尾巴上**再加一个 t** | `keep`→`kept`、`feel`→`felt` | **1 课**（L200，2 个点） |
| **C 组** | i→a **同时换掉尾巴的辅音** | `give`→`gave` | **不单独成课**，搭进 L199 与 A 组共享「i→a」这一半 |
| **D 组** | 尾巴换成一整串 **`-aught`** | `catch`→`caught` | **1 课**（L201，1 个点） |

**关键判断：A 组的 3 个词能不能互相带动？——能，但只能带 2 个点，第 3 个要换搭档。**

`swim`/`sing`/`sit` 三个词的变化方式完全同一条（i→a，其余不动），是全批最干净的一组。但**一课只放 2 个点**，所以：

- L198 放 `swam` + `sang`（两个都是「i 换成 a」的纯净样本）
- L199 放 `sat`（A 组第三个）+ `gave`（C 组）

把 `sat` 放在 L199 而不是硬塞进 L198，是因为 L198 的两个词都是**单音节、i 在倒数第二/唯一音节**（swim/sing），`sit` 是同一型；但 L199 需要第二个点，而剩下的 `gave` **恰好也含 i→a**——于是 L199 的讲法不是「两个不相干的词」，而是「**同一个换法再吃两个：`sit` 是干净的 i→a，`give` 是 i→a 顺手把尾巴的 v 换成了 v 的声音写法**」。两个点共享「i→a」这一半，**仍然是一条换法**。

**为什么 C 组（`gave`）不单独成课**：`give`→`gave` 只有 1 个词，凑不出 2 个点的课；而它的前半段（i→a）与 A 组同源，搭在 L199 是**唯一能讲出道理的位置**。硬单独成课会变成「今天学一个词」，与项目节奏不符。

**为什么 D 组（`caught`）单独成课**：它的换法是**尾巴的 `-tch` 整段换成一串 `-aught`**，与 i→a 毫无关系、与 ee→e+t 也毫无关系。它真正的同族是 `bought`（L11）和 `thought`（L197）——**这两课都已经上过**。所以 L201 的正确定位不是「教一个孤立的词」，而是「**回过头把尾巴是同一串的三个词排一行**」：`bought`／`thought`／`caught` 都是 `-ought`／`-aught`。

### 2.2 为什么不按使用频率排

你问的是「该优先做有规律可讲的组合，还是按日常使用频率排（feel / give 更高频）」。**答案是按变化方式，而且这里两者不冲突。**

1. **按频率排在这批里没有可执行性。** `feel`（B 组）和 `give`（C 组）分属两条不同换法，按频率排会得到「L198 教 feel + give」这样**两个点讲不出同一条道理**的课——正好违反项目「一课一条换法」的一贯做法（L190 的「前面穿 -ing，后面垫 to」、L191 的「进到里面用 into」都是单一换法）。
2. **7 个词覆盖的高频面已经足够，不需要靠排序再优化。** Oxford 词典实测这 7 个原词**全部是 Oxford 3000（最核心词表）**，等级 A1/A2：`swim` a1（`Topics Sports: water sports a1`）、`sing` a1（`ox3000`）、`keep` A1（`ox3000`）、`feel` a1（`Oxford 3000`）、`give` a1–a2（`Oxford 3000`）、`catch` a2（`Oxford 3000`）、`sit`（`ox3000`）。**7 个全在最高频那一档**，谁先谁后不是问题。
3. **按变化方式排反而把「记忆负担」降到了最低**：A 组 3 个词共享一条换法，学习者只需要记「**i 换成 a**」这 4 个字，就同时拿到 `swam`/`sang`/`sat` 三个词；B 组 2 个词共享「ee 变短 + 加 t」，1 句话拿到 2 个词。**7 个词最终只有 3 条规则**（i→a、ee→e+t、-tch→-aught）。按频率排会把这个压缩比全部浪费掉。

**一句话**：频率决定「值不值得做」（已经证明了：7 个词的原词在库里合计出现 **520 次**（全部字段口径：102+103+94+61+67+46+47），却一个过去式都没有），**变化方式决定「怎么排课」**。两者各管一半，不矛盾。

### 2.3 ⚠️ 一个必须先解决的「撞车」：`rang` 已经是 i→a

**L99 已经教过 `rang`（ring 的昨天版）**，而 `rang` 就是 i→a 型：

```
L99  目标句  I was reading when the phone rang.
L99  recall.noteZh  一阵子穿 -ing、一下子用昨天版——rang。
L102 summary.rule   …打断（rang／called）…
```

全库实测 i→a 型的过去式**已有 `rang`、`drank` 两个在句子里出现过**（`rang` 见 L99/L100/L101/L102；`drank` 见 L11/L180）。**但全库从来没有一处讲「i→a 这条换法本身」**——实测 `「i 换成 a」这类讲法：命中 0 字段`。

**这是好事，也是必须利用的既有资产**：
- 好处：L198 讲 i→a 时，**可以指着已经学过的 `rang` 说「你早就见过这个换法了」**（L99 学过，22 课之前），比空讲规则有力得多。
- 代价：L198 的 `oneLineRule` **不能写成「今天第一次见这条换法」**——要写成「**把这条换法说穿**」，即「你之前零零散散见过，今天把它挑明」。
- **建议在 L198 的 `deepDive` 里正式点名 `rang`**，让「i→a」这条线第一次被显式连起来。

---

## ③ 每课错句与双正解设计

**设计口径**（对齐项目既有做法）：
- 错句必须来自**中文母语者的真实负迁移**，不是凭空编的错。
- 双正解必须**指出对照对象**——课与课之间形成呼应，而不是随便找句对的。

### 3.1 L198 `We swam in the water and sang together.`

**中文意图**：我们在水里游了泳，还一起唱了歌。
**场景 `ocean`**——理由见 §3.5。

#### 三条带标记错句

| # | 错句 | `wrongMark` | 负迁移成因（中文母语者为什么会这么错） |
|---|---|---|---|
| 1 | `We swimmed in the water and sang together.` | `swimmed` | **最核心的错**：L10 教的是「加 -ed 就是昨天版」（`play→played`、`watch→watched`），这条规矩管住了绝大多数词，学习者会**默认它管所有词**。`swim` 的尾巴是「辅音+元音+辅音」，中文母语者还会顺手**双写末尾辅音**（类比 `stop→stopped`），于是造出 `swimmed`。 |
| 2 | `We swim in the water and sing together.` | `swim` | **中文完全没有「动词变形状」这回事**：「游泳」昨天游、今天游、明天游都是同一个词。学习者**照中文直译**，动词一个字母都不改——这是最深的一层负迁移，也是 L197 `contrast[2]`（`know the answer` 没换）同一型错误的复现。 |
| 3 | `We swam in the water and sung together.` | `sung` | **`sing` 有两个「不听话的版本」，中文母语者分不清哪个是哪个**。`sung` 在第 52 课（`The song was sung by her.`）出现过，学习者会**记住先碰到的那一个**，用到「昨天唱歌」的位置上。实测全库 `sung` 只在 L52 出现 2 处，`sang` 0 处——**学习者想学 `sang` 却无处可查，只能拿 `sung` 顶**。 |

#### 三条双正解

| # | 对照句 | 对照对象 | 为什么两句都对 |
|---|---|---|---|
| 1 | `I am learning to swim.` | **L190**（`be` 后面穿 -ing、再垫 to） | 两句都对，看的是动作在什么时候——L190 那句说的是「正在学」这件眼下的事，`swim` 是**跟着 to 的原样**（`to swim`）；今天这句说的是「昨天游过了」，`swim` 要换昨天版 `swam`。**同一个 `swim`，站的位置不同，穿的衣服就不同。** |
| 2 | `I was reading when the phone rang.` | **L99**（一阵子穿 -ing、一下子用昨天版） | 两句都对——L99 那句的 `rang`（ring→rang）**就是今天这条 i→a 换法**，你在 99 课已经见过它了，只是当时没挑明。今天把这条换法说穿：`ring→rang`、`swim→swam`、`sing→sang` 都是「**i 换成 a，别的字母不动**」。 |
| 3 | `Yesterday I went to the park.` | **L10 / L24**（说昨天的事 / 昨天版 vs 做过版） | 两句都对——L10 那句的 `went` 是「单独记的昨天版」（第 197 课点过名），跟今天的 `swam`/`sang` **是同一批老朋友**：都不加 -ed，都有自己的样子，都得一个词一个词记。第 10 课开的那条线，今天接着往下走。 |

**本课与 L197 的接口**（L197 在上一课，必须显式接上）：L197 的 `deepDive` 说「这一批只能一个个记」——L198 要**兑现这句话**，同时**前进一步**：L197 是「两个各不相干的词」，L198 是「**这批词里有一部分能按字母变化成组记**」。这是从「纯死记」到「有规律可循」的关键一步，**建议写进 L198 的 `oneLineRule`**。

---

### 3.2 L199 `I sat next to her and gave her the book.`

**中文意图**：我坐在她旁边，把书递给了她。
**场景 `train`**——理由见 §3.5。

#### 三条带标记错句

| # | 错句 | `wrongMark` | 负迁移成因 |
|---|---|---|---|
| 1 | `I sitted next to her and gave her the book.` | `sitted` | **同 L198 错句 1 的机制**，而且更强：`sit` 的前半截 `sitt-` 是「重读闭音节」，中文母语者会类比 `sit→sitting` 的**双写**（L190 的 `learning` 家族里见过 `-ing` 的双写），把「加 -ed」和「双写」一起用上，造出 `sitted`。 |
| 2 | `I sit next to her and gave her the book.` | `sit` | **中文不变量 → 前半截漏换**。但这里还有一层更具体的成因：**`sit` 在第 79 课和第 196 课都以「现在」的样子出现过**（`He sits next to me.` L79；`I sit between Tom and Amy.` L81/L86/L196）——学习者对这个词最熟的印象就是「不变」的样子，**所以 `sit` 是这批词里最容易漏换的一个**。 |
| 3 | `I sat next to her and give her the book.` | `give` | **L197 `contrast[2]` 的同一型错误**（前半截换了、后半截没换）。L197 明写过这个成因：「两件事都是昨天做的——前半截用了 thought，后半截也要跟着穿昨天版」。学习者**注意力只够处理一个动词**，改完第一个就以为改完了。这一型错误在本项目里已被认定为高价值错误（L197 已建同类对照卡）。 |

#### 三条双正解

| # | 对照句 | 对照对象 | 为什么两句都对 |
|---|---|---|---|
| 1 | `He sits next to me.` | **L79**（位置词 next to） | 两句都对，差在什么时候——L79 那句说「他（每天都）坐在我旁边」，是**现在一直这样**；今天这句说「（那次）我坐在她旁边」，是**昨天那一次**。`sit` 在前面有 `he` 的时候还要带小尾巴（`sits`），换了时间就要换样子（`sat`）——**同一个 `sit`，两件事都要它变**。 |
| 2 | `Please give me the book.` | **L63**（给东西 · `give me the book` / `give it to me`） | 两句都对——L63 那句是**请人把书递过来**（现在开口要），今天这句是**说昨天已经把书递出去了**（`gave`）。`give` 的「先给谁、后给什么」那一套顺序**一点没变**（`gave her the book`），变的只有那个词自己的样子：`give`→`gave`。 |
| 3 | `I sit between Tom and Amy.` | **L81 / L196**（between / among） | 两句都对——L81 那句的 `sit` 说的是**固定座位**（现在一直坐那儿），今天这句是**昨天那次坐**（`sat`）。而且两句正好一个 `between`（两头点名）、一个 `next to`（挨着一边）——**L196 刚讲完的「差在几个」，这里顺手复习一格**。 |

**L199 的语法Label 建议**：`同一个换法再吃两个 · sit 和 give 的昨天版`——明确把「i→a」这条线从 L198 接过来，而不是「两个新词」。

---

### 3.3 L200 `I felt cold in the snow, but I kept reading.`

**中文意图**：雪地里我觉得冷，可还是一直往下看。
**场景 `snow`**——理由见 §3.5。

#### 三条带标记错句

| # | 错句 | `wrongMark` | 负迁移成因 |
|---|---|---|---|
| 1 | `I feeled cold in the snow, but I kept reading.` | `feeled` | **同 L198 错句 1 机制**（L10 的「加 -ed」被当成万能规矩）。`feel` 是**规则动词里最容易被误判成规律的那一类**——它和 `need`/`help`/`walk` 长得一样顺（都是「辅音+ee/e+辅音」），学习者会理所应当地加上 -ed。实测全库 `feeled` **0 处**，说明这个错**还没被人造出来过**——正好说明它是个还没被防住的坑。 |
| 2 | `I felt cold in the snow, but I keep reading.` | `keep` | **前后半截只换一个**（同 L199 错句 3 / L197 `contrast[2]` 型）。特别值得做成对照卡，因为 `keep` 在 L77 教的是「**一直做、不停做**」（`I keep reading at night.`）——`keep` 的**固有含义就是「持续」**，中文母语者会直觉觉得「一直做的事不用换时间」，**这个坑比一般的漏换更深**。 |
| 3 | `I fell cold in the snow, but I kept reading.` | `fell` | **`fell` 和 `felt` 只差一个字母，读音也接近**，是全批**唯一一对「拼写撞车」**。`fell` 是「fall 的昨天版」，在第 193 课以句子的形式出现过（`He was so tired that he fell asleep.`）。学习者记住了 `fell` 的样子，用它去填「觉得」的位置。**这一条要单独提醒：不是规则问题，是两个字长得太像。** |

#### 三条双正解

| # | 对照句 | 对照对象 | 为什么两句都对 |
|---|---|---|---|
| 1 | `The water feels cold.` | **L131**（摸着 · `feels cold`） | 两句都对，看的是**什么时候摸的**——L131 那句说「（现在）这水摸着凉」，今天这句说「（昨天在雪地里）我觉得冷」。而且两句都用了「**后面直接跟那个「怎么样」的词、中间不站 is**」这个 L131 教的架子（`feels cold`／`felt cold`），**架子照旧，只换那个词自己的样子**：`feels`→`felt`。 |
| 2 | `I keep reading at night.` | **L77**（习惯不停 · `keep` + 名字版） | 两句都对——L77 那句说「我（每天）晚上一直看书」，今天这句说「（昨天）我一直往下看」。**`keep` 后面照样直接跟穿 -ing 的那个动作、中间不垫 to**（`keep reading`／`kept reading`），L77 立的那条规矩一点不动，只把 `keep` 换成 `kept`。 |
| 3 | `He was so tired that he fell asleep.` | **L193**（太…了，所以…） | 两句都对——**L193 那句里就藏着今天要提防的 `fell`**（`fell asleep` = 睡着了，是「倒下」那个词的昨天版）。今天学的 `felt` 是「觉得」那个词的昨天版。**两个字只差中间一个字母**：`f`+`el`+`t`（觉得）／`f`+`el`+`l`（倒下）。放在一起看，就不会再拿 `fell` 去填「觉得」。 |

**L200 的语法Label 建议**：`两个 ee 变短再加个 t · keep 和 feel 的昨天版`——与 L198/L199 的「i 换成 a」形成**并列的第二条换法**，让学习者看到「这批词里有好几条换法，一条一条收」。

---

### 3.4 L201 `I got up early and caught the bus.`

**中文意图**：我起得很早，赶上了那班车。
**场景 `city`**——理由见 §3.5。

#### 三条带标记错句

| # | 错句 | `wrongMark` | 负迁移成因 |
|---|---|---|---|
| 1 | `I got up early and catched the bus.` | `catched` | **同 L198 错句 1 机制**，且 `catch` 是最「像规则动词」的一个：它的尾巴 `-tch` 在一般现在时里帮它加小尾巴（`catches`，L173 家族见过 `watches`），学习者对「`catch` 后面加东西」这个操作很熟，于是**顺手加 -ed 造出 `catched`**。这是**全批里最容易被造出来的错**。 |
| 2 | `I got up early and catch the bus.` | `catch` | **中文不变量**，但这里还有一层：**L173 的目标句就是 `I got up early in order to catch the bus.`**——学习者对 `catch` 最深的印象**恰恰是「不换样子」的那个位置**（`in order to` 后面的原样）。**同一句话、同一个词，L173 要求不换、L201 要求换**——这是全批最需要显式切开的一处。 |
| 3 | `I got up early and bought the bus.` | `bought` | **同族词的过度泛化**：学习者记住「`-ought` 这一串都是昨天版」（L11 的 `bought`、L197 的 `thought`），会**把这串音套到所有「昨天做的动作」上**。但 `bought` 是「买」（L11 的 `I bought two notebooks.`、L68 的 `I bought a gift for my mom.`），`catch` 是「赶上」。**两个词尾巴声音一样，意思完全不同。** |

#### 三条双正解

| # | 对照句 | 对照对象 | 为什么两句都对 |
|---|---|---|---|
| 1 | `I bought two notebooks.` | **L11**（好几个 + 特殊的昨天版） | 两句都对——L11 那句的 `bought` 是「买」的昨天版，今天这句的 `caught` 是「赶上」的昨天版。**两个词的尾巴是同一串 `-ought`／`-aught`**，都单独记、都不加 -ed。**这就是今天这条换法的证据**：`-tch`／`-ght` 结尾的这几个词，昨天版尾巴都是这一串。 |
| 2 | `I thought about it and knew the answer.` | **L197**（昨天的老朋友） | 两句都对——L197 那句的 `thought` 也是这一串（`think→thought`）。**L197 把「这批词要一个个记」这条线打开，今天把其中「尾巴是 `-ought`／`-aught`」这一小撮挑出来单独收口**：`bought`（L11）、`thought`（L197）、`caught`（今天）——**三个词，一条尾巴**。 |
| 3 | `I got up early in order to catch the bus.` | **L173**（为了 · in order to） | **这一条是本课最关键的对照，必须做。**两句都对，而且是同一件事的两个说法——L173 那句说「**为了**赶上那班车，我起得很早」（`in order to` 后面的 `catch` 是**原样**，因为那是「还没做、要去做」的事）；今天这句说「我起得很早，**赶上了**那班车」（`caught` 是**已经发生的**）。**同一个 `catch`，前面有 `to` 就不换，说的是昨天那一次就换。** L173 和 L201 说的是同一班车——这个对照的力度全批最强。 |

**L201 的语法Label 建议**：`尾巴换成一整串 · caught 和老朋友排一行`——明确它是「收口」而不是「新学一个词」。

---

### 3.5 场景选择：为什么是 ocean / train / snow / city

**硬约束**：`mansion` 已被 **L195（`The cat is in its box.`）、L196（`The cat is among the boxes.`）连用两次**，本批 4 课**都不能再用**（否则连续 6 课同一场景）。

实测末次使用课号（全库）：

```
island  6 课  末次 L194        train   5 课  末次 L181        snow    2 课  末次 L180
city   39 课  末次 L192        mansion 64 课  末次 L196        ocean   2 课  末次 L190
campus 58 课  末次 L197        forest   3 课  末次 L187        space   0 课  从未使用
```

| 课 | 场景 | 为什么选它 |
|---|---|---|
| **L198** | `ocean` | **直接接住 L190**。L190 的目标句就是 `I am learning to swim.`（正在学游泳），场景也是 `ocean`——**同一个地方、同一个动作，从「正在学」走到「昨天游过了」**，这是全批最自然的一处连续剧接口。`ocean` 全库只用过 2 次（L159、L190），不拥挤。**没有选 `island`**：L194 刚用过（4 课之前）。 |
| **L199** | `train` | 「**挨着坐**」这件事在列车上最自然（火车座位是并排的，`next to` 有了物理依据）；「把书递给旁边的人」也顺（车上打发时间看书）。`train` 末次使用是 **L181，16 课之前**，是全库最「久未使用」的可用场景之一（只 5 课用过）。**没有选 `mansion`**（红光）、**没有选 `city`**（留给 L201）。 |
| **L200** | `snow` | 「**觉得冷 + 一直在看**」需要「冷」有来源——雪地里读书正好。`snow` 末次使用 **L180，20 课之前**，全库仅 2 课用过（L19、L180），是**最不拥挤的场景**。而且「冷」这个感受与 L131 的「摸着凉」形成**同一族感受词的自然延伸**。 |
| **L201** | `city` | 「**赶公交**」只能发生在城里。全库的「为了赶上那班车」（L173）本身就是 `city` 场景——**L201 用同一个场景，让「同一班车」这个对照从文字层面进一步落到画面上**。`city` 虽然用过 39 课（末次 L192，6 课之前），但**它是「赶车」这个动作的唯一天然场景**，属于「必须有」而非「随便挑」。 |

**顺带登记（不在本批做）**：`space` 是 14 个合法场景里**唯一从未被任何一课使用过的**（`AdventureScene.tsx` 里 `SpaceScene` 组件已完整实现、标签「星际太空」也在，全库 0 课使用）。这是场景资源池里一个明确的闲置项，覆盖面比本批这 4 课大得多——**建议单独立项**，不要塞进本批（本批 4 课的句子全是日常动作，落不进太空场景）。

---

## ④ 外部依据与逐字引用

### 4.1 结论：英文教学体系**两种做法并存，且「按变化方式分组」是被权威教材明确推荐的学习策略**

我抓到的源给出的图景很一致：

1. **权威词典/语法库的「组织方式」是按字母表列表，不做教学分组。** Cambridge 与 British Council 的参考页都是三列表格（base form / past tense / -ed），字母序排列，**没有任何按变化模式的教学分组**。
2. **但 British Council 在同一个页面上明确推荐学习者「按过去式的样子分组学」**——这是本批外部依据里分量最重的一句。
3. **Cambridge 与 British Council 都把「不规则过去式」定在 beginner 级**（CEFR A1 附近），与本项目的定位一致。
4. **频率被权威源用来解释「为什么必须学」**：British Council 原话「**But many of the most frequent verbs are irregular**」。

### 4.2 逐字引用（≥3 处，附可访问 URL）

**引用 1 · British Council —「按过去式的样子分组学」**

- URL：`https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/irregular-verbs`
- 等级标记（页面原文）：`Level: beginner`
- 逐字引用（**本批最核心的一句**）：

> "Sometimes people study these verbs in groups based on the past simple form -- for example, 'buy', 'bring' and 'think' all have '-ought' in their past simple form: 'bought', 'brought' and 'thought'."

> "But many of the most frequent verbs are irregular:"

> "The past forms for irregular verbs are not regular -- you just have to learn them."

**这三句合起来正好支持本报告的两条设计判断**：
- 第 3 句（「只能一个个记」）= **L197 已经做过的事**（`thought`/`knew`，`deepDive` 标题就是「为什么这批动词不听话」）。
- 第 1 句（**「按过去式的样子分组学」**）= **本批 4 课要做的下一步**。而且 British Council 举的例子 `bought`/`brought`/`thought` **正好是 L201 要收的那一串 `-ought`**——**我的 L201 设计与 British Council 的举例完全撞上**，这是很强的外部支持。
- 第 2 句（「最高频的动词很多都是不规则的」）= 本批选题的正当性依据（7 个词全是 Oxford 3000）。

**引用 2 · Cambridge Dictionary Grammar — 不规则动词「each one has to be learnt」，且举例里就有 `sing`→`sang`**

- URL：`https://dictionary.cambridge.org/grammar/british-grammar/past-simple-i-worked`
- 逐字引用：

> "Many verbs are irregular. Here are some common ones. Each one has to be learnt."

> "The verb form is the same for all persons (I, you, she, he, it, we, they), and we make questions and negatives with irregular verbs in the same ways as for regular verbs."

- 该页给出的 `sing` 例句（原文）：

> "Her sister sang a beautiful song at the party."

**这两句支持什么**：
- 第 1 句「**Each one has to be learnt**」是 L197 的立课依据；本批在它之上加「**能分组的先分组**」（引用 1）。
- 第 2 句「**说「不」和问句里用法和规则动词一样**」**正是 L197 已经落地的讲法**（`variants` 里写了 `I didn't think about it.` / `Did you think about it?` + 「穿回原样」）。**本批 4 课沿用同一讲法即可**（每课 `variants` 各带一条否定、一条疑问），有 Cambridge 原话背书。
- 页面里的 `sing`→`sang` 例子**正是 L198 要教的词**，可作为该课的英文语境参考。

**引用 3 · Oxford Learner's Dictionaries — 7 个词全部是 Oxford 3000，等级 A1/A2**

- URL（逐个）：`https://www.oxfordlearnersdictionaries.com/definition/english/swim_1`、`.../sing`、`.../keep_1`、`.../feel_1`、`.../give_1`、`.../catch_1`、`.../sit_1`
- 逐字引用（页面上的等级/主题标签与释义）：

| 词 | 页面标签（逐字） | 页面上的过去式例句（逐字） |
|---|---|---|
| `swim` | `Topics Sports: water sports a1` / `Topics Fish and shellfish a1` | "The boys swam across the lake." |
| `sing` | `ox3000` / `Topics Music a1` | "We all sang 'Happy Birthday' to her." |
| `keep` | `ox3000`（A1） | "He kept all her letters." / "He kept his coat on." |
| `feel` | `Oxford 3000` / `Topics Feelings a1` | "She felt a sharp pain in her hand." |
| `give` | `Oxford 3000`（a1, a2） | "She gave her ticket to the woman at the check-in desk." |
| `catch` | `Oxford 3000`（a2） | "I threw the bag in the air and she caught it." |
| `sit` | `ox3000` | "the man who had sat next to me on the plane" |

**注意 `keep` 的那条例句**：`"He kept his coat on."` ——**「昨天觉得冷、把外套一直穿着」正好是本项目 L200 的场景**（雪地、冷、一直看）。这条英文例句可作为 L200 措辞的语感参考。

**引用 4 · Cambridge Dictionary Grammar · Table of irregular verbs — 7 个词的三个形态一次核对**

- URL：`https://dictionary.cambridge.org/grammar/british-grammar/table-of-irregular-verbs`
- 逐字引用（表格行，base form / past simple / -ed）：

```
swim  / swam  / swum
sing  / sang  / sung
keep  / kept  / kept
feel  / felt  / felt
give  / gave  / given
catch / caught / caught
sit   / sat   / sat
think / thought / thought
know  / knew  / known
```

**这几行的用处**：确认本批 7 个词的昨天版拼写（`swam`/`sang`/`kept`/`felt`/`gave`/`caught`/`sat`）与 Cambridge 权威表**逐字一致**；同时确认 L197 的 `thought`/`knew` 也在表内。

### 4.3 British Council 的访问方式（与上批记录不同，需更新）

上批（第 42 批）报告记录「British Council LearnEnglish 对本环境整体封锁（站点根即 403，非个别页面问题）」并**声明不含 British Council 引用**。**本批实测该结论不适用于 `WebFetch`**：

- `curl -sL` 带浏览器 UA 访问 `learnenglish.britishcouncil.org` → 仍然失败（与上批一致）
- **但 `WebFetch` 工具访问 `https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/irregular-verbs` → 成功**，并返回了 `Level: beginner` 标记与上引 3 句原文
- 同样经 `WebFetch` 成功读到 `https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/verbs`（该页无相关内容）
- **`https://learnenglish.britishcouncil.org/grammar/english-grammar-reference`（目录页）经 WebFetch 也可读**——与任务简报里「British Council 域名 curl 常 HTTP=000 但目录页经 WebFetch 可读」的已知情况一致，**但本批进一步确认：具体内容页（不止目录页）也可读**

**建议更新上批的「抓不到」记录**：British Council 的「不可得」应改为「**curl 不可得，WebFetch 可得**」。这影响的不只是本批——**上批因 declare 不可得而改用 Cambridge 替代的 Adverbs/‑ly 那两处，可以回头用 British Council 原文补强**。

### 4.4 明确抓不到的源（声明 + 尝试记录）

| 源 | 结果 | 尝试了什么 |
|---|---|---|
| **Murphy《English Grammar in Use》双册** | **抓不到** | 与上批一致，按任务简报「本批不必重试」执行——**未重试**。上批已建议正式记为「不可得」。 |
| **Swan《Practical English Usage》（PEU）** | **抓不到** | 同上，未重试。 |
| **百度百科** `https://baike.baidu.com/item/不规则动词` | **HTTP 403** | curl 带完整 Chrome UA 访问 → 403（返回「百度安全验证」页，与上批同型）。 |
| **中文侧教学文章（知乎/百度系）** | **抓不到** | 上批已实测知乎 `403`、经 `cn.bing.com` 检索结果被污染。本批**未重复尝试**（沿用上批结论）。 |
| **爱词霸 `https://www.iciba.com/word?w=swam`** | **HTTP 200，可读** | curl 带 Chrome UA。抓到词头 `swam`、释义 `v.游泳( swim的过去式 )`、发音 `英 [swæm] 美 [swæm]`；真题例句区标注 `六级` 档——例句原文 `Notions of modesty restricted women in the victorian era, but they still swam.`（标注来源「2018年12月六级真题（第一套）听力 Section B」）。**仅作「中文侧考试档位」旁证，不采信其权威性**（无出处标注体系）。 |
| **有道 `https://dict.youdao.com/w/swam/`** | **HTTP 200** | 可访问，但无出处标注，**未采信**。 |

**中文侧结论**：**未找到可引用逐字原文的中文权威教学文章**（百度百科 403、知乎 403、搜索引擎结果被污染——与上批一致）。本报告的「中文侧怎么教」判断**仅基于爱词霸的考试档位标签**，且**该标签不构成教学法依据**。

---

## ⑤ 自我核查记录

### 核查原则（按本批要求）

1. **不用 `grep`**：本地 `grep` 是 ugrep，会假返回 0。全部用 `node` 脚本。
2. **必须全库检索字符串再定位**：不只看「被指认的那一课」，而是扫**全部 197 课的每一个字符串字段** + 全部 206 案 + 扩到整个 `src/`。
3. **词边界正则**：一律用 `(?<![A-Za-z-])word(?![A-Za-z-])`，排除连字符标识符（如 `hunt-among-boxes`）与更长词的假命中。
4. **读真实数据对象**：用 `vite-node` **直接 import TS 模块**，对**解析后的对象**逐字段判定，而不是对源码文本行做正则（避免把注释、字段名、`cover` 变量名当成教学内容）。

### 环境与命令

```
$ node --version
v24.14.0

$ ./node_modules/.bin/vite-node deliverables/product-strategy/.irregular-past-2-check.mts
（核查脚本随本报告一并提交在同目录，可复跑）
```

> 核查脚本：`deliverables/product-strategy/.irregular-past-2-check.mts`（只读，不改任何数据）。
> 为什么用 `vite-node` 而不是上批的 esbuild 打桩：`grammarLessons.ts` 顶部有 **117 行 `import coverN from "../assets/lessons/lesson-N.jpg"`**，上批须先打桩才能执行；`vite-node` **原生处理这些资源导入**，可直接 import，**少一层打桩就少一处失真风险**。

### 核查 0 · 数据基线

```
grammarLessons: 197 课（末课 lesson-197-irregular-past）
huntCases:      206 案（末案 #206）
零术语词表:     29 个 —— 主语 谓语 宾语 表语 定语 状语 单数 复数 三单 原形 时态
                一般过去时 一般现在时 现在进行时 过去进行时 现在完成时 情态动词
                比较级 最高级 从句 语序 可数 疑问句 否定句 被动语态 第三人称 形容词 副词 介词
```

**注意**：简报说零术语红线是 **29 个**术语，与代码里的 `GRAMMAR_ZERO_TERMS` **逐字一致**（含 `原形`）。简报正文列举时写了「主语/谓语/宾语/表语/定语/状语/单数/复数/三单/原形/时态/从句/语序/可数/疑问句/否定句/被动语态/第三人称/形容词/副词/介词/比较级/最高级 等」——**这 23 个是子集，代码里实际是 29 个**（多出：一般过去时、一般现在时、现在进行时、过去进行时、现在完成时、情态动词 6 个）。**本报告按代码的 29 个执行**。

### 核查 1 · 7 个目标过去式：全库出现情况

```
词         总字段  句子槽  展示槽  错侧   huntCases
swam         0       0       0     0   —
sang         0       0       0     0   —
kept         1       0       1     0   —
felt         1       0       1     0   —
gave         1       0       1     0   3
caught       0       0       0     0   —
sat          0       0       0     0   —

⚠️ kept / felt / gave 各 1 处的唯一来源（用户不会被教到这句）：
   kept  L197 deepDive.paragraphs[3]  ::  这一批只能一个个记…记得一个就常在句子里碰到：
                                          went、ate、saw、bought、thought、knew、gave、told、felt、kept…
   felt  同上（同一字段）
   gave  同上（同一字段）

gave 在 huntCases 里的身份（是「正确 token」，不是被纠错的词）：
   #9 hunt-uncountable token[2]
   #20 hunt-term-review token[10]
   #27 hunt-snow-day token[25]
```

**结论**：7 个词的**「句子槽」全部为 0**——即**从未有任何一课把它们作为一句话呈现给用户**。`kept`/`felt`/`gave` 那 1 处是 L197 的**点名清单**（同一段里的三个词并列），`gave` 另有 3 处在找错案件里作**正确 token**（不是被纠错的目标）。**简报的结论方向正确，但「0」应改记为「1 处点名、0 处句子」。**

### 核查 2 · 7 个原词：全库出现情况

```
词         总字段  句子槽  展示槽  错侧   huntCases
swim       102      44      78     8   11
sing       103      49      79     9   14
keep        94      38      81     4    7
feel        61      27      43     8    9
give        67      23      56     2    7
catch       46      23      39     3    2
sit         47      27      36     4    5
```

**7 个原词「全部字段」合计 520 次**（102+103+94+61+67+46+47），**对应 7 个过去式的「句子槽」合计 0 次**。这个 520:0 的落差就是本批选题的量化依据。

### 核查 3 · L197 的 deepDive 承诺了哪些词，实际又给了哪些

L197 的 `deepDive.paragraphs[3]` 原文写：「记住一个就常在句子里碰到：**went、ate、saw、bought、thought、knew、gave、told、felt、kept**…」

逐词核对「是否作为句子出现过」：

```
  went     句子槽= 51  全库= 155
  ate      句子槽= 39  全库=  83
  saw      句子槽=  8  全库=  30
  bought   句子槽= 24  全库=  45
  thought  句子槽= 21  全库=  48
  knew     句子槽= 18  全库=  42
  gave     句子槽=  0  全库=   1   ⚠️ 只出现在 L197 deepDive 的「点名清单」里
  told     句子槽=  0  全库=   1   ⚠️ 同上
  felt     句子槽=  0  全库=   1   ⚠️ 同上
  kept     句子槽=  0  全库=   1   ⚠️ 同上
```

**⚠️ 这是一个独立性发现（不是本批任务，但应登记）**：**L197 的 deepDive 用「常在句子里碰到」引出了 10 个词，其中 4 个（`gave`／`told`／`felt`／`kept`）在全库里除了这句点名之外从未出现过**——包括 L197 自己也没有。用户读完这句话去库里找，**找不到这 4 个词中的任何一个，还有一个 `told` 连本批都没安排**。

- 本批 4 课将**兑现其中 3 个**（`gave`→L199、`felt`／`kept`→L200）。
- **`told`（tell 的昨天版）仍然无处可去**——`tell` 在原词侧的教过次数也很低（`told` 全库 1 处）。**建议登记为下批候选**，或在 L197 的 deepDive 里把这句改成只点已经存在的词（**最小成本修法**）。

### 核查 4 · 三条「变化方式」本身有没有被教过（决定能不能按规律分组）

```
「i 换成 a」这类讲法              命中   0 字段  课=[—]
「-ought／-aught」这类讲法        命中  89 字段  课=[11,68,197]   ← 但全是 thought/bought 本身，无一处讲「这一串」这个规律
「两个 ee 变短／尾巴换 t」这类讲法      命中  35 字段  课=[6,13,17,…]  ← 全是无关命中（「双写 g」「换成 sleeping」等），无一处讲 ee→e+t
```

**结论**：三条换法**全库从未被显式讲过**。这意味着：
- **本批 4 课是「首次把这三条换法说穿」**，不是复习——课的设计要按「新规则」的强度来做（`oneLineRule` 要完整，`deepDive` 要讲清道理）。
- **「-ought／-aught」的 89 处命中全部来自 `thought`/`bought` 这两个词本身**（L11 的 `bought`、L68 的 `bought`、L197 的 `thought`），**没有一处把「这一串」当成规律讲出来**——所以 L201 的「收口」定位是准确的：词都见过了，**规律第一次说**。
- **「ee 变短」的 35 处全是无关命中**（`bigger` 的双写、`sleep→sleeping` 等），已逐条排除。

### 核查 5 · 四个 targetSentence 的全部守门

```
L197 基线 longestClause = 8 → L198 上限 = 13（相邻课跳 ≤5）

  ✅ L198 [swam + sang] scene=ocean
       "We swam in the water and sang together."  （8 词，跳 0）
       未教过的词：swam、sang   ← 恰好是本课两个新点
  ✅ L199 [sat + gave]  scene=train
       "I sat next to her and gave her the book."  （10 词，跳 +2）
       未教过的词：sat、gave    ← 恰好是本课两个新点
  ✅ L200 [kept + felt] scene=snow
       "I felt cold in the snow, but I kept reading."  （10 词，跳 0）
       未教过的词：felt、kept   ← 恰好是本课两个新点
  ✅ L201 [caught]      scene=city
       "I got up early and caught the bus."  （8 词，跳 -2）
       未教过的词：caught       ← 恰好是本课一个点
```

**守门口径说明**：
- **难度守门**用的是 `grammarLessons.test.ts` 里 `longestClause` 的**原样实现**（只按 `[.!?]\s*` 切分，**不按 and/but 切**）。四课的最长分句分别是 8/10/10/8 词，全部 ≤13，**逐课跳升 0/+2/0/-2**，全部 ≤5。
- **D 层词汇守门**（练习答案每个词都要在此前累计教过）用**与守门同口径**的累计词表（`cumulativeUpTo(197)`，共 **787 词**）。四个目标句的「未教过的词」**恰好等于该课的新点本身**（新点在本课内被教，所以 D 层通过）。
- ⚠️ **L199 的 10 词是四课里最长的**：如果写课时实测超限，**降级方案**是改成 `I sat next to her and gave her a book.`（同样 10 词）或 `I sat next to her and gave her the letter.`（10 词）——**注意不能删 `her`**（`gave` 的「先给谁、后给什么」是 L63 立的规矩，删了对照就断了）。

### 核查 6 · 四个场景的选择依据（末次使用课号）

```
island      共   6 课   末次 L194      train       共   5 课   末次 L181
snow        共   2 课   末次 L180      city        共  39 课   末次 L192
mansion     共  64 课   末次 L196      space       共   0 课   末次 —（从未使用）
ocean       共   2 课   末次 L190      forest      共   3 课   末次 L187
campus      共  58 课   末次 L197      lighthouse  共   2 课   末次 L193
desert      共   1 课   末次 L186      magic       共   2 课   末次 L45
mystery     共   4 课   末次 L157      sparkle     共   9 课   末次 L137
```

**14 个合法场景 id 全部核对完毕，无非法场景**（`illegal scenes present: []`）。`mansion` 已 L195/L196 连用两次——**本批 4 课全部避开**。

### 核查 7 · 每课的容量基线（证明「一课 2 个点」是本项目的实际做法）

```
  L191 grammarLabel="进到里面 · 用 into——不只是一个 in"        blocks=2 examples=4 contrast=6 guided=6 practice=5
  L192 grammarLabel="穿过 · 中间穿过去用 through，横过…"      blocks=2 examples=4 contrast=6 guided=6 practice=5
  L197 grammarLabel="昨天的老朋友 · 有些词的昨天版要单独记"      blocks=2 examples=4 contrast=6 guided=6 practice=5
```

三课的字段规模**完全同型**（`blocks=2`、`examples=4`、`contrast=6`、`guided=6`、`practice=5`）。本批 4 课按同一型设计：`contrast=6`（3 条带标记错句 + 3 条双正解）。

### 核查 8 · 对照卡引用的每一句都真实存在（字符串精确匹配）

```
  ✅ "Yesterday I went to the park."            →  L10, L11, L21, L24, L53, L82, L93, L95, L99, L100, L101, L104, L191
  ✅ "I ate two sandwiches."                    →  L11, L12, L24, L148, L150, L151
  ✅ "I drank tea."                             →  L11
  ✅ "I met my friend."                         →  L11
  ✅ "I bought two notebooks."                  →  L11
  ✅ "I was reading when the phone rang."       →  L99, L102
  ✅ "I am learning to swim."                   →  L190
  ✅ "Please give me the book."                 →  L63, L68
  ✅ "He sits next to me."                      →  L79
  ✅ "I sit between Tom and Amy."               →  L81, L86, L196
  ✅ "The water feels cold."                    →  L131, L133
  ✅ "I keep reading at night."                 →  L77, L78
  ✅ "I feel much better today."                →  L76, L78, L131
  ✅ "I got up early in order to catch the bus."→  L173, L185, L186
  ✅ "I put my bag next to the door."           →  L82, L83, L86
  ✅ "I thought about it and knew the answer."  →  L197
  ✅ "My desk is next to the window."           →  L79, L80, L81, L82, L83, L86
  ✅ "The song was sung by her."                →  L52
  ✅ "He was so tired that he fell asleep."     →  L193
```

**19 句全部命中**，即本报告所有「双正解」与「错句成因」引用的对照句**都在库里真实存在**，没有一句是我想象的。

### 核查 9 · 计划文案的零术语与星号守门

```
  零术语违规 0 处／星号违规 0 处（中文文案 13 条 + 英文句 4 条）
```

**⚠️ 本批特别复核了 `原形`（我在批 42 踩过的红线词）**：

```
=== 项目自建词汇的用量 ===
  原样          484 处
  原形            0 处   ← 红线词，全库从未出现（我上批差点写进去）
  原来的样子         1 处（仅 L197）
  昨天版         187 处
  做过版         136 处
  穿回           13 处
  垫板          152 处
  名字版         214 处
  领一整句         38 处
  站句尾          55 处
  站最前面         62 处
```

**本报告一律使用「原样」（484 处的项目自建词）与「昨天版」（187 处），不使用「原形」。** 上批我用的「原来的样子」全库只有 1 处（L197），**属低频表达，本报告也不采用**——统一用「**原样**」。

### 核查 10 · huntCases 的零术语缺口（独立性发现，非本批任务）

```
  huntCases 用户可见字段零术语命中：313 处（193 个字段）／涉及 130 案
      复数 108   可数 101   三单 33   主语 32   单数 9   原形 8
      形容词 5   最高级 4   时态 2   第三人称 2   比较级 2   疑问句 2   否定句 2   语序 2   副词 1
  ↳ grammarLessons 有遍历式零术语守门，huntCases **没有**——这是同一条红线的缺口。
```

**为什么会漏**：`grammarLessons.test.ts` 里的「零术语红线 · 全字段兜底巡检」是**遍历 197 课的所有字符串字段**（只排除 `deepDive`），但**只遍历 `grammarLessons`，从不遍历 `huntCases`**。而 `huntCases.ts` 的 `errors[].explanation` 是**用户可见的**：

```
src/pages/GrammarHuntPage.tsx:675   <p className="hunt-verdict-explanation">{feedback.error.explanation}</p>
src/pages/GrammarHuntPage.tsx:776   <p style={{...}}>{error.explanation}</p>
src/pages/GrammarReauditPage.tsx:298 …：{error.explanation}
```

**其中 `原形` 8 处**（正是我在批 42 踩的那个红线词）：

```
#23  hunt-travel-plan      errors[1]  wants to 后面跟动词原形：wants to swim，-ing 外套要脱掉。
#24  hunt-desk-rules       errors[0]  must 后面的动词穿原形：must go。going 的 -ing 外套 must 不认。
#34  hunt-third-person-daily errors[5] Does 一出场，动词打回原形 like——小尾巴由帮手扛。
#36  hunt-question-words   errors[1]  问过去的动作要请帮手 did：When did you lose it？动词打回原形。
#38  hunt-going-to-plan    errors[3]  will 后面的动词穿原样：will rain——be going to 也一样后面是原形。
#41  hunt-imperative-signs errors[2]  Don't + 动词原形：Don't eat。
#102 hunt-old-playground   errors[1]  used to 后面跟原形：play——不穿 -ing 外套（跟 want to travel 一个规矩）。
#109 hunt-old-habit        errors[1]  used to 后面跟原形：play——它不认 -ing 外套。
```

**这一条的意义超出了本批**：本批要写的 4 课都涉及「原样 vs 昨天版」的对照，**写课时如果照抄找错案件里的讲法，就会把 `原形` 抄进课程**（从而被课程的守门拦住）。**建议**：(a) 给 `huntCases` 补一条同型遍历式零术语守门（**但注意 313 处是存量，一次修不完**，应先加守门 + 登记存量，分批修）；(b) 本批 4 课的文案一律用「**原样**」。

---

## ⑥ 不确定项

### 1. ⚠️ 最大不确定：简报给的原词计数我复现不出来（影响的是「值不值得做」的量化依据，不影响结论）

**不确定的是什么**：简报的 `swim`=36 / `sing`=41 / `keep`=33 / `feel`=24 / `give`=22 / `catch`=20 / `sit`=23 **在本机 6 种口径下全部不复现**（我的实测区间是 5–103，见 §2.0 与核查 9）。我**无法确定**简报是用哪种口径算出来的，也**无法排除**它来自某个旧版本的基线。

**我做了什么**：穷举了 6 种字段口径（全部字段／非错侧／句子槽／展示槽／仅 `examples[].en`／仅 `en` 结尾），并额外试了词族口径（把 `swims`/`swimming`/`swam` 合并）与原始源码文本口径（`\b` 与词边界两种）——**没有一种对上**。相对位次（`sing` > `swim` > `keep` > …）对得上，绝对数字对不上。

**为什么结论不受影响**：本批选题的依据是「**过去式在句子槽 = 0**」这个**方向性的硬事实**（我实测确认，7 个词全部为 0），而不是原词的具体次数。原词次数只是用来说明「这些词早就教过很多次」——而这个结论在**任何**口径下都成立（最小口径的「仅 `examples[].en`」也有 2–6 次，最大口径 47–103 次）。

**建议**：下批若要继续用这类计数做排期依据，**先固定口径并写进脚本**（本报告的 `.irregular-past-2-check.mts` 已把 6 种口径都算出来，可直接复用）。

### 2. `rang` 已经把 i→a 用掉了——L198 的讲法需要拿捏

**不确定的是**：`rang`（ring→rang，L99 教过）与 `drank`（drink→drank，L11/L180）都属 i→a，**已经以句子形式在库里出现过**。L198 讲「i 换成 a」时，**说「第一次见这条换法」是错的**（学习者早就见过 `rang`），说「复习」也不对（从来没讲过规律）。

**我给的方案**：L198 定位为「**把这条换法说穿**」——`oneLineRule` 写成「你之前见过它（`rang`），今天把它挑明」。**但这个拿捏是否恰当，需要写课人实操判断**：如果用户读到「你之前见过」却想不起 `rang`（L99 距今 99 课），这句话可能反而造成困惑。**降级方案**：不在 `oneLineRule` 里提 `rang`，只在 `deepDive` 里提（折叠卡是「想知道为什么」的进阶内容，不提也不影响主线）。

### 3. L199 的 10 词是全批最长，且「i→a」在 `gave` 上不完整

**不确定的是**：`give`→`gave` 严格说**不是纯粹的 i→a**（i→a 的同时，尾巴的 `v` 写作 `v` 但读音变了，且和 `sit`→`sat` 的「其余字母一个都不动」不完全同型）。我在 L199 的讲法里写的是「`sit` 是干净的 i→a，`give` 是 i→a 顺手把尾巴换掉」——**这个措辞是否会让零基础用户困惑，我没有用户数据可验证**。

**另一个选择**是 L199 只放 `sat` 一个点、`gave` 另开一课（→ 5 课方案）。**我不建议**：`gave` 单独成课只有 1 个点，撑不起一课；而 `give` 在库里教过 67 次（全部字段），是高频到不能再高频的词，**单独为它开一课的收益不如搭在 L199**。但这确实是个可争议的判断。

### 4. L200 的 `fell`/`felt` 撞车：我核到了描述，没核到用户的真实混淆率

**不确定的是**：我在错句 3 用了 `fell`（L193 教过）作为 `felt` 的干扰源，理由是「两个词只差中间一个字母、读音接近」。**「中文母语者确实会混淆这两个词」这个判断，我没有数据支撑**——我是从拼写相似度推的，不是从用户错误样本推的。

**能确认的**：`fell` 在库里作为句子出现（L193 `He was so tired that he fell asleep.`），`felt` 在库里**从未作为句子出现**（只有 L197 的点名）——所以「用户只见过 `fell`、没见过 `felt`」这个**前提是硬的**，混淆的可能性有依据。**建议写课时把这条对照卡的实际效果记下来**（如果用户在练习里真的写出 `fell`，就证明这条卡有价值）。

### 5. `space` 场景闲置：覆盖面可能大于本批

**不确定的是**：`space` 是 14 个合法场景里**唯一 0 课使用**的（组件完整、标签在，就是没课用）。**我判断本批 4 课塞不进去**（句子全是日常动作：游泳、坐着递书、雪地读书、赶公交，落不进太空）。但**「是否该为 space 单独立项、以及它适合承载什么语法点」我没有深入研究**——这可能需要一次独立的「场景资源池盘点」（14 个场景 × 197 课的使用分布 + 各场景适合什么题材），**超出本批范围**。

**能确认的**：场景池的分布**高度不均**——`mansion` 64 课、`campus` 58 课、`city` 39 课，而 `desert` 1 课、`snow`/`ocean`/`lighthouse`/`magic` 各 2 课、`space` 0 课。**前三个场景占了全库 161/197 = 82%**，后 11 个场景分剩下的 18%。**这个不均本身值得一次盘点**（用户在连续剧里会不会觉得「老在小美家、学校、街上打转」）。

### 6. huntCases 的零术语存量 313 处：修法与优先级我没定

**不确定的是**：313 处（130 案）是小批量可修还是需要重写。我**只统计了数量与分布，没有评估修起来的成本**——比如 `复数` 108 处、`可数` 101 处这两类占了 2/3，它们是不是可以像 `grammarLessons` 那样批量替换成大白话（`好几个` / `好几个东西`），**我没有逐条试过**。

**建议**：(a) 先加守门（把 `huntCases` 纳入遍历式零术语巡检的字段范围）；(b) **但不要立刻加「必须为 0」的断言**——存量 313 处会让测试直接红，应加「**不得新增**」型断言（记录当前基线 313，回落才通过）；(c) 修法与排期**单独评估**。

### 7. 我唯一没能验证的「外部依据缺口」

**不确定的是**：Murphy 双册与 Swan PEU 按简报「本批不必重试」未重试，**因此本报告没有来自这两本经典教学语法书的直接引用**——而这两本恰恰是「不规则动词怎么教」最可能有明确说法的源。我用了 British Council（明确推荐按过去式分组学）+ Cambridge（`Each one has to be learnt`）+ Oxford（7 词全在 Oxford 3000）三方支撑，**结论一致且互相印证，但确实缺了「教学法层面最权威的两本」**。

**能确认的**：这不是本批的疏漏——上批已实测不可得并建议正式记为「不可得」，本批按简报指示未重试。

---

## 附：本批交付物清单

| 文件 | 说明 |
|---|---|
| `deliverables/product-strategy/user-research-irregular-past-2-2026-09-22.md` | **本报告** |
| `deliverables/product-strategy/.irregular-past-2-check.mts` | 核查脚本（只读，可复跑：`./node_modules/.bin/vite-node <此文件>`） |

**本报告不改任何代码与数据**（纯研究）。
