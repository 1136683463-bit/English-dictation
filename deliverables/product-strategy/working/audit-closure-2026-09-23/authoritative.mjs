import { grammarLessons } from '/tmp/audit50/gl.mjs';

// 唯一正确口径：小写 → 非 [a-z0-9'] 字符转空格 → 折叠空格（保留撇号，don't / It's / brother's 是完整 token）
const norm = s => String(s??'').toLowerCase().replace(/[^a-z0-9' ]/g,' ').replace(/\s+/g,' ').trim();
const toks = s => norm(s).split(' ').filter(Boolean);
const esc  = w => w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const rx   = w => new RegExp(`(?<![A-Za-z-])${esc(w)}(?![A-Za-z-])`,'i');

const cards=[];
for(const l of grammarLessons) for(let i=0;i<(l.contrast??[]).length;i++){
  const c=l.contrast[i]; if(c.bothRight===true) continue;
  const m=(c.wrongMark??'').trim(); if(!m) continue;
  cards.push({L:l.number,i,m,w:c.wrong??'',c:c.correct??''});
}

console.log('样本（真错卡且 wrongMark 非空）=', cards.length);

// ── 口径 T（任务书）：整串 mark 作为 token 精确出现在句中 ──
const T = (m,s) => toks(s).includes(norm(m));
let t={onlyW:0,both:0,else:0};
for(const x of cards){const a=T(x.m,x.w),b=T(x.m,x.c);
  if(a&&b)t.both++; else if(a)t.onlyW++; else t.else++;}
console.log('\n【口径 T · 任务书】整串 token 精确');
console.log('  只在错句 %d | 两边都有 %d | 第三桶 %d   ⇒ 合计 %d', t.onlyW,t.both,t.else,t.onlyW+t.both+t.else);

// ── 口径 S（语义）：逐词 OR + 词边界 ──
const S = (m,s) => norm(m).split(' ').filter(Boolean).some(w=>rx(w).test(norm(s)));
let s={onlyW:0,both:0,onlyC:0};
for(const x of cards){const a=S(x.m,x.w),b=S(x.m,x.c);
  if(a&&b)s.both++; else if(a)s.onlyW++; else s.onlyC++;}
console.log('\n【口径 S · 语义】逐词 OR + 词边界');
console.log('  只在错句 %d | 两边都有 %d | 只在正确句 %d ⇒ 合计 %d', s.onlyW,s.both,s.onlyC,s.onlyW+s.both+s.onlyC);

// ── 不变量 ──
console.log('\n【不变量】mark ⊄ wrong 的卡数 =', cards.filter(x=>!x.w.includes(x.m)).length, '/', cards.length);

// ── 65 张多词卡的迁移 ──
const multi = cards.filter(x=>norm(x.m).split(' ').filter(Boolean).length>1);
let mv={b:0,w:0,n:0};
for(const x of multi){const a=S(x.m,x.w),b=S(x.m,x.c); if(a&&b)mv.b++; else if(a)mv.w++; else mv.n++;}
console.log('\n【65 张多词卡】其中标记是整串 token 的 =', multi.filter(x=>T(x.m,x.w)).length);
console.log('  用口径 S 归类: 两边都有 %d | 只在错句 %d | 都没有 %d', mv.b, mv.w, mv.n);
console.log('  ⇒ 任务书 %d(只在正确句) 实为「整串 token 匹配失败的 %d 张多词卡」，其中 %d 张在口径 S 下是「两边都有」',
  t.else, multi.length, mv.b);
console.log('  ⇒ 修正后：只在错句 %d | 两边都有 %d | 只在正确句 %d', t.onlyW+mv.w, t.both+mv.b, 0);

// ── 674 张的四象限（划的词 vs diff）──
const lcs=(A,B)=>{const n=A.length,m=B.length,dp=Array.from({length:n+1},()=>new Array(m+1).fill(0));
 for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)dp[i][j]=A[i]===B[j]?dp[i+1][j+1]+1:Math.max(dp[i+1][j],dp[i][j+1]);
 const D=[],I=[];let i=0,j=0;
 while(i<n&&j<m){if(A[i]===B[j]){i++;j++;}else if(dp[i+1][j]>=dp[i][j+1]){D.push(A[i]);i++;}else{I.push(B[j]);j++;}}
 while(i<n){D.push(A[i]);i++;}while(j<m){I.push(B[j]);j++;}return{D,I};};

let q={a:0,b:0,c:0,d:0};
for(const x of cards){const {D,I}=lcs(toks(x.w),toks(x.c));
  const ws=norm(x.m).split(' '); const isDel=ws.some(v=>D.includes(v));
  if(isDel&&I.length)q.a++; else if(isDel)q.b++; else if(I.length)q.c++; else q.d++;}
console.log('\n【674 张 × diff 结构】');
console.log('  ① 划词=删除词 且有插入  : %d', q.a);
console.log('  ② 划词=删除词 纯删除    : %d', q.b);
console.log('  ③ 划词=锚点 且有插入    : %d', q.c);
console.log('  ④ 划词=锚点 无插入      : %d', q.d);
console.log('  ⇒ 划词本身被换/被删 = %d (%.1f%%)   划的只是位置 = %d (%.1f%%)',
  q.a+q.b, (q.a+q.b)/674*100, q.c+q.d, (q.c+q.d)/674*100);

// ── 安全的「错侧」判据验证：只用 ①② ──
console.log('\n【安全判据】neg 侧只收「mark 是 diff 删除词」的卡：', q.a+q.b, '张；剔除', q.c+q.d, '张纯位置锚点');
