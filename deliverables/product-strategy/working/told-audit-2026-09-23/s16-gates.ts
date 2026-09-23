import * as echo from "../../../../src/data/echoGateScripts";
import * as gate from "../../../../src/data/gateScripts";
import * as lib from "../../../../src/data/libraryGateScripts";
import * as lh from "../../../../src/data/lighthouseGateScripts";
import * as mk from "../../../../src/data/marketGateScripts";
import * as mt from "../../../../src/data/mountainGateScripts";
import * as wi from "../../../../src/data/worldGateIndex";
const W = (f: string, t?: string) => !!t && new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i").test(t);
console.log("=== worldGateIndex 导出 ===");
console.log(Object.keys(wi).join(", "));
console.log("\n=== 每个 gate 模块的导出 ===");
for (const [n, m] of Object.entries({ echo, gate, lib, lh, mk, mt }) as [string, any][]) {
  console.log(`  ${n}: ` + Object.keys(m).join(", "));
}
// 递归找所有字符串字段，标注哪些是「用户要作答的内容」
const ANSWER_SLOTS = /answer|expected|target|accept|solution|sample|correct|reply/i;
const SETUP_SLOTS = /setup|npcLine|npcReply|hint|prompt|title|scene|intro/i;
function walk(o: any, path: string, out: { path: string; text: string }[], depth = 0) {
  if (depth > 8 || o == null) return;
  if (typeof o === "string") { out.push({ path, text: o }); return; }
  if (Array.isArray(o)) { o.forEach((v, i) => walk(v, `${path}[${i}]`, out, depth + 1)); return; }
  if (typeof o === "object") { for (const k of Object.keys(o)) walk(o[k], path ? `${path}.${k}` : k, out, depth + 1); }
}
const all: { mod: string; path: string; text: string }[] = [];
for (const [n, m] of Object.entries({ echo, gate, lib, lh, mk, mt }) as [string, any][]) {
  const out: { path: string; text: string }[] = [];
  walk(m, "", out);
  for (const r of out) if (W("tell", r.text) || W("tells", r.text) || W("told", r.text)) all.push({ mod: n, ...r });
}
console.log(`\n=== gate 脚本里 tell 家族的全部落点（${all.length} 处）· 区分「作答字段」与「NPC/布景字段」===`);
for (const r of all) {
  const kind = ANSWER_SLOTS.test(r.path) ? "★作答" : SETUP_SLOTS.test(r.path) ? "布景/NPC" : "其他";
  console.log(`  [${kind}] ${r.mod} ${r.path}\n        ${JSON.stringify(r.text.slice(0, 200))}`);
}
