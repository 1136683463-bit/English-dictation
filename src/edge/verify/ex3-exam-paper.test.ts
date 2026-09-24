// @vitest-environment node
/**
 * EX3 · 试卷生成与轮转（P0-2）
 *
 * 规格：PRD §4.1 配比 ｜ §4.3 覆盖闸与套数 ｜ §12.1 G11（覆盖）/ G12（去重）
 *
 * 本文件先做**诊断输出**再断言：第 1 季能否真出 5 套不重复且覆盖全 label 的卷，
 * 是数析按池子算出来的**推导**（84 条选择池 / 18 条一套 ⇒ 5 套），
 * 必须由生成器实测确认，不能拿推导当结论。
 */
import { describe, expect, it } from "vitest";
import { buildExamPaper, STANDARD_SHAPE } from "../../services/grammarExamPaperService";

const VARIANTS = 5;
const objectiveKinds = new Set(["mcq", "cloze", "zh2en"]);
const papers = Array.from({ length: VARIANTS }, (_, index) =>
  buildExamPaper({ seasonId: "season-1", variantIndex: index, variantCount: VARIANTS })
);

describe("EX3 第 1 季试卷生成", () => {
  it("诊断：逐套卷的配比 / 覆盖 / 耗时 / 诊断项", () => {
    for (const paper of papers) {
      console.log(
        `${paper.paperId} shape=${JSON.stringify(paper.shape)} 代表课=${paper.coverage.representativeLessons} label=${paper.coverage.grammarLabels.length} 预计=${paper.estimateMinutes}min 诊断=${paper.diagnostics.length === 0 ? "无" : paper.diagnostics.join(" | ")}`
      );
    }
    const allIds = papers.flatMap((paper) => paper.items.map((item) => item.id));
    console.log(`五套合计题数=${allIds.length} 去重后=${new Set(allIds).size}（相等=无跨卷重复）`);
    console.log(`节耗时: ${papers[0].sections.map((s) => `${s.index}:${s.itemIds.length}题/${s.estimateMinutes}min`).join("  ")}`);
  });

  it("G11 覆盖：每套卷都覆盖本季全部 grammarLabel，且题源只来自本季", () => {
    for (const paper of papers) {
      expect(paper.diagnostics, `${paper.paperId} 生成诊断非空：${paper.diagnostics.join(" | ")}`).toEqual([]);
      expect(paper.coverage.grammarLabels.length, `${paper.paperId} 未覆盖全部 label`).toBe(12);
      for (const item of paper.items) {
        if (!item.sourceLessonId) continue; // 阅读/写作来自内容资产，不绑课
        expect(item.sourceLessonNumber, `题源越季：${item.id}`).toBeGreaterThanOrEqual(1);
        expect(item.sourceLessonNumber).toBeLessThanOrEqual(12);
      }
    }
  });

  it("配比：标准卷 = 10 选择 + 6 填空 + 4 翻译 + 1 篇 4 题阅读 + 1 写作（25 题）", () => {
    for (const paper of papers) {
      expect(paper.shape.mcq).toBe(STANDARD_SHAPE.mcq);
      expect(paper.shape.cloze).toBe(STANDARD_SHAPE.cloze);
      expect(paper.shape.zh2en).toBe(STANDARD_SHAPE.zh2en);
      expect(paper.shape.read).toBe(STANDARD_SHAPE.read);
      expect(paper.shape.write).toBe(STANDARD_SHAPE.write);
      expect(paper.items.length).toBe(25);
    }
  });

  it("G12 去重：同一 itemId 不出现在两张卷里（**限客观题**，阅读写作的例外见下一条）", () => {
    const seen = new Map<string, string[]>();
    for (const paper of papers) {
      for (const item of paper.items) {
        if (!objectiveKinds.has(item.kind)) continue;
        const owners = seen.get(item.id) ?? [];
        owners.push(paper.paperId);
        seen.set(item.id, owners);
      }
    }
    const duplicated = [...seen.entries()].filter(([, owners]) => owners.length > 1);
    expect(
      duplicated.slice(0, 5).map(([id, owners]) => `${id} 出现在 ${owners.join(" / ")}`),
      "跨卷重复的客观题"
    ).toEqual([]);
  });

  /**
   * **已登记的 v1 限定：阅读与写作不随重考轮换。**
   *
   * 为什么把它写成断言而不是省略：PRD §4.3 的「第 1 季可出 5 套」是数析按
   * 「选择池 84 / 每套 18 条」**推算**的，而那条推算**只覆盖客观题**。
   * 阅读短文与写作题是每季新写的素材（全仓原本 `passage` = 0），v1 只写了 1 篇短文 + 1 个写作任务，
   * 所以它们在 5 套卷里逐字相同——客观题能轮换，阅读写作不能。
   *
   * 后果（照实说）：重考时 20 道客观题是全新的，但阅读 4 题与写作 1 题会原样再来一遍。
   * 这与 PRD Q7「重考换卷」的默认处置**部分不符**，因此登记为 v1 限定 + 待办
   * （为第 1 季补 2 篇短文即可让重考完全新鲜，按 §8.4 约 0.2–0.3 人日/篇）。
   * 若这条断言红了，说明有人补齐了短文池——那是好事：把限定与断言一起改掉。
   */
  it("【已登记的 v1 限定】阅读 4 题与写作 1 题在 5 套卷里相同", () => {
    const nonObjectiveIds = papers[0].items
      .filter((item) => item.kind === "read" || item.kind === "write")
      .map((item) => item.id);
    expect(nonObjectiveIds.length, "阅读 4 题 + 写作 1 题").toBe(5);
    for (const id of nonObjectiveIds) {
      const count = papers.filter((paper) => paper.items.some((item) => item.id === id)).length;
      expect(count, `${id} 应出现在全部 ${VARIANTS} 套卷里（v1 限定：阅读写作不轮换）`).toBe(VARIANTS);
    }
  });

  it("确定性：同参数重复生成得到完全相同的卷（可回放）", () => {
    const again = buildExamPaper({ seasonId: "season-1", variantIndex: 0, variantCount: VARIANTS });
    expect(JSON.stringify(again)).toBe(JSON.stringify(papers[0]));
  });

  it("三节结构与耗时：节归属固定，全卷预计落在 20–40 分钟", () => {
    for (const paper of papers) {
      expect(paper.sections.map((s) => s.index)).toEqual([1, 2, 3]);
      const s1 = paper.items.filter((i) => i.section === 1);
      const s2 = paper.items.filter((i) => i.section === 2);
      const s3 = paper.items.filter((i) => i.section === 3);
      expect(s1.every((i) => i.kind === "mcq" || i.kind === "cloze")).toBe(true);
      expect(s2.every((i) => i.kind === "zh2en" || i.kind === "read")).toBe(true);
      expect(s3.every((i) => i.kind === "write")).toBe(true);
      expect(paper.estimateMinutes, `预计耗时 ${paper.estimateMinutes} 分钟落在 20–40 之外`).toBeGreaterThanOrEqual(20);
      expect(paper.estimateMinutes).toBeLessThanOrEqual(40);
    }
  });

  it("翻译题绝不携带 tokens（否则等于把答案发给考生）", () => {
    for (const paper of papers) {
      for (const item of paper.items.filter((i) => i.kind === "zh2en")) {
        expect("tokens" in item, `翻译题不得带 tokens：${item.id}`).toBe(false);
        expect(item.answer.trim().split(/\s+/).length, `翻译题答案过短：${item.id}`).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("选择/填空的正确答案必须在选项里，且选项无重复", () => {
    for (const paper of papers) {
      for (const item of paper.items.filter((i) => i.kind === "mcq" || i.kind === "cloze" || i.kind === "read")) {
        const options = item.options ?? [];
        expect(options.length, `${item.id} 选项过少`).toBeGreaterThanOrEqual(2);
        expect(options.some((o) => o.id === item.answerId), `${item.id} 的 answerId 不在选项里`).toBe(true);
        const texts = options.map((o) => o.en.trim().toLowerCase());
        expect(new Set(texts).size, `${item.id} 选项有重复：${texts.join(" / ")}`).toBe(texts.length);
      }
    }
  });
});
