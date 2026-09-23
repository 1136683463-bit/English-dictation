/**
 * s16：把「任务书 says=21」的精确口径找出来（穷举常见的字段组合）
 * 目的：诚实报告——若找不到完全一致的口径，就说明我的口径与任务书不同，并给出我的数。
 */
import { grammarLessons } from "../../../../src/data/grammarLessons";
import { huntCases } from "../../../../src/data/huntCases";

const rx = (f: string) => new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i");

/** 分槽位收集（课侧），便于按组合求和 */
function slotsByField(form: string) {
  const r = rx(form);
  const byField: Record<string, number> = {};
  const add = (k: string, t?: string | null) => { if (t && r.test(t)) byField[k] = (byField[k] ?? 0) + 1; };
  for (const l of grammarLessons) {
    add("targetSentence", l.targetSentence); add("dialogueEn", l.dialogueEn);
    for (const d of l.dialogue ?? []) add("dialogue", d.en);
    for (const e of l.examples) add("examples", e.en);
    for (const v of l.variants ?? []) add("variants", v.en);
    for (const s of l.sceneSwings ?? []) add("sceneSwings", s.en);
    for (const b of l.blocks) add("blocks", b.text);
    for (const c of l.contrast ?? []) {
      add("contrast.correct", c.correct);
      if (c.bothRight) add("contrast.wrongBothRight", c.wrong);
    }
    for (const g of l.guided) {
      if (g.kind === "spot") continue;
      add("guided.answer", g.answer); add("guided.replaceBase", g.replaceBase); add("guided.tokens", (g.tokens ?? []).join(" "));
      for (const o of g.options ?? []) if (o === g.answer) add("guided.optionsEqAnswer", o);
    }
    for (const p of l.practice) add("practice.answer", p.answer);
    add("recall.answer", l.recall?.answer);
  }
  // 案侧：tokens 里未被 errors 指向的 = 正确用法；errors.correction = 用户要答出的
  let caseTokensClean = 0, caseCorrection = 0;
  for (const c of huntCases) {
    const errIdx = new Set(c.errors.map((e) => e.tokenIndex));
    for (const [i, t] of c.tokens.entries()) if (r.test(t) && !errIdx.has(i)) caseTokensClean++;
    for (const e of c.errors) if (r.test(e.correction)) caseCorrection++;
  }
  byField["案.tokens(正确用法)"] = caseTokensClean;
  byField["案.errors.correction"] = caseCorrection;
  return byField;
}

const FORMS = ["say", "says", "said"];
const tables: Record<string, Record<string, number>> = {};
for (const f of FORMS) tables[f] = slotsByField(f);

console.log("════════════════════════════════════════════════════════════════");
console.log("s16-A · 逐槽位分解（课侧 + 案侧）");
console.log("════════════════════════════════════════════════════════════════");
const keys = [...new Set(Object.values(tables).flatMap((t) => Object.keys(t)))].sort();
console.log("  槽位".padEnd(28) + FORMS.map((f) => f.padStart(7)).join(""));
for (const k of keys) console.log(`  ${k.padEnd(26)}${FORMS.map((f) => String(tables[f][k] ?? 0).padStart(7)).join("")}`);
const tot = (f: string, ks: string[]) => ks.reduce((s, k) => s + (tables[f][k] ?? 0), 0);

