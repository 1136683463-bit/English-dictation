# 跨源竞品分析 · `verb + to` 家族补员（第三十七批专项 · `learn`／`decide`／`hope`／`try`）

**日期**：2026-09-21 ｜ **分析人**：竞析（产品战略团队 · 竞品/跨源分析师）
**类型**：家族补员专项（不是 B 档前沿普查——本轮对象是「已教家族里的系统性缺员」）
**上游**：`roadmap-grammar-thirty-sixth-batch-2026-09-21.md`（批三十六 §1.2 三处「家族开了头、缺成员」）／`competitive-analysis-basic-vocab-blindspot-2026-09-21.md`（批三十六 · 覆盖面盲区专项 §1.3）
**我方基线**：**189 课（L1–L189）／198 案／28 季**（本轮独立复算：`grammarLessons.ts` `number:` 取值 **189** 条、1–189 无跳号；`huntCases.ts` **198** 条；`grammarSeasons.ts` `season-*` **28** 组、末组 `season-28` 区间 182–189）

---

## 📌 TL;DR（本批三条结论）

1. **任务书写「前排四员全零」——GL 层成立，但漏记了一处**：**`decide to` 在库里已经有输出位**——不是 GL 课，而是**图书馆第 4 关（`library-gate-4`）的必答句 `I decided to finish this chapter tonight.`** ＋ **`rune-infinitive-sprout` 的 spells 第二句 `She decided to stay.`**（**本轮新发现，任务书未提** → §0.2／§4.1-B）。
2. **§2 判定：四词是「同一句法槽位换词」，不是新结构**——跨源把 `want` 与四词**逐字列在同一张名单里**（**六处同名单**），语法行为与我方 L15 完全一致（**本批最重要判定** → §2）。
3. **§3 判定：`try to do` vs `try doing` 的辨析成立，是本批唯一有真结构增量的词**——但它**不是 A 档内容**：Cambridge 明放在 **H3**，BC 明设 **B1-B2 专课**，LDOCE 单设 `GRAMMAR: Comparison` 框（→ §3.4／§4.3）。

**建议课量（详见 §4）**：**1 课（上限），且新课只收 `try` 一个词**——不是 2 课，也不是 4 词合课。

---

## §0 本批要回答的问题与三条前置结论

**任务书的五个问题 → 本报告的处置**：**① 四处上游有无独立单元（课程位）→ §1**（Murphy／Cambridge／BC／词典标位 四层逐条）；**② 四词与 L15 `want to` 是同槽位换词还是新结构 → §2**（核心红线）；**③ 四词逐词跨源差异 → §3**；**④ 该开几课、跨源支撑是什么 → §4**；**⑤ 哪些没查到 → §5**。

### 0.1 先行更正：任务书的两处口径须修订

**① 「前排四员全零」——准确，但须补一句。** 任务书与批三十六路线图均称四词全 0。**本轮以词边界口径独立复算 `grammarLessons.ts`（唯一统计对象＝GL 课）**：

| 形式 | GL 命中 | 判定 |
|---|---|---|
| `want to`／`need to`／`would like to`／`seem to`／`in order to` | **109／44／9／10／68** | ✅ 均已教（L15／L161／L62 等／L160／L173） |
| `like to` | **20**（其中 **9** 属 `would like to`，**裸 `like to` 约 11**） | ✅ 已教（L62／L70／L169） |
| `learn`／`decide`／`hope`／`try`（**裸词**） | **0／0／0／0** | ✅ **真零** |

**⇒ GL 层「四词全零」成立。** ⚠️ **但 GL 不是全库**——见 §0.2。

**② `like to` 的账目须补注**：批三十六把 `like to` 记为 20，本轮复算 20 无误，**但其中 9 处是 `would like to`**（系 20 的全部子集）——**即「裸 `like to`（表习惯性喜欢）」实际约 11 处**。**不影响「底座已铺」的结论**，**但若后续用「20 处」做课量论证，须改用 11**。

### 0.2 一轮前置结论：**`decide to` 在我方库里已经有教学位了**（任务书未记）

**这是本轮最意外的一条发现，且它直接改变 §4 的课量建议。**

本轮把统计口径从 `grammarLessons.ts` 扩到 `src/data/*.ts` 全库，发现 **`decide` 在 2 个非 GL 文件里有实质教学使用**：

| 文件 | 位置 | 逐字内容 |
|---|---|---|
| **`libraryGateScripts.ts`** | **`:110`** | `// ── G4 · 不定式·decide to：决定去做 ──────────────────────────────`（**关卡主题名即 `decide to`**） |
| 同上 | **`:112`** | `id: "library-gate-4",` ／ `topicId: "s4-infinitive",` ／ `runeId: "rune-infinitive-sprout"`（落在**不定式符文章节**） |
| 同上 | **`:119`–`:121`** | `canDo: "说出决定「我决定今晚读完这一章」"` ／ **`requiredPattern: "I decided to finish this chapter tonight."`** ／ `sampleAnswer` 同 |
| 同上 | **`:128`–`:135`** | **`counterExample: "I decide to finish this chapter tonight."`** ／ `counterNote: "决定是刚才做的，decide 要带上 -ed 的痕迹：decided"` ／ `lampHint: "决定是刚做的，用过去式：I decided to finish…"`（**反例卡＝时态，不是 to**） |
| **`runes.ts`** | **`:254`** | **`spells: ["I want to read.", "She decided to stay.", "We hope to see you."]`**（**`rune-infinitive-sprout` 三句 spells**） |

**⇒ 两条硬结论**：① **`decide to` 与 `hope to` 以「符文例句」形式出现在 `rune-infinitive-sprout`**（**第二句 `She decided to stay.`、第三句 `We hope to see you.`**），而该 rune 的 `oneLineRule` 逐字是「**想说「要去做」，动词前种一个 to 的芽：I want to read。**」——**符文层已把 `want`／`decide`／`hope` 放在同一条规则下**；② **`library-gate-4` 的必答句是 `I decided to finish this chapter tonight.`**——`acceptRegex` 逐字 `^i\s+decided\s+to\s+finish\s+this\s+chapter\s+tonight[.!]?$`，**是一道用户真的要打出来的句子**。

**⚠️ 性质**：**它不是「课程位」，但它是「已承诺给用户的输出位」**。批二十六创立、批三十六沿用的判据是「**复现 ≠ 教学位**」——**但 `library-gate-4` 不是复现垫子，它是一道必答题**：用户在图书馆第 4 关被要求打出 `decided to`，**而 GL 侧从未教过 `decide`**。**⇒ 这是一个「已承诺未交付」的接口**，处置见 §4.1。

### 0.3 二轮前置结论：四个词的档位分布**极不均匀**，须拆开处置

任务书把四词作为一个整体（「前排四员」）。**本轮四层核实后，四词的档位差 3 档**：

| 词 | 本轮档位 | 与批三十六的差 | 依据 |
|---|---|---|---|
| **`try`** | **B**（**升档**） | ⬆ 批三十六判 **B−** | **BC B1-B2 有独立专课**（§1.3）＋ LDOCE 独立对比框（§3.4）——**批三十六「`try` 课程位 ❌」被推翻** |
| **`hope`** | **B** | 持平 | `Word patterns: hope` 专页（明文 `Don't say`）＋ Warning `Not:`（§3.3） |
| **`decide`** | **B** | 持平 | BC A1-A2 正文名单 ＋ **我方已有输出位**（§0.2） |
| **`learn`** | **B−**（**降档**） | ⬇ 批三十六给 B | **四词中唯一无 `Not:`／`Don't say` 禁令**；Cambridge 侧落点是 `Word choice`（**辨析类**）（§3.1） |

**⇒ 关键判断**：**「四个词」不是一件事。** `try` 需要的是「变义辨析」（真结构增量），`learn`／`decide`／`hope` 需要的是「同规则补词」（零结构增量）——**两条路线的课量逻辑完全相反**。

---

## §1 跨源课程位核实（本批核心）

### 1.1 Murphy 双册 —— **原件不可得，本轮诚实登记「未核实」**

**⚠️ 这一节不做任何新的断言。** 任务书已预告「Murphy 双册原件已丢失」；**本轮独立重查，结论与批三十五／批三十六一致**：

| 检索路径 | 本轮实测结果 |
|---|---|
| `find /Users/liujun -iname "*murphy*"`（全盘，排除 `node_modules`） | **仅命中 5 处，全部是 pygments 配色文件 `pygments/styles/murphy.py`（Python `.venv` 内副本）——与教材无关** |
| `/private/tmp/murphy_int.html` | **仍存在，1304 字节，内容逐字 `503 Service Temporarily Unavailable`——Cloudflare 错误页，不是教材文本** |
| `/private/tmp/murphy_ess.txt`／`murphy_int.txt`／`murphy_full.txt`／`murphy_toc_clean.txt` | **全部不存在**（`ls` 实测） |
| `assets.cambridge.org` 两份官方 TOC PDF（`9781108457651_toc.pdf`／`9781107480537_toc.pdf`） | **两次直连均 `curl exit 28`（超时 20s，`code:000`）——比批三十六的「403」更差** |
| `web.archive.org` ／ `www.cambridge.org` | **`code:000`** ／ **HTTP 403** |

**⇒ 结论：Murphy 层本轮完全无法取得。** 关于「Murphy 初级 `Verb + to ...` 单元」，**只能给「沿用记录 · 未核实」，不能给逐字**：

