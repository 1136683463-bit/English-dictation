# 语法板块代码与数据资产盘点

**日期**：2026-09-13
**类型**：数据盘点（本地项目无数仓，实读代码/文件）
**参与成员**：数析（数据分析师）

---

## 📌 TL;DR（执行摘要）

- 内容资产厚实：24 课全字段 / 33 案 106 处植错 / 日记 36 题 100% 带脚手架；但 18/33 案未人工校验已配课上线。
- 三处关键数据断点：核心句入队半死代码（存量课无防遗忘）、hunt→复习不通、复习失败回溯弱点仅 diary 来源有效。
- 北极星"每周有效输出句数"未实现（无汇总函数），漏斗第一环"进入语法页"无埋点。
- 掌握口径与产品哲学矛盾：cloze 四选一连续 4 次满分 vs 文档要求"输出连续 2 次通过"。

---

## 🎯 核心结论卡片

| 项目 | 内容 |
|------|------|
| 推荐方案 | P0 先接通核心句入队+路径页埋点（合计 1.5 人日），P1 对齐掌握口径，P2 补内容校验与周聚合 |
| 优先级 | P0 |
| 预期影响 | 指标体系从"部分可算"升级为"北极星可计算"；复习覆盖全部错源 |
| 资源需求 | 已折算进主 PRD R04/R05/R09/R13/R14 |
| 风险等级 | 中（R09 触碰 reviewService 共享调度） |

---

## 指标评审：语法板块代码与数据资产盘点（数析全文）

### 1. 内容资产盘点

| 资产 | 数量（实测） | 完整度 | 证据 | 与目标差距 |
|---|---|---|---|---|
| 课程 | **24 课**（lesson-01 ~ lesson-24，含第二季进阶 13-24） | 24/24 课全字段（dialogue/contrast/variants/sceneSwings/deepDive/summary/recall/guided/practice/examples/huntCaseIds 均 24 处） | `src/data/grammarLessons.ts:45-3300`；字段计数 grep `^    <field>` 各得 24 | 超 V1 目标（12 知识点）；已达「首批 12」的 200% |
| guided 题（第②段） | **99 题**：22 课 × 4 题 + L13=5 + L14=6；kind 分布 arrange 51 / choose 24 / spot 24（每课恰好 1 choose + 1 spot + arrange 补齐） | 全课覆盖 | awk 按课切分统计；`grammarLessons.ts` kind 计数 | — |
| practice 题（第③段） | **96 题**（24 课 × 4 题/课） | 全课 4 题；测试强制「≥4 且含否定/疑问变体题」 | `src/data/grammarLessons.test.ts:10` | 单课 practice 仅 4 题，但加 guided 4 + recall 1 + output 1-2 ≈ **单课 9-11 题，全池约 240 题（估算）**；题量结构偏「课内流程」而非「每知识点 12 题题库」 |
| 找错案件 | **33 案件** | 每案错误数：2 错×6 案、3 错×8 案、4 错×19 案；**无 difficulty / plainExplanation / decoys 字段**；reviewed: true 仅 **15/33** | `src/data/huntCases.ts:24-1302`；类型定义 `src/types.ts:399-410` | **人话版 plainExplanation 不存在**——但 `huntService.ts:27 GRAMMAR_ERROR_TAG_PLAIN` 提供按 tag 的人话标签（tag 级而非案件级）；18 案未人工校验 |
| 案件 errorTag 分布 | 106 处植错：verb_form 25 / plural 16 / tense 14 / article 11 / sv_agreement 10 / preposition 9 / run_on 7 / missing_be 5 / fragment 5 / word_order 4 | 10 类全覆盖 | grep `tag: "..."` 计数 | 分布符合「中式高频错误」设计；verb_form 偏重、word_order 偏少 |
| 课程↔案件解锁 | 24 课中 **5 课 huntCaseIds 为空**（析客复核修正，初判 8 课），其余配 1-3 案；33 案全部被引用（无孤儿案） | grep `huntCaseIds: [...]` 24 行 | 5 课学完无破案挑战，剧情闭环断 |
| 日记题库 | **36 题，36/36 带 hint 句型脚手架（100%）** | 分布：今天 10 / 昨天 8 / 明天与打算 6 / 喜欢与拥有 7 / 小调查 5 | `src/data/diaryQuestions.ts:14-60` | 目标「今天/昨天/明天/感受/观察/想要/如果」七类——**实际只有 5 类分桶，「观察、如果（假设）」类缺失** |
| 词汇 500 词内 | 未核实（无词表校验工具/测试）；huntCases 用 notes 放生词提示 | 头注释 | 未核实 |

