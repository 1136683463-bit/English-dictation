import { grammarLessons } from "../../../../src/data/grammarLessons";
import { huntCases } from "../../../../src/data/huntCases";

// Enumerate every string-valued slot path across lessons, to build an explicit
// correct-side / wrong-side classification rather than guessing.
const slotCount = new Map<string, number>();
function walk(node: unknown, path: string) {
  if (node === null || node === undefined) return;
  if (typeof node === "string") {
    slotCount.set(path, (slotCount.get(path) ?? 0) + 1);
    return;
  }
  if (Array.isArray(node)) {
    for (const item of node) walk(item, path + "[]");
    return;
  }
  if (typeof node === "object") {
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      walk(v, path ? path + "." + k : k);
    }
  }
}
for (const l of grammarLessons) walk(l, "");
const rows = [...slotCount.entries()].sort((a, b) => b[1] - a[1]);
console.log("SLOT INVENTORY (lessons) — " + rows.length + " string slots, field-instances:");
for (const [p, c] of rows) console.log(String(c).padStart(5) + "  " + p);

// hunt cases
const hs = new Map<string, number>();
for (const c of huntCases) walk(c, "");
console.log("\nSLOT INVENTORY (huntCases):");
for (const [p, c] of [...hs.entries()].length ? [] : []) void c;
const h2 = new Map<string, number>();
for (const c of huntCases) {
  const rec = c as unknown as Record<string, unknown>;
  for (const [k, v] of Object.entries(rec)) {
    if (typeof v === "string") h2.set(k, (h2.get(k) ?? 0) + 1);
    else if (Array.isArray(v)) { for (const it of v) walk(it, "hunt." + k + "[]"); }
  }
}
for (const [p, c] of [...h2.entries()].sort((a,b)=>b[1]-a[1])) console.log(String(c).padStart(5) + "  " + p);
for (const [p, c] of [...hs.entries()].sort((a,b)=>b[1]-a[1])) console.log(String(c).padStart(5) + "  hunt." + p);
