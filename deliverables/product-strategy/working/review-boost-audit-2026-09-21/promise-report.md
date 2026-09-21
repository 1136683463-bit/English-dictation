# 承诺核查报告 · 复习页 + 趁热练

核查对象：`src/pages/GrammarReviewPage.tsx`、`src/pages/GrammarBoostPage.tsx` 及相关服务
（`grammarReviewService` / `grammarBoostService` / `grammarTelemetry` / `huntService` /
`grammarWeakSpotsService` / `reviewService` / `lessonService` / `diaryService`）。
核查日：2026-09-21。测试：`src/edge/verify/pr1-promises.test.tsx`（36 条断言全部通过）。

> **重要前提**：核查期间工作区被另一个进程**持续修改**（课程数 192 → 193、
> `grammarReviewService.listDueGrammarReviewCards` 的过滤判据被改写、
> `GrammarBoostPage` 的 `firstTryCount` 竞态被修、`grammarBoostService` 至 22:05 仍在变）。
> 本报告的所有结论均以 **22:05 的文件快照**为准重新验证过；凡因并发改动而
> **在核查过程中已消失**的旧缺陷，单独列在 §5「核查期间被并发改掉的项」，不算作现存缺陷。

---

## 1. 承诺核查表

严重度：P0 = 直接误导 + 无替代路径；P1 = 误导或体验断裂，有替代路径；P2 = 措辞/口径瑕疵。
「兑现」列：✅ 兑现 / ❌ 未兑现 / ⚠️ 部分兑现。

### 1.1 趁热练 · 复习队列承诺

| 文案（原文） | 位置 | 承诺了什么 | 实现是否兑现 | 证据 | 严重度 |
|---|---|---|---|---|---|
| 「这句已经排进复习队列，后面会再见到它。」 | `GrammarBoostPage.tsx:1230` | 看答案后该句进入 SM-2 复习队列 | ❌ **档 1/2 未兑现** | `queueFailedProduce` 首行 `if (tier !== 3) return;`（`:354`）。档 1 listen 看答案后 `cards.length 0 → 0`、`sentence_card_enqueued` 事件 0 条；对照档 3 同样操作确实 +1 卡 +1 事件 | **P0** |
| 「看答案（会排进复习）」 | `GrammarBoostPage.tsx:1258` | 按钮自身就在承诺入队 | ❌ **同上**（`revealAnswer` → `queueFailedProduce` 被 tier 门槛挡掉） | 该按钮在档 1 的 listen/bothright、档 2 的 recall/translate/rebuild/arrange 上都会渲染（排除条件是题型，不是档位） | **P0** |
| 档 3 看答案后「已排进复习队列」 | 同上 | 入队的是学习者这次说的那句话 | ⚠️ **入队内容可能是乱码** | `sentence = (userText \|\| item.answer)`（`:355`）优先用用户输入。输入 `qqqq` 后看答案，落库卡片 `front: "qqqq"`，完成该卡后语法复习页的题面就是 `qqqq` | **P1** |
| 档选择页：「做完这一档，AI 会把你写的几句一起看一遍」 | `GrammarBoostPage.tsx:742` | 档 3 AI 批改 | ✅ 兑现（配置了 AI 时整档一次性批改） | 完成态渲染 `.boost-ai-card`，AI 不可达时降级 | ✅ |
| 档选择页（未配置 AI）：「没配置 AI 也能做——会给答案对照」 | `GrammarBoostPage.tsx:743` | 会有「答案对照」 | ❌ **未兑现** | 未配置 AI 走完档 3：`.boost-ai-card` 0 个、`.boost-ai-notice` **0 个**（连降级提示都没有），页面只有「X / 3 题一次就对」+ 自评 + 「再深一点」（`GrammarBoostPage.tsx:810-813` 只在 `loading`/`degraded` 分支渲染提示） | **P1** |
| 「AI 这次没接上——先看下面的对照。」 / 「还没配置 AI——先看下面的对照」 | `GrammarBoostPage.tsx:434-435` | 下方存在可对照的内容 | ❌ **悬空引用** | AI 不可达时 notice 确实出现，但 `.boost-ai-card` 数量 = **0**——「下面的对照」下面什么都没有（降级分支没有渲染任何对照物料） | **P1** |

### 1.2 复习页 · 排期与队列承诺

| 文案（原文） | 位置 | 承诺了什么 | 实现是否兑现 | 证据 | 严重度 |
|---|---|---|---|---|---|
| 「这张卡很快会再来见你。」 | `GrammarReviewPage.tsx:375` | 看答案的卡会很快回到复习 | ✅ **兑现**（核查期间被另一个进程修好） | 看答案 → `intervalDays=0`、`nextReviewAt=+10min`、`lapseCount=1`；1h/24h/7d 后 `listDueGrammarReviewCards` 均返回 1 张。判据已从 `intervalDays===0` 改为三字段 `neverQueuedSchedule`（`grammarReviewService.ts:58-59`） | ✅ |
| 「上完新课，错过的句子和核心句型**明天**会排进这里。」 | `GrammarReviewPage.tsx:222` | 完课后一天，核心句/错句进本页 | ❌ **未兑现**（永远不进） | `markLessonDone` → `addLessonCoreSentence` → `addSentence` 建卡 `status:"new"` + `intervalDays:0`；`listDueGrammarReviewCards` 用 `status === "new" \|\| neverQueuedSchedule(...)` 双重排除。实测立刻/25h/7d 均为 **0**；日记卡（有问题的句子）同样 0。只有先在**通用复习页**评过分（rating≥2，使 `intervalDays>0`）才可能进本页 | **P0** |
| 空态同一屏 | 同上 | —— | ⚠️ 空态文案对「刚看答案、10 分钟后回来」的卡也照说「明天」 | 看答案后立刻重进：空态 +「明天会排进这里」，而该卡 10 分钟后就会回来 | P2 |
| 「今天没有到期的语法复习」 | `GrammarReviewPage.tsx:222` | 就是「没有到期的卡」 | ✅ 兑现（但见上一行的文案口径问题） | —— | ✅ |
| 「每次复习不超过 10 张——少而准，比多而杂更记得住。」 | `GrammarReviewPage.tsx:240` | 单次会话上限 10 | ✅ 兑现 | 12 张到期 → `buildGrammarReviewSession` 截断为 10，UI 进度 `/ 10 张`，走完 10 张进入完成态 | ✅ |
| 「（已记入本周复习数据）」 | `GrammarReviewPage.tsx:236` | 本次复习计入**本周**数据 | ⚠️ **口径不符** | 条件是 `summary.totalEvents > 0`（`summary` = `summarizeGrammarTelemetry()`，全库累计）。库里只有一条 **30 天前**的完课事件、无本周任何事件时，本提示照样显示。真正写下的只有 1 条 `grammar_review_result` | **P2** |

