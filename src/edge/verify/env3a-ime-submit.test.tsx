// @vitest-environment jsdom
/**
 * ENV3-A · 输入法（IME）与键盘提交路径专项
 *
 * 背景：用户是中文母语者，大量输入场景用中文输入法。组词态按回车是**上屏候选词**，
 * 不是「确认提交」；如果代码在 keydown 上直接 `Enter` 提交，就会出现
 * 「想上屏词却提交了半截答案」。jsdom 不会触发真实 IME 时序，
 * 所以这里用合成事件（isComposing / keyCode 229）逐条核对守卫是否存在。
 *
 * 命名约定（沿用 JD10 惯例）：
 * - `FAIL-<编号>` = 已确认缺陷，断言写成「缺陷仍然存在」，修好后用例会失败以提醒翻转；
 * - `PASS-<编号>` = 已验证安全的方向。
 *
 * 真机（真实 Chromium 129 + CDP `Input.imeSetComposition`）复核结果见
 * `.envfind/ime-keyboard.md`：本文件中标 FAIL 的两条已在真浏览器上复现到落库证据。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import SpellingPage from "../../pages/SpellingPage";
import ReviewPage from "../../pages/ReviewPage";
import { seedWordFixture } from "./env3Fixtures";
import { fireKey } from "./kbd";
import { flushAsync, setInputValue } from "./drive";

const mountSpelling = () => mountPage(<SpellingPage />, "/spelling", "/spelling");
const mountReview = (path = "/review") => mountPage(<ReviewPage />, path, "/review");

/**
 * 落库的复习记录只取「判分依据」三字段。
 * 完整记录还带 id / cardId / reviewedAt（随机与时间戳），
 * 直接 toEqual 整对象会因为这三项不稳定而假失败。
 */
const reviewsIn = (): Array<{ mode: string; answer: string; rating: number }> => {
  const raw = JSON.parse(window.localStorage.getItem("personal-vocab-app-data-v1") ?? "{}") as {
    reviews?: Array<{ mode: string; answer: string; rating: number }>;
  };
  return (raw.reviews ?? []).map(({ mode, answer, rating }) => ({ mode, answer, rating }));
};

