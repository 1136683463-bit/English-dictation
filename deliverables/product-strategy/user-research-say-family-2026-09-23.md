# 瑞思 · 第 49 批用户研究与内容缺口分析：`say` 家族的形状不均衡

- **批次**：第 49 批（承第 48 批 `told` 收缩之后）
- **范围**：只做研究，**不改任何代码 / 数据**
- **本批主题**：`say`（原样）与 `said`（昨天版）的正侧各只有 2 / 1 处，而 `says` 有 21 处——这个不均衡**要不要处理**
- **核查脚本**：`/Users/liujun/Documents/英语听写/deliverables/product-strategy/working/say-family-audit-2026-09-23/s01–s23`（只读；**全部用 node 词边界正则**，**不用 grep**）
- **一键复现**：`bash /Users/liujun/Documents/英语听写/deliverables/product-strategy/working/say-family-audit-2026-09-23/RUN-ALL.sh`
- **日期**：2026-09-23

---

## ① 结论摘要

| # | 结论 | 把握度 |
|---|---|---|
| 1 | **`say`（原样）：不处理。** 它在库内**从未被要求产出、也从未被判错过一次**（正侧 2 处、错侧 0 处），且那 2 处都是 NPC 的功能性口令（`Say cheese!` / `Say it another way?`）。**没有入口，就没有伤害路径。** | 高 |
| 2 | **`said`（昨天版）：不立新课、不挂靠 L38；改为「登记 + 修一处既有缺陷」。** 本批**不建议为 `said` 增加任何新卡或新题**——理由不是缺口不够大，而是**加在 L38 会把一处已有的错误放大**（见第 4 条） | 高 |
| 3 | **⚠️ 本批推翻任务书的一处隐含前提**：`said` 的正侧不是「1 处」，而是**4 处**（含 `contrast[7]` 双正解卡里那句、案件 `hunt-weekend-note` 的一句、L105 的一句）。任务书的 1 是**课侧 + 排除 `bothRight.wrong`** 的口径——我**已精确复现该口径**（s17-B：say=2 / says=21 / said=1，与任务书逐字一致），但它不是「用户实际见到几句」 | 高 |
| 4 | **⚠️ 本批最重要的发现（优先项在此，不在立课）**：上批（批四十八）给 L38 新补的两张卡有一处**结构性缺陷**——`contrast[6]` 把 **`said` 划了删除线**（`wrongMark: "said"`，页面渲染为 `text-decoration: line-through`），而**同课 `contrast[7]` 恰好把含 `said` 的句子声明为正确**。两张卡在同一个屏幕上对同一个词给出**相反判定**。**这不是「缺口」，是已上线的自相矛盾。** | 高 |
| 5 | 更精确地说，`contrast[6]` 的缺陷是**两改动卡，划线与讲解指向不同改动点**：它到正确句需要两处改动（`said→says` **和** 插入 `to`），`wrongMark` 标在改动①（`said`）上，而 `whyZh` 讲的全是改动②（「要垫个小词 to」）。而 `whyZh` 自己承认 `said` 是正当的（`She said 【to】 me`）——**讲解在教 to，划线却在指控 said**。 | 高 |
| 6 | **同类卡全库只此一张的量级证据**：全库 93 张「补词型」卡里，有划线的 60 张**全部**把划线落在插入位置附近（右邻 28 / 左邻 17 / 跨邻词 10 / 被补词自身 3 / 别处 2）；**没有一张把划线落在「另一个与该补词无关的改动点」上**。按更宽的判据（「该补 to 但本卡 correct 也不含 to」= 类型乙），全库只有 **3 张**，L38 占其中 1 张。 | 高 |
| 7 | **`said` 的伤害路径与 `wore` 同构，但量级差 61 倍**：`wore` 在 L20 被要求答出、直到 L203 才见到正确用法（**gap=183**）；`said` 在 L21 被要求答出、**L24 就在案件 `hunt-weekend-note` 里见到正确用法（gap=3）**。按批四十六认定 `wore` 为「真实伤害」的**同一指标**，`said` 已在**可接受的承接距离内**（全库有限 gap 的中位数为 1，但 gap≤6 的仍有 10 条；`said` 位列第 15/29）。 | 高 |
| 8 | **`said` 在全库属于「认出即可」，不属于「必须产出」**：课程侧 `guided.answer` / `practice.answer` / `recall.answer` 含 `said` 的 = **0 处**；唯一要求它的地方是案件 `hunt-homework-note`（L21），而找错玩法（读 `GrammarHuntPage.tsx` + `huntService.judgeGuess`）是「点词 + 选罪名」，改正词由结算页**展示**给用户，**用户不需要手写或拼装** `said`。 | 高 |
| 9 | **`said` 若要教，归属是 L197–L204 那一族（`昨天版`），不是 L38**。「转述」在全库是**只有一课的 register**（L38 及其 L41 复现），把 `said` 绑上去是绑在单课结构上；而 `said` 与 `thought`/`knew`/`swam`/`sang`/`sat`/`caught`/`felt`/`kept`/`slept`/`drew`/`wore`/`gave` **结构同类**（不规则整体换形，课文模板一致）。但**现在不做**——这一族 12 个词的正侧都已 17–36 处，`said` 的正侧 4 处虽少，其 gap 已被 L24 案件接住，**紧迫性远低于第 4 条那处缺陷**。 | 中高 |
| 10 | 外部权威（⑤）：**Cambridge / Oxford / British Council / 中文侧 iciba 四源一致**——`say` 是 **A1**（Cambridge 词典逐字标 A1），`said` 是它的**不规则过去式**（Cambridge 逐字 `"The past simple of say is said, the past simple of tell is told"`），而**「转述」在 British Council 是 `Level: intermediate`**，远高于 `said` 的形状本身（`Level: beginner` 的不规则动词表）。**⇒ 形状教在初级档，转述教在中级档，两者在英文教学里是分开组织的。** 逐字引用见 ⑤。 | 高 |
| 11 | **「不做」是合法结论，本批必须登记**（与 `several`/`loud`/`careful`/`told` 同列）。但 `said` 的登记理由与 `told` **不同**：`told` 是**正侧 0 + 从未被要求**（整面墙没砌）；`said` 是**正侧 4 + 已被要求 + gap=3 已被接住**（墙砌了，只是砖少）。两者不能共用一句登记话术。 | 高 |

**最关键的一句话**：本批问的「不均衡要不要处理」，答案取决于**用哪个口径读「不均衡」**——按任务书的槽位口径是 2 : 21 : 1（悬殊），按**去重句子**口径是 **2 : 7 : 1**（`says` 的 21 个槽位其实只有 7 句不同的话，而其中 **14 个槽位是同一句 `She says she will come.`**，占 67%；18/21 落在 L38 一课内）。**去重后 `say`(2) / `says`(7) / `said`(1) 的差距并不构成一条需要新建立课或新加卡的缺口**——真正需要动手的是第 4 条那处**已上线的自相矛盾**。

**第二关键的一句**：上批补 L38 的方向是对的（「跟谁说」这一侧在库内确实零设防，Cambridge 逐字支持 `"Say does not take an indirect object"`），**但补出来的形态有问题**。本批与上批的区别在这里：**上批问的是「这一侧要不要设防」（答案是要），本批问的是「设防的形态对不对」（答案是不对）**——这是两个不同的问题，不是「又判了一次不处理」。

---

## ② 判定与理由

### 2.1 三个选项的正面评估

