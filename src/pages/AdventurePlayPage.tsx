import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  History,
  Languages,
  LoaderCircle,
  MessageCircle,
  MoreHorizontal,
  Pause,
  Play,
  RefreshCw,
  Route,
  Square,
  Star,
  Volume2,
  X
} from "lucide-react";
import { type CSSProperties, type MouseEvent as ReactMouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAppData } from "../AppContext";
import { groupAdventureSentences, getReadingProgress, splitAdventureSentences } from "../services/adventureReaderService";
import { findDictionaryEntry, findDictionaryEntryAsync } from "../services/dictionaryService";
import {
  appendAdventureNode,
  getAdventureFavoriteWords,
  getAdventure,
  getAdventurePath,
  getCurrentAdventureNode,
  isAdventureFavoriteWord,
  saveAdventureVocabulary,
  selectAdventureNode,
  toggleAdventureFavoriteWord
} from "../services/adventureService";
import {
  generateAdventureContinuationWithModel,
  generateAdventureContinuationsWithModel,
  generateAdventureSentenceTranslationsWithModel,
  isAiProviderConfigured,
  type AdventureModelNode
} from "../services/adventureModelService";
import {
  pauseSpeaking,
  preloadSpeechAudio,
  resumeSpeaking,
  speakText,
  stopSpeaking,
  type SpeechPlaybackState
} from "../services/speechService";
import type { AdventureNode, AdventureVocabulary, DictionaryEntry } from "../types";

export type AdventureReadingMode = "reveal" | "paired";
export type SentenceTranslationState = "missing" | "loading" | "ready" | "error";

const READING_MODE_KEY = "adventure-reading-mode";
const AUTO_PRELOAD_KEY = "adventure-auto-preload";
const FONT_SCALE_KEY = "adventure-font-scale";
const HINT_DISMISSED_KEY = "adventure-reading-hint-dismissed";

export type ReaderFontScale = "sm" | "md" | "lg";

const FONT_SCALE_VALUES: Record<ReaderFontScale, number> = { sm: 0.88, md: 1, lg: 1.14 };

const readStoredFontScale = (): ReaderFontScale => {
  if (typeof window === "undefined") return "md";
  try {
    const raw = window.localStorage.getItem(FONT_SCALE_KEY);
    return raw === "sm" || raw === "lg" ? raw : "md";
  } catch {
    return "md";
  }
};

const readStoredHintDismissed = () => {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(HINT_DISMISSED_KEY) === "true";
  } catch {
    return false;
  }
};

const writeStoredValue = (key: string, value: string) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // localStorage 不可用时仅保留会话内状态。
  }
};

const readStoredReadingMode = (): AdventureReadingMode => {
  if (typeof window === "undefined") return "reveal";
  try {
    return window.localStorage.getItem(READING_MODE_KEY) === "paired" ? "paired" : "reveal";
  } catch {
    return "reveal";
  }
};

const readStoredAutoPreload = () => {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(AUTO_PRELOAD_KEY) === "true";
  } catch {
    return false;
  }
};

