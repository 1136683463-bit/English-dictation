# 数据盘点：第八批课程可生产性（日常细节篇 L55–L60）

**日期**：2026-09-17 ｜ **类型**：实读代码/文件盘点（本地项目无数仓、无真实用户数据）｜ **成员**：数析（数据分析师）
**主交付物**：`prd-grammar-daily-details-2026-09-17.md`

**方法**：实读源文件 + 计数核查（grep/python 一次性统计，跑完即删）；4 个语法护栏文件与全量测试实跑复核

---

## 指标评审: 第八批立项（日常细节篇）

### 关键指标概览

| 指标 | 本期（实读） | 上期（第七批前基线） | 变化 | 状态 | 出处 |
|---|---|---|---|---|---|
| 课程数 | 54（L1–54 连续、id 唯一、episode 唯一） | 49 | +5 | ✅ | `src/data/grammarLessons.ts` |
| 案件数 | 63（全 reviewed；头部注释 2 处历史校验记录不计） | 58 | +5 | ✅ | `src/data/huntCases.ts` |
| **月份名语料** | **12 词全 0 处**（January–December 逐词扫描） | 0 | 持平 | ⚠️ 真空白 | `grammarLessons.ts` |
| **序数词语料** | first 0 / second 1 / third 2（后两者非教学语境） | — | 首次数 | ⚠️ 近零 | 实读 |
| **-ly 副词语料** | quickly / carefully / loudly / slowly **全 0** | — | 首次数 | ⚠️ 真空白 | 实读 |
| well 语料 | 3 处（全在 L14：`:2447` 教学句 + 练习卡） | — | 认读种子 | ✅ 转正基础 | 实读 |
| fast 语料 | 1 处（比较课 -er 语料） | — | — | ✅ 可借 | 实读 |
| **there was/were 语料** | 课程 0 / 案件 0（there is/are 现在版在 L26 已立） | 0 | 持平 | ⚠️ 真空白 | 实读 |
| was / were 词频 | was 310 / were 154（were 含 was doing 家族） | — | — | ✅ 词形可借 | 实读 |
| May 与 may | 均 0 处（大写/小写均未出现）——**无同形冲突存量** | — | 首次数 | ✅ | 实读 |
| be 变位抽词表 | am/is/are/was/were/will/did/does/do/have/has/can/must/should + 实义动词 | — | — | ✅ cloze 天然命中 | `grammarAmbushService.ts:154` |
| 罪名枚举 | 10 个（tense/sv_agreement/missing_be/article/plural/preposition/fragment/run_on/word_order/verb_form） | 10 | 持平 | ✅ 零扩展 | `huntService.ts:331` |
| 番外案名单 | 5 个（white-cat/sports-day/pen-pal-letter/fridge-note/term-review） | 5 | 持平 | ✅ 不动 | `huntService.test.ts:215` |
| 封面资产 | 49 张在用；**单次用量 44 张**（含本批 6 张候选）、双次 5 张（cover10/16/20/23/24）——44+5×2=54 课用量吻合 | 单次 47 | 池减 3 | ✅ 够用 | 实读计数 |
| 课号写法 | L50=㊿、**L51–54 汉字数字已入库**（「小美的一天 五十一」…「五十四」） | — | 已迁移 | ✅ 无缝续写 | 实读 `:9075–9826` |
| 语法护栏测试 | 4 文件 80 项全绿；全量 51 文件 605 项全绿 | 89/4 文件（批七口径） | — | ✅ | vitest 实跑 |
| season 分组 | season-1…season-7（min 50/max 54 封在 L54）；**season-8 未建** | — | — | ⚠️ 硬需求 | `grammarSeasons.ts:30` |
| can-do 锚点 | m1…m9（m9 afterLesson 54） | — | — | ⚠️ 硬需求 | `GrammarPathPage.tsx:104` |

---

### 洞察（每条附支撑数据）

1. **六个候选点语料现状逐项复核完毕**：月份 0 处、序数近零（first 0 / third 2 非教学）、-ly 副词 0 处、well 3 处全在 L14、there was/were 0 处——四空白 + 两笔认读种子（well / fast），与瑞思/竞析口径一致。**May 大写均未出现**，月份课与情态 may 无存量冲突面。

2. **日期链是「已教一半」的欠账回收，不是从零教**：L27 已教问句（`When is your birthday?`，`:4840`）；L6 星期与 L18「on＋某天」两段轨道已铺好（`:990`、`:3243`）——L55–57 增量 = 序数排位词 + 12 月名 + 日期合体，零件复用率高。

3. **副词链的更大风险在内部一致性而非空白本身**：L28 频率副词「站动词前」已先入为主（`:5003`），方式副词「站动词后」若不与 L28 对照，会诱发系统性抢位误用——此为批内最高优先对照话术（对应风险登记册 #2）。

4. **there was/were 为零新增零件重组**：There 先占位（L26 `:4635`）+ is/are 单复数判断 + was/were 词形（was 310/were 154 在库）——L60 是「换挡」而非「造轮」，全批负荷最低一课。

