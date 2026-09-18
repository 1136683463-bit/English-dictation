# 实现说明

更新时间：2026-06-17

## 当前状态

首版功能闭环已经实现为 React/Vite 应用，并预置 Tauri 2 工程目录。

已完成：

- 今日学习台
- 单词本 CRUD
- 句子本 CRUD
- 文本导入、拆句、候选词提取
- 间隔复习队列
- 单词拼写/句子回译/轻听写入口
- 文本 diff 批改
- 错误记录与复习计划更新
- 学习统计
- JSON、Anki CSV、Markdown 导出
- Web Speech API 发音/轻听写播放
- AI service 空接口预留

## 数据存储说明

计划目标是 Tauri + SQLite。本机当前缺少 Rust/Cargo，无法完成 Tauri 桌面构建和 SQLite 插件运行验证，因此当前可运行版本先使用 `localStorage` 做本地持久化。

服务层已经集中在 `src/services/`，后续切换 SQLite 时主要替换 `storage.ts` 和服务内部的数据读写实现，页面组件不需要大改。

后续 SQLite 迁移步骤：

1. 安装 Rust/Cargo。
2. 运行 `npm run tauri dev` 验证 Tauri shell。
3. 用 `@tauri-apps/plugin-sql` 创建 `sqlite:vocab.db`。
4. 添加 migrations，创建计划中的表。
5. 将 `loadData/saveData` 替换为 SQLite 查询与事务写入。
6. 保留 JSON 导出作为备份能力。

## 验证结果

已通过：

- `npm install`
- `npm run build`
- `npm run dev -- --host 127.0.0.1`
- 浏览器打开 `http://127.0.0.1:1420/`
- 新增单词 `approach`
- 进入复习页看到到期卡片
- 提交一次复习反馈
- 进入统计页看到复习统计

未完成：

- Tauri 桌面运行验证，原因：当前环境没有 `rustc` 和 `cargo`。
- SQLite 插件运行验证，原因同上。

## 浏览器模式下的本机 AI 中转站

浏览器打开 `http://127.0.0.1:1420/` 时，页面源与中转站（如 `http://127.0.0.1:7865`）不同源。这类网关通常不返回任何 CORS 头，`OPTIONS` 预检直接 405，浏览器会在请求发出前就以 `Load failed` 拦掉，表现为设置页「连接失败：无法连接 AI 中转站」。桌面版走 Tauri 的 Rust HTTP 客户端，不在浏览器里发请求，因此不受影响。

处理方式（两条链路，前缀需保持一致）：

- `vite.config.ts` 的 `aiRelayBridge` 插件：把 `/__ai-relay__/<host:port>/<path>` 在开发服务器内转发到本机地址；仅允许回环目标，避免变成开放代理。
- `src/services/aiHttpClient.ts` 的 `toRelayBridgeUrl`：浏览器模式下把回环中转站 URL 改写成上述同源路径；远端地址与 https 回环地址保持原样，以免掩盖真实的 CORS 报错。

因此浏览器模式请用 `open-web.command`／`npm run dev` 打开页面，不要直接双击 `dist/index.html`（`file://` 下没有该桥接，且页面源非回环也不会改写）。

## 中转站的隐藏推理与 token 预算

wb2api 网关对 DeepSeek 模型默认开启思考（`internal/upstream/thinking.go` 的 `injectThinking`），而推理 token 与正文共用 `max_tokens`。实测续章请求预算 2600，其中 1860 被推理占用，JSON 在中间被截断（`finish_reason=length`），解析器只能从残缺文本里捞出末尾一个完整的选项对象，于是报成「模型续章内容不完整（title=false，英文=0字…）」——看到这个报错先怀疑截断，而不是模型没按格式写。

网关只认请求体里的 `thinking` 字段，`X-WB2A-Thinking` 头它从不读取，所以开关必须放进 body：

- `src/services/aiHttpClient.ts` 的 `buildAiThinkingParams()` 返回 `{ thinking: { type: "disabled" } }`；`postChatCompletion()` 统一发请求，只在 400 明确点名可选字段时去掉 `response_format` + `thinking` 重试一次（严格 OpenAI 兼容接口会对非标准字段报 400，宽松网关忽略未知字段并保留开关）。
- 四处请求体都已带上：adventure（续章/开场/批量/逐句翻译）、modelService（错词故事、单词解释）、diaryService（日记批改）。

