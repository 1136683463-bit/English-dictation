# 数据盘点：第十七批·大章节候选（6–8 课）

**日期**：2026-09-19 ｜ **类型**：实读代码/文件盘点（无数仓）｜ **成员**：数析
**方法**：状态机提取引号内字符串（跳 `//` 与 `/* */` 注释、按顶层 `  {` 块归属「行号→课号/案号」映射）；GL 命中 **19,811 条串**（英文串 12,365／讲解串 7,446），HC 命中 **4,962 条串**（英文 3,962／讲解 1,000）；`grammarAmbushService.ts:160-212` 的 `GRAMMAR_WORDS`＋`CLOZE_STOP_WORDS`＋`pickClozeWord` **逐字复刻**为 Node 脚本实跑（含 boost 档 1 `buildCloze` 40 seed 扫）；封面指派用**二分答案＋二分图完美匹配**求最优值、再用**穷举（9 张可用 × 排列）**验证 max-min 与 max-sum 双目标；boost 池用**真 vitest 探针**实跑（跑完即删）。口径＝引号内字符串，按「全英文串／讲解串」二分。所有 raw 计数均用 `grep -c` 交叉验证。
**范围**：候选池＝甲 `have sth done`（have/has/had＋物主＋名词＋过去分词）／乙 `be·get used to`（B1，区别于 L93·L100 的 `used to`「从前常」）／丙 `look like`／丁 真空白功能词（`so that`·`as soon as`·`neither`·`either`·`both`·`already`·`yet`·`such`·`the same as`·`Thank you`·`Excuse me`·`would rather`）／戊 机制深化。

## 指标概览

| 指标 | 本期（实读） | 上期（批十六审计） | 状态 |
|---|---|---|---|
| 课程 / 案件 / 错点 | **110 课 / 119 案 / 450 错点** | 102/111/418 | ✅ |
| 罪名（错点/承载案） | verb_form **103/66**·plural **80/75**·sv_agreement **61/49**·preposition **56/51**·word_order **40/28**·tense **36/28**·article **24/18**·missing_be **22/18**·run_on **14/12**·fragment **14/13** | 93/58·73/68·53/43·56/51·40/28·29/23·24/18·22/18·14/12·14/13 | ✅ 全线上行 |
| 封面池 | 49 张用 **110** 次（**单次 0·二用 37·三用 12**） | 49 张/102 次（单次 4·二用 37·三用 8） | ⚠️ **单次池已枯竭（0 张）** |
| 案号 | max **#119**，1–119 **连续无跳号**；`reviewed` **119/119** | max #111 | ✅ 下号 **#120** |
| 课号 | 1–110 **连续无跳号**（`lessonService.ts:156-159` 用 `number - 1`） | 1–102 | ✅ |
| 基建 | season-16 `{103,110}` 已在位；m18 `afterLesson:110` 已在位；episode 止「一百一十」 | season-15/m17 | ✅ 须续 season-17/m19 |
| **have sth done** | `have/has/had＋物主＋名词＋PP` **GL 0 / HC 0**；`will have` **0/0**；`'ll` **0/0** | 0/0 | ❌ **零底座，跨级** |
| **be/get used to** | `be used to` **0/0**、`get used to` **0/0**、`got used to` **0/0** | — | ✅ **真空白** |
| **used to（从前常）** | GL **120 处 / 113 串**（L93 47·L94 8·L100 48·L101 7·L102 10）；HC **3**（#102·#109×2） | 同 | ⚠️ **已教两轮，不能重开** |
| **look like** | `looks like` **GL 1**（L49:8909，dialogue 单句）；`look like` **0** | — | ⚠️ **半曝（一句对话，无讲解无练习）** |
| 测试 | **58 文件 / 721 项全绿（4.32s）**；`tsc --noEmit` **0 错** | 54/674 | ✅ 基线已上移 |
| G-boost | 42 项全绿；thin(＜2 改错题)＝**0 课**；contrast **660**（bothRight **221**／带 wrongMark **391**）；纯标点 mark **0** | thin=0；contrast 612 | ✅ **L96/L102 缺陷已回修** |

## 洞察

1. **批十六把「使役」补完后，中文高频结构缺口只剩一处成体系的：`have sth done`——但它零底座且跨级。** 实读 `have/has/had＋物主＋名词＋过去分词` 两文件 **0/0**（§1.1），`will have`／`'ll` **0/0**（§1.2）——`I'll have my hair cut` 的**两个零件都不在库**。而 `hair` GL **0**（全库唯一 `hair` 在 HC #25:1344 的 `my hair is shorter`）；`cut`／`fixed`／`repaired`／`painted` **GL 全 0**。**结论：甲就绪度 ★★，须整条新造（结构＋词汇＋时态搭档）。**
2. **乙 `be/get used to` 是全库最干净的真空白，且与 L93/L100 有清晰分工。** `be used to` **0**、`get used to` **0**、`got used to` **0**、`gets used to` **0**、`using to` **0**（§1.3）。对照：`used to`「从前常」已由 L93（47 处）与 L100（48 处）两轮教透，HC 侧还有 #102/#109 两张回流卡——**be/get used to 不与它们抢位**（一个是「习惯于」，一个是「从前常」，形态相邻而语义相反，天然是 contrast 素材）。就绪度 **★★★**，但属 B1 级。
3. **丙 `look like` 是「一句话半曝」——全库仅 L49:8909 一句对话，零讲解零练习零案件。** `looks like` GL **1**（L49 dialogue：`It looks like rain.`），`look like` **0**（§1.4）。这句被埋在 L49（should＋if 条件句课）的对话里当天气铺垫，**不是教学点**。就绪度 **★★★**（素材要新造但结构极简，且与 L49 无冲突——L49 没把它当语法点讲）。**风险：一句对话撑不起一课，须配场景池（天气/外观/长相）。**
4. **丁 11 个候选里，`neither`／`either`／`both`／`already`／`yet`／`such`／`the same as`／`Thank you`／`Excuse me`／`would rather` 十个全部真空白（GL＋HC 双 0，§1.5）。** 其中 `both` 的 **raw 221 次全是 `bothRight` 字段名**（非英文语料，`grep -o '\bboth\b'` ＝ **0**）；`already` 的 **raw 1 次是注释**（`grammarLessons.ts:9953` 的 `// R8 跨课复现：第 53 课（already 版）`，正文里已改用「已经」中文表述）。**这两个是「假命中」，判定仍为真空白。** `so that` raw 1 次是 L102:18941 的 `So that was last night!`（指示代词 so＋that 从句，**不是目的连词**）；`as soon as` **0/0**。**丁的规模适合做「功能词补完章」，但 11 个点彼此无语义家族关系，一课一增量难守。**
5. **封面政策本批必须换挡到「纯二用升三用」，且可用张只有 9 张。** 单次池 **0 张**（批十六按路线图把 41/45/47/48 吃完）；三用池 12 张**全部内部段距 ≤36 且第四用最优值 ≤31（§5.3），本批与下批勿碰**；二用池 37 张中**只有 9 张**（1·2·3·4·5·7·25·29·42）的「三用后最小间距」天花板 ≥35。**最优指派：max-min＝35，穷举证明为全局最优（§5.2）**；8 课方案 `L111←7、L112←42、L113←25、L114←1、L115←2、L116←3、L117←4、L118←29`（间距 35×7＋43）。**B 计划：`cover` 在 `types.ts:590` 为可选，缺省回退 scene SVG——池耗尽不阻断上线。**
6. **基建侧 season-16／m18 已随批十六落地，批十七须续 season-17／m19，且 season 测试会先红。** `grammarSeasons.ts:50` 末项 `{id:"season-16", … min:103, max:110}`；`GrammarPathPage.tsx:240-245` 末项 `can-do-m18 / afterLesson:110`（全库 **18 个里程碑**）。`grammarSeasons.test.ts` **4 项守门**（区间覆盖／互不重叠／label·hint 非空／最高课号被覆盖）——**忘加 season-17 会立刻红，不会静默**。**mN 全仓无测试引用（纯纪律项）。** episode 写法：`一百一十`（`:20419`）→ **下一个写「一百一十一」**（`一百零N` 与 `一百一十` 两种格式都已各有多例先例）。
7. **G-boost 出现两处与上期审计不同的实质变化，且都是正向。** ① **L96/L102 的 `wrongToken` 已回修**：两课现在都写 `tokens:["It","was","rain."]`＋`wrongToken:"rain."`（`:17902-17903`、`:19041-19042`），**逐字相等，缺陷消除**；代码侧 `grammarBoostService.ts:514-518` 另加 `cleanWord` 兜底（`token === wrongToken || cleanWord(token) === cleanWord(wrongToken)`，HEAD 版为严格 `===`）。② **新增 bothRight 双正解题型**：`candidates.bothright`（`:591`）＋固定轮转槽位 `["bothright","cloze","choice","contrast"]`（`:675`），测试新增 3 项（`:645-685`）。**全库 thin＝0（11 门贴线 2 道：L72·73·79·80·81·85·87·88·90·91·92）。**
8. **cloze 落点侧，批十七候选句全部可落，唯一已知死角仍是 `As`（2 字母）。** 6 个指定候选句 ambush 落点分别为 `have`／`had`／`got`／`I'm`／`is`／`looks`（§3）。**`As` 在 ambush 走第 ① 条命中（`as` 在词表内），但 boost 档 1 的 `keywordIndexes` 要求 `length>=3` → `As` 永不成为空位**（`grammarBoostService.ts:210-217`；实测 `'As'.length=2`）。**`until`／`waited` 不在 ambush 词表（`:160-187` 实读 OUT），`makes`／`lets`／`got`／`looks` 在表内（IN）**——批十七若用 `until` 须走「②实词回退」，落点仍可保证。

