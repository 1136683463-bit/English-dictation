# PRD：第十八批 · 同一个 to，两张脸（be/get used to · 6 课 L119–L124）

**日期**：2026-09-19 ｜ **类型**：功能规格书（PRD）｜ **成员**：析客（需求分析）
**上游输入**：主理人裁决（批十八＝「我慢慢习惯了」6 课单拱 L119–L124；章题「同一个 to，两张脸」；L93 冲突走**对位改写、不改前课一个字**；L122 为脊柱课，话术＝竞析 §5.3 的 **A＋B 合写**、首屏用 C）；本批三研究（瑞思 `user-research-grammar-eighteenth-batch-2026-09-19.md`／竞析 `competitive-analysis-grammar-eighteenth-batch-2026-09-19.md`／数析 `data-audit-grammar-eighteenth-batch-2026-09-19.md`，均 2026-09-19）；批十七 PRD `prd-grammar-a2-closeout-2026-09-19.md`（格式与护栏基线）

## 📝 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1 | 2026-09-19 | 初稿：6 课（L119–L124）＋6 案（#128–#133），开 season-18、m20；定位「A2 关账之后 · B1 开局第一个硬结构」；L93 冲突以对位改写处理（L1–L118 零改动） |

## 📌 TL;DR

1. **批十八＝6 课（L119–L124）「同一个 to，两张脸」单拱**：立岗「习惯了」（L119 有 be 站着）→ 做的事穿名字版（L120 `-ing`，**名字版通行证第六站**）→ `get` 版慢慢习惯（L121）→ **脊柱课 L122 把 L93／L100 请回来并排切脸**（从前常 vs 习惯了）→ 否定与疑问（L123）→ 章末零新知收口（L124）；开 **season-18（{119,124}）＋m20（afterLesson 124）**，批量 124 课、133 案。
2. **选题＝真空白**：`be used to`／`get used to`／`got used to`／`be used to doing` 在 `grammarLessons.ts` 与 `huntCases.ts` **两文件逐形态全 0**（数析 §1.2 实读；瑞思 §1 ①／竞析 §0-6 独立复算一致），而 `used to`（从前常）已 **120 处／5 课**（L93 47·L100 48 为两大本营）＋**4 案 6 个错点**（HC #102 `:6172`／#103 `:6230`／#109 `:6480`／#110 `:6545`；另 `playing→play` 2 处 #102 `:6179`／#109 `:6487`）——**新章是在一座已封顶的房子旁边盖第二座，两座共用一根梁：`to`**（数析 洞察 2）。
3. **档位诚实标注＝A-（跨级）**：BC `Different uses of 'used to'` 标 **B1＋B2 双标**（一页三脸）、Murphy **中级 U61 独立单元**（标题逐字 `be/get used to… (I'm used to…)`）、Cambridge **三处落点／5 条明文 ❌**、中文侧 **两篇专文**（含明文负迁移 `She used to working late.`）——**位置够硬，但结构在 B1 段**，本批是「A2 关账之后走什么」的**B1 开局第一格**，**须按「跨级（B1 结构 / A2 词义）」口径对外表述**（竞析 §3.1 修正）。
4. **本批脊柱＝L93 冲突的对位改写**：L93 `:17362`（deepDive）明写「**to 后面永远穿原样**」，且 L93／L100 有 **3 处把 `used to + -ing` 设为错误答案**（`:17314`／`:17423`／`:18708`）。**裁决：不改前课一个字（L1–L118 零改动是硬红线）**，只在 L122 正面认领并**限定作用域**——首屏用 C（中文只差一个字）、deepDive 用 **A「看前面站谁」＋B「两个记号法」合写**、❌ 卡两条逐字对齐 Cambridge 与中文侧明文错例（§3）。
5. **中文负迁移打透两句**：`*I used to get up early.`（想说「我习惯了早起」却说成「我从前常早起」——**中文没有「有 be／没 be」这一层**）＝真错第一名，L119／L122 攻；`*I am used to get up early.`（带上 be 仍穿原样，Cambridge `Not: We are used to go …` 同型）＝第二名，L120／L122 攻。
6. **案件 6 案（#128–#133）**：4 错＝新 2＋旧 2、单 token 可修、≥1 净词、`reviewed: true`；罪名全落 **10 枚举**、**不碰 comparison**；旧错回流只取 **L10（昨天版）/L11（复数）/L19（was-were）/L25（三单）**；**本批 0 处 `fragment`／`run_on`**（避开批十五 #103、批十六 #111、批十七的连续同型，瑞思 §1 ⑪「不必勉强」）。
7. **G-boost 硬护栏**：每课 contrast **6 条中 ≥2 条为带 `wrongMark` 的真错卡（推荐 3，禁止贴线）**；`wrongMark` 不得为纯标点；**`guided.spot` 的 `wrongToken` 必须与 `tokens` 元素逐字相等（含尾标点）**——L96／L102 曾因 `"rain"` vs `"rain."` 致题目静默消失，本批逐课核对、不依赖 `cleanWord` 兜底。
8. **零术语红线（本批最危险的是「介词」二字）**：`be used to` 的 `to` 在语言学上就是介词，**竞品与中文侧资料全部直接用这个词**——**本批三字段（`grammarLabel`／`oneLineRule`／`summary.rule`）一律改写为「前面站谁／跟在谁后面／门牌／垫板／名字版」**，逐课自查（§5.3 替换表）。

## 🎯 核心结论卡片

| 项目 | 内容 |
|---|---|
| 推荐方案 | 6 课 L119–L124「同一个 to，两张脸」单拱：立岗 1 → 名字版 1 → get 版 1 → **对位切脸 1（脊柱）** → 否疑 1 → 零新知收口 1；6 案 #128–#133；开 season-18＋m20 |
| 优先级 | P1（内容生产批次）；无 P0 阻断项 |
| 预期影响 | **A2 关账后第一次跨级（B1 结构）**；把库内承载最重的单个结构（`used to` 族 120 处＋4 案）**正面收口成两张脸**；「名字版通行证」第六站（L42／L45／L64／L67／L77 之后）；兑现 L79 `:14704`「门牌家族来了新成员 next to」的带 to 门牌先例 |
| 资源需求 | ≈4 人日（内容 3＋展示层 0.25＋走查 0.5＋验收 0.25）；两段式跨 2 周 |
| 风险等级 | 中（① L93 话术对撞；② `-ing` 词汇底座窄：`working` 0／`walking` 0，`getting` 仅 2；③ 跨级；④ `used` 与 L113「感到版 -ed」同形的新干扰面；⑤ 封面图像语义未核） |
| 硬性范围红线 | 课量 6 不扩不缩至 8；一课一增量；L124 零新知；六段式；每课 1 案（4 错＝新 2＋旧 2、单 token 可修）；对比卡 6 条（**≥2 条带 wrongMark**）；零术语词表 29＋本批追加；comparison 不进案件；tagStats=10 不动；**L1–L118 一字不动**；番外 5 案冻结；covers 池内取（cover2–cover7） |

## §1 批次定位与选题裁决

### 1.1 产品负责人命题（A2 关账之后走什么——B1 开局）

批十七把 BC 官方 A1-A2 索引 18 课的**最后 4 处课程位空缺**（物主 `'s`／`-ed·-ing`／`few·a few`／`have got`）一次关账，并在批十七 PRD §7 Non-goals 里把 **`be/get used to` 明写为「列批十八首选」**（`prd-grammar-a2-closeout-2026-09-19.md` §1.2 裁决表：甲·B1 开局章 ❌ 不进批十七、**列批十八首选**）。批十八要正面回答的就是这一格：**A2 关账之后，第一个 B1 硬结构上哪一课、怎么上**。

**证据链（三研究一致）**：

| 判据 | 结论 | 出处 |
|---|---|---|
| 缺口真实性 | **真空白**——`be used to`／`get used to`／`got used to`／`be used to doing`／`using to` 两文件逐形态 **全 0**（非半曝、非认读垫子） | 瑞思 §1 ①；数析 §1.2／§1.3；竞析 §0-6 |
| 频率×痛感 | 高——「习惯了／慢慢习惯」是日常对话第一梯队话题；**中文「我习惯了」没有「有 be／没 be」这一层**，是天然负迁移面 | 瑞思 §2 T1／§5；竞析 §2 中文侧两篇专文 |
| 上游位置 | **B1-B2 官方课位**（BC 双标一页三脸＋明文警告「不得与 be/get used to + -ing 混」）＋**Murphy 中级 U61 独立单元**（标题即点名）＋**Cambridge 三处落点**（`used-to` 页／Common mistakes 专页／**`To` 页把 `be used`／`get used` 列进「介词 to」动词名单**） | 竞析 §1.1 BC-1/BC-2、§1.2 CAM-1/2/3、§1.3 |
| 我方接口 | **半现成且可当场降档**：`垫板`（L44 `:8065`／L108 `:20127`）＋`门牌`（L67 `:12363`／`:12380`，L79 `:14704` 已有带 `to` 的门牌先例 `next to`）＋`名字版`（L42 `:7678`／L64 `:11817`，五站打卡）＋`同一个词两张脸`（L104 `:19445` 等 5 例）——**四套现成，零新造术语**；竞析 §6-6 明确修正批十七「需新造一层句法」的判读：`be used to + 名字版` **是名字版通行证的第六站** | 瑞思 §1 ③；竞析 §3.1；数析 §1.7 |
| 唯一硬伤 | **话术对撞**：L93 `:17362` 明文「to 后面永远穿原样」＋ L93／L100 **3 处把 `-ing` 设成错误答案** | 数析 §1.4／§1.6；竞析 §5.1 |

**不排期（三研究一致，本批不复复议）**：`have sth done`（C 档：BC 三档 68 课零课位；招牌句四零件 `cut`／`hair`／`will have`／`'ll` **全库零**——数析 §1.3、竞析 §1.2 CAM-9）；形容词＋介词（**1/6 覆，除 `good at` 外八族全 0**，维持折卡）；`look + 形容词`（竞析升 B 档但**不独立成章**，留批十九——见 §8 Non-goals）；机制强化（732→759 项守门，无增量空间）。

### 1.2 三研究结论与主理人裁决

| 方案 | 三研究结论 | 主理人裁决 |
|---|---|---|
| **甲·`be/get used to` 6 课单拱（L119–L124）** | 瑞思 §0 **推荐**（真空白＋铺垫极厚＋零新术语即可开工）；竞析 §3 **A-**、「批十八首选」，并**升级证据到原文级**（BC 明文后接规则、Cambridge 三落点 5 条 ❌）；数析 §7 **推荐**（★★☆，6 课全新，cloze 12/12 可落） | **✅ 拍板：甲 6 课单拱** |
| 乙·`look + 形容词` 2–3 课 | 瑞思 §0 **备选**（14 处垫子全为 NPC 对白、无一作 target）；竞析 §3 **B 档**（升格成立但不独立成章）；数析 §7 「**留作批十九的开章首选**」 | ❌ 不进本批（**留批十九**） |
| 丙 形容词＋介词 1 课 | 瑞思 §2 T4「一课封顶或折卡」；竞析 §4.4「维持一课封顶或折卡」；数析 §7「**建议把丙折进甲的第 1–2 课**」 | ❌ 不单开课；**L119 折 1 张对照卡**（复用 L67 `:12363` 门牌话术，见 §2.2） |
| 丁 混合（甲 6＋乙 2＝8 课） | 瑞思 §3 判「乙的两课在甲的单拱里**没有落点**，硬拼即背双拱代价」；竞析 §4.3「**竞析不建议**」并列出双拱破例的三项代价 | ❌ 不做（**6 课不扩到 8**，见 §2.1） |
| `have sth done` | 竞析 §3 **C 档维持撤出**；数析 §1.3「零底座＝硬伤，不是估的」 | ❌ 维持撤出 |

**主理人另外三处拍板（写进本 PRD，不再论证）**：
1. **L93 的处置方式＝对位改写**（非「限定作用域」）——瑞思 §7 待裁 ① 建议「限定」，主理人裁 **对位改写**：把 L93／L100 的句子**请回来并排切脸**，但**不改前课一个字**（§3）。
2. **L122／L123 次序以裁决为准**（瑞思 §4 草案把「换人换搭档＋否定疑问」放 L122、对照放 L123）：本批次序＝**L119–L121 立三张脸 → L122 脊柱对位 → L123 否疑 → L124 收口**。理由：「两张脸切开」必须在教完前两张脸之后；且**否疑是 `be used to` 自己的语法点**（与 `used to` 的 `didn't use to` 正成对比——L93 `:17350`／`:17351` 已有原句），放在 L122 之后更顺。
3. **封面＝数析 §5 实算的最优指派**（cover2–cover7 贴 L119–L124，最小间距 117）；**生产时逐张目视核对图像语义**，不符者池内互换（§2.1）。

### 1.3 批次定位：单拱——一条「搬到新地方，慢慢习惯」线；档位 A-（跨级，诚实标注）

本批是**第六个大章节**，取**单拱**（判据沿用批十五起：单拱＝全批共享一条场景线；双拱＝两个话题不共享单锚）：

搬到新地方（L119 新住处／新学校的冷天，家里）→ 早上起床（L120 同一间屋）→ 新环境慢慢适应（L121 楼下新车棚）→ 回看从前的上学习惯（L122 校门口）→ 还没适应（L123 新学校）→ 收口（L124 书桌前）。**不跨场景跳**（`mansion`／`city`／`campus` 三值，**不引入新场景 id**——数析 §4 实读在用 11 种场景）。

