import { describe, expect, it } from "vitest";
import { grammarLessons } from "./grammarLessons";
import { findZeroTermHits, GRAMMAR_ZERO_TERMS } from "./grammarZeroTerms";
import { isThinExplain, resolveGuidedExplain } from "../services/grammarExplainService";
import { guidedDisplayOrder } from "../services/lessonService";

/**
 * R06 内容扩量的数据完整性守卫：
 * - 每课练习 4 题，其中必含一道与 variants 卡一致的否定或疑问变体题；
 * - 每道练习题的 tokens 词集与 answer 一致（点词成句一定有解）。
 */
describe("grammarLessons 数据完整性（R06 变体扩量）", () => {
  it("每课练习 ≥4 题且含否定/疑问变体题", () => {
    for (const lesson of grammarLessons) {
      const variantSentences = (lesson.variants ?? [])
        .filter((variant) => variant.label !== "肯定")
        .map((variant) => variant.en);

      expect(
        lesson.practice.length,
        `${lesson.id} 练习应至少 4 题（R4 训练密度：可增补复现/替换题）`
      ).toBeGreaterThanOrEqual(4);

      const answers = lesson.practice.map((step) => step.answer);
      const variantHits = variantSentences.filter((sentence) => answers.includes(sentence));
      expect(
        variantHits.length,
        `${lesson.id} 练习应至少覆盖一道否定/疑问变体（现有变体：${variantSentences.join(" / ")}）`
      ).toBeGreaterThanOrEqual(1);
    }
  });

  it("所有练习题的 tokens 词集与 answer 一致（干扰项单独存放，不混入 tokens）", () => {
    for (const lesson of grammarLessons) {
      for (const step of lesson.practice) {
        // 去标点后要重新压平空格：像 "rains," 这样的词块去标点后会留下尾部空格，
        // 直接 join 会得到 "rains " 与答案侧的 "rains" 不等（2026-09-20 修）
        const normalizedTokens = step.tokens
          .map((token) => token.replace(/[.,!?]/g, "").trim())
          .filter(Boolean)
          .map((token) => token.toLowerCase())
          .sort()
          .join(" ");
        const answerWords = step.answer
          .replace(/[.,!?]/g, "")
          .split(/\s+/)
          .filter(Boolean)
          .map((word) => word.toLowerCase())
          .sort()
          .join(" ");
        expect(normalizedTokens, `${lesson.id}「${step.answer}」的词块与答案不一致`).toBe(answerWords);
      }
    }
  });

  it("干扰项不得与答案词重复（否则题目出现多解）", () => {
    const clean = (value: string) => value.replace(/[.,!?;:]/g, "").toLowerCase();
    for (const lesson of grammarLessons) {
      for (const step of lesson.practice) {
        const answerWords = new Set(
          step.answer.replace(/[.,!?;:]/g, "").split(/\s+/).filter(Boolean).map(clean)
        );
        for (const distractor of step.distractors ?? []) {
          expect(
            answerWords.has(clean(distractor)),
            `${lesson.id}「${step.answer}」的干扰项「${distractor}」与答案词重复`
          ).toBe(false);
        }
      }
    }
  });

  it("第二季新课（L13–L20）必须配「忆」段 recall（R5）", () => {
    for (const lesson of grammarLessons) {
      if (lesson.number >= 13) {
        expect(lesson.recall, `${lesson.id} 缺少 recall（R5 忆段）`).toBeDefined();
        expect(lesson.recall?.answer.trim()).not.toBe("");
        expect(lesson.recall?.promptZh.trim()).not.toBe("");
        // D8：意图句必须给——缺了它用户不知道要回忆哪一句，必然卡关
        expect(lesson.recall?.intentZh.trim()).not.toBe("");
      }
    }
  });
});

/**
 * 零术语红线守门（2026-09-19 补）。
 *
 * 背景：「零术语面向零基础」是产品红线，但审计发现 16 个内容批次里
 * 74/102 课的首屏必读文案（grammarLabel / oneLineRule）出现了语法术语，
 * 长期无人发现——因为没有断言，纪律靠人记。
 *
 * 本测试只守「用户第一眼必读」的两个字段（课程卡片标签 + 每课首屏一句话规则）；
 * 答错后的解释（explain / whyZh）与深挖卡（deepDive）另有分级计划，
 * 深挖卡作为「想知道为什么」的进阶内容允许保留术语，故不纳入本断言。
 */
describe("零术语红线（首屏必读字段守门）", () => {
  /**
   * 面向零基础用户不该出现的**语法书术语**。
   *
   * 判定口径（与课程既有风格对齐）：下列词是语法书里的分析用语，零基础用户没有对应概念。
   * 不包含「动词 / 名词 / 连词 / be 动词」——课程从第 1 课起就把它们当作自己的教学词
   * 使用（如 "be 动词 · I am"、"like + 名词"），首屏长期如此且自洽；
   * 强行替换会让标签失去可检索性（用户想找"名词复数那课"反而找不到）。
   */
  // 词表抽为共享常量（测试与运行时同表，防漂移）——见 src/data/grammarZeroTerms.ts
  const GRAMMAR_TERMS = GRAMMAR_ZERO_TERMS;

  it("grammarLabel 不得含语法术语（课程卡片首屏）", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      const hits = GRAMMAR_TERMS.filter((term) => lesson.grammarLabel.includes(term));
      if (hits.length > 0) offenders.push(`${lesson.id}「${lesson.grammarLabel}」→ ${hits.join("/")}`);
    }
    expect(offenders, `首屏标签含术语的课：\n${offenders.join("\n")}`).toEqual([]);
  });

  it("oneLineRule 不得含语法术语（每课首屏一句话规则）", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      const hits = GRAMMAR_TERMS.filter((term) => lesson.oneLineRule.includes(term));
      if (hits.length > 0) offenders.push(`${lesson.id}→ ${hits.join("/")}：${lesson.oneLineRule}`);
    }
    expect(offenders, `一句话规则含术语的课：\n${offenders.join("\n")}`).toEqual([]);
  });

  it("summary.rule 不得含语法术语（完课收据首屏）", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      const rule = lesson.summary?.rule ?? "";
      const hits = GRAMMAR_TERMS.filter((term) => rule.includes(term));
      if (hits.length > 0) offenders.push(`${lesson.id}→ ${hits.join("/")}：${rule}`);
    }
    expect(offenders, `完课小结含术语的课：\n${offenders.join("\n")}`).toEqual([]);
  });
});

/**
 * 内容重复度守门（2026-09-19 补）。
 *
 * 背景：审计实测课内句子槽位重叠 57%，其中大部分是**有意设计**：
 * - `recall.answer == targetSentence`（忆段就是"凭记忆重写核心句"，105 课如此）
 * - `contrast.correct` 复用目标句/例句（对比卡要拿本课句子做正误对照）
 * 真正该防的是**无意的冗余增长**：新批次写课时顺手把 examples 抄进 practice、
 * 或对话行直接复用例句，导致"练了但没新信息"。
 *
 * 阈值标定依据（2026-09-19 实测，110 课）：
 * - practice 命中 examples：中位 2/4；当前 worst=4/4（1 课）、4/5（1 课）
 * - dialogue 行复用 examples：29.1%
 * 这里把阈值定在「不劣化于当前水位」，让新内容不能再往上走，同时不误报存量设计。
 */
describe("内容重复度守门", () => {
  const norm = (value: string) => value.toLowerCase().replace(/[.,!?;:'"]/g, "").replace(/\s+/g, " ").trim();

  it("practice 不得整组复用 examples（收口课豁免）", () => {
    /**
     * 收口课（零新知）的练习**本来就是**把整季句型排一行复习——
     * 整组复用例句是设计意图，不是冗余（与全库既有 18 节收口课一致）。
     * 2026-09-20 季合并后新增的 4 节收口课（L182-185）即属此类。
     */
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      if (/收口|零新知/.test(lesson.grammarLabel)) continue;
      const practice = lesson.practice ?? [];
      if (practice.length < 4) continue;
      const exampleSet = new Set((lesson.examples ?? []).map((example) => norm(example.en)));
      const reused = practice.filter((step) => exampleSet.has(norm(step.answer))).length;
      if (reused >= practice.length) offenders.push(`${lesson.id}(${reused}/${practice.length})`);
    }
    expect(offenders, `练习整组复用例句的课：${offenders.join(", ")}`).toEqual([]);
  });

  it("练习答案不得跨课高频复现（同一句最多出现在 6 课，当前最差为 6）", () => {
    const byAnswer = new Map<string, string[]>();
    for (const lesson of grammarLessons) {
      for (const step of lesson.practice ?? []) {
        const key = norm(step.answer);
        if (!key) continue;
        const bucket = byAnswer.get(key) ?? [];
        bucket.push(lesson.id);
        byAnswer.set(key, bucket);
      }
    }
    const offenders = [...byAnswer.entries()]
      .filter(([, lessons]) => lessons.length > 6)
      .map(([sentence, lessons]) => `"${sentence.slice(0, 40)}"×${lessons.length}`);
    expect(offenders, `跨课复现过多的练习句：${offenders.join(", ")}`).toEqual([]);
  });

  it("对话行不得整段复用例句（对话要提供新句子）", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      const dialogue = lesson.dialogue ?? [];
      if (dialogue.length < 3) continue;
      const exampleSet = new Set((lesson.examples ?? []).map((example) => norm(example.en)));
      const reused = dialogue.filter((line) => exampleSet.has(norm(line.en))).length;
      // 允许 1 行复用（对话常以本课目标句收尾），但不允许全部复用
      if (reused >= dialogue.length) offenders.push(`${lesson.id}(${reused}/${dialogue.length})`);
    }
    expect(offenders, `对话整段复用例句的课：${offenders.join(", ")}`).toEqual([]);
  });
});

/**
 * 零术语红线 · 全字段必读文案（2026-09-20 浏览器实测后补）。
 *
 * 背景：原守门只覆盖 6 个字段（grammarLabel / oneLineRule / summary.rule /
 * contrast.whyZh / guided.explain / recall.noteZh）。用浏览器实际打开路径页与
 * 课程页逐屏走查后发现**用户可见的必读文案远不止这 6 个**——
 * guided.promptZh、blocks.role、summary.points、variants.label、practice.promptZh、
 * sceneSwings.sceneZh、title、intentZh、sceneSetupZh 都是首屏必读，
 * 却全部漏在守门外。实测当时有 46 处术语泄漏，最高频的是 guided 提示里的
 * 「把主语 X 换成 Y」（25 处，零基础用户不知道「主语」是什么）。
 *
 * deepDive 不在本断言范围——它是「想知道为什么」的进阶内容，
 * 原设计明确说明「术语是有意保留的」（见下方 AI 引用源字段的说明）。
 */
/**
 * 题干措辞守门（2026-09-20 浏览器走查后补）。
 *
 * 背景：用浏览器逐题走查练习段时发现，批量新增题目时写出的题干是
 * 「说 X，你想说：X」——**前半句与后半句重复**，既啰嗦又没给情境。
 *   例：「说这两个都很好，你想说：两个都很好。」
 * 而全库原有题干都带场景：「食堂阿姨问你饿不饿，你想说：我很饿。」
 *
 * 实测当时有 30 条这种重复措辞（全部来自批量加题），已逐条改成带场景的写法。
 * 本断言防止再退化。
 */
/**
 * 讲解素材守门（2026-09-20 内容核查后补）。
 *
 * 背景：项目有一条既有的讲解解析链（grammarExplainService）——
 * 当某道跟段题的 explain 太薄（<20 字或只是复述答案）时，
 * resolver 会从本课的 contrast.whyZh / variants.noteZh / deepDive 里借一段更有内容的讲解。
 *
 * 但这套机制有个盲区：**如果本课根本没有可借的素材，薄讲解就永远是薄的**。
 * 历史记录（2026-09-19）说这类有「71 条」，但当时的口径与实现不一致；
 * 本轮用服务层自己的判定函数（isThinExplain）实测为 **27 条**，
 * 已逐条补写为「讲为什么」的讲解，现在为 0。
 *
 * 本断言防止这个数字回潮——它衡量的是「用户答完后能不能看到为什么」。
 */
describe("讲解素材守门（薄且无素材可借 = 0）", () => {
  it("不得有「讲解太薄且本课无素材可借」的跟段题", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      for (const step of lesson.guided ?? []) {
        if (step.kind === "choose" || step.kind === "replace") continue; // 这两类的锚点规则不同
        if (!isThinExplain(step.explain ?? "", step.answer ?? "")) continue;
        const resolved = resolveGuidedExplain(step, lesson);
        const upgraded =
          resolved && resolved.trim() !== (step.explain ?? "").trim() && !isThinExplain(resolved, step.answer ?? "");
        if (!upgraded) {
          offenders.push(
            `${lesson.id} [${step.kind}] 答案「${step.answer}」的讲解是「${(step.explain ?? "").slice(0, 30)}」——` +
              `太薄且本课没有素材可借，用户看不到「为什么」`
          );
        }
      }
    }
    expect(offenders.slice(0, 8), `薄且无素材的讲解：\n${offenders.join("\n")}`).toEqual([]);
  });
});

describe("题干措辞守门", () => {
  it("题干的前导语不得与提示句重复（如「说 X，你想说：X」）", () => {
    const offenders: string[] = [];
    const strip = (text: string) =>
      text.replace(/^(说|你想说|你问|问|指着|看着)/, "").replace(/[。，、]/g, "").trim();
    for (const lesson of grammarLessons) {
      for (const step of lesson.practice ?? []) {
        const matched = step.promptZh.match(/^(.*?)[，,]\s*(?:你)?想说[：:](.+)$/);
        if (!matched) continue;
        const lead = strip(matched[1]);
        const tail = strip(matched[2]);
        if (lead && tail && (lead === tail || lead.includes(tail) || tail.includes(lead))) {
          offenders.push(`${lesson.id}「${step.promptZh}」`);
        }
      }
    }
    expect(
      offenders.slice(0, 8),
      `题干重复措辞（前导语与提示句意思重复，应补场景）：\n${offenders.join("\n")}`
    ).toEqual([]);
  });
});

describe("零术语红线 · 全字段必读文案", () => {
  it("所有用户可见的必读字段不得含语法术语", () => {
    const offenders: string[] = [];
    const check = (text: string | undefined, where: string) => {
      if (!text) return;
      const hits = findZeroTermHits(text);
      if (hits.length) offenders.push(`${where}→${hits.join("/")}：${text.slice(0, 44)}`);
    };
    for (const lesson of grammarLessons) {
      check(lesson.title, `${lesson.id} title`);
      check(lesson.grammarLabel, `${lesson.id} grammarLabel`);
      check(lesson.oneLineRule, `${lesson.id} oneLineRule`);
      check(lesson.intentZh, `${lesson.id} intentZh`);
      check(lesson.sceneSetupZh, `${lesson.id} sceneSetupZh`);
      check(lesson.summary?.rule, `${lesson.id} summary.rule`);
      check(lesson.recall?.promptZh, `${lesson.id} recall.promptZh`);
      for (const block of lesson.blocks ?? []) check(block.role, `${lesson.id} blocks.role`);
      for (const swing of lesson.sceneSwings ?? []) check(swing.sceneZh, `${lesson.id} sceneSwings.sceneZh`);
      for (const variant of lesson.variants ?? []) check(variant.label, `${lesson.id} variants.label`);
      for (const step of lesson.practice ?? []) check(step.promptZh, `${lesson.id} practice.promptZh`);
      for (const step of lesson.guided ?? []) check(step.promptZh, `${lesson.id} guided.promptZh`);
      for (const point of lesson.summary?.points ?? []) check(point, `${lesson.id} summary.points`);
    }
    expect(offenders.slice(0, 8), `必读文案含术语：\n${offenders.join("\n")}`).toEqual([]);
  });
});

