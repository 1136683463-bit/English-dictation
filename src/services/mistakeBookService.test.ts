import { describe, expect, it } from "vitest";
import {
  getLocalDateKey,
  getMistakeGenerationsByDate,
  getMistakeGroupsByDate,
  getMistakesByDate,
  getTodayMistakes,
  saveMistakeGeneration
} from "./mistakeBookService";
import { makeReview, makeTestData, makeWordCard } from "./testUtils";

describe("mistakeBookService", () => {
  it("groups wrong reviews by local date and merges repeated card mistakes", () => {
    const card = makeWordCard("card_1", "approach", "方法");
    const otherCard = makeWordCard("card_2", "context", "语境");
    const data = makeTestData({
      cards: [card, otherCard],
      wordDetails: [
        {
          cardId: card.id,
          word: "approach",
          phonetic: "/əˈproʊtʃ/",
          partOfSpeech: "n.",
          chineseDefinition: "方法",
          englishDefinition: "a way of doing something",
          collocations: "new approach",
          synonyms: "method",
          antonyms: "",
          confusedWords: "",
          audioUrl: "",
          sourceSentence: ""
        }
      ],
      reviews: [
        makeReview({ id: "review_1", cardId: card.id, rating: 1, answer: "aproach", reviewedAt: "2026-07-03T02:00:00.000Z" }),
        makeReview({ id: "review_2", cardId: card.id, rating: 2, answer: "approch", reviewedAt: "2026-07-03T04:00:00.000Z" }),
        makeReview({ id: "review_3", cardId: otherCard.id, rating: 4, answer: "context", reviewedAt: "2026-07-03T05:00:00.000Z" })
      ]
    });

    const groups = getMistakeGroupsByDate(data);

    expect(groups).toHaveLength(1);
    expect(groups[0].mistakeCount).toBe(1);
    expect(groups[0].attemptCount).toBe(2);
    expect(groups[0].entries[0].card.front).toBe("approach");
    expect(groups[0].entries[0].answers).toEqual(["aproach", "approch"]);
    expect(groups[0].entries[0].details?.phonetic).toBe("/əˈproʊtʃ/");
  });

  it("returns date-specific mistakes and today's mistakes", () => {
    const card = makeWordCard("card_1", "benefit", "好处");
    const data = makeTestData({
      cards: [card],
      reviews: [makeReview({ cardId: card.id, rating: 1, answer: "benifit", reviewedAt: "2026-07-03T10:00:00.000Z" })]
    });

    expect(getMistakesByDate(data, "2026-07-03").map((entry) => entry.card.front)).toEqual(["benefit"]);
    expect(getTodayMistakes(data, new Date("2026-07-03T20:00:00+08:00"))).toHaveLength(1);
    expect(getMistakesByDate(data, "2026-07-02")).toEqual([]);
  });

  it("uses local date keys instead of UTC date slices", () => {
    expect(getLocalDateKey(new Date("2026-07-02T16:30:00.000Z"))).toBe("2026-07-03");
  });

  it("saves structured story metadata and filters unknown ids", () => {
    const card = makeWordCard("card_1", "benefit", "好处");
    const missingInStory = makeWordCard("card_2", "approach", "方法");
    const data = makeTestData({ cards: [card, missingInStory] });
    const saved = saveMistakeGeneration(data, {
      dateKey: "2026-07-03",
      type: "story",
      cardIds: [card.id, "missing", card.id],
      title: "今日错词故事",
      content: "A story with **benefit**.",
      prompt: "Use benefit.",
      settings: {
        level: "B1",
        scene: " school ",
        length: "short",
        tone: "daily",
        bilingual: true
      },
      wordSnapshots: [
        {
          cardId: card.id,
          word: " benefit ",
          translation: " 好处 ",
          wrongAnswers: ["benifit", "benifit", ""],
          status: "improving"
        },
        {
          cardId: "missing",
          word: "ghost",
          translation: "",
          wrongAnswers: ["ghost"]
        }
      ],
      coverage: {
        usedCardIds: [card.id, "missing"],
        missingCardIds: [missingInStory.id, "ghost"]
      },
      story: {
        title: "Practice Story",
        englishStory: "The benefit was clear.",
        chineseTranslation: "好处很明显。",
        usedWords: ["benefit", "benefit", ""],
        missingWords: ["approach"],
        wordNotes: [
          {
            word: "benefit",
            sentence: "The benefit was clear.",
            meaning: "好处"
          },
          {
            word: "",
            sentence: "",
            meaning: ""
          }
        ]
      }
    });

    expect(saved.mistakeGenerations).toHaveLength(1);
    expect(saved.mistakeGenerations[0].cardIds).toEqual([card.id]);
    expect(saved.mistakeGenerations[0].settings).toEqual({
      level: "B1",
      scene: "school",
      length: "short",
      tone: "daily",
      bilingual: true
    });
    expect(saved.mistakeGenerations[0].wordSnapshots).toEqual([
      {
        cardId: card.id,
        word: "benefit",
        translation: "好处",
        wrongAnswers: ["benifit"],
        status: "improving"
      }
    ]);
    expect(saved.mistakeGenerations[0].coverage).toEqual({
      usedCardIds: [card.id],
      missingCardIds: [missingInStory.id]
    });
    expect(saved.mistakeGenerations[0].story).toEqual({
      title: "Practice Story",
      englishStory: "The benefit was clear.",
      chineseTranslation: "好处很明显。",
      usedWords: ["benefit"],
      missingWords: ["approach"],
      wordNotes: [
        {
          word: "benefit",
          sentence: "The benefit was clear.",
          meaning: "好处"
        }
      ]
    });
    expect(getMistakeGenerationsByDate(saved, "2026-07-03")[0].title).toBe("今日错词故事");
  });

  it("does not save empty generated content", () => {
    const card = makeWordCard("card_1", "benefit", "好处");
    const data = makeTestData({ cards: [card] });
    const saved = saveMistakeGeneration(data, {
      dateKey: "2026-07-03",
      type: "story",
      cardIds: [card.id],
      title: "空故事",
      content: "   ",
      prompt: "Use benefit.",
      story: {
        title: "Empty Story",
        englishStory: "Should not be saved.",
        chineseTranslation: "",
        usedWords: ["benefit"],
        missingWords: [],
        wordNotes: []
      }
    });

    expect(saved).toBe(data);
    expect(saved.mistakeGenerations).toEqual([]);
  });
});
