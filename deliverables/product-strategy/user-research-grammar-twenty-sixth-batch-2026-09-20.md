# 用户研究综合报告 · 第二十六批（用户研究 · 批二十六选题）
> **选题一句话推荐**：**取轴 B「三个以上都」的 `all`，做 2 课（`all` 立岗 → `every` 切开）**；**轴 A「让步与条件链」本轮不取——§3 实算：轴 A 的两课各只能凑出 4 条对比卡，缺 2 条，判定「凑不满」**（**并给出 4 条的逐条方向**）；**轴 C `seem`／轴 D `would rather` 继续押后**。

**日期**：2026-09-20 ｜ **类型**：用户研究（批二十六选题）｜ **成员**：瑞思
**方法**：本轮不采信任何转述，全部结论由下列实读产生。

- **实读源文件（7 个）**：`src/data/grammarLessons.ts`（**28420 行**／**150 课**／**29009 行数据体**）／`src/data/huntCases.ts`（**8709 行**／**159 案**）／`src/data/grammarSeasons.ts`（**73 行**，season-1–season-25）／`src/data/grammarZeroTerms.ts`（**31 行**，词表**实际 29 个术语**）／`src/data/grammarLessons.test.ts`（内容红线原文 `:1-232`）／`src/services/grammarAmbushService.ts`（`GRAMMAR_WORDS` 表 `:161-194` ＋ `pickClozeWord` ＋ `CLOZE_STOP_WORDS :196-201`）／`src/services/grammarBoostService.ts`（`hashText :182-188`／`mulberry32 :190-198`／`FUNCTION_WORDS :244-247`／`keywordIndexes :249-257`／`buildCloze :261-300`／`courseVocabulary :420-440`）。
- **词次口径（本轮统一，两法互校）**：**词次 ＝ 整词命中数**，用**两套独立正则**分别跑：① `(^|[^A-Za-z])w([^A-Za-z]|$)`；② `(?<![A-Za-z])w(?![A-Za-z])`（零宽断言法）。**两法在全部受检词上一致**。
- **本机工具坑复核（按任务书要求）**：本机 `grep` 是 **ugrep**，`grep -oniE "(^|[^A-Za-z])when([^A-Za-z]|$)"` 返回 **0（错误）**，而 `grep -c "When"` 返回 **240（正确）**。→ **本报告全部词频由 node 脚本产出**，`grep` 只用于定位行号（`grep -n` 在 ugrep 下定位行号是可用的）。
- **⚠️ 中文字面量不过滤（按任务书要求）**：本轮**不做「只留纯英文串」的过滤**。`though` 的 3 处全在**中英混排**的深挖卡段落里（§1.2 逐字），过滤会得到错误的 0。
- **⚠️ 新增两套口径（本轮自建，前两批未用）**：为避免「行扫描」把**课程 id／字段名／中文讲解里的英文**混入词次，本轮**另跑一套「学习者可见句槽」口径**（`GLstruct`）——只统计 `targetSentence` ＋ `dialogueEn` ＋ `examples[].en` ＋ `variants[].en` ＋ `sceneSwings[].en` ＋ `practice[].answer` ＋ `dialogue[].en` 这 7 类**真正会显示为英文句子**的字段。**两套口径并列给出**，分歧处逐条说明（§0.2）。
- **引擎独立复刻**：本轮独立复刻 `grammarBoostService` 的 `hashText`＋`mulberry32`＋`keywordIndexes`＋`buildCloze`（`/tmp/ruisi26/cloze.mjs`），对 **20 个候选句各跑 400 种子**实测 cloze 落点分布；另独立复刻 `grammarAmbushService` 的 `pickClozeWord` 三级回退（`/tmp/ruisi26/ambush.mjs`），实测 **18 个候选句**的关 2 空位落点。
- **上游复核**：`/tmp/murphy_int_norm.txt`（中级 TOC，**11016 字符**）与 `/tmp/murphy_ess_norm.txt`（初级 TOC，**13966 字符**）逐字复核；Cambridge 词典页 `all`／`every`／`seem`／`neither` 现取现核；中文侧英文教学站索引 `/tmp/ec_all.txt`（**870 条 URL**）与 `/tmp/lme_all.txt`（**966 条 URL**）按 URL 清单核「有无专文」。

---

## 0. 结论先行

### 推荐方案：做轴 B「三个以上都」的 `all`，**2 课小章 · L151–L152**（档位 **B−**，诚实标注见 §6.7）

**核心理由一句话**：**批二十五把「中文一个『都』字」讲完了一半（`both`／`neither` ＝ 两个），而 L148 的深挖卡已经把另一半挂在墙上当钩子（`:27926` 逐字「要是三个以上一起都好，英语有另一个词，今天先不碰」）——本批是去摘那个钩子，不是新开一个话题。**

### 0.1 本轮最重要的发现（五条，全部由实读产生）

1. **★ 轴 A 的「2 课能否各凑满 6 条对比卡」——本轮给出否定判定：凑不满，两课各只有 4 条**〔实读＋自建口径〕。

   这是批二十五 §附录登记的前置项，**本轮的处置是「按全库 150 课的实际写法逐条设计，看能不能写到 6 条」**，而不是「凭感觉说有 6 条」：

   | 课 | 可用的独立对比点（按全库惯例归类） | 条数 | 差 |
   |---|---|---|---|
   | **课 1 = `even though` ＋ `in spite of`／`despite`** | ① `even` 单独拖一整句 ❌（中文侧明文错例）② `in spite of` 后面跟小句子 ❌（Cambridge 明文 Warning）③ 与 `although` 的强度差（双正解）④ 与 `but` 的成对说（双正解） | **4** | **−2** |
   | **课 2 = `unless` 单点** | ① `unless` 里带 `will` ❌（中文侧明文错例 2 条）② `unless` 用来提问 ❌（中文侧明文 ❌ 1 条）③ 与 `if…not` 等价（双正解）④ 与 `as soon as` 的时间刻度差（双正解） | **4** | **−2** |

   **为什么填不满**：**全库 150 课的 6 条不是「4 条新错＋2 条旧复习」，而是「3 条带 `wrongMark` 的新错 ＋ 3 条双正解复习」**（实测：`3+0+3` 组合 **43 课**、`2+0+4` 组合 **25 课**、`4+0+2` 组合 **10 课**、`3+1+2` 组合 **3 课**——§3.1 全表）。**轴 A 两课能凑出的「有明确错点的新错」各只有 2 条**（`even` 单独用／`in spite of` 接句子；`unless` 带 `will`／`unless` 提问），**另 2 条是等价或强弱对照，属双正解位**。**→ 2 条新错 ＋ 2 条双正解 ＝ 4 条，距 6 条差 2 条**，而这 2 条**必须从已交付的 L139–L144 里借旧句**——但 §3.4 实测那批旧句**可用的只有 `Although it is raining, I will go out.` 与 `It is raining, but I will go out.` 两句**，各已被 **L139／140／141 用掉 2 次**（`contrast.wrong` 逐字复用实测 `it is raining but i will go out` → **L139,140,140,141,141 共 5 处**），**再借会触发「同一句在库内出现次数」的观感上限**。

   **→ 任务书要的判定：轴 A 的 2 课「各凑满 6 条 contrast」凑不满，实际课量是 2 课（不是 3 课），但两课都只能写到 4 条**——**若产品负责人不愿破「每课恰好 6 条」这条 150 课无一例外的红线（实测 150/150 全部为 6，无一例外，§3.1），轴 A 就不能开工**。

2. **★ 轴 B 的判定：`all` 是真缺口，但它和已教的 `both`／`neither` 不是「同一家族」——是「同一个中文『都』字的第二格」**〔实读〕：

   | 维度 | `both`／`neither`（L148–150 已交付） | `all`（本批候选） | 关系 |
   |---|---|---|---|
   | 中文侧的字 | **同一个「都」** | **同一个「都」** | **同一个中文字** |
   | 管几个 | **恰好两个** | **三个以上** | **互补，不重叠** |
   | 站哪儿 | **最前面**（`Both books`） | **最前面**（`All the books`） | **同一个位置**✅ |
   | 后面那个东西 | `both` 带 s／`neither` 不带 s | **`all` 带 s（或数不清的东西）** | **`all` 走 `both` 那条** |
   | 搭档 | `are`／`is` | **`are`（跟 `both` 同一条）** | **复用** |
   | 有「不」怎么办 | `both` → `neither` | **`all` 没有换词伙伴**（`none` GL 0／`no` HC 0） | **⚠️ 这是最大的不同** |

   **→ 判定：是「同一家族的第三格」，不是「另一个话题」**。**三条硬证据**：① **位置完全一样**（都在最前面领那个东西），**教学动作零成本迁移**；② **`all` 和 `both` 共享同一条老规矩**（后面那个东西带上 s、搭档用 `are`——`:27924` L148 深挖卡逐字「名字要带上 s（books），搭档要用 are」）；③ **`all` 的钩子已经被 L148 亲手挂好**（`:27926` 逐字「要是三个以上一起都好，英语有另一个词，今天先不碰」）。**⚠️ 但有一条必须切开**：**`all` 没有 `neither` 那样的换词伙伴**——**批二十五教的「有『不』就换个词」这条机制，本批不能再用**（第几次应用的问题不存在，因为本批不做否定侧，§2.4）。

3. **★ `all` 的第 1 课与 `both` 的第 1 课不会重复，差别的确够一课一增量——差别在「那个东西带不带 the」和「数得清还是数不清」**〔实读〕

   本轮的处置是**把两课的目标句并排摆出来，逐词看差在哪**：

   | | L148（已交付） | 本批第 1 课（候选） |
   |---|---|---|
   | 目标句 | `Both books are good.`（`:27852`） | `All the books are good.` 或 `All three books are good.` |
   | 中文 | 两本都好 | 全都好／三本都好 |
   | 队首词 | `Both` | `All` |
   | 队首词后面 | **直接跟那个东西**（`books`） | **可跟 `the`／`my`／数字**（`the books`／`my books`／`three books`）——**`both` 实测 `both of` GL 0、`both the` GL 0** |
   | 教的动作 | **「都」不夹中间，走到最前面** | **「全都在里面」——一个不落**（不是位置，是范围） |
   | 定量性 | 数得清的**两个** | **三个以上／数不清的**（`all the tea` 也行） |

   **→ 差别够不够一课一增量：够**。**理由**：**L148 教的是「位置」（中间→最前面），本批第 1 课教的是「范围」（一大群，一个不落）＋「数得清的数不清的都能装」**——**两个动作不同**。**⚠️ 但「位置」这件事本批要少讲**：L148 已经讲过两边都站最前面，**本批第 1 课的 `contrast` 里「位置」只能占 1 条（回流），不能占 2–3 条**（§7.1 已按此写）。

4. **★ `all` 与 `every` 的分工要不要一起做：要，而且必须一起做——因为 `every` 在库里的 142 处全部不是量词义**〔实读〕

   这是本批**最需要写清楚的一条实测**：

   | 口径 | `every` 命中 | 其中 `every day` | `every night` | `every morning` | **非时间义** |
   |---|---|---|---|---|---|
   | **整文件行扫描（GLraw）** | **142** | 110 | 6 | 1 | 25（全在注释、字段名、讲解句里） |
   | **学习者可见句槽（GLstruct）** | **44** | **41** | **2** | **1** | **0** |

   **→ 实测结论：`every` 在库内 44 处学习者可见命中里，44 处全部是「every ＋ 时间词」（`every day` 41／`every night` 2／`every morning` 1），「every ＋ 东西」为 0**。**→ 学习者对 `every` 的唯一印象是「每天」（频率副词短语），而 `every ＋ 单数东西`（`Every student is here.`）这个量词义是**零**。**→ 若本批只做 `all` 不做 `every`，`all` 会缺一个必须切开的邻居**：`all` 后面带 s（`All the students are here.`），`every` 后面不带 s（`Every student is here.`）——**这一对是零基础最容易混的一对**（中文两句话都能说「每个学生都到了」），且**上游明文有对照**（Cambridge `all` 页逐字 `We use all with plural and uncountable nouns and every with singular nouns`）。

