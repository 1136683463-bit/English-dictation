import { describe, expect, it } from "vitest";
import { grammarLessons } from "./grammarLessons";
import { huntCases } from "./huntCases";

/**
 * 自创比喻词守门（2026-09-23 首轮 + 2026-09-24 术语标准化轮）。
 *
 * 背景：用户反馈「名字版没人看得懂」，由此发起全库审计，发现 16 个自创比喻词，
 * 其中 9 个对零基础用户构成理解障碍（用户无法从字面推断含义）。
 *
 * 分级处理：
 * - A 级（已替换）：换鞋 / 站位 / 班岗 / 光板 / 工牌 / 通道 —— 抽象难懂，改为准确说法
 * - B 级（已替换）：门卫 / 工装 / 通行证 —— 改为「这类动词」「-ing 形式」
 * - C 级（保留）：小垫板 / 外套 / 小尾巴 / 报数 / 排位 / 两张脸 —— 字面可推断，且有上下文
 *
 * 本测试锁住已清理的部分，防止内容批次回流。
 */
describe("自创比喻词守门（已清理项不得回流）", () => {
  const BANNED = [
    "名字版", "名字牌", "换鞋", "站位", "班岗", "光板", "工牌", "通道", "门卫", "工装", "通行证",
    // 2026-09-24 第二轮（术语标准化）：自造标签族与形式比喻族，一律不得回流
    "昨天版", "做过版", "它版", "长版", "短版", "感到版", "让人版", "疑问版", "否定版", "肯定版",
    "平常的版", "客气版", "轻口气版", "东西版", "回忆版", "小垫板", "小尾巴", "外套", "垫板",
    "换零件", "报数词", "排位词", "两张脸", "句子变身", "幕后句", "一伙人", "一伙的", "原样",
  ];

  /** 注意：剧情里的真人「门卫大叔」不算比喻，单独排除。 */
  const collectUserFacingText = (): Array<{ where: string; text: string }> => {
    const out: Array<{ where: string; text: string }> = [];
    for (const lesson of grammarLessons) {
      const push = (where: string, text: string | undefined) => {
        if (text) out.push({ where: `${lesson.id} ${where}`, text });
      };
      for (const paragraph of lesson.deepDive?.paragraphs ?? []) push("deepDive", paragraph);
      push("deepDive.title", lesson.deepDive?.title);
      for (const contrast of lesson.contrast ?? []) push("contrast", contrast.whyZh);
      for (const step of lesson.guided ?? []) push("guided", step.explain);
      for (const point of lesson.summary?.points ?? []) push("points", point);
      for (const variant of lesson.variants ?? []) push("variants", variant.noteZh);
      push("oneLineRule", lesson.oneLineRule);
      push("summary.rule", lesson.summary?.rule);
      push("grammarLabel", lesson.grammarLabel);
    }
    for (const huntCase of huntCases) {
      // 剧情字段（title/scene）里的「门卫大叔」是真人，排除；只查错误讲解
      for (const error of huntCase.errors ?? []) {
        out.push({ where: `${huntCase.id} huntCase`, text: error.explanation });
      }
    }
    return out;
  };

  it("课程与案件讲解中不得出现已清理的自创比喻词", () => {
    const offenders: string[] = [];
    for (const { where, text } of collectUserFacingText()) {
      for (const term of BANNED) {
        if (text.includes(term)) offenders.push(`${where}: 「${term}」 → ${text.slice(0, 48)}`);
      }
    }
    expect(offenders.slice(0, 10), `比喻词回流：\n${offenders.join("\n")}`).toEqual([]);
  });

  it("「光说动词」这类替换后的说法本身要通顺（不得出现病句残留）", () => {
    const offenders: string[] = [];
    for (const { where, text } of collectUserFacingText()) {
      // 机械替换常见的病句形态
      if (/名词形式不装|不装光板|当名字用/.test(text)) offenders.push(`${where}: ${text.slice(0, 48)}`);
    }
    expect(offenders).toEqual([]);
  });
});
