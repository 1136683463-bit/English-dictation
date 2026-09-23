// @vitest-environment jsdom
/**
 * PF5 · 写入侧不得依赖迁移的副作用（2026-09-22）
 *
 * 性能轮暴露的一处隐式耦合：`markLessonDone` 只写 `grammarLessonsDone`，
 * 靠 `migrateData` 末尾的「旧数据回填」把 `grammarLessonStagesDone` 补上——
 * 那条回填本意是给旧数据用的，实际上同时承担了新数据的写入职责。
 *
 * 一旦 `saveData` 对已归一化数据跳过迁移（本轮性能修复，省掉 90% 的保存耗时），
 * 隐式依赖就断了：关 1 完成后再读，新字段仍是空的，次日回访入口不出现。
 *
 * 这个测试把「写入侧自给自足」固定下来：走过保存/读取往返回路之后，
 * 两个字段必须都在，且不依赖任何迁移侧的回填。
 */
import { beforeEach, describe, expect, it } from "vitest";
import { resetStorage } from "../harness";
import { markLessonDone } from "../../services/lessonService";
import { loadData, migrateData, saveData } from "../../services/storage";
import { makeAppData } from "./fixtures";

describe("PF5 写入侧自给自足", () => {
  beforeEach(() => resetStorage());

  it("markLessonDone 自己就把两个字段都写了（不靠迁移补）", () => {
    const lessonId = "lesson-01-am";
    const after = markLessonDone(makeAppData(), lessonId);
    expect(after.grammarLessonsDone, "关 1 完成列表").toContain(lessonId);
    expect(after.grammarLessonStagesDone?.[lessonId], "关卡粒度也必须同步写入").toEqual([1]);
  });

  it("走「保存 → 读回」的完整回路后仍在（跳过迁移的路径也成立）", () => {
    const lessonId = "lesson-02-is";
    const normalized = migrateData(JSON.stringify(makeAppData()));
    const done = markLessonDone(normalized, lessonId);
    // 这份数据已是归一化态 → saveData 会跳过迁移（性能路径）
    saveData(done);
    const reloaded = loadData();
    expect(
      reloaded.grammarLessonStagesDone?.[lessonId],
      "跳过迁移的保存路径下，新字段也必须落盘"
    ).toEqual([1]);
  });

  it("幂等：重复标记同一课不重复写入、不覆盖其它关卡", () => {
    const lessonId = "lesson-03-have";
    const first = markLessonDone(makeAppData(), lessonId);
    const withStage2 = { ...first, grammarLessonStagesDone: { ...first.grammarLessonStagesDone, [lessonId]: [1, 2] } };
    const again = markLessonDone(withStage2, lessonId);
    expect(again.grammarLessonsDone.filter((id) => id === lessonId).length, "列表不重复").toBe(1);
    expect(again.grammarLessonStagesDone?.[lessonId], "已有 [1,2] 时不应被覆盖成 [1]").toEqual([1, 2]);
  });
});
