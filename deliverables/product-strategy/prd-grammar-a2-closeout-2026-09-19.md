# PRD：第十七批 · A2 收尾缺口补课章（8 课 L111–L118）

**日期**：2026-09-19 ｜ **类型**：功能规格书（PRD）｜ **成员**：析客（需求分析）
**上游输入**：主理人裁决（8 课 L111–L118＝「我一直想说的那些」单拱大章节；开 season-17＋m19；封面＝纯二用升三用 8 张）；本批三研究（瑞思 `user-research-grammar-seventeenth-batch-2026-09-19.md`／竞析 `competitive-analysis-grammar-seventeenth-batch-2026-09-19.md`／数析 `data-audit-grammar-seventeenth-batch-2026-09-19.md`，均 2026-09-19）；批十六 PRD `prd-grammar-causative-2026-09-19.md`（格式与护栏基线）

## 📝 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1 | 2026-09-19 | 初稿：8 课（L111–L118）＋8 案（#120–#127），开 season-17、m19；定位「第五个大章节 · 单拱——A2 四处官方课位关账」 |
| v1.1 | 2026-09-19 | 采纳主理人两处修正：L112 增量改为「`'s` 与 `mine` 的分工」（校正竞析 §⑤-1），L112 案 id 定为 `hunt-whose-book-mine`；L115–L116 档位标注统一为「B+ 档·说法扩充」 |

## 📌 TL;DR

1. **批十七＝8 课（L111–L118）「我一直想说的那些」大章节·单拱**：物主 `'s`（奶奶的生日）→ `'s` 与 `mine` 的分工（这本是我的）→ `-ed/-ing` 分工（我很无聊）→ `a few / few`（只剩几个了）→ `have got`（我有一辆新自行车）→ `has got`（她有一个新包）→ 四点合体 → 章末零新知收口；开 **season-17（{111,118}）＋m19（afterLesson 118）**，批量 118 课、127 案。
2. **选题＝BC 官方 A1-A2 索引 18 课逐条点目后剩下的 4 处课程位空缺**（瑞思 §1 ①、竞析 §①）——物主 `'s`／`-ed/-ing` 形容词／`few·a few·little·a bit of`／`have got`，这 4 处在 **Murphy 双册各有独立单元**（初 U64／中 U81；中 U98；初 U84／中 U87；初 U9／中 U17）＝**A 档（跨源官方课位）**。**批十一「A2 结构收官」宣告不完整**：本批的正面答案是**先把 A2 关账**，不是跳 B1（甲 `be/get used to` 列批十八首选，见 §1.2）。
3. **单拱一条线「说说身边的人和事」**：家里的人（L111–L112）→ 心里的感觉（L113）→ 桌上的东西有多少（L114）→ 手里的东西哪来的（L115–L116）→ 合体（L117）→ 收口（L118）。四点各有独立平台，**一课一增量轴＝四处缺口各占一格**。
4. **诚实的档位标注（本批纪律）**：L111／L113／L114＝**A 档**；L112＝**A 档（但增量经校正）**——`mine` 已由 **L33 `:5931` 教透**（target 句即 `This one is mine.`、`:5937` oneLineRule、`:6001` deepDive 明写「my 是小标签…mine 自己就能当主角」），**真实空白是「`my brother's` 与 `mine` 的选用」**，不是 `mine` 本身（**采竞析 §⑤-1 校正，勿沿用瑞思 §2 T11 的旧口径**）；L115／L116＝**B+ 档「说法扩充」**（增量性质是同义换挡，**不作章主锚**，须防与完成时混淆）；L117／L118＝**自研**。
5. **中文负迁移打透两句**：`*I am boring.`（想说「我很无聊」说成「我很没意思」——**中文「无聊」一个词管两头**）＝真错第一名，L113 攻；`*Grandma birthday is in May.`（漏撇号）＝L111 攻。
6. **案件 8 案（#120–#127）**：4 错＝新 2＋旧 2、单 token 可修、≥1 净词、`reviewed: true`；罪名全落 10 枚举、**不碰 comparison**；旧错回流只取 L10/L11/L19/L25；**避开 fragment／run_on 连续同型**（批十五 #103、批十六 #111 刚用过——瑞思 §1 ⑨ 纪律），**本批带上 `article`（24，最薄档之一）**。
7. **封面＝纯二用升三用 8 张（单次池已归零）**：`L111←cover29／L112←cover42／L113←cover25／L114←cover7／L115←cover2／L116←cover3／L117←cover4／L118←cover1`（最优最小间距 **35**，数析 §5.2 二分图实算＋穷举验证）。❌ `cover49` 永久禁用（内部段距仅 9）；批十五刚三用的 10/16/18/20/21/26/31/32 勿碰；批十六刚二用的 41/45/47/48 不做四用。
8. **G-boost 硬护栏**：每课 contrast **6 条中 ≥2 条为带 `wrongMark` 的真实错卡（推荐 3，禁止贴线）**；`wrongMark` 不得为纯标点（L89 前车之鉴）；**`guided.spot` 的 `wrongToken` 必须与 tokens 元素逐字相等**（L96 `:17905`／L102 `:19044` 曾因 `"rain"` vs `"rain."` 不匹配致题目静默消失，本批逐课核对、不依赖 `grammarBoostService.ts:678` 的 `cleanWord` 兜底）。

## 🎯 核心结论卡片

| 项目 | 内容 |
|---|---|
| 推荐方案 | 8 课 L111–L118「我一直想说的那些」单拱大章节：物主 `'s` 1 → `'s` vs `mine` 1 → `-ed/-ing` 1 → `a few` 1 → `have got` 1 → `has got` 1 → 合体 1 → 零新知收口 1；8 案 #120–#127；开 season-17＋m19 |
| 优先级 | P1（内容生产批次）；无 P0 阻断项 |
| 预期影响 | 第五个大章节；**A2 四处官方课位关账**（跨源 A 档）；补 `article`（24，最薄档之一）承载位；首次「案件回流课程」（HC #16 `:771`／#17 `:826` 的 `excited` 转正）；L56 `:10222`／`:10278` 孤例转正；兑现 L67 `:12362`／`:12365` 的门牌家族扩员 |
| 资源需求 | ≈5 人日（内容 4＋展示层 0.25＋走查 0.5＋验收 0.25）；两段式跨 2 周 |
| 风险等级 | 中（`a few` 的 a 丢失率未验；`interested in` 过度泛化；`have got` 增量偏薄；连续第五个大章节的疲劳；封面全部三用后容量见底） |
| 硬性范围红线 | 课量 8 不扩不缩；一课一增量；L118 零新知；六段式；每课 1 案（4 错＝新 2＋旧 2、单 token 可修）；对比卡 6 条（**≥2 条带 wrongMark**）；零术语词表；comparison 不进案件；tagStats=10 不动；L1–L110 零改动；封面池外零新资产 |

## §1 批次定位与选题裁决

### 1.1 产品负责人命题（A2 之后走什么）

批十六路线图 §4.6 留了三问：① A2 之后走什么；② 批十七是否维持 8 课；③ 连续第五个大章节是否疲劳。本轮三研究把①正面答掉了：**批十一宣告的「A2 结构收官」并不完整**。

**证据链（瑞思 §1 ①／竞析 §①）**：BC 官方 **A1-A2 索引共 18 课**，逐条点目后我方覆盖 14 条（Articles→L8／L30；Comparative→L17／L31；Infinitive of purpose→L44；countable/uncountable→L30；Past cont vs past simple→L99；Prepositions of place／time→L18／L79–81；Present simple→L25；to be→L1／L2／L7；Question forms→L27；there is/are→L26；Verbs followed by -ing or infinitive→L42／L45／L46），**尚余 4 处课程位空缺**：

| # | BC A1-A2 课位 | Murphy 双册位置 | 我方现状（实读） |
|---|---|---|---|
| 1 | `Possessive 's` | 初级 **U64**「-'s (Kate's camera / my brother's car etc.)」／中级 **U81**「-'s … and of」 | **半曝**：`'s` 形态 221 处剥离缩写后**只剩 2 处名词所有格**——L56 `:10222` `Grandma's birthday is in October.` 与 `:10278` `Grandpa's birthday is in October.`（examples＋sceneSwings 各一次，**从不作 target、不进 practice、不作对比卡**）；HC 侧 3 处半曝（#15 `:687` `"grandma's"`／#42 `:2636` `"teacher's,"`／#65 `:4121` `"Dad's"`，**全是 tokens 里的正确形态**） |
| 2 | `Adjectives ending in '-ed' and '-ing'` | **中级 U98**「Adjectives ending in -ing and -ed (boring/bored etc.)」（**初级无**，U85 是通用形容词） | **真空白**：`bored`／`boring`／`interested`／`excited`／`exciting` GL **全 0**；`interesting` GL 1（L17 `:3059` 长形容词例子）；`tiring` GL 1（L92 `:17188` **仅 distractor**）；HC 侧 `excited` **先考后教倒挂**（#16 `:771` 单 token 修 `excite→excited`、#17 `:826` 缺 be） |
| 3 | `Quantifiers: 'few', 'a few', 'little' and 'a bit of'` | 初级 **U84**「(a) little (a) few」／中级 **U87** | **真空白**：`a few`／`few`／`a bit of` GL＋HC **全 0**；`a little` GL **1**（L70 `:12871` 对白孤例 `I am a little thirsty.`，从未作教学目标）；台阶在 L30 `:5389` oneLineRule「数得清的用 many，数不清的用 much」 |
| 4 | `Present simple: 'have got'` | 初级 **U9**「I have and I've got」／中级 **U17**「have and have got」；Cambridge 另有 `have-got` 专页 | **真空白**：`have got`／`has got`／`'ve`／`'s got` **三形态两文件全 0**（本轮复读：`'ve` GL 0／HC 0）；平台在 L3 `:435` `I have a new bag.` 与 L16 `:2816` `I have to get up early.` |

**核心论据**：这 4 处**不是「词典型·中文需求驱动」**（批十一型），而是**跨源官方课位（A 档）**——BC 课位在册 ＋ Murphy 双册各有独立单元。竞析 §③ 三问制判读：丁-1（`'s`）A／丁-2（`-ed/-ing`）A／丁-3（`few·a few`）A-／丁-4（`have got`）B+（**唯一诚实降档项**，因中文侧四度零专文）。

### 1.2 三研究结论与主理人裁决

