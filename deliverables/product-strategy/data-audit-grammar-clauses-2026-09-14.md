# 数据盘点：第四批课程可生产性

**日期**：2026-09-14 ｜ **类型**：实读代码/文件盘点（本地项目无数仓，无真实用户数据）｜ **成员**：数析（数据分析师）
**主交付物**：`prd-grammar-clauses-2026-09-14.md`

**仓库**：`/Users/liujun/Documents/英语听写` ｜ **方法**：实读源文件 + vite-node 一次性统计脚本（跑完即删，未改动仓库）

---

## 指标评审：第四批课程可生产性（2026-09-14）

### 关键指标概览

| 指标 | 本期 | 上期* | 变化 | 状态 | 来源 |
|---|---|---|---|---|---|
| 课程数 | 34（L1–34 连续） | 24 | +10 | ✅ | `src/data/grammarLessons.ts:43-6259` |
| 深度 7 字段覆盖 | 34/34 全量（dialogue/contrast/variants/sceneSwings/deepDive/summary/recall） | 24/24 | 持平 | ✅ | 字段定义 `src/types.ts:590-604`；实读 |
| guided 题 | 203（choose 34 / arrange 101 / spot 34 / replace 34）；每课 5–6 题 | 99 | +104 | ✅ | 实读 |
| practice 题 | 137（33 课×4 + L25×5；distractors 137/137，共 161 个） | 96 | +41 | ✅ | 实读 |
| huntCaseIds 空课 | 5 课：L2/3/5/6/8 | 5 课 | 持平 | ⚠️ 既定决策（`huntCases.ts:24-27`） | `grammarLessons.ts:396,578,941,1123,1486` |
| 侦探案 / 植错 | 43 案 / 146 错（均值 3.40/案，范围 2–6） | 33 / 106 | +10 / +40 | ✅ | `src/data/huntCases.ts:29-1779` |
| 案件人工校验 | 43/43 reviewed=true | 15/33 | +28 | ✅ | `src/services/huntService.test.ts:294-309` |
| 封面资产 | 24 文件；34 课全配；10 对复用（20 课共享，14 课独占） | 24 课全配 | 新增 10 课入复用池 | ⚠️ 新增内容依赖复用策略 | `src/assets/lessons/`；`grammarLessons.ts:2-25,4423-6084` |
| 遥测事件 | 16 种；容量 3000 条+归档 12000 条 | 11 种 | +5 | ✅ | `src/services/grammarTelemetry.ts:20-214,14-18` |
| 相关测试 | 3 文件 76 项全绿（本次实跑 vitest） | — | — | ✅ | `grammarLessons.test.ts` / `lessonService.test.ts` / `huntService.test.ts` |

*上期=《data-audit-grammar-2026-09-13》快照（24 课 / 33 案 / 106 错）。

**罪名分布核实**（逐条实读）：verb_form 33 / sv_agreement 25 / article 17 / plural 16 / tense 14 / missing_be 10 / word_order 9 / preposition 9 / run_on 8 / fragment 5，合计 146。另：`comparison` 枚举存在于 `types.ts:419` 但**全库 0 使用**。

**单 token 可修统计**：114/146 为单词→单词替换（78.1%）；加 12 处删词（`correction=去掉…`）+ 17 处单点扩写（原文单 token、改正多词，如 hunt-question-words `lost→did you lose`）= **143/146（97.9%）可在单 tokenIndex 承载**；仅 3 处原文多词（hunt-word-order ×2、hunt-photo-compare `more good`）。**案级 41/43 全部错误单点可定位**。

**关联覆盖**：38/43 案被课引用；5 个番外案（hunt-white-cat/sports-day/pen-pal-letter/fridge-note/term-review，`huntCases.ts:508-720`）未被任何课引用，按 `huntService.ts:79-99` 完成第 12 课后整体解锁；被引用案无悬空。**5 课无案**（L2/3/5/6/8）为「番外定位」既定决策。

### 第四批可生产性分析

#### a) 新增 4–6 课将触碰的护栏清单

