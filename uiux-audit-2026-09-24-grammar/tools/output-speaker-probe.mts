import { grammarLessons } from "../../src/data/grammarLessons.ts";
import { outputSpeakerOfTarget } from "../../src/services/lessonService.ts";
const L = grammarLessons as any[];
const stat: Record<string, number> = { me: 0, other: 0, null: 0 };
const others: string[] = [];
for (const l of L) {
  const who = outputSpeakerOfTarget(l);
  stat[String(who)] += 1;
  if (who === "other") others.push(`${l.id} target="${l.targetSentence}"`);
}
console.log("说话人分布:", JSON.stringify(stat));
console.log("判为「对方说的」的课（文案要跟着换）:");
for (const o of others) console.log("  " + o);
