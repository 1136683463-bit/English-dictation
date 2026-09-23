/** 竞析 · 第48批 · 脚本 C：课程尾部结构 + 「主角」判据的全库扫描 + 数据链核验 */
import { grammarLessons } from "../../src/data/grammarLessons";
const hr = (t: string) => console.log(`\n${"=".repeat(78)}\n${t}\n${"=".repeat(78)}`);
const wb = (w: string) => new RegExp(`(?<![A-Za-z-])${w}(?![A-Za-z-])`, "gi");
const occ = (w: string, s: string) => (s.match(wb(w)) ?? []).length;

hr("A · L190–L204 全列表（看给了 gave 的 L204 是什么性质）");
for (const L of [...grammarLessons].sort((a, b) => a.number - b.number)) {
  if (L.number < 190) continue;
  console.log(`  L${String(L.number).padStart(3)} ${L.id.padEnd(26)} ${L.grammarLabel.padEnd(34)} 主角句=${JSON.stringify(L.targetSentence).slice(0, 70)}`);
}

hr("B · 全库扫描：所有**过去式形态**在 targetSentence 里的出现（判定「谁是主角」的实际覆盖面）");
const PAST = ["was", "were", "went", "saw", "had", "did", "said", "told", "made", "took", "came", "got", "gave", "found", "left", "felt", "kept", "slept", "drew", "wore", "sat", "caught", "swam", "sang", "bought", "brought", "thought", "knew", "lost", "broke", "ate", "drank", "ran", "wrote", "spoke", "read", "heard", "met", "paid", "put", "stood", "understood", "won", "flew", "rode", "drove", "sent", "built", "taught", "caught"];
const starMap = new Map<string, number[]>();
for (const w of PAST) starMap.set(w, grammarLessons.filter((L) => occ(w, L.targetSentence)).map((L) => L.number));
const withStar = PAST.filter((w) => (starMap.get(w) ?? []).length > 0);
const noStar = PAST.filter((w) => (starMap.get(w) ?? []).length === 0);
console.log(`  ${PAST.length} 个过去式形态中，当过主角的 ${withStar.length} 个，从未当过主角的 ${noStar.length} 个`);
console.log(`  当过主角：`);
for (const w of withStar) console.log(`     ${w.padEnd(10)} 课=[${(starMap.get(w) ?? []).join(",")}]`);
console.log(`  从未当过主角：${noStar.join(", ")}`);

hr("C · 「昨天版立课族」的实际清单：哪些课 grammarLabel 含「昨天版」");
for (const L of [...grammarLessons].sort((a, b) => a.number - b.number)) {
  if (/昨天版|过去/.test(L.grammarLabel)) console.log(`  L${String(L.number).padStart(3)} ${L.grammarLabel.padEnd(40)} 主角句=${JSON.stringify(L.targetSentence).slice(0, 66)}`);
}

hr("D · 立课 vs 挂靠：L196–L204（第三季「昨天版」专项区）的完整结构");
for (const L of [...grammarLessons].sort((a, b) => a.number - b.number)) {
  if (L.number < 195 || L.number > 204) continue;
  console.log(`\n  ── L${L.number} ${L.title} ｜ ${L.grammarLabel}`);
  console.log(`     主角句: ${JSON.stringify(L.targetSentence)}`);
  console.log(`     一句话规矩: ${L.oneLineRule.slice(0, 160)}`);
  console.log(`     contrast ${(L.contrast ?? []).length} 张 / guided ${(L.guided ?? []).length} / practice ${(L.practice ?? []).length} / huntCaseIds=[${L.huntCaseIds.join(",")}]`);
}

hr("E · huntCases：reviewed 字段与「被课程引用」的核对");
import { huntCases } from "../../src/data/huntCases";
const cited = new Set<string>();
for (const L of grammarLessons) for (const id of L.huntCaseIds) cited.add(id);
console.log(`  案件总数 ${huntCases.length}`);
console.log(`  被课程引用的案件 id 数 ${cited.size}`);
const uncited = huntCases.filter((c) => !cited.has(c.id));
console.log(`  未被任何课程引用的案件 ${uncited.length} 个：`);
for (const c of uncited) console.log(`     ${c.id.padEnd(28)} #${c.number} 「${c.title}」 reviewed=${c.reviewed}`);
console.log(`  reviewed 取值分布：`);
const rv = new Map<string, number>();
for (const c of huntCases) rv.set(String(c.reviewed), (rv.get(String(c.reviewed)) ?? 0) + 1);
for (const [k, v] of rv) console.log(`     reviewed=${k}: ${v} 案`);
console.log(`  reviewed 缺省(undefined)的案：${huntCases.filter((c) => c.reviewed === undefined).length}`);
console.log(`  4. 引用了不存在案件 id 的课：`);
let bad = 0;
for (const L of grammarLessons) for (const id of L.huntCaseIds) if (!huntCases.some((c) => c.id === id)) { console.log(`     L${L.number} 引用不存在的 ${id}`); bad++; }
if (!bad) console.log(`     （无）`);

hr("F · 罪名 tag 使用分布（comparison 零使用的核实）");
const tagCount = new Map<string, number>();
for (const c of huntCases) for (const e of c.errors) tagCount.set(e.tag, (tagCount.get(e.tag) ?? 0) + 1);
const ALL_TAGS = ["tense", "sv_agreement", "missing_be", "article", "plural", "preposition", "fragment", "run_on", "word_order", "verb_form", "comparison"];
console.log("  tag".padEnd(16) + "案件内出现次数".padStart(12));
for (const t of ALL_TAGS) console.log(`  ${t.padEnd(16)}${String(tagCount.get(t) ?? 0).padStart(12)}`);
console.log(`  合计错误点 ${[...tagCount.values()].reduce((a, b) => a + b, 0)} 处，覆盖 ${tagCount.size} 个 tag（声明 11 个）`);
const zero = ALL_TAGS.filter((t) => !tagCount.has(t));
console.log(`  零使用 tag：${zero.join(", ") || "（无）"}`);

hr("G · GRAMMAR_ERROR_TAG_LABELS / GRAMMAR_ERROR_TAGS 的声明位置与内容");
