# 数据盘点：第十五批·大章节候选（6–8 课）

**日期**：2026-09-19 ｜ **类型**：实读代码/文件盘点（无数仓）｜ **成员**：数析
**方法**：实读源文件＋逐短语读上下文计数（脚本跑完即删）；cloze 三套抽词器复刻实跑；封面三用指派实算；boost 护栏探针实跑。口径＝引号内字符串（状态机提取、跳注释、带行号映射课号/案号），raw grep 交叉验证。**范围**：甲 使役（make sb do＋let/help 回收）/ 乙 过去进行深化（when＋过去进行 / while / 背景与打断）/ 丙 深化散章（didn't use to）/ 丁 混合。

## 指标概览

| 指标 | 本期（实读） | 上期 | 状态 |
|---|---|---|---|
| 课程 / 案件 / 错点 | **94 课 / 103 案 / 386 错点** | 86/95/354 | ✅ |
| 罪名（错点/承载案） | verb_form **82/50**·plural **68/63**·preposition **55/50**·sv_agreement **49/39**·word_order **40/28**·article **24/18**·missing_be **22/18**·tense **21/17**·fragment **14/13**·run_on **11/9** | 同序 | ✅ |
| **甲 使役** | `make/makes/making` GL **0**；`made` GL **4 处全在 L68「做蛋糕」**；`make+宾+动词` **两文件 0**；`let` 124＝L74 50＋L75 49；`help*` **183**＝L74 52＋L61 45；`have/get sb do` **0** | — | ⚠️ 结构真空白、**语义位被 L74/L75 占死** |
| **乙 过去进行深化** | `was/were+V-ing` GL **36**（L34 **30**、复现 6）＋HC 5；**-ing 动词仅 4**；`while` **0/0**；`rang/ring/knock/doorbell/suddenly` **0/0**；「过去进行＋另一过去动词同句」**先例 0** | — | ⚠️ 平台厚、**框架与打断语料零** |
| **丙 didn't use to** | L93 `used to` **44**；`didn't use to` **3**；`Did you use to` **5**；三态 variant 齐；案 #102 已承载 `use→used`、#103 回流 | — | ✅ 变体最厚、增量最小 |
| 封面 / 案号 / episode | 49 张用 94 次（**单次 12·二用 29·三用 8**）｜max #103→**下号 #104**｜episode 止「九十四」 | 12/37/0·#96 | ⚠️ 单次池只够本批 |
| 测试 | **54 文件 674 项全绿（3.9s）** | 54/674 | ✅ |

## 洞察

1. **甲＝「结构真空白＋语义位已满」**：`make sb do` 零出现，但 L74 已占死「让某人做」（`Let me help you` 52 处、contrast 明写 `Let me to help you ❌`／`Let me helps you ❌`），L75 占 `Let's`。甲须换锚到**第三人称 makes／made**（L74 全是 me/you），否则即 L74 复课。
2. **乙缺的不是时态平台而是「框架＋打断词」**：L34 平台 36 处、contrast 6 张全带 wrongMark；但 `while`／`rang`／`knock`／`doorbell` 全库 0，「过去进行＋另一过去动词同句」先例 0——乙要造的是**新叙事语法**。缝合点：when 连词岗 L92 已有但**从句全是现在时**，与 L34 零交集。
3. **丙增量不足**：L93 三态＋案 #102/#103 已建，净增量只剩「否定/疑问的 d 转移」（`:17293` 已讲），单开 6–8 课会 3 课即空。
4. **cloze 三套抽词器三样落点**（详 §3）：ambush 与 review 会话对三候选几乎全覆盖；boost 档 1 仅甲 `helps` 型失手——**这是甲须改句式、乙须选 rang 句的技术理由**。
5. **封面政策本批须换挡（与批十四预告相左，需裁决）**：单次池在本批边际价值最高（间距 **62** vs 纯三用 **29**），批十六起才是三用唯一选项（详 §5.2）。

---

## 1. 语料盘点（逐短语读上下文）

**甲 · 使役**：`make/makes/making` GL **0**；`made` GL **4 处全在 L68**「She made a cake for me.」**做义**；HC `make` 2·`making` 2·`made` 1——**「make＋宾＋动词原形」两文件 0**。`let` GL 124：**L74 50**（`Let me help you.` 19 次、`She doesn't let me help.`、contrast `Let me to help you.`(`to`)／`Let me helps you.`(`helps`)）·**L75 49**（Let's）·L56/65/93 各 1；`lets` **仅 1 且是 id 串伪命中**；HC `let` 6——**`let sb do`（宾语非 me）两文件 0**。`help*` GL 183：**L74 52**（`He helped me carry the box.`＋「help 垫不垫 to 两可」）·**L61 45**；`helps` **仅 6**、`helped` **仅 8 全在 L74**。**`have/get sb do` 0**。**竞争位**：L74 `:13690`「让某人做（Let me…）……**今天先拿下一个最常用的**」——甲要接的正是这句预告。

