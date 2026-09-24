// @vitest-environment node
/**
 * EX5 · 中断续做（P0，M2 一票否决门）
 *
 * 规格：PRD §4.7 ｜ §12.1 G2/G3/G-A1 ｜ §13 M2「中断续做三处断点任一失败 → 不允许发布」
 *
 * 本文件是**发布门**，不是体验用例。证据链：
 *   瑞思风险 2「30 分钟不可中断、无续做」与风险 1「移动端外壳失灵」**叠加时才致命**——
 *   一个既看不清又走不掉的 30 分钟。产品负责人的原话顾虑也是「没耐心继续做」。
 *
 * 关键手法：每次「断点」都走一遍 **JSON 往返 + migrateData**（等价于关闭应用后重开：
 * 数据经过 localStorage 序列化与白名单归一化两道），而不是在内存里传对象。
 * 只有这样才能真的证明「关掉再打开还在」。
 */
import { describe, expect, it } from "vitest";
import { APP_SCHEMA_VERSION, migrateData } from "../../services/storage";
import { buildExamPaper } from "../../services/grammarExamPaperService";
import {
  examDiagnosis,
  getExamSession,
  isSectionComplete,
  nextUnanswered,
  recordExamItem,
  recordExamWriting,
  revealExamSection,
  startExamSession,
  submitExamSession,
  itemsOfSection,
  queueExamMistakes,
  reviewableSentenceOf
} from "../../services/grammarExamSessionService";
import type { AppData } from "../../types";

const paper = buildExamPaper({ seasonId: "season-1", variantIndex: 0, variantCount: 5 });

const emptyData = (): AppData =>
  migrateData({
    schemaVersion: APP_SCHEMA_VERSION,
    grammarLessonsDone: [],
    seededWordVersions: ["core-100-v1"]
  });

/** 模拟「关掉应用再打开」：序列化 → 反序列化 → 过一遍 migrateData 白名单。 */
const reload = (data: AppData): AppData => migrateData(JSON.parse(JSON.stringify(data)));

/** 答完某节的第 n 题（从 0 起）。 */
const answerThrough = (data: AppData, section: 1 | 2 | 3, upToIndex: number): AppData => {
  let next = data;
  const items = itemsOfSection(paper, section);
  for (let index = 0; index <= upToIndex && index < items.length; index += 1) {
    next = recordExamItem(next, paper, items[index], {
      answer: items[index].answer,
      passed: true,
      score: 100,
      durationMs: 5000
    });
  }
  return revealExamSection(next, paper.paperId, section);
};

