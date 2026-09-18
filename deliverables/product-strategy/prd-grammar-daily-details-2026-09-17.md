# PRD：第八批课程 · 日常细节篇（6 课：L55–L60）

| 元信息 | 内容 |
|---|---|
| 标题 | 「小美的一天」第八批规格：日常细节 6 课（L55–L60），开 season-8 |
| 日期 | 2026-09-17 |
| 类型 | 功能规格书（内容生产规格） |
| 执笔 | 析客（需求分析师） |
| 前置依赖 | 七批 PRD 系列；已交付基础课 L6（时间/星期，`grammarLessons.ts:969`）、L14（`She can sing very well.` 认读种子，`grammarLessons.ts:2447`）、L18（in/on 点段判据）、L25（三单）、L26（there be，`grammarLessons.ts:4635`）、L27（疑问词/生日句，`grammarLessons.ts:4819`）、L28（频率副词位置，`grammarLessons.ts:5003`）、L31（the 最优）、L34（was doing） |
| 交付物 | 6 课课程数据（L55–L60）+ 6 个新侦探案件（reviewed）+ season-8/m10 展示层 |

## 📝 修订记录

- **v1（2026-09-17）**：初稿即 6 课（产品负责人指令：一章课量要足，第八批 = L55–L60 共 6 课全归 season-8「日常细节篇」）；episode 全部汉字数字（圈号已用尽，㊿ 为最后一枚）；封面全部从「仅用 1 次」的 44 张单次池选定（零新资产）。

---

## 📌 TL;DR

- **核心目标**：开 season-8「日常细节篇」——把日常口语里两组高频「小事」说利索：**日期链**（L55 序数词 → L56 月份 → L57 日期合体）与**副词链**（L58 -ly 副词 → L59 well/fast 特例）；L60 收口，把 L26 存在句翻到「昨天版」（there was/were）回忆旧照片。
- **关键决策**：① 课量 **6 课（L55–L60）**，全部归 season-8；② 日期链与副词链**各以一课一增量递进**，L57/L59 分别收口两条链，L60 批收口零新知延伸；③ **L59 复用 L14 认读种子转正**（`She can sing very well.`，`grammarLessons.ts:2447`）；④ **展示层硬需求**：season-8 `{min:55,max:60}` + m10（afterLesson 60）随批上线（守门测试 `grammarSeasons.test.ts` 强制最高课号落区间）。
- **认知负荷裁定**：L55 序数词（新）、L56 月份（词表型，用挂历/生日歌场景串）、L57 日期（in→on 判据升级 + 序数读法）、L58 -ly（方式副词位置，须与 L28 频率副词「动词前」对照讲）、L59 well/fast（两特例 + very 位置）、L60 there was/were（is/are 换昨天版）——每课一新点，无一课叠加两新点。
- **案件纪律**：每课 1 案（共 6 案，#64–#69），每案 4 错 = 新错 2 + 旧错 2，单 token 可修，tag 全落 10 枚举，**不碰 comparison**（该罪名本批无新课支撑，悬空状态记入 §7 Non-goals 备注）。

## 🎯 核心结论卡片

| 项目 | 内容 |
|------|------|
| 推荐方案 | 6 课（L55–L60）：第一个到教室（序数词）→ 我的生日在五月（月份）→ 十月一日（日期）→ 她跑得快（-ly 副词）→ 她唱得好（well/fast）→ 昨天公园里有…（there was/were） |
| 优先级 | P1（内容生产批次） |
| 预期影响 | 日期链补上「A2 说不出精确日期」的缺口（L27 只会问生日，不会说日子）；副词链补上 L28 之外的「做事的模样」表达面；L60 把存在句从「现在」推向「回忆」 |
| 资源需求 | ≈4.5 人日内容（6 课含案 3 + 展示层 0.25 + 打样 0.5 + 验收 0.5）+ 观察 |
| 风险等级 | 中（① 月份大小写错误在现有案件少见——tag 承载需观察；② 形容词顶岗副词槽位是首次引入的错型；③ 副词位置与 L28 频率副词位置须对照讲清，防互扰） |

## §1 问题陈述与批次定位

### 1.1 解决什么问题

前七批把叙事骨架搭完（到今天/到条件/到幕后句），但学习者说日常时有两条稳定漏网：**说日期**（「我的生日在五月」「十月一日开学」——月份名与日期读法从未系统教过；L27 只会问 When is your birthday，答不出）与**说做事的样子**（「跑得快」「唱得好」——L28 只教了频率副词「多久一次」，没教方式副词「怎么做」）。L60 顺带把 L26 存在句翻到昨天版，为「翻旧照片、讲回忆」补齐底座。

### 1.2 前置已铺完（本批直接衔接）

