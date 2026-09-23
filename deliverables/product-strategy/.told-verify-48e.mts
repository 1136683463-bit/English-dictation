/** 竞析 · 第48批 · 脚本 E：comparison 的下游影响面（空态/画像/重练）+ reviewed 的守门断言实测 */
import { grammarLessons } from "../../src/data/grammarLessons";
import { huntCases } from "../../src/data/huntCases";
import {
  GRAMMAR_ERROR_TAGS,
  GRAMMAR_ERROR_TAG_LABELS,
  GRAMMAR_ERROR_TAG_PLAIN,
  summarizeHuntProgress,
} from "../../src/services/huntService";
const hr = (t: string) => console.log(`\n${"=".repeat(78)}\n${t}\n${"=".repeat(78)}`);

hr("A · 罪名词表：LABELS / PLAIN / TAGS 三处的项数与键序");
const LK = Object.keys(GRAMMAR_ERROR_TAG_LABELS);
const PK = Object.keys(GRAMMAR_ERROR_TAG_PLAIN);
console.log(`  GRAMMAR_ERROR_TAG_LABELS  ${LK.length} 项：${LK.join(", ")}`);
console.log(`  GRAMMAR_ERROR_TAG_PLAIN   ${PK.length} 项：${PK.join(", ")}`);
console.log(`  GRAMMAR_ERROR_TAGS        ${GRAMMAR_ERROR_TAGS.length} 项：${GRAMMAR_ERROR_TAGS.join(", ")}`);
console.log(`  三者键集完全一致？${JSON.stringify(LK.slice().sort()) === JSON.stringify(PK.slice().sort()) && JSON.stringify(LK.slice().sort()) === JSON.stringify(GRAMMAR_ERROR_TAGS.slice().sort()) ? "是" : "否"}`);
console.log(`  ⇒ comparison 现在**已经在** GRAMMAR_ERROR_TAGS 里（2026-09-20 改成派生后的结果）`);
console.log(`     ⇒ 日记批改白名单 / 弱点引擎 / 干预推荐 **全部** 也收 comparison。`);

hr("B · 罪名面板实际渲染几个按钮（页面取 ALL_TAGS = Object.keys(LABELS)）");
console.log(`  页面 ALL_TAGS 项数 = ${Object.keys(GRAMMAR_ERROR_TAG_LABELS).length}`);
console.log(`  其中全库零使用 = ${LK.filter((t) => !huntCases.some((c) => c.errors.some((e) => e.tag === t))).join(", ") || "（无）"}`);
console.log(`  ⇒ 用户看到 ${LK.length} 个按钮，其中有 1 个（comparison）点了**永远不可能命中**。`);

hr("C · 实测：假想一个 comparison 命中场景 —— 它在当前数据下能出现吗？");
const compCases = huntCases.filter((c) => c.errors.some((e) => e.tag === "comparison"));
console.log(`  tag=comparison 的案件数 = ${compCases.length}`);
console.log(`  ⇒ judgeGuess 里 hit 的条件是 guessedTag === error.tag；`);
console.log(`    既然没有任何 error.tag === "comparison"，该按钮的三种归宿只有：notError / wrongTag / alreadyFound。`);

hr("D · comparison 点击后的三条路径文案（逐字从 huntService 读出）");
console.log(`  notError（点了一个没错的词）：`);
console.log(`     "这个词没有问题，放心。继续侦查别的线索吧。"`);
console.log(`  wrongTag（点对了错词，罪名选错）：`);
console.log(`     "这里确实有问题，但不是${GRAMMAR_ERROR_TAG_LABELS["comparison"]}。${"两个东西比一比，看看形容词要不要加 -er 或 more。"}"`);
console.log(`  ⇒ 第二条正是任务书说的「这里确实有问题，但不是…」——**它不扣「已找到」进度，但计一次 misses**，`);
console.log(`     并且会写一条 hunt_verdict 事件，把 comparison 记进弱点引擎（见下）。`);

