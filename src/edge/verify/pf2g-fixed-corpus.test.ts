// @vitest-environment node
/**
 * PF2g · 固定题库（课程 / 案件 / 卡片库）侧的扫描成本（2026-09-22）
 *
 * 这一组**不随用户使用增长**（197 课 / 206 案 / 内置词典），但也存在二次调用与重复建索引；
 * 量出来是为了把它们与「真正的用户规模问题」区分开——它们不会随时间恶化。
 */
import { describe, expect, it } from "vitest";
import { scaleData, timeMedian } from "./pf2Scale";
import { hasUnlockedHuntCase, listHuntCasesWithLock, summarizeHuntProgress } from "../../services/huntService";
import { listDueGrammarReviewCards, summarizeGrammarMastery } from "../../services/grammarReviewService";
import { getLearningStats } from "../../services/reviewService";
import { huntCases } from "../../data/huntCases";
import { GRAMMAR_LESSON_BY_ID, grammarLessons } from "../../data/grammarLessons";

const report = (label: string, ms: number) => console.log(`  ${label.padEnd(58)} ${ms.toFixed(3).padStart(9)}ms`);

describe("PF2g · 固定题库规模", () => {
  it("题库规模基线", () => {
    console.log(
      `\n[PF2g] 内置题库规模（不随用户增长）\n` +
        `  课程 grammarLessons: ${grammarLessons.length}\n` +
        `  案件 huntCases:       ${huntCases.length}\n` +
        `  课程内 huntCaseIds 引用总数: ${grammarLessons.reduce((sum, lesson) => sum + (lesson.huntCaseIds?.length ?? 0), 0)}\n` +
        `  案件错误点总数:        ${huntCases.reduce((sum, item) => sum + item.errors.length, 0)}\n` +
        `  课程 id 索引表大小:     ${GRAMMAR_LESSON_BY_ID.size}`
    );
    expect(grammarLessons.length).toBeGreaterThan(0);
  });

  it("listHuntCasesWithLock：206 案 × 197 课的反查（O(cases × lessons)）", () => {
    const data = scaleData({ cards: 200 });
    const ms = timeMedian(() => listHuntCasesWithLock(data), 3);
    const lockMs = timeMedian(() => hasUnlockedHuntCase(data), 3);
    console.log(`\n[PF2g] 侦探案件锁（huntService.ts:99）`);
    report(`listHuntCasesWithLock（${huntCases.length} 案 × ${grammarLessons.length} 课 find）`, ms);
    report(`hasUnlockedHuntCase（内部再跑一遍 listHuntCasesWithLock）`, lockMs);
    console.log(
      `  → findUnlockLesson（huntService.ts:80）对每个案件线性扫全部课程 → O(cases × lessons) = ${huntCases.length} × ${grammarLessons.length}。\n` +
        `     两者都不随用户数据增长（题库固定），且 GrammarHuntPage 有 useMemo（:43/45）——P2 级。`
    );
    expect(ms).toBeGreaterThanOrEqual(0);
  });

  it("summarizeHuntProgress：206 案 × 全部结算是 some 嵌套（O(cases × results)）", () => {
    // 用户在侦探里累计的结算记录会随使用增长 → 这一项**会**随用户规模恶化
    const rows: Array<{ results: number; ms: number }> = [];
    for (const results of [10, 100, 500, 2000]) {
      const data = scaleData({ cards: 200 });
      data.huntResults = Array.from({ length: results }, (_, index) => ({
        id: `hr-${index}`,
        caseId: huntCases[index % huntCases.length].id,
        found: 0,
        total: huntCases[index % huntCases.length].errors.length,
        misses: 0,
        stars: 0,
        settledAt: new Date(Date.now() - index * 60_000).toISOString()
      })) as never;
      const ms = timeMedian(() => summarizeHuntProgress(data), 3);
      rows.push({ results, ms });
    }
    console.log(
      `\n[PF2g] summarizeHuntProgress（huntService.ts:427）随侦探结算数增长\n` +
        rows.map((row) => `  ${String(row.results).padStart(5)} 条结算  ${row.ms.toFixed(3).padStart(8)}ms`).join("\n") +
        `\n  → huntService.ts:432 对每个案件都 data.huntResults.some(...) → O(cases × results)。\n` +
        `     案件数固定 206，但**结算数随用户破案次数增长**，且每次破案都会 push（huntService.ts:267）。\n` +
        `     2000 条结算时 ${rows[3].ms.toFixed(2)}ms —— 目前仍便宜（some 提前返回），列 P2。`
    );
    expect(rows.length).toBe(4);
  });

  it("课程侧：summarizeGrammarMastery / listDueGrammarReviewCards 在「课程完成度」维度上的成本", () => {
    const data = scaleData({ cards: 5000, unitCount: 20 });
    const mastery = timeMedian(() => summarizeGrammarMastery(data), 3);
    const due = timeMedian(() => listDueGrammarReviewCards(data), 3);
    const stats = timeMedian(() => getLearningStats(data), 3);
    console.log(`\n[PF2g] 复习相关（5000 卡 / 2000 语法卡）`);
    report("summarizeGrammarMastery", mastery);
    report("listDueGrammarReviewCards", due);
    report("getLearningStats", stats);
    console.log(
      `  → 三者都是单遍 + 一个 Map 索引，线性；GrammarReviewPage 有 useMemo（:47）、\n` +
        `     buildGrammarReviewSession 只在 useState 初值里跑一次（:52，进入页面时组一次会话）。\n` +
        `     这条路径在 20000 卡时仍 < 16ms（PF2a 实测 buildGrammarReviewSession 11.5ms）。`
    );
    expect(mastery).toBeGreaterThanOrEqual(0);
  });
});