**档位标注（诚实标注，本批纪律）**：

| 课 | 增量 | 跨源档 | 依据 |
|---|---|---|---|
| L119 | 「习惯了」第一张脸（`be used to` + 东西） | **A-（跨级）** | BC B1-B2 课位＋Murphy 中级 U61＋Cambridge 三落点；**结构在 B1 段** |
| L120 | 做的事穿名字版（`be used to` + `-ing`） | **A-（跨级）** | 同上；**名字版通行证第六站**（竞析 §3.1 修正：不是新造一层） |
| L121 | `get` 版：慢慢习惯起来 | **A-（跨级）** | BC 明文 "to talk about the **process**"＋Cambridge "We can also say get used to" |
| L122 | 两张脸并排切（**脊柱**） | **A-（上游最硬）** | BC `Past habits` 页**明文警告不得混**＋Cambridge `used-to` 页三连否定 ❌＋中文侧明文 ❌ |
| L123 | 否定与疑问（`not` 跟 be 走／be 搬句首） | **A-（跨级）** | Cambridge `used-to` 页否定疑问形＋BC 例句 `Are you used to the cold weather yet?` |
| L124 | 零新知收口 | **自研** | 收口先例 L54 `:9823`／L78 `:14362`／L94 `:17400`／L102 `:18919`／L110 `:20418`／L118 `:22040` |

> **对外口径（三研究一致要求）**：一律写「**跨级（B1 结构 / A2 词义）**」——**不得**简单说「B1 课」或「A2 课」。BC 双标（B1＋B2）、Cambridge 词典 `used to` phrase 标 **B1**、Murphy 落中级册、中文侧无 CEFR（竞析 §9 未核实 6）。
> **口令一句**：本批**不新造语言能力之外的东西**——四套话术（垫板／门牌／名字版／两张脸）全是库内既有资产，本批只做**认领 + 限定作用域**。

## §2 拆课方案与逐课规格

### 2.1 课量决策：6 课（L119–L124）——不扩到 8

**竞析 §4.1 容量账（裁决依据，逐条照抄）**：
- **三张脸的实质增量只够 3 课**：① `be used to`＋（东西／名字版）；② `get used to`（过程）；③ 否疑两式——**这三项各占一课即已一课一增量**；
- **第 4 课起靠合体与收口撑**：L122 对位切脸（合体 1）＋ L124 零新知收口 1，**迁移格并入 L121/L123 的场景换人换事**——即 **6 课里有 2 课是「非结构增量」**（合体 1＋收口 1，比竞析原估少 1 格，因为本裁决把「换人换搭档」并入 L122 的对照、把「迁移」并入 L123 的否疑场景）；
- **8 课会注水**：第 7、8 课只能在同一场景里继续换词（早起→熬夜→辣→地铁），**没有新结构可给，等于把一课一增量破在第 7 课**；
- **上游最大自然容量 3–4 格**：BC 一页三脸（它一页给完我方拆三课）、Murphy 一单元、Cambridge 词典把两张脸拆成 `phrase`（B1）＋`idiom`、中文 `used-to` 一篇给完三脸＋5 题、`habit-be-used-to` 一篇给七项——**我方按一课一增量安全扩到 6 课**（含合体／否疑／收口），**7 课以上无上游支撑**；
- **备选乙没有落点**：`look + 形容词` 属另一语义场（评价），与「同一个 to 的两张脸」不共享锚——硬拼即双拱（瑞思 §3 ⑦／竞析 §4.3「竞析不建议」）。

| 方案 | 取舍 | 裁决 |
|---|---|---|
| 4–5 课（砍 L123 或 L124） | 三张脸＋合体＋收口，砍否疑即把 `be used to` 的否疑永久留白（它和 `used to` 的 `didn't use to` 是天然对比材料，砍掉即丢一格独立增量） | ✗ |
| 7–8 课（甲 6＋乙 1–2） | 乙属另一语义场（评价），**在甲的单拱里没有落点**；第 7 课起无新结构 | ✗ |
| **6 课** | 立岗（L119）／名字版（L120）／get 版（L121）／**对位切脸（L122，脊柱）**／否疑（L123）／收口（L124）；**6 项独立、互不重叠，去掉任一项即掉到 5**（瑞思 §4「6 项校验」＋本裁决次序校正） | **✓ 拍板（主理人）** |

**课表（课注 id 已冻结）**：L119 `lesson-119-used-to-it`｜L120 `lesson-120-used-to-doing`｜L121 `lesson-121-get-used-to`｜L122 `lesson-122-two-faces`｜L123 `lesson-123-not-used-to`｜L124 `lesson-124-close-18`

**封面（数析 §5 实算 · 最优指派 · 池内复用）**：`L119←cover2`｜`L120←cover3`｜`L121←cover4`｜`L122←cover5`｜`L123←cover6`｜`L124←cover7`。
- **实算依据**（数析 §5.1–5.4）：工作区现有 **117 张图、118 次使用（单次 116／二用 1／三用 0）**；**唯一重复＝L118←cover1**（`:22046`）；批十七登记的「二用升三用 8 张」方案**未执行**（`cover29/42/25/7/2/3/4` 现各只用 1 次，全部退回池内）。
- **可用张＝`cover2`–`cover89`（88 张满足「三用后间距 ≥35」）**；最优指派 **min-gap＝117**（二分答案＋穷举：`118` 不可行；`min-gap=117` 前提下 max-sum 唯一解 **702**）。逐张：`cover2`（前次 L2 → 新用 L119）＝**117**；`cover3`（L3→L120）＝**117**；`cover4`＝117；`cover5`＝117；`cover6`＝117；`cover7`＝117。
- ❌ **`cover1` 禁用**（L1 `:144`＋L118 `:22046` 已用两次，三用天花板＝**1**）；❌ **`cover90`–`cover117` 本批禁用**（在 L124 的天花板 ≤34，低于 35 可用线；且 111–117 是批十七刚用的新图）。
- ⚠️ **生产时逐张目视核对图像语义**（数析 §5.5 注＋瑞思 §7 未核实 ③）：新课场景是**家里／学校／新地方**，`cover2`–`cover7` 是 L2–L7 的老插图（900×600 与 1024×682 两代并存），**画面须逐张确认相称**；不符者在 **cover2–cover89 共 88 张**内互换（min-gap 117 余量极大，重排不会掉线——数析 §5.5 注 1）。**兜底**：`cover` 在 `types.ts:590` 为可选字段（`cover?: string`），缺省回落 scene SVG——**语义不匹配不阻断上线**。

**episode 写法**：`小美的一天 一百一十九` … `一百二十四`（>100 已有 16 例先例＝L103「一百零三」…L118「一百一十八」，无格式风险；末课现为 L118 `:22044`「一百一十八」）。

**scene 取值**：本批一律取 `mansion`（家）／`city`（楼下）／`campus`（校门口／新学校），**不引入新场景 id**（数析 §4 实读在用 11 种）。

### 2.2 逐课规格

> **通用说明（6 课共同）**：六段＝① 看（情景讲解）→ ② 跟（guided：choose／arrange／spot／replace）→ ③ 忆（recall）→ ④ 练（practice ≥4 题）→ ⑤ 破（侦探挑战＝huntCaseIds）；本批 6 课**全部配 recall**（`grammarLessons.test.ts:68-79` 对 `number >= 13` 硬断言三字段非空）。所有 `examples`／`practice`／`variants`／`contrast`／`deepDive`／`summary` 字段名与形态沿用 `types.ts:580-618`。
> **全批话术纪律**：`be used to` 的 `to` **一律只说「前面站谁／跟在谁后面／门牌／垫板」**，**三字段（`grammarLabel`／`oneLineRule`／`summary.rule`）禁出现「介词」二字**（本批最易犯的禁用词，见 §5.3）；`used` 与 L113 `:21150`「感到版 -ed」的同形须**在 L119 显式切开**（瑞思 §1 ⑦ 新增干扰面）。

**L119 我习惯了（有 be 站着的那张脸）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-119-used-to-it`；`number: 119`；episode「小美的一天 一百一十九」；scene `mansion`；cover `cover2` |
| title / grammarLabel | 「我习惯了」/「习惯了 · 有 be 站着的那张脸」 |
| targetSentence | `I am used to the cold.`（6 词，≤8 ✓；**cloze 实跑落 `am`**——①语法承载词，本轮复刻抽词器实跑确认） |
| sceneSetupZh | 搬到新地方的头一个冷天：小美裹着外套说，她已经习惯了这份冷（**新住处／新学校的冷天**——场景线起点） |
| intentZh | 我习惯了这儿的冷天。 |
| 场景 | 家里：窗外冷，小美不缩脖子了——「这份冷，我习惯了」 |
| 新知识点 | **只有一件**：**used 前面站着 be（am／is／are）＝「习惯了」**——`I am used to the cold.`（后面跟的是**东西**：那份冷）。判据一句话：**看 used 前面有没有 be**——没有 be 是「从前常」（垫板脸，后面穿原样）；**有 be 是「习惯了」**（门牌脸，后面跟东西或名字版）。**本课不碰 `-ing`**（L120 才教名字版） |
| 一句话规则（oneLineRule） | 「说「我习惯了某样东西」：be 先站出来，再用 used to 接住它——I am used to the cold。**看 used 前面有没有 be**：没有 be 是「从前常」，有 be 是「习惯了」。」（**零术语自查：「介词」二字不得出现** ✓） |
| 对比卡 6 条方向 | ① `I used to the cold.` ❌（**wrongMark `used`**，missing_be——**本课头号错**：中文「我习惯了」里没有「是」，学生直接说 used；whyZh「英语这句要先站一个 am：I **am** used to the cold」）；② `I am use to the cold.` ❌（**wrongMark `use`**，verb_form——d 不能丢；**HC #102 `:6172`／#109 `:6480` 同型回流**）；③ `I am used to cold.` ❌（**wrongMark `cold`**，article——「这份大伙都知道的冷」要带 the：used to **the** cold；补词型，先例 `huntCases.ts:717` `"cake"→"a cake"`）；④ **双正解**：`I am used to the cold.` ✅ 并排 `She is used to the cold.` ✅（**换人不换规矩**，为 L122 的换人换搭档铺路；**diffScore 67 < 90 ✓**，本 PRD 实测）；⑤ **复习卡（L79 `:14637`）**：`My desk is next to the window.` ✅——**门牌家族里早有一位带 to 的成员**（L79 `:14704`「第 18 课三块老门牌 in/on/at…今天家族来了新成员：**next to**」——**这是 L79 自己指的方向**，今天认领它旁边那一位）；⑥ **同形隔离卡（L113 `:21150`）**：`I was tired.` ✅ 并排 `I am used to the cold.` ✅（whyZh「**同一个 -ed，两张脸**：tired 说的是「人心里什么感觉」；used 不表示感觉，它是 to 前面的固定搭档——**别把 I am used to it 读成「我感到用」**」） |
| 变体三态 | 肯定 `I am used to the cold.`（cloze 落 am）／否定 `I am not used to the cold.`（noteZh：「不」加在 am 后面——not 跟 be 走，**不请 don't**；L123 会专门教这一格）／疑问 `Are you used to the cold?`（noteZh：Are 搬句首，used to the cold 整块不动） |
| 复现题设计（practice ≥4） | 第 1 题 target＋变体逐字题（**取疑问变体 `Are you used to the cold?`**，`grammarLessons.test.ts:10` 硬断言）；**第 2 题保障句 `She is used to the cold.`**（cloze 实跑落 **is**——让主考点所在的门牌脸换个搭档再站一次）；第 3 题**短版复现**：`I am used to it.`（**案件 id `hunt-used-to-it` 的来源句**；whyZh「那份冷不用再说一遍——用一个 it 就够」）；第 4 题复现 L79 原句 `My desk is next to the window.`（带 to 门牌的老熟人）；第 5 题复现 L113 原句 `I am bored.`（**同形隔离**：感到版 vs 门牌前的搭档）。**每课 ≥1 复现题 ✓** |
| 案件规划 | `hunt-used-to-it`（#128，§7）；新错 **missing_be（漏 am）＋verb_form（use→used）**；旧错 tense（L10）＋plural（L11） |
| 六段要点 | ① 开场引 L79 `:14704`（门牌家族新员）＋L113 `:21150`（同一个 -ed 两张脸）；② guided：`choose`（`I ___ used to the cold.` 选项 `am`／`use`／`am use`）／`arrange` ≤6 token／**`spot`（`tokens: ["I", "used", "to", "the", "cold."]`，`wrongToken: "used"`——逐字相等；`answer: "used"`（与 wrongToken 同值，全库口径一致）；`correctionZh`「这句里 be 没站出来——补上 am：I 【am used】 to the cold。」）**／`replace`「把 I 换成 She」；③ recall 三字段（promptZh 给新地方冷天场景、intentZh「我习惯了这儿的冷天。」、answer＝target、noteZh「used 前面有 be——「习惯了」这张脸」）；④ practice 5 题；⑤ 破 `hunt-used-to-it` |
| 术语红线自查 | 用「看前面站谁／有 be 站着／门牌／固定搭档／东西」；**禁「介词」「形容词」「现在完成时」「被动」**（`used` 不是被动、不是完成时的 `used`——本课明写不展开） |
| 折卡（丙方案落点） | **L119 折 1 张对照卡**（竞析 §4.4＋数析 §7 建议）：对照卡 ⑤ 的 whyZh 同时引 **L67 `:12363`「at 是它的门牌，门里穿名字版」**与 **L79 `:14704`「门牌家族来了新成员：next to」**——**门牌话术在这里一次说清，不单开门牌课、不扩 `good at` 清单、不带 `interested in`** |

**L120 习惯了早起（做的事穿名字版）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-120-used-to-doing`；`number: 120`；episode「小美的一天 一百二十」；scene `mansion`；cover `cover3` |
| title / grammarLabel | 「习惯了早起」/「习惯了 · 做的事穿名字版」 |
| targetSentence | `I am used to getting up early.`（7 词，≤8 ✓；**cloze 实跑落 `am`**） |
| sceneSetupZh | 同一间屋的早晨：闹钟还没响小美就起来了——「早起这件事，我习惯了」（**接 L16 `:2884` `I have to get up early.` 的老场景**） |
| intentZh | 我习惯了早起。 |
| 场景 | 家里：早上床边——从「那份冷」说到「做的事」 |
| 新知识点 | **只有一件**：**做的事要穿名字版**——`I am used to getting up early.`（get up → **getting up**）。**复现 L42 `:7678`「动词要换名字版——read 变成 reading」、L64 `:11817`／`:11819`「名字版」、L67 `:12380`「门牌后面穿名字版」**——**名字版通行证第六站**（前五站：L42 like／L45 enjoy／L64 finish／L67 good at／L77 keep）。**不重讲 L42／L64 的 like／finish**，只放进新句型 |
| 一句话规则（oneLineRule） | 「习惯了「做的事」，这件事要穿名字版：`getting up early`——get 穿上 -ing，才能跟在 used to 后面。**第 42 课那张通行证，今天走进第六道门。**」（**零术语自查：「介词」「动名词」不得出现** ✓） |
| 对比卡 6 条方向 | ① `I am used to get up early.` ❌（**wrongMark `get`**，verb_form——**本课唯一考点头号错**；形状对齐 Cambridge `Not: We are used to go …`（竞析 §1.2 CAM-1），whyZh「做的事要穿名字版：getting——光板词进不了门」）；② `I used to getting up early.` ❌（**wrongMark `getting`**，missing_be——**漏了 be**：没有 be 站着，used to 是「从前常」那张脸（L93 `:17294`），后面轮不到名字版；whyZh 只给一条正解 `I am used to getting up early.`，**两张脸的对位留给 L122**）；③ `I am used to getting early up.` ❌（**wrongMark `early`**，word_order——「起床」是一块，early 站最后）；④ **双正解**：`I am used to getting up early.` ✅ 并排 `I am used to reading at night.` ✅（**换事不换规矩**：做的事都穿名字版；**diffScore 57 < 90 ✓**）；⑤ **复习卡（L42 `:7678`）**：`I like reading.` ✅——名字版的通行证；⑥ **让人版隔离卡（L113 `:21150`）**：`The book is boring.` ✅ 并排本课句（whyZh「**同一个 -ing，两张脸**：getting up 是「做的事」的名字；boring 说的是「它让人没劲」——**别把 getting up early 读成「让人早起」**」） |
| 变体三态 | 肯定 `I am used to getting up early.`（cloze 落 am）／否定 `I am not used to getting up early.`（noteZh：not 加在 am 后面）／疑问 `Are you used to getting up early?`（noteZh：Are 搬句首） |
| 复现题设计 | 第 1 题 target＋变体逐字题（取否定变体）；**第 2 题保障句 `She is used to getting up early.`**（cloze 实跑落 **is**）；第 3 题复现 L42 原句 `I like reading.`；第 4 题复现 L64 原句 `I finished reading the book.`（`grammarLessons.ts:11791`）；第 5 题复现 L16 原句 `I have to get up early.` |
| 案件规划 | `hunt-getting-up-early`（#129，§7）；新错 **verb_form（get→getting）＋word_order（early up→up early）**；旧错 sv_agreement（L25）＋plural（L11） |
| 六段要点 | ① 开场引 L42 `:7678`＋L67 `:12380`「门牌后面穿名字版」；② guided：`choose`（`I am used to ___ up early.` 选项 `getting`／`get`／`got`）／`arrange` ≤7 token／**`spot`（`tokens: ["I", "am", "used", "to", "get", "up", "early."]`，`wrongToken: "get"`——逐字相等；`answer: "get"`（与 wrongToken 同值）；`correctionZh`「做的事要穿名字版：get → 【getting】。」）**／`replace`「把 getting up early 换成 reading at night」；③ recall；④ practice 5 题；⑤ 破 `hunt-getting-up-early` |
| 术语红线自查 | 用「名字版／做的事／通行证／门」；**禁「介词」「动名词」「不定式」「非谓语」** |
| 走查观察点 | `-ing` 底座窄（数析 §1.7：`getting` 仅 2／`working` 0／`walking` 0）——**本课只用 `getting up`／`reading` 两个存量厚的说法**，不新造动词 |

