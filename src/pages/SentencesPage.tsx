import { FormEvent, useMemo, useState } from "react";
import { Mic2, Plus, Search, Star, Trash2, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppData } from "../AppContext";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import SpeakButton from "../components/SpeakButton";
import {
  addSentence,
  deleteCard,
  getSentenceDetails,
  readAudioFileAsDataUrl,
  SentenceInput,
  togglePriority,
  updateSentenceAudio
} from "../services/cardService";
import { imeSafeFormProps } from "../components/imeGuard";

const emptyInput: SentenceInput = {
  sentence: "",
  translation: "",
  keywords: "",
  grammarNote: "",
  note: "",
  tags: ""
};

export default function SentencesPage() {
  const { data, updateData } = useAppData();
  const [query, setQuery] = useState("");
  const [input, setInput] = useState<SentenceInput>(emptyInput);
  const [audioMessage, setAudioMessage] = useState<{ cardId: string; text: string; tone: "success" | "error" } | null>(
    null
  );

  const sentences = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return data.cards
      .filter((card) => card.type === "sentence")
      .filter((card) => {
        if (!normalized) return true;
        return (
          card.front.toLowerCase().includes(normalized) ||
          card.back.toLowerCase().includes(normalized) ||
          card.tags.some((tag) => tag.toLowerCase().includes(normalized))
        );
      })
      .sort((a, b) => Number(b.priority) - Number(a.priority) || b.createdAt.localeCompare(a.createdAt));
  }, [data.cards, query]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!input.sentence.trim()) return;
    updateData((current) => addSentence(current, input));
    setInput(emptyInput);
  };

  const uploadAudio = (cardId: string, file: File | undefined) => {
    if (!file) return;

    void readAudioFileAsDataUrl(file)
      .then((audioUrl) => {
        updateData((current) => updateSentenceAudio(current, cardId, audioUrl));
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
    updateData((current) => updateSentenceAudio(current, cardId, ""));
    setAudioMessage({ cardId, text: "已移除真实音频，将使用系统朗读。", tone: "success" });
  };

  return (
    <div className="page">
      <PageHeader
        eyebrow="Sentences"
        title="句子本"
        description="收藏真正值得背的表达，后续用回译、挖空和轻听写反复训练。"
      />

      <section className="two-column wide-left">
        <form className="panel form-panel" onSubmit={submit} {...imeSafeFormProps}>
          <div className="panel-header">
            <h2>添加句子</h2>
            <button className="primary-button" type="submit">
              <Plus size={17} />
              保存
            </button>
          </div>
          <label>
            英文句子
            <textarea
              value={input.sentence}
              onChange={(event) => setInput({ ...input, sentence: event.target.value })}
              placeholder="The best way to remember a word is to meet it in context."
            />
          </label>
          <label>
            中文提示
            <textarea
              value={input.translation}
              onChange={(event) => setInput({ ...input, translation: event.target.value })}
              placeholder="记住一个单词最好的方式，是在语境中遇见它。"
            />
          </label>
          <div className="form-grid">
            <label>
              关键词
              <input
                value={input.keywords}
                onChange={(event) => setInput({ ...input, keywords: event.target.value })}
                placeholder="remember context"
              />
            </label>
            <label>
              标签
              <input value={input.tags} onChange={(event) => setInput({ ...input, tags: event.target.value })} />
            </label>
          </div>
          <label>
            句法/备注
            <textarea
              value={input.grammarNote}
              onChange={(event) => setInput({ ...input, grammarNote: event.target.value })}
            />
          </label>
        </form>

        <div className="panel">
          <div className="search-box">
            <Search size={17} />
            <input
              aria-label="搜索句子"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索句子、翻译或标签"
            />
          </div>
          {sentences.length === 0 ? (
            <EmptyState
              title="还没有句子"
              description="添加几个你想真正掌握的表达，或者从导入材料里收藏。"
              action={<Link to="/import" className="primary-button">从材料导入</Link>}
            />
          ) : (
            <div className="card-list">
              {sentences.map((card) => {
                const details = getSentenceDetails(data, card.id);
                return (
                  <article key={card.id} className="item-card">
                    <div className="sentence-card-content">
                      <div className="item-title">
                        <strong>{card.front}</strong>
                        <SpeakButton text={card.front} audioUrl={details?.audioUrl} />
                      </div>
                      <p>{card.back}</p>
                      {details?.keywords && details.keywords.length > 0 && (
                        <div className="tag-row">
                          {details.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}
                        </div>
                      )}
                      {details?.audioUrl && <span className="audio-chip">真实音频</span>}
                      {audioMessage?.cardId === card.id && (
                        <div className={`audio-message ${audioMessage.tone}`} aria-live="polite">
                          {audioMessage.text}
                        </div>
                      )}
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
                          onClick={() => removeAudio(card.id)}
                          aria-label={`移除「${card.front}」的真人发音`}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      {/*
                        可访问名（2026-09-21 补）：这三个图标按钮此前只有 <svg>，
                        屏幕阅读器只会读「按钮」。同项目的 LibraryPage 同类按钮已带 aria-label，
                        这里是漏做（不是有意取舍）。
                        重点按钮另补 aria-pressed——状态此前只靠 className 表达，
                        读屏用户无从知道当前是否已标重点。
                      */}
                      <button
                        className={`icon-button ${card.priority ? "selected" : ""}`}
                        onClick={() => updateData((current) => togglePriority(current, card.id))}
                        aria-label={card.priority ? `取消「${card.front}」的重点标记` : `把「${card.front}」标为重点`}
                        aria-pressed={Boolean(card.priority)}
                      >
                        <Star size={16} />
                      </button>
                      <button
                        className="icon-button"
                        onClick={() => updateData((current) => deleteCard(current, card.id))}
                        aria-label={`删除「${card.front}」`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
