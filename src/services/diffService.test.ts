import { describe, expect, it } from "vitest";
import { compareLetters } from "./diffService";

describe("diffService", () => {
  it("treats adjacent swapped letters as substitutions", () => {
    expect(compareLetters("predict", "perdict").map((token) => token.status)).toEqual([
      "match",
      "substitution",
      "substitution",
      "match",
      "match",
      "match",
      "match"
    ]);
  });
});
