import { buildBoostItems } from "../../src/services/grammarBoostService.ts";
for (const [lid, tier] of [["lesson-153-yet-already", 1], ["lesson-180-whole", 1]] as const) {
  for (let r = 0; r < 16; r++) {
    for (const it of buildBoostItems(lid, tier, { round: r }) as any[]) {
      if (it.kind !== "cloze" || !it.clozeOptions) continue;
      const bad = it.clozeOptions.filter((o: string) => /(shs|chs|sss|xs|zzs)$/.test(String(o).toLowerCase()));
      if (bad.length) console.log(`${it.id} 仍有漏 -es 的干扰项:`, bad);
    }
  }
}
console.log("（无输出＝两道题都已干净）");
