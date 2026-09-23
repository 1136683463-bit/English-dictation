# 竞品与跨源分析 · 「原形被错判的形式」专项（第四十六批）

**日期**：2026-09-22 ｜ **分析人**：竞析（产品战略团队 · 竞品/跨源分析师）
**类型**：审计口径复核 + 方法学评估（沿批四十五 §7 交接项「原形侧审计」）
**我方基线（本轮独立复算）**：**202 课（L1–L202，无跳号）／211 案（#1–#211，无跳号）**
**上游**：批四十五 `competitive-analysis-drew-slept-2026-09-22.md`（`slept`/`drew` 两项已落地为 L201/L202，本轮实测确认）

---

## ① 结论摘要

1. **三个词都成立，但只有 2 个值得立课。** `lose`／`break`／`wear` 的原形在正确句里**确实是 0**（本轮独立复现，含口径排除 spot 的 `answer`）。但三者的「缺口形状」完全不同，**只有 `wear` 是真双缺口**：
   - `wear`：原形 **正确侧 0／错侧 5**，且过去式 `wore` **全库 0**、过去分词 `worn` **全库 0** —— **原形、过去式、过去分词三个形状在正确侧全部为零**，是**三缺口**。
   - `lose`：原形 **正确侧 0／错侧 12**，但 `lost` 正确侧 **42 处（V3 A1）**——缺口是**单向**的（只会写 `lost`，不会写 `lose`）。
   - `break`：原形 **正确侧 0／错侧 6**，`broke` **23 处**、`broken` **29 处**——缺口也是**单向**的。

2. **⚠️ 本批最重要的发现：简报的「原形没教，是因为它常出现在被动/不及物结构里，而那些结构还没教」这个假说，被数据否掉了。**（§2.5）
   - 本轮把 10 处「原形被误用」**逐条判槽位**，结果：`have+过去分词` 2、`had+过去分词` 2、`be+过去分词（被动）` 2、`一般过去时` 2、`第三人称单数 -s` 2 —— **每类各 2 处，被动结构只占 2/10**。
   - **真正的原因是另一件事**：这三个词的**「原形槽」在本项目里从来没有出现过**——而**原形槽本身教得极透**（`don't+原形` **244 处**、`did+原形` **70 处**、`every day+原形` **68 处**、`to+原形` **60 处**、`will/情态+原形` **45 处**）。**槽位在，词不在**——`lose`/`break`/`wear` 在这五类原形槽里合计命中 **0**。（§2.6）
   - **⇒ 这不是「结构还没教」，是「这三个动词只被当成形状题，从没被当成能自己站台的动词」。**

3. **审计口径不够用，且漏掉了一整类。**（§3）
   - 「正侧零／错侧有」这个二元口径**没有区分「哪个形状在零」**——`slept`/`drew`（过去式零）与 `lose`/`break`（原形零）混在一张表里，**两者的病因和处方完全不同**。
   - **它漏掉的最大一类：`bothRight`（双正解条）把 493 条正确句写进了 `wrong` 字段。** 全库 `contrast` 1212 条里 **493 条 `bothRight=true`＋`wrongMark=null`**，即 **`contrast[].wrong` 里装的是正确句**。任何「把 `wrong` 当错侧」的口径都会把这 493 条**误算成错侧**。（§3.2）
   - **它还会被 3 类假命中污染**：`lesson.id`（`lesson-23-have-lost` → `lost` 假命中 2 次）、`huntCaseIds`（`hunt-lost-dog` → `dog` 假命中）、源码注释（`// R9 换动词 lose→break`）。（§3.3）

4. **建议的更强口径：四维分类（形状 × 侧位 × 槽位 × 可造性），见 §3.4。** 一句话版本：**不问「这个词出现过吗」，而问「这个形状在正确句里站过哪个槽位；若从没站过，那个槽位是否已被别的动词教透」。** 后者（槽位已教透）是「可立即补」的判据，前者（槽位未教）是「必须等」的判据。

5. **跨源位次：三个词全是 A1/Oxford 3000，不存在越级问题。**（§4）
   - OALD 逐字给 `lose` 的第一个义项是 **`[transitive]`**，且 OALD 的 A1 例句里**就有原形**：**"Here, tie it round your neck so you don't lose it."**（`don't` + 原形）。
   - **及物/不及物差异确实存在，但不是「原形没教」的原因**：OALD 逐字 `break` 第一义项 **"[intransitive, transitive]"**；Cambridge Grammar 逐字给出 **"Some verbs can be used with an object (transitively) or without an object (intransitively)."**——**这条是「同一个词的两种用法」，比「两种形状」更靠上一层**，且**因为我们走零术语路线（不讲「及物」），它反倒更容易用场景讲清**（`I broke the cup.` / `The cup broke.`）。

6. **竞品在「同一个词的两种形式都教」这个点上：全体零见。**（§5）
   - 英文侧 Cambridge/BC 只在**同一张表**里平铺三态（`break broke broken`），**从不指出哪个形状用户没见过**；OALD 给形不给用法；中文侧 letmeenglish 最完整（按类型分组＋练习题），但它**练完 `slept` 判错就结束了，没有一句「它在别处是对的」**。
   - **⇒ 空位不是「教不教第二种形式」，而是「有没有一个机制，知道用户见过哪个形状、没见过哪个形状」。** 这正是我方 `contrast` + `huntCaseIds` + 错句回流可以吃下的位置。

7. **建议做 1 课：`wear → wore/worn`（L203），并把它定位为「三缺口补齐」。** 明确拒绝 `lose`/`break` 单独立课（§7.1 给三条理由），改为**挂靠 L23／L50 加对照卡**。另 11 个可疑词**全部拒绝**（§7.4 逐词给理由）。

---

## ② 三词数字与错句原文复核（含口径与脚本）

### 2.0 口径声明（先定口径，再报数）

任务书要求「用 node 词边界正则读 `grammarLessons.ts`，不要用 grep」。**本轮全部数字来自 node 脚本**（脚本在 `deliverables/product-strategy/working/base-form-gap-audit-2026-09-22/`）。

**正确句口径必须排除 spot 题的 `answer`** —— 本轮实测确认这是**对的**，且给出了机制证据：

```
total spot questions: 202
answer === wrongToken : 200      ← spot 的 answer 就是「要用户点出的错词」
answer appears in correctionZh : 2   ← 仅 L96/L102 的 "rain."（带句点）与 "rain" 不同形
neither : 0
```

**⇒ `guided[spot].answer` 在 200/202 的情况下与 `wrongToken` 逐字相等，是错词，任何「正确句」口径都必须排除它。** 不排除的代价：`lose` 会虚增 1、`break` 虚增 2（L23 `I have break my cup.` / L50 `My cup was break.`）。

**本轮采用口径 V3（三档 + 折叠）：**

| 档 | 含义 | 包含槽位 |
|---|---|---|
| **A1** | 无歧义正确句 | `targetSentence`／`dialogueEn`／`dialogue[].en`／`examples[].en`／`variants[].en`／`sceneSwings[].en`／`blocks[].text`／`practice[].answer`／`recall.answer`／`contrast[].correct` |
| **A2** | 正确答案字段 | `guided[非spot].answer`、`guided[].options[]` 中 `=== answer` 的项 |
| **A3** | 替换基句 | `guided[].replaceBase` |
| **A4** | ⚠️ **`contrast[].wrong` 但 `bothRight=true`** —— 该字段装的是**正确句** | `contrast[].wrong`（`bothRight`） |
| **W** | 纯错侧 | `contrast[].wrong`（非 bothRight）／`contrast[].wrongMark`／`practice[].distractors[]`／`guided[].options[]`（`!= answer`）／`guided[spot]`（`tokens`+`wrongToken`+`answer` **折叠为 1**） |
| **M** | 歧义（无法定性） | `guided[arrange].tokens[]` —— 类型注释逐字：「arrange / spot 的词块（**arrange 含干扰项**）」 |
| **C** | 中英混排讲解 | `oneLineRule`／`summary`／`deepDive`／`guided[].explain`／`contrast[].whyZh` 等 |
| **排除** | `lesson.id`／`cover`／`scene`／`huntCaseIds`／源码注释 | 见 §3.3 的假命中分析 |

### 2.1 权威计数表（口径 V3）

脚本：`working/base-form-gap-audit-2026-09-22/AUTHORITATIVE.ts`

```
=== 权威计数 V3（课字段）===
form                 A1            A2            A3            A4 A=A1+A2+A3+A4           W错侧           M歧义           C讲解
lose                  0             0             0             0             0            12             0             5
loses                 0             0             0             0             0             0             0             0
losing                0             0             0             0             0             0             0             0
lost                 42             9             2             4            57             8             5            28
break                 0             0             0             0             0             6             0             8
breaks                0             0             0             0             0             0             0             0
breaking              0             0             0             0             0             0             0             0
broke                23             2             0             2            27             9             2            17
broken               29             6             1             1            37             2             4            24
wear                  0             0             0             0             0             5             0             1
wears                30             5             2             0            37            10             3            31
wearing               0             0             0             0             0             1             0             0
wore                  0             0             0             0             0             0             0             0
worn                  0             0             0             0             0             0             0             0
```

### 2.2 与简报的逐项对照

