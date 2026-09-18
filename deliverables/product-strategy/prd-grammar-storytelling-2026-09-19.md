# PRD：第十五批课程 · 讲故事（8 课：L95–L102 · 大章节 · 单拱）

**日期**：2026-09-19 ｜ **类型**：功能规格书（PRD）｜ **成员**：析客（需求分析）
**上游输入**：主理人裁决（8 课 L95–L102＝「讲故事」大章节；开 season-15＋m17；场景锚「昨天那个电话」）；本批三研究（瑞思/竞析/数析 2026-09-19）；产品负责人「大章节（6–8 课）」要求

## 📝 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1 | 2026-09-19 | 初稿：8 课（L95–L102）＋8 案（#104–#111），开 season-15、m17；定位「第三个大章节 · 单拱（一条电话故事线）」 |

## 📌 TL;DR

1. **批十五＝8 课（L95–L102）「讲故事」**：那时正在做 → 当时正下着雨 → 电话响的时候 → 一边…一边… → 那次去了 vs 那时正在 → 从前常这样 → 讲故事 → 章末零新知收口；开 **season-15（{95,102}）＋m17（afterLesson 102）**，批量 102 课、111 案。
2. **单拱结构声明（避免连续双拱）**：批十四刚破例双拱，竞析 §⑤-6 判「连续第二批双拱」风险由中升中高——本批取**乙单拱**，全批一条「**昨天那个电话**」故事线，不用双拱缝；章内守「场景锚 → 一课一增量 → 章末零新知收口」，**中段自走查落 L98**（while 干净引入处）。
3. **一课一增量**：L95 只教「was＋动作穿 -ing」（昨天版正在）／L96 只教天气句的昨天版／L97 只教 when 领的那截＋当时正做着／L98 只教 while（两边都穿 -ing）／L99 只教「哪件用哪个版本」（打断的小事用昨天版）／L100 只教在讲故事里用 used to；L101 跨课混排、L102 零新知。
4. **三层证据**：L95–L99＝**A 档**（BC A1-A2 唯一承载课「Past continuous and past simple」＋Murphy **初级 U13/U14＝书首 12%**＋Cambridge 专页 background/main event＋中文侧四篇含 5 题测验）；L100＝**A- 档**（L93 平台＋BC B1-B2 明文「is often used in stories」）；L101/L102＝自研收口（L78 `:14362`／L94 `:17400` 先例）。
5. **五零真空白正落＋cloze 分化**：while 0／during 0／as 连词 0／when＋过去进行 0／进行 vs 过去 0——**L98 为 while 全库首次引入**（配 ❌during 对比卡）；L95/L96 落 **was（正中）**，**L97 落 was＝主考点落空、须 variant 兜底落 reading**，L99 `rang` 不在词表（生产时实跑复核，兜底落 rang 前词）。
6. **案件 8 案（#104–#111）**：4 错＝新 2＋旧 2；薄罪名 **fragment 14／run_on 11 续落**；不碰 comparison；preposition 每案至多 1 条；不引番外 5 案；**G-boost 硬护栏——每课 contrast 6 条中至少 2 条带 wrongMark 的真实错卡**（批十四曾因该口径贴线被测试红）。

## 🎯 核心结论卡片

| 项目 | 内容 |
|---|---|
| 推荐方案 | 8 课 L95–L102「讲故事」单拱大章节：过去进行升级 1 → 背景句 1 → when 打断 1 → while 同时 1 → 两版本分工 1 → used to 回讲 1 → 混排 1 → 零新知收口 1；8 案 #104–#111；开 season-15＋m17 |
| 优先级 | P1（内容生产批次）；无 P0 阻断项 |
| 预期影响 | 第三个 8 课大章节（首个单拱大章）；补叙事时态五零真空白（while／during／as 连词／when＋过去进行／进行 vs 过去）；L34 孤本一格扩成一章；首次跨批**对白闭环**（L97 回答 L34 `:6129`「I called you but no answer.」）；批量 102 |
| 资源需求 | ≈5 人日（内容 4＋展示层 0.25＋走查 0.5＋验收 0.25）；两段式跨 2 周 |
| 风险等级 | 中（L97 主考点 cloze 落空需兜底；L98 while 与 L92 when 同岗干扰；L99 两版本分工认知负荷；L100 与 L93 增量边界；封面单次池 8 张须语义核对） |
| 硬性范围红线 | 课量 8 不扩不缩；一课一增量；L102 零新知；六段式；每课 1 案（4 错＝新 2＋旧 2、单 token 可修）；对比卡 6 条（**≥2 条带 wrongMark**）；禁用词表；comparison 不进案件；tagStats=10 不动；L1–94 零改动；封面池外零新资产 |

## §1 问题陈述与批次定位

### 1.1 解决什么问题

- **大章节续作**：批十三首开 8 课大章（season-13）、批十四续（双拱）——本批以**第三个 8 课大章＋首个单拱**接续，season-15 一次到位，兑现产品负责人「章节课程多一些」。
- **叙事时态五零真空白**：`while`／`during`／`as` 连词／`when＋过去进行`／「进行 vs 过去」**全 0**——L34（`:6103–6281`）教了「过去某时正在做」（36 处 was/were＋-ing、contrast 6 张）却**没有下一课**；deepDive `:6186` 明文埋「讲故事背景（It was raining）」、practice `:6270` 明文「讲故事」——**L34 自己指了方向**。
- **平台厚但孤本**：was/were＋-ing 回声仅 4 处（L35 `:6418`／L36 `:6604`／L51 `:9341`／L60 `:11090`）；案 #43 `hunt-past-rainy-day`（`:2690–2750`）是**全库唯一叙事型**过去进行案——一格素材扩成一章，学生负担是**组合**不是新体系。
- **跨批对白闭环首次**：L34 `:6129` 对白「I called you but no answer.」——**只有去电、没有回话**；本批 L97 直接回答它（`When you called, I was reading.`），机制上首次把旧课对白当接口。
- **打断语料零**：`rang`／`ring`／`knock`／`doorbell`／`suddenly` 两文件 0；`phone` HC 4 处全是名词——L99 须造 1 组打断动词（`rang`），并要求 `<8 词`。
- **boost 联动护栏**：批十四 8 课里 **6 课贴线（恰 2 道改错题）**，全库逐课断言 `collected.size < 2 → thin` 曾红；本批 8 课全部按「**≥2 条带 wrongMark 的真实错卡**」规格产出（推荐 3 条）。

### 1.2 前置已铺完（本批直接衔接）