| 记录来源 | 内容（**⚠️ 沿用记录，本轮未复核**） |
|---|---|
| 批二十一（`:75`） | 中级 **U53–U68 是 16 课连续块**：`53 Verb + -ing (enjoy doing / stop doing etc.)`／**`54 Verb + to… (decide to… / forget to… etc.)`**／`55 Verb (+ object) + to…`／`56–58 Verb + -ing or to… 1/2/3`／…／`67 see somebody do and see somebody doing`／`68 -ing clauses` |
| 批十五／批十六 | **中级 U56／U57（try, need, help）——三词共用格** |
| 批十／十二／十六 | **初级 U52 逐字 `I want to do and I enjoy doing`**；初级 U53 `want you to／told you to` |

**⇒ 从沿用记录能读出三条（均标「未核实」）**：
1. **初级册：`want to` 与 `enjoy doing` 在 U52 同一课对照**——**即「一个 to 门 vs 一个 -ing 门」是初级册的原始设计**，与我方 L15／L45 的先后顺序**同构**。
2. **中级册：`decide to` 独占 U54**（标题 `Verb + to… (decide to… / forget to… etc.)`）。
3. **中级册：`try` 没有独立格**，只在 U56／U57 与 `need`／`help` 三词共用。

**⚠️ 任务书特别要求核实「Murphy 初级 `Verb + to ...` 单元」——本轮无法核实。** 能说的只有：按批十／十二／十六记录，**初级册没有单独的 `verb + to` 单元**，只有 U52（to 与 -ing 对照）；**中级册才有 U54 这个专课**。**若要断言，须人工翻书**（§5 项 1）。

### 1.2 Cambridge 语法侧 —— **无独立页，只有「大类页里的 h2」**

**① 任务书问的 `Verb patterns: verb + infinitive` 或 `Verb + to-infinitive` 是否有独立页？**

**本轮实测：❌ 没有独立页。**

**✅ 真页（2 个）**：`verb-patterns-verb-infinitive-or-verb-ing`（**本批主落点**）／`word-patterns-hope`——title 逐字分别为 `Verb patterns: verb + infinitive or verb + - ing ? - Cambridge Grammar`／`Word patterns: hope - Grammar - Cambridge Dictionary`。

**⚠️ 同页别名（5 个，200）**：`verb-patterns-verb-infinitive`／`verbs-followed-by-to-infinitive`／`verbs-followed-by-a-to-infinitive`／`verb-infinitive`／`verb-patterns-verb-ing`——**五者 title 与 h1 逐字与主落点完全相同**。

**❌ 不存在（302 → `/grammar/british-grammar/`）**：`verbs-followed-by-the-infinitive`／**`decide`**／**`try`**／**`word-patterns-decide`**／**`word-patterns-try`**／`word-patterns-learn`／`verb-patterns-try`／`try-to-do-try-doing`／`try-ing-or-to-infinitive`／`try-infinitive-or-ing`／`try-to-infinitive-or-ing`。

**⚠️ 方法学坑实证（本批踩到并核对）**：**五个不同 slug 全部返回 200 且 title／h1 逐字相同**（h1 一律 `Verb patterns: verb + infinitive or verb + -ing?`）——**这正是任务书预警的「对不存在 slug 返回 200 ＋ 邻近页」**。**唯一区分办法是核 title／h1**（本轮已逐一核对，故上述判定可靠）。

**② 页面结构（h1／h2／h3 数）**

**`verb-patterns-verb-infinitive-or-verb-ing`（本批主落点）**：**H1＝1**（`Verb patterns: verb + infinitive or verb + -ing?`）；**H2＝6（按原序）**：**`Verbs followed by a to-infinitive`**／`Verbs followed by -ing`／`Verbs followed by a to-infinitive or -ing`／`Verbs followed by an infinitive without to`／`Verbs followed by -ing or an infinitive without to`／`Verbs followed by a direct object and a to-infinitive`；**H3＝7（按原序）**：`-ing but not to-infinitive`／`New subject before -ing`／`Hate, like, love, prefer`／`…with would or should`／**`To-infinitive or -ing form with a change in meaning`**／`Let, make`／`Help`

**⇒ 结构判读（本批关键）**：**`verb + to` 家族没有自己的 h1 页**，它**只是这个大类页的 H2-1**。**而 `try` 的变义辨析落在一个 H3**（`To-infinitive or -ing form with a change in meaning`）——**H3 低于 H2，即上游认为「变义」是 H2-3 内部的次节，不是独立单元**。

**`to-infinitive`（title 逐字 `Infinitives with and without to - Cambridge Grammar`）**：**H1＝1／H2＝3**（`Form`／`To-infinitive`／`Infinitive without to`）**／H3＝1**（`Typical errors`）。**⇒ 本批发现的另一处 `verb + to` 落点**：`To-infinitive` 的 H2 里逐字给出**一份 33 词名单**（见 §2.1），**并明写 "`We use the to-infinitive after a number of common main verbs.`"**

**③ `hope` 有独立页（结构类）；`learn` 有独立页但**不是结构页****

| 页 | title 逐字 | H1／H2 | 性质 |
|---|---|---|---|
| `hope` | `Hope - Grammar - Cambridge Dictionary` | **1／2**（`Hope as a verb`／`Hope as a noun`） | **真独立页**，含 Warning ＋ `Not:` |
| `word-patterns-hope` | `Word patterns: hope - Grammar - Cambridge Dictionary` | **1／0** | **真独立页**（`… > Word patterns`） |
| `learn` | **`Word choice: learn, teach, or study? - Cambridge Grammar`** | **1／0** | ⚠️ **「词义辨析」页，不是结构页** |
| `verb-patterns`（索引） | `Verb patterns - Grammar - Cambridge Dictionary` | 1／0 | **索引**，含 **`Verb patterns: verb + infinitive or verb + -ing?`** |

**⚠️ `decide` 与 `try` 在 Cambridge 语法侧「每一条路都断」**：无 `/grammar/british-grammar/decide`（302）／无 `try`（302）／无 `word-patterns-decide`／`word-patterns-try`（302）；**`Word patterns` 索引正文逐字检索：两词均 0 命中**。**⇒ 二者的唯一落点，就是 H2-1 词阵里的一个词 ＋ H3 变义小节里的一个词。**

### 1.3 BC —— **`try` 有一条本批新发现的独立课程位**

**⚠️ BC 直连全程 403（本轮实测：`curl` 各 UA／HTTP1.1／HTTP2 一律 `000` 或 `403 size:469`；Googlebot UA 亦 403）——**全部经 WebFetch 取得**。**WebFetch 返回的是模型转述**，逐字可靠性低于直连 HTML，**本轮凡关键逐字均标注来源页题**（§5 项 3 登记）。

**① 任务书问的 `Verbs followed by the infinitive` 或 `Verb patterns` 是否有独立参考页？**

| BC 页 | title 逐字 | 层级 | 判定 |
|---|---|---|---|
| **`/grammar/a1-a2-grammar/verbs-followed-ing-or-infinitive`**（＝`/free-resources/grammar/a1-a2/…`） | `Verbs followed by '-ing' or infinitive` | **A1 Elementary ＋ A2 Pre-intermediate** | ✅ **课程位** |
| **⭐ `/grammar/b1-b2-grammar/verbs-followed-ing-or-infinitive-change-meaning`** | `Verbs followed by '-ing' or infinitive to change meaning` | **B1 Intermediate ＋ B2 Upper intermediate** | ✅ **课程位（本批新发现）** |
| `/grammar/english-grammar-reference/to-infinitives` | `'to'-infinitives \| LearnEnglish` | beginner／intermediate／advanced **三档同页** | ✅ **参考页** |
| 参考层 `clause-structure-and-verb-patterns`／`ing-forms` | 各自 title 见附录 A.3 | — | ⚠️ **均无 to-inf 名单** |

**② A1-A2 第 18 课（课程位）逐字结构 —— `Verbs followed by '-ing' or infinitive`（`Level: A1 Elementary` ＋ `A2 Pre-intermediate`）**

- H2 逐字：`Grammar explanation`／**`Verbs followed by the -ing form`**／**`Verbs followed by to + infinitive form`**／`Language level`。**`…to + infinitive form` 正文逐字**：**"When want, learn and offer are followed by another verb, it must be in the to + infinitive form."**；例句 **`I want to speak to the manager.`**／**`She's learning to play the piano.`**／**`He offered to help us wash up.`**；**副名单逐字**：`afford, agree, ask, choose, `**`decide`**`, expect, `**`hope`**`, plan, prepare, promise, refuse and would like`。
- **`-ing` 组名单逐字**：`enjoy, admit and mind` ＋ `avoid, can't help, consider, dislike, feel like, finish, give up, miss, practise and suggest`；**⚠️ 同页明文** `Like and love can be followed by the -ing form and the to + infinitive form.`；**⚠️ `try` 与 `need` 都不在这页**（**`try` 在 A1-A2 层课程位＝0**）。

**⇒ 「课程位」直接证据**：`learn` 与该课标题 `to + infinitive` **同列**，`decide`／`hope` 在该课正文名单里。

**③ ⭐ 本批新发现：BC B1-B2 有一课专治「变义」——`/grammar/b1-b2-grammar/verbs-followed-ing-or-infinitive-change-meaning`**（title 逐字 **`Verbs followed by '-ing' or infinitive to change meaning'`**；**`Level: B1 Intermediate` ＋ `B2 Upper intermediate`**）

- H2 逐字：`Grammar explanation`；**下设 verb 小标题 `stop`／`try`／`remember/forget`**。**`try` 小节逐字**：**`try + -ing` ＝ "you are trying something as an experiment"**（`Have you tried turning the computer off and on again?`）；**`try + to + infinitive` ＝ "something is difficult but you are making an effort to do it"**（`I'm trying to learn Japanese but it's very difficult.`）
- `stop` 小节逐字：`-ing` ＝ "the action ends"／`to + infinitive` ＝ "pausing one activity to do another"；`remember/forget` 小节逐字：`-ing` ＝ 记忆／`to + infinitive` ＝ 记得要做。**⚠️ 该页另有用户评论（moderator `Peter M.`）补了 `go on`／`regret`／`mean`／`see/watch/hear` 等——但这是评论，不是正文。**

