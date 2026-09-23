import { grammarLessons } from '/tmp/audit50/gl.mjs';

const norm = s => String(s ?? '').toLowerCase().replace(/[^a-z0-9' ]/g, ' ').replace(/\s+/g, ' ').trim();
const toks = s => norm(s).split(' ').filter(Boolean);

// 自带盲区检查：wrongMark 为空的 52 张 —— 我的 P3 口径会漏掉它们
const noMark = [];
for (const l of grammarLessons) for (let k = 0; k < (l.contrast ?? []).length; k++) {
  const c = l.contrast[k]; if (c.bothRight === true) continue;
  if (!(c.wrongMark ?? '').trim()) noMark.push({ L: l.number, k, c });
}
console.log('★ 我的 P3 口径的盲区：wrongMark 为空的真错卡 =', noMark.length, '张');
console.log('（这些是「整句层面」的错，无单一错词可指——P3 天然漏掉，必须单列）\n');
noMark.slice(0, 14).forEach(x => {
  console.log(`L${x.L}c${x.k} "${x.c.wrong}" → "${x.c.correct}"`);
  console.log(`   whyZh: ${(x.c.whyZh ?? '').slice(0, 90)}`);
});

// 52 张里有没有含 say/says/said 的？→ 影响三形状统计
console.log('\n52 张无标记卡中含 say/says/said 的：');
const wb = (w, s) => new RegExp(`(?<![A-Za-z-])${w}(?![A-Za-z-])`, 'i').test(s);
let hit = 0;
for (const x of noMark) for (const f of ['say', 'says', 'said']) if (wb(f, x.c.wrong)) { hit++; console.log(`  L${x.L}c${x.k} ${f}: "${x.c.wrong}"`); }
console.log('  合计', hit, '处 ⇒ P3 口径下会漏记这些（需在报告里声明）');

// 反向：P3 口径是否也会把「正确答案」算进来？——不会，因为 wrongMark 只出现在 wrong 里（已验证不变量）
console.log('\n★ P3 的反向安全性验证：wrongMark 是否可能等于正确句里的词？');
let p3Risk = 0;
for (const l of grammarLessons) for (const c of (l.contrast ?? [])) {
  if (c.bothRight === true) continue;
  const m = (c.wrongMark ?? '').trim(); if (!m) continue;
  const ws = toks(m);
  const D = toks(c.wrong), C = toks(c.correct);
  // 若被划词在正确句里「同一个位置」也存在 → 说明划的是位置不是词
  if (ws.some(w => C.includes(w))) p3Risk++;
}
console.log('  被划词（任一词）也出现在正确句里的卡 =', p3Risk, '/ 674');
console.log('  ⇒ P3 仍可能指向「位置」而非「词形」——但它指向的位置**经教学认定**，这是关键区别。');
console.log('  ⇒ 判据必须写成：「词 = wrongMark」而非「词 ∈ wrong」或「词 ∉ correct」。');
