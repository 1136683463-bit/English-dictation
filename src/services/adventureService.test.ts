import { describe, expect, it } from "vitest";
import { appendAdventureNode, createAdventure, deleteAdventure, getAdventure, getAdventureFavoriteWords, getAdventurePath, isAdventureFavoriteWord, saveAdventureVocabulary, toggleAdventureFavoriteWord } from "./adventureService";
import { splitAdventureSentences } from "./adventureReaderService";
import { makeTestData } from "./testUtils";

describe("adventure service", () => {
  it("deletes only the requested saved route", () => {
    const first = createAdventure(makeTestData(), { template: "city", level: "A2" });
    const second = createAdventure(first.data, { template: "travel", level: "A2" });
    const deleted = deleteAdventure(second.data, first.adventure.id);

    expect(deleted.adventures.map((item) => item.id)).toEqual([second.adventure.id]);
    expect(second.data.adventures).toHaveLength(2);
  });

  it("creates an offline root chapter and keeps a recoverable branch history", () => {
    const initial = makeTestData();
    const created = createAdventure(initial, { template: "city", level: "A2", customPrompt: "find a letter" });
    const root = created.adventure.nodes[0];
    const firstBranch = appendAdventureNode(created.data, created.adventure.id, root.id, { choiceId: root.choices[0].id });
    const secondBranch = appendAdventureNode(firstBranch.data, created.adventure.id, root.id, { choiceId: root.choices[1].id });
    const adventure = getAdventure(secondBranch.data, created.adventure.id);

    expect(adventure?.nodes).toHaveLength(3);
    expect(adventure?.currentNodeId).toBe(secondBranch.node.id);
    expect(adventure?.nodes.find((node) => node.id === firstBranch.node.id)?.parentId).toBe(root.id);
    expect(getAdventurePath(adventure!, firstBranch.node.id).map((node) => node.id)).toEqual([root.id, firstBranch.node.id]);
    expect(getAdventurePath(adventure!).map((node) => node.id)).toEqual([root.id, secondBranch.node.id]);
  });

  it("stores an AI-generated custom opening as the first chapter", () => {
    const initialNode = {
      title: "The Moving City",
      englishText: "The city changes streets every midnight, and you wake beside a locked blue door. A stranger named Mina says a missing letter is hidden somewhere in the moving market. She asks whether you will follow the lights before the next turn.",
      chineseText: "这座城市每到午夜都会改变街道。你在一扇上锁的蓝门旁醒来，名叫米娜的陌生人说，一封丢失的信藏在移动市场里。",
      sentenceTranslations: ["这座城市每到午夜都会改变街道，你在一扇上锁的蓝色门旁醒来。", "一个名叫米娜的陌生人说，一封丢失的信藏在移动市场的某处。", "她问你是否愿意在下一次转弯前跟随灯光。"],
      summary: "Mina asks you to find a letter in a moving market.",
      choices: [
        { id: "lights", label: "Follow the lights", description: "Enter the market.", promptHint: "Follow the lights into the market." },
        { id: "door", label: "Study the blue door", description: "Look for a clue.", promptHint: "Study the locked blue door." }
      ],
      vocabulary: [{ word: "midnight", translation: "午夜", partOfSpeech: "noun", sentence: "The city changes streets every midnight." }]
    };
    const created = createAdventure(makeTestData(), {
      template: "custom",
      level: "A2",
      customPrompt: "在会移动的城市里找回一封信",
      source: "ai",
      initialNode,
      title: initialNode.title
    });

    expect(created.adventure.title).toBe("The Moving City");
    expect(created.adventure.nodes[0].source).toBe("ai");
    expect(created.adventure.nodes[0].title).toBe("The Moving City");
  });

  it("keeps the custom fallback story separate from preset routes", () => {
    const created = createAdventure(makeTestData(), {
      template: "custom",
      level: "A2",
      customPrompt: "让一台旧机器人寻找它的第一段记忆"
    });
    const root = created.adventure.nodes[0];
    const next = appendAdventureNode(created.data, created.adventure.id, root.id, { choiceId: root.choices[0].id });

    expect(root.title).toBe("A New Beginning");
    expect(next.node.title).toBe("A Quiet Turning Point · 2");
    expect(next.node.englishText).not.toContain("school");
    expect(next.node.englishText).not.toContain("train");
  });

  it("keeps offline chapters aligned with their saved sentence translations", () => {
    for (const template of ["campus", "city", "travel", "fantasy"] as const) {
      const created = createAdventure(makeTestData(), { template, level: "A2" });
      let data = created.data;
      let node = created.adventure.nodes[0];

      for (let chapter = 0; chapter < 3; chapter += 1) {
        expect(node.sentenceTranslations).toHaveLength(splitAdventureSentences(node.englishText).length);

        if (chapter < 2) {
          const next = appendAdventureNode(data, created.adventure.id, node.id, { choiceId: node.choices[0].id });
          data = next.data;
          node = next.node;
        }
      }
    }
  });

  it("does not repeat the last preset chapter after the offline story ends", () => {
    const created = createAdventure(makeTestData(), { template: "city", level: "A2" });
    let data = created.data;
    let node = created.adventure.nodes[0];

    for (let chapter = 1; chapter < 4; chapter += 1) {
      const next = appendAdventureNode(data, created.adventure.id, node.id, { choiceId: node.choices[0].id });
      data = next.data;
      node = next.node;
    }

    expect(node.chapter).toBe(4);
    expect(node.title).not.toBe("Evening Lights");
    expect(node.sentenceTranslations).toHaveLength(splitAdventureSentences(node.englishText).length);
  });

  it("keeps extended offline chapters materially different", () => {
    const created = createAdventure(makeTestData(), { template: "travel", level: "A2" });
    let data = created.data;
    let node = created.adventure.nodes[0];
    const texts = new Set<string>();

    for (let chapter = 0; chapter < 8; chapter += 1) {
      texts.add(node.englishText);
      const next = appendAdventureNode(data, created.adventure.id, node.id, { choiceId: node.choices[0].id });
      data = next.data;
      node = next.node;
    }

    expect(texts.size).toBe(8);
  });

  it("saves only confirmed chapter vocabulary and merges an existing card", () => {
    const created = createAdventure(makeTestData(), { template: "travel", level: "A2" });
    const adventure = created.adventure;
    const root = adventure.nodes[0];
    const selected = root.vocabulary.slice(0, 1);

    const firstSave = saveAdventureVocabulary(created.data, adventure.id, root.id, selected);
    const savedVocabulary = getAdventure(firstSave.data, adventure.id)?.nodes[0].vocabulary.slice(0, 1) ?? [];
    const secondSave = saveAdventureVocabulary(firstSave.data, adventure.id, root.id, savedVocabulary);

    expect(firstSave.created).toBe(1);
    expect(firstSave.data.cards).toHaveLength(1);
    expect(firstSave.data.cards[0].tags).toContain("冒险");
    expect(secondSave.created).toBe(0);
    expect(secondSave.merged).toBe(0);
    expect(secondSave.data.cards).toHaveLength(1);
    expect(getAdventure(secondSave.data, adventure.id)?.nodes[0].vocabulary[0].cardId).toBe(firstSave.data.cards[0].id);
  });

  it("creates an adventure accumulation shelf and toggles a favorite word idempotently", () => {
    const created = createAdventure(makeTestData(), { template: "city", level: "A2" });
    const word = created.adventure.nodes[0].vocabulary[0];
    const first = toggleAdventureFavoriteWord(created.data, {
      word: word.word,
      translation: word.translation,
      partOfSpeech: word.partOfSpeech,
      sourceSentence: word.sentence,
      adventureId: created.adventure.id,
      nodeId: created.adventure.nodes[0].id
    });

    expect(first.favorite).toBe(true);
    expect(first.data.unitGroups.filter((group) => group.title === "冒险积累")).toHaveLength(1);
    expect(first.data.units.filter((unit) => unit.title === "冒险积累")).toHaveLength(1);
    expect(getAdventureFavoriteWords(first.data)).toEqual([word.word]);
    expect(isAdventureFavoriteWord(first.data, word.word)).toBe(true);

    const second = toggleAdventureFavoriteWord(first.data, { word: word.word });
    expect(second.favorite).toBe(false);
    expect(getAdventureFavoriteWords(second.data)).toHaveLength(0);
    expect(second.data.cards).toHaveLength(1);
  });
});
