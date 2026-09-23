# B 档同口径穷举（批五十七建，可复跑）

## 为什么有这个目录

`competitive-analysis-b-tier-closure-2026-09-21.md` §3.5 步骤② 建议：
「**换方法**：不再凭语感列举，改为遍历上游索引……做成对照表，逐条标注我方状态」，
产出**可复跑的缺口清单**。该步骤**从未执行**，而它是宣告「完成所有 B 档」的**唯一前置条件**。

本目录是它的落地。批五十七执行时**连撞三个口径缺陷**，全部记在下面——它们本身就是本目录最有价值的部分。

---

## ⚠️ 三个被实测证伪的口径（不要重犯）

### 缺陷 1：用上游的**语法术语**去 grep 我方语料

Cambridge 的标签是 `Adjectives` / `Determiners` / `Noun phrases` / `Reported speech`……
而我方是**零术语设计**——`src/data/grammarZeroTerms.ts` 明令禁用「形容词」「副词」「主语」「从句」「语序」等 29 个词，
English 侧也从未用 `adjectives`/`determiners` 标注任何一课。

**实测**：`adjectives` 在我方语料出现 **0 次**，而 `tall` 出现 **90 次**、`cold` **355 次**、
`nice` **261 次**；专门讲「描述词站哪」的有 L58 与 L125–L133 整系列。
⇒ 机械匹配把 `Adjectives` 判成「无匹配」，**173 条「缺口」里绝大多数是假缺口**。

### 缺陷 2：以为 Cambridge 8 个分类页能给出分类归属

实测：8 个分类页的**侧栏内容逐字相同**（都是同一份全站 554 条清单），
建出的 `cats` 字段**无区分度**。已从归档里删除该字段。

### 缺陷 3：用**中文口语标签**去 grep

我方 `grammarLabel` 是零术语中文（`正在做 · am/is/are + 动词ing`），
BC 的 `Articles: 'a', 'an', 'the'` 与它对不上——实测 18 条只「命中」5 条，
而其中「命中」的 2 条还是靠 `-ing`/`time` 这类**偶然子串**。
⇒ 会把「其实教了」的判成缺口。

---

## ✅ 可用的口径：用**具体英文实例**检索

上游标题给的是**知识点名**，我方给的是**实例**。要在两者之间搭桥，
检索词必须落到**具体的英文表达**上，而不是术语或标签。

实测效果（BC A1-A2 的 18 课，每课配 2–5 个具体实例）：

| 口径 | 判定「已覆盖」数 |
|---|---|
| 上游术语 grep | 5 / 18（且含 2 个偶然子串）|
| **具体实例检索** | **17 / 18** |

唯一剩下的 1 条（`Adjectives and prepositions`）其实也教了（`good at` 单点命中），
只是探测词只覆盖到 1 个——**属于探测词表不够，不是缺口**。

---

## 复跑命令

```bash
# ① 取上游清单（Cambridge 全站 554 条；8 个分类页侧栏内容相同，取任一页即可）
curl -s --max-time 60 "https://dictionary.cambridge.org/grammar/british-grammar/verbs" \
  -o /tmp/cg_verbs.html
# 再按 cambridge-topics.json 的体例抽取（见本目录归档，已含完整 554 条）

# ② 抽我方清单（逐课 number/id/title/grammarLabel）
node --experimental-strip-types deliverables/product-strategy/working/b-tier-exhaustive-2026-09-23/extract-ours.mts

# ③ 缺口比对（⚠️ 用具体实例口径，不要用标签口径）
#    本批已证：标签口径的三个变体全部失效（见上）
```

## 归档内容

| 文件 | 说明 |
|---|---|
| `cambridge-topics.json` / `.csv` | Cambridge 全站语法点 **554 条**（slug + label）|
| `our-lessons.json` / `.csv` | 我方 **205 课**（number + id + title + grammarLabel）|
| `extract-ours.mts` | 我方清单抽取脚本（可复跑）|
| `decomposition.md` | 554 条的构成分解与过滤器（本项目 §3.5 步骤③ 的落地）|
| `bc-lessons.json` / `.csv` | BC **三档 68 课**（level + title，浏览器实取）|
| `audit-bc-coverage.mts` | BC 68 课 → 我方覆盖审计脚本（可复跑）|
| `bc-coverage-report.json` | 逐条审计结果 |
| `bc-coverage-findings.md` | **审计结论**：A1-A2 档 18/18 全覆盖 |

## ⚠️ 已知限制（含批五十八的更新）

- ~~BC 无法直连~~ → **已解决**：curl 仍 403（WAF 挡），但**改用浏览器工具走真实 UA 可取全**。
  实测取得 **A1-A2 18 / B1-B2 36 / C1 14 = 68 课**，与文档所述「BC 三档 68 课全目」**逐字吻合**。
  归档：`bc-lessons.json` / `bc-lessons.csv`。
  ⚠️ **取数陷阱**：A1-A2 有 3 课的 URL 用 `a1-a2-grammar/` 前缀（不是 `a1-a2/`），
  只按单一前缀抽链接会**漏课**（实测漏 4 课）。
- **Cambridge 分类归属不可得**（缺陷 2）。
- **上游 554 条的「档位」不可得**——Cambridge 语法页不标 CEFR。
  要判「这一条是不是零基础该教」，得另找带 CEFR 的源（词典条目有 `epp-xref`，但语法页没有）。
- **探测词表由人写**——本目录的 68 课审计用了约 180 个探测词，**全是我写的**；
  人写的那一层就是覆盖率的下限（A1-A2 唯一那个「存疑」正因此而来，核实后其实已覆盖）。
- **中文侧两站未做**——文档建议的第三层（`english.cool` 873 条 / `letmeenglish` 965 条 sitemap）
  本轮未取。