| 选项 | 评估 | 结论 |
|---|---|---|
| **(a) 不处理**（`say`） | ✅ 成立。`say` 正侧 2 处全为 NPC 口令，**错侧 0 处、从未被要求产出** | ✅ **选这个** |
| **(a) 不处理 + 登记**（`said`） | ✅ 成立。gap=3 已被 L24 案件接住；课程侧从不要求产出 `said` | ✅ **选这个** |
| **(b) 挂靠 L38**（加卡 / 加题） | ❌ **不建议**。L38 已有 **8 张卡**（全库最多，次高 L23/L50 各 7），且**已有的两张 `say + 人` 卡本身就带着缺陷**（第 4/5 条）。**在修好之前再加卡，是往一处自相矛盾的旁边继续堆料**。详见 2.4 的「边际教学价值」评估 | ❌ |
| **(c) 立新课**（教 `say`/`said` 的形状） | ❌ 三条否决：① `say` 正侧只有 2 处且全是 NPC 口令，撑不起一课；② `said` 的正侧 4 处、gap=3，缺口不紧迫；③ 若要立，归属是 L197–L204 那一族而非 L38（见 ④），但那一族 12 个词的正侧都已 17–36 处，`said` 是**唯一被案件提前接住**的一个 | ❌ |

### 2.2 「不处理」是合法结论，但 `said` 的登记话术**不能照抄 `told`**

本项目有成熟先例（`several`、`loud`/`careful`、`worn`/`losing`/`breaking`、`told`）。**但 `said` 与 `told` 的关键数字正相反，必须分开写：**

| | `told`（批四十八判「不做」） | `said`（本批） |
|---|---|---|
| 正侧（去重句子） | **0** | **3**（`She said to me she will come.` / `Your mom said no?` / 案件 `hunt-weekend-note` 的 `said`） |
| 是否被要求产出 | **从未**（`errors[].correction` 含 `told` = 0） | **1 处**（L21 案件 `say → said`） |
| 基础形是否「用户拥有」 | ❌ 用户角色 204 句 `me` 行里 `tell` 家族 = **0** | ✅ 用户已在 L7 见过 `Say cheese!`，L38 的 `She says…` 是自己的台词 |
| gap（被要求后多久见到正确用法） | 不适用（从未被要求） | **3**（L21 → L24 案件） |
| **登记理由** | **「整面墙还没砌」**——转述/询问整块 register 空白 | **「墙砌了，砖少，且已被接住」**——缺口存在但已闭合 |

**本批给 `said` 的登记理由（请照抄这句）：**

> `said` 的正侧以**去重句子**计为 3 处（含 L38 双正解卡与案件 `hunt-weekend-note`），已被 L21 案件要求产出一次，且其后的正确用法曝光在 **L24 就到位（gap=3）**——**缺口已闭合**。它不属于 `told` 那种「正侧 0 + 从未被要求」的未砌墙类别。**若将来要正式教 `said`，归属是 L197–L204「昨天版」那一族（不规则整体换形），不是 L38（转述）。**

### 2.3 与上批（批四十八）的区别——任务书要求说清

任务书问：「上批刚补过 L38，如果本批结论又是『不处理』，请说明这与上批的区别。」

**区别是「问题的两侧」不同，不是「同一个问题判了两次」：**

| | 上批（批四十八） | 本批（批四十九） |
|---|---|---|
| 问的是 | **「跟谁说」这一侧要不要设防** | **「形状」这一侧要不要处理**（`say`/`said` 正侧少） |
| 结论 | **要设防** → 补 2 张卡（`contrast[6]` 错卡 + `contrast[7]` 双正解卡） | **`say` 不处理；`said` 不新增，但上批补的那两张卡要修** |
| 依据 | Cambridge 逐字 `"Say does not take an indirect object"`；全库 `*say + 人` 错型 = 0 处 | 去重后 2:7:1、gap=3、课程侧从不要求产出 `said` |
| 产出 | 新增内容 | **不加内容，只修一处缺陷** |

**⇒ 上批是「补内容」，本批是「审上批补的内容」。两批不冲突，本批反而是上批的验收。**（诚实说明：我在 s21-A 用「划线落在改动点 A、讲解只讲改动点 B」的机械判据时，`contrast[6]` **没有**被判为错位——因为我的编辑距离回溯把它拆成了 `−said` 和 `me→says` 两个点，划线落在第一个点上，属「落在改动点上」。是 s23 换用「该补 to 但 correct 也不含 to」的判据后才把它单独抓出来。**这条判据是我本批新造的，不是项目既有守门**，所以它抓到的是「存量守门的盲区」，不是「上批写错了」——上批是在没有这条判据的情况下做的最好选择。）

### 2.4 「一张卡的边际教学价值」评估（任务书要求）——L38 已有 8 张，再加是否过多

**先说硬数字（s11-A/s11-C）：**

```
全库卡数分布：6 张 × 201 课  |  7 张 × 2 课  |  8 张 × 1 课
L38 = 8 张 = 全库唯一最高；次高 L23 / L50 各 7 张
grammarLessons.test.ts 的 35 条断言里【没有卡数上限】——加卡不被机械守门拦下
```

**⇒ 所以「过多」只能是教学判断，不能靠守门回答。我给的判断是：**

| 问题 | 回答 |
|---|---|
| L38 的 8 张卡**已经覆盖了什么**？ | 按 s02-A 逐张：①`will comes` ②`I think…not`（否定搬家）③`she come`（缺 will）④`She say`（-s）⑤`Do you think…comes` ⑥`will coming` ⑦`said me`（跟谁说）⑧`said to me`（双正解，跟谁说） |
| 8 张里**几只在讲同一件事**？ | **6 张（①②③④⑤⑥）都在讲「引子 + 原话照装」的各种变形**（will 后的动词形状 × 3、主句 -s × 1、否定搬家 × 1、疑问句 × 1）。**只有 2 张（⑦⑧）是上批新补的「跟谁说」** |
| 再加一张「形状」卡（`said`），边际价值？ | **接近 0，且为负。** 因为：① 形状侧已被 6 张覆盖；② `said` 的形状正确性**恰好被 `contrast[7]` 承认**，加卡只会让矛盾更响；③ L38 的 `targetSentence` 用的是 `says`（现在时转述），**`said` 是另一个时点**，塞进同一课会让学生以为「转述要分时态」——那不是 L38 的教学点（L38 的教学点是「原话照装」+「否定搬家」） |
| 那要不要**减**卡？ | **不建议在本批减。** 卡数不是缺陷；缺陷是 `contrast[6]` 的**划线位置**。最小改动即可 |

**⇒ 结论：不加卡、不加题；只修 `contrast[6]`。** 这与任务书的选项 (b) 形式相同（都在 L38 动手），但**性质相反**——(b) 是加，我建议的是**改**。

**⚠️ 附带更正：L38 的 `guided[0]` 让 `said` 收到第三条负面信号（观察项，本批不改）**

`guided[0]`（choose）题干「你想说：她说她会来。」渲染为 `[ ___ ] she will come.`，选项 `["She says","She say","She said"]`，答案 `"She says"`。**选 `"She said"` 会被判错**，拼出的句子是 `She said she will come.`。

按外部权威（OALD 引用 9 的 `say (that)…` 句型、例句 `"He said (that) his name was Sam."`），`She said she will come.` 是**完全合法**的英语——L38 判它错，是因为本课教学点是「转述要带引子 `She says`」。**这是有意的教学设计，不是缺陷。** 但它让 `said` 在本课又多了一处负面信号，所以 2.4 的「形状侧已被 6 张覆盖」这句要补一个限定：**那 6 张覆盖的是「引子 + 原话照装」的形状，而 `said` 在本课收到的 3 条信号里，有 2 条是负面的、且都指向「`said` 这个词不对」这个错误结论。**

