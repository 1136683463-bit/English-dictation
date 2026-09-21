// @vitest-environment jsdom
/**
 * ST2 · 段内子步骤的边界（六段流程的状态机验证）
 *
 * 覆盖：
 *  - guided 6 题的「最后一题」出口文案与推进、第 1 题有无「上一题」；
 *  - practice 多题的题号推进 / 跳题 / 回头改前一道题；
 *  - recall 的提示阶梯（错 1 次不给答案出口、错 2 次给）；
 *  - output（说出来）两档与提示阶梯（level 0→1→2→3）；
 *  - 中段对比卡（练段末尾的「再看两组对错」）的记账与出口。
 *
 * 约定同 st1：`FAIL-` = 已确认缺陷（断言写成「缺陷仍然存在」），`PASS-` = 验过没问题。
 *
 * 段内子步骤清单：
 *   guided    6 题（L13 展示序：arrange/spot/choose/arrange/replace/arrange）
 *             第 1 题无「上一题」、整段无跳题、末题出口「下面自己来」
 *   practice  5 题；末题后按 contrast 数量插「再看两组对错」；出口「最后一步：说出来」
 *   recall    单题；提示阶梯 = 错 2 次才给「想不起来，看答案」
 *   output    2 档；提示阶梯 level 0→1→2→3；末档通过才出「完成这一课」
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import GrammarLessonPage from "../../pages/GrammarLessonPage";
import { makeAppData, telemetryOfKind } from "./fixtures";
import { clickElement, flushAsync } from "./drive";
import {
  answerArrangeCorrectly,
  answerPretest,
  bankChips,
  builtChips,
  guidedEntries,
  inSection,
  lessonOf,
  sectionLabels,
  typeInto,
  type Mounted
} from "../lessonFlow";

const LESSON = "lesson-13-now";

const seed = (): void => {
  window.localStorage.setItem("personal-vocab-app-data-v1", JSON.stringify(makeAppData()));
};
const mount = () => mountPage(<GrammarLessonPage />, `/grammar/lesson/${LESSON}`, "/grammar/lesson/:lessonId");
const data = () => JSON.parse(window.localStorage.getItem("personal-vocab-app-data-v1") ?? "{}");

const forwardExits = (page: Mounted): string[] =>
  page.buttons().filter((text) => /^(下一题|下面自己来|进入练习|最后一步：说出来|完成这一课)$/.test(text));
const clickExact = (page: Mounted, label: string): void =>
  clickElement(
    Array.from(page.container.querySelectorAll<HTMLButtonElement>("button")).find(
      (button) => !button.disabled && (button.textContent ?? "").trim() === label
    )
  );
const rereadButton = (page: Mounted): HTMLButtonElement => {
  const found = Array.from(page.container.querySelectorAll<HTMLButtonElement>("button")).find((button) =>
    (button.textContent ?? "").trim().includes("回去再看")
  );
  if (!found) throw new Error(`找不到「回去再看…」按钮：${page.buttons().filter(Boolean).join(" | ")}`);
  return found;
};
/** 答对当前 guided 题（按展示序取题型）。 */
const answerCurrentGuided = (page: Mounted): void => {
  const index = Number((page.text().match(/第 (\d+) \/ \d+ 题/) ?? [])[1] ?? "1") - 1;
  const step = guidedEntries(LESSON)[index];
  if (step.step.kind === "arrange") answerArrangeCorrectly(page, step.step.answer);
  else if (step.step.kind === "spot")
    clickElement(
      Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-spot button")).find(
        (button) => (button.textContent ?? "").trim() === (step.step.wrongToken ?? step.step.answer)
      )
    );
  else
    clickElement(
      Array.from(page.container.querySelectorAll<HTMLButtonElement>(".lesson-option")).find(
        (button) => (button.textContent ?? "").trim() === step.step.answer
      )
    );
};
/**
 * 引导段答对后脱困：若去抖 ref 吞掉了判题（见 st1 FAIL-2），移除一块再放回。
 * 返回是否真的卡过。
 */
