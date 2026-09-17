# PRD：第六批课程 · S5 语用首兑（should + if 条件句）

| 元信息 | 内容 |
|---|---|
| 标题 | 「小美的一天」第六批规格：should 1 课 + if 条件句 1 课 + 收口 1 课（L47–L49），S5 首兑 |
| 日期 | 2026-09-17 |
| 类型 | 功能规格书（内容生产规格） |
| 执笔 | 析客（需求分析师） |
| 前置依赖 | `GRAMMAR_PRODUCT_PLAN.md:159`（S5 定义）；三份研究（瑞思/竞析/数析 2026-09-17）；第五批 PRD 风格基准 |
| 交付物 | 3 课课程数据（L47–L49）+ 3 个新侦探案件（reviewed）+ season-6/m8 展示层 |

---

## 📌 TL;DR

- **核心目标**：S5「特殊与语用」首兑（「按需」批的克制初兑）——should（应该）与 if 真实条件句两个日常高频点，3 课收口。
- **关键决策**：① 课量 **3 课（L47–L49）**；② **被动语态不进本批**（be 变形+分词+视角三新点叠加，违反一课一增量；三研究一致）；③ should 并入「不变词家族」零形态新增（分寸为增量）；④ if 只教「if+现在时，主句 will」单一型，不碰第二/零条件句、unless、when/if 对照；⑤ 分寸差（should vs must）不做对比卡（双真对先例），深挖卡认读。
- **两条硬需求**：season-6 分组 + m8 里程碑（L47+ 不落分组会被路径页静默过滤）；每案必须配课（orphans 断言=5 钉死，`huntService.test.ts:213`）。
- **排序依据**：三源一致 should 先于条件句（Murphy U32→U99、Duo 12→43）；should 种子衔接≈0（can/must 家族已建）。

## 🎯 核心结论卡片

| 项目 | 内容 |
|------|------|
| 推荐方案 | 3 课（L47–L49）：L47 should → L48 if 条件句 → L49 收口（should+if 混练） |
| 优先级 | P1（内容生产批次）；无 P0 阻断项（本批无旧话术冲突——「不变词家族」叙事兼容 should；对比卡无历史包袱） |
| 预期影响 | S5 首兑；补中文侧最大混淆面（「主将从现」口诀误区被零术语讲解接住） |
| 资源需求 | ≈1.5 人日内容（0.5/课含案）+ 展示层 ~7 行 + 打样 0.5 + 验收 0.5 ≈ **3 人日** |
| 风险等级 | 中（if 跨源后置最狠——「提前到 A2」需话术消解；should 分寸属语用偏好，无标准答案） |

## §1 问题陈述与批次定位

### 1.1 解决什么问题

学习者已完成 L1–L46。S5「特殊与语用」是其最后一块拼图（`GRAMMAR_PRODUCT_PLAN.md:159`：情态 should、被动入门、if 条件句入门、口语高频句型）。日常中「应该」（建议、自我提醒）与「如果…就…」（条件表达）是最高频的两个语用缺口；两者课程语料现为 0 覆盖（数析全字段扫描）。

### 1.2 前置已铺完

- should：L14 can（79 处）、L16 must/have to（48/15 处）已建「不变词家族」——「must 和 can 一样，从来不变形」；L16 已讲 must vs have to「口气不同」（`grammarLessons.ts:2850`）
- if：L12 will（120 处）已种 `It will rain.`（`grammarLessons.ts:2055`）；L20 because/so 已建因果连词规则；案件语料已有真实条件句 `If you find my key…`（`huntCases.ts:1201`）

### 1.3 「按需」批的克制原则

S5 风险条仍在（`GRAMMAR_PRODUCT_PLAN.md:165/:551`「默认折叠」）——本批为首次兑现，只取两个最高频点 + 收口，不贪多。

## §2 拆课方案与逐课规格

### 2.1 课量决策：3 课（L47–L49）

| 方案 | 取舍 | 裁决 |
|---|---|---|
| 2 课 | should + if 合并收口——两新点无混练空间，收口课职责消失 | ✗ |
| **3 课** | should → if → 收口，一课一增量红线成立；S5 首兑克制 | **✓ 拍板** |
| 5 课 | 加被动（被否：三新点叠加）+ if 拆两课（被否：真新点只一条） | ✗ |

