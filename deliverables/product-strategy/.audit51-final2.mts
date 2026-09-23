/**
 * 第 51 批 · correctedSentenceOf 缺陷定案（人工逐条判读后的最终清单）
 * 每条给出：机制、原句、实得句、应然句、判定
 */
import { huntCases } from "../../src/data/huntCases";
import { correctedSentenceOf } from "../../src/services/huntService";
type Row = { id: string; idx: number; mech: string; want: string };
const TRUE: Row[] = [
  // 机制 A：original 跨多 token
  { id: "hunt-word-order", idx: 4, mech: "A 跨度", want: "She bought a beautiful dress." },
  { id: "hunt-word-order", idx: 9, mech: "A 跨度", want: "We visited an old house near the river." },
  { id: "hunt-photo-compare", idx: 26, mech: "A 跨度", want: "This photo is better than that." },
  { id: "hunt-key-clue", idx: 13, mech: "A 跨度", want: "I don't know where it is." },
  { id: "hunt-key-clue", idx: 19, mech: "A 跨度", want: "Do you know where the key is?" },
  { id: "hunt-lost-dog", idx: 9, mech: "A 跨度", want: "We don't know where he is." },
  { id: "hunt-team-message", idx: 20, mech: "A 跨度", want: "I don't think she will be late." },
  { id: "hunt-class-intro", idx: 7, mech: "A 跨度", want: "I know where he is." },
  // 机制 B：correction 含邻位词 → 邻词写两遍
  { id: "hunt-question-words", idx: 16, mech: "B 邻词", want: "When did you lose it?" },
  { id: "hunt-frequency-habit", idx: 7, mech: "B 邻词", want: "Lily always goes to the library after class." },
  { id: "hunt-looking-forward-weekend", idx: 9, mech: "B 邻词", want: "I am looking forward to the weekend." },
  { id: "hunt-when-vs-as-soon", idx: 6, mech: "B 邻词", want: "As soon as I finish, I will eat." },
  { id: "hunt-close-23", idx: 10, mech: "B 邻词", want: "As soon as I finish, I will eat." },
  { id: "hunt-such-a", idx: 2, mech: "B 邻词", want: "It was such a big fish." },
];
// 假阳性（人工判读：产物其实是正确英文）
const FALSE_POS = ["hunt-height-chart#2", "hunt-before-dinner#1", "hunt-two-faces#8", "hunt-as-soon-as-comes#9", "hunt-as-long-as-forest#4"];
const uniq = Array.from(new Set(TRUE.map((r) => r.id)));
console.log(`真缺陷 ${TRUE.length} 处 / ${uniq.length} 案\n`);
for (const id of uniq) {
  const hc = huntCases.find((h) => h.id === id)!;
  const rows = TRUE.filter((r) => r.id === id);
  console.log(`── ${id}  [${rows.map((r) => r.mech).join(" + ")}]`);
  console.log(`   原: ${hc.tokens.join(" ")}`);
  console.log(`   得: ${correctedSentenceOf(hc)}`);
  rows.forEach((r, i) => console.log(`   应(${r.mech}): ${r.want}`));
  console.log("");
}
console.log(`\n人工判为假阳性的（产物是正确英文，探测器的邻位判据过宽）${FALSE_POS.length} 处：`);
for (const f of FALSE_POS) {
  const [id, idx] = f.split("#");
  const hc = huntCases.find((h) => h.id === id)!;
  console.log(`   ${f}  得: ${correctedSentenceOf(hc)}`);
}
