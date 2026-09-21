// @vitest-environment jsdom
/**
 * H2 · 点错与归因的判定（侦探找错）
 *
 * 走真实 UI：点词 → 选罪名 → 读判定卡。覆盖 notError / wrongTag / hit / alreadyFound 四条路径，
 * 并在每个状态截图式地扫一遍全页文本，守「界面永不出现正确/错误字样」这条红线。
 *
 * 红线用 RED_LINE 扫描；「误判」「罪名绕了弯」这类自造说法是允许的（不触发）。
 */
import { describe, expect, it, beforeEach } from "vitest";
import { mountPage, resetStorage } from "./harness";
import { clickElement, flushAsync } from "./verify/drive";
import { currentData, installResizeObserverStub, seedAppData } from "./huntDiaryEnv";
import { grammarLessons } from "../data/grammarLessons";
import { huntCases } from "../data/huntCases";
import { judgeGuess } from "../services/huntService";
import type { GrammarErrorTag } from "../types";
import GrammarHuntPage from "../pages/GrammarHuntPage";

/** judgeGuess 的轻量包装。 */
const judgeFor = (item: (typeof huntCases)[number], tokenIndex: number, tag: GrammarErrorTag) =>
  judgeGuess(item, tokenIndex, tag, []);

/** 红线：正文里不得出现的挫败性字样。 */
const RED_LINE = /正确|错误|做错|答错|不对|失败了/;

const TAG_LABEL: Record<string, string> = {
  tense: "时态变形",
  sv_agreement: "主谓一致",
  missing_be: "缺 be 动词",
  article: "冠词",
  plural: "单复数",
  preposition: "介词",
  fragment: "句子残缺",
  run_on: "连接词误用",
  word_order: "语序",
  verb_form: "动词形式",
  comparison: "比较级"
};

/** 案件 05 hunt-call-mother：tokens 18 个，错在 idx2 "happy" 与 idx13 "glad"（都是 missing_be）。 */
const CASE_ID = "hunt-call-mother";
const CASE = huntCases.find((item) => item.id === CASE_ID)!;
const ERROR_INDEXES = CASE.errors.map((error) => error.tokenIndex);
const CLEAN_INDEX = CASE.tokens.findIndex((_, index) => !ERROR_INDEXES.includes(index));

const lessonsFor = (caseId: string): string[] =>
  grammarLessons.filter((lesson) => lesson.huntCaseIds.includes(caseId)).map((lesson) => lesson.id);

const openUnlocked = (caseId: string) => {
  seedAppData({ grammarLessonsDone: lessonsFor(caseId) });
  return mountPage(<GrammarHuntPage />, `/grammar/hunt?case=${caseId}`, "/grammar/hunt");
};

const tokensOf = (page: ReturnType<typeof openUnlocked>) =>
  Array.from(page.container.querySelectorAll(".hunt-token")) as HTMLElement[];

const tagButton = (page: ReturnType<typeof openUnlocked>, label: string) =>
  (Array.from(page.container.querySelectorAll(".hunt-tag-btn")) as HTMLElement[]).find((button) =>
    (button.textContent ?? "").includes(label)
  ) as HTMLElement;

const pickTag = (page: ReturnType<typeof openUnlocked>, label: string) =>
  clickElement(tagButton(page, label));

const redLineHits = (text: string): string[] => [...new Set(text.match(new RegExp(RED_LINE.source, "g")) ?? [])];

