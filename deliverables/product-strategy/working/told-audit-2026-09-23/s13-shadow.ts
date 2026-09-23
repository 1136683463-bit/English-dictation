import { grammarLessons } from "../../../../src/data/grammarLessons";
const noDialogue = grammarLessons.filter(l => !l.dialogue);
console.log(`有 dialogue 数组的课: ${204 - noDialogue.length} / 204`);
console.log(`无 dialogue（回退 dialogueEn 单句）: ${noDialogue.length} 课 -> ${noDialogue.map(l=>`L${l.number}`).join(",")}`);
console.log(`\nL41 是否同时有 dialogueEn 与 dialogue: dialogue.length=${grammarLessons.find(l=>l.number===41)!.dialogue!.length}`);
console.log(`dialogueEn 与 dialogue[0].en 相同的课数: ` + grammarLessons.filter(l => l.dialogue?.[0] && l.dialogueEn === l.dialogue[0].en).length);
console.log(`dialogueEn 与 dialogue[0].en 不同的课: ` + grammarLessons.filter(l => l.dialogue?.[0] && l.dialogueEn !== l.dialogue[0].en).map(l=>`L${l.number}`).join(","));
