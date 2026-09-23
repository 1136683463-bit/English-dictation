# 瑞思 · 第 48 批用户研究与内容缺口分析：`told`

- **批次**：第 48 批（承第 47 批 L204 `gave` 收口之后）
- **范围**：只做研究，**不改任何代码 / 数据**
- **本批主题**：`told`（`tell` 的昨天版）与 `tells`（`tell` 的「他/她」形）该怎么处理
- **核查脚本**：`/Users/liujun/Documents/英语听写/deliverables/product-strategy/working/told-audit-2026-09-23/s01–s30`（只读；**全部用 node 词边界正则**，**不用 grep**）
- **日期**：2026-09-23

---

## ① 结论摘要

| # | 结论 | 把握度 |
|---|---|---|
| 1 | **`told`：不处理（登记为「已登记未做」）。** 三个选项里选 **(a)**。不做，不是「暂缓」——是本批判定**不该做** | 高 |
| 2 | **`tells`：不处理，且不必单列为缺口。** 它与 `losing` / `loses` / `breaks` 同类——**规则可推断、无场景需求**。它与 `wears` **不是**同类（见 ③3.2） | 高 |
| 3 | **不做 `told` 的第一位理由不是「原形没当过主角」，是「用户根本还没拥有 `tell` 这个动词」**：`tell` 在库内**只有 5 句话**（去重后），**全部是 NPC 的祈使句**；**用户角色（204 句 `me` 行）从来没有产出过 `tell` 家族的任何一个形状**。教一个用户尚未拥有的动词的昨天版，时序上是空的 | 高 |
| 4 | **任务书引用「原形是否当过主角」判据，我实测它 47 个词对里有 14 个反例，因此它「不是充分条件」。** 但它在本批**作为否决线继续成立**——详见 ③3.3。我给出了**修正版判据**（三条并列，任一条满足才立课） | 高 |
| 5 | **正侧 0 是真的 0，且对口径完全不敏感**：`told` / `tells` / `telling` 在四种口径下**全部为 0**，在**全库 375 个 `src/**/*.ts(x)` 文件的任何字符串字段**里也只出现在 3 个非内容文件里（1 个词典数据 + 2 个引擎词表，**且都是不可达的死代码**，见 ⑤5.6） | 高 |
| 6 | **⚠️ 本批最重要的意外发现**：`src/services/languageGateService.ts:37` **已经有 `tell: "told"`**，`src/services/grammarAmbushService.ts:171` **已经有 `"tell","tells","told"`**。两处都**写入了但不可能被触发**（触发所需的 `sampleAnswer`/`variant.en` 全库 0 处含 `told`）。**这解释了为什么缺口能活到今天**：任何人扫引擎词表都会看到「已经处理了」 | 高 |
| 7 | **不做 `told` 用户会不会受影响？几乎不会，而且与 `wore` 的伤害路径性质不同。** `wore` 有真实伤害（L20 用户被要求**答出** `wore`，却要等 19 课才第一次见到 `wear`）；**`told` 没有任何一节要求用户产出它**——没有「答错」的入口，就没有伤害路径 | 高 |
| 8 | **5 处 `tell` 的上下文已全部查清**（④）：**4 处是同一句模板 `Tell me about your X.`**（L101/L110/L117/L185），**1 处是 `Can you tell me about your class?`**（L41）。它们的共同角色是**每课的「话头」**——NPC 递给小美一个话题，小美再用**本课新学的结构**回答。**`tell` 在这 5 句里是纯功能性的发问套件，不是教学对象** | 高 |
| 9 | **若将来必须做，我推荐的路径不是立课、也不是挂靠那 5 课**，而是**挂靠 L38**（`转述别人的话`）——理由见 ③3.5。**但本批不建议现在做**（L38 已满 6 卡，且 `said` 在 L38 是被判错的干扰项，需要先处理那个摩擦） | 中 |
| 10 | 外部权威（⑤）：**Cambridge / OALD / BC / 中文侧 iciba 与 letmeenglish 五源一致**——`tell` 是 **A1 / beginner / 初级**，`told` 是它的**不规则过去式**；**Cambridge 词典给 `tell` 的 A1 首例句恰好就是 `Tell me about your holiday then.`**，与本项目那 4 句 NPC 台词**同款句式**。逐字引用见 ⑤ | 高 |

**最关键的一句话**：`told` 不是「缺一块砖」，是**「那面墙还没砌」**。库内整块「转述 / 询问别人」的表达（`say` 2 处、`write` 1 处、`told` 0、`asked` 0、`asks` 0）在 204 课里都是空白——而中文侧的「告诉」意图**已被系统性地改用「把信息直说」来承载**（11 处，见 ⑤5.5）。所以 `told` 的正解是：**登记，等「转述」这条 register 整体立项时一并处理，而不是单独补一个词的昨天版。**

**第二关键的一句**：**我不同意「把它挂到那 5 课里挑一课」的做法**。5 个候选宿主里 **4 个是收口 / 合体课（L41 收口、L110 收口、L117 合体、L185 零新知收口）**，而项目测试**明确把收口课定义为「零新知」**——往收口课加新点是设计上的直接违规。唯一可考虑的是 L101，但它也是「混排（then **认读**）」——认读课。**候选池实际上已经空了。**

**第三关键的一句（⚠️ 本批的优先项不在 `told`）**：与本报告**平行**的竞析（`competitive-analysis-told-2026-09-23.md`，脚本 `.told-verify-48*.mts`）**独立得出了同一个核心结论**「`told` —— 不处理」，且**指出一个比 `told` 更紧急的项**：**`say` 侧零设防**。我**独立复核后确认成立**——L38 是全库唯一转述课（用 `says`），而**全库「`say` + 人」错型设防 = 0 处**（逐条见 ⑥6.4 表 13）。**⇒ 若本批只做一个动作，应该做「L38 补 `say` 侧防错卡」，而不是给 `told` 立课**——因为 `say` 已经**被教过却没设防**，这比「没教过的词的昨天版」风险高得多。

---

## ② 判定与理由

### 2.1 三个选项的正面评估

| 选项 | 评估 | 结论 |
|---|---|---|
| **(a) 不处理** | ✅ 成立。且**必须登记**——理由充分（见 2.2），不是消极不做 | ✅ **选这个** |
| **(b) 挂靠** (L41/L101/L110/L117/L185) | ❌ **候选池已空**：4/5 是收口或合体课（项目测试定义为零新知），余下 1 课是「认读」课。详见 2.3 | ❌ |
| **(c) 立课**（推翻批 47 判据） | ❌ 三条硬否决：① 用户没有 `tell` 的原形课做前提；② `told` 的中文落点被「把信息直说」占掉了；③ 全库**没有一处**要求用户产出 `tell` 家族——新课会是一节**从头到尾没有用户产出**的课 | ❌ |

### 2.2 「不做」是一个合法结论，而且本批**必须登记**

本项目有成熟先例（任务书指出）：`several`（三十四批判「不做独立课」）、`loud` / `careful`（四十六批「不处理」）、`worn` / `losing` / `breaking`（四十六批「登记为已登记未做」）。

**但 `told` 的登记与 `losing` 那一批有一个实质区别，必须写清楚：**

```
`losing` / `breaking` / `loses` / `breaks` —— 登记理由：全库 0 处，但都是低频，不构成真实缺口
`worn`                                   —— 登记理由：全库 0 处，但「穿过/戴过」在日常里出现频率极低
`told`                                   —— 登记理由：⚠️ 不一样
```

`told` **不是低频词**。它是英语里最高频的动词之一（Cambridge 词典把 `tell` 标 **A1**，是本项目整个等级的起点档）。**所以 `told` 的登记不能写「低频不做」，只能写「不该单独做」。** 这个区别很重要——如果下一批有人按「低频」的模板去复核，会立刻发现前提不成立而推翻这个结论。

**本批给 `told` 的登记理由（请照抄这句）：**

> `told` 的正侧为 0，**不是因为这个词低频**，而是因为**库内整块「转述 / 询问」的表达都是空白**（`told` 0、`asked` 0、`asks` 0、`say` 2、`said` 1、`write` 1），且**中文侧的「告诉」意图已被系统性地改由「把信息直说」承载**（11 处）。`told` 必须随「转述」这条 register 整体立项，**不单独补一个词的昨天版**。