### 2. 埋点覆盖度（grammarTelemetry.ts）

已埋 **11 种事件**（`grammarTelemetry.ts:137-148`）：

| kind | 负载关键字段 | 挂点位置 |
|---|---|---|
| grammar_lesson_started | lessonId | GrammarLessonPage.tsx:375 |
| grammar_lesson_completed | lessonId/guidedFirstTry/practiceFirstTry/durationMs | 同 :424 |
| lesson_step_result | section/stepKind/stepIndex/attempts/passed | 六段全覆盖：pretest(:503) guided(:617,715,721) practice(:632,768) output(:813,837) recall(:860,876) watch/contrast(:1316) |
| deep_dive_expanded | lessonId | :1402 |
| section_dwell | lessonId/section/dwellMs | :424 附近（≥1s 过滤） |
| hunt_verdict | caseId/tokenIndex/verdictKind/guessedTag | GrammarHuntPage.tsx:152 |
| hunt_case_settled | found/total/misses/stars/durationMs/solved | :132 |
| hunt_hint_used | caseId/tag/tokenIndex | :118 |
| diary_issue_tag | entryId/issueIndex/tag | GrammarDiaryPage.tsx:148 |
| grammar_review_result | cardId/mode/attempts/passed/sourceId | GrammarReviewPage.tsx:65 |
| can_do_confirmed | milestoneId | GrammarPathPage.tsx:211 |

存储：主键 3000 条（MAX_EVENTS，`grammarTelemetry.ts:15`），溢出滚入归档键 12000 条（:18），≥80% 触发 nearCapacity 提示（:252-263），导出含归档（:268-283）。

**指标可算性对照**：

✅ **有埋点可算**：知识点首次通过率（guidedFirstTry/practiceFirstTry + lesson_step_result.attempts）、错误后立即重试率（attempts>1 且 passed）、误报率（huntFalsePositiveRate，:352）、破案率（huntSettled）、段级停留 vs 六段预算（sectionDwell）、复习通过率/复发率（grammar_review_result）、卡壳点（hunt_hint_used）、深挖卡消化率、日记错因分布（diaryTagCounts）。

❌ **缺埋点不可算**：
1. **漏斗第一环「进入语法页」**：GrammarPathPage.tsx 无任何页面进入埋点——漏斗只能算「进课→完课」，算不了「进页→进课」流失。
2. **北极星「每周有效输出句数 = 输出句数 × 无提示首次通过率」**：输出句数可近似（lesson_step_result section=output + diary entry），但「无提示」细分靠 stepKind free_type vs free_type_hint 区分（:813），事件里没有「输出句数」的直接汇总；日记输出句数无埋点（diary 只埋 issue_tag，没埋 entry_created）——分子可拼、分母口径需定义，当前 summarize 未实现该指标。
3. **次日复习/加入日常**：无 D1/D7 回访事件、无会话日维度聚合函数（事件有 ts，可离线算，但 summarize 没做）。
4. **主动重玩率**：无 lesson_replayed / hunt_replay 事件（hunt_case_settled 无「是否重玩」标记）。
5. **重复错误率周环比**：原始事件够（diary_issue_tag + hunt_verdict 有 ts），但**无周聚合函数**。
6. **批改准确率 >90%**：日记批改走 AI（`diaryService.ts:199 requestDiaryCorrection` 需配置 AI provider），无人工抽检/确认埋点——不可算。
7. **题目重复率 <5%**：无出题去重记录。

