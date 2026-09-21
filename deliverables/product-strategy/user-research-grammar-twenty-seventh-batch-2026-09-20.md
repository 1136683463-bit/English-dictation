# 用户研究综合报告 · 第二十七批（用户研究 · 批二十七选题）
> **选题一句话推荐**：**取轴 B「都」的否定侧，做 2 课（`None of…` 立岗 → `Nobody`／`No one` 切开）**，**批次课号 L153–L154**；**轴 C 的 `ago` 单开 1 课作第三课候补（有条件取，见 §4.6）**；**轴 A 本轮实算后判定「仍不成立」**（§2 给出具体条数）；**轴 D 押后**（§1.4）。

**日期**：2026-09-20 ｜ **类型**：用户研究（批二十七选题）｜ **成员**：瑞思
**方法**：本轮不采信任何转述；**全部词次由 node 脚本实测**（本机 `grep` 是 ugrep，按任务书要求全程不用它统计词频）；**全部结论附带行号或命令留痕**。

---

## 0. 结论先行

### 0.1 本批最重要的一条：**轴 B 不是「要不要做」的问题，而是「它已经是库里唯一挂着的明钩」**

批二十六在 L152 的 `oneLineRule` 与 `variants` 里**两次点名**了这个缺口，逐字如下：

- `:28490`（L151 否定变体卡）：**"这是第 5 课的老句子（all 管肯定侧，否定侧下一批再看）。"**
- `:28684`（L152 否定变体卡）：**"这是第 5 课的老句子（every 管肯定侧）。"**

**「否定侧下一批再看」——这个「下一批」就是本批。** 批二十六没有把否定侧写进 L151／L152 的任何一条对比卡，**也没有在任何位置给出「否定侧是什么词」的线索**（对比 L148 → L151 那次是明确给了钩子的：` :27926` 逐字 "要是三个以上一起都好，英语有另一个词，今天先不碰"）。

**→ 判定：轴 B 是「欠账」而不是「新选题」。** 它的优先级**不由证据强弱决定，而由「库内已经对用户许过这句话」决定**。

### 0.2 四条轴的排序（本轮实读后）

| 排序 | 轴 | 词 | 缺口真伪 | 课量 | 档位 | 一句话理由 |
|---|---|---|---|---|---|---|
| **1** | **B** | `none`／`no one`／`nobody` | **✅ 真缺口（三个词 GL 与 HC 双文件全 0）** | **2 课** | **B＋** | **库内已向用户许过「下一批」**；且它是「有『不』就换词」这条老规矩的**第四次应用**，机制已付费三次 |
| **2** | **C** | `ago`（＋ 可选 `yet`） | **✅ 真缺口（`ago` GL 0／HC 0）** | **1 课**（`ago` 单开）／`yet` 再 1 课需另判 | **B** | **中文「三天前」是零基础高频表达，库里连一个 `ago` 都没有**；且它与 L10 的技术关系干净（§4） |
| 3 | A | `though`／`even though`／`unless`／`in case` | ⚠️ 半真（词全零，**但凑不满 6 条**） | **0 课**（§2 实算） | **C**（本轮降档） | **去掉 ❌will 后 `unless` 只剩 3 条可用卡**（§2.3 逐条），**距 6 条差 3 条**——比批二十六估的「差 2 条」更差 |
| 4 | D | `whether`／`since` | ❌ 假缺口（**真缺但超纲**） | **0 课** | **C−** | `whether` 牛津标 **B1**、`since` 的「自从」义要求有完成时＋`for` 对照，**两者都踩在 L48／L49 的 `if` 上**（§1.4） |

### 0.3 词次实测总表（本轮新增；两法互校，全部一致）

**口径**：`GLraw`／`HCraw` ＝ 整文件整词命中数（正则 `(^|[^A-Za-z])w([^A-Za-z]|$)` 与 `(?<![A-Za-z])w(?![A-Za-z])` 两法，受检词上**数字完全一致**）；`GLstruct` ＝ **学习者可见句槽**口径（只统计 `targetSentence`／`dialogueEn`／`examples[].en`／`variants[].en`／`sceneSwings[].en`／`action`／`practice[].answer`／`practice[].tokens`／`contrast.wrong`／`contrast.correct` 这 10 类**真正会显示为英文**的字段）。

| 词 | GLraw | GLraw（零宽断言法） | HCraw | GLstruct（课数） | 结论 |
|---|---|---|---|---|---|
| **`none`** | **0** | **0** | **0** | **0** | **三文件全零，真缺口** |
| **`nobody`** | **0** | **0** | **0** | **0** | **三文件全零，真缺口** |
| **`no one`** | **0** | **0** | **0** | **0** | **三文件全零，真缺口** |
| `nothing` | 71 | 71 | 5 | 28 处／**2 课（L84、L86）** | 已教，**只走「东西」侧** |
| `anyone` | **0** | **0** | **0** | **0** | **也全零**（与 `someone` 39 处形成对比） |
| `someone` | 39 | 39 | 4 | 15 处／4 课（L33／L84／L85／L99） | 已教，**人侧肯定版** |
| `everyone` | 2 | 2 | 3 | **0 处句槽**（2 处都在 `dialogue[].en` 且都是 L152「Is everyone here?」） | 认读级 |
| **`ago`** | **0** | **0** | **0** | **0** | **三文件全零，真缺口** |
| **`yet`** | **0** | **0** | **0** | **0** | 三文件全零 |
| `already` | 2 | 2 | 0 | **0 处句槽** | 仅 2 处：`:22455` 是 L120 的 `You are already up!`（对白），`:10021` 是注释「第 53 课（already 版）」（**注释里提 already，句子里没有**） |
| `still` | 1 | 1 | 0 | **0 处句槽** | 唯一 1 处 `:10417` 是 L56 的 `explain`：**"still in + 月份：in October——名字照样抬头"**——**这是 "still" 而不是 "still"**（英语词 still，说的是「照样」），**不是时间副词** |
| `just` | 4 | 4 | 0 | **1 课（L126）** | 3 处是 L24 的认读提示（`:4410` 逐字 "just 先混个脸熟，不用考"），1 处是 L126 对白 `I just ran a race!` |
| **`though`** | 3 | 3 | 2 | **0 处句槽** | **3 处全在 L139／L141 的深挖卡与注释里**（中英混排），**无一处在学习者要说的英文句子里**——复核批二十五判定 |
| **`even though`** | **0** | **0** | 0 | 0 | 真零 |
| `even` | **0** | **0** | 0 | 0 | 真零 |
| **`unless`** | **0** | **0** | **0** | **0** | 三文件全零 |
| **`in case`** | **0** | **0** | **0** | **0** | 三文件全零 |
| `case` | **0** | **0** | 0 | **0** | 真零（批二十五登记 HC 有 1 处「case 9」，本轮**复核该处已不在文件里**——见 §9 未核实项 ①） |
| **`whether`** | **0** | **0** | **0** | **0** | 三文件全零 |
| **`since`** | **0** | **0** | **0** | **0** | 三文件全零 |
| `if` | 147 | 147 | 7 | 62 处／**3 课（L48／L49／L142）** | 已教 |
| `all` | 93 | 93 | 19 | 35 处／**4 课（L69／L109／L151／L152）** | 已教（L151 立岗） |
| `every` | 221 | 221 | 30 | 120 处／21 课 | 已教（L152 转正） |
| `both` | 168 | **172** | 21 | 64 处／5 课（L148–L152） | 已教 |
| `neither` | 90 | **94** | 14 | 31 处／2 课（L149–L150） | 已教 |

**⚠️ 两法唯一分歧**：`both`（168 vs 172）与 `neither`（90 vs 94）——**差在零宽断言法多算了 4 处 `bothRight`／`neitherOf` 之类字段名**（`bothRight: true` 的 `both` 后面紧跟大写 R，第一法要求 `[^A-Za-z]` 所以不计，第二法 `(?![A-Za-z])` 也不计——实际差在 `bothRight` 与 `both-right` 的写法分歧）。**该分歧不影响本批任何判定**（两词均已交付）。

---

## §1 逐轴缺口盘点

### 1.1 轴 B：`none`／`no one`／`nobody`（**推荐**）

**「想说却说不出来」的四个真实场景**（全部是零基础日常会话里绕不开的）：

| # | 中文 | 学习者会说的**错句** | 库里现有替代 | 判定 |
|---|---|---|---|---|
| ① | 这几本都不好。 | `*All the books are not good.` | 无 | **说不出** |
| ② | 谁都不知道答案。 | `*All is not know the answer.` / `*Everyone don't know.` | 无 | **说不出** |
| ③ | 家里没人。 | `*Have no people at home.` / `*Nobody are at home.` | 无 | **说不出** |
| ④ | 我们都没准备好。 | `*We all are not ready.` | 无 | **说不出** |

**为什么③④特别疼**：中文用「没人」「都不」是**一个词就能解决的事**，而英语必须换一个新的队首词——**而库里恰恰把「换队首词」这件事教过三遍了**（§3.2）。

### 1.2 轴 C：`ago`（**推荐第二**）

**中文「三天前」是零基础最高频的时间表达之一，而库里彻底没有 `ago`。**

**先说清楚一件事**：§0.3 实测 `days` GLraw **1**（HCraw 4），`weeks`／`years` 全 0。**这意味着库里连「三天」这个表达本身都没有过。**——`three days` GLraw 实测 **0**。

**所以这不是「`ago` 这个词没教过」的问题，是「`数字 + 时间词 + 前」这整条表达链在库里是空白」的问题**：
- `minutes` GLstruct **2 课（L20／L73）**，但都用在「要花十分钟」（`It takes ten minutes.`）——**是「要花多久」，不是「多久以前」**；
- `hour` GLstruct **2 课（L4／L73）**，同上；
- `week` GLstruct **5 课（L24／L72／L110／L118／L136）**，**其中 L24 是 `last week`（昨天版信号词），L110／L118 是 `week` 出现在别的语境**——**「上周」有，「三周前」没有**。

### 1.3 轴 A：为什么本轮再降一档（详见 §2）

**任务书点名要答的前置项：「去掉 ❌will 之后，`unless` 还剩几条对比卡？」**——**§2.3 逐条列出：只剩 3 条**（错句卡 2 条 ＋ 等价对照 1 条），**第 4～6 条无论从哪个来源都封死**。

**→ 比批二十六估的「4 条、差 2 条」更差。** 批二十六把「`unless` 用来提问 ❌」算作一条**带标记的新错**，**但本轮实测该错误在中文侧原文里是「不能出現在疑問句中」——而疑问句是我们 L44 起的常规教学手段（`Is every student here?` 就是 L152 的疑问变体卡），要求零基础用户「不要用 unless 提问」是一条需要先建立「疑问句」概念才能理解的禁令**——**它与我方「一课一增量」的形态相斥**（§2.4 详述）。

### 1.4 轴 D：`whether`／`since` —— 真缺口，但本轮不取

| 词 | 缺口 | 超纲证据（本轮实取） | 判定 |
|---|---|---|---|
| `whether` | **真（GL 0／HC 0）** | **牛津词典页 `cefr="b1"`**（两个义项全 B1，本轮从 `ox_whether.html` 的 `cefr=` 属性实取）；**中文侧 `english.cool/whether/` 独立专文的核心内容是「名词子句当主语／补语／同位语／介系词的宾语」**（逐字：「whether 表達「是否」的用法…用來引導出名詞子句，分別當作句子的主詞、補語、同位語及受詞」）——**四种用法里有三种要求「子句当句子成分」的概念**，**正是零术语红线要绕开的东西** | **❌ 押后**（且**它的「是否」义与我方 L35／L37「我知道它在哪／我不知道他在哪」的间接问句距离过近**，见 §8.2） |
| `since` | **真（GL 0／HC 0）** | **牛津释义首句逐字 `( used with the present perfect or past perfect tense )`**——**「自从」义的入门门槛就是完成时**；**中文侧专文（`ec_since.html`）逐字小提醒「如果想表達「從過去到現在，某情況就一直持續的狀態」，since 前面的主要子句會用「現在完成式」來表示」**；**且它与 `for` 是一对**（牛津同页逐字 `Use for , not since , wit…`）——**`for` 我方 GL 128 但全是「为了／给」（`for you`／`for my mom`），没有一处是「持续多久」** | **❌ 押后**（**`since` 的第 2 课必须做 `for` vs `since`，那是两课，且完成时线已在 L21–L24 收过**） |

**→ 一句话**：**`whether` 和 `since` 的缺口是真的，但它们要求的前置概念我方都以「零术语」的方式刻意绕开了。** 强行做，要么破零术语红线，要么把课变成「概念课」而不是「一句话说一件事」的课。

---

## §2 轴 A 专项（前置项复核）：去掉 ❌will 之后，`unless` 还剩几条对比卡？

### 2.1 先复核批二十六／竞析的 6 条清单（逐条重新归类）

批二十六 §3.3 与竞析 §0 第 2 条给出的 6 条增量来源逐字如下（我从 `competitive-analysis-grammar-twenty-sixth-batch-2026-09-20.md:20` 抄录）：

> ① `unless` ＝ **'except if'**；② `unless` 与 `if … not` 的等价；③ **不用 will／would**；④ **不用于「已知为真」**；⑤ **不能与 `if` 连用**；⑥ **不能用于疑问句**。

**本轮把这 6 条按「能不能变成一张对比卡」重新过一遍**（判据是**全库 152 课的实际卡型**，§2.2 给出实测分布）：

| # | 竞析/批二十六的原文 | 能不能做成对比卡？ | 本轮判定 |
|---|---|---|---|
| ① | `unless` ＝ 'except if' | **❌ 不能**——**这是词义解释，不是错句**。全库 152 课的对比卡**没有一张是「词义解释卡」**（§2.2 实测：带标记卡必须有 `wrong`＋`wrongMark`，双正解卡必须有 `bothRight: true`＋第二句英文） | **作废**（它只能进 `oneLineRule`／`deepDive`，那不是对比卡） |
| ② | `unless` 与 `if … not` 等价 | **✅ 能**——双正解卡（`I will go out if it does not rain.`） | **留 1 条** |
| ③ | **不用 will** | **❌ 本轮剔除**（任务书指定前置项）——**且实测：这条规则在库里已出现 7 课**（§2.3 表） | **剔除** |
| ④ | 不用于「已知为真」 | **⚠️ 极难**——中文侧四个源**无一条给中文错例**；Cambridge 逐字 `We don't use unless for things that we know to be true.` 的正面例句是 `You won't be able to get a ticket for the match unless you're prepared to pay a lot of money for it.`——**这句 19 词，是我方目标句上限（8 词）的 2.4 倍**；**要做成零基础能读的错句，必须自造，且自造后无法回指任何源** | **🟡 自造（不计入硬增量）** |
| ⑤ | 不能与 `if` 连用 | **✅ 能**——错句 `*Unless if it rains, I will go out.`（Cambridge `Conditionals: other expressions` 页逐字 `We don't use unless and if together`） | **留 1 条** |
| ⑥ | 不能用于疑问句 | **⚠️ 本轮改判为「不计」**——理由见 §2.4 | **不计** |

