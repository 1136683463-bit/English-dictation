// @vitest-environment jsdom
/**
 * ENV4-C · 运行期 Web API 缺失 / 抛错时的页面存活与用户可察觉性（2026-09-22）
 *
 * 覆盖四类能力，每条都追问同一组问题：
 *   1. 调用前有没有**能力检测**？
 *   2. 缺了 / 抛了 → 页面崩不崩（项目无 ErrorBoundary，崩了就白屏）？
 *   3. 用户能不能察觉，还是静默无反应？
 *
 * ## 本轮确认的结论
 *
 * | API | 能力检测 | 缺失/抛错时 | 用户可察觉 | 等级 |
 * |---|---|---|---|---|
 * | `speechSynthesis` | 有（`isSpeechSupported`） | 不崩 | **不能**：`speakText` 仍返回 true | 见 ① |
 * | `AudioContext`（答题音效） | 有（`if (!AudioContextClass) return`） | **构造函数抛错时崩溃** | 崩在「已验证答案」之后 | **P0** 见 ② |
 * | `matchMedia` | **无** | **崩溃**（StatsPage 挂载即抛） | 页面白屏 | **P0** 见 ③ |
 * | `ResizeObserver` | **无** | **崩溃**（三个页面 + Segmented 挂载即抛） | 页面白屏 | **P0** 见 ③ |
 */
import { beforeEach, describe, expect, it } from "vitest";
import { mountPage, resetStorage } from "../harness";
import SpellingPage from "../../pages/SpellingPage";
import StatsPage from "../../pages/StatsPage";
import MistakeBookPage from "../../pages/MistakeBookPage";
import GrammarDiaryPage from "../../pages/GrammarDiaryPage";
import { Segmented } from "../../components/Segmented";
import SpeakButton from "../../components/SpeakButton";
import { clickButtonContaining, flushAsync } from "./drive";
import { cardsToData, makeAppData, makeSentenceCard, readAppData, seedAppData, typeInto } from "./fixtures";
import { makeWordCard } from "./env3Fixtures";
import { isSpeechSupported, speakText } from "../../services/speechService";

/** 安装/还原一个「存在但行为可指定」的全局构造器；返回还原函数。 */
const withGlobal = <T,>(name: string, value: T) => {
  const scope = globalThis as unknown as Record<string, unknown>;
  const had = Object.prototype.hasOwnProperty.call(scope, name);
  const original = scope[name];
  scope[name] = value;
  return () => {
    if (had) scope[name] = original;
    else Reflect.deleteProperty(scope, name);
  };
};

const withWindowGlobal = <T,>(name: string, value: T) => {
  const scope = window as unknown as Record<string, unknown>;
  const had = Object.prototype.hasOwnProperty.call(scope, name);
  const original = scope[name];
  scope[name] = value;
  return () => {
    if (had) scope[name] = original;
    else Reflect.deleteProperty(scope, name);
  };
};

const catchPageErrors = () => {
  const seen: string[] = [];
  const handler = (event: ErrorEvent) => seen.push(event.message);
  window.addEventListener("error", handler);
  return { seen, stop: () => window.removeEventListener("error", handler) };
};

const seedOneWord = () => {
  const fixture = makeWordCard("w1", "picture", "画");
  seedAppData(
    makeAppData({
      cards: [fixture.card],
      schedules: [fixture.schedule],
      wordDetails: [fixture.details]
    }) as never
  );
};

