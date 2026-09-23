# 竞品与外部权威源分析 · 第 48 批：`told` 的去留 ＋ 两个字段问题

**项目**：英语听写 / 语法课 App（`/Users/liujun/Documents/英语听写`）
**批次**：第 48 批　**日期**：2026-09-23
**角色**：竞析（竞品与外部权威源）
**数据基线**：`src/data/grammarLessons.ts` **204 课**；`src/data/huntCases.ts` **213 案**

**主核查脚本**（全部落在 `deliverables/product-strategy/`，只读、不改任何数据）：
| 脚本 | 行数级 | 用途 | 运行方式 |
|---|---|---|---|
| `.told-verify-48.mts` | 主脚本 | `tell/tells/told` 三侧计数 + 主角判据 + 5 处上下文 + 对照词 | `./node_modules/.bin/vite-node deliverables/product-strategy/.told-verify-48.mts` |
| `.told-verify-48b.mts` | 副脚本 B | 5 vs 6 差异溯源 + 模板化台词范围 + `say/said` 台账 | 同上（改文件名） |
| `.told-verify-48c.mts` | 副脚本 C | `L190–L204` 结构 + 50 个过去式主角扫描 + `reviewed`/番外案核实 | 同上 |
| `.told-verify-48d.mts` | 副脚本 D | 判据「字面 vs 词元」两读 + `comparison` 相关课程 | 同上 |
| `.told-verify-48e.mts` | 副脚本 E | `comparison` 下游影响面 + R13/R15 断言实测 + 番外案档案 | 同上 |
| `.told-verify-48f.mts` | 副脚本 F | 比较类案件逐案台账（人工判定） | 同上 |
| `.told-verify-48g.mts` | 副脚本 G | `comparison` 改判精确台账（按 `original→correction` 定位） | 同上 |
| `.told-verify-48h.mts` | 副脚本 H | L38 完整档案 ＋ 全库扫 `*say+人` / `*tell to+人` 错型 ＋ 文档硬断言核对 | 同上 |

---

## ① 结论摘要

**1. `told` —— 不处理（不立课、不挂靠、不改任何数据）。**
任务书给的四行表**有一处与我的实测不符**：`tell` 正侧我测到 **6（槽位）／5（去重后课数）**，不是 5。差异**不矛盾**，是**同一事实的两种粒度**——`dialogueEn` 与 `dialogue[0].en` 在 56/204 课里是**同一个字符串被两个槽位同时收录**（§2.2）。**去重后恰好是 5 课**，与任务书一致。`tells` **0/0**、`told` **0/0** 我**完全复现**。

**2. 判据（原形是否当过主角）在本案适用，且本案给出了比批四十七更强的支持。**
- **双向都过**：`tell` 在 `targetSentence` 与 `grammarLabel` 里**双零命中**（§2.5）——按判据，`told` **无立课资格**。
- **但判据的「输入数字」在本案是虚高的**：那 5 处 `tell` **全部**是同一句模板化的 NPC 开场白 **"Tell me about …"**（4 课，逐字：`Tell me about last night.` / `Tell me about your week!` / `Tell me about your family!` / `Tell me about your cousin.`），第 5 处在 L41 是同一句的疑问形 `Can you tell me about your class?`。**它们不是教学样本，是搭台台词**——`tell` 出现在 `who=npc` 的第一句，而同课的 `targetSentence` 讲的是完全无关的东西（L101 讲过去进行时、L110 讲 `makes/lets`、L117 讲撇号 s、L185 讲成对说法）。
- **⇒ 判据的方向与本案结论一致，但理由要比「5 > 0」深一层**：判据真正在测的是「原形有没有被**当作知识点教过**」，而不是「原形有没有**在句子里出现过**」。若只数出现次数，`tell` 有 5 处、看似「有基础」；按「是否被教过」核，`tell` 是 **0**。**判据的结论不变，但它的输入需要这道过滤。**

**3. ⚠️ 本案有判据没覆盖的新因素，而且它指向的不是 `told`，是 `say`。**
跨源一致地把 `say` 与 `tell` 的分工当作**独立知识点**（**两个源各有自己的逐字表述**：Cambridge 逐字 **"Say does not take an indirect object. Instead, we use a phrase with to"**；OALD `Which Word? say / tell` 注框逐字 **"Say never has a person as the object. You say something or say something to somebody."**）。**我方全库只有一课的 `targetSentence` 触及转述**——**L38「话中话 · 转述别人的话」`targetSentence = "She says she will come."`**，用的是 **`says`**，**从未用过 `tell`**。**⇒ 我方教的是 `say` 这一侧，而 `tell` 这一侧（人作宾语／双宾语）在全库零教学。** 中文负迁移证据（§⑤）指认的头号陷阱恰是 **`*say someone something`**，也落在**我方已教但没设防的 `say` 侧**。
**⇒ 因此本批的优先项不是给 `told` 立课，而是给 L38 补 `say` 侧的防错卡。**（详见 **§4.2**）

**4. `tells` —— 不处理。** 双侧 **0/0**，且 `says`（同一「-s 形」逻辑）**已经是 L38 的主角**，`tells` 既无教学位次也无错误位次。

**5. 问题一（`comparison` 零使用）：该修，且真因是「错标」不是「无案」。**
- UX 影响我实测确认了三条（§6.3）：① **11 个按钮里 1 个永远不可能命中**；② **点它会烧掉一次线索额度并计 `misses`**（直接掉星：0 误判 3 星／1–2 次 2 星／≥3 次 1 星）；③ **它会写一条 `hunt_verdict` 事件把 `comparison` 记进弱点引擎**，进而让**能力画像页**出现「比一比」这一条，而它对应的重练档**查不到任何案件**（空态），干预推荐也会退化成「先去复习里练一轮？」。
- **真因**：全库**有 14 处比较类错点（A 档 8 处核心 ＋ B 档 6 处外围，均按 `original→correction` 精确定位，14/14 成功），但它们被标成了 `verb_form`（4）/ `article`（4）/ `word_order`（4）/ `run_on`（1）/ `preposition`（1）**（§6.4）。**`comparison` 不是没有案，是案子被记到了别的罪名下。**
- **修法建议（与任务书给的三选项都不同）：不删按钮、不新写案件，而是改判 `tag`。** 本批建议**改 A 档里的 7 处**（A 档 8 处中，`hunt-enough-bag` 那 1 处因所属课 L71 不是比较课而建议保留 `verb_form`，§6.4 末）——**改判后 `comparison` 有 7 处使用、覆盖 3 个案件，且这 3 案全部挂在比较课上**（`hunt-photo-compare`→L17「比一比 · -er / more」、`hunt-superlative-market`→L31「最能比 · -est / most」、`hunt-height-chart`→L65「一样 · as tall as」）——**改判是让标签追上课程，不是让课程去追标签。** 成本：**7 个字符串**，另需同步 **1 处必红断言（`h1:214`）＋ 4 处会变成假陈述的测试文字**（§6.5 五行表）。

**6. 问题二（`reviewed` 恒 `true`）：保留，但要说明「它已经转为历史标记」，且该加一道新的守门。**
- **核实无误**：**213/213 全部 `reviewed: true`**，**0 个缺省**（§7.2）。
- **它不是「失去区分度的死字段」，而是「已全部达成的里程碑」**：R13/R15 两道断言（`src/services/huntService.test.ts:310` / `:319`）**逐字**过滤 `!huntCase.reviewed`，**在恒 `true` 下这两道断言变成恒真（vacuous）——它们保住了历史，但再也发现不了新问题**（§7.3）。**删了会怎样**：删字段 → 两道断言变成 `!undefined === true` → **213 个案件全部判为「未校验」→ 测试立刻红**（实测模拟：R13 会抓到 **208** 个案件）。所以**删不得**。
- **建议：字段保留（它就是那两道断言的唯一数据依赖），但补一道新守门**——「**`reviewed: true` 的案件若在本次改动中被编辑过，须重新置为 `false` 或补一条校验记录**」。**现状的真空地带是：字段只记录「曾经校验过」，不记录「校验之后又被改过」。**
- **5 个番外案核实无误**：`hunt-white-cat` / `hunt-sports-day` / `hunt-pen-pal-letter` / `hunt-fridge-note` / `hunt-term-review`，**恰好 5 个**，**全部 `reviewed: true`**，**无悬挂引用**（§7.4）。**存在合理**，且**有明文决策依据**——`huntCases.ts` 头注逐字：「**决策⑤（2026-09-13，5 课空 huntCaseIds 是否配案）：不配案，维持番外定位。**」理由是**罪名混合度越级，配给第一季基础课会违背 R01 难度闸门**。
  - ⚠️ **一处需顺手校正的注释偏差**：该头注说番外案「**各含 5-7 类**混合罪名」，**但实测每案只有 3–4 类**（3/4/3/3/3）。**结论不受影响**（3–4 类混合罪名配给单点基础课仍是越级），**但数字该改。**

---

## ② `told` 数字复核（含口径与脚本）

### 2.0 口径说明 —— 先定口径，再报数

**匹配**：词边界正则 **`(?<![A-Za-z-])W(?![A-Za-z-])`，忽略大小写（`gi`）**。
- **必须忽略大小写**：本项目正句常大写开头（`Tell me about last night.` 在 `dialogue[0]`，且这句在句首）；若区分大小写会**少算**。
- **正则而非 `grep`**（任务书要求）：`grep` 的 `-w` 对 `told`/`Tell` 的边界行为依赖实现，且**无法在同一脚本里把「槽位」这一层结构一起算**。本批**全部用 Node 正则**，脚本可复跑。

**三侧划分**（与批四十七 `gave` 口径一致，逐条可复现）：

| 侧 | 槽位 | 理由 |
|---|---|---|
| **正侧（`pos`，11 个「答案键」）** | `targetSentence` / `dialogueEn` / `examples[].en` / `dialogue[].en` / `contrast[].correct` / `variants[].en` / `sceneSwings[].en` / `guided(非spot).answer` / `guided(kind=replace).replaceBase` / `practice[].answer` / `recall.answer` | 全部是**用户被要求产出的正确英语** |
| **错侧（`wrong`，5 个槽位）** | `contrast[].wrong`（仅 `bothRight≠true` 的真错卡） / `contrast[].wrongMark`（同） / `guided[].options` / `guided[].wrongToken` / `practice[].distractors` | 全部是**被判错的英语** |
| **中性（两侧都不计）** | `spot` 题的 `answer` 与 `tokens`、`bothRight` 卡的 `wrong`、`blocks[].text`、非 spot 的 `guided[].tokens`、`practice[].tokens` | 见下 |

**三条中性口径的理由（这是任务书点名的「正确口径」）**：
1. **`spot` 题的 `answer` 不计正侧**：`spot` 是「找茬」题，`answer` **就是那个错词块**（`types.ts:533` 逐字：「`spot`：藏了问题的那个词块（命中即通过）」）。**把它算正侧等于把错误算成正确用法。**
2. **`bothRight` 卡的 `wrong` 不计错侧**：该字段**装的是正确句**。`types.ts:586-593` 逐字：「**`bothRight: true` + `wrongMark` 无值：501 张（双正解卡——注意它的 `wrong` 字段装的是正确句）**」。**本批实测 501 张**（§2.1），与注释一致。
3. **`blocks[].text` / 拼装 `tokens` 不计**：拼装题的素材**正误混合**（干扰项在 `distractors` 里，已单列）；`blocks` 是句子的切块展示，不是完整句。

### 2.1 核查 0 · 基线（脚本实测输出）

```
grammarLessons  204 课
contrast 卡     1226 张
  ├ 真错卡(wrongMark 有值或 bothRight 缺省) 725
  └ bothRight 双正解卡                      501
guided 题       1223 题（其中 spot 204）
practice 题     1047 题
槽位：正侧 6795 / 错侧 3893 / 中性 10339
huntCases       213 案
```

> **对账说明**：`contrast` **1226** 张 = 真错卡 **725** + `bothRight` **501**。批四十七交付里写的三类分解是「670 + 498 + 52 = 1220」（那时 204 课尚未含 L204 的 6 张），本批 **1226**，**差值 6 张恰好是新增的 L204（`gave` 课）的 6 张对照卡**（§2.7 实测：L204 `contrast` 6 张，其中 `bothRight` 3 张）。**批四十七的注释（`types.ts`）里仍写 670/498/52，属未同步的旧数字。**