describe("EX5 中断续做：三处断点（P0 发布门）", () => {
  it("断点① 节 1 第 3 题：关闭应用后重进，落在同一节同一题号，已答原样保留", () => {
    let data = startExamSession(emptyData(), paper);
    data = answerThrough(data, 1, 2); // 答完节 1 的前 3 题（index 0,1,2）

    const reopened = reload(data);
    const session = getExamSession(reopened, paper.paperId);
    expect(session, "会话在重载后丢失").toBeTruthy();
    expect(session!.results.length, "已答的 3 题应全部保留").toBe(3);
    expect(session!.results.map((r) => r.itemId)).toEqual(
      itemsOfSection(paper, 1).slice(0, 3).map((item) => item.id)
    );
    // 逐节揭晓的状态也要活下来
    expect(session!.revealedSections).toContain(1);
    // 光标应指向节 1 第 4 题（index 3）
    expect(session!.cursor.section).toBe(1);
    expect(session!.cursor.index).toBe(3);
    expect(session!.cursor, "断点①复现位置").toEqual(nextUnanswered(paper, session!, { section: 1, index: 0 }));
  });

  it("断点② 节 2 第 3 题：跨节续做正确（节 1 已揭晓、光标在节 2）", () => {
    let data = startExamSession(emptyData(), paper);
    data = answerThrough(data, 1, itemsOfSection(paper, 1).length - 1); // 节 1 全答完
    data = answerThrough(data, 2, 2); // 节 2 答到第 3 题

    const reopened = reload(data);
    const session = getExamSession(reopened, paper.paperId)!;
    expect(session.cursor.section, "应落在第 2 节").toBe(2);
    expect(session.cursor.index, "应落在节 2 第 4 题").toBe(3);
    expect(isSectionComplete(paper, session, 1), "第 1 节已完成").toBe(true);
    expect(session.revealedSections).toEqual([1, 2]);
    expect(session.results.length).toBe(itemsOfSection(paper, 1).length + 3);
  });

  it("断点③ 节 3 提交前：写作原文已保存，重进后仍在（含 AI 未回的情况）", () => {
    let data = startExamSession(emptyData(), paper);
    data = answerThrough(data, 1, itemsOfSection(paper, 1).length - 1);
    data = answerThrough(data, 2, itemsOfSection(paper, 2).length - 1);
    // 写作写了一部分但没提交（AI 还没批）
    data = recordExamWriting(data, paper.paperId, { text: "Sunday was sunny. I went to the park." });

    const reopened = reload(data);
    const session = getExamSession(reopened, paper.paperId)!;
    expect(session.writing?.text, "写作原文在重载后丢失").toBe("Sunday was sunny. I went to the park.");
    expect(session.submittedAt, "未提交就不该有 submittedAt").toBeUndefined();
    expect(session.cursor.section).toBe(3);
  });

  it("重复作答同一题：覆盖而不是追加（否则「稳住 N 件」会被重复计数）", () => {
    let data = startExamSession(emptyData(), paper);
    const first = itemsOfSection(paper, 1)[0];
    data = recordExamItem(data, paper, first, { answer: first.answer, passed: true, score: 100, durationMs: 1000 });
    data = recordExamItem(data, paper, first, { answer: "wrong", passed: false, score: 0, durationMs: 2000 });
    const session = getExamSession(data, paper.paperId)!;
    expect(session.results.filter((r) => r.itemId === first.id).length, "同一题出现多条记录").toBe(1);
    expect(session.results[0].passed, "应取最后一次作答").toBe(false);
  });

  it("startExamSession 幂等：重复进入绝不重置进度", () => {
    let data = startExamSession(emptyData(), paper);
    data = answerThrough(data, 1, 4);
    const before = getExamSession(data, paper.paperId)!;
    const again = startExamSession(data, paper);
    const after = getExamSession(again, paper.paperId)!;
    expect(after.results.length).toBe(before.results.length);
    expect(after.cursor).toEqual(before.cursor);
    expect(after.startedAt, "开始时间不得被重置").toBe(before.startedAt);
  });

  it("交卷后可读诊断：稳住 N 件事 / 还漏 M 处，且按 grammarLabel 归并", () => {
    let data = startExamSession(emptyData(), paper);
    // 节 1 全对、节 2 全错
    for (const item of itemsOfSection(paper, 1)) {
      data = recordExamItem(data, paper, item, { answer: item.answer, passed: true, score: 100, durationMs: 3000 });
    }
    for (const item of itemsOfSection(paper, 2)) {
      data = recordExamItem(data, paper, item, { answer: "错的", passed: false, score: 10, durationMs: 3000 });
    }
    data = submitExamSession(data, paper.paperId);
    const session = getExamSession(data, paper.paperId)!;
    expect(session.submittedAt, "交卷时间应写入").toBeTruthy();
    const diagnosis = examDiagnosis(paper, session);
    expect(diagnosis.stabilizedCount).toBeGreaterThan(0);
    expect(diagnosis.missingCount).toBeGreaterThan(0);
    // 同一 label 既在稳住又在还漏时，只算稳住（不两头都报）
    const overlap = diagnosis.stabilizedLabels.filter((label) => diagnosis.missingLabels.includes(label));
    expect(overlap, "同一 label 不得同时出现在稳住与还漏").toEqual([]);
    // 还漏的条目必须可溯源到课（G6）
    for (const entry of diagnosis.missingItems) {
      expect(entry.sourceLessonId, `还漏条目缺出处：${entry.itemId}`).toBeTruthy();
      expect(entry.sourceLessonNumber).toBeGreaterThan(0);
    }
  });

  it("题源漂移的容忍：卷面变化后光标被夹在合法范围内（不越界、不崩）", () => {
    let data = startExamSession(emptyData(), paper);
    data = answerThrough(data, 1, 2);
    const session = getExamSession(data, paper.paperId)!;
    // 人为把光标推到远超卷面的位置，再问「下一个未答」——必须回落而不是越界
    const drifted = { ...session, cursor: { section: 3 as const, index: 999 } };
    const next = nextUnanswered(paper, drifted, { section: 3, index: 999 });
    expect(next.section).toBe(3);
    expect(next.index).toBeLessThan(itemsOfSection(paper, 3).length);
    expect(next.index).toBeGreaterThanOrEqual(0);
  });
});