```
form           简报值     本批 V3(A1)     本批 V3(A)     错侧W
lose             0             0            0      12      ✅ 一致
lost            50            42           57       8      ⚠️ 口径差（见 2.3）
break            0             0            0       6      ✅ 一致
broke           25            23           27       9      ⚠️ 口径差（见 2.3）
wear             0             0            0       5      ✅ 一致
wore             0             0            0       0      ✅ 一致
wears            —            30           37      10      简报未给
```

**三个「0」全部一致，两个非零数（50／25）需要口径说明。**

### 2.3 简报的 `lost=50` / `broke=25` 是什么口径（穷举复现）

我把课字段拆成 **20 个最细槽位**，然后**穷举 2^20 个子集**找 `(lost=50, broke=25)`：

```
slot                               lost  broke broken   wear   lose  break
targetSentence                        2      1      1      0      0      0
dialogueEn                            1      1      0      0      0      0
dialogue.en                           3      1      2      0      0      0
examples.en                           7      2      4      0      0      0
variants.en                           3      3      3      0      0      0
sceneSwings.en                        4      2      3      0      0      0
blocks.text                           2      1      1      0      0      0
practice.answer                       7      4      7      0      0      0
recall.answer                         2      1      1      0      0      0
contrast.correct                     11      7      7      0      0      0
guided.answer                         7      2      5      0      0      0
guided.replaceBase                    2      0      1      0      0      0
guided.tokens.(非spot,歧义)              5      2      4      0      0      0
guided.options(==ans)                 2      0      1      0      0      0
guided.options(!=ans)                 1      1      0      1      2      0
guided.spot(折叠)                       0      1      0      0      1      2
contrast.wrong                       10      6      3      2      2      2
contrast.wrongMark                    1      2      0      2      2      2
practice.distractors                  0      1      0      0      5      0
C(讲解)                                28     17     24      1      5      8
```

```
=== 穷举子集：找 (lost=50, broke=25) 的组合 ===
精确命中 (50,25) 的组合数: 1295
   [targetSentence + dialogueEn + dialogue.en + examples.en + variants.en + sceneSwings.en
    + practice.answer + contrast.correct + guided.answer + guided.tokens.(非spot,歧义)]
      →  lost=50 broke=25 broken=36 wear=0 lose=0 break=0
   …
```

**结论：`lost=50`／`broke=25` 复现在「正确句槽 + `guided` 答案 + **`arrange.tokens`（把干扰项也算进正确侧）**」这一口径上。** 这个口径**能同时给出 `lose=0`／`break=0`／`wear=0`**，所以简报的结论层面没错；但**它把 `arrange` 题里的干扰词块也算作「正确侧出现」**——而类型注释明说 arrange 含干扰项，所以**那部分是不可定性的（本报告的 M 档）**。

**⇒ 我在本报告中一律用 V3 的 A1（更严）为主，A（含答案类）为辅，两个数都给，不用简报的两个非零数。**

**★ 另一条独立解释：`lost=50` 也可能是 `V2(49) + lesson.id 假命中`。** 实测 `lesson-23-have-lost`／`lesson-86-lost-and-found` 两个 id 命中 `\blost\b`（连字符是词边界）；**`V2(lost)=49`，`+1` 恰好 50**——但 `broke` 的 id 假命中为 **0**，所以这条只能解释 `lost`，`broke=25` 仍须靠 arrange 口径。**两条解释都登记，不取舍。**

### 2.4 错句原文（逐条，含课号与槽位）

脚本：`working/base-form-gap-audit-2026-09-22/evidence.ts`、`final-count.ts`

**`lose` 原形（错侧 12 处，去重后 7 条）**

| 课 | 槽位 | 原文 |
|---|---|---|
| L23 | `contrast.wrong` | `I have lose my key.`（`wrongMark="lose"` → 正确 `I have lost my key.`） |
| L23 | `contrast.wrongMark` | `lose` |
| L23 | `guided[choose].options`(!=ans) | `lose`（答案 `lost`；选项 `["lost","lose","losed"]`） |
| L23 | `practice.distractors[]` | `lose`（答案 `I have lost my key.`） |
| L153 | `practice.distractors[]` | `lose`（答案 `I have lost my key.`） |
| L178 | `contrast.wrong` | `I had lose my key before I got home.`（`wrongMark="lose"` → 正确 `I had lost my key before I got home.`） |
| L178 | `guided[spot]` | `tokens=["I","had","lose",…]`，`wrongToken="lose"`，`correctionZh="把 lose 换成 lost：I had lost my key。"` |
| L178 | `practice.distractors[]` | `lose`（答案 `I had lost my key before I got home.`） |
| L185 / L188 | `practice.distractors[]` | `lose`（各 1，答案均为 `I had lost my key…`） |

**`break` 原形（错侧 6 处，去重后 5 条）**

| 课 | 槽位 | 原文 |
|---|---|---|
| L23 | `contrast.wrong` | `I break my cup yesterday.`（`wrongMark="break"` → 正确 `I broke my cup yesterday.`） |
| L23 | `guided[spot]` | `tokens=["I","have","break","my","cup."]`，`wrongToken="break"`，`correctionZh="把 break 换成做过版 broken：I have broken my cup。"` |
| L50 | `contrast.wrong` | `My cup was break.`（`wrongMark="break"` → 正确 `My cup was broken.`；`whyZh` 逐字「be 身边要穿「做过版」——不能拿原样充数：was broken」） |
| L50 | `guided[spot]` | `tokens=["My","cup","was","break."]`，`wrongToken="break."`，`correctionZh="be 身边要穿做过版：was broken。"` |

**`wear` 原形（错侧 5 处，去重后 4 条）**

| 课 | 槽位 | 原文 |
|---|---|---|
| L39 | `contrast.wrong` | `The boy who wear glasses is my brother.`（`wrongMark="wear"` → 正确 `The boy who wears glasses is my brother.`；`whyZh` 逐字「尾巴里的人 who 也是「他」，动词要加 -s：who wears」） |
| L39 | `guided[replace].options`(!=ans) | `wear`（答案 `wears`；选项 `["wears","wear","wearing"]`） |
| L41 | `contrast.wrong` | `I know the boy who wear glasses.`（`wrongMark="wear"` → 正确 `I know the boy who wears glasses.`） |
| L41 | `contrast.wrongMark` | `wear` |

**huntCases 中作为「要改的错词」：**

| 案 | 原文 | 修正 | tag |
|---|---|---|---|
| 案 28 `hunt-late-note` | `It was cold yesterday, so I wear my coat.` | `wear` → **`wore`** | `tense` |
| 案 59 `hunt-broken-window` | `It was break on the morning.` | `break` → **`broken`** | `verb_form` |
| 案 187 `hunt-had-lost-key` | `I had lose my key before I got home.` | `lose` → **`lost`** | `verb_form` |

### 2.5 ⚠️ 逐条判槽位：10 处误用分别该待在哪个槽

脚本：`working/base-form-gap-audit-2026-09-22/slot2.ts`（手工核定，因为自动分类器按 `correction` 反推会误判）

| 出处 | 错句 | 正确 | **本该待的槽位** |
|---|---|---|---|
| L23 contrast | `I have lose my key.` | `I have lost my key.` | **have + 过去分词** |
| L23 guided.spot | `I have break my cup.` | `I have broken my cup.` | **have + 过去分词** |
| L178 contrast | `I had lose my key before I got home.` | `I had lost my key before I got home.` | **had + 过去分词** |
| 案 187 | `I had lose my key before I got home.` | `I had lost my key …` | **had + 过去分词** |
| L50 contrast | `My cup was break.` | `My cup was broken.` | **be + 过去分词（被动）** |
| 案 59 | `It was break on the morning.` | `It was broken …` | **be + 过去分词（被动）** |
| L23 contrast | `I break my cup yesterday.` | `I broke my cup yesterday.` | **一般过去时** |
| 案 28 | `… so I wear my coat.` | `… so I wore my coat.` | **一般过去时** |
| L39 contrast | `The boy who wear glasses …` | `The boy who wears glasses …` | **第三人称单数 -s** |
| L41 contrast | `I know the boy who wear glasses.` | `I know the boy who wears glasses.` | **第三人称单数 -s** |

```
槽位汇总:
  have + 过去分词: 2
  一般过去时: 2
  be + 过去分词（被动）: 2
  had + 过去分词: 2
  第三人称单数 -s: 2
```

**⇒ 简报的「及物/不及物（被动/不及物结构还没教）」假说：被动结构只占 2/10。** 这不是主因。

### 2.6 ★ 真正的结构原因：槽位在，词不在

脚本：`working/base-form-gap-audit-2026-09-22/slot2.ts`、`feasible.ts`

**（a）「原形必需」的五类句型，本项目教得极透：**

| 原形槽 | 正确侧命中 | 举例（正确侧逐字） |
|---|---|---|
| `don't / doesn't / didn't` + 原形 | **244 处** | L3 `I don't have a pen.` / L5 `I don't like coffee.` |
| `did + 主语` + 原形 | **70 处** | L10 `What did you do yesterday?` / `Did you go yesterday?` |
| `every day/week` + 原形 | **68 处** | L9 `I go to the park every day.` / L25 `He drinks milk every day.` |
| `to` + 原形（不定式） | **60 处** | L15 `She wants to read a book.` / `We want to go home.` |
| `will / 情态` + 原形 | **45 处** | L12 `I will draw tomorrow.` / `We will go tomorrow.` |
| 复数主语 + 原形 | **295 处** | L3 `I have a new bag.` / L90 `After we clean the room, we play games.` |

