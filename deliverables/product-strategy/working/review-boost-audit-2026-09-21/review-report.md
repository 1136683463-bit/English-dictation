# 语法复习页（SM-2）深度验证报告

- 验证对象：`src/pages/GrammarReviewPage.tsx` + `src/services/grammarReviewService.ts`（必要时 `src/services/reviewService.ts`）
- 方式：真实 UI 驱动（`mountPage` → 真实点击/输入 → `AppContext.updateData` → 读回 `localStorage`），不跑既有合成单测作为结论依据
- 日期：2026-09-21
- 被测源码快照（SHA-256，验证期间**有并发改动**，见「时序说明」）：

| 文件 | SHA-256 | mtime |
| --- | --- | --- |
| `src/pages/GrammarReviewPage.tsx` | `45df6ae2e8ba27a263d2e1a9ba5453c8b4e4ce721d4adc784287b7df0fdfbe2a` | Sep 21 21:01 |
| `src/services/grammarReviewService.ts` | `46332d91c598760a30daad1d85b3dbd9eaa72c1b3a5a9e1d134b0341e59fd942` | Sep 21 21:27 |
| `src/services/reviewService.ts` | `a7cd41babf9ce286abd9c31311ca24e9f9dcbbd5b278b918f7dcdde13ec847d1` | （验证期间被并发改动） |

> 最终复核：以上三份文件在报告落笔时各被并发会话改动过（`git diff --stat` 分别 +18 / +211 / +57 行，均非本任务所改），但**全部 77 条用例在该快照上仍是全绿**——即本报告记录的所有结论（含 A 节缺陷与 C 节「无问题」）都对应当前 HEAD 工作区状态。

## 时序说明（影响结论解读）

验证期间 `src/` 下的产品代码被**其他并发会话持续修改**（测试开始时 `git status` 已显示 30+ 文件被改）。我在会话中观察到的两次关键变化：

1. `GrammarReviewPage.tsx:33-34`：`reviewModeForTask` 从
   `task.mode === "cloze" ? "cloze" : "recall"` 改成
   `task.mode === "cloze" ? "cloze" : task.mode === "rebuild" ? "rebuild" : "recall"`，
   并在 `types.ts` 的 `ReviewMode` 里新增 `"rebuild"`。
2. `grammarReviewService.ts`：到期判据从 `(schedule.intervalDays ?? 0) === 0` 改成三字段判定
   `neverQueuedSchedule`（且注释里明确写着「2026-09-21 修（P0，我自己上一轮引入的回归）」）。

我的一轮测试期间还捕获到一个**瞬时崩溃**（`grammarReviewService.ts:393 ReferenceError: indexes is not defined`，4 条用例同时失败），是并发编辑的半成品状态，写入完成后即消失——不作为缺陷记录，但它说明**该文件当时正被实时改动**。

因此下文把发现分为三类：
- **确认的缺陷**（在当前快照上可稳定复现）
- **已在验证期间被并发修复**（我完整复现过旧行为，并已转为回归守门测试）
- **可疑但未证实**

---

## A. 确认的缺陷

### A1【P1】已掌握（mastered）的语法卡仍会进入复习队列，与同屏「已掌握 N」自相矛盾

- **文件:行号**
  - `src/services/grammarReviewService.ts:38-39`（`isGrammarSentenceCard` 只排除 `suspended`，**不排除 `mastered`**）
  - `src/services/grammarReviewService.ts:66-87`（`listDueGrammarReviewCards` 的过滤与排序）
  - 界面矛盾点：`src/pages/GrammarReviewPage.tsx:203-217`（掌握栏）与 `:219`（会话渲染）
- **复现步骤**
  1. 造两张到期语法卡：`m1` 为 `status: "mastered"`（`reviewCount: 6, intervalDays: 5`）、`p1` 为 `status: "review"`（`reviewCount: 2`）；
  2. 挂载 `/grammar/review`；
  3. 观察会话张数、掌握栏、当前题面。
- **实际行为**：会话长度 2，且 `m1`（mastered）排在**第 1 张**被要求作答；同屏掌握栏同时显示「已掌握 1 / 共 2 句 · 进行中 1」。
- **期望行为**：`status === "mastered"` 的卡不该再进复习队列——掌握判定的语义就是「不再需要复习」。佐证：通用复习轨 `reviewService.getDueCards`（`src/services/reviewService.ts:81-88`）明确排除 `mastered`，`getLearningStats` 的 `dueTotal` 同样如此；只有语法复习这条链路漏了。
- **证据**
  - `rv8-reveal-lapse-trap.test.tsx > RV8-b > status=mastered 且到期的卡出现在复习会话里，与同屏「已掌握 N」矛盾`
    ```ts
    const session = buildGrammarReviewSession(after);
    expect(session.map((item) => item.card.id)).toEqual(["m1", "p1"]);   // ✅ 通过：m1 确实在队
    expect(session[0].card.status).toBe("mastered");                      // ✅ 通过：第 1 张就是已掌握的
    expect(page.has("已掌握 1")).toBe(true);                              // ✅ 通过
    expect(page.has("第 1 / 2 张")).toBe(true);                           // ✅ 通过
    ```
  - 同文件 `RV8-b > 「进行中」计数不含 mastered，但 mastered 卡仍占复习张数`：`summarizeGrammarMastery` 返回 `{mastered:1, inProgress:0, notStarted:0, total:1}`，而 `buildGrammarReviewSession(after).length === 1`。
