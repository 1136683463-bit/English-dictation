# 数据盘点：第十三批·大章节候选（6–8 课）

**日期**：2026-09-19 ｜ **类型**：实读代码/文件盘点（无数仓、无真实用户数据）｜ **成员**：数析
**方法**：实读源文件＋逐短语读上下文计数（python 一次性脚本，跑完即删）；cloze 复刻实跑（两套抽词器）；全量测试实跑；护栏逐行实读。口径＝两数据文件引号内字符串（状态机提取、跳注释），关键数字与 raw grep 交叉验证。**范围**：A 方位介词 / B 天气 / C 时间连词 / D 不定代词 / E 感叹句 / F used to / G whose。

---

## 指标概览

| 指标 | 本期（实读） | 上期 | 状态 |
|---|---|---|---|
| 课程 / 案件 / 错点 | **78 课（L1–78）/ 87 案（#1–87）/ 322 错点** | 75/84/310 | ✅ |
| 罪名（错点数/承载案数） | verb_form 77/46·plural 53/50·preposition 46/41·sv 41/32·word_order 34/24·missing_be 20/16·tense 17/13·article 17/12·fragment 9/8·run_on 8/6 | 同序 | ✅ |
| **A 方位介词** | next to / in front of / behind / between / across **全 0**；near 16 全在 L26「near here」；L18 只教 in/on/at → **真空白** | — | ⚠️ |
| **B 天气** | raining 8·sunny 8·cold 45·windy 6·snow 16·weather 4；`It's` 全库 2 处且**非天气** → **与 L6 高重复** | — | ⚠️ |
| **C 时间连词** | before/after **从句均 0**；when 从句**仅 L78 一句认读** | — | ⚠️ 真空白 |
| **D 不定代词** | something 2·anything 1·**nothing 0**·someone 6·everyone 3·somebody/anybody/nobody 0 | — | ⚠️ 近空白 |
| **E 感叹句** | `What a` raw 25 → 真感叹仅 **1**（L68 NPC 台词）；`How + 形` **0** | — | ⚠️ |
| **F used to / G whose** | used to **0**（`use` 仅案 #28 一个 token）；whose **2 处同一句**（L33），关系代词 0 | — | ⚠️ |
| 封面 / episode / 案号 | 49 张用 78 次，**单次池 20 张**；episode 止「七十八」；**下号 #88** | 单次 23 | ✅ |
| 测试 | **54 文件 666 项全绿（5.42s）** | 54/666 | ✅ |

## 洞察

1. **七候选只有 B 有真底座，且与 L6 高度重叠**——L6 已把 cold/sunny/raining/hot 作教学句教过（raining 就在 contrast 里），B 立住的前提是换角度（`It's` 缩写＋windy/snowy 扩展），否则就是复课。
2. **A/C/D/E/F/G 全为真空白或近空白**，与批十二 B1 五组同性质（「批十余项收尾」非新欠账）。**A 是唯一「零新语料可造＋前置已就位」**（地点名词池厚、L18 已铺「小词」概念；唯一缺词 **bank 全库 0**）；**C 性价比最高**（连词线 and/but→because/so→if 已立，when 从句仅 1 句认读、before/after 连词 0，且 fragment/run_on 罪名最薄恰是落点）。
3. **E/F/G 考点薄**：E 的 10 枚举只能考 a 与语序；F 连 `use` 动词底座都没有；G 真价值不在疑问词（L33 已有 1 句）而在**关系代词 whose**（接 L39 who / L40 which）。
4. **大章节基建零硬约束**：`grammarSeasons.test.ts` **无任何「一季课数」断言**；网格 `auto-fill` 与侦探页分组对课数无感。**唯一隐性硬约束是课号必须连续**（`lessonService.ts:143` 关 1 用 `number - 1` 找前课，缺号即永久锁死且无报错）。封面单次池 20 ≥ 8，够用。

---

## 1. 语料盘点（逐短语读上下文）

