/** 确认高优先缺口的现有替代情况（避免重复造课） */
import { grammarLessons } from "../../../../src/data/grammarLessons";
const all=JSON.stringify(grammarLessons).toLowerCase();
const CHECK:[string,RegExp,string][]=[
  ["反身代词 myself/yourself", /\b(myself|yourself|himself|herself|themselves)\b/, "A2 高频：by myself / help yourself"],
  ["each other", /each other/, "A2：互相"],
  ["too many / too much", /too (many|much)/, "A2：太多（可数/不可数）"],
  ["a lot of / lots of", /a lot of|lots of/, "A1：很多（比 many 更口语）"],
  ["Why don't you", /why don't you|why not/, "A2：建议句式"],
  ["I'd like", /i'd like/, "A2：缩写形式（课内只有 I would like）"],
  ["both...and", /both \w+ and /, "B1：既…又…"],
  ["neither...nor", /neither .* nor /, "B1：既不…也不…"],
  ["unless", /unless/, "B1：除非"],
  ["in order to", /in order to/, "B1：为了"],
  ["be able to", /able to/, "B1：能够（can 的替身）"],
  ["so do I（倒装）", /so do i|neither do i|so am i/, "B1：我也是/我也不"],
  ["would rather", /would rather/, "B1：宁愿"],
  ["shall", /\bshall\b/, "B1：征求意见"],
  ["prefer", /prefer/, "B1：更喜欢"],
  ["过去完成时", /had (done|finished|seen|eaten|left|come|broken)/, "B1+：过去的过去"],
];
console.log("高优先缺口确认（全字段搜索）：\n");
const todo:{name:string,level:string,note:string}[]=[];
for(const [name,re,note] of CHECK){
  const hit=re.test(all);
  if(!hit) todo.push({name,level:note.split("：")[0],note});
  console.log(`  ${hit?"✓ 已有":"✗ 缺失"} ${name.padEnd(26)} ${note}`);
}
console.log(`\n需补 ${todo.length} 项`);
