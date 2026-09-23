# 瑞思 · 第 46 批用户研究与内容缺口分析：原形被错判的形式（`lose` / `break` / `wear`）

- **批次**：第 46 批（承第 45 批 L201 `slept` / L202 `drew` 收口之后）
- **范围**：只做研究，**不改任何代码 / 数据**
- **本批主题**：上批登记的「在错侧出现、但正确句字段为零」专项审计的**结论**——`lose` / `break` / `wear` 三个词的**原形缺口**
- **核查脚本**：`/tmp/verify46_final.cjs`（只读，解析后的对象逐字段判定；**不使用 grep**）
- **日期**：2026-09-22

---

## ① 结论摘要

> **⚠️ 阅读须知（先读这两条，再读下表）**
>
> 1. **本批存在一个未解决的结论冲突**：与本批**平行**的另一份分析（`competitive-analysis-base-form-gaps-2026-09-22.md`，竞析）覆盖了**同一主题**，其结论是「**做 1 课**（只做 `wear`）+ `lose`/`break` **挂靠** L23/L50」；本报告结论是「**做 2 课**」。**两边都有数据支撑，这不是谁对谁错，是产品取舍。** 冲突全貌与双方理由见 **⑤5.11**，已列为 **⑥ 不确定项 #0**。
> 2. **本批含一次自我更正**：我原判断「反向错法（昨天版站进原样槽）库内没有先例」是**错的**——L10 / L12 / L136 有 4 张专门对照卡。更正经 ⑤5.11，**结论方向未变，但文案策略显著改善**（新课可以回指 L10 / L12，把教学定位成「换词」而非「换规矩」）。

| # | 结论 | 把握度 |
|---|---|---|
| 1 | **拆 2 课**：**L203 教 `lose` + `break` 的原形**（1 个新点、2 个词例），**L204 教 `wear` 的原形 + 昨天版 `wore`**（2 个新点）。**不做 3 课**，也**不挂靠** L23 / L50 / L39 / L41 —— **⚠️ 「不挂靠」这一条与竞析冲突，我已在 ⑤5.11 撤回其中一条理由，并把立场降级为「两案皆可、倾向立课」** | ~~高~~ **中** |
| 2 | **`lose` / `break` 合成一课，理由不是「词义相近」，是「新课要教的那个槽位上，两词的错法完全同构」**：两词的**昨天版/做过版都教得很透**（`lost` 55 处 / `broke` 29 处 / `broken` 38 处，C1 正确句口径），但**原形在正确位置出现 0 次**。**⚠️ 但要诚实标注**：两词**已有的**错侧槽位**并不对齐**（`lose` 3 处全是 `have/had + 原样`；`break` 5 处里 3 处 `have`/`be + 原样`、1 处 `yesterday + 原样`）——竞析以此为据反对合并。我的合并理由建立在「新课的错句取自 `Don't`/`to`/`Did` 三个**新**槽位，在那里两词同构」之上。**分歧的实质是「以哪个槽位为轴」，见 ⑤5.11** | **中** |
| 3 | **`wear` 是双缺口，且比任务书描述的更严重**：任务书说「原形 0、过去式 0」是对的，但实测 **`wore` 全库只有 2 处，且都在同一个案件（`hunt-late-note`）的答案与讲解里**——该案件宿主课是 **L20**，而 `wear` **原形**要到 **L39** 才第一次出现在课程文本里，且**只出现在错句里**（`The boy who wear glasses...`）。**用户在 L20 被要求答出 `wore`，却要到 19 课之后才第一次见到 `wear`，而 `wore` 从未在任何一课的正确句里出现过**。另有一个**任务书未登记的第三缺口：`worn` 全库 0 处**（连错句和讲解里都没有） | 高 |
| 4 | **建议「立课」，不建议「挂靠」**。评估见 ③3.4：L23（`have` + 做过版）、L50（幕后句）、L39 / L41（挂尾巴）四课的**教学点都是结构，不是动词形态**；把动词形态挂上去会**劫持**原课的主线。且全库 **69.1% 的对照卡 `correct` 槽位复用本课目标句**（强约定）——挂靠要新造「本课之外的句子」占正解槽位。**⚠️ 我原加的另一条理由（「L23/L50 的正解槽位已满」）经复核是错的，已撤回**（L23 其实有 0 张 bothRight 卡、L50 有 3 张），见 ⑤5.11 | ~~高~~ **中** |
| 5 | **L203 targetSentence**：`I don't want to lose my key or break my cup.`（**11 词**，跳变 **-2**，零未教词，全库全新）<br>**L204 targetSentence**：`I wore my new hat yesterday, and I want to wear it again today.`（**14 词**，跳变 **+1**，零未教词，全库全新） | 中高 |
| 6 | **L204 的目标句刻意让 `wore` 与 `wear` 同台**——这是本课最想要的教学画面：同一个词的两个零件站在一起。这也是它比 L203 长（14 词）的原因 | 高 |
| 7 | **⚠️ 一个必须同步处理的硬约束**：新增 L203 / L204 后，**如果新建 `season-29`，`grammarSeasons.test.ts` 会直接判红**。该测试断言「≤3 课的小季 ≤ 3 个」，当前恰好是 **3 个**（season-6 / season-12 / season-19）——再加一个 2 课的小季就是第 4 个。**必须把 `season-28` 的 `max` 从 202 改成 204** | 高 |
| 8 | **⚠️ 缺口的成因已定位到机制**：D 层可抄率守门的 `buildPools()` **把 `contrast.wrong`（错句）也算作「教过的词」**。所以 `lose` / `break` 在 L23、`wear` 在 L39 就已被记为「已教」——**守门看的是「这个词出现过」，不是「这个词在正确位置出现过」**。这正是缺口能穿过多轮审计活到今天的原因 | 高 |
| 9 | **⚠️ 更关键的成因更正**：库内「原样槽不许穿昨天版」这条规矩**教得很透**（L10 ×2 + L12 ×1 + L136 ×1，共 4 张专门对照卡，`whyZh` 逐字写明「didn't 一出场，动词就要打回原样」）。**所以缺口不是「规矩没教」，而是 `lose`/`break`/`wear` 三个词在库内五个原样槽（`don't`/`didn't`/`Did`/`will`/`to`）上的出现次数全部为 0**——它们**全部**出场机会都被安排在了昨天版/做过版槽位上。**这一条更正显著改善了文案策略**（新课应回指 L10/L12，定位成「换词」） | 高 |
| 10 | 场景建议：**L203 用 `mansion`**（钥匙和杯子都在家里），**L204 用 `city`**（戴新帽子出门）。**`space` 到 L202 仍为 0 次使用，但两课都不建议用它**——与「小美的一天」的日常基调脱节（沿用第 45 批的判断） | 中 |

**最关键的一句话**：这三个词缺的**不是词汇量，是位置**。用户认识 `lost` / `broke` / `broken`，也认识 `wears`；他们**从未见过这些词的「原样」站在一个正确的位置上**。所以补法不是「再教一遍这些词」，而是**给原样一个正确的站位**。

**第二关键的一句（更正后）**：这条站位规矩**库内早就教透了**（L10 / L12 / L136 各有一张对照卡）。所以 L203 / L204 的教学定位应当是「**换词**」而不是「**换规矩**」——这比原判断的负担**更轻**，也更容易写文案。

---

## ② 三词可做性判定（每条错句 + 中文成因 + 是否与库内重复）

### 2.1 判定总表

| 词 | 原形在正确句 | 昨天版/做过版在正确句 | 原形被判错 | 可做性 | 建议课 |
|---|---|---|---|---|---|
| **`lose`** | **0** | `lost` **55** | 14 处 | ✅ **可做** | L203 |
| **`break`** | **0** | `broke` **29** / `broken` **38** | 9 处 | ✅ **可做** | L203 |
| **`wear`** | **0** | `wears` **39** / `wore` **0** / `worn` **0** | 6 处 | ✅ **可做（双缺口，工作量最大）** | L204 |

> **口径**：上表「正确句」= C1 口径（**排除 spot 题的 `answer` 字段**，因为那是要用户点出的错词）；详见 ⑤5.1。任务书给的 `lost` 50 处 / `broke` 25 处在**任何整数字段口径下都无法复现**（实测 C1=55/29，C4=63/40），差异说明见 ⑤5.2。

### 2.2 任务书三词表的**两处修正**

**(a) `wore` 不是「全库 0 处」，是「全库 2 处，且都在一个案件的答案里」**

```
[wore 的全库落点 · 递归遍历全部字段]
  [案件 hunt-late-note] errors[1].correction    :: "wore"
  [案件 hunt-late-note] errors[1].explanation   :: "yesterday 说的是昨天的事，动词要换昨天版：wore。"
```

该案件 `number=28`，被**课程 L20** 引用（`huntCaseIds=["hunt-late-note","hunt-mom-note"]`）。**时序缺陷**：

| 事件 | 位置 | 说明 |
|---|---|---|
| 用户在案件里被告知「答案是 `wore`」 | **L20** | 原句 `It was cold yesterday, so I wear my coat.`，`tokens[22]="wear"` 被判错，纠正 `"wore"` |
| `wear` **这个原形**第一次出现在课程文本 | **L39** | **只出现在错句里**：`The boy who wear glasses is my brother.`（`contrast[3].wrong`，`wrongMark: "wear"`）。同课正确句里出现的是 `wears`（`The boy who wears glasses`），**不是原形** |
| `wear` **原形**第一次出现在**正确**位置 | **从未**（见 ⑤5.3 / ⑤5.7） | 这是缺口的核心判据 |
| `wore` **第一次**（也是唯一一次）作为「正确说法」出现 | **从未在任何课的正确句里** | 只有上面那 2 处案件文案 |

**这不只是一条登记项，是一条真实的用户伤害路径**：L20 的用户答出 `wore` 后，在接下来 19 课里**再也见不到这个词**，也不会有任何一课告诉他 `wore` 长在什么句子里。

**(b) 任务书未登记的第三缺口：`worn` 全库 0 处**

```
[worn 全库落点 · 递归遍历 46745 个字符串字段]
  （0 处）
```

`worn` 不仅没有正确句，**连错句、干扰项、案件讲解里都没有**——它比 `lose` / `break` / `wear` 更彻底地缺席。本批**不建议**为它单开内容（理由见 ③3.3(3)），但**建议登记**为「已登记未做」。

### 2.3 `lose` 的错句候选（**L203 用**）

**库内已有的错句（新课不得重复）**：

| 来源 | 错句 | 记号 |
|---|---|---|
| L23 `contrast[0]` | `I have lose my key.` | `wrongMark: "lose"` |
| L23 `guided[0].options[1]` | `lose` | choose 题干扰项 |
| L23 `practice[0].distractors[0]` | `lose` | 干扰项 |
| L153 `practice[4].distractors[0]` | `lose` | 干扰项 |
| L178 `contrast[0]` | `I had lose my key before I got home.` | `wrongMark: "lose"` |
| L178 `guided[0].options[2]` / `guided[3]` | `lose` | choose 干扰项 / spot `wrongToken` |
| L178 / L185 / L188 `practice[].distractors` | `lose` | 干扰项 |
| 案件 `hunt-had-lost-key` `tokens[2]` | `lose` | 被判错，纠正 `lost` |

> **规律**：库内 `lose` 被判错的**全部 14 处，都是同一个错法的不同包装**——「`have` / `had` 后面穿了原样」。**没有一处**是「要穿原样的位置穿了昨天版」的**反向**错误。

**新课建议的错句（逐条核过：全部 ✅ 全新）**：

