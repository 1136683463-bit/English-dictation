# 数据盘点：第十批候选池可生产性（A–F 六候选）

**日期**：2026-09-18 ｜ **类型**：实读代码/文件盘点（本地项目无数仓、无真实用户数据）｜ **成员**：数析
**方法**：实读源文件 + 逐词计数（grep/python 一次性脚本，跑完即删）；cloze 逻辑复刻实跑；全量测试实跑复核。计数口径=两数据文件引号内字符串（状态机提取、跳注释），关键数字与 raw grep 交叉验证。

---

## 指标概览

| 指标 | 本期（实读） | 上期 | 状态 | 出处 |
|---|---|---|---|---|
| 课程 / 案件 | 66 课（L1–66 连续）/ 75 案（#1–75 连续，reviewed 75/75） | 60/69 | ✅ | `grammarLessons.ts`；`huntCases.ts` |
| 罪名错误实例 | **274**：verb_form63/plural41/sv41/prep34/wo26/be20/art17/tense15/frag9/run_on8 | 250 | ✅ | 实读 |
| **A. enough / much+比较 / far** | **全 0**（双口径；32 处 much 全数量义、far 零） | 0 | ⚠️ 真空白 | 实读 |
| A. as…as / too…to（批九已教） | 55（L65=51）/ 45（L66=42）；not as…as 4；than 102（L17=53）；better 10 | 新 | ✅ 刚立课 | `:11901/:12090` |
| **B. good at / 介词+doing / keep+ing / mind / stop 变义** | good at 4（全案件话术 #6/#18）；其余 **全 0**；stop 9 全实义 | — | ⚠️ 真空白 | 实读 |
| B. -ing 名字版基座 | like+ing 68 / enjoy+ing 79 / finish+ing 38；ing token **800**（reading250/going114/drawing90/swimming68） | — | ✅ 基座最大 | 实读 |
| **C. Would you like** | 15 处**全部前接 What**；独立型 0；应答语（Yes, please 等）0；would 83（L62=74） | 认读种子 | ⚠️ 单一形态 | `:11334` |
| **D. buy 家族** | buy 69（L44=58）/ bought 8 / buying 8；**buy…for 0**；for+人 8（≤3 案） | — | ⚠️ 半成熟 | 实读 |
| **E. wh+to** | **全 0**（how/what/where/when to 逐项 0）；know 178、know where 86+ | 0 | ⚠️ 真空白 | 实读 |
| **F. 交通方式** | by bus/by bike/on foot/take the bus/ride **全 0**；bus 18/bike 2/walk 6/train 3（场景名） | 0 | ⚠️ 真空白 | 实读 |
| 罪名枚举 | TAGS 10（`:331`，断言 `test:109`）；LABELS/PLAIN/提示 11 键含 comparison | 同 | ⚠️ 不动 | `huntService.ts:16/:31/:118` |
| cloze 抽词表 | **24 词**（前批记 22 系误记，本批实读修正）；不含本批关键词 | 22 | ⚠️ | `grammarAmbushService.ts:154` |
| 番外/孤儿/下一案号 | 5 个（断言 `test:215`）/恰为这 5/**#76**；引用 71 次/70 案（hunt-my-sister 双引） | 5 | ✅ | 实读 |
| 封面池 | 49 张已用 66 次：**单次 32 张**、双次 17 张 | 单次 38 | ✅ 够用 | 实读计数 |
| season/m 锚点 | season-1…9 止于 66（**season-10 未建**，2 测试先红）；m11=66（**m12 未建**，无测试守门） | 同缺 | ⚠️ 硬需求 | `grammarSeasons.ts:36`；`GrammarPathPage.tsx:184` |
| episode 写法 | 汉字数字已到「六十六」；六十七+ 零占用 | 六十 | ✅ 零决策 | `:12094` |
| 护栏/全量测试 | 守门 4 文件 51 项；全量 51 文件 605 项（全绿，3.73s） | 51/605 | ✅ | vitest 实跑 |

**净词口径**：每案 ≥1 净词 = tokens.length > 错位数（断言 `huntService.test.ts:325`），75 案全过。

---

## 洞察

1. **A 是「批九正对岸」**：as…as 55 / too…to 45 全在 L65/L66（批九刚落）；enough、much+比较（32 处 much 纯数量义）、far 全 0。案件侧 #74（than→as、tall→as tall）、#75（very→too）已养出 A 系植错先例；too「也」句尾 14 处是位置对比的现成对照。

2. **B 的基座在 -ing 名字版不在搭档本体**：like/enjoy/finish+ing 185 处、ing token 800；但 good at(4 话术)/keep+ing/mind/stop 变义/介词+doing 全空——**「介词后 doing」全库首例**（#6/#18 的 good at 话术是天然复现锚点）。

3. **C 的增量实为「拆单一形态」**：would like 刚立课（74 处），但 15 处 Would you like 全是 What 型；非 What 独立型 0、应答语 0。批十做 C = 「独立提问 + 应答礼貌链」，不是重教本体。

4. **D 是同动词家族第二段最顺选**：L44（58 处）+L11 bought 已立，buy…for 0 是真新点；for+人 8 处先例（#15 make cake for her、#22 Order for Xiaomei）；#12 hunt-new-phone 是现成家族案。

5. **E/F 最孤立**：wh+to 四项全 0，但 know 178 处（L35 know-where 体系）给接口；F 仅 bus/bike/walk 单词种子，且 **by 同形面最大（全库 115 处，含 L52–54 被动义全量）**——教 by+交通须显式处理被动认知冲突。

6. **cloze 兜底对多数候选友好、对 A/C/E 系统性失手**（复刻 `pickClozeWord` `:153–162` 实跑）：`Would you like…` 抽 you、`I know how to swim.` 抽 know、比较/后置结构抽 is；幸运落点：bought（正中）、doing/Do（表内词即考点）。A/C/E 课须逐句核验 variants 至少 1–2 句让主考点落空。

7. **基建两条硬需求延续**：season-10 不建则 2 测试先红（`test:12/:43` 均为全量循环断言）；m12 全库无断言、纯纪律。episode 六十七…零冲突。**封面单次余量 38→32**，仍够 6 课。

8. **案件池零摩擦**：#70–75 全被 L61–66 引用、零新孤儿；下号 #76；批十六课六案照旧全配课即可。

---

## 可生产性分析

### 1) 护栏清单（本批注意）

标准 15 项与代码现实一致；测试断言 4/4/10/13 项。本批三条硬需求：**G-season10**（追加区间否则 L67+ 静默过滤）；**G-m12**（无守门）；**G-episode**（六十七…）；另 **G-covers**（32 张单次选 6）。

### 2) 罪名承载预判（10 枚举零扩展；先例为实读数）

| 候选 | 拟植错形态 | 承载罪名 | 现有先例（实测） |
|---|---|---|---|
| A | `*much more better` / `*more taller` 双重比较 | **verb_form** | #25 more good→better；L65 对比卡 |
| A | `*enough big` / `*very taller than` 小词抢位 | **word_order** | #75 very→too；#67 quick→quickly |
| B | `*good at draw`（介词后原形） | **verb_form** | 垫板后原形口径（#44/#53/#55）；介词+doing 首例 |
| B | `*good in drawing`（at↔in） | **preposition** | #6 in↔at；#18 in→at（话术已讲 good at） |
| B | `*keep to do` / `*mind open`（多/缺垫板） | **verb_form** | 去掉 to 型 7 处（#33/#54/#56/#58/#70/#71/#73） |
| C | `*Would you likes tea?` | **verb_form** | **#71 同型**（would likes→like） |
| C | `*Would you like to some tea?` | **verb_form** | #70/#71/#73 去掉 to 型；垫板空挂零先例 |
| D | `*Buy a gift to her.`（to 顶 for） | **preposition** | #74 than→as、#61/#63 from→by；to↔for 新配对 |
| D | `*bought for my mom a gift`（两补语相撞） | **word_order** | #72 me.→to me；相撞型首例 |
| D | `*I buyed a gift.` | **tense** | #17 stop→stopped；L11 已教 buyed 对照 |
| E | `*I know how to swims.` | **verb_form** | #70 helping→help |
| E | `*I know to how swim.` | **word_order** | #44 is it→it is 语序族 |
| F | `*by foot` / `*on bus`（介词对换） | **preposition** | 介词族 34 处；by↔on 新配对 |
| F | `*take bus`（丢 the） | **article** | 17 处 |
| F | `*walk by foot`（冗余） | **word_order** | #16/#19 冗余去重 |

先例基数：verb_form 63/plural 41/sv 41/prep 34/wo 26/be 20/art 17/tense 15/frag 9/run_on 8。

### 3) cloze 落点预演（复刻 `pickClozeWord`，表 24 词）

| 典型句 | 空位 | 判读 |
|---|---|---|
| `It is big enough.` / `He is much taller than me.` / `She is good at drawing.` | **is** | ⚠️ 主考点零空位（靠 rebuild） |
| `Would you like some tea?` | **you**（第 2 词） | ⚠️ 系统性落 you；`…to have some tea?` 型幸运落 have ✅ |
| `I bought a gift for my mom.` | **bought** | ✅ 正中（落第 2 词） |
| `I know how to swim.` | **know** | ⚠️ wh+to 保留；`I know what to do.` 抽 do ✅ |
| `I go to school by bus.` | **go** | ✅（by bus 不空，rebuild 覆盖） |
| `He goes to school on foot.` | **goes** | ⚠️ 表内无 goes，考点前移 |
| `I ride a bike to school.` | **ride** | ✅ 正中 |
| `I keep doing my homework.` | **doing**（表内） | ✅✅ 考点即空位 |
| `Do you mind opening the window?` | **Do**（表内） | ✅ 幸运落 Do |

**结论**：A/C/E 核心句主结构系统性落空，须逐句核验 variants；抽词表 24 词不含本批关键词，**扩展抽词表=改代码，不在数据批范围**。

### 4) 逐候选结论

| 候选 | 结论 | 主要风险 |
|---|---|---|
| A 比较收尾 | **少量新语料**（仅 enough 后置、强化词二新点） | ① 与批九相邻爬坡须缓；② too「也」14/much 数量义 32 同形对照；③ cloze 落 is |
| B 搭配包 | **需新造语料**（搭档全空，-ing 基座 800 可借） | ① 介词后 doing 首例；② stop 变义一课两义习得顺序；③ mind 语用较难 |
| C 深化 | **少量新语料**（增量=独立型+应答链） | ① 15 处全 What 型无独立先例；② cloze 落 you；③ 与 L62 过近需差异化 |
| D for 家族 | **少量新语料**（L44 基地可复现；buy…for 新造） | ① to↔for 无先例；② 两补语语序相撞首例 |
| E wh+to | **需新造语料**（四项全 0） | ① cloze 落 know；② 与 L35 从句→短语升级路径 |
| F 交通 | **需新造语料**（全批最孤立） | ① by 同形面 115 处；② ride 零种子可规避；③ 单词种子少 |

观感优先级（供路线图）：D > C > A > B > E ≈ F。

---

## 附录：核查留痕

```
口径: 状态机提取引号串（跳注释）+ raw grep 交叉验证（would 78/79、buy 58=58、as…as 51=51；
  首稿脚本跨行吞串 bug 已弃用重跑——本报告均为修正后口径）
课程/案件: 66 课连续/75 案连续/274 错（分布见概览）
A: enough=0；much+比较=0；far=0；as…as=55（L65=51/#74=4）；too…to=45（L66=42/#75=2）；
  than=102（L17=53）；better=10；more=40；much=32 全数量义；too=101（句尾「也」14）；not as…as=4
B: good at=4（全话术）；at+doing=0；keep=3（#26/#41）；keep+ing=0；mind=0；stop=9 全实义；
  stop to/doing=0；like/enjoy/finish+ing=68/79/38；prep+doing=0；ing token 800；be+ing 185
C: would=83（L62=74）；would like=56；would you like=15（全前接 What，含 2 处 tokens 数组形态）；
  独立型=0；wouldn't=2
D: buy=69（L44=58）；bought=8；buying=8；buys=0；buy…for=0；for=36；for+人=8；gift=4（#65）；make…for=1
E: how/what/where/when to=0（双口径）；know=178；know where 86+
F: 五短语全 0；bus=18；bike=2；walk=6；train=3；by=115（含被动义）
罪名链路: TAGS=10（:331，断言 test:109）；LABELS/PLAIN/提示=11 含 comparison（:16/:31/:118）；
  ALL_TAGS=11（HuntPage:31/ReauditPage:22）；storage:687 白名单 11；comparison 案件使用 0
基建: season-9 止 66（grammarSeasons.ts:36；test:12/:43 先红）；m11=66（GrammarPathPage.tsx:184，无守门）；
  L66 episode「六十六」（:12094）；六十七+ 零占用；封面 49 张/66 次：单次 32、双次 17（L61–66 为 cover31–36 二用）
案件: 71 引用/70 案；孤儿=番外 5（test:215）；hunt-my-sister 双引（L14:2606+L25:4631）；下一号 #76；
  空引用=第一季 5 课（L2/3/5/6/8，决策⑤冻结）
cloze: 表 24 词（修正前批「22」）；9 组典型句实跑（详见 §3）
测试: 守门 4 文件 51 项全绿（hunt 30/seasons 4/lessons 4/ambush 13）；全量 51 文件 605 项全绿（3.73s）✓
仓库零改动: 关键 5 文件 md5 前后一致（5f20a428…/cb104597…/f84c2d7b…/2036229c…/0c87212b…）；
  审计期间 2 个新未跟踪文件为团队并行产出（非本次改动）；本报告为唯一新增审计文件
```

**未核实**：① season-10 具体区间（按 6 课预估 67–72）；② 32 张单次封面视觉适配（未做图像核对）；③ #7/#12/#35 纯删词/纯冠词型观察仅留痕（净词双口径裁量项外）。

---

## 📚 成员产出索引

瑞思/竞析/析客/路径：本批待产（并行中）；数析（本文件）。

---

> 本报告由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。
