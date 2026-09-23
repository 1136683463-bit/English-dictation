// @vitest-environment jsdom
/**
 * ENV2d · 日期口径的时区敏感性（2026-09-22 存储环境差异专项）
 *
 * ## 问题
 *
 * 「连胜」「日记分组」「错词本分组」「复习到期」都以 **YYYY-MM-DD 字符串**为键。
 * 这个键有两种算法，混用就会错位：
 *
 *   (A) **本地时区**：`getFullYear/getMonth/getDate`  → 随系统时区走
 *   (B) **UTC**：`toISOString().slice(0,10)`          → 恒定，不看时区
 *
 * 项目里两种都有（见下表）。跨时区旅行、或系统时区被改之后：
 *   - 同一时刻在 (A) 与 (B) 下可能落在**不同的日期**；
 *   - 用 (B) 存进去的键、用 (A) 去查，当天就会「查不到自己的记录」；
 *   - 反过来 (A) 存 (B) 查同理。
 *
 * 本文件把每种口径的调用点固定成可回归的断言，并量化错位窗口有多大。
 *
 * ## 时区切换的手法
 *
 * vitest 在 node 侧运行测试代码，`process.env.TZ` 可以**在进程内**改且立即生效
 * （已实测：Asia/Shanghai → America/New_York 后 `getTimezoneOffset` 从 -480 变 300）。
 * 但 `vitest.config` 没有固定 TZ，所以本文件不假设宿主机时区，
 * 每个用例都先显式设好 TZ，结束后恢复。
 */
import { afterEach, describe, expect, it } from "vitest";
import {
  computeStreak,
  computeStreakWithGrace,
  dayKey,
  startOfLocalWeek
} from "../../services/statsService";
import { localDateKey, collectLearningDateKeys } from "../../services/learningTelemetry";
import { pickDailyDiaryQuestions, summarizeDiaryProgress } from "../../services/diaryService";
import { getLocalDateKey, formatMistakeDateLabel } from "../../services/mistakeBookService";
import { createInitialSchedule } from "../../services/reviewService";
import type { AppData, Review } from "../../types";

const HOST_TZ = process.env.TZ;

/**
 * 恢复宿主时区。
 *
 * 注意：`process.env.TZ = undefined` 会把**字符串 "undefined"** 赋进去，
 * node 随后按无效时区回退（实测变成 UTC），后续用例全部被污染。
 * 必须用 `delete`。
 */
afterEach(() => {
  if (HOST_TZ === undefined) delete process.env.TZ;
  else process.env.TZ = HOST_TZ;
});

/** 一个「同一天的两个时刻」样本：本地日与 UTC 日**不同**的经典时段。 */
const CROSSOVER_INSTANTS = {
  /** UTC+8 的深夜：本地 9/21 23:30，UTC 仍是 9/21 15:30 —— 两者同一天。 */
  sameInBoth: "2026-09-21T15:30:00.000Z",
  /** UTC+8 的凌晨：本地 9/22 01:00，UTC 还是 9/21 17:00 —— **不同天**。 */
  differsInEast: "2026-09-21T17:00:00.000Z",
  /** UTC-7 的傍晚：本地 9/21 18:00，UTC 已是 9/22 01:00 —— **不同天**。 */
  differsInWest: "2026-09-22T01:00:00.000Z"
};

