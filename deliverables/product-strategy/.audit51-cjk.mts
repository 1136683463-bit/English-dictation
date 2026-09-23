/**
 * 第 51 批 · 主题一复核（三）：用「含中文」当指令型判据 + 大小写归一比对
 */
import { huntCases } from "../../src/data/huntCases";
const CJK = /[\u4e00-\u9fff]/;
let total = 0, cjk = 0, nonCjkMulti = 0, nonCjkOne = 0;
const cjkList: string[] = [], caseIns: string[] = [], weird: string[] = [];
const norm = (s: string) => s.replace(/[^A-Za-z0-9']/g, "").toLowerCase();
for (const hc of huntCases) for (const e of hc.errors) {
  total += 1;
  const c = (e.correction ?? "").trim(), o = (e.original ?? "").trim();
  if (CJK.test(c)) {
    cjk += 1;
    cjkList.push(`${hc.id}#${e.tokenIndex} tag=${e.tag} orig="${e.original}" corr="${c}"`);
  } else if (c.split(/\s+/).filter(Boolean).length >= 2) nonCjkMulti += 1;
  else nonCjkOne += 1;

  if (c === o) weird.push(`[trim 完全相同] ${hc.id}#${e.tokenIndex} orig="${o}" corr="${c}"`);
  else if (norm(c) === norm(o)) caseIns.push(`[仅大小写/标点不同] ${hc.id}#${e.tokenIndex} tag=${e.tag} orig="${o}" corr="${c}"`);

  // 其它可疑：correction 里含英文以外的奇怪符号
  if (!CJK.test(c) && !/^[A-Za-z0-9'’,.!?;:\-— ]+$/.test(c)) weird.push(`[异常字符] ${hc.id}#${e.tokenIndex} corr=${JSON.stringify(c)}`);
}
console.log(`总数 ${total}`);
console.log(`  含中文（指令型）      : ${cjk}`);
console.log(`  纯英文 · 多词         : ${nonCjkMulti}`);
console.log(`  纯英文 · 单词         : ${nonCjkOne}`);
console.log(`  小计                  : ${cjk + nonCjkMulti + nonCjkOne}`);

console.log(`\n════ 含中文的 ${cjk} 条全列 ════`);
cjkList.forEach((s, i) => console.log(`${String(i + 1).padStart(3)}. ${s}`));

console.log(`\n════ 归一到字母数字后与原词相同（仅大小写/标点差异）${caseIns.length} 条 ════`);
caseIns.forEach((s) => console.log("  " + s));
console.log(`\n════ trim 后完全相同的 ════`);
console.log(weird.filter((w) => w.startsWith("[trim")).length ? weird.filter((w) => w.startsWith("[trim")).join("\n") : "  0 条");
console.log(`\n════ 异常字符 ════`);
const ab = weird.filter((w) => w.startsWith("[异常"));
console.log(ab.length ? ab.join("\n") : "  0 条");
