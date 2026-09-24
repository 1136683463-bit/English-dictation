import { buildBoostItems, judgeBoostItem } from "../../src/services/grammarBoostService.ts";
const target = "boost-lesson-161-need-to-t1-cloze-variants-1";
let found: any = null;
for (let r = 0; r < 16 && !found; r++) {
  for (const it of buildBoostItems("lesson-161-need-to", 1, { round: r }) as any[]) if (it.id === target) { found = it; break; }
}
if (!found) { console.log("未生成"); } else {
  console.log("字段:", Object.keys(found).join(", "));
  console.log();
  for (const k of Object.keys(found)) {
    const v = found[k];
    if (v === undefined || v === null || v === "") continue;
    console.log(`  ${k} = ${typeof v === "object" ? JSON.stringify(v) : JSON.stringify(String(v)).slice(0, 160)}`);
  }
  console.log("\n判分（输入选项里的正确词）:");
  const opts: string[] = found.options ?? [];
  for (const o of opts) {
    try { const r = judgeBoostItem(found, { text: o }); console.log(`   「${o}」 → ${r.passed ? "通过" : "不通过"}`); } catch (e) { console.log(`   「${o}」 → 判分报错`); }
  }
}
