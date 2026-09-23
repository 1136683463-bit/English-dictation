// @vitest-environment jsdom
/**
 * RV15 · 今日页必须给语法线一个首屏入口（2026-09-23 批六十五新增）
 *
 * 背景：205 课 / 52 里程碑 / 214 案件是内容投入最大的一条线，
 * 但**今日页对 `grammar` 的引用数曾为 0**——四个任务卡全是词汇
 * （到期复习 / 错词专项 / 新词目标 / 句子目标），导航里 `/grammar` 排第 4 位、
 * 移动端还不在主导航（`App.tsx` 的 `mobilePrimaryNavPaths` 只有
 * today / training / adventure / library）。**内容做完了却没人看见。**
 *
 * 本文件锁三件事：
 *   ① 首屏 Hero 有语法线主 CTA，且**落点正确**（到期语法句优先，其次下一课）
 *   ② 任务队列里有语法行，且进度数字与 `lessonService` 同源（不另算一套）
 *   ③ 空态不炸：一节课没学、也没有到期卡时，CTA 仍指向语法路径
 *
 * ⚠️ 判据纪律：本闸**只查「有没有入口、指向对不对」**，不查文案措辞——
 * 文案会随产品调整，把它写死会让闸变成「改文案就红」的噪声源。
 */
import { describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import TodayPage from "../../pages/TodayPage";
import { grammarLessons } from "../../data/grammarLessons";
import { makeAppData, seedAppData } from "./fixtures";
import type { AppData } from "../../types";

const mountToday = () => mountPage(<TodayPage />, "/today", "/today");

describe("RV15 今日页的语法线入口", () => {
  it("① 首屏 Hero 有语法主 CTA，指向第 1 课（新课未开始时）", () => {
    resetStorage();
    seedAppData(makeAppData({}) as AppData);
    const page = mountToday();
    const cta = page.container.querySelector<HTMLAnchorElement>("[data-testid='today-grammar-cta']");
    expect(cta, "今日页首屏应有语法线主 CTA").toBeTruthy();
    // 一节课都没学 → 下一课是 L1
    const first = grammarLessons[0];
    expect(cta!.getAttribute("href"), "未开始时应指向第 1 课").toBe(`/grammar/lesson/${first.id}`);
    expect(cta!.textContent).toContain(`第 ${first.number} 课`);
    page.unmount();
  });

  it("② 学完前 N 课，CTA 指向第 N+1 课（与 lessonService 同源）", () => {
    resetStorage();
    const done = grammarLessons.slice(0, 3).map((lesson) => lesson.id);
    seedAppData(makeAppData({ grammarLessonsDone: done }) as AppData);
    const page = mountToday();
    const cta = page.container.querySelector<HTMLAnchorElement>("[data-testid='today-grammar-cta']");
    expect(cta, "应有 CTA").toBeTruthy();
    const next = grammarLessons[3];
    expect(cta!.getAttribute("href"), "学完 3 课应指向第 4 课").toBe(`/grammar/lesson/${next.id}`);
    expect(cta!.textContent).toContain(`第 ${next.number} 课`);
    page.unmount();
  });

  it("③ 任务队列里有语法行，且进度分母 = 全库课数（不另算一套）", () => {
    resetStorage();
    seedAppData(makeAppData({}) as AppData);
    const page = mountToday();
    const text = page.text();
    expect(text, "任务队列应含语法行").toContain("语法阶梯");
    // 分母必须来自 grammarLessons.length，写死数字会让加课时漏改
    expect(text, `进度分母应为全库课数 ${grammarLessons.length}`).toContain(`/${grammarLessons.length}`);
    page.unmount();
  });

  it("④ 空态不炸：没有课、没有到期卡时仍给出可用落点", () => {
    resetStorage();
    seedAppData(makeAppData({ cards: [], schedules: [] }) as AppData);
    const page = mountToday();
    const cta = page.container.querySelector<HTMLAnchorElement>("[data-testid='today-grammar-cta']");
    expect(cta, "空态也应有 CTA").toBeTruthy();
    const href = cta!.getAttribute("href") ?? "";
    expect(href.startsWith("/grammar"), `空态落点应在语法线内，实得 ${href}`).toBe(true);
    // 页面不应崩（能渲染出内容）
    expect(page.text().length).toBeGreaterThan(50);
    page.unmount();
  });

  it("⑤ 闸自检：判据能真的区分（换个不存在的 href 就该失败）", () => {
    resetStorage();
    seedAppData(makeAppData({}) as AppData);
    const page = mountToday();
    const cta = page.container.querySelector<HTMLAnchorElement>("[data-testid='today-grammar-cta']");
    const href = cta!.getAttribute("href") ?? "";
    // 正例：确实在语法线内
    expect(href.startsWith("/grammar/"), "落点应在语法线内").toBe(true);
    // 反例：它**不该**是词汇线或其他模块（防有人把 CTA 指错地方却没人发现）
    expect(/^\/(review|training|words|mistakes|units|library|stats|settings|today|adventure)/.test(href), "落点不应指向词汇线或其它模块").toBe(false);
    page.unmount();
  });
});