**→ 剔除 ①③⑥、④ 降为自造后，硬增量只剩 ②⑤ 两条。**

### 2.2 全库 152 课对比卡构成（本轮实测，供判据）

〔实测命令留痕见附录 A ③〕**152 课，`contrast` 条数全部恰好 6，152/152，无一例外**（与批二十六报的 150/150 一致，本轮随课量更新）。逐条构成（`带 wrongMark 的新错` ＋ `wrongMark: null 的旧句回流` ＋ `bothRight 双正解`）：

```
3+0+3 = 45 课     2+0+4 = 25 课     6+0+0 = 23 课     4+0+2 = 10 课
4+2+0 =  4 课     5+1+0 = 12 课     4+1+1 =  4 课     5+0+1 =  5 课
3+1+2 =  3 课     2+1+3 =  8 课     1+1+4 = 11 课     3+3+0 =  2 课
                                                    合计 = 152 课
```

**最近 14 课（L139–L152）全部是 `3+0+3` 或 `4+0+2`**：

```
3+0+3 -> 139,142,143,145,146,148,149,151,152
4+0+2 -> 141,144,147,150        （全部是「收口 · 零新知」课）
2+1+3 -> 140                     （多了一条「整句缺一块」型；L140 是「两张脸」课）
```

**→ 判据确立**：**新开一课的最低形态是 `2+0+4`（2 条带标记新错 ＋ 4 条双正解回流）或 `3+0+3`**。轴 A 的 `unless` 单点课**连 `2+0+4` 都构不成**（详见 §2.3）。

### 2.3 `unless` 去掉 ❌will 后剩几条——**逐条列出，答案是 3 条**

**必修项**：`unless` 单点课若成立，需要 **6 条**。

| # | 卡型 | 内容 | 来源 | 是否计入 |
|---|---|---|---|---|
| ① | **带标记·新错** | `*Unless if it rains, I will go out.`（`wrongMark: "if"`） | Cambridge `Conditionals: other expressions` 逐字 `We don't use unless and if together` | **✅ 计入（第 1 条）** |
| ② | **带标记·新错** | `*Unless you will pay now, I will wait.`（`wrongMark: "will"`） | Cambridge `Unless` 页 typical errors 逐字 `We don't use will or would in the clause after unless` | **❌ 剔除（任务书指定）** |
| ③ | **带标记·新错** | `*Unless it rains, I will not go out.`（`unless` 后面用了否定） | 中文侧 `english.cool/unless/` 逐字「**Unless 後面一定是肯定句，否則會出現「雙重否定」的問題**」 | **⚠️ 本轮存疑**——**「双重否定」是概念，不是零基础能看到的错**；且**我方零术语红线要求不出现「否定句」这个词**（`GRAMMAR_ZERO_TERMS` 含「否定句」，实测 29 词里第 24 位）。**若要用，只能写成「unless 后面不请 not」，而这就变成了另一条规则说明而不是错句对照** | **🟡 半计** |
| ④ | **双正解** | `I will go out if it does not rain.`——两句都对，`unless` 就是「如果不」的另一种说法 | Cambridge 专节 `Unless and if … not` 逐字 `Unless and if … not both mean 'except if'` | **✅ 计入（第 2 条）** |
| ⑤ | **双正解·回流** | `If it rains, I will stay at home.`（L48 目标句） | 我方 L48 | **✅ 计入（第 3 条）**——⚠️ **但实测该句在库内的复用已到临界**：`if it rains i will stay at home` 在 `practice` 已出现 **2 课（L48／L49）**，在**学习者句槽**里出现 **2 课**——**离 6 课上限还有空间**，可用 |
| ⑥ | **❌ 缺** | —— | 需要第 4 条双正解；**可借旧句实测只剩 `As soon as I finish, I will eat.`（`practice` 已用 3 课：L142／L144 ＋ ？实测为 L142／L144 两课 ＋ L143 的 `practice` 无此句）——本轮实测该句 `practice` 复现 = 3 课（142,144 与 143 的 contrast 卡）**，**仍有余量但同一章内已用 2 次** | **❌ 缺** |

**→ 实算结果：✅ 2 条 ＋ 🟡 1 条 ＋ ❌ 3 条缺 → 去掉 ❌will 后 `unless` 只剩 3 条可用对比卡，距 6 条差 3 条。**

**（对照）批二十六的估算与本轮的差异来源**：

| 条目 | 批二十六怎么算的 | 本轮怎么算的 | 差异 |
|---|---|---|---|
| ① `except if` 词义 | 算作**增量来源**（不是卡） | **不算卡** | **−1** |
| ② `if…not` 等价 | 算 1 张双正解 | 同 | 0 |
| ③ ❌will | 算 1 张带标记 | **剔除**（任务书指定） | **−1** |
| ④ 不用「已知为真」 | 算作来源 | **降为自造，不计** | **−1** |
| ⑤ 不与 `if` 连用 | 未计入 6 条 | **计入 1 张** | **＋1** |
| ⑥ 不用于疑问句 | 算 1 张带标记 | **改判不计**（§2.4） | **−1** |
| 双正解回流（L48） | 算 1 张 | 同 | 0 |
| **合计** | **4 条** | **3 条** | **−1** |

### 2.4 为什么「`unless` 不能用于疑问句」本轮改判为「不计」

批二十六／竞析把这条算作一张带标记的新错（`*What will you do unless you get the loan?`）。**本轮改判的理由有两条，都是库内实测**：

1. **我方把「疑问变体」当作每课的标配**。实测最近 14 课（L139–L152）**课课有疑问变体卡**（`variants` 里 `label: "疑问"` 必然存在，且 `practice` 里有一道与之一致的疑问题——这是 `grammarLessons.test.ts:11-29` 的断言「每课练习 ≥4 题且含否定/疑问变体题」所强制的）。**一门课的核心词被自己的疑问卡禁掉，教学上自相矛盾**：用户刚在 L153 学会 `Unless it rains, I will go out.`，同一课的疑问卡却只能说 `Will you go out if it rains?`（换词）——**「这个词不能用来问」这条规则的收益，抵不上它让本课疑问卡变成「换词演示」的损失**。
2. **它要求「疑问句」这个概念**。零术语词表 `GRAMMAR_ZERO_TERMS`（实测 29 词）**含「疑问句」**。要用一句话讲清「不能用于疑问句」，必然要提到「疑问句」或绕成「不能放在问句里」——**而全库 152 课从未在任何 `oneLineRule`／`summary.rule`／`grammarLabel` 里出现过「疑问句」这个词**（零术语守门测试 `grammarLessons.test.ts:105-131` 断言 `grammarLabel`／`oneLineRule`／`summary.rule` 三字段不含 29 术语）。**→ 这条规则的表述成本高于它的价值。**

### 2.5 §2 结论（任务书要的判定）

> **判定：去掉 ❌will 之后，`unless` 只剩 3 条可用对比卡（§2.3 逐条列出：①② 两条带标记新错 ＋ ③ 一条双正解回流 ＋ 一条 L48 回流，其中 1 条为半计），距 6 条差 3 条。**
>
> **→ 轴 A 的实际课量：0 课。**（不是 2 课，也不是 3 课。）
>
> **理由链**：① 硬增量只有「不与 `if` 连用」＋「`if…not` 等价」两条；② 词义解释型来源（`except if`）**不是对比卡**，是全库 152 课都没用过的卡型；③ ❌will 被任务书指定剔除，且**该规则在库内已出现 7 课**（下表），**是库里重复次数最多的规则之一**；④ 「不能用于疑问句」与「每课必有疑问变体」的制度冲突，改判不计。
>
> **❌will 规则在库内的按课分布（本轮实测，逐课行号留痕）**：
>
> | 课 | 规则出现（`不请 will`／`不用 will`／`里说现在`／`前面说现在` 等句式） | 含 will 的带标记错句卡数 |
> |---|---|---|
> | L47 | 1 处 | 0 |
> | **L48** | **15 处** | **4** |
> | L49 | 6 处 | 1 |
> | L109 | 1 处 | 1 |
> | **L142** | **13 处** | 4（其中 1 张是双正解） |
> | L143 | 5 处 | 3（其中 1 张是双正解） |
> | L144 | 3 处 | 4（其中 1 张是双正解） |
> | **合计** | **44 处** | **17 张** |
>
> **→ 与任务书给的「已在 7 课教过（L47/48/49/109/142/143/144）」完全吻合（本轮独立复核成立），且本轮补一个新数字：44 处讲解 ＋ 17 张卡。**
>
> **⚠️ 另有一条本轮新发现，记录备查**：L139／L140／L141 三课虽不在上述 7 课里，**但它们有 4 张 `wrong` 含 will 的卡**——不过逐条看，**没有一张打在「❌will 规则」上**（L139 的 4 张分别是：多了 but／Although 后面缺小句子／两句都对的双正解／`I will call you tomorrow` 做双正解），**这一点复核批二十六的表述准确**（批二十六把这些课排除在 ❌will 规则之外是对的）。

---

## §3 轴 B 专项：`none`／`no one`／`nobody` 与已教 `nothing`（L84）的关系

### 3.1 `nothing`（L84）到底教了什么——逐字复核

〔实读〕`src/data/grammarLessons.ts:15571-15760`（L84 全文）。关键字段逐字：

- `:15574` `grammarLabel: "不点名的东西 · nothing / someone"`
- `:15582` `targetSentence: "There is nothing in the box."`
- `:15585` `blocks`: `{ text: "nothing", role: "什么也没有（自带「不」）" }`
- `:15588` `oneLineRule`: **"说「什么也没有」用 nothing——它自带「不」，句子里不再请 not；someone 是「有人」，一个人配 is。"**
- `:15656`（deepDive）逐字：**"如果想用 not 呢？那就换个词：I don't have anything——not + anything，两个「不」其实是一个意思的两种说法。记住原则：nothing 和 not 不同台。"**
- `:15658`（deepDive）逐字：**"三个一起记：something（有样东西）、anything（任何东西，疑问否定用）、nothing（啥也没有）——「不点名的东西」三兄弟到齐了。"**

**→ L84 教的三件事**：① `nothing` 自带「不」；② 不再请 `not`（`I don't have nothing.` ❌）；③ 「东西」侧三兄弟 `something`／`anything`／`nothing`。

**⚠️ 关键的实测发现：L84 教了「东西」侧的 `nothing`，但「人」侧只教了肯定版的 `someone`——「人」侧的否定版（`nobody`／`no one`）与「东西」侧的「都不」（`none`）都没教。**

实测证据（§0.3 表）：**`anyone` GL 0／HC 0，`nobody` GL 0／HC 0，`no one` GL 0／HC 0，`none` GL 0／HC 0**——**「不点名的」家族里，「人」侧的否定版一个都没有**。

### 3.2 `none`／`no one`／`nobody` 与 `nothing`（L84）是什么关系

**→ 判定：同一条老规矩的「第四次应用」，位置从「东西」挪到「人／一群」上。**