describe("ENV2d-1 口径清单：哪些地方用本地时区、哪些用 UTC", () => {
  it("本地时区口径（正确的那一类）", () => {
    process.env.TZ = "Asia/Shanghai";
    const instant = CROSSOVER_INSTANTS.differsInEast; // 本地 9/22 01:00

    expect(localDateKey(new Date(instant)), "learningTelemetry.localDateKey 用本地").toBe("2026-09-22");
    expect(getLocalDateKey(instant), "mistakeBookService.getLocalDateKey 用本地").toBe("2026-09-22");
    // statsService.dayKey 用 getFullYear/getMonth/getDate → 本地
    expect(dayKey(new Date(instant)), "statsService.dayKey 用本地").toBe(20260922);
  });

  it("UTC 口径（会错位的那一类）", () => {
    process.env.TZ = "Asia/Shanghai";
    const instant = CROSSOVER_INSTANTS.differsInEast;
    expect(instant.slice(0, 10), "toISOString().slice(0,10) 恒为 UTC 日").toBe("2026-09-21");
    expect(
      localDateKey(new Date(instant)),
      "同一时刻，本地口径给 9/22 —— 两个键相差一天"
    ).toBe("2026-09-22");
  });

  it("错位窗口有多大：东八区是 8 小时，西七区是 7 小时", () => {
    process.env.TZ = "Asia/Shanghai";
    const offsetEast = -new Date().getTimezoneOffset(); // 分钟
    process.env.TZ = "America/Los_Angeles";
    const offsetWest = -new Date().getTimezoneOffset();

    expect(offsetEast / 60, "东八区 +8h").toBe(8);
    expect(offsetWest / 60 + 8, "洛杉矶夏令时 -7h（跨时区相差 15 小时）").toBe(1);

    /**
     * 含义：在东八区，每天 00:00–08:00 这 8 小时里，
     * 「本地日」比「UTC 日」**超前一天**。这段时间写下来的 UTC 键
     * 会被归到昨天。（该项目主力用户在 UTC+8。）
     */
    console.log(
      `\n[ENV2d] 错位窗口：UTC+8 下每天 00:00–08:00（共 8 小时）本地日比 UTC 日超前一天；\n` +
        `  洛杉矶（夏令时）下每天 17:00–24:00（共 7 小时）本地日比 UTC 日落后一天。`
    );
  });
});

