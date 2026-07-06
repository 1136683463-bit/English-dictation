import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, BookPlus, CheckCircle2, FilePlus, Library, ListChecks, Plus, Table2, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppData } from "../AppContext";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import {
  addOrUpdateWordWithAudio,
  addSentence,
  addWordsBatchWithAudio,
  hydrateWordInput,
  hydrateWordInputAsync
} from "../services/cardService";
import {
  buildWordImportPreview,
  extractCandidateWords,
  ImportMode,
  ParsedWordRow,
  parseWordImportRows,
  parseWordImportRowsAsync,
  splitIntoSentences
} from "../services/importService";
import { nowIso, uid } from "../services/storage";

const importExamples: Record<ImportMode, string> = {
  text: "approach\t方法；接近\t/əˈproʊtʃ/\tn./v.\ncontext\t上下文；语境",
  csv: "word,translation,phonetic,partOfSpeech,sourceSentence,tags\napproach,方法；接近,/əˈproʊtʃ/,n./v.,A practical approach matters.,阅读"
};

interface SavedMaterialSnapshot {
  id: string;
  title: string;
  sentenceCount: number;
  candidateCount: number;
  savedAt: string;
}

export default function ImportPage() {
  const { data, updateData, updateDataAsync } = useAppData();
  const [title, setTitle] = useState("未命名材料");
  const [content, setContent] = useState("");
  const [selectedSentence, setSelectedSentence] = useState("");
  const [savedMaterial, setSavedMaterial] = useState<SavedMaterialSnapshot | null>(null);
  const [capturedWords, setCapturedWords] = useState<Set<string>>(() => new Set());
  const [capturedSentences, setCapturedSentences] = useState<Set<string>>(() => new Set());
  const [importMode, setImportMode] = useState<ImportMode>("text");
  const [wordImportText, setWordImportText] = useState("");
  const [importMessage, setImportMessage] = useState("");
  const [captureMessage, setCaptureMessage] = useState("");
  const [asyncWordImportRows, setAsyncWordImportRows] = useState<{ key: string; rows: ParsedWordRow[] } | null>(null);
  const [isHydratingWordImportRows, setIsHydratingWordImportRows] = useState(false);
  const [hydratingCandidateWords, setHydratingCandidateWords] = useState<Set<string>>(() => new Set());
  const sentences = useMemo(() => splitIntoSentences(content), [content]);
  const candidates = useMemo(() => extractCandidateWords(content), [content]);
  const existingWords = new Set(data.wordDetails.map((details) => details.word.toLowerCase()));
  const wordImportHydrationKey = `${importMode}\n${wordImportText}\n${data.wordDetails.length}\n${data.dictionaryEntries.length}`;
  const wordImportRows = useMemo(
    () => parseWordImportRows(data, wordImportText, importMode),
    [data, importMode, wordImportText]
  );
  const hydratedWordImportRows =
    asyncWordImportRows?.key === wordImportHydrationKey ? asyncWordImportRows.rows : undefined;
  const activeWordImportRows = hydratedWordImportRows ?? wordImportRows;
  const wordImportPreview = useMemo(
    () => buildWordImportPreview(data, activeWordImportRows),
    [activeWordImportRows, data]
  );
  const capturedWordsLower = useMemo(
    () => new Set(Array.from(capturedWords).map((word) => word.toLowerCase())),
    [capturedWords]
  );
  const newCandidateCount = candidates.filter((candidate) => !existingWords.has(candidate.word)).length;
  const readyCandidateWords = candidates.filter(
    (candidate) =>
      !existingWords.has(candidate.word) &&
      !capturedWordsLower.has(candidate.word) &&
      !hydratingCandidateWords.has(candidate.word)
  );
  const capturedCandidateCount = candidates.filter((candidate) => capturedWordsLower.has(candidate.word)).length;
  const existingCandidateCount = candidates.filter((candidate) => existingWords.has(candidate.word)).length;
  const pendingSentenceCount = sentences.filter((sentence) => !capturedSentences.has(sentence)).length;
  const selectedSentenceIndex = selectedSentence ? sentences.findIndex((sentence) => sentence === selectedSentence) + 1 : 0;
  const materialStatus = savedMaterial
    ? "已保存"
    : content.trim()
      ? "待保存"
      : "空材料";
  const sourceBindingLabel = savedMaterial
    ? "将绑定到当前材料"
    : content.trim()
      ? "收录时会先保存材料并绑定来源"
      : "批量词表将作为独立词卡导入";
  const nextActionTitle = savedMaterial
    ? "材料已入库，可以继续收词或开始训练。"
    : content.trim()
      ? "先保存材料，再把词句变成复习对象。"
      : "粘贴一段英文材料，导入链路会自动点亮。";

  useEffect(() => {
    if (!wordImportText.trim()) {
      setAsyncWordImportRows(null);
      setIsHydratingWordImportRows(false);
      return;
    }

    let cancelled = false;
    setIsHydratingWordImportRows(true);
    void parseWordImportRowsAsync(data, wordImportText, importMode)
      .then((rows) => {
        if (!cancelled) {
          setAsyncWordImportRows({ key: wordImportHydrationKey, rows });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAsyncWordImportRows(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsHydratingWordImportRows(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [data, importMode, wordImportHydrationKey, wordImportText]);

  const createMaterialDraft = () => {
    if (!content.trim()) return null;
    const materialId = uid("material");
    const savedAt = nowIso();
    const materialTitle = title.trim() || "未命名材料";
    return {
      snapshot: {
        id: materialId,
        title: materialTitle,
        sentenceCount: sentences.length,
        candidateCount: candidates.length,
        savedAt
      },
      material: {
        id: materialId,
        title: materialTitle,
        type: "text" as const,
        content,
        sourceUrl: "",
        tags: [],
        createdAt: savedAt
      },
      segments: sentences.map((sentence, index) => ({
        id: uid("segment"),
        materialId,
        index,
        text: sentence,
        createdAt: savedAt
      }))
    };
  };

  const persistMaterialDraft = (draft: NonNullable<ReturnType<typeof createMaterialDraft>>) => {
    updateData((current) => ({
      ...current,
      materials: [...current.materials, draft.material],
      materialSegments: [...current.materialSegments, ...draft.segments]
    }));
    setSavedMaterial(draft.snapshot);
    return draft.snapshot;
  };

  const saveMaterial = () => {
    const draft = createMaterialDraft();
    return draft ? persistMaterialDraft(draft) : null;
  };

  const ensureSavedMaterial = () => savedMaterial ?? saveMaterial();

  const addWord = (word: string, materialSnapshot = ensureSavedMaterial()) => {
    const normalizedWord = word.toLowerCase();
    const sourceSentence =
      selectedSentence || sentences.find((sentence) => sentence.toLowerCase().includes(normalizedWord)) || "";
    setHydratingCandidateWords((current) => new Set(current).add(word));
    setCaptureMessage("");

    void hydrateWordInputAsync(data, word)
      .then((hydrated) => {
        return updateDataAsync((current) =>
          addOrUpdateWordWithAudio(
            current,
            {
              ...hydrated,
              sourceSentence,
              sourceId: materialSnapshot?.id,
              unitId: "",
              tags: "导入"
            },
            current.settings.speechLang
          )
        ).then((result) => {
          setCapturedWords((current) => new Set(current).add(result.word));
          return result;
        });
      })
      .catch(() => {
        return updateDataAsync((current) =>
          addOrUpdateWordWithAudio(
            current,
            {
              ...hydrateWordInput(current, word),
              sourceSentence,
              sourceId: materialSnapshot?.id,
              unitId: "",
              tags: "导入"
            },
            current.settings.speechLang
          )
        ).then((result) => {
          setCapturedWords((current) => new Set(current).add(result.word));
          return result;
        });
      })
      .finally(() => {
        setHydratingCandidateWords((current) => {
          const next = new Set(current);
          next.delete(word);
          return next;
        });
      });
  };

  const addCandidateWordsBatch = () => {
    const batch = readyCandidateWords.slice(0, 20);
    if (batch.length === 0) return;
    const materialSnapshot = ensureSavedMaterial();
    batch.forEach((candidate) => addWord(candidate.word, materialSnapshot));
    setCaptureMessage(`正在收录 ${batch.length} 个新候选词。`);
  };

  const importPreviewWords = () => {
    if (wordImportPreview.importableRows.length === 0) return;
    const materialSnapshot = ensureSavedMaterial();
    const inputs = wordImportPreview.importableRows.map((row) => ({
      ...row.input,
      sourceId: row.input.sourceId || materialSnapshot?.id
    }));
    const skippedRows = wordImportPreview.stats.duplicate + wordImportPreview.stats.invalid;
    void updateDataAsync((current) =>
      addWordsBatchWithAudio(
        current,
        inputs,
        current.settings.speechLang,
        { maxAudioLookups: 25 }
      )
    ).then((result) => {
      const audioDetail = result.audioAttached ? `，附加真实发音 ${result.audioAttached} 个` : "";
      const sourceDetail = materialSnapshot ? "，已绑定当前材料" : "";
      setImportMessage(`导入完成：新增 ${result.created} 个，合并 ${result.merged} 个${audioDetail}${sourceDetail}，跳过 ${skippedRows} 行。`);
    });
  };

  const addSentenceCard = (sentence: string, materialSnapshot = ensureSavedMaterial()) => {
    updateData((current) =>
      addSentence(current, {
        sentence,
        translation: "",
        keywords: "",
        grammarNote: "",
        sourceId: materialSnapshot?.id,
        note: `来源：${title}`,
        tags: "导入"
      })
    );
    setCapturedSentences((current) => new Set(current).add(sentence));
    setCaptureMessage("");
  };

  const addSentencesBatch = () => {
    const batch = sentences.filter((sentence) => !capturedSentences.has(sentence)).slice(0, 12);
    if (batch.length === 0) return;
    const materialSnapshot = ensureSavedMaterial();
    updateData((current) =>
      batch.reduce(
        (next, sentence) =>
          addSentence(next, {
            sentence,
            translation: "",
            keywords: "",
            grammarNote: "",
            sourceId: materialSnapshot?.id,
            note: `来源：${title}`,
            tags: "导入"
          }),
        current
      )
    );
    setCapturedSentences((current) => {
      const next = new Set(current);
      batch.forEach((sentence) => next.add(sentence));
      return next;
    });
    setCaptureMessage(`已加入 ${batch.length} 个句子。`);
  };

  return (
    <div className="page import-page">
      <PageHeader
        eyebrow="Import"
        title="从材料里收词和句子"
        description="先保存材料，再从候选词和拆分句里挑选值得长期复习的内容。"
        action={
          <button className="primary-button" onClick={saveMaterial} disabled={!content.trim()}>
            <FilePlus size={17} />
            保存材料
          </button>
        }
      />

      <section className="import-command">
        <div className="import-command-copy">
          <span className="eyebrow">Capture Pipeline</span>
          <h2>材料进来，训练出去</h2>
          <p>
            当前材料已拆出 {sentences.length} 个句子、{candidates.length} 个候选词。
            {selectedSentenceIndex > 0 ? ` 已选第 ${selectedSentenceIndex} 句作为收词来源。` : " 先选一句来源句，再收录候选词会更稳。"}
          </p>
        </div>
        <div className="import-command-steps" aria-label="导入流程">
          <div className={content.trim() ? "ready" : ""}>
            <FilePlus size={17} />
            <span>贴入材料</span>
          </div>
          <div className={savedMaterial ? "ready" : ""}>
            <CheckCircle2 size={17} />
            <span>保存入库</span>
          </div>
          <div className={sentences.length > 0 ? "ready" : ""}>
            <BookOpen size={17} />
            <span>拆句挑词</span>
          </div>
          <div className={capturedWords.size > 0 || capturedSentences.size > 0 || wordImportPreview.importableRows.length > 0 ? "ready" : ""}>
            <ListChecks size={17} />
            <span>进入训练</span>
          </div>
        </div>
        <div className="import-command-stats" aria-label="导入摘要">
          <div><span>句子</span><strong>{sentences.length}</strong></div>
          <div><span>新候选</span><strong>{newCandidateCount}</strong></div>
          <div><span>可批量导入</span><strong>{wordImportPreview.importableRows.length}</strong></div>
        </div>
      </section>

      <div className={savedMaterial ? "import-source-binding ready" : "import-source-binding"} role="status">
        <CheckCircle2 size={16} />
        <span>{sourceBindingLabel}</span>
      </div>

      <section className={`import-outcome-panel ${savedMaterial ? "is-saved" : ""}`} aria-live="polite">
        <div className="import-outcome-copy">
          <span className="eyebrow">Next Step</span>
          <h2>{nextActionTitle}</h2>
          <p>
            {savedMaterial
              ? `「${savedMaterial.title}」已保存，包含 ${savedMaterial.sentenceCount} 个句子和 ${savedMaterial.candidateCount} 个候选词。`
              : "这一步会保留原文上下文，后续收录的词句就不会变成孤立卡片。"}
          </p>
        </div>
        <div className="import-outcome-stats" aria-label="本轮导入结果">
          <div>
            <span>材料状态</span>
            <strong>{materialStatus}</strong>
          </div>
          <div>
            <span>本轮收词</span>
            <strong>{capturedWords.size}</strong>
          </div>
          <div>
            <span>本轮收句</span>
            <strong>{capturedSentences.size}</strong>
          </div>
        </div>
        <div className="import-outcome-actions">
          <button className="secondary-button" onClick={saveMaterial} disabled={!content.trim()}>
            <FilePlus size={16} />
            {savedMaterial ? "再存一份" : "保存材料"}
          </button>
          <Link to="/library" className="secondary-button">
            <Library size={16} />
            查看词库
          </Link>
          <Link to="/review" className="primary-button">
            <ListChecks size={16} />
            开始复习
          </Link>
        </div>
      </section>

      <section className="import-layout">
        <div className="panel form-panel import-material-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Material</span>
              <h2>采集材料</h2>
            </div>
            <span className="panel-count">{data.materials.length} 份已保存</span>
          </div>
          <label>
            材料标题
            <input
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setSavedMaterial(null);
              }}
            />
          </label>
          <label>
            原文
            <textarea
              className="large-textarea"
              value={content}
              onChange={(event) => {
                setContent(event.target.value);
                setSavedMaterial(null);
                setCapturedWords(new Set());
                setCapturedSentences(new Set());
                setSelectedSentence("");
              }}
              placeholder="Paste an English article, transcript, or notes here."
            />
          </label>
          <div className="import-material-footer">
            <p className="muted">建议一篇材料最多加入 10-20 个词句，避免复习负债爆炸。</p>
            <button className="secondary-button" onClick={saveMaterial} disabled={!content.trim()}>
              保存材料
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="import-review-stack">
          <div className="panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow">Words</span>
                <h2>候选词</h2>
              </div>
              <div className="import-panel-actions">
                <span className="panel-count">{candidates.length} 个</span>
                <button className="secondary-button" type="button" onClick={addCandidateWordsBatch} disabled={readyCandidateWords.length === 0}>
                  <Plus size={15} />
                  批量收词
                </button>
              </div>
            </div>
            <div className="import-capture-status" aria-label="候选词处理状态">
              <div><span>可收</span><strong>{readyCandidateWords.length}</strong></div>
              <div><span>已加入</span><strong>{capturedCandidateCount}</strong></div>
              <div><span>已存在</span><strong>{existingCandidateCount}</strong></div>
            </div>
            {candidates.length === 0 ? (
              <EmptyState title="暂无候选词" description="粘贴一段英文后，这里会按频次列出可收录的词。" />
            ) : (
              <div className="candidate-list">
                {candidates.map((candidate) => {
                  const exists = existingWords.has(candidate.word);
                  const captured = capturedWordsLower.has(candidate.word);
                  const isHydrating = hydratingCandidateWords.has(candidate.word);
                  return (
                    <button
                      key={candidate.word}
                      className={captured ? "captured" : ""}
                      onClick={() => addWord(candidate.word)}
                      disabled={exists || captured || isHydrating}
                    >
                      <span>{candidate.word}</span>
                      <small>{exists ? "已存在" : captured ? "已加入" : isHydrating ? "补全中" : `${candidate.count} 次`}</small>
                      {!exists && !captured && <Plus size={14} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="panel sentence-panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow">Sentences</span>
                <h2>拆分句子</h2>
              </div>
              <div className="import-panel-actions">
                <span className="panel-count">{sentences.length} 句</span>
                <button className="secondary-button" type="button" onClick={addSentencesBatch} disabled={pendingSentenceCount === 0}>
                  <BookPlus size={15} />
                  批量收句
                </button>
              </div>
            </div>
            <div className="import-capture-status" aria-label="句子处理状态">
              <div><span>未收</span><strong>{pendingSentenceCount}</strong></div>
              <div><span>已加入</span><strong>{capturedSentences.size}</strong></div>
              <div><span>选中来源</span><strong>{selectedSentenceIndex > 0 ? 1 : 0}</strong></div>
            </div>
            {sentences.length === 0 ? (
              <EmptyState title="暂无句子" description="导入后会按英文标点和换行拆分。" />
            ) : (
              <div className="sentence-list">
                {sentences.map((sentence, index) => (
                  <article
                    key={`${sentence}-${index}`}
                    className={`${selectedSentence === sentence ? "selected" : ""} ${capturedSentences.has(sentence) ? "captured" : ""}`}
                  >
                    <button className="sentence-text" onClick={() => setSelectedSentence(sentence)}>
                      {sentence}
                    </button>
                    <button className="secondary-button" onClick={() => addSentenceCard(sentence)} disabled={capturedSentences.has(sentence)}>
                      <BookPlus size={15} />
                      {capturedSentences.has(sentence) ? "已加入" : "加入句子"}
                    </button>
                  </article>
                ))}
              </div>
            )}
            {captureMessage && <div className="import-result" aria-live="polite">{captureMessage}</div>}
          </div>
        </div>
      </section>

      <section className="panel batch-import-panel import-batch-section">
        <div className="panel-header">
          <div>
            <span className="eyebrow">Batch Words</span>
            <h2>批量导入单词</h2>
          </div>
          <div className="segmented-control" aria-label="导入格式">
            <button className={importMode === "text" ? "selected" : ""} onClick={() => setImportMode("text")}>
              文本
            </button>
            <button className={importMode === "csv" ? "selected" : ""} onClick={() => setImportMode("csv")}>
              CSV
            </button>
          </div>
        </div>
        <div className="import-batch-grid">
          <label>
            粘贴内容
            <textarea
              className="batch-import-textarea"
              value={wordImportText}
              onChange={(event) => {
                setWordImportText(event.target.value);
                setImportMessage("");
              }}
              placeholder={importExamples[importMode]}
            />
          </label>
          <div className="import-batch-preview">
            <div className="import-stats" aria-label="导入预览统计">
              <div>
                <span>新增</span>
                <strong>{wordImportPreview.stats.new}</strong>
              </div>
              <div>
                <span>合并</span>
                <strong>{wordImportPreview.stats.merge}</strong>
              </div>
              <div>
                <span>重复</span>
                <strong>{wordImportPreview.stats.duplicate}</strong>
              </div>
              <div>
                <span>无效</span>
                <strong>{wordImportPreview.stats.invalid}</strong>
              </div>
            </div>
            {isHydratingWordImportRows && <div className="muted" aria-live="polite">正在补全完整词典预览...</div>}
            <div className="button-row">
              <button
                className="secondary-button"
                type="button"
                onClick={() => {
                  setWordImportText(importExamples[importMode]);
                  setImportMessage("");
                }}
              >
                <Table2 size={16} />
                填入示例
              </button>
              <button
                className="primary-button"
                type="button"
                onClick={importPreviewWords}
                disabled={wordImportPreview.importableRows.length === 0}
              >
                <Upload size={16} />
                导入可用项
              </button>
            </div>
            {importMessage && <div className="import-result" aria-live="polite">{importMessage}</div>}
          </div>
        </div>
        <div className="import-preview-table" aria-label="批量导入预览">
          {wordImportPreview.rows.length === 0 ? (
            <EmptyState title="暂无预览" description="粘贴文本或 CSV 后，这里会显示将新增、合并或跳过的行。" />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>行</th>
                  <th>单词</th>
                  <th>释义</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                {wordImportPreview.rows.slice(0, 80).map((row) => (
                  <tr key={`${row.rowNumber}-${row.raw}`} className={`import-row-${row.status}`}>
                    <td>{row.rowNumber}</td>
                    <td>{row.input.word || "空"}</td>
                    <td>{row.input.translation || "将从词典补全或留空"}</td>
                    <td><span>{row.reason}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