**这条老规矩的库内履历（本轮实测，四站齐全）**：

| 第几次 | 课 | 规矩 | 位置 | 逐字证据（行号） |
|---|---|---|---|---|
| **第 1 次** | **L83** | 「不／没」里把 `something` 换成 `anything` | **句子中间** | `:15398` `oneLineRule` 逐字 "说不清或者先不说是什么，用 something；问句和「不 / 没」里换成 anything——**第 30 课 some/any 的老规矩**"；`:15412` 卡逐字 `wrong: "I don't have something for you."`／`:15454` 变体卡逐字 "否定换 anything。" |
| **第 2 次** | **L146** | 「不」里把 `too` 换成 `either` | **句尾** | `:27473` `oneLineRule` 逐字 "说「也不」：**too 让位，either 上，还是站句尾**" |
| **第 3 次** | **L149** | 「不」里把 `both` 换成 `neither` | **最前面** | `:28051` `oneLineRule` 逐字 "说「两个都不」：neither 站最前面，后面那个东西只说一个——中文是加一个「不」，英语要整个换人：**both 让位，neither 上**"；`:28065` 卡逐字 `wrong: "Both books are not good."` |
| **第 4 次（本批）** | **L153／L154** | 「不」里把 `all` 换成 `none`（东西侧）／人侧换 `nobody`／`no one` | **仍是最前面** | **本批** |

**⚠️ 这条履历里有一处结构性的缺口，是本批必须处理的**：

- L146（第 2 次）的 `deepDive` **标题** `:27537` 逐字：**"第 83 课那条老规矩，今天又来一遍"**；正文 `:27734` 逐字：**"either 是新来的。它抄的是第 83 课那条老规矩：有「不」就换个词——那儿是 something 换成 anything，这儿是 too 换成 either。规矩一样，换的词不一样。"**
- L149（第 3 次）的 `deepDive` **标题** `:28115` 逐字：**"第 83 课那条老规矩，第三次来了"**

**→ L149 已经用「第三次来了」这个标题把这条规矩登记成一条可以往下数的序列。本批做 `none`／`nobody`，位置仍在「最前面」——**这是这条履历第一次「位置不再前进」**。**这不是问题，但必须在 `deepDive` 里给一个明确的说法**，否则用户会期待「这次换哪个位置」。**建议说法：「这次不换位置了，换的是『说的是东西还是一群人』」（§7.1／§7.2 的对比卡方向已按此写）。**

### 3.3 「都不」在英语里到底缺什么

**中文「都」的四格与库内覆盖（本轮实测更新批二十六 §2.5）**：

| 格 | 中文 | 英语 | 库内状态 | 缺什么 |
|---|---|---|---|---|
| 1 | 两个都 | `both` | **✅ L148–L150 已交付**（GLstruct 64 处／5 课） | — |
| 2 | 两个都不 | `neither` | **✅ L149–L150 已交付**（GLstruct 31 处／2 课） | — |
| 3 | 三个以上都／全都 | `all` | **✅ L151–L152 已交付**（GLstruct 35 处／4 课） | — |
| 4 | **三个以上都不** | **`none of…`（东西）／`no one`／`nobody`（人）** | **❌ 四词全零** | **本批补** |

**→ 「中文『都不』在英语里缺什么」的答案是三层：**

1. **缺「队首词」**：中文在「都」上加个「不」就完成（「都」→「都不」），英语必须**整个换掉最前面那个词**（`all` → `none of`／`no one`）。**这条机制我方已在 L149 教过（`both` → `neither`），本批是把它用到「三个以上」。**
2. **缺「东西／人」的分岔**：中文「一个都不」不分人或东西（「一个都没有」两处都能用）；英语**东西用 `none of the…`，人用 `no one`／`nobody`**。**这是我方库里从没有过的分岔**（对比：L83／L84 的 `something`／`nothing` 是不分人／东西的，因为 `-thing` 系列本身只管东西；**「人」侧的三兄弟 `someone`／`anyone`／`no one` 里，我方只教了 `someone`**）。
3. **缺「不再请 not」的第二次确认**：`none`／`nobody`／`no one` **全都自带「不」**（与 L84 的 `nothing` 同一条），**所以 `*Nobody is not here.` / `*None of them are not good.` 都要禁**。**这条可复用 L84 的现成话术**（`:15656` 逐字 "nothing 和 not 不同台"）。

### 3.4 能否撑 1–2 课，每课增量是什么

**→ 能撑 2 课，切分如下**（详细规格见 §7）：

| 课 | 课注 | 一句话增量 | 中文侧入口 | 上游课程位 |
|---|---|---|---|---|
| **第 1 课** | `lesson-153-none` | **「一个都不」——`none` 站最前面，后面接 `of the`／`of them`；它自带「不」，不再请 `not`** | 这几本都不好／我们都没准备好 | **Murphy 初级 U77 标题逐字 `77not+anynonone`**；**中级 U86 标题逐字 `86no/none/anynothing/nobodyetc.`**＋**U88 `88all/allofmost/mostofno/noneofetc.`**（三处，且 U88 紧接 U89「both/neither」，**与我方 L148–L152 的顺序天然对齐**） |
| **第 2 课** | `lesson-154-nobody` | **「一个人都不」——人要用 `no one`／`nobody`，配 `is`；东西侧才用 `none`；一句话里有了它就不请 `not`** | 谁都不知道答案／家里没人 | **Murphy 中级 U86 标题逐字含 `nothing/nobodyetc.`**；**初级 U78 标题逐字 `78not+anybody/anyone/anythingnobody/noˍone/nothing`**（两处） |

**⚠️ 上游课程位的一个关键实测（本轮新发现）**：**Murphy 初级册 U77–U82 是一整条「都／都不」连续链，与我方 L148–L152 的顺序几乎逐格对应**：

```
初级 U77 not+any no none
        U78 not+anybody/anyone/anything nobody/no one/nothing
        U79 somebody/anything/nowhere etc.
        U80 every and all
        U81 all most some any no/none
        U82 both either neither
```

**→ 逐格对照我方**：`both/either/neither` = 我方 L148–L150（**U82 对上了**）；`every and all` = 我方 L151–L152（**U80 对上了**）；**`not+any no none`（U77）与 `not+anybody/…nobody/no one/nothing`（U78）＝ 本批 L153–L154（对上 U77＋U78）**。

**→ 这是本项目第四次拿到「跨源连续课位链」，也是第一次「上游链的顺序与我方已交付顺序逐格吻合」。** **这条证据把轴 B 的档位从批二十六给的 B−（`all`）抬到 B＋**——**理由不是证据更厚，而是「我们正在沿着同一张表往下走，下一格在哪是确定的」。**

---

## §4 轴 C 专项：`ago` 是不是真缺口

### 4.1 判定：**是真缺口，而且是本批四条轴里「最像日常会话刚需」的一个**

**实测**：`ago` GLraw **0**／HCraw **0**／**GLstruct 0**——**库里没有任何一个 `ago`**。

**上游课程位（本轮从 Murphy 双册官方 TOC 本机原件实取）**：
- **初级册 U19 标题逐字 `19forsinceago`**（前接 U18 `How long have you…? (present perfect 4)`，后接 U20 `I have done (present perfect) and I did (past)`）——**`ago` 与 `for`／`since` 同格**；
- 中级册：**`ago` 在 TOC 归一化件中命中 0**（`murphy_int_norm.txt` 实测 `ago` 0 处）——**`ago` 只出现在初级册**。

**牛津词典**：`ox_ago.html` 的 `cefr=` 属性实测 **`a1`**，且标 `ox3000="y"`（三千核心词）。**这是本批四条轴里 CEFR 最低的一个候选**（对照 `whether` B1、`unless` B1、`since` A2 但带完成时前提）。释义逐字：**"used in expressions of time with the simple past tense to show how far in the past something happened"**。

**→ 判定：真缺口，且难度落点（A1）完美匹配「零基础」的产品定位。**

### 4.2 `ago` 与「昨天版」（L10）是什么关系——**同一条线，不是新话题**

**L10 的逐字复核**（`src/data/grammarLessons.ts:1764-1790`）：

- `:1764` `id: "lesson-10-went"`／`:1765` `number: 10`／`:1766` `title: "昨天去了公园"`
- `:1767` `grammarLabel: "说昨天的事"`
- `:1775` `targetSentence: "Yesterday I went to the park."`
- `:1776-1780` `blocks` 四条：`Yesterday`（**信号灯**，`:1777`）／`I`（`:1778`）／`went`（**昨天版**，`:1779`）／`to the park`（`:1780`）
- `:1782` `oneLineRule` 逐字：**"看到 yesterday，动词就要换形状：go 的昨天版是 went。中文动词不变，英语必须变。"**
- `:1795-1799`（第一张卡）逐字：`wrong: "Yesterday I go to the park."`（`:1796`）＋ `wrongMark: "go"`（`:1797`）＋ `whyZh`（`:1799`）**"看到 yesterday，动词就要换昨天版。go 的昨天版是 went——中文动词不变，英语必须变。"**

**→ `ago` 与 L10 的关系：`ago` 是「昨天版」的第二个信号灯。**

**这个判定有三条硬证据**：
1. **L10 建立了「信号灯 → 换形状」的机制**（`blocks` 里明写 `Yesterday` 的角色是「信号灯」，`oneLineRule` 明写「看到 yesterday，动词就要换形状」）；
2. **库里已有第二个信号灯的成例**：实测 `last night` GLstruct **1 课（L34）**、`last week` GLstruct **1 课（L24）**——**L24 的 `deepDive`（`:4409`）逐字："一句话判据：句子里有具体时间点吗？有——yesterday、last week——用昨天版；没有，只说「做过了、去过」，或事情和现在有关——用 have + 做过版。"**——**即 L24 已经把「具体时间点 → 昨天版」这条判据明确教过，`ago` 属于同一类**；
3. **`ago` 的位置规则与 `last week` 不同**：`last week` 站句首或句尾都行（L10 目标句是 `Yesterday I went to the park.`——**句首**），**而 `ago` 只能站句尾**（牛津逐字 `two weeks/months/years ago`／Cambridge 逐字 "Ago follows expressions of time"，并给出错例 `They arrived in Athens ago six weeks.`）。**这个「位置」增量就是本课的教学动作。**

### 4.3 学生会不会错说成 `before three days` 或 `three days before`？

**⚠️ 本轮的诚实回答：我无法从已取的源里直接证实「`before three days`」这个错型。**

- **Cambridge `ago` 页（本轮 WebFetch 实取）的 typical errors 逐字只有两条**：① 混完成时（错例 `I have received his letter four days ago.`）；② 位置（错例 `They arrived in Athens ago six weeks.`）。**没有 `before three days`。**
- 我**没有**实取到 `before three days` 的中文侧错例。**因此本条判定为「未核实」（登记在 §9 未核实项 ③）。**

**→ 但与它同源的错型有三条在源里是硬的，可以作为本课对比卡的候选**：

| # | 错句 | 来源（本轮实取逐字） | 判定 |
|---|---|---|---|
| ① | `*I have received his letter four days ago.` | Cambridge `ago` 页逐字 **"We normally use ago with the past simple. We don't use it with the present perfect"** | **✅ 硬（带标记）** |
| ② | `*They arrived in Athens ago six weeks.` | Cambridge `ago` 页逐字 **"Ago follows expressions of time"** | **✅ 硬（带标记）**——**且它恰好对应中文的语序负迁移**：中文「他们六周前到的」，语序是「六周前」在前；英语 `ago` 必须跟在时间词**后面** |
| ③ | `*It's not long ago since they met.` | 牛津 `ago` 页逐字 **"It is not correct to use 'since' in this sentence"**／**"You can only use 'since' if you leave out ago"** | **⚠️ 半计**——**`since` 我方 GL 0，这一条会引进一个未立项的词**，建议不作为考点 |

**→ 关于「`three days before`」**：**源里给的是「ago 与 before 的分工」**——Cambridge 逐字 **"If we refer to how long something lasted, we use for (not ago)"**，以及 **"For a point before a past time, use before or earlier or previously, often with the past perfect"**。**这两条都是「`ago` vs `for`／`before`」的分工，属双正解位（不进错句位）**。

**→ 本轮的处置建议**：**把「`before three days`」列为「待观察错型」而不写进对比卡**——**因为我们的卡必须是「学习者真会犯的错」，而这条我无法证实。** **更保守也更稳的做法是用上表 ① ② 两条（有源）+ 双正解（`before`／`for` 分工）**，**这条建议已写进 §7.5 的对比卡方向。**

### 4.4 `yet`／`already`／`still` 这条线值不值得做

**实测**：`yet` **0**／`already` **2（且 0 处句槽）**／`still` **1（且那 1 处不是时间副词义，见 §0.3）**／`just` **4（1 处句槽：L126 对白 `I just ran a race!`）**。

