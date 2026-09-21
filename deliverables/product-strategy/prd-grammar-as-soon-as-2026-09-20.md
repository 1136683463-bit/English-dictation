# PRD：第二十三批 · 一…就…（as soon as · 3 课 L142–L144）

**日期**：2026-09-20 ｜ **类型**：产品需求规格书（PRD）｜ **成员**：析客（产品经理）
**上游输入**：主理人三条裁决（① **冲突处置取「换场景」的加强版＝零雨线**；② **场景锚取「等家人回来吃饭」**；③ **课量 3 课，不扩到 4 课**）；本批三研究（瑞思 `user-research-grammar-twenty-third-batch-2026-09-20.md`／数析 `data-audit-grammar-twenty-third-batch-2026-09-20.md`／竞析 `competitive-analysis-grammar-twenty-third-batch-2026-09-20.md`，均 2026-09-20）；上批 PRD `prd-grammar-contrast-2026-09-20.md`（格式与护栏基线）

## 📝 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1 | 2026-09-20 | 初稿：3 课（L142–L144）＋3 案（#151–#153），开 season-23、m25；单拱「傍晚等家人回来吃饭」；**档位诚实标注 B**（唯一必造词 `soon`）；**零雨线**（`rain`／`raining`／`stops`／`stopped`／`the movie ended` 全批零出现，G13）；**与 L48 的机制复用**（`if 里说现在，主句说将来`——同一机制换一个词用第二次）；**与 L65 `as tall as` 的切开** |

## 📌 TL;DR

1. **批二十三＝3 课（L142–L144）「一…就…」小章**：`as soon as` 立岗（L142 `As soon as he comes home, I will tell him.`）→ **切开**（L143 `As soon as I finish, I will eat.` 对 `When I finish, I will eat.`）→ **收口**（L144 时间家族六格排一行）。开 **season-23（{142,144}）＋ m25（afterLesson 144）**，批量 **144 课／153 案**。
2. **本批的定位一句话**：**`as soon as` 入伙是时间家族第 6 个「有专属课」的成员**（after←L90 `:16714`／before←L91 `:16903`／when←L92 `:17092`／while←L98 `:18229`／until←L109 `:20301`）——**它是全家族唯一一个「有现成机制可接」的新成员**（L48 已教过一模一样的规矩）。
3. **本批最大的教学便利＝L48 的机制现成**（§4 专章）：**L48 `:8767` `grammarLabel` 逐字「条件句 · if 里说现在」／`:8781` `oneLineRule` 逐字「说「如果…就…」：if 里说现在（If it rains），主句说将来（I will stay）——if 里不用 will，「如果的路面用现在时铺」」／`:8852` `summary.rule` 逐字「如果…就…：if 里说现在（If it rains），主句说将来（I will stay）——if 里不用 will」**。→ **`as soon as` 不是开新机制，是「同一个机制换一个词用第二次」**（照 L20 对 L19 的关系）。
4. **本批最大的教学债＝L109 的 `as` 认读位**：**L109 `:20346` `wrong: "She called as I was getting out of the bath."`／`:20349` `bothRight: true`／`:20350` 逐字「两句都对——认读一句：`as` 也能领一整句说「当…那会儿」；今天的主角是 until」**。→ **本批是这条认读的正式转正**（全库第二个「先认读、后立岗」的例子，第一个是 L127 → 批二十感官章）。
5. **唯一的硬约束＝零雨线**（§3 专章）：**L109 把「雨停」锁了 6 处**（GL `:20328`／`:20329`／`:20390`／`:20400`／`:20451` ＋ HC 案 #118 `:6869`／`:6884`），**且 L139 `:26192` 已把「那场雨」续写成跨批连续剧**。→ **不只是「不用 rain」，而是整条雨线不复用**：`rain`／`raining`／`stops`／`stopped`／`the movie ended` 在 L142–L144 **零出现**（G13）。
6. **中文负迁移主靶＝「一到」被直译成 `will`**（`*As soon as he will come home, …` ❌）——**三源明文同轴**：Cambridge `conjunctions-time` 的 Warning 框逐字「**We don't use will after conjunctions referring to future time**」**且第二条例句就是 `as soon as`**（`Not: … as soon as I will get to the office.`）；BC 参考层逐字「We do not normally use will in time clauses and conditional clauses.」；中文侧 `after` 专文逐字「要寫 after class ends，而不是 after class will end」。
7. **cloze 是「假友好」的（本批技术核心）**：**`as` 在 `GRAMMAR_WORDS` 表内**（`grammarAmbushService.ts:181` 逐字含 `"as"`）→ **`As soon as` 开头的句子在关 2 回马枪侧恒落 `As`**（本 PRD 独立复刻实跑），**考点词 `soon` 成空位率 0%**。→ **考点承载压在 `contrast`（每课 3 条带 `wrongMark`）＋ `guided.spot`（每课 1 道）＋ boost 保障句**；**本批不改引擎**。
8. **造词成本＝1 个词封顶**：`soon`（GL 0／HC 0，**字母序列级真零**）；`as` **已有 133 词次**（L65 占 120＝90.2%；⚠️ **批二十二记的 70 须更新为 133**）；**场景侧零造词**（`comes` 15／`home` 97／`eat` 103／`finish` 66／`dinner` 69／`ready` 8 全在库）。
9. **复现取材有 1 句顶死红线**：`Yesterday I went to the park.` **实测已在 6 课的 practice 答案里**（L21／L24／L93／L95／L100／L104）——**本批不得引用**；另有 6 句已到 5 课（§8 逐句核验）。
10. **案件 3 案（#151–#153）**：4 错＝新 2＋旧 2、单 token 可修、≥1 净词、`reviewed: true`；罪名全落 10 枚举、不碰 `comparison`；旧错取 L10／L11／L19／L25；**本批不碰 `run_on`／`fragment`**（批二十二刚用了 `run_on` 3 处＋`fragment` 2 处）；番外 5 案冻结；`guided.spot` 的 `wrongToken` 与 `tokens` 元素逐字相等。

## 🎯 核心结论卡片

| 项目 | 内容 |
|---|---|
| 推荐方案 | 3 课 L142–L144「一…就…」单拱：立岗 1 → 切开 1 → 零新知收口 1；3 案 #151–#153；开 season-23＋m25 |
| 优先级 | P1（内容生产批次）；无 P0 阻断项 |
| 预期影响 | 时间家族第 6 个有课成员入伙；L109 `as` 认读位转正；L48 的机制第一次被复用到第二个词上；中文「一…就…」这条高频时间衔接第一次立岗 |
| 资源需求 | ≈2.2 人日（内容 1.8＋展示层 0.2＋走查 0.2）；两段式 |
| 风险等级 | 中（① **零雨线误踩**——禁用词最多的一批；② **cloze 假友好**——考点词成空位率 0%；③ **与 L65 `as tall as` 同形不同义**；④ **「重复感」**——本批最值钱的一课其实是 L48 的复现） |
| 硬性范围红线 | 课量 3 不扩不缩；一课一增量；L144 零新知；六段式；每课 1 案（4 错＝新 2＋旧 2、单 token 可修）；对比卡 6 条（**≥2 条带 wrongMark，本批 3 条**）；零术语 29 词逐课自查；comparison 不进案件；tagStats=10 不动；**L1–L141 一字不动**；番外 5 案冻结；封面 cover25–cover27（**min-gap 117，解唯一**）；**禁用 `rain`／`raining`／`stops`／`stopped`／`ends`／`ended`／`the movie`／`waited until`**；**禁用 `once`／`by the time`／`will have`／`as if`／`as long as`／`unless`** |

---

## §1 批次定位与选题裁决

### 1.1 命题

批十九（`look + 什么的词`，3 课）→ 批二十（五种感官，6 课）→ 批二十一（`look forward to`，5 课）→ 批二十二（让步与转折，3 课）→ **本批（一…就…，3 课）**。

**这一批要回答的是**：**B 档结清后的第二个新选题做什么——以及一个「语法上不难、但中文里天天用」的时间衔接，值不值得单开一章。**

**答案（主理人已定）**：**做 `as soon as`，3 课小章，档位 B。** 三条支撑逐条落到实读：

