/** 复核边角：late-note#25 / would-rather-walk#6 / prefer-tea#7 的真实语义 + 空修正与假异常 */
import { huntCases } from "../../src/data/huntCases";
const show = (id: string) => {
  const hc = huntCases.find((h) => h.id === id);
  if (!hc) return console.log(`(无 ${id})`);
  console.log(`\n── ${hc.id} 「${hc.title}」`);
  console.log(`   tokens: ${hc.tokens.join(" / ")}`);
  hc.errors.forEach((e) => console.log(`   #${e.tokenIndex} tag=${e.tag} orig="${e.original}" corr="${e.correction}"\n        讲: ${e.explanation}`));
};
["hunt-late-note", "hunt-would-rather-walk", "hunt-prefer-tea", "hunt-myself-cake", "hunt-unless-rain"].forEach(show);

console.log("\n\n════ 空修正 / 完全同值 的复核 ════");
let empty = 0, cand: string[] = [];
for (const hc of huntCases) for (const e of hc.errors) {
  if ((e.correction ?? "").trim() === "") { empty += 1; cand.push(`${hc.id}#${e.tokenIndex}`); }
}
console.log(`空修正: ${empty} ${cand.join(",")}`);
console.log(`(h1 测试的 KNOWN_NO_OP_CORRECTIONS 声称 2 处「修正与原词相同」：hunt-myself-cake#12 "help"、hunt-unless-rain#12 "go.")`);
for (const id of ["hunt-myself-cake", "hunt-unless-rain"]) {
  const hc = huntCases.find((h) => h.id === id); if (!hc) continue;
  const e12 = hc.errors.find((x) => x.tokenIndex === 12);
  if (!e12) { console.log(`  ${id}#12 不存在（该案 errors 下标: ${hc.errors.map((x) => x.tokenIndex).join(",")}）`); continue; }
  console.log(`  ${id}#12 orig="${e12.original}" corr="${e12.correction}" → 相同? ${e12.original.trim() === e12.correction.trim()}`);
}
