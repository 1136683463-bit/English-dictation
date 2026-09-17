# PRD：第五批课程 · 动词的两件新搭档（不定式 + 动名词）

| 元信息 | 内容 |
|---|---|
| 标题 | 「小美的一天」第五批规格：doing 转正 2 课 + 目的 to 1 课 + enjoy 1 课 + 收口 1 课（L42–L46），S4 收尾 |
| 日期 | 2026-09-16 |
| 类型 | 功能规格书（内容生产规格，基于已定稿六段式模板） |
| 执笔 | 析客（需求分析师） |
| 前置依赖 | `GRAMMAR_PRODUCT_PLAN.md:158`（S4 定义）；三份研究（瑞思/竞析/数析 2026-09-16） |
| 交付物 | 5 课课程数据（L42–L46）+ 5 个新侦探案件（reviewed）+ P0 旧话术/文案泛化 + season-5/m7 展示层 |
| 配档 | 路线图：`roadmap-grammar-fifth-batch-2026-09-16.md`；研究：`user-research-grammar-infinitive-2026-09-16.md`、`competitive-analysis-grammar-infinitive-2026-09-16.md`、`data-audit-grammar-infinitive-2026-09-16.md` |

---

## 📌 TL;DR

- **核心目标**：S4「句子变长」最后一块收官——把 L5 种下的 `I like reading.` 转正，5 课（L42–L46）讲清「喜欢做 / 去做 / 享受做」。
- **关键决策**：① 课量 **5 课**（真新点 4 个：doing 作宾语 / doing 作主语 / 目的 to / 搭档分野）；② **V-ing 主语课进**（论证见 §2.3）；③ `like to do vs like doing` **不进主线**（两者都真对，做成对比卡违反「wrong 必须真错」红线），仅 L46 深挖卡认读「都行，默认 doing」；④ 错误全部由 **verb_form 承载**（零枚举扩展），但**先泛化文案**；⑤ P0 前置 = 旧话术泛化 **6 处** + verb_form 文案 1 行 + 附带 2 行。
- **排序依据**：三源一致「先 doing 后 to」；doing 侧唯一真荒漠（全库正确语料仅 2 处），to 侧地基极厚（语料 185 处）。
- **下一步**：排期归路径；开工前拍板 §9 开放问题 ①②③。

---

## 🎯 核心结论卡片

| 项目 | 内容 |
|------|------|
| 推荐方案 | 5 课（L42–L46）+ 5 案：L42 `I like reading.` → L43 `Swimming is fun.` → L44 `I go to the shop to buy milk.` → L45 `I enjoy reading.` → L46 收口 |
| 优先级 | P1（内容生产批次）；P0 前置 2 项为**开工阻断项** |
| 预期影响 | 补齐 S4 最后一块；「零术语 to/doing 入门」无人占位（竞析三源皆术语化） |
| 资源需求 | ≈2.5 人日内容（0.5/课含案）+ P0 泛化 0.25–0.5 + 展示层 ≤0.5 + 验收 0.5 ≈ **4 人日** |
| 风险等级 | 中（目的 to 全库 0 正确先例＝内容风险；旧话术改动留痕风险；verb_form 弱项榜集中度走高） |
| 硬性范围红线 | 课量 5 不再论证；若生产中发现超载，只砍深挖卡深度，不砍课、不加课 |

---

## §1 问题陈述与批次定位

### 1.1 解决什么问题

学习者已完成 L1–L41：能说短句、能讲从句，但**动词后面跟什么形式**从未系统教过——「我喜欢读书」「游泳很好玩」「去商店买牛奶」这类每天都在用的表达，全靠语感瞎拼。这正是 `GRAMMAR_PRODUCT_PLAN.md:158` 定义的 S4「不定式与动名词基础」，也是 S4 四块拼图的最后一块（并列连接词 L19/20 ✓、从句 L35–41 ✓、本批 = 收尾）。

### 1.2 前置已铺完，本批只是转正与延伸

| 旧资产 | 位置（实读） | 与本批关系 |
|---|---|---|
| `I like reading.` 种子 | `grammarLessons.ts:785`（L5 例句）、`:913`（L5 practice 答案） | L42 把它从「见过」转成「学会」；L5 六条对比卡（:792-828）零覆盖 -ing，衔接成本≈0 |
| 「小垫板 to」 | `:2600` block role、`:2603` oneLineRule、`:2644` 否定卡 | L44 同一块垫板「多垫一站」：到地方 + 去做什么 |
| 「小踏板 to」 | `:1524`（L9「去哪里中间垫 to」） | L44 复现源（`I go to the library.`） |
| be + -ing 体系 | `:2236`/`:2297`（L13）、`:2445`（L14 can swim）、`:5166`（L29 going to）、`:6081`（L34 过去进行） | 本批唯一正面区分的旧叙事：「有 be 搭着＝正在做；光 -ing＝当名字用」 |
| `I like music.` 结构 | L5 全课 | L42/L43 guided 复现原句直接可搬 |