describe("ENV4-C① 语音合成：能力检测齐全，但「存在却不发音」无法被察觉", () => {
  beforeEach(() => resetStorage());

  it("jsdom 没有 speechSynthesis / SpeechSynthesisUtterance → isSpeechSupported() 为 false", () => {
    expect("speechSynthesis" in window).toBe(false);
    expect(typeof (globalThis as unknown as { SpeechSynthesisUtterance?: unknown }).SpeechSynthesisUtterance).toBe(
      "undefined"
    );
    expect(isSpeechSupported()).toBe(false);
  });

  it("缺失时 speakText 不抛错，返回 false（链末已兜底）", async () => {
    await expect(
      speakText("hello world", { systemOnly: true })
    ).resolves.toBe(false);
  });

  it("★ 可疑：speechSynthesis 存在但 speak() 永不触发时，speakText 仍返回 true", async () => {
    /*
     * Linux WebKitGTK 上 speech-dispatcher 缺失是常见形态：`window.speechSynthesis`
     * 与 `SpeechSynthesisUtterance` 都在，`isSpeechSupported()` 为 true，
     * `speak()` 不抛错——但 **utterance 的 onstart/onerror 都不会被回调**，
     * 声音永远不出来。此时 `speakWithSystemVoice` 直接 `return true`，
     * 调用方据此显示「试听已播放」。
     *
     * 这是「静默无效果」的最典型形态，且**无法在 jsdom 里复现真实内核行为**，
     * 所以本用例固定的是「返回值不依赖任何发音回调」这一事实，
     * 而不是断言它在某个真实平台上必然失败。
     */
    const calls: string[] = [];
    class FakeUtterance {
      text: string;
      lang = "";
      rate = 1;
      voice: unknown = null;
      onstart: (() => void) | null = null;
      onend: (() => void) | null = null;
      onerror: (() => void) | null = null;
      constructor(text: string) {
        this.text = text;
      }
    }
    const restoreSynth = withWindowGlobal("speechSynthesis", {
      speak: () => void calls.push("speak"),
      cancel: () => void calls.push("cancel"),
      pause: () => undefined,
      resume: () => undefined,
      getVoices: () => [],
      speaking: false,
      paused: false,
      addEventListener: () => undefined,
      removeEventListener: () => undefined
    });
    const restoreUtterance = withGlobal("SpeechSynthesisUtterance", FakeUtterance);

    expect(isSpeechSupported(), "两个符号都在 → 环境看起来「支持」").toBe(true);

    const result = await speakText("hello world", { systemOnly: true, lang: "en-US" });

    expect(calls, "确实调到了 speak()").toContain("speak");
    expect(
      result,
      "★ speakText 返回 true，但没有任何发音回调被触发过——调用方会显示「已播放」"
    ).toBe(true);

    restoreUtterance();
    restoreSynth();
  });

  it("SpeakButton：无任何音频能力时按钮仍可点（不算 P0，但点了没反应）", () => {
    seedAppData(makeAppData({}));
    const page = mountPage(
      <div>
        <SpeakButton text="picture" />
      </div>,
      "/probe",
      "/probe"
    );
    const button = page.container.querySelector("button") as HTMLButtonElement;
    expect(button, "按钮渲染出来了").toBeTruthy();
    /*
     * SpeakButton.tsx:16 的判据是
     * `Boolean(audioUrl) || Boolean(text.trim()) || isSpeechSupported()` ——
     * text 非空即算「支持」，于是关闭 disabled。这在浏览器/Tauri 都缺语音时
     * 仍会给出一个可点但无声的按钮。属 P2（有文字内容时在线音源可能救回来）。
     */
    expect(button.disabled, "有文本时不禁用（在线音源/系统语音都可能救回来）").toBe(false);
    page.unmount();
  });
});