5. **★ 轴 C／轴 D 本轮实测复核为「仍不宜做」，且 `seem` 的问题比批二十三估的更硬**〔实读〕：
   - **轴 C `seem`／`appear`**：**两词及全部变位在 GL 与 HC 双文件均为 0**（实测 `seem`／`seems`／`seemed`／`appear`／`appears`／`appeared` 六串全 0，两法一致）。**造词成本＝2 词**（与批二十五持平）——**但 Cambridge 词典页 `seem` 逐字标注 `B1`**（本轮现取现核），**且页内四个小节标题逐字为 `Appear or seem?`／`Seem + to-infinitive`／`Seem`／`Seem as a linking verb`**——**四节里三节需要「to 小垫板」或「系动词」概念**，而我方 L125 已教 `It looks nice.`（看起来怎么样）**同属「看着／像」语义场，距离过近**（§4.1）。
   - **轴 D `would rather`**：**`rather` GL 0／HC 0；`prefer` GL 0／HC 0**（两法一致）。**但本批实测出一个批二十四没记的新事实：`would` 在库内 GLstruct 已有 34 处、分布在 L4／L62／L69／L70 四课，全部是 `would like`／`Would you…?`**——**`would rather` 的第 1 课必然要讲「would 后面不跟 to、直接跟动作原样」，这是 L62 `would like`（后面跟东西）的第三次「would 家族」扩展**（L62 → L69／L70 → 本批）。**2 课封顶的判定本轮维持**（§4.2）。

### 0.2 两套口径的分歧点（必须写明，否则会被误读）

| 词 | GLraw（整行） | GLstruct（学习者句槽） | 分歧来源（逐条） |
|---|---|---|---|
| **`all`** | **5** | **2** | 3 处分歧：`:12798`（`at all`——**是 `at all` 整块，不是量词**）、`:20322`（`You're all wet!`——**是「浑身」义，不是量词**）、`:21844`／`:22037`（**课注 id `lesson-117-all-i-wanted` 与案件 id `hunt-all-i-wanted`，是标识符不是词次**）。**→ 学习者实际见过的 `all` 只有 2 处，且都不是量词义** |
| **`every`** | 142 | 44 | 98 处分歧全在**注释、`everyDay` 类字段名、中文讲解里引的 `every day`** |
| **`though`** | **3** | **0** | 3 处**全在深挖卡的讲解段落里**（中英混排），**没有任何一处出现在学习者要说的英文句子里**——**这正好复核了批二十五的判定**（「宣布的是概念不是词」） |
| **`both`／`neither`** | 154／92 | 51／32 | 分歧在 `bothRight` 字段名与注释 |

**→ 本报告后续凡涉及「学习者见过几次」，一律用 GLstruct 口径；凡涉及「库里有没有这个词」的零／非零判定，用 GLraw 口径（更宽），**两处不一致时并列写出**。

---

## §1 逐轴缺口盘点

### 1.1 四条轴的一句话处境（本轮实读汇总）

| 轴 | 候选 | 造词成本 | 课程位（上游） | 我方缺口 | 学习者真实需求 | 本轮判定 |
|---|---|---|---|---|---|---|
| **A** | `though`／`even though`／`unless`／`in case` | **4 词 ＋ 2 短语**（`in spite of`／`despite`） | **Murphy 中级 U113／U114／U115 三连**（本轮逐字复核见 §1.2） | **`unless`／`in case` GL 0；`even` GL 0** | **高**（「除非」「万一」是中文高频） | **❌ 不取**（§3：6 条凑不满） |
| **B** | **`all`** | **1 词**（`all`）＋ 若带 `every` 则 **2 词** | **Murphy 初级 U80（`every and all`）＋ 中级 U90（`all every whole`）——双册双格** | **`all` 量词义 GLstruct 0** | **高**（中文「都」的第三格） | **✅ 取**（2 课） |
| **C** | `seem`／`appear` | **2 词** | **Murphy 双册 TOC 均无独立单元**（本轮复核 `seem`／`appear` 两串在两份归一化 TOC 里均无命中）；Cambridge 词典页 `seem` ＝ **B1** | 双词全零 | **中低**（中文「好像」更常用「看起来」，L125 已覆盖） | **❌ 押后** |
| **D** | `would rather` | **2 词**（`would` 已有，`rather` 新造） | **Murphy 中级 U59 `prefer and would rather`**（本轮逐字复核，§4.2） | `rather` 0／`prefer` 0 | **中**（中文「宁愿」口语频率低于「都」「除非」） | **❌ 押后**（2 课封顶维持） |

### 1.2 轴 A 的上游课程位逐字复核（本轮现取）

〔实读〕`/tmp/murphy_int_norm.txt` 逐字（**同一串连续出现，是本报告引用的原件**）：

> `...112evenconjunctionsandprepositions113althoughthougheventhoughinspiteofdespite114incase115unlessaslongasprovided116as(asiwalked/asiwasetc.)...`

**→ 逐字确认：中级 U112 `even`／U113 `although though even though in spite of despite`／U114 `in case`／U115 `unless as long as provided`——四格连续**。**`even` 有独立单元位（U112）这一点批二十四未记**（批二十四只把 `even` 当「垫子」）。

〔实读〕中文侧索引 `/tmp/ec_all.txt`（**870 条 URL**）逐字筛出与轴 A 相关者：
```
https://english.cool/although-despite/
https://english.cool/although/
https://english.cool/despite/
https://english.cool/even-though/
https://english.cool/unless/
```
**→ `though` 无独立专文**（只有 `although`／`despite`／`even-though` 三篇＋`although-despite` 对举篇）——**这复核了竞析「句尾 though 撑不起一课」的判定**。

〔实测〕中文侧 `unless` 专文现取，逐字给出 **3 条 ❌**：
```
❌ Unless the weather will get better, the soccer game will be cancelled.
⭕️ Unless the weather gets better, the soccer game will be cancelled.
   解释逐字：「unless 後的副詞子句即使是在描述未來的事，也不能加 will」
❌ Unless we will come up with a better plan, they will work with another company.
❌ What will you do unless you get the loan?
⭕️ What will you do if you don't get the loan?
   解释逐字：「unless 不能出現在疑問句中」
```
**→ `unless` 的 3 条 ❌ 里，2 条打在「❌will 规则」上**（见 §3.3 的应用次数实算）。

### 1.3 轴 B 的上游课程位逐字复核（本轮现取）

〔实读〕`/tmp/murphy_ess_norm.txt` 逐字：
> `...76someandany77not+anynonone78not+anybody/anyone/anythingnobody/no-one/nothing79somebody/anything/nowhereetc.80everyandall81allmostsomeanyno/none82botheitherneither83alotmuchmany...`

〔实读〕`/tmp/murphy_int_norm.txt` 逐字：
> `...87much,many,little,few,alot,plenty88all/allofmost/mostofno/noneofetc.89both/bothofneither/neitherofeither/eitherof90alleverywhole91eachandevery...`

**→ 逐字确认：`all` 有双册双格**（初级 U80 `every and all`／中级 U90 `all every whole`），**且两格里 `all` 都与 `every` 同单元**——**这是本批「`all` 与 `every` 必须一起做」的上游依据**。**⚠️ 与批二十五的对照**：`both`／`neither` 是初级 U82 一格 ＋ 中级 U89 一格（**两格**）；**`all` 也是两格（U80 ＋ U90），且第二格还是和 `every` 共用**。

〔实读〕中文侧索引逐字筛出：
```
https://english.cool/both/          （批二十五已用）
https://english.cool/each-every/
https://english.cool/each-vs-every/
https://english.cool/every-day-everyday/
https://english.cool/quantifiers/
https://letmeenglish.com/all-both/      ★ 本批关键
https://letmeenglish.com/all-pronouns/  ★
https://letmeenglish.com/both-either-neither/
https://letmeenglish.com/every-each/    ★
```
**→ 关键实测：`all` 在中文侧有一篇专门与 `both` 对举的专文**（`letmeenglish.com/all-both/`，页题逐字「一次搞懂 all／both 用法！the 與 of 差異＋例句與練習」）。**这与我方 L148 的钩子（「三个以上……今天先不碰」）指向同一个对举结构**。

〔现取〕该专文逐字要点：
```
「有沒有 the 都一樣的意思」——both + noun 与 both the + noun
「we 使用 all + 名詞（中間沒有 the）來指一個普遍人/事/物的狀態」
「all + the/my/etc + 名詞來特別強調"特定的"人/事/物的狀態」
「all/ both + of 可以用在 the/my/Tom's + 名詞之前。但 of 經常被省略。」
「如果名詞之前沒有限定詞 the/my/Tom's，all/both + of 就不能直接加在名詞之前。」
❌「不能說 All/both of students」
❌「不能說 All us」「NOT All us」
```
**→ 中文侧给出 3 条 ❌，全部围绕「`of` 与限定词的搭配」**——**⚠️ 这是本批的一处诚实折扣**：**`of` 属中级 U88／U89 那一层（我方批二十五已明确「不做 `both of`」），本批沿用同一条 Non-goal（§6.8）**，**故中文侧这 3 条 ❌ 本轮一条都用不上**。

〔现取〕Cambridge 词典页 `all` 逐字给出的分档与小节：
```
determiner/pronoun: A1     adverb: A2     adverb(equal points): B1
小节标题逐字：All as a determiner / All with no article / All of / All without of /
             All with personal pronouns / All as a pronoun / All as an adverb /
             All meaning 'completely' or 'extremely' / All: not all / All: after all /
             All or every? / All and every + nouns / All (of) the / All day, every day /
             All or every: typical errors / All or whole? / ...
typical errors 逐字：「We don't use every before determiners」
                  「We don't use all before a and an」
```
**→ 关键实测三条**：① **`all` ＝ A1**（**与 `both` 同档，低于 `neither` 的 B2**）——**这比我方历史上多数选题都低**；② **Cambridge 有整整两个小节讲 `all` 与 `every` 的分工**（`All or every?` ＋ `All and every + nouns`），**是本批最厚的上游支撑**；③ **两条 typical errors 都不属于本批范围**（`every` 后面不跟限定词＝本批第 2 课反而要讲；`all` 后面不跟 `a/an`＝可作本批一条 contrast）。〔现取〕Cambridge 词典页 `every` 逐字：**`every` ＝ A1**（ALL 义与 REPEATED 义均 A1；GREATEST 义 B2）。

### 1.4 「都」的中文侧实测（本轮口径）

〔实测〕`grammarLessons.ts` 中文字面（含讲解层）：

| 串 | 命中 |
|---|---|
| `都` | **756**（分布在 150 课里；**L148–L150 占 44＋34＋25 ＝ 103**，即**批二十五三课独占 13.6%**） |
| `全部` | **2** |
| `所有` | **3** |
| `全都` | **0** |
| `每个` | **2**（`:302` 逐字「开学第一天，老师让每个**人**做自我介绍」／`:8286` 逐字「**每个动词**的门口规矩不一样」——**两处都不是「每个 ＋ 东西」的量词用法**） |

**→ 关键实测三条**：① **批二十五三课的「都」字密度（103 处）远超全库平均**，**说明「都」这个字在本库已经是一个被高密度使用的教学词**——**本批复用它，认知成本最低**；② **中文「全都」在本库命中 0、「每个」的 2 处都不是量词义**——**本批若要教 `every`（「每一个」），中文侧要新造一个说法，这也支持「`every` 用切开位、不做独立立岗课」**（§2.4／§6.3）；③ **`全部` `所有` 极少（2／3）**，**不建议本批引入「全部」做锚词**。

---

## §2 轴 B 专项（本轮重点）：`all` 与已教 `both`／`neither` 的关系

### 2.1 「中文一个『都』字对应英语三个词」是不是一个值得教的认知？

**判定：是，而且本库已经在教它了——本批是补完最后一块。**

**三条理由（按硬度排序）**：

**① 这条认知在库里已经是「半成品」，不教反而会留下一个未收的口子。**

〔实读〕L148 深挖卡 `:27926` 逐字：

> `"顺带记一句：这个 both 只管「两个」。要是三个以上一起都好，英语有另一个词，今天先不碰。"`

**→ 实测：全库唯一一处「另一个词」的预告就在这一行**（`grep -n "今天先不碰"` 全库仅此 1 处，本轮实测 `另一个词` 命中 2 处，另 1 处是 L56 `:10309` 讲月份大写的 `may`／`May`，与本轴无关）。**一句话「英语有另一个词，今天先不碰」如果永远不兑现，就是一个悬空钩子**——**学习者记住了「有另一个词」，但库里没有那个词**。

**② 中文「都」的三格在库里的覆盖是「两格半」。**

〔实读〕批二十五已交付 `both`（两个·肯定）→ `neither`（两个·否定）。**`all`（三个以上）为 GLstruct 0**（§0.2 逐条）。**→ 中文「都」的三格：`both` ✅／`neither` ✅／`all` ❌**。