describe("ENV2d-2 连胜（streak）：口径一致，跨时区会重排但不永久错位", () => {
  const reviewAt = (iso: string): Review => ({
    id: iso,
    cardId: "c1",
    mode: "spelling",
    rating: 4,
    answer: "x",
    reviewedAt: iso
  });

  it("连胜全部走本地口径（computeStreak / computeStreakWithGrace / collectLearningDateKeys）", () => {
    process.env.TZ = "Asia/Shanghai";
    const reviews = [reviewAt(CROSSOVER_INSTANTS.differsInEast)]; // 本地 9/22
    const now = new Date("2026-09-22T10:00:00.000Z"); // 本地 9/22 18:00

    expect(computeStreak(reviews, now), "今天学过 → 连胜 1").toBe(1);
    expect(computeStreakWithGrace(reviews, now).streak).toBe(1);
    expect(collectLearningDateKeys({ reviews } as never), "活动日键为本地 9/22").toEqual(["2026-09-22"]);
  });

  it("同一份数据在另一个时区重算 → 归属日变化，连胜数字随之变化", () => {
    const reviews = [reviewAt(CROSSOVER_INSTANTS.differsInEast)]; // 上海 9/22 01:00 = 洛杉矶 9/21 10:00
    const now = new Date("2026-09-21T18:00:00.000Z"); // 上海 9/22 02:00 = 洛杉矶 9/21 11:00

    process.env.TZ = "Asia/Shanghai";
    const shanghaiDays = collectLearningDateKeys({ reviews } as never);
    const shanghaiStreak = computeStreak(reviews, now);

    process.env.TZ = "America/Los_Angeles";
    const laDays = collectLearningDateKeys({ reviews } as never);
    const laStreak = computeStreak(reviews, now);

    console.log(
      `\n[ENV2d] 同一条复习记录在两地归属不同：\n` +
        `  上海：${JSON.stringify(shanghaiDays)}（连胜 ${shanghaiStreak}）\n` +
        `  洛杉矶：${JSON.stringify(laDays)}（连胜 ${laStreak}）`
    );

    expect(shanghaiDays, "上海归 9/22").toEqual(["2026-09-22"]);
    expect(laDays, "洛杉矶归 9/21 —— 同一条记录，不同的一天").toEqual(["2026-09-21"]);
    /**
     * 注意：这里两边的连胜都是 1，因为 now 也随之平移。
     * 真正会「掉连胜」的是**用户在飞行途中跨过时区**：
     * 系统时区变了而复习记录的时间戳没变，于是原本连续的两天变成同一天（反之亦然）。
     */
    expect(shanghaiStreak, "单条记录不至于掉连胜").toBe(1);
    expect(laStreak).toBe(1);
  });

  it("跨时区旅行会让「连续两天」塌成一天（连胜 -1）", () => {
    /**
     * 用户在上海连续两天学习：9/21 23:00 与 9/22 01:00（本地）。
     * 飞往洛杉矶后系统时区变为 UTC-7，这两条记录被重新解释为
     * 9/21 08:00 与 9/21 10:00 —— **同一天**，于是「连续两天」变成「一天」。
     */
    const reviews = [
      reviewAt("2026-09-21T15:00:00.000Z"), // 上海 9/21 23:00 / 洛杉矶 9/21 08:00
      reviewAt("2026-09-21T17:00:00.000Z") // 上海 9/22 01:00 / 洛杉矶 9/21 10:00
    ];

    process.env.TZ = "Asia/Shanghai";
    const shanghai = computeStreak(reviews, new Date("2026-09-22T03:00:00.000Z"));
    process.env.TZ = "America/Los_Angeles";
    const la = computeStreak(reviews, new Date("2026-09-21T18:00:00.000Z"));

    console.log(`\n[ENV2d] 跨时区后连胜重算：上海 ${shanghai} → 洛杉矶 ${la}`);
    expect(shanghai, "上海：两条记录分属 9/21 与 9/22 → 连胜 2").toBe(2);
    expect(la, "洛杉矶：两条记录都落在 9/21 → 连胜 1（用户「掉了一天」）").toBe(1);
  });

  it("周期边界（周一）也走本地时区：同一时刻在两地可能属不同的一周", () => {
    /**
     * 读法注意：`startOfLocalWeek` 返回的是一个 Date（绝对时刻），
     * `getDate()` 在**读取时**才按当前 TZ 解释。
     * 所以每个时区的读数必须在切走之前就取好。
     */
    const instant = new Date("2026-09-22T10:00:00.000Z");

    process.env.TZ = "Asia/Shanghai";
    const shanghaiWeekDay = startOfLocalWeek(instant).getDate();
    process.env.TZ = "America/Los_Angeles";
    const laWeekDay = startOfLocalWeek(instant).getDate();

    expect(shanghaiWeekDay, "上海（9/22 周二）：本周从 9/21 周一 起").toBe(21);
    expect(laWeekDay, "洛杉矶（9/22 周二）：同为 9/21 那一周").toBe(21);

    /** 真正会分叉的是**跨周日/周一的时刻**： */
    const sundayNight = new Date("2026-09-21T02:00:00.000Z"); // 上海 9/21 10:00（周一）/ 洛杉矶 9/20 19:00（周日）

    process.env.TZ = "Asia/Shanghai";
    const shWeekDay = startOfLocalWeek(sundayNight).getDate();
    process.env.TZ = "America/Los_Angeles";
    const laWeekDay2 = startOfLocalWeek(sundayNight).getDate();

    console.log(
      `\n[ENV2d] 同一个绝对时刻（${sundayNight.toISOString()}）的「本周起点」：\n` +
        `  上海（当地 9/21 周一 10:00）→ 本周从 9/${shWeekDay} 起\n` +
        `  洛杉矶（当地 9/20 周日 19:00）→ 本周从 9/${laWeekDay2} 起\n` +
        `  → 周宽限日的计数窗口随之改变（跨时区后「本周还剩几次宽限」会变）`
    );
    expect(shWeekDay, "上海已进入 9/21 那一周").toBe(21);
    expect(laWeekDay2, "洛杉矶还在 9/14 那一周").toBe(14);
  });
});

