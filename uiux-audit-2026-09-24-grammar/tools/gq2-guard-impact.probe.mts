// 评估「给 tier-3 fix 通道补上 bothRight 守卫」的影响面（只读，不改 src/）。
// 运行：npx vite-node <此文件>
import { grammarLessons } from "../../src/data/grammarLessons.ts";
import { buildBoostItems, BOOST_TIER_META } from "../../src/services/grammarBoostService.ts";

const L = grammarLessons as any[];
const affected = ["lesson-76-much-better", "lesson-87-its-cold", "lesson-114-a-few", "lesson-169-id-like"];

let withGuard = 0, withoutGuard = 0, emptyAfterGuard: string[] = [], onlyOneLeft: string[] = [];
const perLesson: { id: string; total: number; both: number; left: number }[] = [];

for (const l of L) {
  const cs = l.contrast ?? [];
  const both = cs.filter((c: any) => c.bothRight).length;
  const left = cs.filter((c: any) =>
    !c.bothRight &&
    String(c.wrong ?? "").trim() && String(c.correct ?? "").trim()
  ).length;
  perLesson.push({ id: l.id, total: cs.length, both, left });
  withoutGuard += both;                    // 现状：bothRight 也能进 fix 候选
  withGuard += left;                       // 加守卫后：只剩非 bothRight
  if (left === 0 && cs.length > 0) emptyAfterGuard.push(l.id);
  if (left === 1) onlyOneLeft.push(l.id);
}

console.log("tier-3 fix 候选池（全库 205 课合计）");
console.log("  非 bothRight 条目（守卫保留）:", withGuard, "条");
console.log("  bothRight 条目（守卫排除）:  ", withoutGuard, "条");
console.log("  现状候选池 = 两者之和:       ", withGuard + withoutGuard, "条");
console.log("  → 加守卫后池子变为", withGuard, "条，减少", withoutGuard, "条");
console.log();
console.log("加守卫后 fix 通道会变空的课:", emptyAfterGuard.length ? emptyAfterGuard.join(", ") : "无");
console.log("加守卫后只剩 1 条 fix 候选的课:", onlyOneLeft.length, "课", onlyOneLeft.slice(0, 8).join(", "));

console.log("\n" + "=".repeat(76));
console.log("4 道受影响课：加守卫后 fix 通道改用哪些素材");
console.log("=".repeat(76));
for (const lid of affected) {
  const l = L.find((x) => x.id === lid)!;
  console.log(`\n${lid}`);
  for (const [i, c] of (l.contrast ?? []).entries()) {
    const tag = c.bothRight ? "bothRight=是 → 加守卫后被排除" : "bothRight=否 → 会被用作改错题";
    console.log(`  contrast[${i}]  ${tag}`);
    if (!c.bothRight) console.log(`      题面「${c.wrong}」 → 答案「${c.correct}」`);
  }
}

console.log("\n" + "=".repeat(76));
console.log("题量是否仍出得满（tier3 声明 " + BOOST_TIER_META[3].questionCount + " 题）");
console.log("=".repeat(76));
// 现状各课 tier3 题量分布
let short = 0; const shortList: string[] = [];
for (const l of L) {
  const items = buildBoostItems(l.id, 3, { round: 0 }) as any[];
  if (items.length < BOOST_TIER_META[3].questionCount) { short++; shortList.push(`${l.id}: ${items.length}`); }
}
console.log("现状（未加守卫）出不满的课:", short, shortList.slice(0, 5));
console.log("说明：fix 通道为空时代码走 `if (!picked) continue;` 再进 while 补位，");
console.log("      只要 produce/variant 仍有候选就能补满——逐课候选量见下。");
const lowProduce = L.filter((l) => ((l.variants ?? []).length + (l.sceneSwings ?? []).length + (l.examples ?? []).length) === 0);
console.log("produce/variant 完全无素材的课:", lowProduce.length ? lowProduce.map((x) => x.id).join(", ") : "无");
