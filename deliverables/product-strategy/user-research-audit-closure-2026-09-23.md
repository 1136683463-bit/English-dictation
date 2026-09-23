# 瑞思 · 第 50 批用户研究与内容缺口分析：审计口径的系统性复盘

- **批次**：第 50 批（承接第 44–49 批连续出现的「从数据形态反推语义」同类缺陷）
- **范围**：只做研究，**不改任何代码 / 数据**
- **本批主题**：`wrongMark` 三类语义的判定核对、`wrongMark` 与 `【】` 两套标记的分工是否有文档、本批该不该改数据、其它未文档化字段
- **核查脚本**：`/Users/liujun/Documents/英语听写/deliverables/product-strategy/.audit50-*.mts`（20 个，只读；与 RUN-AUDIT50.sh 一一对应）
- **一键复现**：`bash /Users/liujun/Documents/英语听写/deliverables/product-strategy/RUN-AUDIT50.sh`
- **日期**：2026-09-23
- **全库量级（本批实测）**：204 课 / 213 案 / 28 季（末季 season-28 = 182–204）/ 对照卡 **1228** 张 / 有值 `wrongMark` **674** 张 / `HuntError` **796** 处

---

## ① 结论摘要

| # | 结论 | 把握度 |
|---|---|---|
| 1 | **三个数字在「任务书口径」下成立，但第三个数字的标签是错的。** 我用独立脚本逐字复现出 `499 / 110 / 65`——它们来自口径 T（把整串 `wrongMark` 当作**一个 token**、在规范化后的句中精确查找）。但第三个桶的 65 张**全部是多词标注**（`"you are"` / `"Am I"` / `"As soon"` 这类 2 词以上标注），**不是**任务书写的「划的词只在正确句」。 | 高 |
| 2 | **「划的词只在正确句」这一类在全库为 0 张**，三种独立判据（词边界 / 整串子串 / 清洗整词）在两种大小写口径下**全部为 0**。这个桶的标签描述了一个库里不存在的集合。 | 高 |
| 3 | **任务书的三类分类不够用——缺一整个结构性轴。** 三类是按「词出现在哪一侧」切的（形态轴）；而真正决定「划这个词是什么意思」的是**这个词在编辑里演什么角色**（角色轴）。按角色轴切：**命中删除集 580 张 / 位置锚点 89 张**（后者即「划它只是指出这儿缺东西」，如 L3 `I have pen.` 划 `pen`、该补 `a`）。**两个轴不可互相还原**，必须并列才闭合。 | 高 |
| 4 | **`wrongMark` 与 `【】` 的分工：无任何文档，但代码里有权威说明。** `src/types.ts` 的 `LessonContrast.wrongMark` 注释只讲三类口径、**只字未提** `【】`；`src/data/grammarLessons.ts` 的文件头注 6 条设计依据里也没有。分工的唯一权威说明在 **`src/services/grammarBoostService.ts:841` 一带**（`locateMarkedTokens` 的调用与 docstring）与 **`src/services/grammarExplainService.ts:704-716`**（`answer` 语义）。**建议的文档措辞见 §3.3。** | 高 |
| 5 | **本批结论：数据无需修改，只需补文档——我独立判断这个结论「方向对、但不完整」。** 方向对：三类语义确实都是合理设计，`【】≠wrongMark` 的 200 张全部正常。**但不完整**：本批我新查出 **3 处真实的、可复现的渲染缺陷**（不是数据语义问题），其中 **14 张卡的删除线划在错误的单词内部**（§4.2），属用户可见缺陷。**该修的清单见 §4.4。** | 高 |
| 6 | **14 张卡的划线错位是硬缺陷**：`GrammarLessonPage.tsx:243` 用 `item.wrong.indexOf(mark)`——**子串**语义，不是词边界。`mark="a"` 在 `"I have a apple."` 里第一次出现是 **`have` 中间那个 a**，删除线因此划在 `h**a**ve` 里。实测 14 张，全部是 `a / an / is / he / go` 这类会嵌进别的单词的短词。 | 高 |
| 7 | **52 张「无标注且非双正解」的卡，UI 一律渲染「缺了一块」——但只有 36 张真的是缺词。** 另有 **6 张是语序/口气方向反了**（`You are a teacher?` ← 该问句）、**5 张是替换**、**3 张只差一个逗号**、**2 张是「多了一个 not」**（语义反向，不是缺）。这是文案与数据不符，不是数据缺陷。 | 高 |
| 8 | **`types.ts` 里 `wrongMark` 的注释数字已过期**：注释写 `1220 / 670 / 498 / 52`，现库实测 **`1228 / 674 / 502 / 52`**（前三项分别差 8 / 4 / 4）。第四项 52 一致。注释是批四十七写的，此后数据又长了 8 张卡。 | 高 |
| 9 | **「字段语义未文档化」清单另找到 8 处**，其中最重的是 **`HuntError.correction`**：它混着**三种语义**——给替换词（705 处）、删除指令（53 处）、以及**名为删除实为移动**（24 处，如 `"去掉（white 放到 cat 前面）"`），接口上一个字的说明都没有。 | 高 |
| 10 | 外部依据（§6）：**语言学习产品的「错处标记」与「改正写法」分开是行业惯例**。Cambridge 词典用 **`Not:`** 专标不可接受的形式，而其**正确形式另起一句给出**（`Look at the rain. Not: Look the rain.`）——同一页面上「哪里错」与「改成什么」是两个不同的呈现位。校对符号传统同理（caret 专表插入位置）。逐字引用见 §6。 | 中高 |

**最关键的一句话**：本批任务书里的第 5 次踩坑，**不是「又反推错了一次」，而是「用错了轴」**——任务书那三类按「词出现在哪一侧」切，而 `wrongMark` 的语义是按「词在编辑里干什么」定义的。前者是后者的**投影**，投影会丢信息：`mark="pen"` 在形态轴上落进「两边都有」（看起来像「口径高估错误率」），在角色轴上落进「位置锚点」（语义清晰无歧义）。**轴的错配才是这五批反复复发的根因**，而不是某个具体数字算错了。

