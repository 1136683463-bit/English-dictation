# PRD · 幻影项证伪 + 课内冗余清零 + `several` 刻度卡

**批次**：第五十五批 · 2026-09-23
**主题**：三个携带项全部裁定完毕（两个不做、一个改形态），并查出一类**从未被守门覆盖**的缺陷
**状态**：已落地（3 项裁定 + 4 张重复卡 + 7 道重复题 + 2 道新守门）

---

## 一、一句话

本批要做的三个携带项里，**「`loud`/`careful` 对照卡」是一个幻影**——它已经交付了 4 天、却被连续登记了 10 批；
`*tell to + 人` 防错经查**不该做**（会写出一条被权威源打脸的硬错）；
只有 `several` 是真缺口，按上游既有裁定做成**刻度卡**而非错卡。

普查过程中还发现**一类此前从未被守门覆盖的缺陷**：4 课有逐字重复的对照卡、10 课有完全相同的练习题。

---

## 二、裁定一：`loud` / `careful` 对照卡 —— **幻影项，结案**

### 2.1 三条独立证据

| # | 证据 | 内容 |
|---|---|---|
| ① | **两张卡都已存在** | L58 `contrast[5]` = `He reads loud.` ❌ → `He reads loudly.`（即计划卡⑥）；`contrast[4]` = `He does his homework carefully.` ✅ 双正解（即计划卡⑤）|
| ② | **交付时就已存在** | `git show 7ad13f5:src/data/grammarLessons.ts`（2026-09-19 06:33，L58 首次落地的那次提交）里两张卡逐字即在；而携带项最早登记于 2026-09-22，**晚 3 天** |
| ③ | **项目自己已复核过并给出相反结论** | `competitive-analysis-base-form-gaps-2026-09-22.md` 对 `loud` 的裁决是「❌ 不处理……L58 逐字 `wrong: "He reads loud."` → `correct: "He reads loudly."`……L58/L59 已教」|

`loud` → `loudly` 的案件覆盖也已存在：`hunt-sports-report#13`（`tag: word_order`，`loud` → `loudly`），
且只有 L58 引用该案。

### 2.2 幻影是怎么产生的

登记它的那一批把 L58 的 `wrongMark` 语义（「划这里」的**位置指示**）误读为「这个词本身错了」，
于是把「`loud`/`careful` 两个词没被正面用过」当成「缺对照卡」；
而修复建议「给 L58 加一张卡即可」**从未被核对过 L58 是否已有该卡**。

**这条建议本身在数据上也不可能执行**：L58 属于 201 个「恰好 6 张卡」的课，
再加一张就变成第 7 张，破坏分布——而分布是这个项目刻意维持的设计常量。

⇒ **从路线图携带清单删除（结案），标注「已交付于 `7ad13f5`，登记有误」。**

---

## 三、裁定二：`*tell to + 人` 防错卡 —— **不做**

### 3.1 决定性理由：这条规矩会写错

路线图把它描述为「与 `*say + 人` 配对」，但**两者不对称**：

| | `say` | `tell` |
|---|---|---|
| 人直接跟在后面 | ❌ **绝对不行** | ✅ 通常要求 |
| 人放后面垫 `to` | ✅ 唯一办法（`say sth to sb`） | ✅ **也可行**（`tell sth to sb`）|

**OALD `tell_1` 逐字**（本轮独立核验，非转述）：

> `tell something to somebody` — `He told the news to everybody he saw.`
> `tell somebody something` — `He told everybody he saw the news.`
> Which Word 注：**`"Say never has a person as the object."`** ／ **`"Tell usually has a person as the object and often has two objects"`**
> 该页两条 `NOT` 例句打的都是**反方向**：`The doctor said me to stay in bed.`

Cambridge "Say or tell?" 同向：该页全部 `Not:` 例句（`*said me`、`*told` 缺人）**没有一处**把 `*tell to + 人` 列为错误。

⇒ 写「`tell` 后面不垫 `to`」是一句**会被权威源打脸的硬错**。`hunt-fridge-note` 那类纠正**不存在**。

### 3.2 其余三条理由

