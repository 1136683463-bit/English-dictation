import { grammarLessons } from "../../../../src/data/grammarLessons";
import { huntCases } from "../../../../src/data/huntCases";

const out: any = { lessonCount: grammarLessons.length, huntCaseCount: huntCases.length, lessons: [] };

for (const l of grammarLessons as any[]) {
  out.lessons.push({
    n: l.number, id: l.id, title: l.title, label: l.grammarLabel, episode: l.episode,
    target: l.targetSentence,
    blocks: (l.blocks || []).length,
    examples: (l.examples || []).length,
    guided: (l.guided || []).length,
    guidedKinds: (l.guided || []).map((g: any) => g.kind),
    practice: (l.practice || []).length,
    practiceKinds: (l.practice || []).map((g: any) => g.kind),
    huntCases: (l.huntCaseIds || []).length,
    hasDialogue: !!l.dialogue, dialogueLines: (l.dialogue || []).length,
    contrast: (l.contrast || []).length,
    variants: (l.variants || []).length,
    sceneSwings: (l.sceneSwings || []).length,
    hasDeepDive: !!l.deepDive, deepDiveWords: l.deepDive ? l.deepDive.paragraphs.join("").length : 0,
    hasSummary: !!l.summary, summaryPoints: l.summary ? l.summary.points.length : 0,
    hasRecall: !!l.recall,
    recallKinds: l.recall ? Object.keys(l.recall).join("+") : "",
    oneLineLen: (l.oneLineRule || "").length,
    examplesRaw: (l.examples || []).map((e: any) => e.en),
    guidedRaw: l.guided, practiceRaw: l.practice, recallRaw: l.recall,
    contrastRaw: l.contrast, variantsRaw: l.variants,
  });
}
console.log(JSON.stringify(out, null, 1));