### 3. 数据流互通现状

| 来源 | 去向 | 通/不通 | 证据 |
|---|---|---|---|
| 课程核心句 | SM-2 复习队列 | **半通**：`addLessonCoreSentence`（lessonService.ts:66）仅经 `markLessonDone`（lessonService.ts:59）触达，后者全项目仅 `GrammarLessonPage.tsx:914` 一处调用——"去挑战"路径与存量已完成课均未覆盖（析客复核修正：非纯死代码，是覆盖不全） | grep -rn |
| 课程错题（pretest/guided/practice/output/recall 失败句） | 复习队列（tag "语法"，sourceId=lesson:id） | ✅ 通：`addLessonMistakeSentence` 在 GrammarLessonPage.tsx:529/545/839/878 四段挂点 | 入队后走主 SM-2 |
| 找错 verdict（wrongTag/notError） | 弱点档案 | ✅ 通：weakSpotsService.ts:76-86，权重 1.0/0.5 | 只进弱点，**不进复习队列**（hunt 结算后无任何 addSentence/schedule 调用）→ 找错知识缺口无间隔重复 |
| 找错复盘句 | 复习队列 | ❌ 不通 | 同上 |
| 日记批改 issue（AI） | 弱点档案 | ✅ 通：diary_issue_tag → weakSpotsService.ts:88-93，权重 1.5（最高） | |
| 日记句子 | 复习队列 | ✅ 通：`addDiarySentenceToReview`（diaryService.ts:258），GrammarDiaryPage.tsx:139/219 两处 | sourceId=diary:entryId |
| 复习失败（grammar_review_result） | 弱点档案 | ✅ 通但受限：仅 sourceId 以 `diary:` 开头的卡可回溯 tag（weakSpotsService.ts:99-107）；**lesson: 来源的卡无结构化罪名，诚实不计入**（代码注释 :98） | 课程错题复习失败 → 弱点归因断 |
| 语法复习页 | 主 reviewService.applyReview | ✅ 通：复用同一 SM-2 与 schedules（GrammarReviewPage.tsx:64） | 非独立队列 |
| 弱点档案 | 一键今日复习 | ✅ 通：scheduleCardsForToday（weakSpotsService.ts:131），但 relatedCardIds 只含 diary 来源卡 | |
| 冒险模块 | 语法遥测 | 不适用：adventureTelemetry.ts 是**独立键空间独立事件体系**（22 事件），与 grammarTelemetry 互不读写 | 跨模块指标无法算 |

### 4. 复习引擎健康度

- **调度**：复用主 `reviewService.applyReviewWithUndo`（reviewService.ts:355-435），四档 SM-2：rating1（忘了）→ ease−0.25、间隔 0、10 分钟后、lapse+1；rating2 → 1 天；rating3 → interval×ease；rating4 → ease+0.12（上限 3.2）、interval×ease×1.3（≥3 天）。
- **语法复习页评分映射**（GrammarReviewPage.tsx:25-28）：看答案=1、首次通过=4、多次尝试后通过=3。**问题：「多次尝试通过」给 rating3 仍走 interval×ease 放大间隔**——对「试 3 次才蒙对」的卡没有间隔收缩保护，可能导致未掌握卡被排远。
- **掌握判定**：`mastered` = rating4 且 reviewCount≥4（reviewService.ts:396）——**这是「选择/填空连续四次满分」口径，不是产品计划 GRAMMAR_PRODUCT_PLAN.md:260 的「输出型题型连续两次通过才算掌握」**。语法复习只有 cloze（四选一）与 rebuild（点词块）两形态（grammarReviewService.ts:71），**无自由输出题型**，掌握口径与「输出才算会用」的北极星哲学不一致。
- **组会话**：上限 10 张、时间预算 5 分钟（grammarReviewService.ts:12-13）、lapse 多者优先、按 sourceId 交错混题、cloze/rebuild 按 reviewCount 确定性轮换（:158）——健康。
- **入队口径**：`isGrammarSentenceCard` 只看 tag 含「语法」（:16），diary 入队卡若无该 tag 则**进不了语法复习会话**——`addDiarySentenceToReview` 的 tags 需核实（未核实，diaryService.ts:258 实现未逐行读）。

