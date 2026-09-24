// 用项目自己的数据与生成器核实：tier-3 改错题里有多少题面与答案「不是同一句」。
// 只读，不修改 src/。运行：npx vite-node <此文件>
import { grammarLessons } from "../../src/data/grammarLessons.ts";
import { buildBoostItems, judgeBoostItem, BOOST_TIER_META } from "../../src/services/grammarBoostService.ts";
import { normalizeLessonSentence } from "../../src/services/lessonService.ts";

const lessons = grammarLessons;
console.log("课程总数:", lessons.length);

// ── 1. 候选池：所有 bothRight=true 的 contrast 条目（每条都可能是 boost-<课>-t3-fix-<序号>）──
type Pool = { lessonId: string; idx: number; wrong: string; correct: string; sameSentence: boolean };
const pool: Pool[] = [];
for (const lesson of lessons as any[]) {
  const contrasts = lesson.contrast ?? [];
  for (const [idx, c] of contrasts.entries()) {
    if (!c.bothRight) continue;
    if (!String(c.wrong ?? "").trim() || !String(c.correct ?? "").trim()) continue;
    if (normalizeLessonSentence(c.wrong) === normalizeLessonSentence(c.correct)) continue;
    pool.push({
      lessonId: lesson.id, idx,
      wrong: c.wrong, correct: c.correct,
      // 用项目自己的归一化判断「是不是同一句的两种写法」：忽略大小写、标点、缩写撇号
      sameSentence: normalizeLessonSentence(c.wrong).replace(/'/g, "") ===
                    normalizeLessonSentence(c.correct).replace(/'/g, "")
    });
  }
}
console.log("\n【候选池】bothRight=true 且两道句非同文的 contrast 条目:", pool.length, "条");
console.log("  覆盖课程:", new Set(pool.map((p) => p.lessonId)).size, "课");
console.log("  其中「同一句的两种写法」（只差缩写/大小写/标点）:", pool.filter((p) => p.sameSentence).length);
console.log("  其中「本来就是两句不同的话」:", pool.filter((p) => !p.sameSentence).length);

// ── 2. 实际会生成的 fix 题：跑 16 轮，收集去重后的 t3 fix 题 ──
type Surfaced = { id: string; lessonId: string; shapedFrom: string; answer: string; promptZh: string; fromBothRight: boolean; sameSentence: boolean };
const surfaced = new Map<string, Surfaced>();
for (const lesson of lessons as any[]) {
  for (let round = 0; round < 16; round++) {
    for (const item of buildBoostItems(lesson.id, 3, { round }) as any[]) {
      if (item.kind !== "fix") continue;
      if (surfaced.has(item.id)) continue;
      const hit = pool.find((p) => p.lessonId === lesson.id && `boost-${lesson.id}-t3-fix-${p.idx}` === item.id);
      surfaced.set(item.id, {
        id: item.id, lessonId: lesson.id,
        shapedFrom: item.shapedFrom ?? "", answer: item.answer ?? "",
        promptZh: item.promptZh ?? "",
        fromBothRight: Boolean(hit), sameSentence: hit?.sameSentence ?? false
      });
    }
  }
}
const all = [...surfaced.values()];
const bad = all.filter((s) => s.fromBothRight);
console.log("\n【实际生成】16 轮里去重后的 t3 fix 题:", all.length, "道");
console.log("  其中题面取自 bothRight 素材的:", bad.length, "道  ← 扫描报的是 4，这里是全量");
console.log("  其中题面与答案「本来就是两句不同的话」:", bad.filter((s) => !s.sameSentence).length, "道");

// ── 3. 逐题看学习者会看到什么，并模拟判分 ──
console.log("\n" + "=".repeat(78));
console.log("题面取自 bothRight 素材的改错题（学习者视角 + 判分模拟）");
console.log("=".repeat(78));
for (const s of bad.slice(0, 10)) {
  const item = (buildBoostItems(s.lessonId, 3, { round: 0 }) as any[]).find((i) => i.id === s.id) ??
    (() => { for (let r = 0; r < 16; r++) { const f = (buildBoostItems(s.lessonId, 3, { round: r }) as any[]).find((i) => i.id === s.id); if (f) return f; } return null; })();
  console.log(`\n课: ${s.lessonId}  题: ${s.id}`);
  console.log(`  提示语: 「${s.promptZh}」`);
  console.log(`  题面(被判为"错"的句子): 「${s.shapedFrom}」`);
  console.log(`  标准答案: 「${s.answer}」`);
  console.log(`  是否同一句的两种写法: ${s.sameSentence ? "是" : "否 ← 题面与答案无关/意思不同"}`);
  if (item) {
    const jCorrect = judgeBoostItem(item, { text: s.answer });
    const jShown = judgeBoostItem(item, { text: s.shapedFrom });
    console.log(`  判分模拟：输入标准答案 → ${jCorrect.passed ? "通过" : "不通过"}（${(jCorrect as any).score ?? "-"} 分）`);
    console.log(`  判分模拟：输入题面那句 → ${jShown.passed ? "通过" : "不通过"}（${(jShown as any).score ?? "-"} 分）`);
  }
}

// ── 4. 计分线参考 ──
console.log("\n[参考] 三档题量:", [1, 2, 3].map((t) => `${t}=${(BOOST_TIER_META as any)[t].questionCount}`).join(" "));