const escapeIfStuck = (page: Mounted, answer: string): boolean => {
  if (forwardExits(page).length > 0) return false;
  const built = builtChips(page);
  if (built.length === 0) return false;
  clickElement(built[built.length - 1]);
  clickElement(
    bankChips(page).find(
      (chip) => !chip.disabled && (chip.textContent ?? "").trim() === answer.split(/\s+/).filter(Boolean).pop()
    )
  );
  return true;
};
const toGuided = (page: Mounted): void => {
  answerPretest(page, LESSON, true);
  page.click("直接去练习");
  page.click("回去再看一遍讲解");
  page.click("下一步：搭装与对错");
  page.click("下一步：变奏");
  page.click("看懂了，试一试");
};
const toPractice = (page: Mounted): void => {
  toGuided(page);
  const entries = guidedEntries(LESSON);
  for (const entry of entries) {
    answerCurrentGuided(page);
    escapeIfStuck(page, entry.step.answer);
    const next = forwardExits(page)[0];
    if (!next) throw new Error(`引导段第 ${entry.displayIndex + 1} 题无出口：${page.buttons().filter(Boolean).join(" | ")}`);
    clickExact(page, next);
  }
  if (inSection(page, "凭记忆写")) {
    typeInto(page, lessonOf(LESSON).recall?.answer ?? "");
    page.click("提交");
    page.click("进入练习");
  }
};
/** 走完 practice 常规题，停在产出段（outputActive）。 */
const toOutput = async (page: Mounted): Promise<void> => {
  toPractice(page);
  await flushAsync();
  const lesson = lessonOf(LESSON);
  for (let index = 0; index < lesson.practice.length; index += 1) {
    answerArrangeCorrectly(page, lesson.practice[index].answer);
    await flushAsync();
    clickExact(page, index + 1 >= lesson.practice.length ? "最后一步：说出来" : "下一题");
    await flushAsync();
  }
  const mid = page.container.querySelector('[aria-label="再看两组对错"]');
  if (mid) {
    for (const card of Array.from(mid.querySelectorAll<HTMLElement>(".lesson-contrast-card"))) {
      const option = card.querySelector<HTMLButtonElement>("button.lesson-option");
      if (option) clickElement(option);
      await flushAsync();
    }
    page.click("最后一步：说出来");
    await flushAsync();
  }
};

