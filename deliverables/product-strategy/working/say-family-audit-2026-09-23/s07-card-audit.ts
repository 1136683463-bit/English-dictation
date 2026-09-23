/**
 * s07：对照卡的「可修性」机械核查
 *
 * 判据（纯机械，不依赖语义理解）：
 *   一张错卡声明「问题就在 wrongMark 这个词」，那么把 **恰好这一个词** 修好，
 *   应该就得到 correct。若修好 wrongMark 后仍 ≠ correct，说明这张卡的
 *   「标出的错词」与「要学的正确句」**不是同一处差异** —— 用户照卡办也到不了正确句。
 *
 * 这是「题干-答案一致性」在对照卡上的自然延伸（现有守门只覆盖 practice 的数量线索）。
 */
import { grammarLessons } from "../../../../src/data/grammarLessons";

const norm = (s: string) => s.trim().replace(/\s+/g, " ").replace(/[.!?]+$/, "");

interface CardAudit {
  lesson: number;
  idx: number;
  kind: "错卡(标词)" | "错卡(整句)" | "双正解";
  wrong: string;
  mark: string | null;
  correct: string;
  fixableByMark: boolean | null;
  /** 标词是否也出现在 correct 里（若出现，标词不可能「就是那处错」） */
  markAlsoInCorrect: boolean | null;
  whyZh: string;
}

