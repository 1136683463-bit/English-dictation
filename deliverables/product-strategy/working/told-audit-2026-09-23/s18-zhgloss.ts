import { grammarLessons } from "../../../../src/data/grammarLessons";
const W = (f: string, t?: string) => !!t && new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i").test(t);
console.log("=== 5 处 tell 的英文与中文对照（zh 是否是英译？）===");
for (const l of grammarLessons) {
  (l.dialogue ?? []).forEach((d, i) => {
    if (W("tell", d.en)) console.log(`L${l.number} dialogue[${i}] who=${d.who}\n   EN: ${JSON.stringify(d.en)}\n   ZH: ${JSON.stringify(d.zh)}`);
  });
}
console.log("\n=== 对话行 zh 是否「翻译英文」还是「舞台指示」：抽样 12 课 ===");
let translated = 0, stage = 0;
for (const l of grammarLessons.slice(0, 60)) {
  const d = (l.dialogue ?? [])[0];
  if (!d) continue;
  const isStage = !/[a-zA-Z]/.test(d.zh) && (d.zh.length < 22);
  if (isStage) stage++; else translated++;
}
console.log(`  前 60 课 dialogue[0]: 疑似舞台指示 ${stage}，疑似翻译 ${translated}`);
console.log("\n=== 全库 dialogue[0].zh 长度分布（短=舞台指示）===");
const lens = grammarLessons.map(l => (l.dialogue ?? [])[0]?.zh?.length ?? 0).sort((a,b)=>a-b);
console.log(`  min=${lens[0]} p25=${lens[Math.floor(lens.length*0.25)]} median=${lens[Math.floor(lens.length*0.5)]} p75=${lens[Math.floor(lens.length*0.75)]} max=${lens[lens.length-1]}`);
console.log("\n=== 有 SpeakButton 的字段（用户能听到英文的槽位）——源码确认 ===");
