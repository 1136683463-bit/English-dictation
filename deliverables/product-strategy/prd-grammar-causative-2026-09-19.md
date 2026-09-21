# PRD：第十六批课程 · 谁让谁做什么（8 课：L103–L110 · 大章节 · 单拱）

**日期**：2026-09-19 ｜ **类型**：功能规格书（PRD）｜ **成员**：析客（需求分析）
**上游输入**：主理人裁决（8 课 L103–L110＝「谁让谁做什么」大章节；开 season-16＋m18；单拱「家里和学校的事」线）；本批三研究（瑞思/竞析/数析 2026-09-19）；产品负责人「大章节（6–8 课）」要求

## 📝 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1 | 2026-09-19 | 初稿：8 课（L103–L110）＋8 案（#112–#119），开 season-16、m18；定位「第四个大章节 · 单拱——中文『让』的四张脸」 |

## 📌 TL;DR

1. **批十六＝8 课（L103–L110）「谁让谁做什么」大章节·单拱**：让某人做（make 三人称）→ 昨天他让我等（made）→ 不让去（否定/疑问）→ 让他玩（let 换人）→ 老师让我来（have）→ 说服他（get 垫 to）→ 一直等到雨停（until）→ 章末零新知收口；开 **season-16（{103,110}）＋m18（afterLesson 110）**，批量 110 课、119 案。
2. **单拱＋四张脸＝一课一增量轴**：全批一条「家里和学校的事」线；中文「让」四张脸（迫使 make／允许 let／请托 have／说服 get）各自成课，**四动词唯一形式差＝「垫不垫 to」**（make/let/have 不垫、get 垫）——逐课只换一个动词，负荷与批十五「零新结构」同级。
3. **先立规矩（L103–L107）再破一次（L108）**：前五课把「口令块后面直接接动作、不垫板」立成家族铁律（接 L47 `:8526`→L74 `:13620` 话术），L108 用 get 破例——**次序不可换**（先破后立，规矩立不住）。
4. **结构真空白＋宾语单点占死**：`make/makes/making` GL **0/0/0**；`made` 4 处**全 L68「做蛋糕」义**（同形干扰头号难点）；`let`＋宾语 **50/51 全是 me**（L74 占 49）、`let him/her/them` **0**、`lets` **0**、使役 `get` **0**、`have+宾+动词` **0**——须**换锚第三人称**（makes/made＋him/her/them），否则即 L74 复课；L74 `:13690` 钩子本批兑现。
5. **跨源位置诚实标注**：四动词＝**B+ 档（词典型）**——BC 三档 68 课零使役课位、Murphy make 零命中，Cambridge 使役族 10 页＋中文侧三篇明文负迁移；**不与批十五乙的 A 档混述**（批十一型·中文需求驱动）。L109＝B+ 档（Cambridge `until` 页六类错误＝本轮最强单页）；L110＝自研收口（L54/L78/L94/L102 四代先例）。
6. **案件 8 案（#112–#119）**：4 错＝新 2＋旧 2（L110 案全回流）；单 token 可修；落最厚两条 **verb_form 93／sv_agreement 53**；不碰 comparison；不引番外 5 案；**G-boost 硬护栏——每课 contrast 6 条中 ≥2 条带 wrongMark 真实错卡（推荐 3，禁止贴线）**；`guided.spot` 的 `wrongToken` 须与 token 逐字相等（L96/L102 因标点不匹配曾致题目静默消失，本批以此为鉴）。

## 🎯 核心结论卡片

| 项目 | 内容 |
|---|---|
| 推荐方案 | 8 课 L103–L110「谁让谁做什么」单拱大章节：make 立岗 1 → made 昨天版 1 → 否定/疑问 1 → let 换人 1 → have 请托 1 → get 破例 1 → until 1 → 零新知收口 1；8 案 #112–#119；开 season-16＋m18 |
| 优先级 | P1（内容生产批次）；无 P0 阻断项 |
| 预期影响 | 第四个大章节；补全库最厚两条罪名（verb_form/sv_agreement）承载位；兑现 L74 `:13690` 跨批钩子（第三次）；`She doesn't let me help.`（`:13676`）半曝转正；首次给「垫不垫 to」家族立总表 |
| 资源需求 | ≈5 人日（内容 4＋展示层 0.25＋走查 0.5＋验收 0.25）；两段式跨 2 周 |
| 风险等级 | 中（made 同形干扰；四动词认知负荷；L108 破例次序；until 的 will 病；封面单次池近枯竭） |
| 硬性范围红线 | 课量 8 不扩不缩；一课一增量；L110 零新知；六段式；每课 1 案（4 错＝新 2＋旧 2、单 token 可修）；对比卡 6 条（**≥2 条带 wrongMark**）；禁用词表；comparison 不进案件；tagStats=10 不动；L1–102 零改动；封面池外零新资产 |

## §1 问题陈述与批次定位

### 1.1 解决什么问题

- **大章节续作**：批十三首开 8 课大章，批十四/十五续——本批以**第四个大章节**接续，season-16 一次到位，兑现产品负责人「章节课程多一些」。
- **结构真空白＋宾语单点被占死**：`make/makes/making` **0**；`let`＋宾语 **50/51 全是 me**（L74 独占 49）——L74 `:13690` 明写「『让』这个字……今天先拿下一个最常用的」，钩子已埋；本批**必须换锚第三人称**才不是复课。
- **同形干扰**：`made` 4 处全在 L68「做蛋糕」（`:12489`）——「做」与「让」同形，本章头号难点，须用对照卡拆（`She made a cake for me.` vs `He made me wait.`）。
- **最厚两条罪名的承载位**：verb_form 93/58、sv_agreement 53/43——本批 8 案主落这两条（第三人称 -s 与「后面穿原样」天然承载）。
- **半曝转正**：L74 `:13676` `She doesn't let me help.` 在库——L105 转正，增量＝否定与疑问两版。
- **boost 联动护栏**：批十四曾 6 课贴线（恰 2 道）、批十五 1 课贴线；本批 8 课全部按「≥2 条带 wrongMark 真实错卡」（推荐 3）产出。

### 1.2 前置已铺完（本批直接衔接）

