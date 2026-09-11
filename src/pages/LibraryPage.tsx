import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  CheckSquare,
  FileText,
  Flame,
  FolderInput,
  Import,
  Languages,
  Layers,
  LetterText,
  MessageSquareQuote,
  PauseCircle,
  Search,
  Settings,
  Square,
  Star,
  StarOff,
  Trash2,
  X
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useAppData } from "../AppContext";
import PageHeader from "../components/PageHeader";
import SpeakButton from "../components/SpeakButton";
import {
  deleteCard,
  deleteCards,
  getSentenceDetails,
  getWordDetails,
  setCardsPriority,
  setCardsStatus,
  togglePriority
} from "../services/cardService";
import { getLearningStats, getRecentErrorReviews } from "../services/reviewService";
import { assignCardIdsToUnit } from "../services/unitService";
import { downloadTextFile } from "../services/storage";
import { AppData, Card } from "../types";

type LibraryFilter = "all" | "word" | "phrase" | "sentence" | "priority" | "due" | "material";

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
  priority: "重点",
  due: "到期",
  material: "材料"
};

const cardTypeLabel: Record<Card["type"], string> = {
  word: "单词",
  phrase: "短语",
  sentence: "句子"
};

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
  const [filter, setFilter] = useState<LibraryFilter>("all");
  const [selectedId, setSelectedId] = useState("");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedCardIds, setSelectedCardIds] = useState<Set<string>>(() => new Set());
  const [bulkUnitId, setBulkUnitId] = useState("");
  const [detailUnitId, setDetailUnitId] = useState("");
  const [bulkMessage, setBulkMessage] = useState("");
  const [undoSnapshot, setUndoSnapshot] = useState<CardUndoSnapshot | null>(null);
  const stats = getLearningStats(data);
  const recentErrors = getRecentErrorReviews(data, 4);
  const activeCards = useMemo(() => data.cards.filter((card) => card.status !== "suspended"), [data.cards]);
  const wordCount = activeCards.filter((card) => card.type === "word").length;
  const phraseCount = activeCards.filter((card) => card.type === "phrase").length;
  const sentenceCount = activeCards.filter((card) => card.type === "sentence").length;
  const priorityCount = activeCards.filter((card) => card.priority).length;
  const scheduleByCardId = useMemo(() => new Map(data.schedules.map((schedule) => [schedule.cardId, schedule])), [data.schedules]);
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
    const cards = activeCards
      .slice()
      .sort((a, b) => Number(b.priority) - Number(a.priority) || b.updatedAt.localeCompare(a.updatedAt))
      .map<LibraryCardItem>((card) => ({ kind: "card", card }));
    const materials = data.materials
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
  }, [activeCards, data.materials]);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return allItems.filter((item) => {
      if (item.kind === "card") {
        const schedule = scheduleByCardId.get(item.card.id);
        const matchesFilter =
          filter === "all" ||
          filter === item.card.type ||
          (filter === "priority" && item.card.priority) ||
          (filter === "due" && isDue(schedule?.nextReviewAt ?? null));
        const wordDetails = item.card.type === "word" ? getWordDetails(data, item.card.id) : undefined;
        const sentenceDetails = item.card.type === "sentence" ? getSentenceDetails(data, item.card.id) : undefined;
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
      const matchesFilter = filter === "all" || filter === "material";
      return matchesFilter && (!normalized || searchable.includes(normalized));
    });
  }, [allItems, data, filter, query, scheduleByCardId]);

  const selectedItem = useMemo(() => {
    if (selectedId) {
      const found = filteredItems.find((item) => (item.kind === "card" ? item.card.id : item.id) === selectedId);
      if (found) return found;
    }
    return filteredItems[0];
  }, [filteredItems, selectedId]);

  const visibleItems = useMemo(() => filteredItems.slice(0, 120), [filteredItems]);
  const selectableVisibleCardIds = useMemo(
    () => visibleItems.filter((item): item is LibraryCardItem => item.kind === "card").map((item) => item.card.id),
    [visibleItems]
  );
  const selectedIds = useMemo(() => Array.from(selectedCardIds), [selectedCardIds]);
  const selectedCards = useMemo(
    () => data.cards.filter((card) => selectedCardIds.has(card.id)),
    [data.cards, selectedCardIds]
  );

  useEffect(() => {
    setSelectedCardIds((current) => {
      const activeIds = new Set(activeCards.map((card) => card.id));
      const next = new Set(Array.from(current).filter((id) => activeIds.has(id)));
      return next.size === current.size ? current : next;
    });
  }, [activeCards]);

  useEffect(() => {
    if (!data.units.some((unit) => unit.id === bulkUnitId)) {
      setBulkUnitId(data.units[0]?.id ?? "");
    }
  }, [bulkUnitId, data.units]);

  useEffect(() => {
    if (selectedItem?.kind === "card") {
      setDetailUnitId(selectedItem.card.unitId ?? data.units[0]?.id ?? "");
    }
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

  const selectVisibleCards = () => {
    setSelectedCardIds(new Set(selectableVisibleCardIds));
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
    downloadTextFile("library-selection.csv", ["type,front,back,note,tags", ...rows].join("\n"), "text/csv");
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

  const filterStats = {
    all: allItems.length,
    word: wordCount,
    phrase: phraseCount,
    sentence: sentenceCount,
    priority: priorityCount,
    due: stats.dueTotal,
    material: data.materials.length
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
      meta: `${data.units.length} 个单元`,
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
    if (!window.confirm(`暂停 ${selectedIds.length} 张卡片？它们不会进入日常复习，但数据会保留。`)) return;
    runBulkAction(
      `已暂停 ${selectedIds.length} 张卡片。`,
      (current, ids) => setCardsStatus(current, ids, "suspended"),
      true
    );
  };

  const handleBulkDelete = () => {
    if (!window.confirm(`删除 ${selectedIds.length} 张卡片及其复习记录？删除后可在提示条中立即撤销。`)) return;
    runBulkAction(
      `已删除 ${selectedIds.length} 张卡片。`,
      (current, ids) => deleteCards(current, ids),
      true,
      true
    );
  };

  const handleBulkAssignUnit = () => {
    if (!bulkUnitId) return;
    const unit = unitById.get(bulkUnitId);
    runBulkAction(
      `已加入${unit ? `「${unit.title}」` : "所选单元"}。`,
      (current, ids) => assignCardIdsToUnit(current, ids, bulkUnitId)
    );
  };

  const handleDetailAssignUnit = (cardId: string) => {
    if (!detailUnitId) return;
    runSingleAction("已更新单元归属。", [cardId], (current) => assignCardIdsToUnit(current, [cardId], detailUnitId));
  };

  const handleDetailSuspend = (card: Card) => {
    if (!window.confirm(`暂停「${card.front}」？它不会进入日常复习，但数据会保留。`)) return;
    runSingleAction("已暂停该卡片。", [card.id], (current) => setCardsStatus(current, [card.id], "suspended"));
    if (selectedId === card.id) setSelectedId("");
  };

  const handleDetailDelete = (card: Card) => {
    if (!window.confirm(`删除「${card.front}」及其复习记录？删除后可在提示条中立即撤销。`)) return;
    runSingleAction("已删除该卡片。", [card.id], (current) => deleteCard(current, card.id), true);
    if (selectedId === card.id) setSelectedId("");
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
    const practiceLink = card.type === "word" ? "/spelling" : "/review";
    const canDeepEdit = card.type !== "phrase";
    const sourceMatches = getCardSourceMatches(card);

    return (
      <div className="library-detail-stack">
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
          {card.priority && <span>重点</span>}
          <span>下次 {formatDateTime(schedule?.nextReviewAt ?? null)}</span>
          {unit && <span>{unit.title}</span>}
        </div>

        {wordDetails && (
          <div className="library-detail-fields">
            {wordDetails.phonetic && <div><span>音标</span><strong>{wordDetails.phonetic}</strong></div>}
            {wordDetails.partOfSpeech && <div><span>词性</span><strong>{wordDetails.partOfSpeech}</strong></div>}
            {wordDetails.englishDefinition && <div><span>英文解释</span><strong>{wordDetails.englishDefinition}</strong></div>}
            {wordDetails.collocations && <div><span>搭配</span><strong>{wordDetails.collocations}</strong></div>}
          </div>
        )}

        {sentenceDetails && (
          <div className="library-detail-fields">
            {sentenceDetails.keywords.length > 0 && <div><span>关键词</span><strong>{sentenceDetails.keywords.join(" · ")}</strong></div>}
            {sentenceDetails.grammarNote && <div><span>语法/备注</span><strong>{sentenceDetails.grammarNote}</strong></div>}
          </div>
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
              <article key={match.material.id} className={match.exact ? "is-exact" : ""}>
                <strong>
                  {match.material.title}
                  <em>{match.exact ? "明确来源" : "可能来源"}</em>
                </strong>
                <p>{match.matchedSegments[0]?.text ?? "这张卡片显式关联到该材料。"}</p>
              </article>
            ))}
          </div>
        )}

        {card.tags.length > 0 && (
          <div className="tag-row">
            {card.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        )}

        <div className="library-management-panel">
          <div>
            <span className="eyebrow">Manage</span>
            <strong>轻量管理</strong>
          </div>
          <div className="button-row">
            <button className="secondary-button" type="button" onClick={() => runSingleAction(card.priority ? "已取消重点标记。" : "已标为重点。", [card.id], (current) => togglePriority(current, card.id))}>
              {card.priority ? <StarOff size={17} /> : <Star size={17} />}
              {card.priority ? "取消重点" : "标为重点"}
            </button>
            <button className="warning-button" type="button" onClick={() => handleDetailSuspend(card)}>
              <PauseCircle size={17} />
              暂停
            </button>
          </div>
          {data.units.length > 0 && (
            <div className="library-unit-picker">
              <select aria-label="选择要加入的单元" value={detailUnitId} onChange={(event) => setDetailUnitId(event.target.value)}>
                {data.units.map((item) => (
                  <option key={item.id} value={item.id}>{item.title}</option>
                ))}
              </select>
              <button className="secondary-button" type="button" onClick={() => handleDetailAssignUnit(card.id)}>
                <FolderInput size={17} />
                加入单元
              </button>
            </div>
          )}
          <button className="danger-button" type="button" onClick={() => handleDetailDelete(card)}>
            <Trash2 size={17} />
            删除卡片
          </button>
        </div>

        <div className="button-row">
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

  return (
    <div className="page library-page">
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

      <section className="library-overview" aria-label="词库总览">
        <div>
          <span>单词</span>
          <strong>{wordCount}</strong>
        </div>
        <div>
          <span>短语</span>
          <strong>{phraseCount}</strong>
        </div>
        <div>
          <span>句子</span>
          <strong>{sentenceCount}</strong>
        </div>
        <div>
          <span>到期</span>
          <strong>{stats.dueTotal}</strong>
        </div>
        <div>
          <span>重点</span>
          <strong>{priorityCount}</strong>
        </div>
      </section>

      <section className="library-shortcuts" aria-label="深度管理入口">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.title} to={section.to}>
              <Icon size={18} />
              <span>{section.title}</span>
              <em>{section.meta}</em>
            </Link>
          );
        })}
      </section>

      <section className="library-workspace">
        <div className="panel library-browser-panel">
          <div className="library-toolbar">
            <div className="search-box library-search">
              <Search size={17} />
              <input
                aria-label="搜索词库内容"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索单词、短语、句子、释义、标签或来源句"
              />
            </div>
            <div className="segmented-control library-filter" aria-label="词库筛选">
              {(Object.keys(filterLabels) as LibraryFilter[]).map((key) => (
                <button key={key} className={filter === key ? "selected" : ""} onClick={() => setFilter(key)}>
                  {filterLabels[key]}
                  <span>{filterStats[key]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="library-result-summary">
            <strong>{filteredItems.length}</strong>
            <span>个匹配结果</span>
            <span>{selectableVisibleCardIds.length} 张当前可批量处理卡片</span>
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
                <span>已选择卡片</span>
              </div>
              <div className="library-bulk-actions">
                <button type="button" className="secondary-button" onClick={selectVisibleCards} disabled={selectableVisibleCardIds.length === 0}>
                  <CheckSquare size={17} />
                  全选当前
                </button>
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
                <button type="button" className="secondary-button" onClick={exportSelectedCards} disabled={selectedCardIds.size === 0}>
                  导出
                </button>
                {data.units.length > 0 && (
                  <div className="library-bulk-unit">
                    <select aria-label="批量选择要加入的单元" value={bulkUnitId} onChange={(event) => setBulkUnitId(event.target.value)}>
                      {data.units.map((unit) => (
                        <option key={unit.id} value={unit.id}>{unit.title}</option>
                      ))}
                    </select>
                    <button type="button" className="secondary-button" onClick={handleBulkAssignUnit} disabled={selectedCardIds.size === 0 || !bulkUnitId}>
                      <FolderInput size={17} />
                      加入单元
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
            <div className="library-action-toast" role="status" aria-live="polite" aria-atomic="true">
              <span>{bulkMessage}</span>
              {undoSnapshot && (
                <button type="button" className="secondary-button" onClick={undoLastAction}>
                  撤销上一步
                </button>
              )}
            </div>
          )}

          <div className="library-item-list">
            {filteredItems.length === 0 ? (
              <div className="library-empty-list">
                <strong>没有匹配项</strong>
                <span>试试切换筛选，或去添加页收集新的内容。</span>
              </div>
            ) : (
              visibleItems.map((item) => {
                const id = item.kind === "card" ? item.card.id : item.id;
                const isSelected = selectedItem && (selectedItem.kind === "card" ? selectedItem.card.id : selectedItem.id) === id;

                if (item.kind === "material") {
                  return (
                    <button
                      key={id}
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
                      <em>材料</em>
                    </button>
                  );
                }

                const card = item.card;
                const schedule = scheduleByCardId.get(card.id);
                const unit = card.unitId ? unitById.get(card.unitId) : undefined;
                const isBulkSelected = selectedCardIds.has(card.id);
                return (
                  <button
                    key={id}
                    className={`library-item ${selectionMode ? "selection-mode" : ""} ${isSelected ? "selected" : ""} ${isBulkSelected ? "bulk-selected" : ""}`}
                    type="button"
                    aria-pressed={selectionMode ? isBulkSelected : undefined}
                    onClick={() => {
                      if (selectionMode) {
                        toggleCardSelection(card.id);
                        return;
                      }
                      setSelectedId(id);
                    }}
                    >
                    {selectionMode && (
                      <span className="library-select-indicator">
                        {isBulkSelected ? <CheckSquare size={16} /> : <Square size={16} />}
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
                  </button>
                );
              })
            )}
          </div>
        </div>

        <aside className="panel library-detail-panel">
          {renderDetail()}
        </aside>
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
                <strong>{priorityCount} 个重点项目</strong>
                <span>在统一词库里筛出重点词和重点句。</span>
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
  );
}
