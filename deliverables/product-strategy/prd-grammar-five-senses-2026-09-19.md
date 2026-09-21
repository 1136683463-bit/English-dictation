# PRD：第二十批 · 五种感官（L128–L133 · 6 课）

**日期**：2026-09-19 ｜ **类型**：功能规格书（PRD）｜ **成员**：析客（需求分析）
**上游输入**：主理人裁决（批二十＝「五种感官」大章 6 课 L128–L133、单拱、感官动词延展、`look forward to` 推迟至批二十一）；本批三研究（瑞思 `user-research-grammar-twentieth-batch-2026-09-19.md`／数析 `data-audit-grammar-twentieth-batch-2026-09-19.md`／竞析 `competitive-analysis-grammar-twentieth-batch-2026-09-19.md`，均 2026-09-19）；上批 PRD `prd-grammar-look-2026-09-19.md`（格式与护栏基线）

## 📝 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1 | 2026-09-19 | 初稿：6 课（L128–L133）＋6 案（#137–#142），开 season-20、m22；定位「小章之后回大章」；**档位诚实标注为「造词课」**（须新造 `sound(s)`／`smell(s)`／`taste(s)` 三个动词）；`look forward to` 按裁决推迟到批二十一 |

## 📌 TL;DR

1. **批二十＝6 课（L128–L133）「五种感官」单拱大章**：立岗 `sound`（L128 `It sounds great.`）→ `smell`＋`good` 不是 `well`（L129 `It smells good.`）→ `taste`＋不加 -ly（L130 `This cake tastes good.`）→ `feel`（触觉）＋与 L76 切开（L131 `The water feels cold.`）→ 四感官共用的「不」和「问」（L132 `Does it sound good?`）→ **零新知收口**（L133 五句排一行＋`look forward to` 认读种子位）。开 **season-20（{128,133}）＋m22（afterLesson 133）**，批量 **133 课、142 案**。
2. **档位＝造词课（本项目第一次造三个动词）**：`sound`／`sounds`／`smell`／`smells`／`taste`／`tastes` **GL＋HC 两文件全 0**（本 PRD 独立 `grep -o -i -w` 复验：全部 0）；`feels`／`felt` 亦 0；**唯一「半垫子」＝`feel`**（GL 27 处＝26 词次＋1 id 串，HC 4 处，全部是 L76／L78 `I feel much better today.` 同一句及其回显）。→ **对外一律写「造词课：须新造三个动词，与批十八『库内有垫子』有本质区别」**（§1.3／§3.1）。
3. **选题裁决＝取瑞思方案，`look forward to` 推迟到批二十一**（四条理由见 §1.2）：① 连续三批围绕 `look` 与 `to` 两个词；② 会为库内被**四次断言为绝对**的「`to` 后面穿原样」（L15 `:2760`／L44 `:8065`／L46 `:8443`／L93 `:17362`）同批开第三个例外；③ `to + -ing` 的正面接口是「批十八独木」（本 PRD 实测 `to + -ing` 全库 79 处，L120 33／L122 24／L124 12＝批十八占 71 处，其余 8 处全在错卡或零星句）；④ 感官方向是批十九的**同骨架自然延展**，零结构冲突。**`look forward to` 档位 B+ 保留，在 L133 留一个「认读不练」的种子位。**
4. **`look` 是本批红区**：批十九 L125–L127 已占 `look` 家族绝大多数（本 PRD 实测 L125 起始行起 `look` 命中 **151 处**，`grammarLabel` 含 `look` 的课只有 L125／L126 两课）。→ **L128–L132 全批 `look` 命中 = 0**（硬门，§6 G11），**只在 L133 收口课出现一次**（逐字取 L125 `:23407` `It looks nice.`）。
5. **与批十八零交集**：本批六课 `targetSentence` **不含 `to`**（逐句核），也不出现 `used`／`getting`／`walking`。
6. **cloze 是真友好（本批最大技术优势）**：`sounds`／`smells`／`tastes`／`feels` **不在 `GRAMMAR_WORDS` 148 词表内**，但因长度 ≥3 且不在 `CLOZE_STOP_WORDS` 30 词内，**走第 ② 档实词回退，空位恰好落在考点词上**（本 PRD 逐字复刻抽词器实跑留档，§6 G12）。**两处必须按实测改句**：`This soup tastes nice.` 的空位被 `soup` 抢走（且 `soup` GL 0）→ 改 `This cake tastes good.`；`The water feels cold.` 的空位被 `water` 抢走 → 保障句改用 `It feels cold.`（§6 G12 逐课登记）。
7. **零术语高危三词：形容词／系动词／感官动词**——`sound + 那个「怎么样」的词` 的语言学描述就是「系动词 + 形容词」，而「形容词」在 29 词红线表内（`grammarZeroTerms.ts:17-24` 逐字实读）；「感官动词」四字属本批额外禁用（禁在首屏三字段）。→ **全批一律写「那个『怎么样』的词」＋「谁上场谁管这一段」**（§4.3 替换表）。
8. **中文负迁移打透：-ly 误用三条 ❌**（`It smells well.`／`This cake tastes well.`／`The water feels coldly.`）＋中文侧 `sense-verbs` 原文四型（`sounds great` 不是 greatly／`feels so smooth` 不是 smoothly／`smells so good` 不是 well／`tastes so bitter` 不是 bitterly）——**批十九只落 2 型，本批把「闻」「尝」两型正面接住**（§4 逐课）。
9. **案件 6 案（#137–#142）**：每案 4 错＝新错 2＋旧错 2、单 token 可修、≥1 净词、`reviewed: true`；罪名全落 **10 枚举**、**不碰 comparison**；旧错只取 **L10／L11／L19／L25**；**避开 `fragment`／`run_on` 连续同型**（本批 0 处）；番外 5 案冻结；**`guided.spot` 的 `wrongToken` 必须与 `tokens` 元素逐字相等（含尾标点）**（L96／L102 前车之鉴）。
10. **G-boost 硬护栏**：每课 `contrast` 6 条中 **3 条带 `wrongMark`**（禁止贴线）；`wrongMark` 不得为纯标点；双正解卡 `diffScore < 90`（本 PRD 逐组实跑留档，最高 75）。

## 🎯 核心结论卡片

| 项目 | 内容 |
|---|---|
| 推荐方案 | 6 课 L128–L133「五种感官」单拱：`sound` 1 → `smell` 1 → `taste` 1 → `feel` 1 → 否疑 1 → 零新知收口 1；6 案 #137–#142；开 season-20＋m22 |
| 优先级 | P1（内容生产批次）；无 P0 阻断项 |
| 预期影响 | **本项目第一次造三个动词**（`sound(s)`／`smell(s)`／`taste(s)` 两文件全 0），把批十九 `look + 那个『怎么样』的词` 的骨架扩成四感官矩阵；中文侧 `-ly` 负迁移线（L125 ④／L126 ③ 两张 ❌ 卡）在本批续站两型；`feel` 从批十九的「全批 0 次」冻结中解冻，并首次与 L76 的「身体感觉」义切开 |
| 资源需求 | ≈3.5 人日（内容 3＋展示层 0.25＋走查 0.25）；两段式 |
| 风险等级 | 中（① **造词课**——三动词零底座，§3.1 逐词给法；② 与批十九的**同骨架重复感**（6 课换词不换架，瑞思 §7 假设 1 列为最大教学未知）；③ 「感官动词」四字天然会写进首屏（**零术语头号陷阱**）；④ `feel` 两个用法串台；⑤ 封面图像语义未核） |
| 硬性范围红线 | 课量 6 不扩不缩；一课一增量；L133 零新知；六段式；每课 1 案（4 错＝新 2＋旧 2、单 token 可修）；对比卡 6 条（**3 条带 wrongMark**）；零术语词表 29 逐课自查；comparison 不进案件；tagStats=10 不动；**L1–L127 一字不动**；番外 5 案冻结；covers 池内取（cover11–cover16）；**L128–L132 `look` 命中 = 0**；**六课 `targetSentence` 不含 `to`**；**`forward` 只认读一次、不进练习不作错项** |

## §1 批次定位与选题裁决

### 1.1 命题（小章之后回大章）

批十九（L125–L127）是「3 课小章」——三研究已把「**章形态忽大忽小可能被感知为『内容缩水』**」列为批十九的独有节奏风险，并在路线图 §5-6 写明兜底：「**若被感知为缩水，批二十须回大章**」（`roadmap-grammar-nineteenth-batch-2026-09-19.md` §5-6）。season 分组实读佐证颗粒度不均：批十七 `season-17 {111,118}`＝8 课、批十八 `season-18 {119,124}`＝6 课、批十九 `season-19 {125,127}`＝3 课（`grammarSeasons.ts` 末三项）。

**批二十要回答的是**：小章之后回大章还是继续小章；若回大章，第二个 B1 段硬结构上什么。

**主理人裁决＝回大章（6 课），且上「五种感官」**，理由三条：
1. **批十九的 3 课是「容量自然封顶」下的诚实收缩，不是节奏选择**（瑞思 §0）——第 4 课起只能靠换词撑（`sound`／`smell`／`taste`／`feels`／`felt` 全 0）。**若批二十继续小章，等于把一次收缩默认成常态。**
2. **感官方向是批十九的同骨架自然延展**：骨架一字不改（`东西 + 那个词 + 怎么样`），把「看」扩成「听／闻／尝／摸」四种，**零结构冲突、零边界让位**（§4 逐课）。
3. **它是造词课，但转化率显著高于另一个候选**：`sound`／`smell`／`taste` 是**核心高频日常词**（学习者几乎必然在别处见过中文对应表达），而 `look forward to` 的 `forward` 是**抽象方向词**（§3.1 造词成本对照）。

### 1.2 三研究结论与主理人裁决（含「`look forward to` 推迟」的裁决记录）

| 方案 | 三研究结论 | 主理人裁决 |
|---|---|---|
| **甲·五种感官大章（`sound`／`smell`／`taste`／`feel` ＋ `look` 收口）6 课 L128–L133** | 瑞思 §0 **推荐（主推方案 A）**：批十九的同骨架延展、零结构冲突、`-ly` 负迁移的续站；代价是「造词课，须诚实承认」；瑞思 §7 待裁 12 建议 **6 课封顶**（`look` 已占、`seem`／`appear` 两文件全 0） | **✅ 拍板：甲 6 课单拱** |
| **乙·`look forward to` 一族 5 课 L128–L132** | 竞析 §4.1 **首选方案**（「5 格，不是 3 格」）；竞析 §3 判 **B＋ 档**（本轮新增词典义项级 CEFR B1＋两个 Cambridge 专页＋`Verb patterns` 总索引条目＋`prepositional-verbs` 词表）；数析 §8 判「**推荐**：造词成本 2 词，可接受」 | **❌ 本批不做，推迟到批二十一**（裁决记录见下） |
| **丙 继续 3 课小章** | 瑞思 §0 备选 C **不推荐**：「F19-B 要到 1–2 周后才读，本批不能靠一个还没读到的信号决定形态」 | ❌ 不做 |
| `object to` 单独立项 | 三研究一致：竞析 §3 判 **C**（证据半页：仅一条搭配条无 CEFR＋一条美式学术词典例句；无语法专页）；数析 §1.6 **建议撤出或单独立项** | ❌ 不做（**连认读也不给**） |
| `have sth done` | 三研究一致维持撤出（`haircut` 0／`repaired` 0／`will have` 0／`had my` 0，两文件） | ❌ 维持撤出 |
| 形容词＋介词单开 | 三研究一致维持折卡（六族只覆 1/6：`good at` GL 52／HC 6，其余八式全 0） | ❌ 不单开（**本批连折卡也不做**——6 课对比卡已被感官边界占满） |

**「`look forward to` 推迟」的裁决记录（主理人独立核实，写进规格、不再论证）**：

| # | 理由（主理人独立核实） | 实读证据 |
|---|---|---|
| ① | **会让连续三批围绕 `look` 与 `to` 两个词** | 批十八 `to`（`be used to`）→ 批十九 `look`（L125–L127 三课 `grammarLabel` 全部含 `look`）→ 批二十若做 `look forward to`，三个连续批次的重心压在两个词上。**批十九已把 `look` 家族用满**：本 PRD 实测 L125 起始行起 `look` 命中 **151 处**，`grammarLabel` 含 `look` 的课只有 L125（`:23399`）／L126（`:23593`）两课 |
| ② | **会为库内被四次断言为绝对的「`to` 后面穿原样」同批开第三个例外** | 库内四处绝对断言（本 PRD 逐字复核）：L15 `:2760`「to 后面的动词永远穿原样：want to go、wants to go、wanted to go——变的只有 want 自己，to 后面从不动」／L44 `:8065`／L46 `:8443`／L93 `:17362`「to 后面永远穿原样」。批十八已开第一个例外（有 be 站着的 `to` 认名字版） |
| ③ | **`to + -ing` 的正面接口实测是「批十八独木」——没有第二根柱子可借** | 本 PRD 逐课实跑：全库 `to + [a-z]{3,}ing` 共 **79 处／10 课**，其中 **L120＝33／L122＝24／L124＝12（批十八占 71 处＝89.9%）**；其余 8 处是 L47 `:8627`（❌ 错卡 `I should to helping her.`）／L100（`used to playing` 错侧）／L121（2）／L29（`going to watching` ❌）／L44（`to buying` ❌）／L46（`to traveling` ❌）／L93（`used to playing` ❌）。**正面教学句只有批十八一家。** 注：主理人另按「正面教学句」口径实测共 14 处、其中 10 处在批十八（L120×6／L121×1／L122×2／L124×1），L22 的 4 处是 `have been to Beijing`（`to` ＋地名，非 `-ing`）——**两种口径结论一致：没有第二根柱子** |
| ④ | **感官方向是批十九的同骨架自然延展，零结构冲突** | 骨架与 L125 `It looks nice.` 一字不改（`东西 + 那个词 + 怎么样`），只有「换哪个感官词」一个变量；**一课一增量天然成立**（竞析 §3 判「认知负荷低」） |

**「推迟」的三条配套裁决（写进本 PRD，不再论证）**：
1. **`look forward to` 档位 B+ 保留，不杀**（竞析 §3 序 1 的档位记录在册：词典义项级 B1＋两个 Cambridge 专页＋`Verb patterns` 总索引 8 专条之一＋`prepositional-verbs` 词表内）。
2. **批二十一开课时整课造**（`forward` 两文件全 0，一次性投入；`seeing` 若要用可被 L87 `see you` 正向复用）。
3. **L133 收口课留一个「认读不练」的种子位**（瑞思 §6⑤）：`examples` 第 4 条放 `I am looking forward to the weekend.`，标「认读一句，混个脸熟」——**不进 `practice`／`guided`／不作错项**（完全照搬批十九 `It looks like rain.` 的处理口径）。**注**：瑞思 §6⑤ 的默认建议是「不加」（理由：会新增 `to + -ing`）；**主理人裁决取「加」，但只作认读种子位**——本 PRD §2.2 L133 按「加」写规格，并把它的三条护栏写死。
4. **`feel` 的解冻范围＝批十九一次性限定**（瑞思 §7 待裁 1）：批十九「`feel` 全批 0 次」不跨越批二十，本批 L131 正面教 `feel`（含 `feels`）。

### 1.3 批次定位：单拱大章 6 课；档位＝造词课（本项目第一次造三个动词）

本批取**单拱**（判据沿用批十五起：单拱＝全批共享一条场景线），**是本系列第二个 6 课大章**（第一个＝批十八 L119–L124），与批十八同规格、低于批十七的 8 课。

**场景线（单拱一句话）**：**厨房（听／闻／尝）→ 客厅（摸）→ 书桌（排一行收口）**。

`L128 客厅门外听厨房里的歌（mansion）` → `L129 厨房掀锅盖（mansion）` → `L130 餐桌生日蛋糕（mansion）` → `L131 客厅窗外下雨、杯子放久了（mansion）` → `L132 校园课间问同学新歌（campus）` → `L133 书桌复盘（sparkle）`。**scene 只用库内既有值**（本 PRD 实读在用 11 种：`mansion` 41／`campus` 35／`city` 22／`sparkle` 8／`school` 5／`island` 5／`train` 3／`mystery` 3／`magic` 2／`forest` 2／`snow` 1），**不引入新场景 id**（沿用批十九纪律）。

**档位标注（诚实标注，本批纪律——本批最重要的一条）**：

| 项 | 本批（批二十） | 对照：批十八（`be used to`） |
|---|---|---|
| 新造动词 | **3 个**：`sound(s)`／`smell(s)`／`taste(s)` **两文件全 0** | 0 个（`used`／`used to` 库内有 L93／L100 垫子） |
| 半垫子 | **1 个**：`feel`（GL 27 处／HC 4 处，全是 L76／L78 同一句及其回显） | — |
| 新造形容词 | **0 个**（`good` 106／`nice` 168／`great` 7／`cold` 202 全在库，§3.2 选词纪律） | — |
| 新造名词 | **0 个**（`cake` 54／`music` 41／`water` 9 在库；**不用 `soup`**——GL 0） | — |
| 结论 | **造词课：3 个动词全造**，库内无现成句子可借（**本项目第一次造三个动词**） | 「升格课：给已有句子发身份」 |

> **对外口径（本批必须遵守）**：写「**造词课——须新造 `sound`／`smell`／`taste` 三个动词，与批十八『库内有垫子』有本质区别；`feel` 是唯一半垫子（L76 一句）**」。**不得**写「零成本升格」、**不得**写「库内有现成句子」。
> **折扣与增项并列（不得只写好话）**：折扣＝三个动词零底座；增项＝① 形容词侧零造词（三个厚词 `good`／`great`／`cold`）；② 骨架零成本复用批十九；③ cloze 落点**真友好**（空位恰好落在考点词上，§6 G12）——**这一条是本批相对批十九的客观优势**（批十九 `look`／`looks` 走第 ① 档直命中，本批走第 ② 档但仍落在考点词上）。

## §2 拆课方案与逐课规格

### 2.1 课量决策：6 课（L128–L133）——为什么不是 5 课、为什么回大章

**容量账（逐条）**：

