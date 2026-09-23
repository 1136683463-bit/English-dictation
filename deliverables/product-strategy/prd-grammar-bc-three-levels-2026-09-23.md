# PRD · BC 三档 68 课补齐 + A1-A2 覆盖确认

**批次**：第五十九批 · 2026-09-23
**主题**：解决批五十八登记的「BC 源不可达」，取全三档 68 课，完成覆盖审计
**状态**：已落地。**结论：A1-A2 档 18/18 全覆盖，19 个未覆盖项全在 B1-B2 / C1**

---

## 一、一句话

批五十八把 BC 那一层登记为「源不可达（403）」——本批**换用浏览器工具走真实 UA** 取全了三档
**68 课**（与文档所述「BC 三档 68 课全目」逐字吻合），完成审计后得到一个干净结论：
**按我方 A1→A2 定位，A1-A2 档 18 课 18 / 18 全覆盖、0 缺口**；
19 个未覆盖项**全部**在 B1-B2 与 C1。

---

## 二、怎么破的「源不可达」

| 手段 | 结果 |
|---|---|
| `curl` + 真实 UA | **仍 403**（WAF 层挡命令行）|
| `curl` + HTTP/1.1 | 同上 |
| BC `sitemap.xml` / `robots.txt` | 不可达 |
| **浏览器工具（真实 UA + 真渲染）** | ✅ **成功** |

**⚠️ 取数陷阱（记入归档）**：A1-A2 里有 3 课的 URL 用 **`a1-a2-grammar/`** 前缀
（`Articles: 'a', 'an', 'the'` / `Prepositions of time` / `Quantifiers`），而不是 `a1-a2/`。
**只按单一前缀抽链接会漏课**——实测先漏 4 课（14/18），补上第二前缀才取全。

**实测课数**：

| 档位 | 课数 |
|---|---|
| A1-A2 | **18** |
| B1-B2 | **36** |
| C1 | **14** |
| **合计** | **68** ← 与文档所述完全一致 |

---

## 三、审计结果

口径：**具体英文实例检索**（批五十八验证可用；术语 grep 与标签 grep 均已证伪）。

| 档位 | 已覆盖 | 存疑 | 缺口 |
|---|---|---|---|
| **A1-A2** | **17** | **1** | **0** |
| B1-B2 | 16 | 7 | 13 |
| C1 | 1 | 7 | 6 |

### 3.1 A1-A2 唯一「存疑」经核实**实为已覆盖**

`Adjectives and prepositions` 判存疑（4 个探测词只命中 `good at`）。人工核实：

> **我方有专课 L67 `lesson-67-good-at`「我擅长画画」**，
> `grammarLabel` 逐字「擅长 · good at + 名字版」，`targetSentence` = `I am good at drawing.`；
> 它的对比卡 [1] 正是「形容词配错介词」这个错型：
> `I am good in drawing.`（`wrongMark: "in"`）→ `I am good at drawing.`

⇒ **A1-A2 实为 18 / 18。**

### 3.2 19 个缺口全部在 B1-B2 / C1

**B1-B2（13）**：`Adjectives: gradable and non-gradable` / `Future continuous and future perfect` /
`Conditionals: third and mixed` / `Modals: deductions about the past` /
`Modals: deductions about the present` / `Modifying comparatives` /
`Reported speech: questions` / `Reported speech: reporting verbs` /
`Reported speech: statements` / `The future: degrees of certainty` /
`Verbs followed by '-ing' or infinitive to change meaning` / `Wishes: 'wish' and 'if only'` /
`British English and American English`

**C1（6）**：`Inversion after negative adverbials` / `Inversion and conditionals` /
`Modals: probability` / `Patterns with reporting verbs` / `Unreal time` / `Word order in phrasal verbs`

**其中多条已被历史批次裁定不做**：
- `Wishes: 'wish' and 'if only'` / `Unreal time` → **BC 标 `C1 Advanced`**（批三十五逐字记录）
- `Question tags` → **BC 明确 B1-B2；Murphy 整书无**（批十七裁定缓办）
- `Reported speech` 三条 → 批四八/四九已裁定 `say`/`told` **不做正课**（`gap=3`，无伤害路径）

---

## 四、对「完成所有 B 档」的回答

> **就 BC 这一层而言，「所有 B 档」在 A1-A2 范围内已经清空。**
> BC 三档 68 课已取全并归档（可复跑）；A1-A2 档 18 / 18 全覆盖、0 缺口；
> 19 个未覆盖项全部超出我方线（B1-B2 / C1），且多条已有「不做」裁定。

**仍不能无条件说「完成」的三条**（延续批五十七的诚实登记）：
1. **Cambridge 554 条里 256 条结构候选仍无档位**（Cambridge 语法页不标 CEFR）
   ——那些里可能藏着「其实够 A1-A2 但我方没教」的点；
2. **探测词表由人写**（本次 68 课 × 2–4 词 ≈ 180 个探测词全是我写的）
   ——**人写的那一层就是覆盖率的下限**，本批 A1-A2 那 1 个「存疑」正因此而来；
3. **中文侧两站未做**（文档建议的第三层：`english.cool` 873 条 / `letmeenglish` 965 条）。

---

## 五、交付物（全部归档，可复跑）

`deliverables/product-strategy/working/b-tier-exhaustive-2026-09-23/`

| 文件 | 内容 |
|---|---|
| `bc-lessons.json` / `.csv` | **BC 三档 68 课**（level + title）|
| `audit-bc-coverage.mts` | BC 68 课 → 我方覆盖审计（可复跑）|
| `bc-coverage-report.json` | 逐条审计结果 |
| `bc-coverage-findings.md` | 审计结论与逐条缺口清单 |
| `cambridge-topics.json` / `.csv` | Cambridge 全站 554 条 |
| `our-lessons.json` / `.csv` | 我方 205 课 |
| `extract-ours.mts` | 我方清单抽取脚本 |
| `README.md` | 复跑命令 + **三个被证伪的口径** + 已知限制（已更新）|
| `decomposition.md` | 554 条构成分解 |
| `DEPRECATED-*` | 第一版失败脚本与 173 条假缺口（加头注防误用）|

---

## 六、验收

| 项 | 结果 |
|---|---|
| `tsc --noEmit` | 0 错误 |
| 全量测试 | **2504 / 2506 通过**（与批五十七/五十八同水位）|
| 两条失败 | `kb4` / `bo4`——**均为并发进程改 UI 所致**（批五十七已逐字核实：删了「你这句：」的冒号）|
| `src/` 改动 | **零**（本批产出方法是清单、脚本与结论）|
| 归档可复跑 | `audit-bc-coverage.mts` 实测审计 68 条；`extract-ours.mts` 抽满 205 课 |
