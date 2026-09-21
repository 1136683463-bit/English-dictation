# 用户研究 · 语法线「小美的一天」· `verb + to` 家族补员

**日期**：2026-09-21 ｜ **类型**：用户研究（语法线第三十七批候选）｜ **研究员**：瑞思
**上游**：`roadmap-grammar-thirty-sixth-batch-2026-09-21.md` §7 携带项 3（`verb + to` 补员「下批首选」，§8 开放问题 4「1 课还是 2 课」）＋ `user-research-basic-vocab-blindspot-2026-09-21.md`（缺口 3，`:551` 逐字「是同一条轴的同一个槽位」）
**本批候选**：`learn to`／`decide to`／`hope to`／`try to` 四员补员

---

## 📌 TL;DR（本报告的四条裁定）

| # | 问题 | **裁定** |
|---|---|---|
| **1** | 四员拆 2 课还是 1 课？ | **四员不是两条轴，是四个同轴词——按「一课一增量」本应 1 课；但四员本身撑不起一课（那是「换动词」）。** 真正能立课的不是这四员，是 **`learn` 背后的第三张脸（be + -ing + to）**——**建议 1 课，落点从「四员补员」改为「正在学做某事」`learn to`，其余三员缓排。** |
| **2** | 是否只是「给同一句话换动词」？ | **对 `hope to`／`decide to`／`try to` 三员——是的，判定成立，这三员不该立课。** 对 **`learn to`——不是**，它带一件库里从未出现过的外形（`be + -ing + to`，实测全库 38 处 `be + -ing + to` 组合中 `-ing` 位 **100% 是 `going`**）。 |
| **3** | `enjoy + -ing` 冲突怎么处理？ | **是重要负迁移点，但不能靠「多讲一句」解决**——已实测 `enjoy`／`good at`／`keep`／`finish`／`mind` 五个「不认 to」门卫课全部已上线，**第 6 个门卫词的边际价值趋零**。建议只在对比卡双正解位出现 **1 张**，不新增讲解段落。 |
| **4** | 下一可用课号 | **L190**（实测 189 课连续无缺号、无重号；`number: 190`、`lesson-190-…` 在全库均未占用）。**季并入 `season-28`（182–189 → 182–190，9 课）**，不新建小季（小季实测正好 3 个，上限 3）。 |

**总进度**：**189 课／198 案／28 季**；`grammarLessons.test.ts` **27 项全绿**（本轮实跑）。

---

## §0 本轮实读口径声明（必读）

### 0.1 冻结快照

| 文件 | 行数 | 内容 |
|---|---|---|
| `src/data/grammarLessons.ts` | **37,925** | **189 课** |
| `src/data/huntCases.ts` | **10,339** | **198 案** |
| `src/data/grammarSeasons.ts` | **74** | **28 季** |
| `src/components/AdventureScene.tsx` | **476** | 14 个合法场景 ID（**行 6–19**） |

### 0.2 工具坑：ugrep 词边界假阴性（本轮当场双向复现）

```bash
grep -oniE "(^|[^A-Za-z])learn([^A-Za-z]|$)" src/data/grammarLessons.ts
# → 无输出（0 命中，错误；node 实测 = 0，此处巧合一致，见下）
grep -onE "(^|[^A-Za-z])want to([^A-Za-z]|$)" src/data/grammarLessons.ts | wc -l
# → 109  ✅ 该模式正常
grep -c "want to" src/data/grammarLessons.ts
# → 104   ⚠️ 不带词边界的粗匹配反而更少——本机 grep 不可信
grep -oE "(^|[^A-Za-z])hope([^A-Za-z]|$)" src/data/huntCases.ts | wc -l
# → 0      ❌ 错误（node 实测 HC `hope` = 1）
grep -oE "(^|[^A-Za-z])swim([^A-Za-z]|$)" src/data/huntCases.ts | wc -l
# → 0      ❌ 错误（node 实测 HC `swim` = 11）
grep -oE "(^|[^A-Za-z])want([^A-Za-z]|$)" src/data/huntCases.ts | wc -l
# → 0      ❌ 错误（node 实测 HC `want` = 18）
```

**⇒ 本轮全部词频一律走 node 脚本、词边界口径。`grep` 只用于「不带边界、只看有没有这个字」的粗定位。**
**⚠️ 与批三十四/三十五的记录相比，本轮发现 ugrep 的失效范围更大**：不只是「返回 0」，`want to` 的粗匹配数（104）也**低于**词边界数（109）——**该工具在本库语料上完全不可用于计数**。

### 0.3 三种口径

| 口径 | 定义 | 本批用途 |
|---|---|---|
| **词边界口径** | `(^\|[^A-Za-z])词([^A-Za-z]\|$)`，`gi` | **词频唯一口径** |
| **连续子序列口径** | 标点／空白归一后做子串匹配 | **查重唯一口径** |
| **课程块口径** | 按 `^\s{4}id: "lesson-…",` 切块 | **逐课归因唯一口径** |

**脚本**（本轮落在 `/tmp/`，可复跑）：`glscan2.js` ＝课程块索引（`.lessons`／`.c()`／`.lessonsOf()`／`.cont()`／`.prac`）。

```bash
node -e 'const S=require("/tmp/glscan2.js");console.log("lessons:",S.lessons.length);'
# → lessons: 189
```

### 0.4 逐字引用纪律

引文一律给「文件 : 行号（课号）」三元组。课号↔行号对应关系由课程块口径保证（例：`:2774` ∈ `lesson-15-want-to`，该课块起于 `:2756`）。

### 0.5 红线基线实测（本轮独立复算，189 课全量）

| 断言 | 实测 | 状态 |
|---|---|---|
| 课号连续无缺号／无重号 | **189 课，L1–L189 连续，缺号 0、重号 0** | ✅ |
| 案号连续无缺号／无重号 | **198 案，1–198 连续，缺号 0、重号 0** | ✅ |
| `contrast` 恰好 6 条 | **近 5 课（L185–L189）全部 6 条、3 带标记 + 3 双正解** | ✅ |
| `variants` 恰好 3 条／`guided` 6 题／`practice` 5 题 | L185–L189 全部 3／6／5 | ✅ |
| `scene` 非法 ID | **0 处**（14 个合法值全在内） | ✅ |
| `practice` 答案同句 ≤6 课 | **最高 6**（`Yesterday I went to the park.`／`There is a book on the desk.`） | ✅ 零越线 |
| 季覆盖 189 课 | `season-1`…`season-28` 合计覆盖 **189** | ✅ |
| ≤3 课小季 | **3 个**（`season-6`／`season-12`／`season-19`），**上限 3** | ⚠️ **已顶格，本批不得新建小季** |
| `grammarLessons.test.ts` | **27 项全绿**（本轮实跑） | ✅ |

```bash
npx vitest run src/data/grammarLessons.test.ts
# → Tests  27 passed (27)
```

### 0.6 零术语口径

**红线词表 29 词**（`src/data/grammarZeroTerms.ts`，逐字）：主语／谓语／宾语／表语／定语／状语／单数／复数／三单／原形／时态／一般过去时／一般现在时／现在进行时／过去进行时／现在完成时／情态动词／比较级／最高级／从句／语序／可数／疑问句／否定句／被动语态／第三人称／形容词／副词／介词。

**本报告正文（§0–§3、§5）是研究方法记录**，在引用红线词表本身与既有文档逐字时不可避免地出现术语；**面向学习者的文案只在 §4，已逐条实测零术语**（见 §4.9 自检输出）。

---

## §1 第一裁定：四员拆 2 课？——**不拆；且四员本身不该立课**

### 1.1 先看「两轴假设」站不站得住

任务书给出的两轴假设是：

- **轴甲**：`learn to`（学着做）／`decide to`（决定做）——「开始学／下决心」
- **轴乙**：`hope to`（希望做）／`try to`（试着做）——「想做但没保证」

**逐条对照已教内容**（词边界口径，`grammarLessons.ts`）：

| 中文锚 | GL 实测 | 归因 |
|---|---|---|
| `决定` | **8** | L29（`:5461` 逐字「说话那一刻才决定的」）／L179（`:35490` 逐字「把决定权递出去」） |
| `希望` | **0** | 全库无此锚 |
| `盼` | **172** | **L133–L138 六课**（`season-21` 整季） |
| `试着` | **0** | 全库无此锚 |
| `尽量` | **0** | 全库无此锚 |
| `学会` | **11** | L72／L82／L86／L94／L112／L155／L184——**全部是「学会了」的总结性回顾句，无一是「正在学」** |

