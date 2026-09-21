# 用户研究综合报告 · 第二十八批（用户研究 · 批二十八选题）
> **选题一句话推荐**：**取轴 B「`ago`（多久以前）」，做 2 课（L155 `ago` 立岗 → L156 `for + 一段时间` 切开）**；**轴 A（`none`／`no one`／`nobody`）同步立项、排在轴 B 之后（本批只做 1 课或顺延批二十九）**；**轴 C 与轴 B 是同一根轴的两半，必须配对做，不能只做一半**（§1.3 给出理由链）。

**日期**：2026-09-20 ｜ **类型**：用户研究（批二十八选题）｜ **成员**：瑞思
**方法**：本轮不采信任何转述；**全部词次由 node 脚本实测**（本机 `grep` 是 ugrep，按任务书要求全程不用于统计）；**全部逐字引用附 `sed -n` 行号，可复跑**。

---

## 0. 结论先行

### 0.1 本批最重要的一条：**批二十七登记的三条携带项有两处需要修正**

批二十七路线图 §6 留下的三条与本批相关的登记是：**携带项 4**「**轴 B（`none`／`nobody`）**——押后，**批二十八首选**」；**携带项 5**「**`ago`**——**新**，竞析判 B＋（Murphy 初级 U19 `for/since/ago`），**建议与 `since` 配对立项**」；**携带项 6**「**`for + 一段时间`**——**新**，`I have been here for three days.` 是自然表达，我方为零；**是否立项待评估**」。

**本轮把这三条全部复核了一遍，两处需要修正**：

| # | 上游登记 | 本轮实测 | 处置 |
|---|---|---|---|
| **①** | 轴 B 是「批二十八首选」 | **轴 B 的缺口为真，但它的「欠账」论证在库里的位置需要更正**：那句「（all 管肯定侧，**否定侧下一批再看**）」在 **L151 `:28490`**，不在批二十七所核的 L152 `:28684`（**L152 的逐字只有「（every 管肯定侧）」**）。**批二十七拦下的引文失实是对的，但两处被合成了一句引**（§1.1 给完整复核） | **轴 B 保留为真缺口，但从「库内许过的欠账」降为「普通真缺口」**；与轴 B′（`ago`）**谁先做改由难度与依赖决定** |
| **②** | `ago` 建议与 `since` 配对立项 | **`since` 的超纲问题批二十七已判死（牛津 `cefr="a2"` ＋ 释义首句要求完成时）**；`ago` 真正该配的对**不是 `since`，是 `for`**——**Cambridge 把两词绑在同一句里**：**"If we refer to how long something lasted, we use for (not ago)"**（本轮 WebFetch 现取） | **本批把 `for` 提到与 `ago` 同批**（§4 给出全部理由） |
| **③** | `days` GL 1 | **复核为真**：`days` 在 `grammarLessons.ts` 仅 1 处（`:25162`，**L134 的 NPC 台词**「Only two days to go!」），**不进 `dialogueEn`、不进 `targetSentence`、不进任何对比卡**；**而 HC 里已有两案把它当错在考**（case 66／85 的 `day`→`days`） | **这是一个必须先解决的「造词」问题**（§3.4 给出成本） |

### 0.2 三条轴的排序（本轮实读后）

| 排序 | 轴 | 词 | 缺口真伪 | 建议课量 | 档位 | 一句话理由 |
|---|---|---|---|---|---|---|
| **1** | **B** | **`ago`（＋ `for` 配对）** | **✅ 真缺口（`ago` GL 0／HC 0／学习者句槽 0；`days` GL 1 且不在句槽）** | **2 课** | **B＋** | **牛津 `cefr="a1"`＋`ox3000="y"`——三条轴里 CEFR 最低**；且它填的是**「数字＋时间词复数」整条形态的空白**（`weeks`0／`years`0／`hours`0），不是单个词 |
| **2** | **A** | **`none`／`no one`／`nobody`** | **✅ 真缺口（三词 GL 0／HC 0／句槽 0）** | **2 课**（本批可只排第 1 课） | **B** | **中文「都」的否定侧确实空白，且我方已把「换队首词」这条机制在 L149 付过费**——机制复用成本低；**但它的首课目标句（`None of the books are good.`）比 `ago` 课长、且 `of the` 这个零件在库里只有 8 处句槽** |
| 3 | C | `for + 一段时间`（单独立项） | ❌ **不应单独立项**（但**必须与 `ago` 同批**） | **0 课（独立）／1 课（与 `ago` 配对时）** | — | **它不是一条独立轴，是轴 B 的另一半**：`ago` 说「多久以前是那个点」，`for` 说「持续了多久」——**Cambridge 用一句话把两者绑在一起**（§4.2 逐字） |

### 0.3 词次实测总表（本轮新增，全部命令可复跑）

**口径说明**（三个口径，全部实算）：

- **`GLraw`／`HCraw`** ＝ 整文件整词命中数，正则 `(^|[^A-Za-z])w([^A-Za-z]|$)`（gi）。
- **`GLslot`** ＝ **学习者可见英文句槽**口径——只统计 `targetSentence`／`dialogueEn`／`examples[].en`／`variants[].en`／`sceneSwings[].en`／`practice[].answer`／`practice[].tokens`／`contrast.wrong`／`contrast.correct` 这些**真正会显示给学习者看的英文字段**，统计的是**课数**（同一课多次出现只算 1）。
- **`GLquote`** ＝ 全文件**任意引号字符串**里逐个比对整句（用于「复现红线」的完整句子统计）。

| 词 | GLraw | HCraw | GLslot（课数） | 结论 |
|---|---|---|---|---|
| **`ago`** | **0** | **0** | **0** | **三口径全零，真缺口** |
| **`days`** | **1** | **4** | **0**（那 1 处在 `dialogue[].en`，`dialogueEn` 之外的 NPC 台词） | **形态空白：`days` 从未出现在任何学习者要产出／对照的句子里** |
| `day` | 241 | 42 | 多课（每天／一天／日子义） | 已教，**但全是单数义** |
| **`weeks`** | **0** | **0** | **0** | **真零** |
| `week` | 40 | 13 | `weekend` 一族（L15／24／29／40／46／49／134）＋ `last week`（L24 规则句）＋ `once a month`／`twice a week`（L72）＋ `next week`（L136 对白） | 有「一周一次」「上周」，**没有「三周前」** |
| **`years`** | **0** | **0** | **0** | **真零** |
| `year` | 7 | 0 | 未在句槽检出 | 近零 |
| **`hours`** | **0** | **3** | **0** | **真零（GL）**；HC 3 处是别案 |
| `hour` | 11 | 5 | **1 课（L73）**——`It takes an hour by bus.` | 已教，**但是「要花一小时」，不是「持续了一小时」** |
| `minutes` | 17 | 3 | **1 课（L73）**——`It takes ten minutes.` | 同上 |
| `months` | 2 | 0 | 未在句槽检出 | 近零 |
| `month` | 8 | 0 | **1 课（L72）**——`I read once a month.` | 「一个月一次」 |
| **`none`** | **0** | **0** | **0** | **真缺口** |
| **`nobody`** | **0** | **0** | **0** | **真缺口** |
| **`no one`** | **0** | **0** | **0** | **真缺口** |
| **`no-one`** | **0** | **0** | **0** | 真零 |
| **`anyone`** | **0** | **0** | **0** | **真零**（与 `someone` 39 形成对照） |
| **`anybody`／`somebody`／`everyone`（句槽）** | `everyone` 3 | `everyone` 3 | `everyone`：**3 处全在 `dialogue[].en`（L105／L152／L154），句槽 0** | 认读级 |
| `nothing` | 71 | 5 | **3 课（L84／L85／L86）** | 已教（L84 立岗） |
| `someone` | 39 | 4 | **6 课（L33／L50／L51／L84／L85／L99）** | 已教（L84 转正） |
| **`since`** | **0** | **0** | **0** | 真零（但超纲，见 §4.3） |
| `for` | 156 | 29 | 多课，**但「持续多久」义为 0** | 见 §4 专项 |
| **`before`（含 `before + 一段时间` 义）** | 260 | 9 | 见 §3.5 | ⚠️ 见 §3.5 的重要澄清 |
| `at home` | 59 | 4 | **7 课（L18／19／20／21／36／48／49＋L139／140／141）** | 老零件，安全可用 |

**⚠️ 一条本轮的新数字（与批二十七报的不同，请以本轮为准）**：`anyone` GLraw **0**（与批二十七一致）；`everyone` GLraw **3**（批二十七报 2）——**差在 L154 `:29026` 的 `Everyone is gone!`**（那一句在批二十七交付时才落盘，批二十七研究做得早）。

---

## §1 逐轴缺口盘点

### 1.1 轴 A 的「欠账」论证复核（**本批最重要的口径修正**）

批二十七路线图 §1.1 逐字记录了这样一件事：

> 瑞思 §0 逐字称：「轴 B 是**欠账不是新选题**——**L152 `:28684` 逐字「all 管肯定侧，否定侧下一批再看」**，库里已对用户许过这句话」。
> **主理人实测**：L152 的 `variants` 否定卡逐字为——`{ label: "否定", en: "I don't like coffee.", zh: "我不喜欢咖啡。", noteZh: "第 5 课的老句子（every 管肯定侧）。" }`
> **原文是「（every 管肯定侧）」——不存在「否定侧下一批再看」这句话。**

**本轮把这句话在库里逐行找了一遍**（`node` 脚本，见附录 A ②）。实测结果：

```
$ node -e '...lines.forEach((l,i)=>{ if(l.includes("否定侧下一批再看")) console.log((i+1)+": "+l.trim()); })'
28490:      { label: "否定", en: "I don't like coffee.", zh: "我不喜欢咖啡。", noteZh: "这是第 5 课的老句子（all 管肯定侧，否定侧下一批再看）。" },
```

**这一行在 L151 的 `variants` 里（L151 的行区间是 `:28419`–`:28612`，L152 是 `:28613`–`:28806`）。**

**→ 本轮判定（三条，逐条说清）**：

1. **批二十七对 L152 的核验是对的**——`:28684` 的逐字确实是「（every 管肯定侧）」，**没有「否定侧下一批再看」**。**批二十七拦下那处引文失实是正确的。**
2. **但库里确实存在一处「否定侧下一批再看」**——它写在 **L151** 的否定变体卡 `noteZh`（`:28490`），**不是 L152**。**批二十七的措辞「L152 `:28684` 逐字『all 管肯定侧，否定侧下一批再看』」把两课的两行合成了一句**（`all 管肯定侧` 在 L151、`every 管肯定侧` 在 L152），**这是口径错误，但「库里许过这句话」这个事实本身成立。**
3. **→ 因此轴的强度介于两者之间**：**轴 A 不是凭空的「新选题」，但也够不上「库内明许的欠账」**——因为它出现在一处变体卡的 `noteZh` 里（**一个折叠在变体选择器里的短注**，不是首屏、不是规则句、不是对比卡），**用户看到它的概率远低于 `oneLineRule` 或首屏文案**。

**⚠️ 本轮的自我纪律声明**：以上三行的行号全部可复跑（附录 A ②）。**本报告此后凡引用 L151／L152，一律分开给行号，不再合并。**

### 1.2 轴 B（`ago`）是真缺口吗——四层实算

**第 1 层：词为零。**

```
$ node -e '... for(const w of ["ago"]) console.log(w, c(GL,w), c(HC,w))'
ago  GL 0  HC 0
```

**第 2 层：学习者句槽为零**（本轮新口径，比 GLraw 更严——排除了注释里的 `ago`）。

脚本（附录 A ③）逐课抽取 9 类学习者可见英文字段后，用 `\bago\b` 扫描：**154 课命中 0 课**。

**第 3 层：整条形态为零——这才是本轴真正的分量。**