**L121 慢慢就习惯了（`get` 版）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-121-get-used-to`；`number: 121`；episode「小美的一天 一百二十一」；scene `city`；cover `cover4` |
| title / grammarLabel | 「慢慢就习惯了」/「慢慢习惯 · get 站着的那张脸」 |
| targetSentence | `I am getting used to it.`（6 词，≤8 ✓；**cloze 实跑落 `am`**） |
| sceneSetupZh | 楼下新车棚：刚换的新车还有点不顺手，小美说「慢慢就习惯了」（**接 L115 `:21462` 同场景**） |
| intentZh | 我在慢慢习惯（这辆新车）。 |
| 场景 | 楼下：新车棚——从「还不顺手」到「习惯起来」 |
| 新知识点 | **只有一件**：**`get` 版＝「慢慢习惯起来」的过程**——`I am getting used to it.`（还在变、还没完全到）。**同一个 get 的第二张脸**（L108 `:20127` oneLineRule「家族里只有 get 垫一块小垫板：I got him to go with me」＝**说服他做**）；**不重讲 L108 的 `got him to`、不重讲 L115 的 `have got`** |
| 一句话规则（oneLineRule） | 「说「慢慢就习惯了」：把 be 换成 getting——`I am getting used to it.`**还在变、还没完全到**；说「已经习惯了」才是 `I am used to it.`。**同一个 get，两张脸**：这边的 getting 是「慢慢变」，那边的 got him to 是「费口舌把他说动」（第 108 课）。」（**零术语自查** ✓） |
| 对比卡 6 条方向 | ① `I get used to it.` ❌（**wrongMark `get`**，missing_be——**头号错**：「慢慢在变」的句子里 be 不能丢：I **am** getting used to it；中文「我慢慢习惯了」里没有「是」）；② `I am used to get it.` ❌（**wrongMark `get`**，verb_form——**同一个 get 两张脸混用**：这里的 get 是「慢慢习惯」那个动作，要穿名字版 **getting**）；③ `I am getting use to it.` ❌（**wrongMark `use`**，verb_form——d 不能丢，**L119／L120 同型复现**）；④ **双正解（同形切开）**：`I am getting used to it.` ✅ 并排 `I got him to go with me.` ✅（whyZh「**同一个 get，两张脸**：这边「慢慢习惯起来」，那边「费口舌把他说动」（第 108 课）」；**diffScore 25 < 90 ✓**）；⑤ **复习卡（L115 `:21462`）**：`I have got a new bike.` ✅——**同一个 get/got 的第三张脸**（「有」的轻口气版）；⑥ **复习卡（L119 短版）**：`I am used to it.` ✅ 并排本课句（whyZh「**已经习惯了** vs **正在慢慢习惯**：只差一个 getting」） |
| 变体三态 | 肯定 `I am getting used to it.`（cloze 落 am）／否定 `I am not getting used to it.`（noteZh：not 加在 am 后面）／疑问 `Are you getting used to it?`（noteZh：Are 搬句首） |
| 复现题设计 | 第 1 题 target＋变体逐字题；**第 2 题保障句 `She is getting used to it.`**（cloze 实跑落 **is**；换人不换规矩）；第 3 题复现 L119 原句 `I am used to the cold.`；第 4 题复现 L115 原句 `I have got a new bike.`；第 5 题**长版迁移句 `You will get used to it.`**（cloze 实跑落 **will**——把 get 版嵌进将来，练「慢慢会习惯」） |
| 案件规划 | `hunt-getting-used-to`（#130，§7）；新错 **missing_be（漏 am）＋verb_form（get→getting）**；旧错 tense（L10）＋plural（L11） |
| 六段要点 | ① 开场引 L108 `:20127`（同一个 get 两张脸）＋L115 `:21462`（新车棚场景）；② guided：`choose`（`I am ___ used to it.` 选项 `getting`／`get`／`got`）／`arrange` ≤6 token／**`spot`（`tokens: ["I", "get", "used", "to", "it."]`，`wrongToken: "get"`——逐字相等；`answer: "get"`（与 wrongToken 同值）；`correctionZh`「慢慢在变的句子里 be 不能丢：I 【am getting】 used to it。」）**／`replace`「把 I 换成 She」；③ recall；④ practice 5 题；⑤ 破 `hunt-getting-used-to` |
| 术语红线自查 | 用「慢慢变／已经到／费口舌把他说动／三张脸」；**禁「介词」「进行时」「时态」** |
| 走查观察点 | **`get` 版是否被感知为「跟 be 版一样」**（同义换挡风险，与批十七 `have got` 同型——瑞思 §7 假设 ③）：走查盯「学完仍只用 `I am used to it.`」的比率；**对比卡 ⑥ 已按「双正解并排」设计**（`I am used to it.` ✅／`I am getting used to it.` ✅，**diffScore 83 < 90 可用**——本 PRD 实测），兜底成本为零；**若走查命中「没必要学」，对比卡 ④ 增写一句「还在变、还没完全到」的口气提示** |

**L122 从前常，现在习惯了（脊柱课 · 两张脸并排切开）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-122-two-faces`；`number: 122`；episode「小美的一天 一百二十二」；scene `campus`；cover `cover5` |
| title / grammarLabel | 「从前常，现在习惯了」/「同一个 to，两张脸 · 看前面站谁」 |
| targetSentence | `I used to walk to school.`（6 词，≤8 ✓；**cloze 实跑落 `walk`**——①语法承载词；**逐字取 L93 `:17298` examples 原句 `We used to walk to school.` 的换人称版**，L93 `:17355` sceneSwings 同句） |
| sceneSetupZh | 新学校门口，小美看着上学的路：「从前我走路去上学」——回头看那条老路（**接 L87 `:16168` `You look cold.` 同款校门口场景**） |
| intentZh | 从前我走路去上学。 |
| 场景 | 校门口：同一条上学的路，一张脸说从前、一张脸说现在 |
| 新知识点 | **只有一件**：**同一个 to，两张脸切开**——`I used to walk to school.`（从前常，**没有 be**，后面穿原样）↔ `I am used to walking to school.`（现在习惯了，**有 am 站着**，后面穿名字版）。**本课不新教任何结构**——`used to` 是 L93／L100 的（120 处／4 案），`be used to` 是 L119–L121 的，**本课只把它们并排摆一次**（§3 专章，**三源逐字依据见 §3.3**） |
| 一句话规则（oneLineRule） | 「同一个 to，前面站谁它听谁的：前面站 used（从前的记号）→ 后面**穿原样**（I used to walk）；前面站 am／is／are／get（习惯记号）→ 后面**穿名字版**（I am used to walking）。**一个 to，两张脸。**」（**本批关键字段，零术语自查：「介词」「不定式」不得出现** ✓） |
| 对比卡 6 条方向 | ① `I used to walking to school.` ❌（**wrongMark `walking`**，verb_form——**本批头号错**：没有 be 站着，used to 只认原样；**逐字对齐 L93 `:17294`「后面跟原样」与 L93 `:17317`／L100 `:18644` 判词「不穿 -ing 外套」**；whyZh「这时候是「从前常」那张脸——后面穿原样 walk」）；② `I am used to walk to school.` ❌（**wrongMark `walk`**，verb_form——**对齐 Cambridge `Not: We are used to go …`**（竞析 §1.2 CAM-1）；whyZh「有 am 站着，这张 to 认名字版：walking——光板词进不了门」）；③ `I am used to walk to school now.` 的**疑问形错卡** `Do you used to walk to school?` ❌（**wrongMark `Do`**，word_order——**本课第三格**：问「习惯了」用 Are 搬句首（L123 正面教），不是 Do；**对照 L93 `:17351` `Did you use to play here?` 的正确形**）；④ **双正解（本批脊柱卡）**：`I used to walk to school.` ✅ 并排 `I am used to walking to school.` ✅（whyZh「**同一个 to，两张脸**：前面站 used＝从前常，后面穿原样；前面站 am＝习惯了，后面穿名字版。**看前面站谁**」；**diffScore 71 < 90 ✓**，本 PRD 实测）；⑤ **复习卡（L93 `:17298`）**：`We used to walk to school.` ✅（**前课原句一字不改地请回来**；whyZh「第 93 课那句老话——它没错，今天给它添上旁边那张脸」）；⑥ **复习卡（L100 `:18635` 所在课）**：`I used to play here every day.` ✅（L100 `:18616` target；whyZh「第 100 课那句：没有 be 的时候，「从前常」后面只能接原样」；**diffScore 50 < 90 ✓**） |
| 变体三态 | 肯定 `I used to walk to school.`（cloze 落 walk）／否定 `I didn't use to walk to school.`（noteZh：**「从前不常」用 didn't——这时 use 反而不带 d**，逐字取 L93 `:17350`）／疑问 `Did you use to walk to school?`（noteZh：**Did 搬句首**，逐字取 L93 `:17351` 的换动作版） |
| 复现题设计 | 第 1 题 target＋变体逐字题（取否定变体）；**第 2 题保障句 `She is used to working late.`**（cloze 实跑落 **is**——**中文侧 `habit-be-used-to` 明文 ❌ 的正解句**，竞析 §2 EC-2；同时是本批唯一用 `working` 的地方，**须在 whyZh 标注「working＝做的事的名字，第 120 课那张通行证」**）；第 3 题复现 L93 原句 `I used to play here.`（`grammarLessons.ts:17305` 区块所在课的 target，`:17289`）；第 4 题复现 L119 原句 `I am used to the cold.`；第 5 题复现 L120 原句 `I am used to getting up early.` |
| 案件规划 | `hunt-two-faces`（#131，§7）；新错 **verb_form（`used to walking`／`be used to walk` 混形）＋word_order（`Do you used to…`）**；旧错 tense（L10）＋plural（L11） |
| 六段要点 | ① 开场**跨课倒带**：第 93 课「to 后面穿原样」没错，今天把这句话**再补一格**（瑞思 §1 ④ 逐字话术方向）；② guided：`choose`（`I ___ walk to school.` 选项 `used to`／`am used to`／`use to`）／`arrange` ≤6 token／**`spot`（`tokens: ["I", "used", "to", "walking", "to", "school."]`，`wrongToken: "walking"`——逐字相等；`answer: "walking"`（与 wrongToken 同值）；`correctionZh`「没有 be 站着，这张 to 只认原样：【walk】。」）**／`replace`「把 used to walk 换成 am used to walking」；③ recall（promptZh 给校门口场景、intentZh「从前我走路去上学。」）；④ practice 5 题；⑤ 破 `hunt-two-faces` |
| 术语红线自查 | 用「前面站谁／两张脸／穿原样／穿名字版／记号」；**禁「介词」「不定式」「动名词」「分词」**——**本课是最容易写出「介词」二字的一课**（Cambridge `To` 页原文本就写 "To is a preposition"），**逐字自查三字段** |
| 本课定位说明（写进生产单） | **脊柱课但不是新知识课**：L122 的教学价值＝**冲突消解**（把用户在 L93 学的规则与 L119–L121 学的新脸并排一次），不是新增结构。**故 `grammarLabel` 不得写成新句型标签**（写作「同一个 to，两张脸 · 看前面站谁」，**不写「used to vs be used to」**——后者含英文术语式写法，与全批话术不统一） |
| 中段自走查点（本批最大未知） | 学生能否在 `I used to walk to school.` 与 `I am used to walking to school.` 之间**一次分清**（瑞思 §7 假设 ①）；**观察「L93 反向惩罚率」**——学完 L122 后重做 L93／L100 的旧题，`I used to playing here.` 是否仍被正确判错 |

