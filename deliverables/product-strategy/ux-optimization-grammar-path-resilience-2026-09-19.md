# 优化 PRD：语法模块路径韧性与开口闭环

**日期**：2026-09-19
**类型**：功能规格书（优化文档）
**参与成员**：主理人方向明（汇编）、析客（执笔）、数析（数据附录）、瑞思（上游研究）

---

## 📌 TL;DR（执行摘要）

- 瑞思结论成立：**内容高水位、路径脆**。本 PRD 用三个正交 Package 回应：**A 路径韧性**（R-UX1~4，全 P0，6 人日）修「现在就坏着」的部分；**B 开口闭环 MVP**（R-UX5~6，2.5 人日）用现有 speechService 的 TTS 在「说」段和日记加零焦虑跟读自评，不引入识别与判分；**C 信息架构**（R-UX7~10，4 人日）落节奏与锚点。
- 合计 12.5 人日。Package A 可与 AI 讲解批次（prd-grammar-ai-tutor-2026-09-19.md W1-W3）并行——文件层不重叠（排期裁决见升级规划路线图）。
- **speechService 能力结论（实读全文后写死）**：`speakText(text, options)` 已具备 SpeakOptions（lang/rate/voiceURI/systemOnly）+ 七个 lifecycle 回调 + pause/resume/stop + preloadSpeechAudio + isSpeechSupported，**Package B 零新权限、零 speechService 改动**（至多透传 rate）。src 全域确认无 SpeechRecognition/MediaRecorder/getUserMedia——语音识别属 v2 新模块。

---

## 🎯 核心结论卡片

| Package | 回答的问题 | 需求 | 人日 | 优先级 |
|---|---|---|---|---|
| A 路径韧性 | 一次误触/一个错 URL 为什么能清空一切？ | R-UX1~4 | 6 | 全 P0 |
| B 开口闭环 MVP | 从「写对」到「说出」的最小出口是什么？ | R-UX5~6 | 2.5 | P0/P1 |
| C 信息架构与节奏 | 长路径有锚点、复习有节奏吗？ | R-UX7~10 | 4 | P1/P2 |

---

## 1. 问题陈述与目标（三个正交目标）

- **G1 韧性**：任何误触、刷新、错 URL 都不丢进度、不空白。
- **G2 开口**：给「日常开口」目标一个零判分、零焦虑、不进必经路径的最小说出出口。
- **G3 节奏**：20 季长路径有继续锚点，复习不连出同型卡，hunt 有最近解锁聚焦。

## 2. Package A：路径韧性（全 P0）

| 编号 | 需求 | 优先级 | 人日 | 涉及文件 |
|---|---|---|---|---|
| R-UX1 | 全局 catch-all 404 兜底 | P0 | 0.5 | `src/App.tsx`、新增 `src/pages/NotFoundPage.tsx` |
| R-UX2 | 练习中回看讲解不丢进度（D1） | P0 | 2 | `src/pages/GrammarLessonPage.tsx`（gotoStage :906-934、reread :895-904） |
| R-UX3 | 课内 stage/step 断点续学（D3） | P0 | 2.5 | 新增 `src/services/grammarLessonResumeService.ts`、GrammarLessonPage.tsx |
| R-UX4 | 已完课正课页补趁热练入口（D4） | P0 | 1 | GrammarLessonPage.tsx（复用 GrammarPathPage renderBoostBar 的 BOOST_TIERS 链接逻辑） |

**R-UX1 验收**：Given 访问 `/grammar/lesson/lesson-01-am/boost`（不匹配路由），When 渲染，Then main 显示 404 卡（「走岔了」+「回语法路径」「回首页」两链接）而非空白；Given 全部 18 条合法路由，When 渲染，Then 行为与现状逐字不变；Then 新增渲染测试并入测试纪律。

**R-UX2 验收**：Given practice/output 段进行到第 N 题、已拼部分词块，When 点「回去再看一遍讲解」（:2248）后返回 practice，Then 恢复到第 N 题及已拼状态，并出现「继续刚才 / 重新开始」二选一；When 选重新开始，Then 走 gotoStage 全量重置（14 状态，:917-931 行为不变）；Given 从课前/结算页全新进入，When 渲染，Then 无恢复弹层（快照仅经 reread/跨段离开 practice 时写入 ref）。

**R-UX3 验收**：Given 课内处于 stage=S、段内步=X，When 刷新或关闭浏览器后重进同课，Then 弹「从上次继续 / 重新开始」；When 选继续，Then 恢复到 S/X 并滚动复位；When 选重新开始，Then 清除 localStorage 键 `grammar:resume:{lessonId}` 并全量重置；Given 快照超过 24 小时，Then 默认视为重新开始；Then 恢复读取用惰性初始化一次，StrictMode 双跑不产生重复埋点（沿用 ref 守卫纪律）。

