// @vitest-environment jsdom
/**
 * ENV3-C · 输入环境敏感性：inputMode / enterKeyHint / autocomplete / spellCheck、
 * 粘贴（含换行与多份文本）、自动聚焦与焦点跳转、Tab 劫持。
 *
 * 这些都不是「崩溃级」问题，但直接决定中文输入法用户的手感：
 * - 没有 `inputMode`/`enterKeyHint`，移动端与部分桌面输入法不会给出「英文键盘 + 发送键」；
 * - 拼写页是唯一认真配了 `autocomplete/autocorrect/autocapitalize/spellCheck` 的页面；
 * - 粘贴长文本 / 带换行文本是否撑坏判题，取决于判分侧的空白压缩（实测是安全的）；
 * - 判题后自动聚焦在输入法还开着时会不会丢字，只能靠真机观察，见报告「需真机验证」段。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import SpellingPage from "../../pages/SpellingPage";
import ReviewPage from "../../pages/ReviewPage";
import GrammarDiaryPage from "../../pages/GrammarDiaryPage";
import { seedWordFixture } from "./env3Fixtures";
import { compareText, diffScore, normalizeSpelling } from "../../services/diffService";
import { fireKey } from "./kbd";
import { flushAsync, setInputValue } from "./drive";

const attrsOf = (el: Element) => ({
  inputMode: el.getAttribute("inputmode"),
  enterKeyHint: el.getAttribute("enterkeyhint"),
  autocomplete: el.getAttribute("autocomplete"),
  autocorrect: el.getAttribute("autocorrect"),
  autocapitalize: el.getAttribute("autocapitalize"),
  spellcheck: el.getAttribute("spellcheck"),
  lang: el.getAttribute("lang"),
  type: el.getAttribute("type")
});

describe("ENV3-C 输入框属性（中文输入法用户的实际手感）", () => {
  beforeEach(() => resetStorage());

  it("PASS-C1 拼写页是全站唯一认真配了输入法属性的输入框", async () => {
    seedWordFixture("picture", "画");
    const page = mountPage(<SpellingPage />, "/spelling", "/spelling");
    await flushAsync();
    const input = page.container.querySelector<HTMLInputElement>("input")!;
    expect(attrsOf(input), "拼写页输入框属性").toMatchObject({
      autocomplete: "off",
      autocorrect: "off",
      autocapitalize: "none",
      spellcheck: "false",
      type: null // 默认 text（不是 number/email 之类）
    });
    // 另有 WebKit 补全规避：随机 name + 挂载时 readonly、聚焦时解锁（源码 :30-32, :114-118, :781）
    expect(input.getAttribute("name"), "随机 name 规避 WebKit 历史补全").toMatch(/^dictation-/);
    page.unmount();
  });

  it("C2【已修 2026-09-23】英文输入框已声明 inputMode / enterKeyHint", async () => {
    /**
     * 修复前：全站零 inputMode / enterKeyHint。后果（移动端 / 平板 / 触屏笔记本）：
     * - 拼写页与「写英文句子」的框弹出的是**中文键盘**，用户要手动切英文；
     * - 回车键位上显示「换行」而不是「提交」，与页面「回车提交」的实际行为不一致。
     *
     * 修复：给**要写英文**的输入框补上 inputMode="text"（英文键盘）与
     * enterKeyHint（与各页实际提交行为对齐：回车提交的用 "done"）。
     * 中文输入框（标签、书名、日记…）不标 inputMode —— 它们本就该用中文键盘。
     */
    const { execSync } = await import("node:child_process");
    const hits = execSync(
      "grep -rn 'inputMode\\|enterKeyHint' src/pages src/components src/services src/App.tsx 2>/dev/null || true",
      { cwd: process.cwd(), encoding: "utf8" }
    ).trim();
    expect(hits, "应至少有一处声明").not.toBe("");
    // 写英文的四处关键输入框都要有
    for (const file of [
      "src/pages/SpellingPage.tsx",
      "src/pages/ReviewPage.tsx",
      "src/pages/GrammarDiaryPage.tsx",
      "src/pages/GrammarLessonPage.tsx"
    ]) {
      const fileHits = execSync(`grep -c 'inputMode' ${file} || true`, { cwd: process.cwd(), encoding: "utf8" }).trim();
      expect(Number(fileHits), `${file} 应有 inputMode`).toBeGreaterThan(0);
    }
  });

  it("C3【已修 2026-09-23】英文答案框已关掉自动大写 / 自动纠正 / 拼写检查", async () => {
    /**
     * 修复前：只有拼写页配了这几个属性，复习页 / 日记页 / 课程页的英文框都没有——
     * iOS 会把首字母自动大写、把 `I have a apple` 悄悄自动纠正，
     * **用户看到的输入与自己敲的不一致**，却按「敲的内容」被计分。
     */
    seedWordFixture("picture", "画");
    const page = mountPage(<ReviewPage />, "/review", "/review");
    await flushAsync();
    const area = page.container.querySelector<HTMLTextAreaElement>("textarea")!;
    expect(attrsOf(area), "复习页答案框应配齐输入法属性").toMatchObject({
      autocapitalize: "none",
      autocorrect: "off",
      spellcheck: "false",
      inputMode: "text",
      enterKeyHint: "done"
    });
    page.unmount();
  });

  it("C4【已修 2026-09-23】英文输入框已声明 lang=\"en\"，中文输入法可据此切英文", async () => {
    seedWordFixture("picture", "画");
    const page = mountPage(<SpellingPage />, "/spelling", "/spelling");
    await flushAsync();
    const input = page.container.querySelector<HTMLInputElement>("input")!;
    expect(input.getAttribute("lang"), "拼写框应标 lang=en").toBe("en");
    // 对照：GatePlayPage 的展示文本也标了 lang="en"（给读屏/排版用），
    // 现在可编辑输入框同样声明了，两处口径一致。
    page.unmount();
  });
});

