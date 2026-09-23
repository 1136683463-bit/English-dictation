import { grammarLessons } from "../../src/data/grammarLessons";
import { huntCases } from "../../src/data/huntCases";
const c: Record<string, number> = {};
let guided = 0, practice = 0;
for (const l of grammarLessons) {
  for (const g of l.guided ?? []) { guided += 1; c[g.kind] = (c[g.kind] ?? 0) + 1; }
  practice += (l.practice ?? []).length;
}
console.log("guided 总数", guided, JSON.stringify(c));
console.log("正面槽 = choose + arrange + replace =", (c.choose ?? 0) + (c.arrange ?? 0) + (c.replace ?? 0));
console.log("负面槽 = spot =", c.spot ?? 0);
console.log("practice 总数", practice);

let total = 0, br = 0, brNoMark = 0, nonBr = 0, nonBrNoMark = 0;
for (const l of grammarLessons) for (const x of l.contrast ?? []) {
  total += 1;
  const mk = (x.wrongMark ?? "").trim();
  if (x.bothRight) { br += 1; if (!mk) brNoMark += 1; } else { nonBr += 1; if (!mk) nonBrNoMark += 1; }
}
console.log(`对照卡 ${total} = 双正解 ${br} + 真错卡 ${nonBr}`);
console.log(`  双正解且无标注 ${brNoMark}；真错卡且无标注 ${nonBrNoMark}`);
console.log(`  有标注 ${total - brNoMark - nonBrNoMark}`);
console.log(`⇒ 「bothRight 省略 ⟺ wrong 是真错句」：真错卡 ${nonBr} 张，全部有真错句 —— 需 0 例外`);

// huntCases errors total & tags
const tags: Record<string, number> = {};
let errs = 0;
for (const h of huntCases) for (const e of h.errors) { errs += 1; tags[e.tag] = (tags[e.tag] ?? 0) + 1; }
console.log(`\nhuntCases ${huntCases.length} 案 / HuntError ${errs} 处；标签 ${Object.keys(tags).length} 种`);
