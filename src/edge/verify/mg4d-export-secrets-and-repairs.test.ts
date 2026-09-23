// @vitest-environment jsdom
/**
 * MG4-d · 导出内容的安全性 + 启动修复诊断文案的正确性（2026-09-22）
 *
 * 两个问题：
 *  1) 安全：`exportJson` 直接 stringify 整个 AppData，而 Settings.aiProvider.apiKey 与
 *     Settings.dataSync.token 都在里面。设置页却写着「API Key 只保存在本机」。
 *     用户把备份发给别人 / 传到公开仓库 / 交给客服排障时，密钥就一起走了。
 *  2) 诊断：`summarizeStartupRepairs` 的文案数字，是否与迁移实际改动一致。
 */
import { describe, expect, it } from "vitest";
import type { AppData } from "../../types";
import { exportAnkiCsv, exportJson, exportMarkdown } from "../../services/exportService";
import { APP_SCHEMA_VERSION, parseBackupJson, summarizeStartupRepairs } from "../../services/storage";
import { makeAppData } from "./fixtures";
import { deepDiff } from "./mg4a-backup-roundtrip.test";

const withSecrets = (): AppData =>
  makeAppData({
    seededWordVersions: ["core-100-v1"],
    cards: [
      {
        id: "card_1",
        type: "word",
        front: "approach",
        back: "方法",
        note: "",
        tags: [],
        status: "review",
        priority: false,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      }
    ],
    // 只给需要的两个嵌套对象：这份数据会被 JSON 序列化后走迁移管线，
    // 不需要满足 Settings 的完整类型（其余字段由迁移补默认值）。
    settings: {
      aiProvider: {
        enabled: true,
        baseUrl: "https://api.my-relay.example/v1",
        apiKey: "sk-live-SUPERSECRET-0123456789",
        model: "gpt-4o-mini",
        temperature: 0.7,
        timeoutMs: 120000,
        fallbackToLocal: true
      },
      dataSync: { enabled: true, baseUrl: "https://sync.my-server.example", token: "MY-SYNC-SECRET-TOKEN" }
    }
  });

/* ── 5. 导出安全性 ────────────────────────────────────────────────────── */

describe("MG4-d 导出内容安全性（2026-09-22 已修：导出时抹掉本机凭据）", () => {
  it("导出的 JSON **不含**明文 API Key 与云同步令牌", () => {
    const json = exportJson(withSecrets());

    const hasApiKey = json.includes("sk-live-SUPERSECRET-0123456789");
    const hasSyncToken = json.includes("MY-SYNC-SECRET-TOKEN");
    const hasRelayHost = json.includes("api.my-relay.example");

    // eslint-disable-next-line no-console
    console.log(
      `[导出安全] 含 API Key=${hasApiKey} 含云同步 token=${hasSyncToken} 含中转站地址=${hasRelayHost}\n` +
        `  出现位置（apiKey 行）: ${json
          .split("\n")
          .filter((line) => line.includes("SUPERSECRET") || line.includes("MY-SYNC-SECRET"))
          .map((line) => line.trim())
          .join(" | ")}`
    );

    /**
     * 修复前：这三条全为 true——备份文件里是明文密钥，
     * 而设置页写着「API Key 只保存在本机」。现在导出前抹掉这两处凭据。
     * 中转站地址仍会带出（它不是密钥，且恢复后要能看出原本连的是哪里）。
     */
    expect(hasApiKey, "备份不应包含明文 API Key").toBe(false);
    expect(hasSyncToken, "备份不应包含云同步令牌").toBe(false);
    expect(hasRelayHost, "中转站地址可以保留（不是密钥）").toBe(true);
  });

  it("导出内容 = 全量 AppData，没有任何字段级脱敏", () => {
    const data = withSecrets();
    const json = exportJson(data);
    const parsed = JSON.parse(json) as AppData;

    // 现在导出会**精确地**只抹掉两个凭据字段，其余字段逐字保留
    const diff = deepDiff(data, parsed);
    // deepDiff 返回 DiffRow[]（带 path 字段），不是字符串数组
    const offenders = diff.filter(
      (row) => !/apiKey$/.test(row.path) && !/dataSync\.token$/.test(row.path)
    );
    expect(
      offenders.map((row) => `${row.path}: ${JSON.stringify(row.input)} → ${JSON.stringify(row.output)}`),
      "除两个凭据字段外不应有其它差异"
    ).toEqual([]);
    expect(parsed.settings.aiProvider.apiKey, "apiKey 应被抹掉").toBe("");
    expect(parsed.settings.dataSync.token, "token 应被抹掉").toBe("");
    expect(parsed.settings.aiProvider.baseUrl, "中转站地址保留").toBe("https://api.my-relay.example/v1");
  });

  it("导入别人分享的备份，不会把对方的 Key 装进本机（反向泄露面已封）", () => {
    const restored = parseBackupJson(exportJson(withSecrets()));
    // 导出的备份已脱敏，所以导入后本机不会凭空获得别人的密钥
    expect(restored.settings.aiProvider.apiKey, "不应把对方的 Key 装进来").toBe("");
    expect(restored.settings.dataSync.enabled, "非凭据设置照常恢复").toBe(true);
    expect(restored.settings.dataSync.baseUrl, "同步地址照常恢复").toBe("https://sync.my-server.example");
  });

  it("其他导出格式（Anki CSV / Markdown）不含密钥——泄露面仅限 JSON 备份", () => {
    const data = withSecrets();
    expect(exportAnkiCsv(data)).not.toContain("SUPERSECRET");
    expect(exportMarkdown(data)).not.toContain("SUPERSECRET");
  });
});