**（b）这三个词在这五类槽里合计命中 `0`：**

```
=== 『原形必需』句型里 lose/break/wear 出现过吗 ===
  (1) 复数主语 + 原形（现在时）: 0 处
  (2) do/does/did + 原形（问句/否定）: 0 处
  (3) will / 情态 + 原形: 0 处
  (4) to + 原形（不定式）: 0 处
```

**（c）`have to / has to / had to` + 原形（31 处正确侧）里也没有这三个词。**

**（d）唯一一处「原形被正确使用」的例外，在案件里、不在课里：**

```
=== did + lose 这个正确用法在哪里 ===
  案36 hunt-question-words: "lost" → "did you lose"；案内全句=
    "The teacher asks: Where is this? A boy says: It is a blue bag.
     When you lost it? the teacher asks. …
     The boy answers: My name is Tom."
```

**⇒ 这是全库唯一一处把 `lose` 的原形放进正确结构的地方**（`did you lose`），而它是**案件的 `correction` 字段**（批改后展示），且被 **L27** 引用。

**⇒ 结论一句话：不是「结构没教」，是「这三个动词从没进过任何正确句」。** 它们在库里的全部存在形式是：① `lost`/`broke`/`broken`/`wears`（正确侧，都是变了形的）② 原形作反面教材（错侧）。**用户认识这三个动词的「变形」，不认识它们的「本体」。**

**⇒ 另有一处强证据支持「原形槽在射程内」**：`lose` 的宾语 `my key/keys` 在正确侧出现 **50 处**；`always` 等频度副词在正确侧 **17 处**。**造一个 `I always lose my keys.` 所需材料全部已教。**

---

## ③ 审计口径的方法论评估（重要）

### 3.1 口径够不够用：不够，缺了「哪个形状在零」

**「正侧零／错侧有」是一个二元判据，它把性质完全不同的两类问题压成了同一个单元格。**

| 类型 | 例 | 正侧零的是 | 病 | 处方 |
|---|---|---|---|---|
| **甲：过去式零** | `slept`／`drew`（批四十五） | **变形后**的形状 | 用户只见过原形，没见过变形 | 教「昨天版」 |
| **乙：原形零** | `lose`／`break`／`wear`（本批） | **本体** | 用户只见过变形，**没见过本体** | 教「本体怎么自己站台」 |

**两类混在同一张表里的后果**：会得出「`slept` 和 `lose` 是同一类缺口，都补一课」——而实际上**甲类的处方是「换来换去」，乙类的处方是「让它站在主语后面自己当谓语」**。这两类课的 `targetSentence` 设计、`contrast` 的错句来源、`guided` 的题型都不同。

**⚠️ 而且乙类比甲类更隐蔽**：`slept` 缺了，用户写作时会写 `sleeped` 或写成原形——**错误会暴露**；`lose` 缺了，用户写作时会写 `losed`？不——**案 31 逐字 `I have losed my key.`**（`hunt-lost-key`，修正 `losed → lost`）。**用户连错都错得五花八门（`losed` 有 1 案），因为他们从没被给过一个「原形」的锚点。**

### 3.2 ★ 口径漏掉的最大一类：`bothRight` 把 493 条正确句放进了 `wrong` 字段

脚本：`working/base-form-gap-audit-2026-09-22/bothright.ts`

```
=== contrast.bothRight：『错侧』槽里其实是正确句 ===
  contrast 共 1212 条；bothRight=true 的 493 条

  ⚠️ wrongMark===null 且 bothRight 的条数（= 纯粹「两句都对」）: 493

=== contrast.wrongMark === null 的条数（整句缺一块 / 两句都对）===
  wrongMark===null: 542 / 1212
```

**机制**（`src/types.ts` 逐字）：
```
/** 双正解条（L36 that 可选件）：两句都对——选哪句都判对，揭示时两句并排展示。 */
bothRight?: boolean;
```
**并且 UI 侧已按此实现**（`src/pages/GrammarLessonPage.tsx` 逐字注释）：
```
这句是否真有问题。false = 双正解条（两种说法都对）——
此时「有问题 / 没问题」选哪个都判对，否则用户会被判错（L76 曾踩坑：
contrast[0] 是 bothRight，但判题写死「有问题」为正确）。
```

**⇒ 任何「`contrast.wrong` = 错侧」的口径，都会把 493 条正确句误算进错侧。** 这 493 条里，与本批三词相关的有：

```
  bothRight 正确句: L50 "Someone broke my cup."
  bothRight 正确句: L50 "I have broken my cup."
  bothRight 正确句: L153 "I have lost my key."
  bothRight 正确句: L178 "I have lost my key."
  bothRight 正确句: L185 "I had lost my key before I got home."
  bothRight 正确句: L188 "I had lost my key before I got home."
  bothRight 正确句: L194 "The wind was so strong that the window broke."
```

**这批「假错侧」恰好在语义上是「正确句的回流」**（L153/L178/L185/L188 都是**回指前课那句 `I have lost my key.`**），**性质与真正的错侧相反**。我因此单独立了 **A4 档**（§2.0）。**⇒ 建议把这个发现写进后续所有审计的口径模板。**

### 3.3 口径还会被三类假命中污染

| 假命中源 | 机制 | 本轮实测 |
|---|---|---|
| **`lesson.id`** | id 里的连字符是 `\b` 边界，`lesson-23-have-lost` 会命中 `\blost\b` | `lost`：`lesson-23-have-lost`、`lesson-86-lost-and-found` **2 个 id 假命中**；`broke`/`broken`/`lose`/`break`/`wear`/`wears` 均 **0** |
| **`huntCaseIds`** | 案件 id 同理会命中普通词 | `dog` → `hunt-lost-dog`（**L37**）；`id` → `hunt-id-like-tea`（**L169**） |
| **源码注释** | 注释里的 `// R9 换动词 lose→break` 会被正则捞到 | 原始文本 `lose` 命中 **20** 次，但结构化后 A1+A2+A3+A4+W+C 合计 **17**；差额来自注释与 id |

**⇒ 这三类必须显式排除，否则「正侧零」这类判断会被假命中破坏（尤其 `\b` 对连字符、句点、撇号的处理）。**

**另一个同类陷阱：撇号/所有格。** 实测 `grandpa` 的槽位命中里有 **11 处是 `Grandpa's`**（所有格），**只有 6 处是裸形**；`grandma` 更极端（**75 处含撇号 vs 30 处裸形**）。**⇒ 判断「原形是否出现」时，所有格必须单独剔除**——`Grandpa's birthday` 不是 `grandpa` 这个词形作为独立词出现。

### 3.4 建议的更强口径：四维分类

**维度一：形状（form）** —— 不是「词」，是**词形**。一个动词至少 5 形：原形 / 3sg(-s) / 过去式 / 过去分词 / -ing。**审计单位必须是词形，不是词。**

**维度二：侧位（polarity）** —— 分 **A1／A2／A3／A4／W／M／C 七档**（§2.0），**其中 A4（bothRight）必须是独立档**，因为它字面上在 `wrong` 字段里但语义上是正确句。

**维度三：槽位（grammatical slot）** —— **这是本批新增、也是最关键的一维。** 对每个「被误用」的词形，判它**本该待在哪个语法槽**（`have+pp`／`be+pp`／`一般过去时`／`3sg -s`／`原形槽`…）。**同一档内的词形可以按「槽位是否已被别的动词教透」排序。**

**维度四：可造性（constructibility）** —— 对「正确侧零」的词形，问一个决定性问题：
> **它必须待的那个槽位，本项目是否已经用别的动词教透了？**

- **是 → 立即可补**（材料齐、无越级）：`lose`/`break`/`wear` 的原形槽（244+70+68+60+45 处）。
- **否 → 必须等**：例如某个只出现在「虚拟语气」槽里的词形，而虚拟语气还没教。

**这个四维口径的一个直接推论是「优先级判据」**：

> **优先级 = （错侧被点名的次数）×（该槽位已教透的证据量）×（正确侧缺失的形状数）**

按此公式：`wear` 是 **3 个形状全缺（原形/过去式/过去分词）**，优先级最高；`lose`/`break` 各只缺 1 个形状（原形），且它们的变形（`lost`/`broke`/`broken`）已经被大量教过——**优先级显著低于 `wear`**。

### 3.5 「正侧零」的其它可能原因（逐条排查）

任务书要求评估「正侧零是否可能由其它原因造成」。**逐条排查结果：**