另外，`finish_reason=length` 且没有拿到完整章节时，会直接报「模型输出被截断」并提示重试或换更快的模型，不再误报成章节内容不完整。



## 语法「趁热练」课后强化训练（2026-09-18 上线）

补「关 1 完课 → 关 2 次日 20h」之间唯一没有出口的空窗：完课后可立即自主练一档（PRD：`deliverables/product-strategy/prd-grammar-boost-2026-09-18.md`）。

实现落点：

- 服务：`src/services/grammarBoostService.ts`（三档题目派生 + 确定性判题 + 完成态 + 复练换池）、`src/services/grammarBoostAiService.ts`（档 3 批改与变式题，含 6 条校验与缓存）。
- 页面与路由：`src/pages/GrammarBoostPage.tsx`、`/grammar/boost/:lessonId?tier=&from=`。
- 入口：结算页唯一主 CTA「趁热再练 2 分钟」（`GrammarLessonPage`）、课程卡片三节点链下一行档位条（`GrammarPathPage.renderBoostBar`，渲染在卡片 `<Link>` 之外故无冒泡问题）、关 3 完成页文本链（`GrammarReauditPage`）。
- 数据：`AppData.grammarBoostsDone`（lessonId → 已完成档位数组，语义＝至少完成过一次）。
- 埋点：7 个 `grammar_boost_*` 事件 + 补齐 `grammar_reaudit_started`；`summarizeGrammarTelemetry().boost` 直接给出参与率/分层漏斗/放弃率/AI 使用与降级率/素材重复率。

两处必须记住的实现细节：

- **埋点守卫必须用 `useRef`**：`useState` 在 StrictMode 下会被 effect 双跑穿透（每个 effect 各见一份初始 state），曾实测同一档记出两条 `grammar_boost_started`。仓库内 `GrammarPathPage`/`GrammarRevisitPage` 同此约定。
- **abandoned 的 effect 依赖只留 `phase/tier`**，已答数走 ref 读取；若把 `answered` 放进依赖数组，每次答题都会重挂清理函数并记出一条假「放弃」。

W0 口径修复（随本批一并落地，详见 `data-audit-grammar-boost-2026-09-18.md` 洞察 1–3）：

- 北极星去重键：`lesson_step_result` 新增可选 `sentenceHash`（output/recall 段写入），
  `grammarOutputService` 优先按句哈希去重，老事件回退旧键（不追溯改写历史）。
- 掌握口径归一：新增 `isMasteredBySpacedRepetition` / `applyMasteredStatus`（`reviewService`），
  语法复习页不再自己写一遍 `status/masteredAt`。
- 弱点权重对齐注释与代码：抽出 `WEAK_SPOT_WEIGHTS`（复习失败 1.5 / 反复通过 0.5 / hunt wrongTag 1.0 / notError 0.5）。
- cloze 抽词表 24 → 60+ 词（`grammarAmbushService.pickClozeWord`），并加「实词优先、最后才回退第 2 词」的两级降级。

验证状态：`tsc --noEmit` 通过；全量 658 项测试通过（新增 40 项：boost 服务 22 + AI 服务 18）；
`npm run build` 通过。GUI 实测（浏览器模式）确认：卡片档位条、三档页面渲染、档位选择页、未配置 AI 时的降级文案、
以及埋点单次上报；**由于运行时环境不派发点击/键盘事件（导航链接点击同样无事件到达），
答题交互与完成态写入未能通过 GUI 走通，这部分仅有单元测试覆盖**。

## 「趁热练」两个上线后修复（2026-09-18 当天）

**① 点词成句拼对却不结算（用户实测发现）。**
档 2 第 5 题带干扰项时判题门槛错用了「词块库总数」：L13 那题 7 个词块、正确答案只要 5 个词，
用户摆满 5 词后 `next.length < tokens.length` 恒成立，判题永远不触发。
修复：判题门槛改为答案词数（新增 `boostArrangeAnswerLength`，与课内点词成句同口径）。
回归测试覆盖全库每一课的 arrange 题（题量门槛 ≠ 答案词数即红）。
同时补上「点已选词块可移除」——放错一个词块时能只改那一处，不必整题重来。

