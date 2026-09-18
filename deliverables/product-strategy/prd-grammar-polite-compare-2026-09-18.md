# PRD：第九批课程 · 客气与程度（6 课：L61–L66）

**日期**：2026-09-18 ｜ **类型**：功能规格书（PRD）｜ **成员**：析客（需求分析）
**上游输入**：批八 PRD §7/§8（四项留批九 + comparison 悬空挂账）；三研究 2026-09-18（瑞思/竞析/数析）；主理人裁决（6 课 L61–L66）

---

## 📝 修订记录

| 版本 | 日期 | 变更 |
|---|---|---|
| v1 | 2026-09-18 | 初稿：6 课（L61–L66）+ 6 案（#70–#75），开 season-9 |

## 📌 TL;DR

1. **批九＝「客气与程度」6 课（L61–L66）**：请人帮忙说客气（could/would like）→ 东西递到手（give）→ 事情说到收尾（finish）→ 大小说到一样与太过（as…as / too…to）——开 season-9，总课量到 66。
2. **两笔显式欠账回收**：L32「礼貌三档」的 Could you 档（`:5818`）与 L4 `What would you like?`（`:614`）种子转正；L45「别的动词以后一个一个遇」（`:8137`）兑现第一站（finish）。
3. **comparison 悬空处置**：课程端由 L65/L66 补教学支撑；案件端**全部回避 comparison**（走 verb_form/word_order/preposition 等 10 枚举）；统计口径是否同步扩展挂 §8 开放问题（默认不动）。
4. **展示层硬需求**：season-9（{61,66}）+ m11（afterLesson 66）+ 6 案全部被引用——守门测试先红机制同批八。
5. **Non-goals**：enough、much better、may/might、keep 深化、wh-+to、介词+doing、交通方式、附加疑问、深水区——全部不进本批（详见 §7）。

## 🎯 核心结论卡片

| 项目 | 内容 |
|------|------|
| 推荐方案 | 6 课 L61–L66：could 请求 → would like → give 双宾 → finish 收尾 → as…as → too…to |
| 优先级 | P1（内容生产批次）；无 P0 阻断项 |
| 预期影响 | 开 season-9；收回两笔显式欠账；比较进阶开篇（「太贵了」迂回表达解锁） |
| 资源需求 | ≈4–4.5 人日（内容 3 + 展示层 0.25 + 走查 0.5 + 验收 0.5） |
| 风险等级 | 中（too 同形存量 17 处须位置对照；as…as 双 as 结构 cloze 主考点零空位；could 课 cloze 落 you 的系统性失手须核验） |
| 硬性范围红线 | 课量 6 不扩不缩；一课一增量；禁用词表执行（情态动词/助动词/宾语/双宾语/比较级/程度副词等 13 词全禁）；comparison 不进案件；零枚举扩展；tagStats=10 不动；L1–60 零改动；封面池外零新资产 |

---

## §1 问题陈述与批次定位

### 1.1 解决什么问题

- **「不会客气」**：想请人帮忙只有 Can you（L14 学的是「我要什么」Can I have）；Could you…? 在 L32 深挖卡出现过（`:5818`）但从未产出——问路、求助、请人做事缺最得体的一档。
- **「想要」只有一档口气**：L4 的 `I want…` 直白；`would like`（更客气）对白种子 `What would you like?`（`:614`）挂了 57 课未产出——招待客人、点单场景说不出体面话。
- **「给」的语序从未教**：give 在案件曝光 8 处（#22/#56 等）、课程 0——「给我一本书」中文语序恰好正迁移（give me a book），但「东西变 it」要绕到 to 后面（give it to me）无人点破。
- **「收尾动词」缺口**：L45 立了「enjoy 的门只开一扇」（`:8137`），当时承诺「别的动词以后一个一个遇」——finish + 名字版（I finished reading）是兑现第一站；「我做完啦/我看完了」是日常收尾口。
- **「一样、太贵」说不出**：as…as / too…to 全库 0（数析实读）——「和你一样高」「太贵了买不起」只能迂回（very expensive），这是批八审计列明的比较进阶缺口。
- **系统账**：comparison 罪名按钮可见（11 项渲染）却 69 案零使用（`huntService.ts:16` vs `:331`）——批八 §7 挂账「挂批九一并解决」；本批课程端补教学支撑，案件端回避（口径挂账见 §7/§8）。

### 1.2 前置已铺完（本批直接衔接）

