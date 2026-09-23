# 竞品与外部权威源分析 · `gave` ＋ 两个审计问题（第四十七批专项）

**日期**：2026-09-22 ｜ **分析人**：竞析（产品战略团队 · 竞品/跨源分析师）
**类型**：缺口复核 + 立课/挂靠判定 + 数据结构审计（双主题）
**我方基线（本轮独立实测）**：**203 课（L1–L203，无跳号）／212 案（#1–#212，无跳号）／contrast 卡 1220 张／variants 609 条**
**上游**：`roadmap-grammar-forty-sixth-batch-2026-09-22.md` §3.2／§5 携带项 4、9；`competitive-analysis-felt-kept-gave-2026-09-22.md`（批四十四）§7.3

---

## ① 结论摘要

1. **`gave` 的四个数字，我独立复核后与任务书完全一致（✅ 25 / 5 · 0 / 1 · 0 / 1 · 0 / 0）——但任务书没写口径，而这个表其实对口径极度敏感。**（§②）
   - 我试了 **9 种口径**，只有一种能同时复现四行：**「答案键 10 槽位 ＋ 忽略大小写 ＋ 排除 `bothRight` 卡的 `wrong` ＋ 排除 spot 题的 `answer`」**。
   - ⚠️ **关键发现：`give` 的 25 这个数字，若换成「大小写敏感」，会掉到 22**——因为 L63 有 `Give it to me.` / `Give me the book.` / `Give the book to me.` 三句**大写开头**的正确答案。**这不是小事：说明这批数字的复现依赖于一个未声明的匹配开关。**（§2.2）
   - ⇒ **建议：把口径写进结论，而不是只写数字。**（延续批四十六 §5 携带项 8「口径必须随结论一起写」）

2. **`gave` 的缺口定性，我复核后要改一个字：它不是「正侧 0」，而是「正侧 0、错侧 1」。**（§2.4）
   - **`gave` 全库仅 1 处，且恰恰在错侧**：`L199 practice[2].distractors = ["gave"]`——**用作干扰项**，题面是「复习第 63 课：请把书递给我。」，答案 `Please give me the book.`
   - ⇒ **这意味着 `gave` 的处境比批四十四描述的更微妙：它被当成「不该选的词」放在用户面前一次。** 用户在 L199 做这道题时，看到的正确反馈是「不该用 `gave`」——**而同一课的 `contrast[5].whyZh` 却说「give 变 gave」是对的。**
   - ⚠️ **这是一处同课内的自相矛盾**（§2.5 给完整推理）。**`gave` 的处理不能只「补一张正侧卡」了事，必须先解掉 L199 内部这个结。**

3. **立课还是挂靠？——我的独立结论：`gave` 既不立课，也不按批四十四方案挂 L199；建议改为挂靠 L63（改批四十四的结论）。**（§③ 给四步推理）
   - **判定判据是本项目自己已经建立的，不是外部教科书**：一个过去式该不该立课，看**它的原形是否已经是某一课的「主角」**（`targetSentence` 或 `grammarLabel` 含它）。
   - 实测：**`give` 是 L63 的主角**（`targetSentence = "Please give me the book."`、`grammarLabel = "给东西 · give me the book / give it to me"`）——**与 `draw→L12/L202`、`wear→L203`、`feel→L76/L200`、`sit→L81/L199`、`catch→L173/L199` 同档，全部都是「有主角课」的过去式**。
   - 而**唯二挂靠的 `lose`/`break`，恰恰是「原形从未当过主角」的两个词**（实测 `lose` 主角课 `[]`、`break` 主角课 `[]`）——**这正是它们只能挂靠、不能立课的原因。**
   - ⇒ **`give` 有主角课（L63），所以 `gave` 具备立课资格**；但**本批不建议立课**，理由见第 4 条。

4. **最终建议：`gave` 挂靠 L63（1 张 `bothRight` 卡 ＋ 修 `L199` 的干扰项），不立新课。**（§③.4）
   - **挂 L63 而非 L199 的决定性理由**：**L63 是 `give` 的位置规矩课（`give me the book` / `give it to me`），而 `gave` 的缺口恰好在「位置」这条线上**——`gave` 只在 huntCases 里出现 3 次，**三句全是双宾语结构**（`The teacher gave us many advice…` / `My teacher gave us useful advice.` / `Mom gave us a orange juice.`）。
   - ⇒ **`gave` 与 huntCases 的真实用法，和 L63 教的句型是同一个句型**。挂 L63 让「位置规矩」与「昨天版」在同一课完成闭合；挂 L199 则要引入 L199 没有的概念（`give` 的三态、双宾语），**这是把两个知识块硬粘在一起**。
   - **批四十四否掉 L63 的理由是「时序问题（决定性）：L63 在 L197 之前，用户在 L63 时还没有「换零件」的概念」——这个理由对「在 L63 现场讲 `gave`」成立，但对「在 L63 挂一张 `bothRight` 卡」不成立**：`bothRight` 卡的设计本身就是**并排展示两种说法**，不需要用户先懂「换零件」才能读。（§3.3 给反驳）

5. **跨源位次（§④，6 处逐字引用 ＋ 可访问 URL）**：
   - **`give` 的等级是 A1，三源一致**：OALD 词条 `ox3ksym_a1`（逐字 `give something to somebody` / `give somebody something` 双句型并列）；BC `Delexical verbs` 页标 **beginner**；BC `Irregular verbs` 表标 **beginner**。
   - **「两种句型」的权威处理，Cambridge 最完整且最有教学价值**，逐字：**"When talking about giving a physical object, the indirect object can go before or after the direct object."**；**"the indirect object must come before the direct object"**（非实物宾语时）。
   - ⚠️ **两个跨源冲突（本批新发现，§4.5）**：
     - **冲突一（代词规则）**：**Cambridge / BC / Oxford 三源「都没有」讲「`it` 作直接宾语时要用 `to`」这条规则**（我逐页核查，均无）。**而 Grammar Monster 逐字给出的是相反的例子：`"Give him it"`**——即它认为双代词可以不带 `to`。**我方 L63 把 `*Give me it.` 标为硬错**（`wrongMark="me it"`）。
     - **冲突二（实物 vs 非实物）**：Cambridge 明确区分「实物可两序／非实物必须一序」，**我方 L63 没有做这个区分**——L63 的规矩是「东西换成 `it` 才翻身垫 `to`」，**判据是「词的长短」，Cambridge 的判据是「实物/非实物」**。这是**两套不同的判据**，不是同一套的深浅之分。

6. **竞品矩阵（§⑤）：7 款产品，「同一个动词的两种句型」这个点上，空位是「两种句型的『取舍理由』」。**
   - **做到了的**：Cambridge 讲了实物/非实物的分工（但那是**语法描述**，不是**学习路径**）；OALD 双句型并列（**零解释**）。
   - **没做到的一**（7 款全无）：**把两种句型的取舍与「昨天版」放在同一个教学单元里**——即**没有任何一款产品在同一页里同时处理「说哪个句型」和「什么时候用哪个形状」**。
   - **没做到的二**（7 款全无）：**跨页面的错句回流**。BC 的练习把句型判错之后就结束了，**没有一句「不过注意，另一种说法也对」**（§5.1 给实测）。

7. **中文负迁移（§⑥）：本批**没有**抓到任何一条「源里明说 `give me the book` 是中文直译陷阱」的中文资料。**（这是本批最诚实的结论）
   - **可访问的中文侧**（iciba / youdao 词典页）**只给词形与例句，不给「陷阱」论述**。
   - **中文语法站（letmeenglish）逐页实测：没有双宾语/间接宾语的专页**（§6.2 给出它 100 条 grammar 目录的完整核查结果）。
   - **⇒ 我在 §6.3 把「中文直译陷阱」严格登记为【推断】，并给出我必须拒绝写进产品文案的具体句子**（沿用批四十三纪律）。

8. **审计问题一（§⑦）：52 张卡的字段用法「基本合理，但存在一个真问题 ＋ 一个假问题」。**
   - **假问题**：任务书说的「与双正解卡共用 `null`」**实际不成立**——因为双正解卡的判据是 `bothRight=true`，**52 张是 `bothRight=undefined`**，**两者在代码里从不混淆**（实测 5 个下游消费者，**没有一处会误判**）。**唯一的实际损失是少出 52 道改错题**（占 670 道候选池的 7.8%）。
   - **真问题（本批新发现）**：**`types.ts` 对 `wrongMark=null` 的文档写的是「null 表示整句缺了一块」**，但 **52 张里有 42 张不符合这个语义**——它们是**语序错 / 语气错 / 语义反 / 缺关系词 / 缺连词 / 缺成对结构**，**不是「整句缺块」**。
   - **⇒ 结论：字段用法合理（不必新增标记），但 `types.ts` 的注释是错的，应当改。** 这是「字段名/文档与实际语义不符」的**第三次踩坑**（延续批四十六 §5 携带项 9）。

9. **审计问题二（§⑧）：L75 的 `label` 异常值「危害为零，修法正确」，但我扫出 3 类枚举外问题。**
   - **危害实测为零**：我**复现了两个守门在「改前/改后」的行为**——**R06 守门（每课练习必含非肯定变体题）改前改后都通过**；**产出段半提示句选择改前改后选中同一句**（`Let's not go now.`）。**⇒ 这个异常值从未触发过任何红灯。**
   - **但它在第三个守门上是「静默失效」**：`gq2-boost-items.test.ts` B-5 用正则 `「(肯定|否定|疑问)」` 从题面提取 label 校验形式一致性——**旧 label `提议（第二种）` 提取结果是 `null`，守门直接 `continue` 跳过**。**⇒ 修法正确，且它是把一个「静默漏检」补回来的正确动作。**
   - **枚举外扫描（§8.4）**：`guided[].kind`（4 值）／`dialogue[].who`（2 值）／`variants[].label`（3 值，已修）**全部在枚举内**；`huntCases.errors[].tag` **10 值全在枚举内，但 `comparison` 这一类型定义存在却全库从未使用**（§8.5）；`lesson.scene` 13 值 / `huntCases[].scene` 212 值均为自由文本（**非枚举，不建议当枚举管**）。