### 1.3 复习页 · 题目与掌握口径

| 文案（原文） | 位置 | 承诺了什么 | 实现是否兑现 | 证据 | 严重度 |
|---|---|---|---|---|---|
| 「到期句子变成**改一改**、拼一拼的小任务」 | `GrammarReviewPage.tsx:191` | 题型里有「改一改」（改错） | ❌ **未兑现** | 可用题型只有 `cloze` / `rebuild` / `free_type`（`buildGrammarReviewTask`）。「改一改」不存在，只有「选词补全」「拼句」「自己写」 | **P2** |
| 「产出一次，才算真的会。」 | `GrammarReviewPage.tsx:191` | 掌握必须经过产出 | ⚠️ **口径不符** | 纯 cloze 路径（无任何产出题）评 4 次 rating=4 即可 `status="mastered"`（`isMasteredBySpacedRepetition`，`CARD_MASTERED_MIN_REVIEW_COUNT=4`）。反向：`free_type` 的「输出连续 2 次通过」判据 `isMasteredByOutput` 只看 `mode === "recall"`，而 `reviewModeForTask` 把 **rebuild 也映射成 recall**（`GrammarReviewPage.tsx:25-26`）——两次 rebuild 通过即被算作「输出连续 2 次通过」 | **P1** |
| 题头三档：「选词补全句子」「把句子拼回去」「自己把句子写出来」 | `GrammarReviewPage.tsx:256` | 与题型一致 | ✅ 兑现 | 三档文案与 `task.mode` 一一对应 | ✅ |
| 进行态「想不起来了，看答案」 | `GrammarReviewPage.tsx:351-354` | 卡住时能看答案 | ⚠️ **首答无出口**（rebuild 尤甚） | 显示条件 `outcome === "idle" && attempts > 0`。cloze：点错一个后即出现（可自救）。**rebuild：必须把词块摆满才判题、才 `attempts+1`**——摆到只剩 1 个词块仍无「看答案」，且**没有任何文字反馈**（页面「顺序」二字只来自题面引导语 1 次）。完全不会的用户只能盲点满、或离开页面 | **P1** |
| free_type 提示：「还没对上——回忆一下卡片来源的那句话，或者点「看答案」。」 | `GrammarReviewPage.tsx:158` | 页面存在「看答案」 | ✅ 兑现 | 提交一次失败后 `attempts=1`，按钮出现（实测 `["提交","想不起来了，看答案"]`） | ✅ |
| 「正确的说法是：…」 | `GrammarReviewPage.tsx:374` | —— | ❌ **红线违规**：出现「**正确**」 | `GRAMMAR_DEPTH_PRD.md:245` 明确「全程不出现『错误/答错/失败』字样」。同页其它反馈用「还没对上」「已经对了一部分」，此处独用「正确的说法」 | **P1** |
| 反馈区讲解 `{task.note}` | `GrammarReviewPage.tsx:375` | 讲「为什么」 | ❌ **红线违规 + 机器 token 泄漏** | hunt 卡 `note` 源自 `huntService.ts:311` 的 `grammarNote`，形如 `[tense:move] 时态变形：move → moved。…`。页面 `.lesson-saved-hint` 原样渲染（实测文本含 `[tense:move]` 与「时态变形」）。全库 **441 处** hunt 讲解命中零术语红线词表；4 个案件标题越线（「三个介词」「时态跳走了」「不可数的东西」「形容词站错位置」） | **P1** |

### 1.4 趁热练 · 答案与题面语义一致

| 文案（原文） | 位置 | 承诺了什么 | 实现是否兑现 | 证据 | 严重度 |
|---|---|---|---|---|---|
| 「这句写错了——请你把它改对，整句写出来。」+「这句有问题」 | `GrammarBoostService` tier3 `fix` 构造 | 给出的句子**有错** | ❌ **答案与题面语义矛盾**（3 处） | `lesson-87-its-cold`：题面给 `It's cold today.` 说「写错了」，答案是 `It is cold today.`，而**同一题的讲解**说「两句都对——长的短的都在…意思一模一样」；源数据该条 `bothRight: true`。照原句作答被判 **通过**（score 100）。候选池含 **460 条** `bothRight` 记录，全部可被 fix 取用（`buildTierThree` 不排除 `bothRight`） | **P0** |
| 「这句话，你觉得有问题吗？」+「有点问题 / 没问题」 | `GrammarBoostService` tier1 `contrast` 构造（`isWrong` 硬编码 `true`） | 该句**有问题** | ❌ **复练轮会出语义矛盾的题**（3 句、9 个抽题组合 / 12 轮累计 18 次） | 候选池 `lesson.contrast.slice(0,4)` 不排除 `bothRight`。复练轮 r2–r4 会把 `How much milk is there?`（源数据 `bothRight: true`，`whyZh` 明说「两句都对」）、`It's cold today.`、`There are few apples.` 当成「有问题」出题 | **P0** |
| 旧课混题：「回头看一句你以前容易错的地方」 | `pickFirstUnseenContrast` | 抽的是「以前的错句」 | ⚠️ **可疑**：全库 192 课中 **151 课**含 `bothRight` 条，`pickFirstUnseenContrast` 遍历 `old.contrast` 全量、不过滤 `bothRight`，同样可能抽到「两句都对」的句子并标成错句给出 | 未构造出实际命中用例（需特定弱点 tag + seen 集合），**列为可疑未证实** | P2（可疑） |
| 「对了！」（spot 题通过后） | `GrammarBoostPage.tsx:1212` + `:1230` | 展示**改对后**的句子 | ❌ **反馈区展示的是错句** | spot 的 `answer` = `spotStep.tokens.join(" ")` = 原错句（全库 192/192 道 spot 的 `answer` 都等于 `spotTokens` 拼起来的错句，如 `I is Xiaomei.`）。反馈区 `strong` 渲染 `{currentItem?.answer}` → 实测显示 **「对了！I is Xiaomei.」**。改后句只藏在 `spotCorrectionZh` 的一句中文里 | **P1** |
| arrange 题面：「这一题多了两个没用的词块，别被它们骗了。」 | `buildTierTwo` arrange 构造 | 多出**两个**干扰词块 | ❌ **数字不符** | 代码 `distractors.slice(0, 2)` 是上限；实测 211 道 arrange 中 **205 道只多 1 个**词块（仅 6 道多 2 个） | **P2** |

