# 数据盘点：第十一批候选池语料与基建（A1–A4 / B1–B4 + 存量）

**日期**：2026-09-18 ｜ **类型**：实读代码/文件盘点（本地项目无数仓、无真实用户数据）｜ **成员**：数析
**方法**：实读源文件 + 逐词计数（python 一次性脚本，跑完即删）；cloze 逻辑复刻实跑；全量测试实跑复核。口径=两数据文件引号内字符串（状态机提取、跳注释），关键数字与 raw grep 交叉验证。

---

## 指标概览

| 指标 | 本期（实读） | 上期 | 状态 | 出处 |
|---|---|---|---|---|
| 课程 / 案件 | 71 课（L1–71 连续）/ 80 案（#1–80，reviewed 80/80） | 66/75 | ✅ | `grammarLessons.ts`；`huntCases.ts` |
| 罪名错误实例 | **294**：verb69/plural46/sv41/prep40/wo28/be20/art17/tense16/frag9/run_on8 | 274 | ✅ | 实读 |
| **A1 使役** | `Let me` **0**；`Let's` 2（L56/L65）；`make/makes/made me` **0**；`make` 全库 9 全「做蛋糕」义；`help me` 36（课程 35：32×"Could you help me"）；`help sb+原形` 2（#1/#70）；`ask/tell/want sb to` 1（L15 反例） | — | ⚠️ 近全空 | 实读 |
| **A2 How often/long/far** | 三短语 **全 0**；`how many` 9、`how much` 6（全 L30）；`How` 总 36；频率副词 96、`often` 26（L28=22）；`far` **全库 0** | 0 | ⚠️ 真空白 | 实读 |
| **A3 What/How about** | `What about` 1（L45「你呢」义）；其余 `How about`/`Good idea`/`Sounds great`/`idea` **全 0**；`should` 157 | 0 | ⚠️ 真空白 | `:8162` |
| **A4 look like** | `look like` 0；`looks like` 1（L49 天气义）；`What does` 1（L25）；`tall` 76、`glasses` 86；`hair` 1、`eyes` 0 | — | ⚠️ 半空+同形 | 实读 |
| **B1 much+比较/far** | `much better/more`、`far better`、`much+形比` **全 0**；`much` 32 全数量义；`better` 10、`more` 40 | 0 | ⚠️ 真空白 | 实读 |
| **B2/B3/B4** | `keep/keeps` 3 全案件、`keep+ing` 0；`stop` 9 全实义、`stop to/doing` 0；wh+to 四项 **全 0**（`know` 178） | — | ⚠️ 真空白 | 实读 |
| 罪名枚举 | TAGS 10（`huntService.ts:331`）+第 11 键 comparison（LABELS `:16`）；comparison 案使用 **0** | 同 | ⚠️ 不动 | 实读 |
| cloze 抽词表 | **24 词**（`grammarAmbushService.ts:154`），不含本批关键词 | 24 | ⚠️ | 实读 |
| 番外 / 下一案号 | 5 个（断言 `huntService.test.ts:215`）/ **#81**；引用 76 次 75 案（双引 1）；净词最小 10（红线 ≥1，`test:325`） | 5/#76 | ✅ | 实读 |
| 封面池 | 49 张用 71 次：**单次 27 张、双次 22 张**；L67–71 全二用 | 单次 32 | ✅ 够用 | 实读 |
| season/m 锚点 | season-10 止 71（`grammarSeasons.ts:39`）；m12=71（`GrammarPathPage.tsx:191`）；**season-11/m13 未建** | 同缺 | ⚠️ 硬需求 | 实读 |
| episode | 汉字数字到「七十一」（`:13040`）；七十二…八十 **零占用** | 七十一 | ✅ | 实读 |
| 护栏/全量测试 | 守门 4 文件 51 项；全量 **51 文件 605 项**（全绿，4.72s） | 51/605 | ✅ | vitest 实跑 |

---

## 洞察

1. **A1 最深真空白 + 最强同形干扰**：使役近零（Let me 0、make me 0）；`help me` 36 处里 32 处是 L61 请求义；`make` 9 处全「做蛋糕」——使役 vs 制作义冲突是全批最大教学新点。
2. **A2 是疑问词系统第三段**：L27 疑问词 + L30 数量（15 处）是接口、频率副词 96 是 How often 答句基座；但 `far`/`long` 全库 0，两项最孤，三问同课有载重风险。
3. **A3/A4 各带同形先例**：should 157 占「建议」、唯一 What about 是「你呢」义；A4 有 glasses 86/tall 76 素材，但唯一 `looks like` 是天气义（L49）、hair1/eyes0。
4. **B1 是「批十 A 未兑现」而非提前**：批十 A 候选含 much+比较/far，实落仅 enough（L71）——实测仍 0/0，应记为批十余项收尾。
5. **B2/B3/B4 是动词搭档第二卷三个缺口**：keep 3 全在案、stop 9 全实义、wh+to 四项全 0，而 `know` 178 是接口（L35/L37/L41）。
6. **cloze 对 A 系系统性失手、对 B2 友好**（复刻 `:153–162` 实跑）：me/do/about/does/is 五类落空；`makes me do…`→do、`keep doing…`→doing 为幸运落点。
7. **修正批十遗留**：批十记「去掉 to 型 7 处」；本批实测 **10 处**（#16/#33/#54/#56/#58/#70/#71/#73/#78/#79，9×verb_form）。
8. **基建三缺一险一稳 + 案件池零摩擦**：season-11 不建→2 测试先红；m13 无守门；episode 七十二+ 零冲突；封面单次 27 张稳；#76–80 全被引用、零新孤儿、下号 #81。