2. **没有入口，就没有伤害路径**（本项目批四十九裁定 `say` 时用过的原话）：`tell` 家族在**产出位 0 处**——`targetSentence` / `guided.answer` / `practice.answer` / `recall.answer` 全部零。用户即便想写 `*I told to...` 也**没有词块可选**。
3. **判据三条里两条不过**：原形从未当主角（0 课）、不属 L10/L11 第一批。仅「高频功能词」部分成立——而这条单独成立在批四十八已被判为无效理由。
4. **同屏会新增混淆**：这张卡必须与既有的 `*say + 人` 卡并列，而两卡会给出**结构相反**的话（`say` 要垫 `to`、`tell` 不要）。中文侧两个词都是「说」，零基础用户**没有信号**区分，这是新增混淆而非防错。

### 3.3 但发现一条可优化的泄漏路径（7 个字符串）

课程里有 **11 处中文题干用了「告诉」**（L2/L3/L6/L7/L13/L23/L26/L29/L64/L107/L146），
其中 **7 处是题干**。中文「告诉」会诱导用户去够 `tell`。
堵它的正确动作是**改中文措辞**（「告诉妈妈」→「跟妈妈说」——本项目在 L38 已用「跟谁说」的说法），
**成本 7 个字符串，而不是新增一张描述另一条规矩的卡**。已登记（本批未动，见 §六）。

---

## 四、裁定三：`several` —— **做刻度卡（不是错卡）**

上游 `competitive-analysis-b-tier-closure-2026-09-21.md` 已裁定 `several` 为 **B−「不撑一课」**，
理由是「**3 标记约束不可满足**」（`several`/`a few`/`some` 三选一语法全对，标不出错），
并给出处置：**「改 L114 的刻度卡」**。

本批按此执行：把 L114 `contrast[3]` 换成 `several` 刻度卡。选 L114 的理由：

1. **同轴**——L114 的轴是「数得清的少量刻度」（`a few`/`few`/`a little`），`several` 是 `a few` 与 `many` 之间的第三格。
2. **门已经开着**——L114 `deepDive` 明写「第 30 课学过说『一些』……今天再补一格」，而 `contrast[4]` 就是拿 L30 的 `some` 做刻度对照。加 `several` 是**同一动作的延伸**，不是外来插入。
3. **邻近课都不合适**——L113 是 `-ed/-ing` 形容词、L115/L116 是 `have got`，与数量刻度无关。

**为什么必须是双正解卡**：三者互换语法全对，做成 ❌ 卡会重演 L114 卡① 曾踩过的坑
（该卡的注释逐字记录了「把语法正确的话标成错句，用户答『没问题』被判错」的事故）。

零术语措辞（`可数`/`不可数`/`副词`/`形容词` 均在禁用表内）：

> 两句都对——several 是「三五个」：比 a few 再多一点，但还没到「很多」。a few 说「还有几个」，several 说「有好几个」，都在这条刻度上。

---

## 五、普查中发现的新缺陷类：**课内冗余**（此前零守门覆盖）

### 5.1 数据

| 类型 | 数量 | 样本 |
|---|---|---|
| **逐字重复的对照卡**（`wrong` + `correct` 双同）| **4 课** | L61 `[3]≡[4]`、L71 `[1]≡[4]`、L97 `[0]≡[2]`、L114 `[0]≡[3]` |
| **完全相同的练习题**（`answer` + `tokens` + `distractors` 三同）| **10 课 / 7 对** | L3、L13、L29、L58、L59、L64、L91、L97、L128、L129 |

它们**全部通过了原有 38 项课程守门**——因为**此前没有任何一条断言检查课内唯一性**。

### 5.2 处置

全部替换为**本课自己素材**里的新粒度（不引入课外语料，D 层安全）：

