// 直接验证真词判定的盲区是否补上（复刻两个扫描里的 baseForms 规则）。
const dictHeadwords = new Set(["finish","need","clean","want","play","go","do","hope","study","tire","help","watch"]);
const baseForms = (word: string): string[] => {
  const out = [word];
  if (word.endsWith("ies") && word.length > 4) out.push(`${word.slice(0, -3)}y`);
  if (word.endsWith("es") && word.length > 3) out.push(word.slice(0, -2));
  const sibilantStem = /(s|sh|ch|x|z)$/.test(word.slice(0, -1));
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3 && !sibilantStem) out.push(word.slice(0, -1));
  if (word.endsWith("ed") && word.length > 3) out.push(word.slice(0, -2), word.slice(0, -1));
  if (word.endsWith("ing") && word.length > 4) out.push(word.slice(0, -3), `${word.slice(0, -3)}e`);
  return out;
};
const real = (w: string) => baseForms(w.toLowerCase()).some((b) => dictHeadwords.has(b));
console.log("应当判**非词**（造出来的）：");
for (const w of ["finishs", "watchs", "needss"]) console.log(`  ${w.padEnd(10)} ${real(w) ? "✗ 仍被判为真词" : "✓ 已判非词"}`);
console.log("应当判**真词**（合法变形，不能被误伤）：");
for (const w of ["finishes", "needs", "cleaned", "wanted", "plays", "goes", "studies", "hopes", "tired", "watching", "helping"]) console.log(`  ${w.padEnd(10)} ${real(w) ? "✓ 仍判真词" : "✗ 被误伤"}`);