**⇒ 我把它登记为观察项，不建议本批改动**（改动它会削弱 L38 的核心教学点）。**注意它与第 4 条的区别：`contrast[6]` 是「信号自相矛盾」（同课划掉又说对），`guided[0]` 是「信号单向下压」（把合法英文判错以突出教学点）——后者是可接受的教学习惯，前者不是。**

### 2.5 `say` 为什么真的不用管（三条独立证据）

1. **错侧 0 处**：全库 `say` 出现在错句里的 = **0**（s01 表 3）。对比：`said` 错侧 3 处、`says` 错侧 4 处。**用户从来没被要求把 `say` 判错。**
2. **从未被要求产出**：课程 `guided.answer` / `practice.answer` / `recall.answer` 含 `say` = **0**；案件 `errors[].correction` 含 `say` = **0**。
3. **那 2 处的角色是「口令」不是「教学对象」**：`L7.dialogue[1](npc) = "Say cheese!"`（拍照口令）、`L140.dialogue[0](npc) = "Say it another way?"`（换句话说说看）。两句都是 **NPC 递给用户的「话头」**，与上批查明的 5 处 `tell` 句（`Tell me about your X.`）**角色完全相同**。

**⇒ `say` 的正侧少不是缺口，是它的用法在库内本来就只承担「话头」功能。**

---

## ③ 具体方案与文案（修 `contrast[6]`，不改其他）

> ⚠️ 本节是**建议**，本批不改数据。三条改法按「最小改动 → 最完整」排列。

### 3.1 缺陷的精确结构（先说清，再给方案）

```
L38 contrast[6]
  wrong    = "She said me she will come."
  wrongMark= "said"          ← 页面渲染为删除线（GrammarLessonPage.tsx:247 textDecoration: line-through）
  correct  = "She says she will come."
  whyZh    = "「跟谁说」不能直接跟在 say 后面——say 后面只装「说的话」。要带上人，得垫个小词 to：
              She said 【to】 me（她跟我说）。中文「她跟我说」是一个词顺着说下来，英文这里要多个 to。"

到 correct 需要【两处】改动：
  改动①   said → says      （替换，下标 1）
  改动②   me 前插入 to     （补词，下标 2 之前）
划线标在 改动①，讲解讲的是 改动②。      ← 错位
同课 contrast[7]（双正解）的 wrong 字段装着 "She said to me she will come." 并声明它【正确】  ← 直接冲突
```

**渲染层面的后果**：用户在 `contrast[6]` 看到 `She ~~said~~ me she will come.`（`said` 被划掉）+「有问题的是这句」，在 `contrast[7]` 看到「两句都对」里包含 `She said to me she will come.`——**同一个 `said`，一处被划掉、一处被祝福**。

**外部权威支持哪一边**：Cambridge 逐字 `"The past simple of say is said, the past simple of tell is told"`——**`said` 本身完全正当**；错的是 `say` 后面直接跟人（`"Say does not take an indirect object. Instead, we use a phrase with to"`）。**⇒ 应当被指控的是「缺 to」，不是 `said`。**

### 3.2 改法 A（推荐 · 最小改动 · 只动一个字段）

```diff
  L38 contrast[6]:
-   wrongMark: "said",
+   wrongMark: "me",
```

**渲染结果**：`She said ~~me~~ she will come.`（划线落在 `me` 上）
**效果**：
- ✅ 不再指控 `said`，与 `contrast[7]` 的矛盾消除
- ✅ 划线仍是删除线，且在 `me` 上——直观表达「这个 `me` 放错了位置」
- ✅ 与讲解的落点距离最近（讲解说「要垫个小词 to」；`to` 正是要插在 `me` 前面的位置）
- ✅ 守门零风险：`wrong.includes("me")` 为真（渲染前置条件满足）；不触发星号/零术语/语义/难度任何一条

**残留不足（诚实标注）**：划线在 `me` 上、讲解在讲 `to`，仍不是完美对齐。但**它不再说错话**——这是本改法的关键区别。

### 3.3 改法 B（次选 · 整句卡）

```diff
  L38 contrast[6]:
-   wrongMark: "said",
+   wrongMark: null,
```

**渲染结果**：整句原样显示 + 页面自带的「缺了一块」提示（`GrammarLessonPage.tsx:343` 的 `lesson-contrast-hole`）
**依据**：全库 93 张补词型卡里有 **33 张**就是这么做的（s12-B「无划线」组，含 `L1[1] I Xiaomei.` / `L15[0] I want go home.` / `L29[0] I going to watch a movie.` 等）。
**效果**：矛盾消除；「缺了一块」的语义恰好就是「少了 to」——**这个改法在语义上其实比 A 更准**（少了东西 = 缺一块）。**若审阅者更看重「缺词型就用整句卡」的一贯性，B 优于 A。**

### 3.4 改法 C（最完整 · 同时收紧 `whyZh` 与补一张卡 · 工作量最大）

同时做三件事：

**① `wrongMark` 取 A 或 B**

**② `whyZh` 加一句把 `said` 摘出来**（草稿，已过零术语 + 星号预检，见 s11-E/s11-F）：

> 「跟谁说」不能直接跟在 say 后面——say 后面只装「说的话」。要带上人，得垫个小词 to：She said 【to】 me（她跟我说）。中文「她跟我说」是一个词顺着说下来，英文这里要多个 to。
> **这里要留意的是那个 `to`，不是 `said`——`said` 就是 say 的昨天版，本身没问题。**

**③（可选）补一张卡，把「to」这个特征放到正确侧展示**——因为**这是本课的真正盲区**（s23-A 的「类型乙」：讲解要求补 `to`，但两张卡的 `correct` 都是 `targetSentence`，**都不含 `to`**；本课唯一出现 `said to me` 的地方是 `contrast[7]` 的 `wrong` 字段）：

```
wrong  : "She said me she will come."        wrongMark: null
correct: "She said to me she will come."     ← 正确侧**含 to**，用户终于能看到补上 to 之后的样子
whyZh  : "补上 to 就对了：said 【to】 me。say 带人要先垫 to，再说「跟谁说」。"
```

**但注意**：这第 ③ 步**就是「往 8 张卡的课再加第 9 张」**，与本报告 2.4「不加卡」的结论冲突。**我的建议是：先做 ①②（修缺陷），第 ③ 步留到下一批单独评估**——理由是它需要重新计算 L38 的 6 张形状卡是否需要同比例精简，属结构性调整，不该和缺陷修复捆在一起做。

### 3.5 若审阅者仍决定走 (b)「挂靠加内容」——那加什么最好

如果产品侧坚持本批要往 L38 增内容，**按边际教学价值排序，我推荐的优先项不是 `said`，而是**：

| 优先 | 加什么 | 理由 |
|---|---|---|
| 1 | **把 `to` 放到正确侧**（即 3.4 第 ③ 步） | 这是 s23 查出的**唯一真实盲区**：本课教 to，两卡的正确侧都没有 to |
| 2 | `*say + 人` 的**第二例错卡**（换人换场景，如 `She said her mother she was tired.`） | 上批只补了 1 例，防错靠单例 |
| 3 | `*tell to + 人` 错卡（`She told to me she will come.`） | 上批路线图 §5 的携带项 5，与 `*say + 人` 成对 |
| — | **`said` 的形状卡** | **不推荐**（2.4 已述：形状侧已被 6 张覆盖，且与 `contrast[7]` 冲突） |

---

## ④ `said` 与 L197–L204 那一族的关系

### 4.1 结构同类性核查（s18-E）

