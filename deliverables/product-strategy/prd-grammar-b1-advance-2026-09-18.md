# PRD：第十二批课程 · B1 提前与跨季综合（3 课：L76–L78）

**日期**：2026-09-18 ｜ **类型**：功能规格书（PRD）｜ **成员**：析客（需求分析）
**上游输入**：主理人裁决（3 课 L76–L78＝B1 提前课＋跨季综合；开 season-12 + m14）；本批三研究（瑞思/竞析/数析 2026-09-18）；并行 boost 需求池（去重记账）

## 📝 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1 | 2026-09-18 | 初稿：3 课（L76–L78）+ 3 案（#85–#87），开 season-12、m14；本批定位「B1 真课提前」 |

## 📌 TL;DR

1. **批十二＝3 课（L76–L78）**：好多了（much＋比较级）→ 一直在做（keep＋名字版）→ 一天的故事（跨季综合批收口）；开 season-12（{76,78}）＋m14（afterLesson 78），总课量 78。
2. **本批是「B1 真课提前」，不是 A2 真空补齐**（竞析 §③：五候选**无一源把该点放在 A2 段**）——L76 证据 A-（Murphy 中级 U106 点名＋BC B1-B2＋中文侧已收 much）、L77 证据 B-（跨源零位，靠中文专文＋我方家族接口）、L78 无跨源先例（自研形态）；§1.3 逐课标注。
3. **一课一增量**：L76 只教「much/far 站比较级前面给『更』加力」；L77 只教「keep＋名字版＝一直在做」；L78 零新知识点（跨季远距唤醒是唯一真缺口——现有混题全在同批 3–5 课内，L75→L29 是唯一远距 1 处）。
4. **两处同形隔离是本批最大未知**：much 在库 32 处 100% 数量义（L30×28）→ L76 专设「much money（数量）vs much better（加力）」对照；keep 案件 2 处全「保持」义（`huntCases.ts:961/:1639`）→ L77 开场明示「keep 不是收尾，是『一直』」（L64 距此 13 课，仍是最近邻）。
5. **展示层硬需求**：season-12＋m14＋3 案（#85–#87）随批上线——不落则 `grammarSeasons.test.ts` 先红、路径页静默过滤；L78 须配新案、**不引番外 5 案**（`huntService.test.ts:215` 硬断言）。

## 🎯 核心结论卡片

| 项目 | 内容 |
|---|---|
| 推荐方案 | 3 课 L76–L78：much 加力 → keep 名字版 → 跨季综合收口；3 案 #85–#87 |
| 优先级 | P1（内容生产批次）；无 P0 阻断项（boost R-B8 已并行落盘，cloze 按生效后词表核） |
| 预期影响 | 开 season-12；A2 收官后首演 B1 真课；跨季唤醒零先例形态建立；批量 78 |
| 资源需求 | ≈2.5 人日（内容 1.75＋展示层 0.25＋走查 0.25＋验收 0.25） |
| 风险等级 | 中高（much 同形隔离未验；L77 与 L64 最近邻互扰；L78 跨季叙事无形态可抄；L76/L78 cloze 落 is） |
| 硬性范围红线 | 课量 3 不扩不缩；一课一增量；L78 零新知；六段式；每课 1 案（4 错＝新 2＋旧 2、单 token 可修）；对比卡 6 条；禁用词表；comparison 不进案件；tagStats=10 不动；L1–75 零改动；封面池外零新资产 |

## §1 问题陈述与批次定位

### 1.1 解决什么问题