**第二关键的一句**：本批唯一该动手的地方，**不在数据语义，在渲染层**。14 张划线错位 + 52 张的「缺了一块」误称（其中 16 张不适用），都是**代码/文案与数据契约不符**。把口径写进文档，正是为了让这类不符下次能被机械守门抓出来——而不是靠第 51 批再踩一次。

---

## ② 三类语义的数字核对（含口径与脚本）

### 2.1 六个候选约定并列：数字随口径移动

我把「`wrongMark` 是否出现在错句 / 正确句」在十种规范化约定下各算一遍（下表列六种代表）（脚本 `.audit50-brute2.mts`）：

| 判定约定 | 只在错句 | 两边都有 | 只在正确句 | 都没有 |
|---|---|---|---|---|
| 整串 · 词边界 · 区分大小写 | 563 | 111 | **0** | **0** |
| 整串 · 词边界 · 忽略大小写 | 556 | 118 | **0** | **0** |
| 整串 · 子串 · 区分大小写 | 444 | 230 | **0** | **0** |
| 整串 · 子串 · 忽略大小写 | 435 | 239 | **0** | **0** |
| 逐词 some · 词边界 · 区分大小写 | 511 | 163 | **0** | **0** |
| 逐词 some · 词边界 · 忽略大小写 | 504 | 170 | **0** | **0** |

**关键观察：第三列在六种约定下全部为 0。** 「划的词只在正确句」这个集合，无论怎么放宽，在库里都不存在。

### 2.2 复现 `499 / 110 / 65`：口径 T

任务书的三个数来自一个**更窄**的约定——它把 `wrongMark` 当作**单个 token 整体**，在规范化（小写 → 非 `[a-z0-9']` 转空格 → 折叠空格）后的句子里精确查找（脚本 `.audit50-t.mts`，独立重写，未引用同批其它脚本）：

```
有值 wrongMark 的对照卡 = 674
  单词标注 = 609
  多词标注 = 65

══ 口径 T（整串 token 精确）══
  只在错句 499 | 两边都有 110 | 第三桶 65  ⇒ 合计 674
  ⇒ 与任务书表 499 / 110 / 65 逐字一致：✅ 是
```

**数字成立，但成因与标签不符。** 第三个桶 65 张的构成（同一脚本）：

```
══ 第三桶的真实身份 ══
  第三桶 65 张中，多词标注 = 65，单词标注 = 0
  按「只在正确句」字面判据（口径 T）实测 = 0 张
```

**⇒ 第三个桶 100% 是多词标注，0% 是「划的词只在正确句」。**

原因很直接：口径 T 要求整串 `mark` 作为**一个 token** 出现。多词标注如 `"you are"` / `"Am I"` / `"not can"` 在句子里的 token 序列中是**分开的两个词**，因此**结构性地永远匹配不上**——它们只能落进残差桶。残差桶的标签「只在正确句」描述的不是这个残差。

### 2.3 「65」的歧义：库内恰好有两个量都等于 65

为免误判，我专门查了「这两个 65 是不是同一批卡」（脚本 `.audit50-65.mts`）：

```
集合 A「多词标注」            = 65
集合 B「等长换形/语序」        = 65
集合 A ∩ B = 27   （不是 0 ⇒ 是两批不同的卡）
```

**⇒ 从 `499 / 110 / 65` 这三个数字本身，无法判定当初算的是哪一个 65。** 但两者指向同一结论：**第三个桶都不是「划的词只在正确句」**（该语义实测 0 张）。

### 2.4 用真语义口径算，三类是 `501 / 173 / 0`

把约定放宽到「逐词 OR + 词边界 + 忽略大小写」——这才是判题与讲解代码实际用的口径：

```
══ 口径 S（逐词 OR · 词边界 · 忽略大小写 · 这才是真语义）══
  只在错句 501 | 两边都有 173 | 只在正确句 0 | 都没有 0  ⇒ 合计 674
```

（批次 50 表格写 499/110/65 时，我在另一份口径下另得 504/170/0；两次的差来自「是否剥离尾标点」，见 §7 自查记录。）

### 2.5 三类分类够不够用：**不够——缺一整个轴**

三类按「词出现在哪一侧」切（**形态轴**）。但 `wrongMark` 的语义不是这么定义的。我用 LCS 编辑脚本（自行实现）把每张卡拆成「从错句删掉什么（D）」与「要补进什么（I）」，再看标注词落在哪边（脚本 `.audit50-axis.mts`、`.audit50-cross.mts`）：

| 「命中删除集 × 是否有插入」 | 张数 |
|---|---|
| 命中删除集 × 有插入（= 替换型，划的就是该换掉的词） | 497 |
| 命中删除集 × 无插入（= 纯删除型，该词多余） | 83 |
| **位置锚点 × 有插入（= 划它只是指出「这儿缺东西」）** | **83** |
| 位置锚点 × 无插入 | 11 |

按**角色轴**合并：**「命中删除集」580 张 / 「位置锚点」89 张**（669 张有差异的卡；另有 5 张错句与正确句完全无编辑差异）。

**角色轴才是能读懂判题的那个轴。** 例：

| 卡 | mark | D（该删） | I（该补） | 划这个词的意思是 |
|---|---|---|---|---|
| L1 `I is Xiaomei.` | `is` | `is` | `am` | 「就是 is 这个词错了」 |
| L3 `I have pen.` | `pen` | — | `a` | 「**这个位置缺 a**，pen 本身没错」 |
| L9 `I go school.` | `school` | — | `to` | 「这个位置缺 to」 |
| L20 `Because it was cold, so I stayed at home.` | `so` | `because` | — | 「成对冲突，该留 so、删 because」（划的是保留下来的那一半） |

**⇒ 回答任务书的第 1 问：**
- **三个数字（499 / 110 / 65）在口径 T 下成立**，我逐字复现了；
- **但分类不够用**：① 第三个桶的标签指向一个空集（实测 0 张）；② 三类是形态轴，而语义在角色轴上——**必须补上「角色轴」（该换掉的词 / 位置锚点）**，两类即可，与形态轴并列使用。