**⚠️ 但必须诚实标注一处不对称**：**`neither` 不是 `all` 的否定伙伴**。`neither` 管的是「两个都不」；**「三个以上都不」英语用 `none`／`no` 系**——**本轮实测 `none` GL 0／HC 0，`no one` GL 0／HC 0，`nobody` GL 0／HC 0**，**`no`（限定义）GLstruct 7 处但全是 `No, thanks.` / `No, I can't.` 这类应答**。**→ 中文「都」的完整四格应是「两个都（both）／两个都不（neither）／三个以上都（all）／三个以上都不（none）」——本批只能做第三格，第四格在库里连一个词都没有**（§6.8 Non-goals）。

**③ 上游把这一对当「必须切开的一对」讲，不是「顺带一提」。**

〔实读〕Cambridge `all` 页有两个并列小节：**`All or every?` ＋ `All and every + nouns`**，逐字结论 `We use all with plural and uncountable nouns and every with singular nouns`。**→ 上游把「`all` 与 `every`」的分工单独立节讲**，是**与我方「切开课」形态直接对应**的上游支撑。

### 2.2 `all` 与 `both`／`neither` 是什么关系：**同一家族第三格**（判定＋依据）

**判定：同一家族第三格**（不是另一个话题）。**四条依据**：

| # | 依据 | 逐字／实测 |
|---|---|---|
| 1 | **位置相同**——都站最前面领那个东西 | L148 `:27857` 逐字 `"说「两个都」：both 站最前面"`；**`all` 同样站最前面**（`All the books are good.`） |
| 2 | **搭配相同**——后面那个东西带上 s、搭档用 `are` | L148 `:27924`（深挖卡）逐字 `"后面那对东西有两个小变化：名字要带上 s（books），搭档要用 are。"`；**`all` 后面也是好多东西，同样带 s、同样 `are`** |
| 3 | **L148 亲手挂了钩子** | `:27926` 逐字「要是三个以上一起都好，英语有另一个词，今天先不碰」 |
| 4 | **中文侧同一篇专文对举** | `/tmp/lme_all.txt` 逐字 URL `https://letmeenglish.com/all-both/`，页题逐字「一次搞懂 all／both 用法！」 |

**⚠️ 一条必须切开的差别（本批最大的技术难点）**：**`all` 没有 `neither` 那样的换词伙伴**。批二十五的核心机制是「有『不』就换个词」（`both`→`neither`）；**`all` 在「有『不』」时不是换一个词，而是改用 `none`／`no` 系**——**那不是换词，是换一套东西（而且这套东西库里是零）**。**→ 本批不做否定侧**（§6.8）。

### 2.3 `all` 的第 1 课与 `both` 的第 1 课会不会重复？（任务书点名要答）

**判定：不会重复，差别够一课一增量。依据是「两个动作不同」。**

| | L148 已交付 | 本批第 1 课 | 差在哪 |
|---|---|---|---|
| **教的动作** | **位置**：中文的「都」在中间，英语的 `both` 要走到**最前面** | **范围**：「全都在里面，一个不落」——**它管的是三个以上／数不清的** | **动作不同**（位置 vs 范围） |
| **队首词后面** | **直接跟那个东西**（`Both books`） | **可以跟 `the`／`my`／数字**（`All the books`／`All my books`／`All three books`） | **⚠️ 这一条是真正的增量**：`both` 实测 `both of` GL **0**、`both the` GL **0**（本轮实测），**`all` 天然就往「`all the`／`all my`」走** |
| **数得清吗** | 只能两个 | **三个以上，也可以数不清**（`All the tea is hot.`） | **`all` 能装数不清的东西，`both` 不能** |
| **中文侧的中文词** | 「两个都」 | **「全都」**（⚠️ 本库 `全都` 命中 **0**，须新造中文口径，§1.4） | **中文侧要新造一个说法** |
| **搭档** | `are`（复数）／`neither` 用 `is` | **`are`（复数）**；**数不清的东西用 `is`**（`All the tea is hot.`） | **"数不清也用 all"这一条是纯新知识点** |

**→ 三条「不重复」的硬依据**：

1. **L148 的教学动作是「中间→最前面」**（`:27923` 深挖卡逐字 `"中文说「两本书都很好」——「都」字夹在中间。英语不这样：both 要走到最前面去"`）——**本批第 1 课不需要再讲一遍这个动作**（已在最前面了），**要讲的是「一个不落」和「装得下多少」。**
2. **`both` 与 `all` 后面能跟的东西不一样**——`both` 后面直接跟那个东西（**`both the` 实测 GL 0**），**`all` 后面可以站 `the`／`my`／数字**。**这是零基础一眼能看出的差别**（用「`all` 后面可以站 `the`」这条讲，不需要术语）。
3. **中文侧的字不同**——L148 讲「两个都」，本批讲「**全都**」（本库 `全都` 命中 0，须新造，符合「一课一增量」的认知条件）。

**⚠️ 一条必须承认的重复风险（诚实标注）**：

| 风险点 | 实测 | 处置 |
|---|---|---|
| **「后面带上 s ＋ 搭档用 are」这一条在两课都出现** | L148 用掉 2 条（`contrast` ②③，逐字 `"两个以上，后面那个东西要带上 s——Both 【books】。"` / `"好几样东西一起出场，搭档要用 are——Both books 【are】 good。"`） | **本批第 1 课这两条只能作「双正解回流」（占 1 条），不能作主考点**（§7.1 对比卡方向已按此排） |
| **「都站最前面」这一条在两课都出现** | 同上 | **本批 `contrast` 里「位置」只占 1 条**，且**写成回流口径**（"第 148 课讲过：它站最前面——今天那个词也站最前面"） |

### 2.4 本轴应该几课、每课教什么？（结论）

**判定：2 课。第 1 课 `all` 立岗，第 2 课 `every` 切开（`every` 不做独立立岗课）。**

| 课 | 干什么 | 为什么这么切 |
|---|---|---|
| **第 1 课（L151）** | **`all` 立岗**：三个以上一起、一个不落；后面带上 s、搭档用 `are`；**数不清的东西也能装** | **`all` ＝ A1 档（低），是全章唯一的新词立岗位**；**`all` 后面可直接跟 `the` 是最大增量** |
| **第 2 课（L152）** | **`every` 切开**：`all` 后面是好多个（带 s），`every` 后面只说一个（不带 s） | **`every ＋ 时间词` 库内已有 44 处学习者可见命中**（`every day` 41／`every night` 2／`every morning` 1）——**学习者已经天天在用 `every day`，只是不知道 `every` 后面还能跟东西**。**→ 这是「认读升格」位，不是造词位**（`every` 的**词**已经会了，**用法**才要教） |

**⚠️ 为什么不给 `every` 独立立岗课（这是本轮的一个关键取舍）**：

- **`every` 的词本身已经烂熟**（GLstruct **44** 处，`every day` 占 41）——**再开一课讲「every 是什么」是浪费时间**；
- **真正的缺口只有一条**：`Every student is here.`（`every` ＋ **单数**东西）——**GLstruct 实测这类句子命中 0**；
- **这一条缺口正好是 `all` 的对立面**（带 s vs 不带 s），**所以它是「切开课」的天然内容，不是立岗课**。

**→ 与批二十五的结构对照**：批二十五是「立岗（`both`）→ 切开（`neither`）→ 收口」**3 课**；**本批是「立岗（`all`）→ 切开（`every`）」2 课**——**⚠️ 本批不设收口课**（§6.6 给出理由：收口课的先例是「前几课的内容排一行」，而本批只有 2 课，排一行的素材不足；全库最短章为 3 课——季区间长度实测为 3–12 课，见 §1.3 的季结构说明）。

### 2.5 中文「都」四格的库内覆盖实况（本轮实测，供后续批次用）

| 格 | 中文 | 英语 | 库内状态 | 备注 |
|---|---|---|---|---|
| 1 | 两个都 | `both` | **✅ L148–L150 已交付**（GLstruct 51） | — |
| 2 | 两个都不 | `neither` | **✅ L149–L150 已交付**（GLstruct 32） | — |
| 3 | 三个以上都／全都 | **`all`** | **❌ GLstruct 2 且都不是量词义** | **本批候选** |
| 4 | 三个以上都不 | `none`／`no one`／`nobody` | **❌ 三个词在 GL 与 HC 双文件全 0** | **本批不碰**（§6.8）；**留给后续批次，须先评估「`none` ＋ 名字版 vs 无名字版」两课量** |

---

## §3 轴 A 专项（关键待验）：2 课能否各凑满 6 条 contrast？

### 3.1 先立标准：全库 6 条对比卡的「真实构成」是什么（本轮实测）

〔实测〕150 课 `contrast` 条数：**每课恰好 6 条，150/150，无一例外**（两法一致）。

〔实测〕**逐条构成**（`带 wrongMark 的新错` ＋ `wrongMark: null 的新错` ＋ `bothRight 双正解`）：

```
3+3+0 =  2 课     4+2+0 =  4 课     6+0+0 = 23 课    5+1+0 = 12 课
4+1+1 =  4 课     5+0+1 =  5 课     3+1+2 =  3 课    4+0+2 = 10 课
2+1+3 =  8 课     2+0+4 = 25 课     3+0+3 = 43 课    1+1+4 = 11 课
                                                      合计 = 150 课
```

**→ 最近 26 课（L125–L150）的实测分布（收窄窗口，是更贴近本批的样本）**：
```
3+0+3 = 18 课   -> 125,126,127,128,129,130,131,132,135,136,137,139,142,143,145,146,148,149
4+0+2 =  6 课   -> 133,138,141,144,147,150     （全部是「收口 · 零新知」课）
2+1+3 =  2 课   -> 134,140                      （多了一条「整句缺一块」型）
```
**→ 关键结论**：
- **最近 26 课（L125–L150）的主导形态是 `3+0+3`**（L125–L132、L135–L137、L139、L142、L143、L145、L146、L148、L149 等）——**即「3 条带 wrongMark 的新错 ＋ 3 条双正解回流」**；
- **收口课是 `4+0+2`**（L133／L138／L141／L144／L147／L150）——**4 条带标记 ＋ 2 条双正解**；
- **`bothRight` 的文案规范**：**332 条双正解卡中，326 条以「两句都对——」开头**（实测 `startswith("两句都对")` ＝ **326**，另 **6 条**（L50／L51／L52／L56／L101／L133）用的是「两句也都对——」「12 个月挂历认读——」「认读一句，混个脸熟：」这类变体开头，**不是「两句都对」**）；**双正解卡的 `whyZh` 必须说明「为什么两句都对」，不能只说「都对」**。
- **`contrast.correct` 的规范（本轮实测，前两批未记）**：**「`correct` 是否等于本课 `targetSentence`」不是硬约束，但最近 26 课（L125–L150）已形成明显惯例**——**6 条全等于目标句的课有 12/26 课**（L125／128／129／130／131／135／136／139／142／145／148／149），**其余 14 课里有 1–2 条 `correct` 指向「本课的另一个句式」**。**逐类实测（L125–L150）**：**84 条带标记卡里 60 条 `correct` ＝ 目标句**；**72 条双正解卡里 70 条 `correct` ＝ 目标句**（唯二例外是 L140 与 L147 的「另一个说法」卡）。**→ 本批设计对比卡时，6 条里至少 4–5 条 `correct` 用本课目标句，其余可指向本课的变体句**（**§7 已按 6/6 全部指向目标句设计，是更保守的一侧**）。

**→ 逐字引用（L148 的三条带标记卡，`wrong:` 行逐字在 `:27871／:27877／:27883`；三条的 `correct` 全部是 `Both books are good.`）**：

```
wrong: "Books both are good."     wrongMark: "both"   correct: "Both books are good."
wrong: "Both book is good."       wrongMark: "book"   correct: "Both books are good."
wrong: "Both books is good."      wrongMark: "is"     correct: "Both books are good."
```
**→ 三条都围绕同一件事的三个面（位置／带 s／搭档）**，且 **correct 全部是本课目标句**。

### 3.2 轴 A 逐条设计（课 1：`even though` ＋ `in spite of`／`despite`）

**目标句**（≤8 词）：`I will go out even though it is raining.`（**8 词**，实测全库 8 词目标句共 **14** 课，是上限内的合法长度）

