# Web API 跨环境兼容性专项验证（Tauri WebView × 浏览器）

日期：2026-09-22 ｜ 范围：`src/services/*`、`src/pages/*`、`src/components/*` 中所有依赖 Web API 且在
**Tauri 桌面端**与**浏览器**下行为可能不同的调用点。
**未修改任何 `src/` 下的产品代码**（只新增测试）。

---

## 0. 结论摘要

| # | 问题 | 位置 | 环境 | 严重度 | 状态 |
|---|---|---|---|---|---|
| 1 | `window.matchMedia` 缺失即抛 → 整页挂载失败（项目无 ErrorBoundary） | `src/pages/StatsPage.tsx:144` | 任何裁剪过的 WebView / 老内核 | **P0 白屏** | 可疑但未在真机复现（桌面三面都有该 API） |
| 2 | `new ResizeObserver` 无能力检测 → 挂载期 effect 抛错 | `src/components/Segmented.tsx:50`、`src/pages/MistakeBookPage.tsx:386`、`src/pages/GrammarDiaryPage.tsx:115` | 同上 | **P0 白屏** | 可疑但未在真机复现 |
| 3 | `new AudioContext()` 抛错（硬件上下文耗尽）→ **作答丢失且无提示** | `src/pages/SpellingPage.tsx:343` | WKWebView / WebView2 / WebKitGTK | **P0 静默丢数据** | **已复现（jsdom 合成）**：`reviews` 不增、反馈区停在「提交」 |
| 4 | 同一根因更早的失败点：`void speakText(...)` 吞掉 rejected promise | `src/services/speechService.ts:212` → `585`，调用方 `SpellingPage.tsx:330` | 同上 | **P1 未处理拒绝** | **已复现**：`process.on("unhandledRejection")` 收到 `InvalidStateError` |
| 5 | 5 处导出入口忽略 `downloadTextFile` 返回值 → 失败仍显示成功文案 | `SettingsPage.tsx:982/986/1005/1013/1021`、`GrammarPathPage.tsx:652`、`LibraryPage.tsx:595` | 任何 `URL.createObjectURL` 受限的环境 | **P1 谎报成功** | **已复现**（`createObjectURL` 缺失时无任何失败提示 / 页面仍切「已导出」） |
| 6 | `speechSynthesis` 存在但 `speak()` 永不回调 → `speakText` 仍返回 `true` | `src/services/speechService.ts:557-576` | Linux WebKitGTK（缺 speech-dispatcher） | P1 静默无效果 | 可疑但未证实（需真机；本文件固定的是「返回值不依赖任何发音回调」） |
| 7 | 插件抛的是**字符串**而非 Error → 真实原因被替换成通用文案 | `aiHttpClient.ts:146-154`、`syncService.ts:151-157` | Tauri（作用域拒绝 / 网络层错误） | P2 排障困难 | **已复现**（`describeModelRequestError` 对字符串只给兜底） |
| 8 | 桥接路由只在 dev/preview 存在，loopback 静态托管下会 404 | `aiHttpClient.ts:60-66` × `vite.config.ts` `apply: "serve"` | 浏览器（`dist/` 自建静态服务器） | P2 只在非常规打开方式下出现 | **已确认（源码）**：`toRelayBridgeUrl` 只看页面 origin，不看服务端是否有该路由 |
| — | Tauri 下 `<a download>` **可用** | wry `lib.rs:830` 默认 `Some(|_,_| true)` | 三平台 | — | **经源码核对，此前「桌面导出静默失败」的猜测不成立** |
| — | Tauri 插件 `fetch` 返回值与标准 `Response` 字段一致 | `plugin-http/dist-js/index.js:153-176` | Tauri | — | **已确认**：调用方用到的 `ok/status/text()/json()` 全部存在 |

「产品代码在本轮期间被并行修复」的说明见 §5。

---

## 1. API × 环境 × 能力检测 × 失败行为表

