# PRD：第十批课程 · 本领与分寸（5 课：L67–L71）

**日期**：2026-09-18 ｜ **类型**：功能规格书（PRD）｜ **成员**：析客（需求分析）
**上游输入**：批九 PRD §7/§8（缓办清单）；三研究 2026-09-18（瑞思/竞析/数析）；主理人裁决（5 课 L67–L71，条件第五课 enough 转正）

---

## 📝 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1 | 2026-09-18 | 初稿：5 课（L67–L71）+ 5 案（#76–#80），开 season-10、m12 |

## 📌 TL;DR

1. **批十＝「本领与分寸」5 课（L67–L71）**：擅长（good at）→ 买给谁（buy…for）→ 分寸两档（mind / Would you like）→ 够（enough，L66 镜像收尾）——开 season-10，总课量到 71。
2. **三笔欠账一次清**：good at 案件话术（#6 `:219`／#18 `:622`）课程零教学转正；L63 深挖卡承诺「以后再遇到新的，照样套」（`:11609`）由 buy 兑现；批九显式挂账的 offer 型 Would you like 收口。
3. **体系两处兑现**：mind 是又一个「只认名字版」的门卫（L64 名言「门卫名单还会加长」`:11798` 再兑现一次）；enough 与 L66 too…to 镜像对照，排尾缓冲。
4. **comparison 口径延续批九**：案件端继续回避（10 枚举不动）；enough 案 tag 全部走 word_order／preposition 等既有枚举。
5. **展示层硬需求**：season-10（{67,71}）+ m12（afterLesson 71）+ 5 案全部被引用——守门测试先红机制同批八/九。

## 🎯 核心结论卡片

| 项目 | 内容 |
|------|------|
| 推荐方案 | 5 课 L67–L71：good at 门牌 → buy for 家族分家 → mind 第四档 → Would you like offer 端 → enough 镜像收尾 |
| 优先级 | P1（内容生产批次）；无 P0 阻断项 |
| 预期影响 | 开 season-10；三笔欠账清零；「本领」线与「分寸」线各添收官课 |
| 资源需求 | ≈3.5–4 人日（内容 2.5 + 展示层 0.25 + 走查 0.5 + 验收 0.5） |
| 风险等级 | 中（cloze 对 Would you like 系统性抽 you、good at 句抽 am、enough 句抽 is——逐课须核验保障句；mind 应答陷阱话术须拿捏） |
| 硬性范围红线 | 课量 5 不扩不缩；一课一增量；禁用词表执行；comparison 不进案件；零枚举扩展；tagStats=10 不动；L1–66 零改动；封面池外零新资产；by（115 处）／too「也」（14 处）／much 数量义（32 处）三处同形不碰 |

---

## §1 问题陈述与批次定位

### 1.1 解决什么问题

- **「擅长」说不出口**：good at 全库课程 0 教学，只有两案话术（#6 `huntCases.ts:219`「be good at 是固定搭配」、#18 `:622`「擅长某件事用 be good at」）——话术先行了十批，课程从未补上；「我擅长画画」至今说不出。
- **「买给谁」的 for 没教过**：buy 课程 69 处（L44=58）、案件 11 处，但 **buy…for 结构全 0**（数析实读）；L63 深挖卡明牌承诺「递东西动词不止 give……以后再遇到新的，照样套」（`:11609`）——buy 就是第一个「新的」；中文「买给你」的「给你」直译成 to 是可预见的最高频错型。
- **礼貌链缺「介意」一档**：L61 Could you（第三档）已立，再婉转一档缺席——Would you mind 全库 0；且 mind 是 BC A1-A2 头牌、我方门卫体系（L64 `:11798`「门卫名单还会加长」）的最近发展区。
- **offer 端与应答链空白**：Would you like 15 处全前接 What（数析），独立型 0、应答语（Yes, please／No, thanks）0——「问要不要」和「答要不要」都还不会。
- **enough 三线全 0**：课程/案件/中文侧全无专文；L66 刚教 too heavy to carry，镜像的「够轻拿得动」缺席——比较程度链差最后一块拼图。
- **系统账**：批九三研究一致排序支持本批（竞析：跨源确凿 A1-A2 仅存 good at／mind／buy-for 三处，加挂账的 offer 端与条件第五课 enough）；上一批「缓办」的三个子项本批全数回收。

### 1.2 前置已铺完（本批直接衔接）

