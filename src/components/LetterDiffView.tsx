import { LetterDiffToken } from "../types";

export default function LetterDiffView({ tokens }: { tokens: LetterDiffToken[] }) {
  if (tokens.length === 0) return null;

  return (
    <div className="letter-diff-view">
      {tokens.map((token, index) => (
        <span key={`${token.char}-${index}`} className={`letter-token ${token.status}`}>
          {token.status === "missing" ? token.expected : token.char}
          {token.status === "substitution" && token.expected && <small>{token.expected}</small>}
        </span>
      ))}
    </div>
  );
}