### 2.2 核查 1 · 主表：复现任务书四行表

```
形式            正侧    错侧         任务书
tell           6     0         5/0  ❌ 不一致
tells          0     0         0/0  ✅ 一致
told           0     0         0/0  ✅ 一致
```

**差异溯源（脚本 B 实测）**：
```
有 dialogue[] 的课 204；无 dialogue[] 的课 0
dialogue[0].en 与 dialogueEn **逐字相同** 的课：56
dialogue[0].en 与 dialogueEn **不同** 的课：148
```
**`tell` 命中的两个槽位指向同一个字符串（只有 L41 这一课）**：
```
  L 41 dialogueEn="Can you tell me about your class?"
       dialogue[0].en="Can you tell me about your class?"   逐字相同？是 ⟵ 双计
  L101 dialogueEn="I was reading. It was raining. When you called, I was reading."
       dialogue[0].en="Tell me about last night."   逐字相同？否
  L110 dialogueEn="My mom makes me do my homework."
       dialogue[0].en="Tell me about your week!"   逐字相同？否
  L117 dialogueEn="Grandma's birthday is in May."
       dialogue[0].en="Tell me about your family!"   逐字相同？否
  L185 dialogueEn="She can both sing and dance, and she likes neither tea nor coffee."
       dialogue[0].en="Tell me about your cousin."   逐字相同？否
```
**⇒ 口径裁决：`6` 是槽位计数（L41 双计），`5` 是去重后的「处数」，`5 课`（L41/L101/L110/L117/L185）也是 5。**
**任务书写「5（全在 5 课的对话第一句）」——「5 课」与「对话第一句」我都复现了；只有槽位计数是 6。这是两套粒度，不是两个事实。**
**⇒ 建议：以后简报统一报「去重后处数」并注明课号，避免同一批里出现两个数字。**

### 2.3 核查 2 · 全库「tell 家族」所有形态命中（含中性侧，防漏）

```
tell      命中槽位  6  正侧槽=6 错侧槽=0 中性槽=0  课=[41,101,110,117,185]
tells     命中槽位  0  正侧槽=0 错侧槽=0 中性槽=0  课=[]
told      命中槽位  0  正侧槽=0 错侧槽=0 中性槽=0  课=[]
telling   命中槽位  0  正侧槽=0 错侧槽=0 中性槽=0  课=[]
```
**⇒ 关键**：`tell` 家族的命中**只在正侧的对话槽位**，**中性侧与错侧都是 0**。也就是说 **`tell` 在全库从未出现在任何一处需要用户判断正误的地方**——它只在 NPC 台词里出现。

### 2.4 核查 3/4 · 正侧逐槽位与逐处明细

```
  dialogueEn                 1
  dialogue.en                5
  合计                         6

  L 41 dialogueEn          "Can you tell me about your class?"
  L 41 dialogue.en         "Can you tell me about your class?"
  L101 dialogue.en         "Tell me about last night."
  L110 dialogue.en         "Tell me about your week!"
  L117 dialogue.en         "Tell me about your family!"
  L185 dialogue.en         "Tell me about your cousin."
```
**⇒ 6 处命中全部落在 `dialogue` 系槽位，`targetSentence` / `examples` / `contrast.correct` / `variants` / `sceneSwings` / `guided.answer` / `practice.answer` / `recall.answer` 全部为 0。**
**这条比「6 vs 5」重要得多**：它说明 `tell` **从未作为「要学的句子」出现过**，只在**「别人说的话」**里出现过。

### 2.5 核查 7 · `tell` 是否当过「主角」

```
targetSentence 含 tell 的课 = []  → ❌ 从未当过主角
grammarLabel   含 tell 的课 = []
⇒ 判据结论：tell 无主角课 ⇒ told 无立课资格（只能挂靠/不处理）
```
**横向对照（同一口径，脚本 D）**：
```
  tell     targetSentence=[]  grammarLabel=[]  正侧基数=6
  say      targetSentence=[]  grammarLabel=[]  正侧基数=2
  give     targetSentence=[63]  grammarLabel=[63,204]  正侧基数=37
  lose     targetSentence=[]  grammarLabel=[]  正侧基数=0
  break    targetSentence=[]  grammarLabel=[]  正侧基数=0
  speak    targetSentence=[]  grammarLabel=[]  正侧基数=0
  talk     targetSentence=[]  grammarLabel=[]  正侧基数=0
  ask      targetSentence=[]  grammarLabel=[]  正侧基数=5
  answer   targetSentence=[197]  grammarLabel=[]  正侧基数=22
```
**⇒ `tell` 与 `lose`/`break`/`speak`/`talk`/`ask` 同组：**`targetSentence` 与 `grammarLabel` **双零**。

### 2.6 ⚠️ 判据适用性评估（任务书点名要求：不要为了维持一致性而忽略新证据）

**先复述判据**：「过去式该不该立课，看它的**原形是否当过某课主角（`targetSentence` 含该原形）**。」

**评估结论：判据在本案适用，但它的「输入」需要一道过滤 —— 本案正好暴露了这个必要。**

**（a）本案双向都过（判决不依赖读法）**
我测了判据的**两种读法**（脚本 D）：
- **① 字面读法**（原形表面形在 `targetSentence`）：`tell` = `[]`
- **② 词元读法**（该词任一形态在 `targetSentence`）：`tell` = `[]`

**⇒ 最严与最宽两读都判 `tell` 无主角课**，与批四十七的 `lose`/`break` 不同（后两者在词元读法下**会翻盘**，见表）：

```
  词                 ①字面：原形在主角句               ②词元：任一族形态在主角句  分歧
  give                      [63]                    [63,204]
  lose                        []                    [23,178]  ⚠️ 字面=0 但词元≠0（2 课）
  break                       []                    [50,193]  ⚠️ 字面=0 但词元≠0（2 课）
  say                         []                        [38]  ⚠️ 字面=0 但词元≠0（1 课）
  tell                        []                          []
  speak/talk/ask              []                          []
```
**⚠️ 这是我本批发现的一处判据脆弱点（对批四十七的结论有回溯影响）**：`lose`/`break` 在批四十七被记为「从未当过主角」，**如果按词元读法，它们其实有主角课**（`lose` → L23/L178「have + 做过版」`"I have lost my key."`；`break` → L50 被动 `"My cup was broken."` / L193 `"…the window broke."`）。**同理 `say` 字面 0、词元 1（L38 `"She says she will come."`）。**
**⇒ 但批四十七的「挂靠」结论不需要推翻**：因为 `lost`/`broken` 出现在 L23/L50 的那两课，讲的是**「做过版」（have + 过去分词）与「被动」**，**不是在教 `lose`/`break` 的昨天版**。**这恰好证明：判据真正要测的不是「词有没有出现」，而是「这个词的形态变化有没有被当作知识点讲」。**
**⇒ 本案的修正建议**：判据的措辞应从「原形是否当过主角」**收紧为**「**原形（或其某个形态）是否当过主角，且该课讲的就是这个词的形态本身**」。按收紧后的判据：`give` → **过**（L63 讲 `give me the book`，就是 `give` 本身；L204 讲 `give → gave`）；`lose`/`break`/`say` → **不过**（出现它的课讲的是别的知识点）；`tell` → **不过**（两读皆零）。

**（b）本案的「5 处」是虚高信号 —— 判据的必要过滤在 L41/L101/L110/L117/L185 上确实发生了作用**
```
以 "Tell me about" **开头**的台词的课共 4 课： [101,110,117,185]
```
**加上 L41 的疑问形 `Can you tell me about your class?`，5 课 5 句是同一个模板。** 逐课上下文（脚本 48 核查 8）：
| 课 | `grammarLabel`（**这课在教什么**） | 含 `tell` 的那句 | 谁说的 |
|---|---|---|---|
| **L41** | 收口 · 两句话拼一句 | `Can you tell me about your class?` | **npc** |
| **L101** | 一句接一句 · 混排（then 认读） | `Tell me about last night.` | **npc** |
| **L110** | 收口 · 四张脸排一行 | `Tell me about your week!` | **npc** |
| **L117** | 合体 · 四种说法排一行 | `Tell me about your family!` | **npc** |
| **L185** | 收口 · 零新知（五对八句排一行） | `Tell me about your cousin.` | **npc** |

**⇒ 三点观察，都支持「不处理 `told`」且比单纯数数字更硬**：
1. **5 处全是 `who=npc`**：是**「别人对你说的话」**，用户在 L41/L101/L110/L117/L185 里**从不需要产出 `tell`**。
2. **5 课全是「收口课」**（`grammarLabel` 逐字含「收口」或「合体」，即**复习/汇总课**）：`Tell me about …` 是**复习课的固定开场白**，用来把话题抛回给用户。
3. **5 课的 `targetSentence` 无一句与 `tell` 相关**（分别讲拼句、过去进行时、使役、撇号 s、成对说法）。
**⇒ 判据适用于本案，且本案是判据的「硬案例」：**`tell` 有 5 处出现**却完全没有教学位次**——**这正好说明「出现」不等于「教过」，判据的输入必须先做这道过滤。**

**（c）判据没有覆盖的新因素：`say` vs `tell` 的分工（详见 §③/§4.2）**
判据只管「原形有没有当过主角」，**不管「这个词在英语里是不是跟另一个词成对出现」**。`say`/`tell` **在四源里都是成对处理的**（Cambridge 有 `Say or tell?` 专页、Oxford 在**两个词条各插一份** `Which Word? say / tell` 注框、BC 有 `reporting verbs` 内容、中文侧 english.cool 有专页），**这构成判据之外的一层**：**即使 `told` 从判据看不该立课，也应该问「`say`/`tell` 的分工要不要作为一个知识点进去」。**
**⇒ 我的答案是「要」，但落点不是 `told` 而是 `say`（§4.2）**——因为**我方已有 L38 这一课讲 `say` 侧**（`"She says she will come."`），**改它比新立一课便宜；而 `told` 那一侧我方连 `tell` 的现在时都没教，无从谈起。**

### 2.7 ⚠️ 本批发现的连带事实：`gave` 已经在批四十七之后**立课了**

**任务书没有提这一点，但它是 `told` 决策的直接背景，必须登记。**
```
L204 lesson-204-gave 「她给了我一块大蛋糕」  grammarLabel=昨天版 · give 变 gave
     主角句="I gave her the book, and she gave me a big cake."
     一句话规矩：give 的昨天版是 gave——不加 -ed。…第 63 课那个位置规矩照样管用…
     contrast 6 张 / guided 6 / practice 5 / huntCaseIds=[hunt-gave]
     contrast 卡 6 张，其中 bothRight 3 张：
        wrong="I gived her the book."                                          bothRight=false
        wrong="I gave her the book, and she give me a big cake."                bothRight=false
        wrong="I gave to her the book, and she gave to me a big cake."          bothRight=false
        wrong="Please give me the book."                                        bothRight=true
        wrong="Please give it to me."                                           bothRight=true
        wrong="I sat next to her and caught the bus."                           bothRight=true
```
**实测数字**：`gave` 正侧 **36**（批四十七时为 **35**，差值来自新增的 L204）、课号表 `[204]`（批四十七为 `[]`）。
**⇒ 三点含义**：
1. **批四十七的动作一（给 L63 加 1 张 `bothRight` 卡）被升级成了「直接立 L204」**——比我建议的更彻底。
2. **L204 的 `contrast` 里，前三条错卡的第三条逐字是 `"I gave to her the book, and she gave to me a big cake."`**——**这正是 Cambridge 明说的错句形式 `"He gave to his mother the flowers."`**（§3，S4）。**我方 L204 已经把这个错型收进来了。**
3. **`told` 现在面对的先例变了**：`gave` 有主角课（L63）**且已立课**；**`tell` 没有主角课、`told` 也没有**。**两者不再同类**——批四十七说「`told` 与 `gave` 同批登记」，**现在 `gave` 已落地，`told` 单独留在原地，且本案证据（§2.4/§2.6b）显示它该留。**

---

