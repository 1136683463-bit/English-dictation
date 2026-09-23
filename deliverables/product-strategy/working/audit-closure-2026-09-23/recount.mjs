// 批 50 · 独立复核：wrongMark 三分类（499 / 110 / 65）
// 口径：只有 bothRight !== true 的「真错卡」才计入（bothRight 卡的 wrong 装的是正确句，其 wrongMark 恒为 null/空）
import { grammarLessons } from '/tmp/audit50/gl.mjs';

const clean = (s) => String(s ?? '').replace(/[.,!?;:"'’“”()]/g, '').toLowerCase();
const words = (s) => String(s ?? '').split(/\s+/).filter(Boolean);
// 词边界正则（与批四十七/四十八/四十九同款）
const rx = (w) => new RegExp(`(?<![A-Za-z-])${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![A-Za-z-])`, 'i');
const hasWord = (sent, w) => rx(w).test(String(sent ?? ''));

let total = 0, bothRightCards = 0, trueWrongCards = 0;
let markPresent = 0, markEmpty = 0;
const cat = { onlyWrong: [], bothSides: [], onlyCorrect: [], neither: [] };

for (const l of grammarLessons) {
  for (let i = 0; i < (l.contrast ?? []).length; i++) {
    const c = l.contrast[i];
    total++;
    if (c.bothRight === true) { bothRightCards++; continue; }
    trueWrongCards++;
    const mark = (c.wrongMark ?? '').trim();
    if (!mark) { markEmpty++; continue; }
    markPresent++;

    const mw = words(mark).map(clean).filter(Boolean);
    const rec = {L: l.number, i, mark, wrong: c.wrong, correct: c.correct, wm: c.wrongMark};

    // 逐词判定：每个标出的词在错句/正确句里各自是否存在（词边界口径）
    let inWrong = false, inCorrect = false;
    for (const w of mw) {
      if (hasWord(c.wrong, w)) inWrong = true;
      if (hasWord(c.correct, w)) inCorrect = true;
    }
    // 另记：UI 实际渲染用的判据是 raw substring（GrammarLessonPage.tsx:239 `item.wrong.includes(mark)`）
    rec.rawInWrong = String(c.wrong ?? '').includes(mark);

    if (inWrong && inCorrect) cat.bothSides.push(rec);
    else if (inWrong && !inCorrect) cat.onlyWrong.push(rec);
    else if (!inWrong && inCorrect) cat.onlyCorrect.push(rec);
    else cat.neither.push(rec);
  }
}

console.log('=== 基线 ===');
console.log('课程数              ', grammarLessons.length);
console.log('contrast 卡总数     ', total);
console.log('  bothRight 双正解卡', bothRightCards);
console.log('  真错卡(bothRight≠T)', trueWrongCards);
console.log('    wrongMark 有值  ', markPresent);
console.log('    wrongMark 空/缺 ', markEmpty);
console.log();
console.log('=== 三分类（词边界口径，与任务书对照）===');
console.log('只在错句   ', cat.onlyWrong.length, '  任务书 499');
console.log('两边都有   ', cat.bothSides.length, '  任务书 110');
console.log('只在正确句 ', cat.onlyCorrect.length, '  任务书  65');
console.log('两边都没有 ', cat.neither.length, '  （任务书未列）');
console.log('合计       ', cat.onlyWrong.length + cat.bothSides.length + cat.onlyCorrect.length + cat.neither.length, ' 应 =', markPresent);
console.log();
console.log('=== UI 渲染判据（raw substring in wrong）===');
for (const [k, arr] of Object.entries(cat)) {
  const bad = arr.filter(r => !r.rawInWrong);
  console.log(`${k.padEnd(12)} 共 ${String(arr.length).padStart(4)}  其中 raw-includes(wrong) 为假: ${bad.length}`);
}
