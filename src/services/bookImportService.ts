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
  format: "txt" | "csv";
  chapters: ParsedBookChapter[];
  /** 无法识别而跳过的行数。 */
  skippedLines: number;
  warning?: string;
}

export type BookFileFormat = "txt" | "csv";

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

  lines.forEach((rawLine) => {
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
      return;
    }
    // 章节内重复的单词只保留第一条；没有章节时先补一个匿名章节
    if (store.chapters.length === 0) store.addChapter("");
    store.appendWord(word);
  });

  return { format: "txt", chapters: store.chapters, skippedLines };
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

const parseCsvBook = (content: string): ParsedBookFile => {
  const rows = parseCsvRows(content);
  if (rows.length === 0) return { format: "csv", chapters: [], skippedLines: 0 };

  const firstRow = rows[0];
  const headerKeys = firstRow.map((header) => csvHeaderKeyFor(header));
  const hasHeader = headerKeys.some(Boolean);
  const headers: (CsvColumnKey | undefined)[] = hasHeader
    ? headerKeys
    : (["word", "translation", "phonetic", "partOfSpeech"] as CsvColumnKey[]);

  const store = createChapterStore();
  let skippedLines = 0;

  rows.slice(hasHeader ? 1 : 0).forEach((columns) => {
    const values: Partial<Record<CsvColumnKey, string>> = {};
    columns.forEach((value, columnIndex) => {
      const key = headers[columnIndex];
      if (key) values[key] = value;
    });

    const { word, phonetic, partOfSpeech } = extractWordParts(values.word ?? "");
    if (!hasValidWord(word)) {
      if (columns.some(Boolean)) skippedLines += 1;
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

  return { format: "csv", chapters: store.chapters, skippedLines };
};

/** 把整份文件内容解析成词书章节。 */
export const parseBookFileContent = (content: string, format: BookFileFormat): ParsedBookFile => {
  const parsed = format === "csv" ? parseCsvBook(content) : parseTxtBook(content);
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

/** 按文件扩展名判断解析格式。 */
export const detectBookFileFormat = (filename: string): BookFileFormat =>
  /\.(csv|tsv)$/i.test(filename) ? "csv" : "txt";

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