| 方案 | 三研究结论 | 主理人裁决 |
|---|---|---|
| **乙·A2 收尾缺口补课章 8 课（L111–L118）** | 瑞思 §0 推荐（「四处缺口全部有 BC A1-A2 官方课位背书，且零件几乎全在库」）；竞析 §④ **首选**（「6 个增量点全部有 BC A1-A2 官方课位＋Murphy 双册独立单元，是跨源硬位」）；数析给 6/7/8 三档封面方案并证 8 课可行（§5.2） | **✅ 拍板：乙 8 课** |
| **甲·B1 开局章 6 课（L111–L116）** | 瑞思判「备选，建议列批十八首选」；竞析判「A-（位置 B1）但两个硬伤」——① 段位（B1）；② **话术冲突**：L93 `:17294` 明文「to 后面永远穿原样」，而 `be used to + -ing` 要求 `to` 接名字版 | **❌ 不进本批；列批十八首选** |
| 丙 散点补漏（`so that`／`neither`／`already` 等 11 项） | 瑞思 §2 T8 判「无共同语义场与场景锚，强凑即稀释一课一增量」；数析 §1.6 判「只能按 2–3 个语义家族组章，不能 11 项平铺」 | ❌ 不做 |
| 丁 混合（乙 6＋甲 2） | 瑞思 §3「甲的 2 课在乙方案里没有落点，硬拼成双拱既要背双线代价、又要担 `to + -ing` 的话术冲突」 | ❌ 不做（单拱） |
| `have sth done`（甲之丙） | 竞析 §② 判 C 档：BC **三档全目零课位**（A1-A2 18 课／B1-B2 36 课／C1 14 课均无）；Murphy 仅中级 U46；我方招牌句零件 `hair` GL 0、`cut` GL 0、`will have` 0、`'ll` 全库 0 | ❌ 维持撤出 |

**8 课 vs 6/7 课的裁决依据**（写清「为什么不缩」，见 §2.1）。

### 1.3 批次定位：单拱——一条「说说身边的人和事」线

本批是**第五个大章节**，取**单拱**（批十五、批十六均已单拱，不再破例；双拱只在批十四破过一次）。素材全部落在「身边」这一条线上：

家里的人（L111 奶奶的生日／L112 这本是我的）→ 心里的感觉（L113 我很无聊）→ 桌上的东西有多少（L114 只剩几个了）→ 手里的东西哪来的（L115 我有一辆新自行车／L116 她有一个新包）→ 串成一段（L117）→ 收口（L118）。**不跨场景跳**。

**档位标注（诚实标注，本批纪律）**：

| 课 | 增量 | 跨源档 | 依据 |
|---|---|---|---|
| L111 | 物主 `'s` | **A** | BC A1-A2 第 9 课位＋Murphy 双册各一单元（初 U64／中 U81） |
| L112 | `'s` 与 `mine` 的分工 | **A（增量经校正）** | BC 课位在册；**`mine` 本身已由 L33 `:5931`／`:5937`／`:6001` 教透**，真实空白是「`my brother's` vs `mine` 的选用」（竞析 §⑤-1） |
| L113 | `-ed/-ing` 分工 | **A** | BC A1-A2 第 2 课位（A1＋A2，10 组成对）＋Murphy 中级 U98；**跨源分级不一致须诚实标注**：BC 在 A1-A2，Murphy 在中级 U98——**不得混述为「A2 双证」**（瑞思 §1 ④ 待复核 ⑤） |
| L114 | `a few / few`（＋`a little`） | **A-** | BC A1-A2 第 15 课位＋Murphy 初 U84／中 U87；中文侧仅 `quantifiers` 专文**无明文负迁移** |
| L115–L116 | `have got`／`has got` | **B+·说法扩充** | BC A1-A2 第 13 课位＋Murphy 初 U9／中 U17＋Cambridge `have-got` 专页；**但中文侧四度零专文，增量性质＝同义换挡（说法换挡）而非新能力**——**不作独立章主锚**（竞析 §③ 丁-4） |
| L117 | 四点合体 | **自研** | 收口先例 L54 `:9823`／L78 `:14362`／L94 `:17400`／L102 `:18919`／L110 `:20418` |
| L118 | 零新知收口 | **自研** | 同上 |

> **口令一句**：本批**不新造语言能力**，只是把 A2 官方课位上的四处空格填满；L115／L116 连「新结构」都算不上（同一个「有」，口气更轻）。

## §2 拆课方案与逐课规格

### 2.1 课量决策：8 课（L111–L118）

| 方案 | 取舍 | 裁决 |
|---|---|---|
| 6 课（砍 L112、L116） | L112 是「`'s` vs `mine`」的收口位（教了 `'s` 不教与 `mine` 的分工，学生会在 `my brother's`／`mine` 之间乱选）；L116 砍掉则 `has got` 无处教（L115 只教 I/you/we/they 版） | ✗ |
| 7 课（L115／L116 并成一课） | 并课即「一课两点」（`have got`＋`has got` 同课），破一课一增量；且 7 课破坏每课 1 案配平（8 案→7 案） | ✗ |
| **8 课** | 4 处缺口 × 2 课深化（L111–L112／L113 单课打透／L114 单课／L115–L116）＋合体 1 ＋ 收口 1；**8 项独立、互不重叠，去掉任一项即掉到 7**（瑞思 §4 8 项校验） | **✓ 拍板（主理人）** |

**为什么不缩到 6 课**（正面回答主理人「批十七是否维持 8 课」）：4 处缺口各自需要「立岗课」；L112（`'s` vs `mine`）与 L116（`has got` 换人换形）**不是复述课**——竞析 §⑤-1 已校正「`mine` 已教透」的旧口径，反过来说明**真正的空白点在「选用关系」上**，恰恰需要一课把两张脸并排切开；`has got` 同理（L115 只立 `have got`，第三人称换形是独立一格）。砍任一处都掉到 6 课，**不是注水，是缺口数决定课数**。

课表（课注 id 已冻结）：L111 `lesson-111-possessive-s`｜L112 `lesson-112-this-is-mine`｜L113 `lesson-113-bored-boring`｜L114 `lesson-114-a-few`｜L115 `lesson-115-have-got`｜L116 `lesson-116-has-got`｜L117 `lesson-117-all-i-wanted`｜L118 `lesson-118-close-17`

**封面（纯二用升三用 8 张，单次池已归零）**：`L111←cover29`｜`L112←cover42`｜`L113←cover25`｜`L114←cover7`｜`L115←cover2`｜`L116←cover3`｜`L117←cover4`｜`L118←cover1`。
- **数析 §5.2 实算**：8 课最优**最小间距 35**（二分答案＋二分图完美匹配，再以 9 张可用 × 8! 穷举验证 max-min＝35、max-sum＝288）；**可用张只有 9 张**（1·2·3·4·5·7·25·29·42），其余 28 张天花板 <35。
- **本 PRD 采纳的指派与数析 §5.2 施工口径的差异（须按本 PRD 执行）**：数析把 `cover29` 放最晚课（L118），把 `cover1` 放 L114；主理人裁决的指派是 **`L114←cover7`／`L118←cover1`**。两者 min-gap 同为 35、sum 同为 288（同为最优解，**穷举已证多解**）。**执行以本节为准**，逐张实测三用后间距：`cover29`（前两次 L29/L75 → 新用 L111）＝min(111−75, 75−29)＝**36**；`cover42`（L42/L77 → L112）＝min(35, 35)＝**35**；`cover25`（L25/L78 → L113）＝中 min(35, 53)＝**35**；`cover7`（L7/L76 → L114）＝min(38, 69)＝**38**；`cover2`（L2/L80 → L115）＝**35**；`cover3`（L3/L81 → L116）＝**35**；`cover4`（L4/L82 → L117）＝**35**；`cover1`（L1/L79 → L118）＝min(39, 78)＝**39**。**全局最小间距 35（`cover42`／`cover25`／`cover2`／`cover3`／`cover4` 五张同时压线）**。
- ❌ **`cover49` 永久禁用**（两段间距仅 9：L49 `:8889` 与 L58 `:10586`）；**批十五刚三用的 10/16/18/20/21/26/31/32 勿碰**（升四用最优值 8–31，全部低于 35 可用线）；**批十六刚二用的 41/45/47/48 不做四用**（天花板 12–15）。
- **池外零新资产**：`cover` 在 `types.ts:590` 为可选字段（`cover?: string`），缺省回退 scene SVG——**封面池耗尽不阻断上线**。
- **未核实项（沿用批十六口径）**：本指派按**编号间距实算**，**未做图像语义核对**——9 张可用张的画面内容与 L111+ 场景是否相称须逐张人工确认（数析 §5.3 注、批十六 PRD §2.1 同款声明）。

**episode 写法**：`小美的一天 一百一十一` … `一百一十八`（>100 已有先例：L103–L110 的「一百零三…一百一十」共 11 例，无格式风险；末课现为 L110 `:20421` `小美的一天 一百一十`）。

**scene 取值**（须落在 `types.ts:587` `scene: string` 的既有场景集内，实读在用值：`campus` 33／`mansion` 31／`city` 20／`sparkle`／`school`／`island`／`train`／`mystery`／`magic`／`forest`／`snow`）：本批一律取 `mansion`（家里）或 `city`（外面），**不引入新场景 id**。

### 2.2 逐课规格

> **通用说明（8 课共同）**：六段＝① 看（情景讲解）→ ② 跟（guided：choose／arrange／spot／replace）→ ③ 忆（recall）→ ④ 练（practice ≥4 题）→ ⑤ 破（侦探挑战＝huntCaseIds）。本批 8 课**全部配 recall**（L13 起的硬约定：`grammarLessons.test.ts:68-79` 断言 `number >= 13` 必须有 recall 三字段）。所有 `examples`／`practice`／`variants`／`contrast`／`deepDive`／`summary` 字段名与形态沿用 `types.ts:580-618`。

**L111 奶奶的生日（物主 `'s`）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-111-possessive-s`；`number: 111`；episode「小美的一天 一百一十一」；scene `mansion`；cover `cover29` |
| title / grammarLabel | 「奶奶的生日」/「谁的 · 人后面加撇号 s」 |
| targetSentence | `Grandma's birthday is in May.`（5 词，≤8 ✓；cloze 实跑落 **is**——①语法词，正中 be 平台） |
| sceneSetupZh | 家里挂历前，小美在 12 个月格子上圈生日，给全家人的生日排顺序（**接 L56 `:10208` 同场景**） |
| intentZh | 奶奶的生日在五月。 |
| 场景 | 家里挂历前：家里人一个接一个圈生日 |
| 新知识点 | **只有一件**：人后面加撇号 s ＝「谁的」，贴在东西前面——`Grandma's birthday`（**不碰 `of` 结构**，`of` 只作 1 张对照卡） |
| 一句话规则（oneLineRule） | 「『谁的』贴在东西前面：**人后面加个撇号 s**——Grandma's birthday。中文一个『的』管到底，英语里人和小标签走两条路。」 |
| 对比卡 6 条方向 | ① `Grandma birthday is in May.` ❌（**wrongMark `Grandma`**，word_order——漏撇号，**本课头号错**）；② `The birthday of Grandma is in May.` ❌（**wrongMark `of`**，preposition——中文「的」直译 of；**只作 1 张对照卡，不主打**：of 结构超 A2，且 Murphy 中级 U81 是把 `'s` 与 `of` 并讲的，故对照卡有依据、不必单开课）；③ `Grandma's birthday is on May.` ❌（**wrongMark `on`**，preposition——L56 `:10232` 原卡回流：月份是大格子用 in）；④ **双正解**：`Grandma's birthday is in May.` ✅ 并排 `Grandpa's birthday is in October.` ✅（**L56 `:10278` 孤例转正**，换人不换规矩）；⑤ **复习卡（L8 `:1350`）**：`She is my friend.` ✅——**my 是小标签，永远贴在东西或人的前面**（今天是它的姊妹：`Grandma's`）；⑥ **复习卡（L56）**：`My birthday is in May.` ✅——先有「我的生日」，今天给它添上「谁的」这一层 |
| 变体三态 | 肯定 `Grandma's birthday is in May.`（cloze 落 is）／否定 `Grandma's birthday is not in May.`（noteZh：「我的那份」不动，not 跟 is 走）／疑问 `Is Grandma's birthday in May?`（noteZh：Is 搬句首，`Grandma's birthday` 整块不动） |
| 复现题设计（practice ≥4） | 第 1 题 target＋变体逐字题（否定或疑问变体，`grammarLessons.test.ts:10` 硬断言）；**第 2 题保障句 `My brother's car is new.`**（cloze 实跑落 **is**——主考点所在；换人不换规矩）；第 3 题复现 L56 原句 `My birthday is in May.`；第 4 题复现 L8 原句 `She is my friend.`。**每课 ≥1 复现题 ✓** |
| 案件规划 | `hunt-grandmas-birthday`（#120，§6）；新错 **word_order＋preposition**（#120 ①漏撇号／②`on→in`）；旧错 tense（L10）＋plural（L11） |
| 六段要点 | ① 开场引 L56 `:10208`（挂历前）＋L8 `:1350`（小标签老话术）；② guided：`choose` 落 `Grandma's`／`arrange` ≤5 token／**`spot`（`tokens: ["Grandma", "birthday", "is", "in", "May."]`，`wrongToken: "Grandma"`——逐字相等，不带尾标点）**／`replace`「把 Grandma 换成 Grandpa」；③ recall 三字段（promptZh 给挂历场景、intentZh「奶奶的生日在五月。」、answer＝target、noteZh「人后面加个撇号 s——谁的」）；④ practice 4 题；⑤ 破 `hunt-grandmas-birthday`。 |
| 术语红线自查 | `grammarLabel`／`oneLineRule`／`summary.rule` 三字段**禁出现** 29 词（全表见 §5 G2-b）。本课用「谁的／撇号 s／小标签／大格子」 |