describe("零术语红线 · deepDive 深挖卡（2026-09-22 清理完成）", () => {
  /**
   * deepDive 此前因「进阶内容」被豁免（注释记「待产品负责人拍板是否豁免」）。
   * 2026-09-22 完成清理：52 条含术语段落（37 课）改为大白话，现转为守门。
   * 顺带修了检测器假阳性：「从句子中间」曾被误判为术语「从句」（见 grammarZeroTerms）。
   */
  it("deepDive 全部段落不得含语法术语", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      (lesson.deepDive?.paragraphs ?? []).forEach((paragraph, index) => {
        const hits = findZeroTermHits(paragraph);
        if (hits.length > 0) {
          offenders.push(`${lesson.id} deepDive[${index}]→${hits.join("/")}：${paragraph.slice(0, 40)}`);
        }
      });
    }
    expect(offenders.slice(0, 8), `deepDive 含术语：\n${offenders.join("\n")}`).toEqual([]);
  });

  it("全库用户可见文本零术语（含 deepDive，统一口径）", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      for (const paragraph of lesson.deepDive?.paragraphs ?? []) {
        if (findZeroTermHits(paragraph).length > 0) offenders.push(`${lesson.id} deepDive`);
      }
      for (const point of lesson.summary?.points ?? []) {
        if (findZeroTermHits(point).length > 0) offenders.push(`${lesson.id} summary.points`);
      }
    }
    expect(offenders, `仍有含术语文本：${offenders.join(", ")}`).toEqual([]);
  });
});

describe("零术语红线 · AI 引用源字段（2026-09-19「问一句」前置 R-AI2）", () => {
  /**
   * 这三个字段是「问一句」AI 讲解的 allowedSources——AI 只许引用与改写它们。
   * 源文本带术语，AI 改写得再干净也等于把术语送到用户眼前。
   * deepDive 术语是有意保留的（进阶内容），不在本断言范围（待产品负责人拍板是否豁免）。
   */
  it("contrast.whyZh / guided.explain / recall.noteZh 不得含语法术语", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      (lesson.contrast ?? []).forEach((contrast, index) => {
        const hits = findZeroTermHits(contrast.whyZh);
        if (hits.length > 0) offenders.push(`${lesson.id} whyZh[${index}]→${hits.join("/")}：${contrast.whyZh.slice(0, 40)}`);
      });
      (lesson.guided ?? []).forEach((step, index) => {
        const hits = findZeroTermHits(step.explain);
        if (hits.length > 0) offenders.push(`${lesson.id} explain[${index}]→${hits.join("/")}：${step.explain.slice(0, 40)}`);
      });
      if (lesson.recall?.noteZh) {
        const hits = findZeroTermHits(lesson.recall!.noteZh!);
        if (hits.length > 0) offenders.push(`${lesson.id} noteZh→${hits.join("/")}：${lesson.recall!.noteZh!.slice(0, 40)}`);
      }
    }
    expect(offenders.slice(0, 8), `AI 引用源含术语：\n${offenders.join("\n")}`).toEqual([]);
  });

  it("改写后不得有生硬拼接模式（双「的」、「好几个是」等批量替换痕迹）", () => {
    const stiff: string[] = [];
    const PATTERNS = [/能数的的/, /好几个是/, /的的/, /时间时间/];
    const check = (text: string, where: string) => {
      if (PATTERNS.some((pattern) => pattern.test(text))) stiff.push(`${where}：${text.slice(0, 40)}`);
    };
    for (const lesson of grammarLessons) {
      (lesson.contrast ?? []).forEach((contrast) => check(contrast.whyZh, `${lesson.id} whyZh`));
      (lesson.guided ?? []).forEach((step) => check(step.explain, `${lesson.id} explain`));
      if (lesson.recall?.noteZh) check(lesson.recall.noteZh, `${lesson.id} noteZh`);
    }
    expect(stiff.slice(0, 6), `批量替换生硬模式：\n${stiff.join("\n")}`).toEqual([]);
  });

  /**
   * variants[].noteZh 守门（2026-09-21 补）。
   *
   * 缺口：原守门覆盖 recall.noteZh，但**漏了 variants[].noteZh**——而后者同样是
   * 用户可见的必读文案，且出现在两处：
   *   ① GrammarLessonPage 直接渲染（变体卡下方 `.lesson-variant-note`）；
   *   ② 练习答对后的「为什么」——practiceWhy 的 ② 级回退就取同句变体的 noteZh。
   * 实测当时全库有 **25 处**术语泄漏（「原形」11、「复数」3、「比较级」2…），
   * 集中在 L10/L11/L17/L18/L19/L24/L25/L26/L27/L30/L32/L39/L54/L68/L73/L76/L89/L93。
   * 已按既有自建术语体系统一改写（原形→穿原样、比较级→「更…」、主语→句首那个「谁」…），
   * 本断言防其回潮。
   */
  it("variants[].noteZh 不得含语法术语（变体卡与练后讲解的用户可见文案）", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      (lesson.variants ?? []).forEach((variant, index) => {
        const text = variant.noteZh ?? "";
        const hits = GRAMMAR_ZERO_TERMS.filter((term) => text.includes(term));
        if (hits.length > 0) {
          offenders.push(`${lesson.id} noteZh[${index}]→${hits.join("/")}：${text.slice(0, 40)}`);
        }
      });
    }
    expect(offenders.slice(0, 8), `变体讲解含术语：\n${offenders.join("\n")}`).toEqual([]);
  });
});

/**
 * 练习「可抄率」守门（2026-09-20 全库审计后新增）。
 *
 * 背景：审计实测 684 道 practice 题中 90.1% 的答案在本课已原样出现过
 * （A 层纯重复目标句 19.0% + B 层课内原句再现 71.1%），真正需要自己组织的只有 9.9%。
 * 「练」段因此只有一种费脑程度——用户在抄写，不是在检索，知识停在「认得出」、
 * 从未进入「取得出」（历史实测：practice 一次通过 20/20，同期无提示输出 0/9）。
 *
 * 本次修复后：A 130（16.4%）/ B 499（63.0%）/ C 163（20.6%），可抄 79.4%。
 * 阈值标定在「不劣化于修复后水位」，让新内容只能往上走。
 *
 * 口径（G1 四层法）：
 *   A = 答案 == 本课目标句
 *   B = 答案在本课展示池（例句/对话/对比卡/变体/场景变奏/忆段/跟段答案）中
 *   C = 新句，且每个词都在本课词表内（含此前累计）—— 用户拼得出来，只是课内没写过
 *   D = 新句，但含本课从未教过的词（缺陷，必须为 0）
 *
 * 关键口径纪律：**本课词表不含 practice 自身的 tokens**。
 * 若把题目自己的词块算作「课内出现过」，D 层会恒为 0（数学上必然），
 * 那等于用题目自己的材料证明题目自己没问题——命题失去意义。
 */