## ③ 跨源位次表（逐字引用 + URL）

**纪律声明**：每条标 **【明说】**（源里逐字写了）或 **【推断】**（我的推理）。**所有【明说】条均附可访问 URL 与本批实测的抓取状态。**

### 3.0 抓取状态（先说明哪些抓到了、哪些没有，不假装有）

| 源 | 本批抓取方式 | 实测状态 | 结论 |
|---|---|---|---|
| **Cambridge `Say or tell?`**（`/grammar/british-grammar/say-and-tell`） | **`curl -L -A <Chrome UA>`** | **`HTTP=200 size=451124`** ✅ | **成功**。任务书说 Cambridge 词典页常 520，**但语法页经 curl 直连 200 可读**。*（WebFetch 对同一 URL 返回 **520**，故本批改用 curl。）* |
| **OALD `tell`**（`/definition/english/tell_1`） | **curl** | **`HTTP=200 size=146202`** ✅ | **成功**，含 `Which Word? say / tell` 注框全文 |
| **OALD `say`**（`/definition/english/say_1`） | **curl** | **`HTTP=200 size=160994`** ✅ | **成功**，同一注框（**两词条各一份，逐字相同**） |
| **BC `say and tell` 专页** | **WebFetch**（多个候选 URL） | **全部 `HTTP 404`** ❌ | **BC 无 `say and tell` 专页**（详见 §3.3） |
| **BC 直连 curl** | curl | **`HTTP=000 size=0`**（任务书已预告）| **符合预期，未再重试** |
| **Cambridge 中文侧 `tell`**（`/zhs/词典/英语-汉语-简体/tell`） | **curl** | **`HTTP=200 size=374410`** ✅ | **成功**，含 **`[+ two objects]` 句型标注** |
| **english.cool（中文，本项目已引用 81 次）** | **curl** | **`HTTP=200 size=97693`** ✅ | **成功**，含**中文负迁移的明说证据**（§⑤） |
| **iciba（中文词典）** | curl | `HTTP=200` 但**不含句型标签** ⚠️ | **弱**（同批四十七对 `give` 的实测）|
| **Murphy 双册 / Swan PEU** | —— | **任务书指定「已记不可得」** | **未重试**（遵守任务书）|
| **BC LearnEnglish `Reported speech`** | WebFetch | `HTTP 200` ✅（**页面标 `Level: intermediate`**）| **成功，但内容与本主题关系有限**（见 S9）|

### 3.1 【明说】`say` 与 `tell` 的分工：四源一致，且都以「错误例句」形式给出

| # | 源 | **逐字原文** | URL | 位次/标注 |
|---|---|---|---|---|
| **S1** | **Cambridge Dictionary Grammar**（`Say or tell?` 页） | **"Say and tell are irregular verbs. The past simple of say is said, the past simple of tell is told"** | `https://dictionary.cambridge.org/grammar/british-grammar/say-and-tell` | `English Grammar Today`（**无 CEFR 标**）|
| **S2** | **Cambridge（同页）** | **"Say focuses on the words someone said and tell focuses more on the content or message of what someone said"**；两句逐字例：**"‘Hello,’ she said."** ／ **"Not: ‘Hello,’ she told."** | 同上 | **本批最重要的一条分工判据** |
| **S3** | **Cambridge（同页）** | **"Tell normally takes an indirect object (one or more people = io) and a direct object (the reported clause = do)"**；逐字例 **"The boy told [IO] us [DO] he didn't want any money."** | 同上 | **双宾语结构的权威表述** |
| **S4** | **Cambridge（同页）** | **"However, we use tell without an indirect object with words such as the truth, a lie, a joke, a story"**；逐字例 **"You should never tell a lie."** ＋ **"Not: … say a lie."**；**"Come on Kevin. You're good at telling jokes."** | 同上 | ⚠️ **`tell` 的例外情形**（我方全库零覆盖）|
| **S5** | **Cambridge（同页）** | **"Say does not take an indirect object. Instead, we use a phrase with to"**；逐字例 **"And then she said to me, ‘I’m your cousin. We’ve never met before.’"** ＋ **"Not: And then she said me …"** | 同上 | ★ **中文母语者的头号陷阱，源里明说** |
| **S6** | **Cambridge（同页）** | **"Tell + indirect object + to-infinitive"**；**"We use tell with an indirect object and a to-infinitive to report a command or an instruction. We don't normally use say in this way"**；逐字例 **"They told us to come back the next day."** ＋ **"Not: They said us to come …"** | 同上 | ★ **`tell` 的独有分工：转述命令** |
| **S7** | **Cambridge（同页，`Typical errors` 栏）** | **"We don't use an indirect object with say"**；**"‘I’m in a hurry,’ he said to me."** ＋ **"Not: … he said me."** ；**"We don't use tell without an indirect object when we report someone's words"**；**"Then a loud voice said, ‘Hello.’"** ＋ **"Not: … a loud voice told, ‘Hello.’"**；**"She said she would wait for us outside."** ＋ **"Not: She told she would wait …"** | 同上 | ★★ **源把两个方向的错都点名了**（`*said me` 与 `*told` 无宾语）|
| **S8** | **OALD（牛津）`Which Word? say / tell` 注框**（**`tell` 词条与 `say` 词条各一份，逐字相同**） | **"Say never has a person as the object. You say something or say something to somebody."** ／ **"Tell usually has a person as the object and often has two objects"** ／ **"Tell is also used when you are giving somebody instructions"**；**NOT** 标错例逐字：**"The doctor said me to stay in bed."**（正确形 **"The doctor told me to stay in bed."**） | `https://www.oxfordlearnersdictionaries.com/definition/english/tell_1` ／ `https://www.oxfordlearnersdictionaries.com/definition/english/say_1` | **A1 / Oxford 3000**（见 S10）|
| **S9** | **BC LearnEnglish `Reported speech`** | 页面标 **`Level: intermediate`**；`tell` **仅**在例句 **"Peter told her not to worry."** 里出现（`verb + to-infinitive`）；**全页无「say vs tell」对照** | `https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/reported-speech` | **intermediate** |
| **S10** | **OALD 词条等级**（实测 HTML 属性） | `tell` 词条 **`<li class="sense" id="tell_sng_1" cefr="a1" ox3000="y">`**（义项 1「give information」**a1**；义项 2/3/5 **a1**；义项 6/7 **b2**）；`say` 同结构 **`cefr="a1" ox3000="y"`** | 同 S8 | **两词均为 A1 + Oxford 3000** |
| **S11** | **Cambridge 中文侧 `tell` 词条** | **`[+ two objects]`** 句型标注 ＋ 中文释义逐字 **"to say something to someone, often giving them information or instructions"**（中文：**讲述，说；告诉**）；例 **"Can you tell me how to get to the library?"**（**请问去图书馆怎么走？**）；**`[+ obj + (that)]`** ／ **`[+ obj + speech]`** ／ **`[+ obj + to infinitive]`** 逐字标注，例 **"I told her to go home."**（**我叫她回家。**） | `https://dictionary.cambridge.org/zhs/词典/英语-汉语-简体/tell` | **中文侧最完整的句型标注** |

### 3.2 【明说】跨源位次结论

**① 两词同档，且是 A1 起步词。**
- **OALD 实测属性**：`tell` 义项 1 = **`cefr="a1" ox3000="y"`**；`say` 义项 1 = **`cefr="a1" ox3000="y"`**（S10）。
- **⇒ 「两词都是 A1」** 意味着：**如果要在 A1 级课程里收 `tell`，位次上没有越级问题**——**判据（§2.6）否掉 `told` 不是因为「太难」，而是因为「没教过原形」。这个区分必须写明，否则容易被误读为「太早」。**

**② 分工是「独立知识点」，四源都成对处理。**
- **Cambridge 有专页**（`Say or tell?`，S1–S7）；**OALD 在两个词条各插一份注框**（S8）；**Cambridge 中文侧同页给出 `[+ two objects]`**（S11）；**中文侧 english.cool 有专页**（§5 M1）。
- **⇒ 【推断】**：**「成对处理」这个模式本身说明：源把它当作一个需要专门辨析的点，而不是可以顺带学会的。**（这是我对方源编排方式的解读，**不是源的原话**。）

**③ ⚠️ 分工里有一条我方全库零覆盖的硬规则。**
- **Cambridge 明说**：**"However, we use tell without an indirect object with words such as the truth, a lie, a joke, a story"**（S4）——**`tell` 可以不带人宾语**（`tell a lie` / `telling jokes`），而 `say` 不行（`Not: … say a lie.`）。
- **OALD 明说**：`tell` **"usually has a person as the object"**（S8，用词是 **usually** 不是 always）。
- **⇒ 我方若要给 `told` 立课，必须同时处理「`tell` 不带人宾语」的例外，否则教出的规则会是错的（绝对化的）。** 这是**又一条「为什么本批不该急着立 `told`」的证据**——**我方连 `tell` 的现在时都没教，直接上 `told` 会把两条规则（分工 ＋ 双宾语）与一个形态变化（`tell → told`）压进一课，超出单课焦点。**

### 3.3 ⚠️ 抓不到的源（明确说明）

| 源 | 状态 | 实测证据 |
|---|---|---|
| **BC `say and tell` 专页** | **不存在** | 本批核了 `Verbs` 索引页的**全部子页链接**（逐字 20 条：`Verb phrases` / `Irregular verbs` / `Questions and negatives` / `Short forms` / `The verb 'be'` / `Present tense` / `Past tense` / `Perfect aspect` / `Continuous aspect` / `Modal verbs` / `Active and passive voice` / `'to'-infinitives` / `'-ing' forms` / `Talking about the present` / `Talking about the past` / `Talking about the future` / `Verbs in time clauses and 'if' clauses` / `Wishes and hypotheses` / `Clause structure and verb patterns` / `Delexical verbs`）——**无一条是 say/tell 或 reporting verbs**。多个候选 URL 实测 **`HTTP 404`**。**BC 把 reporting 放在 `Reported speech` 页（`Level: intermediate`），而该页不含 say/tell 对照**（S9）。 |
| **BC 直连 curl** | **`HTTP=000`** | 三个候选 URL 全部 `HTTP=000 size=0`。**本批未取得任何 BC 页的逐字文本**（S9 经 WebFetch 取得摘要）。 |
| **Murphy 双册 / Swan PEU** | **已记「不可得」** | **未重试**（遵守任务书）。 |
| **Cambridge `English Grammar Today` 的 CEFR 标** | **无** | 该页只标 `English Grammar Today` 品牌，**无 CEFR 等级**（S1）——**故「等级」一律以 OALD 的实测属性为准（S10）**。 |

---

## ④ 竞品矩阵与空位判定

**⚠️ 纪律声明（沿用批四十三/四十七）**：本批**无法访问竞品付费课程内部**（登录墙），故下表区分「**实测可见**」（公开页，本批亲测）与「**未核实**」。**不把未核实项写成结论。**

