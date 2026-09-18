# PRD：第十一批课程 · 频率与提议（4 课：L72–L75）

**日期**：2026-09-18 ｜ **类型**：功能规格书（PRD）｜ **成员**：析客（需求分析）
**上游输入**：批十 PRD §7/§8（缓办与留后清单）；三研究 2026-09-18（瑞思/竞析/数析）；主理人裁决（4 课 L72–L75，开 season-11 + m13）

---

## 📝 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1 | 2026-09-18 | 初稿：4 课（L72–L75）+ 4 案（#81–#84），开 season-11、m13 |

## 📌 TL;DR

1. **批十一＝「频率与提议」4 课（L72–L75）**：多久一次（How often）→ 要花多久（How long does it take）→ 让我来帮你（let me / help）→ 咱们去…吧（Let's）——开 season-11，总课量到 75，宣布 A2 结构收官。
2. **两课接电、两课转正**：How often／How long 接 L27 `:4822`＋L28 `:5006` 两座在库平台（体系内明文留白，参考页级实证）；let me/help 走中文驱动（跨源无位，明标）＋#70 案话术闭环（`huntCases.ts:2953/:2967`）；Let's 由 L56 `:10227`／L65 `:11926` 两处弱曝转正。
3. **三笔欠账兑现**：L28 频率平台「有答无问」补问句；L27「How 管方式」家族扩两岗（How old／how far 各认读一句）；#70「家族不垫板」话术课程正面转正。
4. **cloze 系统性失手预警**：Let me 句落 me、How often 句落 do、How long 落 does、What about 落 about（数析复刻实跑）——G12 逐课核验，每课备保障句（`Let me do it.` 落 do、`Do you often read at night?` 落 do、`Does it take ten minutes?` 落 Does）。
5. **展示层硬需求**：season-11（{72,75}）+ m13（afterLesson 75）+ 4 案全部被 L72–L75 引用——不落则路径页静默过滤、守门测试先红（批十先例）。

## 🎯 核心结论卡片

| 项目 | 内容 |
|------|------|
| 推荐方案 | 4 课 L72–L75：How often 收口 → How long/it takes → let me/help 扩员 → Let's 转正＋How about |
| 优先级 | P1（内容生产批次）；无 P0 阻断项 |
| 预期影响 | 开 season-11；A2 收官；疑问词家族、家族不垫板、提议功能三条线收口 |
| 资源需求 | ≈3 人日（内容 2 + 展示层 0.25 + 走查 0.5 + 验收 0.5） |
| 风险等级 | 中（cloze 对 A 系系统性失手；「让」的话术成本最高〔打样门重点〕；L75 与 L70 答语错配须走查） |
| 硬性范围红线 | 课量 4 不扩不缩；一课一增量；六段式；每课 1 案（4 错=新 2+旧 2、单 token 可修）；对比卡 6 条只收真错；禁用词表执行；make 使役不做（留后）；comparison 不进案件；tagStats=10 不动；L1–71 零改动；封面池外零新资产 |

---

## §1 问题陈述与批次定位

### 1.1 解决什么问题

- **How 家族第二段明文留白**：L27 把疑问词收口成「What 管东西、Where 管地方、When 管时间、How 管方式」（`:4836`），此后 How 只长出 How many/much（L30 `:5415-5424`）——How often／How long 课程/案件/中文侧三口径全 0（数析实读）。
- **「多久一次」有答无问**：L28 教完 always/often/never 位次（`:5006`）却没教问法——答句基座在库（频率副词 96 处、often 26），问句接口空缺；twice 全库仅 1 处（L21 `:3921`）。
- **take 表耗时全库 0**：Murphy U48 独立单元＋BC 参考页 beginner 点名（竞析本轮两处增量证据）——「要花多久」至今说不出，且无同形干扰、干净引入。
- **「让／帮」口语高频但无位**：Let me 0、make me 0（数析）；help 36 处里 32 处是 L61 请求义；中文侧有「使役動詞」专文自认负迁移（学生易写成 to V / V-ing）——结构欠账，按中文需求驱动立项（跨源无位，不宣称共识）。
- **Let's 弱曝未转正**：L56 `:10227`、L65 `:11926` 两处对白里的 Let's 从未教过；提议功能（How about／Good idea）全 0；唯一 What about 是 L45 `:8162`「你呢」义（义漂移须对照防误读）。
- **系统账**：瑞思「A 类收口为批十一主方向」；竞析收窄为「3 课主推＋1 条件」；主理人裁决 4 课全做（L75 条件课转正，核心＝Let's 转正）。