---

## 可生产性分析

### 1) 护栏清单（本批）

- **G-season11**：追加 `{ min: 72, max: 71+N }`（5 课→76；6 课→77；否则路径页静默过滤+2 测试红）。
- **G-m13**：追加 m13（`GrammarPathPage.tsx:112–197` 之后）；**全库无测试引用 CAN_DO_MILESTONES**（grep 证实）→纯纪律项。
- **G-episode**：续写「七十二…」（零占用）。
- **G-covers**：单次池 27 张（cover1–9、11、13–15、19、22、25、27、29、37、38、40–43、45、47、48）。

### 2) 罪名承载预判（10 枚举零扩展；先例实读）

| 候选 | 拟植错形态 | 承载罪名 | 现有先例 |
|---|---|---|---|
| A1 | `*Let me to help you.` / `*makes me to do` / `*Let me helps you.` | **verb_form** | 去掉 to 型 **10 处**（9×verb_form）；#70 to 插入、#78 mind to、#71 likes→like |
| A2 | `*How often you run?` / `*It is two hour by bus.` | **word_order / plural** | #36 lost→did you lose（疑问语序第一案）；plural 46 处 |
| A3 | `*What about go for a walk?` / `*What about cup of tea?` | **verb_form / article** | #78 open→opening；article 17 处 |
| A4 | `*What does he look?` / `*He tall and thin.` | **word_order / fragment / missing_be** | #74 tall→as tall；#50 wears→who wears；be 缺 20 处 |
| B1 | `*He is more taller than me.` / `*very taller than` | **verb_form / word_order** | **#25 more good→better**；**#75 very→too** |
| B2/B3 | `*I keep to do homework.` / `*He stopped smoke.` | **verb_form** | 去掉 to 型同族；**#73 finish read→reading** 近同型 |
| B4 | `*I know how to swims.` / `*know to how swim` | **verb_form / word_order** | **#70 helping→help**；#44 is it→it is 族 |

**拟植错全部落在 10 枚举内，零扩展。**（先例基数：verb 69/plural 46/sv 41/prep 40/wo 28/be 20/art 17/tense 16/frag 9/run_on 8）

### 3) cloze 落点预演（复刻 `pickClozeWord` `:153–162`，表 24 词，31 句实跑）

| 典型句 | 空位 | 判读 |
|---|---|---|
| `Let me help you.` / `Let me carry the box.` | **me / me** | ⚠️ Let、help 均不空 |
| `It makes me happy.` / `He helps me learn…` / `My mom makes me do…` | makes / helps / **do**（表内） | ✅ 本体落空；✅✅ 原形即考点 |
| `How often do you run?` / `How long does it take?` / `How far is the school?` | do / does / is | ⚠️ 主考点三连保留 |
| `What about a cup of tea?` / `How about going…?` / `Good idea!` | about / about / idea | ⚠️ 非考点 |
| `What does he look like?` / `He looks like his father.` | does / looks | ⚠️ look like 保留 |
| `She is tall and thin.` / `He is much taller…` / `It is much better…` | is×3 | ⚠️ 描述+比较层零空位（靠 rebuild） |
| `I keep doing my homework.` / `She keeps asking…` | **doing**（表内）/ keeps | ✅✅ 考点即空位 / ✅ |
| `He stopped smoking.` / `I know how to swim.` | stopped / know | ⚠️ -ing 与 wh+to 保留 |
| `I don't know what to do.` / `Do you know where to go?` | **do** / **Do**（表内） | ✅✅ |

**结论**：B2/B3 体感最佳；A1 落 me、A2 落 do/does、A3 落 about、A4 落 does、B1 落 is 属系统性失手——课须逐句核验 variants；抽词表扩展=改代码，不在数据批内。

### 4) 逐候选结论（就绪度 0–5）