| 可能原因 | 排查方法 | 结论 |
|---|---|---|
| **① 那个词形本身罕见** | 查 OALD/Cambridge 等级 | ❌ **不成立**。三词全是 **A1 / Oxford 3000**；`lose` 的 A1 例句本身就含原形（§4.1） |
| **② 只在中文答疑里出现** | 把 C 档（中英混排讲解）单独统计 | ⚠️ **部分成立**。`lose` 在 C 档 **5 处**、`break` **8 处**、`wear` **1 处**——**它们确实在讲解里被点名**，但**讲的是「它的做过版是什么」**（L23 `whyZh` 逐字「lose 的做过版是 lost，不走加 -ed 的路」），**不是「它自己怎么用」**。⇒ **这是「被提到」而非「被教」，计 0 是对的，但要在报告里写明**（沿批四十五对 `gave` 的同一处理） |
| **③ 被 `lesson.id`／注释假命中掩盖** | §3.3 实测 | ✅ **确实存在，已排除**。`lost` 有 2 个 id 假命中；`lose`/`break`/`wear` 的 id 假命中为 **0**——**三词结论不受影响** |
| **④ 因为 `bothRight` 被算成错侧** | §3.2 实测 | ✅ **存在，已单独立 A4 档**。但对这三词的**原形**无影响（A4 里命中的是 `broke`/`broken`/`lost`，不是原形） |
| **⑤ 被动/不及物结构还没教**（简报假说） | §2.5 逐条判槽位 | ❌ **不成立**。被动只占 2/10；真因是「原形槽从未用过这三个词」（§2.6） |
| **⑥ 作者刻意回避（教学法考虑）** | 查 C 档有无「回避」表述 | ❌ **未发现**。全库无一处说「这个词的原形以后再说」 |
| **⑦ 只在 huntCases 的 `tokens` 里（作为错词）** | 查 huntCases | ✅ **成立且是本批的关键补充**。案 28/59/187 三处正是「原形作错词」；**且 `wear` 的过去式 `wore` 在全库唯一的存在形式，就是案 28 的 `correction`**（`wear→wore`）——**用户能见到 `wore` 的唯一机会是破案后的一行批改** |

---

## ④ 跨源位次表（逐字引用 + URL）

### 4.1 OALD（牛津）—— 三词全 A1，且 A1 例句里就有原形

**URL**：`https://www.oxfordlearnersdictionaries.com/definition/english/break_1`（`curl=200`）
逐字：`present simple I / you / we / they break`；`past simple broke`；`past participle broken`；`-ing form breaking`；CEFR 逐字 **`a1`**（`in pieces` / `stop working` 义项）。
逐字定义：**"[intransitive, transitive] to be damaged and separated into two or more parts, as a result of force; to damage something in this way"**
逐字例句：**"All the windows broke with the force of the blast."** ／ **"She dropped the plate and it broke into pieces."** ／ **"to break a cup/window"**

**URL**：`https://www.oxfordlearnersdictionaries.com/definition/english/lose`
逐字：`present simple I / you / we / they lose`；`he / she / it loses`；`past simple lost`；`past participle lost`；`-ing form losing`；CEFR 逐字 **`a1`**（`Oxford 3000 A1`）。
逐字定义：**"[transitive] lose something/somebody to be unable to find something/somebody synonym mislay"**
**★ 逐字 A1 例句里就有原形**：**"Here, tie it round your neck so you don't lose it."**（`don't` + 原形）
另有 **"I've lost my keys."**（过去分词）。

**URL**：`https://www.oxfordlearnersdictionaries.com/definition/english/wear_1`
逐字：`present simple I / you / we / they wear`；`he / she / it wears`；`past simple wore`；`past participle worn`；`-ing form wearing`；CEFR 逐字 **`a1`**（clothing 义项）。
逐字定义：**"[transitive] wear something to have something on your body as a piece of clothing, a decoration, etc."**
逐字例句：**"He was wearing a new suit."** ／ **"Do I have to wear a tie?"**（`to` + 原形）／ **"I've got nothing to wear."**（`to` + 原形）

**⇒ 三词全部 A1，无越级问题。而且 OALD 自己的 A1 例句里就同时给了原形用法**（`don't lose`、`to wear`）——**这是「原形槽在 A1 射程内」的最直接外部证据。**

### 4.2 Cambridge Dictionary Grammar —— 不规则表：三词平铺，零教学指导

**URL**：`https://dictionary.cambridge.org/grammar/british-grammar/table-of-irregular-verbs`
逐字表行：`break` — **"break"**, **"broke"**, **"broken"**；`lose` — **"lose"**, **"lost"**, **"lost"**；`wear` — **"wear"**, **"wore"**, **"worn"**。
**逐字：无任何针对这三词的说明文字。**

**URL**：`https://dictionary.cambridge.org/grammar/british-grammar/irregular-verbs`
表头逐字：**"base form"**、**"past simple"**、**"-ed"**。三词行同上。
该页**唯一的说明文字是关于 `be`**：**"Note that be has several irregular forms:"**
**逐字：无「是否需要逐个记」的说明、无按模式分组、无「原形与过去式关系」的任何一般性陈述。**

### 4.3 ★ 及物/不及物差异核查（简报特别要求）

**URL**：`https://dictionary.cambridge.org/grammar/british-grammar/transitive-and-intransitive-verbs`
逐字定义：**"Some verbs always need an object. These are called transitive verbs."** ／ **"Some verbs never have an object. These are called intransitive verbs."**
**★ 逐字：** **"Some verbs can be used with an object (transitively) or without an object (intransitively). Sometimes the meaning is the same."**
逐字列出的「两用」动词：**eat, enter, drive, leave, win**
逐字例句对：**"He opened the door and walked in."** ／ **"The door opened slowly."**
**★ 逐字给出这条最关键的规律**：**"When these verbs have an object, the subject does the action."** ／ **"When they have no object, the action or event happens to the subject."**

**⇒ 回答简报的问题：`break`/`lose` 的及物/不及物差异确实存在，而且 Cambridge 明确把它作为一条规律教。**
- OALD 逐字把 `break` 的第一义项标为 **`[intransitive, transitive]`**（**两用**）；`lose` 第一义项标为 **`[transitive]`**（**单用**）；`wear` 第一义项标为 **`[transitive]`**（**单用**）。
- **⇒ 三词的及物性并不同构**：**只有 `break` 是真正的两用动词**，`lose`/`wear` 的第一义项都是纯及物。**所以「及物/不及物」不能作为三词的共同解释**，只能解释 `break` 的一部分。
- **⚠️ 但它不是「原形没教」的原因**（§2.5–2.6 已用数据否掉）：本项目里 `break` 原形被误用的 6 处，只有 2 处是被动结构（`My cup was break.` / `It was break on the morning.`），其余 4 处是 `have+pp` 与一般过去时。
- **★ 而且这条规律对我们是「好讲」的**：Cambridge 逐字给的对子是 **"He opened the door…" / "The door opened slowly."** —— **这正是我们的零术语叙事方式**（「谁当主角站台上」）。**L50 已经在做这件事**，逐字 `whyZh`：「两句都对——一句说『有人摔了我的杯子』（谁干的站台上）；一句说『我的杯子被摔了』（杯子站台上）。**看你想让谁当主角**。」**⇒ 及物/不及物这条线我方已有正确资产，不需要新造术语。**

### 4.4 British Council LearnEnglish —— 三词都在表内，且给出了「原形/过去式」并列的表

**URL**：`https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/irregular-verbs`（`curl=403`，**WebFetch 可读**）
逐字页级标签：**"Level: beginner"**
逐字表行：**"break" / "broke" / "broken"**、**"lose" / "lost" / "lost"**、**"wear" / "wore" / "worn"**

**URL**：`https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/past-simple`（WebFetch 可读）
逐字页级标签：**"Level: beginner"**、**"Level: intermediate"**
**★ 逐字：** **"But there are a lot of irregular past tense forms in English."**
**★ 逐字：** **"Here are the most common irregular verbs in English, with their past tense forms:"**
逐字表行：`break` → **"broke"**；`lose` → **"lost"**；`wear` → **"wore"**

**URL**：`https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/present-simple`（WebFetch 可读）
逐字页级标签：**"Level: beginner"**、**"Level: intermediate"**、**"Level: advanced"**
**★ 逐字：** **"The present tense is the base form of the verb:"**
逐字：**"But with the third person singular (she/he/it), we add an –s:"**
逐字：**"We use does for the third person singular (she/he/it) and do for the others."**
**逐字：该页不含任何以不规则动词为主角的原形例句**（这是 BC 的一个空位，见 §5）。

### 4.5 中文侧：letmeenglish（本批唯一拿到结构完整内容的中文源）

**URL**：`https://letmeenglish.com/zh-hans/irregular-verbs/`
逐字：不规则动词分 **「三种主要类型」**
- 类型 1 逐字：**「不定词、过去式和过去分词都是一样的。」**
- 类型 2 逐字：**「过去式和过去分词形式相同，但与不定词不同（不同-相同-相同）。」**
- 类型 3 逐字：**「不定词、过去式和过去分词都是不同的。」**

**三词归类（逐字）**：
- **`break` → 初级 · 类型 3**（三态各异）：`break broke broken`
- **`lose` → 初级 · 类型 2**（过去式＝过去分词）：`lose lost lost`
- **`wear` → 初级 · 类型 3**（三态各异）：`wear wore worn`

**URL**：`https://letmeenglish.com/zh-hans/past-simple-verbs/`
逐字：表格标题 **「一般过去时不规则动词变化」**，**平铺列表、不按模式分组**。三词行逐字：
- **`break` / `broke` / 「I broke my arm in an accident.」**
- **`lose` / `lost` / 「He lost his wallet at the bus station.」**
- **`wear` / `wore` / 「She wore a beautiful red dress at the patry.」**（原文如此，含拼写错误 `patry`）

**★ 转述（非逐字，因该页只给结论）：该页只给「过去式」一列，不给原形用法，也不给过去分词列。**

### 4.6 中文侧词典（拿到词态变化，但拿不到用法）

**URL**：`https://www.iciba.com/word?w=lose`
逐字：**「第三人称单数: loses; 过去式: lost; 过去分词: lost; 现在分词: losing;」**
逐字中文释义：**「输掉; 遗失; 损失; 被夺去; 减轻; 不明白; 逃脱; 浪费（时间）; 走慢; 删掉; 亏损」**
**逐字：无 及物/不及物 标注、无常见错误提示。**