| # | 产品 | 侧 | **在「`say` vs `tell` 分工」上做到什么**（本批实测） | **在「分工 ＋ `tell` 的形态变化（`told`）」放同一处上做到什么** | 空位 |
|---|---|---|---|---|---|
| **1** | **Cambridge Dictionary Grammar** | 英 | ✅ **最完整**：`Say or tell?` 专页逐字给了**焦点差异**（S2）＋**`tell` 双宾语结构**（S3）＋**`tell` 不带人宾语的例外**（S4）＋**`say` 不用人宾语**（S5）＋**`tell` 转述命令**（S6）＋**两个方向的错句**（S7） | ⚠️ **半做到了**：S1 **逐字把两词的过去式并列**（**"the past simple of say is said, the past simple of tell is told"**），**且在 S1 的两句例子里 `told` 出现**（**"Then he told me how he had got the job by lying about his age."**）——**分工与 `told` 在同一页出现，但两者之间无一句把「形态变化」与「分工」联系起来** | **语法点讲了，但不给学习路径**——**无练习、无场景、无课序建议**；用户知道「有区别」，**但不知道「先学哪个、什么时候能用 `told`」** |
| **2** | **BC LearnEnglish** | 英 | ❌ **弱/结构性缺位**：**无 say/tell 专页**（本批核完全部 20 个子页）；`Clause structure and verb patterns` 页（**elementary**）逐字只有一句把 reporting verbs 归入 **"verbs with that, wh- and if clauses … (She said that …, He explained what …, He asked if … .) These are often reporting verbs."**，**`tell` 不出现**；`Reported speech` 页（**intermediate**）**只有 `"Peter told her not to worry."` 一句含 `tell`**（S9） | ❌ **零** | **⚠️ 结构性空位**：BC 把 **reporting 放在 intermediate**，而 `say`/`tell` **是 A1 词**（S10）——**入门阶段该辨析的东西被推到了中级** |
| **3** | **OALD（牛津）** | 英 | ✅ **做到了但零解释路径**：**在两个词条各插一份逐字相同的 `Which Word? say / tell` 注框**（S8），含 `NOT` 标错例 | ⚠️ **两句并列、无联系**：`tell` 词条里 **`told` 作为过去式在词条头部列出**，`Which Word?` 注框在词条中部；**两者同页但无语义连接** | **可查不可学**——用户查到规则，**但不会知道「`tell` 的分工要不要在学 `told` 之前先懂」** |
| **4** | **Cambridge 中文侧（`/zhs/`）** | 中 | ✅ **做到了且给了中文**：**`[+ two objects]`** 等句型标注 ＋ 中文释义逐字 **"to say something to someone, often giving them information or instructions"**（S11） | ⚠️ **`told` 只在例句里出现**（**"I told her to go home."**），**无形态说明** | **中文侧最好的一处，但仍是参考页**——**无练习、无场景、无零术语改写**（**`[+ two objects]`／`[+ obj + (that)]` 对零基础是不可读的符号**） |
| **5** | **english.cool（中文，繁体）** | 中 | ⚠️ **做到了但只做 `say` 一侧**：`speak / talk / say` 专页逐字 **"say 後面如果要接「對誰說」，必須先加 to，寫成「say something to someone」。不可以直接寫「say someone something」，這是中文「跟我說」直接翻過去最容易犯的錯"**（M1） | ❌ **零**：该页**只讲 `speak / talk / say` 三个词，`tell` 不在标题也不在辨析之内**（本批实测：其 sitemap **877 条**里，say/tell 相关只有 `speak-talk-say` 一条） | **⚠️ 最有价值的空位**：**中文侧把 `say` 侧的陷阱讲透了，`tell` 侧没人讲** ——**而这两侧是同一件事的两半** |
| **6** | **iciba（中文词典）** | 中 | ⚠️ **弱**：本批实测其 `say` 页有 **`say sth to sb`** / **`say to sb that-clause`** 句型行（可读），但 `tell` 页的句型行**只有 `tell to sb's face` 这类短语**，**没有 `tell sb sth`**；等级标签是**考试标**（"高中/CET4/CET6/考研/IELTS"）**不是 CEFR** | ❌ **零** | **⚠️ 两侧不对称**：`say` 侧的 `say sth to sb` 有了，`tell` 侧的 `tell sb sth` 缺了——**正好缺的是需要教的那一侧** |
| **7** | **Perfect English Grammar**（英文侧，本批实测可见） | 英 | ✅ **做到了，且是本批唯一给出「双向错句」的商品化课程页**：标题逐字 **"HOW TO USE 'SAY' AND 'TELL'"**；逐字 **"With 'tell' we NEED the object"** ／ **"With 'say' we CAN'T use the object"**；错句逐字 **"John said me that he would be late."** ／ **"John told that he would be late."**；并**有配套练习**（`Say or Tell Exercise 1`）与 PDF | ❌ **零**——**全页不含 `told` 的形态说明**；`told` 只作为例句成分出现 | **⭐ 最接近我方定位的一格，但仍留了空位**：**它有练习、有双向错句，但没有「零术语改写」、没有连续剧场景、也没有把 `told` 的形态变化并进来** |
| **8** | **扇贝 / 多邻国 / 沪江 / 作业帮 / 知乎**（合并一行，均为前批实测公开页不在） | 中/英 | ❌ **公开页零相关内容**（本批复测：沪江检索页取到但**内容为其首页、无 say/tell 文章**；知乎 **403**；多邻国首页**只返回站名**） | ❌ 零 | **结构性缺位**；**付费内部未核实** |

### 4.1 空位判定的硬结论

**① 「`say` / `tell` 分工」在英文权威侧是「讲了」，在中文侧是「只讲了一半」，在学习产品侧「有课但没场景没零术语」。**
- **Cambridge 做到最全**（S1–S7）、**OALD 做到并列可查**（S8）、**中文侧 Cambridge 有句型标**（S11）。
- **但**：Cambridge **无练习无场景**；OALD **无解释路径**；**中文侧 english.cool 只讲 `say` 一半**（M1）；**中文侧 iciba 恰好缺 `tell sb sth`**。
- **⇒ 7（8）款里，只有 Perfect English Grammar 做到了「讲 ＋ 练」两件事**（第 7 行），**但它没有零术语改写、没有连续剧场景**。

**② ⭐ 真实空位：「把分工 ＋ `tell` 的形态变化并成一件事」。**
- 本批逐款核完：**Cambridge 同页出现 `told` 但无联系**（第 1 行）；**OALD 同词条出现但无联系**（第 3 行）；**其余全部零**。
- **⇒ 我方若做 L38 的 `say` 侧防错卡 ＋（未来）把 `tell → told` 与「`tell` 要有人」并置，在这个点上没有对标产品。**
- **⚠️ 但必须诚实说明**：**这个空位很可能是因为「拆开更好教」**——**从教学顺序讲，先教 `say` 侧的转述、很久以后再教 `tell` 的双宾语与 `told`，是更常见的安排。** 我方若并置，**是差异化的选择，不应被描述为「竞品做不到」**——**它们是选择不做。这个区分必须写清，否则会在内部误判自己的优势。**

**③ ⚠️ 我方在「`say` 侧防错」上是**落后于**中文侧最流行的免费源的。**
- `english.cool` 逐字把 **`*say someone something`** 标为 **"這是中文「跟我說」直接翻過去最容易犯的錯"**（M1），**并给出 ⭕️/❌ 对照**（M2）。
- **我方 L38（全库唯一转述课）的错侧实测为**：
```
  say：命中槽位 8（正侧 2 / 错侧 6 / 中性 0）
     L  7 [pos] dialogue.en              "Say cheese!"
     L 38 [wrong] contrast.wrong.real      "She say she will come."
     L 38 [wrong] contrast.wrongMark.real  "say"
     L 38 [wrong] guided.options           "She say"
     L 38 [wrong] practice.distractors     "say"
     L136 [wrong] guided.options           "I am looking forward to say goodbye."
     L136 [wrong] practice.distractors     "say"
     L140 [pos] dialogue.en              "Say it another way?"
```
- **⇒ L38 的 6 张错卡实测（脚本 H 逐字）**：
| # | `wrong` 逐字 | `wrongMark` | `whyZh` 讲的规矩 | 罪名的落点 |
|---|---|---|---|---|
| 1 | `She says she will comes.` | `comes` | 「will 后面的动词穿原样」 | **从句动词** |
| 2 | `She says she come.` | `come` | 「说将来的事要带上 will」 | **从句动词** |
| 3 | `She says she will coming.` | `coming` | 「will 后面永远穿原样」 | **从句动词** |
| 4 | `She say she will come.` | `say` | 「She 是他/她/它版，**say 要加 -s**」 | **主句动词的 -s** |
| 5 | `I think she will not come.` | `not` | 「『不』要搬到前面说」 | **否定前移（语义/语序）** |
| 6 | `Do you think she will comes?` | `comes` | 「外面 Do 站句首，里面的 will come 还是原样」 | **从句动词（疑问形）** |
- **⇒ 6 张里 4 张打从句动词、1 张打压否定前移、1 张打 `say → says`（三单 -s）；⚠️ 没有任何一张打「人宾语」错型。**
- **⇒ 全库级扫描（脚本 H 核查 C/D，扫遍全部错侧槽位：`contrast.wrong.real` ＋ `guided.options` ＋ `practice.distractors`）**：
```
  ⇒ 全库 *say + 人 类错型共 0 处
  ⇒ 全库 *tell to + 人 类错型共 0 处
```
**⇒ 这是一处真实缺口，且它比 `told` 更紧急**（因为 `say` 那一侧我方**已经在教了**，只是没设防）：**全库零防 `*say someone something`、也零防 `*told to him`——两个方向的经典陷阱都没有对照卡。**

### 4.2 ⭐ 本批最有价值的动作建议：给 L38 补一张「人宾语」对照卡

**这不是任务书要求的内容，是本批证据指向的动作。** 理由链：
1. **L38 是全库唯一的转述课**（脚本实测：`targetSentence` 含 say/says 的课**只有 L38**；含 tell 的课**零**）。
2. **L38 已经教了 `She says she will come.`**——**`say` 侧的句型用户已经见过**。
3. **而中文侧最流行的免费源把 `*say someone something` 标为「中文『跟我说』直接翻过去最容易犯的错」**（§5.1 M1）——**这个陷阱正好落在 L38 已教的结构上，只是 L38 没设防**。
4. **Cambridge 与 Oxford 都把这条规则写成了显式的 `Not:` 句**（S5／S8）。

**建议的卡片形态（沿用本项目 `bothRight` / `contrast` 既有机制，零术语）：**
- **不是**新增 `contrast` 错卡（那会改动 L38 的错侧基数与 `guided`/`practice` 的判分口径），**而是给 `guid`/`contrast` 补一张 `bothRight` 卡把两句话并排**——因为 **`She says she will come.` 与 `She said to me, 'I will come.'` 都是对的**，这是一张**双正解**卡，而不是错卡。
  - ⚠️ **若走 `contrast` 路线**，按 `types.ts:586-593` 的口径，**必须设 `bothRight: true`**（两句都对），**且 `wrongMark` 留空**——**不能把 `*say me` 写成 `wrong`**（那是错句，会让它进错侧基数、并影响 `wrongTag` 类指标的分布，见 §6.3 同源机制）。
  - **若要点出 `*say me` 这个错**，更合规的位置是 `guided` 的 `options` / `practice` 的 `distractors`（**这两处正是「被打错的英语」的合法容身处**，`guided.wrongToken` 同理）。
- **零术语措辞方向**（供后续成稿参考，**本批不写成品文案**）：
  - 不说「间接宾语」「双宾语」「及物性」；
  - 可说「**想说『跟谁说』，`say` 后面要垫一个小 `to`**」／「**`say` 只管『说了什么』，『跟谁说』得另外加 `to` 请进来**」——**后一句与 english.cool 的中文措辞同构**（M1：`必須先加 to`），**且与我方已有的「垫 to」词汇表一致**（实测 L63 `oneLineRule` 逐字：**「…东西换成 it 时，要跑到后面垫上 to（give it to me）。」**；L63 `contrast[0].whyZh` 逐字：**「东西一变成 it，就要绕到后面垫 to：give it to me——『先给谁、后给什么』的规矩，碰到小词要翻个身。」**）。
  - **⚠️ 变量警告（施工必读）**：L63 讲的是 **`give`** 的 `to`，**与 `say` 的 `to` 不是同一条规矩**——
    - **L63 的规矩**：`give me the book` ✓（中文同序、**不用 to**）／`give it to me` ✓（**东西换成小词 `it` 才垫 to**）——**判据是「词的长短」**。
    - **`say` 的规矩**（Cambridge S5 逐字 **"Say does not take an indirect object. Instead, we use a phrase with to"**）：**`say` 一律不能带人宾语，想说「跟谁说」必须用 `to`**——`say something to somebody` ✓／`~~say somebody something~~` ✗（S5 逐字 **"Not: And then she said me …"**）——**判据是「用哪个动词」，与词的长短无关**。
    - **⇒ 两条规矩的判据不同、条件不同。若在 L38 的文案里引用 L63，必须说清「这是另一件事」；否则用户会把「东西短才垫 to」套到 `say` 上，得出「东西长大就不用 to」的错误规则——而 `say me the news` 是硬错。** 这是我给出的一处**明确的施工注意**。