console.log("\n════════════════════════════════════════════════════════════════");
console.log("s16-B · 穷举字段组合，找 says=21 且 say=2 且 said=1 的口径");
console.log("════════════════════════════════════════════════════════════════");
const GROUPS: Record<string, string[]> = {
  "targetSentence": ["targetSentence"],
  "dialogueEn": ["dialogueEn"],
  "dialogue": ["dialogue"],
  "examples": ["examples"],
  "variants": ["variants"],
  "sceneSwings": ["sceneSwings"],
  "blocks": ["blocks"],
  "contrast.correct": ["contrast.correct"],
  "bothRightWrong": ["contrast.wrongBothRight"],
  "guided.answer": ["guided.answer"],
  "guided.replaceBase": ["guided.replaceBase"],
  "guided.tokens": ["guided.tokens"],
  "guided.optionsEq": ["guided.optionsEqAnswer"],
  "practice": ["practice.answer"],
  "recall": ["recall.answer"],
  "案tokens": ["案.tokens(正确用法)"],
  "案correction": ["案.errors.correction"],
};
const names = Object.keys(GROUPS);
const target = { say: 2, says: 21, said: 1 };
const found: string[] = [];
// 只穷举「课侧子集是否包含案侧」的两层，避免 2^17 爆炸：先固定案侧开关（4 种），再穷举课侧 13 组
const caseSwitches: [string, string[]][] = [["无案侧", []], ["含案tokens", ["案tokens"]], ["含案correction", ["案correction"]], ["含案两侧", ["案tokens", "案correction"]]];
const courseGroups = names.filter((n) => !n.startsWith("案"));
for (const [csLabel, cs] of caseSwitches) {
  for (let mask = 0; mask < 1 << courseGroups.length; mask++) {
    const sel: string[] = [...cs];
    for (let b = 0; b < courseGroups.length; b++) if (mask & (1 << b)) sel.push(courseGroups[b]);
    const ks = sel.flatMap((g) => GROUPS[g]);
    const v = { say: tot("say", ks), says: tot("says", ks), said: tot("said", ks) };
    if (v.say === target.say && v.says === target.says && v.said === target.said) found.push(`${csLabel} + {${sel.join(", ")}}`);
  }
}
console.log(`  找到 ${found.length} 个口径满足 (say=2, says=21, said=1)：`);
for (const s of found.slice(0, 30)) console.log(`  ✅ ${s}`);
if (found.length > 30) console.log(`  …（余 ${found.length - 30} 个）`);
if (!found.length) {
  console.log("  ⚠️ 没有任何字段组合能同时给出 2 / 21 / 1。");
  console.log("     ⇒ 任务书的 21 可能用了别的原子（如去重、或按课计数、或漏掉了某几个字段）。");
}

console.log("\n════════════════════════════════════════════════════════════════");
console.log("s16-C · 我的口径下的确定数字（报告用）");
console.log("════════════════════════════════════════════════════════════════");
const V3 = {
  "课侧正（排除 spot.answer，不含 bothRight.wrong）": { say: tot("say", ["targetSentence","dialogueEn","dialogue","examples","variants","sceneSwings","blocks","contrast.correct","guided.answer","guided.replaceBase","guided.tokens","guided.optionsEqAnswer","practice.answer","recall.answer"]), says: tot("says", ["targetSentence","dialogueEn","dialogue","examples","variants","sceneSwings","blocks","contrast.correct","guided.answer","guided.replaceBase","guided.tokens","guided.optionsEqAnswer","practice.answer","recall.answer"]), said: tot("said", ["targetSentence","dialogueEn","dialogue","examples","variants","sceneSwings","blocks","contrast.correct","guided.answer","guided.replaceBase","guided.tokens","guided.optionsEqAnswer","practice.answer","recall.answer"]) },
  "课侧正（含 bothRight.wrong，它装的是正确句）": { say: tot("say", ["targetSentence","dialogueEn","dialogue","examples","variants","sceneSwings","blocks","contrast.correct","contrast.wrongBothRight","guided.answer","guided.replaceBase","guided.tokens","guided.optionsEqAnswer","practice.answer","recall.answer"]), says: tot("says", ["targetSentence","dialogueEn","dialogue","examples","variants","sceneSwings","blocks","contrast.correct","contrast.wrongBothRight","guided.answer","guided.replaceBase","guided.tokens","guided.optionsEqAnswer","practice.answer","recall.answer"]), said: tot("said", ["targetSentence","dialogueEn","dialogue","examples","variants","sceneSwings","blocks","contrast.correct","contrast.wrongBothRight","guided.answer","guided.replaceBase","guided.tokens","guided.optionsEqAnswer","practice.answer","recall.answer"]) },
};
for (const [label, v] of Object.entries(V3)) console.log(`  ${label}\n     say=${v.say}  says=${v.says}  said=${v.said}   （比 ${(v.says / Math.max(1, v.said)).toFixed(1)} : 1）`);