---

## ③ `wrongMark` 与 `【】` 的分工与建议文档措辞

### 3.1 两套标记是什么（实测）

| 标记 | 语义 | 谁消费 | 实测规模 |
|---|---|---|---|
| `wrongMark`（**字段**） | 要**点击 / 划掉**的**位置**（题面交互用） | `grammarBoostService.locateMarkedTokens`（派生改错题的下标）、`GrammarLessonPage:243`（渲染删除线）、`grammarExplainService:709`（只对 spot 做讲解精确匹配） | 674 张 |
| `【】`（**讲解散文里的排版记号**） | 讲解里**改正后的形式**（教学展示用） | **零机器消费方**——只在渲染时原样输出 | 200 张对照卡、共 350 行、366 处 |

### 3.2 分工**没有文档**（任务书第 2 问的答案）

我查了三处：

1. **`src/types.ts` 的 `LessonContrast.wrongMark` 注释**（批四十七写）——全篇讲三类口径（`670 / 498 / 52`），**只字未提 `【】`**。
2. **`src/data/grammarLessons.ts` 的文件头注**——6 条设计依据，第 6 条只提「contrast 的 wrong 必须真错、correct 必须真对」，不涉及两套标记分工。
3. **全库 MD 文档**——`【】` 与 `wrongMark` 同现的只有 39 处，全部是**引用具体课文的实例**，没有一处定义二者的分工（最接近的是 `competitive-analysis-gave-2026-09-22.md:615`，称 `【】` 为「自标了缺块」——**这个说法对 200 张里的 92 张不成立**，见 §3.4）。

**⇒ 结论：无文档。** 而且 §3.4 会说明，正因为没有文档，连「`【】` = 缺块」这个流传的说法都是**部分错误**的。

**全库实测**（脚本 `.audit50-verify-report.mts`）：

```
contrast.whyZh 里含【】的对照卡 = 200 张（共 209 处【】）
  【】里有任一项 == wrongMark   = 12 张   ← 两套标记"碰巧一致"
  【】没有任何一项 == wrongMark = 188 张  ← 这才是"不一致"的真实张数
     其中 wrongMark 为空的        = 15 张
     其中 wrongMark 有值但两套不等  = 173 张
```

**⇒ 与本批表格说的「168 处疑似划错对象、结果全部正常」量级一致**（188 张 vs 168 处；差来自统计单位与「是否含 `wrongMark` 为空的双正解卡」）。**结论相同：这 188 张全部正常**——两套标记语义不同，不等是常态，不是划错对象。

**`【】` 出现的字段分布**（关键：**零污染题面**）：

| 字段 | 出现次数 |
|---|---|
| `contrast[].whyZh` | 200（卡）/ 209（处） |
| `guided[].correctionZh` | 92 |
| `guided[].explain` | 44 |
| `variants[].noteZh` | 10 |
| `deepDive.paragraphs[]` | 10 |
| `summary.rule` | 1 |
| **grammarLessons 合计** | **366 处** |
| `huntCases[].errors[].explanation` | 另有 367 处 |

**⇒ 全部落在「讲解散文」类字段，没有任何一处落在会被判题或拼装读取的槽位（`tokens` / `answer` / `options`）。** 这是两套标记能安全并行、互不干扰的**结构保证**。

### 3.3 建议的文档措辞（写进 `src/types.ts`，`LessonContrast` 上方）

> **`wrongMark` 与讲解里的 `【】` 是两套并行的标记，分工固定，不要互相校验：**
>
> | | `wrongMark`（字段） | `【】`（讲解散文里的记号） |
> |---|---|---|
> | **语义** | **要用户点击 / 要划掉的那个位置** | **改正之后应该写成什么** |
> | **消费者** | 机器（派生改错题的下标、渲染删除线、spot 讲解精确匹配） | 人（教学展示；**零机器消费方**） |
> | **何时用哪个** | 题面要出一个「点出有问题的地方」的交互时，**必须**用 `wrongMark` | 讲解要把「改成什么」摆给用户看时，用 `【】` |
> | **两者关系** | **可以不相等，且常常不相等**——`wrongMark` 指「哪里有问题」，`【】` 给「改成什么」；L81 `I sit between Tom to Amy.` 划 `to`、`【and】` 是正常设计，**不是划错对象** |
>
> **`wrongMark` 的取值有三种合法形态（判据是「它在编辑里演什么角色」，不是「它出现在哪一侧」）：**
> 1. **该换掉 / 该删掉的词**（580 张）：`I is Xiaomei.` 划 `is`——真错处就是它。
> 2. **位置锚点**（89 张）：`I have pen.` 划 `pen`——指「这个位置缺东西」，**`pen` 本身没错**。这一类的正确句一定更长（要补词）。
> 3. **成对冲突里保留下来的那一半**（属 580 张的子集）：`Because it was cold, so I stayed at home.` 划 `so`——指出「这对词只能留一个」。
>
> **禁止的用法**：不要把 `wrongMark` 与 `【】` 做一致性校验（两者语义不同，不等是常态）；不要用 `wrongMark` 是否为 `null` 区分「整句有问题」与「双正解」（判据是 `bothRight`，见下）。
>
> **多词标注**（65 张，如 `"you are"` / `"Am I"` / `"As soon"`）：表示**语序 / 位置问题**，`locateMarkedTokens` 会把它们展开成连续下标，命中其中任一都算对。**注意：多词标注在「单 token 精确」口径下永远匹配不上，任何按此口径统计的脚本都必须把多词标注单列，否则会得到假残差。**

并在 `LessonContrast` 上方补一句（当前完全缺失）：

> `wrong` / `correct` 的语义**随 `bothRight` 而变**：`bothRight` 省略时 `wrong` 是**真错句**；`bothRight: true` 时 **`wrong` 装的是另一句正确说法**（两句并排展示）。**全库 502 张双正解卡全部是后一种**。

### 3.4 顺带纠一处流传的错误说法

`competitive-analysis-gave-2026-09-22.md:615` 称 `【】` 是「自标了缺块」。按角色轴逐处实测（脚本 `.audit50-bracket.mts`，209 处 `【】` 全部归类）：

