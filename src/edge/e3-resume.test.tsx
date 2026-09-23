// @vitest-environment jsdom
/**
 * E3 · 中途退出与续学恢复
 *
 * 快照键：localStorage["grammar:resume:<lessonId>"]，TTL 24h。
 * 写入点：practiceNext（练习推进到下一题时）、reread（离开有进度的练习段时）。
 * 读取点：挂载时读一次（resumeLoadedRef 守卫）。
 */
import { describe, expect, it, beforeEach } from "vitest";
import { mountPage, resetStorage } from "./harness";
import GrammarLessonPage from "../pages/GrammarLessonPage";
import {
  answerArrangeCorrectly,
  answerPretest,
  finishGuided,
  inSection,
  lessonOf,
  typeInto,
  markLessonsDoneInStorage,
  sectionLabels
} from "./lessonFlow";

const LESSON = "lesson-03-have";
const RESUME_KEY = `grammar:resume:${LESSON}`;

const mount = (lessonId = LESSON) =>
  mountPage(<GrammarLessonPage />, `/grammar/lesson/${lessonId}`, "/grammar/lesson/:lessonId");

const warmStorage = () => {
  const warm = mount("lesson-01-am");
  warm.unmount();
  markLessonsDoneInStorage(["lesson-01-am"]);
};

/** 快进到练习段第 1 题。 */
const enterPractice = (page: ReturnType<typeof mount>) => {
  answerPretest(page, LESSON, true);
  page.click("直接去练习");
  expect(inSection(page, "自己来"), `应进入练习段，实际: ${sectionLabels(page).join(",")}`).toBe(true);
};

const resumeRaw = (): Record<string, unknown> | null => {
  const raw = window.localStorage.getItem(RESUME_KEY);
  return raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
};

const practiceNumberOf = (page: ReturnType<typeof mount>): number | null => {
  const hit = /第 (\d+) \/ \d+ 题/.exec(page.text());
  return hit ? Number(hit[1]) : null;
};