### 1.2 前置已铺完（本批直接衔接）

| 前置 | 行号 | 本批怎么用 |
|---|---|---|
| L27 疑问词收口 + `How are you?` | `:4822/:4836/:4841` | L72/L73 家族扩员（How 再添两岗）；How old 认读同构参照 |
| L28 频率平台 + 疑问变体 `Do you often read at night?` | `:5006/:5072` | L72 答语基座＋复现＋保障句 |
| L30 数量 How many/much | `:5415-5424` | L72/L73 家族邻居（数量问过，今天问频率与时长） |
| L21 twice（全库唯一处） | `:3921` | L72 复现（答语词块起点） |
| L45 `What about you?`（你呢） | `:8162` | L75 同形两义对照卡（旧义读新句的防误读） |
| L47 家族不垫板老规矩 | `:8509` | L74 口令块扩员 |
| L56 / L65 两处 Let's 弱曝 | `:10227/:11926` | L75 转正＋复现（弱曝转正成本最低） |
| L61 `Could you help me?` | `:11148` | L74 接力（请求义已有，今天教出手义） |
| 案件 #70「家族不垫板」话术 | `huntCases.ts:2953/:2967` | L74 对比卡话术转正（cannot help——跟 must/should 家族一个规矩） |
| L70 应答链（Yes, please／No, thanks） | `:12847` | L75 应答错配登记（Good idea 新造，与 L70 错配对走查） |

### 1.3 批次定位：为什么是「频率与提议」

竞析本轮把候选池劈叉为四档：跨源点名 A1-A2＝How long（最硬）＋How often（较强）；中文驱动型＝使役 help/let（跨源课程级无位，但中文双专文＋负迁移自认）；单源＝What about/How about；偏后＝look like（BC B1-B2＋词表双弱，留批十二）。瑞思判「A2 段未清零……收官体量递减但未归零」——批十一正是「收官包」：前两课用在库平台接电（L27/L28），第三课把半教在册的家族话术转正（L61/#70），第四课把两处弱曝的 Let's 扶正并轻量带出提议功能。命名「频率与提议」：前两课问事情（多久一次、要花多久），后两课说人（我来帮你、咱们走吧）——四个场景（操场跑步计划 → 路口通勤时间 → 搬家搭手 → 公园约定）串成「约与答」一条线。做完本批宣布 **A2 结构收官**（余项均跨源无位或超纲）。

## §2 拆课方案与逐课规格

### 2.1 课量决策：4 课（L72–L75）

| 方案 | 取舍 | 裁决 |
|---|---|---|
| 3 课 | 砍 L75（Let's 提议）留批十二——但 L75 是四课里闭环成本最低者（两处弱曝在库、应答链零起步无旧干扰），砍掉浪费现成闭环 | ✗ |
| **4 课** | How often → How long/take → let me/help → Let's/How about；各课一增量；L75 条件课转正（核心＝Let's 转正） | **✓ 拍板（主理人）** |
| 5 课 | 加 make 使役或 look like——make 三词超载降载留后；look like 证据与词表双弱（BC B1-B2） | ✗ |

课表：L72 `lesson-72-how-often`｜L73 `lesson-73-how-long`｜L74 `lesson-74-help-let`｜L75 `lesson-75-lets`

### 2.2 逐课规格

