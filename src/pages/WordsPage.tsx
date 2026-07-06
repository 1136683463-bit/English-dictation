import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  Mic2,
  Plus,
  Search,
  Star,
  Trash2,
  Upload
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useAppData } from "../AppContext";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import SpeakButton from "../components/SpeakButton";
import {
  addOrUpdateWordWithAudio,
  deleteCard,
  getWordDetails,
  hydrateWordInput,
  hydrateWordInputAsync,
  readAudioFileAsDataUrl,
  togglePriority,
  updateWordAudio,
  WordInput
} from "../services/cardService";
import { findDictionaryEntry, findDictionaryEntryAsync, searchDictionaryAsync } from "../services/dictionaryService";
import type { DictionaryEntry } from "../types";

const emptyInput: WordInput = {
  word: "",
  translation: "",
  phonetic: "",
  partOfSpeech: "",
  englishDefinition: "",
  collocations: "",
  sourceSentence: "",
  unitId: "",
  note: "",
  tags: ""
};

const hydratableFields: Array<keyof Pick<
  WordInput,
  "translation" | "phonetic" | "partOfSpeech" | "englishDefinition" | "collocations"
>> = ["translation", "phonetic", "partOfSpeech", "englishDefinition", "collocations"];

type HydratableField = (typeof hydratableFields)[number];
type AutoHydratedFields = Pick<WordInput, HydratableField> & { word: string };

const toAutoHydratedFields = (input: WordInput): AutoHydratedFields => ({
  word: input.word,
  translation: input.translation,
  phonetic: input.phonetic,
  partOfSpeech: input.partOfSpeech,
  englishDefinition: input.englishDefinition,
  collocations: input.collocations
});