### 1.5 趁热练 · 计数、进度与完成态

| 文案（原文） | 位置 | 承诺了什么 | 实现是否兑现 | 证据 | 严重度 |
|---|---|---|---|---|---|
| 档位卡「4 题，约 2 分钟」「5 题，约 4 分钟」「3 题，约 4 分钟」 | `BOOST_TIER_META` | 题量 + 时长 | ✅ 题量兑现；⚠️ 时长无约束机制 | 全库 193 课 × 3 档，实际题量**恒等于**声明值（分布集合分别为 {4}/{5}/{3}）。时长为声明文案，无计时/限时（符合红线：不限时是正确的） | ✅ |
| 「{firstTryCount} / {items.length} 题一次就对」 | `GrammarBoostPage.tsx:773` | 只统计**一次就对** | ⚠️ 「看答案」路径会记 attempts+1 从而不计入，符合字面；但**档 1 listen/bothright 上的「看答案」与「答错」不可区分**（都走 `revealAnswer`），且 reveal 时 `recordStep(..., false)` 恒记失败 | 实测：1 题看答案 → 完成态「3 / 4 题一次就对」（首次核对时页面与埋点曾不一致，**核查期间已被另一进程修掉**：`finishTier(finalFirstTryCount)`） | P2 |
| 「再深一点：{下一档}（{N} 分钟）」 | `GrammarBoostPage.tsx:847` | 推**下一个未完成**档 | ⚠️ **首帧短暂显示刚做完的档** | 落盘 `grammarBoostsDone` 经 `updateData` 异步链 + `flushAsync` 才刷新；实测 flush 前按钮为「再深一点：**再认一次**（2 分钟）」（刚做完的就是档 1），flush 后才变「自己想（4 分钟）」 | **P2** |
| 「『再认一次』走完了一遍——…今天练到这也算数。」 | `GrammarBoostPage.tsx:768` | 完成态与自评 | ✅ 兑现 | 三档独立完成态、允许只做一档退出 | ✅ |
| 进行态 `{index + (pass|revealed ? 1 : 0)} / {items.length} 题` | `GrammarBoostPage.tsx:917` | retry 时不前进 | ✅ 兑现（代码注释记录了 2026-09-21 的修复） | retry 非终态，进度不 +1 | ✅ |
| 档位卡「走过一遍」/「建议从这里开始」 | `GrammarBoostPage.tsx:742-736` | 对应 `grammarBoostsDone` | ✅ 兑现 | 与 `getLessonBoostTiersDone` 一致 | ✅ |
| 「练到第 X 档」/「三档都走过了」 | `boostProgressLabel` | 已完成档数 | ✅ 兑现 | `done.size===0 → null`；`≥3 → 三档都走过了`；否则 `max(done)` | ✅ |

### 1.6 复习页 · 掌握条与计数口径

| 文案（原文） | 位置 | 承诺了什么 | 实现是否兑现 | 证据 | 严重度 |
|---|---|---|---|---|---|
| 「语法句型 已掌握 N / 共 M 句 · 进行中 X · 未开始 Y」 | `GrammarReviewPage.tsx:212-214` | 三段划分 | ✅ **三者之和恒等于 total** | `summarizeGrammarMastery` 互斥分支；构造 4 种状态（mastered / review+rc1 / new+rc0 / review+rc0）实测 `mastered+inProgress+notStarted === total === 4` | ✅ |
| 同上 +「第 1 / 1 张」同屏（已掌握的卡） | 同上 + `:254` | 已掌握的不该再被提问 | ❌ **同屏自相矛盾** | `listDueGrammarReviewCards` 不排除 `mastered`（只排除 `suspended`/`new`/`neverQueued`）。mastered + 到期的卡实测同时渲染「已掌握 1 / 共 1 句」与「第 1 / 1 张」 | **P1** |
| 同上 +「第 1 / 1 张」同屏（`reviewCount=0`） | 同上 | 正在作答的卡不该是「未开始」 | ❌ **同屏自相矛盾** | `summarizeGrammarMastery` 用 `reviewCount === 0` 判「未开始」，而队列用 `neverQueuedSchedule`（三字段）。`intervalDays>0 && reviewCount===0` 的卡实测同屏显示「未开始 1」+「第 1 / 1 张」 | **P1** |
| 「本次共 N 张卡：X 张一次到位，Y 张还需要再见几次」 | `GrammarReviewPage.tsx:241` | 两数之和 = N | ✅ 兑现 | 看答案 →「0 张一次到位，1 张还需要再见几次」；10 张全对 →「10 / 0」 | ✅ |
| 「{index+1} / {total} 张」进度 | `GrammarReviewPage.tsx:188`,`246` | 进度与位置一致 | ✅ 兑现 | 复习页无 retry 终态，公式成立 | ✅ |

### 1.7 红线复查表

红线依据：零术语词表 `src/data/grammarZeroTerms.ts`；Affective Filter 依据 `GRAMMAR_PEDAGOGY_REVIEW.md:226`（「任何形式的限时 / 排名 / 体力值」列为 Non-goals）与 `GRAMMAR_DEPTH_PRD.md:245`（「全程不出现『错误/答错/失败』字样」）。