10. **本批最不确定的一点**：**`gave` 的 `i→a` 与 `sit→sat` 是否真的「同型」，我保留怀疑。** 批四十四据此判 `gave` 与 L199 同族，但 **`sit/sat` 是两态同形、`give/gave/given` 是三态全不同**——**「换零件的方式一样」不等于「词的形态家族一样」**。（§⑩ U1 给完整登记）

---

## ② `gave` 数字复核（含口径与脚本）

### 2.0 口径说明 —— 先定口径，再报数

**本批我犯过一次口径错误，如实登记**：第一版脚本我用「大小写敏感」匹配，得到 `give` 正侧 = **22**，与任务书的 **25** 差 3。核对后确认**差异全部来自 L63 三句大写开头的正确答案**（`Give it to me.` / `Give me the book.` / `Give the book to me.`）。**换成忽略大小写后精确复现 25。**（§2.2 给完整对照表）

**脚本**：`deliverables/product-strategy/.gave-verify-47.mts`（80 行，只读，不改任何数据）
**运行**：`./node_modules/.bin/vite-node deliverables/product-strategy/.gave-verify-47.mts`

**匹配规则**：
```js
const wb = (w) => new RegExp(`(?<![A-Za-z-])${w}(?![A-Za-z-])`, "gi");
// 词边界：排除连字符与相邻字母；gi = 全局 + 忽略大小写
```

**槽位划分（三侧，互斥）**：

| 侧 | 槽位 | 说明 |
|---|---|---|
| **正侧**（10 槽） | `targetSentence` · `dialogueEn` · `examples[].en` · `dialogue[].en` · `contrast[].correct` · `variants[].en` · `sceneSwings[].en` · `guided[].answer`（非 spot） · `practice[].answer` · `recall.answer` | 用户被明确告知「照这样说」的答案键 |
| **错侧**（5 槽） | `contrast[].wrong`（`bothRight≠true`） · `contrast[].wrongMark`（同） · `guided[].options` · `guided[].wrongToken` · `practice[].distractors` | 被明确标为「这样说不对」或充作干扰项 |
| **中性**（7 槽，两侧都不计） | `contrast[].wrong`（`bothRight=true`） · `guided[].answer`（spot） · `guided[].tokens`（spot） · `guided[].tokens`（非 spot） · `practice[].tokens` · `blocks[].text` · `guided[].replaceBase` | 语义相反的字段容器 —— 见下 |

**两处特例排除（任务书指定，本轮独立验证其必要性）**：
- **`spot` 题的 `answer` 是「错的那个词块」**（`types.ts` 注释逐字：「spot：藏了问题的那个词块（命中即通过）」；`lessonFlow.ts:202` 逐字 `const target = step.wrongToken ?? step.answer;`）⇒ **归中性，不计正侧**。
- **`bothRight=true` 的 `wrong` 是「正确的第二句」**（`types.ts` 逐字：「双正解条（L36 that 可选件）：两句都对——选哪句都判对」）⇒ **归中性，不计错侧**。

### 2.1 核查 0 · 基线（脚本实测输出）

```
grammarLessons 203 课；contrast 卡 1220 张；variants 609 条
槽位：正侧 6762 个，错侧 3875 个，中性 10275 个
```

### 2.2 核查 1 · 复现任务书四行表

```
形式            正侧    错侧     |  简报
give          25     5  |        25/5  ✅ 一致
gives          0     1  |         0/1  ✅ 一致
gave           0     1  |         0/1  ✅ 一致
given          0     0  |         0/0  ✅ 一致
```

**✅ 四行全部精确复现。**

**⚠️ 但口径敏感性实测（本批新增，任务书未提）**：

| 匹配方式 | `give` 正侧 | 说明 |
|---|---|---|
| **忽略大小写（本报告采用）** | **25** | ✅ 复现任务书 |
| 大小写敏感 | **22** | ❌ 差 3 —— L63 三句大写答案被漏掉 |

**大小写敏感的漏项逐条**（这三处就是 25 − 22 = 3 的全部来源）：
```
L63 contrast[0].correct  "Give it to me."       ← 大写 G
L63 contrast[1].correct  "Give me the book."    ← 大写 G
L63 contrast[2].correct  "Give the book to me." ← 大写 G
```

**⇒ 结论：任务书的 25 是忽略大小写的口径；这个开关必须写出来，否则下批复现会得到 22 并误判「数字变了」。**

### 2.3 核查 2 · `give` 正侧 25 处逐槽位

```
targetSentence             1        （L63）
dialogueEn                 1        （L63）
examples.en                4        （L63×3、L68×1）
dialogue.en                1        （L63）
contrast.correct           5        （L63×5）
variants.en                3        （L63×3）
sceneSwings.en             2        （L63×2）
guided.answer              3        （L63×2、L68×1）
practice.answer            4        （L63×3、L199×1）
recall.answer              1        （L63）
──────────────────────────────────
合计                        25
```

**分布结论：25 处里 22 处集中在 L63，L68 有 3 处。`give` 是一个「一课为主、一课延伸」的词。**

`give` 正侧 25 处**逐条明细**（脚本输出）：

```
L 63 targetSentence   "Please give me the book."
L 63 dialogueEn       "Please give me the book."
L 63 examples.en      "Please give me the book."
L 63 examples.en      "Please give it to me."
L 63 examples.en      "Please give me the pen."
L 63 dialogue.en      "Please give me the book."
L 63 contrast.correct "Give it to me."
L 63 contrast.correct "Give me the book."
L 63 contrast.correct "Give the book to me."
L 63 contrast.correct "Please give me the pen."
L 63 contrast.correct "Please give me the book."
L 63 variants.en      "Please give me the book."
L 63 variants.en      "Don't give me the book."
L 63 variants.en      "Can you give me the book?"
L 63 sceneSwings.en   "Please give it to me."
L 63 sceneSwings.en   "Can you give me the book?"
L 63 guided.answer    "Please give me the book."
L 63 guided.answer    "Please give it to me."
L 63 practice.answer  "Please give me the book."
L 63 practice.answer  "Can you give me the book?"
L 63 practice.answer  "Please give me the cup."
L 63 recall.answer    "Please give me the book."
L 68 examples.en      "Please give it to me."
L 68 guided.answer    "Please give me the book."
L199 practice.answer  "Please give me the book."
```

### 2.4 核查 3 · 错侧 + `gave` 的完整台账（**本批最重要的新发现**）

**错侧 5 处逐条**：
```
L 63 contrast.wrong.real   "Give me it."
L 63 contrast.wrong.real   "Give the book me."
L 63 guided.options        "Please give it to me."    ← 选项池里的正解，归错侧是口径副作用，非错误
L 63 guided.options        "Please give me it."
L 63 guided.options        "Please give it me."
L 63 practice.distractors  "gives"
L199 practice.distractors  "gave"                     ← ⚠️ 就是这一处
```

**`gave` 三侧全查 —— 全库只有 1 处**：
```
gave 命中的槽位共 1 处：
   L199 [错侧] practice.distractors :: "gave"
→ 正侧 0 / 错侧 1 / 中性 0
```

**⚠️ 也就是说：`gave` 不是「零出现」，而是「唯一一次出现就在错侧」。**

**逐字核验这处的上下文**（脚本实测）：
```
L199 practice[2]:
  promptZh   = "复习第 63 课：请把书递给我。"
  tokens     = ["Please","give","me","the","book."]
  distractors = ["gave"]                              ← 干扰项
  answer     = "Please give me the book."
```

### 2.5 ⚠️ 同课内自相矛盾（本批新发现，任务书未提）

**同一课 L199 里，两处对 `gave` 的说法不一致**：

| 位置 | 逐字 | 对 `gave` 的态度 |
|---|---|---|
| `L199 contrast[5].whyZh` | 「两句都对——第 63 课那句的 give 也有自己的昨天版：**give 变 gave**（跟今天的 sit → sat 一样，都是里面的 i 换成 a）。give 的位置规矩在第 63 课，形状在今天的 sat 这条线上。」 | **`gave` 是对的（且是 `give` 的昨天版）** |
| `L199 practice[2].distractors` | `["gave"]` | **`gave` 是「不该选的词」** |

**⚠️ 而且意图上两者其实是相容的**——干扰项的题面是「**复习第 63 课：请把书递给我。**」，**要的是现在时（`Please give me the book.`）**，所以 `gave` 出现在这里当干扰项**在时态上是合理的**（题面没有昨天的时间信号）。

**⇒ 但用户看到的交互是：把 `gave` 拖进句子 → 判错。而 `contrast[5]` 又说「give 变 gave」。**
**⇒ 我判定这是一处「真实但低危」的教学摩擦，不是数据错误**：
- **不算数据错误**：干扰项的时态选择有题面依据（「复习第 63 课」= 现在时场景）。
- **算教学摩擦**：`gave` 全库仅此一次出现在用户面前，**且是「不该选」，而同时同课又在讲解里说它「是对的」——用户没有任何一处能看到 `gave` 在一句完整正确的句子里被用过。**
- **建议的解法恰好就是一个动作**：**给 L63 加一张 `bothRight` 卡，把 `gave` 放进一个真正的正确句子里**（§3.4 给具体文案），**摩擦自然消解，且不用动 L199 的干扰项**。

### 2.6 核查 7 · 反事实对照：其它过去式在同一口径下的正侧基数

```
felt      正侧= 35  课=[200,201]      sat      正侧= 18  课=[199]
kept      正侧= 20  课=[200,201]      caught   正侧= 18  课=[199]
swam      正侧= 18  课=[198]          sang     正侧= 18  课=[198]
slept     正侧= 21  课=[201]          drew     正侧= 22  课=[202]
wore      正侧= 21  课=[203]          lost     正侧= 48  课=[23,24,50,123,153,178,185,188]
broke     正侧= 24  课=[23,193,194]   told     正侧=  0  课=[]
went      正侧= 52  课=[10,11,...]    ate      正侧= 37  课=[...]
```