### 2.3 为什么「挂靠」的候选池是空的（逐课核查）

任务书问：那 5 处 `tell` 在 L41/L101/L110/L117/L185 的对话里，哪一课最适合挂？

**我逐课查了教学点与结构（脚本 s30 输出）：**

| 课 | `grammarLabel` | target 词数 | 教学点性质 | 能挂吗 |
|---|---|---|---|---|
| **L41** | `收口 · 两句话拼一句` | 7 | **收口课** | ❌ 收口课 = 零新知（测试注释明写） |
| **L101** | `一句接一句 · 混排（then 认读）` | 12 | 「**认读**」——只要求认，不要求产出；课本身是收口性质 | ⚠️ 勉强，但与 `told` 无结构关系 |
| **L110** | `收口 · 四张脸排一行` | 7 | **收口课** | ❌ |
| **L117** | `合体 · 四种说法排一行` | 5 | **合体课**（这一章四课的总结台） | ❌ 合体课同样不引入新点 |
| **L185** | `收口 · 零新知（五对八句排一行）` | 13 | **零新知收口课** | ❌ 名字里就写了「零新知」 |

> **4 / 5 是收口或合体课。** 而且剩下那 1 课（L101）的教学点是**过去进行**（`I was reading. It was raining.`），与 `tell` 的形态毫无结构关系。

**但我要诚实标出一个反驳（这会让结论更完整）：**

第 46 批我在 `wear` 上提过一条，批 47 的竞析也用过：**「`bothRight` 卡的设计本身就是并排展示两种说法，不需要用户先懂『换零件』才能读」**——所以「时序问题」不构成对**挂卡**的反驳。

**这条对 `wear` 成立，对 `told` 不成立，差别在这里：**

```
`wear` 挂卡的场景：L39 已经在用 wears（19 处正侧），L203 挂一张 bothRight 卡
                  → 卡里的两句都「已经存在」，只是并排
`told` 挂卡的场景：库内没有任何一句含 told（全库 0 处）
                  → 卡里必须新造一句带 told 的句子，这是「新造内容」不是「并排已有内容」
```

**「并排已有」不需要时序前提，「新造」需要。** 所以那条反驳不适用于本批。

### 2.4 「立课」的第三条否决最致命：**没有用户产出**

我查了全库 204 课的 `dialogue`（612 行：408 行 NPC + 204 行 `me`）：

```
me 行（用户角色台词）总数 = 204 句
  其中含 tell 家族 = 0 句     ← 用户角色从不「说 tell」
npc 行总数 = 408 行
  其中含 tell 家族 = 5 行

课程里要求用户作答的字段（guided.answer / practice.answer / recall.answer）含 tell 家族 = 0 处
```

**结论：`tell` 在全库是一个「只听不产」的词。** 立一节 `told` 课意味着什么？意味着这一课要教「一个用户从未产出过、也从未被要求产出的动词」的**过去式**。这在教学逻辑上是倒的——**先要有 `tell` 的原形课，才轮到 `told`。**

### 2.5 一个可直接复用的「伤害路径」对照（本批最实用的一条判据）

第 46 批我用「时序缺陷」证明 `wore` 有真实伤害。**同一个方法用在 `told` 上，得到相反结果：**

| | `wore`（第 46 批，判「有伤害」） | `told`（本批，判「无伤害」） |
|---|---|---|
| 用户在哪一课被要求**答出**这个词？ | **L20**（案件 `hunt-late-note`，`errors[1].correction = "wore"`，讲解逐字「yesterday 说的是昨天的事，动词要换昨天版：wore」） | **没有任何一课** |
| 那时用户见过该词的原形吗？ | ❌ 没见过（`wear` 原形要到 L39 才第一次出现，且只在**错句**里） | 见过（`tell` 在 L41 就出现了） |
| 之后多久能再见到？ | **19 课**（L20 → L39） | 不适用（因为从未被要求答出） |
| **判定** | **有真实伤害** | **无伤害路径** |

**⇒ 这条对照就是「不做」的最强支撑**：用户不会因为缺 `told` 而卡住或答错——**没有任何一节会让他写 `told`。**

---

## ③ 判定与理由（续）· 对「原形是否当过主角」判据的态度

### 3.1 任务书给的实测结论，我复核**成立**

> `tell` 从未当过主角（0 课 targetSentence 含 `tell`）

**✅ 复核成立。** 并且我把它扩到整个 say 家族：

```
targetSentence 含该词的课数（全 204 课）：
  tell   ❌ 0 课
  tells  ❌ 0 课
  told   ❌ 0 课
  say    ❌ 0 课      ← ⚠️ 任务书未提：say 也从未当过主角
  says   ✅ L38 1 课
  said   ❌ 0 课
  ask    ❌ 0 课
  asked  ❌ 0 课
  asks   ❌ 0 课
```

**⚠️ 这里有一个任务书之外的发现**：`say` 也**从未当过主角**，而 `said` 的正侧是 **1 处**（L105 的 NPC 台词 `Your mom said no?`）。这说明**「say 家族」和「tell 家族」的处境是同一个**，不是 `tell` 单独的问题——**进一步支持「这是 register 级空白，不是单词级缺口」**。

### 3.2 `tells` 该怎么判（任务书问题 3）

任务书问：`tells` 也是正侧 0，是否更值得做？**与 `tell` 的关系类似 `wears` 与 `wear`？**

**我的答案：`tells` 不值得做，而且它与 `wears` 不是同类。** 关键在于 **L25 的规则是「开」的**：

| | `wears` | `tells` |
|---|---|---|
| 规则课 | **L25**（`他/她/它加 -s`，`He drinks milk every day.`） | **L25**（同一课） |
| 规则是否已立？ | ✅ L25 | ✅ L25 |
| **正侧处数（C1 口径）** | **41 处 / 4 课**（L39×19、L40×1、L41×16、L203×5） | **0 处** |
| **为什么正侧这么多？** | ⚠️ **因为 L39 的教学点「给名词挂尾巴 · who」恰好需要它**——逐字：`The boy who wears glasses is my brother.`，`who` 指他，所以 `wear` 必须加 `-s`。**这是教学点的自然需求，不是刻意安排** | ❌ 没有任何一课的语法点**需要** `tells`。`tells` 的场景是「转述别人说的话」，而库内**没有转述课** |
| 判定 | ✅ 已充分覆盖 | ❌ **不做** |

**⇒ 所以 `wears` 有 41 处正侧不是「项目特意补了它」，是「L39 的语法点需要它」。`tells` 缺的不是重视，是场景。**

**补充一条让「不做」更稳的证据**：`tells` 属于「用户可自行推断」的一类——

```
L25 的规则是开的（drinks / likes / plays / watches / studies / rains / has 都在用），
且 deepDive 逐字写明「大多数动词直接加 -s」+「以 s、x、ch、sh、o 结尾的加 -es」。
tell 属于「直接加 -s」那一类（tell → tells），规则完全覆盖，无例外。
```

**⇒ 用户写 `he tell` 时，是可以靠 L25 的规则自己推出 `tells` 的。对比 `wears` 在 L39 的情形（`who` 也是「他」——需要一条额外推理），`tells` 甚至更简单。** 建议与 `losing` / `loses` / `breaks` 一起登记为「可推断，不构成缺口」，**不列入待办**。

### 3.3 我对「原形是否当过主角」判据的态度：**方向对，但不是充分条件**

**我把这条判据在 47 个「原形 / 过去式」词对上完整实测（脚本 s22）。**

**判据表述**：过去式该不该立课，看它的原形是否当过某课主角（`targetSentence` 含该原形）。

**实测结果：**

```
C-严格（只看原形 targetSentence）  命中 33 / 反例 14
反例（过去式已有正侧，但原形从未当主角）：
  say→said(1)   see→saw(8)     find→found(1)   leave→left(46)
  make→made(32) get→got(159)   hear→heard(1)   meet→met(4)
  win→won(10)   drink→drank(5) ring→rang(31)   fall→fell(3)
  lose→lost(56) break→broke(27)
```

**14 个反例意味着这条判据「不充分」——它不能预测「该立课」。但它仍然有效：作为「否决线」它在本批的 47 对里没有一次误伤**（即：没有出现「原形从未当主角、但项目后来确实为它立了课」的反向反例——`lose` / `break` 在批 46 的判断也是「挂靠」不是「立课」）。