| 检查项 | 检查了什么字段 | 结果 |
|---|---|---|
| 零术语（页面源码字符串） | `GrammarReviewPage.tsx` / `GrammarBoostPage.tsx` 全部中文字面量 | ❌ 命中 **1 处**：`GrammarBoostPage.tsx:587` `"还差一点——想想主语是谁，搭档要跟着变。"`（`choose`/`replace` 答错反馈，「主语」在红线表内）。实测在 replace 题答错后渲染到页面 |
| 零术语（复习页运行时渲染的第三方文案） | `task.note`（hunt `grammarNote`）、`task.promptText`（`card.note`） | ❌ 命中：「时态变形」「时态」等经 `huntService.ts:311` 进入复习页反馈区。全库 hunt 讲解 **441 处**、案件标题 **4 处**越线 |
| 零术语（趁热练弱点提示 `weakSpotPlain`） | `computeWeakSpots(data)[0].plain` → `GRAMMAR_ERROR_TAG_PLAIN` → `.boost-weak-hint`（`GrammarBoostPage.tsx:922-927`） | ❌ 命中 **6/11 个罪名**：`missing_be`（主语、形容词）、`article`（单数、可数）、`fragment`（主语）、`word_order`（语序）、`verb_form`（原形）、`comparison`（形容词）。逐一实渲染确认（含 `missing_be` 的完整页面文本）。另有 5 个罪名标签自身越线：`时态变形`/`单复数`/`介词`/`语序`/`比较级` |
| 零术语（趁热练题面/选项/讲解） | 全库 193 课 × 3 档全部 `BoostItem` 的用户可见字段（`promptZh`/`intentZh`/`explainZh`/`answer`/`clozeText`/`clozeOptions`/`contrast` 三字段/`listenOptions`/`spotTokens`/`tokens`/`options`/`hints`/`shapedLabel`/`shapedFrom`/`spotCorrectionZh`） | ✅ 零命中（既有 `bo0b-probe` 同结论） |
| 零术语（课程一句话规则 `oneLineRule`） | 全库 `lesson.oneLineRule` | ✅ 零命中 |
| Affective Filter · 「正确」 | 两页全部中文文案 | ❌ 命中 1 处：`GrammarReviewPage.tsx:374`「**正确**的说法是：」。复核同页其它反馈均用「还没对上」「已经对了一部分」——此处为唯一例外 |
| Affective Filter · 「错误 / 做错 / 答错 / 写错」 | 两页**用户可见**文案（注释不算） | ✅ 无命中。`GrammarBoostPage.tsx:1245`「把错的改成对的」出现在 `itemLabel`（题型标签）中——**判为可接受**：该行是题型名而非对用户的评价。注释里的「答错/失败」不计 |
| Affective Filter · 限时 / 倒计时 / 计时器 | 两页源码 + 复习页 `TIME_BUDGET` 残留 | ✅ 无。`GRAMMAR_REVIEW_TIME_BUDGET_MS` 已删除且全局零引用（`r2-session-caps.test.tsx` 锁定）；档位卡的「约 N 分钟」是预期时长声明，非倒计时。`GrammarBoostPage` 的 `durationMs`/`dwellMs` 只进旁路遥测，不渲染 |
| Affective Filter · 排名 / 排行榜 | 两页源码 | ✅ 无 |
| Affective Filter · 体力值 / 生命值 / 连击惩罚 | 两页源码 | ✅ 无。`Flame` 图标仅作进度点缀，无火焰数量/体力语义 |
| Affective Filter · 正确率门禁 / 及格线 | 档间推进、完成条件 | ✅ 无。`judgeBoostItem` 判分只影响反馈文案，`advance` 不设通过率门槛；复习页 6 条路径（含全看答案）都能走完 |
| 答案与题面语义一致 | 趁热练 `fix` / `contrast` / `spot` 三类题 + 复习页三类题 | ❌ `fix`（3 处）、`contrast`（3 句 / 9 组合）、`spot`（192/192 反馈展示错句）；复习页三类题语义一致（cloze 挖空答案取自原句同位置、rebuild 词块来自原句、free_type 对照原句） |

---

## 2. 确认的缺陷（含最小复现）

### P0-1 · 趁热练档 1/2 的「这句已经排进复习队列」是空承诺

- **位置**：`src/pages/GrammarBoostPage.tsx:354`（`if (tier !== 3) return;`）、`:1237`（文案）、`:1258`（按钮）
- **用户会被怎么误导**：在档 1 或档 2 卡住、点「看答案（会排进复习）」，页面回「这句已经排进复习队列，后面会再见到它」——用户据此认为这句已被系统接管、不必自己再管。实际上队列、`AppData.cards`、`sentence_card_enqueued` 遥测**三处都零变化**（后者是全库唯一用来度量「趁热练 → 复习」增长链的信号，也因此永久失真）。用户反复练同一批句子，每次都收到同一条不存在的承诺。
- **最小复现**（`pr1-promises.test.tsx` → `PR1-1`）：

  ```
  档1 listen 题：点错选项 → 「看答案（会排进复习）」出现 → 点击
  页面文本含「这句已经排进复习队列，后面会再见到它。」   → true
  readAppData().cards.length                                 → 0   （期望 ≥1）
  telemetryOfKind("sentence_card_enqueued").length           → 0   （期望 1）
  对照：同一操作在档 3 → cards.length 1、事件 1
  ```

- **严重度**：P0

### P0-2 · 复习页空态「明天会排进这里」的路径不存在

- **位置**：`src/pages/GrammarReviewPage.tsx:222`；`grammarReviewService.ts:78`
- **用户会被怎么误导**：刚上完新课的用户回到复习页，看到「今天没有到期的语法复习 / 上完新课，错过的句子和核心句型明天会排进这里」——于是明天再来，仍是同一句话，永远等不到。真相是本页只消化「已在**通用复习页**被评过分」的卡：`addSentence` 建卡一律 `status:"new"` + `intervalDays:0`，而 `listDueGrammarReviewCards` 用 `status === "new" || neverQueuedSchedule(...)` 双重排除。核心句（`lessonService.addLessonCoreSentence`）、错句（`addLessonMistakeSentence`）、日记批改句（`diaryService.addDiarySentenceToReview`）、侦探缺口句（`huntService.addHuntGapSentences`）**四个来源全部**卡在这道门上。课内「看答案」处另有承诺「这句会排进复习队列」（`GrammarLessonPage.tsx:1534` 注释），指的是通用复习页——但用户在语法复习页里等，等不到。
- **最小复现**（`PR1-4`）：

  ```
  markLessonDone(seedAppData({}), "lesson-13-now")
  核心句卡: "I am drawing a picture."  status="new"  intervalDays=0
  listDueGrammarReviewCards(立刻)      → 0
  listDueGrammarReviewCards(+25h)      → 0
  listDueGrammarReviewCards(+7d)       → 0
  页面: 「今天没有到期的语法复习」+「…明天会排进这里」→ true
  日记卡（issues 非空）走 addDiarySentenceToReview → 同样 0
  反证: 先在通用复习页 applyReview(rating=4) 后再 +4d → 1   ← 唯一入口
  ```

- **严重度**：P0

### P0-3 · fix 题把「两句都对」的句子说成「这句写错了」