describe("ST2 · 段内子步骤边界", () => {
  beforeEach(() => resetStorage());

  /** PASS-1 guided：6 题逐题推进，题号单调递增，末题出口文案是「下面自己来」。 */
  it("PASS-1 guided 6 题：题号 1→6 单调推进，末题出口为「下面自己来」", async () => {
    seed();
    const page = mount();
    toGuided(page);
    await flushAsync();
    const entries = guidedEntries(LESSON);
    expect(entries.length, "L13 guided 应有 6 题").toBe(6);

    for (let position = 0; position < entries.length; position += 1) {
      const entry = entries[position];
      expect(page.text(), `第 ${position + 1} 题题号`).toMatch(new RegExp(`第 ${position + 1} / 6 题`));
      expect(builtChips(page), `第 ${position + 1} 题应无拼装残留`).toHaveLength(0);
      expect(
        page.container.querySelector(".lesson-feedback"),
        `第 ${position + 1} 题入口不应带反馈`
      ).toBeNull();

      answerCurrentGuided(page);
      await flushAsync();
      escapeIfStuck(page, entry.step.answer);
      const exits = forwardExits(page);
      const expected = position + 1 >= entries.length ? "下面自己来" : "下一题";
      expect(exits, `第 ${position + 1} 题答对后出口`).toEqual([expected]);
      expect(page.container.querySelector(".lesson-feedback.pass"), `第 ${position + 1} 题应给通过反馈`).not.toBeNull();

      clickExact(page, expected);
      await flushAsync();
    }
    expect(inSection(page, "凭记忆写"), `末题后应进忆段，实际：${sectionLabels(page).join(",")}`).toBe(true);
    page.unmount();
  });

  /** PASS-2 guided：第 1 题没有「上一题」，整段没有跳题入口（只能逐题）。 */
  it("PASS-2 guided 无跳题 / 无「上一题」入口，段点不可点", async () => {
    seed();
    const page = mount();
    toGuided(page);
    await flushAsync();
    expect(
      page.buttons().some((text) => /上一题|上一步/.test(text)),
      "第 1 题不应有「上一题」"
    ).toBe(false);

    // 走一题，确认第 2 题仍无「上一题」（不允许回头改）
    answerCurrentGuided(page);
    await flushAsync();
    escapeIfStuck(page, guidedEntries(LESSON)[0].step.answer);
    clickExact(page, "下一题");
    await flushAsync();
    expect(page.text()).toMatch(/第 2 \/ 6 题/);
    expect(page.buttons().some((text) => /上一题/.test(text)), "第 2 题也不提供「上一题」").toBe(false);

    // 顶栏段点是 span，不可点（不是导航控件）
    const dots = Array.from(page.container.querySelectorAll(".lesson-stage-dots span"));
    expect(dots.length).toBeGreaterThan(0);
    expect(
      dots.every((dot) => dot.tagName === "SPAN"),
      "段点应是纯展示 span，不是可点按钮"
    ).toBe(true);
    page.unmount();
  });

  /** PASS-3 practice：题号单调推进，最后一题出口是「最后一步：说出来」。 */
  it("PASS-3 practice 5 题：逐题推进，末题出口为「最后一步：说出来」", async () => {
    seed();
    const page = mount();
    toPractice(page);
    await flushAsync();
    const lesson = lessonOf(LESSON);
    expect(lesson.practice.length, "L13 practice 应有 5 题").toBe(5);

    for (let index = 0; index < lesson.practice.length; index += 1) {
      expect(page.text(), `第 ${index + 1} 题题号`).toMatch(new RegExp(`第 ${index + 1} / 5 题`));
      expect(builtChips(page), `第 ${index + 1} 题应无拼装残留`).toHaveLength(0);
      answerArrangeCorrectly(page, lesson.practice[index].answer);
      await flushAsync();
      const expected = index + 1 >= lesson.practice.length ? "最后一步：说出来" : "下一题";
      expect(forwardExits(page), `第 ${index + 1} 题答对后出口`).toContain(expected);
      clickExact(page, expected);
      await flushAsync();
    }
    // L13 contrast 有 6 组 → >2，所以练段末尾会插「再看两组对错」
    expect(inSection(page, "再看两组对错"), `应停在「再看两组对错」，实际：${sectionLabels(page).join(",")}`).toBe(true);
    page.unmount();
  });

  /**
   * PASS-4 practice：练习推进不写快照之外的脏状态；`practiceNext` 会清空
   * practiceOrder / feedback / misses / hint / mistakeSaved —— 逐题验证。
   */
  it("PASS-4 practice 换题时逐题状态被清空（order/feedback/miss/hint）", async () => {
    seed();
    const page = mount();
    toPractice(page);
    await flushAsync();
    const lesson = lessonOf(LESSON);

    // 第 1 题先故意错一次（制造 retry / hint / misses）
    const { answerArrangeWrongly } = await import("../lessonFlow");
    answerArrangeWrongly(page, lesson.practice[0].answer);
    await flushAsync();
    expect(page.container.querySelector(".lesson-feedback.retry"), "① 应有 retry 反馈").not.toBeNull();
    expect(page.has("为什么我拼的不对？"), "① 错一次即出追问入口").toBe(true);
    expect(page.buttons(), "① 错一次应给「照着拼一遍」兜底出口").toContain("想不起来了，照着拼一遍");

    // 改对
    answerArrangeCorrectly(page, lesson.practice[0].answer);
    await flushAsync();
    expect(page.container.querySelector(".lesson-feedback.pass"), "② 改对应通过").not.toBeNull();
    clickExact(page, "下一题");
    await flushAsync();

    expect(page.text(), "③ 应到第 2 题").toMatch(/第 2 \/ 5 题/);
    expect(builtChips(page), "③ 第 2 题拼装区应清空").toHaveLength(0);
    expect(page.container.querySelector(".lesson-feedback"), "③ 第 2 题不应带上一题反馈").toBeNull();
    expect(page.has("为什么我拼的不对？"), "③ 第 2 题不应带上一题追问入口").toBe(false);
    // 第 2 题再答错时，miss 计数必须从 0 起算（否则一错就出兜底出口）
    answerArrangeWrongly(page, lesson.practice[1].answer);
    await flushAsync();
    expect(
      page.container.querySelector(".lesson-feedback.retry"),
      "④ 第 2 题首次错应有 retry 反馈"
    ).not.toBeNull();
    expect(page.has("为什么我拼的不对？"), "④ 第 2 题首次错即出追问入口（与第 1 题同规则）").toBe(true);
    page.unmount();
  });

  /** PASS-5 recall：错 1 次不给答案出口、错 2 次才给；答对直接通过。 */
  it("PASS-5 recall 提示阶梯：错 1 次无出口、错 2 次出「想不起来，看答案」", async () => {
    seed();
    const page = mount();
    toGuided(page);
    const entries = guidedEntries(LESSON);
    for (const entry of entries) {
      answerCurrentGuided(page);
      escapeIfStuck(page, entry.step.answer);
      clickExact(page, forwardExits(page)[0]);
    }
    expect(inSection(page, "凭记忆写"), `应到忆段，实际：${sectionLabels(page).join(",")}`).toBe(true);

    typeInto(page, "totally wrong one");
    page.click("提交");
    await flushAsync();
    expect(page.buttons(), "① 第 1 次错不应给「看答案」出口").not.toContain("想不起来，看答案");
    expect(page.container.querySelector(".lesson-feedback.retry"), "① 应给 retry 反馈").not.toBeNull();

    typeInto(page, "totally wrong two");
    page.click("提交");
    await flushAsync();
    expect(page.buttons(), "② 第 2 次错才给「看答案」出口").toContain("想不起来，看答案");

    clickExact(page, "想不起来，看答案");
    await flushAsync();
    expect(page.text(), "③ 揭示后应显示正确答案").toContain(lessonOf(LESSON).recall?.answer ?? "");
    expect(page.buttons(), "③ 揭示后应有「进入练习」出口").toContain("进入练习");
    expect(
      page.container.querySelector("textarea.large-textarea"),
      "③ 揭示后输入框应消失"
    ).toBeNull();

    /**
     * 忆段每次提交各记一条 step 结果（attempts 累加、passed 恒 false ——
     * 看答案不阻断完课，但诚实记为未通过）。三次动作 = 三条记录。
     */
    const recallSteps = telemetryOfKind("lesson_step_result").filter((event) => event.section === "recall");
    expect(
      recallSteps.map((event) => `a${event.attempts} p${event.passed}`),
      "忆段三次动作各记一条：两次提交 + 一次看答案"
    ).toEqual(["a1 pfalse", "a2 pfalse", "a3 pfalse"]);
    expect(
      recallSteps.every((event) => event.sentenceHash === recallSteps[0].sentenceHash),
      "三条记录指向同一句（句面哈希一致）"
    ).toBe(true);
    page.unmount();
  });

  /** PASS-6 output：两档产出 + 提示阶梯 level 0→3，每档独立重置。 */
  it("PASS-6 output 两档与提示阶梯：跨档重置，level 3 才揭示答案", async () => {
    seed();
    const page = mount();
    await toOutput(page);
    expect(inSection(page, "说出来"), `应到产出段，实际：${sectionLabels(page).join(",")}`).toBe(true);
    expect(page.text(), "① 第 1 档").toMatch(/最后一步 · 说出来（1 \/ 2）/);
    expect(page.buttons(), "① 初始只有「想不起来？给我一点提示」").toContain("想不起来？给我一点提示");
    expect(page.has("正确答案："), "① 初始不应揭示答案").toBe(false);

    page.click("想不起来？给我一点提示");
    await flushAsync();
    expect(page.text(), "② level 1 给「这句要说的是」").toContain("这句要说的是：");
    expect(page.buttons(), "② level 1 出口").toContain("还是想不起来，再看一点");

    page.click("还是想不起来，再看一点");
    await flushAsync();
    expect(page.text(), "③ level 2 给句型框").toContain("开头和词数给你：");
    expect(page.buttons(), "③ level 2 出口").toContain("还是想不起来，直接看答案");
    expect(page.has("正确答案："), "③ level 2 仍不应揭示答案").toBe(false);

    page.click("还是想不起来，直接看答案");
    await flushAsync();
    expect(page.text(), "④ level 3 揭示答案").toContain("正确答案：");
    expect(page.buttons(), "④ level 3 出口").toContain("照着打一遍（会排进复习队列）");

    // 照抄答案提交 → 进第 2 档
    const revealed = /正确答案：([\s\S]*?)(?:照着打一遍|想不起来|$)/.exec(
      page.container.querySelector(".lesson-quiz-card")?.textContent ?? ""
    )?.[1]?.trim();
    expect(revealed, "④ 应能取到揭示的答案").toBeTruthy();
    typeInto(page, revealed ?? "");
    clickExact(page, "提交");
    await flushAsync();
    expect(page.text(), "⑤ 应进第 2 档").toMatch(/最后一步 · 说出来（2 \/ 2）/);
    expect(page.has("正确答案："), "⑤ 跨档后提示层级应重置（不再显示答案）").toBe(false);
    expect(page.buttons(), "⑤ 第 2 档回到 level 0").toContain("想不起来？给我一点提示");
    expect(page.text(), "⑤ 第 2 档无句型框提示").not.toContain("句型框：");

    const outputSteps = telemetryOfKind("lesson_step_result").filter((event) => event.section === "output");
    expect(
      outputSteps.map((event) => `${event.stepKind}#${event.stepIndex}`),
      "⑤ 第 1 档用提示后通过应记为 free_type_hint"
    ).toEqual(["free_type_hint#0"]);
    page.unmount();
  });

  /** PASS-7 中段对比卡：两张卡各记一条 practice/contrast，押后出口永远在。 */
  it("PASS-7 中段「再看两组对错」：两张卡各记一条 contrast", async () => {
    seed();
    const page = mount();
    toPractice(page);
    await flushAsync();
    const lesson = lessonOf(LESSON);
    for (let index = 0; index < lesson.practice.length; index += 1) {
      answerArrangeCorrectly(page, lesson.practice[index].answer);
      await flushAsync();
      clickExact(page, index + 1 >= lesson.practice.length ? "最后一步：说出来" : "下一题");
      await flushAsync();
    }
    const block = page.container.querySelector('[aria-label="再看两组对错"]');
    expect(block, "L13 contrast>2 应插中段对比").not.toBeNull();
    const cards = Array.from(block?.querySelectorAll<HTMLElement>(".lesson-contrast-card") ?? []);
    expect(cards.length, "中段应有 2 张对比卡").toBe(2);

    /**
     * 可疑点（记录现状 · P2）：通往产出段的「最后一步：说出来」按钮**不依赖是否判过卡**
     * （页面 2880-2892 无条件渲染），所以这组对比题可以被完全跳过。
     * 注意 lessonFlow.finishPractice 的注释声称「判完每张卡才会出现通往产出段的按钮」——
     * 与实际不符（该注释是过期的）。
     */
    expect(
      page.buttons(),
      "★ 可疑：未判任何卡时「最后一步：说出来」已可直接点（对比题可被整体跳过）"
    ).toContain("最后一步：说出来");
    expect(
      telemetryOfKind("lesson_step_result").filter(
        (event) => event.section === "practice" && event.stepKind === "contrast"
      ).length,
      "跳过时不应有任何 contrast 记录"
    ).toBe(0);

    for (const card of cards) {
      const option = card.querySelector<HTMLButtonElement>("button.lesson-option");
      expect(option, "每张卡应有选项").not.toBeNull();
      clickElement(option);
      await flushAsync();
    }
    expect(page.buttons(), "判完两张卡后出口保持唯一").toContain("最后一步：说出来");

    const contrastSteps = telemetryOfKind("lesson_step_result").filter(
      (event) => event.section === "practice" && event.stepKind === "contrast"
    );
    expect(contrastSteps.length, "两张卡各记一条 contrast").toBe(2);
    /**
     * 可疑点（记录现状 · P2）：contrast 的 stepIndex 用 `offset + 2`（页面 2858-2860），
     * 与 practice 常规题的 stepIndex（0..4）在同一 section 里共用命名空间，
     * 因此 index 2/3 与练习题 3/4 **撞号**。若下游按 (section, stepIndex) 去重会丢记录。
     */
    expect(
      contrastSteps.map((event) => Number(event.stepIndex)).sort((a, b) => a - b),
      "★ 可疑：contrast 的 stepIndex 2/3 与 practice 题 3/4 撞号（同 section 内命名空间重叠）"
    ).toEqual([2, 3]);
    page.unmount();
  });

  /** PASS-8 practice：允许「回头改」——移除已选词块后重新摆，判题去抖被重置。 */
  it("PASS-8 practice 允许移除词块重摆：判题去抖被 arrangeRemove 重置", async () => {
    seed();
    const page = mount();
    toPractice(page);
    await flushAsync();
    const answer = lessonOf(LESSON).practice[0].answer;

    // 先摆满但故意乱序（触发一次判错）
    const { answerArrangeWrongly } = await import("../lessonFlow");
    answerArrangeWrongly(page, answer);
    await flushAsync();
    expect(page.container.querySelector(".lesson-feedback.retry"), "① 乱序应判 retry").not.toBeNull();

    // 逐块移除后再按答案摆回
    for (let guard = 0; guard < 20 && builtChips(page).length > 0; guard += 1) {
      clickElement(builtChips(page)[0]);
      await flushAsync();
    }
    expect(builtChips(page), "② 应清空").toHaveLength(0);
    expect(page.container.querySelector(".lesson-feedback"), "② 清空后反馈应回到 idle").toBeNull();
    answerArrangeCorrectly(page, answer);
    await flushAsync();
    expect(page.container.querySelector(".lesson-feedback.pass"), "③ 摆回应通过（去抖已重置）").not.toBeNull();
    page.unmount();
  });

  /**
   * FAIL-1（P1 体验/情感过滤 · 与「看答案」路径反馈不对称）
   * output 第 1 档**凭自己写对**时，`submitOutput` 走 `advanceOutputStep()` 后直接
   * return（页面 1523-1527），于是画面**立刻静默换成第 2 句**：输入框清空、
   * 没有任何「写对了」的反馈、没有过渡按钮，用户只看到句子变了。
   * 反过来，点「照着打一遍」走 `revealOutput` 却会拿到一张带
   * 「没关系，先看正确说法：…」+「下一句（这次没有提示）」的完整反馈卡。
   * 结果是：**放弃者拿到确认，成功者什么也没有** —— 与项目「确证仪式」的取向相反。
   */
  it("FAIL-1 output 第 1 档凭自己写对：静默换句，无任何反馈", async () => {
    seed();
    const page = mount();
    await toOutput(page);
    /** 取当前档揭示在卡片上的答案（第 1 档是带句型框的半提示变体句）。 */
    const revealedAnswer = (): string =>
      /正确答案：([\s\S]*?)(?:照着打一遍|想不起来|$)/.exec(
        page.container.querySelector(".lesson-quiz-card")?.textContent ?? ""
      )?.[1]?.trim() ?? "";

    expect(page.text(), "① 第 1 档").toMatch(/最后一步 · 说出来（1 \/ 2）/);
    page.click("想不起来？给我一点提示");
    await flushAsync();
    page.click("还是想不起来，再看一点");
    await flushAsync();
    page.click("还是想不起来，直接看答案");
    await flushAsync();
    const first = revealedAnswer();
    expect(first, "① 应能取到第 1 档答案").not.toBe("");

    typeInto(page, first);
    clickExact(page, "提交");
    await flushAsync();

    // 已静默切到第 2 档
    expect(page.text(), "② 画面已跳到第 2 档").toMatch(/最后一步 · 说出来（2 \/ 2）/);
    expect(
      page.container.querySelector(".lesson-feedback"),
      "★ 缺陷：凭自己写对时没有任何反馈（不区分「刚才是对的」和「换句子了」）"
    ).toBeNull();
    expect(
      page.buttons(),
      "★ 缺陷：也没有过渡按钮 —— 成功路径与放弃路径的反馈完全不对称"
    ).not.toContain("下一句（这次没有提示）");

    const outputSteps = telemetryOfKind("lesson_step_result").filter((event) => event.section === "output");
    expect(
      outputSteps.map((event) => `#${event.stepIndex} a${event.attempts} ${event.passed}`),
      "② 遥测记下了「通过」，但界面没有告诉用户"
    ).toEqual(["#0 a1 true"]);

    // 对照组：同样第 1 档，走「照着打一遍」放弃路径反而有完整反馈
    // （上一段走完了练习段，留下续学快照；对照页要清掉，否则先弹「继续刚才」）
    window.localStorage.removeItem(`grammar:resume:${LESSON}`);
    const second = mount();
    await toOutput(second);
    second.click("想不起来？给我一点提示");
    await flushAsync();
    second.click("还是想不起来，再看一点");
    await flushAsync();
    second.click("还是想不起来，直接看答案");
    await flushAsync();
    clickExact(second, "照着打一遍（会排进复习队列）");
    await flushAsync();
    expect(
      second.container.querySelector(".lesson-feedback.pass"),
      "③ 对照：放弃路径（照着打一遍）反而得到完整反馈卡"
    ).not.toBeNull();
    expect(second.buttons(), "③ 对照：放弃路径还有「下一句（这次没有提示）」按钮").toContain(
      "下一句（这次没有提示）"
    );
    second.unmount();
    page.unmount();
  });

  /**
   * PASS-9 output 第 2 档（最后一档）写对后走完课收尾：出口是「完成这一课」，
   * 且此时才出现通过反馈（`setOutputOutcome("pass")` 分支）。
   */
  it("PASS-9 output 最后一档写对：出现通过反馈与「完成这一课」", async () => {
    seed();
    const page = mount();
    await toOutput(page);
    const revealedAnswer = (): string =>
      /正确答案：([\s\S]*?)(?:照着打一遍|想不起来|$)/.exec(
        page.container.querySelector(".lesson-quiz-card")?.textContent ?? ""
      )?.[1]?.trim() ?? "";

    // 第 1 档：用「看答案 → 照着打一遍」，平稳切到第 2 档
    page.click("想不起来？给我一点提示");
    await flushAsync();
    page.click("还是想不起来，再看一点");
    await flushAsync();
    page.click("还是想不起来，直接看答案");
    await flushAsync();
    typeInto(page, revealedAnswer());
    clickExact(page, "提交");
    await flushAsync();
    expect(page.text(), "① 已到第 2 档").toMatch(/最后一步 · 说出来（2 \/ 2）/);
    expect(page.has("句型框："), "① 第 2 档不应再有句型框").toBe(false);

    // 第 2 档：看答案后照抄（末档通过会出现反馈卡）
    page.click("想不起来？给我一点提示");
    await flushAsync();
    page.click("还是想不起来，再看一点");
    await flushAsync();
    page.click("还是想不起来，直接看答案");
    await flushAsync();
    const second = revealedAnswer();
    expect(second, "② 第 2 档答案与第 1 档不同").not.toBe("");
    typeInto(page, second);
    clickExact(page, "提交");
    await flushAsync();
    expect(
      page.container.querySelector(".lesson-feedback.pass"),
      "② 最后一档写对后应出现通过反馈"
    ).not.toBeNull();
    expect(page.buttons(), "② 出口是「完成这一课」").toContain("完成这一课");
    page.unmount();
  });

  /**
   * PASS-10 output 答错：给 retry 与追问入口，不揭示答案，诚实记为 free_type。
   */
  it("PASS-10 output 答错：给 retry 与追问入口，不揭示答案", async () => {
    seed();
    const page = mount();
    await toOutput(page);
    const targetSentence = lessonOf(LESSON).targetSentence;

    typeInto(page, targetSentence);
    clickExact(page, "提交");
    await flushAsync();
    expect(page.container.querySelector(".lesson-feedback.retry"), "① 应判 retry").not.toBeNull();
    expect(page.has("正确答案："), "① 答错不应揭示答案").toBe(false);
    expect(page.buttons(), "① 错 1 次即出追问入口").toContain("为什么这句总写不对？");
    expect(page.buttons(), "① level 0 时仍保留提示阶梯入口").toContain("想不起来？给我一点提示");

    const outputSteps = telemetryOfKind("lesson_step_result").filter((event) => event.section === "output");
    expect(outputSteps.length, "① 答错应记一条").toBe(1);
    expect(outputSteps[0].passed, "① 诚实记为未通过").toBe(false);
    expect(outputSteps[0].stepKind, "① 未用提示应记 free_type").toBe("free_type");
    page.unmount();
  });
});
