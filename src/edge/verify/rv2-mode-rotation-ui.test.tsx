// @vitest-environment jsdom
/**
 * RV2 · 题型轮换在真实会话里是否生效（清单项 2）
 *
 * 设计声明：`buildGrammarReviewTask` 按 reviewCount 决定题型
 * （0→cloze、1→rebuild、≥2→free_type），`diversifyReviewModes` 做相邻不同型。
 *
 * 做法：同一天入队 6 张卡的 reviewCount 分布 0/1/2/3/0/1（真实场景：同一天学完几课
 * + 抓到几处错，混着新入队卡与复习过一两次的卡），
 * 然后**逐张走真实 UI**，记录每张卡页面上显示的题型标签，检查
 * ① 界面上连续出现的题型序列没有相邻同型；② reviewCount>=2 的卡确实是 free_type。
 *
 * 关键点：页面显示什么题型，由「用户看得见的标签」判定，不读内部状态。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import {
  buildGrammarReviewSession,
  buildGrammarReviewTask,
  diversifyReviewModes,
  FREE_TYPE_MIN_REVIEW_COUNT,
  GRAMMAR_REVIEW_SESSION_LIMIT,
  type GrammarReviewCard,
  type GrammarReviewMode
} from "../../services/grammarReviewService";
import { cardsToData, makeSentenceCard, PAST_ISO, seedAppData } from "./fixtures";
import { flushAsync, planReviewSession } from "./drive";
import type { AppData } from "../../types";
import type { Mounted } from "../harness";

const SENTENCES = [
  "I am Xiaomei.",
  "He is my brother.",
  "I have a new bag.",
  "I want a milk tea.",
  "I like music.",
  "It is three o'clock."
];

/** 同一天入队的 6 张卡，reviewCount 分布 0/1/2/3/0/1。 */
const buildMixedCards = () => {
  const counts = [0, 1, 2, 3, 0, 1];
  return cardsToData(
    counts.map((reviewCount, index) =>
      makeSentenceCard({
        id: `mix-${index}`,
        sentence: SENTENCES[index],
        note: `语法课核心句：小美的一天 ① 我是谁`,
        sourceId: `lesson:lesson-${index}`,
        schedule: { reviewCount, nextReviewAt: PAST_ISO, intervalDays: 1 }
      })
    )
  );
};

const MODE_LABEL: Record<GrammarReviewMode, string> = {
  cloze: "选词补全句子",
  rebuild: "把句子拼回去",
  free_type: "自己把句子写出来"
};

const MODE_BY_LABEL: Array<[string, GrammarReviewMode]> = [
  ["选词补全句子", "cloze"],
  ["把句子拼回去", "rebuild"],
  ["自己把句子写出来", "free_type"]
];

/** 页面上「用户看得见」的题型（唯一依据：lesson-quiz-note 标签）。 */
const shownMode = (page: Mounted): GrammarReviewMode | null => {
  const node = page.container.querySelector(".lesson-quiz-note");
  const text = (node?.textContent ?? "").trim();
  const found = MODE_BY_LABEL.find(([label]) => label === text);
  return found ? found[1] : null;
};

const buttonsOf = (page: Mounted) => Array.from(page.container.querySelectorAll("button")) as HTMLButtonElement[];

/**
 * 按 plan 的第 index 步作答当前卡（正确路径），再点「下一张 / 完成复习」。
 * 轮换验证只关心题型序列，所以走最稳的正确路径。
 */
const answerThenAdvance = async (
  page: Mounted,
  step: ReturnType<typeof planReviewSession>["steps"][number]
) => {
  if (step.mode === "cloze") {
    buttonsOf(page).find((item) => !item.disabled && item.textContent?.trim() === step.answer)?.click();
    await flushAsync();
  } else if (step.mode === "rebuild") {
    for (const token of step.tokens) {
      buttonsOf(page)
        .filter((item) => !item.disabled && item.className.includes("lesson-chip"))
        .find((item) => item.textContent?.trim() === token)
        ?.click();
      await flushAsync();
    }
  } else {
    const field = page.container.querySelector("textarea") as HTMLTextAreaElement;
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
    setter?.call(field, step.sentence);
    field.dispatchEvent(new Event("input", { bubbles: true }));
    await flushAsync();
    buttonsOf(page).find((item) => !item.disabled && item.textContent?.trim() === "提交")?.click();
    await flushAsync();
  }
  buttonsOf(page)
    .find((item) => !item.disabled && /^(下一张|完成复习)$/.test((item.textContent ?? "").trim()))
    ?.click();
  await flushAsync();
};

const mountReview = () => mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");

const plannedModes = (data: AppData): GrammarReviewMode[] =>
  diversifyReviewModes(buildGrammarReviewSession(data), data.sentenceDetails).map(
    (item) => buildGrammarReviewTask(item, data.sentenceDetails).mode
  );