- **严重度**：P1（功能错误；用户被要求重做已宣告掌握的卡，且界面同屏自相矛盾）
- **影响面**：语法卡一旦 `mastered`，其 `nextReviewAt` 仍按 SM-2 推进，到期即复发。这不是罕见路径——`applyReview` 的 `isMasteredBySpacedRepetition`（`reviewService.ts:21-22`，`rating===4 && reviewCount>=4`）与 free_type 的「连续两次输出通过」都会置 mastered。
- **与并发修复的相互作用（使本条更明确）**：验证后期 `reviewService.ts` 被另一路改成语法句子卡**永不降级**
  （新增 `keepsMasteredStatus`：`nextStatus === "review" && card.status === "mastered" && type === "sentence" && tags 含「语法」`）。
  也就是说：卡片一旦掌握就**永远**是 `mastered`，但 `isGrammarSentenceCard` 仍让它进复习队列 →
  系统会**无限期地**把一个永不降级的卡反复排进复习会话。A1 因此从「偶发矛盾」升级为**结构性矛盾**：
  必须二选一——要么掌握后不再入队（推荐，与 `getDueCards` 一致），要么允许降级。

### A2【P1】hunt（找错）来源卡的 free_type 判分与题面语义相反：照抄含错原文得 100 分通过，改对后反而被判「还没对上」

- **文件:行号**
  - `src/services/grammarReviewService.ts:344-361`（free_type 用 `card.note` 做锚点，`sentence = card.front.trim()`）
  - `src/services/huntService.ts:268-271, 299-307`（hunt 卡的 `front` = `caseItem.tokens.join(" ")`，即**含植错的案件原文**；改正只在 `grammarNote` 里）
  - `src/services/grammarReviewService.ts:481-484`（`judgeGrammarFreeType`，阈值 `FREE_TYPE_PASS_SCORE = 90`）
- **复现步骤**
  1. 用户流程走通 hunt：结案时把「看过提示/罪名绕弯」的植错点生成句子卡（`addHuntGapSentences`）；
  2. 该卡复习到第 3 次（`reviewCount >= 2`）→ 题型变 free_type，题面「找错案件：搬家那天（时态变形）——把那句话自己写出来」；
  3. 用户按要求写出**改对后**的句子并在输入框提交。
- **实际行为**：判分 88 分 < 90 → 未通过，页面显示「已经对了一部分（88%）——再调整一下」。
- **期望行为**：既然题面说「把那句话自己写出来」，用户交出正确句子必须通过。现在反而**照抄题面（含 4 处错）得 100 分通过**——越努力改对越被判错。
- **证据**
  - `rv3-free-type-anchor.test.tsx > RV3-b > free_type 判分把「照抄含错原文」判通过、把「改对后的句子」判不通过（语义反转）`
    ```ts
    expect(asRaw).toEqual({ passed: true, score: 100 });        // 照抄含错原文 → 100 分通过
    expect(asCorrected).toEqual({ passed: false, score: 88 });  // 4 处全部改对 → 88 分不通过
    ```
    逐条改对的分数（实测）：只改 `move→moved` 98 分、`help→helped` 97、`box→boxes` 97、`was→were` 97——**改对越多，分越低**，方向完全反了。
  - `rv3-free-type-anchor.test.tsx > RV3-b > 真实 UI 路径：hunt 段卡答「改对后的句子」被判未通过，页面提示「还没对上」`（真实 `mountPage` + 真实输入 + 真实提交，断言 `page.has("还没对上") === true`、`page.has("下一张") === false`）
- **严重度**：P1（功能错误：题面与判分语义相反，用户在「复习页」被教反向行为）
- **说明**：hunt 卡是语法复习队列的**主要来源之一**（`sourceId = hunt:<caseId>`，tags 含「语法」）。这个语义反转对 hunt 来源的卡**系统性成立**，不是个例。

### A3【P2】内部标记 `[tense:move]` 原样显示给用户

- **文件:行号**
  - `src/services/grammarReviewService.ts:333-335`（`note = details?.grammarNote || card.note || ""`）
  - 渲染点：`src/pages/GrammarReviewPage.tsx:363`（`pass` 反馈）与 `:375`（`revealed` 反馈）
  - 数据来源：`src/services/huntService.ts:303`（`grammarNote: \`[${error.tag}:${error.original}] ${标签}：…\``）
- **复现步骤**：hunt 卡复习到 rebuild 题 → 拼对 → 看反馈区。
- **实际行为**：反馈区文本形如
  `Last week I move to a new home. …（[tense:move] 时态变形：move → moved。）`