**乙 · 过去进行深化**：`was/were+V-ing` GL **36**：**L34=30**（真句：`I was drawing at three.`／`…yesterday.`／`She was reading last night.`／`They were playing football.`／`It was raining.`／`What were you doing?`）、L35/36 各 1、**L51 3**、L60 1；HC 5（#14·#43）。**L34 contrast 6 张、bothRight 0、5 张带 wrongMark**（`draw`／`am`／`was`／`were`／`was`）＋一条 null。`while`／`rang`／`ring`／`knock`／`doorbell`／`suddenly` **全 0/0**；`phone` HC 4 全是名词。`when`＋过去进行 **0**；when 分布 L27 20·L56 7·**L92 68**·L93 2·L94 6，**L92 从句全是现在时**。

**丙 · didn't use to**：**L93** `used to` 44·**`didn't use to` 3**·**`Did you use to…?` 5**；variant 三态齐且各带 noteZh；contrast 6 张、错卡 2（`use`／`playing`）；`:17293` 明文「d 跑到前面的 didn't/Did 里去了」。**L94 复现 9**。案件已承载：#102 `use→used`＋#103 回流。**净增量＝一条已讲过的规则。**

---

## 2. 罪名承载预判（10 枚举零扩展）

| 候选 | 拟植错 | 承载罪名（先例） |
|---|---|---|
| 甲 | `*makes me to do…`／`*makes me does…` | **verb_form 82/50**（#24·L74 `Let me to help`／`Let me helps` 同型）／**sv_agreement 49/39** |
| 甲 | `*My mom make me do…`／`*My dad lets me to play.` | **sv_agreement 49/39**（#4·#21）／**verb_form 82/50**（**只可 `lets` 承载**——`helped` 垫 to 两可，不可作错） |
| 乙 | `*When I read, the phone rang.`／`*When the phone rang, I read.` | **tense 21/17**（#32·#73·#99） |
| 乙 | `*I was reading, the phone rang.`（粘连） | **run_on 11/9**（#7·#27·#40·#100·#101·#103）／**fragment 14/13**（#99–#101） |
| 乙 | `*While I was read, …`／`*They was playing…` | **verb_form 82/50**（#14·#43·L34 原句）／**sv_agreement 49/39**（#43 原句） |
| 丙 | `*didn't used to play`／`*didn't use to playing` | **verb_form 82/50**（#102 反向同型·L93 contrast 同型） |

**判定**：甲吃 verb_form＋sv_agreement（全库最厚两条，131 错点／89 案）；**乙同时吃到最厚与最薄（run_on 11／fragment 14）两端——承载力最优**；丙仅 verb_form。枚举**不可动**（`huntService.ts:331-342`；`huntService.test.ts:109` 断言 `toHaveLength(10)`）。

---

## 3. cloze 落点预演（三套抽词器实跑）

**ambush R-B8**（`grammarAmbushService.ts:160-193`，145 条/144 词、停用词 30，①语法词→②实词≥3→③第 2 词）：甲 `makes`/`lets`/`helps`/`helped` ✅（4/4）；乙 `was` ✅；丙 `didn't` ✅。**`while/rang/use/used` 不在词表**——乙 target 含 rang 时跳过 rang 落 `was`，仍可用。

**boost 档 1**（`grammarBoostService.ts:236-260`，无语法词表，长度≥3 非 20 功能词按 seed 哈希抽一个）：`makes`/`made`/`lets` ✅；`She helps me carry…`→**carry**（△，甲 3/4）；`When I was reading…`→**reading**、`When the phone rang, I was reading.`→**rang**（乙 3/4）；`didn't use to`→**use**（**丙 4/4，正中 d 转移考点**）。

**review 会话**（`grammarReviewService.ts:142-180`，停用词仅 7、按 `reviewCount % 候选数` 轮转）：候选＝句内全部长度>2 非停用词 → **三候选 100% 可抽中**（含 rang/while/use/didn't）✅✅。

**建议**：**乙的 target 写 `When I was reading, the phone rang.`**（ambush 落 was、boost 落 reading/rang、review 全中——三套都出得来题）。

---