**L123 我还不习惯（否定与疑问）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-123-not-used-to`；`number: 123`；episode「小美的一天 一百二十三」；scene `campus`；cover `cover6` |
| title / grammarLabel | 「我还不习惯」/「不习惯 · 不是 don't，是 am not」 |
| targetSentence | `I am not used to it yet.`（7 词，≤8 ✓；**cloze 实跑落 `am`**） |
| sceneSetupZh | 新学校第二天，小美说「这儿我还没习惯」——**「还不」用一个 yet 收尾**（场景线倒数第二格，与 L124 的「习惯了」正成对比） |
| intentZh | 这儿我还不习惯。 |
| 场景 | 新学校：还不顺手——否定的说法 |
| 新知识点 | **只有一件**：**`not` 跟 be 走（不请 do）；疑问把 be 搬句首**——`I am not used to it yet.`／`Are you used to it yet?`。**与 `used to` 的否疑正成对比**：`used to`（从前常）的否疑是 `didn't use to`／`Did you use to…?`（**L93 `:17350`／`:17351` 已教**，`d` 跟着前面的帮手走），而 `be used to`（习惯了）的否疑是 **`am not`／`Are you`**（be 自己动手）。**不重讲 L27 的疑问搬法、不重讲 L1 的 be 平台** |
| 一句话规则（oneLineRule） | 「「还不习惯」：**not 跟在 am 后面**——I am not used to it yet，**不用 don't**；问别人就把 **am／is／are 搬到句首**——Are you used to it yet？**两张脸的否定长得完全不一样**：从前常那张说 `didn't use to`（d 跟着帮手走），习惯了这张说 `am not used to`。」 |
| 对比卡 6 条方向 | ① `I don't used to it yet.` ❌（**wrongMark `don't`**，verb_form——**本课头号错**：中文「我不习惯」的「不」直译成 don't；whyZh「这句里站岗的是 am——「不」加在它后面：I am **not** used to it yet」）；② `Do you used to it yet?` ❌（**wrongMark `Do`**，word_order——疑问把 **Are** 搬句首，不是 Do；**L122 对比卡 ③ 的回流**）；③ `I am not used to it already.` ❌（**wrongMark `already`**，word_form→按 10 枚举落 **word_order**——「还不」用 **yet**，already 是「已经」；补词型，先例 `huntCases.ts:717`）；④ **双正解**：`I am not used to it yet.` ✅ 并排 `I am not used to the new school yet.` ✅（**换事不换规矩**：not 照样跟 am 走；**diffScore 56 < 90 ✓**）；⑤ **对照卡（L93 `:17350`／`:17351` 回流）**：`I didn't use to play here.` ✅ 并排 `I am not used to it yet.` ✅（whyZh「**两张脸的否定长得不一样**：从前常那张请帮手 didn't；习惯了这张 be 自己动手 am not——**句式完全不同，不能互相套**」；**diffScore 29 < 90 ✓**）；⑥ **复习卡（L1 `:155`）**：`I am not tired.` ✅——**not 跟在 am 后面**（第 1 课的老规矩，今天照样用） |
| 变体三态 | 肯定 `I am used to it now.`（**本课以否定为主考点**；noteZh「肯定版：现在是「已经习惯了」——now 收尾」）／否定 `I am not used to it yet.`（cloze 落 am）／疑问 `Are you used to it yet?`（noteZh：Are 搬句首；**逐字对齐 BC 原文例句 `How's Boston? Are you used to the cold weather yet?`**，竞析 §1.1 BC-1） |
| 复现题设计 | 第 1 题 target＋变体逐字题（取疑问变体）；**第 2 题保障句 `She is not used to it yet.`**（cloze 实跑落 **is**——换人不换规矩）；第 3 题复现 L93 原句 `Did you use to play here?`（**两张脸的疑问并排**）；第 4 题复现 L1 原句 `I am not tired.`；第 5 题复现 L119 原句 `I am used to the cold.`（肯定版对照） |
| 案件规划 | `hunt-not-used-to`（#132，§7）；新错 **verb_form（don't used to／am not use to）＋word_order（Do you used to…→Are you used to…）**；旧错 sv_agreement（L19 was/were）＋plural（L11） |
| 六段要点 | ① 开场引 L93 `:17350`／`:17351`（「从前常」的否疑长什么样——今天看「习惯了」的否疑）；② guided：`choose`（`I ___ used to it yet.` 选项 `am not`／`don't`／`not`）／`arrange` ≤7 token／**`spot`（`tokens: ["I", "don't", "used", "to", "it", "yet."]`，`wrongToken: "don't"`——逐字相等；`answer: "don't"`（与 wrongToken 同值）；`correctionZh`「not 要跟在 am 后面：【am not】 used to it yet。」）**／`replace`「把 I 换成 She」；③ recall；④ practice 5 题；⑤ 破 `hunt-not-used-to` |
| 术语红线自查 | 用「not 跟 be 走／搬句首／帮手／两张脸的否定」；**禁「否定句」「疑问句」「助动词」「介词」**（**注意：`grammarLabel`／`oneLineRule` 里不得出现「否定句」「疑问句」二字——本课标题最易踩**） |
| 词汇说明 | `yet` 在库内 **GL 0／HC 0**（本轮 python 实读；**`yet` 不在 cloze 词表内**）——**首次引入**，须在 whyZh 用大白话点一次：「**yet＝「还没」那口气，站句尾**」；不上重点、不单开卡 |