- **位置**：`src/services/grammarBoostService.ts` `buildTierThree` 的 `fix` 分支（遍历 `lesson.contrast` 不排除 `bothRight`）
- **用户会被怎么误导**：题面「这句写错了——请你把它改对，整句写出来」+「这句有问题」，给出的却是课程数据里明确标注 `bothRight: true`、`whyZh` 写着「两句都对…意思一模一样」的句子。用户若认为原句没问题（正确判断），写回原句会被判**通过**（score 100）——于是「改错题」被系统认可为「原样抄一遍」；若不写回原句，则是被强迫把一句正确的话改成另一句写法。
- **最小复现**（`PR1-9`）：

  ```
  buildBoostItems("lesson-87-its-cold", 3).find(kind==="fix")
    shapedFrom = "It's cold today."
    answer     = "It is cold today."
    shapedLabel= "这句有问题"
    promptZh   = "这句写错了——请你把它改对，整句写出来。"
    explainZh  = "两句都对——长的短的都在：It is cold（第 6 课学的）和 It's cold（今天学的短版）意思一模一样。"
  judgeBoostItem(fix, { text: "It's cold today." }).passed → true  （抄原句即通过）
  候选池：460 条 bothRight 记录全部可被 fix 取用（无 bothRight 过滤）
  实际抽中 3 处：lesson-76-much-better#0（How much milk is there?
                → 要求改成 I feel much better.，用原句作答 score=17）
                lesson-87-its-cold#0、lesson-169-id-like#1（score=100）
  ```

- **严重度**：P0

### P0-4 · 档 1 对比题在复练轮把 `bothRight` 句当「有点问题」

- **位置**：`grammarBoostService.ts` `buildTierOne` 的 `candidates.contrast`（`lesson.contrast.slice(0,4)`，`isWrong` 硬编码 `true`）
- **用户会被怎么误导**：题面「这句话，你觉得有问题吗？」给出 `It's cold today.`，而课程数据说这句和 `It is cold today.` **都对**（`whyZh`: 「两句都对——长的短的都在…意思一模一样」）。用户选「没问题」（正确判断）会被判错，反馈还搬出同一条讲解说「两句都对」——**用户明知自己没错却被判错，且讲解反过来证明用户是对的**。
- **最小复现**（`PR1-10`）：

  ```
  枚举全库 193 课 × 复练轮 round 0..5：
    round 0/1 正常，round 2/3/4 抽出 9 个冲突组合（3 句）
    round 0..11 累计 18 次、固定回到同一批 3 句：
      lesson-76-much-better  "How much milk is there?"  ×6
      lesson-87-its-cold     "It's cold today."          ×6
      lesson-114-a-few       "There are few apples."     ×6
  抽中题：isWrong = true（源数据 bothRight = true），answer = "I feel much better."
  ```

- **严重度**：P0

### P1-1 · spot 题通过后反馈区展示的是**错句**

- **位置**：`src/services/grammarBoostService.ts`（`spot` 的 `answer: spotStep.tokens.join(" ")`）、`src/pages/GrammarBoostPage.tsx:1212`、`:1230`
- **用户会被怎么误导**：改错题的正确路径是「点出那个错词」。用户点对了 → 反馈区出现「**对了！**」紧跟一句错的英文（`I is Xiaomei.`），后面才是中文说明「把 is 换成 am：I am Xiaomei。」。用户很容易把反馈区那行加粗英文当成「正确答案」记下来——而它是**错误句子**，且页面上没有任何视觉标记区分。全库 **192/192** 道 spot 的 `answer` 都等于错句原文，也就是说这个错误在所有 192 课上 100% 复现。
- **最小复现**（`PR1`+探针输出）：

  ```
  lesson-01-am 档1 spot：
    spotTokens = ["I","is","Xiaomei."]   answer = "I is Xiaomei."
    spotCorrectionZh = "把 is 换成 am：I am Xiaomei。"
  点中下标 1（"is"）→ 反馈区：
    strong 文本 = ["I is Xiaomei."]
    整段 = "对了！I is Xiaomei.is 不是 I 的搭档。…把 is 换成 am：I am Xiaomei。这一句现在能自己说出来了…"
  全库统计：spot 题 192，answer == 错句全文的 192（100%）
  ```

- **严重度**：P1

### P1-2 · 未配置 AI 时档 3 承诺的「答案对照」不存在

- **位置**：`src/pages/GrammarBoostPage.tsx:743`（档位卡文案）、`:810-813`（完成态只渲染 `loading` / `degraded` 分支）
- **用户会被怎么误导**：档位卡明说「没配置 AI 也能做——**会给答案对照**（配置后能看到错在哪一类）」，用户据此预期做完能看到自己写的几句 vs 正确写法的对照。实际完成态只有「X / 3 题一次就对」+ 自评 + 「再深一点」——**既无 AI 卡片，也无任何降级提示**（未配置时 `runAiCorrection` 因 `aiReady === false` 根本不触发，`aiState` 停在 `"idle"`，两个分支都不渲染）。用户会以为是自己某处操作错了。
- **最小复现**（`PR1-15` 第二条）：

  ```
  默认 settings（aiProvider.enabled = false）→ 档 3 全程「看答案」走完
  完成态：.boost-ai-card 0 个、.boost-ai-notice 0 个
  页面文本 = "…「换你来说」走完了一遍——0 / 3 题一次就对。…再深一点：再认一次（2 分钟）今天先到这"
  ```

- **严重度**：P1

### P1-3 · AI 降级提示「先看下面的对照」是悬空引用

- **位置**：`src/pages/GrammarBoostPage.tsx:434-435`（文案）、`:813`（渲染条件）
- **用户会被怎么误导**：AI 超时/报错时出现「AI 这次没接上——先看下面的对照。」，用户往下找「对照」，下面什么都没有。
- **最小复现**（`PR1-15` 第一条）：

  ```
  aiProvider = { enabled:true, baseUrl:"https://127.0.0.1:9/v1", apiKey:"k", model:"m" }
  档 3 全对走完 → flushAsync ×3
  .boost-ai-notice 文本 = "AI 这次没接上——先看下面的对照。"
  .boost-ai-card 数量    = 0        ← 「下面的对照」不存在
  ai_result 事件：degraded=true, degradeReason="timeout"
  ```

- **严重度**：P1

### P1-4 · 档 3 入队的是用户写的乱码，不是目标句

