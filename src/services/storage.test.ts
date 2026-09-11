import { describe, expect, it } from "vitest";
import { APP_SCHEMA_VERSION, markDataExported, migrateData, needsBackupReminder } from "./storage";
import { makeMistakeGeneration, makeTestData, makeWordCard } from "./testUtils";

describe("storage migration helpers", () => {
  it("migrates old data and fills schema defaults", () => {
    const migrated = migrateData({
      cards: [{ id: "card_1", front: "context", back: "语境" }],
      wordDetails: [{ cardId: "card_1", word: "context" }],
      settings: { dailyNewWords: 3 }
    });

    expect(migrated.schemaVersion).toBe(APP_SCHEMA_VERSION);
    expect(migrated.settings.lastExportedAt).toBe("");
    expect(migrated.mistakeGenerations).toEqual([]);
    expect(migrated.adventures).toEqual([]);
    expect(migrated.schedules.find((schedule) => schedule.cardId === "card_1")).toBeTruthy();
    expect(migrated.unitGroups.some((group) => group.title === "冒险积累")).toBe(true);
    expect(migrated.units.some((unit) => unit.title === "冒险积累")).toBe(true);
  });

  it("normalizes adventure nodes and restores a valid current chapter", () => {
    const migrated = migrateData({
      adventures: [
        {
          id: "adventure_1",
          title: "A route",
          template: "city",
          level: "B1",
          currentNodeId: "missing_node",
          nodes: [
            {
              id: "node_1",
              chapter: 1,
              title: "Start",
              englishText: "A valid opening chapter.",
              parentId: "orphan",
              selectedChoiceId: "not-a-choice",
              choices: [{ id: "walk", label: "Walk" }]
            }
          ]
        }
      ]
    });

    expect(migrated.adventures).toHaveLength(1);
    expect(migrated.adventures[0].currentNodeId).toBe("node_1");
    expect(migrated.adventures[0].nodes[0].parentId).toBeUndefined();
    expect(migrated.adventures[0].nodes[0].selectedChoiceId).toBeUndefined();
  });

  it("preserves valid mistake generations and drops empty generated content", () => {
    const data = makeTestData({
      cards: [makeWordCard("card_1")],
      mistakeGenerations: [
        makeMistakeGeneration({ cardIds: ["card_1", "missing"] }),
        makeMistakeGeneration({
          id: "empty_generation",
          content: "",
          story: {
            title: "Should drop",
            englishStory: "This structured story should not keep an empty content generation.",
            chineseTranslation: "",
            usedWords: ["approach"],
            missingWords: [],
            wordNotes: []
          }
        })
      ]
    });

    const migrated = migrateData(data);

    expect(migrated.mistakeGenerations).toHaveLength(1);
    expect(migrated.mistakeGenerations[0].cardIds).toEqual(["card_1"]);
    expect(migrated.mistakeGenerations[0].content).toContain("approach");
  });

  it("migrates structured mistake generation metadata", () => {
    const migrated = migrateData({
      seededWordVersions: ["core-100-v1"],
      cards: [
        { id: "card_1", front: "benefit", back: "好处" },
        { id: "card_2", front: "approach", back: "方法" }
      ],
      mistakeGenerations: [
        {
          id: "generation_structured",
          dateKey: "2026-07-03",
          type: "story",
          cardIds: ["card_1", "missing", "card_2"],
          title: "今日错词故事",
          content: "A story with **benefit**.",
          prompt: "Use benefit.",
          createdAt: "2026-07-03T00:00:00.000Z",
          settings: {
            level: "B2",
            scene: " cafe ",
            length: "long",
            tone: "warm",
            bilingual: false
          },
          wordSnapshots: [
            {
              cardId: "card_1",
              word: " benefit ",
              translation: " 好处 ",
              wrongAnswers: ["benifit", ""],
              status: "stubborn"
            },
            {
              cardId: "card_2",
              word: "approach",
              translation: "方法",
              wrongAnswers: ["approch"],
              status: "not-real"
            },
            {
              cardId: "missing",
              word: "ghost",
              translation: "",
              wrongAnswers: ["ghost"]
            }
          ],
          coverage: {
            usedCardIds: ["card_1", "missing"],
            missingCardIds: ["card_2", "ghost"]
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
        }
      ]
    });

    expect(migrated.mistakeGenerations).toHaveLength(1);
    expect(migrated.mistakeGenerations[0]).toMatchObject({
      id: "generation_structured",
      cardIds: ["card_1", "card_2"],
      settings: {
        level: "B2",
        scene: "cafe",
        length: "long",
        tone: "warm",
        bilingual: false
      },
      wordSnapshots: [
        {
          cardId: "card_1",
          word: "benefit",
          translation: "好处",
          wrongAnswers: ["benifit"],
          status: "stubborn"
        },
        {
          cardId: "card_2",
          word: "approach",
          translation: "方法",
          wrongAnswers: ["approch"]
        }
      ],
      coverage: {
        usedCardIds: ["card_1"],
        missingCardIds: ["card_2"]
      },
      story: {
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
      }
    });
  });

  it("tracks backup reminders", () => {
    const data = makeTestData({
      cards: [makeWordCard("card_1")],
      settings: { lastExportedAt: "2026-01-01T00:00:00.000Z" }
    });

    expect(needsBackupReminder(data, 1)).toBe(true);
    expect(needsBackupReminder(markDataExported(data), 7)).toBe(false);
  });

  it("preserves card source ids and drops material segments with missing materials", () => {
    const migrated = migrateData({
      seededWordVersions: ["core-100-v1"],
      cards: [
        {
          id: "card_1",
          type: "word",
          front: "context",
          back: "语境",
          sourceId: "material_1"
        }
      ],
      materials: [
        {
          id: "material_1",
          title: "Article",
          content: "Context matters."
        }
      ],
      materialSegments: [
        {
          id: "segment_1",
          materialId: "material_1",
          index: 0,
          text: "Context matters."
        },
        {
          id: "segment_missing",
          materialId: "missing_material",
          index: 1,
          text: "This segment has no parent material."
        }
      ]
    });

    expect(migrated.cards.find((card) => card.id === "card_1")?.sourceId).toBe("material_1");
    expect(migrated.materialSegments.map((segment) => segment.id)).toEqual(["segment_1"]);
  });
});
