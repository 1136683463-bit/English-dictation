import * as XLSX from "xlsx";
import { parseCsvRows } from "./importService";

/** 文件导入解析出的一条单词。 */
export interface ParsedBookWord {
  word: string;
  translation: string;
  phonetic: string;
  partOfSpeech: string;
}

/** 文件导入解析出的一个章节（一章对应一本词书）。 */
export interface ParsedBookChapter {
  title: string;
  words: ParsedBookWord[];
}

export interface ParsedBookFile {
  format: "txt" | "csv" | "xlsx";
  chapters: ParsedBookChapter[];
  /** 无法识别而跳过的行数。 */
  skippedLines: number;
  /** P1-3：被跳过行的明细（行号/原文/原因），最多保留 maxSkippedLineDetails 条。 */
  skippedLineDetails: SkippedBookLine[];
  warning?: string;
}

/** P1-3 错误行标注：一条无法识别被跳过的行。 */
export interface SkippedBookLine {
  /** 原文件中的行号（1 起；CSV 含表头偏移，按解析行计）。 */
  lineNumber: number;
  /** 原始行内容（截断到 120 字符）。 */
  raw: string;
  reason: string;
}

/** 错误行明细最多保留条数（skippedLines 计数不受影响）。 */
export const maxSkippedLineDetails = 100;

export type BookFileFormat = "txt" | "csv" | "xlsx";

const letterPattern = /[a-zA-Z]/;
const listMarkerPattern = /^\s*(?:[-*•·]|\d+\s*[.)、]|[a-zA-Z][.)])\s+/;
const partOfSpeechPattern = /^(?:(?:n|v|vt|vi|adj|adv|prep|conj|pron|art|num|int|interj|phr|aux)\.\s*)+/i;
const maxImportWords = 5000;

export const normalizeBookWord = (word: string) => word.trim().toLowerCase();

const normalizeSpaces = (value: string) => value.replace(/\s+/g, " ").trim();

const stripListMarker = (line: string) => line.replace(listMarkerPattern, "").trim();

const hasValidWord = (word: string) => Boolean(word) && letterPattern.test(word);

