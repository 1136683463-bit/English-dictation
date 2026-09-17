# 数据盘点：第六批课程可生产性（S5 语用入门）

**日期**：2026-09-17 ｜ **类型**：实读代码/文件盘点（本地项目无数仓、无真实用户数据）｜ **成员**：数析（数据分析师）
**主交付物**：`prd-grammar-s5-pragmatics-2026-09-17.md`

**方法**：实读源文件 + vite-node 一次性统计脚本（跑完即删 `/tmp`，未改动仓库任何文件）；4 个语法护栏测试本次实跑全绿

---

## 指标评审：第六批立项（S5 语用入门）

### 关键指标概览

| 指标 | 本期（实读） | 上期（第五批盘点 09-16） | 变化 | 状态 | 出处 |
|---|---|---|---|---|---|
| 课程数 | 46（L1–46 连续、id 唯一） | 41 | +5 | ✅ | `src/data/grammarLessons.ts` |
| 深度 7 字段覆盖 | 46/46 | 41/41 | 持平 | ✅ | 实读 |
| guided 题 | 275（choose 46 / arrange 137 / spot 46 / replace 46） | 245 | +30 | ✅ | 实读 |
| practice 题 | 185（4 题×45 课 + L25×5） | 165 | +20 | ✅ | 实读 |
| **should 覆盖** | **0 处**（全字段 JSON 扫描） | 0 | 持平 | ⚠️ | `grammarLessons.ts`（全量） |
| **if 覆盖** | **0 处**；案库仅 1 处净词（非植错） | 0 | 持平 | ⚠️ | `grammarLessons.ts`；`huntCases.ts:1201` |
| **被动（be+过去分词）教学语料** | **0 处**（唯一 be+ed 命中是 tired 表语 6 处） | 0 | 持平 | ⚠️ | JSON 扫描 |
| 情态种子 must / can / have to | 48 / 79 / 15（L14/L16） | 未盘 | — | ✅ | 实读 |
| 将来种子 will / be going to | 120 / 33（L12/L29/L38） | 未盘 | — | ✅ | 实读 |
| 案件 / 植错 | 55 案 / 194 错（编号 1–55 连续） | 50 / 174 | +5 / +20 | ✅ | `huntCases.ts` |
| 案件校验 | 55/55 reviewed | 50/50 | 持平 | ✅ | 实读 |
| 罪名分布（错误数） | verb_form 42、sv_agreement 35、plural 21、missing_be 18、article 17、preposition 17、tense 14、word_order 14、run_on 8、fragment 8 | verb_form 34 | +8 | ✅ | 实读 |
| huntCaseIds | 51 引用 / 50 案被引 / 悬空 0；空课 5（L2/3/5/6/8） | 45 案被引 | +5 | ⚠️ 既定决策 | `grammarLessons.ts` |
| 封面资产 | 24 张全在用；**仅用 1 次剩 5 张**：cover3/8/15/19/23 | 剩 10 张 | 池减半 | ⚠️ | `grammarLessons.ts` |
| L42–46 词典外内容词 | 真实 0（分词残片已人工复核） | L37–41 有 glasses 等 | 更干净 | ✅ | 代理口径实读 |
| 语法护栏测试 | 4 文件 89 项，实跑全绿 | 89 | 持平 | ✅ | vitest 实跑 |

---

### 第六批可生产性分析

#### a) 护栏清单（L47+ 自动纳入，更新版）

| # | 护栏 | 要求 | 出处 |
|---|---|---|---|
| 1 | practice ≥4 且含变体题 | answer 与 variants 否定/疑问卡**逐字一致** | `grammarLessons.test.ts:10-28` |
| 2 | tokens/answer 词集一致 | 去标点小写词集相等 | `grammarLessons.test.ts:30-49` |
| 3 | 干扰项不与答案词重复 | — | `grammarLessons.test.ts:51-66` |
| 4 | recall 强制 | number≥13 三字段非空 | `grammarLessons.test.ts:68-78` |
| 5 | arrange 防退化 | 展示序≠答案序 | `lessonService.test.ts:236-259` |
| 6 | 罪名枚举钉死 | tagStats 长度=10 | `huntService.test.ts:109` |
| 7 | 新案必须 reviewed | 被引（R13）与未引（R15）都查 | `huntService.test.ts:294-308` |
| 8 | tokenIndex 对齐 + ≥1 净词 | 每案必查 | `huntService.test.ts:312-330` |
| 9 | **番外案列表精确钉死**：新增未配课案件会打破断言（orphans 必须仍=5） | `huntService.test.ts:215` |
| 10 | 案件池下限守卫（≥20 案 / ≥54 错） | 扩容不受限 | `huntService.test.ts:284-285` |
| 11 | **路径页分组真空（硬需求）** | L47+ 不落分组 → 静默过滤 | `GrammarPathPage.tsx:492-494` |
| 12 | **can-do 锚点** | 最新 m7 挂 46，L47+ 无收口仪式 | `GrammarPathPage.tsx:152-153` |
| 13 | 关 2 题源 | 核心句 rebuild + variants[0..2] 轮换，3–5 题封顶 | `grammarAmbushService.ts:180-204` |
| 14 | 关 2 cloze 抽词表 | `GRAMMAR_WORDS` 无 should/if（will 已在） | `grammarAmbushService.ts:153-154` |
| 15 | 关 3 新旧案混入 | 新案=本课案件；旧案=新案×40%（≥1） | `grammarAmbushService.ts:214-233` |