**L124 同一个 to，两张脸（收口 · 零新知）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-124-close-18`；`number: 124`；episode「小美的一天 一百二十四」；scene `mansion`；cover `cover7` |
| title / grammarLabel | 「同一个 to，两张脸（收口）」/「收口 · 零新知（六课排一行）」 |
| targetSentence | 复现混排（**五课各 1 句，逐句 ≤8 词**）：`I am used to the cold. I am used to getting up early. I am getting used to it. I used to walk to school. I am not used to it yet.`（cloze 按实跑登记：**`I am used to the cold.` 落 am**，逐句实跑、**避免全落同一词**；沿用批十七 L118 `:22040` 同构） |
| sceneSetupZh | 书桌前，把这章学过的几张脸摆一行，再添一张总表（**接 L117／L118 同场景**：同一张桌子把表填满） |
| intentZh | 这一章想说的，一次说完整。 |
| 新知识点 | **无——章末零新知**（收口先例 L54 `:9823`／L78 `:14362`／L94 `:17400`／L102 `:18919`／L110 `:20418`／L118 `:22040` 同构，**接口零字段新增**）；复现取材＝L119–L123 各 1 句＋总表卡；**不引番外 5 案**（`huntService.test.ts:215` 冻结名单） |
| 一句话规则（oneLineRule） | 「**同一个 to，两张脸**：有 be／get 站着＝「习惯了」（后面穿名字版或东西）；只有 used＝「从前常」（后面穿原样）。**看 used 前面站谁——认准一个就错不了。**」 |
| 对比卡 6 条方向 | ① `I am use to the cold.` ❌（**wrongMark `use`**，verb_form——L119 回流，**锚 #128**）；② `I am used to get up early.` ❌（**wrongMark `get`**，verb_form——L120 回流，**锚 #129**；**对齐 Cambridge `Not: We are used to go …`**）；③ `I used to walking to school.` ❌（**wrongMark `walking`**，verb_form——L122 回流，**锚 #131**；**对齐中文侧 `habit-be-used-to` 明文 ❌ `She used to working late.`**）；④ **总表卡（双正解 · 五句排一行）**：`I am used to the cold.` ✅／`I am used to getting up early.` ✅／`I am getting used to it.` ✅／`I used to walk to school.` ✅／`I am not used to it yet.` ✅——**五课的话一次收齐**（**diffScore 逐对实测：43／29／29／71，全部 < 90 ✓**）；⑤ **两脸并排卡（双正解）**：`I used to walk to school.` ✅ 并排 `I am used to walking to school.` ✅——**本章一句话的总结**（**diffScore 71 < 90 ✓**；**⚠️ 生产红线：不得写成 `I used to walk to school.` ↔ `I used to walk to school.` 或只差标点的版本——实测 ≥90 会被 `grammarBoostService.ts:750` 静默滤出双正解题池**）；⑥ **复习卡（L79 `:14637`）**：`My desk is next to the window.` ✅——**门牌家族那位带 to 的老成员**（本章开头的钩子，今天回头看它已经排进一大家子） |
| 变体三态 | 肯定 `I am used to the cold.`（收口课无主考点，按实跑登记）／否定 `I am not used to it yet.`（noteZh：not 跟 am 走）／疑问 `Are you used to it yet?`（noteZh：Are 搬句首） |
| 复现题设计 | guided 复现 L122 原句 `I am used to walking to school.`；practice 第 1 题 target＋变体逐字题；第 2 题复现 L119 原句 `I am used to the cold.`；第 3 题复现 L120 原句 `I am used to getting up early.`；第 4 题复现 L121 原句 `I am getting used to it.`；第 5 题复现 L122 原句 `I used to walk to school.`；第 6 题复现 L123 原句 `I am not used to it yet.`**（6 题齐全，逐题 ≤8 词）** |
| 案件规划 | `hunt-close-18`（#133，§7）；**全回流、不新增错型**；四点分别锚 #128／#129／#131／#132；**避开 fragment／run_on**；不引番外 5 案 |
| 六段要点 | ① 开场跨 5 课倒带（L119→L123 各回一句）；② guided：`choose`／`arrange` ≤6 token／**`spot`（`tokens: ["I", "used", "to", "walking", "to", "school."]`，`wrongToken: "walking"`——逐字相等；`answer: "walking"`（与 wrongToken 同值）；`correctionZh`「没有 be 站着，这张 to 只认原样：【walk】。」）**／`replace`「把 walk 换成 walking，前面那个词要怎么变」；③ recall；④ practice 6 题；⑤ 破 `hunt-close-18`；⑥ 总表卡（**m20 达成句同源**） |
| 术语红线自查 | 同前 5 课；**零新知课尤其禁止引入任何未教说法**（**不得**出现 `would`／`become used to`／`accustomed to`） |

## §3 关键冲突专章（本批脊柱）——L93「to 后面穿原样」的对位改写

### 3.1 冲突面清单（数析 §1.6 的 6 组 8 行，逐条列行号）

**实读结论：对撞面共 6 组（8 行）**——其中 **3 处把 `-ing` 写成「错误答案」**，是最硬的割接点（数析 §1.6 逐条实读）。

| # | 行号 | 字段 | 逐字原文 / 设计 | 冲突性质 |
|---|---|---|---|---|
| 1 | **L93 `:17362`** | `deepDive.paragraphs[1]` | 「后面跟原形：used to play（不穿 -ing、不穿 -ed）——跟 want to travel、Let me help 一个规矩：**to 后面永远穿原样**。」 | **最强表述（全库唯一挂在 `used to` 名下的「to 后面永远」）**——本批唯一必须正面回应的一行 |
| 2 | L93 `:17294` | `oneLineRule` | 「说「从前常这样、现在不这样了」用 used to——**后面跟原样**：I used to play here。」 | 同口径（**无「永远」字样**）；**不改** |
| 3 | L93 `:17314` | `contrast.wrong` | `wrong: "I used to playing here."` ＋ `:17317` 判词「used to 后面跟原形：play——**不穿 -ing 外套**（跟 want to travel 一个规矩）」 | **❌ 卡：把 `-ing` 设成错误答案（第 1 处·最硬）** |
| 4 | L93 `:17423` | `guided.replace.options` | `options: ["live in Beijing", "living in Beijing", "lived in Beijing"]`，answer `live in Beijing`——**`living in Beijing` 是明设干扰项**；`:17425` explain「used to 后面跟原形：live——**不穿 -ing、不穿 -ed**」 | **干扰项：把 `-ing` 设成错选项（第 2 处·最硬）** |
| 5 | **L100 `:18708`** | `guided.choose.options` | `options: ["used to play", "use to play", "used to playing"]`，answer `used to play` | **干扰项：把 `used to playing` 设成错选项（第 3 处·最硬）** |
| 6 | L100 `:18641` | `contrast.wrong` | `wrong: "I used to playing here every day."` ＋ `:18644` 判词「used to 后面跟原样：play——**它不认 -ing 外套**」 | ❌ 卡（与 L93 同型）；**L100 措辞强度低于 L93**（无「永远」字样） |
| 7 | L100 `:18710`／`:18717`／`:18752` | `guided.explain` | 「used to + 原样：d 不丢、外套不穿。」／「used to + 原样——说从前的常常。」／「used to 后面跟原样：read——「从前的常常」换个习惯照样说。」 | 同口径（**4 行**）；**可保留**——它们讲的是 `used to` 这颗「从前常」的 to（数析 §1.5 判读） |
| 8 | L44 `:8065`／L46 `:8443` | `contrast.whyZh` | 「**垫板 to 后面永远穿原样**：to buy——买东西说 buy，不说 buying。」／「**垫板 to 后面永远穿原样**：to travel——不写 traveling。」 | **旁证（不是冲突）**：说的是「垫板 to」（want to 家族），**与 `be used to` 无关**；本批**不动** |

**交叉印证（三源独立复算一致）**：瑞思 §1 ①（`be used to` 族逐形态 **全 0**）；竞析 §0-6／§8.4（两文件独立 `grep` 复算 **全 0**，`used to` 课文件计数 122 处）；数析 §1.2（四种形态全 0）＋§1.3（`using to` 0、`was used` 0、`got to` 与 `got used to` 不重叠）。
**冲突面的真实大小**（数析 §1.4／§1.5）：全库「to 后面永远穿原样」同义行共 **6 行**（`:2719`／`:2760`／`:2803` L15 want to、`:8065` L44、`:8443` L46、**`:17362` L93**）——**强烈版本只有 `:17362` 一行**，**割接成本可控**（数析 洞察 3）。

### 3.2 为什么不改前课（L1–L118 零改动红线）

1. **L93 的规则在它自己的地盘内是对的**（瑞思 §1 ③ 判读）：`:17362` 那句绑定的触发词是 `used to`（从前常）／`want to`／`Let me help`——**这些都是「后面穿原样」的真垫板**。它**从不对 `to` 本体下定义**（瑞思 §1 ②：全库 `穿原样` 类断言 163 处，**每一条都绑在具体触发词上**，只有 3 条说到了「to 后面永远」这一层）。→ **要补的是边界，不是纠错**。
2. **红线**：批十七红线为「L1–L110 零改动」，本批顺延为 **L1–L118 零改动**（瑞思 §7 待裁 ①：**「对位改写 L93」若改动前课一字即与红线冲突**——本裁决的「对位改写」＝**在 L122 里请回前课句子并排切脸**，**不是编辑 L93**）。
3. **上游的现成做法就是「不改近邻、只补边界」**：BC `Past habits` 页的处理方式是**点名对手 + 一句话定性 + 指路**（原文 "used to + infinitive **should not be confused with** be/get used to + -ing, which has a different meaning"，竞析 §5.2）；Cambridge `used-to` 页用**同页三段递进**（`Used to` → `Used to or would?` → `Used to or be used to?`）。**两源都不改旧页，只在新页里切开**。
4. **不改的收益**：① 旧题（L93 的 11 题 practice／6 条 guided／L100 同量）**一字不动、判分口径不变**；② `huntCases.ts` 里 **4 案 6 个错点**（#102 `:6172`／#103 `:6230`／#109 `:6480`／#110 `:6545`／#102 `:6179`／#109 `:6487`）**全部继续有效**——它们的正确答案（`used`／`play`）**在「从前常」那张脸里永远成立**；③ **改动前课会触发本批 G14 的零回归断言失败**（§6）。

### 3.3 L122 的话术定稿（A＋B＋C 三选项如何分配到首屏／deepDive／❌卡）

**竞析 §5.3 给三选项**：A「看前面站谁」（推荐）／B「两个记号法」／C「自然后果法」。**竞析意见：首屏用 C（BC 的对照句形状），deepDive 用 A＋B 合写**。**主理人裁决：采纳此分配**——即「**首屏用 C 的对照句形状，deepDive 用 A＋B 合写**」。

| 位置 | 选项 | 逐字稿（零术语改写，生产可直接抄） | 上游依据 |
|---|---|---|---|
| **首屏（C）** | **C · 自然后果法** | 「说『我从前常走路上学』和『我现在走惯了』——**中文只差一个字，英语换的不只是开头**：`I used to walk to school.`／`I am used to walking to school.`——**后面的走法也换了**。」 | BC `Different uses of 'used to'` 开篇设问（`I used to drive on the left` vs `I'm used to driving on the left`，竞析 §5.2） |
| **deepDive 段 ①（章题）** | 章题 | 「**同一个 to，两张脸**。」（**第 6 例**，沿用 L104 `:19445`／L106 `:19821`／L107 `:19983`／L113 `:21083`／L117 `:21909` 五例先例） | 库内既有话术（瑞思 §1 ③） |
| **deepDive 段 ②（A）** | **A · 看前面站谁** | 「同一个 to，**前面站谁它听谁的**：前面站 **used**（从前的记号）→ 后面**穿原样**（`I used to walk`）；前面站 **am／is／are／get**（习惯记号）→ 后面**穿名字版**（`I am used to walking`）。**一个 to，两张脸。**」 | Cambridge `To` 页「preposition vs to-infinitive」（原文 "To is a preposition. It is also used as part of the infinitive"＋"Some verbs are followed by the preposition to, including be used, get used"）＋ EC-2「有没有 be 动词＋后面接 V-ing 还是原形」 |
| **deepDive 段 ③（B）** | **B · 两个记号法** | 「**两个记号，认准一个就错不了**：有 **be／get 站着**，是「习惯了」——后面穿名字版；**只有 used**，是「从前常」——后面穿原样。**没有 be 的时候，used to 只能接原样。**」 | EC-2 明文（「差別就藏在兩個地方」）＋ Cambridge `used-to` 页 `Not: We are used to go …` |
| **deepDive 段 ④（冲突消解·**必写**）** | 对位认领 | 「第 93 课学过的 `used to` **没错**——它后面确实永远穿原样。今天把这句话**再补一格**：**used 前面站着 be（am／is／are／get），这个 to 换了一张脸**，后面要穿名字版。所以判据只有一条：**看 used 前面有没有 be**。」（**逐字取瑞思 §1 ④ 的话术方向**） | 瑞思 §1 ④（裁决给定）；BC 警告句形态 |
| **❌ 卡（2 条）** | 见 §3.4 | 见 §3.4 | Cambridge `used-to` 页三连否定＋EC-2 明文负迁移 |

**⚠️ 生产硬纪律**：① 上述 A／B／C **三处话术各自独立可读**（不得互相引用「上面那条」）；② **首屏（C）只用对照句 + 一句定性**（抄 BC「look similar but they have very different uses」的形状，**不解释为什么**——解释放 deepDive）；③ deepDive 段 ④ **必须写**（这是本批「对位改写」的落点，缺它则 L122 退化为普通对照课）；④ **全字段禁止出现「介词」「不定式」「宾语」「表语」**——Cambridge `To` 页的原文话术**只可意译，不可直抄**（竞析 §5.2 明确「中文侧直接把『介系詞／不定詞』摆上桌；我方首屏三字段禁『介词』二字」）。

### 3.4 L122 的两条 ❌ 卡逐字稿

**❌ 卡 ①（抄中文侧 `habit-be-used-to` 明文错例 —— 竞析 §2 EC-2 逐字复核）**

**定稿版（生产直接采用；`correct` 单值，第二正解写进 `whyZh`）**

```
wrong:     "She used to working late."
wrongMark: "working"
correct:   "She is used to working late."
bothRight: false
whyZh:     "加不加 be，是两张脸：有 be 是「习惯了」——She is used to working late；
            没 be 是「从前常」——She used to work late（后面穿原样）。
            错在这句两头都占：既没有 be，又穿了名字版。"
```

**❌ 卡 ②（抄 Cambridge `Not: We are used to go …` 的形状 —— 竞析 §1.2 CAM-1）**

```
wrong:     "I am used to get up early."
wrongMark: "get"
correct:   "I am used to getting up early."
bothRight: false
whyZh:     "这个 to 前面站的是 am——它认名字版：getting。
            （光板词 get 进不了门——第 42 课那张通行证，今天走进第六道门。）"
```

**❌ 卡 ① 的「两个正解」处理依据**：竞析 §5.3 要求「**两张脸各给一个正解**」（① `She is used to working late.`／② `She used to work late.`）。**`contrast.correct` 是单值字段**（本轮 python 全库逐条实读：**无「／」并写先例**），故 **`correct` 取「习惯了」那张脸的 `She is used to working late.`**（与 L122 主题一致），**第二正解 `She used to work late.` 写进 `whyZh`**（上方定稿版已体现）。

**❌ 卡 ② 与 L93 `:17314` 的关系（须写进生产单）**：两条 ❌ 卡**形状同型、方向相反**——L93 `:17314` 是「没 be 却穿了名字版 → 改回原样」（**继续有效、不改**）；L122 ❌ 卡 ② 是「有 be 却穿了原样 → 改成名字版」（**本批新增**）。**教学上这是一对镜子的两面**：**判据永远是同一条——看 used 前面有没有 be**。

## §4 中文负迁移处理专章（逐课）

> **来源**：瑞思 `user-research-grammar-eighteenth-batch-2026-09-19.md` §5 中文负迁移专项（逐课表）＋竞析 §2 中文侧 english.cool 实证（`used-to`／`habit-be-used-to`／`look-forward-to` 三篇）。

