import { ArrowRight, ChevronRight, Plus, RotateCcw, Shuffle, Sparkles, Trash2, X } from "lucide-react";
import AdventureScene, { ADVENTURE_SCENE_IDS, matchAdventureScene, type AdventureSceneId } from "../components/AdventureScene";
import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroImage from "../assets/adventure-hero.jpg";
import { useAppData } from "../AppContext";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import {
  adventureTemplates,
  createAdventure,
  deleteAdventure,
  getAdventureFavoriteWords,
  getAdventurePath,
  getCurrentAdventureNode,
  sortAdventuresForList
} from "../services/adventureService";
import {
  generateAdventureOpeningWithModel,
  isAiProviderConfigured
} from "../services/adventureModelService";
import { ADVENTURE_THEME_LIBRARY, sampleAdventureThemes, type AdventureTheme } from "../services/adventureThemeLibrary";

const ADVENTURE_THEME_COUNT = ADVENTURE_THEME_LIBRARY.length;
import AdventureThemeArt, { AdventureArtwork } from "../components/AdventureThemeArt";
import type { Adventure, AdventureLevel, AdventureTemplate } from "../types";

const levels: AdventureLevel[] = ["A1", "A2", "B1", "B2", "C1"];
const RECOMMENDATIONS_KEY = "adventure-ai-recommendations";
const SHOWN_THEMES_KEY = "adventure-theme-history";
const SHOWN_THEMES_CAP = 48;
const HINT_IDEAS = ["一只会送信的鸽子", "午夜开往雪国的巴士", "图书馆里少了一页的书"];

type Selection =
  | { kind: "offline"; id: AdventureTemplate }
  | { kind: "ai"; index: number }
  | { kind: "custom" };

const isAiOpeningMode = (selection: Selection) => selection.kind !== "offline";

const templateScenes: Record<"campus" | "city" | "travel" | "fantasy", AdventureSceneId> = {
  campus: "campus",
  city: "city",
  travel: "train",
  fantasy: "lighthouse"
};

const sceneForTemplate = (template: AdventureTemplate): AdventureSceneId => {
  if (template !== "custom" && templateScenes[template]) return templateScenes[template];
  return "sparkle";
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

const readStoredRecommendations = (): AdventureTheme[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECOMMENDATIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is AdventureTheme =>
          Boolean(item) && typeof item === "object"
          && typeof (item as AdventureTheme).title === "string"
          && typeof (item as AdventureTheme).description === "string"
          && typeof (item as AdventureTheme).id === "string"
          && (ADVENTURE_SCENE_IDS as string[]).includes((item as AdventureTheme).scene))
      : [];
  } catch {
    return [];
  }
};

/** 最近展示过的主题 ID：抽样时优先避开，减少「翻来覆去都是这几个」的感觉。 */
const readShownThemeIds = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(SHOWN_THEMES_KEY) ?? "[]") as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string").slice(-SHOWN_THEMES_CAP)
      : [];
  } catch {
    return [];
  }
};

