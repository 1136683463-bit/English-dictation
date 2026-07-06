import { LetterDiffToken } from "../types";

const statusLabel: Record<LetterDiffToken["status"], string> = {
  match: "正确",
  missing: "漏写",
  extra: "多写",
  substitution: "写错"
};

const isAdjacentSwap = (tokens: LetterDiffToken[], index: number) => {
  const current = tokens[index];
  const next = tokens[index + 1];
  return (
    current?.status === "substitution" &&
    next?.status === "substitution" &&
    current.expected === next.char &&
    next.expected === current.char
  );
};

const countIssueGroups = (tokens: LetterDiffToken[]) => {
  let count = 0;
  for (let index = 0; index < tokens.length; index += 1) {
    if (tokens[index].status === "match") continue;
    count += 1;
    if (isAdjacentSwap(tokens, index)) index += 1;
  }
  return count;
};

const getFirstIssueText = (tokens: LetterDiffToken[]) => {
  const issueIndex = tokens.findIndex((token) => token.status !== "match");
  const issue = tokens[issueIndex];
  if (!issue) return "拼写已经匹配。";

  if (isAdjacentSwap(tokens, issueIndex)) {
    const next = tokens[issueIndex + 1];
    return `字母顺序反了：你写成 ${issue.char}${next.char}，应为 ${issue.expected}${next.expected}。`;
  }

  if (issue.status === "substitution") {
    return `你写成 ${issue.char}，这里应为 ${issue.expected}。`;
  }
  if (issue.status === "missing") {
    return `少写了 ${issue.expected}。`;
  }
  if (issue.status === "extra") {
    return `多写了 ${issue.char}。`;
  }
  return "这里需要再看一眼。";
};

const expectedCell = (token: LetterDiffToken) =>
  token.status === "extra" ? "-" : token.expected ?? token.char;

const answerCell = (token: LetterDiffToken) =>
  token.status === "missing" ? "-" : token.char;

const compactIssueText = (tokens: LetterDiffToken[]) => {
  const issues = tokens
    .map((token, index) => {
      if (token.status === "match") return null;
      if (isAdjacentSwap(tokens, index)) {
        const next = tokens[index + 1];
        return { key: `swap-${index}`, text: `${token.char}${next.char} -> ${token.expected}${next.expected}`, skipNext: true };
      }
      if (token.status === "substitution") return { key: `sub-${index}`, text: `${token.char} -> ${token.expected}` };
      if (token.status === "missing") return { key: `missing-${index}`, text: `补 ${token.expected}` };
      if (token.status === "extra") return { key: `extra-${index}`, text: `删 ${token.char}` };
      return null;
    })
    .filter((item): item is { key: string; text: string; skipNext?: boolean } => Boolean(item));

  const compacted: Array<{ key: string; text: string }> = [];
  for (let index = 0; index < issues.length; index += 1) {
    compacted.push({ key: issues[index].key, text: issues[index].text });
    if (issues[index].skipNext) index += 1;
  }
  return compacted;
};

export default function SpellingErrorReview({
  expected,
  answer,
  tokens
}: {
  expected: string;
  answer: string;
  tokens: LetterDiffToken[];
}) {
  const issues = tokens.filter((token) => token.status !== "match");
  const issueCount = countIssueGroups(tokens);
  const issueTexts = compactIssueText(tokens);

  return (
    <div className="spelling-error-review">
      <div className="spelling-error-summary">
        <span>{issueCount} 处需要修改</span>
        <strong>{getFirstIssueText(tokens)}</strong>
        <p>
          正确拼写是 <b>{expected}</b>
          {answer.trim() ? `，你的答案是 ${answer.trim()}。` : "，你还没有输入答案。"}
        </p>
      </div>

      <div className="spelling-compare-grid" aria-label="拼写对照">
        <span>正确</span>
        <div>
          {tokens.map((token, index) => (
            <em key={`expected-${token.char}-${index}`} className={`letter-token expected ${token.status}`}>
              {expectedCell(token)}
            </em>
          ))}
        </div>
        <span>你的</span>
        <div>
          {tokens.map((token, index) => (
            <em key={`answer-${token.char}-${index}`} className={`letter-token answer ${token.status}`}>
              {answerCell(token)}
            </em>
          ))}
        </div>
      </div>

      {issueTexts.length > 0 && (
        <div className="spelling-error-chips" aria-label="修改提示">
          {issueTexts.slice(0, 4).map((issue) => <span key={issue.key}>{issue.text}</span>)}
        </div>
      )}

      <div className="spelling-error-legend" aria-label="错误类型说明">
        {Array.from(new Set(issues.map((token) => token.status))).map((status) => (
          <span key={status}>{statusLabel[status]}</span>
        ))}
      </div>
    </div>
  );
}