| 课 | 干扰（中文思维） | 中文侧依据（竞析 §2） | 典型中式错句 | 承载罪名 | 设计含义（本课怎么接） |
|---|---|---|---|---|---|
| **L119** | **中文「我习惯了」里没有「是」**——学生直接说 `used`，不带 be | `habit-be-used-to`：「想表達『習慣某事』**一定要有 be 動詞**、後面接 V-ing」 | `*I used to the cold.` | **missing_be** | **本课头号错**：判据前置到 opening——**看 used 前面有没有 be**；对比卡 ① 单打 |
| **L119** | 中文「习惯了」与「从前常」在中文里靠上下文分，**英语靠 be 的有无分** | `habit-be-used-to`：「差別就藏在兩個地方：**有沒有 be 動詞**，還有後面接 V-ing 還是原形動詞」 | `*I used to get up early.`（想说「我习惯了早起」，说成「我从前常早起」） | **verb_form** | **本批真错第一名**（瑞思 §5 明写）：L119 opening 一句话判据 + L122 并排切开；**至少 3 条对比卡围绕它**（L119 ①／L122 ①④） |
| **L119** | 中文「冷」不加「这／那」——学生说 `to cold` | 中文侧无直接错例（`used-to` 专文有 `be used to + N.` 形式说明） | `*I am used to cold.` | **article** | 复用 L3 `:442`「一个东西前面要有 a」的反面：**大伙都知道的那份冷，用 the**；对比卡 ③ |
| **L120** | 中文「早起」是一个词，学生不带 -ing | `habit-be-used-to` 明文（「後面接 V-ing」）；`used-to` 专文（「be used to 的 to 是介系詞，後面的字須為名詞的形式」） | `*I am used to get up early.` | **verb_form** | **第二名**（瑞思 §5 明写）：L120 对比卡 ① 单打 + L122 ❌ 卡 ② 收口；话术＝「做的事要穿名字版」 |
| **L120** | 中文「我习惯了早起」没有「有 be」这一层，容易说出 `*I used to getting up early.` | 同上（`used-to` 专文：「沒有 be 動詞的 used to 後面只能接原形動詞，而且意思會變成『以前都⋯』」） | `*I used to getting up early.` | **missing_be** | L120 对比卡 ②；**但两张脸的完整对位留给 L122**（L120 只给一条正解，不展开） |
| **L121** | 中文「我慢慢习惯了」同样没有 be——学生说 `*I get used to it.` | BC 明文 "to talk about the **process**"；Cambridge「We can also say **get used to**」 | `*I get used to it.` | **missing_be** | 「慢慢在变」的句子里 be 不能丢：I **am** getting used to it；对比卡 ① |
| **L121** | **同一个 get 的几张脸混用**（got him to／have got／getting used to） | Cambridge `get` 页把 `get + 形容词`／`get sth done`／`get sb to do` 并列（竞析 §1.2 CAM-11） | `*I am used to get it.`（本想说「慢慢习惯它」） | **verb_form** | 对比卡 ④ 双正解并排（`I am getting used to it.` ＋ `I got him to go with me.`）＋对比卡 ⑤（`have got` 第三张脸） |
| **L122** | **看到 to 就接原形（反射动作）**——与 L93 建立的「to 后面穿原样」直接勾连 | `look-forward-to` 专文：「很多人**一看到 to 就會反射動作加上原形動詞**」；`habit-be-used-to` 明文 ❌ `She used to working late.` | `*I am used to walk to school.` | **verb_form** | **本课核心**：❌ 卡 ②（抄 Cambridge `Not:` 形状）＋deepDive 段 ④（对位认领） |
| **L122** | **反向反射**：学了 be used to 后，把「从前常」也说成 `used to walking` | 同上（两句明文错例指向两个方向） | `*I used to walking to school.` | **verb_form** | ❌ 卡 ①（抄 EC-2 明文）+ 对比卡 ①；**这是「反向惩罚」的风险点**（走查观察项，§2.2 L122 末行） |
| **L123** | 中文「我不习惯」的「不」直译成 `don't` | `used-to` 专文有 `didn't use to` 的否定说明（「**一旦用了 do 助動詞**，used to 就要改成 use to」）——中文学习者容易把两张脸的否疑互换 | `*I don't used to it yet.`／`*Do you used to it yet?` | **verb_form**／**word_order** | **两张脸的否疑长得完全不一样**：从前常说 `didn't use to`（L93 `:17350`），习惯了说 `am not used to`（be 自己动手）；对比卡 ①／②／⑤ |
| **L124** | 混排（`use→used` 漏 d／漏 be／`used to + -ing` 混形） | —— | 三型混出 | 全落 10 枚举 | **零新知**：三点分别锚 #128／#130／#131 |

**须写进规格的两条**（瑞思 §5 末段逐字要求）：
1. **`*I used to get up early.`（该说「我习惯了」却说成「我从前常」）是「真错」第一名**——中文没有「有 be／没 be」这一层区分；**L119 的 6 条对比卡里至少 3 条围绕它**（本 PRD 落 L119 ①／L119 ④／L122 ①／L122 ④ 四处）——**含 `*She used to working late.` 这句专文明文负迁移**（落 L122 ❌ 卡 ①）。
2. **第二名是 `*I am used to get up early.`**（带上 be 仍穿原样）——**L120 的对比卡围绕它**（本 PRD 落 L120 ①／L122 ❌ 卡 ②）。

## §5 叙事设计专章

### 5.1 叙事草案（逐字采用）

> **「我慢慢习惯了——同一个 to，两张脸。」**
> 我习惯了这儿的冷：I am used to the cold.（第 119 课，**used 前面站着一个 am——「习惯了」这张脸第一次露出来**）→ 我习惯了早起：I am used to getting up early.（第 120 课，**做的事要穿名字版——第 42 课那张通行证，今天走进第六道门**）→ 我在慢慢习惯：I am getting used to it.（第 121 课，**把 be 换成 getting——还在变、还没完全到**）→ 从前我走路去上学：I used to walk to school.（第 122 课，**第 93 课、第 100 课那句老话请回来，跟新脸并排摆一次——看 used 前面站谁**）→ 这儿我还不习惯：I am not used to it yet.（第 123 课，**not 跟 am 走，不请 don't**）。
> 收住：六课排一行——习惯了（有 be 站着）／从前常（只有 used）。（第 124 课收口）

### 5.2 复用体系（不造新术语——四套全是既有资产）

| 话术 | 出处（行号） | 本批怎么用 |
|---|---|---|
| **垫板 to** | L15 `:2696`／L44 `:8035`／**L108 `:20127`**「家族里只有 get 垫一块小垫板」 | 本批要切的「旧脸」（从前常那张）；L121 用 L108 切开同一个 get |
| **门牌** | L67 `:12363`「**at 是它的门牌，门里穿名字版**」／`:12380`「门牌后面穿名字版」／**L79 `:14704`「第 18 课三块老门牌 in/on/at…今天家族来了新成员：next to」** | **本批要认的「新脸」**；**L79 已有带 `to` 的门牌先例**——L119 认领「`used to` 的 to 也是门牌脸」是同血统的一步（**这是 L79 自己指的方向**） |
| **名字版** | L42 `:7678`「动词要换名字版——read 变成 reading」／L64 `:11796`／`:11819`／L67 `:12380` | L120 的落点（**第六站**）；**不重讲**，只放进新句型 |
| **同一个词，两张脸** | L104 `:19445`／L106 `:19821`／L107 `:19983`／L113 `:21083`／L117 `:21909`（**5 例先例**） | 章题直接沿用（**第 6 例**） |
| **固定搭档** | L1 `:155`「I am 是一对固定搭档」 | L119 漏 be（`*I used to the cold.`）时的话术 |
| **换人换形** | L25 `:4528`「他、她、它做事，动词后面要加个小尾巴 -s」 | L122 换人不换规矩（`She is used to…`）＋**#129 案旧错回流**（`He drink milk every day.` → `drinks`） |
| **搬句首** | L27 `:4887`「问句 Is/Are 搬句首」（L1 `:208`／`:362` 先例） | L123 的疑问格 |
| **昨天版** | L10 `:1782`「看到 yesterday，动词就要换形状」 | 旧错回流的统一话术（4 案） |
| **收口传统** | L54 `:9823`／L78 `:14362`／L94 `:17400`／L102 `:18919`／L110 `:20418`／L118 `:22040`（**六代先例**） | L124 同构 |
| **跨批钩子兑现** | L79 `:14704` → L119；L42 `:7678`／L67 `:12380` → L120；**L108 `:20127`** → L121；**L93 `:17294`／`:17298`／L100 `:18616`** → L122（**前课原句回流，一字不改**）；L93 `:17350`／`:17351` → L123；L1 `:155`／L79 `:14637` → L124 | 全批钩子（**第五次跨批承诺兑现**，瑞思 §6-3） |

### 5.3 禁用词表（本批生产禁出现）

**零术语红线**（`grammarLessons.test.ts:110/119/128` 逐字断言，作用域＝`grammarLabel`／`oneLineRule`／`summary.rule` 三字段；共享常量 `src/data/grammarZeroTerms.ts:18-24` 本轮实读＝**29 词**）：主语、谓语、宾语、表语、定语、状语、单数、复数、三单、原形、时态、一般过去时、一般现在时、现在进行时、过去进行时、现在完成时、情态动词、比较级、最高级、从句、语序、可数、疑问句、否定句、被动语态、第三人称、形容词、副词、**介词**。

> ⚠️ **本批最危险的禁用词是三处**（逐课自查）：
> - **「介词」**——`be used to` 的 `to` 在语言学上就是介词，**竞品与中文侧资料全部直接用这个词**（Cambridge `To` 页 "To is a preposition"、`look forward to` 页 "The 'to' in look forward to is a preposition"、中文 `used-to` 专文「be used to 的 to 是介系詞」、`look-forward-to` 专文「look forward to 的 to 是介系詞」）——**一律改写成「前面站谁／跟在谁后面／门牌／垫板」**（§3.3 三选项话术已是零术语成品）。
> - **「形容词」**——L119 的 `the cold` 会被自然描述成「形容词」，**改写为「那份冷」「东西」**。
> - **「疑问句」「否定句」**——L123 整课讲否疑，**三字段一律写「问别人就把 am／is／are 搬到句首」「not 跟在 am 后面」**。

**本批额外禁用**（非测试覆盖，但同属零术语纪律，生产自查）：不定式、动名词、分词、过去分词、现在分词、助动词、系动词、非谓语、词性、主谓一致、宾语补足语、双宾语、及物、不及物。

**替换体系（沿用课程既有话术＋本批新增）**：

| 禁词概念 | 本批替换说法 | 出处 |
|---|---|---|
| **介词 to** | 「**看 used 前面站谁**：前面站 used → 后面穿原样；前面站 am／is／are／get → 后面穿名字版」 | 本批新增（L122，竞析 §5.3 选项 A） |
| 不定式 to | 「**垫板 to**」（站在两个动作中间） | L15 `:2696`／L44 `:8035`／L108 `:20127` |
| 介词短语 | 「**门牌**」＋「门牌后面穿名字版」 | L67 `:12363`／`:12380`／L79 `:14704` |
| 动名词 / -ing 形式 | 「**名字版**」 | L42 `:7678`／L64 `:11796`／L67 `:12380` |
| 形容词（`the cold`） | 「**东西**」「那份冷」 | 本批新增（L119） |
| 形容词（`-ed` 形） | 「**感到版**」「固定搭档」 | L113 `:21150`＋本批（L119 同形隔离卡） |
| 疑问句 / 否定句 | 「**搬句首**」「**not 跟在 am 后面**」「不请 don't」 | L27 `:4887`／L1 `:208`／本批（L123） |
| 时态 / 一般过去时 | 「**昨天版**」 | L10 `:1782` |
| 一般现在时的习惯 | 「**现在的常常**」 | L28 `:5256` 一线 |
| 第三人称单数 | 「**他/她/它加个小尾巴**」「换人换形」 | L25 `:4528` |

## §6 验收标准

### 6.1 检查清单（G1–G15，逐条可勾）

- [ ] **G1 课程数据**：practice **≥4 题**且**含一道与 variants 逐字一致的否定或疑问变体题**（`grammarLessons.test.ts:10` 硬断言）；本批逐课列出——L119 `Are you used to the cold?`｜L120 `I am not used to getting up early.`｜L121 `Are you getting used to it?`｜L122 `I didn't use to walk to school.`｜L123 `Are you used to it yet?`｜L124 `Are you used to it yet?`
- [ ] **G1-b 复现题**：**每课 ≥1 复现题**（跨课原句回流）；本批逐课复现配置——L119 复现 L79／L113；L120 复现 L42／L64／L16；L121 复现 L119／L115；**L122 复现 L93／L100／L119／L120（本批复现最重的一课）**；L123 复现 L93／L1／L119；L124 六句复现（L119–L123 各 1 句＋总表）
- [ ] **G2 tokens／answer 词集一致＋distractors 不与答案词重复**（`grammarLessons.test.ts:30`／`:51` 硬断言）；**arrange／practice 展示序 ≠ 答案序**（`shuffleWithSeed` 保证同序时交换首尾）
- [ ] **G2-b 零术语红线**：**29 词**（`grammarZeroTerms.ts:18-24` 逐字实读：主语/谓语/宾语/表语/定语/状语/单数/复数/三单/原形/时态/一般过去时/一般现在时/现在进行时/过去进行时/现在完成时/情态动词/比较级/最高级/从句/语序/可数/疑问句/否定句/被动语态/第三人称/形容词/副词/介词）——**三字段（`grammarLabel`／`oneLineRule`／`summary.rule`）逐课自查**；**本批特别核「介词」「形容词」「疑问句」「否定句」四个高危词 0 命中**（§5.3 三道醒目标注）；§5.3 替换体系逐条对照
- [ ] **G3 recall 三字段非空**（`promptZh`／`intentZh`／`answer`；`grammarLessons.test.ts:68-79` 对 `number >= 13` 硬断言）
- [ ] **G4 目标句 ≤8 词＋一课一增量**：L119 6／L120 7／L121 6／L122 6／L123 7／L124 复现混排**逐句 ≤8 词**；§2.2 每课「新知识点」只列一件（**L122 是唯一例外：它的「新知识点」是冲突消解，不新增结构**——已在 §2.2 该课「本课定位说明」写明）
- [ ] **G5 罪名枚举**：6 案 tag **全落 10 枚举**（`huntService.ts:331-342` 实读：tense／sv_agreement／missing_be／article／plural／preposition／fragment／run_on／word_order／verb_form）；**不碰 comparison**（`types.ts:419-430` 存在但 `GRAMMAR_ERROR_TAGS` 不含它、`huntCases.ts` 实读 **0 处**）；**本批 0 处 `fragment`／`run_on`**（避开批十五 #103、批十六 #111、批十七 #120–#127 的连续同型——瑞思 §1 ⑪「甲的结构天然不落这两型，若强加即为凑型，我不建议」）
- [ ] **G6 案件结构**：每案 **4 错＝新错 2＋旧错 2**、**单 token 可修**、**≥1 净词**（`tokens.length > errors.length`）、`reviewed: true`、`tokenIndex` 与 `tokens` 对齐、`number` 连续（**#128–#133**）；旧错**只取 L10（`:1782` 昨天版）／L11（`:1964` 复数）／L19（`:3423` was-were 那一课）／L25（`:4528` 三单）**，禁引入未教材料
- [ ] **G7 tagStats=10 不动**（`huntService.test.ts:109` 断言 `toHaveLength(10)`）；**番外 5 案冻结**（`huntService.test.ts:215` 逐名单断言 `hunt-white-cat`／`hunt-sports-day`／`hunt-pen-pal-letter`／`hunt-fridge-note`／`hunt-term-review`——**新案不得替代或删改**）
- [ ] **G8 展示层硬需求**：
  - `grammarSeasons.ts`（现有 17 季，末项 season-17 在 `:52`）追加：`{ id: "season-18", label: "第十八季 · 同一个 to，两张脸", hint: "习惯了（be used to）、慢慢习惯（get used to）、从前常（used to）——同一个 to，前面有 be 是一张脸，没 be 是另一张", min: 119, max: 124 }`
  - `GrammarPathPage.tsx` CAN_DO_MILESTONES 在 m19（`:246-252`，19 项后新增第 20 项）后追加 **m20（afterLesson 124）**：`{ id: "can-do-m20", afterLesson: 124, title: "我能说清「习惯了」", zh: "我习惯了（有 be 站着）+ 做的事穿名字版（getting up）+ 慢慢在习惯（getting）+ 从前常（used to）+ 还不习惯（am not … yet）——同一个 to 的两张脸，你能说得清清楚楚。", samples: ["I am used to the cold.", "I am getting used to it.", "Are you used to it yet?"] }`
