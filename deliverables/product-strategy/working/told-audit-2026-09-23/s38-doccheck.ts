import fs from "node:fs";
const p="/Users/liujun/Documents/英语听写/deliverables/product-strategy/user-research-told-2026-09-23.md";
const s=fs.readFileSync(p,"utf8");
console.log(`行数=${s.split("\n").length}  字符=${s.length}`);
console.log("\n=== 章节结构 ===");
s.split("\n").forEach((l,i)=>{ if(/^#{1,4}\s/.test(l)) console.log(`  L${i+1}: ${l}`); });
console.log("\n=== 表格完整性（管符数量奇偶）===");
let bad=0;
s.split("\n").forEach((l,i)=>{ if(l.trim().startsWith("|")&&!l.trim().endsWith("|")){bad++;console.log(`  ⚠️ L${i+1} 表格行结尾异常: ${l.slice(0,90)}`);} });
console.log(bad?`  ${bad} 处异常`:"  ✓ 全部表格行格式正确");
console.log("\n=== 关键数字出现次数 ===");
for(const k of ["told","tells","tell 去重","5 句","11 处","41 处","20 处","37 处","18 关","死代码","登记"]) 
 console.log(`  「${k}」出现 ${(s.match(new RegExp(k,"g"))??[]).length} 次`);
console.log("\n=== 是否有未闭合的代码块 ===");
const fences=(s.match(/^```/gm)??[]).length;
console.log(`  ${fences} 个 \`\`\` 标记 ⇒ ${fences%2===0?"✓ 成对":"✗ 奇数（有未闭合）"}`);
