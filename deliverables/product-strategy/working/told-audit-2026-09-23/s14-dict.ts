import { bundledDictionary } from "../../../../src/data/bundledDictionary";
const W = (f: string, t?: string) => !!t && new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i").test(t);
console.log(`词典条目总数: ${bundledDictionary.length}`);
for (const w of ["tell","tells","told","telling","say","said","says","ask","speak","talk"]) {
  const e = bundledDictionary.find((x: any) => x.word.toLowerCase() === w);
  if (e) console.log(`\n--- ${w} ---\n  phonetic=${e.phonetic} pos=${e.partOfSpeech}\n  def=${JSON.stringify((e.definition||"").slice(0,260))}`);
  else console.log(`\n--- ${w} --- ❌ 词典无此条目`);
}
console.log("\n=== 词典里任何字段含 tell 家族词条的（含 definition 提及）===");
for (const e of bundledDictionary as any[]) {
  if (W("tell", e.definition) || W("told", e.definition)) console.log(`  ${e.word}: ${JSON.stringify((e.definition||"").slice(0,180))}`);
}
