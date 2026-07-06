import { afterEach, describe, expect, it, vi } from "vitest";
import {
  addSentence,
  addOrUpdateWordWithAudio,
  addOrUpdateWordWithResult,
  addWordsBatchWithAudio,
  getWordDetails,
  hydrateWordInput,
  setPronunciationAudioFetcherForTest,
  updateSentenceAudio,
  updateWordAudio
} from "./cardService";
import { makeTestData, makeWordCard } from "./testUtils";

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