### 1.3 与旧规划的关系

`prd-grammar-advanced-2026-09-12.md:120-123` 的 R12/R13 是「形容词/副词位置」等**选题池占位**，本批不属于其中任何一条——它是 S4 主板（`GRAMMAR_PRODUCT_PLAN.md:158`）的最后一项，由产品负责人本次立项直接指定，优先级与第四批平级。

---

## §2 拆课方案与逐课规格

### 2.1 课量决策：5 课（L42–L46）

| 方案 | 取舍 | 裁决 |
|---|---|---|
| 4 课 | 砍 V-ing 主语。但「游泳很好玩」是中文零门槛、零新词的天然入口；砍掉后 doing 只有「跟在动词后」一副面孔，收口课无第二形态可对撞 | ✗ |
| **5 课** | doing 本体 → doing 作主语 → 目的 to → enjoy → 收口 = L42–L46。真新点 4 个 + 收口 1 课零新知，一课一增量红线成立；前批 7 课后节奏回落到 5，单人生产 ≈2.5 人日 | **✓ 拍板** |
| 6 课 | 拆「like to 对比课」——两者都真对，做成对比课直接违反「wrong 必须真错」红线（瑞思⑤、竞析④一致）；拆「to do/doing 总对比课」——压 B1 不讲 | ✗ |

**排序依据**：doing 是唯一真增量（`to+动词` 库内 185 处，动名词正确语料仅 2 处）→ 先 doing 后 to；目的 to 紧随 doing 之后（Murphy U51→U54 顺序）；enjoy 放在目的 to 之后，让「to 垫板」先立稳，再用「enjoy 不要 to」制造分野；收口零新知（对齐 L41 形态）。

### 2.2 逐课规格

**L42 我喜欢读书（doing 本体 · 踩 L5 种子）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-42-like-reading`；episode「小美的一天 ㊷」；scene `sparkle`；cover `cover5`（L5 同主题，单用池复用→2 次） |
| title / grammarLabel | 「我喜欢读书」/「动词的第二份工作 · -ing」 |
| targetSentence | `I like reading.`（即 L5 种子句转正） |
| 场景 | 周末兴趣角，小美向新同桌介绍自己喜欢做的事（续 L5 房间听歌场景） |
| 新知识点（一课一增量） | **只有一件**：喜欢「做一件事」时，动词要换「名字版」（-ing）：I like **reading**。中文没有这个变形（\*I like read. 是母语者不会犯、中国人必犯的错） |
| 对比卡方向（真错真对） | ① `I like read.` ❌（wrongMark `read`）→ `I like reading.` ✅——「跟在 like 后面的是『做的事』，动词要挂上 -ing 的名字牌」；② `I am reading.` ✅ 并排 `I like reading.` ✅——**同一件 -ing，两个岗位**：有 be 搭着＝正在做；没 be 搭着、跟在 like 后面＝当名字用（本批核心认知条，双正解） |
| 变体方向 | 肯定 `I like reading.` / 否定 `I don't like reading.`（noteZh：don't 挡住的是 like，reading 不动）/ 疑问 `Do you like reading?` |
| 复现题设计 | guided arrange 复现 L5 原句 `I like music.`（:831）+ 对比句 `I am reading.`（复现 L13 进行时）；practice 第 1 题即 L5 practice 原题 `I like reading.`（:913，种子回收）；第 3 题变体逐字题 `Do you like reading?` |
| 案件规划 | 新案 `hunt-interest-day`「兴趣日的打卡卡」（§6） |
| 六段要点 | watch 按「做的事是什么→动词换名字牌」分步；deepDive「-ing 的第二份工作」（§4 话术）；arrange ≤7 token（`I like reading.` 3 token，复现题最长 5） |

