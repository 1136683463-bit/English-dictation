# 语法三关卡埋点口径冻结（F4）

**日期**：2026-09-13
**状态**：口径已冻结，代码随 W2 F1（三关卡 schema）一起落地
**作者**：方向明（主理人）+ 开发
**依据**：prd-grammar-three-stages-2026-09-13.md §6.2 F4

---

## 0. 核实结论（W1 开工核实，推翻 PRD 两项假设）

| PRD 假设 | 核实结果 | 处置 |
|---|---|---|
| `lesson_started` 事件缺失，需补 1 行 | **已存在**：`GrammarLessonPage.tsx:375`（R21 已落地） | ✅ 关闭，不重复建设 |
| F2 hunt 错不进 SM-2（K3 断点，1 人日修复） | **断点已修复**：`huntService.ts:276 addHuntGapSentences` 结案时把「看过提示 ∪ 罪名归错」的植错点生成句子卡进 SM-2 队列（tags「语法」），`GrammarHuntPage.tsx:158-160` 调用 | ✅ 关闭，仅补口径注释（见 §3） |

**结论：F4/F2 实际工作量远低于 PRD 预估，W1 释放的产能归入 W2 F1 schema 迁移缓冲。**

---

## 1. stageIndex 编码（冻结）

三关卡上线后，所有带 `lessonId` 的 grammar 遥测事件追加可选字段 `stageIndex`：

| stageIndex | 含义 | 对应内容 |
|---|---|---|
| `1` | 关 1｜本课正课 | 现有六段式（pretest→看→跟→忆→练→产→破） |
| `2` | 关 2｜次日回访关 | 本课句型 cloze/rebuild 3–5 题 + 回马枪 1–2 题 |
| `3` | 关 3｜旧案重审关 | hunt 本课新案 + 30–50% 旧罪名变式 + 回马枪 1–2 题 |

**规则**：
- 字段可选，缺省视为 `1`（向后兼容现有全部事件，老数据无需回填）
- 适用范围：`grammar_lesson_started` / `grammar_lesson_completed` / `lesson_step_result` / `section_dwell` / `deep_dive_expanded`
- hunt 事件（`hunt_verdict` / `hunt_case_settled` / `hunt_hint_used`）**不加 stageIndex**——关 3 的 hunt 通过 `caseId` 归因即可，避免双维度交叉导致口径混乱
- `grammar_review_result` 不加 stageIndex（SM-2 复习独立于三关卡动线，sourceId 已可回溯）

## 2. 新增事件（冻结）

### 2.1 关 2 回访漏斗三事件

```typescript
/** 关 2 回访关曝光：路径页渲染出「已解锁的回访关」节点即记一条。 */
interface GrammarRevisitShownEvent {
  kind: "grammar_revisit_shown";
  lessonId: string;
  /** 解锁时刻（ISO），用于算「解锁 → 进入」延迟。 */
  unlockedAt: string;
  ts: string;
}

/** 关 2 回访关进入：用户点击进入回访关。 */
interface GrammarRevisitStartedEvent {
  kind: "grammar_revisit_started";
  lessonId: string;
  /** 距关 1 完成的小时数（回访时效性的核心指标）。 */
  hoursSinceStage1: number;
  ts: string;
}

/** 关 2 回访关完成：题做完（完成制，无正确率门槛）。 */
interface GrammarRevisitCompletedEvent {
  kind: "grammar_revisit_completed";
  lessonId: string;
  /** 一次通过题数 / 总题数（G1 提取摩擦指标：目标一次通过率 50–70%）。 */
  firstTryCount: number;
  totalCount: number;
  /** 回马枪题单独正确率（F3 效果追踪）。 */
  ambushFirstTry: boolean | null;
  durationMs: number;
  ts: string;
}
```

### 2.2 关 3 复用现有 hunt 事件

关 3 旧案重审**不新增事件**——`hunt_case_settled` 已含 caseId/found/total/solved，旧案变式的 caseId 以 `hunt-revisit-` 前缀命名即可在分析侧区分。回马枪题（huntCase 换案）同理。

### 2.3 回马枪事件（F3 追踪）

```typescript
/** 回马枪题结果（关 2/关 3 头部 1–2 题弱点加权旧点变式）。 */
interface GrammarAmbushResultEvent {
  kind: "grammar_ambush_result";
  /** 宿主关卡（lessonId#stageIndex，如 lesson-13#2）。 */
  hostId: string;
  /** 被回顾的旧课。 */
  sourceLessonId: string;
  /** 命中的弱点罪名（无弱点降级随机时为 null）。 */
  weakSpotTag: GrammarErrorTag | null;
  passed: boolean;
  attempts: number;
  ts: string;
}
```

## 3. F2 口径核对注释（关闭依据）

**R02 已覆盖的缺口信号**：`hintedTokens`（看过提示才找到）∪ `wrongTagTokens`（罪名归错）→ 结案时生成句子卡进 SM-2（`addHuntGapSentences`，幂等键 = 案件 + 罪名 + 原错词）。

**明确不覆盖的信号（设计取舍，非断点）**：
- 「一次到位找对的错」——说明本就敏锐，不必重复进队列（`huntService.ts:273` 注释明确）
- 「点了正确词犹豫后改对」——无埋点捕捉犹豫，且信号噪声大，v1 不做

**「找错」tag 残留**（`GrammarHuntPage.tsx:255`）：那是用户主动「加入生词本」的**词卡**（`addOrUpdateWordWithResult`），与 SM-2 复习队列的**句子卡**是两条独立链路，不属于 K3 断点，**不动**。

**结论：F2 关闭，零代码改动。**

## 4. 分析口径（冻结，供 D3 决策门读数）

| 指标 | 计算口径 | 目标 |
|---|---|---|
| 次日回访率 | `grammar_revisit_started`（20h ≤ hoursSinceStage1 ≤ 28h）去重 lessonId 数 ÷ 同期 `grammar_lesson_completed`（stageIndex=1）去重 lessonId 数 | ≥40% |
| 关 2 完成率 | `grammar_revisit_completed` ÷ `grammar_revisit_started` | ≥70% |
| 关 2 一次通过率 | `grammar_revisit_completed.firstTryCount ÷ totalCount` 的均值 | 50–70% |
| 回马枪正确率 | `grammar_ambush_result.passed` 比例（weakSpotTag 非 null 的子集单独看） | 观测，不设门槛 |
| 曝光→进入转化 | `grammar_revisit_started` ÷ `grammar_revisit_shown` | 观测（柔性入口效果的先行指标） |

**窗口**：D3 观测窗 10/31–11/10，任一口径样本 <30 滚动延至 11/18（路径已定）。

## 5. Non-goals

- 不改 `TELEMETRY_KEY` 键空间、不动 3000 条上限与归档策略
- 不给 hunt/diary/review 事件加 stageIndex（§1 规则）
- 不做实时看板（分析靠 `buildGrammarTelemetryExport` 导出后离线算，与现有复盘流程一致）
- 关 3 不新增事件（复用 hunt，caseId 前缀区分）