| # | 错句 | 最长分句 | 中文母语者为什么会这么说 | 与库内重复？ |
|---|---|---|---|---|
| ① | **`Don't lost your key.`** | 4 词 | 中文「别弄丢钥匙」——「弄丢」在心里是一个**完成的事**（丢了就没了），所以手往昨天版 `lost` 上摸。而 `Don't` 后面是「还没发生的事」，要穿**原样** `lose`（L32 教过「别做 = Don't + 动词穿原样」，但当时用的 `close` / `open` 看不出形态差） | ✅ 全新 |
| ② | **`I don't want to broke my cup.`** | 7 词 | 中文「我不想**弄坏**杯子」——「弄坏」在中文里没有形态，说的人在想「坏掉的那个结果」，于是写出 `broke`。`to` 后面要穿**原样**（L15 教过「want to + 原样」，但当时用的 `travel` / `go` 形态和原样长得一样，看不出） | ✅ 全新 |
| ③ | **`Did you lost your key?`** | 5 词 | 中文「你**丢了**钥匙吗」——「丢了」是已经发生的事，直觉上该用昨天版。`Did` 已经扛了「过去」这件事，后面要穿**原样** | ✅ 全新 |
| ④（备用） | `I lose my key yesterday.` | 5 词 | 中文「我昨天丢了钥匙」——**表意正确、形态错位**：`yesterday` 明说要昨天版，这里却穿了原样。这是**反方向**的典型错法，也是**任务书提示的方向**，但它与 L23 已有的 `I break my cup yesterday.`（`break` 版）**同构**，所以降为备用 | ✅ 全新（但与 L23 `break` 版同构） |

> **设计建议**：**① ② ③ 三条主用**（覆盖 `Don't` / `to` / `Did` 三个「要穿原样」的口），④ 备用。

### 2.4 `break` 的错句候选（**L203 用**）

**库内已有的错句（新课不得重复）**：

| 来源 | 错句 | 记号 |
|---|---|---|
| L23 `contrast[1]` | `I break my cup yesterday.` | `wrongMark: "break"` |
| L23 `guided[3]` | `I have break my cup.` | spot，`wrongToken: "break"` |
| L50 `contrast[0]` | `My cup was break.` | `wrongMark: "break"` |
| L50 `guided[3]` | `My cup was break.` | spot，`wrongToken: "break."` |
| 案件 `hunt-broken-window` `tokens[6]` | `break` | 被判错，纠正 `broken` |

> **规律**：与 `lose` 完全一致——库内 `break` 被判错的**全部 9 处也都是「`have` / `be` 后面穿了原样」**（`have break` / `was break`），加上一处 `yesterday` + 原形。**没有一处**是「`to` / `Don't` / `Did` 后面穿原样」的对位训练。

**新课建议的错句（逐条核过：全部 ✅ 全新）**：

| # | 错句 | 最长分句 | 中文母语者为什么会这么说 | 与库内重复？ |
|---|---|---|---|---|
| ① | **`Don't broke the cup.`** | 4 词 | 与 2.3① 同因：「别把杯子**摔了**」——「摔了」是完成画面 | ✅ 全新 |
| ② | **`I don't want to broke my cup.`** | 7 词 | 与 2.3② 同因 | ✅ 全新 |
| ③ | **`Did you broke the cup?`** | 5 词 | 与 2.3③ 同因 | ✅ 全新 |
| ④（**不要用**） | ~~`I have break my cup.`~~ | — | — | ❌ **库内已有**（L23 `guided[3].tokens` 拼回就是这一句） |
| ⑤（**不要用**） | ~~`I break my cup yesterday.`~~ | — | — | ❌ **库内已有**（L23 `contrast[1]`） |
| ⑥（**不要用**） | ~~`My cup was break.`~~ | — | — | ❌ **库内已有**（L50 `contrast[0]` + `guided[3]`） |

> **⚠️ 这是本批最容易踩的坑**：`break` 的自然错句 `I break my cup yesterday.` / `My cup was break.` **都已经在库里了**（L23 / L50）。如果新课凭直觉写这两条，**会与 L23 / L50 的对照卡逐字重复**。必须走 `Don't` / `to` / `Did` 这三条**反向**的错法。

### 2.5 `wear` 的错句候选（**L204 用**）

**库内已有的错句**：

| 来源 | 错句 | 记号 |
|---|---|---|
| L39 `contrast[3]` | `The boy who wear glasses is my brother.` | `wrongMark: "wear"`（尾巴里的 -s 掉了） |
| L39 `guided[5].options[2]` | `wear` / `wearing` | replace 题干扰项 |
| L41 `contrast[4]` | `I know the boy who wear glasses.` | `wrongMark: "wear"` |
| 案件 `hunt-late-note` `tokens[22]` | `wear`（原句 `It was cold yesterday, so I wear my coat.`） | 被判错，纠正 `wore` |

> **规律**：库内 `wear` 被判错的 **6 处里，5 处都是「`who` 尾巴里该加 -s 却穿原样」**（L39 / L41 的挂尾巴课），**1 处是「`yesterday` + 原形」**（案件 `hunt-late-note`）。**没有一处**是 `weared` 这类「乱加 -ed」的错，也**没有一处**是「`to` / `Don't` / `Did` 后面穿原样」的**反向**训练。

**新课建议的错句（逐条核过：全部 ✅ 全新）**：

| # | 错句 | 最长分句 | 中文母语者为什么会这么说 | 与库内重复？ |
|---|---|---|---|---|
| ① | **`I weared my new hat yesterday.`** | 6 词 | `wear` 长得像个「老实词」（不像 `draw` / `swim` 那样明显不规则），于是**照 -ed 的规则加**。这是**库内完全没有过的新错点**——而 L202（`drawed`）/ L201（`sleeped`）/ L198（`swimmed`）/ L200（`feeled`）已经用同一手法教过四个词，`weared` 是这条线的**自然延续** | ✅ 全新（`weared` 在全库 0 处） |
| ② | **`I want to wore my new hat.`** | 7 词 | 与 2.3② 同因：想说「想**戴**那顶新帽子」，手摸到昨天版 | ✅ 全新 |
| ③ | **`Did you wore your new hat?`** | 6 词 | 与 2.3③ 同因 | ✅ 全新 |
| ④（备用） | `I wear my new hat yesterday.` | 6 词 | 与 2.3④ 同因（形态错位） | ✅ 全新，**但机制与案件 `hunt-late-note` 重复**（那里是 `It was cold yesterday, so I wear my coat.`），建议不用 |
| ⑤（备用） | `He wear glasses.` | 3 词 | 他/她/它版漏了 -s（研究者用语：三单漏 -s；**该词不得进课件文案**）。**但机制与 L39 / L41 完全重复**（都栽在挂尾巴的位置），且库里已用 5 处教过，**不建议再用** | ✅ 句子全新，但机制重复 |

### 2.6 「中文成因」的统一解释（三词共用）

**⚠️ 本节经过一次自我更正**（原版表述被数据否掉），更正过程见 ⑤5.11。

三条错句（`Don't` / `to` / `Did` 后面穿昨天版）**不是三个分散的错误，是同一个母语直觉的三次显形**：

> **中文的动词没有形态。**「丢」「弄坏」「戴」这三个词不管发生在昨天、今天还是明天，**写得一模一样**。所以中文母语者说「别丢」「想戴」「丢了吗」的时候，**脑子里没有「该穿哪件衣服」这一步**——他会顺手抓那个**画面感最强**的形式。而在这三个词上，画面感最强的形式**恰好都是过去式**：`lost` 见过 55 次、`broke` 29 次、`broken` 38 次；`wore` 是 L20 案件里老师给过「标准答案」（只给过那一次）。
>
> 英语的规矩反过来：`Don't` / `to` / `Did` 是三个**明说「还没发生 / 不确定发生」**的位置，必须穿**原样**。

**⚠️ 更正：这条规矩库内不仅教过，而且教得很透——透到有专门的对照卡。**

我原版写的是「用户学过规矩，只是从没在『两个形态明显不同』的词上练过」。**这句被数据直接否掉**：

```
[原样 vs 昨天版 的「谁先教」逐词对照 · C1 正确句口径]
  原样      原样首见   昨天版首见    谁先
  draw      L12       L202       原样先（差 190 课）
  sleep     L15       L201       原样先（差 186 课）
  swim      L12       L198       原样先（差 186 课）
  sit       L14       L199       原样先（差 185 课）
  know      L27       L197       原样先（差 170 课）
  think     L36       L197       原样先（差 161 课）
  feel      L76       L200       原样先（差 124 课）
  keep      L77       L200       原样先（差 123 课）
  run       L38       L126       原样先（差 88 课）
  have      L3        L60        原样先（差 57 课）
  catch     L173      L199       原样先（差 26 课）
  go        L9        L10        原样先（差 1 课）
  ——以上 12 个词全部「原样先教、昨天版后教」，且两个形态明显不同——
  lose      从未        L23       ★原样无，昨天版有
  break     从未        L23       ★原样无，昨天版有
  wear      从未        从未        ★两者皆无
```

> **而且「反向错法」库内早有专门的教学先例（这是本节最关键的更正）**：
>
> | 课 | 错句 | 记号 | 纠正 | 该课 `whyZh` 逐字 |
> |---|---|---|---|---|
> | **L10** | `I didn't went out.` | `went` | `I didn't go out.` | 「**didn't 一出场，动词就要打回原样**：didn't go。一场戏只让一个词换形状。」 |
> | **L10** | `Did you went yesterday?` | `went` | `Did you go yesterday?` | 「**Did 搬句首时，后面的动词也要变回原样 go**：Did you go？别让动词换两次形状。」 |
> | **L12** | `Tomorrow I will drew.` | `drew` | `Tomorrow I will draw.` | 「**will 出场时动词保持原样，不换昨天版**。一场戏只有一个变化。」 |
> | **L136** | `I am looking forward to saw you.` | `saw` | `I am looking forward to seeing you.` | 「**名字版是 seeing，不是昨天版的 saw**——这个位置只认名字版。」 |
>
> **所以 L203 / L204 的错句不是新机制**——与 L10 / L12 是**同一条规矩**（原样槽不许穿昨天版），只是**换了一个词**。

**缺口的准确描述（更正后）**：

| 层面 | 库内状态 |
|---|---|
| **规矩**（原样槽不许穿昨天版） | ✅ **教透了**，且有 4 张专门对照卡（L10 ×2、L12 ×1、L136 ×1） |
| **槽位**（`don't` / `didn't` / `Did` / `will` / `to`） | ✅ **被使用约 150 次**（`don't` 30 种动词、`didn't` 19 种、`will` 31 种、`to` 94 种） |
| **用「形态明显不同」的不规则动词练这条规矩** | ✅ **练过很多**：`didn't` + `go`/`swim`/`catch`/`feel`/`sleep`/`draw`；`will` + `draw`/`go`/`swim`/`come`/`eat`；`to` + `draw`/`swim`/`sleep`/`eat`/`know`/`catch` |
| **`lose` / `break` / `wear` 站在这些槽位上** | ❌ **0 处**（实测五个槽全为 0） |

> **所以病因既不是「规矩没教」，也不是「没在形态不同的词上练过」，而是**：
>
> **这三个词在库内的**全部**出场机会都被安排在「昨天版 / 做过版」的槽位上**（`lost` 55、`broke` 29、`broken` 38、`wears` 39），**唯独没被安排在原样槽上一次**。用户对这三个词的形状记忆是**单向的**——记得 `lost` 长什么样（见过 55 次），**从没见过 `lose` 站在一个对的位置，因为那个位置从来没给他留过**。
>
> **这也是它比 L197-L202 六课更隐蔽的原因**：那六课的全部 10 个词在补课**之前**就已经**有原样在正确句里**（实测逐词：`think` L36 / `know` L27 / `swim` L12 / `sing` L14 / `sit` L14 / `catch` L173 / `feel` L76 / `keep` L77 / `sleep` L15 / `draw` L12，**全部 10 个词都是原样先教、昨天版后教**）——它们缺的是**新零件**。而 `lose` / `break` / `wear` 缺的是**本体**：**连「原样版」都没有**（见 ⑤5.3、⑤5.7）。