| 前置 | 行号 | 本批怎么用 |
|---|---|---|
| L34 过去进行孤本 | `:6103–6281`（target `:6114`、对白 `:6129`、deepDive `:6186`、practice `:6270`） | L95 平台升级＋L96 兑现 `:6186` 伏笔＋L97 对白闭环＋L99 打断先例 |
| 案 #43 唯一叙事型 | `hunt-past-rainy-day` `:2690–2750` | L96 叙事案先例（同一案两处 verb_form 可） |
| L10 一般过去 | `:1699`（target `:1707`） | L95/L97/L99/L101 对照面（哪件用昨天版） |
| L27 疑问词 when | `:4821`／`:4840`（When is your birthday?） | L97 同形对照（问「什么时候」vs「当…的时候」） |
| L87–L89 天气句 | L87 `:16072` 起 | L96「天气句的昨天版」的原版（今天版 vs 昨天版） |
| L92 when 从句（现在版） | `:17019` | L97 过去版对照面——when 的岗 L92 已立，本批只换版本 |
| L93 used to | `:17208–17394`（`:17280`／`:17281`） | L100 平台（recall 变体）；增量＝**在讲故事里用** |
| L78／L94 收口先例 | `:14362`／`:17400` | L101／L102 双收口同构（跨课混排＋零新知） |
| 案 #103 尾案 | `hunt-after-school-talk`（`huntCases.ts` 尾） | 下号 **#104**；番外 5 案冻结（`huntService.test.ts:215`） |
| 展示层 | `grammarSeasons.ts:46`（season-14）／`GrammarPathPage.tsx:225`（m16） | season-15／m17 追加位（纯增量） |

### 1.3 批次定位：单拱——一条电话故事线

本批是第三个大章节，也是**首个单拱大章**。竞析 §③ 三问制判乙「过去进行深化」＝**A 档**（①BC A1-A2 唯一课程位＋Murphy 初级前 12%＋Cambridge 专页；②中文侧四篇＋5 题测验＋三句同义改写组；③我方平台在库但薄、四零真增量），并明确：**零新结构**（when 从句 L92 已在库＋past continuous L34 已在库，合成「背景＋打断」是**组合**不是新体系）。瑞思推荐丁双拱（3＋4＋1），主理人**已改采乙单拱**——理由即竞析 §⑤-6：批十四刚双拱，连续第二批双拱风险升中高，而乙的容量（6–8）本可撑满 8 课。处理办法＝**全批一条故事线（昨晚八点那个电话）**：我在看书（L95）→ 外面正下着雨（L96）→ 你打电话时我正在看书（L97，回答 L34 的对白）→ 我和弟弟一个看书一个睡觉（L98）→ 电话响时我正在看书（L99）→ 从前我常在这儿玩（L100）→ 把故事串起来讲（L101）→ 电话故事收口（L102）。**中段自走查落 L98**（while 干净引入＋换挡观察点）。分档：L95–L99＝A 档；L100＝A- 档（L93 平台在库、BC 明标 used to「is often used in stories」＝讲故事位）；L101/L102＝自研收口。

## §2 拆课方案与逐课规格

### 2.1 课量决策：8 课（L95–L102）

| 方案 | 取舍 | 裁决 |
|---|---|---|
| 6 课（乙单开，瑞思备选） | 砍 L101/L102 双收口——破 10 先例的章末零新知传统；产品负责人点名大章节、批十三/十四均 8 课不缩量 | ✗ |
| 7 课 | 砍 L100（used to 回讲）——`used to` 是「讲故事」最常用的叙事件（BC 明文），不讲则故事不完整；且删课破坏 8 案配平 | ✗ |
| **8 课** | 过去进行升级 1＋背景 1＋when 打断 1＋while 1＋两版本 1＋used to 1＋混排 1＋收口 1；一课一增量；8 案 #104 起；单拱由一条电话故事线承载 | **✓ 拍板（主理人）** |

课表：L95 `lesson-95-was-doing`｜L96 `lesson-96-was-raining`｜L97 `lesson-97-when-called`｜L98 `lesson-98-while`｜L99 `lesson-99-when-rang`｜L100 `lesson-100-used-to-story`｜L101 `lesson-101-tell-story`｜L102 `lesson-102-phone-story`

**封面（本批吃单次池 8 张）**：单次池 12 张（cover13·14·15·22·27·37·38·40·41·45·47·48）——本批按编号序取前 8：L95←`cover13`｜L96←`cover14`｜L97←`cover15`｜L98←`cover22`｜L99←`cover27`｜L100←`cover37`｜L101←`cover38`｜L102←`cover40`（数析实算 8 张单次池瓶颈 **62**，为四方案最优；批十六起再全面三用）。**生产时须逐张语义核对**（雨／窗／电话／客厅／操场等画面与课文是否相称）；不符者在本批 8 张内部互换，实在不符再与单次池余 4 张（cover41·45·47·48）互换（**池外零新资产**；`cover` 缺省可回退 scene SVG 不阻塞上线）。批十四刚三用的 cover10·16·18·20·21·26·31·32 本批与下批**勿碰**。

### 2.2 逐课规格

