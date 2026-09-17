# 数据盘点：第五批课程可生产性（不定式/动名词）

**日期**：2026-09-16 ｜ **类型**：实读代码/文件盘点（本地项目无数仓，无真实用户数据）｜ **成员**：数析（数据分析师）
**主交付物**：`prd-grammar-infinitive-2026-09-16.md`

**仓库**：`/Users/liujun/Documents/英语听写` ｜ **方法**：实读源文件 + vite-node 一次性统计脚本（跑完即删，未改动仓库）

---

## 指标评审：第五批课程可生产性（2026-09-16）

### 关键指标概览

| 指标 | 本期 | 上期（2026-09-14 盘点） | 变化 | 状态 | 来源 |
|---|---|---|---|---|---|
| 课程数 | 41（L1–41 连续无缺号） | 34 | +7 | ✅ | `src/data/grammarLessons.ts:43`（7553 行） |
| 深度 7 字段覆盖 | 41/41 全量 | 34/34 | 持平 | ✅ | 实读 |
| guided 题 | 245（choose 41 / arrange 122 / spot 41 / replace 41） | 203 | +42 | ✅ | 实读 |
| practice 题 | 165（L25×5，其余×4；干扰项 165/165 共 191 个） | 137 | +28 | ✅ | 实读 |
| 语料句总量（结构化字段） | 1517 句（正确 1230 / 故意错误 287） | — | — | ✅ | 实读编译统计 |
| **to+动词 语料** | **185 处：want 类 36（✓31/✗5）、going to 37（✓31/✗6）、have to 6（✓5/✗1）、介词 to+名词 100（✓84/✗16）、wh-to 0、目的状语 to 0（6 处全为故意错误）** | — | — | ⚠️ 目的状语/wh-to 零先例 | 实读 |
| **V-ing 语料** | **128 处动词形：进行时/going-to 115、动名词 2（like reading×2）、介词后 0、句首主语 0、故意错误 10** | — | — | ⚠️ 动名词先例极薄 | 实读 |
| 侦探案 / 植错 | 50 案 / 174 错（编号 1–50 连续） | 43 / 146 | +7 / +28 | ✅ | `src/data/huntCases.ts` |
| 案件人工校验 | 50/50 reviewed=true | 43/43 | 持平 | ✅ | 实读 |
| 罪名分布 | verb_form 34 / sv_agreement 31 / plural 18 / article 17 / missing_be 16 / tense 14 / preposition 14 / word_order 14 / run_on 8 / fragment 8 | 上期 verb_form 33 | verb_form 仍居首（19.5%） | ✅ | 实读 |
| huntCaseIds 覆盖 | 45 案被引、5 番外案、0 悬空；空课 5（L2/3/5/6/8） | 同 | 持平 | ⚠️ 既定决策 | `grammarLessons.ts` |
| 封面资产 | 24 文件全用上；41 课占用 41 次：14 张复用（31 课共享）、10 张仅 1 次；单张上限 3 次 | 24 文件/10 对复用 | 复用池已近饱和 | ⚠️ 依赖复用 | `src/assets/lessons/`；实读统计 |
| 语法相关测试 | 4 文件 89 项全绿（本次实跑） | 3 文件 76 项 | +13 | ✅ | `npm test` 实测 |
| L37–41 词典外内容词 | L37: 1 个（coco×3，宠物名）；L38–41: **0** | 上期 L25–34 有 3 课 >0 | 最近 5 课为全库最干净 | ✅ | 代理口径实读 |

---

### 第五批可生产性分析

#### a) 新增 4–6 课触碰的护栏清单（更新版）

