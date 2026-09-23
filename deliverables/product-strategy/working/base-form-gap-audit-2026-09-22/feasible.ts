import { grammarLessons } from "../../../../src/data/grammarLessons";
const hit=(f:string,t?:string)=>!!t && new RegExp(`\\b${f}\\b`,"i").test(t);
const A1=(l:any):string[]=>[l.targetSentence,l.dialogueEn,...(l.dialogue??[]).map((d:any)=>d.en),...l.examples.map((e:any)=>e.en),
  ...(l.variants??[]).map((v:any)=>v.en),...(l.sceneSwings??[]).map((s:any)=>s.en),...l.blocks.map((b:any)=>b.text),
  ...l.practice.map((p:any)=>p.answer),l.recall?.answer,...(l.contrast??[]).map((c:any)=>c.correct)];
const allA = grammarLessons.flatMap(l=>A1(l).map(t=>[l.number,t] as [number,string]));
const show=(name:string,re:RegExp,lim=5)=>{ const f=allA.filter(([,t])=>re.test(t??""));
  console.log(`\n${name}: ${f.length} 处`); f.slice(0,lim).forEach(([n,t])=>console.log(`   L${n}: ${t}`)); };

show("『always + 原形』（I always lose 这类）", /\b(always|usually|often|sometimes|never)\s+\w+/i, 8);
show("『every day/week + 原形』", /\bevery\s+(day|week|morning|year)\b/i, 5);
show("『These/Those + 复数 + 原形』", /\b(these|those)\s+\w+s\s+\w+/i, 5);
show("疑问句 Did you + 原形", /\bdid\s+(you|he|she|they)\s+\w+/i, 8);
show("否定 don't/doesn't/didn't + 原形", /\b(do|does|did)n'?t\s+\w+/i, 8);

console.log("\n=== 关键：这些『原形槽』用的动词都是谁（证明槽位已教透）===");
const verbs=new Map<string,number>();
for(const [,t] of allA) {
  const m=(t??"").match(/\b(?:always|usually|often|sometimes|never)\s+(\w+)/i); if(m) verbs.set(m[1],(verbs.get(m[1])??0)+1);
  const m2=(t??"").match(/\b(?:do|does|did)n'?t\s+(\w+)/i); if(m2) verbs.set("don't+"+m2[1],(verbs.get("don't+"+m2[1])??0)+1);
  const m3=(t??"").match(/\bdid\s+(?:you|he|she|they)\s+(\w+)/i); if(m3) verbs.set("did+"+m3[1],(verbs.get("did+"+m3[1])??0)+1);
}
console.log([...verbs.entries()].sort((a,b)=>b[1]-a[1]).slice(0,26).map(([k,v])=>`${k}×${v}`).join(", "));

console.log("\n=== 结论检验：lose/break/wear 在这个『原形槽』里出现过几次 ===");
let z=0;
for(const [,t] of allA) if(/\b(always|usually|often|sometimes|never|don'?t|doesn'?t|didn'?t|did you|did he|did she|did they|will|can|must|should|to)\s+(lose|break|wear)\b/i.test(t??"")){ console.log(`   L?: ${t}`); z++; }
console.log("   命中:", z);