**URL**：`https://www.iciba.com/word?w=break`
逐字：**「第三人称单数: breaks; 过去式: broke; 过去分词: broken; 现在分词: breaking;」**
**逐字：无 及物/不及物 标注。** 有同义词辨析三组（`break, rest, pause…` / `break, burst, crack…` / `break, destroy, ruin…`），逐字 `break` 释义 **「常用词，含义广泛，多指猛然用力将坚硬物打破或损坏」**。

**URL**：`https://www.iciba.com/word?w=wear`
逐字：**「复数: wears; 第三人称单数: wears; 过去式: wore; 过去分词: worn; 现在分词: wearing」**
**逐字：无及物/不及物说明。**

**URL**：`https://dictionary.cambridge.org/zhs/词典/英语-汉语-简体/break`（`curl=200`；WebFetch 可读）
逐字词头：**"broke | broken"**
**⚠️ 逐字核查结论**：该页**没有任何中文句子解释及物/不及物的区别**；语法信息只以英文缩写出现，逐字如 **"[[ I or T ]]"**、**"[[ T ]]"**，**没有对应的中文说明文字**。
**⇒ 这是一条重要的负面证据：中文剑桥词典并不替学习者解释 及物/不及物，只给标记。**

**URL**：`https://www.iciba.com/及物动词`
逐字（作为例句出现）：**「动词被再分为及物动词和不及物动词.」** ／ **「例如, 及物动词需要受词;不及物动词则不需要.」**
**逐字：无定义段、无例词表；`break`/`lose`/`wear` 均不在任何列表中。**

### 4.7 跨源位次总表

| 词 | 形状 | OALD 等级 | BC 等级/表内 | Cambridge 表内 | 中文侧类型 | 第一义项及物性（OALD 逐字） |
|---|---|---|---|---|---|---|
| **lose** | 原形 | **a1**（Oxford 3000） | beginner ✔ | ✔ | 初级 · 类型 2 | **`[transitive]`** |
| | lost | 同上 | ✔ | ✔ | 同上 | — |
| **break** | 原形 | **a1** | beginner ✔ | ✔ | 初级 · 类型 3 | **`[intransitive, transitive]`** |
| | broke / broken | 同上 | ✔ | ✔ | 同上 | — |
| **wear** | 原形 | **a1** | beginner ✔ | ✔ | 初级 · 类型 3 | **`[transitive]`** |
| | wore / worn | 同上 | ✔ | ✔ | 同上 | — |

**四条跨源结论：**
1. **三词全部 A1/初级，两套英文权威表都收全了三态**——**不存在「这个词太偏，所以没教」的理由**。
2. **三个词的「变化方式」分属两个不同族**（`lose` 是类型 2「过去式＝过去分词」；`break`/`wear` 是类型 3「三态各异」）——**这直接决定拆课方式**（§7）。
3. **及物性三词不同构**：只有 `break` 两用。
4. **两套英文源与中文源都只在表里给形状，没有一处说「哪个形状用户没见过」**——**空位在「形状层」，不在「知识层」。**

---

## ⑤ 竞品矩阵与空位判定

**⚠️ 纪律声明**：本批**无法访问竞品付费课程内部**（登录墙）。下表区分 **「实测可见」**（本轮或前批实测的公开页）与 **「未核实」**。**不把未核实项写成结论。**

| # | 产品 | 侧 | 在「同一个词的两种形式都教」这个点上做到什么 | 会不会因为「只教一种形式」让学习者困惑 | 空位 |
|---|---|---|---|---|---|
| 1 | **British Council LearnEnglish** | 英 | ✅ **做到了「并列」**：`past-simple` 页逐字 **"Here are the most common irregular verbs in English, with their past tense forms:"**，表里三词齐全（`break→broke`／`lose→lost`／`wear→wore`）；`present-simple` 页逐字 **"The present tense is the base form of the verb:"** | ⚠️ **有风险但未明说**：**原形规则在 `present-simple` 页、过去式表在 `past-simple` 页，两页之间无互引**。学习者可能读到「现在时＝原形」却**没把 `lose` 代入过这个槽** | **无「你见过哪个形状」的机制**；**两页互不引用**；**无原形 × 不规则动词的交叉例句**（本轮逐字核实该页不含） |
| 2 | **Cambridge Dictionary Grammar** | 英 | ❌ **只给表，不给教学**：`table-of-irregular-verbs` 三词齐全但**无任何说明**；`irregular-verbs` 页唯一说明文字是关于 `be` | ⚠️ **明确的风险**：逐字表头是 **"base form"/"past simple"/"-ed"**，**把三态平铺，读者无法知道哪个是「本体」** | **「查得到、不成课」**——与本项目批四十五同一结论；**表页零教学指导** |
| 3 | **OALD（牛津）** | 英 | ⚠️ **半做到了**：词条 `Verb Forms` 块内联三态；**且 A1 例句里同时出现原形与过去分词**（`lose` 逐字 **"Here, tie it round your neck so you don't lose it."** ＋ **"I've lost my keys."**） | ✅ **风险最低**：因为原形与变形**在同一页的例句里并排**（虽然编者并未刻意对比） | **不做教学组织**、**不做用法分工**；**但它是三词「原形与变形同页共存」的唯一外部样本**——**这是我方新课最好的对照写法模板** |
| 4 | **letmeenglish（中文侧最完整）** | 中 | ✅ **做到了分组 + 练习**：类型 1/2/3 逐字（见 §4.5），三词归类明确；`past-simple-verbs` 页**每题都给一整句**（逐字 **"I broke my arm in an accident."** / **"He lost his wallet at the bus station."** / **"She wore a beautiful red dress at the patry."**） | ⚠️ **有风险，且有实据**：**三句例句全部只用过去式**（`broke`/`lost`/`wore`），**没有一句给原形**——**这正是本批三词的病在中文侧原样存在** | **练完就结束**：判错 `slept` 后没有一句「它在别处是对的」；**不给原形用法**；**无场景、无错句回流** |
| 5 | **Cambridge Dictionary（词典，非语法）** | 英 | ⚠️ **给形不给槽**：`break` 页逐字给出 **"Take an egg and break it into the bowl."**（**原形在祈使句里！**）、**"The dish fell to the floor and broke."**（不及物） | ✅ **有原形样本，但埋在义项里** | **无组织、无对比**；**但它是「原形在 A1 义项里天然出现」的又一证据** |
| 6 | **iciba（中文词典）** | 中 | ❌ **只给词态变化一行**：三种词均逐字给出 「第三人称单数/过去式/过去分词/现在分词」 | ⚠️ **有风险**：**无及物/不及物标注、无常见错误提示**——学习者拿到 `wore`/`worn` 但不知道何时用 | **零教学**；**且无用法提示** |
| 7 | **Cambridge 中文版词典 `zhs`** | 中 | ❌ **只给英文语法缩写**：逐字 **"[[ I or T ]]"**、**"[[ T ]]"**，**无中文解释** | ⚠️ **风险明确**：**中文用户看到 `[[ I or T ]]` 极可能不解**；**这是「只教一种形式」的另一版本——只给标记不给解释** | **结构性缺位**：中文界面 + 英文语法术语，**对零术语用户不可用** |
| 8 | **Duolingo** | 英 | ⚠️ **未核实**（`duolingo.com/help` 经 WebFetch 只返回 `"Duolingo."`，博客 `/how-duolingo-teaches-grammar/` **404**）。**前批实测公开页无相关内容** | **未核实** | **未核实**（付费/登录内部） |
| 9 | **Busuu / Babbel / Memrise** | 欧 | ❌ **本轮全部取不到**：Busuu `/learn-english/grammar` **404**；Babbel `/magazine/how-babbel-teaches-grammar` **404**；Memrise `/blog/how-to-learn-grammar` **连接超时** | **未核实** | **未核实**；**登记为抓不到**（§8） |
| 10 | **知乎 / 百度百科 / 知乎专栏** | 中 | ❌ **本轮 403 或超时**（`zhihu.com/question/*` 403；`baike.baidu.com/item/及物动词` 403；`baike.baidu.com/item/瞬间动词` 403） | — | **登记为不可得**（沿前批，§8） |
| 11 | **沪江 / 英语兔 / 扇贝 / 多邻国中文站** | 中 | ❌ **前批已实测公开页零相关内容**，本批不重试 | — | 结构性缺位；**付费内部未核实** |

### 5.1 空位判定的三条硬结论

**① 「同一个词，哪个形状用户见过、哪个没见过」——所有被测产品零见。**
- **英文侧**：Cambridge/BC **把三态平铺在同一张表里**，**表本身不区分「你是第一次见原形还是第一次见过去式」**。BC 的 `present-simple` 页讲原形规则、`past-simple` 页给不规则表，**两页互不引用**（本轮逐字核实）。
- **中文侧**：letmeenglish 最接近（有类型分组），**但它的例句三句全用过去式**——**它自己就在制造本批这个缺口**。
- **⇒ 空位不是「有没有把两种形式都列出来」（所有产品都列了），而是「有没有一个机制，知道用户在哪一个形状上是空的」。**