| API / 能力 | 使用点 | Tauri(macOS WKWebView) | Tauri(Win WebView2) | Tauri(Linux WebKitGTK) | 浏览器 | 有**能力检测**？ | 缺失时 | 抛错时 | 用户能看到吗 |
|---|---|---|---|---|---|---|---|---|---|
| `URL.createObjectURL` + `<a download>` | `storage.ts:1662` `downloadTextFile` | ✅ wry 默认放行下载 | ✅ | ✅ | ✅（http/https 均可） | ✅ `typeof URL?.createObjectURL !== "function"` → `false` | 返回 `false`（**不抛**） | try/catch → `false` | 2 个唯一出口**能**（error 文案）；**其余 5 处不能**（忽略返回值） |
| `navigator.clipboard.writeText` | `clipboardService.ts:64` → `MistakeBookPage.tsx:626` | ✅ 安全上下文 | ⚠️ 需 `enable_clipboard_access()`，本应用**未开**（tauri-runtime 默认 `clipboard:false`） | ⚠️ 同上 | ⚠️ 仅 https / localhost / 127.0.0.1 | ✅ `clipboard && typeof writeText === "function"` | → 降级 `execCommand("copy")`；仍失败返回 `false` | `try/catch` → 降级 | ✅ 失败时 `role="alert"`「没能复制到剪贴板，可以手动选中上面的文字复制。」 |
| `document.execCommand("copy")`（降级路径） | `clipboardService.ts:30-56` | ✅ | ✅ | ✅ | ✅（无需安全上下文） | ✅ `typeof document.execCommand !== "function"` → `false` | 返回 `false` | try/catch → `false` | ← 由上面的 alert 承担 |
| `window.speechSynthesis` / `SpeechSynthesisUtterance` | `speechService.ts:64` `isSpeechSupported` | ✅ | ✅ | ❌ 常缺（无 speech-dispatcher） | ✅ 桌面；❌ 部分环境 | ✅ `"speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined"` | `speakText` → `false`（链末兜底） | — | ⚠️ 设置页有「浏览器语音引擎：不可用」诊断行；**页面内的发音按钮无提示**（点不动也无声） |
| `window.speechSynthesis.speak()` 静默无效果 | `speechService.ts:574` | ✅ | ✅ | ⚠️ 存在但不发音 | ⚠️ | ✅（但只检测存在性） | — | — | ❌ **不能**：`speakWithSystemVoice` 不看任何回调即 `return true`；设置页会显示「试听已播放」 |
| `AudioContext`（答题音效） | `SpellingPage.tsx:339-343` `playTone` | ✅ | ✅ | ✅ | ✅ | ✅ `if (!AudioContextClass) return` | 静默跳过音效（**不影响作答**） | ❌ **无 try/catch** → 异常打断 `setData` | ❌ **不能**：无判分反馈、无提示、作答未落盘 |
| `AudioContext`（在线音源播放） | `speechService.ts:207-214` `getWebAudioContext` | ✅ | ✅ | ✅ | ✅ | ✅ `if (!AudioContextConstructor) return null` | 返回 null，链继续降级 | ❌ **无 try/catch** | ❌ 不能：`void speakText(...)` 吞掉拒绝态 |
| `window.matchMedia` | `StatsPage.tsx:144` | ✅ | ✅ | ✅ | ✅ | ❌ **无** | 直接抛 `TypeError` | — | ❌ **不能**：挂载即失败 → 白屏 |
| `ResizeObserver` | `Segmented.tsx:50`、`MistakeBookPage.tsx:386`、`GrammarDiaryPage.tsx:115` | ✅ | ✅ | ✅ | ✅ | ❌ **无** | 直接抛 `ReferenceError` | — | ❌ **不能**：白屏（前两个）／有数据时才走到（第三个） |
| `localStorage` 配额 | `storage.ts` `writeRaw` / `AppContext.commitData` | WebKit 独立配额（~10MB 量级） | 约 5MB（UTF-8 字节） | 同 WebKit | 约 5MB | ✅ `hasLocalStorage()`（另见 ENV2b） | 静默降级到内存 | ✅ try/catch → `saveError` | ✅ `App.tsx:195` 顶部 `role="alert"` +「先导出备份」建议 |
| `document.fonts.ready` | `Segmented.tsx:52` | ✅ | ✅ | ✅ | ✅ | ✅ 可选链 `document.fonts?.ready` | 跳过测量 | — | — 无影响（thumb 仍由 `measure()` 初值定位） |
| `window.scrollTo` | 6 处（`GrammarLessonPage` ×6、`GrammarBoostPage:401`、`GrammarReviewPage:205`） | ✅ | ✅ | ✅ | ✅ | ❌ 无（**也无需**：三平台均实现） | — | — | — 无影响 |
| `navigator.platform` | `LibraryPage.tsx:168` | ✅ | ✅ | ✅ | ✅（`navigator.platform` 已废弃但仍在） | ✅ `typeof navigator !== "undefined" &&` | `isMac=false` → 只影响 ⌘K 与 Ctrl+K 的选择 | — | — 极低 |
| `getBoundingClientRect` / `scrollIntoView` / `range.getBoundingClientRect` | `AppSelect.tsx:101/108`、`MistakeBookPage.tsx:513/708/721`、`LibraryPage.tsx:392`、`AdventurePlayPage.tsx:625/767/844/1413` | ✅ | ✅ | ✅ | ✅ | 多数用可选链 `?.` | 静默跳过定位 | — | ⚠️ 弹层可能停在默认位置（体验级） |
| `AbortController` + `AbortSignal` | 8 处 AI 服务 + `pronunciationService.ts:113` | ✅（插件透传 `signal`） | ✅ | ✅ | ✅ | 仅 `pronunciationService` 做 `typeof AbortController !== "undefined"` | — | — | — 无影响 |
| Tauri IPC（`plugin:http`） | `aiHttpClient.ts:68-74` | ✅ | ✅ | ✅ | — 不适用 | ✅ `isTauriRuntime()`（`window.__TAURI_INTERNALS__`） | — | ⚠️ 抛**字符串**（见 §3.3） | ⚠️ 通用兜底文案 |