**L95 那时我正在看书（昨天版正在：was＋穿 -ing）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-95-was-doing`；episode「小美的一天 九十五」；scene `campus`；cover `cover13`（单次池张） |
| title / grammarLabel | 「那时我正在看书」/「那时正做着 · was + 穿 -ing」 |
| targetSentence | `I was reading at eight.`（5 token；cloze 落 **was**——正中考点） |
| 场景 | 昨天那个电话的故事开场：回想昨晚八点自己在做什么 |
| 新知识点 | **只有一件**：说「那时正做着」——be 换成昨天版 was/were，动作照穿 -ing 外套（L34 `:6103–6281` 平台升级） |
| 对比卡方向（6 条） | ① `I was read at eight.` ❌（动作没穿 -ing）→ `I was reading at eight.`（**wrongMark `read`**，verb_form）；② `I read at eight.` ❌（丢了「那时正做着」）→ `I was reading at eight.`（**wrongMark `read`**，tense）；③ 双正解（各时段一句）：`I was drawing at three.`（L34 `:6114`）✅ 并排 target ✅——同一套说法换个钟点；④ 认读（L34 例）：`What were you doing?` ✅（问「你那时在干嘛」）；⑤ 复习卡（L34 例）：`She was reading last night.` ✅；⑥ 复习卡（L10 `:1707`）：`Yesterday I went to the park.` ✅（昨天去了 vs 那时正做着） |
| 变体方向 | 肯定 target（cloze 落 was——正中）/ 否定 `I was not reading at eight.`（noteZh：那会儿我没在看书）/ 疑问 `Were you reading at eight?`（noteZh：八点你在看书吗——Were 搬句首） |
| 复现题设计 | guided 复现 L34 原句 `I was drawing at three.`；practice 第 1 题 target＋变体逐字题；**第 2 题保障句 `They were playing football.`（cloze 落 were——一伙人用 were）**；第 3 题复现 L10 原句 `Yesterday I went to the park.` |
| 案件规划 | 新案 `hunt-eight-reading`「八点读书」（#104，§6）；错型 verb_form＋sv_agreement＋旧错 tense／plural |
| 六段要点 | 开场召回 L34（过去某时正在做）；比喻＝「昨天版的『正在』：be 换昨天版，外套照穿」；deepDive：was＋-ing 三连＋漏 -ing／丢进行各一错；arrange ≤5 token |

**L96 当时正下着雨（背景句：天气的昨天版）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-96-was-raining`；episode「小美的一天 九十六」；scene `city`；cover `cover14`（单次池张） |
| title / grammarLabel | 「当时正下着雨」/「背景句 · It was + 穿 -ing」 |
| targetSentence | `It was raining.`（3 token；cloze 落 **was**——正中考点） |
| 场景 | 故事第二句：那天晚上，外面正下着雨（窗上全是水） |
| 新知识点 | **只有一件**：天气句的**昨天版**——L87–L89 说今天（`It is raining.`／`It is cold today.`），今天说那天（`It was raining.`）；接案 #43 唯一叙事型先例 |
| 对比卡方向（6 条） | ① `It was rain.` ❌（动作没穿 -ing）→ `It was raining.`（**wrongMark `rain`**，verb_form）；② `It rains yesterday.` ❌（yesterday 在场，动词没换版本）→ `It was raining.`（**wrongMark `rains`**，tense）；③ 对照卡（同一场雨两版）：`It is raining.`（L6 `:1019-1023`）✅ 并排 `It was raining.` ✅——今天版／昨天版；④ 认读（L34 `:6186` deepDive 原句）：`It was raining.`「讲故事背景」——**第 34 课埋的伏笔今天兑现**；⑤ 复习卡（L19 `:3366`）：`It was windy, but we were happy.` ✅（那时版天气老熟人）；⑥ 复习卡（L87 target）：`It's cold today.` ✅（今天版对照） |
| 变体方向 | 肯定 target（cloze 落 was——正中）/ 否定 `It was not raining.`（noteZh：那会儿没下雨）/ 疑问 `Was it raining?`（noteZh：那时在下雨吗） |
| 复现题设计 | guided 复现 L34 practice 原句 `It was raining.`（`:6270` 同一句两次碰面）；practice 第 1 题 target＋变体逐字题；**第 2 题保障句 `It is raining.`（cloze 落 is——今天版，主考点落空）**；第 3 题复现 L87 原句 `It's cold today.` |
| 案件规划 | 新案 `hunt-rainy-memory`「雨夜回忆」（#105，§6）；错型 verb_form＋tense＋旧错 plural／sv |
| 六段要点 | 开场点名 L34 `:6186`「第 34 课说过去进行最常用的场景之一就是讲故事背景」；比喻＝「今天版说今天、昨天版说那天」；deepDive：It was -ing 三连＋漏 -ing／没换版本各一错；arrange ≤3 token |

**L97 电话响的时候（when 领的那截＋当时正做着）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-97-when-called`；episode「小美的一天 九十七」；scene `mansion`；cover `cover15`（单次池张） |
| title / grammarLabel | 「你打电话的时候」/「那时候 · when + 当时正做着」 |
| targetSentence | `When you called, I was reading.`（6 token；cloze 落 **was——主考点落空，须 variant 兜底落 reading**） |
| 场景 | 故事第三句，**直接回答 L34 的对白**「I called you but no answer.」——你打电话的时候，我正在看书 |
| 新知识点 | **只有一件**：when 领的那截说「那件小事」，另一截说「当时正做着」（穿 -ing）——BC 原文「the past simple action happened in the middle of the past continuous action」 |
| 对比卡方向（6 条） | ① `When you called, I read a book.` ❌（当时正做着丢了版本）→ `When you called, I was reading.`（**wrongMark `read`**，tense）；② `When you call, I was reading.` ❌（打电话那件没换昨天版）→ `When you called, I was reading.`（**wrongMark `call`**，tense）；③ 对照卡（成对两版）：`When you called, I was reading.` ✅ 并排 `When you called, I read a book.` ❌——**BC 成对框架进卡**（同一件事，哪件穿 -ing 才不跑偏）；④ 认读（L34 `:6129` 对白原句）：`I called you but no answer.` ✅——**老对白今天有回话了**（跨批对白闭环）；⑤ 复习卡（L92 target）：`When it is sunny, I run.` ✅（when 的岗第 92 课已立，今天换昨天版）；⑥ 复习卡（L27 `:4840`）：`When is your birthday?` ✅（问「什么时候」vs「当…的时候」同形两张脸） |
| 变体方向 | 肯定 target（cloze 落 **reading**——兜底句，让主考点不落空）/ 否定 `When you called, I was not reading.`（noteZh：你打电话时我没在看书）/ 疑问 `Were you reading when I called?`（noteZh：我打电话时你在看书吗） |
| 复现题设计 | guided 复现 L34 对白原句 `I called you but no answer.`；practice 第 1 题 target＋变体逐字题；**第 2 题保障句 `When you called, I was reading.` 的换钟点版 `When you called, I was sleeping.`（cloze 落 sleeping——主考点兜底）**；第 3 题复现 L92 原句 `When it is sunny, I run.` |
| 案件规划 | 新案 `hunt-call-reading`「电话与书」（#106，§6）；错型 tense×2（新）＋旧错 verb_form／tense |
| 六段要点 | 开场引 L34 `:6129`「她打了电话没人接——今天把话说回去」；比喻＝「when 领的那截是插进来的小事，另一截是当时正做着的（穿 -ing）」；deepDive：when＋was -ing 三连＋丢版本／没换昨天版各一错；arrange ≤6 token |

**L98 一边…一边…（while：两件同时进行）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-98-while`；episode「小美的一天 九十八」；scene `mansion`；cover `cover22`（单次池张） |
| title / grammarLabel | 「一边…一边…」/「两件同时 · while + 都在穿 -ing」 |
| targetSentence | `While I was reading, he was sleeping.`（7 token，≤8 词；cloze 落 **was**——正中/兜底按实跑登记） |
| 场景 | 故事第四句：那会儿我在看书，弟弟在睡觉——两件同时进行 |
| 新知识点 | **只有一件**：`while` 说「两件同时进行」，两边各自穿 -ing——**while 全库 0＝干净引入**（首次出现，配 ❌during 对比卡） |
| 对比卡方向（6 条） | ① `While I was reading, he slept.` ❌（同时的那件没穿 -ing）→ `While I was reading, he was sleeping.`（**wrongMark `slept`**，verb_form）；② `While I read, he was sleeping.` ❌（前半丢了「正做着」）→ `While I was reading, he was sleeping.`（**wrongMark `read`**，verb_form）；③ 对照卡（during 站不住）：`During I was reading, he was sleeping.` ❌ → `While I was reading, …` ✅——**Cambridge 明文 ❌during I study**，本课只作对比卡、**不单开 during 课**；④ 双正解（两句都对，语序换一换）：`While I was reading, he was sleeping.` ✅ 并排 `I was reading while he was sleeping.` ✅——两件同时在，谁在前都行（中文侧三句同义改写组形态）；⑤ 复习卡（L97 target）：`When you called, I was reading.` ✅（when 是插进来的小事、while 是两件同时在）；⑥ 复习卡（L34 例）：`They were playing football.` ✅（一伙人当时正做着） |
| 变体方向 | 肯定 target（cloze 落 was——正中）/ 否定 `While I was reading, he was not sleeping.`（noteZh：我看书那会儿他没在睡）/ 疑问 `Was he sleeping while you were reading?`（noteZh：你看书时他在睡吗） |
| 复现题设计 | guided 复现 L97 原句 `When you called, I was reading.`；practice 第 1 题 target＋变体逐字题；**第 2 题保障句 `While I was reading, he was sleeping.` 的换事版 `While I was cooking, she was reading.`（cloze 落 cooking／reading——主考点兜底）**；第 3 题复现 L34 原句 `They were playing football.` |
| 案件规划 | 新案 `hunt-two-screens`「两台屏幕」（#107，§6）；错型 verb_form×2（新）＋旧错 run_on／plural |
| 六段要点 | 开场召回 L97（when 插进来的小事）＋L34；比喻＝「两件同时在，两边都穿着 -ing 外套」；deepDive：while 三连＋同时误用昨天版／前半丢 -ing 各一错；arrange ≤7 token；**中段自走查点（观察完成率与「两件同时在」是否被接住）** |