**⇒ 两个结论**：
1. **`gave`（0）与 `told`（0）是全库仅有的两个「正侧零」过去式**（在我核查的 14 个词里）。**`told` 也从未当过主角**（§3.2 实测），**它应当与本批 `gave` 同批登记**。
2. **已立课的过去式，正侧基数区间是 18–35**（`sat`/`caught`/`swam`/`sang` 各 18 最低，`felt` 35 最高）。**这给了 `gave` 一个可校准的目标值**：若要立课，**理想落点是 ~18–20 处**（与 `sat`/`caught` 同档，因为 `gave` 也是「一课两词」的候选）。

---

## ③ 立课 vs 挂靠 —— 独立判断

### 3.1 参考先例（任务书给定）

| 词 | 先例 | 原形是否有主角课 | 正侧基数 |
|---|---|---|---|
| `felt` / `kept` | **立课（L200）** | `feel` → L76 ✅ ／ `keep` → L77、L78 ✅ | 35 ／ 20 |
| `lose` / `break` | **挂靠（L46）** | `lose` → **无** ❌ ／ `break` → **无** ❌ | 0 ／ 24 |
| `gave` | 批四十四曾判「挂靠 L199」 | `give` → **L63** ✅ | **0** |

### 3.2 我提炼的判据（来自本项目的既有实践，不是外部教科书）

**判据：原形是否已经是某一课的「主角」（`targetSentence` 或 `grammarLabel` 含它）？**

脚本实测（`/tmp/star-47.mts`）：

```
词            是主角的课         正侧
give          [63]         1    ✅ 有主角课
draw          [12,202]     2    ✅ 有主角课
wear          [203]        1    ✅ 有主角课
feel          [76,200]     2    ✅ 有主角课
keep          [77,78,200]  3    ✅ 有主角课
sleep         [47,201]     2    ✅ 有主角课
sit           [81,199]     2    ✅ 有主角课
catch         [173,199]    2    ✅ 有主角课
swim          [190,198]    2    ✅ 有主角课
sing          [170,185,198] 3   ✅ 有主角课
think         [36]         1    ✅ 有主角课
know          [35,37,41,160] 4  ✅ 有主角课
lose          []           0    ❌ 从未当主角
break         []           0    ❌ 从未当主角
```

**⇒ 判据成立，且解释力完美**：**所有「立课」的过去式（`felt`/`kept`/`slept`/`drew`/`wore`/`sat`/`caught`/`swam`/`sang`）原形都有主角课；唯二「挂靠」的 `lose`/`break` 原形都从未当过主角。**

**⇒ `give` 是 L63 的主角（`targetSentence = "Please give me the book."`，`grammarLabel` 逐字含 `give me the book / give it to me`）。所以 `gave` 具备立课资格，不属 `lose`/`break` 那一类。**

### 3.3 反驳批四十四「挂 L199」的两条理由

**批四十四 §7.3 的结论**：`gave` 应挂靠 L199（按机制同类），**否掉 L63 的理由逐字是**：

> **劣势 2** ｜ **时序问题（决定性）**：**L63 在 L197 之前**。用户在 L63 时**还没有「换零件」的概念**——在 L63 讲 `gave` 要么「超前」（违反课程次序），要么只能在 L197 之后**回填**。**既然无论如何都要回填，就没有理由选一个焦点冲突的挂靠点。**

**我的反驳（两点）**：

**反驳 1：「回填」这个前提本身，`bothRight` 卡就是为此设计的。**
- **批四十四的推理默认为「在 L63 讲 `gave`」**（需要用户先懂「换零件」）——**但挂一张 `bothRight` 卡不需要**。
- **`bothRight` 卡的定义逐字**（`types.ts`）：「双正解条（L36 that 可选件）：**两句都对**——选哪句都判对，**揭示时两句并排展示**」。**它的交互是「挑一句你更顺眼的」，不预设任何语法概念。**
- **本项目已有大量「在早课挂后面才讲的卡」的先例**，例如 **L199 `contrast[5]` 自己就在回流 L63**（`wrong = "Please give me the book."`，`correct = "I sat next to her and caught the bus."`）——**L199 用「回流早课」的方式挂卡，而不是改早课。**

**反驳 2：焦点冲突的问题，恰恰是「挂 L63」要解决的那个问题，而不是它制造的。**
- **批四十四说 L63「焦点冲突」**（L63 的焦点是语序，加 `gave` 会分心）——**这个顾虑是对的，但它同样适用于 L199**：
  - **L199 的焦点是 `sit`/`catch` 两个词**（`grammarLabel = "昨天版 · sit 变 sat、catch 变 caught"`），**加 `gave` 同样是第三个词**。
  - **且 L199 加 `gave` 的代价更高**：L199 的 `deepDive` 只讲「昨天版」不讲「做过版」（批四十四自己逐字承认：「**在 L199 加 `gave` 会引入「第三态」这个概念**」），**而 `give` 是三态全不同（`give/gave/given`）**——**在 L199 加 `gave` 要额外解释「为什么这个家族多一个形状」。**
- **而在 L63 加 `gave` 的代价是零新增概念**：L63 的 `give` 已经是主角，**`gave` 只是它换了一件衣服**，且 **L63 的句型（双宾语）恰好就是 huntCases 里 `gave` 的三次真实用法**（§2.4、§4.4）。

### 3.4 我的结论与具体方案

**结论：`gave` 不立课，挂靠 L63（改批四十四的结论）。**

**建议动作（2 个，都很小）**：

**动作一：给 L63 加 1 张 `bothRight` 卡**（把「位置规矩」与「昨天版」在同一课闭合）：

```ts
{
  // 2026-09-22 批四十七挂靠：gave 的正面样本
  // （gave 全库仅 1 处，且是 L199 的干扰项；L199 whyZh 已承诺「give 变 gave」但无处可点）
  wrong: "Yesterday I gave her the book.",
  wrongMark: null,
  correct: "Please give me the book.",
  bothRight: true,
  whyZh: "两句都对，差在什么时候——上面几句是「请递给我」（原样 give）；这句是「（昨天）我递给她了」，换了零件：give 变 gave（里面的 i 换成 a，跟第 199 课的 sit → sat 一个换法）。位置规矩不变：先给谁（her）、后给什么（the book）。"
}
```

**文案守门自查**（按本项目红线逐条核对）：
- ✅ **零术语**：无「主谓宾/时态/直接宾语/间接宾语/过去式」；`give`/`gave` 用「原样」「换了零件」。
- ✅ **回流引用真实存在**：`L199 contrast[5].whyZh` 逐字确有「give 变 gave（跟今天的 sit → sat 一样，都是里面的 i 换成 a）」——**引用准确**。
- ✅ **句型与 L63 一致**：`gave her the book`（先给谁、后给什么）——**正是 L63 的 `oneLineRule`**（逐字：「先给谁、后给什么（give me the book）」）。
- ✅ **`bothRight` 语义正确**：两句都真对（一句现在时请人递书、一句昨天递书），**不是「把错句标成双正解」**。
- ✅ **不引入 `given`**：按批四十四 §7.3 C 的建议，**本卡只碰「昨天版」，不碰「做过版」**。

**动作二：`gave` 的错侧那 1 处不必动。**
- `L199 practice[2]` 的题面是「复习第 63 课：请把书递给我。」——**现在时场景，`gave` 作干扰项在时态上正确**（§2.5）。
- **加了动作一之后，用户在 L63 已见过 `gave` 的正确用法**，L199 的干扰项就变成「复习到位」的正常检测，**摩擦消失。**
- **⇒ 改数据不如补数据。**（这是我与批四十四方案最大的分歧点）

### 3.5 ⚠️ 连带登记：`told` 是同一批的第二个洞

**`told` 正侧 = 0（实测），且 `tell` 从未当过主角（`star = []`）。**
- **它在本批的「正侧零」名单里与 `gave` 并列**（§2.6）。
- **它与 `lose`/`break` 同类（无主角课）**，所以**只能挂靠**。
- **建议：与 `gave` 同批登记处理**（不必本批做，但不要在下次审计时又当成新发现——**这是连续第 4 批出现「上一批的排除项变成这一批的缺口」**）。

---

## ④ 跨源位次表（逐字引用 + URL）

**说明**：本节每条均标 **【明说】**（源里逐字写了）或 **【推断】**（我的推理）。**所有【明说】条均附 URL。**

### 4.1 【明说】`give` 的等级：A1，三源一致

| # | 源 | 逐字原文 | URL | 等级 |
|---|---|---|---|---|
| **S1** | **OALD（牛津）** | 词条内联双句型逐字：**`give something to somebody`**（例句 **"Give the letter to your mother when you've read it."**）／**`give somebody something`**（例句 **"Give your mother the letter."**）；第一义项逐字 **"[transitive] to hand something to somebody so that they can look at it, use it or keep it for a time"** | `https://www.oxfordlearnersdictionaries.com/definition/english/give_1` | **A1**（`ox3ksym_a1`；**部分义项 A2/B2/C2**） |
| **S2** | **Oxford 3000** | 词条标注 **`ox3000="y"`**，主义项 **A1** | 同上 | **A1** |
| **S3** | **BC `Irregular verbs`** | 表内条目逐字 **`give gave given`**；页首标 **"beginner"** | `https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/irregular-verbs` | **beginner** |

**⇒ 跨源位次结论：`give` / `gave` 是不存在越级问题的 A1 词。`gave` 作为 `give` 的过去式，与 `drew`/`slept`/`wore` 同档（批四十三/四十四已实测）。**

### 4.2 【明说】「两种句型」的权威处理：Cambridge 最完整