---

## 2. 已确认的缺陷

### D-1（P0 · 静默丢数据）答题音效抛错会吃掉这次作答

- **文件:行号**：`src/pages/SpellingPage.tsx:339-343`（`playTone` 内 `new AudioContextClass()`），调用点 `:444`，其后是 `:457` 的 `setData(graduation.data)`
- **复现方式**

  ```ts
  // 硬件 AudioContext 数量达上限时 WebKit 会抛 InvalidStateError
  window.AudioContext = function () {
    throw new DOMException("number of hardware contexts is greater than or equal to the maximum bound", "InvalidStateError");
  };
  // 挂载 SpellingPage → 输入正确答案 → 点「提交」
  ```

- **实际**：异常从 `submitAnswer` 逃出 → `reviews` **不增（=0）**、`has("自动进入下一题")` 为 `false`、反馈区停在「提交」。测试还确认页面文本里**没有任何**「音效/声音/没能/请再试」字样。
- **期望**：音效是锦上添花，任何音频异常都不该影响作答落盘。最小修复是给 `new AudioContextClass()` 包 try/catch（缺失分支已有 `if (!AudioContextClass) return`，只差抛错分支）。
- **用户会看到什么**：「我点了提交，它没反应」——判分与翻页都没发生，只能再点一次；如果每次构造都失败，这一题会一直答不下去。
- **严重度**：**P0（静默丢数据）**。判定依据：`reviews` 是 SM-2 排期与统计的唯一来源，漏一条即用户当次作答不可恢复；且用户无法区分「卡住了」与「我点错了」。
- **测试**：`env4c-missing-apis.test.tsx` → `★ P0：AudioContext 存在但构造抛错（硬件上下文耗尽）→ 作答丢失且无提示`

### D-2（P1 · 未处理拒绝）同一根因更早的失败点：挂载时就在抛

- **文件:行号**：`src/services/speechService.ts:212`（`getWebAudioContext` 内 `new AudioContextConstructor()`）→ `:585`（`speakText` 同步开头 `unlockWebAudio()`）→ 调用方 `src/pages/SpellingPage.tsx:330`（`void speakText(...)`）
- **复现方式**：沿用 D-1 的假 `AudioContext`，**只挂载** `SpellingPage`（`autoSpeakInSpelling` 默认为 `true`，见 `storage.ts:66`），不点任何按钮。
- **实际**：`process.on("unhandledRejection")` 收到 `InvalidStateError: number of hardware contexts`。注：本环境里 `window` 上的 `unhandledrejection` 事件拿不到（实测 `window` 为 `[]`、`process` 有值），两条通道都监听才能观察到。
- **期望**：`unlockWebAudio()` 与 `playTone` 同属「非关键路径」，应就地吞掉构造异常。
- **用户会看到什么**：进入拼写页就没有声音（自动发音失效），且**没有任何提示**；开发者侧只有未被接管的拒绝。
- **严重度**：**P1**（功能不可用且无提示；比 D-1 少一个「丢数据」后果）。
- **测试**：`env4c-missing-apis.test.tsx` → `★ P0（更早的失败点）：自动发音打开时，挂载就会抛出未处理的 promise 拒绝`

### D-3（P1 · 谎报成功）5 处导出入口忽略 `downloadTextFile` 的返回值

- **文件:行号**
  - `src/pages/SettingsPage.tsx:982`（Anki CSV）、`:986`（Markdown 笔记）、`:1005`（词书遥测）、`:1013`（语法遥测）、`:1021`（设置遥测）
  - `src/pages/GrammarPathPage.tsx:652`（学习数据导出）→ 同函数 `:653` 无条件 `setExported(true)`
  - `src/pages/LibraryPage.tsx:595` → 同函数 `:596-600` 无条件 `setBulkMessage("已导出 N 张卡片…")`
- **复现方式**：删掉 `URL.createObjectURL`（jsdom 天然如此；真实环境对应「受限 WebView / 策略拦截」），然后逐个点这些按钮。
- **实际**
  - 设置页 5 个按钮：页面文本中**匹配不到任何**失败文案（`/没能生成文件|导出失败|没能导出|这次导出/` 全为 false）。
  - 语法页：点击后 `page.has("已导出")` 为 `true` —— 按钮文案切成「已导出，可再次导出」。
  - 库页：`setBulkMessage` 无条件执行，提示「已导出 N 张卡片。」。
- **期望**：与已修的两处（`SettingsPage.tsx:403`、`OnboardingGuide.tsx:83`）口径一致——先判断返回 `true` 再写成功态，否则给 `role="alert"` 级失败文案。
- **用户会看到什么**：点「Anki CSV」什么都不发生；语法页显示「已导出」但下载目录里没有文件；库页显示「已导出 3 张卡片」但同样没有文件。
- **严重度**：**P1**（功能不可用且被谎报为成功）。非 P0 的理由：这 7 处导出的产物都是**派生/辅助**数据（Anki 卡、Markdown 笔记、遥测快照），不承载唯一的用户进度；唯一承载进度的 JSON 备份已修。
- **测试**：`env4a-export-clipboard.test.tsx` → 描述块 `ENV4-A④`