**② 会让学习者困惑的，确实存在，且能在源里看到实据。**（回答简报的核心提问）
- **letmeenglish 的 `past-simple-verbs` 页**：三词例句**全部只用过去式**（`broke`/`lost`/`wore`），**没有一句原形** → 学习者会把 `broke`/`lost`/`wore` 当成「这个词」，**遇到 `so I don't lose it` 反而认不出**。
- **Cambridge `zhs` 中文页**：逐字只给 `[[ I or T ]]`／`[[ T ]]`，**中文用户拿到标记但没有解释**。
- **iciba**：给词态变化一行，**无及物/不及物、无用法**。
- **⚠️ 但必须说清：我没有任何一家产品的用户数据能证明「困惑发生了」**。**以上是「教材里缺少原形输入」这一事实的确认，不是「学习者困惑」的测量。** 这是我方不能声称的（§9 U2）。

**③ 我方能不能吃到这个空位？——能，而且我方已有半个机制。**
- **已有**：`contrast`（正误对比卡，UI 已渲染，`src/pages/GrammarLessonPage.tsx` 逐字有 `lesson-contrast-mark` 的 `line-through` 与 `lesson-contrast-reveal`）＋ `huntCaseIds`（破案后逐字展示 `original → correction`，`GrammarHuntPage.tsx:673`）＋ `wrongToken`（spot 题）。
- **缺的**：**没有一个「形状覆盖表」**——即没有任何断言/脚本知道「`wear` 的原形在正确句里是 0」。**本批的审计脚本正好补上这一半**（`AUTHORITATIVE.ts` 可直接改成 CI 断言）。
- **⇒ 建议**：把 §3.4 的四维口径做成一个**只读审计脚本**入库，**它不改课程数据，只报告「哪个词形的正确侧为 0 但错侧 > 0」**——**这正是竞品全体缺失的那个机制**。

---

## ⑥ 中文负迁移证据（严格区分「源里明说」与「我的推断」）

**纪律声明**：每条标 `【明说】`（源里逐字写了，附 URL）或 `【推断】`（我基于证据的推理，源里没写）。**两者不混排。**

### 6.1 【明说】源里明确写了

| # | 逐字原文 | 源 | URL | 相关度 |
|---|---|---|---|---|
| **M1** | **「不定词、过去式和过去分词都是不同的。」** | letmeenglish · 不规则动词 | `https://letmeenglish.com/zh-hans/irregular-verbs/` | **高**——这是中文侧对 `break`/`wear` 的类型定义（类型 3） |
| **M2** | **「过去式和过去分词形式相同，但与不定词不同（不同-相同-相同）。」** | 同上 | 同上 | **高**——`lose` 属此类（类型 2） |
| **M3** | **「I broke my arm in an accident.」**（例句，只含过去式） | letmeenglish · 一般过去时不规则动词变化 | `https://letmeenglish.com/zh-hans/past-simple-verbs/` | **高**——**中文侧最完整的练习页，以及它对 `break` 给的唯一一句例句，是过去式** |
| **M4** | **「He lost his wallet at the bus station.」**（例句，只含过去式） | 同上 | 同上 | **高**——`lose` 同上 |
| **M5** | **「She wore a beautiful red dress at the patry.」**（例句，只含过去式） | 同上 | 同上 | **高**——**`wear` 的唯一中文侧例句也是过去式** |
| **M6** | **「第三人称单数: loses; 过去式: lost; 过去分词: lost; 现在分词: losing;」** | iciba | `https://www.iciba.com/word?w=lose` | **中**——中文词典只给「词态变化」一行，**不给用法** |
| **M7** | **「动词被再分为及物动词和不及物动词.」** ／ **「例如, 及物动词需要受词;不及物动词则不需要.」** | iciba | `https://www.iciba.com/及物动词` | **中**——中文侧「及物/不及物」的标准说法，**但无定义段、无例词表** |
| **M8** | **"When these verbs have an object, the subject does the action."** ／ **"When they have no object, the action or event happens to the subject."** | Cambridge Grammar | `https://dictionary.cambridge.org/grammar/british-grammar/transitive-and-intransitive-verbs` | **高**——**英文权威侧对「两用动词」给的规律**（非中文源，列此以备对照） |

### 6.2 【明说】本轮取不到中文侧「痛点自述」（明确登记）

**我本轮明确尝试并从失败中确认：中文侧「自认痛点」类文章取不到。**

| 目标 | 实测结果 |
|---|---|
| `baike.baidu.com/item/瞬间动词` | **HTTP 403** |
| `baike.baidu.com/item/及物动词` | **HTTP 403** |
| `zhihu.com/question/28751642`／`19634552` | **HTTP 403** |
| `hjenglish.com` 首页 | `HTTP=200` 但**首页无任何相关内容**（沿批四十五同结论） |
| `cn.bing.com/search?q=瞬间动词 非延续性动词 break lose 及物 不及物` | **返回结果全是「瞬间」的汉语词义/影视/音乐条目，零语法内容** |
| `cn.bing.com/search?q=中国学生 英语 原形 错误 忘记变过去式 及物不及物` | **返回结果全是「中国」的新闻/地图条目，零语法内容** |
| `eol.cn` / `qinxue100.com` / `hjx.com` / `yingyuyufa.com` / `yingyu.com` | 首页**均无 及物/不及物 或 瞬间动词 内容**（`yygrammar.com` 文章页返回**空正文**；`yingyu.com` DNS 失败） |

**⇒ 因此本报告不含任何「中文教辅自认痛点」的逐字引用。不是没找，是取不到。** 与批四十五对知乎的登记一致。

### 6.3 【推断】我基于证据的推理（源里没写）

**I1【推断】中文侧的「只给过去式例句」这一事实，会强化「把变形当成本体」的错误。**
依据：M3/M4/M5（letmeenglish 的三句例句**全部只用过去式**）＋ M6（iciba 只给词态变化行）。
**限度**：我没有用户数据证明困惑发生；这是**教材输入缺失**的推断，不是**学习结果**的测量。

**I2【推断】中文母语者的具体负迁移路径（针对这三个词）很可能是「时态标记的缺失」，而不是「形状记错」。**
依据：案 28 逐字 `It was cold yesterday, so I wear my coat.`（`yesterday` 就在同一句里，**时态信息不缺**，缺的是把 `wear` 变成 `wore` 的动作）；案 187 逐字 `I had lose my key…`（`had` 就在前面）。
**限度**：**只有 3 个案件的样本**（案 28/59/187），**样本极小，不足以支撑「中文母语者普遍如此」**。

**I3【推断】「原形」在中文母语者的心理表征里，很可能等于「词典形」而不是「现在时形式」。**
依据：M7（中文侧把 及物/不及物 讲成「需要/不需要受词」，**不涉及形态**）＋ L23 的 `whyZh` 逐字「lose 的做过版是 lost，不走加 -ed 的路」（**本项目自己也是从「变形」角度介绍这个词的**）。
**限度**：纯推断，无直接证据。

**I4【推断】简报的「及物/不及物」假说有吸引力，是因为它把「形状问题」重新描述成了「结构问题」——但数据不支持。**
依据：§2.5（被动只占 2/10）＋ §2.6（原形槽教了 244+70+68+60+45 处，只是没用这三个词）。
**限度**：**这条我态度坚决**——因为它是本批唯一的「否证」，且依据是可复现的计数。

---

## ⑦ 独立可做性判断

### 7.1 三词该做几个、怎么拆

**结论：做 1 课（L203，`wear → wore/worn`）；`lose`/`break` 的原形不立课，改为挂靠 L23／L50 加对照卡。**

| 词 | 缺口形状 | 判定 | 理由 |
|---|---|---|---|
| **`wear`** | **三缺口**：原形 A1=0／错侧 5；`wore` 全库 **0**；`worn` 全库 **0** | ✅ **立 1 课（L203）** | ① **三个形状在正确侧全部为零**，这是本批唯一的三缺口；② **它的变化方式（类型 3，三态各异）与 `break` 同族**，而 `break` 的变形已教过 50+ 处，**可以用 `break` 当「你早就见过这条换法」的锚**（沿 L198 用 `rang` 的做法）；③ **中文侧对它给的唯一例句是过去式**（M5），**缺口在中文侧原样存在**；④ **`wore` 目前在库里唯一的存在形式是案 28 的一行 `wear→wore`**——用户见不到它 |
| **`lose`** | **单缺口**：原形 A1=0／错侧 12；但 `lost` **A1=42**（含 A 档 57） | ❌ **不立课**，挂靠 L23 | ① **`lost` 教得极透（42 处 A1）**，用户对「丢失」这件事的表达**没有障碍**；② 原形的正确用法**只有一个高频场景**（`I always lose my keys.`／`don't lose it`），**撑不起一课**（对比 L201/L202 的 `targetSentence` 都是两个动作并列的完整场景）；③ **L23 已经是这一课的最小结构点**（`have + 做过版`），加一张 `I always lose my keys.` 的对照卡**成本最低、回流最自然** |
| **`break`** | **单缺口**：原形 A1=0／错侧 6；`broke` **A1=23**、`broken` **A1=29** | ❌ **不立课**，挂靠 L50 | ① **`broke`/`broken` 合计 A1=52 处**，已极透；② **它真正的教学点是及物/不及物的对照**（§4.3：Cambridge 逐字 **"He opened the door…" / "The door opened slowly."**），**而 L50 已经在做这件事**（逐字「看你想让谁当主角」）——**只需补一句原形 `break` 的对照**；③ 若为它单开一课，**会把「及物/不及物」这条线从 L50 拆散**，与项目「一课一条换法」的节奏冲突 |

