import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Copy,
  FileText,
  ListChecks,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAppData } from "../AppContext";
import EmptyState from "../components/EmptyState";
import LetterDiffView from "../components/LetterDiffView";
import PageHeader from "../components/PageHeader";
import {
  aiService,
  buildMistakeExamplesPrompt,
  buildStructuredMistakeStoryPrompt,
  MistakeGenerationWord,
  StoryLength,
  StoryLevel,
  StoryScene,
  StoryTone
} from "../services/aiService";
import { compareLetters } from "../services/diffService";
import { findDictionaryEntry, findDictionaryEntryAsync } from "../services/dictionaryService";
import {
  getLocalDateKey,
  getMistakeGenerationsByDate,
  getMistakeGroupsByDate,
  MistakeEntry,
  saveMistakeGeneration
} from "../services/mistakeBookService";
import { DictionaryEntry, LetterDiffToken, MistakeGeneration, MistakeGenerationStoryWordNote, MistakeGenerationWordSnapshot, Review } from "../types";

type GenerationStatus = "idle" | "examples" | "story";
type MasteryStatus = "pending" | "improving" | "mastered" | "stubborn";
type MistakeFilter = "all" | "pending" | "stubborn" | "unmastered";
type MistakeSort = "priority" | "wrongCount" | "recent" | "alphabetical";
type StorySourceMode = "visible" | "all" | "unmastered" | "stubborn";

interface MistakeInsight {
  status: MasteryStatus;
  label: string;
  description: string;
  latestCorrectReview?: Review;
}

interface MistakeGroupProgress {
  mastered: number;
  pending: number;
  stubborn: number;
  unmastered: number;
  completion: number;
  generationCount: number;
  hasStory: boolean;
}

interface StoryWordPopover {
  word: string;
  dateKey: string;
  cardId?: string;
  x: number;
  y: number;
  status: "loading" | "ready" | "miss";
  dictionaryEntry?: DictionaryEntry;
  note?: MistakeGenerationStoryWordNote;
  snapshot?: MistakeGenerationWordSnapshot;
}

const storyLevelOptions: Array<{ value: StoryLevel; label: string }> = [
  { value: "A2", label: "A2" },
  { value: "B1", label: "B1" },
  { value: "B2", label: "B2" }
];

const storyLengthOptions: Array<{ value: StoryLength; label: string }> = [
  { value: "short", label: "短篇" },
  { value: "medium", label: "中篇" },
  { value: "long", label: "长篇" }
];

const storySceneOptions: Array<{ value: StoryScene; label: string }> = [
  { value: "daily", label: "日常" },
  { value: "school", label: "学校" },
  { value: "work", label: "工作" },
  { value: "travel", label: "旅行" },
  { value: "adventure", label: "冒险" },
  { value: "exam", label: "考试" }
];

const storyToneOptions: Array<{ value: StoryTone; label: string }> = [
  { value: "natural", label: "自然" },
  { value: "warm", label: "温暖" },
  { value: "humorous", label: "轻松" },
  { value: "suspense", label: "悬念" },
  { value: "motivational", label: "鼓励" }
];

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "时间未知";

  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
};

const buildGenerationWords = (entries: MistakeEntry[]): MistakeGenerationWord[] =>
  entries.map((entry) => ({
    word: entry.card.front,
    translation: entry.card.back || entry.details?.chineseDefinition || "待复习",
    partOfSpeech: entry.details?.partOfSpeech,
    phonetic: entry.details?.phonetic,
    wrongAnswers: entry.answers
  }));

const getMistakeInsight = (entry: MistakeEntry, reviews: Review[]): MistakeInsight => {
  const latestWrongTime = new Date(entry.latestWrongAt).getTime();
  const laterReviews = reviews
    .filter((review) => review.cardId === entry.card.id && new Date(review.reviewedAt).getTime() > latestWrongTime)
    .sort((a, b) => new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime());
  const latestCorrectReview = laterReviews.find((review) => review.rating >= 4);

  if (latestCorrectReview) {
    return {
      status: "mastered",
      label: "已拼对",
      description: "错后已有一次高分复习",
      latestCorrectReview
    };
  }

  if (entry.wrongCount >= 3) {
    return {
      status: "stubborn",
      label: "仍易错",
      description: "同一天反复出错，建议先看差异再重练"
    };
  }

  if (laterReviews.length > 0) {
    return {
      status: "improving",
      label: "重练中",
      description: "错后已经复习过，继续巩固"
    };
  }

  return {
    status: "pending",
    label: "未重练",
    description: "还没有错后复习记录"
  };
};

const getPrimaryWrongAnswer = (entry: MistakeEntry) =>
  entry.answers.find((answer) => answer !== "未填写") ?? entry.answers[0] ?? "";

const getContentPreview = (content: string) => {
  const lines = content.split("\n").map((line) => line.trim()).filter(Boolean);
  return lines.slice(0, 2).join(" ");
};

const getOptionLabel = <T extends string>(options: Array<{ value: T; label: string }>, value: T) =>
  options.find((option) => option.value === value)?.label ?? value;

const getSavedOptionLabel = (options: Array<{ value: string; label: string }>, value?: string) =>
  value ? options.find((option) => option.value === value)?.label ?? value : "";

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const renderHighlightedText = (
  text: string,
  words: string[],
  onWordSelect?: (word: string, event: MouseEvent<HTMLButtonElement>) => void,
  getWordStatus?: (word: string) => string
) => {
  const uniqueWords = Array.from(new Set(words.map((word) => word.trim()).filter(Boolean)))
    .sort((a, b) => b.length - a.length);

  if (uniqueWords.length === 0) return text;

  const wordPattern = uniqueWords.map(escapeRegExp).join("|");
  const targetWords = new Set(uniqueWords.map((word) => word.toLocaleLowerCase()));
  const matcher = new RegExp(`\\b(${wordPattern})\\b`, "gi");

  return text.split(matcher).map((part, index) =>
    targetWords.has(part.toLocaleLowerCase())
      ? (
          <button
            className={`mistake-story-word-button ${getWordStatus?.(part) ?? ""}`.trim()}
            type="button"
            key={`${part}-${index}`}
            onClick={(event) => onWordSelect?.(part, event)}
          >
            {part}
          </button>
        )
      : part
  );
};

