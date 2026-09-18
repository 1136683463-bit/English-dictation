# 数据盘点：第九批候选池可生产性（A–E 五候选）

**日期**：2026-09-18 ｜ **类型**：实读代码/文件盘点（本地项目无数仓、无真实用户数据）｜ **成员**：数析
**方法**：实读源文件 + 逐词计数（grep/python 一次性统计，跑完即删）；cloze 逻辑逐字复刻实跑；全量测试实跑复核。计数口径：全库=`grammarLessons.ts`+`huntCases.ts`，"flat 口径"为两文件引号内字符串拼接，关键数字经双口径交叉验证。

---

## 指标概览

| 指标 | 本期（实读） | 上期 | 状态 | 出处 |
|---|---|---|---|---|
| 课程数 | 60（L1–60 连续、id/episode 唯一） | 54 | ✅ | `grammarLessons.ts` |
| 案件数 | 69（1–69 连续；reviewed 69/69） | 63 | ✅ | `huntCases.ts` |
| 罪名错误实例 | 250 处（解析 errors 全量） | ≈214 | ✅ | 实读 |
| **A. as…as / not as / enough / much+比较** | **全 0**（独立词 as 逐 token=0，非误报） | — | ⚠️ 真空白 | 双口径 |
| A. too「太」/「也」 | 太=2（L32 `:5763`；#29 `:1103`）；也=17（句尾型存量） | — | ⚠️ 近零+同形面大 | 实读 |
| A. better / than | better 10（L17 集中）；than 69（L17=53/L18=4/L31=7/#25=2/#40=3） | — | ✅ 比较链已立 | L17 `:2976` |
| **B. could / would** | could 全库 1 处（L32 话术 `:5818`）；would 2 处（L4 `:614/:632` 同句） | — | ⚠️ 认读种子级 | 实读 |
| B. may 小写 / May / might | may 9（全 L56 月份对比）；May 70；might/couldn't/wouldn't 全 0 | — | ⚠️ 同形占位 | 实读 |
| **C. give 双宾** | **课程 0 / 案件 8**（#22 `give me` `:771`、#56 `:2328` 等） | — | ⚠️ 有实句零专攻 | 实读 |
| C. buy+for / lend / send / borrow / show(动) | 全 0（show 10 处全名词义） | — | ⚠️ 真空白 | 实读 |
| **D. finish+doing / mind / keep+doing** | **全 0**（finish 家族 48 全实义；keep 3 处词义/祈使） | — | ⚠️ 真空白 | 实读 |
| D. 介词+doing / good at / how-what-where to | 介词+doing 0；good at 4（全话术）；wh+to 0（L27 疑问词系统已立 `:4822`） | — | ⚠️ 真空白 | 实读 |
| **E. by bus / by bike / on foot / take the bus** | **全 0**；ride 0；bus 18（L20=15）、bike 2（L3）、walk 6（L10） | — | ⚠️ 真空白 | 实读 |
| 罪名枚举 | TAGS 数组 10；LABELS/PLAIN/提示/storage 白名单 11 键含 comparison（详 §洞察6） | 10 | ⚠️ | `huntService.ts:331/:16` |
| comparison 案件使用 | **0**（250 处零使用） | 0 | ⚠️ | 实读 |
| cloze 抽词表 | 22 词固定表，**不含本批任一关键词** | — | ⚠️ §3 | `grammarAmbushService.ts:154` |
| 番外案/孤儿/下一案号 | 5 个（断言 test:215）/恰为这 5/**#70** | 5 | ✅ 不动 | 实读 |
| 案件被引用 | 65 次/64 案（hunt-my-sister 双引 L14+L25） | — | ✅ | 实读 |
| 封面池 | 49 张；单次用量 **38 张**、双次 11 张 | 单次 44 | ✅ 够用 | 实读计数 |
| season/m 锚点 | season-1…8 止于 max 60（**season-9 未建**）；m1…m10（**m11 未建**） | 同缺 | ⚠️ 硬需求 | `grammarSeasons.ts:33`；`GrammarPathPage.tsx:177` |
| episode 写法 | 汉字数字已到「六十」（L51 起迁移） | 五十四 | ✅ 零决策 | `:10958` |
| 护栏/全量测试 | 4 文件 51 项；全量 51 文件 605 项（均全绿，4.12s） | 80/605 | ✅ | vitest 实跑 |

---

## 洞察

1. **A 是「成熟轨道加新车」**：比较链本体已立（L17 -er/more、L31 最高级、than 69 处），但 as…as/not as/enough/much+比较全空白，too(太) 仅 2 处种子；双 as 与 enough 后置须新造语料。**头号风险是 too「太/也」同形冲突**——句尾 also-义存量 17 处，教 too…to 不带位置对照会与存量互扰。

2. **B 是纯认读种子级存量**：could 仅 1 处话术卡（L32 礼貌三档，本批天然复现锚点）；would 仅 L4 单句。**唯一「反讽衔接」风险**：may 小写 9 处全是 L56 月份对比语料（刻意教的「小写 may 是另一个词」），教情态 may 需显式衔接。

3. **C 存量完全在案件侧**：课程 0、案件 8 处 give 实句（#22 是现成双宾先例且已在其上植 `a→an`）——give 型可零新语料；buy+for/lend/show(动)/send/borrow 全 0 需新造。

4. **D 概念最顺、语料最空**：like/enjoy+doing 已立课（L42 `:7587`、L45 `:8148`），「动词门口规矩」话术已写透；但三搭档+doing、介词+doing、wh+to 全 0。

5. **E 最孤立**：by+交通/on foot/take the bus/ride 全 0；可借 bus（L20）、bike（L3）、go to 句式（L9，go to school 10 处）——`I go to school by bus.` = L9 句式+方式短语，接口天然但短语本体零存量。

6. **罪名承载实情**：`GRAMMAR_ERROR_TAGS`（tagStats/弱点唯一来源）10 元素（`:331–342`，测试断言长度 10 `huntService.test.ts:109`）；但 LABELS/PLAIN/提示三 Record **11 键含 comparison**（`:16/:31/:118`），两页面按钮 `ALL_TAGS=Object.keys(LABELS)`（`GrammarHuntPage.tsx:31`、`GrammarReauditPage.tsx:22`）——**用户可见罪名按钮实为 11 个，统计面板只 10 个**。comparison 若植案件：判题/渲染可用，tagStats/弱点/回马枪不覆盖；`storage.ts:676–689` 白名单亦含它。属既有实情，修则动断言口径（范围外）。

7. **两条硬需求与批八同构**：season-9（按 6 课预估 61–66，有 2 条测试先红）+ m11（**无测试守门，纯纪律**）。封面 38 张单次可用。

8. **案件池接续零摩擦**：69 案全 reviewed、连续、下号 #70；孤儿恰为 5 番外。本批 6 案（#70–#75）需全部被 L61–66 引用以维持零新孤儿。

---

## 可生产性分析

### 1) 护栏清单（本批新增注意）

标准 15 项与代码现实一致，四项有测试断言（4/4/10/13 项）。新增：**G-season9**（追加 season-9，否则 L61+ 被路径页静默过滤且 2 测试先红）；**G-m11**（无测试守门）；**G-episode**（汉字数字续写六十一…）；**G-covers**（38 张单次中选 6）。

### 2) 罪名承载预判（10 枚举零扩展；comparison 单列）

| 候选 | 拟植错形态 | 承载罪名 | 现有先例（实测） |
|---|---|---|---|
| A | `*as tall than me` / `*so tall as me` / `*to heavy`（小词顶换） | **preposition** 或 **word_order** | 小词替换 22 处（含 #64/#65）；than→in 1 处（#40）；as 零先例；L15 已有 to/too/at 三选一 `:2710` |
| A | `*runs enough fast`（enough 抢位） | **word_order** | 方式副词位置先例 #67 quick→quickly、#68 fastly→fast |
| A | `*much more better` / `*more tall`（双重比较/长短词混用） | **verb_form** | #25 more good→better；L17/L31 对比卡；verb_form 共 55 处 |
| A(备选) | comparison 直挂 | **comparison**（不入统计） | 案件池 0 先例；链路就绪但统计不覆盖——建议不用，走 verb_form |
| B | `*could to help`（多垫板） | **verb_form** | 同族 2 处：#56 should to / #58 to |
| B | `*He cans swim.` | **verb_form** | **同型 1 处**：#22 she cans make coffee |
| B | `*I would like to tea.` 型残句 | **fragment** | 8 处（#48 等） |
| C | `*Give the book me.`（两式相撞） | **word_order** | 语序 22 处；双宾相撞型 0 先例（新） |
| C | give→gives / 丢冠词 | **sv_agreement** / **article** | #56 同型；#22 a→an 即在 give me 句上 |
| C | `*Buy a gift to her.`（to 顶 for） | **preposition** | 30 处但全 at/in/on/by 系；to↔for 新配对 |
| D | `*finished to read` / `*finished read` | **verb_form** | 强先例：#23 swimming→swim、#22 making→make 等 10+；enjoy drawing 同族 |
| D | `*good at read` / `*how to swims` | **verb_form** | at 混淆 #6/#18；垫板后原形口径已立（#44/#53/#55）；「介词后 doing」型零先例 |
| E | `*by foot` / `*on bus` / `*walk by foot`（介词对换/重复） | **preposition** / **word_order** | 介词 30 处；冗余去重 #16/#19；by 被动义已教学 |
| E | `*take bus`（丢 the） | **article** | 17 处 |

先例基数：verb_form 55 / sv_agreement 41 / plural 35 / preposition 30 / word_order 22 / missing_be 20 / article 17 / tense 14 / run_on 8 / fragment 8 / **comparison 0**。错数分布：4→46 案、3→10、2→10、5→2、6→1。

### 3) cloze 落点预演（复刻 `pickClozeWord`，`:153–162`）

| 典型句 | 空位 | 判读 |
|---|---|---|
| `He is as tall as me.` | **is** | ⚠️ 双 as 主考点零空位，靠 rebuild |
| `This bag is too heavy.` | **is** | ✅（too 不入空） |
| `Could you help me?` / `Would you like some tea?` | **you**（第 2 词） | ⚠️ **主考点情态被保留**——系统性落 you |
| `What would you like?` | **would**（第 2 词） | ✅ 句序幸运落点 |
| `Please give me the book.` | **give**（第 2 词） | ✅ 正中主考点 |
| `He finished reading the book.` / `I enjoy reading.` | **reading**（表内） | ✅✅ -ing 考点即空位 |
| `I go to school by bus.` / `I take the bus to school.` | **go** / **take** | ✅（by bus 不空，rebuild 覆盖） |

**结论**：兜底机制对 C/D/E 核心句友好；**B 的情态疑问句系统性失手**——B 课须核验核心句/variants 里至少 1–2 句能让 could/would 落空（如 `What would you like?` 型）。抽词表 22 词不含本批任一关键词；**扩展抽词表=改代码，不在数据批范围**。

### 4) 逐候选结论

| 候选 | 结论 | 主要风险 |
|---|---|---|
| A 比较进阶 | **少量新语料** | ① too 同形存量 17 处须位置对照；② as…as 首例、cloze 主结构零空位；③ enough 后置首例 |
| B 情态补完 | **少量新语料** | ① cloze 落 you 不落情态（逐句核验）；② may 与 L56 月份认知衔接；③ might 零种子 |
| C 双宾语 | **give 型零新语料；buy 型少量新造** | ① 双宾两语序相撞 word_order 首例；② to↔for 无介词先例；③ show 全名词义需避混淆 |
| D 动词搭档二兑 | **每个新搭档均需新造** | ① 三搭档零语料；② 介词+doing 首例；③ mind 语用高难、习得顺序靠后 |
| E 交通方式 | **需新造语料** | ① 全批语料最空；② by 被动义同形冲突面；③ take the bus 新搭配 |

观感优先级（供路线图）：D ≈ C > A > B > E。

---

## 附录：核查留痕

```
罪名实例 250：verb_form55/sv41/plural35/prep30/wo22/be20/art17/tense14/run_on8/frag8/comparison0
A: as…as=0（双口径）；not as=0；too=19（太=2/也=17）；enough=0；much+比较=0；better=10；than=69
B: could=1（L32:5818）；would=2（L4:614/632）；may小写=9（全L56）；May=70；might/couldn't/wouldn't=0
C: give=8（全在案件）；课程侧=0；buy=69；lend/send/borrow=0；show=10（全名词）
D: finish=48（全实义）；finish+doing=0；mind=0；keep=3；keep+doing=0；good at=4（话术）；介词+doing=0；wh+to=0
E: by bus/by bike/on foot/take the bus/ride=0；bus=18（L20=15）；bike=2（L3）；walk=6（L10）
罪名链路: TAGS=10（:331，断言 test:109）；LABELS等=11含comparison（:16/:31/:118）；
  ALL_TAGS=11（HuntPage:31/ReauditPage:22）；storage=11（storage.ts:676–689）
基建: season止于60（grammarSeasons.ts:33）；m10=60（GrammarPathPage.tsx:177）；L60 episode=「六十」（:10958）；
  封面49张：单次38+双次11×2；L55–60=cover28/30/18/49/21/26（均1次）
案件: 下一号#70；orphans=番外5（断言 test:215）；hunt-my-sister双引（L14+L25）
测试: 4文件51项全绿；全量51文件605项全绿（4.12s）✓
仓库零改动: git status 前后快照 md5 一致（a05c8e8c857435a2fc44871ec82c382d），
  唯一新增=本报告（未跟踪文件）
```

**未核实**：① 季分组"最高课号覆盖"断言逐字话术（仅引行为语义）；② comparison 在页面结算链路的运行时表现（未跑 UI）；③ 38 张单次封面的视觉适配（未做图像核对）。

---

## 📚 成员产出索引

瑞思/竞析/析客/路径：本批待产；数析（本文件）。参考格式前作：`data-audit-grammar-daily-details-2026-09-17.md`

---

> 本报告由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。