| `【】` 里的内容对应编辑的哪一半 | 处数 | 占比 |
|---|---|---|
| 只对应「要补进去的」（I）——**这才是「缺块」** | **155** | 74.2% |
| 只对应「要换掉的」（D）——是**替换**，不是缺 | 8 | 3.8% |
| 两者皆是 | 10 | 4.8% |
| 都不对应（多为纯标点补入） | 36 | 17.2% |

**替换型实例**（划的是该换掉的词，`【】` 给替换词）：

```
L125 lesson-125-it-looks-nice[3] 【is】  ❌"It is nice."       ✅"It looks nice."
L126 lesson-126-you-look-tired[5] 【are】 ❌"You are tired."   ✅"You look tired."
L163 lesson-163-myself[1]        【my】  ❌"I can do it my."   ✅"I can do it myself."
```

**⇒ 「`【】` = 缺块」只覆盖 155/209（74.2%）**，另有 **18 处是「替换 / 两者皆含」**（8 + 10），36 处是纯标点。**建议文档直接采用 §3.3 的措辞——「改正后的形式」，不含「缺」的暗示。**

---

## ④ 本批该不该改数据的判断

### 4.1 任务书结论的评估

任务书的结论是「**数据无需修改，只需补文档**」。

**我的独立判断：方向正确，但不完整。**

**方向正确**，三条证据：
1. 三类语义（499 / 110 / 65 的真实构成）**都是合理设计**——「该换掉的词」「两边都有的词（= 位置锚点）」「多词标注」都有明确教学意图。
2. `wrongMark` 与 `【】` 不一致的 200 张**全部正常**——两者本就是两套语义，不等是常态。
3. 我另做了全库不变量检查：**`mark ⊄ wrong` 的卡数 = 0 / 674**（`wrongMark` 字面始终出现在 `wrong` 里），且 `【】` 零污染题面槽位。**数据本身没有语义错误。**

**不完整**，因为本批我新查出 **3 处真实的、可复现的渲染层缺陷**——它们不是「数据语义」问题，但**是用户可见的缺陷**，且**正是「字段契约没写清」的直接后果**：

### 4.2 缺陷 A（高）：14 张卡的删除线划在错误的单词内部

`src/pages/GrammarLessonPage.tsx:241-255`：

```tsx
if (mark && item.wrong.includes(mark)) {
  const at = item.wrong.indexOf(mark);      // ← 子串语义，不是词边界
  return (<>{item.wrong.slice(0, at)}
    <span className="lesson-contrast-mark" style={{ textDecoration: "line-through" }}>{mark}</span>
    {item.wrong.slice(at + mark.length)}</>);
}
```

`indexOf` 是**子串**匹配。`mark="a"` 在 `"I have a apple."` 里第一次出现是 **`have` 中间那个 `a`**（下标 3）。用户实际看到的是：

```
L3  lesson-03-have[2]   mark="a"
    用户看到：I h〔a〕ve a apple.      ← 删除线划在 have 里面
    正确句　：I have an apple.
    标注想指：a → an

L4  lesson-04-want[1]   mark="an"
    用户看到：I w〔an〕t an book.      ← 删除线划在 want 里面
    正确句　：I want a book.

L19 lesson-19-and-but[5] mark="is"
    用户看到：My s〔is〕ter and I is happy.   ← 划在 sister 里面
    正确句　：My sister and I are happy.

L39 lesson-39-who-glasses[2] mark="he"
    用户看到：T〔he〕 boy who he wears glasses is my brother.  ← 划在 The 里面

L108 lesson-108-got-him-to[0] mark="go"
    用户看到：I 〔go〕t him go with me.     ← 划在 got 里面
```

**全库实测 14 张**（660 张划线位置正确），14 张**全部**是 `a / an / is / he / go` 这类会嵌进别的单词的短词。完整清单：

| # | 课 | mark | 删除线实际划在哪 |
|---|---|---|---|
| 1 | L3 `lesson-03-have[2]` | `a` | `h(a)ve` |
| 2 | L3 `lesson-03-have[4]` | `a` | `h(a)ve` |
| 3 | L4 `lesson-04-want[0]` | `a` | `w(a)nt` |
| 4 | L4 `lesson-04-want[1]` | `an` | `w(an)t` |
| 5 | L4 `lesson-04-want[2]` | `a` | `w(a)nt` |
| 6 | L4 `lesson-04-want[5]` | `an` | `w(an)t` |
| 7 | L7 `lesson-07-we[3]` | `a` | `(a)re` |
| 8 | L11 `lesson-11-plural[4]` | `a` | `(a)te` |
| 9 | L19 `lesson-19-and-but[5]` | `is` | `s(is)ter` |
| 10 | L39 `lesson-39-who-glasses[2]` | `he` | `T(he)` |
| 11 | L41 `lesson-41-two-things[1]` | `he` | `t(he)` |
| 12 | L108 `lesson-108-got-him-to[0]` | `go` | `(go)t` |
| 13 | L110 `lesson-110-who-makes-who[2]` | `go` | `(go)t` |
| 14 | L194 `lesson-194-such-a[0]` | `a` | `w(a)s` |

**为什么这是「缺文档」的后果**：判题侧（`grammarBoostService.locateMarkedTokens`）**已经**用 `cleanWord` 做了词边界消歧，并专门写了 L66 / L170 的回归测试；渲染侧却用裸 `indexOf`。**两处对同一个字段的口径不一致**——正因为字段的契约（「`wrongMark` 是词，不是子串」）只写在 `locateMarkedTokens` 的 docstring 里，没写在 `types.ts` 的字段定义上，渲染侧的作者无从得知。

**修法（本批不改，仅建议）**：把 `indexOf` 换成词边界查找，与 `locateMarkedTokens` 同口径；或直接复用 `locateMarkedTokens`。

### 4.3 缺陷 B（中）：52 张「无标注」卡被 UI 一律称作「缺了一块」

`GrammarLessonPage.tsx:343`：`{!mark && <span className="lesson-contrast-hole">缺了一块</span>}` —— **无条件**渲染。按机制分类这 52 张：

