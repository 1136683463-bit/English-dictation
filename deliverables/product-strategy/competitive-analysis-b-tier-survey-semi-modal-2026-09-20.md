# 竞品分析：B 档前沿普查（半情态／条件／目的）· 竞析报告

| 字段 | 值 |
|---|---|
| 报告 | 竞品/跨源分析（竞析）· **第三十一批「B 档前沿普查」** |
| 日期 | **2026-09-20** |
| 本轮任务 | **不是做课，是判档**——对 11 项**从未评估过**的「半情态／条件／目的」类候选做跨源档位判定 |
| 我方快照 | `src/data/grammarLessons.ts`（**160 课**，末课 `number: 160`，31009 行）· `src/data/huntCases.ts`（**169 案**，9149 行）· `src/data/grammarSeasons.ts`（**30 季**，末季 `season-30`）——**本轮本机独立复算** |
| 跨源取到 | **Cambridge 语法页 17 页（全部 title／h1 双核）**（含本轮新取 `Had better`／`Ought to`／`Need`／`Dare`／`As long as and so long as`／`As if and as though`／`So that or in order that?`／`In order to`／`Conditionals: other expressions`／`Be expressions`／`If`／`Even`／`Unless`／`In case (of)`／`Prefer`／`Rather`／`Well`）· **Cambridge Browse Grammar 字母段 19 个**（用于复核「独立页存在性」）· **Cambridge 词典 14 条（title 双核）** · **Oxford 4 条**（六项 404）· **BC 实取 22 页**（4 张索引全目 ＋ 17 张专页／参考页＋1 张参考索引）· **中文侧 15 页 200／约 30 页 404**（english.cool 12 页 200＋30 页 404；letmeenglish 1 页 200＋14 项 526 间歇故障） |
| ⚠️ 未取到 | **Murphy 双册 TOC**——`cambridge.org` 403、`archive.org`／`web.archive.org`／`books.google.com` 不可达、本机 `/private/tmp/murphy_int.html` 实测是 **503 Cloudflare 错误页**（1304 字节）。**本报告 Murphy 层全部为「沿用既有批次记录」并逐条标注来源批次**（§7 项 1） |
| ⚠️ 本机不可达 | **`learnenglish.britishcouncil.org` 直连 curl 全 000／403**（Akamai 拦截）；**本报告 BC 层全部经 WebFetch 取到**，URL 已按 **新 `/free-resources/grammar/…` 体系**标注（§7 项 2） |
| 口径 | **Cambridge 语法页只取 `<article class="di">` 正文，剔除全站侧栏导航**（沿用批三十新定口径） |
| ⚠️ 方法学坑（本轮再次触发） | **Cambridge 对不存在的 slug 返回 200 ＋ 邻近页**。本轮实测：`/grammar/british-grammar/even-if` → **200，但 title 是 `If`**；`/grammar/british-grammar/be-able-to` → **200，但 title 是 `Be expressions (be able to, be due to)`**；`/grammar/british-grammar/provided` → **302 回语法总入口**。**→ 本报告每一项都核过 `<title>` 与 `<h1>`，凡未核过的一律登记「未核实」。** |

---

## §0 本轮结论速览（7 条）

1. **【最重要发现】本批拿到两个「真课程位」，都在 BC**：**① `need to`**——**BC 参考层 `Suggestions and obligations`（Level: beginner ＋ intermediate）明文把 `need to` 与 `must` 并列**（逐字 "**We use must or need to to say that it is necessary to do something:**"）＋ **BC B1-B2 正课 `Modals: permission and obligation` 有独立小节 `No obligation / don't have to`**；**② `be able to`**——**BC B1-B2 正课 `Past ability`**（h1 逐字 "Past ability"，Level 逐字 "B1 Intermediate"／"B2 Upper intermediate"）。**→ 两项合计是本批仅有的课程位；其余 9 项课程位全为 0 或「多词共用一格」。** **`need to` 是本批唯一「课程位 ＋ 厚规则页 ＋ CEFR A1」三齐的一项**；`be able to` 的课程位压在 B1-B2 段（跨级）。
2. **`had better` 复核结论：批三十的线索成立，且比批三十记的更硬。** Cambridge `Had better` 页 **title／h1 双核为 "Had better"**，**5 个实 h2 小节**（`Had better: form and meaning`／`Had better: negative and question forms`／`Had better or be better, be best?`／`Had better or would rather, would prefer?`／`Had better: typical errors`），**4 条 `Not:` 明文禁用**。**→ 独立规则页 ✅ 成立。**
3. **`even if` 的「无独立页」本轮实测确认**——它**不是独立页，是 `If` 页内的一个 h2 小节**（`If` 页 h2 序列逐字：`If: conditions`／`If possible, if necessary`／`If so, if not`／**`Even if`**／`If: reporting questions`／`If and politeness`）。**→ 按本项目「h2 小节 ≠ 课程位」的既有口径，`even if` 只能判 B。**
4. **`so that` 有独立页，但是「易混对页」不是「语法页」**——Cambridge **`So that or in order that ?`** 挂在 **`Grammar > Easily confused words`**（不是 `Verbs`／`Conjunctions`）。**全文无一条 `Not:`、无 Warning 框**，正文只有 4 段。**→ 规则页 ✅ 但薄；且它是「二选一」页，不是一个结构的完整规则页。**
5. **`be able to` 无独立页——是 `Be expressions (be able to, be due to)` 页内的一个 h2**，与 `Be about to`／`Be due to`／`Be likely to`／`Be meant to`／`Be supposed to` **六项共页**。**但 BC 另有一门 B1-B2 正课 `Past ability`**（h1 逐字 "Past ability"，Level 逐字 "B1 Intermediate"／"B2 Upper intermediate"），**→ 这是本批第二个「真课程位」。**
6. **判「撞已教内容」的红线本轮触发 4 项，性质分三档**：**① 判「同义换词 → 课量 0」2 项**——`as though`（对 `as if`，跨源四处逐字同义）／`ought to`（对 L47 `should`，跨源四处逐字同义）；**② 判「半新结构 → 课量封顶」2 项**——`had better`（新句法壳 ＋ 旧「建议」轴撞 L47）／`even if`（新条件逻辑 ＋ 旧 `if` 壳撞 L48）；**③ 高撞车但可做 1 项**——`as long as`（同 ❌will 纪律 ＋ 同条件壳，但「时长义」是真增量）。**逐项见 §2。**
7. **本轮无一项升 A。** A 档要求「跨源有课程位＋我方有缺口」——本批最接近的 `need to`／`be able to` 的课程位**都在 B1-B2 段**（我方是零基础线），**且 `need`／`able` 的词根我方实测全为 0**（`able` GL 词边界 0／`ought` 0／`dare` 0／`provided` 0），属须造词架。

---

## §1 逐候选档位判定

**判档口径（沿用批三十）**：**A** ＝ 跨源有**课程位**（上游把它当独立教学单元）＋ 我方有缺口；**B** ＝ 跨源有**规则页**（独立的语法参考页／词典语法页）但**无课程位**，或我方须造词但成本可控；**B＋**／**B−** 为 B 的上下微调；**C** ＝ 只有零散例句、无规则页、无课程位；**D** ＝ 跨源基本不收。

**⚠️ 本节所有 Cambridge 页面均已核 `<title>` 与 `<h1>`**（防 200＋邻近页陷阱）；**行内「未核」字样表示该条未复核，一律不得作为判档主依据**。

---

### 1.1 `had better`（最好…）——**档位：B**

| 字段 | 内容 |
|---|---|
| **① 跨源逐字证据** | **Cambridge `Had better`**（`/grammar/british-grammar/had-better`，**HTTP 200，title 逐字 `Had better - Grammar - Cambridge Dictionary`，h1 逐字 `Had better`**；面包屑逐字 `Grammar > Verbs > Modal verbs and modality > Had better`）：**实 h2 五个**——`Had better: form and meaning`／`Had better: negative and question forms`／`Had better or be better, be best?`／**`Had better or would rather, would prefer?`**／`Had better: typical errors`。正文逐字："**We use had better to refer to the present or the future, to talk about actions we think people should do or which are desirable in a specific situation. The verb form is always had, not have.**"／"**It is followed by the infinitive without to:**"／"**Had better is a strong expression. We use it if we think there will be negative results if someone does not do what is desired or suggested:**"／"**The question form of had better is made by inverting the subject and had. This means the same as should, but is more formal:**"／h2 节内 "**We don't use had better when we talk about preferences. We use would rather or would prefer.**"。**四条 `Not:` 明文禁用**（逐字）：`Not: I'd better to go now.`／`Not: You'd better hold a full, valid driving licence to hire a car.`／`Not: … she'd better work …`／`Not: You'd better take a boat trip across the bay…`。**Cambridge 词典**：独立条目 **`SOMEONE HAD BETTER DO SOMETHING`**，**CEFR 标 `A2`**，定义逐字 "**used to give advice or to make a threat:**"，例 `You'd better (= you should) go home now before the rain starts.`。**中文侧**：`english.cool/had-better/` **404**（本轮实测）；**`letmeenglish.com/had-better/` 200 独立专文**，页题逐字「**had better 與 It's time 用法比較：語氣差異＋例句與練習**」，含独立小节 `had better 的用法 ('d better 為常見句中縮寫)`、**`had better vs should`**、`It's time 的用法`，**并附 10 道练习题**。 |
| **② 课程位** | **❌ 无。** BC 三档 **68 课全目逐条复点 0 命中**（本轮实取 A1-A2 18 课／B1-B2 36 课／C1 14 课）；BC 参考层 `Suggestions and obligations`（Level: beginner＋intermediate）正文**无 `had better`**（WebFetch 明证：仅出现在一条用户评论 `You had better do exercise every day to be fit.`）；BC `Modals with 'have'`（Level: intermediate）**无**。**Murphy：批三十记「未核」；本机 TOC 不可达（§7 项 1），历史批次记录中 `had better` 零命中**——**不得据此断言「无位」，只能说「未核实」。** |
| **③ 规则页** | **✅ 有且厚**：Cambridge 独立页（**5 个实 h2 ＋ 4 条 `Not:`**）＋ 剑桥词典独立条目（**A2 标位**）＋ 中文侧独立专文（letmeenglish，**10 题练习**）。 |
| **④ CEFR** | **Cambridge 词典 `A2`**（本轮实取）；**Oxford `had-better` 404**（OALD 无该 headword，两式均试）。 |
| **⑤ 档位** | **B** |
| **⑥ 判定理由** | **「规则页厚、课程位零」＝ B 档标准特征。** 与批三十的线索比对：**批三十记「Cambridge `Had better` 页有独立 h2 `Had better or would rather, would prefer?`」——本轮逐字复核，成立且更全**（是 5 个 h2，不是 1 个）。**不升 A**：无课程位（BC 0；Murphy 未核）。**不给 B＋**：① 中文侧 `english.cool` 404，脚手架要半自造；② **与 L47 `should` 的建议轴正面相撞**（§2.1），存量价值被折价。**不给 B−**：4 条明文 `Not:` 是真增量（`had better to do` ✗ 是中文母语者高频错型），且 A2 标位对零基础线友好。 |

---

### 1.2 `ought to`（应该）——**档位：B−**