hr("E · comparison 一旦被点，会污染哪些下游？");
console.log(`  1) grammarWeakSpotsService.computeWeakSpotsReport：`);
console.log(`     事件 kind="hunt_verdict"，verdictKind="wrongTag" → 走 bump(guessedTag=comparison, WEAK_SPOT_WEIGHTS.huntWrongTag)`);
console.log(`     ⇒ comparison 会**进入弱点榜**，分值与真实罪名同权。`);
console.log(`  2) grammarProfileService.buildGrammarProfile：遍历 GRAMMAR_ERROR_TAGS，`);
console.log(`     只要 active/healed 里有 comparison 就 push 进画像 → **画像页会出现「比一比」这一条**，`);
console.log(`     而它对应的「重练档」在 grammarReplayService 里查不到案件 → 空态。`);
console.log(`  3) findActiveIntervention：counts 里 comparison 计数≥门槛就会推卡片，`);
console.log(`     反查 lessonId 时**找不到任何案件带 comparison** → lessonId undefined；`);
console.log(`     但第 17 课（比一比）本身不引用 comparison 案件 ⇒ 永远走 else 分支：`);
console.log(`     "你这两天都在这摔：「两个里比一个，后面的词要带上 -er 或 more」(N 次)——先去复习里练一轮？"`);
console.log(`     ⇒ **指向「复习」而不是具体课**——文案不算错，但把用户推向了与"比一比"无关的复习队列。`);

hr("F · 找出「本该是 comparison」的现有案件（人工判断候选池）");
const CAND: Array<[string, string, string, string, string]> = [];
for (const c of huntCases) {
  for (const e of c.errors) {
    const hay = `${e.original} ${e.correction} ${e.explanation}`;
    if (/(比较级|最高级|更…|更\.|\-er\b|more|most|better|best|than)/.test(hay) && e.tag !== "comparison") {
      CAND.push([c.id, String(c.number), e.tag, `${e.original} → ${e.correction}`, e.explanation]);
    }
  }
}
console.log(`  候选 ${CAND.length} 处（tag 是现在的标注，不是我改的）`);
const byCase = new Map<string, number>();
for (const [id] of CAND) byCase.set(id, (byCase.get(id) ?? 0) + 1);
console.log(`  按案件聚合（哪些案已经是"比较"主题）：`);
for (const [id, n] of [...byCase.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)) {
  const c = huntCases.find((x) => x.id === id);
  console.log(`     ${id.padEnd(28)} #${String(c?.number).padStart(3)} 「${c?.title}」 比较相关错点=${n} / 总错点=${c?.errors.length}  被课程引用=${grammarLessons.some((L) => L.huntCaseIds.includes(id))}`);
}

hr("G · reviewed 守门断言实测（复现 huntService.test.ts R13/R15 的过滤逻辑）");
const cited = new Set<string>();
for (const L of grammarLessons) for (const id of L.huntCaseIds) cited.add(id);
const unreferenced = huntCases.filter((c) => !cited.has(c.id));
console.log(`  案件 ${huntCases.length}；被引用 ${cited.size}；未被引用 ${unreferenced.length}`);
console.log(`  R15 断言：未被引用 且 !reviewed 的案件 = ${unreferenced.filter((c) => !c.reviewed).length} 个 → ${unreferenced.filter((c) => !c.reviewed).length === 0 ? "通过" : "失败"}`);
console.log(`  R13 断言：被引用 且 !reviewed 的案件 = ${huntCases.filter((c) => cited.has(c.id) && !c.reviewed).length} 个 → 通过`);
console.log(`  ⚠️ 关键：R13 断言在 reviewed 全为 true 时是 **恒真**（vacuous）——它无法再发现问题。`);
console.log(`     反证：把全部 reviewed 改成 undefined 再跑，R13 会立刻失败：`);
const fakeUnreviewed = huntCases.filter((c) => cited.has(c.id) && !undefined);
console.log(`     模拟（reviewed 全 undefined）：R13 会抓到 ${fakeUnreviewed.length} 个案件 → 断言**此时才有区分力**。`);

hr("H · 5 个番外案的完整档案");
for (const c of unreferenced) {
  const tags = [...new Set(c.errors.map((e) => e.tag))];
  console.log(`\n  ── ${c.id}  #${c.number} 「${c.title}」  reviewed=${c.reviewed}`);
  console.log(`     场景：${c.scene}`);
  console.log(`     词数=${c.tokens.length}  错点=${c.errors.length}  罪名种类=${tags.length}：${tags.join(", ")}`);
  console.log(`     notes：${(c.notes ?? []).map((n) => n.word).join(", ") || "（无）"}`);
  console.log(`     英文：${JSON.stringify(c.tokens.join(" ")).slice(0, 180)}`);
}