- **位置**：`src/pages/GrammarBoostPage.tsx:362` `const sentence = (userText || item.answer).trim();`
- **用户会被怎么误导**：档 3 是「不给提示，自己说」。用户完全不会、随便敲了几个字符再点「看答案」，系统把**这几个字符**当成「错句」存进 SM-2 队列（`note: 趁热练：…`、`tags: 语法,强化`）。这张卡日后进入语法复习，题面就是 `qqqq`——用户会看到一道以乱码为「正确句子」的题，并在后续所有衍生物（cloze 选项、rebuild 词块、free_type 锚点）里继续见到它。空输入被 `queueFailedProduce` 的 `if (!sentence) return` 挡住，但 `revealAnswer` 在 `textValue` 为空时用的是 `item.answer`——两个方向都有问题（乱码入库 / 未作答也入库标准答案）。
- **最小复现**（`PR1-2`）：

  ```
  档3 首题 answer = "I am drawing a picture."
  输入 "qqqq" → 提交 → 点「看答案（会排进复习）」
  readAppData().cards = [{ front: "qqqq", note: "趁热练：小美的一天 ⑬ 正在做什么",
                           tags: ["语法","强化"] }]
  sentence_card_enqueued 事件 sentence = "qqqq"
  把该卡置为 review + intervalDays=1 → listDueGrammarReviewCards[0].card.front = "qqqq"
  ```

- **严重度**：P1

### P1-5 · 「产出一次，才算真的会」与实际掌握口径不符

- **位置**：`src/pages/GrammarReviewPage.tsx:191`（文案）、`:25-26`（`reviewModeForTask`）、`grammarReviewService.ts` `isMasteredByOutput`；`reviewService.ts` `isMasteredBySpacedRepetition`
- **用户会被怎么误导**：页面把「产出」立为掌握的门槛，但两条路径都能绕过：
  1. **纯 cloze 路径**：同一张卡连续 4 次 rating=4 即 `status="mastered"`，全程只需点选词块，**没有任何一次产出**。
  2. **rebuild 冒充产出**：`isMasteredByOutput` 只筛 `review.mode === "recall"`，而 `reviewModeForTask` 把 `rebuild` 与 `free_type` **都**映射成 `"recall"`。于是「两次 rebuild 通过」会被判为「输出连续 2 次通过」，卡被置 mastered——用户可能一次都没自由输出过。
  用户的损失是掌握条上出现一个自己其实说不出来的「已掌握」。
- **最小复现**（`PR1-14`）：

  ```
  ① applyReview ×4 (mode="cloze", rating=4) → cards[0].status === "mastered"
  ② isMasteredByOutput([{mode:"recall",rating:4},{mode:"recall",rating:4}], "c1") → true
     （这两条 recall 实际来自 reviewCount=1 时的两次 rebuild —— 已确认
      buildGrammarReviewTask(reviewCount=1).mode === "rebuild"，
      而 applyReview 写入的 review.mode === "recall"）
  ```

- **严重度**：P1

### P1-6 · 掌握条与题目同屏自相矛盾（两处）

- **位置**：`GrammarReviewPage.tsx:212`（掌握条）与 `:254`（题头）；`grammarReviewService.ts` `summarizeGrammarMastery` vs `listDueGrammarReviewCards`
- **用户会被怎么误导**：
  1. `mastered` + 到期 → 页面同时显示「已掌握 1 / 共 1 句」与「第 1 / 1 张」。用户刚被告知「已掌握」，紧接着又被拿同一句提问，对「已掌握」的含义失去信任。
  2. `intervalDays>0 && reviewCount===0` → 同时显示「未开始 1」与「第 1 / 1 张」。用户正在作答的卡被标为「未开始」。
  根因是两个函数对同一概念用了两套判据：队列用 `neverQueuedSchedule`（三字段），掌握条用 `reviewCount === 0`。
- **最小复现**（`PR1-11`）：

  ```
  ① status="mastered", intervalDays=3, 已到期
     → 「已掌握 1」true、「共 1 句」true、「第 1 / 1 张」true
  ② status="review", reviewCount=0, intervalDays=1, 已到期
     → 「未开始 1」true、「第 1 / 1 张」true
  ③ 四段划分之和恒等于 total（这一条是 ✅）
  ```

- **严重度**：P1

### P1-7 · 零术语红线：趁热练 replace 答错反馈含「主语」

- **位置**：`src/pages/GrammarBoostPage.tsx:587` `setFeedback("还差一点——想想主语是谁，搭档要跟着变。");`
- **用户会被怎么误导**：零基础用户（本项目明确以「零术语」为红线，`grammarZeroTerms.ts` 词表把「主语」列为禁用词）在 `choose`/`replace` 题答错后被告知「想想**主语**是谁」——「主语」正是他们不具备的概念，提示因此不可执行。同页其它反馈（「再听一遍——两句只差一个地方」）都遵守了零术语，此处为唯一例外。
- **最小复现**（`PR1-5`）：

  ```
  lesson-13-now 档1 replace 题（选项 ["is","am","are"]，答案 "is"）→ 点 "am"
  反馈 = "还差一点——想想主语是谁，搭档要跟着变。"
  GRAMMAR_ZERO_TERMS 命中 = ["主语"]
  ```

- **严重度**：P1

### P1-8 · 零术语红线：复习页反馈原样渲染 hunt 讲解（含「时态变形」与机器 token）

- **位置**：`src/pages/GrammarReviewPage.tsx:375`（`{task.note && <>（{task.note}）</>}`）；`grammarReviewService.ts` `note = details?.grammarNote || card.note`；来源 `src/services/huntService.ts:311`
- **用户会被怎么误导**：侦探案件的缺口句进入复习后，答对/看答案时反馈区出现 `（[tense:move] 时态变形：move → moved。Last week 说的是过去发生的事，动词要用过去式：move → moved。）`。「时态」是红线词；`[tense:move]` 是给程序看的内部 token，用户看到是一串无意义括号。规模：hunt 讲解 **441 处**越线、案件标题 **4 处**越线。
- **最小复现**（`PR1-7`）：

  ```
  addHuntGapSentences(...) → status="review", intervalDays=1 → 进会话
  task.note = "[tense:move] 时态变形：move → moved。Last week 说的是过去发生的事，动词要用过去式：move → moved。"
  buildGrammarReviewTask(...).note 含 "时态变形" → true
  答对后 .lesson-saved-hint 文本含 "[tense:move]" → true；零术语命中 ["时态"]
  全库：hunt 讲解越线 441，案件标题越线 4（「三个介词」「时态跳走了」「不可数的东西」「形容词站错位置」）
  ```

- **严重度**：P1

### P1-9 · 零术语红线：趁热练弱点提示把罪名的「人话版」直接渲染