| # | 源 | 逐字原文 | URL |
|---|---|---|---|
| **S4** | **Cambridge Dictionary Grammar（`Give` 页）** | **【实物可两序】**逐字：**"When talking about giving a physical object, the indirect object can go before or after the direct object."** 两例句逐字：**"He gave the flowers to his mother."** ／ **"He gave his mother the flowers."** | `https://dictionary.cambridge.org/grammar/british-grammar/give` |
| **S5** | **Cambridge（同页）** | **【用 to 的错误位置】**逐字：不可说 **"give to someone something"**，错误例句逐字 **"He gave to his mother the flowers."** | 同上 |
| **S6** | **Cambridge（同页）** | **【非实物必须一序】**逐字：**"the indirect object must come before the direct object."**；警告不可说 **"give advice/your opinion/a shock to someone"**，应说 **"give someone advice/your opinion/a shock"**；错误例句逐字 **"What he said gave an idea to me."**，改正逐字 **"What he said gave me an idea."** | 同上 |
| **S7** | **BC `Clause structure and verb patterns`** | 逐字：**"Noun + Verb + Noun + Noun (Peter sent his mother some flowers)."**；页标 **"elementary"**。**全页不含 `give` 一词** | `https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/clause-structure-verb-patterns` |
| **S8** | **BC `Delexical verbs`** | 页标 **"beginner"**；`give` 作虚化动词逐字：**"We use give with:"** ＋ 分类清单（**noises / facial expressions / hitting / affectionate actions / talking**）；例句逐字 **"She gave a loud laugh."** ／ **"He gave me a nasty kick on the leg."** ／ **"She gave the children a goodnight kiss and put them to bed."** | `https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/delexical-verbs-have-take-make-give-go-do` |

### 4.3 ⚠️ 抓不到的源（明确说明，不假装有）

| 源 | 状态 | 实测证据 |
|---|---|---|
| **British Council「Two objects」专页** | **不存在** | 我核了 BC 的 `Verbs` 索引页全部 **20 个子页链接**，**无一篇叫「verbs with two objects」或「indirect objects」**。最接近的是 S7（`Clause structure and verb patterns`），**该页只有一行 `Noun + Verb + Noun + Noun`，且不含 `give`**。多个候选 URL 实测 **HTTP 404** |
| **BC 直连（curl）** | **HTTP=000**（任务书已预告） | `curl -m 25 -L` 三个候选 URL 全部 **`HTTP=000 size=0`**；**经 WebFetch 可读**（S3/S7/S8 均由此取得） |
| **Cambridge 词典页**（`/dictionary/english/give`） | **HTTP 520**（限流） | 连续三次尝试均 `HTTP 520 <none> Retry-After: 60`；**语法页（S4–S6）可读，词典页不可读** |
| **Murphy 双册 / Swan PEU** | **已记「不可得」**（任务书指定） | **未重试**（遵守任务书） |
| **中文侧语法站的「双宾语」专页** | **不存在** | §6.2 给完整核查 |
| Cambridge `Pronouns: objects` 页 | **HTTP 520** | 用于核验代词规则，不可读（§4.5） |

### 4.4 【明说】`gave` 在 huntCases 里的真实用法 —— 三句全是双宾语

**这是本批最有价值的一条本地证据**（脚本实测，词边界匹配，逐字核验是否被纠错）：

| # | 案 id | 逐字整句（节选） | `gave` 是否被纠错 |
|---|---|---|---|
| **#9** | `hunt-uncountable` | **"The teacher gave us many advice and some informations about the exam."** | **否（正确 token）** |
| **#20** | `hunt-term-review` | **"Last term, I learn a lot of English. My teacher gave us useful advice."** | **否（正确 token）** |
| **#27** | `hunt-snow-day` | **"Snow day! It snowed all day, we were very happy. … Mom gave us a orange juice."** | **否（正确 token）** |

**⇒ 三句逐字都是 `gave + 人 + 物`（双宾语）结构** —— **与 L63 `grammarLabel` 逐字「给东西 · give me the book / give it to me」是同一个句型。**
**⇒ 这是「挂 L63 而非 L199」的第三条独立证据**（前两条见 §3.3）。

### 4.5 ⚠️ 两个跨源冲突（本批新发现）

**冲突一：代词规则 —— 我方判硬错，权威源不支持「这是硬错」。**

**我方 L63 的立场**（逐字，`contrast[0]`）：
> `wrong = "Give me it."`，`wrongMark = "me it"`，`correct = "Give it to me."`
> `whyZh` = 「东西一变成 it，就要绕到后面垫 to：give it to me——「先给谁、后给什么」的规矩，碰到小词要翻个身。」

**权威源的实际内容**：

| 源 | 是否讲了「`it` 作直接宾语必须用 to」 | 实测 |
|---|---|---|
| **Cambridge `Give` 页（S4–S6）** | **没有** | 该页三段（实物两序／to 的错误位置／非实物一序）**均未提代词** |
| **OALD `give`（S1）** | **没有** | 逐字核查：**"Note about pronouns: The provided text contains no explicit note about pronouns like 'it' requiring 'to'"** |
| **BC（S7/S8）** | **没有** | S7 全页不含 `give`；S8 是虚化动词页，不涉双宾语 |
| **Grammar Monster**（可读，非上述权威三源） | **给了相反的例子** | 逐字：**"When the indirect object is a pronoun, the pronoun must be in the objective case."** 例子逐字含 **"Give him it"** ／ **"Give us the diamonds."** |

**⇒ 我的判断（【推断】，标注强度）**：
- **【推断·中高】`*Give me it.` 在真实英语里是「语法可接受、语感偏生硬」的形式，不是硬错。** 依据：Grammar Monster 逐字给了 `"Give him it"` 作为可接受例子；而**三大权威源「都不提这条规则」本身就是一个信号**——若这是一条硬规则，Cambridge 的 `Give` 页（专门讲 give 的两种句型）**不会漏掉**。
- **⚠️ 但我必须承认证据不足**：**我三次尝试 Cambridge `Pronouns: objects` 页均 HTTP 520**，**没有拿到「代词规则」的权威表述**。**故本条只能登记为「存疑」，不能作为改数据的依据。**
- **⇒ 建议：不改 L63 的 `wrongMark`**（`*Give me it.` 作为教学靶子仍有效——它是「母语者很少这样说」的典型），**但建议把 `whyZh` 里「就要」这类绝对措辞改成「母语者更常说」（若产品负责人认可）。** 这样既保留教学清晰，又不与语言事实冲突。

**冲突二：判据不同 —— 我方用「词的长短」，Cambridge 用「实物/非实物」。**

| | 判据 | 逐字 |
|---|---|---|
| **我方 L63** | **「东西换成 `it`（小词）时翻身垫 `to`」** | `oneLineRule` 逐字：「东西换成 it 时，要跑到后面垫上 to（give it to me）」 |
| **Cambridge（S4/S6）** | **「实物：两序皆可；非实物：必须一序」** | 逐字：**"When talking about giving a physical object, the indirect object can go before or after the direct object."** ／ **"the indirect object must come before the direct object."** |

**⇒ 结论（【推断·高】）：这是两套不同的判据，不是同一套的深浅之分。**
- **Cambridge 的判据是「给的东西是不是实物」**（`give me the flowers` ✓ / `give the flowers to me` ✓；但 `give me an idea` ✓ / `~~give an idea to me~~` ✗）。
- **我方的判据是「词的长短」**（`give me the book` ✓ / `give it to me` ✓）。
- **两者在 `it` 这个点上「结论偶然一致」**（都要求 `to`），**但理由完全不同**。
- **⚠️ 这个差异在 `idea` 这类词上会分叉**：按 Cambridge，`*He gave an idea to me.` 是**硬错**；按我方 L63 的「长短判据」，`an idea` 比 `it` 长，**应当允许前序**——**而我方规则没有覆盖这个情形**。
- **⇒ 建议：这是一个真实的知识缺口，登记为下一批的候选**（若 L63 要做二期，可加一张「给的东西是『想法/建议』这类看不见的」的卡）。**本批不阻塞 `gave` 的处理。**

---

## ⑤ 竞品矩阵与空位判定

**⚠️ 纪律声明（沿用批四十三）**：本批**无法访问竞品的付费课程内部**（登录墙），故下表区分「**实测可见**」（公开页，本批亲测）与「**未核实**」。**不把未核实项写成结论。**