**因此 L203 / L204 的教学定位应准确表述为**：

> **不是「教一条新规矩」，而是「把三个从没在正确位置站过的词，放到早就教透的槽位上去」。** 课件文案应**明确回指 L10 / L12**（「第 10 课、第 12 课你见过这种错——那句是 `didn't went` / `will drew`；今天换成 `lose` / `break`」），用户能立刻挂到已有规矩上——**学的是「换词」，不是「换规矩」**，负担显著降低。

---

## ③ 拆课方案与理由

### 3.1 结论：**2 课**

| 课 | 教学内容 | 新点数 | targetSentence |
|---|---|---|---|
| **L203** | **`lose` + `break` 的原形**——「要穿原样的位置（`Don't` / `to` / `Did`）别穿昨天版」 | **1 个**（位置规矩）+ 2 个词例 | `I don't want to lose my key or break my cup.`（11 词） |
| **L204** | **`wear` 的原形在正确位置 + 昨天版 `wore`** | **2 个**（`wear` 站位 / `wore` 形态） | `I wore my new hat yesterday, and I want to wear it again today.`（14 词） |

### 3.2 为什么 `lose` / `break` 能合成一课？——**因为缺口形状完全相同**

任务书问的是「`lose` / `break` 的问题相同，能否合成一课」。我的答案是**能，但理由必须说准**：

- ❌ **不是**「两个词意思相近」（`lose` = 丢、`break` = 摔坏，是两个概念）
- ❌ **不是**「都是不规则动词」（库里 211 案里不规则动词多的是）
- ✅ **是**「**两个词的缺口形状逐项对齐**」：

| 对照项 | `lose` | `break` |
|---|---|---|
| 原形在正确位置出现 | **0** | **0** |
| 昨天版/做过版教得透 | `lost` **55** | `broke` **29** / `broken` **38** |
| 原形被判错的**机制** | `have` / `had` + 原样（14 处，同一种） | `have` / `be` + 原样 + `yesterday` + 原形（9 处，同一种） |
| **新课要教的新点** | 「`Don't` / `to` / `Did` 后面穿原样」 | 「`Don't` / `to` / `Did` 后面穿原样」 |
| 挂靠锚点 | L23（`have` + 做过版） | L50（幕后句） |

**最后两行是决定性的**：新课要教的**是同一件事**。把 `lose` 和 `break` 拆成两课，第二课会变成第一课的重讲，只是换了名词（钥匙 / 杯子）——这违反「单课 2-3 个新点」的**精神**（不是数量问题，是**不重复**的问题）。

**同时**：两词的两个「锚点课」（L23 / L50）都属**同一族**（`have` / `be` + 做过版，L21 / L23 / L50 / L51-L54 一条线），把 `lose` / `break` 放回它们共同的语境里做**双正解回收**，比拆两课更省用户的心力。

**反向检验**（如果拆两课会怎样）：L203 教 `Don't lose...`，L204 教 `Don't break...`——**第二课的对照卡里有 3 张要解释「为什么不是昨天版」，而这 3 张的 `whyZh` 会和第一课几乎逐字相同**。库里对「同一机制重复讲解」是敏感的（见 `grammarLessons.test.ts` 的「内容重复度守门」），拆两课会直接撞上去。

### 3.3 为什么 `wear` 单独一课？——**双缺口 + 一个真实的教学冲突**

**（1）双缺口**：`wear` 的原形 0、昨天版 `wore` 0（唯一 2 处在一个案件的答案里）。这意味着 `wear` 需要**两个新点**：

1. `wear` **原形**在正确位置（`I want to wear...` / `Don't wear...`）
2. `wear` 的**昨天版是 `wore`**（`I wore my new hat yesterday.`）

按「单课 2-3 个新点」，**2 个点正好一课**。若把它们拆成两课（一课只教 `wear` 原形、一课只教 `wore`），第一课会变成「`wear` 这个词的原形」（内容极薄），第二课又要重新讲一遍 `wear`——不划算。

**（2）一个真实的教学冲突必须在这一课处理掉**：`wear` 在 L39 / L41 是**被判错**的（`The boy who wear glasses...`）。用户在 L39 学到「`wear` 是错的」。**L204 必须正面回答「那 L39 为什么判它错」**——否则就是第 45 批 `slept` 那种冲突的翻版（库里已有成熟处理法，照搬即可）。

**（3）`worn`（做过版）不建议在这一课教**：`worn` 全库 0 处。虽然技术上它也是缺口，但：
- 「穿过 / 戴过」（`have worn`）在零基础用户的日常里**出现频率极低**——本项目 800 词的累计词表里，需要 `worn` 的场景几乎不存在
- 一课 2 个新点已是水位上限（L197-L202 各 1-2 点），加第三个点会挤掉 `wore` 的练习量
- **建议登记为「已登记未做」**，与 `losing` / `breaking` / `loses` / `breaks` 一起（这些形式全库 0 处，但都是低频，不构成真实缺口）

### 3.4 「挂靠 vs 立课」的正面评估（**任务书特别要求**）

任务书问：`lose` / `break` 的原形是否该挂靠在各自的主课（L23 / L50）加对照卡，而不是立新课？**我的结论：应该立课。三条理由。**

**理由一：四课的「教学点」都是结构，不是动词形态——挂靠会劫持主线**

| 锚点课 | `grammarLabel` | 教学点 | 把动词形态挂上去会怎样 |
|---|---|---|---|
| **L23** | `弄丢了 / 弄坏了 · have + 做过版` | 「结果还在，用 `have` + 做过版」 | ❌ 本课的主线是「**什么时候**用做过版」。加一句「另外原形也不能穿」会**稀释**主线——而且 L23 的 `targetSentence` 只有 **5 词**（`I have lost my key.`），本课的设计意图就是**极简** |
| **L50** | `幕后句 · 谁做的不重要` | 「谁做的不重要，把事推到台前（`be` + 做过版）」 | ❌ L50 教的是**换主角**（`Someone broke my cup.` → `My cup was broken.`）。`break` 的原形站位与「谁当主角」毫无关系 |
| **L39** | `给名词挂尾巴 · who` | 「先说出人，再把尾巴挂他后面」 | ❌ `wear` 在 L39 是**填充动词**（因为「戴眼镜」是个好用的尾巴），**不是教学对象**。在挂尾巴课里教 `wore` 会让学生以为 `wore` 和 `who` 有关 |
| **L41** | `收口 · 两句话拼一句` | 话中话 + 挂尾巴合用 | ❌ **收口课**（`grammarLessons.test.ts` 明确把收口课列为「零新知」）。在收口课加新点是设计上的直接违规 |

**理由二：四课都已满 6 张对照卡，且正解槽位有强约定不许塞外句**

```
[全库对照卡张数分布]
  { "6": 202 }        ← 202 课，课课恰好 6 张

[对照卡 correct 槽位的来源]
  全库对照卡总数 = 1212
  correct === 本课 targetSentence 的       = 838（69.1%）
  correct 复用本课例句/变体/变奏/对话的     = 205（16.9%）
  correct 是本课之外的句子的               = 169（13.9%）
```

`grammarLessons.test.ts` 的注释把这条约定写得很明确：

> 「`contrast.correct` 复用目标句/例句（**对比卡要拿本课句子做正误对照**）」

挂靠意味着**要在 L23 / L50 / L39 / L41 里新造 6 张卡中的若干张，而 `correct` 槽位得放本课之外的句子**（`Don't lose your key.` 与 L23 的「`have` + 做过版」毫无关系）——这是往 86% 的约定里塞 13.9% 的例外，且要**动四课已上线的数据**（回归风险远大于新写两课）。

> **⚠️ 本条的两点精确化（避免夸大）**：
> 1. **「都已满 6 张」准确但含义有限**：全库 202 课**课课恰好 6 张**，**无 7 张的课**。所以挂靠若**新增**一张卡，该课变 7 张——**全库唯一的例外**（无测试断言，属约定）。**但**竞析建议的 `bothRight` 挂靠**不必新增卡**：可用**替换**方式（把现有卡的 `wrong` 侧换成 `bothRight` 形态）。**所以「槽位满」不是硬障碍，我原来说重了。**
> 2. **`bothRight` 槽位实测并未用满**：`L23` = **0 张**，`L50` = **3 张**（详见 ⑤5.11）。**竞析的挂靠方案在这两课都有位置。**
>
> **⇒ 理由二的有效部分只剩「改动面」**：立课**不动任何存量**，挂靠**改两课已上线数据**。这是一条**工程偏好**，教学上两案接近。

**理由三：新点属于「换零件」系列，系列本身就是「立新课」的先例**

L197-L202 六课（`thought/knew`、`swam/sang`、`sat/caught`、`felt/kept`、`slept`、`drew`）**全都是独立的课**，每一课的形态是：

- `grammarLabel: "昨天版 · draw 变 drew"`
- 对照卡里**回收 3 张双正解**（引 L12 / L82 等旧课的原句）
- `deepDive` 正面回答「同一形式为什么那次被判错」

**L203 / L204 完全套得上这个模板**，而且比 L197-L202 更「应该独立」——因为它们的**形态差比那些词更明显**（`lose` vs `lost`、`break` vs `broke`、`wear` vs `wore` 都是**整体换形**，不像 `close` vs `closed` 那样只差个尾巴）。

**唯一的反方向考虑**（诚实记录）：挂靠的**好处**是「用户在那个语境里正好需要它」——L23 讲丢钥匙时，用户确实会想说「别丢」。但这个好处**已经在 L197-L202 的模板里被满足**了：新课用 3 张双正解**回收锚点课的原句**（`I have lost my key.` / `My cup was broken.` / `I broke my cup yesterday.`），等于把锚点课请回来同台。**回收 ≠ 挂靠，但教学效果接近，且不动存量数据。**

### 3.5 L203 / L204 的对照卡设计（每课 6 张：3 带标记 + 3 双正解）

**L203（`lose` + `break` 的原形）**

| # | `wrong` | `wrongMark` | `correct` | 备注 |
|---|---|---|---|---|
| 1 | `Don't lost your key.` | `lost` | `Don't lose your key.` | ✅ 全新 |
| 2 | `I don't want to broke my cup.` | `broke` | `I don't want to break my cup.` | ✅ 全新 |
| 3 | `Did you lost your key?` | `lost` | `Did you lose your key?` | ✅ 全新 |
| 4 | `I have lost my key.`（**双正解**） | `null` | `Don't lose your key.` | 回收 L23，⚠ 库内已有（引用不构成重复） |
| 5 | `My cup was broken.`（**双正解**） | `null` | `I don't want to break my cup.` | 回收 L50 |
| 6 | `I broke my cup yesterday.`（**双正解**） | `null` | `Don't lose your key, and don't break the cup.` | 回收 L23 |

**L204（`wear` 原形 + `wore`）**

| # | `wrong` | `wrongMark` | `correct` | 备注 |
|---|---|---|---|---|
| 1 | `I weared my new hat yesterday.` | `weared` | `I wore my new hat yesterday.` | ✅ 全新错点 |
| 2 | `I want to wore my new hat.` | `wore` | `I want to wear my new hat.` | ✅ 全新 |
| 3 | `Did you wore your new hat?` | `wore` | `Did you wear your new hat?` | ✅ 全新 |
| 4 | `The boy who wears glasses is my brother.`（**双正解**） | `null` | `I want to wear my new hat.` | **用来处理 L39 的冲突**（见下） |
| 5 | `It was cold yesterday, so I wear my coat.`（**双正解**） | `null` | `I wore my new hat yesterday.` | 回收案件 `hunt-late-note` 的锚点 |
| 6 | `I didn't wear my new hat yesterday.`（**双正解**） | `null` | `I wore my new hat yesterday, and I want to wear it again today.` | 展示「否定里穿原样」的正解 |