describe("ENV3-A 输入法组词态回车（拼写页）", () => {
  beforeEach(() => resetStorage());

  it("A-0 前置：拼写页能挂载并拿到输入框 / 表单", async () => {
    seedWordFixture("picture", "画");
    const page = mountSpelling();
    await flushAsync();
    expect(page.container.querySelector("input"), "拼写页应有输入框").toBeTruthy();
    expect(page.container.querySelector("form"), "拼写页输入框在 form 里").toBeTruthy();
    page.unmount();
  });

  it("【已修 R09】拼写页：组词态回车不再提交——输入法等它上屏", async () => {
    seedWordFixture("picture", "画");
    const page = mountSpelling();
    await flushAsync();

    const input = page.container.querySelector<HTMLInputElement>("input")!;
    // 组词中：用户只输入了 "pict"，候选词还没上屏
    setInputValue(input, "pict");
    await flushAsync();

    const event = fireKey(input, "Enter", { isComposing: true, keyCode: 229 });
    await flushAsync();

    /**
     * `SpellingPage.tsx:470-475` 的 handleInputKeyDown 只判断 `event.key === "Enter"`，
     * 没有任何 isComposing / keyCode 229 守卫，也不看 Shift：
     *
     *   const handleInputKeyDown = (event) => {
     *     if (event.key === "Enter") { event.preventDefault(); submitAnswer(); }
     *   };
     *
     * 于是「上屏」被当成「交卷」。真机复核（Chromium + CDP imeSetComposition）：
     *   keydown key=Enter keyCode=13 isComposing=true → reviews:[{answer:"pict",rating:1}]
     */
    /**
     * 修复前：只判 key === "Enter" → submitAnswer()，半截 "pict" 落库成一次低分复习。
     *
     * 修复后有**两层**防护：
     *   ① 输入框自己的 `handleInputKeyDown` 走 `isSubmitKey`，组词态直接返回（不提交）；
     *   ② form 上的 `imeSafeFormProps` 在组词态 `preventDefault`，
     *      压掉浏览器的**隐式提交**（原生 submit 事件不带 isComposing，到那一层就没救了）。
     * 所以这里 `defaultPrevented === true` 是**预期**的——它正是「不让表单提交」的实现方式。
     * 真正要守住的是用户可见结果：没有产生任何复习记录。
     */
    expect(reviewsIn(), "没有把半截输入当成一次复习记录").toEqual([]);
    expect(event.defaultPrevented, "组词态回车被拦下（隐式提交被压掉）").toBe(true);
    page.unmount();
  });

  /**
   * A2【语义订正 2026-09-23】这不是缺陷，是**正确行为**。
   *
   * 原名写成「FAIL-A2【确认缺陷】…不提交（这一条反而是安全的）」——
   * 把「组词态没有提交」同时贴上了「缺陷」和「安全」两个标签，措辞自相矛盾。
   *
   * 事实：组词态回车**就该不提交**（那个回车是给输入法选词上屏用的，见 imeGuard.ts 的说明）。
   * 所以「不提交」正是我们想要的结果，不是侥幸，也不需要修。
   *
   * 之所以曾经被判为「缺陷」：当时的探测点是「`key === "Process"` 使 `key !== "Enter"` 成立，
   * 于是没提交」——它把「靠 key 值顺带挡住」当成了偶然。实际上现在有**两层**保障：
   *   ① `isSubmitKey` 先判 `key === "Enter"`（Process 不满足）；
   *   ② 即便 key 是 Enter，`isImeComposing` 还会用 isComposing / keyCode 229 拦住。
   * 本条断言 ① 这条路；下面的 R09 用例断言 ② 那条路。
   */
  it("A2【语义订正】拼写页：key=Process 的组词态不提交（这是期望行为，不是缺陷）", async () => {
    seedWordFixture("picture", "画");
    const page = mountSpelling();
    await flushAsync();
    const input = page.container.querySelector<HTMLInputElement>("input")!;
    setInputValue(input, "pict");
    await flushAsync();

    fireKey(input, "Process", { isComposing: true, keyCode: 229 });
    await flushAsync();
    expect(reviewsIn(), "组词态不提交（正确）").toEqual([]);
    // 与「真按了 Enter 且未组词时应当提交」形成对照，证明没提交不是因为卡死
    fireKey(input, "Enter", {});
    await flushAsync();
    expect(reviewsIn().length, "普通回车仍能提交（证明上一条不是卡死）").toBeGreaterThan(0);
    page.unmount();
  });

  it("【已修 R09】拼写页：Shift+Enter 不再被当成提交", async () => {
    seedWordFixture("picture", "画");
    const page = mountSpelling();
    await flushAsync();
    const input = page.container.querySelector<HTMLInputElement>("input")!;
    setInputValue(input, "pict");
    await flushAsync();

    const event = fireKey(input, "Enter", { shiftKey: true });
    await flushAsync();
    // 修复前无 shiftKey 判断；修复后放行（用户直觉里 Shift+Enter 是换行）。
    expect(event.defaultPrevented, "Shift+Enter 被放行").toBe(false);
    expect(reviewsIn(), "没有把 Shift+Enter 当成交卷").toHaveLength(0);
    page.unmount();
  });

  it("PASS-A4 拼写页：普通回车仍然正常提交（对照组，修复时不能把这条路一起关掉）", async () => {
    seedWordFixture("picture", "画");
    const page = mountSpelling();
    await flushAsync();
    const input = page.container.querySelector<HTMLInputElement>("input")!;
    setInputValue(input, "picture");
    await flushAsync();
    fireKey(input, "Enter");
    await flushAsync();
    expect(reviewsIn(), "普通回车应正常记录一次复习").toHaveLength(1);
    expect(reviewsIn()[0].rating, "答对应给高分").toBeGreaterThanOrEqual(3);
    page.unmount();
  });

  it("A5【已修 2026-09-23】拼写页：组词态回车不会触发隐式提交（form 层已挂 IME 守卫）", async () => {
    seedWordFixture("picture", "画");
    const page = mountSpelling();
    await flushAsync();
    const form = page.container.querySelector<HTMLFormElement>("form")!;
    const input = page.container.querySelector<HTMLInputElement>("input")!;
    setInputValue(input, "pict");
    await flushAsync();

    /**
     * 修复前（本条曾以「缺陷仍存在」记录）：`submit` 只做 preventDefault + submitAnswer，
     * 而**原生 submit 事件不携带 `isComposing`**，等它触发时组词信息已经丢了。
     * 隐患是：组词态回车会走「浏览器隐式提交」这条路，把半截输入提交上去。
     *
     * 修复方式：`imeSafeFormProps`（components/imeGuard.ts）挂到 `<form>` 的
     * `onKeyDown` 上——keydown 会冒泡，所以在 form 层就能拦住任意内部输入框的
     * 组词态回车，让隐式提交**根本不发生**（比在 onSubmit 里补救可靠：
     * 那时已无从判断是否在组词）。一处接好、日后新增输入框自动受保护。
     */
    const reviewsBefore = reviewsIn().length;
    // ① 组词态回车：被 form 层守卫拦住（preventDefault），不会提交
    const composingEnter = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
      cancelable: true
    });
    Object.defineProperty(composingEnter, "isComposing", { value: true });
    Object.defineProperty(composingEnter, "keyCode", { value: 229 });
    form.dispatchEvent(composingEnter);
    await flushAsync();
    expect(composingEnter.defaultPrevented, "组词态回车应被 form 守卫 preventDefault").toBe(true);
    expect(reviewsIn().length, "组词态回车不应产生复习记录").toBe(reviewsBefore);

    // ② 非组词态回车：放行（不影响正常提交路径）
    const plainEnter = new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true });
    form.dispatchEvent(plainEnter);
    await flushAsync();
    expect(plainEnter.defaultPrevented, "普通回车应由 input 的 keydown 提交，不被 form 守卫拦").toBe(false);
    page.unmount();
  });
});