- **日期链地基**：L6 时间/星期（`It is Monday.`，`grammarLessons.ts:969`）；L18 in/on 点段判据（「某一天」用 on——本批 L57 直接升级）；L27 生日问句（`When is your birthday?`，`grammarLessons.ts:4819`——L56 负责把「答」接住）
- **副词链地基**：L28 频率副词位置（`I always arrive early.`，「站动词前/be 后」，`grammarLessons.ts:5003`——L58 对照讲「方式副词站动词后」）；L14 认读种子 `She can sing very well.`（`grammarLessons.ts:2447`——L59 转正）
- **回忆句地基**：L26 there be 单复数判断（`There is / There are`，`grammarLessons.ts:4635`，案先例 `hunt-there-be-room` #35 `huntCases.ts:1391`——`There have a book` → `There is` 的 missing_be 修正先例）；L34 was doing（was 的另一个岗位）

### 1.3 批次定位：为什么是「日常细节」

一批一个叙事面：批七「谁重要谁上台」（视角），批八「日常里的小事说利索」（细节精度）。日期与方式是日常对话里出现频率最高、又最容易被中文习惯带偏的两组颗粒度信息——**本批不开新叙事比喻，全部复用既有体系**（the 的排位家族、It 占位小凳子、There 先占位、小标签体系，见 §4）。

## §2 拆课方案与逐课规格

### 2.1 课量决策：6 课（L55–L60）

| 方案 | 取舍 | 裁决 |
|---|---|---|
| 3 课 | 序数/月份/日期合并成 1 课 + 副词 1 课 + L60——月份 12 个词表型内容塞不下，一课三新点 | ✗ |
| **6 课** | 日期链 3 课（L55 序数→L56 月份→L57 日期合体）+ 副词链 2 课（L58 -ly→L59 well/fast）+ L60 回忆收口；各课一增量，规模与前批对齐 | **✓ 拍板（产品负责人指令）** |
| 7 课 | 拆出独立「生日邀请卡」综合课——与 L57 重复，且季节篇幅失衡 | ✗ |

### 2.2 逐课规格

**L55 第一个到教室（序数词 · first/second/third + -th）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-55-ordinal`；episode「小美的一天 五十五」（汉字数字）；scene `campus`；cover `cover28`（现仅 1 次用量——同场景先例：L28 早到教室；生产时语义核对） |
| title / grammarLabel | 「第一个到教室」/「第几个 · first / second / third」 |
| targetSentence | `He is the first to come.`（6 token） |
| 场景 | 周一清晨，小美第一个到教室，在黑板上写下比赛名次等同学来 |
| 新知识点 | **只有一件**：说「第几个」用排位词——「一」的排位是 first、「二」的排位是 second、「三」是 third，从「四」起大多是数字加 -th（fourth/fifth 例外单独认）；排位词站名词前，前面常带 the（the 的排位家族，复用 L31「the + 最」直觉） |
| 对比卡方向（6 条） | ① `He is first to come.` ❌（wrongMark `first`）→ `He is the first to come.`——排位词前面 the 不能丢（article 真错；话术：排位一出现，the 就跟上，L31 的 the best 是亲戚）；② `Tom is the two to finish.` ❌（`two`）→ second——报数词不能顶排位词：two 是「两个」，second 才是「第二」（word_order 真错）；③ `Amy is the three.` ❌（`three`）→ third——拼法要认：三的排位是 third（不是 threeth）；④ 双正解：`He comes first.` ✅ 并排 `He is the first to come.` ✅（同一个「第一」，两种说法——句尾的 first 也能用）；⑤ 复习卡（L26/L30）：`There are three winners.` ✅（「三个赢家」报数字数——three 是数量家族，别和排位家族混）；⑥ 双正解分界卡：`The three boys are here.` ✅ 并排 `The third boy is here.` ✅（「三个男孩」vs「第三个男孩」——差一个字母差一件事） |
| 变体方向 | 肯定 `He is the first to come.` / 否定 `He is not the first to come.`（noteZh：not 跟 is 走）/ 疑问 `Who is the first?`（noteZh：问「谁是第一个」，疑问词 Who 站句首） |
| 复现题设计 | guided 复现 L6 原句 `It is Monday.`（时间句底子：小美看表）；practice 第 1 题 `He is the first to come.` + 变体逐字题 `Who is the first?`；第 3 题复现 L26 原句 `There is a book on the desk.`（there be 家族温故——L60 预告不碰） |
| 案件规划 | 新案 `hunt-race-result`「比赛名次表」（§6） |
| 六段要点 | 开场召回 L31「the 的排位家族」；比喻＝「给名次排队」（报数 one two three 管「有几个」，排位 first third 管「排第几」）；deepDive：the first / the best 同族、three 与 third 分界；arrange ≤7 token |

**L56 我的生日在五月（月份 · 12 个月 + in）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-56-months`；episode「小美的一天 五十六」（汉字数字）；scene `mansion`；cover `cover30`（单次池——家里场景先例：L30 在家清点东西；生产时语义核对） |
| title / grammarLabel | 「我的生日在五月」/「月份 · in May」 |
| targetSentence | `My birthday is in May.`（5 token；接 L27 生日问句，本课负责「答」） |
| 场景 | 家里挂历前，小美在 12 个月格子上圈生日，给全家人的生日排顺序 |
| 新知识点 | **只有一件**：12 个月份名（词表型内容，用挂历/生日歌串——一月到十二月按挂历格认读）；说「在某个月」用 **in + 月份**（in May）；月份名字**首字母要抬头**（May「五月」的抬头跟人名一样） |
| 对比卡方向（6 条） | ① `My birthday is on May.` ❌（`on`）→ in——月份用 in（preposition 真错；判据：只说到「哪个月」这个大格子，用 in——「某一天」才用 on，L18 判据对照）；② `My birthday is in may.` ❌（`may`）→ May——月份名字要抬头（大写复现；word_order 载重，见 §8 开放问题）；③ 双正解对照：`School starts on Monday.` ✅ 并排 `School starts in May.` ✅（一天用 on、一个月用 in——点用 on、段用 in，L18 判据升级）；④ 双正解（问答链）：`When is your birthday?` ✅ 并排 `My birthday is in May.` ✅（L27 问句源头接住「答」——问答对卡）；⑤ 复习卡（L6/L18）：`It is Monday.` ✅ 并排 `It is May.` ✅（星期和月份都是时间词：星期是「点」、月份是「段」；两个家族的名字都抬头）；⑥ 认读卡（无错句）：`January / February / March / April / May / June … December`——12 个月挂历认读（noteZh：长名字拆三段读：Sep-tem-ber / Oc-to-ber / No-vem-ber / De-cem-ber） |
| 变体方向 | 肯定 `My birthday is in May.` / 否定 `My birthday is not in May.`（noteZh：not 跟 is 走）/ 疑问 `Is your birthday in May?`（noteZh：Is 搬句首，L27 的搬法照旧） |
| 复现题设计 | guided 复现 L27 原句 `When is your birthday?`；practice 第 1 题 `My birthday is in May.` + 变体逐字题 `Is your birthday in May?`；第 3 题复现 L6 原句 `It is Friday.`（时间句温故） |
| 案件规划 | 新案 `hunt-birthday-list`「生日清单」（§6） |
| 六段要点 | 开场挂历翻页认 12 个月；比喻＝「挂历上的大格子」（说不清哪一天，先说到哪一格）；deepDive：in 管段、on 管点（一个月 vs 一天）；arrange ≤7 token |