**⇒ 我提出修正版判据（三条并列，任一条满足才立课）：**

> **过去式立课判据 V2**
> 满足以下**任意一条**，才考虑为某个过去式立课：
> 1. **原形当过某课主角**（`targetSentence` 含该原形）；或
> 2. **该过去式属于 L10 / L11 的「第一批换零件」**——最基础的 `went` / `ate` / `saw` / `made` / `got` / `left` / `found` / `met` / `won` / `heard` 等，它们的过去式由 L10/L11 承担，且**后续课程会反复复用**（`went` 68 处、`got` 159 处）——**即：它已经在库里被广泛使用，不需要单独一课**；或
> 3. **该词本身是本项目的语法高频功能词**（`go` / `get` / `know` / `have` / `be` / `do` / `say` 这一类），它们的形态变化属于「必须会」，且库内已有大量使用场景支撑。

**用 V2 检验 `told`：三条全不满足。**

```
① 原形当过主角？      ❌ 0 课
② 属于 L10/L11 第一批？ ❌ 不是（L10 教的是 went，L11 教的是 ate）
③ 是语法高频功能词？   ⚠️ 部分成立——但「高频」这个理由对 told 无效，
                        因为高频恰恰意味着它必须有场景，而库内场景为 0
```

**⇒ 三条全不满足 ⇒ 不立课。判定不变。**

### 3.4 我为什么在 V2 里加第 ② 条（一条自我修正的记录）

第 46 批我给 `lose` / `break` 判「不该立课、该挂靠」时，用的是「原形没当过主角」。**批 47 路线图记录了这个判定的结果：`lose` / `break` 最终判挂靠**。但**批 46 里 `lost` 正侧 56 处、`broke` 正侧 27 处**——它们**已经被大量使用**，所以「不立课」是对的。

**这暴露了原判据的一个漏洞**：「原形没当过主角」这个条件，在 `lost` / `broke` 上得到「不立课」的正确结论，**不是因为判据对，而是因为「它们已经被广泛使用所以不需要新课」这个隐含前提恰好也成立。**

**⇒ 所以我必须把第 ② 条明写出来**：它是**把 `lose`/`break`/`left`/`made` 这一批从「反例」变成「正常情况」的关键**。加上第 ② 条后，修正版判据在 47 对上的反例从 14 降到 **`say→said` 1 个**（而这一个也有解释：`said` 那唯一 1 处正侧是 NPC 台词，不是教学产出——所以它其实也不是真反例，见 ③3.1）。

### 3.5 若将来必须做 `told`：我推荐挂靠 **L38**，不是立课

**这不是本批建议的动作**（L38 已满 6 卡，且有个必须先处理的摩擦），但任务书要求「若选 (b) 给具体方案」，我给出**将来最优路径**：

**为什么是 L38 而不是那 5 课？**

```
L38  id=lesson-38-somebody-said
     grammarLabel = "话中话 · 转述别人的话"
     targetSentence = "She says she will come."
     oneLineRule 逐字 = "转述别人的话：She says + 原话照装（she will come）"

✅ L38 是全库唯一一课的教学点**就是转述**——`told` 的唯一用法（告诉某人某件事）在这里是**主线的自然延伸**，不是劫持
✅ L38 已经在讲「谁说了一句话」：`She says`（**C1 正侧 20 处，其中 A1 无歧义正确句槽 18 处**，落点全在 L38；另 L41×2 / L181×1）
✅ L38 已经有 6 条 contrast，其中 contrast[3] 逐字就在讲 `She say` → `She says`（句首那个「谁」She 是他/她/它版）
❌ 但 L38 已满 6 张对照卡（全库 202 课都是恰好 6 张）
❌ 且 L38 的 guided[0] 把 "She said" 当干扰项判错：
     options = ["She says","She say","She said"]，answer = "She says"
     → 用户选 "She said" 会被判错（explain 逐字："句首那个「谁」 She 是他/她/它版，say 加 -s：She says。"）
```

**⚠️ 那个 `She said` 干扰项是必须先处理的摩擦**：它是全库**唯一一处** `said` 被点名判错的地方。**如果将来要在 L38 讲 `told`，第一步是把这道题的干扰项从 `She said` 换成别的**——否则同一课一边判 `She said` 错、一边教 `told`，会自相矛盾（这正是 L199 那个「同课自相矛盾」的先例类型，批 47 已登记）。

**文案草稿（若将来采用）：**

| 项 | 草稿 |
|---|---|
| 挂靠位置 | L38，替换 contrast[3]（`She say` → `She says`，那张卡与 guided[0] 重复） |
| 卡片 `wrong` | `She told me she will come.`（**这是对句**，与下面同列） |
| 卡片 `correct` | `She says she will come.` |
| `bothRight` | **true**（两张都对——正是双正解卡的用法） |
| `wrongMark` | 省略（双正解卡的判据是 `bothRight`，不是 `wrongMark`） |
| `whyZh` 草稿 | **「两句都对，差在什么时候说的：says 是现在说的——她的话此刻转给你；told 是昨天说的——就是 says 的昨天版。同一个『告诉』，一个刚出口，一个已经说完了。」** |

> **零术语自查（已实跑 `findZeroTermHits` 验证）**：草稿中 `says` / `told` 是词形展示（课程自第 1 课起就用「be 动词 · I am」这类形式）；**「昨天版」是项目自建词汇，库内 41 课已在用**。**实测 `isZeroTermClean(草稿) === true`**，且**不含 `**` 星号**（满足星号守门）。
>
> ⚠️ **一处需要留意的措辞**：草稿里出现「**告诉**」二字。而「告诉」在库内**已被 11 处用作「把信息直说」的提示语**（见 ⑤5.5）。**若采纳本卡，建议把「同一个『告诉』」改成「同一个词」**，避免与那 11 处先例冲突——即推荐版本：**「两句都对，差在什么时候说的：says 是现在说的——她的话此刻转给你；told 是昨天说的——就是 says 的昨天版。同一个词，一个刚出口，一个已经说完了。」**（同样实测零术语 + 无星号）

**若选 (c) 立课（我**不**推荐），按项目标准结构需给出的最小方案：**

```
场景（14 合法 id 里选，且 space 仍为 0 次使用）：
  建议 `campus`（第 48 批已 58 次使用，是最稳的场景）或 `mansion`（66 次）
  ⚠️ space 到 L204 仍是 0 次使用；但「告诉」场景与太空脱节，**不建议**用它

targetSentence（难度闸门：L204 最长分句 12 词 ⇒ L205 上限 17 词）：
  候选 A：`She told me a story last night.`                最长分句 7 词 ✅
  候选 B：`I told her the news, and she told me a story.`  最长分句 11 词 ✅
  ⚠️ 但两个候选都过不了 D 层可抄率守门（见下）

3 条错句（必须全新，且不能撞库内已有的说家族错句）：
  ① `She tell me a story.`        ← 三单漏 -s，与 L38 contrast[3] 的 `She say` 同构 ⚠️
  ② `She told me a story every day.` ← 昨天版站进每天槽，全新 ✅
  ③ `She tells me a story yesterday.` ← 他/她形站进昨天槽，全新 ✅

⚠️ 但我**实测 D 层守门会拦下这一课**：
  `told` 不在 D 层「已教词」集合里（累计到 L204 共 810 词，含 tell 但不含 told）
  → 任何含 told 的练习答案都会被判「含未教过的词」
  → 必须先把 told 加进本课材料池，这又要求它先出现在 targetSentence / examples 里
```

**⇒ 立课的成本比看起来高，而收益（一个用户从未产出过的动词的昨天版）很低。这是「不做」的第三条支撑。**

---

## ④ 那 5 处 `tell` 的上下文分析

### 4.1 全貌

| # | 课 | 字段 | 英文逐字 | 中文 | `who` |
|---|---|---|---|---|---|
| 1 | **L41** | `dialogueEn` **+** `dialogue[0].en`（同一句，重复计 2 处） | `Can you tell me about your class?` | 「新老师微笑着问你。」 | npc |
| 2 | **L101** | `dialogue[0].en` | `Tell me about last night.` | 「小美撑着下巴，眼睛看着半空。」 | npc |
| 3 | **L110** | `dialogue[0].en` | `Tell me about your week!` | 「好朋友翻着你的本子。」 | npc |
| 4 | **L117** | `dialogue[0].en` | `Tell me about your family!` | 「好朋友翻着你的本子。」 | npc |
| 5 | **L185** | `dialogue[0].en` | `Tell me about your cousin.` | 「同桌翻着毕业纪念册问。」 | npc |

