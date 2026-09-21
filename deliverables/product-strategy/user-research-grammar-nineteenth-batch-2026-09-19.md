# 用户研究综合报告 · 第十九批（看起来怎样 · 3 课 L125–L127）

**日期**：2026-09-19 ｜ **类型**：用户研究（批十九选题）｜ **成员**：瑞思
**方法**：**全扫** `src/data/grammarLessons.ts`（**23,398 行／124 课**，md5 `ab2f56a6497b007548c9b8552bbe7f63`）与 `src/data/huntCases.ts`（**7,565 行／133 案**，md5 `d3d6ec77f6b082f5c0813c790a025fd7`）——**状态机提取引号内串、跳 `//` 与 `/* */` 注释、行号→课号／案号映射**（GL 命中 **22,511 串**，其中英文串 **14,017**；HC 命中 **5,494 串**，英文 **4,376**）；`look` 家族与 `look + 形容词` **逐条全量清单（含字段与说话人）**；感官动词 `sound/smell/taste/feel` 逐形态复算；形容词库存按「英文串内词频」与 raw 双口径计数；**`pickClozeWord`（ambush）逐字复刻实跑**（20 句候选句的落点）；**建临时 vitest 探针实跑 `buildBoostItems`**（124 课 × 3 档 × 30 轮＝**44,640 题**的全库扫描 ＋ 构造 `seen` 的极端复练验证；跑完即删）；**封面逐张实算（穷举求 max-min）＋ 5 张图像目视**；`npx vitest run` 全量基线；逐课实读 L113（`:21065-21262`）、L119–L124（`:22235-23398`）、L76（`:14048-14238`）、L27（`:4886-4930`）、L58／L59（`:10646-10960`）。

---

## 0. 结论先行

**推荐：L125–L127 三课小章「我看到的和感觉到的」**——`look + 形容词` 立岗（L125 `You look tired.`）→ **换人换形**（L126 `He looks happy.`／`They look happy.`）→ **感觉版 `feel` ＋ 与「是」并排收口**（L127 `I feel tired.`）。**3 课、3 案（#134–#136）、封面 `cover8`–`cover10`**。理由一句话：**16 处现成垫子（本轮实测，比批十八记的 14 处多 2 处）＋ `look`/`looks` 直接在 cloze 词表内（落点即本课语法词）＋ `look` 从未进过任何一课 `grammarLabel`、0 处作 target、0 处进课内练习——「零冲突」经本轮逐项复核为真**。
**备选：折入他章作第 2–3 课**（若主理人认为 3 课不足以单独成组）；**若折入，只折 2 课（L125–L126），`feel` 那条腿会掉**——`feel` 是「感觉」半场的唯一落点，我不建议砍。
**维持原判（本轮复核不改）**：`look like` 维持认读、不升格（GL 仅 L49 `:8977` 一处天气义，且**与首选不得混述**）｜`have sth done` 维持撤出（`cut` GL 0／HC 0、`will have` 0、`'ll` 0）｜形容词＋介词维持折卡（六族只覆 1/6）｜机制强化不做（G-boost 50 项实跑全绿）｜A2 段剩余盘点出一张缺口表（附属项，非课）。
**形态红线**：按批十八路线图两条纪律执行——① **3 课小章，不外扩到 6 课**（不独立成「大章」）；② **不与 B1 下一个 `to` 硬结构同窗**（`look forward to` 本轮实测 GL **0**／HC **0**，两文件均无，不构成同窗风险，但纪律照守）。

| 关键判断 | 裁决 | 理由（一句话） |
|---|---|---|
| 首选是 3 课还是 6 课？ | **3 课** | 实质增量只 3 项（立岗／换人换形／感觉版）；第 4 课起只能在同一场景换词，破「一课一增量」 |
| 「零冲突」是真的吗？ | **是真** | `look` 0 次 `grammarLabel`；targetSentence 含 look 全库仅 L27 `:4898`（`look for`，动作义）；16 处垫子 0 处进讲解／练习／例句 |
| 垫子是 14 处还是 16 处？ | **16 处** | 批十八交付的 L121 `:22649`、L123 `:23037` 各添 1 处（批十八研究写在交付前，故记 14） |
| 能扩到五个感官词吗？ | **不能** | `sound/smell/taste` 两文件全 0（逐形态复算）；`feel` 全库 27 处但只 1 个说法（`feel much better`），只够 1 课 |
| 与批十八的 `be used to` 撞型吗？ | **不撞** | `I am used to N`（be＋used to＋东西）与 `You look tired.`（look 直接接词）表面相似、切开点不同；两课相隔 ≥1 课（L124 → L125） |
| 与 L113 的 `-ed` 形容词撞型吗？ | **半撞，须显式切开** | L113 教「感到版带 -ed 用 be」；本批 `tired` 正是 -ed 词，须一张卡切开「看起来累 vs 就是累」 |

---

## 1. 关键发现（实读证据）

**① `look` 家族全量：GL 42 处串／HC 6 行 7 处，逐形态如下（实读）**