describe("ENV2d-3 日记：两套口径共存，凌晨写入会错位", () => {
  it("日记归属走本地时区（summarizeDiaryProgress.todayDateKey）—— 与错词本一致", () => {
    process.env.TZ = "Asia/Shanghai";
    const before = collectLearningDateKeys({ reviews: [] } as never);
    expect(before).toEqual([]);

    /**
     * diaryService.localDateKey（diaryService.ts:8-13）与
     * summarizeDiaryProgress.todayDateKey（126）都用 getFullYear/getMonth/getDate。
     * 这是**模块内的私有函数**，不导出，所以这里用同口径复算来固定结论：
     * 日记的归属日 = 本地日。
     */
    const instant = CROSSOVER_INSTANTS.differsInEast; // 上海 9/22 01:00
    const localDay = localDateKey(new Date(instant));
    expect(localDay, "日记按本地日归到 9/22").toBe("2026-09-22");

    const progress = summarizeDiaryProgress({ diaryEntries: [] } as unknown as AppData);
    expect(progress.todayDateKey, "汇总函数返回的今日键同样是本地日").toBe(localDateKey(new Date()));
  });

  it("但抽题种子用了 UTC 日 → 凌晨换题的时间点与「今日」不符", () => {
    process.env.TZ = "Asia/Shanghai";
    /**
     * GrammarDiaryPage.tsx:80 用 `new Date().toISOString().slice(0, 10)` 作为
     * pickDailyDiaryQuestions 的种子；而页面标题/今日条数用
     * summarizeDiaryProgress 的 todayDateKey（本地，diaryService.ts:126）。
     *
     * 在东八区，每天 00:00–08:00 这两个日期**不同**，
     * 于是「今天写的日记」与「今天抽到的题」分属两个日期键。
     */
    const morningLocal = "2026-09-21T17:00:00.000Z"; // 上海 9/22 01:00
    const utcSeedKey = morningLocal.slice(0, 10);
    const localKey = localDateKey(new Date(morningLocal));

    expect(utcSeedKey, "抽题种子取 UTC 日").toBe("2026-09-21");
    expect(localKey, "日记归属取本地日").toBe("2026-09-22");
    expect(utcSeedKey, "两者在凌晨不同 → 抽题与归属错位").not.toBe(localKey);

    const picksForUtc = pickDailyDiaryQuestions(utcSeedKey, 3).map((question) => question.id);
    const picksForLocal = pickDailyDiaryQuestions(localKey, 3).map((question) => question.id);
    console.log(
      `\n[ENV2d] 日记抽题错位（UTC+8 凌晨）：\n` +
        `  种子 2026-09-21（UTC 日）：${JSON.stringify(picksForUtc)}\n` +
        `  种子 2026-09-22（本地日）：${JSON.stringify(picksForLocal)}\n` +
        `  → 同一时刻两套键抽出的题不同；用户凌晨看到的题与「今天」不一致`
    );
    expect(picksForUtc, "两套键确实抽出不同的题").not.toEqual(picksForLocal);
  });

  it("跨时区后，历史日记的日期标签会整体偏移（「今天」认不出来）", () => {
    /**
     * 读法注意：`formatMistakeDateLabel` 的判定依赖**调用时的系统时区**，
     * 所以每个时区的读数必须在切走之前取好（否则打印的是最后那个时区的解释）。
     */
    const instant = "2026-09-21T15:30:00.000Z";

    process.env.TZ = "Asia/Shanghai";
    // 录入：上海 9/21 23:30 写的一篇日记，dateKey 按本地存为 2026-09-21
    const writtenKey = getLocalDateKey(instant);
    const labelInShanghai = formatMistakeDateLabel(writtenKey, new Date(instant));
    expect(writtenKey, "录入时按上海本地日").toBe("2026-09-21");

    process.env.TZ = "America/Los_Angeles"; // 洛杉矶 9/21 08:30
    const labelInLa = formatMistakeDateLabel(writtenKey, new Date(instant));

    process.env.TZ = "Pacific/Kiritimati"; // UTC+14 → 当地已是 9/22 05:30
    const labelInKiritimati = formatMistakeDateLabel(writtenKey, new Date(instant));

    console.log(
      `\n[ENV2d] 同一条日记（键 ${writtenKey}）在不同时区下的标签：\n` +
        `  上海        → ${labelInShanghai}\n` +
        `  洛杉矶      → ${labelInLa}\n` +
        `  基里巴斯    → ${labelInKiritimati}\n` +
        `  → 键是绝对的，但「是不是今天」按当前系统时区算：跨时区后历史条目的相对日期整体挪位`
    );

    expect(labelInShanghai, "上海：仍是今天").toBe("今天");
    expect(labelInLa, "洛杉矶：同为今天（当地 9/21）").toBe("今天");
    expect(
      labelInKiritimati,
      "基里巴斯（UTC+14）：那条日记已不是「今天」——用户看到的历史日期整体前移一天"
    ).toBe("昨天");
  });
});