| # | 类型 | 错句（`*` 标记中式错因） | 干扰点（中文侧） | 来源 |
|---|---|---|---|---|
| ① | **带标记·新错** | `*Even I've polished and cleaned the vase, it still looks old.` | 中文「即使」直接拖一整句——**「即使」在中文里是一个词，学生译成 `even` 就以为够了** | 中文侧 `even-though` 专文逐字 ❌（本轮现取复核一致） |
| ② | **带标记·新错** | `*I will go out in spite of it is raining.` | 中文「虽然下雨」后面直接跟一个完整的小句子——**汉语的「虽然」后面就是小句子，`in spite of` 后面不能跟小句子** | Cambridge `In spite of and despite` 页 Warning 框逐字 `We don't use a that-clause after in spite of or despite.` |
| ③ | **双正解** | `I will go out although it is raining.` | 两句都对——**`although` 与 `even though` 是同一件事的两档强度**（BC 逐字 `Even though is slightly stronger and more emphatic than although.`） | 上游明文 |
| ④ | **双正解** | `I will go out despite the rain.` | 两句都对——**同一个意思的两种说法**（`despite` ＋ 东西 vs `even though` ＋ 小句子） | 中文侧 `although-despite` 专文 |
| ⑤ | **❌ 缺** | —— | **需要第 3 条新错，但上游只给得出 2 条** | — |
| ⑥ | **❌ 缺** | —— | **需要第 3 条双正解，但可借的旧句已用尽**（见 §3.4） | — |

**→ 课 1 实算：4 条（2 带标记 ＋ 2 双正解），缺 2 条。**

### 3.3 轴 A 逐条设计（课 2：`unless` 单点）

**目标句**（≤8 词）：`I will go out unless it rains.`（**7 词**）

| # | 类型 | 错句 | 干扰点 | 来源 |
|---|---|---|---|---|
| ① | **带标记·新错** | `*Unless the weather will get better, I will go out.` | 中文「如果天气**会**变好」的「会」跟着跑进 `unless` 里 | 中文侧 ❌ 逐字（本轮现取，两条同型） |
| ② | **带标记·新错** | `*What will you do unless you get the loan?` | 中文「除非」可以直接放在问句里，英语不行 | 中文侧 ❌ 逐字（`unless 不能出現在疑問句中`） |
| ③ | **双正解** | `I will go out if it does not rain.` | 两句都对——`unless` 就是「如果不」的另一种说法（中文侧逐字 `Unless 其實可以看成 "If not"`） | 上游明文 |
| ④ | **双正解** | `I will stay at home if it rains.` | 两句都对——**同一个「下雨」的两条路** | 我方 L48 现有句 |
| ⑤ | **❌ 缺** | —— | 需要第 3 条新错；**第 3 条只能是「`unless` 与 `in case` 的差别」，但那需要 `in case` 先立岗（`case` GL 0）** | — |
| ⑥ | **❌ 缺** | —— | 需要第 3 条双正解；**可借的旧句实测只剩 `As soon as I finish, I will eat.`（L142／144 已用 2 次）** | — |

**→ 课 2 实算：4 条（2 带标记 ＋ 2 双正解），缺 2 条。**

### 3.4 为什么填不满：第 5、6 条的三个来源，本轮逐条封死

| 可能的第 5／6 条来源 | 本轮实测 | 判定 |
|---|---|---|
| **借 L139–L144 的旧句做双正解** | **逐字实测 `contrast.wrong` 复用：`it is raining but i will go out` → L139,140,140,141,141（5 处）；`it is cold today` → L87,88,89,90,91,96（6 处，已达上限）** | **❌ 封死**——L139–L144 四课已互相借满，**再借就是同一句第 3 次**（上限 6，但同一章内 3 次观感上已是重复） |
| **借 L48（`If it rains, I will stay at home.`）** | **实测 L48 的 `practice` 用法已在 L48 一课内密集使用；目标句本身在 L60／L91／L142／L144 等作为复现出现过** | **🟡 只能给 1 条**（课 2 的 ④ 已用） |
| **`even though` 的强度对照轴（第 3 条新错）** | **实测 `even` GL 0／HC 0（两法一致）**——**「`even though` 比 `although` 更强」这条对照，在库里连一个 `even` 都没有** | **❌ 封死**（批二十四已记，本轮复核仍成立） |
| **`in case` 的预防义（第 3 条新错）** | **实测 `in case` GL 0／HC 0；`case` GL 0／HC 1（HC 那处是注释里的 `如 case 9`，非教学）** | **❌ 封死**（批二十四已记，本轮复核仍成立） |
| **`❌will 规则` 作第 3 条新错（`unless` 里带 will）** | **实测该规则按课分布：L47(1)／L48(15)／L49(6)／L109(1)／L142(13)／L143(5)／L144(3)** | **⚠️ 这已经被课 2 的 ① 用掉了**——**再用一次就是同一规则在 2 课内讲两遍** |

### 3.5 §3 结论（任务书要的判定）

> **判定：轴 A 的 2 课，「每课凑满 6 条 contrast」——凑不满。**
>
> - **课 1（`even though` ＋ `in spite of`／`despite`）：实算 4 条**（2 条带标记 ＋ 2 条双正解），**缺 2 条**；
> - **课 2（`unless`）：实算 4 条**（2 条带标记 ＋ 2 条双正解），**缺 2 条**；
> - **轴 A 的实际课量：2 课（维持批二十五的重算结果），但两课都只能写到 4 条**——**不是「3 课压成 2 课」，而是「2 课各自都缺 2 条」**；
> - **⚠️ 与批二十五的差异**：批二十五只说「课量从 3 重算为 2」，**未算过「2 课各自能不能满」**；**本轮算完的结论是「2 课各自也不满」**——**即批二十五的重算还偏乐观**；
> - **若要开工轴 A，必须先解一件事**：**修改「每课恰好 6 条」这条 150 课无一例外的红线**（实测 150/150 全部为 6）——**本轮不推荐为单批破这条线**（§9 未核实项 ① 已登记该红线是否为硬门）。

**→ 轴 A 押后的前置项（更新版）**：
1. **（已有）** `though` 旧判例口径——批二十五已关闭，**本轮复核确认关闭有效**（实测 `though` **GLstruct 0**：3 处 GLraw 命中全在深挖卡讲解段落里，**没有任何一处是学习者要说的英文句**）；
2. **（本轮新增，P0）** **「每课恰好 6 条 contrast」的红线是否为硬门**——**若为硬门，轴 A 永久不可做**；**若可放宽到 4 条，轴 A 可做 2 课**；
3. **（本轮新增）** 若要做课 1，**`in spite of`／`despite` 是否降为认读**（**造词成本从 4 词降到 2 词 ＋ 1 认读**）。

---

## §4 轴 C 与轴 D 的复核（供对照，本轮不取）

### 4.1 轴 C `seem`／`appear` 的实测与判定

〔实测〕**六串全零，两法一致**：

| 词 | GLraw | GLstruct | HC |
|---|---|---|---|
| `seem` | **0** | **0** | **0** |
| `seems` | **0** | **0** | **0** |
| `seemed` | **0** | **0** | **0** |
| `appear` | **0** | **0** | **0** |
| `appears` | **0** | **0** | **0** |
| `appeared` | **0** | **0** | **0** |

〔现取〕Cambridge 词典页 `seem`：**CEFR ＝ `B1`**；四个小节标题逐字 **`Appear or seem?`／`Seem + to-infinitive`／`Seem`／`Seem as a linking verb`**。

〔实读〕`/tmp/ec_all.txt` 逐字：`https://english.cool/seem/`（有专文）；`/tmp/lme_all.txt` 逐字：`https://letmeenglish.com/you-seem/`（有专文）。**→ 中文侧有 2 篇专文，比我方历史上某些批次的候选还厚**。

**→ 判定：❌ 本批不取（维持批二十三／二十四／二十五的连押）**。**理由三条**：
1. **档位落差**——**`seem` ＝ B1**，而我方当前课程位 L125（`It looks nice.`）是 A1 级；**B1 词插在 A1 章之后，难度曲线是断的**；
2. **语义距离过近**——**L125 `It looks nice.`（`grammarLabel` 逐字 `看起来怎样 · look 中间站，后面跟「怎么样」`）已经覆盖「看起来怎么样」这个中文语义场**，`seem`／`appear` 的中文对译「好像」在**零基础口语里几乎不出现**（中文说「看着不错」多于「好像不错」）；
3. **上游课程位**——**Murphy 双册 TOC 对 `seem`／`appear` 均无独立单元**（本轮两串在两份归一化 TOC 里均无命中，实测），**只有 Cambridge 词典页（非语法页）**。

### 4.2 轴 D `would rather` 的实测与判定

〔实测〕**`rather` GL 0／HC 0；`prefer` GL 0／HC 0**（两法一致）。

〔实读〕`/tmp/murphy_int_norm.txt` 逐字：`...59preferandwouldrather60preposition(in/for/aboutetc.)+-ing...`——**U59 `prefer and would rather` 是一个独立单元，课程位干净**。

〔实读〕`/tmp/murphy_ess_norm.txt`：**`rather`／`prefer` 均无命中**——**初级册无该单元**。

〔实测〕**`would` 在库内 GLstruct 34 处，分布 L4／L62／L69／L70 四课，全部是 `would like`／`Would you…?`**。

〔实测〕中文侧有 2 篇专文：`https://english.cool/prefer/`／`https://english.cool/rather-than/`，另有 `letmeenglish.com/id-rather-than/`。

**→ 判定：❌ 本批不取，2 课封顶的判定维持**。**理由两条**：
1. **`would rather` 的第 1 课必然要讲「`would` 后面直接跟动作原样、不垫 `to`」**——**这是我方 `would` 家族的第三次扩展**（L62 `would like` ＋ 东西 → L69／L70 `Would you mind`／`Would you like` → 本批），**与批二十五「老规矩第 N 次应用」同型问题**；
2. **中文「宁愿」在零基础场景里的出现频率明显低于「都」「除非」**（**本轮实测中文侧 `宁愿` 在库内命中 0、`宁可` 命中 0**——**这两个字在本库里从未被使用过，说明连讲解里都不需要它**）。

### 4.3 四条轴的横向对照（一屏）

| 维度 | **轴 B `all`（推荐）** | 轴 A 让步链 | 轴 C `seem`／`appear` | 轴 D `would rather` |
|---|---|---|---|---|
| **造词成本** | **1 词**（`all`）；**＋`every` 也只需 1 词**（`every` 词已会，是认读升格） | **4 词 ＋ 2 短语** | **2 词** | **1 词**（`rather`；`would` 已有） |
| **上游课程位** | **双册双格**（初级 U80 ＋ 中级 U90），**且第二格与 `every` 共用** | 双册连续三格（U113–U115）＋ U112 `even` | **双册均无** | 中级 U59 一格 |
| **CEFR** | **`all` ＝ A1**（与 `both` 同档） | `unless` B1／`in spite of` B1 | **B1** | 中级单元 |
| **我方缺口** | **`all` 量词义 GLstruct 0** | `unless`／`in case` GL 0 | 双词全零 | `rather` 0 |
| **中文侧专文** | **3 篇**（`all-both`／`all-pronouns`／`every-each`）＋ 2 篇 `each-every` | 5 篇（无 `though`） | 2 篇 | 3 篇 |
| **6 条能否凑满** | **✅ 能**（§7.1／§7.2 逐条给出 6 条） | **❌ 不能（各 4 条）** | 未设计（本批不取） | 未设计（本批不取） |
| **与已教撞车** | **低**——L148 的钩子指向本批，是接力不是撞车 | 高（L139–L144 刚做完） | **高**（L125 语义场） | 中（`would` 家族第三次） |

---

## §5 中文负迁移分析（推荐轴）

### 5.1 `all` 的典型中式错句（逐条 `*错句`）

