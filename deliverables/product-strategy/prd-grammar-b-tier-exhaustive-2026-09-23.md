# PRD · B 档同口径穷举（§3.5 步骤② 首次执行）

**批次**：第五十八批 · 2026-09-23
**主题**：执行 `competitive-analysis-b-tier-closure-2026-09-21.md` §3.5 步骤② 建议、但**从未做过**的「同口径穷举」
**状态**：已执行，交付**可复跑清单 + 实测覆盖率**；结论：**该口径下无新增待办**

---

## 一、一句话

文档说「宣告完成所有 B 档的唯一前置条件是一次真正的同口径穷举」。
本批**执行了它**，途中**连撞三个口径缺陷并逐一证伪**，最后用一个**经实测验证的口径**
测出：35 个核心 A1-A2 语法点里 **29 个已覆盖、4 个是探测不足、2 个属高阶且已有裁定**
——**没有新增待办**。

---

## 二、交付物（可复跑，已归档进仓库）

`deliverables/product-strategy/working/b-tier-exhaustive-2026-09-23/`

| 文件 | 内容 |
|---|---|
| `cambridge-topics.json` / `.csv` | Cambridge **全站语法点 554 条**（实取，已归档）|
| `our-lessons.json` / `.csv` | 我方 **205 课**（number + id + title + grammarLabel，逐课抽取）|
| `extract-ours.mts` | 我方清单抽取脚本（可复跑）|
| `decomposition.md` | 554 条的构成分解 + 35 点覆盖实测 + 6 个非全覆盖的逐条裁定 |
| `README.md` | 复跑命令 + **三个被证伪的口径**（本批最有价值的部分）|
| `DEPRECATED-*` | 第一版失败脚本与其 173 条假缺口（**加醒目头注，防止被当待办**）|

---

## 三、三个被实测证伪的口径（本批的核心教训）

### 缺陷 1（最严重）：用上游的**语法术语** grep 我方语料

Cambridge 标签是 `Adjectives` / `Determiners` / `Noun phrases` / `Reported speech`；
我方是**零术语设计**——`src/data/grammarZeroTerms.ts` 明令禁用「形容词」「副词」「主语」「从句」「语序」
等 29 个词，English 侧也**从未**用 `adjectives`/`determiners` 标注任何一课。

**实测**：

| 词 | 我方出现次数 |
|---|---|
| `adjectives` | **0** |
| `tall` | **90** |
| `cold` | **355** |
| `nice` | **261** |

⇒ 机械匹配把 `Adjectives` 判成「无匹配」，产出 **173 条「缺口」——绝大多数是假缺口**。
这是本批第 16 次同类口径错误（前 15 次见批五十五/五十六）。

### 缺陷 2：以为 Cambridge 8 个分类页能给出分类归属

实测：**8 个分类页的侧栏内容逐字相同**（都是同一份全站 554 条清单），
建出的 `cats` 字段无区分度。已从归档删除该字段。

### 缺陷 3：用**中文口语标签** grep

我方 `grammarLabel` 是零术语中文（`正在做 · am/is/are + 动词ing`），
与 BC 的 `Articles: 'a', 'an', 'the'` 对不上——实测 18 条只「命中」5 条，
其中 2 条还是靠 `-ing`/`time` 这类**偶然子串**。

---

## 四、经实测验证的口径：用**具体英文实例**检索

上游给**知识点名**，我方给**实例**。要在两者间搭桥，检索词必须落到**具体英文表达**上。

**口径对比（BC A1-A2 的 18 课）**：

| 口径 | 判定「已覆盖」|
|---|---|
| 上游术语 grep | 5 / 18（含 2 个偶然子串）|
| **具体实例检索** | **17 / 18** |

---

## 五、实测结果：35 个核心 A1-A2 语法点

| 结果 | 数量 |
|---|---|
| ✅ 已覆盖（命中 ≥2）| **29** |
| ⚠️ 存疑（命中 1）| 4 |
| ❌ 候选缺口 | 2 |

### 5.1 已覆盖的 29 个

`relative-clause` / `passive` / `gerund-vs-infinitive` / `comparative` / `superlative` /
`used-to` / `present-perfect` / `past-perfect` / `future-will` / `future-going-to` /
`modals-ability` / `modals-obligation` / `suggestions` / `polite-requests` / `there-be` /
`articles` / `demonstratives` / `possessives` / `quantifiers` / `prepositions-place` /
`prepositions-time` / `adverbs-manner` / `adverbs-frequency` / `word-order-adjective` /
`imperatives` / `negation` / `conjunctions-cause` / `conjunctions-time` / `purpose`

### 5.2 4 个「存疑」复核：**全部是探测词表不够，不是缺口**