### 2.2 逐课规格

**L47 你应该早点睡（should · 情态家族收口）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-47-should`；episode「小美的一天 ㊼」；scene `mansion`；cover `cover3` |
| title / grammarLabel | 「你应该早点睡」/「情态三兄弟 · should」 |
| targetSentence | `You should sleep early.` |
| 场景 | 期末复习夜，妈妈看小美熬夜，给建议（续 L16 交作业场景的家） |
| 新知识点 | **只有一件**：should 也进「不变词家族」——can/must/should 都是不变词，后面动词穿原样；唯一新的是分寸：can 能、must 必须、should 应该（建议、比 must 轻） |
| 对比卡方向（6 条） | ① `You should to sleep early.` ❌（wrongMark `to`，去掉 to）→ `You should sleep early.` ✅——should 是家族成员，不垫板——want 才垫；② `She should goes to bed.` ❌（wrongMark `goes`）→ `She should go to bed.` ✅——家族里动词穿原样；③ `You should sleep early.` ✅ 并排 `You must sleep early.` ✅（**双正解**——一句是建议、一句是必须，口气不同）；④ `I should to helping her.` ❌（wrongMark `to helping`）→ `I should help her.` ✅——should 后面既不垫 to、也不换 helping；⑤ `Should I to rest now?` ❌（wrongMark `to`，去掉 to）→ `Should I rest now?` ✅——问句 Should 搬句首，动词照原样；⑥ `You don't should sleep late.` ❌（wrongMark `don't should`）→ `You shouldn't sleep late.` ✅——not 跟着 should 走，缩成一个词 |
| 变体方向 | 肯定 `You should sleep early.` / 否定 `You shouldn't sleep late.`（noteZh：not 跟着 should；换成 shouldn't 一个词）/ 疑问 `Should I rest now?`（noteZh：Should 搬句首，动词照原样） |
| 复现题设计 | guided 复现 L16 原句 `I must finish my homework today.`（must 对照）；practice 复现 L14 `I can swim.`（家族第三员收口）+ 变体逐字题 `Should I rest now?` |
| 案件规划 | 新案 `hunt-advice-note`「同桌的便签」（§6） |
| 六段要点 | 不造新比喻（直接并入家族）；deepDive「三兄弟的分寸」：can 能 / must 必须 / should 应该（一句带过深浅）；arrange ≤6 token |

**L48 如果下雨就不去（if 真实条件句）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-48-if-rain`；episode「小美的一天 ㊽」；scene `city`；cover `cover8` |
| title / grammarLabel | 「如果下雨就不去」/「条件句 · if 里说现在」 |
| targetSentence | `If it rains, I will stay at home.` |
| 场景 | 周末早晨，小美看窗外天色，跟妈妈说打算 |
| 新知识点 | **只有一件**：说「如果…就…」——if 里说**现在**（It rains），主句说**将来**（I will stay）；中文「如果明天下雨」的「下雨」也是现在式直译——真新点收敛为一条：**if 里不用 will** |
| 对比卡方向（6 条） | ① `If it will rain, I will stay at home.` ❌（wrongMark `will rain`）→ `If it rains, I will stay at home.` ✅——if 里说现在，不用 will（负迁移核心条）；② `If it rains, I stay at home.` ❌（wrongMark `stay`）→ `If it rains, I will stay at home.` ✅——「就…」的将来用 will；③ `If it rains, I will stay at home.` ✅ 并排 `Because it rains, I stay at home.` ✅（**双正解**：if 管未发生、because 管已发生——L20 对撞）；④ `If it rain, I will stay.` ❌（wrongMark `rain`）→ `If it rains, I will stay.` ✅——it 是三单；⑤ `If rains, I will stay.` ❌（缺 `it`）→ `If it rains, I will stay.` ✅——if 里要有完整小句子；⑥ `If it rains, I will staying at home.` ❌（wrongMark `staying`）→ `If it rains, I will stay at home.` ✅——will 后面穿原样 |
| 变体方向 | 肯定 `If it rains, I will stay at home.` / 否定 `If it rains, I won't go out.`（noteZh：won't = will not）/ 疑问 `Will you go out if it rains?`（noteZh：条件句留在后面也行） |
| 复现题设计 | guided 复现 L12 原句 `It will rain.`（把天气句装进 if）；practice 复现 L20 `Because I was busy, I didn't go.` 型（连词家族对照）+ 变体逐字题 |
| 案件规划 | 新案 `hunt-weather-plan`「周末计划单」（§6，if+will 新错） |
| 六段要点 | deepDive「if 里说现在」：「如果的路面，用现在时铺」；词汇零新增（rain/umbrella/weather 已入库）；arrange ≤8 token（本批最长课）；**避 cloze 坑**：核心句不用 `If the light goes out…` 型（空落在 the）——数析预警 |

