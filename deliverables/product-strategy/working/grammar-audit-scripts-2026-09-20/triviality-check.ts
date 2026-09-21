import { grammarLessons } from "../../../../src/data/grammarLessons";
const norm=(s:string)=>s.toLowerCase().replace(/[^a-z0-9' ]/g,'').replace(/\s+/g,' ').trim();
const toks=(s:string)=>norm(s).split(' ').filter(Boolean);
const sorted=[...(grammarLessons as any[])].sort((a,b)=>a.number-b.number);

// 对每道 C 层新句：算它与本课最近句子的词集重叠率
function jaccard(a:string[],b:string[]){
  const A=new Set(a),B=new Set(b);
  let inter=0; for(const x of A) if(B.has(x))inter++;
  return inter/(A.size+B.size-inter);
}

const rows:any[]=[];
for(const l of sorted){
  const existing:string[]=[];
  const add=(t?:string)=>{if(t)existing.push(t);};
  add(l.targetSentence);
  for(const e of l.examples||[])add(e.en);
  for(const d of l.dialogue||[])add(d.en); add(l.dialogueEn);
  for(const c of l.contrast||[]){add(c.correct);add(c.wrong);}
  for(const v of l.variants||[])add(v.en);
  for(const x of l.sceneSwings||[])add(x.en);
  if(l.recall?.answer)add(l.recall.answer);
  for(const g of l.guided||[])if(g.answer)add(g.answer);

  const exSet=new Set(existing.map(norm));
  for(const p of l.practice||[]){
    const a=norm(p.answer);
    if(exSet.has(a))continue;              // 只看向新句
    if(l.guided?.some((g:any)=>norm(g.answer??'')===a))continue;
    const at=toks(p.answer);
    let best=0, near="";
    for(const e of existing){
      const j=jaccard(at,toks(e));
      if(j>best){best=j;near=e;}
    }
    rows.push({n:l.number,ans:p.answer,near,sim:best});
  }
}

console.log(`新句总数（含之前就有的 C 层）: ${rows.length}`);
const trivial=rows.filter(r=>r.sim>=0.8);
const mid=rows.filter(r=>r.sim>=0.6&&r.sim<0.8);
const real=rows.filter(r=>r.sim<0.6);
console.log(`  与课内某句词集重叠 ≥80%（几乎是换个词）: ${trivial.length} 题`);
console.log(`  60–80%（同句型小改）:                  ${mid.length} 题`);
console.log(`  <60%（真正的重组）:                    ${real.length} 题`);
console.log();
console.log("=== 我这次新增的条目里，最'换汤不换药'的 12 条 ===");
trivial.sort((a,b)=>b.sim-a.sim).slice(0,12).forEach(r=>{
  console.log(`L${r.n}: 「${r.ans}」`);
  console.log(`        ≈ 课内「${r.near}」  重叠 ${(r.sim*100).toFixed(0)}%`);
});