**L43 游泳真好玩（V-ing 作主语 · 零新词）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-43-swimming-fun`；episode ㊸；scene `island`；cover `cover17` |
| title / grammarLabel | 「游泳真好玩」/「让事情当主角 · -ing 开头」 |
| targetSentence | `Swimming is fun.` |
| 场景 | 夏令营水上活动日，回来跟妈妈汇报 |
| 新知识点 | **只有一件**：这件事当句子的主角时，也穿名字版——句首不放 `Swim`（那是命令句，L32），放 `Swimming` |
| 对比卡方向 | ① `Swim is fun.` ❌（wrongMark `Swim`）→ `Swimming is fun.` ✅——「句首的 Swim 像在下命令（回想第 32 课）；说『游泳这件事』，要给动词上名字版」；② `I am swimming.` ✅ 并排 `Swimming is fun.` ✅——有 be＝正在游；当名字＝这件事本身 |
| 变体方向 | 肯定 `Swimming is fun.` / 否定 `Swimming is not fun.` / 疑问 `Is swimming fun?` |
| 复现题设计 | guided arrange 复现 L14 原句 `I can swim.`（:2447 语境）；practice 复现 L13 `I am drawing.` → 同词换岗题；第 3 题变体逐字题 `Is swimming fun?` |
| 案件规划 | 新案 `hunt-swim-day`「泳池边的光荣榜」（§6） |
| 六段要点 | 零新词建课（swimming 5 次 / drawing 48 次现于库）；词语干扰成对同源（`Swim/Swimming`）；arrange ≤4 token |

**L44 去商店买牛奶（目的 to · 延伸小垫板）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-44-shop-to-buy`；episode ㊹；scene `city`；cover `cover4` |
| title / grammarLabel | 「去商店买牛奶」/「小垫板新用法 · to + 去做什么」 |
| targetSentence | `I go to the shop to buy milk.`（8 token，贴上限） |
| 场景 | 放学路上，妈妈打电话让小美顺路买东西 |
| 新知识点 | **只有一件**：两个动作要垫板才缝得上——「去商店」+「买牛奶」中间垫一块 to：go to the shop **to buy** milk。中文连动句（去商店买牛奶）零标记，英语要垫 |
| 对比卡方向 | ① `I go to the shop buy milk.` ❌（wrongMark `buy`）→ `I go to the shop to buy milk.` ✅——「两个动作直接撞一起站不住，中间要垫 to」；② `I go to the shop.` ✅ 并排 `I go to the shop to buy milk.` ✅——**一句里两个 to 各干各的**：第一个带路（到商店），第二个是垫板（去做什么） |
| 变体方向 | 肯定 `I go to the shop to buy milk.` / 否定 `I don't go to the shop.`（sister sentence，控 ≤8 token：9 token 的 `I don't go to the shop to buy milk.` 违反 arrange 上限，全库禁用）/ 疑问 `Do you go to the shop?` |
| 复现题设计 | guided arrange 复现 L9 原句 `I go to the library.`（:1500）+ 展开 `I go to the library to read books.`（8 token）；practice 复现 L15 `I want to read.`；第 4 题变体逐字题；复现占比 ≥50% |
| 案件规划 | 新案 `hunt-shop-note`「冰箱上的便条」（§6，含「缺 to」型新错 → 依赖 P0-c） |
| 六段要点 | 本课是全批 token 最长课：arrange 拆两段（地点段 + 目的段）；`to buy` 不拆散；deepDive「一块垫板，两个车站」 |
| 内容风险对冲 | 数析标注「目的 to 全库 0 正确先例」＝内容风险非代码风险：① 本课首日配案（案内 1 处 purpose-to 错）；② L46 practice 复现本课原句一遍 → 上线前库内 purpose-to 正确先例从 0 → ≥6 处 |

**L45 我享受画画（enjoy · 只接 doing 的动词）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-45-enjoy-drawing`；episode ㊺；scene `magic`；cover `cover12` |
| title / grammarLabel | 「我享受画画」/「enjoy 的门 · 只认 -ing」 |
| targetSentence | `I enjoy reading.` |
| 场景 | 美术兴趣班报名表上写自己的爱好 |
| 新知识点 | **只有一件**：有些动词的门只开一扇——enjoy 后面只认名字版：enjoy **reading**，不认 to（`I enjoy to read.` 真错）。不扩张词表，只给 enjoy 一个（BC A1–A2 同口径，「两扇门」二分替代词表） |
| 对比卡方向 | ① `I enjoy to read.` ❌（wrongMark `to`）→ `I enjoy reading.` ✅——「enjoy 门前不垫 to；它只认名字版」；② `She enjoy reading.` ❌ → `She enjoys reading.` ✅（三单旧点新环境，复现 L5 replace 模式） |
| 变体方向 | 肯定 `I enjoy reading.` / 否定 `I don't enjoy reading.` / 疑问 `Do you enjoy reading?` |
| 复现题设计 | guided arrange 复现 L5 `I like reading.`（同义升级对照）；replace 题 `I enjoy reading.`→换 reading 为 drawing；practice 复现 L25 三单 `She enjoys drawing.` + 变体逐字题 |
| 案件规划 | 新案 `hunt-club-poster`「社团招新海报」（§6） |
| 六段要点 | enjoy 作为**唯一新词**配中文注释（「享受 / 很喜欢」）；deepDive「enjoy 为什么不要 to？」；每课超纲词 ≤1，远在 3–5 红线内 |