describe("ENV3-C 粘贴：长文本 / 带换行 / 多份文本", () => {
  beforeEach(() => resetStorage());

  it("PASS-C5 粘贴带换行的句子：\\r\\n / \\n / 前后换行都被空白压缩吃掉，不影响判分", () => {
    const sc = (answer: string) => diffScore(compareText("I am happy.", answer));
    expect(sc("I am happy.\n"), "尾随换行").toBe(100);
    expect(sc("I am happy.\r\n"), "CRLF").toBe(100);
    expect(sc("   I am happy.   \n\n"), "首尾空白 + 空行").toBe(100);
    expect(sc("I am\nhappy."), "词中间换行（等价于空格）").toBe(100);
  });

  it("PASS-C6 粘贴两份文本会被判错（这是合理的：内容确实多了一倍）", () => {
    // 粘贴重复内容不该静默通过——用户应当看到差异反馈而不是「对了但内容翻倍」
    const tokens = compareText("I am happy.", "I am happy.\nI am happy.");
    expect(diffScore(tokens), "重复粘贴 → 50 分").toBe(50);
    expect(tokens.filter((t) => t.status === "extra").length, "多出的词被标为 extra").toBe(3);
  });

  it("PASS-C7 粘贴 NBSP（U+00A0）/ BOM 不会撑坏判题", () => {
    expect(diffScore(compareText("I am happy", "I\u00A0am happy")), "NBSP 被 \\s 归一").toBe(100);
    expect(diffScore(compareText("I am happy", "\uFEFFI am happy")), "BOM 被 trim 吃掉").toBe(100);
    expect(normalizeSpelling("pic\u00A0ture"), "词级：NBSP 被删").toBe("picture");
    expect(normalizeSpelling("\uFEFFpicture"), "词级：BOM 被 trim").toBe("picture");
  });

  /**
   * C8/C9【已修 2026-09-23】零宽字符与软连字符不再撑坏判题。
   *
   * 修复前（原为 willingness-to-fail 记录）：U+200B ZERO WIDTH SPACE 在 JS 里
   * **不是** `\s`（`\s` 只含 U+FEFF 与常规空白），所以它不被空白压缩吃掉，
   * 插进词里就把词切碎——"I am happy" vs "I am\u200Bhappy" 只拿 33 分；
   * 词级（拼写页）同理 "pic\u200Bture" ≠ "picture" 直接判错。
   * 软连字符 U+00AD 也一样（"hap\u00ADpy" → 50 分）。
   *
   * 来源：网页正文、PDF、Office 文档复制出来的文本常带这些不可见字符（排版用）。
   * 用户看不见它们，不该为此丢分。
   *
   * 修复：`foldFullWidth` 开头统一删除
   * U+200B / U+200C / U+200D / U+00AD / U+FEFF / U+180E / U+2060。
   */
  it("C8【已修 2026-09-23】零宽字符 U+200B 不再影响判题（网页/PDF 粘贴的高频产物）", () => {
    expect(diffScore(compareText("I am happy", "I am\u200Bhappy")), "零宽空格被删，满分").toBe(100);
    expect(normalizeSpelling("pic\u200Bture"), "词级：零宽字符被删").toBe("picture");
    // 记录原始事实：`\s` 确实不匹配 U+200B，所以必须靠显式删除，不能指望空白压缩
    expect("I\u200Bam".split(/\s+/).length, "证据：\\s 不匹配 U+200B").toBe(1);
    /**
     * 其余不可见字符：**位置决定处理方式**（这条区分是本轮实测踩出来的）。
     *
     *  - 落在**词内**的标记（ZWNJ/ZWJ/软连字符）→ 删除：「pi\u200Ccture」= picture；
     *  - 落在**词间**的分隔符（ZWSP/word joiner）→ 折成空格：「I\u2060am」= I am。
     *
     * 反过来处理会出错：词内的 ZWJ 折成空格会把 picture 拆成两个词；
     * 词间的 ZWSP 若直接删掉会把 I am 粘成 Iam。
     */
    for (const [label, ch] of [
      ["零宽非连字 U+200C（词内）", "\u200C"],
      ["零宽连字 U+200D（词内）", "\u200D"]
    ] as Array<[string, string]>) {
      expect(normalizeSpelling(`pi${ch}cture`), `${label} 应被删除`).toBe("picture");
    }
    expect(normalizeSpelling("hap\u00ADpy"), "软连字符（词内）应被删除").toBe("happy");
    expect(diffScore(compareText("I am happy", "I\u2060am happy")), "词连接符 U+2060（词间）折成空格").toBe(100);
  });

  it("C9【已修 2026-09-23】软连字符 U+00AD 不再把词拆成两半", () => {
    expect(diffScore(compareText("happy", "hap\u00ADpy")), "软连字符被删，满分").toBe(100);
    expect(normalizeSpelling("hap\u00ADpy"), "词级同样被删").toBe("happy");
  });

  it("PASS-C10 粘贴到拼写页：换行/空格被 normalizeSpelling 全删（粘贴整句也不会立即判错结构）", () => {
    // normalizeSpelling 删掉所有空白，所以粘贴 "pic ture" 仍等同 "picture"——
    // 这既是宽容也可能掩盖「用户其实粘了整句」；后者由判分结果自然反映（长度差异 → 判错）
    expect(normalizeSpelling("pic ture"), "空白被删").toBe("picture");
    expect(normalizeSpelling("pic\nture"), "换行被删").toBe("picture");
    expect(normalizeSpelling("picture picture"), "整句粘贴 → 内容翻倍 → 不等").not.toBe("picture");
  });
});