- **A2 收官后无「真空缺口」可补**：批十一已宣布 A2 结构收官，本批候选全在 B1 语料（数析：B1a–B1e 五组关键词面全 0）——问题不是「补漏」，是「B1 提前课以什么证据级别做」。
- **「更」说不出程度**：L17 `:2988`／L31 `:5577/:5637` 比较链在库，程度加力全 0；much 32 处全数量义（L30 `:5374`×28）、far 9 处全为 L73 `:13436` 认读——同形面全库最强，正是最大负迁移风险面。
- **「一直在做」结构缺位**：名字版通行证已四站（L42 `:7587`／L45 `:8148`／L64 `:11723`／L67 `:12289`），keep 课程侧 0、案件 2 处全「保持」义——「一直、老是」说不出来；cloze 恰是唯一「空位即考点」候选。
- **跨季远距遗忘是真缺口**：收口课已 8 先例（L41 `:7395`／L46 `:8326`／L49 `:8886`／L54 `:9825`／L60 `:10965`／L66 `:12101`／L71 `:13047`／L75 `:13804`），但混题全在同批 3–5 课内；竞析：六部竞品零跨季综合课先例。
- **系统账**：瑞思建议 4 课含 wh+to；竞析把 wh+to 降为「维持认读」；主理人裁决＝**3 课＋跨季综合**（wh+to 维持认读，§7）。

### 1.2 前置已铺完（本批直接衔接）

| 前置 | 行号 | 本批怎么用 |
|---|---|---|
| L17 比较链起点 | `:2988` | L76/L78 加力对象（「更」已有，今天给「更」加力） |
| L31 最高级＋不规则表 | `:5577/:5637` | L76 对照卡（good→better→best 老规矩，better 是熟人） |
| L30 数量词 much/many | `:5374` | L76 同形对照（much money 数量 vs much better 加力） |
| L73 how far 认读 | `:13436` | L76 far 仅认读（不入变体/复现） |
| 名字版四站 | `:7587/:8148/:11723/:12289` | L77 第五站（L64 最近邻，开场明示「不是收尾」） |
| keep 案件 2 处全「保持」义 | `huntCases.ts:961/:1639` | L77 义隔离（旧义读新句的防误读） |
| 收口课 8 先例 | `:7395`…`:13804` | L78 骨架（同接口、零字段新增） |
| 去 to 先例 12 处 | #16/33/54/56/58/70/71/73/78/79/83/84 | L77 对比卡（去掉 to 型） |

### 1.3 批次定位：A2 收官后首演——「B1 真课提前」的诚实说明

批十一已宣布 A2 结构收官；本批全部候选在 A2 段无位（竞析 §③ 三问制实读：五候选无一源把该点放在 A2 段；唯一 A2 段落点是 BC A1-A2 比较级页的 `far→further/farther` **形容词形**，非程度修饰用法）。故本批**正名为「B1 真课提前」**并逐课标注证据级别：**L76（A-）**＝Murphy 中级 U106 标题点名 much better＋BC B1-B2 Modifying comparatives＋中文侧 much/way 已收（唯一「两源点名＋中文半收＋双平台在库」）；**L77（B-）**＝跨源三源无位（Murphy 两册零命中、BC 两名单三度无 keep），立项靠中文侧专文（明写「很多學習者最容易犯錯」＋双错例 ❌kept to read）＋我方名字版垫子；**L78（自研项）**＝六部竞品零跨季综合课先例，无形态可抄、无跨源依据，立项理由是我方 78 课体量的远距遗忘＋收口传统 8 先例。三层证据强度不同，对外表述不得混用（不宣称跨源共识；L78 明标自研）。命名「B1 提前与跨季综合」：两课给结构（程度加力、一直做），一课把一批旧点串成一天的故事。

## §2 拆课方案与逐课规格

### 2.1 课量决策：3 课（L76–L78）

| 方案 | 取舍 | 裁决 |
|---|---|---|
| 2 课 | 砍 L78 跨季综合——但那是本批唯一零先例形态（跨季唤醒是真缺口），砍掉即放弃批收口传统 | ✗ |
| **3 课** | L76 → L77 → L78（零新知收口）；一课一增量；L78 配新案 #85 起、不引番外 5 案 | **✓ 拍板（主理人）** |
| 4 课 | 加 wh+to／look like：wh+to 跨源三度全无＋中文零专文（竞析降为维持认读）；look like 三缺（无 A2 源＋中文零专文＋词表近零） | ✗ |

课表：L76 `lesson-76-much-better`｜L77 `lesson-77-keep-doing`｜L78 `lesson-78-day-story`

### 2.2 逐课规格