**A 方位介词**：`next to`/`in front of`/`behind`/`between`/`across`/`opposite` **两文件全 0**。`near` GL 12+HC 4：GL 全为 L26「Is there a park near here?」及其变体/practice；HC 四处是 `near the river/window/door/school` 的地点状语（案 #11/#35/#49/#50），非教学句。`under` 5 处全在 L26。**L18 实教**（target `My hat is in the box.`）：只有 in/on/at 且地点＋时间双用，contrast 六条全在 in/on/at 互换——**方位介词大族零覆盖**。

**B 天气**：raining 6/2（**L6 contrast 教学句**「It is raining.」，错句 It is rains.；L34「It was raining.」；案 #43 rain→raining）·rain 34/5（L12 `It will rain.`、L48 `If it rains…`）·sunny 7/1（**L6 examples/sceneSwings**；L48 `If it is sunny…`；**L78 `When it is sunny…`**）·cold 43/2（**L6 14 处**、L19 10、L20 15）·windy 6/0（L19「It was windy, but we were happy.」连词课的皮）·snow 10/6·weather 3/1·hot 25/5。**snowing/snowy/cloud 全 0**；**`It's` 缩写仅 L24 两处且非天气**，全库无 It's raining/sunny/cold。

**C/D/E/F/G 一句话结论**：**C** before 2 处全介词义（案 #32/#41）、after 10 处全 L9「after school」——**+从句均 0**；when 41 处中约 36 是疑问词，**时间从句仅 L78 一句**。**D** something 2（L15 练习词块）·anything 1·**nothing 0**·someone 6（L33 台词＋L50/51/54 对照句）·everyone 3（案内）；somebody/anybody/nobody **全 0**；L30 已立 some/any 与 much/many，**案 #39 把 some→any×2、many→much 全标 `article`**。**E** `What a` raw 25 筛除后 21 处是 `What are you…?`、2 处 `What about you?`、**真感叹仅 1 处**（L68 NPC 台词，非 target/contrast 无讲解）；`How + 形` **全 0**。**F** used to/use to 0、used 0、`use` 仅案 #28 token（使用义且本身即被考对象）。**G** whose 2 处同一句（L33 台词），L33 label 是指示代词、contrast 全在 my/mine/hers——**关系代词 whose 0**（L39 who 139·L40 which 98）。

---

## 2. 罪名承载预判（10 枚举零扩展）

| 候选 | 拟植错 | 承载罪名 | 先例 |
|---|---|---|---|
| A | `*next the bank`（丢 to）/`*behind of the door` | **preposition** | 46 错点/41 案，但全是 in/on/at/by/from/as/for/to 互换，无一处 next to/in front of/behind/between |
| B | `*It raining now.`/`*It is rain.` | **missing_be** / verb_form | missing_be 20/16；verb_form 77/46 |
| C | `*before eat`/`*When I am tired I go to bed.`（粘连） | **run_on** / fragment | run_on 8/6（#7/#15/#18/#27/#28/#40）；fragment 9/8（#28 Because→去掉） |
| D | `*don't want something`/`*nice something` | **article** / word_order | **#39 some→any×2 + many→much 全标 article** |
| E | `*What beautiful day!`/`*What beautiful a day!` | **article** / word_order | article 17/12（#25/#26/#39）；word_order 34/24（#34 How→What·#42 形容词语序） |
| F | `*I use to play here.`/`*didn't used to` | **verb_form** | 77/46（同族 cans→can·musts→must） |
| G | `*Who's book is this?`/`*the boy who's father is…` | word_order / **fragment** | word_order 34/24；fragment 9/8（#39/#40 wears→who wears） |

全落 10 枚举内。枚举**不可动**：`GRAMMAR_ERROR_TAGS` 10 项，`huntService.test.ts:109` 断言 `toHaveLength(10)`；`comparison` 仅在 LABELS 里、不在枚举数组。

---

## 3. cloze 落点预演（R-B8 最新词表）

**词表实读**（`grammarAmbushService.ts:160-187`）：**145 条 / 144 个不同词**（`would` 重复两次）；停用词 29。三级：①表内语法词 → ②长度≥3 非停用实词 → ③第 2 词。落点实测：