| 词对 | 过去式正侧槽位（课侧口径） | 首次出现课时点 | 有专属课？ | 课程正侧**去重句数** |
|---|---|---|---|---|
| think → thought | 20 | L197 | 否（与 know 同课） | 4 |
| know → knew | 17 | L197 | 否（与 think 同课） | 3 |
| swim → swam | 18 | L198 | 是（L198，与 sing 同课） | 4 |
| sing → sang | 19 | L198 | 是（L198） | 3 |
| sit → sat | 18 | L199 | 是（L199，与 catch 同课） | 4 |
| catch → caught | 19 | L199 | 是（L199） | 3 |
| feel → felt | 36 | L200 | 是（L200，与 keep 同课） | 5 |
| keep → kept | 20 | L200 | 是（L200） | 4 |
| sleep → slept | 22 | L201 | 是（L201，单独一课） | 6 |
| draw → drew | 23 | L202 | 是（L202，单独一课） | 8 |
| wear → wore | 22 | L203 | 是（L203，单独一课） | 6 |
| give → gave | 22 | L204 | 是（L204，单独一课） | 6 |
| **say → said** | **（课侧 1；含案件/双正解 4）** | **L38 首次、L105 再现** | **否** | **1（课侧）** |

**⇒ 结构上完全同类**：`said` 是**不规则整体换形**（`say` → `said`，不是加 `-ed`），与 `thought`/`knew`/`swam`/…/`gave` 走同一条路。L197–L204 每一课的教学模板都是：

```
grammarLabel: 「昨天版 · X 变 Y」  +  targetSentence 里让 X 与 Y 同台
```

**⇒ 所以「该并入还是独立」的答案是：并入。** 若将来为 `said` 立课，形态应是 `L205 昨天版 · say 变 said`（难度闸门允许：L204 最长分句 12 词，新课可到 17 词），**而不是往 L38 加卡**。

### 4.2 但本批**不建议现在就并入**——三条理由

1. **`said` 是那一族里唯一已被案件提前接住的**：`wore` 的 gap=183（批四十六认定为真实伤害），`said` 的 gap=3。**同一个指标，一个触线一个不触线。**
2. **那一族的 12 个词正侧都已 17–36 处**，`said` 课侧 1 处（含案件与双正解 4 处）确实最少，但**少不等于缺**——它已有正侧曝光、已被案件要求、已被 L24 接住。
3. **L205 会新开一季**（末季 `season-28` 已收纳 182–204，范围写死在 `grammarSeasons.ts`）。新开季不是内容问题，是**季度规划决策**，应与其他候选（`wrote` / `spoke` / `taught` / `brought` / `sent` / `spent` / `paid` / `stood` / `built` / `held` / `rode` / `drove` / `flew` / `grew` / `began` / `chose` / `woke`，正侧全为 0）一起排序，**不该由 `said` 单独触发**。

### 4.3 与 `tell` / `told` 的关系（回答上批留下的线）

上批判 `told` 不做，给的理由是「整块转述 register 空白」。本批查明：

```
「转述」在全库只出现在 L38（grammarLabel / oneLineRule / deepDive[0] / contrast[0].whyZh）
              + L41 的 summary.points[2]（复现）
⇒ 这是一条【只有一课】的 register。
```

**⇒ 所以「教 `said`」若为了转述，会绑在一条单课 register 上（不划算）；若为了昨天版，则属 L197–L204。两条路都不指向 L38。** 这也从侧面支持上批「`told` 随转述整体立项」的判断——**但那个「整体立项」目前仍不存在，本批也没有创造它。**

---

## ⑤ 外部依据与逐字引用

### 5.1 可达性声明（实测，见 RUN-ALL.sh 末尾）

| 源 | 本机 curl | 结论 |
|---|---|---|
| Cambridge `grammar/british-grammar/say-or-tell` | **HTTP=200**（450,391 字节） | ✅ 抓到，逐字引用见 5.2 |
| Cambridge `dictionary/english/say` | **HTTP=200**（462,916 字节） | ✅ 抓到，见 5.3 |
| Cambridge `dictionary/english/said` | **HTTP=200**（294,911 字节） | ✅ 抓到，见 5.3 |
| Cambridge `dictionary/english/says` | HTTP=302（重定向，未跟随） | ⚠️ **抓不到**（词典无独立 `says` 词条，重定向回 `say`） |
| Oxford `definition/english/say_1` | **HTTP=200**（160,672 字节） | ✅ 抓到，见 5.4 |
| British Council `grammar/english-grammar-reference/irregular-verbs` | **HTTP=403**（本机 curl）/ **HTTP=000**（另一轮） | ⚠️ **本机 curl 抓不到**；经 WebFetch（服务端代取）**可读**，见 5.5 |
| British Council `grammar/english-grammar-reference/reported-speech` | **HTTP=403 / 000** | ⚠️ 同上，经 WebFetch 可读，见 5.5 |
| 中文侧 iciba `word?w=say` | **HTTP=200** | ✅ 抓到（经 WebFetch 读出词形变化行），见 5.6 |
| Murphy《English Grammar in Use》双册 / Swan《PEU》 | — | **不可得**（本批按任务书指示未重试） |

**方法学说明（重要）**：我最初把 HTML 直接 `split("\n")` 后按行 `indexOf` 匹配，导致 `"The past simple of say is said"` 等短语**假性未命中**（内联标签把一句话切成了多行）。**必须在原始 HTML 上做字符级定位、再局部剥标签**（脚本 `s04c`）。报告引用的 Cambridge 原文**全部以 `s04c` 的纯文本摘取为准**。

### 5.2 Cambridge《Say or tell》——逐字（`https://dictionary.cambridge.org/grammar/british-grammar/say-or-tell`）

**引用 1**（形状与不规则性，本批 `said` 归属的核心依据）：

> "Say and tell are irregular verbs. The past simple of say is said, the past simple of tell is told:"
> "They asked if I was looking for work and I said yes."
> "Then he told me how he had got the job by lying about his age."

**引用 2**（`say` 与 `tell` 的分工，**上批补 L38 的依据**）：

> "We use say and tell in different ways in reported speech. Say focuses on the words someone said and tell focuses more on the content or message of what someone said:"
> "‘Hello,’ she said."
> "Not: ‘Hello,’ she told."

**引用 3**（⭐ **本批修 `contrast[6]` 的直接依据**——错的是「缺 to」，不是 `said`）：

> "Say does not take an indirect object. Instead, we use a phrase with to:"
> "And then she said to me, ‘I’m your cousin. We’ve never met before.’"
> "Not: And then she said me …"

**引用 4**（Typical errors 段，与引用 3 同一处的独立表述）：

> "We don’t use an indirect object with say:"
> "‘I’m in a hurry,’ he said to me."
> "Not: … he said me."

**引用 5**（`tell` 侧，供 3.5 的推荐项 3 使用）：

> "Tell normally takes an indirect object (one or more people = io) and a direct object (the reported clause = do):"
> "The boy told [IO]us [DO]he didn’t want any money."

**关于本页的 `says`（用于「says 有没有独立权威表述」）**：本页纯文本中 **`"says"` 出现 0 次**（s04c 逐字 8）。**⇒ Cambridge 这页完全不涉及 `says`**——即 `says` 的第三人称形状没有独立的权威表述页，它只是 `say` 词条动词变位表的一格（见 5.3）。

**关于本页的 CEFR 等级**：本页正文 **不含任何等级标注**（`A1`/`A2`/`B1`/`Beginner`/`Intermediate` 在纯文本中出现 0 次，s04c 逐字 9）。**⇒ 等级不能从这页取，须另找（见 5.3 / 5.5）。**

