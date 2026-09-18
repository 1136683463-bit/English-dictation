# 数据盘点：第十二批双方向可行性（B1 语料 + 存量深化机制）

**日期**：2026-09-18 ｜ **类型**：实读代码/文件盘点（无数仓、无真实用户数据）｜ **成员**：数析
**方法**：实读源文件＋逐词计数（python 一次性脚本，跑完即删）；cloze 复刻实跑；复习链路逐函数实读（列行号）；全量测试实跑。口径＝两数据文件引号内字符串（状态机提取、跳注释）；关键数字与 raw grep 交叉验证。

---

## 指标概览

| 指标 | 本期（实读） | 上期 | 状态 |
|---|---|---|---|
| 课程 / 案件 / 错点 | 75 课（L1–75）/ 84 案（#1–84，reviewed 84/84）/ **310** 错点（verb_form74·plural50·prep43·sv41·word_order31·missing_be20·tense17·article17·fragment9·run_on8） | 71/80 | ✅ |
| **B1a–B1e** | 五组关键词面**全 0**；`much` 32 处 100% 数量义；`keep` 课侧 0；`stop` 全实义（明细 §1） | 0 | ⚠️ 真空白 |
| 复习会话 / 题量 | 上限 **10 张**；**5 分钟常量全库零引用**；关 2 **恒 4 题**＋回马枪 1；关 3＝2 案(61 课)/3 案(8)/4 案(1)/无案(5)＋回马枪 1 | 同 | ⚠️ 账实不符 |
| 收口课 / 句长 / 连接词 | 收口 **8 课**；target max**8** 词/均 5.29，全库英句 ≥9 词仅 23/2697；and122·but57·because91·so101·**or4** | — | ✅/⚠️ 触顶 |
| 枚举 / 封面 / season | TAGS **10**＋comparison（使用 **0**）；封面 **单次 23 张**；season-11 止 75、m13=75、**season-12/m14 未建**；episode 止「七十五」 | 单次 27 | ⚠️ 硬需求 |
| 案件 / 测试 | 引用 80 次/79 案、番外 5、**下号 #85**；**51 文件 605 项全绿（4.35s）** | 76/#81 | ✅ |

## 洞察

1. **B1 五项全为真空白**（属「批十余项收尾」非新欠账）；仅接口层可复用：`know`178·`tall`76·`glasses`86·`wears`95·`her`61。
2. **B1a 同形面全库最强**（`much` 32 处 100% 数量义、L30 独占 28）且**有现成对照先例**（#25 more good→better、#75 very→too）；**B1b 半空+错义**（唯一 `looks like` 天气义、`him` 仅 L37）；**B1c/B1d 缺口**（`keep` 课侧 0 且案内全「保持」义；`stop` 全实义）。
3. **方向 2 载体 100% 就位且有 8 先例**：收口课经八批验证，**GrammarLesson 零字段新增**（跨课取材 463 处「第 N 课」引用、42/75 课含复现、被引旧课 59 门）。缺口二：① 混排全在**同批 3–5 课跨度**内，**跨季综合零先例**；② 综合课**不得引用番外 5 案**（测试硬断言孤儿案 ID）。
4. **爬坡天花板＝8 词**（仅 6 课达标），但收口位**已系统性更长**（收口 8 课均 6.88 vs 全库 5.29）；可扩的是连词种类（or 仅 4）与搭配密度。**基建一险三稳**：season-12 不建→2 测试先红、m14 无守门、episode 零冲突、封面单次 23 张、下号 #85。

---

## 第一部分：方向 1 语料盘点（B1）

### 1) 计数与分布（引号串口径，两文件合计）

**B1a**：五短语（`much better`/`much more`/`much+形比`/`far better`/`a lot better`）**全 0**；`much` 32 处 **100% 数量义**（L30×28；案 #29 `too much`、#39 `many→much`）；程度义三式（`much+比较级`/`much too`/`very much`）全 0；`better` 10（L17×5·L31×3·案#25）、`more` 40、`far` 9（全 L73「How far」认读＝**唯一接口**）。

**B1b**：`look like` **0**；`looks like` **1**（L49「It looks like rain.」**天气义**）；`What does` 1（L25）；`him` 2；`her` 61（**物主 23/宾格 38**）；长相素材 `tall` 76（L65×44）、`glasses` 86（L39×45·L41×33）、`wears` 95，但 `hair` 仅 1、`eyes`/`black`/`thin`/`short` **0**。

