// 扫描全库 cloze 题的干扰项，找出「加后缀造词」造出的非词（只读）。
// 用法：npx vite-node <此文件>
import { grammarLessons } from "../../src/data/grammarLessons.ts";
import { buildBoostItems } from "../../src/services/grammarBoostService.ts";

const L = grammarLessons as any[];
const seen = new Map<string, { opt: string; ids: Set<string> }>();
for (const l of L) {
  for (const tier of [1, 2, 3] as const) {
    for (let r = 0; r < 16; r++) {
      for (const it of buildBoostItems(l.id, tier, { round: r }) as any[]) {
        if (it.kind !== "cloze" || !it.clozeOptions) continue;
        for (const o of it.clozeOptions) {
          const k = String(o).toLowerCase();
          if (k === String(it.clozeAnswer).toLowerCase()) continue;
          const e = seen.get(k) ?? { opt: o, ids: new Set<string>() };
          e.ids.add(it.id); seen.set(k, e);
        }
      }
    }
  }
}
console.log("全库去重后的 cloze 干扰项候选词:", seen.size, "个");

// 造词痕迹：形如 base+"d" / base+"s" 但 base 本身已是 -ed/-s 形，或明显重复字母
const suspicious: { opt: string; n: number; why: string; ids: string[] }[] = [];
for (const [k, e] of seen) {
  const why: string[] = [];
  if (/d$/.test(k) && /[^aeiou]d$/.test(k.replace(/d$/, "")) && !k.endsWith("ed")) why.push("疑似 +d 造词");
  if (/dd$/.test(k) || /ss$/.test(k) && !["pass","class","glass","less","guess","grass","dress","cross","press"].includes(k)) why.push("重复辅音");
  if (/(s|ed|ing)$/.test(k)) {
    const stem = k.replace(/ies$/, "y").replace(/ing$/, "").replace(/ed$/, "").replace(/s$/, "");
    if (stem.length >= 2 && stem === k.replace(/d$/, "") && !k.endsWith("ed")) why.push("词干+e 造词");
  }
  if (why.length) suspicious.push({ opt: e.opt, n: e.ids.size, why: why.join("+"), ids: [...e.ids].slice(0, 3) });
}
console.log("\n可疑（可能不是真词）:", suspicious.length, "个");
for (const s of suspicious.sort((a, b) => a.opt.localeCompare(b.opt))) {
  console.log(`  「${s.opt}」出现于 ${s.n} 道题  [${s.why}]  例: ${s.ids.join(", ")}`);
}

// 直接点名几个已知/推断的目标
console.log("\n点名核查:");
for (const w of ["ned", "liks", "livs", "closs", "haved", "ared", "speedd", "usd", "gos", "dos"]) {
  const e = seen.get(w);
  console.log(`  ${w.padEnd(8)} ${e ? `出现于 ${e.ids.size} 道题（例 ${[...e.ids][0]}）` : "未出现在任何 cloze 干扰项里"}`);
}