| 账 | 数 |
|---|---|
| **上游最大自然容量** | **6 格**：① `sound` ② `smell` ③ `taste` ④ `feel`（触觉）⑤ 四感官共用的否疑一套 ⑥ 零新知收口。**每格一个真实增量**（§2.2 逐课表），无空格。 |
| **为什么不是 5 课** | 砍任一格都掉一件真增量：砍 ④＝`feel` 这一格推迟（**而 `feel` 是四词中唯一有半垫子的**，最该做）；砍 ⑤＝否定疑问无处落（而 L125 的否疑骨架已有先例，且中文「它不好听」是高频产出）；砍 ⑥＝章末无收口（**收口先例已有七代**：L54 `:9823`／L78 `:14362`／L94 `:17400`／L102 `:18919`／L110 `:20418`／L118 `:22040`／L124 `:23217`）。 |
| **为什么不是 7 课** | **第 7 课起无新感官可加**：`look` 已由批十九占用（本批红区）；`seem`／`appear` 两文件全 0 且属 D 档（瑞思 §7 待裁 12）。**6 课封顶，不硬扩。** |
| **对标先例** | 批十八＝6 课（单头 `be used to` ＋ `get used to` ＋ `used to` 三头并列）；本批＝**四头并列**（`sound`／`smell`／`taste`／`feel` 各一课）＋否疑 1＋收口 1——**结构上比批十八更「平」，故必须靠「否疑」与「收口」两格撑住后半程**。 |
| **一课一增量检查** | L128（`sound`）→ L129（`smell`＋`good` 不是 `well`）→ L130（`taste`＋不加 -ly）→ L131（`feel` 触觉＋与 L76 切开）→ L132（否疑一套）→ L133（零新知）。**六课六个落点，无一重复。** |

**「回大章」的正当性（三条，写进生产单）**：
1. **不是节奏调节，是内容驱动**——6 格内容是实打实的（§2.2 逐课表每格一增量）；竞析 §4.4 结论原文：「**竞品给不了『章节大小交替』的形态背书**（BC 与 Murphy 连『章』都没有），**唯一可抄的原则是『内容自然容量决定章长』**」。
2. **B1 段第二格的纪律不冲突**——批十八路线图 §6.2 的「防两个 `to + -ing` 同日出现」在本批不触发（**本批六课 `targetSentence` 不含 `to`**）。
3. **F19-B（3 课小章完成率曲线）未回不阻断开工**——它要到 1–2 周后才读；本批按「回大章」上线，**并把它列为 F20-B 的实测回收点**（§9 开放问题 4）。

**课表（课注 id 已冻结）**：L128 `lesson-128-it-sounds-great`｜L129 `lesson-129-it-smells-good`｜L130 `lesson-130-it-tastes-good`｜L131 `lesson-131-the-water-feels-cold`｜L132 `lesson-132-does-it-sound-good`｜L133 `lesson-133-five-senses`。**六个 id 在本 PRD 落盘前已实读确认全库无冲突**（`grep 'id: "lesson-12[8-9]' / 'lesson-13[0-3]'` 无输出）。

**封面（数析 §6.4 唯一解 · 池内复用）**：`L128←cover11`｜`L129←cover12`｜`L130←cover13`｜`L131←cover14`｜`L132←cover15`｜`L133←cover16`。
- **实算依据（数析 §6.3–6.4）**：工作区现有 **117 张图、127 次使用**（单次池 **107 张 `cover11`–`cover117`**／二用池 **10 张 `cover1`–`cover10`**／三用 0）；`cover1`–`cover10` 在 L128 处的 min-gap 仅 **1–10**，全部低于 **35 可用线**（`cover8`→L125／`cover9`→L126／`cover10`→L127 是批十九刚落的）；`cover11`–`cover117` 均单次使用且首次使用点＝自身编号。
- **最优指派＝min-gap 117，二分答案 ＋ 全枚举验证：可行解恰好 1 组、无自由度**（数析 §6.4 原文；6 课档位下解仍唯一）——`cover11`（前次 L11 `:1952` → 新用 L128）＝117；`cover12`（L12 `:2134`）＝117；`cover13`（L13 `:2317`）＝117；`cover14`（L14 `:2500`）＝117；`cover15`（L15 `:2684`）＝117；`cover16`（L16 `:2868`）＝117。**本 PRD 已逐张实读 `cover: cover11..16` 的现有落点行号确认为上表**。
- **本批禁用**：❌ `cover1`–`cover10`（二用张，段距 1–10）；❌ `cover96`＋（在 L133 的天花板 ≤ 37 但 min-gap 会掉；数析 §6.5 边界随课位重算，6 课口径下保守取 **`cover11`–`cover93`＝83 张**为可用池）；❌ `cover118`+ **资产不存在**（实读 `src/assets/lessons/` 共 **117 张 jpg**，`lesson-118.jpg` 起缺失——本 PRD 已 `ls | wc -l` 复验＝117）。
- **逐张目视核对（本 PRD 已做 6/6，瑞思只做了 2 张）**——⚠️ 这是本批与批十九的一处流程改进（批十九仅目视 3/5）：

| 张 | 原课 | 目视结果（本 PRD 逐张实看） | 与目标场景相称性 |
|---|---|---|---|
| `cover11`＝`lesson-11.jpg` | L11 | 火车车厢内，女孩在窗边小桌前写信，窗外落日麦田；**头顶气泡里是「三明治＋水果」** | ⚠️ **相称**——气泡里的**食物**正好贴 L128「厨房/食物」线（虽是听首歌，但餐桌食物意象可用）；**外景（车厢）不符**，见 §9 开放问题 2 |
| `cover12`＝`lesson-12.jpg` | L12 | 夜晚卧室书桌前画画，窗外月亮星星，气泡里是调色盘 | ⚠️ **不符**——夜晚卧室／画画，与 L129「厨房掀锅盖」不符；**建议与 `cover13` 或 `cover14` 互换**（见下注） |
| `cover13`＝`lesson-13.jpg` | L13 | 美术教室里一群孩子画架前画画，阳光、颜料瓶、花 | ❌ **不符**——画室场景与 L130「餐桌蛋糕」不符；**但画面有「食物色系的花果」可勉强对应「看着好」**，属兜底可接受 |
| `cover14`＝`lesson-14.jpg` | L14 | 奶茶店柜台前，女孩接过一杯珍珠奶茶，店员递杯 | ✅ **相称**——**柜台＋饮品类**最贴 L131/L132 的「厨房/尝」线（**本批相称性最高的一张**） |
| `cover15`＝`lesson-15.jpg` | L15 | 火车车厢内女孩在笔记本上写字，行李箱，窗外青山 | ⚠️ **不符**——车厢外景，与 L132「校园课间问同学」不符 |
| `cover16`＝`lesson-16.jpg` | L16 | 教室里女孩把作业本递给同学，黑板、课桌 | ✅ **相称**——**教室课桌**贴 L133「书桌复盘、抄在本子上」的收口意象 |

- **本 PRD 的处置（写死，不留活口）**：**默认按数析 §6.4 的唯一最优解上 cover11–cover16**（`cover` 在 `types.ts:590` 为可选字段，缺省回退 scene SVG，**语义不匹配不阻断上线**）；**若生产期认为 `cover12`／`cover13` 的「厨房/尝」感不足，唯一允许的池内换法是 `cover14` 与 `cover12` 互换**（`L129←cover14` 奶茶柜台／`L131←cover12` 夜晚卧室——**L131 的「客厅摸杯子」在夜晚卧室灯下也成立**）；**其余四张不动**。**注意 min-gap 117 的解唯一，任何重排都会让 min-gap 下降（仍远 ≥35，不阻断上线，只是最优性让位）。**

**episode 写法**：`小美的一天 一百二十八`／`一百二十九`／`一百三十`／`一百三十一`／`一百三十二`／`一百三十三`（末项实读 `:23788`「一百二十七」；**先例充足**：L103「一百零三」…L127「一百二十七」共 25 例；**L130 起写「一百三十」，不写「一百三零」**）。

**scene 取值**：L128–L131 `mansion`（厨房／客厅）→ L132 `campus`（课间）→ L133 `sparkle`（书桌复盘）。**不引入新场景 id**。

### 2.2 逐课规格

> **通用说明（6 课共同）**：六段＝① 看（情景讲解）→ ② 跟（guided：choose／arrange／spot／replace）→ ③ 忆（recall）→ ④ 练（practice ≥4 题）→ ⑤ 破（侦探挑战＝huntCaseIds）；本批 6 课**全部配 recall**（`grammarLessons.test.ts:69-88` 对 `number >= 13` 硬断言三字段非空）。所有字段名与形态沿用 `types.ts:478-618`。**结构性参数沿用批十八／十九逐课同规格**（实读 L119–L127 九课全部一致）：`examples` 4 条／`contrast` 6 条（其中 3 条带 `wrongMark`）／`variants` 3 条／`practice` 5 条（≥4，含 1 道否定或疑问变体）／`guided` 6 条／`sceneSwings` 3 条／`dialogue` 3 行（2 npc + 1 me）／`huntCaseIds` 1 个。
> **全批话术纪律（本批最重要的一条）**：`sound + 那个「怎么样」的词` 的语言学描述绝不能出现——「**形容词**」在 29 词红线表内（`grammarZeroTerms.ts:17-24` 逐字实读），「**系动词**」「**感官动词**」**两个词都在本批额外禁用清单**。**三字段（`grammarLabel`／`oneLineRule`／`summary.rule`）一律改写成「那个『怎么样』的词」「谁上场谁管这一段」「自己站中间」**（§4.3 替换表）。**⚠️ 「感官动词」四个字绝对不许出现在首屏三字段**（瑞思 §6-② 硬要求）。
> **⚠️ 读法说明（本表零术语自查的写法）**：下表「一句话规则」「对比卡方向」等单元格里，**每个字段值都放在开头的「」里**；**紧随其后的括注（零术语自查：……）／（生产红线：……）是给生产的元说明，不是字段内容**——括注里出现的「形容词」「副词」「系动词」「感官动词」等词是**被禁清单的列举**，不会写进 `grammarLessons.ts`。**生产时填入字段的只有第一对「」内的文字**（§6 G2-b 的机检口径：仅对三字段的实际值断言）。
> **全批 `look` 硬门**：**L128–L132 的 `targetSentence`／`examples`／`practice`／`guided` 四字段 `look` 命中数 = 0**（G11 逐课机检）；`look` 只在 **L133** 出现，且**逐字取 L125 `:23407`**。
> **cloze 纪律**：`sounds`／`smells`／`tastes`／`feels` **不在 `GRAMMAR_WORDS` 表内**（走第 ② 档实词回退，落点即考点词）；**两处句面必须按实测改**：**不得写 `This soup tastes nice.`**（空位被 `soup` 抢走，且 `soup` GL 0）／**`The water feels cold.` 的空位落 `water`**（保障句改 `It feels cold.`）。

**L128 它听起来不错（立岗 · 听）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-128-it-sounds-great`；`number: 128`；episode「小美的一天 一百二十八」；scene `mansion`；cover `cover11` |
| title / grammarLabel | 「它听起来不错」/「听起来怎样 · 听的那个词自己站中间」 |
| targetSentence | `It sounds great.`（3 词，≤8 ✓；**cloze 实跑落 `sounds`**——第 ② 档实词回退，本 PRD 逐字复刻实跑确认：`It ___ great.` / `sounds`） |
| sceneSetupZh | 早上在家里：妈妈在厨房放了一首歌，小美站在客厅门口听到——她说这首歌听着真好。 |
| intentZh | 它听着真好。 |
| 场景 | 家里：听东西——声音怎么样，一听就说出来 |
| 新知识点 | **只有一件**：**说「听着怎么样」时，听的那个词（`sound`）自己站中间，后面直接跟那个「怎么样」的词**——`It sounds great.`——**判据同 L125（中间不站 is）**：❌ `It sounds is great.`／❌ `It is sounds great.`。**「它」只有一个，所以 `sound` 要带小尾巴 s**（L25 `:4528` 老规矩）。**本课不碰 `look`**（全批红区）、**不碰 `smell`／`taste`／`feel`**（各自在后三课）、**不碰否定疑问**（L132 的） |
| 一句话规则（oneLineRule） | 「说「听着怎么样」：听的那个词自己站中间，后面直接跟那个「怎么样」的词——It sounds great。**中间不站 is**，跟第 125 课一个架子。」（**零术语自查：三字段不得出现任何禁用词** ✓） |
| 完课小结（summary.rule／points） | **rule**：「说「听着怎么样」：听的那个词自己站中间，后面直接跟那个「怎么样」的词（It sounds great）——中间不站 is。」**points**：① `It sounds great.`——听的那个词自己站中间；② `It looks nice.`（第 125 课）／`It sounds great.`（今天）——**同一个架子，换一双耳朵**；③ `It sounds is great.` ❌——中间不站 is。**三处均零术语** |
| 对比卡 6 条方向 | ① **真错卡（本课头号错）**：`It sounds is great.` ❌（**`wrongMark: "is"`**，`verb_form`——**中间不站 is**；whyZh「中间不站 is——听的那个词自己就够：It 【sounds】 great」（**逐字沿用 HC #124 的收句口径**：`huntCases.ts:7141` `correction: "去掉 is."`）；**先例** L125 对比卡 ①（同型、同 tag、跨课回流））；② **真错卡**：`It sound great.` ❌（**`wrongMark: "sound"`**，`sv_agreement`——**「它」只有一个，要带小尾巴**；whyZh「「它」是单个的，听的那个词要带上 s（第 25 课的老规矩）：It 【sounds】 great」；**先例** L125 对比卡 ③ `It look nice.` ❌ 同型）；③ **真错卡（对位中文侧 `sense-verbs` ❌1）**：`It sounds greatly.` ❌（**`wrongMark: "greatly"`**，`word_order`——**中文侧原文**：`The idea sounds great!`（不是 greatly）；whyZh「**加 -ly 是「做事的样子」**（第 58 课的老规矩）——这句不是说你做事怎么样，是说它**听着**什么样，后面直接跟那个词」）；④ **双正解卡（换耳朵 · 本课展示面）**：`It looks nice.` ✅ 并排 `It sounds great.` ✅（**bothRight，`wrongMark: null`**；whyZh「两句都对——**同一个架子，换一双耳朵**：第 125 课用眼睛，今天用耳朵」；**diffScore 实跑 33 < 90 ✓**）；⑤ **复习卡（L59 原句 · 与「做得好」切开）**：`She sings very well.` ✅ 并排 `It sounds great.` ✅（**bothRight，`wrongMark: null`**；whyZh「两句都对——第 59 课那句 `well` 说「她唱得好」（做得好）；今天这句说「听着好」（听着什么样）——**一个夸做法，一个夸听感**」；**diffScore 实跑 0 < 90 ✓**）；⑥ **复习卡（L89 原句 · 感叹回流）**：`What a nice day!` ✅ 并排 `It sounds great!` ✅（**bothRight，`wrongMark: null`**；whyZh「两句都对——第 89 课那句是抬头看天的感叹；今天这句是听到好东西的感叹」；**diffScore 实跑 0 < 90 ✓**）。**⚠️ 生产红线**：本课 6 条里 **①②③ 三条带 mark**（合计 3 条，过线不贴线）；**双正解三组 diffScore 实测 33／0／0，全部 < 90 ✓**；**登记的过近对（不得用作双正解）**：`It sounds great.`／`It is great.` **67**（可用但偏近，本课不用）、`It sounds great.`／`That sounds great.` **67**（不用）——**本课统一用上表四组（含 ⑤⑥ 的 0 分对）** |
| 变体三态 | 肯定 `It sounds great.`（cloze 落 **sounds**）／否定 `It does not sound great.`（noteZh：「不」请帮手 `doesn't`，**听的那个词退回原样**；**逐字复跑确认 ambush 落 `does` 第 ① 档**）／疑问 `Does it sound great?`（noteZh：**Does 搬句首，听的那个词退回原样**；**逐字复跑确认 ambush 落 `Does` 第 ① 档**）。**三句都保持「后面跟那个『怎么样』的词」不变**（否疑动的是前面） |
| 复现题设计（practice ≥4） | 第 1 题 target＋变体逐字题（**取疑问变体 `Does it sound great?`**，`grammarLessons.test.ts:11-29` 硬断言）；**第 2 题保障句 `That sounds good.`**（cloze 实跑落 **sounds**；whyZh「换个东西、换个「怎么样」的词——架子不动」；**注**：本句 L132 会再用一次作复现，两课相隔 4 课、不触发「同句最多 6 课」线）；第 3 题复现 L125 `:23407` `It looks nice.`（cloze 落 **looks**；**这是本批与批十九的接口题**，**`look` 只在本课的 `practice` 里出现这一次**——⚠️ 与 G11 的「`look` 四字段命中 = 0」冲突，**故本 PRD 处置：第 3 题改为复现 L89 `:16530` `What a nice day!`，`look` 句只留在对比卡 ④**）；第 4 题复现 L59 `:10846` `She sings very well.`（cloze 落 **sings**）；第 5 题复现 L58 `:10657` `She runs quickly.`（cloze 落 **runs**）。**每课 ≥1 复现题 ✓**。**⚠️ 生产红线**：`practice` 与 `examples` 的重合不得超过「4 题里最多 3 题」（`grammarLessons.test.ts:161-171`）；本课 `examples` 取 target／`It looks nice.`／`It is great.`／`She sings very well.` 四条 |
| 案件规划 | `hunt-it-sounds-great`（#137，§7）；新错 **`verb_form`（`It sounds is great.` 去掉 is）＋`sv_agreement`（`It sound great.` → `sounds`）**；旧错 `tense`（L10 `:1782` 昨天版）＋`plural`（L11 `:1964` 复数） |
| 六段要点 | ① 开场引 L125 `:23476` 的骨架（「东西站前面、听/看的那个词站中间、后面直接跟那个「怎么样」的词」）＋**一句话点名本课增量**「今天把耳朵加进来：换一个词站中间，架子一模一样」；② guided：`choose`（`It ___ great.` 选项 `sounds`／`sound`／`sounds is`）／`arrange` ≤4 token／**`spot`（`tokens: ["It", "sounds", "is", "great."]`，`wrongToken: "is"`——**逐字相等（无尾标点差异）**；`answer: "is"`；`correctionZh`「中间不站 is——听的那个词自己就够：It 【sounds】 great。」）**／`replace`「把 great 换成 good」（答案 `It sounds good.`，把本课增量做成一次动作）；③ recall 三字段（promptZh 给厨房放歌、你站在客厅门口听到的场景、intentZh「它听着真好。」、answer＝target、noteZh「听的那个词自己站中间——中间不站 is」）；④ practice 5 题；⑤ 破 `hunt-it-sounds-great` |
| 术语红线自查 | 用「听的那个词／自己站中间／那个『怎么样』的词／换一双耳朵」；**禁「感官动词」「形容词」「系动词」「表语」**——**「感官动词」是本课头号陷阱**（谈 `sound` 的类别时最易写，已按 §4.3 改写） |
| 走查观察点 | **「换词不换架」能不能一次看懂**（瑞思 §7 假设 1 第一读数）——走查问「`It sounds great.` 与 `It looks nice.` 哪个词换了」（**正确反应是「中间那个词」**）；**`-ly` 负迁移是否被 ③ 卡接住**（误答回流率＝`It sounds greatly.` 的选错率） |

