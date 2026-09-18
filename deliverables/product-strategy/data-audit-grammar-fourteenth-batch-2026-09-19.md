# 数据盘点：第十四批·大章节候选（6–8 课）

**日期**：2026-09-19 ｜ **类型**：实读代码/文件盘点（无数仓）｜ **成员**：数析
**方法**：实读源文件＋逐短语读上下文计数（脚本跑完即删）；cloze 复刻实跑（两套抽词器）；全量测试实跑。口径＝两文件引号内字符串（状态机提取、跳注释、带行号映射课号/案号），关键数字与 raw grep 交叉验证。**范围**：甲 寒暄（天气＋What a…!＋寒暄链）/ 乙「说从前」（after/before/when 从句＋used to）/ 丙 混合 / 丁 make 使役。

---

## 指标概览

| 指标 | 本期（实读） | 上期 | 状态 |
|---|---|---|---|
| 课程 / 案件 / 错点 | **86 课（L1–86）/ 95 案（#1–95）/ 354 错点** | 78/87/322 | ✅ |
| 罪名（错点/承载案） | verb_form 79/48·plural 61/57·preposition 53/48·sv 46/36·word_order 39/27·article 20/14·missing_be 20/16·tense 18/14·fragment 10/9·run_on 8/6 | 同序 | ✅ |
| **甲 天气** | `It's` **2 处且非天气**；L6 已教 cold/sunny/hot/raining；snowy/snowing/cloudy **全 0** | 同 | ⚠️ 撞 L6 |
| **甲 感叹 / 寒暄链** | `What a` raw 4 → **真感叹仅 1 句**；`How + 形` **0**；`How are you` 6 处全**认读**；Nice to meet you 等 **全 0** | raw 25→真 1 | ⚠️ 近空白 |
| **乙 从句 / used to** | after **从句 0**、before **连词全 0**、when 从句**仅 L78 一句认读**；used to 族**全 0** | 同 | ⚠️ 真空白 |
| **丁 make 使役** | make/makes/making GL **0**；`made` GL 4 处**全在 L68**（做义）；使役结构 **0** | — | ⚠️ 真空白 |
| 封面 / episode / 案号 | 49 张用 86 次，**单次池仅 12 张**；episode 止「八十六」；**下号 #96** | 单次 20 | ⚠️ 近见底 |
| 测试 | **54 文件 674 项全绿（3.89s）** | 54/674 | ✅ |

## 洞察

1. **甲三子项成熟度差三级**：天气撞 L6（cold/sunny/hot 已进 target/examples/contrast，raining 在 contrast 里）；感叹仅 1 句认读孤本；寒暄链真空白。**甲要立住，主线须换到「It's 缩写」新轨道**（全库仅 L24 两处、非天气）。
2. **乙是唯一「结构真空白＋落点罪名最薄」的组合**：run_on（8/6）与 fragment（10/9）是全库最薄两罪名。**但 used to 与时态配合不可同课。**
3. **丁是最后一个「零底座」候选**：与 L74 `Let me help you`、L16 must 同属「让某人做」语义场——**价值是补第三人称 makes，风险是与 L74 抢位**。
4. **cloze 落点是最强分化点**：甲（缩写式）与丁（`makes`）正中考点；甲（`It is` 全形式）与乙系统性落 be/从句动词——**这就是 target 写缩写式的技术理由**。
5. **封面单次池 12 张够本批但已见底**：8 课吃 2/3 余 4 张；批十五必须走三用（§5）。

---

## 1. 语料盘点（逐短语读上下文）

**甲 · 天气**：`It's` 缩写 GL **2 处**（L24「It's great!」×2，完成时/过去时对照句，**非天气**）、HC 0；全形 `It is` GL **123** / `It was` GL 16＋HC 3——**全库无一处 It's raining/sunny/cold**。**L6 实读**（target `It is three o'clock.`）：examples 教 **cold/sunny**；contrast 六条教 **cold（It are cold／It am hot／not cold）、hot、raining（It is rains.→It is raining.）**；variants＋sceneSwings 教 cold/hot/sunny——**四词已教**。各词计数（GL/HC）：raining 6/2·rainy 1/5·snow 10/4（**全是名词**）·windy 6/0·sunny 7/1·cold 43/2·hot 25/5·warm 3/0·weather 3/1；**snowing 0·snowy 0·cloudy 0**。**未出现＝{snowy, snowing, cloudy}**；增量＝①`It's` 缩写 ②三新词 ③解放 windy。