| # | 产品 | 侧 | **在「同一个动词的两种句型」上做到什么**（本批实测） | **在「句型选择 ＋ 形式变化」放同一单元上做到什么** | 空位 |
|---|---|---|---|---|---|
| **1** | **Cambridge Dictionary Grammar** | 英 | ✅ **最完整**：`Give` 页逐字给了**实物两序**（**"the indirect object can go before or after"**）＋**用 to 的错误位置**（**"He gave to his mother the flowers."** ✗）＋**非实物一序**（**"the indirect object must come before the direct object"**） | ❌ **零**——该页**只讲句型，不涉 `gave` 或任何形式变化**；且**无练习、无场景** | **句型讲了，但不给学习路径**——用户知道「两种都行」，**但不知道「我该先学哪个」**；**`gave` 在该页完全不出现** |
| **2** | **BC LearnEnglish** | 英 | ⚠️ **弱**：**无「two objects」专页**（本批核完 `Verbs` 索引 **20 个子页**）；最接近的 `Clause structure and verb patterns` 逐字只有一行 **"Noun + Verb + Noun + Noun (Peter sent his mother some flowers)."**，**且全页不含 `give`** | ❌ **零**——`Irregular verbs` 表（**beginner**）含 `give gave given` 但**纯字母序平铺，无任何说明**；`Delexical verbs` 页（**beginner**）把 `give` 讲成虚化动词（**"She gave a loud laugh."**），**与双宾语无关** | **⚠️ 结构性空位**：BC 把 `give` 的两种句型**拆到了两个互不引用的地方**（句型在 clause structure 页、词形在 irregular 表），**两者无交叉引用** |
| **3** | **OALD（牛津）** | 英 | ✅ **做到了但零解释**：词条内联**双句型并列**逐字 **`give something to somebody`** ／ **`give somebody something`**，各有例句 | ❌ **零**——只给形与例，**不给「什么时候用哪个」**；**无练习、无场景** | **可查不可学**——**这正是我方 L63 最有把握的差异位**：用户查到两个句型，**不会知道「`it` 要垫 `to`」** |
| **4** | **Grammar Monster** | 英 | ⚠️ **做到了但与权威不一致**：逐字 **"An indirect object is the word or phrase that receives the direct object."**；**"Ditransitive verbs take two objects"**；例子逐字 **"Sarah gave John an apple"** ／ **"She gave a letter to Jennifer"** | ❌ **零** | **⚠️ 它的代词处理与我们冲突**（§4.5 冲突一）：逐字给 **"Give him it"** 作可接受例子，**而我方判 `*Give me it.` 硬错** |
| **5** | **letmeenglish**（中文） | 中 | ❌ **零**：本批核完其 `grammar-list` 页 **100 条目录**，**无「双宾语」或「间接宾语」专页**（完整核查见 §6.2）；其 `english-basic-words-order` 页逐字只讲**动词＋宾语要贴在一起**（例句 **"I like pizza very much."**，反面 **"I like very much pizza."**），**完全不涉两个宾语** | ❌ **零** | **中文侧「句型」这一格是空的** |
| **6** | **iciba（中文词典）** | 中 | ⚠️ **弱**：本批实测**只给例句不给句型标签**——有 **"give me the pencil"** 与 **"give it to her"** 两个例子，**但没有 `give sb sth` / `give sth to sb` 的句型标注**；等级标签是**考试标**（"高中/CET4/CET6/考研/IELTS"）**不是 CEFR** | ❌ **零** | **⚠️ 但它的两个例子恰好覆盖了两种句型**（`give me the pencil` ＝ 前序；`give it to her` ＝ `to` 后序）——**形式在，解释不在** |
| **7** | **扇贝 / 多邻国 / 沪江 / 作业帮**（合并一行，均为前批实测不在公开页） | 中/英 | ❌ **公开页零相关内容**（本批复测：沪江检索页 404、作业帮返回 `Z_DATA_ERROR`、知乎 403） | ❌ 零 | **结构性缺位**（不在其产品模型的「知识点」概念里）；**付费内部未核实** |

### 5.1 空位判定的三条硬结论

**① 「同一个动词的两种句型」在英文权威侧是「讲了」，但在学习产品侧是「没讲成课」。**
- **Cambridge 做到了语法描述**（S4–S6），**但那是参考页，不是课程**——**无练习、无场景、无顺序建议**。
- **OALD 做到了并列查询**，**零解释**。
- **BC 把句型与词形拆到了两个互不引用的页面**（§⑤ 第 2 行）。
- **⇒ 7 款里没有任何一款把「两种句型怎么选」做成一节有练习的课。**

**② 「句型选择」与「形式变化（`gave`）」在 7 款产品中「零同框」。**
- **本批逐款核完**：Cambridge `Give` 页**不含 `gave`**；BC `Irregular verbs` 表**不含句型**；OALD 词条把句型与 `past simple gave` 放在**同一词条的不同区域，但无一句把两者联系起来**；Grammar Monster 只讲句型；中文侧（letmeenglish/iciba）**两者都弱或零**。
- **⇒ 这是一条真实的空位。我方 L63 ＋ `gave` 挂靠卡的组合（把 `give me the book` 与 `gave her the book` 并排）在这个点上没有对标产品。**
- **⚠️ 但必须诚实说明**：**这个空位之所以存在，很可能是因为它是「拆开更好教」的**——**从句型教学的角度，先教 `give me the book`、几课后教 `gave`，是更常见的顺序。** 我方的做法（同课并排）**是差异化的选择，但不应被描述为「竞品做不到」**——它们是**选择不做**。**这个区分必须写清，否则我们会在内部误判自己的优势。**

**③ ⚠️ 英文权威侧有一条「明说的空缺」我方已经填上了 —— 但填法与 Cambridge 判据不同。**
- **Cambridge 明说了「非实物必须一序」这条规则**（S6），**而我方 L63 完全没有覆盖这个情形**（§4.5 冲突二）。**这不是我们填上了空缺，而是我们用了另一套（更窄的）判据。**
- **⇒ 诚实结论：在「非实物宾语」这个点上，Cambridge 比我方更完整。** 这是**我方的一处真实缺口**，不应当在竞品分析里被说成优势。

---

## ⑥ 中文负迁移证据（严格区分「明说」与「推断」）

**纪律声明**：本节每条都标 **【明说】**（源里逐字写了）或 **【推断】**（我的推理，源里没写）。**两者不混排。所有【明说】条均附 URL。**

### 6.0 ⚠️ 本节的诚实前提：本批**没有**抓到「中文侧自认 `give me the book` 是直译陷阱」的资料

**任务书要求查「中文侧教学文章自认的痛点（`give me the book` vs `give the book to me` 的中文直译陷阱）」。我实际核查的结果是：抓不到。**如实登记如下。

### 6.1 【明说】源里明确写了（可访问的，逐字）

| # | 逐字原文 | 源 | URL | 与 `give` 双宾语的相关度 |
|---|---|---|---|---|
| **M1** | **"When talking about giving a physical object, the indirect object can go before or after the direct object."** | Cambridge Dictionary Grammar（`Give` 页） | `https://dictionary.cambridge.org/grammar/british-grammar/give` | **最高**——**英文权威对「两序皆可」的明确表述** |
| **M2** | **"the indirect object must come before the direct object."** | Cambridge（同页） | 同上 | **最高**——**非实物时的强制一序，我方 L63 未覆盖** |
| **M3** | **"He gave to his mother the flowers."**（判错）／**"What he said gave an idea to me."**（判错） | Cambridge（同页） | 同上 | **高**——**两个反面样本，可直接用作对照卡素材的参考** |
| **M4** | **"Give your mother the letter."** ／ **"Give the letter to your mother when you've read it."** | OALD | `https://www.oxfordlearnersdictionaries.com/definition/english/give_1` | **高**——**同一义项下的两个句型并列** |
| **M5** | **"An indirect object is the word or phrase that receives the direct object."** ／ **"Ditransitive verbs take two objects: a direct object and an indirect object."** ／ **"When the indirect object is a pronoun, the pronoun must be in the objective case."** ＋ 例 **"Give him it"** | Grammar Monster | `https://www.grammar-monster.com/glossary/indirect_object.htm` | **高（且与我方冲突）**——**它是唯一给了「双代词」例子的源，且形式与我方判错的形式相同** |
| **M6** | 例句逐字 **"give me the pencil"** ／ **"give it to her"**；等级标签逐字 **"高中/CET4/CET6/考研/IELTS"** | iciba（中文词典） | `https://www.iciba.com/word?w=give` | **中**——**中文侧唯一同时出现两种句型的可访问源，但无句型标签、无陷阱论述、等级用考试标而非 CEFR** |
| **M7** | 逐字 **"Noun + Verb + Noun + Noun (Peter sent his mother some flowers)."**（页标 **"elementary"**，**全页不含 `give`**） | BC `Clause structure and verb patterns` | `https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/clause-structure-verb-patterns` | **中**——**BC 对「两个名词跟在动词后」的表述，是英文侧最简的一处** |
| **M8** | 逐字 **"We use give with:"** ＋ 分类清单；例 **"She gave a loud laugh."** ／ **"He gave me a nasty kick on the leg."** | BC `Delexical verbs` | `https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/delexical-verbs-have-take-make-give-go-do` | **低（但有用）**——**证明 BC 的 `give` 教学重心在「虚化动词」而非双宾语**；**顺带说明我方「`give` 是递东西的实义动词」的定位与 BC 的关注点不同** |

### 6.2 【明说】中文侧「双宾语专页」的完整缺席（实测，给出全部核查路径）

**我核查了中文侧最可能有该内容的站点，结果如下**：