**⇒ 这条发现推翻批三十六对 `try` 的判定。** 批三十六写「**`try` 课程位 ❌**（BC 正文名单 0）」——**该明证在 A1-A2 第 18 课成立，但 BC 在 B1-B2 另开了一课**。

**④ BC 三档全目复点**

| 档 | 课数 | `learn`／`decide`／`hope`／`try` 命中 |
|---|---|---|
| **A1-A2** | **18** | `learn` ✅（正文主例词）／`decide` ✅（副名单）／`hope` ✅（副名单）／**`try` ❌** |
| **B1-B2** | **36** | **`try` ✅（专节正文）**；`learn`／`decide`／`hope` ❌ |
| **C1** | **14** | ❌ 全无 |

**⇒ BC 侧课程位结论**：**`learn`：A1-A2 ✅（最实，正文主例词）**；**`decide`／`hope`：A1-A2 ⚠️（副名单级）**——**不是该节三个主例词**（主例词是 `want`／`learn`／`offer`）；**`try`：B1-B2 ✅（专节级，全库唯一）——但它教的是变义，不是 `to`。**

### 1.4 词典标位 —— **必须 `epp-xref` span 同时存在才可引用（本轮全部满足）**

**⚠️ 方法学坑复核**：批三十四登记 `cdo_elvl` 单次取值会抖动（`as-long-as` 5 次取到 5 个不同档），**引用规则＝须 `epp-xref` span 同时存在**。**本轮五词实测**：

| 词 | `cdo_elvl` | **`epp-xref` span 数** | **逐字序列** | **首义定义逐字（本批相关义项）** | 判 |
|---|---|---|---|---|---|
| **`want`**（对照） | `A1` | **1** | `A1` | ① "to wish for a particular thing or plan of action. \"Want\" is not used in polite requests:" | **A1** |
| **`learn`** | `A1` | **4** | `A1, B1, B2, B1` | ① "to get new knowledge or skill in a subject or activity:" | **A1** |
| **`decide`** | `A2` | **2** | `A2, C2` | ① "to choose something, especially after thinking carefully about several possibilities:" | **A2** |
| **`hope`** | `A2` | **2** | `A2, B1` | ① verb "to want something to happen or to be true, and usually have a good reason to think that it might:" | **A2** |
| **`try`** | `A2` | **4** | `A2, B1, C2, B2` | ① "to attempt to do something:" ／ **② "to test something to see if it is suitable or useful or if it works:"** | **A2／B1** |

**⇒ 五词全部满足「`epp-xref` span 实存」，且首义 `epp-xref` 与 `cdo_elvl` 逐字一致——标位可引用，本轮未复现抖动。**

**⇒ 标位判读（本批两条结论）**：
- **`learn` 的 `learn to do` 义是 A1**（**与 `want` 同级**）；**`decide`／`hope`／`try` 与 `want` 只差一档**（A2 vs A1）——**四词与 `want` 的标位差距最大只有 1 档**。
- **⚠️ `try` 的「试着做」（`test something`，义②）是 B1**——**比「努力做」（`attempt`，义① A2）高一档**。**这是 `try to do` vs `try doing` 语义分工在词典标位上的直接投影**（§3.4 展开）。

**⚠️ 同表登记的对照**：**若以「标位差 ≤1 档」为「同轴」的量化判据，四词全部落在 `want` 的邻域内**——**这是 §2 判定的第四条独立证据**。

---

## §2 「同义换词 vs 新结构」甄别（本项目核心红线）

### 2.1 判据一：跨源是否把它们列在同一张名单里？—— **四源同名单，逐字**

**这是本批最重要的判定，且证据是「多源同一形态」的**：

#### 证据 A＋B：Cambridge **两份独立名单**（`verb-patterns-verb-infinitive-or-verb-ing` 的 H2-1 纯词阵 ＋ `to-infinitive` 的 `To-infinitive` H2 名单）

**A（H2-1 词阵，逐词按原序）**：`afford, demand, like, pretend, agree, fail, love, promise, arrange, forget, manage, refuse, ask, hate, mean (= intend), remember, begin, help, need, start, choose,` **`hope`**`, offer,` **`try`**`, continue, intend, plan,` **`want`**`,` **`decide`**`,` **`learn`**`, prefer`

**B（`to-infinitive` 页 H2）**："**We use the to-infinitive after a number of common main verbs. These include:**" ＋ `agree, demand, long, pretend, aim, fail, love, promise, arrange, forget, manage, propose, ask, hate, mean, refuse, begin, help, need, remember, choose,` **`hope`**`,` **`offer`**`,` **`try`**`, claim, intend, plan,` **`want`**`, continue,` **`learn`**`, prefer, wish,` **`decide`**`, like, prepare`；紧随其后 **"Some of these verbs are also often followed by -ing."**

**⇒ 五个词在同一个 H2 的同一张名单里，无任何分类标记、无任何子分组；B 只是 A 的变体（多出 `long`／`aim`／`propose`／`claim`／`wish`／`prepare`）。**

#### 证据 C：BC A1-A2 第 18 课正文（**课程页级**）

> "**When want, learn and offer are followed by another verb, it must be in the to + infinitive form.**" ／ 主例 `I want to speak to the manager.` ／ `She's learning to play the piano.` ／ `He offered to help us wash up.` ／ 副名单 `afford, agree, ask, choose, decide, expect, hope, plan, prepare, promise, refuse and would like`
> **⇒ `want` 与 `learn` 是同一句正文里的并列主例词；`decide`／`hope` 同名单。**

#### 证据 D：BC 参考层 `to-infinitives`（**三档同页**）＋ OALD ＋ 中文侧

- **BC 参考层**：H2 `Verbs with to-infinitives` 之下小标题 **"Verbs of thinking and feeling followed by to-infinitive"**，名单逐字 **`choose, decide, expect, forget, hate, hope, intend, learn, like, love, mean, plan, prefer, remember, want, would like/love`**；另两小节 `Verbs of saying`／`Verbs + object + to-infinitive`。
  **⇒ ⚠️ 本批最有意思的一条**：**BC 参考层把四词整体装进一个语义类别**（"Verbs of thinking and feeling"）——**这是唯一一处上游给它们做了分类的地方，而依据是「心理活动」（语义），不是句法**。**语义分类 ≠ 句法分类；它们的句法行为在该页仍完全一致（都跟 to-infinitive）。**
- **OALD**：`hope` 词条内表格 **`Verbs usually followed by infinitives`** 逐字 **`afford, agree, appear, arrange, attempt, beg, choose, consent, decide, expect, fail, happen, hesitate, hope, intend, learn, manage, mean, neglect, offer, prepare, pretend, promise, refuse, swear, try, want, wish`**——**五词（连同 `want`）同表**。⚠️ **本轮新取的第四源**（历史批次未用过 OALD 这一表格）。
- **中文侧 `english.cool/gerund-infinitive-verb/`**（title 逐字「動詞後面要接 V-ing 還是 to V.?（動名詞 vs. 不定詞）」）：H3 四节逐字 `1. 搭配 to V. 的動詞`／`2. 搭配 V-ing 的動詞`／`3. 搭配 to V. 或 V-ing 意思不變的動詞`／**`4. 搭配 to V. 或 V-ing 意思不同的動詞`**；**第 1 节表格逐字（按原序）** `agree`／`hesitate`／`resolve`／`attempt`／**`hope 希望`**／`strive`／`choose`／**`learn 學習`**／`struggle`／**`decide 決定`**／`manage`／`tend`／`expect`／`need`／`volunteer`／`fail`／`plan`／`wait`／`guarantee`／`refuse`／**`want 想要`**；**引言逐字**「**因為其實遇到大部分的動詞與動詞之間都會用 to 來隔開，所以原則上不必刻意去記哪些動詞要搭配不定詞**」。
  **⇒ 四词（含 `want`）在中文侧第 1 节同一张表里**——**而第 4 节「意思不同」的名单只含 `remember`／`forget`／`stop`／`regret`／`try`／`go on`，`learn`／`decide`／`hope` 不在。**

### 2.2 判据二：跨源是否强调四词与 `want` 的行为**完全一致**？

**逐条对齐**（我方 L15 教的规则 vs 四词的跨源规定）：

| 维度 | 我方 L15 逐字 | 四词的跨源逐字 | 判 |
|---|---|---|---|
| **后接形式** | `grammarLabel: "want to + 原样"`；`oneLineRule: "「想做……」= want to + 原样：I want to travel。want 后面要垫一块小垫板 to。"` | Cambridge `To-infinitive` H2 "**We use the to-infinitive after a number of common main verbs. These include:**" ＋ 名单含五词；BC "**it must be in the to + infinitive form**" | ✅ |
| **`to` 后动词形式** | 逐字「**to 后面的动词永远穿原样：want to go、wants to go、wanted to go——变的只有 want 自己，to 后面从不动**」 | Cambridge `To-infinitive` H2 "**The to-form consists of to plus the base form of the verb**" | ✅ |
| **禁止省 `to`** | 对比卡 `wrong: "I want to going home."` → `correct: "I want to go home."` | **`word-patterns-want` 逐字**："**When want is followed by a verb, that verb cannot be in the infinitive without 'to'. Do not say 'want do something', say want to do something.**" ＋ 错例 `Some women do not want stay at home …` → 正例 `… do not want to stay …` | ✅ |
| **否定式位置** | 逐字「**加了 don't，to 这块小垫板也不能丢：don't want to go。垫板和否定是两回事。**」 | **`word-patterns-need` 逐字**："**need must be followed by the infinitive with to. Don't say 'need do something', say need to do something**: `Dave needs improve his French.` → `Dave needs to improve his French.`" | ✅ |
| **疑问式** | 逐字「**想问别人「想不想」，把 Do 搬到句首：Do you want to play？**」 | 上游未对四词单列疑问规则——**因规则与 `want` 相同，无需另立** | ✅ **（无差异即为证据）** |