**L112 这本是我的（`'s` 与 `mine` 的分工）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-112-this-is-mine`；`number: 112`；episode「小美的一天 一百一十二」；scene `mansion`；cover `cover42` |
| title / grammarLabel | 「这本是我的」/「长版 vs 短版 · mine 自己站，撇号 s 贴东西」 |
| targetSentence | `This book is mine.`（4 词，≤8 ✓；cloze 实跑落 **is**） |
| sceneSetupZh | 客厅茶几上摊着两本书，一本写着名字，一本没写——哪本是谁的一眼分不清 |
| intentZh | 这本是我的。 |
| 场景 | 家里：两本书摆一起，一本是**哥哥的**、一本是**我的**——两个人两种说法 |
| 新知识点 | **只有一件**：**小标签后面没东西时用长版**——`This is my book.`（小标签 my ＋东西 book）↔ `This book is mine.`（长版自己站，后面空着）；再加一格：东西属于**某个人**时说 `my brother's`（人＋撇号 s，后面也不带东西）。**⚠️ 校正说明**：`mine` 本身**不是空白**——L33 `:5931` target 句即 `This one is mine.`、`:5937` oneLineRule 明写「『我的（东西）』是 mine」、`:6001` deepDive 明写「my 是小标签，必须贴在名词前面（my umbrella）；**mine 自己就能当主角，站句尾**」；**真实空白是「`my brother's` vs `mine` 的选用」**（竞析 §⑤-1 校正；**勿沿用瑞思 §2 T11 的「半空白」旧口径**） |
| 一句话规则（oneLineRule） | 「东西是**谁的**，看后面有没有词：后面还跟着东西，用**短版** my（my book）／`brother's`（my brother's book）；后面空了、句尾收住，用**长版** mine——长短两版，看它后头有没有东西。」 |
| 对比卡 6 条方向 | ① `This book is my.` ❌（**wrongMark `my`**，verb_form——短版站句尾，**L33 `:5957` 同型卡的老错**）；② `This is mine book.` ❌（**wrongMark `mine`**，verb_form——长版后面不能再跟东西，**L33 `:5963` 同型**）；③ `This book is brother's.` ❌（**wrongMark `brother's`**，article——**本课唯一新点**：人＋撇号 s 前面还要有小标签 the／my，光着进不来）；④ **双正解**：`This book is mine.` ✅ 并排 `That book is my brother's.` ✅（**短版长版各一句并排**——一句说「我的」、一句说「哥哥的」，各站各的位）；⑤ **复习卡（L33 `:5937`）**：`This one is mine.` ✅——「我的（东西）」是 mine（**老熟人今天换个场景再站一次**）；⑥ **复习卡（L85 `:15704`）**：`Whose book is this?` ✅——**会问了，今天学会用两种说法答** |
| 变体三态 | 肯定 `This book is mine.`／否定 `This book is not mine.`（noteZh：not 回到 is 后面，mine 不动）／疑问 `Is this book yours?`（noteZh：Is 搬句首；「你的（东西）」是 yours，长版换人不换位——**L33 `:5940`／`:5969` 老搭配**） |
| 复现题设计 | 第 1 题 target＋变体逐字题；**第 2 题保障句 `That book is my brother's.`**（cloze 实跑落 **is**；本课新点所在——短版长版换着来）；第 3 题复现 L33 原句 `This one is mine.`；第 4 题复现 L85 原句 `Whose book is this?` |
| 案件规划 | `hunt-whose-book-mine`（#121，§6）；新错 verb_form＋article；旧错 sv_agreement（L25）＋plural（L11） |
| 六段要点 | ① 开场**显式分工**：第 33 课学过「我的（东西）是 mine」，今天看它跟 `brother's` 怎么分家；② guided：`choose`（`This book ___ .` 选项 `is mine`／`is my`／`is me`）／`arrange` ≤4 token／**`spot`（`tokens: ["This", "book", "is", "my."]`，`wrongToken: "my."`——逐字相等；answer 给 `mine`）**／`replace`「把 mine 换成 yours」；③ recall（promptZh 给「两本书分不清」场景、intentZh「这本是我的。」）；④ practice 4 题；⑤ 破 `hunt-whose-book-mine` |
| 术语红线自查 | 用「短版／长版／小标签／撇号 s／句尾收住」；**禁「所有格」「代词」「物主代词」** |

**L113 我很无聊（`-ed/-ing` 分工）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-113-bored-boring`；`number: 113`；episode「小美的一天 一百一十三」；scene `mansion`；cover `cover25` |
| title / grammarLabel | 「我很无聊」/「感到版 vs 让人版 · -ed 说感到、-ing 说它让人」 |
| targetSentence | `I am bored.`（3 词，≤8 ✓；cloze 实跑落 **am**——①语法词） |
| sceneSetupZh | 雨天下午，作业写完了、电视也没意思——小美趴在沙发上发呆 |
| intentZh | 我很无聊。 |
| 场景 | 家里沙发上：人没劲（感受）；旁边那本书也没劲（它让人没劲） |
| 新知识点 | **只有一件**：`-ed` 说「我感到」、`-ing` 说「它让人」——`I am bored.`（我感到没劲）↔ `The book is boring.`（这本书让人没劲）。**本课是「先考后教」倒挂的转正**：HC #16 `:771`（`excite→excited` 单 token 修）与 #17 `:826`（`We were very excited` 缺 be）**已经考过，课程里从没教过**（瑞思 §1 ④）——**首次「案件回流课程」** |
| 一句话规则（oneLineRule） | 「**感到版**说「我的感受」：I am bored（我没劲）；**让人版**说「它让我这样」：The book is boring（这本书没劲）。同一个中文「无聊」，英语分两张脸——看是谁没劲。」 |
| 对比卡 6 条方向 | ① `I am boring.` ❌（**wrongMark `boring`**，verb_form——**本批真错第一名**：中文「无聊」一个词管两头，想说「我很无聊」说成「我很没意思」）；② `I bored.` ❌（**wrongMark null**，missing_be——直译「我无聊」漏搭档，**复用 L1 `:87`「固定搭档」话术**；**HC #17 `:826` 同型回流呼应**）；③ `The book is bored.` ❌（**wrongMark `bored`**，verb_form——反向错：书不会「感到」，只有人会；**与 ① 成对，一次打透两张脸**）；④ **双正解**：`I am bored.` ✅ 并排 `The book is boring.` ✅——**同一场景两张脸并排**（人 one 张、东西一张）；⑤ **复习卡（L1 `:90`）**：`I am happy.` ✅——**be 后面站的是「我怎么样」**（L1 教「be 不能丢」，本课教「-ed/-ing 分工」，**不抢位**）；⑥ **复习卡（HC #16 `:771` 回流）**：`She was excited about it.` ✅——**案件里考过的说法，今天课上正面认领**（认读级，不展开 `about`） |
| 变体三态 | 肯定 `I am bored.`（cloze 落 am）／否定 `I am not bored.`（noteZh：not 跟 am 走）／疑问 `Are you bored?`（noteZh：Are 搬句首） |
| 复现题设计 | 第 1 题 target＋变体逐字题；**第 2 题保障句 `The book is boring.`**（cloze 实跑落 **is**——**保障句设计说明**：`bored`／`boring` **均不在 `GRAMMAR_WORDS` 表内**（`grammarAmbushService.ts:160-187` 实读，本轮以真 regex 复跑确认 OUT），故**必须让主考点落空位的句子由表内词承载**——本课保障句把空位交给 `is`，考点词 `boring` 留在句面）；第 3 题复现 L1 原句 `I am happy.`；第 4 题复现 L19 原句 `I was busy and happy.`（旧错回流的同课呼应） |
| 案件规划 | `hunt-bored-boring`（#122，§6）；新错 verb_form＋missing_be；旧错 sv_agreement（L19 was/were）＋plural（L11） |
| 六段要点 | ① 开场点名 HC #16／#17「你在案件里见过 excited 这张脸，今天正面教」；② guided：`choose`（`I am ___ .` 选项 `bored`／`boring`／`bore`）／`arrange` ≤3 token／**`spot`（`tokens: ["I", "am", "boring."]`，`wrongToken: "boring."`——逐字相等；answer 给 `bored`）**／`replace`「把 I 换成 The book，说法怎么变」；③ recall；④ practice 4 题；⑤ 破 `hunt-bored-boring`。**中段自走查点（本批最大未知）**：学生能否一次分清 `bored`／`boring`（瑞思 §7 假设 ①） |
| 术语红线自查 | 用「感到版／让人版」；**全禁「形容词」「分词／过去分词」「被动」** |

**L114 只剩几个了（`a few / few`，＋`a little`）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-114-a-few`；`number: 114`；episode「小美的一天 一百一十四」；scene `mansion`；cover `cover7` |
| title / grammarLabel | 「只剩几个了」/「a 的有无 · 有 a 是还有几个，没 a 是几乎没了」 |
| targetSentence | `There are a few apples.`（5 词，≤8 ✓；cloze 实跑落 **are**——①语法词） |
| sceneSetupZh | 果盘端上桌，苹果只剩几个——小美数了数（**接 L30 `:5384` 同场景**：那课是「桌上有一些苹果」，今天是「只剩几个了」） |
| intentZh | 桌上还有几个苹果。 |
| 场景 | 家里：桌上果盘里剩几个苹果，数得清；冰箱里还有点牛奶，数不清 |
| 新知识点 | **只有一件**：**a 在不在，意思反一半**——`a few apples`＝还有几个（够）／`few apples`＝几乎没了（不够）；旁边再站一格 `a little milk`（数不清的东西版）。**接 L30 `:5389`**：「数得清的用 many，数不清的用 much」——**`a few` 是 `many` 的下一格、`a little` 是 `much` 的下一格**（**不重讲 some／any／much／many**） |
| 一句话规则（oneLineRule） | 「**a 是一块小招牌**：挂上它＝还有几个（a few apples）；不挂＝几乎没了（few apples）。数得清的用 few／a few，数不清的用 little／a little——**先看 a 在不在，再看东西数不数得清**。」 |
| 对比卡 6 条方向 | ① `There are few apples.` ❌（**wrongMark `few`**，article——**本课唯一考点＋头号错**：想说「还有几个」丢了 a，意思反一半）；② `There are a few apple.` ❌（**wrongMark `apple`**，plural——**旧错 L11 回流**：a few 后面跟的是好几个，苹果要加 s）；③ `There is a few apples.` ❌（**wrongMark `is`**，sv_agreement——**接 L26 `:4652`「一个用 is，好几个用 are」**：虽然是「几个」，也是好几个）；④ **双正解**：`There are a few apples.` ✅ 并排 `There is a little milk.` ✅——**数得清的用 a few、数不清的用 a little**（一张卡说清两格）；⑤ **复习卡（L30 `:5389`）**：`There are some apples on the table.` ✅——**some 是「有一些」的老说法**（L30 `:5382` target，本课是它的下一格）；⑥ **复习卡（L70 `:12871`）**：`I am a little thirsty.` ✅——**对白里那句孤例今天转正**（`a little` 早见过，今天知道它跟谁站一起） |
| 变体三态 | 肯定 `There are a few apples.`（cloze 落 are）／否定 `There are not many apples.`（noteZh：「不多了」——not many 和 few 是一个意思；**避开 `There are few apples.` 作否定/疑问变体，因为它必须在对比卡 ① 里保持「错句」身份**）／疑问 `Are there a few apples left?`（noteZh：Are 搬句首，left 放最后） |
| 复现题设计 | 第 1 题 target＋变体逐字题；**第 2 题保障句 `There is a little milk.`**（cloze 实跑落 **is**；把「数不清的东西版」也练一次）；第 3 题复现 L30 原句 `There are some apples on the table.`；第 4 题复现 L26 原句 `There are three apples on the table.`（L26 `:4655` 例句，**同一张桌子的话，学生有画面**） |
| 案件规划 | `hunt-few-apples`（#123，§6）；新错 article＋plural；旧错 plural（L11）＋sv_agreement（L25）——**本批 `article` 承载课**（罪名最薄的档之一，现 24 处） |
| 六段要点 | ① 开场引 L30 `:5389`（老规矩的下一格）＋L70 `:12871` 孤例；② guided：`choose`（`There are ___ apples.` 选项 `a few`／`few`／`a little`）／`arrange` ≤5 token／**`spot`（`tokens: ["There", "are", "few", "apples."]`，`wrongToken: "few"`——逐字相等；answer 给 `a few`）**／`replace`「把 apples 换成 milk」；③ recall；④ practice 4 题；⑤ 破 `hunt-few-apples` |
| 术语红线自查 | 用「一点点／小招牌／数得清的／数不清的／还有几个／几乎没了」；**禁「可数／不可数」「量词」「冠词」** |
| 本课最大未知（走查点） | **`a few` 的 a 丢失率是否真高于 a 的其他用法**（瑞思 §7 假设 ④）——若不高，L114 增量须再评估 |