| # | `*错句` | 干扰点（中文侧来源） | 判定依据 |
|---|---|---|---|
| **B1** | `*All of students are here.` | 中文「所有学生都到了」——「所有」后面直接跟「学生」，**学生译成 `all of students`（多了个 `of`）** | 中文侧 `all-both` 专文逐字 ❌ `不能說 All/both of students`；**⚠️ 但 `of` 属中级 U88 层，本批**不做**——**这一条只作「认读避坑」，不进 contrast**（§6.8） |
| **B2** | `*All students are here.`（想说「我们班的学生都到了」） | 中文「都到了」不需要 `the`；**英语说「这些学生」要带 `the`** | **⚠️ 本批头号负迁移**——**关键是「`all the` 与 `all` 的差别在「特定不特定」**（中文侧逐字 `all + the/my/etc + 名詞來特別強調"特定的"人/事/物`）。**本批第 1 课的主考点** |
| **B3** | `*All student is here.` | 中文「学生都到了」——「学生」不分单复；**英语 `all` 后面那个东西要带上 s** | 机制复用：**L11 `:1964` 逐字 `"两个以上要加 s。"` ＋ L148 对比卡②已用过一次**——**本批作回流（双正解位），不作主考点** |
| **B4** | `*All the students is here.` | 中文「都到了」的「都」不告诉你有几个；**英语 `all` 后面是好多个，搭档要用 `are`** | **L148 对比卡③已用过**（`Both books is good.` ❌）——**本批作回流** |
| **B5** | `*All the tea are hot.` | 中文「茶都烫」——「茶」在中文里可以指好几杯；**`all` 后面如果是数不清的东西，搭档要用 `is`** | **⚠️ 本批唯一的纯新错点**——**上游**：Cambridge 逐字 `We use all with plural and uncountable nouns`（复数与不可数都能用 `all`），**但搭档不同**。**这是本批第 1 课的第二个主考点**（§7.1） |
| **B6** | `*We all are here.` ／ `*All we are here.` | 中文「我们都到了」——「都」在主语和谓语中间；**英语的 `all` 要么站最前面（`All of us`），要么站在 `are` 后面（`We are all here.`）** | **⚠️ 上游明文有专节**（Cambridge `All as an adverb` 逐字 `it usually comes in the normal mid position for adverbs (between the subject and the main verb...)`）；**我方零覆盖**——**但这条要先教「`of` ＋ 人称」或用「`are all`」，两个都要新词**（`us` GLstruct 3／`of` GLstruct 18）——**本批不作主考点，只作认读避坑**（§6.8） |

### 5.2 `every` 的典型中式错句（第 2 课用）

| # | `*错句` | 干扰点 | 判定依据 |
|---|---|---|---|
| **E1** | `*Every students are here.` | 中文「每个学生都到了」——「学生」在中文里不分单复；**`every` 后面只能说一个（`Every student`），搭档用 `is`** | 上游 Cambridge `every` 页逐字 `We use every + singular noun` ＋ typical errors 逐字 `We don't use every with a plural noun`（错例逐字 `I go swimming every days`） |
| **E2** | `*Every are here.` | 中文「每个都到了」——「每个」可以单独说；**英语 `every` 后面必须跟那个东西** | 上游 Cambridge `every` 页 typical errors 逐字 `We don't use every on its own, without a noun`（错例逐字 `Every was decorated in a different style`） |
| **E3** | `*All student is here.`（想说「每个学生都到了」） | **中文「每个学生都」里的「都」让学生选 `all`**——**这是 `all`／`every` 混用的头号来源** | **⚠️ 本轴最关键的一条**：**中文两句话都能说「学生都到了」，英语要分「好多个一起（`All the students are here.`）」还是「逐个来（`Every student is here.`）」**。**第 2 课的主考点** |
| **E4** | `*Every students is my friend.` | 双重干扰（`every` ＋ 复数 ＋ `is`） | 同 E1 |
| **E5** | `*Every day I am here.`（想说「我每天在这儿」） | **⚠️ 反向干扰**：**学习者已经会 `every day`（GLstruct 41 处）**，**会把 `every day` 当成 `every` 的默认搭配，于是不敢说 `every student`** | **本课要正面切开**：`every` 后面跟时间（`every day`）跟跟东西（`every student`）**都是它**，**而且后者不说复数** |

### 5.3 两条干扰点的对照表（中文侧「都」与英语三词的分工）

| 中文 | 学生最可能的英语 | 正确 | 本批怎么讲（零术语） |
|---|---|---|---|
| 两个都 | `Both books are good.` | ✅ 同一句 | 第 148 课已教 |
| 两个都不 | `Both books are not good.` | `Neither book is good.` | 第 149 课已教 |
| **三个以上都** | `*All student is here.` ／ `*All of students are here.` | **`All the students are here.`** | **本批第 1 课**：`all` 后面那个东西带上 s；说「这些」要带 `the` |
| **数不清的都** | `*All the tea are hot.` | **`All the tea is hot.`** | **本批第 1 课**：数不清的东西，搭档用 `is` |
| **每一个（逐个）** | `*Every students are here.` | **`Every student is here.`** | **本批第 2 课**：`every` 后面只说一个 |
| 三个以上都不 | `*All are not here.` | `None of them are here.`（超纲） | **本批不碰**（§6.8） |

---

## §6 场景设计（零件逐词实测）

### 6.1 零雨线纪律复核（按任务书要求）

〔实测〕**`rain` 系与 L109 叙事资产按课分布**（零宽断言法，按课归属）：

| 资产 | 命中课数 | 按课分布 | L152+ 命中 |
|---|---|---|---|
| `rain` | 12 课 | 12,29,30,48,49,96,101,102,**109(43)**,110,127,139 | **0** |
| `raining` | 11 课 | 6,34,48,96(50),99,100,101,102,139(44),140(48),141(50) | **0** |
| `rainy` | 3 课 | 34,92,96 | **0** |
| `stops` | 2 课 | 94,**109(8)** | **0** |
| `stopped` | 3 课 | **109(40)**,110,139 | **0** |
| `the movie`／`movie` | 7 课 | 15,29,31,38,75,76,**109(7)** | **0** |
| `ends` | **1 课** | **109(2)** | **0** |
| `ended` | **1 课** | **109(8)** | **0** |
| `umbrella` | 8 课 | 4,20,33(12),49(30),85,86,91,112 | **0** |
| `wet` | **1 课** | **109(1)** | **0** |

**→ 结论：`rain`／`raining`／`rainy`／`stops`／`stopped`／`the movie`／`ends`／`ended` 这八项全部零命中于 L142 之后——L109 的专属叙事资产在最近 10 课里从未被碰过，本批继续不碰**（§6.3 的场景锚全部走 `mansion`／`campus` 的**室内与桌面**，不涉及天气）。

### 6.2 场景锚的候选零件（逐词实测，两法并列）

**本批第 1 课的场景锚选定：书桌上摊着的几本书（`mansion`）**——理由是**与 L148／L149 那张书桌是同一个地方、换了东西的数量**（**接力，不是撞车**）。

| 零件 | GLraw | **GLstruct** | HC | 库内先例 | 判定 |
|---|---|---|---|---|---|
| `book` | 498 | **130** | 47 | 全库最高频物件之一 | ✅ |
| `books` | 158 | **36** | 49 | L11／L26／L30／L33／L40／L44／L73／**L148／L149** | ✅ **但 L148／L149 刚用过「书」**——**本批要用「三本以上／一摞」的形态切开** |
| `three` | 98 | **21** | 43 | L6(3 点)／L11(3 本书／3 个哥哥)／L26(3 个苹果)／L34／L72／L95／L99 | ✅ **但 L26 的「三个苹果」是名句** |
| `the` | 2239 | **699** | 262 | 全库基础词 | ✅ **`all the` 的 `the` 是全新用法位** |
| `my` | 939 | **234** | 118 | 全库 | ✅ |
| `good` | 461 | **120** | 54 | 全库 | ✅ |
| `nice` | 244 | **71** | 18 | L3／L12／L13／L14／L67／L68／L79／L86／L87／L89 | ✅ |
| `new` | 188 | **69** | 11 | L1／L3／L24／L29／L51／L65／L81／L111／L115／L116 | ✅ |
| `desk` | 114 | **32** | 16 | L18／L26／L35／L37／L55／L60／L79／L82／L114／**L148** | ✅（同一张书桌） |
| `tea` | 202 | **50** | 15 | L4／L5／L11／L14／L61／L62／L70／**L145／L146／L147** | ✅ **⚠️ 三课刚用过**——本批若用「数不清的茶」（`All the tea is hot.`）**须换物**（§6.2 已改为 `water`／`milk`） |
| `water` | 64 | **21** | 6 | L11／L43／L91／L131／L132／L133 | ✅ **数不清的东西的代表**（L131 `The water feels cold.` 已用过，语义不撞） |
| `milk` | 150 | **38** | 24 | L4／L11／L14／L25／L26／L30／L36／L44／L46／L61… | ✅ **数不清**（`He drinks milk every day.` 是库内名句） |
| `apple`／`apples` | 53／**116** | 8／**32** | 21／21 | L26（三个苹果）／L30／L114／L117／L118 | ✅ **但 L26「三个苹果」是名句**——**本批若用苹果，会与 L26 撞** |
| `classmates` | 10 | **3** | 1 | L7 | ✅ 可用 |
| `students` | 12 | **3** | 2 | L7 | ✅ 可用 |
| `here` | 155 | **55** | 27 | 全库高频 | ✅ |
| `are` | 765 | **188** | 95 | 全库 | ✅ |

**→ 零件结论：本批全部零件在库（无一个新词），且「书桌上的书」这条线是 L148／L149 的直接延续。**

**⚠️ 三处必须切开**（逐条）：
1. **「书」在 L148／L149／L150 连续三课都是主角**——**本批第 1 课若还用「书」，须把「两本」改成「一摞三本以上」，并在 `sceneSetupZh` 明写数量的变化**；
2. **「三个苹果」是 L26 的名句**（实测 `There are three apples on the table.` 在 L26／L27／L81 共 3 处）——**本批不用苹果**；
3. **「茶」在 L145／L146／L147 连续三课是主角**（实测 `tea` GLstruct 50，其中 L145–147 占极大比重）——**本批不用茶**，**改用水或牛奶做「数不清」的例子**。

### 6.3 场景锚选定（按课）

| 课 | 场景 | 场景锚（`sceneSetupZh` 方向） | 零件清单（全部在库） |
|---|---|---|---|
| **L151** | **`mansion`** | **同一张书桌：小美把一摞书摊开数了数——这回不是两本，是四本，一本不落都觉得不错** | `books`／`desk`／`four`／`good`／`all`／`the` |
| **L152** | **`campus`** | **早读课前：教室里人还没齐，组长数了数——好多个同学一起到了，逐个点名也点得出来** | `students`／`classmates`／`here`／`every`／`all`／`is`／`are` |

**⚠️ 场景切换说明**：**L145–L151 若连续 7 课都在 `mansion`，会观感疲劳**（实测 L145–L150 六课全部 `scene: "mansion"`；`mansion` 在全库共 **59 课**，是最大场景池）——**本批第 2 课改 `campus`**（`campus` 全库 **37 课**，最近一次 L135；**L135 之后已隔 15 课**），**既换空气，又正好配合「一群同学」的语义**。

### 6.4 cloze 落点实测（决定考点能否被抽到）

〔实测〕**独立复刻 `buildCloze`（趁热练侧，400 种子）**：

| 候选句 | 关键词池 | 落点分布（Top 3） | 考点词落空位率 |
|---|---|---|---|
| `All the books are good.` | `All／books／good` | `good` 36.8%／`All` 32.3%／`books` 31.0% | **`All` 32.3%** ✅ |
| `All three books are good.` | `All／three／books／good` | `good` 28.8%／`books` 24.3%／`All` 23.5% | **`All` 23.5%** ✅ |
| `All my books are new.` | `All／books／new` | `new` 36.8%／`All` 32.3%／`books` 31.0% | **`All` 32.3%** ✅ |
| `All my classmates are here.` | `All／classmates／here` | `here` 36.8%／`All` 32.3%／`classmates` 31.0% | **`All` 32.3%** ✅ |
| `Every student is here.` | `Every／student／here` | `here` 36.8%／`Every` 32.3%／`student` 31.0% | **`Every` 32.3%** ✅ |
| `Every book is good.` | `Every／book／good` | `good` 36.8%／`Every` 32.3%／`book` 31.0% | **`Every` 32.3%** ✅ |

**→ 判定：cloze 友好度好**——**考点词（`All`／`Every`）稳定落空位 23.5–32.3%**，**优于批二十五 `both` 的 35.8%？不——略低，但远高于批二十三 `soon` 的 16.5–27.0%**。**⚠️ 注意 `All three books are good.`（4 词池）的 `All` 落点降到 23.5%**——**若用三词目标句，考点落点会降到 1/4 以下**，**建议目标句用 3 个关键词的形态**（`All the books are good.`）。

〔实测〕**独立复刻 `pickClozeWord`（关 2 侧三级回退）**：

| 候选句 | 关 2 空位落点 | 是否抽到考点词 |
|---|---|---|
| `All the books are good.` | `All the books ___ good.` | ❌ **落 `are`** |
| `All the students are here.` | `All the students ___ here.` | ❌ **落 `are`** |
| `Every student is here.` | `Every student ___ here.` | ❌ **落 `is`** |
| `All my books are new.` | `All my books ___ new.` | ❌ **落 `are`** |
| `We are all here.` | `We ___ all here.` | ❌ **落 `are`** |