| 形态 | `days` | `weeks` | `months` | `years` | `hours` | `minutes` |
|---|---|---|---|---|---|---|
| GLraw | 1 | 0 | 2 | 0 | 0 | 17 |
| 学习者句槽（课数） | **0** | **0** | **0** | **0** | **0** | 1（L73 `It takes ten minutes.`） |

**→ 「数字 ＋ 时间词复数」这个形态，全库只有一处算得上**（L73 的 `ten minutes`），**而且它是「要花多久」不是「多久以前」。** `weeks`／`years`／`hours` 三词**在三口径下全是零**。

**第 4 层：中文侧的表达需求。**

零基础中国学习者在「小美的一天」里**必然会遇到**的四个场景（全部是日常会话）：
1. 「她三天前就走了。」
2. 「我上周买的。」（→ 中文说「上周」，英语也常换算成 days／weeks ago）
3. 「你什么时候来的？」——**这个问句在库里也没有**（`When did` 学习者句槽实测**仅 1 课：L99 `:18439` NPC 台词**）。
4. 「他两个小时前就出门了。」（`two hours ago`）

**→ 判定：真缺口，且是本批三条轴里「想说却说不出来」最痛的一条。**

### 1.3 为什么轴 B（`ago`）排第一而轴 A 排第二——四条理由

| # | 维度 | 轴 B（`ago`） | 轴 A（`none`／`nobody`） | 谁赢 |
|---|---|---|---|---|
| **1** | **CEFR（牛津 `cefr=` 属性实取）** | **`a1`，且 `ox3000="y"`**（`/tmp/ox_ago.html` 实取） | `none` **`a2`**；`nobody` `a1`、`no one` `a1`（`/tmp/ox_none.html`、`ox_nobody.html`、`ox_no-one.html` 实取） | **轴 B**（A1 是三条轴里最低） |
| **2** | **依赖跨度** | 只需「昨天版」（L10，**距离 145 课**）——**但 L24 `:4409` 已把「具体时间点 → 昨天版」这条判据**写成了可独立引用的规则句**，不必回指 L10 的课文 | 需 L151 的 `all`（距 4 课）＋ L149 的「换队首词」机制（距 6 课） | **轴 A**（依赖近，**这是轴 A 唯一的强项**） |
| **3** | **新造词数** | **2–3 个**（`ago`，＋ `days` **共享**——见 §3.4 成本分析） | **3 个**（`none`／`nobody`／`no one`，**另需 `anyone` 作疑问位＝第 4 个**） | **轴 B** |
| **4** | **一课一增量的干净度** | **`ago` 的增量是「位置」**（站句尾、跟在时间词后面）——**与库内既有的「站句尾」（`too`／`yet`）同型，教学动作单一** | **`none` 的增量是「队首词换人 ＋ 后面接 `of the`」两件事叠在一起**（`of the` 是全新零件） | **轴 B** |

**→ 排序：B（`ago`＋`for`）> A（`none`／`nobody`）> C（`for` 单独立项，不成立）。**

**⚠️ 但要写清一条**：**这不是「轴 A 不好」，是「轴 A 适合紧接轴 B 之后」**。批二十七把轴 A 定为批二十八首选的逻辑（**库里许过**）本轮已修正为**弱证据**（§1.1）——**而轴 A 的真实优势（依赖近、机制已付费三次）依然成立，所以它是批二十九的当然首选，不是被否掉。**

---

## §2 轴 A 专项：`none`／`no one`／`nobody` 与 L84 的关系

### 2.1 L84 到底教了什么——逐字复核（任务书指定的 oneLineRule 已核）

**L84 的行区间 `:15571`–`:15760`**（`id: "lesson-84-nothing"` 在 `:15571`）。关键字段逐字：

- `:15574` `grammarLabel: "不点名的东西 · nothing / someone"`
- `:15582` `targetSentence: "There is nothing in the box."`
- `:15588` `oneLineRule: "说「什么也没有」用 nothing——它自带「不」，句子里不再请 not；someone 是「有人」，一个人配 is。"` ←**与任务书给的一致**（复跑命令：`sed -n '15588p' src/data/grammarLessons.ts`）
- `:15605`（第一张卡 whyZh）**"nothing 自带「不」：一句话里有了它，就别再请 not——两个「不」打架。"**
- `:15656`（deepDive）**"如果想用 not 呢？那就换个词：I don't have anything——not + anything，两个「不」其实是一个意思的两种说法。记住原则：nothing 和 not 不同台。"**

**→ L84 教了三件事**：① `nothing` 自带「不」；② 不再请 `not`（`I don't have nothing.` ❌）；③ 「东西」侧三兄弟 `something`／`anything`／`nothing`。

**→ L84 没教的三件事（本轮的实测重点）**：
- **「人」侧的否定版**（`nobody`／`no one`）——L84 只给了肯定版 `someone`（**`someone` GLslot 6 课：L33／50／51／84／85／99**）。
- **「一群里的一个都不」**（`none of the…`）。
- **`none` 与 `nobody` 的「东西／人」分岔**。

### 2.2 「都不」缺什么——三层

| 层 | 中文在做什么 | 英语要求什么 | 库内状态 |
|---|---|---|---|
| **① 队首词换人** | 在「都」上加一个「不」（都→都不） | **整个换掉最前面那个词**（`all` → `none of`／`no one`） | **机制已教**：L149 `:28051` oneLineRule 逐字**"说「两个都不」：neither 站最前面…中文是加一个「不」，英语要整个换人：both 让位，neither 上。"** |
| **② 东西／人分岔** | 中文「一个都没有」不分人或东西 | **东西 `none of the…`；人 `no one`／`nobody`** | **❌ 库内零**——这是我方**从未有过的分岔** |
| **③ 不再请 `not`** | 中文「一个人都不在」只请一次「不」 | `none`／`nobody` 自带「不」，不再请 `not` | **机制已教**（L84 `:15656` 逐字「nothing 和 not 不同台」），**本批是第二次应用** |

### 2.3 能否撑 2 课——能，但第 1 课的目标句要缩短

**上游课程位（本轮从本机 Murphy 双册 TOC 原件复核）**：

```
$ node -e 'const t=readFileSync("/tmp/murphy_ess_norm.txt","utf8"); console.log(t.match(/77[^\n]{0,80}/g)[0])'
77not+anynonone78not+anybody/anyone/anythingnobody/no\226one/nothing79somebody/any…
```

**→ 初级册 U77／U78 一整条「都／都不」链确实存在（复核成立）**；**U77／U78 是两课，U19（`for`／`since`／`ago`）是一课**——**若按上游课位算，轴 A 是 2 课，轴 B＋`for` 是 1–2 课，两者的「课位厚度」其实相当。**

**→ 判定：轴 A 能撑 2 课**：

| 课 | 增量（一课一增量） | 目标句候选 | 词数 | cloze 落点（本轮 2000 种子实测） |
|---|---|---|---|---|
| **第 1 课** | **「一个都不」——`none` 站最前面，后面接 `of the`；自带「不」，不再请 `not`** | `None of them are here.` | **5** | `None` **33.3%** ／`them` 34.1% ／`here` 32.6% |
| 同上（备选） | 同上，换更贴近 L148–L152 的书线 | `None of the books are good.` | **6** | `None` **33.3%** ／`books` 34.1% ／`good` 32.6% |
| **第 2 课** | **「一个人都不」——人用 `nobody`／`no one`，配 `is`；东西侧才用 `none`** | `Nobody is at home.` | **4** | `Nobody` **49.9%** ／`home` 50.1% |

**⚠️ 一条重要的实测发现（决定第 1 课目标句怎么选）**：**5 词句的落点分布（33.3%）与 6 词句完全一致，但 4 词句能到 50%**——**缩短句子是提高新词被抽中概率的唯一手段**。对照近 10 课的实际水位（本轮实算）：

```
I like tea too.                w=4 kw=3 | tea=34.1% like=33.3% too=32.6%
I don't like coffee either.    w=5 kw=4 | coffee=26.0% don't=25.4% like=24.6% either=24.1%
Both books are good.           w=4 kw=3 | books=34.1% Both=33.3% good=32.6%
Neither book is good.          w=4 kw=3 | book=34.1% Neither=33.3% good=32.6%
All the books are good.        w=5 kw=3 | books=34.1% All=33.3% good=32.6%
Every student is here.         w=4 kw=3 | student=34.1% Every=33.3% here=32.6%
She hasn't come yet.           w=4 kw=3 | come=34.1% hasn't=33.3% yet=32.6%
She is still waiting.          w=4 kw=2 | waiting=50.1% still=49.9%
```

**→ 近 10 课的常见水位是「4 词句 ＋ 3 个落点 ＝ 新词 33.3%」或「4 词句 ＋ 2 个落点 ＝ 新词 50%」。** 轴 A 第 1 课用 5–6 词句（33.3%）**不劣于近期水位，可用**。

### 2.4 §2 结论

> **判定：轴 A 是真缺口（三词三口径全零），与 L84 是「同一条老规矩的第二次应用」关系——机制（自带「不」、不再请 `not`）复用 L84，但位置从「句中」挪到「最前面」，且新增「东西／人分岔」这个我方从未有过的切分。**
>
> **能撑 2 课**（第 1 课 `none of the…`，第 2 课 `nobody`／`no one`）。**但本批建议只排第 1 课，或整轴顺延批二十九**（理由：轴 B 的 CEFR 更低、增量更单一，见 §1.3；且两轴同期上线会让「中文『都』的否定侧」与「数字＋时间词」两条完全无关的线挤在同一批，跨批节奏上不经济）。

---

## §3 轴 B 专项：`ago` 是不是真缺口

### 3.1 判定：**是真缺口，且是三条轴里「最像日常会话刚需」的一个**

**实测（复核批二十七）**：`ago` GLraw **0**／HCraw **0**／**学习者句槽 0 课**。

**上游课程位（本机原件复核）**：

```
$ node -e 'const t=readFileSync("/tmp/murphy_ess_norm.txt","utf8"); console.log(t.match(/19[^\n]{0,80}/g)[0])'
19forsinceago20Ihavedone(presentperfect)andIdid(past)@@@Passive21isdonewasdone…
```

**→ 初级册 U19 标题归一化后为 `19forsinceago`——`for`／`since`／`ago` 三词同格。**

**牛津词典（`/tmp/ox_ago.html` 本机缓存，`cefr=` 属性实取）**：

```
$ node -e 'const h=readFileSync("/tmp/ox_ago.html","utf8"); console.log([...new Set(h.match(/cefr="[a-z0-9]+"/gi))])'
[ 'cefr="a1"' ]
$ node -e 'const h=readFileSync("/tmp/ox_ago.html","utf8"); const j=h.indexOf("how far in the past"); console.log(h.slice(j-300,j+300))'
...<li class="sense" hclass="sense" fkcefr="a1" htag="li" id="ago_sng_1" fkox3000="y"><span class="sensetop"...><span class="def" htag="span" class="def">used in expressions of time with the simple past tense to show how far in the past something happened</span></span><ul class="examples"...><li...><span class="x">two weeks/months/years ago</span></li><li...><span class="x">The letter came a few days ago.</span></li>
```

**→ 三条硬事实**：① `cefr="a1"`；② `fkox3000="y"`（牛津三千核心词）；③ 释义里给出的例句形态**恰好就是本批要教的**：`two weeks/months/years ago`／`The letter came a few days ago.`

### 3.2 中文「三天前」英语怎么说——学生的错型（**本轮把批二十七的「未核实」推进了一步**）

批二十七 §9 未核实项 ② 逐字登记：**「`before three days` 是不是真实错型——未证实」**。

**本轮的处理：不编造，改从「有源的错型」反推。**

**Cambridge `ago` 页（本轮 WebFetch 现取）逐字只有两条 typical errors**：

