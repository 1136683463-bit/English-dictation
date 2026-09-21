// @vitest-environment jsdom
/**
 * H6 · 日记边界输入
 *
 * 目标：任何输入都不应崩溃。覆盖超长（1000+ / 5000 字）、纯中文、
 * emoji / 引号 / 换行 / Tab / 零宽字符 / HTML 片段 / 纯标点，
 * 以及「批改返回里含特殊字符」的渲染安全（不得被当 HTML 执行）。
 */
import { describe, expect, it, beforeEach } from "vitest";
import { mountPage, resetStorage } from "./harness";
import { clickElement, flushAsync, setInputValue } from "./verify/drive";
import { aiSettings, currentData, installResizeObserverStub, seedAppData, seedWithSettings, stubFetch } from "./huntDiaryEnv";
import GrammarDiaryPage from "../pages/GrammarDiaryPage";

const mountDiary = () => mountPage(<GrammarDiaryPage />, "/grammar/diary", "/grammar/diary");

const areasOf = (page: ReturnType<typeof mountDiary>) =>
  Array.from(page.container.querySelectorAll("textarea")) as HTMLTextAreaElement[];

const batchButton = (page: ReturnType<typeof mountDiary>) =>
  (Array.from(page.container.querySelectorAll("button")) as HTMLButtonElement[]).find((button) =>
    (button.textContent ?? "").includes("批改")
  ) as HTMLButtonElement;

const EDGE_INPUTS: Array<{ label: string; value: string }> = [
  { label: "超长 1000 字符", value: "I like tea. ".repeat(100) },
  { label: "超长 5000 字符", value: "word ".repeat(1000).trim() },
  { label: "纯中文", value: "我今天很开心，因为天气很好，我和朋友去了公园。" },
  { label: "中英混排", value: "Today 我 very happy，因为 I 吃了 hotpot。" },
  { label: "emoji", value: "I am 😀 happy today 🎉🍜!" },
  { label: "引号与撇号", value: `I said "hello" and it's my mother's book.` },
  { label: "换行与 Tab", value: "I am happy.\nI went home.\tIt was fun." },
  { label: "HTML 片段", value: `<script>alert("x")</script><b>bold</b>` },
  { label: "纯标点", value: "!!!???...,,," },
  { label: "零宽与 BOM", value: "\u200B\uFEFFI am fine.\u200B" },
  { label: "仅换行", value: "\n\n\n" },
  { label: "首尾空白 + 正文", value: "   I am ok.   " }
];