**⇒ 五条维度全部一致。四词与 `want` 的语法行为没有一条差别。**

### 2.3 判定：**「同一句法槽位换词」，不是新结构**

**六条证据链汇总**：

| # | 证据 | 强度 |
|---|---|---|
| **1** | **五词在同一张名单里，无分类标记**：Cambridge H2-1 词阵 ＋ Cambridge `To-infinitive` H2 名单 ＋ BC A1-A2 正文名单 ＋ BC 参考层同小节 ＋ OALD 同表 ＋ 中文侧同表 | **✅✅ 六处独立同名单** |
| **2** | **结构规则只有一条，且与我方 L15 逐字同型**（`动词 + to + 原形`）：Cambridge `Form` 段 ＋ BC 正文 ＋ LDOCE `Patterns` 框 | **✅✅** |
| **3** | **上游把「四词要立课」本身否掉了**——四词无一在 Cambridge 语法侧有自己的结构页（全部 302 或退化为 `Word choice` 辨析页）；**`decide`／`try` 在 `Word patterns` 索引里 0 命中**（19 个 slug 探测 ＋ 索引正文逐字检索） | **✅✅** |
| **4** | **标位层面**：CEFR 与 `want` 只差 ≤1 档（`want` A1／`learn` A1／`decide`·`hope`·`try` A2，五词 `epp-xref` 逐字）；**中文侧直接写明「不必刻意记」**——逐字「**因為其實遇到大部分的動詞與動詞之間都會用 to 來隔開，所以原則上不必刻意去記哪些動詞要搭配不定詞**」 | **✅✅** |
| **5** | **我方已把它当同一条规则教过四次**：L15（`want to`）→ L160（`seem to`，逐字「**同一个 to 垫板**」）→ L161（`need to`，逐字「**后面请 to 垫一下……（第 15 课的老规矩）**」）→ L173（`in order to`，逐字「**它和第 44 课那块小垫板 to 是一家人**」） | **✅✅ 三次确认「同一个垫板」** |

**⇒ 最终判定**：

> **`learn to`／`decide to`／`hope to`／`try to` 与 `want to` 是同一句法槽位换词，不是不同的结构。**
> **三个证据层次同时指向这一结论**：**上游层面**（六处同一名单、上游明确说「不必刻意记」、四词无独立结构页）、**标位层面**（差 ≤1 档）、**我方层面**（已三次以「同一个 to 垫板」的口径教过 `seem`／`need`／`in order to`）。

**⇒ 由此推出的硬约束（本项目红线）**：**若只是换词，课量必须封顶。**

**理由（三条）**：① **边际信息量趋零**——新课的唯一新信息是「又有一个动词能踩这块垫板」，与我方 L160／L161 **同形态**；② **上游先例**——**BC 把 `learn`／`decide`／`hope` 与 `want` 合在一课，Cambridge 把五词放在同一张词阵里，上游从没给任何一词单独排过课**；③ **撞已判硬伤**——批十九／批二十已判「第 4 课起只能换词」为硬伤，而 `verb + to` 同轴已 5 课（L15／L44／L160／L161／L173）。

**⚠️ 但有一条例外线索**：**`try` 的 `try to do` vs `try doing` 是「同一槽位的两个不同结构」，不是换词**（§3.4／§4.3）。**这是本批唯一的真结构增量，也是课量建议的唯一支点。**

---

## §3 这四词的跨源差异（逐词）

### 3.1 `learn` —— **没有独立小节；有 `learn about`／`learn from` 等搭配；四词中唯一无禁令**

**① 任务书问「`learn` 是否有 `learn to do` 的独立小节？」→ ❌ 没有。**（title 逐字 `LEARN | English meaning - Cambridge Dictionary`；**H1＝1（`Meaning of learn in English`）／无 H2 级结构小节**——**`learn to` 只是 `examp dexamp` 语法标签之一**。）

**② 任务书问「`learn` 还有 `learn about`／`learn from` 等搭配吗？」→ ✅ 有，且是四词中最多的。** 语法标签逐字（按原序）＋例句：

| 标签逐字 | 逐字例句 |
|---|---|
| **`[ + to infinitive'`** | **`I'm learning to play the piano.`** |
| **`'learn to'`** | **`She soon learned not to contradict him.`** |
| `'[ + question word'` | **`First you'll learn (how) to use this machine.`**／`I don't know how actors manage to learn all those lines.` |
| **`'learn about'`**（**出现 2 次**）／**`'learn of'`** | `I've learned a lot about computers since I started work here.`／`We were all shocked to learn of his death.` |
| **`'learn from'`** | `learn from your mistakes` ／ **`He's not afraid to learn from his mistakes.`** |
| `'learn something'`／`'[ + (that)'` | `We were told to learn Portia's speech by heart (= be able to say it from memory)`／`She'll have to learn that she can't have everything she wants.` |

**⇒ `learn to do` 没有独立小节，但有 `[ + to infinitive ]` 标签**（**等同于结构标记，只是不升为小节**）。**⚠️ 且这是 `learn` 的一个真实复杂度**：**光说「`learn to` + 原形」并不能覆盖 `learn about`／`learn from`／`learn of`／`learn (how) to` 四个搭配**——**若立课，这个「多搭配」属性反而是风险**（只教 `learn to`，用户遇到 `learn about` 会困惑；都教，一课承载超先例）。

**③ LDOCE 的明文禁令（`learn` 的唯一禁令来源）**

> **`GRAMMAR: Patterns with learn`** • **You learn to do something**: `She's learning to play the piano.` • **You learn how to do something**: `She is learning how to play the piano.` • **✗Don't say: She is learning playing the piano.**

**⇒ 它是「`learn doing` ❌」（不接 -ing），与 `want`／`need` 的「丢 to」禁令**不同型**；且只出现在 LDOCE，**Cambridge 侧 `learn` 零禁令**。**

**④ Cambridge 语法侧的落点是「词义辨析」，不是结构**

`Word choice: learn, teach, or study?`（title 逐字；面包屑 `Grammar > Common mistakes in English > Word choice >`）逐字："**To learn is to get new knowledge or skills.**"（`I want to learn how to drive.`）／"**When you teach someone, you give them new knowledge or skills.**"（`My dad taught me how to drive.`）／"**When you study, you go to classes, read books, etc. to try to understand new ideas and facts.**"；**错例卡** `My dad learnt me how to drive.`（**`learnt` 误用为 `teach`**）／**对照卡** `I'm learning.` ↔ `I'm studying.`

**⇒ 该页教的是「learn vs teach vs study 的词义分工」，`learn to + 原形` 只在例句里出现（`I want to learn how to drive.`），不是被讲解的对象。⇒ `learn` 在 Cambridge 语法侧无结构页。**

**⑤ OALD 补充（第 3 源）**：`learn to do something`（`He's learning to play the trumpet.`／`Most people learn to read as children.`）／`learn how to do something`（`Today we learnt how to use the new software.`）／**`learn (something) from doing something`**（`You can learn a great deal just from watching other players.`）／`learn (about something)`（`She's very keen to learn about Japanese culture.`）

**⑥ 档位裁定：`learn` 给 B−（比批三十六降一档）**

| 判据 | 结果 |
|---|---|
| 课程位 | **BC A1-A2 第 18 课 ✅（最实，正文主例词）**；Murphy 未核实 |
| 规则页（结构类） | **❌ Cambridge 无**；**只退化为 `Word choice` 辨析页** ＋ `[ + to infinitive ]` 词典标签 |
| **禁令（可标记错的来源）** | **⚠️ Cambridge 0；LDOCE 1（`learn playing` ❌）** |
| CEFR | **A1**（`learn to do` 义） |
| 我方成本 | `learn` GL 0，须造词位（**`diaryQuestions.ts` 有 `hint: "I want to learn ______ ."` 可作认读垫子**） |

**⇒ 降档理由**：**四词中唯一在 Cambridge 结构侧完全无落点者**，且**「多搭配」（about／from／of／how to）使单课承载变复杂**。**BC 课程位仍在，故保 B−（不可降 C）。**

### 3.2 `decide` —— **`decide + to` 是首选吗？——上游未以「首选」措辞表述，但 `[ + to infinitive ]` 在标签序中排第一**

**① 任务书问「跨源是否强调 `decide + to` 是首选？」→ ❌ 未强调。** Cambridge 词典条目（title 逐字 `DECIDE | English meaning - Cambridge Dictionary`）的标签序逐字按原序：`'[ + to infinitive'` ／ `'[ + (that)'` ／ `'[ + question word'` ／ `'decide in favour of'`——**`[ + to infinitive ]` 虽是三组从句标签中最先列出的，但 Cambridge 未用「preferred」／「more common」／「首选」任何措辞**。**只能给「标签序第一位」这一形态证据（弱证据，须诚实标注）。** 例句逐字：**`In the end, we decided to go to the theater.`**

**② `decide on` 是一个独立的 phrasal verb 条目 ＋ `decide` 的搭配分工**