| 前置 | 行号 | 本批怎么用 |
|---|---|---|
| L42 `I like reading.` | `:7587` | L67 名字版通行证（like 认的名字版，at 也认） |
| L45 门卫话术 | `:8220` | L67/L69 门卫扩员（「别的动词以后一个一个遇」连开两个新窗） |
| L64 `I finished reading the book.` + 门卫承诺 | `:11712/:11798` | L67/L69 复现；「门卫名单还会加长」两课兑现两次 |
| L18 介词三词 in/on/at | `:3164` | L67 at 门牌转正（三词老规矩的 at 新岗） |
| 案件 #6/#18 good at 话术 | `huntCases.ts:219/:622` | L67 对比卡正面话术转正 |
| L63 先给谁后给什么 + 深挖卡承诺 | `:11539/:11609` | L68 复用（buy sb sth 同序）+ 承诺兑现 |
| L44 `I go to the shop to buy milk.` | `:7961` | L68 复现（buy 语境老句） |
| L11 `I bought three books.`／buyed 对照 | `:1900/:1928` | L68 复现 + 案件 tense 旧错锚点 |
| L61 `Could you help me?` | `:11155` | L69 第三档接力（第四档上岗） |
| L62 `I would like a cup of tea.`／`What would you like?` | `:11345/:11342` | L70 offer 端收口（会问「想要什么」→ 会问「要不要」） |
| L4 `What would you like?` 种子 | `:614` | L70 复现链（种子第 2 次复习） |
| L66 `It is too heavy to carry.` | `:12090/:12101` | L71 镜像对照（太重拿不动 ↔ 够轻拿得动） |
| L65 `He is as tall as me.` | `:11901/:11912` | L71 比较链邻居复习 |

### 1.3 批次定位：为什么是「本领与分寸」

批九消完最硬的情态与比较开篇；跨源确凿 A1-A2 候选只剩三处（竞析），加被显式挂账的 offer 端与条件第五课 enough——「欠账先收 → 承诺兑现 → 延伸收口 → 程度收尾」四段式正好一批装下。命名「本领与分寸」：前两课说「我有什么本事、给谁什么心意」，后三课说「话说到什么分寸、东西够不够」；五个场景（才艺角 → 礼物清单 → 值日便条 → 招待短信 → 书包便签）都落在「与人相处」一条线上，叙事可串。

## §2 拆课方案与逐课规格

### 2.1 课量决策：5 课（L67–L71）

| 方案 | 取舍 | 裁决 |
|---|---|---|
| 4 课 | 砍 L71（enough）留批十一——但三源同证真空白、与 L66 镜像现成，砍掉浪费闭环机会 | ✗ |
| **5 课** | good at → buy for → mind → Would you like → enough；各课一增量，含 1 课条件课转正（竞析原方案 L67-L70＋条件第五课） | **✓ 拍板（主理人）** |
| 6 课 | 加 much better 或 wh+to——三源后置（BC intermediate／三源无位），凑数违背证据强度纪律 | ✗ |

### 2.2 逐课规格