describe("H6 日记边界输入", () => {
  beforeEach(() => resetStorage());
  installResizeObserverStub();

  it("12 种边界输入逐个写入并提交：均不抛错，页面仍可用", async () => {
    for (const { label, value } of EDGE_INPUTS) {
      resetStorage();
      seedAppData();
      const page = mountDiary();
      const area = areasOf(page)[0];
      expect(() => setInputValue(area, value), `${label} 写入抛错`).not.toThrow();
      expect(area.value, `${label} 输入未落到 textarea`).toBe(value);
      expect(() => clickElement(batchButton(page)), `${label} 提交抛错`).not.toThrow();
      await flushAsync();
      expect(page.has("我的英文日记"), `${label} 后页面消失`).toBe(true);
      page.unmount();
    }
  });

  it("只有空白/换行的输入一律视为空，不写存储、按钮保持禁用", async () => {
    for (const value of ["\n\n\n", "   ", "\t", "\u3000", "\u00A0"]) {
      resetStorage();
      seedAppData();
      const page = mountDiary();
      setInputValue(areasOf(page)[0], value);
      expect(batchButton(page).disabled, `「${JSON.stringify(value)}」应视为空`).toBe(true);
      clickElement(batchButton(page));
      await flushAsync();
      expect(currentData().diaryEntries).toEqual([]);
      page.unmount();
    }
  });

  // 已知瑕疵（见报告 P4）：JS 的 String.trim() 不剥零宽空格 U+200B，
  // 所以「只含 U+200B」的输入会被当成有内容，落一条肉眼看不见的日记。
  it("只含零宽空格的输入不被当成内容（2026-09-20 已修）", async () => {
    /**
     * 修复前：JS 的 trim() 不剥 U+200B，只输零宽字符会存下一条肉眼看不见的日记。
     * 现在：写入前用 meaningfulText 剥掉零宽字符，空则拒绝。
     */
    seedAppData({});
    const page = mountDiary();
    const area = areasOf(page)[0];
    setInputValue(area, "\u200B\u200B\uFEFF");
    expect(batchButton(page).disabled, "零宽输入应被视为空（提交按钮禁用）").toBe(true);
    clickElement(batchButton(page));
    await flushAsync();
    expect(currentData().diaryEntries.length, "零宽输入不应落盘").toBe(0);
    page.unmount();
  });

  it("U+FEFF（BOM）与全角空格只输入时被视为空（对照：这两个能正常 trim）", async () => {
    for (const value of ["\uFEFF", "\u3000"]) {
      resetStorage();
      seedAppData();
      const page = mountDiary();
      setInputValue(areasOf(page)[0], value);
      expect(batchButton(page).disabled, `「${JSON.stringify(value)}」应视为空`).toBe(true);
      page.unmount();
    }
  });

  it("超长输入完整落盘（不被截断），状态仍为 pending", async () => {
    seedAppData();
    const long = "I like tea. ".repeat(100); // 1200 字符
    const page = mountDiary();
    setInputValue(areasOf(page)[0], long);
    clickElement(batchButton(page));
    await flushAsync();
    const entry = currentData().diaryEntries[0];
    expect(entry.answerEn).toBe(long.trim());
    expect(entry.answerEn.length).toBe(long.trim().length);
    expect(entry.status).toBe("pending");
    page.unmount();
  });

  it("纯中文输入可保存（应用不强制英文，不拦也不崩）", async () => {
    seedAppData();
    const page = mountDiary();
    setInputValue(areasOf(page)[0], "我今天很开心。");
    clickElement(batchButton(page));
    await flushAsync();
    const entry = currentData().diaryEntries[0];
    expect(entry.answerEn).toBe("我今天很开心。");
    expect(page.text()).toContain("我今天很开心。");
    page.unmount();
  });

  it("emoji / 换行 / 引号在写入存储后原样保留（含换行与 Tab）", async () => {
    seedAppData();
    const value = `I'm 😀 happy.\nShe said "hi".\tBye.`;
    const page = mountDiary();
    setInputValue(areasOf(page)[0], value);
    clickElement(batchButton(page));
    await flushAsync();
    expect(currentData().diaryEntries[0].answerEn).toBe(value);
    page.unmount();
  });

  it("HTML / script 片段以纯文本渲染，不被当 HTML 执行", async () => {
    seedAppData();
    const value = `<script>window.__pwned = true</script><b>bold</b>`;
    const page = mountDiary();
    setInputValue(areasOf(page)[0], value);
    clickElement(batchButton(page));
    await flushAsync();
    expect((window as unknown as { __pwned?: boolean }).__pwned).toBeUndefined();
    // 存储里是原文；DOM 里以文本出现而非元素
    expect(currentData().diaryEntries[0].answerEn).toBe(value);
    expect(page.container.querySelector("article.diary-entry-card b")).toBeNull();
    page.unmount();
  });

  it("12 种边界输入在「AI 已配置且返回问题」时也能走完批改，不崩", async () => {
    for (const { label, value } of EDGE_INPUTS.slice(0, 6)) {
      resetStorage();
      seedWithSettings({}, aiSettings());
      const restore = stubFetch({
        content: JSON.stringify({
          corrected: value.slice(0, 50),
          recast: "A cleaner version.",
          issues: [{ original: "x", correction: "y", explanation: "换一下。", tag: "tense" }],
          followUp: "再多说一句？"
        })
      });
      const page = mountDiary();
      setInputValue(areasOf(page)[0], value);
      clickElement(batchButton(page));
      await flushAsync();
      await flushAsync();
      expect(page.has("我的英文日记"), `${label} 批改后页面消失`).toBe(true);
      const entry = currentData().diaryEntries[0];
      if (entry) expect(["pending", "done"]).toContain(entry.status);
      page.unmount();
      restore();
    }
  });

  it("AI 返回含 emoji / HTML 的批改文本：渲染为纯文本，不执行脚本", async () => {
    seedWithSettings({}, aiSettings());
    const restore = stubFetch({
      content: JSON.stringify({
        corrected: `<img src=x onerror="window.__pwned2=true">I am happy 😀.`,
        recast: "<script>window.__pwned2 = true</script>Much happier.",
        issues: [
          { original: "<b>嗨</b>", correction: "hi", explanation: "换成英文。", tag: "fragment" }
        ],
        followUp: "今天开心吗 😀？"
      })
    });
    const page = mountDiary();
    setInputValue(areasOf(page)[0], "嗨 happy.");
    clickElement(batchButton(page));
    await flushAsync();
    await flushAsync();
    expect((window as unknown as { __pwned2?: boolean }).__pwned2).toBeUndefined();
    expect(page.container.querySelector(".diary-entry-card img")).toBeNull();
    expect(page.text()).toContain("Much happier.");
    expect(page.text()).toContain("今天开心吗 😀？");
    page.unmount();
    restore();
  });

  it("AI 返回超长文本（20k 字符）：不崩，能落盘", async () => {
    seedWithSettings({}, aiSettings());
    const huge = "This is a very long corrected sentence. ".repeat(500); // ≈21k
    const restore = stubFetch({
      content: JSON.stringify({ corrected: huge, recast: "", issues: [], followUp: "" })
    });
    const page = mountDiary();
    setInputValue(areasOf(page)[0], "Short.");
    clickElement(batchButton(page));
    await flushAsync();
    await flushAsync();
    expect(page.has("我的英文日记")).toBe(true);
    expect(currentData().diaryEntries[0].status).toBe("done");
    page.unmount();
    restore();
  });

  it("AI 返回 issues 为非数组/字段缺失：安全忽略，不崩", async () => {
    seedWithSettings({}, aiSettings());
    const restore = stubFetch({
      content: JSON.stringify({ corrected: "I am fine.", issues: "not-an-array", recast: 123, followUp: null })
    });
    const page = mountDiary();
    setInputValue(areasOf(page)[0], "I fine.");
    clickElement(batchButton(page));
    await flushAsync();
    await flushAsync();
    expect(page.has("我的英文日记")).toBe(true);
    const entry = currentData().diaryEntries[0];
    expect(entry.status).toBe("done");
    expect(entry.issues).toEqual([]);
    page.unmount();
    restore();
  });

  it("AI 返回空 corrected：降级为失败路径，原句保留", async () => {
    seedWithSettings({}, aiSettings());
    const restore = stubFetch({ content: JSON.stringify({ corrected: "", issues: [], recast: "", followUp: "" }) });
    const page = mountDiary();
    setInputValue(areasOf(page)[0], "I am fine.");
    clickElement(batchButton(page));
    await flushAsync();
    await flushAsync();
    await flushAsync();
    const entry = currentData().diaryEntries[0];
    expect(entry.answerEn).toBe("I am fine.");
    expect(entry.status).toBe("pending");
    expect(page.text()).toContain("模型没有返回批改后的句子。");
    page.unmount();
    restore();
  });

  it("一次提交多句（3 句同时写）：逐句落盘，批次小结正确", async () => {
    seedAppData();
    const page = mountDiary();
    const areas = areasOf(page);
    expect(areas.length).toBe(3);
    areas.forEach((area, index) => setInputValue(area, `This is sentence number ${index + 1}.`));
    expect(batchButton(page).textContent).toContain("（3 句）");
    clickElement(batchButton(page));
    await flushAsync();
    const entries = currentData().diaryEntries;
    expect(entries.length).toBe(3);
    expect(entries.every((entry) => entry.status === "pending")).toBe(true);
    expect(page.text()).toContain("已保存 3 / 3");
    page.unmount();
  });

  it("条目数很多（120 条）时列表不崩，且显示计数与加载更多", () => {
    seedAppData({
      diaryEntries: Array.from({ length: 120 }, (_, index) => ({
        id: `bulk-${index}`,
        dateKey: "2024-01-01",
        questionId: `q${index}`,
        questionZh: `问题 ${index}`,
        answerEn: `Answer ${index}.`,
        correctedEn: "",
        issues: [],
        status: "pending" as const,
        createdAt: new Date(Date.UTC(2024, 0, 1, 0, 0, index)).toISOString()
      }))
    });
    const page = mountDiary();
    expect(page.has("我的英文日记")).toBe(true);
    expect(page.text()).toContain("共 120 条");
    expect(page.container.querySelectorAll(".diary-entry-card").length).toBe(20);
    expect(page.text()).toContain("加载更多（还有 100 条）");
    page.unmount();
  });

  it("损坏的日记条目（缺字段）被迁移层规整后仍可渲染", () => {
    seedAppData({
      diaryEntries: [
        { id: "broken", dateKey: "2024-01-01" } as never,
        { id: "broken2", dateKey: "2024-01-02", answerEn: "ok", issues: null } as never
      ]
    });
    const page = mountDiary();
    expect(page.has("我的英文日记")).toBe(true);
    console.log("[H6] 迁移后条目：", JSON.stringify(currentData().diaryEntries));
    page.unmount();
  });
});