- **期望行为**：`[tense:move]` 是给弱点归因程序用的稳定键（`grammarWeakSpotsService` 按它回溯罪名），不是给人读的；用户看到的应是「时态变形：move → moved」。
- **证据**：`rv7-copy-and-consistency.test.tsx > RV7-b > hunt 卡的 grammarNote 里的原始内部 tag（[tense:move]）会被原样显示给用户`
  ```ts
  expect(text).toContain("[tense:move]");                     // ✅ 通过
  expect(text).toMatch(/\[[a-z_]+:[^\]]+\]/);                 // ✅ 通过
  ```
- **严重度**：P2（体验/文案；但也算「用户可见文案不可读」）

### A4【P2】零术语红线在复习页被 hunt 数据击穿（用户可见讲解含术语）

- **文件:行号**
  - 渲染点同上：`src/pages/GrammarReviewPage.tsx:363, 375`
  - 数据：`src/services/huntService.ts:16-28`（`GRAMMAR_ERROR_TAG_LABELS`）、`:303`（grammarNote）、`:305`（note）
  - 红线词表：`src/data/grammarZeroTerms.ts`
- **复现步骤**：hunt 卡复习到 rebuild → 拼对 → 看反馈区。
- **实际行为**：反馈区同时出现**两层**术语：
  1. 罪名标签本身：`GRAMMAR_ERROR_TAG_LABELS` 中 `时态变形`(时态)、`单复数`(复数)、`介词`、`语序`、`比较级` 命中红线词表；
  2. grammarNote 正文：如 `[plural:box] 单复数：box → boxes。three 后面是可数名词复数`（命中「复数」「可数」）、`[sv_agreement:was] 主谓一致：…主语是 We（复数）`（命中「主语」「复数」）。
- **期望行为**：项目红线「用户可见文案不得出现语法术语」。复习页自身文案是干净的（见 B 节），但它是渲染**别的页面写进数据的**文案——这条跨页责任链目前没人守。
- **证据**
  - `rv7-copy-and-consistency.test.tsx > RV7-b > 真实 UI：hunt 来源卡的反馈区会把含术语的讲解显示给用户（可复现）`：`findZeroTermHits(page.text()).length > 0`（实测反馈区命中术语）
  - `rv7-copy-and-consistency.test.tsx > RV7-b > hunt 卡的 grammarNote 在复习页被当讲解展示，其中大量命中零术语（跨页数据问题）`：202 案 → **410 张**卡的 grammarNote 命中术语
  - `rv7-copy-and-consistency.test.tsx > RV7-b > hunt 卡 note 里的罪名标签…本身也是术语`（free_type 题面直接展示 `note`，`:348-350`）
  - 对照：`lesson 核心句的讲解（oneLineRule）全库零术语`：**0 / 193** 命中——说明课程侧守住了，只有 hunt 侧越线。
- **严重度**：P2（文案红线；用户可见，但非崩溃/数据错误）

### A5【P2】cloze 题目只有 13% 挖到本课语法点，且干扰项几乎都能从题面直接排除

- **文件:行号**：`src/services/grammarReviewService.ts:222-231`（`contentTokenIndexes`：**刻意排除**长度 ≤2 与 `STOP_WORDS`，即优先挑实词）、`:240-320`（`buildClozeOptions` 兜底取句内其他真实词）
- **复现步骤**：对 193 课核心句各生成一次 `reviewCount = 0` 的 cloze 任务，检查挖空词与干扰项。
- **实际行为**（全库实测）
  - **167 / 193** 的挖空词是普通实词，不是本课语法点所在的功能词；只有 26 课挖到 be/助动词/限定词等语法承载词。例：
    - 语法点「be 动词 · I am」/ 句「I am Xiaomei.」→ 挖空「Xiaomei」，题面「I am ____」
    - 语法点「have + a」/ 句「I have a new bag.」→ 挖空「bag」，题面「I have a new ____」
    - 语法点「物主词 my / her」/ 句「She is my friend.」→ 挖空「She」，题面「____ is my friend.」
  - **193 / 193** 的干扰项里至少有 1 个已在题面上出现；**176 / 193** 的干扰项**全部**都在题面上出现。例：「I am ____」选项 `[i, Xiaomei, am]`——`i` 与 `am` 都是题面原词，可直接划掉，实际只有 1 个候选。用户不需要懂语法，靠「排除题面已有词」即可作答。
  - **18 / 193** 课的选项数只有 3 个（干扰项凑不满 4），选项个数不稳定（页面按 `task.options.map` 渲染，无补足逻辑，`GrammarReviewPage.tsx:288-299`）。
- **期望行为**：语法复习的题目应检验语法点；干扰项应是「真会混的同族形式」（代码注释 `:236-244` 的意图正是如此），而不是句内其他词。
- **证据**：`rv7-copy-and-consistency.test.tsx > RV7-c > cloze 挖空位置大多落在实词…`（`grammarBearing=26, contentWord=167`，占比 >0.8）、`> 18 课只有 3 个选项`、`> cloze 干扰项常是题面里已有的词`（`anyDistractorVisible === total`，`allDistractorsVisible/total > 0.85`）
- **严重度**：P2（题目质量/教学有效性；不是崩溃，但让「语法复习」名不副实）

### A6【P2】空态仍挂着「0 / 0 张」进度胶囊