### 5. 测试覆盖度

| 测试文件 | 行数 | 覆盖 |
|---|---|---|
| grammarLessons.test.ts | 79 | practice ≥4 题+变体题、tokens 词集与 answer 一致、干扰项不与答案重复、L13-L20 必有 recall——**数据质量红线，不覆盖 L1-L12 recall**（:68 只校验第二季） |
| grammarReviewService.test.ts | 123 | 到期过滤、lapse 优先+交错+上限 10、cloze 四选项、rebuild 还原、确定性可回放——**核心调度与出题有保障** |
| grammarTelemetry.test.ts | 134 | 追加读回、汇总（通过率/误报率/tag 分布）、section_dwell 聚合、清空——**埋点聚合有保障；未测溢出归档路径** |
| grammarWeakSpotsService.test.ts | 125 | 日记权重、wrongTag 计入/hit 排除、复习失败 diary 回溯、一键排今日——**归因主链路有保障** |
| gateScripts.test.ts | 68 | 语言之门 8 关红线校验（自述英文、无挫败字眼、三档提示、引用完整）——遗留资产质量门 |

**保障缺口**：① 判题函数 judgeGrammarCloze/judgeGrammarRebuild 有间接测试；② `addLessonCoreSentence` 覆盖不全——**覆盖缺口无集成测试能发现**；③ 页面层（LessonPage 六段流转、DiaryPage 批改失败态）无测试；④ 归档滚动（12000 上限）未测。

### 6. 指标体系落地差距总表

| 指标 | 数据来源 | 现状 |
|---|---|---|
| 北极星：每周有效输出句数 | lesson_step_result(output) + diary | ⚠️ 原料齐、**无汇总函数、无「有效」口径实现** |
| 漏斗：进入语法页→首课→首次练习→次日复习→加入日常 | — | ❌ 第一环无埋点；❌ 次日/日常无 D1 口径；其余可算 |
| 知识点首次通过率 60-75% | lesson_completed.guidedFirstTry/practiceFirstTry | ✅ 可算（summarizeGrammarTelemetry:348-349） |
| 输出型题占比 >40% | 静态：practice 96 题为点词成句（非自由输出）；自由输出仅 output 段 1-2 句/课+recall | ⚠️ 静态口径**不达标**：自由输出题约占课内题量 2-3/11 ≈ 20-27%（估算） |
| 重复错误率周环比 -30%/月 | diary_issue_tag + hunt_verdict（有 ts） | ⚠️ 原料齐、无周聚合函数 |
| 错误后立即重试率 >90% | lesson_step_result attempts/passed | ✅ 可算 |
| 主动重玩率 >20% | — | ❌ 无重玩事件 |
| 批改准确率 >90% / 误报率 <5% | AI 批改无抽检埋点；hunt 误报率 | ❌ / ✅（huntFalsePositiveRate:352） |
| 题目重复率 <5% | — | ❌ 无出题记录 |
| 趣味性：每关尝试 1.5-2.5 / 单次 8-12 分钟 / 世界完成率 >60% / D1>50% | adventureTelemetry（独立体系） | ⚠️ 属冒险模块键空间，与语法板块不互通 |

### 7. 洞察与建议

**洞察（按严重度）**：