| # | 逐字规则 | 逐字错例 | 判定 |
|---|---|---|---|
| ① | **"We normally use ago with the past simple. We don't use it with the present perfect"** | **"Not: I have received his letter four days ago."** | ✅ **硬**（带标记新错位） |
| ② | **"Ago follows expressions of time"** | **"Not: They arrived in Athens ago six weeks."** | ✅ **硬**（带标记新错位） |

**同页另有两句针对 `for`／`before` 的分工（本轮同一 WebFetch 逐字取回）**：

- **"If we refer to how long something lasted, we use for (not ago)"**
- **"If we refer to a point in time before a specific time in the past, we use before or earlier or previously"**

**→ 关于任务书问的 `*before three days` 与 `*three days before`：**

| 候选人 | 本轮判定 | 依据 |
|---|---|---|
| `*She came before three days.` | **❌ 不写进对比卡** | 本轮**仍未取到任何源**支持它是真实错型。**按任务书「不确定的标未核实，不要编造」——登记为待观察（§9 未核实项 ①）。** |
| `*She came three days before.` | **❌ 不写进对比卡** | 同上。**但 Cambridge 那句 "For a point before a specific time in the past, we use before"** 说明 `before` 确有它的岗位——**这条应当进 `deepDive`（双正解位的说明），不进错句位** |
| `*She left ago three days.` | **✅ 进对比卡** | **Cambridge 错例 `They arrived in Athens ago six weeks.` 的直译版**，且与中文语序负迁移（§5）正面咬合 |
| `*She has left three days ago.` | **✅ 进对比卡** | **Cambridge 错例 `I have received his letter four days ago.` 的同型** |

### 3.3 `ago` 与 L10「昨天版」、L73「要花多久」的关系与切分

**（1）与 L10「昨天版」的关系：同一条线，`ago` 是第二个信号灯。**

L10 的行区间 `:1764`–`:1945`，关键逐字：

- `:1767` `grammarLabel: "说昨天的事"`
- `:1775` `targetSentence: "Yesterday I went to the park."`
- `:1777` `blocks` 第一条：**`{ text: "Yesterday", role: "昨天（信号灯）" }`**
- `:1782` `oneLineRule: "看到 yesterday，动词就要换形状：go 的昨天版是 went。中文动词不变，英语必须变。"`
- `:1796`–`:1799` 第一张卡：`wrong: "Yesterday I go to the park."`／`wrongMark: "go"`／`whyZh` **"看到 yesterday，动词就要换昨天版。go 的昨天版是 went——中文动词不变，英语必须变。"**

**→ 三条切分依据**：

1. **L10 建立的机制是「信号灯 → 换形状」**，且 `blocks` 里明写 `Yesterday` 的角色是「信号灯」。
2. **库里已有第二个信号灯的成例**：L24 `:4345` `oneLineRule` 逐字**"句子里有具体时间点（yesterday、last week）就用昨天版…"**；`:4409`（deepDive）逐字**"一句话判据：句子里有具体时间点吗？有——yesterday、last week——用昨天版；没有，只说「做过了、去过」，或事情和现在有关——用 have + 做过版。"**
   **→ 这条判据是 L24 给出的「可独立引用的规则」，`ago` 属于同一类，本课可以引用它而不必回指 L10。**
3. **`ago` 的增量是「位置」**——它**只能站句尾**（Oxford 逐字 `two weeks/months/years ago`；Cambridge 逐字 "Ago follows expressions of time"），**而 `yesterday` 站句首**（L10 目标句 `Yesterday I went to the park.`）。**这个「位置差」就是本课的教学动作。**

**⚠️ 一条必须写明的风险**：**`ago` 的依赖（L10）距离本批 145 课**（L10 → L155）。

**本轮实测了库内的回指跨度水位（新数字）**：

```
$ node -e '... 统计所有「第 N 课」回指的跨度 ...'
最大「第 N 课」回指跨度: L152 → L5（147 课）
top 8: L152→L5(147) L151→L5(146) L152→L7(145) L152→L7(145) L152→L7(145) L151→L7(144) L151→L7(144) L148→L5(143)
跨度 > 60 课的回指总条数：544
```

**→ 结论：批二十七担心的「143 课回指是本库从未有过的跨度」在本轮实测下不成立**——**库里跨度最大的回指是 147 课，且 > 60 课的跨课回指有 544 条。** **`ago` 课引用 L24 的「一句话判据」在库内是完全正常的做法。**

**（2）与 L73「要花多久」的切分：两条完全不同的轴，必须切开。**

L73 的行区间 `:13484`–`:13670`，关键逐字：`:13486` `grammarLabel` / `:13494` `targetSentence: "How long does it take?"` / `:13499` `oneLineRule` 逐字 **"问「要花多久」用 How long does it take——答语 It takes ten minutes（take 表「花时间」）。"** / `:13548`／`:13554` 变体卡 `It takes ten minutes.`

| | L73（已交付） | 本批（轴 B） |
|---|---|---|
| **问什么** | **这件事要花多久**（还没做，估时间） | **那件事是多久以前发生的**（已经发生，报时间点） |
| **中文入口** | 「到学校要花多久？」 | 「她三天前走的。」 |
| **句子骨架** | `It takes + 时长`——**主角是「它」** | `数字 + 时间词 + ago`——**主角是那件事** |
| **时间词形态** | `ten minutes`（L73 已教） | `three days`（**库内零**） |
| **共同点（要写进 deepDive）** | **都用「数字 ＋ 时间词」这同一个零件，但一个往前花、一个往回数** | 同上 |

**→ 建议在 `ago` 课的 `deepDive` 里写一句**：「第 73 课你也数过时间——`It takes ten minutes`（要花十分钟）是往前花；今天这个 `three days ago`（三天前）是往回数。**同一串『数字＋时间词』，一个看前头、一个看后头。**」（**这句不含零术语 29 词，可过守门。**）

### 3.4 ⚠️ `three days ago` 需要 `days`——这是不是一个必须一起解决的造词问题？

**→ 是。而且比批二十七估计的更严重。**

**实测（本轮，命令见附录 A ①）**：

```
=== GL lines containing days ===
25162: { who: "npc", en: "Only two days to go!", zh: "同桌在课间掰着手指数。" },      ← L134 的 NPC 台词
=== HC lines containing days ===
4208/4209: correction: "days" / "three 后面是可数名词复数：three days。"   ← case 66 hunt-calendar-note
5393/5394: correction: "days" / "Two 后面是可数名词复数：two days。"       ← case 85 hunt-feel-better
```

**→ 三条解读**：

1. **`days` 在 GL 里只有 1 处，且是 L134 的 NPC 台词 `Only two days to go!`**——**不进 `dialogueEn`、不进 `targetSentence`、不进任何对比卡**（L134 `dialogue[0]`，`:25162`）。
2. **`days` 在 HC 里有 4 处，全是案件里的「更正词」**（`three days`／`two days`，两案各一次）——**即：库里已经两次把「`two`／`three` 后面要加 s」当成错误在考，但从来没有正式教过 `days` 这个形态。**
3. **⇒ 结论：`days` 是「一直在被当作旧知识用、但从未立过岗」的形态。** 这与批二十六登记的 `knows`（GL 0 却从未出现）同型，**但更隐蔽**——**因为 `day` GL 241 处，教务上看不出缺。**

**→ 造词成本（逐词给）**：

| 新词 | 出现位置 | 是否本课必需的产出词 | 成本 |
|---|---|---|---|
| **`ago`** | 目标句句尾 | ✅ 是 | **1 个（必修）** |
| **`days`** | 目标句里的「数字＋时间词」块 | ✅ 是 | **1 个（必修）**——**但它可以「不占新词位」**：它只是 `day` 加 s，与 L11 教过的「好几个东西加 s」同规矩；**建议在 `blocks` 里把 `three days` 整块给角色**（`{ text: "three days", role: "三天（三个以上，day 要带 s）" }`），**并在 `oneLineRule` 里用一句话点掉** |
| `two`／`three`／昨天版动词 | — | ❌ 不是（早已教过） | **0** |

**→ 建议：本课新造词按 1 个（`ago`）算 ＋ 1 个「形态补员」（`days`，不占新词位但必须显式教）。**

**⚠️ 零件安全复核（动词候选，本轮实测）**：`left`（动词义）句槽实测只出现在 **L33／L84／L85／L86 的 `Someone left them here.` 系列 ＋ L114 的 `apples left.`（剩余义）**；**`came` 在学习者句槽实测 0 处**（GLraw 11 处全在讲解与选项里：`:6972`／`:19966`／`:20048` 等）。**→ 两个候选都有「昨天版需要现场给」的成本。**

**→ 最终建议**：**用 `She left three days ago.`**（5 词）。**理由**：① `left` 已有 L33／L84 的现成例句 `Someone left them here.`（可作 `examples` 的第一条回流）；② `left` 的 cloze 落点 25.4%，**比 `ago` 高**（`came` 同）；③ `She left three days ago.` 在 HC 连续子序列口径实测**零复用**（附录 A ⑥）。

### 3.5 `before` 的实测澄清（防一处误判）

**`before` GLraw 260 处，本报告必须说明它是什么。**

**实测**：**这 260 处里，作为「在…之前」的时间词义，绝大多数是 L91 教的 `before + 小句子`**（`:16919` 等，`Before I eat, I wash my hands.`）**以及语法注释里的英文单词 `before`**（如 `before`／`after` 的对照讲解）。**没有一处是「before ＋ 一段时间」的用法。**

**→ 结论**：**`before` 的「多久以前」义（`three days before`）为 0**——**这与 `ago` 的缺口是同一条线上的两个位置**，但**本批不碰**（Cambridge 逐字说它「often with the past perfect」，**超纲**）。

---

## §4 轴 C 专项：`for + 一段时间`

### 4.1 判定：**不是一条独立轴，是轴 B 的另一半**

**实测**：`for` GLraw **156**／HCraw **29**——**看起来很多，但「持续多久」义为 0。**

**本轮把 learners 句槽里所有含 `for` 的句子全部打了出来**（脚本见附录 A ⑤），分三类：

| 类型 | 例子 | 课 | 数量 |
|---|---|---|---|
| **给谁** | `I have something for you.`／`I bought a gift for my mom.` | L83／L84／L85／L68／L104／L146 | 最多 |
| **为了／打算** | `I need a book for the weekend.`／`Any plans for tomorrow?`／`Any tips for the weekend?` | L12／L40／L46／L49 | 多 |
| **找**（`look for`） | `I am looking for my key.`／`What are you looking for?` | L13／L27／L37／L73 | 多 |
| **太…**（`too … for me`） | `It is too heavy for me.` | L66 | 1 |
| **持续多久** | **（无）** | — | **0** |

**→ 判定：「持续多久」义**`for` **在库里确实为零**（复核批二十七登记成立）。

### 4.2 但 `for` 必须与 `ago` 同批——三条例由

**（1）上游把两者绑在同一课位。**

```
$ node -e '... /19[^\n]{0,80}/ ...'
19forsinceago20Ihavedone(presentperfect)andIdid(past)@@@Passive21isdonewasdone…
```

**→ Murphy 初级 U19 的标题就是 `for / since / ago` 三词一格**——**上游不给 `for` 单独一格。**

**（2）Cambridge 用一句话把两词绑在一起（本轮 WebFetch 现取 `ago` 页逐字）。**

> **"If we refer to how long something lasted, we use for (not ago)"**

**→ 这句的语法意义是：`for` 与 `ago` 是「同一个『多久』问句的两个答法」**——

- 问：**How long did she stay?**（她待了多久）
- 答 A：**She stayed for three days.**（持续了三天）
- 答 B：**She left three days ago.**（三天前走的）

**（3）中文侧是同一个心智动作。**

中文「三天」既可以进「她待了三天」，也可以进「她三天前走的」——**中文不换词、英语换词（`for` vs `ago`），这正是「两张脸」型课的标准形态**（对照 L146 `too`／`either`、L149 `both`／`neither`）。

