import { bundledDictionary } from "../../src/data/bundledDictionary.ts";
const POS = new Map<string, string>();
for (const e of bundledDictionary as any[]) {
  const w = String(e.word).toLowerCase();
  if (!POS.has(w)) POS.set(w, String(e.partOfSpeech ?? ""));
}
console.log("词条数:", POS.size);
console.log("POS 取值样例:", [...new Set([...POS.values()])].slice(0, 14).join(" | "));
console.log();
for (const w of ["tired","always","walked","needs","student","dogs","Xiaomei".toLowerCase(),"teacher","happy","run","running","better","eleven","bitter","homework"]) {
  console.log(`  ${w.padEnd(10)} ${POS.has(w) ? POS.get(w) : "（词典无此条）"}`);
}