**L99 电话响时我正在看书（哪件用哪个版本）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-99-when-rang`；episode「小美的一天 九十九」；scene `mansion`；cover `cover27`（单次池张） |
| title / grammarLabel | 「电话响的时候」/「哪件用哪个版本 · 进行 vs 昨天版」 |
| targetSentence | `I was reading when the phone rang.`（7 token；cloze 落实词（生产时实跑复核，兜底落 rang 前词） |
| 场景 | 故事第五句：电话响的那一下，我正在看书——响是一下子的事 |
| 新知识点 | **只有一件**：哪件用哪个版本——**当时正做着的**穿 -ing、**插进来的那一下**用昨天版（`rang`）；**BC 成对框架**（Jane 两版：「When the guests arrived, Jane was cooking dinner.」／「…Jane cooked dinner.」） |
| 对比卡方向（6 条） | ① `The phone was ringing while I was sleeping.` ❌（响是一下子的事，不该穿 -ing）→ `The phone rang while I was sleeping.`（**wrongMark `ringing`**，verb_form）；② `I was reading when the phone ring.` ❌（响那一下没换昨天版）→ `I was reading when the phone rang.`（**wrongMark `ring`**，verb_form）；③ 对照卡（成对两版，BC 框架）：`I was reading when the phone rang.` ✅——**主事件用昨天版**（话术：响是一下子，看是一阵子）；④ 认读（L34 practice `:6270`）：「讲故事，你想说：当时正下着雨」→ `It was raining.` ✅——同一本书的第一句话；⑤ 复习卡（L98 target）：`While I was reading, he was sleeping.` ✅（两件同时在 vs 一件打断）；⑥ 复习卡（L10 `:1707`）：`Yesterday I went to the park.` ✅（昨天版：一次发生的事） |
| 变体方向 | 肯定 target（cloze 落实词，按实跑登记）/ 否定 `I was not reading when the phone rang.`（noteZh：电话响时我没在看书）/ 疑问 `What were you doing when the phone rang?`（noteZh：电话响的时候你在干嘛——Were 搬前面） |
| 复现题设计 | guided 复现 L98 原句 `While I was reading, he was sleeping.`；practice 第 1 题 target＋变体逐字题；**第 2 题保障句 `The phone rang while I was sleeping.`（cloze 落 rang／sleeping——按实跑登记，若 rang 不在词表则落实词兜底）**；第 3 题复现 L34 原句 `I was drawing at three.` |
| 案件规划 | 新案 `hunt-phone-rang`「电话响了」（#108，§6）；错型 verb_form（新）＋tense（新）＋旧错 tense／plural |
| 六段要点 | 开场召回 L98（两件同时在）＋L97（插进来的小事）；比喻＝「响是一下子（昨天版），看是一阵子（穿 -ing）」；deepDive：哪件用哪个版本三连＋响穿 -ing／响没换版本各一错；arrange ≤7 token |

**L100 从前常这样（在讲故事里用 used to）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-100-used-to-story`；episode「小美的一天 一百」；scene `campus`；cover `cover37`（单次池张） |
| title / grammarLabel | 「从前常这样」/「讲故事 · used to 回讲」 |
| targetSentence | `I used to play here.`（5 token；cloze 落 play——主考点 used 落空，保障句落 used） |
| 场景 | 故事往回一翻：从前我常在这儿玩（站在学校老操场边说） |
| 新知识点 | **只有一件**：**在讲故事里**用 used to——那时常常做、现在不了（对位 BC「used to is often used in stories」）；L93 `:17208` 教的是这一套说法本身，本课讲的是**它在故事里的位置**（一直在做 vs 从前常常） |
| 对比卡方向（6 条） | ① `I use to play here.` ❌（尾巴上少了 d）→ `I used to play here.`（**wrongMark `use`**，verb_form）；② `I used to playing here.` ❌（后面穿了 -ing 外套）→ `I used to play here.`（**wrongMark `playing`**，verb_form）；③ 双正解（各管一摊）：`I was reading at eight.` ✅ 并排 `I used to play here.` ✅——说那一晚正做着 vs 说从前常常（两个「过去」不打架）；④ 对照卡（四路说过去）：`Yesterday I went to the park.`（L10 `:1707`）✅／`I was reading at eight.`（本批 L95）✅／`I used to play here.` ✅——一次去了、那会儿正做着、从前常常；⑤ 复习卡（L93 `:17300` 变体）：`I didn't use to play here.` ✅（「从前不常」也这么说——d 不丢）；⑥ 复习卡（L28 `:5014`）：`I always arrive early.` ✅（现在常做 vs 从前常做） |
| 变体方向 | 肯定 target（cloze 落 play——主考点落空）/ 否定 `I didn't use to play here.`（noteZh：从前我不常在这儿玩）/ 疑问 `Did you use to play here?`（noteZh：你从前常在这儿玩吗） |
| 复现题设计 | guided 复现 L93 原句 `I used to play here.`；practice 第 1 题 target＋变体逐字题；**第 2 题保障句 `I used to read at night.`（cloze 落 **used**——正中考点，让本课主考点不落空）**；第 3 题复现 L10 原句 `Yesterday I went to the park.` |
| 案件规划 | 新案 `hunt-old-habit`「老习惯」（#109，§6）；错型 verb_form×2（新）＋旧错 tense／plural |
| 六段要点 | 开场召回 L93（从前常这样、现在不这样了）；比喻＝「讲故事往回一翻：那时常常做、现在不了」；deepDive：used to 三连＋漏 d／穿 -ing 各一错；arrange ≤5 token |

