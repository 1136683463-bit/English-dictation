import { ArrowLeft, ChevronRight, Lightbulb, Sparkles, Volume2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAppData } from "../AppContext";
import { GATE_STORIES, STATION_GATES, getStationGate } from "../data/gateScripts";
import { ECHO_STORIES, getEchoGate, getEchoStory, type EchoGateStory } from "../data/echoGateScripts";
import { MARKET_STORIES, getMarketGate, getMarketStory, type MarketGateStory } from "../data/marketGateScripts";
import { MOUNTAIN_STORIES, getMountainGate, getMountainStory, type MountainGateStory } from "../data/mountainGateScripts";
import { LIBRARY_STORIES, getLibraryGate, getLibraryStory, type LibraryGateStory } from "../data/libraryGateScripts";
import { LIGHTHOUSE_STORIES, getLighthouseGate, getLighthouseStory, type LighthouseGateStory } from "../data/lighthouseGateScripts";
import { getGateById, getNextGate, getWorldOfGate } from "../data/worldGateIndex";
import { getRuneById } from "../data/runes";
import {
  buildGateAttempt,
  countGateAttempts,
  findPassedAttempt,
  judgeGateAnswer,
  recordGateAttempt,
  type GateJudgement
} from "../services/languageGateService";
import { chargeRuneForVerdict } from "../services/runeService";
import { appendAdventureEvent } from "../services/adventureTelemetry";
import { speakText } from "../services/speechService";
import type { LanguageGate } from "../types";

/**
 * 语言之门关卡页（GRAMMAR_ADVENTURE_PLAN §5 单关结构 2–4 分钟）：
 * 前情 → 剧情（NPC 台词，可听）→ 语言之门（写一句英文，三档反馈）→ 结算（符文 + 预告）。
 *
 * 设计纪律（§7.4）：界面永不出现"正确/错误"字样，只有剧情反应。
 * P0 手感验证期：不依赖 adventureId（门独立可玩），attempt 的 adventureId 按世界分发（world:station / world:echo-city）。
 * 多世界：gateId 经 worldGateIndex 合并索引查询，story 取自所属世界的 STORIES（字段同构）。
 */

/** 三个世界的 story 字段同构，运行时按 gateId 归属分发。 */
type AnyGateStory = (typeof GATE_STORIES)[number] | EchoGateStory | MarketGateStory | MountainGateStory | LibraryGateStory | LighthouseGateStory;

const STATION_IDS = STATION_GATES.map((gate) => gate.id);

const getStoryForGate = (gateId: string): AnyGateStory | undefined => {
  if (getStationGate(gateId)) {
    const index = STATION_IDS.indexOf(gateId);
    return index >= 0 ? GATE_STORIES[index] : undefined;
  }
  if (getMarketGate(gateId)) return getMarketStory(gateId);
  if (getEchoGate(gateId)) return getEchoStory(gateId);
  if (getMountainGate(gateId)) return getMountainStory(gateId);
  if (getLibraryGate(gateId)) return getLibraryStory(gateId);
  return getLighthouseGate(gateId) ? getLighthouseStory(gateId) : undefined;
};

const getWorldAdventureId = (gateId: string): string => {
  const worldId = getWorldOfGate(gateId)?.id;
  if (worldId === "market") return "world:market";
  if (worldId === "echo-city") return "world:echo-city";
  if (worldId === "mountain") return "world:mountain";
  if (worldId === "library") return "world:library";
  if (worldId === "lighthouse") return "world:lighthouse";
  return "world:station";
};

/**
 * 把 `**bold**` 内联标记渲染为高亮片段（PRD FR-1）。
 * 约定只支持 `**…**`、不支持嵌套与转义——够用即停。
 */
const renderWithBold = (text: string): ReactNode[] =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index} className="gate-highlight">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );

type PlayPhase = "story" | "gate" | "settle";