**L67 我擅长画画（good at + 名字版 · 门牌 at）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-67-good-at`；episode「小美的一天 六十七」；scene `campus`；cover `cover12`（单次池——原课「明天要画画」语义最近：生产时语义核对） |
| title / grammarLabel | 「我擅长画画」/「擅长 · good at + 名字版」 |
| targetSentence | `I am good at drawing.`（5 token） |
| 场景 | 美术课后的才艺角，小美把画贴上墙，同学夸她画得好 |
| 新知识点 | **只有一件**：说「擅长做某事」用 good at + 名字版——at 是它的门牌（第 18 课 in/on/at 三词的 at 新岗）；门牌后面穿名字版（drawing），和第 42/45/64 课一样走通行证 |
| 对比卡方向（6 条） | ① `I am good at draw.` ❌（`draw`）→ drawing——门牌后面穿名字版：光板进不了门（第 45 课 enjoy 老规矩；介词后原形全库首例错型）；② `I am good in drawing.` ❌（`in`）→ at——擅长用门牌 at：「在…方面」的 in 是中文惯性（第 6 课案件听过 good at `:219`，今天正面学）；③ 双正解：`I like drawing.` ✅ 并排 `I am good at drawing.` ✅（同一个名字版：喜欢也认、擅长也认——通行证换门卫不换，第 42 课复现）；④ 双正解：`I am good at math.` ✅ 并排 `I am good at drawing.` ✅（门牌后接学科直接跟、接事情穿名字版——第 18 课案件话术句正面转正）；⑤ 复习卡（L64）：`I finished reading.` ✅（名字版通行证——门卫们排队点名）；⑥ 复习卡（L18）：`My hat is in the box.` ✅（in/on/at 三词复现——at 今天有了新岗） |
| 变体方向 | 肯定 `I am good at drawing.`（cloze 落 am——主考点落空，保障口径见 G12）/ 否定 `I am not good at singing.`（noteZh：not 跟 am 走——「不擅长」）/ 疑问 `Are you good at drawing?`（noteZh：Are 搬句首——问对方擅长什么） |
| 复现题设计 | guided 复现 L42 原句 `I like reading.`（通行证接力——cloze 落 drawing，名字版有落点）；practice 第 1 题 `I am good at drawing.` + 变体逐字题 `Are you good at drawing?`；第 3 题 `She is good at math.`（案件话术句转正）；第 2 题复现 L45 原句 `I enjoy reading.` |
| 案件规划 | 新案 `hunt-good-at`「才艺角」（§6） |
| 六段要点 | 开场召回 L42/L45/L64 名字版；比喻＝「门牌 at」（擅长的事挂 at 门牌，门里穿名字版）；deepDive：at 与 in 的边界（第 18 课老规矩）；arrange ≤7 token |

**L68 买给你（buy sb sth / buy sth for sb · for 家族）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-68-buy-for`；episode「小美的一天 六十八」；scene `city`；cover `cover44`（单次池——原课「去商店买牛奶」商店场景最近：生产时语义核对） |
| title / grammarLabel | 「买给你」/「买给谁 · buy sb sth / buy sth for sb」 |
| targetSentence | `I bought a gift for my mom.`（7 token：I / bought / a / gift / for / my / mom.） |
| 场景 | 母亲节前的周末，小美在商店挑了一条围巾，回家递给妈妈说买给她的 |
| 新知识点 | **只有一件**：说「买给谁」两序都行——buy my mom a gift（先给谁后给什么，第 63 课老规矩）／buy a gift for my mom（东西在前、for 的人收尾）；**为你办的事用 for，递到手的用 to**（give it to me 第 63 课 vs buy it for my mom 今天——两家人分家） |
| 对比卡方向（6 条） | ① `I bought a gift to my mom.` ❌（`to`）→ for——买是「为你办的事」，用 for；to 是递到手的老位子（第 63 课 give it to me；to↔for 全库新配对）；② `I bought for my mom a gift.` ❌（`for my mom` 抢中间位）→ `I bought a gift for my mom.`——for 的人站最后：要么走 me the book 式（第 63 课同序）、要么东西在前 for 收尾，别插中间（两补语相撞首例）；③ 双正解：`I bought a gift for my mom.` ✅ 并排 `I bought my mom a gift.` ✅（两序都对——先给谁后给什么的老规矩今天扩到 buy）；④ 双正解（两家人对照）：`Please give the gift to me.` ✅ 并排 `I bought the gift for my mom.` ✅（递到手 to／为你办 for——一字之差两家人）；⑤ 复习卡（L44）：`I go to the shop to buy milk.` ✅（去商店买东西——buy 的老句子）；⑥ 复习卡（L63）：`Please give me the book.` ✅（先给谁后给什么——今天 buy 也走这套） |
| 变体方向 | 肯定 `I bought a gift for my mom.`（cloze 落 bought——数析「正中」幸运落点）/ 否定 `I didn't buy a gift for my mom.`（noteZh：昨天的「没买」用 didn't + 原形 buy——bought 退回原样）/ 疑问 `Did you buy a gift for your mom?`（noteZh：Did 搬句首，buy 穿原样） |
| 复现题设计 | guided 复现 L63 原句 `Please give me the book.`（先给谁后给什么起点）；practice 第 1 题 `I bought a gift for my mom.` + 变体逐字题 `Did you buy a gift for your mom?`；第 3 题复现 L44 原句 `I go to the shop to buy milk.` |
| 案件规划 | 新案 `hunt-gift-list`「礼物清单」（§6） |
| 六段要点 | 开场 L63 先给谁后给什么；比喻＝「to 递到手、for 为你办」（两家人分家）；deepDive：bought 的昨天版（第 11 课 buyed 对照 `:1928` 再点）+ 两序互换练习；arrange ≤7 token |