| 形态 | GL 处数 | HC 处数 | 分布（GL 课号） |
|---|---|---|---|
| `look` | 10 | 4 | L19／L65／L83／L87／L92／L112／L121／L123（＋L27 `wrongMark: "look"` 与 `wrong:` 串 2 处） |
| `looks` | 9 | 0 | L13／L48／L49／L51／L66／L71／L72／L79／L115 |
| `looking` | 14 | 0 | L13／L27（10 处）／L37／L73 |
| `looked` | 1 | 0 | L76 `:14076` |
| `Look`（祈使） | 9 | 3 | L52／L58 ×2／L60 ×2／L86／L88／L89／L96；HC #35 `:2159`／#59 `:3748`／#62 `:3927` |

（`Looks`／`Looking`／`Looked` 首字母大写形：两文件 **0**。HC :2794 是 token、:2829 是讲解串，含 `look in your bag` 的「门牌」用法。）

**② `look + 形容词` 逐条完整清单：16 处（比批十八记的 14 处多 2 处）**

| # | 行号 | 课 | 逐字原句 | 字段 | 说话人 |
|---|---|---|---|---|---|
| 1 | `:2338` | L13 | `It looks nice!` | `dialogue` | `who:"npc"` |
| 2 | `:3438` | L19 | `You look tired.` | `dialogue` | `who:"npc"` |
| 3 | `:8790` | L48 | `The sky looks dark.` | `dialogue` | `who:"npc"` |
| 4 | `:9353` | L51 | `Everything looks new.` | `dialogue` | `who:"npc"` |
| 5 | `:12183` | L66 | `That box looks big!` | `dialogue` | `who:"npc"` |
| 6 | `:13129` | L71 | `This bag looks heavy.` | `dialogue` | `who:"npc"` |
| 7 | `:13318` | L72 | `Your plan looks great!` | `dialogue` | `who:"npc"` |
| 8 | `:14076` | L76 | `You looked tired yesterday.` | `dialogue` | `who:"npc"` |
| 9 | `:14645` | L79 | `Your room looks nice!` | `dialogue` | `who:"npc"` |
| 10 | `:15406` | L83 | `You look happy today!` | `dialogue` | `who:"npc"` |
| 11 | `:16168` | L87 | `You look cold.` | `dialogue` | `who:"npc"` |
| 12 | `:17113` | L92 | `You look great!` | `dialogue` | `who:"npc"` |
| 13 | `:20898` | L112 | `They look the same!` | `dialogue` | `who:"npc"` |
| 14 | `:21481` | L115 | `It looks new!` | `dialogue` | `who:"npc"` |
| 15 | **`:22649`** | **L121（批十八新增）** | `You look better now!` | `dialogue` | `who:"npc"` |
| 16 | **`:23037`** | **L123（批十八新增）** | `You look a little lost.` | `dialogue` | `who:"npc"` |

**逐条复核结论**：**16/16 全为 `who:"npc"` 对白行**、逐句在全库**只出现 1 次**（逐串实核对）、**0 处作 `targetSentence`**、**0 处进 `practice`／`guided`／`variants`／`examples`／`oneLineRule`／`summary.rule`／`deepDive`**（字段归属由状态机逐串判定，`targetSentence`／`oneLineRule`／`rule:` 三个字段 grep `look` 均 **0**）。**批十八简报的两处遗漏＝批十八自己交付的两课新垫子**（L121／L123），属时间差而非漏抽。

**③ 「零冲突」逐项核实：结论为真（实读）**

| 检查项 | 结果 |
|---|---|
| `look` 进过 `grammarLabel` 吗？ | **全库 0 次**（`grep grammarLabel \| grep -i look` 空；末课标签为「收口 · 零新知（四句排一行）」`:23209`） |
| `look` 作过 `targetSentence` 吗？ | **仅 L27 `:4898`**「What are you looking for?」——**`look for` 动作义，不是 look + 形容词** |
| `look` 进过 oneLineRule／summary.rule 吗？ | **0**（两个字段逐字 grep 空） |
| 16 处垫子进过课内练习吗？ | **0**（字段分布仅 `dialogue`；`guided`／`recall` 里的 look 全属 L27／L73 的 `look for`） |
| 16 处垫子进过 boost 派生池吗？ | **池内有、实际出题 0 次（实测）**：全库 124 课 × 3 档 × 30 轮 = **44,640 题中，来自 `dialogue` 的题 0 道**；look 相关题仅 2 类（L27 `look for` 的 recall／produce）。**构造极端 `seen`（把某课非对话来源全部标记为已练）后**，dialogue 句会浮出（实测 28 次，含 L19 `:3438` `You look tired.` 作 rebuild 题）——**这是唯一一条「零冲突」的不严格处，须登记** |
| HC 侧呢？ | `look + 形容词` **0 处作错点**；但 **#25 `:1340` 案的合法句里就有 `I look younger,`**（`tagged` 错点是 hotter／more good／an／boats）——**等于库内已有一处「这句没错」的天然陷阱位可复用** |

