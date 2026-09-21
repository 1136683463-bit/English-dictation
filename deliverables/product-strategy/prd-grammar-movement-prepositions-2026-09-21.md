# PRD · 移动方向小词族（into / through / across）

- 日期：2026-09-21
- 批次：第三十八批
- 交付：L191 `She walked into the kitchen.`、L192 `We walked through the forest and across the bridge.`
- 前置：批三十七 L190（`learn to`）；本批同时裁定「旧错回流替代机制」

---

## 0. 一句话

把全库为零的**移动方向小词族**拆成两课补齐：先教 `into`（进到里面），再教 `through`（中间穿过去）与 `across`（一头到另一头）的对照——**不止是补词，更是补一个全库从未有过的区分**：教科书和中文对译都把这两个词翻成同一个「穿过」。

---

## 1. 问题：这个缺口为什么必须补

### 1.1 全库为零，且是同一「家族」的缺口

node 词边界正则全库验证（已排除连字符标识符假命中，见 §7）：

| 词 | 宽口径 | 真词口径 | 结论 |
|---|---|---|---|
| `through` | 0 | 0 | 全库零 |
| `around` | 0 | 0 | 全库零 |
| `into` | 0 | 0 | 全库零 |
| `across` | 0 | 0 | 全库零 |
| `along` | 0 | 0 | 全库零 |
| `past` | **3** | **0** | 3 处全是 `lesson-24-past-vs-perfect` 这类 `id` 字段的连字符假命中 |
| `toward(s)` | 0 | 0 | 全库零 |

而**静态位置小词已教全**：`in`（L18）、`on`（L18）、`at`（L18）、`next to`（L79）、`in front of / behind`（L80）、`between`（L81）、`under`、`near`。也就是说，这是一次典型的「**家族开了头、缺成员**」——位置全有、方向全无。

### 1.2 用户最早的判断依据：中文对译必然失效

竞析查到的最强单条中文侧证据（english.cool 原文）：**「through 和 across 都翻成『過』，但畫面不同」**。也就是说中文母语者无法靠翻译区分这两个词——这正是我们「场景 + 画面」教学的独门位置，也是教科书最容易含糊过去的地方。

瑞思独立发现的同向证据更尖锐：**剑桥双语词典把 `into` / `across` / `through` 的官方对译都写成「穿过」**，用户自查字典也查不出区别。

### 1.3 跨源位次：这是最早该教的一批

- Oxford 逐义项 CEFR：`into` / `across` / `through` / `around` = **A1**，`along` = A2。
- British Council：**三档 68 课无一门 `prepositions of movement` 专课**，只有 `in / on / at` 位置课（瑞思独立核到：BC 的 A1-A2 与 B1-B2 目录都没有移动方向课题）。
- 也就是说：**主流免费权威源普遍跳过这一族**。这不是我们找的漏洞，是真实空位。

---

## 2. 拆课裁定：2 课（拒绝 3 课方案）

两研究给出**不同**答案：

| 来源 | 方案 | 理由 |
|---|---|---|
| 瑞思 | 3 课（`into`／`across`+`through`／`along`+`around`） | 按「看什么」分三轴：终点 / 中间 / 路线形状 |
| 竞析 | 2 课（`into`／`through`+`across`），**明确拒绝 `along`、`around`** | 跨源无方向课配对；中文侧最细的源对 `along` 实测三段全零 |

**裁定：采纳竞析的 2 课，拒绝 `along` / `around`。** 理由（可复核，非主观）：

1. Cambridge 的页分别是 `Along or alongside?` 与 `Around or round?`——前者配的是 `alongside`（形近词对照），后者是英美变体对照，**都不是方向语义**。跨源没有把它们当「移动方向」教的位次。
2. `around` 另有高频「大约」义，一词两高频义会分心。
3. `along` 的含义是「位置 + 形状」混合，与我方 L79 `next to` 在中文里不可分。

**这是一次「拒绝低价值候选」的裁定**，登记 §6。

**对瑞思方案的一处修正**：瑞思建议 L192 场景用 `forest`，但 `forest` 刚被 L187 用过（距今 5 课）——改用 `city`（穿过城市、横过小桥，更贴合连续剧）。

---

## 3. 两课设计

| 课 | 词 | targetSentence | 词数 | scene |
|---|---|---|---|---|
| L191 | `into` | `She walked into the kitchen.` | 5 | mansion |
| L192 | `through` + `across` | `We walked through the forest and across the bridge.` | 9（最长分句 9） | city |

### 3.1 L191：`into` —— 比 `in` 多一层「动」

- **核心增量**：不是「新词」，是「**旧词的新一层**」。L18 的 `in the kitchen` 是「在厨房里」（人在里面、不说什么动作）；`into the kitchen` 是「走进厨房里」（从外面动到里面）。这是全库第一次把「位置」与「方向」并排给用户看。
- **对照卡 6 张（3 标记 + 3 双正解）**：
  1. `She walked in the kitchen.` ❌（`in` 缺「动进去」这层）
  2. `She walked into kitchen.` ❌（缺 `the`，接 L3 老规矩）
  3. `She into the kitchen.` ❌（`into` 自己不能当动作）
  4. `She is in the kitchen.`（L18 位置）
  5. `My hat is in the box.`（L18 老句子）
  6. `She walked to the kitchen.`（L9 `to` = 往那边去，与「进到里头」差一层）
- **负迁移**：`*I walked in the room.` 是中文母语者高频错法，而且**它本身是合法英文**（只是意思不同）——用户自查不出，只能靠对照卡教。

### 3.2 L192：`through` vs `across` —— 全库第一次教这个区分