| # | 护栏 | 具体要求 | 证据 | 对 L35+ 的影响 |
|---|---|---|---|---|
| 1 | practice 下限与变体题 | 每课 ≥4 题，且至少 1 题 answer 与 variants 否定/疑问卡的 en **逐字一致** | `grammarLessons.test.ts:10-28` | 文案必须先写 variants 再写题 |
| 2 | tokens/answer 一致 | 练习 tokens 去标点小写后词集=answer；干扰项不得与答案词重复 | `grammarLessons.test.ts:30-49,51-66` | 每课逐题自查 |
| 3 | recall 强制 | number≥13 的课 recall 三字段（answer/promptZh/intentZh）非空 | `grammarLessons.test.ts:68-78` | L35+ 自动纳入，不可省 |
| 4 | 防退化打乱 | arrange/practice 中 >2 词的题，展示序必须≠答案序 | `lessonService.test.ts:236-260` | 自动满足（题目词重复导致 shuffle 等价是唯一风险） |
| 5 | 罪名枚举 | 案件 tag 必须 ∈ 现有 10 枚举；`GRAMMAR_ERROR_TAGS` 唯一词表 | `huntService.ts:331-342` | 从句新错不得用枚举外 tag |
| 6 | 案件结构 | tokenIndex 与 token 文本对齐；每案留 ≥1 净词；reviewed=true | `huntService.test.ts:312-330,294-309` | 新案逐案人工校验 |
| 7 | 罪名面板钉死 | `tagStats` 长度断言 = 10 | `huntService.test.ts:109` | 若加新枚举需同步改测试 |
| 8 | 封面 | cover 可缺省（回退 scene SVG）；新增需静态 import 行 | `GrammarPathPage.tsx:371-375`；`grammarLessons.ts:2-25` | 复用池内重排（先例 10 对）或补新图 |
| 9 | 路径页分组 | L35+ 自动落入 season-3（min 25 / max 999） | `GrammarPathPage.tsx:239-244` | **无需改代码即可展示**，但分组标题/hint 失真 |
| 10 | can-do 里程碑 | m5 afterLesson=34（「巩固篇全通关」），之后无锚点 | `GrammarPathPage.tsx:108-144` | 新批需加 m6，否则 34 后无收口仪式 |
| 11 | 关 2 回访问卷 | 题源=targetSentence(rebuild)+variants 三态 cloze/rebuild，共 3–5 题 | `grammarAmbushService.ts:189-214` | 新课文案缺 variants 则问卷缩水 |
| 12 | 关 3 重审/回马枪 | 关 3 新案来自本课 huntCaseIds；无案时只剩旧案；回马枪降级取「最近 3 个有案的课」 | `grammarAmbushService.ts:193-231,52-68` | 新批不带案会稀释题源新鲜度 |

#### b) 从句错误的罪名承载建议

| 候选 tag | 适配度 | 依据 |
|---|---|---|
| **word_order（推荐）** | 高，需**泛化文案** | 已有「删除型/整块调整」先例：hunt-imperative-signs（L32）`You→去掉 You`、hunt-white-cat `white→去掉（white 放到 cat 前面）`；从句语序错（where is he→where he is）单 token 可承载。**风险**：PLAIN/LABEL 现为「形容词要放在名词前面」（`huntService.ts:31-43,118-130`），周报/弱点按 tag 聚合（`grammarTelemetry.ts:295-314`）会把形容词语序与从句语序混算 |
| fragment（推荐） | 高 | 承载半句/缺关系词结构；PLAIN「每个句子必须有主语和动词」语义兼容 |
| missing_be（可用） | 中高 | 从句缺 be/动词（I think he a teacher）；hint 已是「少了一个动词」（`huntService.ts:121`） |
| run_on（不适配） | 低 | 语义锁死 because/so 不能连用（`huntService.ts:38`） |
| verb_form（不适配） | 低 | PLAIN 锁死「被动要用 be+过去分词」（`huntService.ts:40`） |
| 新增枚举（不建议 v1） | 代价大 | 需改 `types.ts:408-419` + 3 个 `Record<GrammarErrorTag,string>` 全量 map + `GRAMMAR_ERROR_TAGS` + tagStats 测试 10→11，约 6 文件；且现有 10 罪名语义均能挂靠 |

**结论**：v1 零枚举扩展，word_order（同步把 PLAIN/hint 泛化为「修饰/从句成分的位置」）+ fragment + missing_be 三件套承载从句错误；每案 3–4 错、单 token 可修、混入 30–50% 旧罪名（沿用第二批口径）。

#### c) 上线后可用指标（决策门候选）

| 决策门 | 事件源（字段） | 判读口径 |
|---|---|---|
| 首过率对照 | `grammar_lesson_completed.guidedFirstTry / practiceFirstTry` | L35–41 vs L25–34 基线偏移（内容难度诊断） |
| 提取摩擦 | `grammar_revisit_completed.firstTryCount/totalCount` | 目标一次通过率 50–70%（`grammarTelemetry.ts:45-56`） |
| 回访时效 | `grammar_revisit_started.hoursSinceStage1` | 20–28h 有效窗占比 |
| 六段时长预算 | `section_dwell.dwellMs`（按 section 聚合） | 对照「6–10 分钟/课」承诺 |
| 逐步通过率 | `lesson_step_result.attempts/passed`（section/stepKind） | 定位具体题型卡点 |
| hunt 误报/错认 | `hunt_verdict.verdictKind/guessedTag` | 仅当新批配新案时可判 |
| 回马枪 | `grammar_ambush_result.passed`（weakSpotTag 非空） | 弱点复现成功率 |
| 错题复发 | `grammar_review_result`（sourceId=lesson:*/hunt:*） | 新知识点固化程度 |