**L129 它闻着好（换感官词 · 加一条「不用 well」）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-129-it-smells-good`；`number: 129`；episode「小美的一天 一百二十九」；scene `mansion`；cover `cover12` |
| title / grammarLabel | 「它闻着好」/「闻着怎样 · 闻的那个词自己站中间（说 good、不说 well）」 |
| targetSentence | `It smells good.`（3 词，≤8 ✓；**cloze 实跑落 `smells`**——本 PRD 逐字复刻实跑：`It ___ good.` / `smells`） |
| sceneSetupZh | 中午在厨房：锅盖掀开，热气冒出来，小美闻了闻——她说这锅闻着真香。 |
| intentZh | 它闻着好香。 |
| 场景 | 厨房：闻东西——气味怎么样，一闻就说出来 |
| 新知识点 | **只有一件（两半）**：① **换感官词**——`smell` 上场，架子与 L128 一字不改（**谁上场谁管这一段**）；② **「闻着好」说 `good`、不说 `well`**——`well` 是「做得好」（L59 `:10838` 老规矩：`good→well`），**这里说的不是闻得好不好，是闻着那个东西怎么样**。⚠️ **本课不引入「香」的新词**：`sweet`／`fresh`／`delicious` 两文件全 0（数析 §2.5 逐词实读）——**统一用 `good`**（GL 106 处） |
| 一句话规则（oneLineRule） | 「说「闻着怎么样」：闻的那个词自己站中间，后面直接跟那个「怎么样」的词——It smells good。**别把第 59 课的 well 套上来**：well 说「做得好」，这里说「闻着好」。」（**零术语自查 ✓**） |
| 完课小结（summary.rule／points） | **rule**：「说「闻着怎么样」：闻的那个词自己站中间，后面直接跟那个「怎么样」的词（It smells good）——「闻着好」用 good，不用 well。」**points**：① `It smells good.`——闻的那个词自己站中间；② `It smells well.` ❌——`well` 是「做得好」（第 59 课），这里要的是「闻着好」；③ `It sounds great.`（第 128 课）／`It smells good.`（今天）——**同一个架子，换一双鼻子**。**三处均零术语** |
| 对比卡 6 条方向 | ① **真错卡（本课头号错 · 中文侧 `sense-verbs` ❌3 正面落地）**：`It smells well.` ❌（**`wrongMark: "well"`**，`word_order`——**中文侧原文**：`The dinner smells so good.`（不是 well）；whyZh「`well` 是**做得好**（第 59 课的老规矩：good→well）——可这句不是说你闻得好不好，是说**闻着那个东西怎么样**，后面直接跟 `good`」；**先例**：L59 `:10866` 的 `wrongMark: "good"` 同词对反向（`She sings very good.` ❌），**同 tag `word_order`**）；② **真错卡**：`It smell good.` ❌（**`wrongMark: "smell"`**，`sv_agreement`——**「它」只有一个，要带小尾巴**；**与 L128 ② 同型、跨课回流**）；③ **真错卡**：`It smells is good.` ❌（**`wrongMark: "is"`**，`verb_form`——中间不站 is；**与 L128 ① 同型、跨课回流**）；④ **双正解卡（两个「听着/闻着」并排 · 本课展示面）**：`It sounds great.` ✅ 并排 `It smells good.` ✅（**bothRight，`wrongMark: null`**；whyZh「两句都对——**同一个架子，换一双耳朵／一双鼻子**：一个说听着好，一个说闻着好」；**diffScore 实跑 33 < 90 ✓**）；⑤ **双正解卡（与 L128 目标句并排）**：`It sounds great.` ✅ 并排 `It smells good.` ✅（**⚠️ 与 ④ 重复，故本 PRD 定为：⑤ 改为「与「就是好」切开卡」**）——**定稿 ⑤**：`It smells good.` ✅ 并排 `It is good.` ✅（**bothRight，`wrongMark: null`**；whyZh「**两张脸**：`smells` 那张是「我闻到的它」，`is` 那张是「它就是好」——中文一句「好」管两头，英语分两张脸说」；**diffScore 实跑 67 < 90 ✓**）；⑥ **复习卡（L11 老规矩回流 · 复数味道）**：`It smells good.` ✅ 并排 `The cakes smell good.` ✅（**bothRight，`wrongMark: null`**；whyZh「两句都对——**一个用 smells（它一个）、一群用 smell（它们一群）**：第 11 课的老规矩，今天轮到闻的这个词站队」；**注**：`cakes` 由 `cake`（GL 54 处，L52 主场）加 -s 得来，**非新词**；**diffScore 实跑需生产期登记**——本 PRD 预估 ≥50，若 ≥90 则改用 ⑤ 的 `It is good.` 版）。**⚠️ 生产红线**：本课 **①②③ 三条带 mark**；**双正解四组实测 33／67／（⑥ 待登记），全部须 < 90**；**本课不写 `It smells nicely.`**（`nicely` GL 0，且「闻着怎么样」不会写成 -ly——**把 -ly 的坑留给 L130 的「尝」**，避免同批同型三连） |
| 变体三态 | 肯定 `It smells good.`（cloze 落 **smells**）／否定 `It does not smell good.`（noteZh：「不」请帮手 `doesn't`，闻的那个词退回原样；**复跑确认落 `does` 第 ① 档**）／疑问 `Does it smell good?`（noteZh：**Does 搬句首，闻的那个词回原样**；**复跑确认落 `Does` 第 ① 档**） |
| 复现题设计（practice ≥4） | 第 1 题 target＋变体逐字题（**取疑问变体 `Does it smell good?`**）；**第 2 题保障句 `It smells nice.`**（cloze 实跑落 **smells**——换个「怎么样」的词，中间那个词不动）；第 3 题复现 L128 上一课句 `It sounds great.`（cloze 落 **sounds**；**同类换词 · 上一课回流**）；第 4 题复现 L96 `:17872` `Look at the window!`——⚠️ **含 `look`，违反 G11，故改为复现 L89 `:16530` `What a nice day!`**（cloze 落 **What**；**感叹回流**，L128 已用过一次 → **本课需登记「同句跨课复现次数」**，第 4 题改用 L98 的厨房句或直接改用**本课 `sceneSwings` 句** `The soup smells nice.`——⚠️ `soup` GL 0 不可用，**定稿第 4 题＝复现 L52 `:9623` `The cake was eaten by my brother.`**（cloze 落 **cake**，**被做过的老句 ＋ 本课「蛋糕」场景钩子**，为 L130 铺路）；第 5 题复现 L53 `:9788` 一带的被动句或本批 L128 的 `That sounds good.`（**定稿：用 L128 的 `That sounds good.`——但 L128 practice 已用，故本课第 5 题＝复现 L90 `:16714` `After I do my homework, I watch TV.`（cloze 落 **After**；`after` 句面与感官无关，**作纯拼装回流**））。**每课 ≥1 复现题 ✓**。**⚠️ 生产红线**：本课 `examples` 取 target／`It sounds great.`／`It is good.`／`The cakes smell good.` 四条 |
| 案件规划 | `hunt-it-smells-good`（#138，§7）；新错 **`word_order`（`It smells well.` → `good`）＋`sv_agreement`（`It smell good.` → `smells`）**；旧错 `sv_agreement`（L19 `:3423`「一个用 was、一群用 were」——⚠️ **口径校正见 §7 注**：`was/were` 实际在 L51 `:9344`／`:9416`，但**批十七至十九连续三批取 L19 标号**，本批沿用 L19 标号并在 explanation 写「一个用 was、一群用 were」）＋`sv_agreement`（L25 `:4528` 三单） |
| 六段要点 | ① 开场引 L59 `:10838`（「两个常客不按 -ly 走：good 的样子词是 well」）＋L128 的骨架；② guided：`choose`（`It ___ good.` 选项 `smells`／`smell`／`smells well`）／`arrange` ≤4 token／**`spot`（`tokens: ["It", "smells", "well."]`，`wrongToken: "well"`——**逐字相等**；`answer: "well"`；`correctionZh`「这里要的是「闻着好」——用 【good】：It smells good。」）**／`replace`「把 good 换成 nice」；③ recall（promptZh 给掀锅盖的场景、intentZh「它闻着好香。」、answer＝target、noteZh「闻的那个词自己站中间——「闻着好」用 good」）；④ practice 5 题；⑤ 破 `hunt-it-smells-good` |
| 术语红线自查 | 用「闻的那个词／自己站中间／那个『怎么样』的词／做得好／换一双鼻子」；**禁「感官动词」「形容词」「副词」「系动词」**——**「副词」是本课头号陷阱**（讲 `well` 时最易写「副词」，已按 §4.3 改写为「做得好」「样子词」） |
| 走查观察点 | **`good`／`well` 的对撞是否被接住**（瑞思 §7 假设 2 的「闻」站读数）——走查盯 `It smells well.` 的选错率；**反向风险**：学生是否因为本课而不敢再用 `well`（走查问「`She sings well.` 对不对」，**正确反应是「对——那是做得好」**） |

**L130 这个蛋糕尝着好（换感官词 · 加一条「不加 -ly」）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-130-it-tastes-good`；`number: 130`；episode「小美的一天 一百三十」；scene `mansion`；cover `cover13` |
| title / grammarLabel | 「这个蛋糕尝着好」/「尝着怎样 · 尝的那个词后面直接跟那个词」 |
| targetSentence | `This cake tastes good.`（4 词，≤8 ✓；**⚠️ cloze 实测：本句空位被 `cake` 抢走**——`This ___ tastes good.` / `cake`（`findIndex` 取最左，`cake` 长度 4 ≥3、非停用词，排在 `tastes` 前）。**数析 §4.1 已实测同型**：`This soup tastes nice.` → 空位 `soup`。**故本课必须改句**） |
| **⚠️ 本课 targetSentence 的定稿（cloze 硬约束）** | **定稿＝把空位交还考点词**——两个方案（数析 §4.1 原文「句子改短成 `It tastes nice.` 即可把空位交还 `tastes`」）：**方案 A（推荐·保场景词）**：`targetSentence: "This cake tastes good."` ＋ **保障句 `It tastes good.`**（cloze 落 **tastes** ✓ 实测）；**方案 B（保考点·弃场景词）**：`targetSentence: "It tastes good."`。→ **本 PRD 取方案 A**：target 保 `This cake tastes good.`（**蛋糕场景是 L130 的叙事锚**，且 `cake` GL 54 处是库内熟词），**主考点由 `guided`／`practice` 的保障句 `It tastes good.` 承载**（G12 硬门要求「每课 ≥1 保障句让主考点不成空位」）。**⚠️ 生产红线：`This cake tastes nice.`／`This soup tastes nice.` 两句全批不得出现**（空位落 `cake`／`soup`；后者 `soup` GL 0） |
| sceneSetupZh | 下午在餐桌：生日蛋糕切开，小美尝了一口——她说这个蛋糕尝着真好。 |
| intentZh | 这个蛋糕尝着真好。 |
| 场景 | 餐桌：尝东西——味道怎么样，一尝就说出来 |
| 新知识点 | **只有一件（两半）**：① **换感官词**——`taste` 上场，架子不改；② **`tastes` 后面不加 -ly**——中文说「尝着甜／尝着好」，英语后面**直接跟那个「怎么样」的词**，「不穿 -ly 外套」（中文侧 `sense-verbs` ❌4：`The medicine tastes so bitter.`（不是 bitterly））。⚠️ **本课不引入「甜／香」的新词**：`sweet`／`delicious` 两文件全 0——**统一用 `good`**（GL 106） |
| 一句话规则（oneLineRule） | 「说「尝着怎么样」：尝的那个词自己站中间，后面直接跟那个「怎么样」的词——This cake tastes good。**后面那个词不穿 -ly 外套**：中文说「尝着好」，英语就说 good。」（**零术语自查 ✓**） |
| 完课小结（summary.rule／points） | **rule**：「说「尝着怎么样」：尝的那个词自己站中间，后面直接跟那个「怎么样」的词（This cake tastes good）——**后面那个词不加 -ly**。」**points**：① `This cake tastes good.`——尝的那个词自己站中间；② `This cake tastes well.` ❌——这里要的是「尝着好」，不是「做得好」；③ `It sounds great.`／`It smells good.`／`This cake tastes good.`——**同一个架子，换三双耳朵／鼻子／舌头**。**三处均零术语** |
| 对比卡 6 条方向 | ① **真错卡（本课头号错 · 中文侧 `sense-verbs` ❌4 正面落地）**：`This cake tastes well.` ❌（**`wrongMark: "well"`**，`word_order`——**与 L129 ① 同型、跨课回流**（`smells well` → `tastes well`）；whyZh「`well` 是**做得好**（第 59 课）——可这句不是说你尝得好不好，是说**尝着那个东西怎么样**，后面直接跟 `good`」）；② **真错卡（-ly 过度套用）**：`This cake tastes sweetly.` ❌（**`wrongMark: "sweetly"`**，`word_order`——**中文侧 `sense-verbs` ❌4 同型**（`tastes so bitter` 不是 bitterly）；whyZh「**加 -ly 是「做事的样子」**（第 58 课的老规矩）——可这句不是说你做事怎么样，是说它**尝着**什么样：后面直接跟那个词」；**⚠️ 说明**：`sweetly` 是**错句侧的词**（正确侧用 `good`），故不构成「新造正确词」——`sweet` GL 0，**不得**出现在正确句里）；③ **真错卡**：`This cake taste good.` ❌（**`wrongMark: "taste"`**，`sv_agreement`——**这个蛋糕是一个，要带小尾巴**；**与 L128 ②／L129 ② 同型的三度回流**）；④ **双正解卡（两个「口感类」并排 · 本课展示面）**：`It smells good.` ✅ 并排 `This cake tastes good.` ✅（**bothRight，`wrongMark: null`**；whyZh「两句都对——**同一个架子、两双鼻子／舌头**：一个闻着好，一个尝着好」；**diffScore 实跑 25 < 90 ✓**）；⑤ **双正解卡（与「就是好」切开 · L129 ⑤ 的续站）**：`This cake tastes good.` ✅ 并排 `This cake is good.` ✅（**bothRight，`wrongMark: null`**；whyZh「**两张脸**：`tastes` 那张是「我尝到的它」，`is` 那张是「它就是好」」；**diffScore 实跑 75 < 90 ✓**——**接近但未越线**）；⑥ **复习卡（L89 原句 · 感叹回流）**：`What a nice day!` ✅ 并排 `This cake tastes good.` ✅（**bothRight，`wrongMark: null`**；whyZh「两句都对——第 89 课抬头看天那句，和今天尝到好东西这句：**一个用眼睛，一个用舌头**」；**diffScore 实跑 0 < 90 ✓**）。**⚠️ 生产红线**：本课 **①②③ 三条带 mark**；**双正解三组实测 25／75／0，全部 < 90 ✓**；**⑤ 的 75 是本批最高分**——**生产期须重跑登记，若 ≥90 则改用 ④ 的 25 分对** |
| 变体三态 | 肯定 `This cake tastes good.`（cloze 落 **cake**——**这是本课未改句的代价，已在 §6 G12 登记**）／否定 `It does not taste good.`（noteZh：「不」请帮手 `doesn't`，尝的那个词退回原样；**复跑确认落 `does` 第 ① 档**）／疑问 `Does it taste good?`（noteZh：**Does 搬句首，尝的那个词退回原样**；**复跑确认落 `Does` 第 ① 档**）。**⚠️ 变体已按「短句化」处理**（`It` 起头 → 空位落 `tastes`／`does`），**否定疑问两态的空位都在考点区**，正好补上肯定态的落点偏移 |
| 复现题设计（practice ≥4） | 第 1 题 target＋变体逐字题（**取疑问变体 `Does it taste good?`**，cloze 落 **Does**）；**第 2 题保障句 `It tastes good.`**（**cloze 实跑落 `tastes` ✓——这是 G12「每课 ≥1 保障句让主考点不成空位」的本课落点**）；第 3 题复现 L129 上一课句 `It smells good.`（cloze 落 **smells**；**上一课回流**）；第 4 题复现 L52 `:9623` `The cake was eaten by my brother.`（cloze 落 **cake**；**`cake` 的既有用法 ＋ 本课场景锚，L129 已用过一次 → 两课相隔 1 课，须登记）；第 5 题复现 L89 `:16530` `What a nice day!`（cloze 落 **What**；**感叹回流**——**⚠️ 本句在 L128／L129 已各用一次，本课是第三次，仍在「同句 ≤6 课」线内但须逐课登记**）。**每课 ≥1 复现题 ✓**。**⚠️ 生产红线**：`examples` 取 target／`It tastes good.`／`This cake is good.`／`It smells good.` 四条；**`practice` 与 `examples` 重合 ≤3 题** |
| 案件规划 | `hunt-it-tastes-good`（#139，§7）；新错 **`word_order`（`This cake tastes well.` → `good`）＋`sv_agreement`（`This cake taste good.` → `tastes`）**；旧错 `tense`（L10 `:1782` 昨天版）＋`plural`（L11 `:1964` 复数） |
| 六段要点 | ① 开场引 L58 `:10651`（「做事的样子 · 动词后面加 -ly」）＋L129 的「闻着」；② guided：`choose`（`This cake ___ good.` 选项 `tastes`／`taste`／`tastes well`）／`arrange` ≤4 token／**`spot`（`tokens: ["This", "cake", "tastes", "well."]`，`wrongToken: "well"`——**逐字相等**；`answer: "well"`；`correctionZh`「这里要的是「尝着好」——用 【good】：This cake tastes good。」）**／`replace`「把 cake 换成 apple」（**⚠️ `apple` GL 计数未核；**定稿改用 `把 good 换成 nice`**）；③ recall（promptZh 给蛋糕切开的场景、intentZh「这个蛋糕尝着真好。」、answer＝target、noteZh「尝的那个词自己站中间——后面那个词不加 -ly」）；④ practice 5 题；⑤ 破 `hunt-it-tastes-good` |
| 术语红线自查 | 用「尝的那个词／自己站中间／那个『怎么样』的词／不穿 -ly 外套／做事的样子」；**禁「感官动词」「形容词」「副词」「系动词」**——**「副词」是本课头号陷阱**（讲 `sweetly` 时最易写「副词」） |
| 走查观察点 | **「闻着/尝着」两站是不是同一课重复**（瑞思 §7 假设 1 的**第二个读数点**：L130 完成率是否显著低于 L128——若显著下滑，说明「换词不换架子」在第 3 课起失效）；**-ly 负迁移在「尝」站的接住率**（误答回流率＝`This cake tastes sweetly.` 的选错率，与批十九 L125 ④／L126 ③ 的读数对照） |