| # | 护栏 | 要求 | 证据 | 新旧 |
|---|---|---|---|---|
| 1 | practice 下限+变体题 | 每课 ≥4 题，≥1 题 answer 与 variants 否定/疑问卡 en **逐字一致** | `grammarLessons.test.ts:10-28` | 已有 |
| 2 | tokens/answer 词集一致 | 去标点小写词集相等；干扰项不与答案词重复 | `grammarLessons.test.ts:30-49,51-66` | 已有 |
| 3 | recall 强制 | number≥13 三字段非空（L42+ 自动纳入） | `grammarLessons.test.ts:68-78` | 已有 |
| 4 | 防退化打乱 | arrange/practice >2 词题展示序≠答案序 | `lessonService.test.ts:236-260` | 已有 |
| 5 | 罪名枚举钉死 | tag ∈ 10 枚举；`tagStats` 长度=10 | `huntService.ts:331-342`；`huntService.test.ts:109` | 已有 |
| 6 | 案件结构 | tokenIndex 对齐、每案 ≥1 净词、被引/未引均须 reviewed | `huntService.test.ts:312-330,294-309` | 已有 |
| 7 | **路径页分组真空** | season-4 `max=41` 硬编码，L42+ **不落入任何分组、不渲染**（filter 静默过滤） | `GrammarPathPage.tsx:252,483-498` | **新** |
| 8 | **can-do 无锚点** | 最新里程碑 m6 `afterLesson=41`，L42+ 完成后无收口仪式 | `GrammarPathPage.tsx:108-151` | **新** |
| 9 | 关 2 问卷题源 | Q1=targetSentence rebuild + variants[0..2] 轮换（3–5 题） | `grammarAmbushService.ts:180-204` | 已有 |
| 10 | 关 2 cloze 抽词表 | `GRAMMAR_WORDS` 不含 want/enjoy/to → 核心句会空在第 2 词 | `grammarAmbushService.ts:153-162` | 已有（新批需知情） |
| 11 | 关 3 新旧案混入 | 新案=本课 huntCaseIds；旧案=新案×40%（≥1） | `grammarAmbushService.ts:214-233` | 已有 |
| 12 | 封面复用 | 可缺省回退 scene SVG，新增需静态 import | `GrammarPathPage.tsx:380-384` | 已有 |
| 13 | 内容先例 | 目的状语 to、wh-to 全库 0 先例；动名词正确语料仅 2 处（L5）；介词后 V-ing 0 | 实读 | **新**（内容风险非代码护栏） |

#### b) 「不定式/动名词」错误的罪名承载：verb_form（结论：不改枚举，泛化 1 行文案）

| 候选 | 适配度 | 分析 |
|---|---|---|
| **verb_form** | **高（推荐）** | 现役先例 ≥8 案全是动词形式错：`swim→swiming`（hunt-travel-plan 去 -ing）、`Run→Running`（sports-day）、`sing→singing`（school-show）、`Closing→Close`（imperative-signs）、`rain→raining`（past-rainy-day）等。「该 -ing 却原形 / 该原形却 -ing / 缺 to」全部单 token 可承载 |
| word_order | 低 | PLAIN 已泛化为「站错位置」，但形式错不是位置错，混入会让周报「语序」聚合失真 |
| fragment | 低 | 语义锁「句子必须有主语和动词」，形式错句都有动词 |
| missing_be | 低 | 本批错误（want go / like read）与缺 be 无关 |
| run_on | 低 | 锁连词搭配，无关 |

**PLAIN 文案问题**：`verb_form` PLAIN 现为「被动要用『be + 过去分词』」（`huntService.ts:40`），而 34 处 verb_form 中被动类仅个位数，大头是时体/情态/非谓语形式——**文案已与实际用途脱节，本批 100% 是形式错，必须泛化**。
**建议新文案**：「动词要穿对形式——原形 / -ing / 过去式，看位置定」。
**改动位点**：`src/services/huntService.ts:40`（1 行）；全站生效（`GrammarHuntPage.tsx`、`GrammarDiaryPage.tsx`、`grammarWeakSpotsService.ts` 均引用同一常量）；无测试断言该文案、tag 枚举不变故 telemetry/导出不受影响。
**附带 1 处**：若做「缺 to」错（want go→want to go，correction=`to go`），`pickCorrectionWord` 会把 "to" 选进错词本（`huntService.ts:53` 的 `NON_CONTENT_WORDS` 不含 to）——建议加 "to"（1 行）。

#### c) 展示层增量（合计约 2 处、7 行）

1. **season-5 分组**：`LESSON_GROUPS` 追加 `{ id: "season-5", min: 42, max: 46/47 }`（`GrammarPathPage.tsx`，1 行）。
2. **can-do m7**：`CAN_DO_MILESTONES` 追加 `{ id: "can-do-m7", afterLesson: 46/47, ... }`（约 6 行）。

#### d) 上线后可用指标（决策门候选，均有现成埋点）

