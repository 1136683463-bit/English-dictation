// 续查：① 未被 today 命中的 bothRight 候选是否会在别的 seen 状态下浮出来
//        ② `ned` 干扰项那道题
// 只读。运行：npx vite-node <此文件>
import { grammarLessons } from "../../src/data/grammarLessons.ts";
import { buildBoostItems, buildBoostSeenIndex, judgeBoostItem } from "../../src/services/grammarBoostService.ts";
import { normalizeLessonSentence } from "../../src/services/lessonService.ts";

const byId = new Map((grammarLessons as any[]).map((l) => [l.id, l]));

// bothRight 条目的 (课, 序号) 集合
const bothRightKeys = new Set<string>();
for (const l of grammarLessons as any[]) {
  for (const [i, c] of (l.contrast ?? []).entries()) {
    if (!c.bothRight) continue;
    if (!String(c.wrong ?? "").trim() || !String(c.correct ?? "").trim()) continue;
    if (normalizeLessonSentence(c.wrong) === normalizeLessonSentence(c.correct)) continue;
    bothRightKeys.add(`${l.id}#${i}`);
  }
}
console.log("bothRight 候选条目总数:", bothRightKeys.size);

// ── ① 让 seen 逐步累积，看潜藏候选会不会浮出来 ──
console.log("\n" + "=".repeat(78));
console.log("① seen 累积时，tier-3 改错题会换成哪些候选（抽 5 课演示）");
console.log("=".repeat(78));
const demoLessons = ["lesson-76-much-better", "lesson-87-its-cold", "lesson-114-a-few", "lesson-169-id-like", "lesson-55-ordinal"];
let globalSeenHits = new Set<string>();
for (const lid of demoLessons) {
  const seen = new Set<string>();
  const hitIds = new Set<string>();
  // 用真实的 seen 索引语义：把刚出过的 sourceRef 记为已见，再重取
  for (let step = 0; step < 8; step++) {
    const items = buildBoostItems(lid, 3, { seen, round: step }) as any[];
    const fixes = items.filter((i) => i.kind === "fix");
    for (const f of fixes) {
      const m = /-t3-fix-(\d+)$/.exec(f.id);
      if (m && bothRightKeys.has(`${lid}#${m[1]}`)) { hitIds.add(f.id); globalSeenHits.add(f.id); }
      if (f.sourceRef) seen.add(f.sourceRef);
    }
    // 把本轮所有 sourceRef 都记为已见，模拟「学习者已练过」
    for (const it of items) if (it.sourceRef) seen.add(it.sourceRef);
  }
  console.log(`  ${lid.padEnd(24)} 累计浮出的 bothRight 改错题: ${[...hitIds].join(", ") || "（无）"}`);
}
console.log(`\n  仅这 5 课在 seen 累积下就浮出 ${globalSeenHits.size} 道（16 轮空 seen 时全库是 4 道）`);

// ── ② ned 干扰项 ──
console.log("\n" + "=".repeat(78));
console.log("② 干扰项不是英语词的那道题");
console.log("=".repeat(78));
const target = "boost-lesson-161-need-to-t1-cloze-variants-1";
let found: any = null;
for (let r = 0; r < 16 && !found; r++) {
  for (const it of buildBoostItems("lesson-161-need-to", 1, { round: r }) as any[]) {
    if (it.id === target) { found = it; break; }
  }
}
if (!found) {
  console.log("  未生成该题（需要特定 round/weakSpotTag）");
} else {
  console.log("  题:", found.id, " kind:", found.kind, " tier: 1");
  console.log("  提示语:", found.promptZh);
  console.log("  题面:", JSON.stringify(found.cloze ?? found.sentence ?? found.prompt ?? "(见下)").slice(0, 200));
  console.log("  选项:", JSON.stringify(found.options));
  console.log("  正确答案:", JSON.stringify(found.answer));
  if (found.options && found.answer) {
    const bad = found.options.filter((o: string) => o === "ned");
    console.log("  非英语词选项:", bad.length ? bad : "无");
  }
  const j = judgeBoostItem(found, { text: String(found.answer) });
  console.log("  判分模拟（输入正确答案）:", j.passed ? "通过" : "不通过");
}
