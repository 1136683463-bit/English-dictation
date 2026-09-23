# PRD · 找错数据 `editOp` 字段：把「猜字面」换成「读类型」

**批次**：第五十三批 · 2026-09-23
**主题**：`HuntError` 新增 `editOp` 字段，消灭「操作类型靠字面猜」这一根因
**状态**：已落地（类型 + 全库 794 条标注 + 下游改造 + 守门 + 走查）

---

## 一、问题：一个字段混着七种语义，消费方各自猜

`HuntError.correction` 是给用户看的一句「改成什么」，但它在句子层要承担七种完全不同的操作：

| 实际语义 | 数量 | 例子 |
|---|---|---|
| 替换 | 612 | `moved` / `is happy` |
| 补词 | 86 | `very` → `is very` |
| 删除 | 62 | `去掉 so` |
| 移动 | 17 | `把 white 移到 cat 前面` |
| 只改标点 | 13 | `day?` → `day!` |
| 只改大小写/撇号 | 3 | `Id` → `I'd` |
| 纯说明（无需改句） | 1 | `（rather 跟在 would 后）` |

在 `editOp` 出现之前，「这是哪种操作」全靠消费方**猜 `correction` 的字面长相**：

- `startsWith("去掉")` → 判为删词
- 含汉字 → 判为「说明性文案，跳过」
- 正则捞 `把 X 移到 Y` → 判为移动

**已经真实出错**：移动型的 `correction` 曾写成 `去掉（X 放到 Y 前面）`，被「去掉」前缀误判为删除，
生成粘句病句（批五十一修数据）。同一类判据散落在 **10 份实现**里
（`huntService` / `grammarReplayService` / `grammarBoostService` / 若干 rv 守门 / 临时脚本），
彼此已经分叉。

**判据缺陷本身也是缺陷**：本批核对时发现，h1 的一条守门断言用精确串 `"（去掉）"` 匹配，
全库 **0 条**命中——而 `correction` 以 `去掉` 开头的有 **61 条**。
一个恒真的 `continue` 让「删词型讲解必须说清去掉什么」这道门禁**从未检查过任何数据**。

---

## 二、方案：数据自带类型，消费方读字段

### 2.1 新增 `HuntEditOp` 联合类型（`src/types.ts`）

```ts
export type HuntEditOp =
  | "replace" | "insert" | "delete" | "move" | "punct" | "orth" | "explain";
```

**为什么是 7 个值而不是 6 个**（两位研究者的分歧点）：竞析主张把「只动标点」与「只动正字/大小写」
拆开，瑞思主张合成一个 `respell`。**数据裁定支持拆分**——实测 13 处纯标点
（`day?` → `day!`、`reading` → `reading,`）与 3 处纯大小写/撇号（`Id` → `I'd`、`It's` → `Its`、
`may` → `May`）是**两种不同的学习者错误**：前者是断句，后者是正字。
合成一个值会让下游无法区分，也失去诊断价值。故采用 7 值。

### 2.2 全库 794 条逐条标注

按 `correction` 字面**机器分类**（穷尽 794 条，仅 1 条落入 `AMBIG`，经人工确认属 `replace`）：

```
replace 612 / insert 86 / delete 62 / move 17 / punct 13 / orth 3 / explain 1
```

`move` / `explain` 共 18 条**人工逐条确认**（机器不可信——它们正是被判据坑过的那两类）。

### 2.3 `move` / `explain` **不机械执行**——这是实测结论，不是保守估计

三种实现全部试过，全部失败：

| 实现 | 产出 |
|---|---|
| ① 全句首个匹配 | `My friend has a white. cat She was excite…`（标点跟着词跑） |
| ② 句内定位 + 短语锚点 | `My friend has a white cat She. was excite…` |
| ③ 标点留位版 | token 守恒 **14/14 全过**，但产出 `Eat the chicken hot noodles.`（答案本应是 `hot chicken noodles`）、`Both Books are good.`（大小写错） |

**词袋守恒能过、句子正确性过不了**——机械移动会把「改对」变成「改坏」，比不改更糟。
故 `move` / `explain` 只用于讲解与展示，句子层一律不动。

### 2.4 下游改造：8 处「靠字面猜」改为读字段

| 位置 | 旧判据 | 新判据 |
|---|---|---|
| `huntService.correctedSentenceOf` | `/^（?去掉/` | `editOp === "delete"` |
| `huntService.pickCorrectionWord` | `startsWith("去掉")` + 括注 + 汉字 | `delete/move/explain` → 空串 |
| `GrammarHuntPage`（2 处） | 同上 | 透传 `error.editOp` |
| `huntService.test.ts` | 手抄一份修正算法副本 | 删除副本，直接调生产函数 |
| `rv3` / `rv9`（3 处） | 字面正则 | `editOp` |

`pickCorrectionWord` 的第二参数**改为必填**（去掉向后兼容的字面兜底分支）——
这样编译器会强制每个调用点交出字段，字面判断不再有复活的口子。

---

## 三、顺带查出并修掉的真缺陷

