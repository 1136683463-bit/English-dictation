import { afterEach, describe, expect, it, vi } from "vitest";
import {
  addSentence,
  addOrUpdateWordWithAudio,
  addOrUpdateWordWithResult,
  addWordsBatchWithAudio,
  getWordDetails,
  hydrateWordInput,
  restoreCards,
  setCardsStatus,
  setPronunciationAudioFetcherForTest,
  updateCardContent,
  updateSentenceAudio,
  updateWordAudio
} from "./cardService";
import { makeCard, makeTestData, makeWordCard } from "./testUtils";

describe("cardService", () => {
  afterEach(() => {
    setPronunciationAudioFetcherForTest(undefined);
  });

  it("hydrates from dictionary entries and creates a word card", () => {
    const data = makeTestData({
      dictionaryEntries: [
        {
          word: "context",
          phonetic: "/ˈkɑːntekst/",
          partOfSpeech: "n.",
          definition: "surrounding text",
          translation: "语境",
          collocations: "in context"
        }
      ]
    });

    const hydrated = hydrateWordInput(data, "Context");
    const result = addOrUpdateWordWithResult(data, hydrated);

    expect(hydrated.translation).toBe("语境");
    expect(result.status).toBe("created");
    expect(result.data.cards[0].front).toBe("context");
    expect(getWordDetails(result.data, result.cardId)?.phonetic).toBe("/ˈkɑːntekst/");
  });

  it("merges duplicate words without losing existing notes and tags", () => {
    const first = addOrUpdateWordWithResult(makeTestData(), {
      word: "review",
      translation: "复习",
      phonetic: "",
      partOfSpeech: "",
      englishDefinition: "",
      collocations: "",
      sourceSentence: "Review daily.",
      unitId: "",
      note: "first",
      tags: "core"
    });
    const second = addOrUpdateWordWithResult(first.data, {
      word: "Review",
      translation: "回顾",
      phonetic: "/rɪˈvjuː/",
      partOfSpeech: "v.",
      englishDefinition: "",
      collocations: "",
      sourceSentence: "Weekly review helps.",
      unitId: "",
      note: "second",
      tags: "weekly"
    });

    expect(second.status).toBe("merged");
    expect(second.data.cards).toHaveLength(1);
    expect(second.data.cards[0].tags).toEqual(["core", "weekly"]);
    expect(getWordDetails(second.data, first.cardId)?.sourceSentence).toContain("Weekly review helps.");
  });

  it("stores source material ids on new words and sentence cards", () => {
    const wordResult = addOrUpdateWordWithResult(makeTestData(), {
      word: "source",
      translation: "来源",
      phonetic: "",
      partOfSpeech: "",
      englishDefinition: "",
      collocations: "",
      sourceSentence: "A source sentence matters.",
      sourceId: "material_1",
      unitId: "",
      note: "",
      tags: "导入"
    });
    const withSentence = addSentence(wordResult.data, {
      sentence: "A source sentence matters.",
      translation: "",
      keywords: "",
      grammarNote: "",
      sourceId: "material_1",
      note: "",
      tags: "导入"
    });

    expect(wordResult.data.cards.find((card) => card.id === wordResult.cardId)?.sourceId).toBe("material_1");
    expect(withSentence.cards.find((card) => card.type === "sentence")?.sourceId).toBe("material_1");
  });

  it("keeps the first explicit source when merging words and fills missing source ids", () => {
    const first = addOrUpdateWordWithResult(makeTestData(), {
      word: "review",
      translation: "复习",
      phonetic: "",
      partOfSpeech: "",
      englishDefinition: "",
      collocations: "",
      sourceSentence: "",
      sourceId: "material_original",
      unitId: "",
      note: "",
      tags: ""
    });
    const mergedWithNewSource = addOrUpdateWordWithResult(first.data, {
      word: "review",
      translation: "回顾",
      phonetic: "",
      partOfSpeech: "",
      englishDefinition: "",
      collocations: "",
      sourceSentence: "",
      sourceId: "material_new",
      unitId: "",
      note: "",
      tags: ""
    });
    const legacyWithoutSource = {
      ...first.data,
      cards: first.data.cards.map((card) => ({ ...card, sourceId: undefined }))
    };
    const filledSource = addOrUpdateWordWithResult(legacyWithoutSource, {
      word: "review",
      translation: "回顾",
      phonetic: "",
      partOfSpeech: "",
      englishDefinition: "",
      collocations: "",
      sourceSentence: "",
      sourceId: "material_new",
      unitId: "",
      note: "",
      tags: ""
    });

    expect(mergedWithNewSource.data.cards[0].sourceId).toBe("material_original");
    expect(filledSource.data.cards[0].sourceId).toBe("material_new");
  });

  it("updates word and sentence audio urls", () => {
    const card = makeWordCard("card_1");
    const sentenceCard = { ...makeWordCard("sentence_1", "I learn.", "我学习。"), type: "sentence" as const };
    const data = makeTestData({
      cards: [card, sentenceCard],
      wordDetails: [
        {
          cardId: "card_1",
          word: "approach",
          phonetic: "",
          partOfSpeech: "",
          chineseDefinition: "方法",
          englishDefinition: "",
          collocations: "",
          synonyms: "",
          antonyms: "",
          confusedWords: "",
          audioUrl: "",
          sourceSentence: ""
        }
      ],
      sentenceDetails: [
        {
          cardId: "sentence_1",
          sentence: "I learn.",
          translation: "我学习。",
          keywords: [],
          grammarNote: "",
          audioUrl: ""
        }
      ]
    });

    expect(updateWordAudio(data, "card_1", "data:audio/mp3;base64,abc").wordDetails[0].audioUrl).toContain("audio");
    expect(updateSentenceAudio(data, "sentence_1", "data:audio/wav;base64,xyz").sentenceDetails[0].audioUrl).toContain("wav");
  });

  it("attaches fetched pronunciation audio when saving a word", async () => {
    const fetchPronunciationAudio = vi.fn().mockResolvedValue("https://cdn.example.com/context-us.mp3");
    setPronunciationAudioFetcherForTest(fetchPronunciationAudio);

    const result = await addOrUpdateWordWithAudio(
      makeTestData(),
      {
        word: "Context",
        translation: "语境",
        phonetic: "",
        partOfSpeech: "",
        englishDefinition: "",
        collocations: "",
        sourceSentence: "",
        unitId: "",
        note: "",
        tags: ""
      },
      "en-US"
    );

    expect(result.audioAttached).toBe(true);
    expect(fetchPronunciationAudio).toHaveBeenCalledWith("context", "en-US");
    expect(getWordDetails(result.data, result.cardId)?.audioUrl).toBe("https://cdn.example.com/context-us.mp3");
  });

  it("does not overwrite existing word audio when saving a duplicate", async () => {
    const fetchPronunciationAudio = vi.fn().mockResolvedValue("https://cdn.example.com/new.mp3");
    setPronunciationAudioFetcherForTest(fetchPronunciationAudio);
    const first = addOrUpdateWordWithResult(makeTestData(), {
      word: "review",
      translation: "复习",
      phonetic: "",
      partOfSpeech: "",
      englishDefinition: "",
      collocations: "",
      sourceSentence: "",
      unitId: "",
      note: "",
      tags: ""
    });
    const withAudio = updateWordAudio(first.data, first.cardId, "data:audio/mp3;base64,manual");

    const result = await addOrUpdateWordWithAudio(withAudio, {
      word: "review",
      translation: "回顾",
      phonetic: "",
      partOfSpeech: "",
      englishDefinition: "",
      collocations: "",
      sourceSentence: "",
      unitId: "",
      note: "",
      tags: ""
    });

    expect(result.audioAttached).toBe(false);
    expect(fetchPronunciationAudio).not.toHaveBeenCalled();
    expect(getWordDetails(result.data, result.cardId)?.audioUrl).toBe("data:audio/mp3;base64,manual");
  });

  it("limits pronunciation lookups during batch imports", async () => {
    const fetchPronunciationAudio = vi.fn((word: string) => Promise.resolve(`https://cdn.example.com/${word}.mp3`));
    setPronunciationAudioFetcherForTest(fetchPronunciationAudio);

    const result = await addWordsBatchWithAudio(
      makeTestData(),
      ["alpha", "bravo", "charlie"].map((word) => ({
        word,
        translation: word,
        phonetic: "",
        partOfSpeech: "",
        englishDefinition: "",
        collocations: "",
        sourceSentence: "",
        unitId: "",
        note: "",
        tags: ""
      })),
      "en-GB",
      { maxAudioLookups: 2 }
    );

    expect(result.audioLookups).toBe(2);
    expect(result.audioAttached).toBe(2);
    expect(fetchPronunciationAudio).toHaveBeenCalledTimes(2);
    expect(result.data.wordDetails.find((details) => details.word === "alpha")?.audioUrl).toBe(
      "https://cdn.example.com/alpha.mp3"
    );
    expect(result.data.wordDetails.find((details) => details.word === "charlie")?.audioUrl).toBe("");
  });
});

