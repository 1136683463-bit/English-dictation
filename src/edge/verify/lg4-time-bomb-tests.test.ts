// @vitest-environment node
/**
 * LG4 · 找出「会自己坏掉」的测试（2026-09-22）
 *
 * 本轮修 `grammarWeakSpotsService.test.ts` 时发现它是一条**时间炸弹**：
 * 事件时间戳写死 `2026-09-21`，而弱点评分含「半衰期 7 天」的时间衰减、
 * 对着**真实当下**计算。于是随着真实日期流逝，权重越来越小，
 * 断言 `> 1.2` 在 2026-09-22 就衰减到 1.17 而失败——今天通过、明天可能失败。
 *
 * 这个文件把「同类风险」找出来并固化：
 * 凡是**同时**满足以下两点的测试文件，都属于高危：
 *   ① 写死了绝对时间戳（如 "2026-09-21T10:00:00Z"）
 *   ② 被测代码里含随时间衰减/比较的逻辑（半衰期、since、isBetween、Date.now 差）
 *
 * 注意：本测试只做**静态风险扫描**（找组合特征），不判定某条断言一定错了——
 * 有些写死日期的测试是安全的（例如只验证排序或纯格式化）。
 * 它的价值是给出「可疑清单」，让后续改动能集中复核。
 */
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

// process.cwd()（vitest 从仓库根启动），不写死本机绝对路径——
// 与 rv18-doc-references.test.ts:35 同一约定（2026-09-24 修）。
const SRC = join(process.cwd(), "src");

const walk = (dir: string, out: string[] = []): string[] => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.test\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
};

/** 含「时间衰减/相对当下比较」逻辑的服务模块。 */
const TIME_SENSITIVE_SERVICES = [
  "grammarWeakSpotsService",
  "grammarOutputService",
  "statsService",
  "dailyDirectiveService",
  "grammarReviewService",
  "reviewService",
  "grammarTelemetry",
  "spellingQueueService",
  "dynamicBookService"
];

/**
 * 人工复核过的「写死近期日期但安全」文件（R09 加入）。
 *
 * 复核标准：文件里的时间敏感函数是否**每次都被显式传入 `now`/`instant`**。
 * 传了就意味着结果不依赖真实当下，写死的日期只是确定性的夹具，不会衰减。
 */
const REVIEWED_SAFE = new Map<string, string>([
  [
    join(SRC, "edge/verify/env2d-timezone.test.ts"),
    "时区专项：所有时间敏感调用都显式注入 now/instant（computeStreak(reviews, now)、"
      + "localDateKey(new Date(instant)) 等），写死的日期是确定性夹具而非「当下」；"
      + "它验证的是「同一绝对时刻在不同时区落到哪一天」，与真实日期无关。"
  ]
]);

describe("LG4 时间炸弹风险扫描", () => {
  it("真正危险的是「写死**近期**日期 + 时间衰减」——这种组合应为 0", () => {
    const files = walk(SRC);
    const today = new Date();
    const dangerous: string[] = [];

    for (const file of files) {
      const source = readFileSync(file, "utf-8");
      const imports = TIME_SENSITIVE_SERVICES.filter((name) => source.includes(`services/${name}"`));
      if (imports.length === 0) continue;

      /**
       * 区分两类写死的日期：
       *  - 「远古哨兵」（如 2024-01-01 表示「早就到期了」）：安全，衰减后趋近 0，
       *    断言通常不依赖它的具体权重大小。
       *  - 「近期日期」（距今天不足 60 天）：**危险**——它会被当成「刚发生的事」，
       *    但衰减是相对真实当下算的，每过一天值就变一点，断言阈值迟早失配。
       */
      const stamps = source.match(/"(20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d[^"]*)"/g) ?? [];
      for (const raw of stamps) {
        const iso = raw.slice(1, -1);
        const ageDays = (today.getTime() - new Date(iso).getTime()) / 86_400_000;
        // 允许「未来日期」（哨兵，如 2099）与「远古日期」（>60 天前）
        if (ageDays >= 0 && ageDays < 60) {
          if (REVIEWED_SAFE.has(file)) continue;
          dangerous.push(`${file.replace(SRC, "src")} — ${iso}（${ageDays.toFixed(0)} 天前）依赖 [${imports.join(", ")}]`);
        }
      }
    }

    /**
     * 复核过的例外：这些文件确实写死了近期日期，但**已确认不会随时间失效**。
     *
     * 加进来之前必须逐条核对「时间是否被显式注入」——静态扫描看不出这一点，
     * 所以这里存的是人工复核的结论，不是豁免。列表本身也受断言保护（见下个用例）。
     */
    const reviewedStillExists = [...REVIEWED_SAFE.keys()].filter((file) => !files.includes(file));
    expect(reviewedStillExists, "例外清单里有已删除的文件，请清理").toEqual([]);

    expect(
      dangerous,
      `以下测试把「近期日期」写死并用于时间敏感逻辑——它们会随真实日期流逝而失效：\n${dangerous.join("\n")}`
    ).toEqual([]);
  });

  it("已确认修好的那条：grammarWeakSpotsService.test.ts 不再写死「近几天」的时间戳", () => {
    const source = readFileSync(join(SRC, "services/grammarWeakSpotsService.test.ts"), "utf-8");
    /**
     * 修复前：`ts: "2026-09-21T10:00:00.000Z"` 配合半衰期 7 天的衰减
     * → 每过一天权重就小一点，某天开始断言失败。
     * 修复后：用 `justNow()` 相对时间，永远「刚刚发生」，不受真实日期影响。
     */
    expect(source, "应改用相对时间辅助").toContain("const justNow");
    expect(
      /ts: "2026-09-\d\dT/.test(source),
      "不应再有写死的 2026-09 时间戳（那会随真实日期衰减）"
    ).toBe(false);
  });
});
