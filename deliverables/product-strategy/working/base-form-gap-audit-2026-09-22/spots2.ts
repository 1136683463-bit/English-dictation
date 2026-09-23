import { grammarLessons } from "../../../../src/data/grammarLessons";
const spots = grammarLessons.flatMap(l => l.guided.filter(g => g.kind === "spot").map(g => ({ n: l.number, id: l.id, ...g })));
for (const s of spots) {
  if (s.answer !== s.wrongToken) console.log(JSON.stringify({ n: s.n, id: s.id, tokens: s.tokens, wrongToken: s.wrongToken, answer: s.answer, correctionZh: s.correctionZh }, null, 1));
}