**L76 好多了（much + 比较级）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-76-much-better`；episode「小美的一天 七十六」；scene `mansion`；cover `cover7`（单次池——原课「我们很开心」情绪语义最近：生产时语义核对） |
| title / grammarLabel | 「好多了」/「程度加力 · much + 比较级」 |
| targetSentence | `I feel much better today.`（6 token；生产时可微调为更常景句） |
| 场景 | 小美昨天不舒服，今天在客厅伸懒腰，说自己好多了 |
| 新知识点 | **只有一件**：给「更」加力的小词 much（far 同族）站比较级前面——much better／much taller；接第 17 课比较链（「更」已有，今天加力） |
| 对比卡方向（6 条） | ① 对照卡（同形两义）：`How much money do you have?`（数量，第 30 课 `:5374`）✅ 并排 `I feel much better.`（加力）✅——much 两岗：管数量 vs 给「更」加力，看它后头跟着谁；② `I am very better.` ❌（`very`）→ `much`——「好多了」用 much 不用 very（very 不能给「更」加力；先例 #75 `very→too` 同族「顶岗」）；③ `He is more taller than me.` ❌（`more`）→ `much taller`——「更」已藏在 taller 里，前面只加力不再叠 more（先例 #74 `taller→tall`、#25 `more good→better`）；④ 双正解：`I feel much better today.` ✅ 并排 `He is much taller than me.` ✅（同一个小词，一个管感觉一个管个子——成对出场）；⑤ 复习卡（L31 `:5577/:5637`）：`It is the best movie this year.` ✅（good→better→best 老规矩，今天在 better 前面加力）；⑥ 复习卡（L73 `:13436`）：`How far is the school?` ✅（far 老熟人今天只认读——「多远」还记得吗） |
| 变体方向 | 肯定 `I feel much better today.`（cloze 实跑：R-B8 词表落 **much**〔主考点即空位，幸运落点〕；旧 24 词表落第 2 词 feel——见 G12）/ 否定 `I am not much better today.`（noteZh：没好多——not 插在 much 前面）/ 疑问 `Are you much better today?`（noteZh：问对方好转没） |
| 复现题设计 | guided 复现 L17 原句 `This boat is bigger than that one.`（比较链起点）；practice 第 1 题 `I feel much better today.`＋变体逐字题 `Are you much better today?`；第 2 题保障句 `He is much taller than me.`（cloze 落 is——主考点 much 落空，靠 rebuild 保底）；第 3 题复现 L30 原句 `How much milk is there?` |
| 案件规划 | 新案 `hunt-feel-better`「身体好转条」（#85，§6） |
| 六段要点 | 开场召回 L17/L31 比较链（「更」怎么加力）；比喻＝「给『更』加力的小词」（much 站比较级前面）；deepDive：much 两岗对照（数量 vs 加力）＋far 认读一句；arrange ≤7 token |

**L77 一直在做（keep + 名字版）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-77-keep-doing`；episode「小美的一天 七十七」；scene `campus`；cover `cover42`（单次池——原课「我喜欢读书」阅读习惯语义最近：生产时语义核对） |
| title / grammarLabel | 「一直在做」/「习惯不停 · keep + 名字版」 |
| targetSentence | `I keep doing my homework.`（6 token） |
| 场景 | 放学后的自习角，小美看你每天来，说你一直在做作业、从没停下 |
| 新知识点 | **只有一件**：一件事一直做、不停做，用 keep＋名字版（keep doing）——名字版通行证第五站（L42→L45→L64→L67→今天）；开场必须明示：**keep 不是「收尾」（第 64 课 finish），keep 是「一直」** |
| 对比卡方向（6 条） | ① `I keep to do my homework.` ❌（去掉 `to`）→ `keep doing`——名字版通道只收名字版，不垫板（去 to 先例 12 处）；② `He keeps do it.` ❌（`do`）→ `doing`——名字版不装光板（#78 `open→opening` 同族；三单 keeps 只动 keep 自己）；③ 双正解（分工）：`I finished reading the book.`（第 64 课：做完了）✅ 并排 `I keep reading at night.`（一直在做）✅——finish 是刹车，keep 是不停车；④ 对照卡（同形两义）：`You keep quiet, please.`（案件 #41 `:1639` 的「保持」）✅ 并排 `I keep reading.`（一直做）✅——老位上的 keep 是「保持」，今天这条是「一直」（看后头跟的是状态还是名字版）；⑤ 复习卡（L45 `:8148`）：`I enjoy reading.` ✅（名字版通行证老站，今天第五站）；⑥ 复习卡（L67 `:12289`）：`I am good at drawing.` ✅（通道老规矩：入口后面永远跟名字版） |
| 变体方向 | 肯定 `I keep doing my homework.`（cloze 双口径实跑：旧 24 词表落 **doing**〔空位＝考点〕；R-B8 词表落 **keep**〔②实词兜底命中本体，不落机械兜底词〕——以生产时生效词表实跑为准，G12）/ 否定 `I don't keep doing it.`（noteZh：不再一直做——don't 帮忙，后面照样名字版）/ 疑问 `Do you keep reading at night?`（noteZh：你一直晚上读书吗；保障句） |
| 复现题设计 | guided 复现 L64 原句 `I finished reading the book.`（最近邻先划界：那是做完，今天是没停）；practice 第 1 题 `I keep doing my homework.`＋变体逐字题 `Do you keep reading at night?`；第 2 题 `I keep reading at night.`（cloze 落 keep——保障句）；第 3 题复现 L42 原句 `I like reading.`（通行证首站） |
| 案件规划 | 新案 `hunt-hobby-habit`「习惯打卡表」（#86，§6） |
| 六段要点 | 开场点名 L64（finish＝做完）＋案件 #41 keep quiet（旧义「保持」）；比喻＝「名字版通行证第五站：keep＝一直」；deepDive：keep doing 三连（doing／reading／watching 各一）＋三单 keeps 只动自己；arrange ≤6 token |