**L46 一句话，两种搭档（收口课 · 零新知全复现）**

| 项 | 内容 |
|---|---|
| 课注 id | `lesson-46-two-partners`；episode ㊻；scene `mansion`；cover `cover24`（L24 对比课题感） |
| title / grammarLabel | 「一句话，两种搭档」/「收口 · 名字版 + 小垫板」 |
| targetSentence | `I enjoy reading and I want to travel.`（双结构合体句） |
| 场景 | 期末兴趣分享会，小美介绍自己的暑假打算 |
| 新知识点 | **零新增**——全批复用。唯一新材料：「都行，默认 doing」（like to do 也是对的）在深挖卡认读，不进必做题 |
| 对比卡方向 | ① `I enjoy to read.` ❌ 并排 `I want to read.` ✅——**同一块 read，两个动词不同搭法**：enjoy 只认名字版、want 门口有垫板（全批总结条）；② 宾从/定从旧线对撞：`I know where he is.` ✅ 并排 `I like reading.` ✅——「话中话」与「名字牌」两套工具同台 |
| 变体方向 | 肯定 `I enjoy reading and I want to travel.` / 否定 `I don't enjoy reading.` / 疑问 `Do you enjoy reading?` |
| 复现题设计 | practice 4 题 = L42 原句变体（`I like reading.` 型）+ L44 原句变体（`I go to the shop to buy milk.` 型）+ L45 变体逐字题 `Do you want to travel?` + 全批总句；recall 用全批总句 |
| 案件规划 | 收官案 `hunt-partner-show`「班会节目单」（§6，两搭档混排） |
| 六段要点 | deepDive 认读「都行，默认 doing」一句带过，不做题；summary 画「搭档地图」：like/enjoy + 名字版；want/go 到地方 + to 垫板 |

### 2.3 关键论证：V-ing 主语课为什么进（瑞思进 / 竞析不进 / 主理人裁决进——析客论证）

- **反驳竞析**：竞析理由「三源无专课」的原文是「仅例句预埋」——但 Murphy U51 的 -ing 形式课（含主语用法）就是专课级内容；且 BC/Duolingo 是按「技能点」切课，本来就不含「主语」这种语法位置视角。三源无专课 ≠ 该点对初学者无价值。
- **支持瑞思**：干扰③「\*Swim is fun.」是汉语话题句的直译错，中文母语者高发；且本课**零新词**（swimming/drawing/reading 全在库），只教「换岗」一个动作，认知负荷与 L42 同级。
- **成本侧**：砍掉它省 0.5 人日，但代价是 doing 只有「跟在动词后」一个面孔——L46 收口课将无第二形态可对撞，「名字牌」认知不完整；且 S4 描述「不定式与动名词基础」里的「基础」含此点。
- **风险控制**：验证时机后置（§9-④）——若上线后 L43 成为全批唯一超 10min 课，v2 可把该课降为 L46 后附课，不影响 L42/L44–46 结构。**裁决：进。**

---

## §3 中文负迁移处理专章

| 干扰 | 机制 | 讲解话术方向（零术语） | 归入 |
|---|---|---|---|
| ① like doing 漏 -ing（\*I like read.） | 汉语动词无屈折 | 「喜欢的是『做的事』——动词挂上名字牌才能当宾语」 | **对比卡 L42 第 1 条**（主线必修，本批第一条防线） |
| ② 目的 to 漏用（\*I go to the shop buy milk.） | 连动句无「为了」标记 | 「两个动作不能硬撞，中间垫 to 缝上——小垫板多垫一站」 | **对比卡 L44 第 1 条** |
| ③ V-ing 作主语（\*Swim is fun.） | 话题句无形态要求 | 「句首光身子的 Swim 像在下命令；当主角要穿名字版」 | **对比卡 L43 第 1 条**（踩 L32 命令句，跨课对撞） |
| ④ like to vs doing 区分 | 汉语「喜欢」通吃 | 「两件都对，默认用名字版」——一句话认读，**不设对比卡**（双真对不能做 wrong） | **深挖卡 L46**（认读 only） |
| ⑤ 搭档分野无体系感 | 无形态对立直觉 | 「enjoy 的门只开一扇——只认名字版；want 的门口有垫板」 | **对比卡 L45 第 1 条** + L46 收口条 |

> 与第四批口径一致：干扰 ①③⑤ 均为「真错型」（库内可判定错），④ 为「偏好型」——偏好型不进对比卡、不进必做题、不进案件。

---

## §4 叙事设计专章（本批最特殊设计点）

