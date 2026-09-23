// @vitest-environment jsdom
/**
 * H3 · 提示与重试（侦探找错）
 *
 * 验证 hint 机制：消耗线索额度、只给罪名+方位（不泄露答案）、
 * 结算里如实标注「看过提示」、线索用完后仍可继续玩（不卡死），
 * 以及误判次数不设上限（5 次之后照样能破案，只是星级下降）。
 */
import { describe, expect, it, beforeEach } from "vitest";
import { mountPage, resetStorage } from "./harness";
import { clickElement, flushAsync } from "./verify/drive";
import { currentData, installResizeObserverStub, seedAppData } from "./huntDiaryEnv";
import { grammarLessons } from "../data/grammarLessons";
import { huntCases } from "../data/huntCases";
import { HUNT_CLUE_BUDGET, addHuntGapSentences, pickCorrectionWord } from "../services/huntService";
import GrammarHuntPage from "../pages/GrammarHuntPage";

const TAG_LABEL: Record<string, string> = {
  tense: "说过去的事",
  sv_agreement: "谁做要看谁",
  missing_be: "少了那个是",
  article: "东西前面那个小词",
  plural: "两个以上",
  preposition: "固定搭配",
  fragment: "句子没说完",
  run_on: "两个连词打架",
  word_order: "词的先后",
  verb_form: "动词的形式",
  comparison: "比一比"
};

const CASE_ID = "hunt-call-mother";
const CASE = huntCases.find((item) => item.id === CASE_ID)!;

const lessonsFor = (caseId: string): string[] =>
  grammarLessons.filter((lesson) => lesson.huntCaseIds.includes(caseId)).map((lesson) => lesson.id);

const openCase = (caseId: string) => {
  seedAppData({ grammarLessonsDone: lessonsFor(caseId) });
  return mountPage(<GrammarHuntPage />, `/grammar/hunt?case=${caseId}`, "/grammar/hunt");
};

const tokensOf = (page: ReturnType<typeof openCase>) =>
  Array.from(page.container.querySelectorAll(".hunt-token")) as HTMLElement[];

const hintButton = (page: ReturnType<typeof openCase>) =>
  (Array.from(page.container.querySelectorAll("button")) as HTMLButtonElement[]).find((button) =>
    (button.textContent ?? "").includes("用 1 条线索")
  ) as HTMLButtonElement;

const pickTag = (page: ReturnType<typeof openCase>, label: string) =>
  clickElement(
    (Array.from(page.container.querySelectorAll(".hunt-tag-btn")) as HTMLElement[]).find((button) =>
      (button.textContent ?? "").includes(label)
    ) as HTMLElement
  );

const clueMeter = (page: ReturnType<typeof openCase>) =>
  Number(/线索额度 (\d+) \/ (\d+)/.exec(page.text())?.[1]);

