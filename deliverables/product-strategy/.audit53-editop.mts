/**
 * 第 53 批 · editOp 落地前的类型化全库扫描（瑞思用；只读，不改任何数据）
 *
 * 运行：./node_modules/.bin/vite-node deliverables/product-strategy/.audit53-editop.mts
 *
 * 为什么不用 grep：本地 `grep` 是 ugrep 包装，存在假返回 0 的风险（上批被跨条目误匹配骗过两次）。
 * 本脚本一律 `import` TS 数据后逐字段判定。
 *
 * 口径声明：
 *  - 数据源：src/data/huntCases.ts 的 huntCases[].errors[]（唯一含 HuntError.correction 的集合）
 *  - 不掺入 boost 的 spot.answer / correctionZh、不掺入 contrast 的 bothRight.wrong ——
 *    它们不是 HuntError.correction，形态口径不同
 *  - 分类互斥，按优先级命中即停（顺序见 classify()）
 */
import { huntCases } from "../../src/data/huntCases";
import type { HuntError } from "../../src/types";

const hasHan = (s: string) => /[\u4e00-\u9fa5]/.test(s);
const T = (s: string) => s.trim();
const stripP = (s: string) => T(s).replace(/[.,!?;:]+$/, "");
const LOW = (s: string) => stripP(s).toLowerCase();