**⇒ 去重后的物理句数 = 5 句**（L41 那一句被 `dialogueEn` 与 `dialogue[0]` 各计一次）。

### 4.2 「那 5 处 `tell` 是否已经让用户建立了『tell』的概念？」——**没有，四条理由**

**理由一：这 5 句是 NPC 说的，用户角色（`me` 行）从不说 `tell`。**

```
dialogue 行总数 = 612（408 npc + 204 me）
me 行含 tell 家族 = 0 句
```

**理由二：这 5 句的中文字幕是「舞台指示」，不是翻译。** 用户看不到「告诉」这个意思：

```
L41 : EN "Can you tell me about your class?"  ZH "新老师微笑着问你。"
L101: EN "Tell me about last night."          ZH "小美撑着下巴，眼睛看着半空。"
L110: EN "Tell me about your week!"           ZH "好朋友翻着你的本子。"
L117: EN "Tell me about your family!"         ZH "好朋友翻着你的本子。"
L185: EN "Tell me about your cousin."         ZH "同桌翻着毕业纪念册问。"
```

**我实测了全库 `dialogue[0].zh` 的长度分布**：min 4 / p25 9 / **median 10** / p75 12 / max 19 字。

> **⇒ 全部是短舞台指示，没有一句是英文的翻译。** 用户在 `Tell me about your week!` 下面看到的是「好朋友翻着你的本子」——**这句话在中文里根本不含「告诉」**。所以用户即使读懂这 5 句，也不会把它和中文的「告诉」挂钩。

**理由三：这 5 句从未被复用作用户要作答的内容。**

```
L41 : npc 句被复用作答案？ ✗ 从未
L101: npc 句被复用作答案？ ✗ 从未
L110: npc 句被复用作答案？ ✗ 从未
L117: npc 句被复用作答案？ ✗ 从未
L185: npc 句被复用作答案？ ✗ 从未
```

**理由四：这 5 句的角色是「每课的话头」，功能是引出本课新结构——被引出的那个结构才是教学对象。**

| 课 | NPC 用 `tell` 递出的话题 | 小美用**本课新结构**回答 |
|---|---|---|
| L41 | 「跟我说说你们班。」 | `I know the boy who wears glasses.`（**挂尾巴**） |
| L101 | 「跟我说说昨晚。」 | `I was reading. It was raining. When you called, I was reading.`（**一句接一句**） |
| L110 | 「跟我说说你这周！」 | `My mom makes me do my homework.`（**谁让谁做什么**） |
| L117 | 「跟我说说你的家人！」 | `Grandma's birthday is in May.`（**撇号 s**） |
| L185 | 「跟我说说你的表姐。」 | `She can both sing and dance, and she likes neither tea nor coffee.`（**成对说法**） |

**⇒ `tell` 在这 5 句里是一个「提问套件」——它的存在是为了让对话自然，不是为了让用户学会它。** 这与「认读」类词（如 L101 的 `then`）定位相同。

### 4.3 一个值得记录的规律：`Tell me about your X.` 是本项目的「话头模板」

```
"Tell me about"          出现 4 次（L101/L110/L117/L185）
"Can you tell me about"  出现 1 次（L41）

对照其他话头模板的出现次数：
  "What do you ..."      5 次（L5,L42,L45,L46,L90）
  "What are you ..."     4 次（L13,L27,L29,L125）
  "What did you ..."     3 次（L10,L11,L198）
  "Where is the ..."     3 次（L80,L155,L195）
```

**⇒ `Tell me about X.` 是使用频率第二高的开场话头（4 次），仅次于 `What do you ...`（5 次）。** 这解释了任务书为什么在 5 个不同季的课里都能撞见它——**它是项目自己长出来的一个套件，不是刻意的教学安排。**

### 4.4 关卡侧：`tell` 出现得比课程里多得多（37 处）

任务书只问了课程与案件。**但 `tell` 的更大落点在「冒险关卡」——这是用户可见且要读的文本：**

| 位置 | 处数 | 示例（逐字） |
|---|---|---|
| 关卡 `npcLine`（NPC 台词） | **18 关 / 50 关 = 36.0%** | `"The walls repeat what you said at the station. Tell me—where do you live?"`（echo-gate-1）<br>`"The train is late. Tell me—what do you do now?"`（station-gate-3）<br>`"The vendor wipes the counter and smiles. \"Last order of the morning. Tell me everything: what, how many, and how much—in one breath.\""`（market-gate-8） |
| `STORIES[].setup`（布景文本） | 17 处 | `"A grey archway opens into the Archive. The keeper slides a heavy ledger across the desk. \"To enter,\" she says, \"tell me when you arrived.\""` |
| `misreadBranches[].npcReply`（答错时的回应） | 2 处 | `"「I want read this book」— ... It cannot tell whether you wish to read, or you are reading, or you read long ago."`（library-gate-3） |
| **合计** | **37 处** | |

**⚠️ 但一个关键澄清（我实测）：这 37 处里，`tell` 不是任何一关的判分内容。**

```
关卡「作答 / 判分」字段（sampleAnswer / acceptRegex / requiredPattern / counterExample / canDo / zhIntent）含 tell 家族 = 0 条
```

**⇒ 关卡里的 `tell` 全部在 NPC 台词与布景里，与用户作答无关。** 又一处「只听不产」。

**（附：`tells` 在关卡里也有 2 处，都在布景文本里）**

```
lighthouse/…: "And I tell them: it does not matter who. It m…"
lighthouse/…: "The lamp does not stop storms—it tells the truth about …"
mountain/…  : "The path tells no secrets to plain silence," he says.
```

---

## ⑤ 外部依据与逐字引用

**说明**：每条标 **【明说】**（源里逐字写了）或 **【推断】**（我的推理）。**所有【明说】条均附可访问 URL。**

### 5.1 【明说】`tell` 的等级与不规则性：**五源一致**

| # | 源 | 逐字原文 | URL | 等级 |
|---|---|---|---|---|
| **S1** | **Cambridge Grammar · `Say or tell?`** | **"Say and tell are irregular verbs. The past simple of say is said, the past simple of tell is told:"** ＋例句 **"Then he told me how he had got the job by lying about his age."** | `https://dictionary.cambridge.org/grammar/british-grammar/say-or-tell` | —（Easily confused words 章） |
| **S2** | **Cambridge 词典 · `tell`** | 词头逐字 **`told | told`**；首义项逐字 **"A1 [ T ] to say something to someone, often giving them information or instructions:"**，该义项**第一个例句**逐字 **"Tell me about your holiday then."** | `https://dictionary.cambridge.org/dictionary/english/tell` | **A1** |
| **S3** | **Cambridge · `Table of irregular verbs`** | 表内逐字行 **`tell / told / told`**；同表逐字 **`say / said / said`**、**`teach / taught / taught`** | `https://dictionary.cambridge.org/grammar/british-grammar/table-of-irregular-verbs` | — |
| **S4** | **OALD（牛津）· `tell`** | Verb Forms 逐字：**`he / she / it` → `tells`**、**`past simple` → `told`**、**`past participle` → `told`**、**`-ing form` → `telling`**；HTML 属性 **`cefr="a1" ox3000="y"`**（前 3 个义项均为 `a1`） | `https://www.oxfordlearnersdictionaries.com/definition/english/tell_1` | **A1 · Oxford 3000** |
| **S5** | **OALD · `told`** | 逐字：**"past tense, past participle of tell"** | `https://www.oxfordlearnersdictionaries.com/definition/english/told` | — |
| **S6** | **British Council · `Irregular verbs`** | 页首标 **"Level: beginner"**；表内逐字 **`tell (told, told)`**；同表逐字 **`say (said, said)`**、**`wear (wore, worn)`**、**`give (gave, given)`** | `https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/irregular-verbs` | **beginner** |
| **S7** | **British Council · `Past simple`** | 页首标 **"Level: beginner"**；逐字列出 **"tell → told"**、**"say → said"**、**"go → went"** | `https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/past-simple` | **beginner** |
| **S8** | **中文侧 · iciba（爱词霸）· `tell`** | 「词态变化」逐字：**「第三人称单数: tells ; 过去式: told ; 过去分词: told ; 现在分词: telling ;」** | `https://www.iciba.com/word?w=tell` | 高中/CET4/CET6 |
| **S9** | **中文侧 · iciba · `told`** | 释义逐字：**「v.表明( tell的过去式和过去分词 );」** | `https://www.iciba.com/word?w=told` | — |
| **S10** | **中文侧 · letmeenglish · 不规则动词** | `tell / told / told` 被归入 **「类型 2」**，位于 **「初级 – 不规则动词」** 段；类型 2 定义逐字：**「过去式和过去分词形式相同，但与不定词不同（不同-相同-相同）。」** | `https://letmeenglish.com/zh-hans/irregular-verbs/` | **初级** |