**⚠️ 边界声明**：以上是**从四源证据＋我方数据缺口推出的建议**，**本批没有做课序冲突分析**（L38 在第 38 课，若加此卡会不会与 L63 的 `to` 规则冲突、会不会与 L41「两句话拼一句」重叠，**需要下一批专做**）。**标注为「待评估的建议」，不是「可直接施工的方案」。**

---

## ⑤ 中文负迁移证据（严格区分「明说」与「推断」）

**纪律声明**：本节每条都标 **【明说】**（源里逐字写了）或 **【推断】**（我的推理，源里没写）。**两者不混排。所有【明说】条均附 URL 与抓取状态。**

### 5.1 【明说】抓到了两条 —— 都在 `say` 侧

| # | 逐字原文（中文，源里原文） | 源 | URL | 抓取状态 | 与本案的相关度 |
|---|---|---|---|---|---|
| **M1** | **「這裡有一個超多人踩的雷：say 後面如果要接「對誰說」，必須先加 to，寫成「say something to someone」。不可以直接寫「say someone something」，這是中文「跟我說」直接翻過去最容易犯的錯，特別注意一下！」** | **english.cool**（`speak / talk / say` 专页，繁体） | `https://english.cool/speak-talk-say/` | **`curl HTTP=200 size=97693`** ✅ | **最高**——**中文侧逐字承认：`*say someone something` 是「中文『跟我说』直接翻过去最容易犯的错」** |
| **M2** | **「She said goodbye to everyone before leaving the party. ⭕️」** ／ **「She said everyone goodbye before leaving the party. ❌」**（中文：她離開派對前跟大家道別。） | **english.cool**（同页） | 同上 | 同上 | **最高**——⭕️/❌ 对照样本，**可直接作为 L38 补卡的错型参考** |
| **M3** | **「say 是動詞，核心意思是『說出某個具體內容』，重點全押在『說了什麼』這件事上。」**；**「所以 say 後面通常會直接接『說出來的話』，也就是說話的內容。」** | **english.cool**（同页） | 同上 | 同上 | **高**——**中文侧对 `say` 的「焦点」说明，与 Cambridge S2 的 `Say focuses on the words someone said` 逐字对应**（一个中文、一个英文，说的是同一件事）|
| **M4** | **`[+ two objects]`** 句型标注 ＋ 释义 **"to say something to someone, often giving them information or instructions"**（中文：**讲述，说；告诉**）；例 **"I told her to go home."**（**我叫她回家。**） | **Cambridge 中文侧** `tell` 词条 | `https://dictionary.cambridge.org/zhs/词典/英语-汉语-简体/tell` | **`curl HTTP=200 size=374410`** ✅ | **高**——**中文侧（Cambridge 官方）把 `tell` 的「两个人」结构标出来了**，但**用符号语言（`[+ two objects]`），且不涉陷阱论述** |
| **M5** | **`say sth to sb`** ／ **`say to sb that-clause`**（句型行，逐字） | **iciba** `say` 词条 | `https://www.iciba.com/word?w=say` | **`curl HTTP=200`**，但**无句型标签体系** ⚠️ | **中**——**中文侧唯一给出 `say sth to sb` 英文句型的词典行**，**但 `tell` 侧没有对应的 `tell sb sth` 行**（本批实测其 `tell` 页只有 `tell to sb's face` 这类短语）|
| **M6** | `tell` 表内条目逐字 **`tell` / `told` / `told`**；`say` 表内条目逐字 **`say` / `said` / `said`** | **letmeenglish `英文中的不规则动词`**（本项目已引用 34 次的中文源） | `https://letmeenglish.com/zh-hans/irregular-verbs/` | WebFetch ✅ | **低（但有结构意义）**：**中文侧把两词的形态变化平铺在同一张表里，与分工完全脱钩** |

### 5.2 ⚠️ 【明说】抓不到的：`*I told to him` 这一个方向

**任务书要求查「`*He said me` / `*I told to him` 这类」中文侧自认的痛点。我实际核查结果是：`*said me` 侧抓到了（M1/M2），`*I told to him` 侧没有。**

| 核查对象 | 方法 | 实测结果 |
|---|---|---|
| **必应中文检索 × 5 组关键词** | WebFetch（多组：`say和tell的区别`／`双宾语`／`said me`／`told to`／`中式英语错误`） | **结果全部与主题无关**——返回的是词典词条（`say` 单字）、中国地理、中式装修风格等。**「为回应符合本地法律要求的通知，部分搜索结果未予显示。」** |
| **知乎（问题 54315011「tell、say、talk、speak 的区别和用法？」）** | WebFetch × 2、curl | **`HTTP 403`**（两次尝试均失败）。**检索快照显示该页有 `tell 一般重点在于告诉对方TA原本不知道的事情` 一句，但原文未能取得，故不作为【明说】引用。** |
| **`letmeenglish` `reporting-verbs` / `english-reporting-verbs` / `indirect-speech`** | WebFetch × 3 | **可读，但明确不含 say/tell 分工，也不含双宾语或学习者错误**（逐字核查：`reporting-verbs` 页**只有一张引述动词清单**，`say` 在清单里；`english-reporting-verbs` 页**只有表格条目**：`tell` 在「人称 + to + 不定式」行，例 **"Nobody told me to be quiet. 没人叫我安静。"**；`say` 在「that + 从句」行，例 **"John said(that) he wouldn't do it again."**） |
| **`letmeenglish` `grammar-list` 目录** | WebFetch | **核完全部目录，无「双宾语」/「间接宾语」专页**；最接近的是三条 reporting 页（上一行）与两条代词页（`subject-object-pronouns` / `quesionts-sub-obj`） |
| **沪江英语（`hjenglish`）** | curl `HTTP=200` | **取到的内容是其首页**（标题逐字 `沪江英语-沪江旗下英语学习资讯网站_免费英语学习网站`），**无 say/tell 文章** |
| **柯帕斯英语网（`cpsenglish`，本项目引用过 5 次）** | curl `HTTP=200 size=12919` | **搜索页返回空结果壳**（只有导航，无结果条目） |
| **yygrammar（本项目引用过 5 次）** | curl `HTTP=200` | 检索页 `size=43141`，**但链接乱码，未取到 say/tell 相关条目** |
| **`english.cool` sitemap（877 条）** | curl `HTTP=200 size=90149` | **say/tell 相关只有 `speak-talk-say` 一条**（已引为 M1–M3）——**该站没有 `tell` 专页** |

**⇒ 逐字结论：在我能访问的全部中文源里，`*I told to him` 这个方向的负迁移论述，一条都没抓到。** 抓到的是**反方向**（`*say someone something`）。**这个不对称本身是有信息的**（见 5.3 I1）。

### 5.3 【推断】我的推理（源里没写，标注强度）

| # | 推断 | 依据（间接） | 强度 | 反证 / 保留 |
|---|---|---|---|---|
| **I1** | **两个方向的陷阱，中文侧只讲 `*say someone something`，是因为它对中文母语者才是真陷阱；`*I told to him` 相对罕见** | ① **中文「我跟他说」＝ 人 + 说 + 事**，与英文 **`tell + 人 + 事`** 同序（**前序零成本**）；② 而**中文「对我说」＝ 对 + 人 + 说**，中文习惯说「我**跟/对**他说」，**这个「对/跟」会诱导出 `*say to me` 的多余 `to`，以及把 `say` 当 `tell` 用的 `*say me`**；③ 因此**陷阱集中在 `say` 侧** | **中高** | **⚠️ 无任何源明说这一点**（§5.2 实测）。**这是纯推理。** 且 **`*I told to him` 的成因可能是另一个**（中文「告诉**给**他」诱导 `to`）——**我没有证据区分。** |
| **I2** | **我方 L38 的错型选择与中文侧最流行的免费源不在同一侧，因此 L38 的防错覆盖是有偏的** | §4.1③ 实测：`english.cool` 打在 **`*say someone something`**（M1），**我方 L38 只打 `She say → She says`（三单 -s）** | **高** | **这是从两源实测对比直接推出的事实，不是关于用户的推断。** 保留：**「三单 -s」也是真实的错误类型**（`sv_agreement` 是全库最高频罪名，**143 处**，§6.1）——**不是选错了，是选漏了。** |
| **I3** | **`told` 对中文母语者的负迁移风险，低于 `say` 侧的那些陷阱** | ① 「我告诉他」＝ `I told him` **同序**，前序零成本；② `told` 的难点只在「**要有人**」这一条，而这条**中文侧也是「告诉他」有人**——**同构**；③ 而 `*said me`／`*say someone something` **是跨结构错位**（把 `tell` 的句型套到 `say` 上），**难度更高** | **中** | **⚠️ 无源明说。** 且**反证存在**：`*He said me` 也可能来自**中文「他对我说」的 `to` 脱落**（不是套用 `tell` 句型）——**两种成因我给不出证据区分。** |
| **I4** | **我方 L38 的 `targetSentence`（`"She says she will come."`）本身是对的、好的，只是覆盖不全** | L38 逐字：`grammarLabel = "话中话 · 转述别人的话"`；`targetSentence = "She says she will come."`；6 张错卡里 **4 张打从句动词**（`comes`/`come`/`coming`/`comes`）、**1 张打否定前移**（`I think she will not come.`）、**1 张打 `say → says`**（`She say she will come.`）——**没有一张打「人宾语」** | **高** | **这是从数据直接读出的，不是推断。** |
| **I5** | **`tell` 的「不带人宾语」例外（`tell a lie` / `telling jokes`）是中文侧和英文侧都容易漏的一条，我方未来若立 `told` 必须一起处理** | Cambridge S4 逐字 **"However, we use tell without an indirect object with words such as the truth, a lie, a joke, a story"**；OALD S8 逐字用 **"usually"** 而非 always；中文侧 english.cool **完全不涉 `tell`**（§5.1） | **高** | **从三源对比直接推出。** |

---

## ⑥ 问题一评估：`comparison` tag 零使用

### 6.1 事实核实（本批实测）

```
  GRAMMAR_ERROR_TAG_LABELS  11 项：tense, sv_agreement, missing_be, article, plural,
                                    preposition, fragment, run_on, word_order, verb_form, comparison
  GRAMMAR_ERROR_TAG_PLAIN   11 项（键集与 LABELS 完全一致）
  GRAMMAR_ERROR_TAGS        11 项（键集与 LABELS 完全一致）

  tag                案件内出现次数
  tense                     84
  sv_agreement             143
  missing_be                26
  article                   33
  plural                   129
  preposition               70
  fragment                  28
  run_on                    19
  word_order                98
  verb_form                166
  comparison                 0
  合计错误点 796 处，覆盖 10 个 tag（声明 11 个）
  零使用 tag：comparison
```
**⇒ 任务书给的三条事实全部复现**：11 个罪名、213 案、`comparison` 零使用。

**⚠️ 一处必须纠正的细节（任务书表述已过时）**：任务书说「`GRAMMAR_ERROR_TAGS` 也是 11 个」——**正确，但理由与 2026-09-20 之前不同**。`huntService.ts:415-428` 逐字注释：
> 「⚠️ 唯一来源声明（2026-09-20 修）：此前这里是手写的 10 项数组，而 `GRAMMAR_ERROR_TAG_LABELS` 有 11 项（多一个 comparison）——两处不一致导致：页面罪名面板出现「比较级」按钮，但点它永远只能得到「这里确实有问题，但不是比较级」；且日记批改的 tag 白名单按此表过滤，AI 若返回 comparison 会被静默丢弃。**现在从 LABELS 派生：LABELS 是唯一来源，增删罪名只需改一处。**」

**⇒ 含义：2026-09-20 的修复把「两处不一致」修掉了（这是对的），但副作用是 `comparison` 的「不可命中」范围从「页面按钮 ＋ 日记白名单」扩到了「页面按钮 ＋ 日记白名单 ＋ 弱点引擎 ＋ 干预推荐 ＋ 能力画像」。** 见 6.3。

### 6.2 UI 定位（本批实测）

