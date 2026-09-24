import { bundledDictionary } from "../../src/data/bundledDictionary.ts";
const words = new Set(bundledDictionary.map((e: any) => String(e.word).toLowerCase()));
console.log("bundledDictionary 词条数:", words.size);
const test = ["ned","liks","livs","clos","studis","studing","seed","se","speed","spe",
              "needs","needed","needing","cleans","cleaned","cleaning","likes","liked","liking",
              "lives","lived","living","studies","studied","studying","walks","walked","walking",
              "want","wants","wanted","wanting","open","opens","opened","opening","help","helps","helped","helping"];
for (const w of test) console.log(`  ${w.padEnd(10)} ${words.has(w) ? "在词典里" : "✗ 不在"}`);
