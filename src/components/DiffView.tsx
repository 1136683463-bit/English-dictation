import { DiffToken } from "../types";

export default function DiffView({ tokens }: { tokens: DiffToken[] }) {
  if (tokens.length === 0) return null;
  return (
    <div className="diff-view">
      {tokens.map((token, index) => (
        <span key={`${token.token}-${index}`} className={`diff-token ${token.status}`}>
          {token.status === "missing" ? token.expected : token.token}
          {token.status === "spelling" && token.expected && <small>({token.expected})</small>}
          {token.status === "substitution" && token.expected && <small>({token.expected})</small>}
        </span>
      ))}
    </div>
  );
}