| 项 | 上游（逐条，原文级／实读分标） | 我方现状 | 档 |
|---|---|---|---|
| **`as soon as`（本批）** | **Cambridge `conjunctions-time`**〔竞析 §1.1 C-1，本轮 curl 直连实取 455,382 bytes〕：**九项定义句逐字**「When, after, before, until, since, while, once, as and as soon as are subordinating conjunctions which can be used to connect an action or an event to a point in time.」＋**首屏九宫格**含逐字 `We always have an ice cream as soon as we get to the beach.` ＋**同小节逐字**「**We can use when, once, as and as soon as to talk about a specific point in time when something happened or will happen**」＋**Warning 框逐字**「**We don't use will after conjunctions referring to future time**」**且第二条例句逐字就是 `I will call you as soon as I get to the office.`（`Not: … as soon as I will get to the office.`）**；**词典独立词条页 `as soon as` ＝ B1**（逐字「at the same time or a very short time after」，六例）〔竞析 §1.1 C-4，本轮新取〕；**`soon` 本词 ＝ A2**〔竞析 §1.1 C-5〕；**BC 参考层同规则**逐字「We do not normally use will in time clauses and conditional clauses.」〔竞析 §1.2 B-1〕；**中文侧 `conjunctions` 专文**「時間關係：when, while, before, after, since, as soon as, until」**七项并列**＋两例〔竞析 §1.4 E-1〕；**❌will 规则在中文侧 `after` 专文**（「用現在式代替未來式」，❌`I'll call you after class will end.`）〔竞析 §1.4 E-2〕 | **`as soon as` GL 0／HC 0；`soon` GL 0／HC 0（`grep -c "soon"` 两文件均 0——字母序列级真零，无 id 假阳性可剔）**；**`as` GL 133 词次／70 串，HC 13／9（13 处全在案 #74）**〔本 PRD 复验：`grep -ow as` ＝ 137 → 剔 id 串 2 ＋ 注释 2＝133〕 | **B** |

> **一句话（生产单可抄）**：「**上游零课程位（BC 三档 68 课零／Murphy 双册三通道零，连构词要件 `soon` 也三通道零）——但这不是 C 档：规则级落点最厚（Cambridge 语法页九项定义句＋首屏九宫格＋专小节＋Warning 例句位；词典独立词条 B1＋`soon` A2；BC 参考层同规则；中文侧七项并列成表）；我方两文件真零、须造 `soon` 一个词——故对外一律写 B 档。**」

**为什么是 3 课（三条理由，逐条有实读依据）**：

1. **第 1 课增量存在（立岗）**：`as soon as` 本身是零（`soon` 字母序列级全库 0），**「一到就做」这条轴在库内没有任何课教过**（瑞思 §4.0 第 1 条）。
2. **第 2 课增量存在且是本批唯一的独立价值（与 `when` 切开）**：`when` GL **283** 是时间家族最大的一格，**`as soon as` 与 `when` 的语义差只有一刻度**——**把这一课独立出来，是本批唯一能证明「为什么要多学一个说法」的地方**。**若不独立成课，本批就退化为「多背一个短语」，不成章**（瑞思 §4.0 第 2 条）。
3. **第 3 课增量存在（收口位）**：**先例 15 课**——`grammarLabel` 含「收口」全库 15 课（L41／L46／L49／L54／L78／L86／L94／L102／L110／L118／L124／L127／L133／L138／L141）〔竞析附录 B 逐条 regex 实读〕；**其中 L94 起连续九季每季一课（L94／L102／L110／L118／L124／L127／L133／L138／L141）——本批 L144 是第十六课／连续第十季**。**时间家族已有 5 个成员各有专属课，第 6 个成员入伙时把一行排出来，是库内成型的惯例**（L109 `:20380` 逐字「第 90 课 after、第 91 课 before、第 92 课 when——它们都是「领一整句」的老成员。今天 until 入伙，是第四名」就是这个动作）。

**与近期批次的课量对照**：批十九 3 课／批二十 6 课／批二十一 5 课／批二十二 3 课。**本批 3 课＝与批十九／批二十二同量**（`grammarSeasons.ts:53` 实读 season-19 ＝ `{125,127}` 恰为 3 课；`:62` season-22 ＝ `{139,141}` 亦为 3 课）。

### 1.2 三研究结论与主理人三条裁决

| 方案 | 三研究结论 | 主理人裁决 |
|---|---|---|
| **甲·「一…就…」3 课 L142–L144（`as soon as`）** | **瑞思 §0 推荐（首选）**；竞析 §0 序 8／§4.1 **维持首选**；数析 §11.1 判**可生产** | **✅ 拍板：甲 3 课单拱** |
| 乙·`seem`／`appear` 3 课 | 瑞思 §3 判 **C＋**（五形态真零，但缺一条能撑 3 课的轴）；竞析 §2 ④（C＋，与 L125 `It looks nice.` 语义距离未解决） | ❌ 不做（**顺位为批二十四候补**） |
| 丙·`would rather` 2 课 | 瑞思 §3 判 **B−**（2 课封顶、无收口位、中文侧零专文） | ❌ 不做 |
| 丁·`neither`／`either`／`both` 3 课 | 瑞思 §3 判 **B−**（**造词 4 个超先例上限**，批二十 3 词为历史最高） | ❌ 不做（**须先裁「造词上限政策」**） |
| 戊·`once` 作第 4 课 | 瑞思 §3 判 **C**；竞析 §5.2 ① 判 **C（同义换词）** | ❌ 不做（**且本批最终处置更严：`once` 全批零出现，连 `contrast` 认读位也不写**） |
| 己·`by the time` 作第 4 课 | 瑞思 §3 备选（**不能作第 4 课**）；竞析 §3 序 3／§5.2 ②（**另轴＋绑 `will have`**） | ❌ 不做 |
| 复现型大章／换轴 | 与批二十一／二十二一致判不做 | ❌ 不做 |

#### 裁决一：冲突处置取「换场景」的加强版＝**零雨线**

**背景（逐条实读，行号精确）**：

| # | 落点 | 逐字 | 性质 |
|---|---|---|---|
| 1 | L109 `:20328` | `wrong: "I waited until the rain stops."` | 🔴 contrast 错项 |
| 2 | L109 `:20329` | `wrongMark: "stops"` | 🔴 错点标记 |
| 3 | L109 `:20390` | `"until the rain stops ❌ / will stop ❌ —— 两边都得用昨天版"` | 🔴 summary 错例 |
| 4 | L109 `:20400` | `options: ["until the rain stopped", "until the rain stops", "until the rain will stop"]` | 🔴 guided choose 错项 |
| 5 | L109 `:20422`／`:20423`／`:20424` | `tokens: ["I","waited","until","the","rain","stops."]`／`wrongToken: "stops."`／`answer: "stops."` | 🔴 guided spot 错点 |
| 6 | L109 `:20451` | `distractors: ["stops"]` | 🔴 practice 干扰项 |
| 7 | L109 `:20442`／`:20443`／`:20465` | `options: ["I waited until the movie ended.", "…the movie ends.", "…the movie will end."]`／`answer: "I waited until the movie ended."`／`distractors: ["ends"]` | 🔴 电影线同被锁 |
| 8 | 案 #118 `:6869`／`:6884-6885` | `tokens: [...,"the","rain","stops.",...]`／`original: "stops."`／`correction: "stopped."`／`tag: "tense"` | 🔴 案层红线 |
| 9 | L139 `:26192` | 「**场景也是接着第 109 课那场雨的**：那回小美在屋檐下一直等，等到雨停（I waited until the rain stopped.）；这回她不等了，撑着伞就出去」 | ⚠️ 跨批连续剧 |

→ **「雨停」在库里共被锁 6 处（GL `stops` 3 处 ＋ GL `ends` 2 处 ＋ HC `stops` 1 处）**；而 **`as soon as` 的正确形式恰是 `stops`**（现在版表将来——Cambridge Warning 例句逐字 `I will call you as soon as I get to the office.`）。

**加强条件（瑞思本轮新发现）**：**L139 `:26192` 已把「那场雨」续写成跨批连续剧**（L109 等到雨停 → L139 不等了撑伞出去）。→ **换场景不只是「避免撞车」，而是「避免撞掉一条刚建立两课的连续叙事」**。

**故：不只是「不用 rain」，而是「整条雨线不复用」**——`rain`／`raining`／`rainy`／`stops`／`stopped`／`stop`／`waited`／`wait`／`until`／`movie`／`ends`／`ended` 在 L142–L144 **任何字段里零出现**，作 **G13** 逐字硬核验。

> **⚠️ 一条派生的替代动作（本批必须执行）**：**L48 的原句 `If it rains, I will stay at home.`（`:8786` 一带的 `targetSentence`／`:8789` 一带的 `examples`）含 `rain`，本批不能引用**。→ **本批引用 L48 时改用它的另一句 `If it is sunny, we will play outside.`**（**L48 `:8786` 逐字在库**；**实测 GL 1／HC 0，头寸充足**）。**这一句同样带 `if 里说现在、主句说将来` 的机制，教学效果等价，且零雨线。**

#### 裁决二：场景锚取「等家人回来吃饭」（瑞思提议，数析量化支持）

**为什么不用竞析推荐的「电话响」**〔数析 §3.1 实读〕：**`rings` GL 0／HC 0（真零，须造）**；`phone` GL 52（**L99 一门 41**）／`rang` GL 65（**L99 一门 49**）——**用了电话就把 L99「电话打断」的叙事借走**；而 L99 `:18448` 已讲「响是一下子的事」，**语义邻居太近，须显式切开**（额外成本）。

**为什么不用「电影结束」**〔数析 §3.3 实读〕：**`ends` GL 2（两处 100% 在 L109，且都是错项／干扰项）／`ended` GL 8（8 处 100% 在 L109）／`the movie` GL 8（全部在 L109）**——**这不是「换场景」，是「换壳」**：换过去等于用 L109 自己的道具讲第二个规则。

**「等家人回来吃饭」的零件（本 PRD 独立复验，已剔 id 串）**：

| 词 | GL | HC | 判定 |
|---|---|---|---|
| `comes` | **15** | 2 | ✅ **在库的少数三单形式之一**〔数析 §1.5 盘点：57 个常见三单里 23 个真零，`comes` 属在库的 34 个〕 |
| `home` | **97** | 40 | ✅ 极厚 |
| `eat` | **103** | 30 | ✅ 极厚 |
| `finish` | **66** | 6 | ✅ 厚 |
| `dinner` | **69** | 9 | ✅ 厚 |
| `ready` | **8** | 4 | ✅ 在库（**L91 `:16924` 逐字 `{ who: "npc", en: "Dinner is ready!" }`**——**实测 practice 答案出现 0 次，头寸满 6 ✅**） |
| `tell`／`him` | 6／156 | 0／14 | ✅ 在库 |
| **`soon`** | **0** | **0** | 🔴 **全批唯一必造词** |

→ **零造词（除 `soon`）、零撞车**。**且「等家人回来吃饭」与 L109 的「等雨停」是「两种等」**——一个是等到一道线（`until`），一个是等一个人一到就做（`as soon as`）——**语义互相照亮而非互相冲突**。

#### 裁决三：课量 3 课，不扩到 4 课

**竞析取到决定性证据（原文级）**：**Cambridge 语法页 `once` 逐字「We use once as a conjunction meaning 'as soon as' or 'after'」**〔竞析 §1.1 C-2〕；**词典 `once (AS SOON AS)` ＝ B2** 逐字「as soon as, or from the moment when」〔竞析 §1.1 C-6〕；**中文侧 `once` 专文逐字「once 還可以用來表示「一旦、只要、一…就…」的意思」**〔竞析 §1.4 E-3〕——**它的中文释义与 `as soon as` 的「一…就…」一字不差**。→ **`once` 是同义换词，不是新结构**，违反「一课一增量」。

**`by the time` 的真搭档是 C 档的 `will have`**（批二十二已判撤出）：**BC B1-B2 第 8 课逐字「`by` or `by the time` mean 'at some point before'」＋唯一例句 `By the time we arrive, the kids will have gone to bed.`**；**中文侧唯一条例是过去完成**（`By the time he came home, his wife had gone to bed.`）；**三源皆无 CEFR 段位**〔竞析 §2 ③〕。→ **它是另一条语义轴（截止前完成），不是「紧接」。**

→ **第 4 课不存在。3 课定稿。**

### 1.3 批次定位（诚实标注）

**单拱（判据沿用批十五起：单拱＝全批共享一条场景线）**。**本批是本系列第 6 个 3 课章**——本 PRD 实读 `grammarSeasons.ts`（62 行、22 季）的章长清单：`12,12,10,7,5,3,5,6,6,5,4,3,8,8,8,8,8,6,3,6,5,3`（**第 23 季＝本批，长度 3**）；**此前 3 课季 ＝ season-6 `{47,49}`／season-12 `{76,78}`／season-19 `{125,127}`／season-22 `{139,141}`**——**本批与四个先例同长**。

**场景线（单拱一句话）**：**「傍晚，小美在等家人回来一起吃饭」——他一回来我就说；前面说现在，后面说将来。**

`L142 饭桌上还空着一个位子` → `L143 同一张桌子，换个说法再摆一次` → `L144 饭桌收拾干净，本子上排一行`。**scene 只用库内既有值**（本 PRD 实读在用 11 种：`mansion` 50 课／`campus` 37／`city` 24／`sparkle` 9／`island` 5／`school` 5／`train` 3／`mystery` 3／`forest` 2／`magic` 2／`snow` 1）——**本批三课全取 `mansion`，不引入新场景 id**。

> **⚠️ 三课同 scene 是「单拱」的显式形态，须明写**：**本批的场景锚是「同一张饭桌、同一段等待」**——L142 立岗（位子空着）、L143 切开（同一句换 `when` 说一遍）、L144 收口（本子上排一行）。**三课同一场景 id 是有意的**（对照批二十二用 `city`／`campus`／`mansion` 三景，那是因为它的叙事跨了三个地点）；**本批不跨地点**。若走查认为视觉重复，**唯一允许的换法是把 L143 换成 `mansion` 之外的在用值（不引入新 id），并须同时登记叙事链变化**。

**档位标注（诚实标注，本批纪律）**：

| 项 | 本批（批二十三） | 对照：批二十二 | 对照：批二十一 |
|---|---|---|---|
| 新造词 | **1 个**：`soon`（GL 0／HC 0，**字母序列级真零**） | 2 个（`although`＋`though`） | 2 个（`forward`＋`seeing`） |
| 认读升格 | **1 处**：L109 `:20346`／`:20350` 的 `as` 认读位（「as 也能领一整句」） | 1 处：案 #7 的 `Though` 判例升格 | 1 处（L133 种子位） |
| 机制复用 | **1 处**：L48 `:8781`「if 里说现在，主句说将来」——**同一机制换一个词用第二次** | — | — |
| 场景侧造词 | **0 个** | 0 个 | 0 个 |
| 结论 | **B｜1 词必造 ＋ 机制复用 ＋ 认读升格**（**成本低于批二十二**） | B｜造词 ＋ 先考后教倒挂转正 | B＋｜造词 ＋ 认读升格 |

> **对外口径（本批必须遵守）**：写「**B 档：跨源规则级落点最厚（Cambridge 语法页九项定义句＋专小节＋Warning 例句位；词典独立词条 B1），但上游零课程位（BC 三档 68 课零／Murphy 双册三通道零），我方须造 `soon` 一个词；教学上不是开新机制——L48 已教过一模一样的「if 里说现在、主句说将来」**」。**不得**写「A 档」（**A 档要求跨源官方课位，本项上游零课位**）；**不得**写「C 档」（**C 档是无跨源规则页，本项规则页最厚**）；**不得**写「两文件全 0」（**`as` 已有 133 词次，会让生产单漏掉与 L65 的切开动作**）。
> **折扣与增项并列（不得只写好话）**：折扣＝① **`soon` 不可替代**（本族身份词）；② **cloze 假友好**（§7）；③ **零雨线约束**（本批禁用词最多的一次，§3）；④ **「重复感」风险**（§4.4）；⑤ **复现头寸紧张**（§8）。增项＝① **场景侧全零造词**；② **接口最厚（四条现成）**（§4）；③ **与 `when` 的刻度有上游原文级支撑**（Cambridge `as-when-or-while` 逐字「when can mean 'after' or 'at the same time'」＋「We often use just with when or as to express things happening at exactly the same time」，竞析 §1.1 C-8）；④ **罪名承载宽（6 类）**（数析 §5.1）。

**「同一机制第二次应用」的定位（本批脊柱一，§4 专章）**：

- **全库已有一课教过一模一样的机制**：**L48 `:8767` `grammarLabel` 逐字「条件句 · if 里说现在」／`:8781` `oneLineRule` 逐字「说「如果…就…」：if 里说现在（If it rains），主句说将来（I will stay）——if 里不用 will，「如果的路面用现在时铺」」／`:8852` `summary.rule` 逐字「如果…就…：if 里说现在（If it rains），主句说将来（I will stay）——if 里不用 will」**。
- **本批的写法定稿**：「**第 48 课那条规矩——前面那件说现在、后面那件说将来——今天换一个词再站一次岗。**」
- **⚠️ 三条差异（生产期逐条核）**：① **L48 是「如果」，本批是「一到」**（语义不同、规矩相同）；② **L48 用「路面」比喻，本批沿用同一比喻**（「前面那件是路面，铺好了后面那件才开得过去」）；③ **本批是这条规矩的第二次应用，不是新规矩**——**这既是本批最大的教学便利，也是本批最大的「重复感」风险** → **处置：L143 必须把它做成第二次切开（同一规矩的两面：前面多了 will／后面少了 will），把重复变成复现**（§6）。

---

## §2 拆课方案与逐课规格

### 2.1 课量决策：3 课（L142–L144）——为什么不是 2 课、不是 4 课

| 账 | 数 |
|---|---|
| **内容自然容量** | **3 格**：① **立岗**（`as soon as` 上线 ＋「一到就做」＋ 复用 L48 机制）② **切开**（与 `when` 的刻度——**本项唯一独立价值**）③ **零新知收口**（时间家族六格排一行） |
| **增量数** | **2 项真增量 ＋ 收口 1 次**（瑞思 §4.3 逐课增量账实读） |
| **为什么不是 2 课** | **2 课排不下「切开」**——而「切开」是本项唯一能撑起独立性的东西；**砍掉它，本批就变成「多学一个短语」，档位应从 B 降到 C**（瑞思 §4.0 第 2 条逐字） |
| **为什么不是 4 课** | 两个来源双双否决：**`once`＝同义换词**（Cambridge 原文级）／**`by the time`＝另轴且绑定 C 档的 `will have`**（§1.2 裁决三） |
| **一课一增量检查** | L142（立岗）→ L143（切开）→ L144（零新知）。**三课三个落点，无一重复** |
| **对标先例** | 3 课章已有四个先例：season-6／season-12／season-19／**season-22** |

**课表（课注 id 已冻结）**：L142 `lesson-142-as-soon-as`｜L143 `lesson-143-when-vs-as-soon-as`｜L144 `lesson-144-close-23`。**三个 id 已实读确认全库无冲突**（`grep -c "lesson-142-as-soon-as"` 等六项 → **GL 0／HC 0**）。

**封面（数析 §9.2 唯一解 · 池内复用）**：`L142←cover25`｜`L143←cover26`｜`L144←cover27`。

- **实算依据**〔数析 §9.1 实读〕：**117 张资产、141 次使用**（单次张 **93 张 ＝ cover25–cover117**／二用张 **24 张 ＝ cover1–cover24**／三用 0）；**二用严格一一对应**（`coverN` ↔ `L{N}` ＋ `L{N+117}`）。
- **最优指派 ＝ min-gap 117，全枚举（117³ 排列）验证：解数 ＝ 1（唯一）**——`cover25`（前次 L25 → 新用 L142）＝ 117；`cover26`（L26 → L143）＝ 117；`cover27`（L27 → L144）＝ 117。**本 PRD 已实读三张资产的当前唯一占用**（`:4516` `cover: cover25,`〔L25〕／`:4709` `cover: cover26,`〔L26〕／`:4893` `cover: cover27,`〔L27〕；`ls src/assets/lessons/ | wc -l` ＝ **117**；`grep -c 'import cover'` ＝ **117**）。
- **本批禁用**：❌ `cover1`–`cover24`（二用张，段距 1–24）；❌ `cover118`+ 资产不存在。
- **⚠️ 携带项**：**本批取 3 张后，二用池 24→27 张、单次张 93→90 张**——**本 PRD 按唯一解执行，不自行改池政策**（§13 序 7）。

**episode 写法**：`小美的一天 一百四十二`／`一百四十三`／`一百四十四`。**先例充足**：末项实读 `:26499` ＝「小美的一天 一百四十一」，L139→L141 连续三课**无跳号**〔数析 §8.2〕

**scene 取值**：三课**全取 `mansion`**（**单拱＝同一张饭桌**，§1.3 已明写）。**不引入新场景 id**。

### 2.2 逐课规格

> **通用说明（3 课共同）**：六段＝① 看（情景讲解）→ ② 跟（guided：choose／arrange／spot／replace）→ ③ 忆（recall）→ ④ 练（practice ≥4 题）→ ⑤ 破（侦探挑战＝huntCaseIds）；本批 3 课**全部配 recall**（`grammarLessons.test.ts:66-76` 对 `number >= 13` 硬断言三字段非空）。
> **⚠️ 文本字段渲染纪律（最近两批反复出现的问题）**：`grammarLabel`／`oneLineRule`／`summary.rule`／`summary.points`／`blocks.role`／`variants.noteZh`／`contrast.whyZh`／`guided.explain`／`recall.noteZh`／`sceneSetupZh`／`deepDive.paragraphs` 等**全部按纯文本渲染**——**不得写 Markdown 的 `**粗体**` 标记**（会被用户原样看到）。**本规格书内的粗体是排版，生产落盘时一律去掉。**
> **全批话术纪律（本批头号陷阱）**：**`as soon as` 的教科书描述是「引导时间状语从句」**——**「从句」「状语」两词都在 29 词红线表内**（`grammarZeroTerms.ts:17-27` 逐字实读）→ **三字段一律改写成「as soon as 领一整句」「as soon as 后面跟一整句」「前面那件／后面那件」**。「**主句**」**可沿用**（**L48 `:8781` 已在用，非红线词**），**但本批除引用 L48 原文之外一律不用它**（§6.3）。**「连词」不在 29 词表内、库内也在用**（L19 `:3415` 逐字「连词 · and / but」／L20 `:3598` 逐字「连词 · because / so」），**但本批为统一口径不用它**。
> **全批 cloze 纪律（本批技术核心）**：**`as` 在 `GRAMMAR_WORDS` 表内**（`grammarAmbushService.ts:181` 的「短语骨架词」段逐字含 `"as"`）→ **本批所有以 `As soon as` 开头的句子，关 2 回马枪抽走的一定是 `As`**（本 PRD 独立复刻实跑，§7.1）。→ **考点承载一律压在 `contrast`（每课 6 条、3 条带 `wrongMark`）与 `guided.spot`（每课 1 道），另在 boost 侧每课配 1 处保障句（落 `soon`）**（§7.2／§7.3）。**本批不改 `grammarAmbushService.ts`／`grammarBoostService.ts`。**
> **全批零雨线纪律（本批特有·最硬的一条）**：**`rain`／`raining`／`rainy`／`stops`／`stopped`／`stop`／`wait`／`waited`／`until`／`movie`／`ends`／`ended` 在 L142–L144 任何字段里零出现**——**理由与逐条锁定见 §3**。**含 `contrast`／`deepDive`／`examples`／`dialogue`／`practice`／`sceneSwings`／`variants`。**
> **全批「零 `once`」纪律（本批额外）**：**`once` 全批零出现**（不教、不复现、`contrast` 里也不出现）——**它与 `as soon as` 是官方定义的同一义**（Cambridge 逐字「We use once as a conjunction meaning 'as soon as' or 'after'」），**写进任何字段都会被读成「换词」**；**登记为后续研究项**（§13 序 3）。
> **全批新错型清单（本批要新造的三条）**：① **「前面那件请了 `will`」**（`As soon as he will come home, …` ❌，**`verb_form`**——**三源明文同轴，本批主靶**；**逐字同型先例**：案 #57 `:3643-3647` `original: "will"`／`correction: "去掉 will"`／`tag: "verb_form"`）；② **「两头少一头 `as`」**（`Soon as he comes home, …` ❌／`As soon I finish, …` ❌，**`word_order`**——**逐字同型先例**：案 #74 `:4694-4700` `original: "tall"`／`correction: "as tall"`／`tag: "word_order"`；**补词型单 token 修法先例**：案 #129 `:7368-7371` `original: "getting"`／`correction: "to getting"`）；③ **「后面那件少了 `will`」**（`As soon as I finish, I eat.` ❌，**`tense`**）。

---

**L142 他一回来我就说（立岗课 · `as soon as` 上线 ＋ 复用 L48 机制）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-142-as-soon-as`；`number: 142`；episode「小美的一天 一百四十二」；scene `mansion`；cover `cover25` |
| title / grammarLabel | 「他一回来我就说」/「一到就做 · as soon as + 小句子」（**零术语自查 ✓**；**与家族既有格式同型**——实读 `:16714`「先后 · after + 小句子」／`:16903`「先后 · before + 小句子」／`:17092`「什么时候 · when + 小句子」／`:18229`「两件同时 · while + 都在穿 -ing」／`:20301`「等到…为止 · until + 小句子」） |
| targetSentence | `As soon as he comes home, I will tell him.`（**10 词**——⚠️ **超「每句 ≤8 词」2 个词，诚实标注**：库内 `targetSentence` 词数分布 **3–14**，**≥8 词的已有 15 课**（8 词：L20／L39／L44／L46／L48／L49／L78／L82／L90／L139／L140／L141；10 词：L86；12 词：L101；14 词：L102）〔瑞思 §4.4 实读〕→ **10 词不越先例**。**选它而不取 8 词句的理由**：① 它是场景锚「等家人回来吃饭」的正句；② `comes`／`home`／`tell`／`him` **全部在库**；③ **8 词替代句 `As soon as I finish, I will eat.` 已用作 L143 的目标句**（两课各有一句，避免同一句在两课重复顶格） |
| sceneSetupZh | 傍晚，饭桌上摆好了三副碗筷，靠门那个位子还空着。妹妹问要不要先吃——小美说：他一回来我就告诉他。 |
| intentZh | 他一回来我就告诉他。 |
| 场景 | 傍晚等家人回来吃饭（**厨房里妈妈喊了一声 `Dinner is ready!`**——**逐字取 L91 `:16924`，只作对白／arrange 素材，不进 practice 答案**） |
| 新知识点 | **只有一件**：**说「一到…就…」用 `as soon as`——它领一整句（谁 ＋ 做什么），再跟后面那半句**：`As soon as` ＋ `he comes home` ＋ `,` ＋ `I will tell him`。**规矩照第 48 课那条：前面那件说现在（he comes），后面那件说将来（I will tell）**——**`as soon as` 里不请 will**。**⚠️ 本课不碰 `when` 的对照**（那是 L143 的切开位，本课只在 `contrast` 里并排一次、不讲刻度）；**不碰 `once`／`by the time`／`as if`／`as long as`／`unless`**（全批零出现）；**不碰 `as tall as` 的规则**（只做一次切开，§5） |
| blocks | `{ text: "As soon as he comes home", role: "他一到家（领一整句，说现在）" }` ／ `{ text: "I will tell him", role: "我就告诉他（说将来）" }` |
| oneLineRule（零术语自查 ✓） | 「说「一到…就…」：as soon as 领一整句（As soon as he comes home），后面那件马上做（I will tell him）——前面那件说现在，后面那件说将来，as soon as 里不请 will。第 48 课 if 里那条规矩，今天换一个词再站一次岗。」（**零术语自查**：本课最易踩「从句」「状语」「连词」三词，**已逐字改写**；**引用 L48 时把「主句」改写成「后面那件」**） |
| summary.rule／points | **rule**：「说「一到…就…」：as soon as 领一整句（As soon as he comes home），后面那件马上做（I will tell him）——前面说现在，后面说将来。」**points**：① `As soon as he comes home, I will tell him.`——as soon as 领一整句；② `As soon as he will come home, I will tell him.` ❌——**前面那件说现在，不请 will**（第 48 课的老规矩）；③ `Soon as he comes home, I will tell him.` ❌——**两头都要卡住：少一头 as，「一…就…」就散架。三处均零术语 ✓** |
| 对比卡 6 条方向 | ① **真错卡（本批头号错 · 主靶 · wrongMark 条 1）**：`As soon as he will come home, I will tell him.` ❌（**`wrongMark: "will"`**，**`verb_form`**——**前面那件说现在，不请 will**；whyZh「**第 48 课那条规矩再看一遍**：if 里说现在，不用 will——今天轮到 as soon as。前面那件是「他一到家」（还没到，但说的是现在那一下）：As soon as he 【comes】 home。中文说「他一回来」，那个「一」里没有「将要」。」；**本 PRD 实跑 diffScore ＝ 77**（错卡，门不生效，**登记**））；② **真错卡（两头卡住 · wrongMark 条 2）**：`Soon as he comes home, I will tell him.` ❌（**`wrongMark: "Soon"`**，**`word_order`**——**少一头 as 就散架**；whyZh「**两头都要卡住**：少一头 as，「一…就…」就散架——第 65 课那句老话（两头都要卡住：少一头 as，「一样」就散架）：As 【soon as】 he comes home。⚠️ 这里是同一个词的两张脸，不是第 65 课那个「一样」」；**本 PRD 实跑 diffScore ＝ 9**）；③ **真错卡（小三单 · wrongMark 条 3）**：`As soon as he come home, I will tell him.` ❌（**`wrongMark: "come"`**，**`sv_agreement`**——**他回来是他/她/它版**；whyZh「他回来是「他/她/它」版，动词后面要加小尾巴 -s——**第 25 课的老规矩**（实读 `:4528` 逐字「他、她、它做事，动词后面要加个小尾巴 -s：He drinks」）：he 【comes】 home。」；**本 PRD 实跑 diffScore ＝ 95**——**错卡的门不生效（`grammarBoostService.ts:744-753` 实读：`if (!contrast.bothRight) return;`），但 95 是全场最高分，须登记**（§7.4））；④ **双正解卡（与 L48 并排 · 本批展示面 · 机制复用）**：`As soon as he comes home, I will tell him.` ✅ 并排 `If it is sunny, we will play outside.` ✅（**`bothRight: true`，`wrongMark: null`**；whyZh「**两句都对，都是同一条规矩**：前面那件说现在，后面那件说将来——第 48 课用 if 站岗，今天换 as soon as 站岗。」；**`If it is sunny, we will play outside.` 逐字取 L48 `:8786`，一字不改**——**⚠️ 本批禁用 L48 的 `If it rains, I will stay at home.`（含 rain，踩零雨线）**；**本 PRD 实跑 diffScore ＝ 0 ✓**）；⑤ **双正解卡（与 `when` 并排 · 下一课的引子）**：`As soon as he comes home, I will tell him.` ✅ 并排 `When he comes home, I will tell him.` ✅（**`bothRight: true`，`wrongMark: null`**；whyZh「**两句都对**：when 说的是「当…的时候」，as soon as 说的是「一到就」——**差别只有一刻**，下一课把这两个摆在一起看。」；**⚠️ `When he comes home, I will tell him.` 实测 GL 0／HC 0——本课新句，登记**；**本 PRD 实跑 diffScore ＝ 0 ✓**）；⑥ **双正解卡（与 L109 的 `as` 认读位并排 · 跨批接口）**：`As soon as he comes home, I will tell him.` ✅ 并排 `She called as I was getting out of the bath.` ✅（**`bothRight: true`，`wrongMark: null`**；whyZh「**两句都对**：as 能领一整句——**第 109 课认过脸**（当时只是认读），今天它的第二个身份转正。」；**`She called as I was getting out of the bath.` 逐字取 L109 `:20346`，一字不改**——**⚠️ 本批只引这一句，不引 L109 的雨句**；**本 PRD 实跑 diffScore ＝ 10 ✓**）。**⚠️ 生产红线**：本课 **①②③ 三条带 mark**（**过线不贴线**）；**三组双正解本 PRD 实跑 0／0／10 全部 < 90 ✓（余量极大）**；**③ 的 95 是错卡高分，须在生产期重跑登记**（§7.4）；**登记项**：本课 `contrast` 六条逐字见上，**`If it is sunny, we will play outside.`（L48 `:8786`）与 `She called as I was getting out of the bath.`（L109 `:20346`）两句为逐字回流，不得改写一个字** |
| 变体三态 | 肯定 `As soon as he comes home, I will tell him.`（10 词）／否定 `As soon as he comes home, I will not tell him.`（11 词；noteZh：「不」站在 will 后面——在 will 后面加 not（**第 12 课的老规矩**））／疑问 `Will you tell him as soon as he comes home?`（10 词；noteZh：**`Will` 搬句首**（**第 12 课的老规矩**），as soon as 那一整句留在后面不动）。**⚠️ 三态空位登记（本 PRD 实跑，§7.1）**：肯定落 `As`／否定落 `As`／疑问落 `Will`——**考点词 `soon` 在三态里全部逃逸** |
| 复现题设计（practice 4 题） | 第 1 题 **变体逐字题**（取疑问卡 `Will you tell him as soon as he comes home?`——`grammarLessons.test.ts:11-29` 硬断言）；第 2 题 **否定卡**（`As soon as he comes home, I will not tell him.`）；第 3 题 **复现 L48**（`If it is sunny, we will play outside.`，**逐字取 `:8786`**）；第 4 题 **场景句**（`We will eat as soon as he comes home.`）。**每课 ≥1 复现题 ✓**。**⚠️ 本课 boost 侧保障句在 `sceneSwings[2]`**（`As soon as he comes home, we will eat.` → **本 PRD 实跑 `t1` 落 `soon` ★**，§7.2）。**⚠️ 生产红线**：本课 `examples` 取 target／`I will tell him as soon as he comes home.`（**把 as soon as 挪到后面说的版本**）／`We will eat as soon as he comes home.`／`If it is sunny, we will play outside.` 四条——**practice 与 examples 重合 ＝ 2 题／4 题 < 4 ✓**（`grammarLessons.test.ts:151` 断言「练习整组复用例句」为红）；**每题 `tokens` 词集须与 `answer` 逐字一致、`distractors` 不得与答案词重复**（`:31-50`／`:52-67`） |
| 各题 `distractors` 建议 | 第 1 题：`["Do"]`；第 2 题：`["Does"]`；第 3 题：`["are"]`；第 4 题：`["is"]`。**⚠️ 四个干扰项均不得与对应答案词重复**（机检 `:52-67`），且**均须是库内已学的真词**（`do`／`does`／`are`／`is` 全在库） |
| 各题 `tokens` 逐字（生产期照抄） | 第 1 题 `["Will","you","tell","him","as","soon","as","he","comes","home?"]`；第 2 题 `["As","soon","as","he","comes","home,","I","will","not","tell","him."]`；第 3 题 `["If","it","is","sunny,","we","will","play","outside."]`；第 4 题 `["We","will","eat","as","soon","as","he","comes","home."]`。**⚠️ 标点跟在前一个词后面**（`huntCases.ts` 头注释 `:15` 同款纪律） |
| guided 6 步 | ① `choose`（`___ he comes home, I will tell him.` 选项 `As soon as`／`Soon as`／`As soon`，答案 `As soon as`，explain「说「一到就…」用 as soon as——它领一整句，两头都要卡住」）；② `arrange`（target，10 token）；③ `arrange`（**R8 跨课复现 L48**：`If it is sunny, we will play outside.`）；④ **`spot`（`tokens: ["As","soon","as","he","will","comes","home,","I","will","tell","him."]`，`wrongToken: "will"`**——**须与 `tokens` 元素逐字相等（本处 `will` 无尾标点 ✓）**；`answer: "will"`；`correctionZh`「前面那件说现在，不请 will：【去掉 will】。As soon as he comes home, I will tell him。」——**本 spot 对准本课头号错**；**⚠️ 本处 `tokens` 里有两个 `"will"`（下标 4 与 9），引擎 `findIndex` 取第一个（下标 4）——正是要点的那个 ✓，须生产期逐字核**）；⑤ `arrange`（**R8 跨课复现 L91**：`Dinner is ready!`）；⑥ `replace`（`replaceBase: "As soon as he comes home, I will tell him."`／`replaceTarget: "把 as soon as 换成 when 的说法"`／`options: ["When he comes home, I will tell him.","When he will come home, I will tell him.","Soon as he comes home, I will tell him."]`／`answer: "When he comes home, I will tell him."`——**三个选项里 2、3 是错的**，**本步只做「换过去」的动作、不解释刻度**；`explain`：「换过去说：when 说的是「当…的时候」——下一课细说这两个的分别。」） |
| recall 三字段 | `promptZh`：傍晚，饭桌上摆好了三副碗筷，靠门那个位子还空着。妹妹问要不要先吃。凭记忆，写出你今天这一句。／`intentZh`：他一回来我就告诉他。／`answer`：target／`noteZh`：「as soon as 领一整句——前面那件说现在，后面那件说将来，as soon as 里不请 will。」（**零术语自查 ✓**） |
| 案 | `hunt-as-soon-as-comes`（**#151**，§11） |
| 新词 | `soon`（1 个，**本课立岗**）。**⚠️ `as` 不是新词**——**已有 133 词次，且 L109 `:20346` 已认读「as 也能领一整句」**；**本课只把这条认读转正**（§4.3） |
| 术语红线自查 | 用「领一整句／前面那件／后面那件／两头都要卡住／一到就／说现在／说将来」；**禁「从句」「状语」「连词」「时间状语从句」**——**「从句」是本课头号陷阱**；**「主句」除引用 L48 原文外不用**；**忌「门牌」**（防与 L67 的 `at` 门牌串台，沿用批二十一／二十二纪律） |
| 走查观察点 | **「同一机制换一个词」是否被读懂**（走查问「第 48 课 if 里那条规矩，今天换谁站岗了」——**正确反应是「as soon as 站了同一个岗」**）；**「前面不请 will」是否被接住**（走查问「`As soon as he will come home, I will tell him.` 对不对」——**正确反应是「不对——前面那件说现在」**）；**「两头卡住」是否被迁移**（走查问「`Soon as he comes home, …` 少什么」——**正确反应是「少一头 as——第 65 课那句老话」**） |