**L78 一天的故事（跨季综合 · 零新知全复现 · 批收口）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-78-day-story`；episode「小美的一天 七十八」；scene `sparkle`；cover `cover25`（单次池——原课「他每天喝牛奶」日常作息语义最近：生产时语义核对） |
| title / grammarLabel | 「一天的故事」/「收口 · 跨季大团圆（零新知）」 |
| targetSentence | `I run every day, and I keep reading.`（8 词，句长原则触顶）；生产备选 `Do you run or walk every day?`（7 词，用上全库仅 4 处的 or）——二选一，**生产时定稿** |
| 场景 | 傍晚的公园长椅，小美把一天做的事串成一条线讲给你听 |
| 新知识点 | **无——本批唯一零新知课**（收口传统 8 先例同构，接口零字段新增）；跨季取材：L17 比较 + L25/L28 每天与频率 + L45 名字版 + L64 finish + 本批 L76/L77 两点 |
| 对比卡方向（6 条） | ① `I finished read the book.` ❌（`read`）→ `reading`——名字版通道：finish 后面也收名字版（第 64 课老规矩；#73 `finish read→reading` 先例）；② `I feel very better today.` ❌（`very`）→ `much`——刚学的加力小词回流（第 76 课；先例 #75 `very→too`）；③ 双正解（跨季两兄弟）：`This boat is bigger than that one.`（L17 `:2988`）✅ 并排 `I feel much better today.`（L76）✅——「更」与「更加力」同台；④ 双正解（名字版同台）：`I enjoy reading.`（L45 `:8148`）✅ 并排 `I keep reading at night.`（L77）✅；⑤ 复习卡（L28 `:5006`）：`I always arrive early.` ✅（频率位老规矩）；⑥ 认读（稀缺连词 when）：`When it is sunny, I run in the park.` ✅（第 48 课 if 家族的老邻居，只认读不入变体） |
| 变体方向 | 肯定 target（cloze 实跑：run 表内命中——收口课无主考点，空位落在哪都算合格，生产时按生效词表实跑登记）/ 否定 `I don't run every day, but I keep reading.`（noteZh：不是每天跑，但一直在读）/ 疑问 `Do you run or walk every day?`（noteZh：跑还是走——两条路挑一条，or 是老朋友） |
| 复现题设计 | guided 复现 L28 原句 `I always arrive early.`（频率位起点）；practice 第 1 题 target＋变体逐字题；第 2 题复现 L17 原句 `This boat is bigger than that one.`；第 3 题复现 L45 原句 `I enjoy reading.`；第 4 题＝全批收官惯例，复现 L76 原句 `I feel much better today.` |
| 案件规划 | 新案 `hunt-full-day`「一天记录」（#87，§6）；**不引番外 5 案** |
| 六段要点 | 开场跨季倒带（L17 比较链／L25 every day／L28 频率位）；比喻＝「把一天串成一条线」（先是「更」，再是「一直」，最后讲一天）；deepDive：跨季三兄弟各回一句＋when 认读一句；arrange ≤8 token |

