import { describe, expect, it } from "vitest";
import { grammarLessons } from "./grammarLessons";
import { LESSON_GROUPS, findSeasonByLessonNumber } from "./grammarSeasons";
import { ADVENTURE_SCENE_IDS } from "../components/AdventureScene";
import { GRAMMAR_ZERO_TERMS } from "./grammarZeroTerms";

/**
 * 季分组守门测试（2026-09-17 排版优化随附）：
 * 「课程号不落在任何季区间内会被路径页静默过滤（整课不显示、无报错）」
 * 是路线图登记的头号展示层风险——本测试把「区间覆盖」从纪律升级为断言。
 * 新增课程批次（如批七 L50–54）时若忘记追加 season-N，这里会先红。
 */
describe("grammarSeasons 季分组覆盖（静默过滤守门）", () => {
  it("每课号都落在某个季区间内", () => {
    for (const lesson of grammarLessons) {
      const season = findSeasonByLessonNumber(lesson.number);
      expect(
        season,
        `第 ${lesson.number} 课（${lesson.id}）不在任何季区间内——会被路径页静默过滤；请追加 season-N 分组`
      ).toBeDefined();
    }
  });

  it("季区间互不重叠且 min ≤ max", () => {
    const sorted = [...LESSON_GROUPS].sort((a, b) => a.min - b.min);
    for (let i = 0; i < sorted.length; i += 1) {
      const group = sorted[i];
      expect(group.min, `${group.id} 的 min 应 ≤ max`).toBeLessThanOrEqual(group.max);
      if (i > 0) {
        expect(
          group.min,
          `${group.id} 与 ${sorted[i - 1].id} 区间重叠或倒序`
        ).toBeGreaterThan(sorted[i - 1].max);
      }
    }
  });

  it("分组头显示用字段齐全（label/hint 非空）", () => {
    for (const group of LESSON_GROUPS) {
      expect(group.label.trim().length, `${group.id} label 为空`).toBeGreaterThan(0);
      expect(group.hint.trim().length, `${group.id} hint 为空`).toBeGreaterThan(0);
    }
  });

  it("季体量不得过小（用户明确要求「一个章节的课多一些」）", () => {
    /**
     * 背景：用户原话「我希望一个章节的课程多一些，而不是每次一个章节就两三节课」
     * （roadmap-grammar-thirteenth-batch-2026-09-19.md:53）。
     * 该需求曾以「批十三起改 8 课大章」响应，但批十九之后的九批又回到 2-3 课，
     * 到 2026-09-20 时 38 季里有 19 季（50%）只有 2-3 课——需求未被持续满足。
     *
     * 本轮把末段 17 个小季合并为 6 个大季（6-10 课），小季占比 50% → 11%。
     *
     * 判定口径：早段（L1-138）的 3 个 3 课小季是「副题收尾」性质（如 too/either 专题），
     * 与用户抱怨的「每次一个章节就两三节课」不是一回事，故设 3 个的宽容上限；
     * 新增批次若产生第 4 个 ≤3 课的小季就会红。
     */
    const tiny = LESSON_GROUPS.filter((group) => group.max - group.min + 1 <= 3);
    expect(
      tiny.length,
      `≤3 课的小季有 ${tiny.length} 个（上限 3）：${tiny.map((g) => `${g.label}(${g.max - g.min + 1}课)`).join("、")}。\n` +
        `用户明确要求过「一个章节的课多一些」——新增批次请按 6 课以上组织，或与相邻季合并。`
    ).toBeLessThanOrEqual(3);
  });

  it("季名序号连贯（第一季起、逐季递增，不跳号）", () => {
    // 中文数字：一..十、十一..十九、二十、二十一..九十九
    const DIGIT: Record<string, number> = { 一:1, 二:2, 三:3, 四:4, 五:5, 六:6, 七:7, 八:8, 九:9 };
    const cnNum = (text: string): number | null => {
      const m = text.match(/^第(.+?)季$/);
      if (!m) return null;
      const raw = m[1];
      if (raw === "十") return 10;
      const at = raw.indexOf("十");
      if (at === -1) return DIGIT[raw] ?? null;          // 一..九
      const tens = at === 0 ? 1 : DIGIT[raw[0]];          // 十X → 1X；X十 → X0
      const onesRaw = raw.slice(at + 1);
      const ones = onesRaw ? DIGIT[onesRaw] : 0;
      return tens * 10 + ones;
    };
    const numbers = LESSON_GROUPS.map((g) => cnNum(g.label.split(" · ")[0]));
    const bad = numbers.filter((n, i) => n === null || n !== i + 1);
    expect(
      bad.length,
      `季名序号不连贯：${LESSON_GROUPS.map((g, i) => `${g.label.split(" · ")[0]}(期望第${i + 1})`).join("、")}`
    ).toBe(0);
  });

  it("季 label/hint 不得含语法术语（用户可见文案）", () => {
    /**
     * 背景（2026-09-20 浏览器实测发现）：零术语守门只覆盖了课内字段
     * （grammarLabel / oneLineRule / summary.rule / contrast.whyZh / guided.explain / recall.noteZh），
     * **漏了季的 label 与 hint**——而它们在路径页每张季卡上都直接显示给用户。
     *
     * 实测当时 season-3 的 hint 写着「把最顽固的小毛病改掉：三单、存在句、疑问词……」
     * （「三单」是语法书用语，零基础用户没有对应概念）。
     * 本断言把季字段纳入零术语红线。
     */
    const offenders: string[] = [];
    for (const group of LESSON_GROUPS) {
      const labelHits = GRAMMAR_ZERO_TERMS.filter((term) => group.label.includes(term));
      const hintHits = GRAMMAR_ZERO_TERMS.filter((term) => group.hint.includes(term));
      if (labelHits.length) offenders.push(`${group.id} label→${labelHits.join("/")}`);
      if (hintHits.length) offenders.push(`${group.id} hint→${hintHits.join("/")}：${group.hint.slice(0, 40)}`);
    }
    expect(offenders, `季文案含术语：\n${offenders.join("\n")}`).toEqual([]);
  });

  it("最高季区间的 max 覆盖全部课程（新批课不被尾部截断）", () => {
    const maxNumber = Math.max(...grammarLessons.map((lesson) => lesson.number));
    const covered = findSeasonByLessonNumber(maxNumber);
    expect(covered, `最高课号 ${maxNumber} 超出所有季区间——新批课的季分组未上线`).toBeDefined();
  });
});