---

**L143 「当…的时候」和「一到…就…」（切开课 · 与 `when` 的语义刻度）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-143-when-vs-as-soon-as`；`number: 143`；episode「小美的一天 一百四十三」；scene `mansion`；cover `cover26` |
| title / grammarLabel | 「「当…的时候」和「一到…就…」」/「差在哪儿 · when 管那时候／as soon as 管一到就」（**零术语自查 ✓**） |
| targetSentence | `As soon as I finish, I will eat.`（**8 词 ✓**；**全库 GL 0／HC 0**——`I finish` 0／`I will eat` 0／整句 0，本 PRD 复验） |
| sceneSetupZh | 还是那张饭桌。小美一边摆筷子一边说：我这边一做完就吃。妹妹问：那跟你刚才说的「当…的时候」有什么不一样？ |
| intentZh | 我一做完就吃。 |
| 场景 | 同一张桌子，换个说法再摆一次（**对照句 `When I finish, I will eat.` 与目标句只差开头那一头**） |
| 新知识点 | **只有一件 ＝ 真增量 ＝ 两条线的距离**：**`when` 是「那段时间里／那时候」（两件事碰上了，谁先谁后不强调）；`as soon as` 是「一到那一刻、马上」（前脚一抬、后脚就到）**。**这是 L92 一课从未讲过的轴**（L92 `:17105` 逐字只到「when 也领一整句——When it is sunny, I run；它跟 after/before 是同一个三人组（后面都跟一整句）」——**只讲了「都跟一整句」，没讲「差在哪儿」**）。**⚠️ 本课除「刻度」外不叠加任何新词或新形式**（竞析 §4.2 约束 3 逐字：**否则「只差一刻度」这个唯一增量会被淹没**）；**不碰 `while`**（L98 已管并行）；**不做否疑的位置变化**（那会把一课变两课） |
| blocks | `{ text: "As soon as I finish", role: "我一做完（一到那一刻）" }` ／ `{ text: "I will eat", role: "我就吃（马上做）" }` |
| oneLineRule（零术语自查 ✓） | 「同一个开头，两个说法：when 说「当…的时候」，那段时间里做（When I finish, I will eat）；as soon as 说「一到就」，一到那一刻马上做（As soon as I finish, I will eat）——差在「那段时间」和「那一刻」。两边都是前面说现在、后面说将来。」（**零术语自查**：本课最易踩「从句」「状语」「连词」「时态」四词，**已逐字改写为「那段时间／那一刻」**） |
| summary.rule／points | **rule**：「when 管「那时候」，as soon as 管「一到就」——同一个开头、同一个后面，差在「那段时间」和「那一刻」。」**points**：① `As soon as I finish, I will eat.`——一到那一刻马上做；② `When I finish, I will eat.`——那段时间里做（第 92 课 when 领一整句）；③ `As soon as I will finish, I will eat.` ❌——**前面那件说现在，不请 will**；④ `As soon as I finish, I eat.` ❌——**后面那件还没发生，要带上 will**。**四处均零术语 ✓** |
| 对比卡 6 条方向 | ① **双正解卡（本课脊柱卡 · 刻度 · 展示面）**：`As soon as I finish, I will eat.` ✅ 并排 `When I finish, I will eat.` ✅（**`bothRight: true`，`wrongMark: null`**；whyZh「**两句都对，开头几乎一样**——不一样的只有一刻：when 是「那段时间里」，as soon as 是「一到那一刻、马上」。**想强调一刻也不等，就用 as soon as。**」；**本 PRD 实跑 diffScore ＝ 13 < 90 ✓**）；② **真错卡（第一刀 · 与 L142 ① 同型异位 · wrongMark 条 1）**：`As soon as I will finish, I will eat.` ❌（**`wrongMark: "will"`**，**`verb_form`**——**前面那件说现在**；whyZh「**第 142 课那条再看一遍**：前面那件说现在，不请 will——As soon as I 【finish】。**中文的「一…就…」里没有「将要」。**」；**⚠️ 本卡与 L142 ① 同型（will 混入前面那件）但不同句——这是有意的「二次切开」**（照 L140 对 L139 的先例），**生产期须核两课 `whyZh` 不同**；**本 PRD 实跑 diffScore ＝ 89**，错卡，**登记**）；③ **真错卡（第二刀 · 与 L142 方向相反 · wrongMark 条 2）**：`As soon as I finish, I eat.` ❌（**`wrongMark: "eat"`**，**`tense`**——**后面那件还没发生，要带上 will**；whyZh「**后面那件还没发生**，要带上 will——As soon as I finish, I 【will eat】。**中文的「就」不带将来，英语这边要带**：前面说现在，后面说将来。」；**本 PRD 实跑 diffScore ＝ 88**）；④ **真错卡（两头少另一头 · 与 L142 ② 配成一对 · wrongMark 条 3）**：`As soon I finish, I will eat.` ❌（**`wrongMark: "soon"`**，**`word_order`**——**这回少的是第二头 as**；whyZh「**两头都要卡住**：第 142 课少的是第一头，这回少的是第二头——As soon 【as】 I finish：**两个 as 缺一不可**」；**本 PRD 实跑 diffScore ＝ 88**）；⑤ **双正解卡（与 L48 并排 · 机制复现）**：`As soon as I finish, I will eat.` ✅ 并排 `If it is sunny, we will play outside.` ✅（**`bothRight: true`，`wrongMark: null`**；whyZh「**两句都对，同一条规矩**：前面那件说现在，后面那件说将来——第 48 课 if 站岗，这一章 as soon as 站岗。」；**`If it is sunny, we will play outside.` 逐字取 L48 `:8786`，一字不改**；**本 PRD 实跑 diffScore ＝ 11 ✓**）；⑥ **双正解卡（与 L92 的老句并排 · 跨课接口）**：`As soon as I finish, I will eat.` ✅ 并排 `When it is sunny, I run.` ✅（**`bothRight: true`，`wrongMark: null`**；whyZh「**两句都对，都用 when／as soon as 领一整句**：第 92 课 when 说的是「天晴的时候」（那段时间里），今天 as soon as 说的是「一做完」（一到那一刻）——**同一个位子，两种紧密度。**」；**`When it is sunny, I run.` 逐字取 L92 `:17100`，一字不改**；**本 PRD 实跑 diffScore ＝ 11 ✓**）。**⚠️ 生产红线**：本课 **②③④ 三条带 mark**；**三组双正解本 PRD 实跑 13／11／11 全部 < 90 ✓**；**② 的 89 与 ③④ 的 88 是错卡，门不生效，须登记**（§7.4）；**⚠️ `They was happy.` 本课不用**（**本批的 L19 回流放在案 #152，不放进 `contrast`**——因该句在 HC 已被 #129／#135／#142 等多案使用，避免过度复现） |
| 变体三态 | 肯定 `As soon as I finish, I will eat.`（8 词）／否定 `As soon as I finish, I will not eat.`（9 词；noteZh：「不」站在 will 后面——在 will 后面加 not（第 12 课的老规矩））／疑问 `Will you eat as soon as you finish?`（7 词 ✓；noteZh：**`Will` 搬句首**（第 12 课的老规矩），as soon as 那一整句留在后面不动）。**⚠️ 三态空位登记（本 PRD 实跑）**：肯定落 `As`／否定落 `As`／疑问落 `Will`——**ambush 侧考点词全部逃逸，与 L142 同型**；**boost 侧 `variants[1]`（`As soon as I finish, I will not eat.`）实测 `t1` 落 `soon` ★**（本课保障句，§7.3） |
| 复现题设计（practice 5 题） | 第 1 题 **变体逐字题**（取疑问卡 `Will you eat as soon as you finish?`）；第 2 题 **否定卡**（`As soon as I finish, I will not eat.`）；第 3 题 **对照位（本课脊柱）**（`When I finish, I will eat.`——**与目标句只差开头那一头**）；第 4 题 **复现 L92**（`When it is sunny, I run.`，**逐字取 `:17100`**，**本 PRD 实测头寸 n=2（L92／L97），剩 4 ✓**）；第 5 题 **复现 L97**（`When you called, I was reading.`，**逐字取 `:18147` 一带**，**本 PRD 实测头寸 n=3（L97／L101／L109），剩 3 ✓**）。**每课 ≥1 复现题 ✓（本课 2 道）**。**⚠️ 生产红线**：本课 `examples` 取 target／`When I finish, I will eat.`／`If it is sunny, we will play outside.`／`When it is sunny, I run.` 四条——**practice 与 examples 重合 ＝ 3 题／5 题 < 5 ✓**（**若生产期再把 `When you called, I was reading.` 也写进 examples，重合会到 4 题，仍 < 5 但须登记**） |
| 各题 `distractors` 建议 | 第 1 题：`["Do"]`；第 2 题：`["Does"]`；第 3 题：`["As"]`；第 4 题：`["am"]`；第 5 题：`["is"]`。**均不得与答案词重复**；**均须是库内已学的真词** |
| 各题 `tokens` 逐字（生产期照抄） | 第 1 题 `["Will","you","eat","as","soon","as","you","finish?"]`；第 2 题 `["As","soon","as","I","finish,","I","will","not","eat."]`；第 3 题 `["When","I","finish,","I","will","eat."]`；第 4 题 `["When","it","is","sunny,","I","run."]`；第 5 题 `["When","you","called,","I","was","reading."]` |
| guided 6 步 | ① `choose`（`___ I finish, I will eat.` 选项 `As soon as`／`Soon as`／`As soon`，答案 `As soon as`，explain「说「一到就」用 as soon as——**两头都要卡住**」——**⚠️ 生产期注意：本步的三个选项里只有 `As soon as` 是对的，另两个都是「两头缺一头」的错形，不要把 `when` 放进来当选项**（放进来会变成「两个都对」，那是 `contrast` ① 双正解卡的任务，不是 choose 的））；② `arrange`（target，8 token）；③ **`spot`（`tokens: ["As","soon","as","I","finish,","I","eat."]`，`wrongToken: "eat."`**——**⚠️ 本处 `tokens` 末项带尾点 `"eat."`，`wrongToken` 必须逐字写成 `"eat."`（带点）**——**本批唯一一处「元素自带尾标点」的 spot**，**须与 `tokens` 元素逐字相等**；`answer: "eat."`；`correctionZh`「后面那件还没发生，要带上 will：【will】 eat。As soon as I finish, I will eat。」——**本 spot 对准本课第二刀**）；④ `arrange`（**R8 跨课复现 L92**：`When it is sunny, I run.`）；⑤ `arrange`（**R8 跨课复现 L97**：`When you called, I was reading.`）；⑥ `replace`（`replaceBase: "As soon as I finish, I will eat."`／`replaceTarget: "换成 when 说的版本"`／`options: ["When I finish, I will eat.","When I will finish, I will eat.","When I finish, I eat."]`／`answer: "When I finish, I will eat."`——**三个选项里 2、3 是错的**；`explain`：「换过去说：when 管「那时候」——**两句话只差一刻。**」） |
| recall 三字段 | `promptZh`：还是那张饭桌。你一边摆筷子一边说：我这边一做完就吃。凭记忆，写出你今天这一句。／`intentZh`：我一做完就吃。／`answer`：target／`noteZh`：「when 管「那时候」，as soon as 管「一到就」——前面那件说现在，后面那件说将来。」（**零术语自查 ✓**） |
| 案 | `hunt-when-vs-as-soon`（**#152**，§11） |
| 新词 | **0 个**（切开课） |
| 术语红线自查 | 用「那时候／那一刻／那段时间／一到就／当…的时候／领一整句／前面那件／后面那件」；**禁「从句」「状语」「时态」「语序」「连词」**——**「从句」是本课头号陷阱**；**忌把「刻度」写成术语**（用「差在哪儿」） |
| 走查观察点 | **「一刻之差」是否被接住**（**本课核心读数**：走查问「`As soon as I finish, I will eat.` 和 `When I finish, I will eat.` 哪句是「一刻也不等」」——**正确反应是「as soon as 那句」**）；**「两刀」是否被分开**（走查问「这一课的两句错句，一句错在前面、一句错在后面——分别错什么」——**正确反应是「前面多了 will／后面少了 will」**）；**反向风险＝学生以为两句有强弱之分**（走查问「哪句更好」——**正确反应是「都好，看你想说哪一段」**） |

---

**L144 时间家族排一行（收口 · 零新知）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-144-close-23`；`number: 144`；episode「小美的一天 一百四十四」；scene `mansion`；cover `cover27` |
| title / grammarLabel | 「时间家族排一行（收口）」/「收口 · 零新知（六格排一行）」（**照 L141 `:26498` 逐字形态「收口 · 零新知（两张脸排一行）」**；**「六格」＝ after／before／when／while／until／as soon as**——**⚠️ 数法口径**：这是「**已有专属课**」的六个成员（瑞思 §1.3 两层数法：①「有课的成员」＝6；②「在库有实体且带时间连接义」＝7，第 6 种是 `as` 本身（无专属课、仅 L109 认读）。**本 PRD 只用前者，避免读者混淆**） |
| targetSentence | `As soon as he comes home, I will tell him.`（**逐字复用 L142 `targetSentence`**——**先例**：L124←L122／L133←L125／L138←L120／**L141←L139**，**收口课复用本章核心句是本项目的既定形态**） |
| sceneSetupZh | 饭桌收拾干净了。小美把本子翻开，一页上排了六行：第一行开头是 after，第二行 before，第三行 when，第四行 while，第五行 until，最后一行是新学的 as soon as。 |
| intentZh | 把这一章学的这一句再说一遍，再把这六行看一遍。 |
| 新知识点 | **无——章末零新知**（收口先例 **15 课**，§1.1 第 3 条已列；**其中 L94 起连续九季每季一课，本批 L144 是第十六课／连续第十季**）；**接口零字段新增**；**复现取材＝六句全部逐字取既有**（本批 L142／L143 ＋ L90／L91／L92／L98——**⚠️ until 那一格按 §3.3 处置「只引规则不引句」**）；**不引番外 5 案**（`huntService.test.ts:215` 冻结名单） |
| oneLineRule（零术语自查 ✓） | 「时间家族排一行：after（做完之后）、before（做之前）、when（当…的时候）、while（两件同时）、until（等到那道线）、as soon as（一到就做）——**前面六行都是「后面跟一整句」的老成员**（第 109 课排过一次，那时 until 入伙是第四名；今天 as soon as 入伙，它站第六行）。**as soon as 那一行的规矩跟第 48 课 if 那条一样：前面说现在，后面说将来。**」（**零术语自查**：收口课要「总结一章」，最易随手写「从句」「状语」「连词」「时态」，**已逐字自查**；**「主句」本课零出现**） |
| summary.rule／points | **rule**：「时间家族六行：after／before／when／while／until／as soon as——**都是「后面跟一整句」**；as soon as 那一行跟第 48 课 if 一样：前面说现在，后面说将来。」**points**：① `As soon as he comes home, I will tell him.`——**第 142 课**，第六行；② `When I finish, I will eat.`——**第 92 课 when 那一行 ＋ 第 143 课的对照**；③ `After I do my homework, I watch TV.`／`Before I eat, I wash my hands.`／`While I was reading, he was sleeping.`——第 90／91／98 课各自的老句；④ **until 那一行只记规矩**：**「前面一直做，后面那道线一到就停」**（**引 L109 `:20389` 逐字的规则半截，不引含雨的例子句**——**⚠️ 见 §3.3**）。**四处均零术语 ✓** |
| 对比卡 6 条方向 | ① **真错卡（回流 #151① · 主靶 · wrongMark 条 1）**：`As soon as he will come home, I will tell him.` ❌（**`wrongMark: "will"`**，**`verb_form`**——**前面那件说现在，不请 will**；whyZh「**第 142 课回流**：前面那件说现在——As soon as he 【comes】 home。第 48 课 if 里那条规矩，as soon as 也照办。」；**本 PRD 实跑 diffScore ＝ 77**）；② **真错卡（回流 #151② · wrongMark 条 2）**：`Soon as he comes home, I will tell him.` ❌（**`wrongMark: "Soon"`**，**`word_order`**——**两头都要卡住**；whyZh「**第 142 课回流**：两头都要卡住——少一头 as，「一…就…」就散架：As 【soon as】 he comes home。」；**本 PRD 实跑 diffScore ＝ 9**）；③ **真错卡（回流 #152③ · wrongMark 条 3）**：`As soon as I finish, I eat.` ❌（**`wrongMark: "eat"`**，**`tense`**——**后面那件还没发生，要带上 will**；whyZh「**第 143 课回流**：后面那件还没发生，要带上 will——As soon as I finish, I 【will eat】。」；**本 PRD 实跑 diffScore ＝ 88**）；④ **双正解卡（本课脊柱卡 · 六格排一行 · 跨课总收）**：`As soon as he comes home, I will tell him.` ✅ 并排 `After I do my homework, I watch TV.` ✅（**`bothRight: true`，`wrongMark: null`**；whyZh「**两句都对，都是「后面跟一整句」的老成员**：第 90 课 after 是「做完之后」，今天 as soon as 是「一到就」——**同一个家族，第六行。**」；**`After I do my homework, I watch TV.` 逐字取 L90 `:16722`，一字不改**；**本 PRD 实跑 diffScore ＝ 10 ✓**）；⑤ **双正解卡（`when` 与 `as soon as` 的刻度总收 · 第 143 课回流）**：`When I finish, I will eat.` ✅ 并排 `As soon as I finish, I will eat.` ✅（**`bothRight: true`，`wrongMark: null`**；whyZh「**两句都对——第 143 课那一对**：when 管「那时候」，as soon as 管「一到就」，差在「那段时间」和「那一刻」。」；**本 PRD 实跑 diffScore ＝ 13 ✓**）；⑥ **双正解卡（两件同时那一行 · 跨课接口）**：`As soon as I finish, I will eat.` ✅ 并排 `While I was reading, he was sleeping.` ✅（**`bothRight: true`，`wrongMark: null`**；whyZh「**两句都对，都在时间家族这一页上**：第 98 课 while 说「两件同时」，今天 as soon as 说「一到就」——**六行里，一行管同时、一行管紧接。**」；**`While I was reading, he was sleeping.` 逐字取 L98 `:18237`，一字不改**；**本 PRD 实跑 diffScore ＝ 0 ✓**）。**⚠️ 生产红线**：本课 **①②③ 三条带 mark（全回流、锚本批）**；**三组双正解本 PRD 实跑 10／13／0 全部 < 90 ✓**；**③ 的 88 是错卡，须登记**；**⚠️ 四句同屏上限照批二十口径（五句同屏为满），本课涉及四句，未满** |
| 变体三态 | 肯定 `As soon as he comes home, I will tell him.`（10 词）／否定 `As soon as he comes home, I will not tell him.`（11 词；noteZh：「不」站在 will 后面）／疑问 `Will you tell him as soon as he comes home?`（10 词；noteZh：**`Will` 搬句首**）。**⚠️ 收口课纪律**：变体**只做一组三态**（**不得**给六句各做一套——**六套＝把一课变六课，破零新知红线**）。**⚠️ 空位登记**：三态在 ambush 侧落 `As`／`As`／`Will`；**boost 侧本课保障句另设（见下）** |
| 复现题设计（practice 6 题 · 沿用 L124／L133／L138／L141 六题形态） | 第 1 题 **变体逐字题**（取疑问卡 `Will you tell him as soon as he comes home?`）；第 2 题 **回流 L142 目标句**（`As soon as he comes home, I will tell him.`）；第 3 题 **回流 L143 目标句**（`As soon as I finish, I will eat.`）；第 4 题 **复现 L90**（`After I do my homework, I watch TV.`，**逐字取 `:16722`**，**实测头寸 n=2，剩 4 ✓**）；第 5 题 **复现 L91**（`Before I eat, I wash my hands.`，**逐字取 `:16911`**，**实测头寸 n=3，剩 3 ✓**）；第 6 题 **复现 L98**（`While I was reading, he was sleeping.`，**逐字取 `:18237`**，**实测头寸 n=1，剩 5 ✓**）。**每课 ≥1 复现题 ✓（本课 3 道）**。**⚠️ 本课 boost 侧保障句在 `sceneSwings[3]`**（`We will eat as soon as he comes home.` → **本 PRD 实跑 `t1` ＝ `soon` ★／`t2` ＝ `soon` ★——本批唯一一课两个档都落考点词**）。**⚠️ 生产红线**：**六题 `tokens` 词集与 `answer` 逐字一致**；**practice 与 examples 重合须 < 6**（`examples` 四条 ＝ target／`As soon as I finish, I will eat.`／`When it is sunny, I run.`／`While I was reading, he was sleeping.` → **重合 3 题 < 6 ✓**）；**⚠️ `When it is sunny, I run.` 在 L144 只进 `examples` 不进 `practice`——这是为 practice 六题留头寸的有意安排** |
| 各题 `distractors` 建议 | 第 1 题：`["Do"]`；第 2 题：`["Does"]`；第 3 题：`["When"]`；第 4 题：`["Before"]`；第 5 题：`["After"]`；第 6 题：`["When"]`。**均不得与答案词重复**；**均须是库内已学的真词** |
| 各题 `tokens` 逐字（生产期照抄） | 第 1 题 `["Will","you","tell","him","as","soon","as","he","comes","home?"]`；第 2 题 `["As","soon","as","he","comes","home,","I","will","tell","him."]`；第 3 题 `["As","soon","as","I","finish,","I","will","eat."]`；第 4 题 `["After","I","do","my","homework,","I","watch","TV."]`；第 5 题 `["Before","I","eat,","I","wash","my","hands."]`；第 6 题 `["While","I","was","reading,","he","was","sleeping."]` |
| guided 6 步 | ① `choose`（`___ he comes home, I will tell him.` 选项 `As soon as`／`Soon as`／`As soon`，答案 `As soon as`）；② `arrange`（target，10 token）；③ **`spot`（`tokens: ["As","soon","as","he","will","comes","home,","I","will","tell","him."]`，`wrongToken: "will"`**——**⚠️ 本处 `tokens` 里有两个 `"will"`（下标 4 与 9），`wrongToken: "will"` 与元素逐字相等（`includes` 为 true ✓），引擎 `findIndex` 取第一个（下标 4）——正是要点的那个 ✓，须生产期逐字核**；`answer: "will"`；`correctionZh`「第 142 课回流：前面那件说现在，不请 will：【去掉 will】。As soon as he comes home, I will tell him。」）；④ `arrange`（**R8 跨课复现 L90**：`After I do my homework, I watch TV.`）；⑤ `arrange`（**R8 跨课复现 L98**：`While I was reading, he was sleeping.`）；⑥ `replace`（`replaceBase: "As soon as he comes home, I will tell him."`／`replaceTarget: "换成第 143 课 when 说的版本"`／`options: ["When he comes home, I will tell him.","When he will come home, I will tell him.","Soon as he comes home, I will tell him."]`／`answer: "When he comes home, I will tell him."`；`explain`：「换位置：when 管「那时候」——**两句话只差一刻。**」） |
| recall 三字段 | `promptZh`：饭桌收拾干净了。你翻开本子，这一页上排了六行，最后一行是新学的那句。凭记忆，写出这一句。／`intentZh`：他一回来我就告诉他。／`answer`：target／`noteZh`：「时间家族六行，都是「后面跟一整句」；as soon as 那一行跟第 48 课 if 一样——前面说现在，后面说将来。」（**零术语自查 ✓**） |
| 案 | `hunt-close-23`（**#153**，§11） |
| 新词 | **0 个** |
| 本课定位说明（写进生产单） | **收口课但不是新知识课**：L144 的教学价值 ＝ **兑现「排一行」的对照动作**（把学生在 L142／L143 练过的两句请回来并排），**不是新增结构**。**故 `grammarLabel` 不得写成新句型标签**（写作「收口 · 零新知（六格排一行）」）。 |
| 术语红线自查 | 用「排一行／六行／六格／后面跟一整句／那道线一到就停／领一整句」；**禁「从句」「状语」「连词」「时态」「语序」**——**收口课要「总结一章」，最易随手写「本章讲的是时间状语从句」**，**三字段已逐字自查** |
| 走查观察点 | **六行是否被记住**（走查问「这一页上有几行」——**正确反应是「六行」**）；**第六行的规矩是否接上**（走查问「最后一行的规矩跟哪一课一样」——**正确反应是「第 48 课 if 那条：前面说现在、后面说将来」**）；**反向风险＝学生以为 `as soon as` 只能接「回来」这种动作**（走查问「`As soon as I finish, I will eat.` 对不对」——**正确反应是「对——as soon as 领的是「一到那一刻」，什么动作都行」**） |