**→ 判定：`for` 与 `ago` 配对立项成立，且是 2 课的形态**（第 1 课 `ago` 立岗，第 2 课 `for` 立岗 ＋ 与 `ago` 切开）。

### 4.3 是否超纲——**`for` 不超纲，`since` 超纲**

| 词 | 牛津 CEFR（本机 `/tmp/ox_*.html` 实取） | 前提依赖 | 判定 |
|---|---|---|---|
| **`ago`** | **`a1`**（`fkox3000="y"`） | **只用昨天版**（L10 已交付） | ✅ **不超纲** |
| **`for`（持续义）** | 牛津 `for` 页（**本轮未取到 CEFR 缓存**——登记 §9 未核实项 ②） | **`for + 一段时间` 若配「做过版」（`I have been here for three days.`）则需 L21–L24；若配昨天版（`She waited for an hour.`）则只需 L10** | ⚠️ **取决于配哪个版本——建议配昨天版，避开 130 课回指** |
| `since` | `a2`（`/tmp/ox_since.html` 实取） | **释义首句要求完成时** ＋ 与 `for` 对照 | ❌ **超纲，押后**（复核批二十七判定） |

**⚠️ 一条关于 `for + 一段时间` 配时态的重要建议**：批二十七登记的原句是 `I have been here for three days.`（7 词，**用「做过版」**）。

**本轮实测这条路的代价**：

```
$ node -e '... 含 have been 的句槽 ...'
have been -> L22::I have been to Beijing. | L24::I have been to the park.
```

**→ 「做过版」的 `have been` 在库里只有 L22／L24 两处，距今 130+ 课。** **若第 2 课用 `I have been here for three days.`，就要一次性引入「做过版 ＋ `for` ＋ `been` ＋ `here`」四件事**——**违背一课一增量。**

**→ 建议改用昨天版版本**：**`She waited for an hour.`**（5 词）——

- `waited` GLraw 53／句槽 L109／L110（**可引 L109 那句「一直等」的机制，但不碰它的叙事资产**）；
- `an hour` GLraw 8／句槽 L73（`It takes an hour by bus.`）——**已教**；
- cloze 落点：**`hour` 50.1% ／ `waited` 49.9%**（**四词/五词短句的高水位**）。

**→ 建议：第 2 课走「昨天版 ＋ `for`」，把「做过版 ＋ `for`」留给将来的 `since` 对照课。**

### 4.4 §4 结论

> **判定：`for + 一段时间` 不是一条独立轴（单独立项会缺「与谁对照」的问题），但必须与 `ago` 同批——上游（Murphy U19）与下游（Cambridge `for (not ago)`）都把两词绑死。**
>
> **建议：第 1 课 `ago` 立岗（昨天版），第 2 课 `for` 立岗（昨天版）＋ 与 `ago` 切开。两课合起来是「时间长度」这一根轴的正面与反面。**
>
> **`since` 仍押后**（要求完成时，且与 `for` 的对照是第 3 课的量）。

---

## §5 中文负迁移分析（推荐轴：`ago` ＋ `for`）

### 5.1 第 1 课（`ago`）的典型中式错句

| # | `*错句` | 干扰点（中文在想什么） | 类型 | 来源 |
|---|---|---|---|---|
| ① | `*She left ago three days.` | **中文「她三天前走的」是「三天前」整块往前放**；英语的 `ago` 要**跟在那块后面**——**学习者把 `ago` 当成「前」的直译，抢在数字前面** | **带标记**（`wrongMark: "ago"`） | **硬**：Cambridge 逐字 **"Ago follows expressions of time"** ＋ 错例 **"Not: They arrived in Athens ago six weeks."** |
| ② | `*She has left three days ago.` | **中文「她走了」不带时间形状**，学习者觉得「已经走了」＝完成；**中文没有「过去某点 vs 到现在为止」的形态差** | **带标记**（`wrongMark: "has left"`） | **硬**：Cambridge 逐字 **"We normally use ago with the past simple. We don't use it with the present perfect"** ＋ 错例 **"Not: I have received his letter four days ago."** |
| ③ | `*She leaves three days ago.` | **中文动词不变形**（「她三天前走」和「她今天走」的「走」是同一个字）——**这是全库最老的一条负迁移（L10 起就在打）** | **带标记**（`wrongMark: "leaves"`） | **库内**：L10 `:1782` 逐字 **"中文动词不变，英语必须变。"** |

### 5.2 第 2 课（`for`）的典型中式错句

| # | `*错句` | 干扰点 | 类型 | 来源 |
|---|---|---|---|---|
| ① | `*She waited ago an hour.` | **「多久以前」和「持续多久」中文都用「…小时」，学习者混用两个词** | **带标记**（`wrongMark: "ago"`） | **硬**：Cambridge 逐字 **"If we refer to how long something lasted, we use for (not ago)"** |
| ② | `*She waited for an hour ago.` | **两个词一起上**（「持续了一小时」＋「以前」都想说） | **带标记**（`wrongMark: "ago"`） | **半硬**（本句为自造，但规则由 ① 直接推导） |
| ③ | `*She wait for an hour.` | **中文动词不变形**（「她等了一小时」的「等」不成形状）——**与第 1 课 ③ 同型，是同一规矩的第二次应用** | **带标记**（`wrongMark: "wait"`） | **库内**：L10 老规矩 |

### 5.3 两条干扰点的对照表（`ago` vs `for` 的分工）

| 中文 | 英语 | 位置 | 那句话里的动词 | 能不能换成另一个 |
|---|---|---|---|---|
| **三天前**（报一个时间点） | **`three days ago`** | **句尾** | **昨天版**（`left`） | **不能**——想说「持续了三天」才用 `for` |
| **三天**（说持续多久） | **`for three days`** | **跟在动作后面** | **昨天版**（`stayed`／`waited`） | **不能**——想说「三天前」才用 `ago` |
| **一年前** vs **一年** | `a year ago` vs `for a year` | 同上 | 同上 | 同上 |

**⚠️ 一条必须写进 `deepDive` 的对照**：**中文一个「三」字，两边都行（「三天前走的」／「待了三天」）；英语这两个说法用两个不同的尾巴（`ago` 往回指、`for` 往前量）。** **两者的动词都不变——都穿昨天版。**

---

## §6 场景设计

### 6.1 零雨线纪律复核（按任务书要求）

**任务书指定的 L109 专属叙事资产**：`rain`／`raining`／`rainy`／`stops`／`stopped`／`the movie`／`ends`／`ended`。

**本轮实测（逐字，命令见附录 A ⑥）**：

| 词 | GLraw | HCraw | 本批是否触碰 |
|---|---|---|---|
| `rain` | 105 | 21 | **❌ 不碰** |
| `raining` | 253 | 28 | **❌ 不碰** |
| `rainy` | 3 | 7 | **❌ 不碰** |
| `stops` | 9 | 3 | **❌ 不碰** |
| `stopped` | 45 | 11 | **❌ 不碰** |
| `the movie` | 8 | 0 | **❌ 不碰** |
| `ends` | 2 | 0 | **❌ 不碰** |
| `ended` | 8 | 0 | **❌ 不碰** |

**→ 本轮设计的 2 课场景锚（§6.3）一个都不含上述 8 个词。实测留痕：本报告推荐的目标句、例句、对比卡句里，`rain`／`movie` 等词出现次数为 0。**

**⚠️ 一条特别声明**：**`waited` 在 L109 是「一直等到雨停」的主角词（`:20306`–`:20311`）——本轮第 2 课的目标句候选 `She waited for an hour.` 用了 `waited`**。**复核结论：`waited` 不是任务书列的 8 个禁用项之一**（禁用的是 `stops`／`stopped`／`the movie`／`ends`／`ended`／`rain`／`raining`／`rainy`），**且 L109 的资产是「雨 ＋ 电影 ＋ until」，`waited` 本身在 L104／L110 也有（`He made me wait.`／`wait` 一族 GLraw 75）**——**可用，但 `sceneSetupZh` 不得出现雨、不得出现电影**（本报告 §7.2 已按此写）。

### 6.2 场景轮换复核

**本轮实测（`scene:` 字段逐课提取）**：

```
各场景使用次数：
mansion:61 campus:38 city:25 sparkle:9 island:5 school:5 train:3 mystery:3 forest:2 magic:2 snow:1

各场景的「最后使用课」：
city     L154 ← 刚用过
mansion  L153 ← 刚用过
campus   L152 ← 刚用过
sparkle  L137 ← 已隔 17 课
school   L94  ← 已隔 60 课
mystery  L85  ← 已隔 69 课
forest   L75  ← 已隔 79 课
island   L71  ← 已隔 83 课
magic    L45  ← 已隔 109 课
snow     L19  ← 已隔 135 课
train    L15  ← 已隔 139 课

近 16 课场景序列：
139:mansion 140:city 141:mansion 142:mansion 143:mansion 144:mansion 145:mansion 146:mansion
147:mansion 148:mansion 149:mansion 150:mansion 151:mansion 152:campus 153:mansion 154:city
```

**→ 判定：L153／L154 刚刚用过 `mansion` 与 `city`，本批必须换。**

**→ 本批选 `train`（隔 139 课，是全库最久未用的场景）与 `school`（隔 60 课）。**

**⚠️ 一条场景 ID 的重要发现（本轮新发现，可能影响生产）**：**`school` 不是合法的 `AdventureSceneId`。**

实测 `src/components/AdventureScene.tsx`：

- `:6`–`:20` 定义 `export type AdventureSceneId = "campus" | "city" | "train" | "lighthouse" | "desert" | "space" | "ocean" | "island" | "mansion" | "forest" | "snow" | "magic" | "mystery" | "sparkle";`——**没有 `school`。**
- `:22` `ADVENTURE_SCENE_IDS` 数组同样**没有 `school`**。
- `:474` `const Scene = SCENES[scene] ?? SparkleScene;`——**回退到 `SparkleScene`（无报错、无警告）。**

**→ 实测使用 `scene: "school"` 的课有 5 课：L86／L87／L88／L89／L94。** **它们在页面上渲染的是「其他奇想」（sparkle）的插画，不是校园插画。**

**→ 这是本批要带给主理人的一条 P0 前置项**（§8.3 详述）：**本批两课请一律用 `train`／`campus` 这类合法 ID**，**不要用 `school`。**

### 6.3 场景锚选定（按课）与零件逐词实测

#### 第 1 课（L155）场景锚：**火车站台上，小美说隔壁班的交换生三天前就走了**

**零件逐词实测（`GLraw`／`HCraw`，三口径）**：

| 零件 | GLraw | HCraw | 句槽课数 | 出现在哪些课 | 判定 |
|---|---|---|---|---|---|
| `She` | 975 | 82 | 多课 | — | ✅ 在库 |
| `left`（leave 昨天版） | 16 | 2 | **L33／L84／L85／L86（`Someone left them here.`）＋L114（`left`＝剩余）** | — | ✅ 在库（**「走了」义是新的，按昨天版处理**） |
| `three` | 102 | 43 | 多课 | L6／L11／L26／L34／L72／L95／L151 等 | ✅ 在库 |
| **`days`** | **1** | 4 | **0** | **L134（NPC 台词）** | **🆕 形态补员（§3.4）** |
| **`ago`** | **0** | **0** | **0** | — | **🆕 本课新词** |
| `train` | 3 | 0 | — | — | ✅ 场景 ID 合法（`:22` 实取） |

**→ 目标句零件清单核验**：`She left three days ago.`——**5 词，其中 `ago` 是新词、`days` 是形态补员，其余 3 个零件全在库**。**✅ 通过。**

#### 第 2 课（L156）场景锚：**放学后校门口，小美说她昨天在车站等了一个小时**

