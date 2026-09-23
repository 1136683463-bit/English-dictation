/**
 * 第 51 批 · 隐藏的移动（二）：纯英文 correction 里，correction 与 original 是「同词集重排」的
 * 判据：两边都切词、小写去标点后，作为多重集合相等，但顺序不同 → 换位（不是替换/增删）
 */
import { huntCases } from "../../src/data/huntCases";
const words = (s: string) => s.toLowerCase().replace(/[^a-z0-9' ]/g, " ").split(/\s+/).filter(Boolean);
const CJK = /[\u4e00-\u9fff]/;
const hits: string[] = [];
const multisetEq = (a: string[], b: string[]) => {
  if (a.length !== b.length) return false;
  const s = [...a].sort(), t = [...b].sort();
  return s.every((x, i) => x === t[i]);
};
let multi = 0;
for (const hc of huntCases) for (const e of hc.errors) {
  const c = (e.correction ?? "").trim(), o = (e.original ?? "").trim();
  if (CJK.test(c)) continue;
  const cw = words(c), ow = words(o);
  if (cw.length < 2) continue;
  multi += 1;
  if (multisetEq(cw, ow)) hits.push(`${hc.id}#${e.tokenIndex} tag=${e.tag} orig="${o}" corr="${c}"`);
}
console.log(`纯英文 · correction 多词的总数 ${multi}`);
console.log(`\n════ 其中「同词集重排」= 换位（${hits.length} 条）════`);
hits.forEach((s, i) => console.log(`${String(i + 1).padStart(3)}. ${s}`));

// 反向：original 是多词、correction 是其中的子集 → 删词（纯英文形态的删词）
console.log("\n\n════ 纯英文 correction 是 original 的真子集（= 删词，同词集减一）════");
const sub: string[] = [];
for (const hc of huntCases) for (const e of hc.errors) {
  const c = (e.correction ?? "").trim(), o = (e.original ?? "").trim();
  if (CJK.test(c)) continue;
  const cw = words(c), ow = words(o);
  if (cw.length === 0 || ow.length === 0) continue;
  if (cw.length < ow.length && cw.every((w, i) => w === ow[i])) sub.push(`${hc.id}#${e.tokenIndex} tag=${e.tag} orig="${o}" corr="${c}"`);
}
console.log(`共 ${sub.length} 条`); sub.forEach((s) => console.log("   " + s));

// 纯英文 correction 比 original 多词且原词全在其中 → 补词
console.log("\n\n════ 纯英文 correction 含 original 全部词 + 有新增（= 补词）════");
const add: string[] = [];
for (const hc of huntCases) for (const e of hc.errors) {
  const c = (e.correction ?? "").trim(), o = (e.original ?? "").trim();
  if (CJK.test(c)) continue;
  const cw = words(c), ow = words(o);
  if (ow.length === 0 || cw.length <= ow.length) continue;
  if (ow.every((w) => cw.includes(w))) add.push(`${hc.id}#${e.tokenIndex} tag=${e.tag} orig="${o}" corr="${c}"`);
}
console.log(`共 ${add.length} 条（前 40）`); add.slice(0, 40).forEach((s) => console.log("   " + s));