---

## §3 L109 冲突的处置专章（脊柱一）——零雨线的落地

### 3.1 L109 的 6 处锁定（逐条行号）

**来源**：数析 §2.2 逐处实读 ＋ 本 PRD 逐行复读确认。**冲突的实质是「一个词形的冲突」而不是「场景或语义的冲突」**——`stops` 这一个形式在 L109 被设为错项，而 `as soon as` 的正确形式恰是 `stops`。

| # | 位置 | 逐字 | 性质 | 本 PRD 复读 |
|---|---|---|---|---|
| ① | `:20328` | `wrong: "I waited until the rain stops."` | 🔴 contrast 错项 | ✅ 已复读 |
| ② | `:20329` | `wrongMark: "stops"` | 🔴 错点标记 | ✅ 已复读 |
| ③ | `:20390` | `"until the rain stops ❌ / will stop ❌ —— 两边都得用昨天版"` | 🔴 summary 里的错例 | ✅ 已复读 |
| ④ | `:20400` | `options: ["until the rain stopped", "until the rain stops", "until the rain will stop"]` | 🔴 guided choose 的**第 2 个选项**（错项） | ✅ 已复读 |
| ⑤ | `:20422`／`:20423`／`:20424` | `tokens: ["I","waited","until","the","rain","stops."]`／`wrongToken: "stops."`／`answer: "stops."` | 🔴 guided spot 错点 | ✅ 已复读 |
| ⑥ | `:20451` | `distractors: ["stops"]` | 🔴 practice 第 1 题干扰项 | ✅ 已复读 |

**另外三处同类锁定（电影线，本批一并规避）**：

| # | 位置 | 逐字 | 性质 |
|---|---|---|---|
| ⑦ | `:20442`／`:20443` | `options: ["I waited until the movie ended.", "I waited until the movie ends.", "I waited until the movie will end."]`／`answer: "I waited until the movie ended."` | 🔴 `ends` 也被设为错项 |
| ⑧ | `:20465` | `distractors: ["ends"]` | 🔴 `ends` 再次被设为干扰项 |
| ⑨ | `:20317`／`:20373`／`:20441`／`:20466` | `We waited until the movie ended.`（examples／sceneSwings／replace／practice 四字段各一处） | 🔴 `the movie ended` 是 L109 自己的道具 |

**案件侧锁定（HC）**：

| # | 位置 | 逐字 | 性质 |
|---|---|---|---|
| ⑩ | 案 #118 `hunt-until-rain` `:6869` | `tokens: [..., "the", "rain", "stops.", ...]` | 🔴 `stops.` 是案内 token |
| ⑪ | 同上 `:6884-6885` | `original: "stops."`／`correction: "stopped."`／`tag: "tense"` | 🔴 案层红线（「雨停 ＋ stops」组合被锁） |

**叙事侧锁定（跨批）**：

| # | 位置 | 逐字 | 性质 |
|---|---|---|---|
| ⑫ | L139 `:26192` | 「**场景也是接着第 109 课那场雨的**：那回小美在屋檐下一直等，等到雨停（I waited until the rain stopped.）；这回她不等了，撑着伞就出去」 | ⚠️ **跨批连续剧（批二十二已续写）** |

> **量化口径（数析 §2.1／§2.2 实读，本 PRD 复验）**：**`stops` GL 9——L109 占 8（8/8 是错项身份）／L94 占 1**；**`stopped` GL 45——L109 占 41／L110 3／L139 1**；**`ends` GL 2、`ended` GL 8——两串 100% 在 L109**；**`the movie` GL 8——全在 L109**；**`rain` GL 105——12 课共用，L109 占 45（42.9%），不独占**；**`raining` GL 253——批二十二三课（L139–L141）占 155（61.3%）**。
> **→ 结论**：**「雨停」这个场景在库里共被锁 6 处（GL `stops` 3 处 ＋ GL `ends` 2 处 ＋ HC `stops` 1 处），且「那场雨」已是跨批叙事资产。** 只要 L142–L144 里出现「一到…就停」的时间线，就会与 L109 的错项形状正面相撞；**任何「`stops` 是对的」新句子都会直接冲突**。

### 3.2 零雨线纪律（全批禁用词清单，G13 硬核验）

**L142–L144 三课的任何字段（`title`／`grammarLabel`／`sceneSetupZh`／`dialogueEn`／`dialogueZh`／`intentZh`／`targetSentence`／`blocks`／`oneLineRule`／`examples`／`dialogue`／`contrast`／`variants`／`sceneSwings`／`deepDive`／`summary`／`guided`／`practice`／`recall`／`huntCaseIds`）里，下列词零出现**：

| 类别 | 禁用词 | 依据 |
|---|---|---|
| **雨线核心** | `rain`／`raining`／`rainy`／`rains` | L109 ＋ L139–L141 连续剧 |
| **雨线动词** | `stops`／`stopped`／`stop`／`stopping` | L109 `:20451`／案 #118 `:6884`——**`stops` 是 L109 的错项身份** |
| **雨线整串** | `the rain stops`／`the rain stopped`／`waited until`／`I waited` | L109 身份串（`the rain stopped` GL 36，L109 占 33＝91.7%） |
| **电影线** | `movie`／`ends`／`ended`／`the movie ended`／`the movie ends` | L109 `:20442`／`:20465`——**100% 在 L109** |
| **until 本词** | `until`／`till` | L109 的身份词（**本批只在「引规则不引句」处用中文「等到」，英文 `until` 零出现**） |

> **派生的替代动作（本批必须执行）**：**L48 的原句 `If it rains, I will stay at home.` 含 `rain`，本批不引用**——**改用 L48 的另一句 `If it is sunny, we will play outside.`**（L48 `:8786` 逐字在库；实测 GL 1／HC 0）。**这一句同样带「if 里说现在、主句说将来」的机制，教学效果等价，且零雨线。**

> **核验口径（G13，唯一允许的两种落地方式）**：① **机检**：对 L142–L144 三课的全部字段做 `\b(rain|raining|rainy|rains|stops|stopped|stop|stopping|movie|ends|ended|until|till|waited)\b` 正则扫描，**命中必须为 0**；② **人工核**：逐课把 `contrast`／`deepDive`／`summary` 三段读一遍（**这三个字段最容易顺手写出「雨」**）。

### 3.3 场景锚「等家人回来吃饭」的设计

**设计原则**：避开三条已占线——**雨线**（L109 ＋ L139–L141）／**电话线**（L99，`phone` 占 41/52、`rang` 占 49/65）／**电影线**（L109，`ended` 8/8、`ends` 2/2）。

**推荐场景锚**：**傍晚，小美在家里等家人回来一起吃饭**（`scene: "mansion"`——库内第一高频场景，50 课在用）。

| 课 | 场景 | 三个零件 | 库内实证〔本 PRD 复验〕 |
|---|---|---|---|
| **L142** | 傍晚，饭桌上还空着一个位子 | `he comes home`／`I will tell him`／`Dinner is ready!` | **`comes` GL 15／HC 2**（**在库的三单形式**）；**`home` GL 97／HC 40**；**`tell` GL 6／`him` GL 156**；**`Dinner is ready!` 逐字取 L91 `:16924`** |
| **L143** | 同一张桌子，换个说法再摆一次 | `When I finish` ↔ `As soon as I finish` | **`finish` GL 66／HC 6**；**`eat` GL 103／HC 30**；**`When it is sunny, I run.` 是 L92 原句**（`When I finish, I will eat.` 全库 0 处，**新句、须登记**） |
| **L144** | 饭桌收拾干净，本子上排一行 | 六格六句 | 六格原句见 §2.2 收口课表（**五句在库 ＋ until 一格引规则**） |

**关键：场景的三个零件「零撞车」实证**：

- ✅ **`comes` GL 15**（**`huntCases.ts` HC 2**）——**数析 §1.5 的三单盘点结论：57 个常见三单形式里 23 个真零**（`arrives`／`rings`／`gets`／`finishes`／`calls`／`brings`／`finds`／`gives`／`happens`／`knows`／`lives`／`loves`／`needs`／`sees`／`sleeps`／`stands`／`tells`／`turns`／`walks`／`works`／`writes`／`snows`／`shines`），**`comes` 是在库的 34 个之一**——**本批选它的理由正是「它是现成的三单形式」**。
- ✅ **`dinner` GL 69**（L106 37／L90 11／L110 11）——**无独占场景冲突**（L106 是 `let him play after dinner`，与「等人回来吃饭」不冲突）。
- ✅ **`ready` GL 8**（L7／L1／L91／L129）——**L91 `:16924` 已有 `Dinner is ready!`**，**本批可作接口复现**；**实测该句 practice 答案出现 0 次，头寸满 6 ✅**，**但本批只作对白／arrange 素材，不进 practice 答案**（**留给后续批次**）。
- ✅ **零造词（除 `soon`）**：本批所有场景零件全在库。

**⚠️ 与竞析推荐场景的对照（必须明写）**：

| 竞析／路线图候选 | 词架实读〔数析〕 | 判定 |
|---|---|---|
| `The phone rings` | **`rings` GL 0（真零）**；`phone` L99 占 41/52、`rang` L99 占 49/65 | ❌ **不可用**（造词 ＋ 撞 L99） |
| `I get the letter` | `letter` GL 8（**全是「写信／被写」义**）；**`get` 的语义已被 L107／L108／L120–L124 三处占满** | ⚠️ 勉强（搭配受阻） |
| `The movie ends` | **`ends` GL 2／`ended` GL 8／`the movie` GL 8——100% 在 L109** | ❌ **不可用**（不是换场景，是换壳） |
| **本批：等家人回来吃饭** | `dinner` 69／`comes` 15／`home` 97／`eat` 103／`finish` 66／`ready` 8 | ✅ **零撞车、零造词** |

**L144 的「until 那一格」处置（本批唯一的收口难题）**：

**问题**：L109 的两句（`I waited until the rain stopped.`／`We waited until the movie ended.`）**分别踩雨线与电影线**——**本批已裁「零雨线」，而电影线的 `ends`／`ended` 也已被 L109 锁为错项**。

**裁决：取瑞思 §4.1 方案 1——引规则不引句。**

- **L109 `:20387` `summary.rule` 不是句子，是规则**（逐字「说「一直等到…为止」：until + 那道线（I waited until the rain stopped）——两边都用昨天版」）；**`summary.points` 第 1 条（`:20389`）也不是句子**（逐字「I waited until the rain stopped. —— 前面一直做，那道线一到就停」）。
- → **L144 的 until 那一格只引规则的后半截**：**「前面一直做，后面那道线一到就停」**（**中文表述，不含英文 `until`／`rain`**），**不引整句**。
- **代价：收口课的复现位从 6 句降到 5 句**——**登记为 G 项**（§10 G12-b）。
- **先例**：**L141 `:26511` 一带的 `oneLineRule` 就是「引结构不引新句」**（逐字「这一章两张脸排一行：Although 站最前面领一整句（Although it is raining, I will go out）；but 站中间接两半（It is raining, but I will go out）——只留一个。」——**两句都是本章自己的句子，不是引别课**）。

---

## §4 与 L48 的机制复用专章（脊柱二）——「同一机制第二次应用」

### 4.1 要复用的对象：L48 的全部家底（逐字实读）

| 项 | 行号 | 逐字 |
|---|---|---|
| `id`／`number` | `:8766`／`:8768` | `lesson-48-if-rain`／`48` |
| `grammarLabel` | **`:8767`** | **`条件句 · if 里说现在`** |
| `targetSentence` | `:8777` | `If it rains, I will stay at home.` |
| `blocks` | `:8778-8782` | `{ text: "If it rains", role: "如果下雨（说现在）" }` ／ `{ text: "I will stay", role: "我就待着（说将来）" }` ／ `{ text: "at home", role: "在家" }` |
| **`oneLineRule`** | **`:8781`** | **「说「如果…就…」：if 里说现在（If it rains），主句说将来（I will stay）——if 里不用 will，「如果的路面用现在时铺」。」** |
| `examples` ④ | **`:8786`** | **`If it is sunny, we will play outside.`**（**本批引用的那一句，零雨线**） |
| `contrast` ① | **`:8795-8799`** | **`wrong: "If it will rain, I will stay at home."`／`wrongMark: "will rain"`／`correct: "If it rains, I will stay at home."`／whyZh「if 里说现在，不用 will：If it rains——「如果的路面用现在时铺」。中文说「如果会下雨」，英语的 if 里不带 will。」** |
| **`summary.rule`** | **`:8852`** | **「如果…就…：if 里说现在（If it rains），主句说将来（I will stay）——if 里不用 will。」** |
| 同型判例（案 #57） | `:3643-3647` | `tokenIndex: 4`／`tag: "verb_form"`／`original: "will"`／`correction: "去掉 will"`／explanation「if 里说现在，不用 will：If it rains——「如果的路面用现在时铺」。」 |