describe("suspend / restore lifecycle", () => {
  it("records suspendedFrom when suspending and clears it for other status changes", () => {
    const data = makeTestData({
      cards: [makeCard({ id: "c1", status: "review" }), makeCard({ id: "c2", status: "new" })]
    });

    const suspended = setCardsStatus(data, ["c1", "c2"], "suspended");
    expect(suspended.cards.find((card) => card.id === "c1")).toMatchObject({
      status: "suspended",
      suspendedFrom: "review"
    });
    expect(suspended.cards.find((card) => card.id === "c2")).toMatchObject({
      status: "suspended",
      suspendedFrom: "new"
    });

    const reprioritized = setCardsStatus(suspended, ["c1"], "review");
    const restored = reprioritized.cards.find((card) => card.id === "c1");
    expect(restored?.status).toBe("review");
    expect(restored && "suspendedFrom" in restored).toBe(false);
  });

  it("restoreCards returns cards to their pre-suspend status and clears the marker", () => {
    const data = makeTestData({
      cards: [
        makeCard({ id: "c1", status: "suspended", suspendedFrom: "learning" }),
        makeCard({ id: "c2", status: "suspended" }),
        makeCard({ id: "c3", status: "review" })
      ]
    });

    const restored = restoreCards(data, ["c1", "c2", "c3"]);
    const c1 = restored.cards.find((card) => card.id === "c1");
    const c2 = restored.cards.find((card) => card.id === "c2");
    const c3 = restored.cards.find((card) => card.id === "c3");

    expect(c1?.status).toBe("learning");
    expect(c1 && "suspendedFrom" in c1).toBe(false);
    // 无 suspendedFrom 的历史数据回退到 review
    expect(c2?.status).toBe("review");
    expect(c2 && "suspendedFrom" in c2).toBe(false);
    // 非 suspended 卡片不受 restore 影响
    expect(c3?.status).toBe("review");
    expect(c3?.updatedAt).toBe(data.cards.find((card) => card.id === "c3")?.updatedAt);
  });
});

