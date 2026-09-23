# BC 三档 68 课 → 我方覆盖审计（批五十八补完）

## 一、本文件补上了什么

批五十八首次执行「同口径穷举」时，**BC 那一层没取到**（curl → 403，WebFetch 只能拿页面可见内容，
B1-B2/C1 两页正文各只列 1 课），登记为「源不可达」。
本批**换用浏览器工具走真实 UA**，取到了完整三档，并确认它与文档所述规模**逐字吻合**：

| 档位 | 课数 |
|---|---|
| A1-A2 | **18** |
| B1-B2 | **36** |
| C1 | **14** |
| **合计** | **68** ← 与文档「BC 三档 68 课全目」完全一致 |

归档：`bc-lessons.json` / `bc-lessons.csv`（含档位字段）。

**⚠️ 一个取数陷阱（记下来）**：A1-A2 里有两课（`Articles: 'a', 'an', 'the'`、
`Prepositions of time`、`Quantifiers`）的 URL 用了 `a1-a2-grammar/` 前缀，
而不是 `a1-a2/`——**只用单一前缀抽链接会漏课**（实测漏 4 课）。

---

## 二、审计结果（口径：具体英文实例检索，见 README）

`audit-bc-coverage.mts` 逐条给出「已覆盖 / 存疑 / 缺口」。**按档位分组看，结论非常清楚**：

| 档位 | 已覆盖 | 存疑 | 缺口 |
|---|---|---|---|
| **A1-A2** | **17** | **1** | **0** |
| B1-B2 | 16 | 7 | 13 |
| C1 | 1 | 7 | 6 |

### 2.1 A1-A2：唯一的「存疑」经核实**实为已覆盖**

`Adjectives and prepositions` 判存疑（4 个探测词只命中 `good at`）。人工核实：

> **我方有专课 L67 `lesson-67-good-at`「我擅长画画」，`grammarLabel` 逐字
> 「擅长 · good at + 名字版」，`targetSentence` = `I am good at drawing.`**
> 它的对比卡第 [1] 张正是「形容词配错介词」这个错型：
> `I am good in drawing.`（`wrongMark: "in"`）→ `I am good at drawing.`

⇒ **A1-A2 实为 18 / 18 全覆盖。**

### 2.2 19 个「缺口」全部落在 B1-B2 与 C1

逐条列出（**没有一条在 A1-A2**）：

**B1-B2（13）**：`Adjectives: gradable and non-gradable` / `Future continuous and future perfect` /
`Conditionals: third and mixed` / `Modals: deductions about the past` /
`Modals: deductions about the present` / `Modifying comparatives` /
`Reported speech: questions` / `Reported speech: reporting verbs` /
`Reported speech: statements` / `The future: degrees of certainty` /
`Verbs followed by '-ing' or infinitive to change meaning` / `Wishes: 'wish' and 'if only'` /
`British English and American English`

**C1（6）**：`Inversion after negative adverbials` / `Inversion and conditionals` /
`Modals: probability` / `Patterns with reporting verbs` / `Unreal time` /
`Word order in phrasal verbs`

⇒ 这些**全部高于我方 A1→A2 线**，且其中多条已被历史批次裁定不做，例如：
- `Wishes: 'wish' and 'if only'` 与 `Unreal time` → **BC 标 `C1 Advanced`**（批三十五逐字记录）
- `Question tags` → **BC 明确 B1-B2；Murphy 整书无**（批十七裁定缓办）
- `Reported speech` 三条 → 批四八/四九已裁定 `say`/`told` **不做正课**（`gap=3`，无伤害路径）

---

## 三、这份审计对「完成所有 B 档」的回答

> **BC 三档 68 课已取全并归档（可复跑）。**
> **按我方 A1→A2 的产品定位，A1-A2 档 18 课：18 / 18 全覆盖，0 缺口。**
> **19 个未覆盖项全部在 B1-B2 / C1，超出我方线。**

**⇒ 就 BC 这一层而言，「所有 B 档」在 A1-A2 范围内已经清空。**

**仍不能无条件说「完成」的三条**（延续批五十七的诚实登记）：
1. **Cambridge 554 条**里 256 条结构候选**仍无档位**（Cambridge 语法页不标 CEFR）
   ——那些里可能还藏着「其实够 A1-A2 但我方没教」的点；
2. **探测词表由人写**（本审计 68 条 × 2–4 词 = 约 180 个探测词全是我写的），
   而 **人写的那一层就是覆盖率的下限**——本批 A1-A2 的那 1 个「存疑」正是探测词不足所致；
3. 中文侧两站（`english.cool` / `letmeenglish`）的 sitemap **本轮未做**（文档建议的第三层）。


---

## 四、附：一次失败的「档位继承」尝试（负结果，登记备查）

### 4.1 想法

Cambridge 语法页**不标 CEFR**，所以 256 条结构候选无法直接判档。
但 BC 的 68 课**按 A1-A2 / B1-B2 / C1 分好了档**。
⇒ 想用「实词重叠」把 Cambridge 条目对到 BC 课上，**继承它的档位**。

### 4.2 结果：不成立

`crossref-cambridge-bc.mjs` 实测：

| 继承结果 | 条数 |
|---|---|
| A1-A2 | 7 |
| B1-B2 | 22 |
| C1 | 26 |
| **无法对应** | **499** |

**499 / 554 无法对应** ⇒ 这个口径**无效**。

### 4.3 为什么失败（第 17 次同类口径错误）

根因与 README 记录的三个缺陷**完全同族**：

- Cambridge 的 label 是**术语式**（`Adjectives` / `Noun phrases` / `Determiners`）
- BC 的 title 是**话题式**（`Adjectives and prepositions` / `Using 'enough'`）
- ⇒ 两者**没有一个共同的词表**。例如 Cambridge 的 `Adjectives` 与 BC 的
  `Adjectives and prepositions` 只有 `adjectives` 一个词重合，score=1 < 阈值 2，判「无法对应」。

**更根本的问题**：这仍然是「拿上游表达去检索另一套上游表达」——
而 README 已证：**桥接必须落到具体英文实例**（我方数据的组织方式）。
用两个上游源互相对齐，不能绕过这一层。

### 4.4 结论

**给 256 条候选加档位，机械路径已试两条、皆不通**：

| 路径 | 结果 |
|---|---|
| Cambridge 语法页自带档位 | ❌ 页面不标 CEFR |
| 用 BC 68 课继承档位 | ❌ 499/554 无法对应（本文）|
| **词典条目 `epp-xref`** | ✅ **可行**（实测 `phrasal-verb` B1 / `used-to` B1 / `enough` A2+B2）——但要**逐词查**，256 条需 256 次请求 + 人工选词 |

⇒ **顺位 1 的真实成本比预期高**：需要「逐条选一个可查的核心词 → 查词典 → 取 `epp-xref`」
三道人工/半人工步骤。**本批未做，如实登记。**
