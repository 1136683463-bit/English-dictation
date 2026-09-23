// @vitest-environment node
/**
 * SV7 · 三个死字段的摘除必须**三处同步**（2026-09-22）
 *
 * `WordDetails` 的 `synonyms` / `antonyms` / `confusedWords` 审计结论是**零读取**：
 * 没有 UI 输入框、导入不支持、没有页面展示；唯一的引用是无条件写空串。
 * 它们永久为空，占的纯粹是键名开销——单条 47 字节，一年模型（3,650 条）约 168KB。
 *
 * 摘除它们有**三个**写入点，少改一处就失效（迁移会把字段又补回来）：
 *   ① `cardService.addWord`（新建词卡）
 *   ② `normalizeWordDetails`（迁移归一化）
 *   ③ `fillMissingDetails`（给缺详情的词卡补默认详情）
 *
 * 这个教训来自 `diffJson`：那次只改了写入侧，归一化的 fallback 让修复被完全抵消。
 * 本文件逐点验证，任一回归都会红。
 */
import { describe, expect, it } from "vitest";
import { migrateData } from "../../services/storage";
import { addOrUpdateWord } from "../../services/cardService";
import { makeAppData } from "./fixtures";
import type { WordDetails } from "../../types";

const DEAD_KEYS = ["synonyms", "antonyms", "confusedWords"] as const;

const wordCardBackup = (details: Record<string, unknown>) => ({
  schemaVersion: 8,
  cards: [
    {
      id: "w1",
      type: "word",
      front: "approach",
      back: "方法",
      note: "",
      tags: [],
      status: "new",
      priority: false,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z"
    }
  ],
  wordDetails: [details],
  schedules: [],
  reviews: []
});

describe("SV7 死字段三处同步摘除", () => {
  it("① addWord 新建的词卡详情不含这三个字段", () => {
    const next = addOrUpdateWord(makeAppData(), {
      word: "approach",
      translation: "方法",
      phonetic: "/x/",
      partOfSpeech: "n.",
      englishDefinition: "",
      collocations: "",
      sourceSentence: "",
      unitId: "",
      note: "",
      tags: ""
    });
    const details = next.wordDetails[0];
    for (const key of DEAD_KEYS) {
      expect(key in details, `新建详情的 ${key} 不应被写入`).toBe(false);
    }
  });

  it("② 迁移不会给条目补这三个字段", () => {
    const migrated = migrateData(
      wordCardBackup({
        cardId: "w1",
        word: "approach",
        phonetic: "/x/",
        partOfSpeech: "n.",
        chineseDefinition: "方法",
        englishDefinition: "",
        collocations: "",
        audioUrl: "",
        sourceSentence: ""
      })
    );
    const details = migrated.wordDetails[0] as unknown as Record<string, unknown>;
    for (const key of DEAD_KEYS) {
      expect(details[key], `迁移不应补 ${key}`).toBeUndefined();
    }
  });

  it("③ fillMissingDetails 给缺详情的词卡补默认详情时也不含这三个字段", () => {
    // 有词卡但没有对应 wordDetails → 触发补齐
    const migrated = migrateData({
      schemaVersion: 8,
      cards: [
        {
          id: "w-orphan",
          type: "word",
          front: "settle",
          back: "安定",
          note: "",
          tags: [],
          status: "new",
          priority: false,
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z"
        }
      ],
      wordDetails: [],
      schedules: [],
      reviews: []
    });
    const details = migrated.wordDetails.find((item) => item.cardId === "w-orphan");
    expect(details, "应补出详情").toBeTruthy();
    for (const key of DEAD_KEYS) {
      expect(
        (details as unknown as Record<string, unknown>)[key],
        `补齐的详情不应含 ${key}`
      ).toBeUndefined();
    }
  });

  it("★ 幂等：往返两次不改变体积（三处都改了才会成立）", () => {
    const once = migrateData(
      wordCardBackup({
        cardId: "w1",
        word: "approach",
        phonetic: "/x/",
        partOfSpeech: "n.",
        chineseDefinition: "方法",
        englishDefinition: "",
        collocations: "",
        audioUrl: "",
        sourceSentence: ""
      })
    );
    const twice = migrateData(JSON.stringify(once));
    expect(
      JSON.stringify(twice.wordDetails),
      "第二次迁移不应改变详情——若变了，说明还有一处写入点在补字段"
    ).toBe(JSON.stringify(once.wordDetails));
  });

  it("有真实值的旧数据不被丢弃（手工导入的备份要保得住）", () => {
    const migrated = migrateData(
      wordCardBackup({
        cardId: "w1",
        word: "approach",
        phonetic: "/x/",
        partOfSpeech: "n.",
        chineseDefinition: "方法",
        englishDefinition: "",
        collocations: "",
        synonyms: "method",
        antonyms: "avoid",
        confusedWords: "reach",
        audioUrl: "",
        sourceSentence: ""
      })
    );
    const details = migrated.wordDetails[0] as unknown as WordDetails;
    expect(details.synonyms, "真实值必须保留").toBe("method");
    expect(details.antonyms, "真实值必须保留").toBe("avoid");
    expect(details.confusedWords, "真实值必须保留").toBe("reach");
  });

  it("空串视为无值（不保留空字段，也不因空串报错）", () => {
    const migrated = migrateData(
      wordCardBackup({
        cardId: "w1",
        word: "approach",
        phonetic: "/x/",
        partOfSpeech: "n.",
        chineseDefinition: "方法",
        englishDefinition: "",
        collocations: "",
        synonyms: "   ",
        antonyms: "",
        confusedWords: "",
        audioUrl: "",
        sourceSentence: ""
      })
    );
    const details = migrated.wordDetails[0] as unknown as Record<string, unknown>;
    for (const key of DEAD_KEYS) {
      expect(details[key], `空白值不应被保留（${key}）`).toBeUndefined();
    }
  });
});
