import { grammarLessons } from '/tmp/audit50/gl.mjs';
import { huntCases } from '/tmp/audit50/hc.mjs';

const esc = w => w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const norm = s => String(s??'').toLowerCase().replace(/[^a-z0-9' ]/g,' ').replace(/\s+/g,' ').trim();
const toks = s => norm(s).split(' ').filter(Boolean);
const wb   = (w,s) => new RegExp(`(?<![A-Za-z-])${esc(w)}(?![A-Za-z-])`,'i').test(String(s??''));

const cards = [];
for (const l of grammarLessons) for (let i=0;i<(l.contrast??[]).length;i++){
  const c=l.contrast[i]; if(c.bothRight===true) continue;
  const mark=(c.wrongMark??'').trim(); if(!mark) continue;
  cards.push({L:l.number,i,mark,wrong:c.wrong??'',correct:c.correct??'',nw:norm(mark).split(' ').filter(Boolean).length});
}
console.log('样本', cards.length);

// ── A. 任务书口径（wrong 侧整串 token 精确）逐字复现 ──
const wholeTokIn = (m,s)=> toks(s).includes(norm(m));
let A={both:0,onlyW:0,else:0};
for(const c of cards){const inW=wholeTokIn(c.mark,c.wrong),inC=wholeTokIn(c.mark,c.correct);
  if(inW&&inC)A.both++;else if(inW)A.onlyW++;else A.else++;}
console.log('A 任务书口径(整串token精确)  :', A.onlyW, A.both, A.else, ' ← 任务书 499/110/65');

// ── B. 语义口径（任一词，词边界）──
let B={both:0,onlyW:0,onlyC:0};
for(const c of cards){const ws=norm(c.mark).split(' ').filter(Boolean);
  const inW=ws.some(w=>wb(w,c.wrong)), inC=ws.some(w=>wb(w,c.correct));
  if(inW&&inC)B.both++;else if(inW)B.onlyW++;else B.onlyC++;}
console.log('B 语义口径(任一词·词边界)    :', B.onlyW, B.both, B.onlyC, ' ← 我算 504/170/0');

// ── C. 逐卡迁移表 ──
const mig={a2b:0,a2w:0,len65:0,noWordInEither:0};
const detail=[];
for(const c of cards){
  const whole=wholeTokIn(c.mark,c.wrong);
  if(whole) continue;
  const ws=norm(c.mark).split(' ').filter(Boolean);
  const inC=ws.some(w=>wb(w,c.correct)), inW=ws.some(w=>wb(w,c.wrong));
  if(inW&&inC){mig.a2b++;} else if(inW){mig.a2w++;} else mig.noWordInEither++;
  detail.push({L:c.L,i:c.i,mark:c.mark,to:inW&&inC?'both':inW?'onlyWrong':'onlyCorrect'});
}
console.log('\n65 张多词标记卡的归属:');
console.log('  → both（有词也在正确句）  :', mig.a2b);
console.log('  → onlyWrong（词只在错句） :', mig.a2w);
console.log('  → 两边都没有             :', mig.noWordInEither);
console.log('  ★ 迁移后合计 =', 499+mig.a2w, '/', 110+mig.a2b, '/', 0+mig.noWordInEither);

// ── D. 决定性不变量 ──
const notSub=cards.filter(c=>!c.wrong.includes(c.mark));
console.log('\nD 不变量 mark ⊄ wrong :', notSub.length, '/', cards.length, '(0 = 「只在正确句」桶为空集)');

// ── E. 499 桶：被划词 == diff 删除词？ ──
const lcs=(A,B)=>{const n=A.length,m=B.length,dp=Array.from({length:n+1},()=>new Array(m+1).fill(0));
 for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)dp[i][j]=A[i]===B[j]?dp[i+1][j+1]+1:Math.max(dp[i+1][j],dp[i][j+1]);
 const D=[],I=[],E=[];let i=0,j=0;
 while(i<n&&j<m){if(A[i]===B[j]){E.push(A[i]);i++;j++;}else if(dp[i+1][j]>=dp[i][j+1]){D.push(A[i]);i++;}else{I.push(B[j]);j++;}}
 while(i<n){D.push(A[i]);i++;}while(j<m){I.push(B[j]);j++;}return{D,I,E};};
let d499={deleted:0,notDeleted:0}, d110={insertNear:0,reorderOrOther:0};
for(const c of cards){
  const A=toks(c.wrong),B=toks(c.correct),{D}=lcs(A,B);
  const ws=norm(c.mark).split(' ').filter(Boolean);
  const inC=ws.some(w=>wb(w,c.correct));
  if(!inC){ (ws.some(w=>D.includes(w))?d499.deleted++:d499.notDeleted++); }
}
console.log('\nE 499 桶（单字，词不在正确句）：被划词＝diff删除词:', d499.deleted, ' 不是:', d499.notDeleted);
console.log('  ⇒ 「多出来/该换掉的」这一标签对 499 桶成立率 =', (d499.deleted/(d499.deleted+d499.notDeleted)*100).toFixed(1)+'%');

// 110 桶细分
const b110=cards.filter(c=>wholeTokIn(c.mark,c.wrong)&&wholeTokIn(c.mark,c.correct));
let ins=0,reorder=0,other=0; const ex={ins:[],reorder:[]};
for(const c of b110){
  const A=toks(c.wrong),B=toks(c.correct),{D,I,E}=lcs(A,B);
  const ws=norm(c.mark).split(' ').filter(Boolean);
  if(ws.some(w=>D.includes(w))){reorder++; if(ex.reorder.length<5)ex.reorder.push(c);}
  else if(I.length){ins++; if(ex.ins.length<5)ex.ins.push(c);}
  else {other++;}
}
console.log('\n110 桶细分: 缺词/插入型', ins, ' | 划词也在删除列表(=语序/替换型)', reorder, ' | 其他', other);
console.log('  插入型抽样:'); ex.ins.forEach(c=>console.log(`    L${c.L}[${c.i}] "${c.mark}"  "${c.wrong}" → "${c.correct}"`));
console.log('  语序型抽样:'); ex.reorder.forEach(c=>console.log(`    L${c.L}[${c.i}] "${c.mark}"  "${c.wrong}" → "${c.correct}"`));

// ── F. 上批三处 ──
console.log('\n=== 上批三处复核 ===');
const L38=grammarLessons.find(l=>l.number===38);
console.log('① L38 contrast[6].wrongMark =', JSON.stringify(L38.contrast[6].wrongMark),
  '| 全课 marks =', JSON.stringify(L38.contrast.map(c=>c.wrongMark)),
  '| 残留 said 被划 =', L38.contrast.some(c=>String(c.wrongMark??'')==='said'));

let tagCnt=0, tagCases=new Set(); const byTag={};
const walk=(o)=>{
  if(Array.isArray(o)) return o.forEach(walk);
  if(o&&typeof o==='object'){ if(typeof o.tag==='string'){ tagCnt++; byTag[o.tag]=(byTag[o.tag]||0)+1; } Object.values(o).forEach(walk); }
};
walk(huntCases);
console.log('③ huntCases tag="comparison" 出现次数 =', byTag['comparison'] ?? 0, ' (应为 13)');
console.log('  全部 tag 分布 top:', Object.entries(byTag).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k}:${v}`).join(' '));
console.log('  案件数:', Array.isArray(huntCases)?huntCases.length:'(非数组)');