describe("ENV2d-4 复习到期：排期用绝对时间戳，不受时区影响；但「今天到期」的展示按本地日", () => {
  it("排期游标是 ISO 时间戳（绝对时间）→ 跨时区不错位", () => {
    const schedule = createInitialSchedule("card-1");
    expect(
      new Date(schedule.nextReviewAt).getTime(),
      "初始排期是一个绝对时刻，与时区无关"
    ).toBeGreaterThan(0);
    /** 初始计划是「立即到期」：intervalDays = 0，nextReviewAt = 建卡那一刻。 */
    expect(schedule.intervalDays, "初始间隔为 0（立即到期）").toBe(0);
    expect(schedule.reviewCount, "尚未复习").toBe(0);
    /** 关键：落盘的是**绝对时刻**（ISO），不是日期字符串 —— 所以排期本身跨时区不变。 */
    expect(schedule.nextReviewAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("「未来 N 天到期」预测按本地日分桶 —— 跨时区后同一张卡的归属日会变", () => {
    /**
     * statsService.getDueForecast 用 startOfLocalDay(nextReviewAt) 分桶
     * （statsService.ts:652-662）。绝对时刻不变，但落在哪一天随本地日边界走。
     */
    const dueAt = "2026-09-21T17:00:00.000Z"; // 上海 9/22 01:00 / 洛杉矶 9/21 10:00
    process.env.TZ = "Asia/Shanghai";
    const shanghaiDay = localDateKey(new Date(dueAt));
    process.env.TZ = "America/Los_Angeles";
    const laDay = localDateKey(new Date(dueAt));

    expect(shanghaiDay, "上海：这张卡算 9/22 到期").toBe("2026-09-22");
    expect(laDay, "洛杉矶：同一张卡算 9/21 到期").toBe("2026-09-21");
    console.log(
      `\n[ENV2d] 同一张卡（${dueAt}）的「到期日」：上海 ${shanghaiDay} / 洛杉矶 ${laDay}\n` +
        `  → 绝对时间没错，但用户眼里的日期差一天（跨时区后预测图的柱子会挪位）`
    );
  });
});

describe("ENV2d-5 冒险会话日：UTC 口径，与「今日」不一致", () => {
  it("AdventurePlayPage.tsx:512 用 UTC 日做会话去重键", () => {
    process.env.TZ = "Asia/Shanghai";
    const instant = CROSSOVER_INSTANTS.differsInEast; // 上海 9/22 01:00
    const sessionKey = `adventure-session-days:adv-1:${instant.slice(0, 10)}`;

    expect(sessionKey, "会话键里的日期是 UTC 日 9/21").toBe("adventure-session-days:adv-1:2026-09-21");
    expect(
      localDateKey(new Date(instant)),
      "而用户眼里的「今天」是 9/22 —— 凌晨这 8 小时里两者不同"
    ).toBe("2026-09-22");

    /** 影响：凌晨这 8 小时里，同一「本地日」的第二次进入会被判成 replay（重玩），
     *  而用户看到的是同一天 —— 会话统计口径与用户感知不一致。 */
  });
});
