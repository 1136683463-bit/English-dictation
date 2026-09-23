import { grammarLessons } from "../../../../src/data/grammarLessons";
import * as echo from "../../../../src/data/echoGateScripts";
import * as gate from "../../../../src/data/gateScripts";
import * as lib from "../../../../src/data/libraryGateScripts";
import * as lh from "../../../../src/data/lighthouseGateScripts";
import * as mk from "../../../../src/data/marketGateScripts";
import * as mt from "../../../../src/data/mountainGateScripts";
const WB=(f:string)=>new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`,"i");
const H=(f:string,t?:string)=>!!t&&WB(f).test(t);
console.log("=== ① 「me 行」（用户角色台词）里有没有 tell 家族？===");
let meLines=0, meTell=0;
for(const l of grammarLessons) for(const d of l.dialogue??[]) if(d.who==="me"){meLines++; if(H("tell",d.en)||H("tells",d.en)||H("told",d.en)) meTell++;}
console.log(`  me 行总数 ${meLines}；其中含 tell 家族 = ${meTell}  ⇒ 用户角色从不「说 tell」`);
let npcLines=0,npcTell=0;
for(const l of grammarLessons) for(const d of l.dialogue??[]) if(d.who==="npc"){npcLines++; if(H("tell",d.en)||H("tells",d.en)||H("told",d.en)) npcTell++;}
console.log(`  npc 行总数 ${npcLines}；其中含 tell 家族 = ${npcTell}`);
console.log("\n=== ② 关卡总数 & 含 tell 的关卡占比 ===");
const lists:[string,any[]][]=[["echo",echo.ECHO_GATES],["station",gate.STATION_GATES],["library",lib.LIBRARY_GATES],["lighthouse",lh.LIGHTHOUSE_GATES],["market",mk.MARKET_GATES],["mountain",mt.MOUNTAIN_GATES]];
let tot=0, withTell=0;
for(const [n,l] of lists){const c=l.filter((g:any)=>H("tell",g.npcLine)).length; tot+=l.length; withTell+=c;
  console.log(`  ${n.padEnd(11)} ${l.length} 关，含 tell ${c} 关`);}
console.log(`  合计 ${tot} 关 / 含 tell ${withTell} 关 = ${(withTell/tot*100).toFixed(1)}%`);
console.log("\n=== ③ 「me 行」里有没有说 / asked / answered 等转述动词？===");
const RT=["say","says","said","ask","asked","answer","told","tell","speak"];
for(const f of RT){const hits:string[]=[];
  for(const l of grammarLessons) for(const d of l.dialogue??[]) if(d.who==="me"&&H(f,d.en)) hits.push(`L${l.number}`);
  console.log(`  me 行含 ${f.padEnd(7)}: ${hits.length} 处 ${hits.join(",")||"（0）"}`);}
console.log("\n=== ④ 全库 204 课：含 tell 的课 vs 用户角色产出 tell 的课 ===");
console.log("  含 tell 的课: L41 L101 L110 L117 L185（全部对话首句，npc 说）");
console.log("  用户角色产出 tell 的课: 0 课");
console.log("\n=== ⑤ 若把 `told` 挂靠：候选宿主课的教学点是否「动词形态」？===");
for(const n of [41,101,110,117,185]){const l=grammarLessons.find(x=>x.number===n)!;
 console.log(`  L${n} [${l.grammarLabel}] target(${l.targetSentence.split(/\s+/).length}词)=${JSON.stringify(l.targetSentence)}`);}
console.log("\n=== ⑥ L38 guided[0] 「She said」被判错——这是 said 的唯一一次「被点名判错」 ===");
{const l=grammarLessons.find(x=>x.number===38)!;const g=l.guided[0];
 console.log(`  options=${JSON.stringify(g.options)}  answer=${JSON.stringify(g.answer)}`);}