**罪名面板实际渲染几个按钮**（`src/pages/GrammarHuntPage.tsx:33` 与 `:686-693`）：
```tsx
const ALL_TAGS = Object.keys(GRAMMAR_ERROR_TAG_LABELS) as GrammarErrorTag[];
...
<div className="hunt-tag-grid">
  {ALL_TAGS.map((tag) => (
    <button type="button" key={tag} className="hunt-tag-btn" onClick={() => handleTagPick(tag)}>
      <strong>{GRAMMAR_ERROR_TAG_LABELS[tag]}</strong>
      <span>{GRAMMAR_ERROR_TAG_PLAIN[tag]}</span>
    </button>
  ))}
</div>
```
**⇒ 页面渲染 11 个按钮（`ALL_TAGS` 取 `Object.keys(LABELS)`，含 `comparison`），按钮上有两行字：粗体短名「比一比」＋ 小字解释「两个里比一个，后面的词要带上 -er 或 more」。** 用户**看不出哪个按钮是没有用的**——**它长得和另外 10 个一模一样。**

### 6.3 用户体验影响（本批实测三条，逐条给代码依据）

**判决入口**（`huntService.ts:158-197` 的 `judgeGuess`）：`hit` 的唯一条件是 `guessedTag === error.tag`。**既然没有任何 `error.tag === "comparison"`，该按钮的归宿只有三种：`notError` / `wrongTag` / `alreadyFound`。**

**影响 ①：点了永远不命中 —— 这是任务书已经指出的。**
`wrongTag` 分支的文案逐字（`huntService.ts:190-196`）：
> `这里确实有问题，但不是${guessedLabel}。${hint}`
> ⇒ 实际渲染：**「这里确实有问题，但不是比一比。两个东西比一比，看看形容词要不要加 -er 或 more。」**

**影响 ②（本批新增）：点它要付代价 —— 烧线索额度 ＋ 计 `misses` ＋ 直接掉星。**
`GrammarHuntPage.tsx:316-325` 的 `wrongTag` 分支逐字：写入 `appendHuntAttempt(..., hit: false)`；`notError` 分支（`:328-334`）**额外** `setMisses((current) => current + 1)`。
`huntService.ts:200-204` 逐字：
> 「**星级：0 次误判 3 星，1-2 次 2 星，3 次及以上 1 星。**」

**⇒ 用户选了「比一比」→ 至少 1 次误判 → 从 3 星掉到 2 星。** 且 `HUNT_CLUE_BUDGET = 5`（`huntService.ts:52`）——**误判也消耗线索额度**。
**⇒ 这是本批对任务书提示的补充：「点了只能得到『这里确实有问题，但不是…』」这个描述不够重——它不止是「得不到正反馈」，而是「扣分」。**

**影响 ③（本批新增）：它会污染三个下游统计。**
- **弱点榜**：`grammarWeakSpotsService.ts` 遍历 `hunt_verdict` 事件，`verdictKind === "wrongTag"` 时走 `bump(event.guessedTag, WEAK_SPOT_WEIGHTS.huntWrongTag, ...)`。**⇒ `comparison` 会以与真实罪名同权的方式进入弱点榜。**
- **能力画像**：`grammarProfileService.ts:148-152` 遍历 `GRAMMAR_ERROR_TAGS`，**只要 `active`/`healed` 里有该 tag 就 `push` 进画像**。**⇒ 画像页会出现「比一比」这一条**，而 `grammarReplayService` 查案件时**找不到任何带 `comparison` 的案件**（逐字过滤 `item.errors.some((error) => error.tag === tag)`）→ **重练档空态。**
- **主动干预**：`findActiveIntervention` 反查 `lessonId` 时**找不到任何案件带 `comparison`** → `lessonId` 为 `undefined` → 走 else 分支，文案逐字：
> `你这两天都在这摔：「两个里比一个，后面的词要带上 -er 或 more」(N 次)——先去复习里练一轮？`
**⇒ 文案本身不算错，但它把用户推向了与「比一比」无关的复习队列。**（第 17 课「比一比」本身**不引用任何 `comparison` 案件**。）

### 6.4 ⭐ 真因：不是「没有案」，是「案子被标到了别的罪名下」

**本批对 213 案逐案核查「比较范畴」的错点（脚本 F/G）。精确定位（按 `original→correction` 匹配，不按下标）：**

**A 档（核心比较形态，8 处 —— 我认为应当改判）**
| 案 | 现 tag | 逐字错误 | 我是怎么判的 |
|---|---|---|---|
| `hunt-photo-compare` | `verb_form` | `hoter` → `hotter` | 讲解逐字：「**比「更热」要用 -er 形状**，hot 是短促有力的词，先双写 t 再加 -er」 |
| `hunt-photo-compare` | `verb_form` | `more good` → `better` | 讲解逐字：「**good 说「更…」的时候是 better**」 |
| `hunt-superlative-market` | `article` | `most` → 去掉 most | 讲解逐字：「**most 和 -est 只能用一个**」——双重最高级 |
| `hunt-superlative-market` | `article` | `goodest` → `best` | 讲解逐字：「**good 说「最…」的时候是 best**」 |
| `hunt-superlative-market` | `run_on` | `than` → `in` | 讲解逐字：「**说「最…」用 in**（在……里）；**说「更…」才跟 than 搭**」 |
| `hunt-height-chart` | `verb_form` | `taller` → `tall` | 讲解逐字：「**加了 -er 是「更」家的人，进不了「一样」家的门**」 |
| `hunt-height-chart` | `preposition` | `than` → `as` | 讲解逐字：「**「一样」家不认 than**」 |
| `hunt-enough-bag` | `verb_form` | `heavy` → `heavier` | 讲解逐字：「**「比…更」的词要带 -er**」 |

**B 档（外围，6 处 —— 我认为可改可不改，取决于 `comparison` 的语义边界）**
| 案 | 现 tag | 逐字错误 | 争点 |
|---|---|---|---|
| `hunt-superlative-market` | `article` | `biggest` → `the biggest` | 「最高级前加 the」**也可以算 `article`**（现标注不算错） |
| `hunt-term-review` | `article` | `best` → `the best` | 同上（**且这是番外案**） |
| `hunt-height-chart` | `word_order` | `tall` → `as tall` | 「少一头 as」**也可以算 `fragment`/`word_order`** |
| `hunt-feel-better` | `word_order` | `very` → `much` | 「给『更』加力用 much」——**比较级的程度修饰，边缘情形** |
| `hunt-feel-better` | `word_order` | `more` → `much` | 同上 |
| `hunt-full-day` | `word_order` | `very` → `much` | 同上 |

**改判后的 tag 分布（两种口径都给）**：
```
  tag               现状    只改core    core+外围
  tense               84        84         84
  sv_agreement       143       143        143
  missing_be          26        26         26
  article             33        31         29
  plural             129       129        129
  preposition         70        69         69
  fragment            28        28         28
  run_on              19        18         18
  word_order          98        98         94
  verb_form          166       162        162
  comparison           0         8         14
```
**⇒ 数字读法（两档分别给，避免混用）**：
- **改 A 档全部 8 处** → `comparison` **8 处使用、覆盖 4 个案件**（`hunt-photo-compare` / `hunt-superlative-market` / `hunt-height-chart` / `hunt-enough-bag`）。
- **改 A+B 全部 14 处** → **14 处使用、覆盖 6 个案件**（上 4 个 ＋ `hunt-term-review` ＋ `hunt-feel-better` ＋ `hunt-full-day`，共 7 个案件——**其中 `hunt-full-day` 只有 1 处外围，与 `hunt-feel-better` 合计为第 6、7 个案件**）。
- **⭐ 本批实际建议改 7 处**（A 档去掉 `hunt-enough-bag` 那 1 处）→ **7 处使用、覆盖 3 个案件**，且**这 3 个案件全部挂在比较课上**（见下方影响面）。

**影响面（这几处改判会碰到哪几课）**：
```
  hunt-photo-compare       #25 2 处（core 2）  被引用：L17「比一比 · -er / more」     ✅ 就是比较课
  hunt-superlative-market  #40 4 处（core 3）  被引用：L31「最能比 · -est / most」     ✅ 就是比较课
  hunt-height-chart        #74 3 处（core 2）  被引用：L65「一样 · as tall as」        ✅ 就是比较课
  hunt-enough-bag          #80 1 处（core 1）  被引用：L71「够 · enough 站词后」       ⚠️ 不是比较课
  hunt-term-review         #20 1 处（外围 1）  被引用：**无（番外案）**
  hunt-feel-better         #85 2 处（外围 2）  被引用：L76「加力 · much + 更…」        ✅ 就是比较课
  hunt-full-day            #87 1 处（外围 1）  被引用：L78「收口 · 跨季大团圆（零新知）」
```
**⚠️ 一处必须注意的反例**：**`hunt-enough-bag` 挂在 L71（`enough` 的位置课），不是比较课**（L71 逐字：`grammarLabel = "够 · enough 站词后"`，`targetSentence = "The bag is light enough to carry."`）。若把这处改成 `comparison`，**「案件的罪名」与「所属课的语法点」会脱钩**。**⇒ 建议：`hunt-enough-bag` 那一处（`heavy → heavier`）保留 `verb_form`**（它讲的是 `-er` 的拼写 `y→i`，`verb_form` 说得通），**A 档实际改 7 处 → `comparison` 7 处 / 3 案，且 3 案全在比较课上。**

### 6.5 修法建议（与任务书的三个选项都不同）

**任务书给了三个选项：删按钮 / 补案件 / 保留。我的建议是第四条路：**

**⭐ 修法：改判 `tag`（7 处 A 档），不删按钮、不新写案件。**

| 比较 | 删按钮（任务书选项一） | 补案件（任务书选项二） | **改判 tag（我的建议）** |
|---|---|---|---|
| 成本 | 低（改 1 处枚举 + 需同步 5 个下游的 11→10 断言） | **高**（新写完整案件：tokens + 2–4 处错 + 讲解 + notes，且要过 R13/R15 校验） | **最低（改 7 个字符串）** |
| 副作用 | **文件级 `GrammarkErrorTag` 联合类型要改 → 触摸 `types.ts`；`comparison` 若从枚举消失，历史数据里若有该 tag 会成孤儿** | 无 | **无**（枚举不变、断言不变、测试不变） |
| 数据一致性 | **降低**（`comparison` 这一格永久空着，而案子明明存在） | 提升 | **提升**（标签追上课程） |
| 与课程的关系 | **脱钩**（L17/L31/L65 明明在教比较，罪名体系里却没有「比一比」） | 新案件需重新配课 | **对齐**（4 个案件里 3 个已挂在比较课上） |

**⚠️ 改判必须同步检查的 5 处（否则会引入新问题；本批逐行核实过行号）**：

| # | 文件:行 | 逐字内容 | 改判后会不会红 |
|---|---|---|---|
| **1** | `src/edge/h1-hunt-data-integrity.test.tsx:212-217` | `it("[已知问题] comparison 罪名按钮存在但无任何案件使用（点了只会得到「这里确实有问题，但不是比较级」）", …)`；内含 **`:214`** `expect(used.has("comparison" as GrammarErrorTag)).toBe(false);` 与 **`:216`** `expect(Object.keys(GRAMMAR_ERROR_TAG_LABELS)).toContain("comparison");` | **会红（`:214`）**——**必须改成「至少 1 个案件使用 `comparison`」，并去掉 `[已知问题]` 前缀** |
| **2** | `src/edge/h2-hunt-judging.test.tsx:95-114` | **`:95`** `it("罪名面板提供全部 11 个罪名按钮（含全库未使用的「比一比」）", …)`；**`:101`** `expect(labels.length).toBe(11);`；**`:102`** `expect(labels).toContain(TAG_LABEL.comparison); // 没有任何案件使用该罪名（见 H1），点了必然归因不当`；**`:107-114`** `it("[已知问题] 选「比一比」这个无案使用的罪名：只能得到归因不当反馈，不可能命中", …)`，内含 **`:112`** 的断言 | **实测不会红**——该测试用的案件是 **`hunt-call-mother`**（脚本实测其全部 tag：`missing_be`／`preposition`／`run_on`／`tense`／`plural`／`verb_form`／`sv_agreement`／`word_order`，**不含 `comparison`**），**我建议改判的 7 处也不涉及此案** ⇒ 断言仍然成立。**⚠️ 但语义变了**：`:102` 的注释逐字「没有任何案件使用该罪名」**改判后成为假陈述，必须同步改注释**；且 `:95` 与 `:107` 两处 `it()` 标题里的「（含全库未使用的「比一比」）」与 `[已知问题]` 前缀**都得去掉**——**否则测试名会与数据矛盾，后来者会以为问题还在。** |
| **3** | `src/services/huntService.test.ts:111-112` | `expect(summary.tagStats).toHaveLength(GRAMMAR_ERROR_TAGS.length);` ＋ `expect(summary.tagStats).toHaveLength(11);` | **不红**（罪名枚举不变）——**但若走「删按钮」路线，这两行必须同步改成 10** |
| **4** | `src/edge/verify/mg7-legacy-diary-hunt-vocab.test.tsx:199` | `expect(summary.tagStats.length, "罪名统计表应完整（11 项），全为 0").toBe(11);` | **不红**——同上，**若删按钮则必须改为 10** |
| **5** | `src/edge/h3-hunt-hint-retry.test.tsx:29` ＋ `src/edge/verify/gq2-boost-items.test.ts:37` | **各自本地复制了一份 tag 清单**（`h3` 是 `comparison: "比一比"` 的标签表；`gq2` 是 `"preposition", "word_order", …, "comparison"` 的数组） | **不红**——**但这是「词表唯一来源」红线的两处新漏口**：`huntService.ts:419-428` 已声明「LABELS 是唯一来源」，**而这两处仍在手写副本**。**建议顺手改为 `import { GRAMMAR_ERROR_TAGS } from "../services/huntService"`。** |

