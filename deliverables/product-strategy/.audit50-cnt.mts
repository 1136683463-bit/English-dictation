import { grammarLessons } from "../../src/data/grammarLessons";
import { huntCases } from "../../src/data/huntCases";
import { LESSON_GROUPS } from "../../src/data/grammarSeasons";
console.log("lessons", grammarLessons.length, "cases", huntCases.length, "seasons", LESSON_GROUPS.length);
console.log("last lesson", grammarLessons[grammarLessons.length-1].id, grammarLessons[grammarLessons.length-1].number);
console.log("last season", JSON.stringify(LESSON_GROUPS[LESSON_GROUPS.length-1]));