export default function WordsPage() {
  const { data, updateData, updateDataAsync } = useAppData();
  const [searchParams, setSearchParams] = useSearchParams();
  const unitFilter = searchParams.get("unit") ?? "";
  const [query, setQuery] = useState("");
  const [input, setInput] = useState<WordInput>(() => ({ ...emptyInput, unitId: unitFilter }));
  const [lookupStatus, setLookupStatus] = useState<"idle" | "loading" | "hit" | "miss">("idle");
  const [isHydratingDraft, setIsHydratingDraft] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [dictionaryMatches, setDictionaryMatches] = useState<DictionaryEntry[]>([]);
  const [isDictionarySearching, setIsDictionarySearching] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ tone: "success" | "merge"; title: string; detail: string } | null>(
    null
  );
  const [audioMessage, setAudioMessage] = useState<{ cardId: string; text: string; tone: "success" | "error" } | null>(
    null
  );
  const wordInputRef = useRef<HTMLInputElement>(null);
  const lookupRequestRef = useRef(0);
  const autoHydratedRef = useRef<AutoHydratedFields | null>(null);

  const savedWordSet = useMemo(
    () => new Set(data.wordDetails.map((details) => details.word.toLowerCase())),
    [data.wordDetails]
  );

  const words = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return data.cards
      .filter((card) => card.type === "word")
      .filter((card) => !unitFilter || card.unitId === unitFilter)
      .filter((card) => {
        if (!normalized) return true;
        return (
          card.front.toLowerCase().includes(normalized) ||
          card.back.toLowerCase().includes(normalized) ||
          card.tags.some((tag) => tag.toLowerCase().includes(normalized))
        );
      })
      .sort((a, b) => Number(b.priority) - Number(a.priority) || b.createdAt.localeCompare(a.createdAt));
  }, [data.cards, query, unitFilter]);

  const existingDraft = useMemo(() => {
    const normalized = input.word.trim().toLowerCase();
    if (!normalized) return undefined;
    const details = data.wordDetails.find((item) => item.word.toLowerCase() === normalized);
    if (!details) return undefined;
    const card = data.cards.find((item) => item.id === details.cardId);
    return { card, details };
  }, [data.cards, data.wordDetails, input.word]);

  const unsavedDictionaryMatches = useMemo(
    () => dictionaryMatches.filter((entry) => !savedWordSet.has(entry.word.toLowerCase())),
    [dictionaryMatches, savedWordSet]
  );

  useEffect(() => {
    const normalized = query.trim();
    let cancelled = false;

    if (!normalized) {
      setDictionaryMatches([]);
      setIsDictionarySearching(false);
      return;
    }

    setIsDictionarySearching(true);
    void searchDictionaryAsync(data, normalized)
      .then((entries) => {
        if (!cancelled) setDictionaryMatches(entries);
      })
      .catch(() => {
        if (!cancelled) setDictionaryMatches([]);
      })
      .finally(() => {
        if (!cancelled) setIsDictionarySearching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [data, query]);

  const dictionaryEntryToInput = (entry: DictionaryEntry): WordInput => ({
    ...emptyInput,
    word: entry.word.trim().toLowerCase(),
    translation: entry.translation,
    phonetic: entry.phonetic,
    partOfSpeech: entry.partOfSpeech,
    englishDefinition: entry.definition,
    collocations: entry.collocations,
    unitId: unitFilter,
    tags: "词典"
  });

  const fillFromDictionary = (entry: DictionaryEntry) => {
    const nextInput = dictionaryEntryToInput(entry);
    setInput(nextInput);
    autoHydratedRef.current = toAutoHydratedFields(nextInput);
    setLookupStatus("hit");
    setSaveMessage(null);
    setIsComposerOpen(true);
    window.setTimeout(() => wordInputRef.current?.focus(), 0);
  };

  const addDictionaryEntry = async (entry: DictionaryEntry) => {
    const result = await updateDataAsync((current) =>
      addOrUpdateWordWithAudio(current, dictionaryEntryToInput(entry), current.settings.speechLang)
    );
    setSaveMessage({
      tone: result.status === "created" ? "success" : "merge",
      title: result.status === "created" ? "已加入词典结果" : "已合并词典结果",
      detail:
        result.status === "created"
          ? `${result.word} 已加入单词本${result.audioAttached ? "，已附加真实发音" : ""}。`
          : `${result.word} 已存在，已补充可用字段${result.audioAttached ? "，并附加真实发音" : ""}。`
    });
    setIsComposerOpen(true);
  };

  const uploadAudio = (cardId: string, file: File | undefined) => {
    if (!file) return;

    void readAudioFileAsDataUrl(file)
      .then((audioUrl) => {
        updateData((current) => updateWordAudio(current, cardId, audioUrl));
        setAudioMessage({ cardId, text: `已保存真实音频：${file.name}`, tone: "success" });
      })
      .catch((error) => {
        setAudioMessage({
          cardId,
          text: error instanceof Error ? error.message : "音频上传失败。",
          tone: "error"
        });
      });
  };

  const removeAudio = (cardId: string) => {
    updateData((current) => updateWordAudio(current, cardId, ""));
    setAudioMessage({ cardId, text: "已移除真实音频，将使用系统朗读。", tone: "success" });
  };

  const lookupWord = (word: string) => {
    const requestId = lookupRequestRef.current + 1;
    lookupRequestRef.current = requestId;
    setIsHydratingDraft(false);
    const normalized = word.trim();
    const normalizedWord = normalized.toLowerCase();
    const previousAutoHydrated = autoHydratedRef.current;
    const dictionaryEntry = findDictionaryEntry(data, word);
    setLookupStatus(normalized ? (dictionaryEntry ? "hit" : "loading") : "idle");
    setSaveMessage(null);

    setInput((current) => {
      if (!dictionaryEntry) {
        return { ...current, word, unitId: current.unitId || unitFilter };
      }

      const hydrated = hydrateWordInput(data, word);
      const previousHydrated = hydrateWordInput(data, current.word);
      const next = { ...current, word, unitId: current.unitId || unitFilter };
      for (const field of hydratableFields) {
        const currentValue = current[field].trim();
        const wasAutoFilled =
          currentValue &&
          (currentValue === previousHydrated[field] ||
            (previousAutoHydrated?.word === current.word.trim().toLowerCase() &&
              currentValue === previousAutoHydrated[field]));
        if (!currentValue || wasAutoFilled) {
          next[field] = hydrated[field];
        }
      }
      return next;
    });

    if (dictionaryEntry) {
      autoHydratedRef.current = toAutoHydratedFields(hydrateWordInput(data, word));
    }

    if (!normalized) {
      autoHydratedRef.current = null;
      return;
    }

    void (async () => {
      try {
        const dictionaryEntry = await findDictionaryEntryAsync(data, word);
        if (lookupRequestRef.current !== requestId) return;

        setLookupStatus(dictionaryEntry ? "hit" : "miss");
        if (!dictionaryEntry) return;

        const hydrated = await hydrateWordInputAsync(data, word);
        if (lookupRequestRef.current !== requestId) return;

        autoHydratedRef.current = toAutoHydratedFields(hydrated);
        setInput((current) => {
          if (current.word.trim().toLowerCase() !== normalizedWord) return current;

          const next = { ...current, unitId: current.unitId || unitFilter };
          for (const field of hydratableFields) {
            const currentValue = current[field].trim();
            const wasAutoFilled =
              currentValue &&
              ((dictionaryEntry && currentValue === hydrateWordInput(data, word)[field]) ||
                currentValue === previousAutoHydrated?.[field]);
            if (!currentValue || wasAutoFilled) {
              next[field] = hydrated[field];
            }
          }
          return next;
        });
      } catch {
        if (lookupRequestRef.current === requestId) setLookupStatus("miss");
      }
    })();
  };

  const hydrateDraft = () => {
    const word = input.word.trim();
    if (!word) return;
    const requestId = lookupRequestRef.current + 1;
    lookupRequestRef.current = requestId;
    setLookupStatus("loading");
    setIsHydratingDraft(true);
    setSaveMessage(null);

    void (async () => {
      try {
        const dictionaryEntry = await findDictionaryEntryAsync(data, word);
        if (lookupRequestRef.current !== requestId) return;

        setLookupStatus(dictionaryEntry ? "hit" : "miss");
        if (!dictionaryEntry) return;

        const hydrated = await hydrateWordInputAsync(data, word);
        if (lookupRequestRef.current !== requestId) return;

        autoHydratedRef.current = toAutoHydratedFields(hydrated);
        setInput((current) => {
          if (current.word.trim().toLowerCase() !== word.toLowerCase()) return current;

          const next = { ...current, word, unitId: current.unitId || unitFilter };
          for (const field of hydratableFields) {
            if (!current[field].trim()) {
              next[field] = hydrated[field];
            }
          }
          return next;
        });
        setSaveMessage({
          tone: "success",
          title: "已补全",
          detail: `${hydrated.word} 已从内置词典填入释义、音标和搭配。`
        });
      } catch {
        if (lookupRequestRef.current === requestId) setLookupStatus("miss");
      } finally {
        if (lookupRequestRef.current === requestId) {
          setIsHydratingDraft(false);
        }
      }
    })();
  };

  useEffect(() => {
    setInput((current) => {
      const hasDraft = current.word.trim() || current.translation.trim() || current.sourceSentence.trim();
      return hasDraft ? current : { ...current, unitId: unitFilter };
    });
  }, [unitFilter]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!input.word.trim()) return;
    const result = await updateDataAsync((current) =>
      addOrUpdateWordWithAudio(current, input, current.settings.speechLang)
    );
    setSaveMessage(
      result.status === "created"
        ? {
            tone: "success",
            title: "已添加",
            detail: `${result.word} 已加入单词本${result.audioAttached ? "，已附加真实发音" : ""}，可以继续添加下一个。`
          }
        : {
            tone: "merge",
            title: "已合并",
            detail:
              result.mergedFields.length > 0
                ? `${result.word} 已存在，已补充 ${result.mergedFields.join("、")}${result.audioAttached ? "，并附加真实发音" : ""}。`
                : `${result.word} 已存在，没有新的字段需要覆盖${result.audioAttached ? "，已附加真实发音" : ""}。`
          }
    );
    setInput({ ...emptyInput, unitId: unitFilter });
    setLookupStatus("idle");
    setIsComposerOpen(true);
    window.setTimeout(() => wordInputRef.current?.focus(), 0);
  };

  const selectedUnit = data.units.find((unit) => unit.id === unitFilter);
  const priorityCount = words.filter((card) => card.priority).length;

  const phoneticHint = (() => {
    if (!input.word.trim()) return "输入英文后会查内置词典和个人词库。";
    if (lookupStatus === "loading") return "正在加载完整词典并查找。";
    if (lookupStatus === "hit") return "已从内置词典或个人词库补全，可手动修改。";
    if (lookupStatus === "miss") return "未命中词典，可手填；保存后下次会自动复用。";
    return "可手动填写，也可以留空。";
  })();

  return (
    <div className="page">
      <PageHeader
        eyebrow="Words"
        title="单词本"
        description="添加一个词时尽量带上真实来源句，后面复习会更牢。"
        action={
          <button className="primary-button" type="button" onClick={() => setIsComposerOpen((current) => !current)}>
            <Plus size={17} />
            添加单词
          </button>
        }
      />

      <section className="words-workspace">
        {isComposerOpen && (
          <form className="panel form-panel word-composer" onSubmit={submit}>
            <div className="panel-header">
              <div>
                <span className="eyebrow">New Word</span>
                <h2>添加单词</h2>
              </div>
              <div className="button-row">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={hydrateDraft}
                  disabled={!input.word.trim() || isHydratingDraft}
                >
                  <BookOpen size={16} />
                  {isHydratingDraft ? "补全中" : "词典补全"}
                </button>
                <button className="secondary-button" type="button" onClick={() => setIsComposerOpen(false)}>
                  收起
                  <ChevronUp size={16} />
                </button>
                <button className="primary-button" type="submit">
                  <Plus size={17} />
                  保存
                </button>
              </div>
            </div>
            <div className="word-composer-grid">
              <label className="word-composer-main">
                单词
                <input
                  ref={wordInputRef}
                  value={input.word}
                  onChange={(event) => lookupWord(event.target.value)}
                  placeholder="approach"
                />
              </label>
              <label>
                释义
                <input
                  value={input.translation}
                  onChange={(event) => setInput({ ...input, translation: event.target.value })}
                  placeholder="方法；接近"
                />
              </label>
              <label>
                所属单元
                <select value={input.unitId} onChange={(event) => setInput({ ...input, unitId: event.target.value })}>
                  <option value="">不分配单元</option>
                  {data.units.map((unit) => (
                    <option key={unit.id} value={unit.id}>{unit.title}</option>
                  ))}
                </select>
              </label>
              <label>
                音标
                <input
                  value={input.phonetic}
                  onChange={(event) => setInput({ ...input, phonetic: event.target.value })}
                  placeholder="/wɜːrd/"
                />
                <span className={`field-hint ${lookupStatus === "miss" ? "warning" : ""}`}>{phoneticHint}</span>
              </label>
              <label>
                词性
                <input
                  value={input.partOfSpeech}
                  onChange={(event) => setInput({ ...input, partOfSpeech: event.target.value })}
                />
              </label>
              <label>
                标签
                <input
                  value={input.tags}
                  onChange={(event) => setInput({ ...input, tags: event.target.value })}
                  placeholder="阅读 雅思"
                />
              </label>
              <label className="word-composer-wide">
                来源句
                <textarea
                  value={input.sourceSentence}
                  onChange={(event) => setInput({ ...input, sourceSentence: event.target.value })}
                  placeholder="Good learners adapt their strategy when a method stops working."
                />
              </label>
            </div>

            {(saveMessage || existingDraft) && (
              <div
                className={`composer-status ${saveMessage?.tone ?? "merge"}`}
                aria-live="polite"
              >
                {saveMessage?.tone === "success" ? <CheckCircle2 size={17} /> : <Info size={17} />}
                <div>
                  <strong>
                    {saveMessage?.title ?? "将合并到已有单词"}
                  </strong>
                  <span>
                    {saveMessage?.detail ??
                      `${existingDraft?.details.word ?? input.word.trim().toLowerCase()} 已收录，保存后会补充你这次填写的字段。`}
                  </span>
                </div>
              </div>
            )}

            <details className="word-advanced-fields">
              <summary>
                <span>更多字段</span>
                <ChevronDown size={16} />
              </summary>
              <div className="word-advanced-grid">
                <label>
                  英文解释
                  <textarea
                    value={input.englishDefinition}
                    onChange={(event) => setInput({ ...input, englishDefinition: event.target.value })}
                  />
                </label>
                <label>
                  搭配
                  <input
                    value={input.collocations}
                    onChange={(event) => setInput({ ...input, collocations: event.target.value })}
                  />
                </label>
                <label>
                  备注
                  <textarea value={input.note} onChange={(event) => setInput({ ...input, note: event.target.value })} />
                </label>
              </div>
            </details>
          </form>
        )}

        <div className="panel words-panel">
          <div className="words-toolbar">
            <div className="search-box words-search">
              <Search size={17} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索单词、释义或标签" />
            </div>
            <div className="words-summary" aria-label="当前单词统计">
              <div>
                <span>当前</span>
                <strong>{words.length}</strong>
              </div>
              <div>
                <span>重点</span>
                <strong>{priorityCount}</strong>
              </div>
              <div>
                <span>范围</span>
                <strong>{selectedUnit ? selectedUnit.title : "全部"}</strong>
              </div>
            </div>
          </div>
          <div className="filter-row">
            <button className={!unitFilter ? "selected" : ""} onClick={() => setSearchParams({})}>全部</button>
            {data.units.slice().sort((a, b) => a.order - b.order).map((unit) => (
              <button
                key={unit.id}
                className={unitFilter === unit.id ? "selected" : ""}
                onClick={() => setSearchParams({ unit: unit.id })}
              >
                {unit.title}
              </button>
            ))}
          </div>
          {query.trim() && (
            <section className="dictionary-results" aria-live="polite">
              <div className="dictionary-results-header">
                <div>
                  <span className="eyebrow">Dictionary</span>
                  <h2>词典结果</h2>
                </div>
                <span>
                  {isDictionarySearching
                    ? "搜索中"
                    : unsavedDictionaryMatches.length > 0
                      ? `${unsavedDictionaryMatches.length} 个可加入`
                      : "无未收录结果"}
                </span>
              </div>
              {isDictionarySearching ? (
                <p className="dictionary-result-note">正在搜索内置词典和个人词库。</p>
              ) : unsavedDictionaryMatches.length === 0 ? (
                <p className="dictionary-result-note">
                  没有新的词典结果。若单词已收录，会显示在下方单词列表中。
                </p>
              ) : (
                <div className="dictionary-result-list">
                  {unsavedDictionaryMatches.map((entry) => (
                    <article key={entry.word} className="dictionary-result-card">
                      <div>
                        <div className="dictionary-result-title">
                          <strong>{entry.word}</strong>
                          {entry.phonetic && <span>{entry.phonetic}</span>}
                          {entry.partOfSpeech && <em>{entry.partOfSpeech}</em>}
                        </div>
                        <p>{entry.translation || entry.definition || "暂无释义"}</p>
                        {entry.collocations && <small>{entry.collocations}</small>}
                      </div>
                      <div className="dictionary-result-actions">
                        <button className="secondary-button compact-button" type="button" onClick={() => fillFromDictionary(entry)}>
                          填入
                        </button>
                        <button className="primary-button compact-button" type="button" onClick={() => addDictionaryEntry(entry)}>
                          加入
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
          {words.length === 0 ? (
            <EmptyState title="还没有单词" description="先添加几个常用词，或者去导入页从文章里收词。" />
          ) : (
            <div className="card-list">
              {words.map((card) => {
                const details = getWordDetails(data, card.id);
                const unit = data.units.find((item) => item.id === card.unitId);
                return (
                  <article key={card.id} className={card.priority ? "item-card word-list-card priority" : "item-card word-list-card"}>
                    <header className="word-card-header">
                      <div className="item-title">
                        <div className="word-title-main">
                          <strong>{card.front}</strong>
                          {card.priority && <span className="priority-badge">重点</span>}
                        </div>
                        <SpeakButton text={card.front} audioUrl={details?.audioUrl} />
                      </div>
                      <div className="item-actions">
                        <label className="icon-button audio-upload-button" title={details?.audioUrl ? "替换真人发音" : "上传真人发音"}>
                          {details?.audioUrl ? <Mic2 size={16} /> : <Upload size={16} />}
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={(event) => {
                              uploadAudio(card.id, event.target.files?.[0]);
                              event.target.value = "";
                            }}
                          />
                        </label>
                        {details?.audioUrl && (
                          <button
                            className="icon-button danger-icon"
                            title="移除真人发音"
                            onClick={() => removeAudio(card.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        <button
                          className={`icon-button ${card.priority ? "selected" : ""}`}
                          title={card.priority ? "取消重点" : "设为重点"}
                          onClick={() => updateData((current) => togglePriority(current, card.id))}
                        >
                          <Star size={16} />
                        </button>
                        <button
                          className="icon-button"
                          title="删除单词"
                          onClick={() => updateData((current) => deleteCard(current, card.id))}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </header>
                    <p className="word-translation">{card.back || "未填写释义"}</p>
                    {audioMessage?.cardId === card.id && (
                      <div className={`audio-message ${audioMessage.tone}`} aria-live="polite">
                        {audioMessage.text}
                      </div>
                    )}
                    <div className="word-meta-line">
                      <span className={details?.phonetic ? "muted" : "phonetic-missing"}>
                        {details?.phonetic || "未填音标"}
                      </span>
                      {details?.audioUrl && <span className="audio-chip">真实音频</span>}
                      {unit && <span className="unit-pill" style={{ borderColor: unit.color }}>{unit.title}</span>}
                      {card.tags.slice(0, 3).map((tag) => <span className="tag-chip" key={tag}>{tag}</span>)}
                    </div>
                    {details?.sourceSentence && (
                      <p className="source-sentence">
                        <BookOpen size={15} />
                        <span>{details.sourceSentence}</span>
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