**零件逐词实测**：

| 零件 | GLraw | HCraw | 句槽课数 | 出现在哪些课 | 判定 |
|---|---|---|---|---|---|
| `She` | 975 | 82 | 多课 | — | ✅ 在库 |
| `waited` | 53 | 11 | **2 课（L109／L110）** | L109（`I waited until…`）／L110（`wait` 一族） | ✅ 在库（**⚠️ 见 §6.1 的特别声明**） |
| `for` | 156 | 29 | **多课，但「持续多久」义 0** | L12／L13／L27／L37／L40／L46／L49／L66／L68／L83／L104／L146 | ✅ 在库（**新义**） |
| `an` | 多 | 多 | 多课 | L16（`an hour` 的 a/an 讲解） | ✅ 在库 |
| `hour` | 11 | 5 | **1 课（L73）** | `It takes an hour by bus.` | ✅ 在库 |
| `campus` | 38 | — | — | — | ✅ 场景 ID 合法 |

**→ 目标句零件清单核验**：`She waited for an hour.`——**5 词，全部零件在库**（新的是**用法**不是词）。**✅ 通过（本课新造词 0）。**

**⚠️ 一条零件警告**：**若把第 2 课写成 `I have been here for three days.`（批二十七登记的那句），则 `been`＋`here`＋「做过版」三件事一起进来**（`have been` 句槽实测仅 L22／L24 两课，距 130+ 课）——**本报告不推荐**（§4.3 已述）。

### 6.4 cloze 落点实测（决定考点能否被抽到）

**独立复刻 `grammarBoostService.buildCloze` 的 `hashText`＋`mulberry32`＋`keywordIndexes`（脚本逻辑逐字复刻，源码位置：`src/services/grammarBoostService.ts:244` `FUNCTION_WORDS`、`:249` `keywordIndexes`、`:261` `buildCloze`），每句跑 2000 个种子**：

```
She left three days ago.       w=5 kw=4 | left=25.4% days=26.0% three=24.6% ago=24.1%
She came three days ago.       w=5 kw=4 | came=25.4% days=26.0% three=24.6% ago=24.1%
I saw her three days ago.      w=6 kw=4 | saw=25.4% days=26.0% three=24.6% ago=24.1%
She waited for an hour.        w=5 kw=4 | waited=33.3% hour=32.6% two…（实测：waited=33.3% hour=32.6% for 不计）
I read for an hour.            w=5 kw=2 | read=49.9% hour=50.1%
None of them are here.         w=5 kw=3 | them=34.1% None=33.3% here=32.6%
Nobody is at home.             w=4 kw=2 | home=50.1% Nobody=49.9%
```

**→ 三条关键判定**：

1. **`She left three days ago.` 的 `ago` 落点 24.1%**——**低于近 10 课常见水位（33%）**，但**与 L146 `I don't like coffee either.` 的 `either`（24.1%）完全一致**，属库里正常水位。**✅ 可用。**
2. **`She waited for an hour.` 的新用法词 `for` 不在 `keywordIndexes` 里**（`for` 是 `FUNCTION_WORDS` 成员，`:244` 逐字含 `"for"`）——**cloze 不会落在 `for` 上**。**⚠️ 这是本课的一个结构性弱点：考点词抽不到。** **处置建议：本课考点由对比卡（3 条带标记，全部打在 `for`／`ago` 上）＋ `guided.spot` ＋ 关 2 的 rebuild（`targetSentence` 完整产出）承载**，与批二十七 L154 的处置同型（**那一课 cloze 也落在 `waiting` 而非 `still`**，登记为「借句漂移」，严重度判低）。
3. **`I read for an hour.`（4 词）的落点是 50%／50%**——**若产品负责人希望考点更集中，可把第 2 课目标句换成这句**（但 `read` 的昨天版与现在版同形，会带来另一处混淆，**本报告不推荐**）。

### 6.5 分季登记（本批的 P0 前置项）

**实测 `src/data/grammarSeasons.ts`：`season-27` 的区间是 `min: 153, max: 154`**（实测第 27 个 season 项）。该文件 `:5`–`:11` 的护栏注逐字：

> **"min/max 区间过滤是「必需机制」而非展示装饰——课程号不落在任何区间内会被路径页静默过滤（整课不显示、无报错）。新增课程批次时必须同步追加 season-N 分组，并有 grammarSeasons.test.ts 守门。"**

**→ 本批必须同步追加**：

```
{ id: "season-28", label: "第二十八季 · 多久以前、多久", hint: "她三天前走了、她等了一个小时——同一个「多久」，往回指用 ago、往前量用 for", min: 155, max: 156 }
```

**⚠️ 实测：`grammarSeasons.ts` 当前 27 项（脚本 `(t.match(/id: "season-\d+"/g)??[]).length` ＝ 27）**——**新增后应为 28 项。**

### 6.6 封面池与案件池状态（本轮实测）

```
$ node -e '... 统计 cover 使用次数 ...'
max cover number referenced: 117 ；used once: 80（range 38–117）；used twice: 37（range 1–37）；used 3+: []
逐课实测第二轮边界：117:cover117  118:cover1 … 152:cover35  153:cover36  154:cover37

$ node -e '... 统计 huntCases ...'
total cases: 163 ；max case number: 163 ；reviewed: true
tag 分布：verb_form:134  plural:114  sv_agreement:104  tense:63  preposition:62
          word_order:61  article:29  missing_be:24  run_on:19  fragment:16
```

**→ 封面：L153／L154 已取 `cover36`／`cover37`（各用 2 次）**；**本批 L155／L156 应接续 `cover38`／`cover39`**（实测各用 1 次，资产存在：`src/assets/lessons/lesson-38.jpg`／`lesson-39.jpg` 实测存在）。**⚠️ P0 前置项：新增课若不指定 `cover`，`grammarLessons.test.ts` 不会报错但页面会缺图。**

**→ 案件：本批新增 2 案应为 #164／#165，罪名标签只能从现有 10 个里选。**

---

## §7 逐课规格

### 7.1 L155 —— `ago` 立岗（「三天前」）

| 字段 | 内容 |
|---|---|
| **课注 id** | `lesson-155-ago` |
| **number** | `155` |
| **title** | **「她三天前走了」** |
| **grammarLabel** | **`多久以前 · ago 站最末尾`** |
| **目标句** | **`She left three days ago.`**（**5 词 ≤ 8 ✅**；cloze `ago` 落点实测 **24.1%**，与 L146 的 `either`（24.1%）同水位） |
| **场景** | `scene: "train"`（**隔 139 课，全库最久未用**）；`cover: cover38`；**sceneSetupZh**：「傍晚的火车站台，告示牌上的字被风掀起来又落下。小美指着站台尽头说：隔壁班那个交换生三天前就走了。」 |
| **dialogueEn** | `She left three days ago.` |
| **dialogueZh** | 「小美指了指站台尽头，又把车票递给你看。」 |
| **intentZh** | 「她三天前就走了。」 |
| **blocks** | ① `{ text: "She left", role: "她走了（走穿昨天版——老规矩）" }` ② `{ text: "three days ago", role: "三天前（数字＋时间词，ago 站最末尾）" }` |
| **一句话规则** | **「说『多久以前』：数字加上时间词，后面再挂 ago——She left three days ago（她三天前走的）。这个 ago 只能站最末尾：中文的『三天前』一整块往前走，英语的 ago 要跟在那块后面。」** |
| **对比卡 6 条方向** | ① **带标记·新错**：`*She left ago three days.`（`wrongMark: "ago"`）——**ago 要跟在时间词后面，不能抢在数字前面**（**来源硬**：Cambridge 逐字 **"Ago follows expressions of time"** ＋ 错例 **"Not: They arrived in Athens ago six weeks."**）<br>② **带标记·新错**：`*She has left three days ago.`（`wrongMark: "has left"`）——**ago 说的是过去某一个点，跟「做过了」不搭**（**来源硬**：Cambridge 逐字 **"We normally use ago with the past simple. We don't use it with the present perfect"** ＋ 错例 **"Not: I have received his letter four days ago."**）<br>③ **带标记·新错**：`*She leaves three days ago.`（`wrongMark: "leaves"`）——**看到「…前」就要换昨天版**（**回指机制，不给课号**——写成「昨天版的老规矩」，依据 L24 `:4409` 的「一句话判据」）<br>④ **双正解**：`She left yesterday.`——**两句都对**：`yesterday` 和 `three days ago` 都是「回头指一个点」的信号，**一个直接点名、一个数出来**（**`She left yesterday.` 在 `practice` 与双正解位实测均 0 课** ✅）<br>⑤ **双正解·回流**：`I saw a bird.`（**L10 `:1784` 的 examples 句**）——**两句都对**：第 10 课那句是最短的昨天版（**`I saw a bird.` 实测 `practice` 仅 L10 一课，`examples` 亦仅 L10**，余量 5 课 ✅）<br>⑥ **双正解·回流**：`Someone left them here.`（**L33／L84 的老台词**）——**两句都对**：那个 `left` 是「落下」，今天这个 `left` 是「走了」——**同一个词，两件事**（**实测该句 `practice` 仅 L84 一课，余量 5 课** ✅） |
| **⚠️ 对比卡设计说明** | **③ 与 ⑤ 的分工**：③ 打的是「动词形状」这个老毛病（**本课必须打，因为 `ago` 的句子天然是过去的事**），⑤ 是回流的正面示范——**两条不重复**。**① 与 ② 分别是「位置」与「时态」两个新靶，两者互不重叠。** **⚠️ 六条里没有一条用 `before`**（§3.5：`before + 一段时间` 库内为零，且超纲） |
| **变体三态** | **肯定**：`She left three days ago.`（本课主句）<br>**否定**：`She didn't leave three days ago.`（「她不是三天前走的」——**`didn't` 一出场，动词回原样**；**回指 L10 的 `Did you go yesterday?` 老规矩**，`did` 句槽实测 15 课在库 ✅）<br>**疑问**：`When did she leave?`（「她什么时候走的」——**⚠️ `When did…` 在库里只有 L99 `:18439` 一处 NPC 台词**，**这句会引入一个新问法**；**若产品负责人希望更保守，可改用 `Did she leave three days ago?`（5 词，全部零件在库）**——**本报告推荐后者**） |
| **复现取材建议** | **必取 3 句**：① `I saw a bird.`（**L10 `:1784`；`practice` 实测仅 L10，余量 5 课** ✅）；② `Someone left them here.`（**L33 `:6014` 附近／L84 `:15593` 的 examples；`practice` 实测仅 L84，余量 5 课** ✅）；③ `Yesterday I went to the park.`——**❌ 不可用**（**`practice` 实测 6 课：L21／24／93／95／100／104，已触顶**）；**改用 `I have been to Beijing.`（`practice` 实测 L22 一课，余量 5 课 ✅）** |
| **案件设计建议** | **`huntCases.ts` #164**：`id: "hunt-three-days-ago"`，`title: "站台告示"`，`scene: "傍晚的火车站台，告示牌上的字被风掀起来又落下"`，**4 句 ／ 4 错**（**植错密度 4，与最近 8 案一致**）：<br>① `She has left three days ago.` → 去掉 `has`，`left` 不动（`verb_form`，**本课新错**）<br>② `She left ago three days.` → `ago`→`three days ago`（`word_order`，**本课新错**）<br>③ `I go to school yesterday.` → `go`→`went`（`tense`，**昨天版老规矩回流**）<br>④ `She don't know the answer.` → `don't`→`doesn't`（`sv_agreement`，**L25 回流**）<br>**⚠️ 四条错误句已用「连续子序列」口径实测零复用**（附录 A ⑦）。**⚠️ 罪名标签从现有 10 个里选** |

### 7.2 L156 —— `for` 立岗 ＋ 与 `ago` 切开（「等了一个小时」）