**R-UX4 验收**：Given `grammarLessonsDone` 含本课 id，When 进入正课页头部，Then 显示趁热练档位条（链接 `/grammar/boost/{id}?tier=…&from=lesson`，埋点 `grammar_boost_offered` entryPoint:"lesson"）；Given 未完课，Then 不显示——门禁规则不变，只补入口。

## 3. Package B：开口闭环 MVP

| 编号 | 需求 | 优先级 | 人日 | 涉及文件 |
|---|---|---|---|---|
| R-UX5 | 「说」段（output 呈现答案句后）加「开口跟读」块：播本句→跟读→三档自评，可跳过、不判分、不阻塞 | P0 | 2 | GrammarLessonPage.tsx、样式文件 |
| R-UX6 | 日记批改完成页加「读一遍我写的」TTS 出口 | P1 | 0.5 | `src/pages/GrammarDiaryPage.tsx` |

**R-UX5 验收**：Given output 某步出答案句，Then 渲染跟读块：播放按钮（speakText，rate 随设置）+ 自评三档「说顺了/磕磕绊绊/再读一遍」+「跳过」；Given 点任一自评或跳过，Then 记 `say_aloud_event({lessonId, step, action, ts})` 且照常进下一题；Given `isSpeechSupported()` 为 false，Then 整块不渲染；Given StrictMode 双跑，Then 埋点仅一条。

**R-UX6 验收**：Given 批改完成页，Then 有朗读用户原句按钮；Given TTS 链路失败，Then 静默降级、无错误弹窗。

**v2（不在本期）**：浏览器语音识别「读对才算过」可选档，需新建 recognition 模块并另行评审。

## 4. Package C：信息架构与节奏

| 编号 | 需求 | 优先级 | 人日 | 涉及文件 / 验收要点 |
|---|---|---|---|---|
| R-UX7 | 路径页顶部「继续第 N 课 · 第 X 段」强锚点（联动 R-UX3 恢复数据，未开始则指首课）+ 已完成季默认折叠 | P1 | 1.5 | GrammarPathPage.tsx；Then 锚点直达且折叠状态持久化 |
| R-UX8 | watch 变奏步深挖卡默认收起 + 发音自动连播开关（默认关） | P2 | 1 | GrammarLessonPage.tsx；与 AI-tutor R-AI4 同区，排其 M2 合入后实施；`impression(mode)` 字段兼容 default_closed |
| R-UX9 | 复习出卡同型（errorTag/题型）不连出 2 张 | P1 | 1 | GrammarReviewPage/队列排序纯函数；Then 单测覆盖相邻去重 |
| R-UX10 | hunt 页顶部聚焦条「最快解锁：学完第 N 课再解 3 案」 | P2 | 0.5 | GrammarHuntPage.tsx；纯本地聚合，无新数据 |

## 5. Non-goals

1. **不做口语自动判分/发音评分**；语音识别 v2 也仅限「读对才算过」可选档，另行立项。
2. **不新建页面、不重排六段式**顺序；Package B 全部内嵌现有「说」段与日记完成页。
3. **不动已规划的 AI 讲解批次**（R-AI0~13、W1-W3 排期照旧，见 prd-grammar-ai-tutor-2026-09-19.md）。
4. **不做登录/云同步/遥测服务器**；R-UX3 快照与错句落盘均在 localStorage 本地。
5. **不做移动端/触屏适配**。
6. **不改趁热练完课门禁规则**（R-UX4 只补入口）。

## 6. 里程碑（周粒度，容量裁决见升级规划）

析客原案（W1=A 全量叠加 M1）经路径核算 W1=11 人日、W2=10 人日，超出 6 人日/周容量——最终排期以升级规划路线图为准（韧性线顺延插空，AI-tutor 线不动）。

## 7. 开放问题

1. R-UX2 与 R-UX3 的恢复交互是否统一为同一个「继续/重新开始」组件（建议是，避免两套话术）。
2. 课内跟读音源：默认在线链路存在 2.5s 起播超时，课内是否改 `systemOnly:true` 换零延迟（试听场景已用同参数，建议实测拍板）。
3. R-UX3 快照粒度：仅序列化 stage/stepIndex、词块拼装序不落盘（重进该题重拼）是否可接受。
4. 季折叠默认态：仅折叠已完成季，还是全折叠只留锚点。
5. D1 修复后 `lesson_reread` 语义变化（回看不再丢进度）是否需新增字段区分，避免 AI-tutor S4 配对数据断签。

---

## 附录 · 数析（Metric）数据盘点（2026-09-19）

### A1 规模盘点