**L115 我有一辆新自行车（`have got`）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-115-have-got`；`number: 115`；episode「小美的一天 一百一十五」；scene `city`；cover `cover2` |
| title / grammarLabel | 「我有一辆新自行车」/「有 · 轻口气版 have got」 |
| targetSentence | `I have got a new bike.`（6 词，≤8 ✓；cloze 实跑落 **have**——①语法词） |
| sceneSetupZh | 楼下新车棚里，小美推着一辆亮亮的新自行车出来 |
| intentZh | 我有一辆新自行车。 |
| 场景 | 楼下：新车推出来给大家看 |
| 新知识点 | **只有一件**：`have got` 就是「有」的**轻口气版**——**一个词变两个词，意思一模一样**（口语更常用、更随意）；**接 L3 `:442`**「说『我有什么』用 have。一个东西前面要有 a」。**本课只做 I／you／we／they 版**（`has got` 留给 L116） |
| 一句话规则（oneLineRule） | 「『有』可以轻着说：have 后面加个 got——**I have got a new bike**。两句话一个意思，加了 got 更像聊天。后面照样跟东西、照样要有 a。」 |
| 对比卡 6 条方向 | ① `I have got a new bike is nice.` ❌（**wrongMark `is`**，verb_form——**本批头号新错**：`have got` 是一个整体，后面直接跟东西，**不能再接一个动词**）；② `I have got a new bike?` ❌（**wrongMark `got`**，word_order——问句要把 Have 搬到句首，不是用语调；**只作认读对照，L115 不展开疑问全表**）；③ `I have got the new bike.` ❌（**wrongMark `the`**，article——**接 L3 `:442`「一个东西前面要有 a，不能光着出现」**：第一次说它、对方还不知道是哪辆，要用 a）；④ **双正解**：`I have got a new bike.` ✅ 并排 `I have a new bike.` ✅——**两句一个意思**（L3 `:435` 原句就摆在旁边：**加了 got 是聊天口气，不加也没错**；**本 PRD 实测 diffScore 83 < 90，可用**）；⑤ **复习卡（L3 `:442`）**：`I have a big bag.` ✅——「有」的老说法；⑥ **复习卡（L21 `:3729`）**：`I have done my homework.` ✅——**同一个 have 两张脸**：后面站「做过版」是「做过了」，站「东西」才是「有」（**剑桥 `have-got` 页同款警告：have got 不是「已经得到」**） |
| 变体三态 | 肯定 `I have got a new bike.`（cloze 落 have）／否定 `I have not got a new bike.`（noteZh：not 夹在 have 和 got 中间）／疑问 `Have you got a new bike?`（noteZh：Have 搬句首，got 原地不动） |
| 复现题设计 | 第 1 题 target＋变体逐字题；**第 2 题保障句 `We have got a new bike.`**（cloze 实跑落 **have**；I 换 we 规矩不动）；第 3 题复现 L3 原句 `I have a new bag.`；第 4 题复现 L16 原句 `I have to get up early.`（**同一个 have 的第三张脸**：不得不） |
| 案件规划 | `hunt-have-got-bike`（#124，§6）；新错 verb_form＋article；旧错 tense（L10）＋plural（L11） |
| 六段要点 | ① 开场引 L3 `:442`「『有』的老说法今天多一个轻口气版本」；② guided：`choose`（`I ___ a new bike.` 选项 `have got`／`have got is`／`have`）／`arrange` ≤6 token／**`spot`（`tokens: ["I", "have", "got", "a", "new", "bike", "is."]`，`wrongToken: "is."`——逐字相等；answer 给「去掉 is」）**／`replace`「把 I 换成 We」；③ recall；④ practice 4 题；⑤ 破 `hunt-have-got-bike`。**走查观察点**：学完是否仍只用 have（增量被感知为「没必要学」的假设，瑞思 §7 假设 ②） |
| 术语红线自查 | 用「轻口气版／一个词变两个词／帮手」；**禁「助动词」「完成时（本字段内）」** |
| 诚实标注 | **B+ 档·说法扩充**——增量性质是**同义换挡**（瑞思 §1 ⑥·竞析 §③ 丁-4）；**不作章主锚**，须防与完成时混淆（对比卡 ⑥ 专门切开） |

**L116 她有一个新包（`has got`／`'s got`）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-116-has-got`；`number: 116`；episode「小美的一天 一百一十六」；scene `mansion`；cover `cover3` |
| title / grammarLabel | 「她有一个新包」/「换人换形 · has got（她/他/它版）」 |
| targetSentence | `She has got a new bag.`（6 词，≤8 ✓；cloze 实跑落 **has**——①语法词） |
| sceneSetupZh | 姐姐背着新包回家，包上还挂着没剪的标签 |
| intentZh | 她有一个新包。 |
| 场景 | 家里：姐姐的新包摆在沙发上 |
| 新知识点 | **只有一件**：**换了人就得换形**——`she／he／it` 用 `has got`（缩起来 `'s got`），`I／you／we／they` 用 `have got`。**接 L25 `:4460`**「他、她、它做事，动词后面要加个小尾巴 -s」——**got 前面那个词要带小尾巴**。**本课不重讲 `have got`**（L115 已教） |
| 一句话规则（oneLineRule） | 「换了人，前面那个词要换形：**I have got／she has got**——小尾巴长在 has 上（她、他、它版）。**缩起来是 She's got**，意思一点没变。」 |
| 对比卡 6 条方向 | ① `She have got a new bag.` ❌（**wrongMark `have`**，sv_agreement——**本课唯一考点**：漏换形，**接 L25 `:4460`**）；② `She has got a new bag is nice.` ❌（**wrongMark `is`**，verb_form——**与 L115 同型**：`has got` 也是一个整体，后面直接跟东西）；③ **同形隔离三项对照卡（认读）**：`She's got a new bag.` ✅ 并排 **`He has got a new bike.`** ✅（**挤一挤版 vs 全形版，换人换形两条一起看**：`'s got` 就是 `has got` 挤一挤；**它不是「已经得到」**——那是 L21 `:3729` 的 have＋做过版，**两张脸别混**）。**⚠️ 生产红线**：本条**不得**写成 `She's got a new bag.` ↔ `She has got a new bag.`（同一句的两种写法）——`grammarBoostService.ts:750` 的 `diffScore` 实测为 **100 ≥ 90**，会被**静默滤出双正解题池**（本 PRD 实测；对照组 `She's got…` ↔ `He has got a new bike.` ＝ **50，可用**）。同一红线也适用于 L118 对比卡 ⑤（写成 `She's got a new bag.` ↔ `I have got a new bike.` ＝ **50，可用**）；④ **双正解**：`She has got a new bag.` ✅ 并排 `He has got a new bike.` ✅（换人不换形：他她它都认 has；**实测 diffScore 67，可用**）；⑤ **复习卡（L25 `:4460`）**：`He drinks milk every day.` ✅——**他/她/它后面那个词要加小尾巴**（has 的 s 就是这条老规矩）；⑥ **复习卡（L115）**：`I have got a new bike.` ✅——**刚学的那句**：我／你／我们／他们用 have got（今天把第三人称那一格补上） |
| 变体三态 | 肯定 `She has got a new bag.`（cloze 落 has）／否定 `She has not got a new bag.`（noteZh：not 夹在 has 和 got 中间）／疑问 `Has she got a new bag?`（noteZh：Has 搬句首） |
| 复现题设计 | 第 1 题 target＋变体逐字题；**第 2 题保障句 `He has got a new bike.`**（cloze 落 **has**；他版换人不换形）；第 3 题复现 L25 原句 `He drinks milk every day.`；第 4 题复现 L115 原句 `I have got a new bike.` |
| 案件规划 | `hunt-she-has-got`（#125，§6）；新错 sv_agreement＋verb_form；旧错 sv_agreement（L19 was/were）＋plural（L11） |
| 六段要点 | ① 开场引 L25 `:4460`「小尾巴今天长在 has 上」；② guided：`choose`（`She ___ a new bag.` 选项 `has got`／`have got`／`has got is`）／`arrange` ≤6 token／**`spot`（`tokens: ["She", "have", "got", "a", "new", "bag."]`，`wrongToken: "have"`——逐字相等；answer 给 `has`）**／`replace`「把 She 换成 They」（**反向练一次**：换回 have）；③ recall；④ practice 4 题；⑤ 破 `hunt-she-has-got`。**同形隔离点**：`'s got` 与「已经得到」的显式切开（对比卡 ③） |
| 术语红线自查 | 用「换人换形／小尾巴／挤一挤」；**禁「第三人称」「主谓一致」「完成时」** |
| 诚实标注 | **B+ 档·说法扩充**（同 L115）；**不作章主锚** |