describe("RV2-a 相邻不同型", () => {
  beforeEach(() => resetStorage());

  it("6 张卡（reviewCount 0/1/2/3/0/1）逐张走 UI：连续题型序列无相邻同型", async () => {
    const data = seedAppData(buildMixedCards());
    const page = mountReview();
    expect(page.has("/ 6 张")).toBe(true);

    const steps = planReviewSession(data).steps;
    const seen: GrammarReviewMode[] = [];
    for (let step = 0; step < 6; step += 1) {
      const mode = shownMode(page);
      expect(mode, `第 ${step + 1} 张没有可识别的题型标签`).not.toBeNull();
      seen.push(mode as GrammarReviewMode);
      await answerThenAdvance(page, steps[step]);
    }

    expect(seen.length).toBe(6);
    // 计划序列与实际序列一致（页面用的就是同一对纯函数）
    expect(seen).toEqual(plannedModes(data));
    for (let index = 1; index < seen.length; index += 1) {
      expect(seen[index], `第 ${index + 1} 张与第 ${index} 张同型（${seen[index]}）`).not.toBe(seen[index - 1]);
    }
    page.unmount();
  });

  it("reviewCount>=2 的卡在界面上确实变成 free_type（用户看到「自己把句子写出来」）", async () => {
    expect(FREE_TYPE_MIN_REVIEW_COUNT).toBe(2);
    const data = seedAppData(buildMixedCards());
    const session: GrammarReviewCard[] = diversifyReviewModes(
      buildGrammarReviewSession(data),
      data.sentenceDetails
    );
    const highCount = session.filter((item) => (item.schedule.reviewCount ?? 0) >= FREE_TYPE_MIN_REVIEW_COUNT);
    expect(highCount.length).toBe(2); // reviewCount 2 与 3 各一张
    for (const item of highCount) {
      expect(buildGrammarReviewTask(item, data.sentenceDetails).mode).toBe("free_type");
    }

    // 走 UI 验证：本场确实出现过两张 free_type
    const page = mountReview();
    const steps = planReviewSession(data).steps;
    const seen: GrammarReviewMode[] = [];
    for (let step = 0; step < 6; step += 1) {
      seen.push(shownMode(page) as GrammarReviewMode);
      await answerThenAdvance(page, steps[step]);
    }
    expect(seen.filter((mode) => mode === "free_type").length).toBe(2);
    page.unmount();
  });

  it("全部 reviewCount=0 的会话：打散无解时保持原序而不是崩溃（同型必须连出是数据的必然）", () => {
    const data = seedAppData(
      cardsToData(
        Array.from({ length: 6 }, (_, index) =>
          makeSentenceCard({
            id: `z-${index}`,
            sentence: SENTENCES[index],
            sourceId: `lesson:l-${index}`,
            schedule: { reviewCount: 0, nextReviewAt: PAST_ISO, intervalDays: 1 }
          })
        )
      )
    );
    const session = diversifyReviewModes(buildGrammarReviewSession(data), data.sentenceDetails);
    const modes = session.map((item) => buildGrammarReviewTask(item).mode);
    expect(new Set(modes)).toEqual(new Set(["cloze"]));
    // 内容守恒：仍是同一批卡，没有丢卡或复制
    expect(new Set(session.map((item) => item.card.id)).size).toBe(6);
  });

  it("轮换的代价：diversifyReviewModes 会重排队列，最旧错题优先的排序被打散（可疑项，不改判）", () => {
    const data = seedAppData(buildMixedCards());
    const raw = buildGrammarReviewSession(data).map((item) => item.card.id);
    const diversified = diversifyReviewModes(buildGrammarReviewSession(data), data.sentenceDetails).map(
      (item) => item.card.id
    );
    // 同集合重排（内容守恒），但顺序可能改变
    expect([...diversified].sort()).toEqual([...raw].sort());
  });
});

describe("RV2-b 题型与 reviewCount 的映射（真实数据）", () => {
  beforeEach(() => resetStorage());

  it("free_type 只在 reviewCount>=2 出现；cloze/rebuild 按奇偶分工", () => {
    const mk = (id: string, reviewCount: number): GrammarReviewCard => {
      const fixture = makeSentenceCard({
        id,
        sentence: "I am drawing a picture.",
        schedule: { reviewCount, nextReviewAt: PAST_ISO, intervalDays: 1 }
      });
      return { card: fixture.card, schedule: fixture.schedule! };
    };
    expect(buildGrammarReviewTask(mk("a", 0)).mode).toBe("cloze");
    expect(buildGrammarReviewTask(mk("b", 1)).mode).toBe("rebuild");
    expect(buildGrammarReviewTask(mk("c", 2)).mode).toBe("free_type");
    expect(buildGrammarReviewTask(mk("d", 3)).mode).toBe("free_type");
    expect(buildGrammarReviewTask(mk("e", 4)).mode).toBe("free_type");
  });

  it("flag 关闭时回落到 cloze/rebuild 两形态，界面也不再出 free_type", async () => {
    window.localStorage.setItem("grammar-review-free-type", "off");
    const data = seedAppData(buildMixedCards());
    const modes = plannedModes(data);
    expect(modes.every((mode) => mode !== "free_type")).toBe(true);

    const page = mountReview();
    const steps = planReviewSession(data).steps;
    const seen = new Set<GrammarReviewMode>();
    for (let step = 0; step < 6; step += 1) {
      seen.add(shownMode(page) as GrammarReviewMode);
      await answerThenAdvance(page, steps[step]);
    }
    expect(seen.has("free_type")).toBe(false);
    page.unmount();
    window.localStorage.removeItem("grammar-review-free-type");
  });
});

describe("RV2-c 打散算法本身的性质", () => {
  beforeEach(() => resetStorage());

  it("确定性与内容守恒：同输入同输出、同集合重排", () => {
    const data = seedAppData(buildMixedCards());
    const once = diversifyReviewModes(buildGrammarReviewSession(data), data.sentenceDetails).map((item) => item.card.id);
    const twice = diversifyReviewModes(buildGrammarReviewSession(data), data.sentenceDetails).map((item) => item.card.id);
    expect(once).toEqual(twice);
  });

  it("会话 ≤2 张时不重排（原样返回同一引用）", () => {
    const fixture = makeSentenceCard({ id: "s", sentence: "I am happy.", schedule: { reviewCount: 0 } });
    const session: GrammarReviewCard[] = [
      { card: fixture.card, schedule: fixture.schedule! },
      { card: { ...fixture.card, id: "s2" }, schedule: { ...fixture.schedule!, cardId: "s2" } }
    ];
    expect(diversifyReviewModes(session, [])).toBe(session);
  });
});