### D-4（P2 · 排障困难）Tauri 插件抛字符串，`describeModelRequestError` 把真实原因换成通用兜底

- **文件:行号**：`src/services/aiHttpClient.ts:146-154`（`describeModelRequestError`）、`src/services/syncService.ts:151-157`（`describeSyncError`）
- **复现方式**

  ```ts
  window.__TAURI_INTERNALS__ = { invoke: async (cmd) => { if (cmd === "plugin:http|fetch") throw "url not allowed on the configured scope: https://blocked.example/v1"; ... } };
  await requestFetch("https://blocked.example/v1/chat/completions", { method: "POST" });
  ```

- **实际**：投出来的值是 `typeof === "string"`、`instanceof Error === false`（源码依据：`tauri-2.11.5/src/ipc/mod.rs:229-234` `InvokeError::from_error` → `serde_json::Value::String(error.to_string())`）。于是：
  - `describeModelRequestError("url not allowed on the configured scope: …")` → `"无法连接 AI 中转站，请检查网络和 Base URL。"`（**原始文案完全丢失**）
  - `describeSyncError(同一个字符串)` → `"云同步失败，请检查网络和服务地址。"`（连原始文案都没有；但**包成 `Error` 时原文会透出**，说明问题只在形状）
- **期望**：对 `unknown` 输入先做 `String(error)` 兜底再匹配关键词（浏览器侧 `TypeError("Load failed")` 已被正确识别成 CORS 提示，两侧口径不一致）。
- **用户会看到什么**：作用域被拒 / 网络层失败时只看到「请检查网络和 Base URL」，但 Base URL 明明是对的（真实原因是 URL 不在 allow 列表里，或 reqwest 层连不通）。
- **严重度**：**P2**（不丢数据、不白屏，只影响排障）。附注：本应用 `src-tauri/capabilities/default.json` 的 `http:default.allow` 是 `http://*:*` + `https://*:*`，经 urlpattern 实测覆盖所有 http/https 主机与端口，**当前配置不会触发作用域拒绝**；此条是为将来收紧 allow 列表时留的隐患。
- **测试**：`env4d-transport.test.ts` → `ENV4-D②`、`ENV4-D④`

### D-5（P2 · 只在非常规打开方式下出现）桥接路由只在 dev/preview 存在

- **文件:行号**：`src/services/aiHttpClient.ts:60-66`（`toRelayBridgeUrl`）与 `vite.config.ts` 的 `aiRelayBridge`（`apply: "serve"` + `configurePreviewServer`）
- **复现方式**：`npm run build` 后把 `dist/` 挂到任意 loopback 静态服务器（如 `python3 -m http.server 8080`），在设置里填 `http://127.0.0.1:7865/v1` 的中转站。
- **实际**：`toRelayBridgeUrl` 的放行条件只有「页面 origin 是 loopback」，于是 URL 被改写成 `<静态服务器>/__ai-relay__/127.0.0.1:7865/v1/chat/completions` → 404。
- **期望**：改写条件里带上「当前确实有桥接服务」的判据（例如只在 `import.meta.env.DEV` 或 preview 端口上启用），否则保留原 URL，让浏览器如实报 CORS。
- **用户会看到什么**：提示「无法连接 AI 中转站（可能是网络、CORS 或地址不可达）」——与真实原因（路由不存在）不符，用户会反复检查 Base URL。
- **严重度**：**P2**。桌面端不受影响（Tauri 的页面 origin 是 `tauri://localhost` / `http://tauri.localhost`，`isLoopbackRelayUrl(pageOrigin)` 为 `false`，不会改写）。
- **测试**：`env4d-transport.test.ts` → `ENV4-D③` 的后两条

### D-6（P1 · 静默无效果，可疑）`speechSynthesis` 存在但不发音时无任何办法察觉

- **文件:行号**：`src/services/speechService.ts:557-576`（`speakWithSystemVoice` 末尾 `window.speechSynthesis.speak(utterance); return true;`）
- **复现方式**

  ```ts
  window.speechSynthesis = { speak: () => {}, cancel: () => {}, getVoices: () => [], speaking: false, paused: false, addEventListener: () => {}, removeEventListener: () => {}, pause: () => {}, resume: () => {} };
  globalThis.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };
  await speakText("hello world", { systemOnly: true, lang: "en-US" });  // → true
  ```

