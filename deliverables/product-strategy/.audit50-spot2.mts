import { grammarLessons } from "../../src/data/grammarLessons";
const clean = (t: string) => t.replace(/[.,!?;:'"]/g, "").toLowerCase();
let rawDiff = 0;
for (const l of grammarLessons) for (const g of l.guided ?? []) {
  if (g.kind !== "spot") continue;
  const a = (g.answer ?? "").trim(), wt = (g.wrongToken ?? "").trim();
  if (a.toLowerCase() !== wt.toLowerCase()) {
    rawDiff += 1;
    console.log(`RAW-DIFF ${l.id}(L${l.number}) answer="${a}" wrongToken="${wt}" tokens=${JSON.stringify(g.tokens)} correctionZh="${g.correctionZh}"`);
  }
}
console.log("raw(case-insensitive) 不同 =", rawDiff);

const arrangeBad: string[] = [];
for (const l of grammarLessons) for (const g of l.guided ?? []) {
  if (g.kind !== "arrange") continue;
  const ts = (g.tokens ?? []).map(clean).sort().join(" ");
  const as = (g.answer ?? "").split(/\s+/).filter(Boolean).map(clean).sort().join(" ");
  if (ts !== as) arrangeBad.push(`${l.id}(L${l.number}) answer="${g.answer}" tokens=${JSON.stringify(g.tokens)}`);
}
console.log("arrange 题 answer 与 tokens 多重集不一致 =", arrangeBad.length);
arrangeBad.slice(0, 10).forEach((s) => console.log("   " + s));

// 对照卡里 wrongMark 与 whyZh【】都为空/不一致的极端统计
let whyNoBracket = 0, whyBracket = 0;
for (const l of grammarLessons) for (const c of l.contrast ?? []) { if (c.whyZh.includes("【")) whyBracket += 1; else whyNoBracket += 1; }
console.log(`对照卡 whyZh：含【】${whyBracket} 张，不含 ${whyNoBracket} 张`);