**L49 建议与条件（收口课 · 零新知）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-49-advice-if`；episode「小美的一天 ㊾」；scene `campus`；cover `cover15` |
| title / grammarLabel | 「你应该试试」/「收口 · 建议 + 条件」 |
| targetSentence | `You should take an umbrella if it rains.`（双结构合体句） |
| 场景 | 出门前妈妈叮嘱，小美转告同学 |
| 新知识点 | **零新增**——全批复用。唯一新材料：should 与 if 同台顺序（Should 在前、if 条件挂后） |
| 对比卡方向（6 条） | ① `You should to take an umbrella if it rains.` ❌（wrongMark `to`，去掉 to）→ `You should take an umbrella if it rains.` ✅——should 不垫板；② `If it will rain, you should take an umbrella.` ❌（wrongMark `will rain`）→ `If it rains, you should take an umbrella.` ✅——if 里说现在（回踩）；③ `You should take an umbrella if it rains.` ✅ 并排 `You must take an umbrella if it rains.` ✅（**双正解**分寸对照）；④ `Should I to go now?` ❌（wrongMark `to`，去掉 to）→ `Should I go now?` ✅（疑问回踩）；⑤ `If it rain, you should stay.` ❌（wrongMark `rain`）→ `If it rains, you should stay.` ✅（三单回踩）；⑥ `You shouldn't to worry.` ❌（wrongMark `to`，去掉 to）→ `You shouldn't worry.` ✅——否定形也不垫板 |
| 变体方向 | 肯定 `You should take an umbrella if it rains.` / 否定 `You shouldn't go out if it rains.`（noteZh：not 跟 should）/ 疑问 `Should I take an umbrella if it rains?`（noteZh：Should 搬句首，if 尾巴照挂） |
| 复现题设计 | practice 4 题 = L47 型（should 原句变体）+ L48 型（if 原句变体）+ L12 复现（`It will rain.`）+ 全批总句；recall 用全批总句 |
| 案件规划 | 收官案 `hunt-weekend-tip`「班群消息」（§6，两结构混排） |
| 六段要点 | deepDive 画「建议+条件」组合框：主建议（You should…）+ 条件尾巴（if…）；summary 三兄弟+条件句地图 |

## §3 中文负迁移处理专章

| 干扰 | 典型错 | 话术方向 | 归入 |
|---|---|---|---|
| should 联想 to（与 want to 打架） | \*You should to rest. | 「should 是家族成员，不垫板——want 才垫」 | 对比卡 L47 第 1 条（主线） |
| 三单惯性 | \*I should rests. | 「家族里动词穿原样，rests 脱下来」 | 对比卡 L47 第 2 条 |
| should/must 混用（分寸） | 义务场景用 should、建议场景用 must | 「口气不同，两句都对」 | 深挖卡认读（双真对不做对错） |
| if 里「会」直译 | \*If it will rain… | 「if 里说现在——『如果的路面用现在时铺』」 | 对比卡 L48 第 1 条（负迁移核心） |
| 「主将从现」口诀误区 | 背得出用不对 | 「if 里不用 will」一句话判据，不给口诀 | 对比卡 + 深挖卡 |
| if 句式不完整 | \*If rains… | 「if 里要有完整小句子（it rains）」 | 对比卡 L48 第 5 条 |

## §4 叙事设计专章

### 4.1 should 侧：直接并入「不变词家族」（零新比喻）