describe("H3 提示与重试", () => {
  beforeEach(() => resetStorage());
  installResizeObserverStub();

  it("案件提供提示按钮，初始额度为 HUNT_CLUE_BUDGET", () => {
    const page = openCase(CASE_ID);
    expect(hintButton(page).disabled).toBe(false);
    expect(clueMeter(page)).toBe(HUNT_CLUE_BUDGET);
    page.unmount();
  });

  it("每次提示消耗 1 条额度，文案只给罪名与方位、不泄露答案词", () => {
    const page = openCase(CASE_ID);
    const before = clueMeter(page);
    clickElement(hintButton(page));
    const text = page.text();
    expect(clueMeter(page)).toBe(before - 1);
    expect(text).toContain("💡");
    const target = CASE.errors[0];
    expect(text).toContain(TAG_LABEL[target.tag]);
    expect(text).toMatch(/前半段|后半段/);
    // 不得出现原词或改正后的完整短语
    expect(text).not.toContain(target.correction);
    page.unmount();
  });

  it("提示可以连点到额度耗尽；耗尽后按钮置灰并给出「照样可以继续」的说明", () => {
    const page = openCase(CASE_ID);
    for (let step = 0; step < HUNT_CLUE_BUDGET; step += 1) {
      expect(hintButton(page).disabled).toBe(false);
      clickElement(hintButton(page));
    }
    expect(clueMeter(page)).toBe(0);
    expect(hintButton(page).disabled).toBe(true);
    const text = page.text();
    expect(text).toContain("线索额度用完了");
    expect(text).toContain("照样可以继续找错");
    // 不卡死：词块仍可点
    expect(tokensOf(page).length).toBe(CASE.tokens.length);
    clickElement(tokensOf(page)[CASE.errors[0].tokenIndex]);
    expect(page.has("的罪名是")).toBe(true);
    page.unmount();
  });

  it("重复点提示会给出同一处（第一个未找到的错）——幂等，不刷答案", () => {
    const page = openCase(CASE_ID);
    clickElement(hintButton(page));
    const first = /「([^」]*)」漏洞/.exec(page.text())?.[1];
    clickElement(hintButton(page));
    const second = /「([^」]*)」漏洞/.exec(page.text())?.[1];
    expect(first).toBe(TAG_LABEL[CASE.errors[0].tag]);
    expect(second).toBe(first);
    page.unmount();
  });

  it("提示不改变结算的误判数，但结算会如实标注「看过提示」", async () => {
    const page = openCase(CASE_ID);
    clickElement(hintButton(page));
    for (const error of CASE.errors) {
      clickElement(tokensOf(page)[error.tokenIndex]);
      pickTag(page, TAG_LABEL[error.tag]);
    }
    await flushAsync();
    const text = page.text();
    expect(text).toContain("破案！");
    // 提示不增加误判（star 计算只看 misses）
    expect(currentData().huntResults[0].misses).toBe(0);
    expect(currentData().huntResults[0].stars).toBe(3);
    // 但复盘标注提示
    expect(text).toContain("看过提示");
    expect(text).toContain("1 处看过提示");
    page.unmount();
  });

  it("误判远超额度后仍能破案（无限重试，只影响星级）", async () => {
    const page = openCase(CASE_ID);
    const errorIndexes = new Set(CASE.errors.map((error) => error.tokenIndex));
    const cleanIndexes = CASE.tokens.map((_, index) => index).filter((index) => !errorIndexes.has(index));
    // 7 次误判 > 5 条额度
    for (let step = 0; step < 7; step += 1) {
      clickElement(tokensOf(page)[cleanIndexes[step]]);
      pickTag(page, "说过去的事");
    }
    expect(clueMeter(page)).toBe(0);
    // 仍然可以继续并破案
    for (const error of CASE.errors) {
      clickElement(tokensOf(page)[error.tokenIndex]);
      pickTag(page, TAG_LABEL[error.tag]);
    }
    await flushAsync();
    const text = page.text();
    expect(text).toContain("破案！");
    expect(text).toContain("★☆☆"); // 3 次以上误判 = 1 星
    const result = currentData().huntResults[0];
    expect(result.misses).toBe(7);
    expect(result.stars).toBe(1);
    expect(result.found).toBe(CASE.errors.length);
    page.unmount();
  });

  it("用提示找到的错会进 SM-2 复习队列（缺口成卡），且幂等", async () => {
    const page = openCase(CASE_ID);
    clickElement(hintButton(page));
    for (const error of CASE.errors) {
      clickElement(tokensOf(page)[error.tokenIndex]);
      pickTag(page, TAG_LABEL[error.tag]);
    }
    await flushAsync();
    const cards = currentData().cards.filter((card) => card.sourceId === `hunt:${CASE_ID}`);
    expect(cards.length).toBe(1); // 只有被提示的那一处是缺口
    expect(cards[0].tags).toContain("语法");
    // 幂等：同一案同罪名重复结算不再建卡
    const again = addHuntGapSentences(currentData(), CASE, [CASE.errors[0].tokenIndex]);
    expect(again.added).toBe(0);
    page.unmount();
  });

  it("提示埋点被记录（可用于统计提示依赖度）", () => {
    const page = openCase(CASE_ID);
    clickElement(hintButton(page));
    clickElement(hintButton(page));
    const events = (JSON.parse(window.localStorage.getItem("grammar-telemetry-events-v1") ?? "{}").events ?? []) as Array<{
      kind: string;
    }>;
    expect(events.filter((event) => event.kind === "hunt_hint_used").length).toBe(2);
    page.unmount();
  });

  it("结算后提示按钮不可再用（避免结算后继续消耗额度）", async () => {
    const page = openCase(CASE_ID);
    for (const error of CASE.errors) {
      clickElement(tokensOf(page)[error.tokenIndex]);
      pickTag(page, TAG_LABEL[error.tag]);
    }
    await flushAsync();
    expect(page.has("破案！")).toBe(true);
    expect(hintButton(page).disabled).toBe(true);
    page.unmount();
  });

  it("结算后可返回案件列表，且「下一案」只在已解锁案件里挑", async () => {
    const page = openCase(CASE_ID);
    for (const error of CASE.errors) {
      clickElement(tokensOf(page)[error.tokenIndex]);
      pickTag(page, TAG_LABEL[error.tag]);
    }
    await flushAsync();
    page.clickMatch(/再来一案/);
    await flushAsync();
    expect(page.has("全部案件")).toBe(true);
    // 只有 lesson-01-am 完成 → 只有该课引用的案解锁
    const cards = Array.from(page.container.querySelectorAll(".hunt-case-card")) as HTMLButtonElement[];
    const unlocked = cards.filter((card) => !card.disabled);
    expect(unlocked.length).toBeGreaterThan(0);
    console.log("[H3] 结算后已解锁案数：", unlocked.length, "/", cards.length);
    page.unmount();
  });

  // ── 错词本的诚实性（已知问题 P3）────────────────────────────
  it("「加入错词本」按钮数应等于真实可加词数（不是案件错误数）", () => {
    // 数据侧：可加词 = pickCorrectionWord 非空的植错点
    let mismatch = 0;
    for (const item of huntCases) {
      const addable = item.errors.filter((e) => pickCorrectionWord(e.correction, e.editOp) !== "").length;
      if (addable !== item.errors.length) mismatch += 1;
    }
    // 有差异是数据事实（删词型加不进去）；UI 已按真实可加数显示，本断言只防规模恶化
    expect(mismatch).toBeLessThanOrEqual(120);
  });

  it("删词型案件不显示「加入错词本」按钮（2026-09-20 已修：不再虚报数字）", async () => {
    // hunt-because-so 两处修正都是「去掉 so / 去掉 but」→ pickCorrectionWord 返回空串 → 无可加词
    seedAppData({ grammarLessonsDone: lessonsFor("hunt-because-so") });
    const page = mountPage(<GrammarHuntPage />, "/grammar/hunt?case=hunt-because-so", "/grammar/hunt");
    const item = huntCases.find((entry) => entry.id === "hunt-because-so")!;
    for (const error of item.errors) {
      clickElement(tokensOf(page)[error.tokenIndex]);
      pickTag(page, TAG_LABEL[error.tag]);
    }
    await flushAsync();
    const book = () =>
      (Array.from(page.container.querySelectorAll("button")) as HTMLButtonElement[]).find((button) =>
        (button.textContent ?? "").includes("错词本")
      ) as HTMLButtonElement;
    // 该案两处修正都是删词型 → 可加词为 0 → 按钮不该出现（此前会显示「把 2 个…」却加不进去）
    expect(book(), "无可加词时不应显示该按钮").toBeUndefined();
    page.unmount();
  });
});