**L57 十月一日（日期表达 · on + 月 + 序数日）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-57-dates`；episode「小美的一天 五十七」（汉字数字）；scene `campus`；cover `cover18`（现仅 1 次用量——in/on 判据课先例：L18「在哪、什么时候」；生产时语义核对） |
| title / grammarLabel | 「十月一日」/「日期 · on October 1」 |
| targetSentence | `School starts on October 1.`（6 token：School / starts / on / October / 1.） |
| 场景 | 开学通知贴在教室门口，小美指着日期念给同学听 |
| 新知识点 | **只有一件**：说「某月某日」＝ on + 月份 + 日期（日子**读排位词**：October 1 读 October first）；与 L56 的关系：只说月份用 in（in May），说到具体日子升级用 on（on October 1）——日期链收口：L27 会问、L56 会说月份、本课会说日子 |
| 对比卡方向（6 条） | ① `School starts in October 1.` ❌（`in`）→ on——有具体日子就用 on（preposition 真错；判据「点到日子就升级」，L56 对照）；② `School starts on October one.` ❌（`one`）→ first——日子读排位词不读报数（word_order 真错）；③ 升级对照：`My birthday is in May.` ✅ 并排 `My birthday is on May third.` ✅（只会到「五月」用 in，点到「五月三号」升级 on——L56→L57 一步之差）；④ `School starts on october 1.` ❌（`october`）→ October——月份名字要抬头，复现 L56；⑤ 复习卡（L55）：`He is the first to come.` ✅（排位词 the first 复现——日子的 first 就是它）；⑥ 复习卡（L18/L6）：`School starts on Monday.` ✅ 并排 `School starts on October 1.` ✅（「某一天」同班：星期几和日期都用 on；noteZh：日期写 October 1 或 1 October 都对，两种都对不用改） |
| 变体方向 | 肯定 `School starts on October 1.` / 否定 `School doesn't start on October 1.`（noteZh：动作请帮手 doesn't，日期块不动）/ 疑问 `Does school start on October 1?`（noteZh：Does 站句首，日期块不动） |
| 复现题设计 | guided 复现 L55 原句 `He is the first to come.` 与 L56 原句 `My birthday is in May.`（两条前链交汇）；practice 第 1 题 `School starts on October 1.` + 变体逐字题 `Does school start on October 1?`；第 3 题复现 L18 原句（in/on 判据温故） |
| 案件规划 | 新案 `hunt-calendar-note`「日历便条」（§6） |
| 六段要点 | 开场翻 L56 挂历到具体一格；deepDive：日期链收口（问生日 L27 → 答月份 L56 → 答日子 L57）+ in/on 升级判据；arrange ≤7 token |

