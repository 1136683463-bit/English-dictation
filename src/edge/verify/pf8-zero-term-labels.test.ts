// @vitest-environment node
/**
 * PF8 · 罪名短名与全库讲解必须零术语（2026-09-22 修，红线）
 *
 * 零术语是项目的硬约束（用户可见文案不得出现
 * 主语/复数/时态/三单/原形/可数/疑问句/否定句/语序/比较级/最高级/从句）。
 *
 * 此前 `GRAMMAR_ERROR_TAG_LABELS` 有 5 个含术语：
 *   时态变形（时态）／单复数（复数）／介词（介词）／语序（语序）／比较级（比较级）。
 * 它们**直接渲染**（罪名按钮粗体行、复盘课标签、日记批改标签），
 * 且被写进持久化的 `grammarNote` —— 全库 776 处讲解里 **376 处**因此命中红线（48.5%）。
 *
 * 与 `GRAMMAR_ERROR_TAG_PLAIN` 的差别：PLAIN 是长句解释（早已清理），
 * LABELS 是短标签——后者此前被漏掉了。
 */
import { describe, expect, it } from "vitest";
import { huntCases } from "../../data/huntCases";
import { GRAMMAR_ERROR_TAG_LABELS, GRAMMAR_ERROR_TAG_PLAIN } from "../../services/huntService";
import { findZeroTermHits } from "../../data/grammarZeroTerms";

describe("PF8 罪名文案零术语", () => {
  it("11 个罪名短名全部零术语", () => {
    const offenders = Object.entries(GRAMMAR_ERROR_TAG_LABELS)
      .map(([tag, label]) => ({ tag, label, hits: findZeroTermHits(label) }))
      .filter((entry) => entry.hits.length > 0)
      .map((entry) => `${entry.tag}: "${entry.label}" → [${entry.hits.join(",")}]`);
    expect(offenders, `以下短名含术语：\n${offenders.join("\n")}`).toEqual([]);
  });

  it("11 个罪名大白话解释全部零术语（防回归）", () => {
    const offenders = Object.entries(GRAMMAR_ERROR_TAG_PLAIN)
      .map(([tag, plain]) => ({ tag, plain, hits: findZeroTermHits(plain) }))
      .filter((entry) => entry.hits.length > 0)
      .map((entry) => `${entry.tag}: "${entry.plain}" → [${entry.hits.join(",")}]`);
    expect(offenders, `以下解释含术语：\n${offenders.join("\n")}`).toEqual([]);
  });

  it("全库 hunt 讲解（持久化的 grammarNote 文本）零术语", () => {
    const offenders: string[] = [];
    let total = 0;
    for (const huntCase of huntCases) {
      for (const error of huntCase.errors) {
        total += 1;
        // 复刻 huntService 生成 grammarNote 的格式
        const note = `${GRAMMAR_ERROR_TAG_LABELS[error.tag]}：${error.original} → ${error.correction}。${error.explanation}`;
        const hits = findZeroTermHits(note);
        if (hits.length > 0) offenders.push(`${huntCase.id}: [${hits.join(",")}] ${note.slice(0, 60)}`);
      }
    }
    expect(total, "应扫到全部讲解").toBeGreaterThan(700);
    expect(
      offenders.length,
      `全库 ${total} 处讲解里 ${offenders.length} 处含术语：\n${offenders.slice(0, 8).join("\n")}`
    ).toBe(0);
  });

  it("案件标题零术语（防止新增案件带回术语）", () => {
    const offenders = huntCases
      .filter((huntCase) => findZeroTermHits(huntCase.title).length > 0)
      .map((huntCase) => `${huntCase.id}: ${huntCase.title}`);
    expect(offenders, `以下案件标题含术语：\n${offenders.join("\n")}`).toEqual([]);
  });
});