### 5.3 Cambridge Dictionary 词条——逐字

**`https://dictionary.cambridge.org/dictionary/english/say`**（引用 6，**等级与变位**）：

> `said` | `said`
> **A1** [ T ]
> "to pronounce words or sounds, to express a thought, opinion, or suggestion, or to state a fact or instruction:"
> "Small children find it difficult to say long words."
> "She said goodbye" … "to all her friends and left."
> "Ben never forgets to say "Please" and "Thank you"."

⇒ **`say` 标 A1**（本项目等级的起点档），过去式 `said` 直接写在词头变位行。

**`https://dictionary.cambridge.org/dictionary/english/said`**（引用 7，**`said` 的身份**）：

> **Meaning of said in English**  ·  `said`  ·  verb  ·  uk  `/sed/`  ·  us  `/sed/`
> "past simple and past participle of"
> "say"

⇒ **`said` 不是一个独立词条内容，它就是 `say` 的过去式/过去分词**——这直接支持「`said` 的形状属 `say` 家族、应在教 `say`（或其过去版）时一并处理」。

### 5.4 Oxford Learner's Dictionaries——逐字（`https://www.oxfordlearnersdictionaries.com/definition/english/say_1`）

**引用 8**（⭐ **动词变位表，`says` 的位置**）：

> `say` verb  `/seɪ/` `/seɪ/`
> **Verb Forms**
> present simple I / you / we / they  **say**  `/seɪ/` `/seɪ/`
> he / she / it  **says**  `/sez/` `/sez/`
> past simple  **said**  `/sed/` `/sed/`
> past participle  **said**  `/sed/` `/sed/`
> -ing form  **saying**  `/ˈseɪɪŋ/` `/ˈseɪɪŋ/`

⇒ **三个形状（`say` / `says` / `said`）在权威源里是同一张变位表的三格，同时列出、不分课。** 这支持「不宜把 `says` 单独立为 21 处的大族、把 `say`/`said` 视为缺口的读法」——它们在权威描述里是同一条目。

**引用 9**（⭐ **`say something to somebody` 句型，与 L38 修法直接对应**）：

> **say something to somebody**
> "She said nothing to me about it."
> **say to somebody/yourself + speech**
> "I said to myself"  (= thought)  ", ‘That can't be right!’"
> **say (that)…**
> "He said (that) his name was Sam."

**引用 10**（`Which Word? say / tell` 注框——上批路线图 §5 已引，本批独立复核确认存在）：

> **Which Word? say / tell**
> "Say never has a person as the object. You say something or say something to somebody."
> "Say is often used when you are giving somebody's exact words:"

⇒ **OALD 与 Cambridge 在这一点上完全一致**：`say` 的宾语**不是人**；带人必须走 `say something to somebody`。

### 5.5 British Council LearnEnglish Grammar——逐字（**本机 curl 抓不到，经 WebFetch 服务端代取**）

**`https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/irregular-verbs`**

**引用 11**（**等级**）：

> **Level: beginner**

（该页把 `say` 排在不规则动词表内；页面前言为 "Most verbs have a past tense and past participle with –ed." / "But many of the most frequent verbs are irregular:"；表格里 `say` 一行对应 base / past / past participle = `say` / `said` / `said`。）

**`https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/reported-speech`**

**引用 12**（⭐⭐ **本批最有组织意义的一条：转述的等级**）：

> **Level: intermediate**

> "When we want to report what people say, we use reporting verbs."

> "John said he'd stayed at the Shangri-la because it's the best hotel in town."

**⇒ 这条把「形状」与「转述」在英文教学里的等级差钉死了：**
- `said` 作为一个**形状**，出现在 **beginner** 档的不规则动词表里；
- **转述**（reported speech）作为一个**知识点**，British Council 标 **intermediate**。

**⇒ 所以英文教学里这两件事是分开组织的**：形状在初级、转述在中级。本项目的 L38 教的是**转述**（`grammarLabel: 话中话 · 转述别人的话`），却用 `says` 做 `targetSentence`——**转述里用现在时转述是合法的**（Cambridge 引用 2 的 `‘Hello,’ she said.` 与 BC 的 `John said he'd stayed…` 都用过去），**但本项目把「转述」放在 L38（第 38 课）而不是最后**，这本身是课程排序决策，不是本批的议题。本批只需指出：**`said` 的形状属 beginner 档、可与其它不规则过去式同族处理；转述属 intermediate 档、是 L38 的事。两者不该混在同一张卡上互相指控。**

### 5.6 中文侧——逐字（`https://www.iciba.com/word?w=say`，curl HTTP=200，经 WebFetch 读出）

**引用 13**：

> `vt.` 表明; 念; 说明; 比方说
> `vi.` 说， 讲; 表明，宣称; 假设; 约莫
> **第三人称单数: says; 过去式: said; 过去分词: said; 现在分词: saying;**

⇒ 与 OALD 引用 8 完全一致：**三形状同表列出**。中文侧同样不把 `say`/`says`/`said` 分家。

### 5.7 外部依据对本批三条结论的支持关系（汇总）

| 本批结论 | 支持它的逐字引用 |
|---|---|
| `say`/`says`/`said` 是**同一变位表的三格**，不宜把 `says` 读成「正例」，把 `say`/`said` 读成「缺口」 | 引用 8（OALD 变位表）、引用 13（iciba 词形变化行） |
| `said` 是完全正当的过去式——**不该被划掉** | 引用 1（`"The past simple of say is said"`）、引用 7（`said` = `"past simple and past participle of say"`） |
| L38 `contrast[6]` 该指控的是**缺 to**，不是 `said` | 引用 3（`"Say does not take an indirect object. Instead, we use a phrase with to"` + `"Not: And then she said me …"`）、引用 4（`"We don’t use an indirect object with say"` + `"Not: … he said me."`）、引用 9（`say something to somebody` / `"She said nothing to me about it."`）、引用 10（`"Say never has a person as the object."`） |
| 形状（初）与转述（中）在英文教学里分开组织 ⇒ `said` 归 L197–L204 一族、不归 L38 | 引用 11（`Level: beginner` 的不规则动词表）、引用 12（`Level: intermediate` 的 reported speech）、引用 6（`say` = A1） |

---

## ⑥ 自我核查记录

### 6.1 口径声明（任务书硬要求）

**全部词形计数一律用 node 词边界正则**，**刻意不用 `grep`**（本机 grep 是 ugrep，对这类模式会假返回 0）：

```js
const rx = (f) => new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i");
```

**并且所有脚本经 `vite-node` 载入真实数据模块**（`src/data/grammarLessons.ts`、`src/data/huntCases.ts`），拿到的是**运行时对象**——不是在 .ts 源码文本上扫描，因此不存在「扫到注释 / 类型定义 / 变量名」的污染。这比文本扫描更强。

**四口径阶梯**（s01 表 1 逐级输出）：

| 口径 | 定义 |
|---|---|
| **V0 原始扫描** | 课程对象**所有**字符串字段（含 `id`/`scene`/`cover`/`episode`/`grammarLabel`/`title`） |
| **V1 内容字段** | V0 剔除上述 6 个元数据槽 |
| **V2 正错二分** | V1 拆成 正侧（A1 正句 / A2 答案 / A3 replaceBase / A4 bothRight.wrong）与 错侧（W） |
| **V3 权威口径** | V2 剔除 **①** `guided[kind=spot].answer`（= `wrongToken`，是让用户点出的**错词**）**②** `contrast[].wrong` 且 `bothRight===true`（该字段装的是**正确句**） |

**任务书要求排除的两类，逐条说明我怎么做：**

