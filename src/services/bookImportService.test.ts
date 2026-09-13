import { describe, expect, it } from "vitest";
import * as XLSX from "xlsx";
import {
  applyWordExclusions,
  bookTitleFromFile,
  bookWordExclusionKey,
  buildImportChapters,
  detectBookFileFormat,
  maxSkippedLineDetails,
  parseBookFileContent,
  parseXlsxFileContent,
  splitChapterIntoChunks,
  splitOversizedChapters
} from "./bookImportService";

/** 用 SheetJS 造一个内存中的 xlsx 工作簿，返回 ArrayBuffer。 */
const makeXlsxBuffer = (sheets: Array<{ name: string; rows: unknown[][] }>): ArrayBuffer => {
  const workbook = XLSX.utils.book_new();
  sheets.forEach(({ name, rows }) => {
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rows), name);
  });
  return XLSX.write(workbook, { type: "array", bookType: "xlsx" }) as ArrayBuffer;
};

describe("bookImportService", () => {
  it("detects format by extension", () => {
    expect(detectBookFileFormat("核心100.csv")).toBe("csv");
    expect(detectBookFileFormat("核心100.TSV")).toBe("csv");
    expect(detectBookFileFormat("核心100.txt")).toBe("txt");
    expect(detectBookFileFormat("核心100.xlsx")).toBe("xlsx");
    expect(detectBookFileFormat("核心100.XLSX")).toBe("xlsx");
    expect(detectBookFileFormat("核心100.xls")).toBe("xlsx");
    expect(detectBookFileFormat("考研词汇")).toBe("txt");
  });

  it("parses txt with # chapters and word translations", () => {
    const content = [
      "# Unit 1",
      "apple 苹果",
      "banana, 香蕉",
      "orange\t橙子",
      "",
      "# Unit 2",
      "grape 葡萄",
      "grape 葡萄"
    ].join("\n");

    const parsed = parseBookFileContent(content, "txt");

    expect(parsed.format).toBe("txt");
    expect(parsed.chapters).toHaveLength(2);
    expect(parsed.chapters[0].title).toBe("Unit 1");
    expect(parsed.chapters[0].words.map((word) => word.word)).toEqual(["apple", "banana", "orange"]);
    expect(parsed.chapters[0].words[0].translation).toBe("苹果");
    expect(parsed.chapters[0].words[1].translation).toBe("香蕉");
    expect(parsed.chapters[0].words[2].translation).toBe("橙子");
    // 章节内重复的单词只保留一条
    expect(parsed.chapters[1].words).toHaveLength(1);
    expect(parsed.skippedLines).toBe(0);
  });

  it("keeps phrases and strips list markers in txt", () => {
    const parsed = parseBookFileContent("- take advantage of 利用\n1. look forward to 期待", "txt");

    expect(parsed.chapters[0].words[0].word).toBe("take advantage of");
    expect(parsed.chapters[0].words[0].translation).toBe("利用");
    expect(parsed.chapters[0].words[1].word).toBe("look forward to");
  });

  it("extracts inline phonetics and part of speech", () => {
    const parsed = parseBookFileContent("apple /ˈæpl/ n. 苹果", "txt");
    const word = parsed.chapters[0].words[0];

    expect(word.word).toBe("apple");
    expect(word.phonetic).toBe("/ˈæpl/");
    expect(word.partOfSpeech).toBe("n.");
    expect(word.translation).toBe("苹果");
  });

  it("counts unrecognized lines as skipped", () => {
    const parsed = parseBookFileContent("apple 苹果\n12345\n！！！", "txt");

    expect(parsed.chapters[0].words).toHaveLength(1);
    expect(parsed.skippedLines).toBe(2);
    expect(parsed.warning).toContain("2 行无法识别");
  });

  it("annotates skipped txt lines with line number, raw content and reason", () => {
    const parsed = parseBookFileContent("# List 1\napple 苹果\n12345\n\n！！！", "txt");

    expect(parsed.skippedLineDetails).toEqual([
      { lineNumber: 3, raw: "12345", reason: "未识别到英文单词" },
      { lineNumber: 5, raw: "！！！", reason: "未识别到英文单词" }
    ]);
  });

  it("caps skipped line details but keeps the full count", () => {
    const lines = Array.from({ length: maxSkippedLineDetails + 5 }, () => "！！！");
    const parsed = parseBookFileContent(["apple 苹果", ...lines].join("\n"), "txt");

    expect(parsed.skippedLines).toBe(maxSkippedLineDetails + 5);
    expect(parsed.skippedLineDetails).toHaveLength(maxSkippedLineDetails);
    expect(parsed.skippedLineDetails[0].lineNumber).toBe(2);
  });

  it("annotates skipped csv rows with header-aware line numbers and specific reasons", () => {
    const content = [
      "word,translation",
      "apple,苹果",
      ",缺单词列",
      "12345,数字词"
    ].join("\n");
    const parsed = parseBookFileContent(content, "csv");

    expect(parsed.skippedLines).toBe(2);
    expect(parsed.skippedLineDetails).toEqual([
      { lineNumber: 3, raw: "缺单词列", reason: "单词列为空" },
      { lineNumber: 4, raw: "12345, 数字词", reason: "单词列不含英文" }
    ]);
  });

  it("applies word exclusions per chapter without shifting source indices", () => {
    const chapters = [
      { title: "A", words: [
        { word: "apple", translation: "", phonetic: "", partOfSpeech: "" },
        { word: "banana", translation: "", phonetic: "", partOfSpeech: "" }
      ] },
      { title: "B", words: [
        { word: "apple", translation: "", phonetic: "", partOfSpeech: "" }
      ] }
    ];
    const excluded = new Set([bookWordExclusionKey(0, "apple")]);
    const result = applyWordExclusions(chapters, excluded);

    // 只剔除 A 章的 apple，B 章同名单词保留；源章节数量与顺序不变
    expect(result).toHaveLength(2);
    expect(result[0].words.map((word) => word.word)).toEqual(["banana"]);
    expect(result[1].words.map((word) => word.word)).toEqual(["apple"]);
    // 原数组不被修改
    expect(chapters[0].words).toHaveLength(2);
  });

  it("falls back to a single chapter without headings", () => {
    const parsed = parseBookFileContent("apple 苹果\nbanana 香蕉", "txt");

    expect(parsed.chapters).toHaveLength(1);
    expect(parsed.chapters[0].title).toBe("");
  });

  it("parses csv with headers and chapter column", () => {
    const content = [
      "word,translation,phonetic,chapter",
      'context,"语境, 上下文",/ˈkɒntekst/,List 1',
      "banana,香蕉,,List 1",
      "grape,葡萄,,List 2",
      "grape,葡萄,,List 2"
    ].join("\n");

    const parsed = parseBookFileContent(content, "csv");

    expect(parsed.chapters.map((chapter) => chapter.title)).toEqual(["List 1", "List 2"]);
    expect(parsed.chapters[0].words[0].translation).toBe("语境, 上下文");
    expect(parsed.chapters[0].words[0].phonetic).toBe("/ˈkɒntekst/");
    expect(parsed.chapters[1].words).toHaveLength(1);
  });

  it("parses chinese csv headers", () => {
    const content = ["单词,释义,章节", "apple,苹果,第1课", "banana,香蕉,第2课"].join("\n");
    const parsed = parseBookFileContent(content, "csv");

    expect(parsed.chapters.map((chapter) => chapter.title)).toEqual(["第1课", "第2课"]);
    expect(parsed.chapters[0].words[0].translation).toBe("苹果");
  });

  it("defaults csv columns without header", () => {
    const parsed = parseBookFileContent("apple,苹果\nbanana,香蕉", "csv");

    expect(parsed.chapters).toHaveLength(1);
    expect(parsed.chapters[0].words.map((word) => word.word)).toEqual(["apple", "banana"]);
    expect(parsed.chapters[0].words[0].translation).toBe("苹果");
  });

  it("parses xlsx with headers and chapter column", () => {
    const buffer = makeXlsxBuffer([
      {
        name: "Sheet1",
        rows: [
          ["word", "translation", "phonetic", "chapter"],
          ["context", "语境, 上下文", "/ˈkɒntekst/", "List 1"],
          ["banana", "香蕉", "", "List 1"],
          ["grape", "葡萄", "", "List 2"],
          ["grape", "葡萄", "", "List 2"]
        ]
      }
    ]);
    const parsed = parseXlsxFileContent(buffer);

    expect(parsed.format).toBe("xlsx");
    expect(parsed.chapters.map((chapter) => chapter.title)).toEqual(["List 1", "List 2"]);
    expect(parsed.chapters[0].words[0].translation).toBe("语境, 上下文");
    expect(parsed.chapters[0].words[0].phonetic).toBe("/ˈkɒntekst/");
    // 章节内重复只保留一条
    expect(parsed.chapters[1].words).toHaveLength(1);
  });

  it("parses xlsx with chinese headers", () => {
    const buffer = makeXlsxBuffer([
      {
        name: "Sheet1",
        rows: [
          ["单词", "释义", "章节"],
          ["apple", "苹果", "第1课"],
          ["banana", "香蕉", "第2课"]
        ]
      }
    ]);
    const parsed = parseXlsxFileContent(buffer);

    expect(parsed.chapters.map((chapter) => chapter.title)).toEqual(["第1课", "第2课"]);
    expect(parsed.chapters[0].words[0].translation).toBe("苹果");
  });

  it("splits xlsx sheets into chapters when no chapter column", () => {
    const buffer = makeXlsxBuffer([
      { name: "Unit 1", rows: [["apple", "苹果"], ["banana", "香蕉"]] },
      { name: "Unit 2", rows: [["grape", "葡萄"]] }
    ]);
    const parsed = parseXlsxFileContent(buffer);

    expect(parsed.chapters.map((chapter) => chapter.title)).toEqual(["Unit 1", "Unit 2"]);
    expect(parsed.chapters[0].words.map((word) => word.word)).toEqual(["apple", "banana"]);
    expect(parsed.chapters[1].words[0].translation).toBe("葡萄");
  });

  it("keeps single-sheet xlsx in one anonymous chapter", () => {
    const buffer = makeXlsxBuffer([{ name: "Sheet1", rows: [["apple", "苹果"], ["banana", "香蕉"]] }]);
    const parsed = parseXlsxFileContent(buffer);

    expect(parsed.chapters).toHaveLength(1);
    expect(parsed.chapters[0].title).toBe("");
    expect(parsed.chapters[0].words.map((word) => word.word)).toEqual(["apple", "banana"]);
  });

  it("skips empty xlsx sheets and invalid rows", () => {
    const buffer = makeXlsxBuffer([
      { name: "Empty", rows: [["", ""]] },
      {
        name: "Unit 1",
        rows: [
          ["word", "translation"],
          ["apple", "苹果"],
          ["12345", "不是单词"],
          ["banana", "香蕉"]
        ]
      }
    ]);
    const parsed = parseXlsxFileContent(buffer);

    expect(parsed.chapters).toHaveLength(1);
    expect(parsed.chapters[0].title).toBe("Unit 1");
    expect(parsed.chapters[0].words.map((word) => word.word)).toEqual(["apple", "banana"]);
    expect(parsed.skippedLines).toBe(1);
    expect(parsed.skippedLineDetails[0].reason).toContain("Unit 1");
    expect(parsed.warning).toContain("1 行无法识别");
  });

  it("returns empty result for a fully empty xlsx workbook", () => {
    const buffer = makeXlsxBuffer([{ name: "Sheet1", rows: [["", ""]] }]);
    const parsed = parseXlsxFileContent(buffer);

    expect(parsed.chapters).toHaveLength(0);
    expect(parsed.skippedLines).toBe(0);
  });

  it("caps imported words at 5000", () => {
    const lines = Array.from({ length: 5010 }, (_, index) => `word${index} 词${index}`);
    const parsed = parseBookFileContent(lines.join("\n"), "txt");
    const total = parsed.chapters.reduce((sum, chapter) => sum + chapter.words.length, 0);

    expect(total).toBe(5000);
    expect(parsed.warning).toContain("5000");
  });

  it("derives book title from filename", () => {
    expect(bookTitleFromFile("核心100-Unit1.csv")).toBe("核心100 Unit1");
    expect(bookTitleFromFile("考研词汇_2026.txt")).toBe("考研词汇 2026");
    expect(bookTitleFromFile("a_b_c.docx.txt")).toBe("a b c.docx");
  });

  it("splits a single chapter into fixed-size chunks", () => {
    const chapter = { title: "考研词汇", words: Array.from({ length: 45 }, (_, index) => ({
      word: `word${index}`,
      translation: "",
      phonetic: "",
      partOfSpeech: ""
    })) };

    const chunks = splitChapterIntoChunks(chapter, 20);
    expect(chunks).toHaveLength(3);
    expect(chunks.map((chunk) => chunk.title)).toEqual(["考研词汇 1", "考研词汇 2", "考研词汇 3"]);
    expect(chunks[0].words).toHaveLength(20);
    expect(chunks[2].words).toHaveLength(5);

    // 只对单章文件生效
    expect(buildImportChapters([chapter], 20)).toEqual(chunks);
    expect(buildImportChapters([chapter], null)).toEqual([chapter]);
    expect(buildImportChapters([chapter, { title: "B", words: [] }], 20)).toEqual(chunks);
  });

  it("splits only oversized chapters down to the 25-word granularity", () => {
    const makeWords = (count: number) =>
      Array.from({ length: count }, (_, index) => ({ word: `w${index}`, translation: "", phonetic: "", partOfSpeech: "" }));
    const chapters = [
      { title: "List 1", words: makeWords(30) },
      { title: "List 2", words: makeWords(10) },
      { title: "List 3", words: makeWords(25) }
    ];

    const result = splitOversizedChapters(chapters, 25);
    expect(result.map((chapter) => chapter.title)).toEqual(["List 1 · 1", "List 1 · 2", "List 2", "List 3"]);
    expect(result.map((chapter) => chapter.words.length)).toEqual([25, 5, 10, 25]);

    // 全部 ≤25 时原样返回
    expect(splitOversizedChapters([chapters[1]], 25)).toEqual([chapters[1]]);
  });

  it("defaults oversized chapter splitting to the 200-word granularity", () => {
    const words = Array.from({ length: 450 }, (_, index) => ({ word: `w${index}`, translation: "", phonetic: "", partOfSpeech: "" }));
    const result = splitOversizedChapters([{ title: "List", words }]);

    expect(result.map((chapter) => chapter.title)).toEqual(["List · 1", "List · 2", "List · 3"]);
    expect(result.map((chapter) => chapter.words.length)).toEqual([200, 200, 50]);
  });
});
