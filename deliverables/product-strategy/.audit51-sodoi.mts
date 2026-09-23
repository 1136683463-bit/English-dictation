import { huntCases } from "../../src/data/huntCases";
import { correctedSentenceOf } from "../../src/services/huntService";
for (const id of ["hunt-so-do-i", "hunt-nice-day"]) {
  const hc = huntCases.find((h) => h.id === id)!;
  console.log(`\n════ ${hc.id} 「${hc.title}」 ════`);
  hc.tokens.forEach((t, i) => console.log(`   [${i}] ${JSON.stringify(t)}`));
  hc.errors.forEach((e) => console.log(`   err #${e.tokenIndex} tokens[${e.tokenIndex}]=${JSON.stringify(hc.tokens[e.tokenIndex])} tag=${e.tag} "${e.original}"→"${e.correction}"`));
  console.log(`   修正后整句: ${correctedSentenceOf(hc)}`);
}