**甲 · 感叹 / 寒暄链**：`What a` raw 4 逐处实读：L68（npc 台词，非教学位）、L86 三处（examples 标「认读」＋contrast bothRight＋结尾「第 68 课的老朋友……它有自己的课在后面等着」）——**去重后真感叹仅 1 句、1 个来源课**。伪命中已分离：`What are` 21＋`What about` 3；**`What an`/`How + 形容词` 全 0**；**真正 What/How 结构＝1**。`How are you?` 6 处（L27/L72/L73）**全是认读罗列，无 target／contrast／产出练习**；Nice to meet you·Good morning·See you·weather like **均 0**——**真空白**，已铺垫三次。

**乙 · 时间从句**：**after** GL 7 处、**从句 0**——L9「after school」（教「时间放最后」）、L10 复现 2、L77；HC 3 处**全介词义**。**before** GL **0**、HC 2 处**全介词义**（#32·#41）——**before 连词全库零出现**。**when** GL 41 处 {L27:20, L35:3, L37:1, L56:7, L57:3, L78:4, L85:3}：**L27 20 处全是疑问词 When**，L56/L57 生日问答，L35 预告，L85 家族点兵；**时间从句仅 L78 :14383「When it is sunny, I run in the park.」一句**，明写「按第 48 课 if 家族的老邻居 when 认读」——**认读、无教学展开**；HC 2 处（#36、#41）。**合计仅 1 句真资产且为认读级**；连词线 and/but（L19）→because/so（L20）→if（L48·49）**全是逻辑关系，无一条时间关系**。

**乙 · used to / 丁 · make**：used to 族（含 didn't use to/used/uses）**两文件全 0**；`use` GL 0 / **HC 1**（#28 使用义，非被考对象）——**连动词底座都不存在**。`make` GL **0** / HC 5（做义）·`makes` **0**·`made` GL 4（**全在 L68「She made a cake for me.」**，做义）·`making` GL 0 / HC 2——**使役结构 `make + 宾语 + 动词原形` 两文件 0**；竞争位：L74 :13604（contrast 明写「Let me to help you ❌」「Let me helps you ❌」）、L16 must/have to。

---

## 2. 罪名承载预判（10 枚举零扩展）

| 候选 | 拟植错 | 承载罪名（先例） |
|---|---|---|
| 甲-天气 | `*It raining now.`/`*It is rains.`、`*It's rain.` | **missing_be** 20/16（#5·#13）/ **verb_form** 79/48（**L6 原句**·#43） |
| 甲-感叹 | `*What beautiful day!`/`*What beautiful a day!` | **article** 20/14（#15·#4）/ **word_order** 39/27（#11 形容词语序） |
| 甲-寒暄 | `*How you are?` | **word_order** 39/27（#36 lost→did you lose） |
| 乙-从句 | `*After eat my homework, I watch TV.` | **fragment** 10/9（#28 Because 独立成句·#89 of the 多余） |
| 乙-从句 | `*I do my homework, I watch TV.`（粘连）/`*…I watched TV.` | **run_on** 8/6（#7·#27·#40）/ **tense** 18/14（#1·#32） |
| 乙-used to | `*I use to play here.`/`*didn't used to` | **verb_form** 79/48（#24 musts→must·L74 helps ❌） |
| 丁-make | `*makes me to do…`/`*makes me does…`/`*make me do…` | **verb_form** 79/48（#24）/ **sv_agreement** 46/36（#21·#4） |

全落 10 枚举内。枚举**不可动**（`huntService.ts:331-342`；`huntService.test.ts:109` 断言 `toHaveLength(10)`）。

---

## 3. cloze 落点预演（R-B8 最新词表实跑）