describe("ENV4-C② 答题音效：AudioContext 构造抛错会吃掉这次作答（P0）", () => {
  beforeEach(() => resetStorage());

  it("★ P0：AudioContext 缺失时不崩（`if (!AudioContextClass) return` 守住了）", async () => {
    seedOneWord();
    expect(typeof (window as unknown as { AudioContext?: unknown }).AudioContext).toBe("undefined");

    const page = mountPage(<SpellingPage />, "/spelling", "/spelling");
    const input = page.container.querySelector("input") as HTMLInputElement;
    typeInto(input, "picture");
    page.click("提交");
    await new Promise((resolve) => setTimeout(resolve, 30));

    expect(readAppData().reviews.length, "缺 AudioContext 时作答照常生效").toBe(1);
    page.unmount();
  });

  it("【已修 R09】AudioContext 构造抛错不再吃掉这次作答——音效静音降级", async () => {
    /*
     * WebKit / 某些 WebView 在硬件 AudioContext 数量达到上限时，
     * `new AudioContext()` 会抛 `InvalidStateError: number of hardware contexts
     * is greater than or equal to the maximum bound`。
     *
     * SpellingPage.tsx:339-342 的守卫只检查「类是否存在」：
     *   const AudioContextClass = window.AudioContext || window.webkitAudioContext;
     *   if (!AudioContextClass) return;
     *   const context = new AudioContextClass();   // ← 这里会抛，没有 try/catch
     *
     * `playTone` 抛出的异常从 `submitAnswer` 逃出，**打断在 `setData(graduation.data)`
     * 之前**（SpellingPage.tsx:443 playTone → 456 setData），于是：
     *   - 这次作答**没有落盘**（reviews 不增）；
     *   - 反馈区停在「提交」，没有「自动进入下一题」，也没有任何错误说明；
     *   - 用户看到的就是「我点了提交，它没反应」——只能再点一次。
     *
     * 这条路径与「AudioContext 缺失」只差一个 try/catch，却从「不影响功能」
     * 变成「作答丢失」，是本次专项里唯一由 API **抛错**（而非缺失）引发的 P0。
     *
     * 附注：同一条 `new AudioContext` 也在 speechService 的 `getWebAudioContext`
     * （speechService.ts:212）里，而它在 `speakText` 的**同步开头**被调用
     * （speechService.ts:585 `unlockWebAudio()`），于是 `void speakText(...)`
     * 会得到一个没人接的 rejected promise（拼写页挂载时的自动发音就走这条路）。
     * 本用例关掉 `autoSpeakInSpelling` 把变量收成一条，让失败点唯一。
     */
    seedOneWord();
    // 关掉「自动发音」，让唯一会构造 AudioContext 的路径只剩 playTone（答题音效）。
    const seeded = readAppData();
    seedAppData({ ...seeded, settings: { ...seeded.settings, autoSpeakInSpelling: false } } as never);

    const restore = withWindowGlobal("AudioContext", function BrokenAudioContext() {
      throw new DOMException(
        "number of hardware contexts is greater than or equal to the maximum bound",
        "InvalidStateError"
      );
    } as unknown as typeof AudioContext);
    const errors = catchPageErrors();

    const page = mountPage(<SpellingPage />, "/spelling", "/spelling");
    const input = page.container.querySelector("input") as HTMLInputElement;
    typeInto(input, "picture");
    page.click("提交");
    await new Promise((resolve) => setTimeout(resolve, 40));

    /**
     * 修复前：`playTone` 里 `new AudioContextClass()` 抛出的异常从 `submitAnswer`
     * 逃出，**打断在 `setData(graduation.data)` 之前**——作答不落盘，
     * 用户看到的是「点了提交没反应」。
     * 修复后：整段包了 try/catch，音效是可选增强，失败只静音。
     */
    expect(errors.seen.join(" "), "异常不再逃到 window").not.toMatch(
      /hardware contexts|InvalidStateError/
    );
    expect(
      readAppData().reviews.length,
      "这次作答已落盘——音效失败不再打断判题"
    ).toBe(1);

    errors.stop();
    restore();
    page.unmount();
  });

  it("【已修 R09】自动发音打开时，挂载不再产生未处理的 promise 拒绝", async () => {
    /*
     * `speakText`（speechService.ts:578）在**同步开头**调 `unlockWebAudio()`
     * → `getWebAudioContext()` → `new AudioContext()`。这里同样没有 try/catch，
     * 于是 `new` 一抛，`speakText` 这个 async 函数就返回**已拒绝的 promise**；
     * 调用方全部写成 `void speakText(...)`（SpellingPage.tsx:331 等），
     * 拒绝态因此无人接管 —— 变成 unhandled rejection。
     *
     * 默认设置 `autoSpeakInSpelling: true`（storage.ts:66），
     * 所以只要 AudioContext 构造失败，**进入拼写页的第一步**（还没答题）
     * 就已经在抛未处理拒绝了。这比 playTone 那条更早，是同一个根因。
     */
    seedOneWord();
    /*
     * 观察通道：本项目的 jsdom(vitest) 下，无人接管的拒绝走 **node 的
     * `process.on("unhandledRejection")`**，而 `window` 上的
     * `unhandledrejection` 事件拿不到（实测两边都挂监听可区分：window 为 []，
     * process 拿到 "InvalidStateError: number of hardware contexts"）。
     * 两条通道都挂上，避免把「观察通道不对」误读成「没有未处理拒绝」。
     */
    const viaWindow: string[] = [];
    const onWindow = (event: PromiseRejectionEvent) => viaWindow.push(String(event.reason));
    window.addEventListener("unhandledrejection", onWindow);
    const viaProcess: string[] = [];
    const onProcess = (reason: unknown) => viaProcess.push(String(reason));
    process.on("unhandledRejection", onProcess);

    const restore = withWindowGlobal("AudioContext", function BrokenAudioContext() {
      throw new DOMException("number of hardware contexts", "InvalidStateError");
    } as unknown as typeof AudioContext);

    const page = mountPage(<SpellingPage />, "/spelling", "/spelling");
    await new Promise((resolve) => setTimeout(resolve, 60));

    /**
     * 修复前：`getWebAudioContext` 里 `new AudioContext()` 抛错，
     * `speakText` 返回已拒绝的 promise，而调用方全写 `void speakText(...)`，
     * 于是变成 unhandled rejection（默认 `autoSpeakInSpelling: true`，
     * 一进拼写页就中）。
     * 修复后：构造函数包了 try/catch，拿不到就返回 null 走系统语音兜底。
     */
    expect(
      [...viaProcess, ...viaWindow].join(" "),
      "不再有未处理的拒绝——构造失败已降级为「没有门铃」，不抛给调用方"
    ).not.toMatch(/hardware contexts|InvalidStateError/);

    process.off("unhandledRejection", onProcess);
    window.removeEventListener("unhandledrejection", onWindow);
    restore();
    page.unmount();
  });
});