**L117 我一直想说的那些（四点合体）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-117-all-i-wanted`；`number: 117`；episode「小美的一天 一百一十七」；scene `mansion`；cover `cover4` |
| title / grammarLabel | 「我一直想说的那些」/「串一串 · 四种说法排一行」 |
| targetSentence | `Grandma's birthday is in May. This book is mine. I am bored. There are a few apples.`（**复现混排，逐句 ≤8 词**；cloze 实跑落 **is**——①语法词，收尾句逐句实跑登记，**避免全落同一词**） |
| sceneSetupZh | 一整个下午攒了一肚子话，小美把它们一条一条摆出来 |
| intentZh | 把这些事串起来说一遍。 |
| 场景 | 家里：把这一章的话摆一摆——四句话排一行 |
| 新知识点 | **无新点**——四点合体：`'s`（L111）／`mine`（L112）／`-ed·-ing`（L113）／`a few`（L114）；**`have got` 排一行**（L115／L116）。**复现取材＝L111–L116 各 1 句** |
| 一句话规则（oneLineRule） | 「这一章四张脸排一行：谁的（Grandma's）／我的（mine）／我的感受（bored）／还有几个（a few）——身边的事，一句话说清一件。」 |
| 对比卡 6 条方向 | ① `Grandma birthday is in May.` ❌（**wrongMark `Grandma`**，word_order——**L111 回流**）；② `I am boring.` ❌（**wrongMark `boring`**，verb_form——**L113 回流**：说自己的感受用感到版）；③ `There are few apples.` ❌（**wrongMark `few`**，article——**L114 回流**：还有几个要挂招牌）；④ **双正解（四点总表）**：`This book is mine.` ✅ 并排 `That book is my brother's.` ✅——**L112 的长短两版排一行**；⑤ **复习卡（L116）**：`She's got a new bag.` ✅ 并排 `I have got a new bike.` ✅（**挤一挤版认读**，**不重讲**；**实测 diffScore 50，可进双正解题池**）；⑥ **复习卡（L115／L116 家族）**：`I have got a new bike.` ✅ 并排 `She has got a new bag.` ✅——**一个意思两种形**（**实测 diffScore 50，可用**） |
| 变体三态 | 肯定 `Grandma's birthday is in May.`／否定 `This book is not mine.`（noteZh：not 回到 is 后面）／疑问 `Is Grandma's birthday in May?`（noteZh：Is 搬句首） |
| 复现题设计 | guided 复现 L114 原句 `There are a few apples.`；practice 第 1 题 target＋变体逐字题；第 2 题复现 L111 原句 `Grandma's birthday is in May.`；第 3 题复现 L112 原句 `This book is mine.`；第 4 题复现 L113 原句 `I am bored.`；**再各 1 题复现 L115／L116**（`I have got a new bike.`／`She has got a new bag.`）——**6 题齐全，逐题 ≤8 词** |
| 案件规划 | `hunt-all-i-wanted`（#126，§6）；新错 verb_form＋preposition；旧错 tense（L10）＋plural（L11）。**全批混排，不新增错型** |
| 六段要点 | ① 开场跨 6 课倒带（L111→L116 各回一句）；② guided：`choose`／`arrange` ≤5 token／**`spot`（`tokens: ["I", "am", "boring."]`，`wrongToken: "boring."`——逐字相等；answer 给 `bored`）**／`replace`「把 Grandma 换成 Grandpa」；③ recall；④ practice 6 题；⑤ 破 `hunt-all-i-wanted`。**中段自走查点**：四点是否各自认得出来（**本章最大未知**） |
| 术语红线自查 | 同前 6 课；不引入任何新术语与新说法 |

**L118 我一直想说的那些（收口 · 零新知）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-118-close-17`；`number: 118`；episode「小美的一天 一百一十八」；scene `mansion`；cover `cover1` |
| title / grammarLabel | 「我一直想说的那些」/「收口 · 八课排一行（零新知）」 |
| targetSentence | 复现混排（**七课各 1 句，逐句 ≤8 词**）：`Grandma's birthday is in May. This book is mine. I am bored. There are a few apples. I have got a new bike. She has got a new bag.`（cloze 按实跑登记；**勿全落同一词**） |
| sceneSetupZh | 这一章的话摆一摆，加一张总表卡——说完就装进兜里（**接 L117 同场景**，同一张桌子上把表填满） |
| intentZh | 这一章想说的，一次说完整。 |
| 新知识点 | **无——章末零新知**（收口先例 L54 `:9823`／L78 `:14362`／L94 `:17400`／L102 `:18919`／L110 `:20418` 同构，**接口零字段新增**）；复现取材＝L111–L116 各 1 句＋L117 总表；**不引番外 5 案**（`huntService.test.ts:215` 冻结名单） |
| 一句话规则（oneLineRule） | 「**八课排一行**：谁的（`'s`）、我的（mine）、我的感受（感到版）、还有几个（a few）、有（have got／has got）——身边的人和事，你可以一整段说出来了。」 |
| 对比卡 6 条方向 | ① `Grandma birthday is in May.` ❌（**wrongMark `Grandma`**，word_order——L111 回流）；② `I am boring.` ❌（**wrongMark `boring`**，verb_form——L113 回流）；③ `There are few apples.` ❌（**wrongMark `few`**，article——L114 回流）；④ **总表卡（双正解）**：`Grandma's birthday is in May.` ✅／`This book is mine.` ✅／`I am bored.` ✅／`There are a few apples.` ✅／`I have got a new bike.` ✅／`She has got a new bag.` ✅——**六句排一行，八课的话一次收齐**；⑤ **复习卡（L116）**：`She's got a new bag.` ✅ 并排 `I have got a new bike.` ✅——**挤一挤版**（认读，不重讲；**实测 diffScore 50，可进双正解题池**；**⚠️ 生产红线**：**不得**写成 `She's got a new bag.` ↔ `She has got a new bag.`——**实测 diffScore 100 ≥ 90 会被静默滤出**，见 L116 同款红线）；⑥ **复习卡（L56 `:10222`）**：`Grandma's birthday is in October.` ✅——**本批开头那句孤例**，今天回头看它已经变成一整章 |
| 变体三态 | 肯定 `I have got a new bike.`（收口课无主考点，按实跑登记）／否定 `She has not got a new bag.`（noteZh：not 夹在中间）／疑问 `Have you got a new bike?`（noteZh：Have 搬句首） |
| 复现题设计 | guided 复现 L117 原句 `There are a few apples.`；practice 第 1 题 target＋变体逐字题；第 2 题复现 L113 原句 `I am bored.`；第 3 题复现 L114 原句 `There are a few apples.`；第 4 题＝章末收官惯例，复现 L116 原句 `She has got a new bag.`；第 5 题复现 L112 原句 `This book is mine.`；第 6 题复现 L111 原句 `Grandma's birthday is in May.` |
| 案件规划 | `hunt-close-17`（#127，§6）；**全回流、不新增错型**；四点分别锚 #120／#122／#123／#125；**避开 fragment／run_on**；不引番外 5 案 |
| 六段要点 | ① 开场跨 7 课倒带（L111→L117 各回一句）；② guided：`choose`／`arrange` ≤5 token／**`spot`（`tokens: ["There", "are", "few", "apples."]`，`wrongToken: "few"`——逐字相等；answer 给 `a few`）**／`replace`；③ recall；④ practice 6 题；⑤ 破 `hunt-close-17`；⑥ 总表卡（**m19 达成句同源**） |
| 术语红线自查 | 同前；**零新知课尤其禁止引入任何未教说法** |

## §3 中文负迁移处理专章（逐课）

> **来源**：瑞思 `user-research-grammar-seventeenth-batch-2026-09-19.md` §5 中文负迁移专项（逐课表）＋竞析 §① 中文侧 english.cool 实证。

| 课 | 干扰（中文思维） | 中文侧依据（竞析 §① D） | 典型中式错句 | 承载罪名 | 设计含义（本课怎么接） |
|---|---|---|---|---|---|
| **L111** | 中文一个「的」管到底：既可以「奶奶的」，也可以「我的」 | `possessive` **专文**＋四条变化表＋**明文负迁移 ×2**（「Here are your sister's some books.」被标注为中式英文／「That bicycle of Mike was stolen.」❌） | `*Grandma birthday is in May.`（漏撇号） | **word_order**（最贴） | **头号错**：复用 L8 `:1350`「小标签」话术并升级——「**人后面加个撇号 s，就是『谁的』**」 |
| **L111** | 中文「的」直译 `of` | 同上（专文有 `of` 段） | `*The birthday of Grandma is in May.` | preposition | **只作 1 张对照卡**（`of` 结构超 A2，**不主打**；Murphy 中级 U81 正是把 `'s` 与 `of` 并讲的，故有依据） |
| **L112** | 中文「我的」一个词管两头（不管后面有没有东西） | `possessive` 专文（所有格与限定词不得并存） | `*This book is my.`／`*This is mine book.` | verb_form | **两张老卡（L33 `:5963`／`:5975`）回流**——一句话切开：后面有东西用短版、后面空了用长版 |
| **L112** | 中文「是哥哥的」不带任何标记 | 同上（`of` 后须生物、`'s` 前要有标记） | `*This book is brother's.` | **article** | **本课唯一新点**：人＋撇号 s 前面还要有小标签（`the`／`my`），光着进不来 |
| **L113** | **中文「无聊」一个词管两头**（「我很无聊」＝「这书很无聊」） | `emotive-verbs` **专文**＋15 组成对表＋**明文 ❌/⭕ 对**（「I am interesting to travel… ❌」） | `*I am boring.` | **verb_form** | **本课唯一考点＋本批真错第一名**：`-ed` 说「我感到」、`-ing` 说「它让人」；话术用「**感到版／让人版**」，**全禁「形容词」「分词」** |
| **L113** | 中文「我无聊」不用动词 | 同上 | `*I bored.` | missing_be | 复用 L1 `:87`「固定搭档」；**HC #17 `:826` 同型回流呼应** |
| **L114** | 中文「没几个」与「有几个」靠一个字（没／有）区分，**没有「a 定生死」这层机制** | `quantifiers` 专文＋六词总表，**无明文负迁移** | `*There are few apples.`（想说「有几个」说成「几乎没几个」） | **article**（a 丢失） | **本课唯一考点**：话术「**a 是一块小招牌：有它＝还有几个，没它＝几乎没了**」；**中文侧无错例可引，对比卡须自造**（竞析 §③ 丁-3 已提示） |
| **L114** | 中文量词不分数得清／数不清 | L30 `:5389` 已铺平台 | `*I have a few money.` | plural／article | 接 L30「数得清／数不清」——**`a few` 只跟数得清的，`a little` 只跟数不清的** |
| **L115** | 中文只有「有」一个字，容易在 got 后面再补动词 | **四度零专文**（865 slug 无 `have-got`，直连 404——竞析 §① D 目录面）；**间接负迁移**引剑桥 `have-got` 页明文 "Not: She is having got two cats and a dog." | `*I have got a new bike is nice.` | **verb_form**（**不选 run_on／fragment**——批十五 #103、批十六 #111 刚用过，本批避开，瑞思 §1 ⑨） | 「**`have got` 是一个整体，就是『有』——后面直接跟东西**」 |
| **L116** | 中文「她有」的「有」不变形 | 同上（中文侧无专文） | `*She have got a bag.` | **sv_agreement** | 「他/她/它版是 **has got**」——复用 L25 `:4460` 小尾巴；**本课唯一考点** |
| **L116** | 把 `She's got` 读成「她已经得到一个包」 | 剑桥 `have-something-done` 页明文警告 "not the same as the present perfect or past perfect"（同款混淆） | `*She's got a bag.` 理解成完成时义 | verb_form（**作对照卡，不作错句**） | 对照 L21 `:3729`：**`have got` 不是「已经得到」**——放 1 张对照卡显式切开 |
| **L117** | 四点混排时互相串台 | —— | 四句互窜（`'s` 漏撇号／`bored` 说成 `boring`／`a few` 丢 a／`has got` 漏换形） | word_order／verb_form／article／sv_agreement | **只用本批旧课锚点，不引入未教材料**（§6 案件表纪律） |
| **L118** | 全回流 | —— | 同 L117 | 全落 10 枚举 | **零新知**：四点分别锚 L111／L113／L114／L116 |