**② 感受不到 AI 批改在哪（用户实测反馈）。**
批改原先只挂在「看答案」按钮上：正常作答（含答对）永远看不到 AI，而 PRD §4.6 要求的是
「批改放在整档结束之后，不逐题调用」。等于入口被挂到了一个多数人不会走的分支上。
修复：
- 作答时把本档写出的句子记入 `productionsRef`（答对也记——AI 的价值不只是纠错），
  档 3 收尾（`finishTier`）一次性提交，新增 `requestBoostBatchCorrection`。
- 合批而非逐题：串行 3 次调用 × 3–8s 会吃掉一档 4 分钟预算的 1/4–1/2，合批后用户只等一次。
- 新增 `buildBoostBatchCorrectionMessages`（按输入顺序逐句返回 corrected/recast/comment/issues），
  旧的单条 `requestBoostCorrection` 与 `buildBoostCorrectionMessages` 已删除，避免两条并行路径漂移。
- 档位选择卡与完成态都改了文案：档 3 事先说明「AI 会把你写的几句一起看一遍：改顺的写法 + 错在哪一类」，
  结算页有 loading 提示，避免"做完了也不知道有没有 AI"。
- 缓存键带「用户实际写的句子」的哈希：同课同档不同作答不复用同一份批改。

验证：`tsc` 通过、663 项测试全绿、`npm run build` 通过；
批改链路用本地 OpenAI 兼容桩跑通真实往返（含 max_tokens/model/temperature 与两句 inputs 的请求体断言，
以及二次调用命中缓存）。

## 「趁热练」题型多样化 + 答对也讲「为什么」（2026-09-18 用户反馈后）

用户反馈两条：①流程太重复（档 1 里连着几道都是「这句有问题吗」）；②答对后只给答案，不讲为什么。

**① 题型多样化。** 根因是档 1 只用 contrast + cloze 派生，而**课程数据里本来就有三种没用上的题型**：
`guided` 里每课都有 1 道 `spot`（改错：点出用错的词）、1 道 `choose`（选择）、1 道 `replace`（换主语后动词怎么变），
77 课全部字段齐备。现在档 1 按题型轮转取题（改错 → 正误对比 → 选词填空 → 选择·变形，全库每课都是 4 类不重样），
复练时按 `round` 轮转起点（每课只有 1 道改错题，不轮转则每次都从同一题开头）。
档 2 也改为动态交错——每步挑「与上一题不同型、素材多的优先消耗」的题，
消除成块的 `rebuild → rebuild → rebuild`。新增两条回归测试：全库每课档 1 必出 4 类题型、档 2 不得出现相邻同类题。

**② 答对后的讲解。** 根因是我自己写错了：讲解算出来了、也存进了 state，**但只在答错分支渲染**。
现在每一类题型都有 `explainZh`（全库覆盖率 936/936，来源：`guided.explain` / `contrast.whyZh` / `recall.noteZh` / `oneLineRule`），
答对与答错都展示（答错时先给方向，仍不揭答案）。
新增判题函数 `judgeBoostSpot` / `judgeBoostChoice` 与对应 UI（改错点词块、选择/变形点选项即判）。

**顺手修掉一个讲错的 bug**：句子级讲解原先用关键词包含匹配（对比卡的 wrongMark 出现在句子里就算命中），
结果把「he 是单数，搭档是 is」配到了 "What are you doing?" 上——**讲错比不讲更糟**。
改为严格相等匹配（对比卡正确句 == 该句），配不上就退回本课一句话规则。新增回归测试锁定。

## 档 3 任务多样化（2026-09-18 用户确认档 1/2 后继续）

档 3 原本三题都是「中文→整句」同一形态（认知目标没问题，但任务重复）。现改为三种任务形态，素材仍全部来自课程数据：

| 题型 | 任务 | 素材 | 讲解来源 |
|---|---|---|---|
| `produce` | 看中文，自己写出整句 | targetSentence / recall | recall.noteZh / oneLineRule |
| `variant` | 给一个已知版本，写出另一个版本（否定/疑问） | variants（78 课齐备） | **variant.noteZh**（课内写好的「怎么变」） |
| `fix` | 给错句，自己写出正确句（产出形态的改错） | contrast.wrong → correct | contrast.whyZh |

固定顺序 `produce → variant → fix`，每类内部未练过的排前，缺位时按剩余素材补。
`variant` / `fix` 在题面上先渲染「已知的样例句」（`.boost-shaped-block`），任务边界才清楚；
判题与 `produce` 共用 90 分线（都得自己完整写出句子）。
AI 批改的请求体也带上 `taskKind`，prompt 明确说明 variant/fix 不该按字面比对 target——
否则「换个说法」和「改错」这两类会被 AI 误判成写错。