**L72 多久一次（How often + 答语词块）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-72-how-often`；episode「小美的一天 七十二」；scene `campus`；cover `cover43`（单次池——原课「游泳真好玩」运动场景最近：生产时语义核对） |
| title / grammarLabel | 「多久一次」/「多久一次 · How often + 答语词块」 |
| targetSentence | `How often do you run?`（5 token） |
| 场景 | 操场边，小美指着你的跑步计划表，问你多久跑一次 |
| 新知识点 | **只有一件**：问「多久一次」用 How often——第 27 课「How 管方式」的又一岗；答语是词块：twice a week / once a month / three times a week（第 28 课频率阶梯收尾——答句基座在库，今天补问句） |
| 对比卡方向（6 条） | ① `How often you run?` ❌（缺 `do`）→ `How often do you run?`——问动作要请帮手 do（第 27 课老规矩：疑问词后面，动作用 do）；② `I run one week two times.` ❌（`one week two times`）→ `I run twice a week.`——「一星期两次」时间放后面：twice a week；「两次」有专门说法 twice（中文语序直译是最大的坑）；③ 双正解（问答链）：`How often do you run?` ✅ 并排 `Twice a week.` ✅（问多久一次＋答「一周两次」——成对出场）；④ 双正解（认读带出）：`How old are you?` ✅ 并排 `How are you?` ✅（How 家族两兄弟——「多大了」和「你好吗」同一条路：How 站句首）；⑤ 复习卡（L28）：`I always arrive early.` ✅（频率副词站位老规矩——今天学会问）；⑥ 复习卡（L21）：`I have seen that film twice!` ✅（twice 在库唯一老句——今天有了搭档 a week） |
| 变体方向 | 肯定 `I run twice a week.`（cloze：主句落 do＝表内命中、主考点 often 落空；保障句 `Do you often read at night?` 落 do ✅，见 G12）/ 否定 `I don't run every day.`（noteZh：不是每天跑——don't 帮忙，说清节奏）/ 疑问 `How often do you run?`（主句；另备 `How often does she go swimming?` 空 does） |
| 复现题设计 | guided 复现 L28 原句 `I always arrive early.`（频率阶梯起点）；practice 第 1 题 `How often do you run?` + 变体逐字题 `I don't run every day.`；第 3 题复现 L21 原句 `I have seen that film twice!`；第 2 题 `I run twice a week.`（答语词块） |
| 案件规划 | 新案 `hunt-run-plan`「跑步计划表」（§6） |
| 六段要点 | 开场召回 L27 疑问词＋L28 频率阶梯（答句在库、问句今天补）；比喻＝「How 家族又一岗」（How often 问节奏）；deepDive：答语词块三档（once／twice／three times a week）＋How old 认读一句；arrange ≤7 token |

**L73 要花多久（How long does it take? + It takes…）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-73-how-long`；episode「小美的一天 七十三」；scene `city`；cover `cover9`（单次池——原课「放学去图书馆」路上场景最近：生产时语义核对） |
| title / grammarLabel | 「要花多久」/「要花多久 · How long does it take? + It takes…」 |
| targetSentence | `How long does it take?`（5 token） |
| 场景 | 早高峰的路口，小美见你盯着站牌，问你到学校要花多久 |
| 新知识点 | **只有一件**：问「要花多久」用 How long does it take——答语 It takes ten minutes（take 表「花时间」）；接第 27 课 how 家族（How 再添一岗：量一条时间条） |
| 对比卡方向（6 条） | ① `How long it takes?` ❌（缺 `does`）→ `How long does it take?`——问动作要请帮手 does（第 72 课刚立的老规矩）；② `It is ten minutes.` ❌（`is`）→ `It takes ten minutes.`——「花时间」用 takes 不用 is（中文「是十分钟」的惯性；take 表耗时全库首次转正）；③ 双正解（问答链）：`How long does it take?` ✅ 并排 `It takes ten minutes.` ✅（问时长＋答「要十分钟」——成对出场）；④ 双正解（认读带出）：`How far is the school?` ✅ 并排 `How long does it take?` ✅（「多远」问距离、「多久」问时间——How 家族两兄弟；how far 只做认读）；⑤ 复习卡（L27）：`How does he go to school?` ✅（How 管方式老句——今天 How 又添两问）；⑥ 复习卡（L30）：`How many books do you have?` ✅（How 家族排排站——数量问完，今天问时长与距离） |
| 变体方向 | 肯定 `It takes ten minutes.`（cloze：takes 不在 24 词表〔实读复核〕，落 fallback 第 2 词 takes；主句落 does＝表内命中、主考点 long 落空——保障句 `Does it take ten minutes?` 落 Does，见 G12）/ 否定 `It doesn't take long.`（noteZh：花不了多久——doesn't＋原形 take）/ 疑问 `How long does it take?`（主句；备 `Does it take ten minutes?`） |
| 复现题设计 | guided 复现 L27 原句 `What are you looking for?`（疑问词家族起点）；practice 第 1 题 `How long does it take?` + 变体逐字题 `It doesn't take long.`；第 3 题复现 L30 原句 `How many books do you have?`；第 2 题 `It takes ten minutes.`（答语） |
| 案件规划 | 新案 `hunt-trip-time`「出行时间条」（§6） |
| 六段要点 | 开场 L27「How 管方式」＋L72 家族扩员；比喻＝「How long 量时间条」（长条时间量一量）；deepDive：take 表耗时（东西花时间——「它花十分钟」）＋how far 认读一句；arrange ≤7 token |