**须写进规格的两条**（瑞思 §5 末段）：
1. **`*I am boring.` 是「真错」第一名**——L113 的 3 条对比卡全部围绕它（`I am bored.` ✅ vs `I am boring.` ❌＋`The book is bored.` ❌ 反向补一枪），**一次打透**。
2. **`*There are few apples.` 是「丢 a」第一名**——L114 的 3 条对比卡围绕它（`few` 丢招牌 ①／`apple` 漏复数 ②／`is` 搭档错 ③）。

## §4 叙事设计专章

### 4.1 叙事草案（逐字采用）

> **「我一直想说的那些——说说身边的人和事。」**
> 奶奶的生日在五月：Grandma's birthday is in May.（第 111 课，**第 56 课挂历前那句孤例，今天长成一课**）→ 这本是我的：This book is mine.（第 112 课，**第 33 课的 mine 与今天新学的哥哥的 `'s` 分家**）→ 我很无聊：I am bored.（第 113 课，**你在案件里见过 excited 那张脸，今天正面教**）→ 桌上还有几个苹果：There are a few apples.（第 114 课，**第 30 课那句「有一些苹果」的下一格**）→ 我有一辆新自行车：I have got a new bike.（第 115 课，同一个「有」，口气更轻）→ 她有一个新包：She has got a new bag.（第 116 课，换了人前面那个词也要换形）。
> 收住：八课排一行——谁的（`'s`）／我的（mine）／我的感受（感到版）／还有几个（a few）／有（have got／has got）。（第 117 课串一串、第 118 课收口）

### 4.2 复用体系（不造新比喻）

- 「**小标签**」（L8 `:1350`「my / your / his / her 是小标签，永远贴在东西或人的前面」→ L111 升级为「人后面加个撇号 s ＝ 谁的」）
- 「**长版／短版**」（L33 `:6001` deepDive「my 是小标签，必须贴在名词前面；mine 自己就能当主角，站句尾」→ L112 显式对位）
- 「**固定搭档**」（L1 `:87`「I am 是一对固定搭档」→ L113 `*I bored.` 漏搭档）
- 「**感到版／让人版**」（本批新增，L113 一次说清；**全禁「形容词」「分词」**）
- 「**数得清的／数不清的**」（L30 `:5389`「数得清的用 many，数不清的用 much」→ L114 `a few`／`a little` 是它的下一格）
- 「**小招牌 a**」（本批新增，L114：有它＝有几个、没它＝几乎没）
- 「**have 的几张脸**」（L3 `:442` 有／L16 `:2816` 不得不／L21 `:3729` 做过了 → L115–L116「有」的轻口气版）
- 「**小尾巴**」（L25 `:4460`「他、她、它做事，动词后面要加个小尾巴 -s」→ L116 `has got`）
- 「**收口传统**」（五代先例 L54 `:9823`／L78 `:14362`／L94 `:17400`／L102 `:18919`／L110 `:20418`——L117／L118 同构）
- **跨批钩子兑现（第四次）**：L111 引 L56 `:10222`／`:10278`；L112 引 L33 `:5931`／`:6001` 与 L85 `:15704`；L113 引 **HC #16 `:771`／#17 `:826`（首次「案件回流课程」）**；L114 引 L30 `:5389`／L70 `:12871`；L115 引 L3 `:442`；L116 引 L25 `:4460`。

### 4.3 禁用词表（本批生产禁出现）

**零术语红线**（`grammarLessons.test.ts:110/119/128` 逐字断言，作用域＝`grammarLabel`／`oneLineRule`／`summary.rule` 三字段）：主语、谓语、宾语、表语、定语、状语、单数、复数、三单、原形、时态、一般过去时、一般现在时、现在进行时、过去进行时、现在完成时、情态动词、比较级、最高级、从句、语序、可数、疑问句、否定句、被动语态、第三人称、形容词、副词、介词——**29 个词全禁**（本轮实读测试源文件的 `GRAMMAR_TERMS` 数组逐字计数＝**29**）。

**本批额外禁用**（非测试覆盖，但同属零术语纪律，生产自查）：物主代词、名词所有格、分词、过去分词、现在分词、助动词、系动词、冠词、量词、限定词、主谓一致、词性。

**替换体系（沿用课程既有话术）**：

| 禁词概念 | 本批替换说法 | 出处 |
|---|---|---|
| 名词所有格 | 「**谁的**：人后面加个撇号 s」 | 本批新增（L111） |
| 物主代词（名词性） | 「**长版**（mine）／短版（my）」 | L33 `:6001`「自己就能当主角，站句尾」升级 |
| 形容词 / 分词（-ed·-ing） | 「**感到版／让人版**」 | 本批新增（L113） |
| 冠词 a 的有无 | 「**小招牌 a**：挂上＝还有几个，不挂＝几乎没了」 | 本批新增（L114） |
| 可数 / 不可数 | 「**数得清的／数不清的**」 | L30 `:5389` 原话 |
| have got 的语法身份 | 「**『有』的轻口气版，一个词变两个词**」 | 本批新增（L115） |
| 第三人称单数 | 「**他/她/它加个小尾巴**」「**换人换形**」 | L25 `:4460`＋本批（L116） |
| 助动词 / be 动词 | 「**帮手**」「**固定搭档**」 | L1 `:87`／L74 家族话术 |
| 疑问句 / 否定句 | 「**搬句首**」「**not 跟 is 走／夹在中间**」 | L27 搬法＋本批 |
| 时态 / 一般过去时 | 「**昨天版**」 | L10 `:1699` |

## §5 验收标准

### 5.1 检查清单（G1–G14＋展示层，逐条可勾）

- [ ] **G1 课程数据**：practice **≥4 题**且**含一道与 variants 逐字一致的否定或疑问变体题**（`grammarLessons.test.ts:10` 硬断言）；本批逐课列出——L111 `Is Grandma's birthday in May?`｜L112 `Is this book yours?`｜L113 `Are you bored?`｜L114 `Are there a few apples left?`｜L115 `Have you got a new bike?`｜L116 `Has she got a new bag?`｜L117 `Is Grandma's birthday in May?`｜L118 `Have you got a new bike?`
- [ ] **G1-b**：**每课 ≥1 复现题**（跨课原句回流；L117／L118 各 6 题复现）
- [ ] **G2 tokens／answer 词集一致＋distractors 不与答案词重复**（`grammarLessons.test.ts:30`／`:51` 硬断言）；**arrange／practice 展示序 ≠ 答案序**（`shuffleWithSeed` 保证同序时交换首尾）
- [ ] **G2-b 零术语红线**：`grammarLabel`／`oneLineRule`／`summary.rule` **三字段禁出现** **29 词**（`grammarLessons.test.ts:110-127` 的 `GRAMMAR_TERMS` 逐字实读：主语/谓语/宾语/表语/定语/状语/单数/复数/三单/原形/时态/一般过去时/一般现在时/现在进行时/过去进行时/现在完成时/情态动词/比较级/最高级/从句/语序/可数/疑问句/否定句/被动语态/第三人称/形容词/副词/介词）——§4.3 替换体系逐条对照自查（三条断言：`:110` grammarLabel／`:119` oneLineRule／`:128` summary.rule，全部 `toEqual([])`）
- [ ] **G3 recall 三字段非空**（`promptZh`／`intentZh`／`answer`；`grammarLessons.test.ts:68-79` 对 `number >= 13` 硬断言）
- [ ] **G4 目标句 ≤8 词**（L111 5／L112 4／L113 3／L114 5／L115 6／L116 6；L117／L118 复现混排**逐句 ≤8 词**）；**一课一增量**（§2.2 每课「新知识点」只列一件）
- [ ] **G5 罪名枚举**：8 案 tag **全落 10 枚举**——tense／sv_agreement／missing_be／article／plural／preposition／fragment／run_on／word_order／verb_form（`huntService.ts:331-342` 实读）；**不碰 comparison**（`types.ts:430` 存在但 `GRAMMAR_ERROR_TAGS` 不含它、`huntCases.ts` 0 处）；**本批带上 `article`（罪名簿现 24 处，最薄档之一）——落 #121／#123／#124／#127 四案**；**避开 fragment／run_on 连续同型**（批十五 #103、批十六 #111 刚用过，本批 8 案 **0 处 fragment／run_on**）
- [ ] **G6 案件结构**：每案 **4 错＝新错 2＋旧错 2**、**单 token 可修**、**≥1 净词**（`tokens.length > errors.length`）、`reviewed: true`、`tokenIndex` 与 `tokens` 对齐、`number` 连续（#120–#127）；旧错**只取 L10（昨天版）／L11（复数）／L19（was-were）／L25（三单）**，禁引入未教材料
- [ ] **G7 tagStats=10 不动**（`huntService.test.ts:109` 断言 `toHaveLength(10)`）；**番外 5 案冻结**（`huntService.test.ts:215` 逐名单断言 `hunt-white-cat`／`hunt-sports-day`／`hunt-pen-pal-letter`／`hunt-fridge-note`／`hunt-term-review`——**新案不得替代或删改**）
- [ ] **G8 展示层硬需求**：
  - `grammarSeasons.ts` 在 season-16（`:50`，末项 `{min:103, max:110}`）后追加：`{ id: "season-17", label: "第十七季 · 我一直想说的那些", hint: "谁的（撇号 s）、我的（mine）、我的感受（感到版）、还有几个（a few）、有（have got）——身边的事，一句话说清一件", min: 111, max: 118 }`
  - `GrammarPathPage.tsx` CAN_DO_MILESTONES 在 m18（`:240-245`，17 项后新增第 19 项）后追加 m19：`{ id: "can-do-m19", afterLesson: 118, title: "我能说清身边的人和东西", zh: "谁的（`'s`）+ 我的（mine）+ 我的感受（bored）+ 还有几个（a few）+ 有（have got／has got）——身边的人和东西，一句话说清一件。", samples: ["Grandma's birthday is in May.", "This book is mine.", "I am bored."] }`
