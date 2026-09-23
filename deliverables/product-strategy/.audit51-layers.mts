/**
 * 第 51 批 · 分层计数：把「移动」按判据宽严分四层，看 13 是哪一层
 */
import { huntCases } from "../../src/data/huntCases";
const all: { id: string; idx: number; o: string; c: string; tag: string; exp: string }[] = [];
for (const hc of huntCases) for (const e of hc.errors) all.push({ id: hc.id, idx: e.tokenIndex, o: e.original, c: (e.correction ?? "").trim(), tag: e.tag, exp: e.explanation });

const layers: { name: string; re: RegExp }[] = [
  { name: "L1「去掉（X 放到 Y 前/后）」字面", re: /^去掉（[^）]*放到[^）]*[前后][^）]*）$/ },
  { name: "L2 = L1 + 其它『去掉（…）』里含位移词（搬/顺序调整/移到/挪到）", re: /^去掉（[^）]*?(放到|移到|挪到|搬|顺序调整)[^）]*）$|^去掉 [A-Za-z]+（[^）]*?(搬|放到|移到)[^）]*）$/ },
  { name: "L3 = L2 + 对调/调换/互换", re: /^去掉（[^）]*?(放到|移到|挪到|搬|顺序调整)[^）]*）$|^去掉 [A-Za-z]+（[^）]*?(搬|放到|移到)[^）]*）$|^（[^）]*(对调|调换|互换)[^）]*）$/ },
  { name: "L4 = L3 + 并入上一句 / 跟在…后（位置说明）", re: /^去掉（[^）]*?(放到|移到|挪到|搬|顺序调整)[^）]*）$|^去掉 [A-Za-z]+（[^）]*?(搬|放到|移到)[^）]*）$|^（[^）]*(对调|调换|互换|跟在)[^）]*）$|并入上一句/ },
];
for (const L of layers) {
  const hit = all.filter((x) => L.re.test(x.c));
  console.log(`\n════ ${L.name} → ${hit.length} 条 ════`);
  hit.forEach((x) => console.log(`   ${x.id}#${x.idx} "${x.o}" → "${x.c}"`));
}
