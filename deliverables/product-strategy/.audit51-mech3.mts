/** 修正机制 C 的探测（去掉 interpolate bug），并验证是否真产生重复 */
import { huntCases } from "../../src/data/huntCases";
import { correctedSentenceOf } from "../../src/services/huntService";
const CJK = /[\u4e00-\u9fff]/;
const words = (s: string) => s.trim().split(/\s+/).filter(Boolean);
const strip = (s: string) => s.replace(/[.,!?;:]+$/, "").toLowerCase();
let C = 0; const rows: string[] = [];
for (const hc of huntCases) {
  const out = correctedSentenceOf(hc);
  for (const e of hc.errors) {
    const c = (e.correction ?? "").trim();
    if (CJK.test(c)) continue;
    const corr = words(c), orig = words(e.original);
    if (corr.length < 2 || orig.length !== 1) continue;
    const extra = corr.map(strip).filter((w) => w !== strip(e.original));
    const near = hc.tokens.slice(Math.max(0, e.tokenIndex - 2), e.tokenIndex + 3).map(strip);
    if (!extra.some((w) => near.includes(w))) continue;
    C += 1;
    const dupRe = /\b([A-Za-z']+)\s+\1\b/i.exec(out);
    rows.push(`${hc.id}#${e.tokenIndex}  "${e.original}"→"${c}"\n     邻域: [${hc.tokens.slice(Math.max(0, e.tokenIndex - 2), e.tokenIndex + 3).join(" ")}]\n     得句: ${out}${dupRe ? `\n     ⚠ 含相邻重复: "${dupRe[0]}"` : ""}`);
  }
}
console.log(`机制 C 候选 ${C} 处：\n`); rows.forEach((r) => console.log("  • " + r + "\n"));
const setC = new Set(rows.map((r) => r.split("#")[0]));
console.log(`涉及案件 ${setC.size} 个: ${Array.from(setC).join(", ")}`);
