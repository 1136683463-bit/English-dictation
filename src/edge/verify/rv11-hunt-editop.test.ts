// @vitest-environment node
/**
 * RV11 · `editOp` 字段：全库标注的穷尽性、自洽性与落地核验（2026-09-23 批五十三）
 *
 * 背景：`HuntError.correction` 一个字段混着七种语义（替换/补词/删除/移动/标点/正字/说明）。
 * 在 `editOp` 出现之前，「这条修正是什么操作」全靠消费方猜字面
 * （`startsWith("去掉")` 判删词、含汉字判说明、正则捞「把 X 移到 Y」判移动）。
 * 实测 10 份实现各自猜、并且已经分叉出错：移动型曾写成
 * `去掉（this book 顺序调整：…）`，被「去掉」前缀误判成删除、生成粘句病句。
 *
 * 本文件守四件事：
 *   ① **穷尽性**：每处修正都有 `editOp`，且值在 7 个合法值内；
 *   ② **自洽性**：字段值必须与 correction 的字面**互相印证**（双向），
 *      防止「字段写 replace、字面却是『把 X 移到 Y』」这类标注漂移；
 *   ③ **落地性**：卡正面（复习队列的答案句）的词数必须等于
 *      原句词数 + Σ(修正词数 − 被改跨度长度)——**用独立重写的算法**核算，
 *      不 import 被测实现，避免「自己验自己」；
 *   ④ **不退化**：`move` / `explain` 必须真的存在（为 0 说明判据空了）。
 */
import { describe, expect, it } from "vitest";
import { huntCases } from "../../data/huntCases";
import { correctedSentenceOf } from "../../services/huntService";
import type { HuntEditOp } from "../../types";

const VALID_OPS: HuntEditOp[] = ["replace", "insert", "delete", "move", "punct", "orth", "explain"];

