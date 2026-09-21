// @vitest-environment jsdom
/**
 * BO8 · 项目红线（清单项 1/3/8 的横切核验）
 *
 * 来源：src/data/grammarZeroTerms.ts（共享词表，运行时与守门测试同表）+ PRD Non-goals。
 * - 零术语：用户可见文案不得出现语法书术语（主语/复数/时态/三单/原形/可数/疑问句/否定句/语序/比较级/最高级/从句…）；
 * - Affective Filter：不得出现「正确/错误/做错/答错」等挫败话术；
 * - 绝不允许限时 / 倒计时 / 排名 / 体力值（「约 2 分钟」是时长预告，允许）。
 *
 * 扫描范围＝**UI 实际渲染出的全部文本**（三档 × 全部题型的题面/选项/反馈/完成态），
 * 而不是源码字符串——只有渲染出来才算「用户可见」。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarBoostPage from "../../pages/GrammarBoostPage";
import { buildBoostItems, type BoostItem } from "../../services/grammarBoostService";
import { grammarLessons } from "../../data/grammarLessons";
import { GRAMMAR_ZERO_TERMS } from "../../data/grammarZeroTerms";
import { DONE_LESSON_ID, seedAppData } from "./fixtures";
import { answerBoostItem, clickElement, flushAsync } from "./drive";
import type { Mounted } from "../harness";

const seedLesson = (patch: Record<string, unknown> = {}) =>
  seedAppData({
    grammarLessonsDone: [DONE_LESSON_ID],
    grammarLessonStagesDone: { [DONE_LESSON_ID]: [1] },
    ...patch
  });

const mountBoost = (search = "") =>
  mountPage(<GrammarBoostPage />, `/grammar/boost/${DONE_LESSON_ID}${search}`, "/grammar/boost/:lessonId");

/** Affective Filter 词表：挫败话术与压力机制。 */
const AFFECTIVE_BANNED = [
  "做错", "答错", "错误", "不正确", "答对率", "正确率", "错题",
  "倒计时", "剩余时间", "限时", "还差几秒", "排名", "排行榜", "体力", "生命值",
  "打卡", "连续 N 天", "别放弃", "加油"
];

/** 判题瞬间会出现的词（这些是允许的动作词，不是挫败话术）。 */
const ALLOWED_WORDS = ["对了", "再试一次", "看答案"];

const scan = (text: string): { terms: string[]; affective: string[] } => ({
  terms: GRAMMAR_ZERO_TERMS.filter((term) => text.includes(term)),
  affective: AFFECTIVE_BANNED.filter((phrase) => text.includes(phrase))
});

/** 造一次错误作答。 */
const failOnce = (page: Mounted, item: BoostItem) => {
  const clickFirst = (selector: string, exclude: string[]) => {
    const buttons = Array.from(page.container.querySelectorAll(selector)) as HTMLButtonElement[];
    const target = buttons.find((button) => !button.disabled && !exclude.includes((button.textContent ?? "").trim()));
    if (!target) return false;
    clickElement(target);
    return true;
  };
  const confirm = () =>
    clickElement(
      Array.from(page.container.querySelectorAll("button")).find((b) => (b.textContent ?? "").trim() === "确认") as Element
    );
  switch (item.kind) {
    case "contrast":
      clickFirst(".boost-choice", [item.contrast?.isWrong ? "没问题" : "有点问题"]);
      confirm();
      return;
    case "bothright":
      clickFirst(".boost-choice", ["两句都对"]);
      return;
    case "listen":
      clickFirst(".boost-listen-option", [item.listenText ?? ""]);
      return;
    case "spot": {
      const accepted = item.spotWrongIndexes?.length ? item.spotWrongIndexes : [item.spotWrongIndex ?? -1];
      const wrongIndex = (item.spotTokens ?? []).findIndex((_token, index) => !accepted.includes(index));
      const chips = Array.from(page.container.querySelectorAll(".lesson-spot-row button")) as HTMLButtonElement[];
      if (wrongIndex >= 0 && chips[wrongIndex]) clickElement(chips[wrongIndex]);
      return;
    }
    case "cloze":
      clickFirst(".boost-choice", [item.clozeAnswer ?? ""]);
      confirm();
      return;
    case "choose":
    case "replace":
      clickFirst(".boost-choice", [item.answer]);
      return;
    case "rebuild":
    case "arrange": {
      const words = item.answer.split(/\s+/).filter(Boolean);
      const bank = Array.from(page.container.querySelectorAll(".lesson-spot-row button")) as HTMLButtonElement[];
      for (let step = 0; step < words.length; step += 1) {
        const chip = [...bank].reverse().find((button) => !button.disabled);
        if (!chip) break;
        clickElement(chip);
      }
      return;
    }
    default: {
      const field = page.container.querySelector("input.large-textarea");
      if (!field) return;
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(field, "zzz qqq");
      field.dispatchEvent(new Event("input", { bubbles: true }));
      clickElement(
        Array.from(page.container.querySelectorAll("button")).find((b) => (b.textContent ?? "").trim() === "提交") as Element
      );
    }
  }
};