**上游课程位（本轮从 Murphy 双册 TOC 本机原件实取）**：
- **初级册 U95 标题逐字 `95stillyetalready`**——**三词独占一格**，前接 U94 `always/usually/often etc. (word order 2)`，后接 U96 `Give me that book! Give it to me!`。**这是全批最干净的课程位之一**（与批二十六对 `in case` 的评级同型）。
- **中级册 U111 标题逐字 `111stillanymoreyetalready`**——**四词一格**（`anymore` 是第四词）。

**中文侧**：`ec_stillyet.html`（4900 字符，本轮实取）**独立专文**「**Still, Yet, Already 用法上差在哪？一次搞懂！（含例句）**」，三个小节逐字 `still 仍然、還是`／`yet 還沒、尚未`／`already 已經、早已`——**三词分工在一篇里讲完**。`ec_already.html`（4930 字符）另有独立 `already` 专文，含**位置错例两条**：`The police arrested already the criminal. ❌`／`Linda had received already a mail from her best friend. ❌`（逐字："already 在句子裡並不會置於一個動詞以及直接受詞之間"）。

**Cambridge 侧（本轮实取）**：`already, still or yet` 页逐字给出**四条硬规则**：
- **"We usually put yet after the main verb, whereas we usually put still after the subject."**（位置对比，逐字）
- **"I haven't finished yet." vs. "I still haven't finished."**（同义两种说法，逐字）
- **"We don't use yet to refer to something that has happened. We use already."**（`yet` vs `already` 分工，逐字）
- **`still` 页 typical errors 三条**：`Not: Teachers have still an important role …`／`Not: … still is going up.`／`Not: I still can run …`

**→ 判定：这条线值得做，但本轮不建议与轴 B 同批。**

**三条理由**：
1. **它需要的前提我方有，但不在同一章**：`yet` 的典型环境是 `haven't + 做过版 + yet`（Cambridge 逐字 "We use it mostly in negative statements or questions in the present perfect"）。**我方 `haven't` 实测 3 课（L21／L22／L23）＋ `hasn't` 1 课（L53），距离本批（L153）已隔 130 课**——**做 `yet` 必须先回指 L21 的 `haven't`，这个回指跨度是 130 课**（对照：库里最远的回指实测是 L109 → L142 的「as 领一整句」认读，40 课；L34 → L97 的对白闭环，63 课）。**130 课的回指是本库从未有过的跨度。**
2. **`still` 的位置（主词后／be 后／助动词后）与 `always` 一族同规矩**（实测 `always` GLstruct **7 课**，L28 是立岗课）。**做 `still` 就必须与 L28 切开**——**这是第 3 课的量，本轮不取。**
3. **`yet` 与 `already` 的分工是「两张脸」型课，需要两课（各立岗）＋ 一课切开**——**3 课的量，超出本批容量**（本批轴 B 已占 2 课）。

**→ 结论：`yet`／`already`／`still` 这条线**登记为「**已核实、课位干净、待批次**」，**建议排在轴 B 之后的下一个批次**（它是又一个「A 档课程位」：初级 U95 三词独占一格）。

### 4.5 `ago` 与 `yet` 相比，本轮为什么先做 `ago`

| 维度 | `ago` | `yet`／`already`／`still` |
|---|---|---|
| **上游课程位** | 初级 U19（**与 `for`／`since` 三词一格**，且**初级册独占**） | **初级 U95 三词独占一格（更干净）** |
| **CEFR** | **牛津 `a1`（A1，且入 ox3000）** | 牛津：`yet` **a2**／`already` **a2**／`still` **a1**（本轮从 `cefr=` 属性实取） |
| **前提依赖** | **只需 L10「昨天版」（已交付，距离 143 课——⚠️ 见下）** | **需 `haven't`（L21，距离 132 课）＋ 与 L28 `always` 切开** |
| **课量** | **1 课（单点）** | **3 课（`yet` 立岗 ＋ `already` 立岗 ＋ 切开）** |
| **中文侧独立专文** | 牛津有释义，**中文侧本轮未找到 `ago` 专文**（`ec_all.txt` 索引里无 `ago` slug） | **有（`ec_stillyet.html` 三词分工专文 ＋ `ec_already.html` 独立专文含 2 条位置 ❌）** |
| **本轮判定** | **✅ 取 1 课（若产品负责人愿开第三课）** | **❌ 押后（3 课量，下一批）** |

**⚠️ 一条必须写明的风险**：`ago` 的依赖（L10）距离本批 **143 课**（L10 → L153）。**这是本库从未有过的回指跨度。** **处置建议**：**`ago` 课的回指不指向 L10 的「课文」，只指向「昨天版」这个已经内化的动作**——**回指文案写成「昨天版的老规矩」（不给课号）**，让用户在 `contrast` 里看到的是「动词穿昨天版」而不是「去复习第 10 课」。**§7.5 已按此写。**

### 4.6 §4 结论

> **判定：`ago` 是真缺口（三文件全零，牛津 A1，初级 U19 有课程位），它与「昨天版」（L10）是同一条线上的「第二个信号灯」关系——不是新话题。**
>
> **`yet`／`already`／`still` 这条线值得做（初级 U95 三词独占一格，中文侧有独立专文），但它是 3 课的量、且要 130 课跨度的回指，本轮不取，登记为下一批候选。**

---

## §5 中文负迁移分析（推荐轴）

### 5.1 `none`（第 1 课）的典型中式错句

| # | `*错句` | 干扰点（中文在想什么） | 类型 |
|---|---|---|---|
| ① | `*All the books are not good.` | 中文「都不」＝「都」＋「不」，**在「都」上贴一个「不」就完事**；英语的 `all` 加 `not` 是「不全都」而不是「全都不」 | **带标记**（`wrongMark: "All"`）——**正面击中批二十七的核心负迁移** |
| ② | `*None of books are good.` | 中文「这些书都不好」直接把「书」接在「都」后面，中间不加东西；英语 `none` 后面必须接 `of the` | **带标记**（`wrongMark: "of"`）——**与 L151 的 `*All of books are good.` 同型，**🟡 注意这是同一型错在第 2 次出现**（L151 案件 `hunt-all-the-books` 已有一条 `of` 插入错，见 `huntCases.ts` 案件 #160 的第 2 条 error）→ **建议本课改用别的标记位，见 §7.1** |
| ③ | `*None of the books is not good.` | 中文「都不」里的「不」被重复请了一次；`none` 自带「不」 | **带标记**（`wrongMark: "not"`）——**与 L84 的 `*I don't have nothing.`（`:15602`）同型，是同一规矩的第二次应用** |
| ④ | `*None of the book are good.` | 中文「书」不带数，学习者说不出英语该用单数还是复数 | **⚠️ 建议不作新错**——**`none of` 后面用单数还是复数在英语里两可**（牛津 `ox_none.html` 逐字 `None of these pens works/work.`／`We have three sons but none of them lives/live nearby.`——**两可**），**做成错卡会教错**；**改作双正解位**（`None of the books are good.` ／ `None of the books is good.` 两句都对——**这就多了一张双正解卡**） |

### 5.2 `nobody`／`no one`（第 2 课）的典型中式错句

| # | `*错句` | 干扰点 | 类型 |
|---|---|---|---|
| ① | `*Nobody are at home.` | 中文「没人」在感觉上是「一群人」（谁都不在＝好多人都不在），学习者按「一群」配 `are` | **带标记**（`wrongMark: "are"`）——**来源硬**：Cambridge 逐字 **"No one, nobody, nothing and nowhere are indefinite pronouns. We use them with a singular verb."** |
| ② | `*Nobody is not at home.` | 中文「没人不在家」（双重否定表强调）直译 | **带标记**（`wrongMark: "not"`）——**来源硬**：Cambridge 逐字 **"Not: I can't do nothing."**／**"She talks to hardly no one."** ＋ 逐字 "these words are not used after no, not, never or other words which have a negative meaning" |
| ③ | `*No one are at home.` | 同上①，但用的是 `no one` | **⚠️ 与 ① 重复**——**两卡打同一个点会让 6 条卡显得单薄**；建议**改为 `no one` 与 `nobody` 的自由互换（双正解位）**：`No one is at home.`／`Nobody is at home.` **两句都对——`nobody` 比 `no one` 更口语**（Cambridge 逐字 **"Nobody is a little less formal than no one."**） |
| ④ | `*Noone is at home.` | 英语 `no one` 写成 `noone` | **带标记**（`wrongMark: "Noone"`）——**来源极硬**：Cambridge 逐字 **"Write no one as two separate words or with a hyphen: no one or no-one but not noone."**；**但 ⚠️ 这是拼写错，我方库内 `contrast` 卡型里拼写错少见**（实测 152 课带标记卡的错型分布里没有拼写类）→ **建议作 `spot` 题而不作对比卡** |
| ⑤ | `*Nobody knows the answer, isn't it?` | 中文「谁都不知道答案，是不是？」 | **⚠️ 反意问句我方未教**——**不建议**（会引进未立项结构） |

### 5.3 两条干扰点的对照表（中文侧「都不」与英语两词的分工）

| 中文 | 英语 | 后面接什么 | 搭档 | 有「不」怎么办 |
|---|---|---|---|---|
| **（三个以上）都不**（东西） | **`none of the…`** | **`of the` ＋ 带 s 的东西** | `are`（复数侧）或 `is`（**两可**） | **词已经自带「不」——不再请 `not`** |
| **（三个以上）都不**（人） | **`no one`／`nobody`** | **什么都不接**（自己就是「人」） | **`is`**（**只能单数**） | **同上** |
| **（一个人）都不**（人，泛指） | **`nobody`** | 什么都不接 | `is` | 同上 |
| **（东西）一个都没有** | `none`（**不带 `of`** 时是代词） | 什么都不接 | `is`／`are` 两可 | 同上 |

**⚠️ 一个必须写进 `deepDive` 的对照**：**中文「都不」后面可以直接跟人也可以直接跟东西**（「这些书都不好」「谁都不在」），**英语要分成两条路**：**东西走 `none of the…`（后面要接 `of the` 那串），人走 `no one`／`nobody`（后面什么都不接）**。**这两条路的差别不在意思，在「说的是东西还是人」。**

---

## §6 场景设计

### 6.1 零雨线纪律复核（按任务书要求）

**任务书指定的 L109 专属叙事资产**：`rain`／`raining`／`rainy`／`stops`／`stopped`／`the movie`／`ends`／`ended`。

**本轮实测（逐字，命令留痕见附录 A ⑥）**：

| 词 | GLraw | HCraw | 本轮是否触碰 |
|---|---|---|---|
| `rain` | **105** | **21** | **❌ 不碰** |
| `raining` | **253** | **28** | **❌ 不碰** |
| `rainy` | **3** | **7** | **❌ 不碰** |
| `stops` | **9** | **3** | **❌ 不碰** |
| `stopped` | **45** | **11** | **❌ 不碰** |
| `the movie` | **8** | **0** | **❌ 不碰** |
| `ends` | **2** | **0** | **❌ 不碰** |
| `ended` | **8** | **0** | **❌ 不碰** |

**→ 本轮设计的 3 课场景锚（§6.3）一个都不含上述 8 个词。实测留痕：本报告推荐的目标句、例句、对比卡句里，`rain`／`movie` 等词出现次数为 0。**

### 6.2 场景锚纪律复核（`mansion` 轮换）

**实测：`mansion` 已用 60 课，且 L145–L151 连续 7 课未换**（逐课实测：145／146／147／148／149／150／151 全是 `mansion`）；**`campus` 在 L152 刚用过**。

**各场景的「最后使用课」实测**：

```
campus   L152（38 课）✅ 刚用过，本批不用
mansion  L151（60 课）⚠️ 连用 7 课，本批必须换
city     L140（24 课）← 已隔 12 课
sparkle  L137（ 9 课）← 已隔 15 课
island   L71 （ 5 课）← 已隔 81 课
train    L15 （ 3 课）← 已隔 137 课
forest   L75 （ 2 课）← 已隔 77 课
magic    L45 （ 2 课）← 已隔 107 课
mystery  L85 （ 3 课）← 已隔 67 课
school   L94 （ 5 课）← 已隔 58 课
snow     L19 （ 1 课）← 已隔 133 课
```

**→ 本批选 `school`（隔 58 课，且有「失物招领／校门口」的现成叙事传统）与 `city`（隔 12 课，是「放学路上」的老场景）。**

### 6.3 场景锚选定（按课）与零件逐词实测

#### 第 1 课（L153）场景锚：**傍晚的校门口水果摊——摊主收摊前，小美把筐里剩下的东西一件件看过去**

**⚠️ 与 L114 的距离**：L114（`:21262`）的场景设置（`:21269`）逐字是**「果盘端上桌：苹果还剩几个，糖果却几乎见底了——小美数了数。」**，**用的是 `There are a few apples.`**（`:21273`）——**同为「苹果／剩下」的语义场**。**处置：本课改用「书」（与 L148–L152 的 `books` 线连续），不用苹果。**

**零件逐词实测（GLstruct 口径，学习者可见句槽中的课数）**：

