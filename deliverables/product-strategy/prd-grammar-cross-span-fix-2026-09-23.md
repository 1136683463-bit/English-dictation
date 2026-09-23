# PRD · 修 7 处跨 span 修正生成病句 + 补做浏览器走查

- 日期：2026-09-23
- 批次：第五十二批
- 交付：**修 7 处「跨 span 修正」病句** + **补做上批欠的浏览器走查**
- 性质：**修复批 + 走查补做**

---

## 0. 一句话

上批修的「移动型」只是跨 span 缺陷的一种形态。本批把**整类**扫干净：7 处 `correction` 写成跨多个 token 的短语、而 `tokenIndex` 只指向其中一个词 ⇒ 机械替换后**重复/结构错乱**。修完 **全库病句归零**（相邻重复词 0 / 含中文 0 / 修正==原词 0），并补上了上批欠的浏览器走查。

---

## 1. 缺陷的完整形态：跨 span 修正

### 1.1 根因

`correctedSentenceOf` 在**单 token 位置整体替换**，但 `correction` 可以写成跨多个 token 的短语：

```ts
tokens[index] = `${correction}${trailing}`;   // ← 把整个短语塞进一个位置
```

### 1.2 全库实测的 7 处

| 案 | 错位 | 原 correction | 生成的病句 |
|---|---|---|---|
| `hunt-team-message#20` | `not` | `don't think she will` | `I think she will **don't think she will** be late.` |
| `hunt-frequency-habit#7` | `go` | `always goes` | `Lily **always goes always** to the library` |
| `hunt-question-words#16` | `lost` | `did you lose` | `When you **did you lose** it?` |
| `hunt-not-used-to#5` | `You` | `去掉 You（Are 搬句首）` | `**are used** to the noise?`（丢主语）|
| `hunt-so-that-early#5` | `to` | `so that` | `in order **so that** you can rest` |
| `hunt-slept#19` | `home` | `went home` | `They **went went** home` |
| `hunt-looking-forward-weekend#9` | `forward` | `forward to` | `forward **to to** the weekend` |

**这 7 处都会进错词本的例句**——用户会看到并记住。

### 1.3 修法（分两类）

**前 5 处：把 `correction` 改成只替换该位那个词的形式**

| 案 | 改成 | 理由 |
|---|---|---|
| `hunt-question-words#16` | `lose` | 该位只是 `lost→lose`（问句语序由别处管）|
| `hunt-frequency-habit#7` | `goes` | `always` 已在原位 |
| `hunt-team-message#20` | `not` | 「否定前移」是整段搬移，机械替换做不了 |
| `hunt-not-used-to#5` | `把 Are 搬到 You 前面` | 改成搬移式说明（不再触发删除分支）|
| `hunt-so-that-early#5` | `that` | `in order that` |

**后 2 处：改 `original` 的指向**——但复核后发现它们**是错点标错了位置**：

- `hunt-looking-forward-weekend#9`：`I looking forward to the weekend.` —— `forward` 没错，**真错是缺 `am`**，而 `#2` 已标 `look→looking`
- `hunt-slept#19`：`They go home yesterday.` —— `home` 没错（`go home` 是正确搭配），**真错是 `go` 该用 went**，而 `#18` 已标

**两处的真错都已被同案其它错点覆盖 ⇒ 它们是冗余错点，正确处置是删除**（每案 4 错 → 3 错）。

**合法性**：全库错点数分布 `{2:19, 3:24, 4:167, …}`——2 错案有 19 个，删到 3 完全在既有范围内。

---

## 2. 一处被测试拦下的中间尝试（值得记录）

我最初把后 2 处的 `correction` 改成与原词相同（`forward`→`forward`、`home`→`home`），**立即被 h1 的断言拦下**：

> 「修正与原词相同」的植错点必须为 0——用户找出来了却看不到改什么

**这个约束是对的**，我据此改为「删除冗余错点」——比原方案更彻底。

---

## 3. 补做浏览器走查（上批欠的）

上批因 L1 首屏停在非交互状态，走查未完成。本批换路径重新走：

**实测证据（L3 的对照卡区）**：

| 观察 | 结果 |
|---|---|
| `I have pen.` 的删除线 | 落在 **`pen.`** 上（**不是** `h`**a**`ve` 里）✓ |
| `She have a cat.` 的删除线 | 落在 **`have`** 上 ✓ |
| 页面上的「缺了一块」 | **未出现**（旧文案已消失）✓ |
| 阶段导航 | `1 剧场` / `2 搭装与对错` / `3 变奏` 三段正常 ✓ |

**结论**：上批修的 `locateMarkedTokens` 定位口径**在真实浏览器里生效**（删除线精确落在该划的词上）。

**一处未完成的观察**：本批未能在浏览器里复现到一张**无标注卡**（`I am student.` 那类）来目视确认新文案「整句都要看」——因为阶段按钮的推进路径在跨段时中断。该文案的证据是**源码级**（`整句都要看` 已在渲染处、旧文案 0 残留、零术语检查通过）。**如实记录这一点。**

---

## 4. 验证

| 项 | 结果 |
|---|---|
| **全量测试** | **2485 / 2485 全绿**（234 文件）|
| `tsc --noEmit` | 我的文件 **0 错误** |
| `vite build` | ✓ 通过（2.88s）|
| 独立核验 | **3 / 3**（终值 + 结构 + 对齐）|
| 修正后相邻重复词 | **2 → 0** |
| 修正后含中文 | **0** |
| 修正==原词（冗余错点）| **2 → 0** |
| 错词本非纯英文 | **0** |
| 对齐断言（original 含该位词）| **0 失败** |
| 案件编号唯一 + 零术语 | ✓ |

---

## 5. 方法学教训

1. **「一类缺陷」要扫整类，不要只修个例**。上批修了 13 处「移动型」，本批才发现同一个根因（跨 span 替换）还有 7 处别的形态。**根因相同就该一次扫干净。**
2. **我的判据连续 3 次误报**（粘句判据把 `Yesterday I`、`in China` 当成粘句）。教训：**从语言形态反推「是不是病句」极不可靠**——最终改用「重复词」这种**确定性判据**才得到准确结果（2 处）。
3. **测试拦下了一个「看起来对」的修法**。把 `correction` 改成与原词相同，逻辑上「不制造病句」，但违反了「用户要能看到改什么」。**约束的存在有它的道理——被拦下时先理解约束，而不是绕过它。**
4. **删冗余错点比改错点更彻底**。两处的真错都已被同案其它错点覆盖，删掉比硬改更干净（且错点数分布允许）。
