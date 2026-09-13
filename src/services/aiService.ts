import type { Settings } from "../types";
import { isAiProviderConfigured } from "./aiHttpClient";
import { generateStructuredMistakeStoryWithModel, generateWordExplanationWithModel } from "./modelService";
import type { WordExplanationInput, WordExplanationResult } from "./modelService";

export type StoryLevel = "A2" | "B1" | "B2";
export type StoryScene = "daily" | "school" | "work" | "travel" | "adventure" | "exam";
export type StoryLength = "short" | "medium" | "long";
export type StoryTone = "natural" | "warm" | "humorous" | "suspense" | "motivational";

export interface MistakeGenerationWord {
  word: string;
  translation: string;
  partOfSpeech?: string;
  phonetic?: string;
  wrongAnswers: string[];
}

export interface GenerateMistakeExamplesInput {
  dateKey: string;
  words: MistakeGenerationWord[];
  level?: StoryLevel;
}

export interface GenerateMistakeStoryInput extends GenerateMistakeExamplesInput {
  tone?: "daily" | "school" | "work" | "adventure";
}

export interface GenerateStructuredMistakeStoryInput {
  dateKey: string;
  words: MistakeGenerationWord[];
  level: StoryLevel;
  scene: StoryScene;
  length: StoryLength;
  tone: StoryTone;
  bilingual: boolean;
}

export interface StructuredMistakeStoryWordNote {
  word: string;
  translation: string;
  note: string;
}

export interface StructuredMistakeStoryResult {
  title: string;
  englishStory: string;
  chineseTranslation: string;
  usedWords: string[];
  missingWords: string[];
  wordNotes: StructuredMistakeStoryWordNote[];
}

const normalizeWords = (words: MistakeGenerationWord[]) =>
  words
    .map((word) => ({
      ...word,
      word: word.word.trim(),
      translation: word.translation.trim() || "待复习",
      wrongAnswers: word.wrongAnswers.map((answer) => answer.trim()).filter(Boolean)
    }))
    .filter((word) => word.word);

const buildPromptSummary = (words: MistakeGenerationWord[]) =>
  words.map((word) => `${word.word}(${word.translation || "无释义"})`).join(", ");