| 机制 | 张数 | 「缺了一块」是否成立 |
|---|---|---|
| 插入（真的缺词） | **36** | ✅ 成立 |
| 语序 / 口气方向反了（`You are a teacher?` ← 该问句） | **6** | ❌ 不是缺，是**位置不对** |
| 替换（`This is the book I read it.` ← `which I read`） | **5** | ❌ 不是缺，是**该换** |
| 只差一个逗号 | **3** | ❌ 不是缺，是**该点个逗号** |
| 多了一个 `not`（语义反向） | **2** | ❌ 恰恰相反——是**多了**，不是缺 |

**⇒ 52 张里 16 张的文案不成立。** 这是文案与数据不符（不是数据缺陷）。建议改为中性表述，如「这句有问题」/「这组要留意」。

### 4.4 缺陷 C（中）：`HuntError.correction` 三种语义混用，接口无说明

见 §5.2。这是**文档缺失**（不是数据错误），但已造成上游设计文档需要靠人工判读（如 `prd-grammar-as-soon-as-2026-09-20.md:852` 要专门注明「单 token 可修的补词型写法」）。

### 4.5 该修的清单（本批只登记，不改）

| 优先级 | 项 | 位置 | 性质 |
|---|---|---|---|
| **P1** | 14 张划线错位 → 改用词边界查找 | `GrammarLessonPage.tsx:243` | 代码缺陷（用户可见） |
| **P2** | 52 张「缺了一块」文案（16 张不成立） | `GrammarLessonPage.tsx:343` | 文案与数据不符 |
| **P2** | `wrongMark` 注释数字过期（1220/670/498 → 1228/674/502） | `src/types.ts:584-586` | 注释漂移 |
| **P2** | 补 §3.3 的两套标记分工文档 | `src/types.ts` `LessonContrast` 上方 | 文档缺失（**本批核心交付**） |
| **P3** | `guided.tokens` 注释「arrange 含干扰项」与现库不符 | `src/types.ts` `LessonGuidedStep.tokens` | 注释漂移（见 §5.1） |
| **P3** | `HuntError.correction` 三语义补说明 | `src/types.ts:468-474` | 文档缺失 |
| **P3** | `guided.answer` 的语义契约写进接口注释 | `src/types.ts` `LessonGuidedStep.answer` | 文档缺失（**批 44 缺陷 1 的根因**） |

**⇒ 对任务书第 3 问的答案：数据文件本身不改（任务书结论成立），但「只需补文档」不完整——另有 2 处渲染层缺陷（1 个 P1）该修。**

---

## ⑤ 其它未文档化字段清单

### 5.1 `src/types.ts` 中注释缺失或与实际不符的字段

我逐字段核对了 `GrammarLesson` / `LessonContrast` / `LessonGuidedStep` / `LessonPracticeStep` / `LessonRecall` / `HuntCase` / `HuntError`。

**（a）注释完全缺失——且缺失的正是语义最绕的那些：**

| 接口 | 缺注释字段 | 为什么必须补 |
|---|---|---|
| `LessonGuidedStep` | **`answer`** | **这正是批 44 缺陷 1 的根因**。语义**随 `kind` 而变**：`choose` / `arrange` / `replace` 是**正面槽**（用对了的词/句，共 1019 道）；**`spot` 是负面槽（那个错词，204 道）**。注释只在 `src/services/grammarExplainService.ts:706-708` 里，且是**反着写的**（「choose/arrange 的 answer 是用对了的词」）。字段定义处一个字都没有。 |
| `LessonGuidedStep` | `explain` | 与 `correctionZh` 的分工未写（`explain` 是解析，`correctionZh` 是「点对之后的纠正说法」）。 |
| `LessonPracticeStep` | `promptZh` / `tokens` / **`answer`** | `tokens` 与 `distractors` 的合并规则只写在 `GrammarLessonPage.tsx:209`；`answer` 与 `tokens` 的关系未写（实测 **1047/1047 全部是 `tokens` 的排列**，`distractors` 在库外另存、不混进 `tokens`）。 |
| `LessonRecall` | `promptZh` / **`answer`** | `intentZh`（中文意图句）与 `answer`（英文整句）的分工未写。 |
| `LessonContrast` | **`wrong`** / **`correct`** / `whyZh` | 三者的语义**随 `bothRight` 而变**（见 §3.3 建议措辞）。尤其 `wrong`：`bothRight: true` 时它装的是**正确句**。 |
| `GrammarLesson` | 14 个（`id`/`number`/`title`/`episode`/`sceneSetupZh`/`dialogueEn`/`dialogueZh`/`intentZh`/`targetSentence`/`blocks`/`oneLineRule`/`examples`/`guided`/`practice`） | 其中 `targetSentence` 承载难度守门（相邻课最长分句词数不跳超 5 词），却无注释；`blocks` 的 `role` 是「大白话角色」（红线相关）也无注释。 |
| `HuntCase` | `id` / `number` / `title` / `scene` / `tokens` / `errors` | `tokens` 是**案件全文的词块序列**、`errors[].tokenIndex` 指向它——这条只在 `HuntError` 的接口头写了一句，`HuntCase.tokens` 自己没写。 |
| `HuntError` | **`original`** / **`correction`** / **`explanation`** / `tag` | 见下 (b)。 |

**（b）注释与实际不符（漂移）——实测 3 处：**

| # | 字段 | 注释写的 | 实测 | 差 |
|---|---|---|---|---|
| 1 | `LessonContrast.wrongMark`（`types.ts:584-586`） | 1220 张对照卡 / 670 有值 / 498 双正解无值 / 52 整句层面 | **1228 / 674 / 502 / 52** | 8 / 4 / 4 / **0** |
| 2 | `LessonGuidedStep.tokens`（`types.ts:533`） | 「arrange **含干扰项**」 | `guided.arrange` **611 道，词块数 > 答案词数 = 0 道**（answer 是 tokens 的排列：611/611）——**没有一道含干扰项** | 注释与现库不符 |
| 3 | `HuntError.correction` | （无注释）——而它混着**三种语义** | 给替换词 **705** / 删除指令 **53** / 名为删除实为移动 **24** | 未文档化 |