**④ `look` 的四条支线（用于隔离设计，实读计数）**
`look like` **GL 1 处**：L49 `:8977`「It looks like rain.」（NPC 对白，天气义）｜`look as if`／`looks as if` **两文件 0**｜`look at` **8 行／6 句**（L52 `:9540`、L58 `:10656`／`:10672`、L60 `:11030`／`:11047`、L65 `:11995`、L88 `:16357`、L96 `:17872`）｜`look for` **16 行／13 串**（L13 `:2385`、L27 `:4895-4930`＋`:5064-5065`、L37 `:6750`、L73 `:13601-13602`）——**三支全是动作义或认读，已教，可作 L127 的「同一个 look、两张脸」对位材料，但不得顺手教 `look like`**。

**⑤ 感官动词家族：`sound/smell/taste` 真为 0；`feel` 有厚度但只有 1 个说法（实读）**
`sound`／`sounds`／`smell`／`smells`／`taste`／`tastes` **GL 与 HC 两文件逐形态全 0**（批十八的「全 0」复核为真）。`feel` **GL 27 处**，但**全部集中在 L76 `:14058-14235`（22 处）与 L78 `:14466-14606`（5 处）**，且**只有一个说法**：`I feel much better today.`（加力 much 那一课）；`feels` **0**／`felt` **0**。**HC `feel` 4 处**：#56 `:3572` `I feel tired today.`（**在合法句里，不是错点**）、#85 `:5353`、#87 `:5472`——**即「feel + tired」这个搭配已在 56 号案的合法句中出现过，本批可正面认领**。
→ **批十八建议「只取 look 一族＋1 个 feel」：本轮复核为真且必要**（sound／smell／taste 连词架都没有，铺五词＝零词架造课）。

**⑥ 形容词库存（look 能接的词，按英文串内词频／raw 双口径）**

| 词 | 串内 | raw | 判定 |
|---|---|---|---|
| `cold` | 155 | 206 | **最厚**（L6／L87 场景已在） |
| `new` | 147 | 185 | 厚（L51／L115 垫子） |
| `happy` | 89 | 109 | 厚（L1 :158 老平台） |
| `nice` | 85 | 114 | 厚（L13／L79 垫子） |
| `tired` | 66 | 88 | 厚（L1 practice `:276-279` 已用、L113 感到版同族、**16 处垫子里 2 处**） |
| `good`／`well` | 66／35 | 117／67 | 厚（L59 专门教 good→well，**L127 ❌ 卡接口**） |
| `heavy` | 39 | 55 | 中（L71 垫子） |
| `better` | 39 | 73 | 中（L76 主业） |
| `lost` | 37 | 58 | 中（L123 新垫子 `a little lost`，**偏难，不进 target**） |
| `big` | 17 | 26 | 中（L66 垫子） |
| `hungry`／`busy` | 8／29 | 8／34 | 中（**L1 practice `:288` `I am hungry.` 有先例**） |
| `dark` | 4 | 5 | 薄（L48 垫子，**不进 target**） |
| `great` | 7 | 7 | **薄**（L72／L92 垫子，**仅在复现卡里出现，不进 target**） |
| `same` | 1 | 1 | **唯一一处**（L112 `the same`，**不进 target**） |

**⑦ 测试基线（实跑）**：`npx vitest run` → **60 文件 / 761 项全绿（13:32:04，6.85s）**；`grammarBoostService.test.ts` **50 项**全绿；`grammarSeasons.test.ts` **4 项**全绿。与批十八路线图登记的「60 文件 / 761 项」一致，无漂移。
**盘面**：124 课 / 133 案 / `cover` 引用 **124 次** / 资产 **117 张** / season **18** 组 / 里程碑 **20 个**（m20 `afterLesson: 124`）/ 零术语 **29 词** / 全库错点 **506 个**（verb_form 119・plural 93・sv_agreement 69・preposition 60・word_order 43・tense 42・article 28・missing_be 24・run_on 14・fragment 14）。

**⑧ cloze 落点实跑：本批落点即语法词（比批十八的 `used`／`getting` 落不动强一大截）**

| 句子 | ambush 落点（逐字复刻实跑） | boost `keywordIndexes` 口径 |
|---|---|---|
| `You look tired.` | **look** | `look` 长 4、非功能词 → **look** |
| `She looks happy.`／`He looks happy.` | **looks** | looks |
| `They look happy.` | **look** | look |
| `It looks new.` | **looks** | looks |
| `I feel tired.`／`I feel happy.` | **feel**（词表未收 feel，靠 ② 档实词回退，**实跑仍落 feel**） | `feel` 不在 `FUNCTION_WORDS` 33 词内 → feel |
| `I am tired.`／`She is happy.`（保障句备选） | **am**／**is** | am／is |