- [ ] **G8-b 守门测试**：`grammarSeasons.test.ts` **4 项全绿**——① 每课号落区间（111–118 覆盖）；② 区间互不重叠（`min:111 > max:110`）；③ `label`／`hint` 非空；④ 最高课号 118 落区间。**不落 season-17 则第 ①④ 项先红**（不会静默过滤）。**m19 全仓无测试引用（纯纪律项，`GrammarPathPage.tsx:240` 实读）**
- [ ] **G9 orphans 纪律**：8 个新案（#120–#127）**全部被 L111–L118 引用**（`huntCaseIds`），**不新增未引用案**（引号案数 119→127、全部 `reviewed: true`）
- [ ] **G10 episode 写法**：L111–L118 全部汉字数字（「一百一十一」…「一百一十八」；>100 已有 11 例先例）
- [ ] **G11 语料锁闭集**：L111 **只做「人＋`'s`」**（`of` 仅 1 张对照卡，不展开）；L112 **只做「长短版选用」**（不重讲 L33 指示代词）；L113 **只做「感到版／让人版」**（不扩 10 组清单——BC 有 10 组、english.cool 有 15 组，**本课只取 bored／boring 一组打透**）；L114 **只做「a 的有无」**（不重讲 L30 some／any／much／many）；L115 **只做 `have got`**（不碰 `has got`）；L116 **只做换人换形**（不重讲 `have got`）；**全批不引入 `be/get used to`、`have sth done`、look like、被动新面**
- [ ] **G12 cloze 逐课核验**（按生产时生效词表实跑，逐课登记；**沿批十六 G12 纪律**）：本批**逐句实跑结论**（本轮以 `grammarAmbushService.ts:160-187` 的真 regex 复跑，词表 **145 条／144 唯一**，停用词 30）：
  - **`few`／`little`／`bored`／`boring`／`mine`／`there` 均 OUT**；而 **`is`／`am`／`are`／`have`／`has`／`got` 均 IN**。
  - L111 `Grandma's birthday is in May.` → ①落 **is**；L112 `This book is mine.` → ①落 **is**；L113 `I am bored.` → ①落 **am**；L114 `There are a few apples.` → ①落 **are**；L115 `I have got a new bike.` → ①落 **have**；L116 `She has got a new bag.` → ①落 **has**。
  - **保障句（每课 ≥1，让主考点不落空）**：L111 `My brother's car is new.`（落 is）／L112 `That book is my brother's.`（落 is）／**L113 `The book is boring.`（落 is——`bored`／`boring` 不在表内，必须靠表内词承载空位）**／**L114 `There is a little milk.`（落 is——`few`／`little` 不在表内）**／**L115 `We have got a new bike.`（落 have；若要考 `got` 须用 `We've got a new bike.`——①落 got，本轮实跑确认）**／L116 `He has got a new bike.`（落 has）／L117／L118 复现句逐句实跑登记、**避免全落同一词**。
  - **逐课须核验「variants 至少 1 句让主考点落空」**（沿用批十六 §6-3 纪律）。
- [ ] **G-boost（硬护栏）**：
  - **每课 contrast 6 条中至少 2 条为「带 `wrongMark` 的真实错卡」**（口径：`wrongMark` 非空、非 bothRight、字面词能在 wrong 句里定位；`grammarBoostService.ts:204-219` `locateMarkedTokens` 实读）；**推荐 3 条；禁止贴线**（`grammarBoostService.test.ts:161` 全库逐课断言 `thin === []`）。
  - **`wrongMark` 不得为纯标点**（`grammarBoostService.test.ts:199` 断言；L89 `"?"` 已修为 `"day?"` 的前车之鉴）。本批 8 课逐条核：**全部 wrongMark 含字母**（`Grandma`／`of`／`on`／`my`／`mine`／`brother's`／`boring`／`bored`／`few`／`apple`／`is`／`have`／`has`／`got`／`the`）。
  - **`guided.spot` 的 `wrongToken` 必须与 `tokens` 元素逐字相等（含尾标点写法一致）**——L96 `:17904-17905` 与 L102 `:19043-19044` 均为 `tokens: ["It", "was", "rain."]`＋`wrongToken: "rain."`（批十六已回修）；**本批 8 课逐课按最严口径核对，不依赖 `grammarBoostService.ts:678` 的 `cleanWord` 兜底**（`grammarBoostService.test.ts:185` 断言 `tokens.includes(wrongToken)`）。**本批 8 处 spot 设计**：L111 `["Grandma", "birthday", "is", "in", "May."]`/`"Grandma"`｜L112 `["This", "book", "is", "my."]`/`"my."`｜L113 `["I", "am", "boring."]`/`"boring."`｜L114 `["There", "are", "few", "apples."]`/`"few"`｜L115 `["I", "have", "got", "a", "new", "bike", "is."]`/`"is."`｜L116 `["She", "have", "got", "a", "new", "bag."]`/`"have"`｜L117 `["I", "am", "boring."]`/`"boring."`｜L118 `["There", "are", "few", "apples."]`/`"few"`
  - **每课 contrast ≥3 条**、`kind` 覆盖 choose／arrange／spot／replace（批十六口径）
  - **G-boost-d 双正解卡的 diffScore 红线（本批新增·实测发现）**：`grammarBoostService.ts:745-753` 对 `bothRight` 条目做 `diffScore(compareText(correct, wrong))`，**`>= 90` 直接 `return`**（静默丢弃、不进双正解题池，且**不会报错**）。**本 PRD 以真实 `diffService` 实跑本批 11 组设计并留档**：L111 `Grandma's…`／`Grandpa's…` **70** ✅｜L112 `This book is mine.`／`That book is my brother's.` **40** ✅｜L113 `I am bored.`／`The book is boring.` **0** ✅｜L114 `There are a few apples.`／`There is a little milk.` **40** ✅｜L115 `I have got a new bike.`／`I have a new bike.` **83** ✅｜L116 `She has got a new bag.`／`He has got a new bike.` **67** ✅｜L116 原设计 `She's got a new bag.`／`She has got a new bag.` **100 ❌ 已改**｜L117 `This book is mine.`／`That book is my brother's.` **40** ✅；`I have got a new bike.`／`She has got a new bag.` **50** ✅｜L118 `She's got a new bag.`／`I have got a new bike.` **50** ✅。**生产时逐条重跑 diffScore 并登记，≥90 者必须改写成「换人／换事」版本**（本节 L116／L118 已按此修定）。
  - **（附）全库护栏现状**：`contrast` 660 条／`bothRight` 221 条／带 `wrongMark` 391 条／纯标点 `wrongMark` 0；`grammarBoostService.test.ts:161` 断言 thin＝[]、`:185` wrongToken 逐字相等、`:199` wrongMark 非纯标点——**三项本批必过**。
- [ ] **G13 时长 6–8 min**（8 课逐课走查；L115／L116／L117／L118 各 6 词句核对上限；L117／L118 为混排课，须按**分段计时**抽查）
- [ ] **G14 旧线零回归**：**L1–L110 一字不动**；`npx vitest run` 全绿（**本 PRD 定稿基线：58 文件 / 732 项**，2026-09-19 实跑 4.32–5.36s）；`npx tsc --noEmit` 0 错；build 通过

### 5.2 Given/When/Then

- **G-A1** Given 学习者完成 L111 When 看对比卡 `Grandma birthday is in May.` ❌ / `Grandma's birthday is in May.` ✅ Then 能说出「**人后面加个撇号 s ＝ 谁的**」，并能回忆第 8 课「my 是小标签」那句老话
- **G-A2** Given 学习者完成 L112 When 看 `This book is mine.` ✅ 与 `That book is my brother's.` ✅ 并排 Then 能说出「**后面有东西用短版，后面空了用长版**」，并能指出 `This book is brother's.` 错在少了小标签
- **G-A3** Given 学习者完成 L113 When 看 `I am boring.` ❌ Then 能改成 `I am bored.` 并说出「**感到版说我的感受，让人版说它让我这样**」；When 再看到 `The book is bored.` ❌ Then 能改成 `The book is boring.`（**两张脸都认得出**）
- **G-A4** Given 学习者完成 L114 When 看 `There are few apples.` ❌ Then 能补回 a 并说出「**有 a＝还有几个，没 a＝几乎没了**」；When 看 `There is a little milk.` ✅ Then 能说出「奶数不清，所以不走 a few 那条路」
- **G-A5** Given 学习者完成 L115 When 看 `I have got a new bike.` ✅ 与 `I have a new bike.` ✅ 并排 Then 能说出「**两句一个意思，加了 got 更像聊天**」；并能指出 `I have got a new bike is nice.` 错在 got 后面又接了一个动词
- **G-A6** Given 学习者完成 L116 When 看 `She have got a new bag.` ❌ Then 能改成 `has` 并说出「**换人换形：他/她/它用小尾巴那条**」；When 看 `She's got a new bag.` Then 能说出「**挤一挤，跟 have got 一个意思，不是『已经得到』**」
- **G-A7** Given 学习者完成 L118 回看 8 课旧句 When 逐句指认 Then 能各自说出「这是第 N 课学的、说的是哪一件事」

## §6 案件规划（8 案 · #120–#127）

**总规则**：每案 **4 错＝新错 2＋旧错 2**；**单 token 可修**；每案 **≥1 净词**（`tokens.length > errors.length`，实读全部满足）；零术语话术；tag **全落 10 枚举**（tagStats 固定 10 项）；`reviewed: true`；**必须配课**；**不碰 comparison**；**不引番外 5 案**；**本批 0 处 fragment／run_on**（避开连续同型，瑞思 §1 ⑨）。案件编号接批十六尾案（#119 `hunt-who-makes-who`，`huntCases.ts:6907`）为 **#120–#127**。

