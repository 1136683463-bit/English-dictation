/** 上批复核②：types.ts 里 wrongMark 文档声称的 674 / 502 / 52 / 65 多词 */
import { grammarLessons } from "../../src/data/grammarLessons";
let total = 0, hasMark = 0, bothRight = 0, neither = 0, multi = 0;
const multiEx: string[] = [];
for (const l of grammarLessons) for (const c of l.contrast ?? []) {
  total += 1;
  const m = (c.wrongMark ?? "").trim();
  const hasM = m.length > 0;
  if (hasM) {
    hasMark += 1;
    if (m.split(/\s+/).filter(Boolean).length > 1) { multi += 1; if (multiEx.length < 10) multiEx.push(`L${l.number} ${l.id} mark="${m}"`); }
  } else if (c.bothRight) bothRight += 1;
  else neither += 1;
}
console.log(`contrast 卡总数        ${total}`);
console.log(`wrongMark 有值         ${hasMark}   （文档称 674）`);
console.log(`bothRight:true 无值    ${bothRight}   （文档称 502）`);
console.log(`bothRight 省略 无值    ${neither}   （文档称 52）`);
console.log(`合计检验               ${hasMark + bothRight + neither} === ${total} ? ${hasMark + bothRight + neither === total}`);
console.log(`\nwrongMark 是多词形态   ${multi}   （文档称 65）`);
multiEx.forEach((s) => console.log("   " + s));