/** 扫描档 1 全流程渲染文本里的红线越线（含 replace/choose 答错文案）。 */
const scanTierOneForRedlines = (options: { skipWrongPhaseKinds?: string[] } = {}): string[] => {
  const offenders: string[] = [];
  for (const lesson of grammarLessons) {
    resetStorage();
    seedAppData({
      grammarLessonsDone: [lesson.id],
      grammarLessonStagesDone: { [lesson.id]: [1] }
    });
    const items = buildBoostItems(lesson.id, 1, {});
    const page = mountPage(<GrammarBoostPage />, `/grammar/boost/${lesson.id}?tier=1`, "/grammar/boost/:lessonId");
    const record = (phase: string, text: string) => {
      const { terms, affective } = scan(text);
      for (const term of terms) offenders.push(`${lesson.id} [${phase}] 零术语「${term}」`);
      for (const phrase of affective) offenders.push(`${lesson.id} [${phase}] 挫败话术「${phrase}」`);
    };
    record("进入态", page.text());
    for (const item of items) {
      failOnce(page, item);
      if (!(options.skipWrongPhaseKinds ?? []).includes(item.kind)) {
        record(`答错-${item.kind}`, page.text());
      }
      const retry = page.buttons().find((text) => text.includes("再试一次"));
      if (retry) page.clickMatch(/再试一次/);
      if (answerBoostItem(page, item) === "passed") record(`答对-${item.kind}`, page.text());
      const advance = page.buttons().find((text) => text === "下一题" || text === "完成这一档");
      if (advance) page.click(advance);
    }
    record("完成态", page.text());
    page.unmount();
  }
  return offenders;
};