| 前置 | 行号 | 本批怎么用 |
|---|---|---|
| L74 让我来帮你 | `:13604–13790`（`:13620` 不垫板话术／`:13634` ❌ Let me to help／`:13676` 半曝句／`:13690` 钩子） | L103 兑现钩子；L105 半曝转正；L106 显式分工；全章话术基座 |
| L47 should 不垫板家族 | `:8509`／`:8526` | 家族起点——make/let/have 的「不垫板」正是这条老规矩 |
| L75 Let's 缩写 | `:13793`／`:13876` | L106 区分「Let me 请缨」vs「lets 她放手」 |
| L10 昨天版 | `:1699`（target `:1707`） | L104/L107/L108/L109 换版本依据 |
| L16 have to / get up | `:2794`（`I have to get up early.`） | L107 同一个 have 两张脸（不得不 vs 让我） |
| L25 三单 -s | `:4460` | L103 makes／L106 lets 的真考点来处 |
| L68 买给你（made 做义） | `:12489`（`She made a cake for me.` ×3） | L104 同形干扰对照卡直接取材 |
| L92 when 三人组 | `:17104`（after/before/when） | L109 until 成为第四名成员 |
| L97/L98 when·while | `:17967`／`:18156`（`:18198` ❌during 卡） | L109 时间家族排一行；during 不重开 |
| L15 want to 垫板 | `:2610` | L108 的 to 来处（want to 老熟人） |
| L54/L78/L94/L102 收口 | 四代先例 | L110 零新知收口同构 |
| 展示层 | `grammarSeasons.ts:48`（season-15 末项）／`GrammarPathPage.tsx`（m17） | season-16／m18 追加位（纯增量） |

### 1.3 批次定位：单拱——一条「家里和学校的事」线

本批是第四个大章节，取**单拱**（批十五亦单拱；竞析判批十四双拱后「连续双拱」风险中高，不再破例）。素材全部落在「家里和学校」：妈妈让写作业（L103）→ 昨天让人等了半小时（L104）→ 不让我去（L105）→ 却让弟弟玩（L106）→ 老师让我来一趟（L107）→ 我说服了他一起去（L108）→ 我一直等到雨停（L109）→ 四句话收口（L110）。竞析三问制判甲＝B+（课程位零但词典族最厚＋中文三篇明文负迁移＋钩子已埋），**诚实标注「批十一型·中文需求驱动」**；L109 的 until 归入同章（乙只剩 until 一项，单开撑不满 6 课，且 during 已由 L98 `:18198` 讲透）。分档：L103–L108＝B+ 档；L109＝B+ 档（单页证据最强）；L110＝自研收口。

## §2 拆课方案与逐课规格

### 2.1 课量决策：8 课（L103–L110）

| 方案 | 取舍 | 裁决 |
|---|---|---|
| 6 课（瑞思备选：砍 get 与收口） | get 是四张脸的第四张（说服），砍掉则「唯一垫 to 的破例」无处发生；破 10 先例的章末零新知传统 | ✗ |
| 7 课（砍 L108，get 降为 L107 的 1 张对照卡） | 同样掐掉「先立规矩再破一次」的执行点（全章最高教学价值的一次转折）；且 7 案破坏每课 1 案配平 | ✗ |
| **8 课** | 四动词 4＋否定/疑问 1＋换人 1＋until 1＋收口 1；一课一增量；8 案 #112 起；单拱由「家里和学校的事」承载 | **✓ 拍板（主理人）** |

课表：L103 `lesson-103-makes-me`｜L104 `lesson-104-made-me`｜L105 `lesson-105-doesnt-let`｜L106 `lesson-106-let-him`｜L107 `lesson-107-have-him`｜L108 `lesson-108-got-him-to`｜L109 `lesson-109-until`｜L110 `lesson-110-who-makes-who`

**封面（单次池 4 张＋二用升三用 4 张，混合方案）**：L103←`cover41`｜L104←`cover45`｜L105←`cover47`｜L106←`cover48`（单次池 4 张一次用完，**批十七起再无单次张**）；L107←`cover12`｜L108←`cover17`｜L109←`cover9`｜L110←`cover19`（二用升三用，三用后最小间距 40/37/36/36）。**备选序（若 4 张单次张语义核对不符，整批改走纯二用）**：按「三用后最小间距」降序取 8 张——`cover12＞17＞9＞19＞29＞7＞42＞25`（最小间距 32）。❌ `cover49` 两段间距仅 9，禁用；批十五刚用的 cover13/14/15/22/27/37/38/40 勿碰。**生产时须逐张语义核对**（家／学校场景与画面是否相称），不符者池内互换；`cover` 缺省可回退 scene SVG，不阻断上线（池外零新资产）。

### 2.2 逐课规格

**L103 妈妈让我先写作业（make sb do · 三人称 makes）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-103-makes-me`；episode「小美的一天 一百零三」；scene `mansion`；cover `cover41`（单次池） |
| title / grammarLabel | 「妈妈让我先写作业」/「让某人做 · makes + 动作穿原样」 |
| targetSentence | `My mom makes me do my homework.`（8 token；cloze 落 **makes**——正中考点） |
| 场景 | 家里：妈妈推着你先写作业再玩（学生最熟的那句抱怨） |
| 新知识点 | **只有一件**：make 换成她/他/它版本 makes，后面直接接动作穿原样（不垫板）——L74 `:13690` 钩子兑现 |
| 对比卡方向（6 条） | ① `My mom makes me to do my homework.` ❌（**`to`**，verb_form——垫板惯性头号错，剑桥明文 ❌ made me to work）；② `My mom make me do my homework.` ❌（**`make`**，sv_agreement——漏三单）；③ `My mom makes me does my homework.` ❌（**`does`**，verb_form——后面穿原样）；④ 双正解：`My mom makes me do my homework.` ✅ 并排 `My dad makes me clean my room.` ✅（换人换事，规矩一样）；⑤ 复习卡（L16）：`I have to get up early.` ✅；⑥ 复习卡（L25）：`She likes music.` ✅（她/他/它加 -s——makes 的 -s 就是它） |
| 变体方向 | 肯定 target（cloze 落 makes——正中）/ 否定 `My mom doesn't make me do my homework.`（noteZh：妈妈不逼我；帮手后穿原样）/ 疑问 `Does your mom make you do your homework?`（noteZh：你妈让你写作业吗） |
| 复现题设计 | guided 复现 L74 原句 `She doesn't let me help.`（`:13676` 半曝句，转正前最后一面）；practice 第 1 题 target＋变体逐字题；**第 2 题保障句 `My dad makes me clean my room.`（cloze 落 makes——主考点正中）**；第 3 题复现 L25 原句 `He drinks milk every day.` |
| 案件规划 | 新案 `hunt-mom-makes`「妈妈让我写作业」（#112，§6）；错型 sv_agreement＋verb_form（新）＋旧错 sv／plural |
| 六段要点 | 开场点名 L74 `:13690`「今天把那个『让』拿下」；比喻＝「不垫板家族又添一员（L47→L74→makes）」；deepDive：makes 三连＋垫 to／漏 -s 各一错；arrange ≤8 token |