**⇒ 轴甲的「决定」已被 L29／L179 占掉一半语义位；轴乙的「希望」与已教 172 处的 `盼`（L133–L138 整季）正面撞车。**

### 1.2 「一条轴」判定的正面证据（比两轴假设更硬）

**证据 A：课程自己的「同一块垫板」叙事已经点了 4 次名。**

| 课 | 行号 | 逐字 |
|---|---|---|
| L15 | `:2774` | `oneLineRule: "「想做……」= want to + 原样：I want to travel。want 后面要垫一块小垫板 to。"` |
| L160 | `:30992` | `whyZh: "两句都对——第 15 课那个 to 和今天这个 to 是同一个垫板；只是前面站的词不一样（want／seem）。"` |
| L161 | `:31198` | `whyZh: "两句都对——第 15 课那个 to 和今天这个 to 是同一个垫板；只是前面站的词不一样（want／need）。"` |
| L161 | `:31224` | `"这个 to 你已经见过三次了：want to（第 15 课）、seem to（第 160 课）、need to（今天）。位置一样、规矩一样，只是前面站的那个词在换。"` |
| L173 | `:34004` | `oneLineRule: "…它和第 44 课那块小垫板 to 是一家人，说的时候正式一点、清楚一点。"` |
| L174 | —— | `blocks.role: "我能（用 be able to 说「能」）"` |

**⇒ `want to`／`seem to`／`need to`／`in order to`／`be able to`／`go … to` 六处，课程自己已经说死了：「位置一样、规矩一样，只是前面站的那个词在换」（`:31224` 逐字）。**

**证据 B：`learn to` 若只讲「learn 后面垫 to」，它落地的那句话和 L15 是同一句。**

```bash
node -e 'const S=require("/tmp/glscan2.js");
for(const s of ["I want to swim.","I want to learn to swim.","I am learning to swim."]) console.log(s, "GL="+S.cont(s));'
# → I want to swim. GL=0
# → I want to learn to swim. GL=0
# → I am learning to swim. GL=0
```

**「learn 后面垫 to」与「want 后面垫 to」在课上唯一能说出口的差别是：「前面那个词换成 learn 了」——这正是任务书 §3 警告的「给同一句话换动词」。**

### 1.3 裁定

> **裁定 A（拆课）：不拆成 2 课。**
> **四员是四个同轴词，不是两条轴**——「开始学／下决心」与「想做但没保证」这两组，**在英语这一侧用的是同一块 to、同一套外形、同一个规矩**（L160 `:30992`／L161 `:31198` 逐字已论证）。任务书给的两组中文语义差别（下决心 vs 没保证），**在英语句子里不产生任何外形差异**——`I decided to go.` 和 `I hope to go.` 的外形完全同构。**「一课一增量」要求的是「两条不同的规矩」，而这里只有一条规矩、四个词。**
>
> **裁定 B（立课）：四员本身撑不起一课；能立课的是 `learn` 带出的第三张脸。**
> `learn to` 之所以例外，**不是因为它比 `decide`／`hope`／`try` 更常用**，而是因为 **`learn` 是全库第一个能站在 `be + -ing` 后面的「做事动词」**：
>
> ```bash
> node -e 'const S=require("/tmp/glscan2.js");
> const re=/\b(am|is|are|was|were)\s+(\w+ing)\s+to\s+([a-z]+)/gi;
> const set=new Set(); let n=0;
> for(const m of S.GL.matchAll(re)){ set.add(m[2]); n++; }
> console.log("be + -ing + to 命中数 =", n);
> console.log("-ing 位出现过的词 =", [...set].join(", "));'
> # → be + -ing + to 命中数 = 38
> # → -ing 位出现过的词 = going
> ```
>
> **实测：全库 38 处 `be + -ing + to + 词` 的 `-ing` 位，100% 是 `going`**（即 L29 的 `be going to` 将来）。
> **⇒ `I am learning to swim.` 的外形（be + -ing + to）在库里从未以「正在做某事」的身份出现过——这是一件真增量，而不是换词。**

**⇒ 建议课量：1 课。**

### 1.4 为什么不是「2 课」（若强行拆的后果）

| 若拆 2 课 | 会发生什么 |
|---|---|
| 课 1 = `learn to`／`decide to` | `decide to` 是纯换词（无新外形），且「决定」已被 L29 `:5461`／L179 `:35490` 各占一半语义位——**一课两员里有一员是搭便车** |
| 课 2 = `hope to`／`try to` | `hope to` 与 **`盼` 172 处／L133–L138 整季** 是同一条中文轴的两种译法；`try to` 的「试着」全库锚 **0**——**两员都没有独立中文入口** |
| 季体量 | 两课都只能并入 `season-28`（182–190 或 182–191），季体量 9–10 课——**这不是问题**；问题是**两课里只有一课有真增量**，第 2 课必然退化成复习课，而 L182–L185 已经连续四节收口课了 |

**⇒ 拆 2 课会让第 2 课变成「L182–L185 之后的第五、第六节无新意课」——这是本批最大的产品风险。**

---

## §2 逐词的中文入口与负迁移

### 2.1 四员的中文入口实测（决定性的一张表）

**「中文入口」的定义**：这个英语词要对应到用户嘴边**已经有的、单独说得出口的中文说法**，且这个中文说法在库里**还没有被别的课占掉**。

| 词 | 想说的中文 | 中文锚 GL 实测 | 该锚已被谁占 | **入口可用性** |
|---|---|---|---|---|
| `learn to` | 我正在学游泳 | `正在学` **0**／`学着` **0**／`学游泳` **0** | **无人占用** | ✅ **入口干净（新入口）** |
| `decide to` | 我决定去 | `决定` **8** | L29 `:5461`「临时决定用 will」／L179 `:35490`「把决定权递出去」 | ⚠️ **半占**（「决定」已在两课出现，但都不是「decide to」这个用法） |
| `hope to` | 希望能见到你 | `希望` **0**，但 `盼` **172** | **L133–L138 整季 6 课**（`season-21` 就叫「盼着那一天」） | ❌ **被占满**（「盼」字是 L134–L137 的目标句锚） |
| `try to` | 试着帮忙 | `试着` **0**／`尽量` **0**／`帮个忙` **0** | **无人占用** | ⚠️ **入口空但中文说法不成词**（中文「试着帮忙」不是零基础日常句；用户的真实说法是「我去帮帮忙」= 无 try） |

```bash
node -e 'const S=require("/tmp/glscan2.js");
for(const z of ["决定","希望","试着","尽量","学会","在学","正在学","学游泳","盼"])
  console.log(z.padEnd(6), "GL="+S.c(z), "L"+S.lessonsOf(z).slice(0,8).join("/L"));'
# → 决定   8   L29/L179
# → 希望   0
# → 试着   0
# → 尽量   0
# → 学会   11  L72/L82/L86/L94/L112/L155/L184
# → 在学   6   L37/L100
# → 正在学 0
# → 学游泳 0
# → 盼     172 L133/L134/L135/L136/L137/L138
```

**⇒ 四员里唯一有「干净且成词的中文入口」的，是 `learn to`（「我正在学游泳」——`正在学`／`学游泳` 全库 0）。**
**⇒ `hope to` 的中文入口被 `season-21` 整季占满；`try to` 没有成词的中文入口；`decide to` 半占。**

### 2.2 中式错句（逐词）与它们背后的负迁移来源