| 字段 | 内容 |
|---|---|
| **① 跨源逐字证据** | **Cambridge `Ought to`**（**HTTP 200，title 逐字 `Ought to - Grammar - Cambridge Dictionary`，h1 逐字 `Ought to`**；面包屑 `Grammar > Verbs > Modal verbs and modality > Ought to`）：**实 h2 三个**——`Ought to: form`（h3 `Affirmative`／`Negative`／`Questions`）／`Ought to: uses`（h3 `What is desired or ideal`／`What is likely`）／**`Ought to or should?`**。正文逐字："**Ought to is a semi-modal verb because it is in some ways like a modal verb and in some ways like a main verb.**"／**`Ought to or should?` 节逐字**："**Ought to and should are similar in meaning. Should is more common than ought to. Ought to is more formal than should:**"／对比例逐字 `There ought to be more street lights here. (means the same as There should be more street lights here.)`。**Warning 框逐字**："**The question form of ought to is not very common. It is very formal. We usually use should instead.**"；另一条逐字 "**The negative of ought to is not common. We usually use shouldn't or should not instead:**"。**五条 `Not:` 明文禁用**（逐字）：`Not: Medicine ought to can be free. or Medicine can ought to be free.`／`Not: We don't ought to have ordered so much food.`／`Not: You didn't ought to have said that about his mother.`／`Not: Does she ought to call the police?`／`Not: Do we ought to be more worried about the environment?`。**Cambridge 词典** `OUGHT TO`：**`B1`**（"used to show when it is necessary or would be a good thing…"）＋**`B2`**。**Oxford** `ought to modal verb`（200）：`cefr="b1"`×3 ＋ `b2`。**中文侧** `english.cool/ought-to/` **200 独立专文**，页题逐字「**「ought to」正確用法是？可以說「ought not to」嗎？**」，**4 个 h2**（`ought to 表示「應該」`／`ought to + have p.p. 的用法`／`ought to 的否定句`／`ought to 的疑問句`），**逐字定位**："**其實和 should 的意思有些類似，只是 ought to 的語氣會更強烈、更強調義務性，用起來也會比較正式，所以口語中比較會聽到用 should。**"。 |
| **② 课程位** | **❌ 无。** BC 三档 68 课 **0**；BC 参考层 `Suggestions and obligations` 正文**无 `ought to`**（WebFetch 明证：仅一条用户评论 "Generally, should and ought to express advice rather than obligation."）；BC `Modals: permission and obligation`（B1-B2）**无**（明证："The following terms do not appear anywhere in the provided content: 'had better', 'ought to', 'needn't', 'should', 'be able to'"）。**Murphy：历史批次记录中 `ought to` 零命中**（本轮未核，§7 项 1）。 |
| **③ 规则页** | **✅ 有且结构完整**：Cambridge 独立页（3 实 h2 ＋ 1 Warning ＋ **5 条 `Not:`**）＋ 两个 CEFR 源 ＋ 中文侧独立专文。**注意：独立页里有一个 h2 就是 `Ought to or should?`——上游自己把它做成「与 should 的对比页」。** |
| **④ CEFR** | **Cambridge `B1`（＋B2）／Oxford `b1`（×3）＋`b2`**——**两源一致 B1 为主**。 |
| **⑤ 档位** | **B−** |
| **⑥ 判定理由** | **压到 B− 的唯一理由（也是最硬的一条）：跨源四处都写「它就是 should」。** Cambridge 独立 h2 标题逐字即 `Ought to or should?`，节内逐字 "**similar in meaning**"＋"**means the same as**"；Warning 两条逐字 "**We usually use should instead**"（疑问形与否定形各一条）；中文侧专文逐字 "**其實和 should 的意思有些類似**"；BC 参考层唯一提及是一条评论。**→ 与我方 L47 `should` 同轴，且上游明说「遇到它就用 should 替代」——这是 §2 红线的标准样本。** **不判 D／不做到底**：`Not: You didn't ought to…` 与 `Not: Does she ought to…` 两条禁用是**真增量**（把 ought 当普通动词加 do 支撑是高频错型），且 **CEFR B1 只比 should 高半档**。**→ 认读位（放 `examples`），课量 0**（见 §5）。 |

---

### 1.3 `be able to`（能够）——**档位：B＋**

| 字段 | 内容 |
|---|---|
| **① 跨源逐字证据** | **⚠️ 陷阱：`/grammar/british-grammar/be-able-to` 返回 200，但 title 逐字是 `Be expressions ( be able to, be due to )`——不是独立页。** 该页 **h2 六个**：`Be about to`／**`Be able to`**（h3 `Abilities`／**`Past achievement: could or was/were able to?`**）／`Be due to`／`Be likely to`／`Be meant to`／`Be supposed to`——**六项共页**。`Be able to` 节正文逐字："**Be able to is like can. We use it to talk about abilities. We often use it in places where it is not possible to use can.**"／"**She won't be able to concentrate. Not: She won't can concentrate.**"／"**He should be able to work in a team. Not: He should can work in a team.**"／"**Be able to is a more formal alternative to can:**"；`Past achievement` 节逐字："**We usually use was/were able to, not could to talk about past achievements in affirmative clauses. This is because they are facts, rather than possibilities:**"／`Only one person was able to beat the record. Not: Only one person could beat the record.`／"**We use couldn't or, more formally, wasn't/weren't able to in negative clauses:**"。**BC 独立正课 `Past ability`**（本轮 WebFetch 实取）：**h1 逐字 `Past ability`**，**Level 逐字 `B1 Intermediate`／`B2 Upper intermediate`**；**小节逐字** `General ability`／`Ability on one occasion – successful`／`Ability on one occasion – unsuccessful`；正文逐字 "**Do you know how to use could, was able to and managed to to talk about past abilities?**"／"**we use was/were able to (= had the ability to) and managed to (= succeeded in doing something difficult).**"／"**Could is not usually correct when we're talking about ability at a specific moment in the past.**"／"**Note that wasn't/weren't able to is more formal than couldn't, while didn't manage to emphasises that the thing was difficult to do.**"。**⚠️ BC 参考层 `Ability`（Level: beginner＋intermediate）本轮实取，WebFetch 明证「The page does not contain 'able to', 'manage', or 'be able'」——参考层只收 can/could/could have。** **Cambridge 词典** `ABLE`：**`A2`**（＋`C2`）；**Oxford** `able_1`：`cefr="a2"`（＋`c1`）。**中文侧**：`english.cool/be-able-to` **404**／`/able-to` **404**／`/able` **404**（三式均试）——**中文侧零专文**。 |
| **② 课程位** | **✅ 有（但是 B1-B2 段，跨级）**：**BC 正课 `Past ability`**（B1／B2）＋ **Murphy 中级 U26 `can, could and (be) able to`**（按批十九／批二十既有记录逐字，本轮未核）。**BC 参考层（beginner 段）不收它**——课程位整体压在 B1 以上。 |
| **③ 规则页** | **✅ 有但共页**：Cambridge 六项一页（`Be able to` 是其中一个 h2 ＋ 一个 h3）；中文侧 **0**。 |
| **④ CEFR** | **Cambridge `A2`／Oxford `a2`——两源一致 A2**（`able` 形容词本身），**但语法课程位在 B1-B2**。 |
| **⑤ 档位** | **B＋** |
| **⑥ 判定理由** | **「有课程位但跨级 ＋ 规则页共页 ＋ 中文侧零」——课程位是真的（BC 正课），但压不到零基础线。** 给到 B＋ 而非 A 的理由：① 课程位 **B1-B2**（我方零基础线在 A1-A2 段）；② `able` 我方 **GL 词边界 0**（substring 43 全是 `table`／`uncountable`）→ **真造词**；③ **BC 参考层（beginner）明文不收 `able to`**，说明上游自己认为它在 beginner 之上。**给到 B＋ 而非 B 的理由**：**两条 `Not:` 是真格位增量**（`won't can` ✗ ／ `should can` ✗ —— 我方 L14 教 can 时给的正是「情态动词不叠加」，这里是同一纪律的反向应用），**且 `was able to` vs `could` 的「单次成功 vs 一般能力」分工是跨源独立小节（BC 与 Cambridge 双源同切）**。 |

---

### 1.4 `need to`（需要）——**档位：B＋（本批最高）**

| 字段 | 内容 |
|---|---|
| **① 跨源逐字证据** | **Cambridge `Need`**（**HTTP 200，title 逐字 `Need - Grammar - Cambridge Dictionary`，h1 逐字 `Need`**；面包屑 `Grammar > Verbs > Modal verbs and modality > Need`）：**实 h2 三个 ＋ 实 h3 七个**——`Need: form`（h3 `Affirmative form`／`Negative form`／`Question form`）／`Need: use`（h3 `No obligation (needn't)`／`No obligation in the past`／`Unnecessary events`）／**`Semi-modal need and main verb need`**（h3 `Typical error`）。正文逐字："**Need is a semi-modal verb because in some ways it is like a modal verb and in other ways like a main verb.**"／"**We use need mostly in the negative form to indicate that there is no obligation or necessity to do something:**"／`You needn't take off your shoes.`／"**Main verb need is followed by to and it changes with person, number and tense (I, you, we, they need to; she, he, it needs to; I, you, she, he, it, we, they needed to).**"／**对照表下逐字** "**In these examples, the meaning is the same for semi-modal need and main verb need + to.**"；**两条 Warning 逐字**："**We must use the main verb need when it is followed by a noun phrase or -ing clause:**"（`Not: You needn't an umbrella.`／`Not: My hair needn't cutting for at least another month.`）＋ "**We don't use don't/doesn't/didn't with the semi-modal verb need:**"；**Typical error 逐字**："**The main verb need is followed by to when used with another verb. I need to have my hair cut. Not: I need have my hair cut.**"（**共 7 条 `Not:`**）。**BC 参考层 `Suggestions and obligations`**（**Level: beginner ＋ intermediate**，本轮实取）：**逐字** "**We use must or need to to say that it is necessary to do something:**"／`You must stop at a red light.`／**`Everyone needs to bring something to eat.`**／"**We use had to (positive) and couldn't (negative) if we are talking about the past:**"。**中文侧 `english.cool/need/` 200 独立专文**，页题逐字「**「need」正確用法是？加 to 還是 ing?（含例句）**」，**两个主 h2**：`need to 的用法`／**`need Ving 的用法`**；**逐字**："**need to 表示「需要去做某件事」，主詞一般是人，有主動的意味。**"／"**但如果在 need 後面接的是動名詞 Ving，反而是表示被動的意思……也就是「某件事需要被完成」**"／**等式逐字** `Her room needs cleaning. = Her room needs to be cleaned. = She needs to clean her room.`（**并附 5 道小試身手**）。**Cambridge 词典** `NEED`：**`A1`×2 ＋ `A2` ＋ `B1` ＋ `B2`×4**——**词根标位是全批最低的**。 |
| **② 课程位** | **✅ 有（本批最实的一处）**：**BC 参考层 `Suggestions and obligations`（beginner 段）明文把 `need to` 与 `must` 并列成规则句**——**这是 beginner 段的课程位**；**BC B1-B2 正课 `Modals: permission and obligation` 另有独立小节 `No obligation / don't have to`**（该课小节逐字：`Permission / can / could / may`／`Prohibition / can't / must not/mustn't`／`Obligation / have to / must`／**`No obligation / don't have to`**；**逐字** "**You don't have to wear a tie in our office but some people like to dress more formally.**"／"**We use must not to talk about what is not permitted.**"）。**Murphy：中级 U57（try, need, help）／U56 — 按批十五／批十六既有记录，本轮未核。** |
| **③ 规则页** | **✅ 有且厚**：Cambridge 独立页（**3 h2 ＋ 7 h3 ＋ 2 Warning ＋ 7 条 `Not:`**）＋ 中文侧独立专文（**两义对举＋5 题**）＋ BC 两处（参考层规则句＋B1-B2 课小节）＋ **CEFR 最低（A1）**。 |
| **④ CEFR** | **Cambridge 词典 `A1`（首义）**／`need to` 结构本身无独立标位；**BC 参考层标 `beginner`**——**两源一致最低档**。 |
| **⑤ 档位** | **B＋（本批最高；未升 A 的唯一原因是 §2.3 的 L16 撞车）** |
| **⑥ 判定理由** | **四源齐备是 11 项里唯一的**：① **独立规则页厚**（Cambridge 7 条 `Not:` 是全批最多）；② **课程位在 beginner 段**（BC 参考层规则句）；③ **CEFR A1**（对零基础线最友好）；④ **中文侧独立专文且给了一个我方零覆盖的真增量**（`need Ving` 表被动：`Your car needs fixing.`）。**不升 A 的唯一一条**：**否定轴「不用」我方 L16 已经教过**（L16 逐字 "must not 是「禁止」，don't have to 是「不用、没必要」"）——**`needn't` 与 `don't have to` 在上游是同一个格位**（Cambridge 对照表逐字 "the meaning is the same"），**撞车（§2.3）**。 |

---

### 1.5 `dare`（敢）——**档位：C**

| 字段 | 内容 |
|---|---|
| **① 跨源逐字证据** | **Cambridge `Dare`**（**HTTP 200，title 逐字 `Dare - Grammar - Cambridge Dictionary`，h1 逐字 `Dare`**；面包屑 `Grammar > Verbs > Modal verbs and modality > Dare`）：h2 三个（其中一个是把整张对照表塞进标题的畸形标题）。正文逐字："**Dare is both a main verb and a semi-modal verb.**"／"**Dare can mean 'challenge somebody'. With this meaning, it is a main verb and requires an object. Any verb that follows it is in the to-infinitive:**"／"**Dare also means 'to be brave enough or rude enough to do something'. With this meaning, it can be used as an ordinary main verb which can be followed by a to-infinitive or an infinitive without to. Less commonly, it can be used as a semi-modal verb followed by an infinitive without to.**"；**唯一一条 `Not:` 逐字**："**We don't use infinitive with to after semi-modal dare in the expression How dare you:**"（`How dare you suggest she was lazy!`／`Not: How dare you to suggest…`）。**Cambridge 词典** `DARE`：**`B2`**（"to be brave enough to do something difficult or dangerous…"）＋**`C1`**（"to ask someone to do something that involves risk"）。**Oxford** `dare_1`（200）：`cefr="b2"` ＋ `c1` ＋ `c2`×2。**中文侧**：`english.cool/dare/` **404**（本轮实测）；`letmeenglish.com/dare/` **404**。**BC：三档 68 课 0；`Suggestions and obligations` 明证 "No instances of 'dare' appear"；`Modals with 'have'` 明证 "dare / semi-modal: No sentences containing these terms appear"。** |
| **② 课程位** | **❌ 无。** BC 三档 0 ／ BC 参考层 0 ／ **Murphy 历史记录 0**（本轮未核）。 |
| **③ 规则页** | **⚠️ 有但是「边缘态」**：Cambridge 独立页存在（1 条 `Not:`，**无 Warning 框**）——**但它的正文自己说半情态用法是 "Less commonly"**。 |
| **④ CEFR** | **Cambridge `B2`（首义）／Oxford `b2`**——**两源一致 B2，比本批其他项高一整档**。 |
| **⑤ 档位** | **C** |
| **⑥ 判定理由** | **「有独立页但跨源自己降级 ＋ 中文侧零 ＋ CEFR B2」→ C。** 三条：① **上游逐字 "Less commonly"**——半情态 `dare` 在跨源眼里是边缘用法；② **中文侧两站 404**（脚手架 100% 自造）；③ **CEFR 两源一致 B2**，对零基础线是跨两档。**唯一可能的价值点是 `How dare you`**（跨源唯一明文禁用所在），**但那是感叹语块、不是语法结构**，且「敢」这个语义在「小美的一天」叙事里几乎无处安放（我方 `dare` GL 0／HC 0）。**→ 不做。** |

