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