**L101 讲故事（跨课混排 · 一句一句串起来）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-101-tell-story`；episode「小美的一天 一百零一」；scene `sparkle`；cover `cover38`（单次池张） |
| title / grammarLabel | 「讲故事」/「一句接一句 · 混排（then 认读）」 |
| targetSentence | `I was reading. It was raining. When you called, I was reading.`（逐句 ≤8 词；cloze 按实跑登记） |
| 场景 | 把前六课各 1 句串成一个完整的小故事（昨晚八点那个电话），中间用 then 接上去 |
| 新知识点 | **无新增语法点**——跨课混排（L78 `:14362`／L94 `:17400` 收口先例同构）；**then 只作认读**（一句带过，不单开课、不进口令块） |
| 对比卡方向（6 条） | ① `I was read at eight.` ❌（漏 -ing）→ `I was reading at eight.`（**wrongMark `read`**，verb_form——L95 回流）；② `When you called, I read a book.` ❌（当时正做着丢了版本）→ `When you called, I was reading.`（**wrongMark `read`**，tense——L97 回流）；③ 双正解（两种接法都对）：`I was reading. Then you called.` ✅ 并排 `When you called, I was reading.` ✅——分开说、合起来说都行；④ 对照卡（四句一条线）：`I was reading at eight.` ✅／`It was raining.` ✅／`When you called, I was reading.` ✅／`I used to play here.` ✅——本批四句老熟人排一排；⑤ 复习卡（L98 target）：`While I was reading, he was sleeping.` ✅；⑥ 复习卡（L10 `:1707`）：`Yesterday I went to the park.` ✅ |
| 变体方向 | 肯定 target（按实跑登记）/ 否定 `I was not reading at eight.`（noteZh：八点我没在看书）/ 疑问 `What were you doing when I called?`（noteZh：我打电话时你在干嘛——问句 Were 搬前面） |
| 复现题设计 | guided 复现 L100 原句 `I used to play here.`；practice 第 1 题 target＋变体逐字题；**第 2 题保障句 `It was raining at eight.`（cloze 落 raining——让主考点落到实词）**；第 3 题复现 L34 原句 `I was drawing at three.`；第 4 题复现 L97 原句 `When you called, I was reading.` |
| 案件规划 | 新案 `hunt-story-parts`「故事零件」（#110，§6）；错型以本批回流为主（tense／run_on／verb_form） |
| 六段要点 | 开场跨 6 课倒带（L95→L100 各回一句）；比喻＝「一句接一句，一句话一件事」；deepDive：六句排一排＋漏 -ing／丢版本各一错；arrange 逐句 ≤8 词 |

**L102 昨天那个电话（章末收口 · 零新知）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-102-phone-story`；episode「小美的一天 一百零二」；scene `mansion`；cover `cover40`（单次池张） |
| title / grammarLabel | 「昨天那个电话」/「收口 · 大团圆（零新知）」 |
| targetSentence | `I was reading at eight. It was raining. When you called, I was reading.`（复现混排，逐句 ≤8 词） |
| 场景 | 电话故事收口：从「昨晚八点」到「从前的操场」，把这条电话线一次说完 |
| 新知识点 | **无——章末零新知**（收口 10 先例同构，接口零字段新增）；复现取材：L95–L100 各 1 句＋电话链（开场→背景→打断→同时→响→从前） |
| 对比卡方向（6 条） | ① `It was rain.` ❌（漏 -ing）→ `It was raining.`（**wrongMark `rain`**，verb_form——L96 回流，锚 #105）；② `While I was reading, he slept.` ❌（同时的那件没穿 -ing）→ `While I was reading, he was sleeping.`（**wrongMark `slept`**，verb_form——L98 回流，锚 #107）；③ `I use to play here.` ❌（漏 d）→ `I used to play here.`（**wrongMark `use`**，verb_form——L100 回流，锚 #109）；④ 双正解（两版分工）：`I was reading when the phone rang.` ✅——响是一下子、看是一阵子；⑤ 复习卡（L95/L96）：`I was reading at eight.` ✅／`It was raining.` ✅；⑥ 复习卡（L97/L99）：`When you called, I was reading.` ✅／`I was reading when the phone rang.` ✅ |
| 变体方向 | 肯定 target（收口课无主考点，落哪都算合格，按生效词表实跑登记）/ 否定 `It was not raining.`（noteZh：那时没下雨）/ 疑问 `Were you reading when I called?`（noteZh：我打电话时你在看书吗） |
| 复现题设计 | guided 复现 L99 原句 `I was reading when the phone rang.`；practice 第 1 题 target＋变体逐字题；第 2 题复现 L97 原句 `When you called, I was reading.`；第 3 题复现 L98 原句 `While I was reading, he was sleeping.`；第 4 题＝章末收官惯例，复现 L100 原句 `I used to play here.` |
| 案件规划 | 新案 `hunt-phone-story`「电话故事」（#111，§6）；**不引番外 5 案**；**不引 during／as 连词／didn't use to 新讲**（留后） |
| 六段要点 | 开场跨 8 课倒带（L95 那时正在做→L100 从前常这样）；比喻＝「一句话一件事，接起来就是一整段」；deepDive：六课各回一句＋电话链六段各一句；arrange ≤8 词/句 |

## §3 中文负迁移处理专章

| 课 | 干扰 | 典型错 | 话术方向 | 归入 |
|---|---|---|---|---|
| L95 | 中文「我在看书」不分现在/过去，漏穿 -ing | \*I was read／\*I read at eight | 「昨天版的『正在』：be 换昨天版，外套照穿」；「丢进行＝听不出是那会儿正做着」 | 对比卡 ①②（verb_form／tense 可进案件） |
| L96 | 天气句直接搬昨天，动词不换 | \*It was rain／\*It rains yesterday | 「说哪天用哪版：今天版今天说、昨天版说那天」；「天气也是一件事——正下着就穿 -ing」 | 对比卡 ①②（verb_form／tense） |
| L97 | 「打电话的时候我在看书」两截都不换版本 | \*When you called, I read a book | 「when 领的那截是插进来的小事，另一截是当时正做着的（穿 -ing）」 | 对比卡 ①②（tense） |
| L98 | 「一边…一边…」前半丢「正做着」、同时误用昨天版 | \*While I was reading, my brother watched TV | 「两件同时在，两边都穿 -ing 外套」；「『同时』用 while，两件都不落下」 | 对比卡 ①②（verb_form） |
| L99 | 两件都当「正做着」，响那一下也穿 -ing | \*The phone was ringing while I was sleeping | 「响是一下子（昨天版），看是一阵子（穿 -ing）」 | 对比卡 ①②（verb_form／tense） |
| L100 | 汉「从前常」与「昨天去」不分、漏 d | \*I use to play／\*I used to playing | 「used 后面跟原形——原形不穿外套」；「一次去了 vs 从前常常，两条路」 | 对比卡 ①②（verb_form） |
| L101 | 混排时版本串台、句子黏连 | \*When you called, I read a book／两句黏成一坨 | 「一句话一件事，说完停一下」；错型只用本批锚点 | 对比卡 ①②（tense／run_on） |
| L102 | 同 L101（收口不新增干扰） | —（不新增干扰） | 错型只用本批旧课锚点，不引入未教材料 | §6 案件表纪律 |

