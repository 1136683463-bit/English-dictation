import { grammarLessons } from "../../../../src/data/grammarLessons";
const W = (f: string, t?: string) => !!t && new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i").test(t);
const allText = (l: any) => [l.title, l.grammarLabel, l.oneLineRule, l.intentZh, l.sceneSetupZh, l.summary?.rule, ...(l.summary?.points ?? []), ...(l.deepDive?.paragraphs ?? []), ...l.guided.map((g: any) => g.explain + " " + g.promptZh + " " + (g.correctionZh ?? "")), ...(l.contrast ?? []).map((c: any) => c.whyZh), ...l.examples.map((e: any) => e.zh)].join(" || ");
const VOCAB = ["名字版", "穿回原样", "换零件", "领一整句", "垫板", "小标签", "先给谁后给什么", "昨天版", "做过版", "原样", "换人换形", "画面版", "小钩子", "小挂件", "幕后句", "收口"];
console.log("=== 项目自建词汇在 204 课里的出现次数（全字段文本）===");
for (const v of VOCAB) {
  const ls = grammarLessons.filter(l => W(v, allText(l)) || W(v, l.dialogueZh) || (l.dialogue ?? []).some((d: any) => W(v, d.zh)) || l.targetSentence.includes(v) || W(v, l.recall?.noteZh) || l.examples.some((e: any) => W(v, e.zh)) || (l.variants ?? []).some((x: any) => W(v, x.noteZh)) || (l.sceneSwings ?? []).some((x: any) => W(v, x.zh)) || (l.blocks ?? []).some((b: any) => W(v, b.role)));
  console.log(`  ${v.padEnd(16)} ${String(ls.length).padStart(3)} 课  ${ls.slice(0,10).map(l=>`L${l.number}`).join(",")}${ls.length>10?"…":""}`);
}
console.log("\n=== 哪些课的 targetSentence 里有第三人称 -s 形态（他/她 + 动词s）===");
for (const l of grammarLessons) {
  const t = l.targetSentence;
  if (/\b(he|she|it|my mom|my dad|Tom|Xiaomei|the boy|the girl|Grandma|grandma|teacher|the teacher)\b/i.test(t) && /\b\w+s\b/.test(t))
    console.log(`  L${l.number} [${l.grammarLabel}] ${JSON.stringify(t)}`);
}