### 4.2 复用方式（本批逐课落点）

| # | 复用件 | 落点 | 定稿 |
|---|---|---|---|
| **1** | **L48 `:8786` 的句子（零雨线版）** | L142 `contrast` ④（**双正解**）／L143 `contrast` ⑤（**双正解**）／L142 `practice` 第 3 题（**复现题**）／L143 `examples` | **`If it is sunny, we will play outside.`**——**逐字取，一字不改** |
| **2** | **「前面说现在、后面说将来」这句话** | L142 `oneLineRule`／`summary.rule`／`recall.noteZh` | 「前面那件说现在，后面那件说将来」——**照 L48 `:8781` 的说法，只把「主句」换成「后面那件」** |
| **3** | **「路面」比喻** | L142 `contrast` ① 的 whyZh | 「**前面那件是路面，铺好了后面那件才开得过去**」（L48 `:8798` 的「如果的路面用现在时铺」的**同一比喻、换一个说法**） |
| **4** | **案 #57 的判例话术** | 案 #151 第 ② 处错的 `explanation` | 「if 里说现在，不用 will」→ **本批改写成「as soon as 里说现在，不请 will」** |
| **5** | **「同一规矩第二次应用」这句定位** | L142 `deepDive` | **「第 48 课那条规矩——前面那件说现在、后面那件说将来——今天换一个词再站一次岗。」** |

### 4.3 ⚠️ 三条防串台纪律（写进生产单）

1. **不得重讲 L48 的内容**——**「if 里说现在」这条在 L48 已教完**；**L142／L143 的 `guided` ③ 与 `practice` 第 3 题只做 `arrange`／`practice` 复现（`If it is sunny, we will play outside.`），一个字的规则都不重讲**（**只在 `contrast` ④／⑤ 的 whyZh 里点名「第 48 课」**）。
2. **不得改 L48 一个字**（`:8762`–`:8860` 一带全段冻结）——**本批引用的那一句（`:8786`）逐字照抄**（G14）。
3. **不得把 L48 的 `if` 与 `as soon as` 混成一课**——**两课各守各的词**：**`if` 管「如果」，`as soon as` 管「一到」**；**L142 的 `deepDive` 必须把这条差异写清**（**否则学生会以为「`if` 和 `as soon as` 是一个词的两种写法」**）。

### 4.4 ⚠️ 诚实标注：「重复感」是本批最大的产品风险

**本批的新规矩（前面说现在、后面说将来）是 L48 已教过的同一条**——**教学上这是巨大的便利**（有现成脚手架，学生只需换一个词）；**产品上这是「一章里最值钱的一课其实是复现」**。

**处置（三条，缺一不可）**：

1. **L143 必须把这条规矩做成第二次切开**（**同一规矩的两面**：L142 讲「前面多了 will」／L143 讲「后面少了 will」）——**把重复变成复现**（瑞思 §5 L142 第一条的处置逐字）。
2. **L142 的 `deepDive` 必须明写「这是同一条规矩的第二次应用」**——**不许含糊过去**（**含糊＝学生觉得「又讲一遍」，写明＝学生觉得「我学过，我只是换了个词」**）。
3. **走查单列观察「重复感」**（§10 G-A9）——**观测点：L142 的跳过率与完成时长**（**若 L142 的完成时长显著低于 L143，说明学生把它当复现课，这是好现象；若显著高于 L143，说明它在重讲 L48，须回炉**）。

---

## §5 与 L65 `as tall as` 的切开专章（脊柱三）

### 5.1 撞车风险量化（数析 §1.2 实读，本 PRD 复验）

| 词／串 | GL 词次 | GL 串 | HC 词次 | HC 串 | 分布 |
|---|---|---|---|---|---|
| **`as`** | **133** | **70** | **13** | **9** | **GL：L65 120／L71 10／L109 2／L78 1；HC：全在案 #74** |
| **`as tall as`** | **38** | 38 | **3** | 3 | **GL：L65 36／L71 2；HC：#74 3** |
| `as smart as` | 6 | 6 | 0 | 0 | 全在 L65 |
| `as new as` | 3 | 3 | 0 | 0 | 全在 L65 |
| **`as as`（连续两词）** | 0 | 0 | 0 | 0 | 🔴 零（无 `as as` 连写） |
| `same as`／`the same as` | 0 | 0 | 0 | 0 | 🔴 零（`same` GL 2：L112／L138，**无 `as` 搭配**） |

**逐课拆解（本 PRD 复验）**：

| 课 | `as` 词次 | 用法 | 代表行号 |
|---|---|---|---|
| **L65** | **120（90.2%）** | **`as…as` 比较**（「一样」家） | `:11977` `He is as tall as me.`／`:12006-12009` 的 contrast |
| **L71** | 10 | 复现 L65 | `:13168`／`:13172`／`:13240-13242` |
| **L109** | 2 | **`as` 作连接义的 `bothRight` 认读位** | **`:20346`／`:20350`** |
| **L78** | 1 | `distractors: ["as"]`（干扰项字段，非用法） | `:14598` |

> **口径订正（本批须明写）**：**批二十二记的是「`as` GL 70 处」，那是串口径**；**本轮实测为 133 词次／70 串**（`grep -ow as` ＝ 137 → 剔 `:11969` 的 id 串 2 个 ＋ `:11967` 批九注释行 2 个 ＝ **133**）——**L65 仍绝对主导（120／133 ＝ 90.2%）**，**绝对数须按 133／120 更新**（数析 §1.2／附录 C② 完整定位）。

### 5.2 切开的内容（逐条）

| # | 切面 | L65 讲到哪 | 本批讲什么 | 落点 |
|---|---|---|---|---|
| **1** | **两个词的用法** | **`as tall as`＝两个 `as` 夹住一个词**（`tall`／`smart`／`new`），说「一样」 | **`as soon as`＝两头 `as` 中间夹 `soon`，但后面跟的是一整句**，说「一到就」 | **L142 `deepDive` ＋ `contrast` ② 的 whyZh** |
| **2** | **两头卡住的家规** | **`:12009` 逐字「两头都要卡住：少一头 as，「一样」就散架」** ＋ 案 #74 `:4694-4700` 的 `original: "tall"`／`correction: "as tall"` | **同一条家规：少一头 `as`，「一…就…」也散架**——**但两处少的位置不同**（L142 少第一头／L143 少第二头） | **L142 `contrast` ② ＋ L143 `contrast` ④** |
| **3** | **中间夹的是什么** | 夹的是**形容词**（`tall`／`smart`／`new`） | 夹的是 **`soon`**（**一个词，且本批才第一次见**） | **L142 `deepDive`** |
| **4** | **语义场** | 「**一样**」（比较） | 「**一到就**」（时间衔接）——**两者在句子里的形状没有任何重叠** | **L142 `oneLineRule` 的末句** |

### 5.3 「一个词、两张脸」话术（零术语，定稿逐字）

> **「`as` 这个字有两份活：第 65 课那种是**两个 `as` 夹住**说「一样」（as tall as——中间夹的是「多高」那种词）；今天这种是**两头 `as` 中间夹 soon** 说「一到就」（as soon as——后面跟的是一整句）。**同一个字、两张脸——看它后面跟的是什么。**」**

**⚠️ 三条护栏（写进生产单）**：

1. **不得写「L65 的 `as` 只夹一个词、本批夹一整句」这种以「长短」为切面的话**——**正确的切面是「夹的是什么 + 后面跟什么」**（`as tall as` 后面也可以跟一整句：`He is as tall as his brother is.` 在语法上成立；**用「长短」当切面会被打脸**）。
2. **不得在本批重讲 L65 的「一样」规则**——**L142 只在 `deepDive` 与 `contrast` ② 的 whyZh 里各点名一次，一个字的规则都不重讲**。
3. **不得改 L65 一个字**（`:11969`–`:12160` 一带全段冻结）——**案 #74 的 `:4694-4700` 也一字不改**（**本批只引用它的 `explanation` 话术**）。

---

## §6 中文负迁移处理专章（逐课）

> **格式**：每条给「中文怎么说 → 学生会写成什么 → 库内的实测证据／判据 → 课的处置」；**依据是上游明文（Cambridge Warning 框／BC 参考层／中文侧 `after` 专文）＋ 库内同型先例 ＋ 本批实读**。

### 6.1 L142 —— **「一到」里的那个「一」被直译成 `will`（本章主靶）**

- **中文**：「他一回来**就**告诉他」——**中文的「一…就…」在口语里常带「将要」的味道**（「他**会**一回来就…」）。
- **学生会写**：`As soon as he comes home, I will tell him.` ✅ 对；**但更常见的是** `As soon as he **will** come home, I will tell him.` ❌。
- **判据〔三源明文同轴〕**：
  - **Cambridge `conjunctions-time` 的 Warning 框逐字**：「**We don't use will after conjunctions referring to future time**」——**第二条例句逐字就是 `I will call you as soon as I get to the office.`（`Not: … as soon as I will get to the office.`）**〔竞析 §1.1 C-1〕。
  - **BC 参考层逐字**：「We do not normally use will in time clauses and conditional clauses.」（四条例句全部标 `(NOT …)`）〔竞析 §1.2 B-1〕。
  - **中文侧 `after` 专文逐字**：「明明是講「之後」的事，整句卻常常用現在式或過去式，不用未來式……要寫 after class ends，而不是 after class will end」＋❌`I'll call you after class will end.`〔竞析 §1.4 E-2〕。
  - **库内同型先例已上线**：**L48 `:8795-8799` 的 `wrong: "If it will rain, I will stay at home."`／`wrongMark: "will rain"`**；**案 #57 `:3643-3647` `original: "will"`／`correction: "去掉 will"`／`tag: "verb_form"`**。
- **课的处置**：**L142 的新错①必须是「前面多了 will」**（`As soon as he will come home` → 去掉 `will`）；**并且 `contrast` ① 的 whyZh 必须点名 L48**（「第 48 课那条规矩再看一遍」）。
- **⚠️ 诚实标注**：**本靶是「同一个规矩的第二次应用」，不是新规矩**——**L143 必须用它做第二次切开**（同一规矩的两面：前面多 will／后面少 will），**把重复变成复现**（§4.4）。

### 6.2 L142 —— **「一到就」被理解成「立刻」（`soon` 的语义错位 ＋ 两头少一头）**

- **中文**：「一到就」＝**两个动作紧挨着**；但 `soon` 单用是「不久之后」（时间副词）。
- **学生会写**：`Soon as he comes home, I will tell him.` ❌（丢第一个 `as`）／`As soon he comes home, …` ❌（丢第二个 `as`）／`I will tell him soon he comes home.` ❌（整个结构散架）。
- **判据〔实读〕**：**L65 `:12006-12009` 的 contrast 逐字 `wrong: "He is tall as me."`／`wrongMark: null`／whyZh「两头都要卡住：少一头 as，「一样」就散架」**；**案 #74 `:4694-4700` 第一处错正是 `tall` → `as tall`（`tag: "word_order"`）**。
- **课的处置**：**L142 的新错②必须是 `Soon as …` → `As soon as …`（`word_order`）**，**理由话术直接复用 L65 的「两头卡住」**——**同一个句法位置、同一个类比，学生能在两课之间接上**。**这是本批最值钱的一条负迁移处置：它把 L65 的知识直接变成 L142 的脚手架。**

### 6.3 L143 —— **「当…的时候」与「一到…就…」在中文里有时同义**

- **中文**：「我吃完饭**就**吃」「我吃完饭**的时候**吃」——**两个说法在中文里常常能互换**。
- **学生困惑**：**既然 `when` 也能说，为什么要学两个？**
- **判据〔原文级〕**：**Cambridge `as-when-or-while` 逐字「Depending on the context, when can mean 'after' or 'at the same time'」＋「We often use just with when or as to express things happening at exactly the same time」（`The phone always rings just when I'm closing the front door.`）**〔竞析 §1.1 C-8〕——**`when` 要表「紧接」须借 `just`，`as soon as` 是「紧接」的专用式**。
  库内先例：**L98 `:18306-18310` deepDive 已做过一次「两个时间连词的分工」教学**（`when` 管打断、`while` 管并行）〔瑞思 §5〕。
- **课的处置**：**L143 照 L98 的「分工」形态**——**`when` 管「那段时间里」，`as soon as` 管「一到那一刻、马上」**。**⚠️ 这是本课唯一的话术难点：两个词义差只有一刻度，必须靠「同一个开头、同一个后面」的并排（照 L140 的 `contrast` 形态）而不是靠解释。**
- **诚实标注**：**这条负迁移的强度是「弱」**〔推断〕——**中文里两个词确实常互换，学生会觉得「学一个就够」**。→ **本课的成败完全取决于并排形态是否做出「一刻之差」的观感**（**建议 F23-A 打样门专测这一课的跳过率**，§10 G-A8）。

### 6.4 L143 —— **后件「还没发生」的 `will` 漏掉**

- **中文**：「我一做完**就**吃」——**中文的「就」不带将来标记**，学生容易两边都不带 `will`。
- **学生会写**：`As soon as I finish, I eat.` ❌（**前后都现在**——但后面那件是将来）。
- **判据〔实读，库内先例〕**：**L141 `:26520` 一带的 contrast 逐字 `wrong: "Although it is raining, I go out."`／`wrongMark: "go"`／whyZh「第 139 课回流：说的是「等下要出去」——后面那句要用 will。」**（**同型：后件漏 will**）。
- **课的处置**：**L143 的新错②必须是「后面少了 will」（`eat` → `will eat`）**——**这是与 L142 新错①方向相反的第二刀**；**两课合起来把「前面不用 will、后面必须 will」这条规矩的两面切完**。

### 6.5 L144 —— **收口课无新负迁移**

- **判据〔实读〕**：**收口课先例 15 课的 `grammarLabel` 全部含「零新知」**（L94「大团圆（零新知）」／L133「零新知（五张脸排一行）」／L138「零新知」／L141「零新知（两张脸排一行）」等）——**零新知课不引入新语言点，故不引入新负迁移**。
- **本课唯一的负迁移处置＝复现**：**把 L142／L143 的两条负迁移各用一句照出来**（照 L141 的收口做法：L141 `:26502` 一带的三条真错卡全部标「第 139 课回流」「第 140 课回流」）。

### 6.6 ⚠️ 一条「不构成负迁移但必须登记」的混淆项：`once`

- **`once` 的两张脸**〔实读〕：**`once` GL 11 全部在 L72，全部是「一次」的频率义**（`I read once a month.`／`once a week`／`once a month`）；**英语的 `once` 还有「一旦」的连接义，与 `as soon as` 近义**——**Cambridge `once` 语法页逐字「We use once as a conjunction meaning 'as soon as' or 'after'」**。
- **本批处置（比竞析更严）**：**`once` 全批零出现**（不教、不复现、`contrast` 里也不出现）——**理由：写进任何字段都会被读成「换词」，反而会让学生以为「`as soon as` 和 `once` 是一回事」，把 L143 好不容易做出的「一刻之差」冲掉**。
- **→ 登记为后续研究项**（§13 序 3）；**本批的 `contrast` 里不得出现 `once` 这个词**（作 G 项校验，§10 G11-c）。

### 6.7 零术语红线与替换表（本批最容易越线的六个词）

**红线〔本 PRD 实读 `grammarZeroTerms.ts:17-27`〕**：**29 词**逐字 ＝「主语、谓语、宾语、表语、定语、**状语**、单数、复数、三单、原形、**时态**、一般过去时、一般现在时、现在进行时、过去进行时、现在完成时、情态动词、比较级、最高级、**从句**、**语序**、可数、**疑问句**、否定句、被动语态、第三人称、**形容词**、**副词**、**介词**」。

**「连词」与「主句」的裁决（须明写，因为这两个词最容易被误判）**：

- **「连词」不在 29 词表内**——`grammarZeroTerms.ts` 的文件注释逐字：「**不包含「动词 / 名词 / 连词 / be 动词」——课程从第 1 课起就把它们当作自己的教学词使用**（"be 动词 · I am"、"like + 名词"），首屏长期如此且自洽」；**它是 L19／L20 的既有标签**（`:3415` 逐字「**连词** · and / but」／`:3598` 逐字「**连词** · because / so」）→ **可用**。
- **「主句」不在 29 词表内，且 L48 已在用**（`:8781` 逐字「主句说将来」）→ **可沿用**——**本批的用法纪律：只在引用 L48 原文时保留「主句」二字，本批自撰处一律写「后面那件」**（**因为「主句」与「从句」是配套词，用多了会把「从句」带出来**）。
- **但本批定稿三字段仍不用「连词」**——**理由**：本批的核心是「**哪一头**」与「**说现在／说将来**」，不是「它是什么词」；**用「连词」会把学生的注意力引向词性**。

| 禁写（会被机检命中） | 改写成 | 依据 |
|---|---|---|
| ❌「as soon as 引导**时间状语从句**」 | ✅「**as soon as 领一整句**」 | **「状语」「从句」在 29 词表内**；「领一整句」是 **L92 `:17105` 逐字已有的话术**（「when 也领一整句」）／L109 `:20350` 逐字「as 也能领一整句」 |
| ❌「**从句**里用现在时」 | ✅「**前面那件说现在**」 | **「从句」「时态」在 29 词表内**；「说现在／说将来」是 **L48 `:8781` 逐字的现有说法** |
| ❌「**主句**用将来时」 | ✅「**后面那件说将来**」 | 同上（**「主句」可用，但本批自撰处不用**） |
| ❌「换一下**语序**」 | ✅「**两头都要卡住**」 | **「语序」在 29 词表内**；「两头都要卡住」是 **L65 `:12009` 逐字** |
| ❌「中间夹的是**副词** soon」 | ✅「**中间夹的是 soon 这个词**」 | **「副词」在 29 词表内** |
| ❌「两件事的**时态**要一致」 | ✅「**前面说现在，后面说将来**」 | **「时态」在 29 词表内**；L48 `:8781` 的现成说法 |

**本批额外禁词（非机检覆盖，人工核）**：**「从句」「时间状语从句」「状语」「语序」「时态」「副词」**（六词）＋ **「门牌」**（防与 L67 的 `at` 门牌串台，沿用批二十一／二十二纪律）＋ **「让步」「转折」**（**批二十二用过的词，本批一个字都不沾**——**防批次串台**）。

**⚠️ 一条本批特有的术语陷阱**：**`as soon as` 的教科书解释必然是「时间状语从句 ＋ 主将从现」**——**两个说法都是红线词**（`状语`／`从句`）。→ **`deepDive` 允许保留术语**（`grammarLessons.test.ts:200` 一带的注释逐字：「深挖卡术语是有意保留的（进阶内容），不在本断言范围」），**但 `grammarLabel`／`oneLineRule`／`summary.rule`／`contrast.whyZh`／`guided.explain`／`recall.noteZh` 六个字段必须零术语**（**断言分别在 `grammarLessons.test.ts:105`／`:114`／`:123`／`:200`**）。

---

## §7 cloze 落点与考点处置（数析 §7）

### 7.1 ambush 侧逐句实跑（本 PRD 独立复刻 `grammarAmbushService.ts:195-213`）

**词表核对（本 PRD 逐字实读 `:160-213`）**：

| 词 | 在 `GRAMMAR_WORDS` 内 | 在 `CLOZE_STOP_WORDS` 内 | 结论 |
|---|---|---|---|
| **`as`** | **✅ 是**（`:181` 的「短语骨架词」段逐字含 `"as"`） | 否 | **🔴 会成为空位——本批的核心问题** |
| **`soon`** | **否** | 否 | **永不成空位（除非走第 ② 档实词回退）** |
| `comes`／`home`／`tell`／`him` | **`comes` 是**（`:170` 的「高频谓语动词」段含 `"comes"`）；其余否 | 否 | `comes` 会成为空位 |
| `will`／`is`／`was`／`am`／`are`／`do`／`does` | **是** | 否 | 实际落点 |

**逐句落点（本 PRD 实跑，本批 3 课的全部 `As soon as` 句）**：