| 核查对象 | 方法 | 实测结果 |
|---|---|---|
| **letmeenglish `grammar-list` 页** | 逐条读取全部目录链接 | **100 条目录全部核完，`无「双宾语」/「间接宾语」/「double object」任何一项」**。最接近的是「词序」类（`english-basic-words-order`），**该页逐字只讲动词与宾语要贴在一起**（例 **"I like pizza very much."**，反面 **"I like very much pizza."**），**完全不涉两个宾语** |
| **letmeenglish 候选 URL 直试** | `./zh-hans/double-object-verbs/` ／ `./zh-hans/indirect-object/` ／ `./zh-hans/verbs-two-objects/` | **全部 HTTP 404** |
| **百度百科「双宾语」** | WebFetch | **HTTP 403**（两次尝试，含带 ID 的直链） |
| **知乎专栏/问答** | WebFetch × 4 个 URL | **全部 HTTP 403** |
| **百度检索 / 必应检索** | WebFetch | 百度返回**空内容**；必应返回的结果**全部是「双」这个汉字本身**（百度百科字条、双色球），**零条相关** |
| **搜狗检索** | WebFetch | **302 跳转到反爬页**（`antispider`） |
| **沪江 / 作业帮 / 词典类** | WebFetch | 沪江检索 **404**；作业帮 **`Z_DATA_ERROR`**；youdao / quword / iciba **可访问但不含陷阱论述** |

**⇒ 逐字结论：在我能访问的全部中文源里，没有任何一条讲「`give me the book` 是中文直译陷阱」或类似的负迁移论述。** 中文侧对 `give` 的处理**全部是「词义 ＋ 例句 ＋ 考试等级」**，**没有一篇把这个结构当作中国学习者的痛点来讲。**

### 6.3 【推断】我的推理（源里没写，标注强度）

| # | 推断 | 依据（间接） | 强度 | 反证 / 保留 |
|---|---|---|---|---|
| **I1** | **中文母语者在这个结构上的负迁移风险，主要不在「两种句型选哪个」，而在「`it` 的位置」** | ① 中文「给我那本书」与英文 `give me the book` **同序**（我方 L63 `deepDive` 逐字：「中文说「给我一本书」，英语正好同一个顺序：give me a book——**你早就有的直觉**」）；② 因此**前序句型对中文母语者是零成本**；③ 而 `*give me it` 是**中文「给我它」的逐字映射**——**中文允许「给我它」，英文不这么说** | **中高** | **⚠️ 无任何源明说这一点**（§6.1/6.2 实测）。**这是纯推理。** |
| **I2** | **我们把「`give me the book`」当作需要教的规矩，方向可能是反的** | 我方 L63 `deepDive[0]` 逐字承认：「中文说「给我一本书」，英语正好同一个顺序：give me a book——**你早就有的直觉，今天正式点破**」。**既然「早就有的直觉」，那这一课的真正新信息量在 `give it to me` 那一半，而不是前序那一半** | **中高** | 我方 L63 的 `examples` 其实已经偏向 `it` 版（实测 4 句里 **1 句**是 `it` 版：`Please give it to me.`），**但 `grammarLabel` 与 `oneLineRule` 都把两序并列为「规矩」——措辞上把本能说成了规矩** |
| **I3** | **中文侧不讲这个点，很可能因为它对中文母语者「不构成难点」**（除 `it` 那一处） | §6.2 实测中文侧全面缺席；且 §6.3 I1 的推理链（前序同序＝零成本）**能解释为什么中文教辅不把它当痛点** | **中** | **⚠️ 反证：中文应试体系大量考「双宾语」概念**（iciba 的考试标含高考/CET4/考研）——**说明它在中考/高考的「语法知识」层面是被考的，只是不被当作「错误陷阱」讲。这两件事不矛盾，但我无法从可访问源区分。** |
| **I4** | **我方 L63 的判据（词的长短）与 Cambridge 的判据（实物/非实物）在 `idea`/`advice` 这类词上会分叉** | §4.5 冲突二：Cambridge 逐字 **"the indirect object must come before the direct object"**（非实物），**我方规则无此情形** | **高** | **这是从两源逐字对比直接推出的，不是关于用户的推断** |
| **I5** | **L199 的 `gave` 干扰项会让用户形成「`gave` 是坏词」的印象** | §2.5：`gave` 全库仅 1 处用户在面前，且是「不该选」；同时同课 `whyZh` 又说「give 变 gave」 | **中** | **这是我对教学效果的推断，无用户数据** |

### 6.4 ⚠️ 明确不能写进产品文案的（沿用批四十三纪律）

- **不能写「中文学生常把 `give me the book` 说成 `give the book me`」** —— **§6.1/6.2 实测：没有任何源明说这个错形。** 我方 `contrast[1]` 的 `wrong = "Give the book me."` ＋ `wrongMark = "the book me"` **是我方的教学设计，不是外部实证**。
- **不能写「研究表明中国学生在双宾语上犯 X 类错误」** —— **本批零实证。**
- **可以写**：「`give me the book` 与中语序相同（我方 L63 `deepDive` 逐字已承认这是「你早就有的直觉」），所以这一课的新信息在 `give it to me` 这一半」 —— **这是内部一致性论证 ＋ 我方自己的文案依据。**
- **可以写**：「Cambridge 明确区分了实物/非实物两种情形，而我们只讲了 `it` 一种」 —— **这是可核验的外部事实**（S4–S6，URL 已附）。

---

## ⑦ 审计问题一评估：52 张「语义模糊」卡

### 7.1 复核任务书的三个数字 —— **有一个不成立**

**实测（`/tmp/audit-final-47.mts`，脚本输出逐字）**：

```
总 1220
A 正常错卡 bothRight≠true + wrongMark=有  = 670
B 双正解卡 bothRight=true                 = 498
C 语义模糊 bothRight≠true + wrongMark=null = 52
A+B+C = 1220  ✅ 无重叠无遗漏
简报数字 670+495+52 = 1217，比实测少 3 张
```

**⚠️ 任务书写「双正解卡 495 张」，实测是 498 张。**（670 + 498 + 52 = 1220 精确等于总数，**说明我的划分无重叠无遗漏，495 应为旧基线**）
- **旁证**：`git show HEAD:src/data/grammarLessons.ts` 的 `bothRight: true` 计数 = **472**，当前工作区 = **498**；`contrast` 卡总数 HEAD = **1170**，当前 = **1220**。**⇒ 双正解卡数在持续增长，495 是某个中间时点的值。**
- **⇒ 建议：任务书/审计报告里的「495」应更正为「498」，并且这个数字应标注统计时点**（它每批都在变）。

**另两处实测澄清**：
- **`wrongMark` 是严格 `null`，不是「缺失」**：非双正解卡里 `wrongMark` = 字符串 **670** / 显式 `null` **52** / `undefined` **0**。**⇒ 52 张全部显式写了 `null`，没有字段缺失的情况。**
- **`bothRight` 的三态**：`true` **498** / `false` **0** / `undefined` **722**。**⇒ 全库没有一处显式写 `bothRight: false`。** 这一点很重要，见 §7.3。

### 7.2 52 张的实际内容分类（实测）

```
A2 · 52 张里「恰好一个词不同、可补 wrongMark」的 = 1 张
    L87[2] "it" → "it's"   :: "It cold today."
A2 · 52 张里 wrong 与 correct 逐词完全相同的 = 3 张 ⚠️
    L91[1]  "Before I eat I wash my hands."      （差一个逗号）
    L92[1]  "When it is sunny I run."            （差一个逗号）
    L140[2] "It is raining but I will go out."   （差一个逗号）
```

**按语义分类（我的归类，脚本实测）**：

| 类别 | 张数 | 例子（逐字） |
|---|---|---|
| **整句缺块**（be/冠词/to/of/the 等漏词） | **31** | `L1[1] "I Xiaomei."` ／ `L1[5] "I am student."` ／ `L2[4] "She is nurse."` ／ `L4[3] "I want apple."` |
| **疑问/答句语气错**（该陈述却问 / 该答却问） | **9** | `L2[3] "You are a teacher?"` ／ `L6[4] "Is it three o'clock?"` ／ `L7[4] "Are they classmates?"` |
| **其它**（含 3 张只差逗号） | **4** | `L15[0] "I want go home."` ／ `L85[1] "Whose is this book?"` ／ `L91[1]`/`L92[1]`（逗号） |
| **否定误加（语义反向）** | **2** | `L1[3] "I am not happy today."` ／ `L6[5] "It is not cold today."` |
| **连接词缺失**（and/but） | **2** | `L19[0] "I was busy happy."` ／ `L19[1] "The snow is cold, I am happy."` |
| **关系词缺失**（who/which 钩子） | **2** | `L39[0] "The boy wears glasses is my brother."` ／ `L41[2] "I like the boy is tall."` |
| **成对结构不完整**（as…as / between…and） | **2** | `L65[1] "He is tall as me."` ／ `L81[1] "I sit between Tom."` |
| **合计** | **52** | |

### 7.3 我的评估（三条结论）

**结论一：字段用法「基本合理」——**「不新增独立标记」是**正确的**决定**。** 理由有两层：

**(a) 任务书担心的「与双正解卡共用 `null`」实际不成立。**
- **双正解卡的判据是 `bothRight === true`，52 张的 `bothRight` 是 `undefined`。**
- **全库 `bothRight: false` 出现 0 次** ⇒ **在真实数据里，`!c.bothRight` 这个判断对所有 722 张非双正解卡都返回 `true`**，**52 张与 670 张在这一维上是同一类**，**与 498 张的双正解卡泾渭分明**。
- **⇒ 「共用 `null`」这个描述会让人以为两者在代码里会混淆，实测不会。**

**(b) 5 个下游消费者全部正确，我逐个核了**：

| 消费者 | 逐字代码 | 对 52 张的行为 | 判定 |
|---|---|---|---|
| `lessonFlow.ts:219` | `find((item) => !item.bothRight) ?? lesson.contrast?.[0]`；`const hasProblem = !contrast.bothRight;` | **会被选中做前测对比题**，`hasProblem = true` ⇒ 前测问「有问题」 | ✅ **正确**（52 张确是错句） |
| `grammarBoostService.ts:837` | `if (contrast.bothRight) return;` … `locateMarkedTokens(tokens, contrast.wrongMark, contrast.correct)` ⇒ `wrongIndexes.length === 0` ⇒ `return` | **通过 `bothRight` 检查，但被 `wrongIndexes` 挡掉，不产生改错题** | ✅ **正确**（不会拿 `null` 当错词标） |
| `grammarBoostService.ts:880` | `if (contrast.bothRight) return;` … `isWrong: true` | **通过，且标 `isWrong: true`** | ✅ **正确**（52 张确是错句，标 `isWrong` 名副其实） |
| `grammarExplainService.ts:159` | `find((c) => c.wrongMark?.trim() && !c.bothRight)` | **被排除**（`null?.trim()` 为假） | ✅ **正确**（无标记词，无法定位差异） |
| `grammarExplainService.ts:697` | `!item.bothRight && item.wrongMark && item.wrongMark.toLowerCase()… === answerWord` | **被排除** | ✅ **正确** |

**⇒ 没有任何一个消费者会把 52 张误判为「双正解」或「无错」。口径一致。**

**⇒ 唯一的实际损失：少出 52 道改错题。** 实测 `contrast + wrongMark` 可派生的改错题上限 = **670 道**，**52 张若补上标记可增 52 道 ＝ +7.8%**。**这是量的问题，不是正确性问题。**

**结论二：⚠️ 真问题在 `types.ts` 的注释，不在字段用法。**（**本批新发现**）

**`types.ts:580` 逐字**：
```ts
/** 需要标出的问题词；null 表示整句缺了一块。 */
wrongMark?: string | null;
```

**实测 52 张里，符合「整句缺了一块」语义的只有约 30 张**（`whyZh` 含「不能丢/缺了/少了/漏了/站不住/差一口气」等措辞的，脚本实测 30；§7.2 表按语义归类为 31，**相差 1 张属归类边界，不影响结论**）。**其余约 22 张不属于这个语义**，例如：
- **语序/位置错**：`L85[1] "Whose is this book?"`（`whose` 后面该直接跟东西）
- **语气错（该陈述却问 / 该答却问）**：`L2[3] "You are a teacher?"`、`L6[4] "Is it three o'clock?"`（**9 张**）
- **语义反向（多加了 `not`）**：`L1[3] "I am not happy today."`（**2 张**）
- **缺关系词（钩子）**：`L39[0] "The boy wears glasses is my brother."`（**2 张**）
- **缺连词**：`L19[1] "The snow is cold, I am happy."`（**2 张**）
- **缺成对结构**：`L65[1] "He is tall as me."`（**2 张**）
- **只差标点**：`L91[1]`/`L92[1]`/`L140[2]`（**3 张**）

**⇒ 结论：字段用法合理（`null` ＝「无法标出单个问题词」这个更宽的含义是自洽的），但注释把它窄化成了「整句缺了一块」，与实际不符。**
**⇒ 建议（小改动，高收益）：把 `types.ts:580` 的注释改为**：
```ts
/**
 * 需要标出的问题词；null 表示【无法用单个词/词组标出问题】——
 * 含两类：① 整句缺了一块（漏 be/冠词/to）；② 问题在整句层面（语序/语气/语义反向/缺关系词/缺连词/缺成对结构/只差标点）。
 * 两类都不产生 wrongMark 派生的改错题。
 */
