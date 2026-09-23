import { readFileSync } from "node:fs";
// 指令要求：用 node 词边界正则读源文件，不用 grep（本地 grep 是 ugrep 会假返回 0）
const src = readFileSync("src/data/grammarLessons.ts", "utf8");
const rawText = readFileSync("src/data/grammarLessons.ts", "utf8");

function countRaw(form: string) {
  const re = new RegExp(`\\b${form}\\b`, "gi");
  const m = src.match(re);
  return m ? m.length : 0;
}
// 大小写不敏感 vs 敏感
function countRawCS(form: string) {
  const re = new RegExp(`\\b${form}\\b`, "g");
  const m = src.match(re);
  return m ? m.length : 0;
}

const forms = ["lose","loses","losing","lost","break","breaks","breaking","broke","broken",
               "wear","wears","wearing","wore","worn",
               "slept","sleep","drew","draw","drawn","gave","give","given"];
console.log("=== 原始文本词边界计数（不区分大小写 / 区分大小写 / 文件行数）===");
console.log("form".padEnd(10)+"CI".padStart(6)+"CS".padStart(6));
for (const f of forms) {
  console.log(f.padEnd(10)+String(countRaw(f)).padStart(6)+String(countRawCS(f)).padStart(6));
}
console.log("\nfile chars:", src.length, "lines:", src.split("\n").length);