| 候选 | 结论 | 就绪度 | 主要风险 |
|---|---|---|---|
| A1 使役 | **需新造语料** | 0.5 | ①make 制作义 9 处同形最强；②cloze 落 me；③Let's 仅 2 处 |
| A2 How often/long/far | **少量新语料**（接口 15+96） | 3 | ①far/long 全库 0；②三问一课载重，建议拆两课 |
| A3 What/How about | **需新造语料** | 0.5 | ①先例是「你呢」义；②与 should 分层须讲清；③应答语零先例 |
| A4 look like | **少量新语料**（glasses86/tall76） | 2 | ①looks like 天气义同形；②hair1/eyes0 词面自造 |
| B1 much+比较/far | **少量新语料** | 3 | ①much 32 全数量义同形面；②与 L17/L65/L71 成「比较四连」 |
| B2 keep+doing | **需新造语料** | 1 | ①与 L64 finish doing 相邻过密；②cloze 幸运为加分 |
| B3 stop 变义对 | **需新造语料** | 0.5 | ①一课两义习得顺序；②#73 同型先例可借 |
| B4 wh+to | **需新造语料** | 1 | ①wh+to 零先例；②是 L35/L37 升级非重复 |

**数据视角排序**：A2 ≈ B1 > A4 > B2 ≈ B4 > A1 ≈ A3 ≈ B3。「零新语料」无一项达标；A2/B1/A4 为「少量新造」档。

---

## 存量资产盘点（C 类相关）

| 资产 | 规模 | 现状（实读） |
|---|---|---|
| `grammarReviewService.ts` | 309 行 | R03 复习会话：10 张/5 分钟上限、lapse 优先、相邻不同源；cloze→rebuild→free_type 轮换（≥2 次第 3 次起自由输出）；掌握=连续 2 次自由输出通过 |
| `GrammarReviewPage.tsx` | 389 行 | 路由 `/grammar/review`；入口：路径页 `:88/:507/:518`、课内 `GrammarLessonPage.tsx:1970` |
| `GrammarRevisitPage.tsx` | 296 行 | 关 2 次日回访：3–5 题（`buildRevisitQuiz`）+回马枪 1 题；20h 窗锁（`lessonService.ts:101`） |
| `GrammarReauditPage.tsx` | 291 行 | 关 3 旧案重审：新案+40% 旧案（`buildStage3CasePlan`）+回马枪 |
| `grammarTelemetry.ts` | 476 行 | 16 类事件、append-only、3000 上限+12000 溢出归档；汇总含完课率/一次通过/误报率/破案率/段停留/路径 7 天转化 |
| `grammarWeakSpotsService.ts` | 199 行 | R08 弱点档案：加权（diary1.5/wrongTag1.0/notError0.5/复习失败1.0）、半衰期 7 天、Top3+「已战胜」双榜；一键排复习 |

**C 类判读**：四套载体齐全且有测试（reviewService 15 项/weakSpots 8 项/telemetry 6 项）；缺口不在基建而在**内容供给**——新案自动进入回马枪/重审池。

---

## 附录：核查留痕

```
口径: 引号串状态机提取（跳注释）为主；raw grep 交叉验证（Let me/How often/look like 三词 0=0）
课程/案件: 71 课连续 / 80 案连续（reviewed 80/80）/ 294 错
A1: Let me=0；Let's=2（:10227/:11926）；make/makes/made me=0；make 全库 9 全制作义；help me=36（课程 35：Could you×32/Can you×2/其他 1）＋案 1（#70 话术）；help sb+原形=2；want sb to=1（L15 反例）
A2: How often/long/far=0/0/0；how many=9、how much=6（全 L30）；How=36；频率副词=96；often=26
A3: What about=1（L45 你呢义）；其余 4 短语+idea=0；should=157
A4: look like=0；looks like=1（L49 天气）；What does=1（L25:4468）；tall=76；glasses=86；hair=1；eyes=0
B1-B4: much better/more/far better/much+形比=0；much=32 全数量；better=10；more=40；keep 3（#26/#41）；keep+ing=0；stop 9 全实义；stop to/doing=0；wh+to 四项=0；know=178
罪名: TAGS=10（:331）；LABELS/PLAIN=11；comparison 使用 0；去掉 to 型=10；word_order=28 错/20 案
基建: season-10 止 71（test:12/:43）；m12=71（GrammarPathPage:191，无守门）；episode「七十一」(:13040)；封面单次 27
案件: 引用 76 次/75 案；孤儿=番外 5（test:215）；下号 #81；空引用=5 课；每课案数 {0:5,1:57,2:8,3:1}
cloze: 表 24 词；31 句实跑（§3）
测试: 守门 4 文件 51 项全绿；全量 51 文件 605 项全绿（4.72s）✓
仓库零改动: 关键 6 文件 md5 前后一致（16297afe…/b713b322…/29f6c0b7…/3063e787…/ee1f22bf…/f84c2d7b…）；脚本已删
```

**未核实**：① season-11 max 取决于本批课数（5/6 未定）；② make 义项冲突的教学影响待瑞思/路径判断；③ 27 张单次封面视觉适配未做图像核对。

---

> 本报告由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。