/* ── 4. 启动修复诊断文案 ──────────────────────────────────────────────── */

/**
 * 一份「必然被修复」的老数据：
 *  - schemaVersion 5（旧）
 *  - 1 条找不到卡片的复习记录
 *  - 1 个找不到材料的句段
 *  - 1 张缺 masteredAt 的 mastered 卡（会被补，但报告不追踪它）
 *  - 1 张非 mastered 卡带 masteredAt（会被归 null，报告也不追踪）
 */
const buildLegacyDirtyData = (): Record<string, unknown> => ({
  schemaVersion: 5,
  seededWordVersions: ["core-100-v1"],
  unitGroups: [],
  units: [],
  cards: [
    {
      id: "card_ok",
      type: "word",
      front: "approach",
      back: "方法",
      note: "",
      tags: [],
      status: "mastered",
      priority: false,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z"
      // 缺 masteredAt：迁移会补 updatedAt
    },
    {
      id: "card_wrong_masteredAt",
      type: "word",
      front: "context",
      back: "上下文",
      note: "",
      tags: [],
      status: "review",
      priority: false,
      masteredAt: "2024-05-05T00:00:00.000Z",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z"
    }
  ],
  wordDetails: [],
  sentenceDetails: [],
  materials: [
    {
      id: "material_1",
      title: "材料一",
      type: "text",
      content: "A practical approach matters.",
      sourceUrl: "",
      tags: [],
      createdAt: "2024-01-01T00:00:00.000Z"
    }
  ],
  materialSegments: [
    { id: "segment_ok", materialId: "material_1", index: 0, text: "A practical approach matters.", createdAt: "2024-01-01T00:00:00.000Z" },
    // 孤儿句段
    { id: "segment_orphan", materialId: "material_gone", index: 0, text: "Orphan sentence.", createdAt: "2024-01-01T00:00:00.000Z" }
  ],
  reviews: [
    {
      id: "review_ok",
      cardId: "card_ok",
      mode: "spelling",
      rating: 4,
      answer: "approach",
      diffJson: "[]",
      reviewedAt: "2024-01-02T00:00:00.000Z"
    },
    // 孤儿复习记录
    {
      id: "review_orphan",
      cardId: "card_vanished",
      mode: "recall",
      rating: 3,
      answer: "",
      diffJson: "[]",
      reviewedAt: "2024-01-03T00:00:00.000Z"
    }
  ],
  mistakeGenerations: [],
  adventures: [],
  huntAttempts: [],
  huntResults: [],
  grammarLessonsDone: [],
  diaryEntries: [],
  schedules: [],
  dictionaryEntries: [],
  languageGates: [],
  gateAttempts: [],
  runeStates: [],
  settings: {}
});