**L74 让我来帮你（let me / help + 动作穿原样）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-74-help-let`；episode「小美的一天 七十四」；scene `mansion`；cover `cover19`（单次池——原课「又忙又开心」忙里搭手语义最近：生产时语义核对） |
| title / grammarLabel | 「让我来帮你」/「让我来 · Let me / help + 动作穿原样」 |
| targetSentence | `Let me help you.`（4 token：Let / me / help / you.） |
| 场景 | 周末搬家，小美看你抱着纸箱腾不出手，开口说让我来帮你 |
| 新知识点 | **只有一件**：「让我来」用 Let me + 动作穿原样（Let me help）；「帮你做」help 后面也是动作穿原样（help you carry）；两个口令块后面直接接动作、不垫板——第 47/61 课家族老规矩扩员（第 61 课是会请你帮，今天换成自己出手） |
| 对比卡方向（6 条） | ① `Let me to help you.` ❌（去掉 `to`）→ `Let me help you.`——口令块后面直接接动作，不垫板（第 47 课家族老规矩；去掉 to 型实测 10 处先例、9×verb_form）；② `Let me helps you.` ❌（`helps`）→ help——动词穿原样：跟 must/should/can 家族一个规矩（案件 #70 话术 `:2967` 今天正面学）；③ 双正解（一来一往）：`Could you help me?` ✅ 并排 `Let me help you.` ✅（你会请人帮你、今天你也能开口帮人——第 61 课请求义有了来处）；④ 双正解（两可）：`He helped me carry the box.` ✅ 并排 `He helped me to carry the box.` ✅（help 后面垫不垫 to 两可——别的口令块一个都不垫，这里最宽松；主句用最省事的）；⑤ 复习卡（L61）：`Could you help me?` ✅（请求义老句复现）；⑥ 复习卡（L47）：`You should sleep early.` ✅（家族不垫板——动词穿原样老规矩） |
| 变体方向 | 肯定 `Let me help you.`（cloze 落 me＝系统性失手；保障句 `Let me do it.` 落 do＝表内命中，见 G12）/ 否定 `She doesn't let me help.`（noteZh：不让——doesn't 帮忙，let 照样穿原样）/ 疑问 `Can I help you?`（noteZh：我能帮上忙吗——出手也常这么问；第 14 课 can 老熟人） |
| 复现题设计 | guided 复现 L61 原句 `Could you help me?`（请求义接力）；practice 第 1 题 `Let me help you.` + 变体逐字题 `Can I help you?`；第 2 题 `Let me do it.`（cloze 落 do＝保障句）；第 3 题复现 L47 原句 `You should sleep early.` |
| 案件规划 | 新案 `hunt-moving-help`「搬家帮手条」（§6） |
| 六段要点 | 开场 #70 案话术＋L61（请求义半教在册，今天出手义转正）；比喻＝「两个口令块」（let me＝我出手、help＝搭把手——后面直接接动作，动词穿原样）；deepDive：「让」的讲法＝本批最大话术成本（打样门重点核）；make 使役不做（留后）；arrange ≤7 token |