**B1c/B1d**：`keep` 3（**课程侧 0**；案 #26/#41 全「保持」义）、`keeps` 1、`kept`/`keep+doing` **0**；`stop` 7（L16/L19/L20＋案#17）、`stopped` 2（案#17 [tense] 先例）、`stop to`/`stop+ing` **0**——**全库无一处「停止做某事」义**。

**B1e**：`how to`/`what to`/`where to`/`when to`/`who to`/`which to` **0×6**；`know` **178**（L35×61·L37×50·L41×45）、`knows`/`knew`/`known` 0。

### 2) 罪名承载预判（10 枚举零扩展）

| 候选 | 拟植错形态 | 承载罪名 | 现有先例 |
|---|---|---|---|
| B1a | `*much more taller` / `*very better` / `*much good` | verb_form / word_order | **#25 more good→better**；**#75 very→too**；#74 taller→tall |
| B1b | `*What does he look?` / `*He looks like tall.` | fragment / word_order | #74 tall→as tall；#50 语序 |
| B1c | `*I keep to do…` / `*He keeps do it.` | verb_form | 去掉 to 型 **12 处**（#16·33·54·56·58·70·71·73·78·79·83·84） |
| B1d | `*He stopped smoke.` | verb_form / sv_agreement | #17 stop→stopped；#73 finish read→reading |
| B1e | `*know how to swims` / `*know to how swim` | verb_form / word_order | 去掉 to 同族；word_order 31 错点/22 案 |

全部落在 10 枚举内。若改用第 11 键 comparison：`GRAMMAR_ERROR_TAGS`（`:331`）不含它，且 `huntService.test.ts:109` 断言 `toHaveLength(10)` → **建议仍走 verb_form/word_order**。

### 3) cloze 落点预演（复刻 `pickClozeWord`（`grammarAmbushService.ts:153-162`），31 句实跑）

空位＝表内 24 词首个命中者，无命中取第 2 词。**B1c/B1d 全胜**：`I keep doing my homework.`→**doing**（表内，考点即空位）、`She keeps asking…`→keeps、`He kept talking.`→kept、`Keep going!`→**going**；`He stopped smoking.`/`I stopped to rest.`/`She stops to think.`→**stopped/stopped/stops**（全落本体）。**B1e 半数命中**：`Do you know what to do?`→**Do**、`I don't know where to go.`→**go**、`She knows when to stop.`→knows；但 `I know how to swim.`→**know**。**B1a/B1b 系统性失手**：`…is much better.`/`…is much taller…`/`It is far better…`→**is**×3；`I feel much better today.`→feel；`What does he look like?`→**does**；`He looks like his father.`→**looks**；`He is tall and thin.`/`She wears glasses.`→is/wears；`I know him.`→**know**。抽词表扩展＝改代码，不在数据批内。

### 4) 逐候选结论（就绪度 0–5）

B1a **3**（少量新造；L30 数量义独占 28 处、cloze 落 is、far 仅 L73 认读）＞ B1e **2**（wh+to 零先例、是 L35/L37 升级非重复、cloze 半数落 Do/go）＞ B1b **1**（唯一 looks like 天气义、her 物主占 23/61、eyes/black/thin/hair 近零）≈ B1c **1**（课侧 0 先例且案内全「保持」义、与 L64 finish doing 相邻过密）＞ B1d **0.5**（一课两义习得顺序、to/doing 差一形植错面窄）。**排序 B1a ≈ B1e > B1b ≈ B1c > B1d；「零新语料」无一项达标。**

---

## 第二部分：方向 2 存量深化机制盘点（重点）

### 4) 复习系统全链路实读

**R03 会话（`grammarReviewService.ts` 309 行）**：上限 `:13`=10 张；时间预算 `:14`=5min **零引用未生效**；入队 `:41-57`（sentence＋非 suspended＋tags 含「语法」＋到期）；排序 `:52-56`（lapseCount 降→到期升）；相邻不同源 `:60-78`；题型 `:218-223`（reviewCount≥2→free_type，否则 %2：0→cloze、1→rebuild）；cloze 挖空 `:167-176`＋干扰项 `:179-204`；判分 `:283-296`；掌握 `:304-309`（最近 2 次 recall 均 rating4；旧口径 `reviewService.ts:453`）。