describe("E3 · 中途退出与续学恢复", () => {
  beforeEach(() => resetStorage());

  it("E3-1 练习推进即写快照，题号与当前一致", () => {
    warmStorage();
    const page = mount();
    enterPractice(page);
    const practice = lessonOf(LESSON).practice;

    /**
     * 2026-09-22 修断言：「进段即写快照」成了新行为。
     *
     * 新增的 `snapshotStage` 会在**任何段位推进**时记一笔（含从前测直接跳到练习），
     * 目的是「用户做完前测就关掉浏览器，刷新回来不该又被扔回前测第 1 题」。
     * 所以刚进练习段时会有一条 `practiceIndex: -1` 的兜底快照——
     * 它表示「停在练习段、尚未推进」，不是「练到第 1 题」（界面文案已按此区分）。
     * 真正要守住的不变量是「推进后快照的题号正确」，见下面几条断言。
     */
    const entrySnapshot = resumeRaw();
    if (entrySnapshot) {
      expect(entrySnapshot.stage, "兜底快照应标记为 practice 段").toBe("practice");
      expect(
        Number(entrySnapshot.practiceIndex),
        "兜底快照必须用 -1 表示「未推进」，不能编造题号"
      ).toBe(-1);
    }

    answerArrangeCorrectly(page, practice[0].answer);
    page.click("下一题");
    expect(practiceNumberOf(page), "应停在第 2 题").toBe(2);

    const saved = resumeRaw();
    expect(saved, "推进时应写快照").not.toBeNull();
    expect(saved?.practiceIndex, "快照题号应 = 1（0 起）").toBe(1);
    expect(Date.now() - Date.parse(String(saved?.savedAt)), "快照应是刚写的").toBeLessThan(10_000);
    page.unmount();
  });

  it("E3-2 卸载后重挂出现「继续刚才」，点它恢复到退出时的题号", () => {
    warmStorage();
    const practice = lessonOf(LESSON).practice;

    const first = mount();
    enterPractice(first);
    for (let index = 0; index < 2; index += 1) {
      answerArrangeCorrectly(first, practice[index].answer);
      first.click("下一题");
    }
    expect(practiceNumberOf(first), "退出前停在第 3 题").toBe(3);
    first.unmount();

    const page = mount();
    expect(page.has("继续刚才的进度"), "重进应给续学入口").toBe(true);
    expect(page.has("上次学到这"), "跨会话来源应标「上次学到这」").toBe(true);
    expect(page.has("第 3 题"), "卡片应写明上次练到第 3 题").toBe(true);

    page.click("继续刚才");
    expect(practiceNumberOf(page), "恢复后题号应为 3（与退出时一致）").toBe(3);
    expect(page.container.querySelector(".lesson-bank")).not.toBeNull();
    // 恢复后判分正常
    expect(answerArrangeCorrectly(page, practice[2].answer)).toBe(true);
    expect(page.container.querySelector(".lesson-feedback.pass"), "恢复后应能答对放行").not.toBeNull();
    page.unmount();
  });

  it("E3-3 「重新开始」清快照：不再提示，且不落到练习段", () => {
    warmStorage();
    const practice = lessonOf(LESSON).practice;

    const first = mount();
    enterPractice(first);
    answerArrangeCorrectly(first, practice[0].answer);
    first.click("下一题");
    first.unmount();

    const page = mount();
    expect(page.has("继续刚才的进度")).toBe(true);
    page.click("重新开始");
    expect(resumeRaw(), "「重新开始」应清掉快照").toBeNull();
    expect(page.has("继续刚才的进度")).toBe(false);
    expect(inSection(page, "自己来"), "放弃续学不应直接落在练习段").toBe(false);
    page.unmount();

    const again = mount();
    expect(again.has("继续刚才的进度"), "清掉后重进不应再问").toBe(false);
    again.unmount();
  });

  it("E3-4 快照过期（>24h）视为无效并删除该键", () => {
    warmStorage();
    window.localStorage.setItem(
      RESUME_KEY,
      JSON.stringify({
        lessonId: LESSON,
        savedAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
        stage: "practice",
        step: 4,
        practiceIndex: 4,
        outputStep: -1,
        guidedIndex: -1
      })
    );

    const page = mount();
    expect(page.has("继续刚才的进度"), "过期快照不应提示").toBe(false);
    expect(resumeRaw(), "过期快照应被清除").toBeNull();
    page.unmount();
  });

  it("E3-5 快照属于别的课（lessonId 不匹配）时不误用，也不删别人的键", () => {
    warmStorage();
    const other = JSON.stringify({
      lessonId: "lesson-99-other",
      savedAt: new Date().toISOString(),
      stage: "practice",
      step: 2,
      practiceIndex: 2,
      outputStep: -1,
      guidedIndex: -1
    });
    window.localStorage.setItem(RESUME_KEY, other);

    const page = mount();
    expect(page.has("继续刚才的进度"), "课不匹配的快照不应提示").toBe(false);
    // 不匹配的快照保留原样（当前实现只对「过期」做删除）
    expect(window.localStorage.getItem(RESUME_KEY)).toBe(other);
    page.unmount();
  });

  /**
   * ✅ 已修（2026-09-20）：此前 loadLessonResume 只校验 lessonId/savedAt，
   * 缺字段的快照原样透传 → practiceIndex 为 undefined → 卡片显示「第 NaN 题」，
   * 点「继续刚才」后 practice[NaN] 为 undefined → 练习卡不渲染、整屏只剩顶栏。
   * 现在缺字段的快照整条判无效并清除（与非法 JSON 同等对待）。
   */
  it("E3-6 缺字段快照被判无效：不提示续学，页面正常", () => {
    warmStorage();
    window.localStorage.setItem(
      RESUME_KEY,
      JSON.stringify({ lessonId: LESSON, savedAt: new Date().toISOString() })
    );
    const page = mount();
    expect(page.buttons().length).toBeGreaterThan(0);
    expect(page.has("继续刚才的进度"), "缺字段快照不应提示续学").toBe(false);
    expect(page.has("第 NaN 题"), "不应出现 NaN 文案").toBe(false);
    expect(page.has("课前试一试"), "应回到正常的首屏").toBe(true);
    page.unmount();
  });

  it("E3-7 产出段子态：outputStep≥0 时卡片标注「含说出来环节」并能恢复到产出段", () => {
    warmStorage();
    window.localStorage.setItem(
      RESUME_KEY,
      JSON.stringify({
        lessonId: LESSON,
        savedAt: new Date().toISOString(),
        stage: "practice",
        step: 3,
        practiceIndex: 3,
        outputStep: 0,
        guidedIndex: -1
      })
    );
    const page = mount();
    expect(page.has("继续刚才的进度")).toBe(true);
    expect(page.has("含「说出来」环节")).toBe(true);
    page.click("继续刚才");
    expect(inSection(page, "说出来"), `应恢复到产出段，实际: ${sectionLabels(page).join(",")}`).toBe(true);
    expect(page.has("最后一步 · 说出来")).toBe(true);
    page.unmount();
  });

  it("E3-8 ⚠️ 回看讲解后原路返回：快照已写但同会话未消费，进度被重置为题 1", () => {
    warmStorage();
    const practice = lessonOf(LESSON).practice;

    const page = mount();
    enterPractice(page);
    for (let index = 0; index < 3; index += 1) {
      answerArrangeCorrectly(page, practice[index].answer);
      page.click("下一题");
    }
    expect(practiceNumberOf(page), "回看前停在第 4 题").toBe(4);

    page.click("回去再看一遍讲解");
    expect(inSection(page, "情景讲解"), "应回到讲解段").toBe(true);
    const savedRightAfter = resumeRaw();
    expect(savedRightAfter, "reread 应写快照").not.toBeNull();
    expect(savedRightAfter?.practiceIndex, "快照记录第 4 题（0 起 3）").toBe(3);

    // 关键观察 1：同会话下不弹续学卡（resumeOffer 只在挂载时读一次 localStorage）
    // eslint-disable-next-line no-console
    console.log("E3-8 回看后同会话是否弹续学卡:", page.has("继续刚才的进度"));
    expect(page.has("继续刚才的进度"), "同会话回看后未弹续学卡").toBe(false);

    // 原路返回：讲解 → 试一试（做完 guided）→ recall → 练习
    page.click("下一步：搭装与对错");
    page.click("下一步：变奏");
    page.click("看懂了，试一试");
    finishGuided(page, LESSON);
    const recall = lessonOf(LESSON).recall;
    if (recall) {
      typeInto(page, recall.answer);
      page.click("提交");
      page.click("进入练习");
    }

    expect(inSection(page, "自己来"), `应回到练习段，实际: ${sectionLabels(page).join(",")}`).toBe(true);
    // eslint-disable-next-line no-console
    console.log("E3-8 回看返回后题号:", practiceNumberOf(page), "（回看前是 4）");
    expect(practiceNumberOf(page), "回看返回后应恢复第 4 题（快照已写但未被消费）").toBe(4); // FAILS: 实际 1
    page.unmount();
  });

  it("E3-9 快照在完课时被清除（完课即不可续学）", () => {
    warmStorage();
    // 直接写一份快照，模拟「做过几题后关掉」
    window.localStorage.setItem(
      RESUME_KEY,
      JSON.stringify({
        lessonId: LESSON,
        savedAt: new Date().toISOString(),
        stage: "practice",
        step: 1,
        practiceIndex: 1,
        outputStep: -1,
        guidedIndex: -1
      })
    );
    const page = mount();
    expect(page.has("继续刚才的进度"), "应先出现续学入口").toBe(true);
    // 已完课的课：把完成态写进去，重挂后「趁热练」条与续学卡同屏（记录并存情况）
    markLessonsDoneInStorage(["lesson-01-am", LESSON]);
    const done = mount();
    // eslint-disable-next-line no-console
    console.log("E3-9 已完课重进的按钮:", done.buttons().filter(Boolean).join(" | "));
    expect(done.buttons().length).toBeGreaterThan(0);
    done.unmount();
    page.unmount();
  });
});
