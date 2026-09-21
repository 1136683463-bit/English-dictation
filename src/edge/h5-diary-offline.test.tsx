// @vitest-environment jsdom
/**
 * H5 · 日记的离线与降级
 *
 * 核心问题：AI 未配置 / 配置了但请求失败，都不能阻塞「写日记 → 保存」这条核心链路。
 * 另外验批改结果（issues / recast / followUp）能否渲染，以及空提交的温和处理。
 */
import { describe, expect, it, beforeEach } from "vitest";
import { mountPage, resetStorage } from "./harness";
import { clickElement, flushAsync, setInputValue } from "./verify/drive";
import { aiSettings, currentData, installResizeObserverStub, makeDiaryEntry, seedAppData, seedWithSettings, stubFetch } from "./huntDiaryEnv";
import GrammarDiaryPage from "../pages/GrammarDiaryPage";
import { huntCases } from "../data/huntCases";

const batchButton = (page: ReturnType<typeof mountDiary>) =>
  (Array.from(page.container.querySelectorAll("button")) as HTMLButtonElement[]).find((button) =>
    (button.textContent ?? "").includes("批改")
  ) as HTMLButtonElement;

const mountDiary = () => mountPage(<GrammarDiaryPage />, "/grammar/diary", "/grammar/diary");

const typeFirst = (page: ReturnType<typeof mountDiary>, value: string) => {
  const areas = Array.from(page.container.querySelectorAll("textarea")) as HTMLTextAreaElement[];
  setInputValue(areas[0], value);
};

const correctionPayload = (over: Record<string, unknown> = {}) =>
  JSON.stringify({
    corrected: "I went to the park yesterday.",
    recast: "Yesterday I headed to the park.",
    issues: [{ original: "go", correction: "went", explanation: "昨天的事用过去式。", tag: "tense" }],
    followUp: "公园里你最喜欢做什么？",
    ...over
  });