**L75 咱们去…吧（Let's + How about）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-75-lets`；episode「小美的一天 七十五」；scene `forest`；cover `cover29`（单次池——原课「我打算去看电影」出门计划语义最近：生产时语义核对） |
| title / grammarLabel | 「咱们去…吧」/「提议 · Let's + 动作穿原样」 |
| targetSentence | `Let's go to the park.`（6 token：Let's / go / to / the / park.） |
| 场景 | 周六早上，小美扒着窗帘看天气，回头提议一起去公园 |
| 新知识点 | **只有一件**：提议「咱们去…吧」用 Let's + 动作穿原样（Let's go）；Let's 是对白里出现过两回的老熟人（第 56 课 `:10227`、第 65 课 `:11926`），今天正式转正——提议第二种说法 How about 轻量带出（How about going——名字版） |
| 对比卡方向（6 条） | ① `Let's to go to the park.` ❌（去掉 `to`）→ `Let's go to the park.`——口令块后面直接接动作，不垫板（第 74 课同规矩；去掉 to 型先例 10 处）；② `Let's going to the park.` ❌（`going`）→ go——动词穿原样，不换 -ing 装（跟 must/should 家族一个规矩）；③ 双正解（两说法）：`Let's go to the park.` ✅ 并排 `How about going to the park?` ✅（Let's 直接提议、How about 把选项放桌上问——第二种说法今天送）；④ 对照卡（同形两义）：`What about you?` ✅ 并排 `How about a cup of tea?` ✅（老位上的 What about 是「你呢」〔第 45 课 `:8162`〕；How about 才是「怎么样」——一个词两岗，看后头跟着谁）；⑤ 复习卡（L56）：`Let's circle it on the calendar.` ✅（对白里的 Let's 转正——老句子今天扶正）；⑥ 双正解（问答链）：`Let's go to the park.` ✅ 并排 `Good idea!` ✅（提议＋接话成对出场——Good idea 全库新造） |
| 变体方向 | 肯定 `Let's go to the park.`（cloze 落 go＝幸运落点〔表内谓语词、主考点 Let's 前移不空〕；保障句 `Let's do it.` 落 do ✅，见 G12）/ 否定 `Let's not go now.`（noteZh：咱们别现在去——not 跟在 Let's 后面）；提议 `How about going to the park?`（noteZh：提议第二种说法——后面穿名字版 going） |
| 复现题设计 | guided 复现 L29 原句 `I am going to watch a movie.`（从「我打算」到「咱们去吧」）；practice 第 1 题 `Let's go to the park.` + 变体逐字题 `How about going to the park?`；第 2 题 `Let's do it.`（保障句）；第 3 题 `Let's check our height!`（L65 `:11926` 弱曝句复现转正） |
| 案件规划 | 新案 `hunt-park-plan`「公园计划」（§6） |
| 六段要点 | 开场 L56/L65 两处对白召回（老熟人今天转正）；比喻＝「口令块 Let's：咱们一起」＋「How about 把选项放桌上」；deepDive：应答链 Good idea（新造）＋ What about 同形两义（第 45 课老句对照）；arrange ≤6 token |

## §3 中文负迁移处理专章

| 干扰 | 典型错 | 话术方向 | 归入 |
|---|---|---|---|
| 中文问句不倒装、无帮手 | \*How often you read?／\*How long you stay? | 「疑问词站句首，动作用 do/does 帮忙——第 27 课老规矩」 | 对比卡 L72 第 1 条／L73 第 1 条 |
| 「一星期两次」顺中文语序直译 | \*I read two times one week.／\*two times one week | 「次数在前、时间在后：twice a week；『两次』有专门说法 twice」 | 对比卡 L72 第 2 条 |
| 「是两小时」直译用 is | \*It is two hours. | 「花时间用 takes 不用 is——『它花两小时』」 | 对比卡 L73 第 2 条 |
| 时长与方式语序 | \*It takes two hours by bus. | 隔离：交通方式不在本批语料（Non-goals），仅登记不入案件 | Non-goals 隔离 |
| 「让/帮」后接「去/来」催垫板 | \*Let me to help you.／\*Let's to go. | 「口令块后面直接接动作，不垫板——家族老规矩」 | 对比卡 L74 第 1 条／L75 第 1 条 |
| 三单 -s／-ing 惯性 | \*Let me helps you.／\*Let's going.／\*Help me opening. | 「动词穿原样：跟 must/should/can 家族一个规矩」（#70 话术） | 对比卡 L74 第 2 条／L75 第 2 条 |
| 提议句名字版缺失 | \*How about go swimming? | 「How about 后面穿名字版：going——光板进不了门」 | 对比卡 L75 第 3 条（#78 open→opening 同族） |
| 老位 What about 义漂移 | 旧义「你呢」读新句 | 「同形两义：What about＝你呢、How about＝怎么样——看后头跟着谁」 | 对比卡 L75 第 4 条（走查项） |
| 应答链错配（与 L70） | \*Yes, please.（答提议时） | 设计规避：L75 只给 Good idea，不提供与 L70 同形的应答 | §8-2（走查登记，不做卡） |

## §4 叙事设计专章

### 4.1 叙事草案（逐字采用）

> **「频率与提议」——把日子问清楚，把话说在一起。**
> 问节奏：always/often/never（第 28 课答句基座，`Do you often read at night?`）→ How often do you run? ＋ Twice a week.（今天会问也会答）。
> 问时长：How 管方式（第 27 课）→ How long does it take? ＋ It takes ten minutes.（How 家族再添一岗）。
> 出手帮：Could you help me?（第 61 课请你帮）→ Let me help you.（今天轮到你出手——口令块后面直接接动作）。
> 一起走：Let's circle it on the calendar.（第 56 课对白）、Let's check our height!（第 65 课）→ Let's go to the park.（老熟人转正）＋ How about going…?（提议第二种说法）。

### 4.2 复用体系（不造新比喻）

