import { grammarLessons } from "../../../../src/data/grammarLessons";
// Verify: for kind:"spot", is guided[].answer the wrongToken?
const spots = grammarLessons.flatMap(l => l.guided.filter(g => g.kind === "spot").map(g => ({ n: l.number, id: l.id, ...g })));
console.log("total spot questions:", spots.length);
let ansIsWrong = 0, ansIsCorrection = 0, neither = 0;
for (const s of spots) {
  if (s.answer === s.wrongToken) ansIsWrong++;
  else if (s.correctionZh && s.answer && s.correctionZh.includes(s.answer)) ansIsCorrection++;
  else neither++;
}
console.log("answer === wrongToken :", ansIsWrong);
console.log("answer appears in correctionZh :", ansIsCorrection);
console.log("neither :", neither);
console.log("\nsample 4 spot questions:");
for (const s of spots.slice(0, 4)) console.log(JSON.stringify(s, null, 1));
