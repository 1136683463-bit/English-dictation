import { grammarLessons } from "../../../../src/data/grammarLessons";
import { huntCases } from "../../../../src/data/huntCases";
import fs from "node:fs";
const WB = (f: string) => new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i");
const H = (f: string, t?: string) => !!t && WB(f).test(t);
// 4 种口径
function C1(f: string) { // 严格：排除 spot.answer、bothRight.wrong
  let n = 0; const A = (t?: string) => { if (H(f, t)) n++; };
  for (const l of grammarLessons) {
    A(l.targetSentence); A(l.dialogueEn); for (const d of l.dialogue ?? []) A(d.en);
    for (const e of l.examples) A(e.en); for (const v of l.variants ?? []) A(v.en);
    for (const s of l.sceneSwings ?? []) A(s.en); for (const b of l.blocks) A(b.text);
    for (const p of l.practice) A(p.answer); if (l.recall) A(l.recall.answer);
    for (const c of l.contrast ?? []) { A(c.correct); if (c.bothRight) A(c.wrong); }
    for (const g of l.guided) if (g.kind !== "spot") { A(g.answer); A(g.replaceBase); }
  }
  return n;
}
function C2(f: string) { // 宽松：正侧全收 + spot 题的 answer（错词）+ spot tokens
  let n = 0; const A = (t?: string) => { if (H(f, t)) n++; };
  for (const l of grammarLessons) {
    A(l.targetSentence); A(l.dialogueEn); for (const d of l.dialogue ?? []) A(d.en);
    for (const e of l.examples) A(e.en); for (const v of l.variants ?? []) A(v.en);
    for (const s of l.sceneSwings ?? []) A(s.en); for (const b of l.blocks) A(b.text);
    for (const p of l.practice) A(p.answer); if (l.recall) A(l.recall.answer);
    for (const c of l.contrast ?? []) { A(c.correct); A(c.wrong); }
    for (const g of l.guided) { A(g.answer); A(g.replaceBase); A((g.tokens ?? []).join(" ")); }
  }
  return n;
}
function C3(f: string) { // 最宽：全部字符串字段（含中文讲解、含 id/注释）+ 案件
  let n = 0;
  const rec = (o: any, d = 0) => { if (d > 9 || o == null) return;
    if (typeof o === "string") { if (H(f, o)) n++; return; }
    if (Array.isArray(o)) { o.forEach((v) => rec(v, d + 1)); return; }
    if (typeof o === "object") for (const k of Object.keys(o)) rec(o[k], d + 1); };
  rec(grammarLessons); rec(huntCases);
  return n;
}
function C4(f: string) { // 原始文本（含源码注释/import）
  const s = fs.readFileSync("src/data/grammarLessons.ts", "utf8") + fs.readFileSync("src/data/huntCases.ts", "utf8");
  return (s.match(new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "gi")) ?? []).length;
}
console.log("=== 表 1 · 四种口径并列（证明结论对口径不敏感）===");
console.log("form".padEnd(10) + "C1严格正侧".padStart(12) + "C2宽松含错侧".padStart(14) + "C3全字段".padStart(10) + "C4原始文本".padStart(11));
for (const f of ["tell","tells","told","telling","say","says","said","wear","wears","wore","lose","lost"]) {
  console.log(f.padEnd(10) + String(C1(f)).padStart(12) + String(C2(f)).padStart(14) + String(C3(f)).padStart(10) + String(C4(f)).padStart(11));
}
console.log("\n=== 表 2 · 全仓库扫描（src/ 下全部 .ts/.tsx，node 词边界）===");
const walkDir = (dir: string, out: string[] = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory()) walkDir(p, out); else if (/\.(ts|tsx)$/.test(e.name)) out.push(p);
  }
  return out;
};
const files = walkDir("src");
const tally: Record<string, { file: string; n: number }[]> = {};
for (const f of ["tell","tells","told","telling"]) tally[f] = [];
for (const file of files) {
  if (file.includes("grammarLessons.ts") || file.includes("huntCases.ts")) continue;
  const s = fs.readFileSync(file, "utf8");
  for (const f of ["tell","tells","told","telling"]) {
    const m = s.match(new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "gi")) ?? [];
    if (m.length) tally[f].push({ file, n: m.length });
  }
}
console.log(`扫描文件数: ${files.length}`);
for (const f of ["tell","tells","told","telling"]) {
  const t = tally[f].sort((a,b)=>b.n-a.n);
  console.log(`\n  ${f}: 命中 ${t.length} 个文件, 共 ${t.reduce((a,b)=>a+b.n,0)} 处`);
  for (const x of t.slice(0, 12)) console.log(`     ${x.n.toString().padStart(3)}  ${x.file}`);
}