5. **cloze 落点对全批天然命中**：抽词表已含 be 全变位（am/is/are/was/were）——L55/L56 空 `is`、L60 空 `was` 直接命中；L57–L59 核心句若无表内动词按兜底抽第 2 词，生产时预演确认。

6. **封面池够用且有 6 张候选**：单次用量 44 张中含 cover28/30/18/49/21/26（逐张实读确认均 1 次用量）——本批取 6 张后用余 38 张，不新增池外资产。

7. **两条展示层护栏硬需求**：season-8（min 55/max 60）+ m10（afterLesson 60）——L55+ 不落组会被路径页静默过滤（`findSeasonByLessonNumber` 找不到即缺口），`grammarSeasons.test.ts`「最高课号落区间」断言会先红。

8. **课号写法已迁移、零决策**：L51 起汉字数字已入库，L55–L60 直接续写「五十五」…「六十」，episode 无边界问题（圈号断点在批七已处理）。

---

### 第八批可生产性分析

#### a) 护栏清单（更新版，L55+ 自动纳入）

沿用标准 15 项（practice ≥4 含变体逐字 / tokens 一致 / 干扰不重复 / recall 强制 / 防退化 / 罪名 10 枚举 / reviewed 双向 / tokenIndex 对齐 / **番外案精确=5** / 案件池下限 / **路径页分组硬需求** / **m 锚点** / 关 2 题源 / cloze 抽词表 / 关 3 混案）。

本批新增注意：
- **G8/G8-b**：season-8（{55,60}）+ m10（60）随批上线——首个**跨 6 课**的分组区间；
- **G9**：6 个新案（#64–#69）全部被 L55–L60 引用（orphans 断言不动）；
- **G10**：episode 汉字数字续写（五十五…六十）；
- 日期语序**不立对错**（October 1 vs 1 October 两序皆正，只教一种 + 注明）。

#### b) 候选点错误的罪名承载（结论：零枚举扩展，逐形态预判）

| 拟植错形态 | 承载罪名 | 现有先例（实证） |
|---|---|---|
| `*She sings good.`（形容词顶岗副词） | **word_order** 或 verb_form（tag 承载先例少，生产时观察） | 形容词/副词分工为本批首次引入（风险 #5） |
| `*She well sings.`（副词抢前座） | **word_order** | L28 频率副词位置错先例在库 |
| `*October 1 I am free.`（丢介词） | **preposition** | 19 处先例（L18 `*in Monday` 同型） |
| `*may 1`（月份小写） | **word_order**（暂定；非冠词缺失实错） | 大小写错承载先例少（风险 #4，§8-① 挂日历） |
| `*October one`（基数顶岗序数） | **verb_form** 或 word_order | 词形替换型单 token 可修 |
| `*There have a book yesterday.`（「有」万能直译） | **verb_form**（have→was） | 词形替换先例充足 |
| `*There was many apples.`（过去版单复数） | **sv_agreement** | was→were 先例 10 处（#1 等） |

#### c) 展示层增量

- **season-8**（min 55, max 60）+ **m10**（afterLesson 60）：合计 ≈17 行，随批上线（硬需求）；m10 样本句默认取三课核心句（May / quickly / there was）。

#### d) 上线后可用指标（全部现成埋点）

| 指标 | 判读口径（本批特有） |
|---|---|
| L55–57 首过率 | 日期链三课对比全批窗口基线（±5pp）；L56 <70% 触发月份拆两课预案 |
| L58–59 首过率 | 副词链；关 2 位置题错选集中度观察 L28 互扰 |
| 关 2 一次通过率 | 50–70% 区间为预期带 |
| 新案误报率（#64–69） | 误报率无显著上行 → 收口 |
| m10 触达 | 完成 L60 后出现即达标 |

---

## 附录：数据核查命令与结果（复核留痕）

```
月份 12 词：全 0 ✓
first 0 / second 1 / third 2 ✓（后两者非教学语境）
quickly/carefully/loudly/slowly：全 0 ✓
well 3（全 L14）/ fast 1 ✓
there was/were：课程 0 / 案件 0 ✓
was 310 / were 154 ✓
May/may：均 0 ✓
课号：L50=㊿、L51–54 汉字 ✓
封面：44 单次 + 5 双次（×2）= 54 ✓；6 候选（28/30/18/49/21/26）均单次 ✓
罪名枚举：10 ✓；番外案：5 ✓
护栏测试 4 文件 80 项全绿；全量 51 文件 605 项全绿 ✓
```

---

## 📚 数据来源 & 成员产出索引

- 瑞思（用户研究）：`user-research-grammar-daily-details-2026-09-17.md`
- 竞析（竞品分析）：`competitive-analysis-grammar-daily-details-2026-09-17.md`
- 析客（PRD）：`prd-grammar-daily-details-2026-09-17.md`
- 路径（路线图）：`roadmap-grammar-eighth-batch-2026-09-17.md`
- 数析（本文件）

---

> 本报告由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。
