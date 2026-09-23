import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  CheckSquare,
  FileText,
  Flame,
  FolderInput,
  Gauge,
  Import,
  Languages,
  Layers,
  LetterText,
  MessageSquareQuote,
  PauseCircle,
  RotateCcw,
  Search,
  Settings,
  Sparkles,
  Square,
  Star,
  StarOff,
  Trash2,
  X
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useAppData } from "../AppContext";
import { stripNoteMarkers } from "../services/lessonService";
import AppSelect from "../components/AppSelect";
import ConfirmDialog from "../components/ConfirmDialog";
import LibraryTour from "../components/LibraryTour";
import PageHeader from "../components/PageHeader";
import { Segmented } from "../components/Segmented";
import SpeakButton from "../components/SpeakButton";
import {
  deleteCard,
  deleteCards,
  getSentenceDetails,
  getWordDetails,
  restoreCards,
  setCardsPriority,
  setCardsStatus,
  togglePriority,
  updateCardContent
} from "../services/cardService";
import { getLearningStats, getRecentErrorReviews } from "../services/reviewService";
import { aiService } from "../services/aiService";
import type { WordExplanationResult } from "../services/modelService";
import { assignCardIdsToUnit } from "../services/unitService";
import { downloadTextFile, nowIso } from "../services/storage";
import { appendVocabEvent } from "../services/vocabTelemetry";
import { AppData, Card } from "../types";

type LibraryTypeFilter = "all" | "word" | "phrase" | "sentence" | "material";
type LibraryStatusFilter = "none" | "priority" | "systemFocus" | "due" | "recent" | "suspended";
type LibraryFilter = Exclude<LibraryTypeFilter, "none"> | Exclude<LibraryStatusFilter, "none">;

type RecentRange = "today" | "week" | "month";

const RECENT_RANGE_DAYS: Record<RecentRange, number> = { today: 1, week: 7, month: 30 };
const RECENT_RANGE_LABELS: Record<RecentRange, string> = { today: "今天", week: "本周", month: "本月" };

interface LibraryMaterialItem {
  kind: "material";
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
}

interface LibraryCardItem {
  kind: "card";
  card: Card;
}

type LibraryItem = LibraryCardItem | LibraryMaterialItem;

interface CardUndoSnapshot {
  label: string;
  cardIds: string[];
  cardOrder: string[];
  cards: Card[];
  wordDetails?: AppData["wordDetails"];
  sentenceDetails?: AppData["sentenceDetails"];
  schedules?: AppData["schedules"];
  reviews?: AppData["reviews"];
}

const statusLabel: Record<Card["status"], string> = {
  new: "新卡",
  learning: "学习中",
  review: "复习中",
  mastered: "已掌握",
  suspended: "已暂停"
};

const filterLabels: Record<LibraryFilter, string> = {
  all: "全部",
  word: "单词",
  phrase: "短语",
  sentence: "句子",
  priority: "我的重点",
  systemFocus: "系统关注",
  due: "到期",
  recent: "最近收录",
  material: "材料",
  suspended: "已暂停"
};

const typeFilterKeys: LibraryTypeFilter[] = ["all", "word", "phrase", "sentence", "material"];
const statusFilterKeys: LibraryStatusFilter[] = ["none", "priority", "systemFocus", "due", "recent", "suspended"];
const statusFilterLabels: Record<LibraryStatusFilter, string> = {
  none: "不限状态",
  priority: "我的重点",
  systemFocus: "系统关注",
  due: "到期",
  recent: "最近收录",
  suspended: "已暂停"
};

const isTypeFilterKey = (key: LibraryFilter): key is Exclude<LibraryTypeFilter, "all"> | "all" =>
  key === "all" || key === "word" || key === "phrase" || key === "sentence" || key === "material";

const cardTypeLabel: Record<Card["type"], string> = {
  word: "单词",
  phrase: "短语",
  sentence: "句子"
};

const LIBRARY_PAGE_SIZE = 120;

const formatDateTime = (value: string | null) => {
  if (!value) return "暂无安排";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "时间未知";

  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
};

const isDue = (value: string | null) => Boolean(value && new Date(value) <= new Date());

const getCardIcon = (type: Card["type"]) => {
  if (type === "sentence") return <BookOpen size={16} />;
  if (type === "phrase") return <MessageSquareQuote size={16} />;
  return <LetterText size={18} />;
};