① **spot 题的 `answer`**——数据层里 `guided[kind=spot].answer === wrongToken`（`types.ts` 注释：「spot：藏了问题的那个词块（命中即通过）」）。我在 V3 口径里把它**计入错侧但不计入正侧**，并在表 4 里**原样列出被剔除的条目**供复核。
② **`bothRight: true` 卡的 `wrong` 字段**——`types.ts` 批四十七注释逐字：「`bothRight: true` + `wrongMark` 无值：498 张（**双正解卡**——注意它的 `wrong` 字段装的是**正确句**）」。我把它**计入正侧**（A4），并在表 4 里标注「`bothRight.wrong(已入A4)`」。

**⇒ 这两条是本报告全部数字的地基；下面 6.2 给出「换口径数字会怎么变」。**

### 6.2 与任务书数字的逐项对账（s17 / s18）

**任务书给的数**：`say` 正侧 **2**、`says` 正侧 **21**、`said` 正侧 **1**。

**我复现了该口径**（s17-A / s18-A 的逐槽位分解）：

| 形式 | 逐槽位分解 | 槽位合计 | 排 `blocks` + `guided.tokens` + `guided.options(=答案)` + `bothRight.wrong` |
|---|---|---|---|
| `say` | `dialogue`=2 | 2 | **2** |
| `says` | `targetSentence`1 + `dialogue`2 + `examples`4 + `variants`1 + `sceneSwings`2 + `contrast.correct`6 + `guided.answer`2 + `guided.tokens`1 + `guided.options(=答案)`1 + `practice.answer`2 + `recall.answer`1 + `blocks`1 | 24 | **21** |
| `said` | `dialogue`1 + `bothRight.wrong`1 | 2 | **1** |

**⇒ ✅ 与任务书逐字一致（say=2 / says=21 / said=1）。** 该口径 = **只算课侧 + 只算正侧 + 排除 `blocks`/`guided.tokens`/`guided.options(=答案)`/`bothRight.wrong`**。

**⚠️ 但这个口径有一个副作用必须点明**：它排除了 `bothRight.wrong`，而**该字段装的是正确句**——所以它把 L38 `she said to me she will come.` 这句**正确句**排除在 `said` 的正侧之外，这正是 `said` 只剩 1 处的原因。（s17-A 的注释行也显示了：`said` 「若只排除前三项、保留 bothRightWrong → 2」。）

**换口径数字会怎么变**（s14-A / s16-C，供复核）：

| 口径 | `say` 正 | `says` 正 | `said` 正 |
|---|---|---|---|
| 任务书口径（课侧，排 blocks/tokens/options/bothRightWrong） | 2 | **21** | **1** |
| 课侧，含 `bothRight.wrong` | 2 | 24 | 2 |
| 课侧 + 案件侧，排 spot.answer 与 bothRight.wrong | 2 | 27 | **3** |
| 课侧 + 案件侧，含 bothRight.wrong 与 spot 修正 | 2 | 27 | 4 |

### 6.3 ⭐ 去重句子计数（s14-B / s18-B）——本批「不均衡」的真正规模

槽位计数会把**同一句话**写进十几个字段，于是「一句」被记成「十几处」。去重后：

| 形式 | 正句 | 错句 | 槽位/正句 倍率 |
|---|---|---|---|
| `say` | **2** | 4 | 1.0× |
| `says` | **7** | 3 | 2.9× |
| `said` | **3** | 4 | 1.3× |
| （对照）`thought` | 5 | 3 | 4.8× |
| （对照）`wore` | 6 | 2 | 4.5× |

**`says` 的 21 个正侧槽位 = 7 句不同的话：**

```
14 × "she says she will come"        ← 一句占 67%（14/21）
 2 × "she says she likes the book which i read"   （L41）
 1 × "she says she is busy"           （L38）
 1 × "she says she will run"          （L38）
 1 × "she says"                       （L38.blocks + guided[0].answer）
 1 × "she says she is going to run"   （L38.practice[2]）
 1 × "the clock says eight"           （L181，且这里是「表盘显示」不是「说」）
```

**⇒ 定位：21 个槽位里 18 个（86%）落在 L38 一课，14 个（67%）是同一句。**

**`said` 的 3 个正句：**

```
"she said to me she will come"   ← L38.contrast[7].wrong（双正解卡，该字段装正确句）
"your mom said no"               ← L105.dialogue[1](npc)
"said"                           ← 案 hunt-weekend-note.tokens[31]（正确用法）
```

### 6.4 时序（gap）核查（s13 / s15-C）——判定伤害路径的核心指标

**定义**（对批四十六「`wore` 有真实伤害」那条论证的量化）：

```
seenTimeline(F)   = F 以【正确用法】出现的全部时点
                    · 课程：正侧槽位（含 bothRight.wrong）
                    · 案件：tokens 里【未被 errors 指向】的 F
                    ⚠️【不含】errors[].correction —— 那是「被要求」本身，不是曝光
demandTimeline(F) = errors[].correction 含 F 的时点（用户被要求找出/改出 F）
时点              = 解锁课号（案件按引用课最小课号；番外案按 12 —— R01 课程锁）
gap(F)            = demand 之后【首次】见到正确用法 − demand 时点；∞ = 其后从未
```

**结果（s13-B / s15-C 摘要）**：

```
wear → wore    被要求 @L20（hunt-late-note：wear→wore）  其后首次见到 @L203   gap = 183   ← 批四十六判「真实伤害」
say  → said    被要求 @L21（hunt-homework-note：say→said）其后首次见到 @L24    gap = 3     ← 本批
tell → told    从未被要求                                 从未                —           ← 批四十八判「不做」
```

**全库排序（gap 由小到大，前 20 条）**：

```
  1  go→went 1 | feel→felt 1 | keep→kept 1 | do→done 1 | call→called 1 | put→put 1 | lose→lost 1 | clean→cleaned 1
  2  eat→ate 2 | get→got 2 | swim→swam 2 | see→seen 2
  3  have→had 3 | say→said 3 | eat→eaten 3 | finish→finished 3
  4  be→was 4
  5  sit→sat 5 | catch→caught 5 | stay→stayed 5
  6  make→made 6
 12  see→saw 12
 16  do→did 16
 27  break→broken 27
 67  help→helped 67
183  wear→wore 183
  ∞  think→thought（被要求后从未再以正确用法出现）
```

**⇒ `said`（gap=3）与 `wore`（gap=183）相差 61 倍。** 有限 gap 共 27 条，`said` 排在第 15 位（越小越好），**处于中位区**（有限 gap 的中位数 = 1，但 gap≤3 的也有 12 条，gap>3 的有 15 条）。

**⚠️ 我修正了自己的一处口径 bug（诚实记录）**：s06 的 v1 版本我把 `errors[].correction` 也当成「曝光」，于是得出「`said` 首次见过 @L21」——那正是「被要求」本身，属**循环论证**。s08 修正为「曝光不含 correction」后，`said` 的真实首次正确用法曝光是 **L24 案件**（不是 L21）。

### 6.5 `said` 是否被要求「产出/拼装」（s18-C，读源码非猜测）

```
课程侧 guided[].answer / practice[].answer / recall.answer 含 said = 0 处
案件侧 errors[].correction 含 said = 1 处（hunt-homework-note @L21：say → said）
```

**玩法核查**（读 `src/pages/GrammarHuntPage.tsx` + `src/services/huntService.ts`）：