- **实际**：返回 `true`，**且从不检查 `utterance.onstart` 是否被回调**。设置页 `previewVoice`（`SettingsPage.tsx:303`）据此显示「试听已播放…当前设置会用于听写和发音按钮」。
- **期望**：给 `speak()` 加一个「N 毫秒内 `onstart` 未触发即视为失败」的超时判据（在线音源路径已有同类做法：`speechService.ts:45` 定义 `AUDIO_START_TIMEOUT_MS = 2500`，`:400-411` 用它兜「started 事件没来」）。音频路径有超时判据而系统语音路径没有，两套口径不一致。
- **用户会看到什么**：Linux 桌面端点「试听」→ 看到「试听已播放」→ **没有声音**。用户会去反复调音量/换声音，而不是意识到是系统缺 speech-dispatcher。
- **严重度**：**P1（功能不可用无提示）**，但**属「可疑但未证实」**：本测试只能固定「返回值不依赖任何发音回调」这一**代码事实**；「Linux WebKitGTK 上确实存在这种状态」需要真机验证（`speechSynthesis` 与 `SpeechSynthesisUtterance` 都在，但 `speak()` 静默失败）。
- **测试**：`env4c-missing-apis.test.tsx` → `★ 可疑：speechSynthesis 存在但 speak() 永不触发时，speakText 仍返回 true`

### D-7（P0 · 白屏，可疑）`matchMedia` / `ResizeObserver` 没有任何能力检测

- **文件:行号**：`src/pages/StatsPage.tsx:144`（`window.matchMedia("(max-width: 860px)").matches`，在 `useState` 初值里**同步求值**）；`src/components/Segmented.tsx:50`、`src/pages/MistakeBookPage.tsx:386`、`src/pages/GrammarDiaryPage.tsx:115`（`new ResizeObserver(...)`，在 effect 里）
- **复现方式**

  ```ts
  // jsdom 天然如此（见文件开头的探针）
  expect(typeof window.matchMedia).toBe("undefined");
  expect(typeof globalThis.ResizeObserver).toBe("undefined");
  mountPage(<StatsPage />, "/stats", "/stats");           // → throws TypeError: window.matchMedia is not a function
  mountPage(<MistakeBookPage />, "/mistakes", "/mistakes"); // → window error: ReferenceError: ResizeObserver is not defined
  ```

- **实际**
  - `StatsPage`：**同步抛出**（`useState` 初值），挂载失败。
  - `MistakeBookPage`：同步返回、错误抛在 passive effect，经 `window` 的 error 事件上报；**前提是有错词分组**（左侧列表要渲染出来，否则 `if (!list) return` 早退）。
  - `GrammarDiaryPage`：空历史时 effect 早退 → 看不到错误；有历史条目时走到 `new`，与 `MistakeBookPage` 同命。
  - `Segmented`：同步抛出，而 `UnitsPage` / `LibraryPage` / `ImportPage` 三个页面都在用。
- **期望**：`typeof window.matchMedia === "function"` / `typeof ResizeObserver === "function"` 守卫（`Segmented.tsx:52` 对 `document.fonts?.ready` 已经这么做了，同一文件内口径不一致）。
- **用户会看到什么**：白屏。项目**没有 ErrorBoundary**（见 `reviewService.ts:65`、`storage.ts:1296` 与多个测试文件的既有结论），挂载期异常直接导致白屏，用户连导出备份自救的机会都没有。
- **严重度**：标 **P0**（白屏），但**属「可疑但未证实」**：`matchMedia` 与 `ResizeObserver` 在 WKWebView / WebView2 / WebKitGTK 三面都是标准支持的能力，**真实 Tauri 与主流浏览器不会缺**。它的实际影响面分两块：
  1. **测试基建**：任何在 jsdom 里挂载这些页面的测试都必须自己补桩——`src/edge/huntDiaryEnv.ts:15`、`src/edge/verify/pf2f-page-call-counts.test.tsx:144`、`src/edge/verify/sv5-archive-ui.test.tsx:22` 等处都在手动补。缺桩会让整份测试套件红成一片（假红），掩盖真实问题。
  2. **老内核**：极老的 WebView / 关闭了相关特性的内嵌浏览器会真的白屏。
  **建议**：按「测试基建一致性」而非「用户可见故障」定级——除非真机确认某个目标平台确实缺这两个 API。
- **测试**：`env4c-missing-apis.test.tsx` → `ENV4-C③`

---

## 3. Tauri 特有约束的逐条核对

### 3.1 `@tauri-apps/plugin-http` 的 `fetch` 与浏览器 `fetch` 的返回类型

`requestFetch`（`aiHttpClient.ts:68-74`）里 `as Response` 是**纯类型断言**，不做任何转换。逐字段核对结论：**一致**。

依据：插件在 `node_modules/@tauri-apps/plugin-http/dist-js/index.js:153-176` 里
`new Response(body, { status, statusText })`（**原生 Response 实例**，本文件已断言 `response instanceof Response`），
再用 `Object.defineProperty` 补上 `url` 与 `headers`。