1. **「核心句入队」覆盖不全，课程正向资产大部分未进入间隔重复**——`addLessonCoreSentence` 仅经完课页单一路径触达；只有「错句」入队。学习者全对一课时，该课核心句不进 SM-2，「学会的东西」无任何防遗忘机制。这直接削弱北极星（输出句数的持续供给）。（注：经析客复核，非零调用方，是"覆盖不全+存量未回填"）
2. **掌握判定口径与产品哲学自相矛盾**：文档要求「输出型连续两次通过才算掌握」（GRAMMAR_PRODUCT_PLAN.md:260），代码实现是「cloze 四选一连续 4 次满分」（reviewService.ts:396）——选择题蒙对也算掌握，且语法复习题型中根本没有自由输出。
3. **找错（106 处植错）是最大单错题库，但其知识缺口不进复习队列**——hunt 结算后仅落 HuntResult 与弱点档案，无句子卡生成；弱点档案的 relatedCardIds 只能回溯 diary 来源卡，hunt/lesson 来源的「一键复习」是空按钮（weakSpotsService.ts:98 注释自认「推不出的不计入」）。
4. **北极星指标没有实现**：summarize 函数（grammarTelemetry.ts:304-361）不含「每周有效输出句数」；「进入语法页」漏斗第一环无埋点。
5. **18/33 案件未人工校验**（reviewed: true 仅 15）却已全量配课上线——R15 注释（huntCases.ts:17-19）自己的规则是「未引用案须先校验」，但现状是未校验案已被课程引用。

**建议（按优先级）**：

- **P0-1 接通核心句入队全链路**：核实挑战段通过路径是否触发 `markLessonDone`，未触发则补上；启动时一次性回填存量已完成课（函数本身幂等）。
- **P0-2 补漏斗第一环埋点**：GrammarPathPage 挂载 `grammar_path_viewed` 事件；同时在 summarize 中实现「每周有效输出句数」（分子：output section 的 free_type passed 事件数 + diary 保存句数；乘数：free_type 首次通过率）。
- **P1-3 掌握口径对齐**：语法复习会话内增加「自由输出轮」（reviewCount≥2 的卡第 3 次出现时用 free_type 形态复用课内 output 判分链路），mastered 改为「输出连续 2 次通过」；短期可先把 rating3（多次尝试通过）的间隔改为不放大。
- **P1-4 hunt→复习闭环**：结算时把「未找出/归错罪名」的错误句生成句子卡（sourceId=hunt:caseId，tag 记入 note），使弱点档案「一键复习」对 hunt 来源生效。
- **P2-5 补齐 18 案人工校验**（R15 流程已有，执行即可）；补 diary「观察/如果」两类题；补 diary 入队卡 tags 含「语法」的核实与测试。
- **P2-6 周聚合工具**：在 summarize 基础上加 week-over-week 的 errorTag 频次对比（数据已有 ts），落地「重复错误率周环比」与周报文案（GRAMMAR_PRODUCT_PLAN.md:284-285 的「每周一句话结论」）。

---

## ✅ 行动清单

| # | 行动 | 负责方 | 时间窗 |
|---|------|--------|--------|
| 1 | P0-1 核心句全链路+回填、P0-2 路径页埋点+周汇总（主 PRD R04/R05） | 开发 | W1 |
| 2 | P1-3 掌握口径、P1-4 hunt 闭环（主 PRD R09/R02） | 开发 | W2/W5 |
| 3 | P2-5 校验+补题、P2-6 周聚合（主 PRD R13/R10/R14） | 内容+开发 | W6-W9 |

---

## ⚠️ 待确认 / 假设 / Non-goals

- 「单课 9-11 题/全池约 240 题」「自由输出占比 20-27%」为估算；词汇 500 词内、归档溢出测试、diary 入队卡 tags 三项未核实。
- 事实修正：空 huntCaseIds 为 5 课（非 8 课）；addLessonCoreSentence 非零调用方（析客复核）。
- Non-goals：不建数仓、不接遥测上报（本地优先）、不改冒险模块键空间。

---

> 本报告由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。