## §4 叙事设计专章

### 4.1 叙事草案（逐字采用）

> **「昨天那个电话——昨晚八点，我在看书；外面正下着雨；你打电话的时候，我正在看书；那会儿弟弟在睡觉；电话响的那一下，我正看着书；再往前，我从前常在这儿玩。」**
> 电话来了：I was reading at eight.（第 95 课）→ It was raining.（第 96 课）→ When you called, I was reading.（第 97 课，**回答第 34 课那句「I called you but no answer.」**）→ While I was reading, he was sleeping.（第 98 课）→ I was reading when the phone rang.（第 99 课）→ I used to play here.（第 100 课，往回一翻）。
> 收住：I was reading at eight. It was raining. When you called, I was reading.（第 101 课串起来讲 → 第 102 课电话故事收口）。

### 4.2 复用体系（不造新比喻）

- 「昨天版」（L10 `:1699` 老规矩——L95/L96/L97/L99 说「be 换昨天版、动作换昨天版」）
- 「穿 -ing 外套」（L6 `:1019-1023` 老话术——L95–L99 五课同一句话：当时正做着的穿外套）
- 「一套说法两个版本」（L87–L89 今天版 vs L96 昨天版天气句）
- 「when 领一个小句子」（L92 立岗——L97 只换版本）
- 「两个都在进行」（L34 `:6103-6281` 平台——L98 while 是它的第一次「同时」用法）
- 「一次 vs 常常」（L93 `:17280` used to——L100 在故事里用）
- 「收口传统」（10 先例 `:7395`…`:17400`——L101 跨课混排＋L102 零新知）
- 「跨批对白闭环」（L34 `:6129` 对白——L97 回话，**首次**把旧课对白当接口）

### 4.3 禁用词表（本批生产禁出现）

时态、过去进行（时）、进行式、现在进行、一般过去（时）、从句、主句、连词、从属连词、背景句、主事件、形容词、名词、词性、主语、谓语、逗号（术语形态）、语序、助动词——全禁；用「那时正做着／昨天版／今天版／那会儿／一下子／一阵子／两件同时在／外套／原形／接起来说」替代。

## §5 验收标准

### 5.1 检查清单

- [ ] G1 practice ≥4 且含变体逐字题（L95 `Were you reading at eight?` / L96 `Was it raining?` / L97 `Were you reading when I called?` / L98 `Was he sleeping while you were reading?` / L99 `What were you doing when the phone rang?` / L100 `Did you use to play here?` / L101 `What were you doing when I called?` / L102 `Were you reading when I called?`）
- [ ] G2 tokens/answer 词集一致、distractors 不重复
- [ ] G3 recall 三字段非空
- [ ] G4 arrange/practice 展示序≠答案序
- [ ] G5 罪名枚举：8 案 tag 全落 10 枚举（不碰 comparison；preposition 每案至多 1 条——本批仅 #106 一条）；每案 4 错、单 token 可修、≥1 净词
- [ ] G6 案件结构：tokenIndex 与 tokens 对齐、errors=4（新错 2＋旧错 2）、reviewed=true；L102 案（#111）以本批锚全回流、不新增错型
- [ ] G7 tagStats=10 不动（`huntService.test.ts:109`）
- [ ] **G8 展示层硬需求**：season-15（min 95, max 102）＋m17（afterLesson 102）随批上线——`grammarSeasons.ts` 在 season-14（`:46`）后追加 `{ id: "season-15", label: "第十五季 · 讲故事", hint: "那时正在做、当时正下着雨、电话响的时候——一句话一件事，接起来就是一整段", min: 95, max: 102 }`；`GrammarPathPage.tsx` CAN_DO_MILESTONES 在 m16（`:225`）后追加 m17（「我能把一件事从头讲一遍」，样本句 `I was reading at eight.` / `When you called, I was reading.`）
- [ ] **G8-b 守门测试**：`grammarSeasons.test.ts` 四断言全绿——「最高课号 102 落区间」与「区间不重叠」（95 > 94）
- [ ] G9 orphans 纪律：8 个新案（#104–#111）全部被 L95–L102 引用（番外案名单冻结 5 个不动，`huntService.test.ts:215`）
- [ ] G10 episode 写法：L95–L102 全部汉字数字（「小美的一天 九十五」…「一百」…「一百零二」）
- [ ] G11 语料锁闭集：过去进行只做 was/were＋-ing 的昨天版叙述（不扩完成进行）；while 只做「两件同时」（**during／as 只作对比卡，不单开课**）；when 只作「插进来的那一下」；used to 只作「从前常这样」（不做 be/get used to）；then 只作认读；**不引入 have/get sth done、make 使役、be used to**
- [ ] **G12 cloze 逐课核验**（按生产时生效词表实跑）：L95 target 落 **was（正中）** → 保障句落 were；L96 target 落 **was（正中）** → 保障句 `It is raining.` 落 is；**L97 target 落 was＝主考点落空 → 变体句必须落 reading，保障句 `When you called, I was sleeping.` 落 sleeping**；L98 target 落 was → 保障句 `While I was cooking, she was reading.` 落 cooking／reading；**L99 落 rang 不在词表（R-B8 145 条/144 词）→ 落实词兜底（rang 前词）并生产时实跑复核**；**L100 保障句 `I used to read at night.` 落 used（正中）**，target 落 play（主考点落空）；L101/L102 收口课任意落点皆合格——**逐课须核验 variants 至少 1 句让主考点落空**
- [ ] **G-boost（硬护栏·批十四教训）**：**每课 contrast 6 条中至少 2 条为「带 wrongMark 的真实错卡」**（口径：`wrongMark` 非空、非 bothRight、字面词出现在 wrong 句里、可在 wrong 词块定位）；推荐 3 条；**禁止贴线**（`grammarBoostService.test.ts:159-181` 全库逐课断言）；**`wrongMark` 不得为标点**（L89 `What a nice day?` 曾因标点被 `cleanWord` 剥掉定位失败）；`guided.spot` 每课必配
- [ ] G13 时长 6–8 min（8 课逐课走查；L98 7 token、L99 7 token 核对上限）；G14 旧线零回归（L1–94 不动；54 文件 674 测试全绿 + build 通过）

### 5.2 Given/When/Then