**L131 水摸着凉（换感官词 · `feel` 上场 ＋ 与 L76 切开）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-131-the-water-feels-cold`；`number: 131`；episode「小美的一天 一百三十一」；scene `mansion`；cover `cover14` |
| title / grammarLabel | 「水摸着凉」/「摸着怎样 · 摸的那个词自己站中间（与人自己的感觉切开）」 |
| targetSentence | `The water feels cold.`（4 词，≤8 ✓；**⚠️ cloze 实测：本句空位被 `water` 抢走**——`The ___ feels cold.` / `water`）。→ **本课保障句＝`It feels cold.`**（**cloze 实跑落 `feels` ✓**，实测留档）；**target 保留 `The water feels cold.`**（`water` GL 9 处在库、场景锚强） |
| sceneSetupZh | 傍晚在客厅：窗外下着雨，桌上那杯水放了很久，小美摸了一下杯壁——她说这水摸着凉。 |
| intentZh | 这水摸着凉。 |
| 场景 | 客厅：摸东西——东西摸着怎么样 |
| 新知识点 | **只有一件（两半）**：① **`feel` 上场（摸的这个）**——架子不改，`东西 + feels + 那个「怎么样」的词`；② **与 L76 `I feel much better today.` 切开**——**同一个字两个说法**：说**自己**感觉怎么样用 `I feel`（第 76 课），说**东西**摸着怎么样用 `It feels`／`The water feels`（今天）——**看它前面站的是人还是东西**。⚠️ **本课解冻 `feel`**（批十九「`feel` 全批 0 次」为**批十九一次性限定**，主理人裁决 §1.2 配套 4）；**`cold` 库内 202+ 处最厚**（`cold` GL 206 实测），**不引入 `cool`／`warm`**（`cool` 两文件 0；`warm` 仅 3 处，薄） |
| 一句话规则（oneLineRule） | 「说「东西摸着怎么样」：摸的那个词自己站中间，后面直接跟那个「怎么样」的词——The water feels cold。**同一个 feel 两个说法**：说**自己**感觉怎么样是 I feel（第 76 课），说**东西**摸着怎么样是 It feels（今天）。」（**零术语自查：三字段不得出现任何禁用词** ✓——**本课最易踩的是「感官动词」**（谈 feel 的类别时）与「体验动词」类分析用语） |
| 完课小结（summary.rule／points） | **rule**：「说「东西摸着怎么样」：摸的那个词自己站中间，后面直接跟那个「怎么样」的词（The water feels cold）——说东西用 It feels，说自己用 I feel。」**points**：① `The water feels cold.`——东西摸着怎么样；② `I feel much better today.`（第 76 课）——**自己**感觉怎么样（同一个 feel，前面站的是人）；③ `The water feels coldly.` ❌——后面那个词不加 -ly。**三处均零术语** |
| 对比卡 6 条方向 | ① **真错卡（-ly 过度套用 · 中文侧 `sense-verbs` ❌2 正面落地）**：`The water feels coldly.` ❌（**`wrongMark: "coldly"`**，`word_order`——**中文侧原文**：`Your skin feels so smooth.`（不是 smoothly）；whyZh「**加 -ly 是『做事的样子』**（第 58 课的老规矩）——`feels` 后面跟的是那个『怎么样』的词，直接说 `cold`」；**先例**：L125 对比卡 ④ `It looks nicely.` ❌／L126 对比卡 ③ `You look tiredly.` ❌ **同型三度回流**）；② **真错卡**：`The water feel cold.` ❌（**`wrongMark: "feel"`**，`sv_agreement`——**水是一样东西，要带小尾巴**；**与 L128 ②／L129 ②／L130 ③ 同型的四度回流**——**⚠️ 本批 `sv_agreement` 已连用四课，故本课之后 L132 不再用此型**）；③ **真错卡（与「就是」切开）**：`The water is cold.` ❌→**⚠️ 生产红线：本卡不得设成错卡**（`The water is cold.` 是**完全正确的句子**，只是说的不是「摸着」——**设成错卡会教错**）；**本卡定稿为「双正解卡」**：`The water feels cold.` ✅ 并排 `The water is cold.` ✅（**bothRight，`wrongMark: null`**；whyZh「**两张脸**：`feels` 那张是「我摸到的它」，`is` 那张是「它就是凉」——**两句都对，说的不是一件事**」；**diffScore 实跑 75 < 90 ✓**）。**空出的第 3 条真错卡改由下条承担**；④ **真错卡（本课第三张 mark 卡）**：`The water feels is cold.` ❌（**`wrongMark: "is"`**，`verb_form`——中间不站 is；**与 L128 ①／L129 ③ 同型、跨课回流**）；⑤ **双正解卡（本课脊柱卡 · 与 L76 切开，逐字稿见 §3.3）**：`The water feels cold.` ✅ 并排 `I feel much better today.` ✅（**bothRight，`wrongMark: null`**；whyZh「**同一个 feel，两个说法**：说**东西**摸着什么样用 `It feels`／`The water feels`；说**自己**感觉怎么样用 `I feel`（第 76 课那句）——**看它前面站的是人还是东西**」；**diffScore 实跑 0 < 90 ✓**——**本批最安全的一组**）；⑥ **双正解卡（冒号换词 · 展示面）**：`It feels cold.` ✅ 并排 `The water feels cold.` ✅（**bothRight，`wrongMark: null`**；whyZh「两句都对——**换那个东西**：光说「它」也行，说清「这水」也行；中间那个词和后面那个词都不动」；**diffScore 实跑 50 < 90 ✓**）。**⚠️ 生产红线**：本课 mark 卡＝**①②④ 三条**（③ 已被改定为双正解，**不得找回原错卡设计**）；**双正解三组实测 75／0／50，全部 < 90 ✓**；**⑤ 的 0 分对是本批最安全一组**（瑞思 §4 三条硬要求之一，**必须逐字落地**：`The water feels cold.`（摸着凉）／`I feel much better today.`（我觉得好多了）） |
| 变体三态 | 肯定 `The water feels cold.`（cloze 落 **water**——登记项）／否定 `It does not feel cold.`（noteZh：「不」请帮手 `doesn't`，摸的那个词退回原样；**复跑确认落 `does` 第 ① 档**）／疑问 `Does it feel cold?`（noteZh：**Does 搬句首，摸的那个词退回原样**；**复跑确认落 `Does` 第 ① 档**）。**⚠️ 变体短句化**（`It` 起头），**两态空位都落考点区** |
| 复现题设计（practice ≥4） | 第 1 题 target＋变体逐字题（**取疑问变体 `Does it feel cold?`**，cloze 落 **Does**）；**第 2 题保障句 `It feels cold.`**（**cloze 实跑落 `feels` ✓——本课 G12 主落点**）；第 3 题复现 L87 `:16166` `It's cold today.`（cloze 落 **It's**；**跨课回流 · 冷的老句**）；第 4 题复现 L130 上一课句 `This cake tastes good.`（cloze 落 **cake**；**上一课回流**）；第 5 题复现 L76 `:14061` `I feel much better today.`——**⚠️ 严禁**：瑞思 §4 硬要求「**`I feel much better today.` 只作切开卡，不作练题**」（它与本课 target 是**切开关系**，做成练题会让学生以为两句是同一句的变体）。**定稿：第 5 题＝复现 L130 的保障句 `It tastes good.`**（cloze 落 **tastes**；**上一课主考点回流**）。**每课 ≥1 复现题 ✓**。**⚠️ 生产红线**：`examples` 取 target／`I feel much better today.`（**切开卡句，标注「第 76 课」**）／`It feels cold.`／`It tastes good.` 四条；**`I feel much better today.` 不得进 `practice`／`guided`／`contrast.whyZh` 的判错面板** |
| 案件规划 | `hunt-water-feels-cold`（#140，§7）；新错 **`word_order`（`The water feels coldly.` → `cold`）＋`sv_agreement`（`The water feel cold.` → `feels`）**；旧错 `sv_agreement`（L19「一个用 was、一群用 were」）＋`sv_agreement`（L25 `:4528` 三单） |
| 六段要点 | ① 开场引 L76 `:14061`（「I feel much better today.——第 76 课那句」）＋**切开句**「同一个 feel，今天说的是东西摸着怎么样」；② guided：`choose`（`The water ___ cold.` 选项 `feels`／`feel`／`feels coldly`）／`arrange` ≤4 token／**`spot`（`tokens: ["The", "water", "feels", "coldly."]`，`wrongToken: "coldly"`——**逐字相等（含尾标点：`tokens` 末项为 `"coldly."`，`wrongToken` 必须写 `"coldly."` 或写 `"coldly"` 并把 tokens 末项改为 `"coldly."`**；**本 PRD 定稿：`tokens` 末项 `"coldly."`、`wrongToken: "coldly."`——逐字相等**）**／`replace`「把 cold 换成 hot」（**`hot` GL 25 处在库 ✓**）；③ recall（promptZh 给下雨天摸杯子的场景、intentZh「这水摸着凉。」、answer＝target、noteZh「摸的那个词自己站中间——东西用 It feels，人用 I feel」）；④ practice 5 题；⑤ 破 `hunt-water-feels-cold` |
| 术语红线自查 | 用「摸的那个词／自己站中间／那个『怎么样』的词／前面站的是人还是东西」；**禁「感官动词」「形容词」「副词」「系动词」**——**「感官动词」是本课头号陷阱**（谈 `feel` 时最易写），**三字段已逐字自查** |
| 走查观察点 | **`feel` 两个用法的一次分清率**（瑞思 §7 假设 3：切开卡 ⑤ 的判对率）——走查问「`I feel much better.` 和 `The water feels cold.` 哪句是说你自己的感觉」；**-ly 负迁移在「摸」站的接住率**（误答回流率＝`The water feels coldly.` 的选错率） |

**L132 它听着好吗（不」和「问」· 四感官共用的一套）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-132-does-it-sound-good`；`number: 132`；episode「小美的一天 一百三十二」；scene `campus`；cover `cover15` |
| title / grammarLabel | 「它听着好吗」/「说「不」和「问」 · 四感官共用的一套」 |
| targetSentence | `Does it sound good?`（4 词，≤8 ✓；**cloze 实跑落 `Does`**——第 ① 档直命中词表，本 PRD 逐字复刻实跑：`___ it sound good?` / `Does`） |
| sceneSetupZh | 课间在校园里：同学说新出了一首歌，小美问「它听着好吗」——她还说那句「它不好听」。 |
| intentZh | 它听着好吗？ |
| 场景 | 校园：把「不」和「问」加到四种感官句上 |
| 新知识点 | **只有一件（两半）**：说「不」请帮手 `doesn't`（**感官词退回原样**）；问就把 `Does` 搬到句首（**搬走之后，感官词照样退回原样**）。**「一场戏只让一个词扛变化」**（L25 `:4562` 既有话术）。**与 L125 否定／疑问、L123 `:23023` 「not 跟 be 走／Are 搬句首」同构**；**四感官共用一套**（`sounds`／`smells`／`tastes`／`feels` 在否疑里全部退回原样） |
| 一句话规则（oneLineRule） | 「说「不」请帮手 doesn't，说「它不好听」：It doesn't sound good——**听的那个词退回原样**。想问就把 Does 搬到句首：Does it sound good?——**搬走之后，它照样退回原样**。四个感官词都是一套。」（**零术语自查 ✓**——**本课最易踩的是「疑问句／否定句」两个红线词**，一律写成「问」「说」不） |
| 完课小结（summary.rule／points） | **rule**：「说「不」请帮手 doesn't（It doesn't sound good）；问把 Does 搬到句首（Does it sound good?）——**两样都动前面，后面那个词不动**。」**points**：① `It does not sound good.`——帮手 doesn't 上阵，听的那个词回原样；② `Does it sound good?`——Does 搬句首，它照样回原样；③ 第 123 课那句 `Are you used to it?` 也是「搬句首」——**同一套搬家法子**。**三处均零术语** |
| 对比卡 6 条方向 | ① **真错卡（本课头号错）**：`It not sounds good.` ❌（**`wrongMark: "not"`**，`verb_form`——**说「不」要请帮手，不是把 not 光放在那儿**；whyZh「说「不」得请帮手 `doesn't` 来——`not` 自己站不住，而且帮手一出场，听的那个词就退回原样」）；② **真错卡**：`Does it sounds good?` ❌（**`wrongMark: "sounds"`**，`verb_form`——**Does 搬句首之后，它要退回原样**；whyZh「Does 搬到前面了——**一场戏只让一个词扛变化**，后面的听的那个词要退回原样：Does it 【sound】 good?」）；③ **真错卡**：`It doesn't sounds good.` ❌（**`wrongMark: "sounds"`**，`verb_form`——**帮手 already 扛了变化**；**与 ② 同源、方向互补**（一个是问、一个是不））；④ **双正解卡（「不」与「问」并排 · 本课展示面）**：`It does not sound good.` ✅ 并排 `Does it sound good?` ✅（**bothRight，`wrongMark: null`**；whyZh「两句都对——**一个说「不」，一个在问**：两样都动前面，后面那个词都不动」；**diffScore 实跑 60 < 90 ✓**）；⑤ **双正解卡（与 L125 的否疑并排 · 跨课回流）**：`Does it sound good?` ✅ 并排 `Does it look nice?` ✅（**bothRight，`wrongMark: null`**；whyZh「两句都对——**同一个搬家法子**：第 125 课问的是「看着好」，今天问的是「听着好」，**搬的都是同一个 Does**」；**diffScore 实跑 50 < 90 ✓**）；⑥ **复习卡（L123 原句 · 同一个搬家法子）**：`Are you used to it?` ✅ 并排 `Does it sound good?` ✅（**bothRight，`wrongMark: null`**；whyZh「两句都对——第 123 课把 `Are` 搬到句首，今天把 `Does` 搬到句首：**都是把句首那个位置让给开头的词**」；**diffScore 实跑 0 < 90 ✓**）。**⚠️ 生产红线**：本课 **①②③ 三条带 mark**；**双正解三组实测 60／50／0，全部 < 90 ✓**；**⚠️ 本课 `contrast` 不得再引入 `look`**（⑤ 里的 `Does it look nice?` 是**允许的唯一一处 `look`**——它在 `contrast.wrong` 位置作**双正解的另一半**，**不进 `targetSentence`／`practice`／`guided`**，**G11 的 `look` 四字段机检范围含 `contrast` 吗？→ 不含**（G11 逐字申报范围＝`targetSentence`／`examples`／`practice`／`guided` 四字段），故 ⑤ 合规；**生产期须再核一次 `look` 的五字段总命中数并登记**） |
| 变体三态 | 肯定 `It sounds good.`（cloze 落 **sounds**）／否定 `It does not sound good.`（noteZh：帮手 doesn't 上阵，它退回原样；**复跑确认落 `does` 第 ① 档**）／疑问 `Does it sound good?`（noteZh：Does 搬句首；**复跑确认落 `Does` 第 ① 档**）。**⚠️ 本课「肯定」态用 `It sounds good.` 而不是 target**——**target 就是疑问态**，故 `variants` 的「肯定」卡必须写成 `It sounds good.`（短句化，cloze 落 **sounds**），**生产期须核「练习第 1 题＝与 variants 非肯定卡逐字一致的变体题」这条硬断言**：本课 `variants` 的非肯定卡＝`It does not sound good.`／`Does it sound good?`，**练习第 1 题取 `Does it sound good?`** ✓ |
| 复现题设计（practice ≥4） | 第 1 题 target＋变体逐字题（**取疑问变体 `Does it sound good?`**——**与 target 同句，属合法设计**：`grammarLessons.test.ts:11-29` 要求「含一道与 variants 非肯定卡逐字一致的题」，**未禁止该句同时是 target**；**先例**：L127 收口课同一句既作 target 又作练习第 1 题）；**第 2 题保障句 `Does it smell good?`**（cloze 实跑落 **Does**——**换感官词，搬家法子不动**）；第 3 题复现 L128 的 `It sounds great.`（cloze 落 **sounds**；**本批第一课回流**）；第 4 题复现 L129 的 `It smells good.`（cloze 落 **smells**）；第 5 题复现 L19 `:3438` `You look tired.`（**⚠️ 含 `look`——违反 G11，故改为复现 L123 `:23084` `Are you used to it?`**，cloze 落 **Are**；**同一个搬家法子**）。**每课 ≥1 复现题 ✓**。**⚠️ 生产红线**：`examples` 取 target／`It does not sound good.`／`It sounds great.`／`Does it look nice?`（**⚠️ 第四条例外允许 `look`——理由同上；若生产期决定严守「全批 `look` 只在 L133」，则第四条例外改为 `Does it smell good?`**）四条 |
| 案件规划 | `hunt-does-it-sound-good`（#141，§7）；新错 **`verb_form`（`It not sounds good.` → `It does not sound good.`）＋`verb_form`（`Does it sounds good?` → `Does it sound good?`）**；旧错 `tense`（L10 `:1782` 昨天版）＋`plural`（L11 `:1964` 复数） |
| 六段要点 | ① 开场引 L25 `:4562`（「Does 一出场，动词要打回原样 like——一场戏只让一个词扛变化，别让小尾巴长两次」）＋L123 的搬家法子；② guided：`choose`（`___ it sound good?` 选项 `Does`／`Do`／`Is`）／`arrange` ≤4 token／**`spot`（`tokens: ["Does", "it", "sounds", "good?"]`，`wrongToken: "sounds"`——**逐字相等（含尾标点：末项 `"good?"`，`wrongToken` 是 `"sounds"`，为 tokens 第 3 元素的逐字值**）**）／`replace`「把 sound 换成 smell」；③ recall（promptZh 给课间同学说新歌的场景、intentZh「它听着好吗？」、answer＝target、noteZh「Does 搬句首——听的那个词退回原样」）；④ practice 5 题；⑤ 破 `hunt-does-it-sound-good` |
| 术语红线自查 | 用「帮手 doesn't／搬句首／退回原样／一场戏只让一个词扛变化」；**禁「疑问句」「否定句」「助动词」「情态动词」「语序」**——**「疑问句」「否定句」两词在本课头号危险**（讲否疑时最易写），**已逐字自查** |
| 走查观察点 | **「搬了之后要不要退回原样」是否一次记住**（走查盯 `Does it sounds good?` 的选错率）；**四感官共用一套是否被理解**（走查问「`Does it smell good?` 里那个词要不要带 s」，**正确反应是「不带」**） |