**红线约束**：全库 23 处「-ing 外套」表述中，6 处含「**只**在进行时里才穿」类排他断言（精确清单见 §5-P0a）。本批要教 `I like reading`，若给 -ing「发新外套」，会与进行时叙事正面撞车。**解法（采瑞思）**：不给 -ing 发新比喻，给它**第二份工作**。

### 4.1 -ing 侧话术草案（L42/L43 主线用语，生产时逐字采用）

> **「-ing 是动词的第二份工作。**
> 第一份工作：前面站着 be（am/is/are），它就在说『正在做』——I am reading。
> 第二份工作：没有 be 的时候，它当**名字牌**用——把一件事变成『那件事』本身：I like reading（我喜欢『读书』这件事）；Swimming is fun（『游泳』很好玩）。
> 怎么分？**看有没有 be 搭着**：有 be＝正在做；光 -ing＝当名字用。同一件工装，两班岗。」

- 铺垫复用：L13 deepDive 原话「be 就是老搭档 am/is/are」(：2309) 直接沿用，「有 be 搭着」与既有语汇零摩擦。
- 禁用词表（本批生产禁出现）：新外套、-ing 的衣服（除引用旧句）、进行时的打扮。
- 旧句引用策略：L42 对比卡第 2 条并排 `I am reading.` ✅ / `I like reading.` ✅——把「两班岗」做成可见的对撞，而非口头声明。

### 4.2 to 侧话术草案（L44/L45 延伸，不造新比喻）

> **「小垫板 to——到地方用一次，去做什么再垫一次。**
> 先垫一块带路：go **to** the shop（到商店）。
> 再垫一块说明去干嘛：to the shop **to buy** milk（去商店**买牛奶**）。
> 一块垫板，两个车站，脚步就缝上了。
> 但有的门口不垫板：**enjoy 的门只开一扇**——只认名字牌 enjoy reading，不认 enjoy to read。垫不垫，看门说话。」

- 「小垫板」系 L15 既有资产（:2600/:2603/:2644/:2666），L44 只做「同一块垫板多垫一站」的延伸；L9「小踏板」(：1524) 用作复现呼应。
- 「两扇门」比喻（竞析候选）降级为 enjoy 课内部用语，不升格为全库体系（避免词表化，BC A1–A2 同口径）。

---

## §5 P0 前置项（生产开工前完成，任何一项未完成不得写 L42 数据）

### P0-a 旧话术泛化（实读确认 6 处）

| # | 位置 | 现状（实读原文） | 改法 |
|---|---|---|---|
| 1 | `grammarLessons.ts:2082` | 「will 后面的动词穿原样，不穿 -ing 外套：will draw。外套只在进行时里才穿。」 | 「……will draw。**-ing 前面有 be 搭着才是『正在做』；这里没有 be，就不用它。**」 |
| 2 | `:2448` | 「can 后面的动词穿原样，不穿 -ing 外套：can swim。外套只在进行时里才穿。」 | 同上句式（can swim 版） |
| 3 | `:2638` | 「to 后面的动词穿原样，不穿 -ing 外套：want to go。外套只在进行时里才穿。」 | 同上句式（want to go 版） |
| 4 | `:5203` | 「going to 后面的动词穿原样，不穿 -ing 外套：going to watch。和 will 后面的动词一个规矩。」 | 「……going to watch。**-ing 要 be 搭着才是『正在做』**；和 will 后面的动词一个规矩。」 |
| 5 | `:5752` | 「祈使句的动词穿原样（Close），不穿 -ing 外套——-ing 是进行时的打扮。」 | 「祈使句的动词穿原样（Close）——**-ing 是『正在做』或『当名字』的打扮，祈使句两样都不用。**」 |
| 6 | `:6142` | 「-ing 外套自己站不住，前面必须有 be 搭着：was drawing。丢了 was，句子就塌了。」 | 「**-ing 想说『正在做』，前面必须有 be 搭着**：was drawing。丢了 was，句子就塌了。」 |

**保留不动**：:997/:2259/:2277/:2297/:2334/:2343/:2804/:4858/:4972/:6095/:6112 等 17 处（均为「be + -ing」正确语境，无排他断言）；:2297 标题「动词的 -ing 外套怎么穿？」不动（是进行时课自身用语）。改后统一断言形态 = **「有 be 搭着＝正在做；光 -ing＝当名字用」**。
**验收方法**：grep 全库 `外套只在进行时` 与 `进行时的打扮` = 0 命中；改后 6 处文本人工比对话术草案；4 个测试文件全绿（无测试断言这些话术）。

### P0-b verb_form 文案泛化

