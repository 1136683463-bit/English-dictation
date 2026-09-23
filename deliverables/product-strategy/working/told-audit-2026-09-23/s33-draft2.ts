import { GRAMMAR_ZERO_TERMS, findZeroTermHits, isZeroTermClean } from "../../../../src/data/grammarZeroTerms";
import { grammarLessons } from "../../../../src/data/grammarLessons";
// 用项目已有词汇重写草稿：昨天版（41 课用过）/ 原样（98 课）/ 他/她/它版（29 课）
const V2 = "两句都对，差在什么时候说的：says 是现在说的——她的话此刻转给你；told 是昨天说的——就是 says 的昨天版。同一个「告诉」，一个刚出口，一个已经说完了。";
const V3 = "两句都对，差在哪一天：says 说的是现在；told 是它的昨天版。同一句「告诉」，前面站的是今天还是昨天。";
const V4 = "两句都对——第 38 课那句是「她（现在）说」；右边这句是「她（昨天）说了」。同一个词，穿上了昨天版。";
console.log("=== 零术语自查 ===");
for(const [n,d] of [["V2",V2],["V3",V3],["V4",V4]] as [string,string][])
  console.log(`  ${n}: ${isZeroTermClean(d)?"✓ 干净":"✗ 命中 "+findZeroTermHits(d).join("、")}`);
console.log("\n=== 星号守门（除 deepDive 外不得含 **）===");
for(const [n,d] of [["V2",V2],["V3",V3],["V4",V4]] as [string,string][])
  console.log(`  ${n}: ${d.includes("**")?"✗ 含星号":"✓ 无星号"}`);
console.log("\n=== 用项目已有词汇（库内使用课数）===");
const allZh=(l:any)=>{const S:string[]=[];const P=(t?:string)=>{if(t)S.push(t);};
 P(l.title);P(l.grammarLabel);P(l.oneLineRule);P(l.intentZh);P(l.sceneSetupZh);P(l.dialogueZh);P(l.summary?.rule);
 (l.summary?.points??[]).forEach(P);(l.deepDive?.paragraphs??[]).forEach(P);
 l.guided.forEach((g:any)=>{P(g.explain);P(g.promptZh);P(g.correctionZh);});
 (l.contrast??[]).forEach((c:any)=>P(c.whyZh));(l.variants??[]).forEach((v:any)=>P(v.noteZh));
 if(l.recall){P(l.recall.noteZh);P(l.recall.promptZh);}(l.dialogue??[]).forEach((d:any)=>P(d.zh));
 (l.sceneSwings??[]).forEach((s:any)=>P(s.zh));l.examples.forEach((e:any)=>P(e.zh));l.practice.forEach((p:any)=>P(p.promptZh));
 return S.join(" || ");};
for(const t of ["昨天版","现在","刚出口","说完了","哪一天","前面站的是"]) console.log(`  「${t}」 库内 ${grammarLessons.filter(l=>allZh(l).includes(t)).length} 课`);
console.log("\n=== 推荐 V2（改后）===");
console.log("  " + V2);
console.log(`  零术语: ${isZeroTermClean(V2)?"✓":"✗"}  星号: ${V2.includes("**")?"✗":"✓"}  长度: ${V2.length} 字`);