| 句 | 档 | 空位词 | 是否考点词 |
|---|---|---|---|
| `As soon as he comes home, I will tell him.`（L142 target） | ① | **`As`** | ❌ 假友好 |
| `As soon as he comes home, I will not tell him.`（L142 否定） | ① | **`As`** | ❌ |
| `Will you tell him as soon as he comes home?`（L142 疑问） | ① | **`Will`** | ❌ |
| `As soon as I finish, I will eat.`（L143 target） | ① | **`As`** | ❌ |
| `As soon as I finish, I will not eat.`（L143 否定） | ① | **`As`** | ❌ |
| `Will you eat as soon as you finish?`（L143 疑问） | ① | **`Will`** | ❌ |
| `I will tell him as soon as he comes home.`（L142 examples①，**非句首型**） | ① | **`will`** | ❌ |
| `We will eat as soon as he comes home.`（L142 sceneSwings①，**非句首型**） | ① | **`will`** | ❌ |
| `When I finish, I will eat.`（L143 对照句） | ① | **`finish`**（`finish` 在**第 ② 档**——`when` 不在表内，表内词只有 `will`，但 `will` 前面 `I` 后 `finish`……**实跑落 `finish`，第 ② 档**） | ❌ |
| `If it is sunny, we will play outside.`（L48 复现句） | ① | **`is`** | ❌ |
| `When it is sunny, I run.`（L92 复现句） | ① | **`is`** | ❌ |

> **⚠️ 本批的「cloze 假友好」（比批二十二更彻底）**：**`As soon as` 开头的句子，关 2 回马枪抽走的一定是 `As`**——**根因（源码级，可引用）**：`pickClozeWord` 的 ① 分支用 `findIndex` 取**第一个**命中 `GRAMMAR_WORDS` 的词，而 **`as` 本身就在表内**（`grammarAmbushService.ts:181` 的短语骨架词列表含 `"as"`）→ **前置式 `As soon as…` 直接落 `As`**。
> **唯一的安慰**：**ambush 的 cloze 题不带选项**（`RevisitQuestion` 无 `options` 字段），**所以「空位落 `As`」至少不会产生伪造选项**。
> **⚠️ 与批二十二的关键差别**：**批二十二落 `is`／`was`（与考点无关的 be 动词）；本批落 `As`（与考点同形！）**——**学生看到的题面会变成「___ soon as he comes home…」，考点从「一到就」偏成「哪个 as」**。**这一条比批二十二更须登记。**

### 7.2 boost 侧逐课核验（本 PRD 实跑真种子 ＋ 真落点算法）

**方法**：逐字复刻 `grammarBoostService.ts:246-284` 的 `keywordIndexes`（长度 ≥3 且非 `FUNCTION_WORDS` 33 词）＋ 种子化选位（`hashText('cloze:'+sourceRef)` → `mulberry32` → `indexes[floor(r*n)]`），**按真实的 `sourceRef`（`${lessonId}:t${tier}:${source}:${index}`，`:518`）逐槽位实跑**；**候选池口径照 `:497-513` 的 `poolOf` ＋ `:515-526` 的 `dedupePool`，并照 `:792-797` 剔除 `target` 与 `blocks`**。

**逐课落点登记（本 PRD 实跑，去重后池口径）**：

| 课 | 去重后池槽数 | **`t1` 落 `soon` 的槽（保障句）** | 其余槽落点（登记） |
|---|---|---|---|
| **L142** | **9** | ✅ **`sceneSwings[2]` ＝ `As soon as he comes home, we will eat.` → `soon` ★**；**另 `variants[1]` ＝ `As soon as he comes home, I will not tell him.` → `soon` ★**（**两处**） | `variants[2]`→`Will`／`sceneSwings[1]`→`will`／`practice[2]`→`will`／`practice[3]`→`After`／`examples[1]`→`him`／`dialogue[0]`→`Dinner`／`dialogue[1]`→`still` |
| **L143** | **7** | ✅ **`variants[1]` ＝ `As soon as I finish, I will not eat.` → `soon` ★**（**一处**；`t2` 落 `not`） | `variants[2]`→`Will`／`sceneSwings[1]`→`finish`／`practice[3]`→`sunny`／`examples[2]`→`play`／`dialogue[0]`→`line`／`dialogue[1]`→`hungry` |
| **L144** | **11** | ✅ **`sceneSwings[3]` ＝ `We will eat as soon as he comes home.` → `soon` ★（且 `t2` 也落 `soon` ★——本批唯一一处两档同落）** | `variants[1]`→`comes`／`variants[2]`→`home`／`sceneSwings[1]`→`homework`／`sceneSwings[2]`→`hands`／`practice[2]`→`will`／`practice[5]`→`was`／`examples[1]`→`will`／`examples[2]`→`sunny`／`dialogue[0]`→`page`／`dialogue[1]`→`top` |

> **⚠️ 本批的 boost 侧比批二十二好（须诚实地标）**：**批二十二 3 课里 3 课都能配出保障句（落在 `Although`）**；**本批 3 课也课课能配出，且 L142／L144 各有多处**——**原因是 `soon` 长度 4、不在 `FUNCTION_WORDS` 内，属 boost 侧的关键词池成员；只要候选位数够少、种子合适，就能抽中它**。
> **⚠️ 但这是「种子运气」，不是「引擎保证」**——**登记项：生产期落盘后须逐课复跑一次上述落点**（本 PRD 的实跑是设计态；种子由 `lessonId` ＋ `sourceRef` 决定，**一旦 `lessonId` 或句序改动，落点会变**）。**若复跑发现保障句落点变了，唯一允许的动作是调整该句的槽位（`sceneSwings` 的第几条／`variants` 的第几条），不得改引擎。**
> **⚠️ 一条必须写死的位序**：**L142 的 `sceneSwings[2]` 必须是 `As soon as he comes home, we will eat.`；L143 的 `variants[1]` 必须是 `As soon as I finish, I will not eat.`；L144 的 `sceneSwings[3]` 必须是 `We will eat as soon as he comes home.`**——**这三条是本批的保障位，不得挪位、不得改写。**

### 7.3 逐课「保障句」清单（每课 ≥1，让主考点不落空）

| 课 | 保障句 | 落点 | 位置 | `t2` 落点 |
|---|---|---|---|---|
| **L142** | `As soon as he comes home, we will eat.` | **`soon`** | `sceneSwings[2]` | `eat` |
| **L142（备）** | `As soon as he comes home, I will not tell him.` | **`soon`** | `variants[1]` | `will` |
| **L143** | `As soon as I finish, I will not eat.` | **`soon`** | `variants[1]` | `not` |
| **L144** | `We will eat as soon as he comes home.` | **`soon`** | `sceneSwings[3]` | **`soon`** |

### 7.4 boost 侧的干扰项与 `diffScore`（本 PRD 实跑）

**① 干扰项安全（本 PRD 源码级核对 `grammarBoostService.ts:288-395`）**：

- **`soon` 不在 `KNOWN_VERBS` 表内**（逐字核对 `:327-341`；`as`／`comes` 均在、`soon` 不在）→ **不会产出 `soons`／`soonned`／`sooning` 这类伪词**；**残留风险**：`courseVocabulary()` 池（`:411-437`）会给 `soon` 配 3 个长度相近的真词（**库里学过的词，属合规干扰项**）。
- **`comes` 在 `KNOWN_VERBS` 内，但在 `IRREGULAR_VERBS` 内**（`:343` 逐字含 `"come"`）→ **按「先把 lower 还原成基础形，再只对基础形生成变体」的新逻辑（`:355-366`），`comes` → `come` 在 `IRREGULAR_VERBS` 里 → 整支跳过** → **不产出伪词**。
- **→ 本批零引擎改动**（**与批二十二 §6.2 的第 4 项处置结论一致**）。

**② `diffScore` 实跑登记（本 PRD 以真 `diffService` 逐组实跑，18 组留档）**：

**门（实读 `grammarBoostService.ts:744-753`）**：`if (!contrast.bothRight) return;` → **只对 `bothRight` 条目**算 `diffScore(compareText(correct, wrong, false))`，**`>= 90` 直接 `return`（静默丢弃、不报错）**。

| 课 | # | 卡型 | diffScore | 判定 |
|---|---|---|---|---|
| L142 | ① | 错卡（`will` 混入） | **77** | ✓（错卡，门不生效） |
| L142 | ② | 错卡（`Soon as`） | 9 | ✓（错卡） |
| L142 | ③ | 错卡（`come`→`comes`） | **95** | ⚠️ **全场最高——错卡不受门约束，但须登记** |
| **L142** | **④** | **双正解（L48 并排）** | **0** | ✓ **< 90（余量极大）** |
| L142 | ⑤ | 双正解（`when` 并排） | **0** | ✓ |
| L142 | ⑥ | 双正解（L109 `as` 并排） | 10 | ✓ |
| L143 | ① | **双正解（刻度 · 脊柱）** | **13** | ✓ |
| L143 | ② | 错卡（`will` 混入 · 二次切开） | **89** | ⚠️ **须登记**（错卡，门不生效） |
| L143 | ③ | 错卡（`eat` 少 `will`） | **88** | ✓（错卡） |
| L143 | ④ | 错卡（`As soon`） | **88** | ✓（错卡） |
| L143 | ⑤ | 双正解（L48 并排） | 11 | ✓ |
| L143 | ⑥ | 双正解（L92 并排） | 11 | ✓ |
| **L144** | **④** | **双正解（六格总收）** | **10** | ✓ |
| **L144** | **⑤** | **双正解（刻度总收 · 第 143 课回流）** | **13** | ✓ **本课最高** |
| L144 | ⑥ | 双正解（`while` 并排） | **0** | ✓ |
| L144 | ① | 错卡（回流 #151①） | 77 | ✓（错卡） |
| L144 | ② | 错卡（回流 #151②） | 9 | ✓（错卡） |
| L144 | ③ | 错卡（回流 #152③） | **88** | ✓（错卡） |

> **⚠️ 生产期必做**：**上述 18 组的 `diffScore` 须逐组重跑登记**（本 PRD 的实跑是设计态）；**高危项是两条 95／89 的错卡**（L142 ③ ＝ 95／L143 ② ＝ 89）——**它们是错卡，不会被丢弃**（门只对 `bothRight` 生效），**但若生产期把它们误配成 `bothRight`，会被静默丢弃**（**撞车口径：两条的 `wrong` 与 `correct` 只差一个词，diffScore 天然高**）。→ **G-boost-d 须逐条核 `bothRight` 标记**（§10）。**本批双正解最高 ＝ 13（L143①／L144⑤），最低 ＝ 0，全部 < 90 ✓（余量 77 分）。**

---

## §8 复现取材与红线头寸（数析 §6）——**逐句核验**

**口径**：逐字复刻 `grammarLessons.test.ts:163-178` 的断言（`normalize` ＝ 小写 ＋ 去 `.,!?;:'"` ＋ 空白折叠；统计单位 ＝ **practice 答案**）；**断言是 `lessons.length > 6` 才报错，即「出现在 7 课及以上」违规**。

**本 PRD 独立复跑（全 141 课 `practice[].answer` 归一化统计）**：

### 8.1 顶到 6 课（红线：本批绝对不可引用）

| 句 | 课数 | 逐课（课号） |
|---|---|---|
| **`Yesterday I went to the park.`** | **6** | **L21 · L24 · L93 · L95 · L100 · L104** |

> **实读裁定**：**这是本项目唯一顶死红线的句子**。**本批任何字段不得引用它**——**且本批的案件 #151④／#153④ 已按此改选别的旧错句子**（§11）。

### 8.2 5 课（预警：再引 1 次即触线）

| 句 | 课数 | 逐课 |
|---|---|---|
| `I like reading.` | **5** | L5 · L42 · L46 · L77 · L120 |
| `There is a book on the desk.` | **5** | L26 · L37 · L55 · L60 · L114 |
| `I was busy and happy.` | **5** | L81 · L113 · **L139 · L140 · L141**（**批二十二连引 3 课**） |
| `I am happy.` | **5** | L113 · L119 · L125 · L128 · L134 |
| `I am used to getting up early.` | **5** | L120 · L122 · L124 · L136 · L138 |
| `It looks nice.` | **5** | L125 · L126 · L128 · L133 · L134 |

> **→ 本批 6 句全部不引**（**含 `I was busy and happy.`——批二十二刚从 3 课引到 5 课，本批若再引即触线**）。

### 8.3 4 课（剩 2 次，须谨慎）

| 句 | 课数 | 逐课 |
|---|---|---|
| `He drinks milk every day.` | **4** | L25 · L103 · L116 · L126 |
| `They were playing football.` | **4** | L34 · L51 · L95 · L98 |
| `Could you help me?` | **4** | L61 · L63 · L66 · L69 |
| `Are you used to it?` | **4** | L123 · L124 · L132 · L137 |

### 8.4 本批选用的复现句＋实测头寸（**逐句核验**）

| 复现句 | 取自 | **实测已出现课数** | **头寸** | 本批落点 |
|---|---|---|---|---|
| `If it is sunny, we will play outside.` | L48 `:8786` | **0**（**本 PRD 实测，GL 1／HC 0**） | **剩 6** | ✅ L142 `practice` 第 3 题 ＋ L142 `contrast` ④ ＋ L143 `contrast` ⑤ |
| `When it is sunny, I run.` | L92 `:17100` | **2**（L92 · L97） | **剩 4** | ✅ L143 `practice` 第 4 题 ＋ L143 `contrast` ⑥ ＋ L144 `examples` |
| `After I do my homework, I watch TV.` | L90 `:16722` | **2**（L90 · L91） | **剩 4** | ✅ L144 `practice` 第 4 题 ＋ L144 `contrast` ④ |
| `Before I eat, I wash my hands.` | L91 `:16911` | **3**（L91 · L92 · L94） | **剩 3** | ✅ L144 `practice` 第 5 题 |
| `While I was reading, he was sleeping.` | L98 `:18237` | **1**（L98） | **剩 5** | ✅ L144 `practice` 第 6 题 ＋ L144 `contrast` ⑥ |
| `When you called, I was reading.` | L97 `:18147` 一带 | **3**（L97 · L101 · L109） | **剩 3** | ✅ L143 `practice` 第 5 题 |
| `She called as I was getting out of the bath.` | L109 `:20346` | **0**（**本 PRD 实测**） | **剩 6** | ✅ L142 `contrast` ⑥（**只作双正解位，不作答案**） |
| `Dinner is ready!` | L91 `:16924` | **0** | **剩 6** | ✅ L142 `dialogue[0]` ＋ `guided` ⑤（**只作对白／arrange，不进 practice 答案**） |
| ❌ `Yesterday I went to the park.` | L10 一带 | **6** | **0（顶死）** | ❌ **禁止引用** |
| ❌ `I was busy and happy.` | L19 `:3423` | **5** | 剩 1 | ❌ **不引**（**批二十二刚引满 3 课**） |
| ❌ `I waited until the rain stopped.` | L109 `:20309` | **1** | 剩 5 | ❌ **零雨线，不引**（改用规则引用，§3.3） |
| ❌ `We waited until the movie ended.` | L109 `:20317` | **1** | 剩 5 | ❌ **电影线，不引** |
| ❌ `I will call you tomorrow.` | L12 | **2** | 剩 4 | ❌ **电话线（`call`），不引** |
| ❌ `If it rains, I will stay at home.` | L48 `:8777` | **2** | 剩 4 | ❌ **零雨线（`rains`），不引**——**已改用 L48 的 `If it is sunny…`** |

> **⚠️ 两处须生产期特别当心的**：
> 1. **`When you called, I was reading.` 头寸剩 3** ——**它是 L143 `practice` 第 5 题，不得再写进 `examples` 或 `contrast`**（否则 L143 一课就占 2 次，全批到 4 课）。
> 2. **`Before I eat, I wash my hands.` 头寸剩 3** ——**它是 L144 `practice` 第 5 题，不得再出现在 L144 的 `sceneSwings`／`contrast` 里**（**本 PRD 的 L144 `contrast` 六条已按此设计：不含该句**）。
> **→ 结论：本批可安全复现的句子有 8 句，全部头寸 ≥ 3；复现取材压力小于批二十二。**

---

## §9 叙事设计专章

### 9.1 叙事草案（逐字采用）

**章名**：「他一回来我就说」。

**场景线（单拱一句话）**：**傍晚那张饭桌，一个位子空着——他一回来我就说；前面说现在，后面说将来。**

| 课 | scene | 场景锚（`sceneSetupZh` 定稿） | 那一课的一句 |
|---|---|---|---|
| L142 | `mansion` | 「傍晚，饭桌上摆好了三副碗筷，靠门那个位子还空着。妹妹问要不要先吃——小美说：他一回来我就告诉他。」 | 他一回来我就告诉他。 |
| L143 | `mansion` | 「还是那张饭桌。小美一边摆筷子一边说：我这边一做完就吃。妹妹问：那跟你刚才说的「当…的时候」有什么不一样？」 | 我一做完就吃。 |
| L144 | `mansion` | 「饭桌收拾干净了。小美把本子翻开，一页上排了六行：第一行开头是 after，第二行 before，第三行 when，第四行 while，第五行 until，最后一行是新学的 as soon as。」 | 把这一章学的这一句再说一遍，再把这六行看一遍。 |

**叙事闭环（本批的叙事核心，须明写）**：

- **本批与 L109 是「两种等」**——**L109 是「等一道线」（`until the rain stopped`），本批是「等一个人」**（`as soon as he comes home`）。**两课都在等，等的东西不一样**。
- **⚠️ 但两课不共享任何一个词**——**L109 的 `rain`／`stopped`／`until`／`movie`／`ended` 在本批三课里零出现**（**本 PRD 已逐字段设计核：本批 3 课的 `target`／`variants`／`sceneSwings`／`practice`／`examples`／`dialogue`／`recall`／`contrast`／`deepDive` 全部字段里没有 `rain`／`stops`／`stopped`／`until`／`movie`／`ends`／`ended`**）。
- **叙事效果**：**同一家族的两个刻度**——L109 教「等到那道线」（一直做，做到线到为止），本批教「一到就做」（线一到，马上做）。**学生在两课之间会自己发现：「哦，原来是同一个家族的两头。」**

### 9.2 复用体系（不造新术语——全部是既有资产 ＋ 上游现成切法）

| 装置 | 位置 | 本批处置 |
|---|---|---|
| `recall`（忆段） | 课内 | **每课必配**（`grammarLessons.test.ts:66-76`） |
| `// R8 跨课复现` | `guided` 内 | **本批每课 2 处**（L142 复现 L48＋L91／L143 复现 L92＋L97／L144 复现 L90＋L98） |
| `practice` 后两题 | 课内 | **本批固定为「复习时间家族老课 ＋ 本批场景句」**（**L144 为六题形态：3 道复现 ＋ 3 道本章**） |
| `contrast` 的 `bothRight` | 课内 | **本批三课各 3 条**（**9 条双正解**，占 18 条 `contrast` 的一半——**照批二十二的形态**） |
| **「入伙／第四名」话术** | 课内 | **L109 `:20380` 逐字「……今天 until 入伙，是第四名」**——**本批 L144 复用为「今天 as soon as 入伙，它站第六行」**（**第五次入伙**：after/before/when → until → as soon as；照 L109 `:20417` 的「今天 until 入伙」形态） |
| **关 2 回访（`GrammarRevisitPage`）** | 课末自动 | **不改**（cloze 假友好见 §7.1） |
| **关 3 旧案重审（`GrammarReauditPage`）** | 课末自动 | **不改** |
| **趁热练（`GrammarBoostPage`）** | 独立 | **不改**（保障句见 §7.3） |
| **SM-2 复习（`GrammarReviewPage`）** | 独立 | **不改** |

> **⚠️ 一条明写（回答「本批是不是复现型章」）**：**不是**。本批 **L142／L143 各有真增量**（立岗 ＋ 切开），**只有 L144 是零新知的收口课**——**与库内 15 课收口课同型（1 章 1 课），不是「整章复现」**（竞析 §4.3 备选 E 与瑞思 §4.0 一致判「不做复现型大章」）。

### 9.3 展示层（season-23 ＋ m25，逐字给定）

**① `grammarSeasons.ts`（追加到 `LESSON_GROUPS` 末尾，`max` ＝ 本批末课）**

```ts
  // 第二十三批 · 一…就…（2026-09-20）：as soon as 立岗 + 与 when 切开 + 零新知收口（B 档 3 课小章·单拱）
  { id: "season-23", label: "第二十三季 · 一…就…", hint: "他一回来我就说——前面说现在，后面说将来", min: 142, max: 144 }
```

- **实读依据**：末项 `grammarSeasons.ts:62` 逐字 `{ id: "season-22", label: "第二十二季 · 虽然但是", hint: "虽然下雨了，我还是要出去——中文说「虽然…但是…」，英语只留一个", min: 139, max: 141 }` ✅ **22 季**。
- **⚠️ 硬护栏（`grammarSeasons.ts:5` 注释逐字「课程号不落在任何区间内会被路径页静默过滤（整课不显示、无报错）」）**：**不追加本项，L142–L144 会在路径页整课不显示、无报错**；守门测试 `grammarSeasons.test.ts` **4 项**（`:12` 每课号落在某季区间／`:22` 区间互不重叠且 `min ≤ max`／`:36` `label`·`hint` 非空／`:43` 最高课号被覆盖）——**忘加立刻红**。
- **`label`／`hint` 的零术语自查 ✓**：「一…就…」「说现在」「说将来」**均无 29 词命中**（**⚠️ 不得写成「时间状语从句」「主将从现」**）。