export default function GatePlayPage() {
  const { gateId = "" } = useParams();
  const { data, updateDataAsync } = useAppData();
  const gate = getGateById(gateId);
  const world = getWorldOfGate(gateId);
  const gateIndex = useMemo(() => (world ? world.gates.findIndex((item) => item.id === gateId) : -1), [gateId, world]);
  const story = getStoryForGate(gateId);
  const rune = gate ? getRuneById(gate.runeId) : undefined;
  const nextGate = getNextGate(gateId);
  const npcName =
    world?.id === "echo-city"
      ? gateIndex === 0 ? "珂拉" : "复读市民"
      : gateIndex === 0 || gateIndex === 6 ? "Vera" : gateIndex === 4 ? "Omar" : "小灯";
  const adventureId = getWorldAdventureId(gateId);

  const alreadyPassed = useMemo(() => (gate ? Boolean(findPassedAttempt(data, gate.id)) : false), [data, gate]);
  const [phase, setPhase] = useState<PlayPhase>("story");
  const [answer, setAnswer] = useState("");
  const [judgement, setJudgement] = useState<GateJudgement | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [attemptIndex, setAttemptIndex] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [runeRuleOpen, setRuneRuleOpen] = useState(false);
  const [tipCardOpen, setTipCardOpen] = useState(false);
  const sessionIdRef = useRef(`gate-sess-${Date.now()}`);
  const attemptStartRef = useRef(Date.now());
  const storyStartRef = useRef(Date.now());

  // R4 gate_shown：门出现即记录。
  useEffect(() => {
    if (!gate) return;
    appendAdventureEvent({
      kind: "gate_shown",
      adventureId,
      sessionId: sessionIdRef.current,
      gateId: gate.id,
      runeId: gate.runeId,
      targetPattern: gate.requiredPattern,
      ts: new Date().toISOString()
    });
  }, [gate?.id]);

  // FR-6 gate_story_shown：剧情阶段展示。
  useEffect(() => {
    if (!gate || phase !== "story") return;
    storyStartRef.current = Date.now();
    appendAdventureEvent({
      kind: "gate_story_shown",
      adventureId,
      sessionId: sessionIdRef.current,
      gateId: gate.id,
      ts: new Date().toISOString()
    });
  }, [gate?.id, phase]);

  // R4 gate_abandoned：未 pass 离开页面时记录（组件卸载口径，FR-6 起携带 phase）。
  useEffect(() => {
    return () => {
      if (!gate) return;
      // 用 dataRef 不可行（卸载时闭包旧值），以最新 judgement 是否 pass 近似判断。
      if (judgement?.verdict === "pass") return;
      appendAdventureEvent({
        kind: "gate_abandoned",
        gateId: gate.id,
        attempts: attemptIndex - 1,
        lastVerdict: judgement?.verdict ?? "near",
        phase,
        ts: new Date().toISOString()
      });
    };
  }, [gate?.id, judgement?.verdict, attemptIndex, phase]);

  if (!gate || !story) return <Navigate to="/adventure/worlds" replace />;

  const playNpcLine = async (text: string) => {
    setIsPlaying(true);
    const played = await speakText(text, {
      lang: data.settings.speechLang,
      rate: data.settings.speechRate,
      voiceURI: data.settings.speechVoice,
      fallbackToSystem: true,
      fallbackToDictionary: false
    });
    setIsPlaying(false);
    // FR-6 tts_played：按播放结果上报。
    appendAdventureEvent({
      kind: played ? "tts_played" : "tts_failed",
      adventureId,
      gateId: gate.id,
      phase,
      voiceType: "system",
      ts: new Date().toISOString()
    });
  };

  /** story → gate：记录剧情停留时长（FR-6 gate_story_left）。 */
  const enterGatePhase = () => {
    appendAdventureEvent({
      kind: "gate_story_left",
      adventureId,
      sessionId: sessionIdRef.current,
      gateId: gate.id,
      dwellMs: Date.now() - storyStartRef.current,
      ts: new Date().toISOString()
    });
    setPhase("gate");
    attemptStartRef.current = Date.now();
  };

  const submit = async () => {
    const raw = answer.trim();
    if (!raw) return;
    const result = judgeGateAnswer(gate, raw);
    setJudgement(result);

    // R4 gate_submitted。
    appendAdventureEvent({
      kind: "gate_submitted",
      adventureId,
      sessionId: sessionIdRef.current,
      gateId: gate.id,
      verdict: result.verdict,
      attemptIndex,
      errorTags: result.errorTags,
      latencyMs: Date.now() - attemptStartRef.current,
      hintLevel: hintsUsed,
      ts: new Date().toISOString()
    });

    const attempt = buildGateAttempt({
      adventureId,
      nodeId: `gate-node-${gateIndex + 1}`,
      gate,
      raw,
      judgement: result,
      hintsUsed,
      attemptIndex
    });
    await updateDataAsync(async (latest) => ({ data: chargeRuneForVerdict(recordGateAttempt(latest, attempt), gate.runeId, result.verdict) }));

    if (result.verdict === "pass") {
      // R4 rune_unlocked（首次解锁时记录）。
      appendAdventureEvent({
        kind: "rune_unlocked",
        runeId: gate.runeId,
        level: 1,
        worldId: "station",
        ts: new Date().toISOString()
      });
      setPhase("settle");
    }
    // misread / near：留在 gate 阶段，展示剧情反馈，等玩家改。
  };

  const retry = () => {
    setJudgement(null);
    setAnswer("");
    setAttemptIndex((index) => index + 1);
    attemptStartRef.current = Date.now();
  };

  const useHint = () => {
    const next = Math.min(3, hintsUsed + 1);
    setHintsUsed(next);
    appendAdventureEvent({ kind: "gate_hint_used", gateId: gate.id, hintLevel: next, ts: new Date().toISOString() });
  };

  return (
    <div className="page gate-play-page">
      <header className="gate-play-topbar">
        <Link to="/adventure/worlds" className="icon-button" aria-label="返回世界地图"><ArrowLeft size={18} /></Link>
        <div className="gate-play-crumb">
          <span className="eyebrow">{world?.crumb ?? "站台"} · 第 {gateIndex + 1} 关</span>
          {rune && (
            <button
              type="button"
              className={`gate-play-rune-chip is-expandable${runeRuleOpen ? " is-open" : ""}`}
              onClick={() => setRuneRuleOpen((open) => !open)}
              aria-expanded={runeRuleOpen}
            >
              <Sparkles size={13} /> {rune.name}
            </button>
          )}
        </div>
        {alreadyPassed && <span className="gate-play-passed-chip">已通过 · 重玩</span>}
      </header>

      {rune && runeRuleOpen && (
        <p className="gate-rune-rule" role="status">
          {rune.oneLineRule}
        </p>
      )}

      {phase === "story" && (
        <section className="gate-story" aria-label="剧情">
          <div className="gate-story-card">
            <p className="gate-story-text" lang="en">{renderWithBold(story.setup)}</p>
            <p className="gate-story-zh">{renderWithBold(story.setupZh)}</p>

            <div className="gate-npc-card">
              <div className="gate-npc-head">
                <span className="gate-npc-identity">
                  <span className="gate-npc-avatar" aria-hidden="true">{npcName === "小灯" ? "灯" : npcName.charAt(0)}</span>
                  <span className="gate-npc-name">{npcName}</span>
                </span>
                <button type="button" className="icon-button" onClick={() => void playNpcLine(gate.npcLine)} disabled={isPlaying} aria-label="听 NPC 台词">
                  <Volume2 size={16} />
                </button>
              </div>
              <p className="gate-npc-line" lang="en">{gate.npcLine}</p>
              <p className="gate-npc-line-zh">{gate.npcLineZh}</p>
            </div>
          </div>

          <div className="gate-brief-card" aria-label="任务预告">
            <p className="gate-brief-intent">
              <Lightbulb size={15} />
              <span>小灯想让你说：<strong>{gate.zhIntent}</strong></span>
            </p>
            <div className="gate-brief-body">
              <div className="gate-brief-skeleton">
                <code lang="en">{gate.hints[0]}</code>
                <small>待会儿要说出的一句</small>
              </div>
              {rune && (
                <div className="gate-tip-card">
                  <button
                    type="button"
                    className="gate-tip-toggle"
                    onClick={() => {
                      const next = !tipCardOpen;
                      setTipCardOpen(next);
                      // R10 story_tip_opened：观测 scaffold 强度（不计入 hintsUsed）。
                      if (next) {
                        appendAdventureEvent({
                          kind: "story_tip_opened",
                          adventureId,
                          sessionId: sessionIdRef.current,
                          gateId: gate.id,
                          ts: new Date().toISOString()
                        });
                      }
                    }}
                    aria-expanded={tipCardOpen}
                  >
                    <ChevronRight size={14} className={tipCardOpen ? "is-open" : ""} />
                    想看看这句话怎么说？
                  </button>
                  {tipCardOpen && (
                    <div className="gate-tip-content">
                      <p>{rune.oneLineRule}</p>
                      {/* 例句取 spells[1]（首条可能与答案相同——scaffold 过强口径风险，PRD 开放问题③） */}
                      {rune.spells[1] && <p className="gate-tip-example" lang="en">例：{rune.spells[1]}</p>}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <button type="button" className="primary-button gate-story-cta" onClick={enterGatePhase}>
            回答她 <ChevronRight size={16} />
          </button>
        </section>
      )}

      {phase === "gate" && (
        <section className="gate-panel" aria-label="语言之门">
          <div className="gate-npc-card compact">
            <p className="gate-npc-line" lang="en">{gate.npcLine}</p>
            <p className="gate-npc-line-zh">{gate.npcLineZh}</p>
          </div>

          <div className="gate-brief-inline" aria-label="任务参照">
            <p className="gate-intent">你想说：<strong>{gate.zhIntent}</strong></p>
            <code className="gate-brief-skeleton-line" lang="en">{gate.hints[0]}</code>
          </div>

          {!judgement || judgement.verdict === "near" ? (
            <div className="gate-input-block">
              {judgement?.verdict === "near" && (
                <div className="gate-lamp-hint" role="status">
                  <Lightbulb size={15} />
                  <span>小灯：差一点——再听一遍，调整一个词序或拼写。</span>
                </div>
              )}
              <textarea
                className="gate-answer-input"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder={gate.mode === "complete" ? "补全这句话…" : "写下这句英文…"}
                rows={2}
                autoFocus
              />
              <div className="gate-input-actions">
                <button type="button" className="text-button" onClick={useHint} disabled={hintsUsed >= 3}>
                  <Lightbulb size={14} /> 提示 {hintsUsed}/3
                </button>
                <button type="button" className="primary-button" onClick={() => void submit()} disabled={!answer.trim()}>
                  说出这句话
                </button>
              </div>
              {hintsUsed > 0 && (
                <p className="gate-hint-line" role="status">小灯：{gate.hints[hintsUsed - 1]}</p>
              )}
            </div>
          ) : judgement.verdict === "misread" ? (
            <div className="gate-misread" role="status">
              <div className="gate-npc-card misread">
                <p className="gate-npc-line" lang="en">{judgement.branch?.npcReply}</p>
                <p className="gate-npc-line-zh">{judgement.branch?.npcReplyZh}</p>
              </div>
              <p className="gate-lamp-hint"><Lightbulb size={15} /><span>小灯：{judgement.branch?.lampHint}</span></p>
              <div className="gate-input-actions">
                <button type="button" className="text-button" onClick={useHint} disabled={hintsUsed >= 3}>
                  <Lightbulb size={14} /> 提示 {hintsUsed}/3
                </button>
                <button type="button" className="primary-button" onClick={retry}>再说一次</button>
              </div>
              {hintsUsed > 0 && <p className="gate-hint-line" role="status">小灯：{gate.hints[hintsUsed - 1]}</p>}
            </div>
          ) : null}
        </section>
      )}

      {phase === "settle" && (
        <section className="gate-settle" aria-label="结算">
          {/* 因果链（初学者版）：你的句子（拆骨架）→ NPC 回应（带头像）→ 符文（正反对比）。 */}

          {/* ① 你的句子：把它按"谁 + 做什么"拆开——骨架从你自己的句子里长出来，对得上号 */}
          <div className="gate-recall-card" aria-label="你说的话">
            <span className="gate-recall-label">你说</span>
            <p className="gate-recall-answer" lang="en">“{answer}”</p>
            <div className="gate-skeleton" aria-label="这句话的骨架">
              <span className="gate-skeleton-part">
                <em lang="en">{gate.skeleton.subject}</em>
                <small>{gate.skeleton.subjectLabel}</small>
              </span>
              <span className="gate-skeleton-plus">+</span>
              <span className="gate-skeleton-part">
                <em lang="en">{gate.skeleton.verb}</em>
                <small>{gate.skeleton.verbLabel}</small>
              </span>
            </div>
            <p className="gate-skeleton-note">你的这句话，就是按这个骨架立住的。</p>
          </div>

          <div className="gate-settle-link" aria-hidden="true"><span className="gate-settle-link-arrow">↓</span></div>

          {/* ② NPC 回应：带头像，一眼看出是角色在说话 */}
          <div className="gate-npc-card pass">
            <div className="gate-npc-head">
              <span className="gate-npc-identity">
                <span className="gate-npc-avatar" aria-hidden="true">{story.passSpeaker === "小灯" ? "灯" : story.passSpeaker.charAt(0)}</span>
                <span className="gate-npc-name">{story.passSpeaker}</span>
              </span>
            </div>
            <p className="gate-npc-line" lang="en">{story.passLine}</p>
            <p className="gate-npc-line-zh">{story.passLineZh}</p>
          </div>

          {rune && (
            <>
              <div className="gate-settle-link" aria-hidden="true"><span className="gate-settle-link-arrow">↓</span></div>

              {/* ③ 符文：规则 + 正反例对比（有对比才知道为什么对） */}
              <div className="gate-rune-card">
                <span className="gate-rune-glyph" aria-hidden="true"><Sparkles size={20} /></span>
                <div className="gate-rune-body">
                  <strong>点亮符文「{rune.name}」</strong>
                  <p>{rune.oneLineRule}</p>
                  <div className="gate-rune-compare">
                    <p className="gate-rune-good" lang="en">✓ {answer}</p>
                    <p className="gate-rune-bad">
                      <span className="gate-rune-bad-text" lang="en">✗ {gate.counterExample}</span>
                      <small>——{gate.counterNote}</small>
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          <p className="gate-teaser">{story.teaser}</p>

          <div className="gate-settle-actions">
            {nextGate ? (
              <>
                <Link to={`/adventure/gate/${nextGate.id}`} className="primary-button">
                  下一关 <ChevronRight size={16} />
                </Link>
                <Link to="/adventure/worlds" className="text-button">回到世界地图</Link>
              </>
            ) : (
              <Link to="/adventure/worlds" className="primary-button">
                站台世界已走完 · 回到地图 <ChevronRight size={16} />
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