| 核心句 | 空位 | 判读 |
|---|---|---|
| The shop is next to the bank. / The car is in front of the house. / The ball is between… / The cat is behind the door. | **is**×4 | ✗ 考点一律不落空 |
| It is raining now. / It is sunny today. / It was windy yesterday. | **is/is/was** | ✗ 全落 be |
| When it is sunny, I run… / I want something to drink. / There is nothing in the box. / Someone is at the door. / Whose book is this? | is / want / is / is / is | ✗ |
| He sits behind me. / I wash my hands before I eat. / After I do my homework, I watch TV. | sits / eat / do | △ 落主句动词 |
| **What a beautiful day!** / **How nice!** | **What / How** | ✓ 正中考点 |
| I used to play here. / She used to live… | play / **used** | △/✓ |

**汇总**：A/B/D/G 系统性失手（全落 is/was/want）；C 落主句动词；**E 2/2 全中**；F 1 偏 1 中。**对照复习会话抽词器**（`grammarReviewService.ts:167-176`，停用词仅 7 词）：`next`·`raining`·`sunny`·`before`·`something`·`used` 均可抽中 → **新候选宜以复习会话 cloze/rebuild 为主承载**；回马枪 cloze 对 A/B/D/G 会抽空 be。扩表＝改代码，不在数据批内。

## 4. 基建护栏

| 护栏 | 现状 | 动作 |
|---|---|---|
| **season-13** | season-12={76,78}（`grammarSeasons.ts:42`），无 season-13 → `grammarSeasons.test.ts:16-25` 与 `:44-49` 先红 | 追加 `{min:79,max:79+N-1}`；**测试不限一季课数** |
| **m15** | m1–m14，m14=afterLesson 78（`GrammarPathPage.tsx:211-216`），**无测试引用** | 追加；纯纪律项 |
| **episode** | 止「七十八」；七十九/八十…八十八 **两文件 0 命中** | 续写「七十九…」；零冲突 |
| **封面** | 单次池 **20 张** = cover 1·2·3·4·5·6·8·11·13·14·15·22·27·37·38·40·41·45·47·48 | 8 课需 8 张（见 §5） |
| **案号 / 连续性 / 新案** | max #87 → **下号 #88**；`lessonService.ts:143` 关 1 用 `number - 1`；`huntService.test.ts:215` 断言孤儿恰 5 个 | 79–86 连续无跳号（缺号永久锁死）；新案必被引用且标记 reviewed |

## 5. 封面池专章：大章节取数 vs 容量

**容量账**：20 张 vs 单季 8 课 → 本轮够用；连开两批 16 课会吃光。
**建议①（首选）按「首用最早」取 8 张**：`cover1·2·3·4·5·6·8·11`（首用 L1–L11，距今 68–85 课，重复感最低）；只做 6 课取 cover1–6。反之 cover47(L47)·48·45·41·40 近 30 课内刚出现，压后。
**建议②（池见底时）启用三用，按三用后最小间距排序**：cover30（30→56，≥26）·cover28（28→55，≥24）·cover23（23→51，≥28）·cover24（24→53，≥26）> cover44（≥11）·cover46（≥9）；前三优于「近期双用」的 cover43（43→72，仅隔 7）与 cover25（25→78，仅隔 1）。
**建议③兜底**：`cover` 可选，缺省回退 `AdventureScene` SVG → **封面不足不阻塞上线**。

## 6. 案件池现状

**87 案（#1–87）/ 322 错点**，分布 `{2:10,3:10,4:64,5:2,6:1}`；引用点 83、去重 **82 案**（`hunt-my-sister` 被 L14 与 L25 各引一次，唯一重复）；**每课案数** `{0:5,1:64,2:8,3:1}`，空案课 L2/L3/L5/L6/L8（决策⑤）。**番外 5 个**：hunt-white-cat·sports-day·pen-pal-letter·fridge-note·term-review（与断言一致，**综合课不得引用**）。批十二 3 案均 4 错 reviewed：#85 word_order×2+plural+preposition·#86 verb_form×2+…·#87 word_order+verb_form+…。**罪名承载案数**：plural 50·verb_form 46·preposition 41·sv 32·word_order 24·missing_be 16·tense 13·article 12·**fragment 8·run_on 6（最薄，恰是 C/G 落点）**。