| 维度 | 数字 | 统计方法 | 备注 |
|---|---|---|---|
| 课程总数 | 133 课（number 1–133 连续无缺） | esbuild 加载 grammarLessons 数组实算 | 文件 25,139 行 |
| 季数 | 20 季（分布 12/12/10/7/5/3/5/6/6/5/4/3/8/8/8/8/8/6/3/6） | 正则解析 seasons 区间后实算 | 与课程数完全咬合 |
| contrast 对比卡 | 798 组（每课 6） | node 聚合 | 全部课程齐装 |
| guided 跟练题 | 797 题（choose 133 / arrange 398 / spot 133 / replace 133） | node 聚合 | |
| recall 忆段 | 133/133 全有 | node 聚合 | |
| practice 练段 | 559 题（均值 4.2/课） | node 聚合 | |
| output 说段 | 每课 2 步（半提示 + 无提示） | 读 outputPlan | |
| 侦探案件 | 142 案 / 542 错点（均值 3.8/案）；罪名 Top：verb_form 125 / plural 98 / sv_agreement 85 | esbuild 实算 | 142/142 已人工校验 |
| 趁热练 | 档 1=4 题/2 分；档 2=5 题/4 分；档 3=3 题/4 分 | BOOST_TIER_META | |
| 零术语词表 | 29 词 | 正则提取 | 守门测试与运行时共用 |
| 日记题库 | 84 问 | esbuild 实算 | 每天确定性抽题 |
| 埋点事件 | 36 种（声明=实发，全部接线） | awk 多行提取 uniq | 活跃区 3000 条 + 归档 12000 条 |

### A2 学习负载测算

| 模块 | 单位负载 | 总量 |
|---|---|---|
| 正课 133 课 | ≈8 分钟/课 | ≈17.7 h |
| 趁热练全三档 | ≈10 分钟/课 | ≈22.2 h |
| 侦探找错 142 案 | ≈2-4 分钟/案（未核实） | ≈5.7-9.5 h |
| **核心（正课+趁热练）** | | **≈40 h** |
| **全模块** | | **≈47 h** |

一行结论：每天 20 分钟 → 核心约 4 个月；每天 40 分钟 → 约 2 个月；SM-2 复习尾巴再延 2-4 周（未核实）。

### A3 观测盲区 Top 5（转入路线图排期）

1. 课中途退出无 exit 事件（正课漏斗最大盲区）→ `lesson_exit` 挂 R-UX2 同做
2. 课小结 AI 零观测（唯一无事件的 AI 落点）→ 并入 R-AI0
3. 日记写入行为零事件 → 挂 R-UX6 同做
4. boost_offered 三入口不可归因 + 句卡入队无事件 → 挂 R-UX4 同做
5. 事件容量 3000 条约 2-3 个月翻滚 → W4 独立治理任务

### A4 AI 成本盘点

| 落点 | 配额 | 缓存 | 单课预计 |
|---|---|---|---|
| 问一句 | ≤2 次/课（会话内） | 30 天 TTL | 0-2 |
| 错因追问 | ≤2 次/题、按 step 去重 | 30 天 TTL | 0-2 |
| 档 3 AI 批改 | 每档 1 次批量 | 30 天 TTL | 1 |
| AI 变式题 | 仅锚点不足时 0-2 题 | 无 TTL（可手动清） | 0-1 |
| 日记批改 | 1 次/句，done 不重调 | 结果持久化=永久缓存 | 与日记量挂钩 |
| 课小结 | 完课自动 1 次 | 30 天 TTL | 1（固定） |

单课最坏 ≈7 次、典型 0-3 次；超时统一 10s；所有落点有降级路径，断网不阻塞学习。

---

## ✅ 行动清单

| # | 行动 | 负责方 | 时间窗 |
|---|------|--------|--------|
| 1 | R-UX1 catch-all 404 | 开发 | W1 |
| 2 | R-UX4 趁热练入口 + boost 归因埋点 | 开发 | W2 |
| 3 | R-UX2 回看不丢进度 + lesson_exit 埋点 | 开发 | W3 |
| 4 | R-UX3 断点续学 + R-UX5 TTS 跟读 | 开发 | W4 |
| 5 | R-UX6/7/9 日记出口/路径锚点/复习卡打散 | 开发 | W5 |

## ⚠️ 待确认 / 假设 / Non-goals

- 估算基于 6 人日/周容量假设（单人兼职节奏）；容量裁决见升级规划。
- R-UX2/3 的状态快照选型（ref + localStorage 序列化）需 W0 拍板。
- 负载测算中的「找错每案 2-4 分钟」「SM-2 延后 2-4 周」为未核实项。

## 📚 数据来源 & 成员产出索引

- 析客（需求分析师）：PRD 正文（本文 §1-7）
- 数析（数据分析师）：数据盘点（本文附录）
- 瑞思（用户研究员）：上游发现（见体验文档）
- 路径（路线图规划师）：排期裁决与风险（见升级规划）

---

> 本报告由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。