describe("EX5 错题回流（P1-2）：只回流整句、只回流错题、幂等", () => {
  it("错题还原成整句并入队；已稳住的与阅读/写作不回流", () => {
    let data = startExamSession(emptyData(), paper);
    const section1 = itemsOfSection(paper, 1);
    // 第 1 题答对（不该回流），其余节 1 全错
    section1.forEach((item, index) => {
      data = recordExamItem(data, paper, item, {
        answer: index === 0 ? item.answer : "错的",
        passed: index === 0,
        score: index === 0 ? 100 : 0,
        durationMs: 1000
      });
    });
    for (const item of itemsOfSection(paper, 2)) {
      data = recordExamItem(data, paper, item, { answer: "x", passed: false, score: 0, durationMs: 1000 });
    }
    const session = getExamSession(data, paper.paperId)!;
    const queued = queueExamMistakes(data, paper, session);

    const cards = queued.cards.filter((card) => card.type === "sentence" && card.tags?.includes("语法"));
    expect(cards.length, "应有错题句被入队").toBeGreaterThan(0);
    for (const card of cards) {
      const words = card.front.trim().split(/\s+/).filter(Boolean);
      expect(words.length, `回流必须是整句（队列是句子级）：${card.front}`).toBeGreaterThanOrEqual(3);
    }
    // 已稳住的那题不得入队
    const passedItem = section1[0];
    if (reviewableSentenceOf(passedItem)) {
      const sentence = reviewableSentenceOf(passedItem);
      expect(cards.some((card) => card.front.trim() === sentence), "已稳住的句子不该进队列").toBe(false);
    }
    // 阅读/写作不回流（判定不了、也不该判）
    for (const item of itemsOfSection(paper, 2).filter((i) => i.kind === "read")) {
      expect(reviewableSentenceOf(item), `阅读题不该有可回流句：${item.id}`).toBe("");
    }
    expect(reviewableSentenceOf(paper.items.find((i) => i.kind === "write")!), "写作题不该有可回流句").toBe("");
  });

  it("幂等：重复入队不产生重复卡（交卷可被重复触发）", () => {
    let data = startExamSession(emptyData(), paper);
    for (const item of itemsOfSection(paper, 1)) {
      data = recordExamItem(data, paper, item, { answer: "错的", passed: false, score: 0, durationMs: 1000 });
    }
    const session = getExamSession(data, paper.paperId)!;
    const once = queueExamMistakes(data, paper, session);
    const twice = queueExamMistakes(once, paper, getExamSession(once, paper.paperId));
    const count = (d: AppData) => d.cards.filter((c) => c.type === "sentence" && c.tags?.includes("语法")).length;
    expect(count(twice), "重复入队不应增加句子卡").toBe(count(once));
    expect(count(once), "第一次应确实入队了").toBeGreaterThan(0);
  });

  it("还原规则：cloze/choose 用题面把空位换回答案；答案非句子且无空位则跳过", () => {
    const cloze = itemsOfSection(paper, 1).find((i) => i.kind === "cloze")!;
    const restored = reviewableSentenceOf(cloze);
    expect(restored, "填空题应能还原出整句").not.toBe("");
    expect(restored.includes("____"), "还原后不该还留着空位").toBe(false);
    expect(restored.split(/\s+/).length, "还原的是整句").toBeGreaterThanOrEqual(3);
  });

  it("【真机走查抓出的回归】空位两侧必须有空格：否则回流会被静默丢弃", () => {
    /**
     * 真机走查发现：选择题题面曾被拼成 `I want____apple.`（before 不以空格结尾）。
     * 后果不只是难看——回流把 `____` 换回答案会得到 `I wantanapple.`，
     * 被「整句 ≥3 词」守门判掉，于是**选择题的错题一条都进不了复习队列**。
     * 这条守住：凡是带空位的题面，空位前后都得是空格。
     */
    const withBlank = paper.items.filter((item) => (item.promptZh ?? "").includes("____"));
    expect(withBlank.length, "卷面应有带空位的题").toBeGreaterThan(0);
    // 判据：空位**前面**必须是空格或中文冒号（可选空格）；**后面**必须是空格或句尾。
    // 注意不能要求「后面一定有空格」——空位落在句尾时（`… I ____`）后面本来就没有。
    const wellSpaced = /(^|[：\s])____(\s|$)/;
    const offenders = withBlank
      .filter((item) => !wellSpaced.test(`：${item.promptZh}`.replace(/^[^：]*：/, "：")))
      .map((item) => `${item.id}: ${item.promptZh}`);
    expect(offenders, `空位两侧缺空格：\n${offenders.join("\n")}`).toEqual([]);
  });

  it("带空位的题都能还原出整句（回流的前提）", () => {
    const restored = paper.items
      .filter((item) => (item.promptZh ?? "").includes("____"))
      .map((item) => ({ id: item.id, kind: item.kind, sentence: reviewableSentenceOf(item) }));
    const failed = restored.filter((entry) => entry.sentence.trim().split(/\s+/).length < 3);
    expect(failed.slice(0, 5).map((e) => `${e.id}(${e.kind}) → 「${e.sentence}」`), "这些带空位的题还原不出整句").toEqual([]);
  });
});