## 4. 基建护栏（大章节）

| 护栏 | 现状（实读） | 动作 |
|---|---|---|
| **season-15** | `grammarSeasons.ts:44` 末项 season-14={87,94}；**无 season-15** → 不上线即被路径页静默过滤，`grammarSeasons.test.ts:12` 逐课断言先红 | 追加 `{min:95, max:95+N-1}`；测试不限一季课数 |
| **m17** | `GrammarPathPage.tsx:226-232` m16=afterLesson 94；**无 m17**；**全仓无测试引用 mN** | 追加 m17（判 `number <= afterLesson`）；**纯纪律项** |
| **episode** | 止「小美的一天 九十四」；九十五…**一百全 0**（格式自 L51 起为汉字） | 续写「九十五…」；**>100 写法无先例**（建议控在 ≤100） |
| **案号/连续性** | max #103 → **下号 #104**；1–103 连续无跳号；`huntService.test.ts:215` 断言孤儿恰 5 | 104 起连续；**新案必被引用且 reviewed**（R13/R15）；番外 5 案冻结 |
| **案件池** | 每案错点 `{2:10,3:10,4:80,5:2,6:1}`；每课引用 `{0:5,1:80,2:8,3:1}`（空案 L2/3/5/6/8） | 新批「新错 2＋旧错 2」；**8 课需 #104–#111** |
| **关 1 解锁** | `lessonService.ts:143` 用 `number - 1` → **缺号永久锁死无报错** | 95 起连续无跳号（人工核对） |

---

## 5. 封面池专章：单次池 vs 二用升三用

**容量账（49 张 / 94 处引用）**：单次池 **12**（cover13·14·15·22·27·37·38·40·41·45·47·48）·二用池 **29**·**三用池 8**（cover10/16/18/20/21/26/31/32，第三次在 L87–L94——**批十四刚三用，本批与下批勿碰**）。

### 5.1 二用池「三用后最小间距」排序（批十五 L95–L102 取最优落点）

| 封面 | 已用 | 间距（前/后） | 判定 |
|---|---|---|---|
| **cover12** | 12,67 | 55/35 | ✅ **首选** |
| **cover17** | 17,71 | 54/31 | ✅ 首选 |
| **cover39/36/35/34/33/43/24/9** | 33–73 | **29–30**（均落 L102） | ✅ 可升（最优 8 张） |
| cover23/19/29/28/30/7/42 | 51–77 | 25–28 | △ 备选 |
| cover46/44/25/1–6/8/11 | 68–86 | 16–24 | △ 勉强（压后） |
| **cover49** | 49,58 | **9** | ❌ **禁用** |

**可升 8 张理由**：二次用均落 L63–L73（距今 22–32 课），第三次落 L102 时两段间距均 ≥29；cover1–8/11 的二次用落 L79–L86（批十三刚用），第三次必然贴太近。

### 5.2 政策建议：**本批优先单次池，批十六起再全面三用**

8 课 L95–L102 匈牙利瓶颈实算：**8 张单次池＝62**（L95←14·96←13·97←27·98←22·99←15·100←38·101←37·102←40）｜6 单次＋2 三用＝31｜4 单次＋4 三用＝30｜**纯三用＝29**（L95←36·96←35·97←34·98←33·99←24·100←12·101←17·102←9）。

**批十六**：单次池用光后纯三用瓶颈 **32、覆盖 16/16 可行**。**若只做 6 课**：单次池瓶颈 **63**，余 6 张留批十六（两批联合最优：T=35 覆盖 16/16，T≥40 掉 13/16）。**兜底**：`cover` 在 `types.ts:590` 可选、缺省回退 scene SVG。

---

## 6. boost 联动检查（**批十四刚踩过 → 批十五硬护栏**）

**测试逻辑实读**（`grammarBoostService.test.ts:159-181`）：全库**逐课**（无豁免）反复复练抽干改错池（10 轮），只统计 `kind === "spot"` 的**不同题源**，`collected.size < 2` 即 `thin` → `expect(thin).toEqual([])`。**改错题两来源**（`grammarBoostService.ts:498-543`）：① `guided.spot`（每课 1 道）；② **contrast 卡里 `!bothRight` 且 `wrongMark` 可在 `wrong` 词块中定位**的条目（`:174-193`：切词→去尾标点→匹配，返回空则不出题）。