- 「How 家族扩员」（L27 `:4836`、L30——L72 How often／L73 How long；how far、How old 各认读一句）
- 「家族不垫板／动词穿原样」（L47/L61 `:11148`、#70 `huntCases.ts:2953/:2967`——L74 口令块扩员、L75 接力）
- 「名字版通行证」（L42/L45/L64——L75 How about going）
- 「频率阶梯」（L28 `:5006/:5072`——L72 答语收尾）
- 「礼貌一来一往」（L61——L74 请求义↔出手义）
- 「提议应答」（L70 招待应答链——L75 Good idea 新造、错配登记走查）

### 4.3 禁用词表（本批生产禁出现）

疑问词、频度副词、动词不定式、情态动词、宾语、双宾语、介词、动名词、非谓语、使役、三单、人称代词、助动词、倒装——全禁；用「How 家族又一岗／口令块／穿原样／不垫板／名字版／放桌上问」替代。

## §5 验收标准

### 5.1 检查清单

- [ ] G1 practice ≥4 且含变体逐字题（示例：L72 `I don't run every day.` / L73 `It doesn't take long.` / L74 `Can I help you?` / L75 `How about going to the park?`）
- [ ] G2 tokens/answer 词集一致、distractors 不重复
- [ ] G3 recall 三字段非空
- [ ] G4 arrange/practice 展示序≠答案序
- [ ] G5 罪名枚举：4 案 tag 全落 10 枚举（预期 verb_form/word_order/preposition/plural/tense）；**本批不碰 comparison**
- [ ] G6 案件结构：tokenIndex 对齐、errors=4（新错 2 + 旧错 2）、单 token 可修（短语级替换按 #36/#75 先例）、≥1 净词、reviewed=true
- [ ] G7 tagStats=10 不动（`huntService.test.ts:109`）
- [ ] **G8 展示层硬需求**：season-11（min 72, max 75）+ m13（afterLesson 75）随批上线——`grammarSeasons.ts` 追加 `{ id: "season-11", label: "第十一季 · 频率与提议", hint: "问多久一次、要花多久，开口搭把手，一起走吧——把日子问清楚，把话说在一起", min: 72, max: 75 }`；`GrammarPathPage.tsx` CAN_DO_MILESTONES 追加 m13（标题「我能问多久一次、要花多久，也会说让我来、咱们去吧」，样本句：`How often do you run?` / `It takes ten minutes.` / `Let's go to the park.`）
- [ ] **G8-b 守门测试**：`grammarSeasons.test.ts` 四断言全绿——「最高课号 75 落区间」与「区间不重叠」（72 > 71）
- [ ] **G9 orphans 纪律**：4 个新案（#81–#84）全部被 L72–L75 引用（番外案名单冻结 5 个不动）
- [ ] G10 episode 写法：L72–L75 全部汉字数字（「小美的一天 七十二」…「七十五」）
- [ ] G11 语料锁闭集：How often/How long 只用问节奏与时长型；how far/How old 只认读各一句（不入变体/复现）；let/help 只用口令块＋原形（make 使役零出现）；Let's/How about 只用提议型；What about 只对照不新用；take 只用表耗时型；不碰 much 数量义（32 处）与交通方式
- [ ] G12 关 2 cloze：逐课核验 variants 至少 1 句让主考点落空并确认落点——L72 `How often do you run?` 抽 do（主考点 often 落空；保障句 `Do you often read at night?` 抽 do ✅）；L73 `How long does it take?` 抽 does（主考点 long 落空）；`It takes ten minutes.` 抽 takes＝fallback 第 2 词（实读复核 takes 不在 24 词表）——保障句 `Does it take ten minutes?` 抽 Does ✅；L74 `Let me help you.` 抽 me（系统性失手；保障句 `Let me do it.` 抽 do ✅）；L75 `Let's go to the park.` 抽 go（幸运落点＝表内谓语词；保障句 `Let's do it.` 抽 do ✅）——生产时逐课预演确认题干可读
- [ ] G13 时长 6–8min；G14 旧线零回归（L1–71 不动；605 测试全绿 + build 通过）

### 5.2 Given/When/Then