**入口（`GrammarReviewPage.tsx` 389 行）**：进页组一次 `:40`；入口 4 处＝`App.tsx:171`、`GrammarPathPage.tsx:88/514/525`、`GrammarLessonPage.tsx:1970`；三形态 `:290-302`／`:321-342`／`:255-286`；评分映射 `:28-31`。

**关 2（`GrammarRevisitPage.tsx` 296 行）**：触发 `lessonService.ts:101` 20h 窗；题量 `buildRevisitQuiz`（`:180-204`）＝target rebuild 1＋variants 前 3 条轮换——**variants 75/75 课恒 3 条 → 恒 4 题**（`:203` slice 永不触顶）；回马枪 1 题答对即完关；完成制 `:127`；埋点 `:70/:118-126/:173-182`。

**关 3（`GrammarReauditPage.tsx` 291 行）**：关 2 完成即解锁；`buildStage3CasePlan`（`:214-233`）旧案 `max(1,round(newCases×0.4))`（新案 0 时 `min(2,oldCases)`）；**实测** 61 课 2 案/8 课 3 案/1 课 4 案/5 课无案；点词→选罪名 `:259-263`；缺案可跳过 `:208-219`。

**R08 弱点档案（`grammarWeakSpotsService.ts` 199 行）**：权重 diary 1.5·hunt 1.0/0.5·复习失败 1.0（`:113/:99/:116-138`；hunt 靠 grammarNote `[tag]` 回溯 `:132`）；半衰期 7 天；TOP_LIMIT=3；治愈榜 `:141-166`；一键排 `:189-199`。

**遥测（`grammarTelemetry.ts` 476 行）**：**16 类事件**（`:30-196`）＝课程链 8＋三关链 3＋复习 1＋侦探 3＋日记 1；MAX 3000＋归档 12000；汇总 `:395-476`＝完课数、引导/练习一次通过率、huntVerdicts 四态、**误报率=notError÷(hit+wrongTag+notError)**、破案率、7 段停留、**路径 7 天转化**。

**机制强化缺口（成本升序）**：① 5 分钟死常量（改 1 行）；② 关 2 恒 4 题无弹性；③ 无跨批混排选题器；④ 弱点 Top3 未与今日 10 张配额联动。

### 5) 「综合复习课」可行性：**完全可行，零字段新增**

`GrammarLesson`（`types.ts:575-613`）＝17 必填＋8 可选。**8 个收口课已用同一接口跑通**（target 词数｜跨课引用处数）：L41 I know the boy who wears glasses.（7｜10）、L46 I enjoy reading and I want to travel.（8｜6）、L60 There was a bird in the park.（7｜14）、L75 Let's go to the park.（5｜15）；余四同构（L49 8｜9、L54 7｜8、L66 6｜10、L71 7｜14）。

**字段决策全有先例**：① targetSentence＝「两句同台」或「旧点翻新版」单句（L46 8 词最典型、L60 是 L26 过去版）；② contrast 跨课＝`whyZh` 写「第 N 课学的」（L41 六条中三条回指 L35/39/40）；③ guided/practice 跨课＝`promptZh` 写「先复习一小步——第 N 课学过：…」，practice 第 4 题惯例「全批收官」复现（L71 复现 L66、L75 复现 L29）。**骨架量级已固定**：contrast 6·variants 3·examples 4·dialogue 3·sceneSwings 3·guided 6·practice 4（75/75 课全一致），recall/deepDive/summary 75/75 全有。

**两处真实缺口（须先拍板）**：① **混排跨度**——现有混题全在同批 3–5 课内，**跨季综合（如 L12+L30+L50 同台）零先例**（L75→L29 是唯一远距 1 处），叙事需重设计但数据结构非瓶颈；② **案件供给**——综合课**不得引用番外 5 案**（`huntService.test.ts:215` 硬断言孤儿 ID；且 R01 锁 `huntService.ts:88-98` 会把解锁点从 L12 改为该课）→ 应配新案（#85 起）或复用旧案。

### 6) 「难度爬坡」可行性：**句长已触顶，可扩维度在连词与密度**

