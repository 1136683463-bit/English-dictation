import { grammarLessons } from "../../../../src/data/grammarLessons";
import { huntCases } from "../../../../src/data/huntCases";
import * as echo from "../../../../src/data/echoGateScripts";
import * as gate from "../../../../src/data/gateScripts";
import * as lib from "../../../../src/data/libraryGateScripts";
import * as lh from "../../../../src/data/lighthouseGateScripts";
import * as mk from "../../../../src/data/marketGateScripts";
import * as mt from "../../../../src/data/mountainGateScripts";
const WB = (f: string) => new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i");
const H = (f: string, t?: string) => !!t && WB(f).test(t);
console.log("=== ① lose / break 的正侧落点（核对批 46 结论）===");
for (const f of ["lose","break","broke","lost"]) {
  const hits: string[] = [];
  for (const l of grammarLessons) {
    const A = (s: string, t?: string) => { if (H(f, t)) hits.push(`L${l.number}.${s}`); };
    A("targetSentence", l.targetSentence); A("dialogueEn", l.dialogueEn);
    (l.dialogue ?? []).forEach((d, k) => A(`dialogue[${k}]`, d.en));
    l.examples.forEach((e, k) => A(`examples[${k}]`, e.en));
    (l.variants ?? []).forEach((v, k) => A(`variants[${k}]`, v.en));
    (l.sceneSwings ?? []).forEach((s, k) => A(`sceneSwings[${k}]`, s.en));
    l.blocks.forEach((b, k) => A(`blocks[${k}]`, b.text));
    l.practice.forEach((p, k) => A(`practice[${k}].answer`, p.answer));
    if (l.recall) A("recall.answer", l.recall.answer);
    (l.contrast ?? []).forEach((c, k) => { A(`contrast[${k}].correct`, c.correct); if (c.bothRight) A(`contrast[${k}].wrong(bothRight)`, c.wrong); });
    l.guided.forEach((g, k) => { if (g.kind !== "spot") { A(`guided[${k}].answer`, g.answer); A(`guided[${k}].replaceBase`, g.replaceBase); } });
  }
  console.log(`  ${f.padEnd(7)} 正侧 ${hits.length} 处: ${hits.join(", ") || "（0）"}`);
}
console.log("\n=== ② 冒险关卡里 Tell 祈使句的物理句数（用户可见的 NPC 台词）===");
const lists: [string, any[]][] = [["echo", echo.ECHO_GATES], ["station", gate.STATION_GATES], ["library", lib.LIBRARY_GATES], ["lighthouse", lh.LIGHTHOUSE_GATES], ["market", mk.MARKET_GATES], ["mountain", mt.MOUNTAIN_GATES]];
let impNpc = 0; const impList: string[] = []; let setupTell = 0; let replyTell = 0;
for (const [n, list] of lists) for (const g of list) {
  if (H("tell", g.npcLine)) { impNpc++; impList.push(`${n}/${g.id}`); }
  if (H("tell", g.npcLineZh)) {}
  for (const b of g.misreadBranches ?? []) if (H("tell", b.npcReply)) replyTell++;
}
for (const [n, list] of lists) { /* stories */ }
for (const [n, s] of [["echo", echo.ECHO_STORIES], ["station", gate.GATE_STORIES], ["library", lib.LIBRARY_STORIES], ["lighthouse", lh.LIGHTHOUSE_STORIES], ["market", mk.MARKET_STORIES], ["mountain", mt.MOUNTAIN_STORIES]] as [string, any[]][])
  for (const st of s) if (H("tell", st.setup)) { setupTell++; }
console.log(`  关卡 npcLine 含 tell: ${impNpc} 关 → ${impList.join(", ")}`);
console.log(`  关卡 misreadBranches.npcReply 含 tell: ${replyTell} 处`);
console.log(`  STORIES.setup 含 tell: ${setupTell} 处`);
console.log(`  ⇒ 关卡侧用户可见 tell 语句合计 = ${impNpc + replyTell + setupTell} 处`);
console.log("\n=== ③ 课程侧与关卡侧的 tell 家族分布总表 ===");
console.log(`  课（grammarLessons）: ${["tell","tells","told","telling"].map(f=>{let n=0;const rec=(o:any,d=0)=>{if(d>9||o==null)return;if(typeof o==="string"){if(H(f,o))n++;return;}if(Array.isArray(o)){o.forEach(v=>rec(v,d+1));return;}if(typeof o==="object")for(const k of Object.keys(o))rec(o[k],d+1);};rec(grammarLessons);return `${f}=${n}`;}).join(" ")}`);
console.log(`  案（huntCases）: ${["tell","tells","told","telling"].map(f=>{let n=0;const rec=(o:any,d=0)=>{if(d>9||o==null)return;if(typeof o==="string"){if(H(f,o))n++;return;}if(Array.isArray(o)){o.forEach(v=>rec(v,d+1));return;}if(typeof o==="object")for(const k of Object.keys(o))rec(o[k],d+1);};rec(huntCases);return `${f}=${n}`;}).join(" ")}`);
console.log("\n=== ④ L38 guided[0] 把 said 判错（唯一一处 said 被测试的地方）===");
{ const l = grammarLessons.find(x => x.number === 38)!;
  const g = l.guided[0];
  console.log(`  promptZh: ${JSON.stringify(g.promptZh)}`);
  console.log(`  options : ${JSON.stringify(g.options)}`);
  console.log(`  answer  : ${JSON.stringify(g.answer)}   ← "She said" 是干扰项，选它判错`);
  console.log(`  explain : ${JSON.stringify(g.explain)}`);
}
console.log("\n=== ⑤ 跟读/输出：对话行是否要求用户产出？===");
console.log(`  （源码走查结论见报告正文：dialogue 行只渲染 + SpeakButton 朗读，无判分、无跟读要求）`);