**→ ⚠️ 结构性假友好（本批必须写明）**：**`all`／`every` 均不在 `GRAMMAR_WORDS` 表内**（实读 `grammarAmbushService.ts:161-194` 全表逐项核对，**表内无 `all`／`every`／`both`／`neither`**），**而句子里只要有 `are`／`is`（在表内）就先被抽走**——**故关 2 侧永远落不到考点词**。**这与批二十五 `both`／`neither` 完全同型**（批二十五 §0.1④ 已判）。**处置沿用批二十五：考点承载压在 `contrast` ＋ `guided.spot`，不改引擎**（理由：改表会动全库 150 课的关 2 行为，回归面远超单批收益）。

### 6.5 封面池状态（本轮实测，P0 前置项）

〔实测〕
```
src/assets/lessons/*.jpg          = 117 个文件（lesson-1.jpg … lesson-117.jpg）
grammarLessons.ts 里 cover 引用    = 150 处，涉及 117 个不同 cover
单用（用过 1 次）= 84 张 ； 二用（用过 2 次）= 33 张 ； 三用及以上 = 0 张
最低未用的单用张 = cover34（cover31／32／33 已在 L148／L149／L150 用掉）
```

**→ 本批 2 课若取 `cover34`／`cover35`，单用池从 84 降到 82**。**⚠️ 与批二十五对照**：批二十五取 `cover31–33` 时单用池是 87 → 84；**本批继续消耗，且二用池已扩到 33 张（cover1–cover33）**。「三用」策略仍未被任何批次确立（实测最大使用次数＝2）。**→ 本轮建议取 `cover34`／`cover35`（单用池 → 82），不新立先例**。

### 6.6 展示层与随批清单（照批二十五 §5.7 成例）

| 项 | 本批动作 | 依据 |
|---|---|---|
| **`grammarSeasons.ts` 追加 `season-26`** | **必须**——`grammarSeasons.test.ts` 四项断言（每课号落在区间内／区间不重叠／label 与 hint 非空／最高季 max 覆盖）会在缺失时直接红 | 实读 `grammarSeasons.test.ts:11-46` |
| **`season-26` 的 `max`** | **必须 ≥152** | 同测试第四项 |
| **里程碑 `can-do-m28`** | **`afterLesson: 152`**，样式照 `can-do-m27`（`GrammarPathPage.tsx:303-309`） | 实测现有 27 个里程碑，最后一个 `can-do-m27` `afterLesson: 150` |
| **`huntCases.ts` 追加 2 案** | **编号 160／161**（实测当前最大 `number` ＝ **159**，`id: "hunt-close-25"`） | 每课 1 案，案块 4 错（实测 159 案里 **136 案是 4 错**） |
| **封面** | `cover34`／`cover35`（单用池 84 → 82） | §6.5 |
| **`reviewed: true`** | 两案均须 | 实测 159／159 全为 `true` |

### 6.7 档位诚实标注：**B−**

| 项 | 本批 | 对照 |
|---|---|---|
| **新造词** | **1 个**（`all`） | 批二十五 2 个；批二十四 1 个；批二十 3 个（历史最高） |
| **机制复用** | **2 处**（「带上 s」回流 L11／L148；「搭档用 are」回流 L7／L148） | **⚠️ 本批的复用度比批二十五高** |
| **须自建规则表述** | **1 处**（「数不清的东西也用 `all`，但搭档换 `is`」在 Cambridge `all` 页无直接对应句） | 批二十五 1 处 |
| **场景侧造词** | **0 个** | — |
| **cloze 友好度** | **好**（考点落 23.5–32.3%） | 批二十五 30.8–52.0%；批二十四 26%；批二十三 16.5–27% |

> **为什么是 B− 而不是 B**：**`all` 本身是 A1 词、上游课程位双册双格、中文侧 3 篇专文——证据面是 B 档**；**但两处扣分**：① **本批的机制复用有两处**（带 s／用 are 都要回流），**主增量只有「`all` 后面可以站 `the`」和「数不清也用 `all`」两条**；② **`every` 的第 2 课是「认读升格」而非「新词立岗」**（`every` 词已会，只有用法是新的）——**按批二十五的档位口径，认读升格位的档位低于立岗位**。**→ B−**。**对外口径**：写「**B−：上游双册双格（Murphy 初级 U80 ＋ 中级 U90，且第二格与 `every` 共用）＋ 中文侧 3 篇专文（含 `all` vs `both` 对举专文一篇）＋ 必造 1 词**」。**不得**写「A 档」或「B 档」。

### 6.8 本批明确**不做**的增量（留给后续批次）

- **不做 `all of`／`none of`**——实测 `all of` GL 0／HC 0（中级 U88 那一层）；**中文侧 3 条 ❌ 全在这一层**；
- **不做 `all` ＋ 人称（`All of us`／`We are all here.`）**——实测 `us` GLstruct 3／`of` GLstruct 18，**先要 `of` 概念**；**本批只作认读避坑**（§5.1 B6）；
- **不做 `none`／`no one`／`nobody`**（中文「都」的第四格）——**三词实测双文件全 0**，**是独立缺口，须单独评估**；
- **不做 `each`**——实测 `each` GL 0／HC 0；**中文侧有 2 篇专文**（`each-every`／`each-vs-every`），**但 `each` 与 `every` 的差别（个别 vs 群体）在零术语下极难讲**（中文侧逐字 `each 比較強調個體，every 指的是群中的每一個`）；
- **不做 `whole`**——实测 GL 0／HC 0（中级 U90 的第三词）；
- **不做 `all` 的副词义**（`You're all wet!` 的「浑身」／`all day` 的「整天」）——**后者在 HC 已有先例**（案 #13／#16／#27／#43 的 `all day` token），**属「时间整段」语义，与本批「三个以上都」不是一件事**；
- **不做 `both` 的否定侧补讲**——批二十五已交付，本批不回头改；
- **不改 L1–L150 一字**；**不引番外 6 案**；**不新增封面资产**；**不改 `types.ts`**／**不扩罪名枚举**／**零引擎改动**。

---

## §7 逐课规格（推荐 2 课 · L151–L152）

### 7.1 L151 —— `all` 立岗

| 字段 | 内容 |
|---|---|
| **课注 id** | `lesson-151-all-three` |
| **number** | `151` |
| **title** | `全都好`（4 字，与 L148「两本都好」同型） |
| **grammarLabel** | `三个以上都 · all 也站最前面`（**不得含 29 术语**；对照 L148 逐字 `两个都 · both 站最前面`） |
| **episode** | `小美的一天 一百五十一` |
| **scene** | `mansion` |
| **cover** | `cover34` |
| **sceneSetupZh** | `还是那张书桌——这回不是两本，是四本摊成一排。小美一本本翻过去，一本不落，都觉得不错。` |
| **dialogueEn** | `All the books are good.` |
| **dialogueZh** | `小美把四本摞齐，拍了拍。` |
| **intentZh** | `这几本全都好。` |
| **targetSentence** | **`All the books are good.`**（**5 词**，≤8 ✅） |
| **blocks** | ① `All the books` role `这几本全都（一个不落）` ② `are good` role `都好（好多东西，搭档用 are）` |
| **oneLineRule** | **`说「全都」：all 也站最前面，后面可以站 the——All the books are good（这几本全都好）。它管的是三个以上，一个都不落下。`**（**零术语自查：不含「主语/谓语/复数/形容词/介词」等 29 词**；**⚠️ 对照 L148 的 `oneLineRule` 逐字，本课多了「后面可以站 the」，少了「中文的『都』在中间」**——避免重复讲位置） |
| **examples** | ① `All the books are good.`／这几本全都好。 ② `All my books are new.`／我的书全是新的。 ③ `All three are good.`／三本都好。 ④ `Both books are good.`／两本都好。**（第 148 课——那是两个，这是三个以上）** |
| **dialogue** | npc `How many books?`／弟弟伸手数了数。　npc `Three? Four?`／他问到底几本。　me `All the books are good.`／轮到你说了——一本不落。 |
| **contrast（6 条，逐条方向）** | ① **带标记** `*All student is here.`→ `wrongMark: "student"` → `All the books are good.`；whyZh：**「一个不落」说的是好几个，后面那个东西要带上 s**（**回流 L11 `:1964`**）　② **带标记** `*All of books are good.`→ `wrongMark: "of"` → `All the books are good.`；whyZh：**中文「所有的书」直接连着说，英语的 all 后面直接接，中间不加 of**（**⚠️ 只作避坑，不展开 `of`**）　③ **带标记** `*All the books is good.`→ `wrongMark: "is"` → `All the books are good.`；whyZh：**好几样东西一起出场，搭档要用 are**（**回流 L7 `:1236`＋L148**）　④ **双正解** `Both books are good.`；whyZh：**两句都对——第 148 课那句是「两个」，今天这句是「三个以上」；那个词都站最前面**　⑤ **双正解** `All my books are new.`；whyZh：**两句都对——全都可以带 my；换成「我的」说法一样**　⑥ **双正解** `I ate two sandwiches.`；whyZh：**两句都对——第 11 课那句也是「好几个」（带上 s），今天学的 all 正是冲着一群去的** |
| **variants** | 肯定 `All the books are good.`　否定 `I don't like coffee.`（**照 L148／L145 成例借老句**——实测全库 150 课里「借老句作否定变体」共 **4 课**：L5／L145／L147／L148）　疑问 `Are all the books good?`（`Are` 搬到句首，`all` 照样站最前面） |
| **sceneSwings** | ① 说我的书全是新的 → `All my books are new.` ② 说三本都好 → `All three are good.` ③ 说两本都好（第 148 课）→ `Both books are good.` |
| **deepDive 标题** | `中文一个「都」字，英语走到第三个词了` |
| **deepDive 段落方向** | ① 中文一个「都」字，英语按「管几个」分：两个用 both（第 148 课）…… ② 三个以上、或者数不清的，用今天这个 all ③ **all 后面可以站 the／my，也可以直接接**——`All the books`／`All my books`；**both 后面不站 the，这是它俩最显眼的一处不一样** ④ 后面那个东西还是带上 s、搭档还是 are——两条都是老规矩，今天一个都没变 |
| **summary.rule** | `说「全都」：all 站最前面，后面可以站 the／my；好多东西带上 s、搭档用 are——All the books are good。`（**零术语自查**） |
| **summary.points** | ① `All the books are good.` —— all 也站最前面，后面站 the ② `All student is here. ❌` —— 后面那个东西要带 s（第 11 课老规矩） ③ `All the books is good. ❌` —— 搭档用 are（第 7 课老规矩） |
| **guided（6 步）** | ① choose：`___ the books are good.` 选 `All`／`Both`／`Every` → `All` ② arrange：`All the books are good.` ③ **arrange（R8 复现 L148）**：`Both books are good.`／复现第 148 课——没有「不」，最前面用 both ④ **spot**：`["All","student","is","good."]` `wrongToken: "student"` → 改成 `All students are good.` ⑤ **arrange（R8 复现 L11）**：`I ate two sandwiches.`／复现「两个以上要加 s」 ⑥ **replace（R9 构造迁移）**：`All the books are good.` 把 books 换成 books（改 the 为 my）→ `All my books are good.` |
| **practice（5 题）** | ① `All the books are good.` distractors `["Both"]` ② **变体题（疑问）** `Are all the books good?` distractors `["Is"]`（**满足测试「至少一道否定/疑问变体题」**） ③ 复现第 148 课 `Both books are good.` distractors `["is"]` ④ 复现第 11 课 `I ate two sandwiches.` distractors `["sandwich"]` ⑤ 复现第 26 课 `There is a book on the desk.` distractors `["are"]`（**⚠️ 实测该句 practice 已用 6 课：L26,37,55,60,114,148——已达上限，本批不得再用**，**改用 `I have a new bag.`（practice 仅 L115 用过 1 次）**） |
| **recall** | promptZh `弟弟数完把书摞齐。凭记忆，写出你那句英文。`　intentZh `这几本全都好。`　answer `All the books are good.`　noteZh `all 也站最前面——后面可以站 the，好多东西带上 s。` |
| **huntCaseIds** | `["hunt-all-the-books"]` |

### 7.2 L152 —— `every` 切开

