import { grammarLessons } from "../../../../src/data/grammarLessons";
const WB=(f:string)=>new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`,"i");
const H=(f:string,t?:string)=>!!t&&WB(f).test(t);
// 定位「options[]==answer 同时 guided[].answer 也命中」造成的重复计
console.log("=== 双重计数定位：guided[].answer 与 options[]==answer 是同一条 ===");
for(const f of ["says","wears","wore","said","wear"]){
  const dbl:string[]=[];
  for(const l of grammarLessons) l.guided.forEach((g,i)=>{
    if(g.kind==="spot")return;
    if(H(f,g.answer)) for(const o of g.options??[]) if(o===g.answer&&H(f,o)) dbl.push(`L${l.number}.guided[${i}] answer=${JSON.stringify(g.answer)}`);
  });
  console.log(`  ${f.padEnd(7)} 双计处数 = ${dbl.length}  ${dbl.join(" | ")}`);
}
console.log("\n=== 结论：s15 口径（A合计）与 s23 口径（C1 合并）的差异来源 ===");
console.log("  s15 逐条：A2 记 guided[].answer 一次 + options[](==answer) 又一次 ⇒ 同一字符串计 2 次");
console.log("  s23 C1：guided[].answer 记一次；options 不单独计（因为 answer 已计）⇒ 计 1 次");
console.log("  ⇒ s15 口径在 says/wears/wore 上各多计 1-2 处；C1 是正确口径");