### 5.2 【明说】`say` 与 `tell` 的分工：Cambridge 与 OALD 给了完全不同的切法（教学价值最高的一条）

**Cambridge 的切法是「话 vs 内容」：**（`https://dictionary.cambridge.org/grammar/british-grammar/say-or-tell`）

> **"We use say and tell in different ways in reported speech. Say focuses on the words someone said and tell focuses more on the content or message of what someone said:"**
> 例句逐字：**"‘Hello,’ she said. / Not: ‘Hello,’ she told."**
> **"She told him they were going on holiday. (The focus is on the information.)"**

> **"Tell normally takes an indirect object (one or more people = io) and a direct object (the reported clause = do):"**
> **"The boy told [IO]us [DO]he didn’t want any money."**

> **"However, we use tell without an indirect object with words such as the truth, a lie, a joke, a story:"**
> **"You should never tell a lie. / Not: … say a lie."**
> **"Come on Kevin. You’re good at telling jokes."**

> **"Tell + indirect object + to-infinitive — We use tell with an indirect object and a to-infinitive to report a command or an instruction. We don’t normally use say in this way:"**
> **"They told us to come back the next day. / Not: They said us to come …"**
> **"They told her to wait till the doctor arrived."**

**OALD 的切法是「能不能带人」：**（`https://www.oxfordlearnersdictionaries.com/definition/english/tell_1`，`Which Word? say / tell` 栏）

> **"Say never has a person as the object. You say something or say something to somebody."**
> **"Tell usually has a person as the object and often has two objects: Have you told him the news yet?"**
> **"Tell is usually used when somebody is giving facts or information, often with what, where, etc: Can you tell me when the movie starts?"**
> **"Tell is also used when you are giving somebody instructions: The doctor told me to stay in bed. / NOT The doctor said me to stay in bed."**

**⇒ 两条切法合起来给出一条对本批直接有用的结论（【推断】）：**

> **`tell` 的核心特征不是「说」，是「对着某个人说」（必须带人）+「告诉的是信息而非原话」。** 而本项目 204 课的对话里，**NPC 是「对着玩家说」、玩家是「把信息直说」**——**这两条恰好都不需要 `tell` 这个标记**（因为「对着谁说」由场景本身表达，「信息而非原话」由「把信息直说」的答案承载体）。**这就是 `told` 在库内没有落点的语言学原因。**

### 5.3 【明说】`Tell me about …` 是权威教材的 A1 首例句式，与本项目那 4 句同款

**Cambridge 词典 `tell` 的 A1 首义项，第一个例句逐字：**

> **"Tell me about your holiday then."**

**本项目库内 4 句 NPC 台词：**

```
"Tell me about last night."      (L101)
"Tell me about your week!"       (L110)
"Tell me about your family!"     (L117)
"Tell me about your cousin."     (L185)
```

**⇒ 项目无意中采用的句式，恰好是 Cambridge 给 A1 学习者准备的第一个例句句式。** 这从侧面印证了这 5 句的定位是**入门级话头套件**，符合 A1 教学常规，**本身没有任何问题**——问题只在于「没有后续课把它接住」。

### 5.4 【明说】中文侧对 `tell` 的处理：只给词形，不给用法

**iciba 逐字**（`https://www.iciba.com/word?w=tell`）：「词态变化」栏只给 **「第三人称单数: tells ; 过去式: told ; 过去分词: told ; 现在分词: telling ;」**。

**letmeenglish 逐字**：`tell` 归 **类型 2（初级）**；类型 2 的定义句逐字 **「过去式和过去分词形式相同，但与不定词不同（不同-相同-相同）。」**

**⇒ 中文侧两源都**没有**给「`tell` 和 `say` 怎么分工」这条规则**——它们给的是词形表。**这与第 46 批对 `lose`/`break`/`wear` 的中文侧结论完全一致：中文侧给形状不给用法。**

### 5.5 【明说 + 实算】中文「告诉」在本项目里被系统性改由「把信息直说」承载

**我实测：全库有 11 处中文提示明写「告诉」，而它们对应的英文答案没有一处用 `tell`。**

| 课 | 「告诉」所在字段（逐字） | 本课英文答案 |
|---|---|---|
| L2 | `recall.promptZh` 「教室后墙贴着新同学的全家福，你要**告诉**大家照片上这个男生是谁。」 | `He is my brother.` |
| L3 | `recall.promptZh` 「课间同桌夸你的新书包，你想**告诉**她你有什么。」 | `I have a new bag.` |
| L6 | `recall.promptZh` 「你抬头看了看街口的大钟，想**告诉**同桌现在几点。」 | `It is three o'clock.` |
| L7 | `contrast[4].whyZh` 「**告诉**别人「他们是同学」用陈述句：They are。」 | `We are happy.` |
| L13 | `practice[1].promptZh` 「轻声**告诉**妈妈，你想说：老师正在看书。」 | `I am drawing a picture.` |
| L23 | `recall.promptZh` 「外婆在门口等你，你翻遍了书包也没找到，该**告诉**她坏消息了。」 | `I have lost my key.` |
| L26 | `contrast[3].whyZh` 「**告诉**别人「这里有公园」用陈述句 There is。」 | `There is a book on the desk.` |
| L29 | `contrast[4].whyZh` 「**告诉**别人「你打算看」用陈述句 You are。」 | `I am going to watch a movie.` |
| L64 | `practice[4].promptZh` 「**告诉**妈妈你读完了，你想说：我读完了那个故事。」 | `I finished reading the book.` |
| L107 | `recall.promptZh` 「同桌**告诉**你老师要找你，你问了句「上课前？」。」 | `The teacher had me come early.` |
| L146 | `contrast[5].whyZh` 「今天是把「不喜欢」**告诉**别人，还要说「我也」。」 | `I don't like coffee either.` |

**⇒ 11 处「告诉」意图，全部以「把信息直说」而非 `tell` 表达。** 这是**一个成熟的产品决策，不是缺陷**——因为它让零基础用户避开 `tell` 的人称宾语与 to-不定式结构（Cambridge 逐字：**"Tell + indirect object + to-infinitive"**，正是最复杂的部分）。

**但它有一个副作用必须登记**：**中文侧的「告诉」与英文侧的 `tell` 在用户心里永远挂不上钩**。将来若要做 `told`，**必须先解决这个映射缺失**，否则新课的提示句写「告诉」会与全库 11 处先例冲突。

### 5.6 ⚠️ 本批最重要的机制发现：两处「已经写了但不可达」的引擎词表

**任务书未提，我实测发现：**

```
src/services/languageGateService.ts:37
    tell: "told",          ← 已在 IRREGULAR_PAST 表里

src/services/grammarAmbushService.ts:171
    "say", "says", "said", "tell", "tells", "told", "see", "sees", "saw",   ← 已在 GRAMMAR_WORDS 里
```

**两处都是「写了但不可能被触发」：**

| 表 | 触发条件 | 实测 | 结论 |
|---|---|---|---|
| `languageGateService.IRREGULAR_PAST` | 某关的 `sampleAnswer` / `acceptRegex` 须含 `told`（`detectTenseTag` 逐字：`const sampleHasPast = sampleTokens.includes(past)`） | **含 `told` 的关卡 = 0 / 50 关** | **死代码** |
| `grammarAmbushService.GRAMMAR_WORDS` | 某课的 `variants[].en` 须含 `tell` 家族（`pickClozeWord` 作用在 `variant.en` 上） | **含 `tell` 家族的 `variants[].en` = 0 处** | **死代码** |