- **G-A1** Given 学习者完成 L72 When 看对比卡 `How often you run?` ❌ / `How often do you run?` ✅ Then 能说出「问动作要请 do 帮忙——疑问词站句首，do 跟在后」
- **G-A2** Given 学习者在 `hunt-run-plan` 遇到一周两次语序错 When 修成 `twice a week` Then 句子全对，并能说出「次数在前、时间在后」
- **G-A3** Given 学习者完成 L73 When 看对比卡 `It is ten minutes.` ❌ / `It takes ten minutes.` ✅ Then 能说出「花时间用 takes」
- **G-A4** Given 学习者完成 L74 When 看对比卡 `Let me to help you.` ❌ / `Let me help you.` ✅ Then 能说出「口令块后面直接接动作，不垫板」
- **G-A5** Given 学习者在 `hunt-moving-help` 遇到 `*helps` When 修成 `help` Then 能说出「跟 must/should 家族一个规矩——动词穿原样」
- **G-A6** Given 学习者完成 L75 When 看对照卡 `What about you?` ✅ / `How about a cup of tea?` ✅ Then 能说出「老位的 What about 是『你呢』，How about 才是『怎么样』」

## §6 案件规划（4 案）

**总规则**：每案 4 错 = 新错 2 + 旧错 2；单 token 可修；每案 ≥1 净词；零术语话术；tag 全落 10 枚举（tagStats 固定 10 项）；reviewed: true；**必须配课**；**不碰 comparison**。案件编号接批十尾号（#80 `hunt-enough-bag`，`huntCases.ts:3376`）为 **#81–#84**。

| 案件 id | 配课 | 场景 | 定稿错误构成（原 → 修正（tag，新错/旧错）） |
|---|---|---|---|
| `hunt-run-plan` | L72 | 跑步计划表 | ① `you` → `do you`（word_order，新错——疑问语序；先例 #36）② 「一周两次」语序块 → `twice a week`（word_order，新错——次数在前、时间在后；短语级替换按 #36/#75 先例）③ `shoe` → `shoes`（plural，旧错——复数复现 L9/L11）④ `on` → `in`（the morning 复现 L18）（preposition，旧错） |
| `hunt-trip-time` | L73 | 出行时间条 | ① `it` → `does it`（word_order，新错——疑问语序同族 #36/#81）② `is` → `takes`（verb_form，新错——表耗时转正，全库首次）③ `minute` → `minutes`（plural，旧错——ten minutes 复现）④ `in` → `at`（noon 复现 L18 点用 at）（preposition，旧错） |
| `hunt-moving-help` | L74 | 搬家帮手条 | ① `to` → 去掉（\*Let me to help → Let me help）（verb_form，新错——去掉 to 型先例 10 处、9×verb_form）② `helps` → `help`（verb_form，新错——家族不变形；#70 `cans`→`can` 同族）③ `box` → `boxes`（plural，旧错——two boxes 复现）④ `help` → `helped`（tense，旧错——上周的事用做过版；先例 #1 `:52`） |
| `hunt-park-plan` | L75 | 公园计划 | ① `to` → 去掉（\*Let's to go → Let's go）（verb_form，新错——去掉 to 型先例同族）② `go` → `going`（\*How about go → going）（verb_form，新错——名字版；#78 `open`→`opening` 同族）③ `tree` → `trees`（plural，旧错——two trees 复现）④ `on` → `in`（walk in the park）（preposition，旧错——段用 in，L18） |

> **案件表纪律**：每案 4 错全部单 token 可修、tokenIndex 与 tokens 对齐（生产时逐 token 核对）；新错话术走 §3 负迁移表「话术方向」列；旧错一律取自 L9/L11/L18/#1 已教点，禁引入未教材料；L75 案**不设**应答句错（L70 错配走查项，见 §8-2）。

## §7 Non-goals

- **不做** make 使役（三词超载降载，留后——批十二起议）；**不做** look like（BC B1-B2＋like 同形＋词表双弱，留批十二）
- **缓办** keep+doing（三源无位维持不立）；stop 变义对（双源但 B1+）；wh+to（先过评审）；much better/far（B1+ 维持认读）
- **不做** 交通方式（词块非语法点；by bus 不入本批语料）；**冻结** may/might；**不做** 附加疑问、深水区
- **不做** How far/How old 主攻（各认读一句，L73 第 4 条／L72 第 4 条）；**不做** What about 提议义（只做 L45 同形对照）
- **案件不碰** comparison（统计口径 10 项不动）；**不加**新枚举、不改 tagStats、不改 schema、不动 L1–71
- **不做** 封面池外新资产（4 课全部从单次池 27 张选）；**不做** I'd 缩读（批十 §8-② 口径延续）；**不做** L70 应答链重教（Good idea 新造与错配登记分离）

## §8 开放问题