| 字段 | 内容 |
|---|---|
| **课注 id** | `lesson-152-every-student` |
| **number** | `152` |
| **title** | `每个都到了` |
| **grammarLabel** | `差在哪儿 · 好多个一起／一个一个来`（**对照 L143 逐字 `差在哪儿 · when 管那段时间／as soon as 管一到就` 的写法**） |
| **episode** | `小美的一天 一百五十二` |
| **scene** | **`campus`** |
| **cover** | `cover35` |
| **sceneSetupZh** | `早读课前，教室里人还没坐齐。组长站在讲台边数了数——全班都到了，一个都不少。` |
| **dialogueEn** | `Every student is here.` |
| **dialogueZh** | `组长点完名，把本子合上。` |
| **intentZh** | `每个学生都到了。` |
| **targetSentence** | **`Every student is here.`**（**5 词**，≤8 ✅） |
| **blocks** | ① `Every student` role `每个学生（一个一个来，只说一个）` ② `is here` role `都到了（一个一个数，搭档用 is）` |
| **oneLineRule** | **`说「一个一个都」：every 后面只说一个——Every student is here（每个学生都到了）。上一课那个 all 后面是好几个，这个后面只站一个。`**（**零术语自查**；**⚠️ 与 L151 的 `oneLineRule` 逐字形成「好几个 vs 一个」的直接对照**） |
| **examples** | ① `Every student is here.`／每个学生都到了。 ② `All the students are here.`／全班都到了。**（第 151 课——那是好多个一起，这是一个一个来）** ③ `I go to school every day.`／我每天上学。**（第 9 课——同一个 every，后面跟的是时间）** ④ `Every book is good.`／每本都好。 |
| **dialogue** | npc `Is everyone here?`／组长翻着名册问。　npc `All of them?`／她又问了一遍。　me `Every student is here.`／轮到你说了——一个一个都到了。 |
| **contrast（6 条，逐条方向）** | ① **带标记** `*Every students are here.`→ `wrongMark: "students"` → `Every student is here.`；whyZh：**这个 every 后面只说一个——不加 s，搭档也用 is**（**上游逐字 `We don't use every with a plural noun`**）　② **带标记** `*Every are here.`→ `wrongMark: "Every"` → `Every student is here.`；whyZh：**every 后面必须跟着那个东西，不能自己单站**（**上游逐字 `We don't use every on its own, without a noun`**）　③ **带标记** `*All student is here.`→ `wrongMark: "All"` → `Every student is here.`；whyZh：**中文「学生都到了」两句话都能说——想说「一个一个都到了」要用 every；想说「好多个一起」才用 all（上一课）**（**⚠️ 本轴最关键的一条**）　④ **双正解** `All the students are here.`；whyZh：**两句都对——上一课那句是好多个一起（带 s、用 are）；今天这句是一个一个来（不带 s、用 is）；都是「都到了」，看你从哪头说**　⑤ **双正解** `I go to school every day.`；whyZh：**两句都对——第 9 课那句的 every 后面跟的是时间，今天跟的是人；同一个 every**　⑥ **双正解** `He drinks milk every day.`；whyZh：**两句都对——第 25 课那句也是「每天」这个老说法；every 后面跟时间跟跟东西都是它** |
| **variants** | 肯定 `Every student is here.`　否定 `I don't like coffee.`（借老句，照成例）　疑问 `Is every student here?`（`Is` 搬到句首，`every` 后面照样只说一个） |
| **sceneSwings** | ① 说每本都好 → `Every book is good.` ② 说全班都到了（第 151 课）→ `All the students are here.` ③ 说我每天上学（第 9 课）→ `I go to school every day.` |
| **deepDive 标题** | `同一个「都」，从哪头数` |
| **deepDive 段落方向** | ① 中文「学生都到了」，可以从两头条说：一条是「好多个一起」（上一课的 all），一条是「一个一个来」（今天的 every） ② 两条的差别在**后面那个东西带不带 s**：`All the students`（带 s）／`Every student`（不带 s） ③ 搭档也跟着变：带 s 的用 `are`，不带 s 的用 `is`——**这两条你都见过，第 7 课和第 11 课的老规矩** ④ 还有一个你天天在用的：`every day`——那个 every 后面跟的是时间，今天跟的是人；**同一个词，后面接什么就说什么** |
| **summary.rule** | `说「一个一个都」：every 后面只说一个、搭档用 is——Every student is here；上一课那个 all 后面是好几个、搭档用 are。`（**零术语自查**） |
| **summary.points** | ① `Every student is here.` —— every 后面只说一个 ② `Every students are here. ❌ / Every are here. ❌` —— 不加 s、不能自己单站 ③ `All the students are here.` ／ `Every student is here.` —— 两条路都通，看你从哪头数 |
| **guided（6 步）** | ① choose：`___ student is here.` 选 `Every`／`All`／`Both` → `Every` ② arrange：`Every student is here.` ③ **arrange（R8 复现 L151）**：`All the books are good.`／复现上一课——好多个一起 ④ **spot**：`["Every","students","are","here."]` `wrongToken: "students"` → `Every student is here.` ⑤ **arrange（R8 复现 L9）**：`I go to school every day.`／复现「每天」这个老说法 ⑥ **replace（R9 构造迁移）**：`Every student is here.` 把 student 换成 book → `Every book is here.` |
| **practice（5 题）** | ① `Every student is here.` distractors `["students"]` ② **变体题（疑问）** `Is every student here?` distractors `["Are"]` ③ 复现第 151 课 `All the books are good.` distractors `["Both"]` ④ 复现第 9 课 `I go to school every day.` distractors `["day"]`（**⚠️ 实测该句 practice 仅 L9 用过 1 次，余量充足**） ⑤ 复现第 7 课 `They are students.` distractors `["student"]`（**实测 practice 0 次，全新位**） |
| **recall** | promptZh `组长点完名把本子合上。凭记忆，写出你那句英文。`　intentZh `每个学生都到了。`　answer `Every student is here.`　noteZh `every 后面只说一个——不带 s，搭档用 is。` |
| **huntCaseIds** | `["hunt-every-student"]` |

### 7.3 两课的 `variants` 三态与库内惯例核对

〔实测〕**全库 `variants` 规范**：① **否定变体借老句的先例有 4 课**（L5 `I don't like coffee.`／L145／L147／L148）——**本批两课沿用 L148 的 `I don't like coffee.`**，属成例之内；② **疑问变体 135/150 课 ≤7 词**——**本批 `Are all the books good?`（5 词）／`Is every student here?`（4 词）都在惯例内**。

〔实测〕**测试红线核对**（`grammarLessons.test.ts`，行号逐条实测）：
- **`practice.length ≥ 4` 且必须含一道否定/疑问变体题**（`:11-29`）✅（本批各 5 题，第 ② 题逐字等于 `variants` 的疑问卡）；
- **tokens 词集须与 answer 一致**（`:31-50`）✅；
- **干扰项不得与答案词重复**（`:52-67`）✅；
- **`recall` 三字段非空**（`:69-91`）✅；
- **`grammarLabel`／`oneLineRule`／`summary.rule` 零术语**（`:105-146`）✅（本批三条文案已逐条自查）；
- **`practice` 不得整组复用 `examples`**（`:151-161`）✅（本批 5 题里 3 题是跨课复现，不是本课 `examples`）；
- **同一练习答案最多出现在 6 课**（`:163-178`）✅（**本批全部复现句已逐句实测，见 §7.1／§7.2 的余量标注**）；
- **`dialogue` 不得整段复用 `examples`**（`:180-192`）✅；
- **`contrast.whyZh`／`guided.explain`／`recall.noteZh` 零术语**（`:200-217`）✅。

### 7.4 案件设计建议（2 案 · `huntCases.ts` #160／#161）

**案 #160（锚 L151）**

| 字段 | 内容 |
|---|---|
| `id` | `hunt-all-the-books` |
| `number` | `160` |
| `title` | `书桌上的一摞`（**⚠️ 实测 `title` 去重后 155/159，重名的 3 个是「冰箱上的便条」「最后一页」「本子上的两行」——本批 title 必须避开这三个**） |
| `scene` | `小美房间的书桌：一摞书摊开，四本封面朝上` |
| `tokens` | `["All", "student", "is", "good.", "All", "of", "books", "are", "good.", "My", "brother", "like", "books.", "Yesterday", "I", "go", "to", "school."]`（**18 词，实测 159 案的 token 数分布以 15–23 为主**） |
| `errors` | ① `tokenIndex` 指向 `student`，`tag: "plural"`，`correction: "students"`，解释「**第 151 课：一个不落说的是好几个，后面那个东西要带上 s**」 ② `tokenIndex` 指向 `of`，`tag: "preposition"`，`correction: "去掉（all 后面直接接）"`，解释「**第 151 课：中文「所有的书」连着说，英语也不加 of**」 ③ `tag: "sv_agreement"`，`original: "like"` → `"likes"`，解释「**第 25 课回流：My brother 是「他」一个，动词要加 -s**」 ④ `tag: "tense"`，`original: "go"` → `"went"`，解释「**第 10 课回流：Yesterday 是过去的事，要换昨天版**」 |
| `reviewed` | `true` |

**⚠️ 案件 token 池实测**：**`students` 在 159 案的 token 池里从未出现过**（实测 `hunt token universe` ＝ **570** 个不同 token，`students` **不在其中**）；`All`／`of`／`book`／`books`／`my`／`brother`／`like`／`yesterday`／`school` 均在池内。**→ 本批会往池里引入 `students` 一个新 token**——**对照：最近 10 案（#150–#159）的「首次出现 token」全部为 0 个**（实测），**即最近三批案件没有引入任何新 token，全部在 570 词的池内取用**。**⚠️ 这是一个需要主理人确认的小破例**（`students` 是 L7 已教词，学习者见过，只是从未进过案件；**若判为「不可引入」，把 ④ 的 `students` 换成 `book`→`books`**，池内已有）。

**案 #161（锚 L152）**

| 字段 | 内容 |
|---|---|
| `id` | `hunt-every-student` |
| `number` | `161` |
| `title` | `名册上的那一行` |
| `scene` | `早读课前的讲台边：名册摊开，边上一个一个打着勾` |
| `tokens` | `["Every", "students", "are", "here.", "Every", "are", "here.", "All", "student", "is", "here.", "My", "sister", "drink", "milk.", "Last", "week", "I", "go", "home."]`（**20 词**） |
| `errors` | ① `tag: "plural"`，`students` → `student`，解释「**第 152 课：这个 every 后面只说一个——不加 s**」 ② `tag: "fragment"`，`Every`（第二句单独站着）→ `改成 Every student`，解释「**第 152 课：every 后面必须跟着那个东西，不能自己单站**」 ③ `tag: "sv_agreement"`，`drink` → `drinks`，解释「**第 25 课回流：My sister 是「她」一个，动词要加 -s**」 ④ `tag: "tense"`，`go` → `went`，解释「**第 10 课回流：Last week 是过去的事**」 |
| `reviewed` | `true` |

**→ 两案错型分布核对**：全库 11 个罪名枚举里，本批用到 `plural`／`preposition`／`sv_agreement`／`tense`／`fragment` —— **实测全库标签计数 `verb_form` 133／`plural` 111／`sv_agreement` 100／`preposition` 62／`tense` 60／`word_order` 57／`article` 29／`missing_be` 24／`run_on` 19／`fragment` 15／`comparison` 0**。**⚠️ `fragment` 全库仅 15 次，是最冷门的标签之一**——**若主理人希望保守，把 ② 的 `fragment` 换成 `missing_be`（24 次）逐字改写「缺一块」口径**。

---

## §8 与已教内容的切分

### 8.1 最接近的三课（按距离排序）

| 序 | 课 | 距离 | 切开方式 |
|---|---|---|---|
| **1** | **L148 `Both books are good.`**（`lesson-148-both`，批二十五） | **最近**：**同一件事（都 X 好）＋同一个位置（最前面）** | **切开点＝「管几个」＋「后面能不能站 the」**：L148 逐字 `:27857` 是「both 站最前面」；**本批第 1 课逐字是「all 也站最前面，后面可以站 the」**——**位置相同、后面不同**。L148 `:27926` 已亲手挂钩子，**本批是兑现那个钩子**。**L151 `contrast` ④ 用 `Both books are good.` 做双正解把两课并排摆出来** |
| **2** | **L26 `There are three apples on the table.`**（`lesson-26-there-be`） | **近**：**「三个以上」这个数量** | **切开点＝说什么**：L26 说的是**「有几个／有没有」**（存在句），**本批说的是「它们全都怎么样」**（总括）。**L26 的目标句实测 `practice` 使用已达 6 课（L26,37,55,60,114,148）——本批绝不复用该句** |
| **3** | **L7 `We are happy.` / `They are students.`** | **中**：**「一伙的用 are」这条老话** | **切开点＝教的动作**：L7 教的是**「你们／我们／他们这一伙用 are」**（人称群体），**本批教的是「一个不落」这个范围**。**L151 `contrast` ③ 与 L152 `contrast` ④ 把 L7 的 `are` 规则作回流**（**⚠️ 但注意：`We are happy.` 实测 practice 已用 2 课（L148／L150），余量 4**） |