| 前置 | 行号 | 本批怎么用 |
|---|---|---|
| L32 礼貌三档 + could 彩蛋 | `:5818` | L61 第三档转正（「最客气」正式上岗） |
| L32 对白 `The wind is too strong.` | `:5763` | L66 种子转正（too 的第一句从听懂到会说） |
| L4 `What would you like?` | `:614` | L62 主叙事句（会问 → 会答） |
| L14 `Can I have a milk tea?` | `:2437` | L61 复现对照（要东西也能换客气档） |
| L45 enjoy 门卫话术 | `:8137/:8148` | L64「收尾动词也开一扇门」体系延伸 |
| L42 `I like reading.` | 7587 | L64 名字版复现（同名搭档换门卫） |
| L17 `This boat is bigger than that one.` | 2988 | L65 复现对照（更…than vs 一样…as 两家人） |
| L31 `I want the biggest apple.` | 5566 | L65 复习卡（the 家族） |
| L33 `This one is mine.` | 5931 | L65 me/mine 分界复习（`as tall as me` 里的 me） |
| L26 `There is a book on the desk.` | 4646 | L63 场景句（book 递手边） |
| L16 must / L47 should 家族 | 2805 / `:8526` | L61「家族不垫板」话术复用 |

### 1.3 批次定位：为什么是「客气与程度」

批八填完日期/副词/存在句过去版（跨源 A1-A2 四点共识空白剩情态），批九接棒填「情态补完（could/would）」与「比较进阶开篇（as…as/too）」——两者都是跨源「现在没课＝真空白」候选（竞析实读：BC modal-verbs 参考页 beginner、Murphy U30/U34 情态前排；as…as 为提前课）。中间以 give（BC beginner + Duo 技能 14）与 finish（BC A1-A2 头牌 mind 同族）过渡——「给与请」是同一个社交场景的两端，场景能串成一线（请人帮忙 → 招待 → 递东西）。

## §2 拆课方案与逐课规格

### 2.1 课量决策：6 课（L61–L66）

| 方案 | 取舍 | 裁决 |
|---|---|---|
| 4 课 | 砍 B/C（would like、give）留批十——但两者跨源证据最硬（BC beginner 直标），砍掉浪费证据强度 | ✗ |
| **6 课** | could→would-like→give→finish→as…as→too…to；各课一增量，规模与前批对齐 | **✓ 拍板（主理人）** |
| 8 课 | 加 enough、much better——瑞思/竞析一致「缓办」（BC 压 B1-B2、中文侧无专文） | ✗ |

### 2.2 逐课规格

**L61 能帮我一下吗（could 请求 · Could you…?）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-61-could-you`；episode「小美的一天 六十一」；scene `city`；cover `cover31`（单次池——街景课先例：生产时语义核对） |
| title / grammarLabel | 「能帮我一下吗」/「客气请求 · Could you…?」 |
| targetSentence | `Could you help me?`（4 token） |
| 场景 | 街角，小美抱着一摞书腾不出手，请路人帮她按电梯 |
| 新知识点 | **只有一件**：请人帮忙的客气档——Could you + 动词原形；它比 Can you 更客气（第 32 课礼貌三档的第三档正式上岗）；could 也是不变词（后面穿原样、不垫 to） |
| 对比卡方向（6 条） | ① `Could you to help me?` ❌（`to`）→ Could you help me?——家族不垫板（第 47 课老规矩）；② `Could you helping me?` ❌（`helping`）→ help——穿原样不换 -ing；③ 双正解对照：`Can you help me?` ✅ 并排 `Could you help me?` ✅（两种口气都对：can 直接、could 更客气——第 32 课的三档变四档）；④ 双正解：`Could you close the door?` ✅ 并排 `Close the door, please.` ✅（请人做事两档都对，看场合挑）；⑤ 复习卡（L32）：`Close the door, please!` ✅（三档第一档复现）；⑥ 复习卡（L14）：`Can I have a milk tea?` ✅（要东西的问句——今天学请人帮忙的问句，同族不同向） |
| 变体方向 | 肯定 `I could help you.`（noteZh：could 站动词前穿原样；**此句 could 在第二词位——cloze 落点保障句**）/ 否定 `Could you not close the door?`（noteZh：not 跟在 you 后，常见说法）→ 生产时定稿 / 疑问（本课主句即疑问）`Could you help me, please?`（noteZh：加 please 再软一档） |
| 复现题设计 | guided 复现 L32 原句 `Close the door, please!`（三档起点）；practice 第 1 题 `Could you help me?` + 变体逐字题 `I could help you.`；第 3 题复现 L14 原句 `Can I have a milk tea?` |
| 案件规划 | 新案 `hunt-help-note`「求助便条」（§6） |
| 六段要点 | 开场召回 L32 礼貌三档；比喻＝「第三档正式上岗」；deepDive：could 家族两班岗（请求 could you / 过去能力认读级一句带过）；arrange ≤7 token |

**L62 你想要点什么（would like · 客气想要）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-62-would-like`；episode「小美的一天 六十二」；scene `mansion`；cover `cover32`（单次池——招待场景：生产时语义核对） |
| title / grammarLabel | 「你想要点什么」/「客气想要 · would like」 |
| targetSentence | `I would like a cup of tea.`（7 token：I / would / like / a / cup / of / tea.） |
| 场景 | 家里来了客人，小美端出茶点招待，问客人想要什么 |
| 新知识点 | **只有一件**：想把「想要」说得客气一点——would like：I would like…（比 I want… 软一档）；问句就是第 4 课听过的 `What would you like?`——会问答全了 |
| 对比卡方向（6 条） | ① `I would like to tea.` ❌（`to`）→ `I would like a cup of tea.`——想要的东西直接跟上，不垫 to（垫板是给动作用的：would like to sleep）；② `I would likes tea.` ❌（`likes`）→ like——家族穿原样（would 家族不变形老规矩）；③ 双正解对照：`I want a milk tea.` ✅ 并排 `I would like a milk tea.` ✅（两档口气都对：want 直接、would like 客气——第 4 课的直白版 + 今天的客气版）；④ 双正解（问答链）：`What would you like?` ✅ 并排 `I would like a cup of tea.` ✅（会问 → 会答，第 4 课种子收口）；⑤ 复习卡（L4）：`What would you like?` ✅（对白种子逐字复现）；⑥ 复习卡（L16/L47）：`I must finish my homework today.` ✅（would 家族的兄弟们：must/should/would 都穿原样——家族点名） |
| 变体方向 | 肯定 `I would like a cup of tea.` / 否定 `I wouldn't like coffee.`（noteZh：wouldn't = would not；直接跟在 I 后）/ 疑问 `What would you like?`（noteZh：第 4 课听过的问法，今天会自己说了） |
| 复现题设计 | guided 复现 L4 原句 `What would you like?`；practice 第 1 题 `I would like a cup of tea.` + 变体逐字题 `What would you like?`；第 3 题复现 L14 原句（要东西场景温故） |
| 案件规划 | 新案 `hunt-guest-note`「招待清单」（§6） |
| 六段要点 | 开场「想要两档口气」对照；比喻＝「want 的客气版」（不造新比喻）；deepDive：would like to + 动作 vs would like + 东西（两用法一条线）；arrange ≤7 token |