| 字段 | 浏览器 `fetch` | Tauri 插件 | 调用方是否使用 |
|---|---|---|---|
| `.ok` | ✅ | ✅（由 `status` 派生） | ✅ 8 处 `if (!response.ok)` |
| `.status` | ✅ | ✅ | ✅ `postChatCompletion:140`、5 处错误文案 |
| `.text()` | ✅ | ✅ | ✅ `readResponsePayload:193`、`syncService` ×3 |
| `.json()` | ✅ | ✅ | ✅ `readResponsePayload:210` 兜底 |
| `.headers` | ✅ | ✅（插件显式补上） | ❌ 未使用 |
| `.url` | ✅ | ✅（插件显式补上） | ❌ 未使用 |
| `.clone()` | ✅ | ✅（插件逐实例 patch 保留 url/headers） | ❌ 未使用 |
| 错误时的异常类型 | `TypeError` | **字符串** | ✅ `describeModelRequestError` ← 见 D-4 |

**结论**：`ok / status / text / json` 四者在两侧都存在且语义一致，`as Response` 断言在实践中安全。
唯一真实差异是**错误形状**（浏览器抛 `Error`，插件抛字符串），已在 D-4 记录。

### 3.2 CORS：桌面绕过、浏览器受限 → 是否存在「桌面能用、浏览器不能用」的配置？

**存在，且代码已经在尽力抹平**。三个层次：

1. **远程 https 中转站**：两侧都可用。桌面走 Rust reqwest（无 CORS 概念）；浏览器受 CORS 约束——但中转站只要返回标准 CORS 头就可以。**这里没有提示用户**：设置页 `SettingsPage.tsx:842` 的说明只讲「兼容 OpenAI Chat Completions 格式」「API Key 只保存在本机」，没有一句「桌面端可绕过 CORS、浏览器端需要中转站自己开 CORS」。用户在浏览器上填一个不开 CORS 的 https 中转站时会得到「无法连接 AI 中转站（可能是网络、CORS 或地址不可达）」——这句话里**确实提到了 CORS**（`aiHttpClient.ts:149`），算是有一半提示。

2. **loopback 中转站（`http://127.0.0.1:7865/v1` 这类）**：**这是「桌面能用、浏览器不能用」的典型**。桌面直接请求即可；浏览器下这是**跨源**请求，而本地网关（LM Studio / Ollama / 自建 relay）通常**不发 CORS 头**，OPTIONS 预检回 405 → 浏览器在请求发出前就拒绝。
   代码的应对是 `toRelayBridgeUrl` 把它改写成同源路径，由 dev server 做服务端到服务端的一跳（`vite.config.ts` 的 `relayBridgeMiddleware`，且只允许 loopback 目标，防开放代理）。
   **但 `SettingsPage.tsx:68` 的 Ollama 预设就是 `http://localhost:11434/v1`**，配合上面 D-5（桥接只在 dev/preview 存在），用 `dist/` 静态托管时这条路会 404。

3. **没有提示用户的部分**：设置页没有「当前是浏览器版，本机中转站需要服务端支持」这类说明，也没有把「浏览器 / 桌面」的差异写进任何 `field-hint`。桌面端用户唯一能绕过 CORS 而浏览器不能这件事，用户无从得知。

### 3.3 Tauri 权限与配置现状（核对，非缺陷）

- `src-tauri/capabilities/default.json`：`core:default` + `http:default` with `allow: [{url:"https://*:*"},{url:"http://*:*"}]`。经 urlpattern 0.3.0 实测：`https://*:*` 不匹配 `http://…`，`http://*:*` 不匹配 `https://…`，两者合起来覆盖所有 http/https 主机与端口 → **当前不会触发作用域拒绝**。
- `src-tauri/src/lib.rs`：只注册 `tauri_plugin_sql` 与 `tauri_plugin_http`，**未注册 `on_download`** → 走 wry 的 `download_started_handler: Some(Box::new(|_, _| true))` 默认值（wry 0.55.1 `lib.rs:830`）。WKWebView 面在 `shouldPerformDownload` 为真且 handler 存在时返回 `WKNavigationActionPolicy::Download`（`wkwebview/navigation.rs:69-74`），WebView2（`webview2/mod.rs:792+`）与 WebKitGTK（`webkitgtk/mod.rs:580+`）也在 handler 存在时接管 —— 三平台都会处理 `<a download>`，落盘到系统下载目录。
  → **此前怀疑的「Tauri 下点导出静默失败」不成立**，本文件把它固化成断言以免重复排查。
- `src-tauri/src/lib.rs` **未调用 `enable_clipboard_access()`**：tauri-runtime 的 `WebviewAttributes::clipboard` 默认 `false`（`tauri-runtime-2.11.3/src/webview.rs:516`），而 wry 的 clipboard 开关**只作用于 Linux/Windows**（`wry lib.rs:702-706` 注释 + `webview2/mod.rs:497` / `webkitgtk/mod.rs:433`）→ **Windows / Linux 桌面端的「网页里复制」权限未开**，`writeText` 可能被拒；macOS 不受影响。
  这条**不影响本轮结论的正确性**——`clipboardService` 的降级路径（`execCommand`）正好在权限被拒时接管，用户会看到「可以手动选中上面的文字复制」。但若希望桌面端「复制」按钮的默认体验是成功对勾，需要在 Rust 侧加一行 `enable_clipboard_access()`。