- **文件:行号**：`src/pages/GrammarReviewPage.tsx:192-200`（`PageHeader` 的 `action` 无条件渲染，未按 `total` 守卫）
- **复现步骤**：无任何到期语法卡 → 挂载 `/grammar/review`。
- **实际行为**：页面文本为 `…0 / 0 张今天没有到期的语法复习…`，即空态与一个零分母的「本次 0 张」进度标签同屏。
- **期望行为**：空态不显示会话进度（或至少不显示零分母）。
- **证据**：`rv5-session-boundaries.test.tsx > RV5-a > 0 张到期：空态文案 + 出口；不出现任何题目`
  ```ts
  console.log(JSON.stringify(pill?.textContent))  // "0 / 0 张"
  expect(page.text()).toContain("0 / 0 张");       // ✅ 通过（当前行为）
  ```
- **严重度**：P2（体验/文案）

### A7【P2】长句 free_type 的判分尺度随句长显著放松

- **文件:行号**：`src/services/grammarReviewService.ts:481-484`（`diffScore(compareText(...)) >= 90`，阈值固定为百分比）
- **复现步骤**：取全库最长的 hunt 段（`hunt-weekend-note`，53 词），free_type 输入漏掉末尾 N 个词。
- **实际行为**（实测）
  | 漏词数 | 得分 | 通过 |
  | --- | --- | --- |
  | 1 | 98 | ✅ |
  | 3 | 94 | ✅ |
  | **5** | **91** | **✅** |
  | 6 | 89 | ❌ |
  | 10 | 81 | ❌ |

  同口径下 5 词短句「I am drawing a picture.」只换掉一个词（a→the）就只有 80 分、不通过。
- **期望行为**：既然要求「产出一次才算真的会」，漏掉 5 个词（占 9.4%）不该算过关；阈值是比例制，长句天然宽松。
- **证据**：`rv3-free-type-anchor.test.tsx > RV3-c > 长句（53 词）漏 5 个词仍算通过——判分尺度随句长放松（体验项）`
  ```ts
  expect(judgeGrammarFreeType(dropped5, sentence)).toEqual({ passed: true, score: 91 });
  expect(judgeGrammarFreeType(dropped6, sentence).passed).toBe(false);
  expect(judgeGrammarFreeType("I am drawing the picture.", "I am drawing a picture."))
    .toEqual({ passed: false, score: 80 });
  ```
- **严重度**：P2（判分宽松；结合 A2，hunt 段卡的判分整体不可靠）

### A8【P2】cloze 把句中逗号一并剥离，题面标点不完整（4 例）

- **文件:行号**：`src/services/grammarReviewService.ts:221`（`cleanToken` = `/[\.,!?;:]/g` 全局剥离，未区分句尾与句中）
- **实际行为**（实测 4 例）
  - `lesson-48-if-rain`：「If it rains, I will stay at home.」→ 题面「If it ____ I will stay at home.」（逗号丢失）
  - `lesson-139-although`：「Although it is raining, I will go out.」→「Although it is ____ I will go out.」
  - `lesson-144-close-23`：「As soon as I finish, I will eat.」→「As soon as I ____ I will eat.」
  - `lesson-182-close-24`：「All the books are good, and she hasn't come yet.」→「All the books are ____ and she hasn't come yet.」
- **期望行为**：只剥句尾标点，句中逗号应保留（否则用户看到的句子本身是错的写法）。
- **证据**：`rv7-copy-and-consistency.test.tsx > RV7-c > cloze 的答案填入空位后能还原原句（忽略被剥离的尾标点；全库 193 课扫描）`——该用例把「尾标点剥离」列为已知宽容行为、把上述 4 例句中标点丢失列为已知行为；探测输出为 `真不一致 4` 例，全部是句中逗号。
- **严重度**：P2（题面正确性；同时会污染「答案必须与题面语义一致」这条红线）

---

## B. 已在验证期间被并发修复（我复现过旧行为并转为回归守门）

### B1【曾为 P0】「看答案」（rating 1）后卡片被永久排除，与页面承诺「这张卡很快会再来见你」相反

- **旧实现**：`listDueGrammarReviewCards` 用 `(item.schedule.intervalDays ?? 0) === 0` 当「从未进过复习队列」的判据；而 `reviewService.applyReviewWithUndo`（`reviewService.ts:425-429`）的 **rating 1 分支也会把 `intervalDays` 归零**（语义是「10 分钟后再来」）。两者撞车 → 刚看答案的卡被当成「从未排过」永久排除。
- **我的复现证据**（旧快照上）：把 `nextReviewAt` 拨到已到期后
  ```ts
  const due = listDueGrammarReviewCards(readAppData());
  expect(due.map(i => i.card.id)).not.toContain("lapse-card");
  // AssertionError: expected [ 'lapse-card' ] to not include 'lapse-card'
  ```
  同一页面还写着「这张卡很快会再来见你」（`GrammarReviewPage.tsx:375`）。
- **现快照已修**：改为三字段判定
  ```ts
  const neverQueuedSchedule = (schedule: Schedule): boolean =>
    (schedule.intervalDays ?? 0) === 0 && (schedule.reviewCount ?? 0) === 0 && (schedule.lapseCount ?? 0) === 0;
  ```
  （`grammarReviewService.ts:57-59`，注释自称「2026-09-21 修（P0…）」）