**L63 把它递给我（give 双宾 · 先给谁、后给什么）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-63-give-me`；episode「小美的一天 六十三」；scene `campus`；cover `cover33`（单次池——校园课先例：生产时语义核对） |
| title / grammarLabel | 「把它递给我」/「给东西 · give me the book / give it to me」 |
| targetSentence | `Please give me the book.`（6 token：Please / give / me / the / book.） |
| 场景 | 手工课上，小美腾不出手，请同桌把桌上的书递过来 |
| 新知识点 | **只有一件**：给东西的语序＝先给谁、后给什么（give me the book）——中文同序（正迁移）；**东西换成 it/them 时，要绕到后面、垫上 to**（give it to me） |
| 对比卡方向（6 条） | ① `Give me it.` ❌（`me it` 相撞）→ `Give it to me.`——东西一变成 it，就要绕到后面垫 to（先给谁后给什么的规矩，碰到小词要翻个身）；② `Give the book me.` ❌（`the book me` 相撞）→ `Give me the book.`——两样东西挤一起会撞车：谁在前（me）、什么在后（the book）；③ 双正解对照：`Give me the book.` ✅ 并排 `Give the book to me.` ✅（两种说法都对——想强调「给谁」就说 the book to me；想顺口就说 me the book）；④ 双正解：`Please pass me the book.` ✅ 并排 `Please give me the book.` ✅（递东西两兄弟：pass 和 give 走同一套语序）→ 生产时以 give 定稿、pass 作认读；⑤ 复习卡（L26）：`There is a book on the desk.` ✅（桌上那本书——本课场景的旧句）；⑥ 复习卡（L14/L61）：`Can I have a milk tea?` ✅ 并排 `Could you help me?` ✅（要东西 + 请帮忙——「给与请」两向对照） |
| 变体方向 | 肯定 `Please give me the book.` / 否定 `Don't give me the book.`（noteZh：别给我——Don't + 原形，第 32 课「别做」的老规矩）/ 疑问 `Can you give me the book?`（noteZh：请人递东西的问句——L61 could 版也通，口气更软） |
| 复现题设计 | guided 复现 L26 原句 `There is a book on the desk.`（场景句）；practice 第 1 题 `Please give me the book.` + 变体逐字题 `Can you give me the book?`；第 3 题 `Please give it to me.`（it 版——本课真考点）；第 2 题复现 L61 原句 `Could you help me?` |
| 案件规划 | 新案 `hunt-handout-note`「手工作业单」（§6） |
| 六段要点 | 开场中文语序正迁移点破（「给我一本书」＝ give me a book 同序）；比喻＝「先给谁、后给什么」（东西变 it 要翻身垫 to）；deepDive：give/pass/show 同族 + it 版镜子对照；arrange ≤7 token |

