/**
 * 第 50 批 · 修正报告用数：【】 里装的是「要补进去的」还是「要换掉的」？
 * 只读。运行：./node_modules/.bin/vite-node deliverables/product-strategy/.audit50-bracket.mts
 */
import { grammarLessons } from "../../src/data/grammarLessons";

const norm = (s: unknown) => String(s ?? "").toLowerCase().replace(/[^a-z0-9' ]/g, " ").replace(/\s+/g, " ").trim();
const toks = (s: unknown) => norm(s).split(" ").filter(Boolean);
const editScript = (a: string[], b: string[]) => {
  const n = a.length, m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i -= 1)
    for (let j = m - 1; j >= 0; j -= 1)
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const D: string[] = [], I: string[] = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { i += 1; j += 1; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { D.push(a[i]); i += 1; }
    else { I.push(b[j]); j += 1; }
  }
  while (i < n) { D.push(a[i]); i += 1; }
  while (j < m) { I.push(b[j]); j += 1; }
  return { D, I };
};

let cardsWithBracket = 0, occ = 0;
let hitI = 0, hitD = 0, hitBoth = 0, hitNeither = 0;
const ex: Record<string, string[]> = {};
for (const l of grammarLessons) {
  (l.contrast ?? []).forEach((c, idx) => {
    if (!c.whyZh.includes("【")) return;
    cardsWithBracket += 1;
    const { D, I } = editScript(toks(c.wrong), toks(c.correct));
    for (const m of c.whyZh.matchAll(/【([^】]*)】/g)) {
      const inner = m[1];
      occ += 1;
      if (inner === ",") { /* 纯标点补入 */ }
      const mw = toks(inner);
      if (mw.length === 0) { hitNeither += 1; continue; }
      const pI = [...I], pD = [...D];
      let i2 = 0, d2 = 0;
      for (const w of mw) { const at = pI.indexOf(w); if (at >= 0) { i2 += 1; pI.splice(at, 1); } }
      for (const w of mw) { const at = pD.indexOf(w); if (at >= 0) { d2 += 1; pD.splice(at, 1); } }
      const k = i2 > 0 && d2 > 0 ? "两者皆是" : i2 > 0 ? "只对应『要补进去的』" : d2 > 0 ? "只对应『要换掉的』" : "都不对应";
      if (k === "只对应『要补进去的』") hitI += 1;
      else if (k === "只对应『要换掉的』") hitD += 1;
      else if (k === "两者皆是") hitBoth += 1;
      else hitNeither += 1;
      (ex[k] ??= []).push(`L${l.number} ${l.id}[${idx}] 【${inner}】 D=[${D.join(" ")}] I=[${I.join(" ")}]  ❌"${c.wrong}"  ✅"${c.correct}"`);
    }
  });
}
console.log(`含【】的对照卡 = ${cardsWithBracket}；【】 处数 = ${occ}\n`);
console.log("══ 【】 里的内容对应编辑的哪一半 ══");
console.log(`  只对应「要补进去的」(I)  = ${hitI}   ${((hitI / occ) * 100).toFixed(1)}%`);
console.log(`  只对应「要换掉的」(D)    = ${hitD}   ${((hitD / occ) * 100).toFixed(1)}%`);
console.log(`  两者皆是                = ${hitBoth}`);
console.log(`  都不对应（多为纯标点）    = ${hitNeither}`);
for (const k of ["只对应『要换掉的』", "两者皆是", "都不对应"]) {
  console.log(`\n── ${k} 样例 ──`);
  (ex[k] ?? []).slice(0, 6).forEach((s) => console.log("   " + s));
}
console.log(`\n⇒ 「【】 = 缺块」只覆盖 ${hitI}/${occ}（${((hitI / occ) * 100).toFixed(1)}%）；`);
console.log(`   另有 ${hitD + hitBoth} 处是「替换/两者皆含」——「缺块」这个说法对它们不成立。`);
