import { grammarLessons } from '/tmp/audit50/gl.mjs';

// ── 唯一口径：小写 → 非 [a-z0-9'] → 空格 → 折叠。保留撇号（don't / It's / brother's 是一个 token）
const norm = s => String(s ?? '').toLowerCase().replace(/[^a-z0-9' ]/g, ' ').replace(/\s+/g, ' ').trim();
const toks = s => norm(s).split(' ').filter(Boolean);
const esc  = w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const wb   = (w, s) => new RegExp(`(?<![A-Za-z-])${esc(w)}(?![A-Za-z-])`).test(norm(s));

const lcs = (A, B) => {
  const n = A.length, m = B.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--)
    dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const D = [], I = []; let i = 0, j = 0;
  while (i < n && j < m) {
    if (A[i] === B[j]) { i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { D.push(A[i]); i++; }
    else { I.push(B[j]); j++; }
  }
  while (i < n) { D.push(A[i]); i++; }
  while (j < m) { I.push(B[j]); j++; }
  return { D, I };
};

const cards = [];
for (const l of grammarLessons) for (let k = 0; k < (l.contrast ?? []).length; k++) {
  const c = l.contrast[k];
  if (c.bothRight === true) continue;
  const m = (c.wrongMark ?? '').trim();
  if (!m) continue;
  cards.push({ L: l.number, k, m, w: c.wrong ?? '', c: c.correct ?? '' });
}

const single = cards.filter(x => toks(x.m).length === 1);
const multi  = cards.filter(x => toks(x.m).length > 1);

console.log('样本 =', cards.length, ' 单字 =', single.length, ' 多词 =', multi.length);

// ── 口径 T：整串 mark 作为完整 token ──
const T = (m, s) => toks(s).includes(norm(m));
const tW = single.filter(x => T(x.m, x.w)),  tWc = tW.filter(x => T(x.m, x.c));
console.log('\n【口径 T · 任务书】仅在单字卡上:');
console.log('  只在错句', tW.length - tWc.length, '| 两边都有', tWc.length);
console.log('  多词卡整串 token 命中 wrong 的:', multi.filter(x => T(x.m, x.w)).length, '/', multi.length);
console.log('  ⇒ else 桶 =', multi.length, '= 任务书「65」 ← 这就是那 65 的真相');

// ── 口径 S：逐词 OR + 词边界 ──
const S = (m, s) => toks(m).some(w => wb(w, s));
let s1 = 0, s2 = 0, s3 = 0;
for (const x of cards) { const a = S(x.m, x.w), b = S(x.m, x.c); if (a && b) s2++; else if (a) s1++; else s3++; }
console.log('\n【口径 S · 语义】全 674 张: 只在错句', s1, '| 两边都有', s2, '| 只在正确句', s3);

// ── 不变量 ──
console.log('\n【不变量】mark ⊄ wrong =', cards.filter(x => !x.w.includes(x.m)).length, '/', cards.length);

// ── 四象限：划词 vs 错误位点 ──
let q = { realReplace: 0, realDelete: 0, anchorIns: 0, anchorOther: 0 };
for (const x of cards) {
  const { D, I } = lcs(toks(x.w), toks(x.c));
  const ws = toks(x.m);
  const isDel = ws.some(v => D.includes(v));
  if (isDel && I.length) q.realReplace++;
  else if (isDel) q.realDelete++;
  else if (I.length) q.anchorIns++;
  else q.anchorOther++;
}
console.log('\n【划词 × 错误位点】674 张:');
console.log('  ① 划词=删除词,有插入(真·换掉):', q.realReplace);
console.log('  ② 划词=删除词,纯删除(真·多出):', q.realDelete);
console.log('  ③ 划词=锚点,有插入(缺词型)     :', q.anchorIns);
console.log('  ④ 划词=锚点,无插入(语序/大小写):', q.anchorOther);
console.log('  ★ 划词本身被换/删 =', q.realReplace + q.realDelete, `(${((q.realReplace + q.realDelete) / 674 * 100).toFixed(1)}%)`);
console.log('  ★ 划的只是位置     =', q.anchorIns + q.anchorOther, `(${((q.anchorIns + q.anchorOther) / 674 * 100).toFixed(1)}%)`);