- `huntService.ts:40`：`verb_form: "被动要用『be + 过去分词』"` → **`"动词要穿对形式——原形 / -ing / 过去式，看位置定"`**（孤行改动；无测试断言该文案；10 枚举与 tagStats 长度 10 断言不动）。
- hint 侧 `huntService.ts:118-130` 的 `verb_form: "再想想这里需要动词的哪种形式。"` **不改**（已是泛化表述）。

### P0-c 附带项（2 行，随 P0-b 同批改）

- `huntService.ts:49`：`NON_CONTENT_WORDS` 加 `"to"`。理由：L44 案「缺 to」错 correction = `to buy`，不加则 `pickCorrectionWord` 会把 "to" 收进错词本（:53-60 逻辑），产生垃圾词。
- 回归：`huntService.test.ts:130-136` 现有 7 条 pickCorrectionWord 断言不受影响；`grammarAmbushService.ts` 的 `pickClozeWord` **不改**（GRAMMAR_WORDS 已含 reading/drawing，L42–46 提问空位会自然落在语法词上）。

**P0 完成定义**：三项改完 + 6 处 grep 验证 + 4 测试文件 89 项全绿 + 人工终读。预计 0.25–0.5 人日。

---

## §6 案件规划（5 案）

**总规则**（沿用第二批口径）：每案 4 处错 = **新错 2（verb_form）+ 旧错 2（50% 混入，从已学池挑）**；单 token 可修；每案留 ≥1 净词；话术零术语；tag 全部落 10 枚举内（零扩展）；上线前 `reviewed: true`。

| 案件 id | 配课 | 场景 | 定稿错误构成（原 → 修正（tag，新错/旧错）） |
|---|---|---|---|
| `hunt-interest-day` | L42 | 兴趣日打卡卡 | `read → reading`（verb_form，新错）；`reading → is reading`（missing_be，旧错——复现 L13）；`dog → dogs`（plural，旧错，复现 L5）；`Does → Do`（sv_agreement，旧错，复现 L5） |
| `hunt-swim-day` | L43 | 泳池光荣榜 | `Swim → Swimming`（verb_form，新错）；`fun → is fun`（missing_be，新错）；`swim → swims`（sv_agreement，旧错，复现 L25）；`in → at`（preposition，旧错） |
| `hunt-shop-note` | L44 | 冰箱上的便条 | `buy → to buy`（verb_form，新错）；`go → going`（verb_form，新错）；`milk → milks`（plural，旧错，复现 L30 不可数）；`on → to`（preposition，旧错，复现 L9） |
| `hunt-club-poster` | L45 | 社团招新海报 | `to read → reading`（verb_form，新错）；`draw → drawing`（verb_form，新错）；`picture → pictures`（plural，旧错）；`are → is`（sv_agreement，旧错，复现 L43） |
| `hunt-partner-show` | L46 | 班会节目单 | `watch → to watch`（verb_form，新错，want 侧）；`read → reading`（verb_form，新错，like 侧）；`classmate → classmates`（plural，旧错）；`in → on`（preposition，旧错，复现 L6） |

**定位说明**：
- 五案新错全部由 `verb_form` 单罪名承载（本批唯一新罪名），每案 2 处，占各案 50%；旧错 2 处，优先挑近 3 批高频掉分罪名（sv_agreement / plural / preposition / missing_be）。
- `hunt-shop-note` 的 `buy → to buy` 依赖 P0-c（`to` 入 NON_CONTENT_WORDS）。
- `hunt-interest-day` N2 定为 `reading → is reading`（missing_be，与 L13 进行时复现对撞，强化「有 be＝正在做」认知）。
- 话术样例（零术语）：L44 N1「两个动作撞在一起了——中间垫上 to 才缝得住。」L45 N1「enjoy 的门只开一扇，它不认得 to，只认名字版 reading。」
- 词表：五案全部落核心 500 词内；`hunt-club-poster` 的 enjoy 配注释（notes: `{ word: "enjoy", zh: "享受 / 很喜欢" }`）。
- 上线前每案按 `huntCases.ts` 头部 R15 口径逐案人工校验，标记 `reviewed: true`。

---

## §7 验收标准

### 7.1 Given/When/Then（QA 抽测剧本）

