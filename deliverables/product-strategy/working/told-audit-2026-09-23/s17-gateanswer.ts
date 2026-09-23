import * as echo from "../../../../src/data/echoGateScripts";
import * as gate from "../../../../src/data/gateScripts";
import * as lib from "../../../../src/data/libraryGateScripts";
import * as lh from "../../../../src/data/lighthouseGateScripts";
import * as mk from "../../../../src/data/marketGateScripts";
import * as mt from "../../../../src/data/mountainGateScripts";
const W = (f: string, t?: string) => !!t && new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i").test(t);
// 只扫「用户要作答/被判分的字段」：sampleAnswer / acceptRegex / requiredPattern / hints / canDo / zhIntent / counterExample
const ANSWER_FIELDS = ["sampleAnswer","acceptRegex","requiredPattern","counterExample","counterNote","canDo","zhIntent","npcLineZh"];
const mods: [string, any][] = [["echo",echo],["gate",gate],["lib",lib],["lh",lh],["mk",mk],["mt",mt]];
const gateLists: Record<string, any[]> = {
  echo: echo.ECHO_GATES, gate: gate.STATION_GATES, lib: lib.LIBRARY_GATES,
  lh: lh.LIGHTHOUSE_GATES, mk: mk.MARKET_GATES, mt: mt.MOUNTAIN_GATES,
};
let total = 0;
console.log("=== 关卡「作答/判分」字段里的 tell 家族 ===");
for (const [name, _] of mods) {
  const list = gateLists[name];
  for (const g of list) {
    for (const f of ANSWER_FIELDS) {
      const v = g[f];
      if (Array.isArray(v)) { v.forEach((x: string, i: number) => { if (W("tell",x)||W("tells",x)||W("told",x)) { console.log(`  ★[${name}] ${g.id}.${f}[${i}] = ${JSON.stringify(x)}`); total++; } }); }
      else if (typeof v === "string" && (W("tell",v)||W("tells",v)||W("told",v))) { console.log(`  ★[${name}] ${g.id}.${f} = ${JSON.stringify(v.slice(0,220))}`); total++; }
    }
    for (const b of g.misreadBranches ?? []) {
      for (const k of Object.keys(b)) {
        const v = (b as any)[k]; if (typeof v === "string" && (W("tell",v)||W("tells",v)||W("told",v))) { console.log(`  ★[${name}] ${g.id}.misreadBranches.${k} = ${JSON.stringify(v.slice(0,200))}`); total++; }
      }
    }
  }
}
console.log(`合计「作答/判分」字段命中: ${total}`);
// sampleAnswer 里含 tell 的统计（更精确）
console.log("\n=== sampleAnswer 逐条 ===");
let n2 = 0;
for (const [name, _] of mods) for (const g of gateLists[name]) {
  if (W("tell", g.sampleAnswer) || W("tells", g.sampleAnswer) || W("told", g.sampleAnswer)) { console.log(`  [${name}] ${g.id} sampleAnswer = ${JSON.stringify(g.sampleAnswer)}`); n2++; }
}
console.log(`sampleAnswer 含 tell 家族: ${n2} 条`);
console.log("\n=== acceptRegex 含 tell ===");
let n3 = 0;
for (const [name, _] of mods) for (const g of gateLists[name]) {
  if (g.acceptRegex && /tell|told|tells/i.test(g.acceptRegex)) { console.log(`  [${name}] ${g.id} acceptRegex = ${JSON.stringify(g.acceptRegex)}  sample=${JSON.stringify(g.sampleAnswer)}`); n3++; }
}
console.log(`acceptRegex 含 tell 家族: ${n3} 条`);
