import { grammarLessons } from "../../../../src/data/grammarLessons";
const bad:string[]=[];
for(const l of grammarLessons as any[]){
  const vs=(l.variants??[]).filter((v:any)=>v.label!=="肯定").map((v:any)=>v.en);
  const ans=(l.practice??[]).map((p:any)=>p.answer);
  const hits=vs.filter((s:string)=>ans.includes(s));
  if(hits.length===0) bad.push(`L${l.number}「${l.title}」变体: ${vs.join(" / ")} | 现练: ${ans.join(" / ")}`);
}
console.log(`丢失变体题的课: ${bad.length}`);
bad.forEach(b=>console.log("  ✗ "+b));