**⇒ 这就是缺口能活过 47 批的原因**：任何做「引擎覆盖度审计」的人扫一眼这两张表，都会看到 `tell: "told"` 与 `"tell","tells","told"`，**判定「已覆盖」**。而实际上这两条**永远不会执行**。

**建议登记为一条机制项**（与第 46 批登记的「D 层可抄率守门把 `contrast.wrong` 也算作教过的词」同类）：

> **`tell: "told"` 与 `"tell","tells","told"` 是死表项。** 表格写了名字，但内容侧没有对应素材，触发条件永不成立。**建议在后续批次把「词表项是否可达」加入引擎审计口径**——否则这一类死表项会持续掩盖内容缺口。

**（附：`told` 出现过的第 3 个非内容文件是 `src/data/bundledDictionary.ts`，6 处。该文件是 12,000 条词典数据；`tell` 词条本身**不完整**——我实测它的 `definition` 逐字是 **"n. a Swiss patriot who lived in the early 14th century and who was renowned for his skill as an archer; according to legend an Austrian governor compelled him to shoot an apple from his son's head with his crossbow…"**（这是 **William Tell** 那个人名，不是「告诉」的意思）；`tells` 与 `told` 词条**都不存在**。这是词典数据本身的独立问题，与课程无关，一并登记。）**

### 5.7 抓不到的源（明确声明）

| 源 | 结果 | 说明 |
|---|---|---|
| **British Council `Say and tell` 专页**（`/grammar/english-grammar-reference/say-and-tell` 与 `/say-tell-and-ask`、`/reporting-verbs`、`/verbs-with-two-objects` 三个 slug 变体） | **抓不到** | 4 次尝试全部 **HTTP 404**；且 `learnenglish.britishcouncil.org` 域名 curl 全部 **HTTP=000**（与既有记录一致）。**BC 侧拿到的是 `irregular-verbs` 与 `past-simple` 两页（WebFetch 可读），不含 say/tell 分工** |
| **Cambridge `say-or-tell` 的 WebFetch** | 抓不到（**HTTP 520**）；**但 curl 取到全文（HTTP 200，451KB）** | 内容已逐字引用（S1、5.2），**源可用** |
| **Murphy《English Grammar in Use》双册 / Swan《Practical English Usage》** | **不可得** | 沿用既有记录，**本轮未重试** |
| **`englishclub.com` 不规则动词页** | **HTTP 403** | 未取到 |
| **`hjenglish.com` / `eol.cn` / `qinxue100.com`** | 首页 HTTP=200 但零相关内容 | 沿用第 46 批同结论 |
| **`oxfordlearnersdictionarys.com`**（拼写变体） | HTTP=000 | 笔误域名，非有效源 |

### 5.8 位次结论

**`tell` / `told` 在英文教学里的位次：A1 最基础档，五源一致，且是本项目整个等级的起点。**

> **【明说】Cambridge 标 A1；OALD 标 A1 且列入 Oxford 3000；BC 的 `Irregular verbs` 与 `Past simple` 两页均标 beginner；中文侧 letmeenglish 归入「初级」、iciba 标「高中/CET4/CET6」。**

**与什么一起教（五源共同给出的搭配关系）：**

```
Cambridge 逐字："Say and tell are irregular verbs."         → 与 say 成对
Cambridge 不规则动词表：tell / told / told 紧邻 say / said / said、teach / taught / taught
OALD Which Word? 栏：say / tell 同栏对照
BC Past simple 页：tell → told 与 say → said、go → went 并列
letmeenglish：tell/told/told 与 teach/taught/taught、think/thought/thought 同在类型 2
中文侧 iciba：只给词形，无搭配
```

**与 `say` 的分工（最高教学价值的一条，见 5.2）：**

| 维度 | Cambridge 切法 | OALD 切法 |
|---|---|---|
| 核心区分 | `say` 关注**说的话**（the words someone said）／`tell` 关注**内容或信息**（the content or message） | `say` **不能带人**作宾语／`tell` **通常带人**，且常带两个宾语 |
| 必备结构 | `tell` 正常带间接宾语 + 直接宾语；`truth / a lie / a joke / a story` 时不带人 | `Tell + 人 + to-不定式` 表命令／指示，`say` 不这样用 |
| 典型错误 | **"Not: ‘Hello,’ she told."** ／ **"Not: … say a lie."** ／ **"Not: They said us to come …"** | **"NOT The doctor said me to stay in bed."** |

---

## ⑥ 自我核查记录

### 6.1 口径声明（**必读：这是本报告全部数字的判定标准**）

**词边界正则（node，非 grep）**：

```js
new RegExp(`(?<![A-Za-z-])${word}(?![A-Za-z-])`, "i")
```

> **为什么不用 grep**：任务书明确要求——本地 `grep` 是 ugrep，会假返回 0。**本批全部计数均通过 `vite-node` 直接 `import` 数据模块后逐字段判定，不用任何 shell 文本工具。**

**正侧口径 C1（严格）——排除两类**：

| 排除项 | 原因（任务书要求） |
|---|---|
| **① `guided[].answer`（当 `kind === "spot"`）** | 那里装的是 `wrongToken`——**是要用户点出的错词**，不是正确英文 |
| **② `contrast[].wrong`（当 `bothRight === true`）** | 那里装的是**正确句**——双正解卡的 `wrong` 字段名与内容相反 |

C1 收录**正侧**：`targetSentence` / `dialogueEn` / `dialogue[].en` / `examples[].en` / `variants[].en` / `sceneSwings[].en` / `blocks[].text` / `practice[].answer` / `recall.answer` / `contrast[].correct` / `contrast[].wrong`（仅 `bothRight`）/ `guided[].answer`（非 spot）/ `guided[].replaceBase`。

**其他三种口径（用于证明结论对口径不敏感）**：

| 口径 | 定义 |
|---|---|
| **C2（宽松）** | C1 ＋ 把 `contrast[].wrong`（全部）与 `guided[spot]` 的 `tokens` / `wrongToken` / `answer` 一并计入 |
| **C3（全字段）** | 递归遍历 `grammarLessons` + `huntCases` 的**所有字符串字段**（含中文、含讲解） |
| **C4（原始文本）** | 直接在 `src/data/*.ts` 的**源码文本**上用词边界正则匹配（含注释、id） |

### 6.2 命令

```bash
cd /Users/liujun/Documents/英语听写

# 全部核查脚本（只读，不写任何文件）
./node_modules/.bin/vite-node deliverables/product-strategy/working/told-audit-2026-09-23/s29-nail.ts
./node_modules/.bin/vite-node deliverables/product-strategy/working/told-audit-2026-09-23/s23-koujing.ts
./node_modules/.bin/vite-node deliverables/product-strategy/working/told-audit-2026-09-23/s22-criterion-test.ts
./node_modules/.bin/vite-node deliverables/product-strategy/working/told-audit-2026-09-23/s30-final2.ts

# 环境
node --version            # v24.14.0
./node_modules/.bin/vite-node --version   # vite-node/2.1.9 darwin-arm64 node-v24.14.0
```

**脚本清单（30 个，全部提交在 `working/told-audit-2026-09-23/`）**：