- 复用既有家族叙事（L14/L16）：「can / must / should 三兄弟——形态都从来不变，后面动词穿原样；不一样的是口气：can 能、must 必须、should 应该」
- 增量只有一句：「should 是家族第三员，口气最轻——给建议用它」
- 禁用词表：不造新比喻；「钥匙」比喻（冒险模块 lighthouse）不进主线

### 4.2 if 侧：「路面」话术（新比喻）

- 「if 里说的是『路面』——用现在时铺（it rains）；主句说的是『往前走的车』——用 will（I will stay）。」
- 一句话判据：**「if 里说现在，主句说将来」**
- 禁用词表：「主将从现」四字（口诀是中文侧最大误区来源，禁止写入课程）；「条件从句」「主句」术语。
- 双正解对照：If it rains, I will stay.（未发生）✅ / Because it rains, I stay.（已发生/习惯）✅——与 L20 连词家族对撞

## §5 验收标准

### 5.1 检查清单

- [ ] G1 变体题：每课 practice ≥4 题，含 ≥1 题 answer 与 variants 否定/疑问卡逐字一致
- [ ] G2 tokens/answer 词集一致、distractors 不重复
- [ ] G3 recall 三字段非空
- [ ] G4 arrange/practice >2 词题展示序≠答案序
- [ ] G5 罪名枚举：3 案 tag 全部 ∈ 10 枚举（预期只用 verb_form/word_order/sv_agreement）；零扩展
- [ ] G6 案件结构：tokenIndex 对齐、errors=4、单 token（含删词型）、≥1 净词、reviewed=true
- [ ] G7 tagStats=10 不动
- [ ] **G8 展示层硬需求**：season-6（min 47, max 49）+ m8（afterLesson 49）随批上线
- [ ] **G9 orphans 纪律**：3 个新案必须全部被 L47–49 引用（huntCaseIds），否则 orphans 断言红（`huntService.test.ts:213`）
- [ ] G10 封面：L47–49 用单用池 3 张（cover3/8/15 等，实读确认）
- [ ] G11 圈号：㊼㊽㊾（L50 内可用；本批 3 课安全）
- [ ] G12 关 2 问卷：每课 variants 齐三态；**核心句避免 cloze 空在冠词/the 坑**（数析预警：If the light goes out 型）
- [ ] G13 时长：单课 6–8min（沿用批五口径）
- [ ] G14 旧线不回归：L1–46 零改动；4 测试文件 89 项全绿 + build 通过

### 5.2 Given/When/Then 抽测

- G-A1 Given 学习者完成 L47 When 看对比卡 `You should sleep early.` ✅ / `You must sleep early.` ✅ Then 能说出「一个建议一个必须，两句都对」
- G-A2 Given 学习者在 `hunt-weather-plan` 遇到 `If it will rain…` When 修 `will` Then 修正后句子全对（去掉 will）
- G-A3 Given 学习者完成 L49 When 打开路径页 Then L47–49 落 season-6 分组；m8 在 49 完成后触发（硬需求）
- G-A4 Given 学习者完成 L47 首日 When 打开侦探页 Then `hunt-advice-note` 已解锁

## §6 案件规划（3 案）

**总规则**：每案 4 处错 = 新错 2（verb_form 为主）+ 旧错 2（50% 混入）；单 token 可修（含删词型）；每案留 ≥1 净词；话术零术语；tag 全部落 10 枚举内；上线前 reviewed: true；**每案必须配课（huntCaseIds）**。

| 案件 id | 配课 | 场景 | 定稿错误构成（原 → 修正（tag，新错/旧错）） |
|---|---|---|---|
| `hunt-advice-note` | L47 | 同桌留在课桌上的便签 | ① `to` → 去掉 to（verb_form，新错——should to visit → should visit）<br>② `rests` → rest（verb_form，新错——should rests → should rest）<br>③ `advices` → advice（plural，旧错——不可数类先例 #9）<br>④ `feel` → feels（sv_agreement，旧错，复现 L25 三单） |
| `hunt-weather-plan` | L48 | 教室后墙的周末计划单 | ① `will` → 去掉 will（verb_form，新错——If it will rain → If it rains）<br>② `stays` → stay（verb_form，新错——will 后穿原样）<br>③ `umbrella` → umbrellas（plural，旧错——two umbrellas）<br>④ `in` → on（preposition，旧错——in Sunday morning → on Sunday morning，复现 L18 时间介词） |
| `hunt-weekend-tip` | L49 | 班群里发的一条温馨提示 | ① `to` → 去掉 to（verb_form，新错——should to bring → should bring）<br>② `will` → 去掉 will（verb_form，新错——If it will snow → If it snows）<br>③ `umbrella` → umbrellas（plural，旧错——two umbrella → two umbrellas）<br>④ `on` → in（preposition，旧错——on the morning → in the morning，复现 L18） |