- **targetSentence**：min3/max**8**/均5.29；`{3:8课,4:14,5:25,6:10,7:12,8:6}`——**8 词仅 6 课**（L20/39/44/46/48/49）。
- **按季均值**：S1 4.17→S2 5.67→S3 5.20→S4 6.14→S5 5.00→S6 6.67→S7 5.60→S8 4.83→S9 5.50→S10 6.00→**S11 4.75**（近七批最短收口）；**收口 8 课均 6.88** vs 全库 5.29。
- **全库容量**：2697 条英句串中 ≥9 词仅 **23 条（0.85%）**、≥10 词 **5 条**（最长 12 词 L23 实为两句拼接）；practice ≥9 词**仅 L20**。
- **连接词**：and122·but57·because91·so101·if138·when39·that126·**or4**·after9·before2（L19 教 and·but、L20 教 because·so）；**含连接词且 ≥7 词的语料句全库仅 6 条**（`It was windy, but we were happy.`／`I was late because the bus was late.`／`It was cold, so I stayed at home.`／`I was sleepy, so I went to bed early.`／`I enjoy reading and I want to travel.`／`She likes drawing and she wants to dance.`）——**长句素材池极薄**。
- **两句连说先例**：9 课 target 含从句/连词（L17/19/20/39/40/41/46/48/49＝**12%**）；L38 转述（4 词 2 blocks）、L41（7 词 3 blocks）、L46（8 词 3 blocks）。
- **判读**：可扩＝① 连词种类（or 仅 4、when 39、after 9）；② 搭配密度（同词数装两点，L46 唯一示范）；③ 练习位加长（47/75 课 practice 已长于 target，最长 9 词）。

### 7) 基建护栏

| 护栏 | 现状（实读） | 动作 |
|---|---|---|
| **G-season12** | `grammarSeasons.ts:42` season-11={72,75}；**无 season-12** → `grammarSeasons.test.ts` 第 1 条（`:16-25`）与第 4 条（`:44-49`）**先红** | 追加 `{min:76,max:75+N}` |
| **G-m14** | m1–m13（`GrammarPathPage.tsx:112-206`），m13=afterLesson 75（`:198`）；**全库无测试引用** | 追加 m14；**纯纪律项** |
| **G-episode / G-covers** | episode 止「七十五」（`:13797`）、七十六+ 零占用；封面 49 张用 75 次，**单次 23 张**＝cover1–8、11、13–15、22、25、27、37、38、40、41、42、45、47、48（本批消耗 cover43/9/19/29） | 续写「七十六…」；23 张够 3–5 课 |
| G-cases / G-enum | 引用 80/79 案；番外 5；每课案数 {1:61,2:8,3:1,0:5}；**下号 #85**；TAGS 10＋comparison（使用 0） | 无摩擦；枚举**不动**（动则测试 `:109` 红） |
| G-tests | **51 文件 605 项全绿（4.35s）** | 守门 seasons4·lessons4·huntService30·lessonService42 |

---

## 附录：核查留痕

口径＝引号串状态机提取（跳 // 与 /* */），关键数字与 raw grep 交叉验证。实读 15 源文件（`grammarLessons.ts` 13983 行/648KB、`huntCases.ts` 3592/117KB，及 `types.ts`·`grammarSeasons.ts`·`GrammarPathPage.tsx`·`huntService.ts`·`grammarAmbushService.ts`·`grammarReviewService.ts`·`GrammarReviewPage.tsx`·`GrammarRevisitPage.tsx`·`GrammarReauditPage.tsx`·`grammarWeakSpotsService.ts`·`grammarTelemetry.ts`·`lessonService.ts`·`reviewService.ts`）。仓库零改动（6 文件 md5 一致：`4638d8fc…`/`55aa5636…`/`ea43ddfc…`/`b41d59c0…`/`ee1f22bf…`/`f84c2d7b…`）。

**未核实**：① season-12 的 max 取决于本批课数（3/4/5 未定）；② 跨季综合课的教学叙事可行性待瑞思/路径判断（数据结构已判定可行）；③ 23 张单次封面未做图像核对（仅计数）；④ 跨批混排的学习负担 vs 提取收益无数仓可测。

---

> 本报告由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。
