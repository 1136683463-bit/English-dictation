// @vitest-environment node
/**
 * MG9 · 更高版本的备份要明确告警（2026-09-22 修）
 *
 * 迁移管线是白名单：未知字段会被静默丢弃。若备份来自**更新的**应用版本，
 * 用户看到的却只是一句「已自动迁移到当前版本」——他会以为一切正常。
 * 现在这种情况给的是明确的「更新版本、部分内容无法保留」提示。
 */
import { describe, expect, it } from "vitest";
import { APP_SCHEMA_VERSION, parseBackupJson, summarizeStartupRepairs } from "../../services/storage";

const backup = (version: number, extra: Record<string, unknown> = {}) =>
  JSON.stringify({ schemaVersion: version, cards: [], seededWordVersions: ["core-100-v1"], ...extra });

describe("MG9 版本方向识别", () => {
  it("旧版本 → 报「已自动迁移」", () => {
    const old = backup(Math.max(1, APP_SCHEMA_VERSION - 1));
    const migrated = parseBackupJson(old);
    const repairs = summarizeStartupRepairs(old, migrated);
    expect(repairs.some((item) => item.includes("已自动迁移")), `实际：${repairs.join(" | ")}`).toBe(true);
    expect(repairs.some((item) => item.includes("更新的版本")), "旧版本不应报「更新的版本」").toBe(false);
  });

  it("新版本 → 报「来自更新的版本」+ 说明部分内容无法保留", () => {
    const future = backup(APP_SCHEMA_VERSION + 1, { futureFeature: { hello: "world" } });
    const migrated = parseBackupJson(future);
    const repairs = summarizeStartupRepairs(future, migrated);
    const notice = repairs.find((item) => item.includes("更新的版本"));
    expect(notice, `实际：${repairs.join(" | ")}`).toBeTruthy();
    expect(notice).toContain("无法保留");
    expect(notice, "应提示升级应用").toContain("升级");
  });

  it("同版本 → 不产生版本相关告警", () => {
    const same = backup(APP_SCHEMA_VERSION);
    const repairs = summarizeStartupRepairs(same, parseBackupJson(same));
    expect(repairs.some((item) => item.includes("迁移") || item.includes("更新的版本"))).toBe(false);
  });

  it("未来字段确实会被丢弃（告警不是多余的）", () => {
    const future = backup(APP_SCHEMA_VERSION + 5, { futureFeature: { hello: "world" } });
    const migrated = parseBackupJson(future) as unknown as Record<string, unknown>;
    expect(migrated.futureFeature, "未知字段会被白名单丢掉——所以告警是必要的").toBeUndefined();
  });
});