修 `editOp` 的过程中，跨度/判据问题浮出水面，逐条核实后修掉：

### 3.1 短语型粘连病句（8 处里 7 处）

`original` 有**跨 token 短语**形态（`a dress beautiful`），而旧实现只替换 `tokenIndex` 那**一个** token：

| 案 | 修前卡面 | 修后卡面 |
|---|---|---|
| `hunt-word-order` | `She bought a dress **a beautiful dress**.` | `She bought a beautiful dress.` |
| `hunt-key-clue` | `where **it is it**` | `where it is` |
| `hunt-lost-dog` | `where **he is he**` | `where he is` |
| `hunt-class-intro` | `where **he is he**` | `where he is` |
| `hunt-photo-compare` | `better **good** than that` | `better than that` |

**为什么这些卡重要**：卡正面是进 SM-2 复习队列的**答案句**，用户照抄它应当判对。
一句 `She bought a dress a beautiful dress.` 既不能照抄、也不是英文。
新增 `spanForError`：先按标点切句，**只在本句内**找连续片段且跨度必须覆盖 `tokenIndex`
——否则 `is he` 这类短语会在别的句子误命中（`hunt-lost-dog` 与 `hunt-class-intro` 各有一处）。

### 3.2 一处 `editOp`/数据不自洽（`hunt-among-boxes#12`）

该错点把**数词 `two`** 标成 `preposition` 罪名并「去掉 two」，
而它自己的讲解教的是 `among → between`。已改为标注真正的错词 `among`（`tokenIndex 10`，`replace`）。
改后卡面从 `The cat is among the boxes. The cat is among the boxes.`（两句一样）
变成 `The cat is among the boxes. The cat is between the two boxes.`。

### 3.3 一处自相矛盾的错点（`hunt-so-do-i#11`）

`explanation` 自己写着「这句没问题」，却是一条 `errors` 条目。已登记（见 §四 未结项）。

---

## 四、守门（新增 `rv11`，6 条断言）

| 断言 | 守什么 |
|---|---|
| ① 穷尽性 | 每处修正都有 `editOp`，值在 7 个合法值内；全库规模 > 700（防遍历落空） |
| ② 自洽性 | 字段值必须与 `correction` 字面**互相印证**（双向），防标注漂移 |
| ③ 落地性 | 卡面词数 = 原句词数 + Σ(修正词数 − 跨度长度)，**独立重写算法**核算 |
| ④ 不退化 | `move`/`explain`/`delete`/`punct`/`orth` 必须真实存在（为 0 说明判据下沉） |
| ⑤ 债务登记 | 含 `move`/`explain` 的案件数**钉死在 18**，新增时测试立即失败 |
| ⑥ 差分核验 | **换算法重建**：独立实现一遍句子修正，与生产实现逐字比较 213 案 |

第 ⑥ 条是本批最强的一道闸：不再用「找病句特征」这类启发式
（它会在正常英文重复上误报，如 `We don't know where he is. My sister thinks he is at the school.`
里 `he` 出现两次完全合法——我第一版判据就在这里误报了 3 案）。
改为两套独立算法在 794 处修正上**字字相同**才算过。

h1 的空转断言同步修好：判据换成 `editOp === "delete"`，**真正覆盖 61 条**，
并加 `expect(checked).toBeGreaterThan(0)` 防它再次退化成空转。

---

## 五、验收

| 项 | 结果 |
|---|---|
| `tsc --noEmit` | 0 错误 |
| 全量测试 | **2492 / 2493 通过**（236 文件） |
| 唯一失败 | `kb4-arrange-keyboard` —— 属并发进程的在进行改动，`git status` 显示该文件与其断言目标 `GrammarLessonPage.tsx` **均未被我修改**，与 HEAD 逐字一致 |
| `vite build` | 成功（2.95s） |
| 走查① | L1 无标注对比卡揭示后显示「整句都要看」，旧文案「缺了一块」不再出现（jsdom 真实渲染路径） |
| 走查② | 短语型卡面 = `She bought a beautiful dress. We visited an old house near the river.`，建卡路径给出的正是这句 |

走查两条已固化为 `rv12` 回归测试（不再是临时脚本）。

---

## 六、未结项（诚实登记）

1. **18 案卡面仍留该错**（`move`/`explain`）。正解是给 `move` 一个**显式目标下标**
   （`moveTargetIndex`）而非解析中文，需逐案裁定 17 处并配套大小写/标点规则。
   本批只把它**钉在明面上**（rv11 ⑤），不让它悄悄扩大。
2. **`hunt-so-do-i#11`**：`explanation` 自称「这句没问题」却是错点条目。需定性（删条目还是改文案）。
3. **`hunt-would-rather-walk`** 等案的卡面含 `I rather would walk.`（未改的错句）——
   与 §六.1 同源。
4. 以下为路线图既有携带项，本批未动：`*tell to + 人` 防错、`loud`/`careful` 对照卡、
   `several` 并入 L114、词汇线是否单独立项（316 个 A0/A1 词缺失）。