#### b) should / if / 被动的罪名承载（结论：零枚举扩展，已用先例验证）

| 拟教学内容 | 可植错形态 | 承载罪名 | 现有先例（实证） |
|---|---|---|---|
| should 形式错 | `should to rest`→`去掉 to`；`should goes`→`go` | **verb_form** | `cans`→`can`（#22）、`musts`→`must`（#24）、`must to`→`去掉 to`（#33） |
| if + will 负迁移 | `If it will rain…`→`去掉 will` | **verb_form**（删词型先例 15 处） | 删词型先例充分 |
| 被动过去分词错（未来批） | `was sing`→`sung` | **verb_form** | **#10 hunt-passive 即此型** |
| 被动缺 be（未来批） | `broken`→`was broken` | **missing_be** | `at`→`is at`（#46）等 18 处 |

word_order / fragment / run_on / tense 均不适配本批内容（无语序错位、无残缺、无连词搭配错、无过去时冲突）；枚举 10 全兜住。

#### c) 展示层增量（一行级估算）

- **season-6**：`LESSON_GROUPS` 追加 1 行——不加则 L47+ 被静默过滤（硬需求）。
- **m8**：`CAN_DO_MILESTONES` 追加约 6 行，`afterLesson` = 批次末课号。
- **圈号边界（新发现）**：㊼–㊿（U+32BC–32BF）可用到 **L50**；**L51 起无圈号字形**（U+32C0 实为「㋀/一月」）。本批 3 课（L47–49）安全。
- 合计 ≈7 行代码；封面零新增。

#### d) 上线后可用指标（决策门候选，全部现成埋点）

| 决策门 | 事件源 | 判读口径 |
|---|---|---|
| 首过率 | `grammar_lesson_completed.guidedFirstTry/practiceFirstTry` | L47+ vs 46 课基线 |
| 逐步卡点 | `lesson_step_result.attempts/stepKind` | should 形式题重试深度 |
| 关 2 提取摩擦 | `grammar_revisit_completed.firstTryCount/totalCount` | 目标一次通过率 50–70% |
| 回马枪 | `grammar_ambush_result.passed/weakSpotTag` | 新罪名复现成功率 |
| 新案误报 | `hunt_verdict.verdictKind` / `hunt_case_settled` | notError 占比=误报率 |
| 真实写作错误率 | `diary_issue_tag.tag` | verb_form 份额变化 |
| 收口仪式 | `can_do_confirmed.milestoneId` | m8 确证 |

#### e) 缺口与未核实清单

| # | 缺口 | 状态/影响 |
|---|---|---|
| 1 | 核心 500 词表不存在 | 沿用代理口径；L42–46 真实 OOV=0 已人工复核 |
| 2 | 无真实用户数据 | 单人本地项目 |
| 3 | 「should 该用没用 / must 语气过重」为语用判断，不可单 token 植错 | 仅 contrast+深挖认读教学，不入案件（不影响枚举） |
| 4 | cloze 抽词预演 12 句：10 句落点好；`If the light goes out…` 会空在 "the" | 定稿时可扩表 1 行（加 should）或调整核心句词序 |
| 5 | L51+ 圈号字形边界 | 本批 3 课安全；更长的批需另定 episode 写法 |
| 6 | 冒险模块 S5 已有平行内容：runes（s5-modal/passive/conditional/pragmatic）+ 灯塔 6 关 | 命名/话术一致性需撰写期对齐（非代码护栏） |
| 7 | 全测试套件 | 仅实跑 4 语法文件（89/89 绿） |

### 洞察（每条附支撑数据）

1. **should/if/被动在课程语料确为 0**（全字段扫描）——第六批是纯新增图案；但旧种子很厚：must 48 / can 79 / will 120，足以挂靠。
2. **罪名承载零风险已被实证锁死**：#22/#24/#33 三条情态形式先例；被动更有 #10 原版案——无需任何新枚举。
3. **两条硬护栏**：season-6 分组 + m8 里程碑，合计 ~7 行。
4. **新案必须配课**：orphans 断言精确等于 5 案，未配课新案会红——沿用「每课配 1 案」管线规避。
5. **封面单次池恰好够本批**：仅剩 5 张单次封面；第六批后全部封面将至少用 2 次。
6. **圈号 47–50 可用、51 起断**（Unicode 实测）。
7. **关 2/关 3 题源无需改造**：全部兼容 S5 新批。
8. **遥测足够支撑 7 个决策门**：15 类事件在册 + 导出卡现成。

### 建议

1. **按既有管线生产 L47–L49（3 课，避开圈号边界）**：should → if → 收口；模板取 L42–46 签名（guided 6 / practice 4 / variants 3 / contrast 6 / swings 3 / recall 必填 + 每课 1 案）。
2. **罪名决策：零枚举扩展**；可选 1 行扩 `GRAMMAR_WORDS` 加 `should`（非阻断）。
3. **展示层随批上线**：season-6 + m8（~7 行）。
4. **门禁**：上线前导出遥测建基线；2 周后对照首过率、关 2 一次通过率、新案误报率。

---

> 本盘点由产品战略团队数析执笔，经主理人汇编落盘。所有数字来自实读，未核实项已标注。