**`HuntError.correction` 的三语义证据**（脚本 `.audit50-hunt.mts`）：

```
换词(给替换词): 705   e.g. original="move"  correction="moved"
删除指令      : 53    e.g. original="so"    correction="去掉 so"
删除指令带括号 : 24    e.g. original="white." correction="去掉（white 放到 cat 前面）"
                        ↑ 名为「去掉」，实为「移动位置」
只补标点      : 13    e.g. original="eat"   correction="eat,"
矛盾(说没问题) : 1     e.g. hunt-so-do-i idx=11 original="dance" correction="dance."
                        explanation="这句没问题——both sing and dance 形状对称"
```

**⇒ 一个字段装四种语义（替换 / 删除 / 移动 / 加标点），其中 1 处 `explanation` 明说「这句没问题」却仍登记在 `errors` 里。** 上游 PRD 已经要手工标注「单 token 可修的补词型写法」（`prd-grammar-as-soon-as-2026-09-20.md:852`）来绕开这个不确定性——这就是缺文档的实际代价。

### 5.2 附带查出的其它不一致（均为脚本假象或个案，登记备查）

| 项 | 实测 | 判定 |
|---|---|---|
| `guided.spot` 的 `answer` vs `wrongToken` 逐字不同 | **2 道**（L96 / L102：`answer="rain"` vs `wrongToken="rain."`） | **非缺陷**——`grammarBoostService.ts:795-800` 已显式兜住（先严格匹配、不中则按去尾标点匹配），注释里点名了 L96/L102 这两处。**说明这是已知且已处理的口径差，但字段定义处没写。** |
| `practice` 的 `answer` 与 `tokens` 多重集不一致 | 1 道（L172） | **脚本假象**——我的 `clean` 未去词块尾随空格；修正后 1047/1047 全部一致。**不是数据缺陷。** |
| 3 处 `arrange` 题的 `answer` 排序差异 | 0 | 同上，已澄清。 |
| `huntCases` 的 `reviewed` | **213/213 全部 `true`** | 无省略值，R15 守门已全量满足。 |
| `huntCases` 的 `notes` | 仅 19 案有 | 符合「超出核心词汇门槛才需提示」的设计。 |

---

## ⑥ 外部依据

**结论：可访问的权威依据存在，但「双轨标记」这一具体设计没有直接以该名义命名的行业标准。** 我拿到两条高相关的逐字引用。

### 6.1 Cambridge 词典：错处标记与改正写法是两个呈现位

Cambridge 的语法页用 **`Not:`** 专标不可接受的形式，而**正确形式由前一句单独给出**——「哪里错」与「改成什么」在版面上分开，与本项目 `wrongMark`（位置）/ `【】`（改正形式）的分工同构。

来源：`https://dictionary.cambridge.org/grammar/british-grammar/look-at`（WebFetch 可达，逐字引用）

> "When look has an object, it is followed by at: Look at the rain. It's so heavy. Not: Look the rain."

> "I really want to see the new Rocky movie but Nancy said she's not interested in that. Not: I really want to watch the new Rocky movie …"

> "At night, I like to watch the television. Not: …I like to see the television."

同一约定在 `https://dictionary.cambridge.org/grammar/british-grammar/say-or-tell` 一致出现（逐字）：

> "'Hello,' she said. Not: 'Hello,' she told."

> "Not: And then she said me …"

**⇒ 权威教学材料的通行做法：把「不可接受的形式」与「正确形式」作为**两个独立的呈现位**排版，前者带符号标记、后者作为示范。这与本项目「`wrongMark` 标位置、`【】` 给改正形式、两者不需要相等」完全一致。**

**诚实的限制**：Cambridge **没有**在任何可达页面上明文定义 `Not:` 这个记号本身（我查了 `help/help.html`（404）、`help/codes.html`（只讲 `[C]`/`[U]` 这类词性标签）、`common-mistakes-in-english`（无说明文字）——都是「用了但不解释」）。所以这条依据支持**惯例存在**，不支持**惯例有明文标准**。

### 6.2 校对符号传统：位置标记也是独立的一套

Caret（插入符 `^`）在编辑/校对传统中专表**插入位置**——正是「划哪里」与「改成什么」分开的另一例证。

来源：`https://www.vocabulary.com/dictionary/caret`（WebFetch 可达，逐字引用）

> "a mark used by an author or editor to indicate where something is to be inserted into a text."

**⇒ 这与本项目「位置锚点」类（89 张，如 `I have pen.` 划 `pen` 指此处该补 `a`）的语义直接对应**：标记指向**位置**，而不是指控该位置上的那个词。

### 6.3 抓不到的部分（明说）

以下尝试均失败，**未获得**逐字引用：

| 目标 | 结果 |
|---|---|
| `en.wikipedia.org/wiki/Proofreading` 及 `/List_of_proofreading_marks` | 连接超时（443，多次重试） |
| `en.wikipedia.org/wiki/Caret`、`simple.wikipedia.org/wiki/Caret` | 连接超时 |
| `merriam-webster.com`、`collinsdictionary.com`、`dictionary.com`、`britannica.com` | HTTP 403 |
| `thoughtco.com/proofreading-marks-and-symbols` | HTTP 402 |
| `teachingenglish.org.uk/.../error-correction` | HTTP 404 |
| `learnenglish.britishcouncil.org/grammar/english-grammar-reference/present-simple` | 可达但页面**不描述**错处如何标记（只有练习链接） |
| Wikipedia API（`curl` 直连） | 连接超时 |

**⇒ 因此 §6 只能给「惯例存在」的旁证（Cambridge `Not:` + caret 定义），不能给「双轨标记是行业标准」的强断言。** 若需要更强依据，建议下一批用可直连的网络环境补查 ESL 教材的 error-correction code 表（如 Scrivener / Harmer 的 correction symbol 清单）。

---

## ⑦ 自我核查记录（命令 + 输出）