**⑨ 与批十八（L119–L124）的干扰判定（实读 L119–L124 全文后）**
L119–L124 六课的目标句是 `I am used to the cold.`／`I am used to getting up early.`／`I am getting used to it.`／`I used to walk to school.`／`I am not used to it.`（`:22244`／`:22438`／`:22632`／`:22826`／`:23020`／`:23214`）。**形态是「be/get + used to + 东西／名字版」，与本批「look + 词」不是一个骨架**；唯一同形点是 `used`／`looked` 都带 -ed（L76 `:14076` 有 `You looked tired yesterday.`）——**批十八已把 `used` 与 L113 的 -ed 切开（L119 对比卡 ⑥）**，本批沿用同一张卡的思路即可，**不新增机制**。**「看」这个字在 L122 `:22869`「以后看到 used，先往它前面看一眼」里只作讲解用语**，与本批 `look` 无混读风险（**推断**：走查验一次即可）。**真风险是 L113**：见下。

**⑩ 与 L113 的干扰（半撞，须显式切开）**
L113 `:21070` 标签「感到版 vs 让人版 · -ed 说感到、-ing 说它让人」，`:21078` 主句 `I am bored.`，`:21083` oneLineRule「感到版说「我的感受」」——**L113 的判据是「谁没劲（人 vs 东西）」，不是「看起来 vs 就是」**。本批 L125 的主句 `You look tired.` 里 `tired` 正是同一族 -ed 词 → 学生可能产出「**You look tiredly**」（把 L58／L59 的 -ly 规则过度套用）或把 `look + tired` 与 `am + bored` 混读成同一排。**处理＝L125 第 1 张对比卡就切开「看起来累」与「就是累」（两句都对），L126 第 1 张卡切 `You look tired.` ✅ 对 `You look tiredly.` ❌**（先例：L59 `:10892` 用 `She is a good singer.`／`She sings well.` 双正解卡切「挂人 vs 跟动作」）。

**⑪ 中文负迁移线索（引自批十八竞析 §EC-3／EC-4，本轮未独立复取）**
中文侧 `linking-verbs` 明文 ❌ `Her skin feels smoothly.` 对 `Her skin feels smooth.` ⭕️，并做 `He looks smart.`（补充说明主词）对 `He looks angrily at her.`（修饰动作）的**同词切开**；`sense-verbs` 明文四条 ❌：`sounds great`（不是 greatly）／`feels so smooth`（不是 smoothly）／`smells so good`（不是 well）／`tastes so bitter`（不是 bitterly）。→ **这正是本批 §5 的负迁移骨架，且给出现成的 ❌ 卡素材**。

**⑫ 旧错回流锚点复核（逐行实读，**含一处口径纠正**）**

| 课 | 锚点行号 | 逐字 |
|---|---|---|
| L10（昨天版） | `:1782` oneLineRule | 「看到 yesterday，动词就要换形状：go 的昨天版是 went。中文动词不变，英语必须变。」 |
| L11（复数） | `:1964` oneLineRule | 「两个以上要加 s。有些词变得不规则：man→men、foot→feet……」 |
| L19 | `:3423` **targetSentence** | `I was busy and happy.`（was＝am 的昨天版） |
| L25（三单） | `:4528` oneLineRule | 「他、她、它做事，动词后面要加个小尾巴 -s：He drinks。」 |

**⚠️ 口径纠正（实读）**：批十八路线图写「旧错回流 L19（was-were）」——**「一个用 was、一群用 were」实际在 L51 `:9344`／`:9416`**，**不在 L19**；L19 `:3423` 的锚点是 `I was busy and happy.`（was 作 am 的昨天版）。**生产引用时按本表行号，别写错课**（推断：批十八把「was/were 配对」与「was 的昨天版」混成一格）。

**⑬ 封面实算（L125 起，穷举求 max-min，**实算**）**
现状：**117 张图、124 次引用**；二用张恰为 `cover1`（L1 `:144`＋L118 `:22046`）与 `cover2`–`cover7`（L2–L7＋L119–L124，逐张实读 `:22242`／`:22436`／`:22630`／`:22824`／`:23018`／`:23212`）。**二用张再用的 min-gap 上界＝6–7（远低于 35 可用线）→ `cover1`–`cover7` 本批与下批一律禁用**。
可用张＝**单次张 `cover8`–`cover90`（83 张，取 L125 时间距 ≥35）**；`cover91` 起在 L125–L127 的间距 ≤36–34，贴近压线，不建议本批取。
**最优指派：`L125←cover8`（间距 117）／`L126←cover9`（117）／`L127←cover10`（117）——min-gap 117，为理论最大值**（瓶颈＝`cover8` 在 L125 的间距 125−8 = 117，任何不含 cover8 的方案 min-gap 只能更低；3/4/5/6 课方案同样以 117 封顶）。**资产齐备**（`lesson-8.jpg`…`lesson-10.jpg` 均在，共 117 张）。
**图像目视（本轮实看 5 张）**：`lesson-8.jpg`＝火车车厢内两女孩看窗外（生活场景）；`lesson-9.jpg`＝校园林荫道走向图书馆（**贴 campus**）；`lesson-10.jpg`＝书桌前想象野餐（**贴 mansion 书桌**）；`lesson-11.jpg`＝火车上写日记；`lesson-12.jpg`＝夜晚卧室书桌画画（**贴 mansion**）。→ **若 L125–L127 走 `mansion`／`campus`，`cover9`／`cover10` 语义相称；`cover8`（车厢）与「看人」场景待 D1 逐张复核，必要时在 `cover8`–`cover90` 的 83 张内互换（余量极大，不影响 min-gap）**。