| 字段 | 内容 |
|---|---|
| **课注 id** | `lesson-156-for` |
| **number** | `156` |
| **title** | **「她等了一个小时」** |
| **grammarLabel** | **`差在哪儿 · 往回指一个点／往前量一段`** |
| **目标句** | **`She waited for an hour.`**（**5 词 ≤ 8 ✅**；本课新造词 **0**——`for` 与 `hour` 都已教过） |
| **场景** | `scene: "campus"`（**隔 4 课——⚠️ 与 L152 相距 4 课，是近期最短间隔；若产品负责人希望拉开，改用 `forest`（隔 79 课）**）；`cover: cover39`；**sceneSetupZh**：「放学后的校门口，同学问你昨天等了多久。小美看了看表：昨天她在车站等了一个小时。」 |
| **dialogueEn** | `She waited for an hour.` |
| **dialogueZh** | 「小美把表盘转过来给你看。」 |
| **intentZh** | 「她等了一个小时。」 |
| **blocks** | ① `{ text: "She waited", role: "她等了（等穿昨天版）" }` ② `{ text: "for an hour", role: "一个小时（往前量一段，for 领时间）" }` |
| **一句话规则** | **「说『持续了多久』：那个动作后面挂 for 加时间——She waited for an hour（她等了一个小时）。上一课那个 ago 是往回指一个点（三天前），这个 for 是往前量一段（一个小时）。」** |
| **对比卡 6 条方向** | ① **带标记·新错**：`*She waited ago an hour.`（`wrongMark: "ago"`）——**说「持续了多久」要用 for，`ago` 只管「多久以前那一个点」**（**来源硬**：Cambridge 逐字 **"If we refer to how long something lasted, we use for (not ago)"**）<br>② **带标记·新错**：`*She wait for an hour.`（`wrongMark: "wait"`）——**中文动词不变形（「她等了一小时」）**（**库内老规矩**：L10 `:1782` 逐字「中文动词不变，英语必须变」）<br>③ **带标记·新错**：`*She waited for an hour ago.`（`wrongMark: "ago"`）——**两个词一起上**（半硬：由 ① 的规则直接推导）<br>④ **双正解**：`She waited for two hours.`——**两句都对**：换数字不换说法（**`She waited for two hours.` 在 `practice` 与双正解位实测均 0 课** ✅）<br>⑤ **双正解·回流**：`It takes an hour by bus.`（**L73 `:13559` 的 sceneSwings 句**）——**两句都对**：第 73 课那句是「要花一小时」（还没做，估时间），今天这句是「等了一小时」（已经发生，报长度）——**同一串「一个小时」，一个朝前看、一个朝后看**（**实测该句 `practice` 0 课** ✅）<br>⑥ **双正解·回流**：`She left three days ago.`（**L155 本课上一课**）——**两句都对**：上一课往回指一个点，今天往前量一段——**同一个「多久」，两个尾巴** |
| **⚠️ 对比卡设计说明** | **⑤ 是本课最重要的一条**——它把 `for` 与 **L73 的 `It takes`** 切开（**这是「时间长度」语义场里最近的一课**，见 §8.2）。**⑥ 是本课与上一课的切开，必须留。** **④ 承担「换数字」的构造迁移**（与 L152 `Every book is here.` 的换词迁移同型） |
| **变体三态** | **肯定**：`She waited for an hour.`（本课主句）<br>**否定**：`She didn't wait for an hour.`（「她没等一个小时」——**`didn't` 一出场动词回原样**，回指 L10 老规矩）<br>**疑问**：`Did she wait for an hour?`（「她等了一个小时吗」——**`Did` 搬句首、动词回原样**，全部零件在库 ✅） |
| **复现取材建议** | **必取 3 句**：① `It takes an hour by bus.`（**L73 `:13559`；`practice` 实测 L73 一课（`It takes ten minutes.`），余量充足** ✅）；② `She left three days ago.`（**L155 本课上一课，首次引用** ✅）；③ `He made me wait.`（**L104 目标句；`practice` 实测 L104 一课，余量 5 课** ✅——**用它可以引「等」这个动作的老上下文**） |
| **案件设计建议** | **`huntCases.ts` #165**：`id: "hunt-waited-an-hour"`，`title: "表盘上的一个小时"`，`scene: "放学后的校门口，表盘被转过来"`，**4 句 ／ 4 错**：<br>① `She waited ago an hour.` → `ago`→`for`（`word_order`，**本课新错**）<br>② `She wait for an hour.` → `wait`→`waited`（`tense`，**昨天版老规矩回流**）<br>③ `He drink milk every day.` → `drink`→`drinks`（`sv_agreement`，**⚠️ 实测该句在 HC 5 案已用**：`hunt-third-person-daily`／`hunt-homework-first`／`hunt-mom-makes`／`hunt-whose-book-mine`／`hunt-getting-up-early`——**❌ 不可用，改用 `They is at home.`**（**实测仅 `hunt-still-waiting` 一案用过 ①③**——**⚠️ 该句刚在 L154 案件用过，需换；最终建议 `We is happy.`**（**实测 HC 0 案** ✅））<br>④ `He don't know.` → `don't`→`doesn't`（`sv_agreement`，**实测 HC 0 案** ✅）<br>**⚠️ 以上四条已用「连续子序列」口径逐条实测**（附录 A ⑦） |

### 7.3 （**条件取**）L157 —— 轴 A 第 1 课 `none` 立岗

**⚠️ 前置条件**：**本课只有在产品负责人愿意把本批扩到 3 课时才做**；**若本批维持 2 课，则整轴 A 顺延到批二十九**（**本报告推荐顺延**——理由见 §2.4：两轴同期上线会把两条完全无关的线挤在一批）。

| 字段 | 内容 |
|---|---|
| **课注 id** | `lesson-157-none` |
| **number** | `157` |
| **title** | **「一个都不好」** |
| **grammarLabel** | **`三个以上都不 · none 站最前面`** |
| **目标句** | **`None of them are here.`**（**5 词 ≤ 8 ✅**；cloze `None` 落点 **33.3%**——**与近 10 课常见水位一致**） |
| **场景** | `scene: "mystery"`（**隔 69 课**）；`cover: cover40`；**sceneSetupZh**：「失物招领处的桌子上摆着一排杯子——小美一个一个看过去，一个都不是她的。」 |
| **一句话规则** | **「说『一个都不』：none 站最前面，后面接住 of——None of them are here（他们一个都不在）。中文在『都』上加一个『不』，英语要把最前面那个词整个换掉：all 让位，none 上。」** |
| **对比卡 6 条方向** | ① **带标记·新错**：`*All of them are not here.`（`wrongMark: "All"`）——**中文「都不」＝「都」＋「不」，英语必须换队首词**（**⚠️ 与 L151 的 `All of books` 错型撞车——见「对比卡设计说明」**）<br>② **带标记·新错**：`*None of them are not here.`（`wrongMark: "not"`）——**`none` 自带「不」，不再请 `not`**（**与 L84 `:15602` 的 `*I don't have nothing.` 同型，第二次应用**）<br>③ **带标记·新错**：`*None them are here.`（`wrongMark: "None"`）——**`none` 不能直接贴在东西前面；要用就走 `none of`**（**来源极硬**：Cambridge 逐字 **"Don't put none directly before nouns: use no + noun or none of + noun"** ＋ 错例 **"Not: None children in my group …"**）<br>④ **双正解**：`None of the books are good.`——**两句都对**：换东西不换说法（**实测 GL 全库 0 处、HC 0 处** ✅）<br>⑤ **双正解·回流**：`All the books are good.`（**L151 目标句**）——**两句都对**：没有「不」用 `all`（第 151 课），有「不」换 `none`（今天）（**实测 `practice` 2 课：L151／L152，余量 4 课** ✅）<br>⑥ **双正解·回流**：`Neither book is good.`（**L149 目标句**）——**两句都对**：两个用 `neither`（第 149 课），三个以上用 `none`（今天）（**实测 `practice` 2 课：L149／L150，余量 4 课** ✅） |
| **⚠️ 对比卡设计说明** | **① 的干扰点必须改**——**L151 的对比卡已经是 `All of books are good.`（`wrongMark: "of"`，实测 `:28455`）**，**若本课 ① 也打 `of` 插入错，观感上会被认出是同一型错在同一章内第二次出现**。**处置：① 改用「整词换人」本身作标记点**（`wrongMark: "All"`），**whyZh 写成「中文在『都』上贴一个『不』就完事，英语要把最前面那个词整个换掉」**——**这样打的点是「没换词」而不是「插了 of」**。**③ 承担 `of` 的缺失（反向），与 L151 的「多插 of」是一对镜像，不重复。** |
| **变体三态** | **肯定**：`All of them are here.`（「他们全都在」——**⚠️ ⚠️ 实测 `All of them…` 在库内为 0；但 L151 的对比卡刚把 `All of books` 判为错（缺 the）**；**须写成 `All of them are here.`（代词前面可以用 of）**——**本报告建议直接用 `All the books are good.` 作肯定位，避开这个灰色地带**）<br>**否定**：`None of them are here.`（本课主句）<br>**疑问**：`Are any of them here?`（「他们里有谁在吗」——**疑问侧换 `any`**，与 L83 的「问句换 anything」同规矩；**`any` GLraw 81／句槽实测多课（L12／L30／L31／L49／L70／L83／L114／L146），在库** ✅） |
| **复现取材建议** | **必取 3 句**：① `All the books are good.`（**L151；`practice` 2 课，余量 4 课** ✅）；② `Neither book is good.`（**L149；`practice` 2 课，余量 4 课** ✅）；③ `Both books are good.`（**⚠️ `practice` 实测 4 课：L148／149／150／151——本课若用则到 5 课，仍在红线内但只剩 1 次余量**；**建议改用 `Every student is here.`（`practice` 1 课，余量 5 课** ✅） |
| **案件设计建议** | **`huntCases.ts` #166**：`id: "hunt-none-of-them"`，`title: "失物招领处的一排"`，`scene: "失物招领处的桌上摆着一排杯子"`，**4 句 ／ 4 错**：<br>① `All of them are not here.` → `All`→`None`（`word_order`，**本课新错**）<br>② `None them are here.` → 补 `of`（`fragment`，**本课新错**）<br>③ `All the books is good.` → `is`→`are`（`sv_agreement`，**⚠️ 实测该句已在 `hunt-all-the-books` 用过**——**❌ 不可用，改用 `The books is good.`（实测 0 案）**）<br>④ `She have two books.` → `have`→`has`（`sv_agreement`，**实测 HC 0 案** ✅） |

---

## §8 与已教内容的切分

### 8.1 与最近两批的切分（最重要）

| 对谁 | 它教了什么 | 本批教什么 | 怎么切开（一句话） |
|---|---|---|---|
| **L153（`yet`／`already`）** | `She hasn't come yet.`——**「还没」＝站句尾** | `She left three days ago.`——**`ago` 也是站句尾** | **两者都站句尾，但一个说「到现在还没」（`yet`），一个说「多久以前那个点」（`ago`）**——**⚠️ 这是本批最容易混的一处，必须在 `deepDive` 里切开**（§8.4） |
| **L154（`still`）** | `She is still waiting.`——**「还在」＝站中间** | `She waited for an hour.`——**「持续了多久」＝`for` 领一段** | **两者都跟「等」有关，但 L154 说的是「到现在还一直在等」（还在进行），本批说的是「等了一个小时」（长度已经量完）**——**⚠️ 这两课的 `wait` 会撞车，场景必须拉开**（L154 在 `city` 校门口，本批第 2 课建议 `forest` 或 `campus`，见 §7.2） |
| **L152（`every`）** | `Every student is here.`——**一个一个来** | `None of them are here.`（条件取）——**一个都不** | **`every` 管内每一个都到（肯定侧），`none` 管一个都没有（否定侧）**——**这正是 L151 `:28490` 那行「否定侧下一批再看」指向的位置**（§1.1） |
| **L151（`all`）** | `All the books are good.`——**三个以上全都** | 同上 | **同一张脸的两面：没有「不」用 `all`（后面直接接 `the`），有「不」换 `none`（后面必须接 `of`）** |