| # | 词 | 典型中式错句 | 为什么会这么错（中文侧原因） | 我方已教内容的对应 |
|---|---|---|---|---|
| 1 | `learn to` | `*I am learning swim.` | 中文「我在学游泳」中间**没有任何小词** | L15 `:2792` 逐字「中文「想去」后面直接接动词，但英语 want 后面要垫一个小小的 to」——**同一句解释可复用** |
| 2 | `learn to` | `*I am learning to swimming.` | 中文「学」+「游泳」没有形态标记；用户刚在 L42／L45 学会「-ing 是名字版」，会**过度泛化** | L44 `:8219` 逐字「垫板 to 后面永远穿原样：to buy」；L13 `:2418` 逐字「说「正在做」，动词要穿 -ing 这件外套」——**两件外套撞车** |
| 3 | `learn to` | `*I am learn to swim.` | 中文「在」是独立的字，用户会把「正在」翻成一个词而**丢掉 be** | L13 `:2412` 逐字「中文说「她在画画」可以不用「是」，但英语的 be 动词不能丢——丢了，句子就塌了」 |
| 4 | `decide to` | `*I decide going.` | 中文「决定去」的「去」是动词，用户按 L42 「动词第二份工作是 -ing」类推 | L42 `:7815`（`-ing` 名字版）／**L45 `:8375`（enjoy 只认 -ing）**——见 §2.3 |
| 5 | `hope to` | `*I hope see you.` | 中文「希望见到你」中间无小词，与错 1 同源 | 与 L15 `:2792` 同源 |
| 6 | `hope to` | `*I hope you to see.` | 中文「我希望你……」，用户会想把人塞进 hope 后面 | **库里 0 处 `want you to`**（实测 `want you to` GL=1，且是 `:2819` 的错句 `Want you to play?`）——**这条属「未教内容的前置」，本批不碰** |
| 7 | `try to` | `*I try help you.` | 中文「我试着帮你」无小词 | 与 L15 `:2792` 同源 |
| 8 | `try to` | `*I am trying help.` | 同上，叠 be + -ing | 与错 3 同源 |

### 2.3 与已教「不认 to」门卫词的冲突——**核实结果：冲突面比预期大得多**

**任务书点名 `enjoy + -ing`（L45）。已核实 L45 原文**（`grammarLessons.ts :8359–8548`，课块起 `:8359`）：

| 行号 | 字段 | 逐字 |
|---|---|---|
| `:8362` | `grammarLabel` | `"enjoy 的门 · 只认 -ing"` |
| `:8375` | `oneLineRule` | `"enjoy 的门只开一扇：只认名字版 enjoy reading，不认 enjoy to read——enjoy 后面不垫 to。"` |
| `:8392` | `contrast[0].whyZh` | `"enjoy 的门只开一扇——它不认 to，只认名字版：enjoy reading。垫板在 enjoy 门口用不上。"` |
| `:8440` | `deepDive` | `"enjoy 的门只开一扇：它后面只认名字版（enjoy reading），不认 to（enjoy to read 进不去）。每个动词的门口规矩不一样，遇到就记这一句。"` |
| `:8442` | `deepDive` 末段 | `"这课只用记一个动词的门口：enjoy 只认名字版。别的动词以后一个一个遇。"` |

**⚠️ 关键发现：`enjoy` 不是孤例，它是一个已经开到第 5 站的「门卫」系列。**

| 站 | 课 | 行号 | grammarLabel 逐字 | oneLineRule 逐字（节选） |
|---|---|---|---|---|
| ① | L45 | `:8362`／`:8375` | `enjoy 的门 · 只认 -ing` | `enjoy 的门只开一扇：只认名字版 enjoy reading，不认 enjoy to read` |
| ② | L64 | `:12013` | `收尾动词 · finish + 名字版` | `它和第 45 课的 enjoy 一样，门只开一扇。` |
| ③ | L67 | `:12598` | `擅长 · good at + 名字版` | `at 是它的门牌，门里穿名字版。` |
| ④ | L77 | `:14539` | `习惯不停 · keep + 名字版` | `keep 是「一直」，不是「做完」（那是第 64 课的 finish）。` |
| ⑤ | L69（`mind`） | `:13013` 逐字 | —— | `"垫板对门卫不管用：mind 不认 to——去掉它，名字版上岗。"` |

**另有第 6 类（不同机制，但同样「不认原样」）**：L120／L136 的 `be used to`／`looking forward to`——`:26185` 逐字「最容易踩的坑：一看 to 就顺手接原样（see）。第 120 课你已经踩过一次，今天再把它记住——这个 to 认名字版，不认原样。」

```bash
node -e 'const S=require("/tmp/glscan2.js");
for(const w of ["门卫","小垫板","名字版","门只开一扇"]) console.log(w, S.c(w));'
# → 门卫 20 ｜ 小垫板 36 ｜ 名字版 246 ｜ 门只开一扇 11
```

**⇒ 负迁移判读（这是本批与任务书预期最大的偏差）：**

- 任务书担心的是「`enjoy` 与这四词的冲突是重要负迁移点，需要核实 L45」。**核实结论：冲突真实存在，但「再讲一遍」的边际价值已经趋零。**
- **`名字版`（-ing 名字版）全库 246 处、「门只开一扇」11 处、「门卫」20 处**——学习者到 L190 时，**「有的动词门口垫 to、有的门口跟名字版」这条元规则已经被讲过 5 站以上**（`enjoy`／`finish`／`good at`／`keep`／`mind`）。
- **第 6 个门卫词（`learn`）单独讲一节「门口规矩」，是重复 L45–L77 的教学动作，不是新知识。**
- **正确做法**：只在对比卡的**双正解位**放 **1 张**（`I enjoy swimming.` vs `I am learning to swim.`），让两个门口同台对照一眼——**不新增 deepDive 段落，不新增门卫词讲解。**

### 2.4 `hope to` 的额外风险——与 `season-21` 整季正面撞车

**已核实 `season-21` 逐字**（`grammarSeasons.ts :59–60`）：

| 行号 | 逐字 |
|---|---|
| `:59` | `// 第二十一批 · 盼着那一天（2026-09-20）：look forward to 整块立岗 + 换人换形 + 名字版 + 否疑 + 与批十八两站收口（B 档收官 5 课大章·单拱）` |
| `:60` | `{ id: "season-21", label: "第二十一季 · 盼着那一天", hint: "我盼着周末、她盼着夏天、盼着见到你——同一个 to，后面跟的那件事", min: 134, max: 138 },` |

**L136 `:26117` 逐字**：`oneLineRule: "盼着「做某事」：后面那件事要换名字版——I am looking forward to seeing you。跟第 120 课同一个规矩：这个 to 认名字版。"`

**⇒ 中文「希望做某事」在库里唯一的对应说法是「盼着做某事」（`looking forward to` + 名字版，L136）；而 `hope to` 的英文外形（`hope to` + **原样**）与它**正好相反**（一个认名字版、一个认原样）。**
**⇒ 这是本批最危险的一处：两课中文义几乎相同（盼／希望），外形却相反（`to seeing` vs `to see`）——对零基础用户是「同一个 to 两个相反答案」的强混淆源。**
**⇒ 建议：`hope to` 本批不做，缓排至有独立中文入口（如「希望能……」的客套语境）时再评估。**

### 2.5 `try to` 的入口问题

**实测**：

```bash
node -e 'const S=require("/tmp/glscan2.js");
for(const z of ["试着","尽量","帮个忙","帮忙"]) console.log(z, "GL="+S.c(z));'
# → 试着 0 ｜ 尽量 0 ｜ 帮个忙 0 ｜ 帮忙 78
```

**`帮忙` GL 78（L14／L15／L17／L21 等 11 课以上）**——但那些都是 `Can I help you?`／`Let me help you.`（L74 `:3314` 附近的 `Let me help you.`）等**无 try**的用法。
**中文里「试着帮忙」不是零基础用户的嘴边话**——真实说法是「我去帮帮忙」（对应 `I can help.`，L14 已教）。
**⇒ `try to` 的中文入口不成词。它的英文说法要立课，需要一个中文侧的自然场景（如「我试着修一下」），而这已经超出 A0/A1 零基础的第一人称日常。**

---

## §3 第二裁定：**「是否只是给同一句话换动词」**

### 3.1 判定方法

把「若本课只教 `X to + 原样`」这一假设下，用户**真正新学到的操作**逐条列出。若清单只剩「把 X 换成另一个词」，则判定成立。

### 3.2 逐员判定表