**现状实测（真 vitest 探针，跑完即删）**：全库 94 课全部 ≥2 道；**贴线（恰 2 道）12 课**：L72·73·79·80·81·85·**87·88·89·90·91·92**——**批十四 8 课里 6 课贴线**。批十四细账：**L87–L92 各 2 道（contrastSpot=1＋guided=1）**，**L93/L94 各 3 道**。contrast 全库 **564 张**（bothRight 168／**带 wrongMark 错卡 348**），**347 可定位、1 失败**（**L89 `What a nice day?`，wrongMark 是标点 `?`**，会被 `cleanWord` 剥掉）。

### G-boost（**请写入批十五 PRD 硬需求项**）

> **G-boost**：**每课必须产出 ≥2 张「带 wrongMark 且可定位」的真实错卡（来自 contrast，`!bothRight`）**；口径＝「每课 contrast 至少 2 条：`wrongMark` 非空、非 bothRight、且字面词出现在 wrong 句里」。**推荐 3 条**（批十四 L93/L94 即 2 contrastSpot＋1 guided 的最舒适形态），**禁止贴线**（`:159` 全库逐课断言，任一课贴线即红线）。附带：`wrongMark` **不得为标点**；多词语标注可用（`:190-216`）；`guided.spot` 每课必配（94/94 均存在）。

**同批其余 boost 红线**：① 档 1 **≥4 种题型**（`:218`）；② 档 2 **≥4 题**（`:411`）；③ 档 3 **produce＋variant＋fix 齐备**（`:440`）；④ 带干扰项 practice **≥2 道可抽 arrange**（`:388`）；⑤ **题源不撞号**（`:183`）。

---

## 7. 可生产性评估

| 候选 | 就绪度 | 生产量 | 风险 |
|---|---|---|---|
| **甲 使役章** | ★★ | 结构整条新造（零底座）＋3–4 课增量（makes／made／否定／回收 let·help） | **与 L74/L75 语义抢位最重**（L74 已占 let＋help 的 50/52 处）；「做蛋糕 vs 让我做」须显式区隔；`makes` 为新增屈折点 |
| **乙 过去进行深化章** | ★★★ | 中量：平台（L34 36 处）＋contrast 6 张现成；须新造 while／打断动词／「背景＋打断」框架 | `while/rang` 不在 ambush 词表（落点退到 was，可接受）；**「同句双动词」零先例**是全批最难缺口；时态缝合是唯一新点 |
| **丙 深化散章** | ★★★ | 最小：L93 三态＋#102/#103 已建 | **增量不足以撑 6–8 课**（净增量仅「d 转移」） |
| **丁 混合** | ★★ | 甲/乙 各半 | 双拱破例（批十四刚用）；一课一增量难守 |

**就绪度排序：乙 > 丙 > 甲 > 丁**（**与批十四排序相反**——批十四取走天气/感叹/used to 后，留下的正是乙的纵深位）。**「零新语料」达标 0 项**。**乙的推荐形态**：L95 复现 → L96 when＋过去进行（背景）→ L97 打断动词（rang/knocked）→ L98 while（同时）→ L99 过去进行 vs 一般过去（**同句双动词，最大新造点**）→ L100 叙事收口。

---

## 附录：核查留痕

**测试实跑**：`npx vitest run` → **54 文件 / 674 项全绿，3.83–3.93s**（五次一致）。**boost 探针**：临时 vitest 实跑改错池分布，**探针已删**。**实读源文件（12）**：GL(17,588 行/串 16,896)·HC(6,245/4,332)·`grammarSeasons.ts`＋test·`GrammarPathPage.tsx`·`grammarAmbushService.ts`·`grammarBoostService.ts`＋test·`grammarReviewService.ts`＋test·`huntService.ts`＋test·`lessonService.ts`·`types.ts`·批十四路线图。**raw grep 交叉验证**：`make` GL 0/HC 5；`lets` GL 1＝id 串伪命中；`while/rang/knock/doorbell` 0/0；`used` GL 66/HC 9（两义逐处分离）。**md5**：GL `5908361205b08da1e99b4abd3f5a53d0`·HC `a504dadb7baa097ecd3cc3d9f2ed121a`·seasons `8333601a2f088bdae2750c5a734cc3a9`·ambush `84b306b40e881c4f9b8c8d000851686c`·boost `f5b2bb56917cdd1f4bd3a02cfc54b03d`。**未核实**：① 批十五课数与形态未定；② §5.2 与批十四预告相左须裁决；③ `while/rang` 是否进 ambush 词表；④ 乙「同句双动词」难度分级待瑞思裁定；⑤ 封面仅按编号间距排序、未做图像语义核对；⑥ 课号 >100 时 episode 汉字写法无先例。

---

> 本报告由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。
