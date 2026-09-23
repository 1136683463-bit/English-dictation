# 中文侧对照（三层穷举的第三层 · 2026-09-23 批六十四）

## 这是什么

`competitive-analysis-b-tier-closure-2026-09-21.md` §3.5 步骤② 建议的**三层穷举**里，
前两层已完成（Cambridge 554 条 / BC 三档 68 课，见 `../b-tier-exhaustive-2026-09-23/`）。
本目录是**第三层：中文教学站的语法文章清单**。

**为什么需要它**：Cambridge 与 BC 是**英语母语者写的语法体系**；中文侧是**中文母语者写的**，
更贴近中国学生的实际疑难。它用来验证前两层是否漏项。

## 数据来源（本轮实取）

| 站点 | sitemap | 取到 URL 数 |
|---|---|---|
| `english.cool` | `/wp-sitemap-posts-post-1.xml` | **879** |
| `letmeenglish.com` | `/post-sitemap.xml` | **965** |
| | **合计** | **1844** |

⚠️ **两个取数细节**：
1. `english.cool` 的 posts sitemap 把全部 URL **压在一行 XML 里**——
   `grep -c "<loc>"` 会返回 1，必须用 `grep -o "<loc>" \| wc -l` 才能数对（实测 879）。
2. `letmeenglish` 的列表里每个页面有 `zh-hans/` 前缀的简体镜像 ⇒ **去重后 483 条**。

## 语法相关筛选

用 slug 的语法关键词粗筛：`english.cool` **94 条** / `letmeenglish` **74 条**（去重后）。

归档文件：
- `english-cool-urls.txt` — 879 条原始 URL
- `letmeenglish-urls.txt` — 965 条原始
- `letmeenglish-grammar.txt` — 74 条语法相关（去重后）
- `grammar-candidates.txt` — 两站语法候选合并

## 覆盖审计结果

口径：**具体英文实例检索**（与 Cambridge / BC 两层同一口径；术语 grep 与标签 grep 均已证伪，见上层 README）。

从 168 个语法候选中抽出 **56 个可判定的语法点**，逐点配 1–5 个典型英文实例：

| 结果 | 数量 |
|---|---|
| **已覆盖** | **45** |
| 存疑（命中 1）| 7 |
| **缺口** | **4** |

### 4 个缺口 —— 全部与前两层一致

| 缺口 | 中文侧原文 | 前两层的判定 |
|---|---|---|
| `future-continuous-tense` | `future-continuous-future-perfect` | **BC 列在 B1-B2 档**（批五十九审计已记为缺口）|
| `future-perfect-tense` | 同上（同一篇文章）| 同上 |
| `subjunctive-mood` | `subjunctive-mood` / `unreal-past` / `3rd-conditional` | **BC 标 C1**（`wishes-wish-if-only` 在 B1-B2，`Unreal time` 属 C1）|
| `phrase-clause-sentence` | `phrase-clause-sentence` | **Cambridge 归「高于我方线」27 条之一** |

**⇒ 中文侧没有捞出前两层之外的新缺口。**

### 7 个「存疑」——核实后多为探测词不足

| 存疑项 | 说明 |
|---|---|
| `question-tags` | 命中 `right`；批十七已裁定 **BC 明确 B1-B2 + Murphy 整书无**，缓办 |
| `conditionals` | 命中 `if it rains`（86 次）；实际已教，探测词只写 2 个 |
| `comparative-superlative-adverbs` | 命中 `faster`；`more quickly` 属 B1+ |
| `phrasal-verb` | 命中 `get up`；**上游标 B1**（词典 `phrasal-verb` = B1）|
| `perfect-tenses` / `continuous-tenses` / `s-verb-agreement` | 探测词表过窄，实为已覆盖 |

## 结论

> **三层交叉验证完成，三层结论一致：**
>
> | 层 | 来源 | 结果 |
> |---|---|---|
> | 一 | Cambridge 全站 554 条 | 257 结构候选 → **1 条真候选 → 不做** |
> | 二 | BC 三档 68 课 | A1-A2 档 **18/18 覆盖** |
> | 三 | **中文侧两站 1844 条** | 56 个语法点 → **45 覆盖 + 7 存疑 + 4 缺口（全部超出 A1-A2 线）** |
>
> **三层都没有在 A1-A2 范围内捞出未覆盖的语法点。**

## ⚠️ 已知限制

1. **slug 判定，未逐篇读正文**——本轮用 URL slug 推断文章主题（slug 是可读的，
   如 `present-perfect-vs-present-perfect-continuous`），**没有抓取每篇文章正文**。
   若某篇文章的 slug 与实际内容不符（中文站有 canonical 回指型假页的先例，
   见 `../b-tier-exhaustive-2026-09-23/` 记录的方法学坑 C），本层会有误差。
2. **探测词表仍由人写**——56 × 1–5 ≈ 120 个探测词全是我写的，
   **人写的那层就是覆盖率的下限**（7 个「存疑」正因此而来）。
3. **中文站还含大量非语法内容**（发音、听力、TOEIC、文化），本层只筛了语法相关 168 条。