| 词 | 本课会让用户新学会的操作 | **是否只是换动词** |
|---|---|---|
| **`decide to`** | ① 把 `want` 换成 `decide`；② `decide` 的三单是 `decides`（L25 已教） | ❌ **判定成立（只是换动词）** —— 无任何新外形、新位置、新限制 |
| **`hope to`** | ① 把 `want` 换成 `hope`；② ……（无） | ❌ **判定成立（只是换动词）** —— 且中文入口被 `season-21` 占满（§2.4） |
| **`try to`** | ① 把 `want` 换成 `try`；② `try` 的三单是 `tries`（**y→ies，L25 `:4700` 逐字已教**：`"「辅音 + y」结尾的把 y 变 i 再加 -es：study → studies、carry → carries。"`） | ❌ **判定成立（只是换动词）** —— 三单变化也已在 L25 付过 |
| **`learn to`** | ① 把 `want` 换成 `learn`；② **新外形：`be + -ing + to`（`I am learning to swim.`）**——实测全库 38 处该外形 100% 是 `going`，**「正在做」身份首次出现**；③ **两件外套同台的先后规则**：`-ing` 只穿在前一个词上，`to` 后面照样原样（`learning to swim` 而不是 `learning to swimming`） | ✅ **判定不成立（不是换动词）** —— ③ 是**新的形状约束**，库里从未教过「一个句子里同时出现 -ing 和 to」的情形 |

### 3.3 关键佐证：`be + -ing + to` 是全库唯一的空白外形

```bash
node -e 'const S=require("/tmp/glscan2.js");
const re2=/\b([a-z]+ing)\s+to\s+([a-z]+)/gi; const u=new Set();
for(const m of S.GL.matchAll(re2)) u.add(m[1]+" to "+m[2]);
console.log([...u].join(" | "));'
# → listening to music | going to do | going to watch | going to visit | going to play
#   | going to rain | going to watching | going to the | something to drink
#   | something to eat | walking to school | going to Beijing | walking to running
```

**逐条归因**：

| 组合 | 归因 | 是否「-ing 作谓语 + to 接动作」 |
|---|---|---|
| `going to …`（9 条） | L29 `be going to` 将来（`:5383` `grammarLabel: "将来时 · be going to"`） | ❌（`going to` 是整块记号） |
| `listening to music` | 听音乐（`listen to` 固定搭配） | ❌ |
| `something to drink/eat` | 不定式修饰 something | ❌ |
| `walking to school`／`walking to running` | 走路去学校／`prefer walking to running`（L177） | ❌ |
| **「be + learning + to + 原样」** | —— | **✅ 库里不存在** |

**⇒ `I am learning to swim.` 是库里的第一句「两件外套同台」（`-ing` 外套 + `to` 垫板同句）。这就是本课的一课一增量。**

### 3.4 §3 裁定

> **裁定 C：`decide to`／`hope to`／`try to` 三员——「只是给同一句话换动词」判定成立，本批不做。**
> **裁定 D：`learn to`——判定不成立，可做，但增量必须落在「`be + -ing + to` 两件外套同台」，而不是「learn 后面垫 to」。**
> **⇒ 若本课最终写成「learn 后面也要垫 to」（与 L15 同构），则本课不成立——请明确否决该写法。**

### 3.5 「是否只是换动词」的反向检验（若不做，用户会卡在哪）

| 用户的真实困境 | 已有内容能不能绕开 |
|---|---|
| 「我正在学游泳」 | **绕不开**。L13 只能造 `I am swimming.`（我在游泳）；L14 只能造 `I can swim.`（我会游泳）；L43 只能造 `Swimming is fun.`（游泳好玩）。**「正在学」这一格全库空。** |
| 「我决定去」 | 能绕开：`I want to go.`（L15）意思 80% 到位 |
| 「我希望见到你」 | 能绕开：`I am looking forward to seeing you.`（L136）——**且这是库里更好的说法** |
| 「我试着帮忙」 | 能绕开：`I can help you.`（L14 已教） |

**⇒ 四员里只有 `learn to` 是「绕不开」的（`正在学` 这一格在库里没有任何替代说法）。这一条独立支撑 §1 的 1 课裁定。**

---

## §4 逐课规格（1 课）

### 4.1 总览

| 项 | 值 |
|---|---|
| **课注 id** | `lesson-190-learning-to-swim` |
| **number** | **190**（实测：189 课连续无缺号；`number: 190` 与 `lesson-190-` 在全库均未占用） |
| **episode** | `小美的一天 一百九十` |
| **title** | `我正在学游泳`（7 字，无星号，零术语 ✅） |
| **grammarLabel** | `正在学做 · be 后面穿 -ing，垫板 to 照样垫` |
| **targetSentence** | `I am learning to swim.`（**5 词 ≤8** ✅） |
| **scene** | `ocean`（合法 ID，`AdventureScene.tsx :12`；**全库仅 L159 用过 1 次**，`ADVENTURE_SCENE_LABELS :35` ＝「海底世界」） |
| **季** | **并入 `season-28`**（`min:182, max:189` → `max:190`，9 课）——**不新建小季**（小季实测正好 3 个＝上限） |
| **造词成本** | **1**（`learn`／`learning`：GL 0／HC 2 但仅作错句标志；其余零件全在库） |

**造词明细**（`learning` 与 `learn` 同根，按课程惯例计 1 个新词）：

```bash
node -e 'const S=require("/tmp/glscan2.js");
for(const w of ["swim","swimming","sing","draw","drawing","sister","beach","picture","movie","watch","grandma","visit"]) console.log(w.padEnd(9),"GL="+S.c(w));'
# → swim 72 ｜ swimming 72 ｜ sing 104 ｜ draw 52 ｜ drawing 167 ｜ sister 23
# → beach 3 ｜ picture 28 ｜ movie 49 ｜ watch 多课 ｜ grandma 109 ｜ visit 8
```

**⇒ 目标句 5 个词中 4 个已在库；唯一新词 `learn`（`learning`）由本课 blocks／examples 首次带入。**

### 4.2 场景设计

| 项 | 内容 |
|---|---|
| **scene ID** | **`ocean`** |
| **合法性** | ✅ `AdventureScene.tsx :12` 逐字 `"ocean",`；`:24` 逐字 `"island", "mansion", "forest", "snow", "magic", "mystery", "sparkle"` 列表内含 |
| **中文标签** | `:35` 逐字 `ocean: "海底世界",` |
| **为什么选它** | ① **全库仅 1 课占用**（L159，`:30732` `scene: "ocean"`，且那是「海边的傍晚」岸上场景，非水下）——**不撞**；② **`mansion` 61 课／`campus` 57 课／`city` 38 课已过载**，必须避开；③ `desert`（L186）／`forest`（L187）刚被前两批占用，**本批错开**；④ 标签「海底世界」与「套着浮板在水里学」契合 |

**场景叙事（`sceneSetupZh`）**：
> `暑假第一天的水上活动课，小美套着浮板趴在浅水区。教练在岸上比了个往前的动作——她在水里蹬了两下。`

**为什么这个场景成立**：`swim`／`swimming` 在库里是**最成熟的零件之一**（各 72 处，覆盖 L13／L14／L43／L47／L66／L67／L72／L170／L174 九课），但**从未以「正在学游泳」的身份出现过**——所有 72 处都是「会游泳（can）」「正在游泳（be+-ing）」「游泳这件事（-ing 作名字）」。**同一批零件、全新的说法。**

### 4.3 逐词核对（≤8 词红线）

**目标句 `I am learning to swim.`**

| # | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| 词 | I | am | learning | to | swim |
| 状态 | 已教 | 已教 | **新词** | 已教 | 已教（L13 `:2399` `I am not sleeping.` 同级；`swim` 见 L14 `:2586`） |

**⇒ 5 词 ✅**

**其余关键句逐词核对**：

| 句 | 词数 | 核对 |
|---|---|---|
| `She is learning to swim.` | 5 | ✅ |
| `I am not learning to swim.` | 6 | ✅ |
| `Are you learning to swim?` | 5 | ✅ |
| `I am learning to draw.` | 5 | ✅ |
| `My sister is learning to swim.` | 6 | ✅ |
| `I am learning to sing.` | 5 | ✅ |
| `I am going to swim.`（对比卡·L29 复现） | 5 | ✅ |

### 4.4 一句话规则（`oneLineRule`）

> `说「正在学做某事」：be 后面那个词穿 -ing，那块小垫板 to 照样垫——I am learning to swim（我正在学游泳）。to 后面那个动作穿原样。`

**零术语实测 ✅**（见 §4.9 自检输出①：本课全部用户可见字段对 29 词表**零命中**）。本句用的是库内既用比喻——`小垫板` GL 36／`名字版` GL 246／`穿 -ing 外套`（L13 `:2418` 逐字），**全部沿袭既有说法，未新造比喻**。
**⚠️ 写课方注意**：不要在 `oneLineRule` 里写「后面用动词原形」这类措辞——红线词表含该词（`grammarZeroTerms.ts` 第 9 项）。库内既有说法是「穿原样」（L15 `:2844` 逐字「to 这块小垫板不能丢」＋ `blocks.role` 逐字「旅行（原样）」）。