**L69 你介意吗（Would you mind…? · 礼貌第四档）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-69-mind`；episode「小美的一天 六十九」；scene `campus`；cover `cover39`（单次池——原课「那个戴眼镜的男生」教室场景：生产时语义核对） |
| title / grammarLabel | 「你介意吗」/「客气第四档 · Would you mind + 名字版」 |
| targetSentence | `Would you mind opening the window?`（6 token：Would / you / mind / opening / the / window?） |
| 场景 | 午后的教室闷得慌，小美朝靠窗的同桌开口，请她开个窗 |
| 新知识点 | **只有一件**：请人做事最婉转的一档——Would you mind + 名字版（mind opening）；比 Could you 再软一层（第 61 课第三档 → 今天第四档）；mind 也是「只认名字版」的门卫（第 64 课「门卫名单还会加长」再兑现） |
| 对比卡方向（6 条） | ① `Would you mind open the window?` ❌（`open`）→ opening——mind 的门只认名字版：光板进不了门（第 64 课 finish 老规矩）；② `Would you mind to open the window?` ❌（去掉 `to`）→ opening——垫板对门卫不管用（去掉 to 型先例 #70/#71/#73）；③ 双正解：`Could you open the window?` ✅ 并排 `Would you mind opening the window?` ✅（第三档、第四档都对——直接请、婉转请，看交情挑）；④ 对比卡（应答陷阱）：`Yes.` ❌（想答「好的」）→ `Of course not.`——被这么问，答应说的是「当然不介意」：Yes 出口反而成了「我介意」；⑤ 复习卡（L61）：`Could you help me?` ✅（第三档复现——今天升到第四档）；⑥ 复习卡（L64）：`I finished reading the book.` ✅（名字版通行证——门卫名单又添一位） |
| 变体方向 | 肯定 `I don't mind opening the window.`（noteZh：自己说不介意：don't mind + 名字版）/ 否定 `I don't mind at all.`（noteZh：一点不介意——at all 收尾加满）/ 疑问 `Do you mind opening the window?`（noteZh：Do 开头也常听到，口气比 Would you mind 直接一点；**cloze 落 Do＝幸运落点句**） |
| 复现题设计 | guided 复现 L61 原句 `Could you help me?`（第三档接力）；practice 第 1 题 `Would you mind opening the window?` + 变体逐字题 `Do you mind opening the window?`；第 3 题复现 L64 原句 `I finished reading the book.`（门卫家族点名） |
| 案件规划 | 新案 `hunt-mind-note`「值日便条」（§6） |
| 六段要点 | 开场召回 L61 第三档；比喻＝「第四档上岗」（再婉转一层）＋门卫名单再填一位；deepDive：应答链（Of course not＝不介意；Sure／No problem 也通）＋ Yes 陷阱；arrange ≤7 token |

**L70 要不要（Would you like…? · offer 型 + 应答链）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-70-would-you-like`；episode「小美的一天 七十」；scene `mansion`；cover `cover46`（单次池——原课「一句话，两种搭档」家中场景：生产时语义核对） |
| title / grammarLabel | 「要不要」/「提供 · Would you like…? + Yes, please / No, thanks」 |
| targetSentence | `Would you like some tea?`（5 token：Would / you / like / some / tea?） |
| 场景 | 表妹来家里玩，小美拎着小茶壶，问她要不要来点茶 |
| 新知识点 | **只有一件**：问对方「要不要」——Would you like + 东西（招待、分零食都靠它）；回答成对：要就说 Yes, please.；不要就说 No, thanks.（第 62 课会问「想要什么」，今天会问「要不要」+ 两句体面回答；不重教 would like 本体） |
| 对比卡方向（6 条） | ① `Would you like to some tea?` ❌（去掉 `to`）→ some tea——东西直接跟上、不垫板（第 62 课老规矩同型；去掉 to 先例 #70/#71/#73）；② `Do you like some tea?` ❌（`Do`）→ Would——想提供却问成「你爱不爱喝茶」：「要不要」用 Would you like，「爱不爱」才是 Do you like；③ 双正解（问答链）：`Would you like some tea?` ✅ 并排 `Yes, please.` ✅（问要不要＋答「要，谢谢」——成对出场）；④ 双正解：`Do you want some tea?` ✅ 并排 `Would you like some tea?` ✅（两档都对——熟人直接问 want、招待客人用 Would you like 更体面）；⑤ 复习卡（L62）：`I would like a cup of tea.` ✅（会答「想要」——今天会把问句递出去）；⑥ 复习卡（L4）：`What would you like?` ✅（种子第 3 次复现：想要什么 → 要不要，两条问法都熟） |
| 变体方向 | 肯定 `Yes, please.`（noteZh：要就说——please 让答得周全）/ 否定 `No, thanks.`（noteZh：不要就说——thanks 让拒绝也体面）/ 疑问 `Would you like some tea?`（主句；另备保障句 `Would you like to have some tea?` 空 have＝幸运落点） |
| 复现题设计 | guided 复现 L62 原句 `What would you like?`；practice 第 1 题 `Would you like some tea?` + 变体逐字题 `Would you like to have some tea?`（cloze 落 have）；第 3 题复现 L62 原句 `I would like a cup of tea.`（问答两向串线） |
| 案件规划 | 新案 `hunt-tea-invite`「招待短信」（§6） |
| 六段要点 | 开场「会问想要什么 → 今天会问要不要」；比喻＝「端到人前的问法」（口吻比 Want 软）；deepDive：应答成对 Yes, please / No, thanks + 不重教 would like 本体；arrange ≤7 token |

**L71 够轻拿得动（enough · L66 镜像收尾）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-71-enough`；episode「小美的一天 七十一」；scene `island`；cover `cover17`（单次池——原课「更大、更好、更快」比较语义最近：生产时语义核对） |
| title / grammarLabel | 「够轻拿得动」/「够 · enough 站词后」 |
| targetSentence | `The bag is light enough to carry.`（7 token：The / bag / is / light / enough / to / carry.） |
| 场景 | 春游出门前，小美把背包往妹妹肩上一放，掂了掂说这包不沉、背得动 |
| 新知识点 | **只有一件**：说「够」用 enough——它站形容词后面（light enough）；后半段接 to + 动作收尾（to carry）；和第 66 课镜像：too heavy to carry（太重拿不动）↔ light enough to carry（够轻拿得动）——一个字换面。名词前的 enough money 只做认读（不主攻） |
| 对比卡方向（6 条） | ① `The bag is enough light to carry.` ❌（`enough` 抢前面）→ `The bag is light enough to carry.`——enough 站词后面，和中文「够轻」的「够」在前不一样；② 双正解（镜像卡）：`It is too heavy to carry.` ✅ 并排 `The bag is light enough to carry.` ✅（太重拿不动 ↔ 够轻拿得动——第 66 课镜像，翻个面就对）；③ `The bag is light enough for carry.` ❌（`for`）→ to——后面接动作是老垫板 to；for 是「为你办」家的人（第 68 课刚分家）；④ 双正解：`We have enough money.` ✅ 并排 `He is old enough.` ✅（enough 两处岗：名词前 money、词后 old——今天主攻词后，名词前认读）；⑤ 复习卡（L66）：`It is too heavy to carry.` ✅（镜像的另一面）；⑥ 复习卡（L65）：`He is as tall as me.` ✅（比较链邻居——一样、太、够三家排队站好） |
| 变体方向 | 肯定 `The bag is light enough to carry.`（cloze 落 is——主考点靠 rebuild 覆盖，见 G12）/ 否定 `The bag is not light enough.`（noteZh：不够轻——not 跟 is 走；后段可省）/ 疑问 `Is the bag light enough to carry?`（noteZh：Is 搬句首——问背不背得动） |
| 复现题设计 | guided 复现 L66 原句 `It is too heavy to carry.`（镜像起点）；practice 第 1 题 `The bag is light enough to carry.` + 变体逐字题 `Is the bag light enough to carry?`；第 3 题 `I have enough money.`（cloze 落 have＝保障句）；第 2 题复现 L65 原句 `He is as tall as me.` |
| 案件规划 | 新案 `hunt-enough-bag`「书包便签」（§6） |
| 六段要点 | 开场 L66 像面镜子摆出来；比喻＝「够站后面」（中文的「够」在前，英语的 enough 在后）；deepDive：enough to 与 too…to 镜像对照 + enough money 认读一句；arrange ≤7 token |

