import { describe, expect, it } from "vitest";
import {
  applyMistakeBookGraduation,
  getMistakeBookUnit,
  isMistakeGraduated,
  MISTAKE_BOOK_UNIT_TITLE,
  syncMistakeBookUnit
} from "./dynamicBookService";
import { makeCard, makeReview, makeTestData, makeUnit } from "./testUtils";

const dayMs = 24 * 60 * 60 * 1000;
const NOW = new Date("2026-09-13T09:00:00");
const iso = (offsetDays: number) => new Date(NOW.getTime() + offsetDays * dayMs).toISOString();

const wrongReview = (cardId: string, offsetDays: number, id = `rw_${cardId}_${offsetDays}`) =>
  makeReview({ id, cardId, mode: "spelling", rating: 1, reviewedAt: iso(offsetDays) });
const correctReview = (cardId: string, offsetDays: number, id = `rc_${cardId}_${offsetDays}`) =>
  makeReview({ id, cardId, mode: "spelling", rating: 4, reviewedAt: iso(offsetDays) });

describe("dynamicBookService（PRD-wordbook-v2 P1-1 动态错词书）", () => {
  it("首次同步：创建实体 Unit（dynamicKind=mistakes）并收编当前错词", () => {
    const data = makeTestData({
      cards: [
        makeCard({ id: "c_wrong", status: "learning", front: "wrong" }),
        makeCard({ id: "c_clean", status: "review", front: "clean" })
      ],
      reviews: [
        wrongReview("c_wrong", -1),
        correctReview("c_clean", -1)
      ]
    });

    const result = syncMistakeBookUnit(data);
    expect(result.created).toBe(true);
    expect(result.added).toBe(1);
    const unit = getMistakeBookUnit(result.data);
    expect(unit?.title).toBe(MISTAKE_BOOK_UNIT_TITLE);
    expect(unit?.dynamicKind).toBe("mistakes");
    expect(result.data.cards.find((card) => card.id === "c_wrong")?.unitId).toBe(unit?.id);
    expect(result.data.cards.find((card) => card.id === "c_clean")?.unitId).toBeUndefined();
  });

  it("同步幂等：无新错词、无毕业词时原样返回", () => {
    const unit = makeUnit({ id: "u_dyn", dynamicKind: "mistakes" });
    const data = makeTestData({
      units: [unit],
      cards: [makeCard({ id: "c1", unitId: "u_dyn", status: "learning", front: "w" })],
      reviews: [wrongReview("c1", -1)]
    });

    const result = syncMistakeBookUnit(data);
    expect(result.created).toBe(false);
    expect(result.added).toBe(0);
    expect(result.graduated).toBe(0);
    expect(result.data).toBe(data);
  });

  it("毕业门槛：最近一次错误后 2 个不同自然日答对 → 毕业；同日连对 2 次 → 不毕业", () => {
    const twoDays = makeTestData({
      reviews: [wrongReview("c1", -5), correctReview("c1", -2), correctReview("c1", -1)]
    });
    expect(isMistakeGraduated(twoDays, "c1")).toBe(true);

    const sameDay = makeTestData({
      reviews: [
        wrongReview("c1", -1),
        correctReview("c1", -1, "rc_1"),
        correctReview("c1", -1, "rc_2")
      ]
    });
    expect(isMistakeGraduated(sameDay, "c1")).toBe(false);

    // 无错误史 → 不涉及毕业
    const noWrong = makeTestData({ reviews: [correctReview("c1", -2), correctReview("c1", -1)] });
    expect(isMistakeGraduated(noWrong, "c1")).toBe(false);
  });

  it("同步时毕业：成员达门槛 → 移出词书 + mistakeGraduatedAt 标记", () => {
    const unit = makeUnit({ id: "u_dyn", dynamicKind: "mistakes" });
    const data = makeTestData({
      units: [unit],
      cards: [makeCard({ id: "c1", unitId: "u_dyn", status: "learning", front: "w" })],
      reviews: [wrongReview("c1", -5), correctReview("c1", -2), correctReview("c1", -1)]
    });

    const result = syncMistakeBookUnit(data);
    expect(result.graduated).toBe(1);
    const card = result.data.cards.find((item) => item.id === "c1");
    expect(card?.unitId).toBeUndefined();
    expect(card?.mistakeGraduatedAt).toBeTruthy();
  });

  it("applyMistakeBookGraduation：动态书成员判题后即时毕业；普通词书成员不受影响", () => {
    const dynUnit = makeUnit({ id: "u_dyn", dynamicKind: "mistakes" });
    const normalUnit = makeUnit({ id: "u_norm", title: "普通书" });
    const reviews = [wrongReview("c_dyn", -5), correctReview("c_dyn", -2), correctReview("c_dyn", -1)];
    const data = makeTestData({
      units: [dynUnit, normalUnit],
      cards: [
        makeCard({ id: "c_dyn", unitId: "u_dyn", status: "learning", front: "a" }),
        makeCard({ id: "c_norm", unitId: "u_norm", status: "learning", front: "b" })
      ],
      reviews: [
        ...reviews,
        wrongReview("c_norm", -5),
        correctReview("c_norm", -2),
        correctReview("c_norm", -1)
      ]
    });

    const graduated = applyMistakeBookGraduation(data, "c_dyn");
    expect(graduated.graduated).toBe(true);
    expect(graduated.data.cards.find((card) => card.id === "c_dyn")?.unitId).toBeUndefined();
    expect(graduated.data.cards.find((card) => card.id === "c_dyn")?.mistakeGraduatedAt).toBeTruthy();

    const untouched = applyMistakeBookGraduation(data, "c_norm");
    expect(untouched.graduated).toBe(false);
    expect(untouched.data.cards.find((card) => card.id === "c_norm")?.unitId).toBe("u_norm");
  });

  it("毕业后再错：判定自动失效，下次同步重新入书", () => {
    const unit = makeUnit({ id: "u_dyn", dynamicKind: "mistakes" });
    // 曾毕业（mistakeGraduatedAt 为 -1 天），今天再次拼错
    const data = makeTestData({
      units: [unit],
      cards: [makeCard({ id: "c1", status: "learning", front: "w", mistakeGraduatedAt: iso(-1) })],
      reviews: [wrongReview("c1", -5), correctReview("c1", -3), correctReview("c1", -2), wrongReview("c1", 0, "rw_new")]
    });
    expect(isMistakeGraduated(data, "c1")).toBe(false);

    const result = syncMistakeBookUnit(data);
    expect(result.added).toBe(1);
    expect(result.data.cards.find((card) => card.id === "c1")?.unitId).toBe("u_dyn");
  });
});