**L133 五种感官排一行（收口 · 零新知 ＋ `look forward to` 认读种子位）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-133-five-senses`；`number: 133`；episode「小美的一天 一百三十三」；scene `sparkle`；cover `cover16` |
| title / grammarLabel | 「五种感官排一行（收口）」/「收口 · 零新知（五句排一行）」 |
| targetSentence | 复现混排（**五句排一行，逐句 ≤8 词**）：`It looks nice.`（**逐字取 L125 `:23407`**）／`It sounds great.`（本批 L128）／`It smells good.`（本批 L129）／`This cake tastes good.`（本批 L130）／`The water feels cold.`（本批 L131）。**cloze 逐句实跑登记（本 PRD 复刻实跑）**：`It looks nice.` 落 **looks**（① 档）／`It sounds great.` 落 **sounds**（② 档）／`It smells good.` 落 **smells**（② 档）／`This cake tastes good.` 落 **cake**（② 档，**登记项**）／`The water feels cold.` 落 **water**（② 档，**登记项**）——**两句落非考点词，已在 §6 G12 登记；本课保障句用 `It tastes good.`（落 tastes）／`It feels cold.`（落 feels）** |
| sceneSetupZh | 书桌前：小美把这几天学过的五句话抄在本子上，排成一行——她说这五句是一样的架子，只是换了一双眼睛／耳朵／鼻子／舌头／手。 |
| intentZh | 五种感官，一个架子，我一次说清楚。 |
| 新知识点 | **无——章末零新知**（收口先例 L54 `:9823`／L78 `:14362`／L94 `:17400`／L102 `:18919`／L110 `:20418`／L118 `:22040`／L124 `:23217`，**七代先例**；**接口零字段新增**）；**复现取材＝五句全部逐字取既有**（L125 一句＋本批 L128–L131 四句，**一字不改**）；**不引番外 5 案**（`huntService.test.ts:215` 冻结名单） |
| 一句话规则（oneLineRule） | 「**五种感官，一个架子**：谁上场，谁就自己站中间，后面直接跟那个「怎么样」的词——It looks nice／It sounds great／It smells good／It tastes good／It feels cold。**看前面站的是哪双眼睛、耳朵、鼻子、舌头、手，就知道说的是哪一样。**」（**零术语自查：三字段不得出现任何禁用词** ✓——**本课最易踩的是「感官动词」四字与「形容词」**） |
| 完课小结（summary.rule／points） | **rule**：「五种感官，一个架子：谁上场，谁就自己站中间，后面直接跟那个「怎么样」的词（It sounds great／It smells good／This cake tastes good／The water feels cold）。」**points**：① `It looks nice.`——用眼睛（第 125 课）；② `It sounds great.`／`It smells good.`／`This cake tastes good.`／`The water feels cold.`——**换一双耳朵／鼻子／舌头／手，架子一模一样**；③ 说「不」请帮手 doesn't、问把 Does 搬句首——**四个词共用一套**（第 132 课）。**三处均零术语** |
| 对比卡 6 条方向 | ① **真错卡（跨课回流 · 收口课的旧知回流出错卡）**：`It sounds is great.` ❌（**`wrongMark: "is"`**，`verb_form`——中间不站 is；**与 L128 ① 同型、收口课回显**）；② **真错卡**：`It smells well.` ❌（**`wrongMark: "well"`**，`word_order`——**「闻着好」用 good**；**与 L129 ① 同型、收口课回显**）；③ **真错卡**：`The water feels coldly.` ❌（**`wrongMark: "coldly"`**，`word_order`——后面那个词不加 -ly；**与 L131 ① 同型、收口课回显**）；④ **双正解卡（五句排一行 · 本课脊柱卡）**：`It sounds great.` ✅ 并排 `It smells good.` ✅（**bothRight，`wrongMark: null`**；whyZh「**两句都对、架子一模一样**：一个用耳朵，一个用鼻子——**换的只是中间那个词**」；**diffScore 实跑 33 < 90 ✓**）；⑤ **双正解卡（眼睛与耳朵并排 · 跨批接口）**：`It looks nice.` ✅ 并排 `It sounds great.` ✅（**bothRight，`wrongMark: null`**；whyZh「两句都对——第 125 课用眼睛那张，和今天用耳朵这张：**同一个架子**」；**diffScore 实跑 33 < 90 ✓**）；⑥ **认读卡（`look forward to` 种子位 · 不给练）**：`I am looking forward to the weekend.` ✅（**`wrongMark: null` 且必写 `bothRight: true`**——**逐字照搬批十九 `It looks like rain.` 的处理口径**；whyZh「**认读一句，混个脸熟**：这句话说的是「我盼着周末」——**今天只认脸，不学新花样**（以后再说它）」）。**⚠️ 生产红线（三条，逐条写死）**：**a）种子位只许出现在 `examples` 第 4 条 ＋ `contrast` 第 6 条这两个位置**；**b）不得进 `practice`／`guided`／`recall`，不得作错项**；**c）`contrast` ⑥ 必须带 `bothRight: true`**（否则会被派生为改错题，**性质就变了**）。**五句同屏最多五条**（本课 `contrast` ⑥ 条里涉及五感官的共 5 条，④⑤⑥，**已满，不得再加**）；**⚠️ 本课 `contrast` 里的 `to` 命中 = 1 处（⑥）；G11 的「六课 `targetSentence` 不含 `to`」不受影响（⑥ 不在 targetSentence）**——**生产期须登记「全批 `to` 命中数」并把 ⑥ 单列** |
| 变体三态 | 肯定 `It sounds great.`（cloze 落 **sounds**；noteZh「用耳朵那张」）／否定 `It does not sound great.`（noteZh：帮手 doesn't 上阵；**复跑确认落 `does` 第 ① 档**）／疑问 `Does it sound great?`（noteZh：Does 搬句首；**复跑确认落 `Does` 第 ① 档**）。**⚠️ 收口课纪律**：变体**只做 `It sounds great.` 一句的三态**（**不得**给五句各做一套——**五套＝把一课变五课，破零新知红线**） |
| 复现题设计（practice ≥4） | 第 1 题 target＋变体逐字题（**取疑问变体 `Does it sound great?`**，cloze 落 **Does**）；**第 2 题保障句 `It tastes good.`**（**cloze 实跑落 `tastes` ✓**——把「尝」的主考点在收口课再站一次）；第 3 题复现 L125 `:23407` `It looks nice.`（**第 1 张脸**，cloze 落 **looks**）；第 4 题复现 L131 的 `The water feels cold.`（**第 5 张脸**，cloze 落 **water**——登记项）；第 5 题复现 L129 的 `It smells good.`（**第 3 张脸**，cloze 落 **smells**）；第 6 题复现 L130 的 `This cake tastes good.`（**第 4 张脸**，cloze 落 **cake**——登记项）。**6 题齐全、逐题 ≤8 词**（沿用 L124 收口课 6 题形态）。**⚠️ 生产红线**：`I am looking forward to the weekend.` **只能出现在 `examples` 第 4 条与 `contrast` ⑥**（**不得进 `practice`**——认读项不得成为考点，竞析 §5.3 禁区同源纪律） |
| 案件规划 | `hunt-five-senses`（#142，§7）；**全回流、不新增错型**——三点锚 #137／#138／#139（**中段先例**：#136 收口案取 #134／#135 的对称回流），旧错 `tense`（L10 `:1782`）＋`plural`（L11 `:1964`）（**沿用 #136 收口案式**） |
| 六段要点 | ① 开场**跨课倒带**：第 128 课加了耳朵、129 加了鼻子、130 加了舌头、131 加了手——**今天回头看：五句排一行**（不用讲新规则）；② guided：`choose`（`The water ___ cold.` 选项 `feels`／`feel`／`feels coldly`）／`arrange` ≤5 token／**`spot`（`tokens: ["It", "smells", "well."]`，`wrongToken: "well"`——**逐字相等**；`answer: "well"`；`correctionZh`「「闻着好」用 【good】：It smells good。」）**／`replace`「把 `It smells good.` 中间那个词换成耳朵的，怎么变？」（**答案 `It sounds good.`**——**把五感官做成一次动作**）；③ recall 三字段（promptZh 给书桌前抄句子的场景、intentZh「五种感官，一个架子。」、answer＝`It sounds great.`、noteZh「谁上场谁站中间——后面直接跟那个『怎么样』的词」）；④ practice 6 题；⑤ 破 `hunt-five-senses`；⑥ 总表卡（**m22 达成句同源**） |
| 术语红线自查 | 用「五双眼睛耳朵鼻子舌头手／一个架子／谁上场谁站中间／换一双耳朵」；**禁「形容词」「副词」「系动词」「感官动词」「连缀动词」**——**本课三字段是全批最危险的一处**（收口课谈「五种感官」时天然会写「感官动词」），**三字段已逐字自查：只出现「五种感官，一个架子」** |
| 本课定位说明（写进生产单） | **收口课但不是新知识课**：L133 的教学价值＝**兑现「一个架子换五双感官」的排一行动作**（把学生在 L125 与新四课练过的句子**请回来并排**），不是新增结构。**故 `grammarLabel` 不得写成新句型标签**（写作「收口 · 零新知（五句排一行）」，**不写「感官动词大章收口」**——后者含本批额外禁用词） |
| 中段自走查点 | **五句会不会串台**（走查问「`It smells good.` 和 `This cake tastes good.` 哪句是用鼻子」）；**`look forward to` 认读种子位是否被误当考点**（走查问「`I am looking forward to the weekend.` 要不要练」，**正确反应是「今天不练」**）；**反向风险**：学生是否因收口课而把「谁上场」记成「五个都能换」（走查问「`It looks good.` 对不对」，**正确反应是「对——眼睛也能说好」**） |

## §3 造词课专章（本批脊柱）

> **来源**：数析 §1 造词成本专章（本批核心）＋瑞思 §1⑤⑥⑦（四词逐词实读）＋竞析 §6（感官动词可行性专节）。**本 PRD 的逐词计数已用 `grep -o -i -w` 独立复验**（不经三研究的提取器）。

### 3.1 三个新动词怎么上（每个词单独占一课，不藏在长句里）

**逐词成本实读（本 PRD 独立复验，两文件）**：

| 词 | GL | HC | 判定 | 本批处置 |
|---|---|---|---|---|
| `sound` | **0** | **0** | 🔴 须新造 | L128 单独占课，第 1 课立岗 |
| `sounds` | **0** | **0** | 🔴 须新造 | 同上（三单形同课出现，**S 与不带 S 一课内对照**，沿用 L126 换人换形的成熟做法） |
| `smell` | **0** | **0** | 🔴 须新造 | L129 单独占课 |
| `smells` | **0** | **0** | 🔴 须新造 | 同上 |
| `taste` | **0** | **0** | 🔴 须新造 | L130 单独占课 |
| `tastes` | **0** | **0** | 🔴 须新造 | 同上 |
| `feel` | **27** | **4** | ⚠️ **半垫子** | L131 单独占课（**唯一有垫子的词**） |
| `feels`／`felt` | **0** | **0** | 🔴 须新造 | `feels` 在 L131 出现（新形） |
| `sounded`／`smelled`／`smelt`／`tasted`／`feeling` | 0／0／0／0／1（L76 `:14075`） | — | 不需要 | **本批 `-ed` 形态全部不用**（`felt`／`sounded`／`smelled`／`tasted` 一律 0 次） |

**三条「造词课怎么上」的硬纪律（逐条）**：

1. **每个新动词单独占一课，不藏在长句里**——L128 ＝ `sound`／`sounds`，L129 ＝ `smell`／`smells`，L130 ＝ `taste`／`tastes`，L131 ＝ `feel`／`feels`。**`blocks` 必须把句子拆成可见部件**（沿用 L119／L125 的块状拆法）：例 L128 `blocks: [{ text: "It sounds", role: "它听着（听的那个词自己站中间）" }, { text: "great", role: "真好（那个「怎么样」的词直接跟上）" }]`。
2. **新旧比例硬纪律**：**每课 `targetSentence` 里新词 ≤1**（本批四课各 1 个）；**对比卡 6 条中 ≥3 条的正确答案必须是库内词句**（沿用批十七–十九纪律）——本批逐课满足：L128 ③⑤⑥／L129 ④⑤⑥／L130 ④⑤⑥／L131 ③⑤（＋④）全部是库内老词句（`great`／`good`／`cold`／`well`／`nice`／`happy` 均在库）。
3. **造词课档位诚实标注**（**本批对外口径的核心**）：**B 档不得写成 A 档**；对外一律写「**造词课：须新造 `sound`／`smell`／`taste` 三个动词（两文件全 0），`feel` 是唯一半垫子（L76 一句）；上游无「五词一族」的整齐名单**（BC `stative-verbs` 表含 `feel`／`look`／`smell`／`taste`、**不含 `sound`**；Cambridge `Linking verbs` 名单含 `sound`——**两源自相矛盾**，竞析 §6.1 逐源记录），**只有中文侧 `sense-verbs` 一个「……起來」的共同标记可作需求驱动背书**」。

**「三个动词不是三个生词」的三条论证（写进生产单，避免被误读为超纲）**：
1. **它们是英语最高频的基础日常词**——学习者几乎必然在别处见过中文对应表达（「听起来／闻着／尝着」），**「学了就能用」的转化率显著高于抽象词**（瑞思 §3 造词课成本诚实评估原文）。
2. **四课的形容词侧零造词**——只用 `good`（106）／`great`（7）／`cold`（206）／`nice`（168）**四个库内厚词**（§3.2）。
3. **骨架零成本复用批十九**——`东西 + 那个词 + 怎么样`，学生已在 L125 学过一遍（**L128 的对比卡 ④ 就是那句的并排**）。

### 3.2 形容词选词纪律（用库内厚的：`good` 106／`nice` 168／`great` 7／`cold` 206）

**实读计数（本 PRD 独立复验）**：

| 形容词 | GL 实测 | 判定 | 用在哪 |
|---|---|---|---|
| `good` | **106**（含 L67 `:12349` 擅长课 54 处） | ✅ 最厚 | **L129／L130 的主形容词**（「闻着好」「尝着好」——**都不说 well**） |
| `nice` | **168** | ✅ 最厚 | L128 对比卡 ④（`It looks nice.`）／L129 保障句（`It smells nice.`）／L133 第 1 题（`It looks nice.`） |
| `great` | **7**（L7／L24／L72／L75／L92） | ✅ 在库（薄） | **L128 target**（`It sounds great.`）＋L133 |
| `cold` | **206**（L87 天气课 42 处为主，最厚） | ✅ 最厚 | **L131 target**（`The water feels cold.`）＋L131 复现（`It's cold today.`） |
| `hot` | 25 | ✅ 在库 | L131 guided `replace`（`把 cold 换成 hot`） |
| `heavy` | 62 | ✅ 在库 | **本批不用**（L125 已用） |
| `dark` | 48 | ✅ 在库 | **本批不用**（L125–L127 已用） |
| `tired` | 148 | ✅ 在库 | **本批不用**（L126 已用；**避免与批十九话语重叠**） |
| **`sweet`** | **0** | 🔴 须新造 | ❌ **不用**（「尝着甜」这个中文最自然的说法，**英文侧对应的词库里是 0**——瑞思 §1⑦ 原文） |
| **`soft`／`smooth`／`delicious`／`fresh`／`strange`／`bitter`** | **全 0** | 🔴 须新造 | ❌ **全批 0 次**（「闻着香」「尝着甜」「摸着软」**一律绕开**，统一用 `good`／`great`／`cold`） |
| `cool`／`warm` | 0／3 | ⚠️ 0／薄 | ❌ 不用（`warm` 仅 L19 三处；`cool` 双 0） |

**选词纪律三条（写死）**：
1. **统一用 `good`／`great`／`cold`／`nice` 四个厚词**——**不得写「尝着甜」**（`sweet` 0）、**不得写「摸着软」**（`soft` 0）、**不得写「闻着香」的新词**（`fresh`／`delicious` 0）。
2. **`well` 只作反面**（L129 ①／L130 ① 的 `wrongMark`），**全批的正确答案里 `well` 出现 0 次**（L128 ⑤ 的 `She sings very well.` 是**双正解卡的一半**，**不是本批的正确答案**——它在卡里的身份是「第 59 课那句」的复习卡，**两句都对**）。⚠️ **生产期须核**：`She sings very well.` 只在 L128 `contrast` ⑤ 与 `examples` 出现，**不进任何 `practice` 的 answer**。
3. **`-ly` 错词只作反面**：`greatly`（GL 0）／`coldly`（GL 0）／`sweetly`（GL 0）／`nicely`（GL 0）——**四个 -ly 词在库内全部为 0**（本 PRD 独立复验），**它们只出现在 `contrast.wrong` 侧**（**错句侧的新造词不算造词成本**，因为正确侧一律用库内词）。

### 3.3 与 L76 `feel` 的切开（bothRight 卡逐字稿）

**风险形态（竞析 §6.4 口径校正后）**：`feel` 在库内 27 处（GL）＋4 处（HC），**性质是「同一句 `I feel much better today.` 及其跨课回显」**——L76 占 22 处、L78 占 5 处（竞析 §7 口径校正第 4 条：批十九记「全在 L76 同一句」不完整，**应写「L76 ＋ L78 回显」**）。**L76 的 `grammarLabel` 是「加力 · much + 更…」**（`:14095` 一带），**`feel` 只是被选中的谓语**——**它能为感官课提供的垫子只有 1 句**，且**是「身体感觉」不是「触觉」**（瑞思 §1⑥：全库 8 个不同字符串里**没有一处「触觉」义**，无 `feels`／`felt`／`It feels…`）。

**切开卡定稿（L131 对比卡 ⑤，逐字稿，生产可直接抄）**：

| 项 | 内容 |
|---|---|
| `wrong`（A 句） | `I feel much better today.` ✅（**逐字取 L76 `:14061`**，**一字不改**） |
| `correct`（B 句） | `The water feels cold.` ✅（本课 target） |
| `bothRight` | **`true`** |
| `wrongMark` | **`null`** |
| `whyZh`（逐字稿） | 「**同一个 feel，两个说法**：说**东西**摸着什么样用 `It feels`／`The water feels`；说**自己**感觉怎么样用 `I feel`（第 76 课那句）——**看它前面站的是人还是东西**。」 |
| `diffScore` | **实跑 0 < 90 ✓**（**本批最安全的一组**；本 PRD 以逐字复刻 `diffService.compareText` 实算） |

