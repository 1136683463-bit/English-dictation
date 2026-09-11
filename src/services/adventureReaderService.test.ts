import { describe, expect, it } from "vitest";
import { getReadingProgress, groupAdventureSentences, splitAdventureSentences } from "./adventureReaderService";

describe("adventure reader service", () => {
  it("splits a chapter into readable sentences without dropping the last sentence", () => {
    expect(splitAdventureSentences("A bell rings. Where do you go? Take the map")).toEqual([
      "A bell rings.",
      "Where do you go?",
      "Take the map"
    ]);
  });

  it("keeps closing quotation marks with the sentence they complete", () => {
    expect(splitAdventureSentences('The note says, "Wait here." Then you listen.')).toEqual([
      'The note says, "Wait here."',
      "Then you listen."
    ]);
  });

  it("does not split a quoted line before its final punctuation", () => {
    expect(splitAdventureSentences('It says, "The key is missing. Please help before sunset." You listen.')).toEqual([
      'It says, "The key is missing. Please help before sunset."',
      "You listen."
    ]);
  });

  it("returns bounded reading progress", () => {
    expect(getReadingProgress(-1, 3)).toBe(0);
    expect(getReadingProgress(1, 3)).toBe(67);
    expect(getReadingProgress(8, 3)).toBe(100);
  });

  it("groups sentences without changing their order", () => {
    expect(groupAdventureSentences(["One.", "Two.", "Three.", "Four."], 3)).toEqual([
      ["One.", "Two.", "Three."],
      ["Four."]
    ]);
    expect(groupAdventureSentences([], 3)).toEqual([]);
  });
});