**L104 昨天他让我等了半小时（made 昨天版）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-104-made-me`；episode「小美的一天 一百零四」；scene `city`；cover `cover45`（单次池） |
| title / grammarLabel | 「昨天他让我等了半小时」/「昨天版的『让』 · made + 动作穿原样」 |
| targetSentence | `He made me wait.`（4 token；cloze 落 **made**） |
| 场景 | 昨天约在街角，他迟到——他让我等了半小时 |
| 新知识点 | **只有一件**：说别人的昨天，make 换昨天版 `made`（L10 老规矩），后面照样穿原样 |
| 对比卡方向（6 条） | ① `He made me to wait.` ❌（**`to`**，verb_form——垫板惯性＋剑桥明文档）；② `He make me wait.` ❌（**`make`**，tense——昨天版没换）；③ `He made me waited.` ❌（**`waited`**，verb_form——后面穿原样）；④ **同形干扰对照卡（L68 `:12489`）**：`She made a cake for me.` ✅ 并排 `He made me wait.` ✅——同一个 made，一个是「做蛋糕」、一个是「让我等」；⑤ 复习卡（L10）：`Yesterday I went to the park.` ✅；⑥ 复习卡（L103）：`My mom makes me do my homework.` ✅（今天版 makes／昨天版 made） |
| 变体方向 | 肯定 target（cloze 落 made）/ 否定 `He didn't make me wait.`（noteZh：他没让我等；didn't 后穿原样）/ 疑问 `Did he make you wait?`（noteZh：他让你等了吗） |
| 复现题设计 | guided 复现 L103 原句 `My mom makes me do my homework.`；practice 第 1 题 target＋变体逐字题；**第 2 题保障句 `She made me clean my room.`（cloze 落 made——主考点正中）**；第 3 题复现 L10 原句 `Yesterday I went to the park.` |
| 案件规划 | 新案 `hunt-made-me-wait`「等了半小时」（#113，§6）；错型 tense＋verb_form（新）＋旧错 tense／plural |
| 六段要点 | 开场引 L68「made 有两张脸」；比喻＝「同一个 made：做蛋糕是『做』，让我等是『让』——看它后面接什么」；deepDive：made 三连＋垫 to／没换版本各一错；arrange ≤4 token |

**L105 她不让我去（否定与疑问两版）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-105-doesnt-let`；episode「小美的一天 一百零五」；scene `mansion`；cover `cover47`（单次池） |
| title / grammarLabel | 「她不让我去」/「不让做 · doesn't + let + 动作穿原样」 |
| targetSentence | `She doesn't let me go.`（6 token；cloze 落 **doesn't**——表内） |
| 场景 | 晚上想出门，妈妈拦下——她不让我去 |
| 新知识点 | **只有一件**：把「让」说成「不让」和「让吗」——帮手（does/doesn't）替 let 干活，let 照穿原样（L74 `:13676` 转正） |
| 对比卡方向（6 条） | ① `She doesn't lets me go.` ❌（**`lets`**，verb_form——帮手后穿原样）；② `She doesn't let me to go.` ❌（**`to`**，verb_form——垫板惯性复发）；③ `Does she lets me go?` ❌（**`lets`**，verb_form——问句里也穿原样）；④ 双正解：`She doesn't let me go.` ✅ 并排 `She doesn't let me watch TV.` ✅（换事不换规矩）；⑤ 复习卡（L74 `:13676`）：`She doesn't let me help.` ✅——**第 74 课半曝句今天转正**；⑥ 复习卡（L16）：`I have to get up early.` ✅（不能去 vs 不得不——两股「不由自己」） |
| 变体方向 | 肯定版 `She lets me go.`（noteZh：她让我去——去掉 doesn't）/ 疑问 `Does she let you go?`（noteZh：她让你去吗）/ 否定 target（cloze 落 doesn't——表内） |
| 复现题设计 | guided 复现 L74 原句 `She doesn't let me help.`（半曝句正面升级）；practice 第 1 题 target＋变体逐字题；**第 2 题保障句 `He doesn't let me watch TV.`（cloze 落 doesn't——主考点兜底）**；第 3 题复现 L16 原句 `I have to get up early.` |
| 案件规划 | 新案 `hunt-not-let-me`「不让我去」（#114，§6）；错型 sv_agreement＋verb_form（新）＋旧错 tense／plural |
| 六段要点 | 开场点名 L74 `:13676`「那句『她不让我帮忙』今天长全」；比喻＝「帮手（doesn't）替 let 干活，let 自己穿原样」；deepDive：doesn't let 三连＋垫 to／多 -s 各一错；arrange ≤6 token |

**L106 她让他玩，不让他熬夜（let 换人：him）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-106-let-him`；episode「小美的一天 一百零六」；scene `mansion`；cover `cover48`（单次池） |
| title / grammarLabel | 「她让他玩」/「让谁做 · lets + 人名 + 动作穿原样」 |
| targetSentence | `She lets him play after dinner.`（7 token；cloze 落 **lets**——实词兜底） |
| 场景 | 弟弟吃完饭想玩，妈妈点头——她让他玩，但不让他熬夜 |
| 新知识点 | **只有一件**：让的对象换成「他/她/他们」——`lets him play`（**换锚三人称＝结构＋屈折＋语义三重空白**；与 L74「Let me」显式分工：L74 是我请缨，本课是她放手） |
| 对比卡方向（6 条） | ① `She lets him to play after dinner.` ❌（**`to`**，verb_form——垫板惯性）；② `She let him play after dinner.` ❌（**`let`**，sv_agreement——漏三单）；③ `She lets him plays after dinner.` ❌（**`plays`**，verb_form——后面穿原样）；④ `She doesn't let him stay up late.` ❌→ 修正 `She doesn't let him stay up late.` ✅（**认读/双正解**：同一课两件事——让玩、不让熬夜；`stay up late` 只作认读不进口令块）；⑤ 复习卡（L74）：`Let me help you.` ✅——**我请缨 vs 她放手（`lets him play`）**两张脸；⑥ 复习卡（L25）：`She watches TV every night.` ✅（let↔lets 的 -s 同一条规矩） |
| 变体方向 | 肯定 target（cloze 落 lets——实词兜底）/ 否定 `She doesn't let him play after dinner.`（noteZh：不让他玩）/ 疑问 `Does she let him play after dinner?`（noteZh：她让他玩吗） |
| 复现题设计 | guided 复现 L105 原句 `She doesn't let me go.`；practice 第 1 题 target＋变体逐字题；**第 2 题保障句 `She lets him watch TV.`（cloze 落 lets——主考点兜底）**；第 3 题复现 L74 原句 `Let me help you.` |
| 案件规划 | 新案 `hunt-let-him-play`「让他玩」（#115，§6）；错型 sv_agreement＋verb_form（新）＋旧错 sv／plural |
| 六段要点 | 开场对位 L74（Let me 我请缨）；比喻＝「换人不换规矩：lets him / lets her / lets them——后面照样穿原样」；deepDive：lets him play 三连＋垫 to／漏 -s 各一错；arrange ≤7 token |