describe("BO8-a 零术语 + Affective Filter：整课渲染文本扫描", () => {
  beforeEach(() => resetStorage());

  /**
   * 【已确认缺陷 · P2 零术语红线】档 1 的 replace/choose 题**答错**时，
   * 页面给出文案「还差一点——想想**主语**是谁，搭档要跟着变。」
   * （GrammarBoostPage.tsx:580 setFeedback），「主语」在 GRAMMAR_ZERO_TERMS 词表里。
   *
   * 影响面：192 课中 41 课会走到 replace/choose 题（实测），即 21% 的课在
   * 「变形/选择答错」这一刻把语法书术语直接推到用户脸上。
   * 本用例断言「零越线」，当前为 failing —— 改文案后应转绿。
   */
  it("BR-RED-1：档 1 答错文案不得含零术语（当前为已确认缺陷）", () => {
    const offenders = scanTierOneForRedlines();
    expect(offenders.slice(0, 10), `档 1 渲染文本越线：\n${offenders.slice(0, 10).join("\n")}`).toEqual([]);
  }, 300000);

  it("档 1 全库：**排除已知的 replace/choose 答错文案**后，其余渲染文本零越线", () => {
    // 已知缺陷见 BR-RED-1（replace/choose 答错文案含「主语」）。
    // 本用例证伪「还有别的越线」：把那一处的答错态排除后再全库扫。
    const offenders = scanTierOneForRedlines({ skipWrongPhaseKinds: ["replace", "choose"] });
    expect(offenders.slice(0, 10), offenders.slice(0, 10).join("\n")).toEqual([]);
  }, 300000);

  it("档 2 / 档 3 抽样：进入态与完成态文本零越线", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons.slice(0, 12)) {
      for (const tier of [2, 3] as const) {
        resetStorage();
        seedAppData({
          grammarLessonsDone: [lesson.id],
          grammarLessonStagesDone: { [lesson.id]: [1] },
          ...(tier === 3 ? { grammarBoostsDone: { [lesson.id]: [1, 2] } } : {})
        });
        const items = buildBoostItems(lesson.id, tier, {});
        const page = mountPage(
          <GrammarBoostPage />,
          `/grammar/boost/${lesson.id}?tier=${tier}`,
          "/grammar/boost/:lessonId"
        );
        const texts = [page.text()];
        for (const [index, item] of items.entries()) {
          if (answerBoostItem(page, item) === "passed") texts.push(page.text());
          if (index + 1 < items.length) page.click("下一题");
          else page.click("完成这一档");
        }
        texts.push(page.text());
        for (const text of texts) {
          const { terms, affective } = scan(text);
          for (const term of terms) offenders.push(`${lesson.id} 档${tier} 术语「${term}」`);
          for (const phrase of affective) offenders.push(`${lesson.id} 档${tier} 挫败话术「${phrase}」`);
        }
        page.unmount();
      }
    }
    expect(offenders.slice(0, 10)).toEqual([]);
  }, 120000);
});

describe("BO8-b 无倒计时 / 无计时器 / 无进度施压", () => {
  beforeEach(() => resetStorage());

  it("页面不含 setInterval 驱动的秒表文案；「约 N 分钟」只出现在档位预告", () => {
    seedLesson();
    const select = mountBoost();
    const selectText = select.text();
    // 时长预告允许（且必须存在，它是「只做一档就体面退出」的前提）
    expect(selectText).toContain("约 2 分钟");
    expect(selectText).toContain("约 4 分钟");
    // 预告之外不该有任何时间读数（如 "01:30"、"剩 30 秒"）
    expect(/\d{1,2}:\d{2}(:\d{2})?/.test(selectText), "出现计时器读数").toBe(false);
    expect(/剩[下余]?\s*\d+\s*秒/.test(selectText)).toBe(false);
    select.unmount();
  });

  it("进行态不含任何时间读数或倒计时（只显示「第 n / N 题」）", () => {
    seedLesson();
    const page = mountBoost("?tier=1");
    const text = page.text();
    expect(/\d{1,2}:\d{2}/.test(text), `进行态出现计时读数：${text.match(/\d{1,2}:\d{2}/g)}`).toBe(false);
    expect(page.has("第 1 / 4 题")).toBe(true);
    // 进度是「已做 / 总数」的正向表述，不是剩余
    expect(page.has("0 / 4 题")).toBe(true);
    expect(page.has("剩余")).toBe(false);
    page.unmount();
  });

  it("等待 1.5 秒后页面文本不变化（没有秒表在跑）", async () => {
    seedLesson();
    const page = mountBoost("?tier=1");
    const before = page.text();
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await flushAsync();
    expect(page.text()).toBe(before);
    page.unmount();
  });

  it("三档的题量与时长预告必须与 BOOST_TIER_META 一致（承诺不虚标）", () => {
    seedLesson();
    const page = mountBoost();
    // 档位卡上的数字来自同一常量，抽查一致性
    const cards = page.buttons().filter((text) => text.includes("约"));
    expect(cards.length).toBe(3);
    expect(cards.some((text) => text.includes("4 题") && text.includes("约 2 分钟"))).toBe(true);
    expect(cards.some((text) => text.includes("5 题") && text.includes("约 4 分钟"))).toBe(true);
    expect(cards.some((text) => text.includes("3 题") && text.includes("约 4 分钟"))).toBe(true);
    page.unmount();
  });
});

