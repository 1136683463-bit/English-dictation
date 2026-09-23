/**
 * BC 三档 68 课 → 我方覆盖审计（批五十八）
 *
 * ⚠️ 口径纪律（本目录 README 记录的三个已证伪口径，别再犯）：
 *   1. 不要用上游**语法术语** grep 我方零术语语料（`Adjectives` 在我方 0 次，
 *      而 `tall` 90 次 —— 会造出大量假缺口）
 *   2. 不要用上游**中文/英文标签**直接比对我方 `grammarLabel`
 *   3. ✅ 用**具体英文实例**检索（上游给知识点名，我方给实例）
 *
 * 用法（仓库根目录）：
 *   node --experimental-strip-types deliverables/.../audit-bc-coverage.mts
 */
import fs from "node:fs";

const HERE = "deliverables/product-strategy/working/b-tier-exhaustive-2026-09-23";
const corpus = (
  fs.readFileSync("src/data/grammarLessons.ts", "utf8") +
  "\n" +
  fs.readFileSync("src/data/huntCases.ts", "utf8")
).toLowerCase();

const has = (phrase: string): boolean => {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![a-z'-])${escaped}(?![a-z'-])`, "i").test(corpus);
};

/**
 * 人写的桥接表：每条 BC 课 → 该语法点的**典型英文实例**。
 * 命中 ≥2 判「已覆盖」；命中 1 判「存疑（探测词可能不够）」；0 判「候选缺口」。
 * ⚠️ 这张表就是「穷举」里不可自动化的那部分，且它本身是覆盖率的下限。
 */
const PROBES: Record<string, string[]> = {
  // ── A1-A2（18 课）──
  "Adjectives and prepositions": ["good at", "interested in", "afraid of", "similar to"],
  "Adjectives ending in '-ed' and '-ing'": ["bored", "boring", "excited", "exciting"],
  "Articles: 'a', 'an', 'the'": ["a book", "an apple", "the door"],
  "Articles: 'the' or no article": ["go to school", "at home", "in bed"],
  "Comparative adjectives": ["taller", "older than", "bigger"],
  "Infinitive of purpose": ["in order to", "to help", "to buy"],
  "Nouns: countable and uncountable": ["some milk", "a lot of", "much", "information"],
  "Past continuous and past simple": ["was reading", "were playing", "when you called"],
  "Possessive 's": ["grandma's", "my brother's", "dad's"],
  "Prepositions of place: 'in', 'on', 'at'": ["in the box", "on the desk", "at the door"],
  "Prepositions of time: 'at', 'in', 'on'": ["in May", "at eight", "on Monday"],
  "Present simple": ["every day", "usually", "always"],
  "Present simple: 'have got'": ["have got", "has got"],
  "Present simple: 'to be'": ["i am", "she is", "they are"],
  "Quantifiers: 'few', 'a few', 'little' and 'a bit of'": ["a few", "a little", "few apples"],
  "Question forms": ["do you", "does she", "did you"],
  "Using 'there is' and 'there are'": ["there is", "there are"],
  "Verbs followed by '-ing' or infinitive": ["enjoy reading", "want to go", "finish reading"],
  // ── B1-B2（36 课）——挑「可能落在零基础线上」的先探 ──
  "Adjectives: gradable and non-gradable": ["very cold", "absolutely", "freezing"],
  "Contrasting ideas: 'although', 'despite' and others": ["although", "but", "though"],
  "Different uses of 'used to'": ["used to", "didn't use to"],
  "Future continuous and future perfect": ["will be doing", "will have finished"],
  "Future forms: 'will', 'be going to' and present continuous": ["will go", "going to", "will be"],
  "Intensifiers: 'so' and 'such'": ["so cold that", "such a"],
  "Conditionals: third and mixed": ["if i had", "would have"],
  "Conditionals: zero, first and second": ["if it rains", "if i were"],
  "Modals: deductions about the past": ["must have", "might have"],
  "Modals: deductions about the present": ["must be", "might be"],
  "Modals: permission and obligation": ["must", "have to", "should", "can i"],
  "Modifying comparatives": ["much bigger", "a bit taller"],
  "Passives": ["was broken", "is made", "by her"],
  "Past ability": ["could swim", "was able to"],
  "Past habits: 'used to', 'would' and the past simple": ["used to", "would go"],
  "Past perfect": ["had left", "had finished"],
  "Phrasal verbs": ["get up", "look after", "put on"],
  "Present perfect": ["have done", "has finished"],
  "Present perfect simple and continuous": ["have been doing", "has been"],
  "Present perfect: 'just', 'yet', 'still' and 'already'": ["just", "yet", "already", "still"],
  "Question tags": ["isn't it", "right"],
  "Reflexive pronouns": ["myself", "herself", "himself"],
  "Relative clauses: defining relative clauses": ["who wears", "that i", "which i"],
  "Relative clauses: non-defining relative clauses": ["which", "who"],
  "Reported speech: questions": ["asked me", "said that"],
  "Reported speech: reporting verbs": ["told me", "said that"],
  "Reported speech: statements": ["said that", "told me"],
  "Stative verbs": ["know", "like", "want"],
  "The future: degrees of certainty": ["might", "will definitely", "probably"],
  "Using 'as' and 'like'": ["look like", "as tall as"],
  "Using 'enough'": ["enough", "too heavy"],
  "Verbs and prepositions": ["good at", "listen to", "wait for"],
  "Verbs followed by '-ing' or infinitive to change meaning": ["stop doing", "remember to"],
  "Wishes: 'wish' and 'if only'": ["i wish", "if only"],
  "British English and American English": ["color", "colour"],
  "Capital letters and apostrophes": ["monday", "i'm"],
  // ── C1（14 课）──
  "Advanced passives review": ["was broken", "being done"],
  "Advanced present simple and continuous": ["am doing", "is doing"],
  "Avoiding repetition in a text": ["one", "so do i"],
  "Contrasting ideas": ["although", "however"],
  "Ellipsis": ["so do i"],
  "Emphasis: cleft sentences, inversion and auxiliaries": ["it is", "what i"],
  "Inversion after negative adverbials": ["never have i"],
  "Inversion and conditionals": ["were i", "had i"],
  "Modals: probability": ["might", "could be"],
  "Participle clauses": ["having done", "walking"],
  "Patterns with reporting verbs": ["told me", "said that"],
  "Possession and noun modifiers": ["my brother's", "the city centre"],
  "Unreal time": ["if i were", "i wish"],
  "Word order in phrasal verbs": ["turn it off", "pick up"],
};

const main = () => {
  const rows = Object.entries(PROBES).map(([lesson, probes]) => {
    const hits = probes.filter(has);
    return {
      lesson,
      probeCount: probes.length,
      hitCount: hits.length,
      hits,
      status: hits.length >= 2 ? "COVERED" : hits.length === 1 ? "UNCLEAR" : "GAP",
    };
  });
  fs.writeFileSync(`${HERE}/bc-coverage-report.json`, JSON.stringify(rows, null, 1));

  const tally = rows.reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }), {});
  console.log("审计条数:", rows.length, "| 分布:", JSON.stringify(tally));

  // 按档位分组（关键：我方是 A1→A2 线，A1-A2 的 GAP 才是真问题）
  const levelOf = JSON.parse(fs.readFileSync(`${HERE}/bc-lessons.json`, "utf8")) as Array<{ level: string; title: string }>;
  const byTitle = new Map(levelOf.map((x) => [x.title, x.level]));
  console.log("\n=== 按档位 × 状态 ===");
  const grid: Record<string, Record<string, number>> = {};
  for (const r of rows) {
    const lvl = byTitle.get(r.lesson) ?? "（未归档）";
    grid[lvl] ??= { COVERED: 0, UNCLEAR: 0, GAP: 0 };
    grid[lvl][r.status] += 1;
  }
  for (const [lvl, g] of Object.entries(grid)) console.log(`  ${lvl.padEnd(10)} 已覆盖 ${g.COVERED} / 存疑 ${g.UNCLEAR} / 缺口 ${g.GAP}`);

  console.log("\n=== A1-A2 档的逐条结果（这是最要紧的一档）===");
  for (const r of rows.filter((x) => byTitle.get(x.lesson) === "A1-A2")) {
    console.log(`  [${r.status.padEnd(7)}] ${r.lesson}  ${r.hitCount}/${r.probeCount}  ${r.hits.join(", ")}`);
  }

  for (const status of ["GAP", "UNCLEAR"] as const) {
    const pick = rows.filter((r) => r.status === status);
    console.log(`\n=== ${status}（${pick.length}）===`);
    for (const r of pick) console.log(`  [${byTitle.get(r.lesson) ?? "?"}] ${r.lesson}  [${r.hitCount}/${r.probeCount}] ${r.hits.join(", ")}`);
  }
};
main();