- [ ] **G8-b 守门测试**：`grammarSeasons.test.ts` **4 项全绿**——① 每课号落区间（119–124 覆盖，`:12`）；② 区间互不重叠（`min:119 > max:118`，`:22`）；③ `label`／`hint` 非空（`:36`）；④ 最高课号 124 落区间（`:43`）。**不落 season-18 则第 ①④ 项先红**（不会静默过滤）。**m20 全仓无测试引用（纯纪律项，`GrammarPathPage.tsx:246` 实读）——须人工核**
- [ ] **G9 orphans 纪律**：6 个新案（#128–#133）**全部被 L119–L124 引用**（`huntCaseIds`），**不新增未引用案**（引号案数 127→133、全部 `reviewed: true`）
- [ ] **G10 episode 写法**：L119–L124 全部汉字数字（「一百一十九」…「一百二十四」；>100 已有 16 例先例 L103–L118）
- [ ] **G11 语料锁闭集**：L119 **只做「有 be＝习惯了」这一条判据**（**不碰 -ing**）；L120 **只做「做的事穿名字版」**（**不重讲 L42／L64 的 like／finish**）；L121 **只做 `get` 版过程义**（**不重讲 L108 的 got him to／L115 的 have got**）；L122 **只做两张脸并排**（**不新教结构**）；L123 **只做否疑**（**不重讲 L27 搬法／L1 be 平台**）；L124 **零新知**。**全批不引入**：`have sth done`／`look + 形容词`／`look like`／`would` 过去习惯／`not until`／双重所有格／`accustomed to`／`become used to`（越段内容一律冻结）
- [ ] **G12 cloze 逐课核验**（数析 §3 实跑结论＋本 PRD 以**逐字复刻抽词器**独立复跑）：
  - **词表状态（实读 `grammarAmbushService.ts:160-187`，145 词；**注意本行指 ambush 通道，boost 通道口径不同，见下条**）**：`am`／`is`／`are`／`will`／`get`／`walk`／`play`／`have`／`has` **IN**；**`used`／`getting`／`working`／`walking`／`yet`／`early`／`cold` 全部 OUT**（本轮逐字实测；⚠️ 口径：这七个词**不在语法承载词表内**——`early`／`cold` 这类实词仍可能被第 ② 档「退实词」规则抽中，**但本批 6 句主句全部在第 ① 档即命中**，走不到 ② 档）。
  - **逐课落点**：L119 `I am used to the cold.` → ①落 **am**；L120 `I am used to getting up early.` → ①落 **am**；L121 `I am getting used to it.` → ①落 **am**；L122 `I used to walk to school.` → ①落 **walk**；L123 `I am not used to it yet.` → ①落 **am**；L124 五句 → `I am used to the cold.` 落 **am**／`I used to walk to school.` 落 **walk**／其余逐句实跑登记，**避免全落同一词**。
  - **保障句（每课 ≥1，让主考点不落空）**：L119 `She is used to the cold.`（落 **is**）／L120 `She is used to getting up early.`（落 **is**）／L121 `She is getting used to it.`（落 **is**）／L122 `She is used to working late.`（落 **is**——**`working` OUT，靠 is 承载空位**）／L123 `She is not used to it yet.`（落 **is**）／L124 逐句登记。以上**六句全部本轮逐字复跑确认落 ① 档**。
  - **⚠️ 已知死角（数析 §3.3，必写进生产单）**：`to`（**2 字母**）**在 boost 档 1 永不落空位**（`grammarBoostService.ts:248-257` 的 `clean.length >= 3` 硬门＋`FUNCTION_WORDS` 含 `to`）；`get used to` 的考点词在 boost 通道**只能落在 `used`／`getting`**（`used` 长度 4、`getting` 长度 7，均过 `clean.length >= 3` 门且不在 `FUNCTION_WORDS` 33 词内——**数析 §3.2 实跑：`I am used to getting up early.` 的 boost 可落词位＝`used`／`getting`／`early`**）。→ **「`to` 后面接什么」这个核心新知识在 boost 通道只以 `used`／`getting` 的形态被考到，须靠 ambush 与课程对比卡补足**（数析 §3.3 原话）。
  - **逐课须核「variants 至少 1 句让主考点落空」**（沿用批十六/十七 §6-3 纪律）。
- [ ] **G-boost（硬护栏）**：
  - **每课 contrast 6 条中至少 2 条为「带 `wrongMark` 的真实错卡」**（口径：`wrongMark` 非空、非 bothRight、字面词能在 wrong 句里定位；`grammarBoostService.ts:700-737` 实读）；**推荐 3 条；禁止贴线**（`grammarBoostService.test.ts:161` 全库逐课断言 `thin === []`；当前最低 11 课只有 2 道，贴线）。**本批逐课 3 条**（逐课方向见 §2.2 各课「对比卡 6 条方向」；全部 18 个 wrongMark 均含字母）。
  - **`wrongMark` 不得为纯标点**（`grammarBoostService.test.ts:199` 断言；L89 `"?"` 已修为 `"day?"` 的前车之鉴）。**本批 6 课全部 18 个 wrongMark 均含字母**（`used`／`use`／`cold`／`get`／`getting`／`early`／`walk`／`walking`／`Do`／`don't`／`already`／`the`／…）。
  - **`guided.spot` 的 `wrongToken` 必须与 `tokens` 元素逐字相等（含尾标点写法一致）**——L96／L102 曾因 `tokens: ["It", "was", "rain."]`＋`wrongToken: "rain."` 的**尾标点不一致**致题目静默消失（代码侧 `grammarBoostService.ts:672-680` 有 `cleanWord` 兜底，但 `grammarBoostService.test.ts:185` 的 `tokens.includes(wrongToken)` 断言**不依赖兜底**）；**本批 6 处 spot 设计逐课按最严口径核对**：L119 `["I", "used", "to", "the", "cold."]`/`"used"`｜L120 `["I", "am", "used", "to", "get", "up", "early."]`/`"get"`｜L121 `["I", "get", "used", "to", "it."]`/`"get"`｜L122 `["I", "used", "to", "walking", "to", "school."]`/`"walking"`｜L123 `["I", "don't", "used", "to", "it", "yet."]`/`"don't"`｜L124 `["I", "used", "to", "walking", "to", "school."]`/`"walking"`。**全 6 处 wrongToken 均为 tokens 的逐字元素（无尾标点差异）** ✓
  - **每课 contrast ≥3 条**、`kind` 覆盖 choose／arrange／spot／replace（批十六口径）
  - **G-boost-d 双正解卡的 diffScore 红线**（批十七 §5.1 新增·本批沿用）：`grammarBoostService.ts:744-753` 对 `bothRight` 条目做 `diffScore(compareText(correct, wrong))`，**`>= 90` 直接 `return`**（静默丢弃、不报错）。**本 PRD 以真实 `diffService` 逻辑逐字复刻实跑本批全部双正解设计并留档**：L119 `I am used to the cold.`／`She is used to the cold.` **67** ✅｜L120 `I am used to getting up early.`／`I am used to reading at night.` **57** ✅｜L121 `I am getting used to it.`／`I got him to go with me.` **25** ✅；`I am used to it.`／`I am getting used to it.` **83** ✅｜**L122 脊柱卡 `I used to walk to school.`／`I am used to walking to school.` 71 ✅**；`We used to walk to school.`／`I used to walk to school.` **83** ✅；`I used to play here every day.`／`I used to walk to school.` **50** ✅｜L123 `I am not used to it yet.`／`I am not used to the new school yet.` **56** ✅；`I didn't use to play here.`／`I am not used to it yet.` **29** ✅｜L124 总表卡逐对 `I am used to the cold.`／`I used to walk to school.` **43** ✅、`I am getting used to it.`／`I am not used to it yet.` **71** ✅、`She is used to the cold.`／`I used to walk to school.` **29** ✅、`I used to walk to school.`／`I am used to walking to school.` **71** ✅。**全 12 组全部 < 90 ✓**（**生产时逐条重跑并登记，≥90 者必须改写成「换人／换事」版本**）
  - **（附）全库护栏现状（数析 §6 实读）**：`kind: "spot"` **恒为 1 道/课**（118 课共 118 道）；`contrast` 带非空 `wrongMark` 共 **416 条**、`wrongMark: null` **292 条**（`^        wrongMark: "` grep 实算 416）；**每课至少 1 条**；最低 11 课只有 2 道（贴线）。→ **本批每课 3 条带 mark 的真错卡，过线且留余量**
- [ ] **G13 时长 6–8 min**（6 课逐课走查；L120 7 词句、L123 7 词句各核上限；L124 为混排课，须按**分段计时**抽查）
- [ ] **G14 旧线零回归**：**L1–L118 一字不动**（含不改写 L93 `:17294`／`:17362`／`:17314`／`:17423`／L100 `:18641`／`:18708` 与不改动 HC #102／#103／#109／#110 的四个 `original: "use"` 错点）；`npx vitest run` 全绿（**本 PRD 定稿基线：60 文件 / 759 项**，2026-09-19 12:23 实跑 6.76s—**注：批十七 PRD 记 58 文件/732 项，本轮实测已上移至 60/759，差值为同期另一路改动**，生产时以实跑为准并登记）；`npx tsc --noEmit` 0 错；build 通过
- [ ] **G15 封面**：`L119←cover2`／`L120←cover3`／`L121←cover4`／`L122←cover5`／`L123←cover6`／`L124←cover7`（min-gap **117**，数析 §5.4 最优解）；**逐张目视核对图像语义**（家里／学校／新地方须相称）；不符者**在 cover2–cover89 的 88 张池内互换**；**`cover1` 禁用**（天花板 1）、**`cover90`–`cover117` 本批禁用**（天花板 ≤34）

### 6.2 Given/When/Then

- **G-A1** Given 学习者完成 L119 When 看 `I used to the cold.` ❌ Then 能补回 `am` 并说出「**有 be 站着才是「习惯了」**」；When 看 `She is used to the cold.` ✅ Then 能说出「换了人，am 也要跟着换成 is」
- **G-A2** Given 学习者完成 L120 When 看 `I am used to get up early.` ❌ Then 能改成 `getting` 并说出「**做的事要穿名字版**，第 42 课那张通行证」；When 看 `I am used to reading at night.` ✅ Then 能说出「换事不换规矩」
- **G-A3** Given 学习者完成 L121 When 看 `I get used to it.` ❌ Then 能补回 `am` 并说出「**慢慢在变**的句子里 be 不能丢」；When 看 `I am getting used to it.` ✅ 与 `I got him to go with me.` ✅ 并排 Then 能说出「**同一个 get 两张脸**」
- **G-A4（脊柱）** Given 学习者完成 L122 When 看 `I used to walk to school.` ✅ 与 `I am used to walking to school.` ✅ 并排 Then 能说出「**看 used 前面站谁**——前面站 used 后面穿原样，前面站 am 后面穿名字版」；When 看 `She used to working late.` ❌ Then 能改成 `She is used to working late.` **或** `She used to work late.` 并说出「加不加 be 是两张脸」
- **G-A5** Given 学习者完成 L123 When 看 `I don't used to it yet.` ❌ Then 能改成 `am not` 并说出「**not 跟 am 走，不请 don't**」；When 看 `Do you used to it yet?` ❌ Then 能改成 `Are you used to it yet?` 并说出「两张脸的问法长得不一样」
- **G-A6** Given 学习者完成 L124 回看 6 课旧句 When 逐句指认 Then 能各自说出「这是第 N 课学的、是哪一张脸」

## §7 案件规划（6 案 · #128–#133）

**总规则**：每案 **4 错＝新错 2＋旧错 2**；**单 token 可修**；每案 **≥1 净词**（`tokens.length > errors.length`）；零术语话术；tag **全落 10 枚举**（tagStats 固定 10 项）；`reviewed: true`；**必须配课**；**不碰 comparison**；**不引番外 5 案**；**本批 0 处 `fragment`／`run_on`**（避开连续同型）。案件编号接批十七尾案（#127 `hunt-close-17`，`huntCases.ts:7259`）为 **#128–#133**。

