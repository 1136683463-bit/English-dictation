/**
 * 第 51 批 · 下游消费者实测：correctedSentenceOf 对「移动」17 处的处理
 * 期望（正确句）来自讲解文案里给的写法；实际输出由函数给出。
 */
import { huntCases } from "../../src/data/huntCases";
import { correctedSentenceOf } from "../../src/services/huntService";
const MOVE_RE = /放到|移到|挪到|对调|调换|互换|搬|顺序调整/;
let n = 0, del = 0, nochange = 0, replaced = 0;
const rows: string[] = [];
for (const hc of huntCases) {
  const hits = hc.errors.filter((e) => MOVE_RE.test((e.correction ?? "").trim()));
  if (!hits.length) continue;
  const out = correctedSentenceOf(hc);
  const orig = hc.tokens.join(" ");
  for (const e of hits) {
    n += 1;
    const c = (e.correction ?? "").trim();
    const startsDel = /^（?去掉|去掉/.test(c);
    let verdict: string;
    if (startsDel) { del += 1; verdict = "走①删词分支 → 该词被 splice 删除（不是移动）"; }
    else if (/[\u4e00-\u9fa5]/.test(c)) { nochange += 1; verdict = "走③纯中文分支 → 该处保持原样（错句残留）"; }
    else { replaced += 1; verdict = "走替换分支"; }
    rows.push(`── ${hc.id}#${e.tokenIndex} tag=${e.tag}\n   corr = "${c}"\n   ${verdict}\n   原句: ${orig}\n   实得: ${out}\n   该词在实得句里还在吗? ${out.split(/\s+/).some((t) => t.replace(/[.,!?;:]+$/, "").toLowerCase() === e.original.replace(/[.,!?;:]+$/, "").toLowerCase()) ? "在" : "已不在"}`);
  }
}
console.log(`移动总数 ${n}：走删词分支 ${del}，走纯中文保持原样 ${nochange}，走替换 ${replaced}\n`);
rows.forEach((r) => console.log(r + "\n"));
