/** 人工判读候选：把 17 个「重复痕迹」案逐条判定「真缺陷 / 假阳性」，并给出应然句 */
import { huntCases } from "../../src/data/huntCases";
import { correctedSentenceOf } from "../../src/services/huntService";
const CAND = ["hunt-word-order","hunt-travel-plan","hunt-question-words","hunt-frequency-habit","hunt-key-clue","hunt-lost-dog","hunt-class-intro","hunt-height-chart","hunt-before-dinner","hunt-two-faces","hunt-looking-forward-weekend","hunt-as-soon-as-comes","hunt-when-vs-as-soon","hunt-close-23","hunt-as-long-as-forest","hunt-such-a","hunt-slept","hunt-photo-compare","hunt-team-message"];
for (const id of CAND) {
  const hc = huntCases.find((h) => h.id === id);
  if (!hc) { console.log(`(缺 ${id})`); continue; }
  console.log(`\n════ ${hc.id} ════`);
  console.log(`  原句: ${hc.tokens.join(" ")}`);
  console.log(`  实得: ${correctedSentenceOf(hc)}`);
  console.log(`  错点: ${hc.errors.map((e) => `#${e.tokenIndex}"${e.original}"→"${e.correction}"`).join("  ")}`);
}