## §3 中文负迁移处理专章

| 课 | 干扰 | 典型错 | 话术方向 | 归入 |
|---|---|---|---|---|
| L76 | 「好多了」直译，very 顶岗 | \*I am very better.／\*I am much good. | 「给『更』加力用 much，very 不站这个位」——先例 #75 `very→too` 同族 | 对比卡 ② |
| L76 | 「更」叠着再说一次 | \*He is more taller than me. | 「『更』已经藏在 taller 里，前面只加力、不叠 more」——先例 #25 `more good→better`、#74 `taller→tall` | 对比卡 ③ |
| L76 | much 同形串义（数量→加力） | 旧义「数量」读新句 | 「much 两岗：管数量（much money）／给『更』加力（much better）——看它后头跟着谁」 | 对比卡 ①（走查项） |
| L77 | 垫板惯性 | \*I keep to do… | 「名字版通道只收名字版，不垫板」——去 to 先例 12 处 | 对比卡 ① |
| L77 | 三单／光板惯性 | \*He keeps do it. | 「三单只动 keep 自己，后面照样名字版」——#78 `open→opening` 同族 | 对比卡 ② |
| L77 | 「一直」配了过去 | \*I keep doing it yesterday. | 设计规避：变体不提供过去时间词，登记为错型预警（§8-4） | 走查登记，不做卡 |
| L77 | 与 L64 互扰 | 把 keep 当「收尾」 | 「finish 是刹车，keep 是不停车」——开场明示 | 对比卡 ③（走查项） |
| L78 | 混排错型边界 | —（不新增干扰） | 错型只用旧案锚点，不引入未教材料 | §6 案件表纪律 |

## §4 叙事设计专章

### 4.1 叙事草案（逐字采用）

> **「先是『更』，再是『一直』，最后讲一天。」**
> 更：This boat is bigger than that one.（第 17 课）→ I feel much better today.（给「更」加力）。
> 一直：I finished reading the book.（第 64 课做完）→ I keep doing my homework.（一直在做，没停）。
> 一天：I run every day, and I keep reading.（跨季大团圆——把比较链、名字版、频率位串成一条线）。

### 4.2 复用体系（不造新比喻）

- 「比较链」（L17 `:2988`／L31 `:5577/:5637`——L76 加力、L78 同台）
- 「名字版通行证」（L42 `:7587`／L45 `:8148`／L64 `:11723`／L67 `:12289`——L77 第五站）
- 「不垫板／穿原样」（去 to 先例 12 处——L77）
- 「收口传统」（8 先例 `:7395`…`:13804`——L78；跨季首次）
- 「同形两义对照」（L30 `:5374` much 数量／案件 #41 `:1639` keep 保持——L76/L77 各一条）

### 4.3 禁用词表（本批生产禁出现）

程度副词、比较级、最高级、动名词、动词不定式、频度副词、宾语、三单、助动词、非谓语、内从句——全禁；用「加力的小词／名字版／通行证／站前面／不停车／一天的故事」替代。

## §5 验收标准

### 5.1 检查清单