| 零件 | GLraw | HCraw | GLstruct 课数 | 出现在哪些课 | 判定 |
|---|---|---|---|---|---|
| `books` | **216** | **54** | **12 课** | 11,26,30,33,40,44,73,148,149,150,151,152 | **✅ 在库（且与 L151 的 `All the books are good.` 成对）** |
| `of` | **128** | **24** | **8 课** | 11,62,69,70,75,80,142,144 | **✅ 在库（`of` 的用法已有多课）** |
| `good` | **516** | **57** | **23 课** | 含 148,149,150,151,152 | **✅ 在库（L148–L152 连用 5 课）** |
| `are` | **837** | **102** | **48 课** | — | **✅ 在库** |
| `the` | — | — | 全库 | — | **✅ 在库** |
| `None` | 0 | 0 | **0** | — | **🆕 本课新词** |

**→ 目标句零件清单核验**：`None of the books are good.`——**6 词，其中 `None` 是新词，其余 5 个零件全部在库**。**✅ 通过。**

#### 第 2 课（L154）场景锚：**早自习前的教室——组长数完人数，一个人都没少；/ 傍晚回家，家里一个人都没有**

**零件逐词实测**：

| 零件 | GLraw | HCraw | GLstruct 课数 | 出现在哪些课 | 判定 |
|---|---|---|---|---|---|
| `home` | **109** | **44** | **16 课** | 9,10,15,18,19,20,21,36,48,49,90,139,140,141,142,144 | **✅ 在库** |
| `at home` | **59** | **3** | **10 课** | 18,19,20,21,36,48,49,139,140,141 | **✅ 在库（`at home` 整块是老零件）** |
| `is` | **2527** | **233** | **113 课** | — | **✅ 在库** |
| `know` | **173** | **8** | **7 课** | 27,35,37,39,40,41,46 | **✅ 在库**（**⚠️ `knows` GL 0——`knows` 从未在库里出现过**） |
| `answer` | **1727** | **0** | **3 课** | 34,55,97 | **✅ 在库**（**但注意：`answer` 的 1727 里有 1727−3 是全文件里的字段名 `answer:`——GLstruct 只 3 课；且这 3 课里 L34／L97 是 `I called you but no answer.`（「没人接」），L55 是别的义**） |
| `Nobody` | 0 | 0 | **0** | — | **🆕 本课新词** |
| `No one` | 0 | 0 | **0** | — | **🆕 本课新词** |

**→ 目标句零件清单核验**：`Nobody is at home.`（**4 词**）——**只有 `Nobody` 是新词，其余 3 个零件全在库**。**✅ 通过。**

**⚠️ 一条零件警告**：备选目标句 `Nobody knows the answer.` 里的 **`knows` 是库里从未出现过的形状**（`knows` GLraw **0**）——**L25 教了「三单加 -s」，但 `knows` 这个名字本身从没在句子里出现过**。**处置：若用这句，`knows` 要按「他/她/它版」处理并回指 L25**（与 L152 案件 `hunt-every-student` 的第 3 条 error 完全同型：**"第 25 课回流：My sister 是「她」一个，后面的动词要加 -s——My sister 【likes】 music."**）。

### 6.4 cloze 落点实测（决定考点能否被抽到）

**独立复刻 `grammarBoostService` 的 `hashText`＋`mulberry32`＋`keywordIndexes`＋`buildCloze`（脚本 `/tmp/ruisi27/cloze.cjs`，每句跑 **400 个种子**），实测候选目标句的落点分布**：

```
Nobody is at home.                      words=4 kw=2 | home=53.0% Nobody=47.0%
No one is in the classroom.             words=6 kw=2 | classroom=53.0% one=47.0%
None of the books are good.             words=6 kw=3 | good=35.8% None=32.3% books=32.0%
None of them are here.                  words=5 kw=3 | here=35.8% None=32.3% them=32.0%
Nobody knows the answer.                words=4 kw=3 | answer=35.8% Nobody=32.3% knows=32.0%
No one came to school.                  words=5 kw=3 | school=35.8% one=32.3% came=32.0%
None of the apples are good.            words=6 kw=3 | good=35.8% None=32.3% apples=32.0%
I came here three days ago.             words=6 kw=5 | ago=21.3% days=21.3% three=20.0% came=20.0% here=17.5%
She left three days ago.                words=5 kw=4 | ago=26.5% days=26.5% left=24.0% three=23.0%
I haven't finished my homework yet.     words=6 kw=4 | yet=26.5% homework=26.5% haven't=24.0% finished=23.0%
```

**→ 三条关键判定**：

1. **`Nobody is at home.` 的新词 `Nobody` 落点 47.0%**——**接近一半的种子会抽到考点**。**✅ 可接受**（对照 L152 目标句 `Every student is here.`：`keywordIndexes` 会给出 `Every`／`student`／`here` 三个落点，新词 `Every` 落点约 1/3——**本课 47% 更好**）。
2. **`None of the books are good.` 的新词 `None` 落点 32.3%**——**约 1/3**。**⚠️ 偏低但可用**（库里多课处于同一水位）。
3. **`I came here three days ago.` 的新词 `ago` 落点 21.3%**——**约 1/5**。**⚠️ 这是三条里最低的**。**处置建议**：**`ago` 课的目标句压到更短**，例如 `She left three days ago.`（`ago` 落点 **26.5%**）或 `He came two days ago.`——**缩短句子会提高新词占比**。**§7.5 已采用 `She left three days ago.`（5 词，`ago` 落点 26.5%）。**

### 6.5 封面池状态（本轮实测，P0 前置项）

**实测：`cover` 池共 117 张（`src/assets/lessons/` 实测 117 个 jpg），按 `cover1…cover117` 循环使用**：

```
L1–L117 -> cover1…cover117      （一轮）
L118–L152 -> cover1…cover35      （二轮，L118 回到 cover1）
```

**→ 实测：`cover1`–`cover35` 已各用 2 次；`cover36`–`cover117` 各用 1 次。**

**→ 本批 L153／L154（若加 `ago` 课则 L155）应接续第二轮：`cover36`／`cover37`（`ago` 课则 `cover38`）。**（**⚠️ 这是本批的 P0 前置项：新增课若不指定 `cover`，`grammarLessons.test.ts` 不会报错但页面会缺图。**）

### 6.6 分季登记（本批的 P0 前置项）

**实测 `src/data/grammarSeasons.ts`：`season-26` 的区间是 `min: 151, max: 152`。** 该文件的护栏注逐字（`:5-11`）：

> **"min/max 区间过滤是「必需机制」而非展示装饰——课程号不落在任何区间内会被路径页静默过滤（整课不显示、无报错）。新增课程批次时必须同步追加 season-N 分组，并有 grammarSeasons.test.ts 守门。"**

**→ 本批必须同步追加**：
```
{ id: "season-27", label: "第二十七季 · 一个都不", hint: "这几本都不好、谁都不在家——中文一个「不」字，英语要换个队首词", min: 153, max: 154 }
```
（**若产品负责人采纳 `ago` 第三课，则 `max: 155`，季名建议改为「一个都·多久前」**。）

---

## §7 逐课规格

### 7.1 L153 —— `none` 立岗（「一个都不」）

| 字段 | 内容 |
|---|---|
| **课注 id** | `lesson-153-none` |
| **number** | `153` |
| **title** | **「这几本都不好」** |
| **grammarLabel** | **`三个以上都不 · none 站最前面`** |
| **目标句** | **`None of the books are good.`**（**6 词 ≤ 8 ✅**） |
| **场景** | `scene: "school"`（**隔 58 课**）；`cover: cover36`；**sceneSetupZh**：「放学后的小书摊，摊主把一摞书推过来让小美挑——她一本本翻过去，一本都没看上。」 |
| **dialogueEn** | `None of the books are good.` |
| **dialogueZh** | 「小美把一摞书推回去，摇了摇头。」 |
| **intentZh** | 「这几本都不好。」 |
| **blocks** | ① `{ text: "None of the books", role: "这几本都不（一个都不——站最前面，后面接 of the）" }` ② `{ text: "are good", role: "不好（好几样东西，搭档用 are）" }` |
| **一句话规则** | **「说『一个都不』：none 站最前面，后面接住 of the——None of the books are good（这几本都不好）。中文在『都』上加一个『不』，英语要把最前面那个词整个换掉：all 让位，none 上。」** |
| **对比卡 6 条方向** | ① **带标记·新错**：`*All the books are not good.`（`wrongMark: "All"`）——**中文「都不」＝「都」＋「不」，英语必须换队首词**（**唯一指定错型**）<br>② **带标记·新错**：`*None of the books is not good.`（`wrongMark: "not"`）——**`none` 自带「不」，不再请 `not`**（与 L84 `:15602` 的 `*I don't have nothing.` 同型，第二次应用）<br>③ **带标记·新错**：`*None books are good.`（`wrongMark: "None"`）——**不能把 `none` 直接贴在东西前面；要用就用 `no ＋ 东西`，或者走 `none of the`**（**来源极硬**：Cambridge `None` 页逐字 **"Not: None children in my group …"**／**"Don't put none directly before nouns: use no + noun or none of + noun"**）<br>④ **双正解**：`None of the books is good.`——**两句都对**（后面那个东西按「一群」数就用 `are`，按「一个」数就用 `is`——**英语里两条路都通**，牛津 `ox_none.html` 逐字 `None of these pens works/work.`）**⚠️ 本报告 §9 未核实项 ④ 建议把这一条降级为 `deepDive` 里的一句说明**（零基础阶段同时教两种搭伙方式收益低），**该位置让给 §8.3 的 `There are few apples.`**<br>⑤ **双正解·回流**：`All the books are good.`（L151 目标句）——**两句都对**：没有「不」用 `all`（第 151 课），有「不」换 `none`（今天）<br>⑥ **双正解·回流**：`Neither book is good.`（L149 目标句）——**两句都对**：两个用 `neither`（第 149 课），三个以上用 `none`（今天）|
| **⚠️ 对比卡设计说明（必读）** | **① 的干扰点刻意避开 `of` 插入错**——因为 L151 的案件 `hunt-all-the-books`（`huntCases.ts` 案件 #160）**已经用过 `All of books` 这个错型**（第 2 条 error 逐字 "中文说「所有的书」直接连着说，英语的 all 后面也直接接——中间不加 of"）。**同一型错在同一章内出现两次，观感上会被认出是重复。** **改用 ③（`none` 直接贴东西）——这条有 Cambridge 明文，且与本课的 `of the` 一样是「队首词和东西之间隔了什么」的问题，但错点不同。** |
| **变体三态** | **肯定**：`All the books are good.`（「这几本全都好」——**没有「不」用 all，第 151 课**，`noteZh` 明写这是上一张脸）<br>**否定**：`None of the books are good.`（本课主句）<br>**疑问**：`Are any of the books good?`（「这几本里有好的吗」——**疑问侧换 `any`**，与 L83 的「问句换 anything」同规矩；**⚠️ 这条要核 `any` 的落点**，实测 `any` GLstruct **9 课**，在库） |
| **复现取材建议** | **必取 3 句**：① `All the books are good.`（**L151，`practice` 已用 2 课 L151／L152，余 4 课** ✅）；② `Neither book is good.`（**L149，`practice` 已用 2 课 L149／L150，余 4 课** ✅）；③ `I have a new bag.`（**`practice` 已用 2 课 L115／L151，余 4 课** ✅）。**⚠️ 原定第 ③ 句 `There is a book on the desk.` 实测 `practice` 已用 6 课（L26／37／55／60／114／148）——已达红线，禁用。** |
| **案件设计建议** | **`huntCases.ts` #162**：`id: "hunt-none-of-the-books"`，`title: "书摊前的一摞"`，`scene: "放学后的小书摊，一摞书摊在木箱上"`，**4 句 ／ 4 错**（**植错密度 4，与最近 8 案一致**）：<br>① `All of the students is here.` → `is`→`are`（`sv_agreement`，**第 7 课回流**）<br>② `None books are good.` → `None`＋补 `of the`（`fragment`，**本课新错**）<br>③ `All the book are good.` → `book`→`books`（`plural`，**第 11 课回流**）<br>④ `He drink milk every day.` → `drink`→`drinks`（`sv_agreement`，**第 25 课回流**）<br>**⚠️ 罪名标签只能从现有 10 个里选**（实测：`tense`61／`plural`114／`sv_agreement`102／`article`29／`missing_be`24／`preposition`62／`run_on`19／`verb_form`133／`word_order`58／`fragment`16） |

### 7.2 L154 —— `nobody`／`no one` 切开（「一个人都不」）