- Cambridge `/dictionary/english/decide-on`（title 逐字 `DECIDE ON SOMETHING/SOMEONE - Cambridge English Dictionary`）：**定义逐字 `to choose something or someone after careful thought:`** ／ 例句 **`I've decided on blue for the bathroom.`**；Cambridge 词典 `decide` 页内也把它挂为 **`Phrasal verb decide on something/someone`**（**与主动词条目分开**）。
- **⚠️ `decide on` 后接名词／代词（`decided on blue`），不是 `decide on doing`**——**`decide against doing` 才是 -ing 形式**（OALD 逐字 `decide against doing something` ＋ **`They decided against taking legal action.`**）。

| 结构 | 后接 | 逐字例句 | 来源 |
|---|---|---|---|
| `decide to do` | **to + 原形** | `In the end, we decided to go to the theater.`／`We've decided not to go away after all.` | Cambridge／OALD |
| `decide on sth` | **名词／代词** | `I've decided on blue for the bathroom.` | Cambridge（独立条目） |
| `decide against doing` | **-ing** | `They decided against taking legal action.` | **OALD 逐字** |
| `decide (that) …`／`decide wh-` | 从句 | `She decided that she wanted to live in France.`／`He can't decide whether to buy it.` | OALD／Cambridge |

**⇒ ⚠️ `decide` 是四词中「搭配最分歧」的一个**——**三者并存，且介词变化时后接形式跟着变。**

**③ 中文侧 `decide` 的落点是「同义辨析」**（不是结构）：`english.cool/decide-determine-resolve/`（200，title 逐字「【決定英文】decide、determine、resolve 差在哪？怎麼用？」）——H2 逐字 `Decide`／`Determine`／`Resolve`／`That's it, folks!`；H3（Decide）`1. 表「決定」的意思`／`2. 表「決定／導致⋯⋯結果」的意思`。**⇒ 中文侧把它归入「近义词辨析」，不是「to + 原形」规则**——**⚠️ 与 `hope` 的中文侧落点（独立专文＋明文禁令）形成明显反差**；**`english.cool/decide/` 是 301 → 该页（本轮实测），confirm 无独立结构文。**

**④ 档位裁定：`decide` 给 B（持平），但理由与批三十六不同**

| 判据 | 结果 |
|---|---|
| 课程位 | BC A1-A2 第 18 课 ⚠️（副名单级）＋ **Murphy U54 标题即 `decide to…`（沿用记录·未核实）** |
| 规则页（结构类） | ⚠️ **只有 H2-1 词阵里的一个词** ＋ BC 副名单；**无独立页** |
| CEFR | **A2**（`epp-xref` 实存） |
| **我方成本** | **⚠️ 词位 GL 0，但**`library-gate-4` 已有输出位**（§0.2） |
| **⚠️ 搭配分歧** | **`decide on`（名词）／`decide against -ing` 并存** |

**⇒ 持平 B，但理由更新**：**批三十六给 B 靠的是「Murphy U54 ＋ BC 名单」；本轮 Murphy 不可核实，B 的依据改为「BC 名单 ＋ 我方已有未交付的输出位」（§0.2 的 `library-gate-4`）。**

### 3.3 `hope` —— **`hope to do` vs `hope that` 有规定；「hope 不用 hope doing」有明文禁用；且另有一条否定式禁令**

**① `hope to do` vs `hope that` 的规定 —— ✅ 成立，且是「两者都对、`that` 可省」**（**不是「选一个」的对立**）

- **Cambridge `expect-hope-or-wait`**（title 逐字 `Expect, hope or wait ? - Grammar - Cambridge Dictionary`）："**We use hope when we do not know whether something will happen or not but we want it to happen. We use hope in the following patterns:**" ＋ **`hope + to-infinitive`**（`I think you were hoping to see your family next week.`）／**`hope + that clause`**（`I hope that your sister recovers quickly from the operation.`）／**`hope + for`**（`We've already got two boys so we're hoping for a girl.`）
- **Cambridge 词典 `hope`**（title 逐字 `HOPE | English meaning - Cambridge Dictionary`）：语法标签逐字按原序 `'hope for'`／`"She's hoping (that) she won't be away too long."`／`"I hope (that) she'll win."`／**`'[ + to infinitive'`**／`'hope so'`／`'hope not'`；**`[ + to infinitive ]` 例句 `They hope to visit us next year.`**
- **LDOCE `hope` · `GRAMMAR: Patterns with hope`**：• **You hope to do something**: `We're hoping to get tickets to the concert.` • **✗Don't say: I hope see you soon.** • **You hope that something happens**: `I hope that the rain stops soon.` • **You hope that something will happen**: `I hope that the weather will be fine.` • **You hoped that something would happen**: `She hoped that the weather would be fine.` • **In more formal English, you say it is hoped that something will happen** • **In all the above patterns, 'that' is often omitted, especially in spoken English**
- **OALD `hope`**：`hope to do something`（`She is hoping to win the gold medal.`／`We hope to arrive around two.`）；**标签 `[transitive] hope to do something to intend to do something if possible`**

**② 「hope 不用 hope doing」的禁用 —— ✅ 明文成立（两处独立）**

- **Cambridge `word-patterns-hope` 专页**（title 逐字 `Word patterns: hope - Grammar - Cambridge Dictionary`；面包屑 `Grammar > Common mistakes in English > Word patterns > Word patterns: hope`；**H1＝1，H2＝0**）：**"When the verb hope is followed by another verb, that verb must be in the infinitive with 'to'."** ＋ **"Don't say 'hope to doing something', say hope to do something:"** ＋ 错例 **`I hope to hearing from you soon.`** ／ 正例 **`I hope to hear from you soon.`**
- **LDOCE `hope`**：**`✗Don't say: I hope see you soon.`**（**另一个方向的错：丢 to**）

**⇒ ⚠️ 两源命中的是**同一规则的两个不同错面****：**Cambridge 治「`hope to doing`（错形）」；LDOCE 治「`hope see`（丢 to）」**。**这对可标记错的构造非常有利**——**同一规则可以出两道不同的错**。

**③ ⚠️ `hope` 有一条**独特的第三条禁令**（否定式），且**双源同型****

- **Cambridge `hope`**（title 逐字 `Hope - Grammar - Cambridge Dictionary`；**H1＝1／H2＝2**）：**Warning 逐字**"**We don't normally use hope in the negative:**" ＋ `I hope it doesn't rain.` ＋ **`Not: I don't hope it rains.`**；另："**After hope, we often use present verb forms even when there is reference to the future:**"（`We hope she passes her driving test next week.`）；"**The past continuous of hope is used to make polite statements and, especially, polite requests**"
- **中文侧 `english.cool/hope/`**（200，title 逐字「Hope的正確用法？跟Wish的差別在哪？」；H2 五条）：**禁令逐字**「**⚠️特別要提醒大家：Hope不可用於否定句🚫**」＋ **错例 `I don't hope it snows.❌`**／**正例 `I hope it doesn't snow.✅`** ＋ 第二对 **错例 `We don't hope you waste your time on video games.❌`**／**正例 `We hope you don't waste your time on video games.✅`** ＋ 说明逐字「**記得要把否定放在後面的「名詞子句」裡喔～**」

**⇒ 「双源同禁令」在本轮**再次成立**（不是首例，是**第二次**——批三十六已记过一次）。**且中文侧给的是**两条**错例（Cambridge 一条），**证据更厚**。

**④ OALD 的一条独特规定**：`Hope can be used in the passive in the form it is hoped that…`（**被动式规定，其他三词无**）。

**⑤ 档位裁定：`hope` 给 B，且是四词中「证据最厚」的一个**

| 判据 | 结果 |
|---|---|
| 课程位 | BC A1-A2 第 18 课 ⚠️（副名单级） |
| **规则页（结构类）** | **✅✅ 两页**：`Hope`（**Warning 1 条 ＋ `Not:` 1 条**）＋ `Word patterns: hope` 专页（**明文 `Don't say`**） |
| **禁令（可标记错）** | **✅✅ 三条**：① `I don't hope it rains.` ❌（**双源**）② `I hope to hearing from you.` ❌（Cambridge 逐字）③ `I hope see you soon.` ❌（LDOCE 逐字） |
| CEFR | **A2**（`epp-xref` 实存） |
| 我方成本 | `hope` GL 0，须造词位；**但 `runes.ts:254` 已有 spells `We hope to see you.`** |

**⇒ 维持 B。`hope` 的四词中「可标记错供应」最充足的一个（3 条，其中 1 条双源）。**

### 3.4 ⭐ `try` —— **`try to do` vs `try doing` 的区别：四源独立成立，本批唯一真结构增量**

**⚠️ 任务书判断正确：这是跨源有名的辨析点。本轮在四个源上独立确认，且发现批三十六的判定须上修。**

**①② Cambridge 语法侧两处 ＋ 词典同义项并存**

- **H2-1 `Verbs followed by a to-infinitive` 词阵**：含 **`try`**（同 `want`／`decide`／`learn`／`hope`）。
- **H3 `To-infinitive or -ing form with a change in meaning`**（**H2-3 之下**）逐字："**Some verbs can be followed by a to-infinitive or the -ing form, but with a change in meaning:**" ＋ 名单逐字 **`go on, need, remember, try, mean, regret, stop, want`**。**`try` 的对照逐字**：`-ing` 侧 **`I tried searching the web and finally found an address for him.`**（释义 `I searched the web to see what information I could find.`）／`to` 侧 **`I tried to email Simon but it bounced back.`**（释义 `I tried/attempted to email him but I did not succeed.`）。**⚠️ `need`／`want` 亦在此名单，而 `learn`／`decide`／`hope` **不在**。**
- **Cambridge 词典 `try`（title 逐字 `TRY | English meaning - Cambridge Dictionary`）**：**同一个 A2 义项（`[ I or T ] to attempt to do something:`）下**同时**标出两个结构**——**`[ + to infinitive ] I tried to open the window.`** ／ **`[ + -ing verb ] Maybe you should try getting up (= you should get up) earlier.`**；**义项二（B1, `to test something to see if it is suitable or useful or if it works:`）只有 `[ + -ing verb ]`**（`Try using a different shampoo.`）。