**⑭ 场景锚可行性（逐课判断，实读 11 种在用场景 id）**
在用场景：`mansion` 40／`campus` 34／`city` 22／`sparkle` 7／`island` 5／`school` 5／`train` 3／`mystery` 3／`forest` 2／`magic` 2／`snow` 1。**三课全部可用既有场景锚、零新造词**：
- **L125（看人）**：锚 `mansion` 客厅（L76 `:14057` 同场：小美昨天不舒服、今天好多了）或 `school` 校门口（L87 `:16168` 同款「缩着脖子」场景，school 仅 5 课、最近用于 L94）。**推荐 `mansion`**（L119–L120／L124 已在本季用 mansion，学生熟悉）；
- **L126（换人换形）**：锚 `campus`（L51 `:9353` `Everything looks new.` 同场：擦干净的教室；campus 34 课、最近 L123）；
- **L127（感觉版）**：锚 `mansion` 书桌（L76 `:14075` 妈妈端热水的客厅场景）＋ 隔离卡引 `city` 的 L49 `:8977`（`It looks like rain.` 认读）。

---

## 2. 主题分析表

| 主题 | 缺口真实性／频率×痛感 | 证据（行号） | 判定 |
|---|---|---|---|
| **`look + 形容词` 升格**（批十九首选） | **真缺口（半曝：认读 16 处、教学 0 处）**／频率高（「看起来…」是日常评价第一句），痛感高（-ly 负迁移四条 ❌ 中文侧现成） | 16 处垫子 `:2338`–`:23037`（§1 ②）；`look` 0 次 grammarLabel；cloze 落点实跑（§1 ⑧）；上游引批十八竞析（Cambridge 词典 look (SEEM) 标 A2／`Look as a linking verb` 专节／Murphy 中级 U99 标题 `you look tired`） | **做（3 课小章）** |
| `look like` 升格 | **假缺口（认读已足）**：GL 仅 1 处天气义；四度三缺（BC 仍 B1-B2、中文侧 `look-like` 404、教材落点中级 U117–118） | L49 `:8977`；`look as if` 两文件 0 | **维持认读**（可作 L127 对照卡，**不得混述**） |
| `look at`／`look for` | 已教（动作义），**不是缺口** | `look at` 6 句（`:9540`／`:10672`／`:11047`／`:11995`／`:16357`／`:17872`）；`look for` 13 串（L27 起 5 课） | 维持；作 L127 对位材料 |
| 五感官词铺开（look／sound／smell／taste／feel） | **零词架**：三词两文件全 0；`feel` 只 1 个说法 | §1 ⑤ | **不做（只 look＋1 个 feel）** |
| `have sth done` | **词架零**（`cut` 0／`will have` 0／`'ll` 0；`hair` GL 0，**HC 仅 #25 `:1344` 一处**，是合法句里的 `my hair`，不构成词架） | 本轮 grep 复跑 | **维持撤出** |
| 形容词＋介词 | **搭配清单不是结构**：六族只覆 1/6（`good at` GL 52／HC 6，其余 `interested`／`afraid`／`similar`／`proud`／`worried`／`keen`／`familiar` 两文件全 0） | L67 `:12363`／`:12380` | **维持折卡（不单开）** |
| 机制强化 | 无增量空间 | `grammarBoostService.test.ts` 50 项实跑全绿 | **不做** |
| A2 段剩余盘点 | 附属盘点项 | 批十七关账 BC A1-A2 18/18 | 出「课程位 vs 词典型证据」缺口表（非课） |

---

## 3. 方案对比表

| 维度 | **甲 `look + 形容词` 3 课小章** ✅ | 乙 6 课大章（五感官铺开） | 丙 `have sth done` | 丁 形容词＋介词单开 | 戊 机制强化 | 备选：折入他章 2–3 课 |
|---|---|---|---|---|---|---|
| ① 缺口真实性 | **真**：16 处认读垫子、0 处教学；`look` 未进任何 `grammarLabel` | 假：三词词架零，实为造课 | 变：词架零（实读） | 半真：只 1/6 有底 | 无 | 同甲 |
| ② 频率×痛感 | **高×高**：评价句高频＋-ly 负迁移命中中文学习者典型错（4 条 ❌ 现成） | 低（词都不在库） | 中×低（跨级且无词架） | 中×中（清单背不住） | — | 同甲 |
| ③ 认知负荷 | **低（A2 段）**：`look`／`looks` 直落 cloze；判据一句「看起来后面直接跟那个词」 | 高（5 词一次给） | 高（跨级 U46） | 中（六族清单） | — | 同甲 |
| ④ 体系衔接 | **顺**：接口＝L1 `:158`（be＋形容词）／L25 `:4528`（换人换形）／L113 `:21083`（-ed 感到版）／L76 `:14058`（feel 老锚）／L58–L59（-ly 规则的对位面） | 断（sound 等无接口） | 断（无接口） | 半顺（L67 一个接口） | — | 稍弱（须与宿主章共享场景线） |
| ⑤ 红线兼容 | **全绿**：10 枚罪名够用；不用 comparison；目标句 ≤8 词；零术语需绕「形容词／副词」（§6） | 同 | 同 | 同 | 同 | 同 |
| ⑥ 容量 | **恰好 3 项**（立岗／换人换形／感觉版） | 需注水 4 课 | 1 课封顶 | 1 课封顶 | 0 | 2–3 项（`feel` 有掉的风险） |
| ⑦ 形态风险 | **低**：唯一风险＝`look like` 混述＋L113 `-ed` 混读，均有现成切开卡 | **高**：零词架 | 中：跨级 | 中：破一课一增量 | — | 中：宿主章未定 |

