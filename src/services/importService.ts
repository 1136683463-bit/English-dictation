import { AppData } from "../types";
import { hydrateWordInput, hydrateWordInputAsync, WordInput } from "./cardService";

const commonWords = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "to",
  "of",
  "in",
  "on",
  "for",
  "with",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "it",
  "this",
  "that",
  "you",
  "i",
  "we",
  "they",
  "he",
  "she",
  "as",
  "at",
  "by",
  "from",
  "not",
  "can",
  "will",
  "would",
  "should"
]);

export type ImportMode = "text" | "csv";

export interface ParsedWordRow {
  rowNumber: number;
  input: WordInput;
  raw: string;
}

export type WordImportRowStatus = "new" | "merge" | "duplicate" | "invalid";

export interface WordImportPreviewRow extends ParsedWordRow {
  status: WordImportRowStatus;
  reason: string;
  duplicateOf?: number;
}

export interface WordImportPreview {
  rows: WordImportPreviewRow[];
  stats: Record<WordImportRowStatus, number>;
  importableRows: WordImportPreviewRow[];
}

export const splitIntoSentences = (text: string) =>
  text
    .replace(/\r/g, "")
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);

export const extractCandidateWords = (text: string) => {
  const words = text
    .toLowerCase()
    .match(/[a-z]+(?:'[a-z]+)?/g);
  if (!words) return [];

  const counts = new Map<string, number>();
  for (const word of words) {
    if (word.length < 4 || commonWords.has(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 40)
    .map(([word, count]) => ({ word, count }));
};

const wordPattern = /^[a-z]+(?:[-'][a-z]+)*$/i;

const emptyWordInput = (word = ""): WordInput => ({
  word,
  translation: "",
  phonetic: "",
  partOfSpeech: "",
  englishDefinition: "",
  collocations: "",
  sourceSentence: "",
  unitId: "",
  note: "",
  tags: ""
});

const normalizeWord = (word: string) => word.trim().toLowerCase();

const splitDelimitedLine = (line: string) => {
  if (line.includes("\t")) return line.split("\t").map((value) => value.trim());
  if (line.includes("|")) return line.split("|").map((value) => value.trim());
  const commaColumns = parseCsvRows(line)[0] ?? [];
  if (commaColumns.length > 1) return commaColumns.map((value) => value.trim());
  const spacedColumns = line.split(/\s{2,}/).map((value) => value.trim());
  if (spacedColumns.length > 1 && wordPattern.test(spacedColumns[0])) return spacedColumns;
  const compactMatch = line.trim().match(/^([a-z]+(?:[-'][a-z]+)*)(?:\s+(.+))?$/i);
  return compactMatch ? [compactMatch[1], compactMatch[2] ?? ""] : [line.trim()];
};

const isHeaderLike = (value: string) =>
  ["word", "单词", "vocabulary", "english", "英文"].includes(value.trim().toLowerCase());

const mergeHydratedInput = (data: AppData, input: WordInput) => {
  const hydrated = hydrateWordInput(data, input.word);
  return mergeWordInputWithHydrated(input, hydrated);
};

const mergeHydratedInputAsync = async (data: AppData, input: WordInput) => {
  const hydrated = await hydrateWordInputAsync(data, input.word);
  return mergeWordInputWithHydrated(input, hydrated);
};

const mergeWordInputWithHydrated = (input: WordInput, hydrated: WordInput) => {
  return {
    ...hydrated,
    ...Object.fromEntries(
      Object.entries(input).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value])
    ),
    word: normalizeWord(input.word),
    translation: input.translation.trim() || hydrated.translation,
    phonetic: input.phonetic.trim() || hydrated.phonetic,
    partOfSpeech: input.partOfSpeech.trim() || hydrated.partOfSpeech,
    englishDefinition: input.englishDefinition.trim() || hydrated.englishDefinition,
    collocations: input.collocations.trim() || hydrated.collocations
  } as WordInput;
};

const parseWordTextInputs = (text: string) =>
  text
    .replace(/\r/g, "")
    .split(/\n+/)
    .map((line, index) => ({ line: line.trim(), rowNumber: index + 1 }))
    .filter(({ line }) => Boolean(line))
    .filter(({ line }) => !isHeaderLike(splitDelimitedLine(line)[0] ?? ""))
    .map(({ line, rowNumber }) => {
      const [word = "", translation = "", phonetic = "", partOfSpeech = "", sourceSentence = "", tags = ""] =
        splitDelimitedLine(line);
      return {
        rowNumber,
        raw: line,
        input: {
          ...emptyWordInput(word),
          translation,
          phonetic,
          partOfSpeech,
          sourceSentence,
          tags
        }
      };
    });

export const parseWordTextRows = (data: AppData, text: string): ParsedWordRow[] =>
  parseWordTextInputs(text).map((row) => ({
    ...row,
    input: mergeHydratedInput(data, row.input)
  }));

export const parseWordTextRowsAsync = async (data: AppData, text: string): Promise<ParsedWordRow[]> =>
  Promise.all(
    parseWordTextInputs(text).map(async (row) => ({
      ...row,
      input: await mergeHydratedInputAsync(data, row.input)
    }))
  );

export const parseCsvRows = (csv: string): string[][] => {
  const rows: string[][] = [];
  let current = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const next = csv[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(current.trim());
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(current.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      current = "";
      continue;
    }

    current += char;
  }

  row.push(current.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
};

const csvAliases: Record<keyof WordInput, string[]> = {
  word: ["word", "单词", "english", "英文", "vocabulary"],
  translation: ["translation", "释义", "中文", "meaning", "definition_cn", "chineseDefinition"],
  phonetic: ["phonetic", "音标", "ipa"],
  partOfSpeech: ["partOfSpeech", "part_of_speech", "pos", "词性"],
  englishDefinition: ["englishDefinition", "english_definition", "definition", "英文解释"],
  collocations: ["collocations", "搭配", "phrases"],
  sourceSentence: ["sourceSentence", "source_sentence", "sentence", "例句", "来源句"],
  sourceId: ["sourceId", "source_id", "materialId", "material_id", "来源材料"],
  unitId: ["unitId", "unit_id", "单元"],
  note: ["note", "备注"],
  tags: ["tags", "标签"]
};

const normalizeHeader = (value: string) => value.trim().toLowerCase().replace(/[\s-]+/g, "_");

const headerKeyFor = (header: string): keyof WordInput | undefined => {
  const normalized = normalizeHeader(header);
  return (Object.keys(csvAliases) as Array<keyof WordInput>).find((key) =>
    csvAliases[key].some((alias) => normalizeHeader(alias) === normalized)
  );
};

const parseWordCsvInputs = (csv: string): ParsedWordRow[] => {
  const rows = parseCsvRows(csv);
  if (rows.length === 0) return [];

  const firstRow = rows[0];
  const hasHeader = firstRow.some((header) => Boolean(headerKeyFor(header)));
  const headers = hasHeader
    ? firstRow.map((header) => headerKeyFor(header))
    : (["word", "translation", "phonetic", "partOfSpeech", "englishDefinition", "collocations", "sourceSentence", "tags"] as Array<
        keyof WordInput
      >);
  const dataRows = hasHeader ? rows.slice(1) : rows;

  return dataRows.map((columns, index) => {
    const rowNumber = index + (hasHeader ? 2 : 1);
    const input = emptyWordInput();
    columns.forEach((value, columnIndex) => {
      const key = headers[columnIndex];
      if (key) input[key] = value;
    });
    return {
      rowNumber,
      raw: columns.join(","),
      input
    };
  });
};

export const parseWordCsvRows = (data: AppData, csv: string): ParsedWordRow[] =>
  parseWordCsvInputs(csv).map((row) => ({
    ...row,
    input: mergeHydratedInput(data, row.input)
  }));

export const parseWordCsvRowsAsync = async (data: AppData, csv: string): Promise<ParsedWordRow[]> =>
  Promise.all(
    parseWordCsvInputs(csv).map(async (row) => ({
      ...row,
      input: await mergeHydratedInputAsync(data, row.input)
    }))
  );

export const parseWordImportRows = (data: AppData, content: string, mode: ImportMode) =>
  mode === "csv" ? parseWordCsvRows(data, content) : parseWordTextRows(data, content);

export const parseWordImportRowsAsync = (data: AppData, content: string, mode: ImportMode) =>
  mode === "csv" ? parseWordCsvRowsAsync(data, content) : parseWordTextRowsAsync(data, content);

export const buildWordImportPreview = (data: AppData, rows: ParsedWordRow[]): WordImportPreview => {
  const existingWords = new Set(data.wordDetails.map((details) => details.word.toLowerCase()));
  const seen = new Map<string, number>();
  const stats: WordImportPreview["stats"] = {
    new: 0,
    merge: 0,
    duplicate: 0,
    invalid: 0
  };

  const previewRows = rows.map((row) => {
    const word = normalizeWord(row.input.word);

    if (!word || !wordPattern.test(word)) {
      stats.invalid += 1;
      return { ...row, status: "invalid" as const, reason: "缺少有效英文单词" };
    }

    const firstSeen = seen.get(word);
    if (firstSeen) {
      stats.duplicate += 1;
      return { ...row, status: "duplicate" as const, reason: `同批重复，第 ${firstSeen} 行已出现`, duplicateOf: firstSeen };
    }

    seen.set(word, row.rowNumber);

    if (existingWords.has(word)) {
      stats.merge += 1;
      return { ...row, input: { ...row.input, word }, status: "merge" as const, reason: "将合并到已有单词" };
    }

    stats.new += 1;
    return { ...row, input: { ...row.input, word }, status: "new" as const, reason: "将新增" };
  });

  return {
    rows: previewRows,
    stats,
    importableRows: previewRows.filter((row) => row.status === "new" || row.status === "merge")
  };
};
