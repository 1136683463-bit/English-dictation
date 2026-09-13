import { type CSSProperties, type DragEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, FileText, FileUp, Flame, Keyboard, Plus, Search, Settings2, Target, Trash2, Upload, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppData } from "../AppContext";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import {
  bookTitleFromFile,
  buildImportChapters,
  detectBookFileFormat,
  parseBookFileContent,
  readBookFileText,
  type ParsedBookChapter
} from "../services/bookImportService";
import { addWordsBatchWithAudio, getWordDetails, hydrateWordInput, WordInput } from "../services/cardService";
import { getWeakCardInsights } from "../services/reviewService";
import {
  assignCardIdsToUnit,
  createUnitGroup,
  deleteUnitGroup,
  deleteUnit,
  getCardsForUnit,
  getUnitStats,
  getVocabularyGoalStats,
  moveUnitToGroup,
  removeCardFromUnit,
  updateUnitGroup,
  updateUnit
} from "../services/unitService";
import { nowIso, uid } from "../services/storage";

const unitColors = ["#f06423", "#177e78", "#465366", "#d96a2f", "#0f766e", "#7a8493", "#3157d5", "#14845f", "#7c3aed", "#dc2626"];
const unitCoverEndMap: Record<string, string> = {
  "#f06423": "#f6b15e",
  "#177e78": "#72c8b8",
  "#465366": "#96a0ad",
  "#d96a2f": "#f2c58f",
  "#0f766e": "#9dd8ca",
  "#7a8493": "#d9cdbd",
  "#3157d5": "#9db4ff",
  "#14845f": "#93d4ad",
  "#7c3aed": "#c6a6f7",
  "#dc2626": "#f7a7a7"
};
const chapterLimitOptions = [15, 30, 50, 100, 200] as const;
const unitDragMimeType = "application/x-unit-id";

type ChapterLimit = (typeof chapterLimitOptions)[number] | "custom";

interface CustomChapter {
  id: string;
  title: string;
  content: string;
}