const splitWordLine = (line: string): string[] => {
  if (line.includes("\t")) return line.split("\t");
  if (line.includes("|")) return line.split("|");
  if (line.includes(",")) {
    const columns = parseCsvRows(line)[0] ?? [];
    if (columns.length > 1) return columns;
  }
  // 「apple 苹果」这类英文跟中文释义的写法
  const cjkMatch = line.match(/^(\S.*?)\s+([\u4e00-\u9fff（(].*)$/);
  if (cjkMatch) return [cjkMatch[1], cjkMatch[2]];
  return [line];
};

/** 从单词列里剥出尾缀的音标与词性，支持「apple /ˈæpl/ n.」这类组合。 */
const extractWordParts = (rawWord: string): { word: string; phonetic: string; partOfSpeech: string } => {
  let value = normalizeSpaces(rawWord);
  let phonetic = "";
  let partOfSpeech = "";

  for (;;) {
    const phoneticMatch = value.match(/^(.*?)[\s]*([/[][^/\[\]]+[/\]])$/);
    if (!phonetic && phoneticMatch && phoneticMatch[1].trim() && letterPattern.test(phoneticMatch[1])) {
      value = normalizeSpaces(phoneticMatch[1]);
      phonetic = phoneticMatch[2];
      continue;
    }
    const posMatch = value.match(/^(.+?)\s+((?:[a-z]+\.\s*)+)$/i);
    if (posMatch && posMatch[1].trim() && letterPattern.test(posMatch[1])) {
      value = normalizeSpaces(posMatch[1]);
      partOfSpeech = `${posMatch[2].trim()} ${partOfSpeech}`.trim();
      continue;
    }
    break;
  }

  return { word: value, phonetic, partOfSpeech };
};

const extractPartOfSpeech = (translation: string) => {
  const match = translation.match(partOfSpeechPattern);
  if (!match) return { translation, partOfSpeech: "" };
  return { translation: translation.slice(match[0].length).trim(), partOfSpeech: match[0].trim() };
};

const wordFromColumns = (columns: string[]): ParsedBookWord | null => {
  const { word, phonetic, partOfSpeech } = extractWordParts(columns[0] ?? "");
  if (!hasValidWord(word)) return null;

  let nextPhonetic = phonetic;
  const translationParts: string[] = [];
  columns.slice(1).forEach((column) => {
    const value = normalizeSpaces(column);
    if (!value) return;
    if (!nextPhonetic && /^[/[][^/\[\]]+[/\]]$/.test(value)) {
      nextPhonetic = value;
      return;
    }
    translationParts.push(value);
  });

  let translation = translationParts.join(" ");
  let nextPartOfSpeech = partOfSpeech;
  if (!nextPartOfSpeech) {
    const extracted = extractPartOfSpeech(translation);
    translation = extracted.translation;
    nextPartOfSpeech = extracted.partOfSpeech;
  }
  return {
    word,
    translation,
    phonetic: nextPhonetic,
    partOfSpeech: nextPartOfSpeech
  };
};

/** 记录一条错误行明细，超出上限时只累计数、不再留明细。 */
const pushSkippedLine = (details: SkippedBookLine[], entry: SkippedBookLine) => {
  if (details.length < maxSkippedLineDetails) {
    details.push({ ...entry, raw: entry.raw.slice(0, 120) });
  }
};

const createChapterStore = () => {
  const chapters: ParsedBookChapter[] = [];
  const seenSets: Set<string>[] = [];
  const chapterIndexByKey = new Map<string, number>();

  return {
    chapters,
    /** 新建一个章节。 */
    addChapter(title: string) {
      chapters.push({ title: title.trim(), words: [] });
      seenSets.push(new Set());
    },
    /** 按标题取已有章节，避免同名章节重复创建。 */
    addOrReuseChapter(title: string) {
      const key = title.trim();
      if (!key) {
        if (chapters.length === 0) this.addChapter("");
        return;
      }
      if (chapterIndexByKey.has(key)) return;
      this.addChapter(key);
      chapterIndexByKey.set(key, chapters.length - 1);
    },
    /**
     * 向最后一个章节追加单词（章节内去重）。
     * 返回 "added" / "duplicate" / "empty"（尚无章节时）。
     */
    appendWord(word: ParsedBookWord): "added" | "duplicate" | "empty" {
      if (chapters.length === 0) return "empty";
      const normalized = normalizeBookWord(word.word);
      const seen = seenSets[seenSets.length - 1];
      if (seen.has(normalized)) return "duplicate";
      chapters[chapters.length - 1].words.push(word);
      seen.add(normalized);
      return "added";
    }
  };
};

const parseTxtBook = (content: string): ParsedBookFile => {
  const lines = content.replace(/\r/g, "").split("\n");
  const store = createChapterStore();
  let skippedLines = 0;
  const skippedLineDetails: SkippedBookLine[] = [];

  lines.forEach((rawLine, lineIndex) => {
    const line = stripListMarker(rawLine);
    if (!line) return;

    const headingMatch = line.match(/^(#{1,4})\s*(.+)$/);
    if (headingMatch) {
      store.addChapter(normalizeSpaces(headingMatch[2]));
      return;
    }

    const word = wordFromColumns(splitWordLine(line));
    if (!word) {
      skippedLines += 1;
      pushSkippedLine(skippedLineDetails, { lineNumber: lineIndex + 1, raw: rawLine.trim(), reason: "未识别到英文单词" });
      return;
    }
    // 章节内重复的单词只保留第一条；没有章节时先补一个匿名章节
    if (store.chapters.length === 0) store.addChapter("");
    store.appendWord(word);
  });

  return { format: "txt", chapters: store.chapters, skippedLines, skippedLineDetails };
};

const normalizeCsvHeader = (value: string) => value.trim().toLowerCase().replace(/[\s_-]+/g, "");

type CsvColumnKey = "word" | "translation" | "phonetic" | "partOfSpeech" | "chapter";

const csvHeaderAliases: Record<CsvColumnKey, string[]> = {
  word: ["word", "单词", "english", "英文", "vocabulary", "单词词组"],
  translation: ["translation", "释义", "中文", "meaning", "翻译", "解释", "definition", "chinese", "中文释义"],
  phonetic: ["phonetic", "音标", "ipa"],
  partOfSpeech: ["partofspeech", "pos", "词性"],
  chapter: ["chapter", "章节", "unit", "单元", "list", "book", "书", "分组", "章节名", "单元名", "课"]
};

const csvHeaderKeyFor = (header: string): CsvColumnKey | undefined => {
  const normalized = normalizeCsvHeader(header);
  return (Object.keys(csvHeaderAliases) as CsvColumnKey[]).find((key) =>
    csvHeaderAliases[key].some((alias) => normalizeCsvHeader(alias) === normalized)
  );
};

/** 把按列对齐的表格行解析成章节（CSV 与 XLSX 共用一套表头映射与列语义）。 */
const parseTableBook = (rows: string[][], format: "csv" | "xlsx"): ParsedBookFile => {
  const skippedLineDetails: SkippedBookLine[] = [];
  if (rows.length === 0) return { format, chapters: [], skippedLines: 0, skippedLineDetails };

  const firstRow = rows[0];
  const headerKeys = firstRow.map((header) => csvHeaderKeyFor(header));
  const hasHeader = headerKeys.some(Boolean);
  const headers: (CsvColumnKey | undefined)[] = hasHeader
    ? headerKeys
    : (["word", "translation", "phonetic", "partOfSpeech"] as CsvColumnKey[]);

  const store = createChapterStore();
  let skippedLines = 0;

  rows.slice(hasHeader ? 1 : 0).forEach((columns, rowIndex) => {
    const values: Partial<Record<CsvColumnKey, string>> = {};
    columns.forEach((value, columnIndex) => {
      const key = headers[columnIndex];
      if (key) values[key] = value;
    });

    const { word, phonetic, partOfSpeech } = extractWordParts(values.word ?? "");
    if (!hasValidWord(word)) {
      if (columns.some(Boolean)) {
        skippedLines += 1;
        const rawWord = normalizeSpaces(values.word ?? "");
        pushSkippedLine(skippedLineDetails, {
          lineNumber: rowIndex + (hasHeader ? 2 : 1),
          raw: columns.map((column) => column.trim()).filter(Boolean).join(", "),
          reason: rawWord ? "单词列不含英文" : "单词列为空"
        });
      }
      return;
    }

    store.addOrReuseChapter(values.chapter ?? "");
    const extracted = extractPartOfSpeech(normalizeSpaces(values.translation ?? ""));
    store.appendWord({
      word,
      translation: extracted.translation,
      phonetic: normalizeSpaces(values.phonetic ?? "") || phonetic,
      partOfSpeech: normalizeSpaces(values.partOfSpeech ?? "") || partOfSpeech || extracted.partOfSpeech
    });
  });

  return { format, chapters: store.chapters, skippedLines, skippedLineDetails };
};

const parseCsvBook = (content: string): ParsedBookFile => parseTableBook(parseCsvRows(content), "csv");

/** 单元格原始值转成字符串（数字/布尔统一 stringify，空值归一为空串）。 */
const xlsxCellToString = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
};

/**
 * 解析 xlsx 工作簿：
 * - 逐 sheet 读取（空 sheet 跳过，全部为空则返回空结果）；
 * - 每个 sheet 的第一行按表头映射（word/单词、translation/释义、phonetic/音标、pos/词性、chapter/章节），
 *   识别不到表头时按「单词, 释义, 音标, 词性」列序解析；
 * - 有章节列时按章节列分章；否则整个 sheet 归为一个章节——多 sheet 时用 sheet 名命名，
 *   单 sheet 沿用匿名章节（与 CSV 默认行为一致）。
 */
export const parseXlsxBook = (data: ArrayBuffer): ParsedBookFile => {
  const workbook = XLSX.read(data, { type: "array" });
  const skippedLineDetails: SkippedBookLine[] = [];
  const store = createChapterStore();
  let skippedLines = 0;
  let parsedSheetCount = 0;

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return;
    const rows = (XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" }) as unknown[][]).map((row) =>
      row.map(xlsxCellToString)
    );
    // 整表没有有效内容时跳过
    if (!rows.some((row) => row.some(Boolean))) return;

    parsedSheetCount += 1;
    const sheetTitle = sheetName.trim();
    const multiSheet = workbook.SheetNames.length > 1;

    const firstRow = rows[0];
    const headerKeys = firstRow.map((header) => csvHeaderKeyFor(header));
    const hasHeader = headerKeys.some(Boolean);
    const headers: (CsvColumnKey | undefined)[] = hasHeader
      ? headerKeys
      : (["word", "translation", "phonetic", "partOfSpeech"] as CsvColumnKey[]);
    const hasChapterColumn = headers.some((key) => key === "chapter");

    rows.slice(hasHeader ? 1 : 0).forEach((columns, rowIndex) => {
      const values: Partial<Record<CsvColumnKey, string>> = {};
      columns.forEach((value, columnIndex) => {
        const key = headers[columnIndex];
        if (key) values[key] = value;
      });

      const { word, phonetic, partOfSpeech } = extractWordParts(values.word ?? "");
      if (!hasValidWord(word)) {
        if (columns.some(Boolean)) {
          skippedLines += 1;
          const rawWord = normalizeSpaces(values.word ?? "");
          pushSkippedLine(skippedLineDetails, {
            lineNumber: rowIndex + (hasHeader ? 2 : 1),
            raw: columns.map((column) => column.trim()).filter(Boolean).join(", "),
            reason: sheetTitle ? `${sheetTitle}：${rawWord ? "单词列不含英文" : "单词列为空"}` : rawWord ? "单词列不含英文" : "单词列为空"
          });
        }
        return;
      }

      // 有章节列时按章节列分章；否则整个 sheet 归为一个章节
      if (hasChapterColumn) {
        store.addOrReuseChapter(values.chapter ?? "");
      } else {
        store.addOrReuseChapter(multiSheet ? sheetTitle : "");
      }
      const extracted = extractPartOfSpeech(normalizeSpaces(values.translation ?? ""));
      store.appendWord({
        word,
        translation: extracted.translation,
        phonetic: normalizeSpaces(values.phonetic ?? "") || phonetic,
        partOfSpeech: normalizeSpaces(values.partOfSpeech ?? "") || partOfSpeech || extracted.partOfSpeech
      });
    });
  });

  if (parsedSheetCount === 0) {
    return { format: "xlsx", chapters: [], skippedLines: 0, skippedLineDetails };
  }
  return { format: "xlsx", chapters: store.chapters, skippedLines, skippedLineDetails };
};

