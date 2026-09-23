/** 复核可达性：用真实建卡路径 makeAppData 造卡，检查多词跨度案的卡正面 */
import { huntCases } from "../../src/data/huntCases";
import { addHuntGapSentences } from "../../src/services/huntService";
import { makeAppData } from "../../src/edge/verify/fixtures";
import type { AppData } from "../../src/types";
const SPAN = (e: { original: string }) => (e.original ?? "").trim().split(/\s+/).filter(Boolean).length > 1;
const cardsFor = (c: (typeof huntCases)[number]): AppData =>
  addHuntGapSentences(makeAppData({ cards: [], schedules: [], sentenceDetails: [] }) as AppData, c, c.errors.map((e) => e.tokenIndex)).data;
let cases = 0, cardsN = 0, bad = 0;
const badRows: string[] = [];
for (const hc of huntCases) {
  if (!hc.errors.some(SPAN)) continue;
  cases += 1;
  const d = cardsFor(hc);
  cardsN += d.cards.length;
  for (const card of d.cards) {
    const dup = /\b(\w+)\s+\1\b/i.test(card.front);
    if (dup) { bad += 1; badRows.push(`  ${hc.id}: ${card.front}`); }
  }
  console.log(`── ${hc.id}（${d.cards.length} 张卡）`);
  d.cards.forEach((c) => console.log(`     ${c.front}`));
}
console.log(`\n含多词跨度错点案件 ${cases} 个，共 ${cardsN} 张卡；卡正面含「相邻重复词」的 ${bad} 张`);
badRows.forEach((r) => console.log(r));
