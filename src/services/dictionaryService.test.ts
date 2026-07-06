import { describe, expect, it } from "vitest";
import { findDictionaryEntry } from "./dictionaryService";
import { makeTestData } from "./testUtils";

const makeEntry = (word: string, translation = `${word} translation`) => ({
  word,
  phonetic: `/${word}/`,
  partOfSpeech: "n.",
  definition: `${word} definition`,
  translation,
  collocations: ""
});

describe("dictionaryService", () => {
  it("falls back from common inflected forms to dictionary lemmas", () => {
    const data = makeTestData({
      dictionaryEntries: [
        makeEntry("sentence", "句子"),
        makeEntry("check", "检查"),
        makeEntry("study", "学习"),
        makeEntry("run", "跑"),
        makeEntry("create", "创造")
      ]
    });

    expect(findDictionaryEntry(data, "sentences")?.word).toBe("sentence");
    expect(findDictionaryEntry(data, "checked")?.word).toBe("check");
    expect(findDictionaryEntry(data, "studied")?.word).toBe("study");
    expect(findDictionaryEntry(data, "running")?.word).toBe("run");
    expect(findDictionaryEntry(data, "creating")?.word).toBe("create");
  });
});
