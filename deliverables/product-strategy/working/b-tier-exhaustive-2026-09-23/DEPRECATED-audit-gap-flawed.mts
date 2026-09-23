/**
 * ⚠️⚠️ 已废弃 —— 不要使用，不要根据它的输出建待办 ⚠️⚠️
 *
 * 这是批五十七第一版审计脚本，**口径有致命缺陷**：它用 Cambridge 的**语法术语**
 * （`Adjectives` / `Determiners` / `Noun phrases`）去 grep 我方语料，
 * 而我方是**零术语设计**（`grammarZeroTerms.ts` 禁用了「形容词」「副词」「主语」等 29 个词，
 * English 侧也不用 `adjectives` 标注过任何一课）。
 *
 * 实测后果：`adjectives` 在我方出现 0 次，于是 `Adjectives` 被判「无匹配」——
 * 而我方 `tall` 出现 90 次、`cold` 355 次、`nice` 261 次，
 * 专门讲描述词位置的有 L58 与 L125–L133 整系列。
 *
 * ⇒ 它产出的 173 条「缺口」**绝大多数是假缺口**（见 DEPRECATED-gap-report-173-false-gaps.json）。
 * 正确口径见同目录 README.md『✅ 可用的口径：用具体英文实例检索』。
 */
/**
 * B 档同口径穷举 · 缺口审计脚本（批五十七建的）
 *
 * 背景：`competitive-analysis-b-tier-closure-2026-09-21.md` §3.5 步骤② 建议
 * 「把 Cambridge Grammar 全站索引 + BC 课目 + 中文侧 sitemap 做成对照表，
 *  逐条标注我方状态」，产出**可复跑的缺口清单**。该步骤从未执行。
 *
 * 本脚本做 Cambridge 那一层（权威性最高、结构最稳定）。
 *
 * 上游清单来源：`cambridge-topics.json`（554 条，从 8 个分类页实取，
 * 见同目录 README 的复跑命令）。
 *
 * 用法（从仓库根目录）：
 *   node --experimental-strip-types deliverables/product-strategy/working/b-tier-exhaustive-2026-09-23/audit-gap.mts
 *
 * 输出：`gap-report.json`（逐条状态）+ 终端摘要
 *
 * ⚠️ 判据纪律（本项目血泪教训，见批五十五/五十六）：
 *   - 用**词边界**匹配，不用裸子串（`way` 会命中 `always`）；
 *   - 匹配的是「我方是否教过**这个点**」，不是「是否出现过这几个字母」——
 *     所以结果里 `NO_MATCH` 只是**候选缺口**，必须人工复核才能定性。
 */
import fs from "node:fs";
import path from "node:path";

const HERE = "deliverables/product-strategy/working/b-tier-exhaustive-2026-09-23";
const ROOT = process.cwd();

type Topic = { slug: string; label: string; cats: string };

/** 读我方语料（语法课 + 找错案件）的全文，做统一检索面。 */
const readCorpus = () => {
  const texts: string[] = [];
  for (const file of ["src/data/grammarLessons.ts", "src/data/huntCases.ts", "src/data/grammarCanDoMilestones.ts"]) {
    texts.push(fs.readFileSync(path.join(ROOT, file), "utf8"));
  }
  return texts.join("\n").toLowerCase();
};

/**
 * 从 Cambridge 标题里抽出「可检索的词」。
 * 例：`Adverbs and adverb phrases: position` → ["adverb", "position"]
 *     `As if and as though`                 → ["as if", "as though"]
 *     `Must`                                 → ["must"]
 */
const keywordsOf = (label: string): string[] => {
  const cleaned = label
    .replace(/\(.*?\)/g, " ")
    .replace(/[’']/g, "'")
    .toLowerCase();
  const [head, ...rest] = cleaned.split(":");
  const headWords = head.split(/\s+/).filter((w) => w && !["and", "or", "the", "a", "an", "of", "to", "in", "for", "with"].includes(w));
  const out = new Set<string>();
  // 整块短语（`as if` / `such as` / `by the time`）优先
  const phrase = headWords.join(" ").trim();
  if (headWords.length >= 2) out.add(phrase);
  for (const w of headWords) if (w.length > 2) out.add(w);
  // 冒号后的限定词也当关键词（position / order / forms 等）
  for (const seg of rest) {
    for (const w of seg.split(/\s+/)) {
      const t = w.trim();
      if (t.length > 3 && !["typical", "errors", "and", "the"].includes(t)) out.add(t);
    }
  }
  return [...out];
};

const hasWord = (corpus: string, needle: string): boolean => {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![a-z'-])${escaped}(?![a-z'-])`, "i").test(corpus);
};

/** 不计入 B 档语法线的分类（发音/语调/语域/文体/篇章）。 */
const OUT_OF_SCOPE_CATS = new Set<string>();
const OUT_OF_SCOPE_SLUG_HINTS = [
  "pronunciation", "intonation", "dialect", "register", "slang", "hyperbole",
  "paragraphs", "punctuation", "spelling", "apostrophe", "telephoning",
  "collocation", "commentaries", "measurements", "dates", "number",
];

const main = () => {
  const topics = JSON.parse(fs.readFileSync(path.join(ROOT, HERE, "cambridge-topics.json"), "utf8")) as Topic[];
  const corpus = readCorpus();

  const report = topics.map((t) => {
    const keywords = keywordsOf(t.label);
    const hits = keywords.filter((k) => hasWord(corpus, k));
    const outOfScope = OUT_OF_SCOPE_SLUG_HINTS.some((h) => t.slug.startsWith(h));
    return {
      slug: t.slug,
      label: t.label,
      categories: t.cats,
      outOfScope,
      keywords,
      hitKeywords: hits,
      status: outOfScope ? "OUT_OF_SCOPE" : hits.length > 0 ? "SOME_SIGNAL" : "NO_MATCH",
    };
  });

  fs.writeFileSync(path.join(ROOT, HERE, "gap-report.json"), JSON.stringify(report, null, 1));

  const tally: Record<string, number> = {};
  for (const r of report) tally[r.status] = (tally[r.status] ?? 0) + 1;
  console.log("Cambridge 语法点总数:", report.length);
  console.log("状态分布:", JSON.stringify(tally, null, 1));
  console.log("\n=== NO_MATCH（候选缺口，须人工复核）按分类 ===");
  const noMatch = report.filter((r) => r.status === "NO_MATCH");
  const byCat: Record<string, string[]> = {};
  for (const r of noMatch) (byCat[r.categories] ??= []).push(r.label);
  for (const [cat, labels] of Object.entries(byCat).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`\n【${cat}】${labels.length} 项`);
    labels.slice(0, 14).forEach((l) => console.log("   " + l));
    if (labels.length > 14) console.log(`   …（另 ${labels.length - 14} 项见 gap-report.json）`);
  }
};

main();