/**
 * 场景 ID 合法性守门（2026-09-20 批二十九补）。
 *
 * 背景：批二十八实测发现 `scene: "school"` **不是合法的 AdventureSceneId**
 * （合法值只有 AdventureScene.tsx 那 14 个）。`GrammarLesson.scene` 是
 * `string` 而非联合类型，写错不会报类型错；渲染时 `AdventureScene` 会
 * **静默回退到 sparkle 兜底插画**——功能不坏，但那几课的小剧场图一直是错的，
 * 且**没有任何断言会发现**。实测当时全库有 5 课（L86/87/88/89/94）踩了这个坑。
 *
 * 本断言把「场景 ID 必须合法」从纪律升级为守门：新增课程写错 scene 会先红。
 */
describe("课程 scene 必须是合法场景 ID（静默回退守门）", () => {
  it("每课的 scene 都在 ADVENTURE_SCENE_IDS 里", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      if (!(ADVENTURE_SCENE_IDS as readonly string[]).includes(lesson.scene)) {
        offenders.push(`${lesson.id}="${lesson.scene}"`);
      }
    }
    expect(
      offenders,
      `scene 不是合法场景 ID 的课（渲染会静默回退 sparkle 插画）：\n${offenders.join("\n")}`
    ).toEqual([]);
  });
});