**⇒ 采用「改判」路线时，必须动的是：① `h1:214` 的断言（会红，必须改数据侧期望值）＋ ② `h1:212`/`h2:95`/`h2:102`/`h2:107` 四处**文字**（`it()` 标题与注释，不会红但会变成假陈述）。第 3–5 行是「若走删按钮路线」才要动，以及一处顺手可收的技术债（`h3`/`gq2` 两处手写 tag 副本）。**

**若只改 1 处（最低成本验证）**：改 `hunt-photo-compare` 的 `hoter → hotter`（L17「比一比 · -er / more」引用的案、讲解已逐字说「比『更热』要用 -er 形状」）。**这一处是零争议的——它 100% 是比较级。**

---

## ⑦ 问题二评估：`reviewed` 恒 `true` ＋ 5 个番外案

### 7.1 字段的设计意图（代码与注释逐字核实）

**`types.ts:486`**：
> `/** R15：人工校验标记——true 表示语法、罪名标注与讲解已人工核对；未被课程引用的案件须校验后方可上线。 */`
> `reviewed?: boolean;`

**`huntCases.ts:16-22`**（头注）：
> 「**R15 人工校验记录（2026-09-12）**：3 号案 + 13–20 号案（原 AI 初稿、未被任何课引用）逐案核对——语法正确性、罪名标注、讲解话术、`tokenIndex` 全部通过；修正 13 号案未标注的说法错（stay → stayed）。标记 `reviewed: true`。被课程引用的案件在配课时校验，新增案件若暂未配课须先校验并标记 `reviewed`。」
> 「**R13 人工校验记录（2026-09-13）**：第一季 19 案逐案核对——`tokenIndex` 对位、罪名合法、`explanation` 话术、修正≠原词、植错密度 2-4 全部通过；修正 `hunt-passive` 的 The people → People（泛指「人们」不加 the，`tokenIndex` 11→10）。33 案全部 `reviewed: true`，红线断言入 `huntService.test`。」

**⇒ 任务书对设计意图的描述准确**：它确实是**人工校验标记**（R13/R15 两道守门的依据）。

### 7.2 实测（脚本 E）

```
  案件 213；被引用 208；未被引用 5
  reviewed 取值分布：
     reviewed=true: 213 案
  reviewed 缺省(undefined)的案：0
```
**⇒ 任务书说的「全 213 案恒 `true`」完全复现，且补充一条：0 个缺省。**

### 7.3 这算「字段失去区分度」吗？删了会怎样？（本批的核心判断）

**① 它不是「死字段」，是「已全部达成的里程碑标记」。**
- 字段**有真实消费者**：`src/services/huntService.test.ts` 的**两道断言**（`:310` R15 / `:319` R13），逐字：
```ts
// R15：未被任何课程引用的案件必须经过人工校验（reviewed），防止 AI 初稿静默上线。
it("requires unreferenced cases to be human-reviewed (R15)", () => {
  const referenced = new Set(grammarLessons.flatMap((lesson) => lesson.huntCaseIds));
  const unreviewed = huntCases
    .filter((huntCase) => !referenced.has(huntCase.id) && !huntCase.reviewed)
    .map((huntCase) => huntCase.id);
  expect(unreviewed).toEqual([]);
});

// R13 红线：被课程引用的案件必须先过人工校验——未校验的案件直接配课会把错误内容带给玩家。
it("requires referenced cases to be human-reviewed (R13)", () => {
  const referenced = new Set(grammarLessons.flatMap((lesson) => lesson.huntCaseIds));
  const unreviewedReferenced = huntCases
    .filter((huntCase) => referenced.has(huntCase.id) && !huntCase.reviewed)
    .map((huntCase) => huntCase.id);
  expect(unreviewedReferenced).toEqual([]);
});
```
- **实测复现（脚本 E）**：
```
  R15 断言：未被引用 且 !reviewed 的案件 = 0 个 → 通过
  R13 断言：被引用 且 !reviewed 的案件 = 0 个 → 通过
```
- **⚠️ 关键观察：在 `reviewed` 全为 `true` 时，这两道断言都是恒真的（vacuous）**——`!true === false`，过滤结果必然为空数组。**它们仍然保住了历史（回归「新增案件必须标记」这件事），但再也发现不了新问题。**

**② 删了会立刻红 —— 这是「不能删」的决定性理由。**
**反证（脚本 E 实测）**：
```
  模拟（reviewed 全 undefined）：R13 会抓到 208 个案件 → 断言**此时才有区分力**
```
**⇒ 删字段 ⇒ `!undefined === true` ⇒ 213 案全部判为「未校验」⇒ 两道断言同时失败、208 条错误列表。** 所以：
- **删字段 → 必须同时删两道断言**（因为它们唯一的数据依赖就是这个字段）。
- **删断言 → 失去「新增案件必须标记」的回归保护**。
- **⇒ 结论：不能删。它承载的是「一道曾经起作用、现在仍在防新增」的守门，价值在于未来不在当下。**

**③ ⭐ 我的建议：保留 ＋ 说明「已转为历史标记」＋ 补一道新守门。**

| 选项 | 我的评估 |
|---|---|
| **删字段（连带删断言）** | ❌ **反对**。理由：① 会失去「新增案件必须标记」的回归保护；② 字段有真实消费者（当前唯一的数据依赖）；③ **删了之后，若将来再引入 AI 初稿案件，没有任何机制拦它静默上线**——R15 的设计初衷（「防止 AI 初稿静默上线」）会失效 |
| **保留 + 在 `types.ts` 注释里说明「213 案已全部为 true，本字段已转为历史标记」** | ✅ **建议**。当前 `types.ts:486` 的注释只说明语义（逐字：「R15：人工校验标记——true 表示语法、罪名标注与讲解已人工核对；未被课程引用的案件须校验后方可上线。」），**没有写出「全库已达成、两道断言已转恒真」这一状态**——**这是本批实测确认的一处注释空白**：下一个审计者要判断「恒 true 是不是问题」，**必须重新跑一遍全库扫描才能知道**，而他现在**只需要读一行注释**。**（说明：我无法核实这是第几次被提出——`git log` 里没有本批工作区未提交改动的历史；此项仅为「注释缺失」的登记，不含「第几次」的断言。）** |
| **保留 + 补一道新守门** | ✅✅ **强烈建议**（见下） |

**⭐ 新守门的建议（填现状的真空地带）**：
现状 `reviewed` 记录的是「**曾经**校验过」，**不记录「校验之后又被改过」**。**真空地带：一个已标记 `reviewed: true` 的案件，如果后来有人改了它的 `tokens`/`errors`/`explanation`，标记仍然是 `true`——守门失效。**
**一道低成本的补充断言（`git` 差异驱动或字段驱动二选一）**：
- **字段驱动（推荐，纯数据）**：给 `HuntCase` 增一个可选 `reviewedAt?: string`（与 `Card.masteredAt` / `Review.reviewedAt` **同构**——本项目已有这个模式），断言「**`reviewed: true` 的案件必须有 `reviewedAt`**」。
- **git 驱动（更严）**：CI 里断言「**本次 diff 触碰过的 `huntCases.ts` 案件，若 `reviewed` 仍为 `true`，则必须伴随一条校验记录更新**」。
**⇒ 效应：把「恒真的是/否」变成「有时间的凭证」**——**这才是解决「字段失去区分度」的正确方向：不是删掉失去区分度的字段，而是补上让它可以重新有区分度的维度。**

### 7.4 5 个番外案的核实与合理性判断

**数字核实（脚本 C/E）**：
```
  案件总数 213
  被课程引用的案件 id 数 208
  未被任何课程引用的案件 5 个：
     hunt-white-cat         #16 「朋友的白猫」      reviewed=true
     hunt-sports-day        #17 「运动会」          reviewed=true
     hunt-pen-pal-letter    #18 「写给笔友的信」    reviewed=true
     hunt-fridge-note       #19 「冰箱上的便条」    reviewed=true
     hunt-term-review       #20 「学期总结」        reviewed=true
  引用了不存在案件 id 的课：（无）—— 无悬挂引用 ✅
```
**⇒ 任务书给的 5 个 id 与课号（`hunt-white-cat` / `hunt-sports-day` / `hunt-pen-pal-letter` / `hunt-fridge-note` / `hunt-term-review`）完全复现，数字 5 正确，且全部 `reviewed: true`。另：无悬挂引用（引用的 208 个 id 全部存在）。**

**5 个番外案的完整档案（脚本 E）**：
| 案 | # | 场景逐字 | 词数 | 错点 | 罪名种类 | 生词提示 | 英文逐字 |
|---|---|---|---|---|---|---|---|
| `hunt-white-cat` | 16 | 跟同学聊天时说到的一只猫 | 20 | 3 | **3**（`word_order`/`verb_form`/`preposition`） | `excited`, `o'clock` | `My friend has a cat white. She was excite about it all day. We went to home at five o'clock.` |
| `hunt-sports-day` | 17 | 运动会结束当晚写的日记 | 23 | 4 | **4**（`missing_be`/`tense`/`verb_form`/`fragment`） | `Sports Day` | `Sports Day was last Friday. We very excited. The race stop in the afternoon. Run fast was fun. Very tired, but very happy.` |
| `hunt-pen-pal-letter` | 18 | 英语课上写了一半的一封信 | 22 | 3 | **3**（`sv_agreement`/`run_on`/`preposition`） | `pen pal`, `Canada` | `My pen pal live in Canada. Because I miss her, so I write to her every week. She is good in English.` |
| `hunt-fridge-note` | 19 | 厨房冰箱门上贴着的家里留言 | 26 | 3 | **3**（`plural`/`missing_be`/`word_order`） | `fridge`, `soup`, `vegetables` | `The soup is in the kitchen. There are two egg in the fridge. The vegetables are fresh. I very busy today. Eat the chicken noodles hot.` |
| `hunt-term-review` | 20 | 期末写给自己的三行总结 | 28 | 3 | **3**（`tense`/`article`/`verb_form`） | `advice`, `term`, `scores` | `Last term, I learn a lot of English. My teacher gave us useful advice. She is best teacher in our school. I was excite to see my scores.` |

**合理性判断：合理，且有明文决策依据。**
**`huntCases.ts:24-27` 逐字**：
> 「**决策⑤（2026-09-13，5 课空 huntCaseIds 是否配案）：不配案，维持番外定位。** 空课（2/3/5/6/8 课）是第一季基础课，而番外案（white-cat/sports-day/pen-pal-letter/fridge-note/term-review）**各含 5-7 类混合罪名，是综合复习性质——配给基础课会越级撞墙，违背 R01 难度闸门。** 第一季混题复习已由「第 12 课番外整体解锁」承担（`huntService` R01）。」

