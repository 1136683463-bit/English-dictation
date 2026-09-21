// @vitest-environment jsdom
/**
 * RV1 · 三种题型的完整作答链路（真实 UI 驱动）
 *
 * 清单项 1：cloze（选词）/ rebuild（拼词块）/ free_type（自由输出）
 * 各自「答对」「答错再答对」「看答案」三条路径——判分、评分（1/2/3/4）、
 * 卡片 schedule（intervalDays / easeFactor / lapseCount / nextReviewAt）是否与用户行为相符。
 *
 * 走的是真实写入路径：mountPage → 点击/输入 → AppContext.updateData → localStorage。
 * 断言从 localStorage 读回，不看页面内部状态。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarReviewPage from "../../pages/GrammarReviewPage";
import { judgeGrammarCloze, judgeGrammarFreeType } from "../../services/grammarReviewService";
import { cardsToData, makeSentenceCard, PAST_ISO, readAppData, seedAppData } from "./fixtures";
import { flushAsync, planReviewSession, setInputValue } from "./drive";
import type { Mounted } from "../harness";
import type { GrammarReviewMode } from "../../services/grammarReviewService";

const DUE = { nextReviewAt: PAST_ISO, intervalDays: 1 };

/** 造一张指定 reviewCount 的到期语法卡（reviewCount 决定题型）。 */
const seedOne = (reviewCount: number, sentence = "I am drawing a picture.", note = "语法课核心句：小美的一天 ① 我是谁") => {
  const data = seedAppData(
    cardsToData([
      makeSentenceCard({
        id: "rv1-card",
        sentence,
        note,
        schedule: { ...DUE, reviewCount }
      })
    ])
  );
  return data;
};

const mountReview = () => mountPage(<GrammarReviewPage />, "/grammar/review", "/grammar/review");

const elementButtons = (page: Mounted, selector = "button"): HTMLButtonElement[] =>
  Array.from(page.container.querySelectorAll(selector)) as HTMLButtonElement[];

const enabledButtons = (page: Mounted, selector = "button") =>
  elementButtons(page, selector).filter((button) => !button.disabled);

const clickOne = async (button: HTMLButtonElement) => {
  button.click();
  await flushAsync();
};

const modeLabel: Record<GrammarReviewMode, string> = {
  cloze: "选词补全句子",
  rebuild: "把句子拼回去",
  free_type: "自己把句子写出来"
};

/** 当前题面显示的题型（页面自带标签，作为「用户看到的题型」的唯一依据）。 */
const shownMode = (page: Mounted): GrammarReviewMode | null =>
  (Object.keys(modeLabel) as GrammarReviewMode[]).find((mode) => page.has(modeLabel[mode])) ?? null;

/** 按 plan 推出的答案作答一次（正确路径）。 */
const answerCorrect = async (page: Mounted, step: ReturnType<typeof planReviewSession>["steps"][number]) => {
  if (step.mode === "cloze") {
    const button = enabledButtons(page).find((item) => item.textContent?.trim() === step.answer);
    expect(button, `没找到 cloze 选项「${step.answer}」`).toBeTruthy();
    await clickOne(button as HTMLButtonElement);
    return;
  }
  if (step.mode === "rebuild") {
    for (const token of step.tokens) {
      const chip = enabledButtons(page, ".lesson-bank button").find((item) => item.textContent?.trim() === token);
      expect(chip, `没找到词块「${token}」`).toBeTruthy();
      await clickOne(chip as HTMLButtonElement);
    }
    return;
  }
  const field = page.container.querySelector("textarea") as HTMLTextAreaElement;
  expect(field).toBeTruthy();
  await setInputValueAsync(field, step.sentence);
  const submit = enabledButtons(page).find((item) => item.textContent?.trim() === "提交");
  expect(submit).toBeTruthy();
  await clickOne(submit as HTMLButtonElement);
};

const setInputValueAsync = async (field: HTMLTextAreaElement, value: string) => {
  setInputValue(field, value);
  await flushAsync();
};

/** 故意作答一次错误（各题型都走真实交互）。 */
const answerWrong = async (page: Mounted, step: ReturnType<typeof planReviewSession>["steps"][number]) => {
  if (step.mode === "cloze") {
    const wrong = enabledButtons(page).find((item) => (item.textContent ?? "").trim() !== step.answer);
    expect(wrong, "cloze 没有可点的干扰项").toBeTruthy();
    await clickOne(wrong as HTMLButtonElement);
    return;
  }
  if (step.mode === "rebuild") {
    // 按打乱后的顺序点回去 = 错误词序（rebuild 的词块库顺序就是错的）
    const chips = elementButtons(page, ".lesson-bank button");
    for (const chip of chips) {
      const fresh = elementButtons(page, ".lesson-bank button").find(
        (item) => item.textContent?.trim() === chip.textContent?.trim() && !item.disabled
      );
      if (!fresh) break;
      await clickOne(fresh);
    }
    return;
  }
  const field = page.container.querySelector("textarea") as HTMLTextAreaElement;
  await setInputValueAsync(field, "completely wrong answer");
  const submit = enabledButtons(page).find((item) => item.textContent?.trim() === "提交");
  await clickOne(submit as HTMLButtonElement);
};

