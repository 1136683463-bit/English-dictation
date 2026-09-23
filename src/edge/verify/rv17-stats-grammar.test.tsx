// @vitest-environment jsdom
/**
 * RV17 · 统计页必须显示语法线（2026-09-23 批六十六）
 *
 * 背景：`StatsPage` 此前**只有词汇**——`statsService` 里 `grammar` 出现 0 次，
 * 六个区块（复习趋势 / 记忆成熟度 / 累计掌握单词 / 里程碑 …）全是词汇。
 * 而语法线是内容投入最大的一条（205 课 / 52 里程碑 / 214 案件）。
 * 这与今日页当初「对 grammar 零引用」是同一类问题：**做完了但看不见**。
 *
 * 本文件锁三件事：
 *   ① 学过课之后出现语法区块，且数字与 `summarizeLessonProgress` 同源
 *   ② **一课都没学时完全不显示**（不打扰新用户，不给空报表）
 *   ③ 区块里给出「下一课」，让统计页也能成为回语法的入口
 *
 * ⚠️ 判据纪律：只查「有没有这块、数字对不对、该藏时藏没藏」，
 * **不查文案措辞**——文案会随产品调整，写死会让闸变成「改文案就红」的噪声源。
 */
import { describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import StatsPage from "../../pages/StatsPage";
import { grammarLessons } from "../../data/grammarLessons";
import { LESSON_GROUPS } from "../../data/grammarSeasons";
import { cardsToData, makeAppData, makeSentenceCard, seedAppData } from "./fixtures";
import type { AppData } from "../../types";

/**
 * jsdom 缺 matchMedia（StatsPage 的移动端断点依赖它）。
 * 与 mg6 / a11y2 用同一份最小垫片——这是**环境缺失**，不是页面缺陷。
 */
if (typeof window !== "undefined" && !window.matchMedia) {
  (window as unknown as { matchMedia: unknown }).matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false
  });
}

/**
 * ⚠️ 两条前置条件（本闸前两版都踩过，都记在这里防再踩）：
 *
 * ① **页面早退**：StatsPage 在 `data.reviews.length === 0` 时渲染空态
 *    （「完成 3 天学习后…」）。那是有意设计（新用户不该看到一堆 0），
 *    所以「有数据」的用例必须先放一条 review，否则测的是空态、语法块根本没机会渲染。
 *
 * ② **review 会被存储层丢掉**：`seedAppData` 走 `parseBackupJson`，
 *    其中 `normalizeReview` 有 `if (!cardIds.has(cardId)) return null`——
 *    review 的 cardId 必须**真的存在于 cards 里**，否则静默丢弃
 *    （实测：localStorage 里 1 条、解析回来 0 条）。
 *    所以这里用仓库自己的 `makeSentenceCard` + `cardsToData` 造一份配套的卡。
 */
const seeded = (lessonIds: string[]) => {
  const fixture = makeSentenceCard({ id: "rv17-card", sentence: "I go to school every day." });
  return makeAppData({
    ...cardsToData([fixture]),
    grammarLessonsDone: lessonIds,
    reviews: [
      {
        id: "rv17-review",
        cardId: "rv17-card",
        mode: "spelling",
        rating: 4,
        answer: "x",
        reviewedAt: new Date().toISOString()
      } as never
    ]
  }) as AppData;
};

const mountStats = () => mountPage(<StatsPage />, "/stats", "/stats");

describe("RV17 统计页的语法线", () => {
  it("① 没学过课 → 不显示语法区块（新用户不被打扰）", () => {
    resetStorage();
    seedAppData(makeAppData({ grammarLessonsDone: [] }) as AppData);
    const page = mountStats();
    const text = page.text();
    // 页面本身要渲染出来（否则下面的「不包含」可能只是没渲染）
    expect(text.length, "页面应正常渲染").toBeGreaterThan(50);
    expect(text, "未学过课时不应出现语法区块").not.toContain("语法阶梯");
    page.unmount();
  });

  it("② 学过课 → 出现区块，且已完课数与总课数与服务同源", () => {
    resetStorage();
    const done = grammarLessons.slice(0, 5).map((lesson) => lesson.id);
    seedAppData(seeded(done));
    const page = mountStats();
    const text = page.text();
    expect(text, "学过课之后应出现语法区块").toContain("语法阶梯");
    // 分母必须来自全库课数（写死数字会在加课时漏改）
    expect(text, `应显示已完成 5 / ${grammarLessons.length}`).toContain(`5 / ${grammarLessons.length}`);
    page.unmount();
  });

  it("③ 区块里给出「下一课」，可作回语法的入口", () => {
    resetStorage();
    const done = grammarLessons.slice(0, 2).map((lesson) => lesson.id);
    seedAppData(seeded(done));
    const page = mountStats();
    const text = page.text();
    const next = grammarLessons[2];
    expect(text, "应提示下一课").toContain(`第 ${next.number} 课`);
    // 与今日页/路径页同源：都走 getNextLesson（取全局第一个未完成）
    expect(next.id, "第 3 课应是 lesson-03").toBe("lesson-03-have");
    page.unmount();
  });

  it("④ 季分母来自真实季数（防写死）", () => {
    resetStorage();
    seedAppData(seeded([grammarLessons[0].id]));
    const page = mountStats();
    expect(page.text(), `季数分母应为 ${LESSON_GROUPS.length}`).toContain(`/ ${LESSON_GROUPS.length}`);
    page.unmount();
  });

  it("⑤ 闸自检：判据能真的区分（未学过时不显示，学过时必须显示）", () => {
    // 反例：空数据 → 不该有
    resetStorage();
    seedAppData(makeAppData({}) as AppData);
    const empty = mountStats();
    const emptyText = empty.text();
    empty.unmount();
    // 正例：有数据 → 该有
    resetStorage();
    seedAppData(seeded([grammarLessons[0].id]));
    const withData = mountStats();
    const withText = withData.text();
    withData.unmount();
    // 两次渲染都非空（证明差异来自数据而非渲染失败）
    expect(emptyText.length).toBeGreaterThan(50);
    expect(withText.length).toBeGreaterThan(50);
    // 判据确实区分了两者
    expect(emptyText.includes("语法阶梯"), "空数据不该显示").toBe(false);
    expect(withText.includes("语法阶梯"), "有数据该显示").toBe(true);
  });
});