**L107 老师让我来一趟（have sb do · 请托义）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-107-have-him`；episode「小美的一天 一百零七」；scene `campus`；cover `cover12`（二用升三用） |
| title / grammarLabel | 「老师让我来一趟」/「让我做 · had + 人名 + 动作穿原样」 |
| targetSentence | `The teacher had me come early.`（6 token；cloze 落 **had**） |
| 场景 | 学校：老师叫我提早来一趟（分内的事，带点请托味） |
| 新知识点 | **只有一件**：家族第三名 `have` 入伙——「让我做」（请托/分内），后面照样穿原样；过去版 `had` 顺带立住 |
| 对比卡方向（6 条） | ① `The teacher had me to come early.` ❌（**`to`**，verb_form——家族不垫板）；② `The teacher has me come early.` ❌→ 修正 `The teacher had me come early.` ✅（**`has`**，tense——说昨天的事）；③ `The teacher had me came early.` ❌（**`came`**，verb_form——后面穿原样）；④ `The teacher had me clean the blackboard.` ❌→ 修正 ✅（认读/双正解：换事不换规矩）；⑤ 复习卡（L16）：`I have to get up early.` ✅——**同一个 have 两张脸**（不得不 vs 让我做）；⑥ 复习卡（L103）：`My mom makes me do my homework.` ✅（**推着做 vs 分内事让做**——同一个场景换动词） |
| 变体方向 | 肯定 target（cloze 落 had）/ 否定 `The teacher didn't have me come early.`（noteZh：老师没叫我早来）/ 疑问 `Did the teacher have you come early?`（noteZh：老师叫你早来吗） |
| 复现题设计 | guided 复现 L103 原句 `My mom makes me do my homework.`；practice 第 1 题 target＋变体逐字题；**第 2 题保障句 `My dad had me wash the car.`（cloze 落 had——主考点兜底）**；第 3 题复现 L16 原句 `I have to get up early.` |
| 案件规划 | 新案 `hunt-teacher-had-me`「老师叫我」（#116，§6）；错型 tense＋verb_form（新）＋旧错 sv／plural |
| 六段要点 | 开场点名 L16「have 还有第二张脸」；比喻＝「家族第三名 have：不是推、不是放手，是分内的事叫你做」；deepDive：had me come 三连＋垫 to／没换版本各一错；arrange ≤6 token |

**L108 我说服了他一起去（get sb to do · 全章唯一垫 to）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-108-got-him-to`；episode「小美的一天 一百零八」；scene `city`；cover `cover17`（二用升三用） |
| title / grammarLabel | 「我说服了他一起去」/「费了口舌请动 · got him to + 垫一块垫板」 |
| targetSentence | `I got him to go with me.`（7 token；cloze 落 **got**） |
| 场景 | 放学路上：他本来不去，我费了口舌，他答应了——一起走 |
| 新知识点 | **只有一件**：家族第四名 `get` 破例——**唯一垫 to 的成员**（我费口舌请动他）；过去版 `got` 顺带立住。**先立规矩（L103–L107）再破一次（L108）——次序不可换** |
| 对比卡方向（6 条） | ① `I got him go with me.` ❌（**`go`**，verb_form——漏 to：反向错，前五课练「不垫板」到 get 忘了垫）；② `I got him going with me.` ❌（**`going`**，verb_form——当 keep 家族了）；③ `I get him to go with me.` ❌（**`get`**，tense——说昨天没换版本）；④ **家族总表对照卡**：`My mom makes me do my homework.` ✅／`She lets him play after dinner.` ✅／`The teacher had me come early.` ✅／`I got him to go with me.` ✅——**四句排一行，只有最后一句垫 to**（全章轴心句）；⑤ 复习卡（L15）：`I want to go with you.` ✅（to 老熟人）；⑥ 复习卡（L74 `:13620`）：`Let me help you.` ✅（不垫板老规矩——对照今天的破例） |
| 变体方向 | 肯定 target（cloze 落 got）/ 否定 `I didn't get him to go with me.`（noteZh：没说服成）/ 疑问 `Did you get him to go with you?`（noteZh：你说服他了吗） |
| 复现题设计 | guided 复现 L74 原句 `Let me help you.`；practice 第 1 题 target＋变体逐字题；**第 2 题保障句 `She got me to wait.`（cloze 落 got——主考点兜底）**；第 3 题复现 L15 原句 `I want to go with you.` |
| 案件规划 | 新案 `hunt-got-him-to`「说服他去」（#117，§6）；错型 verb_form＋tense（新）＋旧错 tense／plural；**当课观察：漏 to（反向错）命中率** |
| 六段要点 | 开场「前五课的老规矩，今天要破一次」；比喻＝「家族里只有 get 垫一块小垫板」；deepDive：get sb **to** do 三连＋漏 to／穿 -ing 各一错；arrange ≤7 token；**中段自走查点（四张脸是否说清——本章最大未知）** |