### 4.5 对比卡 6 条（**3 带标记 + 3 双正解**）

| # | wrong | wrongMark | correct | bothRight | whyZh |
|---|---|---|---|---|---|
| ① | `I am learning swim.` | `swim` | `I am learning to swim.` | — | `中文「我在学游泳」中间没有小词，英语要垫上那块 to——learning 【to】 swim。第 15 课的老规矩：两个动作之间要垫板。` |
| ② | `I am learning to swimming.` | `swimming` | `I am learning to swim.` | — | `-ing 那件外套只穿在前面那个词上——to 后面那个动作穿原样：to 【swim】，不再穿第二件。第 44 课学过：垫板后面永远原样。` |
| ③ | `I am learn to swim.` | `learn` | `I am learning to swim.` | — | `「正在」那件 -ing 外套不能脱：be 后面的 learn 要穿成 【learning】。第 13 课的老规矩——有 be 搭着，动词就穿 -ing。` |
| ④ | `I am going to swim.` | `null` | `I am learning to swim.` | ✅ | `两句都对——外形一模一样（be 后面穿 -ing，后面垫 to），可第 29 课那个 going 是「打算」，今天这个 learning 是「正在学」。同一个架子，前面那个词说明白是哪件事。` |
| ⑤ | `I am good at swimming.` | `null` | `I am learning to swim.` | ✅ | `两句都对——第 67 课那个 at 后面跟名字版（swimming），今天 learn 门口垫的是 to。每个动词门口规矩不一样（第 45、46 课）。` |
| ⑥ | `I enjoy swimming.` | `null` | `I am learning to swim.` | ✅ | `两句都对——第 45 课那个 enjoy 门口不认 to，后面直接跟名字版 swimming；今天这个 learn 门口要垫 to。同样是「游泳」，两个门口两种规矩。` |

**⚠️ 对比卡设计说明（对抗 §2.3 的冲突风险）**：

- **③ 是新增的第三张「带标记」卡**——它不是「换动词」，而是 **be + -ing 外套不能脱**（L13 `:2433` `"I am not sleep."` → `"I am not sleeping."` 的同型错误在 `learn` 上的复现）。
- **⑤⑥ 两张双正解卡就是「enjoy 冲突」的全部处置**——按 §2.3 结论，**只做同台对照、不做二次讲解**。
- **⑥ 与 L46 `:8585` 逐字对照**：`"enjoy 的门只开一扇：enjoy reading——to 进不去。对照记：同一块 read，want 门口却要垫板（want to read）。"`——**L46 已经做过一次「同一块动词、两个门口」的对照教学**；本课 ⑥ 是第三次同型对照，**属于收口性质，不是新教学**。
- **④ 是本课最有价值的一张**：它把「be + -ing + to」的外形从 `going` 手里「借」过来——`I am going to swim.`（第 29 课）与 `I am learning to swim.`（今天）**外形完全一致**，这既解释了用户「我好像见过这个形状」的既视感，也明确切开了「打算」与「正在学」。

### 4.6 变体三态（`variants`）

| label | en | zh | noteZh |
|---|---|---|---|
| 肯定 | `I am learning to swim.` | `我正在学游泳。` | `be 后面那个词穿 -ing；to 照样垫。` |
| 否定 | `I am not learning to swim.` | `我没在学游泳。` | `在 am 后面加 not——learning to swim 原地不动（第 13 课的老规矩）。` |
| 疑问 | `Are you learning to swim?` | `你在学游泳吗？` | `Are 搬到句首——learning to swim 原地不动。` |

**依据（逐字）**：L13 `:2447` `{ label: "否定", en: "I am not sleeping.", zh: "我没在睡觉。", noteZh: "在 am 后面加 not，就是「没在」。" }`——本课否定完全同型，只把 `sleeping` 换成 `learning to swim`。

### 4.7 复现取材（**红线：同一句 in practice 最多 6 课**）

**本轮实测的复现水位（连续子序列口径 + practice 答案口径）**：

```bash
node -e 'const S=require("/tmp/glscan2.js");
for(const s of ["I am drawing a picture.","I am not sleeping.","I can swim.","I am going to watch a movie.","I am good at swimming.","Swimming is fun."])
  console.log(s.padEnd(32), "prac 课数=" + (S.prac[s]||[]).length, "L"+(S.prac[s]||[]).join("/L"));'
# → I am drawing a picture.        prac 0
# → I am not sleeping.             prac 1   L13
# → I can swim.                    prac 3   L14/L47/L174
# → I am going to watch a movie.   prac 2   L29/L75
# → I am good at swimming.         prac 0
# → Swimming is fun.               prac 1   L43
```

| 取材课 | 复现句 | 位置 | 取材后该句 practice 课数 | 红线 |
|---|---|---|---|---|
| **L13** `:2387` `I am drawing a picture.` | `I am drawing a picture.` | `guided` 第 3 题（复习一小步） | **1** | ✅（≤6，余 5） |
| **L29** `:5391` `I am going to watch a movie.` | `I am going to watch a movie.` | `guided` 第 5 题（再对照一句） | **3** | ✅（≤6，余 3） |
| **L43** `:7997`（目标句）／`:8005`（例句） `Swimming is fun.` | `Swimming is fun.` | `practice` 第 5 题 | **2** | ✅（≤6，余 4） |
| **L14** `:2586` `I can swim.` | `I can swim.` | `sceneSwings` 第 3 条 | **4** | ✅（≤6，余 2） |

**⇒ 四处取材全部在红线内，最高水位 4（余 2）。** ⚠️ **不建议本课再复现 `I like reading.`（已 4 课）／`I enjoy reading.`（已 3 课）／`I am used to getting up early.`（已 5 课）／`I am looking forward to seeing you.`（已 3 课）**——这四句水位已高，且 §2.3 已判定不做第二次门卫对照教学。

### 4.8 案件建议

| 项 | 值 |
|---|---|
| **案件 id** | `hunt-learning-to-swim` |
| **number** | **199**（实测 198 案连续无缺号、无重号） |
| **title** | `水上活动课的第一天` |
| **scene** | `教练写在白板上的一句话（课后小美的复述）` |
| **tokens** | `My / sister / is / learning / swim. / I / am / learn / to / swim, / too. / We / go / to / the / beach / last / week. / Two / teacher / very / nice.` |
| **errors** | ① `is learning` 后的 `swim` → `to swim`（`verb_form`，**本课新错**：垫板丢了）② `learn` → `learning`（`verb_form`／`miss`ing_be` 口径：**be 后面要穿 -ing**，第 13 课回流）③ `go` → `went`（`tense`，L10 回流）④ `teacher` → `teachers`（`plural`，L11 回流） |

**⚠️ 案件设计的三条约束（实测）**：

1. **每案错误数 2–6**：实测分布 `{2:19, 3:22, 4:154, 5:2, 6:1}`——**本课用 4 处，落在最常见的档位（154/198 案都是 4 处）** ✅
2. **修正可为「加词」型**：实测插入型修正已有先例（`"is happy"`／`"to buy"`／`"to me"`／`"is reading"`／`"to go"`／`"a few"`／`"to getting"`），**`swim → to swim` 属同型** ✅
3. **须留至少一个「干净词」做陷阱**（`huntService.test.ts` 断言 `leaves every case with at least one clean (decoy) token`）——本案的 `nice`／`too`／`very` 即陷阱位 ✅

**本案设计意图**：把本课的**两个新错**（丢 to ／ be 后不穿 -ing）与**两个旧错回流**（昨天版 go→went／好几个 teacher→teachers）同案混排——**这是既有 198 案的一贯结构**（对照 #198 `hunt-their-books`：2 新 + 2 旧）。

### 4.9 红线逐条自检（本课草案实测输出）

```
① 零术语命中: 0 ✅
② 星号: 0 ✅
③ 目标句词数: 5 (≤8) ✅
④ contrast: 6  带标记: 3  双正解: 3 ｜ variants: 3 ｜ guided: 6 ｜ practice: 5
⑤ practice 句跨课复现:
   I am learning to swim.           0  ✅ 将成 1
   Are you learning to swim?        0  ✅ 将成 1
   I am not learning to swim.       0  ✅ 将成 1
   My sister is learning to swim.   0  ✅ 将成 1
   I am learning to sing.           0  ✅ 将成 1