- **G-A1** Given 学习者完成 L95 When 看对比卡 `I was read at eight.` ❌ / `I was reading at eight.` ✅ Then 能说出「昨天版的『正在』——be 换昨天版，外套照穿」
- **G-A2** Given 学习者完成 L96 When 看对比卡 `It was rain.` ❌ / `It was raining.` ✅ Then 能说出「说那天的事就要换昨天版，正下着就穿 -ing」，并能回忆第 34 课说过「讲故事背景」
- **G-A3** Given 学习者完成 L97 When 见对白 `I called you but no answer.` Then 能回话 `When you called, I was reading.` 并说出「插进来的小事＋当时正做着」
- **G-A4** Given 学习者完成 L98 When 看对比卡 `While I was reading, he slept.` ❌ / `…he was sleeping.` ✅ Then 能说出「两件同时在，两边都穿 -ing」；且能判断 `During I was reading…` ❌（during 站不住）
- **G-A5** Given 学习者完成 L99 When 看对比卡 `The phone was ringing while I was sleeping.` ❌ / `The phone rang while I was sleeping.` ✅ Then 能说出「响是一下子，看是一阵子」
- **G-A6** Given 学习者在 `hunt-old-habit`（#109）遇到 `use` When 修成 `used` Then 能说出「在故事里说从前常这样」；Given 学习者在 L102 回看 7 课旧句 Then 能各自说出「这是第 N 课学的」

## §6 案件规划（8 案）

**总规则**：每案 4 错＝新错 2＋旧错 2；单 token 可修；每案 ≥1 净词；零术语话术；tag 全落 10 枚举（tagStats 固定 10 项）；reviewed: true；**必须配课**；**不碰 comparison**；**不引番外 5 案**；**preposition 每案至多 1 条**。案件编号接批十四尾案（#103 `hunt-after-school-talk`）为 **#104–#111**。

| 案件 id | 配课 | 场景 | 定稿错误构成（原 → 修正（tag，新/旧）） |
|---|---|---|---|
| `hunt-eight-reading` | L95 | 八点读书 | ① `read` → `reading`（I was read at eight.，verb_form，新错——漏 -ing）② `was` → `were`（They was playing football.，sv_agreement，新错——一伙人用 were）③ `go` → `went`（Yesterday I go…，tense，旧错 L10）④ `friend` → `friends`（…with two friend.，plural，旧错 L11） |
| `hunt-rainy-memory` | L96 | 雨夜回忆 | ① `rain` → `raining`（It was rain at eight.，verb_form，新错）② `is` → `was`（It is raining yesterday.，tense，新错——没换昨天版）③ `cloud` → `clouds`（The cloud was white.，plural，旧错 L11）④ `go` → `went`（Yesterday I go home.，tense，旧错 L10） |
| `hunt-call-reading` | L97 | 电话与书 | ① `read` → `reading`（…I was read.，verb_form，新错）② `call` → `called`（When you call, I was reading.，tense，新错）③ `was` → `were`（We was happy.，sv_agreement，旧错 L19）④ `in` → `on`（…reading in the sofa.，preposition，旧错 L18；**本课唯一一条**） |
| `hunt-two-screens` | L98 | 两台屏幕 | ① `read` → `reading`（While I was read, he was sleeping.，verb_form，新错）② `sleep` → `sleeping`（…he was sleep.，verb_form，新错——同时那件也要穿）③ `reading` → `reading,`（While I was reading he…，run_on，旧错 L92）④ `watch` → `watches`（My brother watch TV.，sv_agreement，旧错 L25） |
| `hunt-phone-rang` | L99 | 电话响了 | ① `read` → `reading`（I was read when the phone rang.，verb_form，新错）② `ringing` → `rang`（The phone was ringing while…，verb_form，新错——响是一下子）③ `was` → `were`（We was happy.，sv_agreement，旧错 L19）④ `cat` → `cats`（She has two cat.，plural，旧错 L11） |
| `hunt-old-habit` | L100 | 老习惯 | ① `use` → `used`（I use to play here.，verb_form，新错——漏 d 头号坑）② `playing` → `play`（She used to playing here.，verb_form，新错——后面跟原形）③ `go` → `went`（Yesterday I go home.，tense，旧错 L10）④ `dog` → `dogs`（We have two dog.，plural，旧错 L11） |
| `hunt-story-parts` | L101 | 故事零件 | ① `is` → `was`（It is raining.，tense，新错——L96 回流，锚 #105）② `call` → `called`（When you call, I was reading.，tense，新错——L97 回流，锚 #106）③ `reading` → `reading,`（While I was reading he…，run_on，旧错——L98 回流，锚 #107）④ `use` → `used`（I use to play here.，verb_form，旧错——L93 回流，锚 #109） |
| `hunt-phone-story` | L102 | 电话故事 | ① `rain` → `raining`（It was rain.，verb_form，旧错——L96 回流，锚 #105）② `reading` → `reading,`（While I was reading he…，run_on，旧错——L98 回流，锚 #107）③ `ring` → `rang`（…when the phone ring.，tense，旧错——L99 回流，锚 #108）④ `use` → `used`（I use to play here.，verb_form，旧错——L100 回流，锚 #109） |

> **案件表纪律**：每案 4 错全部单 token 可修、tokenIndex 与 tokens 对齐（生产时逐 token 核对）；新错话术走 §3 负迁移表；旧错一律取自已教点（L10/L11/L18/L19/L25/L92/L93），禁引入未教材料；同案两条同 tag 有 #102/#107 先例；L101/L102 两案以本批锚复现（#105/#106/#107/#108/#109），不新增错型。

## §7 Non-goals

- **不做** make 使役（维持**批十六 2–3 课小章**——三档全目 68 课零课位，词典页证据足但课程级无位）
- **不做** during／as 连词（留后；本批只在 L98 对比卡里放 ❌during I study 一句）
- **不做** have/get sth done（超纲）；**不做** be/get used to（B1+）；**不做** didn't use to 独立课（L93 已落地，折变体）
- **不做** far better 转正（无增量）；**不做** look like（维持认读）；**不做**机制强化（boost 占位）
- **不做** 附加疑问（isn't it——BC 标 B1-B2，我方 0）
- **不做** 双拱（连续第二批破例风险中高——本批取单拱）
- **案件不碰** comparison；**不加**新枚举、不改 tagStats/schema、不动 L1–94；**不引**番外 5 案
- **不做**封面池外新资产（本批 8 张全部取单次池既有张，语义不符时池内互换）

## §8 开放问题