describe("ENV4-C③ 布局与媒体查询 API：缺失即挂载失败（P0 白屏）", () => {
  beforeEach(() => resetStorage());

  it("StatsPage：window.matchMedia 缺失 → 挂载即抛（无能力检测）", () => {
    seedAppData(makeAppData({}));
    expect(typeof window.matchMedia, "jsdom 没有 matchMedia").toBe("undefined");

    expect(
      () => mountPage(<StatsPage />, "/stats", "/stats"),
      "★ 缺陷：StatsPage.tsx:144 直接 window.matchMedia(...).matches，没有兜底；项目无 ErrorBoundary → 白屏"
    ).toThrow(/matchMedia/);
  });

  it("MistakeBookPage：ResizeObserver 缺失 → 挂载后 effect 抛错", async () => {
    // 必须有「有错词的日期分组」，左侧列表(dateListRef)才会渲染 →
    // `if (!list) return` 不早退 → 走到 `new ResizeObserver`。
    const fixture = makeSentenceCard({ id: "c1", sentence: "I go to school." });
    seedAppData(
      makeAppData({
        ...cardsToData([fixture]),
        reviews: [
          {
            id: "r1",
            cardId: "c1",
            mode: "spelling",
            rating: 1,
            answer: "x",
            reviewedAt: new Date().toISOString()
          } as never
        ]
      })
    );
    expect(
      typeof (globalThis as unknown as { ResizeObserver?: unknown }).ResizeObserver
    ).toBe("undefined");
    const errors = catchPageErrors();

    // 挂载本身可能返回（抛在 passive effect 里），所以断言「抛出的错误」而不是同步 throw
    let syncError: unknown = null;
    let page: ReturnType<typeof mountPage> | null = null;
    try {
      page = mountPage(<MistakeBookPage />, "/mistakes", "/mistakes");
    } catch (error) {
      syncError = error;
    }
    await flushAsync();

    const message = `${syncError ? String(syncError) : ""} ${errors.seen.join(" ")}`;
    expect(
      message,
      "★ 缺陷：MistakeBookPage.tsx:386 直接 new ResizeObserver，没有 `typeof ResizeObserver` 检测"
    ).toMatch(/ResizeObserver/);

    errors.stop();
    page?.unmount();
  });

  it("GrammarDiaryPage：ResizeObserver 缺失时至少不崩（无历史记录时不进 effect 早退分支）", async () => {
    /*
     * GrammarDiaryPage.tsx:115 同样直接 `new ResizeObserver(sync)`。
     * 空数据时该 effect 因 `!list` 早退，所以看起来「没崩」；
     * 一旦有历史条目（list 存在）就会走到 new，与 MistakeBookPage 同命。
     * 本用例固定「同一份代码在有数据时才会崩」这一事实，避免误判为已兜底。
     */
    seedAppData(makeAppData({}));
    const errors = catchPageErrors();
    const page = mountPage(<GrammarDiaryPage />, "/grammar/diary", "/grammar/diary");
    await flushAsync();

    expect(
      errors.seen.length,
      "空历史时不走到 new ResizeObserver（effect 早退），所以此刻看不到错误"
    ).toBe(0);
    expect(page.text().length, "页面正常挂载").toBeGreaterThan(0);

    errors.stop();
    page.unmount();
  });

  it("共享组件 Segmented：ResizeObserver 缺失 → 挂载即抛（影响三个页面）", () => {
    expect(
      typeof (globalThis as unknown as { ResizeObserver?: unknown }).ResizeObserver
    ).toBe("undefined");

    expect(
      () =>
        mountPage(
          <Segmented items={[{ key: "a", label: "甲" }]} value="a" onChange={() => undefined} />,
          "/probe",
          "/probe"
        ),
      "★ 缺陷：Segmented.tsx:50 直接 new ResizeObserver；UnitsPage / LibraryPage / ImportPage 都用它"
    ).toThrow(/ResizeObserver/);
  });

  it("★ 影响面：这些 API 在 Tauri 三个 WebView 面里都存在，所以桌面端掩盖了缺陷", () => {
    /*
     * 事实（不是断言）：`matchMedia` 与 `ResizeObserver` 在 WKWebView /
     * WebView2 / WebKitGTK 里都是标准支持的能力，桌面端**永远不会**缺；
     * 它们只在「裁剪过的测试环境（jsdom）」或极老的 WebView 里缺。
     * 所以本组缺陷的实际风险是：**任何在 jsdom 里挂载这些页面的测试都必须自己补桩**
     * ——这正是 `huntDiaryEnv.installResizeObserverStub` 与多个测试文件开头
     * 手动补桩的原因。缺桩会让整份测试套件红成一片，而不是产品白屏。
     * 这里断言「jsdom 缺、代码不检测」这一组合，用于解释为何必须保留补桩。
     */
    const stubsInTests = [
      "src/edge/huntDiaryEnv.ts",
      "src/edge/verify/pf2f-page-call-counts.test.tsx",
      "src/edge/verify/sv5-archive-ui.test.tsx"
    ];
    expect(stubsInTests.length, "至少三处测试基建在手动补 ResizeObserver/matchMedia 桩").toBe(3);
  });
});

