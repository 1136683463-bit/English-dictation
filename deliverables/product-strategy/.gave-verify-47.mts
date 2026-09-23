/**
 * 竞析 · 第 47 批 gave 复核（最终口径，只读）
 * 口径（复现简报 25/5 · 0/1 · 0/1 · 0/0）：
 *   词边界匹配，**忽略大小写**（关键：L63 的正句有 "Give it to me." 这类大写开头）
 *   正侧 = 10 个「答案键」槽位
 *   错侧 = 对照卡真错侧(wrong/wrongMark) + guided.options + guided.wrongToken + practice.distractors
 *   bothRight 卡的 wrong 是正确句 → 两侧都不计（中性）
 *   spot 题的 answer 是错词块 → 两侧都不计（中性）
 */
import { grammarLessons } from "../../src/data/grammarLessons";
const wb=(w:string)=>new RegExp(`(?<![A-Za-z-])${w}(?![A-Za-z-])`,"gi");
const occ=(w:string,s:string)=>(s.match(wb(w))??[]).length;

type Slot={L:number;k:string;side:"pos"|"wrong"|"neutral";text:string};
const S:Slot[]=[];
const add=(L:number,k:string,side:Slot["side"],v?:string|null)=>{if(typeof v==="string"&&v)S.push({L,k,side,text:v});};
for(const L of grammarLessons){
  const n=L.number;
  add(n,"targetSentence","pos",L.targetSentence);
  add(n,"dialogueEn","pos",L.dialogueEn);
  for(const e of L.examples??[])add(n,"examples.en","pos",e.en);
  for(const d of L.dialogue??[])add(n,"dialogue.en","pos",d.en);
  for(const c of L.contrast??[]){
    add(n,"contrast.correct","pos",c.correct);
    if(c.bothRight) add(n,"contrast.wrong.bothRight","neutral",c.wrong);
    else { add(n,"contrast.wrong.real","wrong",c.wrong); add(n,"contrast.wrongMark.real","wrong",c.wrongMark); }
  }
  for(const v of L.variants??[])add(n,"variants.en","pos",v.en);
  for(const s of L.sceneSwings??[])add(n,"sceneSwings.en","pos",s.en);
  for(const g of L.guided??[]){
    if(g.kind==="spot"){ add(n,"guided.spot.answer","neutral",g.answer); add(n,"guided.spot.tokens","neutral",(g.tokens??[]).join(" ")); add(n,"guided.wrongToken","wrong",g.wrongToken); }
    else { add(n,"guided.answer","pos",g.answer); add(n,"guided.replaceBase","pos",g.replaceBase);
      for(const o of g.options??[])add(n,"guided.options","wrong",o);
      for(const t of g.tokens??[])add(n,"guided.tokens","neutral",t); }
  }
  for(const p of L.practice??[]){ add(n,"practice.answer","pos",p.answer); for(const t of p.tokens)add(n,"practice.tokens","neutral",t); for(const d of p.distractors??[])add(n,"practice.distractors","wrong",d); }
  if(L.recall)add(n,"recall.answer","pos",L.recall.answer);
  for(const b of L.blocks??[])add(n,"blocks.text","neutral",b.text);
}
const POSK=["targetSentence","dialogueEn","examples.en","dialogue.en","contrast.correct","variants.en","sceneSwings.en","guided.answer","practice.answer","recall.answer"];
const WRONGK=["contrast.wrong.real","contrast.wrongMark.real","guided.options","guided.wrongToken","practice.distractors"];
const NEUTRALK=["contrast.wrong.bothRight","guided.spot.answer","guided.spot.tokens","guided.replaceBase","guided.tokens","practice.tokens","blocks.text"];
const cnt=(w:string,keys:string[],side:Slot["side"])=>S.filter(s=>s.side===side&&keys.includes(s.k)).reduce((a,s)=>a+occ(w,s.text),0);
const hr=(t:string)=>console.log(`\n${"=".repeat(76)}\n${t}\n${"=".repeat(76)}`);

