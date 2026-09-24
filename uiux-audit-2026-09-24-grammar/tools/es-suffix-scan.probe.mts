// 扫全库 cloze 干扰项，找「-s 造词规则漏了 -es」的产物（-sh/-ch/-s/-x/-z 结尾的动词）。
// 特征：以 shs/chs/sss/xs/zzs 结尾、且剥掉末尾 s 后是真词（说明是硬加 s 造出来的）。
import { grammarLessons } from "../../src/data/grammarLessons.ts";
import { buildBoostItems } from "../../src/services/grammarBoostService.ts";

const L = grammarLessons as any[];
const seen = new Map<string, Set<string>>();
for (const l of L) {
  for (const tier of [1, 2, 3] as const) {
    for (let r = 0; r < 16; r++) {
      for (const it of buildBoostItems(l.id, tier, { round: r }) as any[]) {
        if (it.kind !== "cloze" || !it.clozeOptions) continue;
        for (const o of it.clozeOptions) {
          const k = String(o).toLowerCase();
          if (k === String(it.clozeAnswer).toLowerCase()) continue;
          const set = seen.get(k) ?? new Set<string>();
          set.add(it.id); seen.set(k, set);
        }
      }
    }
  }
}
console.log("全库去重 cloze 干扰项:", seen.size, "个");
const suspicious: [string, number, string[]][] = [];
for (const [w, ids] of seen) {
  if (/(shs|chs|sss|xs|zzs|zes)$/.test(w)) suspicious.push([w, ids.size, [...ids].slice(0, 3)]);
}
console.log("\n疑似「漏 -es」的干扰项:", suspicious.length, "个");
for (const [w, n, ids] of suspicious.sort((a, b) => b[1] - a[1])) {
  console.log(`  ${w.padEnd(14)} ${n} 道题   例: ${ids.join(", ")}`);
}
