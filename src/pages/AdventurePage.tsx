import {
  ArrowRight,
  Check,
  Compass,
  Lightbulb,
  Mail,
  Plus,
  RotateCcw,
  Rocket,
  Search,
  Shuffle,
  Sparkles,
  TrainFront,
  Trash2,
  Wand2,
  Waves
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppData } from "../AppContext";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import {
  adventureTemplates,
  createAdventure,
  deleteAdventure,
  getAdventureFavoriteWords,
  getAdventurePath,
  getCurrentAdventureNode
} from "../services/adventureService";
import {
  generateAdventureOpeningWithModel,
  generateAdventureRecommendationsWithModel,
  isAiProviderConfigured,
  type AdventureRecommendation
} from "../services/adventureModelService";
import type { Adventure, AdventureLevel, AdventureTemplate } from "../types";

const levels: AdventureLevel[] = ["A1", "A2", "B1", "B2", "C1"];
const RECOMMENDATIONS_KEY = "adventure-ai-recommendations";

const isAiOpeningMode = (selection: Selection) => selection.kind !== "offline";

type Selection =
  | { kind: "offline"; id: AdventureTemplate }
  | { kind: "ai"; index: number }
  | { kind: "custom" };

const templateVisuals: Record<"campus" | "city" | "travel" | "fantasy", { icon: LucideIcon; tone: string }> = {
  campus: { icon: Search, tone: "tone-blue" },
  city: { icon: Mail, tone: "tone-orange" },
  travel: { icon: TrainFront, tone: "tone-teal" },
  fantasy: { icon: Lightbulb, tone: "tone-amber" }
};

const sceneIconRules: Array<[RegExp, LucideIcon]> = [
  [/悬疑|侦探|谜|案|秘密/, Search],
  [/信|邮|书/, Mail],
  [/列车|火车|巴士|公路/, TrainFront],
  [/灯塔|灯|夜/, Lightbulb],
  [/海|浪|岛|港/, Waves],
  [/奇幻|魔法|精灵|龙/, Wand2],
  [/科幻|星|太空|未来/, Rocket]
];
const toneCycle = ["tone-blue", "tone-orange", "tone-teal", "tone-amber"];

const visualForTemplate = (template: AdventureTemplate): { icon: LucideIcon; tone: string } => {
  if (template !== "custom" && templateVisuals[template]) return templateVisuals[template];
  return { icon: Sparkles, tone: "tone-neutral" };
};

const visualForRecommendation = (item: AdventureRecommendation, index: number) => {
  const matched = sceneIconRules.find(([pattern]) => pattern.test(item.scene) || pattern.test(item.title));
  return { icon: matched?.[1] ?? Compass, tone: toneCycle[index % toneCycle.length] };
};

const formatRelative = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "刚刚";
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (diffDays <= 0) {
    const time = new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit" }).format(date);
    return `今天 ${time}`;
  }
  if (diffDays === 1) return "昨天";
  if (diffDays < 7) return `${diffDays} 天前`;
  if (diffDays < 14) return "上周";
  return new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric" }).format(date);
};

const readStoredRecommendations = (): AdventureRecommendation[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECOMMENDATIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is AdventureRecommendation =>
          Boolean(item) && typeof item === "object" && typeof (item as AdventureRecommendation).title === "string")
      : [];
  } catch {
    return [];
  }
};

