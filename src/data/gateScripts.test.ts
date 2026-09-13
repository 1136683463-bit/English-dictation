import { describe, expect, it } from "vitest";
import { GATE_STORIES, STATION_GATES } from "./gateScripts";
import { getRuneById } from "./runes";

/**
 * 红线校验（GRAMMAR_ADVENTURE_PLAN §12）——CI 级的脚本审查：
 * 1. 每关至少一次玩家自己写英文（mode 为 say/complete/respond，无纯选项关）；
 * 2. NPC 台词（含误读支线）语法正确——用启发式规则兜底（首字母大写、无中式拼写、无语病标记）；
 * 3. 反馈不出现 "wrong / incorrect / 错误 / 不对" 字样；
 * 4. 每关引用的符文已定义。
 */

const FORBIDDEN_PATTERNS = [/\bwrong\b/i, /\bincorrect\b/i, /\bmistake\b/i, /错误/, /不对/, /答错/];

const ALL_NPC_LINES = STATION_GATES.flatMap((gate) => [
  gate.npcLine,
  ...gate.misreadBranches.map((branch) => branch.npcReply)
]);

describe("站台世界关卡脚本 · 红线校验", () => {
  it("共 8 关，且每关都要求玩家自己写英文（红线 1）", () => {
    expect(STATION_GATES).toHaveLength(8);
    for (const gate of STATION_GATES) {
      expect(["say", "complete", "respond"]).toContain(gate.mode);
    }
  });

  it("NPC 台词（含误读支线）不含 wrong/incorrect/错误 字样（红线 2、3）", () => {
    for (const line of ALL_NPC_LINES) {
      for (const pattern of FORBIDDEN_PATTERNS) {
        expect(line, `台词命中禁用词 ${pattern}: ${line}`).not.toMatch(pattern);
      }
    }
  });

  it("NPC 台词启发式语法检查：英文行以大写字母开头、以句读结尾", () => {
    for (const line of ALL_NPC_LINES) {
      expect(/^[A-Z"'“]/.test(line), `台词未以大写开头: ${line}`).toBe(true);
      expect(/[.!?…"”]$/.test(line.trim()), `台词未以句读结尾: ${line}`).toBe(true);
    }
  });

  it("每关三档提示齐全，hint3 给出完整答案", () => {
    for (const gate of STATION_GATES) {
      expect(gate.hints).toHaveLength(3);
      expect(gate.hints[2]).toBe(gate.sampleAnswer);
    }
  });

  it("每关引用的符文已定义，且误读支线有 lampHint", () => {
    for (const gate of STATION_GATES) {
      expect(getRuneById(gate.runeId), `符文未定义: ${gate.runeId}`).toBeDefined();
      for (const branch of gate.misreadBranches) {
        expect(branch.lampHint.length).toBeGreaterThan(0);
        expect(branch.npcReplyZh.length).toBeGreaterThan(0);
      }
    }
  });

  it("示例 A/B/C 原样落地（§3）：时态 / 缺 be / 冠词", () => {
    const [gateA, gateB, , , gateC] = STATION_GATES;
    expect(gateA.misreadBranches[0].errorTag).toBe("tense");
    expect(gateA.misreadBranches[0].npcReply).toContain("last train already left");
    expect(gateB.misreadBranches[0].errorTag).toBe("missing_be");
    expect(gateC.misreadBranches[0].errorTag).toBe("article");
    expect(gateC.misreadBranches[0].npcReply).toContain("an apple");
  });

  it("剧情 setup 不含 wrong/incorrect/错误 字样（红线 3 覆盖剧情文本）", () => {
    for (const story of GATE_STORIES) {
      for (const pattern of FORBIDDEN_PATTERNS) {
        expect(story.setup, `setup 命中禁用词 ${pattern}: ${story.setup}`).not.toMatch(pattern);
      }
    }
  });

  it("剧情 setup 高亮标记合法：成对出现、不嵌套", () => {
    for (const story of GATE_STORIES) {
      const markers = story.setup.match(/\*\*/g) ?? [];
      expect(markers.length % 2, `setup 的 ** 标记未成对: ${story.setup}`).toBe(0);
      // 去掉所有合法的 **…** 段后不应再剩 **（防嵌套/防错位）
      const stripped = story.setup.replace(/\*\*[^*]+\*\*/g, "");
      expect(stripped, `setup 高亮标记嵌套或错位: ${story.setup}`).not.toContain("**");
    }
  });

  it("GATE_STORIES 与 STATION_GATES 一一对应", () => {
    expect(GATE_STORIES).toHaveLength(STATION_GATES.length);
  });

  it("每关剧情 setup 至少 2 处目标句型高亮（PRD FR-1：教学点复现 ≥2 次）", () => {
    for (const story of GATE_STORIES) {
      const highlights = story.setup.match(/\*\*[^*]+\*\*/g) ?? [];
      expect(highlights.length, `setup 高亮不足 2 处: ${story.setup}`).toBeGreaterThanOrEqual(2);
    }
  });
});