**L58 她跑得快（-ly 副词 · 做事的样子）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-58-ly-adverbs`；episode「小美的一天 五十八」（汉字数字）；scene `campus`；cover `cover49`（单次池；校园课先例 L49；生产时语义核对，不匹配换单次池近者） |
| title / grammarLabel | 「她跑得快」/「做事的样子 · 动词后面加 -ly」 |
| targetSentence | `She runs quickly.`（3 token） |
| 场景 | 运动会看台上，小美给跑第一的姐姐喊加油，报出她跑的样子 |
| 新知识点 | **只有一件**：说「怎么做的」——动作词后面站一个「样子词」，大多由形容词加 -ly 变来（quick→quickly、careful→carefully、loud→loudly）；它站**动词后面**（She runs quickly.）——与 L28 频率副词「站动词前」**对照讲**：频率说「多久一次」（动词前），方式说「怎么做」（动词后） |
| 对比卡方向（6 条） | ① `She quickly runs.` ❌（`quickly`）→ `She runs quickly.`——样子词站动词后面（word_order 真错；话术：频率词抢前座（always runs），样子词坐后座（runs quickly）——座位不同）；② `She runs quick.` ❌（`quick`）→ quickly——形容词不能顶样子词的岗：quick 形容「人/东西怎么样」，加 -ly 才是「做得怎么样」（首次引入形容词顶岗错型，本课用规则词 quick/quickly 示范）；③ 双正解分界卡：`She is quick.` ✅ 并排 `She runs quickly.` ✅（说「她快」用 is + quick；说「她跑得快」用 runs + quickly——「是什么样」vs「做得怎么样」）；④ 复习卡（L28）：`She always runs in the morning.` ✅（频率词 always 站动词前面——前座是老规矩，本课不动它）；⑤ `He does his homework carefully.` ✅（三单词收尾：做事的样子跟着动作走；noteZh：careful→carefully 加 -ly 再收尾）；⑥ `He reads loud.` ❌（`loud`）→ loudly——形容词顶岗反向再练一条：读书「声音大」要说 read loudly（注：`loud` 作副词口语也见，本课按规则型 loudly 教学，见 §8） |
| 变体方向 | 肯定 `She runs quickly.` / 否定 `She doesn't run quickly.`（noteZh：not 走帮手 doesn't，quickly 留在动词后）/ 疑问 `Does she run quickly?`（noteZh：Does 站句首，后座词不动） |
| 复现题设计 | guided 复现 L28 原句 `I always arrive early.`（频率副词位置对照——同一「早」，early 站句尾也是方式）；practice 第 1 题 `She runs quickly.` + 变体逐字题 `Does she run quickly?`；第 3 题复现 L25 原句（三单动词 -s 温故：runs 的 -s 别丢） |
| 案件规划 | 新案 `hunt-sports-report`「运动会报道」（§6） |
| 六段要点 | 开场召回 L28「小标签」；比喻＝「前座与后座」（频率词前座、样子词后座）；deepDive：形容词 vs 副词的岗（is quick / runs quickly）、-ly 怎么加；arrange ≤7 token |

