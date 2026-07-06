import { describe, expect, it } from "vitest";
import { buildWordImportPreview, parseCsvRows, parseWordImportRows, splitIntoSentences } from "./importService";
import { makeTestData } from "./testUtils";

describe("importService", () => {
  it("parses CSV with quoted commas", () => {
    expect(parseCsvRows('word,translation\ncontext,"语境, 上下文"')).toEqual([
      ["word", "translation"],
      ["context", "语境, 上下文"]
    ]);
  });

  it("parses compact text rows and marks duplicates", () => {
    const rows = parseWordImportRows(makeTestData(), "freshword 新鲜词\nfreshword 新词\n12345", "text");
    const preview = buildWordImportPreview(makeTestData(), rows);

    expect(preview.stats.new).toBe(1);
    expect(preview.stats.duplicate).toBe(1);
    expect(preview.stats.invalid).toBe(1);
    expect(preview.importableRows[0].input.translation).toBe("新鲜词");
  });

  it("splits text into sentence candidates", () => {
    expect(splitIntoSentences("One sentence. Another one?\nFinal line!")).toHaveLength(3);
  });
});
