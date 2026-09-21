/**
 * 语法合法性闸（第三道）：拒绝病句。
 * 单字替换会产出「am want an umbrella.」这类形式合法但语法错误的结果——
 * 前五道闸只看「词是否学过 / 句子是否重复」，不看句子是否像英语。
 *
 * 本闸用一组结构规则挡住常见病句模式。
 */
const BAD_PATTERNS: [RegExp, string][] = [
  // be 动词连续 / 位置错乱
  [/^(am|is|are|was|were)\s+(want|like|go|have|has|make|play|read|eat|do|does|draw|sing|run|sleep|watch|come|get|help|keep|let|put|take|give|pass|finish|enjoy|look|sound|smell|taste|feel)\b/i, "be 动词后直接跟动词原形"],
  [/^(am|is|are)\s+(is|are|am|was|were)\b/i, "两个 be 动词连用"],
  [/\b(is|are|am|was|were)\s+(is|are|am|was|were)\b/i, "两个 be 动词连用"],
  // 主语与 be 不匹配
  [/^i\s+(is|are|were)\b/i, "I 后应跟 am/was"],
  [/^(he|she|it)\s+(am|are|were)\b/i, "第三人称单数后应跟 is/was"],
  [/^(we|they|you)\s+(am|is)\b/i, "复数主语后应跟 are/were"],
  // 名词/专名当主语配错
  [/^(student|teacher|xiaomei|xiaoming|lin|tao|tom|amy)\s+(are|am|were)\b/i, "单数名词后应跟 is/was"],
  // 冠词后直接跟动词
  [/\b(a|an|the)\s+(is|are|am|was|were|go|goes|went|like|likes|want|wants)\b/i, "冠词后直接跟动词"],
  // 动词原形错误（三单位置）
  [/^(he|she|it)\s+(want|like|go|have|make|play|read|eat|do|draw|sing|run|sleep|watch|come|get|help|keep|look|feel|taste|smell|sound)\b/i, "第三人称单数未变形"],
  // 助动词后跟错形式
  [/\b(do|does|did|don't|doesn't|didn't)\s+(is|are|am|was|were|goes|went|likes|wants)\b/i, "助动词后应跟动词原形"],
  [/\b(will|can|must|should|could|would)\s+(is|are|am|was|were|goes|went|likes|wants)\b/i, "情态动词后应跟动词原形"],
  // 双动词无连接
  [/\b(want|like|go|have|make|play|read|eat|draw|sing|run|sleep|watch|come|get|help|keep)\s+(want|like|go|have|make|play|read|eat|draw|sing|run|sleep|watch|come|get|help|keep)\b/i, "两个动词原形直接相邻"],
  // 名词复数错误
  [/\b(a|an)\s+[a-z]+s\b/i, "a/an 后跟复数"],
  [/\b(two|three|four|five|six|seven|eight|nine|ten)\s+(book|pen|apple|cat|dog|cup|bag|bird)\b(?!s)/i, "数词后名词未复数"],
  // 大小写/标点
  [/^[a-z]/, "句首未大写"],
  // 空/残缺
  [/^(am|is|are|was|were)\.?$/i, "只剩 be 动词"],
];

export const checkGrammar = (sentence: string): string | null => {
  for (const [pattern, reason] of BAD_PATTERNS) {
    if (pattern.test(sentence)) return reason;
  }
  return null;
};