## §3 中文负迁移处理专章

| 干扰 | 典型错 | 话术方向 | 归入 |
|---|---|---|---|
| 「擅长游泳」动词直跟 | \*I am good at swim.／\*She is good at to swim. | 「门牌后面穿名字版：at swimming——光板和垫板都进不了门」 | 对比卡 L67 第 1 条 |
| 「在…方面」的 in 惯性 | \*I am good in math.／\*good in drawing | 「擅长用门牌 at——in 是中文『在…方面』的惯性」（案件 #6/#18 已预收，本课正面转正） | 对比卡 L67 第 2 条 |
| 「买给你」直译成 to | \*I bought a gift to you.／\*Buy a book to me. | 「递到手用 to、为你办用 for：给你买的礼物用了心思，用 for」 | 对比卡 L68 第 1 条 |
| for 短语挡在东西前 | \*I bought for you a gift. | 「两序择一：先给谁后给什么、或东西在前 for 收尾——for 的人别插中间」 | 对比卡 L68 第 2 条 |
| 门卫前垫板惯性 | \*Would you mind to open the window? | 「mind 的门和 enjoy/finish 一样只认名字版，不垫板」 | 对比卡 L69 第 2 条 |
| 中文「好的」直答 Yes | \*Yes.（答 Would you mind 时） | 「问的是『介意吗』：答应说 Of course not（当然不介意）——Yes 出口就是『我介意』」 | 对比卡 L69 第 4 条 |
| 「要不要」与「爱不爱」不分 | \*Do you like some tea?（想提供时） | 「提供用 Would you like；Do you like 问的是平时的口味」 | 对比卡 L70 第 2 条 |
| 提供句垫板复用 | \*Would you like to some tea? | 「东西直接跟、不垫板；垫板留给动作（to have）」 | 对比卡 L70 第 1 条 |
| 中文「够」抢到词前 | \*The bag is enough light. | 「中文的『够』在前面，英语的 enough 站后面：light enough」 | 对比卡 L71 第 1 条 |
| 「钱不够」错后置 | \*I don't have money enough. | 「名词前的老位子：enough money（认读级——先记词后那句）」 | 对比卡 L71 第 4 条 |
| 后段误用 for | \*light enough for carry | 「后半段接动作要垫 to：enough to carry——for 是『为你办』家的人」 | 对比卡 L71 第 3 条 |

## §4 叙事设计专章

### 4.1 叙事草案（逐字采用）