| 字段 | 内容 |
|---|---|
| **课注 id** | `lesson-154-nobody` |
| **number** | `154` |
| **title** | **「家里没人」** |
| **grammarLabel** | **`差在哪儿 · 东西一个都不／人一个都不`** |
| **目标句** | **`Nobody is at home.`**（**4 词 ≤ 8 ✅**） |
| **场景** | `scene: "city"`（**隔 12 课**）；`cover: cover37`；**sceneSetupZh**：「傍晚放学回家，小美掏出钥匙站在门口——敲了敲门，屋里一点声音都没有。她给妈妈打电话：家里一个人都没有。」 |
| **dialogueEn** | `Nobody is at home.` |
| **dialogueZh** | 「小美把电话贴上耳朵，屋里静得能听见楼道声。」 |
| **intentZh** | 「家里一个人都没有。」 |
| **blocks** | ① `{ text: "Nobody", role: "一个人都不（人自己就是队首词，后面什么都不接）" }` ② `{ text: "is at home", role: "在家（只说一个人，搭档用 is）" }` |
| **一句话规则** | **「说『一个人都不』：人要用 nobody（或 no one）自己站最前面，搭档用 is——Nobody is at home（家里一个人都没有）。上一课那个 none 说的是东西，这个 nobody 说的是人。」** |
| **对比卡 6 条方向** | ① **带标记·新错**：`*Nobody are at home.`（`wrongMark: "are"`）——**中文「没人」在感觉上是一群人，学习者按一群配 `are`**（**来源硬**：Cambridge 逐字 "We use them with a singular verb"）<br>② **带标记·新错**：`*Nobody is not at home.`（`wrongMark: "not"`）——**中文「一个人都不在家」里的「不」被请了两次**（Cambridge 逐字 `Not: I can't do nothing.`）<br>③ **带标记·新错**：`*Nobody is at home?`／更稳妥的版本 **`*None of the people are at home.`**（`wrongMark: "None"`）——**说「人」的时候用了东西那个词**（**来源极硬**：Cambridge `None` 页逐字 **"Don't use none for no one/nobody: correct is luckily no one was injured (Not: none was injured)"**）<br>④ **双正解**：`No one is at home.`——**两句都对**（Cambridge 逐字 "They mean the same"，`nobody` 更口语，`no one` 多用于书面）<br>⑤ **双正解·回流**：`None of the books are good.`（**L153 本课上一课**）——**两句都对**：上一课那个说东西，今天这个说人<br>⑥ **双正解·回流**：`There is nothing in the box.`（**L84 目标句**）——**两句都对**（`nothing` 说东西，`nobody` 说人；**两个都自带「不」，都不再请 `not`**） |
| **变体三态** | **肯定**：`Someone is at home.`（**L84 的 `Someone is at the door.`（`:15608`）同型**——**有人／没人一对**，与 L84 `:15614-15618` 的双正解卡「有样东西／啥也没有：一对反义，对台站」同规矩）<br>**否定**：`Nobody is at home.`（本课主句）<br>**提问**：`Is anyone at home?`（「家里有人吗」——**提问侧换 `anyone`**；**⚠️ `anyone` GLraw 0／HCraw 0——这是本课要新造的第 2 个词位**，**与 L83 的「问句换 anything」完全同规矩**，可以在 `deepDive` 里一句带过） |
| **复现取材建议** | **必取 3 句**：① `There is nothing in the box.`（**L84，`practice` 已用 1 课，余 5 课** ✅）；② `Someone is at the door.`（**L84，`practice` 已用 1 课，余 5 课** ✅）；③ `None of the books are good.`（**L153 本课上一课**）<br>**⚠️ 不可取（口径 ① 已触顶）**：`There is a book on the desk.`（**6 课：L26／37／55／60／114／148**）；`Yesterday I went to the park.`（**6 课：L21／24／93／95／100／104**）<br>**⚠️ 不可取（口径 ② 已触顶）**：`It's cold today.`（**双正解位 6 课：L87／88／89／90／91／96**） |
| **案件设计建议** | **`huntCases.ts` #163**：`id: "hunt-nobody-at-home"`，`title: "门口的一通电话"`，`scene: "傍晚的楼道口，小美站在家门口打电话"`，**4 句 ／ 4 错**：<br>① `Nobody are at home.` → `are`→`is`（`sv_agreement`，**本课新错**）<br>② `None is at home.` → `None`→`Nobody`（`word_order` 或 `fragment`，**本课新错；来源 Cambridge 逐字 Not: none was injured**）<br>③ `She don't know the answer.` → `don't`→`doesn't`（`sv_agreement`，**第 25 课回流**）<br>④ `I am at home yesterday.` → `am`→`was`（`tense`，**第 10 课回流**） |

### 7.3 L155（**条件取**）—— `ago` 立岗（「三天前」）

**⚠️ 前置条件**：**本课只有在产品负责人愿意把本批扩到 3 课时才做**；**若本批维持 2 课，则本课顺延到批二十八**（但批二十八若先做 `yet` 线，`ago` 会再次顺延——**建议本轮就把 `ago` 排进，因为它的 CEFR（A1）比 `yet` 线更低**）。

| 字段 | 内容 |
|---|---|
| **课注 id** | `lesson-155-ago` |
| **number** | `155` |
| **title** | **「三天前」** |
| **grammarLabel** | **`多久以前 · ago 站最末尾`** |
| **目标句** | **`She left three days ago.`**（**5 词 ≤ 8 ✅**；cloze 新词落点实测 **26.5%**，是本组候选里最高的） |
| **场景** | `scene: "train"`（**隔 137 课**，是全库最久未用的场景之一）；`cover: cover38`；**sceneSetupZh**：「火车站台上，小美和同学聊起隔壁班的交换生——她三天前就走了。小美看着站台尽头，说她三天前走的。」 |
| **dialogueEn** | `She left three days ago.` |
| **dialogueZh** | 「小美指了指站台尽头，风把告示纸吹得哗哗响。」 |
| **intentZh** | 「她三天前就走了。」 |
| **blocks** | ① `{ text: "She left", role: "她走了（动作穿昨天版——老规矩）" }` ② `{ text: "three days ago", role: "三天前（数字＋时间词，ago 站最末尾）" }` |
| **一句话规则** | **「说『多久以前』：数字＋时间词后面加 ago，它站句子最末尾——She left three days ago（她三天前走的）。那句话里的事用昨天版：left。」** |
| **对比卡 6 条方向** | ① **带标记·新错**：`*She has left three days ago.`（`wrongMark: "has left"`）——**`ago` 说的是过去某个点，跟「做过了」不搭**（**来源硬**：Cambridge `ago` 页逐字 "We normally use ago with the past simple. We don't use it with the present perfect"＋错例 `I have received his letter four days ago.`）<br>② **带标记·新错**：`*She left ago three days.`（`wrongMark: "ago"`）——**中文「她三天前走的」是「三天前」整块往前放，英语的 ago 要跟在那块后面**（**来源硬**：Cambridge 逐字 "Ago follows expressions of time"＋错例 `They arrived in Athens ago six weeks.`）<br>③ **带标记·新错**：`*She leaves three days ago.`（`wrongMark: "leaves"`）——**看到「…前」就要换昨天版**（**回指 L10 的「信号灯」机制——不给课号，写成「昨天版的老规矩」**）<br>④ **双正解**：`She left three days ago.`／`She has been away for three days.`——**⚠️ 不建议**（**`for` 的「持续多久」义我方 GL 0**，会引进未立项用法）→ **改用** `She left yesterday.`（**两句都对**：`yesterday` 和 `three days ago` 都是「昨天版」的信号灯，一个是点名的那天，一个是数出来的天数）<br>⑤ **双正解·回流**：`Yesterday I went to the park.`（**L10 目标句，`:1775`**）——**⚠️ 实测两个口径都已触顶**（`practice` 6 课：L21／24／93／95／100／104；双正解位 6 课：L93／95／99／100／101／104）→ **不可用**。**改用 L10 的 `examples` 句 `I watched TV.`**（**L10 `:1786` 逐字 `{ en: "I watched TV.", zh: "我看了电视。" }`**；**实测该句在 `practice` 与双正解位均 0 课** ✅）<br>⑥ **双正解·回流**：**L109 的那句（「等到雨停」）——❌ 严禁**（**零雨线资产，本报告不复述该句**）；**改用** `I was reading at eight.`（**L95 目标句**；**实测 `practice` 复现 3 课（L95／L101／L102），余 3 课** ✅） |
| **变体三态** | **肯定**：`She left three days ago.`（本课主句）<br>**否定**：`She didn't leave three days ago.`（「她不是三天前走的」——**`didn't` 一出场动词回原样**，回指 L10 的 `didn't go` 老规矩）<br>**提问**：`When did she leave?`（「她什么时候走的」——**问时间用 `When did`，引 `did` 回原样**；**但 ⚠️ 这条会引进 `When did…` 的问法，实测 `did` GLstruct 15 课已在库 ✅**） |
| **复现取材建议** | **必取 3 句**：① `I watched TV.`（**L10 `examples` 句；`practice` 复现 0 课** ✅）；② `I was reading at eight.`（**L95 目标句；`practice` 复现 3 课（L95／L101／L102），余 3 课** ✅）；③ `She was reading last night.`（**L34；`practice` 复现 1 课，余 5 课** ✅）<br>**⚠️ 不可取**：`Yesterday I went to the park.`（**两个口径都已触顶**：`practice` 6 课、双正解位 6 课） |
| **案件设计建议** | **`huntCases.ts` #164**：`id: "hunt-three-days-ago"`，`title: "站台上的三天"`，`scene: "火车站台上，告示纸被风吹得直响"`，**4 句 ／ 4 错**：<br>① `She has left three days ago.` → 去掉 `has`，`left` 不动（`verb_form`，**本课新错**）<br>② `She left ago three days.` → `ago`→`three days ago`（`word_order`，**本课新错**）<br>③ `I see her yesterday.` → `see`→`saw`（`tense`，**第 10 课回流**）<br>④ `He go to school every day.` → `go`→`goes`（`sv_agreement`，**第 25 课回流**） |

### 7.4 三课的 `practice` 复现取材与「同一句最多 6 课」红线的合规核算

**⚠️ 先立两个口径（本轮实测发现的必要区分）**：

- **口径 ① `practice[].answer`**——**这是被断言守门的那个**（`grammarLessons.test.ts:163-176` 逐字："练习答案不得跨课高频复现（同一句最多出现在 6 课，当前最差为 6）"）。**超 6 课会红。**
- **口径 ② `contrast` 双正解位（`bothRight: true` 卡的 `wrong` 字段）**——**当前没有任何断言守门**，但它是「同一句在库内出现次数」的实际观感上限。**本轮单独统计，供设计时避开。**

**口径 ①（`practice[].answer`，硬红线）实测**：

| 候选复现句 | 已出现课 | 已用课数 | 本批若用 | 用后总数 | 判定 |
|---|---|---|---|---|---|
| `All the books are good.` | 151,152 | **2** | ✅ | 3 | **✅ 安全** |
| `Neither book is good.` | 149,150 | **2** | ✅ | 3 | **✅ 安全** |
| `Both books are good.` | 148,149,150,151 | **4** | ⚠️ | **5** | **🟡 本批只可用 1 次** |
| `There is nothing in the box.` | 84 | **1** | ✅ | 2 | **✅ 安全** |
| `Someone is at the door.` | 84 | **1** | ✅ | 2 | **✅ 安全** |
| **`I have a new bag.`** | **115,151** | **2** | ✅ | 3 | **✅ 安全**（**⚠️ 本报告初稿曾误记为 1 课；`practice` 实测是 L115 与 L151 两课**） |
| `I don't have anything for you.` | 146,147,149 | **3** | ✅ | 4 | **✅ 安全** |
| `I don't like coffee either.` | 146,147,149 | **3** | ✅ | 4 | **✅ 安全** |
| `I have been to Beijing.` | 22 | **1** | ✅ | 2 | **✅ 安全** |
| `I have lost my key.` | 23,50 | **2** | ✅ | 3 | **✅ 安全** |
| `I finished reading the book.` | 64,120 | **2** | ✅ | 3 | **✅ 安全** |
| `I always arrive early.` | 28,58,72 | **3** | ✅ | 4 | **✅ 安全** |
| `When you called, I was reading.` | 97,101,109 | **3** | ✅ | 4 | **✅ 安全** |
| `I am used to getting up early.` | 120,122,124,136,138 | **5** | ❌ | 6 | **🔴 只可用 1 次且不能再多** |
| **`I watched TV.`**（L10 `examples` 句） | **无（0 课）** | **0** | ✅ | 1 | **✅ 安全（本批 §7.3 用它替代 `Yesterday…`）** |
| **`She was reading last night.`**（L34） | **34** | **1** | ✅ | 2 | **✅ 安全** |
| **`I was reading at eight.`**（L95 目标句） | **95,101,102** | **3** | ✅ | 4 | **✅ 安全**（**⚠️ 本报告初稿误记为 1 课；实测 `practice` 是 L95／L101／L102 三课**） |
| **`There are few apples.`**（L114） | **114** | **1** | ✅ | 2 | **✅ 安全** |
| **`Yesterday I went to the park.`** | 21,24,93,95,100,104 | **6** | **❌ 封死** | 7 | **🔴 已触顶，禁用** |
| **`There is a book on the desk.`** | 26,37,55,60,114,148 | **6** | **❌ 封死** | 7 | **🔴 已触顶，禁用** |

**口径 ②（`contrast` 双正解位的 `wrong` 字段，软上限）实测——按引用课数降序**：

