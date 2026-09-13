import { describe, expect, it } from "vitest";
import {
  bookTitleFromFile,
  buildImportChapters,
  detectBookFileFormat,
  parseBookFileContent,
  splitChapterIntoChunks
} from "./bookImportService";

describe("bookImportService", () => {
  it("detects format by extension", () => {
    expect(detectBookFileFormat("核心100.csv")).toBe("csv");
    expect(detectBookFileFormat("核心100.TSV")).toBe("csv");
    expect(detectBookFileFormat("核心100.txt")).toBe("txt");
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
});