**判定：甲**。乙／丙／丁维持原判不做，戊维持不做；备选（折入他章）仅在「主理人不接受新开 3 课小章」时启用。

---

## 4. 大章节设计方案（推荐 · L125–L127）

> 形态：**3 课小章「我看到的和感觉到的」**（单拱：看人 → 换人 → 感觉）；每课目标句 ≤8 词、一课一增量；每课 1 案（4 错＝新 2＋旧 2）；展示层需随批追加 `season-19 {125,127}`（`grammarSeasons.test.ts` 第 4 项硬断言：最高课号必须被覆盖）＋ m21（`afterLesson: 127`，**无测试守门，人工核**）。

| 课 | id（建议） | 主题 | 增量（只此一点） | 目标句 | 接口复现 | 案与罪名（建议骨架） | 封面 | cloze 落点／保障句 | 场景 |
|---|---|---|---|---|---|---|---|---|---|
| **L125** | `lesson-125-look-tired` | 你看起来… | **立岗**：`look` 后面**直接跟那个词**（不加 -ly）——看人 | `You look tired.`（3 词） | L1 `:158` `I am happy.`（be＋形容词老平台）＋ L113 `:21078` `I am bored.`（感到版同族）＋ **垫子转正** L19 `:3438` | `hunt-look-tired` **#134**：新① `looks`→`look`（sv_agreement）② `tiredly.`→`tired.`（**word_order**，先例 #67 `:4270` quick→quickly）｜旧③ L10 `go`→`went`（tense）④ L11 `bag.`→`bags.`（plural） | `cover8` | 落 **look**（实跑）；保障句 `She looks happy.` 落 **looks** | `mansion` |
| **L126** | `lesson-126-looks-happy` | 他看起来… | **换人换形**：他/她/它版加 -s（`looks`）、一群人原样（`look`） | `He looks happy.`（3 词） | L25 `:4528`（小尾巴 -s）＋ **垫子转正** L13 `:2338` `It looks nice!`／L51 `:9353` `Everything looks new.` | `hunt-looks-happy` **#135**：新① `look`→`looks`（He look happy；sv_agreement）② `is`→去掉 is（He is look happy；verb_form，先例 #124 `:7141` `去掉 is.`＝verb_form）｜旧③ L25 `drink`→`drinks`（sv_agreement）④ L19 `is`→`was`（Yesterday he is tired.；tense） | `cover9` | 落 **looks**；保障句 `They look happy.` 落 **look** | `campus` |
| **L127** | `lesson-127-feel-tired` | 我觉得…（收口） | **感觉版 `feel`**：它也能站在那个词前面（「我觉得／我感觉」）——与「是」「看起来」排一行 | `I feel tired.`（3 词） | L76 `:14058` `I feel much better today.`（老锚）＋ L113 `:21078` ＋ **垫子转正** L87 `:16168` `You look cold.`；隔离卡引 L49 `:8977`（**认读，不教学**） | `hunt-feel-tired` **#136**：新① `feel`→`feels`（She feel tired；sv_agreement）② `tiredly.`→`tired.`（word_order）｜旧③ L11 `clock`→`clocks`（plural）④ L25 `have`→`has`（sv_agreement） | `cover10` | 落 **feel**（词表外，② 档实词回退仍落 feel，实跑）；保障句 `It looks new.` 落 **looks** | `mansion` |

**一课一增量硬纪律（写入生产规格）**：L125 **只做「后面直接跟那个词」**（**不碰换人**、不碰过去版 `looked`——`looked` 全库仅 L76 `:14076` 一处，本批冻结）；L126 **只做换人换形**（**不重讲 L25 的规则本体**，只做「同一个 look 跟不同人」）；L127 **只做 `feel`**（**不新教 `look like`**，`look like` 只在 ❌ 卡里以「今天不说它」出现一次）。
**全批不引入**：`look like` 教学／`look as if`／`sound`／`smell`／`taste`／`looked`（过去版）／形容词＋介词／`have sth done`／B1 下一个 `to` 结构（`look forward to`／`object to`——两文件实测 `forward` GL 0／HC 0，**不构成同窗风险，但纪律照守**）。
**封面**：`L125←cover8`／`L126←cover9`／`L127←cover10`（**min-gap 117**，穷举为理论最优）；❌ `cover1`–`cover7` **禁用**（二用张，间距 ≤7）；可用池 `cover8`–`cover90`（83 张）内互换。**池外零新资产**。
**展示层**：`grammarSeasons.ts` 末项 season-18 后追加 `{ id: "season-19", label: "第十九季 · 我看到的和感觉到的", hint: "看起来累、看起来开心、我觉得累——「看」和「感觉」都能站到那个词前面", min: 125, max: 127 }`；`GrammarPathPage.tsx` m20（`:254-260`）后追加 **m21（`afterLesson: 127`）**——**m 无测试引用（既证实跑 `can-do-m*` 测试引用数 0），漏加不报错，须人工核**。

