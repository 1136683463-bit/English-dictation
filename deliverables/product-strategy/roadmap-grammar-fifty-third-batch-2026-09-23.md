# 路线图 · 第五十三批（`editOp` 字段落地 + 短语型粘连病句修复）

- 日期：2026-09-23
- 交付：**`HuntError.editOp` 字段**（类型 + 全库 794 条标注 + 8 处下游改造）+ **短语型粘连病句 7 处** + **h1 空转断言修复** + **走查补做**
- 性质：**架构批（消根因）+ 修复批 + 走查补做**

---

## 1. 交付清单

| 文件 | 变更 |
|---|---|
| `src/types.ts` | 新增 `HuntEditOp` 联合类型（7 值）+ `HuntError.editOp` 字段 + 重写 `correction` 文档 |
| `src/data/huntCases.ts` | **794 条 `editOp` 逐条标注**；`hunt-among-boxes#12` 错点改正（数词误标为介词）|
| `src/services/huntService.ts` | 新增 `spanForError`（跨度定位）；`correctedSentenceOf` 改读 `editOp` + 跨 span 替换；`pickCorrectionWord` 第二参数改必填 |
| `src/pages/GrammarHuntPage.tsx` | 2 处调用点透传 `error.editOp` |
| `src/edge/h1-hunt-data-integrity.test.tsx` | 修好**从未生效**的删词讲解断言（空转 → 真正覆盖 61 条）|
| `src/edge/verify/rv11-hunt-editop.test.ts` | **新增**·6 条守门（穷尽/自洽/落地/不退化/债务登记/差分核验）|
| `src/edge/verify/rv12-hunt-card-front-walkthrough.test.tsx` | **新增**·走查固化为回归（jsdom 真实渲染）|
| `src/services/huntService.test.ts` / `rv3` / `rv9` | 删掉字面判据与手抄算法副本，改读 `editOp` |
| `deliverables/` | 本 PRD + 本路线图 |

---

## 2. 验证证据

| 项 | 结果 |
|---|---|
| **全量测试** | **2492 / 2493 通过**（236 文件）|
| 唯一失败 | `kb4-arrange-keyboard`——**非本批引入**：`git status` 显示该测试与其断言目标 `GrammarLessonPage.tsx` 均未被我修改，与 HEAD 逐字一致（属并发进程的在进行改动）|
| `tsc --noEmit` | **0 错误**（`pickCorrectionWord` 参数改必填后，编译器强制所有调用点交出字段）|
| `vite build` | ✓ 通过（2.95s）|
| `editOp` 分布 | replace 612 / insert 86 / delete 62 / move 17 / punct 13 / orth 3 / explain 1 = **794**（穷尽，无遗漏）|
| 短语型卡面粘连 | **7 / 8 修复**（余 1 处为 `insert` 语义，本就不该整段替换）|
| 尾标点被吞 | **7 → 0**（批五十三前半段）|
| 相邻重复 `As as soon as` | **2 → 0**（同上）|
| h1 删词讲解断言 | 覆盖 **0 → 61 条**（此前是空转）|
| **走查①**（jsdom 真实渲染）| L1 无标注对比卡揭示后显示「整句都要看」；旧文案「缺了一块」不再出现 ✓ |
| **走查②**（同上）| 卡面 = `She bought a beautiful dress. We visited an old house near the river.`；建卡路径给出的正是这句 ✓ |
| 差分核验（rv11 ⑥）| 独立重写的算法 vs 生产实现，213 案 / 794 处修正**逐字一致** |

---

## 3. 本批解决的根因

### 3.1 「操作类型靠字面猜」

`correction` 是**给人看的文案**，却被消费方当成**机器指令**解析。判据散落 10 份、已经分叉，
并真实产出过病句（移动型误判为删除）。本批把类型抽到数据层，消费方读字段。

**关键取舍**：`move` / `explain` **不机械执行**——三种实现实测全部失败
（最好的一种 token 守恒 14/14 全过，却产出 `Eat the chicken hot noodles.`，答案本应是 `hot chicken noodles`）。
这不是保守估计，是实验结论。

### 3.2 短语型 `original` 只被替换一个 token

8 处跨 token 短语，7 处生成粘连病句（`She bought a dress a beautiful dress.`）。
新增 `spanForError`：**句内**定位 + 跨度必须覆盖 `tokenIndex` + 整段替换。

### 3.3 「判据本身是空的」——这是最值得记住的一课

h1 那条断言用精确串 `"（去掉）"` 匹配，全库 **0 条**命中；而 `去掉` 开头有 61 条。
**一道门禁挂了 3 个月，从未检查过任何数据。** 本批修好并在断言内加
`expect(checked).toBeGreaterThan(0)`——**判据必须证明自己命中了数据**，否则又会退化成空转。

同源教训：我在本批自查时**连续 7 次判据出错**（把 `去掉 so,` 的说明文字当成句子内容、
把别的句子里的 `was` 当成未改、把正常的英文重复当成粘连……）。每一次都是
「从数据形态反推语义」而不是「按字段语义读数据」。这正是 `editOp` 要消灭的思维方式的镜像。

---

## 4. 未结项（诚实登记）

| # | 项 | 性质 | 建议 |
|---|---|---|---|
| 1 | **18 案卡面仍留该错**（`move`/`explain`）| 设计限制 | 正解是 `moveTargetIndex` 显式目标下标（不解析中文），需逐案裁定 17 处 + 大小写/标点规则。已由 rv11 ⑤ 钉死数字，不会悄悄扩大 |
| 2 | `hunt-so-do-i#11` 讲解自称「这句没问题」却是错点条目 | 数据缺陷 | 需定性：删条目 or 改文案 |
| 3 | `hunt-would-rather-walk` 卡面含 `I rather would walk.` | 同 #1 | 随 #1 一起解 |
| 4 | `*tell to + 人` 防错（与 `*say + 人` 配对）| 课程数据 | 路线图既有携带项 |
| 5 | `loud` / `careful` 对照卡 | 课程数据 | 已登记 9 批 |
| 6 | `several` 并入 L114 | 课程数据 | 路线图既有携带项 |
| 7 | 词汇线是否单独立项（316 个 A0/A1 词缺失）| **待产品负责人决定** | 需拍板 |

---

## 5. 「完成所有 B 档」的收口判据（延续上批结论）

连续 5 批「零新增缺口」，但**每批都查出既存缺陷**（本批又查出 3 类：跨度粘连、判据空转、自相矛盾错点）。
**在缺陷清零前宣告收口是不诚实的。** 本批的贡献是把三类缺陷里的两类清零，
并把第三类（18 案）从「不知道有多少」变成「钉死在 18，新增即报错」。

当前 B 档缺口审计：**连续 5 批零新增**；既存缺陷存量从「未知」收敛到 **可枚举的 3 项**（§4 的 1-3）。