> **「本领与分寸」——把本事说得出口，把心意送得到位。**
> 擅长：like drawing（第 42 课名字版）→ good at drawing（门牌 at 今天挂上门）——案件里听过两回的话，今天会说。
> 给她买：给我一本书＝give me a book（第 63 课先给谁后给什么）→ buy my mom a gift（同一套）；递到手用 to、为你办用 for（今天分家）。
> 婉转请：「Close the door, please」（第 32 课）→ Could you…?（第 61 课）→ Would you mind…?（今天第四档）。
> 招待：What would you like?（第 4 课种子、第 62 课）→ Would you like some tea? ＋ Yes, please / No, thanks（今天会问也会答）。
> 够与不够：「太重了拿不动」用 too heavy to carry（第 66 课）→「够轻拿得动」用 light enough to carry（今天）——一面镜子翻过来。

### 4.2 复用体系（不造新比喻）

- 「门牌」（L18 三词的 at 新岗——L67；L68 for 同族命名）
- 「名字版通行证」（L42/L45/L64——L67 门牌后 / L69 新门卫）
- 「门卫名单还会加长」（L64 `:11798`——L67/L69 两课各兑现一次）
- 「先给谁、后给什么」（L63——L68 扩到 buy）
- 「礼貌档位」（L32 三档 → L61 第三档 → L69 第四档 / L70 招待口吻）
- 「太…了装不下」镜像（L66——L71 反面「够站后面」）
- 「两家人」命名法（L65 一样家/更家——L68 to 家/for 家沿用）

### 4.3 禁用词表（本批生产禁出现）

介词、动名词、非谓语、不定式、形容词、副词、程度副词、比较级、最高级、宾语、双宾语、主谓一致、时态（13 词全禁——用「门牌/名字版/通行证/门卫/先给谁后给什么/为你办递到手/够站后面/第四档」替代）。

## §5 验收标准

### 5.1 检查清单

- [ ] G1 practice ≥4 且含变体逐字题（示例：L67 `Are you good at drawing?` / L68 `Did you buy a gift for your mom?` / L69 `Do you mind opening the window?` / L70 `Would you like to have some tea?` / L71 `Is the bag light enough to carry?`）
- [ ] G2 tokens/answer 词集一致、distractors 不重复
- [ ] G3 recall 三字段非空
- [ ] G4 arrange/practice 展示序≠答案序
- [ ] G5 罪名枚举：5 案 tag 全落 10 枚举（预期 verb_form/word_order/preposition/plural/tense）；**本批不碰 comparison**
- [ ] G6 案件结构：tokenIndex 对齐、errors=4（新错 2 + 旧错 2）、单 token 可修、≥1 净词、reviewed=true
- [ ] G7 tagStats=10 不动（`huntService.test.ts:109`）
- [ ] **G8 展示层硬需求**：season-10（min 67, max 71）+ m12（afterLesson 71）随批上线——`grammarSeasons.ts` 追加 `{ id: "season-10", label: "第十季 · 本领与分寸", hint: "擅长什么、买给谁、把话说得有分寸、东西够不够——本事说出口，心意送到位", min: 67, max: 71 }`；`GrammarPathPage.tsx` CAN_DO_MILESTONES 追加 m12（标题「我能说擅长、买给谁和够不够」，样本句三课核心句：`I am good at drawing.` / `Would you like some tea?` / `The bag is light enough to carry.`）
- [ ] **G8-b 守门测试**：`grammarSeasons.test.ts` 四断言全绿——「最高课号 71 落区间」与「区间不重叠」（67 > 66）
- [ ] **G9 orphans 纪律**：5 个新案（#76–#80）全部被 L67–L71 引用（番外案名单冻结 5 个不动）
- [ ] G10 episode 写法：L67–L71 全部汉字数字（「小美的一天 六十七」…「七十一」）
- [ ] G11 语料锁闭集：good at 只用「擅长」型（不引 good for）；buy 型只用 buy（for 家族只用 for 短语，不引 make/cook）；would 只用 Would you like 与 Would you mind（不引 I'd 缩读）；enough 主攻词后型、名词前只认读；不碰 by/to 同形（too「也」句尾不进入本批语料）
- [ ] G12 关 2 cloze：核心句空位落点确认——L67 `I am good at drawing.` 抽 am（主考点 at drawing 落空，保障句 `Are you good at drawing?` 抽 at ✅）；L68 空 bought（数析正中）；L69 `Would you mind opening…` 抽 Would（保障句 `Do you mind opening the window?` 空 Do＝幸运落点）；L70 `Would you like some tea?` 抽 you（**系统性失手**，保障句 `Would you like to have some tea?` 空 have）；L71 `The bag is light enough…` 抽 is（落空，保障句 `I have enough money.` 空 have）——生产时逐课预演确认题干可读
- [ ] G13 时长 6–8min；G14 旧线零回归（L1–66 不动；测试全绿 + build 通过）

### 5.2 Given/When/Then