| 案件 id | # | 配课 | 场景 | 定稿错误构成（原 → 修正（tag，新/旧）） |
|---|---|---|---|---|
| `hunt-grandmas-birthday` | 120 | L111 | 家里挂历前，圈满生日的格子 | ① `Grandma` → `Grandma's`（`Grandma birthday is in May.`，**word_order**，新——漏撇号）② `on` → `in`（`My birthday is on May.`，**preposition**，新——月份是大格子；**逐字取 L56 `:10232` 原卡**）③ `go` → `went`（`Yesterday I go to the park.`，**tense**，旧错 L10 `:1707`；**`huntCases.ts:5` 起有原句先例**）④ `apple` → `apples`（`two apple`，**plural**，旧错 L11） |
| `hunt-whose-book-mine` | 121 | L112 | 茶几上两本分不清的书 | ① `my` → `mine`（`This book is my.`，**verb_form**，新；**逐字取 L33 `:5963` 原卡** `This umbrella is my.` 的换名版）② `brother's` → `my brother's`（`This book is brother's.`，**article**，新——人前面缺小标签；**补词型先例**`huntCases.ts:717` `"cake"→"a cake"`）③ `drink` → `drinks`（`He drink milk.`，**sv_agreement**，旧错 L25）④ `book` → `books`（`two book`，**plural**，旧错 L11） |
| `hunt-bored-boring` | 122 | L113 | 雨天下午的沙发，摊着的作业本 | ① `bored` → `boring`（错句 `The book is bored.`，**verb_form**，新——书不会「感到」；**反向卡先例**：L113 对比卡③同型）② `bored.` → `am bored.`（`I bored.`，**missing_be**，新——漏固定搭档；**逐字先例**：`huntCases.ts:262` `"happy"→"is happy"`、`:959` `"very"→"am very"`——**指针只点一个 token，改正可补一个词**）③ `was` → `were`（`We was happy.`，**sv_agreement**，旧错 **L19**；`huntCases.ts:6717` 已有「第 19 课回流」原句先例）④ `sandwich` → `sandwiches`（`two sandwich`，**plural**，旧错 L11） |
| `hunt-few-apples` | 123 | L114 | 果盘端上桌，剩几个苹果 | ① `few` → `a few`（`There are few apples.`，**article**，新——丢小招牌）② `apple.` → `apples.`（`There are a few apple.`，**plural**，新——a few 后面跟好几个）③ `bus.` → `buses.`（`two bus.`，**plural**，旧错 L11；**逐字先例**：`huntCases.ts:6891-6892` `original:"bus."→correction:"buses."`）④ `have` → `has`（`She have a dog.`，**sv_agreement**，旧错 L25） |
| `hunt-have-got-bike` | 124 | L115 | 楼下新车棚，崭新的自行车 | ① `is.` → 去掉（`I have got a new bike is.`，**verb_form**，新——got 后面又接动词；**删词型先例**：`huntCases.ts:2060-2061` `tag:"verb_form"`／`correction:"去掉 to"`、`:357` `"去掉 so"`）② `the` → `a`（`I have got the new bike.`，**article**，新——第一次说它要用 a；**L3 `:456-459` 卡同型** `I have pen.→I have a pen.`）③ `go` → `went`（`Yesterday I go home.`，**tense**，旧错 L10；**逐字先例**：`huntCases.ts:6650`／`:6669-6671` 案 #113 同句同解）④ `bag` → `bags`（`two bag`，**plural**，旧错 L11） |
| `hunt-she-has-got` | 125 | L116 | 沙发上姐姐的新包 | ① `have` → `has`（`She have got a new bag.`，**sv_agreement**，新——漏换形；**L25 `:4460` 直系**）② `is.` → 去掉（`She has got a new bag is.`，**verb_form**，新——与 L115 同型，换人换形不换规矩）③ `was` → `were`（`They was happy.`，**sv_agreement**，旧错 **L19**）④ `book` → `books`（`two book`，**plural**，旧错 L11） |
| `hunt-all-i-wanted` | 126 | L117 | 本子上排成四行的话 | ① `boring` → `bored`（`I am boring.`，**verb_form**，新——L113 回流但**本课作新错计**：混排场景首考）② `in` → `at`（`I am good in drawing.`，**preposition**，新——**L67 `:12312`／`:12365` 门牌家族回流**，原卡 `wrong:"I am good in drawing."`/`wrongMark:"in"`）③ `stop.` → `stopped.`（`until the rain stop.`，**tense**，旧错 L10 型）④ `friend` → `friends`（`two friend`，**plural**，旧错 L11） |
| `hunt-close-17` | 127 | L118 | 收口：本子最后一页的六行字 | ① `Grandma` → `Grandma's`（**word_order**，旧错——**L111 回流，锚 #120**）② `boring` → `bored`（**verb_form**，旧错——**L113 回流，锚 #122**）③ `few` → `a few`（**article**，旧错——**L114 回流，锚 #123**）④ `have` → `has`（**sv_agreement**，旧错——**L116 回流，锚 #125**） |

**本批罪名分布（8 案 × 4 错 ＝ 32 处，逐案按上表实点）**：`plural` **8**（#120／#121／#122／#123×2／#124／#125／#126）；`sv_agreement` **6**（#121／#122／#123／#125×2／#127）；`verb_form` **6**（#121／#122／#124／#125／#126／#127）；`article` **4**（#121／#123／#124／#127——**最薄档之一，本批四案承载**）；`tense` **3**（#120／#124／#126）；`word_order` **2**（#120／#127）；`preposition` **2**（#120／#126）；`missing_be` **1**（#122）；**`fragment` 0／`run_on` 0**（瑞思 §1 ⑨ 纪律——避开批十五 #103、批十六 #111 的连续同型）。
> **注**：上表逐案列出的是「新错 2＋旧错 2」的**定稿骨架**，生产时逐 token 核对 `tokenIndex` 与 `tokens`；同案两条同 tag 有先例（批十六 #118 同案双 plural 类）。

**案件表纪律**：每案 4 错全部**单 token 可修**（`plural` 型的尾标点差异按既有先例处理：`apple.` → `apples.`，`huntCases.ts:6640` 型）；新错话术走 §3 负迁移表；**旧错一律取自已教点**（L10 `:1699` 昨天版／L11 `:1878` 复数／L19 `:3344` was-were／L25 `:4442` 三单），**禁引入未教材料**；L118 案**以本批锚复现**（#120／#122／#123／#125），不新增错型。

## §7 Non-goals

- **不做 `be/get used to`**（B1 段：BC B1-B2 课位＋Murphy 中级 U61＋Cambridge 两页＋中文两篇专文，**位置够硬但与本批 A2 关账优先序冲突**；且 L93 `:17294` 明文「to 后面永远穿原样」与 `be used to + -ing` 正面对撞）——**列批十八首选**
- **不做 `have sth done`**（**维持撤出**：BC 三档 68 课零课位；Murphy 仅中级 U46；招牌句四零件 `have/had`＋`hair`＋`cut` 全库零、`will have` 0、`'ll` 全库 0）
- **不做 `look like`**（维持认读：`looks like` GL 仅 L49 `:8909` 一句天气义；BC 在 B1-B2；中文侧四度零专文——**三度三缺**）；**不做 `look + 形容词` 升格**（12 处认读垫子另立评估，**与 look like 不得混述**）
- **不做形容词＋介词独立课**（B- 档：BC 六族我方只覆 1/6，仅 `good at`；**搭配是清单不是结构，一课一增量守不住**）——**只折**：L112 不折，**L117 案件 #126 折 1 处 `in → at`**（门牌家族回流），不单开
- **不做 `so that`／`as soon as`／`neither`／`either`／`both`／`already`／`yet`／`such`／`the same as`／`would rather` 等散点**（无共同语义场，强凑即稀释一课一增量）
- **不做 `of` 结构单开**（L111 只作 1 张对照卡；`the birthday of Grandma` 超 A2 且与 L112 分工）
- **不做** 机制强化（boost 三档／回马枪已饱和且有测试守门）
- **不做** 双拱（批十四破例一次后，批十五／十六／十七连续单拱）
- **案量不扩**：8 课 8 案，不设「一课两案」；**不加**新枚举、不改 tagStats／schema
- **不动 L1–L110**（一字不改；含不改写前批 `wrongToken`／`wrongMark`——批十六的三处回修已在工作区，**本批只做新增**）
- **不引**番外 5 案（`hunt-white-cat`／`hunt-sports-day`／`hunt-pen-pal-letter`／`hunt-fridge-note`／`hunt-term-review`）
- **不做**封面池外新资产（8 张纯二用升三用；**语义不符时池内互换**，`cover49` 永久禁用）
- **不做** cloze 词表扩充（`few`／`little`／`bored`／`boring` 不在表内——**用保障句兜住，不改 `grammarAmbushService.ts`**）

## §8 开放问题

1. **「感到版／让人版」话术是否接得住「我很无聊」**（**本批最大未知**）——中文一个词管两头，学生能否一次分清 `bored`／`boring`？默认 L113 三条对比卡（正／反／反向）一次打透；**中段自走查点**设在 L113 与 L117，观察「`I am boring.` 误答回流率」（瑞思 §7 假设 ①）。
2. **`have got` 的增量是否被感知为「没必要学」**——同义换挡，须在走查盯「学完仍只用 have」；若命中率高，备选：L115 的对比卡 ④（双正解）改成显式「加了 got 是聊天口气」的偏好提示（瑞思 §7 假设 ②）。
3. **`'s` 与 `of` 的互扰**——教了 `Grandma's` 后学生是否反过来错出 `*the birthday of Grandma`？默认 L111 对比卡 ② 单列 1 张；**不展开、不进 practice**（瑞思 §7 假设 ③）。
4. **`a few` 的 a 丢失率是否真高于 `a` 的其他用法**——L114 的全部价值押在这一点上。默认对比卡 ① 单打；**若走查发现 a 丢失率不高，L114 增量须在批十八前重评估**（瑞思 §7 假设 ④）。
5. **门牌家族扩员是否引发 `interested at` 型过度泛化**——L67 `:12365` 只教了 at 一员，本批**不单开门牌课**，只在 #126 折 1 处 `in → at`；若案件误答率高，备选：L117 补 1 张 `good at`／`interested in` 并排卡（**不新增课**）。
6. **封面 8 张语义核对**——本 PRD 指派按**编号间距实算**（min-gap 35，多解已穷举验证），**未做图像语义核对**；池内互换余量＝当张语义不符时可在 9 张可用张内重排（**仍须守住 `cover42` 与 `cover25` 的 35 压线不自破**）。
7. **L117 取材与 L118 的重复度**——两课都用复现混排（各 6 句），L118 又多「总表卡」。默认 L117 取 `'s`／`mine`／`bored`／`a few` 四句＋1 复现＋1 变体，L118 取**六句＋总表**；**若两课感知重复，备选：L118 总表卡改「六行＋一句话」形态**（沿用 english.cool `habit-be-used-to` 末尾总表的形态参考）。
8. **连续第五个大章节的疲劳**——F13-B–F16-B 均未关账，判据尚无数据（瑞思 §7 假设 ⑥）；本批不设缓解动作，仅登记观察。
9. **L115／L116 的档位表述口径**——对外一律写「**B+ 档·说法扩充**」，**不得**与 L111／L113／L114 的 A 档混述（三研究一致要求）。
10. **基线口径**——本 PRD 定稿实测 `npx vitest run` ＝ **58 文件 / 732 项全绿**；三研究分别记 721（瑞思／数析）与 729（竞析）——**差值为同期另一路改动**，生产时以实跑为准（G14 写 732，若生产期再变以实跑登记）。

---

> 本规格书由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。