**⚠️ 对这条依据的一处实测校正**：头注说「各含 **5-7 类**混合罪名」，**但实测每案只有 3–4 类**（上表：3/4/3/3/3）。**⇒ 头注的「5-7 类」与实测不符（可能是笔误，或曾是别的统计口径）。** **但结论不受影响**——**3–4 类混合罪名配给第一季基础课（L2/L3/L5/L6/L8 各讲一个单点）仍然是越级。** **建议顺手校正这处注释数字。**

**另一处交叉证据（`src/edge/h1-hunt-data-integrity.test.tsx:229-236`）**：
```ts
// 番外案（未被课程引用）无 unlockLesson 是设计如此：整体挂第 12 课档位。
const extras = new Set([
  "hunt-white-cat", "hunt-sports-day", "hunt-pen-pal-letter",
  "hunt-fridge-note", "hunt-term-review"
]);
expect(noPath.filter((id) => !extras.has(id))).toEqual([]);
```
**⇒ 测试里已把「5 个番外案」硬编码为白名单，且注释逐字说明「整体挂第 12 课档位」——这个设计是有测试保护的。**

**⇒ 我的判断：番外案的存在合理，且不需要改。** 三点理由：① **有明文决策 ＋ 测试白名单双保护**；② **功能上它们是「第一季混题复习」的载体**（挂第 12 课整体解锁）；③ **它们被 `reviewed: true` 保护**（R15 正是为「未被引用的案件」设的——**这 5 案就是 R15 这道守门存在的唯一理由**）。
**⇒ 连带含义**：**R15 断言的存在价值，正是因为这 5 案。** 若将来把这 5 案配课，**R15 会变成「过滤空集」的永久恒真断言**（因为所有案件都被引用了）。**这是「保留 reviewed 字段」的又一条理由。**

---

## ⑧ 自我核查记录

**① 我在本批修正了任务书的一处数字，并给出了溯源。**
任务书写 `tell` 正侧 **5**，我测到 **6**（槽位）。**我没有直接接受任务书的数字，也没有直接宣布任务书错了**——而是**查明了差异来源**（`dialogueEn` 与 `dialogue[0].en` 在 56/204 课里逐字相同，L41 被双计），**确认「5 课」与「对话第一句」两个描述都对，只有槽位计数不同**。**并在 §2.2 建议统一口径（报去重后处数）。**

**② 我修正了任务书对 `GRAMMAR_ERROR_TAGS` 的表述。**
任务书说「`GRAMMAR_ERROR_TAGS` 也是 11 个」——**数字对，但我发现理由已变**：2026-09-20 起它从 `LABELS` **派生**（`huntService.ts:426-428`），不再手写。**这个变化改变了 `comparison` 的影响面**（从「页面按钮」扩到「弱点引擎/画像/干预」），**我把它写进了 §6.3 的影响 ③。**

**③ 我自己推翻了一处中途写下的错误结论（如实登记）。**
我在写 §6.5 的初稿时，先写下「`h2-hunt-judging.test.tsx:112` 会红」。**写完我去逐行核实，发现该测试用的案件是 `hunt-call-mother`，其全部 tag 实测为 `missing_be`/`preposition`/`run_on`/`tense`/`plural`/`verb_form`/`sv_agreement`/`word_order`——不含 `comparison`，且我建议改判的 7 处也不涉及此案 ⇒ 断言实际上不会红。** **我把表格里那一格从「会红」改成了「不会红，但注释与 `it()` 标题会变成假陈述」，并补上了精确行号（`:95`/`:101`/`:102`/`:107`/`:112`）。**
**⇒ 这一处修正的意义**：它把建议从「改 2 处」改成了「改 1 处断言 ＋ 改 4 处文字」——**如果我不复核，施工者会按「会红」去改一条本来不需要改的断言。**

**④ 我没有为了维持判据一致性而忽略新证据（任务书点名要求）。**
- **我做了两读测试**（字面/词元），**发现判据对 `lose`/`break`/`say` 有读法敏感性**——**这是对批四十七结论的回溯性发现，我如实写了**（§2.6a），**并给出判据收紧建议**，**没有为了保住「判据解释力完美」的说法而隐去。**
- **我指出了判据在本案没覆盖的因素**（`say` vs `tell` 分工，§2.6c），**并把结论从 `told` 转到了 `say`**。

**⑤ 我区分了「明说」与「推断」，且没有把推断写成结论。**
- §③/§⑤ 的每一条**逐字引用**都标了源 ＋ URL ＋ **本批实测的抓取状态**（`HTTP=200 size=…`）。
- **§5.2 我把「抓不到」的部分完整登记了**（`*I told to him` 侧一条没抓到，列了 8 个核查对象的实测结果），**没有拿 `*say someone something` 的证据去冒充 `*tell to him` 的证据。**
- **§5.3 的 4 条推断全部标了强度与反证**，其中 **I1/I3 明确写「无任何源明说这一点，这是纯推理」。**

**⑥ 我没有把「竞品的空位」写成「我们的优势」。**
§4.1② 逐字写了：「**这个空位很可能是因为「拆开更好教」……我方若并置，是差异化的选择，不应被描述为「竞品做不到」——它们是选择不做。**」**并且 §4.1③ 主动写了一处我方落后于竞品的地方**（`say` 侧防错落后于 `english.cool`）。

**⑦ 我在两个字段问题上给出了与任务书提示不同的机制。**
- **问题一**：任务书提示「点了只能得到『这里确实有问题，但不是…』」——**我实测发现还有「扣分」和「污染三个下游」两层**（§6.3），**并且发现真因是「错标」不是「无案」**（§6.4）。**修法建议与任务书给的三选项都不同**（改判 tag，§6.5）。
- **问题二**：任务书提示「R13/R15 的断言依赖它」——**我实测确认了这个依赖，并进一步发现这两道断言在恒 `true` 下是恒真的（vacuous）**，**且给出了「删了就红」的反证**（§7.3②）。**建议也超出了任务书给的两个选项**（保留 ＋ 补一道基于时间的守门，§7.3③）。

**⑧ 我核实了任务书给的每一个数字，没有一处照抄。**
`tell/tells/told` 三行表 ✅、`says`/`said` 我额外测了、`comparison` 11/10/0 ✅、`reviewed` 213/213 ✅、5 个番外案 id 与数量 ✅。**每一处都附了脚本输出原文。**

**⑨ 我发现的、任务书没提的连带事实（5 条）**：
1. **`gave` 已经立课（L204）**（§2.7）——**这直接改变了 `told` 的先例背景**（批四十七说两者归类，现在 `gave` 有主角课且已落地，`told` 两读皆零——**两者不同类了**）。
2. **判据对 `lose`/`break`/`say` 有「字面/词元」读法敏感性**（§2.6a）——**对批四十七结论的回溯性发现**。
3. **我方 L38 是唯一的转述课，用的是 `say` 侧，6 张错卡里 4 张打从句动词、1 张打否定前移、1 张打 `say → says`，零张打「人宾语」**（§4.1③ 已按实测改正）。
4. **全库扫 `*say + 人` 与 `*tell to + 人` 两类错型均为 0 处**（§4.1③ 脚本 H 核查 C/D）——**两个方向的经典陷阱都没有对照卡。**
5. **番外案头注说「各含 5-7 类混合罪名」，实测每案 3–4 类**（§7.4）——**一处注释与数据的偏差。**

**⑩ 脚本可复跑，无副作用。**
**8 个脚本**全部**只读**（`import` 数据 + `console.log`），**不改任何数据文件**。运行方式写在文件头注释里。

---

## ⑨ 不确定项

| # | 不确定项 | 我确定到什么程度 | 缺什么才能确定 | 对结论的影响 |
|---|---|---|---|---|
| **U1** | **判据的「收紧版」措辞是否会被采纳**（从「原形当过主角」→「原形当过主角**且该课讲的就是这个词的形态**」） | **我确定现状的措辞在本案有两个读法、且对 `lose`/`break`/`say` 会分叉**（§2.6a 实测）；**不确定收紧版是否会把某些已立的课误伤** | 需要一次对全部 27 个「有主角课的过去式」的复核（本批只做了 19 个词的对照） | **中**——影响判据能否作为长期工具；**不影响本批 `told` 的结论**（`tell` 两读皆零） |
| **U2** | **`comparison` 的语义边界**（「最高级前加 the」算 `article` 还是 `comparison`？「`very → much`」算 `word_order` 还是 `comparison`？） | **A 档 7 处我有高信心**（讲解逐字都在说「比较/更/最」）；**B 档 6 处的归属我没有权威依据** | 需要 Cambridge/Oxford 对「comparison」这一语法范畴的**权威边界定义**（本批**未去抓**——Cambridge 的 `Comparative and superlative adjectives` 页未取） | **中**——A 档改判不受影响；**B 档我给的是「可改可不改」而非结论** |
| **U3** | **`*I told to him` 侧的中文负迁移是否真的罕见，还是我抓取失败** | **我确定「在我能访问的源里一条都没有」**（§5.2，8 个核查对象实测）；**不确定这是「源头没有」还是「我抓不到」**（知乎 403、必应中文检索被本地法律提示截断） | 需要能访问知乎/百度学术等被墙或被反爬的中文源 | **中高**——**这直接关系 §5.3 I1/I3 两条推断的可信度**；**但不影响 `told` 的不处理结论**（该结论由内部数据 ＋ 判据支撑，不依赖负迁移证据） |
| **U4** | **L204（`gave` 课）是何时、按哪个决策加的** | **我确定它现在是 L204、`grammarLabel = "昨天版 · give 变 gave"`、`contrast` 6 张**（脚本实测）；**不确定它是批四十七之后的哪一步落地的** | 需要 `git log -p src/data/grammarLessons.ts` 的逐 hunk 追查（本批**未做**——`git status` 显示该文件是**未提交的修改**，历史里可能查不到） | **低**——不影响任何结论，只影响「批四十七建议 → 落地」的因果叙述 |
| **U5** | **`reviewed` 若改为带 `reviewedAt` 时间戳，是否会与 `Card.masteredAt` / `Review.reviewedAt` 的既有模式冲突** | **我确定本项目已有这个模式**（`types.ts:32-33` `masteredAt` ＋ `:142` `reviewedAt`，注释均说明「仅在状态转换瞬间写入」）；**不确定存储容量影响**（213 个案件 × 一个 ISO 时间串 ≈ 6KB，**在「14~18 个月撞 5MB」的背景下可以忽略**） | 无需更多信息 | **低**——建议可行 |
| **U6** | **`hunt-enough-bag` 那一处（`heavy → heavier`）改了会不会让「案件罪名」与「所属课」脱钩** | **我确定它挂在 L71（`enough` 的位置课），不是比较课**（脚本实测）；**不确定「案件罪名必须与所属课语法点一致」在本项目是不是硬规则** | 需要看 R01/R13 的原始约束文本（本批只看了 `huntCases.ts` 头注与测试，**未找到这条硬规则**） | **低**——我已建议**这一处不改**（§6.4 末），**属于保守选择** |
| **U7** | **`told` 若未来要立课，该立在第几课** | **完全未评估**——本批结论是「不处理」，故**没有做课序设计**；**我确定的前置条件是「必须先有 `tell` 的现在时教学位次」，而该位次当前为零** | 需要先设计 `tell` 的现在时课（含分工 ＋ 双宾语 ＋ `tell a lie` 例外），再设计 `told` | **低（本批）**——**但这是 `told` 事件的下一步。** 我在 §3.2③ 说明了跳步的具体风险（会把「分工」「双宾语」「`tell` 的例外」「形态变化」四件事压进一课） |
| **U8** | **`h2-hunt-judging.test.tsx:102` 的注释（「没有任何案件使用该罪名（见 H1），点了必然归因不当」）是否在别处还被引用** | **我确定该注释在 `:102`、`it()` 标题在 `:95` 与 `:107`**（逐行核实）；**不确定「比一比是空罪名」这一说法是否被写进了 PRD/交付文档/其他测试** | 需要全仓检索该说法的引用面（本批只检索了 `src/` 下的 `comparison`，**未检索 `deliverables/` 与根目录 `.md`**） | **中**——影响「改判时需要同步改几处文字」，不影响改判本身 |

---

**（全文完）**