**为什么不是 3 课**：`lose`/`break` 的原形缺口**各自只有 1 个形状**，且**它们的变形已经大量正确出现**（§2.1）。**「缺原形」与「缺过去式」不同——原形是「本体」，补它的最好位置是「用户第一次见这个动词」的地方（L23/L50），而不是新开一课。**

**为什么不是 2 课**（`wear` + 把 `lose`/`break` 合并成一课）：**`lose` 与 `break` 的原形误用槽位不同**（`lose` 全在 `have/had+pp`；`break` 在 `have+pp`、`be+pp`、一般过去时各 2），**合并讲不出同一条道理**——这正是批四十五拒绝「`slept`+`drew` 合并」的同一判据。

### 7.2 `wear` 一课的拆法（建议草案，供产品执行参考）

| 项 | 建议 | 依据 |
|---|---|---|
| **新点** | 2 个（`wore` + `worn`） | 近 14 课实测 `blocks=2` 是标准（L189–L202 全为 2） |
| **targetSentence 形态** | 两个动作并列（沿 L198–L202 句式） | L202 逐字 `I drew a picture of the boat and put it on the wall.` |
| **必须同时出现原形** | **★ 本课的核心设计点**：让 `wear` **原形出现在正确句里**（用 `don't wear`／`to wear`／`wear` 祈使句——**这三个槽位都已教透**：244／60 处） | §2.6（a） |
| **中文侧缺口对齐** | 例句不能只给过去式（对照 M5 的失败样本） | §6.1 M5 |
| **家族串联** | 用 `break → broke → broken`（类型 3，已教）做锚 | §4.5 三词归类 |
| **回流** | 回流案 28（`I wear my coat.` → `wore`） | 案 28 `hunt-late-note` 被 **L20** 引用 |

### 7.3 ★ 特别判断：`lose`/`break` 的原形该立课还是挂靠？

**挂靠。且我给出一个可执行的挂靠形式**：在 L23／L50 各加一张 `contrast` 卡，`wrong` 侧**不是错句**，而是用 `bothRight` 的「两种说法都对」形态——**这是库内已有、UI 已支持的机制**（§3.2 逐字引了 `GrammarLessonPage.tsx` 的注释）：

- L23 建议加：`I always lose my keys.`（原形，正确）／`I have lost my key.`（做过版，正确）—— **两句都对，讲「习惯 vs 结果」**。
- L50 建议加：`Someone broke my cup.` ＋ `My cup was broken.` ＋ **`People break cups every day.`**（原形）—— **前两句 L50 已有**（§3.2 实测 `bothRight` 命中 `L50 "Someone broke my cup."` 与 `"I have broken my cup."`），**只需补第三句带原形的**。

**理由**：**用 `bothRight` 挂靠的边际成本极低**（不加课、不加新点、UI 已支持），**且正好补上「原形在正确句里从未出现」这一条**。**这比新开两课更符合「最小改动补最大缺口」。**

### 7.4 另 11 个可疑词的取舍（逐词）

脚本：`working/base-form-gap-audit-2026-09-22/eleven-final.ts`

```
word           A1   A2   A4    A合计    W错侧   M    C讲解
id              0    0    0      0      6   0      2
dog             0    0    0      0      4   0      2
careful         0    0    0      0      3   0      6
grandpa         5    2    1      8      3   0      4
loud            0    0    0      0      3   0      5
august          0    0    1      1      0   0      0
knock           0    0    0      0      1   0      1
blackboard      0    0    1      1      0   0      0
end             0    0    0      0      1   0      0
bore            0    0    0      0      1   0      0
gave            0    0    0      0      1   0      1
```

| 词 | 判定 | 理由（逐条） |
|---|---|---|
| **`id`**（6 次） | ❌ **不处理**——**已确认是`Id`（丢撇号的 `I'd`）的假命中，不是 `id` 这个词** | L169 逐字 `wrong: "Id like a cup of tea."`、`wrongMark: "Id"`、`correct: "I'd like a cup of tea."`；全库 **202 个 `id:` 行都是 `lesson.id`**，另有 **`huntCaseIds: ["hunt-id-like-tea"]`** 1 处。**这 6 次全部是「Id」的 6 个槽位（wrong/wrongMark/distractor/spot tokens/wrongToken/answer），同一处错误。** **⇒ 真正的缺口是「撇号」，L169 已专门教它**（逐字 `options: ["I'd","Id","I'm"]`） |
| **`dog`**（3 次） | ❌ **不处理** | L5 逐字 `wrong: "I like dog."` → `correct: "I like dogs."`。**这是「可数名词复数」问题，`dogs` 在正确侧 A1=3 处，L5 已在教。** **`dog` 的裸形在错侧是「泛指要用复数」的靶子，不是缺原形——名词没有「原形/过去式」的对立，本批的审计口径对它天然不适用。** 另：`hunt-lost-dog` 命中 `\bdog\b` 是 **`huntCaseIds` 假命中**（§3.3） |
| **`careful`**（3 次） | ❌ **不处理** | L58 逐字：`practice.distractors: ["careful"]`（答案 `She reads carefully.`）、`option(!=ans): "careful"`。**这是形容词/副词的对立（`careful` vs `carefully`），不是「动词形状」问题。** `carefully` 正确侧 A1=4 处，L58 已教。**且 C 档 6 处都在讲 `careful → carefully` 的 -ly 规则** |
| **`grandpa`**（3 次） | ❌ **不处理**——**已确认主要是所有格假命中** | 实测 **11 处含 `Grandpa's` vs 6 处裸形**；裸形的真正场合是 L111 逐字 `option(!=ans): "Grandpa birthday is in May."` / `"of Grandpa birthday is in May."`（**专有名词 + 撇号 s**，L111 已教）。**裸形 A1=0 的原因是「提到爷爷时永远用所有格」——这是内容选择，不是缺口** |
| **`loud`**（2 次） | ❌ **不处理** | L58 逐字 `wrong: "He reads loud."` → `correct: "He reads loudly."`；L59 `option(!=ans): "loud"`。**与 `careful` 同类（形容词/副词对立），L58/L59 已教。** `loudly` 正确侧 A1=4 处 |
| **`august`**（1 次） | ❌ **不处理**——**已确认是月份列表的假命中** | L56 逐字 `wrong: "July / August / September / October / November / December"` 且 **`bothRight=true`**（A4 档，**该字段其实是正确句**——L56 教的是「上半年/下半年」，两个列表都对）。**⇒ 不是缺口，是 §3.2 的 `bothRight` 陷阱的又一个实例** |
| **`knock`**（1 次） | ❌ **不处理** | L99 逐字 `option(!=ans): "someone knock"`（答案 `someone knocked`）。**这是过去式形状题，`knock` 是规则动词（`knocked` 已有 C 档 1 处）**；**且 `knocked` 的缺口不成立——它已按规则变化教出** |
| **`blackboard`**（1 次） | ❌ **不处理**——**`bothRight` 假命中** | L107 逐字 `wrong: "The teacher had me clean the blackboard."` 且 **`bothRight=true`**（A4 档） |
| **`end`**（1 次） | ❌ **不处理** | L109 逐字 `option(!=ans): "I waited until the movie will end."`。**错的是 `will`，不是 `end`**——`end` 在这个错项里**反而是正确的原形**（`until` 从句不能用 `will`）。**⇒ 这是「错项里含正确词」的假命中，属 §3.3 的第四类污染** |
| **`bore`**（1 次） | ❌ **不处理** | L113 逐字 `options: ["bored","boring","bore"]`，答案 `bored`。**`bore` 是作为 `bored`/`boring` 的干扰项出现的，L113 正在教 `-ed` vs `-ing`**（本项目已有专课） |
| **`gave`**（1 次） | ❌ **不处理，但登记为「批四十五已交办、本批确认仍未落地」** | 实测 **`gave` 全库正确侧 A1/A2/A3/A4 = 0**；唯一的 W 是 **L199 `practice.distractors: ["gave"]`**（答案 `Please give me the book.`），唯一的 C 是 **L199 `contrast.whyZh` 逐字**：「第 63 课那句的 give 也有自己的昨天版：**give 变 gave**（跟今天的 sit → sat 一样，都是里面的 i 换成 a）。**give 的位置规矩在第 63 课，形状在今天的 sat 这条线上。**」**⇒ `gave` 是被「点名讲过形状」但从未在正确句里出现过**——**性质与本批 `lose`/`break` 的原形完全相同（A 档 0、只在讲解里被提到）**。**批四十五已提出它，本批确认它仍未落地；我再次建议处理，但优先级低于 `wear`** |

**⇒ 11 个词里，10 个是假命中或非本类问题；只有 `gave` 是真缺口**（且批四十五已提出）。

---

## ⑧ 自我核查记录

### 8.1 命令清单（全部在 `/Users/liujun/Documents/英语听写` 下执行）

