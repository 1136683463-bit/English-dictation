import { huntCases } from "../../src/data/huntCases";
for (const hc of huntCases) {
  if (hc.id !== "hunt-birthday-list") continue;
  console.log(`案件 ${hc.id}，errors ${hc.errors.length} 条：`);
  hc.errors.forEach((e, i) => {
    console.log(`  [${i}] idx=${e.tokenIndex} tag=${e.tag}`);
    console.log(`      original   = ${JSON.stringify(e.original)}  (len=${e.original.length})`);
    console.log(`      correction = ${JSON.stringify(e.correction)}  (len=${e.correction.length})`);
    console.log(`      trim 后相等? ${e.correction.trim() === e.original.trim()}`);
    console.log(`      explanation= ${JSON.stringify(e.explanation)}`);
  });
  console.log("tokens:", JSON.stringify(hc.tokens));
}