- **G-1 Given** 全库含 6 处旧话术已泛化 **When** 打开 L12/L14/L15/L29/L32/L34 任意对比卡 **Then** 文案均为「有 be 搭着＝正在做；光 -ing＝当名字用」形态，无「只在进行时」排他表述
- **G-2 Given** 学习者完成 L42 **When** 看到对比卡并排 `I am reading.` ✅ / `I like reading.` ✅ **Then** 能说出「有 be 搭着是正在做，没有 be 是当名字」，解释不含「动名词」「宾语」术语
- **G-3 Given** 学习者刚在 L44 variants 看过否定卡 **When** practice 出现该变体题 **Then** tokens 词集与 answer 逐字一致、distractors 无重复词
- **G-4 Given** 学习者在 `hunt-shop-note` 遇到 `I go to the shop buy milk.` **When** 只修 `buy → to buy` **Then** 修正后句子全对（无残留第二处错）
- **G-5 Given** 学习者在 L45 遇到 `I enjoy to read.` **When** 点 `to` **Then** 提示话术为「enjoy 的门只开一扇」
- **G-6 Given** 学习者完成 L46 **When** 打开路径页 **Then** L42–46 落入 season-5 分组（`GrammarPathPage.tsx` LESSON_GROUPS 新增 `{ id: "season-5", label: "第五季 · 动词的两件新搭档", hint: "喜欢做、去做、享受做：like/enjoy + reading；go … to buy", min: 42, max: 46 }`）；m7 `afterLesson: 46`（samples 含三课核心句）；**验收**：路径页 46 课全可见、无静默过滤；m7 在 L46 完成后触发
- **G-7 Given** 学习者完成 L44 首日 **When** 打开侦探页 **Then** `hunt-shop-note` 已解锁（无「完课无案可破」断点）

### 7.2 检查清单

- [ ] **G1 变体题**：每课 practice ≥4 题，含 ≥1 题 answer 与 variants 否定/疑问卡逐字一致
- [ ] **G2 tokens/answer**：词集一致、distractors 不重复（`grammarLessons.test.ts:10-66` 机器校验）
- [ ] **G3 recall 三字段**：promptZh/intentZh/answer 非空
- [ ] **G4 防退化**：arrange/practice >2 词题展示序≠答案序（`lessonService.test.ts:236-260`）
- [ ] **G5 罪名枚举**：5 案 tag 全部 ∈ 10 枚举；新增 verb_form 承载占各案 50%
- [ ] **G6 案件结构**：tokenIndex 对齐、errors=4、correction 单 token 可修、≥1 净词、reviewed=true
- [ ] **G7 tagStats=10 不动**；PLAIN.verb_form 新文案已上（§5-P0b）
- [ ] **G8 封面**：L42–46 只用单用池 5 张，复用后单张 ≤2 次
- [ ] **G9 season-5 分组**（min 42 / max 46）随批上线——**硬需求**：不落分组会被静默过滤
- [ ] **G10 can-do m7**（afterLesson 46）随批上线——**硬需求**：m6=41 后无锚点
- [ ] **G11 关 2 问卷题源**：每课 variants 齐三态
- [ ] **G12 关 3 链路**：每课 huntCaseIds ≥1；五课连续有案
- [ ] **G13 词汇**：每课超纲词 ≤3–5 且配注释；enjoy 单独注释
- [ ] **G14 时长**：L42–46 单课 6–8min（打样实测 L42/L44，超时先砍 deepDive 折深度）
- [ ] **G15 旧线不回归**：L1–41 数据与结构零改动（除 §5-P0a 话术 6 处）；4 测试文件 89 项全绿 + `npm run build` 通过

---

## §8 Non-goals

- **不做** `like to do vs like doing` 主线对比（双真对，违反 wrong 真错红线）——仅 L46 deepDive 认读「都行，默认 doing」
- **不做** 变义对（stop to / stop doing 等，压 B1–B2）
- **不做** wh- + to（what to do / where to go，库内 0 例）
- **不做** `enjoy` 以外的「只接 doing」词表扩张（finish/mind/keep 等不进）
- **不做** 介词 + doing（good at reading 型）
- **不做** V-ing 主语的长主语 / It's fun to do 变体（仅最简 `Swimming is fun.`）
- **不做** 目的 to 的否定/疑问扩展句式（9 token 超 arrange 上限，全库禁用）
- **不新增** GrammarErrorTag 枚举、**不改** tagStats 长度
- **不新增** schema 必填字段（零迁移）；**不新增** can-do 之外的路径页结构
- **不改动** L1–L41 既有数据（§5-P0a 六处话术除外）；**不给** -ing 造新比喻（§4 禁用词表）
- **不做** 24 张封面池外的新资产

---

## §9 开放问题（真正开放的）