**L109 我一直等到雨停（until · as 只作 1 张对照卡）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-109-until`；episode「小美的一天 一百零九」；scene `city`；cover `cover9`（二用升三用） |
| title / grammarLabel | 「我一直等到雨停」/「等到…为止 · until + 小句子」 |
| targetSentence | `I waited until the rain stopped.`（6 token；cloze 落 **waited**——实词兜底，until 不在词表） |
| 场景 | 放学下起了雨，小美在屋檐下一直等，等到雨停 |
| 新知识点 | **只有一件**：until 说「一直等到…为止」——前面一直做、后面那道线一到就停；接 L92 `:17104` 先后三人组成为第四名成员（after/before/when＋until） |
| 对比卡方向（6 条） | ① `I waited until the rain stops.` ❌（**`stops`**，tense——前面用了昨天版，后面也得用）；② `I waited until the rain will stop.` ❌（**`will`**，tense——will 病，剑桥明文 ❌「until the summer holidays begin. Not: …will begin」）；③ `I waited by the rain stopped.` ❌（**`by`**，preposition——by 是「到某个点之前就做完」，不是「一直等到」）；④ **as 对照卡（BC 例，仅此 1 张）**：`She called as I was getting out of the bath.` ✅（认读——as 也能领一整句说「当…那会儿」；**不单开、不进 practice**）；⑤ 复习卡（L92 `:17104`）：`When it is sunny, I run.` ✅（时间家族排一行）；⑥ 复习卡（L98）：`While I was reading, he was sleeping.` ✅——**during 不重开**（L98 `:18198` 已讲透） |
| 变体方向 | 肯定 target（cloze 落 waited——实词兜底）/ 否定 `I didn't wait until the rain stopped.`（noteZh：我没等到雨停）/ 疑问 `Did you wait until the rain stopped?`（noteZh：你等到雨停了吗） |
| 复现题设计 | guided 复现 L92 原句 `When it is sunny, I run.`；practice 第 1 题 target＋变体逐字题；**第 2 题保障句 `We waited until the movie ended.`（cloze 落 waited——主考点兜底）**；第 3 题复现 L97 原句 `When you called, I was reading.` |
| 案件规划 | 新案 `hunt-until-rain`「等雨停」（#118，§6）；错型 tense＋verb_form（新）＋旧错 plural／sv_agreement |
| 六段要点 | 开场点名 L92 `:17104`「三人组今天加一名」；比喻＝「等到…为止：前面一直做，那道线一到就停」；deepDive：until 三连＋will 病／后面没换版本各一错；arrange ≤6 token |

**L110 谁让谁做什么（章末收口 · 零新知）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-110-who-makes-who`；episode「小美的一天 一百一十」；scene `sparkle`；cover `cover19`（二用升三用） |
| title / grammarLabel | 「谁让谁做什么」/「收口 · 四张脸排一行（零新知）」 |
| targetSentence | `My mom makes me do my homework. She lets him play after dinner. The teacher had me come early. I got him to go with me.`（复现混排，逐句 ≤8 词；cloze 按实跑登记） |
| 场景 | 把这一章家里和学校的那些事摆一摆——四句话排一行 |
| 新知识点 | **无——章末零新知**（收口四代先例 L54/L78/L94/L102 同构，接口零字段新增）；复现取材：L103/L106/L107/L108 各 1 句；**不引番外 5 案** |
| 对比卡方向（6 条） | ① `My mom makes me to do my homework.` ❌（**`to`**，verb_form——L103 回流，锚 #112）；② `She doesn't lets me go.` ❌（**`lets`**，verb_form——L105 回流，锚 #114）；③ `I got him go with me.` ❌（**`go`**，verb_form——L108 回流，锚 #117）；④ **四张脸总表（双正解）**：`My mom makes me…` ✅／`She lets him play…` ✅／`The teacher had me come…` ✅／`I got him to go…` ✅——**前三句不垫板、最后一句垫 to**；⑤ 复习卡（L104）：`He made me wait.` ✅；⑥ 复习卡（L109）：`I waited until the rain stopped.` ✅（时间侧留一句） |
| 变体方向 | 肯定 target（收口课无主考点，按实跑登记）/ 否定 `She doesn't let him play after dinner.`（noteZh：不让他玩）/ 疑问 `Did the teacher have you come early?`（noteZh：老师叫你早来吗） |
| 复现题设计 | guided 复现 L109 原句 `I waited until the rain stopped.`；practice 第 1 题 target＋变体逐字题；第 2 题复现 L106 原句 `She lets him play after dinner.`；第 3 题复现 L107 原句 `The teacher had me come early.`；第 4 题＝章末收官惯例，复现 L108 原句 `I got him to go with me.` |
| 案件规划 | 新案 `hunt-who-makes-who`「谁让谁做什么」（#119，§6）；**全回流、不新增错型**；不引番外 5 案 |
| 六段要点 | 开场跨 7 课倒带（L103→L109 各回一句）；比喻＝「四张脸排一行，只有 get 那张垫着小垫板」；deepDive：四动词总表＋垫 to／漏 -s 各一错；arrange 逐句 ≤8 词 |

## §3 中文负迁移处理专章

| 课 | 干扰 | 典型错 | 话术方向 | 归入 |
|---|---|---|---|---|
| L103 | 中文「让我做」见 to 就垫；动词不变形 | \*makes me to do／\*My mom make me… | 「口令块后面直接接动作，不垫板」（L74 `:13620` 老话术）；「她/他/它做事要带 -s」 | 对比卡 ①②③（verb_form／sv） |
| L104 | 昨天版没换＋made 同形混淆 | \*He make me wait／\*He made me to wait／「做蛋糕」当「让我」 | 「说昨天就换昨天版：made」；「同一个 made 两张脸，看后面接什么」 | 对比卡 ①②④（tense／verb_form） |
| L105 | 帮手在场，let 还穿 -s；to 病复发 | \*doesn't lets／\*let me to go／\*Does she lets…? | 「帮手替它干活，它自己穿原样」 | 对比卡 ①②③（verb_form） |
| L106 | 换人后漏 -s；后面多穿 | \*She let him play／\*lets him to play／\*lets him plays | 「换人不换规矩：lets him／lets her／lets them」；「后面永远穿原样」 | 对比卡 ①②③（sv／verb_form） |
| L107 | 把 have 当普通动词补 to | \*had me to come | 「分内事叫你做，还是不垫板」；「同一个 have：不得不 vs 让我做」 | 对比卡 ①②（verb_form／tense） |
| L108 | **反向迁移**：前五课练不垫板，到 get 忘了垫 | \*got him go／\*got him going | 「家族里只有 get 垫一块小垫板」；「不垫是规矩，垫是这一家的例外」 | 对比卡 ①②（verb_form） |
| L109 | 直译「雨会停」用 will；前后不呼应 | \*until the rain will stop／\*until the rain stops | 「等到…为止：前面一直做，后面那道线一到就停」；「两边都穿昨天版」 | 对比卡 ①②（tense） |
| L110 | 混排时四动词串台（垫 to／漏 -s） | 四句互窜 | 只用本批旧课锚点，不引入未教材料 | §6 案件表纪律 |

## §4 叙事设计专章

### 4.1 叙事草案（逐字采用）

> **「谁让谁做什么——家里和学校的事。」**
> 妈妈让我先写作业：My mom makes me do my homework.（第 103 课，**兑现第 74 课那句「今天先拿下一个最常用的」**）→ 昨天他让我等了半小时：He made me wait.（第 104 课，同一个 made 的另一张脸）→ 她不让我去：She doesn't let me go.（第 105 课，**第 74 课那句「She doesn't let me help.」今天长全**）→ 可她让他玩：She lets him play after dinner.（第 106 课，换人不换规矩）→ 老师让我来一趟：The teacher had me come early.（第 107 课，分内的事）→ 我说服了他一起去：I got him to go with me.（第 108 课，**全章唯一垫一块小垫板**）→ 我一直等到雨停：I waited until the rain stopped.（第 109 课）。
> 收住：四句话排一行——makes／lets／had／got to（第 110 课：谁让谁做什么）。