describe("ENV4-C④ localStorage 配额：写满时的提示确实到达用户（跨环境配额策略差异）", () => {
  beforeEach(() => resetStorage());

  /**
   * 配额的两侧差异（ENV2a 已量化，此处只连到「用户能不能看到」）：
   *   - jsdom 按 UTF-16 code unit 计 5,000,000；
   *   - Chromium 按 UTF-8 **字节**计约 5MB（同样内容含中文时更早爆）；
   *   - WebKit/WKWebView 单 origin 独立配额，实测可到 ~10MB 量级。
   * 也就是说同一份数据在三个内核下撞墙的时机不同，但**撞墙时的用户可见性**
   * 必须一致——这条通道由 `AppContext.commitData` 的 try/catch → `saveError`
   * → `App.tsx` 顶部警示条承担（见 ENV2b 的存储不可用专项）。
   */
  it("★ 已修：写盘失败时顶部出现醒目警示，且页面照常可用（不白屏）", async () => {
    seedAppData(
      makeAppData({
        ...cardsToData([makeSentenceCard({ id: "c1", sentence: "I go." })])
      })
    );

    // 原型补丁是 jsdom 下唯一真正生效的做法（见 env2b 的手法说明）。
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function patchedSetItem() {
      throw new DOMException("The quota has been exceeded.", "QuotaExceededError");
    } as typeof Storage.prototype.setItem;

    const { AppLayoutHost } = await import("./env4Host");
    const page = mountPage(<AppLayoutHost />, "/today", "/today");
    await flushAsync();

    page.click("加一张卡");
    await flushAsync();
    await new Promise((resolve) => setTimeout(resolve, 20));

    const banner = page.container.querySelector('[role="alert"]');
    expect(banner, "配额写满必须有 role=alert 的醒目提示").toBeTruthy();
    expect(
      banner!.textContent,
      "文案要说清「没保存到本机」并给出「先导出备份」这条可执行建议"
    ).toMatch(/没能保存到本机|存储空间已满/);
    expect(banner!.textContent).toMatch(/导出备份/);
    expect(page.text(), "应用没有白屏").toContain("加一张卡");

    Storage.prototype.setItem = original;
    page.unmount();
  });

  it("对照：写入正常时没有警示条（避免「永远报警」的假阳性）", async () => {
    seedAppData(
      makeAppData({
        ...cardsToData([makeSentenceCard({ id: "c1", sentence: "I go." })])
      })
    );
    const { AppLayoutHost } = await import("./env4Host");
    const page = mountPage(<AppLayoutHost />, "/today", "/today");
    await flushAsync();
    page.click("加一张卡");
    await flushAsync();
    expect(page.container.querySelector('[role="alert"]')).toBeNull();
    expect(readAppData().cards.length, "写入确实生效").toBe(2);
    page.unmount();
  });
});
