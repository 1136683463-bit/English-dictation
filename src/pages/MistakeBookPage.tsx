import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppData } from "../AppContext";
import AppSelect from "../components/AppSelect";
import EmptyState from "../components/EmptyState";
import {
  MbAlert,
  MbCalendarCheck,
  MbCheck,
  MbCopy,
  MbMastered,
  MbPencil,
  MbRefresh,
  MbSpark,
  MbStory,
  MbTune
} from "../components/MistakeIcons";
import mistakeHero from "../assets/mistake-hero.png";
import LetterDiffView from "../components/LetterDiffView";
import PageHeader from "../components/PageHeader";
import {
  aiService,
  buildStructuredMistakeStoryPrompt,
  MistakeGenerationWord,
  StoryLength,
  StoryLevel,
  StoryScene,
  StoryTone
} from "../services/aiService";
import { compareLetters } from "../services/diffService";
import { getMistakeBookUnit, syncMistakeBookUnit } from "../services/dynamicBookService";
import { findDictionaryEntry, findDictionaryEntryAsync } from "../services/dictionaryService";
import {
  getLocalDateKey,
  getMistakeGenerationsByDate,
  getMistakeGroupsByDate,
  MistakeEntry,
  saveMistakeGeneration
} from "../services/mistakeBookService";
import { DictionaryEntry, LetterDiffToken, MistakeGeneration, MistakeGenerationStoryWordNote, MistakeGenerationWordSnapshot, Review } from "../types";