**② `GrammarPathPage.tsx`（追加到数组末尾）**

```tsx
  {
    id: "can-do-m25",
    afterLesson: 144,
    title: "我能说「一到就做」",
    zh: "一到就做（as soon as 领一整句）+ 当…的时候（when 管那段时间）+ 六格排一行——前面说现在，后面说将来。",
    samples: ["As soon as he comes home, I will tell him.", "When I finish, I will eat.", "After I do my homework, I watch TV."]
  }
```

- **实读依据**：末项 `GrammarPathPage.tsx:283` 逐字 `id: "can-do-m24"`／`:284` `afterLesson: 141`／`title: "我能说「虽然…」"` ✅ **24 里程碑**。
- **⚠️ 守门现状**：**`can-do-m*` 的测试引用数 ＝ 0**（**本 PRD 复跑 `grep -rn "can-do-m" src/` 过滤掉 `GrammarPathPage.tsx` 后无输出**）——**纯纪律项、无守门**，**漏加不会红，须人工核**（G8-b）。
- **零术语自查 ✓**：「一到就做」「领一整句」「说现在／说将来」**均无 29 词命中**。

**③ 封面**：`L142←cover25`／`L143←cover26`／`L144←cover27`（数析 §9.2 唯一解；§2.1 已实读三张资产齐全且在 L25–L27 各用一次）。**⚠️ 携带项**：本批取 3 张后**二用池 24→27 张、单次张 93→90 张**（§13 序 7）。

**④ 一句叙事稿（课末卡 ＋ 里程碑共用，定稿）**：

> 「**他一回来我就说。** 前面那件说现在，后面那件说将来——第 48 课那条规矩，今天换 as soon as 站岗。」

---

## §10 验收标准

### 10.1 检查清单（G1–G15 ＋ 展示层，逐条可勾）

**G1–G5 课程数据**

- [ ] **G1 课程数据**：practice **≥4 题**且**含一道与 variants 非肯定卡逐字一致的变体题**（`grammarLessons.test.ts:11-29` 硬断言）；本批逐课列出——**L142 `Will you tell him as soon as he comes home?`（＝疑问卡，`variants[2]`）｜L143 `Will you eat as soon as you finish?`｜L144 `Will you tell him as soon as he comes home?`**
- [ ] **G1-b 复现题**：**每课 ≥1 复现题**（本批每课 **1–3 道**）；逐课配置——L142 复现 L48 `:8786` `If it is sunny, we will play outside.`；L143 复现 L92 `:17100` `When it is sunny, I run.` ＋ L97 `:18147` 一带 `When you called, I was reading.`；L144 复现 L90 `:16722` ＋ L91 `:16911` ＋ L98 `:18237`
- [ ] **G2 tokens／answer 词集一致 ＋ `distractors` 不与答案词重复**（`grammarLessons.test.ts:31-50`／`:52-67` 硬断言）；**arrange／practice 展示序 ≠ 答案序**（`lessonService.ts:295` `shuffleTokenOrder`；`grammarBoostService.ts:225` `shuffleWithSeed` 兜底）；**逐题 `tokens` 逐字见 §2.2 三张表的「各题 `tokens` 逐字」行**
- [ ] **G2-b 零术语红线（六字段机检）**：**29 词**（`grammarZeroTerms.ts:17-27` 逐字实读）—— **`grammarLabel`／`oneLineRule`／`summary.rule` 三字段逐课自查**（断言在 `grammarLessons.test.ts:105`／`:114`／`:123`）；**本批特别核「从句」「状语」「语序」「时态」「副词」「疑问句」「否定句」「第三人称」「原形」「介词」「形容词」十一词的 0 命中**；**＋ AI 引用源三字段**（`contrast.whyZh`／`guided.explain`／`recall.noteZh`，断言在 `:200`）**同样 0 命中**；**＋ 本批额外禁「时间状语从句」「主从复合句」「门牌」「让步」「转折」五词**（**非机检覆盖，人工核**）；**另核改写后无生硬拼接**（`:220-236` 的 `/的的/` 等四模式断言）
- [ ] **G3 recall 三字段非空**（`promptZh`／`intentZh`／`answer`；`grammarLessons.test.ts:66-76` 对 `number >= 13` 硬断言）；本批 3 课全部配 recall（**逐课三字段见 §2.2**）
- [ ] **G4 目标句词数诚实标注 ＋ 一课一增量**：L142 **10 词**（⚠️ **超 8 词线 2 词，不越库内先例——库内最长 14 词、≥8 词的 15 课**，§2.2 L142 已逐条写明）／L143 **8 词 ✓**／L144 复用 L142 句（10 词）；**§2.2 每课「新知识点」只列一件**（**L144 是零新知——已在「本课定位说明」写明**）
- [ ] **G5 罪名枚举**：3 案 tag **全落 10 枚举**（`huntService.ts:331-342` 逐字实读，本 PRD 已复读）；**不碰 comparison**（`types.ts:419-430` 存在但 `GRAMMAR_ERROR_TAGS` 不含它、`huntCases.ts` 实读 **0 处**）；**⚠️ 本批不碰 `run_on`／`fragment`**——**批二十二刚用了 `run_on` 3 处（#148①／#149①／#150① 一带）＋ `fragment` 2 处，本批的 12 处错全部落 `verb_form`／`word_order`／`tense`／`plural`／`sv_agreement` 五档**（**须逐案核：三案里 `run_on` 与 `fragment` 各 0 处**）

**G6–G11 案件**

- [ ] **G6 案件结构**：每案 **4 错＝新错 2＋旧错 2**、**单 token 可修**、**≥1 净词**（`tokens.length > errors.length`）、`reviewed: true`、`tokenIndex` 与 `tokens` 对齐、`number` 连续（**#151–#153**，接 #150 `hunt-close-22` 之后）；旧错**只取 L10 `:1765`／L11 `:1947`／L19 `:3413`／L25 `:4511`**（**四课的 `number` 锚行号，本 PRD 实读**），**禁引入未教材料**
- [ ] **G7 tagStats=10 不动**（`huntService.test.ts:109` 断言 `toHaveLength(10)`）；**番外 5 案冻结**（`huntService.test.ts:215` 逐名单断言 `hunt-white-cat`／`hunt-sports-day`／`hunt-pen-pal-letter`／`hunt-fridge-note`／`hunt-term-review`）
- [ ] **G8 展示层硬需求**：§9.3 两条逐字落地（`season-23` `{min:142,max:144}` ＋ `can-do-m25` `afterLesson: 144`）
- [ ] **G8-b 守门测试**：`grammarSeasons.test.ts` **4 项全绿**（区间覆盖／互不重叠且 `min ≤ max`／`label`·`hint` 非空／最高课号被覆盖）；**m25 无守门，人工核**
- [ ] **G9 orphans 纪律**：3 个新案（#151–#153）**全部被 L142–L144 引用**（`huntCaseIds`），**不新增未引用案**
- [ ] **G10 episode 写法**：L142–L144 全部汉字数字（一百四十二／一百四十三／一百四十四），**接末项 `:26499`「一百四十一」无跳号**
- [ ] **G11 语料锁闭集（本批最硬的一条）**：
  - **零雨线（G13 单列，见下）**：**`rain`／`raining`／`rainy`／`rains`／`stops`／`stopped`／`stop`／`stopping`／`the rain stops`／`the rain stopped`／`waited until`／`I waited` 在 L142–L144 零出现**。
  - **电影线 ＋ `until`**：**`movie`／`ends`／`ended`／`the movie ended`／`the movie ends`／`until`／`till` 全批零出现**。
  - **零 `once`**：**`once` 全批零出现**（**不教、不复现、`contrast` 里也不出现**——§6.6）。
  - **本批不引入**：`by the time`／`will have`／`as if`／`as though`／`as long as`／`unless`／`in case`／`while` 的让步义／`whenever`／`since`／`till`／`gets`／`arrives`／`rings`／`finishes`（**四个真零三单形式，留给后续批次**）／`as` 的第三个义（`as tall as` 之外**不再开新义**）。
  - **L48／L65／L109 冻结**：**`:8762`–`:8860` 一带（L48 全课）／`:11969`–`:12160` 一带（L65 全课）／`:20299`–`:20365` 一带（L109 的 `contrast` 与 `summary` 段）一字不动**；**本批引用逐字照抄的三句**：`If it is sunny, we will play outside.`（L48 `:8786`）／`She called as I was getting out of the bath.`（L109 `:20346`）／`When it is sunny, I run.`（L92 `:17100`）＋ L90／L91／L97／L98 各一句。
  - **案 #57／#74／#118 冻结**：**只引用它们的 `explanation` 话术（§4.2 第 4 项、§5.2 第 2 项），不改一个字**；**案 #118 的 `:6869`／`:6884-6885` 不在本批任何字段出现**。
  - **`article` 与薄档登记**：**本批三案 12 处错里不含 `article`**（`article` 全库 29 处，本批不占）——**理由**：**本批核心句的两个位置**（「他一到家」＝人 ＋ 动作；「我就告诉他」＝人 ＋ 动作 ＋ 人）**都没有需要 `the` 的名词位**，硬塞 `article` 会造出不通的句子。**本批补的是 `tense`（3）／`word_order`（3）／`verb_form`（2）／`plural`（2）／`sv_agreement`（2）五档**（**⚠️ `tense` 全库 52／`word_order` 47 属中档，本批各占 3 处，是「补中档」而非「补最薄档」——这是本批与前两批的差别，须在被问到时说明**）。

**G12 cloze ＋ G-boost**

- [ ] **G12 cloze 逐课核验（本 PRD 以逐字复刻抽词器独立复跑，ambush 11 句 ＋ boost 逐槽位，结果见 §7.1／§7.2）**：
  - **词表状态（逐字实读 `grammarAmbushService.ts:160-193`）**：**`as` 在 `GRAMMAR_WORDS` 内**（`:181` 逐字）→ **`As soon as…` 句恒落 `As`**；**`soon`／`tell`／`him`／`home`／`dinner`／`ready` 不在表内**；**`comes`／`will`／`is`／`was`／`do`／`does` 在表内**。
  - **ambush 侧逐课落点（11 句，§7.1 表）**：**句首型全部落 `As`／`Will`，非句首型落 `will`，复现句落 `is`／`finish`——考点词 `soon` 成空位率 0%**。
  - **逐课保障句（boost 侧，§7.2／§7.3）**：**L142 `sceneSwings[2]` → `soon` ★（另 `variants[1]` 亦落 `soon`）｜L143 `variants[1]` → `soon` ★｜L144 `sceneSwings[3]` → `soon` ★（且 `t2` 同落）**。**⚠️ 三课课课有保障句，全批 4 处落考点词**。
  - **boost 侧干扰项护栏（本批已源码级核对，无须改动）**：**`soon` 不在 `KNOWN_VERBS`；`comes` 虽在 `KNOWN_VERBS` 但在 `IRREGULAR_VERBS`（`:343` 含 `"come"`）→ 整支跳过** → **本批不产出伪词**（§7.4 ①）。
  - **复习卡引擎 C**：**本批不新增退化干扰项风险**（**答案均为库内真词**）。
- [ ] **G12-b L144 复现位登记**：**收口课的复现位为 5 句而非 6 句**（**until 那一格引规则不引句**，§3.3）——**须在走查单里单列，不得当成缺漏**。
- [ ] **G-boost（硬护栏）**：
  - **每课 `contrast` 6 条中 ≥2 条带 `wrongMark`**（**本批 3 条**；口径：`wrongMark` 非空、非 `bothRight`、字面词能在 `wrong` 句里定位；`grammarBoostService.ts:699-706` 实读）；**禁止贴线**（`grammarBoostService.test.ts:161-183` 全库逐课断言 `thin === []`）。**本批 9 个 `wrongMark` 全部含字母**：L142 `will`／`Soon`／`come`｜L143 `will`／`eat`／`soon`｜L144 `will`／`Soon`／`eat`。**每课池深 ＝ 3 mark ＋ 1 spot ＝ 4 道**。
  - **`wrongMark` 不得为纯标点**（`grammarBoostService.test.ts:199-210` 断言）——**本批 9 个均含字母 ✓**。
  - **`guided.spot` 的 `wrongToken` 必须与 `tokens` 元素逐字相等（含尾标点写法一致）**（`grammarBoostService.test.ts:185-198` 断言；**L96／L102 因尾标点不一致曾致题目静默消失**）：**本批 3 处 spot 逐字定稿**——L142 `["As","soon","as","he","will","comes","home,","I","will","tell","him."]`／`"will"`｜L143 `["As","soon","as","I","finish,","I","eat."]`／**`"eat."`（带尾点）**｜L144 `["As","soon","as","he","will","comes","home,","I","will","tell","him."]`／`"will"`。**⚠️ 定稿口径（写死）**：**`wrongToken` 一律写成 `tokens` 里的逐字元素**——`tokens.includes(wrongToken)` 必须为 true；**⚠️ L142 与 L144 的 `tokens` 里各有两个 `"will"`**（下标 4 与 9），**引擎 `findIndex` 取第一个（下标 4）——正是要点的那个 ✓**，**须逐字核**；**L143 是唯一一处元素自带尾标点的 spot，须逐字核**。
  - **G-boost-d 双正解卡的 `diffScore` 红线**：`grammarBoostService.ts:744-753` 对 `bothRight` 条目算 `diffScore`，**`>= 90` 直接 `return`（静默丢弃、不报错）**。**本 PRD 以真 `diffService` 逐组实跑本批 18 组并留档（§7.4）**：**最高 13（L143①／L144⑤）／最低 0，全部 < 90 ✓（余量 77 分）**。**⚠️ 已登记的两条错卡高分**：**L142 ③ ＝ 95**（`come`→`comes`）／**L143 ② ＝ 89**（`will` 混入）——**它们是错卡，门不生效**；**但若误配 `bothRight` 会被静默丢弃**（**这两条卡只差一个词，diffScore 天然高，是全场最容易被误配的两条**）。
  - **guided 六步覆盖 `choose`／`arrange`／`spot`／`replace` 四类**；**`kind: "spot"` 恒为 1 道/课**（全库现状，本批沿用）。
  - **（附）全库护栏现状**：`thin`（＜2 改错题）＝ **0 课**；`wrongToken` 违规 **0**；纯标点 `wrongMark` **0**。

**其余**

- [ ] **G13 零雨线硬核验（本批特有，须逐字核）**：**`rain`／`raining`／`rainy`／`rains`／`stops`／`stopped`／`stop`／`stopping`／`the movie ended`／`the movie ends`／`movie`／`ends`／`ended`／`until`／`till`／`waited` 在 L142–L144 全批零出现**——**核验方式两条**：① 机检（对三课全字段做正则扫描，命中必须为 0）；② 人工读 `contrast`／`deepDive`／`summary` 三段（**这三段最容易顺手写出「雨」**）。**⚠️ 附带的替代动作已执行：L48 的引用句由 `If it rains, I will stay at home.` 改为 `If it is sunny, we will play outside.`（`:8786`）**。
- [ ] **G13-b 零 `once` 硬核验**：**`once` 在 L142–L144 全批零出现**（含 `contrast` 的对照位）——**同上两条核验方式**。
- [ ] **G14 复现取材红线（逐句核验）**：**`Yesterday I went to the park.` 不得引用**（实测 6 课顶死）；**其余 6 句 5 课预警句（`I like reading.`／`There is a book on the desk.`／`I was busy and happy.`／`I am happy.`／`I am used to getting up early.`／`It looks nice.`）全部不引**；**本批选用的 8 句逐句头寸见 §8.4，最低剩 3**
- [ ] **G15 时长 12–15 min**（3 课逐课走查；**L142 首玩略长（15 分钟，含 `soon` 新词认读）**，**L144 收口课最短（12 分钟，零新知）**；须按**分段计时**抽查）
- [ ] **G16 旧线零回归**：**L1–L141 一字不动**（**特别声明**：不改 L48 `:8762`–`:8860` 一带／L65 `:11969`–`:12160` 一带／L109 `:20299`–`:20365` 一带／L90／L91／L92／L97／L98 被「认领」的句子／案 #57 `:3635` 一带／案 #74 `:4693`–`:4701`／案 #118 `:6860`–`:6895`——**认领＝在 L142–L144 里引用，不是编辑原课**）；**不改 `grammarAmbushService.ts`／`grammarBoostService.ts`／`grammarZeroTerms.ts` 三个文件**；`npx vitest run` 全绿（**基线：61 文件 / 799 项**，本 PRD 实跑快照）；`npx tsc --noEmit` 0 错；build 通过
- [ ] **G17 封面**：`L142←cover25`／`L143←cover26`／`L144←cover27`（min-gap **117**，数析 §9.2 二分＋全枚举验证**唯一解**）；**本 PRD 已实读三张资产齐全**（`src/assets/lessons/` 实读 **117 张**、编号连续，**`:4516`／`:4709`／`:4893` 三处占用分别对应 L25／L26／L27**）；**唯一允许的池内换法＝三张内部互换（集合不变）**，须登记且须同时登记 min-gap 变化；**`cover1`–`cover24` 本批禁用**（二用张）；**`cover118`+ 资产不存在**

### 10.2 Given/When/Then

- **G-A1** Given 学习者完成 L142 When 看 `As soon as he will come home, I will tell him.` ❌ Then 能改成 `As soon as he comes home, I will tell him.` 并说出「**前面那件说现在，不请 will——第 48 课那条规矩**」
- **G-A2** Given 学习者完成 L142 When 看 `Soon as he comes home, I will tell him.` ❌ Then 能改成 `As soon as he comes home, I will tell him.` 并说出「**两头都要卡住——少一头 as 就散架（第 65 课那句老话）**」
- **G-A3** Given 学习者完成 L142 When 看 `If it is sunny, we will play outside.` ✅ 与 `As soon as he comes home, I will tell him.` ✅ 并排 Then 能说出「**两句都对——同一条规矩：前面说现在、后面说将来；第 48 课用 if 站岗，今天换 as soon as**」
- **G-A4** Given 学习者完成 L142 When 看 `She called as I was getting out of the bath.` ✅ Then 能说出「**第 109 课认过脸——as 能领一整句；今天它转正了**」
- **G-A5** Given 学习者完成 L143 When 看 `As soon as I finish, I will eat.` ✅ 与 `When I finish, I will eat.` ✅ 并排 Then 能说出「**两句都对——不一样的只有一刻：when 是「那段时间里」，as soon as 是「一到那一刻、马上」**」；When 被问「哪句是「一刻也不等」」Then 能答「**as soon as 那句**」
- **G-A6** Given 学习者完成 L143 When 看 `As soon as I finish, I eat.` ❌ Then 能改成 `As soon as I finish, I will eat.` 并说出「**后面那件还没发生，要带上 will**」
- **G-A7** Given 学习者完成 L144 回看六行 When 逐行指认 Then 能说出「**after／before／when／while／until／as soon as 都是「后面跟一整句」的老成员；最后一行跟第 48 课 if 一样**」；When 被问「这一页上有几行」Then 能答「**六行**」
- **G-A8** Given 学习者完成全批 When 被问「`when` 和 `as soon as` 哪个都能用吗」Then 能说出「**都能用，看你想说「那段时间里」还是「一到那一刻」**」；**不得要求把 `When I finish, I will eat.` 改成 `as soon as` 版**（**「when 也能说」是本批的正解之一**）
- **G-A9**（**「重复感」观察项**）Given 学习者完成 L142 与 L143 Then **L142 的完成时长不应显著高于 L143**（**若 L142 明显更慢，说明它在重讲 L48，须回炉**，§4.4）

### 10.3 三条「不得写」的硬门（本批特有，生产期逐条核）

1. **不得写「第 48 课已经教过 as soon as」**——**L48 教的是 `if`，`as soon as` 是今天第一次**；**正确的写法是「第 48 课那条规矩，今天换一个词再站一次岗」**（§4.2）。
2. **不得写 `as soon as` 引导「从句」**（**「从句」在 29 词红线表内**，机检会红）——**一律写「as soon as 领一整句」**；**同样不得写「时间状语从句」「状语」「主从复合句」「主将从现」「语序」**（§6.7 替换表）。
3. **不得把 L65 的切面写成「句子长短」**——**正确的切面是「两头卡住 ＋ 中间夹的是什么 ＋ 后面跟什么」**（§5.3 第 1 条）。

---

## §11 案件规划（3 案 · #151–#153）

**总规则**：每案 **4 错＝新错 2＋旧错 2**；**单 token 可修**；每案 **≥1 净词**（`tokens.length > errors.length`）；**零术语话术**（`explanation` 侧无守门测试，纯纪律）；tag **全落 10 枚举**；`reviewed: true`；**必须配课**；**不碰 comparison**；**不引番外 5 案**。**案件编号接批二十二尾案（#150 `hunt-close-22`，`huntCases.ts:8271`）为 #151–#153**。**tokens 格式沿用「短句排一行」**（先例 #143–#150 同款），**标点跟在前一个词后面**（`huntCases.ts` 头注释 `:15` 明文）。