const getStoryWordStatusClass = (generation: MistakeGeneration, word: string) => {
  const normalized = word.toLocaleLowerCase();
  const snapshot = generation.wordSnapshots?.find((item) => item.word.toLocaleLowerCase() === normalized);

  if (snapshot?.status === "stubborn") return "stubborn";
  if (snapshot?.status === "pending" || snapshot?.status === "improving") return "unmastered";
  if (snapshot?.status === "mastered") return "mastered";
  return "";
};

const getLatestGeneration = (generations: MistakeGeneration[]) =>
  generations.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

const getStorySourceEntries = (
  mode: StorySourceMode,
  visibleEntries: MistakeEntry[],
  entries: MistakeEntry[],
  unmasteredEntries: MistakeEntry[],
  stubbornEntries: MistakeEntry[]
) => {
  if (mode === "all") return entries;
  if (mode === "unmastered") return unmasteredEntries;
  if (mode === "stubborn") return stubbornEntries;
  return visibleEntries;
};

const summarizeLetterDiff = (tokens: LetterDiffToken[]) => {
  const changes = tokens
    .map((token, index) => {
      if (token.status === "match") return null;
      if (token.status === "missing") return { key: `missing-${index}-${token.expected}`, text: `漏写 ${token.expected}` };
      if (token.status === "extra") return { key: `extra-${index}-${token.char}`, text: `多写 ${token.char}` };
      return { key: `sub-${index}-${token.char}-${token.expected}`, text: `${token.char} 写成了 ${token.expected}` };
    })
    .filter((item): item is { key: string; text: string } => Boolean(item));

  if (changes.length === 0) {
    return { title: "拼写已经一致", changes };
  }

  const summary = changes.length === 1 ? changes[0].text : `${changes.length} 处字母差异`;
  return { title: summary, changes };
};

const renderDiffRows = (tokens: LetterDiffToken[]) => {
  const expectedRow = tokens.map((token, index) => {
    const char = token.expected ?? "";
    return (
      <span key={`expected-${index}`} className={token.status === "match" ? "match" : "expected"}>
        {char || "-"}
      </span>
    );
  });

  const answerRow = tokens.map((token, index) => {
    const char = token.status === "missing" ? "-" : token.char;
    return (
      <span key={`answer-${index}`} className={token.status === "match" ? "match" : "answer"}>
        {char || "-"}
      </span>
    );
  });

  return { expectedRow, answerRow };
};

const encodeCardIds = (entries: MistakeEntry[]) => encodeURIComponent(entries.map((entry) => entry.card.id).join(","));

const sortEntries = (entries: MistakeEntry[], insights: Map<string, MistakeInsight>, sort: MistakeSort) => {
  const priorityRank: Record<MasteryStatus, number> = {
    stubborn: 0,
    pending: 1,
    improving: 2,
    mastered: 3
  };

  return entries.slice().sort((a, b) => {
    if (sort === "wrongCount") return b.wrongCount - a.wrongCount || a.card.front.localeCompare(b.card.front);
    if (sort === "recent") return new Date(b.latestWrongAt).getTime() - new Date(a.latestWrongAt).getTime();
    if (sort === "alphabetical") return a.card.front.localeCompare(b.card.front);

    const statusA = insights.get(a.card.id)?.status ?? "pending";
    const statusB = insights.get(b.card.id)?.status ?? "pending";
    return priorityRank[statusA] - priorityRank[statusB] || b.wrongCount - a.wrongCount || a.card.front.localeCompare(b.card.front);
  });
};

const getGroupProgress = (entries: MistakeEntry[], reviews: Review[], generationCount: number, hasStory: boolean): MistakeGroupProgress => {
  const stats = entries.reduce(
    (current, entry) => {
      const insight = getMistakeInsight(entry, reviews);
      if (insight.status === "mastered") current.mastered += 1;
      if (insight.status === "pending") current.pending += 1;
      if (insight.status === "stubborn") current.stubborn += 1;
      return current;
    },
    { mastered: 0, pending: 0, stubborn: 0 }
  );

  return {
    ...stats,
    unmastered: Math.max(0, entries.length - stats.mastered),
    completion: entries.length > 0 ? Math.round((stats.mastered / entries.length) * 100) : 0,
    generationCount,
    hasStory
  };
};

