import { describe, expect, it } from "vitest";
import { grammarLessons } from "../data/grammarLessons";
import { allLessonNewWords, lessonVocabulary, newWordsInLesson, ensureLessonVocabUnit } from "./lessonVocabService";
import { makeTestData } from "./testUtils";
import type { AppData } from "../types";

/**
 * 随课词桥守门（2026-09-23 批六十七）。
 *
 * ## 锁什么
 *
 *   ① **正确材料才进词表**：`contrast.wrong` 与 `spot` 题的 `answer`/`tokens`
 *      都是**刻意造的错误形式**，绝不能进词书（否则用户会背 `goodest`/`putted`）
 *   ② **累计口径正确**：一课的新词 = 该课词表 − 此前所有课累计
 *   ③ **词书幂等**：同一课重复调用不重复建书
 *   ④ **不建空词书**：新词为 0 的课（纯复习/收口）不产出一本空书
 *
 * ## ⚠️ 判据纪律（本模块实现时踩过的两个坑，写在这里防再踩）
 *
 * **坑 1：`spot` 题的 `answer` 是错词，不是正确答案。**
 * 全库 8 课因此把 `putted`/`thinked`/`catched`/`keeped`/`sleeped`/`drawed`/
 * `weared`/`gived` 混进词表。这与 `HuntError` 那条纪律同源：
 * **「答案」字段的语义要看题型，不能按名字猜。**
 *
 * **坑 2：`contrast.wrong` 也不能收**——它同样装的是刻意造错的句子。
 * 注意这与 D 层守门**刻意不同**：D 层守门的命题是「用户见没见过这个词」，
 * 错句也算见过材料；本模块的命题是「这个词值不值得背」，两者不能混用。
 *
 * ⚠️ 另有一条**不锁**：专有名词（`xiaomei` 等）仍在词表里。原因见服务文件头
 * 「已知限制」——机器分不出人名与普通词，正确解法是在课数据侧打标，
 * 不该在服务里猜。本闸不把它写成断言，避免把「临时行为」固化成契约。
 */
describe("随课词桥 · 词表口径", () => {
  it("① 错形不进词表：全库词表里没有刻意造的错误形式", () => {
    const all = allLessonNewWords();
    const everyWord = [...new Set([...all.values()].flat())];
    // 这些是课文对比卡/spot 题里**故意写错**的形式，出现即说明口径破了
    const KNOWN_WRONG_FORMS = [
      "haves", "goodest", "gooder", "goodly", "fastly", "tiredly", "warmly",
      "breaked", "buyed", "catched", "drawed", "eated", "feeled", "gived",
      "hoter", "keeped", "knowed", "putted", "singed", "sitted", "sleeped",
      "swimmed", "thinked", "weared", "beautifuller", "beautifulest"
    ];
    const leaked = everyWord.filter((word) => KNOWN_WRONG_FORMS.includes(word));
    expect(leaked, `以下错误形式混进了词表（用户会被要求背错词）：${leaked.join(", ")}`).toEqual([]);
  });

  it("② 词表非空且规模合理（防口径改坏导致全空）", () => {
    const everyWord = [...new Set([...allLessonNewWords().values()].flat())];
    // 下限防「过滤过头」把词表清空；上限防「什么都收」把错形又放进来
    expect(everyWord.length, "全库随课新词总数应在一个合理区间").toBeGreaterThan(500);
    expect(everyWord.length, "不应超过 1500（超过说明收进了大量非词）").toBeLessThan(1500);
  });

  it("③ 累计口径：第 1 课的新词 == 它的全部词表（此前无课）", () => {
    const first = [...grammarLessons].sort((a, b) => a.number - b.number)[0];
    const fresh = newWordsInLesson(first);
    const vocab = lessonVocabulary(first);
    expect(new Set(fresh)).toEqual(new Set(vocab));
  });

  it("④ 新词是「该课词表 − 此前累计」：逐课抽查（含跨课复用词）", () => {
    const sorted = [...grammarLessons].sort((a, b) => a.number - b.number);
    const all = allLessonNewWords();
    const prior = new Set<string>();
    const offenders: string[] = [];
    for (const lesson of sorted) {
      const fresh = all.get(lesson.id) ?? [];
      // 每一条新词都不得在「此前累计」里出现（否则不该算新）
      for (const word of fresh) {
        if (prior.has(word)) offenders.push(`${lesson.id} 的「${word}」此前已出现，不该算新词`);
      }
      // 每个词表成员要么是新的、要么此前出现过（不能既不在新词里也不在累计里）
      for (const word of lessonVocabulary(lesson)) {
        if (!fresh.includes(word) && !prior.has(word)) {
          offenders.push(`${lesson.id} 的「${word}」既不在新词里也不在累计里（口径漏词）`);
        }
      }
      for (const word of lessonVocabulary(lesson)) prior.add(word);
    }
    expect(offenders.slice(0, 8), `累计口径错误：\n${offenders.join("\n")}`).toEqual([]);
  });

  it("⑤ 词书幂等：同一课重复调用不重复建书", () => {
    const lesson = grammarLessons.find((item) => (newWordsInLesson(item).length ?? 0) > 0)!;
    expect(lesson, "应能找一门有新词的课").toBeTruthy();
    const base = makeTestData({}) as AppData;
    const first = ensureLessonVocabUnit(base, lesson);
    expect(first.created, "首次应创建").toBe(true);
    expect(first.unitId, "应返回 unitId").toBeTruthy();
    const second = ensureLessonVocabUnit(first.data, lesson);
    expect(second.created, "第二次不应重复创建").toBe(false);
    expect(second.unitId, "第二次应返回同一个 unitId").toBe(first.unitId);
    expect(second.data.units.length, "词书总数不应增长").toBe(first.data.units.length);
  });

  it("⑥ 不给「新词为 0」的课建空词书", () => {
    const all = allLessonNewWords();
    const empty = grammarLessons.find((lesson) => (all.get(lesson.id) ?? []).length === 0);
    expect(empty, "全库应有新词为 0 的课（纯复习/收口）").toBeTruthy();
    const result = ensureLessonVocabUnit(makeTestData({}) as AppData, empty!);
    expect(result.created, "不该为空词课建书").toBe(false);
    expect(result.unitId, "应返回 null").toBeNull();
    expect(result.data.units.length, "词书数不应变化").toBe(0);
  });

  it("⑦ 闸自检：判据能真的区分（合成的错形必须被①抓到）", () => {
    // 反例：把错形塞进词表，①的判据必须能识别
    const KNOWN_WRONG_FORMS = ["haves", "goodest", "putted"];
    const fakeVocab = ["hello", "goodest", "world"];
    const leaked = fakeVocab.filter((word) => KNOWN_WRONG_FORMS.includes(word));
    expect(leaked, "判据应能抓出合成错形").toEqual(["goodest"]);
    // 正例：干净词表不该被判出
    expect(["hello", "world"].filter((word) => KNOWN_WRONG_FORMS.includes(word))).toEqual([]);
  });
});