**⇒ ⚠️ 关键**：**两个结构在同一个 A2 义项里并列，Cambridge 未在该处解释差别**（靠括号释义暗示）；**到 B1 义项二才只剩 `-ing`**。

#### ③④⑤ 另外三源：LDOCE 立框／BC 立课／中文侧立节

> **LDOCE `try` · `GRAMMAR: Comparison`**：
> **`try to do something`** • **If you try to do something, you attempt to do it:** `We must try to prevent this from happening again.`
> **`try doing something`** • **If you try doing something, you do it in order to find out if it is enjoyable or produces the result you want:** `I've never tried bungee jumping.` `Try using margarine instead of butter.`
>
> **BC B1-B2 课 `try` 小节**：**`try + -ing` ＝ "you are trying something as an experiment"**（`Have you tried turning the computer off and on again?`）；**`try + to + infinitive` ＝ "something is difficult but you are making an effort to do it"**（`I'm trying to learn Japanese but it's very difficult.`）——**全页逐字结构见 §1.3③，不重复。**
>
> **中文侧 `english.cool/gerund-infinitive-verb/` 第 4 节**：`try + V-ing`「**嘗試做…（想知道結果如何）**」（`I tried drinking coffee to keep awake, but it didn't work.`）；`try + to V.`「**努力去嘗試做…（通常意味著最後是不成功的）**」（`I tried to drink coffee, but I still found it disgusting.`）

**⇒ 四源中唯一一处把两个结构单独立框（LDOCE）／单独立课（BC）／单独立节（中文侧）的地方；措辞各异但语义分工一致。**

#### ⑥ 判定：**`try to do` vs `try doing` 的辨析 ✅ 成立，四源独立确认**

**语义分工在四源完全一致（措辞各异）**：**`try to do` ＝ 努力／尝试（常含未成）／`try doing` ＝ 试着做（看结果如何）**。
**⚠️ 第五源 OALD 是反例**：`try to do something`（`What are you trying to do?`／`I tried hard not to laugh.`）与 `try doing something`（`I tried calling him but there was no answer.`／`Just try getting a plumber at the weekend!`）**同条并存，无对比框**。

**⑦ 一条 OALD 独有的附加信息（`try and` 变体）**

> **"In spoken English `try and` can be used with another verb, instead of `try to` and the infinitive:** `I'll try and get you a new one tomorrow.` • `Try and finish quickly.` **In this structure, only the form `try` can be used**"（**即 `tries and`／`tried and` ❌**）

**⇒ ⚠️ 真实口语变体，带明确形态限制**（仅原形 `try` 可用）。**两源**（OALD ＋ LDOCE `try and do something` 标签：`Try and take some form of daily exercise.`）。**非结构，建议作 deepDive 单句认读，不单开课。**

**⑧ 档位裁定：`try` 给 B（**从 B− 上修**）**

**与批三十六的逐条对照**：① **课程位**——批三十六「❌ 无（BC 正文名单 0）」→ **本轮 ✅ 有（BC B1-B2 专课）**；② **规则页**——批三十六「⚠️ 半有（Cambridge H2-1 词阵）」→ **本轮 ✅ 两处**（H2-1 词阵 ＋ **H3 变义小节**）**＋ LDOCE `GRAMMAR: Comparison` 独立框**；③ **「变义是 B2 段内容」**（批三十六的降档主因）→ **⚠️ 部分修正**：**BC 把它排在 B1-B2 两档（不是纯 B2）**，且 Cambridge H3 与 LDOCE 均未标级（**WebFetch 实取 `Level: B1 Intermediate` ＋ `B2 Upper intermediate`**）；④ **成本**——GL 仍 0，**但 `seedWords.ts` 有 `trying to memorize`、`diaryQuestions.ts:105` 有 `I want to try ______ .`（已有认读垫子）**。

**⇒ 上修至 B。理由：`try` 是本批四词中唯一有真结构增量（两个结构 ＋ 语义分工 ＋ 可标记的两向错）的词，且 BC 给了它一个独立课程位——同时满足「有课程位」与「有规则页」两条 B 档判据。**

---

## §4 课量建议

### 4.1 ① 四词该开几课？—— **1 课（上限），且只收 `try`**

**先说「不做什么」，再说「做什么」**（这个顺序是本批的结论形态）。

#### A. ❌ **不做「四词合课」**（批三十六曾建议 2 课：`hope`/`decide` 一课 ＋ `learn`/`try` 一课）

1. **§2 已判定四词是「同槽位换词」**——**把四个换词合起来教，等于把「同一条规则的 4 个例句」包成一课**，与我方 L15／L160／L161／L173 已教过四遍的内容相比**没有任何新结构**。
2. **撞已判硬伤**：批十九／批二十已判「**第 4 课起只能换词**」为硬伤。**`verb + to` 同轴已有 5 课**（L15／L44／L160／L161／L173）——**再开 2 课 ＝ 第 6／7 次换词**。
3. **上游先例反证**：**BC 把 `learn`／`decide`／`hope` 与 `want` 合在一课；Cambridge 把五词放在一张词阵里——上游从没给这四个词排过任何独立课。我们要开的「2 课」比 BC 的课程颗粒度还细一倍。**

#### B. ⚠️ **不做「`decide to` 补课」**——但**必须做「接口收口」**（§0.2 的发现，**本批最需产品负责人注意的一条**）

**现状**：`library-gate-4` 要求用户打出 **`I decided to finish this chapter tonight.`**（`requiredPattern` 逐字），**而 GL 从未教过 `decide`**（GL 裸词 0）。**性质**：不是「缺一个词位」，而是「**已承诺用户能输出、却从未教过**」。

| 路径 | 内容 | 评价 |
|---|---|---|
| **B-1（推荐）** | **不新开课**，改**修 `library-gate-4` 的提示定位**：其 `counterExample` 已经是 `I decide to finish this chapter tonight.` ＋ `counterNote: "决定是刚才做的，decide 要带上 -ed 的痕迹：decided"`——**只需把它明确标为「时态复习」，并在提示里补一句「`decide` 和 `want` 一样踩 to 垫板」** | **成本最低（改 1–2 个字段）；且它本来就是时态关（`errorTag: "tense"`，不是 `to`）** |
| **B-2** | 开一课 `decide to` | ❌ **与 §2 判定冲突**（纯换词）；**且与 §4.1-A 同理撞硬伤** |

**⇒ 推荐 B-1。** **注意 `library-gate-4` 的 `errorTag` 本来就是 `tense`**——**说明上游设计者自己也没把它当 `to` 的教学位；它的问题只是「句子用了一个没教过的词」。**

#### C. ⭐ **推荐：1 课 —— `try to do` vs `try doing`（本批唯一真结构增量）**

**理由（四条，逐条对应 §2／§3）**：

1. **它是本批唯一不是「换词」的候选**——**是「一个动词的两个门，门后是两件事」**，与我方 L45（`enjoy` 的门「只认 -ing」）**同型但更进一层**（**L45 教「一扇门」，`try` 教「两扇门 ＋ 门后不同」**）。
2. **四源齐备**：**BC 独立课程位**（B1-B2 专课）＋ **LDOCE 独立对比框** ＋ **Cambridge H3** ＋ **中文侧独立节**。
3. **有天然的「两向可标记错」**：`I tried to open the window.` ↔ `Maybe you should try getting up earlier.`——**两个结构都在 Cambridge 同一个 A2 义项下**，**可出两向的错**。
4. **接得上我方已有的两课**：**L45（`enjoy` 只认 -ing）** 与 **L15（`want to + 原样`）**——**`try` 恰好站在两课中间**（**两扇门都开**），是**自然的对比位**。

### 4.2 ② 若要开，每课的跨源支撑是什么？

#### 候选课：`try` 的两扇门（建议编号 **L190** 或并入 `season-29`）

**A. 三条带标记新错（全部来自上游逐字）**

| # | 错句（逐字） | 正确句 | 标记 | 来源逐字 |
|---|---|---|---|---|
| **1** | `I tried drinking coffee, but I still found it disgusting.`（作「我努力想喝」义） | `I tried to drink coffee, …` | **`drinking`**（应为 `to drink`） | **中文侧第 4 节**：`try + to V.` ＝「**努力去嘗試做…（通常意味著最後是不成功的）**」 |
| **2** | `Have you tried to turn the computer off and on again?`（作「试试看」义） | `Have you tried turning the computer off and on again?` | **`to turn`**（应为 `turning`） | **BC B1-B2 课**：`try + -ing` ＝ "**you are trying something as an experiment**" ＋ 该例句 |
| **3** | `I tried to email Simon but it bounced back.`（作「试试看」义，**语义误配**） | `I tried emailing Simon but it bounced back.` | **`to email`** | **Cambridge H3**：`to` 侧释义 "**I tried/attempted to email him but I did not succeed.**" |

**⚠️ 生产提醒**：**对错依赖语义（试着手 vs 试着做），单句语法看不出错**——**3 条错句必须都带「语境说明」**（如「妈妈让你换个床垫试试」→ 该用 `try -ing`）。**这也是批十把「变义对」判难做的原因**（逐字：「**判定设计复杂（单句语义靠语境）。缓办。**」）。**⚠️ 该风险须主理人立项时决定是否接受。**

