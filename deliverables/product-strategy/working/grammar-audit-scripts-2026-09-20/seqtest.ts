import { grammarLessons } from "../../../../src/data/grammarLessons";
import { guidedDisplayOrder } from "../../../../src/services/lessonService";
const sorted=[...(grammarLessons as any[])].sort((a,b)=>a.number-b.number);
const posCount:Record<string,Record<number,number>>={};
let variants=new Set<string>();
for(const l of sorted){
  const order=guidedDisplayOrder(l.guided, l.id);
  const kinds=order.map((i:number)=>l.guided[i].kind);
  variants.add(kinds.join(","));
  kinds.forEach((k:string,idx:number)=>{
    posCount[k] ||= {};
    posCount[k][idx+1]=(posCount[k][idx+1]||0)+1;
  });
}
console.log(`序列变体数: ${variants.size}（原先 4 种，其中 151 课同一套）`);
console.log("\n各题型出现在第几题的分布：");
for(const [kind,dist] of Object.entries(posCount)){
  const total=Object.values(dist).reduce((a,b)=>a+b,0);
  const top=Object.entries(dist).sort((a,b)=>b[1]-a[1])[0];
  console.log(`  ${kind.padEnd(8)} 最常见第 ${top[0]} 题 (${top[1]}/${total} = ${((top[1]/total)*100).toFixed(0)}%)  分布: ${Object.entries(dist).sort((a,b)=>+a[0]-+b[0]).map(([p,c])=>`${p}:${c}`).join(" ")}`);
}
console.log("\n序列分布:");
const vc:Record<string,number>={};
for(const l of sorted){
  const order=guidedDisplayOrder(l.guided,l.id);
  const k=order.map((i:number)=>l.guided[i].kind).join(",");
  vc[k]=(vc[k]||0)+1;
}
for(const [k,c] of Object.entries(vc).sort((a,b)=>b[1]-a[1])) console.log(`  ${String(c).padStart(3)} 课  ${k}`);
