/**
 * 第 51 批 · 逐条分类全部 81 条含中文的 correction（人工判据，代码只做归类与打印）
 * 运动类动词（宽口径）：放到 / 移到 / 挪到 / 对调 / 调换 / 互换 / 搬 / 顺序调整 / 跟在…后 / 并入上一句
 */
import { huntCases } from "../../src/data/huntCases";
const CJK = /[\u4e00-\u9fff]/;
// 宽口径：位次迁移
const MOVE = /放到|移到|挪到|对调|调换|互换|搬|顺序调整|跟在|并入/;
const DEL = /去掉|删除/;
type K = "纯删除" | "纯移动" | "删除+移动复合" | "替换或删除(二选一)" | "其它";
const buckets: Record<K, string[]> = { 纯删除: [], 纯移动: [], "删除+移动复合": [], "替换或删除(二选一)": [], 其它: [] };
let cjkTotal = 0;
for (const hc of huntCases) for (const e of hc.errors) {
  const c = (e.correction ?? "").trim();
  if (!CJK.test(c)) continue;
  cjkTotal += 1;
  const hasMove = MOVE.test(c), hasDel = DEL.test(c);
  let k: K;
  if (hasDel && hasMove) k = "删除+移动复合";
  else if (hasMove) k = "纯移动";
  else if (hasDel) {
    k = /或/.test(c) ? "替换或删除(二选一)" : "纯删除";
  } else k = "其它";
  buckets[k].push(`${hc.id}#${e.tokenIndex} tag=${e.tag} orig="${e.original}" corr="${c}"`);
}
console.log(`含中文 correction 总数 ${cjkTotal}\n`);
for (const k of Object.keys(buckets) as K[]) {
  console.log(`\n════ ${k}：${buckets[k].length} 条 ════`);
  buckets[k].forEach((s, i) => console.log(`${String(i + 1).padStart(3)}. ${s}`));
}