1. **P0-a 话术终稿口吻**：6 处改法已给草案（§5），「-ing 前面有 be 才是正在做」的句子长短直接影响 6 张旧对比卡的信息密度——建议默认采 PRD 草案，或在生产首日由产品负责人终读一遍 6 处改文。拍板时机：P0 开工前。
2. **`hunt-interest-day` N2 定稿**：missing_be 或 sv_agreement 二选一。默认：missing_be。拍板时机：L42 案件生产日。
3. **旧罪名混入比例**：现 50%（2/4），可保守到 25%——但会推高 verb_form 集中度（已占 19.5%）。默认保持 50%，与第四批口径一致。拍板时机：可与问题 2 合并。
4. **L43（V-ing 主语）留任条件**：上线后若 practiceFirstTry 显著低于全批均值或实测 >10min，v2 降级为 L46 后附课。拍板时机：M4 上线观察后。
5. **关 2 cloze 是否需要 `want` 入 GRAMMAR_WORDS**：实读确认当前不需要；若 L44/L46 上线后发现空位落在 `to`/`shop` 上，再补 1 行正则。拍板时机：M4 后按实测。

---

## §10 里程碑（粗略，正式排期归路径）

| 阶段 | 产出 | 说明 |
|---|---|---|
| M0 前置冻结 | 本 PRD 评审 + P0-a/b/c 完成 + §9-①②③ 拍板 | **P0 是开工阻断项**；完成定义见 §5 |
| M1 打样 | L42 全量（含 `hunt-interest-day`）+ 零基础走查一次 | D1 口径：有效认知时长 ≥6min、对比卡「两班岗」能复述 |
| M2 生产 | L43–L46 + 4 案（≈2 人日） | 沿用数组尾插管线 |
| M3 验收 | §7 全量 checklist + 抽测 + season-5/m7 上线的路径页走查 | G9/G10 为硬需求 |
| M4 上线观察 | 弱项榜 verb_form 占比、L42–46 一次通过率、时长实测（§9-④⑤决策数据） | 挂在既有埋点，零新工程 |

> 排期、决策门日程与风险登记册归路线图规划师（配档 `roadmap-grammar-fifth-batch-*.md`），本 PRD 不锁日期。

---

## ✅ 行动清单

| # | 行动 | 负责方 | 时间窗 |
|---|------|--------|--------|
| 1 | P0-a 六处话术泛化 + P0-b PLAIN 1 行 + P0-c 2 行 | 开发 | 开工首日（阻断项） |
| 2 | §9-①②③ 拍板 | 产品负责人 | M0 |
| 3 | L42 数据 + `hunt-interest-day` + 走查 | 内容 | W1 |
| 4 | L43–L46 数据 + 4 案 | 内容 | W2–W3 |
| 5 | season-5 + m7（~7 行） | 开发 | 随批上线 |
| 6 | §7 全量验收 + 4 测试文件全绿 + 路径页走查 | 内容/开发 | W4 |
| 7 | M4 观察（§9-④⑤ 数据裁决） | 产品负责人 | 上线后 2 周 |

---

## ⚠️ 待确认 / 假设 / 依赖

- **开放问题**：§9 五项（1–3 有默认方案，到点未拍板自动落默认）。
- **假设**：六段字段与关 2/关 3 取源均已就绪（L41 已验证）；单人节奏 ≤3 人日/周。
- **依赖**：**P0-a/b/c 必须在 L42 数据与任何新案生产前完成**——旧断言「只在进行时才穿」与本批 `I like reading` 正面冲突；PLAIN 文案不泛化则 L44「缺 to」案解释口径不符。
- **风险**：① 目的 to 全库 0 正确先例（对冲：每课配案 + L46 复现设计）；② 六处话术改动波及 6 张旧对比卡，可能轻微增加旧课信息密度（对策：改文控 1 句内）；③ verb_form 弱项榜集中度（对策：旧罪名混 50%）。
- **Non-goals**：见 §8。

---

## 📚 数据来源 & 成员产出索引

- 析客（需求分析师）：本 PRD 全部；实读核实 `grammarLessons.ts`（:785/:913/:997/:2082/:2297/:2448/:2600/:2638/:5203/:5752/:6142 等）、`huntService.ts`（:31-60/:118-130）、`GrammarPathPage.tsx`（:97-152/:246-252/:483-495）、`grammarAmbushService.ts`（:150-205）、4 测试文件
- 瑞思（用户研究）：`user-research-grammar-infinitive-2026-09-16.md`（F1–F4、中文负迁移 5 类、7 条体验建议）
- 竞析（竞品研究）：`competitive-analysis-grammar-infinitive-2026-09-16.md`（Murphy U51-55 / BC A1-A2 编排、零术语占位、战略分歧）
- 数析（数据盘点）：`data-audit-grammar-infinitive-2026-09-16.md`（护栏清单、verb_form 承载与 PLAIN 泛化、`to` 入 NON_CONTENT_WORDS、展示层硬需求、封面池）
- 路径（路线图规划师）：`roadmap-grammar-fifth-batch-2026-09-16.md`（排期、决策门、风险登记册）

---

> 本报告由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。
