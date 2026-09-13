import { describe, expect, it } from "vitest";
import { builtinUnitIdFor, installBuiltinBook, isBuiltinPackInstalled } from "./builtinBookService";
import { BUILTIN_BOOK_PACKS, type BuiltinBookPack } from "../data/builtinBooks";
import { makeTestData, makeUnit } from "./testUtils";

const miniPack: BuiltinBookPack = {
  id: "mini",
  title: "测试精选 3",
  description: "测试用",
  color: "#3157d5",
  words: [
    { word: "apple", translation: "苹果" },
    { word: "banana", translation: "香蕉" },
    { word: "grape", translation: "葡萄" }
  ]
};

describe("builtinBookService（PRD-wordbook-v2 P2-3 内置精选词书）", () => {
  it("装入词书包：创建确定性 id 词书 + 全部单词入库", async () => {
    const result = await installBuiltinBook(makeTestData({}), miniPack);

    expect(result.installed).toBe(true);
    expect(result.wordCount).toBe(3);
    const unit = result.data.units.find((item) => item.id === "builtin-mini");
    expect(unit).toBeDefined();
    expect(unit?.title).toBe("测试精选 3");
    expect(unit?.color).toBe("#3157d5");
    const cards = result.data.cards.filter((card) => card.unitId === unit?.id);
    expect(cards).toHaveLength(3);
    expect(cards.map((card) => card.front).sort()).toEqual(["apple", "banana", "grape"]);
    expect(cards[0].tags).toContain("内置精选");
    // 释义以词书包为准
    expect(cards.find((card) => card.front === "apple")?.back).toBe("苹果");
  });

  it("幂等：重复装入同一包直接跳过，数据原样返回", async () => {
    const first = await installBuiltinBook(makeTestData({}), miniPack);
    expect(isBuiltinPackInstalled(first.data, "mini")).toBe(true);

    const second = await installBuiltinBook(first.data, miniPack);
    expect(second.installed).toBe(false);
    expect(second.wordCount).toBe(0);
    expect(second.data).toBe(first.data);
    expect(second.data.units).toHaveLength(1);
  });

  it("空包不创建任何内容", async () => {
    const empty: BuiltinBookPack = { ...miniPack, id: "empty", words: [] };
    const initial = makeTestData({});
    const result = await installBuiltinBook(initial, empty);

    expect(result.installed).toBe(false);
    expect(result.data).toBe(initial);
  });

  it("装入后 order 接在现有词书之后", async () => {
    const initial = makeTestData({ units: [makeUnit({ id: "u1", order: 7 })] });
    const result = await installBuiltinBook(initial, miniPack);

    expect(result.data.units.find((unit) => unit.id === "builtin-mini")?.order).toBe(8);
  });

  it("内置词书包数据：三包互不重复、每包 30 词", () => {
    expect(BUILTIN_BOOK_PACKS).toHaveLength(3);
    const seen = new Set<string>();
    for (const pack of BUILTIN_BOOK_PACKS) {
      expect(pack.words).toHaveLength(30);
      for (const word of pack.words) {
        const normalized = word.word.toLowerCase();
        expect(seen.has(normalized)).toBe(false);
        seen.add(normalized);
        expect(word.translation.trim()).not.toBe("");
      }
    }
  });

  it("builtinUnitIdFor 稳定", () => {
    expect(builtinUnitIdFor("cet4")).toBe("builtin-cet4");
  });
});