**L64 我看完啦（finish + 名字版 · 门卫扩员第一站）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-64-finish-doing`；episode「小美的一天 六十四」；scene `mansion`；cover `cover34`（单次池——在家读书场景：生产时语义核对） |
| title / grammarLabel | 「我看完啦」/「收尾动词 · finish + 名字版」 |
| targetSentence | `I finished reading the book.`（5 token：I / finished / reading / the / book.） |
| 场景 | 周末晚上，小美合上刚读完的故事书，跟姐姐说「我看完啦」 |
| 新知识点 | **只有一件**：说「做完了」用 finish + 名字版（finish reading）——它和第 45 课的 enjoy 一样「只开一扇门」（只认名字版），不认 to；注意 finish 讲过去的事要穿 -ed 外套（finished） |
| 对比卡方向（6 条） | ① `I finished to read the book.` ❌（`to`）→ `I finished reading the book.`——finish 的门也开一扇：只认名字版（第 45 课 enjoy 的同类门卫）；② `I finished read the book.` ❌（`read`）→ reading——verb 光板不能进门，名字版才认；③ 双正解对照：`I finished reading the book.` ✅ 并排 `I finished the book.` ✅（都行——想说清「做的事情」就带 reading；直接说「看完书了」也完整）；④ 双正解：`I like reading.` ✅ 并排 `I finished reading.` ✅（同一个名字版 reading，门口换了守卫：like 也认、finish 也认——名字版是通行证）；⑤ 复习卡（L45）：`I enjoy reading.` ✅（enjoy 的门卫复现——今天又认识一个新门卫）；⑥ 复习卡（L21/L23）：`I have done my homework.` ✅（做完事的老说法——have done；今天说「做完」用 finish + 名字版，两条路都通） |
| 变体方向 | 肯定 `I finished reading the book.` / 否定 `I didn't finish reading the book.`（noteZh：昨天的「没做完」用 didn't + 原形 finish）/ 疑问 `Did you finish reading the book?`（noteZh：Did 站句首，finish 穿原样，reading 不动） |
| 复现题设计 | guided 复现 L45 原句 `I enjoy reading.`（门卫家族前一站）；practice 第 1 题 `I finished reading the book.` + 变体逐字题 `Did you finish reading the book?`；第 3 题复现 L42 原句 `I like reading.`（名字版通行证） |
| 案件规划 | 新案 `hunt-reading-corner`「阅读角记录」（§6） |
| 六段要点 | 开场召回 L45 门卫；比喻＝「又一个单门门卫」（finish 的门只认名字版）；deepDive：门卫名单扩充（enjoy + finish；后面还有更多一个一个遇）＋ finished 外套；arrange ≤7 token |

