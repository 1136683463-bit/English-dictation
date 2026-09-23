import { grammarLessons } from "../../../../src/data/grammarLessons";
console.log("=== 近 12 课的单课容量（blocks 数 / contrast 数 / practice 数 / guided 数）===");
console.log("课".padEnd(6)+"blocks".padStart(8)+"contrast".padStart(10)+"practice".padStart(10)+"guided".padStart(8)+"deepDive段".padStart(11));
for (const l of grammarLessons.slice(-14)) {
  console.log(`L${l.number}`.padEnd(6)+String(l.blocks.length).padStart(8)+String((l.contrast??[]).length).padStart(10)+String(l.practice.length).padStart(10)+String(l.guided.length).padStart(8)+String(l.deepDive?.paragraphs?.length??0).padStart(11));
}
console.log("\n=== 全库 blocks 数分布 ===");
const d=new Map<number,number>();
for(const l of grammarLessons) d.set(l.blocks.length,(d.get(l.blocks.length)??0)+1);
for(const [k,v] of [...d.entries()].sort((a,b)=>a[0]-b[0])) console.log(`  blocks=${k}: ${v} 课`);
console.log("\n=== 最近新增课的内容（看『2 个新点』是不是标准）===");
for (const n of [197,198,199,200,201,202]) {
  const l=grammarLessons.find(x=>x.number===n);
  if(l) console.log(`  L${n} [${l.id}] blocks=${l.blocks.length} (${l.blocks.map(b=>b.text).join(" / ").slice(0,72)})`);
}
