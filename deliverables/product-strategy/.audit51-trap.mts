/** 第七类候选：「陷阱词」——登记为 error，但讲解说「这句没问题」，correction 只是凑数 */
import { huntCases } from "../../src/data/huntCases";
const TRAP = /这句没问题|本身没错|这里的陷阱|不是错|并没有错/;
let n = 0; const rows: string[] = [];
for (const hc of huntCases) for (const e of hc.errors) {
  if (!TRAP.test(e.explanation ?? "")) continue;
  n += 1;
  rows.push(`${hc.id}#${e.tokenIndex} tag=${e.tag} orig="${e.original}" corr="${e.correction}"\n      讲: ${e.explanation}`);
}
console.log(`讲解自称「这句没问题 / 陷阱」但被登记为 error 的：${n} 条\n`);
rows.forEach((r) => console.log("  • " + r + "\n"));