describe("BO8-c 答案与题面语义一致性", () => {
  beforeEach(() => resetStorage());

  /**
   * 【已确认缺陷 · P2 数据/文案】lesson-90-after 的 cloze 题面丢了一个逗号：
   * 题面是 "After I do my ___ I don't watch TV."（无逗号），
   * 而 answer 是 "After I do my homework, I don't watch TV."（有逗号）。
   *
   * 机制：buildCloze 用 `split(/\s+/)` 切词后按空格重新 join（grammarBoostService.ts:272），
   * 词内标点（homework, 的逗号）在切分时被当成词的一部分留在原处，
   * 但这里的逗号本就附在 `homework,` 上——素材是 `homework,`，而 cloze 答案词
   * 经 cleanWord 剥成了 `homework`，题面重建时逗号随词一起被吃掉。
   * 结果是「用户看到的完整句」与「反馈里给的标准句」不一致（差一个逗号）。
   * 全库仅此 1 处（192 课扫描），影响面小，但属于答案与题面语义不一致。
   * 本用例断言「题面回填 == answer」，当前为 failing —— 修复后应转绿。
   */
  it("BR-RED-2：cloze 题面回填后必须等于 answer（当前为已确认缺陷）", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      for (const item of buildBoostItems(lesson.id, 1, {})) {
        if (item.kind !== "cloze") continue;
        const filled = (item.clozeText ?? "").replace(/___([.?!]?)/, `${item.clozeAnswer}$1`);
        if (filled.replace(/\s+/g, " ").trim() !== item.answer.replace(/\s+/g, " ").trim()) {
          offenders.push(`${lesson.id}: 题面「${item.clozeText}」+「${item.clozeAnswer}」→「${filled}」≠ answer「${item.answer}」`);
        }
      }
    }
    expect(offenders, `cloze 题面与判分基准不一致：\n${offenders.join("\n")}`).toEqual([]);
  });

  it("cloze 题面回填后与 answer 的差异只在标点层（已知缺陷的严重度界定）", () => {
    const offenders: string[] = [];
    const stripPunct = (text: string) => text.replace(/[.,!?;:]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
    for (const lesson of grammarLessons) {
      for (const item of buildBoostItems(lesson.id, 1, {})) {
        if (item.kind !== "cloze") continue;
        const filled = (item.clozeText ?? "").replace(/___([.?!]?)/, `${item.clozeAnswer}$1`);
        // 去掉标点后必须完全相同——证明差异确实只是标点，不是词被吃掉
        if (stripPunct(filled) !== stripPunct(item.answer)) {
          offenders.push(`${lesson.id}: 去标点后仍不同「${filled}」≠「${item.answer}」`);
        }
      }
    }
    expect(offenders.slice(0, 5)).toEqual([]);
  });

  it("全库：listen 的 answer 必须出现在它自己的选项里（否则无法答对）", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      for (const item of buildBoostItems(lesson.id, 1, {})) {
        if (item.kind !== "listen") continue;
        if (!(item.listenOptions ?? []).includes(item.answer)) {
          offenders.push(`${lesson.id}: answer「${item.answer}」不在选项 ${JSON.stringify(item.listenOptions)}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("全库：spot 的错词下标必须落在词块范围内（点得到）", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      for (const item of buildBoostItems(lesson.id, 1, {})) {
        if (item.kind !== "spot") continue;
        const accepted = item.spotWrongIndexes?.length ? item.spotWrongIndexes : [item.spotWrongIndex ?? -1];
        const max = (item.spotTokens ?? []).length - 1;
        for (const index of accepted) {
          if (index < 0 || index > max) offenders.push(`${lesson.id}: 错词下标 ${index} 超出词块范围 0..${max}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("全库：arrange/rebuild 的 tokens 必须包含答案的每个词（否则拼不出正确句）", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      for (const tier of [2] as const) {
        for (const item of buildBoostItems(lesson.id, tier, {})) {
          if (item.kind !== "rebuild" && item.kind !== "arrange") continue;
          const bank = [...(item.tokens ?? [])];
          for (const word of item.answer.split(/\s+/).filter(Boolean)) {
            const index = bank.findIndex((token) => token.trim() === word.trim());
            if (index < 0) {
              offenders.push(`${lesson.id} ${item.kind}: 答案词「${word}」不在词块库 ${JSON.stringify(item.tokens)}`);
              break;
            }
            bank.splice(index, 1);
          }
        }
      }
    }
    expect(offenders.slice(0, 5)).toEqual([]);
  });

  it("全库：variant / fix 的样例句必须与答案不同（否则任务无意义）", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      for (const item of buildBoostItems(lesson.id, 3, {})) {
        if (item.kind !== "variant" && item.kind !== "fix") continue;
        if (!item.shapedFrom?.trim()) {
          offenders.push(`${lesson.id} ${item.kind}: 没有样例句`);
          continue;
        }
        if (item.shapedFrom.trim() === item.answer.trim()) {
          offenders.push(`${lesson.id} ${item.kind}: 样例句 == 答案`);
        }
      }
    }
    expect(offenders.slice(0, 5)).toEqual([]);
  });

  it("allowing 词表自检：ALLOWED_WORDS 不误伤（审题用）", () => {
    // 「对了」是正向确认，本项目有意保留（不是评判用户的错）
    expect(ALLOWED_WORDS).toContain("对了");
    expect(AFFECTIVE_BANNED).not.toContain("对了");
  });
});