> **第 4 张是 L204 的关键**：它必须**正面回答 L39 的判错**。文案方向（沿用 L202 处理 `drew` 冲突的成熟写法）：
> 「第 39 课那句 `The boy who wear glasses...` 被判错，**不是 `wear` 这个词的问题**，是 `who` 后面要跟他/她/它版（`wears`）。那句话说的是「（平时）戴眼镜的男生」——**天天都戴**，所以穿 `wears`。今天这句 `I wore my new hat yesterday.` 说的是「（昨天）戴了一回」，才换零件成 `wore`。」

### 3.6 targetSentence 与场景（含「为什么选这个场景」）

#### **L203 · `lose` + `break` 的原形**

| 项 | 内容 |
|---|---|
| **targetSentence** | **`I don't want to lose my key or break my cup.`** |
| **中文意图** | 「我不想把钥匙弄丢，也不想把杯子摔坏。」 |
| **词数** | **11 词**（单分句；L202 = 13，跳变 **-2**，≤ 18 ✅） |
| **场景** | **`mansion`（家里）** |
| **`grammarLabel`（建议）** | `要穿原样 · Don't / to / Did 后面` |
| **episode** | 「小美的一天 二百零三」 |
| **零未教词** | ✅（`or` 首见 L17、`cup` L3、`key` L23、`want` L4、`lose`/`break` L23 均已在库） |
| **全库整句重复** | ✅ 0 处（含 token 拼接口径共 9762 条句子比对） |

**为什么选 `mansion`**：

1. **两件道具都是家里的东西**——钥匙（`key`）在库里出现于 L23(`mansion`) / L24 / L27 / L28 / L35 / L50 / L153 / L178 / L185 / L188；杯子（`cup`）出现于 L3 / L8 / **L23(`mansion`)** / L50 / L51 / L52 / L53 / L54 / L62(`mansion`) / …。**两件道具的原始锚点课 L23 就在 `mansion`**——回到同一场景做回收，用户的记忆钩子最强。
2. **`mansion` 是「小美的一天」的家**（65 次使用，全库第二高）——「不想弄丢钥匙 / 不想摔坏杯子」是**出门前 / 在家时**的典型心理，日常感成立。
3. **不与末 8 课场景单调冲突**：末 10 课场景序列 = `lighthouse → island → mansion → mansion → campus → ocean → train → snow → mansion → island`。L203 用 `mansion` 会与 L201 撞（隔一课），可接受；若想更分散，**备选 `campus`**（58 次，末次 L197）。
4. **不用 `space`**（虽然它是 0 次使用的「处女场景」）：本课的道具是钥匙和杯子，**放在太空里会把「小美的一天」的日常基调打断**。这是沿用第 45 批对 `space` 的判断——`space` 值得留给真正需要它的课（如科普 / 想象类），不该为「消耗场景配额」而用。

**难度序列核对**（末 8 课最长分句）：

```
L195=6  L196=6  L197=8  L198=8  L199=9  L200=10  L201=11  L202=13
                                                     L203=11 ← 回落 2 词，闸门只禁上升，安全
```

> **一个可选项（留给人取舍）**：若希望难度**单调继续爬升**，可换成 `I don't want to lose my key, and I don't want to break my cup.`（**15 词**，跳变 **+2**，同样零未教词、全库全新）。**取舍**：15 词对零基础偏长，且它把同一个句式说了两遍（`I don't want to ...` ×2）——**教学上是冗余，难度上是爬升**。我倾向 **11 词版**（点更清楚），但这条留作显式选项。

#### **L204 · `wear` 原形 + `wore`**

| 项 | 内容 |
|---|---|
| **targetSentence** | **`I wore my new hat yesterday, and I want to wear it again today.`** |
| **中文意图** | 「我昨天戴了新帽子，今天还想再戴。」 |
| **词数** | **14 词**（L202 = 13，跳变 **+1**，≤ 18 ✅） |
| **场景** | **`city`（出门上街）** |
| **`grammarLabel`（建议）** | `昨天版 · wear 变 wore`（沿用 L197-L202 的 `昨天版 · X 变 Y` 命名） |
| **episode** | 「小美的一天 二百零四」 |
| **零未教词** | ✅（`wore` 是本课自己要教的；`hat` 首见 L8、`again` L73、`today` L1、`yesterday` L10、`want` L4、`new` L1、`wear` L39） |
| **全库整句重复** | ✅ 0 处 |

**为什么选这个句子**：

1. **`wore` 与 `wear` 同台，是本课最想要的那张画面**——一句话里同时出现「昨天版」和「原样」，**同一个词的两个零件站在一起**。这比两句分开说清楚得多，也**正好补上 L20 案件留下的悬空**（用户在 L20 被告知答案是 `wore`，但不知道它在句子里长什么样）。
2. **`and` 连接的两截各自独立**（`I wore my new hat yesterday` / `I want to wear it again today`），符合 L197-L202 的句式模板（L199 `I sat next to her and caught the bus.`、L200 `I felt cold in the snow, but I kept reading.`、L202 `I drew a picture of the boat and put it on the wall.` 都是「两截 + 连接词」）。
3. **词数接续 L202**：13 → 14（+1），难度曲线继续爬，落在系列的自然延伸上。

**为什么选 `city`**：

1. **本课的动作是「出门时戴帽子」**——`city`（39 次使用）是「小美的一天」里**出门上街**的对应场景，比 `mansion`（在家）更贴。
2. **场景分散**：`mansion` 已 65 次（全库第二高）且末次 L201（隔一课又用）；`city` 末次 L192（**隔了 12 课**），分散度明显更好。
3. **`hat` 的既有落点支持城市/出门语境**：`hat` 出现在 L8(`train`) / L18(`mansion`) / L67(`campus`) / L79(`mansion`) / L85(`mystery`) / L87(`campus`) / L88(`campus`) / L191(`mansion`) / L192(`city`) / L195 / L196。**L192 就在 `city`**，可直接引为「帽子 + 城市」的记忆锚点。
4. **不用 `space`**：同 L203 的理由。

**两个备选（实测同样合格）**：

| 句子 | 词数 | 跳变 | 说明 |
|---|---|---|---|
| `I wore my new hat yesterday, so I want to wear it again.` | **13** | **0** | 更保守（不破坏难度曲线的斜率），少一个 `today` |
| `I wore my new hat, but I want to wear my old one today.` | **14** | **+1** | 用 `but` 转折（回收 L19 的连词），多一个 `old` ↔ `new` 对照 |

### 3.7 ⚠️ 同步必做项（**其中第 2 条是硬约束，不做会判红**）

| # | 项 | 说明 |
|---|---|---|
| 1 | `grammarLessons.ts` 追加 L203 / L204 课对象 | 含 `cover` 导入（注意：现有导入语句只到 `cover85`，新增课需补 import） |
| 2 | **`grammarSeasons.ts`：把 `season-28` 的 `max` 从 `202` 改为 `204`** | **⚠️ 硬约束**：`grammarSeasons.test.ts` 断言「≤3 课的小季 ≤ 3 个」，当前恰好 3 个（`season-6` 3课 / `season-12` 3课 / `season-19` 3课）。**新建 `season-29`（203-204，2 课）会让它变成 4 个 → 测试判红**。改 `season-28` 为 `182-204`（23 课）则小季数不变 ✅。同时 `season-28` 的 `hint` 需追加这两个点位（该 hint 是逐点位罗列的，见现有文本末段） |
| 3 | `huntCases.ts` 追加案件 | 案件 `number` 接 **211** 之后（现有最大 `number=211`，无重复编号）。建议 `hunt-lose-break` + `hunt-wore`（沿用 L197-L202 批次的双词合并命名法，如 `hunt-felt-kept` / `hunt-sat-caught`）；`reviewed: true` 是**被课程引用的前提**（`HuntCase.reviewed` 注释）、`scene` 字段需填 |
| 4 | L203 / L204 的 `huntCaseIds` 指向新案件 | 现有 202 课中 197 课有 1 个案件、5 课有 0 个（L2/L3/L5/L6/L8）、8 课有 2 个、1 课有 3 个 |
| 5 | 陈旧计数核对 | 全库未发现硬编码的「202」或课数断言（已 grep 确认），但 `grammarPathPage.milestone.test.ts` 与里程碑文案（`CAN_DO_MILESTONES`）需按批次惯例检查是否要追加 L203 / L204 的里程碑 |

---

## ④ 外部依据与逐字引用

### 4.1 三词在权威源里的位次：**都在「最常用」名单内，且都是 A1 级**

**（1）British Council 把 `lose` / `break` / `wear` 三词**全部列入「最常用的不规则动词」表**

URL：`https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/past-simple`

逐字引用：
> "Here are the most common irregular verbs in English, with their past tense forms:"

该表收录的动词（已逐项核对）：`be, begin, break, bring, buy, build, choose, come, cost, cut, do, draw, drive, eat, feel, find, get, give, go, have, hear, hold, keep, know, leave, lead, let, lie, **lose**, make, mean, meet, pay, put, run, say, sell, send, set, sit, speak, spend, stand, take, teach, tell, think, understand, **wear**, win, write`。

> **这是本批最强的外部佐证，而且它一次性验证了整个系列**：本项目 L197-L202 六课教的词（`think` / `know` / `swim`→**不在 BC 表内** / `sing`→**不在 BC 表内** / `sit` / `catch`→**不在** / `feel` / `keep` / `sleep`→**不在** / `draw`）里，`think` / `know` / `sit` / `feel` / `keep` / `draw` **六个都在 BC 的「最常用」名单里**；`lose` / `break` / `wear` **也都在**。也就是说，**本系列第 46 批要补的三个词，在 BC 的判断里与 L197-L202 已做的六个词属于同一个频段**——没有「补不补得值」的疑问。

**（2）British Council 另一页把 `lose` / `break` / `wear` 列为高频不规则动词**

URL：`https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/irregular-verbs`

逐字引用：
> "But many of the most frequent verbs are irregular:"

该页确认三词均在表内：`break / broke / broken`、`lose / lost / lost`、`wear / wore / worn`。（该页**不提供**逐词频次排名——它是一张按字母序排列的表。**明确记录，避免后续批次重复期待**。）

**（3）Oxford 词典：三词全部标 Oxford 3000 + CEFR **A1**

| URL | 逐字观测到的标记 |
|---|---|
| `https://www.oxfordlearnersdictionaries.com/definition/english/lose` | 显示 **`Oxford 3000`** 标记，等级 **`a1`** |
| `https://www.oxfordlearnersdictionaries.com/definition/english/break_1` | 显示 **`[A1]`**（动词义项） |
| `https://www.oxfordlearnersdictionaries.com/definition/english/wear_1` | 显示 **`Oxford 3000`** 与 **`a1`** |

> **一致性结论**：三个词**同属 A1 / Oxford 3000**。这意味着——**它们本来就该在零基础阶段教完**，而不是留到 202 课之后。这不是「加餐」，是**补欠账**。

**（4）规模参照（说明「不规则」这件事本身有边界）**

URL：`http://www.grammarly.com/blog/parts-of-speech/irregular-verbs/`（`https://www.grammarly.com/blog/irregular-verbs/` 301 跳转至此处）

逐字引用：
> "There are over 200 commonly used irregular verbs in English."
> "Irregular verbs are verbs that do not follow the normal pattern of conjugation to express tenses and past participles."
> "Unlike regular verbs, which take on their simple past tense and past participle forms by adding -ed or -d to their base, irregular verbs are conjugated in many unpredictable ways."

### 4.2 **「原形该站在哪里」的三条权威规矩（本批课件的规矩来源）**

**（1）Cambridge：`don't` 后面必须是原形**

