# 冒险模块数据与埋点核实报告（数析）

> 核实时间：2026-09-13 下午｜方法：实读代码（git 工作区 + 源码），非数仓查询
> 前一轮报告：`metrics-framework-adventure.md`

## 1. R4 埋点落地状态（事件对照表）

**结论：R4 未落地，0/22 事件。**

依据（逐项核实）：

- `src/services/` 目录下**不存在** `adventureTelemetry.ts`（实列目录确认）。现有遥测文件为 `grammarTelemetry.ts`、`learningTelemetry.ts`（未跟踪新文件）、`settingsTelemetry.ts`、`statsTelemetry.ts`——均与冒险模块无关。
- 冒险模块四个核心文件（`src/pages/AdventurePage.tsx`、`src/pages/AdventurePlayPage.tsx`、`src/services/adventureService.ts`、`src/services/adventureModelService.ts`）中 grep `track/telemetry/Telemetry` **零命中**（仅命中无关的 `progress-track` CSS 类与一行注释）。
- 无对应测试文件（`adventureTelemetry.test.ts` 不存在）。
- **22 事件对照表：0 已接入 / 22 未接入**，事件清单见前报告 §3。值得注意的是上午低估了缺口：`src/services/learningTelemetry.ts` 也是当天上午之后才出现的新文件（git 未跟踪），说明埋点基建的"模式先例"本身也在并行演进中，但冒险侧尚未沾上任何一点。

git 旁证：工作区当前未提交改动集中在**词书 V2 与设置板块**（`storage.ts` 的 M1 启动迁移、`bookRestructureService.ts`、`completionEstimate.ts`、`learningTelemetry.ts` 等约 30 个文件），**没有任何冒险模块文件出现在改动清单中**。即 PRD 发布后的半天里，开发资源投向了词书 PRD，冒险 M0 尚未开工。

## 2. M0 完成度估计

M0 = R1 + R2 + R3 + R4 + R9。逐条核实：

| 需求 | 状态 | 依据 |
|---|---|---|
| R1 译文解耦 | **大部分已存在（先于 PRD）** | 离线模板章节全部预置 `sentenceTranslations`（`adventureService.ts:92-248`，campus/city/travel/fantasy 各章）；AI 契约已要求 `sentenceTranslations` 随节点落库（`adventureModelService.ts:368-375, 388-412`）；历史缺译文章节有"生成译文"一键补齐（`AdventurePlayPage.tsx:659-707`）。**但验收①"无 AI 下读路径零阻断"未完全达成**：`ensureTranslations` 在无 AI 时仍报"请先在设置中配置 AI"（`AdventurePlayPage.tsx:661-664`），离线兜底（词典级整句）未见实现 |
| R2 预加载不阻塞 | 未核实（本次任务范围外，未读相关代码路径）→ 瑞思复核：❌ 仍存在（`:1232,:1235`） | — |
| R3 自定义行动诚实化 | **未落地** | 输入框占位文案仍是"或者写下你想做的事"（`AdventurePlayPage.tsx:1235`）；离线回退反馈只有通用文案"AI 未启用…已使用离线剧情续章"（`:955-958`），**不回显用户输入文本**；grep"没能用上"零命中。验收③要求的 `custom_action_submitted` 区分"被采用/被回退"无从谈起（无埋点） |
| R4 埋点 22 事件 | **未落地** | 见 §1 |
| R9 推荐卡线索联动 | **未落地** | 选中推荐卡时代码直接用 `prompt = item.title：item.description` **静默覆盖**用户已填线索（`AdventurePage.tsx:179-183`），输入框无隐藏/无提示 |

**M0 完成度估计：约 15–20%**（仅 R1 的历史存量部分可算分，且这部分早于 PRD 存在；PRD 发布后半天内 M0 实际增量 ≈ 0）。

## 3. 指标可计算性清单

当前 `Adventure`/`AdventureNode` 可用于度量的字段（`src/types.ts:226-257`）：`createdAt`（冒险级 + 节点级）、`updatedAt`、`currentNodeId`、`nodes[].chapter/title/source(offline|ai)/selectedChoiceId/customAction/vocabulary[].cardId/sentenceTranslations 有无`、`template/level/scene/themeId/customPrompt`。

**零埋点下已可离线计算**（基于状态快照 + 时间戳）：

- 路线基数与结构：冒险总数、按 template/level/source 分布、每路线节点数；
- 粗略完成度：nodes 链长、最后节点距 `updatedAt` 的天数（"停滞路线"识别）；
- 收词产出：`vocabulary[].cardId` 非空的节点数、词→卡转化率；
- AI vs 离线占比：`nodes[].source` 分布；
- 自定义行动使用痕迹：`customAction` 非空的节点占比（**但无法区分采用/回退**）；
- 译文覆盖率：有 `sentenceTranslations` 的节点占比（R1 落地度的量化代理指标）。

**仍不可计算**（缺事件流，与前报告 §3 末段判断一致）：

- 北极星 WQAS（无会话边界）；
- 重玩率、重试率、尝试次数、会话时长（无时序）；
- 创建漏斗各环节转化、推荐采纳率（无请求/结果事件）；
- 全部 4 项护栏：错误后 30s 流失、AI 失败率、连续未 pass、TTS 失败率；
- D1/D7 冒险侧回访（全局侧可由 `reviews` 推导，冒险侧不行）。

## 4. 对 M1 启动条件的数据判断

**M1（R5 语言之门手感验证）现在不能开始，且按当前节奏存在排期风险。**

1. **硬性阻塞未解除**：手感验证的三个 P0 信号（三档分布、错误后流失、重试率）全部依赖 R4 事件流；R4 = 0/22。在零埋点状态下开始 R5，等于 PRD 自己警告的"在漏的循环上验证手感会污染信号"（PRD §1 关键决策②）。
2. **R3 是隐性前置**：M1 的"自定义行动 vs 选项占比"指标需要 R3 的"被采用/被回退"区分字段才有意义，R3 未做会连带降低 R4 埋点的字段价值。建议 R4 实现时把 R3 的 outcome 字段一并设计进 `custom_action_submitted`。
3. **排期信号**：路线图 M0 窗口是 9/14–9/30，但今天（9/13 下午）开发产出集中在词书 PRD 的 M1 迁移。若 9/14 起资源切换到冒险 M0，按 PRD 估时（R1 补尾 1d + R3 1–2d + R4 3–4d + R9 0.5–1d），**R4 最早 9/18–9/20 可用**，M1 手感验证的 realistic 起点是 9 月下旬；若资源不切换，M0 窗口整体后滑。
4. **可先行项**（不阻塞 R4）：§3 上半段的 6 类离线可算指标今天就能跑基线（一个只读 localStorage 的脚本即可），建议出一版《冒险模块基线快照》，让 R4 上线后的第一份周报有对照组。

**一句话回传**：R4 未落地（0/22），M0 完成度约 15–20% 且半天内无增量；R1 存量较好、R3/R9 未动；M1 手感验证最早 9 月下旬，前提是 9/14 起资源切回冒险 M0。