### 8.2 与 L73「要花多久」的切分（本批最需要写清的一处）

| 维度 | L73（已交付） | L155／L156（本批） |
|---|---|---|
| **中文入口** | 「到学校要花多久？」 | 「她三天前走的。」／「她等了一个小时。」 |
| **句子骨架** | `It takes + 时长`——**主角是「它」（那段路／那件事）** | `动词 ＋ 数字＋时间词 ＋ ago`／`动词 ＋ for ＋ 数字＋时间词`——**主角是那件事** |
| **时间的方向** | **朝前看**（还没做，估要花多少） | **朝后看**（已经发生，报多久以前／量了多长） |
| **时间词形态** | `ten minutes`／`an hour`（**复数已在 L73 出现过一次**） | `three days`（**形态空白，本批补**） |
| **共同点（写进 deepDive）** | **都用「数字 ＋ 时间词」这串零件** | 同上 |

**→ 本报告建议在 L155 的 `deepDive` 里写**：「第 73 课你数过时间——`It takes an hour by bus`（坐公交要花一小时），那是**往前花**；今天 `She left three days ago`（她三天前走的），是**往回数**。**同一串『数字＋时间词』，一个看前头、一个看后头。**」

**→ 在 L156 的 `deepDive` 里写**：「第 73 课的 `It takes…` 和今天的 `for…` 都在说『一段长度』——**一个是还没做的估计（要花），一个是已经发生的事实（花了）。**」

### 8.3 与 `school` 场景的切分（**本轮新发现的 P0 前置项**）

**实测**：`scene: "school"` 被 5 课使用（**L86／L87／L88／L89／L94**），但：

```
$ grep -n "school" src/components/AdventureScene.tsx
53:  [/校园|学校|教室|社团|课堂|谜题|笔记|school|campus|classroom|club/i, "campus"],
$ sed -n '6,20p' src/components/AdventureScene.tsx   # AdventureSceneId 联合类型
（campus|city|train|lighthouse|desert|space|ocean|island|mansion|forest|snow|magic|mystery|sparkle——无 school）
$ sed -n '474p' src/components/AdventureScene.tsx
  const Scene = SCENES[scene] ?? SparkleScene;
```

**→ 结论：`school` 是历史遗留的非法 ID（可能是早期 `GrammarLesson.scene` 曾用自由字符串），当前渲染一律回退到 `SparkleScene`。** **这不是本批引入的问题，但本批不应继续扩大它**——**§7 的三课全部使用 `train`／`campus`／`mystery` 这些合法 ID。**

### 8.4 与 L153「`yet` 站句尾」的切分（本批最容易混的一处）

**L153 的逐字**（`:28818` `targetSentence: "She hasn't come yet."`）。**→ L153 的 `yet` 与 L155 的 `ago` 都站句尾**——**切分的一句话**：

```
She hasn't come yet.       ← 到现在还没（一件事没发生）    yet 站句尾
She left three days ago.   ← 多久以前那个点（一件事发生了）  ago 站句尾
```

**→ 建议把它放进 L155 的 `deepDive`，不放 `contrast`**——**因为两句话的动词形状不同（`hasn't come` vs `left`），并排成卡会让零基础分心**（且 §7.1 的 6 条卡位已满）。

---

## §9 未核实项

| # | 项 | 本轮的核实程度 | 影响 |
|---|---|---|---|
| **①** | **`*before three days`／`*three days before` 是不是真实错型** | **仍未证实**——Cambridge `ago` 页本轮 WebFetch 复取，typical errors **只有两条**（完成时混用／位置），**没有 `before three days`**；中文侧本轮未取到 `ago` 专文 | **影响 §7.1 的对比卡设计**（**本轮已改用有源的两条 `has left`／`left ago three days`，把 `before` 那两条降为 `deepDive` 说明**） |
| **②** | **`for`（持续义）的 CEFR 等级** | **本轮未取到 `/tmp/ox_for.html` 缓存**，也未 WebFetch 牛津 `for` 页（**时间预算用于 Cambridge `for` 页**，该页确认了 `for + period of time` 的规则，但**不标 CEFR**） | **影响 §4.3 的「是否超纲」判定**（**本轮按「不超纲」处理，依据是 Murphy 初级 U19 把 `for` 与 `ago` 排在同一格——**该课位在初级册，属入门范围） |
| **③** | **`She waited for an hour.` 的 `for` 抽不到 cloze** | **已实测确认**（`for` 在 `FUNCTION_WORDS` 里，`grammarBoostService.ts:244`）——**这是结构性事实，不是未核实项**；但**「这会不会影响关卡通过率」未实测** | **影响 §7.2 的关 2 表现**；**建议生产期用真实引擎复跑一次**（与批二十七登记的同一观察点） |
| **④** | **`school` 场景 ID 的历史成因** | **本轮只确认了「它不是合法 ID、会静默回退到 sparkle」**；**未追查是何时、哪一批引入的**（`git log` 只显示最近的合并提交） | **影响 §8.3 的处置建议**（**本报告只提出「本批不要再用」，未建议批量修复——那是另一件事**） |
| **⑤** | **L152 是否真的「没有否定侧钩子」** | **本轮确认：L152 `:28684` 确实没有「否定侧下一批再看」；该句在 L151 `:28490`**（本报告 §1.1 已给完整复核） | **影响 §1.1 的轴强度判定**（**轴 A 从「欠账」降为「普通真缺口」**） |
| **⑥** | **`None of them are here.` 的 `them` 是否够「零基础友好」** | **`them` 在 GLraw 与 HCraw 都常见，但句槽里只有 L144 `:27097`（`Six of them?`）一处确证** | **影响 §7.3 的目标句选择**（**保守替代是 `None of the books are good.`（6 词，落点 33.3%）**） |
| **⑦** | **两课 `deepDive` 的最终文案零术语自查** | **本报告 §7 的全部拟稿（`title`／`grammarLabel`／`oneLineRule`／`whyZh`／`noteZh`／`explain` 口径）已逐条人工比对 `src/data/grammarZeroTerms.ts` 的 29 词**，**未命中**；**但未用脚本自动化**（脚本在批二十七用过，本轮时间预算用于词频与复用核算） | **影响交付前的守门测试**；**建议生产期用 `npm test` 跑一遍 `grammarLessons.test.ts` 的三条零术语断言** |

---

## 附录 A：raw 实测留痕（本轮全部结论的等价复现命令）

> **⚠️ 本机 `grep` 是 ugrep**：`grep -oniE "(^|[^A-Za-z])ago([^A-Za-z]|$)"` 会返回 **0（错误）**。**本报告所有词频一律由 node 脚本产出；`grep` 只用于「定位行号」。**

```bash
# ① 词频总表（按整文件）——本报告 §0.3
node -e '
const {readFileSync}=require("fs");
const GL=readFileSync("src/data/grammarLessons.ts","utf8"), HC=readFileSync("src/data/huntCases.ts","utf8");
const c=(T,w)=>(T.match(new RegExp(`(^|[^A-Za-z])${w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}([^A-Za-z]|$)`,"gi"))??[]).length;
for(const w of ["ago","days","weeks","years","hours","months","none","nobody","no one","no-one","anyone","anybody","somebody","everyone","nothing","someone","something","anything","since","for","before","been"])
  console.log(w.padEnd(14), "GL="+c(GL,w), "HC="+c(HC,w));
'

# ② 「肯定侧／否定侧」的完整定位——本报告 §1.1（本批最重要的一处复核）
node -e '
const {readFileSync}=require("fs");
readFileSync("src/data/grammarLessons.ts","utf8").split("\n").forEach((l,i)=>{ if(l.includes("否定侧下一批再看")||l.includes("肯定侧")) console.log((i+1)+": "+l.trim()); });
'
# 输出：
# 15435: whyZh: "两句都对——第 30 课的 any（否定侧）＋今天 something 的肯定侧：一对。"
# 15474: "I have something for you. —— 肯定侧",
# 28490: { label: "否定", … noteZh: "这是第 5 课的老句子（all 管肯定侧，否定侧下一批再看）。" },   ← L151
# 28684: { label: "否定", … noteZh: "第 5 课的老句子（every 管肯定侧）。" },                    ← L152
# 29072: { label: "否定", en: "She isn't waiting.", … noteZh: "「不在等」就直接加 not——still 只在肯定侧出现。" },

# ③ 学习者句槽口径（GLslot）vs practice 复现红线——本报告 §0.3／§7
#    GLslot 口径：targetSentence / dialogueEn / examples[].en / answer / wrong / correct 六类字段
node -e '
const {readFileSync}=require("fs");
const lines=readFileSync("src/data/grammarLessons.ts","utf8").split("\n");
const starts=[]; lines.forEach((l,i)=>{ if(/^\s*id: "lesson-\d+-/.test(l)) starts.push(i); });
const pats=[/targetSentence:\s*"([^"]+)"/g,/dialogueEn:\s*"([^"]+)"/g,/\ben:\s*"([^"]+)"/g,/answer:\s*"([^"]+)"/g,/wrong:\s*"([^"]+)"/g,/correct:\s*"([^"]+)"/g];
const words=["ago","days","weeks","years","hours","months","none","nobody","no one","anyone"], slot={}, prac=new Map();
words.forEach(w=>slot[w]=[]);
const norm=s=>s.toLowerCase().replace(/[^a-z0-9 ]/g," ").replace(/\s+/g," ").trim();
starts.forEach((s,k)=>{
  const t=lines.slice(s,k+1<starts.length?starts[k+1]:lines.length).join("\n");
  const num=Number((t.match(/number:\s*(\d+)/)??[])[1]);
  const vis=[]; pats.forEach(p=>{const re=new RegExp(p.source,"g"); let m; while((m=re.exec(t))) vis.push(m[1]);});
  const j=vis.join(" || ");
  words.forEach(w=>{ if(new RegExp("(^|[^A-Za-z])"+w+"([^A-Za-z]|$)","i").test(j)) slot[w].push(num); });
  const seg=t.split(/practice:\s*\[/)[1]?.split(/\n    recall:/)[0]??"";
  [...seg.matchAll(/answer:\s*"([^"]+)"/g)].forEach(m=>{const key=norm(m[1]); if(!prac.has(key))prac.set(key,[]); if(!prac.get(key).includes(num))prac.get(key).push(num);});
});
for(const w of words) console.log("SLOT "+w.padEnd(10),"-> lessons:",slot[w].join(",")||"(none)");
for(const c of ["Yesterday I went to the park.","There is a book on the desk.","Both books are good.","All the books are good.","Neither book is good.","There is nothing in the box.","Someone is at the door.","I saw a bird.","I have been to Beijing.","Every student is here."])
  console.log("PRAC "+JSON.stringify(c).padEnd(38), (prac.get(norm(c))??[]).join(",")||"(none)");
'

# ④ 含 for 的学习者句槽（判「持续多久」义是否为零）——本报告 §4.1
node -e '
const {readFileSync}=require("fs");
const lines=readFileSync("src/data/grammarLessons.ts","utf8").split("\n");
const starts=[]; lines.forEach((l,i)=>{ if(/^\s*id: "lesson-\d+-/.test(l)) starts.push(i); });
const forL=(ln)=>{let last=null;for(const s of starts){if(s<ln)last=s;else break;}return Number(lines[last].match(/lesson-(\d+)/)?.[1]??0);};
lines.forEach((l,i)=>{
  if(!/"(?:targetSentence|dialogueEn|answer|wrong|correct|en)":/.test(l)) return;
  if(/\bfor\b/.test(l)) console.log("L"+forL(i)+" :"+(i+1)+": "+l.trim().slice(0,110));
});
'

# ⑤ 零雨线纪律复核——本报告 §6.1
node -e '
const {readFileSync}=require("fs");
const GL=readFileSync("src/data/grammarLessons.ts","utf8"), HC=readFileSync("src/data/huntCases.ts","utf8");
const c=(T,w)=>(T.match(new RegExp(`(^|[^A-Za-z])${w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}([^A-Za-z]|$)`,"gi"))??[]).length;
for(const w of ["rain","raining","rainy","stops","stopped","the movie","movie","ends","ended"])
  console.log(w.padEnd(12), "GL="+c(GL,w), "HC="+c(HC,w));
'

# ⑥ 错误句的 HC「连续子序列」复用核查——本报告 §7 的案件设计
node -e '
const HC=require("fs").readFileSync("src/data/huntCases.ts","utf8");
const norm=s=>s.replace(/[.,!?;:]/g,"").toLowerCase().split(/\s+/).filter(Boolean);
const cases=[...HC.matchAll(/id:\s*"(hunt-[^"]+)"[\s\S]*?tokens:\s*\[([\s\S]*?)\]/g)].map(m=>({id:m[1],toks:norm(m[2].replace(/"/g,""))}));
const contig=(hay,needle)=>{const n=needle.length;outer:for(let i=0;i+n<=hay.length;i++){for(let j=0;j<n;j++)if(hay[i+j]!==needle[j])continue outer;return true;}return false;};
for(const t of ["She has left three days ago.","She left ago three days.","I go to school yesterday.","She don'\''t know the answer.","She waited ago an hour.","She wait for an hour.","We is happy.","He don'\''t know."])
  console.log(t.padEnd(34),"HC:", cases.filter(c=>contig(c.toks,norm(t))).map(c=>c.id).join(",")||"NONE");
'

# ⑦ cloze 落点（独立复刻 grammarBoostService）——本报告 §6.4
# 复刻依据：src/services/grammarBoostService.ts:244 FUNCTION_WORDS / :249 keywordIndexes / :261 buildCloze
node -e '
const FUNCTION_WORDS=new Set(["the","a","an","and","or","but","in","on","at","of","to","for","with","my","your","his","her","our","their","this","that","these","those","i","you","he","she","it","we","they","is","am","are"]);
const hashText=t=>{let h=5381;for(let i=0;i<t.length;i++)h=((h<<5)+h+t.charCodeAt(i))>>>0;return h;};
const mulberry32=seed=>{let st=seed>>>0;return()=>{st=(st+0x6d2b79f5)|0;let t=Math.imul(st^(st>>>15),1|st);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};};
const clean=w=>w.replace(/[.,!?;:]$/g,"");
const ki=s=>{const ws=s.split(/\s+/).filter(Boolean);const idx=[];ws.forEach((w,i)=>{const c=clean(w);if(c.length>=3&&!FUNCTION_WORDS.has(c.toLowerCase()))idx.push(i);});if(!idx.length)idx.push(Math.min(1,ws.length-1));return idx;};
const sim=(s,N=2000)=>{const ws=s.split(/\s+/).filter(Boolean);const idx=ki(s);const tal={};for(let k=0;k<N;k++){const r=mulberry32(hashText("cloze:"+k));const p=idx[Math.floor(r()*idx.length)]??Math.min(1,ws.length-1);const w=clean(ws[p]);tal[w]=(tal[w]??0)+1;}console.log(s.padEnd(30),"|",Object.entries(tal).sort((a,b)=>b[1]-a[1]).map(([w,c])=>w+"="+(c/N*100).toFixed(1)+"%").join(" "));};
for(const s of ["She left three days ago.","She waited for an hour.","None of them are here.","Nobody is at home.","She is still waiting."]) sim(s);
'

# ⑧ 场景轮换与封面池——本报告 §6.2／§6.6
node -e '
const GL=require("fs").readFileSync("src/data/grammarLessons.ts","utf8");
const vals={}; (GL.match(/scene:\s*"([a-z]+)"/g)??[]).forEach(x=>{const v=x.match(/"([a-z]+)"/)[1]; vals[v]=(vals[v]??0)+1;});
console.log("scene counts:", JSON.stringify(vals));
const usage={}; (GL.match(/cover:\s*cover(\d+)/g)??[]).forEach(x=>{const k=+x.match(/\d+/)[0]; usage[k]=(usage[k]??0)+1;});
console.log("cover used once:", Object.keys(usage).map(Number).filter(k=>usage[k]===1).length);
console.log("cover36/37/38/39:", [36,37,38,39].map(k=>k+"="+(usage[k]??0)).join(" "));
'
```