type GenerationStatus = "idle" | "story";
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
  const [expandedWordIds, setExpandedWordIds] = useState<string[]>([]);
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
  // P1-1 动态错词书：生成/同步入口的反馈消息。
  const [bookSyncMessage, setBookSyncMessage] = useState("");
  const mistakeBookUnit = getMistakeBookUnit(data);

  // P1-1：一键生成/同步「我的错词书」——实体 Unit（书架一等公民），毕业词自动移出。
  const handleSyncMistakeBook = () => {
    if (!mistakeBookUnit && groups.length === 0) {
      setBookSyncMessage("还没有错词可以成书，先去学习产生一些错词吧。");
      return;
    }
    const result = syncMistakeBookUnit(data);
    updateData(() => result.data);
    if (result.created) {
      setBookSyncMessage(`已生成《我的错词书》，收编 ${result.added} 个错词。`);
    } else if (result.added > 0 || result.graduated > 0) {
      setBookSyncMessage(`已同步：新入 ${result.added} 个，毕业 ${result.graduated} 个。`);
    } else {
      setBookSyncMessage("错词书已是最新。");
    }
  };
  const dateListRef = useRef<HTMLDivElement | null>(null);
  const [dateListEdges, setDateListEdges] = useState({ top: false, bottom: false });

  // 左侧计划栏独立滚动：仅在真的可滚动时，于两端显示渐隐提示
  useEffect(() => {
    const list = dateListRef.current;
    if (!list) return;
    const sync = () => {
      const scrollable = list.scrollHeight > list.clientHeight + 2;
      const next = {
        top: scrollable && list.scrollTop > 4,
        bottom: scrollable && list.scrollTop + list.clientHeight < list.scrollHeight - 4
      };
      setDateListEdges((prev) => (prev.top === next.top && prev.bottom === next.bottom ? prev : next));
    };
    sync();
    list.addEventListener("scroll", sync, { passive: true });
    const observer = new ResizeObserver(sync);
    observer.observe(list);
    return () => {
      list.removeEventListener("scroll", sync);
      observer.disconnect();
    };
  }, [groups.length]);

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

  const generate = async (type: Extract<GenerationStatus, "story">, sourceEntries = visibleEntries) => {
    if (!selectedGroup || sourceEntries.length === 0 || generationStatus !== "idle") return;

    setGenerationStatus(type);
    setGenerationError("");

    try {
      const words = buildGenerationWords(sourceEntries);
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

  const toggleWord = (id: string) => {
    setExpandedWordIds((current) =>
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
              <span className="icon-swap" data-state={isTranslationExpanded ? "b" : "a"} aria-hidden="true">
                <span className="icon-slot" data-slot="a"><ChevronRight size={16} /></span>
                <span className="icon-slot" data-slot="b"><ChevronDown size={16} /></span>
              </span>
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
            <MbPencil size={17} />
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
                <MbPencil size={15} />
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
              <span className="icon-swap" data-state={isExpanded ? "b" : "a"} aria-hidden="true">
                <span className="icon-slot" data-slot="a"><ChevronRight size={17} /></span>
                <span className="icon-slot" data-slot="b"><ChevronDown size={17} /></span>
              </span>
            </button>
            <button className="icon-button" type="button" title="复制内容" onClick={() => copyContent(generation.id, generation.content)}>
              <span className="icon-swap" data-state={copiedId === generation.id ? "b" : "a"} aria-hidden="true">
                <span className="icon-slot" data-slot="a"><MbCopy size={17} /></span>
                <span className="icon-slot" data-slot="b"><MbCheck size={17} /></span>
              </span>
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
        description={todayGroup ? `今天已记录 ${todayGroup.attemptCount} 次错误，先处理未掌握词，再生成小故事巩固。` : "按日期复盘错词，快速重练，并把当天错词生成英文小故事。"}
        action={
          <div className="mb-header-actions">
            <button type="button" className="secondary-button compact-button" onClick={handleSyncMistakeBook}>
              {mistakeBookUnit ? "同步错词书" : "生成错词书"}
            </button>
            <Link to="/settings" className="mb-icon-button" aria-label="打开设置">
              <MbTune size={18} />
            </Link>
          </div>
        }
      />

      {bookSyncMessage && (
        <p className="mb-sync-notice" role="status">
          {bookSyncMessage}
          <Link to="/units">去书架看看</Link>
          <button type="button" onClick={() => setBookSyncMessage("")} aria-label="关闭提示">×</button>
        </p>
      )}

      {todayGroup && (
        <section className="mb-focus" aria-label="今日错词焦点">
          <div className="mb-focus-copy">
            <span className="mb-focus-label">Today Focus</span>
            <h2>先把今天的错词收住</h2>
            <p>{todayGroup.mistakeCount} 个错词 · {todayGroup.attemptCount} 次错误 · {getMistakeGenerationsByDate(data, todayKey).length} 条生成内容</p>
          </div>
          <div className="mb-focus-art" aria-hidden="true">
            <span className="mb-focus-script">少犯错&nbsp;&nbsp;多进步</span>
            <img className="mb-focus-art-img" src={mistakeHero} alt="错词本插画：摊开的书与学习气泡" />
          </div>
        </section>
      )}

      <section className="mb-stats" aria-label="错词本摘要">
        <article className="mb-stat" data-tone="amber">
          <header>
            <span className="mb-stat-icon"><MbCalendarCheck size={17} /></span>
            <span className="mb-stat-label">记录天数</span>
          </header>
          <strong>{groups.length}</strong>
          <small>坚持学习，积累更好的自己</small>
        </article>
        <article className="mb-stat" data-tone="green">
          <header>
            <span className="mb-stat-icon"><MbMastered size={17} /></span>
            <span className="mb-stat-label">当天已掌握</span>
          </header>
          <strong>{selectedCompletion}%</strong>
          <small>继续加油，掌握更多词汇</small>
        </article>
        <article className="mb-stat" data-tone="orange">
          <header>
            <span className="mb-stat-icon"><MbAlert size={17} /></span>
            <span className="mb-stat-label">仍易错</span>
          </header>
          <strong>{selectedStats.stubborn}</strong>
          <small>保持状态，稳步前进</small>
        </article>
        <article className="mb-stat" data-tone="purple">
          <header>
            <span className="mb-stat-icon"><MbSpark size={17} /></span>
            <span className="mb-stat-label">已生成</span>
          </header>
          <strong>{data.mistakeGenerations.length}</strong>
          <small>用小故事让记忆更牢固</small>
        </article>
      </section>

      <section className="mistake-book-layout">
        <aside className="ui-surface mistake-date-panel" aria-label="错词日期">
          <div className="mb-panel-head">
            <div className="mb-panel-title">
              <span className="mb-panel-chip"><MbCalendarCheck size={16} /></span>
              <h2>错词计划</h2>
            </div>
            <span className="mb-panel-count">{groups.length} 天</span>
          </div>
          <div className="mb-date-list" ref={dateListRef}>
            <span className={`mb-date-fade top${dateListEdges.top ? " on" : ""}`} aria-hidden="true" />
            {groups.map((group) => {
              const progress = groupProgress.get(group.dateKey);
              const active = group.dateKey === selectedGroup?.dateKey;
              const isToday = group.dateKey === todayKey;
              const dateLabel = isToday ? group.label : group.label.split(" ")[0];
              const weekdayLabel = isToday ? group.dateKey.slice(5) : group.label.split(" ")[1] ?? "";
              return (
                <button
                  key={group.dateKey}
                  type="button"
                  className={`mb-date-card${active ? " on" : ""}`}
                  aria-pressed={active}
                  onClick={() => setSelectedDateKey(group.dateKey)}
                >
                  <span className="mb-date-card-main">
                    <span className="mb-date-card-date">
                      <strong>{dateLabel}</strong>
                      {weekdayLabel && <em>{weekdayLabel}</em>}
                    </span>
                    <span className="mb-date-card-count">{group.mistakeCount} 个错词</span>
                    <span className="mb-date-card-meta">{group.attemptCount} 次错误 · {progress?.completion ?? 0}% 已掌握</span>
                    <span className="mb-date-card-progress" aria-hidden="true">
                      <i style={{ width: `${progress?.completion ?? 0}%` }} />
                    </span>
                    <span className="mb-date-card-badges">
                      {progress && progress.unmastered > 0 && <em>{progress.unmastered} 未掌握</em>}
                      {progress && progress.generationCount > 0 && <em>{progress.generationCount} 生成</em>}
                      {progress?.hasStory && <em>故事</em>}
                    </span>
                  </span>
                  <span className="mb-date-card-arrow" aria-hidden="true">
                    <ChevronRight size={17} />
                  </span>
                </button>
              );
            })}
            <span className={`mb-date-fade bottom${dateListEdges.bottom ? " on" : ""}`} aria-hidden="true" />
          </div>
        </aside>

        <div className="mistake-book-main">
          <section className="ui-surface mistake-word-panel">
            <div className="ui-section-head">
              <div>
                <span className="eyebrow">{selectedGroup?.dateKey}</span>
                <h2>{selectedGroup?.label}错词</h2>
              </div>
            </div>
            {generationError && <p className="mistake-generation-error" role="alert">{generationError}</p>}
            <div className="mb-story" aria-label="错词故事生成器">
              <div className="mb-story-head">
                <div className="mb-story-head-main">
                  <span className="mb-story-head-icon" aria-hidden="true"><MbStory size={22} /></span>
                  <div>
                    <span className="eyebrow"><MbStory size={13} />Story Builder</span>
                    <h3>错词小故事</h3>
                  </div>
                </div>
                <button
                  type="button"
                  className="secondary-button compact-button"
                  aria-expanded={storySettingsOpen}
                  onClick={() => setStorySettingsOpen((current) => !current)}
                >
                  <MbTune size={15} />
                  设置
                </button>
              </div>
              <p className="mb-story-summary">
                {storySourceLabel}：{storySourceEntries.length} 个词 · {storySettingsSummary}
              </p>
              {!hasStoryForCurrentSource && storySourceEntries.length > 0 && (
                <div className="mb-story-invite">
                  <p className="mb-story-invite-text">
                    还没开始 —— 用这 {storySourceEntries.length} 个错词，生成一个属于你的英文小故事。
                  </p>
                  <div className="mb-story-invite-words" aria-label="故事将使用的错词">
                    {storySourceEntries.slice(0, 8).map((entry) => (
                      <span key={`invite-${entry.card.id}`}>{entry.card.front}</span>
                    ))}
                    {storySourceEntries.length > 8 && (
                      <span className="more">+{storySourceEntries.length - 8}</span>
                    )}
                  </div>
                </div>
              )}
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
                      <AppSelect
                        ariaLabel="故事场景"
                        options={storySceneOptions}
                        value={storyScene}
                        onChange={(value) => setStoryScene(value as StoryScene)}
                      />
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
                      <AppSelect
                        ariaLabel="故事语气"
                        options={storyToneOptions}
                        value={storyTone}
                        onChange={(value) => setStoryTone(value as StoryTone)}
                      />
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
                </div>
              )}
              <div className="mb-story-footer" aria-live="polite">
                <span>{generationStatus === "story" && isRealModelConfigured ? "正在调用真实模型生成故事" : hasStoryForCurrentSource ? "当前来源已有故事" : `${storySourceEntries.length} 个词待生成`}</span>
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => generate("story", storySourceEntries)}
                  disabled={generationStatus !== "idle" || storySourceEntries.length === 0}
                >
                  {generationStatus === "story" ? <MbRefresh size={17} /> : <MbSpark size={17} />}
                  {generationStatus === "story" ? "生成中" : "生成故事"}
                </button>
              </div>
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
            <div className="mb-word-list">
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
                const isExpanded = expandedWordIds.includes(entry.card.id);
                // P1-1：毕业标记仅当 graduatedAt 不早于最近一次错误时有效（再次出错自动失效）。
                const isGraduated = Boolean(
                  entry.card.mistakeGraduatedAt && entry.card.mistakeGraduatedAt >= entry.latestWrongAt
                );

                return (
                  <article className={`mb-word${isExpanded ? " expanded" : ""}`} key={entry.card.id}>
                    <button
                      type="button"
                      className="mb-word-row"
                      aria-expanded={isExpanded}
                      onClick={() => toggleWord(entry.card.id)}
                    >
                      <span className="ui-icon ui-icon--red ui-icon--letter mb-word-avatar" aria-hidden="true">
                        {entry.card.front.charAt(0).toUpperCase()}
                      </span>
                      <span className="mb-word-main">
                        <span className="mb-word-title">
                          {entry.card.front}
                          {isGraduated && <em className="mb-word-graduated">已毕业</em>}
                        </span>
                        <span className="mb-word-desc">
                          {[
                            entry.card.back || entry.details?.chineseDefinition || "暂无释义",
                            entry.details?.phonetic,
                            `错 ${entry.wrongCount} 次`,
                            diffSummary.changes.length > 0 ? diffSummary.title : undefined
                          ].filter(Boolean).join(" · ")}
                        </span>
                      </span>
                      <span className={`mb-word-status ${insight.status}`}><i aria-hidden="true" />{insight.label}</span>
                      <span className="mb-word-arrow" aria-hidden="true"><ChevronRight size={17} /></span>
                    </button>
                    {isExpanded && (
                      <div className="mb-word-detail">
                        {primaryWrongAnswer && (
                          <div className="mistake-diff-block mb-diff-card">
                            <div className="mb-diff-head">
                              <div className="mb-diff-cell is-correct">
                                <span>正确拼写</span>
                                <strong>{entry.card.front}</strong>
                              </div>
                              <div className="mb-diff-cell is-wrong">
                                <span>你的答案</span>
                                <strong>{primaryWrongAnswer}</strong>
                              </div>
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
                                  <button type="button" className="mb-diff-toggle" onClick={() => toggleDiff(entry.card.id)} aria-expanded={isDiffExpanded}>
                                    {isDiffExpanded ? "收起字母对照" : "查看字母对照"}
                                    <ChevronDown size={13} />
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
                        <div className="mb-word-detail-actions">
                          <Link
                            className="mb-retry-button"
                            to={`/spelling?mode=mistakes&date=${selectedGroup?.dateKey ?? ""}&cards=${encodeURIComponent(entry.card.id)}`}
                          >
                            <MbPencil size={14} />
                            重练这个词
                          </Link>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