```bash
# 数据装载（vite-node 读 TS 数据源）
node_modules/.bin/vite-node deliverables/product-strategy/working/base-form-gap-audit-2026-09-22/loadtest.ts
#   → lessons: 202 | hunts: 211   （基线确认）

# 口径验证：spot 的 answer 是不是错词
node_modules/.bin/vite-node .../spots.ts
#   → total spot questions: 202
#     answer === wrongToken : 200
#     answer appears in correctionZh : 2
#     neither : 0

# 槽位盘点（55 个字符串槽位枚举）
node_modules/.bin/vite-node .../inventory.ts

# 原始文本词边界计数（不区分大小写 / 区分大小写）
node_modules/.bin/vite-node .../raw-scan.ts
#   → lose 20/20 · lost 120/120 · break 19/19 · broke 63/63 · broken 82/82
#     wear 6/6 · wears 91/91 · wore 0/0 · worn 0/0

# 逐行定位（假命中来源）
node_modules/.bin/vite-node .../locate.ts

# 权威三档计数
node_modules/.bin/vite-node .../AUTHORITATIVE.ts

# bothRight 陷阱
node_modules/.bin/vite-node .../bothright.ts
#   → contrast 共 1212 条；bothRight=true 的 493 条
#     wrongMark===null: 542 / 1212

# 简报口径复现（穷举 2^20 子集）
node_modules/.bin/vite-node .../brute.ts
#   → 精确命中 (lost=50, broke=25) 的组合数: 1295

# 逐条判槽位
node_modules/.bin/vite-node .../slot2.ts
#   → have+pp 2 / 一般过去时 2 / be+pp 2 / had+pp 2 / 3sg -s 2

# 原形槽是否教透
node_modules/.bin/vite-node .../feasible.ts
#   → don't+原形 244 处 / did+原形 70 处 / every day+原形 68 处 / to+原形 60 处
#     lose/break/wear 在这些槽里命中 0

# 11 词取舍
node_modules/.bin/vite-node .../eleven-final.ts

# 单课容量
node_modules/.bin/vite-node .../lesson-capacity.ts
#   → L189–L202 全为 blocks=2 / contrast=6 / practice=5 / guided=6
```

脚本目录：`/Users/liujun/Documents/英语听写/deliverables/product-strategy/working/base-form-gap-audit-2026-09-22/`

### 8.2 口径自查（三条）

1. **正确句口径排除了 spot 的 `answer` 吗？** ✅ 排除（机制证据见 §2.0：200/202 的 `answer === wrongToken`）。
2. **`bothRight` 单独立档了吗？** ✅ 立了 A4 档（493 条，§3.2）。
3. **`lesson.id`／`huntCaseIds`／注释三类假命中排除了吗？** ✅ 排除，并量化了影响（`lost` 2 个 id 假命中、`dog` 1 个 huntCaseId 假命中、`august`/`blackboard` 各 1 个 `bothRight` 假命中、`end` 1 个「错项里含正确词」假命中）。

### 8.3 我对自己的数字的两处保留

1. **`lost` 的 A1(42) 与简报(50) 有 8 的差**：我把差额归因于「arrange 干扰项被算进正确侧」或「id 假命中」两条解释，**两条都登记、不取舍**（§2.3）。**我不知道简报作者当时用的确切表达式**——所以**我不用简报的数，也不声称简报错了**。
2. **`wears` 的 A1=30**：**简报未给 `wears` 的基数**，所以我无法判断简报是否意识到 `wear` 的 -s 形（`wears`）教得极透。**我按数据报告：`wears` A1=30、`wear` A1=0——同一个动词的两个形状，暴露量差 30:0。**

---

## ⑨ 抓不到的源与不确定项

### 9.1 抓不到的源（明确声明）

| 源 | 状态 | 备注 |
|---|---|---|
| **Murphy 双册（Essential／Intermediate Grammar in Use）** | **不可得** | 按任务书指示**不重试**，沿批四十三/四十五登记 |
| **Swan《Practical English Usage》** | **不可得** | 同上 |
| **Busuu** `/learn-english/grammar` | **HTTP 404** | 本轮实测 |
| **Babbel** `/en/magazine/how-babbel-teaches-grammar` | **HTTP 404** | 本轮实测 |
| **Memrise** `/blog/how-to-learn-grammar` | **连接超时**（`UND_ERR_CONNECT_TIMEOUT`） | 本轮实测 |
| **Duolingo** `/how-duolingo-teaches-grammar/`（博客） | **HTTP 404** | 本轮实测 |
| **Duolingo** `support.duolingo.com/.../teach-grammar` | **301 → `duolingo.com/help`，正文只返回 `"Duolingo."`** | 实质不可得 |
| **Duolingo** `/duolingo-teaching-method/`（博客） | `HTTP=200` 但**只给营销话术** | 逐字仅 **"Our courses are interactive, so you learn new skills right from the start."**、**"draw learners' attention to important patterns, from verb conjugations, to spelling rules, to creating fractions"**、**"optional hints and bite-sized explanations"**——**无实质方法说明** |
| **`baike.baidu.com/item/瞬间动词`** | **HTTP 403** | 本轮实测 |
| **`baike.baidu.com/item/及物动词`** | **HTTP 403** | 本轮实测 |
| **`zhihu.com/question/28751642`／`19634552`** | **HTTP 403** | 沿批四十五 |
| **`zh.wikipedia.org`**（瞬间动词／英語動詞） | **连接超时** | 本轮实测 |
| **`yygrammar.com/Article/201401/3474.html`** | **正文为空**（只有 `---`） | 本轮实测 |
| **`yingyuyufa.com`** | **HTTP 403** | 本轮实测 |
| **`yingyu.com`** | **DNS 失败**（`ENOTFOUND`） | 本轮实测 |
| **`hjenglish.com`／`eol.cn`／`qinxue100.com`／`hjx.com`** | `HTTP=200` 但**首页零相关内容** | 本轮实测（沪江沿批四十五同结论） |
| **`duckduckgo.com/html/?q=...`** | **连接超时** | 本轮实测 |
| **`cn.bing.com` 中文检索（2 组查询）** | **返回结果完全离题**（第 1 组全是「瞬间」的汉语词义/影视/音乐；第 2 组全是「中国」的新闻/地图） | **⇒ 中文侧「痛点自述」类文章本轮取不到**（§6.2） |
| **British Council 域的 `curl`** | **`HTTP=403`**（`english-grammar-reference/irregular-verbs` 实测） | **但 WebFetch 可读**——与批四十五「BC 优先用 WebFetch，不要用 curl」一致，**本批再次确认** |

### 9.2 不确定项

**U1（最高）：「原形」这个缺口，用户真的感知到了吗？——我没有用户数据。**
本批全部证据是**教材层**的（正确侧 0、错侧 N、槽位已教透）。**我能证明「教材从没给过这三个动词的原形正确样本」，不能证明「学习者因此写错」。** 案 28/59/187 三处是**作者编写的**错句，**不是真实用户数据**。**⇒ 若产品要按此立课，建议先看真实用户练习数据里 `lose`/`break`/`wear` 原形的错误率。**（这是我本批最不确定的一点。）

**U2：`wear` 的「三缺口」里，`wore` 与 `worn` 的分布是否真的全是 0？**
我实测 `wore`／`worn` 在课字段全 0，**唯一出现在案 28 的 `correction`**（`wear→wore`）。但**案件的 `correction` 字段最终会展示给用户**（`GrammarHuntPage.tsx:673` 逐字 `{feedback.error.original} → <strong>{feedback.error.correction}</strong>`）——**所以严格说 `wore` 在用户可见处出现过 1 次**，**只是在破案后的批改行里，不是句子**。**⇒ 我把它计为「0 处句子 + 1 处批改行」，与批四十五对 `gave` 的处理一致。**

**U3：`break` 挂靠 L50 是否会造成「一课两条线」？**
L50 现在同时承担「被动（谁当主角）」与「`break` 三态」两条线（逐字 `whyZh` 已引 `broke`→`broken`）。**我建议补一张带原形的 `bothRight` 卡，但这会让 L50 的原形/过去式/过去分词三态更密集。** **⇒ 我无法判断这个密度是否超出 L50 的认知负荷；这需要产品侧对 L50 的实测时长判断。**

**U4：中文侧缺口是否真的和英文侧同构？**
我拿到 M5（**`wear` 的中文侧唯一例句是过去式 `She wore…`**），**这与英文侧缺口方向一致**。**但中文侧我只拿到 letmeenglish 一家**（§6.2 大量 403），**样本量 1，不足以支撑「中文侧普遍如此」**。

**U5：`gave` 的优先级我给的低于 `wear`，依据是否充分？**
我的依据是「形状缺口数」（`wear` 缺 3 个形状，`gave` 缺 1 个）与「变形是否已教透」（`give` A1=23 处）。**但 `gave` 已被批四十五提出过一次，两次未落地这件事本身可能意味着它不是优先级问题而是别的问题**（例如 L199 的容量已满）。**⇒ 我未核实 L199 的剩余容量。**

---

## 附：本批产出的可复用资产

| 资产 | 路径 | 用途 |
|---|---|---|
| 权威三档计数脚本 | `working/base-form-gap-audit-2026-09-22/AUTHORITATIVE.ts` | 可改为 CI 断言：**报「正确侧为 0 但错侧 > 0」的词形** |
| 槽位判定脚本 | `working/base-form-gap-audit-2026-09-22/slot2.ts` | 判「原形被误用」时本该待在哪个槽 |
| `bothRight` 检测 | `working/base-form-gap-audit-2026-09-22/bothright.ts` | **建议入 CI**：防止未来审计把 493 条正确句当错侧 |
| 假命中检测 | `working/base-form-gap-audit-2026-09-22/idcheck.ts` | 排除 `lesson.id`／`huntCaseIds` 的 `\b` 假命中 |

**⚠️ 本报告为纯研究：未修改任何课程数据或代码。** 全部脚本写在 `deliverables/product-strategy/working/` 下，不在 `src/` 内。