**L59 她唱得好（well/fast 特例 · 副词链收口）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-59-well-fast`；episode「小美的一天 五十九」（汉字数字）；scene `mansion`；cover `cover21`（单次池——家里场景先例：L21 在家；生产时语义核对） |
| title / grammarLabel | 「她唱得好」/「不按 -ly 走的两个常客 · good→well、fast→fast」 |
| targetSentence | `She sings very well.`（4 token；L14 认读种子 `She can sing very well.`（`grammarLessons.ts:2447`）本课转正） |
| 场景 | 家庭聚会上姐姐唱完一首，小美在客厅夸她唱得好 |
| 新知识点 | **只有一件**：两个常客不按 -ly 走——good 的样子词是 **well**（不是 goodly）；fast 的样子词还是 **fast**（不动，绝不加 -ly 变成 fastly）；very 要贴在样子词**前面**（very well） |
| 对比卡方向（6 条） | ① `She sings very good.` ❌（`good`）→ well——good/well 分工：good 形容「她这个人/东西好」，well 说「做得好」（word_order 真错，案内可用位置错兜底，见 §8 备注）；② `She sings well very.` ❌（`very`）→ `She sings very well.`——very 站样子词前面（word_order 真错：very 是「放大器」，得排在它放大的词前面）；③ `He runs fastly.` ❌（`fastly`）→ fast——fast 不用加 -ly，它自己就是样子词（word_order 真错；话术：fast 是「自己走路」的词，别人加 -ly 它不加）；④ 双正解卡：`She is a good singer.` ✅ 并排 `She sings well.` ✅（夸「一个好歌手」用 good 挂在人身上下；夸「唱得好」用 well 跟着动作）；⑤ 复习卡（L58）：`She runs quickly.` ✅（规则型 -ly 复现：quick→quickly，与 well/fast 对照）；⑥ 复习卡（L14 转正）：`She can sing very well.` ✅（L14 你只听懂的句子，今天会自己说了——can 后面 sing 原形、well 收尾） |
| 变体方向 | 肯定 `She sings very well.` / 否定 `She doesn't sing very well.`（noteZh：not 走帮手 doesn't，very well 不动）/ 疑问 `Does she sing well?`（noteZh：Does 站句首） |
| 复现题设计 | guided 复现 L14 原句 `She can sing very well.`（认读种子转正——逐字拼一次）；practice 第 1 题 `She sings very well.` + 变体逐字题 `Does she sing well?`；第 3 题复现 L58 原句 `She runs quickly.`（副词链对照） |
| 案件规划 | 新案 `hunt-stage-note`「舞台评语」（§6） |
| 六段要点 | 开场召回 L58「后座」；比喻＝「两个不按套路走的常客」（well 是从 good 家借来的、fast 谁也不加）；deepDive：副词链地图（-ly 家族 + well/fast 两个常客）；arrange ≤7 token |

**L60 昨天公园里有…（there was/were · 批收口）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-60-there-was`；episode「小美的一天 六十」（汉字数字）；scene `mansion`；cover `cover26`（单次池——there be 家族先例：L26 本课是其「昨天版」，语义最贴；生产时语义核对） |
| title / grammarLabel | 「昨天公园里有…」/「回忆版存在句 · there was / there were」 |
| targetSentence | `There was a bird in the park.`（6 token；场景：翻旧照片回忆） |
| 场景 | 周末整理相册，小美翻出上个月公园野餐的照片，跟你说「那天」有什么 |
| 新知识点 | **只有一件**：讲「昨天有什么」把 L26 的 is/are 换成昨天版——单数 was、复数 were（There was a bird / There were two birds）；「某处有某物」还是 There 先占位（L26 老规矩不动） |
| 对比卡方向（6 条） | ① `There have a book yesterday.` ❌（`have`）→ was——「有」万能直译是老大难：存在的「有」用 there be，昨天版用 was（missing_be 承载，先例 `hunt-there-be-room` 案 #35 `huntCases.ts:1391` 同型）；② `There was two birds.` ❌（`was`）→ were——复数配 were（sv_agreement；衔接 L26 单复数判断、L51 were 搭档）；③ `Yesterday there is a bird.` ❌（`is`）→ was——昨天时间点 + 现在式混用（tense 真错：句子开头说了昨天，动词要换昨天版）；④ 复习卡（L26）：`There is a bird today.` ✅ 并排 `There was a bird yesterday.` ✅（现在版 vs 昨天版——is→was 一步之差）；⑤ 复习卡（L55/L56→L57 链）：`My birthday is on May third.` ✅（日期链复现——回忆那天说的是日期）；⑥ 双正解卡：`There were flowers.` ✅ 并排 `There was a flower.` ✅（一群用 were、一朵用 was——单复数配对认读） |
| 变体方向 | 肯定 `There was a bird in the park.` / 否定 `There wasn't a bird.`（noteZh：not 跟 was 走）/ 疑问 `Was there a bird?`（noteZh：Was 搬句首——L26「Is there 开头是问句」的搬法照旧） |
| 复现题设计 | guided 复现 L26 原句 `There is a book on the desk.`（现在版先站好，再换昨天版）；practice 第 1 题 `There was a bird in the park.` + 变体逐字题 `Was there a bird in the park?`；第 3 题复现 L34 原句（was doing 温故——was 的另一个岗位） |
| 案件规划 | 新案 `hunt-old-photo`「旧照片字条」（§6） |
| 六段要点 | 开场翻相册（「那天」时间词）；比喻＝「回忆的开关」（把 There 句翻到昨天版：is→was、are→were）；deepDive：存在句地图（现在版/昨天版，单数双搭档）；arrange ≤7 token |

## §3 中文负迁移处理专章