| 课 | 原重复内容 | 换成 | 来源 |
|---|---|---|---|
| L58 | `She reads carefully.` ×2 | `He does his homework carefully.` | **恢复交付时的原题**（被批 16–39 误覆没）|
| L114 | `few apples` 双正解 ×2 | **several 刻度卡** | 见 §四 |
| L61 | `Close the door, please.` ×2 | `Could you close the door, please?` | 本课 examples/variants |
| L71 | `It is too heavy to carry.` ×2 | `He is old enough.` | 本课 examples/sceneSwings |
| L97 | `When you called, I read a book.` ×2 | `Were you reading when I called?` | 本课 variants |
| L3 | `I have a new cup.` ×2 | `I don't have a new bag.` | 本课 variants |
| L59 | `She sings very well.` ×2 | `He runs very fast.` | 本课 examples（第二个常客 `fast`）|
| L91 | `Before I sleep, I drink water.` ×2 | `After I do my homework, I watch TV.` | 本课 examples |
| L97 | `When you called, I was reading.` ×2 | `When you called, I was sleeping.` | 本课 examples |
| L128 | `That sounds great.` ×2 | `That sounds nice.` | 本课 examples |
| L129 | `The soup smells good.` ×2 | `The soup does not smell good.` | 本课 variants |

**L58 那处可追溯到具体提交**（`7ad13f5` 交付时是 `He does his homework carefully.`，
`af1b9f1` 替换并追加同题 ⇒ 净效果是**丢掉一道不同的题**换来一道重复题）。

### 5.3 新增守门（两道，互为独立复核）

| 位置 | 守什么 |
|---|---|
| `grammarLessons.test.ts` | 课内对照卡唯一性 + 课内练习唯一性 + **判据自检**（合成反例必须被判出，防退化成空转）|
| `rv13-lesson-redundancy.test.tsx` | 同一件事的独立复核 + **位点覆盖**：每张卡都必须落在某个渲染位点内（页三位点是 `[0,2)`/`[2,4)`/`[4,∞)`，卡若落到 6 之外就**永不渲染**，是一条静默失效路径）|

**守门已验证双向有效**：注入一张「`wrong`+`correct` 都不重复」的新卡 → 闸保持绿；
注入一张真重复 → 闸立即变红。

---

## 六、诚实登记

### 6.1 新登记：`quietly` —— 全库零出现

| 词 | 作答位 | 展示为正确 | 展示为错 |
|---|---|---|---|
| `quietly` | **0** | **0** | **0** |
| `quiet`（形容词）| 有（L16/36/77/179/185）| 有 | — |

`quiet` 被充分教学（L179 更是 `targetSentence`），但它对应的 `-ly` 副词 `quietly`
**在全库 204 课 + 213 案里一次都不存在**。这与 `loud`/`careful` 同类（形容词已教、`-ly` 形式缺席），
是本次普查中**最干净的一个真缺口**。

**本批未处理**，理由：`quietly` 要落地需要宿主课有卡位、且要过 D 层（每个词在本课含此前累计教过）。
L58 是天然的宿主（`-ly` 副词课）但它已满 6 张、且本批刚给它换过内容。
**建议下批评估**：L58 是否可换掉某张卡，或另找宿主。

### 6.2 已排除的伪缺口（避免灌水）

`nicely` / `happily` / `warmly` / `greatly` 只出现在负面位置，但**这是设计意图**：
它们是 L125–L133 感官动词系列「后面接形容词、不能加 -ly」的**正面拦截素材**，不应作为缺口登记。

### 6.3 携带项：`「告诉」措辞（7 处题干）

见 §3.3。低成本、方向明确（改中文措辞而非加卡），**本批未动**，建议下批做。

### 6.4 仍待产品负责人拍板

词汇线是否单独立项（316 个 A0/A1 词缺失）。

---

## 七、验收

| 项 | 结果 |
|---|---|
| `tsc --noEmit` | 0 错误 |
| 全量测试 | **2500 / 2501 通过**（237 文件）|
| 唯一失败 | `kb4-arrange-keyboard`——**非本批引入**（该测试与其断言目标 `GrammarLessonPage.tsx` 均未被本批修改）|
| `vite build` | ✓ 通过（2.77s）|
| 课内重复对照卡 | **4 → 0** |
| 课内重复练习 | **7 对 → 0** |
| `several` | 从「全库零出现」→ L114 刻度卡（双正解、落位点②）|
| 走查（jsdom 真实渲染）| L58/L61/L71/L97/L114 五课均能打开并渲染；`several` 卡数据与位点已核 ✓ |
| 新守门自检 | 注入真重复 → 变红；注入全新卡 → 保持绿 ✓ |
