import { readFileSync } from "node:fs";
const lines = readFileSync("src/data/grammarLessons.ts", "utf8").split("\n");
function locate(form: string) {
  const re = new RegExp(`\\b${form}\\b`, "gi");
  const out: {ln:number; text:string}[] = [];
  lines.forEach((l, i) => { if (re.test(l)) out.push({ln: i+1, text: l.trim()}); re.lastIndex = 0; });
  return out;
}
for (const f of ["lose","break","wear","wearing"]) {
  const hits = locate(f);
  console.log(`\n########## ${f}  (${hits.length} hits) ##########`);
  for (const h of hits) console.log(`  L${h.ln}: ${h.text.slice(0,190)}`);
}
