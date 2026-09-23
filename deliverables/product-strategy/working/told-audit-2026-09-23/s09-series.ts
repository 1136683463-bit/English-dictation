import { grammarLessons } from "../../../../src/data/grammarLessons";
console.log("=== L196–L204 系列：targetSentence 词数 + 分句最长词数 + 主题 ===");
for (const l of grammarLessons.filter(l => l.number >= 195 && l.number <= 204)) {
  const t = l.targetSentence;
  const total = t.split(/\s+/).length;
  // 最长分句：按 . , and or but when 等切
  const parts = t.split(/[,.;]|\band\b|\bbut\b|\bwhen\b|\bso\b/).map(s => s.trim()).filter(Boolean);
  const longest = Math.max(...parts.map(s => s.split(/\s+/).length));
  console.log(`L${l.number} [${l.grammarLabel}] scene=${l.scene}`);
  console.log(`     target(${total}词, 最长分句${longest}词): ${JSON.stringify(t)}`);
  console.log(`     title: ${l.title} | sceneSwings: ${(l.sceneSwings??[]).length} | recall: ${l.recall?"有":"无"} | deepDive: ${l.deepDive?"有":"无"}`);
}
console.log("\n=== 场景使用统计（全 204 课）===");
const SC = ["campus","city","train","lighthouse","desert","space","ocean","island","mansion","forest","snow","magic","mystery","sparkle"];
const cnt: Record<string, number[]> = {};
for (const l of grammarLessons) { (cnt[l.scene] ??= []).push(l.number); }
for (const s of SC) console.log(`  ${s.padEnd(12)} ${String((cnt[s]??[]).length).padStart(3)} 次  ${(cnt[s]??[]).slice(-8).map(n=>`L${n}`).join(",")}`);
console.log("  非法场景: " + Object.keys(cnt).filter(k=>!SC.includes(k)).join(","));
console.log("\n=== L192–L204 各自的场景 ===");
for (const l of grammarLessons.filter(l => l.number >= 190)) console.log(`  L${l.number} scene=${l.scene} [${l.grammarLabel}]`);
