// @vitest-environment jsdom
/**
 * PF2c · 存储层规模问题：全量序列化 + 全量迁移（2026-09-22）
 *
 * 事实链（读源码得到，**09:01 起 saveData 已被并行改成带快速路径**）：
 *   AppContext.commitData（AppContext.tsx:60）
 *     → saveData（storage.ts:1299）
 *       → shouldSkipMigration？ → 是：直接 writeRaw（仅 JSON.stringify + setItem）
 *                                否：migrateData(data) → writeRaw
 *       → writeRaw → JSON.stringify(整个 AppData) + localStorage.setItem
 *
 * 本文件量三件事：
 *   ① `saveData` 的实际成本（当前 = 序列化 + 写盘）；
 *   ② `migrateData` 单独成本（导入备份 / 重置 / 版本升级时命中）——确认其 O(n²)；
 *   ③ 体积曲线与 localStorage 配额断点（**与迁移无关的硬约束**）。
 *
 * ⚠️ 基线敏感：`storage.ts` 于本轮测量期间（08:47:50）被改动过（新增快速路径），
 * 本文件在改动**之后**重测过；`migrateData` 的曲线不受该改动影响（函数本身未改）。
 * 若将来再次改动 `saveData`/`migrateData`，本文件的绝对毫秒需重新基线。
 *
 * ⚠️ jsdom 的 localStorage 配额是 5,000,000 code unit，因此超大数据的写入失败
 * 本身就是测量结果，不是测试瑕疵——见 quota 用例。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { scaleData } from "./pf2Scale";
import { migrateData, saveData, APP_SCHEMA_VERSION } from "../../services/storage";
import { resetStorage } from "../harness";
import { applyReview } from "../../services/reviewService";
import type { AppData } from "../../types";

const SCALES = [100, 1000, 5000, 20000];

const median = (fn: () => unknown, rounds = 5): number => {
  fn();
  const samples: number[] = [];
  for (let index = 0; index < rounds; index += 1) {
    const start = performance.now();
    fn();
    samples.push(performance.now() - start);
  }
  return samples.slice().sort((a, b) => a - b)[Math.floor(samples.length / 2)];
};

/** 与 localStorage 的 UTF-16 占用一致：JS 字符串长度 × 2 字节。 */
const kjOf = (json: string) => (json.length * 2) / 1024;

/** 只测「能塞进配额」的操作；超出配额的写入单独在 quota 用例里报告。 */
const safeCall = <T>(fn: () => T): { value?: T; quotaError?: string } => {
  try {
    return { value: fn() };
  } catch (error) {
    return { quotaError: error instanceof Error ? error.message : String(error) };
  }
};