### 4.2 复用体系（不造新比喻）

- 「口令块／不垫板家族」（L47 `:8526`→L74 `:13620`→本批 make/let/have 三代一条线）
- 「家族里只有 get 垫一块小垫板」（本批新增，L108 一次说清）
- 「让的四张脸」（本批新增：make 推着做／let 放开做／have 分内事让做／get 费了口舌请动）
- 「昨天版」（L10 `:1699`——L104/L107/L108/L109 换版本）
- 「她/他/它加 -s」（L25 `:4460`——L103 makes／L106 lets）
- 「同一个 have 两张脸」（L16 `:2794` 不得不 vs L107 让我做）
- 「时间家族排一行」（L92 `:17104` after／before／when＋L109 until；during 已由 L98 `:18198` 讲透，不重开）
- 「收口传统」（四代先例 L54/L78/L94/L102——L110 零新知）

### 4.3 禁用词表（本批生产禁出现）

使役（动词）、宾语、补语、不定式、动词原形（术语形态）、第三人称单数（三单）、主谓一致、时态、从句、连词、及物/不及物、词性、主语、谓语、语序——全禁；用「口令块／后面穿原样／垫不垫板／帮手（does/doesn't）／昨天版／她他它加 -s／四张脸／等到…为止」替代。

## §5 验收标准

### 5.1 检查清单

- [ ] G1 practice ≥4 且含变体逐字题（L103 `Does your mom make you do your homework?` / L104 `Did he make you wait?` / L105 `Does she let you go?` / L106 `Does she let him play after dinner?` / L107 `Did the teacher have you come early?` / L108 `Did you get him to go with you?` / L109 `Did you wait until the rain stopped?` / L110 `Did the teacher have you come early?`）
- [ ] G2 tokens/answer 词集一致、distractors 不重复；G3 recall 三字段非空；G4 arrange/practice 展示序≠答案序
- [ ] G5 罪名枚举：8 案 tag 全落 10 枚举（不碰 comparison；**preposition 不进本批案件**——by 替换只作 L109 对比卡 ③）；每案 4 错、单 token 可修、≥1 净词
- [ ] G6 案件结构：tokenIndex 与 tokens 对齐、errors=4（新错 2＋旧错 2）、reviewed=true；#119 全回流不新增错型；G7 tagStats=10 不动（`huntService.test.ts:109`）
- [ ] **G8 展示层硬需求**：season-16（min 103, max 110）＋m18（afterLesson 110）随批上线——`grammarSeasons.ts` 在 season-15（`:48`）后追加 `{ id: "season-16", label: "第十六季 · 谁让谁做什么", hint: "妈妈让我写作业、她不让我去、老师让我来一趟——谁让谁做什么，一句话说清楚", min: 103, max: 110 }`；`GrammarPathPage.tsx` CAN_DO_MILESTONES 在 m17 后追加 m18（「我能说清谁让谁做什么」，样本句 `My mom makes me do my homework.` / `I got him to go with me.`）
- [ ] **G8-b 守门测试**：`grammarSeasons.test.ts` 四断言全绿——「最高课号 110 落区间」与「区间不重叠」（103 > 102）
- [ ] G9 orphans 纪律：8 个新案（#112–#119）全部被 L103–L110 引用（番外案名单冻结 5 个不动，`huntService.test.ts:215`）
- [ ] G10 episode 写法：L103–L110 全部汉字数字（「一百零三」…「一百一十」）
- [ ] G11 语料锁闭集：make/makes/made 只做「让某人做」（不扩 make＋形容词、不做被动）；let 只做允许（不重讲 Let's——L75 已在库）；have sb do 只做请托（不碰 have sth done）；get sb to do 只做说服；until 只做「等到…为止」（**as 只作 1 张对照卡，不单开、不进 practice；during 不重开**）；**不引入 have/get sth done、be/get used to、被动＋to、感官动词**
- [ ] **G12 cloze 逐课核验**（按生产时生效词表实跑）：L103 落 **makes（正中）**；L104 落 **made**；L105 落 **doesn't**（表内）；L106 落 **lets**（实词兜底）；L107 落 **had**；L108 落 **got**；**L109 落 waited（实词兜底——`until` 不在词表），保障句 `We waited until the movie ended.` 兜底**；L110 收口课逐句实跑登记（避免全落同一词）——**逐课须核验 variants 至少 1 句让主考点落空**
- [ ] **G-boost（硬护栏）**：**每课 contrast 6 条中至少 2 条为「带 wrongMark 的真实错卡」**（口径：`wrongMark` 非空、非 bothRight、字面词出现在 wrong 句里、可定位）；推荐 3 条；**禁止贴线**（`grammarBoostService.test.ts:159-181` 全库逐课断言）；**`wrongMark` 不得为标点**；**`guided.spot` 的 `wrongToken` 必须与 tokens 元素逐字相等（不带尾标点）**——L96/L102 曾因 `"rain"` vs `"rain."` 不匹配致题目静默消失，本批新数据逐个核对
- [ ] G13 时长 6–8 min（8 课逐课走查；L103 8 token、L106/L108 7 token 核对上限）；G14 旧线零回归（L1–102 不动；**55 文件 685 测试全绿**＋build 通过）

### 5.2 Given/When/Then

- **G-A1** Given 学习者完成 L103 When 看对比卡 `My mom makes me to do my homework.` ❌ / `My mom makes me do my homework.` ✅ Then 能说出「口令块后面直接接动作，不垫板」，并能回忆第 74 课那句「先拿下一个最常用的」
- **G-A2** Given 学习者完成 L104 When 见 `She made a cake for me.`（L68）与 `He made me wait.` 并排 Then 能说出「同一个 made 两张脸——做蛋糕是『做』，让我等是『让』」
- **G-A3** Given 学习者完成 L105 When 看对比卡 `She doesn't lets me go.` ❌ Then 能修成 `let` 并说出「帮手替它干活，它自己穿原样」
- **G-A4** Given 学习者完成 L106 When 看 `Let me help you.` 与 `She lets him play after dinner.` Then 能说出「我请缨 vs 她放手——换人不换规矩」
- **G-A5** Given 学习者完成 L108 When 看四张脸总表 Then 能指出「只有 get 那句垫 to」，并能说出「先立规矩、这次破一次」
- **G-A6** Given 学习者在 `hunt-until-rain`（#118）遇到 `stops` When 修成 `stopped` Then 能说出「等到…为止，两边都穿昨天版」；Given 学习者在 L110 回看 7 课旧句 Then 能各自说出「这是第 N 课学的」