| 案件 id | # | 配课 | 场景 | 定稿错误构成（原 → 修正（tag，新/旧）） |
|---|---|---|---|---|
| `hunt-as-soon-as-comes` | **151** | L142 | 傍晚的饭桌：位子还空着，本子上写了四行 | ① `soon` → `as soon as`（`word_order`，**新**——**三块少一块，「两头都要卡住」**；**单 token 可修的补词型写法**，先例 `huntCases.ts:7368-7371`（#129 的 `getting → to getting`）／`huntCases.ts:4694-4700`（#74 的 `tall → as tall`）；explanation「**两头都要卡住**：少一头 as，「一…就…」就散架——As 【soon as】 he comes home。**⚠️ 第 65 课那句是「一样」，这句是「一到就」——同一个字，两张脸。**」）② `will` → 去掉 `will`（`As soon as he will come home, I will tell him.`，**`verb_form`**，**新**——**前面那件说现在，不请 will**；**逐字同型先例** 案 #57 `:3643-3647`（`original: "will"`／`correction: "去掉 will"`／`tag: "verb_form"`）；explanation「**第 48 课那条规矩**：if 里说现在，不用 will——今天轮到 as soon as。前面那件是「他一到家」：As soon as he 【comes】 home。」）③ `go` → `went`（`Yesterday I go home late.`，**`tense`**，**旧错 L10 `:1765`**；**同型先例** `huntCases.ts:5901`（#96 `hunt-cold-morning` 的 `"Yesterday", "I", "go", "to", "school."`）；**⚠️ 本批用 `home late` 而非 `to the park`**——**后者实测已 6 课顶死红线（§8.1）**；explanation「第 10 课回流：说昨天的事要换昨天版——go → 【went】。」）④ `sandwich.` → `sandwiches.`（`I ate two sandwich.`，**`plural`**，**旧错 L11 `:1947`**；**逐字先例**：**这句正是 L11 自己的 contrast ① 错句**（`grammarLessons.ts:1978` 逐字 `wrong: "I ate two sandwich."`／`:1979` `wrongMark: "sandwich"`／`:1980` `correct: "I ate two sandwiches."`）——**本 PRD 实测该整句 HC 命中 0 处**；explanation「第 11 课回流：two 后面要加 s——two 【sandwiches】。」） |
| `hunt-when-vs-as-soon` | **152** | L143 | 同一张饭桌上的问句：妹妹追问 | ① `soon` → `as soon as`（`As soon I finish, I will eat.`，**`word_order`**，**新**——**这回少的是第二头 as**；explanation「**两头都要卡住**：第 142 课少的是第一头，这回少的是第二头——As soon 【as】 I finish。**两个 as 缺一不可。**」）② `eat` → `will eat`（`As soon as I finish, I eat.`，**`tense`**，**新**——**后面那件还没发生，要带上 will**；**单 token 可修的补词型写法**，先例同 #151①；explanation「**后面那件还没发生**，要带上 will——As soon as I finish, I 【will eat】。**中文的「就」不带将来，英语这边要带。**」）③ `was` → `were`（`My sister and I was happy.`，**`sv_agreement`**，**旧错 L19 `:3413`**；**⚠️ 本批用 `My sister and I` 而非 `They`／`We`**——**`They was happy.` 与 `We was happy.` 在 HC 已被 #129／#135／#142 等多案使用**，本批换一个主语，**实测「My sister and I was happy.」HC 命中 0 处**；explanation「第 19 课回流：`My sister and I` 是两个人，算一伙的，用 【were】 不用 was。」）④ `like` → `likes`（`She like music.`，**`sv_agreement`**，**旧错 L25 `:4511`**；**逐字先例**：**这句正是 L25 自己的 contrast ② 错句**（`grammarLessons.ts:4548` 逐字 `wrong: "She like music."`／`:4549` `wrongMark: "like"`／`:4550` `correct: "She likes music."`），**且 `She likes music.` 是 L25 `:4529` 的 examples**——**本 PRD 实测该整句 HC 命中 0 处**；explanation「第 25 课回流：「她喜欢」要加 -s——She 【likes】 music。**这是英语里最顽固的小尾巴，别丢了。**」） |
| `hunt-close-23` | **153** | L144（**收口课案件**） | 本子最后一页：六行排好了，最后一行写错了 | ① `will` → 去掉 `will`（`As soon as he will come home, I will tell him.`，**`verb_form`**，**回流 #151②**；explanation「**第 142 课回流**：前面那件说现在，不请 will——As soon as he 【comes】 home。第 48 课那条规矩，as soon as 也照办。」）② `soon` → `as soon as`（`Soon as he comes home, I will tell him.`，**`word_order`**，**回流 #151①**；explanation「**第 142 课回流**：两头都要卡住——As 【soon as】 he comes home。」）③ `eat` → `will eat`（`As soon as I finish, I eat.`，**`tense`**，**回流 #152②**；explanation「**第 143 课回流**：后面那件还没发生，要带上 will——As soon as I finish, I 【will eat】。」）④ `go` → `went`（`Yesterday I go home late.`，**`tense`**，**旧错 L10 `:1775`**——**⚠️ 与 #151③ 逐字同句**，**这是「回流」的合法形态**（**收口案的回流位就是逐字复用前案错句**，先例 #150① 逐字复用 `Although…but…`／#150④ 逐字复用 `They was happy.`）；explanation「第 10 课回流：说昨天的事要换昨天版——go → 【went】。」）——**收口案＝三点锚本批 ＋ 一点锚旧课**（照 #150 的收口案式） |

> **本批罪名分布（3 案 × 4 错 ＝ 12 处，本 PRD 逐项重数）**：**`verb_form` 2**（#151②／#153①）／**`word_order` 3**（#151①／#152①／#153②）／**`tense` 4**（#151③／#152②／#153③／#153④）／**`plural` 1**（#151④）／**`sv_agreement` 2**（#152③／#152④）。
> **校验（逐项重数）**：`verb_form` 2（#151②／#153①）＋`word_order` 3（#151①／#152①／#153②）＋`tense` **4**（#151③／#152②／#153③／#153④）＋`plural` 1（#151④）＋`sv_agreement` 2（#152③／#152④）＝ **12 ✓**。
> **⚠️ 与前两批的形态差别（须明写）**：**批二十二补的是 `run_on`（3）／`fragment`（2）两个最薄档；本批不补最薄档**——**理由**：主理人裁决「批二十二刚用了 `run_on` 3 处＋`fragment` 2 处，本批建议不再集中」，**且 `as soon as` 的主靶不是「两句连写」（`run_on`）而是「前面请了 will」（`verb_form`）**。→ **本批集中补的是 `tense`（4）／`word_order`（3）两个中档**（**`tense` 全库 52／`word_order` 全库 47**，数析 §5 实读）。
> **注 1（`word_order` 三处的差异化——本批必须明写）**：#151① 是 **`soon` → `as soon as`（缺两头）**；#152① 是 **`As soon` → `as soon as`（缺第二头）**；#153② 是 **#151① 的逐字回流**（`Soon as`）。→ **三条不同句、不同缺法，唯一重复的是回流位**（**收口案的合法形态**）。
> **注 2（新错①②`explanation` 的零术语自查）**：**两处 `explanation` 必须含「两头都要卡住」**（**L65 `:12009` 的逐字话术**）；**#151② 必须含「第 48 课那条规矩：if 里说现在，不用 will」**（**同源家规点名，不重讲**）；**#152② 必须含「后面那件还没发生，要带上 will」**。**全部 12 条 `explanation` 不得出现 29 词 ＋ 本批额外禁词（「时间状语从句」「状语」「语序」「让步」「转折」「门牌」）**——**特别是「从句」（讲 `as soon as` 后面那半句时最易写）；统一写「一整句」「前面那件／后面那件」「两头都要卡住」。**
> **注 3（旧错回流的选句处置——本批与批二十二完全不同的一组句子）**：**批二十二的旧错用了 `Yesterday I go to the park.`（L10）／`two box.`（L11）／`They was happy.`（L19）／`He drink milk every day.`（L25）**。**本批四处全换**（**逐句实测 HC 复用次数 ＋ 逐句核 practice 头寸**）：
> - **L10 换成 `Yesterday I go home late.`**（**HC 命中 0 处**；**理由：`Yesterday I go to the park.` 实测已在 6 课的 practice 答案里顶死红线（§8.1），绝对不可再用**；`Yesterday I go to school.` 在 HC 有 1 处，次选）。
> - **L11 换成 `I ate two sandwich.`**（**HC 命中 0 处**；**这句正是 L11 自己的 `contrast` ① 错句**〔`grammarLessons.ts:1978-1980`〕，**回流最贴**；`We have two apple.` 在 HC 有 2 处、`two box.` 有 5 处——**都偏热，故不用**）。
> - **L19 换成 `My sister and I was happy.`**（**HC 命中 0 处**；**L19 `:3473` 的 `contrast` ⑥ 逐字就是 `My sister and I is happy.`**——**同一课的同型句，回流最贴**；`They was happy.` 在 HC 有 8 处、`We was happy.` 有 4 处——**都偏热，故不用**）。
> - **L25 换成 `She like music.`**（**HC 命中 0 处**；**这句正是 L25 自己的 `contrast` ② 错句**〔`grammarLessons.ts:4548-4550`〕，**且 `She likes music.` 是 L25 `:4529` 的 examples**；`He drink milk every day.` 在 HC 有 4 处、`He drink milk.` 有 3 处——**都偏热，故不用**）。
> **→ 结论：本批四处旧错全部取「HC 零复用 ＋ 与本课原 contrast 同型」的句子**，**回流最贴、重复度最低**。
> **注 4（`Yesterday I go home late.` 的用度核查）**：**本 PRD 实测**：`"Yesterday", "I", "go", "home.", "late."` 整句 **HC 命中 0 处**（`Yesterday I go home.` 有 1 处；`Yesterday I go home late.` **0 处**）；**GL 侧 `late` GL 79**（在库 ✓）。→ **可用**（**新句新搭配，零重复**）。**⚠️ `late` 是 L48 之后的新词，但它在库内已有 79 处、属已学词**（**数析 §1.5 的三单盘点未覆盖 `late`，本 PRD 已单列复验**）。
> **注 5（tokenIndex 定稿）**：上表只给「原 → 修正」，**生产时逐 token 核 `tokenIndex` 与 `tokens` 下标**。**短句排一行的下标规律**（照 #143–#150）：第 1 句从 0 起、第 2 句从「第 1 句词数」起、依次累加。**本批逐案下标**（按「四句排一行」定稿）：

| 案 | tokens（逐字） | 错点下标 |
|---|---|---|
| **#151** | `["As","soon","as","he","comes","home,","I","will","tell","him.","As","soon","as","he","will","comes","home,","I","will","tell","him.","Yesterday","I","go","home","late.","I","ate","two","sandwich."]` | ① **1**（`soon`）② **14**（`will`）③ **22**（`go`）④ **29**（`sandwich.`） |
| **#152** | `["As","soon","I","finish,","I","will","eat.","As","soon","as","I","finish,","I","eat.","My","sister","and","I","was","happy.","She","like","music."]` | ① **1**（`soon`）② **12**（`eat.`）③ **19**（`was`）④ **21**（`like`） |
| **#153** | `["As","soon","as","he","will","comes","home,","I","will","tell","him.","Soon","as","he","comes","home,","I","will","tell","him.","As","soon","as","I","finish,","I","eat.","Yesterday","I","go","home","late."]` | ① **4**（`will`）② **10**（`Soon`）③ **22**（`eat.`）④ **30**（`go`） |

> **⚠️ 净词校验（逐案，本 PRD 逐 token 复算）**：#151 `tokens 30 > errors 4` ✓｜#152 `tokens 23 > errors 4` ✓｜#153 `tokens 31 > errors 4` ✓。
> **⚠️ 标点口径（逐案须核）**：**三处带尾标点的原文（`sandwich.`／`eat.`／`late.`）必须与 `tokens` 逐字一致**（先例 `huntCases.ts:6634` 的 `"apple."`／`:7074` 的 `"sandwich."`／`:7602` 的 `"box."`／`:7646` 的 `"cup."` 均带尾标点）。
> **⚠️ 三处补词型 `correction`（单 token 可修）**：#151① 的 `"as soon as"`／#152① 的 `"as soon as"`／#152② 的 `"will eat"`——**删除型**：#151②／#153① 的 `"去掉 will"`（**逐字同型先例** 案 #57 `:3645` 与 `:3719`）。

---

## §12 Non-goals

- **不做第 4 课**（**两个来源双双否决**：`once` ＝ 同义换词〔Cambridge 逐字「We use once as a conjunction meaning 'as soon as' or 'after'」〕；`by the time` ＝ 另轴且绑定 C 档的 `will have`，§1.2 裁决三）
- **不做第 2 课**（**切开位是本批唯一独立价值**；不切开则本批退化为「多背一个短语」，档位应从 B 降到 C，§2.1）
- **不做** `once`（**且比竞析更严：连「换个说法」的认读位也不写**——**`once` 全批零出现**，§6.6）
- **不做** `by the time`／`will have`（**另一条语义轴**；`will have` GL 0／HC 0）
- **不做** `as if`／`as though`／`as long as`／`unless`／`in case`（**全 0，另一条线**；Murphy 中级 U113–U115 是连续三个单元，**可能是一条撑 2–3 课的连续课位链**，留给后续研究）
- **不碰雨线**（`rain`／`raining`／`stops`／`stopped`／`the rain stopped`）**与电影线**（`movie`／`ends`／`ended`）——**L109 的叙事资产 ＋ L139–L141 的跨批连续剧**（§3）
- **不碰 `until` 的任何扩写**（**L109 的身份词**；**本批英文 `until` 零出现**，G11）
- **不做 `as` 的其他用法**（**`as tall as` 是 L65 的领地**，**L109 `:20346` 的 `as` 只作双正解位引用一次**——**本批不开 `as` 的第三个义**）
- **不做** `while`／`when` 的让步义（`While I was reading…` 是 L98 的时间义；**让步义的 `while` 不在本批**）
- **不做**双拱（批十四破例一次后，**批十五至二十三连续第十次单拱**）
- **不做**「复现型大章」（**本批 L144 是 1 课收口，不是整章复现**，§9.2）
- **不做**「换轴」（语法+读写／听力混合课）——**跨源无先例**
- **不做** `seem`／`appear`（C＋，维持不排期）／`would rather`（B−，2 课封顶）／`neither/either/both`（B−，4 词超上限）／`the same as`（C）／`shall we`（D）／`why not`（C）／`have sth done`（C，维持撤出）
- **不做** `GRAMMAR_WORDS` 词表扩容（**数析 §7.1／瑞思 §6.4③ 一致判不改**——**关 2 的定位是「回马枪」而非「本课考点复练」；且加 `soon`／`as` 会改动全库 141 课的关 2 行为，回归面远超单批收益**）
- **不做** `soon` 的变形分支白名单（**本 PRD 已源码级确认 `soon` 不在 `KNOWN_VERBS`，不产出伪词**，§7.4 ①）
- **案量不扩**：3 课 3 案，不设「一课两案」；**不加**新枚举、不改 `tagStats`／schema、**不改 `types.ts`**
- **不动 L1–L141**（一字不改；**特别声明**：不改 L48／L65／L109／L90／L91／L92／L97／L98 被认领的句子；不改案 #57／#74／#118）
- **不引**番外 5 案（`hunt-white-cat`／`hunt-sports-day`／`hunt-pen-pal-letter`／`hunt-fridge-note`／`hunt-term-review`）
- **不做**池外新资产（封面＝cover25–cover27 池内复用，数析 §9.2 唯一解；**三张内部互换是唯一允许的换法**；`cover1`–`cover24` 禁用、`cover118`+ 不存在）
- **不做**中文侧术语直抄（**「從句」「主從」「時態」三词全部不引**——**中文侧 `conjunctions` 专文与 `after` 专文本轮只取到原文级规则句，术语一律不落地**）

---

## §13 开放问题

1. **L142 的目标句 10 词是否要压到 8 词**——**本 PRD 定稿 `As soon as he comes home, I will tell him.`（10 词）**，理由三条（场景正句／零件全在库／8 词句 `As soon as I finish, I will eat.` 已用作 L143 目标句）。**代价：超任务书 8 词线 2 词**（**不越库内先例：最长 14 词、≥8 词的 15 课**）。**备选**：把 L142／L143 两句互换（**L142 取 8 词句、L143 取 10 词句**）——**代价：L143 的切开课会失去「两句只差开头」的并排形态**。**默认处置：不改**（**若主理人坚持 8 词线，唯一不破切开形态的换法是 L143 的对照句也改成 10 词版 `When he comes home, I will tell him.`——本 PRD 已把该句写进 L142 `contrast` ⑤ 备好**）。
2. **ambush 侧 `As soon as…` 句恒落 `As`（比批二十二的假友好更彻底）**——**观测点：L142 的关 2 回访正确率是否低于全批均值**；**⚠️ 本批的题面会变成「___ soon as he comes home…」，考点从「一到就」偏成「哪个 as」**。**默认处置：不改引擎**（§7.1 三条理由）。**备选（须主理人裁）**：**往 `GRAMMAR_WORDS` 加 `soon`**——**代价：改动全库 141 课的关 2 行为，回归面远超单批收益**（**批十七数析对 `neither/either/both`、批二十二对 `although/though` 提过同样建议，两次均判「不改」**）。
3. **`once` 的「一旦」义是否要立岗**——`once` GL 11 全部在 L72 的「一次」义，**「一旦」的连接义全库零**，**与 `as soon as` 语义同一件事**（Cambridge 逐字把 `once` 的连词义定义为 `as soon as`）。**本批不碰**；**须观察学生在本批后问不问「那 once 呢」**（**若高频出现，说明它是一个活跃缺口**）。**负责：竞析；时机：观察**。
4. **三单 -s 形式的系统性缺口（数析 §1.5 本轮新发现，最重要的一条）**——**57 个常见三单形式里 23 个真零**（`arrives`／`rings`／`gets`／`finishes`／`calls` 等），**在库的只有 34 个**。→ **这不是本批的问题，是全库级的取材约束**：**任何「他／她／它＋动词」的新场景都在撞这堵墙**。**本批正是靠 `comes`（在库的 34 个之一）才拿到零造词的场景**。**负责：数析；时机：批二十四研究期（建议优先级最高）**。
5. **`can-do-m25` 零引用的机制缺口**（**沿用批二十二 §13 序 12 的登记**）——**本 PRD 已复跑 `grep -rn "can-do-m" src/` 过滤掉 `GrammarPathPage.tsx` 后无输出**——**全仓 `can-do-m*` 零引用，漏加不会红**。**默认处置：人工核**（G8-b 已列）。**负责：数析；时机：批二十三生产期**。
6. **封面二用池的长期耗尽（本批是第三个触发点）**——本批取 3 张后 **二用池 24→27 张、单次张 93→90 张**（数析 §9.2）。**建议主理人在 F23-B 关账时评估「三用」策略或新增封面**（**产品决策，非数据结论**）。**机制缺口（沿用登记）**：**「课有 `cover` 但图缺失」不报红**。**负责：主理人；时机：F23-B**。
7. **`as soon as` 的「重复感」（本批头号产品风险）**——**本批的新规矩是 L48 已教过的同一条**（§4.4）。**观测点：L142 与 L143 的完成时长之比**（**若 L142 明显更慢，说明在重讲 L48，须回炉**）。**默认处置：不改设计**（**L142 的 `deepDive` 已按 §4.2 第 5 项写死「这是同一条规矩的第二次应用」**）。**负责：瑞思；时机：F23-A 打样门**。
8. **L143 的「一刻之差」教学效果**——**无法在数据层验证**（瑞思 §7.1 未核实③）。**唯一办法是 F23-A 打样门实测该课的跳过率**（§10 G-A5）。**负责：瑞思；时机：F23-A**。
9. **`as soon as` 的语音素材是否覆盖 `soon`**——数析 §A4 未核实②：**`speechService` 是否有 `soon` 的音素／TTS 覆盖未查**（**若跟读题依赖发音库，可能须补**）。**负责：数析；时机：批二十三生产期**。
10. **`bundledDictionary` 是否收 `soon`**——数析 §A4 未核实③：**影响「生词提示」类功能的取材**。**负责：数析；时机：批二十三生产期**。
11. **基线口径**——本 PRD 引用的测试基线是**本 PRD 实跑快照：61 文件 / 799 项全绿**（`npx vitest run` → `Test Files 61 passed (61) / Tests 799 passed (799)`）。**生产时以实跑为准并登记**（G16 写 799，若生产期再变以实跑登记）。
12. **批二十二 F22-A 的观察门未回**——**本批开工不等待**（沿用批二十口径：**门未回不阻断开工**）；**本批的实测回收点＝F23-A（L142–L144 三课的完成率曲线），须与批十九 3 课／批二十二 3 课两条同量线并读**。

---

> 本规格书由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。