### 8.2 与批二十五的切分（本批最关键的一条）

**共享的东西**：**同一个中文字「都」＋同一个位置（最前面）＋同一条搭配老规矩（带上 s、搭档用 are）**。

| 批 | 教的词 | 管几个 | 站哪儿 | 后面能不能站 the | 有「不」怎么办 | 实读依据 |
|---|---|---|---|---|---|---|
| **批二十五（L148–L150）** | `both`／`neither` | **恰好两个** | **最前面** | **❌ 不能**（实测 `both the` GL 0／`both of` GL 0） | **换词**（`both`→`neither`） | L148 `:27857`／L149 `:28051` |
| **本批（L151–L152）** | `all`／`every` | **三个以上／一个一个** | **最前面**（`all`） | **✅ 能**（`all the`／`all my`） | **不换词，换整套（本批不碰）** | 本报告 §2.3 |

**→ 三条切开动作（写进 PRD §脊柱）**：
1. **`oneLineRule` 逐字点出差别**：L151 的必须写「**后面可以站 the**」（L148 没这条）；L152 的必须写「**上一课那个 all 后面是好几个，这个后面只站一个**」；
2. **本批不复用「有『不』就换个词」**——**这是与批二十五最重要的一刀**：批二十五那条机制是 `both`→`neither`，**而 `all` 没有换词伙伴**（`none` GL 0）。**本批两课一条否定侧对比卡都不做**（§7.1／§7.2 的 `contrast` 已按此排：三条带标记全部是新错，不是否定侧）；
3. **「位置」这件事本批少讲**——**每课只占 1 条**（L151 的 ④ 双正解），**其余 5 条全部放在「范围／带 s／搭档／the」上**。

### 8.3 与 L114（`a few` ／「还有几个」）的切分 ⚠️

**这是本批最容易混的一课，必须写明**：

〔实读〕L114 `:21262` `id: "lesson-114-a-few"`，`:21265` 逐字 `grammarLabel: "还有几个 vs 几乎没了 · a 在不在，意思反一半"`，目标句 `There are a few apples.`。

| | L114 | 本批 |
|---|---|---|
| 中文 | 「**还剩几个**」 | 「**全都**」 |
| 说的是 | **还剩下多少个**（数量少） | **一个不落**（数量全） |
| 方向 | **在减少** | **在总括** |
| 有没有 `the` | `a few apples`（**不带 the**） | `All the books`（**带 the**） |

**→ 切开点＝「说多还是说全」**：L114 关心的是「剩几个」（**数量还在**），**本批关心的是「有没有落下」（一个不落）**。**两句的 `contrast` 不得互相引用**——**L114 的「果盘」场景本批不用**（实测 L114 场景 `mansion` 但有「果盘」专属描写，与「书桌」不同物）。

---

## §9 未核实项

| # | 未核实项 | 为什么没核 | 建议怎么核 |
|---|---|---|---|
| **①** | **「每课恰好 6 条 contrast」是硬门还是纪律** | 本轮只实测出「150/150 恰好 6 条，无一例外」＋「测试文件 `grammarLessons.test.ts` 里没有对 contrast 条数的断言」（实读 `:1-232` 全文，**无该断言**） | **须主理人裁**——**这是轴 A 能否开工的唯一门**（§3.5） |
| **②** | `students` 可否引入案件 token 池 | 实测 159 案的 token 池是 570 词，`students` 不在其中；**但池的边界规则（是「新词禁入」还是「已教词可入」）本轮无法从代码判定** | **须主理人裁**（§7.4）——若禁，改用池内已有词 |
| **③** | `all` 作副词时的中文教学口径 | 本批**不做**副词义（§6.8），故未深究；但库里 **HC 有 5 案用过 `all day`**（案 #13／#16／#27／#43）——**这批案与哪些课关联、是否已构成「all 的副词义已教」的观感**未核 | 后续批次若做 `all day`／`all right`，须先核这 5 案 |
| **④** | `none`／`no one`／`nobody`（中文「都」第四格）的课量 | 本轮只实测三词全零，未做上游课程位与对比卡设计 | **下一个缺口的头号候选**——建议批二十七评估 |
| **⑤** | `every` 的 CEFR 分裂 | Cambridge 词典页 `every` ＝ **A1**（ALL 与 REPEATED 两义），**但 Oxford 与 BC 的档位本轮未取** | 若第 2 课判档需要，补取两个源 |
| **⑥** | 中文侧 `all-both` 专文里 `of` 那 3 条 ❌ 是否真的用不上 | 本批判「用不上」是因为 `of` 属中级 U88 层；**但「`all of` 在零基础用户里是否真的不会说」无法实测**（无用户数据） | **观测点**：L151 上线后，关 2 回访里 `all of` 型错误的比例 |
| **⑦** | 「书桌连续 7 课」的观感疲劳是否真实 | 本轮只实测出「L145–L150 六课全 `mansion`」这个事实，**疲劳是推断** | **观测点**：L148 完成时长 vs L151 完成时长 |
| **⑧** | `All three are good.` 型短句（无 the／无名词）是否该进 examples | 实测 cloze 池只剩 3 词时考点落点 23.5%（低于带名词形态的 32.3%） | 若采用，须重跑 cloze 分布 |

---

## 附录 A：raw 实测留痕（本轮全部命令的等价复现）

```bash
# ① 两法词频（GL＝grammarLessons.ts，HC＝huntCases.ts；raw 与 struct 两套口径）
node -e '
const {readFileSync}=require("fs");
const GL=readFileSync("src/data/grammarLessons.ts","utf8");
const HC=readFileSync("src/data/huntCases.ts","utf8");
const c=(s,w)=>(s.match(new RegExp(`(^|[^A-Za-z])${w}([^A-Za-z]|$)`,"gi"))??[]).length;
const c2=(s,w)=>(s.match(new RegExp(`(?<![A-Za-z])${w}(?![A-Za-z])`,"gi"))??[]).length;
for(const w of ["all","every","each","none","most","whole","though","unless","case","even","seem","appear","rather","prefer"])
  console.log(w, c(GL,w), c2(GL,w), c(HC,w), c2(HC,w));
'
# ② 学习者可见句槽口径（GLstruct，本轮自建）
npx vite-node /tmp/ruisi26/scan.ts      # 词频三栏并列（GLraw / GLstruct / HC）
npx vite-node /tmp/ruisi26/scan2.ts     # every+名词 分解
npx vite-node /tmp/ruisi26/scan12.ts    # 场景零件 + 里程碑 + season-25
npx vite-node /tmp/ruisi26/scan18.ts    # contrast 构成分布 + 结构惯例
npx vite-node /tmp/ruisi26/scan23.ts    # 季区间长度 + 案件 token 池新鲜度
npx vite-node /tmp/ruisi26/scan26.ts    # practice 复用计数（逐句）
# ③ cloze 双引擎复刻（400 种子 / 三级回退）
node -e 'import("/tmp/ruisi26/cloze.mjs").then(({dist})=>{...})'   # 趁热练侧落点分布
node -e 'import("/tmp/ruisi26/ambush.mjs").then(({pick})=>{...})'  # 关 2 侧空位落点
# ④ 测试基线
npx vitest run            # Test Files 61 passed (61) / Tests 800 passed (800)
npx vitest run src/data/grammarSeasons.test.ts   # 4 passed
```

**实测基线（本轮实跑）**：`npx vitest run` → **Test Files 61 passed (61) ／ Tests 800 passed (800)**，Duration **7.01s**（与批二十五交付后基线 **800 一致，干净**）。

## 附录 B：上游原件逐字复核（`/tmp`）

| 源 | 逐字串／数值 | 本报告用处 |
|---|---|---|
| `/tmp/murphy_int_norm.txt`（**11016 字符**） | `...59preferandwouldrather60preposition...` | §4.2 轴 D 课程位 |
| 同上 | `...112evenconjunctionsandprepositions113althoughthougheventhoughinspiteofdespite114incase115unlessaslongasprovided...` | §1.2 轴 A 课程位（**U112 `even` 有独立单元位，批二十四未记**） |
| 同上 | `...88all/allofmost/mostofno/noneofetc.89both/bothofneither/neitherofeither/eitherof90alleverywhole91eachandevery...` | §1.3 **轴 B 的 `all` ＝ U88＋U90 双格** |
| `/tmp/murphy_ess_norm.txt`（**13966 字符**） | `...80everyandall81allmostsomeanyno/none82botheitherneither83alotmuchmany...` | §1.3 **初级 U80 `every and all`** |
| `/tmp/ec_all.txt`（**870 条 URL**） | `https://english.cool/unless/`／`/even-though/`／`/although-despite/`／`/each-every/`／`/each-vs-every/`／`/quantifiers/`／`/both/`；**无 `english.cool/all/`** | §1.2／§1.3 中文侧专文盘点 |
| `/tmp/lme_all.txt`（**966 条 URL**） | `https://letmeenglish.com/all-both/`／`/all-pronouns/`／`/every-each/`／`/both-either-neither/`／`/id-rather-than/` | §2.2 中文侧 `all` vs `both` 对举专文 |
| Cambridge `dictionary/english/all`（本轮现取） | **`determiner/pronoun: A1`**；`adverb: A2`；小节 `All or every?`／`All and every + nouns`；typical errors 逐字 `We don't use every before determiners`／`We don't use all before a and an` | §1.3／§6.7 档位与覆盖 |
| Cambridge `dictionary/english/every`（本轮现取） | **`A1`**（ALL 义与 REPEATED 义）；逐字 `We use all with plural and uncountable nouns and every with singular nouns` | §2.1③／§5.2 |
| Cambridge `grammar/british-grammar/every`（本轮现取） | 逐字 `We use every + singular noun to refer individually to all the members of a complete group`；typical errors 逐字 `We don't use every on its own, without a noun or without one`／`We don't use every with a plural noun`；错例逐字 `Every was decorated in a different style`／`I go swimming every days` | §5.2 E1／E2 |
| Cambridge `dictionary/english/seem`（本轮现取） | **`B1`**；小节 `Appear or seem?`／`Seem + to-infinitive`／`Seem`／`Seem as a linking verb` | §0.1⑤／§4.1 |
| Cambridge `dictionary/english/neither`（本轮现取） | **`B2`** | §1.3 档位对照 |
| `grammarSeasons.ts`（**73 行**） | `season-25` 逐字 `{ id: "season-25", label: "第二十五季 · 两个的脸", hint: "两本都好、两本都不好——同一个「两个」，看最前面那个词有没有「不」", min: 148, max: 150 }` | §6.6 追加 `season-26` |

## 附录 C：零术语红线自查（本报告的范围声明）

**本报告是研究报告，不是课程数据**——报告正文中出现术语（如「主语」「介词」）是**研究用语**，不受产品红线约束。**红线约束的是 4 个数据字段＋3 个引用源字段**（实读 `grammarLessons.test.ts:104-133` 与 `:195-215`）：

| 字段 | 受约束 | §7 本批设计是否自查 |
|---|---|---|
| `grammarLabel` | ✅ | ✅（`三个以上都 · all 也站最前面`／`差在哪儿 · 好多个一起／一个一个来`——**逐字核 29 词，无命中**） |
| `oneLineRule` | ✅ | ✅（逐字核） |
| `summary.rule` | ✅ | ✅（逐字核） |
| `contrast.whyZh` | ✅ | ✅（**本批 6 条 whyZh 的方向文案逐条核**） |
| `guided.explain` | ✅ | ✅ |
| `recall.noteZh` | ✅ | ✅ |
| `deepDive` | ❌ 豁免（进阶内容，测试 `:120-123` 注释逐字「深挖卡作为『想知道为什么』的进阶内容允许保留术语」） | — |

**本批沿用的自建术语体系**：`站最前面`／`带上 s`／`搭档用 are`／`好几个`／`一个不落`／`一个一个来`／`老规矩`／`换物`——**全部在库内有先例，零新造术语**。**⚠️ 唯一须新造的中文口径**：**「全都」**（**实测全库 `全都` 命中 0**）——**这是本批第 1 课必须新造的一个中文说法**（对照 L148 用「两个都」、L145 用「也」，都是库里已有的中文词）。

---

> 本报告由产品战略团队 AI 协作生成（瑞思 · 用户研究），重要决策请由产品负责人审定。
