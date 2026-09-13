import { describe, expect, it } from "vitest";
import { judgeGateAnswer } from "./languageGateService";
import { STATION_GATES } from "../data/gateScripts";

const gateA = STATION_GATES[0]; // 时态（示例 A）
const gateB = STATION_GATES[1]; // 缺 be（示例 B）
const gateC = STATION_GATES[4]; // 冠词（示例 C）
const gate6 = STATION_GATES[5]; // 三单

describe("languageGateService · 三档判定", () => {
  it("pass：完全一致（含标点/大小写容错）", () => {
    expect(judgeGateAnswer(gateB, "I am ready.").verdict).toBe("pass");
    expect(judgeGateAnswer(gateB, "i am ready").verdict).toBe("pass");
    expect(judgeGateAnswer(gateB, "I am ready!").verdict).toBe("pass");
  });

  it("pass：命中 acceptRegex 的同义表达", () => {
    expect(judgeGateAnswer(gateB, "I'm ready.").verdict).toBe("pass");
    expect(judgeGateAnswer(gateC, "I would like an apple.").verdict).toBe("pass");
  });

  it("misread：时态未变形（示例 A 的核心场景）", () => {
    const judgement = judgeGateAnswer(gateA, "I come from Beijing. I arrive last night.");
    expect(judgement.verdict).toBe("misread");
    expect(judgement.errorTags).toContain("tense");
    expect(judgement.branch?.npcReply).toContain("last train already left");
  });

  it("misread：缺 be 动词（示例 B）", () => {
    const judgement = judgeGateAnswer(gateB, "I ready.");
    expect(judgement.verdict).toBe("misread");
    expect(judgement.errorTags).toContain("missing_be");
    expect(judgement.branch?.npcReply).toContain("You are… what?");
  });

  it("misread：a/an 冠词（示例 C）", () => {
    const judgement = judgeGateAnswer(gateC, "I want a apple.");
    expect(judgement.verdict).toBe("misread");
    expect(judgement.errorTags).toContain("article");
    expect(judgement.branch?.npcReply).toContain("an apple");
  });

  it("misread：三单 -s（第 6 关）", () => {
    const judgement = judgeGateAnswer(gate6, "She go to the city every day.");
    expect(judgement.verdict).toBe("misread");
    expect(judgement.errorTags).toContain("sv_agreement");
  });

  it("near：拼写小错但能猜懂", () => {
    const judgement = judgeGateAnswer(gateB, "I am reday.");
    expect(judgement.verdict).toBe("near");
    expect(judgement.errorTags).toHaveLength(0);
  });

  it("空输入按 near 处理（不触发误读）", () => {
    expect(judgeGateAnswer(gateA, "   ").verdict).toBe("near");
  });

  it("修正后能通过：示例 A 完整闭环", () => {
    const first = judgeGateAnswer(gateA, "I come from Beijing. I arrive last night.");
    expect(first.verdict).toBe("misread");
    const second = judgeGateAnswer(gateA, "I came from Beijing. I arrived last night.");
    expect(second.verdict).toBe("pass");
  });

  // ── v1.x acceptRegex 补全（第 3/4/6 关）：合理变体放行、教学点错误仍拦截 ──

  it("第 3 关：合理变体 pass（will wait / am waiting），缺骨架仍拦截", () => {
    const gate3 = STATION_GATES[2];
    expect(judgeGateAnswer(gate3, "I wait.").verdict).toBe("pass");
    expect(judgeGateAnswer(gate3, "I will wait.").verdict).toBe("pass");
    expect(judgeGateAnswer(gate3, "I am waiting.").verdict).toBe("pass");
    expect(judgeGateAnswer(gate3, "I waiting.").verdict).not.toBe("pass");
  });

  it("第 4 关：合理变体 pass（There's a light），片段回答仍拦截", () => {
    const gate4 = STATION_GATES[3];
    expect(judgeGateAnswer(gate4, "There is a lamp on the bench.").verdict).toBe("pass");
    expect(judgeGateAnswer(gate4, "There's a light on the bench.").verdict).toBe("pass");
    expect(judgeGateAnswer(gate4, "Yes, there is a little lamp on the bench.").verdict).toBe("pass");
    expect(judgeGateAnswer(gate4, "A lamp on the bench.").verdict).not.toBe("pass");
  });

  it("第 6 关：daily/each day 变体 pass，三单缺失仍 misread", () => {
    expect(judgeGateAnswer(gate6, "She goes to the city daily.").verdict).toBe("pass");
    expect(judgeGateAnswer(gate6, "She goes to the city each day.").verdict).toBe("pass");
    expect(judgeGateAnswer(gate6, "She go to the city daily.").verdict).toBe("misread");
  });

  // ── 回声城批 1：sv_agreement 反向检测（玩家多加了 s）──

  it("反向三单：I lives 判 misread（多加 s 方向）", () => {
    expect(judgeGateAnswer(
      { ...gateB, sampleAnswer: "I live near the tower." },
      "I lives near the tower."
    ).verdict).toBe("misread");
  });

  // ── 回声城批 3：verb_form 探测（will 后非原形 / 完成时非分词）──

  it("verb_form：will 后接过去式或 -ed（will came / will returned）判 misread", () => {
    const g8 = { ...gateB, sampleAnswer: "I will come back." } as typeof gateB;
    expect(judgeGateAnswer(g8, "I will came back.").verdict).toBe("misread");
    expect(judgeGateAnswer(
      { ...gateB, sampleAnswer: "The gate will open." } as typeof gateB,
      "The gate will opened."
    ).verdict).toBe("misread");
    // 正确原形不误伤
    expect(judgeGateAnswer(g8, "I will come back.").verdict).toBe("pass");
  });

  it("verb_form：完成时后接原形或过去式（have see / has went）判 misread", () => {
    const g10 = { ...gateB, sampleAnswer: "I have seen a talking city." } as typeof gateB;
    expect(judgeGateAnswer(g10, "I have see a talking city.").verdict).toBe("misread");
    expect(judgeGateAnswer(g10, "I have saw a talking city.").verdict).toBe("misread");
    // 插入副词仍能探测
    expect(judgeGateAnswer(
      { ...gateB, sampleAnswer: "I have never seen a talking city." } as typeof gateB,
      "I have never saw a talking city."
    ).verdict).toBe("misread");
    // 正确过去分词不误伤
    expect(judgeGateAnswer(g10, "I have seen a talking city.").verdict).toBe("pass");
  });

  // ── 集市批 1：plural 探测（数量词后单数 / 复数主语配 is）──

  it("plural：two apple 判 misread（数量词后名词未变复数）", () => {
    const m1 = { ...gateB, sampleAnswer: "I want two apples." } as typeof gateB;
    expect(judgeGateAnswer(m1, "I want two apple.").verdict).toBe("misread");
    expect(judgeGateAnswer(m1, "I want two apples.").verdict).toBe("pass");
  });

  it("plural：The pears is sweet 判 misread（复数主语配单数 be）", () => {
    const m2 = { ...gateB, sampleAnswer: "The pears are sweet." } as typeof gateB;
    expect(judgeGateAnswer(m2, "The pears is sweet.").verdict).toBe("misread");
    expect(judgeGateAnswer(m2, "The pears are sweet.").verdict).toBe("pass");
  });

  it("plural 不误伤单数场景：I want an apple / The pear is sweet", () => {
    const m3 = { ...gateB, sampleAnswer: "I want an apple." } as typeof gateB;
    expect(judgeGateAnswer(m3, "I want an apple.").verdict).toBe("pass");
  });

  // ── 集市批 2：word_order 探测（指示代词数错配 / 介词后主格）──

  it("word_order：This apples 判 misread（this 配复数名词）", () => {
    const m4 = { ...gateB, sampleAnswer: "These apples are fresh." } as typeof gateB;
    expect(judgeGateAnswer(m4, "This apples are fresh.").verdict).toBe("misread");
    expect(judgeGateAnswer(m4, "These apples are fresh.").verdict).toBe("pass");
  });

  it("word_order：for she 判 misread（介词后应用宾格 her）", () => {
    const m5 = { ...gateB, sampleAnswer: "These pears are for her." } as typeof gateB;
    expect(judgeGateAnswer(m5, "These pears are for she.").verdict).toBe("misread");
    expect(judgeGateAnswer(m5, "These pears are for her.").verdict).toBe("pass");
  });

  it("quantifier：How many are these pears 判 misread（问价应用 much）", () => {
    const m6 = { ...gateB, sampleAnswer: "How much are these pears?" } as typeof gateB;
    expect(judgeGateAnswer(m6, "How many are these pears?").verdict).toBe("misread");
    expect(judgeGateAnswer(m6, "How much are these pears?").verdict).toBe("pass");
  });

  it("article 特指：I will take a bag 判 misread（特指应用 the）", () => {
    const m7 = { ...gateB, sampleAnswer: "I will take the bag." } as typeof gateB;
    expect(judgeGateAnswer(m7, "I will take a bag.").verdict).toBe("misread");
    expect(judgeGateAnswer(m7, "I will take the bag.").verdict).toBe("pass");
  });

  // ── 山径批 1：comparison / preposition 探测 ──

  it("comparison：steep than 判 misread（比较级缺 -er）", () => {
    const g2 = { ...gateB, sampleAnswer: "This path is steeper than that one." } as typeof gateB;
    expect(judgeGateAnswer(g2, "This path is steep than that one.").verdict).toBe("misread");
    expect(judgeGateAnswer(g2, "This path is steeper than that one.").verdict).toBe("pass");
  });

  it("preposition：in the path 判 misread（应用 on）", () => {
    const g3 = { ...gateB, sampleAnswer: "I am on the path." } as typeof gateB;
    expect(judgeGateAnswer(g3, "I am in the path.").verdict).toBe("misread");
    expect(judgeGateAnswer(g3, "I am on the path.").verdict).toBe("pass");
  });

  // ── 图书馆批 1：run_on（because so 连用）/ 缺 to ──

  it("run_on：because so 连用判 misread", () => {
    const g1 = { ...gateB, sampleAnswer: "I stayed home because it rained." } as typeof gateB;
    expect(judgeGateAnswer(g1, "I stayed home because so it rained.").verdict).toBe("misread");
    expect(judgeGateAnswer(g1, "I stayed home because it rained.").verdict).toBe("pass");
  });

  it("verb_form：want read 缺 to 判 misread", () => {
    const g3 = { ...gateB, sampleAnswer: "I want to read this book." } as typeof gateB;
    expect(judgeGateAnswer(g3, "I want read this book.").verdict).toBe("misread");
    expect(judgeGateAnswer(g3, "I want to read this book.").verdict).toBe("pass");
  });

  it("run_on：but→and 连词误用判 misread", () => {
    const g2 = { ...gateB, sampleAnswer: "The book was long, but the story was interesting." } as typeof gateB;
    expect(judgeGateAnswer(g2, "The book was long, and the story was interesting.").verdict).toBe("misread");
    expect(judgeGateAnswer(g2, "The book was long, but the story was interesting.").verdict).toBe("pass");
  });

  it("tense 无时间词：I decide to… 判 misread（sample 为 decided）", () => {
    const g4 = { ...gateB, sampleAnswer: "I decided to finish this chapter tonight." } as typeof gateB;
    expect(judgeGateAnswer(g4, "I decide to finish this chapter tonight.").verdict).toBe("misread");
    expect(judgeGateAnswer(g4, "I decided to finish this chapter tonight.").verdict).toBe("pass");
  });
});