**三条配套硬纪律**：
1. **`I feel much better today.` 只作切开卡，不作练题**（瑞思 §4 硬要求）——**不得进 `practice`／`guided`，不作错项**；本 PRD 已把它从 L131 的 practice 第 5 题**撤下**（§2.2 L131 复现题设计）。
2. **不改 L76 一个字**（G14 零回归红线）——**切开＝在 L131 里引用它，不是编辑原课**。
3. **deepDive 必写第三段**（切开句的落地位）：「同一个 feel，两个说法：说人自己感觉怎么样（`I feel much better`，第 76 课）；说东西摸着什么样（`The water feels cold`，今天）——**看它前面站的是人还是东西**。」**缺此段则 L131 会退化为「顺手教 feel 的第二义」，与 §8 Non-goals 冲突**。

## §4 中文负迁移处理专章（逐课）

> **来源**：竞析 §1.4（中文侧 `sense-verbs`／`linking-verbs` **原文级**，批十九已取）＋瑞思 §5（中文负迁移专项逐课表）＋数析 §1.7。**本批三条 -ly 误用 ❌ 全部有中文侧原文对应**（竞析 §1.4 EC-5 四条 ❌ 中的三条）。

### 4.1 中文侧 `sense-verbs` 四条 ❌ 原文与本批落点（逐条）

| # | 出处原文（逐字） | 批十九已落 | **本批落点** |
|---|---|---|---|
| ❌1 | `The idea sounds great!`（不是 greatly） | 未落 | **L128 对比卡 ③ `It sounds greatly.` ❌**（`wrongMark: "greatly"`，`word_order`） |
| ❌2 | `Your skin feels so smooth.`（不是 smoothly） | L125 ④ `It looks nicely.` ❌（同型） | **L131 对比卡 ① `The water feels coldly.` ❌**（`wrongMark: "coldly"`） |
| ❌3 | `The dinner smells so good.`（不是 well） | L126 ③ `You look tiredly.` ❌（同型） | **L129 对比卡 ① `It smells well.` ❌**（`wrongMark: "well"`） |
| ❌4 | `The medicine tastes so bitter.`（不是 bitterly） | 未落 | **L130 对比卡 ② `This cake tastes sweetly.` ❌**（`wrongMark: "sweetly"`） |

> **一句话结论**：**批十九只落 2 型（照「看着」与「好坏」两站），本批把「闻」「尝」两型正面接住**（瑞思 §1⑧ 原文：「本批正好把「闻」与「尝」两型正面接住」）。

### 4.2 `-ly` 误用的三条 ❌（硬要求，逐条给原词与修正）

| # | 课 | 中文说法 | 会犯的英文（❌） | 罪名 | 话术（零术语，逐字稿） |
|---|---|---|---|---|---|
| 1 | **L129** | 「闻着香／闻着好」 | ❌ `It smells well.` | `word_order` | 「`well` 是**做得好**（第 59 课的老规矩：good→well）——可这句不是说你闻得好不好，是说**闻着那个东西怎么样**，后面直接跟 `good`。」 |
| 2 | **L130** | 「尝着甜／尝着好」 | ❌ `This cake tastes well.` / ❌ `This cake tastes sweetly.` | `word_order` ×2 | 「中文说『尝着甜』，英语后面直接跟那个词——**不穿 -ly 外套**。」（`well` 那条再加一句第 59 课的老规矩） |
| 3 | **L131** | 「水摸着凉」 | ❌ `The water feels coldly.` | `word_order` | 「**加 -ly 是「做事的样子」**（第 58 课）——`feels` 后面跟的是那个『怎么样』的词，直接说 `cold`。」 |
| （预埋） | **L128** | 「听起来不错」 | ❌ `It sounds greatly.` | `word_order` | 「中文『听起来』后面直接跟那个词；加 -ly 是**做事的样子**（第 58 课的老规矩）——可这句不是说你做事怎么样，是说你**听着**什么样。」 |
| （旧知回显） | **L133** | — | ❌ `It smells well.` / ❌ `The water feels coldly.` | `word_order` | 收口课回显（不新增错型）。 |

**两条防「教坏」的红线**：
1. **不要让学生以为 `well` 不能用**——L129 ⑤／L128 ⑤ 两张卡正面保留 `She sings very well.`（**第 59 课那句照旧对**）；**全批不得出现任何「well 是错的」的表述**。
2. **不要把 `-ly` 一棍子打死**——L130 ① 的 whyZh 必须同时给第 58 课的正面规矩（「做事的样子」），**只在「说东西怎么样」这个位置上说它不合适**。

### 4.3 零术语红线与替换表（本批最容易越线的三个词）

**红线词表实读**：`grammarZeroTerms.ts:17-24` ＝ **29 词**（主语／谓语／宾语／表语／定语／状语／单数／复数／三单／原形／时态／一般过去时／一般现在时／现在进行时／过去进行时／现在完成时／情态动词／比较级／最高级／从句／语序／可数／疑问句／否定句／被动语态／第三人称／**形容词**／**副词**／**介词**）；守门断言在 `grammarLessons.test.ts:105`（`grammarLabel`）／`:114`（`oneLineRule`）／`:123`（`summary.rule`）／`:200-218`（**AI 引用源三字段**：`contrast.whyZh`／`guided.explain`／`recall.noteZh`）。

**本批三个高危词（逐条给替换）**：

| 高危词 | 为什么高危（本批最易在哪一课写出来） | 本批替换说法 | 出处 |
|---|---|---|---|
| **「形容词」** | `sound + 那个「怎么样」的词` 的**语言学描述就是「系动词 + 形容词」**；**L128–L131 四课都在讲这个位置**，随手就会写 | 「**那个「怎么样」的词**」「后面直接跟那个词」 | **本批新增**（批十九已立，本批续用） |
| **「系动词」** | 谈「`sound` 为什么不跟 `is`」「`feels` 为什么后面跟 `cold`」时天然要引这个分析词（**不在 29 词表内，但批十九已把它列为头号红线，本批同样禁**） | 「**自己站中间**」「**中间不站 is**」「谁上场谁管这一段」 | **本批新增**（L128 立岗判据） |
| **「感官动词」（本批独有）** | **收口课 L133 谈「五种感官」时几乎必然写出来**；**瑞思 §6-② 硬要求「四个字绝对不许出现在首屏三字段」** | 「**五种感官，一个架子**」「换一双耳朵／鼻子／舌头／手」 | **本批新增** |
| 「副词」 | 讲 `well`／`coldly`／`sweetly` 时（**L129／L130／L131 三课**） | 「**做事的样子**」「**样子词**」「做得好」 | L58 `:10664`／L59 `:10838`（**既有**） |
| 「介词」「不定式」「动名词」 | **本批不触发**（六课 `targetSentence` 不含 `to`；`at`／`like` 均不出现）——**但 L133 认读种子位含 `to`，禁止把 `to` 叫「介词」** | 「**朝着**那个小牌子」「**认读一句，混个脸熟**」 | 批十八／十九既有话术 |

**替换体系总表（沿用课程既有话术 ＋ 本批新增）**：

| 禁词概念 | 本批替换说法 | 出处 |
|---|---|---|
| **形容词** | 「那个『怎么样』的词」 | 批十九新增，本批续用 |
| **系动词 / 连缀动词 / 表语** | 「自己站中间」「中间不站 is」「谁上场谁管这一段」 | 本批新增（L128） |
| **感官动词** | 「听／闻／尝／摸的那个词」「五种感官，一个架子」 | **本批新增** |
| **副词 / -ly 形式** | 「做事的样子」「样子词」「不穿 -ly 外套」 | L58 `:10664`／L59 `:10838`（**既有**） |
| **第三人称单数 / 三单 -s** | 「站的是它／它们」「加个小尾巴 s」「一个用 smells、一群用 smell」 | L25 `:4528`（**既有**） |
| **疑问句 / 否定句** | 「说『不』请帮手 doesn't」「Questions」→「**问就把 Does 搬句首**」 | L25 `:4562`／L123 `:23023`（**既有**） |
| **助动词 / 情态动词** | 「帮手」「一场戏只让一个词扛变化」 | L25 `:4562`（**既有**） |
| **时态 / 一般过去时** | 「昨天版」 | L10 `:1782`（**既有**） |
| **复数 / 可数** | 「两个以上要加 s」「一群」 | L11 `:1964`（**既有**） |

## §5 叙事设计专章

### 5.1 叙事草案（逐字采用）

> **「同一个架子，换五双感官——听、闻、尝、摸。」**
> 它听着真好：`It sounds great.`（第 128 课，**听的那个词自己站中间，后面直接跟那个「怎么样」的词——中间不站 is**）→ 它闻着好香：`It smells good.`（第 129 课，**「闻着好」用 good，不用 well**——第 59 课的老规矩）→ 这个蛋糕尝着真好：`This cake tastes good.`（第 130 课，**后面那个词不加 -ly**——第 58 课的老规矩）→ 这水摸着凉：`The water feels cold.`（第 131 课，**同一个 feel 两个说法：说东西用 It feels，说自己用 I feel**——第 76 课那句）→ 它听着好吗：`Does it sound good?`（第 132 课，**说「不」请帮手、问把 Does 搬句首——四个词共用一套**）
> 收住：五句排一行（第 133 课）——**同一个架子，换五双眼睛、耳朵、鼻子、舌头、手**。
> 一句话总结：**谁上场，谁就自己站中间；后面那个词，一直是那个「怎么样」的词。**

### 5.2 复用体系（不造新术语——全部是既有资产 ＋ 上游现成切法）

| 话术 | 出处（行号） | 本批怎么用 |
|---|---|---|
| **「那个『怎么样』的词」** | 批十九 L125 新增（本批续用） | **L128–L133 六课三字段的核心话术**（§4.3 替换表） |
| **「自己站中间」／「中间不站 is」** | 批十九 L125 `:23476` 一带 | L128 立岗判据；L129 ③／L131 ④ 的回流卡 |
| **「换人换形」／「加个小尾巴 s」** | L25 `:4528`「他、她、它做事，动词后面要加个小尾巴 -s」 | L128–L131 四课的 `sv_agreement` 错卡共用（**只提「一个／一群」，不重讲规则本体**） |
| **「做事的样子」／「样子词」** | L58 `:10664`「说「怎么做的」，在动作词后面站一个样子词」／L59 `:10838`「两个常客不按 -ly 走」 | L128 ③／L130 ②／L131 ① 三张 ❌ 卡反着说 |
| **「一场戏只让一个词扛变化」** | L25 `:4562`（`Does he likes milk?` 的 whyZh 原文） | **L132 全课的主话术**（否疑两态） |
| **「搬句首」／「帮手」** | L27 `:4887`「问句 Is/Are 搬句首」／L105 `:19566`「帮手 doesn't 替 let 干活」 | L128／L129／L130／L131 四课的否疑变体 ＋ L132 正课 |
| **「昨天版」** | L10 `:1782`「看到 yesterday，动词就要换形状」 | 旧错回流的统一话术（#137／#139／#141／#142 各一处 `tense`） |
| **「两个以上要加 s」** | L11 `:1964` | 旧错回流（#137–#139／#141／#142 的 `plural`） |
| **「收口传统」** | L54 `:9823`／L78 `:14362`／L94 `:17400`／L102 `:18919`／L110 `:20418`／L118 `:22040`／L124 `:23217`（**七代先例**） | L133 同构 |
| **「认读一句，混个脸熟」** | 批十九 L127 `:23809`（`It looks like rain.` 的处理口径原文） | **L133 的 `look forward to` 种子位**（逐字照搬） |
| **跨批钩子兑现** | L125 `:23407`（`It looks nice.`）／L76 `:14061`（`I feel much better today.`）／L58 `:10657`（`She runs quickly.`）／L59 `:10846`（`She sings very well.`）／L89 `:16530`（`What a nice day!`）／L87 `:16166`（`It's cold today.`）／L52 `:9623`（`The cake was eaten by my brother.`）／L123 `:23084`（`Are you used to it?`）／L19 `:3423`（`was/were`） | **本批最大特征＝跨批钩子**（批十九 → 批二十的接口题：L128 对比卡 ④／L133 第 3 题） |

### 5.3 展示层（season-20 ＋ m22，逐字给定）

**`grammarSeasons.ts` 追加**（现有 19 季，末项 season-19 在 `:56`）：
```ts
{ id: "season-20", label: "第二十季 · 五种感官", hint: "听起来不错、闻着好、尝着好、摸着凉——同一个架子，换四双耳朵", min: 128, max: 133 }
```

**`GrammarPathPage.tsx` CAN_DO_MILESTONES 追加 m22**（现有 21 个，末项 `can-do-m21 / afterLesson: 127` 在 `:261-262`）：
```ts
{
  id: "can-do-m22",
  afterLesson: 133,
  title: "我能说出听到闻到尝到摸到的是什么样",
  zh: "听着怎么样（It sounds great）+ 闻着怎么样（It smells good）+ 尝着怎么样（This cake tastes good）+ 摸着怎么样（The water feels cold）+ 说「不」和「问」一套（It does not sound good／Does it sound good?）——同一个架子，换四双耳朵。",
  samples: ["It sounds great.", "It smells good.", "The water feels cold."]
}
```

**两条展示层红线**：
1. **`season-20` 的 `min` 必须 > 127**（否则 `grammarSeasons.test.ts:21-31` 的「互不重叠」先红）；**`max` 必须 ≥ 最高课号 133**（否则「最高课号被覆盖」先红）——**忘加 season-20 会立刻红，不会静默**（实读 4 项守门断言）。
2. **`can-do-m22` 无守门测试**（本 PRD 实读复算：全仓 `can-do-m*` 的测试引用数 ＝ 0）——**纯纪律项，漏加不会红，须人工核**（数析 §5 实读原文）。

## §6 验收标准

### 6.1 检查清单（G1–G15 ＋ 展示层，逐条可勾）

- [ ] **G1 课程数据**：practice **≥4 题**且**含一道与 variants 非肯定卡逐字一致的变体题**（`grammarLessons.test.ts:11-29` 硬断言）；本批逐课列出——L128 `Does it sound great?`｜L129 `Does it smell good?`｜L130 `Does it taste good?`｜L131 `Does it feel cold?`｜L132 `Does it sound good?`｜L133 `Does it sound great?`
- [ ] **G1-b 复现题**：**每课 ≥1 复现题**；本批逐课配置——L128 复现 L89／L59／L58；L129 复现 L128 上一课句／L52／L90；L130 复现 L129 上一课句／L52／L89；L131 复现 L87／L130 上一课句／L130 保障句；L132 复现 L128／L129／L123；L133 复现 L125／L131／L129／L130（**收口课 6 题**）
- [ ] **G2 tokens／answer 词集一致＋distractors 不与答案词重复**（`grammarLessons.test.ts:31-50`／`:52-67` 硬断言）；**arrange／practice 展示序 ≠ 答案序**（`lessonService.ts:294` `shuffleTokenOrder`；`grammarBoostService.ts:225` `shuffleWithSeed` 兜底）
- [ ] **G2-b 零术语红线**：**29 词**（`grammarZeroTerms.ts:17-24` 逐字实读）——**三字段（`grammarLabel`／`oneLineRule`／`summary.rule`）逐课自查**（断言在 `grammarLessons.test.ts:105-130`）；**本批特别核「形容词」「副词」「疑问句」「否定句」四词的 0 命中**，**＋本批额外禁「系动词」「感官动词」「连缀动词」「表语」**（非测试覆盖，人工核）；另核 AI 引用源三字段（`contrast.whyZh`／`guided.explain`／`recall.noteZh`，`grammarLessons.test.ts:200-218`）**同样 0 命中**
- [ ] **G3 recall 三字段非空**（`promptZh`／`intentZh`／`answer`；`grammarLessons.test.ts:69-88` 对 `number >= 13` 硬断言）
- [ ] **G4 目标句 ≤8 词＋一课一增量**：L128 3 词／L129 3 词／L130 4 词／L131 4 词／L132 4 词／L133 混排**逐句 ≤8 词**（5 句分别为 3／3／3／4／4 词）；§2.2 每课「新知识点」只列一件（**L133 是零新知——已在「本课定位说明」写明**）
- [ ] **G5 罪名枚举**：6 案 tag **全落 10 枚举**（`huntService.ts:331-342` 逐字实读：tense／sv_agreement／missing_be／article／plural／preposition／fragment／run_on／word_order／verb_form）；**不碰 comparison**（`types.ts:419-430` 存在但 `GRAMMAR_ERROR_TAGS` 不含它、`huntCases.ts` 实读 **0 处**）；**本批 0 处 `fragment`／`run_on`**
- [ ] **G6 案件结构**：每案 **4 错＝新错 2＋旧错 2**、**单 token 可修**、**≥1 净词**（`tokens.length > errors.length`）、`reviewed: true`、`tokenIndex` 与 `tokens` 对齐、`number` 连续（**#137–#142**，接 #136 `:7655` 之后）；旧错**只取 L10 `:1782`／L11 `:1964`／L19 `:3423`（`was/were`，**标注口径见 §7 注 2**）／L25 `:4528`**，禁引入未教材料
- [ ] **G7 tagStats=10 不动**（`huntService.test.ts:109` 断言 `toHaveLength(10)`）；**番外 5 案冻结**（`huntService.test.ts:215` 逐名单断言 `hunt-white-cat`／`hunt-sports-day`／`hunt-pen-pal-letter`／`hunt-fridge-note`／`hunt-term-review`）
- [ ] **G8 展示层硬需求**：§5.3 两条逐字落地（`season-20` `{128,133}` ＋ `can-do-m22` `afterLesson: 133`）
- [ ] **G8-b 守门测试**：`grammarSeasons.test.ts` **4 项全绿**（区间覆盖／互不重叠且 `min ≤ max`／`label`·`hint` 非空／最高课号被覆盖）；**m22 无守门，人工核**
- [ ] **G9 orphans 纪律**：6 个新案（#137–#142）**全部被 L128–L133 引用**（`huntCaseIds`），**不新增未引用案**
- [ ] **G10 episode 写法**：L128–L133 全部汉字数字（一百二十八／一百二十九／一百三十／一百三十一／一百三十二／一百三十三）
- [ ] **G11 语料锁闭集（本批最硬的一条）**：
  - **`look` 硬门**：**L128–L132 的 `targetSentence`／`examples`／`practice`／`guided` 四字段 `look` 命中数 = 0**；**两处登记例外**：① L132 `contrast` ⑤ 的 `Does it look nice?`（**双正解卡的另一半，不在四字段内**）；② L132 `examples` 第 4 条（**若生产期决定严守，则改为 `Does it smell good?`**）。**L133 的 `look` 逐字取 L125 `:23407`**。
  - **`to` 硬门**：本批**六课 `targetSentence` 不含 `to`**（逐句核）；**全批 `to` 命中仅 L133 `contrast` ⑥／`examples` 第 4 条各 1 处**（`I am looking forward to the weekend.`）——**其余五课 `to` 命中 = 0**，**且五课不出现 `used`／`getting`／`walking`**（与批十八零交集）。
  - **本批不引入**：`look forward to`（只认读一次）／`object to`／`look like`／`look as if`／`sounded`／`smelled`／`tasted`／`felt`／`seem`／`appear`／`sweet`／`soft`／`smooth`／`fresh`／`delicious`／`soup`／`cool`／形容词＋介词／`have sth done`／`become`。
