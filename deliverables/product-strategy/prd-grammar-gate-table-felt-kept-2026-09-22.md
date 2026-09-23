# PRD · 判定表扩容 + L200（`felt`/`kept`）

- 日期：2026-09-22
- 批次：第四十四批
- 交付：**`IRREGULAR_PAST` 判定表 17 → 49 项** + L200 `felt`/`kept` + `gave` 挂靠 L199 + 案 #209
- 性质：**口径更正 + 引擎修复**驱动

---

## 0. 一句话

两位研究在复核时**推翻了我两次的缺口判定**——根因是我把 `spot` 题的 `answer` 当成了正面用法，而它其实是**要用户点出来的错词**。更正口径后重查，发现 `slept` 确实是缺口（竞析上批的结论成立），并顺带查出**判定引擎的 `IRREGULAR_PAST` 表漏了 32 个课程已教过的换零件动词**。

---

## 1. 口径更正：`spot` 题的 `answer` 是错词（影响我此前所有判定）

### 1.1 事实

```ts
// src/edge/lessonFlow.ts:178-179
if (step.kind === "spot") {
  const target = step.wrongToken ?? step.answer;   // ← answer 与 wrongToken 同值，是「要用户点出的那个错块」
```

`spot` 题的题型是「有人是这样说的，你帮他看看：哪个词块不太对？」——它的 `answer` 就是那个**错块**。

### 1.2 我错在哪

此前我三次判定缺口时，都把 `guided[].answer` 一律当正面用法。因此在 L98 看到 `slept.` 就判「已有正面用法」——**实际那是 spot 题，是错词**。

**更正后的完整普查**（正确口径 = 排除 spot 题的 answer）：

| 原形 | 原形已教 | 过去式零出现 |
|---|---|---|
| keep | 48 | **kept** |
| give | 37 | **gave** |
| feel | 35 | **felt** |
| draw | 27 | **drew**（新发现）|
| tell | 6 | told |
| write | 1 | wrote |
| wear | 1 | wore |
| mean | 1 | meant |

`slept` 在正确口径下出现 **2 处**吗？——不。逐处定位后：**7 处全部在错侧**（含 L98 spot 题的答案）。**竞析上批「`slept` 是第 8 个缺口」的结论成立**，我两次的否定都错了。

---

## 2. 引擎修复：`IRREGULAR_PAST` 表 17 → 49 项

### 2.1 缺陷

`src/services/languageGateService.ts` 的 `IRREGULAR_PAST` 表用于判断「用户该用过去式却用了原形」。它原本只有 **17 项**，而课程里已经教过 **49 个**换零件动词。

**后果**：用户写 `keeped` / `swimmed` / `thinked` 时，引擎**识别不出这批动词**——那条判定对这些词完全失效。这影响的是**已经教出去的全部内容**，比缺一课严重。

### 2.2 修法

补齐 32 项（`swim/swam`、`sing/sang`、`sit/sat`、`catch/caught`、`think/thought`、`know/knew`、`keep/kept`、`feel/felt`、`draw/drew`、`break/broke`、`fall/fell`、`lose/lost`、`win/won`、`hear/heard`、`write/wrote`、`speak/spoke`、`stand/stood`、`hold/held`、`spend/spent`、`build/built`、`wear/wore`、`teach/taught`、`pay/paid`、`sell/sold`、`send/sent`、`ride/rode`、`drive/drove`、`fly/flew`、`grow/grew`、`begin/began`、`choose/chose`、`wake/woke`）。

**修后 49 项，28 项测试通过。**

---

## 3. 内容：L200 `felt` + `kept`

### 3.1 裁定：采纳竞析的 1 课方案，拒绝瑞思的 2 课

| 来源 | 方案 | 关键理由 |
|---|---|---|
| 瑞思 | **2 课**（`felt`+`kept` / `gave` 单独一课）| `give` 只有 1 个词、凑不出 2 点课 |
| 竞析 | **1 课**（`felt`+`kept`），`gave` **挂靠 L199** | `L63` 在 L197 之前——那时用户还没有「换零件」概念；而 L199 已在讲 `i→a`，`gave` 正好接上 |

**裁定：采纳竞析**。`gave` 挂 L199 的理由是**教学时序**：在 L63（讲「先给谁后给什么」的站位）插 `gived→gave` 会把该课重心从站位漂到形状；而 L199 已在讲 `i→a`，`gave` 是同一条线的第三个例子。

**已落地**：L199 加了一张指 L63 的双正解卡 + 一道 `Please give me the book.` 回流题（**位置在 L63，形状在 L199**）。

### 3.2 设计

- **targetSentence**：`I felt cold in the snow, but I kept reading.`（10 词，scene `snow`——间隔 19 课未用）
- **核心增量**：`feel` 和 `keep` 的换法**一模一样**——中间两个 e 只剩一个、尾巴加个 t
- **3 条带标记错句**：`feeled`/`keeped`（不加 -ed）· 前后不一致（`felt … keep`）· 缺 `the`
- **3 条双正解**：对照 L76 的 `I feel much better today.`（现在觉得，穿原样）、L198 的 `swam`/`sang`（同一家族）、L77 的 `I keep reading at night.`（习惯 vs 昨天一直）
- **案件 #209「窗边的最后一页」**：4 处错 = `feeled`→`felt` · `keeped`→`kept` · `He have`→`has`（L3 回流）· `They was`→`were`（L7 回流）

### 3.3 竞析的重要更正：L197 的「欠条」不存在

我上批写「L197 点名了 `gave`/`told`/`felt`/`kept` 说常在句子里碰到」——竞析核查后指出**那段文字在所有 git 对象、快照、dist 产物中都不存在**，现行 L197 只点名 6 个词且全有教学位。

**更正**：上批我引的是**自己改前的草稿文本**，不是库里的实际内容。本批已按实际情况重新表述。

---

## 4. 验证

| 项 | 结果 |
|---|---|
| **全量测试** | **2228 / 2228 全绿**（205 文件）|
| `tsc --noEmit` | 我的文件 **0 错误** |
| `vite build` | ✓ 通过（3.01s）|
| 独立核验 | **8 / 8** |
| 浏览器走查 | L200 首屏 ✓；路径页 `7 / 200 课` ✓；找错页 `3 / 209` + 第 28 季 19 案 + 案 209 解锁指向 ✓；零术语 0 命中、无星号 ✓ |
| `felt`/`kept` | 正确句字段 **0 → 24 处** |
| `IRREGULAR_PAST` | **17 → 49 项**（含 keep/feel/swim/think/sit/catch）|

---

## 5. 方法学教训（本批最重要）

1. **口径必须写进结论本身**，不能只说数字。本批三次普查得到 6 / 8 / 不同的数字，差异**全部来自口径**（正确句 / 含错侧 / 是否排除 spot 答案）。
2. **结构性事实要读判题代码，不能从数据形态反推**。我三次误判都源于「看到 `guided.answer` 就以为是正面槽」——而 `spot` 题的语义**只能从 `lessonFlow.ts:178` 读出来**。
3. **两位研究的分歧要先核实事实，再比方案**。本批瑞思与竞析对 `slept` 的判断相反，核实后发现是竞析对（它有代码证据 + 题型语义），瑞思的「slept 有 2 处」是误读。
4. **引擎层的缺口比内容缺口更该优先**——判定表漏 32 个词，影响的是**全部已教内容**的判定准确性。