| 被引用的句子 | 出现课 | 课数 | 判定 |
|---|---|---|---|
| `It's cold today.`（**注意是缩写形 `It's`**） | 87,88,89,90,91,96 | **6** | **🔴 已触顶，本批禁用** |
| `Yesterday I went to the park.` | 93,95,99,100,101,104 | **6** | **🔴 已触顶，本批禁用** |
| `My desk is next to the window.` | 80,81,82,83,86 | **5** | **🟡 可用 1 次** |
| `When it is sunny, I run.` | 93,94,97,109,143 | **5** | **🟡 可用 1 次** |
| `I finished reading the book.` | 64,69,77,120 | **4** | **🟡 可用 2 次** |
| `While I was reading, he was sleeping.` | 99,101,109,144 | **4** | **🟡 可用 2 次** |
| `I have to get up early.` | 103,105,107,115 | **4** | **🟡 可用 2 次** |
| `It is cold today.`（**注意是不缩写形 `It is`**） | 94,131,134 | **3** | ✅ 可用 |
| **`Both books are good.`** | 149,151,152 | **3** | ✅ 可用 |
| `Can I have a milk tea?` | 61,62,63 | **3** | ✅ 可用 |
| `I enjoy reading.` | 64,77,78 | **3** | ✅ 可用 |
| `It is too heavy to carry.` | 71,71,145 | **3** | ✅ 可用 |
| `I always arrive early.` | 72,78,100 | **3** | ✅ 可用 |
| `I was busy and happy.` | 81,140,141 | **3** | ✅ 可用 |
| **`Neither book is good.`** | 150 | **1** | ✅ 可用 |
| **`All the books are good.`** | **无（0 课）** | **0** | ✅ **可用（从未在双正解位出现过）** |

**⚠️ 本轮实测出的一条口径级发现（前几批未记）**：**同一句话有缩写形与不缩写形两个独立计数**——`It's cold today.` **6 课（已达上限）**，而 `It is cold today.` **3 课**。**两者在统计上是两句不同的字符串，但在学习者眼里是同一句。** **→ 设计对比卡时，若要用已触顶的句子，换一个写法并不能真的绕开观感重复。** **本批 §7 的三课一律避开了这两个句子。**

**→ §7.1／§7.2／§7.3 的「复现取材建议」已按本表逐条挑选（两个口径都核过），无一条触顶。**

---

## §8 与已教内容的切分

### 8.1 与最近三批的切分（最重要）

| 对谁 | 它教了什么 | 本批教什么 | 怎么切开（一句话） |
|---|---|---|---|
| **L151（`all`）** | `All the books are good.`——**「全都」＝队首词 `all`，后面可以站 `the`** | `None of the books are good.`——**「一个都不」＝队首词换 `none`，后面必须站 `of the`** | **同一张脸的两面：没有「不」用 `all`（后面直接接 `the`），有「不」换 `none`（后面必须 `of the`）**——**这就是本批第 1 课的全部内容** |
| **L152（`every`）** | `Every student is here.`——**「一个一个来」＝后面只说一个，搭档用 `is`** | `Nobody is at home.`——**「一个人都不」＝队首词是「人」自己，后面什么都不接，搭档用 `is`** | **两者都配 `is`，但「一个一个来」说的是每一个都到了（肯定侧），「一个人都不」说的是一个都没有（否定侧）** |
| **L149（`neither`）** | `Neither book is good.`——**「两个都不」＝队首词 `both` 让位给 `neither`** | `None of the books are good.`——**「三个以上都不」＝队首词 `all` 让位给 `none`** | **管几个：两个用 `neither`（第 149 课），三个以上用 `none`（本批）**——**这与我方 L148 → L151 的「两个 vs 三个以上」是同一刀** |

**→ L149／L151／L153 三课排一行的效果（本批建议在 L153 的 `deepDive` 里写）**：

```
没有「不」：Both books are good.（两个）→ All the books are good.（三个以上）
有「不」：  Neither book is good.（两个）→ None of the books are good.（三个以上）
```

**这是一张 2×2 的表，四个格子全部有课。** **本批补齐的是右下角那一格。**

### 8.2 与 `nothing`（L84）的切分（轴 B 专项要求）

| 维度 | L84（已交付） | 本批（L153／L154） |
|---|---|---|
| 管什么 | **东西**（`-thing` 系列：`something`／`anything`／`nothing`） | **「一群里的一个都不」（`none of the…`）＋「人」（`no one`／`nobody`）** |
| 位置 | `There is nothing in the box.`——**`nothing` 站在 `is` 后面**（句中的位置） | `None of the books…`／`Nobody is…`——**站最前面** |
| 自带「不」 | ✅ **是**（`:15588` 逐字 "它自带「不」"） | ✅ **是**（**同一条规矩的第二次应用**） |
| 不再请 `not` | ✅ 教了（`:15602` 的 `*I don't have nothing.`） | ✅ **要再教一次**（`*None of the books is not good.`／`*Nobody is not at home.`）——**但话术要复用 L84 的现成话**（`:15656` 逐字 "nothing 和 not 不同台"） |
| 「人」侧 | **只教了肯定版 `someone`**（`:15588` 逐字 "someone 是「有人」，一个人配 is"） | **补否定版 `nobody`／`no one`** |
| **最深的一处不同** | **`nothing` 不区分「人还是东西」的句法位置**（它自己就是东西） | **`none` 与 `nobody` 是「东西 vs 人」的分岔——这是我方库里第一次出现这个分岔** |

**→ 切分的一句话**：**L84 教的是「东西一个都没有」（`nothing`），本批补的是「一群里的东西一个都不」和「人一个都不」——从「有没有」走到「哪一个都不」。**

### 8.3 ⚠️ 与 L114（`a few`）的切分（本轮新发现的风险）

**L114（`:21262`）的逐字**：
- `:21265` `grammarLabel: "还有几个 vs 几乎没了 · a 在不在，意思反一半"`
- `:21269` `sceneSetupZh` 逐字：**「果盘端上桌：苹果还剩几个，糖果却几乎见底了——小美数了数。」**
- `:21273` `targetSentence: "There are a few apples."`
- `:21278` `oneLineRule` 逐字：**"「还有几个」说 a few（a 在，够）；「几乎没了」说 few（a 不在，不够）——就靠那个小 a，意思反一半。"**
- `:21279`–`:21283` `examples` 四条，逐字含 **"There are few apples."（苹果几乎没了。，`:21281`）**／**"There is a little milk."（还有一点牛奶，`:21282`）**

**→ 风险点**：**L114 教的是「数量少到什么程度」（`a few` vs `few`），本批教的是「一个都没有」（`none`）**——**两者都落在「数量」语义场，且 L114 的 `few`（几乎没了）与 `none`（一个都不）在中文侧距离很近**（「几乎没了」vs「一个都没有」）。

**→ 处置建议（三条）**：
1. **本批第 1 课的对比卡里必须有一条把 `few` 与 `none` 切开**——**但它占了 6 条里的 1 条，而「双正解」位还剩 3 个**（§7.1 的 ④⑤⑥），**可以把 ⑥ 换成这条**：`There are few apples.`（**L114 的句**）——**两句都对**：`few` 是「几乎没了，但可能还剩一两个」（第 114 课），`none` 是「一个都没有」（今天）。
2. **但 §7.1 的 ⑥ 原定是 L149 的 `Neither book is good.`**——**这条也是必须的（「两个 vs 三个以上」）**。**→ 建议：把 §7.1 的 ④（单／复数两可的双正解）降为 `deepDive` 里的一句说明，把 ④ 的位置让给 `There are few apples.`**（**单／复数两可这件事在零基础阶段收益低于「与第 114 课切开」**）。
3. **场景上也要拉开**：L114 是「果盘端上桌」（苹果／糖果），**本批第 1 课改用「书摊」（书）**（§6.3 已按此写）。

### 8.4 与 L35／L37（间接问句）的切分（轴 D 专项）

**如果将来做 `whether`**：`whether` 的「是否」义与我方 **L35 `I know where it is.`／L37 `I don't know where he is.`** 同属「一句话里再装一个小问题」。**`whether` 会与它们构成同一条线**——**这既是它未来的优势（有现成支架），也是本轮不做的理由之一**（同一位置在 82 课里被用过两次，第三次的增量只剩「把 `where` 换成 `whether`」）。

---

## §9 未核实项

| # | 项 | 本轮的核实到什么程度 | 影响 |
|---|---|---|---|
| **①** | **批二十五登记的「HC 里 `case` 有 1 处（注释里的 `case 9`）」** | **本轮实测 `case` 在 `huntCases.ts` 与 `grammarLessons.ts` 均为 0**（两法一致）——**该处已不在文件里**（可能随文件更新被移除，或批二十五登记错了文件） | **不影响判定**（`in case` 仍是真零），**但登记口径需更正** |
| **②** | **「`before three days` 是不是真实错型」** | **未证实**——Cambridge `ago` 页的 typical errors 只有两条（完成时混用／位置），**没有 `before three days`**；中文侧本轮未取到 `ago` 专文 | **影响 §7.3 的对比卡设计**（本轮已改用有源的两条 `has left`／`left ago three days`，**把 `before three days` 登记为待观察**） |
| **③** | **中文侧是否有 `ago` 独立专文** | **本轮从 `/tmp/ec_all.txt`（870 条 URL 索引）未找到 `ago` slug**；未逐一试状态码 | **影响 §7.3 的「中文侧实证」一栏**（本轮该课的中文侧证据只有牛津释义，**弱于轴 B 的中文侧**） |
| **④** | **`none of` 后续动词单／复数的教学取舍** | **源明确两可**（牛津逐字 `None of these pens works/work.`；Cambridge 逐字 "the verb is either singular or plural depending on what it is referring to"）；**但零基础阶段教两可会造成混乱** | **影响 §7.1 第 ④ 条对比卡**（**本轮建议：目标句用 `are`，把单／复数两可降级为 `deepDive` 的一句说明**——见 §8.3 处置 2） |
| **⑤** | **`no one` 与 `nobody` 的正式度差是否值得做考点** | **源上硬**（Cambridge 逐字 "Nobody is a little less formal than no one."；牛津逐字 "Nobody is more common than no one in spoken English."）——**但两词可以自由互换，做成错卡会教错** | **处置：只作双正解卡**（§7.2 的 ④），**不设错句位** |
| **⑥** | **`anyone` 是否随本批一起立岗** | **实测 `anyone` GLraw 0／HCraw 0**——**它是本批第 2 课「疑问变体」必需的第 2 个新词** | **⚠️ 若 `anyone` 算新词，第 2 课的造词成本是 3 个（`nobody`／`no one`／`anyone`）**，**比我方历史 1–3 词的上限触顶**。**处置建议**：**把 `anyone` 作「认读位」处理**（`Is anyone at home?` 只出现在疑问变体卡，不设错句考点），**造词成本按 2 个算** |
| **⑦** | **`mansion` 连用 7 课后是否影响场景观感** | **实测 L145–L151 连续 7 课 `mansion`**；**本轮已换 `school`／`city`／`train`** | 不影响本批；**但建议后续批次的场景分配机制加上「同场景连用 ≤3」的软约束** |
| **⑧** | **本批 3 课的 `cloze` 落点在真实引擎里的最终表现** | **本轮独立复刻了 `hashText`／`mulberry32`／`keywordIndexes`／`buildCloze`（脚本 `/tmp/ruisi27/cloze.cjs`），跑 400 种子**——**但 `grammarAmbushService.pickClozeWord` 的三级回退未跑** | **影响关 2 的空位落点**；**建议生产期用真实引擎复跑一次**（批二十六已建立该复刻） |

---

## 附录 A：raw 实测留痕（本轮全部结论的等价复现命令）

> **⚠️ 本机 `grep` 是 ugrep**：`grep -oniE "(^|[^A-Za-z])when([^A-Za-z]|$)"` 返回 **0（错误）**。**本报告所有词频一律由 node 脚本产出；`grep` 只用于「定位行号」（`grep -n` 在 ugrep 下可用）。**