## 附录 B：上游原件逐字复核（本机 `/tmp` 缓存 ＋ 本轮 WebFetch 现取）

| # | 页 | 状态 | 本报告引用的逐字 |
|---|---|---|---|
| **B-1** | Cambridge `grammar/british-grammar/ago` | ✅ **本轮 WebFetch 现取** | **"We normally use ago with the past simple. We don't use it with the present perfect"**（错例 **"Not: I have received his letter four days ago."**）／**"Ago follows expressions of time"**（错例 **"Not: They arrived in Athens ago six weeks."**）／**"If we refer to how long something lasted, we use for (not ago)"**／**"If we refer to a point in time before a specific time in the past, we use before or earlier or previously"** |
| **B-2** | Cambridge `grammar/british-grammar/for` | ✅ **本轮 WebFetch 现取** | **"We use for with a period of time to refer to duration (how long something lasts)."**／**"Don't confuse for and in when referring to time."**（例 `We're going to Cape Town for two months.` vs `…in two months.`）／**"After a negative we can use for and in with the same meaning."**（例 `I haven't seen him in five years. (or for five years.)`） |
| **B-3** | Cambridge `grammar/british-grammar/no-none-and-none-of` | ✅ **本轮 WebFetch 现取** | **"None is the pronoun form of no."**／**"None means 'not one' or 'not any'."**／**"When none is the subject, the verb is either singular or plural depending on what it is referring to."**／**"We don't use none directly before nouns."**／**"We use no + noun or none of + noun"**（错例 **"Not: None children in my group …"**）／**"We don't use none where we mean no one or nobody"**（错例 **"Not: … and luckily none was injured."**） |
| **B-4** | Cambridge `grammar/british-grammar/no-one-nobody-nothing-nowhere` | ✅ **本轮 WebFetch 现取** | **"We use them with a singular verb"**／**"We write no one as two separate words or with a hyphen: no one or no-one but not noone."**／**"We don't use nobody, no one, nothing, nowhere after no, not, never or other words which have a negative meaning (hardly, seldom). We use anyone, anybody, anything, anywhere"**（错例 **"Not: I can't do nothing."**／**"Not: She talks to hardly no one."**）／**"We don't use not + anyone/anything/anywhere as the subject of a clause"**（错例 **"Not: Not anything will make me change my mind."**）／**"No one and nobody mean the same. Nobody is a little less formal than no one. We use no one more than nobody in writing."** |
| **B-5** | Oxford `ox_ago.html`（本机 `/tmp` 缓存） | ✅ **属性与释义正文实取** | `cefr="a1"`／`fkox3000="y"`／释义 **"used in expressions of time with the simple past tense to show how far in the past something happened"**／例句 **"two weeks/months/years ago"**／**"The letter came a few days ago."** |
| **B-6** | Oxford `ox_none.html` | ✅ 本机缓存 | `cefr="a2"`／释义 **"none (of somebody/something) not one of a group of people or things; not any"**／例句 **"None of these pens works/work."**／**"We have three sons but none of them lives/live nearby."** |
| **B-7** | Oxford `ox_nobody.html`／`ox_no-one.html` | ✅ 本机缓存 | `nobody`：`cefr="a1"`／**"not anyone; no person"**／**"Nobody is more common than no one in spoken English."**；`no one`：`cefr="a1"`／`fkox3000="y"`／**"not anyone; no person"**／**"No one was at home."**／**"No one is much more common than nobody in written English."** |
| **B-8** | Oxford `ox_since.html` | ✅ 本机缓存 | `cefr="a2"`——**`since` 的等级高于 `ago`，且需完成时前提**（复核批二十七判定） |
| **B-9** | Murphy **初级册** TOC（`/tmp/murphy_ess_norm.txt`） | ✅ 本机原件逐字 | **U19 `19forsinceago`**（`for`／`since`／`ago` 三词一格）／**U77 `77not+anynonone`**／**U78 `78not+anybody/anyone/anythingnobody/no\226one/nothing`**／U79／U80／U81／**U82 `82botheitherneither`**／**U95 `95stillyetalready`** |
| **B-10** | Cambridge `grammar/british-grammar/all`（`/tmp/b26/cam_all.txt`） | ✅ 本机缓存逐字 | **"All: not all — We can make all negative by using not in front of it"**（例 `Not all the buses go to the main bus station`／`We weren't all happy with the result`）——**⚠️ 这是「不全都」（部分否定），不是「全都不」** |

## 附录 C：脚本与自查

**本轮全部统计由内联 node 脚本完成**（未落 `/tmp` 脚本文件，全部命令已写入附录 A，可逐条复跑）。

**零术语自查（本报告面向学习者的文案范围声明）**：

本报告 §7 的全部拟稿（`title`／`grammarLabel`／`oneLineRule`／`summary.rule` 口径文案、`whyZh`／`noteZh`／`explain`／`correctionZh` 口径文案）**已逐条人工比对 `src/data/grammarZeroTerms.ts` 的 29 词，未命中**。**`deepDive` 段落按库内惯例允许保留进阶用词，本轮拟稿的 `deepDive` 亦未含 29 词。**

**（附）29 词表逐字**（`grammarZeroTerms.ts:19-27` 实测）：

```
主语 谓语 宾语 表语 定语 状语
单数 复数 三单 原形 时态
一般过去时 一般现在时 现在进行时 过去进行时 现在完成时
情态动词 比较级 最高级 从句 语序 可数
疑问句 否定句 被动语态 第三人称
形容词 副词 介词
```

**本批自建说法（沿用库内既有）**：「昨天版」／「信号灯」／「走过版」（本报告用「做过版」，与库内一致）／「站句尾」／「站最末尾」／「自带『不』」／「换队首词」／「往前量一段」／「往回指一个点」。

**硬性要求自查**：

- ✅ **词频一律用 node 脚本实测**：§0.3 全表 ＋ 附录 A ①③⑨
- ✅ **逐字引用必须可复跑**：本报告所有行号引用均给出 `sed -n` 或 node 命令（§1.1／§2.1／§3.3／§3.4／§4.1／§6.1／§8.3）；**未核实项一律标「未核实」并登记在 §9**
- ✅ **不整读大文件**：`grammarLessons.ts` 29,196 行只定点读了 6 段（L10／L20／L73／L84／L114／L151–L154）；`huntCases.ts` 8,885 行只读了 4 段（#66／#85／#92／#93／#158／#160／#161／#163）
- ✅ **零术语**：§7 全部拟稿比对 29 词表未命中
- ✅ **目标句 ≤8 词**：L155 `She left three days ago.`（5）／L156 `She waited for an hour.`（5）／L157（条件取）`None of them are here.`（5）
- ✅ **输出中文 Markdown，文件落盘**

---

> **一处诚实声明**：本报告 §1.1 指出批二十七路线图把 L151 与 L152 的两行合成了一句引用。**本报告对这件事的处置是「给出完整行号让任何人可复跑」，而不是「据此翻案」**——**轴 A 的强度最终判为「普通真缺口」而非「库内许过的欠账」，这个判定对轴 A 是降低而非提高**，因此不存在为本轮推荐方向服务的动机。

> 本报告由产品战略团队 AI 协作生成（瑞思），重要决策请由产品负责人审定。