| 干扰 | 典型错 | 话术方向 | 归入 |
|---|---|---|---|
| 「第几」中文无形态 | \*He is first to come（丢 the）；\*the two 当「第二」 | 「排位词一出现，the 就跟上；报数词是『几个』、排位词是『第几』——两个家族」 | 对比卡 L55 第 1/2/6 条 |
| 月份大小写的中文习惯 | \*in may / \*on october（中文月份没有大小写） | 「月份名字像人名，头要抬起来」 | 对比卡 L56 第 2 条 + L57 第 4 条 |
| 「在五月/十月一日」的介词直觉 | \*on May（月份说 on）；\*in October 1（有日子仍说 in） | 「点到哪一级用哪个词：只说月份用 in，点到日子升级 on——点用 on、段用 in（L18 判据）」 | 对比卡 L56 第 1 条 + L57 第 1/3 条 |
| 日期读法 | \*on October one（日子读报数） | 「日子读排位词：1 读 first——十月一号是 October first」 | 对比卡 L57 第 2 条 |
| 副词位置与中文语序 | \*She quickly runs（样子词抢前座） | 「频率词前座（always runs），样子词后座（runs quickly）——L28 的老规矩别串门」 | 对比卡 L58 第 1/4 条 |
| 形容词顶副词岗 | \*She runs quick / \*sings very good / \*runs loud | 「『是什么样』用形容词（is quick），『做得怎么样』用样子词（runs quickly）——差一个 -ly 差一个岗」 | 对比卡 L58 第 2/6 条 + L59 第 1 条 |
| 杜撰 -ly | \*runs fastly | 「fast 自己就是样子词，不加 -ly；well 也不从 goodly 来——两个常客单独记」 | 对比卡 L59 第 3 条 |
| 「有」万能直译（昨天的） | \*There have a book yesterday | 「存在句还是 There 先占位；昨天版把 is/are 换成 was/were」 | 对比卡 L60 第 1 条 |
| 时间点与动词不同步 | \*Yesterday there is a bird（说昨天用现在式） | 「句子开头说了昨天，动词要跟着换昨天版」 | 对比卡 L60 第 3 条 |

## §4 叙事设计专章

### 4.1 叙事草案（逐字采用）

> **「日常细节篇」——把小事说利索。**
> 说日子：先认排位（第一个到教室），再认月份（生日在五月），最后合体（十月一日开学）——日期链一路报到底。
> 说样子：跑得快是 quickly（动词后面加尾巴），唱得好是 well（老常客不按套路）、跑得快也是 fast（谁也不加）——副词链两个家族。
> 收口翻相册：把存在句翻到昨天版——There was a bird in the park（那天公园里有只鸟）。

### 4.2 复用体系（不造新比喻）

- 「the 的排位家族」（L31 the best 亲戚——L55 the first）
- 「It 占位小凳子」（L6——L56 时间句底子复用）
- 「前座与后座」（L28 小标签体系的延伸命名——L58 频率前座/方式后座）
- 「There 先占位」（L26——L60 只换动词形态，站位规矩不动）
- 日期链三课与副词链两课在季内**成对出现**：L55–L57 日期、L58–L59 副词、L60 收口翻相册（叙事不跨链混讲）

### 4.3 禁用词表（本批生产禁出现）

序数词、基数词、频率副词、方式副词、介词、副词、形容词（术语全禁——用「排位词/报数词/前座词/后座词/样子词/挂哪儿的词」替代）；「读作 first」不写成「序数词读法」。

## §5 验收标准

### 5.1 检查清单

- [ ] G1 practice ≥4 且含变体逐字题（示例：L55 `Who is the first?` / L56 `Is your birthday in May?` / L57 `Does school start on October 1?` / L58 `Does she run quickly?`）
- [ ] G2 tokens/answer 词集一致、distractors 不重复
- [ ] G3 recall 三字段非空
- [ ] G4 arrange/practice 展示序≠答案序
- [ ] G5 罪名枚举：6 案 tag 全落 10 枚举（预期 word_order/preposition/plural/sv_agreement/missing_be/tense）零扩展（`huntService.ts:331` 枚举不动）；**本批不碰 comparison**
- [ ] G6 案件结构：tokenIndex 对齐、errors=4（新错 2 + 旧错 2）、单 token 可修（含删/改/插入型）、≥1 净词、reviewed=true
- [ ] G7 tagStats=10 不动（`huntService.test.ts:109`）
- [ ] **G8 展示层硬需求**：season-8（min 55, max 60）+ m10（afterLesson 60）随批上线——`grammarSeasons.ts:30` 后追加 `{ id: "season-8", label: "第八季 · 日常细节", hint: "说日期、夸做得好、回忆昨天——日常里的小事说利索", min: 55, max: 60 }`；`GrammarPathPage.tsx:104` CAN_DO_MILESTONES 追加 m10（标题「我能说清日期和日常细节」，样本句取三课核心句，如 `My birthday is in May.` / `She runs quickly.` / `There was a bird in the park.`）
- [ ] **G8-b 守门测试**：`grammarSeasons.test.ts` 四断言全绿——特别是「最高课号 60 必须落区间」（漏加 season-8 先红）与「区间不重叠」（55 > 54）
- [ ] **G9 orphans 纪律**：6 个新案必须全部被 L55–L60 引用（`huntService.test.ts:215` 番外案名单冻结在 5 个：hunt-white-cat / hunt-sports-day / hunt-pen-pal-letter / hunt-fridge-note / hunt-term-review，不动）
- [ ] G10 episode 写法：L55–L60 全部汉字数字（「小美的一天 五十五」…「小美的一天 六十」——圈号已用尽，㊿ 为最后一枚）
- [ ] G11 语料锁闭集：月份只用 12 个月名（重点 January–December 认读）；日期只用 October 1/first、May third 型；副词只用 quickly/carefully/loudly/well/fast/early；不引入比较级材料
- [ ] G12 关 2 cloze：核心句空位落点确认——L55 空 `is`、L56 空 `is`、L60 空 `was`（抽词表 `grammarAmbushService.ts:154` 已含 be 全变位）；L57/L58/L59 核心句无表内动词时按兜底抽第 2 词（starts/runs/sings），生产时预演确认题干可读
- [ ] G13 时长 6–8min；G14 旧线零回归（L1–54 不动；测试全绿 + build 通过）

