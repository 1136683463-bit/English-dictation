import { describe, expect, it } from "vitest";
import { MOUNTAIN_GATES, MOUNTAIN_STORIES } from "./mountainGateScripts";
import { getRuneById } from "./runes";

/**
 * 山径红线校验——复刻站台/回声城口径。
 * 「」内引文（玩家句子复读）豁免禁用词与语法检测。
 */

const FORBIDDEN_PATTERNS = [/\bwrong\b/i, /\bincorrect\b/i, /\bmistake\b/i, /错误/, /不对/, /答错/];

const stripQuoted = (line: string): string => line.replace(/「[^」]*」/g, "…");

const ALL_NPC_LINES = MOUNTAIN_GATES.flatMap((gate) => [
  stripQuoted(gate.npcLine),
  ...gate.misreadBranches.map((branch) => stripQuoted(branch.npcReply))
]);

describe("山径关卡脚本 · 红线校验", () => {
  it("每关 canDo 文案齐备且不含术语（PRD-learning-goal-visibility FR-3）", () => {
    for (const gate of MOUNTAIN_GATES) {
      expect(gate.canDo, `canDo 缺失: ${gate.id}`).toBeTruthy();
      expect(gate.canDo.length, `canDo 过长: ${gate.id}`).toBeLessThanOrEqual(30);
      expect(gate.canDo.startsWith("补全")).toBe(false);
      expect(gate.canDo).not.toMatch(/S[0-5]\b|topicId/);
    }
  });

  it("全量 8 关，且每关都要求玩家自己写英文（红线 1）", () => {
    expect(MOUNTAIN_GATES).toHaveLength(8);
    for (const gate of MOUNTAIN_GATES) {
      expect(["say", "complete", "respond"]).toContain(gate.mode);
    }
  });

  it("NPC 台词（引文外）不含 wrong/incorrect/错误 字样（红线 2、3）", () => {
    for (const line of ALL_NPC_LINES) {
      for (const pattern of FORBIDDEN_PATTERNS) {
        expect(line, `台词命中禁用词 ${pattern}: ${line}`).not.toMatch(pattern);
      }
    }
  });

  it("NPC 台词启发式语法检查：英文行以大写字母开头、以句读结尾", () => {
    for (const line of ALL_NPC_LINES) {
      expect(/^[A-Z"'“…]/.test(line), `台词未以大写开头: ${line}`).toBe(true);
      expect(/[.!?…"”]$/.test(line.trim()), `台词未以句读结尾: ${line}`).toBe(true);
    }
  });

  it("每关三档提示齐全，hint3 给出完整答案", () => {
    for (const gate of MOUNTAIN_GATES) {
      expect(gate.hints).toHaveLength(3);
      expect(gate.hints[2]).toBe(gate.sampleAnswer);
    }
  });

  it("每关引用的符文已定义，且误读支线有 lampHint", () => {
    for (const gate of MOUNTAIN_GATES) {
      expect(getRuneById(gate.runeId), `符文未定义: ${gate.runeId}`).toBeDefined();
      for (const branch of gate.misreadBranches) {
        expect(branch.lampHint.length).toBeGreaterThan(0);
        expect(branch.npcReplyZh.length).toBeGreaterThan(0);
      }
    }
  });

  it("骨架拆解与反面例句齐备（settle 因果链依赖）", () => {
    for (const gate of MOUNTAIN_GATES) {
      expect(gate.skeleton.subject.length).toBeGreaterThan(0);
      expect(gate.skeleton.verb.length).toBeGreaterThan(0);
      expect(gate.skeleton.subjectLabel.length).toBeGreaterThan(0);
      expect(gate.skeleton.verbLabel.length).toBeGreaterThan(0);
      expect(gate.counterExample.length).toBeGreaterThan(0);
      expect(gate.counterNote.length).toBeGreaterThan(0);
      expect(gate.counterExample).not.toBe(gate.sampleAnswer);
    }
  });

  it("剧情 setup 不含禁用词（红线 3 覆盖剧情文本）", () => {
    for (const story of MOUNTAIN_STORIES) {
      for (const pattern of FORBIDDEN_PATTERNS) {
        expect(story.setup, `setup 命中禁用词 ${pattern}: ${story.setup}`).not.toMatch(pattern);
      }
    }
  });

  it("剧情 setup 高亮标记合法：成对出现、不嵌套，且每关 ≥2 处", () => {
    for (const story of MOUNTAIN_STORIES) {
      const markers = story.setup.match(/\*\*/g) ?? [];
      expect(markers.length % 2, `setup 的 ** 标记未成对: ${story.setup}`).toBe(0);
      const stripped = story.setup.replace(/\*\*[^*]+\*\*/g, "");
      expect(stripped, `setup 高亮标记嵌套或错位: ${story.setup}`).not.toContain("**");
      const highlights = story.setup.match(/\*\*[^*]+\*\*/g) ?? [];
      expect(highlights.length, `setup 高亮不足 2 处: ${story.setup}`).toBeGreaterThanOrEqual(2);
    }
  });

  it("MOUNTAIN_STORIES 与 MOUNTAIN_GATES 一一对应", () => {
    expect(MOUNTAIN_STORIES).toHaveLength(MOUNTAIN_GATES.length);
  });

  it("误读支线的引文复读保留（机制资产）", () => {
    for (const gate of MOUNTAIN_GATES) {
      for (const branch of gate.misreadBranches) {
        expect(branch.npcReply, `误读支线缺「」引文: ${gate.id}`).toMatch(/「[^」]+」/);
      }
    }
  });
});
