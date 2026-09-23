/** 复核「与原词同」那 1 条的判据：三种口径各得多少？ */
import { huntCases } from "../../src/data/huntCases";
let exact = 0, ciExact = 0, normEq = 0;
const exExact: string[] = [], exCi: string[] = [], exNorm: string[] = [];
const N = (s: string) => s.replace(/[^A-Za-z0-9']/g, "").toLowerCase();
for (const hc of huntCases) for (const e of hc.errors) {
  const c = (e.correction ?? "").trim(), o = (e.original ?? "").trim();
  const label = `${hc.id}#${e.tokenIndex} orig=${JSON.stringify(o)} corr=${JSON.stringify(c)}`;
  if (c === o) { exact++; exExact.push(label); }
  if (c.toLowerCase() === o.toLowerCase()) { ciExact++; exCi.push(label); }
  if (N(c) === N(o)) { normEq++; exNorm.push(label); }
}
console.log(`口径 A「trim 后逐字相同」                  : ${exact}`);
exExact.forEach((s) => console.log("    " + s));
console.log(`口径 B「trim 后忽略大小写相同」            : ${ciExact}`);
exCi.forEach((s) => console.log("    " + s));
console.log(`口径 C「去标点+小写后相同（更宽）」        : ${normEq}  （含 62 条「去掉 X」——它们归一后与原词同）`);
console.log(`口径 C 里【不含中文】的纯大小写/标点子集  : ${exNorm.filter((s) => !/去掉/.test(s)).length}`);
