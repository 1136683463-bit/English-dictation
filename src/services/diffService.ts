import { DiffToken, LetterDiffToken } from "../types";

const normalize = (value: string, strictPunctuation = false) => {
  const base = value
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
  if (strictPunctuation) return base;
  return base.replace(/[.,!?;:"()[\]{}]/g, "");
};

const tokenize = (value: string, strictPunctuation = false) =>
  normalize(value, strictPunctuation)
    .split(" ")
    .map((token) => token.trim())
    .filter(Boolean);

const distance = (a: string, b: string) => {
  const dp = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[a.length][b.length];
};

const isNearSpelling = (a: string, b: string) => {
  if (a.length <= 2 || b.length <= 2) return false;
  const edits = distance(a, b);
  return edits === 1 || edits / Math.max(a.length, b.length) <= 0.25;
};

export const compareText = (expected: string, answer: string, strictPunctuation = false): DiffToken[] => {
  const expectedTokens = tokenize(expected, strictPunctuation);
  const answerTokens = tokenize(answer, strictPunctuation);
  const result: DiffToken[] = [];
  let i = 0;
  let j = 0;

  while (i < expectedTokens.length || j < answerTokens.length) {
    const expectedToken = expectedTokens[i];
    const answerToken = answerTokens[j];

    if (expectedToken && answerToken && expectedToken === answerToken) {
      result.push({ token: answerToken, expected: expectedToken, status: "match" });
      i += 1;
      j += 1;
      continue;
    }

    if (expectedToken && answerToken && isNearSpelling(expectedToken, answerToken)) {
      result.push({ token: answerToken, expected: expectedToken, status: "spelling" });
      i += 1;
      j += 1;
      continue;
    }

    if (expectedToken && answerTokens[j + 1] === expectedToken) {
      result.push({ token: answerToken, status: "extra" });
      j += 1;
      continue;
    }

    if (answerToken && expectedTokens[i + 1] === answerToken) {
      result.push({ token: expectedToken, expected: expectedToken, status: "missing" });
      i += 1;
      continue;
    }

    if (expectedToken && answerToken) {
      result.push({ token: answerToken, expected: expectedToken, status: "substitution" });
      i += 1;
      j += 1;
      continue;
    }

    if (expectedToken) {
      result.push({ token: expectedToken, expected: expectedToken, status: "missing" });
      i += 1;
    } else if (answerToken) {
      result.push({ token: answerToken, status: "extra" });
      j += 1;
    }
  }

  return result;
};

export const diffScore = (tokens: DiffToken[]) => {
  if (tokens.length === 0) return 0;
  const matched = tokens.filter((token) => token.status === "match").length;
  const spelling = tokens.filter((token) => token.status === "spelling").length;
  return Math.round(((matched + spelling * 0.5) / tokens.length) * 100);
};

export const normalizeSpelling = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/\s+/g, "");

export const compareLetters = (expected: string, answer: string): LetterDiffToken[] => {
  const expectedChars = normalizeSpelling(expected).split("");
  const answerChars = normalizeSpelling(answer).split("");
  const result: LetterDiffToken[] = [];
  let i = 0;
  let j = 0;

  while (i < expectedChars.length || j < answerChars.length) {
    const expectedChar = expectedChars[i];
    const answerChar = answerChars[j];

    if (expectedChar && answerChar && expectedChar === answerChar) {
      result.push({ char: answerChar, expected: expectedChar, status: "match" });
      i += 1;
      j += 1;
      continue;
    }

    if (
      expectedChar &&
      answerChar &&
      expectedChars[i + 1] &&
      answerChars[j + 1] &&
      expectedChar === answerChars[j + 1] &&
      expectedChars[i + 1] === answerChar
    ) {
      result.push({ char: answerChar, expected: expectedChar, status: "substitution" });
      result.push({ char: answerChars[j + 1], expected: expectedChars[i + 1], status: "substitution" });
      i += 2;
      j += 2;
      continue;
    }

    if (expectedChar && answerChars[j + 1] === expectedChar) {
      result.push({ char: answerChar, status: "extra" });
      j += 1;
      continue;
    }

    if (answerChar && expectedChars[i + 1] === answerChar) {
      result.push({ char: expectedChar, expected: expectedChar, status: "missing" });
      i += 1;
      continue;
    }

    if (expectedChar && answerChar) {
      result.push({ char: answerChar, expected: expectedChar, status: "substitution" });
      i += 1;
      j += 1;
      continue;
    }

    if (expectedChar) {
      result.push({ char: expectedChar, expected: expectedChar, status: "missing" });
      i += 1;
    } else if (answerChar) {
      result.push({ char: answerChar, status: "extra" });
      j += 1;
    }
  }

  return result;
};