1. **Let's 单源证据标注**：L75 证据＝中文单源＋我方两处弱曝（Murphy 仅 U35 Let's）——对外标注「中文驱动＋弱曝转正」，不宣称跨源共识（竞析 §③ 纪律）
2. **L75 与 L70 答语错配设计规避**：Good idea（提议）与 Yes, please／No, thanks（招待）两条链课距仅 5 课——设计上 L75 不提供与 L70 同形应答；默认：**走查项、不做卡**（瑞思发现 3；M4 观察盯错配）
3. **How old 认读边界**：L72 对比卡第 4 条一句，不入变体/复现题；若拼挤降 sceneSwings——默认：**维持对比卡一句**
4. **make 留后时机**：本批 make 零出现（G11 锁闭）；批十二随 F11-B 数据重估
5. **how far 认读边界**：L73 对比卡第 4 条一句，同 §8-3 口径
6. **「让」话术成本**：L74 打样门重点核「口令块」比喻可懂性；若走查不通，备选话术「let me＝让我来，后面直接接动作」——默认：口令块为主
7. **封面语义核对**：4 张（cover43/cover9/cover19/cover29）生产时逐张核；不匹配换单次池语义近者（27 张余量充足）
8. **语序块修正的 tokenIndex 口径**（#81/#82）：短语级替换按 #36/#75 先例执行，生产时逐 token 核对——默认：照先例

## §9 里程碑（粗略，正式排期归路径）

| 阶段 | 产出 | 说明 |
|---|---|---|
| M0 规格冻结 | 本 PRD 评审 | 无 P0 前置项 |
| M1 打样 | L72 全量 + hunt-run-plan + 首玩走查 | 重点：How 家族扩员话术、cloze do 落点、「让」话术（入 L74 前定稿） |
| M2 生产 | L73–L75 + 3 案 + season-11/m13 展示层 | ≈2 人日 |
| M3 验收 | §5 全量 + 路径页走查 | G8/G8-b/G9 硬需求 |
| M4 上线观察 | 首过率、Let me to／helps 新错型命中率、cloze 落点、m13 触发、L75 答语错配走查 | 挂既有埋点；与 F10-B/F11-B 数据合并关账（不互锁） |

## ✅ 行动清单

| # | 行动 | 负责方 | 时间窗 |
|---|------|--------|--------|
| 1 | L72 + hunt-run-plan + 走查 | 内容 | D1–D2 |
| 2 | L73 + hunt-trip-time | 内容 | D2–D3 |
| 3 | L74 + hunt-moving-help（「让」话术定稿） | 内容 | D3–D4 |
| 4 | L75 + hunt-park-plan | 内容 | D4–D5 |
| 5 | season-11 + m13（约 10 行） | 开发 | 随批 |
| 6 | 验收 + 路径页走查（守门测试四断言） | 内容/开发 | D6 |
| 7 | M4 观察 | 产品负责人 | 上线后 1–2 周 |

## ⚠️ 待确认 / 假设 / Non-goals

- 开放问题 §8 八项（均有默认方案）
- 假设：单次封面池 27 张中语义近者充足（本批取 4 张，余 23 张够批十二）；episode 七十二…七十五零占用（数析实读）
- 依赖：L72 依赖 L27/L28/L21；L73 依赖 L27/L30；L74 依赖 L47/L61/#70；L75 依赖 L29/L45/L56/L65（L70 应答错配为走查项）
- Non-goals：见 §7（含 make 留后、交通方式隔离、comparison 不进案件）

## 📚 数据来源 & 成员产出索引

- 析客（本 PRD）；瑞思：`user-research-grammar-eleventh-batch-2026-09-18.md`；竞析：`competitive-analysis-grammar-eleventh-batch-2026-09-18.md`；数析：`data-audit-grammar-eleventh-batch-2026-09-18.md`
- 正文事实核对：`grammarLessons.ts`（L21 `:3921`、L27 `:4822/:4836`、L28 `:5006/:5072`、L30 `:5415-5424`、L45 `:8162`、L47 `:8509`、L56 `:10227`、L61 `:11148`、L65 `:11926`、L70 `:12847`、episode 尾「七十一」`:13040`）；`huntCases.ts`（#70 `:2942/:2953/:2967`、#80 `:3376`）；`grammarSeasons.ts:39`；`GrammarPathPage.tsx:191`；`grammarAmbushService.ts:154`（24 词表——takes 实读复核不在表）
- 红线核对：去掉 to 型实测 10 处（9×verb_form）；cloze 落点复刻（瑞思 §0）；封面单次池 27 张（数析 §1 G-covers）

---

> 本报告由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。