新增 3 条回归测试：全库每课档 3 必出三种形态、variant/fix 必须有样例句与讲解且样例句 ≠ 答案。
验证：`tsc` 通过、668 项测试全绿（新增 2 条）、`npm run build` 通过；
全库题型分布 produce/variant/fix 各 78，讲解缺失 0/936。

## 改错题库扩量（2026-09-18 继续深化）

原先每课的改错题只有 1 道（来自 `guided.spot`），复练到第二轮就会重复。
审计发现 `contrast` 里每组对比卡都标了 `wrongMark`（哪个词/词组有问题）——
**这本身就是改错题**，全库 325 道可用，此前完全没利用。

- 改错题来源扩为两类：`guided.spot`（每课 1 道，自带 correctionZh）+ `contrast.wrongMark` 派生（平均 3.7 道/课）。
  含去重后每课可用改错题 3–7 道（全库 403 道），复练 6 轮不重样。
- `locateMarkedTokens()`：把 wrongMark 定位到词块下标；支持**多词标注**
  （如 `wrongMark="you are"` 表示语序问题，命中连续片段），36 道语序类题因此可用。
- 多词标注的判题放宽为「点中任一组成词都算对」（`spotWrongIndexes`），
  否则用户点 "you" 会被判错——而语序题里 "you" 和 "are" 都是问题所在。
- **修掉一个题源撞号 bug**：对比卡派生的改错题原先复用 `target:<index>` 命名空间，
  与正误判断题的题源重复，导致去重时被静默丢弃。改用独立的 `contrastSpot` 命名空间。

档 1 仍固定 4 题（与界面"4 题，约 2 分钟"一致）；题库扩大的价值在于**复练每次都能换新题**，
而不是把单轮拉长。新增 3 条回归测试：每课改错题 ≥2 道、题源不得撞号、多词标注判题接受多个下标。
验证：671 项测试全绿、`tsc` 通过、`npm run build` 通过。

## 接线补齐 + 死代码清理（2026-09-18 收口）

自查发现三处「PRD 里写了、代码里没接上」的功能，本轮补齐：

**① 弱点驱动选题完全没生效（R-B15）。** 服务层有 `currentWeakSpotTag()`，但页面从未调用——
历史错题与弱点档案对出题零影响。现在：
- `BuildBoostOptions.weakSpotTag` 一路透传到三个档的选题；
- 旧课点混题优先抽「该罪名相关」的课（`weakSpotRelevance` + 零术语关键词表 `WEAK_SPOT_KEYWORDS`），
  实测：三单弱点 → `I have a pen.`（L3 have/has）、时态弱点 → `Yesterday I went to the park.`（L10 过去式）；
- **命中弱点的题替换最后一道**，而不是只在缺素材时补位——否则素材齐备的课永远轮不到弱点题，等于没接；
- 题面带一句提示（`targetsWeakSpot` + `.boost-weak-hint`），让用户看得见「这道题冲我短板来的」。

**② AI 批改强度硬编码 gentle。** 用户设置里的 `diaryCorrectionStyle` 对趁热练无效
（日记批改读它，趁热练写死温柔档——想严格看全部错误也做不到）。现改为跟随用户设置。

**③ 档 2 的点词成句只用第一道 practice。** 每课平均 2.9 道带干扰项的 practice 被 `.find()` 浪费。
改为全部入池后，档 2 复练深度从 2–3 轮提升到 3–7 轮（41 课达 4 轮、22 课达 5 轮）。
**副作用修复**：素材变多后「素材多的题型优先消耗」会把 recall 挤掉（实测退化成 `rebuild → arrange` 循环），
加了「三种题型先各出现一次」的覆盖轮，保证档 2 每轮都有回忆题。

另外：
- AI 变式题生成补上 `weakSpotPlain`（此前接口有参数、页面从不传）。
- 设置页新增「清除趁热练 AI 缓存」（缓存 30 天 TTL 但无自动清理，需要给用户出口）。
- 删除零使用导出：`BOOST_TIER_NAMES` / `fallbackExplanation`（还带着未使用的 data 参数）/ `boostAiStamp`。

新增 3 条回归测试（弱点路由命中且不同弱点抽不同题、档 2 三题型必现、点词成句用满 practice）。
验证：674 项测试全绿、`tsc` 通过、`npm run build` 通过。