**全部命令一键复现**：`bash /Users/liujun/Documents/英语听写/deliverables/product-strategy/RUN-AUDIT50.sh`

### 7.0 核查纪律

- **不用 grep**：本机 `grep` 是 ugrep，对词边界模式会假返回 0。全部词形判定用 **node 词边界正则** `(?<![A-Za-z-])W(?![A-Za-z-])`。
- **不用文本扫描**：18 个脚本全部经 `vite-node` **载入真实数据模块**（`src/data/grammarLessons.ts` / `huntCases.ts`），拿到运行时对象，不存在「扫到注释或代码」的污染。
- **不改任何东西**：脚本只读；`git status` 确认我只新增了 `deliverables/product-strategy/.audit50-*.mts` 与 `RUN-AUDIT50.sh`，**未触碰任何 `src/` 文件**。
- **带 `g` 的正则不用于 `.test()`**：沿用批四十七脚本的纪律（`lastIndex` 有状态会少算）。

### 7.1 三类语义的十口径扫描（`.audit50-brute2.mts`）

```
非空 wrongMark 卡总数 = 674；单词标注 = 609；多词标注 = 65
单词/多词 合计校验：674 === 674

整串·词边界·区分大小写          onlyWrong= 563 both= 111 onlyCorrect=   0 neither=   0
整串·词边界·忽略大小写          onlyWrong= 556 both= 118 onlyCorrect=   0 neither=   0
整串·子串·区分大小写            onlyWrong= 444 both= 230 onlyCorrect=   0 neither=   0
整串·子串·忽略大小写            onlyWrong= 435 both= 239 onlyCorrect=   0 neither=   0
逐词 some·词边界·区分大小写     onlyWrong= 511 both= 163 onlyCorrect=   0 neither=   0
逐词 some·词边界·忽略大小写     onlyWrong= 504 both= 170 onlyCorrect=   0 neither=   0
逐词 every·词边界·忽略大小写    onlyWrong= 526 both= 148 onlyCorrect=   0 neither=   0
```

**⇒ 第三列（只在正确句）八种约定全部为 0。**

### 7.2 复现 `499 / 110 / 65`（`.audit50-t.mts`，独立重写）

```
有值 wrongMark 的对照卡 = 674
  单词标注 = 609
  多词标注 = 65

══ 口径 T（整串 token 精确）══
  只在错句 499 | 两边都有 110 | 第三桶 65  ⇒ 合计 674
  ⇒ 与任务书表 499 / 110 / 65 逐字一致：✅ 是

══ 第三桶的真实身份 ══
  第三桶 65 张中，多词标注 = 65，单词标注 = 0
  按「只在正确句」字面判据（口径 T）实测 = 0 张

══ 口径 S（逐词 OR · 词边界 · 忽略大小写）══
  只在错句 501 | 两边都有 173 | 只在正确句 0 | 都没有 0  ⇒ 合计 674
```

### 7.3 角色轴（第四类是否存在）（`.audit50-axis.mts` + `.audit50-cross.mts`）

```
══ 交叉表：标注词角色 × 是否有插入 ══
  命中删除集 × 有插入                    497
  命中删除集 × 无插入(纯删除)               83
  位置锚点 × 有插入                     83
  位置锚点 × 无插入(纯删除)                11
⇒ 按角色轴合并：「命中删除集」580 / 「位置锚点」89（+ 5 张无编辑差异）
```

### 7.4 渲染层缺陷 A：14 张划线错位（`.audit50-uirender.mts`）

精确复刻 `GrammarLessonPage.tsx:241-255` 的 `indexOf` 逻辑：

```
有 wrongMark 的对照卡 674 张；其中 UI 划线错位 14 张

L3 lesson-03-have[2]  mark="a"
   用户看到：I h〔a〕ve a apple.
   正确句　：I have an apple.
   被划掉的是「have」这个完整词里的一段（不是标注想指的那个词）
...（共 14 张，完整清单见 §4.2）

划线位置正确的 660 张。
```

### 7.5 渲染层缺陷 B：52 张「缺了一块」（`.audit50-nomark.mts`）

```
「无 wrongMark 且非 bothRight」卡数: 52
按「机制」分类（UI 对这 52 张全部渲染「缺了一块」）：
  insertion      36   ← 真的缺词
  deletion       2    ← 多了一个 not（语义反向）
  substitution   5    ← 该换
  reorder        6    ← 语序/口气方向反了
  punct          3    ← 只差一个逗号
  case           0
```

### 7.6 `【】` 的字段分布（`.audit50-docdrift.mts`）

```
grammarLessons 中含【】的字段（按出现次数）：
  contrast[].whyZh ×200
  guided[].correctionZh ×92
  guided[].explain ×41
  variants[].noteZh ×10
  deepDive.paragraphs[] ×6
  summary.rule ×1
  ⇒ 全部落在「讲解散文」类字段；没有一个落在会被判题/拼装读取的槽位（tokens/answer/options）。
huntCases 中含【】的字段：errors[].explanation ×365
```

**并在 `src/` 全量搜索机器消费方**：无任何正则 / `split` / `match` 在 `【` 或 `】` 上做解析（仅有 `stripNoteMarkers` 处理**半角** `[tag:word]` 内部标记，与全角 `【】` 无关）。

### 7.7 `types.ts` 注释漂移（`.audit50-docdrift.mts`）

```
对照卡总数        注释 1220  实测 1228   差 8（注释已过期）
wrongMark 有值    注释  670  实测  674   差 4（注释已过期）
bothRight+无值    注释  498  实测  502   差 4（注释已过期）
非双正解+无值     注释   52  实测   52   一致

guided.arrange 共 611 道
  词块数 > 答案词数（=「含干扰项」）: 0  ⇒ 注释与现库不符（无一道含干扰项）
  answer 是 tokens 的排列: 611；不是: 0
```

### 7.8 `HuntError.correction` 三语义（`.audit50-hunt.mts`）

```
HuntError 总数 796
  换词(给替换词): 705
  删除指令: 53
  删除指令带括号: 24      ← 名为删除、实为移动
  只补标点: 13
  矛盾(说没问题): 1
```