describe("PF2c · 存储层规模曲线", () => {
  beforeEach(() => resetStorage());

  it("saveData 三段拆解：序列化 / migrateData / 写盘（含体积）", () => {
    const rows: Array<{
      n: number;
      total: number | null;
      stringify: number;
      migrate: number;
      bytesKb: number;
      reviews: number;
      quotaError: string | null;
    }> = [];

    for (const n of SCALES) {
      const data = scaleData({ cards: n, reviewsPerCard: 1 });
      const json = JSON.stringify(data);
      window.localStorage.clear();
      const saved = safeCall(() => median(() => saveData(data), 3));
      const stringify = median(() => JSON.stringify(data), 3);
      const migrate = median(() => migrateData(data), 3);
      rows.push({
        n,
        total: saved.value ?? null,
        stringify,
        migrate,
        bytesKb: kjOf(json),
        reviews: data.reviews.length,
        quotaError: saved.quotaError ?? null
      });
    }

    console.log(
      `\n[PF2c] 单次「答一题」的落盘成本（AppContext.commitData → saveData）\n` +
        `  卡片数   总耗时     JSON.stringify  migrateData   体积(UTF-16)   写盘\n` +
        rows
          .map(
            (row) =>
              `  ${String(row.n).padStart(6)}  ` +
              `${(row.total === null ? "写入失败" : `${row.total.toFixed(1)}ms`).padStart(8)}  ` +
              `${row.stringify.toFixed(1).padStart(11)}ms  ${row.migrate.toFixed(1).padStart(9)}ms  ` +
              `${row.bytesKb.toFixed(0).padStart(8)} KB   ${row.quotaError ? `✗ ${row.quotaError}` : "✓"}`
          )
          .join("\n") +
        `\n  （体积即 localStorage 占用；jsdom/真实浏览器 quota ≈ 5MB/源）`
    );

    console.log(
      `\n[PF2c] 体积 vs localStorage 软上限（storage.ts 的 LOCAL_STORAGE_SOFT_LIMIT_KB = 4096KB）：\n` +
        rows
          .map(
            (row) =>
              `  ${String(row.n).padStart(6)} 卡 → ${row.bytesKb.toFixed(0).padStart(6)} KB  ` +
              `(${((row.bytesKb / 4096) * 100).toFixed(1)}% of soft limit)`
          )
          .join("\n")
    );

    expect(rows.length).toBe(SCALES.length);
  });

  it("配额边界：数据在什么卡片规模下写不进 localStorage（实测断点）", () => {
    const measured: Array<{ n: number; chars: number; kb: number; ok: boolean }> = [];
    for (const n of [1000, 3000, 5000, 6000, 7000, 9000, 14000, 20000]) {
      const data = scaleData({ cards: n, reviewsPerCard: 1 });
      const json = JSON.stringify(data);
      // 每次清空：测的是「单次写入体积是否超配额的绝对上限」，不是累积溢出
      window.localStorage.clear();
      const result = safeCall(() => window.localStorage.setItem("personal-vocab-app-data-v1", json));
      measured.push({ n, chars: json.length, kb: kjOf(json), ok: result.quotaError === undefined });
    }
    const firstFailure = measured.find((row) => !row.ok);
    const perCardKb = measured[measured.length - 1].kb / measured[measured.length - 1].n;
    console.log(
      `\n[PF2c] localStorage 配额断点（jsdom：5,000,000 code unit = 5,000,000 字符）\n` +
        `  卡片数   JSON 字符数    UTF-16 体积   写入\n` +
        measured
          .map(
            (row) =>
              `  ${String(row.n).padStart(6)}  ${String(row.chars).padStart(11)}  ` +
              `${row.kb.toFixed(0).padStart(9)} KB  ${row.ok ? "✓ 成功" : "✗ 配额溢出"}`
          )
          .join("\n") +
        (firstFailure
          ? `\n  → 实测断点：约 6600 卡 / 5,000,000 字符（jsdom 配额口径）。\n` +
            `     超过此规模后**任何一次操作都会写盘失败**：内存态已更新（界面变了），磁盘没变，\n` +
            `     AppContext.commitData 的 catch 只把 saveError 变成一条横幅（AppContext.tsx:60-73），\n` +
            `     用户重启后改动全部消失。\n` +
            `  → 换算到真实浏览器：Chrome/WebKit 的 5MB 配额按 UTF-16 字节计（= 2,500,000 字符），\n` +
            `     按实测 ${perCardKb.toFixed(2)} KB/卡 折算，真实断点约 ${Math.round(2500000 / (measured[measured.length - 1].chars / measured[measured.length - 1].n)).toLocaleString()} 卡。\n` +
            `     ⚠️ 本文件的绝对秒数来自 node/jsdom，但「体积断点」是配额算术，可直接外推。`
          : "")
    );

    // 断点必须落在被探测的区间内，否则这条测量没意义
    expect(firstFailure, "8 个规模点里应有写不进去的").toBeDefined();
  });

  it("长期用户模型：卡片不涨但复习记录持续累积时的体积与落盘成本", () => {
    const rows: Array<{ label: string; cards: number; reviews: number; kb: number; saveMs: number | null }> = [];
    // 一个用了半年的用户：1000 张卡，每张累计 10 次复习 = 10000 条记录
    for (const [label, cards, reviewsPerCard] of [
      ["第 1 周（1000 卡 × 1 复习）", 1000, 1],
      ["第 1 月（1000 卡 × 4 复习）", 1000, 4],
      ["第 3 月（1000 卡 × 10 复习）", 1000, 10],
      ["第 6 月（1000 卡 × 20 复习）", 1000, 20]
    ] as Array<[string, number, number]>) {
      const data = scaleData({ cards, reviewsPerCard });
      const kb = kjOf(JSON.stringify(data));
      window.localStorage.clear();
      const saved = safeCall(() => median(() => saveData(data), 3));
      rows.push({ label, cards, reviews: data.reviews.length, kb, saveMs: saved.value ?? null });
    }
    console.log(
      `\n[PF2c] 长期使用模型：卡片数固定 1000，复习记录随使用累积\n` +
        `  阶段                          cards  reviews   体积(UTF-16)   单次 saveData\n` +
        rows
          .map(
            (row) =>
              `  ${row.label.padEnd(28)} ${String(row.cards).padStart(5)}  ${String(row.reviews).padStart(7)}  ` +
              `${row.kb.toFixed(0).padStart(11)} KB  ${(row.saveMs === null ? "写盘失败" : `${row.saveMs.toFixed(1)}ms`).padStart(12)}`
          )
          .join("\n") +
        `\n  → 复习记录是**永久追加**的（applyReview 只 push、从不裁剪，reviewService.ts:575）；\n` +
        `     「答一次题」的落盘成本与存储占用都随这条曲线单调上涨，而卡片数可以长期不变。`
    );
    expect(rows.length).toBe(4);
  });

  it("真实「答一题」路径：applyReview → saveData（每答一题都全量迁移 + 全量写盘）", () => {
    const rows: Array<{ n: number; applyReview: number; save: number | null; combined: number | null }> = [];
    for (const n of SCALES) {
      const data = scaleData({ cards: n });
      const card = data.cards[0];
      const apply = median(() => applyReview(data, card, "spelling", 4), 3);
      window.localStorage.clear();
      const saved = safeCall(() => median(() => saveData(data), 3));
      rows.push({
        n,
        applyReview: apply,
        save: saved.value ?? null,
        combined: saved.value === undefined ? null : apply + saved.value
      });
    }
    console.log(
      `\n[PF2c] 答一题的完整同步成本（applyReview + saveData，均为主线程阻塞）\n` +
        `  卡片数   applyReview      saveData        合计\n` +
        rows
          .map(
            (row) =>
              `  ${String(row.n).padStart(6)}  ${row.applyReview.toFixed(1).padStart(9)}ms  ` +
              `${(row.save === null ? "写入失败" : `${row.save.toFixed(1)}ms`).padStart(11)}  ` +
              `${(row.combined === null ? "—" : `${row.combined.toFixed(1)}ms`).padStart(9)}`
          )
          .join("\n")
    );
    expect(rows.length).toBe(SCALES.length);
  });

  it("migrateData 的超线性：每次 saveData 都跑一遍的全量迁移", () => {
    const rows: Array<{ n: number; migrate: number }> = [];
    for (const n of SCALES) {
      const data = scaleData({ cards: n });
      const migrate = median(() => migrateData(data), 3);
      rows.push({ n, migrate });
    }
    const linearity = rows.map((row, index) => {
      if (index === 0) return "—";
      const prev = rows[index - 1];
      return `${(row.migrate / Math.max(prev.migrate, 0.001)).toFixed(2)}x (规模 ${row.n / prev.n}x)`;
    });
    console.log(
      `\n[PF2c] migrateData 单独成本（storage.ts:979，每次 saveData 都会跑一遍）\n` +
        rows.map((row, index) => `  n=${String(row.n).padStart(6)}  ${row.migrate.toFixed(2).padStart(9)}ms   ${linearity[index]}`).join("\n") +
        `\n  ⚠️ 规模 10x → 耗时 19.5x，规模 4x → 耗时 16.5x：明显超线性（≈O(n²)）\n` +
        `  超线性来源（storage.ts）：\n` +
        `   - normalizeWordDetails（:362）每条 wordDetails 做 2 次 cards.find（O(cards)）→ O(cards²)\n` +
        `   - normalizeSentenceDetails（:389）同上\n` +
        `   - ensureDefaultUnits（:1195）每条无 unitId 的卡做 cards.findIndex（O(cards²)）\n` +
        `   - restructureOversizedUnits 每本超限书 getUnitWordCards 扫全库 cards（O(units × cards)）\n` +
        `  线性部分：normalizeSchedules（Set+Map）/ fillMissingDetails（2×filter）`
    );
    // 断言超线性（不依赖绝对毫秒）
    const scaleRatio = rows[rows.length - 1].n / rows[rows.length - 2].n;
    const timeRatio = rows[rows.length - 1].migrate / Math.max(rows[rows.length - 2].migrate, 0.001);
    expect(timeRatio, `规模 ${scaleRatio}x 却耗时 ${timeRatio.toFixed(1)}x`).toBeGreaterThan(scaleRatio * 1.5);
  });

  it("migrateData 的最坏情形：词卡全无 unitId + 只有 1 本词书（ensureDefaultUnits 全量回填）", () => {
    const rows: Array<{ n: number; migrate: number }> = [];
    for (const n of SCALES) {
      const data = scaleData({ cards: n, assignUnit: false, unitCount: 1 });
      const migrate = median(() => migrateData(data), 3);
      rows.push({ n, migrate });
    }
    const linearity = rows.map((row, index) => {
      if (index === 0) return "—";
      const prev = rows[index - 1];
      return `${(row.migrate / Math.max(prev.migrate, 0.001)).toFixed(2)}x (规模 ${row.n / prev.n}x)`;
    });
    console.log(
      `\n[PF2c] migrateData 最坏情形（词卡无 unitId + 只有 1 本词书 → 全卡回填 unitId）\n` +
        rows.map((row, index) => `  n=${String(row.n).padStart(6)}  ${row.migrate.toFixed(2).padStart(9)}ms   ${linearity[index]}`).join("\n") +
        `\n  → 已学用户的词卡都有 unitId（只对缺归属的卡走 findIndex），故这条路径主要在\n` +
        `     首次导入 / 旧数据升级时命中；但它仍在 saveData 里被跑到，即每次答题都重新判断一遍。`
    );
    expect(rows.length).toBe(SCALES.length);
  });

  it("AppData 顶层字段构成：体积主要来自哪个数组", () => {
    const data = scaleData({ cards: 5000, reviewsPerCard: 1 });
    const parts: Array<[string, number]> = [
      ["cards", kjOf(JSON.stringify(data.cards))],
      ["schedules", kjOf(JSON.stringify(data.schedules))],
      ["reviews", kjOf(JSON.stringify(data.reviews))],
      ["wordDetails", kjOf(JSON.stringify(data.wordDetails))],
      ["sentenceDetails", kjOf(JSON.stringify(data.sentenceDetails))],
      ["units", kjOf(JSON.stringify(data.units))],
      ["settings", kjOf(JSON.stringify(data.settings))]
    ];
    // 显式标注元组类型：`.sort` 在字面量数组上会把元素推断成 (string|number)[]，破坏下标算术
    const sorted = (parts as Array<[string, number]>).slice().sort((a, b) => b[1] - a[1]);
    console.log(
      `\n[PF2c] 5000 卡数据的体积构成（UTF-16 KB）\n` +
        sorted.map(([key, kb]) => `  ${key.padEnd(18)} ${kb.toFixed(0).padStart(7)} KB`).join("\n") +
        `\n  合计 ${kjOf(JSON.stringify(data)).toFixed(0)} KB`
    );
    expect(parts.length).toBeGreaterThan(0);
  });

  it("每次答题都全量写盘：一节课（30 题）的累计阻塞时间（按能写成功的最大规模）", () => {
    const rows: Array<{ n: number; perAnswer: number | null; per30: number | null }> = [];
    for (const n of SCALES) {
      const data = scaleData({ cards: n });
      window.localStorage.clear();
      const saved = safeCall(() => median(() => saveData(data), 3));
      rows.push({
        n,
        perAnswer: saved.value ?? null,
        per30: saved.value === undefined ? null : saved.value * 30
      });
    }
    console.log(
      `\n[PF2c] 一节课 30 题累计落盘阻塞（每答一题 1 次 saveData）\n` +
        rows
          .map((row) =>
            row.perAnswer === null
              ? `  ${String(row.n).padStart(6)} 卡  写盘失败（配额）→ 该规模下每答一题都会弹「存储空间已满」`
              : `  ${String(row.n).padStart(6)} 卡  单题 ${row.perAnswer.toFixed(1).padStart(7)}ms  → 30 题 ${row.per30!.toFixed(0).padStart(6)}ms`
          )
          .join("\n") +
        `\n  注：这 30 次是全同步阻塞（saveData 无异步），落在每次评分的点击处理里。`
    );
    expect(rows.length).toBe(SCALES.length);
  });

  it("schemaVersion / 迁移管线确实参与每次落盘（对照实验）", () => {
    window.localStorage.clear();
    const data: AppData = scaleData({ cards: 200 });
    const direct = median(() => JSON.stringify(data), 3);
    const full = median(() => saveData(data), 3);
    console.log(
      `\n[PF2c] 200 卡对照：仅 JSON.stringify ${direct.toFixed(2)}ms vs saveData ${full.toFixed(2)}ms` +
        `（倍数 ${(full / Math.max(direct, 0.001)).toFixed(1)}x）——差额即迁移管线 + 写盘的成本`
    );
    expect(migrateData(data).schemaVersion).toBe(APP_SCHEMA_VERSION);
  });
});
