import { grammarLessons } from '/tmp/audit50/gl.mjs';

const norm = s => String(s ?? '').toLowerCase().replace(/[^a-z0-9' ]/g, ' ').replace(/\s+/g, ' ').trim();
const toks = s => norm(s).split(' ').filter(Boolean);
const esc  = w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const wb   = (w, s) => new RegExp(`(?<![A-Za-z-])${esc(w)}(?![A-Za-z-])`).test(norm(s));

const FORMS = ['say', 'says', 'said'];
// 三种候选判据（依次收紧）
const P = {}; for (const f of FORMS) P[f] = { p1: [], p2: [], p3: [] };

for (const l of grammarLessons) {
  for (let k = 0; k < (l.contrast ?? []).length; k++) {
    const c = l.contrast[k]; if (c.bothRight === true) continue;
    const mk = norm(c.wrongMark ?? '');
    for (const f of FORMS) {
      // P1：词出现在 wrong 整句里（批 49 口径）
      if (wb(f, c.wrong)) P[f].p1.push(`L${l.number}c${k}«${c.wrong}»`);
      // P2：词出现在 wrong 里 且 不在 correct 里
      if (wb(f, c.wrong) && !wb(f, c.correct)) P[f].p2.push(`L${l.number}c${k}«${c.wrong}»`);
      // P3：词就是 wrongMark 指的那个词（教学认定的错误位点）
      if (mk.split(' ').includes(f)) P[f].p3.push(`L${l.number}c${k} mark="${c.wrongMark}" «${c.wrong}»→«${c.correct}»`);
    }
  }
  for (const g of (l.guided ?? [])) {
    if (!Array.isArray(g.options)) continue;
    for (const o of g.options) {
      const isAns = norm(o) === norm(g.answer);
      for (const f of FORMS) if (wb(f, o)) {
        P[f].p1.push(`L${l.number}opt«${o}»${isAns ? ' ⚠=answer' : ''}`);
        if (!isAns) { P[f].p2.push(`L${l.number}opt«${o}»`); P[f].p3.push(`L${l.number}opt«${o}»`); }
      }
    }
  }
  for (const p of (l.practice ?? [])) {
    if (!Array.isArray(p.distractors)) continue;
    for (const d of p.distractors) for (const f of FORMS) if (wb(f, d)) {
      P[f].p1.push(`L${l.number}dis«${d}»`); P[f].p2.push(`L${l.number}dis«${d}»`); P[f].p3.push(`L${l.number}dis«${d}»`);
    }
  }
}

console.log('=== say/says/said 在三种「错侧」判据下的计数 ===\n');
console.log('形式    P1 词现于错句(批49)   P2 词现于错句且不在正句   P3 词=wrongMark(教学位点)');
for (const f of FORMS)
  console.log(`${f.padEnd(6)} ${String(P[f].p1.length).padStart(12)} ${String(P[f].p2.length).padStart(20)} ${String(P[f].p3.length).padStart(20)}`);

console.log('\n--- P1 里「其实是正确答案」的槽（批49口径的核心污染）---');
for (const f of FORMS) {
  const bad = P[f].p1.filter(s => s.includes('⚠=answer'));
  if (bad.length) console.log(`  ${f}: ${bad.join(', ')}`);
}

console.log('\n--- P3（推荐口径）逐处凭证 ---');
for (const f of FORMS) {
  console.log(`\n【${f}】P3 = ${P[f].p3.length} 处`);
  P[f].p3.forEach(s => console.log('   ★ ' + s));
}

// ── 全库：wrongMark 不被正确句出现的比例（复核任务书 110）──
let onlyW = 0, both = 0, onlyC = 0;
for (const l of grammarLessons) for (const c of (l.contrast ?? [])) {
  if (c.bothRight === true) continue;
  const m = (c.wrongMark ?? '').trim(); if (!m) continue;
  const ws = toks(m);
  const iw = ws.some(w => wb(w, c.wrong)), ic = ws.some(w => wb(w, c.correct));
  if (iw && ic) both++; else if (iw) onlyW++; else onlyC++;
}
console.log('\n=== 全库 wrongMark 三分类（口径 S：逐词OR+词边界）===');
console.log('  只在错句', onlyW, '| 两边都有', both, '| 只在正确句', onlyC);
console.log('  （任务书写 499 / 110 / 65 —— 前两个数只有把 65 张多词卡误判才成立）');