URL：`https://dictionary.cambridge.org/grammar/british-grammar/imperatives`

逐字引用：
> "We use do + not or don't + the base form of a verb to form negative orders or commands"

Cambridge 同页例句：
> "Don't take the car. Go on your bike."

**（2）Cambridge：`to` 后面是原形（`to` + base form）**

URL：`https://dictionary.cambridge.org/grammar/british-grammar/infinitives-with-and-without-to`

逐字引用：
> "consists of to plus the base form of the verb"

同页例句：
> "I want to speak to you."

**（3）Cambridge：`did` / `didn't` 后面是原形——**且这条对不规则动词同样适用**

URL：`https://dictionary.cambridge.org/grammar/british-grammar/past-simple-i-worked`

逐字引用：
> "we make questions and negatives with irregular verbs in the same ways as for regular verbs."

「the same ways」的具体内容（同页）：否定式为 `did not work` / `didn't`，疑问式为 `Did I, she, he, it, you, we, they work?`——**两处都用 base form `work`**。

**（4）EF（补充第三条源的独立确认）**

URL：`https://www.ef.com/wwen/english-resources/english-grammar/simple-past-tense/`

逐字引用（句式模板）：
> "Subject + did not + infinitive without to"
> "Did + subject + infinitive without to"

同页结论句：
> "For the negative and interrogative form of all verbs in the simple past, always use the auxiliary 'did'."

### 4.3 三个「零件」的分工能在同一权威源里对齐（本批课件的一句话根据）

URL：`https://dictionary.cambridge.org/grammar/british-grammar/verbs-forms`

逐字引用：
> "Main verbs have three basic forms: the base form, the past form and the -ed form"

各形式的用法（同页逐字）：
> base form："used as the infinitive form, with to or without to" / "for the present simple"
> past form："used for the past simple"
> -ed form："used after auxiliary have and be"

同页例句：
> "Do you want to come with us?"
> "I can't leave now."

> **这四行就是 L203 / L204 全部教学内容的权威骨架**：三件外套各有各的岗位，`Don't` / `to` / `Did` 是 base form 的岗位，`yesterday` 是 past form 的岗位。**本批两课教的正是「岗位」，不是「新词」。**

### 4.4 `wears`（他/她/它版 -s）的权威根据——用于 L204 处理 L39 的冲突

URL：`https://dictionary.cambridge.org/grammar/british-grammar/present-simple-i-work`

逐字引用：
> "We use the base form of the verb, and add -s for the third person singular."

同页例句：
> "I, you, we, they ... work." / "she, he, it ... works."

> **用途**：L204 要正面回答「L39 为什么判 `wear` 错」。Cambridge 的这行说清了——`who` 替的是「他 / 她」，是「一个」，所以 `wears`。**这不是 `wear` 这个词的问题，是那个位置的身份问题**——正是 L202 处理 `drew` 冲突时的同一句话术。

### 4.5 **「过去式教得很透但原形没教」有没有跨源参考？——答案是「抓不到」，并说明原因**

**结论：抓不到。本批在剑桥 / 英国文化协会 / 牛津 / Grammarly / EF 五个源里都没有找到任何描述「学习者熟悉过去式但不熟悉原形」这一不对称现象的文字。**

我找到的**最接近**的一条是 Cambridge 的一条反面提醒：

URL：`https://dictionary.cambridge.org/grammar/british-grammar/infinitives-with-and-without-to`

逐字引用：
> "We don't use the to-infinitive after modal verbs"

同页纠正示例：
> "We might buy a new sofa."

> **但这条不是我要找的东西**：它讲的是「`to` 不定式 vs 光板不定式」的选择错误，**不是「过去式 vs 原形」的选择错误**。方向不对，不能当依据。

**为什么这个现象在权威源里不存在？——我的推断（明确标记为推断，不是引用）：**

主流的英语教学顺序是**先原形、后过去式**：原形在**第一课**就要用到（`I work` / `Do you work?` / `I want to work`），过去式要等到过去时单元才出现。所以「**熟悉过去式但不熟悉原形**」在标准教学序列里**不可能发生**——**这是本项目特有的产物**：

- 本项目 L197-L202 是**按「昨天版」组织**的系列（`thought/knew`、`swam/sang`、`sat/caught`、`felt/kept`、`slept`、`drew`），教学动线是**「讲故事」→ 需要过去式**；
- 于是出现了**倒序**：**过去式先教透，原形反而没有正面出场的机会**；
- `lose` / `break` / `wear` 三词更极端：它们的过去式/做过版从 L23 / L39 / L50 就反复出现，而原形**只在错句里出现**（见 ②2.3–2.5）。

**这个「抓不到」本身就是本批最有价值的结论之一**：它说明**这不是一个「业界已知该怎么补」的问题，而是一个「只有本项目的教学顺序才会产生、需要本项目自己定标准」的问题**。因此我**不建议**为它去找「外部权威做法」——该做的是**把本项目自己的规矩写清楚**（「原样站位」这条点位），而这恰好就是 L203 / L204 要做的事。

### 4.6 「抓不到」声明（明确记录，供后续批次不重复尝试）

| URL | 结果 |
|---|---|
| `https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/verbs` | HTTP **404**（该路径不存在；只剩导航链接） |
| `https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/verbs-tenses-and-clauses/verbs` | HTTP **404** |
| `https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/verb-forms` | HTTP **404** |
| `https://dictionary.cambridge.org/grammar/british-grammar/past-simple`（不带后缀） | 未试（已由 `past-simple-i-worked` 覆盖同一内容） |
| `https://www.englishclub.com/grammar/verbs-irregular.htm` | HTTP **403** Forbidden |
| `https://www.usingenglish.com/articles/irregular-verbs.html` | HTTP **403** Forbidden |
| `https://www.cambridge.org/elt/blog/2021/06/23/teaching-irregular-verbs/` | HTTP **403** Forbidden（想找「教学顺序」类文章失败） |
| `https://zhuanlan.zhihu.com/p/343227257` | HTTP **403** Forbidden |
| `https://www.yingyuw.cn/yingyufa/` | HTTP **404** |
| `https://www.51zxw.net/study.asp?vip=1` | 页面内容与主题无关（非语法页） |
| `https://www.hjenglish.com/yufa/` | 页面内容与主题无关（无 `动词原形` 用法讲解） |
| `https://en.wikipedia.org/wiki/Chinese_Learner_English_Corpus` | Connect Timeout（443，10s） |
| `https://www.perfect-english-grammar.com/irregular-verbs.html` | 可访问，但**只有动词表、无任何讲解文字**（不可引用） |
| `https://www.oxfordlearnersdictionaries.com/wordlists/oxford3000-5000` | 可访问但抓取内容**只覆盖 a–evoke**，不含 `lose`（已改用三个词条页单独确认等级） |
| Murphy《English Grammar in Use》双册 / Swan《Practical English Usage》 | **不可得**（上批已记录，本批未重试） |

> **中文侧的结论**：本批**未取得任何可引用的中文权威源**。三个尝试的中文站点分别返回 403 / 404 / 无关内容。**明确记录**：本批「中文母语者为什么会这么说」的成因分析（②2.6）是**基于项目内证据 + 三词在库内的错侧分布**得出的，**不是来自任何中文语法资料的引用**。

---

## ⑤ 自我核查记录（命令 + 口径 + 输出）

### 5.1 口径定义（**本批的核心纪律，先声明再引用**）

按任务书要求，**不使用 grep**（本地 grep 是 ugrep，会假返回 0），全部用 **node 词边界正则**：

```js
const mk = (w) => new RegExp('(?<![A-Za-z-])' + w + '(?![A-Za-z-])', 'gi');
```

**数据源 = 解析后的对象**（`new Function` 载入 `grammarLessons.ts` 与 `huntCases.ts`），**不读源码文本行**。共 **202 课 + 211 案 = 46745 个字符串字段**。

四个英文口径（逐项列举，可复算）：

| 口径 | 含义 | 包含字段 |
|---|---|---|
| **C1 正确句** | **只含用户看到的正确英文** | `targetSentence` · `dialogueEn` · `oneLineRule` · `blocks[].text` · `examples[].en` · `dialogue[].en` · `variants[].en` · `sceneSwings[].en` · `recall.answer` · `contrast[].correct` · `contrast[].wrong`（**仅 `bothRight` 双正解卡**）· `guided` 非 spot 题的 `answer`/`before`/`after` · `practice[].answer` |
| **C2** | C1 + **错侧** | `contrast[].wrong`（带 `wrongMark`）· `contrast[].wrongMark` · `guided[].options`（非答案项） |
| **C3** | C2 + **找错题词块 + 干扰项** | `guided[kind=spot].tokens` · `guided[kind=spot].wrongToken` · `practice[].distractors` |
| **C4 全英文** | C3 + `guided[kind=spot].answer` | ⬅ **这是任务书特别要求的「排除 spot 题 `answer`」的落地** |

> **⚠️ 口径要点**：`guided[kind=spot].answer` 字段的值就是**要用户点出的那个错词**（如 L23 的 `"break"`、L178 的 `"lose"`）。**若把它算进「正确句」，`break` / `lose` 的 C1 会假性变成非 0**——这正是任务书要求排除它的原因。本批 **C1 严格排除**它。

另设**中文散文口径**：`intentZh` / `sceneSetupZh` / `blocks[].role` / `examples[].zh` / `whyZh` / `explain` / `correctionZh` / `noteZh` / `summary.*` / `deepDive.*` 等（用于零术语巡检与「中文文案里怎么称呼这个词」的取证，**不计入「正确英文句」**）。

**案件部分另有独立口径**（案件不是课）：
- **token 正确侧** = `tokens[i]` 且 `i` **不在** `errors[].tokenIndex` 里
- **token 被判错** = `tokens[i]` 且 `i` **在** `errors[].tokenIndex` 里（**必须用 `tokenIndex` 判定**——`HuntError` 的字段是 `tokenIndex`/`original`/`correction`，**没有 `token` 字段**；用 `errors[].token` 会全部 `undefined`，把错侧误判成正确侧，这是本批踩到并修正的一个真实坑）
- **`correction` / `explanation`** = 案件**给用户的正确说法**，计入「正面」

### 5.2 输出 ①：任务书数字 vs 本次实测（**数字对不上，必须说清**）

**任务书原文**：「`lost` **50 处**」「`broke` **25 处**」。

**实测（202 课）**：

```
词形       C1正确句   C2+错侧   C3+框/干扰   C4全英文   中文散文
lost         55        63         63         63        32
broke        29        36         39         40        17
broken       38        39         39         39        28
```

**结论：`50` 与 `25` 在以下七种口径下均无法复现。**

| # | 口径 | `lost` | `broke` |
|---|---|---|---|
| ① | 全部正确句字段（= C1） | **55** | **29** |
| ② | 只卡片类（目标+例句+正解+变体+变奏） | 31 | 17 |
| ③ | 卡片去掉目标句 | 29 | 16 |
| ④ | 目标+例句+正解 | 24 | 12 |
| ⑤ | 例句+正解 | 22 | 11 |
| ⑥ | 只例句 | 7 | 2 |
| ⑦ | 只正解 | 15 | 9 |
| — | C1 + 中文散文 | 87 | — |
| — | C4 全英文 | 63 | 40 |

**我的判断**：`50` / `25` 可能是**估读**（任务书是在提出审计方向时写的，不是逐条查过的数），或用了某个**中间过程的计数**。**无论哪种，不影响本批结论**——因为本批的关键判据不是「教了多少次」，而是「**在正确位置出现过没有**」，而这个问题的答案是**唯一的 0**，在任何口径下都无法动摇：