- **位置**：`src/pages/GrammarBoostPage.tsx:922-927`（`.boost-weak-hint`）→ `computeWeakSpots(data)[0].plain` → `GRAMMAR_ERROR_TAG_PLAIN`（`huntService.ts:31-42`）
- **用户会被怎么误导**：弱点提示的立意是「让用户看得见这道题是冲我的短板来的」，用词也刻意选「人话版」。但这些人话版里有 6/11 命中红线词表——`missing_be`：「**主语**和**形容词**之间少了个『是』」；`article`：「**可数**名词**单数**前面要有 a / an / the」；`fragment`：「每个句子必须有**主语**和动词」；`word_order`：「…英语的**语序**和中文不太一样」；`verb_form`：「…**原形** / -ing / 过去式…」；`comparison`：「…**形容词**要带上 -er 或 more」。另有 5 个**罪名标签**自身越线（时态变形 / 单复数 / 介词 / 语序 / 比较级）——它们会出现在 hunt、日记、复习页等多处。这些「人话」对本项目的目标用户（零基础）并不比术语更容易。
- **最小复现**（`PR1-6`）：

  ```
  造 8 条 hunt_verdict(verdictKind="wrongTag", guessedTag="missing_be") 遥测
  computeWeakSpots(data)[0].tag === "missing_be" → true
  推进到 targetsWeakSpot 题 → .boost-weak-hint 文本：
    "这道题冲着你之前容易错的地方来的：主语和形容词之间少了个『是』（am/is/are）"
  零术语命中 = ["主语","形容词"]
  逐 tag 实渲染确认：missing_be/article/fragment/word_order/verb_form/comparison 六个都越线
  ```

- **严重度**：P1

### P1-10 · 情绪红线：复习页 reveal 文案「正确的说法是」

- **位置**：`src/pages/GrammarReviewPage.tsx:374`
- **用户会被怎么误导**：`GRAMMAR_DEPTH_PRD.md:245` 的落地方针是「全程不出现『错误/答错/失败』字样…用『揭晓』」。本句用「**正确**的说法」——正是该红线的镜像词（另一半）。同页其它反馈都规避了（「还没对上」「已经对了一部分」），此处为唯一例外。用户（尤其是已经答错一次才看到这句的人）被提醒「你刚才说的是错的」。
- **最小复现**（`PR1-8`）：cloze 首题点错一个选项 → 点「想不起来了，看答案」→ 页面文本含「正确的说法是：」
- **严重度**：P1

### P1-11 · 复习页首题在 rebuild 题型下「看答案」无出口

- **位置**：`src/pages/GrammarReviewPage.tsx:351`（`outcome === "idle" && attempts > 0`）、`:332`（rebuild 判题时机 = 摆满词块）
- **用户会被怎么误导**：rebuild 题只在**摆满全部词块**时才判题（`next.length === task.scrambled.length`），此前 `attempts` 一直是 0，因此「想不起来了，看答案」不显示。一个完全不知道句子怎么拼的用户，可以摆到只剩一个词块、依然看不到任何出口，也**没有任何文字反馈**（摆错顺序时页面静默——实测反馈区为空）。用户唯一的选择是盲点满全部词块触发判题，或直接离开页面（用「今天先到这里」）。
  说明：cloze 题型下点错一个选项即出现按钮，用户可自救；因此这是 **rebuild（及 free_type 未提交时）特有**的困境，而 rebuild 正是 `reviewCount` 为奇数时的主要题型。
- **最小复现**（`PR1-17`）：

  ```
  rebuild 首题（reviewCount=1）：8 个词块
    摆到只剩 1 个 → buttonMatching(/看答案/) → undefined   ← 无出口
    （页面「顺序」二字的出现次数 = 1，只来自题面引导语；反馈区无任何提示）
  摆满（错序）→ buttonMatching(/看答案/) → 命中
  cloze 首题对照：未答前 undefined → 点错 1 个后命中
  ```

- **严重度**：P1

### P2 级缺陷（摘要）

| # | 位置 | 问题 | 复现 |
|---|---|---|---|
| P2-1 | `GrammarBoostPage.tsx:743`（档位卡） | arrange 题面承诺「多了**两个**没用的词块」，实际 211 道中 205 道只多 1 个 | `PR1`+探针：`distractors.slice(0,2)` 上限；分布 `{1:205, 2:6}` |
| P2-2 | `GrammarReviewPage.tsx:191` | 描述含「**改一改**」，可用题型无改错 | `PR1-13`：题型集合 `["cloze","free_type","rebuild"]` |
| P2-3 | `GrammarReviewPage.tsx:236` | 「已记入**本周**复习数据」无时间窗校验，30 天前的无关事件也能触发 | `PR1-12`：仅一条 30 天前 `grammar_lesson_completed` → 提示出现；写入的只有 1 条 `grammar_review_result` |
| P2-4 | `GrammarBoostPage.tsx:847` | 完成态「再深一点」首帧指向**刚做完的档**（`grammarBoostsDone` 落盘异步） | 探针：flush 前「再深一点：再认一次（2 分钟）」→ flush 后「自己想（4 分钟）」 |
| P2-5 | `GrammarBoostPage.tsx:1223` | 档 1 listen/bothright 的「看答案」与「答错」都走 `revealAnswer`、都记 `recordStep(..., false)`；`reveals` 与真实失误无法区分（遥测口径） | 探针：`attemptsThisItem` 未答即可点 reveal；`recordStep(attempts+1, false)` |
| P2-6 | `GrammarReviewPage.tsx:222` | 「明天会排进这里」对「10 分钟后就会回来」的卡也照说 | `PR1-3`：看答案后立刻重进 = 空态 +「明天会排进这里」，而该卡 10 分钟后回到队列 |

---

## 3. 可疑但未证实

| 项 | 为什么可疑 | 为什么没证实 |
|---|---|---|
| 旧课混题（`pickFirstUnseenContrast`）会抽到 `bothRight` 句并标成错句 | 遍历 `old.contrast` 全量、不过滤 `bothRight`；全库 192 课中 151 课含 `bothRight` 条 | 需要特定 `weakSpotTag` + `seen` 集合组合才命中；未能构造出实际渲染用例（按 `WEAK_SPOT_KEYWORDS` 反查未命中含 `bothRight` 的课） |
| 档 3 的 `loadAiVariants` 补题可能在题号上「跳号」 | `additions` 的 id 用 `index`（过滤后位置），`setItems(...).slice(0, 3)` 可能与已用题碰撞 | 未在 jsdom 里跑通 AI 生成分支（需 mock AI 返回合法 `GeneratedBoostItem`） |
| `diversifyReviewModes` 的贪心交换可能反而制造新的相邻同型 | 只向后找「与前一张和当前都不同型」的候选；找不到就原地不动，不回溯 | 未构造出违反例（需要特定 reviewCount 序列） |
| 复习页 `summary`（`summarizeGrammarTelemetry()`）每次完成态全量解析 3000 条事件 | `useMemo` 依赖 `[finished]`，仅算一次，本身不算缺陷 | 属性能观察，非承诺问题；未做计时 |
| `arrange` 的判题门槛 `boostArrangeAnswerLength`（答案词数）在干扰项重复答案词时可能提前判题 | 门槛用「答案词数」而非「答案中各词的可用数」 | 数据侧已确认 `tokens.length >= answerWords`（0 例不足），但未检查干扰项与答案词重复的组合 |

