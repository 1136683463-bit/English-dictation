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
 *   ① 语法线有固定入口，且**落点正确**（到期语法句优先，其次下一课）
 *   ② 该入口的进度数字与 `lessonService` 同源（不另算一套）
 *   ③ 空态不炸：一节课没学、也没有到期卡时，入口仍指向语法路径
 *
 * ⚠️ 判据纪律：本闸**只查「有没有入口、指向对不对、三处数据源是否同源」**，
 * 不查文案措辞——文案会随产品调整，把它写死会让闸变成「改文案就红」的噪声源。
 *
 * ── 2026-09-24 首页重规划对锚点的影响（重要，勿当成放水）────────────────
 * 语法线的固定入口锚点 `today-grammar-cta` 从 **Hero 的 action 槽**移到了
 * **「三线走到哪了」区块的语法行**（`TodayPage` 的 `.today-line-row`）。原因：
 * 重规划后 Hero 的主 CTA 允许指向任意一条线（由 `homeDirectiveService` 决策），
 * 语法线不再恒占主 CTA，所以「语法线的固定入口」需要一个不随推荐变化的锚点。
 *
 * ① ② ③ ④ 的**断言一字未改**（指向第 N 课、含「语法阶梯」与 `/205`、空态落在语法线内），
 * 只改了 ① ② 两条的**用例标题**（原标题写着「首屏 Hero」，移位置后已不属实，
 * 留着会误导下一个人）。第 ⑤ 条则**升级**为「三处同源」判据，见该用例内的说明。
 * 新位置在 DOM 顺序上比原先的任务队列第 5 行**更靠前**，不是降级。
 */
import { describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import TodayPage from "../../pages/TodayPage";
import { grammarLessons } from "../../data/grammarLessons";
import { lineOfPath } from "../../services/homeDirectiveService";
import { makeAppData, seedAppData } from "./fixtures";
import type { AppData } from "../../types";

const mountToday = () => mountPage(<TodayPage />, "/today", "/today");

describe("RV15 今日页的语法线入口", () => {
  it("① 语法线有固定入口，指向第 1 课（新课未开始时）", () => {
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

  it("② 学完前 N 课，入口指向第 N+1 课（与 lessonService 同源）", () => {
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

  it("⑤ 闸自检：主 CTA / 落点 / 说明行三条数据源同源，且检测器真的能区分", () => {
    resetStorage();
    seedAppData(makeAppData({}) as AppData);
    const page = mountToday();
    const cta = page.container.querySelector<HTMLAnchorElement>("[data-testid='today-primary-cta']");
    expect(cta, "今日页应有主 CTA").toBeTruthy();
    const line = cta!.getAttribute("data-line");
    const href = cta!.getAttribute("href") ?? "";
    const note = page.container.querySelector<HTMLElement>("[data-testid='today-cta-note']");

    /**
     * 判据从「落点必须在语法线内」升级为「三处必须同源」——**这是升级，不是放宽**：
     * 旧判据在改造后必然为假（首页重规划后主 CTA 允许指向任意一条线），
     * 但它锁的其实只是「谁是首屏主角」这个当时的产品选择，而不是「文案与按钮是否自相矛盾」
     * 这个真正的缺陷。真实数据下改造前的 Hero 会渲染成「建议可以推进新词」+ 按钮「继续第 1 课」
     * ——推荐词汇、按钮开语法，而旧判据对它**完全无感**。新判据能抓到这个错配。
     */
    expect(["vocab", "grammar", "adventure"], "data-line 必须是三条线之一").toContain(line);
    expect(lineOfPath(href), `落点 ${href} 必须属于 data-line 声明的线`).toBe(line);
    expect(note, "应有「为什么是它」说明行").toBeTruthy();
    expect(note!.getAttribute("data-line"), "说明行必须与主 CTA 同线").toBe(line);

    // ── 错配检测器自检：判据必须能真的失败（正例为真、反例为假、未知路径不得被悄悄归类） ──
    expect(lineOfPath("/grammar/lesson/l1"), "语法落点应判为 grammar").toBe("grammar");
    expect(lineOfPath("/adventure/adv-1"), "冒险落点应判为 adventure").toBe("adventure");
    expect(lineOfPath("/training"), "训练落点应判为 vocab").toBe("vocab");
    expect(lineOfPath("/adventure/adv-1") !== "grammar", "跨线落点必须被判为错配").toBe(true);
    expect(lineOfPath("/training") !== "grammar", "跨线落点必须被判为错配").toBe(true);
    expect(lineOfPath("/nonsense"), "无法归属的路径必须为 null，否则错配会被放行").toBe(null);
    page.unmount();
  });
});