const createChapterId = () => `chapter-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const createCustomChapter = (index: number): CustomChapter => ({
  id: createChapterId(),
  title: `list${index + 1}`,
  content: ""
});

const createDefaultCustomChapters = () => Array.from({ length: 3 }, (_, index) => createCustomChapter(index));

const parseCustomWords = (content: string) => {
  const seen = new Set<string>();
  return content
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:[-*]|\d+[.)、])\s*/, "").trim())
    .filter(Boolean)
    .filter((word) => {
      const normalized = word.toLowerCase();
      if (seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
};

const formatUnitCoverDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("  ");
};

const getUnitCoverEnd = (color: string) => unitCoverEndMap[color.toLowerCase()] ?? "#f6b15e";

export default function UnitsPage() {
  const { data, updateData, updateDataAsync } = useAppData();
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [isGroupFormOpen, setIsGroupFormOpen] = useState(false);
  const [assignQuery, setAssignQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isCustomBookOpen, setIsCustomBookOpen] = useState(false);
  const [activeWordTab, setActiveWordTab] = useState<"current" | "assign">("current");
  const [assignMode, setAssignMode] = useState<"search" | "bulk">("search");
  const [bulkImportText, setBulkImportText] = useState("");
  const [bulkImportMessage, setBulkImportMessage] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editColor, setEditColor] = useState(unitColors[0]);
  const [editGroupId, setEditGroupId] = useState("");
  const [newGroupTitle, setNewGroupTitle] = useState("");
  const [newGroupColor, setNewGroupColor] = useState(unitColors[0]);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupTitle, setEditingGroupTitle] = useState("");
  const [editingGroupColor, setEditingGroupColor] = useState(unitColors[0]);
  const [draggingUnitId, setDraggingUnitId] = useState<string | null>(null);
  const [dropTargetGroupId, setDropTargetGroupId] = useState<string | null>(null);
  const [hasDraggedUnit, setHasDraggedUnit] = useState(false);
  const [customBookTitle, setCustomBookTitle] = useState("");
  const [customChapterLimit, setCustomChapterLimit] = useState<ChapterLimit>(15);
  const [shareCustomBook, setShareCustomBook] = useState(false);
  const [isReorderingChapters, setIsReorderingChapters] = useState(false);
  const [customChapters, setCustomChapters] = useState<CustomChapter[]>(() => createDefaultCustomChapters());
  const [isImportBookOpen, setIsImportBookOpen] = useState(false);
  const [importBookTitle, setImportBookTitle] = useState("");
  const [importGroupId, setImportGroupId] = useState("");
  const [importSplitSize, setImportSplitSize] = useState<number | null>(null);
  const [importFileName, setImportFileName] = useState("");
  const [importChapters, setImportChapters] = useState<ParsedBookChapter[]>([]);
  const [importWarning, setImportWarning] = useState("");
  const [importError, setImportError] = useState("");
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isImportDragOver, setIsImportDragOver] = useState(false);
  const [importResultMessage, setImportResultMessage] = useState("");
  const importFileInputRef = useRef<HTMLInputElement>(null);
  const importSplitOptions = [15, 30, 50, 100] as const;

  const units = useMemo(() => {
    return data.units.slice().sort((a, b) => a.order - b.order);
  }, [data.units]);

  const unitGroups = useMemo(() => data.unitGroups.slice().sort((a, b) => a.order - b.order), [data.unitGroups]);
  const unitGroupMap = useMemo(() => new Map(unitGroups.map((group) => [group.id, group])), [unitGroups]);
  const isUnitUngrouped = (unit: (typeof data.units)[number]) => !unit.groupId || !unitGroupMap.has(unit.groupId);
  const groupedUnitSections = useMemo(() => {
    const knownGroupIds = new Set(unitGroups.map((group) => group.id));
    const sections = unitGroups.map((group) => ({
      id: group.id,
      title: group.title,
      color: group.color,
      units: units.filter((unit) => unit.groupId === group.id)
    }));
    const ungroupedUnits = units.filter((unit) => !unit.groupId || !knownGroupIds.has(unit.groupId));

    return ungroupedUnits.length > 0
      ? [
          ...sections,
          {
            id: "",
            title: "未分组",
            color: "#7a8493",
            units: ungroupedUnits
          }
        ]
      : sections;
  }, [unitGroups, units]);

  const sortedUnits = useMemo(() => data.units.slice().sort((a, b) => a.order - b.order), [data.units]);
  const selectedUnit = data.units.find((unit) => unit.id === selectedUnitId) ?? sortedUnits[0];
  const selectedStats = selectedUnit ? getUnitStats(data, selectedUnit) : undefined;
  const selectedCards = selectedUnit ? getCardsForUnit(data, selectedUnit.id) : [];
  const goalStats = useMemo(() => getVocabularyGoalStats(data), [data]);
  const selectedWeakCount = useMemo(
    () => (selectedUnit ? getWeakCardInsights(data, { type: "word", unitId: selectedUnit.id, limit: selectedCards.length }).length : 0),
    [data, selectedCards.length, selectedUnit?.id]
  );

  const availableCards = useMemo(() => {
    if (!selectedUnit) return [];
    const normalized = assignQuery.trim().toLowerCase();
    return data.cards
      .filter((card) => card.type === "word" && card.unitId !== selectedUnit.id)
      .filter((card) => {
        if (!normalized) return !card.unitId;
        return (
          card.front.toLowerCase().includes(normalized) ||
          card.back.toLowerCase().includes(normalized) ||
          card.tags.some((tag) => tag.toLowerCase().includes(normalized))
        );
      })
      .sort((a, b) => Number(!b.unitId) - Number(!a.unitId) || a.front.localeCompare(b.front))
      .slice(0, 24);
  }, [assignQuery, data.cards, selectedUnit]);

  const bulkDraftLineCount = useMemo(
    () =>
      bulkImportText
        .split(/\r?\n/)
        .map((line) => line.replace(/^\s*(?:[-*]|\d+[.)、])\s*/, "").trim())
        .filter(Boolean).length,
    [bulkImportText]
  );
  const bulkImportWords = useMemo(() => parseCustomWords(bulkImportText), [bulkImportText]);
  const bulkExistingCount = useMemo(() => {
    const existingWords = new Set(data.wordDetails.map((details) => details.word.toLowerCase()));
    return bulkImportWords.filter((word) => existingWords.has(word.toLowerCase())).length;
  }, [bulkImportWords, data.wordDetails]);
  const bulkNewCount = Math.max(0, bulkImportWords.length - bulkExistingCount);
  const bulkDuplicateCount = Math.max(0, bulkDraftLineCount - bulkImportWords.length);

  const customChapterDrafts = useMemo(
    () =>
      customChapters.map((chapter) => ({
        ...chapter,
        words: parseCustomWords(chapter.content)
      })),
    [customChapters]
  );
  const customTotalWords = customChapterDrafts.reduce((sum, chapter) => sum + chapter.words.length, 0);
  const customFilledChapters = customChapterDrafts.filter((chapter) => chapter.words.length > 0);
  const canCreateCustomBook = Boolean(customBookTitle.trim()) && customTotalWords > 0;

  const importChapterPreview = useMemo(
    () => buildImportChapters(importChapters, importSplitSize),
    [importChapters, importSplitSize]
  );
  const importTotalWords = importChapterPreview.reduce((sum, chapter) => sum + chapter.words.length, 0);
  const importWordStats = useMemo(() => {
    const existingWords = new Set(data.wordDetails.map((details) => details.word.toLowerCase()));
    const seen = new Set<string>();
    let existing = 0;
    importChapterPreview.forEach((chapter) => {
      chapter.words.forEach((word) => {
        const key = word.word.trim().toLowerCase();
        if (!key || seen.has(key)) return;
        seen.add(key);
        if (existingWords.has(key)) existing += 1;
      });
    });
    return { existing, newCount: Math.max(0, seen.size - existing) };
  }, [importChapterPreview, data.wordDetails]);
  const canImportBook =
    Boolean(importBookTitle.trim()) && importChapterPreview.length > 0 && !isImporting && !isReadingFile;

  useEffect(() => {
    if (!selectedUnitId && sortedUnits[0]) {
      setSelectedUnitId(sortedUnits[0].id);
    }
    if (selectedUnitId && !data.units.some((unit) => unit.id === selectedUnitId)) {
      setSelectedUnitId(sortedUnits[0]?.id ?? "");
    }
  }, [data.units, selectedUnitId, sortedUnits]);

  useEffect(() => {
    if (!selectedUnit) return;
    setEditTitle(selectedUnit.title);
    setEditDescription(selectedUnit.description);
    setEditColor(selectedUnit.color);
    setEditGroupId(selectedUnit.groupId ?? "");
    setIsEditing(false);
    setActiveWordTab("current");
  }, [selectedUnit?.id]);

  useEffect(() => {
    setAssignMode("search");
    setAssignQuery("");
    setBulkImportText("");
    setBulkImportMessage("");
  }, [selectedUnit?.id]);

  useEffect(() => {
    if (!isUnitModalOpen && !isCustomBookOpen && !isImportBookOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isImportBookOpen) {
          setIsImportBookOpen(false);
        } else if (isCustomBookOpen) {
          setIsCustomBookOpen(false);
        } else {
          setIsUnitModalOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCustomBookOpen, isImportBookOpen, isUnitModalOpen]);

  const saveSelectedUnit = (event: FormEvent) => {
    event.preventDefault();
    if (!selectedUnit || !editTitle.trim()) return;
    updateData((current) =>
      updateUnit(current, selectedUnit.id, {
        title: editTitle,
        description: editDescription,
        color: editColor,
        groupId: editGroupId
      })
    );
    setIsEditing(false);
  };

  const createGroup = (event: FormEvent) => {
    event.preventDefault();
    if (!newGroupTitle.trim()) return;
    updateData((current) => createUnitGroup(current, newGroupTitle, newGroupColor));
    setNewGroupTitle("");
    setNewGroupColor(unitColors[0]);
  };

  const startGroupEdit = (groupId: string) => {
    const group = unitGroupMap.get(groupId);
    if (!group) return;
    setEditingGroupId(group.id);
    setEditingGroupTitle(group.title);
    setEditingGroupColor(group.color);
  };

  const selectedEditingGroup = editingGroupId ? unitGroupMap.get(editingGroupId) : undefined;
  const hasGroupEditChanges = Boolean(
    selectedEditingGroup &&
      (editingGroupTitle.trim() !== selectedEditingGroup.title || editingGroupColor !== selectedEditingGroup.color)
  );

  const saveGroupEdit = (event: FormEvent) => {
    event.preventDefault();
    if (!editingGroupId || !editingGroupTitle.trim()) return;
    void updateDataAsync((current) =>
      Promise.resolve({
        data: updateUnitGroup(
          current,
          editingGroupId,
          {
            title: editingGroupTitle,
            color: editingGroupColor
          },
          { applyColorToUnits: true }
        )
      })
    ).then(() => {
      setEditingGroupId(null);
    });
  };

  const removeGroup = (groupId: string) => {
    const group = unitGroupMap.get(groupId);
    if (!group) return;
    const ok = window.confirm(`删除分组「${group.title}」？组内词书会移动到未分组。`);
    if (!ok) return;
    updateData((current) => deleteUnitGroup(current, groupId));
    if (editingGroupId === groupId) setEditingGroupId(null);
  };

  const applySelectedGroupColor = () => {
    const group = unitGroupMap.get(editGroupId);
    if (group) setEditColor(group.color);
  };

  const moveUnitIntoGroup = (unitId: string, groupId: string) => {
    updateData((current) => moveUnitToGroup(current, unitId, groupId));
  };

  const handleUnitDragStart = (event: DragEvent<HTMLButtonElement>, unitId: string) => {
    const unit = data.units.find((item) => item.id === unitId);
    if (!unit || !isUnitUngrouped(unit)) {
      event.preventDefault();
      return;
    }
    setDraggingUnitId(unitId);
    setHasDraggedUnit(true);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(unitDragMimeType, unitId);
    event.dataTransfer.setData("text/plain", unitId);
  };

  const handleUnitDragEnd = () => {
    setDraggingUnitId(null);
    setDropTargetGroupId(null);
    window.setTimeout(() => setHasDraggedUnit(false), 220);
  };

  const handleUnitCardClick = (unitId: string) => {
    if (hasDraggedUnit) {
      setHasDraggedUnit(false);
      return;
    }
    openUnitModal(unitId);
  };

  const handleGroupDragOver = (event: DragEvent<HTMLElement>, groupId: string) => {
    if ((!draggingUnitId && !Array.from(event.dataTransfer.types).includes(unitDragMimeType)) || !groupId) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (dropTargetGroupId !== groupId) {
      setDropTargetGroupId(groupId);
    }
  };

  const handleGroupDragLeave = (event: DragEvent<HTMLElement>, groupId: string) => {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) return;
    if (dropTargetGroupId === groupId) {
      setDropTargetGroupId(null);
    }
  };

  const handleGroupDrop = (event: DragEvent<HTMLElement>, groupId: string) => {
    if (!groupId) return;
    event.preventDefault();
    const unitId = draggingUnitId || event.dataTransfer.getData(unitDragMimeType) || event.dataTransfer.getData("text/plain");
    setDropTargetGroupId(null);
    setDraggingUnitId(null);
    if (!unitId) return;
    moveUnitIntoGroup(unitId, groupId);
  };

  const openUnitModal = (unitId: string) => {
    setSelectedUnitId(unitId);
    setIsUnitModalOpen(true);
  };

  const closeUnitModal = () => {
    setIsUnitModalOpen(false);
    setIsEditing(false);
    setActiveWordTab("current");
    setAssignMode("search");
    setAssignQuery("");
    setBulkImportText("");
    setBulkImportMessage("");
  };

  const openCustomBookModal = () => {
    setIsCustomBookOpen(true);
    setIsReorderingChapters(false);
  };

  const closeCustomBookModal = () => {
    setIsCustomBookOpen(false);
    setIsReorderingChapters(false);
  };

  const resetCustomBookDraft = () => {
    setCustomBookTitle("");
    setCustomChapterLimit(15);
    setShareCustomBook(false);
    setIsReorderingChapters(false);
    setCustomChapters(createDefaultCustomChapters());
  };

  const openImportBookModal = () => {
    setIsImportBookOpen(true);
  };

  const closeImportBookModal = () => {
    setIsImportBookOpen(false);
  };

  const resetImportDraft = () => {
    setImportBookTitle("");
    setImportGroupId("");
    setImportSplitSize(null);
    setImportFileName("");
    setImportChapters([]);
    setImportWarning("");
    setImportError("");
  };

  const handleImportFile = async (file: File) => {
    setImportError("");
    if (file.size > 5 * 1024 * 1024) {
      setImportError("文件超过 5MB，请拆分后再导入。");
      return;
    }
    setIsReadingFile(true);
    try {
      const text = await readBookFileText(file);
      const parsed = parseBookFileContent(text, detectBookFileFormat(file.name));
      const totalWords = parsed.chapters.reduce((sum, chapter) => sum + chapter.words.length, 0);
      if (totalWords === 0) {
        setImportFileName("");
        setImportChapters([]);
        setImportWarning("");
        setImportError("没有解析到有效单词，请检查文件内容。");
        return;
      }
      setImportFileName(file.name);
      setImportChapters(parsed.chapters);
      setImportWarning(parsed.warning ?? "");
      setImportBookTitle(bookTitleFromFile(file.name));
      setImportSplitSize(null);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "文件读取失败。");
    } finally {
      setIsReadingFile(false);
    }
  };

  const importBookFromFile = async (event: FormEvent) => {
    event.preventDefault();
    if (!canImportBook) return;

    const bookTitle = importBookTitle.trim();
    const chaptersToCreate = importChapterPreview;
    const groupChoice = importGroupId;

    setIsImporting(true);
    const result = await updateDataAsync((current) => {
      let next = current;
      let maxOrder = current.units.reduce((max, unit) => Math.max(max, unit.order), 0);
      let targetGroupId = "";

      if (groupChoice === "__new__") {
        next = createUnitGroup(next, bookTitle, unitColors[current.unitGroups.length % unitColors.length]);
        targetGroupId = next.unitGroups[next.unitGroups.length - 1]?.id ?? "";
      } else if (current.unitGroups.some((group) => group.id === groupChoice)) {
        targetGroupId = groupChoice;
      }

      const wordInputs: WordInput[] = [];
      chaptersToCreate.forEach((chapter, index) => {
        const unitId = uid("unit");
        const timestamp = nowIso();
        const chapterTitle = chapter.title.trim() || `list${index + 1}`;
        const unitTitle = chaptersToCreate.length === 1 ? bookTitle : `${bookTitle} · ${chapterTitle}`;
        const unit = {
          id: unitId,
          title: unitTitle,
          description: `文件导入 · ${chapter.words.length} 词`,
          order: ++maxOrder,
          color: unitColors[index % unitColors.length],
          groupId: targetGroupId || undefined,
          createdAt: timestamp,
          updatedAt: timestamp
        };

        next = { ...next, units: [...next.units, unit] };

        chapter.words.forEach((word) => {
          const hydrated = hydrateWordInput(next, word.word);
          wordInputs.push({
            ...hydrated,
            translation: word.translation.trim() || hydrated.translation,
            phonetic: word.phonetic.trim() || hydrated.phonetic,
            partOfSpeech: word.partOfSpeech.trim() || hydrated.partOfSpeech,
            unitId,
            note: `词书：${bookTitle}${chaptersToCreate.length > 1 ? ` / ${chapterTitle}` : ""}`,
            tags: "文件导入"
          });
        });
      });

      return addWordsBatchWithAudio(next, wordInputs, current.settings.speechLang, { maxAudioLookups: 30 });
    });

    setIsImporting(false);
    closeImportBookModal();
    resetImportDraft();
    const audioDetail = result.audioAttached ? `，附加真实发音 ${result.audioAttached} 个` : "";
    setImportResultMessage(
      `已从「${importFileName}」导入 ${chaptersToCreate.length} 本词书：新增 ${result.created} 词，合并 ${result.merged} 词${audioDetail}。`
    );
  };

  const updateCustomChapter = (chapterId: string, patch: Partial<Pick<CustomChapter, "title" | "content">>) => {
    setCustomChapters((current) =>
      current.map((chapter) => (chapter.id === chapterId ? { ...chapter, ...patch } : chapter))
    );
  };

  const addCustomChapter = () => {
    setCustomChapters((current) => [...current, createCustomChapter(current.length)]);
  };

  const removeCustomChapter = (chapterId: string) => {
    setCustomChapters((current) =>
      current.length === 1 ? current : current.filter((chapter) => chapter.id !== chapterId)
    );
  };

  const moveCustomChapter = (chapterId: string, direction: -1 | 1) => {
    setCustomChapters((current) => {
      const index = current.findIndex((chapter) => chapter.id === chapterId);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current;
      const next = current.slice();
      const [chapter] = next.splice(index, 1);
      next.splice(nextIndex, 0, chapter);
      return next;
    });
  };

  const createCustomBook = async (event: FormEvent) => {
    event.preventDefault();
    if (!canCreateCustomBook) return;

    const bookTitle = customBookTitle.trim();
    const chaptersToCreate = customFilledChapters;
    const limitLabel = customChapterLimit === "custom" ? "自定义章容量" : `每章 ${customChapterLimit} 词`;

    await updateDataAsync((current) => {
      let next = current;
      let maxOrder = current.units.reduce((max, unit) => Math.max(max, unit.order), 0);
      const wordInputs: WordInput[] = [];

      chaptersToCreate.forEach((chapter, index) => {
        const unitId = uid("unit");
        const timestamp = nowIso();
        const chapterTitle = chapter.title.trim() || `list${index + 1}`;
        const unitTitle = chaptersToCreate.length === 1 ? bookTitle : `${bookTitle} · ${chapterTitle}`;
        const unit = {
          id: unitId,
          title: unitTitle,
          description: `自定义词书 · ${limitLabel} · ${chapter.words.length} 词`,
          order: ++maxOrder,
          color: unitColors[index % unitColors.length],
          createdAt: timestamp,
          updatedAt: timestamp
        };

        next = { ...next, units: [...next.units, unit] };

        chapter.words.forEach((word) => {
          wordInputs.push({
            ...hydrateWordInput(next, word),
            unitId,
            note: `词书：${bookTitle}${chaptersToCreate.length > 1 ? ` / ${chapterTitle}` : ""}`,
            tags: "自定义词书"
          });
        });
      });

      return addWordsBatchWithAudio(next, wordInputs, current.settings.speechLang, { maxAudioLookups: 30 });
    });

    closeCustomBookModal();
    resetCustomBookDraft();
  };

  const removeSelectedUnit = () => {
    if (!selectedUnit) return;
    const ok = window.confirm(`删除「${selectedUnit.title}」？单词会保留，并变成未分配。`);
    if (!ok) return;
    updateData((current) => deleteUnit(current, selectedUnit.id));
    closeUnitModal();
  };

  const assignToSelected = (cardId: string) => {
    if (!selectedUnit) return;
    updateData((current) => assignCardIdsToUnit(current, [cardId], selectedUnit.id));
  };

  const importWordsToSelected = () => {
    if (!selectedUnit || bulkImportWords.length === 0) return;
    const unitId = selectedUnit.id;
    const unitTitle = selectedUnit.title;
    const wordsToImport = bulkImportWords;
    const duplicateCount = bulkDuplicateCount;
    void updateDataAsync((current) =>
      addWordsBatchWithAudio(
        current,
        wordsToImport.map((word) => ({
          ...hydrateWordInput(current, word),
          unitId,
          note: `词书：${unitTitle}`,
          tags: "批量导入"
        })),
        current.settings.speechLang,
        { maxAudioLookups: 25 }
      )
    ).then((result) => {
      setBulkImportText("");
      const audioDetail = result.audioAttached ? `，附加真实发音 ${result.audioAttached} 个` : "";
      setBulkImportMessage(`已导入 ${wordsToImport.length} 个：新增 ${result.created} 个，合并 ${result.merged} 个${audioDetail}${duplicateCount ? `，忽略重复 ${duplicateCount} 行` : ""}。`);
    });
  };

  const clearBulkImportMessage = () => {
    if (bulkImportMessage) {
      setBulkImportMessage("");
    }
  };

  const removeFromSelected = (cardId: string) => {
    updateData((current) => removeCardFromUnit(current, cardId));
  };

  return (
    <div className="page units-page">
      <PageHeader
        eyebrow="Units"
        title="单元"
        description="把单词按单元组织起来，再按单元进入拼写或复习。"
      />

      <section className="vocab-goal-panel" aria-label="单词书目标">
        <div className="vocab-goal-main">
          <div>
            <span className="eyebrow">Vocabulary Goal</span>
            <h2>{goalStats.completionPercent}% 完成</h2>
            <p>{goalStats.mastered} / {goalStats.total} 已掌握 · 预计 {goalStats.estimatedDays} 天完成剩余词</p>
          </div>
          <div className="vocab-goal-ring" aria-label={`完成百分比 ${goalStats.completionPercent}%`}>
            <span style={{ "--goal-percent": `${goalStats.completionPercent * 3.6}deg` } as CSSProperties}>
              {goalStats.completionPercent}%
            </span>
          </div>
        </div>
        <div className="vocab-goal-stats">
          <div>
            <Target size={14} />
            <span>总词数</span>
            <strong>{goalStats.total}</strong>
          </div>
          <div>
            <Plus size={14} />
            <span>新词</span>
            <strong>{goalStats.newWords}</strong>
          </div>
          <div>
            <Keyboard size={14} />
            <span>学习中</span>
            <strong>{goalStats.learning}</strong>
          </div>
          <div>
            <CalendarDays size={14} />
            <span>今日待复习</span>
            <strong>{goalStats.dueToday}</strong>
          </div>
        </div>
      </section>

      <section className="unit-library">
        {units.length === 0 && (
          <EmptyState title="还没有单元" description="可以新建一个单元，或者刷新后使用内置核心100单元。" />
        )}

        <div className="unit-group-toolbar">
          <span className="unit-group-toolbar-hint">书架分组：把同一套词书放在一起</span>
          <button className="secondary-button compact-button" type="button" onClick={() => setIsGroupFormOpen((current) => !current)}>
            <Plus size={15} />
            {isGroupFormOpen ? "收起" : "新建分组"}
          </button>
        </div>

        {isGroupFormOpen && (
          <form className="unit-group-create" onSubmit={createGroup}>
            <div>
              <span className="eyebrow">Groups</span>
              <h2>书架分组</h2>
              <p>分组颜色会同步到组内词书封面。</p>
            </div>
            <label>
              分组名
              <input
                value={newGroupTitle}
                onChange={(event) => setNewGroupTitle(event.target.value)}
                placeholder="例如：核心100 / 考研高频"
              />
            </label>
            <div className="unit-group-create-actions">
              <div className="color-picker-row compact" aria-label="新分组颜色">
                {unitColors.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={newGroupColor === item ? "selected" : ""}
                    style={{ background: item }}
                    title={item}
                    onClick={() => setNewGroupColor(item)}
                  />
                ))}
              </div>
              <div className="button-row">
                <button className="primary-button" type="submit" disabled={!newGroupTitle.trim()}>
                  <Plus size={17} />
                  新建分组
                </button>
                <button className="secondary-button" type="button" onClick={() => setIsGroupFormOpen(false)}>
                  取消
                </button>
              </div>
            </div>
          </form>
        )}

        {groupedUnitSections.map((section) => {
          const isUngrouped = !section.id;
          const isEditingGroup = Boolean(section.id && editingGroupId === section.id);
          const isDropTarget = Boolean(section.id && draggingUnitId && dropTargetGroupId === section.id);
          const canReceiveDrop = Boolean(section.id && draggingUnitId);
          return (
            <section
              className={`unit-group-section ${isUngrouped ? "unit-group-section-ungrouped" : ""} ${canReceiveDrop ? "is-droppable" : ""} ${isDropTarget ? "is-drop-target" : ""}`}
              key={section.id || "ungrouped"}
              style={{ "--group-color": section.color } as CSSProperties}
              onDragOver={section.id ? (event) => handleGroupDragOver(event, section.id) : undefined}
              onDragLeave={section.id ? (event) => handleGroupDragLeave(event, section.id) : undefined}
              onDrop={section.id ? (event) => handleGroupDrop(event, section.id) : undefined}
            >
              {isEditingGroup ? (
                <form className="unit-group-edit" onSubmit={saveGroupEdit}>
                  <input
                    value={editingGroupTitle}
                    onChange={(event) => setEditingGroupTitle(event.target.value)}
                    aria-label="分组名称"
                  />
                  <div className="color-picker-row compact" aria-label="分组颜色">
                    {unitColors.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className={editingGroupColor === item ? "selected" : ""}
                        style={{ background: item }}
                        title={item}
                        onClick={() => setEditingGroupColor(item)}
                      />
                    ))}
                  </div>
                  <button className="primary-button compact-button" type="submit" disabled={!editingGroupTitle.trim() || !hasGroupEditChanges}>保存</button>
                  <button className="secondary-button compact-button" type="button" onClick={() => setEditingGroupId(null)}>取消</button>
                </form>
              ) : (
                <header className="unit-group-header">
                  <div>
                    <span className="unit-group-chip" aria-hidden="true" />
                    <h2>{section.title}</h2>
                    <p>{section.units.length} 本词书</p>
                  </div>
                  {!isUngrouped && (
                    <div className="unit-group-tools">
                      <button className="secondary-button compact-button" type="button" onClick={() => startGroupEdit(section.id)}>
                        <Settings2 size={15} />
                        编辑分组
                      </button>
                      <button className="icon-button" type="button" title="删除分组" onClick={() => removeGroup(section.id)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </header>
              )}

              {isDropTarget && <p className="unit-group-drop-hint">松开后移入「{section.title}」</p>}

              {section.units.length === 0 ? (
                <p className="unit-group-empty">这个分组还没有词书。可以在词书管理里把词书移动进来。</p>
              ) : (
                <div className="unit-book-grid">
                  {section.units.map((unit, index) => {
                    const stats = getUnitStats(data, unit);
                    const progress = stats.completionPercent;
                    const visibleProgress = stats.total === 0 ? 0 : Math.max(6, progress);
                    const volume = String(unit.order || index + 1).padStart(2, "0");
                    const group = unit.groupId ? unitGroupMap.get(unit.groupId) : undefined;
                    const coverStart = unit.color || group?.color || section.color;
                    const coverEnd = getUnitCoverEnd(coverStart);
                    const isDraggable = isUnitUngrouped(unit);
                    return (
                      <button
                        type="button"
                        key={unit.id}
                        className={`unit-book-card ${selectedUnit?.id === unit.id ? "selected" : ""} ${isDraggable ? "is-draggable" : ""} ${draggingUnitId === unit.id ? "is-dragging" : ""}`}
                        aria-haspopup="dialog"
                        onClick={() => handleUnitCardClick(unit.id)}
                        draggable={isDraggable}
                        onDragStart={(event) => handleUnitDragStart(event, unit.id)}
                        onDragEnd={handleUnitDragEnd}
                        style={{
                          "--book-start": coverStart,
                          "--book-end": coverEnd,
                          "--book-progress": coverStart
                        } as CSSProperties}
                      >
                        <span className="unit-book-spine" aria-hidden="true" />
                        <span className="unit-book-volume">Vol. {volume}</span>
                        <strong>{unit.title}</strong>
                        <span className="unit-book-date">{formatUnitCoverDate(unit.createdAt)}</span>
                        <span className="unit-book-number" aria-hidden="true">{volume}</span>
                        <div className="unit-book-progress">
                          <i style={{ width: `${visibleProgress}%` }} />
                        </div>
                        <em>{stats.mastered} / {stats.total}</em>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}

        {importResultMessage && (
          <div className="unit-import-banner" role="status">
            <CheckCircle2 size={16} />
            <span>{importResultMessage}</span>
            <button type="button" className="unit-import-banner-close" title="关闭提示" onClick={() => setImportResultMessage("")}>
              <X size={14} />
            </button>
          </div>
        )}

        <div className="unit-book-grid unit-create-grid">
          <button
            className="unit-book-card unit-create-card unit-create-vocab"
            type="button"
            title="新建自定义词书"
            aria-label="新建自定义词书"
            onClick={openCustomBookModal}
          >
            <span className="unit-book-spine" aria-hidden="true" />
            <span className="unit-create-badge"><Plus size={16} /> 新建</span>
            <span className="unit-book-volume">New</span>
            <strong>自定义词书</strong>
            <span className="unit-book-date">CREATE BOOK</span>
            <span className="unit-book-number" aria-hidden="true">+</span>
            <div className="unit-book-progress">
              <i />
            </div>
            <em>添加单词</em>
          </button>
          <Link
            to="/import"
            className="unit-book-card unit-create-card unit-create-listening"
            title="新建自定义精听"
            aria-label="新建自定义精听"
          >
            <span className="unit-book-spine" aria-hidden="true" />
            <span className="unit-create-badge"><Plus size={16} /> 新建</span>
            <span className="unit-book-volume">New</span>
            <strong>自定义精听</strong>
            <span className="unit-book-date">CREATE LISTEN</span>
            <span className="unit-book-number" aria-hidden="true">+</span>
            <div className="unit-book-progress">
              <i />
            </div>
            <em>导入材料</em>
          </Link>
          <button
            className="unit-book-card unit-create-card unit-create-import"
            type="button"
            title="从文件导入词书"
            aria-label="从文件导入词书"
            onClick={openImportBookModal}
          >
            <span className="unit-book-spine" aria-hidden="true" />
            <span className="unit-create-badge"><Upload size={16} /> 导入</span>
            <span className="unit-book-volume">New</span>
            <strong>导入词书</strong>
            <span className="unit-book-date">IMPORT BOOK</span>
            <span className="unit-book-number" aria-hidden="true">↑</span>
            <div className="unit-book-progress">
              <i />
            </div>
            <em>txt / csv 文件</em>
          </button>
        </div>
      </section>

      {isCustomBookOpen && (
        <div className="custom-book-layer" role="presentation">
          <form className="custom-book-modal" role="dialog" aria-modal="true" aria-label="创建自定义词书" onSubmit={createCustomBook}>
            <button className="custom-book-close" type="button" title="关闭弹窗" onClick={closeCustomBookModal}>
              <X size={20} />
            </button>

            <header className="custom-book-header">
              <label className="custom-book-name">
                <span><b>*</b> 单词书名称</span>
                <input
                  id="custom-book-title"
                  value={customBookTitle}
                  onChange={(event) => setCustomBookTitle(event.target.value)}
                  maxLength={9}
                  placeholder="最多输入 9 个字"
                  autoFocus
                />
              </label>

              <label className="custom-book-share">
                <span>分享到社区</span>
                <button
                  className={`toggle-switch ${shareCustomBook ? "selected" : ""}`}
                  type="button"
                  role="switch"
                  aria-checked={shareCustomBook}
                  onClick={() => setShareCustomBook((current) => !current)}
                >
                  <i />
                </button>
              </label>

              <div className="custom-book-limit">
                <span><b>*</b> 每章单词数</span>
                <div className="chapter-limit-control" aria-label="每章单词数">
                  {chapterLimitOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={customChapterLimit === option ? "selected" : ""}
                      onClick={() => setCustomChapterLimit(option)}
                    >
                      {option}个
                    </button>
                  ))}
                  <button
                    type="button"
                    className={customChapterLimit === "custom" ? "selected" : ""}
                    onClick={() => setCustomChapterLimit("custom")}
                  >
                    自定义
                  </button>
                </div>
              </div>
            </header>

            <div className="custom-book-toolbar">
              <button
                className={`text-action ${isReorderingChapters ? "selected" : ""}`}
                type="button"
                onClick={() => setIsReorderingChapters((current) => !current)}
              >
                调整排序
              </button>
              <button className="text-action" type="button" onClick={addCustomChapter}>
                添加章节
              </button>
              <span>{customFilledChapters.length} 章 · {customTotalWords} 词</span>
            </div>

            <div className="custom-chapter-grid">
              {customChapterDrafts.map((chapter, index) => {
                const isOverLimit = typeof customChapterLimit === "number" && chapter.words.length > customChapterLimit;
                return (
                  <section className="custom-chapter-card" key={chapter.id}>
                    <div className="custom-chapter-actions">
                      {isReorderingChapters && (
                        <>
                          <button type="button" title="前移章节" disabled={index === 0} onClick={() => moveCustomChapter(chapter.id, -1)}>
                            <ArrowLeft size={16} />
                          </button>
                          <button type="button" title="后移章节" disabled={index === customChapters.length - 1} onClick={() => moveCustomChapter(chapter.id, 1)}>
                            <ArrowRight size={16} />
                          </button>
                        </>
                      )}
                      <button type="button" title="删除章节" disabled={customChapters.length === 1} onClick={() => removeCustomChapter(chapter.id)}>
                        <X size={16} />
                      </button>
                    </div>
                    <input
                      value={chapter.title}
                      onChange={(event) => updateCustomChapter(chapter.id, { title: event.target.value })}
                      placeholder={`list${index + 1}`}
                    />
                    <textarea
                      value={chapter.content}
                      onChange={(event) => updateCustomChapter(chapter.id, { content: event.target.value })}
                      placeholder={"一行一个，不用输入中文释义，\n支持短语，示例如下\napple\nability\nair"}
                    />
                    <p className={isOverLimit ? "chapter-count over-limit" : "chapter-count"}>
                      {chapter.words.length} 词{isOverLimit ? `，已超过 ${customChapterLimit} 词` : ""}
                    </p>
                  </section>
                );
              })}
              <button className="custom-chapter-add" type="button" onClick={addCustomChapter}>
                <Plus size={28} />
                <span>添加章节</span>
              </button>
            </div>

            <footer className="custom-book-footer">
              <button className="secondary-button" type="button" onClick={closeCustomBookModal}>取消</button>
              <button className="primary-button" type="submit" disabled={!canCreateCustomBook}>确定</button>
            </footer>
          </form>
        </div>
      )}

      {isImportBookOpen && (
        <div className="custom-book-layer" role="presentation">
          <form
            className="custom-book-modal import-book-modal"
            role="dialog"
            aria-modal="true"
            aria-label="导入词书"
            onSubmit={importBookFromFile}
          >
            <button className="custom-book-close" type="button" title="关闭弹窗" onClick={closeImportBookModal}>
              <X size={20} />
            </button>

            <header className="custom-book-header import-book-header">
              <label className="custom-book-name">
                <span><b>*</b> 词书名称</span>
                <input
                  value={importBookTitle}
                  onChange={(event) => setImportBookTitle(event.target.value)}
                  maxLength={20}
                  placeholder="默认使用文件名"
                  autoFocus
                />
              </label>

              <label className="custom-book-share import-book-group">
                <span>所属分组</span>
                <select value={importGroupId} onChange={(event) => setImportGroupId(event.target.value)}>
                  <option value="">未分组</option>
                  <option value="__new__">新建分组（书名）</option>
                  {unitGroups.map((group) => (
                    <option key={group.id} value={group.id}>{group.title}</option>
                  ))}
                </select>
              </label>

              <div className="custom-book-limit">
                <span>自动分章</span>
                <div className="chapter-limit-control" aria-label="自动分章">
                  <button
                    type="button"
                    className={importSplitSize === null ? "selected" : ""}
                    onClick={() => setImportSplitSize(null)}
                  >
                    按文件
                  </button>
                  {importSplitOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={importSplitSize === option ? "selected" : ""}
                      onClick={() => setImportSplitSize(option)}
                    >
                      {option}个
                    </button>
                  ))}
                </div>
              </div>
            </header>

            <div className="custom-book-toolbar import-book-toolbar">
              {importFileName ? (
                <>
                  <span className="import-file-chip"><FileText size={14} /> {importFileName}</span>
                  <span>
                    {importChapterPreview.length} 本词书 · {importTotalWords} 词 · 新增 {importWordStats.newCount} / 合并 {importWordStats.existing}
                  </span>
                  <button className="text-action" type="button" onClick={() => importFileInputRef.current?.click()}>
                    重新选择
                  </button>
                  <button className="text-action" type="button" onClick={resetImportDraft}>
                    清除
                  </button>
                </>
              ) : (
                <span>选择 txt / csv 文件，一行一个单词；用「# 章节名」或章节列划分多本词书。</span>
              )}
            </div>

            <div className="import-book-body">
              {!importFileName ? (
                <div
                  className={`import-dropzone ${isImportDragOver ? "is-dragover" : ""}`}
                  role="button"
                  tabIndex={0}
                  aria-label="选择或拖入词书文件"
                  onClick={() => importFileInputRef.current?.click()}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      importFileInputRef.current?.click();
                    }
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsImportDragOver(true);
                  }}
                  onDragLeave={() => setIsImportDragOver(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setIsImportDragOver(false);
                    const file = event.dataTransfer.files?.[0];
                    if (file) void handleImportFile(file);
                  }}
                >
                  <FileUp size={32} />
                  <strong>点击选择或拖入文件</strong>
                  <p>支持 .txt / .csv / .tsv（UTF-8 或 GBK 编码），单次最多导入 5000 词</p>
                  <p>TXT：一行一个单词，支持「单词 释义」「单词,释义」「单词[TAB]释义」「单词 /音标/ 词性. 释义」</p>
                  <p>CSV：列头支持 word/单词、translation/释义、phonetic/音标、pos/词性、chapter/章节</p>
                  {isReadingFile && <p className="import-book-status">正在读取文件…</p>}
                  {!isReadingFile && importError && <p className="import-book-status is-error">{importError}</p>}
                </div>
              ) : (
                <>
                  <div className="custom-chapter-grid import-chapter-grid">
                    {importChapterPreview.map((chapter, index) => (
                      <section className="custom-chapter-card import-chapter-card" key={`${chapter.title}-${index}`}>
                        <div className="import-chapter-head">
                          <input value={chapter.title.trim() || `list${index + 1}`} readOnly aria-label={`第 ${index + 1} 本词书名称`} />
                          <span className="chapter-count">{chapter.words.length} 词</span>
                        </div>
                        <p className="import-chapter-words">
                          {chapter.words.slice(0, 6).map((word) => word.word).join(" · ")}
                          {chapter.words.length > 6 ? ` …等 ${chapter.words.length} 词` : ""}
                        </p>
                      </section>
                    ))}
                  </div>
                  {importWarning && <p className="import-book-status">{importWarning}</p>}
                </>
              )}
            </div>

            <footer className="custom-book-footer">
              <button className="secondary-button" type="button" onClick={closeImportBookModal}>取消</button>
              <button className="primary-button" type="submit" disabled={!canImportBook}>
                {isImporting ? "导入中…" : "导入词书"}
              </button>
            </footer>

            <input
              ref={importFileInputRef}
              type="file"
              accept=".txt,.csv,.tsv,text/plain,text/csv"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) void handleImportFile(file);
              }}
            />
          </form>
        </div>
      )}

      {selectedUnit && selectedStats && isUnitModalOpen && (
        <div className="unit-modal-layer" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            closeUnitModal();
          }
        }}>
          <section
            className="unit-modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="unit-modal-title"
            style={{ "--unit-color": selectedUnit.color || unitGroupMap.get(selectedUnit.groupId ?? "")?.color || "#ff5a1f" } as CSSProperties}
          >
            <header className="unit-modal-header">
              <div>
                <span className="eyebrow">Unit Words</span>
                <h2 id="unit-modal-title">{selectedUnit.title}</h2>
                <p>{selectedUnit.description || "自定义单元"}</p>
              </div>
              <div className="unit-modal-head-side">
                <div
                  className="unit-modal-completion"
                  role="img"
                  aria-label={`完成度 ${selectedStats.completionPercent}%`}
                >
                  <strong>
                    {selectedStats.completionPercent}
                    <i>%</i>
                  </strong>
                  <span>已完成</span>
                </div>
                <button className="icon-button unit-modal-close" type="button" title="关闭弹窗" onClick={closeUnitModal}>
                  <X size={18} />
                </button>
              </div>
            </header>

            <div className="unit-modal-progress" aria-label="单元学习数据">
              <div
                className="unit-progress-track"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={selectedStats.completionPercent}
                aria-label="掌握进度"
              >
                <div className="unit-progress-fill" style={{ width: `${selectedStats.completionPercent}%` }} />
              </div>
              <div className="unit-stat-row">
                <div className="unit-stat">
                  <span>已掌握</span>
                  <strong>
                    {selectedStats.mastered}
                    <em> / {selectedStats.total}</em>
                  </strong>
                </div>
                <div className="unit-stat">
                  <span>新词</span>
                  <strong>{selectedStats.newWords}</strong>
                </div>
                <div className="unit-stat">
                  <span>学习中</span>
                  <strong>{selectedStats.learning}</strong>
                </div>
                <div className="unit-stat">
                  <span>今日到期</span>
                  <strong className={selectedStats.due > 0 ? "is-due" : ""}>{selectedStats.due}</strong>
                </div>
              </div>
              <p className="unit-substats">
                正确率 {selectedStats.accuracy || 0}%
                {selectedStats.reviewed > 0 && <> · 已测 {selectedStats.reviewed} 次</>}
                {selectedStats.estimatedDays > 0 && <> · 预计 {selectedStats.estimatedDays} 天完成</>}
                {selectedWeakCount > 0 && <> · 薄弱词 {selectedWeakCount}</>}
              </p>
            </div>

            <div className="unit-modal-actions">
              <div className="unit-learning-actions">
                <Link to={`/spelling?unit=${selectedUnit.id}`} className="primary-button" onClick={closeUnitModal}>
                  <Keyboard size={17} />
                  开始拼写
                </Link>
                <Link to={`/spelling?unit=${selectedUnit.id}&mode=mistakes`} className="secondary-button" onClick={closeUnitModal}>
                  <Flame size={17} />
                  错词专项
                </Link>
                <Link to={`/words?unit=${selectedUnit.id}`} className="secondary-button" onClick={closeUnitModal}>
                  查看单词
                </Link>
              </div>
              <button className={`secondary-button unit-manage-toggle ${isEditing ? "selected" : ""}`} type="button" onClick={() => setIsEditing((current) => !current)}>
                <Settings2 size={17} />
                管理词书
              </button>
            </div>

            {isEditing && (
              <form className="unit-manage-panel unit-edit-form" onSubmit={saveSelectedUnit}>
                <div className="unit-manage-header">
                  <div>
                    <span className="eyebrow">Manage</span>
                    <h2>词书信息</h2>
                    <p>调整名称、说明和封面标识色。删除只移除词书，单词会保留。</p>
                  </div>
                  <button className="danger-button" type="button" onClick={removeSelectedUnit}>
                    <Trash2 size={16} />
                    删除词书
                  </button>
                </div>
                <div className="form-grid">
                  <label>
                    词书名
                    <input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} />
                  </label>
                  <label>
                    说明
                    <input value={editDescription} onChange={(event) => setEditDescription(event.target.value)} />
                  </label>
                  <label>
                    所属分组
                    <select
                      value={editGroupId}
                      onChange={(event) => {
                        const nextGroupId = event.target.value;
                        setEditGroupId(nextGroupId);
                        const nextGroup = unitGroupMap.get(nextGroupId);
                        if (nextGroup) setEditColor(nextGroup.color);
                      }}
                    >
                      <option value="">未分组</option>
                      {unitGroups.map((group) => (
                        <option key={group.id} value={group.id}>{group.title}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="unit-edit-footer">
                  <div className="unit-edit-color-panel">
                    <span>封面颜色</span>
                    <div className="color-picker-row">
                      {unitColors.map((item) => (
                        <button
                          key={item}
                          type="button"
                          className={editColor === item ? "selected" : ""}
                          style={{ background: item }}
                          title={item}
                          onClick={() => setEditColor(item)}
                        />
                      ))}
                    </div>
                    <button
                      className="text-action"
                      type="button"
                      disabled={!editGroupId || !unitGroupMap.get(editGroupId)}
                      onClick={applySelectedGroupColor}
                    >
                      应用分组色
                    </button>
                  </div>
                  <div className="button-row">
                    <button className="primary-button" type="submit">保存修改</button>
                    <button className="secondary-button" type="button" onClick={() => setIsEditing(false)}>
                      取消
                    </button>
                  </div>
                </div>
              </form>
            )}

            <div className="unit-tabs-header unit-modal-tabs">
              <div>
                <span className="eyebrow">Words</span>
                <h2>{activeWordTab === "current" ? "本单元单词" : "添加/导入单词"}</h2>
              </div>
              <div className="segmented-tabs">
                <button
                  type="button"
                  className={activeWordTab === "current" ? "selected" : ""}
                  onClick={() => {
                    setIsEditing(false);
                    setActiveWordTab("current");
                  }}
                >
                  本单元 {selectedCards.length}
                </button>
                <button
                  type="button"
                  className={activeWordTab === "assign" ? "selected" : ""}
                  onClick={() => {
                    setIsEditing(false);
                    setActiveWordTab("assign");
                  }}
                >
                  加入单词
                </button>
              </div>
            </div>

            <div className="unit-modal-body">
              {activeWordTab === "current" ? (
                selectedCards.length === 0 ? (
                  <EmptyState title="这个词书还没有词" description="切到「加入单词」，可以搜索已有单词，也可以直接批量粘贴导入。" />
                ) : (
                  <div className="compact-word-list unit-modal-word-list">
                    {selectedCards.map((card) => {
                      const details = getWordDetails(data, card.id);
                      const statusLabel =
                        card.status === "new"
                          ? "新词"
                          : card.status === "mastered"
                            ? "已掌握"
                            : card.status === "review"
                              ? "复习中"
                              : "学习中";
                      return (
                        <article key={card.id}>
                          <span className={`word-dot d-${card.status || "learning"}`} title={statusLabel} aria-label={statusLabel} />
                          <div>
                            <strong>{card.front}</strong>
                            <span>{details?.phonetic}</span>
                            <p>{card.back}</p>
                          </div>
                          <button className="icon-button word-remove" type="button" title="移出单元" onClick={() => removeFromSelected(card.id)}>
                            <X size={16} />
                          </button>
                        </article>
                      );
                    })}
                  </div>
                )
              ) : (
                <div className="unit-assign-view">
                  <div className="unit-import-toolbar">
                    <div className="segmented-control" aria-label="添加单词方式">
                      <button
                        type="button"
                        className={assignMode === "search" ? "selected" : ""}
                        onClick={() => setAssignMode("search")}
                      >
                        <Search size={15} />
                        搜索加入
                      </button>
                      <button
                        type="button"
                        className={assignMode === "bulk" ? "selected" : ""}
                        onClick={() => setAssignMode("bulk")}
                      >
                        <Upload size={15} />
                        批量导入
                      </button>
                    </div>
                    {bulkImportMessage && <span className="unit-import-message">{bulkImportMessage}</span>}
                  </div>

                  {assignMode === "search" ? (
                    <>
                      <div className="search-box compact-search">
                        <Search size={17} />
                        <input
                          value={assignQuery}
                          onChange={(event) => setAssignQuery(event.target.value)}
                          placeholder="搜索单词；空白时显示未分配词"
                        />
                      </div>

                      {availableCards.length === 0 ? (
                        <p className="muted">没有可加入的单词。可以切到「批量导入」，一行一个直接添加到「{selectedUnit.title}」。</p>
                      ) : (
                        <div className="compact-word-list unit-modal-word-list assign-list">
                          {availableCards.map((card) => {
                            const fromUnit = data.units.find((unit) => unit.id === card.unitId);
                            return (
                              <article key={card.id}>
                                <div>
                                  <strong>{card.front}</strong>
                                  <span>{fromUnit ? fromUnit.title : "未分配"}</span>
                                  <p>{card.back}</p>
                                </div>
                                <button className="secondary-button compact-button" type="button" onClick={() => assignToSelected(card.id)}>
                                  加入
                                </button>
                              </article>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="unit-bulk-import-panel">
                      <label className="unit-bulk-textarea">
                        <span>粘贴单词</span>
                        <textarea
                          value={bulkImportText}
                        onChange={(event) => {
                            setBulkImportText(event.target.value);
                            clearBulkImportMessage();
                          }}
                          placeholder={"一行一个单词或短语\napple\nability\ntake advantage of"}
                        />
                      </label>
                      <div className="unit-import-summary" aria-label="批量导入预览">
                        <div>
                          <span>可导入</span>
                          <strong>{bulkImportWords.length}</strong>
                        </div>
                        <div>
                          <span>新增</span>
                          <strong>{bulkNewCount}</strong>
                        </div>
                        <div>
                          <span>合并</span>
                          <strong>{bulkExistingCount}</strong>
                        </div>
                        <div>
                          <span>重复行</span>
                          <strong>{bulkDuplicateCount}</strong>
                        </div>
                      </div>
                      <div className="unit-import-footer">
                        <p>导入时会自动匹配本地词典释义；已有单词会合并并加入当前词书。</p>
                        <button className="primary-button" type="button" disabled={bulkImportWords.length === 0} onClick={importWordsToSelected}>
                          <Plus size={17} />
                          导入到词书
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