const out: CardAudit[] = [];
for (const l of grammarLessons) {
  for (const [i, c] of (l.contrast ?? []).entries()) {
    const kind: CardAudit["kind"] = c.bothRight ? "双正解" : c.wrongMark ? "错卡(标词)" : "错卡(整句)";
    const mark = c.wrongMark ?? null;
    let fixableByMark: boolean | null = null;
    let markAlsoInCorrect: boolean | null = null;
    if (mark && !c.bothRight) {
      // 把 wrong 里标出的那一处替换成 correct 对应位置的词，看是否得到 correct
      const w = norm(c.wrong), k = norm(c.correct);
      const wi = w.split(" "), ki = k.split(" ");
      // 找第一处不同的下标
      let d = 0;
      while (d < Math.min(wi.length, ki.length) && wi[d] === ki[d]) d++;
      // 把 wrong 的第 d 个词换成 correct 的第 d 个词
      const fixed = [...wi];
      if (d < ki.length) fixed[d] = ki[d];
      else fixed.splice(d, 1);
      fixableByMark = norm(fixed.join(" ")) === k && wi.length === ki.length;
      // 标词（去标点）是否也出现在 correct 里
      const bare = mark.replace(/[^A-Za-z']/g, "").toLowerCase();
      markAlsoInCorrect = new RegExp(`(?<![A-Za-z-])${bare.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![A-Za-z-])`, "i").test(c.correct);
    }
    out.push({ lesson: l.number, idx: i, kind, wrong: c.wrong, mark, correct: c.correct, fixableByMark, markAlsoInCorrect, whyZh: c.whyZh });
  }
}

console.log("════════════════════════════════════════════════════════════════");
console.log("s07-A · 全库对照卡规模");
console.log("════════════════════════════════════════════════════════════════");
const byKind = (k: CardAudit["kind"]) => out.filter((x) => x.kind === k);
console.log(`  总卡数          ${out.length}`);
console.log(`  错卡(标词)      ${byKind("错卡(标词)").length}`);
console.log(`  错卡(整句)      ${byKind("错卡(整句)").length}`);
console.log(`  双正解          ${byKind("双正解").length}`);
console.log(`  涉及课数        ${new Set(out.map((x) => x.lesson)).size} / ${grammarLessons.length}`);

console.log("\n════════════════════════════════════════════════════════════════");
console.log("s07-B · 「单点可修」核查：修好 wrongMark 是否就得到 correct");
console.log("════════════════════════════════════════════════════════════════");
const marked = byKind("错卡(标词)");
const unfixable = marked.filter((x) => x.fixableByMark === false);
const alsoInCorrect = marked.filter((x) => x.markAlsoInCorrect === true);
console.log(`  错卡(标词) 共 ${marked.length} 张`);
console.log(`  ✅ 单点可修（改标词即达 correct）        ${marked.filter((x) => x.fixableByMark).length} 张`);
console.log(`  ⚠️ 单点不可修（改标词仍≠ correct）      ${unfixable.length} 张`);
console.log(`  ⚠️ 标词同时出现在 correct 里            ${alsoInCorrect.length} 张`);

if (unfixable.length) {
  console.log("\n  ── 单点不可修的卡（逐张）──");
  for (const x of unfixable) {
    console.log(`  L${String(x.lesson).padStart(3)} contrast[${x.idx}]  标词=${JSON.stringify(x.mark)}`);
    console.log(`       wrong  = ${JSON.stringify(x.wrong)}`);
    console.log(`       correct= ${JSON.stringify(x.correct)}`);
    console.log(`       whyZh  = ${x.whyZh.slice(0, 120)}`);
  }
}
if (alsoInCorrect.length) {
  console.log("\n  ── 标词也出现在 correct 里的卡（逐张，这些是本判据的最强信号）──");
  for (const x of alsoInCorrect) {
    console.log(`  L${String(x.lesson).padStart(3)} contrast[${x.idx}]  标词=${JSON.stringify(x.mark)}`);
    console.log(`       wrong  = ${JSON.stringify(x.wrong)}`);
    console.log(`       correct= ${JSON.stringify(x.correct)}`);
    console.log(`       whyZh  = ${x.whyZh.slice(0, 130)}`);
  }
}

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s07-C · L38 的 8 张卡逐张审计（本批重点）");
console.log("════════════════════════════════════════════════════════════════");
const l38 = grammarLessons.find((l) => l.number === 38)!;
console.log(`  L38「${l38.title}」 ${l38.grammarLabel}`);
console.log(`  target = ${JSON.stringify(l38.targetSentence)}`);
console.log(`  卡数 = ${l38.contrast!.length}（全库最多；次高 L23/L50 各 7）`);
for (const [i, c] of l38.contrast!.entries()) {
  const a = out.find((x) => x.lesson === 38 && x.idx === i)!;
  const tag = c.bothRight ? "双正解  " : c.wrongMark ? `错(${c.wrongMark})` : "错(整句)";
  console.log(`\n  [${i}] ${tag}`);
  console.log(`      wrong   = ${JSON.stringify(c.wrong)}`);
  console.log(`      wrongMark = ${JSON.stringify(c.wrongMark ?? null)}`);
  console.log(`      correct = ${JSON.stringify(c.correct)}`);
  console.log(`      whyZh   = ${c.whyZh}`);
  if (c.wrongMark && !c.bothRight) console.log(`      ⮕ 单点可修=${a.fixableByMark}  标词也在 correct 里=${a.markAlsoInCorrect}`);
}

console.log("\n\n════════════════════════════════════════════════════════════════");
console.log("s07-D · ⭐ 本批核心疑点：L38 card[6] 与 card[7] 是否互相矛盾");
console.log("════════════════════════════════════════════════════════════════");
const c6 = l38.contrast![6];
const c7 = l38.contrast![7];
console.log(`  card[6]  错卡：wrong = ${JSON.stringify(c6.wrong)}`);
console.log(`           标出的错词 wrongMark = ${JSON.stringify(c6.wrongMark)}  ← 卡片把「said」指为问题所在`);
console.log(`           给出的正确句 correct   = ${JSON.stringify(c6.correct)}`);
console.log(`           讲解 whyZh 说的问题是什么：`);
console.log(`             "${c6.whyZh}"`);
console.log(`  card[7]  双正解：wrong 字段装的是正确句 = ${JSON.stringify(c7.wrong)}`);
console.log(`           即本课自己声明「She said to me she will come.」是对的`);
console.log(`\n  ⇒ card[6] 把 said 划掉（渲染为删除线），card[7] 说含 said 的句子是对的。`);
console.log(`     同一课内，said 既被标为错、又被标为对。`);
console.log(`\n  机械核验：card[6] 的标词是否就是那处错？`);
const a6 = out.find((x) => x.lesson === 38 && x.idx === 6)!;
console.log(`     单点可修（改 said 就得到 correct）= ${a6.fixableByMark}`);
console.log(`     把 said 换成 says → "She says me she will come." 仍不等于 correct "${c6.correct}"`);
console.log(`     ⇒ 标词不是那处错：真正的差异是**少了 to**（讲解自己也这么说）。`);
console.log(`\n  外部权威怎么说：Cambridge《Say or tell》——`);
console.log(`     "Say does not take an indirect object. Instead, we use a phrase with to:"`);
console.log(`     "And then she said to me, 'I'm your cousin. We've never met before.'"`);
console.log(`     "Not: And then she said me …"`);
console.log(`     ⇒ 错的是「少了 to」，不是 said。said 本身是 say 的正当过去式：`);
console.log(`        "The past simple of say is said, the past simple of tell is told"`);
