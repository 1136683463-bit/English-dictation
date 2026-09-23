import { grammarLessons } from "../../../../src/data/grammarLessons";
const W = (f: string, t?: string) => !!t && new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i").test(t);
// 判据：原形是否当过某课主角 = 某课 targetSentence 含该原形
function mainChars(form: string) {
  return grammarLessons.filter(l => W(form, l.targetSentence)).map(l => `L${l.number}(${l.grammarLabel})`);
}
// 「昨天版」立课系列（L197-L204）+ 更早的
const pairs: [string, string][] = [
  ["think", "thought"], ["swim", "swam"], ["sing", "sang"], ["sit", "sat"], ["catch", "caught"],
  ["feel", "felt"], ["keep", "kept"], ["sleep", "slept"], ["draw", "drew"], ["wear", "wore"],
  ["give", "gave"], ["lose", "lost"], ["break", "broke"], ["go", "went"], ["eat", "ate"],
  ["do", "did"], ["be", "was"], ["have", "had"], ["read", "read"], ["say", "said"],
  ["tell", "told"], ["see", "saw"], ["make", "made"], ["take", "took"], ["come", "came"],
  ["get", "got"], ["know", "knew"], ["run", "ran"], ["write", "wrote"], ["buy", "bought"],
  ["find", "found"], ["leave", "left"], ["put", "put"], ["ring", "rang"], ["drink", "drank"],
  ["win", "won"], ["fly", "flew"], ["speak", "spoke"], ["hear", "heard"], ["stand", "stood"],
  ["understand", "understood"], ["meet", "met"], ["pay", "paid"], ["ride", "rode"], ["fall", "fell"],
];
console.log("=== 判据实测：原形是否当过某课 targetSentence 主角 ===");
console.log("原形".padEnd(14) + "过去式".padEnd(12) + "原形当主角的课".padEnd(40) + "过去式当主角的课");
for (const [b, p] of pairs) {
  const mb = mainChars(b), mp = mainChars(p);
  console.log(b.padEnd(14) + p.padEnd(12) + (mb.length ? mb.join(",") : "❌ 从未").padEnd(40) + (mp.length ? mp.join(",") : "❌ 从未"));
}