- **核心增量**：**同一中文、两个画面**。`through` 是「四周包着、从中间钻过去」；`across` 是「平摊着、有两个头、从这头到那头」。
- **对照卡 6 张（3 标记 + 3 双正解）**：
  1. `We walked across the forest.` ❌（树林没有两个头）
  2. `We walked through the bridge.` ❌（桥没有「中间」可以钻）
  3. `We walked through forest and across bridge.` ❌（两个地方都缺 `the`）
  4. `We walked in the forest.`（L18 位置：人在里头）
  5. `We walked to the bridge.`（L9：走到桥那儿为止）
  6. `She walked across the street.`（同形对照：马路也是「两头」的平面）
- **教法**：给用户一句可自测的判据——「这地方是**四周包着、得从中间钻**，还是**平摊着、有两个头**？」

---

## 4. 结构指标（全部守门通过）

| 项 | L191 | L192 |
|---|---|---|
| 对照卡总数 | 6 | 6 |
| 其中带标记错句 | 3 | 3 |
| 其中双正解 | 3 | 3 |
| guided | 6 | 6 |
| practice | 5 | 5 |
| recall | ✓ | ✓ |
| huntCaseIds | 1 | 1 |
| scene 合法 | ✓ mansion | ✓ city |

- **难度闸门**：L190（6 词）→ L191（5 词）→ L192（9 词），逐级不跳超 5 词 ✓
- **零术语**：全字段遍历（`deepDive` 除外）0 命中；页面级实测 0 命中 ✓
- **无 markdown 星号**：0（第 5 次复发类缺陷，本次提前查）✓

---

## 5. 找错案件

| 编号 | id | 标题 | 4 处错（tag） |
|---|---|---|---|
| #200 | `hunt-walked-into` | 厨房门口的水果盘 | preposition（`in`→`into`）· article（`room.`→`the room.`）· plural（`student.`→`students.`，L7 回流）· tense（`eated`→`ate`，L10 回流） |
| #201 | `hunt-through-across` | 桥上回头喊 | preposition（`across`→`through`）· preposition（`through`→`across`）· verb_form（`（去掉 to）`，L12 回流）· sv_agreement（`is`→`are`，L13 回流） |

两案均为「2 新错 + 2 旧课回流」结构；`tokenIndex` 逐条对齐；tag 全在词表内；每案都有干净词块。

**旧错回流改用真实未用句**：#200 的 `They are student.`（L7 原句）与 `I eated an apple.`（L10 原句）取自 lesson 侧 contrast 中**从未被任何案件使用**的错句——见 §7 的裁定。

---

## 6. 本次「拒绝」清单（登记，防后续误做）

| 候选 | 裁定 | 理由 |
|---|---|---|
| `along` | **拒绝** | Cambridge 页配的是 `alongside`；中文侧最细源对它三段全零 |
| `around` | **拒绝** | Cambridge 页是英美变体对照；一词两高频义分心 |
| `past`（经过义） | **拒绝** | 全库 3 处 `past` 全是「过去」词形，教「经过」义会与 3 课既有同形干扰 |
| `cross` | **拒绝** | 是动词，属另一条轴（同批三十七拒绝 `decide`/`hope` 的类型） |
| `over` / `under` / `past` / `off` 捎带 | **拒绝** | 四者移动义全零，是独立的一条轴，不该搭车 |

---

## 7. 本批附带的重大裁定：旧错回流池并不枯竭

我在批三十四至三十七**连续 4 批**上报「旧错回流句快用完了」。本批做了权威核验，**结论推翻**：

用类型化探测（直接读 `grammarLessons` / `huntCases` 导出，非正则）得到：

| 池 | 数量 |
|---|---|
| hunt 侧 errored 句（去重） | 585 |
| lesson 侧 `contrast` 带 `wrongMark` 的真错句（总出现） | **634** |
| **其中从未被任何案件使用的** | **391** |
| 其中 L1-25 早课带 | **127** |

**根因**：我自加了「必须用零复用句」这条纪律，但它**不是契约**——`huntService.test.ts` 与 `huntService.ts` 里没有任何复用约束（唯一硬约束是 case id/number 唯一、`tokenIndex` 对齐、每案至少一个干净词）。

**裁定**：不需要新机制。改用「从 lesson 侧未使用的 391 句取料」即可，本批两案就是这么做的（`They are student.` / `I eated an apple.`）。该项**从携带项中移除**。

---

## 8. 方法学教训（登记）

1. **「ugrep 失效」是随词而变的**：瑞思实测 `under`/`walked` 能查对，`swim`/`room`/`want`/`pass` 假返回 0——比我们此前的结论更严重。**一律用 node 词边界正则**。
2. **连字符标识符会造成假命中**：`past` 宽口径 3 处、真词口径 0 处，那 3 处是 `lesson-24-past-vs-perfect` 这样的 `id` 字段。**查词频必须排除连字符**（`(?<![A-Za-z-])word(?![A-Za-z-])`）。
3. **重放题余量实测只剩 3 道**：用测试自己的判据（`zhSim ≥ 0.8` + 排除 variants）实测 **23 / 上限 26**。新批次每课的练习答案都极可能触碰上限——这是当前最紧的内容约束。瑞思把风险标为「可能阻塞」，核实成立。
4. **瑞思的引文与竞析的推断要分开对待**：竞析明确声明 §4 里 5 条负迁移推断中只有 2 条有源支撑，另 2 条（`*through the road`、`*enter into the room`）是纯推断、无源。这类自我声明应当被尊重，不能当下批 PRD 的「有源支撑」引用。