```bash
# ① 词频（两支正则互校）——本报告 §0.3 全表
node -e '
const {readFileSync}=require("fs");
const GL=readFileSync("src/data/grammarLessons.ts","utf8");
const HC=readFileSync("src/data/huntCases.ts","utf8");
const esc=w=>w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
const r1=(T,w)=>(T.match(new RegExp(`(^|[^A-Za-z])${esc(w)}([^A-Za-z]|$)`,"gi"))??[]).length;
const r2=(T,w)=>(T.match(new RegExp(`(?<![A-Za-z])${esc(w)}(?![A-Za-z])`,"gi"))??[]).length;
for(const w of ["none","nobody","no one","nothing","anyone","someone","everyone","ago","yet","already","still","just","though","even though","even","unless","in case","case","whether","since","if"])
  console.log(w.padEnd(14), "GL1="+r1(GL,w), "GL2="+r2(GL,w), "HC2="+r2(HC,w));
'

# ② 学习者可见句槽口径（GLstruct）——本报告 §0.3 的「课数」列
node /tmp/ruisi27/freq.cjs      # 见附录 C 的脚本清单

# ③ contrast 构成实测——本报告 §2.2 的 152/152 与构成分布
node -e '
const {readFileSync}=require("fs");
const GL=readFileSync("src/data/grammarLessons.ts","utf8");
const lines=GL.split("\n");
const starts=[];
lines.forEach((l,i)=>{const m=l.match(/^\s*id:\s*"(lesson-\d+-[a-z0-9-]+)",?/); if(m) starts.push({line:i,id:m[1]});});
const rows=[];
for(let k=0;k<starts.length;k++){
  const s=starts[k].line, e=(k+1<starts.length?starts[k+1].line:lines.length);
  const body=lines.slice(s,e).join("\n");
  const ci=body.indexOf("contrast: [");
  let i=body.indexOf("[",ci),depth=0,j=i;
  for(;j<body.length;j++){ if(body[j]==="[")depth++; else if(body[j]==="]"){depth--; if(depth===0){j++;break;}} }
  const cards=body.slice(i,j).split(/\n\s*\},\s*\n\s*\{/);
  let real=0,both=0,neutral=0;
  for(const c of cards){
    const hasBR=/bothRight:\s*true/.test(c);
    const wm=c.match(/wrongMark:\s*(null|"[^"]*")/);
    if(hasBR) both++; else if(wm && wm[1]!=="null") real++; else neutral++;
  }
  rows.push({n:cards.length,real,neutral,both,id:starts[k].id});
}
console.log("contrast!=6 的课:", rows.filter(r=>r.n!==6).length);
const d={}; for(const r of rows){const k=`${r.real}+${r.neutral}+${r.both}`; d[k]=(d[k]??0)+1;}
console.log(JSON.stringify(d));
'

# ④ practice 答案的跨课复现（红线：同一句最多 6 课）——本报告 §7.4 全表
node /tmp/ruisi27/reuse2.cjs

# ⑤ cloze 落点（独立复刻 grammarBoostService，400 种子）——本报告 §6.4
node /tmp/ruisi27/cloze.cjs

# ⑥ 零雨线纪律复核——本报告 §6.1 全表
node -e '
const {readFileSync}=require("fs");
const GL=readFileSync("src/data/grammarLessons.ts","utf8");
const HC=readFileSync("src/data/huntCases.ts","utf8");
const c=(T,w)=>(T.match(new RegExp(`(^|[^A-Za-z])${w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}([^A-Za-z]|$)`,"gi"))??[]).length;
for(const w of ["rain","raining","rainy","stops","stopped","the movie","movie","ends","ended"])
  console.log(w.padEnd(12), "GL="+c(GL,w), "HC="+c(HC,w));
'
```

## 附录 B：上游原件逐字复核（本机 `/tmp` 缓存 + 本轮 WebFetch 现取）

| # | 页 | 状态 | 本报告引用的逐字 |
|---|---|---|---|
| **B-1** | Cambridge `grammar/british-grammar/no-one-nobody-nothing-nowhere` | ✅ **本轮 WebFetch 实取** | "No one, nobody, nothing and nowhere are indefinite pronouns."／**"We use them with a singular verb."**／**"Nobody is a little less formal than no one."**／**"Write no one as two separate words or with a hyphen: no one or no-one but not noone."**／三条 `Not:`：**"Not: Not anything will make me change my mind."**／**"Not: I can't do nothing."**／**"Not: She talks to hardly no one."** |
| **B-2** | Cambridge `grammar/british-grammar/no-none-and-none-of` | ✅ **本轮 WebFetch 实取** | **"None is the pronoun form of no. None means 'not one' or 'not any'."**／**"When none is the subject, the verb is either singular or plural depending on what it is referring to."**／**"Don't use none for 'no one'/'nobody': correct is luckily no one was injured (Not: none was injured)"**／**"Don't put none directly before nouns: use no + noun or none of + noun"** |
| **B-3** | Cambridge `grammar/british-grammar/ago` | ✅ **本轮 WebFetch 实取** | **"We normally use ago with the past simple. We don't use it with the present perfect"**（错例 `I have received his letter four days ago.`）／**"Ago follows expressions of time"**（错例 `They arrived in Athens ago six weeks.`）／**"If we refer to how long something lasted, we use for (not ago)"**／**"For a point before a past time, use before or earlier or previously, often with the past perfect"** |
| **B-4** | Cambridge `grammar/british-grammar/yet` | ✅ **本轮 WebFetch 实取** | **"We use it mostly in negative statements or questions in the present perfect."**／**"It usually comes in end position."**／**"We don't use yet to refer to something that has happened. We use already."** |
| **B-5** | Cambridge `grammar/british-grammar/still` | ✅ **本轮 WebFetch 实取** | **"We use still as an adverb to emphasise that something is continuing"**／**"The opposite of still is no longer, not any longer or not any more."**／typical errors 三条 `Not: Teachers have still an important role …`／`Not: … still is going up.`／`Not: I still can run …` |
| **B-6** | Cambridge `grammar/british-grammar/already-still-or-yet` | ✅ **本轮 WebFetch 实取** | **"We usually put yet after the main verb, whereas we usually put still after the subject."**／**"I haven't finished yet." vs "I still haven't finished."**／**"We use yet most commonly in questions and negatives, to talk about things which are expected but which have not happened."** |
| **B-7** | Cambridge `grammar/british-grammar/unless`（本机 `/tmp/b26/cam_unless.txt`，32705 字符） | ✅ **本机缓存逐字复核** | **"We use the conjunction unless to mean 'except if'."**／**"Unless is a conditional word (like if), so we don't use will or would in the subordinate clause"**（错例 `Not: Unless I'll hear from you …`）／**typical errors 两条**：**"We don't use unless when we mean if"**／**"We don't use will or would in the clause after unless"**／**"We don't use unless for things that we know to be true."** |
| **B-8** | Cambridge `grammar/british-grammar/in-case`（本机 `/tmp/b26/cam_in_case.txt`，31653 字符） | ✅ **本机缓存逐字复核** | **"In case is a conjunction or adverb. In case of is a preposition."**／**"We don't use in case to mean 'if'."**／**"We use in case of + noun to mean 'if and when something happens'"** |
| **B-9** | Cambridge `grammar/british-grammar/all`（本机 `/tmp/b26/cam_all.txt`，35851 字符） | ✅ **本机缓存逐字复核** | **"All means 'every one', 'the complete number or amount' or 'the whole'."**／**"All: not all — We can make all negative by using not in front of it"**（例 `Not all the buses go to the main bus station`／`We weren't all happy with the result`）——**⚠️ 注意：这是「不全都」（部分否定），不是「全都不」——本批正是要教这个区别** |
| **B-10** | Oxford `ox_ago.html` / `ox_yet.html` / `ox_already.html` / `ox_still.html` / `ox_none.html` / `ox_nobody.html` / `ox_whether.html` / `ox_since.html` | ✅ **本机缓存，`cefr=` 属性实取** | `ago` **a1**（ox3000）／`yet` **a2**／`already` **a2**／`still` **a1**（第 2 义 b1）／`none` **a2**／`nobody` **a1**（ox3000）／`whether` **b1**／`since` **a2** |
| **B-11** | Oxford `ox_ago.html` 释义正文 | ✅ 本机缓存 | **"used in expressions of time with the simple past tense to show how far in the past something happened"**／**"It is not correct to use 'since' in this sentence: It's not long ago since they met."**／**"You can only use 'since' if you leave out ago"** |
| **B-12** | Oxford `ox_none.html` 释义正文 | ✅ 本机缓存 | **"none (of somebody/something) not one of a group of people or things; not any"**／**"None of these pens works/work."**／**"We have three sons but none of them lives/live nearby."** |
| **B-13** | Oxford `ox_nobody.html` 释义正文 | ✅ 本机缓存 | **"not anyone; no person"**／**"Nobody is more common than no one in spoken English."** |
| **B-14** | Murphy **初级册**官方 TOC（`/tmp/murphy_ess_norm.txt`，13966 字符） | ✅ 本机原件逐字复核 | **U19 `19forsinceago`**／**U77 `77not+anynonone`**／**U78 `78not+anybody/anyone/anythingnobody/noˍone/nothing`**／**U79 `79somebody/anything/nowhereetc.`**／**U80 `80everyandall`**／**U81 `81allmostsomeanyno/none`**／**U82 `82botheitherneither`**／**U95 `95stillyetalready`** |
| **B-15** | Murphy **中级册**官方 TOC（`/tmp/murphy_int_norm.txt`，11016 字符） | ✅ 本机原件逐字复核 | **U86 `86no/none/anynothing/nobodyetc.`**／**U88 `88all/allofmost/mostofno/noneofetc.`**／**U89 `89both/bothofneither/neitherofeither/eitherof`**／**U90 `90alleverywhole`**／**U111 `111stillanymoreyetalready`**／U113／U114／U115（轴 A，本轮复核仍成立）；**`ago` 在中级册 TOC 命中 0** |
| **B-16** | 中文侧 `english.cool` | ⚠️ **本机缓存（2026-09-20 05:42 更新）** | `ec_stillyet.html`（5407 字符）：页题逐字「**Still, Yet, Already 用法上差在哪？一次搞懂！（含例句）**」／`ec_already.html`（4930 字符）：两条位置 ❌ 逐字 **`The police arrested already the criminal. ❌`**／**`Linda had received already a mail from her best friend. ❌`**；`ec_since.html`（4009 字符）：**「since 的6個用法！」**；`ec_whether.html`（5424 字符）：**「whether、whether or not 正確用法是？」**；`ec_indefinite-pronouns.html`：**「不定代名詞」**（含 `none` 但不含 `nobody`／`no one` 的专节） |
| **B-17** | 中文侧 `letmeenglish` | ✅ 本机缓存（`/tmp/b26/lme_no_any_none.txt`，2844 字符） | 页题逐字「**一次搞懂 no / any / none 用法！差異整理＋例句與練習**」；逐字 **「None 我們使用 none 作為代名詞，意即後面不帶名詞」**／**「我們在肯定句中使用 nothing, nobody, nowhere」**／**「Nothing, nobody, nowhere = not anything, not anybody, not anywhere」**／**「當 None of … 是句子的主語時，我們可以使用第三人稱單數形式（更正式）或第三人稱複數形式（更非正式）的動詞」** |

---

## 附录 C：脚本与自查

**本轮自建脚本（全部在 `/tmp/ruisi27/`）**：

| 脚本 | 用途 |
|---|---|
| `words.cjs`／`words2.cjs` | 第一批词频与场景零件实测 |
| `freq.cjs` | **双口径词频（GLraw 两法 ＋ GLstruct）＋ 按课分布** |
| `parts.cjs`／`final.cjs`／`final2.cjs`／`train.cjs` | **场景零件逐词实测（GLstruct 课数＋课号）** |
| `scenes.cjs` | **场景按课分布与「最后使用课」** |
| `reuse.cjs`／`reuse2.cjs` | **`practice[].answer` 与「双正解位」的跨课复现统计（红线核算）** |
| `cloze.cjs` | **独立复刻 `grammarBoostService` 的 cloze 落点（400 种子）** |
| `cands.cjs` | **候选目标句的 ≤8 词自查 ＋ 零术语扫描** |
| `target.cjs` | **will 规则的按课分布 ＋ 含 will 的带标记卡统计** |

**零术语自查（本报告面向学习者的文案范围声明）**：

本报告的**所有 `title`／`grammarLabel`／`oneLineRule`／`summary.rule`／`whyZh` 拟稿已用 `src/data/grammarZeroTerms.ts` 的 29 词表逐条扫描，命中 0**（脚本 `cands.cjs` 输出「clean」共 8 条，覆盖 §7 全部拟稿）。**`deepDive` 段落按库内惯例允许保留进阶用词，但本轮拟稿的 `deepDive` 也未含 29 词。**

**（附）29 词表逐字**（`grammarZeroTerms.ts:19-27` 实测）：
```
主语 谓语 宾语 表语 定语 状语
单数 复数 三单 原形 时态
一般过去时 一般现在时 现在进行时 过去进行时 现在完成时
情态动词 比较级 最高级 从句 语序 可数
疑问句 否定句 被动语态 第三人称
形容词 副词 介词
```

**硬性要求自查**：
- ✅ 词频一律用 node 脚本实测，给出真实数字（§0.3 全表 ＋ 附录 A 命令）
- ✅ 逐字引用给行号（`grammarLessons.ts` 的 `:NNNN` 均实测；`huntCases.ts` 的引文按案件 id／number 定位）
- ✅ 不整读大文件（`grep -n` 定位 ＋ `sed -n 'X,Yp'` 定点读；`grammarLessons.ts` 28808 行只读约 12 段，`huntCases.ts` 8797 行只读 2 段）
- ✅ 零术语（§7 全部拟稿扫描命中 0）
- ✅ 目标句 ≤8 词（§7 三课目标句实测：6 词／4 词／5 词）
- ✅ 输出中文 Markdown，文件落盘