---

### 1.6 `even if`（即使）——**档位：B**

| 字段 | 内容 |
|---|---|
| **① 跨源逐字证据** | **⚠️ 陷阱：`/grammar/british-grammar/even-if` 返回 200，但 title 逐字是 `If - Grammar - Cambridge Dictionary`——不是独立页。** `If` 页（面包屑 `Grammar > Words, sentences and clauses > Conjunctions and linking words > If`）**h2 六个**：`If: conditions`／`If possible, if necessary`／`If so, if not`／**`Even if`**／`If: reporting questions`／`If and politeness`。`Even if` 节**全文逐字**（该节极短，仅两句）："**We can use even if to mean if when talking about surprising or extreme situations:**"／"**You're still going to be cold even if you put on two or three jumpers.**"。**Cambridge `Even` 页**（title 逐字 `Even - Grammar - Cambridge Dictionary`，面包屑 `Grammar > Adjectives and adverbs > Using adjectives and adverbs > Even`，**h2 五个**：`Even: position`／`Even and comparatives`／`Even and also`／**`Even though and even if`**／`Even so`）——该节逐字："**We can use even with though and if.**"／"**We use even before if to refer to a possible unexpected or extreme event:**"／`I'm still going to go swimming in the sea even if it rains. (I don't expect rain but it is possible.)`／`I've got to get home even if it means flying the plane myself.`。**⚠️ 本轮实测：`/grammar/british-grammar/even-though-and-even-if` 返回 200，但 title 是 `Even - Grammar - Cambridge Dictionary`——即该 slug 是 `Even` 页的别名，不是独立对比页。** **Cambridge 词典** `EVEN IF`：**独立 headword ＋ `B2` 标位**，定义逐字 "**used to say that if something is the case or not, the result is the same:**"，6 条例句（`Even if you take a taxi, you'll still miss your train.` 等）。**BC `verbs-time-clauses-if-clauses`**（**Level: beginner（talking about the future 节）／intermediate（making hypotheses 节）**）：逐字 "**In conditional clauses with words like if, unless, even if, we often use present tense forms to talk about the future:**"／`Even if Barcelona lose tomorrow, they will still be champions.`／**❌ 对比例逐字** `Even if Barcelona will lose tomorrow, they will still be champions. (incorrect)`——**⚠️ BC 该页无独立小节**。**中文侧**：`english.cool/even-if/` **404**；**但 `english.cool/even-though/` 200 独立专文**，页题逐字「**Even though 跟 Even if 的用法差在哪？來搞懂！**」，**内含 `even if 的用法與例句` 独立 h2 ＋ `even if 和 even though 可以用 even 代替嗎？` h3 ＋ 5 道小試身手**；**逐字定位**："**even if 在中文裡可以解釋成「即使、就算、儘管、縱使、即便」……它用來表達「假設」，也就是不真實或想像的情況**"。 |
| **② 课程位** | **❌ 无。** BC 三档 68 课 **0**；BC 参考页只有一句列举。**Murphy：中级 U113 标题逐字 `113althoughthougheventhoughinspiteofdespite` 含 `even though` 但不含 `even if`**（批二十五／批二十七既有记录）。 |
| **③ 规则页** | **⚠️ 半有——无独立语法页，但有「词典级独立条目」**：`EVEN IF` 在 Cambridge 词典是**独立 headword**（本批仅 4 项有此待遇：`had better`／`ought to`／`even if`／`as though`／`provided`——共 5 项）＋ Cambridge 两处 h2 小节 ＋ 中文侧专文的**半篇**（与 even though 对举）。 |
| **④ CEFR** | **Cambridge 词典 `B2`**（本轮实取）。 |
| **⑤ 档位** | **B** |
| **⑥ 判定理由** | **B 而非 B＋**：① **无独立语法页**（两处都是 h2 小节，本项目口径「h2 小节 ≠ 课程位」）；② **BC 无独立小节**；③ **中文侧无独立专文**（只在对举篇里占一半）。**B 而非 B−**：① **词典级独立条目 ＋ B2 标位**；② **语义增量是真的**——跨源逐字 "**to mean if when talking about surprising or extreme situations**"，**「即使」不是「如果」的换词**，是「条件成立与否都不改变结果」的新逻辑；③ **中文侧给了两条真 ❌**（`I wouldn't date Sam even he were handsome and muscular. ❌`／`Even I've polished and cleaned the vase, it still looks old. ❌`，逐字解释 "**even 單獨出現的時候，不具有連接詞的功能**"）。**⚠️ 红线：与 L48 `if` 同壳（§2.4）。** |

---

### 1.7 `as long as`（只要）——**档位：B**