> **案件表纪律**：每案 4 错全部单 token 可修、tokenIndex 与 tokens 对齐（生产时按案件文件逐 token 核对）；删词型先例：`must to → 去掉 to`（#33）；词尾型先例：`cans → can`（#22）、`musts → must`（#24）；不可数型先例：`advices → advice`（对齐 #9 `informations → information`）；删 will 型先例充分（if 条由本案新立，话术只引 L12）。

## §7 Non-goals

- **不做** 被动语态（be 变形+分词+视角三新点叠加；降级后置，留第七批或更后）
- **不做** 口语高频句型（S5 第四项定义太模糊，不立项）
- **不做** if 的虚拟语气/第二条件句/第三条件句
- **不做** unless / as soon as / when-offer 等条件连词扩展
- **不做** when 与 if 的辨析课（超载先砍项）
- **不做** should 的其他口径（ought to / had better / shall）
- **不做** should 与 must 的分寸对比卡（双真对，深挖卡认读 only）
- **不加** 新枚举、不改 tagStats、不改 schema、不动 L1–46
- **不造** should 新比喻；**不写**「主将从现」四字进课程

## §8 开放问题

1. **被动语态的去处**：降级到第七批还是更后？（默认：等 S5 消化完一批数据后再评估；拍板时机：M4 后）
2. **if 课后半句顺序**（If X, Y. / Y if X.）是否进 L48 必做题？（默认：认读 only，对比卡排除，不进 arrange——控制负荷；拍板：L48 生产日）
3. **should 课与冒险模块话术一致性**：灯塔脚本已有 should 例句与错例（`lighthouseGateScripts.ts:92-100`：`I should rest.` / 错例 `I should rests.`），需要核对话术不冲突（默认：生产首日核对；不阻断）

## §9 里程碑（粗略，正式排期归路径）

| 阶段 | 产出 | 说明 |
|---|---|---|
| M0 规格冻结 | 本 PRD 评审 + §8-①②③ 拍板 | 无 P0 阻断项 |
| M1 打样 | L47 全量（含 hunt-advice-note）+ 零基础走查 | D1 口径：对比卡分寸双正解能复述 |
| M2 生产 | L48–L49 + 2 案（≈1 人日） | 沿用数组尾插管线 |
| M3 验收 | §5 全量 checklist + season-6/m8 路径页走查 | G8/G9 硬需求 |
| M4 上线观察 | 首过率、关 2 一次通过率、新案误报率 | 挂既有埋点 |

## ✅ 行动清单

| # | 行动 | 负责方 | 时间窗 |
|---|------|--------|--------|
| 1 | L47 数据 + hunt-advice-note + 走查 | 内容 | W1 |
| 2 | L48–L49 数据 + 2 案 | 内容 | W2 |
| 3 | season-6 + m8（~7 行） | 开发 | 随批上线 |
| 4 | §5 验收 + 路径页走查 | 内容/开发 | W3 |
| 5 | M4 观察（含开放问题 1 数据） | 产品负责人 | 上线后 2 周 |

## ⚠️ 待确认 / 假设 / Non-goals

- 开放问题 §8 三项（有默认方案）
- 假设：本批无 P0 阻断项（无旧话术冲突——should 家族叙事兼容；if 新点无历史包袱）
- Non-goals：见 §7

## 📚 数据来源 & 成员产出索引

- 析客（本 PRD）；瑞思（`user-research-grammar-s5-2026-09-17.md`）；竞析（`competitive-analysis-grammar-s5-2026-09-17.md`）；数析（`data-audit-grammar-s5-2026-09-17.md`）；路径（排期待出）

---

> 本报告由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。