- **G-A1** Given 学习者完成 L67 When 看对比卡 `I like drawing.` ✅ / `I am good at drawing.` ✅ Then 能说出「名字版是通行证，换门卫不换通行证」
- **G-A2** Given 学习者在 `hunt-good-at` 遇到 `*good at draw` When 修 `draw` Then 句子全对，并能说出「门牌后面穿名字版」
- **G-A3** Given 学习者完成 L68 When 看对比卡 `Please give the gift to me.` ✅ / `I bought the gift for my mom.` ✅ Then 能说出「递到手用 to、为你办用 for」
- **G-A4** Given 学习者完成 L69 When 看对比卡 `Yes.` ❌ / `Of course not.` ✅ Then 能说出「问的是介意吗——答应要说 Of course not」
- **G-A5** Given 完成 L70 首日 When 看对比卡 `Do you like some tea?` ❌ / `Would you like some tea?` ✅ Then 能说出「提供用 Would you like」
- **G-A6** Given 学习者完成 L71 When 看镜像卡 `It is too heavy to carry.` ✅ / `The bag is light enough to carry.` ✅ Then 能说出「够站词后面——中文的够在前，英语的够在后」

## §6 案件规划（5 案）

**总规则**：每案 4 错 = 新错 2 + 旧错 2；单 token 可修；每案 ≥1 净词；零术语话术；tag 全落 10 枚举（tagStats 固定 10 项）；reviewed: true；**必须配课**；**不碰 comparison**。案件编号接批九尾号（#75 hunt-moving-day-note）为 **#76–#80**。

| 案件 id | 配课 | 场景 | 定稿错误构成（原 → 修正（tag，新错/旧错）） |
|---|---|---|---|
| `hunt-good-at` | L67 | 才艺角 | ① `draw` → `drawing`（verb_form，新错——门牌后原形首例；先例 #44/#53 垫板口径反向）；② `in` → `at`（preposition，新错——#6/#18 同型转正）；③ `picture` → `pictures`（plural，旧错——two pictures 复现；先例 plural 41 处）；④ `on` → `in`（preposition，旧错——in the morning 复现 L18） |
| `hunt-gift-list` | L68 | 礼物清单 | ① `to` → `for`（preposition，新错——to↔for 新配对；先例 #74 than→as）；② for 短语挪位（*bought for my mom a gift → 去掉/合并）（word_order，新错——两补语相撞首例）；③ `buyed` → `bought`（tense，旧错——L11 `:1928` 已教对照；先例 #17 stop→stopped）；④ `gift` → `gifts`（plural，旧错——two gifts 复现） |
| `hunt-mind-note` | L69 | 值日便条 | ① `open` → `opening`（verb_form，新错——门卫只认名字版；先例 #73 read→reading 同族）；② 删除型 `to`（*mind to open → 去掉 to）（verb_form，新错——去掉 to 型先例 7 处 #70/#71/#73 等）；③ `window` → `windows`（plural，旧错——two windows 复现）；④ `in` → `on`（preposition，旧错——on the desk 复现 L26） |
| `hunt-tea-invite` | L70 | 招待短信 | ① `likes` → `like`（verb_form，新错——#71 同型 would likes→like 口径回收）；② `to` → 删除（*Would you like to some tea → 去掉 to）（verb_form，新错——#70/#71 去掉 to 型；垫板空挂零先例首案）；③ `cup` → `cups`（plural，旧错——two cups 复现）；④ `at` → `in`（preposition，旧错——in the afternoon 复现 L18） |
| `hunt-enough-bag` | L71 | 书包便签 | ① `enough` 抢词前（*enough light → light enough）（word_order，新错——先例 #75 very→too 同岗）；② `for` → `to`（preposition，新错——enough to carry；与 L68 分家反向对照）；③ `bag` → `bags`（plural，旧错——two bags 复现）；④ `heavy` → `heavier`（verb_form，旧错——第 17/65 课比较词形系；先例 #74 taller→tall） |

> **案件表纪律**：每案 4 错全部单 token 可修、tokenIndex 与 tokens 对齐（生产时逐 token 核对）；新错话术走 §3 负迁移表「话术方向」列；旧错一律取自 L6/L11/L17/L18/L26/L61–66 已教点，禁引入未教材料。

## §7 Non-goals