**词表实读**（`grammarAmbushService.ts:160-193`）：**145 条/144 词**（`would` 重复），停用词 **30**；三级落点①表内语法词 → ②长度≥3 非停用实词 → ③第 2 词。

| 候选典型句（实跑） | 空位 | 判读 |
|---|---|---|
| It is raining now. / windy / snowy / cold today. | **is**×4（①） | ✗ 全落 be |
| **It's raining now. / It's windy today. / It's cold outside.** | **It's**×3（②） | ✅ **正中缩写考点** |
| **What a beautiful day! / What a nice bag!** / How nice! / How cold it is! | **What**×2 / How×2 | ✅ 4/4 |
| How are you? / How is the weather? | How×2（①） | △ 落疑问词 |
| After I do… / Before I eat… / When I am tired… / I go home after school. | do/eat/am, go（①） | △ 从句动词 / ✗ 主句 |
| I used to play here. / **She used to live…** / I didn't use to like milk. | play / **used** / didn't | △ / ✅ / ✅ |
| **My mom makes me do my homework.** / He made me wait. / The story makes me laugh. | **makes/made**×4（①） | ✅ **4/4 全中** |

**汇总**：**丁 4/4 全中；甲缩写式 3/3、感叹 2/2 全中；甲全形式系统性失手**；乙落从句/主句动词。**对照复习会话抽词器**（`grammarReviewService.ts:144` 停用词仅 7）：raining·windy·snowy·cold·cloudy·After·Before·When·used **全可抽中** → 新候选宜以复习会话 cloze/rebuild 为主承载。**建议：甲的 target 写缩写式，cloze 落点即从 is 迁到 It's。**

---

## 4. 基建护栏

| 护栏 | 现状（实读） | 动作 |
|---|---|---|
| **season-14** | `grammarSeasons.ts:43` 末项 season-13={79,86}；**无 season-14** → 不上线即被路径页静默过滤、测试先红 | 追加 `{min:87, max:87+N-1}`；**测试不限一季课数** |
| **m16** | `GrammarPathPage.tsx:218-225` m15=afterLesson 86，**无 m16**；**无测试引用 mN** | 追加 m16；纯纪律项（can-do 按 `number <= afterLesson` 判，`:373`） |
| **episode / 封面** | episode 止「八十六」，八十七…九十四**两文件全 0**；封面 49 张用 86 次：**单次 12、双次 37、三次+ 0** | 续写「八十七…」（汉字自「五十一」起）零冲突；封面见 §5，池外零新资产 |
| **案号/连续性/案件池** | max #95 → **下号 #96**；`lessonService.ts:143` 关 1 用 `number - 1`；`huntService.test.ts:215` 断言孤儿恰 5；分布 `{2:10,3:10,4:72,5:2,6:1}`、引用点 91/去重 90、每课案数 `{0:5,1:72,2:8,3:1}`（空案 L2/3/5/6/8） | 87 起连续无跳号（**缺号永久锁死无报错**）；新案必被引用且 reviewed；番外 5 案冻结；新批「新错 2＋旧错 2」 |

---

## 5. 封面池专章：12 张单次池对大章节

**容量账**：单次池 **12 张**（cover13·14·15·22·27·37·38·40·41·45·47·48，首用 L13–L48，距今 73–38 课）；8 课需 8 张 → **够用、余 4**，6 课余 6。**本批可行，批十五起必须启用三用。**

**建议①（本批首选）取「首用最早」6–8 张**：`cover13·14·15·22·27·37`（6 课，距今 73–49，重复感最低）；做 8 课再加 `cover38·40`。反之 cover47·48 距今仅 38–39 课，压后。

**建议②（三用）按「三用后最小间距」排序**（双次池 37 张，第三次落 L87–L94 取 min）：**cover10** 42·**cover18** 37·**cover21** 35·**cover16/20/26** 34·**cover31/32/33/34** 30·cover24/35 29·cover23/36 28·cover12/28 27·cover30 26…

**联合最优分配**（匈牙利匹配实算）：**8 课**（最小间距 30）L87←cover16·88←cover20·89←cover21·90←cover26·91←cover31·92←cover32·93←cover18·94←cover10；**6 课**（≥32）L87←cover20·88←cover16·89←cover18·90←cover10·91←cover21·92←cover26。示例 cover16=[16,50,87] 间距 34/37。

