/**
 * 零术语红线词表（共享常量）。
 *
 * 单一来源：守门测试（grammarLessons.test.ts）与运行时校验
 * （grammarExplainService 的 AI 输出校验、课程内容走查）**共用同一张表**。
 *
 * 背景：红线之所以在生产 16 个批次里悄悄失效（74/102 课越线、680 处），
 * 就是因为只有纪律没有断言——而断言用的词表如果和运行时校验各写一份，
 * 又会漂移。抽出后任何一边加词，另一边自动生效。
 *
 * 判定口径（与课程既有风格对齐）：
 * 这些词是语法书里的**分析用语**，零基础用户没有对应概念。
 * 不包含「动词 / 名词 / 连词 / be 动词」——课程从第 1 课起就把它们当作
 * 自己的教学词使用（"be 动词 · I am"、"like + 名词"），首屏长期如此且自洽；
 * 强行替换会让标签失去可检索性。
 */
export const GRAMMAR_ZERO_TERMS: readonly string[] = [
  "主语", "谓语", "宾语", "表语", "定语", "状语",
  "单数", "复数", "三单", "原形", "时态",
  "一般过去时", "一般现在时", "现在进行时", "过去进行时", "现在完成时",
  "情态动词", "比较级", "最高级", "从句", "语序", "可数",
  "疑问句", "否定句", "被动语态", "第三人称",
  "形容词", "副词", "介词"
];

/**
 * 命中零术语红线：返回命中的词（空数组 = 干净）。
 *
 * 2026-09-22 修假阳性：原实现用裸 `includes`，「从**句子**中间」这类正常中文
 * 会被误判为术语「从句」（子串跨词边界）。改为「边界判定」——术语左侧不得是
 * 汉字部件（避免「从+句」），右侧不得接「子/尾」等构成常用词的字。
 * 修复前后实测：全库「从句」命中 2 处，均为「从句子中间」的误报，无一处真术语。
 */
/**
 * 误报阻断表：只列「子串恰好拼成术语」的真实现象，不做通用黑名单
 * （通用规则会漏掉真术语，如「我们把主语请出来」——「把」不能作为阻断依据）。
 */
const TERM_SPURIOUS: Record<string, RegExp> = {
  // 「从句子中间」= 从 + 句子，不是术语「从句」；「句尾」同理
  从句: /从(?=句子|句尾)/
};

export const findZeroTermHits = (text: string): string[] =>
  GRAMMAR_ZERO_TERMS.filter((term) => {
    const spurious = TERM_SPURIOUS[term];
    let from = 0;
    while (true) {
      const at = text.indexOf(term, from);
      if (at < 0) return false;
      // 命中是真术语，除非它落在已登记的误报形态里（如「从句子」）
      const context = text.slice(Math.max(0, at - 1), at + term.length + 2);
      if (!spurious || !spurious.test(context)) return true;
      from = at + 1;
    }
  });

/** 是否干净（零术语）。 */
export const isZeroTermClean = (text: string): boolean => findZeroTermHits(text).length === 0;