- **回归守门测试**：`rv8-reveal-lapse-trap.test.tsx > RV8-a`（4 条，全绿）：看答案写入 `intervalDays=0 + lapseCount+1 + 10 分钟后的 nextReviewAt`；到期后重新回到会话；全初始值的新卡不立即到期；rating 4 的卡不掉队。
- 另附带验证：`grammarWeakSpotsService.scheduleCardsForToday`（`:230-246`）会把 `intervalDays === 0` 补成 `1`，所以「排进今日复习」按钮与 due 过滤器现在自洽。

### B2【清单项 4 的已知问题】rebuild 冒充 recall 污染掌握判定 —— 当前源码已修，我证明缺陷成立并守住正向路径

- **旧实现**：`reviewModeForTask = task.mode === "cloze" ? "cloze" : "recall"`——rebuild 与 free_type 都记 `recall`。而 `isMasteredByOutput` 按 `mode === "recall"` 过滤「输出」记录，于是「拼词块通过（rating 4）+ 自己写首次通过（rating 4）」被算作两次输出，卡片被置 `mastered`，界面「已掌握 N」+1——用户其实只独立写出过 **1** 次。
- **缺陷成立性的合成证明**（`rv4-mastered-ui-path.test.tsx > RV4-a`，两条，绿）
  ```ts
  // 旧映射（rebuild 记 recall）：
  expect(isMasteredByOutput([{mode:"recall",rating:4},{mode:"recall",rating:4}], "c1")).toBe(true);
  // 正确口径（rebuild 不参与）：
  expect(isMasteredByOutput([{mode:"rebuild",rating:4},{mode:"recall",rating:4}], "c1")).toBe(false);
  ```
- **当前源码的真实 UI 复现**（`rv4-mastered-ui-path.test.tsx > RV4-b`，4 条，绿）：按「cloze 通过 → rebuild 通过 → free_type 首次通过」三步走真实页面，`reviews` 的 `mode` 序列为 `["cloze","rebuild","recall"]`，卡片 `status` 始终**不是** `mastered`，界面「已掌握 0」保持 0。
- **正向路径也守住**（`:182-199`）：第 4 次又是 free_type 一次通过（`recall` 两条 rating 4）→ 才置 `mastered`，界面「已掌握 1」。
- **反向路径守住**（`:202-236`）：第 4 次走「先写错→看答案」（rating 1）→ `recall` 记录为 `[4, 1]` → 不置 mastered。
- **结论**：清单项 4 描述的问题在**旧代码上成立**（我已给出可执行的成立性证明 + 真实 UI 三步复现），在当前快照上**已不成立**；`rv4-mastered-ui-path.test.tsx` 作为回归守门保留。

---

## C. 清单项验证后「没有问题」的部分（附验证方法）

### 清单项 1 · 三种题型的完整作答链路 —— 无问题

`rv1-answer-paths.test.tsx`（10 条，全绿）。三题型 × 三路径的 rating 与 schedule 全部与用户行为相符：

| 题型 | 路径 | rating | `reviewCount` | `intervalDays` | `easeFactor` | `lapseCount` | `review.mode` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| cloze | 一次选对 | 4 | +1 | 3 | 2.62 | 0 | `cloze` |
| cloze | 先错再对 | 3 | +1 | **1**（语法句子卡不放大间隔） | 2.5 | 0 | `cloze` |
| cloze | 看答案 | 1 | +1 | 0 | 2.25 | +1 | `cloze` |
| rebuild | 一次拼对 | 4 | +1 | 3 | 2.62 | 0 | `rebuild` |
| rebuild | 先错再对 | 3 | +1 | 1 | 2.5 | 0 | `rebuild` |
| rebuild | 看答案 | 1 | +1 | 0 | 2.25 | +1 | `rebuild` |
| free_type | 一次写对 | 4 | +1 | 3 | 2.62 | 0 | `recall` |
| free_type | 先错再对 | 3 | +1 | 1 | 2.5 | 0 | `recall` |
| free_type | 看答案 | 1 | +1 | 0 | 2.25 | +1 | `recall` |

关键结论：
- **错选/错拼/错写都不落库**——只有「通过」或「看答案」才写 `reviews`（各用例断言 `reviewsOf(cardId).length === 0` 于中间态）。
- cloze 判分大小写宽容（`judgeGrammarCloze`）。
- free_type 首次写错给的是方向性提示（`还没对上 / 已经对了一部分（N%）`），**不含答案**（断言 `page.text()` 不包含正确句）。
- rating 3 对语法句子卡**不放大间隔**（`reviewService.ts:434-443` 的 `isGrammarSentenceCard` 分支），符合 R09 Step1 注释意图；词卡对照仍按 `intervalDays * easeFactor` 放大（我用探针确认：语法卡 `intervalDays 0→1`，词卡 `0→3`）。
- 反馈文案：pass 态展示完整正确句 + 讲解；revealed 态展示「正确的说法是：…。这张卡很快会再来见你。」（无挫败归因）。