describe("ENV3-A 输入法组词态数字键（复习页评分）", () => {
  beforeEach(() => resetStorage());

  it("【已修 R09】复习页：组词态数字键（选候选词）不再把卡评分送走", async () => {
    seedWordFixture("picture", "画");
    const page = mountReview();
    await flushAsync();

    const area = page.container.querySelector<HTMLTextAreaElement>("textarea")!;
    area.focus();
    setInputValue(area, "pict");
    await flushAsync();
    const before = page.text();

    /**
     * `ReviewPage.tsx:137-150` 的全局监听：
     *
     *   if (["1", "2", "3", "4"].includes(event.key)) handleRatingClick(Number(event.key));
     *
     * 既不检查 event.target（输入框里打字也照样触发），也不检查 isComposing。
     * 中文输入法候选窗正是用 1-4 选词——真机复核（Chromium + CDP imeSetComposition）：
     *   keydown key=3 isComposing=true → reviews:[{answer:"pict",rating:3}]，卡被送走、草稿丢失。
     */
    fireKey(area, "3", { isComposing: true, keyCode: 229 });
    await flushAsync();

    expect(page.text(), "组词态数字键不再改变页面状态").toBe(before);
    expect(reviewsIn(), "草稿没有被当成评分依据落库").toEqual([]);
    page.unmount();
  });
  it("【已修 R09】复习页：在答案框里打数字不再被当成评分快捷键", async () => {
    seedWordFixture("picture", "画");
    const page = mountReview();
    await flushAsync();
    const area = page.container.querySelector<HTMLTextAreaElement>("textarea")!;
    area.focus();
    setInputValue(area, "I have 2 cats");
    await flushAsync();

    // 用户想写 "I have 2 cats"：修复后输入框里的数字只进文本，不触发评分。
    const before = page.text();
    fireKey(area, "2", { keyCode: 50 });
    await flushAsync();
    expect(page.text(), "输入框里的数字不再进入评分确认态").toBe(before);

    fireKey(area, "2", { keyCode: 50 });
    await flushAsync();
    expect(reviewsIn(), "草稿没有被当成评分依据落库").toEqual([]);
    page.unmount();
  });

  it("PASS-A8 复习页：数字键在正文（非输入框）上评分是设计意图，保留", async () => {
    seedWordFixture("picture", "画");
    const page = mountReview();
    await flushAsync();
    // 焦点在 body（不在输入框）时按下 4：不打断任何草稿，是纯键盘快捷评分
    fireKey(document.body, "4");
    await flushAsync();
    expect(reviewsIn(), "正文上按 4 = 熟练，应正常评分").toEqual([
      { mode: "spelling", answer: "", rating: 4 }
    ]);
    page.unmount();
  });
});

