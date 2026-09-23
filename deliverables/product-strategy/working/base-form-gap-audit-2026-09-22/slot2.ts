import { grammarLessons } from "../../../../src/data/grammarLessons";
import { huntCases } from "../../../../src/data/huntCases";
console.log("=== 手工核定的「原形被误用」清单（10 处，逐条判槽位）===");
const rows = [
  ["L23 contrast",  "I have lose my key.",              "I have lost my key.",              "have + 过去分词"],
  ["L23 contrast",  "I break my cup yesterday.",        "I broke my cup yesterday.",        "一般过去时"],
  ["L23 guided.spot","I have break my cup.",            "I have broken my cup.",            "have + 过去分词"],
  ["L50 contrast",  "My cup was break.",                "My cup was broken.",               "be + 过去分词（被动）"],
  ["L178 contrast", "I had lose my key before I got home.","I had lost my key before I got home.","had + 过去分词"],
  ["L39 contrast",  "The boy who wear glasses is my brother.","The boy who wears glasses is my brother.","第三人称单数 -s"],
  ["L41 contrast",  "I know the boy who wear glasses.",  "I know the boy who wears glasses.", "第三人称单数 -s"],
  ["案28",          "It was cold yesterday, so I wear my coat.","... so I wore my coat.",     "一般过去时"],
  ["案59",          "It was break on the morning.",      "It was broken ...",                "be + 过去分词（被动）"],
  ["案187",         "I had lose my key before I got home.","I had lost my key ...",          "had + 过去分词"],
];
const tally = new Map<string,number>();
for (const [w,wr,r,slot] of rows) { tally.set(slot,(tally.get(slot)??0)+1);
  console.log(`  ${String(w).padEnd(16)} ${String(wr).padEnd(44)} → ${String(r).padEnd(40)} 【${slot}】`); }
console.log("\n  槽位汇总:");
for (const [k,v] of [...tally.entries()].sort((a,b)=>b[1]-a[1])) console.log(`    ${k}: ${v}`);

console.log("\n=== 关键检验：『原形被正确使用』的句型，本项目教了吗（用别的动词）===");
const hit=(f:string,t?:string)=>!!t && new RegExp(`\\b${f}\\b`,"i").test(t);
const A1=(l:any):string[]=>[l.targetSentence,l.dialogueEn,...(l.dialogue??[]).map((d:any)=>d.en),...l.examples.map((e:any)=>e.en),
  ...(l.variants??[]).map((v:any)=>v.en),...(l.sceneSwings??[]).map((s:any)=>s.en),...l.blocks.map((b:any)=>b.text),
  ...l.practice.map((p:any)=>p.answer),l.recall?.answer,...(l.contrast??[]).map((c:any)=>c.correct)];
const pats: [string,RegExp][] = [
  ["(1) 复数主语 + 原形（现在时）", /\b(we|they|you|I|boys|girls|children|people|students)\s+(like|play|live|go|have|want|read|eat|run|help|know|look|make|take|get|give|put|come|work|watch|need|feel|love|use|find)\b/i],
  ["(2) do/does/did + 原形（问句/否定）", /\b(do|does|did|don't|doesn't|didn't)\s+(not\s+)?(like|play|live|go|have|want|read|eat|run|help|know|look|make|take|get|give|put|come|work|watch|need|feel|love|use|find|lose|break|wear)\b/i],
  ["(3) will / 情态 + 原形", /\b(will|can|must|should|may|might|have to|has to|had to)\s+(be\s+)?(like|play|live|go|have|want|read|eat|run|help|know|look|make|take|get|give|put|come|work|watch|need|feel|love|use|find|lose|break|wear|draw)\b/i],
  ["(4) to + 原形（不定式）", /\bto\s+(like|play|live|go|have|want|read|eat|run|help|know|look|make|take|get|give|put|come|work|watch|need|feel|love|use|find|lose|break|wear|draw)\b/i],
];
for (const [name,re] of pats) {
  const found: string[] = [];
  for (const l of grammarLessons) for (const t of A1(l)) if (re.test(t) && !found.some(x=>x.includes(t))) found.push(`L${l.number}: ${t}`);
  console.log(`\n  ${name}: 正确侧 ${found.length} 处`);
  found.slice(0,6).forEach(f=>console.log("     "+f));
}
console.log("\n=== 『原形必需』句型里 lose/break/wear 出现过吗 ===");
for (const [name,re] of pats) {
  const found:string[]=[];
  for (const l of grammarLessons) for (const t of A1(l)) for (const f of ["lose","break","wear"]) if (re.test(t??"") && hit(f,t)) found.push(`L${l.number}: ${t}`);
  console.log(`  ${name}: ${found.length} 处`);
  found.forEach(f=>console.log("     "+f));
}
console.log("\n=== did + lose 这个正确用法在哪里 ===");
for (const c of huntCases) for (const e of c.errors) if (/^did you lose$/i.test(e.correction))
  console.log(`  案${c.number} ${c.id}: ${JSON.stringify(e.original)} → ${JSON.stringify(e.correction)}；案内全句=${JSON.stringify(c.tokens.join(" "))}`);
for (const l of grammarLessons) for (const t of A1(l)) if (/\bdid\s+(you\s+)?(lose|break|wear)\b/i.test(t??"")) console.log(`  L${l.number}: ${t}`);