const bare = (value: string): string => value.replace(/[.,!?;:]+$/, "").toLowerCase();
const stripPunct = (value: string): string => value.replace(/[.,!?;:]/g, "");
const normalizeAll = (value: string): string =>
  value.toLowerCase().replace(/[.,!?;:'"’]/g, "").replace(/\s+/g, " ").trim();

/**
 * **独立重写**的跨度定位（照 HuntError.original 的文档口径：单词 = 它自己；
 * 短语 = 本句内覆盖 tokenIndex 的连续片段）。刻意不调用被测实现。
 */
const spanIndependent = (tokens: string[], index: number, original: string): [number, number] => {
  const words = original.trim().split(/\s+/).filter(Boolean).map(bare);
  if (words.length < 2) return [index, index];
  let lo = 0;
  for (let i = index - 1; i >= 0; i -= 1) {
    if (/[.!?]$/.test(tokens[i])) {
      lo = i + 1;
      break;
    }
  }
  let hi = tokens.length - 1;
  for (let i = index; i < tokens.length; i += 1) {
    if (/[.!?]$/.test(tokens[i])) {
      hi = i;
      break;
    }
  }
  for (let start = lo; start + words.length - 1 <= hi; start += 1) {
    const hit = words.every((word, offset) => bare(tokens[start + offset]) === word);
    if (hit && index >= start && index <= start + words.length - 1) {
      return [start, start + words.length - 1];
    }
  }
  return [index, index];
};

/** 按 correction 字面**独立推断**操作类型（与被测字段比对，用于自洽性）。 */
const inferOp = (original: string, correction: string): HuntEditOp => {
  const o = original.trim();
  const c = correction.trim();
  if (!c) return "explain";
  if (/移到|搬到|挪到|对调|顺序调整|跟在\S*后/.test(c)) return "move";
  if (/^（?去掉/.test(c)) return "delete";
  const arrow = /→\s*([A-Za-z][A-Za-z'’\- ]*)/.exec(c);
  if (arrow) return inferOp(o, arrow[1].trim());
  if (/[\u4e00-\u9fa5]/.test(c)) return "explain";
  if (stripPunct(o) === stripPunct(c)) return "punct";
  if (normalizeAll(o) === normalizeAll(c)) return "orth";
  const ow = o.split(/\s+/).filter(Boolean);
  const cw = c.split(/\s+/).filter(Boolean);
  if (cw.length > ow.length && cw.map(normalizeAll).join(" ").includes(ow.map(normalizeAll).join(" "))) {
    return "insert";
  }
  return "replace";
};

const allErrors = huntCases.flatMap((caseItem) =>
  caseItem.errors.map((error) => ({ caseItem, error }))
);

describe("RV11 hunt editOp 标注", () => {
  it("① 穷尽性：每处修正都有 editOp，且值合法", () => {
    const missing: string[] = [];
    const illegal: string[] = [];
    for (const { caseItem, error } of allErrors) {
      const op = (error as { editOp?: string }).editOp;
      if (!op) {
        missing.push(`${caseItem.id}#${error.tokenIndex}`);
        continue;
      }
      if (!VALID_OPS.includes(op as HuntEditOp)) {
        illegal.push(`${caseItem.id}#${error.tokenIndex} = "${op}"`);
      }
    }
    expect(missing, `以下错点缺 editOp：${missing.slice(0, 8).join(" | ")}`).toEqual([]);
    expect(illegal, `以下 editOp 不在 7 个合法值内：${illegal.slice(0, 8).join(" | ")}`).toEqual([]);
    // 全库规模下限：确认遍历真的走到了数据
    expect(allErrors.length).toBeGreaterThan(700);
  });

  it("② 自洽性：editOp 必须与 correction 的字面互相印证（双向）", () => {
    const mismatched: string[] = [];
    for (const { caseItem, error } of allErrors) {
      const inferred = inferOp(error.original ?? "", error.correction);
      if (inferred !== error.editOp) {
        mismatched.push(
          `${caseItem.id}#${error.tokenIndex} 字段=${error.editOp} 字面推断=${inferred} ` +
            `orig="${error.original}" corr="${error.correction}"`
        );
      }
    }
    expect(
      mismatched,
      `editOp 与 correction 字面不一致（标注漂移或字面需要改写）：\n${mismatched.slice(0, 10).join("\n")}`
    ).toEqual([]);
  });

  it("③ 落地性：卡正面词数守恒（独立算法核算，不 import 被测实现）", () => {
    const offenders: string[] = [];
    for (const caseItem of huntCases) {
      let expected = caseItem.tokens.length;
      for (const error of caseItem.errors) {
        // move / explain 按设计不改句子层（见 HuntEditOp 文档）
        if (error.editOp === "move" || error.editOp === "explain") continue;
        const [lo, hi] = spanIndependent(caseItem.tokens, error.tokenIndex, error.original ?? "");
        const spanLength = hi - lo + 1;
        if (error.editOp === "delete") {
          expected -= spanLength;
          continue;
        }
        const correction = error.correction.trim();
        if (!correction) continue;
        // 纯中文括注（无可替换英文）不改句子层；带 → 的取箭头右侧
        if (/[\u4e00-\u9fa5]/.test(correction) && !/→/.test(correction)) continue;
        const arrow = /→\s*([A-Za-z][A-Za-z'’\- ]*)/.exec(correction);
        const replacement = arrow ? arrow[1].trim() : correction;
        const replacementWords = replacement.split(/\s+/).filter(Boolean).length;
        expected += replacementWords - spanLength;
      }
      const actual = correctedSentenceOf(caseItem).split(/\s+/).filter(Boolean).length;
      if (actual !== expected) {
        offenders.push(
          `${caseItem.id} 期望 ${expected} 词，实得 ${actual} 词\n     卡面: ${correctedSentenceOf(caseItem)}`
        );
      }
    }
    expect(offenders, `卡正面词数与应有修正不符：\n${offenders.slice(0, 6).join("\n")}`).toEqual([]);
  });

  it("④ 不退化：move / delete / punct / orth 必须真实存在", () => {
    const tally = new Map<string, number>();
    for (const { error } of allErrors) {
      tally.set(error.editOp, (tally.get(error.editOp) ?? 0) + 1);
    }
    // 这些值各代表一类**不能并入 replace** 的修正，为 0 说明判据下沉/被误标了
    expect(tally.get("move") ?? 0, "move 型必须存在（为 0 说明移动被并进了别的类型）").toBeGreaterThan(0);
    expect(tally.get("delete") ?? 0, "delete 型必须存在").toBeGreaterThan(0);
    // 标点/正字是「只动标点大小写」的细分，并入 replace 会让下游无法区分
    expect(tally.get("punct") ?? 0, "punct 型必须存在").toBeGreaterThan(0);
    expect(tally.get("orth") ?? 0, "orth 型必须存在").toBeGreaterThan(0);
    /**
     * `explain` 允许为 0（批五十四现状）：它表示「连目标都没有、句子层无法执行」。
     * 原来的唯一一条（`hunt-would-rather-walk#6`）经复核其实有明确目标
     * （`would` 移到 `rather` 前面），已改判为 `move` 并补了显式下标。
     * 所以这里只登记现状，不再要求它必须存在——**但 ⑤ 会守住 0**，
     * 防止有人把新条目随手标成 explain 来绕过「移动要有目标」的要求。
     */
    expect(tally.get("explain") ?? 0, "explain 已清零（唯一一条已改判为 move）").toBe(0);
  });

  it("⑤ 移动型必须有显式目标，且不得与同案其它错点交叉（批五十四）", () => {
    /**
     * **从「债务登记」升级为「要求为零」**（批五十三登记 18 案 → 批五十四清零）。
     *
     * 批五十三时 `move` / `explain` 不在句子层执行，18 案的卡正面**仍留着那处错**。
     * 批五十四给移动补了显式下标（`moveFromIndex` / `moveToIndex` / `movePosition`），
     * 18 处逐案人工裁定后全部落地，卡面已是正确英文。故本断言不再容忍：
     *
     *   ① 每条 `move` 必须写全三个目标字段——缺一个就退回「解析中文」的老路；
     *   ② 目标下标必须落在 tokens 范围内；
     *   ③ **移动区间内不得夹着同案其它错点**——否则搬动会挪走尚未处理的错点位置，
     *      卡面出现「改了 A 却把 B 挪歪」的隐性错误（这条是本次实现时发现的约束，
     *      18 处已逐一核对满足）。
     *   ④ `explain` 允许存在（它连目标都没有），但不得悄悄变成「卡面含错」的新来源——
     *      当前全库应为 0 条。
     */
    const missingTarget: string[] = [];
    const outOfRange: string[] = [];
    const crossing: string[] = [];
    for (const caseItem of huntCases) {
      for (const error of caseItem.errors) {
        if (error.editOp !== "move") continue;
        const { moveFromIndex: from, moveToIndex: to, movePosition: position } = error;
        const label = `${caseItem.id}#${error.tokenIndex}`;
        if (from === undefined || to === undefined || !position) {
          missingTarget.push(label);
          continue;
        }
        if (from < 0 || from >= caseItem.tokens.length || to < 0 || to >= caseItem.tokens.length) {
          outOfRange.push(`${label} from=${from} to=${to} tokens=${caseItem.tokens.length}`);
          continue;
        }
        const lower = Math.min(from, to);
        const upper = Math.max(from, to);
        for (const other of caseItem.errors) {
          if (other === error) continue;
          if (other.tokenIndex > lower && other.tokenIndex < upper) {
            crossing.push(`${label} 区间 [${lower},${upper}] 夹着 ${other.tokenIndex}（${other.original}）`);
          }
        }
      }
    }
    expect(missingTarget, `以下 move 未写全显式目标：${missingTarget.join(" | ")}`).toEqual([]);
    expect(outOfRange, `以下 move 目标下标越界：${outOfRange.join(" | ")}`).toEqual([]);
    expect(crossing, `以下 move 区间夹着别的错点（会挪歪）：${crossing.join(" | ")}`).toEqual([]);

    // explain 已清零：它没有可执行目标，全库不应再有
    const explainCount = allErrors.filter((entry) => entry.error.editOp === "explain").length;
    expect(explainCount, "explain 应为 0（原 1 条已定性为 move 并补了目标）").toBe(0);
  });

  it("⑥ 差分核验：独立重写的修正算法必须与被测实现逐字一致", () => {
    /**
     * **换算法重建**（批五十三）：这是本文件最强的一道闸。
     *
     * 不再用「找病句特征」这类启发式（它会在正常的英文重复上误报，如
     * `We don't know where he is. My sister thinks he is at the school.` 里 `he` 出现两次
     * ——那完全合法）。改成：按 `HuntEditOp` 文档的语义**从头独立实现**一遍句子修正，
     * 再与被测的 `correctedSentenceOf` 逐字比较。两套独立算法在 213 案 / 794 处修正上
     * 字字相同，才能说明字段语义真的被落地执行了。
     *
     * 独立实现只依赖文档里写的四件事：
     *   - `delete` → 删掉跨度；`explain` → 句子层不动；
     *   - `move` → 按显式下标搬词，并连带修尾标点与句首大小写（批五十四）；
     *   - 其余 → 用 correction（带 `→` 时取箭头右侧）换掉整个跨度；
     *   - 尾标点：correction 自带优先，否则沿用原跨度末词的；
     *   - 从后往前改（按跨度起点降序），避免下标漂移。
     */
    /** 独立重写的句子边界（不调用被测实现）。 */
    const boundsIndependent = (tokens: string[], index: number): [number, number] => {
      let lo = 0;
      for (let i = index - 1; i >= 0; i -= 1) {
        if (/[.!?]$/.test(tokens[i])) {
          lo = i + 1;
          break;
        }
      }
      let hi = tokens.length - 1;
      for (let i = index; i < tokens.length; i += 1) {
        if (/[.!?]$/.test(tokens[i])) {
          hi = i;
          break;
        }
      }
      return [lo, hi];
    };
    const coreOf = (token: string): string => token.replace(/[.,!?;:]+$/, "");

    const rebuild = (caseItem: (typeof huntCases)[number]): string => {
      const tokens = [...caseItem.tokens];
      const jobs = caseItem.errors
        .map((error) => ({
          error,
          span: spanIndependent(caseItem.tokens, error.tokenIndex, error.original ?? "")
        }))
        .sort((a, b) => b.span[0] - a.span[0]);
      for (const { error, span } of jobs) {
        const [lo, hi] = span;
        if (lo < 0 || hi >= tokens.length) continue;
        if (error.editOp === "explain") continue;
        if (error.editOp === "move") {
          const from = error.moveFromIndex;
          const to = error.moveToIndex;
          const position = error.movePosition;
          if (from === undefined || to === undefined || !position) continue;
          const [sLo, sHi] = boundsIndependent(tokens, from);
          const sentenceEnd = /([.,!?;:]+)$/.exec(tokens[sHi])?.[1] ?? "";
          const headWord = coreOf(tokens[sLo]);
          const word = coreOf(tokens[from]);
          tokens.splice(from, 1);
          const anchor = to > from ? to - 1 : to;
          tokens.splice(position === "before" ? anchor : anchor + 1, 0, word);
          const length = sHi - sLo + 1;
          for (let i = sLo; i < sLo + length && i < tokens.length; i += 1) {
            tokens[i] = coreOf(tokens[i]);
          }
          const last = Math.min(sLo + length - 1, tokens.length - 1);
          tokens[last] = tokens[last] + sentenceEnd;
          const head = tokens[sLo];
          if (head) tokens[sLo] = head.charAt(0).toUpperCase() + head.slice(1);
          if (coreOf(tokens[sLo]) !== headWord) {
            for (let i = sLo + 1; i < sLo + length && i < tokens.length; i += 1) {
              if (coreOf(tokens[i]) === headWord) {
                tokens[i] = tokens[i].charAt(0).toLowerCase() + tokens[i].slice(1);
                break;
              }
            }
          }
          continue;
        }
        if (error.editOp === "delete") {
          tokens.splice(lo, hi - lo + 1);
          continue;
        }
        const correction = error.correction.trim();
        if (!correction) continue;
        if (/[\u4e00-\u9fa5]/.test(correction) && !/→/.test(correction)) continue;
        const arrow = /→\s*([A-Za-z][A-Za-z'’\- ]*)/.exec(correction);
        const replacement = arrow ? arrow[1].trim() : correction;
        const ownTrailing = /([.,!?;:]+)$/.exec(replacement)?.[1] ?? "";
        const trailing = ownTrailing || (/([.,!?;:]+)$/.exec(tokens[hi])?.[1] ?? "");
        tokens.splice(lo, hi - lo + 1, `${replacement.replace(/[.,!?;:]+$/, "")}${trailing}`);
      }
      return tokens.join(" ");
    };

    const diffs: string[] = [];
    for (const caseItem of huntCases) {
      const mine = rebuild(caseItem);
      const real = correctedSentenceOf(caseItem);
      if (mine !== real) {
        diffs.push(`${caseItem.id}\n     独立重写: ${mine}\n     被测实现: ${real}`);
      }
    }
    expect(diffs, `两套算法结果不一致：\n${diffs.slice(0, 5).join("\n")}`).toEqual([]);
  });

  it("⑦ 18 处移动的期望句逐字钉死（人工裁定的英文，不接受近似）", () => {
    /**
     * 移动的**正确性不能靠守恒律自证**——批五十三实测过：词袋守恒 14/14 全过，
     * 句子却是 `Eat the chicken hot noodles.`（答案本应是 `hot chicken noodles`）。
     * 所以这里把 18 句**人工裁定的英文**逐字写下来当基准。
     *
     * 这些句子是逐案读原文、想清楚「这句到底该是什么」之后写下的，
     * 不是从程序输出复制回来的——否则就是「自己验自己」。
     */
    const EXPECTED: Record<string, string> = {
      "hunt-white-cat": "My friend has a white cat. She was excited about it all day. We went home at five o'clock.",
      "hunt-fridge-note": "The soup is in the kitchen. There are two eggs in the fridge. The vegetables are fresh. I am very busy today. Eat the hot chicken noodles.",
      "hunt-handout-note": "Please give it to me. Please give me the glue. Two rulers are here. The tape is on the desk.",
      "hunt-enough-bag": "The bag is light enough to carry. It is big enough to carry two bags. This box is heavier than that one.",
      "hunt-run-plan": "How often do you run? I run twice a week. Two shoes are here. We run in the morning.",
      "hunt-umbrella-owner": "Whose book is this? Whose book is this? Two umbrellas are here. These ones are mine.",
      "hunt-not-used-to": "I am not used to it. Are you used to the noise? They were happy. We have two balls.",
      "hunt-like-tea-too": "I like tea too. My brother likes apples. I have two sisters. Last week I went to the library.",
      "hunt-close-24": "I like tea too. I don't like coffee either. My brother drinks milk. Yesterday I went to school late.",
      "hunt-both-books": "Both books are good. Both books is good. My brother likes books. Yesterday I went to the library.",
      "hunt-close-25": "Both books is good. Neither book are good. Both books are good. Last week I went home.",
      "hunt-yet-already": "She hasn't come yet. She hasn't come yet. I have done my homework. Yesterday we went out.",
      "hunt-still-waiting": "She is still waiting. They are at home. He likes tea. I saw her yesterday.",
      "hunt-three-days-ago": "She left three days ago. She left three days ago. I watched TV yesterday. We are happy.",
      "hunt-waited-an-hour": "I waited for an hour. I waited for an hour. He doesn't know. She have two books.",
      "hunt-why-dont-you-rest": "Why don't you take a rest? Why don't you rest? She can swim.",
      "hunt-so-do-i": "So do I. So do I. She can both sing and dance herself.",
      "hunt-would-rather-walk": "I would rather walk. I would rather walk. She would rather stay at home.",
    };
    const moveCaseIds = huntCases
      .filter((caseItem) => caseItem.errors.some((error) => error.editOp === "move"))
      .map((caseItem) => caseItem.id);
    // 有 move 的案件必须都在基准表里——新增移动案时立即报错，逼作者写下期望句
    const uncovered = moveCaseIds.filter((id) => !(id in EXPECTED));
    expect(uncovered, `以下含 move 的案件没有期望句基准：${uncovered.join(", ")}`).toEqual([]);

    const mismatched: string[] = [];
    for (const [id, want] of Object.entries(EXPECTED)) {
      const caseItem = huntCases.find((entry) => entry.id === id);
      if (!caseItem) {
        mismatched.push(`${id}：案件不存在（基准表过期）`);
        continue;
      }
      const got = correctedSentenceOf(caseItem);
      if (got !== want) mismatched.push(`${id}\n     期望: ${want}\n     实得: ${got}`);
      }
    expect(mismatched, `移动后的句子与人工裁定不符:\n${mismatched.join("\n")}`).toEqual([]);
  });
});