| 案件 id | # | 配课 | 场景 | 定稿错误构成（原 → 修正（tag，新/旧）） |
|---|---|---|---|---|
| `hunt-used-to-it` | **128** | L119 | 新地方的冷天：窗外冷，她说「这份冷我习惯了」 | ① `used` → `am used`（`I used to the cold.`，**missing_be**，新——漏 be；**补词型先例** `huntCases.ts:959` `"very"→"am very"`）② `use` → `used`（`I am use to the cold.`，**verb_form**，新——d 不能丢；**逐字对齐 HC #102 `:6172` 与 #109 `:6480` 的老话术**）③ `go` → `went`（`Yesterday I go to the park.`，**tense**，旧错 L10 `:1782`；**原句先例** `huntCases.ts:126-128`）④ `apple` → `apples`（`two apple`，**plural**，旧错 L11；**逐字先例** `huntCases.ts:6634-6636`） |
| `hunt-getting-up-early` | **129** | L120 | 同一间屋的早晨：闹钟没响她就起来了 | ① `get` → `getting`（`I am used to get up early.`，**verb_form**，新——**名字版**；**对齐 Cambridge `Not: We are used to go …`**）② `early` → `up early`（`I am used to getting early up.`，**word_order**，新——「起床」是一块；**补词型先例** `huntCases.ts:758-766` 的「挪位」写法）③ `drink` → `drinks`（`He drink milk every day.`，**sv_agreement**，旧错 L25 `:4528`；**逐字先例** `huntCases.ts:6054-6056`）④ `book` → `books`（`two book`，**plural**，旧错 L11） |
| `hunt-getting-used-to` | **130** | L121 | 楼下新车棚：刚换的新车还有点不顺手 | ① `get` → `am getting`（`I get used to it.`，**missing_be**，新——**漏 be**：慢慢在变的句子里 be 不能丢）② `get` → `getting`（`I am used to get it.`，**verb_form**，新——同一个 get 两张脸混用）③ `use` → `used`（`I am getting use to it.`，**verb_form**，旧错——**L119／L120 同型回流**；**逐字对齐 HC #102 `:6172`**）④ `bag` → `bags`（`two bag`，**plural**，旧错 L11） |
| `hunt-two-faces` | **131** | L122（**脊柱课案件**） | 校门口：同一条上学的路，一张脸说从前、一张脸说现在 | ① `walking` → `walk`（`I used to walking to school.`，**verb_form**，新——**没 be 站着，used to 只认原样**；**逐字对齐 L93 `:17294`「后面跟原样」与中文侧 `habit-be-used-to` 明文 ❌**）② `walk` → `walking`（`I am used to walk to school.`，**verb_form**，新——**有 am 站着，认名字版**；**对齐 Cambridge `Not: We are used to go …`**）③ `go` → `went`（`Yesterday I go to school.`，**tense**，旧错 L10）④ `friend` → `friends`（`two friend`，**plural**，旧错 L11） |
| `hunt-not-used-to` | **132** | L123 | 新学校第二天：这儿还没习惯 | ① `don't` → `am not`（`I don't used to it yet.`，**verb_form**，新——**not 跟 be 走，不请 don't**）② `Do` → `Are`（`Do you used to it yet?`，**word_order**，新——**be 搬句首**，不是 Do；**L122 对比卡 ③ 的回流**）③ `was` → `were`（`They was happy.`，**sv_agreement**，旧错 **L19**；**逐字先例** `huntCases.ts:93-95`）④ `picture` → `pictures`（`two picture`，**plural**，旧错 L11） |
| `hunt-close-18` | **133** | L124（收口） | 书桌前：这一章学过的几句话排在下面 | ① `use` → `used`（**verb_form**，旧错——**L119 回流，锚 #128**，逐字对齐 HC #102 `:6172`）② `get` → `getting`（**verb_form**，旧错——**L120 回流，锚 #129**，对齐 Cambridge `Not:`）③ `walking` → `walk`（**verb_form**，旧错——**L122 回流，锚 #131**，对齐中文侧明文 ❌）④ `don't` → `am not`（**verb_form**，旧错——**L123 回流，锚 #132**） |

> **⚠️ #133 的同罪名集中问题（须生产时处理）**：上表 4 错全落 `verb_form`，虽**有同案同 tag 先例**（#34 六错全 `sv_agreement`、#125 双 `sv_agreement`、#123 双 `plural`、#94 双 `word_order`——本轮逐案实读确认），但**建议按现有先例稀释**：把 ④ 换成 `She is not use to it yet.` 的 `use→used`（仍 `verb_form`）**或**改为 `article`／`plural` 旧错回流（如 `two book→books`），使 #133 落 **2–3 个 tag**。**生产定稿时二选一，并在案件表登记**（本 PRD 默认：④ 保留 `don't→am not`，因它是 L123 的唯一考点头号错，**接受全 `verb_form`**——先例充分）。

**本批罪名分布（6 案 × 4 错 ＝ 24 处，逐案按上表实点）**：`verb_form` **11**（#128②／#129①／#130②③／#131① ②／#132①／#133①②③④）；`plural` **5**（#128④／#129④／#130④／#131④／#132④）；`missing_be` **2**（#128①／#130①）；`word_order` **2**（#129②／#132②）；`tense` **2**（#128③／#131③）；`sv_agreement` **2**（#129③／#132③）；**`article` 0／`preposition` 0／`fragment` 0／`run_on` 0**。（各罪名承载案数：`verb_form` 6 案／`plural` 5 案／`missing_be` 2 案／`word_order` 2 案／`tense` 2 案／`sv_agreement` 2 案。）
> **注**：上表逐案列出的是「新错 2＋旧错 2」的**定稿骨架**，生产时逐 token 核对 `tokenIndex` 与 `tokens`；**`#133` 四点须与 #128／#129／#131／#132 的错型逐字对齐**（收口课的纪律是「复现不讲新」）。

**案件表纪律**：每案 4 错全部**单 token 可修**（补词／删词型按既有先例：`used→am used` 型参照 `huntCases.ts:959`；挪位型参照 `:758-766`；尾标点差异参照 `:6634`）；新错话术走 §4 负迁移表；**旧错一律取自已教点**（L10 `:1782`／L11 `:1964`／L19 `:3423` 那一课／L25 `:4528`），**禁引入未教材料**；**#128／#130 的 `use→used` 与 #133 的同型点须与 HC #102／#109／#103／#110 的四处 `original: "use"` 保持话术一致**（同为 `verb_form`＋「尾巴上要有 d」）。

## §8 Non-goals

- **不做 `look + 形容词` 升格**（竞析已升 **B 档**：Cambridge 词典义项 (SEEM) 标 A2＋`Look as a linking verb` 专节＋Murphy 中级 U99 标题 `you look tired`＋中文三篇落点；数析 §7 判「**留作批十九的开章首选**」——**本批不做，留批十九**）
- **不做 `have sth done`**（**维持撤出**：BC 三档 68 课零课位；Murphy 仅中级 U46；招牌句四零件全库零——数析 §1.3 复核「`cut` GL 0／HC 0、`hair` GL 0、`will have` 0、`'ll` 全 0」）
- **不做形容词＋介词单开课**（六族只覆 1/6，除 `good at` 外八族全 0）；**只折**：L119 对照卡 ⑤ 借 L67 `:12363` 门牌话术 1 处，**不单开、不扩清单**
- **不做 `look like`**（维持认读：GL 仅 L49 `:8977` 一句天气义；BC 在 B1-B2；**与 `look + 形容词` 不得混述**）
- **不做 `would` 表示过去习惯**（BC 明文 "we can't usually use would to talk about past states"，且与我方 `used to` 一山不容二虎——越段内容冻结）
- **不做 `become used to`／`accustomed to`／`not until` 倒装／双重所有格**（越段内容一律冻结；L124 零新知课尤其禁）
- **不做散点**（`so that`／`neither`／`already`／`still`／`each other`／反身代词等——瑞思 §2 T7 判「无共同语义场与场景锚，强凑即稀释一课一增量」）
- **不做** 机制强化（boost 三档／回马枪已饱和且有测试守门）
- **不做** 双拱（批十四破例一次后，批十五／十六／十七连续单拱，本批**第五次连续单拱**）
- **案量不扩**：6 课 6 案，不设「一课两案」；**不加**新枚举、不改 tagStats／schema
- **不动 L1–L118**（一字不改；**特别声明：不改写 L93 `:17294`／`:17362`／`:17314`／`:17423` 与 L100 `:18641`／`:18708`，不改 HC #102／#103／#109／#110 的四个 `original: "use"` 错点**）
- **不引**番外 5 案（`hunt-white-cat`／`hunt-sports-day`／`hunt-pen-pal-letter`／`hunt-fridge-note`／`hunt-term-review`）
- **不做** 池外新资产（封面＝cover2–cover7 池内复用，数析 §5 最优指派；**语义不符时池内互换**；`cover1` 禁用、`cover90`–`cover117` 本批禁用）
- **不做** cloze 词表扩充（`used`／`getting`／`working`／`yet`／`cold` 不在表内——**用保障句兜住，不改 `grammarAmbushService.ts`**；`to` 的 boost 死角**不改代码**，靠课程对比卡补足）

## §9 开放问题

1. **「看前面站谁」是否接得住**（**本批最大未知**，瑞思 §7 假设 ①）——学生能否在 `I used to get up early.` 与 `I am used to getting up early.` 之间**一次分清**？默认 L119 判据前置＋L122 脊柱课并排＋4 条 ❌ 卡（L122 ❌①②／L119 ①／L120 ①）；**中段自走查落 L122**（瑞思建议 L119 后加，本 PRD 调整到 L122 后——因为两张脸并齐才可测）。
2. **`used` 与 L113「感到版 -ed」的同形干扰**（批十七交付后**新增**的干扰面，批十七研究未预见——瑞思 §1 ⑦）——学完 L113「感到版带 -ed」后，学生是否把 `I am used to it.` 读成「我感到用」？默认 L119 对比卡 ⑥ 显式切开（`I was tired.` ✅ 并排 `I am used to the cold.` ✅）；**单列观察项**（不设额外机制）。
3. **L93 反向惩罚率**（**本批独有的回归风险**）——学完 L122 后重做 L93／L100 旧题：`I used to playing here.` 是否仍被正确判错？若走查显示误答率上升，备选：L122 deepDive 段 ④ 增一句「第 93 课那句题照旧——没有 be 的时候还是只能接原样」；**不改前课题目**（红线）。
4. **L123 引入的 `yet` 是否超词架**——`yet` 在库内 **GL 0／HC 0**（首次引入），且**不在 cloze 词表内**。默认 L123 whyZh 用大白话点一次「yet＝『还没』那口气，站句尾」；**若走查显示 `yet` 成为卡点，备选：主句改 `I am not used to it now.`**（cloze 实跑落 **am**；代价是丢 BC 的 `Are you used to the cold weather yet?` 原句呼应）。
5. **`get` 版是否被感知为「跟 be 版一样」**（同义换挡风险，与批十七 `have got` 同型——瑞思 §7 假设 ③）——走查盯「学完仍只用 `I am used to it.`」的比率；**对比卡 ⑥ 已是双正解设计**，兜底成本为零。
6. **`-ing` 词汇底座窄**（数析 洞察 5：`getting` 2／`working` 0／`walking` 0／`driving` 0／`using` 0）——本批**只用 `getting up`／`reading`／`working`／`walking` 四个存量说法**（`working`／`walking` 仅出现在保障句与对比卡，**不进 target**）；**若生产时发现需造词，须回到主理人重裁**（触「核心 500 词」红线）。
7. **封面 6 张语义核对**——本 PRD 指派按**编号间距实算**（min-gap 117，数析 §5.4 已证最优），**未做图像语义核对**；`cover2`–`cover7` 是 L2–L7 的老插图（900×600 与 1024×682 两代并存），**画面是否相称须逐张目视确认**；不符者可在 **cover2–cover89（88 张）**内互换（余量极大）。
8. **`#133` 的 tag 集中度**——4 错是否全落 `verb_form`（见 §7 表末注）：先例充分（#34／#94／#123／#125），**默认接受**；若 QA 认为过密，按 §7 注二选一稀释。
9. **m20 的 afterLesson 值**——数析 §4 写「afterLesson 125 或 124」；**本 PRD 定为 124**（与 season-18 `max:124` 对齐、与 m19 的 `afterLesson 118` 同构）——**须人工核**（`can-do-m*` 全仓测试引用数 = 0，纯纪律项，漏加不会红）。
10. **基线口径**——本 PRD 定稿实测 `npx vitest run` ＝ **60 文件 / 759 项全绿**（2026-09-19 12:23）；批十七 PRD 记 58 文件 / 732 项、三研究记 732（瑞思／数析）——**差值为同期另一路改动**，生产时以实跑为准（G14 写 759，若生产期再变以实跑登记）。
11. **批十七 F17-A 走查与 F17-B 关账均未回**（瑞思 §7 未核实 ④）——「批十七已让 `-ed/-ing` 上位」的前提**未经遥测验证**；本批 L119／L120 的同形隔离卡（L113 的 `-ed`）**按最保守假设设计**（显式切开，不假设学生已消化 L113）。
12. **无真实遥测**（样本＝1）；**封面 09-19 流水线切换的提交边界未查明**（瑞思 §7 未核实 ⑤）；**L118 用 `cover1` 是否为有意安排未查明**——若「收口课复用首课封面」是有意设计，则本批 L124 也应复用 `cover119`（**但本批封面是池内复用、无 `cover119`**，故维持 `cover7`；**瑞思 §7 未核实 ⑦ 建议调 L124←`cover119`，与本 PRD 的口径冲突，须主理人裁**）。

---

> 本规格书由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。
