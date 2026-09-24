// 核实 zhMultiAnswerSingleKey：同一句中文在全库有多种合法英文写法，题目却只认一个。
// 复现扫描的判据（与 src/edge/verify/gq2-boost-items.test.ts B-6 同口径），并加判分模拟。
// 只读。运行：npx vite-node <此文件>
import { grammarLessons } from "../../src/data/grammarLessons.ts";
import { buildBoostItems, judgeBoostItem } from "../../src/services/grammarBoostService.ts";

const L = grammarLessons as any[];
const norm = (v: string): string =>
  v.toLowerCase().replace(/[.,!?;:'"’‘“”()\[\]{}]/g, "").replace(/\s+/g, " ").trim();

// ── ① 归一化英文 → 课内原文（用于把扫描结果还原成人能读的句子）──
const rawEn = new Map<string, string>();
const addRaw = (e?: string) => { if (e && e.trim()) rawEn.set(norm(e), e.trim()); };
for (const lesson of L) {
  addRaw(lesson.targetSentence);
  (lesson.examples ?? []).forEach((x: any) => addRaw(x.en));
  (lesson.sceneSwings ?? []).forEach((x: any) => addRaw(x.en));
  (lesson.variants ?? []).forEach((x: any) => addRaw(x.en));
  (lesson.practice ?? []).forEach((x: any) => addRaw(x.answer));
  if (lesson.recall) addRaw(lesson.recall.answer);
}
const restore = (key: string): string => rawEn.get(key) ?? key;

// ── ② 全库「中文 → 英文」映射（与扫描 B-6 同口径）──
const zhToEn = new Map<string, Map<string, string[]>>();
const push = (zh: string, en: string, who: string): void => {
  const z = (zh ?? "").trim(), e = (en ?? "").trim();
  if (!z || !e) return;
  const bucket = zhToEn.get(z) ?? new Map<string, string[]>();
  const key = norm(e);
  bucket.set(key, [...(bucket.get(key) ?? []), who]);
  zhToEn.set(z, bucket);
};
for (const lesson of L) {
  push(lesson.intentZh, lesson.targetSentence, `${lesson.id}:target`);
  (lesson.examples ?? []).forEach((x: any) => push(x.zh, x.en, `${lesson.id}:example`));
  (lesson.sceneSwings ?? []).forEach((x: any) => push(x.zh, x.en, `${lesson.id}:swing`));
  (lesson.variants ?? []).forEach((x: any) => push(x.zh, x.en, `${lesson.id}:variant`));
  (lesson.practice ?? []).forEach((x: any) => push(x.promptZh, x.answer, `${lesson.id}:practice`));
  if (lesson.recall) push(lesson.recall.intentZh, lesson.recall.answer, `${lesson.id}:recall`);
}
console.log("全库「同一句中文有多个英文写法」的条目:", [...zhToEn.values()].filter((b) => b.size > 1).length);

// ── ③ 找出全部 such 题 ──
type Hit = { id: string; lessonId: string; tier: number; kind: string; intentZh: string; answer: string; alts: { en: string; who: string }[]; item: any };
const hits = new Map<string, Hit>();
for (const lesson of L) {
  for (const tier of [1, 2, 3] as const) {
    for (let round = 0; round < 16; round++) {
      for (const item of buildBoostItems(lesson.id, tier, { round }) as any[]) {
        if (!["recall", "translate", "produce"].includes(item.kind)) continue;
        const iz = String(item.intentZh ?? "").trim();
        if (!iz) continue;
        const bucket = zhToEn.get(iz);
        if (!bucket || bucket.size <= 1) continue;
        const others = [...bucket.entries()].filter(([k]) => k !== norm(item.answer));
        if (others.length === 0) continue;
        if (hits.has(item.id)) continue;
        hits.set(item.id, {
          id: item.id, lessonId: lesson.id, tier, kind: item.kind,
          intentZh: iz, answer: item.answer,
          alts: others.map(([k, whos]) => ({ en: restore(k), who: whos[0] })),
          item
        });
      }
    }
  }
}
const all = [...hits.values()];
console.log("命中题数（复现值）:", all.length, "   ← 扫描报的是 29");
console.log("涉及课程:", new Set(all.map((h) => h.lessonId)).size, "课");

// ── ④ 判分模拟 ──
console.log("\n" + "=".repeat(84));
console.log("判分模拟（项目自己的 judgeBoostItem）");
console.log("=".repeat(84));
let altAccepted = 0, altRejected = 0;
const blocks: string[] = [];
for (const h of all) {
  const jOwn = judgeBoostItem(h.item, { text: h.answer });
  const results = h.alts.map((a) => {
    const j = judgeBoostItem(h.item, { text: a.en });
    if (j.passed) altAccepted++; else altRejected++;
    return { ...a, passed: j.passed, score: (j as any).score };
  });
  blocks.push(
    `${h.id}   [${h.kind} t${h.tier}]\n` +
    `    中文: 「${h.intentZh}」\n` +
    `    只认: 「${h.answer}」 → ${jOwn.passed ? "通过" : "不通过"}\n` +
    results.map((r) => `    另一解: 「${r.en}」 (课内出处 ${r.who}) → ${r.passed ? "通过" : `**不通过（${r.score ?? "-"} 分）**`}`).join("\n")
  );
}
console.log(blocks.slice(0, 12).join("\n\n"));
if (blocks.length > 12) console.log(`\n...（其余 ${blocks.length - 12} 道见下方按课汇总）`);

const atLeastOneBad = all.filter((h) => h.alts.some((a) => !judgeBoostItem(h.item, { text: a.en }).passed));
console.log("\n" + "-".repeat(84));
console.log(`合计：另一解被接受 ${altAccepted} 次，被拒绝 ${altRejected} 次`);
console.log(`「至少有一个合法另一解会被判错」的题：${atLeastOneBad.length} / ${all.length}`);

console.log("\n按课汇总（这些课的题面中文都有多个合法英文写法，而题目只认一个）：");
const byLesson = new Map<string, number>();
for (const h of all) byLesson.set(h.lessonId, (byLesson.get(h.lessonId) ?? 0) + 1);
for (const [lid, n] of [...byLesson.entries()].sort((a, b) => b[1] - a[1])) console.log(`  ${lid}  ×${n}`);

console.log("\n被判错的具体「另一解」清单：");
for (const h of atLeastOneBad) {
  for (const a of h.alts) {
    const j = judgeBoostItem(h.item, { text: a.en });
    if (!j.passed) console.log(`  ${h.id}  写出「${a.en}」→ 不通过（${(j as any).score ?? "-"} 分）；只认「${h.answer}」`);
  }
}