```
lose   原形：C1=0  C2=6   C3=13  C4=14   中文散文=4   ← 正确句 0，错侧 14
break  原形：C1=0  C2=4   C3=8   C4=10   中文散文=6   ← 正确句 0，错侧 10
wear   原形：C1=0  C2=5   C3=5   C4=5    中文散文=1   ← 正确句 0，错侧 5
```

**任务书三处断言中，两处完全一致，一处需修正**：

| 任务书断言 | 实测 | 判定 |
|---|---|---|
| `lose` 原形在正确句 0 处 | C1=0 | ✅ **一致** |
| `break` 原形在正确句 0 处 | C1=0 | ✅ **一致** |
| `wear` 原形 0 / 过去式 0 | C1(wear)=0 · C1(wore)=0 · C1(worn)=0 | ✅ **一致**（但 `wore` 的细节需修正，见下） |
| ~~`wore` 全库 0 处~~ | **全库 2 处**，均在案件 `hunt-late-note` 的 `errors[1]` | ⚠️ **需修正为「课程正确句 0 处；全库仅 2 处，都在一个案件的答案与讲解里」** |

### 5.3 输出 ②：三词族的完整形态覆盖（**含此前无人登记的形式**）

```
词形          C1正确句  C2+错侧  C3+框/干扰  C4全英文   中文散文   C1课号
lose             0        6        13        14        4   []
loses            0        0         0         0        0   []        ← 全库 0 处
losing           0        0         0         0        0   []        ← 全库 0 处
lost            55       63        63        63       32   [23,24,50,123,153,178,185,188]
break            0        4         8        10        6   []
breaks           0        0         0         0        0   []        ← 全库 0 处
breaking         0        0         0         0        0   []        ← 全库 0 处
broke           29       36        39        40       17   [23,50,193,194]
broken          38       39        39        39       28   [23,50,51,52,53,54,193]
wear             0        5         5         5        1   []
wears           39       46        49        50       30   [39,40,41]
wearing          0        1         1         1        0   []        ← 仅 1 处，且是错侧（L39 replace 干扰项）
wore             0        0         0         0        0   []        ← 课程 0；案件 2
worn             0        0         0         0        0   []        ← 全库 0 处（任务书未登记）
```

**合并口径（课程 + 案件，「用户能看到这个形式吗」）**：

```
词形        正面字段数   被判错字段数   判定
lose             3          14        缺口（正面 3 处全在案件讲解散文里，无一句英文例句）
loses            0           0        全库 0
losing           0           0        全库 0
lost            62           9        教透 ✅
break            3           9        缺口（同 lose）
breaks           0           0        全库 0
breaking         0           0        全库 0
broke           32          13        教透 ✅
broken          52           1        教透 ✅
wear             0           6        双缺口
wears           43          12        教透（但他/她/它版，非原形）✅
wearing          0           1        全库近 0
wore             2           0        双缺口（2 处全在一个案件的 correction + explanation）
worn             0           0        全库 0（第三缺口）
```

**`lose` / `break` 的「正面 3 处」逐条（说明为什么仍算 0）**：

```
--- lose : 正面 3 处
     案件 hunt-lost-key     errors[0].explanation  :: "lose 的做过版是 lost——没有 losed 这个形状。"
     案件 hunt-question-words errors[1].correction :: "did you lose"
     案件 hunt-question-words errors[1].explanation :: "问过去的动作要请帮手 did：When did you lose it？动词穿回原样。"
--- break : 正面 3 处
     案件 hunt-lost-key      errors[3].explanation :: "have 后面站做过版：break 的做过版是 broken。"
     案件 hunt-broken-window errors[2].explanation :: "昨天版不能充数：穿做过版 broken——break → broke → broken，老词的三件外套别穿混。"
     案件 hunt-show-focus    errors[2].explanation :: "昨天版不能充数：was broken——break → broke → broken，老词三件外套别穿混。"
```

> **这三处都要读清**：它们全都是**讲「这个原形不该站在这里」**的**纠正文案**，而**不是**「这个原形站在这里是对的」的**示范句**。也就是说——**用户在全库范围内，从未读到过一句以 `lose` 或 `break` 的原形为正确用法的英文句子。** 这就是缺口的准确定义。

**`wore` 的 2 处逐条**：

```
--- wore : 正面 2 处
     案件 hunt-late-note errors[1].correction  :: "wore"
     案件 hunt-late-note errors[1].explanation :: "yesterday 说的是昨天的事，动词要换昨天版：wore。"
```

### 5.4 输出 ③：新课错句的**重复性**核查（含 token 拼接口径）

**方法**：把全库 **9762 条句子**（现成字符串 **46745 个字段** + **2055 条由 `tokens[]` 拼接还原的句子**）归一去标点小写后建索引，逐条比对。

> **为什么必须拼接 `tokens`**：`grammarLessons.test.ts` 的练习答案 `tokens` 与 `answer` 是两个字段。**若只比对现成字符串，会漏掉练习/找错题里以 token 形式存在的句子**——本批第一版检查就漏掉了 `I have break my cup.`（它在 L23 是以 `guided[3].tokens` 形式存在的），补上拼接后才抓到。

```
全库句子条目（含 token 拼接） = 9762，其中 token 拼接新增 2055 条
```

**逐条结果**：

| 拟用句子 | 判定 | 库内来源 |
|---|---|---|
| `I don't want to lose my key or break my cup.`（L203 目标句） | ✅ **全新** | — |
| `Don't lost your key.`（错①） | ✅ **全新** | — |
| `I don't want to broke my cup.`（错②） | ✅ **全新** | — |
| `Did you lost your key?`（错③） | ✅ **全新** | — |
| `I lose my key yesterday.`（错④备用） | ✅ **全新** | — |
| `Don't lose your key.`（正解①） | ✅ **全新** | — |
| `I have lost my key.`（双正解·回收 L23） | ⚠ **库内已有** | L23, L24, L50, L153, L178（+ 9 处 token 拼接） |
| `My cup was broken.`（双正解·回收 L50） | ⚠ **库内已有** | L50, L51, L52, L53, L54（+ 9 处 token 拼接） |
| `I broke my cup yesterday.`（双正解·回收 L23） | ⚠ **库内已有** | L23 |
| `I have break my cup.`（**禁用**） | ❌ **库内已有** | **L23 `guided[3].tokens`** |
| `I break my cup yesterday.`（**禁用**） | ❌ **库内已有** | **L23 `contrast[1]`** |
| `My cup was break.`（**禁用**） | ❌ **库内已有** | **L50 `contrast[0]` + `guided[3].tokens`** |
| `I have lose my key.`（**禁用**） | ❌ **库内已有** | **L23** |
| `I wore my new hat yesterday, and I want to wear it again today.`（L204 目标句） | ✅ **全新** | — |
| `I wore my new hat yesterday, so I want to wear it again.`（L204 备选） | ✅ **全新** | — |
| `I wore my new hat, but I want to wear my old one today.`（L204 备选） | ✅ **全新** | — |
| `I wore my new hat yesterday.`（正解①） | ✅ **全新** | — |
| `Did you wear your new hat?`（正解②） | ✅ **全新** | — |
| `I didn't wear my new hat yesterday.`（正解③） | ✅ **全新** | — |
| `I weared my new hat yesterday.`（错①） | ✅ **全新** | — |
| `I want to wore my new hat.`（错②） | ✅ **全新** | — |
| `Did you wore your new hat?`（错③） | ✅ **全新** | — |
| `He wear glasses.`（错备选，**机制重复，不建议**） | ✅ 句子全新 | 机制与 L39 / L41 重复（5 处） |
| `The boy who wear glasses is my brother.`（**禁用**） | ❌ **库内已有** | **L39** |
| `The boy who wears glasses is my brother.`（双正解·回收 L39） | ⚠ **库内已有** | L39, L40 |
| `It was cold yesterday, so I wear my coat.`（双正解·回收案件） | ✅ **全新**（案件 tokens 是 `It was cold yesterday, so I wear my coat.` 拆分形式） | 案件 `hunt-late-note` |

> **说明**：标 ⚠ 的是**有意引用的回收句**（对照卡双正解按约定引用锚点课原句），**不构成「内容重复」违规**；标 ❌ 的是**必须避免的逐字重复**——尤其 `I break my cup yesterday.` / `My cup was break.` / `He wear glasses.` / `The boy who wear glasses...` 四条，**它们是 `lose` / `break` / `wear` 的自然错句，凭直觉写就会撞上**。

### 5.5 输出 ④：全部闸门试算

```
=== L203 目标句 ===
  "I don't want to lose my key or break my cup."
     最长分句 = 11 词（L202=13，闸门允许 ≤18，跳变 -2）  ✅
     D 层未教词 = 无 ✅
     整句已在库 = 否 ✅（含 token 拼接口径）
     与库内句子重叠≥80% = 无 ✅

=== L204 目标句 ===
  "I wore my new hat yesterday, and I want to wear it again today."
     最长分句 = 14 词（L202=13，闸门允许 ≤18，跳变 +1）  ✅
     D 层未教词 = 无 ✅（wore 是本课自己要教的）
     整句已在库 = 否 ✅
     与库内句子重叠≥80% = 无 ✅
```

**每一项对应哪条守门**：

| 闸门 | 口径来源 | L203 | L204 |
|---|---|---|---|
| ① 星号（除 `deepDive` 外不得含 `**`） | `grammarLessons.test.ts:1039` | 文案不含 `**` ✅ | 同 ✅ |
| ② 语义守门 | `:985` / `:1161` / `:1178` | 「位置断言」类文案需与英文原句一致 | 同 |
| ③ 题干-答案一致性 | `:1089` | 题干不得出现答案外的数量/指示词 | 同 |
| ④ 重放题 | `:722` | 练段「同句同译」重放 ≤ 26 道（水位） | 同 |
| ⑤ C 层新句 | `:506` | 素材未饱和（展示句 < 10）的课须含 ≥1 道课内新句 | 同 |
| ⑥ 新句微调（重叠 < 80%） | `:585` / `:625` | 与库内句子重叠 ≥80% 的 = **0** ✅ | **0** ✅ |
| ⑦ 难度闸门（跳超 ≤ 5 词） | `:860` | **-2** ✅ | **+1** ✅ |
| ⑧ 零术语全字段遍历（29 词） | `:916` + `grammarZeroTerms.ts` | 见 5.6 ✅ | 同 ✅ |

**难度序列核对**：

```
末 8 课最长分句：L195=6 L196=6 L197=8 L198=8 L199=9 L200=10 L201=11 L202=13
新增：                                    L203=11（-2）  L204=14（+1）
```

**结构约定核对**：
```
全库对照卡张数分布：{"6": 202}      ← 202 课全部 6 张（测试未断言，但是全库一致约定）
全库 practice 题量：最少 4 / 最多 7
全库 guided 题量：全部 6 题（202 课一致）
```

### 5.6 输出 ⑤：零术语红线预检

`src/data/grammarZeroTerms.ts` 的 `GRAMMAR_ZERO_TERMS` 共 **29 个**红线词（已读源码逐项核对）：

```
主语 谓语 宾语 表语 定语 状语 单数 复数 三单 原形 时态
一般过去时 一般现在时 现在进行时 过去进行时 现在完成时
情态动词 比较级 最高级 从句 语序 可数
疑问句 否定句 被动语态 第三人称 形容词 副词 介词
```

**本批结论里「原形」这个词一律不用于用户可见文案**：报告内部（研究者之间）使用「原形」作为分析术语；**一旦落到课件文案，必须换成项目自建词**。本批两课的文案建议用词：

| 场景 | ✅ 用 | ❌ 不用 |
|---|---|---|
| 说「`Don't` 后面那个形式」 | **「穿回原样」/「原样」** | ~~原形~~ |
| 说「`lost` / `broke` 这个形式」 | **「昨天版」** | ~~过去式~~ |
| 说「`broken` / `worn` 这个形式」 | **「做过版」** | ~~过去分词~~ |
| 说「三个形式」 | **「三件外套」**（L21 / L50 已用的既有说法） | ~~三态~~ |
| 说「谁 / 他她它」 | **「句首那个「谁」」/「他/她/它版」** | ~~第三人称 / 三单~~ |