**L65 和你一样高（as…as · 一样）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-65-as-as`；episode「小美的一天 六十五」；scene `campus`；cover `cover35`（单次池——校园课先例：生产时语义核对） |
| title / grammarLabel | 「和你一样高」/「一样 · as tall as」 |
| targetSentence | `He is as tall as me.`（6 token：He / is / as / tall / as / me.） |
| 场景 | 体检日排队量身高的墙边，小美和同桌比个子 |
| 新知识点 | **只有一件**：说「一样」用 as…as 两头卡住（as tall as me）——两个 as 一个都不能丢；和「更…than」（第 17 课）是两家人：一样用 as…as、比下去用 than |
| 对比卡方向（6 条） | ① `He is as tall than me.` ❌（`than`）→ as…as——「一样」家不认 than（than 是「更…」家的门牌，第 17 课老规矩）；② `He is tall as me.` ❌（缺第一个 `as`，wrongMark null）→ `He is as tall as me.`——两头都要卡住：少一头，「一样」就散架；③ `He is as taller as me.` ❌（`taller`）→ tall——中间的词穿原样：加了 -er 是「更」家的人，进不了「一样」家的门；④ 双正解对照：`He is as tall as me.` ✅ 并排 `He is taller than me.` ✅（两句话都对：一句「一样高」、一句「更高」——两家人各站一边）；⑤ 复习卡（L17）：`This boat is bigger than that one.` ✅（「更…」家复现——than 家与 as 家对照）；⑥ 复习卡（L33）：`This one is mine.` ✅（认读级对照：mine 是「我的」；跟在 as 后面的用 me——第 33 课的老邻居） |
| 变体方向 | 肯定 `He is as tall as me.` / 否定 `He is not as tall as me.`（noteZh：not 跟 is 走——「不如我高」，说不「一样」的常用说法）/ 疑问 `Is he as tall as you?`（noteZh：Is 搬句首——问「他和你一样高吗」） |
| 复现题设计 | guided 复现 L17 原句 `This boat is bigger than that one.`（两家人对照）；practice 第 1 题 `He is as tall as me.` + 变体逐字题 `Is he as tall as you?`；第 3 题 `She is as smart as her sister.`（本课延伸句）；第 2 题复现 L31 原句 `I want the biggest apple.`（the 家族+比较链温故） |
| 案件规划 | 新案 `hunt-height-chart`「身高记录墙」（§6） |
| 六段要点 | 开场「更…」家 vs 「一样」家对照（L17 邻居）；比喻＝「两头卡住」（两个 as 像两只手各卡一头）；deepDive：not as…as（不如）＝说不「一样」；arrange ≤7 token |

**L66 太重了拿不动（too…to · 太…了装不下）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-66-too-to`；episode「小美的一天 六十六」；scene `city`；cover `cover36`（单次池——街景课先例：生产时语义核对） |
| title / grammarLabel | 「太重了拿不动」/「太…了装不下 · too…to」 |
| targetSentence | `It is too heavy to carry.`（6 token：It / is / too / heavy / to / carry.） |
| 场景 | 搬家日，小美想一个人搬纸箱，抬了一下发现纹丝不动 |
| 新知识点 | **只有一件**：说「太…了（所以）不能…」用 too + 词 + to + 动作：too heavy to carry——一条句子就把中文的两句装进去了；too 站在词前面，和句尾「也」的 too 站位不同 |
| 对比卡方向（6 条） | ① `The box is too heavy that I can't carry it.` ❌（`that` 起）→ `The box is too heavy to carry.`——中文「太…了（所以）不能…」两句直译会超载：英语一条句子就装下了（too…to）；② `It is too heavy to carry it.` ❌（`it.`）→ carry——to 后面不用再把东西指一遍（它已经在句子头上了）；③ `The wind is very strong to go out.` ❌（`very`）→ too——「太…了装不下」的位子给 too，「非常」顶不了这个岗（very strong 只说「很大」，说不出「不能出门」）；④ 双正解对照：`It is too heavy to carry.` ✅ 并排 `It is very heavy.` ✅（都对：一句「太重拿不动」、一句只说「很重」——想带上「拿不动」，就在词前放 too、后面接 to 动作）；⑤ 复习卡（L32）：`The wind is too strong.` ✅（第 32 课听过的句子——今天把后半段 to go out 装上去）；⑥ 认读卡：`It is too hot to sleep.` ✅ 并排 `It is too dark to see.` ✅（两个常景认读：「太热睡不着」「太黑看不见」——too…to 一对就读顺） |
| 变体方向 | 肯定 `It is too heavy to carry.` / 否定 `It is too heavy for me.`（noteZh：本课句式不直接加 not；想说「我搬不动」用 for me 收尾——生产时定稿裁决见 §8-⑥）/ 疑问 `Is it too heavy to carry?`（noteZh：Is 搬句首——问「是不是太重搬不动」） |
| 复现题设计 | guided 复现 L32 原句 `The wind is too strong.`（种子转正起点）；practice 第 1 题 `It is too heavy to carry.` + 变体逐字题 `Is it too heavy to carry?`；第 3 题复现 L61 原句 `Could you help me?`（搬不动就开口求助——两课场景串线） |
| 案件规划 | 新案 `hunt-moving-day-note`「搬家提示单」（§6） |
| 六段要点 | 开场 L32 风句补后半段；比喻＝「太…了装不下」（一条句子装中文两句）；deepDive：too 两身份隔开讲（句尾 too＝也，词前 too＝太——位置对照卡）；arrange ≤7 token |

## §3 中文负迁移处理专章

| 干扰 | 典型错 | 话术方向 | 归入 |
|---|---|---|---|
| 「能不能」叠用 | \*Can you could help me?／\*Could you can…? | 「请人帮忙只请一个门卫：两个挤一个门会撞车」 | 对比卡 L61 延伸 |
| 家族垫板惯性 | \*Could you to help me?／\*Could you helping me? | 「could 家族不垫板、不换装——第 47 课老规矩」 | 对比卡 L61 第 1/2 条 |
| 想要的两档口气混用 | \*I would like to tea（要东西垫 to）；want 与 would like 口气不分 | 「想要东西：want 直接、would like 客气；垫板 to 是给动作用的」 | 对比卡 L62 第 1 条 |
| 双宾两序相撞 | \*Give me it.／\*Give the book me. | 「两样东西不能挤一块：先给谁后给什么；东西变 it 要翻身垫 to」 | 对比卡 L63 第 1/2 条 |
| 门卫到 finish 就忘 | \*I finished to read.／\*I finished read. | 「finish 的门和 enjoy 一样只开一扇：只认名字版」 | 对比卡 L64 第 1/2 条 |
| 「一样」丢一头 as | \*He is tall as me.／\*as tall than me／\*as taller as me | 「两头都要卡住；than 和 -er 是隔壁『更…』家的」 | 对比卡 L65 第 1/2/3 条 |
| 「太…了所以不能…」两句直译 | \*too heavy that I can't carry it | 「英语一条句子就装下：too…to——说出 to 后半段就够了」 | 对比卡 L66 第 1 条 |
| 赘余指代 | \*too heavy to carry it | 「to 后面不用再指一遍——东西已经在句子头上了」 | 对比卡 L66 第 2 条 |
| very 顶 too 的岗 | \*very strong to go out | 「very 只说很大，说不出『装不下』；想带上『不能』就换 too」 | 对比卡 L66 第 3 条 |