---

## 5. 中文负迁移专项（逐课）

> 中文「看起来」后面跟的是形容词，且中文没有「加 -ly」这一步——负迁移有两个方向：**A. 过度加 -ly**（把 L58／L59 的规则套到 look／feel 后面）；**B. 漏掉「看起来」这一层**（中文「你累了吧」直接说成 `You tired.`）。
> ⚠️ 本轮引用的 4 条中文 ❌ **来自批十八竞析（EC-3／EC-4），本轮未独立复取原文**（标注：推断级引用）。

**L125（看人：`look` 后面直接跟那个词）**
- ❌ `You look tiredly.`（＝A 型，中文「很累地」直译）→ ✅ `You look tired.`；设计含义：**第 1 张对比卡就上 ❌**（`wrongMark: "tiredly"`，whyZh 用 L58 `:10664` 的「样子词」话术反着说：「tiredly 是『做的事的样子』——可你这里不是说他怎么看你，是说他看上去什么样」）。
- ❌ `You look very tiredly.`（中文「很」的位置也搬过来）→ ✅ `You look very tired.`（very 照旧站在那个词前面，L59 `:10851` 已教 very 的位置）。
- ❌ `You are look tired.`（中文「你是看起来累」）→ ✅ `You look tired.`；设计含义：#134 的 verb_form 新错即取此形（先例 #124 `去掉 is.`＝verb_form）。
- ❌ `You tired.`（B 型漏「看起来」）→ ✅ `You look tired.`；设计含义：**双正解卡**并排 `You look tired.` ✅／`You are tired.` ✅（两句都对——一句是看起来，一句是就是），**这一卡同时完成与 L113 的切开**。

**L126（换人换形：他/她/它加 -s）**
- ❌ `He look happy.` → ✅ `He looks happy.`；设计含义：#135 新错①，whyZh 直接请 L25 `:4528`「他、她、它做事，动词后面要加个小尾巴 -s」回来，**只换主角不重讲规则**。
- ❌ `They looks happy.` → ✅ `They look happy.`；设计含义：**双正解卡**并排 `He looks happy.` ✅／`They look happy.` ✅（换人不换句型——一课一增量的展示面）。
- ❌ `He is look happy.`（中文「他是看起来开心」）→ ✅ `He looks happy.`（一句话只要一个「发动机」，先例 #123／#124 的 `去掉 is.`）。
- ❌ `He looks happily.` → ✅ `He looks happy.`（把 L59 `:10851` 的 `good→well` 规则过度套用；**这一句留给 L127 的 ❌ 卡**，因为中文侧的四条 ❌ 里正有一条是 `smells so good` 不是 `well`）。

**L127（感觉版：`feel` 与「是」「看起来」三脸排一行）**
- ❌ `I feel tiredly.` → ✅ `I feel tired.`；中文侧原文 ❌ `Your skin feels so smooth.`（不是 `smoothly`）——**同一型，narrative 可直引「摸起来滑」这种说法**。
- ❌ `I am feel tired.` → ✅ `I feel tired.`（中文「我觉得」没有 be 那层）。
- ❌ `I feel well.` 想说「我觉得身体好」→ ✅ `I feel good.`／`I feel fine.`；**注意与 L59 的分工**：`well` 是「做得好」的样子词（`She sings very well.` L59 `:10846`），`feel well` 在中级英语里合法但语义是「身体好」，**A2 段不教，L127 不碰，仅作教师备注**（推断：避免与 L59 抢地盘）。
- 三脸并排（收口卡）：`You look tired.` ✅／`You are tired.` ✅／`I feel tired.` ✅——**三句都对，说的是三件事**（看起来累／就是累／我觉得累）。

---

## 6. 体验建议

1. **场景锚（零新造）**：L125 `mansion` 客厅早晨（接口 L76 `:14057` 同场）→ L126 `campus` 擦干净的教室（接口 L51 `:9353`）→ L127 `mansion` 书桌（接口 L76 `:14075`）。**不引入新场景 id**（在用 11 种）。
2. **零术语话术（本批最危险的两个禁用词＝「形容词」「副词」，均在 29 词表内）**：
   - `look + 形容词` → 「**后面直接跟那个词**」「**说它看上去什么样**」（不说「形容词」）；
   - `-ly` 那一类 → 「**做事的样子**」「**样子词**」（沿用 L58 `:10664` 现成话术，“样子词”是库内既有词，非新造）；
   - `feel` → 「**我觉得**」「**我感觉**」（不说「感官动词」「系动词」）；
   - ❌ 卡里的 `tiredly` → 「**多加了一条小尾巴**」。