---

## 4. 已兑现的承诺（覆盖面证明）

| 文案 / 机制 | 位置 | 怎么验证的 |
|---|---|---|
| 会话上限 10 张 | `GRAMMAR_REVIEW_SESSION_LIMIT`；`GrammarReviewPage.tsx:240` | 12 张到期 → 会话截断为 10、UI `/ 10 张`、走完 10 张进完成态；`limit=0/-5` 兜底为 1 |
| 进度「X / Y 张」「第 X / Y 张」 | `:196`、`:254` | 逐张推进核对；复习页无 retry 终态，公式与位置一致 |
| 完成态「X 张一次到位，Y 张还需要再见几次」 | `:241` | 全对 →「10 / 0」；看答案 →「0 / 1」；两数之和 = total |
| 「这张卡很快会再来见你」 | `:382` | 看答案 → 1h/24h/7d 后 `listDue` 均为 1（核查期间已被另一进程从「永久排除」修好） |
| 掌握条三段划分互斥且合计 = total | `:204-206` | 4 种状态组合实测 `mastered+inProgress+notStarted === total` |
| 三档题量与档位卡声明一致 | `BOOST_TIER_META` | 全库 193 课 × 3 档实际题量恒为 {4}/{5}/{3} |
| 三档独立完成态、可只做一档退出、无正确率门禁 | `markBoostTierDone`、`doneTiers` | `grammarBoostsDone` 落盘 `[1]` → 档 1 显示「走过一遍」、档 2 可做；R4 已有覆盖 |
| 「练到第 X 档」/「三档都走过了」 | `boostProgressLabel` | `done.size` 0/1/2/3 四态各自正确 |
| 进行态进度不在 retry 时前进 | `GrammarBoostPage.tsx:917` | retry 非终态；代码注释记录了 2026-09-21 的修复 |
| 档 3 完成态 AI 批改（配置了 AI 时） | `:810-822` | `.boost-ai-card` 渲染「你这句 / 改顺一点 / 也可以这样说 / · 讲解」 |
| 「为什么」讲解（答对也给） | `:1204-1211`、`:1243-1246` | `explainZh` 在 pass 与 retry 两态都渲染 |
| 改错题「命中后给纠正说法」 | `spotCorrectionZh` | `· 这句应该是：…` 渲染于反馈区（但见 P1-1：主文案仍是错句） |
| 错句入 SM-2（档 3） | `queueFailedProduce` | 档 3 提交失败 ≥2 次或看答案 → 建卡 + `sentence_card_enqueued` 事件 |
| 重复卡不重复入队 | `queueFailedProduce` 去重 + `addSentence` | 已存在同句卡时 `return latest` |
| 计时/限时/排名/体力值全部不存在 | 两页 + `grammarReviewService` | `TIME_BUDGET` 常量已删除且全局零引用（`r2-session-caps.test.tsx` 锁定）；`durationMs`/`dwellMs` 只进旁路遥测 |
| 「正确/错误/做错/答错」在用户可见文案中不存在（除 P1-10 一处） | 两页文案 | 全量 grep + 渲染核对 |

---

## 5. 核查期间被并发改掉的项（不算现存缺陷）

核查进行中工作区被另一进程持续修改。以下问题在**本次核查的早期快照**里确认存在，但在 22:05 的文件快照下已消失。列出以说明「为什么报告里没有它们」，并留痕：

| 曾是缺陷 | 早期证据 | 当前状态 |
|---|---|---|
| 复习页看答案 → `intervalDays=0` 被 `listDueGrammarReviewCards` 当成「从未复习」永久排除，与「这张卡很快会再来见你」直接矛盾 | 早期：1h/24h/7d/30d 后 `listDue` 均为 **0** | 判据改为 `neverQueuedSchedule`（三字段，`grammarReviewService.ts:58-59`）→ 现在 `listDue` = 1 ✅ |
| 完成态「X / N 题一次就对」与埋点 `firstTryCount` 不一致（末题一次答对时页面少 0、埋点多 1） | 早期：页面「3 / 4」vs 事件 `firstTryCount: 2` | `finishTier(finalFirstTryCount)` 由 `advance` 传入 → 两者一致 ✅ |
| 档 1「点进来看一眼就走」被记成 abandoned（`itemsCountRef` 提前写入总量使守卫恒假） | 早期注释与代码 | 守卫改为 `answeredRef.current <= 0`（`GrammarBoostPage.tsx:197`）✅ |
| 课程数 192 / 零术语讲解越线 441 处 | 早期快照 | 课程数已增至 193、讲解越线数随数据变化（现 443+）——计数漂移属正常数据增长，非缺陷 |

---

## 6. 核查方法与覆盖边界

**做法**：先穷举两页的渲染分支（`select` / `running` / `done` / 空态 / 找不到课程 / 未完课），把每一条用户可见字符串（标题、说明、按钮、提示、反馈、空态、完成页、`aria-label`、`placeholder`、题型标签）抽出来，逐条问「这句话假设了什么行为」；再按该行为去代码里找出**唯一权威实现**，用 jsdom 挂载真实页面、走完整会话核对渲染结果与 `AppData`/遥测落盘。

**测试文件**：`src/edge/verify/pr1-promises.test.tsx`（36 条断言，全部通过）。
命名遵循任务的 `pr*-*` 约定；**未修改 `src/` 下任何产品代码**（另一进程的改动与本任务无关）。

```
npx vitest run src/edge/verify/pr1-promises.test.tsx
→ Test Files 1 passed (1) | Tests 36 passed (36)
```

**覆盖边界（未验证）**：AI 生成分支（`loadAiVariants` 需要 mock 合法 `GeneratedBoostItem`）；真机 TTS/音频链路；`GrammarPathPage` 的弱点卡入口（超出本任务范围）；`grammarBoostAiService` 的 6 条校验；导出/同步路径。§3 的 5 项可疑但未证实因此保留为可疑。