const latestSchedule = (cardId: string) => readAppData().schedules.find((item) => item.cardId === cardId)!;
const reviewsOf = (cardId: string) => readAppData().reviews.filter((item) => item.cardId === cardId);
const cardOf = (cardId: string) => readAppData().cards.find((item) => item.id === cardId)!;

describe("RV1-a cloze（选词）", () => {
  beforeEach(() => resetStorage());

  it("一次选对 → rating 4、题型记为 cloze、间隔拉长、ease 上调、无 lapse", async () => {
    const data = seedOne(0);
    const plan = planReviewSession(data);
    expect(plan.steps[0].mode).toBe("cloze");
    const page = mountReview();
    expect(shownMode(page)).toBe("cloze");

    await answerCorrect(page, plan.steps[0]);

    const [review] = reviewsOf("rv1-card");
    expect(review.mode).toBe("cloze"); // 选词是「认」不是「产」，与页面注释一致
    expect(review.rating).toBe(4);
    const schedule = latestSchedule("rv1-card");
    expect(schedule.reviewCount).toBe(1);
    expect(schedule.easeFactor).toBeCloseTo(2.62, 5);
    expect(schedule.intervalDays).toBe(3);
    expect(schedule.lapseCount).toBe(0);
    expect(new Date(schedule.nextReviewAt).getTime()).toBeGreaterThan(Date.now());
    expect(page.has("完成复习")).toBe(true); // 单卡会话：反馈区给的是「完成复习」
    page.unmount();
  });

  it("先选错再选对 → rating 3、题型仍记 cloze、间隔不放大（语法句子卡口径）、ease 不变", async () => {
    const data = seedOne(0);
    const plan = planReviewSession(data);
    const page = mountReview();

    await answerWrong(page, plan.steps[0]);
    // 选错不判负：页面给的是再试机会，不是挫败
    expect(page.has("看答案")).toBe(true);
    expect(reviewsOf("rv1-card").length).toBe(0); // 错选不落库
    await answerCorrect(page, plan.steps[0]);

    const [review] = reviewsOf("rv1-card");
    expect(review.rating).toBe(3);
    expect(review.mode).toBe("cloze");
    const schedule = latestSchedule("rv1-card");
    expect(schedule.reviewCount).toBe(1);
    expect(schedule.intervalDays).toBe(1); // R09 Step1：语法句子卡多次尝试不放大间隔
    expect(schedule.easeFactor).toBeCloseTo(2.5, 5);
    expect(schedule.lapseCount).toBe(0);
    page.unmount();
  });

  it("看答案 → rating 1、lapse +1、intervalDays 归零、10 分钟后再来", async () => {
    const data = seedOne(0);
    const plan = planReviewSession(data);
    const page = mountReview();

    await answerWrong(page, plan.steps[0]);
    const reveal = enabledButtons(page).find((item) => (item.textContent ?? "").includes("看答案"));
    expect(reveal).toBeTruthy();
    await clickOne(reveal as HTMLButtonElement);

    const [review] = reviewsOf("rv1-card");
    expect(review.rating).toBe(1);
    const schedule = latestSchedule("rv1-card");
    expect(schedule.lapseCount).toBe(1);
    expect(schedule.intervalDays).toBe(0);
    expect(schedule.easeFactor).toBeCloseTo(2.25, 5);
    const deltaMs = new Date(schedule.nextReviewAt).getTime() - Date.now();
    expect(deltaMs).toBeGreaterThan(9 * 60 * 1000);
    expect(deltaMs).toBeLessThan(11 * 60 * 1000);
    // 页面承诺「这张卡很快会再来见你」——但 intervalDays=0 会被 Due 过滤器排除（见 RV4-c）
    expect(page.has("这张卡很快会再来见你")).toBe(true);
    page.unmount();
  });
});