describe("ENV3-C 焦点与 Tab：输入法弹窗开着时的键盘导航", () => {
  beforeEach(() => resetStorage());

  it("PASS-C11 拼写页 Tab 劫持只作用于正文，输入框内放行（Shift+Tab 始终放行）", async () => {
    seedWordFixture("picture", "画");
    const page = mountPage(<SpellingPage />, "/spelling", "/spelling");
    await flushAsync();
    const input = page.container.querySelector<HTMLInputElement>("input")!;
    expect(fireKey(input, "Tab").defaultPrevented, "输入框上 Tab 放行（否则焦点锁死）").toBe(false);
    expect(fireKey(document.body, "Tab").defaultPrevented, "正文上正向 Tab 被接管（顺便听一遍）").toBe(true);
    expect(fireKey(document.body, "Tab", { shiftKey: true }).defaultPrevented, "Shift+Tab 始终放行").toBe(false);
    page.unmount();
  });

  it("C12【已加防御 2026-09-23】拼写页 Tab 守卫现在也看组词态", async () => {
    seedWordFixture("picture", "画");
    const page = mountPage(<SpellingPage />, "/spelling", "/spelling");
    await flushAsync();
    const input = page.container.querySelector<HTMLInputElement>("input")!;

    /**
     * 修复前：`isEditable` 只判 `tagName === INPUT/TEXTAREA/SELECT || isContentEditable`。
     * 组词态下 target 仍是 INPUT，**所以守卫本就成立、Tab 会放行**——行为是对的。
     *
     * 本轮加的是**防御性收紧**：万一组词候选窗把焦点挂到别处（非 INPUT 节点）
     * 而输入法仍开着组词态，原守卫会误判成「不在输入中」，把 Tab 劫持去播放发音，
     * 用户想用 Tab 选候选词却被打断。现在同时看 `isImeComposing`。
     *
     * ⚠️ 仍需真机确认的一半：真实 WKWebView 里组词候选窗是否会**先吃掉 Tab**
     * （把候选词上屏后不移动焦点），属引擎/输入法行为，jsdom 无法证伪。
     * 本条只能验证**我们的守卫在组词态不会主动抢键**。
     */
    // ① 输入框内：无论是否组词，Tab 一律放行
    expect(fireKey(input, "Tab").defaultPrevented, "输入框内 Tab 放行").toBe(false);
    const composingTab = fireKey(input, "Tab", { isComposing: true, keyCode: 229 });
    expect(composingTab.defaultPrevented, "组词态 Tab 同样放行").toBe(false);
    // ② 焦点不在输入框但仍在组词：新增的 isImeComposing 分支也应放行（防御点）
    const composingOnBody = fireKey(document.body, "Tab", { isComposing: true, keyCode: 229 });
    expect(composingOnBody.defaultPrevented, "组词态下即便焦点不在输入框也不抢 Tab").toBe(false);
    // ③ 对照：非组词态且焦点在正文 → 仍按设计劫持 Tab 播放发音
    expect(fireKey(document.body, "Tab").defaultPrevented, "非组词态的正文 Tab 仍被接管").toBe(true);
    page.unmount();
  });

  it("【已修 R09】复习页 Space 与数字键现在守卫一致：输入框里都不抢键", async () => {
    seedWordFixture("picture", "画");
    const page = mountPage(<ReviewPage />, "/review", "/review");
    await flushAsync();
    const area = page.container.querySelector<HTMLTextAreaElement>("textarea")!;
    area.focus();
    setInputValue(area, "one two three");
    await flushAsync();

    /**
     * 修复前同一段监听里两条快捷键的守卫标准不一致：
     *   if (event.key === " " && event.target === document.body) { … }   // ← 有守卫
     *   if (["1","2","3","4"].includes(event.key)) handleRatingClick(…)  // ← 没有
     * 于是用户在答案框里写 `I have 2 cats`，打到 `2` 就把卡评走了。
     * 修复后数字键补上了 `isTypingTarget` 守卫（外加组词态直接 return）。
     */
    const spaceInInput = fireKey(area, " ", { keyCode: 32 });
    expect(spaceInInput.defaultPrevented, "Space 在输入框里被放行").toBe(false);

    fireKey(area, "3", { keyCode: 51 });
    await flushAsync();
    const recorded = JSON.parse(window.localStorage.getItem("personal-vocab-app-data-v1") ?? "{}") as {
      reviews?: Array<{ answer: string; rating: number }>;
    };
    expect(recorded.reviews ?? [], "数字键在输入框里不再评分——草稿没有被当成评分依据").toEqual([]);

    // 对照：焦点在正文（非输入处）时数字键仍应正常评分，别把设计意图一起关掉。
    (area as HTMLElement).blur();
    fireKey(document.body, "3", { keyCode: 51 });
    await flushAsync();
    const after = JSON.parse(window.localStorage.getItem("personal-vocab-app-data-v1") ?? "{}") as {
      reviews?: Array<{ answer: string; rating: number }>;
    };
    expect(after.reviews?.length, "正文上的数字键保持可用（键盘快捷评分是设计意图）").toBe(1);
    page.unmount();
  });

  it("PASS-C14 日记页（中文写作主场景）没有 Enter 提交，组词回车不会误触发批改", async () => {
    const page = mountPage(<GrammarDiaryPage />, "/grammar/diary", "/grammar/diary");
    await flushAsync();
    const areas = Array.from(page.container.querySelectorAll("textarea")) as HTMLTextAreaElement[];
    expect(areas.length, "日记页应有输入框").toBeGreaterThan(0);
    const before = page.text();
    for (const area of areas) {
      // 中文输入法组词态回车：日记页 textarea 无 onKeyDown，也没有 form 包裹 → 不会提交
      fireKey(area, "Enter", { isComposing: true, keyCode: 229 });
    }
    await flushAsync();
    expect(page.text(), "组词回车不改变日记页状态（无提交路径）").toBe(before);
    page.unmount();
  });

  it("FAIL-C15【确认缺陷 · jsdom 测不出】form 隐式提交：jsdom 不实现 Enter 提交表单，真机已证会提交半截输入", async () => {
    /**
     * 这一条记录的是**测试基建的盲区**，不是产品缺陷本身：
     * jsdom 不实现 HTML 规范的 implicit form submission（按 Enter 触发表单提交），
     * 所以在 jsdom 里派发 Enter **永远不会**触发 submit，
     * 也就意味着「组词态回车 → form 提交半截中文」这类缺陷在单测里**结构性测不出来**。
     *
     * 真机证据（Chromium 129 + Playwright，dev server :1523）：
     *   UnitsPage `/units` → 「新建分组」→ 分组名输入框（placeholder「例如：核心100 / 考研高频」）
     *   用 CDP `Input.imeSetComposition` 组词 "hexin100"（尚未上屏）→ 按 Enter：
     *     keydown key=Enter isComposing=true dp=false
     *     SUBMIT dp=false
     *     localStorage unitGroups 新增 "hexin100"（而不是用户想要的「核心100」）
     *
     * 同类 form：SentencesPage /sentences「标签」框 → cards 落库 tags:["ceshi"]（真机实测）。
     * 因此：凡是 form 包输入框的提交点，都必须靠 **input 自己的 onKeyDown 拦组词态** 来防，
     * 不能依赖 onSubmit（原生 submit 事件上没有 isComposing / keyCode 可用）。
     */
    const form = document.createElement("form");
    let submits = 0;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      submits += 1;
    });
    const input = document.createElement("input");
    form.appendChild(input);
    document.body.appendChild(form);
    input.focus();
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true, cancelable: true, isComposing: true })
    );
    expect(
      submits,
      "jsdom 盲区证据：isComposing=true 的 Enter 在 jsdom 里不会触发表单提交（0 次）——" +
        "真机同场景会提交（1 次），所以本类缺陷只能靠真机或代码审查发现"
    ).toBe(0);
    form.remove();
  });
});