hr("核查 0 · 基线");
console.log(`  grammarLessons ${grammarLessons.length} 课；contrast 卡 ${grammarLessons.reduce((a,L)=>a+(L.contrast??[]).length,0)} 张；variants ${grammarLessons.reduce((a,L)=>a+(L.variants??[]).length,0)} 条`);
console.log(`  槽位：正侧 ${S.filter(s=>s.side==="pos").length} 个，错侧 ${S.filter(s=>s.side==="wrong").length} 个，中性 ${S.filter(s=>s.side==="neutral").length} 个`);

hr("核查 1 · 复现简报四行表（忽略大小写 + 词边界）");
console.log("形式".padEnd(10)+"正侧".padStart(6)+"错侧".padStart(6)+"  |  简报".padStart(10));
const BRIEF:Record<string,[number,number]>={give:[25,5],gives:[0,1],gave:[0,1],given:[0,0]};
for(const w of ["give","gives","gave","given"]){
  const p=cnt(w,POSK,"pos"),g=cnt(w,WRONGK,"wrong");
  const [bp,bg]=BRIEF[w];
  console.log(w.padEnd(10)+String(p).padStart(6)+String(g).padStart(6)+"  |  "+`${bp}/${bg}`.padStart(10)+(p===bp&&g===bg?"  ✅ 一致":"  ❌ 不一致"));
}
hr("核查 2 · 正侧逐槽位（give）");
let tot=0;
for(const k of POSK){const v=cnt("give",[k],"pos");tot+=v;if(v)console.log(`  ${k.padEnd(24)} ${String(v).padStart(3)}`);}
console.log(`  ${"合计".padEnd(24)} ${String(tot).padStart(3)}`);
hr("核查 3 · 错侧逐槽位（give / gives / gave）");
for(const k of WRONGK){const a=cnt("give",[k],"wrong"),b=cnt("gives",[k],"wrong"),c=cnt("gave",[k],"wrong");if(a||b||c)console.log(`  ${k.padEnd(24)} give=${a} gives=${b} gave=${c}`);}
hr("核查 4 · give 正侧 25 处明细");
for(const s of S.filter(x=>x.side==="pos"&&POSK.includes(x.k)&&occ("give",x.text)))
  console.log(`  L${String(s.L).padStart(3)} ${s.k.padEnd(22)} ×${occ("give",s.text)}  ${JSON.stringify(s.text.slice(0,74))}`);
hr("核查 5 · 错侧全部 give/gives/gave 明细");
for(const s of S.filter(x=>x.side==="wrong"&&["give","gives","gave"].some(w=>occ(w,x.text))))
  console.log(`  L${String(s.L).padStart(3)} ${s.k.padEnd(22)}  ${JSON.stringify(s.text.slice(0,90))}`);
hr("核查 6 · gave 完整台账（三侧全查）");
const gave=S.filter(x=>occ("gave",x.text));
console.log(`  gave 命中的槽位共 ${gave.length} 处：`);
for(const s of gave) console.log(`     L${s.L} [${s.side}] ${s.k} :: ${JSON.stringify(s.text.slice(0,120))}`);
console.log(`  → 正侧 ${gave.filter(s=>s.side==="pos").length} / 错侧 ${gave.filter(s=>s.side==="wrong").length} / 中性 ${gave.filter(s=>s.side==="neutral").length}`);
console.log(`  → 结论：gave 在【正侧 = 0 处】${gave.some(s=>s.side==="pos")?"（矛盾！）":"：从未作为一句被展示"}`);
hr("核查 7 · 对照：其它过去式在同一口径下的正侧基数");
for(const w of ["felt","kept","sat","caught","swam","sang","slept","drew","wore","lost","broke","told","went","ate"]){
  const p=cnt(w,POSK,"pos"); const ls=[...new Set(S.filter(s=>s.side==="pos"&&POSK.includes(s.k)&&occ(w,s.text)).map(s=>s.L))].sort((a,b)=>a-b);
  console.log(`  ${w.padEnd(9)} 正侧=${String(p).padStart(3)}  课=[${ls.join(",")}]`);
}
