import { grammarLessons } from "../../../../src/data/grammarLessons";
import { writeFileSync } from "node:fs";
const norm=(s:string)=>s.toLowerCase().replace(/[^a-z0-9' ]/g,'').replace(/\s+/g,' ').trim();
// 中文相似度：去标点后比较，或一方包含另一方
const zhNorm=(s:string)=>s.replace(/[，。！？、：；「」（）\s]/g,"");
const zhMatch=(a:string,b:string)=>{
  const A=zhNorm(a),B=zhNorm(b);
  if(!A||!B)return 0;
  if(A===B)return 1;
  if(A.includes(B)||B.includes(A))return 0.9;
  // 字符级 Jaccard
  const sa=new Set(A.split("")), sb=new Set(B.split(""));
  let inter=0; for(const c of sa)if(sb.has(c))inter++;
  return inter/(sa.size+sb.size-inter);
};
const sorted=[...(grammarLessons as any[])].sort((a,b)=>a.number-b.number);

interface Replay { n:number; id:string; label:string; target:string; promptZh:string; answer:string; fromZh:string; ansSrc:string; zhSim:number; }
const replays:Replay[]=[];
let tot=0;

for(const l of sorted){
  // 看段素材（英文 + 中文），这是用户做练段前刚看过的
  const exhibit:{en:string;zh:string;src:string}[]=[];
  exhibit.push({en:l.targetSentence,zh:l.intentZh,src:"目标句"});
  for(const e of l.examples||[])exhibit.push({en:e.en,zh:e.zh,src:"例句"});
  for(const s of l.sceneSwings||[])exhibit.push({en:s.en,zh:s.zh,src:"场景"});
  for(const c of l.contrast||[])exhibit.push({en:c.correct,zh:c.whyZh,src:"对比卡"});
  const exByEn=new Map(exhibit.map(e=>[norm(e.en),e]));
  const vs=new Set((l.variants??[]).map((v:any)=>norm(v.en)));

  for(const p of l.practice??[]){
    tot++;
    const a=norm(p.answer);
    if(vs.has(a))continue;
    if(/(复习第|先复习|学过的老句子)/.test(p.promptZh))continue;
    const hit=exByEn.get(a);
    if(!hit)continue;
    const sim=zhMatch(p.promptZh,hit.zh);
    if(sim>=0.8) replays.push({n:l.number,id:l.id,label:l.grammarLabel,target:l.targetSentence,
      promptZh:p.promptZh,answer:p.answer,fromZh:hit.zh,ansSrc:hit.src,zhSim:sim});
  }
}
console.log(`练段「与看段同题同译」的重放题: ${replays.length}/${tot} = ${(replays.length/tot*100).toFixed(1)}%`);
console.log(`涉及 ${new Set(replays.map(r=>r.n)).size} 课\n`);
for(const r of replays.slice(0,25)) console.log(`L${r.n} [${r.ansSrc}] 「${r.promptZh}」→ ${r.answer}\n     看段中文: ${r.fromZh}`);
writeFileSync('.restruct/replays.json',JSON.stringify(replays,null,1));