### 5.2 Given/When/Then

- **G-A1** Given 学习者完成 L55 When 看对比卡 `The three boys are here.` ✅ / `The third boy is here.` ✅ Then 能说出「三个 vs 第三个」的区别
- **G-A2** Given 学习者在 `hunt-race-result` 遇到 `He is two to finish.` When 修 `two→second` Then 句子全对
- **G-A3** Given 学习者完成 L60 When 打开路径页 Then L55–60 落 season-8；m10 在 60 完成后触发
- **G-A4** Given 完成 L58 首日 When 看对比卡 `She quickly runs.` ❌ / `She runs quickly.` ✅ Then 能说出「频率词前座、样子词后座」
- **G-A5** Given 学习者完成 L59 When 看对比卡 `She can sing very well.` ✅（L14 种子）Then 能自己说出 `She sings very well.`
- **G-A6** Given 学习者完成 L60 When 看对比卡 `There is a bird today.` ✅ / `There was a bird yesterday.` ✅ Then 能说出「昨天版把 is 换成 was」

## §6 案件规划（6 案）

**总规则**：每案 4 错 = 新错 2 + 旧错 2；单 token 可修（含删/改/插入型）；每案 ≥1 净词；零术语话术；tag 全落 10 枚举（tagStats 固定 10 项）；reviewed: true；**必须配课**；**不碰 comparison**。案件编号接七批尾号（#63 hunt-show-focus）为 **#64–#69**。

| 案件 id | 配课 | 场景 | 定稿错误构成（原 → 修正（tag，新错/旧错）） |
|---|---|---|---|
| `hunt-race-result` | L55 | 比赛名次表 | ① `two` → `second`（word_order，新错——报数词顶排位词）<br>② `three` → `third`（word_order，新错——拼法要认：三的排位是 third）<br>③ `boy` → `boys`（plural，旧错——two boys 复数回踩）<br>④ `in` → `on`（preposition，旧错——in Monday → on Monday，复现 L18/L6） |
| `hunt-birthday-list` | L56 | 生日清单 | ① `on` → `in`（preposition，新错——月份用 in）<br>② `may` → `May`（word_order，新错——月份名字要抬头）<br>③ `birthday` → `birthdays`（plural，旧错——家里三个人的生日）<br>④ `gift` → `gifts`（plural，旧错——two gifts；复数复现换词避免同句） |
| `hunt-calendar-note` | L57 | 日历便条 | ① `one` → `first`（word_order，新错——日子读排位词）<br>② `in` → `on`（preposition，新错——有具体日子用 on）<br>③ `day` → `days`（plural，旧错——three days 复数）<br>④ `start` → `starts`（sv_agreement，旧错——三单 -s，L25 先例） |
| `hunt-sports-report` | L58 | 运动会报道 | ① `quick` → `quickly`（word_order，新错——形容词顶岗，本批新错型首案）<br>② `loud` → `loudly`（word_order，新错——反向再练一条）<br>③ `run` → `runs`（sv_agreement，旧错——She runs 三单）<br>④ `girl` → `girls`（plural，旧错——two girls） |
| `hunt-stage-note` | L59 | 舞台评语 | ① `good` → `well`（word_order，新错——good/well 分工；tag 承载见 §8）<br>② `fastly` → `fast`（word_order，新错——杜撰 -ly）<br>③ `sing` → `sings`（sv_agreement，旧错——She sings 三单）<br>④ `in` → `on`（preposition，旧错——in the stage → on the stage，L18 表面用 on） |
| `hunt-old-photo` | L60 | 旧照片字条 | ① `have` → `was`（missing_be，新错——「有」万能直译，先例 `hunt-there-be-room` #35 `huntCases.ts:1391`）<br>② `was` → `were`（sv_agreement，新错——复数配 were，等值 L26 单复数判断）<br>③ `photo` → `photos`（plural，旧错——two photos）<br>④ `in` → `on`（preposition，旧错——in the wall → on the wall） |

