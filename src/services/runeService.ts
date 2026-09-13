import type { AppData, RuneState } from "../types";
import { getRuneById } from "../data/runes";
import type { GateVerdict } from "./languageGateService";
import { nowIso } from "./storage";

/**
 * 符文熟练度推进（GRAMMAR_ADVENTURE_PLAN §4.1）。
 * mastery 阶梯：unseen → seen → usable → fluent → instinct。
 * P0 简化口径：
 *   pass（说出/补全模式）→ fluent；near → usable；misread 后改对 → fluent；
 *   instinct 留给 P1 的自由回应模式（正确 2 次），P0 不可达。
 */

const MASTERY_ORDER: RuneState["mastery"][] = ["unseen", "seen", "usable", "fluent", "instinct"];

const masteryForVerdict = (verdict: GateVerdict): RuneState["mastery"] =>
  verdict === "pass" ? "fluent" : verdict === "near" ? "usable" : "seen";

const maxMastery = (a: RuneState["mastery"], b: RuneState["mastery"]) =>
  MASTERY_ORDER.indexOf(a) >= MASTERY_ORDER.indexOf(b) ? a : b;

export const getRuneState = (data: AppData, runeId: string): RuneState =>
  data.runeStates.find((state) => state.runeId === runeId) ?? { runeId, mastery: "unseen", xp: 0 };

/** 一次判定给符文充能：xp +1（pass +2），mastery 按阶梯取最高，只升不降。 */
export const chargeRuneForVerdict = (data: AppData, runeId: string, verdict: GateVerdict): AppData => {
  if (!getRuneById(runeId)) return data;
  const current = getRuneState(data, runeId);
  const next: RuneState = {
    runeId,
    mastery: maxMastery(current.mastery, masteryForVerdict(verdict)),
    xp: current.xp + (verdict === "pass" ? 2 : 1),
    unlockedAt: current.unlockedAt ?? nowIso()
  };
  const exists = data.runeStates.some((state) => state.runeId === runeId);
  return {
    ...data,
    runeStates: exists ? data.runeStates.map((state) => (state.runeId === runeId ? next : state)) : [...data.runeStates, next]
  };
};

/** NPC 记忆（GRAMMAR_ADVENTURE_PLAN §6.2）：同一语法点历史 errorTags → 一句"被记得"的台词素材。 */
export const recallTopicMemory = (data: AppData, topicId: string): { count: number; errorTags: string[] } => {
  const attempts = data.gateAttempts.filter((attempt) => attempt.topicId === topicId);
  const tags = Array.from(new Set(attempts.flatMap((attempt) => attempt.errorTags)));
  return { count: attempts.length, errorTags: tags };
};