### 清单项 2 · 题型轮换是否真的生效 —— 生效（有 1 项设计代价，见可疑项 D1）

`rv2-mode-rotation-ui.test.tsx`（8 条，全绿）。

- **做法**：同一天入队 6 张卡，`reviewCount` 分布 `0/1/2/3/0/1`（来源分散到 5 课），逐张走**真实 UI**（真实点击/输入），题型从页面上用户看得见的 `.lesson-quiz-note` 标签读取（不读内部状态）。
- **结果**：实际序列 `["cloze","rebuild","free_type","cloze","free_type","rebuild"]` —— **相邻无同型**；与 `diversifyReviewModes` 推出的计划序列逐位一致；`free_type` 出现 2 次，正是 `reviewCount ∈ {2,3}` 的两张。
- `reviewCount → 题型` 映射在真实数据上确认：0→cloze、1→rebuild、≥2→free_type（连续 3 次复习形态为 cloze→rebuild→free_type→free_type）。
- flag 回滚开关有效：`localStorage["grammar-review-free-type"]="off"` 时计划与界面都不再出 `free_type`，回落 cloze/rebuild 两形态。
- 打散算法性质：确定性（同输入同输出）、内容守恒（同集合重排，不丢卡不复制）、会话 ≤2 张时原样返回同一引用。
- 无解时不崩：全部 `reviewCount=0` 的会话同型必然连出，算法保持原序而不报错。

### 清单项 3 · free_type 的来源锚点 —— **不泄题**（但答案为错的卡语义颠倒，见 A2）

`rv3-free-type-anchor.test.tsx`（10 条，全绿）。逐条核对了真实数据里 `note` 的形状：

| 来源 | 生产者 | note 实际内容 | 是否含答案句 |
| --- | --- | --- | --- |
| lesson 核心句 | `lessonService.ts:222` | `语法课核心句：小美的一天 ① 我是谁` | **否** |
| lesson 错句 | `lessonService.ts:475` | `语法课：小美的一天 ① 我是谁` | 否 |
| hunt 段卡 | `huntService.ts:305` | `找错案件：搬家那天（时态变形）` | **否**（但卡面本身是含错原文 → A2） |
| diary 卡 | `diaryService.ts:364` | `我的英文日记 · 2026-09-21` | 否 |
| boost 卡 | `GrammarBoostPage.tsx:370` | `趁热练：小美的一天 ① 我是谁` | 否 |
| 手动句卡 | `SentencesPage.tsx:18-25`（`note: ""`） | 空 | 否 |

- **结论：构造「note 含完整句子」的卡在真实链路里不存在**——所有生产者写进 `note` 的都是来源标签（课号/课名/案件名/日期），不含句子。free_type 题面 `{note}——把那句话自己写出来` 因此不泄题。
- `sentenceDetails` 为空时是否会退化成无提示：**不会**。`note = details?.grammarNote || card.note || ""`（`:333-335`），`sentenceDetails` 缺失时退回 `card.note`；`card.note` 也为空（手动句卡）时才退化为 `把那句 5 个词的句子自己写出来`（词数提示，不含任何答案线索）。纯空白 note（`"   "`）同样正确退化（`:348` 用 `card.note.trim()` 判空）。
- 输入入口真实存在：free_type 有 `<textarea>` + 「提交」按钮 + 回车提交（`GrammarReviewPage.tsx:264-290`）。

### 清单项 4 · 掌握（mastered）判定 —— 见 B2（缺陷成立、当前已修、回归守门）

### 清单项 5 · 会话边界 —— 无问题（10 张截断、留到下次、中途离开全部符合预期）

`rv5-session-boundaries.test.tsx`（10 条，全绿）。

| 场景 | 结论 |
| --- | --- |
| 0 张 | 空态文案 + 「返回语法地图」出口；不出现任何题型标签/题目（但见 A6：多一个「0 / 0 张」胶囊） |
| 1 张 | 进度 `/ 1 张`；答完成反馈按钮是「完成复习」（不是「下一张」） |
| 恰好 10 张 | 全出完，完成页「本次共 10 张一次到位」 |
| 23 张 | 服务层 `listDueGrammarReviewCards` 返回 23，`buildGrammarReviewSession` 截断到 10；**未截断的 13 张 schedule 完全未变**（`nextReviewAt` 仍是原值、`reviewCount` 未增、无 review 记录）→ 确实留到下次 |
| 截断优先级 | `lapseCount=5` 的 4 张全部进前 10（最旧错题优先有效） |
| 中途离开 | 答 2 张后点「今天先到这里」：已答卡 `nextReviewAt` 排到未来且 `reviewCount > 0`；未答的 3 张仍在到期集合；重进显示 `/ 3 张`、`第 1 / 3 张` |
| 离开无压力痕迹 | 页面文本不含「放弃/未完成/中断/失败/打卡」，也不含「倒计时/剩余时间/体力/排名」 |
| 重进重排队列 | `unmount` 后重进：会话重新组队，不含已答卡，计数从 `第 1 / 2 张` 重新开始 |
| StrictMode 般重入 | 连续挂载/卸载 3 次不产生任何 review；答 1 张后恰好 1 条 |
| 会话组队时机 | 会话中途 `data` 变化不重排队列，进度总数始终是进场时的 5 |

