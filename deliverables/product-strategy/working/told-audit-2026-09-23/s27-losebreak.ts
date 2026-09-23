import { grammarLessons } from "../../../../src/data/grammarLessons";
console.log("=== L23 的 contrast[6]（lose 唯一正侧落点）===");
{ const l = grammarLessons.find(x => x.number === 23)!;
  console.log(`L23 ${l.title} [${l.grammarLabel}] target=${JSON.stringify(l.targetSentence)}`);
  console.log(`contrast 张数 = ${(l.contrast ?? []).length}`);
  (l.contrast ?? []).forEach((c, i) => console.log(`  [${i}] bothRight=${c.bothRight} mark=${JSON.stringify(c.wrongMark)}\n      wrong  =${JSON.stringify(c.wrong)}\n      correct=${JSON.stringify(c.correct)}\n      whyZh  =${JSON.stringify(c.whyZh)}`));
}
console.log("\n=== L50 的 contrast[6]（break 唯一正侧落点）===");
{ const l = grammarLessons.find(x => x.number === 50)!;
  console.log(`L50 ${l.title} [${l.grammarLabel}] target=${JSON.stringify(l.targetSentence)}`);
  console.log(`contrast 张数 = ${(l.contrast ?? []).length}`);
  (l.contrast ?? []).forEach((c, i) => console.log(`  [${i}] bothRight=${c.bothRight} mark=${JSON.stringify(c.wrongMark)}\n      wrong  =${JSON.stringify(c.wrong)}\n      correct=${JSON.stringify(c.correct)}\n      whyZh  =${JSON.stringify(c.whyZh)}`));
}