> **案件表纪律**：每案 4 错全部单 token 可修、tokenIndex 与 tokens 对齐（生产时逐 token 核对）；先例：报数/排位词型（新立，话术走「报数管几个、排位管第几」）、形容词顶岗（本批新立，话术走「是什么样 vs 做得怎么样」）、月份大写（本批新立，话术走「月份名字要抬头」——先例少，生产时观察命中）、`have → was/be`（先例 #35）。旧错一律取自 L6/L18/L25/L26 已教点，禁引入未教材料。

## §7 Non-goals

- **不做**比较进阶（much better / as … as / 比较级进阶句式）——留批九；**备注**：comparison 罪名因此继续无新课支撑，本批 6 案全部回避该 tag，其「悬空」状态（10 枚举中唯一无本批支撑项）挂批九一并解决
- **不做**情态补完（might/may/could 型）——留批九
- **不立项**双宾语（give me a book）、附加疑问（isn't it?）、交通方式（by bus/on foot）
- **维持不做**深水区（虚拟语气、倒装、非谓语进阶）
- **不加**新枚举、不改 tagStats、不改 schema、不动 L1–54
- **不做**封面池外新资产（6 课全部从单次池 44 张选，§2 已定；本批用后单次池余 38 张）
- **不做**月份拼写/音标专课（词表型内容随 L56 认读消化，不单开课）

## §8 开放问题

1. **L56 月份大写错误的 tag 承载**：暂定 word_order（位置/形态错家族），但案内先例少——生产时观察学习者误解率，必要时与规则维护者核对；备选 article（话术「名字前要有东西挡着」）不采用，理由：非冠词缺失实错
2. **L58 `loud` 的口语用法**：read loud 在口语中亦见，本课为规则型教学统一按 loudly 处理（对比卡第 6 条已注明）；不在案件复现 loud 型
3. **L59 good/well 的 tag 承载**：暂定 word_order（先例有限，案内以位置错兜底——对比卡② very 位置错同案支撑）
4. **封面语义核对**：6 张（cover28/cover30/cover18/cover49/cover21/cover26）生产时逐张核；不匹配换单次池语义近者
5. **m10 样本句**：现拟取三课核心句（L56/L58/L60 各一）；若路径页偏好「两条链各一句 + 收口一句」，生产时按页面观感微调

## §9 里程碑（粗略，正式排期归路径）

| 阶段 | 产出 | 说明 |
|---|---|---|
| M0 规格冻结 | 本 PRD 评审 | 无 P0 前置项（与批七不同） |
| M1 打样 | L55 全量 + hunt-race-result + 零基础走查 | D1 口径；重点：报数 vs 排位词能否复述、大写话术是否可懂 |
| M2 生产 | L56–L60 + 5 案 + season-8/m10 展示层 | ≈3 人日 |
| M3 验收 | §5 全量 + 路径页走查 | G8/G8-b/G9 硬需求 |
| M4 上线观察 | 日期链首过率、副词位置错命中率（L58/L59 新错型）、关 2 一次通过率、m10 触发 | 挂既有埋点 |

## ✅ 行动清单

| # | 行动 | 负责方 | 时间窗 |
|---|------|--------|--------|
| 1 | L55 + hunt-race-result + 走查 | 内容 | D1–D2 |
| 2 | L56–L57 + hunt-birthday-list / hunt-calendar-note | 内容 | D2–D4 |
| 3 | L58–L60 + hunt-sports-report / hunt-stage-note / hunt-old-photo | 内容 | D4–D6 |
| 4 | season-8 + m10（~8 行） | 开发 | 随批 |
| 5 | 验收 + 路径页走查（守门测试四断言） | 内容/开发 | D7 |
| 6 | M4 观察 | 产品负责人 | 上线后 2 周 |

## ⚠️ 待确认 / 假设 / Non-goals

- 开放问题 §8 五项（均有默认方案）
- 假设：单次封面池 44 张中语义近者充足（本批仅取 6 张）
- 依赖：L57 依赖 L55/L56 生产顺序；L60 依赖 L26/L34 已完成（均在库）
- Non-goals：见 §7（含 comparison 悬空备注）

## 📚 数据来源 & 成员产出索引

- 析客（本 PRD）；正文事实核对：`grammarLessons.ts`（L6 `:969`、L14 `:2447`、L18、L25、L26 `:4635`、L27 `:4819`、L28 `:5003`、L31、L34）；`huntCases.ts:1391`（#35 先例）；`grammarSeasons.ts:30`；`GrammarPathPage.tsx:104`

---

> 本报告由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。