3. **复现设计（跨批钩子）**：L125 三处（L1／L113／L19 垫子转正）｜L126 三处（L25／L13／L51）｜L127 四处（L76／L113／L87／**L49 认读隔离**）。**「垫子转正」是本批独有优势**——16 句已在库里当对白出现过，SRS 复现题可直接引原句**一字不改**。
4. **cloze 保障句（逐课，实跑已验）**：L125 `She looks happy.` 落 looks｜L126 `They look happy.` 落 look｜L127 `It looks new.` 落 looks。**三句保障句落点全在一档**（词表内）；目标句落点＝语法词本身（look／looks／feel），**不存在批十八「`used` 落不动、要靠保障句兜」的问题**。
5. **时长与词长**：6–8 分钟／课；目标句 3 词（三课全 3 词，**本批史上最短**，对比卡与 deepDive 承担余量）；deepDive 每课 ≤4 段（沿用 L119–L124 形态）。
6. **对比卡与 G-boost 护栏**：每课 6 条，**≥2 条带 `wrongMark` 的真错卡（建议 3 条，禁止贴线）**；`wrongMark` 不得为纯标点（建议：`tiredly`／`looks`／`look`／`feel`／`happily`）；`guided.spot` 的 `wrongToken` 与 tokens 逐字相等。**双正解卡建议 3 组**（`You look tired.` ↔ `You are tired.`／`He looks happy.` ↔ `They look happy.`／`You look tired.` ↔ `I feel tired.`），生产时逐组跑 diffScore（<90）。
7. **案件提示**：三案 tokens 建议一律「4 句短句排一行」（先例 #128 `:7310-7315` 同款），旧错回流**只取 L10／L11／L19／L25**，**0 处 `fragment`／`run_on`**（沿用批十八纪律；fragment/run_on 各 14 处为全库最薄，留待后续批次正落）。

---

## 7. 后续研究建议

**假设待验（走查／遥测）**
1. **「看起来」与「是」能否一次分清**——L125 首玩是否能复述「后面直接跟那个词」并说出 `You look tired.` ✅／`You are tired.` ✅ 都行但意思不同（走查点，对应批十八 F18-A 同款）。
2. **A 型负迁移（过度加 -ly）是否被 ❌ 卡接住**——误答回流率：`You look tiredly.` 的选错率。
3. **垫子转正的正迁移**——L125 走查时问「这句你见过吗」，若学生答「见过」（L19 `:3438`／L87 `:16168`），说明认读层已成垫。

**待复核（生产期）**
4. **`looks`／`looked` 在 boost cloze 干扰项池里的形态**——`look` 不在 `KNOWN_VERBS`（实读 `:325-341`），cloze 干扰项走「课程词汇池长度相近词」，**本批题型是否出现 `looked`／`looks` 的混选项须实跑登记**（推断风险，未实跑）。
5. **封面 `cover8`–`cover10` 逐张目视语义**（本轮已看 `lesson-9`／`lesson-10`：贴 campus／mansion；`lesson-8` 为车厢内景，与「看人」场景相称性待复核）。
6. **#134–#136 逐 token `tokenIndex` 与 `tokens` 对位**（本章程骨架为建议，析客 PRD 定稿时逐 token 核）。

**待主理人裁决**
7. **形态**：3 课小章（推荐）vs 折入他章作第 2–3 课（`feel` 有掉的风险）。
8. **展示层**：`season-19 {125,127}` ＋ m21（`afterLesson: 127`）是否随批上线（**season 有守门、m 无守门**）。
9. **`looked`（过去版）是否继续冻结**——全库仅 L76 `:14076` 一处；本批设计不教，若主理人认为「昨天看起来…」是高频缺口，可在 L127 后追加 1 课（**会破 3 课小章形态，我建议不追加**）。

**未核实**
10. **无真实遥测**（样本＝1）；**无「核心 500 词」机检资产**——`tired`／`happy`／`looks` 是否超纲无法机检（但 `tired`／`happy` 在 L1 `:158`／`:276-279`、L113 均已用，属库内既有词）。
11. **上游课位引批十八竞析**（Cambridge 词典 `look` (SEEM) 标 A2／`Look as a linking verb` 专节／Murphy 中级 U99 标题 `you look tired`），**本轮未独立复取原文**。
12. **中文侧 4 条副词误用 ❌ 未独立复取**（引自批十八竞析 EC-3／EC-4）。
13. **批十八 F18-A／F18-B 与批十七 F17-A／F17-B 均未回**；本报告的「批十八已交付」前提**已由文件实读证实**（L119–L124 在盘、124 课／133 案／测试 761 项全绿），但**教学效果未经遥测验证**。

---
> 本研究报告由产品战略团队瑞思执笔，经主理人汇编落盘。重要决策请由产品负责人审定。