const uniqueWords = (words: MistakeGenerationWord[]) => {
  const seen = new Set<string>();
  return words.filter((word) => {
    const key = word.word.toLocaleLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const joinEnglishList = (items: string[]) => {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
};

const joinChineseList = (items: string[]) => {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join("、")}和${items[items.length - 1]}`;
};

const splitIntoGroups = <T>(items: T[], groupCount: number) => {
  if (items.length === 0) return [];
  const normalizedGroupCount = Math.max(1, Math.min(groupCount, items.length));
  const groupSize = Math.ceil(items.length / normalizedGroupCount);
  const groups: T[][] = [];

  for (let index = 0; index < items.length; index += groupSize) {
    groups.push(items.slice(index, index + groupSize));
  }

  return groups;
};

const storyLengthSettings: Record<StoryLength, { maxWords: number; groupCount: number }> = {
  short: { maxWords: 8, groupCount: 2 },
  medium: { maxWords: 14, groupCount: 3 },
  long: { maxWords: 24, groupCount: 5 }
};

const storySceneDetails: Record<StoryScene, {
  title: string;
  place: string;
  prop: string;
  action: string;
  chinesePlace: string;
  chineseAction: string;
}> = {
  daily: {
    title: "Daily Review",
    place: "at the kitchen table",
    prop: "notebook",
    action: "turned ordinary chores into small language checks",
    chinesePlace: "厨房桌边",
    chineseAction: "把日常小事变成了语言检查"
  },
  school: {
    title: "School Review",
    place: "beside the classroom window",
    prop: "lesson card",
    action: "matched each word with a moment from class",
    chinesePlace: "教室窗边",
    chineseAction: "把每个词和课堂里的场景连起来"
  },
  work: {
    title: "Work Review",
    place: "before the team meeting",
    prop: "project note",
    action: "used the list to make her report clearer",
    chinesePlace: "团队会议前",
    chineseAction: "用这份词表让汇报更清楚"
  },
  travel: {
    title: "Travel Review",
    place: "near a quiet train platform",
    prop: "travel journal",
    action: "connected each word with a direction, sound, or sign",
    chinesePlace: "安静的火车站台旁",
    chineseAction: "把每个词和方向、声音或标识连起来"
  },
  adventure: {
    title: "Adventure Review",
    place: "on a bright path outside town",
    prop: "folded map",
    action: "treated every word like a clue for the next step",
    chinesePlace: "城外明亮的小路上",
    chineseAction: "把每个词都当作下一步的线索"
  },
  exam: {
    title: "Exam Review",
    place: "in the library before the practice test",
    prop: "review sheet",
    action: "turned nervous mistakes into steady reminders",
    chinesePlace: "模拟考试前的图书馆里",
    chineseAction: "把紧张的错误变成稳定的提醒"
  }
};

const storyToneDetails: Record<StoryTone, {
  title: string;
  mood: string;
  turn: string;
  close: string;
  chineseMood: string;
  chineseTurn: string;
  chineseClose: string;
}> = {
  natural: {
    title: "Clear",
    mood: "with a clear and steady mind",
    turn: "Nothing dramatic happened, but the practice felt useful",
    close: "she finished with a calmer memory of the list",
    chineseMood: "带着清晰稳定的心情",
    chineseTurn: "没有戏剧性的事情发生，但这次练习很有用",
    chineseClose: "她带着更平稳的记忆完成了复习"
  },
  warm: {
    title: "Warm",
    mood: "with a little hope in her chest",
    turn: "A kind message from a friend made the hard words feel lighter",
    close: "she felt that mistakes could become patient teachers",
    chineseMood: "心里带着一点希望",
    chineseTurn: "朋友的一条温暖消息让难词变轻了",
    chineseClose: "她觉得错误也可以成为耐心的老师"
  },
  humorous: {
    title: "Funny",
    mood: "while trying not to laugh at her own messy handwriting",
    turn: "One silly sentence made the whole list easier to remember",
    close: "she smiled because the strangest memory was also the strongest one",
    chineseMood: "一边忍着不笑自己的潦草字迹",
    chineseTurn: "一个有点好笑的句子让整张词表更容易记住",
    chineseClose: "她笑了，因为最奇怪的记忆反而最牢固"
  },
  suspense: {
    title: "Suspense",
    mood: "as the room grew unusually quiet",
    turn: "Each corrected word felt like a clue that moved her closer to the answer",
    close: "she solved the puzzle before the final bell",
    chineseMood: "在房间变得异常安静时",
    chineseTurn: "每个被修正的词都像线索，把她推向答案",
    chineseClose: "她在最后的铃声前解开了谜题"
  },
  motivational: {
    title: "Brave",
    mood: "with a promise to improve one line at a time",
    turn: "Every small correction proved that progress could be built slowly",
    close: "she left the page believing the next review would be easier",
    chineseMood: "承诺自己一次进步一行",
    chineseTurn: "每一次小修正都证明进步可以慢慢建立",
    chineseClose: "她合上页面，相信下一次复习会更轻松"
  }
};

const storyLevelDetails: Record<StoryLevel, { focus: string; chineseFocus: string }> = {
  A2: {
    focus: "short, simple sentences",
    chineseFocus: "短而简单的句子"
  },
  B1: {
    focus: "clear sentences with everyday details",
    chineseFocus: "清楚并带有日常细节的句子"
  },
  B2: {
    focus: "connected sentences with more precise reasons",
    chineseFocus: "连接更自然、理由更精确的句子"
  }
};

const buildStructuredEnglishStory = (
  input: GenerateStructuredMistakeStoryInput,
  words: MistakeGenerationWord[]
) => {
  const scene = storySceneDetails[input.scene];
  const tone = storyToneDetails[input.tone];
  const targetList = joinEnglishList(words.map((word) => word.word));
  const wordGroups = splitIntoGroups(words, storyLengthSettings[input.length].groupCount);
  const practiceSentences = wordGroups.map((group, index) => {
    const leads = ["First", "Then", "After that", "Later", "Finally"];
    const wordList = joinEnglishList(group.map((word) => word.word));
    return `${leads[index] ?? "Next"}, Mia practiced ${wordList} in her ${scene.prop}, using ${storyLevelDetails[input.level].focus} so the words stayed close to real life.`;
  });

  if (words.length === 0) {
    return `Mia opened her ${scene.prop} ${scene.place} on ${input.dateKey}. There were no mistake words to review, so she wrote one simple sentence and kept the habit alive.`;
  }

  if (input.length === "short") {
    return [
      `Mia opened her ${scene.prop} ${scene.place} on ${input.dateKey}, ${tone.mood}.`,
      `She wrote ${targetList} across the page and ${scene.action}.`,
      practiceSentences[0],
      practiceSentences[1] ?? tone.turn,
      `Before she left, ${tone.close}.`
    ].filter(Boolean).join(" ");
  }

  if (input.length === "medium") {
    return [
      [
        `Mia opened her ${scene.prop} ${scene.place} on ${input.dateKey}, ${tone.mood}.`,
        `She wrote ${targetList} across the page and ${scene.action}.`,
        tone.turn
      ].join(" "),
      [
        ...practiceSentences,
        `When she checked the list again, each word had a small place in the story instead of sitting alone on the page.`,
        `Before she left, ${tone.close}.`
      ].join(" ")
    ].join("\n\n");
  }

  return [
    [
      `Mia opened her ${scene.prop} ${scene.place} on ${input.dateKey}, ${tone.mood}.`,
      `She wrote ${targetList} across the page and ${scene.action}.`,
      tone.turn
    ].join(" "),
    [
      ...practiceSentences,
      `She paused after each line, checked the spelling, and repeated the sentence until the rhythm felt natural.`
    ].join(" "),
    [
      `By the end of the review, the page looked less like a list of mistakes and more like a map of progress.`,
      `Each target word had a job, a scene, and a reason to stay in her memory.`,
      `Before she left, ${tone.close}.`
    ].join(" ")
  ].join("\n\n");
};

const buildStructuredChineseStory = (
  input: GenerateStructuredMistakeStoryInput,
  words: MistakeGenerationWord[]
) => {
  if (!input.bilingual) return "";

  const scene = storySceneDetails[input.scene];
  const tone = storyToneDetails[input.tone];
  const targetList = joinChineseList(words.map((word) => `“${word.word}”`));
  const wordGroups = splitIntoGroups(words, storyLengthSettings[input.length].groupCount);
  const practiceSentences = wordGroups.map((group, index) => {
    const leads = ["首先", "然后", "接着", "后来", "最后"];
    const wordList = joinChineseList(group.map((word) => `“${word.word}”`));
    return `${leads[index] ?? "接下来"}，Mia 在${scene.prop}里练习${wordList}，并用${storyLevelDetails[input.level].chineseFocus}让这些词贴近真实生活。`;
  });

  if (words.length === 0) {
    return `Mia 在 ${input.dateKey} 的${scene.chinesePlace}打开了${scene.prop}。这天没有需要复习的错词，所以她写下一句简单的话，继续保持习惯。`;
  }

  if (input.length === "short") {
    return [
      `Mia 在 ${input.dateKey} 的${scene.chinesePlace}打开了${scene.prop}，${tone.chineseMood}。`,
      `她在页面上写下${targetList}，并${scene.chineseAction}。`,
      practiceSentences[0],
      practiceSentences[1] ?? tone.chineseTurn,
      `离开前，${tone.chineseClose}。`
    ].filter(Boolean).join("");
  }

  if (input.length === "medium") {
    return [
      [
        `Mia 在 ${input.dateKey} 的${scene.chinesePlace}打开了${scene.prop}，${tone.chineseMood}。`,
        `她在页面上写下${targetList}，并${scene.chineseAction}。`,
        `${tone.chineseTurn}。`
      ].join(""),
      [
        ...practiceSentences,
        "再次检查时，每个词都已经有了故事里的位置，不再只是孤零零地躺在纸上。",
        `离开前，${tone.chineseClose}。`
      ].join("")
    ].join("\n\n");
  }

  return [
    [
      `Mia 在 ${input.dateKey} 的${scene.chinesePlace}打开了${scene.prop}，${tone.chineseMood}。`,
      `她在页面上写下${targetList}，并${scene.chineseAction}。`,
      `${tone.chineseTurn}。`
    ].join(""),
    [
      ...practiceSentences,
      "她每写完一行都会停下来检查拼写，再把句子重复到节奏自然为止。"
    ].join(""),
    [
      "复习结束时，这一页看起来不再像错误清单，而更像一张进步地图。",
      "每个目标词都有了任务、场景和留在记忆里的理由。",
      `离开前，${tone.chineseClose}。`
    ].join("")
  ].join("\n\n");
};

const sentenceTemplate = (word: MistakeGenerationWord, index: number) => {
  const situations = [
    "During the review session",
    "In a short conversation",
    "While writing a clear note",
    "At the end of the lesson"
  ];
  const subject = situations[index % situations.length];
  return `${subject}, I used **${word.word}** to remember ${word.translation}.`;
};

const translationTemplate = (word: MistakeGenerationWord, index: number) => {
  const situations = ["复习时", "简短对话里", "写清楚笔记时", "课程结束时"];
  return `${situations[index % situations.length]}，我用 **${word.word}** 记住“${word.translation}”。`;
};

export const buildMistakeExamplesPrompt = (input: GenerateMistakeExamplesInput) =>
  `Generate one clear English example sentence for each mistake word from ${input.dateKey}. Level: ${input.level ?? "B1"}. Words: ${buildPromptSummary(input.words)}. Include Chinese translations and mark target words in bold.`;

export const buildMistakeStoryPrompt = (input: GenerateMistakeStoryInput) =>
  `Generate one coherent English mini story using all mistake words from ${input.dateKey}. Level: ${input.level ?? "B1"}. Tone: ${input.tone ?? "daily"}. Words: ${buildPromptSummary(input.words)}. Include Chinese translation and a used-word checklist. Mark target words in bold.`;

export const buildStructuredMistakeStoryPrompt = (input: GenerateStructuredMistakeStoryInput) =>
  [
    `Generate a structured mistake-word story from ${input.dateKey}.`,
    `Level: ${input.level}. Scene: ${input.scene}. Length: ${input.length}. Tone: ${input.tone}.`,
    input.bilingual ? "Include a Chinese translation." : "Leave chineseTranslation empty.",
    `Words: ${buildPromptSummary(input.words)}.`,
    "Return title, englishStory, chineseTranslation, usedWords, missingWords, and wordNotes.",
    "Keep each used target word in its original spelling inside englishStory for UI highlighting."
  ].join(" ");

export const aiService = {
  // AI 补全（预研）：为单词卡生成释义/助记/例句；AI 未配置时返回 null，由 UI 引导去设置。
  async explainWord(input: WordExplanationInput, settings?: Settings): Promise<WordExplanationResult | null> {
    const provider = settings?.aiProvider;
    if (!provider || !isAiProviderConfigured(provider)) return null;
    return generateWordExplanationWithModel(provider, input);
  },
  async analyzeSentence() {
    return null;
  },
  async generateExamples(input: GenerateMistakeExamplesInput) {
    return this.generateMistakeExamples(input);
  },
  async generateMistakeExamples(input: GenerateMistakeExamplesInput) {
    const words = normalizeWords(input.words);
    const lines = words.flatMap((word, index) => [
      `${index + 1}. ${sentenceTemplate(word, index)}`,
      `   中文：${translationTemplate(word, index)}`,
      word.wrongAnswers.length > 0 ? `   易错答案：${word.wrongAnswers.join(" / ")}` : ""
    ]).filter(Boolean);

    return [
      `## ${input.dateKey} 错词例句`,
      "",
      ...lines,
      "",
      `目标词：${words.map((word) => `**${word.word}**`).join("、")}`
    ].join("\n");
  },
  async generateMistakeStory(input: GenerateMistakeStoryInput) {
    const words = normalizeWords(input.words);
    const englishWords = words.map((word) => `**${word.word}**`);
    const chineseWords = words.map((word) => `“${word.translation}”`);
    const opening = input.tone === "work"
      ? "Mia prepared a small project report"
      : input.tone === "school"
        ? "Mia walked into class with a careful plan"
        : input.tone === "adventure"
          ? "Mia followed a bright map through a new town"
          : "Mia started her morning with a quiet plan";

    return [
      `## ${input.dateKey} 错词小故事`,
      "",
      `${opening}. She tried to use ${englishWords.slice(0, 8).join(", ")}${englishWords.length > 8 ? ", and more new words" : ""} in one clear paragraph. Each word helped her slow down, check the meaning, and build a better memory. By the end, the difficult words felt less distant, and she could explain them with confidence.`,
      "",
      "中文：",
      `Mia 开始了一段小练习。她把 ${chineseWords.slice(0, 8).join("、")}${chineseWords.length > 8 ? "等词" : ""} 放进同一个故事里。每个词都帮助她放慢速度、确认意思，并建立更稳的记忆。到最后，这些难词不再陌生，她也能更有信心地解释它们。`,
      "",
      "已使用词汇：",
      words.map((word) => `- **${word.word}**：${word.translation}`).join("\n")
    ].join("\n");
  },
  async generateStructuredMistakeStory(
    input: GenerateStructuredMistakeStoryInput,
    settings?: Settings,
    onFallback?: (error: unknown) => void
  ): Promise<StructuredMistakeStoryResult> {
    const provider = settings?.aiProvider;
    if (provider?.enabled && provider.baseUrl && provider.apiKey && provider.model) {
      try {
        return await generateStructuredMistakeStoryWithModel(provider, input);
      } catch (error) {
        if (!provider.fallbackToLocal) throw error;
        onFallback?.(error);
        console.warn("AI story generation failed, using local fallback.", error);
      }
    }

    const words = uniqueWords(normalizeWords(input.words));
    const wordLimit = storyLengthSettings[input.length].maxWords;
    const storyWords = words.slice(0, wordLimit);
    const englishStory = buildStructuredEnglishStory(input, storyWords);
    const chineseTranslation = buildStructuredChineseStory(input, storyWords);
    const usedWords = storyWords
      .filter((word) => englishStory.includes(word.word))
      .map((word) => word.word);
    const usedWordSet = new Set(usedWords.map((word) => word.toLocaleLowerCase()));
    const missingWords = words
      .filter((word) => !usedWordSet.has(word.word.toLocaleLowerCase()))
      .map((word) => word.word);
    const scene = storySceneDetails[input.scene];
    const tone = storyToneDetails[input.tone];
    const wordNotes = words.map((word) => {
      const isUsed = usedWordSet.has(word.word.toLocaleLowerCase());
      const wrongAnswerNote = word.wrongAnswers.length > 0
        ? ` 易错答案：${word.wrongAnswers.join(" / ")}。`
        : "";
      const usageNote = isUsed
        ? "已写入英文故事，便于高亮复习。"
        : "因篇幅控制未写入英文故事，可在下一版故事中优先加入。";

      return {
        word: word.word,
        translation: word.translation,
        note: `${usageNote} 释义：“${word.translation}”。${wrongAnswerNote}`
      };
    });

    return {
      title: `${tone.title} ${scene.title}`,
      englishStory,
      chineseTranslation,
      usedWords,
      missingWords,
      wordNotes
    };
  }
};