export default function AdventurePage() {
  const { data, updateData } = useAppData();
  const navigate = useNavigate();
  const [selection, setSelection] = useState<Selection>({ kind: "offline", id: "city" });
  const [level, setLevel] = useState<AdventureLevel>("A2");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [recommendations, setRecommendations] = useState<AdventureRecommendation[]>(readStoredRecommendations);
  const [isRecommending, setIsRecommending] = useState(false);
  const [recommendError, setRecommendError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Adventure | null>(null);
  const isAiConfigured = isAiProviderConfigured(data.settings.aiProvider);

  const favoriteWords = useMemo(() => new Set(getAdventureFavoriteWords(data)), [data]);
  const latestAdventure = useMemo(
    () => data.adventures.slice().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0],
    [data.adventures]
  );
  const sortedAdventures = useMemo(
    () => data.adventures.slice().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [data.adventures]
  );

  const isCustomMode = selection.kind === "custom";
  const isAiCardList = recommendations.length >= 2;

  const renderTemplateCard = (input: {
    key: string;
    title: string;
    description: string;
    visual: { icon: LucideIcon; tone: string };
    selected: boolean;
    isAiCard: boolean;
    onSelect: () => void;
  }) => {
    const Icon = input.visual.icon;
    return (
      <button
        key={input.key}
        className={`adventure-template${input.selected ? " selected" : ""}${input.isAiCard ? " adventure-template-ai" : ""}`}
        type="button"
        role="radio"
        aria-checked={input.selected}
        onClick={input.onSelect}
      >
        {input.selected && <span className="adventure-template-check"><Check size={11} /></span>}
        <span className={`adventure-template-icon ${input.visual.tone}`}><Icon size={17} /></span>
        <strong>{input.title}</strong>
        <span className="adventure-template-desc">{input.description}</span>
      </button>
    );
  };

  const adventureProgress = (adventure: Adventure) => {
    const path = getAdventurePath(adventure);
    const seen = new Set<string>();
    path.forEach((node) => node.vocabulary.forEach((vocab) => {
      const word = vocab.word.trim().toLowerCase();
      if (word && favoriteWords.has(word)) seen.add(word);
    }));
    return {
      chapter: getCurrentAdventureNode(adventure).chapter,
      favoriteCount: seen.size,
      percent: Math.min(100, Math.max(6, path.length * 12))
    };
  };

  const updateRecommendations = (items: AdventureRecommendation[]) => {
    setRecommendations(items);
    try {
      if (items.length) window.localStorage.setItem(RECOMMENDATIONS_KEY, JSON.stringify(items));
      else window.localStorage.removeItem(RECOMMENDATIONS_KEY);
    } catch {
      // localStorage 不可用时仅保留本次会话状态。
    }
  };

  const shuffleRecommendations = async () => {
    if (isRecommending) return;
    setRecommendError("");
    setIsRecommending(true);
    try {
      const items = await generateAdventureRecommendationsWithModel(data.settings.aiProvider, {
        level,
        excludeTitles: [
          ...adventureTemplates.map((item) => item.title),
          ...recommendations.map((item) => item.title)
        ]
      });
      updateRecommendations(items);
      setSelection({ kind: "ai", index: 0 });
    } catch (error) {
      setRecommendError(error instanceof Error ? error.message : "推荐没有生成，请稍后再试。");
    } finally {
      setIsRecommending(false);
    }
  };

  const restoreDefaultTemplates = () => {
    updateRecommendations([]);
    setRecommendError("");
    setSelection({ kind: "offline", id: "city" });
  };

  const startAdventure = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateError("");
    const isAiOpening = selection.kind === "custom" || selection.kind === "ai";
    let prompt = customPrompt.trim();
    if (selection.kind === "ai") {
      const item = recommendations[selection.index];
      if (!item) { setCreateError("这张推荐卡已经失效，请重新随机推荐。"); return; }
      prompt = `${item.title}：${item.description}`;
    }
    if (selection.kind === "custom" && !prompt) {
      setCreateError("先写一句话或一个方向，AI 才能帮你补齐剧情。");
      return;
    }
    if (isAiOpening && !isAiConfigured) {
      setCreateError("这个冒险需要 AI 生成。请先到设置中填写 AI 服务信息。");
      return;
    }

    setIsCreating(true);
    try {
      const initialNode = isAiOpening
        ? await generateAdventureOpeningWithModel(data.settings.aiProvider, {
            level,
            customPrompt: prompt,
            targetWords: data.cards
              .filter((card) => card.type === "word" && favoriteWords.has(card.front.trim().toLowerCase()))
              .slice(0, 12)
              .map((card) => ({ word: card.front, translation: card.back }))
          })
        : undefined;
      const result = createAdventure(data, {
        template: isAiOpening ? "custom" : (selection as { kind: "offline"; id: AdventureTemplate }).id,
        level,
        customPrompt: prompt,
        source: initialNode ? "ai" : "offline",
        initialNode,
        title: initialNode?.title
      });
      updateData(() => result.data);
      navigate(`/adventure/${result.adventure.id}`);
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : "冒险没有生成，请重试。");
    } finally {
      setIsCreating(false);
    }
  };

  const latestProgress = latestAdventure ? adventureProgress(latestAdventure) : null;
  const latestVisual = latestAdventure ? visualForTemplate(latestAdventure.template) : null;

  return (
    <div className="page adventure-page">
      <PageHeader
        eyebrow="Adventure"
        title="冒险学习"
        description="读一段故事，做一次选择，把真正想记住的词收进词库。"
      />

      {latestAdventure && latestProgress && latestVisual && (
        <section className="adventure-hero" aria-label="继续最近冒险">
          <span className={`adventure-hero-icon ${latestVisual.tone}`}><latestVisual.icon size={22} /></span>
          <div className="adventure-hero-body">
            <div className="adventure-hero-title">
              <h2>{latestAdventure.title}</h2>
              <span className="adventure-badge">{latestAdventure.level}</span>
              <span className="adventure-badge adventure-badge-muted">
                {latestAdventure.nodes[0]?.source === "ai" ? "AI 剧情" : "离线剧情"}
              </span>
            </div>
            <div className="adventure-hero-meta">
              <span className="adventure-progress-track"><span style={{ width: `${latestProgress.percent}%` }} /></span>
              <span className="adventure-progress-copy">
                第 {latestProgress.chapter} 章 · 收了 {latestProgress.favoriteCount} 个词 · {formatRelative(latestAdventure.updatedAt)}保存
              </span>
            </div>
          </div>
          <Link className="primary-button" to={`/adventure/${latestAdventure.id}`}>
            继续阅读 <ArrowRight size={17} />
          </Link>
        </section>
      )}

      <form className="panel adventure-create-form" onSubmit={startAdventure}>
        <div className="adventure-create-head">
          <div>
            <span className="eyebrow">New route</span>
            <h2>开始一段新冒险</h2>
          </div>
          <div className="adventure-create-actions">
            {recommendations.length >= 2 && (
              <button className="secondary-button" type="button" onClick={restoreDefaultTemplates}>
                <RotateCcw size={15} /> 恢复默认
              </button>
            )}
            <button
              className="secondary-button adventure-shuffle-button"
              type="button"
              onClick={shuffleRecommendations}
              disabled={isRecommending || !isAiConfigured}
              title={isAiConfigured ? "让 AI 随机推荐 4 个冒险主题" : "随机推荐需要先配置 AI"}
            >
              <Shuffle size={15} className={isRecommending ? "spin" : undefined} />
              {isRecommending ? "正在构思…" : "随机推荐"}
            </button>
          </div>
        </div>

        <div className={`adventure-template-grid${isRecommending ? " loading" : ""}`} role="radiogroup" aria-label="冒险主题">
          {isRecommending
            ? [0, 1, 2, 3].map((index) => (
                <div className="adventure-template-skeleton" key={index} aria-hidden="true">
                  <span className="adventure-template-icon tone-neutral" />
                  <strong>　</strong>
                  <span>　</span>
                </div>
              ))
            : isAiCardList
              ? recommendations.map((item, index) =>
                  renderTemplateCard({
                    key: `ai-${item.title}`,
                    title: item.title,
                    description: item.description,
                    visual: visualForRecommendation(item, index),
                    selected: selection.kind === "ai" && selection.index === index,
                    isAiCard: true,
                    onSelect: () => { setSelection({ kind: "ai", index }); setCreateError(""); }
                  }))
              : adventureTemplates.map((item) =>
                  renderTemplateCard({
                    key: item.id,
                    title: item.title,
                    description: item.description,
                    visual: visualForTemplate(item.id),
                    selected: selection.kind === "offline" && selection.id === item.id,
                    isAiCard: false,
                    onSelect: () => { setSelection({ kind: "offline", id: item.id }); setCreateError(""); }
                  }))}
          <button
            className={`adventure-template adventure-template-custom${isCustomMode ? " selected" : ""}`}
            type="button"
            role="radio"
            aria-checked={isCustomMode}
            onClick={() => { setSelection({ kind: "custom" }); setCreateError(""); }}
          >
            {isCustomMode && <span className="adventure-template-check"><Check size={11} /></span>}
            <span className="adventure-template-icon tone-neutral"><Sparkles size={17} /></span>
            <strong>自定义冒险</strong>
            <span className="adventure-template-desc">给 AI 一句话，补齐角色、目标和第一章。</span>
            {!isAiConfigured && <em className="adventure-template-badge">需配置 AI</em>}
          </button>
        </div>

        {recommendError && <p className="adventure-create-error" role="alert">{recommendError}</p>}

        <div className="adventure-options">
          <div className="adventure-option-field">
            <span className="adventure-option-label">阅读难度</span>
            <div className="adventure-level-group" role="radiogroup" aria-label="阅读难度">
              {levels.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="radio"
                  aria-checked={level === item}
                  className={`adventure-level${level === item ? " selected" : ""}`}
                  onClick={() => setLevel(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <label className="adventure-option-field">
            <span className="adventure-option-label">
              {isCustomMode ? "告诉 AI 你的冒险方向" : "给故事一个线索（可选）"}
            </span>
            <input
              value={customPrompt}
              onChange={(event) => { setCustomPrompt(event.target.value.slice(0, 180)); setCreateError(""); }}
              placeholder={isCustomMode ? "例如：我想在会移动的城市里找回一封信" : "例如：我想找一只走失的猫"}
              maxLength={180}
              required={isCustomMode}
            />
          </label>
        </div>

        {selection.kind === "offline" && (
          <div className="adventure-hint-chips">
            <span>灵感：</span>
            {["一只会送信的鸽子", "午夜开往雪国的巴士", "图书馆里少了一页的书"].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => { setCustomPrompt(chip); setCreateError(""); }}
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {isCustomMode && (
          <div className="adventure-custom-ai-note" role="status">
            <Sparkles size={16} />
            <span>{isAiConfigured ? "AI 会从这句话开始设计角色、冲突、首章译文和可选路线。" : "需要先配置 AI，才能生成自定义首章。"}</span>
            {!isAiConfigured && <Link to="/settings">去设置</Link>}
          </div>
        )}
        {createError && <p className="adventure-create-error" role="alert">{createError}</p>}

        <div className="adventure-create-footer">
          <span>{isAiOpeningMode(selection) ? "生成后会自动保存，你可以继续选择路线。" : "路线会自动保存，可以随时回到旧节点。"}</span>
          <button className="primary-button" type="submit" disabled={isCreating}>
            {isCreating ? <><Sparkles size={17} className="spin" /> AI 正在构思</> : <><Plus size={17} /> {isAiOpeningMode(selection) ? "生成冒险" : "开始冒险"}</>}
          </button>
        </div>
      </form>

      <section className="adventure-saves-section">
        <div className="section-heading">
          <div><span className="eyebrow">Saved routes</span><h2>我的路线</h2></div>
          <span>{data.adventures.length} 段</span>
        </div>
        {data.adventures.length === 0 ? (
          <EmptyState title="第一段故事还没有开始" description="选择一个主题，系统会创建一条可随时返回的学习路线。" />
        ) : (
          <div className="adventure-route-grid">
            {sortedAdventures.map((adventure) => {
              const progress = adventureProgress(adventure);
              const visual = visualForTemplate(adventure.template);
              const Icon = visual.icon;
              return (
                <div className="adventure-route-card" key={adventure.id}>
                  <Link className="adventure-route-card-link" to={`/adventure/${adventure.id}`}>
                    <span className={`adventure-template-icon ${visual.tone}`}><Icon size={14} /></span>
                    <div className="adventure-route-card-main">
                      <div className="adventure-route-card-top">
                        <strong>{adventure.title}</strong>
                        <span className="adventure-badge adventure-badge-muted">{adventure.level}</span>
                      </div>
                      <span className="adventure-progress-track"><span style={{ width: `${progress.percent}%` }} /></span>
                      <div className="adventure-route-card-meta">
                        <span>第 {progress.chapter} 章 · {progress.favoriteCount} 个生词</span>
                        <span>{formatRelative(adventure.updatedAt)}</span>
                      </div>
                    </div>
                  </Link>
                  <button
                    type="button"
                    className="icon-button adventure-route-delete"
                    aria-label={`删除路线 ${adventure.title}`}
                    title="删除这段路线"
                    onClick={() => setPendingDelete(adventure)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`删除“${pendingDelete?.title ?? ""}”？`}
        message="这段路线的章节记录会一并删除，删除后无法恢复。"
        onConfirm={() => {
          if (pendingDelete) updateData((latest) => deleteAdventure(latest, pendingDelete.id));
          setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