### 7.9 既有守门回归：**1 项失败，与本批无关**

```
$ ./node_modules/.bin/vitest run src/data/grammarLessons.test.ts src/services/huntService.test.ts
 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 65 passed (66)
```

失败项：`src/data/grammarLessons.test.ts:503` —

```
lesson-26-there-be「Is there a computer on the table?」含未教过的词：computer
（用户既没在课内见过、也无从猜出，必然卡住）
```

**归属核查**（证明与本批无关）：

```
$ git show HEAD:src/data/grammarLessons.ts | grep -c computer   # lesson-26 段
HEAD 版 lesson-26 段里 computer 出现次数: 0
$ node -e "..."                                                  # 工作区
工作区 lesson-26 段里 computer 出现次数: 2
$ find src -newermt '-40 minutes' -name '*.ts' -o -name '*.tsx'
(无输出 —— 本批未触碰任何 src 文件)
```

**⇒ 这是工作区里**已存在的未提交改动**引入的失败（`src/data/grammarLessons.ts` 在 `git status` 里显示为 ` M`，改动早于本批），**不是本批造成，也不影响本批任何结论**。但按纪律必须登记：**本批交付时，该守门是红的**。

---

## ⑧ 不确定项

| # | 不确定项 | 我做了什么 | 仍不确定什么 |
|---|---|---|---|
| 1 | **第三个桶 65 的两种可能所指** | 查出库内恰好有两个量都等于 65（多词标注 = 65、等长换形/语序 = 65），`A ∩ B = 27` | **无法判定任务书当初算的是哪一个**。但从三个数字本身不可判别，所以我用「两个都不是『只在正确句』」这个更弱的结论——它可判别且足够。 |
| 2 | **499 与 501/504 的差** | 定位到差异源是「是否剥离词尾标点 + 是否忽略大小写」：区分/忽略大小写差 7 张，剥离标点再差 3 张 | **无法复现任务书当时的具体实现细节**（源脚本未留存）。趋势与结论不受影响（三类关系不变、第三类恒为 0）。 |
| 3 | **`【】` 里的内容究竟全属「改正形式」吗** | **已全量核对 209 处**（脚本 `.audit50-bracket.mts`）：155 处只对应「要补的」、8 处只对应「要换的」、10 处两者皆是、36 处纯标点 → **209/209 全部是「改正后的形式」，无一例外**。「改正形式」这个断言**已全量验证**；被推翻的只是「缺块」这个更窄的说法（只覆盖 74.2%） | 「纯标点」那 36 处（如 `【,】` `【?】`）是否算「形式」还是算「标记」——**分类边界有主观性**，但不影响结论。 |
| 4 | **14 张划线缺陷是否真的会被用户看到** | 精确复刻了 `indexOf` 逻辑与渲染顺序（`slice(0,at)` + span + `slice(at+len)`），并确认该分支 `!revealed` 时才不渲染、揭示后必渲染 | **未在真实浏览器里截图验证**。风险很低（纯字符串逻辑，已在脚本里逐字复现），但严格说属「推断 + 逻辑复刻」而非端到端实测。 |
| 5 | **§6 的行业惯例强度** | 拿到 Cambridge `Not:`（3 页一致）与 caret 定义两条逐字引用 | **没有一份权威标准明文规定「双轨标记」这个设计**。Wikipedia 校对符号表、Merriam-Webster、Collins、ThoughtCo 全部抓取失败（超时/403/402）。所以只能称「惯例存在」，不能称「行业标准」。 |
| 6 | **本批守门红灯的归属** | 用 `git show HEAD` vs 工作区对比证明 `computer` 是**本批之前**的改动引入 | **该失败何时、由哪一批引入，我没有查 `git log` 逐条定位**——因为本批范围是「只做研究」。若需要，这是下一批的登记项。 |
| 7 | **`hunt-so-do-i` 的「矛盾」登记** | 实测 1 处：`explanation` 写「这句没问题——…这里的陷阱是要分清 two 的搭档是不是对称」，却仍登记在 `errors[]` 里 | **未判定这是设计意图（故意放的陷阱）还是数据笔误**。它不属于本批主题，登记备查。 |

---

## 附：本批交付物清单

| 文件 | 用途 |
|---|---|
| `/Users/liujun/Documents/英语听写/deliverables/product-strategy/user-research-audit-closure-2026-09-23.md` | 本报告 |
| `/Users/liujun/Documents/英语听写/deliverables/product-strategy/RUN-AUDIT50.sh` | 一键复现（20 个核查脚本 + 既有守门回归） |
| `.audit50-brute2.mts` | 十种判定约定并列（数字随口径移动） |
| `.audit50-final.mts` | 反解 499/110/65 + 第四类初筛 |
| `.audit50-t.mts` | **独立复现口径 T + 第三桶真实身份** |
| `.audit50-axis.mts` / `.audit50-cross.mts` | **角色轴（LCS 编辑脚本）+ 交叉表** |
| `.audit50-65.mts` | 两个 65 是否为同一批卡 |
| `.audit50-decomp.mts` | 170 张「两边都有」机制再切 + 异常复核 |
| `.audit50-uirender.mts` | **14 张划线错位（复刻 UI 逻辑）** |
| `.audit50-nomark.mts` | **52 张「缺了一块」机制分类** |
| `.audit50-wrongmark-classes.mts` | 【】vs wrongMark 不一致条数 + 字段分布 |
| `.audit50-verify-report.mts` | 【】 规模与不一致张数的精确复核（§3.2 用数） |
| `.audit50-bracket.mts` | **【】 内容按编辑角色归类（推翻「【】=缺块」）** |
| `.audit50-fields.mts` | 字段注释覆盖扫描（按接口 × 按字段） |
| `.audit50-docdrift.mts` | types.ts 注释数字 vs 现库 |
| `.audit50-hunt.mts` | HuntError.correction 三语义 |
| `.audit50-spot2.mts` / `.audit50-distract.mts` | spot 逐字差 / distractors 机制 |
| `.audit50-cnt.mts` / `.audit50-final-check.mts` | 全库量级 + 对照卡二分/题型分布 |