---

## 4. 「确认的缺陷」与「可疑但未证实」的分界

### 4.1 确认的缺陷（有可执行复现，本文件已固化为断言）

| 编号 | 一句话 | 复现位置 |
|---|---|---|
| D-1 | `AudioContext` 构造抛错 → 作答不落盘、无反馈、无提示 | `env4c` ENV4-C② 第 2 例 |
| D-2 | `void speakText` 吞掉 `unlockWebAudio` 的拒绝态 | `env4c` ENV4-C② 第 3 例 |
| D-3 | 7 处导出入口忽略返回值 → 失败仍报成功 | `env4a` ENV4-A④ |
| D-4 | 插件抛字符串 → 真实错误原因被通用兜底替换 | `env4d` ENV4-D② / D④ |
| D-5 | 桥接路由只在 dev/preview 存在 → 静态托管下 404 | `env4d` ENV4-D③ |

依据等级：D-1/D-2/D-3 是**行为级复现**（跑页面、观察 `localStorage` 与 DOM）；D-4 是**行为级 + 源码级**（假 IPC 桥 + `ipc/mod.rs` 依据）；D-5 是**源码级**（`toRelayBridgeUrl` 逻辑 + vite 插件 `apply` 声明）。

### 4.2 可疑但未证实（需要真机验证）

| 编号 | 疑点 | 为什么不能在本环境证实 | 需要什么才能定论 |
|---|---|---|---|
| D-6 | Linux WebKitGTK 上 `speechSynthesis` 存在但不发音，而 UI 显示「已播放」 | jsdom 没有真实的 speech 后端；本环境只能证明**代码层面不看回调**，证不了「某平台确实会静默失败」 | 在缺 speech-dispatcher 的 Linux 上跑 Tauri 包，点设置页「试听」，看是否有声音 + 是否显示「试听已播放」 |
| D-7 | `matchMedia` / `ResizeObserver` 缺失导致白屏 | 桌面三面都有这两个 API，真实 Tauri 不会缺；jsdom 的缺失只代表「测试环境」 | 若目标平台含老 WebView（如旧 WebKitGTK / 企业内嵌浏览器），需在该内核上实测；否则按「测试基建一致性」处理 |
| — | Tauri 下 `<a download>` 是否被平台策略拦 | 源码核对显示会放行，但没有真机点击过 | 在 macOS / Windows / Linux 三端各点一次「JSON 备份」，确认系统下载目录出现文件 |
| — | Windows/Linux 桌面端 `navigator.clipboard` 是否真被拒 | 未调用 `enable_clipboard_access()`，但不同 WebView 版本对剪贴板权限的实际执行松紧不一 | 在 Windows / Linux 桌面端点错词本「复制内容」，看是切对勾还是出提示 |
| — | `localStorage` 在 Tauri 中是否可能被系统清理（配额/隐私策略） | 属 OS 层行为，无法在测试里模拟 | 长期使用后清理 WebView 数据目录，确认应用是否走 ENV2b 的「读不到 → 新装」路径 |
| — | `AbortSignal` 经 Tauri IPC 传递后，`controller.abort()` 是否仍能取消 Rust 侧请求 | 插件源码里有 `signal?.addEventListener("abort", () => invoke('plugin:http|fetch_cancel', …))`，理论上成立；假 IPC 桥证不了真实取消 | 在 Tauri 里设一个很短的 `timeoutMs`，观察是否真的在超时后停止等待 |

---

## 5. 本轮期间产品代码被并行修复的说明

本轮验证开始时下面这些点还是缺陷，**在验证过程中被另一个进程修掉了**（文件 mtime 显示 22:07–22:10 的连续写入）。为避免报告与代码不符，这里明确记录：

| 位置 | 修复前 | 修复后 | 本轮角色 |
|---|---|---|---|
| `storage.ts` `downloadTextFile` | 无能力检测、无 try/catch、无返回值；`revokeObjectURL` 在 `click()` 后同步调用 | 返回 `boolean`；能力检测 + try/catch；blob URL 改到宏任务后释放 | **回归护栏**（`env4a` ENV4-A①） |
| `SettingsPage.tsx:398-412` `exportBackupJson` | 先 `setData(markDataExported(...))` 再导出；失败仍显示「已导出 JSON 备份」 | 先判 `downloadTextFile` 返回值，失败给 error 文案且不写 `lastExportedAt` | **回归护栏** |
| `OnboardingGuide.tsx:80-88` `exportBackup` | 同上 | 同上 | 回归护栏（未单测，与设置页同构） |
| `MistakeBookPage.tsx:612-616` `copyContent` | 裸 `await navigator.clipboard.writeText(content)`，失败仍 `setCopiedId`（打对勾） | 走新的 `clipboardService.writeToClipboard`，失败 `setCopyErrorId` + `role="alert"` 文案 | **回归护栏**（`env4b`） |
| 新增 `src/services/clipboardService.ts` | — | `writeToClipboard(text): Promise<boolean>`：能力检测 → `writeText` try/catch → `execCommand("copy")` 降级 | 被测对象（`env4b` ENV4-B①） |