- [ ] G1 practice ≥4 且含变体逐字题（L76 `Are you much better today?` / L77 `Do you keep reading at night?` / L78 `I don't run every day, but I keep reading.`）
- [ ] G2 tokens/answer 词集一致、distractors 不重复
- [ ] G3 recall 三字段非空
- [ ] G4 arrange/practice 展示序≠答案序
- [ ] G5 罪名枚举：3 案 tag 全落 10 枚举（预期 word_order/verb_form/plural/preposition/tense）；**本批不碰 comparison**
- [ ] G6 案件结构：tokenIndex 对齐、errors=4（新错 2＋旧错 2）、单 token 可修（短语级替换按 #36/#75 先例）、≥1 净词、reviewed=true
- [ ] G7 tagStats=10 不动（`huntService.test.ts:109`）
- [ ] **G8 展示层硬需求**：season-12（min 76, max 78）＋m14（afterLesson 78）随批上线——`grammarSeasons.ts` 在 season-11（`:40`）后追加 `{ id: "season-12", label: "第十二季 · 提前与收口", hint: "好多了、一直在做、一天的故事——给『更』加力，把习惯说出口，再把一天串成线", min: 76, max: 78 }`；`GrammarPathPage.tsx` CAN_DO_MILESTONES 在 m13（`:204`）后追加 m14（标题「我能给『更』加力、说清一直在做，还会把一天讲成故事」，样本句 `I feel much better today.` / `I keep doing my homework.` / `I run every day, and I keep reading.`）
- [ ] **G8-b 守门测试**：`grammarSeasons.test.ts` 四断言全绿——「最高课号 78 落区间」（`:16-25`/`:44-49`）与「区间不重叠」（76 > 75）
- [ ] G9 orphans 纪律：3 个新案（#85–#87）全部被 L76–L78 引用（番外案名单冻结 5 个不动，`huntService.test.ts:215`）
- [ ] G10 episode 写法：L76–L78 全部汉字数字（「小美的一天 七十六」…「七十八」）
- [ ] G11 语料锁闭集：much 只作加力（不新造数量义句）；far/when 各只认读一句（不入变体/复现）；keep 只用「一直做」义（不做「保持」新句，旧义只对照）；L78 零新知识点（所有素材逐句可追到旧课）
- [ ] G12 cloze 逐课核验（**按生产时生效词表实跑**）：L76 `I feel much better today.`——R-B8 词表落 much（主考点即空位）；旧 24 词表落第 2 词 feel；保障句 `He is much taller than me.` 落 is（主考点 much 落空，靠 rebuild 保底）；L77 `I keep doing my homework.`——旧表落 doing（空位＝考点）、R-B8 表落 keep（实词兜底命中本体）；保障句 `I keep reading at night.` 落 keep；L78 `I run every day, and I keep reading.` 落 run（收口课任意皆合格）——逐课预演确认题干可读
- [ ] G13 时长 6–8 min（L78 句长触顶，逼近上限，走查核）；G14 旧线零回归（L1–75 不动；51 文件 605 测试全绿 + build 通过）

### 5.2 Given/When/Then

- **G-A1** Given 学习者完成 L76 When 看对比卡 `I am very better.` ❌ / `I feel much better.` ✅ Then 能说出「给『更』加力用 much，very 不站这个位」
- **G-A2** Given 学习者完成 L76 When 看对照卡 `How much money do you have?` ✅ / `I feel much better.` ✅ Then 能说出「much 两岗：管数量与给『更』加力，看后头跟着谁」
- **G-A3** Given 学习者完成 L77 When 看对比卡 `I keep to do my homework.` ❌ / `I keep doing my homework.` ✅ Then 能说出「名字版通道只收名字版，不垫板」
- **G-A4** Given 学习者完成 L77 When 看双正解 `I finished reading the book.` ✅ / `I keep reading at night.` ✅ Then 能说出「finish 是刹车，keep 是不停车」
- **G-A5** Given 学习者在 `hunt-full-day` 遇到 `very` When 修成 `much` Then 句子全对，并能说出「这是第 76 课刚学的加力小词」
- **G-A6** Given 学习者完成 L78 When 回看跨季四句（L17/L28/L45/L64）Then 能各自说出一句「这是第 N 课学的」

## §6 案件规划（3 案）

**总规则**：每案 4 错＝新错 2＋旧错 2；单 token 可修；每案 ≥1 净词；零术语话术；tag 全落 10 枚举（tagStats 固定 10 项）；reviewed: true；**必须配课**；**不碰 comparison**；**不引番外 5 案**。案件编号接批十一尾号（#84 `hunt-park-plan`，`huntCases.ts:3550`）为 **#85–#87**。