const writeShownThemeIds = (ids: string[]) => {
  try {
    window.localStorage.setItem(SHOWN_THEMES_KEY, JSON.stringify(ids.slice(-SHOWN_THEMES_CAP)));
  } catch {
    // localStorage 不可用时跳过历史记录。
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
  const [recommendations, setRecommendations] = useState<AdventureTheme[]>(readStoredRecommendations);
  const [pendingDelete, setPendingDelete] = useState<Adventure | null>(null);
  const [routesOpen, setRoutesOpen] = useState(false);
  const isAiConfigured = isAiProviderConfigured(data.settings.aiProvider);

  const favoriteWords = useMemo(() => new Set(getAdventureFavoriteWords(data)), [data]);
  const latestAdventure = useMemo(
    () => data.adventures.slice().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0],
    [data.adventures]
  );
  const currentAdventureId = latestAdventure?.id;
  const sortedAdventures = useMemo(() => sortAdventuresForList(data.adventures), [data.adventures]);

  const isCustomMode = selection.kind === "custom";
  const isAiCardList = recommendations.length >= 2;

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
      percent: Math.min(100, Math.max(6, path.length * 20))
    };
  };

  const updateRecommendations = (items: AdventureTheme[]) => {
    setRecommendations(items);
    try {
      if (items.length) window.localStorage.setItem(RECOMMENDATIONS_KEY, JSON.stringify(items));
      else window.localStorage.removeItem(RECOMMENDATIONS_KEY);
    } catch {
      // localStorage 不可用时仅保留本次会话状态。
    }
  };

  // 随机推荐 = 本地从 150 个内置主题里抽样：瞬时完成、不调 AI，
  // 且避开最近展示过的主题，同批 4 张插画场景互不重复。
  const shuffleRecommendations = () => {
    const items = sampleAdventureThemes(4, [
      ...readShownThemeIds(),
      ...recommendations.map((item) => item.id)
    ]);
    if (!items.length) return;
    updateRecommendations(items);
    writeShownThemeIds([...readShownThemeIds(), ...items.map((item) => item.id)]);
    setSelection({ kind: "ai", index: 0 });
    setCreateError("");
  };

  const restoreDefaultTemplates = () => {
    updateRecommendations([]);
    setSelection({ kind: "offline", id: "city" });
  };

  const startAdventure = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateError("");
    const isAiOpening = isAiOpeningMode(selection);
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
      const selectedTheme = selection.kind === "ai" ? recommendations[selection.index] : undefined;
      // AI/自定义冒险没有模板可用，创建时就把场景插画定下来，路线列表和继续阅读卡共用。
      const scene = !isAiOpening
        ? undefined
        : selectedTheme
          ? selectedTheme.scene
          : matchAdventureScene(prompt);
      const result = createAdventure(data, {
        template: isAiOpening ? "custom" : (selection as { kind: "offline"; id: AdventureTemplate }).id,
        level,
        customPrompt: prompt,
        source: initialNode ? "ai" : "offline",
        initialNode,
        title: initialNode?.title,
        scene,
        themeId: selectedTheme?.id
      });
      updateData(() => result.data);
      navigate(`/adventure/${result.adventure.id}`);
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : "冒险没有生成，请重试。");
    } finally {
      setIsCreating(false);
    }
  };

  const renderThemeCard = (input: {
    key: string;
    title: string;
    description: string;
    scene: AdventureSceneId;
    /** 内置主题传入后，卡片用该主题的专属插画而不是通用场景。 */
    theme?: AdventureTheme;
    selected: boolean;
    badge?: string;
    onSelect: () => void;
  }) => {
    return (
      <button
        key={input.key}
        type="button"
        role="radio"
        aria-checked={input.selected}
        className={`adv-theme${input.selected ? " selected" : ""}`}
        onClick={input.onSelect}
      >
        <span className="adv-scene-tile">
          {input.theme ? <AdventureThemeArt theme={input.theme} /> : <AdventureScene scene={input.scene} />}
        </span>
        <span className="adv-theme-copy">
          <strong>{input.title}</strong>
          <small>{input.description}</small>
          {input.badge && <em className="adv-theme-badge">{input.badge}</em>}
        </span>
        <ChevronRight size={16} className="adv-theme-arrow" />
      </button>
    );
  };

  const latestProgress = latestAdventure ? adventureProgress(latestAdventure) : null;

  return (
    <div className="page adventure-page adv-page">
      <section
        className="adv-hero"
        aria-label="冒险学习"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <span className="adv-hero-photo" aria-hidden="true" />
        <div className="adv-hero-inner">
          <div className="adv-hero-copy">
            <span className="adv-eyebrow">Adventure</span>
            <h1>冒险学习</h1>
            <p>读一段故事，做一次选择，把真正想记住的词收进词库。</p>
          </div>
          <span className="adv-hero-script" aria-hidden="true">Better<br />You<br />Every Day</span>

          {latestAdventure && latestProgress && (
            <section className="adv-continue" aria-label="继续最近冒险">
              <span className="adv-hero-thumbwrap">
                <span className="adv-scene-tile adv-scene-tile-lg">
                  <AdventureArtwork adventure={latestAdventure} />
                </span>
                <em className="adv-tile-chip">{latestAdventure.level}</em>
              </span>
              <div className="adv-continue-body">
                <h2>{latestAdventure.title}</h2>
                <div className="adv-continue-sub">
                  <span className="adv-bar"><span style={{ width: `${latestProgress.percent}%` }} /></span>
                  <span className="adv-continue-meta">
                    第 {latestProgress.chapter} 章 · 收了 {latestProgress.favoriteCount} 个词 · {formatRelative(latestAdventure.updatedAt)} 保存
                  </span>
                </div>
              </div>
              <Link className="adv-primary" to={`/adventure/${latestAdventure.id}`}>
                继续阅读 <ArrowRight size={16} />
              </Link>
            </section>
          )}
        </div>
      </section>

      <div className="adv-body">
      <form className="adv-card adv-create" onSubmit={startAdventure}>
        <header className="adv-create-head">
          <div>
            <span className="adv-eyebrow">New route</span>
            <h2>开始一段新冒险</h2>
          </div>
          <div className="adv-create-actions">
            {recommendations.length >= 2 && (
              <button className="adv-ghost" type="button" onClick={restoreDefaultTemplates}>
                <RotateCcw size={15} /> 恢复默认
              </button>
            )}
            <button
              className="adv-ghost"
              type="button"
              onClick={shuffleRecommendations}
              title={`从内置 ${ADVENTURE_THEME_COUNT} 个主题里随机换一批（无需 AI）`}
            >
              <Shuffle size={15} />
              随机推荐
            </button>
          </div>
        </header>

        <div className="adv-theme-row" role="radiogroup" aria-label="冒险主题">
          {isAiCardList
            ? recommendations.map((item, index) =>
                renderThemeCard({
                  key: item.id,
                  title: item.title,
                  description: item.description,
                  scene: item.scene,
                  theme: item,
                  selected: selection.kind === "ai" && selection.index === index,
                  onSelect: () => { setSelection({ kind: "ai", index }); setCreateError(""); }
                }))
            : adventureTemplates.map((item) =>
                renderThemeCard({
                  key: item.id,
                  title: item.title,
                  description: item.description,
                  scene: sceneForTemplate(item.id),
                  selected: selection.kind === "offline" && selection.id === item.id,
                  onSelect: () => { setSelection({ kind: "offline", id: item.id }); setCreateError(""); }
                }))}
          {renderThemeCard({
            key: "custom",
            title: "自定义冒险",
            description: "给 AI 一句话，补齐角色、目标和第一章。",
            scene: sceneForTemplate("custom"),
            selected: isCustomMode,
            badge: isAiConfigured ? undefined : "需配置 AI",
            onSelect: () => { setSelection({ kind: "custom" }); setCreateError(""); }
          })}
        </div>

        <div className="adv-params">
          <div className="adv-field">
            <span className="adv-label">阅读难度</span>
            <div className="adv-seg" role="radiogroup" aria-label="阅读难度">
              {levels.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="radio"
                  aria-checked={level === item}
                  className={level === item ? "selected" : ""}
                  onClick={() => setLevel(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <label className="adv-field adv-field-wide">
            <span className="adv-label">{isCustomMode ? "告诉 AI 你的冒险方向" : "给故事一个线索（可选）"}</span>
            <span className="adv-input">
              <input
                value={customPrompt}
                onChange={(event) => { setCustomPrompt(event.target.value.slice(0, 180)); setCreateError(""); }}
                placeholder={isCustomMode ? "例如：我想在会移动的城市里找回一封信" : "例如：我想找一只走失的猫"}
                maxLength={180}
                required={isCustomMode}
              />
              <Shuffle size={14} aria-hidden="true" />
            </span>
          </label>
        </div>

        {!isCustomMode && (
          <div className="adv-chips">
            <span>灵感：</span>
            {HINT_IDEAS.map((chip) => (
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
          <div className="adv-note" role="status">
            <Sparkles size={16} />
            <span>{isAiConfigured ? "AI 会从这句话开始设计角色、冲突、首章译文和可选路线。" : "需要先配置 AI，才能生成自定义首章。"}</span>
            {!isAiConfigured && <Link to="/settings">去设置</Link>}
          </div>
        )}
        {createError && <p className="adv-error" role="alert">{createError}</p>}

        <footer className="adv-create-foot">
          <span className="adv-foot-note">
            <Sparkles size={13} />
            {isAiOpeningMode(selection) ? "生成后会自动保存，你可以继续选择路线。" : "路线会自动保存，可以随时回到旧节点。"}
          </span>
          <button className="adv-primary adv-start" type="submit" disabled={isCreating}>
            {isCreating
              ? <><Sparkles size={17} className="spin" /> AI 正在构思</>
              : <><Plus size={17} /> {isAiOpeningMode(selection) ? "生成冒险" : "开始冒险"}</>}
          </button>
        </footer>
      </form>

      <section className="adv-saves">
        <header className="adv-saves-head">
          <div>
            <span className="adv-eyebrow">Saved routes</span>
            <h2>我的路线</h2>
          </div>
          {data.adventures.length > 0 && (
            <button type="button" className="adv-saves-count" onClick={() => setRoutesOpen(true)}>
              {data.adventures.length} 段 <ChevronRight size={14} />
            </button>
          )}
        </header>

        {data.adventures.length === 0 ? (
          <EmptyState title="第一段故事还没有开始" description="选择一个主题，系统会创建一条可随时返回的学习路线。" />
        ) : (
          <div className="adv-route-scroller">
            {sortedAdventures.slice(0, 6).map((adventure) => {
              const progress = adventureProgress(adventure);
              return (
                <div className={`adv-route-card${adventure.id === currentAdventureId ? " current" : ""}`} key={adventure.id}>
                  <Link className="adv-route-main" to={`/adventure/${adventure.id}`}>
                    <span className="adv-route-thumbwrap">
                      <span className="adv-route-thumb">
                        <AdventureArtwork adventure={adventure} />
                      </span>
                      <em className="adv-tile-chip">{adventure.level}</em>
                    </span>
                    <span className="adv-route-body">
                      <span className="adv-route-top">
                        <strong>{adventure.title}</strong>
                        {adventure.id === currentAdventureId && <em className="adv-current-chip">当前冒险</em>}
                      </span>
                      <span className="adv-route-bottom">
                        <span>第 {progress.chapter} 章 · {progress.favoriteCount} 个生词</span>
                        <span className="adv-route-time">
                          {formatRelative(adventure.updatedAt)}
                          <ChevronRight size={15} />
                        </span>
                      </span>
                    </span>
                  </Link>
                  <div className="adv-route-tools">
                    <button
                      type="button"
                      className="adv-route-delete"
                      aria-label={`删除路线 ${adventure.title}`}
                      title="删除这段路线"
                      onClick={() => setPendingDelete(adventure)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      </div>

      {routesOpen && (
        <div className="confirm-overlay" role="presentation" onClick={() => setRoutesOpen(false)}>
          <div
            className="confirm-dialog adv-routes-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="全部路线"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="adv-routes-dialog-head">
              <div>
                <span className="adv-eyebrow">Saved routes</span>
                <h2>全部路线 · {sortedAdventures.length} 段</h2>
              </div>
              <button type="button" className="icon-button" onClick={() => setRoutesOpen(false)} aria-label="关闭" title="关闭">
                <X size={17} />
              </button>
            </div>
            <div className="adv-routes-list">
              {sortedAdventures.map((adventure) => {
                const progress = adventureProgress(adventure);
                return (
                  <Link
                    key={adventure.id}
                    className={`adv-routes-item${adventure.id === currentAdventureId ? " current" : ""}`}
                    to={`/adventure/${adventure.id}`}
                    onClick={() => setRoutesOpen(false)}
                  >
                    <span className="adv-route-thumbwrap">
                      <span className="adv-route-thumb">
                        <AdventureArtwork adventure={adventure} />
                      </span>
                      <em className="adv-tile-chip">{adventure.level}</em>
                    </span>
                    <span className="adv-routes-item-body">
                      <span className="adv-routes-item-top">
                        <strong>{adventure.title}</strong>
                        {adventure.id === currentAdventureId && <em className="adv-current-chip">当前冒险</em>}
                      </span>
                      <span className="adv-routes-item-meta">
                        第 {progress.chapter} 章 · {progress.favoriteCount} 个生词 · {formatRelative(adventure.updatedAt)} 保存
                      </span>
                    </span>
                    <ChevronRight size={16} className="adv-routes-item-arrow" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

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