describe("updateCardContent（R13 短语内联编辑）", () => {
  it("updates back/note/tags and refreshes updatedAt without touching other cards", () => {
    const data = makeTestData({
      cards: [
        makeCard({ id: "p1", type: "phrase", front: "take off", back: "起飞", note: "", tags: ["travel"] }),
        makeCard({ id: "w1", front: "approach", back: "方法" })
      ]
    });

    const updated = updateCardContent(data, "p1", { back: "起飞；脱下", note: "机场景语", tags: ["travel", "airport"] });
    const phrase = updated.cards.find((card) => card.id === "p1");
    const untouched = updated.cards.find((card) => card.id === "w1");

    expect(phrase).toMatchObject({ back: "起飞；脱下", note: "机场景语", tags: ["travel", "airport"] });
    expect(phrase?.updatedAt).not.toBe(data.cards[0].updatedAt);
    expect(untouched).toEqual(data.cards[1]);
  });

  it("keeps fields not included in the patch", () => {
    const data = makeTestData({
      cards: [makeCard({ id: "p1", type: "phrase", front: "take off", back: "起飞", note: "旧备注", tags: ["a"] })]
    });

    const updated = updateCardContent(data, "p1", { back: "新释义" });
    expect(updated.cards[0]).toMatchObject({ back: "新释义", note: "旧备注", tags: ["a"] });
  });
});