/** 产品里 correctedSentenceOf 的删词判据（huntService.ts:337 原样） */
const PROD_DEL = /^（?去掉|去掉/;
/** 产品里 correctedSentenceOf 的箭头判据（huntService.ts:344 原样） */
const PROD_ARROW = /→\s*([A-Za-z][A-Za-z'’\- ]*)/;
/** 移动型的「把 X 移到/搬到 Y 前/后面」 */
const MOVE_BA = /^把\s*(.+?)\s*(?:移|搬|放|挪)到\s*(.+?)\s*(前面|后面)$/;

type Op =
  | "replace"  // 整段替换该位置
  | "insert"   // 补词（correction 含 original 且更长）
  | "delete"   // 删词
  | "move"     // 换位
  | "punct"    // 只动标点
  | "case"     // 只动大小写
  | "note";    // 纯中文说明（句子层无机械改法）

function classify(e: HuntError): Op {
  const c = T(e.correction);
  if (!c) return "note";                             // 空修正：无机械改法
  if (PROD_DEL.test(c)) return "delete";             // 以产品判据为准（含「去掉…，并入上一句」这类混合）
  if (MOVE_BA.test(c) || /对调/.test(c)) return "move";
  // 只动大小写：字面完全相同、仅大小写不同
  if (T(e.original).toLowerCase() === c.toLowerCase() && T(e.original) !== c) return "case";
  // 只动标点：去尾标点后完全相同、仅标点不同
  if (stripP(e.original) === stripP(c) && T(e.original) !== c) return "punct";
  if (hasHan(c)) return "note";                      // 其余含中文 = 说明型
  const o = LOW(e.original).split(/\s+/).filter(Boolean);
  const cw = LOW(c).split(/\s+/).filter(Boolean);
  if (cw.length > o.length) {
    // correction 里是否把 original 整段原样保留 + 多出词（= 补词）
    for (let i = 0; i + o.length <= cw.length; i++) {
      if (o.every((x, k) => cw[i + k] === x)) return "insert";
    }
  }
  return "replace";
}

const rows: Array<{ caseId: string; number: number; tokens: string[]; e: HuntError; op: Op }> = [];
for (const hc of huntCases) {
  for (const e of hc.errors) rows.push({ caseId: hc.id, number: hc.number, tokens: hc.tokens, e, op: classify(e) });
}

const ORDER: Op[] = ["replace", "insert", "delete", "move", "punct", "case", "note"];
const tally: Record<string, number> = {};
for (const r of rows) tally[r.op] = (tally[r.op] ?? 0) + 1;

console.log("════ 1. 基数 ════");
console.log(`案件数 ${huntCases.length}，错点数 ${rows.length}`);
let sum = 0;
for (const k of ORDER) { console.log(`  ${k.padEnd(8)} = ${String(tally[k] ?? 0).padStart(3)}`); sum += tally[k] ?? 0; }
console.log(`  合计 = ${sum} → ${sum === rows.length ? "✓ 全域覆盖且互斥" : "✗ 不闭合"}`);

console.log("\n════ 2. 与任务书给的旧数字对账 ════");
console.log("  任务书：单词替换 614 / 多词替换 101 / 删除 55 / 移动 13 / 括注式 13 = 796");
console.log(`  实测  ：错点 ${rows.length}（差 ${796 - rows.length}）`);
console.log(`          移动型（把…移到|搬到|对调）= ${tally.move}（任务书 13）`);

console.log("\n════ 3. 移动型逐条（含 Y 锚点可解析性）════");
for (const r of rows.filter((x) => x.op === "move")) {
  const c = T(r.e.correction);
  const m = MOVE_BA.exec(c);
  if (!m) { console.log(`  ${r.caseId}#${r.e.tokenIndex} 「对调」型：${c}`); continue; }
  const X = m[1].trim(), Y = m[2].trim(), side = m[3];
  const tokAt = r.tokens[r.e.tokenIndex];
  const yw = Y.split(/\s+/).map(LOW).filter(Boolean);
  const cands: number[] = [];
  const toks = r.tokens.map(LOW);
  for (let i = 0; i + yw.length <= toks.length; i++) if (yw.every((w, k) => toks[i + k] === w)) cands.push(i);
  const xOk = LOW(tokAt) === LOW(X);
  console.log(
    `  ${r.caseId.padEnd(22)} tokenIndex=${String(r.e.tokenIndex).padStart(2)} token=${JSON.stringify(tokAt).padEnd(10)}` +
    ` X=${JSON.stringify(X).padEnd(9)} X@tokenIndex=${xOk ? "是" : "否✗"}  Y=${JSON.stringify(Y).padEnd(11)} Y候选=${JSON.stringify(cands)}`
  );
}

console.log("\n════ 4. 产品判据 /^（?去掉|去掉/ 实际命中的条数（含被误伤的）════");
for (const r of rows.filter((x) => PROD_DEL.test(T(x.e.correction)))) {
  const c = T(r.e.correction);
  const isRealDelete = /^去掉/.test(c) || /^（去掉/.test(c);
  if (!isRealDelete) console.log(`  ⚠ 被误伤为删词：${r.caseId}#${r.e.tokenIndex} "${c}"`);
}
console.log("  （只列出「不以 去掉 开头、却因无锚点分支被命中的」——上行为空表示无误伤）");

console.log("\n════ 5. 设计 editOp 后「句子层会变」的条目（现状 vs 应然）════");
console.log("  5.1 标点型 13 处：产品的 correctedSentenceOf 会吞掉 correction 自带的尾标点");
for (const r of rows.filter((x) => x.op === "punct")) {
  const origTail = /([.,!?;:]+)$/.exec(T(r.e.original))?.[1] ?? "";
  const corrTail = /([.,!?;:]+)$/.exec(T(r.e.correction))?.[1] ?? "";
  const tokTail = /([.,!?;:]+)$/.exec(r.tokens[r.e.tokenIndex])?.[1] ?? "";
  console.log(
    `    ${r.caseId.padEnd(22)} idx=${String(r.e.tokenIndex).padStart(2)} ` +
    `original=${JSON.stringify(r.e.original)} correction=${JSON.stringify(r.e.correction)} ` +
    `→ 产品保留的是 token 的 "${tokTail}"，correction 想要的 "${corrTail}" 被丢`
  );
}
console.log("  5.2 大小写型");
for (const r of rows.filter((x) => x.op === "case")) {
  console.log(`    ${r.caseId}#${r.e.tokenIndex} ${JSON.stringify(r.e.original)} → ${JSON.stringify(r.e.correction)}`);
}
console.log("  5.3 说明型（句子层不机械改动，保持原词——这些位置修正后仍非英文正确形）");
for (const r of rows.filter((x) => x.op === "note")) {
  console.log(`    ${r.caseId}#${r.e.tokenIndex} token=${JSON.stringify(r.tokens[r.e.tokenIndex])} correction=${JSON.stringify(r.e.correction)}`);
}

console.log("\n════ 6. correctedSentenceOf 的分支直方图（现状）════");
function prodSentence(tokens: string[], errors: HuntError[]): string {
  const t = [...tokens];
  for (const e of [...errors].sort((a, b) => b.tokenIndex - a.tokenIndex)) {
    const i = e.tokenIndex;
    if (i < 0 || i >= t.length) continue;
    const c = T(e.correction);
    if (PROD_DEL.test(c)) { t.splice(i, 1); continue; }
    if (!c) continue;
    const am = PROD_ARROW.exec(c);
    if (am) { t[i] = `${am[1].trim().replace(/[.,!?;:]+$/, "")}${/([.,!?;:]+)$/.exec(t[i])?.[1] ?? ""}`; continue; }
    if (hasHan(c)) continue;
    t[i] = `${c.replace(/[.,!?;:]+$/, "")}${/([.,!?;:]+)$/.exec(t[i])?.[1] ?? ""}`;
  }
  return t.join(" ");
}
let arrowHits = 0;
const cjkLeft: string[] = [];
for (const hc of huntCases) {
  const out = prodSentence(hc.tokens, hc.errors);
  if (/[\u4e00-\u9fa5（）]/.test(out)) cjkLeft.push(`  ⚠ ${hc.id}: ${out}`);
  const cjkItems = hc.errors.filter((e) => hasHan(T(e.correction)));
  for (const e of cjkItems) if (PROD_ARROW.test(T(e.correction))) arrowHits += 1;
}
console.log(`  箭头分支被真正执行到的条数 = ${arrowHits}（全库含 → 的 correction 仅 ${rows.filter((x) => x.e.correction.includes("→")).length} 条）`);
console.log(`  修正句仍含中文/全角括号的案件 = ${cjkLeft.length}`);
for (const x of cjkLeft) console.log(x);

console.log("\n════ 7. 移动型 (b) 方案可行性：按 tokenIndex 定位 X、就近取 Y、标点随行 ════");
function moveSim(hcId: string, repair: boolean): string {
  const hc = huntCases.find((x) => x.id === hcId)!;
  const t = [...hc.tokens];
  const others = hc.errors.filter((e) => !(MOVE_BA.test(T(e.correction)) || /对调/.test(T(e.correction))));
  for (const e of [...others].sort((a, b) => b.tokenIndex - a.tokenIndex)) {
    const i = e.tokenIndex;
    if (i < 0 || i >= t.length) continue;
    const c = T(e.correction);
    if (PROD_DEL.test(c)) { t.splice(i, 1); continue; }
    if (!c) continue;
    const am = PROD_ARROW.exec(c);
    if (am) { t[i] = `${am[1].trim().replace(/[.,!?;:]+$/, "")}${/([.,!?;:]+)$/.exec(t[i])?.[1] ?? ""}`; continue; }
    if (hasHan(c)) continue;
    t[i] = `${c.replace(/[.,!?;:]+$/, "")}${/([.,!?;:]+)$/.exec(t[i])?.[1] ?? ""}`;
  }
  for (const e of hc.errors.filter((x) => MOVE_BA.test(T(x.correction)))) {
    const m = MOVE_BA.exec(T(e.correction))!;
    const Y = m[2].trim(), side = m[3];
    const yw = Y.split(/\s+/).map(LOW).filter(Boolean);
    const cands: number[] = [];
    const toks = t.map(LOW);
    for (let i = 0; i + yw.length <= toks.length; i++) if (yw.every((w, k) => toks[i + k] === w)) cands.push(i);
    if (!cands.length || e.tokenIndex >= t.length) continue;
    const anchor = side === "后面"
      ? (cands.filter((i) => i > e.tokenIndex).sort((a, b) => a - b)[0] ?? cands[cands.length - 1])
      : (cands.filter((i) => i < e.tokenIndex).sort((a, b) => b - a)[0] ?? cands[0]);
    const movedTok = t[e.tokenIndex];
    const punct = /([.,!?;:]+)$/.exec(movedTok)?.[1] ?? "";
    const bare = movedTok.replace(/[.,!?;:]+$/, "");
    t.splice(e.tokenIndex, 1);
    let ins = anchor > e.tokenIndex ? anchor - 1 : anchor;
    if (side === "后面") ins += 1;
    if (repair && punct && ins < t.length) {
      if (ins - 1 >= 0 && !/([.,!?;:]+)$/.test(t[ins - 1])) t[ins - 1] += punct;
      t.splice(ins, 0, bare);
    } else {
      t.splice(ins, 0, bare + punct);
    }
  }
  if (repair) {
    for (let i = 0; i < t.length; i++) {
      const start = i === 0 || /[.!?]$/.test(t[i - 1]);
      if (start && /^[a-z]/.test(t[i])) t[i] = t[i][0].toUpperCase() + t[i].slice(1);
    }
  }
  return t.join(" ");
}
const moveCases = [...new Set(rows.filter((x) => x.op === "move").map((x) => x.caseId))];
for (const id of moveCases) {
  const hc = huntCases.find((x) => x.id === id)!;
  console.log(`\n  ${id}`);
  console.log(`    原文 : ${hc.tokens.join(" ")}`);
  console.log(`    (a)  : ${prodSentence(hc.tokens, hc.errors)}`);
  console.log(`    (b)  : ${moveSim(id, false)}`);
  console.log(`    (b)+标点/大写修复 : ${moveSim(id, true)}`);
}

console.log("\n════ 8. 自我核查：断言用到的常量 ════");
console.log(`  correction 总数（typed read）      = ${rows.length}`);
console.log(`  correction 出现次数（源码字面计数）= ${(await import("node:fs")).readFileSync("src/data/huntCases.ts", "utf8").match(/correction:/g)?.length ?? 0}`);
console.log(`  header 实测总错点（H1 测试打印）    = 794`);
