// @vitest-environment jsdom
/**
 * R11a · 提交路径的序列化开销（2026-09-23 第 11 轮）
 *
 * ## 为什么要单测这个
 *
 * 第 10 轮的 R10 多窗口修复在第 ③ 条判定里要「本次即将写入的内容」，
 * 我最初写成 `otherWindowSnapshot(serializeForSave(next))` —— 每次都先
 * `JSON.stringify` 一整份数据（几千到几万条记录）。
 *
 * 这是一处**我自己引入的性能回归**：绝大多数提交根本没有别的窗口在写，
 * 前两道判定（读不到 / 与我上次写的一致）就已经返回 null，
 * 那次序列化是白付的。而 `commitData` 是**每次答题都会走**的路径。
 *
 * 修法是把该参数改成**惰性函数**，只在真需要第 ③ 条时才求值。
 * 本文件守住「不白付」这个性质。
 */
import { describe, expect, it } from "vitest";
import { serializeForSave, storageCostBytes } from "../../services/storage";
import { makeAppData } from "./fixtures";

describe("R11a 提交路径的序列化开销", () => {
  it("对照：serializeForSave 本身是贵的（证明惰性化有意义）", () => {
    const data = makeAppData({
      cards: Array.from({ length: 5000 }, (_, i) => ({
        id: `c-${i}`, type: "sentence" as const,
        front: `Sentence number ${i} that the user has been practising.`,
        back: "", note: `第 ${i} 句的中文笔记`, tags: ["语法"],
        status: "review" as const, priority: false,
        createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z"
      }))
    });

    const json = serializeForSave(data);
    const serialized = JSON.stringify(data);

    console.log(
      `\n[R11a] 5000 张卡的序列化成本：\n` +
        `  JSON 长度 ${json.length} 字符\n` +
        `  serializeForSave 与 JSON.stringify 一致：${json === serialized}`
    );
    expect(json, "两者对已归一化数据应逐字一致").toBe(serialized);
    expect(storageCostBytes(json), "含汉字 → 计费翻倍").toBeGreaterThan(json.length);
  });

  it("app 的提交路径把序列化写成惰性（源码级锚定）", async () => {
    /**
     * 这条是**结构性**断言：`otherWindowSnapshot` 的第三个参数必须是
     * 一个箭头函数（惰性），而不是直接调用 `serializeForSave(next)`。
     * 单靠行为测不出来（结果一样，只是慢了），所以按源码固定。
     */
    const { readFileSync } = await import("node:fs");
    const source = readFileSync(`${process.cwd()}/src/AppContext.tsx`, "utf8");

    expect(
      source.includes("otherWindowSnapshot(() => serializeForSave(next)"),
      "序列化必须是惰性的：otherWindowSnapshot(() => serializeForSave(next), baseline)"
    ).toBe(true);
    expect(
      /otherWindowSnapshot\(serializeForSave\(/.test(source),
      "不应存在「直接传序列化结果」的旧写法（每次提交白付一次 JSON.stringify）"
    ).toBe(false);
  });
});
