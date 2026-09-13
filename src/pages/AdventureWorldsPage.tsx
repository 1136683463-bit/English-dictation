import { Check, ChevronRight, Lock, Sparkles } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../AppContext";
import PageHeader from "../components/PageHeader";
import { STATION_GATES } from "../data/gateScripts";
import { ECHO_GATES } from "../data/echoGateScripts";
import { MARKET_GATES } from "../data/marketGateScripts";
import { MOUNTAIN_GATES } from "../data/mountainGateScripts";
import { LIBRARY_GATES } from "../data/libraryGateScripts";
import { LIGHTHOUSE_GATES } from "../data/lighthouseGateScripts";
import { isWorldUnlocked } from "../data/worldGateIndex";
import { ALL_RUNES, RUNE_SLOTS_TOTAL } from "../data/runes";
import { findPassedAttempt } from "../services/languageGateService";
import { getRuneState } from "../services/runeService";

/**
 * 世界地图（GRAMMAR_ADVENTURE_PLAN §8.4 `/adventure/worlds`）。
 * P0 只点亮站台世界（8 关）；其余五世界按 §5 列出为"即将解锁"。
 */

export default function AdventureWorldsPage() {
  const { data } = useAppData();

  const hasPassed = (gateId: string) => Boolean(findPassedAttempt(data, gateId));
  const passedGateIds = useMemo(
    () => new Set(STATION_GATES.filter((gate) => findPassedAttempt(data, gate.id)).map((gate) => gate.id)),
    [data]
  );
  const nextGate = STATION_GATES.find((gate) => !passedGateIds.has(gate.id));
  const unlockedRuneCount = useMemo(
    () => ALL_RUNES.filter((rune) => getRuneState(data, rune.id).mastery !== "unseen").length,
    [data]
  );
  // 回声城解锁（PRD-echo-city §8 裁决 2）：站台第 8 关通过即点亮。
  const echoUnlocked = isWorldUnlocked("echo-city", hasPassed);
  const echoPassedCount = ECHO_GATES.filter((gate) => findPassedAttempt(data, gate.id)).length;
  // 集市解锁：同站台第 8 关口径。
  const marketUnlocked = isWorldUnlocked("market", hasPassed);
  const marketPassedCount = MARKET_GATES.filter((gate) => findPassedAttempt(data, gate.id)).length;
  // 山径解锁：同口径。
  const mountainUnlocked = isWorldUnlocked("mountain", hasPassed);
  const mountainPassedCount = MOUNTAIN_GATES.filter((gate) => findPassedAttempt(data, gate.id)).length;
  // 图书馆解锁：同口径。
  const libraryUnlocked = isWorldUnlocked("library", hasPassed);
  const libraryPassedCount = LIBRARY_GATES.filter((gate) => findPassedAttempt(data, gate.id)).length;
  // 灯塔解锁：同口径。
  const lighthouseUnlocked = isWorldUnlocked("lighthouse", hasPassed);
  const lighthousePassedCount = LIGHTHOUSE_GATES.filter((gate) => findPassedAttempt(data, gate.id)).length;

  return (
    <div className="page worlds-page">
      <PageHeader
        eyebrow="语言之门"
        title="六段旅途"
        description="每一道门，都要你亲口说出那句话才打得开。说对了剧情往前走；说错了，NPC 会当真——然后故事用最温和的方式，让你自己把句子改对。"
        action={
          <div className="lesson-progress-pill" aria-label="符文进度">
            <Sparkles size={16} />
            <span>符文 {unlockedRuneCount} / {RUNE_SLOTS_TOTAL}</span>
          </div>
        }
      />

      <section className="world-card station" aria-label="站台世界">
        <header className="world-card-head">
          <div>
            <span className="eyebrow">第一世界 · S0 句子骨架</span>
            <h2>雨夜站台</h2>
            <p>雨夜的火车站，所有人都急着说话——你说话，别人才能听懂。</p>
          </div>
          <span className="world-progress">{passedGateIds.size} / {STATION_GATES.length} 关</span>
        </header>

        <ol className="gate-list">
          {STATION_GATES.map((gate, index) => {
            const passed = passedGateIds.has(gate.id);
            const isNext = nextGate?.id === gate.id;
            const locked = !passed && !isNext && index > 0 && !passedGateIds.has(STATION_GATES[index - 1].id);
            const rune = ALL_RUNES.find((item) => item.id === gate.runeId);
            return (
              <li key={gate.id}>
                <Link
                  to={`/adventure/gate/${gate.id}`}
                  className={`gate-row${passed ? " passed" : ""}${isNext ? " next" : ""}${locked ? " locked" : ""}`}
                  aria-disabled={locked}
                  tabIndex={locked ? -1 : 0}
                  onClick={(event) => { if (locked) event.preventDefault(); }}
                >
                  <span className="gate-row-index">{passed ? <Check size={15} /> : locked ? <Lock size={14} /> : index + 1}</span>
                  <span className="gate-row-body">
                    <strong>{gate.npcLineZh}</strong>
                    <small>{gate.zhIntent}{rune ? ` · 符文「${rune.name}」` : ""}</small>
                  </span>
                  {isNext && <span className="gate-row-next">下一关</span>}
                  <ChevronRight size={16} />
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {marketUnlocked && (
        <section className="world-card market" aria-label="集市世界">
          <header className="world-card-head">
            <div>
              <span className="eyebrow">第二世界 · S1 名词与限定</span>
              <h2>清晨集市</h2>
              <p>要什么得说清楚——名字说不对，摊主就把错的东西递到你手里。</p>
            </div>
            <span className="world-progress">{marketPassedCount} / {MARKET_GATES.length} 关</span>
          </header>
          <ol className="gate-list">
            {MARKET_GATES.map((gate, index) => {
              const passed = hasPassed(gate.id);
              const isNext = !passed && (index === 0 || hasPassed(MARKET_GATES[index - 1].id));
              const rune = ALL_RUNES.find((item) => item.id === gate.runeId);
              return (
                <li key={gate.id}>
                  <Link
                    to={`/adventure/gate/${gate.id}`}
                    className={`gate-row${passed ? " passed" : ""}${isNext ? " next" : ""}`}
                  >
                    <span className="gate-row-index">{passed ? <Check size={15} /> : index + 1}</span>
                    <span className="gate-row-body">
                      <strong>{gate.npcLineZh}</strong>
                      <small>{gate.zhIntent}{rune ? ` · 符文「${rune.name}」` : ""}</small>
                    </span>
                    {isNext && <span className="gate-row-next">下一关</span>}
                    <ChevronRight size={16} />
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {echoUnlocked && (
        <section className="world-card echo" aria-label="回声城世界">
          <header className="world-card-head">
            <div>
              <span className="eyebrow">第三世界 · S2 谓语动词</span>
              <h2>回声城</h2>
              <p>这座城会复读你说过的每句话，时间线会错乱——说错时间，城市会把你拉进错误的一天。</p>
            </div>
            <span className="world-progress">{echoPassedCount} / {ECHO_GATES.length} 关</span>
          </header>
          <ol className="gate-list">
            {ECHO_GATES.map((gate, index) => {
              const passed = hasPassed(gate.id);
              const isNext = !passed && (index === 0 || hasPassed(ECHO_GATES[index - 1].id));
              const rune = ALL_RUNES.find((item) => item.id === gate.runeId);
              return (
                <li key={gate.id}>
                  <Link
                    to={`/adventure/gate/${gate.id}`}
                    className={`gate-row${passed ? " passed" : ""}${isNext ? " next" : ""}`}
                  >
                    <span className="gate-row-index">{passed ? <Check size={15} /> : index + 1}</span>
                    <span className="gate-row-body">
                      <strong>{gate.npcLineZh}</strong>
                      <small>{gate.zhIntent}{rune ? ` · 符文「${rune.name}」` : ""}</small>
                    </span>
                    {isNext && <span className="gate-row-next">下一关</span>}
                    <ChevronRight size={16} />
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {mountainUnlocked && (
        <section className="world-card mountain" aria-label="山径世界">
          <header className="world-card-head">
            <div>
              <span className="eyebrow">第四世界 · S3 修饰与扩展</span>
              <h2>雾中山径</h2>
              <p>雾中盘山路，要描述路况才能前进——形容词、比较、介词、语序，说错一样，雾就把路藏起来。</p>
            </div>
            <span className="world-progress">{mountainPassedCount} / {MOUNTAIN_GATES.length} 关</span>
          </header>
          <ol className="gate-list">
            {MOUNTAIN_GATES.map((gate, index) => {
              const passed = hasPassed(gate.id);
              const isNext = !passed && (index === 0 || hasPassed(MOUNTAIN_GATES[index - 1].id));
              const rune = ALL_RUNES.find((item) => item.id === gate.runeId);
              return (
                <li key={gate.id}>
                  <Link
                    to={`/adventure/gate/${gate.id}`}
                    className={`gate-row${passed ? " passed" : ""}${isNext ? " next" : ""}`}
                  >
                    <span className="gate-row-index">{passed ? <Check size={15} /> : index + 1}</span>
                    <span className="gate-row-body">
                      <strong>{gate.npcLineZh}</strong>
                      <small>{gate.zhIntent}{rune ? ` · 符文「${rune.name}」` : ""}</small>
                    </span>
                    {isNext && <span className="gate-row-next">下一关</span>}
                    <ChevronRight size={16} />
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {libraryUnlocked && (
        <section className="world-card library" aria-label="图书馆世界">
          <header className="world-card-head">
            <div>
              <span className="eyebrow">第五世界 · S4 句子变长</span>
              <h2>静默图书馆</h2>
              <p>有些书只有说出完整长句才会打开——句子缺一块，书页就纹丝不动。</p>
            </div>
            <span className="world-progress">{libraryPassedCount} / {LIBRARY_GATES.length} 关</span>
          </header>
          <ol className="gate-list">
            {LIBRARY_GATES.map((gate, index) => {
              const passed = hasPassed(gate.id);
              const isNext = !passed && (index === 0 || hasPassed(LIBRARY_GATES[index - 1].id));
              const rune = ALL_RUNES.find((item) => item.id === gate.runeId);
              return (
                <li key={gate.id}>
                  <Link
                    to={`/adventure/gate/${gate.id}`}
                    className={`gate-row${passed ? " passed" : ""}${isNext ? " next" : ""}`}
                  >
                    <span className="gate-row-index">{passed ? <Check size={15} /> : index + 1}</span>
                    <span className="gate-row-body">
                      <strong>{gate.npcLineZh}</strong>
                      <small>{gate.zhIntent}{rune ? ` · 符文「${rune.name}」` : ""}</small>
                    </span>
                    {isNext && <span className="gate-row-next">下一关</span>}
                    <ChevronRight size={16} />
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {lighthouseUnlocked && (
        <section className="world-card lighthouse" aria-label="灯塔世界">
          <header className="world-card-head">
            <div>
              <span className="eyebrow">第六世界 · S5 特殊与语用</span>
              <h2>终章灯塔</h2>
              <p>终章——塔顶的守灯人在等一句道别。灯只对「有分量的话」保持明亮。</p>
            </div>
            <span className="world-progress">{lighthousePassedCount} / {LIGHTHOUSE_GATES.length} 关</span>
          </header>
          <ol className="gate-list">
            {LIGHTHOUSE_GATES.map((gate, index) => {
              const passed = hasPassed(gate.id);
              const isNext = !passed && (index === 0 || hasPassed(LIGHTHOUSE_GATES[index - 1].id));
              const rune = ALL_RUNES.find((item) => item.id === gate.runeId);
              return (
                <li key={gate.id}>
                  <Link
                    to={`/adventure/gate/${gate.id}`}
                    className={`gate-row${passed ? " passed" : ""}${isNext ? " next" : ""}`}
                  >
                    <span className="gate-row-index">{passed ? <Check size={15} /> : index + 1}</span>
                    <span className="gate-row-body">
                      <strong>{gate.npcLineZh}</strong>
                      <small>{gate.zhIntent}{rune ? ` · 符文「${rune.name}」` : ""}</small>
                    </span>
                    {isNext && <span className="gate-row-next">下一关</span>}
                    <ChevronRight size={16} />
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      )}
    </div>
  );
}
