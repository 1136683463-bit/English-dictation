/** 竞析 · 第48批 · 脚本 G：comparison 改判的精确台账（按 original→correction 精确匹配，不用下标） */
import { grammarLessons } from "../../src/data/grammarLessons";
import { huntCases } from "../../src/data/huntCases";
const hr = (t: string) => console.log(`\n${"=".repeat(78)}\n${t}\n${"=".repeat(78)}`);

hr("A · L31 / L65 / L71 是什么（comparison 系案件挂在哪几课）");
for (const n of [17, 31, 65, 71]) {
  const L = grammarLessons.find((x) => x.number === n);
  if (!L) continue;
  console.log(`  L${n} 「${L.title}」 ${L.grammarLabel}`);
  console.log(`     主角句：${JSON.stringify(L.targetSentence)}`);
  console.log(`     一句话规矩：${L.oneLineRule.slice(0, 130)}`);
  console.log(`     huntCaseIds=[${L.huntCaseIds.join(", ")}]`);
}

hr("B · 精确改判台账（按 (案id, original→correction) 定位，不按下标）");
type RC = { id: string; from: string; to: string; newTag: "comparison"; tier: "core" | "peripheral"; why: string };
const RC: RC[] = [
  { id: "hunt-photo-compare", from: "hoter", to: "hotter", newTag: "comparison", tier: "core", why: "「更热」的 -er 形状做错了——形容词本身在变形，核心比较级" },
  { id: "hunt-photo-compare", from: "more good", to: "better", newTag: "comparison", tier: "core", why: "good 的「更」是 better——不规则比较级" },
  { id: "hunt-superlative-market", from: "most", to: "去掉 most", newTag: "comparison", tier: "core", why: "most 与 -est 叠用（双重最高级）——最高级形式做错" },
  { id: "hunt-superlative-market", from: "goodest", to: "best", newTag: "comparison", tier: "core", why: "good 的「最」是 best——不规则最高级" },
  { id: "hunt-superlative-market", from: "than", to: "in", newTag: "comparison", tier: "core", why: "「最…」的范围内用 in，than 是「更…」的搭档——比较结构的搭配词" },
  { id: "hunt-height-chart", from: "taller", to: "tall", newTag: "comparison", tier: "core", why: "as tall as 中间穿原样，-er 是「更」家的人——「一样」vs「更」的形式对立" },
  { id: "hunt-height-chart", from: "than", to: "as", newTag: "comparison", tier: "core", why: "「一样」家不认 than——比较结构的搭配词" },
  { id: "hunt-enough-bag", from: "heavy", to: "heavier", newTag: "comparison", tier: "core", why: "「比…更」要带 -er，且 y→i——比较级拼写" },
  { id: "hunt-superlative-market", from: "biggest", to: "the biggest", newTag: "comparison", tier: "peripheral", why: "「最…的那个」前面要 the——最高级专属的冠词规矩（也可留在 article）" },
  { id: "hunt-term-review", from: "best", to: "the best", newTag: "comparison", tier: "peripheral", why: "同上：最高级 + the" },
  { id: "hunt-height-chart", from: "tall", to: "as tall", newTag: "comparison", tier: "peripheral", why: "少一头 as 导致「一样」散架——as…as 结构缺块（也可留在 word_order/fragment）" },
  { id: "hunt-feel-better", from: "very", to: "much", newTag: "comparison", tier: "peripheral", why: "给「更」加力用 much——比较级的程度修饰词" },
  { id: "hunt-feel-better", from: "more", to: "much", newTag: "comparison", tier: "peripheral", why: "「更」已藏在 taller 里，前面不叠 more——比较级的程度修饰词" },
  { id: "hunt-full-day", from: "very", to: "much", newTag: "comparison", tier: "peripheral", why: "同 L76 的 much + 比较级" },
];
let ok = 0, miss = 0;
for (const r of RC) {
  const c = huntCases.find((x) => x.id === r.id);
  const e = c?.errors.find((x) => x.original === r.from && x.correction === r.to);
  if (!e) { console.log(`  ❌ 未找到：${r.id} ${r.from} → ${r.to}`); miss++; continue; }
  ok++;
  console.log(`  ✅ ${r.id.padEnd(26)} [${r.tier.padEnd(10)}] ${r.from.padEnd(11)} → ${r.to.padEnd(14)} 现tag=${e.tag}`);
}
console.log(`  ⇒ 精确定位成功 ${ok} 处，失败 ${miss} 处`);