---

## 1. 语料盘点（逐短语读上下文）

口径说明：**GL** ＝ `src/data/grammarLessons.ts`（19,811 条引号串）；**HC** ＝ `src/data/huntCases.ts`（4,962 条）。「英文串」＝ 全串仅含 `[A-Za-z0-9'’,.!?;:-]`（GL 12,365 条）。**讲解串**＝含中文的串（GL 7,446 条），其中的英文片段仍会被短语命中——下表「GL 命中」为**串命中数**，并另列「英文串命中数」以示曝光强度。

### 1.1 甲 · `have sth done`（have/has/had ＋ 物主词 ＋ 名词 ＋ 过去分词）

**核心结构：两文件 0/0（真空白）。** 逐层验证：

| 模式 | GL 命中 | HC 命中 | 明细 |
|---|---|---|---|
| `have/has/had + 物主(my/her/his/your/our/their) + 名词 + 过去分词` | **0** | **0** | — |
| `have` + 物主词（任意后续） | **1** | 0 | 唯一：`grammarLessons.ts:4103` L23 `"Don't worry. I have my key here."`——**have＝拥有义**，非使役 |
| `have/has/had + 名词 + 过去分词`（不要求物主） | **32** | 2 | **32 处中 29 处在 L53/L54（现在完成时＋被动）**，如 `:9645` `The window has been cleaned.`（×21）；余 3 处：L21 `:3775` `Have you done your homework?`、L22 `:4027`（讲解）、L23 `:4147` `Have you cleaned your room?`。**全部＝完成时，无一为使役** |
| `have/has/had + 宾格(me/him/her/us/them/it)` | **0** | 0 | ——**注意**：`had me` 的 **raw 53 次全部落在 L107**（`The teacher had me come early.`），但结构是 `had＋人＋动词原形`（使役第三型），**不是 `have sth done`**（§1.1 已排除） |
| `got + 物主` | **0** | 0 | — |
| `have it/them + 动词` | **0** | 0 | — |

### 1.2 甲 · 时态搭档（`will have` / `'ll`）

| 模式 | GL 命中 | HC 命中 | 明细 |
|---|---|---|---|
| `will have` | **0** | **0** | 连写形式零出现 |
| `'ll`（含 `I'll`／`you'll`／`we'll`／`it'll`…，直撇与弯撇 `’` 均扫） | **0** | **0** | **全库零 any-ll 缩写**（脚本 `[A-Za-z]['’]ll\b` 两文件 0 命中） |
| `will`（全形，独立词） | **264**（英文串 **150**） | **25** | GL：L12 **86**·L38 **62**·L48 **74**·L29 16·L49 9·L109 8·L13 3·L32 3·L14 2·L62 1 |
| `I'm` / `It's` 类缩写（对照） | **411**（`don't` 151·`It's` 101·`doesn't` 66·`Let's` 31·`Don't` 22·`didn't` 20·`can't` 7·`isn't` 6·`won't` 5·`I'm` 1·`You're` 1） | — | **缩写教学存在（L87「两个词挤一挤」），但 `will` 的缩写 `'ll` 是独立空白** |

> **判定**：`I'll have my hair cut.` 的 **`'ll` 与 `will have` 双零件均零底座**；现有 `will` 教学（L12/L38/L48）全部用**全形**，从未教缩写。批十七若做甲，**须把 `'ll` 作为一课增量单列**（或改主句为 `I will have my hair cut.` 以规避）。

### 1.3 甲 · 过去分词形态在库覆盖（逐个实读）

| PP | GL 命中 | 分布（课号→次数） | HC 命中 | 判定 |
|---|---|---|---|---|
| `cut` | **0** | — | **0** | ❌ **真空白** |
| `cleaned` | **126** | L53 **58**·L51 **48**·L54 13·L23 5·L52 2 | 16（#60 6·#62 8·#33 1·#63 1） | ✅ **厚底座**（被动＋完成时双平台） |
| `fixed` | **0** | — | **0** | ❌ **真空白** |
| `repaired` | **0** | — | **0** | ❌ **真空白** |
| `washed` | **3** | L51 3 | 0 | ⚠️ 薄（仅 `The cups were washed.`） |
| `painted` | **0** | — | **0** | ❌ **真空白** |
| `taken` | **34** | L54 **34** | 4（#63 4） | ✅ 单课集中（L54 `was/were taken by`） |
| `made` | **73** | L104 **64**·L68 4·L110 4·L107 1 | 6（#113 5·#32 1） | ✅ 厚（但 **L104 全是使役 `made me wait`**，非 PP 义） |
| `done` | **45** | L21 **33**·L50 4·L22 3·L53 2·L64 2·L24 1 | 6（#29 3·#33 3） | ✅ 底座在 L21（现在完成时） |
| `written` | **12** | L23 7·L53 3·L52 2 | 0 | ✅ |
| `eaten` | **63** | L52 **48**·L21 11·L54 3·L24 1 | 9（#61 5·#29 2·#32 2） | ✅ |
| `broken` | **78** | L50 **48**·L23 15·L52 5·L54 5·L51 3·L53 2 | 15（#59 8·#63 3·#28 2·#31 2） | ✅ |
| `stolen` | **0** | — | **0** | ❌ |
| `cooked` | **3** | L98 2·L99 1 | 1（#1） | ⚠️ |
| `bought` | **41** | L68 **35**·L11 6 | 6 | ✅ 但 L68 是「为某人买」义 |
| `sold`／`given`／`sent`／`shown`／`checked`／`served`／`delivered`／`built`／`kept`／`held`／`opened`／`worked` | **各 0** | — | 0（`asked` HC 1·`moved` HC 2） | ❌ 全空白 |