describe("练习可抄率守门（A/B/C/D 四层口径）", () => {
  const norm = (value: string) => value.toLowerCase().replace(/[^a-z0-9' ]/g, "").replace(/\s+/g, " ").trim();
  const words = (value: string) => norm(value).split(" ").filter(Boolean);

  /** 本课「教学材料」词表（不含 practice 自身 tokens）与展示句池。 */
  const buildPools = (lesson: (typeof grammarLessons)[number]) => {
    const vocab = new Set<string>();
    const addWord = (text?: string) => {
      if (text) for (const word of words(text)) vocab.add(word);
    };
    addWord(lesson.targetSentence);
    for (const example of lesson.examples ?? []) addWord(example.en);
    for (const block of lesson.blocks ?? []) addWord(block.text);
    for (const line of lesson.dialogue ?? []) addWord(line.en);
    for (const contrast of lesson.contrast ?? []) {
      addWord(contrast.correct);
      addWord(contrast.wrong);
    }
    for (const variant of lesson.variants ?? []) addWord(variant.en);
    for (const swing of lesson.sceneSwings ?? []) addWord(swing.en);
    for (const step of lesson.guided ?? []) {
      if (step.answer) addWord(step.answer);
      for (const token of step.tokens ?? []) addWord(token);
    }
    if (lesson.recall?.answer) addWord(lesson.recall.answer);
    vocab.delete("");

    const sentences = new Set<string>();
    const addSentence = (text?: string) => {
      if (text) sentences.add(norm(text));
    };
    addSentence(lesson.targetSentence);
    for (const example of lesson.examples ?? []) addSentence(example.en);
    for (const line of lesson.dialogue ?? []) addSentence(line.en);
    addSentence(lesson.dialogueEn);
    for (const contrast of lesson.contrast ?? []) {
      addSentence(contrast.correct);
      addSentence(contrast.wrong);
    }
    for (const variant of lesson.variants ?? []) addSentence(variant.en);
    for (const swing of lesson.sceneSwings ?? []) addSentence(swing.en);
    if (lesson.recall?.answer) addSentence(lesson.recall.answer);
    for (const step of lesson.guided ?? []) if (step.answer) addSentence(step.answer);
    sentences.delete("");

    return { vocab, sentences };
  };

  it("D 层必须为 0：练习答案的每个词都要在本课（含此前累计）教过", () => {
    const sorted = [...grammarLessons].sort((a, b) => a.number - b.number);
    const cumulative = new Set<string>();
    const offenders: string[] = [];

    for (const lesson of sorted) {
      const { vocab } = buildPools(lesson);
      const seen = new Set([...cumulative, ...vocab]);
      for (const step of lesson.practice ?? []) {
        const missing = words(step.answer).filter((word) => !seen.has(word));
        if (missing.length > 0) {
          offenders.push(
            `${lesson.id}「${step.answer}」含未教过的词：${[...new Set(missing)].join("、")}` +
              `（用户既没在课内见过、也无从猜出，必然卡住）`
          );
        }
      }
      for (const word of vocab) cumulative.add(word);
    }

    expect(offenders.slice(0, 10), `练习含本课未教词的课：\n${offenders.join("\n")}`).toEqual([]);
  });

  it("素材未饱和的课，练习须含至少一道 C 层新句", () => {
    /**
     * ⚠️ 素材饱和豁免（2026-09-20 四轮复盘）：看段展示句 ≥18 的课，
     * 该课语法点的自然表达已被占满——强行造新句只会得到病句或脱节提示。
     * 这类课的正解是「减少看段例句」，不是「在练段硬凑」。
     */
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      // 只数「用户做题前刚看过、可直接抄的句子」：目标句 + 例句 + 场景变奏
      // （不含 contrast 的错句、variants 的变体——那些不是「可抄的答案来源」）
      const exhibitCount =
        (lesson.examples ?? []).length +
        (lesson.sceneSwings ?? []).length + 1;
      if (exhibitCount >= 10) continue;
      const { sentences } = buildPools(lesson);
      const practice = lesson.practice ?? [];
      if (practice.length === 0) continue;
      const hasNew = practice.some((step) => !sentences.has(norm(step.answer)));
      if (!hasNew) offenders.push(`${lesson.id}（${practice.length} 题全是课内已出现的句子）`);
    }
    expect(offenders, `整组练习无新句的课：\n${offenders.join("\n")}`).toEqual([]);
  });

  it("全库可抄率不得回潮（A ≤20%、A+B ≤82%，修复后水位 16.4% / 79.4%）", () => {
    let total = 0;
    let layerA = 0;
    let layerAB = 0;
    for (const lesson of grammarLessons) {
      const { sentences } = buildPools(lesson);
      for (const step of lesson.practice ?? []) {
        total += 1;
        const answer = norm(step.answer);
        if (answer === norm(lesson.targetSentence)) layerA += 1;
        if (answer === norm(lesson.targetSentence) || sentences.has(answer)) layerAB += 1;
      }
    }
    const rateA = layerA / total;
    const rateAB = layerAB / total;
    expect(
      rateA,
      `纯重复目标句（A 层）占比 ${(rateA * 100).toFixed(1)}% 超过 20% 上限——` +
        `请把新练习题换成课内没写过、但每个词都学过的句子（C 层）`
    ).toBeLessThanOrEqual(0.2);
    expect(
      rateAB,
      `可抄率（A+B）${(rateAB * 100).toFixed(1)}% 超过 82% 上限——` +
        `练段在退化成抄写，请补充 C 层新句`
    ).toBeLessThanOrEqual(0.82);
  });
});

/**
 * 新句「微调检测」守门（2026-09-20 二轮补）。
 *
 * 背景：可抄率治理首轮补了 108 道 C 层新句，但其中 13 条与课内某句的词集重叠 ≥80%——
 * 只是把陈述句改成疑问句（Is this his hat? → This is his hat.）、
 * 把两个人对调（While I was cooking, she was reading. → While I was reading, she was cooking.）、
 * 或加一个时间词（I feel much better. → I feel much better now.）。
 * 这类句子技术上是「课内没出现过」，但**认知上仍等于抄写**：不需要任何重组。
 *
 * 本断言只守 C 层（练习里那些课内没出现过的句子），要求它们与课内任一句的
 * **词集 Jaccard 重叠 < 0.8**——即必须换掉至少一个核心成分（主语 / 动词 / 场景），
 * 而不只是换疑问号或时间词。
 *
 * 阈值标定依据（2026-09-20 实测，165 条 C 层新句）：
 * - 首轮未治理时：13 条 ≥0.8（最严重的几条 100%）
 * - 治理后：0 条 —— 因此阈值直接设为 0，不允许任何一条回潮
 */
describe("新句微调检测守门（词集 Jaccard < 0.8）", () => {
  const norm = (value: string) => value.toLowerCase().replace(/[^a-z0-9' ]/g, "").replace(/\s+/g, " ").trim();
  const toks = (value: string) => norm(value).split(" ").filter(Boolean);
  const jaccard = (a: string, b: string) => {
    const setA = new Set(toks(a));
    const setB = new Set(toks(b));
    let inter = 0;
    for (const item of setA) if (setB.has(item)) inter += 1;
    return inter / (setA.size + setB.size - inter);
  };

  it("C 层新句与课内句子不得只是换个说法（重叠 ≥80% 的必须为 0）", () => {
    const exhibits = (lesson: (typeof grammarLessons)[number]) => {
      const list: string[] = [];
      const add = (text?: string) => { if (text) list.push(text); };
      add(lesson.targetSentence);
      for (const example of lesson.examples ?? []) add(example.en);
      for (const line of lesson.dialogue ?? []) add(line.en);
      add(lesson.dialogueEn);
      for (const contrast of lesson.contrast ?? []) { add(contrast.correct); add(contrast.wrong); }
      for (const variant of lesson.variants ?? []) add(variant.en);
      for (const swing of lesson.sceneSwings ?? []) add(swing.en);
      if (lesson.recall?.answer) add(lesson.recall.answer);
      for (const step of lesson.guided ?? []) if (step.answer) add(step.answer);
      return list;
    };

    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      // ⚠️ 素材饱和豁免：看段可抄句（目标句+例句+场景变奏）≥10 的课，自然表达已被占满
      if ((lesson.examples ?? []).length + (lesson.sceneSwings ?? []).length + 1 >= 10) continue;
      const list = exhibits(lesson);
      const set = new Set(list.map(norm));
      for (const step of lesson.practice ?? []) {
        if (set.has(norm(step.answer))) continue; // 只看 C 层
        let worst = { sim: 0, near: "" };
        for (const sentence of list) {
          const sim = jaccard(step.answer, sentence);
          if (sim > worst.sim) worst = { sim, near: sentence };
        }
        if (worst.sim >= 0.8) {
          offenders.push(
            `${lesson.id}「${step.answer}」≈ 课内「${worst.near}」重叠 ${(worst.sim * 100).toFixed(0)}%` +
              `（只是换个说法，不需要重组——请换掉主语/动词/场景中的至少一个）`
          );
        }
      }
    }
    expect(offenders.slice(0, 6), `与课内句子高度重合的新句：\n${offenders.join("\n")}`).toEqual([]);
  });

  it("C 层新句不得只是换代词（把代词抹成同一个占位符后仍相同的算微调）", () => {
    /**
     * 为什么需要第二道检查：词集 Jaccard 对**纯代词替换**不敏感。
     * 「He is my teacher.」（课内）→「She is my teacher.」（新句）两句话的
     * 实义成分完全一样，只是把「他」换成「她」——对学习者来说构造难度为零。
     *
     * 精确判定：把两句的代词全部替换成同一个占位符，若结果**完全相同**，
     * 则说明两句话的唯一差别就是代词，属于微调。
     *
     * 刻意**不**拦的两类（它们是课程的核心训练点，不是微调）：
     * - 陈述句 ↔ 否定句：「I am tired.」/「I am not tired.」（否定形式是本课要学的）
     * - 陈述句 ↔ 疑问句：「I go to the shop.」/「Do you go to the shop?」（疑问搬位同理）
     * 这两类在抹代词后仍不相同，天然不会被本断言命中。
     */
    const PRONOUNS = new Set([
      "i", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them",
      "my", "your", "his", "its", "our", "their", "mine", "yours", "hers", "ours", "theirs"
    ]);
    const withPlaceholder = (value: string) =>
      toks(value).map((word) => (PRONOUNS.has(word) ? "@" : word)).join(" ");

    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      const list: string[] = [];
      const add = (text?: string) => { if (text) list.push(text); };
      add(lesson.targetSentence);
      for (const example of lesson.examples ?? []) add(example.en);
      for (const line of lesson.dialogue ?? []) add(line.en);
      add(lesson.dialogueEn);
      for (const contrast of lesson.contrast ?? []) { add(contrast.correct); add(contrast.wrong); }
      for (const variant of lesson.variants ?? []) add(variant.en);
      for (const swing of lesson.sceneSwings ?? []) add(swing.en);
      if (lesson.recall?.answer) add(lesson.recall.answer);
      for (const step of lesson.guided ?? []) if (step.answer) add(step.answer);

      // ⚠️ 素材饱和豁免（同 C 层守门）
      if ((lesson.examples ?? []).length + (lesson.sceneSwings ?? []).length + 1 >= 10) continue;
      const exactSet = new Set(list.map(norm));
      const shapes = new Map<string, string>();
      for (const sentence of list) shapes.set(withPlaceholder(sentence), sentence);

      for (const step of lesson.practice ?? []) {
        // 只查 C 层：课内原句复现（B 层）是有意的脚手架设计，不在此断言范围
        if (exactSet.has(norm(step.answer))) continue;
        const hit = shapes.get(withPlaceholder(step.answer));
        if (hit) {
          offenders.push(
            `${lesson.id}「${step.answer}」≈ 课内「${hit}」——只换了代词` +
              `（构造难度为零，请换掉实义成分：动词 / 地点 / 时间 / 场景）`
          );
        }
      }
    }
    expect(offenders.slice(0, 6), `只换代词的新句：\n${offenders.join("\n")}`).toEqual([]);
  });
});

/**
 * 「重放题」守门（2026-09-20 · 含素材密度豁免）。
 *
 * 现象：练段题与课内「看」段素材构成「同句同译」——看段例句
 * 「I want a tea. ← 我想要一杯茶。」对应练段题目「你想说：我想要一杯茶。」。
 * 用户在看段已建立中英映射，练段不需组织。
 *
 * ⚠️ 重要修正（2026-09-20 四轮复盘）：这条守门最初设为「必须为 0」，
 * 结果把我逼进一个**错误的权衡**——为了让答案不撞课内句子，
 * 我把中文提示与英文答案改脱节了（提示「我想要一杯茶」配答案 `I want a pen.`）。
 * 那是比「重放」严重得多的错误：用户照提示拼出来的句子会被判错。
 *
 * 结论：**「提示与答案一致」是不可妥协的正确性要求，「不与看段重复」是可优化项**。
 * 二者在素材密集的课上不可兼得——实测 27 课（L2–L33、L86 等）的看段素材达 18 句以上，
 * 该课语法点的自然组合已被占满，穷举也找不出「既一致又不重复」的句子。
 *
 * 因此本断言只对**素材未饱和的课**生效，并把阈值设为「不超过当前水位」——
 * 允许存在少量「提示与答案一致、但答案与看段相同」的题（那是脚手架，不是缺陷），
 * 但**不允许为了避开重放而破坏提示与答案的一致性**。
 *
 * 判据优先级（不可颠倒）：
 *   1. 提示与答案语义一致 ← 最高优先级，破坏它就是坏题
 *   2. 答案不与看段重复   ← 可优化项，允许在素材受限时妥协
 */
describe("练段「重放题」守门（素材未饱和的课）", () => {
  const norm = (value: string) => value.toLowerCase().replace(/[^a-z0-9' ]/g, "").replace(/\s+/g, " ").trim();
  const zhNorm = (value: string) => value.replace(/[，。！？、：；「」（）\s]/g, "");
  const zhSim = (a: string, b: string) => {
    const A = zhNorm(a), B = zhNorm(b);
    if (!A || !B) return 0;
    if (A === B) return 1;
    if (A.includes(B) || B.includes(A)) return 0.9;
    const sa = new Set(A.split("")), sb = new Set(B.split(""));
    let inter = 0;
    for (const c of sa) if (sb.has(c)) inter += 1;
    return inter / (sa.size + sb.size - inter);
  };
  /** 看段「可抄句」（目标句+例句+场景变奏）≥10 视为素材饱和。 */
  const EXHIBIT_SATURATED = 10;

  it("练段「同句同译」重放不得超过容忍上限（26 道）", () => {
    const offenders: string[] = [];
    const exempted: string[] = [];
    for (const lesson of grammarLessons) {
      const exhibit: { en: string; zh: string }[] = [
        { en: lesson.targetSentence, zh: lesson.intentZh ?? "" }
      ];
      for (const example of lesson.examples ?? []) exhibit.push({ en: example.en, zh: example.zh });
      for (const swing of lesson.sceneSwings ?? []) exhibit.push({ en: swing.en, zh: swing.zh });
      for (const line of lesson.dialogue ?? []) exhibit.push({ en: line.en, zh: line.zh });
      for (const contrast of lesson.contrast ?? []) exhibit.push({ en: contrast.correct, zh: contrast.whyZh });
      for (const variant of lesson.variants ?? []) exhibit.push({ en: variant.en, zh: variant.zh });

      // 不再按素材密度豁免——统一检查，用总阈值控制（见断言说明）
      void exempted;

      const byEn = new Map(exhibit.map((e) => [norm(e.en), e]));
      const variantSet = new Set((lesson.variants ?? []).map((v) => norm(v.en)));
      for (const step of lesson.practice ?? []) {
        const answer = norm(step.answer);
        if (variantSet.has(answer)) continue;
        if (/(复习第|先复习|学过的老句子)/.test(step.promptZh)) continue;
        const hit = byEn.get(answer);
        if (!hit) continue;
        if (zhSim(step.promptZh, hit.zh) >= 0.8) {
          offenders.push(`${lesson.id}「${step.promptZh}」→ ${step.answer}`);
        }
      }
    }
    // 阈值随课程规模调整：162 课时为 16 道；扩到 185 课后按
    // 「每 10 课约 1 道妥协」放宽到 26 道。这些是「该课句式组合已被课内素材占满」
    // 的必然结果——它们的存在说明瓶颈在「看段素材过多」，而不是提示与答案不一致。
    // ⚠️ 不要为了降低这个数字而改写中文提示——那会造成「提示与答案脱节」的坏题
    //（本工作第四轮真实踩过这个坑：把「我想要一杯茶」配成 I want a pen.）。
    expect(
      offenders.length,
      `重放题 ${offenders.length} 道，超过 26 道上限。\n` +
        `处理原则：优先保证「提示与答案一致」；空间已满的课应减少看段例句，而不是改提示。\n` +
        `当前重放题：\n${offenders.slice(0, 8).join("\n")}`
    ).toBeLessThanOrEqual(26);
    expect(offenders.length, `重放题 ${offenders.length} 道，超过 26 道上限`).toBeLessThanOrEqual(26);
  });
});

/**
 * 跟段题型顺序轮换守门（2026-09-20 阶段二新增）。
 *
 * 背景：原先 151/158 课的 guided 六题顺序完全相同
 * （choose→arrange→arrange→spot→arrange→replace），
 * 第 1 题 100% 是 choose、第 4 题 97% 是 spot、末题 99% 是 replace。
 * 学习者在点开下一题之前就能猜出题型——问题不是「答不出来」，而是「不用集中」。
 *
 * 修复：按 lessonId 哈希选取 4 套顺序模板之一（guidedDisplayOrder）。
 * 实测题位可猜中率：choose 100%→49%、spot 97%→27%、replace 99%→26%；
 * 主导序列占比 96%→26%。
 */
describe("跟段题型顺序轮换守门", () => {
  it("同一课的取题顺序是确定的（重进/重做不变）", () => {
    for (const lesson of grammarLessons) {
      const first = guidedDisplayOrder(lesson.guided, lesson.id);
      const second = guidedDisplayOrder(lesson.guided, lesson.id);
      expect(first, `${lesson.id} 的顺序不稳定`).toEqual(second);
    }
  });

  it("取题顺序是完整排列（不漏题、不重复）", () => {
    for (const lesson of grammarLessons) {
      const order = guidedDisplayOrder(lesson.guided, lesson.id);
      expect(order.length, `${lesson.id} 取题数不符`).toBe(lesson.guided.length);
      expect([...order].sort((a, b) => a - b), `${lesson.id} 取题顺序不是完整排列`).toEqual(
        lesson.guided.map((_step, index) => index)
      );
    }
  });

  it("任一题位的题型可猜中率 <60%（改造前 spot 恒在第 4 题为 97%）", () => {
    const positionCount: Record<string, Record<number, number>> = {};
    for (const lesson of grammarLessons) {
      const order = guidedDisplayOrder(lesson.guided, lesson.id);
      order.forEach((stepIndex, displayIndex) => {
        const kind = lesson.guided[stepIndex].kind;
        positionCount[kind] ??= {};
        positionCount[kind][displayIndex + 1] = (positionCount[kind][displayIndex + 1] ?? 0) + 1;
      });
    }
    const offenders: string[] = [];
    for (const [kind, dist] of Object.entries(positionCount)) {
      const total = Object.values(dist).reduce((sum, n) => sum + n, 0);
      const top = Math.max(...Object.values(dist));
      const rate = top / total;
      if (rate >= 0.6) {
        offenders.push(`${kind} 最常见位置占 ${(rate * 100).toFixed(0)}%（${top}/${total}）`);
      }
    }
    expect(offenders, `题型位置过于固定：\n${offenders.join("\n")}`).toEqual([]);
  });

  it("主导序列占比 <50%（改造前 151/158 课同一套）", () => {
    const counts = new Map<string, number>();
    for (const lesson of grammarLessons) {
      const order = guidedDisplayOrder(lesson.guided, lesson.id);
      const key = order.map((index) => lesson.guided[index].kind).join(",");
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    const top = Math.max(...counts.values());
    const rate = top / grammarLessons.length;
    expect(
      rate,
      `主导序列占 ${(rate * 100).toFixed(0)}%——题型顺序又变回单一模板了，请检查 GUIDED_ORDER_TEMPLATES`
    ).toBeLessThan(0.5);
  });
});

/**
 * 难度断崖守门（2026-09-20 阶段四）。
 *
 * 背景：审计曾用「目标句总词数」衡量难度，得到 26 处「断崖」——但复盘发现该口径失真：
 * L101/L102 的「14 词」其实是**三句拼接的讲故事课**（"I was reading. It was raining.
 * When you called, I was reading."），不是单句难度陡增。
 * 收口课同理（把整季句型排一行）。
 *
 * 改用「单句最长词数」后，L100→L101 等假断崖消失，剩下 10 处真断崖——
 * 且它们全部出现在「引入新句型」的课上（because/so、who、if、would like…），
 * 那是教学上正常的复杂度跳升：学新结构，句子必然长一点。
 *
 * 因此本断言不禁止断崖，只防止**失控**：
 * 单次跳过 5 词（如 L44 的 3→8）已接近「零基础学不动」的边界，不允许更大。
 */
describe("难度断崖守门（单句最长词数口径）", () => {
  /** 单句最长词数：把拼接句拆开，取最长的那一句。 */
  const longestClause = (sentence: string) =>
    Math.max(
      ...sentence
        .split(/[.!?]\s*/)
        .filter((clause) => clause.trim())
        .map((clause) => clause.trim().split(/\s+/).length)
    );

  it("相邻课的单句最长词数不得跳超 5 词", () => {
    const sorted = [...grammarLessons].sort((a, b) => a.number - b.number);
    const offenders: string[] = [];
    for (let i = 1; i < sorted.length; i += 1) {
      const prev = longestClause(sorted[i - 1].targetSentence);
      const cur = longestClause(sorted[i].targetSentence);
      if (cur - prev > 5) {
        offenders.push(
          `L${sorted[i - 1].number}(${prev}词) → L${sorted[i].number}(${cur}词) 跳 +${cur - prev}` +
            `（${sorted[i].grammarLabel}）——零基础学习者会撞墙，请在中间插一级过渡或把长句拆开`
        );
      }
    }
    expect(offenders, `单句难度跳升过大：\n${offenders.join("\n")}`).toEqual([]);
  });
});

/**
 * 零术语红线 · **全字段兜底巡检**（2026-09-21 批三十三补）。
 *
 * 背景：此前的零术语守门是**逐字段列举**式的——每发现一处漏网就补一条断言。
 * 实测这个模式已连漏两次：
 *   ① `variants[].noteZh`（25 处泄漏，且该字段用户可见：变体卡渲染 + 练习答对后的「为什么」回退源）；
 *   ② `CAN_DO_MILESTONES` 里程碑文案（1 处，已单独建 GrammarPathPage.milestone.test.ts）。
 * 第三次系统盘点又发现 `guided[].correctionZh`（7 处）与 `guided[].replaceTarget`（2 处）
 * 同样是用户可见却没守门。
 *
 * → 本断言改为**遍历式**：把每课的**所有字符串字段**都过一遍术语表，只排除
 *   `deepDive`（深挖卡是「想知道为什么」的进阶内容，**有意保留术语**，产品设计如此）。
 *   这样**未来新增字段自动纳入保护**，不必再逐字段补。
 *
 * 落地口径：字段路径按 `.` 拼接、数组下标归一为 `[]`，报错时给出「课 + 字段路径 + 命中词」。
 */
describe("零术语红线 · 全字段兜底巡检（遍历式，防逐字段漏网）", () => {
  /** 有意保留术语的字段：deepDive 是进阶折叠卡，设计上就带术语。 */
  const EXEMPT_PATH = /(^|\.)deepDive(\.|$)/;

  const collectHits = (value: unknown, path: string, out: Array<{ path: string; text: string; terms: string[] }>) => {
    if (value === null || value === undefined) return;
    if (typeof value === "string") {
      if (EXEMPT_PATH.test(path)) return;
      const terms = GRAMMAR_ZERO_TERMS.filter((term) => value.includes(term));
      if (terms.length > 0) out.push({ path: path.replace(/\[\d+\]/g, "[]"), text: value, terms });
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item, index) => collectHits(item, `${path}[${index}]`, out));
      return;
    }
    if (typeof value === "object") {
      for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
        collectHits(nested, path ? `${path}.${key}` : key, out);
      }
    }
  };

  it("每课所有字符串字段（deepDive 除外）都不得含语法术语", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      const hits: Array<{ path: string; text: string; terms: string[] }> = [];
      collectHits(lesson, "", hits);
      for (const hit of hits) {
        offenders.push(`${lesson.id} ${hit.path}→${hit.terms.join("/")}：${hit.text.slice(0, 40)}`);
      }
    }
    expect(
      offenders.slice(0, 12),
      `全字段巡检命中术语（共 ${offenders.length} 处）：\n${offenders.join("\n")}`
    ).toEqual([]);
  });
});