### 清单项 6 · 重复作答防护 —— 无问题（计数真实）

`rv6-duplicate-guard.test.tsx`（9 条，全绿）。

- cloze：答对后所有选项 `disabled`；**绕过 disabled 直接派发 `click`** 连点 5 次，`reviews` 仍只有 1 条、`reviewCount` 只 +1。
- cloze 选错：错选项自身 `disabled`，强行再点 3 次不累加 `attempts`（最终 rating 仍是 3，不是更高尝试次数带来的任何漂移）。
- rebuild：拼对后连点词块 10 次，仍只有 1 条 review。
- free_type：回车提交后立刻再回车 + 再点「提交」+ 连点所有按钮，仍只有 1 条 review。
- free_type 空白输入（`"   "`）「提交」保持 `disabled`，不落库。
- 中文输入法组词态（`KeyboardEvent(isComposing: true)`）回车不提交，不落库。
- 完成页计数与落库一致：2 张全对 → 「2 张一次到位，0 张还需要再见几次」，落库 2 条 rating 4；1 对 + 1 看答案 → 「1 张一次到位，1 张还需要再见几次」，落库 rating `[1, 4]`。
- 机制说明：`outcome !== "idle"` 守卫（`GrammarReviewPage.tsx:127, 138, 148, 165`）+ 按钮 `disabled`（`:302, 319, 330`）双层防护，且 `finishCard` 内的 `setOutcome` 与 `updateData` 是同一批同步调用，不存在竞态窗口。

### 硬约束审计（零术语 / Affective Filter / 限时）

`rv7-copy-and-consistency.test.tsx`（17 条，全绿）。

- **复习页自身源码零术语**：把 `GrammarReviewPage.tsx` 源码里所有中文串与 `GRAMMAR_ZERO_TERMS`（29 词）交叉审计，命中 **0**。
- **无挫败话术**：空态、答题中、看答案反馈、完成页四个界面全文不含「答错/做错/又错了/你错了/失败/正确率/准确率」。
  - 有意保留的措辞：revealed 反馈用「正确的说法是」（指句子而非用户行为，与 `GrammarLessonPage.tsx:413` 既有口径一致）；完成页用「X 张一次到位 / Y 张还需要再见几次」（不做正确率审判）。
- **无任何限时/排名/体力**：源码不含 `setTimeout` / `setInterval` / `Date.now() +`；四个界面全文不含「倒计时/剩余时间/时间到/超时/限时/用时/已用/排名/排行/第 1 名/体力/生命值/积分/连击/打卡/连续天数」。
  - 佐证：`GRAMMAR_REVIEW_TIME_BUDGET_MS` 常量已按红线删除（`grammarReviewService.ts:14-20` 留有说明注释）。
- **答案与题面语义一致（cloze/rebuild）**：全库 193 课逐句扫描——cloze 答案填入空位后可还原原句（仅允许尾标点剥离，句中逗号问题见 A8）；rebuild 词块集合恒等于原句词集合，且顺序不等于原句（不送答案）。
- **跨页数据不干净**（不是复习页自身的问题）：hunt 的 `grammarNote` 有 410 张命中术语、原始 tag `[tense:move]` 直接可见（A3/A4）；lesson 的 `oneLineRule` 全库 0 命中（对照）。

---

## D. 可疑但未证实

### D1 `diversifyReviewModes` 重排会打散「最旧错题优先」的排序（设计取舍，非缺陷）

`diversifyReviewModes`（`grammarReviewService.ts:107-141`）在会话组队后做交换，必然改变 `listDueGrammarReviewCards` 精心排好的 `lapseCount DESC, nextReviewAt ASC` 顺序。代价：**最该先复习的卡可能被换到后面**（在 10 张会话里影响有限，因为截断发生在重排**之前**，所以「哪些卡进会话」仍由最旧错题优先决定，只有会话内顺序被改）。
- 已验证：内容守恒（同集合重排）、确定性（同输入同输出）。
- 未能证实的是「这个代价是否值得」——需要产品判断，不属于代码缺陷。`rv2-mode-rotation-ui.test.tsx > 轮换的代价…` 记录了这一点。

### D2 hunt 段卡的 rebuild 词块里带着错词，题目自我矛盾

- 现象：rebuild 题让用户「把这些词块按顺序点回去，拼出正确的句子」，但词块来自 `card.front`（= 含植错的案件原文），所以正确操作是**还原出那个错句**；而紧接着的反馈区又展示「move → moved」的纠正。用户被要求拼出一个「错的句子」却被称作「正确的句子」。
- 证据：`rv3-free-type-anchor.test.tsx > RV3-b > hunt 卡 front 就是案件原文（含全部植错）`（断言 4 个错词 `move/help/box/was` 全在 `card.front` 里）+ 探针确认 `task.scrambled` 含这 4 个错词。
- 尚未证实的是「判分是否把还原错句当正确」——实际上 `judgeGrammarRebuild` 比的是 `task.sentence`（= `card.front`），所以还原错句**会**判通过。这与 A2 同根因（hunt 卡的 `front` 语义是「案例原文」而非「正确答案」）。我把它归入 A2 的同一根因，这里单列以说明 rebuild 也受影响。