/** 统一套用导入上限与警告（5000 词截断 / 跳过行提示）。 */
const applyImportCaps = (parsed: ParsedBookFile): ParsedBookFile => {
  const totalWords = parsed.chapters.reduce((sum, chapter) => sum + chapter.words.length, 0);
  let warning: string | undefined;
  if (parsed.skippedLines > 0) {
    warning = `${parsed.skippedLines} 行无法识别，已跳过`;
  }
  if (totalWords > maxImportWords) {
    let remaining = maxImportWords;
    parsed.chapters.forEach((chapter) => {
      chapter.words = chapter.words.slice(0, Math.max(0, remaining));
      remaining -= chapter.words.length;
    });
    warning = `${warning ? `${warning}；` : ""}单次最多导入 ${maxImportWords} 词，超出部分已截断`;
  }
  return { ...parsed, warning };
};

/** 把整份文件内容解析成词书章节（txt / csv 文本）。 */
export const parseBookFileContent = (content: string, format: BookFileFormat): ParsedBookFile => {
  const parsed = format === "csv" ? parseCsvBook(content) : parseTxtBook(content);
  return applyImportCaps(parsed);
};

/** 把 xlsx 工作簿（ArrayBuffer）解析成词书章节，套用与文本导入相同的上限与警告。 */
export const parseXlsxFileContent = (data: ArrayBuffer): ParsedBookFile => applyImportCaps(parseXlsxBook(data));