const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`;

export default function LibraryPage() {
  const { data, updateData } = useAppData();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  // 搜索框引用：支持 "/" 与 Cmd/Ctrl+K 快捷键聚焦。
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
      const cmdK = (isMac ? event.metaKey : event.ctrlKey) && event.key.toLowerCase() === "k";
      if ((event.key === "/" && !isTyping) || cmdK) {
        event.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  // 筛选维度拆分：类型（all/word/phrase/sentence/material）与状态（priority/systemFocus/due/recent/suspended）
  // 分离后两个 Segmented 不再互相覆盖，用户可同时选「单词 + 我的重点」。
  const [typeFilter, setTypeFilter] = useState<LibraryTypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<LibraryStatusFilter>("none");
  // 合成 filter：状态筛选非 none 时优先；否则用类型筛选。下游过滤逻辑保持不变。
  const filter: LibraryFilter = statusFilter !== "none" ? statusFilter : typeFilter;
  const setFilter = (key: LibraryFilter) => {
    if (isTypeFilterKey(key)) {
      setTypeFilter(key);
      setStatusFilter("none");
    } else {
      setTypeFilter("all");
      setStatusFilter(key);
    }
  };
  // P0-1 遥测：筛选条件曝光（含首屏默认 all），浏览行为基线。
  useEffect(() => {
    appendVocabEvent({ kind: "library_view", filter, ts: nowIso() });
  }, [filter]);
  const [recentRange, setRecentRange] = useState<RecentRange>("week");
  // R9：材料衍生卡过滤（从材料详情"查看衍生卡片"进入），非空时列表只显示该材料的明确衍生卡。
  const [sourceFilterId, setSourceFilterId] = useState<string | null>(null);
  // R14：材料掌握度维度——在 sourceFilterId 基础上进一步只看该材料未掌握的衍生卡。
  const [sourceFilterUnmastered, setSourceFilterUnmastered] = useState(false);
  const [visibleCount, setVisibleCount] = useState(LIBRARY_PAGE_SIZE);
  const [selectedId, setSelectedId] = useState("");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedCardIds, setSelectedCardIds] = useState<Set<string>>(() => new Set());
  const [bulkUnitId, setBulkUnitId] = useState("");
  const [detailUnitId, setDetailUnitId] = useState("");
  // P1-9 详情面板 Tab：默认"学习"看内容，"管理"承载低频的标星/暂停/单元/编辑/AI/删除。
  type DetailTab = "learn" | "manage";
  const [detailTab, setDetailTab] = useState<DetailTab>("learn");
  // 健康度/洞察默认折叠：词库主任务是找卡→训练，复盘类内容不应抢占首屏视觉。
  const [insightsExpanded, setInsightsExpanded] = useState(false);
  const [bulkMessage, setBulkMessage] = useState("");
  const [undoSnapshot, setUndoSnapshot] = useState<CardUndoSnapshot | null>(null);
  // R13：短语卡片内联编辑草稿（短语没有专属编辑页，在详情面板就地编辑释义/备注/标签）
  const [phraseDraft, setPhraseDraft] = useState<{ cardId: string; back: string; note: string; tags: string } | null>(null);
  // AI 补全（预研）：单词卡释义/助记生成草稿，用户确认后才写回卡片。
  const [aiAssist, setAiAssist] = useState<
    | { cardId: string; status: "loading" }
    | { cardId: string; status: "ready"; result: WordExplanationResult }
    | { cardId: string; status: "error"; message: string }
    | null
  >(null);
  // 破坏性操作确认对话框：用 ConfirmDialog 替代 window.confirm，承载影响面说明。
  type PendingAction =
    | { kind: "bulk-suspend"; count: number }
    | { kind: "bulk-delete"; count: number }
    | { kind: "detail-suspend"; card: Card }
    | { kind: "detail-delete"; card: Card };
  // 异步操作 busy 标记：用于 aria-busy 与半透明遮罩，避免等待期间用户继续点击造成不一致。
  const isAiGenerating = aiAssist?.status === "loading";
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const stats = getLearningStats(data);
  const recentErrors = getRecentErrorReviews(data, 4);
  const activeCards = useMemo(() => data.cards.filter((card) => card.status !== "suspended"), [data.cards]);
  const suspendedCards = useMemo(() => data.cards.filter((card) => card.status === "suspended"), [data.cards]);
  const suspendedCount = suspendedCards.length;
  // R14：每份材料的衍生卡掌握度（已掌握/总数），供材料列表与详情展示。
  const materialMasteryById = useMemo(() => {
    const map = new Map<string, { total: number; mastered: number }>();
    for (const card of data.cards) {
      if (!card.sourceId) continue;
      const entry = map.get(card.sourceId) ?? { total: 0, mastered: 0 };
      entry.total += 1;
      if (card.status === "mastered") entry.mastered += 1;
      map.set(card.sourceId, entry);
    }
    return map;
  }, [data.cards]);
  const wordCount = activeCards.filter((card) => card.type === "word").length;
  const phraseCount = activeCards.filter((card) => card.type === "phrase").length;
  const sentenceCount = activeCards.filter((card) => card.type === "sentence").length;
  const priorityCount = activeCards.filter((card) => card.priority && card.prioritySource !== "system").length;
  // R2 系统关注口径修正：被置位 priority 且非手动标星（含 legacy 无 source）。
  // 删除 lapseCount≥3 兜底——历史 lapse 但未被置位的卡不再算系统关注，
  // 否则康复摘星后会被终身 lapse 立即算回（与 reviewService prioritySystem 同一表达式）。
  const isSystemFocused = (card: Card) => card.priority === true && card.prioritySource !== "manual";
  const recentSince = (range: RecentRange) => Date.now() - RECENT_RANGE_DAYS[range] * 24 * 60 * 60 * 1000;
  const isCreatedWithin = (card: Card, range: RecentRange) => {
    const created = new Date(card.createdAt).getTime();
    return Number.isFinite(created) && created >= recentSince(range);
  };
  const scheduleByCardId = useMemo(() => new Map(data.schedules.map((schedule) => [schedule.cardId, schedule])), [data.schedules]);
  const wordDetailsByCardId = useMemo(
    () => new Map(data.wordDetails.map((details) => [details.cardId, details])),
    [data.wordDetails]
  );
  const sentenceDetailsByCardId = useMemo(
    () => new Map(data.sentenceDetails.map((details) => [details.cardId, details])),
    [data.sentenceDetails]
  );
  const unitById = useMemo(() => new Map(data.units.map((unit) => [unit.id, unit])), [data.units]);
  const materialById = useMemo(() => new Map(data.materials.map((material) => [material.id, material])), [data.materials]);
  const segmentByMaterialId = useMemo(() => {
    const map = new Map<string, typeof data.materialSegments>();
    data.materialSegments.forEach((segment) => {
      map.set(segment.materialId, [...(map.get(segment.materialId) ?? []), segment]);
    });
    map.forEach((segments) => segments.sort((a, b) => a.index - b.index));
    return map;
  }, [data.materialSegments]);

  const allItems = useMemo<LibraryItem[]>(() => {
    const listedCards = filter === "suspended" ? suspendedCards : activeCards;
    const cards = listedCards
      .slice()
      .sort((a, b) =>
        filter === "recent"
          ? b.createdAt.localeCompare(a.createdAt)
          : Number(b.priority) - Number(a.priority) || b.updatedAt.localeCompare(a.updatedAt)
      )
      .map<LibraryCardItem>((card) => ({ kind: "card", card }));
    const materials = filter === "suspended" || filter === "recent"
      ? []
      : data.materials
          .slice()
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .map<LibraryMaterialItem>((material) => ({
            kind: "material",
            id: material.id,
            title: material.title,
            description: material.content.slice(0, 180),
            tags: material.tags,
            createdAt: material.createdAt
          }));

    return [...cards, ...materials];
  }, [activeCards, suspendedCards, data.materials, filter]);

  const filteredItems = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();
    return allItems.filter((item) => {
      if (item.kind === "card") {
        // R9：材料衍生卡过滤优先于常规筛选
        if (sourceFilterId && item.card.sourceId !== sourceFilterId) return false;
        // R14：未掌握模式下排除已掌握卡
        if (sourceFilterId && sourceFilterUnmastered && item.card.status === "mastered") return false;
        const schedule = scheduleByCardId.get(item.card.id);
        const matchesFilter =
          filter === "all" ||
          filter === item.card.type ||
          (filter === "priority" && item.card.priority && item.card.prioritySource !== "system") ||
          (filter === "systemFocus" && isSystemFocused(item.card)) ||
          (filter === "due" && isDue(schedule?.nextReviewAt ?? null)) ||
          (filter === "recent" && isCreatedWithin(item.card, recentRange)) ||
          (filter === "suspended" && item.card.status === "suspended");
        const wordDetails = item.card.type === "word" ? wordDetailsByCardId.get(item.card.id) : undefined;
        const sentenceDetails = item.card.type === "sentence" ? sentenceDetailsByCardId.get(item.card.id) : undefined;
        const searchable = [
          item.card.front,
          item.card.back,
          item.card.note,
          ...item.card.tags,
          wordDetails?.phonetic,
          wordDetails?.partOfSpeech,
          wordDetails?.sourceSentence,
          sentenceDetails?.grammarNote,
          ...(sentenceDetails?.keywords ?? [])
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return matchesFilter && (!normalized || searchable.includes(normalized));
      }

      const searchable = [item.title, item.description, ...item.tags].join(" ").toLowerCase();
      const matchesFilter = !sourceFilterId && (filter === "all" || filter === "material");
      return matchesFilter && (!normalized || searchable.includes(normalized));
    });
  }, [allItems, deferredQuery, filter, recentRange, sourceFilterId, sourceFilterUnmastered, scheduleByCardId, sentenceDetailsByCardId, wordDetailsByCardId]);

  const selectedItem = useMemo(() => {
    if (selectedId) {
      const found = filteredItems.find((item) => (item.kind === "card" ? item.card.id : item.id) === selectedId);
      if (found) return found;
    }
    return filteredItems[0];
  }, [filteredItems, selectedId]);

  // 键盘导航：↑/↓ 在列表项间移动、Esc 退出批量模式。挂在容器上做事件委托。
  const listContainerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const container = listContainerRef.current;
    if (!container) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape" && selectionMode) {
        event.preventDefault();
        clearSelection();
        return;
      }
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      const target = event.target as HTMLElement | null;
      // 焦点在输入框/文本域/按钮（如操作条）时，方向键让位给原生行为。
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable)) return;
      if (filteredItems.length === 0) return;
      event.preventDefault();
      const currentIndex = selectedItem
        ? filteredItems.findIndex((item) => (item.kind === "card" ? item.card.id : item.id) === (selectedItem.kind === "card" ? selectedItem.card.id : selectedItem.id))
        : -1;
      const delta = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex = currentIndex < 0
        ? (delta > 0 ? 0 : filteredItems.length - 1)
        : Math.min(filteredItems.length - 1, Math.max(0, currentIndex + delta));
      const next = filteredItems[nextIndex];
      if (!next) return;
      const nextId = next.kind === "card" ? next.card.id : next.id;
      setSelectedId(nextId);
      // 让新选中项滚入可视区域
      const el = container.querySelector<HTMLElement>(`[data-item-id="${nextId}"]`);
      el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    };
    container.addEventListener("keydown", handler);
    return () => container.removeEventListener("keydown", handler);
  }, [filteredItems, selectedItem, selectionMode]);

  const visibleItems = useMemo(() => filteredItems.slice(0, visibleCount), [filteredItems, visibleCount]);
  const hiddenCount = filteredItems.length - visibleItems.length;
  const selectableCardIds = useMemo(
    () => filteredItems.filter((item): item is LibraryCardItem => item.kind === "card").map((item) => item.card.id),
    [filteredItems]
  );
  const selectedIds = useMemo(() => Array.from(selectedCardIds), [selectedCardIds]);
  const selectedCards = useMemo(
    () => data.cards.filter((card) => selectedCardIds.has(card.id)),
    [data.cards, selectedCardIds]
  );

  useEffect(() => {
    setVisibleCount(LIBRARY_PAGE_SIZE);
  }, [filter, deferredQuery, recentRange]);

  useEffect(() => {
    setSelectedCardIds((current) => {
      const existingIds = new Set(data.cards.map((card) => card.id));
      const next = new Set(Array.from(current).filter((id) => existingIds.has(id)));
      return next.size === current.size ? current : next;
    });
  }, [data.cards]);

  useEffect(() => {
    if (!data.units.some((unit) => unit.id === bulkUnitId)) {
      setBulkUnitId(data.units[0]?.id ?? "");
    }
  }, [bulkUnitId, data.units]);

  // 撤销窗口从 8s 延长到 12s：删除类操作决策时间更长，且现在 toast 有可视进度条，用户能感知剩余时间。
  const BULK_TOAST_DURATION_MS = 12000;
  const [bulkMessageKey, setBulkMessageKey] = useState(0);
  useEffect(() => {
    if (!bulkMessage) return;
    setBulkMessageKey((key) => key + 1);
    const timer = window.setTimeout(() => {
      setBulkMessage("");
      setUndoSnapshot(null);
    }, BULK_TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [bulkMessage, undoSnapshot]);

  useEffect(() => {
    if (selectedItem?.kind === "card") {
      setDetailUnitId(selectedItem.card.unitId ?? data.units[0]?.id ?? "");
    }
    // 切换选中项时丢弃未保存的短语编辑草稿与 AI 草稿，并回到默认 Tab
    setPhraseDraft(null);
    setAiAssist(null);
    setDetailTab("learn");
  }, [data.units, selectedItem]);

  useEffect(() => {
    const materialId = searchParams.get("material");
    if (materialId && data.materials.some((material) => material.id === materialId)) {
      setFilter("material");
      setSelectedId(materialId);
    }
  }, [data.materials, searchParams]);

  const clearSelection = () => {
    setSelectedCardIds(new Set());
    setSelectionMode(false);
  };

  // 清除材料衍生卡过滤时同时退出未掌握模式
  const clearSourceFilter = () => {
    setSourceFilterId(null);
    setSourceFilterUnmastered(false);
  };

  const toggleCardSelection = (cardId: string) => {
    setSelectedCardIds((current) => {
      const next = new Set(current);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  };

  // 当前可见页（分页加载出来的前 visibleCount 条）中的卡片 ID，供"选当前页"使用。
  const visibleCardIds = useMemo(
    () => visibleItems.filter((item): item is LibraryCardItem => item.kind === "card").map((item) => item.card.id),
    [visibleItems]
  );

  const selectCurrentPageCards = () => {
    setSelectedCardIds(new Set(visibleCardIds));
    setSelectionMode(true);
  };

  const selectAllMatchedCards = () => {
    setSelectedCardIds(new Set(selectableCardIds));
    setSelectionMode(true);
  };

  const createCardUndoSnapshot = (
    current: AppData,
    label: string,
    cardIds: string[],
    includeRelatedEntities = false
  ): CardUndoSnapshot => {
    const ids = new Set(cardIds);
    return {
      label,
      cardIds,
      cardOrder: current.cards.map((card) => card.id),
      cards: current.cards.filter((card) => ids.has(card.id)),
      ...(includeRelatedEntities
        ? {
            wordDetails: current.wordDetails.filter((details) => ids.has(details.cardId)),
            sentenceDetails: current.sentenceDetails.filter((details) => ids.has(details.cardId)),
            schedules: current.schedules.filter((schedule) => ids.has(schedule.cardId)),
            reviews: current.reviews.filter((review) => ids.has(review.cardId))
          }
        : {})
    };
  };

  const restoreCardsFromSnapshot = (currentCards: Card[], snapshot: CardUndoSnapshot) => {
    const affectedIds = new Set(snapshot.cardIds);
    const previousOrderIds = new Set(snapshot.cardOrder);
    const cardsById = new Map(
      currentCards.filter((card) => !affectedIds.has(card.id)).map((card) => [card.id, card])
    );
    snapshot.cards.forEach((card) => cardsById.set(card.id, card));

    const orderedCards = snapshot.cardOrder
      .map((cardId) => cardsById.get(cardId))
      .filter((card): card is Card => Boolean(card));
    const newCards = currentCards.filter((card) => !previousOrderIds.has(card.id) && !affectedIds.has(card.id));
    return [...orderedCards, ...newCards];
  };

  const restoreRelatedByCardId = <Item extends { cardId: string }>(
    currentItems: Item[],
    restoredItems: Item[] | undefined,
    affectedIds: Set<string>
  ) => (restoredItems ? [...currentItems.filter((item) => !affectedIds.has(item.cardId)), ...restoredItems] : currentItems);

  const restoreCardUndoSnapshot = (current: AppData, snapshot: CardUndoSnapshot): AppData => {
    const affectedIds = new Set(snapshot.cardIds);
    return {
      ...current,
      cards: restoreCardsFromSnapshot(current.cards, snapshot),
      wordDetails: restoreRelatedByCardId(current.wordDetails, snapshot.wordDetails, affectedIds),
      sentenceDetails: restoreRelatedByCardId(current.sentenceDetails, snapshot.sentenceDetails, affectedIds),
      schedules: restoreRelatedByCardId(current.schedules, snapshot.schedules, affectedIds),
      reviews: restoreRelatedByCardId(current.reviews, snapshot.reviews, affectedIds)
    };
  };

  const runBulkAction = (
    message: string,
    updater: (current: AppData, ids: string[]) => AppData,
    clearAfter = false,
    includeRelatedEntities = false
  ) => {
    if (selectedIds.length === 0) return;
    const ids = selectedIds;
    updateData((current) => {
      setUndoSnapshot(createCardUndoSnapshot(current, message, ids, includeRelatedEntities));
      return updater(current, ids);
    });
    setBulkMessage(message);
    if (clearAfter) clearSelection();
  };

  const runSingleAction = (
    message: string,
    cardIds: string[],
    updater: (current: AppData) => AppData,
    includeRelatedEntities = false
  ) => {
    updateData((current) => {
      setUndoSnapshot(createCardUndoSnapshot(current, message, cardIds, includeRelatedEntities));
      return updater(current);
    });
    setBulkMessage(message);
  };

  const undoLastAction = () => {
    if (!undoSnapshot) return;
    updateData((current) => restoreCardUndoSnapshot(current, undoSnapshot));
    setBulkMessage(`已撤销：${undoSnapshot.label}`);
    setUndoSnapshot(null);
  };

  const exportSelectedCards = () => {
    if (selectedCards.length === 0) return;
    const rows = selectedCards.map((card) =>
      [card.type, card.front, card.back, card.note, card.tags.join(" ")].map(escapeCsv).join(",")
    );
    // R09：依返回值给反馈——此前忽略返回值，文件没生成也说「已导出 N 张」。
    if (!downloadTextFile("library-selection.csv", ["type,front,back,note,tags", ...rows].join("\n"), "text/csv")) {
      setBulkMessage("这次导出没能生成文件（可能是存储被限制或浏览器策略拦截）。可以改用打开网页版导出。");
      return;
    }
    setBulkMessage(
      undoSnapshot
        ? `已导出 ${selectedCards.length} 张卡片。上一个变更仍可撤销。`
        : `已导出 ${selectedCards.length} 张卡片。`
    );
  };

  const getMaterialGeneratedCards = (materialId: string) => {
    const material = materialById.get(materialId);
    const segments = segmentByMaterialId.get(materialId) ?? [];
    const segmentText = segments.map((segment) => segment.text).join("\n").toLowerCase();
    const materialText = [material?.title, material?.content, segmentText].filter(Boolean).join("\n").toLowerCase();

    return activeCards.filter((card) => {
      if (card.sourceId === materialId) return true;
      const wordDetails = card.type === "word" ? getWordDetails(data, card.id) : undefined;
      const sentenceDetails = card.type === "sentence" ? getSentenceDetails(data, card.id) : undefined;
      const candidates = [card.front, wordDetails?.sourceSentence, sentenceDetails?.sentence]
        .filter((value): value is string => Boolean(value && value.trim().length >= 3))
        .map((value) => value.toLowerCase());
      return candidates.some((value) => materialText.includes(value));
    });
  };

  const getCardSourceMatches = (card: Card) => {
    const wordDetails = card.type === "word" ? getWordDetails(data, card.id) : undefined;
    const sentenceDetails = card.type === "sentence" ? getSentenceDetails(data, card.id) : undefined;
    const probes = [card.front, wordDetails?.sourceSentence, sentenceDetails?.sentence]
      .filter((value): value is string => Boolean(value && value.trim().length >= 3))
      .map((value) => value.toLowerCase());

    return data.materials
      .map((material) => {
        const segments = segmentByMaterialId.get(material.id) ?? [];
        const matchedSegments = segments.filter((segment) => {
          const text = segment.text.toLowerCase();
          return probes.some((probe) => text.includes(probe) || probe.includes(text));
        });
        const sourceLinked = card.sourceId === material.id;
        return sourceLinked || matchedSegments.length > 0 ? { material, matchedSegments, exact: sourceLinked } : null;
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .sort((a, b) => Number(b.exact) - Number(a.exact))
      .slice(0, 3);
  };

  // R11 词库健康度：积压率 / 暂停率 / 来源覆盖率 / 近 14 天遗忘率，全部零埋点从现有数据推导。
  const healthMetrics = useMemo(() => {
    const active = activeCards.length;
    const total = data.cards.length;
    const backlogRate = active > 0 ? stats.dueTotal / active : 0;
    const suspendRate = total > 0 ? suspendedCount / total : 0;

    let coveredSegments = 0;
    let totalSegments = 0;
    segmentByMaterialId.forEach((segments, materialId) => {
      const boundCards = activeCards.filter((card) => card.sourceId === materialId);
      segments.forEach((segment) => {
        totalSegments += 1;
        const text = segment.text.toLowerCase();
        const covered = boundCards.some((card) => {
          const probe = card.front.toLowerCase().trim();
          return probe.length >= 3 && text.includes(probe);
        });
        if (covered) coveredSegments += 1;
      });
    });
    // 无句段数据时回退到"有 sourceId 的卡占比"，保证指标始终有语义。
    const sourceRate =
      totalSegments > 0
        ? coveredSegments / totalSegments
        : active > 0
          ? activeCards.filter((card) => card.sourceId).length / active
          : 0;

    const since = Date.now() - 14 * 24 * 60 * 60 * 1000;
    const recentReviews = data.reviews.filter((review) => {
      const time = new Date(review.reviewedAt).getTime();
      return Number.isFinite(time) && time >= since;
    });
    const forgetRate =
      recentReviews.length > 0 ? recentReviews.filter((review) => review.rating <= 2).length / recentReviews.length : 0;

    return { backlogRate, suspendRate, sourceRate, forgetRate };
  }, [activeCards, data.cards.length, data.reviews, segmentByMaterialId, stats.dueTotal, suspendedCount]);

  const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

  // 健康度阈值分级：low-is-bad 用于"覆盖率"（越高越好），high-is-bad 用于积压/暂停/遗忘（越低越好）。
  type HealthLevel = "good" | "warn" | "bad";
  const levelForHighIsBad = (value: number, warn: number, bad: number): HealthLevel =>
    value >= bad ? "bad" : value >= warn ? "warn" : "good";
  const levelForLowIsBad = (value: number, warn: number, bad: number): HealthLevel =>
    value <= bad ? "bad" : value <= warn ? "warn" : "good";

  // 阈值基于通用学习经验的启发值，后续可做成设置项。
  const healthReports = {
    backlog: {
      level: levelForHighIsBad(healthMetrics.backlogRate, 0.3, 0.6),
      advice: healthMetrics.backlogRate >= 0.6
        ? "积压偏高，建议先暂停低优先级卡片，或开启错词专项。"
        : healthMetrics.backlogRate >= 0.3
          ? "开始有积压，今天把到期卡清掉。"
          : "节奏健康，继续保持。"
    },
    suspend: {
      level: levelForHighIsBad(healthMetrics.suspendRate, 0.2, 0.4),
      advice: healthMetrics.suspendRate >= 0.4
        ? "暂停率过高，词库只进不出，建议定期复盘暂停卡是否该恢复或删除。"
        : healthMetrics.suspendRate >= 0.2
          ? "暂停卡开始增多，定期回看一下。"
          : "暂停率健康。"
    },
    source: {
      level: levelForLowIsBad(healthMetrics.sourceRate, 0.5, 0.2),
      advice: healthMetrics.sourceRate <= 0.2
        ? "材料消化率低，收进来的材料没转成卡片，建议从最近一份材料开始补。"
        : healthMetrics.sourceRate <= 0.5
          ? "部分材料还没消化完，可以挑一份继续收词。"
          : "材料消化充分。"
    },
    forget: {
      level: levelForHighIsBad(healthMetrics.forgetRate, 0.2, 0.35),
      advice: healthMetrics.forgetRate >= 0.35
        ? "近两周遗忘率偏高，立刻进入错词专项，把反复错的词先压住。"
        : healthMetrics.forgetRate >= 0.2
          ? "遗忘率有上升趋势，关注最近的错卡。"
          : "记忆保持得不错。"
    }
  };

  const filterStats = {
    all: activeCards.length + data.materials.length,
    word: wordCount,
    phrase: phraseCount,
    sentence: sentenceCount,
    priority: priorityCount,
    systemFocus: activeCards.filter(isSystemFocused).length,
    due: stats.dueTotal,
    recent: activeCards.filter((card) => isCreatedWithin(card, recentRange)).length,
    material: data.materials.length,
    suspended: suspendedCount
  };

  const sections = [
    {
      title: "单词本",
      meta: `${wordCount} 个单词`,
      to: "/words",
      icon: Languages
    },
    {
      title: "句子本",
      meta: `${sentenceCount} 个句子`,
      to: "/sentences",
      icon: BookOpen
    },
    {
      title: "词书",
      meta: `${data.units.length} 本词书`,
      to: "/units",
      icon: Layers
    },
    {
      title: "材料",
      meta: `${data.materials.length} 份材料`,
      to: "/import",
      icon: Import
    }
  ];

  const handleBulkPriority = (priority: boolean) => {
    runBulkAction(
      priority ? `已将 ${selectedIds.length} 张卡片标为重点。` : `已取消 ${selectedIds.length} 张卡片的重点标记。`,
      (current, ids) => setCardsPriority(current, ids, priority)
    );
  };

  const handleBulkSuspend = () => {
    if (selectedIds.length === 0) return;
    setPendingAction({ kind: "bulk-suspend", count: selectedIds.length });
  };
  const confirmBulkSuspend = (count: number) => {
    runBulkAction(
      `已暂停 ${count} 张卡片。`,
      (current, ids) => setCardsStatus(current, ids, "suspended"),
      true
    );
  };

  const handleBulkRestore = () => {
    const count = selectedCards.filter((card) => card.status === "suspended").length;
    if (count === 0) return;
    runBulkAction(
      `已恢复 ${count} 张卡片。`,
      (current, ids) => restoreCards(current, ids),
      true
    );
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setPendingAction({ kind: "bulk-delete", count: selectedIds.length });
  };
  const confirmBulkDelete = (count: number) => {
    runBulkAction(
      `已删除 ${count} 张卡片。`,
      (current, ids) => deleteCards(current, ids),
      true,
      true
    );
  };

  const handleBulkAssignUnit = () => {
    if (!bulkUnitId) return;
    const unit = unitById.get(bulkUnitId);
    runBulkAction(
      `已加入${unit ? `「${unit.title}」` : "所选词书"}。`,
      (current, ids) => assignCardIdsToUnit(current, ids, bulkUnitId)
    );
  };

  const handleDetailAssignUnit = (cardId: string) => {
    if (!detailUnitId) return;
    runSingleAction("已更新词书归属。", [cardId], (current) => assignCardIdsToUnit(current, [cardId], detailUnitId));
  };

  const handleDetailSuspend = (card: Card) => {
    setPendingAction({ kind: "detail-suspend", card });
  };
  const confirmDetailSuspend = (card: Card) => {
    runSingleAction("已暂停该卡片。", [card.id], (current) => setCardsStatus(current, [card.id], "suspended"));
    if (selectedId === card.id) setSelectedId("");
  };

  const handleDetailRestore = (card: Card) => {
    runSingleAction("已恢复该卡片。", [card.id], (current) => restoreCards(current, [card.id]));
    if (selectedId === card.id) setSelectedId("");
  };

  const handleDetailDelete = (card: Card) => {
    setPendingAction({ kind: "detail-delete", card });
  };
  const confirmDetailDelete = (card: Card) => {
    runSingleAction("已删除该卡片。", [card.id], (current) => deleteCard(current, card.id), true);
    if (selectedId === card.id) setSelectedId("");
  };

  const handlePhraseSave = () => {
    if (!phraseDraft) return;
    const tags = phraseDraft.tags
      .split(/[,，\s]+/)
      .map((tag) => tag.trim())
      .filter(Boolean);
    runSingleAction("已保存短语修改。", [phraseDraft.cardId], (current) =>
      updateCardContent(current, phraseDraft.cardId, { back: phraseDraft.back.trim(), note: phraseDraft.note.trim(), tags })
    );
    setPhraseDraft(null);
  };

  // AI 补全（预研）：请求模型生成释义/助记/例句，结果先进入预览草稿。
  const handleAiFill = async (card: Card) => {
    const wordDetails = card.type === "word" ? getWordDetails(data, card.id) : undefined;
    setAiAssist({ cardId: card.id, status: "loading" });
    try {
      const result = await aiService.explainWord(
        { word: card.front, existingTranslation: card.back, sourceSentence: wordDetails?.sourceSentence },
        data.settings
      );
      if (!result) {
        setAiAssist({ cardId: card.id, status: "error", message: "AI 中转站未配置或未启用，请先在「设置」中完成配置并测试连接。" });
        return;
      }
      setAiAssist({ cardId: card.id, status: "ready", result });
    } catch (error) {
      setAiAssist({
        cardId: card.id,
        status: "error",
        message: error instanceof Error ? error.message : "AI 生成失败，请稍后重试。"
      });
    }
  };

  // 只回填空字段：已有释义/备注不覆盖（AI 是补全不是改写）。
  const handleAiFillConfirm = () => {
    if (!aiAssist || aiAssist.status !== "ready") return;
    const card = data.cards.find((item) => item.id === aiAssist.cardId);
    if (!card) {
      setAiAssist(null);
      return;
    }
    const back = card.back.trim() ? undefined : aiAssist.result.translation;
    const noteParts = [
      aiAssist.result.mnemonic,
      aiAssist.result.example ? `例句：${aiAssist.result.example}` : ""
    ].filter(Boolean);
    const note = card.note.trim() || noteParts.length === 0 ? undefined : noteParts.join("\n");
    if (!back && !note) {
      setAiAssist(null);
      return;
    }
    runSingleAction("已写入 AI 生成的释义/助记。", [card.id], (current) =>
      updateCardContent(current, card.id, { back, note })
    );
    setAiAssist(null);
  };

  const renderDetail = () => {
    if (!selectedItem) {
      return (
        <div className="library-detail-empty">
          <strong>没有匹配内容</strong>
          <span>换个关键词，或去添加页收集新的词句和材料。</span>
          <Link to="/add" className="primary-button">
            添加内容
            <ArrowRight size={17} />
          </Link>
        </div>
      );
    }

    if (selectedItem.kind === "material") {
      const material = materialById.get(selectedItem.id);
      const segments = segmentByMaterialId.get(selectedItem.id) ?? [];
      const generatedCards = getMaterialGeneratedCards(selectedItem.id);
      const exactGeneratedCards = generatedCards.filter((card) => card.sourceId === selectedItem.id);
      const inferredGeneratedCards = generatedCards.filter((card) => card.sourceId !== selectedItem.id);
      const unmasteredGeneratedCount = exactGeneratedCards.filter((card) => card.status !== "mastered").length;
      const cardMatchesSegment = (card: Card, segmentText: string) => {
        const wordDetails = card.type === "word" ? getWordDetails(data, card.id) : undefined;
        const sentenceDetails = card.type === "sentence" ? getSentenceDetails(data, card.id) : undefined;
        const probes = [card.front, wordDetails?.sourceSentence, sentenceDetails?.sentence]
          .filter((value): value is string => Boolean(value && value.trim().length >= 3))
          .map((value) => value.toLowerCase());
        return probes.some((probe) => segmentText.includes(probe) || probe.includes(segmentText));
      };
      const matchedSegmentIds = new Set(
        segments
          .filter((segment) =>
            exactGeneratedCards.some((card) => cardMatchesSegment(card, segment.text.toLowerCase()))
          )
          .map((segment) => segment.id)
      );
      const untouchedSegments = segments.filter((segment) => !matchedSegmentIds.has(segment.id));

      return (
        <div className="library-detail-stack">
          <div className="library-detail-title">
            <span className="eyebrow">Material</span>
            <h2>{selectedItem.title}</h2>
            <p>{selectedItem.description || "这份材料暂时没有正文预览。"}</p>
          </div>
          <div className="library-detail-meta">
            <span>创建 {formatDateTime(selectedItem.createdAt)}</span>
            <span>{selectedItem.tags.length || 0} 个标签</span>
            <span>{segments.length} 个句段</span>
            <span>{exactGeneratedCards.length} 张明确卡片</span>
            {exactGeneratedCards.length > 0 && (
              <span>掌握 {exactGeneratedCards.length - unmasteredGeneratedCount}/{exactGeneratedCards.length}</span>
            )}
            {inferredGeneratedCards.length > 0 && <span>{inferredGeneratedCards.length} 张可能卡片</span>}
          </div>
          {selectedItem.tags.length > 0 && (
            <div className="tag-row">
              {selectedItem.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          )}

          <div className="material-trace-grid">
            <div>
              <span>明确绑定卡片</span>
              <strong>{exactGeneratedCards.length}</strong>
              <small>{exactGeneratedCards.length > 0 ? exactGeneratedCards.slice(0, 4).map((card) => card.front).join(" · ") : "新收录词句会自动绑定这份材料"}</small>
            </div>
            <div>
              <span>未处理片段</span>
              <strong>{untouchedSegments.length}</strong>
              <small>{untouchedSegments.length > 0 ? "可回到添加页继续收词、收句" : "这份材料的句段已经基本处理过"}</small>
            </div>
          </div>

          {segments.length > 0 && (
            <div className="material-segment-list">
              {segments.slice(0, 6).map((segment) => {
                const segmentText = segment.text.toLowerCase();
                const linkedCards = exactGeneratedCards.filter((card) => cardMatchesSegment(card, segmentText));
                const inferredCards = inferredGeneratedCards.filter((card) => cardMatchesSegment(card, segmentText));

                return (
                  <article key={segment.id} className={linkedCards.length > 0 ? "is-processed" : inferredCards.length > 0 ? "is-inferred" : ""}>
                    <span>#{segment.index + 1}</span>
                    <p>{segment.text}</p>
                    <em>
                      {linkedCards.length > 0
                        ? `${linkedCards.length} 张明确卡片`
                        : inferredCards.length > 0
                          ? `${inferredCards.length} 张可能卡片`
                          : "未处理"}
                    </em>
                  </article>
                );
              })}
            </div>
          )}

          <div className="button-row">
            <Link to="/import" className="primary-button">
              {material ? "继续处理材料" : "打开材料"}
              <ArrowRight size={17} />
            </Link>
            {exactGeneratedCards.length > 0 && (
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  // R9 双向导航：材料 → 衍生卡片（按 sourceId 过滤词库列表）
                  setSourceFilterId(selectedItem.id);
                  setSourceFilterUnmastered(false);
                  setFilter("all");
                  setSelectedId("");
                }}
              >
                查看 {exactGeneratedCards.length} 张衍生卡片
              </button>
            )}
            {unmasteredGeneratedCount > 0 && (
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  // R14：材料 → 未掌握衍生卡（在衍生卡过滤上叠加未掌握条件）
                  setSourceFilterId(selectedItem.id);
                  setSourceFilterUnmastered(true);
                  setFilter("all");
                  setSelectedId("");
                }}
              >
                只看未掌握 {unmasteredGeneratedCount} 张
              </button>
            )}
            <Link to="/training" className="secondary-button">去训练</Link>
          </div>
        </div>
      );
    }

    const card = selectedItem.card;
    const schedule = scheduleByCardId.get(card.id);
    const unit = card.unitId ? unitById.get(card.unitId) : undefined;
    const wordDetails = card.type === "word" ? getWordDetails(data, card.id) : undefined;
    const sentenceDetails = card.type === "sentence" ? getSentenceDetails(data, card.id) : undefined;
    const audioUrl = wordDetails?.audioUrl ?? sentenceDetails?.audioUrl;
    const detailLink = card.type === "sentence" ? "/sentences" : "/words";
    // R5 定向训练闭环：携带 cardId 与来源，训练页只练这张卡，完成后可返回词库。
    const practiceLink =
      card.type === "word"
        ? `/spelling?cards=${encodeURIComponent(card.id)}&from=library`
        : `/review?cards=${encodeURIComponent(card.id)}&from=library`;
    const canDeepEdit = card.type !== "phrase";
    const sourceMatches = getCardSourceMatches(card);
    const systemFocused = isSystemFocused(card);

    return (
      <div className="library-detail-stack">
        <div className="library-detail-scroll">
          <div className="library-detail-title">
            <span className="eyebrow">{cardTypeLabel[card.type]}</span>
            <div className="library-detail-heading">
              <h2>{card.front}</h2>
              <SpeakButton text={card.front} audioUrl={audioUrl} />
            </div>
            {card.back && <p>{card.back}</p>}
          </div>

          <div className="library-detail-meta">
            <span>{statusLabel[card.status]}</span>
            {card.priority && card.prioritySource !== "system" && <span>我的重点</span>}
            {systemFocused && <span title="因多次遗忘被系统关注">系统关注</span>}
            <span>下次 {formatDateTime(schedule?.nextReviewAt ?? null)}</span>
            {unit && <span>{unit.title}</span>}
          </div>

          <div className="library-detail-tabs" role="tablist" aria-label="详情面板分区">
            <button
              type="button"
              role="tab"
              aria-selected={detailTab === "learn"}
              className={detailTab === "learn" ? "active" : ""}
              onClick={() => setDetailTab("learn")}
            >
              学习
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={detailTab === "manage"}
              className={detailTab === "manage" ? "active" : ""}
              onClick={() => setDetailTab("manage")}
            >
              管理
            </button>
          </div>

          {detailTab === "learn" && (
            <>
              {wordDetails && (wordDetails.phonetic || wordDetails.partOfSpeech) && (
                <div className="library-detail-fields">
                  {wordDetails.phonetic && <div><span>音标</span><strong>{wordDetails.phonetic}</strong></div>}
                  {wordDetails.partOfSpeech && <div><span>词性</span><strong>{wordDetails.partOfSpeech}</strong></div>}
                </div>
              )}

              {wordDetails && (wordDetails.englishDefinition || wordDetails.collocations) && (
                <details className="library-detail-more">
                  <summary>更多信息</summary>
                  <div className="library-detail-fields">
                    {wordDetails.englishDefinition && <div><span>英文解释</span><strong>{wordDetails.englishDefinition}</strong></div>}
                    {wordDetails.collocations && <div><span>搭配</span><strong>{wordDetails.collocations}</strong></div>}
                  </div>
                </details>
              )}

              {sentenceDetails && sentenceDetails.keywords.length > 0 && (
                <div className="library-detail-fields">
                  <div><span>关键词</span><strong>{sentenceDetails.keywords.join(" · ")}</strong></div>
                </div>
              )}

              {sentenceDetails?.grammarNote && (
                <details className="library-detail-more">
                  <summary>语法/备注</summary>
                  <div className="library-detail-fields">
                    <div><span>语法/备注</span><strong>{stripNoteMarkers(sentenceDetails.grammarNote)}</strong></div>
                  </div>
                </details>
              )}

              {wordDetails?.sourceSentence && (
                <p className="source-sentence">
                  <BookOpen size={15} />
                  <span>{wordDetails.sourceSentence}</span>
                </p>
              )}

              {sourceMatches.length > 0 && (
                <div className="source-trace-list" aria-label="来源语境">
                  <span className="eyebrow">Source Trace</span>
                  {sourceMatches.map((match) => (
                    // R9 双向导航：卡片 → 材料原文（跳转该材料的详情视图）
                    <Link
                      key={match.material.id}
                      to={`/library?material=${encodeURIComponent(match.material.id)}`}
                      className="source-trace-link"
                      onClick={() => clearSourceFilter()}
                    >
                      <article className={match.exact ? "is-exact" : ""}>
                        <strong>
                          {match.material.title}
                          <em>{match.exact ? "明确来源" : "可能来源"}</em>
                        </strong>
                        <p>{match.matchedSegments[0]?.text ?? "这张卡片显式关联到该材料。"}</p>
                      </article>
                    </Link>
                  ))}
                </div>
              )}

              {card.tags.length > 0 && (
                <div className="tag-row">
                  {card.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              )}
            </>
          )}

          {detailTab === "manage" && (
        <div className="library-management-panel">
          <div>
            <span className="eyebrow">Manage</span>
            <strong>轻量管理</strong>
          </div>
          <div className="button-row">
            <button className="secondary-button" type="button" onClick={() => runSingleAction(card.priority ? "已取消重点标记。" : "已标为重点。", [card.id], (current) => togglePriority(current, card.id))}>
              <span className="icon-swap" data-state={card.priority ? "b" : "a"} aria-hidden="true">
                <span className="icon-slot" data-slot="a"><Star size={17} /></span>
                <span className="icon-slot" data-slot="b"><StarOff size={17} /></span>
              </span>
              {card.priority ? "取消重点" : "标为重点"}
            </button>
            {card.status === "suspended" ? (
              <button className="secondary-button" type="button" onClick={() => handleDetailRestore(card)}>
                <RotateCcw size={17} />
                恢复
              </button>
            ) : (
              <button className="warning-button" type="button" onClick={() => handleDetailSuspend(card)}>
                <PauseCircle size={17} />
                暂停
              </button>
            )}
          </div>
          {data.units.length > 0 && (
            <div className="library-unit-picker">
              <AppSelect
                ariaLabel="选择要加入的词书"
                options={data.units.map((item) => ({ value: item.id, label: item.title }))}
                value={detailUnitId}
                onChange={setDetailUnitId}
              />
              <button className="secondary-button" type="button" onClick={() => handleDetailAssignUnit(card.id)}>
                <FolderInput size={17} />
                加入词书
              </button>
            </div>
          )}
          {card.type === "phrase" && (
            phraseDraft?.cardId === card.id ? (
              <div className="library-phrase-editor">
                <label>
                  释义
                  <textarea
                    value={phraseDraft.back}
                    rows={2}
                    onChange={(event) => setPhraseDraft({ ...phraseDraft, back: event.target.value })}
                  />
                </label>
                <label>
                  备注
                  <input
                    value={phraseDraft.note}
                    onChange={(event) => setPhraseDraft({ ...phraseDraft, note: event.target.value })}
                  />
                </label>
                <label>
                  标签（逗号或空格分隔）
                  <input
                    value={phraseDraft.tags}
                    onChange={(event) => setPhraseDraft({ ...phraseDraft, tags: event.target.value })}
                  />
                </label>
                <div className="button-row">
                  <button type="button" className="primary-button" onClick={handlePhraseSave}>
                    保存
                  </button>
                  <button type="button" className="secondary-button" onClick={() => setPhraseDraft(null)}>
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="secondary-button"
                onClick={() => setPhraseDraft({ cardId: card.id, back: card.back, note: card.note, tags: card.tags.join(", ") })}
              >
                编辑短语
              </button>
            )
          )}
          {card.type === "word" && (!card.back.trim() || !card.note.trim()) && (
            <div className="library-ai-assist">
              {aiAssist?.cardId === card.id && aiAssist.status === "loading" ? (
                <div className="library-ai-skeleton" role="status" aria-label="AI 正在生成释义与助记">
                  <span className="library-ai-skeleton-line" />
                  <span className="library-ai-skeleton-line short" />
                  <span className="library-ai-skeleton-line" />
                  <span className="library-ai-skeleton-hint">
                    <Sparkles size={14} aria-hidden="true" />
                    AI 生成中，请稍候…
                  </span>
                </div>
              ) : aiAssist?.cardId === card.id && aiAssist.status === "ready" ? (
                <>
                  <div className="library-ai-preview">
                    <strong>AI 建议（确认后写回卡片）</strong>
                    <span>释义：{aiAssist.result.translation}</span>
                    {aiAssist.result.mnemonic && <span>助记：{aiAssist.result.mnemonic}</span>}
                    {aiAssist.result.example && <span>{aiAssist.result.example}</span>}
                  </div>
                  <div className="button-row">
                    <button type="button" className="primary-button" onClick={handleAiFillConfirm}>
                      写入卡片
                    </button>
                    <button type="button" className="secondary-button" onClick={() => setAiAssist(null)}>
                      放弃
                    </button>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => handleAiFill(card)}
                >
                  <Sparkles size={16} />
                  AI 补全释义/助记
                </button>
              )}
              {aiAssist?.cardId === card.id && aiAssist.status === "error" && (
                <p className="library-ai-error">{aiAssist.message}</p>
              )}
            </div>
          )}
          <button className="danger-button" type="button" onClick={() => handleDetailDelete(card)}>
            <Trash2 size={17} />
            删除卡片
          </button>
        </div>
          )}
        </div>

        <div className="library-detail-cta">
          <Link to={practiceLink} className="primary-button">
            进入训练
            <ArrowRight size={17} />
          </Link>
          {canDeepEdit && (
            <Link to={detailLink} className="secondary-button">
              完整编辑
            </Link>
          )}
        </div>
      </div>
    );
  };

  const pendingDialog = (() => {
    if (!pendingAction) return null;
    const close = () => setPendingAction(null);
    if (pendingAction.kind === "bulk-suspend") {
      return (
        <ConfirmDialog
          open
          title={`暂停 ${pendingAction.count} 张卡片？`}
          message="这些卡片不会进入日常复习，但数据会保留，可随时在「已暂停」筛选里恢复。"
          confirmLabel={`暂停 ${pendingAction.count} 张`}
          confirmTone="primary"
          onConfirm={() => { confirmBulkSuspend(pendingAction.count); close(); }}
          onCancel={close}
        />
      );
    }
    if (pendingAction.kind === "bulk-delete") {
      return (
        <ConfirmDialog
          open
          title={`删除 ${pendingAction.count} 张卡片？`}
          message="将同时删除这些卡片的复习记录与学习计划。删除后可在提示条中立即撤销。"
          confirmLabel={`删除 ${pendingAction.count} 张`}
          onConfirm={() => { confirmBulkDelete(pendingAction.count); close(); }}
          onCancel={close}
        />
      );
    }
    if (pendingAction.kind === "detail-suspend") {
      const card = pendingAction.card;
      return (
        <ConfirmDialog
          open
          title={`暂停「${card.front}」？`}
          message="它不会进入日常复习，但数据会保留，可随时在「已暂停」筛选里恢复。"
          confirmLabel="暂停"
          confirmTone="primary"
          onConfirm={() => { confirmDetailSuspend(card); close(); }}
          onCancel={close}
        />
      );
    }
    const card = pendingAction.card;
    return (
      <ConfirmDialog
        open
        title={`删除「${card.front}」？`}
        message="将同时删除该卡片的复习记录与学习计划。删除后可在提示条中立即撤销。"
        confirmLabel="删除"
        onConfirm={() => { confirmDetailDelete(card); close(); }}
        onCancel={close}
      />
    );
  })();

  return (
    <div className="page library-page">
      {pendingDialog}
      <LibraryTour hasData={data.cards.length > 0 || data.materials.length > 0} />
      <PageHeader
        eyebrow="Library"
        title="管理你的个人语料库"
        description="在一个工作区里搜索单词、短语、句子、重点项和材料；深度编辑仍保留在原页面。"
        action={
          <Link to="/settings" className="secondary-button">
            <Settings size={17} />
            设置与导出
          </Link>
        }
      />

      <section className="library-metadata" aria-label="词库摘要与深度入口">
        <div className="library-metadata-stats">
          <span>单词 <strong>{wordCount}</strong></span>
          <span>短语 <strong>{phraseCount}</strong></span>
          <span>句子 <strong>{sentenceCount}</strong></span>
          <span className={stats.dueTotal > 0 ? "is-alert" : ""}>到期 <strong>{stats.dueTotal}</strong></span>
          <span>重点 <strong>{priorityCount}</strong></span>
          <span>暂停 <strong>{suspendedCount}</strong></span>
        </div>
        <nav className="library-metadata-links" aria-label="深度管理入口">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.title} to={section.to}>
                <Icon size={14} />
                <span>{section.title}</span>
              </Link>
            );
          })}
        </nav>
      </section>

      <section className="library-workspace">
        <div className="panel library-browser-panel">
          <div className="library-toolbar">
            <div className="search-box library-search library-search-hero">
              <Search size={19} />
              <input
                ref={searchInputRef}
                aria-label="搜索词库内容（按 / 或 Ctrl/⌘+K 快速聚焦）"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索单词、短语、句子、释义、标签或来源句（/ 快速聚焦）"
              />
              {query && (
                <button
                  type="button"
                  className="library-search-clear"
                  aria-label="清空搜索"
                  onClick={() => {
                    setQuery("");
                    searchInputRef.current?.focus();
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="library-filter-rows">
              <div className="library-filter-row">
                <span className="library-filter-label">类型</span>
                <Segmented
                  className="library-filter"
                  ariaLabel="按类型筛选"
                  value={typeFilter}
                  onChange={(key) => { setTypeFilter(key as LibraryTypeFilter); clearSourceFilter(); }}
                  items={typeFilterKeys.map((key) => ({
                    key,
                    label: (
                      <>
                        {filterLabels[key]}
                        <span>{filterStats[key]}</span>
                      </>
                    ),
                  }))}
                />
              </div>
              <div className="library-filter-row">
                <span className="library-filter-label">状态</span>
                <Segmented
                  className="library-filter library-filter-status"
                  ariaLabel="按状态筛选"
                  value={statusFilter}
                  onChange={(key) => { setStatusFilter(key as LibraryStatusFilter); clearSourceFilter(); }}
                  items={statusFilterKeys.map((key) => ({
                    key,
                    label: key === "none"
                      ? statusFilterLabels[key]
                      : (
                        <>
                          {statusFilterLabels[key]}
                          <span>{filterStats[key]}</span>
                        </>
                      ),
                  }))}
                />
              </div>
              {statusFilter === "recent" && (
                <div className="library-filter-row">
                  <span className="library-filter-label">范围</span>
                  <Segmented
                    className="library-recent-range"
                    ariaLabel="收录时间范围"
                    value={recentRange}
                    onChange={(key) => setRecentRange(key as RecentRange)}
                    items={(Object.keys(RECENT_RANGE_LABELS) as RecentRange[]).map((range) => ({
                      key: range,
                      label: RECENT_RANGE_LABELS[range],
                    }))}
                  />
                </div>
              )}
            </div>
          </div>

          {sourceFilterId && (
            <div className="library-action-toast" role="status">
              <span>
                {sourceFilterUnmastered
                  ? `只看「${materialById.get(sourceFilterId)?.title ?? "该材料"}」未掌握的衍生卡片`
                  : `只看「${materialById.get(sourceFilterId)?.title ?? "该材料"}」的衍生卡片`}
              </span>
              <button type="button" className="secondary-button" onClick={() => clearSourceFilter()}>
                <X size={15} />
                清除
              </button>
            </div>
          )}

          <div className="library-result-summary">
            <strong>{filteredItems.length}</strong>
            <span>个匹配结果</span>
            <span>{selectableCardIds.length} 张可批量处理卡片</span>
            {query.trim() && <em>搜索：{query.trim()}</em>}
            <button
              type="button"
              className="library-selection-toggle"
              onClick={() => {
                setSelectionMode((current) => !current);
                if (selectionMode) setSelectedCardIds(new Set());
              }}
            >
              {selectionMode ? <X size={15} /> : <CheckSquare size={15} />}
              {selectionMode ? "退出选择" : "批量选择"}
            </button>
          </div>

          {selectionMode && (
            <div className="library-bulk-bar" role="region" aria-label="批量操作">
              <div>
                <strong>{selectedCardIds.size}</strong>
                <span>
                  已选择卡片
                  {selectableCardIds.length > 0 && selectedCardIds.size < selectableCardIds.length && (
                    <em className="library-bulk-scope-hint">（共 {selectableCardIds.length} 张匹配）</em>
                  )}
                </span>
              </div>
              <div className="library-bulk-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={selectCurrentPageCards}
                  disabled={visibleCardIds.length === 0}
                  title={hiddenCount > 0 ? `仅选中当前已加载的 ${visibleCardIds.length} 张` : "选中当前列表全部"}
                >
                  <CheckSquare size={17} />
                  选当前页（{visibleCardIds.length}）
                </button>
                {hiddenCount > 0 && (
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={selectAllMatchedCards}
                    disabled={selectableCardIds.length === 0}
                    title={`选中所有 ${selectableCardIds.length} 张匹配卡片（含未加载）`}
                  >
                    <CheckSquare size={17} />
                    选全部匹配（{selectableCardIds.length}）
                  </button>
                )}
                <button type="button" className="secondary-button" onClick={() => handleBulkPriority(true)} disabled={selectedCardIds.size === 0}>
                  <Star size={17} />
                  标重点
                </button>
                <button type="button" className="secondary-button" onClick={() => handleBulkPriority(false)} disabled={selectedCardIds.size === 0}>
                  <StarOff size={17} />
                  取消重点
                </button>
                <button type="button" className="warning-button" onClick={handleBulkSuspend} disabled={selectedCardIds.size === 0}>
                  <PauseCircle size={17} />
                  暂停
                </button>
                {selectedCards.some((card) => card.status === "suspended") && (
                  <button type="button" className="secondary-button" onClick={handleBulkRestore}>
                    <RotateCcw size={17} />
                    恢复
                  </button>
                )}
                <button type="button" className="secondary-button" onClick={exportSelectedCards} disabled={selectedCardIds.size === 0}>
                  导出
                </button>
                {data.units.length > 0 && (
                  <div className="library-bulk-unit">
                    <AppSelect
                      ariaLabel="批量选择要加入的词书"
                      options={data.units.map((unit) => ({ value: unit.id, label: unit.title }))}
                      value={bulkUnitId}
                      onChange={setBulkUnitId}
                    />
                    <button type="button" className="secondary-button" onClick={handleBulkAssignUnit} disabled={selectedCardIds.size === 0 || !bulkUnitId}>
                      <FolderInput size={17} />
                      加入词书
                    </button>
                  </div>
                )}
                <button type="button" className="danger-button" onClick={handleBulkDelete} disabled={selectedCardIds.size === 0}>
                  <Trash2 size={17} />
                  删除
                </button>
              </div>
            </div>
          )}

          {bulkMessage && (
            <div
              key={bulkMessageKey}
              className="library-action-toast with-progress"
              role="status"
              aria-live="polite"
              aria-atomic="true"
              style={{ ["--toast-duration" as string]: `${BULK_TOAST_DURATION_MS}ms` }}
            >
              <span>{bulkMessage}{undoSnapshot ? "（可撤销 1 步）" : ""}</span>
              {undoSnapshot && (
                <button type="button" className="secondary-button" onClick={undoLastAction}>
                  撤销上一步
                </button>
              )}
              <span className="library-action-toast-progress" aria-hidden="true" />
            </div>
          )}

          <div className="library-item-list" ref={listContainerRef}>
            {filteredItems.length === 0 ? (
              // R10 空状态分场景：词库真空给收录引导；筛选/搜索无结果给调整提示
              data.cards.length === 0 && data.materials.length === 0 ? (
                <div className="library-empty-list">
                  <div className="library-empty-icon" aria-hidden="true">
                    <BookOpen size={36} />
                  </div>
                  <strong>词库还是空的</strong>
                  <span>从一篇文章、一句台词或一个生词开始，收集的内容会沉淀在这里。</span>
                  <ol className="library-empty-steps" aria-label="新手三步引导">
                    <li>
                      <span className="library-empty-step-num" aria-hidden="true">1</span>
                      <div>
                        <strong>去添加页</strong>
                        <span>粘贴一段英文或输入一个生词</span>
                      </div>
                    </li>
                    <li>
                      <span className="library-empty-step-num" aria-hidden="true">2</span>
                      <div>
                        <strong>自动识别</strong>
                        <span>系统抽出单词、短语、句子入词库</span>
                      </div>
                    </li>
                    <li>
                      <span className="library-empty-step-num" aria-hidden="true">3</span>
                      <div>
                        <strong>开始训练</strong>
                        <span>到期自动进入复习队列</span>
                      </div>
                    </li>
                  </ol>
                  <Link to="/add" className="primary-button">
                    去添加内容
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <div className="library-empty-list">
                  <div className="library-empty-icon" aria-hidden="true">
                    <Search size={32} />
                  </div>
                  <strong>没有匹配项</strong>
                  <span>试试切换筛选或调整关键词；被暂停的卡片在「已暂停」筛选里。</span>
                  {(query.trim() || statusFilter !== "none" || typeFilter !== "all" || sourceFilterId) && (
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => {
                        setQuery("");
                        setTypeFilter("all");
                        setStatusFilter("none");
                        clearSourceFilter();
                      }}
                    >
                      <X size={15} />
                      清除全部筛选与搜索
                    </button>
                  )}
                </div>
              )
            ) : (
              visibleItems.map((item) => {
                const id = item.kind === "card" ? item.card.id : item.id;
                const isSelected = selectedItem && (selectedItem.kind === "card" ? selectedItem.card.id : selectedItem.id) === id;

                if (item.kind === "material") {
                  const mastery = materialMasteryById.get(item.id);
                  return (
                    <button
                      key={id}
                      data-item-id={id}
                      className={`library-item material-item ${selectionMode ? "selection-mode" : ""} ${isSelected ? "selected" : ""}`}
                      type="button"
                      onClick={() => setSelectedId(id)}
                    >
                      {selectionMode && <span className="library-select-indicator unavailable"><Square size={16} /></span>}
                      <span className="library-item-type material"><FileText size={16} /></span>
                      <div>
                        <strong>{item.title}</strong>
                        <span>{item.description || "材料预览为空"}</span>
                      </div>
                      <em>{mastery && mastery.total > 0 ? `材料 · 掌握 ${mastery.mastered}/${mastery.total}` : "材料"}</em>
                    </button>
                  );
                }

                const card = item.card;
                const schedule = scheduleByCardId.get(card.id);
                const unit = card.unitId ? unitById.get(card.unitId) : undefined;
                const isBulkSelected = selectedCardIds.has(card.id);
                const wordDetailsForAudio = card.type === "word" ? wordDetailsByCardId.get(card.id) : undefined;
                const sentenceDetailsForAudio = card.type === "sentence" ? sentenceDetailsByCardId.get(card.id) : undefined;
                const itemAudioUrl = wordDetailsForAudio?.audioUrl ?? sentenceDetailsForAudio?.audioUrl;
                return (
                  <div
                    key={id}
                    data-item-id={id}
                    role="button"
                    tabIndex={0}
                    className={`library-item ${selectionMode ? "selection-mode" : ""} ${isSelected ? "selected" : ""} ${isBulkSelected ? "bulk-selected" : ""}`}
                    aria-pressed={selectionMode ? isBulkSelected : undefined}
                    onClick={() => {
                      if (selectionMode) {
                        toggleCardSelection(card.id);
                        return;
                      }
                      setSelectedId(id);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        if ((event.target as HTMLElement).closest(".library-item-actions")) return;
                        event.preventDefault();
                        if (selectionMode) {
                          toggleCardSelection(card.id);
                        } else {
                          setSelectedId(id);
                        }
                      }
                    }}
                    >
                    {selectionMode && (
                      <span className="library-select-indicator">
                        <span className="icon-swap" data-state={isBulkSelected ? "b" : "a"} aria-hidden="true">
                          <span className="icon-slot" data-slot="a"><Square size={16} /></span>
                          <span className="icon-slot" data-slot="b"><CheckSquare size={16} /></span>
                        </span>
                      </span>
                    )}
                      <span className={`library-item-type ${card.type}`}>
                      {getCardIcon(card.type)}
                    </span>
                    <div>
                      <strong>{card.front}</strong>
                      <span>{card.back || card.note || "暂无释义或备注"}</span>
                    </div>
                    <em>{unit?.title ?? statusLabel[card.status]}</em>
                    {card.priority && <Star className="library-item-star" size={15} />}
                    {isDue(schedule?.nextReviewAt ?? null) && <CalendarClock className="library-item-due" size={15} />}
                    {!selectionMode && (
                      <div className="library-item-actions" onClick={(event) => event.stopPropagation()}>
                        <SpeakButton text={card.front} audioUrl={itemAudioUrl} ariaLabel={`播放「${card.front}」发音`} />
                        <button
                          type="button"
                          className="library-item-action"
                          aria-label={card.priority ? `取消「${card.front}」的重点标记` : `把「${card.front}」标为重点`}
                          aria-pressed={card.priority}
                          onClick={() =>
                            runSingleAction(
                              card.priority ? "已取消重点标记。" : "已标为重点。",
                              [card.id],
                              (current) => togglePriority(current, card.id)
                            )
                          }
                        >
                          {card.priority ? <StarOff size={15} /> : <Star size={15} />}
                        </button>
                        {card.status === "suspended" ? (
                          <button
                            type="button"
                            className="library-item-action"
                            aria-label={`恢复「${card.front}」`}
                            onClick={() => handleDetailRestore(card)}
                          >
                            <RotateCcw size={15} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="library-item-action warning"
                            aria-label={`暂停「${card.front}」`}
                            onClick={() => handleDetailSuspend(card)}
                          >
                            <PauseCircle size={15} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
            {hiddenCount > 0 && (
              <button
                type="button"
                className="secondary-button library-load-more"
                onClick={() => setVisibleCount((current) => current + LIBRARY_PAGE_SIZE)}
              >
                加载更多（还有 {hiddenCount} 条）
              </button>
            )}
          </div>
        </div>

        <aside className="panel library-detail-panel" aria-busy={isAiGenerating || undefined}>
          {renderDetail()}
        </aside>
      </section>

      <section className="library-insights-collapse" aria-label="词库报告">
        <button
          type="button"
          className="library-insights-toggle"
          aria-expanded={insightsExpanded}
          onClick={() => setInsightsExpanded((current) => !current)}
        >
          <Gauge size={16} />
          <span>
            词库报告
            <em>
              到期积压率 {formatPercent(healthMetrics.backlogRate)} · 14 天遗忘率 {formatPercent(healthMetrics.forgetRate)}
              {stats.weakWords > 0 && ` · ${stats.weakWords} 个薄弱词`}
            </em>
          </span>
          <ArrowRight size={15} className={insightsExpanded ? "rotate-90" : ""} aria-hidden="true" />
        </button>
        {insightsExpanded && (
          <div className="library-insights-body">
            <section className="panel library-health-panel" aria-label="词库健康度">
              <div className="panel-header">
                <div>
                  <span className="eyebrow">Health</span>
                  <h2>词库健康度</h2>
                </div>
                <Gauge size={20} />
              </div>
        <div className="insight-list library-health-grid">
          <button type="button" className={`insight-card as-button health-${healthReports.backlog.level}`} onClick={() => { setFilter("due"); clearSourceFilter(); }}>
            <CalendarClock size={18} />
            <div>
              <strong>
                到期积压率 {formatPercent(healthMetrics.backlogRate)}
                <em className="health-badge">{healthReports.backlog.level === "good" ? "健康" : healthReports.backlog.level === "warn" ? "关注" : "偏高"}</em>
              </strong>
              <span>{stats.dueTotal} 张到期 / {activeCards.length} 张活跃卡。{healthReports.backlog.advice}</span>
            </div>
            <ArrowRight size={16} />
          </button>
          <button type="button" className={`insight-card as-button health-${healthReports.suspend.level}`} onClick={() => { setFilter("suspended"); clearSourceFilter(); }}>
            <PauseCircle size={18} />
            <div>
              <strong>
                暂停率 {formatPercent(healthMetrics.suspendRate)}
                <em className="health-badge">{healthReports.suspend.level === "good" ? "健康" : healthReports.suspend.level === "warn" ? "关注" : "偏高"}</em>
              </strong>
              <span>{suspendedCount} 张已暂停。{healthReports.suspend.advice}</span>
            </div>
            <ArrowRight size={16} />
          </button>
          <button type="button" className={`insight-card as-button health-${healthReports.source.level}`} onClick={() => { setFilter("material"); clearSourceFilter(); }}>
            <FileText size={18} />
            <div>
              <strong>
                来源覆盖率 {formatPercent(healthMetrics.sourceRate)}
                <em className="health-badge">{healthReports.source.level === "good" ? "充分" : healthReports.source.level === "warn" ? "可提升" : "不足"}</em>
              </strong>
              <span>已产出卡片的材料句段占比。{healthReports.source.advice}</span>
            </div>
            <ArrowRight size={16} />
          </button>
          <Link to="/spelling?mode=mistakes" className={`insight-card health-${healthReports.forget.level}`}>
            <Flame size={18} />
            <div>
              <strong>
                14 天遗忘率 {formatPercent(healthMetrics.forgetRate)}
                <em className="health-badge">{healthReports.forget.level === "good" ? "稳固" : healthReports.forget.level === "warn" ? "关注" : "偏高"}</em>
              </strong>
              <span>近两周低分评分占比。{healthReports.forget.advice}</span>
            </div>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="two-column library-insights">
        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Focus</span>
              <h2>最近需要处理</h2>
            </div>
            <Flame size={20} />
          </div>
          <div className="insight-list">
            <Link to="/spelling?mode=mistakes" className="insight-card">
              <Flame size={18} />
              <div>
                <strong>{stats.weakWords} 个薄弱词</strong>
                <span>进入错词专项，把反复错的词先压住。</span>
              </div>
              <ArrowRight size={16} />
            </Link>
            <button type="button" className="insight-card as-button" onClick={() => setFilter("priority")}>
              <Star size={18} />
              <div>
                <strong>{priorityCount} 个我的重点</strong>
                <span>筛出手动标星的词和句；系统关注的另见筛选器。</span>
              </div>
              <ArrowRight size={16} />
            </button>
            <button type="button" className="insight-card as-button" onClick={() => setFilter("due")}>
              <CalendarClock size={18} />
              <div>
                <strong>{stats.dueTotal} 个到期复习</strong>
                <span>筛出今天该处理的项目。</span>
              </div>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Mistakes</span>
              <h2>最近错误</h2>
            </div>
            <span className="panel-count">{stats.wrongCards} 张错卡</span>
          </div>
          {recentErrors.length === 0 ? (
            <p className="muted">还没有错误记录。完成几轮训练后，这里会变成你的优先处理清单。</p>
          ) : (
            <div className="recent-error-feed compact">
              {recentErrors.map((item) => (
                <Link to="/spelling?mode=mistakes" className="recent-error-item" key={item.review.id}>
                  <div className="recent-error-main">
                    <strong>{item.title}</strong>
                    {item.description && <span>{item.description}</span>}
                  </div>
                  <div className="recent-error-meta">
                    <span>评分 {item.review.rating}</span>
                    <span>去练错词</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
          </div>
        )}
      </section>
    </div>
  );
}