- [ ] **G12 cloze 逐课核验**（本 PRD 以**逐字复刻抽词器**独立复跑，结果与数析 §4.1 表**逐字一致**）：
  - **词表状态（逐字实读）**：`sounds`／`smells`／`tastes`／`feels` **全部不在 `GRAMMAR_WORDS` 148 词表内**（本 PRD 实读 `grammarAmbushService.ts:160-187`：表内含 `look`／`looks`／`listen`／`listens`／`see`／`sees`／`saw`／`watch`／`watches`，**不含本批四词**）；**四词也不在 `CLOZE_STOP_WORDS` 30 词内** → **走第 ② 档实词回退，空位恰好落在考点词上**（**「真友好」**）。
  - **逐课落点（逐字复跑登记）**：

    | 课 | 句 | 档 | 空位词 | clozeText |
    |---|---|---|---|---|
    | L128 | `It sounds great.` | ② | **sounds** | `It ___ great.` |
    | L128 | `It looks nice.`（对比卡 ④） | ① | **looks** | `It ___ nice.` |
    | L128 | `That sounds good.`（保障句） | ② | **sounds** | `That ___ good.` |
    | L128 | `Does it sound great?`（变体） | ① | **Does** | `___ it sound great?` |
    | L129 | `It smells good.` | ② | **smells** | `It ___ good.` |
    | L129 | `It smells nice.`（保障句） | ② | **smells** | `It ___ nice.` |
    | L129 | `It does not smell good.`（变体） | ① | **does** | `It ___ not smell good.` |
    | L130 | `This cake tastes good.` | ② | ⚠️ **cake** | `This ___ tastes good.` |
    | L130 | **`It tastes good.`（保障句）** | ② | **tastes** | `It ___ good.` |
    | L130 | `Does it taste good?`（变体） | ① | **Does** | `___ it taste good?` |
    | L131 | `The water feels cold.` | ② | ⚠️ **water** | `The ___ feels cold.` |
    | L131 | **`It feels cold.`（保障句）** | ② | **feels** | `It ___ cold.` |
    | L131 | `Does it feel cold?`（变体） | ① | **Does** | `___ it feel cold?` |
    | L132 | `Does it sound good?`（target） | ① | **Does** | `___ it sound good?` |
    | L132 | `Does it smell good?`（保障句） | ① | **Does** | `___ it smell good?` |
    | L133 | `It looks nice.` | ① | **looks** | `It ___ nice.` |
    | L133 | `It sounds great.` | ② | **sounds** | `It ___ great.` |

  - **两处必须改句（逐字写死）**：⚠️ **`This soup tastes nice.`／`This cake tastes nice.` 全批不得出现**（空位被 `soup`／`cake` 抢走；`soup` GL 0）；⚠️ **`The water feels cold.` 的空位落 `water`** → **保障句改用 `It feels cold.`**（落 `feels`）。
  - **保障句（每课 ≥1，让主考点不落空）**：L128 `That sounds good.`（落 **sounds**）／L129 `It smells nice.`（落 **smells**）／L130 `It tastes good.`（落 **tastes**）／L131 `It feels cold.`（落 **feels**）／L132 `Does it smell good?`（落 **Does**）／L133 `It tastes good.`（落 **tastes**）——**六句全部本轮逐字复跑确认**。
  - **⚠️ 与批十九的对照（本批优势，须写进生产单）**：批十九的 `look`／`looks` 走**第 ① 档直命中**（在词表内）；**本批四词走第 ② 档，但空位仍落在考点词上**——**「第 ② 档但落点即考点」与「第 ① 档」在题目有效性上等价**，且**「考 sounds 还是 sound」这类三单判断题两通道都能成立**。
  - **逐课须核「variants 至少 1 句让主考点落空」**——本批六课全部满足（变体的 ambush 落点在 `Does`／`does`，而保障句落 `sounds`／`smells`／`tastes`／`feels`）。
- [ ] **G-boost（硬护栏）**：
  - **每课 contrast 6 条中 3 条为「带 `wrongMark` 的真实错卡」**（口径：`wrongMark` 非空、非 bothRight、字面词能在 wrong 句里定位；`grammarBoostService.ts:700-717` 实读）；**禁止贴线**（`grammarBoostService.test.ts:159-182` 全库逐课断言 `thin === []`；当前最低 11 课只有 2 道）。**本批逐课 ③ 条**——**18 个 `wrongMark` 全部含字母**：L128 `is`／`sound`／`greatly`｜L129 `well`／`smell`／`is`｜L130 `well`／`sweetly`／`taste`｜L131 `coldly`／`feel`／`is`｜L132 `not`／`sounds`／`sounds`｜L133 `is`／`well`／`coldly`。**每课池深＝3 mark ＋ 1 spot ＝ 4 道**（与 L120–L123／L125–L127 持平）。
  - **`wrongMark` 不得为纯标点**（`grammarBoostService.test.ts:199-208` 断言；L89 `"?"` 已修为 `"day?"` 的前车之鉴）——**本批 18 个 `wrongMark` 均含字母 ✓**（**本批无一处带 `?` 或 `!`**，故无尾标点风险）。
  - **`guided.spot` 的 `wrongToken` 必须与 `tokens` 元素逐字相等（含尾标点写法一致）**——L96／L102 曾因 `tokens: ["It","was","rain."]` ＋ `wrongToken: "rain."` 的**尾标点不一致**致题目静默消失；**本批 6 处 spot 设计逐课按最严口径核对**：L128 `["It","sounds","is","great."]`/`"is"`｜L129 `["It","smells","well."]`/`"well."`（**⚠️ 逐字口径：写成 `"well."` 与 tokens 末项逐字相等；代码侧 `cleanWord` 兜底存在但断言不依赖它**）｜L130 `["This","cake","tastes","well."]`/`"well."`｜L131 `["The","water","feels","coldly."]`/`"coldly."`｜L132 `["Does","it","sounds","good?"]`/`"sounds"`｜L133 `["It","smells","well."]`/`"well."`。**⚠️ 定稿口径（写死）**：**`wrongToken` 一律写成「带尾标点的 tokens 逐字元素」**（`"well."`／`"coldly."`）/ 或「不含尾标点的中间元素逐字值」（`"is"`／`"sounds"`）——**两类的共同要求＝`tokens.includes(wrongToken)` 必须为 true**（`grammarBoostService.test.ts:185-196` 断言）。
  - **每课 contrast ≥3 条**、`kind` 覆盖 choose／arrange／spot／replace——**本批六课 guided 各 6 道**（含 choose／arrange／spot／replace 四类）
  - **G-boost-d 双正解卡的 diffScore 红线**：`grammarBoostService.ts:744-753` 对 `bothRight` 条目做 `diffScore(compareText(correct, wrong))`，**`>= 90` 直接 `return`**（静默丢弃、不报错）。**本 PRD 以真实 `diffService` 逻辑逐字复刻实跑本批全部 18 组双正解设计并留档**：**L128** ④ `It looks nice.`／`It sounds great.` **33** ✅｜⑤ `She sings very well.`／`It sounds great.` **0** ✅｜⑥ `What a nice day!`／`It sounds great!` **0** ✅｜**L129** ④ `It sounds great.`／`It smells good.` **33** ✅｜⑤ `It smells good.`／`It is good.` **67** ✅｜⑥ `The cakes smell good.`／`It smells good.` **（待登记，预估 50）**｜**L130** ④ `It smells good.`／`This cake tastes good.` **25** ✅｜⑤ `This cake tastes good.`／`This cake is good.` **75** ✅｜⑥ `What a nice day!`／`This cake tastes good.` **0** ✅｜**L131** ③ `The water feels cold.`／`The water is cold.` **75** ✅｜⑤ `The water feels cold.`／`I feel much better today.` **0** ✅｜⑥ `It feels cold.`／`The water feels cold.` **50** ✅｜**L132** ④ `It does not sound good.`／`Does it sound good?` **60** ✅｜⑤ `Does it look nice?`／`Does it sound good?` **50** ✅｜⑥ `Are you used to it?`／`Does it sound good?` **0** ✅｜**L133** ④ `It sounds great.`／`It smells good.` **33** ✅｜⑤ `It looks nice.`／`It sounds great.` **33** ✅｜⑥ `I am looking forward to the weekend.`／`It sounds great.` **（待登记）**。**全 18 组上限 75 ✓（最高＝L130 ⑤／L131 ③ 的 75，均未越线）**。**⚠️ 已登记的过近对（≥90，禁用）**：`It looks nice!`／`It looks nice.` **100**（批十九已弃用，本批同样禁用）；`Does it sound good.`／`Does it sound good?` **100**（**标点差异被 `compareText` 的 `strictPunctuation=false` 口径抹平**——**本批双正解卡不得用只差标点的句对**）。**⚠️ 已登记的偏近对（67，可用但本批不用）**：`It sounds great.`／`It is great.` 67｜`It sounds great.`／`That sounds great.` 67｜`It smells good.`／`It tastes good.` 67｜`It is great.`／`It sounds great.` 67｜`It is good.`／`It smells good.` 67。
  - **（附）全库护栏现状（数析 §7 实读）**：`kind: "spot"` **恒为 1 道/课**；`contrast` 带非空 `wrongMark` 共 **434 条**、`wrongMark: null` **310 条**；**每课至少 1 条**；最低 11 课只有 2 道（贴线）。→ **本批每课 3 条带 mark 的真错卡，过线且留余量**。
- [ ] **G13 时长 6–8 min**（6 课逐课走查；**六课目标句均 ≤4 词**——对比卡与 deepDive 承担余量；**L133 因五句同屏可略长（5–6 min）**，须按**分段计时**抽查）
- [ ] **G14 旧线零回归**：**L1–L127 一字不动**（**特别声明：不改 L125 `:23407`／L59 `:10846`／L58 `:10657`／L89 `:16530`／L87 `:16166`／L52 `:9623`／L123 `:23084`／L76 `:14061` 等被「认领」的句子**——**认领＝在 L128–L133 里引用，不是编辑原课**）；**不改 `grammarAmbushService.ts`／`grammarBoostService.ts`／`grammarBoostService.test.ts`／`grammarZeroTerms.ts` 四个文件**；`npx vitest run` 全绿（**基线：61 文件 / 785 项**，数析 §7 实跑快照——**注：瑞思本轮记 61／774，为同期另一路未提交改动所致；生产时以实跑为准并登记**）；`npx tsc --noEmit` 0 错；build 通过
- [ ] **G15 封面**：`L128←cover11`／`L129←cover12`／`L130←cover13`／`L131←cover14`／`L132←cover15`／`L133←cover16`（min-gap **117**，数析 §6.4 二分＋穷举验证**唯一解**）；**逐张目视核对图像语义（本 PRD 已完成 6/6，见 §2.1 表）**；**唯一允许的池内换法＝`cover14` 与 `cover12` 互换**（其余四张不动）；**`cover1`–`cover10` 本批永久禁用**（二用张、段距 1–10）；**`cover96`+ 本批禁用**；**`cover118`+ 资产不存在**

### 6.2 Given/When/Then

- **G-A1** Given 学习者完成 L128 When 看 `It sounds is great.` ❌ Then 能删掉 `is` 并说出「**中间不站 is——听的那个词自己就够**」；When 看 `It looks nice.` ✅ 与 `It sounds great.` ✅ 并排 Then 能说出「**同一个架子，换一双耳朵**」
- **G-A2** Given 学习者完成 L128 When 看 `It sounds greatly.` ❌ Then 能改成 `It sounds great.` 并说出「**加 -ly 是『做事的样子』**（第 58 课），这里说的是它**听着**什么样」
- **G-A3** Given 学习者完成 L129 When 看 `It smells well.` ❌ Then 能改成 `It smells good.` 并说出「**well 是做得好**（第 59 课）——这里要的是「闻着好」」；When 看 `She sings very well.` ✅ 与 `It smells good.` ✅ 并排 Then 能说出「**一个夸做法，一个夸闻着**——两句都对」
- **G-A4** Given 学习者完成 L130 When 看 `This cake tastes well.` ❌ 或 `This cake tastes sweetly.` ❌ Then 能改成 `This cake tastes good.` 并说出「**后面那个词不穿 -ly 外套**」；When 看 `This cake tastes good.` ✅ 与 `This cake is good.` ✅ 并排 Then 能说出「**一张是我尝到的它，一张就是它好**」
- **G-A5** Given 学习者完成 L131 When 看 `The water feels coldly.` ❌ Then 能改成 `The water feels cold.` 并说出「**加 -ly 是做事的样子**」；When 看 `The water feels cold.`（摸着凉）✅ 与 `I feel much better today.`（我觉得好多了）✅ 并排 Then 能说出「**同一个 feel 两个说法——看它前面站的是人还是东西**」
- **G-A6** Given 学习者完成 L132 When 看 `It not sounds good.` ❌ Then 能改成 `It does not sound good.` 并说出「**说「不」要请帮手 doesn't，它退回原样**」；When 看 `Does it sounds good?` ❌ Then 能改成 `Does it sound good?` 并说出「**Does 搬句首之后，它要退回原样——一场戏只让一个词扛变化**」
- **G-A7** Given 学习者完成 L133 回看五课旧句 When 逐句指认 Then 能各自说出「这是第 N 课学的、换的是哪一双」；When 看 `I am looking forward to the weekend.` Then 能说出「**只认脸、今天不学新花样**」（**不得判错、不得要求改写**）

## §7 案件规划（6 案 · #137–#142）

**总规则**：每案 **4 错＝新错 2＋旧错 2**；**单 token 可修**；每案 **≥1 净词**（`tokens.length > errors.length`）；零术语话术；tag **全落 10 枚举**（tagStats 固定 10 项）；`reviewed: true`；**必须配课**；**不碰 comparison**；**不引番外 5 案**；**本批 0 处 `fragment`／`run_on`**。案件编号接批十九尾案（#136 `hunt-two-look-faces`，`huntCases.ts:7655` 起）为 **#137–#142**。**tokens 格式沿用「4 句短句排一行」**（先例 #128 `:7303` 起／#136 同款），**标点跟在前一个词后面**（`huntCases.ts` 头注释 `:15` 明文）。

| 案件 id | # | 配课 | 场景 | 定稿错误构成（原 → 修正（tag，新/旧）） |
|---|---|---|---|---|
| `hunt-it-sounds-great` | **137** | L128 | 客厅门口：厨房放着一首歌，你站在门口听 | ① `is` → 去掉 `is`（`It sounds is great.`，**verb_form**，新——**中间不站 is**；**逐字先例** `huntCases.ts:7141`（#124：`tag: "verb_form"`／`original: "is."`／`correction: "去掉 is."`／`explanation` 收句「一句话只要一个「发动机」」）；本课 explanation 用「中间不站 is——听的那个词自己就够」）② `sound` → `sounds`（`It sound great.`，**sv_agreement**，新——**「它」只有一个，要带小尾巴**；**先例** `huntCases.ts:7577` 起（#134 ① 同型反向）；explanation「「它」是单个的——听的那个词要带上 s（第 25 课的老规矩）：It 【sounds】 great。」）③ `go` → `went`（`Yesterday I go to the park.`，**tense**，旧错 L10 `:1782`；**逐字先例** `huntCases.ts:124-128`（首案）＋`huntCases.ts:7460-7466`（#131：`go→went`，explanation「第 10 课回流：说昨天的事要换昨天版——go → 【went】。」））④ `apple` → `apples.`（`We have two apple.`，**plural**，旧错 L11 `:1964`；**逐字先例** `huntCases.ts:720-726`（第 17 案：`original: "apple"`／`correction: "apples"`／`explanation: "two 后面的可数名词要加 -s：two apples。"`）） |
| `hunt-it-smells-good` | **138** | L129 | 厨房：锅盖掀开，热气冒出来 | ① `well.` → `good.`（`It smells well.`，**word_order**，新——**「闻着好」用 good，不用 well**；**先例** `huntCases.ts:7365-7371`（#129 的 `word_order` 补词型）＋**同词对反向先例** L59 `:10866`（`She sings very good.` 的 `wrongMark: "good"`）；explanation「`well` 是「做得好」（第 59 课的老规矩）——这里说的是「闻着那个东西怎么样」，用 【good】。」）② `smell` → `smells`（`It smell good.`，**sv_agreement**，新；explanation「「它」是单个的——闻的那个词要带上 s（第 25 课的老规矩）：It 【smells】 good。」）③ `was` → `were`（`They was happy.`，**sv_agreement**，旧错 L19（`:3423`）；**逐字先例** `huntCases.ts:7626-7631`（#135 ③：`original: "was"`／`correction: "were"`／`explanation: "第 19 课回流：They 是一伙人，用 were 搭档——They 【were】 happy。"）；**⚠️ 口径注**：瑞思 §1⑫ 指出「一个用 was、一群用 were」实际在 L51 `:9344`／`:9416`，**不在 L19**；**批十七至十九连续三批均取 L19 标号**（#132 ②／#135 ③ 实读），**本批沿用 L19 标号以保持回流课号一致**，**生产期若产品决定改标 L51，本批三案须同改**）④ `drink` → `drinks`（`He drink milk every day.`，**sv_agreement**，旧错 L25 `:4528`；**逐字先例** `huntCases.ts:7373-7378`（#129 ③：`original: "drink"`／`correction: "drinks"`／`explanation: "第 25 课回流：他/她/它后面的动词加 -s——He 【drinks】 milk every day。"`）） |
| `hunt-it-tastes-good` | **139** | L130 | 餐桌：蛋糕切开，一人一块 | ① `well.` → `good.`（`This cake tastes well.`，**word_order**，新；explanation「`well` 是「做得好」——这里要的是「尝着好」：This cake tastes 【good】。」）② `taste` → `tastes`（`This cake taste good.`，**sv_agreement**，新；explanation「这个蛋糕是一个——尝的那个词要带上 s：This cake 【tastes】 good。」）③ `go` → `went`（`Yesterday I go home.`，**tense**，旧错 L10；**逐字先例** `huntCases.ts:7460-7466`（#131 ③ 同句同解））④ `cup.` → `cups.`（`We have two cup.`，**plural**，旧错 L11 `:1964`；**逐字先例** `huntCases.ts:7626` 起（#135 ④：`original: "cup."`／`correction: "cups."`／`explanation: "第 11 课回流：two 后面是可数名词复数——two 【cups】。"）） |
| `hunt-water-feels-cold` | **140** | L131 | 客厅：窗外下雨，桌上那杯水放了很久 | ① `coldly.` → `cold.`（`The water feels coldly.`，**word_order**，新——**-ly 过度套用**；**对齐中文侧 `sense-verbs` ❌2**「`Your skin feels so smooth.`（不是 smoothly）」；**先例** `huntCases.ts:7368-7374`（#129 的 -ly 型）＋L126 `:23632`（批十九 `tiredly` 卡）；explanation「加 -ly 是「做事的样子」（第 58 课）——这里说的是东西摸着什么样：The water feels 【cold】。」）② `feel` → `feels`（`The water feel cold.`，**sv_agreement**，新；explanation「这水是一样东西——摸的那个词要带上 s：The water 【feels】 cold。」）③ `was` → `were`（`They was happy.`，**sv_agreement**，旧错 L19；同 #138 ③）④ `drink` → `drinks`（`She drink milk every day.`，**sv_agreement**，旧错 L25；**与 #138 ④ 换主语**（He→She），避免逐字重复；explanation「第 25 课回流：他/她/它后面的动词加 -s——She 【drinks】 milk every day。」） |
| `hunt-does-it-sound-good` | **141** | L132 | 校园课间：同学说新出了一首歌 | ① `not` → `does not`（`It not sounds good.`，**verb_form**，新——**说「不」要请帮手**；**单 token 可修的补词型写法**：`correction` 写 `"does not"`；**先例** `huntCases.ts:7423-7429`（#130 的补词型）／`:7379`（#129 的 `getting→to getting` 型）；explanation「说「不」得请帮手 doesn't 来：It 【does not】 sound good——帮手一出场，听的那个词就退回原样。」）② `sounds` → `sound`（`Does it sounds good?`，**verb_form**，新——**Does 搬句首之后它要退回原样**；explanation「Does 搬到前面了——一场戏只让一个词扛变化：Does it 【sound】 good?」）③ `go` → `went`（`Yesterday I go to the park.`，**tense**，旧错 L10；同 #137 ③）④ `box.` → `boxes.`（`We have two box.`，**plural**，旧错 L11；**逐字先例** `huntCases.ts:7601-7606`（#134 ④：`original: "box."`／`correction: "boxes."`／`explanation: "第 11 课回流：two 后面是可数名词复数——two 【boxes】。"）） |
| `hunt-five-senses` | **142** | L133（**收口课案件**） | 书桌前：五句抄在本子上排一行 | ① `is` → 去掉 `is`（`It sounds is great.`，**verb_form**，**回流 #137 ①**；explanation「第 128 课回流：中间不站 is——听的那个词自己就够。」）② `well.` → `good.`（`It smells well.`，**word_order**，**回流 #138 ①**；explanation「第 129 课回流：「闻着好」用 【good】。」）③ `coldly.` → `cold.`（`The water feels coldly.`，**word_order**，**回流 #140 ①**；explanation「第 131 课回流：后面那个词不加 -ly——The water feels 【cold】。」）④ `book.` → `books.`（`We have two book.`，**plural**，旧错 L11 `:1964`；**逐字先例** `huntCases.ts:7423-7429`（#130 ④：`original: "book."`／`correction: "books."`／`explanation: "第 11 课回流：two 后面是可数名词复数——two 【books】。"）——**沿用 #136 收口案式**（旧错只取一处 `plural`，四点里三点锚新课）） |