以上 8 项均已有埋点与聚合函数（`summarizeGrammarTelemetry`，`grammarTelemetry.ts:394-476`），上线即可读。

#### d) 缺口与未核实清单

| 缺口 | 状态 | 影响 |
|---|---|---|
| **核心 500 词表资产不存在** | 仓库无词表文件，仅头注释与 PRD 约定（`GRAMMAR_PEDAGOGY_REVIEW.md:90` D4 决策） | 「超纲词」无法机检，本盘点改用代理：bundledDictionary（12000 词，缺屈折）+ 功能词白名单。结果：**19/34 课 0 个词典外内容词、31/34 ≤3**；>3 的 3 课经逐词核对均为课内教学形，非失控。**结论不可精确复现，标未核实** |
| 课/案无 difficulty 字段 | 类型层无此字段 | 无法程序化难度闸门，只能靠「旧错混入比」人工控 |
| 无 D1/D7 留存事件 | 需从事件 ts 离线推导；`grammar_revisit_started` 可部分替代 | 决策门 2–4 需脚本二次加工 |
| 无 courseId/分册结构 | 唯一分组=课号区间（season-3 max=999 为占位） | 大批量扩课需新增分组 |
| 逐词终审未做 | 本盘点为脚本代理统计 | 上线前仍需按词表人工终审单 |

### 洞察（每条附支撑数据）

1. **数据面已就绪，"纯加数据"可行**：7 深度字段 34/34 全量、guided 203/practice 137、43 案 146 错全 reviewed、76 项测试全绿——第四批无需 schema 迁移，护栏全部是"满足型"（写作时对齐）而非"改造型"（改代码）。
2. **最可能返工的护栏是 #1 与 #3**：practice 变体题必须与 variants **逐字一致**（`grammarLessons.test.ts:22`），加上 recall 三字段强制（:68-78）——这两条卡在"文案先定稿"的顺序上，先写题后补 variants 必挂测试。
3. **从句错误无需新罪名**：97.9% 单点承载率 + word_order 删除型先例证明可行；但 word_order 文案与聚合会与形容词语序混算（周报 tag 无细分维度），泛化文案是低成本正解。
4. **路径页零改动即可上线**：L35+ 自动落入 season-3（max 999）；但 can-do 里程碑 m5 挂在 34（`GrammarPathPage.tsx:108-144`），不改则新批无收口仪式、分组标题失真——属"1 行级"增量而非阻断项。
5. **封面与案件是仅有的资产型依赖**：24 张图 10 对复用先例支持继续重排；若新批不配 huntCaseIds，关 3 只剩旧案、回马枪降级池固定为"最近 3 个有案课"（`grammarAmbushService.ts:52-68`），新内容与破案/回访闭环会脱钩。

### 建议

1. **按既有生产管线追加 L35–L41**：沿用 `scripts/produce_second_batch.py` 的"数组尾插"模式（第二批 L21–24 + 5 案已验证）。
2. **罪名决策**：v1 零枚举扩展；word_order 承载从句语序（同步泛化 `huntService.ts:31-43,118-130` 文案）、fragment 承载半句、missing_be 承载缺动词；每案 4 错全单 token、旧罪名混入 50%。
3. **两处展示层增量**（合计 ≤0.5 人日）：season-3 max 改 34 并新增 season-4（min 35/max 999）；can-do 增 m6 锚点。（注：本项在 PRD 中列为 Non-goal「本批不新增里程碑」，由路径路线图决定是否随批上线——现状"零改动可上线"仍成立。）
4. **门禁与基线**：上线前导出遥测 JSON 建基线（`buildGrammarTelemetryExport`）；上线 2 周看 L35+ 的 guided/practice 首过率相对 L25–34 偏移（内容诊断，单人自用样本小，不做显著性推断）。
5. **补 500 词表入库**：哪怕一份 300–500 词 txt，即可把"超纲检查"从代理抽查升级为可重复脚本，消除本清单最大的未核实项。

---

> 本盘点由产品战略团队数析执笔，经主理人汇编落盘。所有数字来自实读，未核实项已标注。