⑥ 新句查重（GL/HC 连续子序列）: 全部 0 ✅（唯一命中 I can swim. GL=17 是既教句，作为复现使用）
⑦ C 层 Jaccard（须 <0.8）:
   My sister is learning to swim.   worst=0.57 OK
   I am learning to sing.           worst=0.67 OK
   （前三条为目标句/变体复现，走 B 层，不在本断言范围）
⑧ 生词: learn / learning —— 由本课 blocks 与 examples 首次带入 ✅
⑨ tokens==answer / 干扰项不撞答案: 全部 OK ✅
⑩ variants 在 practice 中命中数: 2（要求 ≥1）✅
```

**关键数字**：`Jaccard worst = 0.67`（阈值 0.8）、`practice 复现最高水位 4`（红线 6）、`contrast 6=3+3`、`目标句 5 词`。

### 4.10 学习目标文案（`summary` / `recall`）

**`summary.rule`**：
> `「正在学做某事」：be 后面那个词穿 -ing，后面照样垫 to——I am learning to swim。`

**`summary.points`**：
> `I am learning to swim. —— be + -ing，to 照样垫`
> `I am learning swim. ❌ —— 少了 to（第 15 课老规矩）`
> `I am learning to swimming. ❌ —— to 后面穿原样`
> `I am good at swimming. —— 第 67 课：那个门口跟名字版（对照记）`

**`recall`**：
> `promptZh: "水上活动课的下课铃响了，教练在岸上问你学得怎么样。凭记忆，写出你那句英文。"`
> `intentZh: "我正在学游泳。"`
> `answer: "I am learning to swim."`
> `noteZh: "be 后面那个词穿 -ing——后面那块 to 照样垫。"`

### 4.11 季分组变更（必做，否则被静默过滤）

**`src/data/grammarSeasons.ts :69`** 现逐字：

> `{ id: "season-28", label: "第二十八季 · 收口、目的、条件、不得不与他们的", hint: "把整季的句型排一行，再加四格：做这事是为了让谁做什么（so that）、只要你来我就去（as long as）、昨天不得不走回家（had to）、他们的东西（their／theirs）", min: 182, max: 189 },`

**建议改为**：

> `{ id: "season-28", label: "第二十八季 · 收口、目的、条件、不得不、他们的与正在学的", hint: "把整季的句型排一行，再加五格：做这事是为了让谁做什么（so that）、只要你来我就去（as long as）、昨天不得不走回家（had to）、他们的东西（their／theirs）、正在学游泳（learning to swim）", min: 182, max: 190 },`

**零术语实测 ✅**（`:69` 的 label／hint 是**用户可见字段**——`grammarSeasons.test.ts` 有专门断言「季 label/hint 不得含语法术语」）。
**⚠️ `min:182, max:190` 后季体量 = 9 课，仍 ≥6，不影响「≤3 课小季 ≤3」的实测值 3** ✅

### 4.12 里程碑与封面

| 项 | 值 | 依据 |
|---|---|---|
| **里程碑** | `can-do-m38`，`afterLesson: 190` | 现有末位是 `can-do-m37`（`GrammarPathPage.tsx :374`，`afterLesson: 189`） |
| **里程碑 title** | `我能说「我正在学」` | 与 m35–m37 同型（「我能说「是为了」和「只要」」／「我能说「昨天不得不」」／「我能说「他们的」」） |
| **里程碑 zh** | `正在学做某事（be 后面那个词穿 -ing，后面照样垫 to：I am learning to swim）+ 两件外套同台（-ing 只管前面那个词，to 后面照样原样）——「正在做」和「正在学」只差后面那块垫板。` | —— |
| **里程碑 samples** | `["I am learning to swim.", "She is learning to swim.", "I am not learning to swim."]` | —— |
| **封面** | `cover73`（117 张全部已导入；`cover73` 全库仅 L73 用 1 次，为复用次数最低档） | 实测：复用次数 =1 的封面共 54 张；L186–L189 分别取 46／47／71／72 |

---

## §5 未核实项

### 5.1 本轮**已核实**（列此以明确边界）

| # | 项 | 实测结果 |
|---|---|---|
| 1 | 四词词频 | `learn` **GL 0／HC 2**、`decide` **0／0**、`hope` **0／HC 1**、`try` **0／0**；过去形 `learned` **GL 1（L118 `:22552` 仅作对话）/ HC 2（案 20 `:1016` 作错句原词）**、`tried` **GL 1（L171 `:33529` 仅作例句）/ HC 0** |
| 2 | 全库 `hope/decide/learn/try` 家族出现的**全部行** | **GL 仅 1 行**（`:22552` `learned`）；**HC 仅 4 行**（`:986`／`:1016`／`:1017`／`:1639`）——**「四员全零」成立** ✅ |
| 3 | L45 `enjoy` 原文 | 已逐字核实（`:8362`／`:8375`／`:8392`／`:8440`／`:8442`） ✅ |
| 4 | 门卫词系列共 5 站 | `enjoy`(L45)／`finish`(L64)／`good at`(L67)／`keep`(L77)／`mind`(L69 `:13013`)，另 `be used to`／`looking forward to` 第 6 类（`:26185`） ✅ |
| 5 | `be + -ing + to` 全库空白 | **38 处该外形，`-ing` 位 100% 是 `going`** ✅ |
| 6 | 下一可用课号 | **L190**（189 课连续、无缺号无重号；`lesson-190-` 未占用） ✅ |
| 7 | 下一可用案号 | **199**（198 案连续、无缺号无重号） ✅ |
| 8 | 季体量现状 | 28 季；**≤3 课小季 = 3 个（上限 3，已顶格）**；`season-28` 现 182–189（8 课） ✅ |
| 9 | 场景用量 | `mansion` 61／`campus` 57／`city` 38／`sparkle` 9／`island` 5／`train` 5／`mystery` 4／`forest` 3／`magic` 2／`snow` 2／`ocean` 1／`lighthouse` 1／`desert` 1／**`space` 0** ✅ |
| 10 | 复现水位 | 最高 **6**（`Yesterday I went to the park.`／`There is a book on the desk.`）；本课四处取材后最高 **4** ✅ |
| 11 | 案件错误数分布 | `{2:19, 3:22, 4:154, 5:2, 6:1}`；插入型修正已有先例 ✅ |
| 12 | 重放题预算 | **当前 23 道／上限 26（余量 3）**（`grammarLessons.test.ts` 实跑探针复算） ⚠️ **新增课务必避免「提示与看段中文同译」** |
| 13 | `grammarLessons.test.ts` | **27 项全绿** ✅ |
| 14 | ugrep 失效范围 | `hope` 0(应 1)／`swim` 0(应 11)／`want` 0(应 18) on huntCases；`want to` 粗匹配 104 < 边界 109 ⚠️ |

### 5.2 本轮**未核实**（诚实登记）

| # | 未核实项 | 为什么 | 影响 |
|---|---|---|---|
| 1 | **`decide`／`hope`／`try` 三个词在词典侧的教学依据** | `seedWords.ts` 是 115 词的**高级词表**（`achieve`／`adapt`／`analyze` 起头），**不含** `learn`／`decide`／`hope`／`try`／`swim`／`enjoy`／`draw`／`cook` 中任一个——它是另一条线（`CORE_100_WORDS_VERSION = "core-100-v1"`），**不覆盖 A0/A1 动词** | **无法从库内论证四员的「档位」**；本报告的档位判断全部来自上游普查文档（未在源码内核实） |
| 2 | `bundledDictionary.ts` 的 12000 词条 | 实测 `learn`／`decide`／`hope`／`try`／`swim` 等**全部在词典里有词条**（`learn` 逐字 `"gain knowledge or skills..."`） | 该词典是**通用英汉／英英词典数据**，非本项目教学依据；**不构成「可立课」的证据** |
| 3 | Cambridge 侧「verb + to-infinitive」的**完整词表与档位标注** | 本轮 WebFetch 抓到的 Cambridge 页面把 `learn`／`decide`／`hope`／`try`／`want`／`need` 同列一张「Verbs followed by a to-infinitive」表（`afford, agree, arrange, ask, begin, choose, continue, decide, demand, fail, forget, hate, help, hope, intend, learn, like, love, manage, mean, need, offer, plan, prefer, pretend, promise, refuse, remember, start, try, want`），`enjoy` 在 `-ing`-only 表（`admit, avoid, (can't) help, (can't) stand, consider, deny, dislike, enjoy, fancy, feel like, finish, give up, imagine, involve, keep (on), mind, miss, practise, put off, risk`），`try` 同时在「meaning change」组 | **抓到的页面无 A1/A2 档位标注**，且 British Council 的对应页 **404** | **「四员同轴」得到外部词典侧支持**（同一张表、同一行规则），但**「谁先教谁后教」缺外部档位依据** |
| 4 | 我方「`hope to` 与 `looking forward to` 混淆率」 | 无真人数据 | §2.4 的风险判断是**结构分析**（中文义近、外形相反），**不是实测** |
| 5 | 真人首玩计时与「两件外套同台」的理解难度 | 需真人（延续批三十四／三十五的登记） | §1 的「1 课可行」是内容可行性判断，**非学习效果判断** |
| 6 | `learn` 的发音／跟读素材 | 未查素材管线 | 若素材管线有「新词必须配发音」的硬门，本课需追加 **1 项素材**（与 §4.1 造词成本 1 对应） |
| 7 | L190 的完整通关走查 | 未上线 | 上线后按批三十四 D4 口径走查（路径页／季卡／课前试一试／案 #199 解锁指向） |
| 8 | m38 里程碑 insert 位置 | `GrammarPathPage.tsx :374–381` 是 `can-do-m37` 的完整对象，`:382` 起是 `];` | 按批三十六 E3 教训（改用在数组末尾 `];` 之前插入），**本轮未实操** |

### 5.3 携带项登记（供路线图）

| # | 携带项 | 状态 | 建议 |
|---|---|---|---|
| **1** | **`decide to`** | 本批判定「只是换动词」，不做 | 若未来要立课，需先找到 `決定` 之外的独立中文入口 |
| **2** | **`hope to`** | 本批判定「入口被 `season-21` 占满」+「与 `looking forward to` 外形相反」，不做 | **缓排，且需先评估与 L136 的混淆风险** |
| **3** | **`try to`** | 本批判定「中文入口不成词」，不做 | 与 `try` 的其他用法（`try on`／`have a try`）一起评估 |
| **4** | **`want sb to do`** | **GL 0**（唯一 1 处是 L15 `:2819` 的错句 `Want you to play?`） | 若未来做「我希望你……」这一格，是本条轴的真正延伸；**但它与 L103–L108「谁让谁做什么」章（`season-16`）相邻，需先切分** |
| **5** | **重放题预算仅余 3 道** | **新发现**（本轮实跑探针复算 = 23／26） | ⚠️ **后续批次写课需注意**：练习的 `promptZh` 中译不得与看段素材中译同译 |
| **6** | **`forget to` / `remember to`** | `forget` GL 14（L37 `:6870` 附近「引子可以换人」章）／`remember` **GL 0** | 上游普查把它与 `try` 并列；**本批未评估**——建议单独立项（与 L37 的 `forget` 接口已在，但用途不同） |
| **7** | **移动方向介词族**（`through`／`around`／`into`／`across`／`along` 全零） | 批三十六延后 | 未评估 |
| **8** | 旧错句供应趋紧（批三十五／三十六各报一次） | 延续 | 本案 4 处错误中 **2 处为新错**（丢 to／be 后不穿 -ing），**2 处为旧错回流**——缓解压力 |

---

## §6 方法论收获

### 6.1 「家族补员」不等于「补员即立课」

批三十六发现的模式是「**家族开了头、缺成员**」。本批证明：**这个模式需要二次判定**——

| 缺员的类型 | 判定 | 例子 |
|---|---|---|
| **孤儿缺格**（同一个架子的孤立缺位，补上即完整） | ✅ 可立课 | `their`（L189：L8 的清单只缺它，补格） |
| **同轴换词**（补上只是让同一句话换个动词） | ❌ **不可立课** | `decide to`／`hope to`／`try to`（本批） |
| **同轴换词 + 带出一件新外形** | ✅ 可立课 | `learn to`（带出 `be + -ing + to` 这件库里 38 处全是 `going` 的外形） |

**⇒ 判据（建议入路线图）：「缺员若只让已知句型换一个动词，则它不是一课，它是一个词表项。」**

### 6.2 「中文入口」应当成为补员课的前置门

本批最有杀伤力的一张表是 §2.1——**四员里两员的中文入口已被占用或不存在**：

- `hope to` ← 中文「盼望」已被 `season-21` 整季（6 课）占满；
- `try to` ← 中文「试着」不成词；
- `decide to` ← 中文「决定」半占（L29／L179）。

**⇒ 判据（建议入路线图）：「补员课的前置门是『中文侧有一个干净、成词、未被占用的入口』——英文侧『这个词库里没有』不足够。」**

### 6.3 「门卫叙事」的边际收益递减

`enjoy`(L45) → `finish`(L64) → `good at`(L67) → `keep`(L77) → `mind`(L69) → `learn`(本批)。
**实测 `名字版` GL 246／`门卫` GL 20／`门只开一扇` GL 11**——这条叙事在库里已经充分展开。

**⇒ 判据（建议入路线图）：「第 6 个及以后的门卫词，只在对比卡双正解位出现 1 次，不新增 deepDive 讲解段。」**

---

## 附录 A：核查留痕（本轮脚本复跑）

```bash
# A1 四员词频（词边界；node）
node -e 'const S=require("/tmp/glscan2.js");
for(const w of ["learn","learned","learning","decide","decided","hope","hoped","try","tried","trying"])
  console.log(w.padEnd(9),"GL="+S.c(w),"HC="+S.c(w,S.HC));'