> **判定**：**`have sth done` 的四块「常识 PP」（cut/fixed/repaired/painted）全部零底座**，唯一可用的是 `cleaned`（126 处，但全部是 **be＋PP 被动**与 **has been cleaned** 完成被动，**没有一处是 have sth done**）。**零件可借、结构须新造。**
>
> **词汇可用性对照（make 类）：** `hair` GL **0**／HC 1（#25 `my hair is shorter`）；`bike` GL **2**（L3 `I have a new bike.`）；`car` GL **4**；`room` GL **24**；`window` GL **161**；`umbrella` GL **57**；`photo` GL 7；`dress` GL **0**／HC 4（#11 讲解）；`shoe` GL **0**／HC 6。**「剪头发」「修车」「刷墙」的宾语词全在半空白或空白区。**

### 1.4 乙 · `be / get used to`（与 L93·L100 的 `used to` 严格区分）

| 模式 | GL 命中 | HC 命中 | 所在课 | 判定 |
|---|---|---|---|---|
| `be used to` | **0** | **0** | — | ✅ **真空白** |
| `is/are/was/were/am/be/been + used to` | **0** | **0** | — | ✅ **真空白**（含所有变位） |
| `get used to` | **0** | **0** | — | ✅ **真空白** |
| `gets used to` | **0** | **0** | — | ✅ **真空白** |
| `got used to` | **0** | **0** | — | ✅ **真空白** |
| `using to`（错误形态对照） | **0** | **0** | — | — |
| **`used to`（从前常，全口径）** | **120 处 / 113 串**（英文串 **61**） | **3** | **L93 47·L94 8·L100 48·L101 7·L102 10**；HC #102 1·#109 2 | ⚠️ **已教两轮，禁重开** |

> **判定**：`be/get used to` **整族零命中，是全表最干净的真空白**。与之相邻的 `used to`「从前常」由 **L93（`:17208-17260`，47 处，主讲 `I used to play here.`）** 与 **L100（48 处，讲故事版）** 两轮覆盖，且 HC 侧 #102（`:6181`「used to 后面跟原形」）／#109（`:6482`「尾巴上少了 d」）两张回流卡在库——**L100 之后的批十七若做 `be used to`，天然形成「-ing vs 原形」的对比**（`be used to doing` vs `used to do`），**且不会与 L93/L100 撞结构**。
>
> **风险标注（跨级）**：`be used to doing` 是 **B1 结构**（剑桥 U61–U63 段），与 L93/L100 的 A2 定位不连续。**这是一个「级差」问题而非「空白」问题。**

### 1.5 丙 · `look like`

| 模式 | GL 命中 | HC 命中 | 明细 |
|---|---|---|---|
| `looks like` | **1** | 0 | **唯一：`grammarLessons.ts:8909` L49 dialogue `{ en: "It looks like rain.", zh: "有人补了一句：看着要下雨。" }`** |
| `look like` | **0** | 0 | — |
| `look`（全形） | **16**（英文串 16） | — | L27 11·L13 2·L58 2·L60 2·其余单次散在 L19/37/48/49/51/52/65/66/71/72/73/79/83/86/87/88/89/92/96 |
| `looks`（三单） | **8** | — | 同上分散 |
| `look` 家族合计（`look/looks/looked/looking`） | **38 串 / 24 课** | — | L27 11·L13 2·L58 2·L60 2·L73 2·其余 20 课各 1；**无一处讲「看起来像」** |

> **判定**：**`It looks like rain.` 是 L49 对话里的一个「铺垫句」，零讲解、零练习、零对比卡**（`sed` 实读 L49 dialogue 三句：`Any tips for the weekend?` / `It looks like rain.` / `You should take an umbrella if it rains.`——第三句才是教学点）。**判为「半曝」**：用户见过这句话一次，但从不知道 `look like` 是个结构。
>
> **就绪度评估**：结构极简（`look like + 名词`，与已教的 `like`（喜欢）同形不同义，天然是对比点），**但需要一个场景池支撑整课**（天气／长相／外观），而 `hair`／`dress`／`shoe`／`tall` 类描写词在 GL 侧大面积空白（§1.1 末）。

### 1.6 丁 · 11 个候选真空白（逐个实读＋raw 交叉验证）

| 候选 | GL 串命中 | HC 串命中 | raw `grep` 交叉 | 所在课 | 判定 |
|---|---|---|---|---|---|
| `so that`（目的连词） | **0** | **0** | GL 1 → `:18941` L102 `"So that was last night!"`（**指示代词 so + that 从句，非目的连词**） | — | ✅ **真空白**（raw 命中为假阳性） |
| `as soon as` | **0** | **0** | GL 0 / HC 0 | — | ✅ **真空白** |
| `neither` | **0** | **0** | GL 0 / HC 0 | — | ✅ **真空白** |
| `either` | **0** | **0** | GL 0 / HC 0 | — | ✅ **真空白** |
| `both`（作限定词/代词） | **0** | **0** | GL raw `` \bboth\b `` ＝ **0**；`both[A-Za-z]*` ＝ **221 全为 `bothRight` 字段名** | — | ✅ **真空白**（221 为假阳性） |
| `already` | **0** | **0** | GL raw 1 → `:9953` **注释** `// R8 跨课复现：第 53 课（already 版）` | — | ✅ **真空白**（正文用中文「已经」） |
| `yet` | **0** | **0** | GL 0 / HC 0 | — | ✅ **真空白** |
| `such` | **0** | **0** | GL 0 / HC 0 | — | ✅ **真空白** |
| `the same as` | **0** | **0** | GL 0；`same` 单独 GL **0**／HC **1**（#31:1822 的 `the same bag`） | — | ✅ **真空白**（`same` 仅 HC 一处、无 `as`） |
| `Thank you` | **0** | **0** | GL 0 / HC 0（大小写均 0） | — | ✅ **真空白** |
| `Excuse me` | **0** | **0** | GL 0 / HC 0（大小写均 0） | — | ✅ **真空白** |
| `would rather` | **0** | **0** | GL 0 / HC 0；`rather` 单独亦 **0** | — | ✅ **真空白** |

**对照参考（库内已有的功能词教学，用于判断上述是否「真缺」）**：`please` GL **91**／HC **10**（已教）；`sorry` GL 2；`How are you` GL 6；`want to` GL 90（已教不定式）；`different from` GL **0**（同为真空白——`structural` 类候选）。