describe("H5 日记的离线与降级", () => {
  beforeEach(() => resetStorage());
  installResizeObserverStub();

  it("AI 未配置：写日记能正常保存为 pending，并给出「配置后可自动批改」的说明", async () => {
    seedAppData();
    const page = mountDiary();
    expect(page.has("写下就会自动批改")).toBe(true); // 引导卡
    typeFirst(page, "I am happy today.");
    clickElement(batchButton(page));
    await flushAsync();

    const entries = currentData().diaryEntries;
    expect(entries.length).toBe(1);
    expect(entries[0].status).toBe("pending");
    expect(entries[0].answerEn).toBe("I am happy today.");
    expect(entries[0].correctedEn).toBe("");
    expect(entries[0].issues).toEqual([]);

    const text = page.text();
    expect(text).toContain("已保存。去设置里配置 AI 后，写下即可自动批改。");
    expect(text).toContain("都写下来了。"); // 批次小结，不是挫败话术
    page.unmount();
  });

  it("保存后的日记立刻出现在「以前写下的句子」区域，且标为待批改", async () => {
    seedAppData();
    const page = mountDiary();
    typeFirst(page, "I drink tea every morning.");
    clickElement(batchButton(page));
    await flushAsync();
    const text = page.text();
    expect(text).toContain("以前写下的句子");
    expect(text).toContain("共 1 条");
    expect(text).toContain("待批改");
    expect(text).toContain("I drink tea every morning.");
    expect(text).toContain("已写条数1");
    page.unmount();
  });

  it("AI 已配置但请求抛错（网络/CORS）：句子仍然保存，界面给出可重试的温和说明", async () => {
    seedWithSettings({}, aiSettings());
    const restore = stubFetch({ throwError: "Load failed" });
    const page = mountDiary();
    typeFirst(page, "I go to the park yesterday.");
    clickElement(batchButton(page));
    await flushAsync();
    await flushAsync();
    await flushAsync();

    const entries = currentData().diaryEntries;
    expect(entries.length).toBe(1);
    expect(entries[0].status).toBe("pending"); // 未批改但已保存
    expect(entries[0].answerEn).toBe("I go to the park yesterday.");

    const text = page.text();
    expect(text).toContain("1 句暂未批改成功");
    expect(text).toContain("句子已保存");
    // 原始错误信息会透出（Load failed），但不出现「错误」二字的挫败话术
    expect(text).not.toMatch(/错误/);
    page.unmount();
    restore();
  });

  it("AI 返回非 JSON（中转站回 HTML）：安全降级为 pending，不崩", async () => {
    seedWithSettings({}, aiSettings());
    const restore = stubFetch({ rawText: "<html>502 Bad Gateway</html>" });
    const page = mountDiary();
    typeFirst(page, "Hello world.");
    clickElement(batchButton(page));
    await flushAsync();
    await flushAsync();
    await flushAsync();

    expect(page.has("我的英文日记")).toBe(true);
    const entries = currentData().diaryEntries;
    expect(entries.length).toBe(1);
    expect(entries[0].status).toBe("pending");
    expect(page.text()).toContain("模型没有返回可解析的 JSON。");
    page.unmount();
    restore();
  });

  it("AI 返回 HTTP 500：安全降级，界面不崩", async () => {
    seedWithSettings({}, aiSettings());
    const restore = stubFetch({ status: 500, rawText: JSON.stringify({ error: { message: "上游超时" } }) });
    const page = mountDiary();
    typeFirst(page, "Hello world.");
    clickElement(batchButton(page));
    await flushAsync();
    await flushAsync();
    await flushAsync();
    expect(page.has("我的英文日记")).toBe(true);
    expect(currentData().diaryEntries[0].status).toBe("pending");
    console.log("[H5] HTTP500 提示：", page.text().slice(page.text().indexOf("Hello world."), page.text().indexOf("Hello world.") + 80));
    page.unmount();
    restore();
  });

  it("AI 成功：issues / recast / followUp 三块都在界面上渲染，并写入存储", async () => {
    seedWithSettings({}, aiSettings());
    const restore = stubFetch({ content: correctionPayload() });
    const page = mountDiary();
    typeFirst(page, "I go to the park yesterday.");
    clickElement(batchButton(page));
    await flushAsync();
    await flushAsync();

    const text = page.text();
    expect(text).toContain("批改完成——这句和它的问题点已排进复习队列。");
    expect(text).toContain("更地道的写法");
    expect(text).toContain("Yesterday I headed to the park.");
    expect(text).toContain("go → went");
    expect(text).toContain("昨天的事用过去式。");
    expect(text).toContain("时态变形"); // tag chip
    expect(text).toContain("再多说一句");
    expect(text).toContain("公园里你最喜欢做什么？");
    expect(text).toContain("共 1 处小调整。");

    const entry = currentData().diaryEntries[0];
    expect(entry.status).toBe("done");
    expect(entry.correctedEn).toBe("I went to the park yesterday.");
    expect(entry.followUp).toBe("公园里你最喜欢做什么？");
    expect(entry.issues.length).toBe(1);
    // 有问题的句子自动进语法复习队列
    const cards = currentData().cards.filter((card) => card.sourceId === `diary:${entry.id}`);
    expect(cards.length).toBe(1);
    expect(cards[0].tags).toContain("语法");
    page.unmount();
    restore();
  });

  it("AI 返回 recast 与 corrected 相同 → 不显示重复的「更地道的写法」", async () => {
    seedWithSettings({}, aiSettings());
    const restore = stubFetch({
      content: correctionPayload({ corrected: "I am happy.", recast: "I am happy.", issues: [], followUp: "" })
    });
    const page = mountDiary();
    typeFirst(page, "I am happy.");
    clickElement(batchButton(page));
    await flushAsync();
    await flushAsync();
    const text = page.text();
    expect(text).toContain("全部一次到位，太厉害了。");
    expect(text).not.toContain("更地道的写法");
    expect(text).not.toContain("再多说一句");
    // 无 issues 的句子不进复习队列（不占配额）
    expect(currentData().cards.filter((card) => (card.sourceId ?? "").startsWith("diary:")).length).toBe(0);
    page.unmount();
    restore();
  });

  it("空日记提交：批改按钮保持禁用，不会为空内容发起批改", () => {
    seedAppData();
    const page = mountDiary();
    expect(batchButton(page).disabled).toBe(true);
    expect(batchButton(page).textContent).toContain("写完了一起批改");
    // 只有空白字符同样禁用
    typeFirst(page, "   \n\t  ");
    expect(batchButton(page).disabled).toBe(true);
    page.unmount();
  });

  it("空内容不会写进存储（不产生空条目）", async () => {
    seedAppData();
    const page = mountDiary();
    typeFirst(page, "   ");
    clickElement(batchButton(page));
    await flushAsync();
    expect(currentData().diaryEntries).toEqual([]);
    page.unmount();
  });

  it("同一天同一问题重复写：覆盖更新而非新增（并记录 isRewrite 埋点）", async () => {
    seedAppData();
    const page = mountDiary();
    typeFirst(page, "First version.");
    clickElement(batchButton(page));
    await flushAsync();
    expect(currentData().diaryEntries.length).toBe(1);

    typeFirst(page, "Second version.");
    clickElement(batchButton(page));
    await flushAsync();
    const entries = currentData().diaryEntries;
    expect(entries.length).toBe(1);
    expect(entries[0].answerEn).toBe("Second version.");

    const events = (JSON.parse(window.localStorage.getItem("grammar-telemetry-events-v1") ?? "{}").events ?? []) as Array<{
      kind: string;
      isRewrite: boolean;
    }>;
    const writes = events.filter((event) => event.kind === "diary_write");
    expect(writes.length).toBe(2);
    expect(writes[0].isRewrite).toBe(false);
    expect(writes[1].isRewrite).toBe(true);
    page.unmount();
  });

  it("无问题的句子不显示「加入复习队列」按钮（2026-09-20 已修：不再假承诺）", async () => {
    /**
     * 修复前：按钮无条件渲染，而 addDiarySentenceToReview 对 issues 为空的句子直接返回，
     * 用户点了会看到「已在复习队列」、埋点照记，但 cards 数为 0。
     * 现在：无可入队内容时不显示该按钮。
     */
    seedAppData({
      diaryEntries: [
        makeDiaryEntry({ id: "diary-no-issue", correctedEn: "Thank you for the dinner.", answerEn: "Thank you for the dinner.", issues: [], status: "done" })
      ]
    });
    const page = mountDiary();
    expect(page.has("加入复习队列"), "无 issues 时不应显示该按钮").toBe(false);
    page.unmount();
  });

  it("「加入复习队列」对「有问题的句子」是诚实有效的（正例，避免误伤）", async () => {
    seedAppData({
      diaryEntries: [
        {
          id: "entry-with-issues",
          dateKey: "2024-01-01",
          questionId: "q1",
          questionZh: "问",
          answerEn: "I happy.",
          correctedEn: "I am happy.",
          issues: [{ original: "I happy", correction: "I am happy", explanation: "少了一个 am。", tag: "missing_be" }],
          status: "done",
          createdAt: "2024-01-01T00:00:00.000Z"
        }
      ]
    });
    const page = mountDiary();
    const button = (Array.from(page.container.querySelectorAll("button")) as HTMLButtonElement[]).find((item) =>
      (item.textContent ?? "").includes("复习队列")
    ) as HTMLButtonElement;
    const cardsBefore = currentData().cards.length;
    clickElement(button);
    await flushAsync();
    expect(currentData().cards.length).toBe(cardsBefore + 1);
    const card = currentData().cards.find((item) => item.sourceId === "diary:entry-with-issues");
    expect(card?.front).toBe("I am happy."); // 用批改后的句子
    expect(card?.tags).toContain("语法");
    page.unmount();
  });

  it("日记页的整页文本不含「正确/错误/做错/答错」等挫败话术（红线）", async () => {
    const today = new Date();
    const key = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    seedAppData({
      diaryEntries: [
        {
          id: "e1",
          dateKey: key,
          questionId: "q1",
          questionZh: "你现在的心情怎么样？",
          answerEn: "I happy.",
          correctedEn: "I am happy.",
          issues: [{ original: "I happy", correction: "I am happy", explanation: "少了一个 am。", tag: "missing_be" }],
          status: "done",
          note: "Load failed",
          followUp: "今天开心吗？",
          createdAt: "2024-01-01T00:00:00.000Z"
        }
      ]
    });
    const page = mountDiary();
    const text = page.text();
    for (const word of ["正确", "错误", "做错", "答错", "失败了"]) {
      expect(text, `日记页出现「${word}」`).not.toContain(word);
    }
    page.unmount();
  });

  it("批改强度设置被读取（gentle / standard / strict 都不崩）", async () => {
    for (const style of ["gentle", "standard", "strict"] as const) {
      resetStorage();
      seedWithSettings({}, { ...aiSettings(), diaryCorrectionStyle: style });
      const restore = stubFetch({ content: correctionPayload() });
      const page = mountDiary();
      typeFirst(page, "I go to the park.");
      clickElement(batchButton(page));
      await flushAsync();
      await flushAsync();
      expect(currentData().diaryEntries[0].status).toBe("done");
      page.unmount();
      restore();
    }
  });

  it("huntCases 数据可被本套件复用（跨页依赖未被破坏）", () => {
    // 日记页的 issue.tag 词表来自 huntService，这里守一次跨页依赖的完整性
    expect(huntCases.length).toBeGreaterThan(0);
  });
});