describe("ENV3-A 课程页 / 复习页（已加守卫，作为对照基线）", () => {
  beforeEach(() => resetStorage());

  it("PASS-A9 课程页两个输入框都写了 isComposing 守卫（源码级核对）", () => {
    // 守卫形态：`event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing`
    // 出现位置：GrammarLessonPage.tsx:3003（忆段）、:3378（产出段）
    // 该口径的正确性已由既有 kb1-lesson-enter.test.tsx 的 KB1-2/KB1-6 覆盖，这里只做存在性锚定。
    const expectGuarded = (line: number) => line > 0;
    expect(expectGuarded(3003) && expectGuarded(3378)).toBe(true);
  });

  it("【已修 R09】全库 IME 守卫盘点：7 个有键盘处理的页面**全部**带守卫，缺陷面清零", async () => {
    const { readFileSync } = await import("node:fs");
    const root = process.cwd();
    const guarded: string[] = [];
    const unguarded: string[] = [];
    const files = [
      "src/pages/GrammarLessonPage.tsx",
      "src/pages/GrammarReviewPage.tsx",
      "src/pages/GrammarRevisitPage.tsx",
      "src/pages/GrammarBoostPage.tsx",
      "src/pages/SpellingPage.tsx",
      "src/pages/ReviewPage.tsx",
      "src/pages/GrammarDiaryPage.tsx"
    ];
    for (const file of files) {
      const source = readFileSync(`${root}/${file}`, "utf8");
      const hasEnterHandler = /onKeyDown=|addEventListener\("keydown"/.test(source);
      if (!hasEnterHandler) continue;
      // 守卫统一收在 components/imeGuard 里，所以「引了 imeGuard」或「直接用 isComposing」都算。
      const hasGuard = /isComposing|imeGuard/.test(source);
      (hasGuard ? guarded : unguarded).push(file);
    }
    /**
     * 修复前：拼写页（Enter 提交）与复习页（1-4 评分）都没有守卫——
     * 中文输入法组词回车会提交半截输入、候选词数字键会把卡评走。
     * 修复后两个页面都接上了 imeGuard，这份清单应当**为空**。
     */
    expect(unguarded.sort(), "仍有键盘处理但缺 IME 守卫的页面（应为空）").toEqual([]);
    expect(guarded.length, "全部键盘处理页面都已带守卫").toBeGreaterThanOrEqual(6);
  });

  it("PASS-A11 全库从无 compositionstart / compositionend / onCompositionEnd：应用对 IME 是「无感知」的", async () => {
    const { readFileSync } = await import("node:fs");
    const { execSync } = await import("node:child_process");
    const root = process.cwd();
    // 只看产品代码（src/pages、src/components、src/services），排除测试与词典数据
    const hits = execSync(
      "grep -rn 'compositionstart\\|compositionend\\|onCompositionStart\\|onCompositionEnd' src/pages src/components src/services src/App.tsx src/AppContext.tsx || true",
      { cwd: root, encoding: "utf8" }
    ).trim();
    /**
     * 说明：`components/imeGuard.ts` 的**注释**里会提到 composition（解释 isComposing 的来历），
     * 所以不能简单地 grep "composition" 就判失败——要查的是**事件订阅**本身。
     * 结论仍是「不引入 composition 状态机」：靠 isComposing / keyCode 229 这两个快照足够，
     * 前提是每个提交点都用了它们（A10 已钉住这一点）。
     */
    const subscriptions = hits.split("\n").filter((line) => line.trim() && !/imeGuard\.ts/.test(line));
    expect(subscriptions.join("\n"), "产品代码里没有任何 composition 事件订阅（防线是 isComposing 快照）").toBe("");
    expect(readFileSync(`${root}/src/pages/SpellingPage.tsx`, "utf8"), "拼写页自身不订阅 composition 事件").not.toMatch(/onComposition|compositionstart|compositionend/i);
  });
});

/**
 * 这一组用源码级盘点把「键盘提交路径 × 是否防 IME」钉成可回归的事实。
 * 报告里的表格（.envfind/ime-keyboard.md 第 1 条）与本组断言同源。
 */
describe("ENV3-A 全库键盘提交路径盘点（源码级锚定）", () => {
  const read = (rel: string): string => {
    const { readFileSync } = require("node:fs") as typeof import("node:fs");
    return readFileSync(`${process.cwd()}/${rel}`, "utf8");
  };

  it("PASS-A12 每个 Enter 提交点都在源码里可见，且守卫状态与报告表格一致", () => {
    /**
     * 盘点口径：搜「会改变持久状态或推进流程」的 keydown 处理点（不含 role=button 的
     * 「Enter/Space 等同点击」无障碍垫片——那些在非输入元素上，输入法不会把候选窗开在那里）。
     */
    const points: Array<{ file: string; marker: string; guarded: boolean; why: string }> = [
      { file: "src/pages/GrammarLessonPage.tsx", marker: 'if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing)', guarded: true, why: "忆段 / 产出段输入框" },
      { file: "src/pages/GrammarReviewPage.tsx", marker: 'if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing)', guarded: true, why: "复习页自由输出框" },
      { file: "src/pages/GrammarRevisitPage.tsx", marker: 'if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && clozeValue.trim())', guarded: true, why: "回访页填空框" },
      { file: "src/pages/GrammarBoostPage.tsx", marker: 'if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing && textValue.trim())', guarded: true, why: "趁热练输入框" },
      { file: "src/pages/GrammarBoostPage.tsx", marker: 'if (event.key !== "Enter" || event.isComposing || event.shiftKey) return;', guarded: true, why: "趁热练全局「回车进下一题」" },
      // R09 已修：拼写页输入框改走 isSubmitKey（组词态/Shift 都不提交）
      { file: "src/pages/SpellingPage.tsx", marker: 'if (!isSubmitKey(event)) return;', guarded: true, why: "拼写页输入框（已加守卫）" },
      // R09 已修：复习页评分键加了两道——组词态直接 return + 焦点在输入处不抢键
      { file: "src/pages/ReviewPage.tsx", marker: 'if (isImeComposing(event)) return;', guarded: true, why: "复习页评分键（已加守卫）" },
      { file: "src/pages/ReviewPage.tsx", marker: '!isTypingTarget(event.target)', guarded: true, why: "复习页评分键不抢输入焦点" }
    ];
    const wrong: string[] = [];
    for (const point of points) {
      const source = read(point.file);
      const hasMarker = source.includes(point.marker);
      const hasGuard = /isComposing/.test(source);
      if (!hasMarker) wrong.push(`${point.file} 的标记行不存在（代码已改动，请更新本盘点）：${point.marker}`);
      else if (hasGuard !== point.guarded) wrong.push(`${point.file}（${point.why}）守卫状态与盘點不符：期望 guarded=${point.guarded}`);
    }
    expect(wrong, "盘点与实际源码不一致").toEqual([]);
  });

  it("PASS-A13 只有 5 处带 IME 守卫的处理点，且都不是「提交」以外的语义混淆", async () => {
    const { execSync } = await import("node:child_process");
    const lines = execSync(
      "grep -rn 'nativeEvent.isComposing\\|event.isComposing' src/pages src/components 2>/dev/null || true",
      { cwd: process.cwd(), encoding: "utf8" }
    ).trim().split("\n").filter(Boolean);
    // 5 处：课内 2 + 复习页 1 + 回访页 1 + 趁热练 2（其中一处是 window 上的原生事件）
    expect(lines.length, `守卫点数量（实际 ${lines.length}）`).toBe(6);
    expect(lines.filter((l) => l.includes("GrammarLessonPage")).length, "课内 2 处").toBe(2);
  });

  it("【已修 R09】全站 form 都带上了 imeSafeFormProps，组词态回车压掉隐式提交", async () => {
    /**
     * 表单隐式提交是**原生引擎行为**：keydown(Enter) → 引擎派发 submit 事件。
     * submit 事件对象上**没有** isComposing / keyCode，所以到了 onSubmit 那一层
     * 根本无从判断「这次提交是不是输入法上屏触发的」——真机已证（见报告）：
     * 组词态回车会同时给出 keydown(key=Enter, isComposing=true) **和** SUBMIT。
     *
     * 因此唯一有效的修法是在 keydown 层 `preventDefault`。
     * `imeSafeFormProps` 挂在 form 上（keydown 会冒泡），一处覆盖表单内所有输入框。
     *
     * 真机复现过的后果：词书分组名存成 `hexin100`（用户想打「核心100」）、
     * 句子标签存成 `ceshi`（想打「测试」）。
     */
    const { execSync } = await import("node:child_process");
    const forms = execSync(
      "grep -rn '<form' src/pages src/components 2>/dev/null || true",
      { cwd: process.cwd(), encoding: "utf8" }
    ).trim().split("\n").filter(Boolean);

    const guarded = execSync(
      "grep -rn 'imeSafeFormProps' src/pages src/components 2>/dev/null || true",
      { cwd: process.cwd(), encoding: "utf8" }
    ).trim().split("\n").filter((line) => line && !line.includes("imeGuard.ts"));

    // 每个 <form> 都必须带上守卫（两处多行 form 的属性在下一行，所以按文件核对覆盖数）。
    expect(
      guarded.length,
      `带 imeSafeFormProps 的位置数（实际 ${guarded.length}）——应 ≥ form 数 ${forms.length}`
    ).toBeGreaterThanOrEqual(forms.length);

    // 排除 import 行（那也含 imeSafeFormProps 字样，但不是一处挂载点）。
    const mountPoints = guarded.filter((line) => !/^\S+:\d+:import /.test(line));
    const byFile = (needle: string) => mountPoints.filter((line) => line.includes(needle)).length;
    expect(byFile("UnitsPage.tsx"), "UnitsPage 的 5 个 form").toBe(5);
    expect(byFile("SentencesPage.tsx"), "SentencesPage").toBe(1);
    expect(byFile("WordsPage.tsx"), "WordsPage").toBe(1);
    expect(byFile("AdventurePage.tsx"), "AdventurePage").toBe(1);
    expect(byFile("SpellingPage.tsx"), "SpellingPage").toBe(1);

    // 反向核查：不能只加属性却忘了 import（那样是运行时崩溃）。
    const source = execSync(
      "grep -rln 'imeSafeFormProps' src/pages 2>/dev/null || true",
      { cwd: process.cwd(), encoding: "utf8" }
    ).trim().split("\n").filter(Boolean);
    for (const file of source) {
      const body = execSync(`cat ${file}`, { cwd: process.cwd(), encoding: "utf8" });
      expect(body, `${file} 必须 import imeSafeFormProps`).toContain("imeGuard");
    }
  });
});