## §4 叙事设计专章

### 4.1 叙事草案（逐字采用）

> **「客气与程度」——把话说得体面，也说得精确。**
> 请人帮忙：Close the door, please（第 32 课三档）→ Could you close the door?（第三档今天正式上岗）。
> 招待客人：What would you like?（第 4 课听过）→ I would like a cup of tea（今天会自己说了）。
> 递东西：给我一本书＝give me a book（中文语序正好对上）；东西换了小名字，就翻个身垫 to（give it to me）。
> 收尾：enjoy 的门（第 45 课）→ finish 的门（今天）——名字版是通行证。
> 比大小：更…用 than（第 17 课），一样…用 as…as（今天）；太…了装不下用 too…to（今天）。

### 4.2 复用体系（不造新比喻）

- 「礼貌三档」（L32——L61 第三档上岗）
- 「家族不垫板」（L47——L61/L62 家族旧规矩）
- 「先给谁、后给什么」（本批新命名，挂在中文正迁移上）
- 「单门门卫」（L45 enjoy——L64 finish 扩员）
- 「两头卡住」（本批新命名——as…as 两只手）
- 「太…了装不下」（本批新命名——too…to 一条装两句）
- 「名字版通行证」（L42/L45——L64 复用）

### 4.3 禁用词表（本批生产禁出现）

情态动词、助动词、宾语、双宾语、直接宾语、间接宾语、代词、介词、副词、形容词、比较级、最高级、程度副词（13 词全禁——用「门卫/家族/名字版/先给谁后给什么/it 要翻身/两头卡住/装不下」替代）。

## §5 验收标准

### 5.1 检查清单

- [ ] G1 practice ≥4 且含变体逐字题（示例：L61 `I could help you.` / L62 `What would you like?` / L63 `Can you give me the book?` / L64 `Did you finish reading the book?`）
- [ ] G2 tokens/answer 词集一致、distractors 不重复
- [ ] G3 recall 三字段非空
- [ ] G4 arrange/practice 展示序≠答案序
- [ ] G5 罪名枚举：6 案 tag 全落 10 枚举（预期 verb_form/word_order/preposition/plural/tense/fragment）；**本批不碰 comparison**
- [ ] G6 案件结构：tokenIndex 对齐、errors=4（新错 2 + 旧错 2）、单 token 可修、≥1 净词、reviewed=true
- [ ] G7 tagStats=10 不动（`huntService.test.ts:109`）
- [ ] **G8 展示层硬需求**：season-9（min 61, max 66）+ m11（afterLesson 66）随批上线——`grammarSeasons.ts` 追加 `{ id: "season-9", label: "第九季 · 客气与程度", hint: "请人帮忙说客气、东西递到手、一样和太过——话说得体面也说得精确", min: 61, max: 66 }`；`GrammarPathPage.tsx` CAN_DO_MILESTONES 追加 m11（标题「我能客气地请人帮忙、说清一样和太过」，样本句取三课核心句：`Could you help me?` / `He is as tall as me.` / `It is too heavy to carry.`）
- [ ] **G8-b 守门测试**：`grammarSeasons.test.ts` 四断言全绿——「最高课号 66 落区间」与「区间不重叠」（61 > 60）
- [ ] **G9 orphans 纪律**：6 个新案（#70–#75）全部被 L61–L66 引用（番外案名单冻结 5 个不动）
- [ ] G10 episode 写法：L61–L66 全部汉字数字（「小美的一天 六十一」…「六十六」）
- [ ] G11 语料锁闭集：could/would 只用本课句式；as…as 只做「一样」型（不引 enough/much better）；give 型只用 give/pass（pass 认读级）
- [ ] G12 关 2 cloze：核心句空位落点确认——L61 至少 1 句让 could 落空（保障句 `I could help you.`，could 在第 2 词位）；L62 `What would you like?` 空 would；L63 空 give；L64 空 reading；L65 空 is（主考点靠 rebuild 覆盖）；L66 空 is——生产时逐课预演确认题干可读
- [ ] G13 时长 6–8min；G14 旧线零回归（L1–60 不动；测试全绿 + build 通过）