## §6 案件规划（8 案）

**总规则**：每案 4 错＝新错 2＋旧错 2；单 token 可修；每案 ≥1 净词；零术语话术；tag 全落 10 枚举（tagStats 固定 10 项）；reviewed: true；**必须配课**；**不碰 comparison**；**不引番外 5 案**。案件编号接批十五尾案（#111 `hunt-phone-story`）为 **#112–#119**。

| 案件 id | 配课 | 场景 | 定稿错误构成（原 → 修正（tag，新/旧）） |
|---|---|---|---|
| `hunt-mom-makes` | L103 | 家里书桌前 | ① `make` → `makes`（My mom make me…，sv_agreement，新——漏 -s）② `does` → `do`（…makes me does…，verb_form，新——后面穿原样）③ `drink` → `drinks`（He drink milk.，sv_agreement，旧错 L25）④ `apple` → `apples`（two apple，plural，旧错 L11） |
| `hunt-made-me-wait` | L104 | 街角等了半小时 | ① `make` → `made`（He make me wait.，tense，新——没换昨天版）② `waited` → `wait`（…made me waited.，verb_form，新——后面穿原样）③ `go` → `went`（Yesterday I go home.，tense，旧错 L10）④ `friend` → `friends`（with two friend，plural，旧错 L11） |
| `hunt-not-let-me` | L105 | 晚上家门口 | ① `lets` → `let`（…doesn't lets me go.，verb_form，新——帮手后穿原样）② `go` → `to go`（…let me to go.，verb_form，新——垫板）③ `was` → `were`（We was happy.，sv_agreement，旧错 L19）④ `cat` → `cats`（two cat，plural，旧错 L11） |
| `hunt-let-him-play` | L106 | 客厅饭后 | ① `let` → `lets`（She let him play.，sv_agreement，新——漏 -s）② `plays` → `play`（…him plays.，verb_form，新——后面穿原样）③ `watch` → `watches`（My brother watch TV.，sv_agreement，旧错 L25）④ `dog` → `dogs`（two dog，plural，旧错 L11） |
| `hunt-teacher-had-me` | L107 | 办公室门口 | ① `has` → `had`（The teacher has me come early.，tense，新——没换版本）② `came` → `come`（…had me came early.，verb_form，新——后面穿原样）③ `go` → `goes`（He go to school.，sv_agreement，旧错 L25）④ `book` → `books`（I have two book.，plural，旧错 L11） |
| `hunt-got-him-to` | L108 | 放学路上 | ① `go` → `to go`（I got him go with me.，verb_form，新——漏 to，反向错）② `get` → `got`（I get him to go with me.，tense，新——没换版本）③ `see` → `saw`（Yesterday I see him.，tense，旧错 L10）④ `banana` → `bananas`（two banana，plural，旧错 L11） |
| `hunt-until-rain` | L109 | 屋檐下等雨 | ① `stops` → `stopped`（…until the rain stops.，tense，新——后面没换版本）② `wait` → `waited`（I wait until the rain stopped.，verb_form，新——前面没换版本）③ `bus` → `buses`（two bus，plural，旧错 L11）④ `have` → `has`（She have a dog.，sv_agreement，旧错 L19） |
| `hunt-who-makes-who` | L110 | 一章的话摆一摆 | ① `make` → `makes`（My mom make me…，sv_agreement，旧错——**L103 回流，锚 #112**）② `lets` → `let`（…doesn't lets me go.，verb_form，旧错——**L105 回流，锚 #114**）③ `go` → `to go`（I got him go…，verb_form，旧错——**L108 回流，锚 #117**）④ `stop` → `stopped`（…until the rain stop.，tense，旧错——**L109 回流，锚 #118**） |

> **案件表纪律**：每案 4 错全部单 token 可修、tokenIndex 与 tokens 对齐（生产时逐 token 核对，**`guided.spot` 的 `wrongToken` 逐字相等**）；新错话术走 §3 负迁移表；旧错一律取自已教点（L10/L11/L19/L25），禁引入未教材料；同案两条同 tag 有先例；L110 案以本批锚复现（#112/#114/#117/#118），不新增错型。

## §7 Non-goals

- **不做** during 单开课（L98 `:18198` 已用 4 讲解＋1 ❌ 卡＋summary 讲透，单开即重复）
- **不做** as 单开课（只折 1 张对照卡；`As` 两字母在 boost 档 1 永不落空＋中文负迁移不在「当…时」义）
- **不做** have/get sth done（**整项撤出**：跨级——Murphy 中级 U46、BC 三档零课位、我方 `will have`／`have+物主+名词+PP` 双零、语义型错作不了对比卡）
- **不做** be/get used to（B1 段）；**不做** look like（维持认读）；**不做** make＋形容词／make＋名词扩展格
- **不做** 被动块并入本章（被动要垫 to，与主动不垫正面打架）
- **不做** 机制强化（boost 三档／回马枪已饱和且有测试守门）；**不做**双拱
- **案件不碰** comparison；**不加**新枚举、不改 tagStats/schema、不动 L1–102；**不引**番外 5 案
- **不做**封面池外新资产（单次池 4 张＋二用升三用 4 张，语义不符时池内互换）

## §8 开放问题

1. **四动词次序不可换的纪律**：L103–L107 必须先立「不垫板」规矩，L108 才破一次——生产时严禁在 L103–L107 提前出现 get 或 to 话术；以 L108 中段自走查点验（学生能否说出「只有 get 垫」）。
2. **made 同形干扰（做 vs 让）的隔离话术**：L104 对照卡 ④ 用 L68 `:12489` 原句并排——是否足以拆开两张脸？默认卡面明示「看它后面接什么」；走查观察「做蛋糕」误答回流。
3. **let 换锚与 L74 的分工**：L74 的 49 处 `let me` 在库、本课首次 `lets him`——两课相邻是否被感知重复？默认 L106 对比卡 ⑤ 明示「我请缨 vs 她放手」，且 L106 不重讲 Let me 用法。
4. **「先立规矩再破一次」的执行**：若前五课「不垫板」话术过强，漏 to（反向错）可能与 to 病同时抬头——默认对比卡 ① 专打漏 to，practice 兜底句 `She got me to wait.` 让 got 落空。
5. **until 的 will 病**：`*waited until the rain will stop` 是剑桥明文 ❌ 头号错，但「雨会停」直译极自然——默认 L109 对比卡 ② 单列 will 病卡；若仍高发，备选＝deepDive 加一句现成口诀。
6. **as 只作对照卡的边界**：as 仅在 L109 对比卡 ④ 出现 1 次（BC 例），不做展开、不进 practice、不进案件；生产时不得顺手加第二句。
7. **L106 `stay up late` 与 L110 取材**：`stay up late` 只作认读；若 L110 四句排一行与 L108 总表卡重复度过高，备选＝L110 改取 L104/L105/L109 各 1 句。
8. **封面单次池枯竭的后续**：本批吃完 4 张单次张（41/45/47/48）——批十七起全面三用，封面容量须在下批立项时预判。