/** 按文件扩展名判断解析格式。 */
export const detectBookFileFormat = (filename: string): BookFileFormat => {
  if (/\.(xlsx|xls)$/i.test(filename)) return "xlsx";
  return /\.(csv|tsv)$/i.test(filename) ? "csv" : "txt";
};

/**
 * 读取文本文件：默认 UTF-8；出现乱码字符时按 GBK 再读一次，
 * 兼容国内常见的 Windows 导出文件。
 */
export const readBookFileText = async (file: File): Promise<string> => {
  const utf8Text = await file.text();
  if (!utf8Text.includes("\uFFFD")) return utf8Text;

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (result) resolve(result);
      else reject(new Error("文件读取失败。"));
    };
    reader.onerror = () => reject(new Error("文件读取失败。"));
    reader.readAsText(file, "GBK");
  });
};

/** 从文件名推导默认词书名。 */
export const bookTitleFromFile = (filename: string) =>
  filename
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .trim()
    .slice(0, 20);

/** 把单个章节按固定词数切成多章。 */
export const splitChapterIntoChunks = (chapter: ParsedBookChapter, size: number): ParsedBookChapter[] => {
  const safeSize = Math.max(1, Math.floor(size));
  const baseTitle = chapter.title.trim() || "list";
  const chunks: ParsedBookChapter[] = [];
  for (let index = 0; index < chapter.words.length; index += safeSize) {
    chunks.push({
      title: `${baseTitle} ${chunks.length + 1}`,
      words: chapter.words.slice(index, index + safeSize)
    });
  }
  return chunks;
};