- **不做** much better／far（认读级不单开课——BC intermediate、中文侧 far 未收；留批十一窗口）
- **缓办** wh+to（三源无教学位，须先过自研评审——维持批九判定）
- **不立项** keep+doing（BC/Murphy 双无单元，单源不立课）；**缓办** stop 变义对（一源有课，句子义靠语境）
- **不立项** 交通方式（词块非语法点；by 全库 115 处含 L52–54 被动义，隔离成本高）
- **冻结** may/might（L56 撞词隔离期）；**不进** 附加疑问（B1-B2 既定）；**不做** 深水区（虚拟语气、倒装、非谓语进阶）
- **案件不碰 comparison**（统计口径 10 项不动；延续批九 §8-① 默认）
- **不加**新枚举、不改 tagStats、不改 schema、不动 L1–66
- **不做**封面池外新资产（5 课全部从单次池 32 张选）
- **不做** would like 本体重教（L70 只做 offer 型与应答链）；**不做** I'd 缩读（批九 §8-② 口径延续）
- **不做** L71 名词前 enough 主攻（认读级一句带过，不与主考点抢对比卡）

## §8 开放问题

1. **comparison 统计口径延续**：批九 §8-① 默认「不动」——本批 5 案全部走既有 10 枚举（enough 案刻意避开 comparison）；统计扩展继续挂起，由课程端补教学支撑
2. **much better 认读位**：留批十一不单开课；本批是否在 L71 deepDive 带一句——默认：**不带**（与 much 数量义 32 处隔离，不引入新同形）
3. **mind 应答陷阱设计口径**：对比卡第 4 条（Yes 陷阱）只做「答应说什么」正向引导，是否加「若真介意怎么说」（Sorry, I'm afraid…超出本课句式）——默认：**不加**，只收 Of course not 一侧
4. **L71 名词前 enough 认读边界**：对比卡第 4 条并排 `We have enough money.` 是否入 examples——默认：**入 examples 一句**、对比卡保持 6 条；生产时若有拼挤可降 sceneSwings
5. **L69 两种问法（Would/Do you mind）同课带出**：Do you mind 变体是否升为对比卡——默认：**维持变体级**（一课一增量；Would 为主考点）
6. **封面语义核对**：5 张（cover12/cover44/cover39/cover46/cover17）生产时逐张核；不匹配换单次池语义近者（32 张余量充足）

## §9 里程碑（粗略，正式排期归路径）

| 阶段 | 产出 | 说明 |
|---|---|---|
| M0 规格冻结 | 本 PRD 评审 | 无 P0 前置项 |
| M1 打样 | L67 全量 + hunt-good-at + 首玩走查 | 重点：门牌话术可懂性、cloze 抽 am 落空核验 |
| M2 生产 | L68–L71 + 4 案 + season-10/m12 展示层 | ≈2.5 人日 |
| M3 验收 | §5 全量 + 路径页走查 | G8/G8-b/G9 硬需求 |
| M4 上线观察 | 首过率、good at／for-to 新错型命中率、cloze 落点、m12 触发 | 挂既有埋点；F9-B 数据与 L71 观察对齐（不互锁） |

## ✅ 行动清单

| # | 行动 | 负责方 | 时间窗 |
|---|------|--------|--------|
| 1 | L67 + hunt-good-at + 走查 | 内容 | D1–D2 |
| 2 | L68 + hunt-gift-list | 内容 | D2–D3 |
| 3 | L69–L70 + 2 案 | 内容 | D3–D5 |
| 4 | L71 + hunt-enough-bag | 内容 | D5–D6 |
| 5 | season-10 + m12（约 10 行） | 开发 | 随批 |
| 6 | 验收 + 路径页走查（守门测试四断言） | 内容/开发 | D7 |
| 7 | M4 观察 | 产品负责人 | 上线后 1–2 周 |

## ⚠️ 待确认 / 假设 / Non-goals

- 开放问题 §8 六项（均有默认方案）
- 假设：单次封面池 32 张中语义近者充足（本批仅取 5 张）；单次池经本批消耗后余 27 张，够批十一（6 课预估）
- 依赖：L67 依赖 L42/L45/L64（名字版门卫链）；L68 依赖 L63/L44/L11；L69 依赖 L61/L64；L70 依赖 L62/L4；L71 依赖 L66/L65
- Non-goals：见 §7（含 comparison 统计口径备注）

## 📚 数据来源 & 成员产出索引

- 析客（本 PRD）；瑞思：`user-research-grammar-tenth-batch-2026-09-18.md`；竞析：`competitive-analysis-grammar-tenth-batch-2026-09-18.md`；数析：`data-audit-grammar-tenth-batch-2026-09-18.md`
- 正文事实核对：`grammarLessons.ts`（L42 `:7587`、L44 `:7961`、L45 `:8220`、L62 `:11342/:11345`、L63 `:11539/:11609`、L64 `:11712/:11798`、L65 `:11912`、L66 `:12090/:12101`、L4 `:614`、L11 `:1900/:1928`、L18 `:3164`、L61 `:11155`）；`huntCases.ts:219/:622`（#6/#18 good at 话术）、`:2981`（#71 would likes 先例）、`:3157`（#75 尾号）；`grammarSeasons.ts:36`；`GrammarPathPage.tsx:184`；`grammarAmbushService.ts:154`（cloze 抽词表 24 词）

---

> 本报告由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。