- `judgeGuess(caseItem, tokenIndex, guessedTag, found)` → 用户**点一个 token + 选一个罪名**，返回 `hit` / `wrongTag` / `notError`
- 结算页（`GrammarHuntPage.tsx:~731`）逐条渲染 `error.original` → `error.correction` + `explanation`
- `pickCorrectionWord(correction)` 取改正词进错词本（`"say" → "said"` ⇒ 收录 `"said"`）

**⇒ 用户不需要手写或拼装改正词——它是被**展示**的。** 所以 `said` 在全库属于「**认出即可 / 答案被展示**」，不属于「必须产出」。

### 6.6 L38 `contrast[6]` 缺陷的三条独立机械核查

| 核查 | 脚本 | 输出 |
|---|---|---|
| **① 渲染层**：`wrongMark` 被渲染为删除线 | 读 `GrammarLessonPage.tsx:247` | `<span className="lesson-contrast-mark" style={{ textDecoration: "line-through" }}>{mark}</span>` ⇒ 用户看到 `She ~~said~~ me she will come.` |
| **② 同课冲突**：`said` 在同课被划掉又被祝福 | `s09-B` / `s12-D` | `contrast[6].wrongMark = "said"`（划线）vs `contrast[7].wrong = "She said to me she will come."` + `bothRight: true`（祝福）；另有 `guided[0].options` 把 `"She said"` 当干扰项 |
| **③ 编辑结构**：两改动卡，划线与讲解指向不同改动点 | `s19-B` / `s23-A` | 到 correct 需 `said→says`（替换）+ 插入 `to`（补词）；`wrongMark` 标在前者，`whyZh` 讲后者 |
| **④ 存量惯例**：补词型卡的划线落点 | `s12-B` / `s19-A` | 93 张补词型卡，有划线的 60 张**全部**落在插入位置附近（右邻 28 / 左邻 17 / 跨邻词 10 / 被补词自身 3 / 别处 2）；**无一张落在「与该补词无关的改动点」上** |
| **⑤ 性质确认**：教的特征在正确侧缺席 | `s23-A`（类型乙） | 全库「讲解要求补 `to` 但本卡 `correct` 也不含 `to`」= **3 张**（L38[6]、L52[1]、L74[3]）；L38 占 1 张 |

**⚠️ 我在此**撤回**一条过强的表述（诚实记录）**：s20 我一度想主张「`contrast[6]` 的划线不在任何改动点上」，实测**不成立**——`said` 确实落在改动点 `said→says` 上。**能成立的精确表述只有：划线落在改动点①，讲解讲的是改动点②，而改动①（`said→says`）恰好与同课 `contrast[7]` 的祝福相反。** s21-A 用「X 划线点 vs Y 讲解点」的机械判据时，`contrast[6]` **没有**被判为错位（因为我的编辑距离回溯把它拆成 `−said` 与 `me→says` 两点，划线落在第一点上）。**所以这是一条我本批新造的判据（s23 类型乙）抓到的存量守门盲区，不是上批「写错了」。**

### 6.7 守门影响预演（s11，若选 (b) 挂靠）

| 守门 | 对「L38 加一张卡 / 一道题」的反应 |
|---|---|
| ① 星号（除 deepDive 外不得含 `**`） | 候选文案预检 **全部干净**（s11-F） |
| ② 语义守门（位置断言 / 句首 / 句尾） | 候选文案不含位置断言，不受影响 |
| ③ 题干-答案一致性 | 候选题若用 `said`，需确保题干不出现「两个 / 那些」这类数量线索（当前 0 风险） |
| ④ 重放题（上限 26 道） | L38 现状：`practice[0]`=A 层、`[1]`=B 层、`[2]`=C 层、`[3]`=B 层；加 1 道 C 层不推高水位 |
| ⑤ C 层新句（素材未饱和的课须含 ≥1 道） | L38 `exhibitCount = 9`（<10 ⇒ **不豁免**），已有 1 道 C 层（`She says she is going to run.`）⇒ 满足 |
| ⑥ 新句微调（Jaccard < 0.8） | 若新题与 `She says she will come.` 只换一个词，会**触发**；须换掉核心成分（主语/动词/场景） |
| ⑦ 难度闸门（相邻课最长分句不跳超 5 词） | L37=6 → L38=5 → L39=8；**加卡不影响**（只看 `targetSentence`） |
| ⑧ 零术语（全字段遍历） | 候选文案用项目自建词汇（「昨天版」），预检**干净**（s11-E，用项目自己的 `findZeroTermHits`） |

**⇒ 机械守门**不拦**加卡；「不加卡」是本报告**教学判断**的结论，不是守门结论。这一点必须说清，以免下批误以为有守门在挡。**

**回归证明（RUN-ALL.sh 末尾）**：

```
✓ src/data/grammarLessons.test.ts (35 tests)   ← 含 8 项内容守门中的 7 项 + 零术语遍历
✓ src/services/huntService.test.ts (31 tests)
Test Files  2 passed (2)   Tests  66 passed (66)
```

### 6.8 全库规模基线（供后续批次对账）

```
grammarLessons = 204 课        huntCases = 213 案        季分组 = 28 季
对照卡总数 = 1228（错卡标词 674 / 错卡整句 52 / 双正解 502）
卡数分布：6张×201课  7张×2课(L23,L50)  8张×1课(L38)
dialogue 行：me 204 行 / npc 408 行
案件：番外案（无课引用）5 案；其余 208 案按引用课解锁（R01）
say 家族落课：L7 L38 L41 L105 L136 L137 L138 L140 L181（共 9 课）
```

---

## ⑦ 不确定项

