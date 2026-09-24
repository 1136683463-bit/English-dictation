import { bundledDictionary } from "../../src/data/bundledDictionary.ts";
const D = new Set(bundledDictionary.map((e: any) => String(e.word).toLowerCase()));
console.log("=== 真词（应判为非伪造）===");
for (const w of ["needing","feeding","seeding","speeding","agreeing","freeing","cleaned","played","studied"])
  console.log("  " + w.padEnd(12) + (D.has(w) ? "在词典 ✓" : "不在词典 ✗"));
console.log("=== 伪造词（应判为伪造）===");
for (const w of ["cleaneding","takesed","takess","plaies","takesing","cleansed","ned","liks","livs","studis","studing"])
  console.log("  " + w.padEnd(12) + (D.has(w) ? "⚠ 在词典" : "不在词典 ✓"));