| 案件 id | 配课 | 场景 | 定稿错误构成（原 → 修正（tag，新错/旧错）） |
|---|---|---|---|
| `hunt-feel-better` | L76 | 身体好转条 | ① `very` → `much`（word_order，新错——加力小词顶岗；先例 #75 `:3162`）② `more` → 去掉（\*more taller → much taller）（verb_form，新错——先例 #25 `:930`、#74）③ `minute` → `minutes`（plural，旧错）④ `on` → `in`（in the morning 复现 L18）（preposition，旧错） |
| `hunt-hobby-habit` | L77 | 习惯打卡表 | ① `to` → 去掉（\*keep to do → keep doing）（verb_form，新错——去 to 先例 12 处）② `do` → `doing`（verb_form，新错——名字版不装光板；#78 同族）③ `book` → `books`（plural，旧错）④ `on` → `at`（at night 复现 L18）（preposition，旧错） |
| `hunt-full-day` | L78 | 一天记录 | ① `very` → `much`（word_order，新错——本批 L76 点回流，以 `hunt-feel-better` 为锚）② `do` → `doing`（verb_form，新错——本批 L77 点回流，以 `hunt-hobby-habit` 为锚）③ `shoe` → `shoes`（plural，旧错——复数复现 L9/L11）④ `on` → `in`（in the park／in the morning，preposition，旧错 L18） |

> **案件表纪律**：每案 4 错全部单 token 可修、tokenIndex 与 tokens 对齐（生产时逐 token 核对）；新错话术走 §3 负迁移表；旧错一律取自已教点（L9/L11/L18），禁引入未教材料；L78 案以双语料锚（#85/#86）复现，不新增错型。

## §7 Non-goals

- **不做** wh+to（跨源三度全无＋中文零专文——竞析降为维持认读，不进课）；**不做** look like（三缺：无 A2 源＋中文零专文＋词表近零，留后）
- **不做** stop 变义对（单源＋就绪度 0.5）；**不做**独立难度爬坡课（吸收为 L78 句长原则 7–8 词）
- **不做**机制强化（R-B15 弱点选题／R-B17 复练换池与 boost 重复——**记账去重**，见 `prd-grammar-boost-2026-09-18.md`）
- **顺延** make 使役（批十三）；**冻结** 交通方式／may·might／附加疑问／深水区
- **不做** How far 主攻（L76 认读一句）；**不新造** much 数量义句、keep「保持」义句（旧义只对照）
- **案件不碰** comparison；**不加**新枚举、不改 tagStats/schema、不动 L1–75；**不引**番外 5 案
- **不做**封面池外新资产（3 课全部从单次池 23 张选）

## §8 开放问题

1. **much 同形隔离效果**：32 处 100% 数量义，对照卡（第 1 条）能否接住双义？默认：对照卡＋走查点（首过率与 M4 观察）；若不通，备选加一句「much 后头跟名字＝数量，跟『更』＝加力」口令。
2. **L77 与 L64 最近邻**：相隔 13 课仍是最近邻（family 四站中最近）；默认开场明示「keep 不是收尾」＋对比卡 ③；若走查发现互扰，把 finish 复现题前移为 guided 首题（已按此办）。
3. **L78 跨季叙事设计自由度**：零先例，target 二选一（8 词 and 句／7 词 or 句）——默认目标句用 8 词版（跨批收口更完整），or 版留给变体；**生产时可重设计**，只锁「跨季取材＋7–8 词＋优先稀缺连词」三要点。
4. **L78 新案旧错取材边界**：第 4 错（preposition）与 #85/#86 同型（in/at）——是否算「净增量不足」？默认：允许同型（旧错复现优先稳定），生产时核 ≥1 净词。
5. **机制强化与 boost 去重记账**：R-B15/R-B17 与「弱点 Top3×会话配额」边界已由 boost 占位；本批仅记账、不立项；默认：写入批十二关账说明（不互锁）。
6. **cloze 词表双口径**：R-B8（24→60+，`grammarAmbushService.ts:160/:190`）已落盘未合并——G12 以生产时生效词表实跑为准；若未生效则按旧表结论执行（含 L76 保障句）。
7. **封面语义核对**：3 张（cover7/cover42/cover25）生产时逐张核；不匹配换单次池语义近者（23 张余量充足）。