| # | 不确定的事 | 影响 | 我建议怎么解 |
|---|---|---|---|
| 1 | **`contrast[6]` 到底该按「缺陷」修，还是按「有意的设计」保留？** 我有 90% 把握认为 `wrongMark: "said"` 是**疏忽**（因为 `whyZh` 一个字没讲 said 的形状，而上批作者在同一批里明确写了 `said to me` 是对的）。但我**无法排除**一种可能：作者有意用「划掉 said」来提示「换成 says」这条**时点**信息（L38 的 target 是现在时转述 `says`，而 `said` 是昨天版）。 | 高——若属实，我的核心建议会变成过度修正 | **请产品/内容侧确认上批补卡时的意图。** 若作者确认「有意划 said」，则本报告第 4/5 条降级为「登记观察项」；我建议**至少要加一句 `whyZh` 把 `said` 摘出来**（3.4 第 ② 步），因为无论意图如何，「同课一处划掉、一处祝福」都是用户会看到的矛盾 |
| 2 | **`she said she will come.`（无 `to me`）在英语里到底能不能说？** `guided[0]` 把 `"She said"` 当**干扰项**判错，但 `She said she will come.` 在英语里**完全合法**（`say (that)…`，OALD 引用 9 有 `"He said (that) his name was Sam."`）。我推测 L38 的本意是「本课要教的是**转述他人**，所以必须有引子 `She says`」，但**机械上它确实把一句合法英文判成了错**。 | 中——涉及 `guided[0]` 是否也该修 | 这与本批主题（`say` 家族的形状）不同，属「干扰项设计」问题。**我建议单独登记**，不在本批处理**（详见 2.4 末的「附带更正」）。 |
| 3 | **⚠️ 我的一次测量失误（已自查并更正，记录在此）**：我最初用「干扰项是否与课内某被祝福句逐字相同」扫全库，**得到 28 处命中（含 L38 两处）**，一度想写成「干扰项撞车是系统性问题」。复查发现**句池误收了 `guided[].answer` 的碎片**（全库 **249 处** `guided[].answer` 是 ≤2 词的词块，如 `"who"`/`"which"`/`"am"`），于是「另一道题的答案是 `which`」被误判成「`which` 是一句正确句」。**把句池限定为完整句（≥3 词）后，命中降到 4 处**（L80 / L108 / L137 / L175，其中 2 处是「疑问句 vs 陈述句」的语序对比，属有意设计）。**L38 在两版判据下都不算「干扰项逐字撞车」。** | 低——已更正，但这条更正本身有价值：**它说明「碎片入池」会让这类扫描产生约 7 倍假阳性**，后续批次做类似扫描时必须先过滤碎片 | 建议把「句池须过滤 ≤2 词碎片」写进后续审计脚本的注释（脚本 `s24-clash-recheck.ts` 已实现）。**这条更正不影响本批任何结论。** |
| 3 | **L38 的 8 张卡里，6 张都在讲「引子 + 原话照装」的变形，是否该精简？** 我只做了计数（6/8），**没有做「用户会不会觉得啰嗦」的可用性判断**——那需要真人测试。 | 中——影响 2.4「不加卡」的建议强度 | 我的「不加卡」结论**不依赖**这个判断（即使 6 张都必要，不加第 9 张的理由仍成立：形状侧已被覆盖 + 与 `contrast[7]` 冲突）。但若产品侧想动 L38，**精简比增补更值得考虑** |
| 4 | **我用「去重句子」低估了 `says` 的实际教学价值吗？** 同一句 `She says she will come.` 在 14 个槽位里出现，其中有些是**不同教学功能**（`targetSentence` 是守门句、`blocks` 是拆块、`guided[1].answer` 是拼装题、`practice[0]` 是点词题、`recall.answer` 是回忆题）。**这 14 处不是冗余，是同一句在不同题型里的复现。** | 中——我可能在「去重」这把尺子上过度削弱了 `says` | 我**同时给出两个口径**（⑥6.2 槽位 / ⑥6.3 去重），**并明确没有用一个口径去否决另一个**。本报告的结论（`say`/`said` 不处理）在**两个口径下都成立**，所以这个不确定项**不影响结论** |
| 5 | **`said` 若将来立课（L205），该与哪个词配课？** L197–L204 的模式是「2 词/课 或 1 词/课」（`think`+`know` / `swim`+`sing` / `sit`+`catch` / `feel`+`keep` / `sleep` / `draw` / `wear` / `give`）。`said` 单独一课会偏薄。 | 低——本批不做，留给将来 | 建议到那时与 `wrote`（正侧 0）或 `brought`/`spent`/`taught`（正侧 0）配课，按「变化模式」配对（如 `say→said` 与 `pay→paid` 同形规律；`teach→taught` 与 `catch→caught` 同形规律）。但**这需要另一次全库缺口排序**，不在本批范围 |
| 6 | **British Council 的等级标注（`Level: beginner` vs `Level: intermediate`）能否作为本项目的排课依据？** 本项目是**自建体系**（204 课、28 季，L38 在第 38 课就教转述），并未对齐 CEFR。 | 低——只用于「形状与转述应分开组织」这一条定性判断 | 我**只把它用作定性支持**（形状属初级、转述属中级 ⇒ 别在同一张卡上互相指控），**没有用 CEFR 等级去论证本项目的排课**。⑤5.7 的对照表已按这个限度写 |

---

## 附录 A · 本批全部核查脚本清单

`/Users/liujun/Documents/英语听写/deliverables/product-strategy/working/say-family-audit-2026-09-23/`

| 脚本 | 作用 |
|---|---|
| `s01-scan.ts` | 四口径阶梯（V0–V3）+ 表 1–7（含被剔除条目原样列出） |
| `s02-keylessons.ts` | 9 课结构逐课 + L197–L204 家族 + 案件全文 + 12 词对正/错侧 |
| `s03-sentences.ts` | 句子级去重 + 案件里 say 家族的真实曝光 + `said` 时序 |
| `s04-cambridge-extract.ts` | Cambridge 摘取（**在 HTML 上定位 → 会漏检，保留以示例**） |
| `s04b-cambridge-verbatim.ts` | 同上，局部剥标签版（仍漏检） |
| **`s04c-cambridge-text.ts`** | ✅ **先转纯文本再定位（报告引用以本脚本为准）** |
| `s05-dict-excerpt.ts` | Cambridge `say`/`said` + Oxford `say_1` 逐字摘取 |
| `s06-harm-path.ts` | 时序审计 v1（**含口径 bug：把 correction 误当曝光**，保留以记录修正过程） |
| `s07-card-audit.ts` | 对照卡「单点可修」核查 + L38 八卡逐张 |
| **`s08-timeline.ts`** | ⭐ 时序审计 v2（修正口径）+ `wore`/`said`/`told` 三条对照 |
| `s09-selfcontradiction.ts` | 同课自相矛盾判据 A（过宽，保留以说明收窄过程） |
| `s10-narrow.ts` | 判据 C / D |
| `s11-gate-preview.ts` | 若挂靠 L38 的 8 项守门预演 + 候选文案零术语/星号预检 |
| `s12-mark-placement.ts` | 错卡编辑类型分布 + 补词型划线落点 + L38 内三处信号冲突 |
| **`s13-gap-metric.ts`** | ⭐ gap 指标（被要求 → 其后首次见到正确用法） |
| **`s14-dedup.ts`** | ⭐ 槽位计数 vs 去重句子计数 + 逐句清单 |
| `s15-reconcile.ts` | 与任务书对账 + 回流配对 + 全库 gap 排序 |
| `s16-exhaustive.ts` | 逐槽位分解 + 穷举字段组合（152 个口径满足 2/21/1） |
| **`s17-mark-align.ts`** | ⭐ 口径精确定位（复现任务书 2/21/1）+ 划线词与讲解对齐 |
| `s18-final.ts` | 任务书口径确认 + `says=21` 构成拆解 + `said` 是否被要求产出 |
| `s19-fix-recommend.ts` | `contrast[6]` 真实编辑结构 + 建议改法 A/B |
| `s20-honest.ts` | 诚实核查（多改动卡惯例；**推翻自己一条过强表述**） |
| `s21-precise.ts` | 精确错位判据（X 划线点 vs Y 讲解点） |
| `s22-feature-absent.ts` | 「教的特征在正确侧缺席」初筛（过宽） |
| **`s23-refine.ts`** | ⭐ 收窄为类型乙（该补 `to` 但 `correct` 也无 `to`）——全库仅 3 张 |
| **`s24-clash-recheck.ts`** | ⭐ **自查更正**：修正 s09-D 的「碎片入池」瑕疵（28 处 → 4 处） |
| **`RUN-ALL.sh`** | 一键复现全部核查 + 守门回归 + 外部源可达性 |

## 附录 B · 建议的下一批（按优先级）

1. **【最高】确认并修 `L38 contrast[6]`**——请内容侧先确认上批补卡意图（⑦不确定项 1），再按 3.2（改 `wrongMark` 为 `"me"`）或 3.3（改为 `null`）落地，并在 `whyZh` 里加一句把 `said` 摘出来（3.4 第 ② 步）。
2. **【高】把 `to` 放到正确侧**（3.4 第 ③ 步，即 3.5 推荐项 1）——这是 s23 查出的本课唯一真实盲区。
3. **【中】`*tell to + 人` 错卡**（`She told to me she will come.`）——上批路线图 §5 携带项 5，与 `*say + 人` 成对。
4. **【中】登记 `said`**——按 2.2 的话术（**不要**照抄 `told` 的「整面墙没砌」）。
5. **【低】`say` 登记为「已确认无缺口」**——它不是缺口，是「话头」功能词；建议在缺口清单里显式标注「已核查，无需处理」，以免后续批次反复重查。