> **判定**：**丁的 12 项（含 `different from`）全部真空白。** 但**彼此无语义家族**：`neither/either/both` 是三连体（可成章），`already/yet` 是完成时搭档（可成章，但 L21/L53 完成时已教、属「补搭档」），`Thank you/Excuse me` 是语用套话（可成章），`so that/as soon as` 是从句连词（可成章），`such/would rather/the same as` 三者互不相干。**「一课一增量」纪律下，丁只能按 2–3 个语义家族组章，不能 11 项平铺。**

---

## 2. 罪名承载预判（10 枚举零扩展）

| 候选 | 拟植错 | 承载罪名（先例） |
|---|---|---|
| 甲 `have sth done` | `*I had my hair cuted.`／`*She have her room cleaned.`／`*I'll have my hair cut it.` | **verb_form 103/66**（最厚；#102 反向同型）／**sv_agreement 61/49**（#34/#48/#112/#115 同型） |
| 甲 | `*I have my hair cut yesterday.`（时态） | **tense 36/28**（#1·#73·#99·#105·#113·#116·#117·#118·#119） |
| 甲 | `*I'll have my hair cut.` 的 `'ll` 形态错（`*I will have my hair cut` 对照） | **verb_form 103/66** |
| 乙 `be/get used to` | `*I'm used to get up early.`（该 -ing 却原形） | **verb_form 103/66**（**与 L93 的 `used to playing` ❌ 完全同型、方向相反——最强对比**） |
| 乙 | `*I am use to getting up early.`（丢 d） | **verb_form 103/66**（#109 `:6482` 同型：`used to` 尾巴少 d） |
| 丙 `look like` | `*It looks like rain.` 正确；`*It looks likes rain.`／`*It look like rain.` | **sv_agreement 61/49**（三单漏 -s，L25/#90 同型） |
| 丙 | `*It looks like raining.`（后接形态） | **verb_form 103/66** |
| 丁 `neither/either/both` | `*Both of them is here.`／`*Neither of them are here.` | **sv_agreement 61/49**（最厚两档之一，#90 `sit→sits` 同型） |
| 丁 `already/yet` | `*I have already finished my homework yet.`／`*Have you finished already?`（位置） | **word_order 40/28**（#7·#9·#15·#37·#41 等）／**verb_form 103/66** |
| 丁 `Thank you/Excuse me` | `*Thank you to help me.`／`*Excuse me, where is the station?`（语用型错难植） | **preposition 56/51**（#35 等）／**word_order 40/28** |
| 丁 `so that/as soon as` | `*I ran fast so that catch the bus.`（该跟从句却跟原形） | **verb_form 103/66**／**fragment 14/13**（最薄档 ⚠️） |

**判定**：
- **承载力最优＝甲与乙**（都吃 verb_form 103/66 这条全库最厚项，且都有同型先例）。
- **丙吃 sv_agreement 61/49（第二厚），承载力次优**——但 `look like` 只有一句半曝，**错型只能靠三单 -s 撑，与 L25 的 `look/looks` 教学重叠风险高**。
- **丁的 `neither/either/both` 也吃 sv_agreement**，但**三项彼此是三连体**，作为 2–3 课小章可行；`Thank you/Excuse me` 属语用型错，**天然难植错（合法句太多），回旋空间小**。
- **枚举不可动**：`huntService.ts:331-342` 的 `GRAMMAR_ERROR_TAGS` 恰 10 项（`types.ts:419` 另含第 11 个 `comparison`，但**全库零使用**、不进 `tagStats`），`huntService.test.ts:109` 断言 `toHaveLength(10)`。**批十七新增错型必须落在现有 10 枚举内。**

---

## 3. cloze 落点预演

### 3.1 ambush R-B8（`grammarAmbushService.ts:160-212` 逐字复刻）

**词表实读**：`GRAMMAR_WORDS` 正则共 **145 个条目 / 144 唯一**（`would` 重复一次：助动词段与短语骨架段各一）；`CLOZE_STOP_WORDS` **30 个**。三级回退：① 语法承载词（词表命中）→ ② 实词（`length>=3` 且非停用词且 `/^[a-z']+$/i`）→ ③ 第 2 词。