describe("MG4-d 启动修复诊断文案是否正确", () => {
  it("旧 schema + 孤儿记录：文案条目数与实际清理数一致", () => {
    const raw = buildLegacyDirtyData();
    const rawJson = JSON.stringify(raw);
    const migrated = parseBackupJson(rawJson);
    const repairs = summarizeStartupRepairs(rawJson, migrated);

    // eslint-disable-next-line no-console
    console.log(`[修复报告] 共 ${repairs.length} 条：\n` + repairs.map((item) => `  - ${item}`).join("\n"));

    // 实际发生的事：症状类 3 类（schema / 复习 / 句段）+ 字段级修复若干
    const rows = deepDiff(raw, migrated as unknown as Record<string, unknown>);
    const symptomRows = rows.filter(
      (row) =>
        row.path.startsWith("reviews") ||
        row.path.startsWith("materialSegments") ||
        row.path.startsWith("schemaVersion")
    );
    // eslint-disable-next-line no-console
    console.log(
      `[实际 diff] 共 ${rows.length} 行；症状类（reviews/materialSegments/schemaVersion）${symptomRows.length} 行：\n` +
        symptomRows.map((row) => `  - ${row.path} ${row.kind} ${JSON.stringify(row.input)} → ${JSON.stringify(row.output)}`).join("\n")
    );

    expect(repairs.length, "应报告 schema 升级 + 复习清理 + 句段清理 = 3 条").toBe(3);
    expect(repairs.some((item) => item.includes("v5") && item.includes(`v${APP_SCHEMA_VERSION}`))).toBe(true);
    expect(repairs.some((item) => item.includes("1 条无效复习记录"))).toBe(true);
    expect(repairs.some((item) => item.includes("1 个无效句段"))).toBe(true);
  });

  it("报告**漏报**字段级修复：masteredAt 补写与归 null 不计入", () => {
    const raw = buildLegacyDirtyData();
    const rawJson = JSON.stringify(raw);
    const migrated = parseBackupJson(rawJson);
    const repairs = summarizeStartupRepairs(rawJson, migrated);
    const rows = deepDiff(raw, migrated as unknown as Record<string, unknown>);

    const fieldRows = rows.filter((row) => row.path.startsWith("cards["));
    // eslint-disable-next-line no-console
    console.log(
      `[字段级修复] ${fieldRows.length} 行（未出现在报告里）：\n` +
        fieldRows.map((row) => `  - ${row.path} ${row.kind} ${JSON.stringify(row.input)} → ${JSON.stringify(row.output)}`).join("\n")
    );

    expect(fieldRows.length, "迁移确实改写了卡片字段").toBeGreaterThan(0);
    expect(
      repairs.some((item) => item.includes("masteredAt")),
      "字段级修复（masteredAt 补写/归 null）没有出现在「修复了 N 类历史问题」里"
    ).toBe(false);
    // 关键：报告的数字是「类」而不是「项」，实际被改字段数远大于 3
    expect(rows.length, "实际改动行数远大于报告的 3").toBeGreaterThan(repairs.length);
  });

  it("干净数据：报告为空（不误报）", () => {
    const clean = makeAppData({ seededWordVersions: ["core-100-v1"] });
    const json = exportJson(clean);
    const migrated = parseBackupJson(json);
    const repairs = summarizeStartupRepairs(json, migrated);
    // eslint-disable-next-line no-console
    console.log(`[干净数据] 报告条目 = ${JSON.stringify(repairs)}`);
    expect(repairs).toEqual([]);
  });

  it("孤儿复习记录条数文案：3 条孤儿时数字应为 3", () => {
    const raw = buildLegacyDirtyData();
    raw.reviews = [
      { id: "r1", cardId: "gone_1", mode: "recall", rating: 3, answer: "", diffJson: "[]", reviewedAt: "2024-01-03T00:00:00.000Z" },
      { id: "r2", cardId: "gone_2", mode: "recall", rating: 3, answer: "", diffJson: "[]", reviewedAt: "2024-01-03T00:00:00.000Z" },
      { id: "r3", cardId: "gone_3", mode: "recall", rating: 3, answer: "", diffJson: "[]", reviewedAt: "2024-01-03T00:00:00.000Z" }
    ];
    const rawJson = JSON.stringify(raw);
    const migrated = parseBackupJson(rawJson);
    const repairs = summarizeStartupRepairs(rawJson, migrated);
    const reviewLine = repairs.find((item) => item.includes("复习记录"));
    // eslint-disable-next-line no-console
    console.log(`[3 条孤儿] "${reviewLine}"`);
    expect(reviewLine, "应报 3 条").toContain("3 条无效复习记录");
  });

  it("孤儿句段只在「找不到材料」时报；材料被合法删除后的残留句段也算孤儿", () => {
    const raw = buildLegacyDirtyData();
    raw.materialSegments = [
      { id: "s1", materialId: "material_1", index: 0, text: "keep me", createdAt: "2024-01-01T00:00:00.000Z" },
      { id: "s2", materialId: "material_1", index: 1, text: "keep me too", createdAt: "2024-01-01T00:00:00.000Z" }
    ];
    const rawJson = JSON.stringify(raw);
    const migrated = parseBackupJson(rawJson);
    const repairs = summarizeStartupRepairs(rawJson, migrated);
    // eslint-disable-next-line no-console
    console.log(`[无孤儿句段] ${JSON.stringify(repairs)}`);
    expect(repairs.some((item) => item.includes("句段")), "没有孤儿句段时不该报句段").toBe(false);
  });
});