hr("C · 改判前 → 改判后的 tag 分布（两档分别算）");
const ALL = ["tense", "sv_agreement", "missing_be", "article", "plural", "preposition", "fragment", "run_on", "word_order", "verb_form", "comparison"];
const base = new Map<string, number>();
for (const c of huntCases) for (const e of c.errors) base.set(e.tag, (base.get(e.tag) ?? 0) + 1);
const apply = (tiers: string[]) => {
  const m = new Map(base);
  for (const r of RC) {
    if (!tiers.includes(r.tier)) continue;
    const c = huntCases.find((x) => x.id === r.id);
    const e = c?.errors.find((x) => x.original === r.from && x.correction === r.to);
    if (!e) continue;
    m.set(e.tag, (m.get(e.tag) ?? 0) - 1);
    m.set("comparison", (m.get("comparison") ?? 0) + 1);
  }
  return m;
};
const coreOnly = apply(["core"]);
const both = apply(["core", "peripheral"]);
console.log("  tag".padEnd(16) + "现状".padStart(6) + "只改core".padStart(10) + "core+外围".padStart(11));
for (const t of ALL) {
  console.log(`  ${t.padEnd(16)}${String(base.get(t) ?? 0).padStart(6)}${String(coreOnly.get(t) ?? 0).padStart(10)}${String(both.get(t) ?? 0).padStart(11)}`);
}

hr("D · 改判涉及的案件与课程（影响面）");
const byCase = new Map<string, RC[]>();
for (const r of RC) { byCase.set(r.id, [...(byCase.get(r.id) ?? []), r]); }
for (const [id, rs] of byCase) {
  const c = huntCases.find((x) => x.id === id);
  const ls = grammarLessons.filter((L) => L.huntCaseIds.includes(id)).map((L) => `L${L.number}「${L.grammarLabel}」`);
  console.log(`  ${id.padEnd(26)} #${c?.number} ${rs.length} 处（core ${rs.filter((r) => r.tier === "core").length} / 外围 ${rs.filter((r) => r.tier === "peripheral").length}）`);
  console.log(`     被引用：${ls.join(" ; ") || "**未被任何课程引用（番外案）**"}`);
}

hr("E · 关键判定：这些案件所属课程**是不是**讲比较的？（决定改判是否「顺理成章」）");
console.log("  hunt-photo-compare   → L17  grammarLabel='比一比 · -er / more'            ✅ 就是比较课");
console.log("  hunt-superlative-market → L31 ?");
const L31 = grammarLessons.find((x) => x.number === 31);
console.log(`         L31 = 「${L31?.title}」 ${L31?.grammarLabel}`);
console.log(`         主角句 = ${JSON.stringify(L31?.targetSentence)}`);
const L65 = grammarLessons.find((x) => x.number === 65);
console.log(`  hunt-height-chart    → L65 = 「${L65?.title}」 ${L65?.grammarLabel}`);
console.log(`         主角句 = ${JSON.stringify(L65?.targetSentence)}`);
const L71 = grammarLessons.find((x) => x.number === 71);
console.log(`  hunt-enough-bag      → L71 = 「${L71?.title}」 ${L71?.grammarLabel}`);
console.log(`         主角句 = ${JSON.stringify(L71?.targetSentence)}`);

hr("F · L17 的罪名构成（这课引用的案子里，比较类错点占几成）");
for (const n of [17, 31, 65, 71]) {
  const L = grammarLessons.find((x) => x.number === n);
  if (!L) continue;
  for (const id of L.huntCaseIds) {
    const c = huntCases.find((x) => x.id === id);
    if (!c) continue;
    const nRC = RC.filter((r) => r.id === id).length;
    console.log(`  L${n} → ${id}：${c.errors.length} 个错点，其中我判为比较范畴 ${nRC} 个`);
  }
}