### 5.2 Given/When/Then

- **G-A1** Given 学习者完成 L61 When 看对比卡 `Can you help me?` ✅ / `Could you help me?` ✅ Then 能说出两句的客气差别
- **G-A2** Given 学习者在 `hunt-help-note` 遇到 `*Could you to help me?` When 修 `to` Then 句子全对
- **G-A3** Given 学习者完成 L66 When 看对比卡 `*too heavy that I can't carry it` Then 能说出「英语一条句子装下：too…to」
- **G-A4** Given 完成 L63 首日 When 看对比卡 `Give me it.` ❌ / `Give it to me.` ✅ Then 能说出「东西变 it 要翻身垫 to」
- **G-A5** Given 学习者完成 L64 When 看对比卡 `I like reading.` ✅ / `I finished reading.` ✅ Then 能说出「名字版是通行证，换门卫不换通行证」
- **G-A6** Given 学习者完成 L65 When 看对比卡 `He is as tall as me.` ✅ / `He is taller than me.` ✅ Then 能说出「一样家和更家两家人」

## §6 案件规划（6 案）

**总规则**：每案 4 错 = 新错 2 + 旧错 2；单 token 可修；每案 ≥1 净词；零术语话术；tag 全落 10 枚举（tagStats 固定 10 项）；reviewed: true；**必须配课**；**不碰 comparison**。案件编号接批八尾号（#69 hunt-old-photo）为 **#70–#75**。

| 案件 id | 配课 | 场景 | 定稿错误构成（原 → 修正（tag，新错/旧错）） |
|---|---|---|---|
| `hunt-help-note` | L61 | 求助便条 | ① 插入型 `to`（*Could you to help → 去掉 to）（verb_form，新错——家族垫板惯性；先例 #56 `should to`）；② `helping` → `help`（verb_form，新错——-ing 顶岗；先例 #22 `making→make`）；③ `cans` → `can`（verb_form，旧错——家族不变形；先例 #22）；④ `door` → `doors`（plural，旧错——two doors 复现） |
| `hunt-guest-note` | L62 | 招待清单 | ① `likes` → `like`（verb_form，新错——would 家族穿原样）；② 删除型 `to`（*would like to tea → 去掉 to）（verb_form，新错——要东西不垫板；先例 #44/#53 垫板口径反向）；③ `cups` → `cup`（plural，旧错——a cup 单数；先例 #22 `a→an` 同句型）；④ `on` → `in`（preposition，旧错——in the morning 复现 L18） |
| `hunt-handout-note` | L63 | 手工作业单 | ① `me it` 两词相撞（*Give me it. → it 翻身垫 to：Give it to me.）（word_order，新错——两序相撞首例）；② 词序 *give the scissors me → `me` 挪位（word_order，新错——先给谁后给什么）；③ `scissor` → `scissors`（plural，旧错——永远带 s 的词）；④ `in` → `on`（preposition，旧错——on the desk 复现 L26） |
| `hunt-reading-corner` | L64 | 阅读角记录 | ① `to` → 删除（*finished to read）（verb_form，新错——门卫只认名字版；先例 #23 同族）；② `read` → `reading`（verb_form，新错——光板不能进门）；③ `book` → `books`（plural，旧错——three books 复现 L11）；④ `yesterday` → 删除（tense，旧错——句子讲的是今天的事，昨天的时间词不该站台上；冗余删除先例 #16/#19 同族） |
| `hunt-height-chart` | L65 | 身高记录墙 | ① `than` → `as`（preposition，新错——「一样」家不认 than；先例 than 系 #40）；② 插入型第一个 `as`（*tall as me → as tall as me）（word_order，新错——两头卡住）；③ `taller` → `tall`（verb_form，旧错——中间穿原样；先例 #25 比较词形系）；④ `boy` → `boys`（plural，旧错——two boys 复现 #64） |
| `hunt-moving-day-note` | L66 | 搬家提示单 | ① `very` → `too`（word_order，新错——very 顶岗「装不下」）；② `it.` → 删除（*to carry it. → carry.）（fragment，新错——to 后不重复指代；先例 #60 `it.` 删除型同族）；③ `box` → `boxes`（plural，旧错——three boxes 复现）；④ `in` → `at`（preposition，旧错——at the door 复现 L18） |

> **案件表纪律**：每案 4 错全部单 token 可修、tokenIndex 与 tokens 对齐（生产时逐 token 核对）；新错话术走 §3 负迁移表「话术方向」列；旧错一律取自 L6/L11/L14/L17/L18/L26/L33 已教点，禁引入未教材料。

## §7 Non-goals