# → learn 0/2  learned 1/2  learning 0/0  decide 0/0  decided 0/0
# → hope 0/1   hoped 0/0    try 0/0      tried 1/0  trying 0/0

# A2 底座词频（词边界）
node -e 'const S=require("/tmp/glscan2.js");
for(const w of ["want to","need to","like to","seem to","be able to","in order to","used to"])
  console.log(w.padEnd(13),"GL=" + (S.GL.match(new RegExp(w,"gi"))??[]).length);'
# → want to 109  need to 44  like to 20  seem to 10  be able to 20  in order to 48  used to 489

# A3 I am swimming 的归属
node -e 'const S=require("/tmp/glscan2.js"); console.log(S.lessonsOf("I am swimming").join("/"));'
# → 43

# A4 be + -ing + to 的 -ing 位集合
node -e 'const S=require("/tmp/glscan2.js");
const re=/\b(am|is|are|was|were)\s+(\w+ing)\s+to\s+([a-z]+)/gi; const s=new Set();
for(const m of S.GL.matchAll(re)) s.add(m[2]); console.log([...s].join(", "));'
# → going

# A5 季体量
node -e 'const {readFileSync}=require("fs");
const S=readFileSync("src/data/grammarSeasons.ts","utf8");
const g=[...S.matchAll(/min: (\d+), max: (\d+)/g)].map(m=>({a:+m[1],b:+m[2]}));
console.log("seasons:",g.length,"| tiny(<=3):",g.filter(x=>x.b-x.a+1<=3).length);'
# → seasons: 28 | tiny(<=3): 3