## §9 里程碑（粗略，正式排期归路径）

| 阶段 | 产出 | 说明 |
|---|---|---|
| M0 规格冻结 | 本 PRD 评审 | 无 P0 前置项 |
| M1 打样 | L76 全量 + `hunt-feel-better` + 首玩走查 | 重点：much 同形隔离话术、cloze 落点（is→rebuild）（本批最大未知） |
| M2 生产 | L77–L78 + 2 案 + season-12/m14 展示层 | ≈1.5 人日；L78 先定稿 target 二选一 |
| M3 验收 | §5 全量 + 路径页走查 | G8/G8-b/G9 硬需求；L78 时长逼近 8 min 上限 |
| M4 上线观察 | 首过率、very→much／keep to do 新错命中率、cloze 落点、m14 触发、跨季唤醒 | 挂既有埋点；与 F9/F10/F11-B、boost 数据合并关账（不互锁） |

## ✅ 行动清单

| # | 行动 | 负责方 | 时间窗 |
|---|------|--------|--------|
| 1 | L76 + `hunt-feel-better` + 走查（much 双岗话术定稿） | 内容 | D1–D2 |
| 2 | L77 + `hunt-hobby-habit`（keep≠finish 开场话术） | 内容 | D2–D3 |
| 3 | L78 + `hunt-full-day`（跨季取材＋target 定稿） | 内容 | D3–D4 |
| 4 | season-12 + m14（约 10 行） | 开发 | 随批 |
| 5 | 验收 + 路径页走查（守门测试四断言） | 内容/开发 | D5 |
| 6 | M4 观察 | 产品负责人 | 上线后 1–2 周 |

## ⚠️ 待确认 / 假设 / Non-goals

- 开放问题 §8 七项（均有默认方案）
- 假设：单次封面池 23 张中语义近者充足（本批取 3 张）；episode「七十六…七十八」零占用（数析实读）；boost R-B8 词表在 L76–L78 生产前生效（否则按旧表结论）
- 依赖：L76 依赖 L17/L31/L30/L73；L77 依赖 L42/L45/L64/L67/#41 案；L78 依赖 L17/L25/L28/L45/L48/L64＋本批 L76/L77
- Non-goals：见 §7（含 wh+to 维持认读、look like 留后、机制强化去重记账）

## 📚 数据来源 & 成员产出索引

- 析客（本 PRD）；瑞思：`user-research-grammar-twelfth-batch-2026-09-18.md`；竞析：`competitive-analysis-grammar-twelfth-batch-2026-09-18.md`；数析：`data-audit-grammar-twelfth-batch-2026-09-18.md`；并行 boost：`prd-grammar-boost-2026-09-18.md`（R-B8/R-B15/R-B17）
- 正文事实核对：`grammarLessons.ts`（L17 `:2988`、L25、L28 `:5006`、L30 `:5374`、L31 `:5577/:5637`、L42 `:7587`、L45 `:8148`、L48、L64 `:11723`、L67 `:12289`、L73 `:13436`、收口 8 先例 `:7395`/`:8326`/`:9825`/`:10965`/`:12101`/`:13047`/`:13804`、episode 尾「七十五」）；`huntCases.ts`（keep 案 `:961`/`:1639`、#25 `:930`、#75 `:3162`、尾案 #84 `:3550`）；`grammarSeasons.ts:40`；`GrammarPathPage.tsx:204`；`grammarAmbushService.ts:160/:190`（cloze 词表与兜底逻辑，本 PRD cloze 结论为 2026-09-18 实跑复刻）
- 红线核对：去 to 先例 12 处；tagStats=10（`huntService.test.ts:109`）；番外 5 案硬断言（`huntService.test.ts:215`）；句长 max 8 词（仅 6 课达标）、全库 ≥9 词仅 23/2697；封面单次 23 张

---

> 本报告由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。