## 7. 可生产性评估

| 候选 | 就绪度 | 生产量 | 风险 |
|---|---|---|---|
| **A** | ★★★★ | 4 短语各 1–2 句 | bank 全库 0；回马枪 cloze 落 is |
| **B** | ★★★★★ | 少量（It's 缩写＋扩展词） | **与 L6 高度重叠**，不换角度即复课；windy/snow 已被 L19 占用 |
| **C** | ★★ | 新造 3 词×2 句 | 与 L27 疑问词 when、L48 if 辨析；连词线三季已密集 |
| **D** | ★★★ | 少量（4 词） | 与 L30 some/any 分工；形容词后置是新语序点；双重否定易超纲 |
| **E** | ★ | 需新造 | **考点薄**（只能考 a 与语序），宜作收口加料 |
| **F** | ★ | **整课新造** | 与 L10/L11 过去时边界模糊；used to vs be used to doing 易混 |
| **G** | ★★ | 少量 | 疑问词 whose 与 L33 已有 1 句重叠；真价值在关系代词 |

**就绪度排序：B（换角度）≈ A > C > D > G > E > F。严格「零新语料」达标：0 项。**

---

## 8. 大章节额外检查：一季课数的隐含约束

实读 `grammarSeasons.test.ts`（48 行）与 `GrammarPathPage.tsx`（643 行）：**测试层零课数约束**——4 条断言＝①课号落区间 ②区间不重叠且 min≤max ③label/hint 非空 ④最高课号被覆盖，**无 `length===N`、无一季课数、无季数上限**，6 课（79–84）与 8 课（79–86）均通过，且只查不重叠、不查接续。**路径页（`:599-637`）**按 [min,max] 过滤 → 空季 `return null` → 网格 `repeat(auto-fill, minmax(240px,1fr))`（`styles.css:17752`）按容器宽度自动列数，**6 张与 8 张视觉无差**；**侦探页（`GrammarHuntPage.tsx:117-129`）**按 `unlockLesson.number` 复用同分组。**默认展开（`:349-357`）**取「下一课」所在季、全学完取 `LESSON_GROUPS[length-1]`——season-13 自动成为新末季；**can-do（`:364-369`）**按 `number <= afterLesson` 判定。**唯一隐性硬约束**：`lessonService.ts:139-147` 关 1 解锁用 `number - 1`，**79–86 必须连续**。统计 `total = grammarLessons.length`（`:351`）全自动，全库无硬编码 78/75/71。**结论：大章节在展示层与测试层零阻塞。**

---

## 附录：核查留痕

**测试实跑**：`npx vitest run` → **54 文件 / 666 项全绿，5.42s**（批十二 3 案与 boost 工作流三测试文件均通过）。**实读源文件（13）**：`grammarLessons.ts`(14,553 行/串 14,030)·`huntCases.ts`(3,723 行/串 3,709)·`grammarSeasons.ts`·`grammarSeasons.test.ts`·`grammarLessons.test.ts`·`GrammarPathPage.tsx`·`GrammarHuntPage.tsx`·`grammarAmbushService.ts`·`grammarReviewService.ts`·`huntService.ts`·`huntService.test.ts`·`lessonService.ts`·`styles.css`。
**口径与零改动**：引号串状态机提取（跳 `//`、`/* */`），raw grep 交叉验证（`What a` raw 25 ↔ 语境筛后 1；`window` 157 误命中已剔除、`windy` 6 已分离）。只读盘点，脚本写 `/tmp` 已删；md5 复核一致（grammarLessons `a0e0cb87…`·huntCases `6d2cd862…`·grammarSeasons `be72813c…`·GrammarPathPage `339fe72f…`·grammarAmbushService `84b306b4…`·huntService `ee1f22bf…`）。

**未核实**：① 79 起的具体课数与组合（6/8 未定）；② 20 张单次封面未做图像核对；③ C 的 when/if 辨析 vs L27 疑问词干扰量无数仓可测；④ 79–86 连续性无守门需人工核对；⑤ `bank` 新增是否超出核心 500 词待瑞思判断。

---

> 本报告由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。