| 点 | 复核证据 |
|---|---|
| `reported-speech` | `she said` 命中 4 次（L38 教了 `say` 家族）；且批四九已裁定 `say`/`said` 不做正课 |
| `conditional-real` | `if it rains` **86 次**、`if it is` 9 次——远不是缺口 |
| `exclamations` | `what a nice` **61 次**（L89 专课）|
| `direct-indirect-questions` | `do you know where` 20 次、`where he is` **52 次**（L35/L37 专课）|

### 5.3 2 个候选缺口：**均已有权威裁定不做**

| 点 | 我方命中 | 既有裁定 |
|---|---|---|
| `conditional-unreal` | `if I were` 0 / `would go` 0 / `I wish` 0 | 归入 **BC `C1 Advanced`** 的 `unreal-time` 节 |
| `question-tags-informal` | `isn't it` 0 / `right?` 0 | 批十七逐字：**「BC 明确 B1-B2；Murphy 整书无」**，缓办、不立教学目标 |

---

## 六、554 条的构成分解（落地文档 §3.5 步骤③ 的建议）

文档建议「把『3 标记可满足性』设为硬过滤器，把词汇辨析与语法结构课分开」。实测：

| 类别 | 条数 |
|---|---|
| `Word choice: X or Y?` | 125 |
| `Word patterns: X` | 102 |
| `Collocation: X` | 26 |
| `Countability: X` | 20 |
| `Word formation` | 1 |
| 发音/语调/语域/文体/篇章 | 24 |
| **结构类候选** | **256** |

⇒ 过滤器筛掉 **172 条词汇类** + 24 条超纲项。

**⚠️ 但 256 条仍不是待办清单**——它含 `Reported speech` / `Swearing` / `Newspaper headlines`
等明显高阶项，以及 `Adjectives: forms` 这类术语式整页。**按难度过滤这一层，Cambridge 语法页给不了**
（它不标 CEFR）——这是本批的已知限制。

---

## 七、已知限制（诚实登记）

| # | 限制 | 影响 |
|---|---|---|
| 1 | **BC 无法直连**（curl → 403），WebFetch 只能取页面可见内容；B1-B2 与 C1 两页正文**各只列 1 课** | **文档所称「BC 三档 68 课全目」本轮未取到**。BC 那一层不完整，本批只用它做了 A1-A2 的 18 课抽样验证口径 |
| 2 | **Cambridge 分类归属不可得**（缺陷 2）| 无法按「形容词副词 / 动词 / 名词」分组审阅 |
| 3 | **上游 554 条无档位**（Cambridge 语法页不标 CEFR）| 无法机械判「这条是不是零基础该教」——256 条结构候选里混着高阶项 |
| 4 | 探测词表由人写 | 5.2 的 4 个「存疑」正因探测词不足而误判 ⇒ **探测词表本身是覆盖率的下限** |

---

## 八、结论与对「完成所有 B 档」的回答

> **在该口径能测的范围内，我方 A1-A2 语法线无新增待办。**
>
> 35 个核心点：29 覆盖 + 4 探测不足（实为已覆盖）+ 2 高阶已裁定 = **0 待办**。

**但仍不能无条件宣告「完成所有 B 档」**，因为：

1. **BC 那一层不完整**（限制 1）——文档建议的三层只做透了 Cambridge 一层；
2. **256 条结构候选未经难度过滤**（限制 3）；
3. 文档 §3 自身的三条理由里，「**历批的 B 档从来不是穷举**」这一条本批**再次被印证**——
   即便用了穷举法，我仍要靠人写探测词表，而**人写的那一层就会漏**（5.2 实测漏了 4 个）。

**可以诚实宣告的是**：
> 「批三十一登记的 10 项 + 文档 §3.5 点名的 3 课 **已 100% 交付**；
>   Cambridge 全站 554 条已**归档为可复跑清单**；核心 A1-A2 语法点实测**无待办**。
>   B 档的完整穷举仍缺 BC 两层，其阻塞在**源不可达**（403），不在我方流程。」

---

## 九、验收

| 项 | 结果 |
|---|---|
| `tsc --noEmit` | 0 错误 |
| 全量测试 | **2504 / 2506 通过**（与批五十七同水位，本批未触碰产品代码）|
| 两条失败 | `kb4` / `bo4`——**均为并发进程改 UI 所致**（批五十七已逐字核实：`git diff` 显示它把「你这句：」的冒号删了）|
| 归档可复跑 | `extract-ours.mts` 实测抽满 **205 课**（缺号 0 / 重号 0）|
| 废弃件防护 | 第一版失败脚本与 173 条假缺口**已加醒目 DEPRECATED 头注**，防止被当待办 |