- **不做** enough（BC 压 B1-B2、中文侧全站无专文、位置反直觉）——批十「比较收尾包」首发候补
- **不做** much better／much more（BC intermediate；中文侧未收）
- **不做** may/might（L56 刚教 May——撞词隔离期未过；BC 压 B1-B2）
- **不做** keep + 名字版深化、stop 变义对（BC B1-B2；超 A2）
- **不做** wh- + to（how to swim 型——三源全无教学位）
- **不做** 介词 + doing（good at doing——批十「搭配包」）
- **不做** 交通方式（by bus／on foot——词块非语法点；可择机进某课 sceneSwings 认读，不占课位）
- **不立项** 附加疑问（isn't it?——B1-B2 既定）；**维持不做** 深水区（虚拟语气、倒装、非谓语进阶）
- **案件不碰 comparison**（统计口径 10 项不动；comparison 统计归属挂 §8 开放问题——默认不扩展）
- **不加**新枚举、不改 tagStats、不改 schema、不动 L1–60
- **不做**封面池外新资产（6 课全部从单次池 38 张选）
- **不做** could 过去能力专段（认读级一句带过，BC 专课压 B1-B2）

## §8 开放问题

1. **comparison 统计口径**：罪名按钮 11 项可见 vs tagStats 10 项统计（`huntService.ts:16` vs `:331`）——本批案件已全部回避；是否把 comparison 纳入统计（动 `huntService.test.ts:109` 断言）——默认：**不动**，由课程端 L65/L66 补教学支撑，统计扩展留待独立小批评估
2. **L62 缩读 I'd**：`I'd like` 缩读形式是否入必做——默认：只做完整形 `I would like`，缩读放 deepDive 认读（避免书写混淆）
3. **L64 第二扇门**：mind/keep 是否在本课认读带出——默认：**不带**（一课一增量；mind 留批十搭配包），deepDive 仅提「后面还会遇到更多门卫」
4. **L65 me vs I 口语口径**：`as tall as me`（口语主流）vs `as tall as I am`（书面）——默认：只教 as me 型，不涉争议（对比卡第 6 条只做 mine/me 认读）
5. **封面语义核对**：6 张（cover31/32/33/34/35/36）生产时逐张核；不匹配换单次池语义近者
6. **L66 否定变体口径**：否定变体（`It is too heavy for me.`）生产时定稿；若判断与核心句式距过大，可降级认读卡

## §9 里程碑（粗略，正式排期归路径）

| 阶段 | 产出 | 说明 |
|---|---|---|
| M0 规格冻结 | 本 PRD 评审 | 无 P0 前置项 |
| M1 打样 | L61 全量 + hunt-help-note + 首玩走查 | 重点：could 落空句核验、「第三档上岗」话术可懂性 |
| M2 生产 | L62–L66 + 5 案 + season-9/m11 展示层 | ≈3 人日 |
| M3 验收 | §5 全量 + 路径页走查 | G8/G8-b/G9 硬需求 |
| M4 上线观察 | 首过率、could/too 新错型命中率、cloze 落点、m11 触发 | 挂既有埋点 |

## ✅ 行动清单

| # | 行动 | 负责方 | 时间窗 |
|---|------|--------|--------|
| 1 | L61 + hunt-help-note + 走查 | 内容 | D1–D2 |
| 2 | L62–L63 + hunt-guest-note + hunt-handout-note | 内容 | D2–D3 |
| 3 | L64–L66 + 3 案 | 内容 | D4–D6 |
| 4 | season-9 + m11（约 10 行） | 开发 | 随批 |
| 5 | 验收 + 路径页走查（守门测试四断言） | 内容/开发 | D7 |
| 6 | M4 观察 | 产品负责人 | 上线后 1–2 周 |

## ⚠️ 待确认 / 假设 / Non-goals

- 开放问题 §8 六项（均有默认方案）
- 假设：单次封面池 38 张中语义近者充足（本批仅取 6 张）
- 依赖：L62 依赖 L4（种子）；L64 依赖 L42/L45（门卫体系）；L65 依赖 L17/L31（比较链）；L66 依赖 L32（种子）
- Non-goals：见 §7（含 comparison 统计口径备注）

## 📚 数据来源 & 成员产出索引

- 析客（本 PRD）；瑞思：`user-research-grammar-ninth-batch-2026-09-18.md`；竞析：`competitive-analysis-grammar-ninth-batch-2026-09-18.md`；数析：`data-audit-grammar-ninth-batch-2026-09-18.md`
- 正文事实核对：`grammarLessons.ts`（L4 `:614/:632`、L14 `:2437/:2447`、L16 `:2805`、L17 `:2988`、L26 `:4646`、L31 `:5566`、L32 `:5763/:5818`、L33 `:5931`、L42 `:7685`、L45 `:8148/:8153`）；`huntCases.ts:2328`（#56 先例）；`huntService.ts:16/:331`；`grammarSeasons.ts:33`；`GrammarPathPage.tsx:177`

---

> 本报告由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。