## §9 里程碑（大章节：分两段 D1–D5 / D6–D10）

| 阶段 | 产出 | 说明 |
|---|---|---|
| M0 规格冻结 | 本 PRD 评审 | 无 P0 前置项 |
| M1 打样（D1–D2） | L103 全量 + `hunt-mom-makes` + 首玩走查 | 打样门：垫 to 卡是否被接住、makes 的 -s 是否成真考点、**G-boost ≥2 带 wrongMark 自查** |
| M2 第一段生产（D2–D5） | L104/L105/L106 + 3 案 | 每段 4 课；L104 同形干扰隔离、L105 `:13676` 转正、**L106 换锚观察（三重空白第一测）** |
| M3 第二段生产（D6–D8） | L107/L108/L109 + 3 案 | L107 对位 L103；**L108 破例＋中段自走查点（四张脸是否说清）**；L109 will 病卡 |
| M4 收口与展示层（D8–D9） | L110 + `hunt-who-makes-who` + season-16/m18 | 跨 8 课唤醒走查；四张脸收口 |
| M5 验收（D10） | §5 全量 + 路径页走查 | G5/G8/G8-b/G9/G12/G-boost 硬需求；`wrongToken` 逐字核对 |
| M6 上线观察 | 首过率、verb_form/sv 新错命中、cloze 落点（makes/lets/waited/got）、m18 触发 | 挂既有埋点；两段各观察一轮 |

## ✅ 行动清单

| # | 行动 | 负责方 | 时间窗 |
|---|------|--------|--------|
| 1 | L103 + `hunt-mom-makes` + 打样走查（不垫板话术、G-boost 自查） | 内容 | D1–D2 |
| 2 | L104/L105/L106 + 3 案（made 同形卡、`:13676` 转正、lets him 换锚） | 内容 | D2–D5 |
| 3 | L107/L108/L109 + 3 案（对位 L103；破例次序；until 卡） | 内容 | D6–D8 |
| 4 | L110 + `hunt-who-makes-who`（跨 7 课取材＋四句排一行） | 内容 | D8–D9 |
| 5 | season-16 + m18（约 10 行） | 开发 | 随批 |
| 6 | 验收 + 路径页走查（G12 逐课 cloze 实跑、G-boost 全课 ≥2 错卡、`wrongToken` 逐字核对） | 内容/开发 | D10 |
| 7 | 封面 8 张语义核对（4 张单次张＋4 张二用升三用） | 内容 | D1（随打样） |
| 8 | M6 观察 | 产品负责人 | 上线后 1–2 周 |

## ⚠️ 待确认 / 假设

- 开放问题 §8 八项（均有默认方案）
- 假设：封面 4 张单次张（cover41/45/47/48）语义可核（数析按编号间距实算、**未做图像语义核对**）；episode「一百零三…一百一十」写法（>100 已有 2 例先例）；课号 103–110 连续（`lessonService.ts:144` 缺号永久锁死，须人工核对）；**测试基线 685**（55 文件；数析记 674 为 HEAD 版，工作区已 685 全绿）；`makes/lets/waited/got/until` 是否进 cloze 词表须生产时实跑（当前 `until` 不在表内）
- 依赖：L103 依赖 L74（`:13620`/`:13690`）/L25/L16；L104 依赖 L103/L68（`:12489`）/L10；L105 依赖 L74（`:13676`）/L16；L106 依赖 L105/L74/L25；L107 依赖 L103/L16；L108 依赖 L107/L15/L74；L109 依赖 L92（`:17104`）/L97/L98；L110 依赖本批 L103–L109
- Non-goals：见 §7（during 不重开、as 只作对照卡、have sth done 整项撤出、used to/B1 段、机制强化不做）

## 📚 数据来源 & 成员产出索引

- 析客（本 PRD）；瑞思：`user-research-grammar-sixteenth-batch-2026-09-19.md`；竞析：`competitive-analysis-grammar-sixteenth-batch-2026-09-19.md`；数析：`data-audit-grammar-sixteenth-batch-2026-09-19.md`；格式基准：`prd-grammar-storytelling-2026-09-19.md`
- 正文事实核对：`grammarLessons.ts`（L10 `:1699`／`:1707`、L15 `:2610`、L16 `:2794`、L19 `:3366`、L25 `:4460`、L47 `:8509`／`:8526`、L68 `:12489`、L74 `:13604–13790`（`:13620` 话术／`:13634` ❌ Let me to help／`:13676` 半曝句／`:13690` 钩子）、L75 `:13793`／`:13876`、L92 `:17019`／`:17104`、L97 `:17967`、L98 `:18156`／`:18198`、L102 `:18920`）；`huntCases.ts`（111 案、尾案 #111 于 `:6554`；#103 格式参照 `:6202`）；`grammarSeasons.ts:48`；`GrammarPathPage.tsx`（m17 末项）；`huntService.test.ts:109`／`:215`；`grammarBoostService.test.ts:159-181`
- 红线核对：**结构真空白**（`make/makes/making` 0/0/0；`made` 4 全 L68「做」义；`let`＋宾语 50/51 全 me、L74 占 49；`let him/her/them` 0；`lets` 0；使役 `get` 0；`have+宾+动词` 0；`until/till` 0/0；`as` 连词 0）；错点 418（verb_form 93·plural 73·preposition 56·sv_agreement 53·word_order 40·tense 29·article 24·missing_be 22·run_on 14·fragment 14）；cloze R-B8 词表 147 条/146 词；**G-boost 每课 ≥2 带 wrongMark 错卡**（`wrongMark` 不得为标点、`wrongToken` 须逐字相等）；句长 ≤8 词；番外 5 案硬断言；封面 49 张/102 引用（单次 4·二用 37·三用 8）→ 本批 4＋4 混合；**55 文件 685 测试全绿**；跨源标注「B+·批十一型·中文需求驱动」（不与批十五 A 档混述）

---

> 本报告由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。