# A6 测试
npx vitest run src/data/grammarLessons.test.ts   # → 27 passed
```

## 附录 B：本批逐字引文索引（引文全部给行号）

| 文件:行 | 课 | 逐字（节选） |
|---|---|---|
| `grammarLessons.ts:2774` | L15 | `「想做……」= want to + 原样：I want to travel。want 后面要垫一块小垫板 to。` |
| `grammarLessons.ts:2792` | L15 | `中文「想去」后面直接接动词，但英语 want 后面要垫一个小小的 to，动词才踩得上去。` |
| `grammarLessons.ts:2819` | L15 | `wrong: "Want you to play?",`（全库唯一 `want you to`） |
| `grammarLessons.ts:8189` | L44 | `两个动作要垫板才缝得上：go to the shop「to buy」milk——到地方垫一块 to（带路），去做什么再垫一块 to（说明目的）。` |
| `grammarLessons.ts:8219` | L44 | `垫板 to 后面永远穿原样：to buy——买东西说 buy，不说 buying。` |
| `grammarLessons.ts:8362` | L45 | `grammarLabel: "enjoy 的门 · 只认 -ing"` |
| `grammarLessons.ts:8375` | L45 | `enjoy 的门只开一扇：只认名字版 enjoy reading，不认 enjoy to read——enjoy 后面不垫 to。` |
| `grammarLessons.ts:8442` | L45 | `这课只用记一个动词的门口：enjoy 只认名字版。别的动词以后一个一个遇。` |
| `grammarLessons.ts:8585` | L46 | `enjoy 的门只开一扇：enjoy reading——to 进不去。对照记：同一块 read，want 门口却要垫板（want to read）。` |
| `grammarLessons.ts:8633` | L46 | `悄悄话一句：其实「喜欢」两类搭法都能说——like reading 和 like to read 都对，意思几乎一样。` |
| `grammarLessons.ts:33064` | L62 | `后面跟东西时不垫 to——I'd like 【a cup of tea】。要跟动作才垫 to（I'd like to go home）。` |
| `grammarLessons.ts:2412` | L13 | `中文说「她在画画」可以不用「是」，但英语的 be 动词不能丢——丢了，句子就塌了。` |
| `grammarLessons.ts:2418` | L13 | `说「正在做」，动词要穿 -ing 这件外套：draw → drawing。` |
| `grammarLessons.ts:2447` | L13 | `{ label: "否定", en: "I am not sleeping.", zh: "我没在睡觉。", noteZh: "在 am 后面加 not，就是「没在」。" }` |
| `grammarLessons.ts:2584` | L14 | `说「能/会」，动词前面放 can，动词一点不变：I can swim。` |
| `grammarLessons.ts:2586` | L14 | `{ en: "I can swim.", zh: "我会游泳。" }` |
| `grammarLessons.ts:2598` | L14 | `wrong: "I can to swim.",`（can 不垫 to） |
| `grammarLessons.ts:4700` | L25 | `「辅音 + y」结尾的把 y 变 i 再加 -es：study → studies、carry → carries。元音 + y 不变：play → plays。` |
| `grammarLessons.ts:5397` | L29 | `说「打算做、就要做」用 be going to + 原样：I am going to watch。be 跟着句首那个「谁」变（am/is/are），going to 不变。` |
| `grammarLessons.ts:5461` | L29 | `will：说话那一刻才决定的、或承诺——I will call you tonight（刚决定的）。` |
| `grammarLessons.ts:5417` | L29 | `wrong: "I am going to watching.",` |
| `grammarLessons.ts:8005` | L43 | `{ en: "Swimming is fun.", zh: "游泳真好玩。" }` |
| `grammarLessons.ts:7815` | L42 | `-ing 是动词的第二份工作：有 be 搭着＝正在做（I am reading）；没有 be、跟在 like 后面＝当名字用（I like reading）。` |
| `grammarLessons.ts:8003` | L43 | `这件事当句子的主角时也穿名字版：Swimming is fun——句首不放 Swim（那是命令口气），放 Swimming。` |
| `grammarLessons.ts:12013` | L64 | `说「做完了」用 finish + 名字版（finish reading）——它和第 45 课的 enjoy 一样，门只开一扇。` |
| `grammarLessons.ts:12598` | L67 | `说「擅长做某事」用 good at + 名字版：good at drawing——at 是它的门牌，门里穿名字版。` |
| `grammarLessons.ts:13013` | L69 | `垫板对门卫不管用：mind 不认 to——去掉它，名字版上岗。` |
| `grammarLessons.ts:14539` | L77 | `一件事一直做、不停做，用 keep + 名字版（keep doing）——keep 是「一直」，不是「做完」（那是第 64 课的 finish）。` |
| `grammarLessons.ts:20562` | L108 | `说「说服他做」：got him to + 动作——家族里只有 get 垫一块小垫板：I got him to go with me。` |
| `grammarLessons.ts:22944` | L120 | `习惯了「做某事」：后面那件事要换名字版（穿 -ing）——I am used to getting up early。同一个 to，前面有 be 站着，它认名字版。` |
| `grammarLessons.ts:26117` | L136 | `盼着「做某事」：后面那件事要换名字版——I am looking forward to seeing you。跟第 120 课同一个规矩：这个 to 认名字版。` |
| `grammarLessons.ts:26185` | L136 | `最容易踩的坑：一看 to 就顺手接原样（see）。第 120 课你已经踩过一次，今天再把它记住——这个 to 认名字版，不认原样。` |
| `grammarLessons.ts:30949` | L160 | `说「好像」用 seem，后面请 to 垫一下——He seems to know you（他好像认识你）。to 后面那个动作穿原样：to know，不换形状。` |
| `grammarLessons.ts:30992` | L160 | `两句都对——第 15 课那个 to 和今天这个 to 是同一个垫板；只是前面站的词不一样（want／seem）。` |
| `grammarLessons.ts:31155` | L161 | `说「需要」用 need，后面请 to 垫一下——I need to buy some milk（我需要买点牛奶）。` |
| `grammarLessons.ts:31198` | L161 | `两句都对——第 15 课那个 to 和今天这个 to 是同一个垫板；只是前面站的词不一样（want／need）。` |
| `grammarLessons.ts:31224` | L161 | `这个 to 你已经见过三次了：want to（第 15 课）、seem to（第 160 课）、need to（今天）。位置一样、规矩一样，只是前面站的那个词在换。` |
| `grammarLessons.ts:34004` | L173 | `说「为了」用 in order to——I got up early in order to catch the bus…它和第 44 课那块小垫板 to 是一家人。` |
| `grammarLessons.ts:34124` | L173 | `想说「为了不…」，把 not 插在 to 前面：in order not to miss the bus（为了不误车）。` |
| `grammarLessons.ts:34252` | L174 | `说「能」除了 can，还有 be able to——I am able to go there myself now（我现在能自己去了）。` |
| `grammarLessons.ts:35490` | L179 | `问「我们…好吗」用 Shall we…它和第 75 课那个 Let's 是一对…把决定权递出去。` |
| `grammarLessons.ts:37163` | L186 | `说「是为了让谁做什么」用 so that——I came early so that you can rest…in order to 后面跟「做什么」（都是同一个人），so that 后面跟「谁 + 能做什么」。` |
| `grammarLessons.ts:37274` | L186 | `换人要用 so that：in order to 后面只跟动作、前后同一个人——【so that】 you can rest。` |
| `grammarLessons.ts:37357` | L187 | `说「只要」用 as long as：两个 as 各卡一头。` |
| `grammarLessons.ts:37573` | L188 | （`contrast[0].correct`）`I had to walk home yesterday.` |
| `grammarLessons.ts:37745` | L189 | `说「他们的」用 their，它跟 my、her 一样贴在东西前面——These are their books。` |
| `grammarLessons.ts:37813` | L189 | `这批小标签还有一个「自己站」的版本，尾巴带 s：mine、yours、hers、theirs。` |
| `grammarSeasons.ts:59` | — | `// 第二十一批 · 盼着那一天（2026-09-20）：look forward to 整块立岗 + 换人换形 + 名字版 + 否疑 + 与批十八两站收口` |
| `grammarSeasons.ts:60` | — | `{ id: "season-21", label: "第二十一季 · 盼着那一天", … min: 134, max: 138 },` |
| `grammarSeasons.ts:69` | — | `{ id: "season-28", … min: 182, max: 189 },` |
| `grammarZeroTerms.ts` | — | `「主语」「谓语」「宾语」…「形容词」「副词」「介词」`（29 词） |
| `AdventureScene.tsx:12` | — | `"ocean",` |
| `AdventureScene.tsx:35` | — | `ocean: "海底世界",` |
| `huntCases.ts:1016–1018` | 案 20 | `original: "learn",` `correction: "learned",` `explanation: "Last term 是过去的时间，动词要换成过去式：learned。"` |
| `huntCases.ts:1639` | 案 29 | `"hope",`（`I hope you have done it all.`——**全库唯一 `hope`**，且是**不做错句标志的正文词**） |
| `huntCases.ts:3437–3459` | 案 54 | `"enjoy","to","draw","pictures."` → `original: "to", correction: "去掉 to"`，`explanation: "enjoy 的门只开一扇，它不认 to——enjoy drawing：只认名字版。"` |

---

> 本报告由产品战略团队 AI 协作生成（研究员：瑞思），重要决策请由产品负责人审定。