**`穿回原样` 在库内的既有分布（可安全沿用）**：

```
全库 27 处，分布课号 = {L10:2, L11:2, L24:1, L191:1, L192:2, L197:5, L198:4, L199:3, L200:3, L201:2, L202:2}
```

> **注意 `L24` 有 1 处**：说明「穿回原样」在**过去时系列的早期**（L24）就已开始使用，**不是 L197 系列的新造词**——L203 / L204 沿用它是**连续**的，不是新发明。

### 5.7 输出 ⑥：一个**机制性发现**——缺口为什么能活到今天

我照抄了 `grammarLessons.test.ts:437-478` 的 `buildPools()`，逐字复算，发现：

```js
// grammarLessons.test.ts buildPools() 原文（第 449-452 行）
for (const contrast of lesson.contrast ?? []) {
  addWord(contrast.correct);
  addWord(contrast.wrong);        // ← 错句也被当作「教过的词」
}
```

**因此**：

```
词     「教过」首见课(测试口径)    「在正确句出现过」首见课
lose              L23                   从未
lost              L23                   L23
break             L23                   从未
broke             L23                   L23
broken            L23                   L23
wear              L39                   从未
wears             L39                   L39
wore             从未                    从未
worn             从未                    从未
```

> **`lose` / `break` 在 L23 就被记为「已教」——但它们在 L23 只出现在错句 `I have lose my key.` / `I break my cup yesterday.` 里。`wear` 同理：L39 的 `The boy who wear glasses...` 把 `wear` 记为已教。**
>
> **这是本批最重要的机制结论**：D 层可抄率守门问的是「**这个词出现过吗**」，**不是**「**这个词在正确位置出现过吗**」。所以缺口**不会触发任何现有守门**，可以长期存在。
>
> **给后续批次的建议（不在本批范围，仅登记）**：可考虑增设一条守门——「对照卡错句里出现、而全库正确句里从未出现的**实词形**，必须登记或补课」。**本批已登记的名单**（全库只被错判、从未在正确句出现的**实词**）：`haves`、`eated`、`buyed`、`wills`、`cans`、`musts`、`beautifuller`、`gooder`、`hoter`、**`lose`**、**`break`**、`breaked`、`studys`、`goodest`、`closes`、`ones`、`thinks`、`say`、`coming`、**`wear`**、`buying`、`milks`、`traveling`、`staying`、`fastly`、`helping`、`putted`、`who's`、`during`、`ringing`、`ring`、`stops`、`geting`、`tiredly`、`greatly`、`goodly`、`coldly`、`leaves`、`knows`、`needs`、`others`、`peoples`、`waters`、`taking`、`id`、`catching`、`resting`、**`thinked`**、**`swimmed`**、**`sitted`**、**`catched`**、**`feeled`**、**`keeped`**、**`sleeped`**、**`drawed`**、`wore`（案件层）。
>
> **其中 `thinked` / `swimmed` / `sitted` / `catched` / `feeled` / `keeped` / `sleeped` / `drawed` 八个已被 L197-L202 补掉**（它们的正确形式已有正面句）；**`lose` / `break` / `wear` 三个是剩下里最值钱的**，本批即为它们立课。其余多为低频或已由其他形式覆盖（如 `closes`→`close`、`ones`→`one`、`knows`→`know`）。

### 5.8 输出 ⑦：季分组与时序的**两个硬约束**

**（a）季分组的「小季预算」已用满——必须改 `season-28` 而不是新建 `season-29`**

```
[各季课数]
season-6  = 3 课（47-49）   ← 小季 ①
season-12 = 3 课（76-78）   ← 小季 ②
season-19 = 3 课（125-127） ← 小季 ③
（其余 25 季均 ≥ 4 课）
```

`grammarSeasons.test.ts` 断言：

```js
const tiny = LESSON_GROUPS.filter((group) => group.max - group.min + 1 <= 3);
expect(tiny.length, `≤3 课的小季有 ${tiny.length} 个（上限 3）：…`).toBeLessThanOrEqual(3);
```

**当前 `tiny.length === 3`，已顶到上限**。所以：

| 方案 | 小季数 | 测试 | 结论 |
|---|---|---|---|
| 新建 `season-29`（203-204，2 课） | **4** | ❌ **判红** | **不可行** |
| 把 `season-28` 的 `max` 改 202 → 204（成 182-204，23 课） | 3 | ✅ 绿 | ✅ **推荐** |

**（b）案件层存在 95 处「答案形式晚于宿主课」的时序缺陷（`wore` 是其中之一）**

我做了全库扫描：把每个案件的**宿主课**（引用它的课的课号）与案件 `errors[].correction` 里各词的**首见课**比对，发现 **95 处**「纠正里含宿主课之前未教、或全库从未在正确句出现的词」。`wore` 是其中之一，但**不是最严重的**（如 `hunt-call-mother` 宿主 L1，纠正含 `is`（首见 L2）、`very`（首见 L14））。

> **建议（不在本批范围，仅登记）**：这 95 处**不应在本批一起修**（会变成 100+ 处散点修补的大工程，且多数只是「案件用词比课程稍早」的良性偏差）。**但 `wore` 这一处应当与 L204 一起处理**——因为 L204 正好要教 `wore`，顺手把 L20 案件里那个悬空的答案是**最经济的收口**。

### 5.9 输出 ⑧：场景使用统计（选场景的依据）

```
校园 campus     58 次   最后出现 L197
城市 city       39 次   最后出现 L192   ← L204 建议
火车 train       6 次   最后出现 L199
灯塔 lighthouse  2 次   最后出现 L193
沙漠 desert      1 次   最后出现 L186
太空 space       0 次   ← 从未使用
海洋 ocean       3 次   最后出现 L198
小岛 island      7 次   最后出现 L202
宅邸 mansion    65 次   最后出现 L201   ← L203 建议
森林 forest      3 次   最后出现 L187
雪地 snow        3 次   最后出现 L200
魔法 magic       2 次   最后出现 L45
悬疑 mystery     4 次   最后出现 L157
闪光 sparkle     9 次   最后出现 L137
```

`space` 到 L202 仍为 **0 次**，但**本批两课都不用**：两课的道具（钥匙/杯子、帽子）都是**日常物品**，「小美的一天」的连续剧基调需要**家 / 城市**这类日常场景；把日常道具放进太空会**打断基调**，也会让「戴新帽子出门」这种日常心理失去可信度。**沿用第 45 批对 `space` 的判断**——留着给真正需要它的课。

### 5.10 未能核实 / 无法核实的项

| 项 | 状态 |
|---|---|
| 任务书 `lost` 50 / `broke` 25 的原始口径 | **未能复现**（七种口径全试过，见 5.2） |
| 「过去式教透、原形没教」的跨源参考 | **抓不到**（五源全试，见 4.5 / 4.6） |
| 中文侧权威源 | **未取得**（三个站点全失败，见 4.6） |
| Murphy / Swan | **不可得**（上批记录，本批未重试） |
| `losing` / `breaks` / `loses` / `breaking` 是否构成真实缺口 | 全库 0 处，但判断为**低频、非缺口**（零基础日常不出现）——**未做实证验证**，属推断 |
| 新增课是否触发 `CAN_DO_MILESTONES` 等文案变更 | **未穷举**（本批范围外；仅 grep 确认无硬编码「202」/课数断言，见 3.7 #5） |

### 5.11 ⚠️ 自我更正记录（本批的一次实质纠错，以及一处**未解决的结论冲突**）

#### 更正一：我原判断「反向错法库内没有先例」是**错的**

**原表述**（见 2.6 原版）：「这条规矩库内教过（L32 的 `Don't close`、L15 的 `want to travel`），但那两课用的词原样和昨天版长得一样…用户学过规矩，只是从没在『两个形态明显不同』的词上练过。」

**触发更正的检索**：在核对「新课错句会不会与库内重复」时，我扩大了正则范围，把 `(will|did|didn't|don't|to|can|must|should)\s+(不规则昨天版)` 全库跑了一遍：

```
命中 6 处（4 处是真正的教学先例，2 处是 L202 对 L12 的回指）：
  L10  contrast[2].wrong  :: "I didn't went out."                        mark="went"
  L10  contrast[3].wrong  :: "Did you went yesterday?"                   mark="went"
  L12  contrast[1].wrong  :: "Tomorrow I will drew."                     mark="drew"
  L136 contrast[2].wrong  :: "I am looking forward to saw you."          mark="saw"
  L202 oneLineRule/deepDive/summary.points                               （回指 L12 的 drew）
```

**结论**：「原样槽不许穿昨天版」这条规矩**在 L10 / L12 / L136 有 4 张专门对照卡**，且 `whyZh` 写得极清楚（「didn't 一出场，动词就要打回原样」「will 出场时动词保持原样，不换昨天版」）。**我的原判断把它说轻了。**

**进一步更正**：我原来说「从没在形态明显不同的词上练过」也错。实测 `didn't` 已配 `go`/`swim`/`catch`/`feel`/`sleep`/`draw`，`will` 已配 `draw`/`go`/`swim`/`come`/`eat`，`to` 已配 `draw`/`swim`/`sleep`/`eat`/`know`/`catch`——**都是形态明显不同的词**。

**更正后的病因**（更准确，也更有说服力）：这三个词在库内的**全部**出场机会都被安排在「昨天版 / 做过版」槽位上，**在原样槽上出现 0 次**。缺的不是规矩，是**这三个词站在原样槽上的机会**。

**对结论的影响**：**不影响拆课方案，但显著改善文案策略**——新课可以**明确回指 L10 / L12**（「这就是第 10 课 `didn't went`、第 12 课 `will drew` 那条规矩，今天换 `lose` / `break`」），把新课定位成「**换词**」而不是「**换规矩**」。这对零基础用户是**负担更小**的教学路径，已写入 2.6。

#### ⚠️ 冲突二：**同一批的平行分析（竞析）对「`lose`/`break` 立课还是挂靠」给出了与我相反的结论**

本批期间，同项目的平行分析 `competitive-analysis-base-form-gaps-2026-09-22.md`（竞析）覆盖了**同一主题**，结论为：

> 「建议做 **1 课**（`wear → wore/worn`，L203）…明确**拒绝 `lose`/`break` 单独立课**，改为**挂靠 L23／L50 加对照卡**」（其 §① 结论 7、§7.1、§7.3）

这与我的结论（**2 课：L203 `lose`+`break`、L204 `wear`**）**直接冲突**。**我必须在报告里把冲突摊开，而不是各说各话。**

**竞析的三条理由 + 我的逐条回应**：

