/** 复核：pickCorrectionWord 把「标点补全型」当成可入库词 —— swim→"swim"（原词同）这种 */
import { huntCases } from "../../src/data/huntCases";
import { pickCorrectionWord } from "../../src/services/huntService";
const N = (s: string) => s.replace(/[^A-Za-z0-9']/g, "").toLowerCase();
let odd = 0; const rows: string[] = [];
for (const hc of huntCases) for (const e of hc.errors) {
  const w = pickCorrectionWord(e.correction ?? "");
  if (!w) continue;
  // 入库词与「原词去标点」相同 → 错误本里会出现「原词 → 原词」的卡
  if (N(w) === N(e.original)) { odd += 1; rows.push(`${hc.id}#${e.tokenIndex} tag=${e.tag} orig="${e.original}" corr="${e.correction}" → 入库词 "${w}"`); }
}
console.log(`入库词与去标点后的原词相同的（错词本会出现同词同形）: ${odd} 条`);
rows.forEach((r) => console.log("   " + r));