/** 按当前设置整理出真正要导入的章节列表。 */
export const buildImportChapters = (chapters: ParsedBookChapter[], splitSize: number | null): ParsedBookChapter[] => {
  const usable = chapters.filter((chapter) => chapter.words.length > 0);
  if (usable.length === 1 && splitSize) {
    return splitChapterIntoChunks(usable[0], splitSize);
  }
  return usable;
};

/**
 * P1-3 单行剔除：剔除键 = `${源章节序号}:${规范化单词}`。
 * 章节内解析时已去重，同词可存在于不同章节，因此键必须带章节序号。
 */
export const bookWordExclusionKey = (chapterIndex: number, word: string) =>
  `${chapterIndex}:${normalizeBookWord(word)}`;

/** P1-3 单行剔除：按剔除键集合过滤章节单词；保持源章节序号不变，保证键持续对齐。 */
export const applyWordExclusions = (
  chapters: ParsedBookChapter[],
  excludedKeys: ReadonlySet<string>
): ParsedBookChapter[] =>
  chapters.map((chapter, index) => ({
    ...chapter,
    words: chapter.words.filter((word) => !excludedKeys.has(bookWordExclusionKey(index, word.word)))
  }));

/**
 * P0-3 配套：把超过 maxWords 的章节切成 ≤maxWords 的小节（标题 `· 1/2` 递增）。
 * 与 splitChapterIntoChunks 的区别：只切超限章节，≤maxWords 的章节原样保留原标题。
 */
export const splitOversizedChapters = (
  chapters: ParsedBookChapter[],
  maxWords = 200
): ParsedBookChapter[] => {
  const safeMax = Math.max(1, Math.floor(maxWords));
  const result: ParsedBookChapter[] = [];
  for (const chapter of chapters) {
    if (chapter.words.length <= safeMax) {
      result.push(chapter);
      continue;
    }
    const baseTitle = chapter.title.trim() || "list";
    const chunkCount = Math.ceil(chapter.words.length / safeMax);
    for (let chunkIndex = 0; chunkIndex < chunkCount; chunkIndex += 1) {
      result.push({
        title: `${baseTitle} · ${chunkIndex + 1}`,
        words: chapter.words.slice(chunkIndex * safeMax, (chunkIndex + 1) * safeMax)
      });
    }
  }
  return result;
};
