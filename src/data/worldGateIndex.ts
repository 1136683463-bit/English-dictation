import type { LanguageGate } from "../types";
import { STATION_GATES, getStationGate } from "./gateScripts";
import { ECHO_GATES, getEchoGate } from "./echoGateScripts";
import { MARKET_GATES, getMarketGate } from "./marketGateScripts";
import { MOUNTAIN_GATES, getMountainGate } from "./mountainGateScripts";
import { LIBRARY_GATES, getLibraryGate } from "./libraryGateScripts";
import { LIGHTHOUSE_GATES, getLighthouseGate } from "./lighthouseGateScripts";

/**
 * 多世界门索引（PRD-echo-city-content §7 技术接入）：
 * 路由 /adventure/gate/:gateId 按合并索引查询，世界按 gateId 前缀分发。
 */

export interface WorldMeta {
  id: string;
  /** 关卡列表（保持关卡序）。 */
  gates: LanguageGate[];
  name: string;
  eyebrow: string;
  /** 顶栏面包屑文案（如「站台 · 第 2 关」）。 */
  crumb: string;
  /** 这个世界教什么（一句 can-do，地图页展示；PRD-learning-goal-visibility FR-2b）。 */
  canDo: string;
  /** 解锁条件的人话（未解锁时展示）。 */
  unlockHint: string;
}

export const WORLDS: WorldMeta[] = [
  {
    id: "station",
    gates: STATION_GATES,
    name: "雨夜站台",
    eyebrow: "第一世界 · 把句子搭完整",
    crumb: "站台",
    canDo: "把句子搭完整——谁 + 做什么，一句话立得住",
    unlockHint: "现在就能开始"
  },
  {
    id: "market",
    gates: MARKET_GATES,
    name: "清晨集市",
    eyebrow: "第二世界 · 说清数量和特指",
    crumb: "集市",
    canDo: "说清数量和特指——一个还是两个、这一个还是那一个",
    unlockHint: "通过站台第 8 关后开启"
  },
  {
    id: "echo-city",
    gates: ECHO_GATES,
    name: "回声城",
    eyebrow: "第三世界 · 把时间说准",
    crumb: "回声城",
    canDo: "把时间说准——昨天、每天、正在、将要",
    unlockHint: "通过站台第 8 关后开启"
  },
  {
    id: "mountain",
    gates: MOUNTAIN_GATES,
    name: "雾中山径",
    eyebrow: "第四世界 · 给一句话加细节",
    crumb: "山径",
    canDo: "给一句话加细节——多陡、比什么更怎么样、在哪儿",
    unlockHint: "通过站台第 8 关后开启"
  },
  {
    id: "library",
    gates: LIBRARY_GATES,
    name: "静默图书馆",
    eyebrow: "第五世界 · 把短句连成长句",
    crumb: "图书馆",
    canDo: "把两句话连成一句，把长句拆回短句",
    unlockHint: "通过站台第 8 关后开启"
  },
  {
    id: "lighthouse",
    gates: LIGHTHOUSE_GATES,
    name: "终章灯塔",
    eyebrow: "第六世界 · 情态与语用",
    crumb: "灯塔",
    canDo: "说出「能、该、必须」，也说出「假如」",
    unlockHint: "通过站台第 8 关后开启"
  }
];

/** 按 gateId 找门（跨世界）。 */
export const getGateById = (gateId: string): LanguageGate | undefined =>
  getStationGate(gateId) ?? getMarketGate(gateId) ?? getEchoGate(gateId) ?? getMountainGate(gateId) ?? getLibraryGate(gateId) ?? getLighthouseGate(gateId);

/** 按 gateId 找所属世界。 */
export const getWorldOfGate = (gateId: string): WorldMeta | undefined => {
  if (getStationGate(gateId)) return WORLDS[0];
  if (getMarketGate(gateId)) return WORLDS[1];
  if (getEchoGate(gateId)) return WORLDS[2];
  if (getMountainGate(gateId)) return WORLDS[3];
  if (getLibraryGate(gateId)) return WORLDS[4];
  if (getLighthouseGate(gateId)) return WORLDS[5];
  return undefined;
};

/** 同世界内下一关（用于结算页「下一关」链接）。 */
export const getNextGate = (gateId: string): LanguageGate | undefined => {
  const world = getWorldOfGate(gateId);
  if (!world) return undefined;
  const index = world.gates.findIndex((gate) => gate.id === gateId);
  return index >= 0 ? world.gates[index + 1] : undefined;
};

/**
 * 指定世界是否已解锁：站台恒开；集市与回声城均在站台第 8 关通过后点亮。
 * 集市全量 8 关完成前不做严格顺序解锁（避免回声城被尚不存在的 market-gate-8 锁死）。
 */
export const isWorldUnlocked = (
  worldId: string,
  hasPassed: (gateId: string) => boolean
): boolean => {
  if (worldId === "station") return true;
  if (["market", "echo-city", "mountain", "library", "lighthouse"].includes(worldId)) return hasPassed("station-gate-8");
  return false;
};