```
s01-tellfamily.ts      tell 家族权威计数 + 逐条落点（课 + 案件）
s02-context.ts         5 处 tell 所在课的完整上下文
s03-criterion.ts       找全部「教过去形态」的课
s04-maincharacter.ts   判据实测：45 个词对的「原形是否当过主角」
s05-render.ts          相关动词扫描 + dialogue 结构
s06-npcline.ts         5 课：npc 句是否会成为作答内容
s07-projectvocab.ts    项目自建词汇出现次数 + 三单目标句清单
s08-l25-l39-l203.ts    L25 / L39 / L203 全文
s09-series.ts          L195-204 系列 + 场景使用统计
s10-l38-l63.ts         全部含「告诉」的字段 + L38 全文
s11-sayfamily.ts       say 家族权威计数
s12-said-ctx.ts        L105 + say 家族案件
s13-shadow.ts          dialogueEn 与 dialogue[0] 的重复关系
s14-dict.ts            词典条目检查
s15-wears-cmp.ts       15 个词族的三形状对照
s16-gates.ts           关卡脚本里 tell 家族的全部落点
s17-gateanswer.ts      关卡「作答/判分」字段里的 tell
s18-zhgloss.ts         5 处 tell 的英文/中文对照 + zh 长度分布
s19-final.ts           最终口径三表
s20-dlayer.ts          D 层守门实测 + 未立课过去式盘点
s21-tellzh.ts          「告诉」中文提示的全部落点
s22-criterion-test.ts  判据在 47 个词对上的完整检验
s23-koujing.ts         四口径并列 + 全仓库扫描
s24-engine.ts          引擎词表可达性实测
s25-dump.ts            最终逐条 dump + L205 闸门检验
s26-last.ts            lose/break 正侧核对 + 关卡统计
s27-losebreak.ts       L23/L50 的 bothRight 卡全文
s29-nail.ts            最终数字锁定
s30-final2.ts          me 行 / 关卡占比 / 候选宿主课教学点
s31-verify-draft.ts    草稿文案零术语自查 + 关键数字复核
s32-vocab2.ts          项目自建词汇使用范围 + season-28 区间
s33-draft2.ts          草稿 V2/V3/V4 的零术语与星号守门
s34-finalcheck.ts      报告最终数字总复核
s35-says-diff.ts       says 落点逐条（tier 标注）
s36-diff.ts            says 20 vs 21 差异定位
s37-dc.ts              双重计数定位（口径 bug）
s38-doccheck.ts        交付文档结构校验
s39-sayside.ts         独立复核竞析的「say 侧零设防」主张
```

### 6.3 输出（关键表）

**表 1 · 四口径并列（证明结论对口径不敏感）**

```
form            C1严格正侧       C2宽松含错侧     C3全字段     C4原始文本
tell                 6             6         6          6
tells                0             0         0          0
told                 0             0         0          0
telling              0             0         0          0
say                  2             3        16         16
says                20            25        42         43
said                 1             1         6          6
wear                20            23        57         62
wears               41            54       114        118
wore                23            25        53         59
lose                 1             5        26         31
lost                56            67       116        125
```

**⇒ `told` / `tells` / `telling` 在四种口径下全部为 0。结论对口径完全免疫。**

**表 2 · `tell` 的 6 处落点（去重 5 句）**

```
tell: 落点 6 处 / 去重后 5 句
    "Can you tell me about your class?"  ← L41.dialogueEn + L41.dialogue[0].en
    "Tell me about last night."          ← L101.dialogue[0].en
    "Tell me about your week!"           ← L110.dialogue[0].en
    "Tell me about your family!"         ← L117.dialogue[0].en
    "Tell me about your cousin."         ← L185.dialogue[0].en
tells:   0 处 / 0 句
told:    0 处 / 0 句
telling: 0 处 / 0 句
```

**表 3 · 案件侧（213 案，递归全字段）**

```
tell     0 处
tells    0 处
told     0 处
telling  0 处
```

**表 4 · 全仓库扫描（`src/**/*.ts(x)`，375 个文件）**

```
tell:    命中 10 个文件, 共 52 处
           11  src/data/bundledDictionary.ts   ← 词典数据（William Tell 人名）
           10  src/data/echoGateScripts.ts
           10  src/data/libraryGateScripts.ts
            6  src/data/lighthouseGateScripts.ts
            6  src/data/mountainGateScripts.ts
            3  src/data/marketGateScripts.ts
            2  src/data/gateScripts.ts
            2  src/services/languageGateService.ts
            1  src/services/adventureService.ts
            1  src/services/grammarAmbushService.ts
tells:   命中 5 个文件, 共 10 处
            6  src/data/bundledDictionary.ts
            1  src/data/lighthouseGateScripts.ts
            1  src/data/mountainGateScripts.ts
            1  src/services/adventureService.ts
            1  src/services/grammarAmbushService.ts
told:    命中 3 个文件, 共 8 处
            6  src/data/bundledDictionary.ts
            1  src/services/grammarAmbushService.ts   ← 死表项
            1  src/services/languageGateService.ts    ← 死表项
telling: 命中 1 个文件, 共 5 处
            5  src/data/bundledDictionary.ts
```

**表 5 · 判据检验（47 个词对）**

```
C-严格（只看原形 targetSentence）  命中 33 / 反例 14
反例：say→said(1) see→saw(8) find→found(1) leave→left(46) make→made(32)
      get→got(159) hear→heard(1) meet→met(4) win→won(10) drink→drank(5)
      ring→rang(31) fall→fell(3) lose→lost(56) break→broke(27)
```

**表 6 · 引擎词表可达性**

```
① languageGateService.IRREGULAR_PAST 的 `tell: "told"`
   触发条件：某关 sampleAnswer / acceptRegex 含 told
   实测含 told 的关卡数 = 0 / 50 关        ⇒ 死代码

② grammarAmbushService.GRAMMAR_WORDS 的 `"tell","tells","told"`
   触发条件：某课 variants[].en 含 tell 家族
   实测含 tell 家族的 variant.en = 0 处     ⇒ 死代码
```

**表 7 · me 行 / npc 行**

```
me 行（用户角色台词）总数 = 204 句；含 tell 家族 = 0 句
npc 行总数 = 408 行；含 tell 家族 = 5 行
课程「要求用户作答」字段（guided.answer / practice.answer / recall.answer）含 tell 家族 = 0 处
```

**表 8 · 关卡侧**

```
echo        10 关，含 tell 4 关
station      8 关，含 tell 2 关
library     10 关，含 tell 5 关
lighthouse   6 关，含 tell 3 关
market       8 关，含 tell 1 关
mountain     8 关，含 tell 3 关
合计         50 关 / 含 tell 18 关 = 36.0%
＋ STORIES[].setup 17 处 ＋ misreadBranches.npcReply 2 处 = 37 处
关卡「作答 / 判分」字段含 tell 家族 = 0 条
```

**表 9 · 难度闸门（若立 L205）**

```
L204 target = "I gave her the book, and she gave me a big cake."   最长分句 = 12 词
闸门：相邻课最长分句不得跳 +5 词 ⇒ L205 上限 = 17 词
候选 "I told her the news, and she told me a story."  → 11 词 ✅
候选 "She told me a story last night."                →  7 词 ✅
⚠️ season-28 现为 min:182 max:204 ⇒ 新增 L205 必须把 max 改成 205（否则路径页静默过滤）
⚠️ 且 grammarSeasons.test.ts 断言「≤3 课的小季 ≤ 3 个」，当前恰好 3 个 ⇒ 若新增的
   season-29 是 2 课小季，该测试直接判红（这是批 46 已登记过的同一约束）
```

**表 10 · 草稿文案零术语 + 星号守门（实跑 `findZeroTermHits` / `isZeroTermClean`）**

```
零术语词表（29 个，逐字）：
  主语、谓语、宾语、表语、定语、状语、单数、复数、三单、原形、时态、
  一般过去时、一般现在时、现在进行时、过去进行时、现在完成时、
  情态动词、比较级、最高级、从句、语序、可数、疑问句、否定句、
  被动语态、第三人称、形容词、副词、介词

草稿 V2「两句都对，差在什么时候说的：says 是现在说的——她的话此刻转给你；
        told 是昨天说的——就是 says 的昨天版。同一个词，一个刚出口，一个已经说完了。」
  → isZeroTermClean = ✓ 干净    含 `**` = ✓ 无    长度 82 字

项目自建词汇使用情况（库内课数，证明草稿用词的合法性）：
  昨天版 41 课   现在 60 课   原样 98 课   他/她/它版 29 课
  告诉  11 课（⚠️ 已被「把信息直说」占用，草稿因此改用「同一个词」）
```

**表 12 · ⚠️ 本批自查中发现的一个口径 bug（我自己的脚本，已修正）**

我在写作过程中发现：**「正侧合计」有两种写法，会在某些词上差 1–2 处。**