| 字段 | 内容 |
|---|---|
| **① 跨源逐字证据** | **Cambridge `As long as and so long as`**（**HTTP 200，title 逐字 `As long as and so long as - Grammar - Cambridge Dictionary`，h1 逐字 `As long as and so long as`**；面包屑 `Grammar > Words, sentences and clauses > Conjunctions and linking words > As long as and so long as`，**h2 三个 ＋ h3 两个**）：逐字 "**As long as and so long as are conjunctions.**"／"**We use as long as to refer to the intended duration of a plan or idea, most commonly referring to the future. We always use the present simple to refer to the future after as long as:**"／`We are very happy for you to stay at our house as long as you like.`／`I'll remember that film as long as I live.`／**`Not: … as long as I will live.`**／"**As long as or so long as also means 'provided that', 'providing that' or 'on condition that':**"／`You are allowed to go as long as you let us know when you arrive.`／"**So long as is a little more informal:**"。**Cambridge `Conditionals: other expressions (unless, should, as long as)`** 页（**h2 七个**，含 `Unless`／`Should you (Should with inversion)`／`Had you (Had with inversion)`／`If + were to`／**`As long as, so long as, providing, etc.`**／`Or and otherwise`／`Supposing`）——该节逐字："**Sometimes we need to impose specific conditions or set limits on a situation. In these cases, conditional clauses can begin with phrases such as as long as, so long as, only if, on condition that, providing (that), provided (that).**"／"**As long as is more common in speaking; so long as and on condition that are more formal and more common in writing:**"。**BC `conditionals-zero-first-second`**（B1／B2）：逐字 "**It is also common to use this structure with unless, as long as, as soon as or in case instead of if.**"／`You can go to the party, as long as you're back by midnight.`——**无独立小节**。**中文侧 `english.cool/as-long-as/` 200 独立专文**，页题逐字「**來搞懂 as long as、as soon as、as far as 的用法！(含例句）**」，**独立 h2 `1. as long as 只要…`**；**逐字**："**as long as 指的是如果 A 事件發生了，那麼 B 事件就能夠實現，是條件句的一種。**"／"as long as 作為連接詞來連接兩個句子，可以放在句首或句中，代換成 so long as 也是一樣的意思"；4 条例句（`You can go out as long as you finish your homework.` 等）。**⚠️ Cambridge 词典 `AS LONG AS` 本轮实取：定义逐字 `if:`，但 CEFR 标位字段为空（无 A1-C2 badge）。** |
| **② 课程位** | **⚠️ 半有（三词共用一格）**：**Murphy 中级 U115 标题逐字 `115unlessaslongasprovided`**（批二十四／批二十五／批二十七既有记录，本轮未核）。**BC：仅一句列举，无独立小节；BC 三档 68 课 0。** |
| **③ 规则页** | **✅ 有**：Cambridge 独立页（3 实 h2 ＋ 2 h3 ＋ 1 条 `Not:`）＋ 第二页独立小节 ＋ 中文侧独立专文。 |
| **④ CEFR** | **Cambridge 词典无标位**（本轮实测 badge 空）；**Cambridge 语法页无标位**；**BC 落点是 B1／B2 课内列举**——**取 B1 为参考，但无硬标位**。 |
| **⑤ 档位** | **B** |
| **⑥ 判定理由** | **「独立规则页 ＋ 独立中文专文 ＋ Murphy 三词共用格」→ B。不升 B＋／A**：① **课程位是三词共用一格，不是单点课位**（沿用批二十五对 `unless` 的口径："课程位强 ≠ 档位 A"）；② **CEFR 标位缺失**（词典与语法页都无 badge，无法做零基础定位）；③ **中文专文把 `as long as` 与 `as soon as` 同篇并列**，而我方 **L142 已教 `as soon as`**（逐字 `一到就做 · as soon as + 小句子`）——**同篇对举意味着学生的混淆面已经存在，这是加分项，但也说明它必须与 L142 同轴处理**。**⚠️ 红线：与 L48/L142 共享 `❌will` 纪律（§2.5）。** |

---

### 1.8 `provided`（假如）——**档位：C**

| 字段 | 内容 |
|---|---|
| **① 跨源逐字证据** | **⚠️ 本轮实测：`/grammar/british-grammar/provided` → HTTP 302，Location 逐字 `https://dictionary.cambridge.org/grammar/british-grammar/`（回语法总入口）——即该页不存在。** 它的**唯一语法落点是列举句**（`Conditionals: other expressions` 页内 h2 `As long as, so long as, providing, etc.` 逐字）："**conditional clauses can begin with phrases such as as long as, so long as, only if, on condition that, providing (that), provided (that).**"／"**Providing (that) is more common in speaking; provided (that) is more formal and more common in written language:**"／`They may do whatever they like provided that it is within the law.`——**一句话里并列六个同义说法。** **Cambridge 词典** `PROVIDED`：**`B2`**，定义逐字 "**if, or only if:**"，例 `Provided she commits no offences over the next five years, her conviction will be wiped from her record.`／`He's welcome to come along, provided that he behaves himself.`（**注意：`provided` 的词典 def 字段还并列了一条 `past simple and past participle of provide`——同形词干扰**）。**Oxford** `provided conjunction`（200）：`cefr="b2"`。**BC `conditionals-zero-first-second` 本轮实取，明证 "No sentences with 'provided' or 'otherwise' appear in the provided content"。** **中文侧**：`english.cool/provided/` **404**、`/providing/` **404**、`/provided-that/` **404**；`letmeenglish.com/provided/` **404**——**四式全部为零**。 |
| **② 课程位** | **❌ 无（唯一落点是 U115 第三词）**：**Murphy 中级 U115 `115unlessaslongasprovided`**（既有记录）——**三词共用，且它是第三位、不是标题词首**。**BC 0；词典无独立语法页。** |
| **③ 规则页** | **❌ 无。** 无独立语法页（302 回总入口）＋ BC 0 ＋ 中文侧 404×4。**只有词典条目（B2）。** |
| **④ CEFR** | **Cambridge `B2`／Oxford `b2`**——两源一致 B2。 |
| **⑤ 档位** | **C** |
| **⑥ 判定理由** | **「无规则页 ＋ 中文侧零 ×4 ＋ CEFR B2 ＋ 只出现在六词并列列举句里」→ C。** 这与批二十七的结论**一致，本轮逐条复核成立**（批二十七原文："`provided` 跨源无独立规则页"）。**唯一可考虑的是「词典级条目的 `if, or only if` 两条定义」**——但 `only if` 我方也零、BC 也零，**做 `provided` 会连带拖出 `only if`／`on condition that`／`providing` 一串同义词**（上游逐字一句话列六个），**词位直接破线**。**→ 不做。** |

---

### 1.9 `as if`（好像）——**档位：B**

| 字段 | 内容 |
|---|---|
| **① 跨源逐字证据** | **Cambridge `As if and as though`**（**HTTP 200，title 逐字 `As if and as though - Grammar - Cambridge Dictionary`，h1 逐字 `As if and as though`**；`/grammar/british-grammar/as-if` 与 `/as-though` 两个 slug **都 200 且都指向同一页**）：**h2 只有 2 个（其中一个是空标题占位），即整页是一段连续正文、无实小节**。全文逐字："**As if and as though are conjunctions.**"／"**We use as if and as though to make comparisons. They have a similar meaning.**"／"**We use as if and as though to talk about an imaginary situation or a situation that may not be true but that is likely or possible. As if is more common than as though:**"／`The floods were rising and it was as if it was the end of the world.`／`It looks as if they've had a shock.`／`It looks as though you've not met before.`／"**We can use both as if and as though followed by a non-finite clause or a prepositional phrase:**"／"**As if and as though commonly follow the verbs feel and look:**"／"**In informal English, like can be used in a similar way to as if, though it is not always considered correct in formal contexts:**"——**全页无 `Not:`、无 Warning 框**。**BC `Unreal time`（本批唯一的 C1 落点）**：page h1 逐字 `Unreal time`，**Language level 逐字 `C1 Advanced`**，**小节逐字** `Wish and if only`（h3 `The present`／`The past`／`The future`）／`It's (high) time`／**`As if/as though`**／`Would rather`；该节逐字 "**We can use as if and as though to talk about how a situation appears or seems.**"／"**As if is more common than as though.**"／"**When we follow as if/as though with an unreal tense, we are saying we don't think the statement is really true.**"／`Some people behave as if their actions had no consequences.`／`It was as though she hadn't heard me.`。**⚠️ Cambridge 词典陷阱**：`/dictionary/english/as-if` 返回的是 **`AS IF!`（感叹条目）**——定义逐字 "said to show that you do not believe something is possible:"，**用途是反讽感叹，不是目标义（好像）**；`AS THOUGH` 才是目标义，**`B2`**，定义逐字 "**as if:**"。**中文侧**：`english.cool/as-if/` **404**、`/as-though/` **404**。 |
| **② 课程位** | **❌ 无（唯一落点是 C1 共表课的小节）**：**BC 三档 68 课 0 专课**（C1 的 `Unreal time` 是四项共表课）；**Murphy 中级 U118 标题逐字 `118 like as if`**（批十八／批十九／批二十四既有记录）——**与 `like` 共用一格**。 |
| **③ 规则页** | **⚠️ 有但是「薄页」**：Cambridge 独立页存在（**标题是两者并列**），**但 h2 实为 0、无一条 `Not:`、无 Warning**——**全页 6 句正文**。 |
| **④ CEFR** | **`as though` 词典 `B2`**；**`as if` 无目标义标位**（只有感叹条目）；**BC 课程位落 `C1 Advanced`**——**三源分裂，且最高落点 C1**。 |
| **⑤ 档位** | **B** |
| **⑥ 判定理由** | **B 而非 B＋**：① **规则页薄**（无小节、无禁用、6 句）；② **BC 落点在 C1**（跨三档）；③ **中文侧零**；④ **Murphy 与 `like` 共用一格**。**B 而非 B−／不做**：① **语义增量是真的**——BC 逐字 "**talk about how a situation appears or seems**" ＋ "**with an unreal tense, we are saying we don't think the statement is really true**"（**虚拟语气层，我方零覆盖**）；② 有独立页（虽薄）。**⚠️ 最硬的一条红线：与 L159 抢动词位**——跨源逐字 "**As if and as though commonly follow the verbs feel and look**"，而我方 **L159 刚教 `It looks like a boat.`（look 位）**、**L160 教 `He seems to know you.`（seem 位）**。**→ §2.6 详述，课量须等 L159/L160 复现头寸落定后才定。** |

---

### 1.10 `as though`（好像）——**档位：B−／课量 0**

| 字段 | 内容 |
|---|---|
| **① 跨源逐字证据** | **与 `as if` 完全同页**（Cambridge 页题逐字就是 `As if and as though`）。**四处逐字都写「两词同义」**：① Cambridge 语法页正文 "**They have a similar meaning.**"＋"**As if is more common than as though:**"；② Cambridge 词典 `AS THOUGH` 定义**只有两个字**："**as if:**"；③ **BC `Unreal time` 逐字** "**As if is more common than as though.**"；④ 例句层面**两词在 Cambridge 同页互换出现**（`It looks as if they've had a shock.` 对 `It looks as though you've not met before.`／`She felt as if all her worries had gone.` 对 `They felt as though they had been given the wrong information.`）——**同一句法位置、同一动词位（look／feel）、只换词**。 |
| **② 课程位** | **❌ 无**（同 `as if`：BC 0 专课；Murphy U118 与 `like` 共用一格）。 |
| **③ 规则页** | **⚠️ 无独立规则页**——**它的「规则页」就是 `as if` 的页**，页题即两者并列。 |
| **④ CEFR** | **Cambridge 词典 `B2`**（= "as if"）；**BC 落点 C1**。 |
| **⑤ 档位** | **B−（课量 0）** |
| **⑥ 判定理由** | **纯同义换词，红线标准样本。** 与批二十五 `though` 对 `although` **完全同型**（那里的判词是：上游明说它就是 `although`（BC 逐字 "in the same way as"）→ 判 C、认读位不立岗）。**本项的跨源证据更薄一档**：`though` 至少有 Murphy U113 的并列词位与中文侧专文；**`as though` 连中文侧专文都没有（404）、连独立词典义项都只是 "as if:" 二字**。**→ 判 B−，处置＝认读位**（放 `examples`，不设考点），**与我方 L127 `:24367` 认读惯例一致**。 |

---

### 1.11 `so that`（为了／以便）——**档位：B**

| 字段 | 内容 |
|---|---|
| **① 跨源逐字证据** | **Cambridge `So that or in order that ?`**（**HTTP 200，title 逐字 `So that or in order that ? - Grammar - Cambridge Dictionary`，h1 逐字 `So that or in order that ?`**；**⚠️ 面包屑逐字 `Grammar > Easily confused words > So that or in order that?`——它挂在「易混词」大类，不是 `Verbs`／`Conjunctions`**）：**全页无 `Not:`、无 Warning 框**，正文 4 段逐字："**We use so that and in order that to talk about purpose. We often use them with modal verbs (can, would, will, etc.). So that is far more common than in order that, and in order that is more formal:**"／`I'll go by car so that I can take more luggage.`／`We left a message with his neighbour so that he would know we'd called.`／"**We often leave out that after so in informal situations:**"／"**When referring to the future, we can use the present simple or will/'ll after so that. We usually use the present simple after in order that to talk about the future:**"／"**So that (but not in order that) can also mean 'with the result that':**"／`The birds return every year around March, so that April is a good time to see them.`。**Cambridge 另有两个落点**：① **`In order to` 独立页**（title 逐字 `In order to - Grammar - Cambridge Dictionary`，面包屑 `Grammar > Words, sentences and clauses > Conjunctions and linking words > In order to`）逐字 "**In order to is a subordinating conjunction.**"／"**We use in order to with an infinitive form of a verb to express the purpose of something.**"／"**The negative of in order to is in order not to:**"；② **`So` 词典条目内嵌交叉引用块**（本轮实测 `so that` 在 `dict_so.html` 中仅出现 1 次，正是这个 See-also 段）。**BC 有两处 purpose 层**：① **A1-A2 正课 `Infinitive of purpose`**（h1 逐字 `Infinitive of purpose`，**Level 逐字 `A1 Elementary`／`A2 Pre-intermediate`**）逐字 "**When we want to answer the question why?, we can use an infinitive of purpose.**"；② **BC 参考层 `'to'-infinitives`**（Level: beginner／intermediate／advanced）逐字 "**We also use the to-infinitive to express purpose (to answer why?):**"／"**We can also express purpose with in order to and in order not to:**"／"**or so as to and so as not to:**"。**⚠️ 本轮实取明证：BC `'to'-infinitives` 页全页 `so that` ＝ 0（"No instances of 'so that' appear in the content"）——BC 全站不收 `so that`。** **中文侧 `english.cool/so-that/` 200 独立专文**，页题逐字「**「so that、in order that」正確用法是？來搞懂！**」，**两个主 h2**：`一、so that 的用法`／`二、in order that 的用法`；**逐字**："**so that / in order that 都是用來接表達 目的、理由 的句子，而且常搭配情態助動詞，如 can、could、will、would 等**"／"**so that 的曝光率較高，in order that 則較為正式**"；**并给出 `so` 省略 that 后与结果义 `so` 的分辨法**："**從 so 後面句子的意思來判斷即可**"＋对比例 `He sold his car so he could buy the apartment.`（目的）对 `He sold his car, so he goes to work by bus.`（结果）；**另有 `english.cool/in-order-to/` 200 独立专文**（「「in order to」的正確用法是？放句首？來看例句搞懂！」），逐字 "**in order to 就跟 表目的 時的 to 用法是一樣的！差別在於用 in order to，感覺會比單用 to 來得正式一點。**"＋两条明文 ❌（`in order to not be late` ❌ → 正解 `in order not to be late`）。**Cambridge 词典**：`so-that` **302（无独立条目）**；**`IN ORDER TO DO SOMETHING` 200 独立条目**（无 CEFR badge）。 |
| **② 课程位** | **✅ 有（但是 `in order to` 的位，不是 `so that` 的位）**：**BC A1-A2 正课 `Infinitive of purpose`**（A1／A2 段）＋ **Murphy 中级 U64 标题逐字 `64 to…, for… and so that…`**（批二十／批二十一既有记录，本轮未核）——**U64 是三词共用一格（to…／for…／so that）**。 |
| **③ 规则页** | **⚠️ 有但是「易混对页」**：Cambridge `So that or in order that?` 独立页存在，但**挂在 Easily confused words 下、无一条禁用、正文 4 段**——**它不是 `so that` 的完整规则页，是「二选一」页**；补强件是 `In order to` 独立页（但那讲的是 `in order to`）＋ 中文侧两篇独立专文（`so-that` 与 `in-order-to`，**前者是目的义的主篇**）。 |
| **④ CEFR** | **无标位**（`so that` 词典 302、`in order to` 条目无 badge、语法页无 badge）；**BC 的 purpose 落点是 `A1 Elementary／A2 Pre-intermediate`**（但那一课教的是 `to`-infinitive，不是 `so that`）。 |
| **⑤ 档位** | **B** |
| **⑥ 判定理由** | **B 而非 B＋**：① **课程位是 `to`-infinitive of purpose 的位**（BC 正课 h1 逐字 `Infinitive of purpose`），**`so that` 挤不进去**；② **BC 全站不收 `so that`**（明证 0 命中）；③ **Cambridge 页是「易混对页」且无禁用**。**B 而非 B−／不做**：① **有独立页 ＋ 中文侧独立专文 ＋ Murphy U64 三词格**；② **真增量两条**（见 ⑥ 下方）；③ **我方目的义 `so that` 实测真零**——`so that` GL 1 的那**唯一 1 处是 L102 `So that was last night!`（`:19420`），是「结果义 so + that」的指示用法，不是目的义连词**。**⚠️ 红线：与 L44 同语义场**（我方 **L44 逐字 `小垫板新用法 · to + 去做什么`，target `I go to the shop to buy milk.`**）——**跨源逐字 "We also use the to-infinitive to express purpose" 证明 `so that` 与 L44 抢同一个「目的」位**（§2.7）。 |

---

## §2 「与已教内容的重叠」甄别（本项目核心红线）

**判定口径**：对每个候选，判定它是**教新结构**还是**已教内容的同义换词／扩展**。**判据一律取跨源逐字**（不看我的语感）。**若只是同义表达，档位必须下调甚至判不做。**

**我方已教基线（本轮本机复算，行号逐条核过）**：

| 已教 | 课 | 我方逐字 | 行号 |
|---|---|---|---|
| `can` | **L14** | `grammarLabel: "能 · can"` | `:2569` |
| `must` / `have to` | **L16** | `grammarLabel: "必须 · must / have to"`；课内逐字 "**must not 是「禁止」，don't have to 是「不用、没必要」**" | `:2944`，`:3023` |
| `because` / `so` | **L20** | `grammarLabel: "连词 · because / so"` | — |
| 目的 `to` | **L44** | `grammarLabel: "小垫板新用法 · to + 去做什么"`；`targetSentence: "I go to the shop to buy milk."`；逐字 "**去做什么再垫一块 to（说明目的）**" | `:8175`，`:8189` |
| `should` | **L47** | `grammarLabel: "情态三兄弟 · should"`；**⚠️ 注意：L47 不含 ❌will 纪律**（§7.4 校正） | `:8739` |
| `if` 真实条件 | **L48** | `grammarLabel: "条件句 · if 里说现在"`；逐字 "**if 里不用 will，「如果的路面用现在时铺」**"（**❌will 纪律的原始出处**） | `:8926`，`:8940` |
| `if` + 建议收口 | **L49** | `grammarLabel: "收口 · 建议 + 条件"` | `:9119` |
| `until` | **L109** | `grammarLabel: "等到…为止 · until + 小句子"`；逐字 "**后面别请 will**" | `:20741`，`:20822` |
| `although` | **L139–L141** | `grammarLabel: "虽然 · although 站最前面"` 等三课 | — |
| `as soon as` | **L142–L144** | `grammarLabel: "一到就做 · as soon as + 小句子"`；逐字 "**这跟第 48 课一个规矩：if 里说现在，不用 will**" | `:27290`，`:27320` |
| `look + like` | **L159** | `grammarLabel: "看起来像 · look 后面跟 like"`；`targetSentence: "It looks like a boat."` | `:30622` |
| `seem + to` | **L160** | `grammarLabel: "好像 · seem 后面跟 to"`；`targetSentence: "He seems to know you."` | `:30817` |

### 2.1 `had better` —— 🟡 **半新结构（新词形、旧语义轴）**

- **新的一面（可教）**：跨源逐字 "**The verb form is always had, not have.**"＋"**It is followed by the infinitive without to:**"＋`Not: I'd better to go now.`——**这是一个全新的句法壳**：`had` 不变形 ＋ **后接不带 `to` 的原形**（与我方 L62 `would like to` 的「垫 to」正好相反）。
- **撞车的一面（折价）**：**它的语义轴是「建议」，与 L47 `should` 同一轴。** 跨源两处逐字自证：① `Had better: negative and question forms` 节 "**This means the same as should, but is more formal**"；② 词典定义 "**used to give advice**"（`You'd better (= you should) go home now…`——**词典直接在括号里写 `= you should`**）。
- **→ 判定：半新结构。** **课量必须封顶**（§5）：**它的「建议」语义我方 L47 已付过账，能教的只有「壳」和「轻重」两件事。**
- **跨源给的最近邻是 `would rather`／`would prefer`**（h2 节逐字 `Had better or would rather, would prefer?`）——批三十已据此外推过轴 C，**本轮确认该 h2 存在**。

### 2.2 `ought to` —— 🔴 **同义换词（红线触发，课量 0）**

- **跨源四处一致：它就是 `should`。** ① Cambridge 独立 h2 标题逐字 **`Ought to or should?`**；② 该节逐字 "**Ought to and should are similar in meaning. Should is more common than ought to. Ought to is more formal than should:**"＋对比例 "**means the same as There should be more street lights here.**"；③ **两条 Warning 逐字** "**We usually use should instead**"（否定形与疑问形各一条）；④ 中文侧专文逐字 "**其實和 should 的意思有些類似，只是 ought to 的語氣會更強烈……所以口語中比較會聽到用 should。**"
- **我方状态**：**L47 已教 `should` 的建议轴**（`:8739` 逐字 `情态三兄弟 · should`）。
- **→ 判定：同义换词。** **档位由 B 下调为 B−（§1.2），课量 0。** **保留的唯一价值**＝两条 `Not:` 明文禁用（`didn't ought to` ✗／`Does she ought to` ✗），**只能作认读位**。
- ⚠️ **注意与批二十五 `though` 案的对称性**：那里的判词是「上游明说它就是 `although`」→ 判 C。**`ought to` 的证据强度介于 `though` 与独立结构之间**——`though` 是 C（MC 连专文都没有）、`ought to` 有独立页＋独立专文（故给 B− 而非 C），**但两者的红线判定性质相同：都是同义换词。**

### 2.3 `need to` —— 🟡 **半新结构（新词位、旧「不用」轴）**

- **新的一面（可教，且是本批最值钱的一条）**：**`need Ving` 表被动**——中文侧逐字 "**但如果在 need 後面接的是動名詞 Ving，反而是表示被動的意思……也就是「某件事需要被完成」**"＋等式 `Her room needs cleaning. = Her room needs to be cleaned. = She needs to clean her room.`；**这是我方完全零覆盖的语义层**（`need` GL 3／`needs` 0／`needed` 0；`purpose` 0）。另：Cambridge 逐字 "**Main verb need is followed by to and it changes with person, number and tense**"——**第三人称 `needs to` 的变化**（我方 L16 `must`／`have to` 教的是「must 不变形／have to 要变形」的对照，`needs to` 是第三条）。
- **撞车的一面（折价）**：**否定轴「不用」我方 L16 已教。** L16 逐字 "**must not 是「禁止」，don't have to 是「不用、没必要」**"；**而 Cambridge 把 `needn't` 与 `don't need to` 写成同义**——逐字 "**In these examples, the meaning is the same for semi-modal need and main verb need + to.**"（对照表正例 `You needn't mention this to your father.` 对 `You don't need to mention this to your father.`）。
- **→ 判定：半新结构。** **新的是词位（`need` 这个词本身零）＋`need Ving` 的被动义；旧的是否定轴。** **课量建议 2 课封顶**（§5）。

### 2.4 `even if` —— 🟡 **半新结构（新逻辑、旧连词壳）**

- **新的一面**：跨源逐字 "**We can use even if to mean if when talking about surprising or extreme situations**"——**「条件成立与否都不改变结果」是新的逻辑层**，与 L48 教的「条件成立才发生」不同。中文侧给的 **❌ 更硬**：`I wouldn't date Sam even he were handsome and muscular. ❌`（逐字解释 "**even 單獨出現的時候，不具有連接詞的功能，也沒有雖然或儘管的意思**"）。
- **撞车的一面**：**壳是 `if`（L48 已教）**；**且 ❌will 规则与 L48 正面复用**——BC 逐字 ❌ `Even if Barcelona will lose tomorrow, they will still be champions. (incorrect)`，**而我方 L48 逐字 "if 里不用 will"（`:8940`）**。
- **→ 判定：半新结构。** **⚠️ 硬约束：不得把「从句里不用 will」当作本课增量**——该纪律我方实测**已在 6 课出现**（**L48（16 处）／L49（6 处）／L109（3 处）／L142（7 处）／L143（4 处）／L144（2 处）**，本轮按课块切分＋注释行剔除后穷举复算；**huntCases 另有 4 处**）。**这是批二十六主理人已裁决过的同一坑**（批二十六路线图逐字："**该规则已在 7 课教过**……**若本批再用，是同一规矩的第八次应用**，正面违反「一课一增量」"）。
  **⚠️ 本轮对历史口径的一处校正**：批二十六／批二十七记的清单是 **`L47／L48／L49／L109／L142／L143／L144`（7 课）**，**本轮逐课块复核发现 L47 并不含该纪律**——**L47 全文 `will` 仅 1 次、且那一处是 L48 的注释行（`// ── 第六批 · L48 if 真实条件句…`）**；L47 的真实内容是 `should` 的「不变词家族」纪律（逐字 `rule: "should 进「不变词家族」：后面动词穿原样；口气是「应该」"`）。**→ 正确清单为 6 课（L48／L49／L109／L142／L143／L144）。** **结论方向不变（该纪律已严重过载），但数字须以本轮的 6 为准。**
- **→ 课量：1 课（且增量只能取「surprising or extreme」＋两条 even 不能单独当连词的 ❌）。**

### 2.5 `as long as` —— 🔴 **高撞车（同 ❌will 纪律 ＋ 同条件壳）**

- **跨源同轴证据**：Cambridge 逐字 `Not: … as long as I will live.`——**与 L48 的「if 里不用 will」是同一条纪律的第二次应用**；BC 逐字 "**It is also common to use this structure with unless, as long as, as soon as or in case instead of if.**"——**上游把 `as long as` 列为 `if` 的替换项**；中文侧专文逐字 "**as long as 指的是如果 A 事件發生了，那麼 B 事件就能夠實現，是條件句的一種。**"
- **我方状态**：**L48/L49 `if` 条件句已教**（`:8926`／`:9119`），**L142–L144 `as soon as` 已教**（`:27290`），**且中文侧把 `as long as` 与 `as soon as` 同篇并列**（`english.cool/as-long-as/` 页题逐字「來搞懂 as long as、as soon as、as far as 的用法」）。
- **→ 判定：组合式扩展，不是新结构。** **能教的新东西只剩「时间长度义」一条**——Cambridge 独立页第一个 h2 逐字 "**We use as long as to refer to the intended duration of a plan or idea**"，**这与我方 L156 `for + 一段时间`（`持续多久 · for 接一段时间`）同轴**。
- **→ 课量：1 课（增量只取「时长义 vs 条件义两张脸」），且必须与 L142 明确划界。**

### 2.6 `as if` / `as though` —— 🔴 `as though` 判同义换词；`as if` 判半新但抢 L159/L160 的动词位

- **`as though`**：**跨源四处逐字全写「同义」**（§1.10）。→ **判定：纯同义换词，档位 B−、课量 0**（认读位）。
- **`as if`**：**新的一面** = BC 逐字 "**with an unreal tense, we are saying we don't think the statement is really true**"（**虚拟语气层，我方零覆盖**）。
  **⚠️ 抢位的一面（本批新发现的风险）**：跨源逐字 "**As if and as though commonly follow the verbs feel and look**"，**而我方 L159 刚用 `look like`（`It looks like a boat.`）、L160 刚用 `seem to`（`He seems to know you.`）**——**三者在同一句法位置（系动词后）竞争同一个槽**，且 L159/L160 是**刚落地的两课、复现头寸尚未消耗**。
- **→ 判定：`as if` 可教，但必须排在 L159/L160 的复现头寸落定之后**，且**切分点必须打在两处差异上**（`look like + 名词` vs `as if + 小句子`——**接的成分不同**，这是我方 L159 已铺的「like 后面跟名词」的下一步）。

### 2.7 `so that` —— 🟡 **半新结构（同目的语义场，且是我方 L44 的下一步）**

- **跨源同轴证据**：BC 参考层逐字 "**We also use the to-infinitive to express purpose (to answer why?):**"＋"**We can also express purpose with in order to and in order not to**"——**上游把 `to`-inf／`in order to`／`so as to` **写成同一功能的不同形式**；**我方 L44 已教「目的 to」**（`:8189` 逐字 "去做什么再垫一块 to（说明目的）"）。
- **能教的新东西（两条）**：① **`so that` 后接完整小句子**（vs L44 的 `to + 原形`）——Cambridge 例句 `I'll go by car so that I can take more luggage.`；② **`so` 省 `that` 后与结果义 `so` 的分辨**——中文侧专文逐字 "**此時 so 表示目的，搭配情態助動詞 could**" 对 "**此時 so 表示結果，前面經常會加逗號**"，而我方 **L20 已教结果义 `so`**（`连词 · because / so`）。
- **⚠️ 红线：`so that` 与我方 L102 的 `So that was last night!`（`:19420`）不是同一物**（那是结果义 `so` ＋ 指示 `that`），**但学生看到的字面相同**——**必须处理这个假面熟**。
- **→ 判定：半新结构。课量 1 课。**

### 2.8 `be able to` / `dare` / `provided` —— 三项的甄别结论

| 候选 | 甄别 | 跨源逐字依据 |
|---|---|---|
| **`be able to`** | 🟡 **半新结构（新格位、旧「能力」语义）** | **旧**：跨源逐字 "**Be able to is like can.**"（Cambridge）／"**Be able to is a more formal alternative to can:**"——**与我方 L14 `can` 同轴**。**新**：两条禁位 `Not: She won't can concentrate.`／`Not: He should can work in a team.`＋`was able to` vs `could` 的单次/一般分工（BC 独立小节 `Ability on one occasion – successful`）。 |
| **`dare`** | 🔴 **不做（跨源自降级 ＋ CEFR B2 ＋ 中文侧零）** | 跨源逐字 "**Less commonly, it can be used as a semi-modal verb**"；**唯一禁用是 `How dare you` 语块**。 |
| **`provided`** | 🔴 **不做（无规则页、六词并列、CEFR B2）** | 跨源逐字（同一句话）"**conditional clauses can begin with phrases such as as long as, so long as, only if, on condition that, providing (that), provided (that)**"——**并列六项，做它就得连做六项**。 |

---

## §3 我方造词成本（逐候选）

**口径说明（重要）**：任务书给的三口径词次**全部为 0／1**（`so that` 为 1）。本轮**本机独立复算并加做了「词边界 vs 子串」双口径**——因为**子串口径会把 `table` 算成 `able`、把 `bought` 算成 `ought`**，这在本批是致命的（`able` GL 子串 43／词边界 0；`ought` GL 子串 44／词边界 0）。**下表「我方实测」列一律为词边界口径。**

### 3.1 本批候选词根的实际持有量（本机复算）

| 词 | GL 词边界 | GL 子串 | HC 词边界 | 说明 |
|---|---|---|---|---|
| `had better` | **0** | 0 | **0** | 真零。（`had` 本身 GL 91／`better` GL 85——**但全是比较级 `better` 与助动词 `had`，无一处是 `had better`**） |
| `ought` | **0** | **44** | 0 | **子串全是 `bought`**（L17 比较级区／过去式）→ **真零** |
| `able` | **0** | **43** | 0 | **子串全是 `table`／`uncountable`** → **真零** |
| `need` | **3** | 4 | **0** | **3 处全在对白里、全是名词义**（`:7449` `I need a book…`／`:8198` `We need milk.`／`:11827` `What do you need?`）——**无一处是 `need to` 结构** |
| `dare` | **0** | 0 | **0** | 真零 |
| `even` | **0** | 5 | **0** | **真零**（子串 5 处须复核，见 §6） |
| `as long as` | **0** | 0 | **0** | 真零（`as` GL 438／`long` GL 43 都是别的用法——`long` 多在 `How long does it take?` L73） |
| `provided` | **0** | 0 | **0** | 真零（`provide` 亦 0） |
| `as if` | **0** | 0 | **0** | 真零 |
| `as though` | **0** | 0 | **0** | 真零（`though` 词边界 GL 0／HC 0） |
| `so that` | **1** | 1 | **0** | **那唯一 1 处是 L102 `:19420` `So that was last night!`**——**结果义 `so` ＋ 指示 `that`，不是目的义连词** |

### 3.2 逐候选造词账单与场景零件

| 候选 | 须造词 | 场景零件是否齐备 | 成本评级 |
|---|---|---|---|
| **`need to`** | **1 词位**（`need`——**已有 3 次面熟，均作名词义，转品成本最低**）＋ 若做 `need Ving` 则**复用已有 `-ing` 家族**（L45/L77 已教 `enjoy reading`／`keep doing`） | **✅ 齐备**：`need to` 的日常场景（该买菜／该写作业／该看牙医）在「小美的一天」里是**顺手就有**的；中文侧 5 道练习题可直接映射 | **最低（本批最省）** |
| **`be able to`** | **1 词位**（`able`——**真造词，零面熟**）＋ `was/were able to` 须带出 `be` 的过去式（**L19/L21 已教**） | **⚠️ 半备**：场景需表达「能／不能做某事」——**而我方 L14 `can` 已占了这个语义位**，要做必须找 `can` 表达不了的场景（**跨源给的两个：情态动词后再接能力 `won't be able to`／单次成功 `was able to`**） | **中（词位 1，但场景须刻意构造）** |
| **`had better`** | **1 词位**（`had better` 整串；`had` 与 `better` 都已有面熟）＋ **须造 `'d better` 缩写形**（我方 `'d` 缩写**实测 GL 0**——见 §6） | **⚠️ 半备**：场景需「有负面后果的强建议」——**而 L47 `should` 已占了建议位** | **中（词位 1，场景与 L47 竞争）** |
| **`even if`** | **1 词位**（`even`——**真零**；`if` 已有 151 处） | **✅ 齐备**：跨源例句全部是日常场景（`even if it rains`／`even if you put on two or three jumpers`） | **中低（`even` 一词，场景顺手）** |
| **`as long as`** | **1 词位**（`as long as` 整串；`as`／`long` 都有面熟） | **✅ 齐备**：中文侧例句全是家长对孩子说的话（`You can go out as long as you finish your homework.`）——**与「小美的一天」的妈妈角色天然契合** | **中低** |
| **`so that`** | **1 词位**（`so that` 整串；`so` GL 87／`that` GL 160 都有面熟） | **✅ 齐备**：`I'll go by car so that I can take more luggage.` 型场景在出行篇顺手 | **低** |
| **`as if`** | **1 词位**（`as if` 整串） | **⚠️ 须等位**：与 L159/L160 抢 `look`／`seem` 的槽（§2.6） | **中（场景要错峰）** |
| **`ought to`** | **1 词位**（`ought`——真零） | **❌ 不适用**（课量 0） | — |
| **`dare`** | **1 词位** | **❌ 不适用**（不做） | — |
| **`provided`** | **1 词位 ＋ 连带 5 个同义词**（`only if`／`on condition that`／`providing`／`so long as`／`as long as`） | **❌ 不适用**（不做） | — |
| **`as though`** | — | **❌ 不适用**（认读位，不立岗） | — |

**小结**：**本批 11 项的造词成本全部落在「1 词位」——这是好消息**（无一项需要 2 个以上新词）。**但成本低不等于该做**：`ought to`／`provided`／`dare`／`as though` 四项虽只要 1 词位，**判不做的理由全在跨源侧（同义换词／无规则页／CEFR 过高），不在造价侧**。

---

## §4 汇总表（按档位排序）

**排序：A → B＋ → B → B− → C → D。本轮 A 档 0 项、D 档 0 项。**

| 序 | 候选 | ① 跨源逐字证据（＋来源） | ② 课程位 | ③ 规则页 | ④ CEFR | ⑤ 档位 | ⑥ 判定理由（一句话） | 本轮是否值得排期 |
|---|---|---|---|---|---|---|---|---|
| **1** | **`need to`** | Cambridge `Need` 页 **3 h2＋7 h3＋2 Warning＋7 条 `Not:`**；"**Need is a semi-modal verb…**"；BC `Suggestions and obligations` 逐字 "**We use must or need to to say that it is necessary to do something:**"；中文侧专文两义（`need to`／**`need Ving` 表被动**）＋5 题 | **✅ 有**（BC 参考层 beginner 段规则句＋BC B1-B2 课独立小节 `No obligation / don't have to`） | **✅ 厚**（3 h2＋7 h3＋2 Warning＋7 禁用） | **A1**（词典首义） | **B＋** | **四源齐备、CEFR 最低、7 条禁用为本批之最**；未升 A 只因否定轴撞 L16 | **✅ 值得（本批首选）** |
| **2** | **`be able to`** | Cambridge `Be expressions` 页 h2 `Be able to`（**六项共页**）＋ h3 `Past achievement: could or was/were able to?`；两条禁用 `Not: She won't can concentrate.`／`Not: He should can work in a team.`；**BC 正课 `Past ability`（B1／B2）** | **✅ 有但跨级**（BC B1-B2 正课；Murphy 中级 U26 未核） | **⚠️ 共页**（六项一页；中文侧 404×3） | **A2**（词典）／课程位 **B1-B2** | **B＋** | **课程位真、两条禁用真**；压在 B1-B2 段＋中文侧零 | **✅ 值得（次选）** |
| **3** | **`had better`** | Cambridge `Had better` 页 **5 实 h2 ＋ 4 条 `Not:`**；"**The verb form is always had, not have.**"／"**It is followed by the infinitive without to:**"／h2 `Had better or would rather, would prefer?`；词典独立条目 **A2**；中文侧 `letmeenglish` 专文＋10 题 | **❌ 无**（BC 三档 68 课 0；BC 参考层仅见一条用户评论） | **✅ 厚**（5 h2＋4 禁用＋A2 标位） | **A2** | **B** | 规则页最厚之一、建议轴撞 L47 `should`、中文侧 `english.cool` 404 | **✅ 值得（第 3 位）** |
| **4** | **`as long as`** | Cambridge **独立页** `As long as and so long as`（3 h2＋2 h3＋1 `Not:`）＋ `Conditionals: other expressions` 页内 h2；BC 仅一句列举；中文侧独立专文（独立 h2 `1. as long as 只要…`） | **⚠️ 半有**（Murphy U115 三词共用，未核） | **✅ 有** | **无标位** | **B** | 独立页＋独立专文；课程位三词共用、CEFR 无标位、❌will 复用 | **✅ 值得（1 课，须与 L142 划界）** |
| **5** | **`even if`** | **⚠️ 非独立页**（`If` 页内 h2 `Even if`，全文仅两句）；Cambridge `Even` 页 h2 `Even though and even if`；词典**独立 headword `EVEN IF` B2**；BC beginner 页有 ❌ 对比例；中文侧在对举篇内占一半 | **❌ 无**（BC 无独立小节；三档 0） | **⚠️ 半有**（词典级独立条目＋两处 h2 小节） | **B2** | **B** | 词典级独立条目是真的；无独立语法页、中文侧无独立专文 | **✅ 值得（1 课，增量只取「surprising or extreme」）** |
| **6** | **`as if`** | Cambridge **独立页** `As if and as though`（**h2 实为 0、无禁用、正文 6 句**）；BC C1 `Unreal time` 内独立小节 `As if/as though` | **❌ 无**（BC 三档 0 专课；Murphy U118 与 `like` 共用） | **⚠️ 薄**（无小节、无禁用） | 落点 **C1** | **B** | 有独立页但极薄、BC 落点 C1、须等 L159/L160 复现头寸 | **⚠️ 缓（错峰排）** |
| **7** | **`so that`** | Cambridge 独立页 `So that or in order that ?`（**挂 `Easily confused words`、无禁用、正文 4 段**）；`In order to` 独立页；**BC 全站不收（明证 0）**；中文侧两篇独立专文 | **✅ 有但是 `to`-inf 的位**（BC A1-A2 正课 `Infinitive of purpose`） | **⚠️ 易混对页** | **无标位**（BC purpose 课标 A1／A2） | **B** | 独立页＋中文侧专文；页性质是「二选一」、BC 不收、与 L44 同目的语义场 | **✅ 值得（1 课）** |
| **8** | **`ought to`** | Cambridge 独立页（3 实 h2＋1 Warning＋**5 条 `Not:`**），**独立 h2 标题即 `Ought to or should?`**，节内 "**similar in meaning**"／Warning "**We usually use should instead**"；中文侧专文逐字 "**其實和 should 的意思有些類似**" | **❌ 无**（BC 三档 0；参考层仅一条评论） | **✅ 结构完整** | **B1**（两源一致） | **B−** | **同义换词红线**（跨源四处都写「就是 should」）＋B1；保留 5 条禁用作认读 | **❌ 不做（认读位）** |
| **9** | **`as though`** | 与 `as if` **同页**；**四处逐字全写同义**（"**They have a similar meaning.**"／词典定义仅二字 "**as if:**"／BC "**As if is more common than as though.**"） | **❌ 无** | **❌ 无独立页**（借 `as if` 的页） | **B2** | **B−** | **纯同义换词**（与批二十五 `though` 对 `although` 同型，且证据更薄） | **❌ 不做（认读位）** |
| **10** | **`dare`** | Cambridge 独立页，但正文自述半情态用法 "**Less commonly**"；唯一禁用是 `How dare you` 语块 | **❌ 无**（BC 三档 0、BC 参考层明证 0、中文侧 404×2） | **⚠️ 边缘态**（1 条 `Not:`、无 Warning） | **B2**（两源一致） | **C** | 跨源自降级＋CEFR 两档＋中文侧零＋语义场无处安放 | **❌ 不做** |
| **11** | **`provided`** | `/grammar/british-grammar/provided` **302 回总入口（无页）**；唯一落点是六词并列句 "**such as as long as, so long as, only if, on condition that, providing (that), provided (that)**"；BC 明证 0；中文侧 **404×4** | **❌ 无**（Murphy U115 第三词，未核） | **❌ 无** | **B2**（两源一致） | **C** | 无规则页＋中文侧四度为零＋做它须连做六个同义词 | **❌ 不做** |

### 4.1 本轮值得排期的 B 档（＝ §4 表中标 ✅ 的项）

**七项**：`need to`（B＋）／`be able to`（B＋）／`had better`（B）／`as long as`（B）／`even if`（B）／`as if`（B，缓）／`so that`（B）。

**其中建议进入本轮排期的（5 项）**：**`need to`／`be able to`／`had better`／`so that`／`as long as`**。
**建议缓排（1 项）**：`as if`（***等 L159/L160 复现头寸落定***）。
**建议只做 1 课且增量受限（1 项）**：`even if`。

### 4.2 本轮判不做（4 项）及理由

| 候选 | 判不做理由（一句话） |
|---|---|
| **`ought to`** | **同义换词**：跨源四处逐字都写「就是 `should`」，我方 L47 已教建议轴 → **认读位** |
| **`as though`** | **同义换词**：四处逐字全写同义，词典定义只有 "as if:" 二字 → **认读位** |
| **`dare`** | 跨源逐字自述 "**Less commonly**"（半情态用法是边缘）＋ **CEFR 两源一致 B2** ＋ 中文侧 404×2 |
| **`provided`** | **无规则页**（302）＋ **中文侧 404×4** ＋ 上游一句话并列六词（做它须连做六项） |

---

## §5 建议排期的课量（只对 §4 判 B 档及以上的项）

**「一课一增量」口径**：每课至少 2 条**可教增量**（对比卡／禁用／新槽位），且**不得复用已教纪律**（本项目硬约束，见 §2.4 的 ❌will 警示）。**若某项少于 2 条可教增量，明确写「不足一课」。**

### 5.0 排期总览

| 候选 | 档位 | 建议课量 | 首课增量（一句话） | 后续课增量 |
|---|---|---|---|---|
| `need to` | B＋ | **2 课** | 词位 `need` ＋「需要做某事」主动义 | `need Ving` 表被动 ＋ `needs to` 三单变形 |
| `be able to` | B＋ | **2 课** | 词位 `able` ＋「情态动词后不能再接 can」两条禁位 | `was/were able to` vs `could` 的单次/一般分工 |
| `had better` | B | **1 课** | 词形纪律（永远是 `had`）＋ **后接不带 `to` 的原形** | — |
| `so that` | B | **1 课** | 后接完整小句子（vs L44 的 `to + 原形`）＋ 省 `that` 后与结果义 `so` 的分辨 | — |
| `as long as` | B | **1 课** | 「时长义 vs 条件义」两张脸 | — |
| `even if` | B | **1 课** | 「条件成立与否都不改变结果」＋ `even` 不能单独当连词的 ❌ | — |
| `as if` | B | **1 课（缓排）** | `as if + 小句子`（vs L159 `look like + 名词`） | — |
| `ought to` | B− | **0 课** | — | — |
| `as though` | B− | **0 课** | — | — |

**本轮可排期总量：9 课**（若含缓排的 `as if`）。

### 5.1 `need to`（B＋）——**2 课，且第二课是本批最硬的一条增量**

**第 1 课 · 「需要做某事」**
- **增量 ①**：**词位** `need`（真零；已有 3 次名词义面熟）。
- **增量 ②**：**`need to + 原形`**——Cambridge 逐字 "**Main verb need is followed by to and it changes with person, number and tense**"。
- **禁用位**：Cambridge `Typical error` 逐字 "**I need to have my hair cut. Not: I need have my hair cut.**"（**不带 to 是高频错型**）。
- **场景**：该买菜／该写作业／该看牙医——「小美的一天」顺手就有。

**第 2 课 · 「某件事需要被完成」**
- **增量 ①**：**`need Ving` 表被动**——中文侧逐字 "**但如果在 need 後面接的是動名詞 Ving，反而是表示被動的意思**"＋等式 `Her room needs cleaning. = Her room needs to be cleaned.`
- **增量 ②**：**与 L16 的否定轴合流**（Cambridge 逐字 "**You needn't mention this to your father.**" 对 "**You don't need to mention this to your father.**"——**"the meaning is the same"**）——**⚠️ 这一条是「与 L16 对账」，不是新纪律；必须写成延续位而非增量**，否则触 L16 红线。**建议第 2 课的主增量只取 `need Ving`。**
- **禁用位**：Cambridge Warning 逐字 "**We must use the main verb need when it is followed by a noun phrase or -ing clause:**"（`Not: You needn't an umbrella.`／`Not: My hair needn't cutting…`）。
- **课量封顶理由**：第 3 课只能是「换人称／换动词」，**无跨源支撑 → 2 课封顶。**

### 5.2 `be able to`（B＋）——**2 课，第 3 课跨源不足以支撑**

**第 1 课 · 「can 不够用的时候」**
- **增量 ①**：**词位** `able`（真零）。
- **增量 ②**：**两条禁位**（Cambridge 逐字）：`Not: She won't can concentrate.`／`Not: He should can work in a team.`——**这是我方 L14「情态动词后接原形、不叠加」纪律的正向延伸：既然不能再叠一个情态，那「能」就得换 `be able to`。**
- **场景**：须刻意构造（因为 L14 `can` 已占基本能力位）。

**第 2 课 · 「那一次做成了」**
- **增量 ①**：**BC 独立小节** 逐字 "**we use was/were able to (= had the ability to) and managed to (= succeeded in doing something difficult).**"＋"**Could is not usually correct when we're talking about ability at a specific moment in the past.**"——**对比例** `Only one person was able to beat the record.` 对 `Not: Only one person could beat the record.`（Cambridge 逐字）
- **增量 ②**：**正式度分层**（BC 逐字 "**wasn't/weren't able to is more formal than couldn't**"）。
- **⚠️ 未升 A 的理由（须如实对外写）**：课程位在 **B1-B2 段**（BC 正课 Level 逐字 `B1 Intermediate`／`B2 Upper intermediate`），**我方零基础线在 A1-A2 段——这是跨档，不是「我方有缺口」那么简单。**
- **课量封顶理由**：**第 3 课无跨源支撑**（BC 只有三个小节，Cambridge 只有两个 h3）。

### 5.3 `had better`（B）——**1 课封顶**

- **增量 ①（真新，且是本批最干净的一条）**：**后接不带 `to` 的原形**——Cambridge 逐字 "**It is followed by the infinitive without to:**"＋禁用 `Not: I'd better to go now.`。**⚠️ 与我方 L62 `would like to`（垫 `to`）正好相反**——**这是一条统一的「哪些壳垫 to、哪些壳不垫」的纪律位，价值高。**
- **增量 ②**：**词形**——Cambridge 逐字 "**The verb form is always had, not have.**"（`had` 永不变成 `have`；**中文侧 letmeenglish 逐字另有用户常见误解**："**很多學習者會誤以為因為有 had 就只能用在過去**"——**这是真 ❌，可直接用**）。
- **增量 ③（可选）**：`'d better` 缩写形（**⚠️ 我方 `'d` 缩写实测 GL 0，须先确认缩写在库的呈现惯例**，见 §6）。
- **为什么 1 课封顶**：**「强建议／有负面后果」这一层与 L47 `should` 同一轴**（跨源逐字 "**This means the same as should**"／词典 "**= you should**"）——**第 2 课会直接重复 L47，触红线。**

### 5.4 `so that`（B）——**1 课**

- **增量 ①**：**后接完整小句子**（Cambridge 逐字 `I'll go by car so that I can take more luggage.`）——**vs 我方 L44 的 `to + 原形`（`I go to the shop to buy milk.`）**，**「接小句子 vs 接原形」是同一个目的义的两种壳，这是标准的「一课一增量」。**
- **增量 ②**：**省 `that` 后与结果义 `so` 的分辨**——中文侧逐字 "**此時 so 表示目的，搭配情態助動詞 could**" 对 "**此時 so 表示結果，前面經常會加逗號**"；**⚠️ 必须正面处理我方 L102 `So that was last night!`（`:19420`）的假面熟**，以及 **L20 已教的结果义 `so`**。
- **为什么 1 课封顶**：Cambridge 页只有 4 段、无禁用；**第 2 课无跨源支撑。**

### 5.5 `as long as`（B）——**1 课**

- **增量 ①**：**两张脸**——Cambridge 独立页的两个 h2 已把「时长义」与「条件义」分开：**`As long as`（时长）逐字 "**refer to the intended duration of a plan or idea**"** 对 **`As long as and so long as`（条件）逐字 "**also means 'provided that', 'providing that' or 'on condition that'**"**。**这是现成的「一课一增量」结构。**
- **增量 ②**：**口语/书面分层**——Cambridge 逐字 "**As long as is more common in speaking; so long as and on condition that are more formal and more common in writing**"。
- **⚠️ 必须划界**：**与 L142 `as soon as` 划界**（中文侧专文把两者同篇并列，学生混淆面已存在）；**与 L48/L49 `if` 划界**（BC 逐字把 `as long as` 列为 `if` 的替换项）。
- **⚠️ 禁止复用**：**❌will 纪律不得作为本课增量**（Cambridge 的 `Not: … as long as I will live.` 与我方 9 课已教的是同一条）。
- **为什么 1 课封顶**：**课程位是三词共用一格（Murphy U115），不是我方意义的单点课位**；且 **CEFR 无标位**，跨源没给第二课的位置。

### 5.6 `even if`（B）——**1 课，且增量只剩 1 条半**

- **增量 ①**：**「条件成立与否都不改变结果」**——Cambridge 逐字 "**We can use even if to mean if when talking about surprising or extreme situations:**"＋`You're still going to be cold even if you put on two or three jumpers.`；**Cambridge `Even` 页逐字另有** "**We use even before if to refer to a possible unexpected or extreme event:**"。
- **增量 ②**：**`even` 不能单独当连词（两条 ❌）**——中文侧逐字 `I wouldn't date Sam even he were handsome and muscular. ❌`／`Even I've polished and cleaned the vase, it still looks old. ❌`，解释逐字 "**even 單獨出現的時候，不具有連接詞的功能，也沒有雖然或儘管的意思**"。
- **⚠️ 不足一课的判定**：**去掉「从句不用 will」之后（禁复用，§2.4），可教增量只剩上述 1 条半**——**跨源给的 `Even if` 小节全文只有两句**（已逐字复核）。**→ 建议：1 课，但增量须靠「与 L48 `if` 的对照」补足，且必须明确标注为对照位而非新纪律。**
- **更保守的选项**：**若主理人不接受「对照位算增量」，`even if` 应降为「不足一课」、只作认读位。**

### 5.7 `as if`（B）——**1 课（缓排，须错峰）**

- **增量 ①**：**接小句子**（Cambridge 逐字 `It looks as if they've had a shock.`）——**vs 我方 L159 `look like + 名词`（`It looks like a boat.`）**，**「接名词 vs 接小句子」是干净的切分。**
- **增量 ②**：**虚拟语气层**——BC 逐字 "**When we follow as if/as though with an unreal tense, we are saying we don't think the statement is really true.**"（`Some people behave as if their actions had no consequences.`）——**⚠️ 这一条属 C1 语义层，对零基础线偏难，建议第一课不取。**
- **⚠️ 缓排理由**：**与 L159／L160 抢 `look`／`seem` 的槽**（跨源逐字 "**As if and as though commonly follow the verbs feel and look**"）；**L159／L160 是刚落地的两课，复现头寸未消耗**（批三十 §A.5 已登记「`it looks nice` 5 课，距触顶仅 1 课」）。**→ 必须等头寸落定。**

### 5.8 判「不足一课」的项（明确声明）

| 候选 | 判定 | 依据 |
|---|---|---|
| **`ought to`** | **不足一课 → 0 课** | **可教增量只有「否定/疑问不加 do」一组禁用**（5 条 `Not:`），**语义轴已有 L47**；**不足 2 条** |
| **`as though`** | **不足一课 → 0 课** | **跨源四处逐字全写同义，无任何独立增量**；**0 条** |
| **`dare`** | **不足一课 → 0 课** | **唯一禁用是 `How dare you` 语块（属感叹语块非语法结构）**；**1 条，且场景无处安放** |
| **`provided`** | **不足一课 → 0 课** | **无规则页；做它须连带 `only if`／`on condition that`／`providing` 等五个同义词**；**词位破线** |
| **`even if`** | **⚠️ 边界项** | **1 条半增量**——**见 §5.6，主理人须裁决「对照位算不算增量」** |

---

## §6 未核实项（诚实登记）

**口径**：本节列出**本轮未取到、未复核、或取到但存疑**的全部条目。**§1–§5 中凡依赖这些条目的结论，均已在正文内逐条标注。**

### 6.1 ⚠️【最大缺口】Murphy 双册 TOC 本轮完全未能复核

| 项 | 状态 |
|---|---|
| 本机原件 | **`/private/tmp/murphy_int.html` 实测 1304 字节，内容逐字为 `503 Service Temporarily Unavailable`＋`Cloudflare` 错误页——不是 TOC。** 批二十四／批二十九引用的 `/private/tmp/murphy_int.txt`／`murphy_ess.txt`／`murphy_full.txt`／`murphy_toc_clean.txt` **经 `find` 全盘检索已不在本机**（`/Users/liujun` 下仅剩 pygments 的 `murphy.py` 配色文件，与教材无关） |
| 直连 | `cambridge.org` **403**（`/gb/`、`/us/` 两式均试）；`archive.org`／`web.archive.org`／`books.google.com` **000 不可达**；`r.jina.ai` 代理 **000** |
| 搜索引擎 | `duckduckgo.com` **000**；`mojeek.com` **403**；`cn.bing.com` **200 但穷举三组检索词均未命中任何转载 TOC 的页面**（结果全是词典释义页与无关站点） |
| **影响评估** | **中。** 本批 11 项里，**`had better`／`ought to`／`need`／`dare`／`as if`／`as though` 六项的 Murphy 层完全空白**——**其中 `had better` 与 `dare` 的「课程位 = 无」这条判据只靠 BC 单源支撑。** ⚠️ **但本批无一项的档位依赖 Murphy**：`had better`（B）的判据是「规则页厚＋BC 无课程位」，`dare`（C）的判据是「跨源自述 Less commonly＋CEFR B2＋中文侧零」，**去掉 Murphy 不改变结论**。 |
| **本报告使用的 Murphy 记录** | 全部为**沿用既有批次**，逐条标注来源：**中级 U26 `can, could and (be) able to`**（批十九／批二十）；**中级 U64 `to…, for… and so that…`**（批二十／批二十一）；**中级 U115 `unless as long as provided`**（批二十四／批二十五／批二十七）；**中级 U118 `like as if`**（批十八／批十九／批二十四）；**中级 U117 `like and as`**（批十一／批十八）；**中级 U113 `although though even though in spite of despite`**（批二十四／批二十五／批二十七）；**中级 U56／U57（try, need, help）**（批十五／批十六）；**初级 U35 仅 Let's**（批十一／批十四／批十五／批十六／批十七）。 |
| **建议** | **若主理人要复核 `had better` 的 Murphy 课程位（它是唯一可能升 A 的路径），必须先恢复该文件或另找扫描件。** |

### 6.2 ⚠️ BC 站点本轮直连被拦截

- **`curl` 对 `learnenglish.britishcouncil.org` 全返回 000 或 403**（含 `--http2`＋完整浏览器头＋`--compressed` 组合）；DNS 解析正常（`e1359.a.akkaedge.net`）→ **Akamai 边缘拦截，非网络不通**。
- **本报告 BC 层全部经 WebFetch 取到**，共 14 页实取成功。**⚠️ 且本轮发现 BC 站点 URL 已迁移**：`/grammar/…` → **`/free-resources/grammar/…`**。实测：`/free-resources/grammar/english-grammar-reference` 200，而旧路径 `/grammar/english-grammar-reference` 在 WebFetch 下返回 404。**→ 按历史批次 URL 复核时请先试新前缀。**
- **⚠️ 另有 BC 页面的「取到但内容不符」陷阱**：`/grammar/b1-b2-grammar`（旧式）WebFetch 返回的是**单课页 `Reported speech: statements`** 而不是索引；`/grammar/c1-grammar` 同样返回单课页。**→ 本轮的索引全目改用 `/free-resources/grammar/{a1-a2,b1-b2,c1}` 取到**（18／36／14 课全目，见 §4 依据）。

### 6.3 未复核的具体条目（逐条列出）

| 序 | 未核实项 | 具体状态 | 对结论的影响 |
|---|---|---|---|
| 1 | **`'d` 缩写形在库的呈现惯例** | **本轮实测：`'d` 在 GL 与 HC 中均为 0**（正则 `\bI'd\b`／`\bYou'd\b`／`\b'd\b` 全 0）；而 **`n't` 类缩写很齐**（`don't`／`can't`／`wasn't`／`shouldn't`／`won't` 等 16 种）、`'s`／`'re` 也有（`I'm`／`It's`／`Let's`／`You're` 等）。**→ `'d better` 的缩写形是我方从未付过的账。** | **影响 `had better` 的成本评级**：跨源逐字 "**We normally shorten it to 'd better in informal situations.**"——**若首课就上 `'d better`，须新增缩写层；若只上 `had better` 全形，则与「口语常用形」脱节。** **建议主理人裁决。**（§5.3 增量 ③ 已标为可选） |
| 2 | **`even` 的 5 处子串命中** | **本轮已复核完毕**：GL 子串 5 处**逐条为 `seven`×2（`:1086`／`:3488`）／`seven`（`:3490`）／`eleven`（`:8761`）／`seventh`（`:10334`）**——**无一处是 `even`**。→ **`even` 词边界确为真零，此条已核实（非未核实，在此登记以留痕）。** | 无（已消解） |
| 3 | **`not` 的 3 处 `need` 是否可升级为 `need to` 的「底座」** | 3 处均在 `dialogue` 字段（`:7449`／`:8198`／`:11827`），**作名词义**（`I need a book…`／`We need milk.`／`What do you need?`）；**另有 `:12411` `Need a hand?`**（**⚠️ 此句是动词义但无 `to`**——严格说是「面熟」而非「底座」） | **影响 `need` 的词位成本评级**（§3.2）：**本轮按「已有面熟、转品成本最低」计**，**但 `Need a hand?` 是动词义零 `to` 形，学生可能已形成「need 后不垫 to」的错误印象**——**建议首课正面处理这个假底座。** |
| 4 | **`so that` 的 Cambridge 词典独立条目** | **`/dictionary/english/so-that` 本轮实测 302（无独立条目）**；`so` 条目内 `so that` 仅出现 1 次（在 See-also 段） | 已计入 §1.11（③ 规则页 = 易混对页） |
| 5 | **`as if` 的目标义词典标位** | **`/dictionary/english/as-if` 返回 `AS IF!`（感叹条目）**，定义逐字 "said to show that you do not believe something is possible:"——**不是目标义**；`AS THOUGH` 才有目标义（`B2`）。**→ `as if` 本身无目标义 CEFR 标位。** | 已计入 §1.9（④ CEFR = 三源分裂） |
| 6 | **Oxford 对 6 项的覆盖** | **`had-better`／`even-if`／`as-if`／`as-though`／`as-long-as`／`be-able-to` 六项在 OALD 全部 404**（含 `_1` 后缀与美国版路径两式）；**仅 `ought-to`（b1×3＋b2）／`provided`（b2）／`dare_1`（b2/c1/c2）／`able_1`（a2/c1）四项取到。** | **Oxford 层对本批覆盖面仅 4／11**——已逐项标注，未用 Oxford 缺失作为判档依据 |
| 7 | **`so that` 的 CEFR 标位** | **`so that` 词典 302、`in order to` 条目无 badge、语法页无 badge**——**三处全无标位**。**BC 的 purpose 落点标 `A1 Elementary`／`A2 Pre-intermediate`，但那一课教的是 `to`-infinitive** | 已计入 §1.11（④） |
| 8 | **`as long as` 的 CEFR 标位** | **Cambridge 词典 `AS LONG AS` 定义逐字 `if:`，但 badge 字段为空**（本轮三次取均空）；Oxford `as-long-as` 404 | 已计入 §1.7（④ 「取 B1 为参考，但无硬标位」） |
| 9 | **`had better`／`ought to`／`need`／`dare` 在 BC 参考层的确切 URL** | **`Suggestions and obligations` 与 `Ability` 两页本轮实取成功**；但 **BC 参考层是否还有其他页面提及同项，本轮未穷举**（未做全站检索——BC 站内 `search` 端点返回 404） | **影响「课程位 = 无」的强度**：**本轮对 `had better`／`ought to`／`dare` 的「BC 0」结论基于三档 68 课全目＋4 张参考页实取，未做全站穷举。** |
| 10 | **中文侧 `letmeenglish.com` 的 526 状态码** | **本轮对 14 个 slug 探测全部返回 `526`**（Cloudflare SSL 错误），**但 `had-better` 一页在早前一轮成功取到 200＋完整正文** | **→ 该站的 526 是间歇性的，不能据 526 判「页面不存在」。** **`letmeenglish` 对 `ought to`／`as if`／`even if`／`provided`／`dare` 的 404 结论**（来自早前一轮的 404，非 526）**成立**；但**未再复核**。 |
| 11 | **`more`／`most` 等 `than` 族与 `had better` 的对比页** | 未查（不在本批范围） | 无 |
| 12 | **Cambridge `H` 字母段之外的完整语法页清单** | 本轮取了 19 个字母段的 Browse 页（**用于确认 `Had better` 在 `h/had-better/` 有独立编目位**），**但未逐字母枚举全部条目** | **未用于判档**——本批所有「独立页存在性」均以「直连 URL ＋ title/h1 双核」为准 |
| 13 | **⚠️ 历史口径校正：❌will 纪律的课数** | 批二十六／批二十七记「**已在 7 课教过**（L47／L48／L49／L109／L142／L143／L144）」。**本轮按课块切分＋注释行剔除穷举复算：`L47` 不成立**（L47 全文 `will` 仅 1 次，落在 L48 的注释行 `// ── 第六批 · L48 if 真实条件句…` 上；L47 的真实内容是 `should` 的「不变词家族」）。**正确清单为 6 课：L48／L49／L109／L142／L143／L144**（＋huntCases 4 处） | **结论方向不变**（该纪律已严重过载）；**数字须以本轮的 6 为准**。**⚠️ 凡引用「7 课」的历史文档需按此校正**（涉及：`roadmap-grammar-twenty-sixth-batch` `:59`／`roadmap-grammar-twenty-seventh-batch` `:81`／`prd-grammar-all-every` `:39`／`prd-grammar-yet-already` `:53`） |
| 14 | **本报告未复核批二十六/二十七的「7 课」是否含其他同类误计** | **L12／L29 本轮亦曾被行号口径误纳入，复核后为假阳性**（L12 命中 "will 和 can 一样从不变形…没有 wills 这种形状"；L29 命中错误例句 `It will rains tomorrow.`）——**两者都不是「从句里不用 will」纪律** | **→ 已从本报告剔除。** **建议主理人对历史批次的「N 课教过」类断言统一改用语料级复算。** |

### 6.4 本报告**没有**做的事（避免误读）

1. **未做 BC 全站穷举检索**——「BC 三档 68 课 0 命中」是**基于三档索引全目实取**（18／36／14 逐条），**不是全站检索**。
2. **未取 Murphy 正文**——所有 Murphy 陈述均为 TOC 层（且本轮 TOC 亦未取到，见 6.1）。
3. **未评估其余尚未普查的候选**——本批只覆盖任务书给的 11 项；**B 档总量的穷举尚未完成**（本报告是普查的**一批**，不是全量）。
4. **未验证任何课程设计**——本报告是判档报告，§5 的「一课一增量」是**建议**，不是已核可的课程规格。

---

## §7 附：给主理人的四条机制提醒

### 7.1 ⚠️ 「词边界 vs 子串」是本批的关键口径坑（建议写入研究纪律）

**实测：`able` GL 子串 43（全是 `table`／`uncountable`）／词边界 0；`ought` GL 子串 44（全是 `bought`）／词边界 0。**
**→ 若用子串口径，会得出「`able` 和 `ought` 在库里有几十处、不是真零」的错误结论，进而误判造词成本。** **本报告所有词频为词边界口径；三口径复算请一律加词边界。**

### 7.2 ⚠️ Cambridge「假阳性」陷阱本轮触发四种变体（共 6 例，建议升级为强制检查项）

| slug | 状态码 | 实际 title／Location | 结论 |
|---|---|---|---|
| `/grammar/british-grammar/even-if` | **200** | **`If`** | **不是独立页**（是 `If` 页内 h2） |
| `/grammar/british-grammar/be-able-to` | **200** | **`Be expressions (be able to, be due to)`** | **不是独立页**（六项共页） |
| `/grammar/british-grammar/even-though-and-even-if` | **200** | **`Even`** | **不是独立对比页**（是 `Even` 页别名） |
| `/grammar/british-grammar/as-if`／`/as-though` | **200** | **`As if and as though`** | **两 slug 同页（此例是正确行为，登记以作对照）** |
| `/grammar/british-grammar/provided` | **302** | Location 回 `/grammar/british-grammar/` | **无页**（回总入口） |
| `/dictionary/english/so-that` | **302** | Location 逐字 `…/dictionary/english/work?q=so-that`，落到 **`WORK`** | **无条目**（**查不到时跳到别的词条——本批最隐蔽的一种**） |
| `/dictionary/english/as-if` | **200** | **`AS IF!`** | **条目存在、但义项不是目标义**（是感叹用法；目标义在 `AS THOUGH`） |

**→ 凡以「页／条目是否存在」为论据，必须同时核 `<title>`／`<h1>`／`<Location>` 与**义项**。** 批三十已登记「200 ＋ 邻近页」这一种（§C.2），**本轮全额命中并发现另外三种变体：302 跳别词条、别名页、以及「条目在但义项不对」。**

### 7.3 ⚠️ 「同义换词红线」本批触发两项，且都是「上游自己写的」

**`ought to`**：跨源四处逐字（独立 h2 标题 `Ought to or should?`／"**similar in meaning**"／Warning "**We usually use should instead**"／中文侧 "**其實和 should 的意思有些類似**"）。
**`as though`**：跨源四处逐字（"**They have a similar meaning.**"／词典定义 "**as if:**"／BC "**As if is more common than as though.**"）。
**→ 建议：凡候选的跨源页面里出现「= 某已教结构」的明文，一律直接进入红线流程，不再单独评估其课程位。**（本批的 `though` 对 `although` 是同一模式，批二十五已判 C。）

### 7.4 ⚠️「❌will 纪律」已是我方全库最过载的一条，任何新条件句候选都必须先扣掉它

**本轮逐课块穷举复算（注释行剔除后）：该纪律在 GL 中出现于 6 课**——**L48（16 处）／L49（6 处）／L109（3 处，含逐字 "后面别请 will"）／L142（7 处，逐字 "这跟第 48 课一个规矩"）／L143（4 处）／L144（2 处）**；**huntCases 另有 4 处**（含逐字 "第 48 课那条规矩，as soon as 也照办"）。
**⚠️ 本轮校正历史口径**：批二十六／批二十七记的 7 课清单含 **L47**，**本轮复核不成立**（L47 全文 `will` 仅 1 次，且落在 L48 的注释行上）——**正确为 6 课**。**⚠️ 该纪律的最初出处是 L48**（`grammarLabel: "条件句 · if 里说现在"`，逐字 "**if 里不用 will**"）。
**→ 本批 `even if`（BC ❌`Even if Barcelona will lose tomorrow`）与 `as long as`（Cambridge ❌`as long as I will live`）两项的跨源禁用，全部撞在这条上。**
**→ 建议：凡条件/时间从句类候选，判档时先把「❌will」从可教增量里扣除，再数剩几条**——这也是批二十六主理人对 `unless` 的裁决口径（逐字："**去掉 ❌will 之后，`unless` 还剩几条对比卡？**"）。

---

> 本报告由产品战略团队 AI 协作生成（竞析 · 竞品/跨源分析师），重要决策请由产品负责人审定。
> **本报告为「B 档前沿普查」的一批，不是 B 档全量穷举。**