**明确排除**（三用后最小间距 <15）：cover49 9·cover11 1–8·cover8 2·cover6 3·cover5 4·cover4 5·cover3 6·cover2 7·cover1 8——**批十三刚二用，本批与下批勿碰**。**建议③兜底**：`cover` 可选、缺省回退 SVG，封面不足不阻塞上线。

---

## 6. 可生产性评估

| 候选 | 就绪度 | 生产量 | 风险 |
|---|---|---|---|
| **甲** | ★★★ | 新词 3＋缩写轨道新造；寒暄链 3 短语从零 | **与 L6 高度重叠**（四词已教）；须先立「省字母」概念、与 L21–L24 区隔；感叹句无底座 |
| **乙 / 丙** | ★★ | **整章新造**（从句＋used to）；丙＝甲天气＋乙一条线 | 时态配合超纲；used to 三态与 L21–L23 形近；连词线三季已密集；丙「一课一增量」被稀释、中段疲劳提前 |
| **丁** | ★★ | 少量（结构 1 个，动词 3 态现成） | 与 L74 语义抢位；须区分「做蛋糕」vs「让我做」；makes 是新增屈折点 |

**就绪度排序：甲（换角度）> 丁 > 乙 > 丙；严格「零新语料」达标 0 项**（甲需 3 新词，丁/乙需整条结构）。

---

## 7. 叙事章专属检查：时间顺序资产承载能力

**四课实读**：**L44** deepDive 明写「两个动作要一块垫板缝着，不然听着像两个句子硬拼」——教「同一主语的目的小垫板」，已建立「一句话放两个动作」直觉，**但非时间先后**；**L41** 话中话＋挂尾巴、**L46** and 并列——**都不是时间关系**；**L78** 含 when 从句但只作 bothRight 认读。**判定**：① **「先后」资产＝零**（L19/20、L48/49 全是逻辑关系；L44 目的、L41/46 并列）——乙要造的第一样就是「先后」概念本身；② **时态台阶现成**：`After I do my homework, I watch TV.` 两动词都穿现在时（三单 L25、频率 L28），**不引入新时态即可成立**，是最安全设计位；危险位在「已完成」语义——「做完作业后」诱发 `*…I watched TV.`，L21–L23 的 have done 是**同形干扰源**，须先锁「两件事都是现在常做的」；③ **罪名落点匹配度高**（`*After eat…`→fragment #28/#89 与 run_on 六案）；④ **乙教学承载中等偏下、罪名承载上等；难点在时态自控，used to 宜单独成课或推到批十五。**

---

## 附录：核查留痕

**测试实跑**：`npx vitest run` → **54 文件 / 674 项全绿，3.89s**。**实读源文件（12）**：`grammarLessons.ts`(16,073 行/串 15,491)·`huntCases.ts`(5,892 行/串 4,026)·`grammarSeasons.ts`＋test·`GrammarPathPage.tsx`·`grammarAmbushService.ts`·`grammarReviewService.ts`·`huntService.ts`＋test·`lessonService.ts`·`types.ts`·`prd-grammar-find-things-2026-09-19.md`。**口径**：引号串状态机提取（跳注释、带行号映射课号/案号），raw grep 交叉验证（`What a` raw 4 ↔ 语境筛后 1；`What are` 21/`What about` 3 分离；`rains` 108 处中 99 属 L48/L49 复现矩阵）。脚本写 `/tmp` 已删；md5 复核一致（GL `327c9115…`·HC `6d84be5e…`·ambush `84b306b4…` 等 6 文件）。**未核实**：① 87 起课数与组合（6/8/丙混比未定）；② 12 张单次封面未做图像语义核对；③ 甲缩写与 L24 完成时对照句的干扰量无数仓可测；④ 87–94 连续性无守门需人工核对；⑤ 三个新天气词是否超出核心 500 词待瑞思判断；⑥ 乙的时态配合难度分级待瑞思裁定。

---

> 本报告由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。