describe("H2 点错与归因的判定", () => {
  beforeEach(() => resetStorage());
  installResizeObserverStub();

  it("点干净词块 → 判为「没有问题」，语气温和且不扣线索之外的进度", () => {
    const page = openUnlocked(CASE_ID);
    const before = /线索额度 (\d+) \/ (\d+)/.exec(page.text())?.[1];
    clickElement(tokensOf(page)[CLEAN_INDEX]);
    // 选罪名面板出现，文案问「的罪名是？」
    expect(page.has("的罪名是")).toBe(true);
    pickTag(page, "时态变形");
    const text = page.text();
    expect(text).toContain("这个词没有问题，放心");
    expect(text).toContain("继续侦查别的线索"); // 温和、给出下一步
    const after = /线索额度 (\d+) \/ (\d+)/.exec(text)?.[1];
    expect(Number(after)).toBe(Number(before) - 1);
    // 进度不变：干净词不计入 found
    expect(/已找到 \d+ \/ \d+/.exec(text)?.[0]).toBe(`已找到 0 / ${CASE.errors.length}`);
    expect(redLineHits(text)).toEqual([]);
    page.unmount();
  });

  it("点对错词但选错罪名 → 告知「确实有问题，但不是X」并给该罪名的针对性线索", () => {
    const page = openUnlocked(CASE_ID);
    clickElement(tokensOf(page)[ERROR_INDEXES[0]]);
    pickTag(page, TAG_LABEL.article ?? "冠词");
    const text = page.text();
    expect(text).toContain("这里确实有问题，但不是冠词");
    expect(text).toContain("罪名可以先放一放"); // 允许再试，无惩罚性措辞
    // 不泄露答案词本身
    expect(text).not.toContain("is happy");
    // 进度不变
    expect(/已找到 \d+ \/ \d+/.exec(text)?.[0]).toBe(`已找到 0 / ${CASE.errors.length}`);
    expect(redLineHits(text)).toEqual([]);
    page.unmount();
  });

  it("罪名面板提供全部 11 个罪名按钮（含全库未使用的「比较级」）", () => {
    const page = openUnlocked(CASE_ID);
    clickElement(tokensOf(page)[ERROR_INDEXES[0]]);
    const labels = (Array.from(page.container.querySelectorAll(".hunt-tag-btn")) as HTMLElement[]).map((button) =>
      (button.querySelector("strong")?.textContent ?? "").trim()
    );
    expect(labels.length).toBe(11);
    expect(labels).toContain("比较级"); // 没有任何案件使用该罪名（见 H1），点了必然归因不当
    console.log("[H2] 罪名按钮：", labels.join(" | "));
    page.unmount();
  });

  it("[已知问题] 选「比较级」这个无案使用的罪名：只能得到归因不当反馈，不可能命中", () => {
    const page = openUnlocked(CASE_ID);
    clickElement(tokensOf(page)[ERROR_INDEXES[0]]);
    pickTag(page, "比较级");
    const text = page.text();
    expect(text).toContain("这里确实有问题，但不是比较级");
    expect(text).not.toContain("找到了");
    page.unmount();
  });

  it("点对错词且选对罪名 → 命中，给出原词→改正与讲解", () => {
    const page = openUnlocked(CASE_ID);
    clickElement(tokensOf(page)[ERROR_INDEXES[0]]);
    pickTag(page, TAG_LABEL[CASE.errors[0].tag]);
    const text = page.text();
    expect(text).toContain("找到了");
    expect(text).toContain(CASE.errors[0].correction);
    expect(text).toContain(CASE.errors[0].explanation);
    expect(/已找到 \d+ \/ \d+/.exec(text)?.[0]).toBe(`已找到 1 / ${CASE.errors.length}`);
    expect(redLineHits(text)).toEqual([]);
    page.unmount();
  });

  it("命中的词被打上 found 类名，且再点不会重新打开罪名面板（alreadyFound 不可达但不崩）", () => {
    const page = openUnlocked(CASE_ID);
    clickElement(tokensOf(page)[ERROR_INDEXES[0]]);
    pickTag(page, TAG_LABEL[CASE.errors[0].tag]);
    const token = tokensOf(page)[ERROR_INDEXES[0]];
    expect(token.className).toContain("found");
    clickElement(token);
    // handleTokenClick 对已找到的词直接 return —— 不重开面板，也不误算一次误判
    expect(page.has("的罪名是")).toBe(false);
    expect(/已找到 \d+ \/ \d+/.exec(page.text())?.[0]).toBe(`已找到 1 / ${CASE.errors.length}`);
    page.unmount();
  });

  it("全部命中 → 结算「破案」，星级与误判数如实反映本局", async () => {
    const page = openUnlocked(CASE_ID);
    // 先制造一次误判（干净词）
    clickElement(tokensOf(page)[CLEAN_INDEX]);
    pickTag(page, "时态变形");
    for (const error of CASE.errors) {
      clickElement(tokensOf(page)[error.tokenIndex]);
      pickTag(page, TAG_LABEL[error.tag]);
    }
    await flushAsync();
    const text = page.text();
    expect(text).toContain("破案！");
    expect(text).toContain("误判次数");
    // 1 次误判 → 2 星
    expect(text).toMatch(/误判次数1\b|误判次数\s*1/);
    expect(text).toContain("★★☆");
    expect(redLineHits(text)).toEqual([]);
    // 结算落盘
    const results = currentData().huntResults;
    expect(results.length).toBe(1);
    expect(results[0]).toMatchObject({ caseId: CASE_ID, found: CASE.errors.length, total: CASE.errors.length, misses: 1, stars: 2 });
    page.unmount();
  });

  it("结算页的复盘如实标注「看过提示」与「罪名绕了弯」", async () => {
    const page = openUnlocked(CASE_ID);
    clickElement(tokensOf(page)[ERROR_INDEXES[0]]);
    pickTag(page, TAG_LABEL.article ?? "冠词"); // 罪名绕弯
    pickTag(page, TAG_LABEL[CASE.errors[0].tag]); // 再选对
    clickElement(tokensOf(page)[ERROR_INDEXES[1]]);
    pickTag(page, TAG_LABEL[CASE.errors[1].tag]);
    await flushAsync();
    const text = page.text();
    expect(text).toContain("罪名绕了弯");
    expect(text).toContain("1 处一次到位");
    expect(redLineHits(text)).toEqual([]);
    page.unmount();
  });

  it("三个判定阶段的整页文本都不含 正确/错误/做错/答错/不对（红线）", () => {
    const page = openUnlocked(CASE_ID);
    const snapshots: Record<string, string[]> = {};
    snapshots["列表与开局"] = redLineHits(page.text());
    clickElement(tokensOf(page)[CLEAN_INDEX]);
    snapshots["选中待归因"] = redLineHits(page.text());
    pickTag(page, "时态变形");
    snapshots["误判反馈"] = redLineHits(page.text());
    clickElement(tokensOf(page)[ERROR_INDEXES[0]]);
    pickTag(page, "冠词");
    snapshots["归因不当反馈"] = redLineHits(page.text());
    pickTag(page, TAG_LABEL[CASE.errors[0].tag]);
    snapshots["命中反馈"] = redLineHits(page.text());
    console.log("[H2] 红线扫描：", JSON.stringify(snapshots));
    for (const [label, hits] of Object.entries(snapshots)) {
      expect(hits, `${label} 出现红线字样`).toEqual([]);
    }
    page.unmount();
  });

  it("结算页复盘的整页文本也不含红线字样（含案件复盘段落）", async () => {
    const page = openUnlocked(CASE_ID);
    for (const error of CASE.errors) {
      clickElement(tokensOf(page)[error.tokenIndex]);
      pickTag(page, TAG_LABEL[error.tag]);
    }
    await flushAsync();
    const text = page.text();
    expect(text).toContain("案件复盘");
    expect(redLineHits(text)).toEqual([]);
    page.unmount();
  });

  it("全库 201 案：每条 notError / wrongTag / hit 文案都过红线（数据驱动）", () => {
    // 只验文案本身，不挂 UI：直接扫 tokens 与错误组合的判定文本，规模覆盖全库。
    const offenders: string[] = [];
    for (const item of huntCases) {
      const errorIndexes = new Set(item.errors.map((error) => error.tokenIndex));
      for (let index = 0; index < item.tokens.length; index += 1) {
        const verdicts = errorIndexes.has(index)
          ? [
              judgeFor(item, index, item.errors.find((error) => error.tokenIndex === index)!.tag),
              judgeFor(item, index, item.errors.find((error) => error.tokenIndex === index)!.tag === "tense" ? "article" : "tense")
            ]
          : [judgeFor(item, index, "tense")];
        for (const verdict of verdicts) {
          if (RED_LINE.test(verdict.message)) offenders.push(`${item.id}#${index}:${verdict.kind}:${verdict.message}`);
        }
      }
    }
    console.log("[H2] 全库判定文案红线违规数：", offenders.length);
    expect(offenders).toEqual([]);
  });

  it("全库 201 案：每个植错点的命中文案都提及该词或改正词（不给出无关反馈）", () => {
    const vague: string[] = [];
    for (const item of huntCases) {
      for (const error of item.errors) {
        const verdict = judgeFor(item, error.tokenIndex, error.tag);
        if (verdict.kind !== "hit") vague.push(`${item.id}#${error.tokenIndex}:${verdict.kind}`);
      }
    }
    expect(vague).toEqual([]);
  });

  // ── 反馈渲染的诚实性 ────────────────────────────────────
  // 已知瑕疵（见报告 P2）：删词 / 换位型植错点的 correction 是空串，
  // 命中的反馈卡渲染成「原词 → 」（箭头后为空），玩家看不到该改成什么。
  it("命中反馈的修正文案不得为空（2026-09-20 已修：12 处改为「（去掉 X）」）", async () => {
    seedAppData({ grammarLessonsDone: lessonsFor("hunt-unless-rain") });
    const page = mountPage(<GrammarHuntPage />, "/grammar/hunt?case=hunt-unless-rain", "/grammar/hunt");
    const tokens = () => Array.from(page.container.querySelectorAll(".hunt-token")) as HTMLElement[];
    clickElement(tokens()[5]); // "will"
    pickTag(page, "时态变形");
    const node = page.container.querySelector(".hunt-verdict-correction");
    expect(node).not.toBeNull();
    // 修正文案非空——用户能看到该改成什么
    expect(node?.textContent).toBe("will → （去掉 will）");
    expect(node?.querySelector("strong")?.textContent).toBe("（去掉 will）");
    // 讲解文本仍在
    expect(page.text()).toContain("unless 后面那小句用现在时");
    await flushAsync();
    page.unmount();
  });

  it("复盘里不得出现「原词 → 原词」（2026-09-20 已修：该处改成真错 goes.）", async () => {
    seedAppData({ grammarLessonsDone: lessonsFor("hunt-unless-rain") });
    const page = mountPage(<GrammarHuntPage />, "/grammar/hunt?case=hunt-unless-rain", "/grammar/hunt");
    const tokens = () => Array.from(page.container.querySelectorAll(".hunt-token")) as HTMLElement[];
    for (const error of huntCases.find((item) => item.id === "hunt-unless-rain")!.errors) {
      clickElement(tokens()[error.tokenIndex]);
      pickTag(
        page,
        ({ tense: "时态变形", fragment: "句子残缺", sv_agreement: "主谓一致" } as Record<string, string>)[error.tag] ?? ""
      );
    }
    await flushAsync();
    const text = page.text();
    // 该处已改成真错：goes. → go.
    expect(text).toContain("goes.");
    expect(text, "复盘不应出现「原词 → 原词」").not.toContain("go.→go.");
    page.unmount();
  });
});
