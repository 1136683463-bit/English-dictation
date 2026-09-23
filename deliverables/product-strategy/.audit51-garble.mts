/** 复核：多词跨度错点是否真的会生成「重复/残缺」的卡正面（可达性） */
import { huntCases } from "../../src/data/huntCases";
import { addHuntGapSentences } from "../../src/services/huntService";
const SPAN = (e: any) => (e.original ?? "").trim().split(/\s+/).filter(Boolean).length > 1;
let reach = 0;
const rows: string[] = [];
for (const hc of huntCases) {
  if (!hc.errors.some(SPAN)) continue;
  // 模拟：所有错点都算 gap（最坏情形，用户全看完提示）
  const emptyData = { cards: [], sentenceDetails: [], words: [], diaryEntries: [], grammarLessonsDone: [], grammarEvents: [], reviewQueue: [], reviewLogs: [] } as any;
  const { data, added } = addHuntGapSentences(emptyData, hc, hc.errors.map((e) => e.tokenIndex));
  reach += 1;
  rows.push(`── ${hc.id}  生成 ${added} 张卡`);
  data.cards.forEach((c: any) => {
    const dup = /(\b\w+\b)\s+\1\b/.test(c.front);
    rows.push(`     卡正面: ${c.front}${dup ? "   ⚠ 有相邻重复词" : ""}`);
  });
}
console.log(`含多词跨度错点的案件 ${reach} 个\n`);
rows.forEach((r) => console.log(r));