```

**⇒ 这是「字段名/文档与实际语义不符」的第三次踩坑**（前两次：spot 题的 `answer` 是错词、`bothRight` 卡的 `wrong` 是正确句）——**延续批四十六 §5 携带项 9。**

**结论三：52 张里 3 张「只差逗号」值得单独处理（但不阻塞）。**
- **`L91[1]` / `L92[1]` / `L140[2]` 三张，`wrong` 与 `correct` 去掉标点后逐字相同**（脚本实测 `去标点后相同=true`）。
- **它们的 `whyZh` 都用【】自标了缺块**，例如 `L140[2]` 逐字：「少了个逗号：but 站中间，前面点个逗号断一下——It is raining**【,**】 but I will go out。」
- **⚠️ 风险实测：已排除。** `grammarBoostService.ts:1378` 逐字 `if (normalizeLessonSentence(contrast.wrong) === normalizeLessonSentence(contrast.correct)) continue;` —— 我**读了 `normalizeLessonSentence` 的实现**（`lessonService.ts:8-13` 逐字：`.toLowerCase().replace(/[.,!?;:'"’‘（），。？！、]/g, "").replace(/\s+/g, " ").trim()`，**确实剥掉逗号**）⇒ **这 3 张在「自己改错」题里会被正确跳过**（✅ 已验证）。
  - **⚠️ 但同一个原因带出一个新观察**：`grammarBoostService.ts:880` 的「正误对比候选」**没有**这道 `normalizeLessonSentence` 守卫（它只挡 `bothRight`，**而 3 张是 `bothRight=undefined`**）⇒ **这 3 张会作为「正误对比题」出现，显示两句只有逗号之差。** **不算错（题干问的是「有问题吗」，答案确实是「有」），但体验偏弱。**
- **⇒ 建议：不阻塞，也不必补 `wrongMark`。** 原因：`grammarBoostService.test.ts` 逐字有一条守门「**contrast 的 wrongMark 不得是纯标点（回归：L89 的 "?" 无法定位）**」——**补 `","` 会撞这条守门。**（**这条守门的存在，恰恰证明「52 张用 `null`」是设计上有意为之的正确选择。**）

---

## ⑧ 审计问题二评估：`variants.label` 枚举外取值

### 8.1 现状复核

**实测（含 git 对照）**：

```
variants.label 当前分布：  "肯定" 203 ／ "否定" 203 ／ "疑问" 203   合计 609
每课 label 组合是否恰为 {肯定,否定,疑问}：✅ 203/203 全部符合
```

**git diff 逐字确认修法已落地**：
```diff
-      { label: "提议（第二种）", en: "How about going to the park?", zh: "去公园怎么样？", noteZh: "How about 后面穿名字版 going——把选项放桌上问。" }
+      { label: "疑问", en: "How about going to the park?", zh: "去公园怎么样？", noteZh: "How about 后面穿名字版 going——把选项放桌上问。" }
```
**⇒ 任务书描述的「已改成『疑问』」已确认落地，全库再无 `提议（第二种）`（`grep` 零命中）。**

### 8.2 危害评估：**实测为零**（我复现了两个守门的改前/改后行为）

**守门一：R06（`grammarLessons.test.ts:14-35`）** —— 逐字「每课练习应至少覆盖一道否定/疑问变体」，代码逐字：
```ts
const variantSentences = (lesson.variants ?? []).filter((variant) => variant.label !== "肯定").map((variant) => variant.en);
```
**我用 L75 的真实数据复现改前/改后**：
```
旧 label：非肯定变体 = ["Let's not go now.","How about going to the park?"] 命中练习题数 = 1
新 label：非肯定变体 = ["Let's not go now.","How about going to the park?"] 命中练习题数 = 1
→ 两者都 ≥1，守门【都通过】⇒ L75 异常值未触发 R06 红灯
```
**⇒ 原因**：`label !== "肯定"` 这个判断对**任何**非「肯定」的字符串都返回 `true`，**所以 `提议（第二种）` 与 `疑问` 在 R06 眼里完全等价。R06 从未受这个异常值影响。**

**守门二：产出段半提示句选择（`GrammarLessonPage.tsx:1689`）** —— 逐字：
```ts
const variantCandidates = (lesson?.variants ?? []).filter((variant) => variant.label !== "肯定" && variant.en.trim());
const halfPromptVariant =
  variantCandidates.find((variant) => !practicedSentences.has(variant.en.trim().toLowerCase()))
  ?? variantCandidates.find((variant) => variant.label === "疑问")
  ?? variantCandidates.find((variant) => variant.label === "否定")
  ?? null;
```
**复现改前/改后**：
```
旧 label 选中 = "Let's not go now."
新 label 选中 = "Let's not go now."
→ 修法【不改变】产出段选句（两条都选 否定 句）⇒ 改 label 无副作用
```
**⇒ 原因**：第一层 `find`（未被 `practice` 用过）在 L75 命中了 `Let's not go now.`，**根本没走到第二层 `label === "疑问"`**。**⇒ 这个异常值在产出段是「侥幸没踩到」。**

### 8.3 ⚠️ 但它在一个守门上是「静默失效」——这才是修法的真正价值

**守门三：`gq2-boost-items.test.ts:598`（B-5「变式题的 label 必须与答案的形式一致」）** —— 逐字：
```ts
const label = (item.promptZh.match(/「(肯定|否定|疑问)」/) ?? [])[1] ?? null;
if (!label) continue;   // ← 提取不到就跳过
```
**而题面是 `grammarBoostService.ts:1362` 逐字拼的**：
```ts
promptZh: `这句话还能换个说法——把它说成「${target.label}」的样子。`,
```
**我复现提取逻辑**：
```
旧 label 提议（第二种） → 提取 = null → label 为 null → 守门 continue 跳过（静默失效）
新 label 疑问           → 提取 = "疑问" → 正常校验
```
**⇒ 修法的真正价值：把一个「静默漏检」补回来了。**
- 改前：L75 这条变式题的题面会渲染成「把它说成**「提议（第二种）」**的样子。」——**而 B-5 守门看到 `null` 就 `continue`，不会校验它的答案形式是否正确。**
- 改后：题面是「把它说成**「疑问」**的样子。」，**B-5 会用 `inverted` 正则校验答案是否真倒装。**

**⇒ 我的判断：修法正确，且比任务书描述的更有价值。**
- **任务书说「破坏了三分类」**——这是**数据一致性**的视角（正确但偏轻）。
- **实际危害是「一个守门通道静默失效」**——这是**质量保障**的视角（更重）。
- **⇒ 建议：把这个教训一般化** —— **任何「用正则从渲染文本里回读枚举值」的守门，都会在枚举外取值面前静默失效，而不是报错。** 这类守门应当在「提取不到」时报错，而不是 `continue`。**登记为建议项。**

### 8.4 「还有没有类似的枚举外取值」—— 全库扫描结果

**我扫了全部数据文件的枚举型字段**（脚本 `/tmp/enums-47.mts`、`/tmp/enums2-47.mts`）：

| 字段 | 定义位置 | 实际取值 | 判定 |
|---|---|---|---|
| `guided[].kind` | `types.ts:526` `"choose" \| "arrange" \| "spot" \| "replace"` | `arrange` 608 / `choose` 203 / `spot` 203 / `replace` 203 ＝ **1217** | **✅ 4 值全在枚举内**（**无异常值**） |
| **`variants[].label`** | `types.ts:594`（类型是 `string`，**枚举是约定**） | `肯定` 203 / `否定` 203 / `疑问` 203 ＝ **609** | **✅ 已修**（本项） |
| `dialogue[].who` | `types.ts:568` `who: string`（注释「`me` 表示轮到小美说的那句」） | `npc` 406 / `me` 203 ＝ **609** | **✅ 2 值全在枚举内**（**无异常值**） |
| **`huntCases[].errors[].tag`** | `types.ts:454` **11 个值的联合类型** | 实际使用 **10 类**：`verb_form` 165 / `sv_agreement` 142 / `plural` 129 / `word_order` 97 / `tense` 83 / `preposition` 70 / `article` 33 / `fragment` 28 / `missing_be` 26 / `run_on` 19 ＝ **792** | **⚠️ `comparison` 定义存在但全库 0 次使用**（见 §8.5） |
| `lesson.scene` | `types.ts` `scene: string`（注释「AdventureSceneId」） | **13 个值**：`mansion` 65 / `campus` 58 / `city` 40 / `sparkle` 9 / `island` 7 / `train` 6 / `mystery` 4 / `forest` 3 / `snow` 3 / `ocean` 3 / `magic` 2 / `lighthouse` 2 / `desert` 1 ＝ **203** | **⚠️ 是受控词表但类型是 `string`**——**若 `AdventureSceneId` 是联合类型，则此处应当用类型而非 `string`**（见 §8.5） |
| `huntCases[].scene` | 同 | **212 个值，212 案各不重复**（自由文本场景描述） | **✅ 自由文本，非枚举，不应管** |
| `huntCases[].reviewed` | — | `true` 212 / 212（**全是 true**） | **⚠️ 见 §8.5** |

**⇒ 「字段取值不在预期枚举内」的情况：扫完全库，只有 `variants.label` 这一处（已修）。没有第二处。**

### 8.5 ⚠️ 扫描中发现的三处「疑似问题」（均非任务书所问，如实登记）

**(1) `GrammarErrorTag` 的 `comparison` 全库 0 次使用。**
- **类型定义 11 类**（`types.ts:454`），**实际使用 10 类**。
- **⇒ 两种可能**：① 为将来预留（合理）；② 曾计划但未实现（也可接受）。
- **⚠️ 风险**：若某处代码按「11 类」做遍历/统计/UI 渲染，**第 11 类会显示为空**。**我未逐处核查该 tag 的消费方**（超出本批范围）。
- **⇒ 建议：登记，下批可顺手确认「`comparison` 是有意预留还是遗漏」。**

**(2) `huntCases[].reviewed` 全 212 案都是 `true`。**
- **⇒ 这个字段目前不携带任何区分信息**（全真）。若它曾用于「未复核」筛选，**该筛选现在恒真**。
- **⇒ 非错误，但登记**（与 §8.5(1) 同类：字段存在但取值无区分度）。

**(3) `lesson.scene` 的值域是 13 个，但字段类型是 `string`。**
- **实测 13 个值全部落在同一个小集合内**（§8.4），**说明它事实上是枚举**。
- **⇒ 建议：若 `AdventureSceneId` 联合类型存在，把 `scene: string` 收紧为 `scene: AdventureSceneId`**——**这能让 TS 编译器替我们做「枚举外取值」的守门**，比事后扫描可靠。**（这正是本批 `variants.label` 问题的根治办法：`label` 的类型是 `string`，所以 `提议（第二种）` 能编过。）**
- **⚠️ 但注意**：`types.ts` 的注释逐字写「场景插画 ID（AdventureSceneId）」，**说明作者知道有这个名字**——**是否已定义为类型、收紧会不会引发连锁编译错误，我未核**（超出本批范围）。**登记。**

**⇒ 本批对审计问题二的最终建议（按优先级）**：
1. **把 `variants.label` 的类型从 `string` 收紧为 `"肯定" | "否定" | "疑问"`** —— **一次修改根除这一整类问题**（`提议（第二种）` 这类值将无法通过编译）。
2. **把「用正则从渲染文本回读枚举值」的守门改为「提取不到即报错」**（§8.3 守门三）。
3. 登记 `comparison` / `reviewed` / `scene` 三处（非阻塞）。

---

## ⑨ 自我核查记录

| # | 核查项 | 方法 | 结果 |
|---|---|---|---|
| **V1** | 任务书四行表（25/5 · 0/1 · 0/1 · 0/0） | 独立写 80 行脚本，10 个正侧槽 + 5 个错侧槽，忽略大小写 | ✅ **精确复现** |
| **V2** | 口径敏感性 | 同脚本切「大小写敏感」重跑 | ⚠️ **降到 22**——发现口径依赖，已写进 §2.0/§2.2 |
| **V3** | 「1220 张卡」的完整性 | `A+B+C` 相加 vs 总数 | ✅ **1220 = 670+498+52，无重叠无遗漏** |
| **V4** | 「双正解 495」 | 精确统计 `bothRight === true` | ❌ **实测 498**（差 3）；用 git HEAD 对照确认是版本差异 |
| **V5** | `wrongMark` null vs undefined | 三态精确统计 | ✅ **52 张全是显式 `null`，`undefined` 0 处** |
| **V6** | `bothRight` 三态 | 精确统计 | ⚠️ **`false` 全库 0 处**（722 处是 `undefined`）——已写进 §7.3 作为「两者不混淆」的证据 |
| **V7** | 52 张的下游危害 | 逐行读 5 个消费者的实际代码，逐个推演行为 | ✅ **5 处全部正确，危害仅为「少出 52 道改错题」** |
| **V8** | 3 张「只差逗号」卡 | 去标点后逐字比较 | ✅ **确认 3 张**；并查出 `grammarBoostService.test.ts` 有「`wrongMark` 不得是纯标点」守门 ⇒ **建议不动** |
| **V9** | L75 修法的行为影响 | 用 L75 真实数据复现 3 个守门的改前/改后 | ✅ **R06 与产出段无变化；gq2 B-5 从「静默跳过」变为「正常校验」** |
| **V10** | 枚举外取值全扫 | 扫 8 个枚举型字段（含 huntCases 内嵌） | ✅ **只有 `variants.label` 一处（已修）；另发现 3 处疑似项已登记** |
| **V11** | 立课/挂靠判据 | 用「原形是否当过主角」判据跑 14 个词 | ✅ **判据解释力完美**（所有立课的都当过主角、唯二挂靠的都没当过） |
| **V12** | `gave` 在 huntCases 的身份 | 逐案逐 token 核验是否被纠错 | ✅ **3 处全是正确 token；三句全是双宾语结构**（成为挂 L63 的第三条证据） |
| **V13** | L199 的 `gave` 干扰项 | 读 `practice[2]` 全文（题面/tokens/答案） | ✅ **确认题面是现在时场景，「不该选」成立；摩擦真实但低危** |
| **V14** | 跨源引用的可访问性 | 每条【明说】都实测 URL | ⚠️ **Cambridge 词典页 HTTP 520、BC curl HTTP=000、中文侧大面积 403**——**全部如实登记，未假装取到** |
| **V15** | 「中文直译陷阱」是否存在 | 核 letmeenglish 全 100 条目录 + 6 类中文源 | ❌ **抓不到，零命中**——**已在 §6.0 开篇明说这一前提** |
| **V16** | 三源是否讲「`it` 要垫 `to`」 | 逐页核 Cambridge `Give` 页 / OALD / BC | ❌ **三源均未讲**；Grammar Monster 反而给了 `"Give him it"` ——**已作为冲突登记** |

---

## ⑩ 不确定项（如实登记，不掩盖）

| # | 不确定项 | 我做了什么 | 为什么仍未确定 | 影响 |
|---|---|---|---|---|
| **U1** | **`gave` 的 `i→a` 与 `sit→sat` 是否真的「同型」** —— 批四十四据此判 `gave` 与 L199 同族 | 逐字对比两课 `whyZh`：L199 逐字「都是里面的 i 换成 a」；L199 词条 `sit/sat/sat`（**两态同形**），`give/gave/given`（**三态全不同**） | **「换元音的方式一样」与「词的形态家族一样」是两个不同维度。**我只有字符串与文案，**没有语言学判据来裁定「同型」的定义** | **中**——影响「挂 L63 还是 L199」的次要理由（**我的主要理由是句型一致性 S4.4，不依赖本条**） |
| **U2** | **`*Give me it.` 到底算多错** | 三源核查 + Grammar Monster 对照 + 三次尝试 Cambridge `Pronouns: objects` 页 | **Cambridge 代词页 HTTP 520 打不开**（§4.3）；**没有拿到权威的代词规则表述** | **中**——影响是否建议改 L63 的 `whyZh` 措辞（**我已建议只改措辞、不改 `wrongMark`**） |
| **U3** | ~~3 张「只差逗号」的卡会不会生成古怪的改错题~~ | **✅ 已查清（本批内闭环）** | 读到 `normalizeLessonSentence` 实现（`lessonService.ts:8-13`）**确实剥标点** ⇒ 「自己改错」通道**已正确跳过**；**但「正误对比」通道没有这道守卫，这 3 张会作为对比题出现（两句只差逗号）** | **低**——不阻塞；已在 §7.3 结论三登记，并说明为什么**不应**补 `wrongMark` |
| **U4** | **`huntCases[].scene` 212 个值是否应当受控** | 扫出 212 个值全不重复 | **没有源说明设计意图**；**212 案的场景文字各是各的剧情，重复反而可疑** | **低**——建议不管，但登记 |
| **U5** | **`comparison` tag 是有意预留还是遗漏** | 确认定义在、使用 0 | **未核查该 tag 的消费方是否有「按 11 类遍历」的代码**（超出本批范围） | **低**——登记，下批顺手确认 |
| **U6** | **「同课并排两种句型 ＋ 形式变化」是不是真的比我方更好** | 逐款核完 7 款产品，确认「零同框」 | **我无法从公开页判断竞品的付费课内是否这么做**（登录墙） | **中**——§5.1 结论② 已如实写明「竞品可能是选择不做，而非做不到」 |
| **U7** | **中文侧负迁移的真实样貌** | 核 6 类中文源（含 letmeenglish 全目录） | **零命中**；403/404/反爬/空内容 | **中**——§6.3 全部标【推断】，并在 §6.4 列明「不能写进文案」的具体句子 |

---

## 附：本批产出物

| 文件 | 说明 |
|---|---|
| `deliverables/product-strategy/competitive-analysis-gave-2026-09-22.md` | 本报告 |
| `deliverables/product-strategy/.gave-verify-47.mts` | **主核查脚本**（80 行，只读）：四行表复现 + 逐槽位拆解 + 三侧台账 + 对照过去式基数 |

**运行方式**：`./node_modules/.bin/vite-node deliverables/product-strategy/.gave-verify-47.mts`

**临时脚本**（在 `/tmp/`，未纳入交付）：`star-47.mts`（主角课判据）· `audit-final-47.mts`（52 张 + 枚举扫描）· `harm-47.mts`（下游危害）· `enums-47.mts`/`enums2-47.mts`（枚举与结构扫描）· `hunt-gave-47.mts`（huntCases 核验）· `final-text-47.mts`（L68/L199/L197 原文提取）