1. **三处口径校正归档（勿沿用旧记）**：① 过去进行在 Murphy **初级 U13/U14**（书首 12%）＋中级 U6——**非批十四误记的中级 U25**（U25＝when I do/I've done 现在将来口径）、**U115＝unless、U116＝as、U119＝during for while**；② 使役最近邻＝**中级 U46（have sth done）**，**非 U67**（感官动词）；③ Cambridge 使役侧**六页**（批十四只记 `infinitives-without-to`）。本批正文一律用校正后口径。
2. **L97 的 was 落空与 variant 兜底**：target `When you called, I was reading.` 在 R-B8 抽词器（①语法词表 be）下必落 `was`——主考点（when＋哪件穿 -ing）落空。默认：**变体句与保障句强制让 `reading`／`sleeping` 落空**，生产时实跑登记；若仍落 was，则把 target 的兜底句写进 practice 第 2 题（已规格化）。
3. **L98 while 与 L92 when 的对照面**：when（`When it is sunny, I run.`）与 while（两件同时）同岗相邻——是否被混用？默认对比卡 ⑤ 明示「when 是插进来的小事、while 是两件同时在」，L98 走查第 2 题观察。
4. **L99 两版本分工的认知负荷**：`I was reading when the phone rang.` 一句里两个版本——对 A2 段位是否过载？默认对比卡 ③ 给一句话术（「响是一下子、看是一阵子」），L99 关 2 观察。
5. **L100 与 L93 的增量边界**：L93 已教 used to 全套说法（肯定/否定/疑问＋`:17293` d 转移）——**L100 的增量必须写清＝「在讲故事里用」**（对位 BC「used to is often used in stories」），生产时不得复讲 d 转移规则；若走查反馈「像复课」，备选＝把对照卡 ④ 从三路压到两路。
6. **L101/L102 双收口的层次差异**：L101＝跨课混排（then 认读＋四句串讲）、L102＝章末零新知（电话链收口）——两课相邻是否重复？默认 L101 走「一句一件事」讲法、L102 走「一条线讲完」讲法，且 L102 案全用回流锚（#105/#107/#108/#109），不新增错型。
7. **L95 was/were 分工的首次出现**：L34 已讲 was/were 搭档，但本批首次在案件里植 `was`→`were`（#104/#108）——是否与 L34 复现冲突？默认按「一伙人用 were」老话术承载 sv_agreement，走查观察。

## §9 里程碑（大章节：分两段 D1–D5 / D6–D10）

| 阶段 | 产出 | 说明 |
|---|---|---|
| M0 规格冻结 | 本 PRD 评审 | 无 P0 前置项 |
| M1 打样（D1–D2） | L95 全量 + `hunt-eight-reading` + 首玩走查 | 打样门：漏 -ing 卡是否被接住、**G-boost ≥2 带 wrongMark 自查** |
| M2 第一段生产（D2–D5） | L96/L97/L98 + 3 案 | 每段 4 课；L96 兑现 `:6186` 伏笔、L97 对白闭环、**L98 中段自走查点** |
| M3 第二段生产（D6–D8） | L99/L100/L101 + 3 案 | L99 打断动词（cloze 实跑复核 rang）、L100 增量边界、L101 混排 |
| M4 收口与展示层（D8–D9） | L102 + `hunt-phone-story` + season-15/m17 | 跨 8 课唤醒走查；电话故事线收口 |
| M5 验收（D10） | §5 全量 + 路径页走查 | G5/G8/G8-b/G9/G12/G-boost 硬需求 |
| M6 上线观察 | 首过率、verb_form/tense 新错命中、cloze 落点（was/used/rang）、m17 触发 | 挂既有埋点；两段各观察一轮 |

## ✅ 行动清单

| # | 行动 | 负责方 | 时间窗 |
|---|------|--------|--------|
| 1 | L95 + `hunt-eight-reading` + 打样走查（昨天版正在话术、G-boost 自查） | 内容 | D1–D2 |
| 2 | L96/L97/L98 + 3 案（`:6186` 伏笔兑现、L34 对白闭环、while 干净引入＋❌during 卡） | 内容 | D2–D5 |
| 3 | L99/L100/L101 + 3 案（rang 实跑复核、used to 增量边界、混排） | 内容 | D6–D8 |
| 4 | L102 + `hunt-phone-story`（跨 8 课取材＋电话链六段） | 内容 | D8–D9 |
| 5 | season-15 + m17（约 10 行） | 开发 | 随批 |
| 6 | 验收 + 路径页走查（G12 逐课 cloze 实跑、G-boost 全课 ≥2 错卡） | 内容/开发 | D10 |
| 7 | 单次池 8 张封面语义核对 | 内容 | D1（随打样） |
| 8 | M6 观察 | 产品负责人 | 上线后 1–2 周 |

## ⚠️ 待确认 / 假设

- 开放问题 §8 七项（均有默认方案）
- 假设：单次池 8 张（cover13/14/15/22/27/37/38/40）语义可核（数析实算间距 62、未核对图像）；episode「九十五…一百…一百零二」写法（>100 无先例，本批采用「一百／一百零一／一百零二」）；课号 95–102 连续（`lessonService.ts:143` 缺号永久锁死，须人工核对）；674 项测试为批十四基线；`while`／`rang` 是否进 cloze 词表须生产时实跑（当前 `while/rang/use/used` 不在表内）
- 依赖：L95 依赖 L34/L10；L96 依赖 L34（`:6186`）/L6/L87；L97 依赖 L34（`:6129`）/L92/L27；L98 依赖 L97/L34；L99 依赖 L98/L10/L34（`:6270`）；L100 依赖 L93/L10/L28；L101 依赖本批 L95–L100；L102 依赖本批 L95–L101
- Non-goals：见 §7（含 during／as 只作对比卡、make 使役留批十六、have sth done／be used to 超纲、双拱不做）

## 📚 数据来源 & 成员产出索引

- 析客（本 PRD）；瑞思：`user-research-grammar-fifteenth-batch-2026-09-19.md`；竞析：`competitive-analysis-grammar-fifteenth-batch-2026-09-19.md`；数析：`data-audit-grammar-fifteenth-batch-2026-09-19.md`；格式基准：`prd-grammar-small-talk-past-2026-09-19.md`
- 正文事实核对：`grammarLessons.ts`（L6 `:1019-1023`、L9 `:1520-1540`、L10 `:1697-1712`、L19 `:3366`、L27 `:4821`／`:4840`、L28 `:5014`、L34 `:6103-6281`（target `:6114`、对白 `:6129`、deepDive `:6186`、practice `:6270`）、L35 `:6418`、L36 `:6604`、L51 `:9341`、L60 `:11090`、L78 `:14362`、L87 `:16072`、L92 `:17019`、L93 `:17208-17394`、L94 `:17397-17400`）；`huntCases.ts`（103 案、尾案 #103；#43 `hunt-past-rainy-day` `:2690-2750`）；`grammarSeasons.ts:44`／`:46`；`GrammarPathPage.tsx:218`／`:225`；`huntService.test.ts:109`／`:215`；`grammarBoostService.test.ts:159-181`
- 红线核对：**五零真空白**（while 0／during 0／as 连词 0／when＋过去进行 0／进行 vs 过去 0）；was/were＋-ing 回声仅 4 处（L35/L36/L51/L60）；错点 386（verb_form 82·plural 68·preposition 55·sv 49·word_order 40·article 24·missing_be 22·tense 21·**fragment 14·run_on 11**）；cloze R-B8 词表 145 条/144 词；**G-boost 每课 ≥2 带 wrongMark 错卡**（`wrongMark` 不得为标点）；句长 ≤8 词；preposition 每案至多 1 条；番外 5 案硬断言；封面单次池 12 张 → 本批取 8；**三口径校正**（初级 U13/U14、中级 U46、Cambridge 六页）；54 文件 674 测试全绿

---

> 本报告由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。
