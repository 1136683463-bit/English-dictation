import fs from "node:fs";

const [, , inputPath = "/tmp/ecdict.csv", outputPath = "src/data/bundledDictionary.ts", limitArg = "12000"] = process.argv;
const limit = Number(limitArg);

const parseCsv = (input) => {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (inQuotes) {
      if (char === "\"" && next === "\"") {
        field += "\"";
        index += 1;
      } else if (char === "\"") {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === "\"") {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows;
};

const cleanText = (value, limitLength = 220) =>
  (value || "")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^\[(网络|网|医|化|计|经|法|军|体|音|农|地质|生物|物|数|天)\]/.test(line))
    .slice(0, 3)
    .join("\n")
    .slice(0, limitLength)
    .trim();

const normalizePhonetic = (value) => {
  const phonetic = (value || "").trim();
  if (!phonetic) return "";
  if (phonetic.startsWith("/") && phonetic.endsWith("/")) return phonetic;
  return `/${phonetic}/`;
};

const extractPartOfSpeech = (row, idx) => {
  const pos = (row[idx.pos] || "").trim();
  if (pos) {
    return pos
      .split("/")
      .filter(Boolean)
      .map((item) => (item.endsWith(".") ? item : `${item}.`))
      .join("/");
  }

  const match = (row[idx.translation] || "").match(/\b(n|v|vt|vi|adj|adv|prep|conj|pron|num|int|abbr|a|ad|art)\./i);
  return match ? `${match[1].toLowerCase()}.` : "";
};

const scoreRow = (row, idx) => {
  const collins = Number(row[idx.collins] || 0);
  const oxford = Number(row[idx.oxford] || 0);
  const tag = row[idx.tag] || "";
  const bnc = Number(row[idx.bnc] || 0);
  const frq = Number(row[idx.frq] || 0);

  let score = 0;
  if (bnc > 0) score += Math.max(0, 240000 - bnc);
  if (frq > 0) score += Math.max(0, 240000 - frq);
  score += collins * 30000;
  score += oxford ? 80000 : 0;
  if (/\bzk\b/.test(tag)) score += 70000;
  if (/\bgk\b/.test(tag)) score += 65000;
  if (/\bcet4\b/.test(tag)) score += 55000;
  if (/\bcet6\b/.test(tag)) score += 40000;
  if (/\bky\b|\btoefl\b|\bielts\b|\bgre\b/.test(tag)) score += 25000;
  return score;
};

const source = fs.readFileSync(inputPath, "utf8");
const rows = parseCsv(source);
const header = rows[0];
const idx = Object.fromEntries(header.map((name, index) => [name, index]));
const entries = [];
const seen = new Set();

for (const row of rows.slice(1)) {
  const word = (row[idx.word] || "").trim().toLowerCase();
  if (!word || seen.has(word)) continue;
  if (!/^[a-z][a-z'-]{1,28}$/.test(word)) continue;
  if (word.startsWith("'") || word.startsWith("-") || word.endsWith("-")) continue;

  const translation = cleanText(row[idx.translation], 240);
  if (!translation) continue;

  const entry = {
    word,
    phonetic: normalizePhonetic(row[idx.phonetic]),
    partOfSpeech: extractPartOfSpeech(row, idx),
    definition: cleanText(row[idx.definition], 240),
    translation,
    collocations: "",
    score: scoreRow(row, idx)
  };

  if (entry.score <= 0 && !entry.phonetic) continue;
  entries.push(entry);
  seen.add(word);
}

entries.sort((a, b) => b.score - a.score || a.word.localeCompare(b.word));

const selected = entries.slice(0, limit).map(({ score, ...entry }) => entry);
const output = `import { DictionaryEntry } from "../types";\n\nexport const bundledDictionary: DictionaryEntry[] = ${JSON.stringify(selected)};\n`;

fs.writeFileSync(outputPath, output);
console.log(`Generated ${selected.length} entries at ${outputPath}`);
