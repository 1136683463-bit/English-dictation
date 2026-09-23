import { huntCases } from "../../src/data/huntCases";
import { correctedSentenceOf } from "../../src/services/huntService";
for (const id of ["hunt-looking-forward-weekend", "hunt-when-vs-as-soon", "hunt-close-23", "hunt-slept"]) {
  const hc = huntCases.find((h) => h.id === id)!;
  console.log(`\n════ ${hc.id} 「${hc.title}」 ════`);
  console.log(`tokens: ${hc.tokens.map((t, i) => `${i}:${t}`).join("  ")}`);
  hc.errors.forEach((e) => console.log(`   #${e.tokenIndex} tokens[${e.tokenIndex}]=${JSON.stringify(hc.tokens[e.tokenIndex])} tag=${e.tag} orig="${e.original}" corr="${e.correction}"`));
  console.log(`   修正句: ${correctedSentenceOf(hc)}`);
}