**B. 目标句候选（3 条，按「可标记 + 零术语 + 4 词内」筛选）**

| 候选 | 逐字 | 词数 | 评价 |
|---|---|---|---|
| **T-1（推荐）** | **`Try turning it off and on.`** | **6** | 改写自 BC 逐字例句，**去掉问句与 `have` 降低负荷**；场景自然（手机／电脑卡住） |
| **T-2** | **`I tried calling him.`** | **4** | **OALD 逐字例句**（`I tried calling him but there was no answer.`）——**最短，最像我方目标句长度** |
| **T-3** | `Maybe you should try getting up earlier.` | 7 | **Cambridge 逐字例句**；**⚠️ 含 `should`（L16）与 `get up`，负荷更高** |

**C. 复现取材（须全在红线内，≤6 课）**：**L15** `I want to travel.`（`to + 原样` 底座）／**L45** `I enjoy reading.` ＋ oneLineRule 逐字「**enjoy 的门只开一扇：只认名字版 enjoy reading，不认 enjoy to read**」（构成「**enjoy 只开一扇 vs try 开两扇**」的对照）／可选 L160／L161／L173（「同一个垫板」系列）。

**D. 跨源逐字支撑包**：**直接复用 §3.4 的六源逐字**（Cambridge H3／Cambridge 词典义项一／LDOCE 对比框／BC 专课／OALD／中文侧），**无须另取**——**其中 LDOCE 对比框与 BC 专课定义对是本课文案的主引用**。

**E. ⚠️ 一条须与主理人确认的口径（复用批十的否决）**

批十（`:55`）与批十一（`:56`）**两次把「stop 变义对」判为「缓办」**，理由逐字：「**仅一源有课＋判定设计复杂（单句语义靠语境）。缓办。**」（批十）／「**stop 变义对＝双源但 B1+**」（批十一）。

**⇒ `try` 与 `stop` 同一形态**（**变义对／B1+／同为 BC B1-B2 那一课**）。**本轮新信息**：`try` 比 `stop` **多两个源**（LDOCE 独立框 ＋ Cambridge H3 明文「change in meaning」＋ 中文侧独立节），**且 `try` 在 Cambridge 词典同义项下就有两个结构并存（`stop` 无此形态）**。

**⇒ 须主理人裁决**：**若沿用 `stop` 的判定（B1+ 缓办），则 `try` 同样缓办，本批课量＝0；若接受四源强于两源，则做 1 课。** **本轮建议做 1 课，但把「语义依赖」标为已知风险。**

### 4.3 ③ `try to` vs `try doing` 是否值得单独一课？—— **✅ 值得，且它是本批唯一值得的**

**对比表（`try` 与四词中其余三个的立课价值差）**：

| 项 | `try` 的变义课 | `learn`／`decide`／`hope` 的换词课 |
|---|---|---|
| **新增结构** | **✅ 有**（一个动词两扇门 ＋ 门后不同） | **❌ 无**（`to + 原形`，`want`／`seem`／`need` 已教 3 次） |
| **上游课程位／规则页** | ✅ **BC B1-B2 独立专课** ＋ **Cambridge H3** ＋ **LDOCE 对比框** | ⚠️ 只在词阵／名单里（`learn` 有 A1-A2 主例词位） |
| **可标记错** | ✅ 两向（该 -ing 用 to／该 to 用 -ing） | ⚠️ 单向且与 L15 同型（丢 to／加 -ing） |
| **撞「换词硬伤」** | **❌ 不撞**（这不是换词） | **✅ 撞**（第 6–9 次换词） |
| **已知风险** | ⚠️ **语义依赖语境**（批十已把同形态的 `stop` 判缓办） | ⚠️ 无新风险（价值也≈0） |

**⇒ 结论：`try to` vs `try doing` 单独一课 ✅ 值得。它是本批唯一的立项建议。**

**⚠️ 但上限就是「一课」，不能再开**：❌ `try and` 变体（两源但**只是口语变体，非结构**——建议 deepDive 单句认读）；❌ `stop` 变义课（**与 `try` 同课会超载，且批十／批十一已判缓办**）；❌ `remember/forget` 变义课（**BC 与 Cambridge 都把它与 `try` 排在同一单元——日后若做应合课，不是分课**）。

### 4.4 课量建议汇总表

| 候选 | 建议 | 跨源档位 | 理由（一句话） |
|---|---|---|---|
| **`try to do` vs `try doing`** | **✅ 做 1 课** | **B** | **本批唯一真结构增量**；BC 专课 ＋ LDOCE 对比框 ＋ Cambridge H3 ＋ 中文侧独立节（**四源**） |
| `hope to` | ❌ **不单开**（可作 `try` 课的认读材料） | B | 换词；**但其 3 条禁令是全组最厚的可标记错供应** |
| `decide to` | ❌ **不单开**；**改修 `library-gate-4` 的提示语**（§4.1-B） | B | 换词；**且我方已有未交付的输出位** |
| `learn to` | ❌ **不做** | **B−** | 换词 ＋ **Cambridge 结构侧零落点** ＋ **多搭配（about／from／of／how to）使单课超载** |
| 四词合课（2 课） | ❌ **不做** | — | **撞「第 4 课起只能换词」硬伤**；**比 BC 的课程颗粒度细一倍** |

---

## §5 未核实项

| # | 项 | 本轮实测到什么程度 | 影响 | 处置建议 |
|---|---|---|---|---|
| **1** | **Murphy 双册原件**（**任务书点名核实的头一项**） | **❌ 完全不可得**：全盘 `find` 只命中 pygments 配色文件；`/private/tmp/murphy_int.html` 是 **1304 字节 503 错误页**；`assets.cambridge.org` 两份 TOC PDF **两次 `exit 28`（code:000）**；`web.archive.org` **000**；`www.cambridge.org` **403** | **中**：**「Murphy 初级有无 `Verb + to` 单元」本批完全无法回答**；§1.1 全部为「沿用记录」，**标「未核实」** | **与批三十五同：记为「历史遗留不可得源」，后续不再重复尝试**；**如需正文级证据须人工翻书**（**建议主理人确认是否已放弃该源**） |
| **2** | **Cambridge「对不存在 slug 返回 200 ＋ 邻近页」** | ⚠️ **本轮踩到并绕过**：**五个 slug 全 200，title/h1 逐字与真页相同** | **低**（已逐条核 title 与 h1，故 §1.2 可靠） | 已闭合；**建议写入方法学清单**（与批三十五 canonical 回指型并列） |
| **3** | **BC 直连全程 403，全部经 WebFetch（模型转述）** | ⚠️ **多 UA ＋ HTTP/1.1 ＋ HTTP/2 ＋ Googlebot UA 一律 000／403**；Wayback **000**——**§1.3 的 BC 逐字未做 HTML 层校验** | **中**：**`try` 的 B1-B2 课程位（本批上修档位的核心依据）是本批最重要的 BC 论据** | **建议下一批用可直连环境复验**（尤其 `…-change-meaning` 一页的 `try` 小节）。**⚠️ 弱互证**：同一页两次独立 WebFetch 结果一致 |
| **4** | **`decide` 是否有「`decide + to` 是首选」的明文** | ❌ **未取到**：Cambridge／OALD／LDOCE／中文侧**均无「preferred」／「more common」措辞**；只能给**标签序第一位**这**一形态证据** | **低**（**任务书问的这项，答案是「上游未强调」——这本身是结论**） | 已在 §3.2① 标注为「弱证据」；**如需更强证据须查语料库频次（本批未做）** |
| **5** | **Murphy 中级 U54／U56 正文内容** | ❌ **未核实**（同项 1），只能沿用两条历史记录 | **低**（**§2 的六条证据链中无一条来自 Murphy**） | 同项 1 |
| **6** | ⚠️ **`try` 是否沿用批十／批十一对 `stop` 的「缓办」判定** | ⚠️ **无法单方裁断**：批十的否决理由是「仅一源有课」，而 **`try` 实测至少三源有课/框**——**该前提在 `try` 上不成立** | **高**（**决定本批课量是 1 还是 0**） | **须主理人裁决**（§4.2-E）；**本轮建议做 1 课**，并把「单句语义靠语境」标为已知风险 |
| **7** | **中文侧假命中／404（全部本轮实测）** | `english.cool/learn/` **301→`/learn-by-yourself/`（同形异义假命中）**；`/decide/` **301→`/decide-determine-resolve/`**；`try/`／`try-to-do-try-doing/`／`try-doing/`／`try-usage/`／`try-to-vs-try-ing/`／`stop-to-do-stop-doing/`／`learn-to/` **全 404** | **低**（已识别，未误用） | 已登记；**注意：中文侧无 `try` 专文**——`try` 的中文侧落点是 `gerund-infinitive-verb` 一页之内的第 4 节 |
| **8** | **Cambridge `cdo_elvl` 抖动** | ✅ **本轮未复现**：五词 `cdo_elvl` 与首义 `epp-xref` **逐字一致**，`epp-xref` span 全部实存（1／4／2／2／4） | **低** | **闭合**（引用规则未违反：所有 CEFR 值均来自 `epp-xref` span 逐字） |
| **9** | **`library-gate-4` 的解锁可达性** | ⚠️ **部分核实**：`worldGateIndex.ts:72` 的 library `unlockHint` 逐字「**通过站台第 8 关后开启**」，**第 4 关在该世界内**。**⚠️ 「站台 8 关是否卡在更早课程内容上」本轮未走查** | **中**（**§0.2「已承诺未交付」的严重性取决于它有多容易被碰到**） | **建议主理人走查实测**：一个只通到 L20 的存档，能否走到 `library-gate-4` |
| **10** | **`runes.ts:254` 的 spells 是否展示给用户** | ⚠️ **部分核实**：`GatePlayPage.tsx:338` 逐字 `{rune.spells[1] && <p className="gate-tip-example" lang="en">例：{rune.spells[1]}</p>}`——**只展示 `spells[1]`（`She decided to stay.`），`spells[2]`（`We hope to see you.`）不展示** | **中** | **须主理人确认**：若 `spells[1]` 为唯一展示位，**则 `hope` 在 UI 上从未露出**，`decide` 露出 1 次——**直接影响 §4.1-B 的严重性评级** |