**因此 D-3 的表述需要精确**：已修的 2 处（JSON 备份）是**承载用户唯一进度**的出口，已修；**未修的 7 处**（Anki CSV / Markdown 笔记 / 三类遥测 / 语法页学习数据 / 库页导出）仍是 P1，因为它们忽略返回值。

---

## 6. 我新增的测试文件与运行结果

| 文件 | 用例数 | 覆盖 |
|---|---|---|
| `src/edge/verify/env4a-export-clipboard.test.tsx` | 8 | `downloadTextFile` 能力检测与失败可见性（含已修的两处唯一出口 + 未修的 7 处）；`src-tauri/src/lib.rs` 未注册 `on_download` 的事实基线；capability allow 列表 |
| `src/edge/verify/env4b-clipboard.test.tsx` | 9 | `writeToClipboard` 的四种输入形态（缺失 / 被拒 / 正常 / 半对象）；错词本复制按钮的失败提示与成功对勾；`execCommand` 降级的独立覆盖 |
| `src/edge/verify/env4c-missing-apis.test.tsx` | 14 | `speechSynthesis`（存在性检测 + 静默不发音）；`AudioContext` 缺失 vs 抛错（D-1/D-2）；`matchMedia` / `ResizeObserver` 缺失（D-7）；配额写满时的 `role="alert"` 通道 |
| `src/edge/verify/env4d-transport.test.ts` | 19 | 插件 `Response` 字段对照（含分帧格式的真实模拟）；错误形状（字符串 vs Error）；CORS 三条路径；云同步字段；桥接路由只在 dev/preview |
| `src/edge/verify/env4Host.tsx` | — | 新增的最小宿主（只含 `AppProvider` + `saveError` 警示条 + 一个触发写入的按钮），用于观察配额提示 |

**运行结果**

```
$ npx vitest run src/edge/verify/env4a-export-clipboard.test.tsx src/edge/verify/env4b-clipboard.test.tsx \
                 src/edge/verify/env4c-missing-apis.test.tsx src/edge/verify/env4d-transport.test.ts

 ✓ env4d-transport.test.ts        (19 tests)
 ✓ env4b-clipboard.test.tsx        (9 tests)
 ✓ env4c-missing-apis.test.tsx    (14 tests)
 ✓ env4a-export-clipboard.test.tsx (8 tests)

 Test Files  4 passed (4)
      Tests  50 passed (50)
```

**类型检查**：`npx tsc --noEmit` → **0 error**。

**全量套件**：`npx vitest run` → `Test Files 2 failed | 224 passed (226)`，`Tests 4 failed | 2441 passed (2445)`。
失败项**全部与本轮无关**，且都是既有的「确认缺陷待修」记录型测试：

- `src/edge/verify/env1-export-download.test.ts`（3 条）——该文件是本轮之前写的，断言的是**修复前**的行为（「无兜底、会抛错」「同步 revoke」），产品代码本轮被修后自然过期。
- `src/edge/verify/env3a-ime-submit.test.tsx`（多条）——输入法专项的既有缺陷记录（IME 组词态回车、Shift+Enter、缺 `lang="en"` 等），属另一个正在进行的专项。

> **给维护者的提醒**：`env1-export-download.test.ts` 已被本轮修复推翻，建议与 `env4a` 合并或删除——同一函数现在有两份互相矛盾的断言。

---

## 7. 建议的修复优先级

1. **D-1 / D-2**（`AudioContext` 抛错吃掉作答）——同一个 `try/catch`，覆盖 `SpellingPage.tsx:343` 与 `speechService.ts:212`；D-1 是唯一「静默丢数据」的缺陷，优先修。
2. **D-3**（7 处导出忽略返回值）——机械改动，与已修的两处保持一致口径。
3. **D-7**（`matchMedia` / `ResizeObserver` 守卫）——若只服务测试环境，也可以选择把补桩统一收进 `src/edge/harness.tsx`（现状是至少 3 处各写一遍）。
4. **D-6**（系统语音的超时判据）——复用 `AUDIO_START_TIMEOUT_MS` 的既有手法；需先真机确认 Linux 上确实会静默失败。
5. **D-4**（错误形状）——`describeModelRequestError`（`aiHttpClient.ts:146`）/ `describeSyncError`（`syncService.ts:151`）对 `unknown` 先 `String(error)` 再匹配。
6. **D-5**（桥接路由）——改写条件加上 `import.meta.env.DEV` 或 preview 判据。
7. **补文档**：在设置页 AI 区块说明「桌面端可绕过 CORS、浏览器端要求中转站支持 CORS」；并考虑在 Rust 侧加 `enable_clipboard_access()`（一行）以让 Windows/Linux 桌面端的复制按钮默认成功。