const englishWordPattern = /^[A-Za-z]+(?:['’-][A-Za-z]+)*$/;
const recommendationStopWords = new Set([
  "about", "after", "again", "also", "and", "around", "because", "before", "could", "every", "from", "have", "into", "just", "more", "most", "near", "only", "over", "some", "that", "their", "there", "these", "they", "this", "through", "under", "until", "very", "was", "were", "what", "when", "where", "which", "while", "with", "would", "your", "you"
]);

const renderInteractiveEnglishText = (
  text: string,
  onWordSelect: (word: string, target: HTMLElement) => void
) => text.split(/([A-Za-z]+(?:['’-][A-Za-z]+)*)/g).map((part, index) => {
  if (!englishWordPattern.test(part)) return part;
  return (
    <button
      key={`${part}-${index}`}
      type="button"
      className="adventure-word-button"
      data-adventure-word="true"
      onClick={(event) => {
        event.stopPropagation();
        onWordSelect(part, event.currentTarget);
      }}
      onMouseDown={(event) => event.stopPropagation()}
      aria-label={`查看 ${part} 的释义`}
    >
      {part}
    </button>
  );
});

const renderHighlightedEnglishText = (text: string, highlightedWords: Set<string>) =>
  text.split(/([A-Za-z]+(?:['’-][A-Za-z]+)*)/g).map((part, index) => {
    if (!englishWordPattern.test(part)) return part;
    return highlightedWords.has(part.toLowerCase())
      ? <mark key={`${part}-${index}`} className="adventure-recommended-word">{part}</mark>
      : part;
  });

type SentenceUnitProps = {
  index: number;
  text: string;
  translation?: string;
  isExpanded: boolean;
  isPaired: boolean;
  isPlaying: boolean;
  playbackState: SpeechPlaybackState;
  hasPlaybackError: boolean;
  translationState: SentenceTranslationState;
  translationError: string;
  recommendedWords: Set<string>;
  onSelect: (index: number, target?: HTMLElement) => void;
  onWordSelect: (word: string, target: HTMLElement) => void;
  onClose: () => void;
  popupPosition?: ReturnType<typeof getPopoverPosition>;
  onPlay: (index: number) => void;
  onRetry: () => void;
  cardRef: (element: HTMLElement | null) => void;
};

type AdventureWordPopover = {
  text: string;
  x: number;
  y: number;
  placement: "above" | "below";
  status: "loading" | "ready" | "miss";
  dictionaryEntry?: DictionaryEntry;
  vocabulary?: AdventureVocabulary;
  phraseTranslation?: string;
  breakdown?: Array<{ word: string; translation: string }>;
  isFavorite: boolean;
  isFavoritePending?: boolean;
};

const normalizeEnglishSelection = (value: string) => value.replace(/\s+/g, " ").trim();
const getEnglishWords = (value: string) => value.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) ?? [];
const phraseStopWords = new Set(["a", "an", "the", "and", "or", "but", "to", "of", "in", "on", "at", "for", "with", "from", "as", "is", "are", "was", "were", "your", "you"]);

const cleanDictionaryTranslation = (value: string) => value
  .split(/\r?\n/)[0]
  .replace(/^(?:n|v|a|ad[jv]?|prep|pron|conj|num)\.\s*/i, "")
  .trim();

const getPopoverPosition = (rect: DOMRect) => ({
  x: Math.min(Math.max(rect.left + rect.width / 2, 18), Math.max(18, window.innerWidth - 18)),
  y: rect.top > Math.min(300, window.innerHeight * 0.46)
    ? Math.max(18, rect.top - 12)
    : Math.min(rect.bottom + 12, Math.max(18, window.innerHeight - 18)),
  placement: rect.top > Math.min(300, window.innerHeight * 0.46) ? "above" as const : "below" as const
});

const SentenceUnit = ({
  index,
  text,
  translation,
  isExpanded,
  isPaired,
  isPlaying,
  playbackState,
  hasPlaybackError,
  translationState,
  translationError,
  recommendedWords,
  onSelect,
  onWordSelect,
  onClose,
  popupPosition,
  onPlay,
  onRetry,
  cardRef
}: SentenceUnitProps) => {
  const showDetail = isPaired || isExpanded;
  const isPopup = !isPaired && isExpanded;
  const isLoading = isPlaying && playbackState === "loading";
  const isPaused = isPlaying && playbackState === "paused";
  const isActivelyPlaying = isPlaying && playbackState === "playing";
  const renderText = (value: string) => renderInteractiveEnglishText(value, onWordSelect);

  return (
    <>
      <span
        ref={cardRef}
        id={`adventure-sentence-${index + 1}`}
        className={`adventure-sentence-unit${isExpanded ? " expanded" : ""}${isPlaying ? " playing" : ""}`}
        aria-current={isPlaying ? "true" : undefined}
      >
        <span
          role="button"
          tabIndex={0}
          className="adventure-sentence-trigger"
          onClick={(event) => {
            if (window.getSelection()?.toString().trim()) return;
            onSelect(index);
          }}
          onKeyDown={(event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            onSelect(index);
          }}
          aria-expanded={showDetail}
          aria-controls={`adventure-sentence-detail-${index + 1}`}
        >
          {renderHighlightedEnglishText(text, recommendedWords)}
        </span>
        {isPlaying && <span className="adventure-sentence-inline-status" aria-live="polite">{isLoading ? "加载中" : isPaused ? "已暂停" : "播放中"}</span>}
      </span>{" "}

      {showDetail && (
        <div
          id={`adventure-sentence-detail-${index + 1}`}
          className={`adventure-sentence-detail${isPopup ? " adventure-sentence-detail-popup" : ""}${popupPosition?.placement === "above" ? " above" : ""}`}
          style={isPopup && popupPosition ? { left: popupPosition.x, top: popupPosition.y } : undefined}
          role="region"
          aria-label={`第 ${index + 1} 句详情`}
        >
          <div className="adventure-sentence-detail-copy">
            <div className="adventure-sentence-detail-heading">
              <span className="adventure-sentence-detail-label"><Languages size={14} /> 原文 · 译文</span>
              {isPopup && (
                <div className="adventure-sentence-detail-heading-actions">
                  <button type="button" className="adventure-sentence-play-button" onClick={() => onPlay(index)} disabled={isLoading}>
                    {isLoading ? <LoaderCircle size={15} className="spin" /> : isActivelyPlaying ? <Pause size={15} /> : isPaused ? <Play size={15} /> : <Volume2 size={15} />}
                    {isLoading ? "正在加载" : isActivelyPlaying ? "暂停" : isPaused ? "继续" : "播放这句"}
                  </button>
                  {hasPlaybackError && <span className="adventure-sentence-audio-error" role="alert">在线发音暂不可用</span>}
                  <button type="button" className="icon-button" onClick={onClose} aria-label="关闭句子译文" title="关闭"><X size={15} /></button>
                </div>
              )}
            </div>
            <p className="adventure-sentence-original" lang="en">{renderText(text)}</p>
            {translation ? (
              <p className="adventure-sentence-translation">{translation}</p>
            ) : translationState === "loading" ? (
              <p className="adventure-sentence-message"><LoaderCircle size={16} className="spin" /> 正在生成本章逐句译文…</p>
            ) : translationState === "error" ? (
              <div className="adventure-sentence-error" role="alert">
                <span>{translationError}</span>
                <button type="button" className="text-button" onClick={onRetry}>重试</button>
              </div>
            ) : (
              <div className="adventure-sentence-message">
                <span>这句译文还没有生成。</span>
                <button type="button" className="text-button" onClick={onRetry}>生成本章逐句译文</button>
              </div>
            )}
          </div>
          {!isPopup && (
            <div className="adventure-sentence-actions">
              <button type="button" className="adventure-sentence-play-button" onClick={() => onPlay(index)} disabled={isLoading}>
                {isLoading ? <LoaderCircle size={15} className="spin" /> : isActivelyPlaying ? <Pause size={15} /> : isPaused ? <Play size={15} /> : <Volume2 size={15} />}
                {isLoading ? "正在加载" : isActivelyPlaying ? "暂停" : isPaused ? "继续" : "播放这句"}
              </button>
              {hasPlaybackError && <span className="adventure-sentence-audio-error" role="alert">在线发音暂不可用，请重试</span>}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default function AdventurePlayPage() {
  const { adventureId = "" } = useParams();
  const { data, updateDataAsync, updateData } = useAppData();
  const adventure = getAdventure(data, adventureId);
  const [customAction, setCustomAction] = useState("");
  const [isContinuing, setIsContinuing] = useState(false);
  const [status, setStatus] = useState("");
  const [selectedVocabulary, setSelectedVocabulary] = useState<Set<string>>(new Set());
  const [preloadingChoiceIds, setPreloadingChoiceIds] = useState<Set<string>>(new Set());
  const [isAutoPreloadEnabled, setIsAutoPreloadEnabled] = useState(readStoredAutoPreload);
  const [readingMode, setReadingMode] = useState<AdventureReadingMode>(readStoredReadingMode);
  const [expandedSentenceIndex, setExpandedSentenceIndex] = useState<number | null>(null);
  const [sentencePopupPosition, setSentencePopupPosition] = useState<ReturnType<typeof getPopoverPosition> | null>(null);
  const [lastReadSentenceIndex, setLastReadSentenceIndex] = useState(-1);
  const [translationState, setTranslationState] = useState<SentenceTranslationState>("missing");
  const [translationError, setTranslationError] = useState("");
  const [translationOverrides, setTranslationOverrides] = useState<string[] | null>(null);
  const [playbackState, setPlaybackState] = useState<SpeechPlaybackState>("idle");
  const [playingSentenceIndex, setPlayingSentenceIndex] = useState<number | null>(null);
  const [speechErrorSentenceIndex, setSpeechErrorSentenceIndex] = useState<number | null>(null);
  const [isPlayingChapter, setIsPlayingChapter] = useState(false);
  const [wordPopover, setWordPopover] = useState<AdventureWordPopover | null>(null);
  const [isFavoritePending, setIsFavoritePending] = useState(false);
  const [isVocabOpen, setIsVocabOpen] = useState(false);
  const [fontScale, setFontScale] = useState<ReaderFontScale>(readStoredFontScale);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isHintDismissed, setIsHintDismissed] = useState(readStoredHintDismissed);
  const [previewNodeId, setPreviewNodeId] = useState<string | null>(null);
  const [jumpTarget, setJumpTarget] = useState<AdventureNode | null>(null);
  const realCurrent = adventure ? getCurrentAdventureNode(adventure) : undefined;
  const previewNode = adventure && previewNodeId
    ? adventure.nodes.find((node) => node.id === previewNodeId) ?? null
    : null;
  const current = previewNode ?? realCurrent;
  const isPreviewing = Boolean(previewNode && realCurrent && previewNode.id !== realCurrent.id);
  const currentNodeIdRef = useRef("");
  const translationRequestRef = useRef<Promise<string[]> | null>(null);
  const wordLookupRequestRef = useRef(0);
  const playbackRunRef = useRef(0);
  const playbackResolverRef = useRef<((result: boolean) => void) | null>(null);
  const sentenceRefs = useRef<Record<number, HTMLElement | null>>({});
  const preloadingChoiceIdsRef = useRef<Set<string>>(new Set());
  const preloadedNodesRef = useRef<Record<string, AdventureModelNode>>({});

  const readerSentences = useMemo(() => splitAdventureSentences(current?.englishText ?? ""), [current?.englishText]);
  const sentenceGroups = useMemo(() => groupAdventureSentences(readerSentences), [readerSentences]);
  const currentVocabulary = useMemo(() => current?.vocabulary ?? [], [current]);
  const favoriteWords = useMemo(() => new Set(getAdventureFavoriteWords(data)), [data]);
  const recommendedWords = useMemo(() => {
    const articleWords = getEnglishWords(current?.englishText ?? "").map((word) => word.toLowerCase());
    const wordsInText = new Set(articleWords);
    const candidates = [
      ...Array.from(favoriteWords),
      ...currentVocabulary.map((item) => item.word.trim().toLowerCase())
    ];
    const selected = candidates.filter((word, index) => wordsInText.has(word) && candidates.indexOf(word) === index).slice(0, 7);
    if (selected.length < 3) {
      for (const word of articleWords) {
        if (selected.length >= 3 || selected.includes(word) || word.length < 4 || recommendationStopWords.has(word)) continue;
        selected.push(word);
      }
    }
    return new Set(selected.slice(0, 7));
  }, [current?.englishText, currentVocabulary, favoriteWords]);
  const sentenceTranslations = translationOverrides ?? current?.sentenceTranslations ?? [];
  const hasCompleteTranslations = readerSentences.length > 0 && sentenceTranslations.length === readerSentences.length && sentenceTranslations.every((item) => item.trim());
  const isAiConfigured = isAiProviderConfigured(data.settings.aiProvider);
  const readingProgress = getReadingProgress(lastReadSentenceIndex, readerSentences.length);

  useEffect(() => {
    currentNodeIdRef.current = current?.id ?? "";
    playbackRunRef.current += 1;
    playbackResolverRef.current?.(false);
    playbackResolverRef.current = null;
    stopSpeaking();
    setSelectedVocabulary(new Set());
    setStatus("");
    preloadingChoiceIdsRef.current = new Set();
    setPreloadingChoiceIds(new Set());
    preloadedNodesRef.current = {};
    translationRequestRef.current = null;
    setExpandedSentenceIndex(null);
    setSentencePopupPosition(null);
    setLastReadSentenceIndex(-1);
    setTranslationOverrides(null);
    setTranslationError("");
    setTranslationState(current?.sentenceTranslations?.length === readerSentences.length && readerSentences.length > 0 ? "ready" : "missing");
    setPlaybackState("idle");
    setPlayingSentenceIndex(null);
    setSpeechErrorSentenceIndex(null);
    setIsPlayingChapter(false);
    wordLookupRequestRef.current += 1;
    setWordPopover(null);
    setIsFavoritePending(false);
  }, [current?.id]);

  useEffect(() => {
    try {
      window.localStorage.setItem(READING_MODE_KEY, readingMode);
    } catch {
      // Local preference is optional; private browsing may reject storage writes.
    }
  }, [readingMode]);

  useEffect(() => {
    try {
      window.localStorage.setItem(AUTO_PRELOAD_KEY, String(isAutoPreloadEnabled));
    } catch {
      // Local preference is optional; private browsing may reject storage writes.
    }
  }, [isAutoPreloadEnabled]);

  useEffect(() => () => {
    playbackResolverRef.current?.(false);
    stopSpeaking();
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setWordPopover(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    if (!wordPopover) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest(".adventure-word-popover") || target.closest("[data-adventure-word='true']")) return;
      setWordPopover(null);
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer, true);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer, true);
  }, [wordPopover]);

  useEffect(() => {
    if (expandedSentenceIndex === null || readingMode === "paired") return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (
        target.closest(".adventure-sentence-detail-popup") ||
        target.closest(".adventure-sentence-trigger") ||
        target.closest(".adventure-word-popover") ||
        target.closest("[data-adventure-word='true']")
      ) return;
      setExpandedSentenceIndex(null);
      setSentencePopupPosition(null);
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer, true);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer, true);
  }, [expandedSentenceIndex, readingMode]);

  useEffect(() => {
    if (!current?.id || !readerSentences.length) return;
    const preload = readerSentences.slice(0, 3).map((sentence) => preloadSpeechAudio(sentence, {
      lang: data.settings.speechLang,
      voiceURI: data.settings.speechVoice,
      fallbackToSystem: false,
      fallbackToDictionary: false
    }));
    void Promise.allSettled(preload);
  }, [current?.id, current?.englishText, data.settings.speechLang]);

  useEffect(() => {
    if (lastReadSentenceIndex < 0) return;
    const upcoming = readerSentences.slice(lastReadSentenceIndex + 1, lastReadSentenceIndex + 3);
    void Promise.allSettled(upcoming.map((sentence) => preloadSpeechAudio(sentence, {
      lang: data.settings.speechLang,
      voiceURI: data.settings.speechVoice,
      fallbackToSystem: false,
      fallbackToDictionary: false
    })));
  }, [lastReadSentenceIndex, readerSentences, data.settings.speechLang]);

  useEffect(() => {
    if (expandedSentenceIndex === null) return;
    sentenceRefs.current[expandedSentenceIndex]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [expandedSentenceIndex]);

  useEffect(() => {
    if (!isAutoPreloadEnabled || !current?.id || !isAiConfigured) return;
    void preloadAllChoices();
  }, [current?.id, isAutoPreloadEnabled, isAiConfigured]);

  if (!adventure || !current) return <Navigate to="/adventure" replace />;

  const path = getAdventurePath(adventure);
  const getTranslation = (index: number) => sentenceTranslations[index]?.trim() || undefined;

  const handleRouteNodeClick = (node: AdventureNode) => {
    cancelPlayback();
    if (!realCurrent) return;
    if (node.id === realCurrent.id) {
      setPreviewNodeId(null);
      return;
    }
    const onCurrentPath = path.some((item) => item.id === node.id);
    if (onCurrentPath) {
      // 回到更早的章节会放弃之后的进度，先询问用户意图。
      setJumpTarget(node);
      return;
    }
    setPreviewNodeId(null);
    updateData((latest) => selectAdventureNode(latest, adventureId, node.id));
  };

  const exitPreview = () => {
    cancelPlayback();
    setPreviewNodeId(null);
  };

  const confirmJumpReselect = () => {
    if (!jumpTarget) return;
    setPreviewNodeId(null);
    updateData((latest) => selectAdventureNode(latest, adventureId, jumpTarget.id));
    setJumpTarget(null);
  };

  const openDictionaryPopover = (value: string, rect: DOMRect) => {
    const text = normalizeEnglishSelection(value);
    const words = getEnglishWords(text);
    if (!text || words.length === 0) return;

    const uniqueWords = Array.from(new Set(words.map((word) => word.toLowerCase())));
    const isSingleWord = uniqueWords.length === 1 && words.length === 1;
    const lookupWords = isSingleWord
      ? uniqueWords
      : uniqueWords.filter((word) => !phraseStopWords.has(word));
    const wordsToLookup = lookupWords.length > 0 ? lookupWords : uniqueWords;
    const normalizedWord = words[0]?.toLowerCase() ?? "";
    const vocabulary = isSingleWord
      ? currentVocabulary.find((item) => item.word.toLowerCase() === normalizedWord)
      : undefined;
    const dictionaryEntry = isSingleWord ? findDictionaryEntry(data, words[0]) : undefined;
    const position = getPopoverPosition(rect);
    const requestId = wordLookupRequestRef.current + 1;
    wordLookupRequestRef.current = requestId;

    setWordPopover({
      text,
      x: position.x,
      y: position.y,
      placement: position.placement,
      status: dictionaryEntry || vocabulary ? "ready" : "loading",
      dictionaryEntry,
      vocabulary,
      isFavorite: isSingleWord && isAdventureFavoriteWord(data, normalizedWord)
    });

    void Promise.all(wordsToLookup.map(async (word) => ({
      word,
      entry: await findDictionaryEntryAsync(data, word)
    }))).then((results) => {
      if (wordLookupRequestRef.current !== requestId) return;
      const entries = new globalThis.Map(results.map((result) => [result.word, result.entry]));
      const resolvedEntry = isSingleWord ? entries.get(normalizedWord) ?? dictionaryEntry : undefined;
      const resolvedVocabulary = isSingleWord ? vocabulary : undefined;
      const breakdown = wordsToLookup
        .map((word) => ({
          word,
          translation: cleanDictionaryTranslation(entries.get(word)?.translation ?? currentVocabulary.find((item) => item.word.toLowerCase() === word)?.translation ?? "")
        }))
        .filter((item) => item.translation);
      const phraseTranslation = !isSingleWord && breakdown.length > 0
        ? breakdown.map((item) => item.translation).join(" ")
        : undefined;
      const hasMeaning = Boolean(resolvedEntry?.translation || resolvedVocabulary?.translation || phraseTranslation);

      setWordPopover((current) => current && wordLookupRequestRef.current === requestId
        ? {
            ...current,
            status: hasMeaning ? "ready" : "miss",
            dictionaryEntry: resolvedEntry,
            vocabulary: resolvedVocabulary,
            phraseTranslation,
            breakdown: isSingleWord ? undefined : breakdown
          }
        : current);
    }).catch(() => {
      if (wordLookupRequestRef.current !== requestId) return;
      setWordPopover((current) => current ? { ...current, status: current.dictionaryEntry || current.vocabulary ? "ready" : "miss" } : current);
    });
  };

  const toggleFavorite = async () => {
    if (!wordPopover || getEnglishWords(wordPopover.text).length !== 1 || isFavoritePending) return;
    const word = wordPopover.text.trim();
    const vocabulary = wordPopover.vocabulary;
    setIsFavoritePending(true);
    try {
      const result = await updateDataAsync(async (latest) => toggleAdventureFavoriteWord(latest, {
        word,
        translation: wordPopover.dictionaryEntry?.translation || vocabulary?.translation,
        phonetic: wordPopover.dictionaryEntry?.phonetic,
        partOfSpeech: wordPopover.dictionaryEntry?.partOfSpeech || vocabulary?.partOfSpeech,
        englishDefinition: wordPopover.dictionaryEntry?.definition,
        sourceSentence: vocabulary?.sentence || current.englishText,
        sourceId: `adventure:${adventureId}:${current.id}`,
        adventureId,
        nodeId: current.id
      }));
      setWordPopover((previous) => previous ? { ...previous, isFavorite: result.favorite, isFavoritePending: false } : previous);
      setStatus(result.favorite ? `已收藏 ${word}，可在“冒险积累”词书中复习。` : `已取消收藏 ${word}。`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "收藏操作没有完成，请重试。");
    } finally {
      setIsFavoritePending(false);
    }
  };

  const handleTextSelection = (event: ReactMouseEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) return;
    if (!event.currentTarget.contains(selection.anchorNode) || !event.currentTarget.contains(selection.focusNode)) return;

    const text = normalizeEnglishSelection(selection.toString());
    if (!text || !/[A-Za-z]/.test(text)) return;
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;
    openDictionaryPopover(text.slice(0, 180), rect);
  };

  const ensureTranslations = async () => {
    if (hasCompleteTranslations) return sentenceTranslations;
    if (!isAiConfigured) {
      setTranslationState("error");
      setTranslationError("此历史章节没有逐句译文。请先在设置中配置 AI，再生成译文。");
      return null;
    }
    if (translationRequestRef.current) return translationRequestRef.current;

    const nodeId = current.id;
    setTranslationState("loading");
    setTranslationError("");
    setStatus("正在生成本章逐句译文…");
    const request = generateAdventureSentenceTranslationsWithModel(data.settings.aiProvider, current.englishText)
      .then(async (translations) => {
        if (currentNodeIdRef.current !== nodeId) return translations;
        await updateDataAsync(async (latest) => {
          const latestAdventure = getAdventure(latest, adventureId);
          if (!latestAdventure || !latestAdventure.nodes.some((node) => node.id === nodeId)) throw new Error("找不到当前章节。");
          return {
            data: {
              ...latest,
              adventures: latest.adventures.map((item) => item.id === latestAdventure.id
                ? { ...item, updatedAt: new Date().toISOString(), nodes: item.nodes.map((node) => node.id === nodeId ? { ...node, sentenceTranslations: translations } : node) }
                : item)
            }
          };
        });
        if (currentNodeIdRef.current === nodeId) {
          setTranslationOverrides(translations);
          setTranslationState("ready");
          setStatus("逐句译文已生成并保存。 ");
        }
        return translations;
      })
      .catch((error) => {
        if (currentNodeIdRef.current === nodeId) {
          setTranslationState("error");
          setTranslationError(error instanceof Error ? error.message : "逐句译文生成失败，请重试。");
          setStatus("逐句译文没有生成，请重试。");
        }
        throw error;
      })
      .finally(() => {
        if (translationRequestRef.current === request) translationRequestRef.current = null;
      });
    translationRequestRef.current = request;
    return request;
  };

  const setSentencePopupForIndex = (index: number, target?: HTMLElement) => {
    if (readingMode === "paired") {
      setSentencePopupPosition(null);
      return;
    }
    const trigger = target ?? sentenceRefs.current[index]?.querySelector<HTMLElement>(".adventure-sentence-trigger");
    if (!trigger) return;
    setSentencePopupPosition(getPopoverPosition(trigger.getBoundingClientRect()));
  };

  const handleSentenceSelect = (index: number, target?: HTMLElement) => {
    const isClosing = expandedSentenceIndex === index && readingMode !== "paired";
    setExpandedSentenceIndex((previous) => previous === index ? null : index);
    setLastReadSentenceIndex(index);
    if (isClosing) {
      setSentencePopupPosition(null);
    } else {
      setSentencePopupForIndex(index, target);
    }
  };

  const finishPlayback = (runId: number, result: boolean, sentenceIndex: number) => {
    if (runId !== playbackRunRef.current) return;
    playbackResolverRef.current?.(result);
    playbackResolverRef.current = null;
    setPlaybackState(result ? "idle" : "error");
    setSpeechErrorSentenceIndex(result ? null : sentenceIndex);
    setPlayingSentenceIndex(null);
  };

  const playSentenceAndWait = (index: number, runId: number) => new Promise<boolean>((resolve) => {
    if (runId !== playbackRunRef.current) {
      resolve(false);
      return;
    }
    playbackResolverRef.current = resolve;
    setExpandedSentenceIndex(index);
    setSentencePopupForIndex(index);
    setLastReadSentenceIndex(index);
    setSpeechErrorSentenceIndex(null);
    setPlayingSentenceIndex(index);
    setPlaybackState("loading");
    void speakText(readerSentences[index], {
      lang: data.settings.speechLang,
      rate: data.settings.speechRate,
      voiceURI: data.settings.speechVoice,
      // Keep reading usable when the remote audio host is blocked by the
      // current WebView. Online sentence audio remains the first choice.
      fallbackToSystem: true,
      fallbackToDictionary: false,
      lifecycle: {
        onLoading: () => { if (runId === playbackRunRef.current) setPlaybackState("loading"); },
        onStart: () => { if (runId === playbackRunRef.current) setPlaybackState("playing"); },
        onEnd: () => finishPlayback(runId, true, index),
        onPause: () => { if (runId === playbackRunRef.current) setPlaybackState("paused"); },
        onResume: () => { if (runId === playbackRunRef.current) setPlaybackState("playing"); },
        onSystemFallback: () => { if (runId === playbackRunRef.current) setStatus("在线发音暂不可用，已切换本机语音。"); },
        onError: () => finishPlayback(runId, false, index)
      }
    }).then((played) => {
      if (!played) finishPlayback(runId, false, index);
    });
  });

  const cancelPlayback = () => {
    playbackRunRef.current += 1;
    playbackResolverRef.current?.(false);
    playbackResolverRef.current = null;
    stopSpeaking();
    setIsPlayingChapter(false);
    setPlayingSentenceIndex(null);
    setSpeechErrorSentenceIndex(null);
    setPlaybackState("idle");
  };

  const stepSentence = (direction: -1 | 1) => {
    if (!readerSentences.length) return;
    const currentIndex = playingSentenceIndex ?? expandedSentenceIndex ?? lastReadSentenceIndex;
    const fallbackIndex = direction > 0 ? -1 : readerSentences.length;
    const nextIndex = Math.max(0, Math.min(readerSentences.length - 1, (currentIndex >= 0 ? currentIndex : fallbackIndex) + direction));
    if (nextIndex === currentIndex) return;
    cancelPlayback();
    handleSentenceSelect(nextIndex);
  };

  const playSequenceFrom = async (startIndex: number, runId: number) => {
    setIsPlayingChapter(true);
    let stoppedByError = false;
    for (let index = startIndex; index < readerSentences.length; index += 1) {
      if (runId !== playbackRunRef.current) return;
      const played = await playSentenceAndWait(index, runId);
      if (!played) {
        stoppedByError = true;
        break;
      }
    }
    if (runId === playbackRunRef.current) {
      setIsPlayingChapter(false);
      setPlaybackState(stoppedByError ? "error" : "idle");
      setStatus(stoppedByError ? "在线发音暂不可用，请重试。" : "本章播放完成。");
    }
  };

  const handlePlaySentence = async (index: number) => {
    if (playingSentenceIndex === index && playbackState === "playing") {
      pauseSpeaking();
      return;
    }
    if (playingSentenceIndex === index && playbackState === "paused") {
      resumeSpeaking();
      return;
    }
    cancelPlayback();
    const runId = playbackRunRef.current;
    const played = await playSentenceAndWait(index, runId);
    if (!played && runId === playbackRunRef.current) setStatus("在线发音暂不可用，请稍后重试。");
  };

  const playChapter = async () => {
    if (!readerSentences.length) return;
    cancelPlayback();
    const runId = playbackRunRef.current;
    setStatus("正在连续播放本章…");
    await playSequenceFrom(0, runId);
  };

  const getModelInput = (action: string) => {
    const favorites = new Set(getAdventureFavoriteWords(data));
    return {
      template: adventure.template,
      title: adventure.title,
      level: adventure.level,
      customPrompt: adventure.customPrompt,
      path: getAdventurePath(adventure).map(({ title, englishText, summary }) => ({ title, englishText, summary })),
      action,
      targetWords: Array.from(new globalThis.Map<string, { word: string; translation: string }>([
        ...data.cards.filter((card) => card.type === "word" && favorites.has(card.front.trim().toLowerCase())).map((card) => [card.front.trim().toLowerCase(), { word: card.front, translation: card.back }] as const),
        ...data.cards.filter((card) => card.type === "word").map((card) => [card.front.trim().toLowerCase(), { word: card.front, translation: card.back }] as const)
      ]).values()).slice(0, 12)
    };
  };

  const markPreloading = (choiceIds: string[], active: boolean) => {
    const next = new Set(preloadingChoiceIdsRef.current);
    choiceIds.forEach((choiceId) => active ? next.add(choiceId) : next.delete(choiceId));
    preloadingChoiceIdsRef.current = next;
    setPreloadingChoiceIds(next);
  };

  const cachePreloadedNode = (choiceId: string, node: AdventureModelNode) => {
    preloadedNodesRef.current = { ...preloadedNodesRef.current, [choiceId]: node };
  };

  const preloadAllChoices = async () => {
    if (!isAutoPreloadEnabled || !current.choices.length || !isAiConfigured) return;
    const choices = current.choices.filter((choice) => !preloadedNodesRef.current[choice.id]);
    if (!choices.length) return;
    const nodeId = current.id;
    setStatus(`正在预加载 ${choices.length} 条 AI 路线…`);
    const choiceIds = choices.map((choice) => choice.id);
    markPreloading(choiceIds, true);
    const loaded: string[] = [];
    try {
      const baseInput = getModelInput("");
      const batchInput = {
        ...baseInput,
        choices: choices.map((choice) => ({ choiceId: choice.id, action: choice.promptHint }))
      };
      let continuations;
      let lastError: unknown;
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          continuations = await generateAdventureContinuationsWithModel(data.settings.aiProvider, batchInput);
          lastError = undefined;
          break;
        } catch (error) {
          lastError = error;
          if (attempt === 0) await new Promise((resolve) => window.setTimeout(resolve, 500));
        }
      }
      if (lastError || !continuations) throw lastError instanceof Error ? lastError : new Error("批量预加载失败。");
      if (currentNodeIdRef.current !== nodeId) return;
      continuations.forEach(({ choiceId, node }) => {
        cachePreloadedNode(choiceId, node);
        loaded.push(choiceId);
      });
    } catch (error) {
      if (currentNodeIdRef.current !== nodeId) return;
      const reason = error instanceof Error ? error.message : "未知错误";
      setStatus(`批量 AI 预加载失败：${reason}；点击路线时会使用离线剧情。`);
    } finally {
      markPreloading(choiceIds, false);
    }
    if (currentNodeIdRef.current !== nodeId) return;
    if (loaded.length === choices.length) setStatus(`${loaded.length} 条路线已通过一次 AI 请求预加载完成。`);
  };

  const continueStory = async (choiceId?: string) => {
    if (isContinuing) return;
    cancelPlayback();
    const action = customAction.trim() || current.choices.find((item) => item.id === choiceId)?.promptHint || "Continue the adventure.";
    const preloadedNode = choiceId ? preloadedNodesRef.current[choiceId] : undefined;
    setIsContinuing(true);
    setStatus(preloadedNode
      ? "正在打开已预加载的 AI 章节…"
      : isAiConfigured
        ? "正在请求 AI 续写下一章…"
        : "AI 未启用或配置不完整，正在准备离线章节…");
    try {
      const result = await updateDataAsync(async (latest) => {
        const latestAdventure = getAdventure(latest, adventureId);
        if (!latestAdventure) throw new Error("找不到这段冒险。");
        const latestCurrent = getCurrentAdventureNode(latestAdventure);
        const provider = latest.settings.aiProvider;
        const favoriteWords = new Set(getAdventureFavoriteWords(latest));
        const targetWords = Array.from(new globalThis.Map<string, { word: string; translation: string }>([
          ...latest.cards.filter((card) => card.type === "word" && favoriteWords.has(card.front.trim().toLowerCase())).map((card) => [card.front.trim().toLowerCase(), { word: card.front, translation: card.back }] as const),
          ...latest.cards.filter((card) => card.type === "word").map((card) => [card.front.trim().toLowerCase(), { word: card.front, translation: card.back }] as const)
        ]).values()).slice(0, 12);
        let node = preloadedNode;
        let source: "ai" | "offline" = preloadedNode ? "ai" : "offline";
        const providerReady = isAiProviderConfigured(provider);
        let usedOffline = !providerReady;
        let aiError = "";
        if (!node && providerReady) {
          try {
            node = await generateAdventureContinuationWithModel(provider, {
              template: latestAdventure.template,
              title: latestAdventure.title,
              level: latestAdventure.level,
              customPrompt: latestAdventure.customPrompt,
              path: getAdventurePath(latestAdventure).map(({ title, englishText, summary }) => ({ title, englishText, summary })),
              action,
              targetWords
            });
            source = "ai";
          } catch (error) {
            aiError = error instanceof Error ? error.message : "未知错误";
            if (!provider.fallbackToLocal) throw new Error(`AI 续章失败：${aiError}`);
            usedOffline = true;
          }
        }
        const appended = appendAdventureNode(latest, adventureId, latestCurrent.id, { choiceId, customAction: customAction.trim(), source, node });
        return { ...appended, usedOffline, aiError };
      });
      setCustomAction("");
      if (result.usedOffline) {
        setStatus(result.aiError
          ? `AI 续章失败：${result.aiError}，已切换离线剧情。`
          : "AI 未启用或配置不完整，已使用离线剧情续章。请到设置检查并保存 AI 配置。");
      } else {
        setStatus("AI 新章节已保存。");
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "续章没有完成，请再试一次。");
    } finally {
      setIsContinuing(false);
    }
  };

  const playVocabulary = async (word: string) => {
    const played = await speakText(word, {
      lang: data.settings.speechLang,
      rate: data.settings.speechRate,
      voiceURI: data.settings.speechVoice,
      fallbackToSystem: false,
      fallbackToDictionary: false
    });
    if (!played) setStatus("该词的在线发音暂不可用。");
  };

  const saveVocabulary = async () => {
    const selected = currentVocabulary.filter((item) => selectedVocabulary.has(item.word.toLowerCase()) && !item.cardId);
    if (!selected.length) {
      setStatus("选择还未加入词库的词后再保存。");
      return;
    }
    const result = await updateDataAsync(async (latest) => saveAdventureVocabulary(latest, adventureId, current.id, selected));
    setSelectedVocabulary(new Set());
    setIsVocabOpen(false);
    setStatus(`已加入 ${result.created} 个词${result.merged ? `，合并 ${result.merged} 个已有词` : ""}。`);
  };

  useEffect(() => {
    setPreviewNodeId(null);
    setJumpTarget(null);
  }, [adventureId]);

  useEffect(() => {
    if (!jumpTarget) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setJumpTarget(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jumpTarget]);

  useEffect(() => {
    if (!isSummaryOpen && !isFontMenuOpen && !isMoreMenuOpen) return;
    const closeMenus = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest(".adventure-pop-anchor")) {
        setIsSummaryOpen(false);
        setIsFontMenuOpen(false);
        setIsMoreMenuOpen(false);
      }
    };
    document.addEventListener("click", closeMenus);
    return () => document.removeEventListener("click", closeMenus);
  }, [isSummaryOpen, isFontMenuOpen, isMoreMenuOpen]);

  return (
    <div className="page adventure-play-page adventure-reader-frame">
      <header className="adventure-reader-topbar">
        <Link className="icon-button" to="/adventure" aria-label="返回冒险" title="返回冒险"><ArrowLeft size={18} /></Link>
        <div className="adventure-reader-titlegroup adventure-pop-anchor">
          <div className="adventure-reader-kicker"><span>Chapter {current.chapter}</span><span className={current.source === "ai" ? "ai" : "offline"}>{current.source === "ai" ? "AI 续章" : "离线剧情"}</span></div>
          <div className="adventure-reader-titleline">
            <h1>{current.title}</h1>
            <button
              type="button"
              className={`adventure-summary-toggle${isSummaryOpen ? " open" : ""}`}
              aria-expanded={isSummaryOpen}
              onClick={() => { setIsSummaryOpen((open) => !open); setIsFontMenuOpen(false); setIsMoreMenuOpen(false); }}
            >
              摘要 <ChevronDown size={12} className="adventure-summary-caret" />
            </button>
            {isSummaryOpen && <div className="adventure-summary-pop" role="tooltip">{current.summary}</div>}
          </div>
        </div>

        <div className="adventure-reader-progress" aria-label={`已读 ${Math.max(0, lastReadSentenceIndex + 1)} / ${readerSentences.length} 句`}>
          <div className="adventure-reader-progress-track"><span style={{ width: `${readingProgress}%` }} /></div>
          <div className="adventure-reader-progress-copy"><strong>{Math.max(0, lastReadSentenceIndex + 1)}</strong><span>/ {readerSentences.length} 句</span></div>
        </div>

        <div className="adventure-topbar-controls">
          <div className="adventure-reading-modes" role="group" aria-label="阅读模式">
            <button type="button" className={readingMode === "reveal" ? "active" : ""} onClick={() => { setReadingMode("reveal"); setExpandedSentenceIndex(null); setSentencePopupPosition(null); }}><Languages size={15} />逐句</button>
            <button type="button" className={readingMode === "paired" ? "active" : ""} onClick={() => { setReadingMode("paired"); setExpandedSentenceIndex(null); setSentencePopupPosition(null); }}><BookOpen size={15} />对照</button>
          </div>
          <button
            type="button"
            className="icon-button adventure-sentence-step"
            onClick={() => stepSentence(-1)}
            disabled={!readerSentences.length || lastReadSentenceIndex <= 0}
            aria-label="上一句"
            title="上一句"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="icon-button adventure-sentence-step"
            onClick={() => stepSentence(1)}
            disabled={!readerSentences.length || lastReadSentenceIndex >= readerSentences.length - 1}
            aria-label="下一句"
            title="下一句"
          >
            <ChevronRight size={16} />
          </button>
          {isPlayingChapter ? (
            <>
              <button type="button" className="secondary-button" onClick={() => playbackState === "paused" ? resumeSpeaking() : pauseSpeaking()} aria-label={playbackState === "paused" ? "继续播放" : "暂停播放"} title={playbackState === "paused" ? "继续" : "暂停"}>{playbackState === "paused" ? <Play size={16} /> : <Pause size={16} />}</button>
              <button type="button" className="icon-button" onClick={cancelPlayback} aria-label="停止连续播放" title="停止"><Square size={15} /></button>
            </>
          ) : (
            <button type="button" className="secondary-button" onClick={() => void playChapter()} disabled={!readerSentences.length} title="播放本章"><Play size={16} />播放本章</button>
          )}

          <div className="adventure-pop-anchor">
            <button
              type="button"
              className={`icon-button${isFontMenuOpen ? " active" : ""}`}
              aria-expanded={isFontMenuOpen}
              aria-label="正文字号"
              title="正文字号"
              onClick={() => { setIsFontMenuOpen((open) => !open); setIsSummaryOpen(false); setIsMoreMenuOpen(false); }}
            >
              <span className="adventure-font-glyph">Aa</span>
            </button>
            {isFontMenuOpen && (
              <div className="adventure-topbar-pop" role="menu" aria-label="正文字号">
                {(["sm", "md", "lg"] as ReaderFontScale[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    role="menuitemradio"
                    aria-checked={fontScale === level}
                    className={fontScale === level ? "active" : ""}
                    onClick={() => { setFontScale(level); writeStoredValue(FONT_SCALE_KEY, level); }}
                  >
                    <span className="adventure-font-glyph">{level === "sm" ? "A" : level === "md" ? "A" : "A"}</span>
                    {level === "sm" ? "小" : level === "md" ? "标准" : "大"}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="adventure-pop-anchor">
            <button
              type="button"
              className={`icon-button${isMoreMenuOpen ? " active" : ""}`}
              aria-expanded={isMoreMenuOpen}
              aria-label="更多设置"
              title="更多设置"
              onClick={() => { setIsMoreMenuOpen((open) => !open); setIsSummaryOpen(false); setIsFontMenuOpen(false); }}
            >
              <MoreHorizontal size={17} />
            </button>
            {isMoreMenuOpen && (
              <div className="adventure-topbar-pop adventure-topbar-pop-wide" role="menu" aria-label="更多设置">
                <label className={`adventure-auto-preload-toggle${isAutoPreloadEnabled ? " active" : ""}`} title="打开后自动预加载所有选项的下一章">
                  <input
                    type="checkbox"
                    checked={isAutoPreloadEnabled}
                    onChange={(event) => {
                      const enabled = event.target.checked;
                      setIsAutoPreloadEnabled(enabled);
                      if (enabled && !isAiConfigured) setStatus("自动预加载需要先配置 AI；离线下一章仍可直接打开。");
                      if (!enabled) setStatus("已关闭自动预加载。");
                    }}
                  />
                  <span className="adventure-auto-preload-switch" aria-hidden="true"><i /></span>
                  <span>自动预加载下一章</span>
                </label>
              </div>
            )}
          </div>

          <button
            type="button"
            className={`icon-button adventure-vocab-toggle${isVocabOpen ? " active" : ""}`}
            onClick={() => setIsVocabOpen((open) => !open)}
            aria-label={`本章生词，${currentVocabulary.filter((item) => !item.cardId).length} 个待挑选`}
            title="本章生词"
          >
            <Star size={16} />
            {currentVocabulary.some((item) => !item.cardId) && <span className="adventure-vocab-badge">{currentVocabulary.filter((item) => !item.cardId).length}</span>}
          </button>
        </div>
      </header>

      <div className="adventure-play-layout">
        <main className="adventure-reader-main">
        <div className="adventure-story adventure-reader-story adventure-reader-scroll">
          {isPreviewing && (
            <div className="adventure-preview-banner" role="status">
              <History size={15} />
              <span>正在回看第 {current.chapter} 章「{current.title}」，阅读进度不会改变。</span>
              <button type="button" className="text-button" onClick={exitPreview}>回到当前章节</button>
            </div>
          )}
          {!hasCompleteTranslations && (
            <div className={`adventure-translation-banner ${translationState}`} role="status">
              <div><Languages size={17} /><span>{translationState === "loading" ? "正在生成本章逐句译文…" : translationState === "error" ? translationError : "本章还没有逐句译文。点击句子后可以生成并保存。"}</span></div>
              {translationState !== "loading" && <button type="button" className="text-button" onClick={() => void ensureTranslations().catch(() => undefined)}>{translationState === "error" ? "重试" : "生成译文"}</button>}
            </div>
          )}
          {!isHintDismissed && (
            <div className="adventure-reading-hint">
              <span>{readingMode === "paired" ? "所有译文按句对应显示；译文中的词语可点击查看释义，框选短语查看翻译" : "点击英文句子打开原文与译文；在弹窗内点击词语查看释义，框选短语查看翻译"}</span>
              <button
                type="button"
                className="adventure-hint-dismiss"
                onClick={() => { setIsHintDismissed(true); writeStoredValue(HINT_DISMISSED_KEY, "true"); }}
              >
                不再提示
              </button>
            </div>
          )}
          <div
            className={`adventure-sentence-reader ${readingMode === "paired" ? "paired" : "reveal"}`}
            style={{ "--reader-font-scale": FONT_SCALE_VALUES[fontScale] } as CSSProperties}
            onMouseUp={handleTextSelection}
          >
            {sentenceGroups.map((group, groupIndex) => {
              const groupStart = groupIndex * 3;
              return (
                <section className="adventure-sentence-group" key={`group-${groupIndex}`} aria-label={`阅读段落 ${groupIndex + 1}`}>
                  {group.map((sentence, offset) => {
                    const index = groupStart + offset;
                    return (
                      <SentenceUnit
                        key={`${sentence}-${index}`}
                        index={index}
                        text={sentence}
                        translation={getTranslation(index)}
                        isExpanded={expandedSentenceIndex === index}
                        isPaired={readingMode === "paired"}
                        isPlaying={playingSentenceIndex === index}
                        playbackState={playbackState}
                        hasPlaybackError={speechErrorSentenceIndex === index}
                        translationState={translationState}
                        translationError={translationError}
                        recommendedWords={recommendedWords}
                        onSelect={handleSentenceSelect}
                        onWordSelect={(word, target) => openDictionaryPopover(word, target.getBoundingClientRect())}
                        onClose={() => { setExpandedSentenceIndex(null); setSentencePopupPosition(null); }}
                        popupPosition={sentencePopupPosition ?? undefined}
                        onPlay={(sentenceIndex) => void handlePlaySentence(sentenceIndex)}
                        onRetry={() => void ensureTranslations().catch(() => undefined)}
                        cardRef={(element) => { sentenceRefs.current[index] = element; }}
                      />
                    );
                  })}
                </section>
              );
            })}
          </div>
        </div>

        <section className="adventure-action-dock" aria-label="继续冒险">
          <div className="adventure-next-heading">
            <span className="eyebrow">接下来怎么做</span>
            <span className="adventure-preload-note">
              {isPreviewing ? "回看模式 · 只读" : isAiConfigured ? "AI 路线按需预加载" : "离线下一章已就绪"}
            </span>
          </div>
          <div className="adventure-choice-list">
            {current.choices.map((choice) => (
              <button key={choice.id} type="button" className="adventure-choice" disabled={isPreviewing || isContinuing || preloadingChoiceIds.size > 0} onClick={() => void continueStory(choice.id)}><span><strong>{choice.label}</strong><small>{choice.description}</small></span><ChevronRight size={18} /></button>
            ))}
          </div>
          <div className="adventure-custom-action"><MessageCircle size={17} /><input value={customAction} disabled={isPreviewing} onChange={(event) => setCustomAction(event.target.value.slice(0, 100))} placeholder="或者写下你想做的事" maxLength={100} /><button type="button" className="icon-button" disabled={isPreviewing || !customAction.trim() || isContinuing || preloadingChoiceIds.size > 0} onClick={() => void continueStory()} aria-label="用自定义行动继续" title="继续"><ChevronRight size={18} /></button></div>
          <p className="adventure-live-status" aria-live="polite">{isContinuing && <RefreshCw size={15} className="spin" />}{status}</p>
        </section>
        </main>

        <aside className="adventure-route-panel" aria-label="路线地图">
          <div className="panel-header"><div><span className="eyebrow">Route map</span><h2>已走过的路线</h2></div><Route size={20} /></div>
          <div className="adventure-route-list">{path.map((node, index) => <button key={node.id} type="button" className={`adventure-route-node${!isPreviewing && node.id === current.id ? " current" : ""}${isPreviewing && node.id === previewNodeId ? " previewing" : ""}`} onClick={() => handleRouteNodeClick(node)}><span>{index + 1}</span><div><strong>{node.title}</strong><small>{node.summary}</small></div></button>)}</div>
        </aside>
      </div>

      {isVocabOpen && <button type="button" className="adventure-vocab-backdrop" aria-label="关闭本章生词" onClick={() => setIsVocabOpen(false)} />}
      <aside className={`adventure-vocab-drawer${isVocabOpen ? " visible" : ""}`} aria-label="本章词汇" aria-hidden={!isVocabOpen}>
        <div className="adventure-vocab-heading">
          <div>
            <span className="eyebrow">Chapter words</span>
            <h2>这章想带走什么？</h2>
            <p>挑选真正想复习的词，例句和发音都在这里。</p>
          </div>
          <button type="button" className="icon-button" onClick={() => setIsVocabOpen(false)} aria-label="关闭生词抽屉" title="关闭"><X size={17} /></button>
        </div>
        <div className="adventure-vocab-list">
          {currentVocabulary.map((item) => {
            const normalizedWord = item.word.toLowerCase();
            const checked = selectedVocabulary.has(normalizedWord);
            return (
              <label key={item.word} className={`adventure-vocab-card${item.cardId ? " saved" : ""}`}>
                <div className="adventure-vocab-card-top"><input type="checkbox" checked={Boolean(item.cardId) || checked} disabled={Boolean(item.cardId)} onChange={(event) => setSelectedVocabulary((previous) => { const next = new Set(previous); if (event.target.checked) next.add(normalizedWord); else next.delete(normalizedWord); return next; })} /><strong>{item.word}</strong><button type="button" className="icon-button" onClick={(event) => { event.preventDefault(); void playVocabulary(item.word); }} aria-label={`播放 ${item.word}`} title="播放发音"><Volume2 size={15} /></button>{item.cardId && <em>已加入</em>}</div>
                <small>{item.partOfSpeech} · {item.translation}</small>
                <p>{item.sentence}</p>
              </label>
            );
          })}
        </div>
        <button type="button" className="primary-button adventure-vocab-save" disabled={!Array.from(selectedVocabulary).some((word) => !currentVocabulary.find((item) => item.word.toLowerCase() === word)?.cardId)} onClick={() => void saveVocabulary()}>保存所选词汇</button>
      </aside>

      {jumpTarget && (
        <div className="confirm-overlay" role="presentation" onClick={() => setJumpTarget(null)}>
          <div className="confirm-dialog adventure-jump-dialog" role="alertdialog" aria-modal="true" aria-label="回到之前的章节" onClick={(event) => event.stopPropagation()}>
            <div className="confirm-dialog-icon"><Route size={20} /></div>
            <h2>回到「{jumpTarget.title}」？</h2>
            <p>
              这是第 {jumpTarget.chapter} 章，后面还有 {Math.max(path.length - 1 - path.findIndex((node) => node.id === jumpTarget.id), 1)} 章进度。重新选择会放弃这些内容，只回看则进度保持不变。
            </p>
            <div className="adventure-jump-options">
              <button type="button" className="primary-button adventure-jump-primary" onClick={() => { cancelPlayback(); setPreviewNodeId(jumpTarget.id); setJumpTarget(null); }}>
                只回看，不改进度
              </button>
              <button type="button" className="adventure-jump-danger" onClick={confirmJumpReselect}>
                重选这条路线，放弃之后的章节
              </button>
              <button type="button" className="adventure-jump-cancel" onClick={() => setJumpTarget(null)}>取消</button>
            </div>
          </div>
        </div>
      )}

      {wordPopover && (
        <>
          <aside
            className={`adventure-word-popover ${wordPopover.placement}`}
            style={{ left: wordPopover.x, top: wordPopover.y }}
            role="dialog"
            aria-label={`${wordPopover.text} 的词义`}
          >
            <div className="adventure-word-popover-head">
              <div>
                <span className="adventure-word-popover-kind">{getEnglishWords(wordPopover.text).length > 1 ? "选中短语" : "单词"}</span>
                <strong>{wordPopover.text}</strong>
                {(wordPopover.dictionaryEntry?.phonetic || wordPopover.dictionaryEntry?.partOfSpeech || wordPopover.vocabulary?.partOfSpeech) && (
                  <span>{[wordPopover.dictionaryEntry?.phonetic, wordPopover.dictionaryEntry?.partOfSpeech || wordPopover.vocabulary?.partOfSpeech].filter(Boolean).join(" · ")}</span>
                )}
              </div>
              <div className="adventure-word-popover-actions">
                {getEnglishWords(wordPopover.text).length === 1 && (
                  <button
                    type="button"
                    className={`icon-button adventure-word-favorite-button${wordPopover.isFavorite ? " active" : ""}`}
                    onClick={() => void toggleFavorite()}
                    disabled={isFavoritePending}
                    aria-pressed={wordPopover.isFavorite}
                    aria-label={wordPopover.isFavorite ? `取消收藏 ${wordPopover.text}` : `收藏 ${wordPopover.text}`}
                    title={wordPopover.isFavorite ? "取消收藏" : "收藏到冒险积累"}
                  >
                    <Star size={15} fill={wordPopover.isFavorite ? "currentColor" : "none"} />
                  </button>
                )}
                <button type="button" className="icon-button" onClick={() => void playVocabulary(wordPopover.text)} aria-label={`播放 ${wordPopover.text}`} title="播放发音"><Volume2 size={15} /></button>
                <button type="button" className="icon-button" onClick={() => setWordPopover(null)} aria-label="关闭词义" title="关闭"><X size={15} /></button>
              </div>
            </div>
            <div className="adventure-word-popover-body" aria-live="polite">
              {wordPopover.status === "loading" && <p className="adventure-word-popover-message"><LoaderCircle size={16} className="spin" />正在查找词典释义…</p>}
              {wordPopover.status === "miss" && <p className="adventure-word-popover-message">暂未找到本地释义，可以换一个词或短语再试。</p>}
              {wordPopover.status === "ready" && (
                <>
                  {(wordPopover.dictionaryEntry?.translation || wordPopover.vocabulary?.translation || wordPopover.phraseTranslation) && (
                    <section>
                      <span>中文意思</span>
                      <p className="adventure-word-popover-translation">{wordPopover.dictionaryEntry?.translation || wordPopover.vocabulary?.translation || wordPopover.phraseTranslation}</p>
                    </section>
                  )}
                  {wordPopover.breakdown && wordPopover.breakdown.length > 1 && (
                    <section>
                      <span>词义拆分</span>
                      <div className="adventure-word-popover-breakdown">
                        {wordPopover.breakdown.map((item) => <span key={`${item.word}-${item.translation}`}><strong>{item.word}</strong>{item.translation}</span>)}
                      </div>
                    </section>
                  )}
                  {wordPopover.dictionaryEntry?.definition && (
                    <section>
                      <span>英文释义</span>
                      <p>{wordPopover.dictionaryEntry.definition}</p>
                    </section>
                  )}
                </>
              )}
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