| # | 竞析的理由（§7.1） | 我的回应 |
|---|---|---|
| 1 | 「`lost` 教得极透（42 处 A1），用户对『丢失』这件事的表达**没有障碍**」 | **我同意前提，不同意推论。** 数据完全一致（我测 `lost` C1=55，竞析口径 A1=42，差在槽位归类），但「表达没障碍」恰恰是**问题所在**——用户**只会一个方向**（要穿昨天版时写 `lost`），而**原样槽上 0 次**。缺口不在「丢失」的概念，在**这个概念的另一个形态** |
| 2 | 「原形的正确用法只有一个高频场景（`I always lose my keys.`／`don't lose it`），**撑不起一课**」 | **这是最有分量的反对，我承认原方案在这个点上论证不足。** 但同时要说：我建议的 targetSentence（`I don't want to lose my key or break my cup.`）**把 `lose` 和 `break` 两个词合在一句**，正是为了绕开这个「单词撑不起一课」的问题——合课后一课的容量是**两个词 + 一条规矩**，不是单个词 |
| 3 | 「若为 `break` 单开一课，**会把『及物/不及物』这条线从 L50 拆散**」 | **同意，且这正是我选「合课」而不是「各自立课」的原因。** 我从未建议给 `break` 单开一课——我的方案是 `lose` + `break` **合一课**，此时 L50 的「谁当主角」线**原地不动**（新课只是回收它的原句做双正解） |
| 4 | 「`lose` 与 `break` 的原形误用**槽位不同**（`lose` 全在 `have/had+pp`；`break` 在 `have+pp`／`be+pp`／一般过去时各有），**合并讲不出同一条道理**」 | **⚠️ 这是我必须承认的、部分成立的最强反驳。** 我实测复现了槽位分布：`lose` 的 3 个错句**全部**是 `have/had + 原样`；`break` 的 5 个错句里 3 个是 `have`/`be + 原样`、1 个是 `yesterday + 原样`。**槽位确实不完全对齐。** 我的回应是：**新课的错句不取自这些旧槽位，而取自 `Don't`/`to`/`Did` 三个新槽位**（见 2.3 / 2.4）——**在那些新槽位上，两词的错法完全同构**。也就是说：**分歧的实质是「新课以哪个槽位为轴」**——竞析以「已有的错侧槽位」为轴（→ 不同构 → 拆/挂靠），我以「新课要教的原样槽位」为轴（→ 同构 → 合并）。**两种读法都成立，我把这个分歧原样交给产品决策** |

**我保留自己结论的理由（一句话）**：竞析推荐的「挂靠」方案里，其 §7.3 给出的落地形式是**在 L23／L50 加 `bothRight` 卡**（该机制 UI 已支持，边际成本低）。

**⚠️ 但我在这里先更正自己的一处误引**：我原写「L23 与 L50 都已经各含 5 张 `bothRight`-类卡」是**错的**，实测：

```
L23 共 6 张对照卡，其中 bothRight/无标记 = 0 张   ← 一个槽位都没占
L50 共 6 张对照卡，其中 bothRight/无标记 = 3 张
     · "My cup broken."        → "My cup was broken."
     · "Someone broke my cup." → "My cup was broken."
     · "I have broken my cup." → "My cup was broken."

全库 bothRight/无标记 张数分布：{0:23, 1:17, 2:18, 3:95, 4:38, 5:11}（平均 2.70 张）
```

**所以竞析的挂靠方案在 L23 上确实有 0 个正解槽位可用、在 L50 上还有 3 个位置**——**它的成本比我说得更低，我原来的反驳（「槽位已满」）站不住，予以撤回。**

**那么我保留自己结论的理由，收缩到只剩一条**：挂靠改的是**两课已上线的存量数据**（`grammarLessons.ts` 的 L23 / L50 对象），而新增两课**不动任何存量**。在「两种方案教学效果接近」的前提下，**我偏好改动面更小、回归风险更低的那一个**。**这是一条工程偏好，不是教学判断**——它的分量明显弱于我上面撤回的那条。

**因此我把立场调整为**：**这两个方案都可行，我倾向前者（立 2 课），但竞析的方案在教学上同样成立，且成本可能更低。这一条应当由产品决策者拍板，本报告不再单方面主张。**

#### 更正三：一处数字口径的差异（不影响结论）

竞析的 §2.0 把 `contrast[].wrong`（`bothRight=true`）单列为 A4 档（正确句），我把它直接计入 C1。**两者对「正确句」的认定其实是同一件事**（我按 `c.bothRight===true||c.wrongMark==null` 判为正确卡），只是**计数归类不同**——所以 `lost` 我报 55、竞析报 42（A1）/57（A 档合计）。**我的 55 落在竞析的 A1 与 A 档之间，差在 `guided[非spot].answer` 与 `practice[].answer` 是否计入**（竞析把 `practice[].answer` 归入 A1、`guided[].answer` 归入 A2；我把两者都归入 C1）。**这是口径命名差异，不是数据分歧**——两边的原始字段认定一致。

> **一个可写进后续批次的教训**：同一主题被两个平行分析同时覆盖时，**必须先对齐口径再各自下结论**。本批的对齐发生在收尾（彼此的成稿都已写出），**靠事后比对才发现分歧**。建议下一批在动工前先交换口径定义。

---

## ⑥ 不确定项

| # | 不确定项 | 把握度 | 说明 / 建议 |
|---|---|---|---|
| **0** | **⚠️ 与本批平行分析（竞析）的结论冲突：`lose`/`break` 该立课还是挂靠** | **低**（我主动降级） | 竞析主张**做 1 课（只做 `wear`）+ `lose`/`break` 挂靠 L23/L50**；我主张**做 2 课（L203 `lose`+`break`、L204 `wear`）**。**这是本批最大的分歧，且两边都有数据支撑。** 冲突全貌、双方理由与我的自我更正见 **⑤5.11**。**建议产品决策者拍板**；若选挂靠，按本报告 3.5 / 3.6 的对照卡与 targetSentence 设计需相应缩减为「L204 一课 + L23/L50 各加 1 张卡」 |
| 1 | **L203 目标句用 11 词还是 15 词** | **中** | 11 词（`...lose my key or break my cup.`）**教学更清晰**（一个句式说一次），15 词（`..., and I don't want to break my cup.`）**难度曲线更连续**（13→15 单调爬）。两者其余闸门全过。我倾向前者，但**这条是产品取舍，不是数据结论**——留给课程设计者定 |
| 2 | **`wear` 的一课是否装得下 2 个新点** | **中高** | 「单课 2-3 个新点」是历史水位（L197/198/199 各 2、L200 2、L201 1、L202 1），2 个点**在范围内**。但 `wear` 还要额外处理 L39 的冲突（对照卡第 4 张）、回收案件锚点（第 5 张），**内容密度会高于 L202**。若设计时发现挤不下，**备选是把 `wore` 挪到 L205**——但那会破坏「`wore` 与 `wear` 同台」这个最有价值的设计，**不建议** |
| 3 | **`worn` 是否真的可以不教** | **中** | 我的判断是「`have worn` 在零基础日常里频率极低」——但这是**基于项目 800 词表的推断，没有外部数据**（找不到「worn 在 A1-B1 语料里的频率」）。若产研认为「三件外套」的完整性比频率更重要（L21 / L50 的既有说法是「三件外套」），可在 L204 的 `summary` 里**一句话点名** `worn`，不做练习 |
| 4 | **`lose` / `break` 合课的「同构」判断** | **中高** | 我认为两词的缺口形状逐项对齐（见 3.2 表）。**但这是我的分析判断，不是数据事实**——数据只能证明「两词的原形正确句都是 0、错侧机制都是同一种」。若课程设计者认为「两个不同词义放在一课会让用户分心」，**拆两课也不算错**，只是要接受对照卡 `whyZh` 的重复 |
| 5 | **`I lose my key yesterday.` 该不该用** | **中** | 它是**表意正确、形态错位**的典型中式错法（也是任务书提示的方向），但**与 L23 已有的 `I break my cup yesterday.` 同构**。我用它做了备用（错④）。若希望新课**完全不复用 L23 的机制**，则不用它，只用 `Don't` / `to` / `Did` 三条 |
| 6 | **95 处案件时序缺陷要不要专项处理** | **中** | 我只实锤了 `wore` 这一处（因为它与本批正好同题，且宿主课 L20 比首见课 L39 早 19 课，伤害明确）。其余 94 处**未逐条评估严重度**——多数可能只是「案件用词比课程稍早几课」的良性偏差。**建议另立专项**，不要与本批合并 |
| 7 | **`season-28` 改 `max` 后的 `hint` 文案** | **中高** | 改 `max` 是**技术必做**（否则测试红）。但 `season-28` 的 `hint` 是**逐点位罗列**的长文本（末段是「…昨晚睡得好（sleep 变 slept）、画了条船贴在墙上（draw 变 drew，aw 换成 ew）」），追加 L203 / L204 的写法需要与既有文风一致，且**不得含 29 个红线词**。本批只提出**必要性**，不拟具体文案 |
| 8 | **`wore` 在 L204 之后是否还需在案件层回补** | **低** | 若 L204 上线并在 `summary` 里点名 `wore`，则 L20 案件那处悬空答案是**被后续课程接住**了（用户 L39 → L204 会补上）。**是否需要同时改 L20 案件的 `explanation`**（加一句「这个词以后会专门学」）**未评估**——取决于项目对「案件文案是否允许预告未来课」的惯例，本批未查证该惯例 |

---

## 附录 A：本批用到的核查脚本

| 脚本 | 用途 |
|---|---|
| `/tmp/load_lessons.cjs` | 载入 `grammarLessons.ts` 为对象（既有脚本，未改） |
| `/tmp/verify46_final.cjs` | **主脚本**：四口径计数（C1/C2/C3/C4）+ 中文散文口径 + 案件 token 正/错侧判定 + 结构性事实（表 1-8） |
| `/tmp/unified46.cjs` | 课程 + 案件**合并口径**（「这个词形在用户能看到的正确英文里出现过吗」） |
| `/tmp/cal46.cjs` | 口径定义的可复算版本 |
| `/tmp/cal46b.cjs` | 七种口径试算（用于判定任务书 50/25 无法复现）+ 拟用句子重复初检 |
| `/tmp/dup46.cjs` | **修正版查重**（含 `tokens[]` 拼接口径，9762 条句子） |
| `/tmp/prop46.cjs` | 拟用句子的逐条闸门核查（最长分句 / 未教词 / 重复） |
| `/tmp/mec46.cjs` | **机制核查**：照抄 `buildPools()` 复算「错句被算作教过」 |
| `/tmp/hunt46d.cjs` | 案件 token 正/错侧判定（用 `tokenIndex`，**修正了 `errors[].token` 的误用**） |
| `/tmp/seq46.cjs` / `/tmp/seq2.cjs` | 案件「答案形式晚于宿主课」的时序缺陷扫描（95 处） |
| `/tmp/out46.cjs` | 季分组「小季预算」核对 |

**运行命令**（只读，不改任何数据）：

```bash
node /tmp/verify46_final.cjs > /tmp/verify46_out.txt 2>&1
```

---

## 附录 B：与前一阶梯的衔接

| 课 | 主题 | 最长分句 | 与上一课的跳变 |
|---|---|---|---|
| L197 | `think` 变 `thought`、`know` 变 `knew` | 8 | — |
| L198 | `swim` 变 `swam`、`sing` 变 `sang` | 8 | 0 |
| L199 | `sit` 变 `sat`、`catch` 变 `caught` | 9 | +1 |
| L200 | `feel` 变 `felt`、`keep` 变 `kept` | 10 | +1 |
| L201 | `sleep` 变 `slept` | 11 | +1 |
| L202 | `draw` 变 `drew` | 13 | +2 |
| **L203（本批）** | **`lose` / `break` 的原形站位** | **11** | **-2** |
| **L204（本批）** | **`wear` 原形 + `wore`** | **14** | **+1**（承 L202 的 13） |

**L203 / L204 在系列里的位置**：L197-L202 六课都是**「昨天版」换零件**（`X 变 Y`）。**L203 是系列里的第一个「反向」课**——它不教新零件，教的是**「哪个位置该穿哪件外套」**。这个反转是有意的：系列做到第八课，用户手上已经有 `thought` / `knew` / `swam` / `sang` / `sat` / `caught` / `felt` / `kept` / `slept` / `drew` 十个昨天版，**此时正是最容易「过度使用昨天版」的时刻**——L203 在这个节点上把「原样也是有岗位的」说清楚，**时机正好**。

L204 回到系列的主形态（`wear 变 wore`），同时**收回 L20 案件那个悬空了 184 课的答案**，并**正面处理 L39 的判错冲突**——它同时是三件事的收口。