**本批罪名分布（6 案 × 4 错 ＝ 24 处，逐案按上表实点）**：`sv_agreement` **8**（#137②／#138②③④／#139②／#140②③④）／`word_order` **5**（#138①／#139①／#140①／#142②③）／`verb_form` **4**（#137①／#141①／#141②／#142①）／`plural` **4**（#137④／#139④／#141④／#142④）／`tense` **3**（#137③／#139③／#141③）／**`missing_be` 0／`article` 0／`preposition` 0／`fragment` 0／`run_on` 0**。**校验：8＋5＋4＋4＋3 ＝ 24 ✓**。**各罪名承载案数**：`sv_agreement` 4 案／`word_order` 4 案／`verb_form` 3 案／`plural` 4 案／`tense` 3 案。
> **注 1-b（与批十九的对照）**：批十九 3 案 12 处的分布是 `sv_agreement` 3／`word_order` 2／`verb_form` 1／`article` 1／`tense` 2／`plural` 2／`preposition` 1——**本批新增了「四感官三单」这条线，故 `sv_agreement` 从 3 升到 8**（**理由见注 1**）；**同时 `word_order` 因三条 -ly 卡升到 5**（#138①／#139①／#140① 三条 + #142 的两条回流），**这是本批「-ly 负迁移三站」的直接投影**。
> **注 1（`sv_agreement` 偏多——本批的刻意处置与说明）**：本批 `sv_agreement` 共 **8 处**（#137② 1＋#138②③④ 3＋#139② 1＋#140②③④ 3）——**理由**：四感官课的新增考点本身就是「一个／一群配哪个形状」（`sounds` vs `sound`），**这是本批的语法核心**，故新错侧刻意用 `sv_agreement`。**风险与稀释**：**L132／L133 两课的新错不再用 `sv_agreement`**（L132 两个新错全落 `verb_form`；L133 是 `verb_form`／`word_order` 各一），**且 L131 之后不再新增**（§2.2 L131 ② 已登记）。**旧错侧**：#138③④／#140③④ 取 L19／L25，**两条线各两处、对称分布**。**若走查显示 `sv_agreement` 观感疲劳，备选＝#140③ 改 `article`（`He is the good boy.` 的 `the→a`，先例 `huntCases.ts:7147-7151`）**——**默认不改**（会打破「旧错只取 L10／L11／L19／L25」的纪律）。
> **注 2（旧错回流只取 4 课）**：`tense` 一律取 L10 `:1782`／`plural` 一律取 L11 `:1964`／`sv_agreement` 取 L19（`was/were`）与 L25 `:4528`（三单）——**与批十七至十九四批的回流课号完全一致**（**是既定传统，不是新引入**）。**L19 标号的口径见 #138 ③ 注**（瑞思 §1⑫ 已登记「`was/were` 实际在 L51」，本批沿用既有标号）。
> **注 3（tokenIndex 定稿）**：上表只给「原 → 修正」，**生产时逐 token 核 `tokenIndex` 与 `tokens` 下标**。**四句排一行的下标规律**（照抄 #128／#130／#131／#132／#135／#136）：第 1 句从 0 起、第 2 句从「第 1 句词数」起、依次累加。**本批逐案下标**（按「4 句短句排一行」定稿）：

| 案 | tokens（逐字） | 错点下标 |
|---|---|---|
| #137 | `["It","sounds","is","great.","It","sound","great.","Yesterday","I","go","to","the","park.","We","have","two","apple."]` | ① 2（`is`）② 5（`sound`）③ 9（`go`）④ 16（`apple.`） |
| #138 | `["It","smells","well.","It","smell","good.","They","was","happy.","He","drink","milk","every","day."]` | ① 2（`well.`）② 4（`smell`）③ 7（`was`）④ 10（`drink`） |
| #139 | `["This","cake","tastes","well.","This","cake","taste","good.","Yesterday","I","go","home.","We","have","two","cup."]` | ① 3（`well.`）② 6（`taste`）③ 10（`go`）④ 15（`cup.`） |
| #140 | `["The","water","feels","coldly.","The","water","feel","cold.","They","was","happy.","She","drink","milk","every","day."]` | ① 3（`coldly.`）② 6（`feel`）③ 9（`was`）④ 12（`drink`） |
| #141 | `["It","not","sounds","good.","Does","it","sounds","good?","Yesterday","I","go","to","the","park.","We","have","two","box."]` | ① 1（`not`）② 6（`sounds`）③ 10（`go`）④ 17（`box.`） |
| #142 | `["It","sounds","is","great.","It","smells","well.","The","water","feels","coldly.","We","have","two","book."]` | ① 2（`is`）② 5（`well.`）③ 10（`coldly.`）④ 15（`book.`） |

> **⚠️ 净词校验（逐案）**：#137 `tokens 17 > errors 4` ✓｜#138 `14 > 4` ✓｜#139 `16 > 4` ✓｜#140 `16 > 4` ✓｜#141 `18 > 4` ✓｜#142 `16 > 4` ✓。
> **⚠️ 标点口径（逐案须核）**：`huntCases.ts` 头注释 `:15` 明文「tokens 是原文按空格切好的词表（标点跟在前一个词后面）」——**本批三个带尾标点的原文（`well.`／`coldly.`／`cup.`／`box.`／`book.`／`apple.`）必须与 `tokens` 逐字一致**（先例 #134 ④ `"box."`／#135 ④ `"cup."`／#130 ④ `"book."` 均带尾标点）。**#141 ② 的 `tokens` 末项是 `"good?"`（第一句以问号结尾）**——**逐字核**。

**案件表纪律**：每案 4 错全部**单 token 可修**（补词／删词型按既有先例：`is→去掉 is` 型参照 `huntCases.ts:7141`；`not→does not` 补词型参照 `:7379`；`well.→good.` 替换型参照 `:7365`）；新错话术走 §4 负迁移表；**旧错一律取自已教点**（L10／L11／L19／L25），**禁引入未教材料**；**#142 的四点须与 #137／#138／#140 的错型逐条呼应**（收口课纪律：**复现不讲新**——#142 三点锚新课、一点锚旧课，与 #136 同构）。

## §8 Non-goals

- **不做 `look` 的新内容**（**批十九红区**）——**L128–L132 的 `targetSentence`／`examples`／`practice`／`guided` 四字段 `look` 命中 = 0**；**唯一两处例外**：L132 `contrast` ⑤ 的 `Does it look nice?`（双正解卡另一半，不进四字段）与 L132 `examples` 第 4 条（若严守则改）——**L133 的 `look` 逐字取 L125 `:23407`，一字不改**
- **不做 `look forward to` 正课**（**主理人裁决推迟到批二十一**；档位 B+ 保留）——**本批只有 L133 一处认读种子位**（`examples` 第 4 条 ＋ `contrast` ⑥，**bothRight: true、不进练习、不作错项、不进 `guided`／`recall`**）
- **不做 `object to`**（判 C：证据半页＋语义场景不友好；**连认读也不给**）
- **不做 `look like`／`look as if`／`look as though` 的扩**（维持 L127 认读口径；批十九 §8 已冻结）
- **不做 `sounded`／`smelled`／`smelt`／`tasted`／`felt`／`feeling` 的过去形态**（`felt` 0／`feeling` 1 处；**本批只用现在时的 `-s` 与不带 `-s` 两形**）
- **不做 `sweet`／`soft`／`smooth`／`fresh`／`delicious`／`strange`／`bitter` 等感官形容词**（**两文件全 0**；「闻着香」「尝着甜」「摸着软」**一律绕开**，统一用 `good`／`great`／`cold`／`nice`）
- **不做 `soup`／`cool`**（`soup` GL 0／`cool` 双 0）——**L129 的场景写「锅盖掀开」，但不出现 `soup` 这个词**（用 `It` 指代）
- **不做 `seem`／`appear`**（两文件全 0 且属 D 档）
- **不做 `become`／`get + 形容词`／`turn + 形容词`**（越段内容冻结）
- **不做否定／疑问之外的句式扩展**（本批否疑只用 `doesn't`／`Does` 一套，**不引入 `isn't`／`aren't` 型 be 否定**——那是 L125 的 `it` 版体系）
- **不做**形容词＋介词单开课（**本批连折卡也不做**——6 课对比卡已被感官边界占满）
- **不做** `have sth done`（维持撤出）
- **不做散点**（`It's nice to see you.` 类 `it` 句式、`sound like`／`smell like`／`taste like`／`feel like` 的 `like` 扩展——**中文侧 `sense-verbs` 有这条线，但本批不做**：会把一课变两课）
- **不做** 机制强化（boost 三档／回马枪已饱和且有测试守门：`grammarBoostService.test.ts` **50 项实跑全绿**）
- **不做** 双拱（批十四破例一次后，批十五至二十**连续第七次单拱**）
- **案量不扩**：6 课 6 案，不设「一课两案」；**不加**新枚举、不改 tagStats／schema、不改 `types.ts`
- **不动 L1–L127**（一字不改；**特别声明**：不改 L125 `:23407`／L76 `:14061`／L58 `:10657`／L59 `:10846`／L89 `:16530`／L87 `:16166`／L52 `:9623`／L123 `:23084` 等被认领的句子——**认领＝引用不是编辑**）
- **不引**番外 5 案（`hunt-white-cat`／`hunt-sports-day`／`hunt-pen-pal-letter`／`hunt-fridge-note`／`hunt-term-review`）
- **不做** 池外新资产（封面＝cover11–cover16 池内复用，数析 §6.4 唯一最优解；**语义不符时只允许 `cover14`↔`cover12` 互换**；`cover1`–`cover10` 永久禁用、`cover96`+ 本批禁用、`cover118`+ 资产不存在）
- **不做** cloze 词表扩充（**`sounds`／`smells`／`tastes`／`feels` 走第 ② 档已够**，本批**不改 `grammarAmbushService.ts`／`grammarBoostService.ts`**）
- **不做** 中文侧术语直抄（**「感官動詞」「連綴動詞」「介系詞」「形容詞」「副詞」五词全部不引**——§4.3 替换表）

## §9 开放问题

1. **「换词不换架」在第 3 课起会不会失效**（**本批最大教学未知**，瑞思 §7 假设 1）——6 课同一骨架、只换中间那个词，**重复面比批十九翻倍**。**观察点**：L130 与 L131 的完成率是否显著低于 L128（**若显著下滑，说明「换词不换架子」在第 3 课起失效**）。**默认处置**：L130／L131 各靠一条**新角度的错卡**撑住（L130 的 `sweetly` 型 -ly ＋ L131 的 `feel` 与人／物切开）——**若仍不足，备选＝L131 的对比卡 ⑥ 换成「`He feels the cat.`（摸这个动作）」的第三张脸认读卡**（**代价：引入 `feel` 的动作义，须主理人裁**）。
2. **`cover12`／`cover13` 的图像语义**（本 PRD 已完成 6/6 目视，见 §2.1 表）——`lesson-12.jpg`＝夜晚卧室画画、`lesson-13.jpg`＝美术教室画画，**与 L129「厨房掀锅盖」／L130「餐桌蛋糕」的相称性偏弱**；`cover14`（奶茶柜台）与 `cover16`（教室课桌）相称度最高。**默认按数析 §6.4 唯一最优解上线**（`cover` 为可选字段，缺省回退 scene SVG，**不阻断上线**）；**若产品要求场景贴合，唯一允许的池内换法＝`cover14`↔`cover12` 互换**（并接受 min-gap 从 117 下降到 115，仍远 ≥35）。
3. **`feel` 的触觉义会不会与 L76 串台**（瑞思 §7 假设 8）——L131 已设 bothRight 切开卡（diffScore 0，最安全一组）＋deepDive 第 3 段；**走查须问「`I feel much better.` 和 `The water feels cold.` 哪句是说你自己的感觉」**。**反向风险**：学生是否因此不敢用 `I feel`（走查问「`I feel tired.` 对不对」，**正确反应是「对」**）。
4. **6 课大章完成率曲线 vs 批十八 6 课**（**「回大章」裁决的唯一实测回收点**，瑞思 §7 假设 4）——**F20-B**：与批十八 6 课曲线直接对照，**并与批十九 3 课小章曲线三线并读**。**注**：F17-A／F17-B／F18-A／F18-B／F19-A／F19-B **六道门全部未回**（瑞思 §7 未核实 14），**批二十开工不等待**。
5. **`sound`／`smell`／`taste` 是否在「核心 500 词」内**（瑞思 §7 待复核 5）——**无机器可检资产**（批十九已登记同一缺口）；**三词全部是英语最高频基础词，风险判断为低，但须人工核**。
6. **`sv_agreement` 在 6 案里占 8 处的观感**（§7 注 1）——**已刻意处置**（L132／L133 两课新错不用此型；旧错线与三单线各两处对称）；**走查问「`It sounds` 与 `It smell` 哪个对」的判对率**；**若观感疲劳显著，备选＝#140③ 改 `article`**（**默认不改**）。
7. **L19 标号的口径**（#138 ③／#140 ③ 的 `was/were`）——瑞思 §1⑫ 实读「『一个用 was、一群用 were』实际在 L51 `:9344`／`:9416`，**不在 L19**」；**批十七至十九三批均取 L19 标号**（#132／#135 实读），**本批沿用**。**若产品决定改标 L51，本批两案须同改**（并回溯登记前批）。
8. **`look forward to` 种子位的边界**（**主理人已裁「加」**）——三条护栏已写死（§2.2 L133）：**只许 `examples` 第 4 条 ＋ `contrast` ⑥；不进练习／不作错项；`contrast` ⑥ 必带 `bothRight: true`**。**走查须问「`I am looking forward to the weekend.` 要不要练」**（**正确反应是「今天不练」**）。**风险**：它把 `look` 与 `to + -ing` 的语义场提前带进 L133（**与「L128–L132 `look` 命中 = 0」纪律不冲突，但会新增 1 处 `to`**）——**若走查显示学生误当考点，备选＝撤掉该条**（瑞思 §6⑤ 的默认建议即「不加」）。
9. **基线口径**——本 PRD 引用的测试基线是**数析 §7 快照：61 文件 / 785 项全绿 ＋ `tsc --noEmit` exit 0**；**瑞思本轮实跑记 61 文件 / 774 项**（同报告 §1⑦ 亦记 61／774，而路线图记 61／762）——**三记不同，成因未追查**（瑞思 §7 未核实 13 原文：「差值成因（同期另一路未提交改动，工作区 25 文件 M）本轮未追查」）。**生产时以实跑为准并登记**（G14 写 785，若生产期再变以实跑登记）。
10. **`can-do-m22` 无守门**（数析 §5 实读：全仓 `can-do-m*` 测试引用数 ＝ 0）——**漏加不会红，须人工核**（G8-b 已列）。
11. **封面 09-19 流水线切换的提交边界未查明**（瑞思 §7 未核实 16）——`src/assets/lessons/lesson-50..117.jpg`（**68 张**）为 untracked 新资产；**本批池内复用、零新资产，不触发该缺口**。
12. **`feel` 冻结的解冻范围已裁**（§1.2 配套 4：**批十九一次性限定**）——**若产品另有长期冻结意图，须在开工前重裁**（**否则 L131 无法落地，方案须降级为 5 课**——瑞思 §7 待裁 1 原文）。

---

> 本规格书由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。