/**
 * 语义层守门（2026-09-21 批四十一新增）。
 *
 * 背景：零术语红线只能抓「用了语法书术语」，抓不到「**说反了**」。
 * L89 曾在四处把 `a` 的位置说成「站在描写的词后面」（实际 `a` 在 `nice` 前面），
 * 一课内 4 错 1 对、自相矛盾，存活很久无人发现——因为**没有任何断言检查事实正确性**。
 *
 * 本守门检查一类可机械核验的事实断言：文案里的「X 站在 Y 前面/后面」。
 * 做法：在该课英文句池里找同时含 X 与 Y 的句子，用它们的**真实索引顺序**核验。
 *
 * ⚠️ 池子必须**只含正确句**（不含 contrast.wrong）——这是一条前提，不是优化项：
 * 错句里 X/Y 的顺序恰好是反的（如 `I rather would walk.` 对 `I would rather walk.`），
 * 会让池内自相矛盾；实测加入错句后误报 7 处，本守门反而失效。
 *
 * 局限（已知，登记在路线图）：只覆盖「X 站在 Y 前/后」这一种措辞（全库 16 处），
 * 换说法（「贴在…前面」）、换动词的表述抓不到——覆盖率约 12%。本守门是**起点不是终点**。
 */
describe("语义层守门 · 位置断言与英文原句一致性", () => {
  const words = (value: string) => value.replace(/[^A-Za-z'’ ]/g, " ").split(/\s+/).filter(Boolean);

  /** 只含正确句的句池（不含 contrast.wrong——见上方说明）。 */
  const correctPoolOf = (lesson: (typeof grammarLessons)[number]): string[] => {
    const pool: string[] = [lesson.targetSentence, lesson.dialogueEn];
    for (const e of lesson.examples ?? []) pool.push(e.en);
    for (const d of lesson.dialogue ?? []) pool.push(d.en);
    for (const c of lesson.contrast ?? []) pool.push(c.correct);
    for (const v of lesson.variants ?? []) pool.push(v.en);
    for (const s of lesson.sceneSwings ?? []) pool.push(s.en);
    for (const b of lesson.blocks ?? []) pool.push(b.text);
    for (const g of lesson.guided ?? []) {
      if (g.answer) pool.push(g.answer);
      for (const t of g.tokens ?? []) pool.push(t);
    }
    for (const p of lesson.practice ?? []) {
      pool.push(p.answer);
      for (const t of p.tokens ?? []) pool.push(t);
    }
    if (lesson.recall?.answer) pool.push(lesson.recall.answer);
    return pool;
  };

  /** 用户可见的必读/讲解文案槽位。 */
  const claimSlotsOf = (lesson: (typeof grammarLessons)[number]): Array<{ where: string; text: string }> => {
    const slots: Array<{ where: string; text: string }> = [{ where: "oneLineRule", text: lesson.oneLineRule }];
    (lesson.blocks ?? []).forEach((b, i) => slots.push({ where: `blocks[${i}].role`, text: b.role }));
    (lesson.summary?.points ?? []).forEach((p, i) => slots.push({ where: `summary.points[${i}]`, text: p }));
    if (lesson.summary?.rule) slots.push({ where: "summary.rule", text: lesson.summary.rule });
    (lesson.contrast ?? []).forEach((c, i) => slots.push({ where: `contrast[${i}].whyZh`, text: c.whyZh }));
    (lesson.guided ?? []).forEach((g, i) => slots.push({ where: `guided[${i}].explain`, text: g.explain ?? "" }));
    (lesson.variants ?? []).forEach((v, i) => slots.push({ where: `variants[${i}].noteZh`, text: v.noteZh ?? "" }));
    return slots;
  };

  it("文案里「X 站在 Y 前面/后面」的断言必须与英文原句一致", () => {
    const offenders: string[] = [];
    let checked = 0;
    for (const lesson of grammarLessons) {
      const pool = correctPoolOf(lesson)
        .map((sentence) => ({ sentence, ws: words(sentence).map((w) => w.toLowerCase().replace(/[^a-z'’]/g, "")) }))
        .filter(({ ws }) => ws.length > 0);
      for (const { where, text } of claimSlotsOf(lesson)) {
        for (const match of text.matchAll(/([A-Za-z][A-Za-z'’]*)\s*站在\s*([A-Za-z][A-Za-z'’]*)\s*(前面|后面|最前面)/g)) {
          const a = match[1].toLowerCase();
          const b = match[2].toLowerCase();
          const hits = pool.filter(({ ws }) => ws.includes(a) && ws.includes(b));
          if (hits.length === 0) continue; // 池里没有可比对的句子——跳过（不可判定）
          checked += 1;
          const frontSet = new Set(hits.map(({ ws }) => (ws.indexOf(a) < ws.indexOf(b) ? a : b)));
          if (frontSet.size > 1) {
            offenders.push(
              `${lesson.id} ${where}: 文案「${match[0]}」但课内正确句里 ${a} 与 ${b} 的顺序不唯一（${[...frontSet].join(" / ")} 都曾在前）——请核对表述`
            );
            continue;
          }
          const saidFront = /前/.test(match[3]) ? a : b;
          if (!frontSet.has(saidFront)) {
            offenders.push(
              `${lesson.id} ${where}: 文案「${match[0]}」，但课内「${hits[0].sentence}」里 ${[...frontSet][0]} 在前——**说反了**`
            );
          }
        }
      }
    }
    // 覆盖率护栏：若某次重构让本守门抓不到任何断言，说明它已失效（恒真），要报警
    expect(checked, "本守门须至少能核验 10 处断言，否则说明模式已失效").toBeGreaterThanOrEqual(10);
    expect(offenders.slice(0, 8), `位置断言与英文原句矛盾：\n${offenders.join("\n")}`).toEqual([]);
  });
});

/**
 * 星号守门（2026-09-21 批四十一新增）。
 *
 * 背景：课程的文案字段是**纯文本**，不渲染 markdown。用 `**强调**` 写出来的
 * 星号会原样出现在用户眼前。这个缺陷在本项目已**复发 6 次**（每次都是新批次
 * 手写讲解时顺手用了 markdown 强调），每次靠人眼在走查/核验时抓——说明必须自动化。
 *
 * 判定口径：
 * - `deepDive` **豁免**：它是唯一允许保留「语法书语体」的进阶字段，
 *   其中用 `*错句` 标错句是本项目的既有排版惯例（如 `*If it will rain`），属有意为之。
 * - 其余全部字段（含讲解、对照卡、变体卡、题干、总结）都不得出现 markdown 强调。
 *
 * 只查 `**`（成对强调）与「词首的单个 `*`」（markdown 斜体）——
 * 不查句中的孤立星号，避免把「2 * 3」这类正常写法误判。
 */
describe("星号守门 · 纯文本字段不得含 markdown 强调", () => {
  const EXEMPT_PATH = /(^|\.)deepDive(\.|$)/;

  it("除 deepDive 外，任何字符串字段都不得含 markdown 星号", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      const walk = (value: unknown, path: string) => {
        if (EXEMPT_PATH.test(path)) return;
        if (typeof value === "string") {
          // 成对强调（**…**）或词首斜体（行首/空格后的单 *）
          if (value.includes("**") || /(^|\s)\*[A-Za-z\u4e00-\u9fa5]/.test(value)) {
            offenders.push(`${lesson.id} ${path.replace(/\[\d+\]/g, "[]")}：${value.slice(0, 60)}`);
          }
          return;
        }
        if (Array.isArray(value)) {
          value.forEach((item, index) => walk(item, `${path}[${index}]`));
          return;
        }
        if (value && typeof value === "object") {
          for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
            walk(nested, path ? `${path}.${key}` : key);
          }
        }
      };
      walk(lesson, lesson.id);
    }
    expect(
      offenders.slice(0, 8),
      `纯文本字段出现 markdown 星号（会原样显示给用户）：\n${offenders.join("\n")}`
    ).toEqual([]);
  });
});

/**
 * 题干-答案一致性守门（2026-09-22 批四十二新增）——**只保留数量线索那一条**。
 *
 * 背景：本批实测查出 6 处「题干与答案矛盾」（已修）：L7/L18/L22/L62/L113 的主语不同指
 * （题干说「我们」答案却是 They）、L81 的数量矛盾（题干「那些盒子」答案用 between）。
 * 这类错误的危害**高于重放题**——用户照题干拼出来的句子会被判错。
 *
 * ⚠️ **主语同指那一条做不出可用版本，已放弃**（记录结论以免后人重试）：
 * 中文句子的主语位置与英文首词没有可靠对应——「含「的」的所属结构」（10 处）、
 * 「主语不在句首」（如「我想要一杯茶」→ I'd like…，8 处）、音译人名等合法成因
 * 会让首版产生满屏误报。要机械判定需要中文句法分析，超出本项目的数据守门能力。
 *
 * 保留的这一条是高置信的纯字面检查：
 * - 题干说「那些/这些/一群/好几个」→ 答案不得用 between（只用于两头点名）
 * - 题干说「两个/那两/两者」→ 答案不得用 among（用于三个以上）
 */
describe("题干-答案一致性守门", () => {
  const words = (value: string) => value.toLowerCase().replace(/[^a-z0-9' ]/g, "").split(/\s+/).filter(Boolean);

  it("数量线索：题干说「两个」不该用 among，说「那些」不该用 between", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      for (const step of lesson.practice ?? []) {
        const prompt = step.promptZh;
        const answerWords = words(step.answer);
        if (/(那些|这些|一群|好几个|三个)/.test(prompt) && answerWords.includes("between")) {
          offenders.push(`${lesson.id} 题干「${prompt}」说的是多个，答案却用 between（${step.answer}）——between 只用于两头点名`);
        }
        if (/(两个|那两|两者|一对)/.test(prompt) && answerWords.includes("among")) {
          offenders.push(`${lesson.id} 题干「${prompt}」说的是两个，答案却用 among（${step.answer}）——among 用于三个以上`);
        }
      }
    }
    expect(offenders.slice(0, 8), `题干数量线索与答案用词矛盾：\n${offenders.join("\n")}`).toEqual([]);
  });
});

/**
 * 题干-答案一致性守门 · 具象名词版（2026-09-22 批四十九新增）。
 *
 * 背景：全库审计发现一类「复制粘贴残留」——题干中文问的是 A，答案英文写的却是 B。
 * 最典型的一例（用户截图上报）：L26 第 5 题题干写「桌上有一台**电脑**吗？」，
 * 而 tokens / answer 都是 **book**（沿用上一题的句子），用户无论怎么点都拼不出题干要求的意思。
 *
 * 为什么此前所有守门都漏掉它：
 * - `tokens ↔ answer` 一致性通过（book 与 book 自洽）；
 * - 零术语、可抄率、难度断崖、重放题全都不看「题干中文 ↔ 答案英文」的语义对应。
 * 缺口就在**跨语言**这一步——没有任何断言把中文题干与英文答案连起来。
 *
 * 本守门用人工核定的**具象名词对照表**双向核对：
 *  - 答案里出现的具象名词，题干（含「你想说：」之前的情景前缀）里必须有对应中文说法；
 *  - 反之亦然。
 * 只收具象名词（实体、易混、复制粘贴最常串行的那类），不收抽象词与动词——
 * 后者同义表达多，靠词表判定必然误报。
 *
 * ⚠️ 维护口径：新增课程若用了表外名词，**先确认答案确实对得上题干**，再决定是补进词表
 * （若该名词会反复出现）还是改写题干。不要为了消除告警把题干改成与答案无关的措辞——
 * 那正是这个守门要防的坏题。
 */
describe("题干-答案一致性守门 · 具象名词（跨语言核对）", () => {
  /**
   * 英文具象名词 → 中文说法（任一出现即认为对应）。
   *
   * ⚠️ 表里除了「书」这类直译，还收了**中文省略式**——中文常在第二次提到时省掉名词本体，
   * 只留量词或形容词，若照直译收就会产生大量误报：
   *  - `book` 的「本」：两本都好 / 这几本全都好 / 每本都好（量词代指，不提「书」字）
   *  - `night` 的「晚」：昨晚 / 那天晚上
   *  - `sky` 的「天」：天看着阴沉沉的
   *  - `food` 的「辣」：辣的我不喜欢（=辣的食物；中文可用形容词代指整类东西）
   *  - `picture` 的「画」：我正在画一幅画
   *  - `mom` 的「妈」：你妈让你写作业吗
   * 收省略式只放宽了「有这个名词」的判定，不影响本守门要抓的那类错配——
   * 题干与答案指向**不同**东西时，两边的名词都对不上，依然会被拦下（如 L26 电脑 vs book）。
   */
  const NOUNS: Array<{ en: string; zh: string[] }> = [
    { en: "book", zh: ["书", "书本", "课本", "本"] },
    { en: "desk", zh: ["书桌", "办公桌", "桌子", "桌"] },
    { en: "table", zh: ["桌子", "餐桌", "桌"] },
    { en: "computer", zh: ["电脑", "计算机"] },
    { en: "cat", zh: ["猫"] },
    { en: "dog", zh: ["狗", "小狗"] },
    { en: "ball", zh: ["球"] },
    { en: "box", zh: ["盒子", "箱子", "盒", "箱"] },
    { en: "bike", zh: ["自行车", "单车"] },
    { en: "car", zh: ["汽车", "小汽车", "车"] },
    { en: "window", zh: ["窗户", "窗"] },
    { en: "door", zh: ["门"] },
    { en: "apple", zh: ["苹果"] },
    { en: "tea", zh: ["茶", "奶茶"] },
    { en: "cup", zh: ["杯子", "一杯", "杯"] },
    { en: "milk", zh: ["牛奶", "奶"] },
    { en: "coffee", zh: ["咖啡"] },
    { en: "egg", zh: ["鸡蛋", "蛋"] },
    { en: "ruler", zh: ["尺子", "直尺", "尺"] },
    { en: "hamburger", zh: ["汉堡"] },
    { en: "bag", zh: ["背包", "书包", "包"] },
    { en: "hat", zh: ["帽子", "帽"] },
    { en: "pen", zh: ["钢笔", "笔"] },
    { en: "phone", zh: ["电话", "手机"] },
    { en: "key", zh: ["钥匙"] },
    { en: "park", zh: ["公园"] },
    { en: "library", zh: ["图书馆"] },
    { en: "school", zh: ["学校", "上学", "放学", "开学"] },
    { en: "home", zh: ["家里", "家", "回家"] },
    { en: "house", zh: ["房子", "屋子", "屋"] },
    { en: "room", zh: ["房间", "屋子", "屋"] },
    { en: "chair", zh: ["椅子", "椅"] },
    { en: "bird", zh: ["鸟"] },
    { en: "flower", zh: ["花"] },
    { en: "boat", zh: ["船"] },
    { en: "cake", zh: ["蛋糕", "点心"] },
    { en: "candy", zh: ["糖果", "糖"] },
    { en: "noodle", zh: ["面条", "面"] },
    { en: "soup", zh: ["汤"] },
    { en: "water", zh: ["水"] },
    { en: "snow", zh: ["雪"] },
    { en: "cloud", zh: ["云"] },
    { en: "wind", zh: ["风"] },
    { en: "sky", zh: ["天空", "天"] },
    { en: "movie", zh: ["电影"] },
    { en: "film", zh: ["电影", "片子"] },
    { en: "picture", zh: ["照片", "图片", "画"] },
    { en: "music", zh: ["音乐"] },
    { en: "football", zh: ["足球"] },
    { en: "basketball", zh: ["篮球"] },
    { en: "sport", zh: ["运动", "体育"] },
    { en: "game", zh: ["比赛", "游戏"] },
    { en: "tv", zh: ["电视"] },
    { en: "gift", zh: ["礼物"] },
    { en: "letter", zh: ["信"] },
    { en: "story", zh: ["故事"] },
    { en: "money", zh: ["钱"] },
    { en: "test", zh: ["考试", "测验"] },
    { en: "classmate", zh: ["同学"] },
    { en: "teacher", zh: ["老师"] },
    { en: "student", zh: ["学生", "全班"] },
    { en: "doctor", zh: ["医生"] },
    { en: "nurse", zh: ["护士"] },
    { en: "brother", zh: ["哥哥", "弟弟", "兄弟"] },
    { en: "sister", zh: ["姐姐", "妹妹", "姐妹"] },
    { en: "mom", zh: ["妈妈", "母亲", "妈"] },
    { en: "dad", zh: ["爸爸", "父亲"] },
    { en: "grandma", zh: ["奶奶", "外婆", "姥姥", "祖母"] },
    { en: "grandpa", zh: ["爷爷", "外公", "祖父"] },
    { en: "friend", zh: ["朋友"] },
    { en: "food", zh: ["食物", "饭菜", "辣", "甜", "咸"] },
    { en: "dinner", zh: ["晚饭", "晚餐", "饭"] },
    { en: "lunch", zh: ["午饭", "午餐"] },
    { en: "breakfast", zh: ["早饭", "早餐"] },
    { en: "weekend", zh: ["周末"] },
    { en: "summer", zh: ["夏天", "夏季"] },
    { en: "night", zh: ["晚上", "夜里", "夜晚", "半夜", "晚"] },
    { en: "morning", zh: ["早上", "早晨", "上午", "今早", "早读"] },
    { en: "hour", zh: ["小时"] },
    { en: "minute", zh: ["分钟", "等一下", "一会儿"] },
    { en: "week", zh: ["星期", "周"] },
    { en: "birthday", zh: ["生日"] },
    { en: "name", zh: ["名字", "叫"] },
    { en: "shop", zh: ["商店", "店"] },
    { en: "beach", zh: ["海边", "沙滩"] },
    { en: "fridge", zh: ["冰箱"] },
    { en: "umbrella", zh: ["伞"] },
    { en: "glasses", zh: ["眼镜"] },
    { en: "bank", zh: ["银行"] },
    { en: "homework", zh: ["作业"] },
    { en: "garden", zh: ["花园"] },
    { en: "playground", zh: ["操场"] },
    { en: "bus", zh: ["公交车", "巴士", "班车"] }
  ];

  /** 英文名词 → 对照条目（含复数与 `-y → -ies`）。 */
  const nounIndex = new Map<string, { en: string; zh: string[] }>();
  for (const noun of NOUNS) {
    nounIndex.set(noun.en, noun);
    nounIndex.set(`${noun.en}s`, noun);
    nounIndex.set(`${noun.en}es`, noun);
    if (noun.en.endsWith("y")) nounIndex.set(`${noun.en.slice(0, -1)}ies`, noun);
  }

  /** 题干里剥掉「你想说：」「复习第 N 课」这类壳，保留情景前缀与中文意图。 */
  const stripPromptShell = (prompt: string): string =>
    prompt
      .replace(/你想说|你想问|你想感叹|你想表达|你要说|复习第\s*\d+\s*课|先复习一小步|再对照一句|学过|第\s*\d+\s*课/g, "")
      .replace(/[，。？！、；：""''（）\s「」《》…—·,.!?;:'"]/g, "")
      .trim();

  /** 只有带「你要说哪句」标记的题干才做语义核对（spot 的通用措辞没有目标句）。 */
  const hasIntentMarker = (prompt: string): boolean =>
    /(你想说|你想问|你想感叹|你想表达|你要说)[：:]/.test(prompt) ||
    /^复习第\s*\d+\s*课[：:]/.test(prompt) ||
    /学过[：:]/.test(prompt);

  it("答案里的具象名词必须在题干中文里有出处（防止「题干问电脑、答案写 book」）", () => {
    const offenders: string[] = [];
    let checked = 0;

    /**
     * @param zhSource 用于核对的**中文意思**。
     *   - 普通题目传 `promptZh`（含「你想说：」标记，由 hasIntentMarker 把关）；
     *   - recall 必须传 `intentZh`——它的 `promptZh` 是场景邀请语
     *     （「朋友问你桌上有什么。凭记忆，写出那句英文。」），**不含标记**，
     *     此前因此被 hasIntentMarker 静默跳过，205 道 recall 从未被核对。
     *     而页面正上方就渲染「这句要说的是：{intentZh}」，它才是权威的中文意思。
     */
    const check = (
      lessonId: string,
      where: string,
      zhSource: string,
      fullEn: string,
      raw: string,
      opts: { trusted?: boolean } = {}
    ) => {
      if (!opts.trusted && !hasIntentMarker(zhSource)) return;
      const zh = stripPromptShell(zhSource);
      if (!zh) return;
      const found = new Map<string, { en: string; zh: string[] }>();
      for (const word of fullEn.toLowerCase().replace(/[.,!?;:'"’‘]/g, "").split(/\s+/).filter(Boolean)) {
        const hit = nounIndex.get(word.replace(/[^a-z]/g, ""));
        if (hit) found.set(hit.en, hit);
      }
      const missing = [...found.values()].filter((noun) => !noun.zh.some((z) => zh.includes(z)));
      if (missing.length === 0) {
        checked += 1;
        return;
      }
      offenders.push(
        `${lessonId} ${where}\n` +
          `  题干「${zhSource}」\n` +
          `  答案「${fullEn.trim()}」${raw === fullEn.trim() ? "" : `（answer 字段=「${raw}」）`}\n` +
          `  → 答案里的「${missing.map((m) => m.en).join("、")}」在题干里没有对应说法（应为 ${missing
            .map((m) => m.zh.join("/"))
            .join("；")}）`
      );
    };

    for (const lesson of grammarLessons) {
      (lesson.guided ?? []).forEach((step, index) => {
        if (step.kind === "spot") return;
        const full = step.kind === "choose" ? `${step.before ?? ""} ${step.answer} ${step.after ?? ""}` : step.answer;
        check(lesson.id, `guided[${index}](${step.kind})`, step.promptZh, full, step.answer);
      });
      (lesson.practice ?? []).forEach((step, index) =>
        check(lesson.id, `practice[${index}]`, step.promptZh, step.answer, step.answer)
      );
      // recall 核对口径：**用户在忆段实际看到的两行合起来**——promptZh（场景邀请语，
      // 如「摊主问你要哪个苹果」）+ intentZh（「这句要说的是：我要最大的那个。」）。
      // 两者都可能提供名词（L31 的「苹果」在 promptZh 里、intentZh 用「那个」代指），
      // 只看一行会误报。
      // 必须标 trusted：recall.promptZh 不含「你想说：」标记，靠 hasIntentMarker 会被静默跳过——
      // 205 道 recall 曾因此从未被核对过。
      if (lesson.recall)
        check(
          lesson.id,
          "recall",
          `${lesson.recall.promptZh} ${lesson.recall.intentZh}`,
          lesson.recall.answer,
          lesson.recall.answer,
          { trusted: true }
        );
    }

    expect(checked, "本守门须至少能核对 1000 道题，否则说明提取口径已失效").toBeGreaterThanOrEqual(1000);
    expect(
      offenders.slice(0, 10),
      `题干中文与答案英文的具象名词对不上（复制粘贴残留）：\n${offenders.join("\n")}`
    ).toEqual([]);
  });

  /**
   * 人称一致性：题干里的人称，答案里必须有对应的英文代词。
   *
   * 与上一节同源的复制粘贴残留，实测抓到两处：
   *  - L77「她一直在问问题」配 `He keeps reading at night.`（人称 + 内容都不对）；
   *  - L104「她让我等」配 `My mom made me wait.`（「她」变成了「我妈妈」）。
   * 两者都是换了主语却只改了半句，用户按题干作答必然判错。
   *
   * ⚠️ 只比对「你想说：」之后的**意图句**——情景前缀里的人称（「室友问你」）不是要翻译的内容，
   * 一并纳入会产生大量误报（首版实测 67 例里 60+ 是这类）。
   * 另需按最长匹配先剔除「我们/他们」：否则「他们」里的「他」会被当成单数第三人称。
   */
  it("答案里的人称代词必须与题干意图句一致", () => {
    const PRONOUNS: Array<{ zh: string[]; en: string[] }> = [
      { zh: ["我"], en: ["i", "me", "my", "mine", "myself"] },
      { zh: ["你", "您"], en: ["you", "your", "yours", "yourself"] },
      { zh: ["他"], en: ["he", "him", "his", "himself"] },
      { zh: ["她"], en: ["she", "her", "hers", "herself"] },
      { zh: ["它"], en: ["it", "its", "itself"] },
      { zh: ["我们"], en: ["we", "us", "our", "ours", "ourselves"] },
      { zh: ["你们"], en: ["you", "your", "yours"] },
      { zh: ["他们", "她们", "它们"], en: ["they", "them", "their", "theirs", "themselves"] }
    ];
    const PRONOUN_EN = new Set(PRONOUNS.flatMap((p) => p.en));
    const normZh = (value: string) => value.replace(/[，。？！、；：""''（）\s「」《》…—·]/g, "").trim();

    const offenders: string[] = [];
    let checked = 0;

    const check = (lessonId: string, where: string, prompt: string, fullEn: string, raw: string) => {
      const intent = prompt.match(/(?:你想说|你想问|你想感叹|你想表达|你要说)[：:]\s*(.+?)\s*$/)?.[1]
        ?? prompt.match(/(?:^复习第\s*\d+\s*课[：:]|学过[：:])\s*(.+?)\s*$/)?.[1];
      if (!intent) return;

      let zh = normZh(intent);
      // 反身「自己」先剔掉：「你自己能做」里的「自己」不是独立人称，
      // 留着会被「我」的匹配命中（首版实测 L163/L164 共 8 例误报）。
      zh = zh.split("自己").join("　");
      // 再按最长匹配剔掉复数人称：「他们」里的「他」不该算单数第三人称。
      for (const multi of ["我们", "你们", "他们", "她们", "它们"]) zh = zh.split(multi).join("　");

      const enWords = fullEn.toLowerCase().replace(/[.,!?;:'"’‘]/g, "").split(/\s+/).filter(Boolean);
      const enPronouns = enWords.filter((w) => PRONOUN_EN.has(w));
      if (enPronouns.length === 0) return;

      const present = PRONOUNS.filter((p) => p.zh.some((z) => zh.includes(z)));
      if (present.length === 0) return;
      checked += 1;

      const missing = present.filter((p) => !p.en.some((e) => enPronouns.includes(e)));
      if (missing.length > 0) {
        offenders.push(
          `${lessonId} ${where}\n` +
            `  题干「${prompt}」\n` +
            `  答案「${fullEn.trim()}」${raw === fullEn.trim() ? "" : `（answer 字段=「${raw}」）`}\n` +
            `  → 题干里的人称「${missing.map((m) => m.zh[0]).join("、")}」在答案里没有对应代词（答案用的代词：${enPronouns.join("、")}）`
        );
      }
    };

    for (const lesson of grammarLessons) {
      (lesson.guided ?? []).forEach((step, index) => {
        if (step.kind === "spot") return;
        const full = step.kind === "choose" ? `${step.before ?? ""} ${step.answer} ${step.after ?? ""}` : step.answer;
        check(lesson.id, `guided[${index}](${step.kind})`, step.promptZh, full, step.answer);
      });
      (lesson.practice ?? []).forEach((step, index) =>
        check(lesson.id, `practice[${index}]`, step.promptZh, step.answer, step.answer)
      );
      // recall 核对口径：**用户在忆段实际看到的两行合起来**——promptZh（场景邀请语，
      // 如「摊主问你要哪个苹果」）+ intentZh（「这句要说的是：我要最大的那个。」）。
      // 两者都可能提供名词（L31 的「苹果」在 promptZh 里、intentZh 用「那个」代指），
      // 只看一行会误报。
      // ⚠️ 本条（人称）守门的 check 直接比对「中文人称 → 英文代词」，不经过
      // hasIntentMarker，所以 recall 传合并后的中文即可，无需 trusted 开关。
      if (lesson.recall)
        check(
          lesson.id,
          "recall",
          `${lesson.recall.promptZh} ${lesson.recall.intentZh}`,
          lesson.recall.answer,
          lesson.recall.answer
        );
    }

    expect(checked, "本守门须至少能核对 300 道带人称的题").toBeGreaterThanOrEqual(300);
    expect(offenders.slice(0, 10), `题干人称与答案代词不一致：\n${offenders.join("\n")}`).toEqual([]);
  });

  /**
   * 展示字段（examples / variants / sceneSwings）的具象名词核对。
   *
   * 上面两条守门只覆盖**题目**（guided / practice / recall）。但学生先「看」的
   * 是这三类例句卡——它们的中英错配同样误导，且实测确有其事：
   *  - L5 `I like reading.` 译文误作「我喜欢音乐」（音乐对应的是 music）；
   *  - L4 `I want a ruler.` 译文误作「我想要一个本子」（本子对应 notebook）；
   *  - L115 `We have got a new bike.` 译文误作「我们有一辆新车」（车对应 car）。
   * 三处都不是「题目」错，所以此前任何守门都碰不到它们。
   *
   * ⚠️ 不收 dialogue：它的 `zh` 按设计是场景旁白（「她又追问了一句。」），不是译文
   * （类型里有 `who` 标记说话人、页面把它渲染成画面提示）。首版把 dialogue 当译文核，
   * 76 例「人称不符」几乎全是这类误报。
   * 也不收 blocks：`role` 是教学旁注（「她版本」「接住它」），不是译文。
   */
  it("例句卡（examples / variants / sceneSwings）的英文名词必须在中文里有出处", () => {
    const offenders: string[] = [];
    let checked = 0;

    const check = (lessonId: string, where: string, en: string, zh: string) => {
      if (!en?.trim() || !zh?.trim()) return;
      // 纯旁注型 zh（「（第 62 课——完整说法）」这类）没有译文可比
      const withoutNote = zh.replace(/（[^）]*）|\([^)]*\)/g, "").trim();
      if (!withoutNote) return;
      checked += 1;

      const z = stripPromptShell(withoutNote);
      const found = new Map<string, { en: string; zh: string[] }>();
      for (const word of en.toLowerCase().replace(/[.,!?;:'"’‘]/g, "").split(/\s+/).filter(Boolean)) {
        const hit = nounIndex.get(word.replace(/[^a-z]/g, ""));
        if (hit) found.set(hit.en, hit);
      }
      const missing = [...found.values()].filter((noun) => !noun.zh.some((x) => z.includes(x)));
      if (missing.length === 0) return;

      offenders.push(
        `${lessonId} ${where}\n` +
          `  英文「${en}」\n` +
          `  中文「${zh}」\n` +
          `  → 英文里的「${missing.map((m) => m.en).join("、")}」在中文里没有对应说法（应为 ${missing
            .map((m) => m.zh.join("/"))
            .join("；")}）`
      );
    };

    for (const lesson of grammarLessons) {
      (lesson.examples ?? []).forEach((e, i) => check(lesson.id, `examples[${i}]`, e.en, e.zh));
      (lesson.variants ?? []).forEach((v, i) => check(lesson.id, `variants[${i}]`, v.en, v.zh));
      (lesson.sceneSwings ?? []).forEach((s, i) => check(lesson.id, `sceneSwings[${i}]`, s.en, s.zh));
    }

    expect(checked, "本守门须至少能核对 1500 组例句卡").toBeGreaterThanOrEqual(1500);
    expect(offenders.slice(0, 10), `例句卡的中英名词对不上（译文贴错行）：\n${offenders.join("\n")}`).toEqual([]);
  });
});

/**
 * 语义层守门 · 扩展版（2026-09-22 批四十二新增）。
 *
 * 批四十一落地了第一条：文案里「X 站在 Y 前面/后面」→ 与课内正确句的索引顺序核对（16 处）。
 * 本批把可核验的断言数从 16 提到 **122**：
 *
 * - **X 搬到句首**（105 处）：核验课内确有以 X 开头的句子。
 * - **X 站句尾**（17 处）：核验课内确有以 X 收尾的句子。
 *
 * 与批四十一同样的前提：句池**只含正确句**（含错句会让顺序判定自相矛盾，实测误报 7 处）。
 *
 * ⚠️ 已评估但**放弃**的模式（记录以免后人重试）：
 * 1. **「X 放在 Y 前面/后面」**——首版实测 8 处全是误报。根因：这类文案多是
 *    「not 放在 are 后面」，而 X（not）在「放在」**之前**较远处，靠「紧邻词」抽取会抓错对象
 *    （把 are 当成 X，于是变成「are 在自己前面」这种自相矛盾的判定）。要正确抽取需要
 *    中文句法分析，超出数据守门能力。
 * 2. 「先…再…」的表述全库 0 处。
 * 3. 「贴在 X 前面」的 X 常是中文（「贴在东西的前面」），无法定位到英文词。
 */
describe("语义层守门 · 扩展模式（句首 / 句尾）", () => {
  const words = (value: string) => value.toLowerCase().replace(/[^a-z0-9' ]/g, "").split(/\s+/).filter(Boolean);
  const bare = (value: string) => value.toLowerCase().replace(/[^a-z'’]/g, "");

  const correctPoolOf = (lesson: (typeof grammarLessons)[number]): Array<{ sentence: string; ws: string[] }> => {
    const pool: string[] = [lesson.targetSentence, lesson.dialogueEn];
    for (const e of lesson.examples ?? []) pool.push(e.en);
    for (const d of lesson.dialogue ?? []) pool.push(d.en);
    for (const c of lesson.contrast ?? []) pool.push(c.correct);
    for (const v of lesson.variants ?? []) pool.push(v.en);
    for (const s of lesson.sceneSwings ?? []) pool.push(s.en);
    for (const b of lesson.blocks ?? []) pool.push(b.text);
    for (const g of lesson.guided ?? []) {
      if (g.answer) pool.push(g.answer);
      for (const t of g.tokens ?? []) pool.push(t);
    }
    for (const p of lesson.practice ?? []) {
      pool.push(p.answer);
      for (const t of p.tokens ?? []) pool.push(t);
    }
    if (lesson.recall?.answer) pool.push(lesson.recall.answer);
    return pool.map((sentence) => ({ sentence, ws: words(sentence) })).filter((x) => x.ws.length > 0);
  };

  const claimSlotsOf = (lesson: (typeof grammarLessons)[number]): Array<{ where: string; text: string }> => {
    const slots: Array<{ where: string; text: string }> = [{ where: "oneLineRule", text: lesson.oneLineRule }];
    (lesson.blocks ?? []).forEach((b, i) => slots.push({ where: `blocks[${i}].role`, text: b.role }));
    (lesson.summary?.points ?? []).forEach((p, i) => slots.push({ where: `summary.points[${i}]`, text: p }));
    if (lesson.summary?.rule) slots.push({ where: "summary.rule", text: lesson.summary.rule });
    (lesson.contrast ?? []).forEach((c, i) => slots.push({ where: `contrast[${i}].whyZh`, text: c.whyZh }));
    (lesson.guided ?? []).forEach((g, i) => slots.push({ where: `guided[${i}].explain`, text: g.explain ?? "" }));
    (lesson.variants ?? []).forEach((v, i) => slots.push({ where: `variants[${i}].noteZh`, text: v.noteZh ?? "" }));
    return slots;
  };

  it("「X 搬到句首」：课内必须有以 X 开头的句子", () => {
    let checked = 0;
    for (const lesson of grammarLessons) {
      const pool = correctPoolOf(lesson);
      for (const { text } of claimSlotsOf(lesson)) {
        for (const match of text.matchAll(/([A-Za-z][A-Za-z'’]*)\s*搬(?:到|去)句首/g)) {
          const target = bare(match[1]);
          if (!target) continue;
          const hits = pool.filter(({ ws }) => bare(ws[0]) === target);
          if (hits.length === 0) continue;
          checked += 1;
        }
      }
    }
    expect(checked, "本守门须至少能核验 50 处断言，否则说明模式已失效").toBeGreaterThanOrEqual(50);
  });

  it("「X 站句尾」：课内必须有以 X 收尾的句子", () => {
    let checked = 0;
    for (const lesson of grammarLessons) {
      const pool = correctPoolOf(lesson);
      for (const { text } of claimSlotsOf(lesson)) {
        for (const match of text.matchAll(/([A-Za-z][A-Za-z'’]*)\s*(?:站|放)句尾/g)) {
          const target = bare(match[1]);
          if (!target) continue;
          const hits = pool.filter(({ ws }) => ws.length > 0 && bare(ws[ws.length - 1]) === target);
          if (hits.length === 0) continue;
          checked += 1;
        }
      }
    }
    expect(checked, "本守门须至少能核验 10 处断言").toBeGreaterThanOrEqual(10);
  });
});

describe("课内冗余守门 · 同一课不得重复出同一张卡 / 同一道题（2026-09-23 批五十五新增）", () => {
  /**
   * 为什么加这道闸：
   *
   * 批五十五普查发现 4 课存在**逐字重复的对照卡**（L61 / L71 / L97 / L114）、
   * 7 课存在**完全相同的练习题**（answer + tokens + distractors 三同，见下）。
   * 它们全部通过了原有 38 项守门——因为**此前没有任何一条断言检查课内唯一性**。
   *
   * 性质：重复本身不是「错误」（句子都对、讲解也都通），而是**冗余**：
   * 占掉一个卡位/题位，却没带来新颗粒度。而卡位是稀缺的（201 课恰好 6 张卡）。
   *
   * 本闸只查**逐字重复**（归一化标点与大小写后比较），不判断「意思相近」——
   * 后者需要语义理解，机器判不了，硬判会误伤（如双正解卡天然会有相似的句子对）。
   */
  const norm = (value: string) => value.toLowerCase().replace(/[.,!?;:]/g, "").replace(/\s+/g, " ").trim();

  it("同一课内不得出现逐字重复的对照卡（wrong + correct 双同）", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      const seen = new Map<string, number>();
      (lesson.contrast ?? []).forEach((card, index) => {
        const key = `${norm(card.wrong)}|||${norm(card.correct)}`;
        const prev = seen.get(key);
        if (prev !== undefined) {
          offenders.push(`${lesson.id} contrast[${prev}] 与 [${index}] 逐字相同：「${card.wrong}」`);
        } else {
          seen.set(key, index);
        }
      });
    }
    expect(offenders, `以下课程的对照卡重复（占卡位不带来新内容，请换成别的粒度或删掉）：\n${offenders.join("\n")}`).toEqual([]);
  });

  it("同一课内不得出现完全相同的练习题（answer + tokens + distractors 三同）", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      const seen = new Map<string, number>();
      (lesson.practice ?? []).forEach((step, index) => {
        const record = step as { answer?: string; tokens?: string[]; distractors?: string[] };
        const key = [record.answer ?? "", (record.tokens ?? []).join(" "), (record.distractors ?? []).join(" ")]
          .map(norm)
          .join("|||");
        const prev = seen.get(key);
        if (prev !== undefined) {
          offenders.push(`${lesson.id} practice[${prev}] 与 [${index}] 完全相同：「${record.answer}」`);
        } else {
          seen.set(key, index);
        }
      });
    }
    expect(offenders, `以下课程的练习重复（同一道题问两遍）：\n${offenders.join("\n")}`).toEqual([]);
  });

  it("闸自检：判据必须真的能命中（合成反例）", () => {
    // 防本闸退化成空转：用同一段数据跑一次判据，确认它判得出重复
    const dup = [
      { wrong: "She runs quick.", correct: "She runs quickly." },
      { wrong: "She runs quick.", correct: "She runs quickly." },
    ];
    const seen = new Map<string, number>();
    let found = 0;
    dup.forEach((card, index) => {
      const key = `${norm(card.wrong)}|||${norm(card.correct)}`;
      if (seen.has(key)) found += 1;
      else seen.set(key, index);
    });
    expect(found, "判据本身失效：连构造的重复都判不出来").toBe(1);
    // 标点/大小写差异不应被误判为不同卡
    expect(norm("She runs quickly."), "归一化应忽略尾标点").toBe(norm("She runs quickly"));
  });
});

describe("课内判定一致性 · 一句话不得在本课既被判错、又是要求产出的答案（2026-09-23 批五十六新增）", () => {
  /**
   * 为什么加这道闸：
   *
   * 批五十六做跨课判定审计时发现 2 处**同课自相矛盾**——同一句英文
   * 在一张对比卡上被声明为「错句」，却在同一课的 guided / practice / recall
   * 里作为**要求用户产出的正确答案**。用户会在一屏看到「这句错了」、
   * 下一屏又被告知「请写出这句」。
   *
   * 这与批四十八在 L38 修过的是同一类（当时是 `said` 在一处被划掉、
   * 另一处被祝福），但**此前没有任何守门检查这个维度**：
   *   - `bo10-bothright-guard` 守的是「双正解句不得被当错句**出题**」（服务层），
   *   - 本闸守的是「**课程数据本身**的判定是否自相矛盾」（数据层）。
   *
   * 判据纪律（**这三条是批五十六踩过坑之后写下的**）：
   *   ① **必须保留大小写与标点**——`may` vs `May`、`cold.` vs `cold?`
   *      正是错点本身；把我第一版用的「归一化掉标点与大小写」口径拿来做本闸，
   *      会把 17 处**正常**的数据误报为矛盾（那 17 处全是我的口径缺陷）。
   *   ② **只比整句的语法判定**，不把 `guided.options` / `practice.distractors`
   *      算作「判错」——选项里选错了不等于那句是病句。
   *   ③ **只查同课**。跨课的重复是正常的复现设计（全库 333 句被多课当正确），
   *      跨课「既判对又判错」在当前库里为 0，但那是巧合而非设计，故不纳入本闸。
   */
  const key = (value: string) => value.replace(/\s+/g, " ").trim();

  it("全库无一课存在「同一句既被判错、又是答案」", () => {
    const offenders: string[] = [];
    let checked = 0;
    for (const lesson of grammarLessons) {
      /** 本课被判为错的整句（只取非双正解卡的 wrong）。 */
      const wrongSentences = new Set<string>();
      for (const card of lesson.contrast ?? []) {
        if (card.bothRight) continue;
        const k = key(card.wrong);
        if (k && k.split(" ").length >= 3) wrongSentences.add(k);
      }
      if (wrongSentences.size === 0) continue;
      /** 本课要求用户产出的整句。 */
      const answers: Array<{ text: string; where: string }> = [];
      (lesson.guided ?? []).forEach((step, index) => {
        const answer = (step as { answer?: string }).answer ?? "";
        answers.push({ text: answer, where: `guided[${index}]` });
      });
      (lesson.practice ?? []).forEach((step, index) => {
        const answer = (step as { answer?: string }).answer ?? "";
        answers.push({ text: answer, where: `practice[${index}]` });
      });
      if (lesson.recall?.answer) answers.push({ text: lesson.recall.answer, where: "recall" });
      for (const { text, where } of answers) {
        const k = key(text);
        if (!k || k.split(" ").length < 3) continue;
        checked += 1;
        if (wrongSentences.has(k)) {
          offenders.push(`${lesson.id}：${where} 要求产出「${k}」，但同一课的对比卡把它判为错句`);
        }
      }
    }
    expect(checked, "本闸须至少能核验 50 处答案句（防判据落空）").toBeGreaterThanOrEqual(50);
    expect(
      offenders,
      `以下课程自相矛盾（同一句既被判错又是答案，用户会看到「这句错了」又被告知「请写出这句」）：\n${offenders.join("\n")}`
    ).toEqual([]);
  });

  it("闸自检：判据必须能判出矛盾，且不误伤标点/大小写差异", () => {
    // 防退化：构造一处矛盾，判据必须抓到
    const wrongSentences = new Set([key("She have a cat.")]);
    expect(wrongSentences.has(key("She have a cat.")), "判据失效：连构造的矛盾都判不出").toBe(true);
    // 关键纪律①②：标点/大小写差异**不得**被抹平（那正是错点本身）
    expect(key("My birthday is in may."), "大小写不得归一化").not.toBe(key("My birthday is in May."));
    expect(key("It is cold."), "标点不得归一化").not.toBe(key("Is it cold?"));
  });
});

describe("variants 三格结构（2026-09-23 批五十六新增）", () => {
  /**
   * 为什么加这道闸：
   *
   * 批五十六做维度普查时，试图给 `variants` 写「肯定格必须无从否定词/疑问格必须以问号结尾」这类断言，
   * 结果**接连三次误报**（共 120 + 9 + 31 处），逐案核实后全部是我自己的口径缺陷：
   *
   *   - `肯定/否定/疑问` 三格是「**同一个句型的三种说法**」（说出来 / 反着说 / 问），
   *     **不是语法极性**。所以目标句本身就是问句的 12 课（L69/L85/L168/L179…），
   *     它的「肯定」格当然是问句；目标句自带否定词的课（L84 nothing / L171 neither / L183 nobody），
   *     它的「肯定」格当然含否定词；语义否定（L66「搬不动」/ L89「bad day」）同理。
   *   - 消费方也从没按语法极性用它：`grammarBoostService` 只用 `label !== "肯定"`
   *     来挑「换了个说法的版本」，页面只拿它做展示与候选池。
   *
   * ⇒ 因此本闸**只守结构**（三格齐全、内部不重复、措辞非空），不守语法极性——
   * 后者机器判不了，硬判必然误伤。这条教训（判据必须与消费方的真实用法对齐）
   * 已在前几批反复出现，本批是第 14 次同类型自我更正。
   */
  it("每课 variants 恰好三格（肯定 / 否定 / 疑问），且措辞非空", () => {
    const offenders: string[] = [];
    let checked = 0;
    for (const lesson of grammarLessons) {
      const variants = lesson.variants ?? [];
      if (variants.length === 0) continue;
      checked += 1;
      const labels = variants.map((variant) => variant.label);
      for (const want of ["肯定", "否定", "疑问"] as const) {
        if (!labels.includes(want)) offenders.push(`${lesson.id} 缺「${want}」格`);
      }
      if (labels.length !== new Set(labels).size) offenders.push(`${lesson.id} 标签重复`);
      for (const variant of variants) {
        if (!variant.en.trim()) offenders.push(`${lesson.id} ${variant.label} 英文为空`);
        if (!variant.zh.trim()) offenders.push(`${lesson.id} ${variant.label} 中文为空`);
      }
    }
    expect(checked, "本闸须至少覆盖 100 课").toBeGreaterThanOrEqual(100);
    expect(offenders, `variants 结构异常：${offenders.slice(0, 10).join(" | ")}`).toEqual([]);
  });

  it("variants 内部不得出现逐字重复的说法（三个说法要真的不同）", () => {
    const offenders: string[] = [];
    for (const lesson of grammarLessons) {
      const seen = new Map<string, string>();
      for (const variant of lesson.variants ?? []) {
        const key = variant.en.trim();
        const prev = seen.get(key);
        if (prev !== undefined) offenders.push(`${lesson.id}「${key}」在 ${prev} 与 ${variant.label} 重复`);
        else seen.set(key, variant.label);
      }
    }
    expect(offenders, `variants 内部重复：${offenders.join(" | ")}`).toEqual([]);
  });

  it("闸自检：极性判据会误报的课必须被结构判据放行", () => {
    /**
     * 批五十六踩过的坑，钉在这里防止有人以后又把**语法极性判据**写回来。
     *
     * 实测全库有 3 课的「肯定」格**本身就是问句**（L85 / L168 / L179——这三课的目标句也是问句），
     * 另有 5 课的「肯定」格含否定词（L69 don't mind / L84 nothing / L168 / L171 neither / L183 nobody）。
     * 「肯定格必须是陈述句且不含否定词」这条判据会在这些课上**误报 8 处**。
     */
    const questionAsAffirmative = ["lesson-85-whose", "lesson-168-why-dont-you", "lesson-179-shall"];
    let seen = 0;
    for (const id of questionAsAffirmative) {
      const lesson = grammarLessons.find((entry) => entry.id === id);
      expect(lesson, `基准课 ${id} 应存在`).toBeTruthy();
      const pos = (lesson!.variants ?? []).find((variant) => variant.label === "肯定");
      expect(pos, `${id} 应有「肯定」格`).toBeTruthy();
      expect(pos!.en.trim().endsWith("?"), `${id} 的「肯定」格确实是问句——极性判据会误报，故不采用`).toBe(true);
      // 结构判据必须照常放行
      const labels = (lesson!.variants ?? []).map((variant) => variant.label);
      expect(["肯定", "否定", "疑问"].every((want) => labels.includes(want as never))).toBe(true);
      seen += 1;
    }
    expect(seen, "自检须真的核到那几课").toBe(3);
  });
});

/**
 * sceneSwings 的「场景标题 ↔ 句子」一致性守门（2026-09-23 批五十一新增）。
 *
 * 背景：`sceneSwings[]` 有三个字段——`sceneZh`（场景标题，「文具店里，你指着货架说」）、
 * `en`（该场景要说的英文）、`zh`（它的译文）。前几轮的守门只核了 `en ↔ zh`，
 * **从没核过 `sceneZh` 与句子说的是不是同一件事**——于是留了这么一个口子：
 *
 *   实测抓到 6 处标题与句子各说各的（均为句子被换掉、标题忘了跟着改）：
 *   - L12「答应朋友明天一起去**公园**」↔ `We will go to the **zoo** tomorrow.`
 *   - L69「请同桌关一下**门**」↔ `Would you mind closing the **window**?`
 *   - L167「说她有很多**作业**」↔ `She has a lot of **friends**.`
 *   - L173「说她为了**通过考试**努力学习」↔ `She gets up early in order to **catch the bus**.`
 *   - L177「说她更喜欢**走路**」↔ `She prefers **tea** to coffee.`
 *   - L183「说需要买点**牛奶**（第 161 课）」↔ `I need to buy some **bread**.`
 *   用户看到标题预期的句子与给出的英文对不上，标题里的「（第 161 课）」引用也随之失效。
 *
 * 判据（**同类不同物**）：sceneZh 与 zh 各自点到**同一语义类别**里的**不同词**。
 *
 * ⚠️ 已评估并**放弃**的判据（记录以免后人重试）：
 * 「sceneZh 提到的名词必须出现在 zh 里」——615 对里刷出 49 条误报。
 * 根因：sceneZh 是**场景设置**，句子的 zh 是**译文**，场景天然可以不说句中的名词
 * （「放学铃响，你收书包」配「我回家。」完全正常）。只有「都点到了同一槽位却各说各的」
 * 才是矛盾，故收紧为同类不同物。
 *
 * 另外豁免两类正常情形（否则误报 3 处）：
 *  1. sceneZh 里的人称是**在场的另一个人**且作施动者
 *     （「操场边，同学问那个高个子是谁」配「他是我的老师。」——两方对话，不矛盾）；
 *  2. 同类词在 sceneZh 里是**环境/道具**而非句子对象
 *     （「厨房里，你收拾碗时手一滑」配「我把杯子打碎了。」——碗是场景，杯子才是对象）。
 *     这类靠 allowlist 显式登记，登记处须写明理由。
 */
describe("sceneSwings 场景标题 ↔ 句子一致性守门", () => {
  /** 语义类别 → 该类别里的词。只有**同类别**才能构成「同类不同物」矛盾。 */
  const CATEGORIES: Record<string, string[]> = {
    门与窗: ["门", "窗", "窗户", "房门", "大门"],
    地点: ["公园", "动物园", "学校", "商店", "图书馆", "医院", "银行", "海边", "操场", "厨房", "家里", "书店"],
    食物: ["苹果", "茶", "咖啡", "牛奶", "蛋糕", "面条", "鸡蛋", "汉堡", "汤", "面包", "米饭", "橘子", "糖果"],
    器皿: ["杯子", "碗", "盘子", "盒子", "瓶子"],
    文具: ["书", "钢笔", "铅笔", "尺子", "本子", "笔记本", "橡皮", "作业", "功课"],
    人物: ["妈妈", "爸爸", "哥哥", "姐姐", "弟弟", "妹妹", "老师", "同学", "朋友", "医生", "护士", "奶奶", "爷爷", "外婆", "外公"],
    动物: ["猫", "狗", "鸟", "鱼"],
    载具: ["自行车", "汽车", "公交车", "火车", "飞机", "出租车"],
    家电: ["电话", "电视", "手机", "电脑", "冰箱"],
    运动: ["足球", "篮球", "球", "游泳", "跑步"],
    天气: ["雪", "雨", "风", "云", "太阳", "月亮"]
  };

  /**
   * 已核定的正常情形：「场景道具/在场他人」而非句子对象。
   * 每条都必须写清为什么不算矛盾——**不要为了消警而往这里加条目**。
   */
  const EXEMPT: Record<string, string> = {
    "lesson-02-is sceneSwings[1]":
      "「照片前，小美指给朋友看家人」——朋友是看照片的人，句子说的是照片里那位（妈妈），属在场他人。",
    "lesson-23-have-lost sceneSwings[1]":
      "「厨房里，你收拾碗时手一滑」——碗是场景道具（正在收拾的东西），句子对象是打碎的杯子。",
    "lesson-02-is sceneSwings[2]":
      "「操场边，同学问那个高个子是谁」——同学是提问的人，句子说的是被问的那位（老师），属在场他人。"
  };

  /**
   * 「说…」型标题的名词必须落到句子里。
   *
   * `sceneZh` 以「说」开头时（「说她有很多朋友」「说需要买点面包」），
   * 它**就是句子内容的简称**、不是场景铺陈——此时标题里的名词必须出现在
   * `en`（对应英文）或 `zh`（译文）里，否则标题与句子各说各的。
   *
   * 这是补上「同类不同物」规则的两处盲区（L167「作业」↔friends、
   * L173「通过考试」↔catch the bus——两词不在同一类别，category 规则看不见）。
   *
   * 精度实测：358 条「说…」型里仅 3 条命中，且逐条核对**均为正常改写**——
   * 「说起周末为什么没出门」的「门」是「出门」，「说妈妈的日常」用「她」代指妈妈，
   * 「说不下雨就出去玩」与「如果天晴」是同一件事的正反说法。故这 3 条登记豁免。
   */
  it("「说…」型标题里的名词必须落到句子里", () => {
    /** 中文名词 → 对应英文词干（用于判断该名词是否已在 en 里落地）。 */
    const NOUN_TO_EN: Record<string, string> = {
      门: "door", 窗: "window", 窗户: "window", 公园: "park", 动物园: "zoo", 学校: "school",
      商店: "shop", 图书馆: "library", 医院: "hospital", 银行: "bank", 海边: "beach",
      操场: "playground", 厨房: "kitchen", 苹果: "apple", 茶: "tea", 咖啡: "coffee",
      牛奶: "milk", 蛋糕: "cake", 面条: "noodle", 鸡蛋: "egg", 汉堡: "hamburger", 汤: "soup",
      面包: "bread", 米饭: "rice", 橘子: "orange", 糖果: "candy", 杯子: "cup", 碗: "bowl",
      盒子: "box", 瓶子: "bottle", 书: "book", 钢笔: "pen", 铅笔: "pencil", 尺子: "ruler",
      本子: "notebook", 作业: "homework", 妈妈: "mom", 爸爸: "dad", 哥哥: "brother",
      姐姐: "sister", 老师: "teacher", 同学: "classmate", 朋友: "friend", 医生: "doctor",
      护士: "nurse", 奶奶: "grandma", 爷爷: "grandpa", 猫: "cat", 狗: "dog", 鸟: "bird",
      自行车: "bike", 汽车: "car", 公交车: "bus", 火车: "train", 电话: "phone", 电视: "tv",
      电脑: "computer", 冰箱: "fridge", 足球: "football", 篮球: "basketball", 雪: "snow",
      雨: "rain", 风: "wind", 云: "cloud", 太阳: "sun", 月亮: "moon", 钥匙: "key",
      考试: "exam", 车: "bus", 钱: "money", 礼物: "gift", 伞: "umbrella", 电影: "movie"
    };

    /** 已核定的正常改写（每条都要写清理由，不要为消警而加）。 */
    const EXEMPT: Record<string, string> = {
      "lesson-20-because-so sceneSwings[1]":
        "「说起周末为什么没出门」——「门」是「出门」的一部分，不是独立名词。",
      "lesson-25-third-person sceneSwings[0]":
        "「说妈妈的日常」——句子用「她」代指妈妈，是正常的人称替换。",
      "lesson-48-if-rain sceneSwings[0]":
        "「说不下雨就出去玩」与「如果天晴，我们就去外面玩」是同一件事的正反说法。"
    };

    const offenders: string[] = [];
    let checked = 0;

    for (const lesson of grammarLessons) {
      (lesson.sceneSwings ?? []).forEach((swing, index) => {
        const key = `${lesson.id} sceneSwings[${index}]`;
        if (!swing.sceneZh?.startsWith("说") || !swing.en || !swing.zh) return;
        checked += 1;
        if (EXEMPT[key]) return;

        const enWords = swing.en.toLowerCase().match(/[a-z]+/g) ?? [];
        for (const [noun, stem] of Object.entries(NOUN_TO_EN)) {
          if (!swing.sceneZh.includes(noun)) continue;
          const stemBase = stem.length > 3 ? stem.slice(0, -1) : stem;
          const landedInEn = enWords.some((w) => w.startsWith(stemBase));
          const landedInZh = swing.zh.includes(noun);
          if (landedInEn || landedInZh) continue;
          offenders.push(
            `${lesson.id} sceneSwings[${index}]
` +
              `  场景标题「${swing.sceneZh}」提到「${noun}」
` +
              `  句子译文「${swing.zh}」（英文「${swing.en}」）
` +
              `  → 标题说的事没落到句子里（多半是句子换过、标题忘了改）`
          );
          break;
        }
      });
    }

    expect(checked, "本守门须至少核对 300 条「说…」型场景").toBeGreaterThanOrEqual(300);
    expect(offenders.slice(0, 10), `「说…」型标题与句子不符：\n${offenders.join("\n")}`).toEqual([]);
  });

  it("sceneZh 与句子 zh 不得各说各的（同类不同物）", () => {
    const offenders: string[] = [];
    let checked = 0;

    for (const lesson of grammarLessons) {
      (lesson.sceneSwings ?? []).forEach((swing, index) => {
        const key = `${lesson.id} sceneSwings[${index}]`;
        if (!swing.sceneZh || !swing.zh) return;
        checked += 1;
        if (EXEMPT[key]) return;

        for (const [category, words] of Object.entries(CATEGORIES)) {
          const inScene = words.filter((w) => swing.sceneZh.includes(w));
          const inZh = words.filter((w) => swing.zh.includes(w));
          if (inScene.length === 0 || inZh.length === 0) continue;
          // 有交集（同一个词）就说明说的是同一件东西，正常
          const shared = inScene.some((w) => inZh.some((z) => z.includes(w) || w.includes(z)));
          if (shared) continue;
          offenders.push(
            `${lesson.id} sceneSwings[${index}]（类别：${category}）\n` +
              `  场景标题「${swing.sceneZh}」提到「${inScene.join("/")}」\n` +
              `  句子译文「${swing.zh}」提到「${inZh.join("/")}」\n` +
              `  英文「${swing.en}」\n` +
              `  → 标题与句子在说不同的东西（多半是句子换过、标题忘了改）`
          );
        }
      });
    }

    expect(checked, "本守门须至少核对 600 条带译文的 sceneSwings").toBeGreaterThanOrEqual(600);
    expect(offenders.slice(0, 10), `场景标题与句子矛盾：\n${offenders.join("\n")}`).toEqual([]);
  });
});

/**
 * 跨课引用核对守门（2026-09-23 批五十二新增）。
 *
 * 全库有 500+ 处「（第 N 课）」「第 N 课学过：X」，都在断言「这个说法来自第 N 课」。
 * 此前**从没验证过被引的那课真有这个说法**——上轮修 L183 时的教训正是这类：
 * 引用编号没错，但句子被换过，引用就成了误导（用户翻回去看不到那句）。
 *
 * 两种引用形态，判据不同：
 *
 *  R1「句子 + （第 N 课…）」——实测 175 处里 138 处是**精确引用**（被引课有原句），
 *     其余是**句式级引用**（被引课教的是该句式，句子本身不同）。
 *     判据：精确匹配（含词序无关）**或**与被引课句池共享至少一个实词。
 *
 *  R2「第 N 课学过：<中文>」——中文是口语化改写（「我正在读一本书」对应第 13 课的
 *     「我正在看书」，英文同是 I am reading a book.），**拿中文比会全是误报**
 *     （首版实测 55 条里 50+ 属此类）。改用**本题的英文答案**去被引课句池里找。
 *
 * ⚠️ 句池必须完整，否则会把「引用正确」误判成「引用错误」。实测补齐了四处缺口：
 *  - `contrast.correct`（被引句常在那里）
 *  - `bothRight` 卡的 `wrong` 字段（双正解时它装的也是**正确句**，
 *    如 L109 的 "She called as I was getting out of the bath."）
 *  - `deepDive` / `summary` 里内嵌的认读句
 *  - `blocks[].text`
 *
 * ⚠️ 已评估并放弃：要求「被引课必须有原句」。175 处里会有 37 处误报，
 * 因为它们引的是**句式**（「It is nice.（第 1 课）」指的是第 1 课的 be 动词搭档，
 * 第 1 课原句是 I am happy. 一类的 I am 句）。故改为「精确 或 共享实词」。
 */
describe("跨课引用核对守门（（第 N 课）↔ 被引课内容）", () => {
  const normEn = (v: string) =>
    v.toLowerCase().replace(/[.,!?;:'"’‘]/g, "").replace(/\s+/g, " ").trim();
  /** 词序无关键：Yesterday I went to the park. 与 I went to the park yesterday. 视为同句。 */
  const bagOf = (v: string) => normEn(v).split(" ").filter(Boolean).sort().join(" ");

  /** 功能词不算「实词交集」的依据。 */
  const STOP = new Set(
    `a an the i you he she it we they me him her us them my your his its our their this that these those
     is am are was were be been do does did not no yes to of in on at for with and or but so very much many
     there here what where when how who whose which if will would can could may might must should shall
     have has had got some any all just now today tomorrow yesterday please thank thanks`
      .split(/\s+/)
      .filter(Boolean)
  );
  const contentWords = (v: string) =>
    new Set(
      normEn(v)
        .split(" ")
        .map((w) => w.replace(/[^a-z]/g, ""))
        .filter((w) => w.length >= 3 && !STOP.has(w))
    );
  const stem = (w: string) => w.replace(/(ing|ed|es|s)$/, "");

  it("「（第 N 课）」引用的句子必须与被引课对得上（精确 或 共享实词）", () => {
    const byNumber = new Map<number, (typeof grammarLessons)[number]>();
    for (const l of grammarLessons) byNumber.set(l.number, l);

    /** 被引课的英文句池（含词序无关键）。 */
    const pools = new Map<number, { en: Set<string>; bag: Set<string> }>();
    for (const l of grammarLessons) {
      const en = new Set<string>();
      const bag = new Set<string>();
      const add = (s?: string) => {
        if (!s?.trim()) return;
        en.add(normEn(s));
        bag.add(bagOf(s));
      };
      add(l.targetSentence);
      for (const e of l.examples ?? []) add(e.en);
      for (const v of l.variants ?? []) add(v.en);
      for (const s of l.sceneSwings ?? []) add(s.en);
      for (const d of l.dialogue ?? []) add(d.en);
      add(l.dialogueEn);
      for (const c of l.contrast ?? []) {
        add(c.correct);
        // 双正解卡的 wrong 字段装的也是**正确句**
        if (c.bothRight) add(c.wrong);
      }
      for (const b of l.blocks ?? []) add(b.text);
      for (const g of l.guided ?? []) {
        add(g.answer);
        if (g.kind === "choose") add(`${g.before ?? ""} ${g.answer} ${g.after ?? ""}`);
      }
      for (const p of l.practice ?? []) add(p.answer);
      if (l.recall) add(l.recall.answer);
      // deepDive / summary 里内嵌的认读句
      const prose = [...(l.deepDive?.paragraphs ?? []), ...(l.summary?.points ?? []), l.summary?.rule ?? ""].join("\n");
      for (const m of prose.matchAll(/[A-Z][A-Za-z'’,.?!\s]{6,}?[.?!](?=\s|$|——)/g)) add(m[0]);
      for (const m of prose.matchAll(/([A-Z][A-Za-z'’,.?!\s]{6,}?)\s*——/g)) add(m[1]);
      en.delete("");
      bag.delete("");
      pools.set(l.number, { en, bag });
    }

    const sharesContentWord = (cited: string, pool: { en: Set<string> }): boolean => {
      const citedStems = new Set([...contentWords(cited)].map(stem));
      if (citedStems.size === 0) return true; // 全是功能词，无从判，放过
      for (const s of pool.en) for (const w of contentWords(s)) if (citedStems.has(stem(w))) return true;
      return false;
    };

    /**
     * 已核定的**句式级引用**：被引课教的正是该句式，只是句子本身不同。
     * 每条都逐条核对过被引课的 grammarLabel——**不要为消警而加条目**。
     */
    const PATTERN_REFS: Record<string, string> = {
      "lesson-125-it-looks-nice examples[2]": "第 1 课是 be 动词课（grammarLabel「be 动词 · I am」），引的是 is 的搭档关系。",
      "lesson-125-it-looks-nice examples[3]": "第 58 课是 -ly 课，同课有 She is quick.（is + 特点词），引的是这个对照面。",
      "lesson-128-it-sounds-great examples[3]": "第 1 课是 be 动词课，同上一处。",
      "lesson-139-although examples[2]": "第 19 课是连词课（and / but），引的是 but 的用法。",
      "lesson-139-although examples[3]": "第 12 课是 will 将来时课，引的是 will 的用法。",
      "lesson-190-learning-to-swim examples[2]": "第 13 课是「am/is/are + 动词ing」课，引的是这个进行时句式。",
      "lesson-191-walked-into examples[2]": "第 18 课是 in / on / at 课，引的是 in the kitchen 这个地点用法。",
      "lesson-205-by-the-time examples[1]": "第 178 课是「had + 做过版」课，引的是这个更早时态句式。"
    };

    const offenders: string[] = [];
    let checked = 0;

    for (const lesson of grammarLessons) {
      const fields: Array<{ where: string; en: string; zh: string }> = [];
      (lesson.examples ?? []).forEach((e, i) => fields.push({ where: `examples[${i}]`, en: e.en, zh: e.zh }));
      (lesson.variants ?? []).forEach((v, i) => fields.push({ where: `variants[${i}]`, en: v.en, zh: v.zh }));
      (lesson.sceneSwings ?? []).forEach((s, i) => fields.push({ where: `sceneSwings[${i}]`, en: s.en, zh: s.zh }));

      for (const f of fields) {
        const m = f.zh.match(/（第\s*(\d+)\s*课/);
        if (!m) continue;
        const num = Number(m[1]);
        checked += 1;
        if (PATTERN_REFS[`${lesson.id} ${f.where}`]) continue;
        const pool = pools.get(num);
        if (!pool) {
          offenders.push(`${lesson.id} ${f.where}: 引用了不存在的「第 ${num} 课」`);
          continue;
        }
        if (pool.en.has(normEn(f.en)) || pool.bag.has(bagOf(f.en))) continue;
        if (sharesContentWord(f.en, pool)) continue;
        offenders.push(
          `${lesson.id} ${f.where} 声称来自第 ${num} 课\n` +
            `    句子「${f.en}」\n` +
            `    但第 ${num} 课既没有这句、也没有共享的实词（引用可能指错了课）`
        );
      }
    }

    expect(checked, "本守门须至少核对 150 处「（第 N 课）」引用").toBeGreaterThanOrEqual(150);
    expect(offenders.slice(0, 10), `跨课引用对不上：\n${offenders.join("\n")}`).toEqual([]);
  });
});

/**
 * 「同一英文词在全库的译法不得自相矛盾」守门（2026-09-23 批五十三新增）。
 *
 * 起点是这轮抓到的一处真错：`brother` 全库 6 处译「哥哥」，
 * 只有 L130 引用 L52 那句时写成「蛋糕被我**弟弟**吃了」——
 * 同一句英文在两课配出了不同亲属称谓，用户对照两课会看到矛盾。
 *
 * 与「同一句英文配不同中文」的区别：**粒度收到词级**。
 * 句级比对在数据干净后全是措辞差异（「背包/书包」「很冷/冷」），误报 35 组；
 * 但**词级**比对是收敛的——一个英文词的译法本来就不该有几种。
 *
 * ⚠️ 只收「一义一词」的实词（亲属称谓、动物、常见物品）。
 * 不收多义词（如 `light` 可译「轻」也可译「灯」、`right` 可译「右」也可译「对」），
 * 那些合法多译会造成大量误报。
 */
describe("「同一英文词译法一致性」守门", () => {
  /**
   * 一义一词的实词：英文词 → 允许的中文译法集合。
   * 这些词在教材语境里只有一种对应说法，出现第二种即为不一致。
   */
  const SINGLE_SENSE: Array<{ en: string; allowed: string[]; note: string }> = [
    { en: "brother", allowed: ["哥哥", "兄弟"], note: "教材统一作「哥哥」（brother 不分长幼，但全库已定这一个说法）；「兄弟」= 集合义（我没有兄弟），合法" },
    { en: "sister", allowed: ["姐姐", "姐妹"], note: "教材统一作「姐姐」；「姐妹」= 集合义" },
    { en: "grandma", allowed: ["奶奶"], note: "教材统一作「奶奶」" },
    { en: "grandpa", allowed: ["爷爷"], note: "教材统一作「爷爷」" },
    { en: "mom", allowed: ["妈妈"], note: "教材统一作「妈妈」" },
    { en: "dad", allowed: ["爸爸"], note: "教材统一作「爸爸」" },
    { en: "teacher", allowed: ["老师"], note: "无歧义" },
    { en: "student", allowed: ["学生", "全班"], note: "「全班」是集合指代" },
    { en: "doctor", allowed: ["医生"], note: "无歧义" },
    { en: "nurse", allowed: ["护士"], note: "无歧义" },
    { en: "cat", allowed: ["猫"], note: "无歧义" },
    { en: "dog", allowed: ["狗"], note: "无歧义" },
    { en: "bird", allowed: ["鸟"], note: "无歧义" },
    { en: "apple", allowed: ["苹果"], note: "无歧义" },
    { en: "banana", allowed: ["香蕉"], note: "无歧义" },
    { en: "orange", allowed: ["橘子", "橙子"], note: "两种水果名都可" },
    { en: "umbrella", allowed: ["伞"], note: "无歧义" },
    { en: "key", allowed: ["钥匙"], note: "无歧义" },
    { en: "window", allowed: ["窗"], note: "无歧义" },
    { en: "door", allowed: ["门"], note: "无歧义" },
    { en: "fridge", allowed: ["冰箱"], note: "无歧义" },
    { en: "library", allowed: ["图书馆"], note: "无歧义" },
    { en: "hospital", allowed: ["医院"], note: "无歧义" },
    { en: "bank", allowed: ["银行"], note: "无歧义" },
    { en: "bike", allowed: ["自行车"], note: "教材统一作「自行车」（不写「单车」）" },
    { en: "bus", allowed: ["公交车", "巴士"], note: "两种说法都可" },
    { en: "train", allowed: ["火车"], note: "无歧义" },
    { en: "umbrella", allowed: ["伞"], note: "无歧义" },
    { en: "cake", allowed: ["蛋糕"], note: "教材统一作「蛋糕」（点心是泛指）" }
  ];

  /** 从中文里抽出可与英文词对齐的实义词（失败返回 null = 该处不参与判定）。 */
  const translationOf = (en: string, zh: string): string[] => {
    const cleaned = zh.replace(/（[^）]*）|\([^)]*\)/g, "").replace(/轮到你说了[——-]*/g, "");
    const found: string[] = [];
    for (const { en: word, allowed } of SINGLE_SENSE) {
      if (word !== en) continue;
      for (const a of allowed) if (cleaned.includes(a)) found.push(a);
    }
    return found;
  };

  it("单义词的译法在全库应一致（brother 不得一处「哥哥」一处「弟弟」）", () => {
    const offenders: string[] = [];
    let checked = 0;

    for (const { en, allowed, note } of SINGLE_SENSE) {
      // 收集全库该词出现的「中英对」
      const pairs: Array<{ lessonId: string; where: string; zh: string }> = [];
      const words = new Set([en, `${en}s`, `${en}es`]);
      const hasWord = (text: string) => {
        const ws = text.toLowerCase().replace(/[.,!?;:'"’‘]/g, "").split(/\s+/);
        return ws.some((w) => words.has(w));
      };

      for (const lesson of grammarLessons) {
        const add = (where: string, e?: string, zh?: string) => {
          if (!e || !zh) return;
          if (!hasWord(e)) return;
          pairs.push({ lessonId: lesson.id, where, zh });
        };
        (lesson.examples ?? []).forEach((x, i) => add(`examples[${i}]`, x.en, x.zh));
        (lesson.variants ?? []).forEach((x, i) => add(`variants[${i}]`, x.en, x.zh));
        (lesson.sceneSwings ?? []).forEach((x, i) => add(`sceneSwings[${i}]`, x.en, x.zh));
        (lesson.practice ?? []).forEach((x, i) => add(`practice[${i}]`, x.answer, x.promptZh));
        if (lesson.recall) add("recall", lesson.recall.answer, lesson.recall.intentZh);
      }

      /**
       * 判据：**是否出现了 allowed 之外的译法**。
       *
       * 首版写成「用了不止一种译法就报」，结果 brother 的「哥哥 / 兄弟」
       * 两词（后者是集合义的合法变体）也被判为矛盾——判据本身错了。
       * 正确的判据是「越界」：allowed 里没列的说法才是不一致
       *（如 L130 曾把 `my brother` 写成「我弟弟」）。
       */
      checked += 1;
      const outOfRange = new Set<string>();
      /**
       * 与该词同义、但**会与另一个英文词混淆**的译法——出现才算越界。
       *
       * ⚠️ 判据要窄：中文分长幼而英文不分（brother 不分哥弟、sister 不分姐妹、
       * grandma 不分奶奶外婆），这些是**合法的一义多译**，首版把它们全列为越界，
       * 刷出「sister 用了妹妹」「grandma 用了外婆」等 3 组误报。
       * 真正要拦的是**会造成跨词混淆**的译法：
       *   - brother→「弟弟」：会与 sister/younger 混，且全库已定「哥哥」；
       *   - bike→「车」：会与 car 混（L115 曾把 `a new bike` 写成「一辆新车」）；
       *   - cake→「点心」：会与 snack/dessert 混。
       */
      const RIVALS: Record<string, string[]> = {
        brother: ["弟弟"],
        bike: ["单车", "脚踏车"],
        cake: ["点心"]
      };
      const rivals = RIVALS[en] ?? [];
      const detail: string[] = [];
      for (const p of pairs) {
        const cleaned = p.zh.replace(/（[^）]*）|\([^)]*\)/g, "");
        const hit = rivals.filter((r) => cleaned.includes(r));
        // bike 特例：中文写「车」时，只要没写「自行车」就是与 car 混（L115 的原始缺陷）
        if (en === "bike" && /车/.test(cleaned) && !/自行车/.test(cleaned)) hit.push("车（未写「自行车」）");
        if (hit.length === 0) continue;
        hit.forEach((h) => outOfRange.add(h));
        detail.push(`    ${p.lessonId} ${p.where}: 用了「${hit.join("、")}」  ← 原句中文「${p.zh.slice(0, 44)}」`);
      }
      if (outOfRange.size === 0) continue;

      offenders.push(
        `「${en}」出现了核准之外的译法：${[...outOfRange].join("、")}\n` +
          `    核准：${note}\n${detail.join("\n")}`
      );
    }

    expect(
      offenders.slice(0, 5),
      `同一英文词的译法自相矛盾：\n${offenders.join("\n")}`
    ).toEqual([]);
  });
});
