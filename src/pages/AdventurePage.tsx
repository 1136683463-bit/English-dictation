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
import { appendAdventureEvent } from "../services/adventureTelemetry";

const ADVENTURE_THEME_COUNT = ADVENTURE_THEME_LIBRARY.length;
import AdventureThemeArt, { AdventureArtwork } from "../components/AdventureThemeArt";
import type { Adventure, AdventureLevel, AdventureTemplate } from "../types";
import { imeSafeFormProps } from "../components/imeGuard";

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
  // R9：选中 AI 推荐卡时，推荐主题将覆盖线索——输入框必须提前明示，杜绝静默丢弃。
  const isRecommendationMode = selection.kind === "ai";
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

  // 随机推荐 = 本地从 50 个内置主题里抽样：瞬时完成、不调 AI，
  // 且避开最近展示过的主题，同批 4 张插画场景互不重复。
  // 注意：历史排除集只增不减，而每个场景桶仅 3~4 个主题。若严格按历史排除，
  // 部分桶会被掏空，导致同批不足 4 张（出现只剩 2 张的情况）。因此凑不齐 4 张时
  // 回退为「只排除当前这批」，保证始终给满 4 张且换一批新内容。
  const shuffleRecommendations = () => {
    const startedAt = Date.now();
    appendAdventureEvent({ kind: "recommendation_requested", ts: new Date().toISOString() });
    const currentIds = recommendations.map((item) => item.id);
    const historyIds = readShownThemeIds();
    let items = sampleAdventureThemes(4, [...historyIds, ...currentIds]);
    // 只有严格按历史排除凑齐 4 张时才把新主题累积进历史；
    // 回退批次可能复用历史主题，不应再写入，否则历史被污染、下次仍触发回退。
    const usedFallback = items.length < 4;
    if (usedFallback) {
      // 历史把场景桶掏空了：放宽为只避开当前这批，重新补足 4 张。
      items = sampleAdventureThemes(4, currentIds);
    }
    if (!items.length) {
      appendAdventureEvent({ kind: "recommendation_failed", errorType: "empty-sample", ts: new Date().toISOString() });
      return;
    }
    appendAdventureEvent({ kind: "recommendation_generated", count: items.length, durationMs: Date.now() - startedAt, ts: new Date().toISOString() });
    updateRecommendations(items);
    if (!usedFallback) {
      writeShownThemeIds([...historyIds, ...items.map((item) => item.id)]);
    }
    setSelection({ kind: "ai", index: 0 });
    setCreateError("");
  };

  const restoreDefaultTemplates = () => {
    appendAdventureEvent({ kind: "recommendation_restored_default", ts: new Date().toISOString() });
    updateRecommendations([]);
    setSelection({ kind: "offline", id: "city" });
  };

  const startAdventure = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateError("");
    const isAiOpening = isAiOpeningMode(selection);
    const createSource = selection.kind === "offline" ? "offline" : selection.kind === "ai" ? "ai" : "custom";
    const startedAt = Date.now();
    let prompt = customPrompt.trim();
    if (selection.kind === "ai") {
      const item = recommendations[selection.index];
      if (!item) { setCreateError("这张推荐卡已经失效，请重新随机推荐。"); return; }
      prompt = `${item.title}：${item.description}`;
      // R4 推荐采纳：选中推荐卡并真正开始创建时记录。
      appendAdventureEvent({ kind: "recommendation_selected", themeId: item.id, position: selection.index + 1, ts: new Date().toISOString() });
    }
    if (selection.kind === "custom" && !prompt) {
      setCreateError("先写一句话或一个方向，AI 才能帮你补齐剧情。");
      return;
    }
    if (isAiOpening && !isAiConfigured) {
      setCreateError("这个冒险需要 AI 生成。请先到设置中填写 AI 服务信息。");
      return;
    }

    appendAdventureEvent({
      kind: "adventure_create_started",
      template: selection.kind === "offline" ? selection.id : "custom",
      level,
      source: createSource,
      ts: new Date().toISOString()
    });
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
      appendAdventureEvent({
        kind: "adventure_created",
        adventureId: result.adventure.id,
        template: result.adventure.template,
        level,
        source: createSource,
        hasCustomPrompt: Boolean(customPrompt.trim()),
        nodeCount: result.adventure.nodes.length,
        durationMs: Date.now() - startedAt,
        ts: new Date().toISOString()
      });
      updateData(() => result.data);
      navigate(`/adventure/${result.adventure.id}`);
    } catch (error) {
      appendAdventureEvent({
        kind: "adventure_create_failed",
        stage: isAiOpening ? "request" : "save",
        errorType: error instanceof Error ? error.name : "unknown",
        durationMs: Date.now() - startedAt,
        ts: new Date().toISOString()
      });
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
            <span className="adv-eyebrow">故事冒险 · 阅读收词</span>
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
      <section className="adv-gate-entry" aria-label="语言之门">
        <div className="adv-gate-entry-copy">
          <span className="adv-eyebrow">语言之门 · 语法课</span>
          <h2>说错一句话，故事里会有人真的误解你</h2>
          <p>语言之门是这里的语法课——你把英文说给 NPC 听，说错了他会当真，故事用结果让你记住对的句子。</p>
          <p>六段旅途＝六步语法：站台（把句子搭完整）→ 集市（名词与数量）→ 回声城（时态）→ 山径（修饰）→ 图书馆（长句）→ 灯塔（情态语气）。共 50 关，每关 2–4 分钟。</p>
        </div>
        <Link to="/adventure/worlds" className="adv-primary adv-gate-entry-cta">
          <Sparkles size={16} /> 进入第一世界
        </Link>
      </section>

      <form className="adv-card adv-create" onSubmit={startAdventure} {...imeSafeFormProps}>
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
          {isRecommendationMode && selection.kind === "ai" ? (
            <div className="adv-field adv-field-wide">
              <span className="adv-label">本次冒险的线索</span>
              <p className="adv-note" role="status">
                <Sparkles size={16} />
                <span>将以推荐主题为准：{recommendations[selection.index]?.title}——{recommendations[selection.index]?.description}。你已填写的线索本次不会使用。</span>
              </p>
            </div>
          ) : (
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
          )}
        </div>

        {!isCustomMode && !isRecommendationMode && (
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
          if (pendingDelete) {
            // R4 adventure_deleted：删除时进度是"后悔信号"的代理指标。
            const path = getAdventurePath(pendingDelete);
            appendAdventureEvent({
              kind: "adventure_deleted",
              adventureId: pendingDelete.id,
              nodeCount: pendingDelete.nodes.length,
              completedNodeCount: path.length,
              ageDays: Math.max(0, Math.round((Date.now() - new Date(pendingDelete.createdAt).getTime()) / 86400000)),
              ts: new Date().toISOString()
            });
            updateData((latest) => deleteAdventure(latest, pendingDelete.id));
          }
          setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
