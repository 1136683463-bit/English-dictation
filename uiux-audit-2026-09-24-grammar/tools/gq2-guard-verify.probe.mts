// 验证：加守卫后 bothRightAsWrong 是否真的降到 0（用扫描的同口径集合）。
// 运行：npx vite-node <此文件>
import { grammarLessons } from "../../src/data/grammarLessons.ts";
import { buildBoostItems } from "../../src/services/grammarBoostService.ts";

const L = grammarLessons as any[];

// 扫描的同口径集合：bothRight 条目的 wrong 与 correct 都算
const bothRightStatements = new Set<string>();
for (const l of L) for (const c of (l.contrast ?? [])) {
  if (!c.bothRight) continue;
  bothRightStatements.add(String(c.wrong).trim());
  bothRightStatements.add(String(c.correct).trim());
}
console.log("bothRightStatements 集合大小:", bothRightStatements.size);

// 现状：找出所有 fix 题里 shapedFrom 命中该集合的
const hitNow = new Set<string>();
for (const l of L) for (let r = 0; r < 16; r++) for (const it of buildBoostItems(l.id, 3, { round: r }) as any[]) {
  if (it.kind === "fix" && it.shapedFrom && bothRightStatements.has(String(it.shapedFrom).trim())) hitNow.add(it.id);
}
console.log("现状命中的 fix 题:", hitNow.size, [...hitNow].join(", "));

// 加守卫后的候选：非 bothRight 的 contrast；看它们的 wrong 是否仍会命中集合
const stillHit: { lessonId: string; idx: number; wrong: string; correct: string; why: string }[] = [];
for (const l of L) {
  for (const [i, c] of (l.contrast ?? []).entries()) {
    if (c.bothRight) continue;
    const w = String(c.wrong ?? "").trim(), k = String(c.correct ?? "").trim();
    if (!w || !k) continue;
    if (bothRightStatements.has(w)) {
      stillHit.push({ lessonId: l.id, idx: i, wrong: w, correct: k, why: "wrong 撞上某条 bothRight 素材" });
    }
  }
}
console.log("\n加守卫后仍会命中的非 bothRight 改错候选:", stillHit.length, "条");
for (const h of stillHit) console.log(`  ${h.lessonId} contrast[${h.idx}]  题面「${h.wrong}」 → 答案「${h.correct}」   ${h.why}`);
console.log("\n→ 加守卫后 bothRightAsWrong 的预期值:", stillHit.length === 0 ? "0（可压到 0）" : `至多 ${stillHit.length}（不能压到 0，需再处理）`);

// 顺带验证 -e 加 d 的造词规则命中的词
console.log("\n" + "=".repeat(70));
console.log("`-e` 结尾加 d 造词规则：在课程词汇里会造出非词的动词");
const words = new Set<string>();
for (const l of L) {
  const add = (s?: string) => { if (s) String(s).toLowerCase().match(/[a-z]+/g)?.forEach((w) => words.add(w)); };
  add(l.targetSentence); (l.examples ?? []).forEach((x: any) => add(x.en));
  (l.sceneSwings ?? []).forEach((x: any) => add(x.en));
  (l.variants ?? []).forEach((x: any) => add(x.en));
  (l.practice ?? []).forEach((x: any) => add(x.answer));
  if (l.recall) add(l.recall.answer);
}
const badMorph: string[] = [];
for (const w of words) {
  if (!/e$/.test(w)) continue;
  if (/[^aeiou]y$/.test(w)) continue;
  const produced = w + "d";
  if (!words.has(produced)) badMorph.push(`${w} → ${produced}`);
}
console.log("课程词汇里以 e 结尾、且 +d 造出非词的原形:", badMorph.length, "个");
console.log("  ", badMorph.slice(0, 15).join(" ｜ "));