| 候选句 | ambush 落点 | 被测词为何落此（实读判定） |
|---|---|---|
| `I'll have my hair cut.` | **have** ✅ | ①命中 `have`（词表内）；`cut` **不在词表**（实读 OUT）、`hair` 也不在 |
| `She had her room cleaned.` | **had** ✅ | ①命中 `had`；`cleaned` **在词表内**（`clean` 家族含 `cleaned`），但 `had` 位置更靠前，**取首个命中** |
| `He got his bike fixed.` | **got** ✅ | ①命中 `got`；`fixed` **不在词表**（本句 `got` 是唯一命中） |
| `I'm used to getting up early.` | **I'm** ⚠️ | ①无命中（`used`／`getting`／`early` 均不在表）→ ②实词回退，`I'm`（3 字母、非停用词、`/^[a-z']+$/i` 通过）**先于** `used`／`getting`／`early` 被选中——**落点不对（考点是 used to 后面的 -ing）** |
| `This city is different from mine.` | **is** ✅ | ①命中 `is` |
| `It looks like rain.` | **looks** ✅ | ①命中 `looks`（词表内）——**正是考点** |

**词表内/外实读（批十七关键）**：

| 词 | 在 `GRAMMAR_WORDS`？ | 影响 |
|---|---|---|
| `have` / `has` / `had` | **IN** | 甲的三态全可落 ① |
| `cut` | **OUT** | `cut` 永不成为第 ① 类落点（靠 ② 实词，可落） |
| `fixed` / `painted` / `repaired` | **OUT** | 同上 |
| `looks` / `look` | **IN** | 丙天然可落 |
| `makes` / `lets` / `got` | **IN** | （批十六已用） |
| `until` | **OUT** | **L109 的主考点不在词表**——批十六靠 ② 实词兜住（实测落 `waited`） |
| `waited` | **OUT** | 同上 |
| `as` | **IN** | 见 §3.2 的 boost 侧死角 |
| `both` / `neither` / `either` / `already` / `yet` / `so` | **OUT** | 丁的候选词**全部不在词表**——靠 ② 实词回退 |

> **技术结论（丁的风险）**：`neither`／`either`／`both`／`already`／`yet` **均不在词表**，落点将走 ② 实词回退，**大概率落在句内其他实词而非考点**（如 `Both of them are here.` → `them` 是停用词、`here` 落空位）。**建议：丁若立项，须把目标词补进 `GRAMMAR_WORDS`，或主句设计成让考点词成为句内唯一 ≥3 字母实词。**

### 3.2 boost 档 1 `buildCloze`（`grammarBoostService.ts:206-257`；40 seed 扫）

`keywordIndexes` 规则＝ `cleanWord(w).length >= 3 && !FUNCTION_WORDS.has(lower)`；`FUNCTION_WORDS` **34 个**（含 `is/am/are`，**不含 `was/were/has/have/had/do/does`**）。落点＝按 seed 从候选集中确定性抽一个。

| 候选句 | 候选集（实读） | 40 seed 分布 |
|---|---|---|
| `I'll have my hair cut.` | `["I'll","have","hair","cut."]` | hair 12 · I'll 12 · **have 9** · cut 7 |
| `She had her room cleaned.` | `["had","room","cleaned."]` | had 16 · room 15 · **cleaned 9** |
| `He got his bike fixed.` | `["got","bike","fixed."]` | got 16 · bike 15 · **fixed 9** |
| `I'm used to getting up early.` | `["I'm","used","getting","early."]` | getting 12 · I'm 12 · **used 9** · early 7 |
| `This city is different from mine.` | `["city","different","from","mine."]` | from 12 · city 12 · **different 9** · mine 7 |
| `It looks like rain.` | `["looks","like","rain."]` | **looks 16** · like 15 · rain 9 |

> **判定**：**boost 侧的落点质量显著优于 ambush**（考点词 `have`／`cleaned`／`fixed`／`used`／`different`／`looks` 全部在候选集内，只是概率 7–9/40）；**ambush 侧 `I'm used to getting up early.` 会落在 `I'm`（非考点）**——建议主句改为 `She is used to getting up early.`（此时 ① 命中 `is`，仍非考点）**或直接用 `getting` 开头构造**；最稳做法是**接受 ② 实词回退并让考点词成为句首唯一实词**。

### 3.3 `As`（2 字母）的已知问题（复述并复核）

- **ambush 侧**：`as` **在 `GRAMMAR_WORDS` 内** → `As I was walking home, I saw a dog.` 实测落 **`As`** ✅（第 ① 条即命中）。
- **boost 档 1 侧**：`keywordIndexes` 要求 `clean.length >= 3`（`grammarBoostService.ts:210-217`）→ **`As`（2 字母）永不可能成为空位**；实测 `'As'.length = 2`、`GRAMMAR_WORDS.test('As') = true`（但该表仅 ambush 用，boost 不看它）。同句实测候选集 `["was","walking","home,","saw","dog."]`——`As` **不在内**。
- **review 侧**（`grammarReviewService.ts:144` 停用词仅 7 个、`cleanToken(token).length > 2`）：`As` 同样因长度 2 被排除。
- **结论**：**`As` 在 boost／review 两条通道均不是空位**。若批十七涉及 `as`，主句须写作 `As I was walking home, I saw a dog.`（ambush 可落 As，boost 落 walking/was），**或把 as 只放 contrast 改错卡**（改错题不受长度限制）。

---

## 4. 基建护栏（大章节）

| 护栏 | 现状（实读） | 批十七动作 |
|---|---|---|
| **season-17** | `grammarSeasons.ts:50` 末项 `{id:"season-16", label:"第十六季 · 谁让谁做什么", min:103, max:110}`；**无 season-17** | 追加 `{min:111, max:111+N-1}`；**`grammarSeasons.test.ts` 4 项守门会先红**（区间覆盖／互不重叠／label·hint 非空／最高课号被覆盖）——**护栏有效，不会静默过滤** |
| **m19** | `GrammarPathPage.tsx:240-245` 末项 `{id:"can-do-m18", afterLesson:110, title:"我能说清谁让谁做什么", samples:[…]}`；**全库 18 个里程碑** | 追加 m19（`afterLesson: 110+N`）；**全仓无测试引用 mN**——纯纪律项，漏加不会红 |
| **episode** | 止「小美的一天 **一百一十**」`grammarLessons.ts:20419`；上溯 `一百零三`…`一百零九`（`:19110`–`:20232`）；**>100 写法已有 11 例先例** | 下一个写 **「一百一十一」**；后续「一百一十二…一百一十八」同格式 |
| **案号** | **119 案，1–119 连续无跳号**（脚本逐项核对）；`reviewed: true` **119/119**（raw `grep -c 'reviewed: true'` ＝ 119）；`huntService.test.ts:290` 断言 `number` 唯一 | 新案 **#120 起**；连续编号由测试守门 |
| **番外案** | **恰 5 案**：`hunt-white-cat`(#16)·`hunt-sports-day`(#17)·`hunt-pen-pal-letter`(#18)·`hunt-fridge-note`(#19)·`hunt-term-review`(#20)；`huntService.test.ts:215` **逐名单断言** | 批十七新增案不得变成第 6 个番外（否则测试红） |
| **课-案配比** | 每课引用 `{0: 5, 1: 96, 2: 8, 3: 1}`——空案课 **L2/3/5/6/8**（第一季基础课，决策⑤已拍板不配案）；**2 案课 8 门**（L10·12·13·14·15·20·24·25）、**3 案课 1 门**（L11）；重复引用仅 `hunt-my-sister`（L14+L25） | **8 课建议 8 案（一课一案）**，每案 4 错点为主流 |
| **每案错点数** | `{2: 10, 3: 10, 4: **96**, 5: 2, 6: 1}`——4 错点占 **96/119 = 80.7%**；5 错点＝#42·#43；6 错点＝#34 | 与主流对齐：每案 **4 错点** |
| **关 1 解锁** | `lessonService.ts:156-159`：`const prev = grammarLessons.find((item) => item.number === lesson.number - 1); … prevDone ? "unlocked" : "locked"` → **缺号永久锁死且无报错** | **111 起连续无跳号（人工核对＋§附录脚本核对）** |
| **guided.spot** | **110/110 课全部有 1 张**；**L96/L102 已回修**：`:17902-17903` 与 `:19041-19042` 均写 `tokens:["It","was","rain."]`＋`wrongToken:"rain."`，**逐字相等** | 新批 `wrongToken` 必须与 tokens 元素**逐字相等（不带尾标点）**——现有测试 `grammarBoostService.test.ts:184` 守门 |

---

## 5. 封面池专章（含最优性说明）

### 5.1 容量账（实读 `^    cover: coverN,`，110 次命中）

| 池 | 张数 | 编号清单 |
|---|---|---|
| **单次池** | **0** | —（批十六按路线图吃完 41·45·47·48） |
| **二用池** | **37** | 1·2·3·4·5·6·7·8·11·13·14·15·22·23·24·25·27·28·29·30·33·34·35·36·37·38·39·40·41·42·43·44·45·46·47·48·49 |
| **三用池** | **12** | 9·10·12·16·17·18·19·20·21·26·31·32 |
| 合计 | **49** | 49 张用 **110** 次 |

**三用池逐张明细与「升四用」实测拒绝**：

| 封面 | 三次使用 | 内部最小段距 | 第 4 用最优值 | 判定 |
|---|---|---|---|---|
| cover9 | 9, 73, 109 | 36 | 9 | ❌ |
| cover10 | 10, 52, 94 | 42 | 24 | ❌ |
| cover12 | 12, 67, 107 | 40 | 11 | ❌ |
| cover16 | 16, 50, 87 | 34 | 31 | ❌ |
| cover17 | 17, 71, 108 | 37 | 10 | ❌ |
| cover18 | 18, 57, 93 | 36 | 25 | ❌ |
| cover19 | 19, 74, 110 | 36 | 8 | ❌ |
| cover20 | 20, 54, 88 | 34 | 30 | ❌ |
| cover21 | 21, 59, 89 | 30 | 29 | ❌ |
| cover26 | 26, 60, 90 | 30 | 28 | ❌ |
| cover31 | 31, 61, 91 | 30 | 27 | ❌ |
| cover32 | 32, 62, 92 | 30 | 26 | ❌ |

> **12 张全部 ❌**：第四用最优值 **8–31 全低于 35 的批十七可用线**（因三次使用已把可用位置吃满）。**批十七与批十八均勿碰三用池。**

### 5.2 最优指派（二分答案＋二分图完美匹配，**穷举复验证**）

**问题建模**：位置 L111–L118（N＝课数）；封面取二用池；目标＝**最大化「三用后最小间距」**＝ `min(p − u2, u2 − u1)`（`p`＝新位置，`u1/u2`＝前两次使用课号）。

**第一步：算每张二用张的「天花板」**（`max_p min(p−u2, u2−u1)`，p∈L111–L118）：**只有 9 张 ≥35**（`1·2·3·4·5·7·25·29·42`），**其余 28 张全部 <35**——其中 `cover49` 天花板仅 **9**（两段 49→58 间距 9，**❌ 永久禁用**）、`cover48` 12、`cover47` 13、`cover45` 14、`cover41` 15（**批十六刚用 103–106 段**）、`cover40` 16／`cover38` 17／`cover37` 18／`cover27` 19／`cover22` 20／`cover15` 21／`cover14` 22／`cover13` 23（**批十五刚用 95–102 段，本批与下批勿碰**）、`cover44` 与 `cover46` 24、`cover30` 26、`cover28` 27、`cover23` 28、`cover24` 与 `cover43` 29、`cover33/34/35/36/39` 30、`cover11` 32、`cover8` 33、`cover6` 34。

**第二步：二分答案求最优 min-gap。** `X=36` 时可用张仅 **7 张**（`1·2·3·4·7·25·29`）< 8 → 不可行；`X=35` 时 **9 张** ≥ 8 → 可行。**故最优值（N=8）＝ 35。**

**第三步：穷举全部 9 张可用张的组合 × 8! 排列**，以 `(min-gap, sum-gap, sorted-desc)` 词典序取最大，**确认 max-min＝35、max-sum＝288**（无更优解）。

| 位置 | 封面 | 前两次使用 | 段1（u2−u1） | 段2（p−u2） | 该张 min |
|---|---|---|---|---|---|
| **L118** | **cover29** | 29, 75 | 46 | **43** | **43** |
| L117 | cover4 | 4, 82 | 78 | 35 | 35 |
| L116 | cover3 | 3, 81 | 78 | 35 | 35 |
| L115 | cover2 | 2, 80 | 78 | 35 | 35 |
| L114 | cover1 | 1, 79 | 78 | 35 | 35 |
| L113 | cover25 | 25, 78 | 53 | 35 | 35 |
| L112 | cover42 | 42, 77 | **35** | 35 | 35 |
| L111 | cover7 | 7, 76 | 69 | 35 | 35 |

**施工口径（推荐·8 课）**：`L111←cover7、L112←cover42、L113←cover25、L114←cover1、L115←cover2、L116←cover3、L117←cover4、L118←cover29`——**最小间距 35，且把间距最大者（29）放最晚课**（与批十六口径一致）。
**6 课降级方案**：`L111←cover7、L112←cover42、L113←cover25、L114←cover1、L115←cover2、L116←cover29`（min＝35，sum＝216；**cover29 提前到 L116 得 41**）。
**7 课方案**：`…L117←cover29`（min＝35，sum＝252）。

### 5.3 ❌ 禁用张清单（批十七）

| 禁用张 | 原因 | 最早可复用 |
|---|---|---|
| **cover49** | 两段间距仅 **9**（49→58），天花板 9 | 永久（除非重排历史） |
| **cover41 · cover45 · cover47 · cover48** | **批十六（L103–106）刚用**，天花板 12–15 | 批十九+ |
| **cover13 · 14 · 15 · 22 · 27 · 37 · 38 · 40** | **批十五（L95–102）刚用**，天花板 16–23 | 批十九+（批十六路线图已标「本批与下批勿碰」） |
| **cover6 · 8 · 11 · 23 · 24 · 28 · 30 · 33 · 34 · 35 · 36 · 39 · 43 · 44 · 46** | 天花板 24–34（**低于 35 可用线**） | 批十九+（待更晚位置抬升） |
| **三用池 12 张（9·10·12·16·17·18·19·20·21·26·31·32）** | 升四用最优值 8–31，**全部 ❌** | 批二十+ |

> **注**：本表按**编号间距实算**，**未做图像语义核对**（cover 图内容与 L111+ 场景是否相称需人工确认）——沿用批十六口径，属**未核实项**。
> **兜底**：`cover` 在 `types.ts:590` 为可选字段（`cover?: string`），缺省回退 scene SVG——**封面池耗尽不阻断生产**。

---

## 6. G-boost 复核（**以当前工作区文件内容为准**）

### 6.1 三项指定断言的实跑结果

`npx vitest run src/services/grammarBoostService.test.ts` → **42 项全绿（1.18s）**。

| 断言 | 位置 | 逻辑 | 结果 |
|---|---|---|---|
| **每课 ≥2 道可换改错题** | `:160-182` | 全库**逐课**（无豁免）反复复练抽干改错池（10 轮），只统计 `kind === "spot"` 的**不同题源**，`collected.size < 2` → thin → `expect(thin).toEqual([])` | ✅ **通过**（thin＝0；**探针实跑**：分布 `{2道: 11 课, 3道: 29, 4道: 21, 5道: 9, 6道: 17, 7道: 23}`） |
| **`wrongToken` 逐字相等** | `:184-197` | 逐课取 `guided.spot`，断言 `spotStep.tokens.includes(spotStep.wrongToken)`——**逐字相等、不带尾标点** | ✅ **通过**（**L96/L102 已回修**：`:17903` 与 `:19042` 均写 `wrongToken:"rain."`，与 tokens 末项 `"rain."` 逐字相等） |
| **`wrongMark` 不得为纯标点** | `:198-212` | 逐课扫 `contrast`，`wrongMark` 非空且 `!/[a-zA-Z0-9]/.test(mark)` 即入 `bad` | ✅ **通过**（`bad` 为空；**L89 的 `"?"` 已改**，现行 L89 wrongMark 为 `"day?"`／`"nice"` 等含字母形态） |

**新增（批十六后另一路改动）**：`describe("档 1 · 双正解题")`（`:645-685`）3 项——① 有 `bothRight` 素材的课（**69 课**）首轮必出双正解题且两句差异足够大（`diffScore < 90`）；② 双正解题**不占用其它题型槽位**（每课题型数 ≥4）；③ 档 1 每题都有讲解。**全部通过。**

### 6.2 `buildBoostItems` 档 1 取题逻辑（实读 `:496-745`）：题型槽位轮转＋动态补位

**候选池 5 类**（`:501-504`）：`spot`（改错）／`contrast`（正误判断）／`bothright`（两句都对吗）／`cloze`（填空）／`choice`（选择·变形）。

**取题三步（`:672-745`）**：

1. **固定槽位＋轮转**（`:675-694`）：`rotatingSlots = ["bothright","cloze","choice","contrast"]`（**4 类**），`rotation = round % 4`；最终 `slots = ["spot", ...rotatingSlots.slice(rotation), ...rotatingSlots.slice(0, rotation)]`。**`spot` 固定占第 1 槽、不参与轮转**（实读注释：4 题 5 类必有一类轮空，若 spot 参与轮转它会周期性整轮消失——实测 L36 第 1、6 轮无改错题）；随后按 `slots` 顺序各取一道（`items.length >= 4` 停）。
2. **动态补位**（`:695-733`）：若不足 4 题——**先补「本轮轮空且池里有货」的题型**（`missingSlot`，`:699-708`）；**再让池子最大的题型出第二道**（`richest`，`:713-728`）。实读注释点明这一步是「复练能一直换新题」的关键（否则改错池 5 道却每轮只出 1 道——实测 L13 复练 10 轮只能抽到 1 道）。
3. **题型交错重排**（`:735-746`）：相邻不同型；槽位不足时用剩余候选补满。
4. **弱点混题**（`:747-757`）：命中弱点时**替换最后一道**（而非只在缺题时补位）——保证素材齐备的课也能出弱点题。

> **「不饿死某一题型」的机制保证**：`spot` 固定槽位（**永不轮空**）＋ 其余 4 类按 `round` 轮转 ＋ 「先补轮空题型、再扩容」的两级补位。**实测首轮题型分布（110 课全跑）**：`spot 110`／`cloze 110`／`replace 110`／`bothright 69`／`contrast 41`（**replace/bothright/contrast 共用 choice 与 contrast 槽位，合计每课 4 题**）。**测试 `:303` 断言 items.length≥4、`:674` 断言题型数 ≥4。**

### 6.3 contrast 全库结构（实读，供批十七配额参考）

| 指标 | 数值 | 说明 |
|---|---|---|
| contrast 总条数 | **660** | 上期 612 → **＋48** |
| `bothRight: true` | **221**（上期 197） | **不参与改错题**（`:532` `if (contrast.bothRight) return;`） |
| 带 `wrongMark`（非 bothRight） | **391**（上期 367） | 改错题的第二来源 |
| `wrongMark` 为纯标点 | **0** | ✅ L89 已修 |
| 含 bothRight 素材的课 | **69 课** | 双正解题的素材课 |
| 改错题可用总数 | `guided`（110／110 课）＋ `contrastSpot`（391） | **平均 4.55 道/课** |

---

## 7. 可生产性评估

| 候选 | 就绪度★ | 生产量 | 风险 |
|---|---|---|---|
| **甲 `have sth done`** | **★★** | **整条新造**：结构 0 底座＋`will have`/`'ll` 双零件 0＋四块常识 PP（cut/fixed/repaired/painted）全 0＋宾语词（hair 0）全 0。6–8 课＝全新建 | **①跨级**（中级 U46，A2 之后）；**②错型弱**——「我剪了头发」在 L68 是**合法句**（`She made a cake for me.`），只能靠 `cuted`／`have→has` 类弱形态承载；**③`'ll` 缩写是独立空白**，须单列一课或规避 |
| **乙 `be/get used to`** | **★★★** | 中量：结构真空白（全族 **0**），但与 L93/L100 的 `used to` **天然构成形态对比**（`doing` vs `do`）。4–6 课：`be used to` 立岗 → `get used to` → 与 `used to` 对比 → 收口 | **①跨级（B1）**；**②与 L93/L100 抢位**——须显式分工「习惯于（-ing）／从前常（原形）」；**③`used to` 已两轮教学**（L93 47 处＋L100 48 处＋HC #102/#109），**用户熟悉度高，新批须写成对比而非重教** |
| **丙 `look like`** | **★★★** | 小量：结构极简（`look like + 名词／从句`），但**全库仅 1 句对话**（L49:8909），须配场景池（天气／长相／外观）。2–3 课 | **①只有一句半曝，撑不起 6–8 课**——若并入丁或其他章作 **2 课尾章**更稳；**②错型只能靠三单 -s（`*It looks likes rain.`），与 L25 `look/looks` 教学重叠**；**③`like`（喜欢）已重教**（GL 343 处：L5 65·L42 58·L62 69·L70 55），**`look like` 的 like 是介词义，须防混淆** |
| **丁 真空白功能词** | **★★** | 12 项全真空白（`so that`·`as soon as`·`neither`·`either`·`both`·`already`·`yet`·`such`·`the same as`·`Thank you`·`Excuse me`·`would rather`）——**但彼此无语义家族**，只能按家族组章：`neither/either/both`（三连体·2 课）／`already/yet`（完成时搭档·1 课）／`Thank you/Excuse me`（语用·1 课）／`so that/as soon as`（从句连词·1–2 课）／`such/the same as/would rather`（互不相干，暂缓） | **①11 项跨 5 个家族，「一课一增量」难守**；**②`Thank you/Excuse me` 属语用型错，难植错**（合法句太多）；**③`neither/either/both` 与 L25/L34 的三单·there be 教学重叠**；**④全部候选词不在 ambush 词表**（§3.1），cloze 落点会偏离考点 |
| **戊 机制深化** | **★★★★** | **零新语料** | **已饱和**：boost 三档（档 1 四题型轮转＋spot 固定槽＋bothright 新题型）／回马枪（弱点加权＋降级）／复习轮换／弱点驱动全在位，**58 文件 721 项测试守门**——**无增量空间，不宜作主章** |

**就绪度排序：乙 ＞ 丙 ≈ 甲 ＞ 丁 ＞ 戊**（按「空白 × 可生产性 × 错型承载力」综合）。
**「零新语料」达标 0 项**（与批十六同）。
**推荐形态（若做乙 6–8 课）**：L111 `be used to + -ing` 立岗（对比 L93 `used to do`）→ L112 `get used to`（变得习惯）→ L113 否定／疑问（`I'm not used to…` / `Are you used to…?`）→ L114 回收 L93/L100 的 `used to` 作显式对比（`used to do` vs `be used to doing`）→ L115 场景迁移（新学校／新城市／早起）→ L116–L118 可选：并入丙 `look like`（2 课）收口。
**若做甲（6–8 课）须先裁决两件事**：① 是否接受跨级（U46）；② `'ll` 缩写是否单列一课。

---

## 附录：核查留痕

### A. 测试实跑

| 命令 | 结果 |
|---|---|
| `npx vitest run src/services/grammarBoostService.test.ts` | ✅ **1 文件 / 42 项全绿（1.18s）** |
| `npx vitest run`（全量） | ✅ **58 文件 / 721 项全绿（4.32s）**（预期 57/714 → 实际已上移：**58/721**） |
| `npx tsc --noEmit` | ✅ **0 错**（exit 0，无输出） |
| boost 探针（临时 `__probe17.test.ts`，**跑完即删**） | spot 池分布 `{2:11, 3:29, 4:21, 5:9, 6:17, 7:23}`；thin2 **11 门**（L72·73·79·80·81·85·87·88·90·91·92）；contrast `{total:660, bothRight:221, withMark:391, markNoWord:0, lessonsWithBothRight:69}`；首轮题型 `{spot:110, cloze:110, replace:110, contrast:41, bothright:69}`；guided.spot **110/110** |

### B. 实读源文件（10 个）

`src/data/grammarLessons.ts`（20,611 行／19,811 串）·`src/data/huntCases.ts`（6,949 行／4,962 串）·`src/data/grammarSeasons.ts`（55 行）·`src/data/grammarSeasons.test.ts`·`src/services/grammarAmbushService.ts`（283 行）·`src/services/grammarBoostService.ts`（1,203 行）·`src/services/grammarBoostService.test.ts`（685 行）·`src/services/grammarReviewService.ts`·`src/services/lessonService.ts`（`:150-176`）·`src/pages/GrammarPathPage.tsx`（692 行）·`src/types.ts`（`:419`,`:590`）·`src/services/huntService.ts`（`:331-342`）·`src/services/huntService.test.ts`（`:109`,`:186`,`:211-230`,`:284-290`）·`src/data/grammarLessons.test.ts`。

**关键行号引用**：`grammarSeasons.ts:50`（season-16）·`GrammarPathPage.tsx:240-245`（m18）·`grammarLessons.ts:20419`（episode 一百一十）·`:17902-17903`／`:19041-19042`（L96/L102 wrongToken 已修）·`:8909`（L49 `It looks like rain.`）·`:4103`（L23 `I have my key here.`）·`:9953`（already 注释）·`:18941`（L102 `So that was last night!`）·`:17208-17260`（L93 used to）·`lessonService.ts:156-159`（number−1 解锁）·`grammarBoostService.ts:206-257`（buildCloze）·`:496-745`（档 1 取题）·`:591`（bothright 候选）·`:675`（旋转槽位）·`grammarAmbushService.ts:160-187`（GRAMMAR_WORDS）·`:190-193`（停用词）·`:195-212`（pickClozeWord）。

### C. md5

| 文件 | md5 |
|---|---|
| `src/data/grammarLessons.ts` | `b86213af1098d94a2c6b2286632cd310` |
| `src/data/huntCases.ts` | `554641ab06b9a08af610a6888ab3cedf` |
| `src/data/grammarSeasons.ts` | `fed6e81c60746a9974c575279b4f8e5a` |
| `src/services/grammarAmbushService.ts` | `84b306b40e881c4f9b8c8d000851686c`（**与批十六同值——未改动**） |
| `src/services/grammarBoostService.ts` | `8fd339463931396598e19e3b4ae02f33`（批十六为 `f5b2bb56…`——**已改**） |
| `src/services/grammarBoostService.test.ts` | `8828d61f01b006069fd8a8b737a253a8` |
| `src/pages/GrammarPathPage.tsx` | `6b67e5f4c4a62d5c28747bd8ba47574c` |
| `src/services/lessonService.ts` | `c074a84a4ead4cf6174c4aaae9a6f014` |
| `src/services/huntService.test.ts` | `ad93ad15e68ea498d42568b6289776f4` |
| `src/data/grammarSeasons.test.ts` | `2c74e48900c27445c4003ea67dd921a8` |

### D. raw 交叉验证（`grep` 独立复核）

```
课数/案数：grep -c '^    number: ' huntCases.ts = 119 ；GL 顶层 lesson 块 = 110
错点总数：grep -c '^        tag: "' huntCases.ts = 450（与状态机 450 一致）
reviewed：grep -c '^    reviewed: true,' huntCases.ts = 119
both：grep -oE '\bboth\b' GL = 0 ；grep -o 'both[A-Za-z]*' GL = 221（全 bothRight）
already：grep -n 'already' GL = 1（:9953 注释）
so that：grep -n 'So that' GL = 1（:18941，非目的连词）
Thank you / Excuse me / would rather / such / the same as / as soon as / neither / either / yet / different：
    GL 0 · HC 0（大小写均测）
' ll 缩写：node 正则 [A-Za-z]['’]ll\b → GL 0 · HC 0
used to：正则 \bused to\b → GL 120 处/113 串 · HC 3 处/3 串
封面：grep -c '^    cover: cover' GL = 110 ；distinct = 49
```

### E. git 层交叉验证（**重要**：批十六整个未提交）

`git log --oneline -1` → **`7ad13f5 新增语法第四至十五批课程与 Boost 强化训练`**。将 HEAD 与工作区逐项对比：

| 指标 | HEAD（已提交） | 工作区（当前实读） | 差值 |
|---|---|---|---|
| 课数 | **102** | **110** | ＋8（＝批十六 L103–110） |
| 案数 | **111** | **119** | ＋8（＝#112–119） |
| `grammarLessons.ts` 行数 | 19,107 | **20,611** | ＋1,504 |
| `huntCases.ts` 行数 | 6,597 | **6,949** | ＋352 |
| `grammarBoostService.ts` 行数 | 1,108 | **1,203** | ＋95（bothRight 等） |
| `grammarBoostService.test.ts` 行数 | 584 | **685** | ＋101（bothRight 3 项＋回归 3 项） |
| contrast 条数 | **612** | **660** | ＋48 |
| `bothRight: true` | **197** | **221** | ＋24 |
| L96/L102 `wrongToken` | `"rain"`（❌ 不逐字相等） | **`"rain."`**（✅ 已修） | 缺陷消除 |
| L89 `wrongMark` | 含 **`"?"`**（❌ 纯标点，1 处） | **0 处**（改为 `"day?"`） | 缺陷消除 |

> **结论（重要）**：**批十六（8 课＋8 案）与 bothRight 新题型、L96/L102/L89 三处缺陷回修，全部处于未提交状态**（`git status`：21+ 文件 M）。批十六路线图 §「待确认」列出的「L96/L102 的 `wrongToken` 修复已入工作区，是否随本批一并上线（与批十五『不改写前批』纪律的关系）待定」——**实读确认：修复已在工作区，且 L89 亦一并修了**。批十七立项前若发生 `git checkout .` 类操作，**这 8 课＋8 案＋三处修复会全部丢失**——**建议立项前置动作：先提交或打 tag**。

### F. 未核实

1. **批十七课数与形态未定**（6／7／8 课三档均已给封面方案，但「做哪条候选」未拍板）——本报告只给数据与就绪度，不替产品负责人选题。
2. **封面方案按编号间距计算，未做图像语义核对**——9 张可用张（1·2·3·4·5·7·25·29·42）的画面内容与 L111+ 的场景是否相称，须人工逐张确认（沿用批十六口径）。
3. **`be/get used to` 的跨级判定未裁**（B1 结构，与产品线当前 A2 定位的衔接方式待瑞思／产品负责人定）。
4. **甲（have sth done）是否放行未裁**——跨级（U46）＋零底座＋错型弱，三项叠加风险须产品负责人裁决。
5. **丁的 11 项如何组章未裁**（本报告给出 4 个语义家族的可行分组，但家族取舍未定）。
6. **`'ll` 缩写是否单列一课未裁**——若做甲，`I'll have my hair cut` 的缩写是独立增量，须决定单列或规避。
7. **两处测试基线差异未追溯**：批十六审计记 54/674（HEAD 版）与 55/685（当时工作区），本次实测 **58/721**——期间 3 个文件/36 项由「另一路改动」新增（bothRight 等），**具体提交边界未逐项比对**（但附录 E 已确认：全部为**未提交**状态）。
8. **`As` 在 boost 侧的死角未提出修复方案**——本报告只复述机制（`length>=3` 规则），是否改词表／改规则待开发裁定。
9. **`comparison` 枚举（`types.ts:419`）为何存在但零使用**——实读确认全库 `tag: "comparison"` 0 处、`GRAMMAR_ERROR_TAGS` 不含它，**其历史来源未追溯**（可能为预留位）。

---

> 本报告由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。