### D3 `mastered` 卡在复习页被再次写入 review，`masteredAt` 不重置

- 现象：mastered 卡被复习一次（rating 1）后仍保持 `mastered`，`masteredAt` 保留原值，但 `reviews` 里多了一条 rating 1 的记录。
- 证据：`rv8-reveal-lapse-trap.test.tsx > RV8-b > mastered 卡被复习一次（rating 1）后仍保持 mastered…`（绿）。
- 为什么可疑而非缺陷：「已掌握只增不减」是 R09 验收项（另一路测试 `rv2-no-demotion.test.ts` 专门守这条），所以不降级是**有意的**。但「已掌握卡还能被出题并记 rating 1」与 A1 是同一根因，修 A1 后本条自动消失。未证实的是「这些 rating 1 记录会不会污染 `getWeakCards` / 薄弱词统计」——`reviewService.getWeakCards` 只看最近一次 review 是否低分，所以**会**把已掌握的卡算进「薄弱」，但这属于通用复习轨的口径问题，超出本次范围。

---

## 新增测试文件与运行结果

全部位于 `src/edge/verify/`，命名 `rv*-*.test.tsx`（复用 `harness.tsx` / `fixtures.ts` / `drive.ts`，未新造基建）：

| 文件 | 覆盖清单项 | 用例数 |
| --- | --- | --- |
| `rv1-answer-paths.test.tsx` | 清单 1（三题型 × 三路径） | 10 |
| `rv2-mode-rotation-ui.test.tsx` | 清单 2（题型轮换，真实 UI 序列） | 8 |
| `rv3-free-type-anchor.test.tsx` | 清单 3（free_type 锚点/泄题/hunt 语义） | 10 |
| `rv4-mastered-ui-path.test.tsx` | 清单 4（掌握判定，真实 UI 三步） | 6 |
| `rv5-session-boundaries.test.tsx` | 清单 5（0/1/10/>10、中途离开、截断） | 10 |
| `rv6-duplicate-guard.test.tsx` | 清单 6（重复作答/计数真实性） | 9 |
| `rv7-copy-and-consistency.test.tsx` | 硬约束（零术语/Affective Filter/答案一致性） | 17 |
| `rv8-reveal-lapse-trap.test.tsx` | 补充（看答案后能否回来、mastered 卡进出队） | 7 |
| **合计** | | **77** |

运行命令与结果：

```
$ node_modules/.bin/vitest run \
    src/edge/verify/rv1-answer-paths.test.tsx \
    src/edge/verify/rv2-mode-rotation-ui.test.tsx \
    src/edge/verify/rv3-free-type-anchor.test.tsx \
    src/edge/verify/rv4-mastered-ui-path.test.tsx \
    src/edge/verify/rv5-session-boundaries.test.tsx \
    src/edge/verify/rv6-duplicate-guard.test.tsx \
    src/edge/verify/rv7-copy-and-consistency.test.tsx \
    src/edge/verify/rv8-reveal-lapse-trap.test.tsx

 ✓ src/edge/verify/rv3-free-type-anchor.test.tsx (10 tests) 46ms
 ✓ src/edge/verify/rv8-reveal-lapse-trap.test.tsx (7 tests) 136ms
 ✓ src/edge/verify/rv1-answer-paths.test.tsx (10 tests) 197ms
 ✓ src/edge/verify/rv7-copy-and-consistency.test.tsx (17 tests) 249ms
 ✓ src/edge/verify/rv6-duplicate-guard.test.tsx (9 tests) 262ms
 ✓ src/edge/verify/rv4-mastered-ui-path.test.tsx (6 tests) 269ms
 ✓ src/edge/verify/rv2-mode-rotation-ui.test.tsx (8 tests) 270ms
 ✓ src/edge/verify/rv5-session-boundaries.test.tsx (10 tests) 382ms

 Test Files  8 passed (8)
      Tests  77 passed (77)
```

**单元测试文件（`src/services/grammarReviewService.test.ts`）未被修改**；`src/` 下产品代码未被修改（本次任务只新增 `src/edge/verify/rv*.test.tsx` 与 `.rvfind/review-report.md`）。

---

## 优先级建议

| 优先级 | 问题 | 一句话 |
| --- | --- | --- |
| P1 | A1 已掌握卡仍进复习队列 | `isGrammarSentenceCard` 加一条 `card.status !== "mastered"`，与 `getDueCards` 对齐 |
| P1 | A2 hunt 卡 free_type 语义反转 | hunt 卡的 `front` 是含错原文；free_type 应比对改对后的句子，而不是原文 |
| P2 | A3/A4 讲解文案 | 渲染前剥掉 `[tag:original]` 前缀；hunt 的罪名标签与 grammarNote 话术按零术语红线重写 |
| P2 | A5 cloze 质量 | 挖空应优先落在本课语法点词；干扰项应来自同族形式而非句内其他词 |
| P2 | A6/A7/A8 | 空态隐藏进度胶囊；长句改绝对宽容度或分段判分；`cleanToken` 只剥句尾标点 |
