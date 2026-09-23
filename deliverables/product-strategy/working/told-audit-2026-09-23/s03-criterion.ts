import { grammarLessons } from "../../../../src/data/grammarLessons";
const hit = (f: string, t?: string) => !!t && new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i").test(t);
const has = (f: string, t?: string) => !!t && new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i").test(t);

// 找所有「教过去形态」的课：grammarLabel/title/oneLineRule 含 昨天版/做过版
console.log("=== 全部 204 课的 grammarLabel（找过去形态课）===");
for (const l of grammarLessons) {
  const blob = [l.title, l.grammarLabel, l.oneLineRule, l.targetSentence].join(" || ");
  if (/昨天版|做过版|过去/.test(blob)) console.log(`  L${l.number} [${l.grammarLabel}] ${l.title} :: target=${JSON.stringify(l.targetSentence)}`);
}