describe("BO8-d 零术语：用户可见字段（含讲解）全库扫描", () => {
  beforeEach(() => resetStorage());

  it("三档全库：题面/选项/讲解/提示/样例句都不得含术语", () => {
    const offenders: string[] = [];
    const collect = (item: BoostItem): string[] => {
      const parts: string[] = [item.promptZh, item.intentZh, item.explainZh, item.answer, item.shapedLabel ?? "", item.shapedFrom ?? ""];
      if (item.clozeText) parts.push(item.clozeText);
      parts.push(...(item.clozeOptions ?? []));
      if (item.contrast) parts.push(item.contrast.sentence, item.contrast.correct, item.contrast.whyZh);
      if (item.correctPair) parts.push(item.correctPair.first, item.correctPair.second);
      parts.push(...(item.listenOptions ?? []));
      parts.push(...(item.spotTokens ?? []));
      parts.push(...(item.tokens ?? []));
      parts.push(...(item.options ?? []));
      parts.push(...(item.hints ?? []));
      if (item.spotCorrectionZh) parts.push(item.spotCorrectionZh);
      return parts.filter((part): part is string => typeof part === "string");
    };
    for (const lesson of grammarLessons) {
      for (const tier of [1, 2, 3] as const) {
        for (const item of buildBoostItems(lesson.id, tier, {})) {
          for (const text of collect(item)) {
            for (const term of GRAMMAR_ZERO_TERMS) {
              if (text.includes(term)) offenders.push(`${lesson.id} t${tier} ${item.kind}: 「${term}」in「${text}」`);
            }
          }
        }
      }
    }
    expect(offenders.slice(0, 10)).toEqual([]);
  }, 120000);

  it("页面骨架文案（页面内所有硬编码中文）不得含术语", () => {
    // 从源码抽出字面量做静态核对（渲染无法覆盖注释外的所有分支）
    const pageSources: string[] = [];
    for (const lesson of grammarLessons.slice(0, 3)) {
      resetStorage();
      seedAppData({
        grammarLessonsDone: [lesson.id],
        grammarLessonStagesDone: { [lesson.id]: [1] }
      });
      for (const tier of [1, 2, 3] as const) {
        const page = mountBoost(`?tier=${tier}`);
        pageSources.push(page.text());
        page.unmount();
      }
      const select = mountBoost();
      pageSources.push(select.text());
      select.unmount();
    }
    const offenders: string[] = [];
    for (const text of pageSources) {
      for (const term of GRAMMAR_ZERO_TERMS) {
        if (text.includes(term)) offenders.push(`术语「${term}」in「${text.slice(0, 120)}」`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