describe("RV1-b rebuild（拼词块）", () => {
  beforeEach(() => resetStorage());

  it("一次拼对 → rating 4、题型记 rebuild（不再冒充 recall）", async () => {
    const data = seedOne(1);
    const plan = planReviewSession(data);
    expect(plan.steps[0].mode).toBe("rebuild");
    const page = mountReview();
    expect(shownMode(page)).toBe("rebuild");

    await answerCorrect(page, plan.steps[0]);

    const [review] = reviewsOf("rv1-card");
    expect(review.mode).toBe("rebuild");
    expect(review.rating).toBe(4);
    // 种子卡 reviewCount 已是 1，答对后 +1
    expect(latestSchedule("rv1-card").reviewCount).toBe(2);
    expect(latestSchedule("rv1-card").intervalDays).toBe(3);
    page.unmount();
  });

  it("先拼错再拼对 → rating 3、只落一条记录（错拼不落库）", async () => {
    const data = seedOne(1);
    const plan = planReviewSession(data);
    const page = mountReview();

    await answerWrong(page, plan.steps[0]);
    expect(reviewsOf("rv1-card").length).toBe(0);
    // 拼错后想重试，必须把拼装区的词块一个个点掉（页面没有「重来 / 清空」按钮）。
    // 注意：点掉一个后其余词块会重挂载，必须每轮重新查询。
    for (let guard = 0; guard < 20; guard += 1) {
      const chip = elementButtons(page, ".lesson-chip.built").find((item) => !item.disabled);
      if (!chip) break;
      await clickOne(chip);
    }
    expect(elementButtons(page, ".lesson-chip.built").length).toBe(0);
    await answerCorrect(page, plan.steps[0]);

    const reviews = reviewsOf("rv1-card");
    expect(reviews.length).toBe(1);
    expect(reviews[0].rating).toBe(3);
    expect(latestSchedule("rv1-card").intervalDays).toBe(1);
    page.unmount();
  });

  it("看答案 → rating 1 + lapse，并在反馈里给出完整正确句", async () => {
    const data = seedOne(1);
    const plan = planReviewSession(data);
    const page = mountReview();

    await answerWrong(page, plan.steps[0]);
    const reveal = enabledButtons(page).find((item) => (item.textContent ?? "").includes("看答案"));
    await clickOne(reveal as HTMLButtonElement);

    expect(reviewsOf("rv1-card")[0].rating).toBe(1);
    expect(latestSchedule("rv1-card").lapseCount).toBe(1);
    expect(page.has("正确的说法是")).toBe(true);
    expect(page.has("I am drawing a picture.")).toBe(true);
    page.unmount();
  });
});

describe("RV1-c free_type（自由输出）", () => {
  beforeEach(() => resetStorage());

  it("一次写对 → rating 4、题型记 recall、卡片未被误置 mastered", async () => {
    const data = seedOne(2);
    const plan = planReviewSession(data);
    expect(plan.steps[0].mode).toBe("free_type");
    const page = mountReview();
    expect(shownMode(page)).toBe("free_type");

    await answerCorrect(page, plan.steps[0]);

    const [review] = reviewsOf("rv1-card");
    expect(review.mode).toBe("recall");
    expect(review.rating).toBe(4);
    expect(cardOf("rv1-card").status).not.toBe("mastered"); // 只有 1 次输出，不该掌握
    page.unmount();
  });

  it("先写错再写对 → rating 3，且第一次写错不落库、给的是方向性提示而非答案", async () => {
    const data = seedOne(2);
    const plan = planReviewSession(data);
    const page = mountReview();

    await answerWrong(page, plan.steps[0]);
    expect(reviewsOf("rv1-card").length).toBe(0);
    const hint = page.text();
    expect(hint).toContain("还没对上");
    expect(hint, "提示不能把答案说出来").not.toContain("I am drawing a picture.");
    await answerCorrect(page, plan.steps[0]);

    expect(reviewsOf("rv1-card")[0].rating).toBe(3);
    expect(page.has("I am drawing a picture.")).toBe(true);
    page.unmount();
  });

  it("看答案 → rating 1；判分口径（diffScore≥90）与页面一致", async () => {
    const data = seedOne(2);
    const plan = planReviewSession(data);
    const page = mountReview();

    await answerWrong(page, plan.steps[0]);
    await clickOne(enabledButtons(page).find((item) => (item.textContent ?? "").includes("看答案")) as HTMLButtonElement);

    expect(reviewsOf("rv1-card")[0].rating).toBe(1);
    expect(latestSchedule("rv1-card").intervalDays).toBe(0);
    // 口径核对：差异判分 ≥90 才算通过
    expect(judgeGrammarFreeType("I am drawing a picture.", "I am drawing a picture.").passed).toBe(true);
    expect(judgeGrammarFreeType("I am draw a picture.", "I am drawing a picture.").passed).toBe(false);
    page.unmount();
  });

  it("cloze 判分大小写宽容：选项按钮上显示的小写干扰项不会让正确答案失效", async () => {
    const data = seedOne(0);
    const plan = planReviewSession(data);
    if (plan.steps[0].mode !== "cloze") throw new Error("预期 cloze");
    const page = mountReview();
    const answer = plan.steps[0].answer;
    expect(judgeGrammarCloze(answer.toUpperCase(), answer)).toBe(true);
    page.unmount();
    void data;
  });
});