| 决策门 | 事件源 | 判读口径 |
|---|---|---|
| 首过率对照 | `grammar_lesson_completed.guidedFirstTry/practiceFirstTry` | L42–46 vs 既有基线偏移 |
| 逐步卡点 | `lesson_step_result.attempts/stepKind/section` | 定位 recall/cloze 具体题型 |
| 六段时长 | `section_dwell.dwellMs` | 对照「6–10 分钟/课」 |
| 提取摩擦 | `grammar_revisit_completed.firstTryCount/totalCount` | 目标一次通过率 50–70% |
| 新案误报 | `hunt_verdict.verdictKind` / `hunt_case_settled` | 仅当新批配案可判 |
| 回马枪 | `grammar_ambush_result.passed` | 弱点复现成功率 |
| 自发错误率 | `diary_issue_tag`（verb_form 占比） | 用户写作中 to/-ing 错误实际频率 |
| 收口仪式 | `can_do_confirmed.milestoneId` | m7 被确证 |

#### e) 缺口与未核实清单

| 缺口 | 状态 | 影响 |
|---|---|---|
| 核心 500 词表资产仍不存在 | 沿用代理口径（bundledDictionary 12000 词 + 功能词白名单 + 人名表） | 结论不可精确复现；L37–41 仅 coco（宠物名）1 例 |
| 无真实用户数据 | 本地单人自用项目 | 所有"指标"为设计期内容指标+上线后本地遥测 |
| to/-ing 分类器为启发式 | 多轮修正后终版 | 边界计数 ±1–2 未逐条人工复核 |
| 目的状语 to 教学可行性 | 全库 0 正确先例（6 处全为故意错误） | 属新增图案，无复现回声也无案件先例 |
| 全测试套件 | 仅跑 4 个语法相关文件（89/89 绿） | 其他域未回归 |

### 洞察（每条附支撑数据）

1. **面已就绪、纯数据可做**：41/41 课七字段全覆盖、guided 245/practice 165、50 案 174 错全 reviewed、89 项护栏测试全绿——第五批无需 schema 迁移。
2. **不定式有复现基础，动名词是荒漠**：to 语料 185 处（want 类正确 31、going to 正确 31、介词 to 正确 84）；但 -ing 的动名词用法正确语料只有 2 处（"I like reading."×2，`grammarLessons.ts:785,913`）——新批动名词课必须绑定 L5 旧知识并大量制造新复现。
3. **目的状语 to 建议知情推进**：全库 wh-to 0 命中；「go to X to do Y」0 正确先例（内容风险，用每课配案+复现设计对冲）。
4. **错误承载零风险**：-ing/原形误用先例 10 处全在故意错误语料（will drawing、can swimming、must going…），verb_form 已 8+ 案承载，无需新枚举；但 verb_form 占罪名 19.5%——新批 5 案建议每案混入 50% 旧罪名。
5. **两处"1 行级"展示改动是硬需求**：L42+ 不落任何分组会被 filter 静默过滤（`GrammarPathPage.tsx:484-485`），页面无声丢课；m6=41 后无锚点。
6. **关 2 cloze 抽词是机械的**：抽词表不含 want/enjoy/to（`grammarAmbushService.ts:154`），实测 "I want to travel." 空 "want" 而非 "to"——本批选题下（reading/swimming 已在词表），空位会自然落在语法词上，**当前无需扩表**。
7. **封面零新资产可行**：24 张对 41 课，当前 10 张仅用 1 次（cover3/4/5/8/12/15/17/19/23/24），L42–46 五课复用后单张上限仍 ≤2 次。
8. **最近 5 课词表纪律极好**：L38–41 词典外内容词 0，L37 仅宠物名 coco——新批沿用同口径即可达标。

### 建议

1. **按既有管线追加 L42–46**（数组尾插 + 每课 1 案 + 复用封面池），模板取 L33–41 签名：guided 6 题 + practice 4 + variants 3 + contrast 6 + swings 3 + recall 必填。
2. **罪名决策**：零枚举扩展，动词形式错全归 verb_form；同步泛化 PLAIN 1 行 + "to" 入 `NON_CONTENT_WORDS`（1 行）。
3. **展示层随批上线**：season-5 + m7，合计 ~7 行、≤0.5 人日。
4. **内容排序**：前 2 课吃 like 旧先例 → 中间课目的 to → enjoy → 收口。
5. **门禁**：上线前导出遥测建基线（`buildGrammarTelemetryExport`），2 周后对照首过率与 recall 步卡点（单人样本不做显著性推断）。

---

> 本盘点由产品战略团队数析执笔，经主理人汇编落盘。所有数字来自实读，未核实项已标注。