export default function MistakeBookPage() {
  const { data, updateData, updateDataAsync } = useAppData();
  const wordLookupRequestRef = useRef(0);
  const storyCardRefs = useRef(new Map<string, HTMLElement>());
  const groups = useMemo(() => getMistakeGroupsByDate(data), [data]);
  const [selectedDateKey, setSelectedDateKey] = useState(groups[0]?.dateKey ?? "");
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>("idle");
  const [generationError, setGenerationError] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const [expandedGenerationIds, setExpandedGenerationIds] = useState<string[]>([]);
  const [expandedTranslationIds, setExpandedTranslationIds] = useState<string[]>([]);
  const [expandedDiffIds, setExpandedDiffIds] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<MistakeFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<MistakeSort>("priority");
  const [storySettingsOpen, setStorySettingsOpen] = useState(false);
  const [storySourceMode, setStorySourceMode] = useState<StorySourceMode>("visible");
  const [storyLevel, setStoryLevel] = useState<StoryLevel>("B1");
  const [storyScene, setStoryScene] = useState<StoryScene>("daily");
  const [storyLength, setStoryLength] = useState<StoryLength>("medium");
  const [storyTone, setStoryTone] = useState<StoryTone>("natural");
  const [storyBilingual, setStoryBilingual] = useState(true);
  const [storyWordPopover, setStoryWordPopover] = useState<StoryWordPopover | null>(null);
  const [pendingStoryFocusId, setPendingStoryFocusId] = useState("");

  useEffect(() => {
    if (groups.length === 0) {
      setSelectedDateKey("");
      return;
    }
    if (!groups.some((group) => group.dateKey === selectedDateKey)) {
      setSelectedDateKey(groups[0].dateKey);
    }
  }, [groups, selectedDateKey]);

  const selectedGroup = groups.find((group) => group.dateKey === selectedDateKey) ?? groups[0];
  const todayKey = getLocalDateKey(new Date());
  const todayGroup = groups.find((group) => group.dateKey === todayKey);
  const entries = selectedGroup?.entries ?? [];
  const generations = selectedGroup ? getMistakeGenerationsByDate(data, selectedGroup.dateKey) : [];
  const groupProgress = useMemo(
    () => new Map(groups.map((group) => {
      const groupGenerations = getMistakeGenerationsByDate(data, group.dateKey);
      return [
        group.dateKey,
        getGroupProgress(
          group.entries,
          data.reviews,
          groupGenerations.length,
          groupGenerations.some((generation) => generation.type === "story")
        )
      ];
    })),
    [groups, data.reviews, data.mistakeGenerations]
  );
  const entryInsights = useMemo(
    () => new Map(entries.map((entry) => [entry.card.id, getMistakeInsight(entry, data.reviews)])),
    [entries, data.reviews]
  );
  const selectedStats = entries.reduce(
    (stats, entry) => {
      const insight = entryInsights.get(entry.card.id);
      if (insight?.status === "mastered") stats.mastered += 1;
      if (insight?.status === "pending") stats.pending += 1;
      if (insight?.status === "stubborn") stats.stubborn += 1;
      return stats;
    },
    { mastered: 0, pending: 0, stubborn: 0 }
  );
  const unmasteredEntries = entries.filter((entry) => entryInsights.get(entry.card.id)?.status !== "mastered");
  const pendingEntries = entries.filter((entry) => entryInsights.get(entry.card.id)?.status === "pending");
  const stubbornEntries = entries.filter((entry) => entryInsights.get(entry.card.id)?.status === "stubborn");
  const statusFilteredEntries = entries.filter((entry) => {
    const status = entryInsights.get(entry.card.id)?.status;
    if (activeFilter === "pending") return status === "pending";
    if (activeFilter === "stubborn") return status === "stubborn";
    if (activeFilter === "unmastered") return status !== "mastered";
    return true;
  });
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const searchedEntries = statusFilteredEntries.filter((entry) => {
    if (!normalizedSearch) return true;
    return [entry.card.front, entry.card.back, entry.details?.chineseDefinition, ...entry.answers]
      .filter((value): value is string => Boolean(value))
      .some((value) => value.toLowerCase().includes(normalizedSearch));
  });
  const visibleEntries = sortEntries(searchedEntries, entryInsights, sortMode);
  const filters: Array<{ value: MistakeFilter; label: string; count: number }> = [
    { value: "all", label: "全部", count: entries.length },
    { value: "unmastered", label: "未掌握", count: unmasteredEntries.length },
    { value: "pending", label: "未重练", count: pendingEntries.length },
    { value: "stubborn", label: "仍易错", count: stubbornEntries.length }
  ];
  const storySourceEntries = useMemo(
    () => getStorySourceEntries(storySourceMode, visibleEntries, entries, unmasteredEntries, stubbornEntries),
    [entries, storySourceMode, stubbornEntries, unmasteredEntries, visibleEntries]
  );
  const storySourceOptions: Array<{ value: StorySourceMode; label: string; count: number }> = [
    { value: "visible", label: "当前显示", count: visibleEntries.length },
    { value: "all", label: "全部错词", count: entries.length },
    { value: "unmastered", label: "未掌握", count: unmasteredEntries.length },
    { value: "stubborn", label: "仍易错", count: stubbornEntries.length }
  ];
  const storySourceLabel = storySourceOptions.find((option) => option.value === storySourceMode)?.label ?? "当前显示";
  const storySourceCardIds = storySourceEntries.map((entry) => entry.card.id);
  const storySourceCardKey = storySourceCardIds.slice().sort().join("|");
  const currentSourceStory = storySourceEntries.length > 0 ? getLatestGeneration(generations.filter((generation) => {
    if (generation.type !== "story") return false;
    return generation.cardIds.slice().sort().join("|") === storySourceCardKey;
  })) : undefined;
  const hasStoryForCurrentSource = Boolean(currentSourceStory);
  const lowerGenerations = currentSourceStory
    ? generations.filter((generation) => generation.id !== currentSourceStory.id)
    : generations;
  const storySettingsSummary = [
    storyLevel,
    getOptionLabel(storySceneOptions, storyScene),
    getOptionLabel(storyLengthOptions, storyLength),
    getOptionLabel(storyToneOptions, storyTone),
    storyBilingual ? "双语" : "英文"
  ].join(" · ");
  const isRealModelConfigured = Boolean(
    data.settings.aiProvider.enabled &&
    data.settings.aiProvider.baseUrl &&
    data.settings.aiProvider.apiKey &&
    data.settings.aiProvider.model
  );
  const selectedCompletion = entries.length > 0 ? Math.round((selectedStats.mastered / entries.length) * 100) : 0;
  const nextAction = selectedStats.pending > 0
    ? {
        title: "先练未重练",
        description: `${selectedStats.pending} 个错词还没有错后复习，先处理它们。`,
        to: `/spelling?mode=mistakes&date=${selectedGroup.dateKey}&cards=${encodeCardIds(pendingEntries)}`,
        icon: ListChecks
      }
    : selectedStats.stubborn > 0
      ? {
          title: "攻克易错词",
          description: `${selectedStats.stubborn} 个词反复出错，建议看差异后集中重练。`,
          to: `/spelling?mode=mistakes&date=${selectedGroup.dateKey}&cards=${encodeCardIds(stubbornEntries)}`,
          icon: AlertTriangle
        }
      : !generations.some((generation) => generation.type === "story")
        ? {
            title: "生成错词故事",
            description: "这一天还没有故事，把错词放进语境里再记一遍。",
            to: "",
            icon: Sparkles
          }
        : {
            title: "当天复盘完成",
            description: "已完成关键动作，可以回到训练页继续推进。",
            to: "/training",
            icon: CheckCircle2
          };
  const NextActionIcon = nextAction.icon;

  useEffect(() => {
    if (activeFilter !== "all" && entries.length > 0 && statusFilteredEntries.length === 0) {
      setActiveFilter("all");
    }
  }, [activeFilter, entries.length, statusFilteredEntries.length, selectedGroup?.dateKey]);

  useEffect(() => {
    if (!storyWordPopover) return;

    const closeOnScroll = () => {
      setStoryWordPopover(null);
      window.getSelection()?.removeAllRanges();
    };

    window.addEventListener("scroll", closeOnScroll, true);
    return () => window.removeEventListener("scroll", closeOnScroll, true);
  }, [storyWordPopover]);

  useEffect(() => {
    if (!pendingStoryFocusId) return;

    const target = storyCardRefs.current.get(pendingStoryFocusId);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setPendingStoryFocusId("");
  }, [pendingStoryFocusId, expandedGenerationIds, generations]);

  const generate = async (type: Exclude<GenerationStatus, "idle">, sourceEntries = visibleEntries) => {
    if (!selectedGroup || sourceEntries.length === 0 || generationStatus !== "idle") return;

    setGenerationStatus(type);
    setGenerationError("");

    try {
      const words = buildGenerationWords(sourceEntries);
      if (type === "examples") {
        const input = { dateKey: selectedGroup.dateKey, words, level: storyLevel };
        const prompt = buildMistakeExamplesPrompt(input);
        const content = await aiService.generateMistakeExamples(input);

        await updateDataAsync(async (current) => ({
          data: saveMistakeGeneration(current, {
          dateKey: selectedGroup.dateKey,
          type,
          cardIds: sourceEntries.map((entry) => entry.card.id),
          title: `${selectedGroup.label}错词例句`,
          content,
          prompt
          })
        }));
        return;
      }

      const input = {
        dateKey: selectedGroup.dateKey,
        words,
        level: storyLevel,
        scene: storyScene,
        length: storyLength,
        tone: storyTone,
        bilingual: storyBilingual
      };
      const prompt = buildStructuredMistakeStoryPrompt(input);
      let fallbackReason = "";
      const storyResult = await aiService.generateStructuredMistakeStory(input, data.settings, (error) => {
        fallbackReason = error instanceof Error ? error.message : "模型调用失败";
      });
      if (fallbackReason) {
        setGenerationError(`真实模型调用失败，已使用本地模板兜底：${fallbackReason}`);
      }
      const usedWordSet = new Set(storyResult.usedWords.map((word) => word.toLocaleLowerCase()));
      const usedCardIds = sourceEntries
        .filter((entry) => usedWordSet.has(entry.card.front.toLocaleLowerCase()))
        .map((entry) => entry.card.id);
      const missingCardIds = sourceEntries
        .filter((entry) => !usedWordSet.has(entry.card.front.toLocaleLowerCase()))
        .map((entry) => entry.card.id);
      const content = [
        `## ${storyResult.title}`,
        "",
        storyResult.englishStory,
        storyResult.chineseTranslation ? `\n中文：\n${storyResult.chineseTranslation}` : "",
        "",
        `已使用词汇：${storyResult.usedWords.join("、") || "无"}`,
        storyResult.missingWords.length > 0 ? `未写入词汇：${storyResult.missingWords.join("、")}` : "",
        storyResult.wordNotes.length > 0 ? "\n词汇提示：" : "",
        ...storyResult.wordNotes.map((note) => `- ${note.word}：${note.translation}。${note.note}`)
      ].filter(Boolean).join("\n");

      const updateResult = await updateDataAsync(async (current) => {
        const next = saveMistakeGeneration(current, {
          dateKey: selectedGroup.dateKey,
          type,
          cardIds: sourceEntries.map((entry) => entry.card.id),
          title: `${selectedGroup.label}错词故事`,
          content,
          prompt,
          settings: {
            level: storyLevel,
            scene: storyScene,
            length: storyLength,
            tone: storyTone,
            bilingual: storyBilingual
          },
          wordSnapshots: sourceEntries.map((entry) => ({
            cardId: entry.card.id,
            word: entry.card.front,
            translation: entry.card.back || entry.details?.chineseDefinition || "待复习",
            wrongAnswers: entry.answers,
            status: entryInsights.get(entry.card.id)?.status
          })),
          coverage: {
            usedCardIds,
            missingCardIds
          },
          story: {
            title: storyResult.title,
            englishStory: storyResult.englishStory,
            chineseTranslation: storyResult.chineseTranslation,
            usedWords: storyResult.usedWords,
            missingWords: storyResult.missingWords,
            wordNotes: storyResult.wordNotes.map((note) => ({
              word: note.word,
              sentence: note.note,
              meaning: note.translation
            }))
          }
        });
        const savedStory = getLatestGeneration(getMistakeGenerationsByDate(next, selectedGroup.dateKey).filter((generation) => generation.type === "story"));
        return { data: next, storyId: savedStory?.id ?? "" };
      });

      if (updateResult.storyId) {
        setExpandedGenerationIds((current) => current.includes(updateResult.storyId) ? current : [...current, updateResult.storyId]);
        setPendingStoryFocusId(updateResult.storyId);
      }
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : "生成失败，请稍后再试。");
    } finally {
      setGenerationStatus("idle");
    }
  };

  const copyContent = async (id: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(""), 1600);
  };

  const toggleGeneration = (id: string) => {
    setExpandedGenerationIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const toggleTranslation = (id: string) => {
    setExpandedTranslationIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const toggleDiff = (id: string) => {
    setExpandedDiffIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const openStoryWordPopover = (
    word: string,
    generation: MistakeGeneration,
    position: { x: number; y: number }
  ) => {
    const normalizedWord = word.trim().replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, "");
    if (!normalizedWord) return;

    const requestId = wordLookupRequestRef.current + 1;
    wordLookupRequestRef.current = requestId;
    const normalizedKey = normalizedWord.toLocaleLowerCase();
    const note = generation.story?.wordNotes.find((item) => item.word.toLocaleLowerCase() === normalizedKey);
    const snapshot = generation.wordSnapshots?.find((item) => item.word.toLocaleLowerCase() === normalizedKey);
    const dictionaryEntry = findDictionaryEntry(data, normalizedWord);

    setStoryWordPopover({
      word: normalizedWord,
      dateKey: generation.dateKey,
      cardId: snapshot?.cardId,
      x: position.x,
      y: position.y,
      status: dictionaryEntry || note || snapshot ? "ready" : "loading",
      dictionaryEntry,
      note,
      snapshot
    });

    void findDictionaryEntryAsync(data, normalizedWord)
      .then((asyncEntry) => {
        if (wordLookupRequestRef.current !== requestId) return;
        setStoryWordPopover((current) => {
          if (!current || current.word.toLocaleLowerCase() !== normalizedKey) return current;
          return {
            ...current,
            status: asyncEntry || current.note || current.snapshot ? "ready" : "miss",
            dictionaryEntry: asyncEntry ?? current.dictionaryEntry
          };
        });
      })
      .catch(() => {
        if (wordLookupRequestRef.current !== requestId) return;
        setStoryWordPopover((current) => current ? { ...current, status: current.dictionaryEntry || current.note || current.snapshot ? "ready" : "miss" } : current);
      });
  };

  const handleHighlightedWordSelect = (generation: MistakeGeneration, word: string, event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    openStoryWordPopover(word, generation, {
      x: Math.min(window.innerWidth - 24, rect.left + rect.width / 2),
      y: rect.bottom + 10
    });
  };

  const handleStoryTextSelection = (generation: MistakeGeneration) => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim() ?? "";
    const selectedWord = selectedText.match(/^[A-Za-z][A-Za-z'-]*$/)?.[0];
    if (!selection || selection.isCollapsed || !selectedWord || selection.rangeCount === 0) return;

    const rect = selection.getRangeAt(0).getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;
    openStoryWordPopover(selectedWord, generation, {
      x: Math.min(window.innerWidth - 24, rect.left + rect.width / 2),
      y: rect.bottom + 10
    });
  };

  const renderStructuredStory = (generation: MistakeGeneration) => {
    if (!generation.story) {
      return <pre className="mistake-generation-content">{generation.content}</pre>;
    }

    const story = generation.story;
    const isTranslationExpanded = expandedTranslationIds.includes(generation.id);
    const totalWords = generation.wordSnapshots?.length ?? generation.cardIds.length;
    const usedCount = generation.coverage?.usedCardIds.length ?? story.usedWords.length;
    const missingCount = generation.coverage?.missingCardIds.length ?? story.missingWords.length;
    const practiceCardIds = generation.cardIds.length > 0 ? generation.cardIds : generation.coverage?.usedCardIds ?? [];
    const practiceUrl = `/spelling?mode=mistakes&date=${generation.dateKey}&cards=${encodeURIComponent(practiceCardIds.join(","))}`;
    const highlightedWords = story.usedWords.length > 0
      ? story.usedWords
      : generation.wordSnapshots?.map((snapshot) => snapshot.word) ?? [];
    const savedSettings = [
      generation.settings?.level,
      getSavedOptionLabel(storySceneOptions, generation.settings?.scene),
      getSavedOptionLabel(storyLengthOptions, generation.settings?.length),
      getSavedOptionLabel(storyToneOptions, generation.settings?.tone),
      typeof generation.settings?.bilingual === "boolean" ? (generation.settings.bilingual ? "双语" : "英文") : ""
    ].filter(Boolean);

    return (
      <div className="mistake-story-structured">
        <div className="mistake-story-overview">
          <div>
            <span className="eyebrow">Story</span>
            <h4>{story.title || generation.title}</h4>
          </div>
          <div className="mistake-story-coverage" aria-label="故事词汇覆盖度">
            <strong>{usedCount}/{totalWords || usedCount}</strong>
            <span>{missingCount > 0 ? `${missingCount} 未写入` : "全部写入"}</span>
          </div>
        </div>
        {savedSettings.length > 0 && (
          <div className="mistake-story-meta">
            {savedSettings.map((item) => <span key={item}>{item}</span>)}
          </div>
        )}
        <div className="mistake-story-paragraphs">
          {story.englishStory.split(/\n{2,}/).filter(Boolean).map((paragraph, index) => (
            <p key={`${generation.id}-paragraph-${index}`} onMouseUp={() => handleStoryTextSelection(generation)}>
              {renderHighlightedText(
                paragraph,
                highlightedWords,
                (word, event) => handleHighlightedWordSelect(generation, word, event),
                (word) => getStoryWordStatusClass(generation, word)
              )}
            </p>
          ))}
        </div>
        {story.chineseTranslation && (
          <div className="mistake-story-translation">
            <button
              type="button"
              onClick={() => toggleTranslation(generation.id)}
              aria-expanded={isTranslationExpanded}
            >
              {isTranslationExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              中文翻译
            </button>
            {isTranslationExpanded && (
              <div>
                {story.chineseTranslation.split(/\n{2,}/).filter(Boolean).map((paragraph, index) => (
                  <p key={`${generation.id}-translation-${index}`}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        )}
        {(story.usedWords.length > 0 || story.missingWords.length > 0) && (
          <div className="mistake-story-vocab">
            {story.usedWords.map((word) => (
              <span className="mistake-story-vocab-chip used" key={`used-${generation.id}-${word}`}>{word}</span>
            ))}
            {story.missingWords.map((word) => (
              <span className="mistake-story-vocab-chip missing" key={`missing-${generation.id}-${word}`}>{word}</span>
            ))}
          </div>
        )}
        {story.wordNotes.length > 0 && (
          <div className="mistake-story-notes">
            <h4>词汇提示</h4>
            <div>
              {story.wordNotes.map((note) => (
                <article key={`${generation.id}-${note.word}`}>
                  <strong>{note.word}</strong>
                  <span>{note.meaning}</span>
                  <p>{note.sentence}</p>
                </article>
              ))}
            </div>
          </div>
        )}
        <div className="mistake-story-actions">
          <Link to={practiceUrl} className="secondary-button">
            <Target size={17} />
            重练故事词汇
          </Link>
        </div>
      </div>
    );
  };

  const renderStoryWordPopover = () => {
    if (!storyWordPopover) return null;

    const { dictionaryEntry, note, snapshot } = storyWordPopover;
    const translation = dictionaryEntry?.translation || note?.meaning || snapshot?.translation || "暂未找到中文释义";
    const definition = dictionaryEntry?.definition || "";
    const wrongAnswers = snapshot?.wrongAnswers.filter(Boolean) ?? [];
    const baseWord = dictionaryEntry?.word && dictionaryEntry.word.toLocaleLowerCase() !== storyWordPopover.word.toLocaleLowerCase()
      ? dictionaryEntry.word
      : "";
    const practiceUrl = storyWordPopover.cardId
      ? `/spelling?mode=mistakes&date=${storyWordPopover.dateKey}&cards=${encodeURIComponent(storyWordPopover.cardId)}`
      : "";

    return (
      <>
        <button
          className="story-word-dismiss-layer"
          type="button"
          aria-label="关闭单词信息"
          onClick={() => setStoryWordPopover(null)}
        />
        <div
          className="story-word-popover"
          style={{ left: storyWordPopover.x, top: storyWordPopover.y }}
          role="dialog"
          aria-label={`${storyWordPopover.word} 的单词信息`}
        >
          <div className="story-word-popover-head">
            <div>
              <strong>{storyWordPopover.word}</strong>
              {(dictionaryEntry?.phonetic || dictionaryEntry?.partOfSpeech) && (
                <span>{[dictionaryEntry?.phonetic, dictionaryEntry?.partOfSpeech].filter(Boolean).join(" · ")}</span>
              )}
              {baseWord && <span>原形：{baseWord}</span>}
            </div>
            <button className="icon-button" type="button" title="关闭" onClick={() => setStoryWordPopover(null)}>×</button>
          </div>
          <div className="story-word-popover-body">
            <section>
              <span>释义</span>
              <p>{translation}</p>
            </section>
            {definition && (
              <section>
                <span>英文解释</span>
                <p>{definition}</p>
              </section>
            )}
            {note?.sentence && (
              <section>
                <span>故事提示</span>
                <p>{note.sentence}</p>
              </section>
            )}
            {wrongAnswers.length > 0 && (
              <section>
                <span>常见错写</span>
                <div className="story-word-popover-chips">
                  {wrongAnswers.map((answer) => <em key={answer}>{answer}</em>)}
                </div>
              </section>
            )}
            {storyWordPopover.status === "loading" && <small>正在补充词典信息...</small>}
            {storyWordPopover.status === "miss" && <small>没有更多词典信息，已显示故事里的记录。</small>}
            {practiceUrl && (
              <Link className="secondary-button compact-button story-word-practice-link" to={practiceUrl}>
                <Target size={15} />
                重练这个词
              </Link>
            )}
          </div>
        </div>
      </>
    );
  };

  const renderGenerationCard = (generation: MistakeGeneration) => {
    const isExpanded = expandedGenerationIds.includes(generation.id);

    return (
      <article
        className={`mistake-generation-card ${isExpanded ? "expanded" : ""}`}
        key={generation.id}
        ref={(node) => {
          if (node) storyCardRefs.current.set(generation.id, node);
          else storyCardRefs.current.delete(generation.id);
        }}
      >
        <div className="mistake-generation-card-header">
          <div>
            <span className="eyebrow">{generation.type === "story" ? "Story" : "Examples"}</span>
            <h3>{generation.title}</h3>
            <small>{formatDateTime(generation.createdAt)} · {generation.cardIds.length} 个词</small>
          </div>
          <div className="mistake-generation-card-actions">
            <button className="icon-button" type="button" title={isExpanded ? "收起内容" : "展开内容"} onClick={() => toggleGeneration(generation.id)}>
              {isExpanded ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
            </button>
            <button className="icon-button" type="button" title="复制内容" onClick={() => copyContent(generation.id, generation.content)}>
              {copiedId === generation.id ? <CheckCircle2 size={17} /> : <Copy size={17} />}
            </button>
          </div>
        </div>
        {!isExpanded && <p className="mistake-generation-preview">{getContentPreview(generation.content)}</p>}
        {isExpanded && renderStructuredStory(generation)}
      </article>
    );
  };

  if (groups.length === 0) {
    return (
      <div className="page mistake-book-page">
        <PageHeader
          eyebrow="Mistake Book"
          title="错词本"
          description="拼写或复习中出现错误后，会按本地日期自动汇总到这里。"
          action={<Link to="/training" className="secondary-button">去训练</Link>}
        />
        <EmptyState
          title="错词本还是空的"
          description="完成一次拼写或复习，答错的词会自动进入按日期整理的错词本。"
          action={<Link to="/spelling" className="primary-button">开始听写</Link>}
        />
      </div>
    );
  }

  return (
    <div className="page mistake-book-page">
      {renderStoryWordPopover()}
      <PageHeader
        eyebrow="Mistake Book"
        title={todayGroup ? `今天 ${todayGroup.mistakeCount} 个错词` : "错词本"}
        description={todayGroup ? `今天已记录 ${todayGroup.attemptCount} 次错误，先处理未掌握词，再生成例句或故事巩固。` : "按日期复盘错词，快速重练，并把当天错词生成例句或英文小故事。"}
      />

      {todayGroup && (
        <section className="mistake-today-focus" aria-label="今日错词焦点">
          <div>
            <span className="eyebrow">Today Focus</span>
            <h2>先把今天的错词收住</h2>
            <p>{todayGroup.mistakeCount} 个错词 · {todayGroup.attemptCount} 次错误 · {getMistakeGenerationsByDate(data, todayKey).length} 条生成内容</p>
          </div>
        </section>
      )}

      <section className="mistake-summary-strip" aria-label="错词本摘要">
        <div>
          <CalendarDays size={18} />
          <span>记录天数</span>
          <strong>{groups.length}</strong>
        </div>
        <div>
          <CheckCircle2 size={18} />
          <span>当天已掌握</span>
          <strong>{selectedCompletion}%</strong>
        </div>
        <div>
          <AlertTriangle size={18} />
          <span>仍易错</span>
          <strong>{selectedStats.stubborn}</strong>
        </div>
        <div>
          <Sparkles size={18} />
          <span>已生成</span>
          <strong>{data.mistakeGenerations.length}</strong>
        </div>
      </section>

      <section className="mistake-book-layout">
        <aside className="panel mistake-date-panel" aria-label="错词日期">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Dates</span>
              <h2>按日期</h2>
            </div>
            <span className="panel-count">{groups.length} 天</span>
          </div>
          <div className="mistake-date-list">
            {groups.map((group) => {
              const progress = groupProgress.get(group.dateKey);
              return (
                <button
                  key={group.dateKey}
                  type="button"
                  className={`mistake-date-button ${group.dateKey === selectedGroup?.dateKey ? "active" : ""}`}
                  onClick={() => setSelectedDateKey(group.dateKey)}
                >
                  <span>{group.label}</span>
                  <strong>{group.mistakeCount} 个错词</strong>
                  <em>{group.attemptCount} 次错误 · {progress?.completion ?? 0}% 已掌握</em>
                  <div className="mistake-date-progress" aria-hidden="true">
                    <span style={{ width: `${progress?.completion ?? 0}%` }} />
                  </div>
                  <div className="mistake-date-badges">
                    {progress && progress.unmastered > 0 && <small>{progress.unmastered} 未掌握</small>}
                    {progress && progress.generationCount > 0 && <small>{progress.generationCount} 生成</small>}
                    {progress?.hasStory && <small>故事</small>}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="mistake-book-main">
          <section className="panel mistake-word-panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow">{selectedGroup?.dateKey}</span>
                <h2>{selectedGroup?.label}错词</h2>
              </div>
            </div>
            {generationError && <p className="mistake-generation-error" role="alert">{generationError}</p>}
            <div className="mistake-next-action" aria-label="下一步建议">
              <div>
                <NextActionIcon size={18} />
                <div>
                  <strong>{nextAction.title}</strong>
                  <span>{nextAction.description}</span>
                </div>
              </div>
              {nextAction.to ? (
                <Link to={nextAction.to} className="secondary-button compact-button">开始</Link>
              ) : (
                <button className="secondary-button compact-button" type="button" onClick={() => generate("story", storySourceEntries)} disabled={generationStatus !== "idle" || storySourceEntries.length === 0}>生成</button>
              )}
            </div>
            <div className="mistake-day-progress" aria-label="当天错词掌握进度">
              <div>
                <strong>{selectedCompletion}%</strong>
                <span>{selectedStats.mastered} / {entries.length} 已拼对 · {selectedStats.pending} 个未重练</span>
              </div>
              <div className="mistake-progress-track">
                <span style={{ width: `${selectedCompletion}%` }} />
              </div>
            </div>
            <div className="mistake-filter-bar" aria-label="错词筛选">
              <span><SlidersHorizontal size={15} />筛选</span>
              <div>
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    className={activeFilter === filter.value ? "active" : ""}
                    onClick={() => setActiveFilter(filter.value)}
                  >
                    {filter.label}<em>{filter.count}</em>
                  </button>
                ))}
              </div>
            </div>
            <div className="mistake-list-toolbar" aria-label="错词列表工具">
              <label className="mistake-search-box">
                <Search size={16} />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="搜索单词、释义或错误答案"
                />
              </label>
              <label className="mistake-sort-box">
                <span>排序</span>
                <select value={sortMode} onChange={(event) => setSortMode(event.target.value as MistakeSort)}>
                  <option value="priority">修复优先</option>
                  <option value="wrongCount">错误次数</option>
                  <option value="recent">最近错误</option>
                  <option value="alphabetical">字母顺序</option>
                </select>
              </label>
              <span className="mistake-visible-count">显示 {visibleEntries.length} / {entries.length}</span>
            </div>
            <div className="mistake-story-settings" aria-label="错词故事生成器">
              <div className="mistake-story-settings-head">
                <div>
                  <span className="eyebrow"><BookOpen size={14} />Story Builder</span>
                  <strong>错词小故事</strong>
                  <span>{storySourceLabel} · {storySourceEntries.length} 个词 · {storySettingsSummary}</span>
                </div>
                <button
                  type="button"
                  className="secondary-button compact-button"
                  aria-expanded={storySettingsOpen}
                  onClick={() => setStorySettingsOpen((current) => !current)}
                >
                  <SlidersHorizontal size={16} />
                  设置
                </button>
              </div>
              {storySettingsOpen && (
                <div className="mistake-story-settings-body">
                  <div className="mistake-story-source" role="group" aria-label="故事词源">
                    {storySourceOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={storySourceMode === option.value ? "active" : ""}
                        aria-pressed={storySourceMode === option.value}
                        onClick={() => setStorySourceMode(option.value)}
                      >
                        <span>{option.label}</span>
                        <em>{option.count}</em>
                      </button>
                    ))}
                  </div>
                  <div className="mistake-story-controls">
                    <div className="mistake-story-control-group">
                      <span>难度</span>
                      <div className="mistake-story-segment" role="group" aria-label="故事难度">
                        {storyLevelOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            className={storyLevel === option.value ? "active" : ""}
                            aria-pressed={storyLevel === option.value}
                            onClick={() => setStoryLevel(option.value)}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <label className="mistake-story-select">
                      <span>场景</span>
                      <select value={storyScene} onChange={(event) => setStoryScene(event.target.value as StoryScene)}>
                        {storySceneOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </label>
                    <div className="mistake-story-control-group">
                      <span>篇幅</span>
                      <div className="mistake-story-segment" role="group" aria-label="故事篇幅">
                        {storyLengthOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            className={storyLength === option.value ? "active" : ""}
                            aria-pressed={storyLength === option.value}
                            onClick={() => setStoryLength(option.value)}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <label className="mistake-story-select">
                      <span>语气</span>
                      <select value={storyTone} onChange={(event) => setStoryTone(event.target.value as StoryTone)}>
                        {storyToneOptions.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </label>
                    <label className="mistake-story-toggle">
                      <input
                        type="checkbox"
                        checked={storyBilingual}
                        onChange={(event) => setStoryBilingual(event.target.checked)}
                      />
                      <span>中文翻译</span>
                    </label>
                  </div>
                  <div className="mistake-story-secondary-actions">
                    <button className="text-button" type="button" onClick={() => generate("examples")} disabled={generationStatus !== "idle" || visibleEntries.length === 0}>
                      {generationStatus === "examples" ? <RefreshCw size={15} /> : <FileText size={15} />}
                      生成当前例句
                    </button>
                  </div>
                </div>
              )}
              <div className="mistake-story-footer" aria-live="polite">
                <span>{generationStatus === "story" && isRealModelConfigured ? "正在调用真实模型生成故事" : hasStoryForCurrentSource ? "当前来源已有故事" : `${storySourceEntries.length} 个词待生成`}</span>
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => generate("story", storySourceEntries)}
                  disabled={generationStatus !== "idle" || storySourceEntries.length === 0}
                >
                  {generationStatus === "story" ? <RefreshCw size={17} /> : <Sparkles size={17} />}
                  {generationStatus === "story" ? "生成中" : "生成故事"}
                </button>
              </div>
              {generationError && <p className="mistake-generation-error" role="alert">{generationError}</p>}
              {currentSourceStory && (
                <div className="mistake-story-current" aria-label="当前来源生成的故事">
                  <div className="mistake-story-current-head">
                    <span>当前故事</span>
                    <button className="text-button" type="button" onClick={() => toggleGeneration(currentSourceStory.id)}>
                      {expandedGenerationIds.includes(currentSourceStory.id) ? "收起" : "展开"}
                    </button>
                  </div>
                  {renderGenerationCard(currentSourceStory)}
                </div>
              )}
            </div>
            <div className="mistake-word-list">
              {visibleEntries.length === 0 ? (
                <div className="mistake-filter-empty">
                  <strong>没有匹配的错词</strong>
                  <span>换一个筛选或搜索词，或者回到全部错词继续复盘。</span>
                </div>
              ) : visibleEntries.map((entry) => {
                const insight = entryInsights.get(entry.card.id) ?? getMistakeInsight(entry, data.reviews);
                const primaryWrongAnswer = getPrimaryWrongAnswer(entry);
                const hasTypedWrongAnswer = Boolean(primaryWrongAnswer && primaryWrongAnswer !== "未填写");
                const diffTokens = hasTypedWrongAnswer ? compareLetters(entry.card.front, primaryWrongAnswer) : [];
                const diffSummary = summarizeLetterDiff(diffTokens);
                const diffRows = renderDiffRows(diffTokens);
                const isDiffExpanded = expandedDiffIds.includes(entry.card.id);

                return (
                  <article className="mistake-word-item" key={entry.card.id}>
                    <div className="mistake-word-main">
                      <div>
                        <strong>{entry.card.front}</strong>
                        <span>{entry.card.back || entry.details?.chineseDefinition || "暂无释义"}</span>
                      </div>
                      <span className={`mistake-status-pill ${insight.status}`}>{insight.label}</span>
                    </div>
                    <div className="mistake-word-meta">
                      {entry.details?.phonetic && <em>{entry.details.phonetic}</em>}
                      <span>错 {entry.wrongCount} 次</span>
                      <small>{insight.description}</small>
                    </div>
                    {primaryWrongAnswer && (
                      <div className="mistake-diff-block">
                        <div className="mistake-answer-row">
                          <span>正确：<strong>{entry.card.front}</strong></span>
                          <span>常错：<strong>{primaryWrongAnswer}</strong></span>
                        </div>
                        {hasTypedWrongAnswer ? (
                          <div className="mistake-diff-summary">
                            <div className="mistake-inline-diff" aria-label="拼写差异对照">
                              <div>
                                <span>正确</span>
                                <p>{diffRows.expectedRow}</p>
                              </div>
                              <div>
                                <span>你的</span>
                                <p>{diffRows.answerRow}</p>
                              </div>
                            </div>
                            {diffSummary.changes.length > 0 && (
                              <div className="mistake-diff-chips">
                                {diffSummary.changes.slice(0, 3).map((change) => <span key={change.key}>{change.text}</span>)}
                              </div>
                            )}
                            {diffTokens.length > 0 && (
                              <button type="button" onClick={() => toggleDiff(entry.card.id)}>
                                {isDiffExpanded ? "收起字母对照" : "查看字母对照"}
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="mistake-diff-summary">
                            <strong>这次没有填写答案</strong>
                            <div>
                              <span>先听发音，再尝试完整拼写</span>
                            </div>
                          </div>
                        )}
                        {hasTypedWrongAnswer && isDiffExpanded && <LetterDiffView tokens={diffTokens} />}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>

          <section className="panel mistake-generation-panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow">Generated</span>
                <h2>生成内容</h2>
              </div>
              <span className="panel-count">{generations.length} 条</span>
            </div>
            {generations.length === 0 ? (
              <p className="muted">还没有为这一天生成内容。可以先生成逐词例句，再把全部错词串成一个英文小故事。</p>
            ) : lowerGenerations.length === 0 ? (
              <p className="muted">当前故事已显示在上方 Story Builder 下方。</p>
            ) : (
              <div className="mistake-generation-list">
                {lowerGenerations.map((generation) => renderGenerationCard(generation))}
              </div>
            )}
          </section>
        </div>
      </section>
    </div>
  );
}
