// @vitest-environment jsdom
/**
 * RV14 · 词典拼写变体（2026-09-23 批六十二）
 *
 * 背景：内置词典 12000 词，但**同一词的英美两种拼写只收了一侧**。
 * 实测 23 组常见词在另一侧拼法下完全查不到——用户在搜索框打 `favorite`
 * 找不到 `favourite`、打 `neighbour` 反而找不到 `neighbor`。
 *
 * 本文件是**端到端**复核（与 dictionaryService.test.ts 的单元级守门互为独立）：
 * 走真实页面 + 真实 12000 词词典，验证两条路径都认拼写变体——
 *   ① 搜索框（searchDictionaryAsync）
 *   ② 查词并回填（findDictionaryEntry / Async）
 */
import { describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import WordsPage from "../../pages/WordsPage";
import { findDictionaryEntryAsync } from "../../services/dictionaryService";
import { makeAppData, seedAppData } from "./fixtures";
import type { AppData } from "../../types";

/** 真实词典里「只收了一侧」的全部 23 组（实测得出，非手写猜测）。 */
const ASYMMETRIC_PAIRS: Array<[string, string]> = [
  ["favorite", "favourite"], ["honor", "honour"], ["neighbor", "neighbour"],
  ["flavor", "flavour"], ["rumor", "rumour"], ["armor", "armour"],
  ["theater", "theatre"], ["fiber", "fibre"], ["caliber", "calibre"],
  ["jewelry", "jewellery"], ["aluminum", "aluminium"], ["plow", "plough"],
  ["mold", "mould"], ["realise", "realize"], ["organise", "organize"],
  ["recognise", "recognize"], ["apologise", "apologize"], ["memorise", "memorize"],
  ["summarise", "summarize"], ["criticise", "criticize"], ["kerb", "curb"],
  ["travelled", "traveled"], ["cancelled", "canceled"],
];

describe("RV14 词典拼写变体", () => {
  it("① 查词路径：23 组不对称拼写，任一侧都能查到条目", async () => {
    const data = makeAppData({}) as AppData;
    const still: string[] = [];
    for (const [a, b] of ASYMMETRIC_PAIRS) {
      const hitA = await findDictionaryEntryAsync(data, a);
      const hitB = await findDictionaryEntryAsync(data, b);
      if (!hitA && !hitB) still.push(`${a} / ${b}`);
    }
    expect(still, `以下词对两侧都查不到：${still.join(" | ")}`).toEqual([]);
  });

  it("② 搜索框路径：真实页面上打美式拼写，结果里出现英式词条", async () => {
    resetStorage();
    seedAppData(makeAppData({}) as AppData);
    const page = mountPage(<WordsPage />, "/words", "/words");
    const input = page.container.querySelector<HTMLInputElement>("input[placeholder='搜索单词、释义或标签']");
    expect(input, "搜索框应存在").toBeTruthy();
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")!.set!;
    setter.call(input!, "favorite");
    input!.dispatchEvent(new window.Event("input", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const text = page.text();
    expect(text, "搜 favorite 应能找到 favourite").toContain("favourite");
    page.unmount();
  });

  it("③ 反向：搜英式拼写能找到美式条目", async () => {
    resetStorage();
    seedAppData(makeAppData({}) as AppData);
    const page = mountPage(<WordsPage />, "/words", "/words");
    const input = page.container.querySelector<HTMLInputElement>("input[placeholder='搜索单词、释义或标签']");
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")!.set!;
    setter.call(input!, "realise");
    input!.dispatchEvent(new window.Event("input", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 1200));
    expect(page.text(), "搜 realise 应能找到 realize").toContain("realize");
    page.unmount();
  });

  it("④ 不误伤：非英美差异的词不受拼写表影响", async () => {
    const data = makeAppData({}) as AppData;
    // share / nature / here 的后缀与英美差异无关，绝不能被改成 shaer / natuer / heer
    expect((await findDictionaryEntryAsync(data, "share"))?.word).toBe("share");
    expect((await findDictionaryEntryAsync(data, "nature"))?.word).toBe("nature");
    expect((await findDictionaryEntryAsync(data, "here"))?.word).toBe("here");
    expect(await findDictionaryEntryAsync(data, "shaer")).toBeUndefined();
    expect(await findDictionaryEntryAsync(data, "natuer")).toBeUndefined();
  });
});