---

## 附录 A：本轮取到的页面（供复验）

**⚠️ 只列 URL（或页题）＋结构计数；逐字引文见 §1–§3 正文，不在此重复。**

### A.1 Cambridge 语法页（直连 200；title 已逐字核）

| slug（`dictionary.cambridge.org/grammar/british-grammar/…`） | H1／H2／H3 | title 逐字 |
|---|---|---|
| `verb-patterns-verb-infinitive-or-verb-ing` | **1／6／7** | `Verb patterns: verb + infinitive or verb + - ing ? - Cambridge Grammar` |
| `to-infinitive`（＝`infinitives` 别名） | **1／3／1** | `Infinitives with and without to - Cambridge Grammar` |
| `hope` ／ `word-patterns-hope` | **1／2／0** ／ **1／0／0** | `Hope - Grammar - …` ／ `Word patterns: hope - Grammar - …` |
| `word-patterns-want`／`-need`／`-prefer`／`-stop-doing-something-or-stop-to-do-something` | 1／0／0 | `Word patterns: … - Grammar - …` |
| `word-patterns`（索引）／`verb-patterns`（索引） | 1／0／0 | `Word patterns - …` ／ `Verb patterns - …` |
| `learn` | 1／0／0 | **`Word choice: learn, teach, or study? - Cambridge Grammar`** |
| `expect-hope-or-wait`／`verb-patterns-verb-that-clause`／`would-like`／`stop-ing-form-or-to-infinitive` | — | 各自 title 见 §1.2／§3 |

**❌ 不存在（302）**：`decide`／`try`／`word-patterns-decide`／`word-patterns-try`／`word-patterns-learn`／`verbs-followed-by-the-infinitive`／`try-to-do-try-doing`／`verb-patterns-try`／`try-ing-or-to-infinitive`／`try-infinitive-or-ing`／`try-to-infinitive-or-ing`。
**⚠️ 200 别名（须核 title 区分）**：`verb-patterns-verb-infinitive`／`verbs-followed-by-to-infinitive`／`verbs-followed-by-a-to-infinitive`／`verb-infinitive`／`verb-patterns-verb-ing`。

### A.2 Cambridge 词典页（直连 200；五词 title 逐字均为 `{WORD} \| English meaning - Cambridge Dictionary`）

| 词 | URL | `epp-xref` span 数／逐字序列 |
|---|---|---|
| `learn`／`decide`／`hope`／`try`／`want` | `/dictionary/english/{learn,decide,hope,try,want}` | **4**／`A1, B1, B2, B1`；**2**／`A2, C2`；**2**／`A2, B1`；**4**／`A2, B1, C2, B2`；**1**／`A1` |
| `decide on` | `/dictionary/english/decide-on` | 0／—（title `DECIDE ON SOMETHING/SOMEONE - Cambridge English Dictionary`） |

### A.3 BC 页（**经 WebFetch，直连全程 403**）

| URL | title 逐字 | 档位 |
|---|---|---|
| `/grammar/a1-a2-grammar/verbs-followed-ing-or-infinitive` | `Verbs followed by '-ing' or infinitive` | **A1 Elementary ＋ A2 Pre-intermediate** |
| ⭐ `/grammar/b1-b2-grammar/verbs-followed-ing-or-infinitive-change-meaning` | `Verbs followed by '-ing' or infinitive to change meaning` | **B1 Intermediate ＋ B2 Upper intermediate** |
| `/grammar/english-grammar-reference/to-infinitives` | `'to'-infinitives \| LearnEnglish` | beginner／intermediate／advanced |
| 参考层 `clause-structure-and-verb-patterns`／`ing-forms`；三档索引 `a1-a2`（18）／`b1-b2`（36）／`c1`（14）；`english-grammar-reference`（七类）／`…/verbs`（20 课） | — | A1-A2／B1-B2／C1 |

### A.4 其他源

| 源 | 页题逐字／URL | 用途 |
|---|---|---|
| **LDOCE** | `ldoceonline.com/dictionary/{try,learn,hope,decide}`（title `try \| meaning of try in Longman Dictionary of Contemporary English \| LDOCE`） | **`GRAMMAR: Comparison`（try）／`GRAMMAR: Patterns`（learn／hope）**；⚠️ **`decide` 实测无 `Patterns` 框** |
| **OALD** | `oxfordlearnersdictionaries.com/definition/english/{try,hope,learn,decide}_1` | `try and` 变体／**28 词共用表**（hope）／`learn how to`＋`learn from doing`／`decide against doing` |
| **中文侧** | `english.cool/gerund-infinitive-verb/`（「動詞後面要接 V-ing 還是 to V.?（動名詞 vs. 不定詞）」）／`english.cool/hope/`（「Hope的正確用法？跟Wish的差別在哪？」）／`english.cool/decide-determine-resolve/`（「【決定英文】decide、determine、resolve 差在哪？」） | **四节结构 ＋ 变义表（含 `try`）**／**否定式禁令 ＋ 两错例**／⚠️ **同义辨析类（非结构）** |
| **❌ 404／假命中** | `english.cool/` 下 `try/`／`try-to-do-try-doing/`／`try-doing/`／`try-usage/`／`try-to-vs-try-ing/`／`stop-to-do-stop-doing/`／`learn-to/` **全 404**；`/learn/` **301→`/learn-by-yourself/`（同形异义假命中）**；`/decide/` **301→`/decide-determine-resolve/`** | — |

### A.5 我方库扫描（本轮全库，非仅 GL）

| 文件 | `learn` | `decide` | `hope` | `try` | 说明 |
|---|---|---|---|---|---|
| **`grammarLessons.ts`（GL）** | **0** | **0** | **0** | **0** | ✅ **四词真零** |
| `bundledDictionary.ts` | 15 | 15 | 30 | 32 | 词典数据（非教学位） |
| **`libraryGateScripts.ts`** | 0 | **11** | 0 | 0 | ⭐ **`library-gate-4` 必答句 `I decided to finish this chapter tonight.`** |
| **`runes.ts`** | 0 | 0 | **1** | 0 | ⭐ **`rune-infinitive-sprout` spells `["I want to read.", "She decided to stay.", "We hope to see you."]`** |
| `huntCases.ts` | 2 | 0 | 1 | 0 | 认读／错题 token（`learn` 案作 `tense` 错项；`hope` 案 29 认读） |
| `diaryQuestions.ts` | 1 | 0 | 0 | **1** | `hint: "I want to learn ______ ."` ／ **`d-tomorrow-learn-v2` → `hint: "I want to try ______ ."`** |
| `seedWords.ts` | 1 | 3 | 0 | **4** | `try` 含 `trying to memorize` |
| `echoGateScripts.ts` | 0 | 0 | 0 | **1** | — |
| **GL 累计计数（词边界口径）** | — | — | — | — | `want to` **109**／`need to` **44**／`like to` **20**（**其中 `would like to` 9**）／`would like to` **9**／`seem to` **10**／`in order to` **68** |

**库规模复核**：GL `number:` **189** 条（1–189 无跳号无重号）／HC **198** 条／`season-*` **28** 组（`season-28` 逐字 `min: 182, max: 189`）。

---

## 附录 B：本批判定与我方既有判例的对齐

| 既有判例（批次） | 逐字 | 本批如何对齐 |
|---|---|---|
| **批十／十一：`stop` 变义对「缓办」** | 「**仅一源有课＋判定设计复杂（单句语义靠语境）。缓办。**」 | ⚠️ **`try` 同为变义对，但源数从 1 升到 3+**；**风险（语义依赖）相同**——§4.2-E 交主理人裁决 |
| **批十九／二十：「第 4 课起只能换词」为硬伤** | — | ✅ **据以否决「四词合课 2 课」（§4.1-A）**；`verb + to` 同轴已 5 课 |
| **批三十五：`way` 的「复现 ≠ 教学位」** | — | ⚠️ **对 `library-gate-4` 的处置须与它区分**：**「必答题」≠「复现垫子」**（§0.2）——**建议主理人明确这条边界** |
| **批三十四：`cdo_elvl` 抖动，须 `epp-xref`** | — | ✅ **五词全部满足，未违反**（§1.4／§5 项 8） |
| **批三十五：canonical 回指型假页** | — | ✅ **改用「核 title ＋ 核 h1」双验**，并新增登记 Cambridge「200 ＋ 邻近页」型（§5 项 2） |
| **批三十六：`hope` 的「双源同禁令」** | Cambridge `Not: I don't hope it rains.` ↔ 中文侧 `I don't hope it snows.❌` | ✅ **独立复现，且中文侧取到两条错例（批三十六记一条）** |
| **L15／L160／L161／L173：「同一个 to 垫板」** | L160 逐字「（第 15 课——**同一个 to 垫板**）」／L161「**后面请 to 垫一下……（第 15 课的老规矩）**」／L173「**它和第 44 课那块小垫板 to 是一家人**」 | ✅ **§2 判定与我方三次判例一致** |

---

> 本报告由产品战略团队 AI 协作生成（竞析），逐字引文均标来源；**Murphy 层为历史记录引用，未核实**。**课量裁决（§4.2-E／§4.4）请由产品负责人审定。**