```
写法甲（s15 风格）：guided[].answer 记一次 ＋ guided[].options[]（== answer）再记一次
                     ⇒ 同一个字符串被计 2 次
写法乙（s23 C1，正确）：guided[].answer 记一次；options 不单独计（answer 已覆盖）

实测差异（我自己的两个脚本互校时暴露）：
  says   双计 1 处  L38.guided[0] answer="She says"
  wears  双计 1 处  L39.guided[5] answer="wears"
  wore   双计 2 处  L203.guided[0] answer="wore" | L203.guided[5] answer="She wore a new hat."
  said   双计 0 处
```

**⇒ 本报告全部数字统一采用写法乙（C1）。** 例如 `says`：**写法甲得 21，写法乙得 20**；本报告用 **20**。`wears`：本报告用 **41**（4 课分落 L39×19 / L40×1 / L41×16 / L203×5）。

> **对结论无影响**：`told` / `tells` / `telling` 在**两种写法下都是 0**——因为它们的落点是 0，没有可被双计的对象。**但这个 bug 值得登记**：它是「口径差异会静默改变数字」的又一例（前有批 46 登记的 `contrast.wrong` 把错句算作「教过的词」、批 47 登记的 `wrongMark` null 有两种含义）。

**表 11 · 复核数字（与报告各处一致）**

```
dialogue 行    npc=408  me=204  合计=612（204 课 × 3 行）        ✓
dialogue[0].zh 长度分布  min=4 p25=9 median=10 p75=12 max=19   ✓
含「告诉」的课  11 课 / 共 11 处                                ✓
season-28       {"min":182,"max":204}                          ✓
小季（≤3 课）   3 个（测试上限 3，再加一个即红）                 ✓
```

**表 13 · 独立复核竞析的「`say` 侧零设防」主张（脚本 s39）**

```
① 全库「转述」课：只有 L38 一课
     L38 [话中话 · 转述别人的话] 「她说她会来」   targetSentence = "She says she will come."
     （全库扫 /转述/ 命中 title / grammarLabel / oneLineRule → 仅 L38）

② 全库「say + 人」错型设防 = 0 处
     （扫全部 contrast[].wrong / practice[].answer / distractors / guided[].tokens / options
       → 匹配 /\b(say|says|said)\s+(me|him|her|us|them|you)\b/i → 0 处）

③ 案件侧：say 家族的 2 处错词，都不是「say + 人」
     hunt-homework-note(n=29) "say"→"said"  tag=tense         「Yesterday 说的是昨天的事，动词要换昨天版：say → said。」
     hunt-team-message(n=47)  "say"→"says"  tag=sv_agreement  「句首那个「谁」 Lily 是「他/她」一个，动词加 -s：says。」

④ say 家族当主角（targetSentence）：say 0 课 / says 1 课（L38）/ said 0 课
⑤ tell 家族当主角（targetSentence）：tell 0 / tells 0 / told 0

⇒ 竞析的「say 侧零设防」主张 ✅ 成立：
   L38 是全库唯一转述课，用的是 says（`say` 不带人这一侧）；
   而 `say` + 人（*say me something）这个中文负迁移头号陷阱，全库零设防。
```

> **⚠️ 这条对「本批做什么」有直接影响**：`say` 已经**被教过**（L38 的主角），却没为它最容易错的那一面设防。**「教过却没设防」的风险高于「没教过的词的昨天版」**——所以我建议本批的实际动作是**给 L38 补 `say` 侧防错卡**（竞析已给方案），`told` 只做登记。

---

## ⑦ 不确定项

| # | 项 | 说明 | 影响 |
|---|---|---|---|
| **0** | **⚠️ 本批有一处「不做」与任务书倾向可能不同** | 任务书把 `told` 描述为「同一批的第二个洞」（承批 47 路线图第 5 节），措辞暗示倾向做。**我的结论是不做。** 这不是数据分歧，是**产品取舍**：批 47 登记 `told` 的理由是「正侧 0、原形从未当主角」，**与我实测一致**；差异在于**对「正侧 0」的处置**——路线图把它当缺口，我把它当**register 级空白的症状**。**两边的事实基础相同**，请以「是否愿意为『转述』这条 register 立项」为决策依据 | **决策级** |
| **0-b** | **✅ 与平行批次（竞析）的结论一致——这是一条独立佐证** | 与本报告**平行**的 `competitive-analysis-told-2026-09-23.md`（竞析，脚本 `.told-verify-48.mts` 等 8 个）**独立得出了相同的核心结论**：「**`told` —— 不处理（不立课、不挂靠、不改任何数据）**」。数字也复现一致：`told` 0/0、`tells` 0/0；`tell` 同样是「6（槽位）/ 5（去重后课数）」——**与我的 6 处 / 5 句完全吻合**。**两条独立路径（我的 register 视角 + 竞析的权威源视角）在同一结论上收口**，这显著提高了该结论的可信度 | 高 |
| **0-c** | **⚠️ 但竞析指出一个我未覆盖、且更紧急的项：`say` 侧** | 竞析实测：跨源一致把 `say`/`tell` 分工当**独立知识点**（Cambridge 逐字 **"Say never has a person as the object."**），而**我方全库只有 L38 一课触及转述、且用的是 `says`——`tell` 那一侧（人作宾语／双宾语）零教学**。中文负迁移的头号陷阱恰是 **`*say someone something`**。**⇒ 竞析主张本批优先项是「给 L38 补 `say` 侧的防错卡」，而不是给 `told` 立课。** 我**同意这个优先级**——它比 `told` 更紧急，因为 `say` 已经被教了（L38 是主角），**被教过却没设防**才是真风险 | 高 |
| **1** | `told` 的**最终处置**取决于「转述」这条 register 是否值得整体立项 | 我判「不值得为此单独开一课」，但**若产品决定做「转述」线**（`say` / `tell` / `ask` / `answer` 一起教），`told` 就是**必修的第一个词**——因为 Cambridge 与 OALD 都把 `say`/`tell` 成对讲，单独教一个不成立。**⚠️ 且按竞析的发现（⑦#0-c），这条线应当从「`say` 侧防错」切入，不是从 `told` 切入** | 中高 |
| **2** | 那 11 处「告诉」中文提示是否应该改 | 我判**不该改**（用户避开 `tell` 的人称宾语与 to-不定式是最优路径）。**但如果将来做 `told`，这 11 处会变成冲突源**——「告诉」已经被占用为「把信息直说」的提示语 | 中 |
| **3** | `She said` 被判错的那道题 | L38 `guided[0].options = ["She says","She say","She said"]`，`answer = "She says"`。**这是全库唯一一处 `said` 被点名判错**。我判它是**设计意图**（该课要考三单），**但用户选 `She said` 时 explain 只说「句首那个『谁』She 是他/她/它版，say 加 -s：She says」——没有解释「said 在别处是对的」**。这与批 47 登记的 L199 摩擦同类。**本批不确定它是否构成真实伤害** | 中低 |
| **4** | `space` 场景到 L204 仍为 0 次使用 | 若将来为 `told` 立课，场景选择会被这条约束影响。我判**不该用 space**（「告诉」与太空脱节），但**这条约束已连续多批登记，建议单独决策** | 低 |
| **5** | 关卡的 37 处 `tell` 是否构成**隐性教学** | 我判「不构成」（`tell` 不在任何判分字段里，且都是 NPC 台词）。**但我无法排除部分用户会注意到这 18 关的 `Tell me—…` 句式并留下印象**——**本批无法用数据判定这一点**（需要用户测试，超出本批范围） | 低 |
| **6** | 词典数据里 `tell` 词条的释义是 **William Tell 人名** | `bundledDictionary.ts` 中 `tell` 的第一条 definition 逐字为 **"n. a Swiss patriot who lived in the early 14th century…"**，**`tells` 与 `told` 词条都不存在**。这是**独立于课程的数据质量问题**，本批只登记，未深查（12,000 条词典的完整审计超出本批范围） | 低 |
| **7** | British Council 的 `Say and tell` 专页 **4 次 404 未取到** | BC 侧只拿到 `irregular-verbs` 与 `past-simple` 两页。**若 BC 有一页专门讲 say/tell 分工，我未能引用**——但我已用 Cambridge 的完整分工规则（5.2）覆盖这一块 | 低 |

---

*本报告只做研究，未修改任何代码或数据。全部 30 个核查脚本位于 `/Users/liujun/Documents/英语听写/deliverables/product-strategy/working/told-audit-2026-09-23/`，均可只用 `vite-node` 复跑。*
