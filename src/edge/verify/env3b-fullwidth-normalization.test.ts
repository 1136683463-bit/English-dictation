/**
 * ENV3-B · 中文输入法产出的全角字符 / 撇号 / 空格在答案比对里的覆盖度
 *
 * 用户是中文母语者，用中文输入法敲标点时天然是**全角**（，。！？""''）——
 * 哪怕在「英文句子」框里，句末句号也常是 U+3002「。」而不是 ASCII 「.」。
 * 撇号更麻烦：iOS / macOS 中文输入法的智能标点会给出 U+2019「’」而不是 ASCII「'」，
 * 而英文缩写（It's / don't）恰恰是最高频的考点。
 *
 * 两条判分管线口径不同，必须分开核对：
 * - `diffService.compareText / diffScore`（复习页、语法课产出段、语言门）——句级判分；
 * - `diffService.normalizeSpelling / compareLetters`（拼写页）——词级判分，**不走 foldFullWidth**；
 * - `lessonService.checkLessonTokens`（语法课词块题）——走 compareText 同一条归一化。
 *
 * 命名沿用 JD10 惯例：FAIL- = 确认缺陷，PASS- = 已验证安全。
 */
import { describe, expect, it } from "vitest";
import {
  compareLetters,
  compareText,
  diffScore,
  normalizeSpelling,
  spellingMatches,
  tokenSequencesEquivalent
} from "../../services/diffService";
import { checkLessonTokens, normalizeLessonSentence } from "../../services/lessonService";

/** 判一句（句级口径）的得分。 */
const scoreOf = (expected: string, answer: string, strict = false): number =>
  diffScore(compareText(expected, answer, strict));

describe("ENV3-B 句级判分：全角折叠覆盖度（compareText）", () => {
  const expected = "It's cold today.";

  it("PASS-B1 全角句号 / 逗号 / 问号 / 感叹号都折成半角，不被扣分", () => {
    for (const [label, answer] of [
      ["全角句号 。（U+3002，单独映射）", "It's cold today。"],
      ["全角逗号 、（U+3001，单独映射）", "It's cold today、"],
      ["全角问号 ？（U+FF1F，全角 ASCII 区）", "It's cold today？"],
      ["全角感叹号 ！（U+FF01，全角 ASCII 区）", "It's cold today！"],
      ["全角分号 ；（U+FF1B，全角 ASCII 区）", "It's cold today；"],
      ["全角冒号 ：（U+FF1A，全角 ASCII 区）", "It's cold today："]
    ] as Array<[string, string]>) {
      expect(scoreOf(expected, answer), label).toBe(100);
    }
  });

  it("PASS-B2 撇号四种形态都等价：ASCII ' / U+2019 ’ / U+2018 ‘ / 全角 ＇", () => {
    for (const [label, answer] of [
      ["ASCII '", "It's cold today."],
      ["U+2019 ’", "It’s cold today."],
      ["U+2018 ‘", "It‘s cold today."],
      ["全角 ＇", "It＇s cold today."]
    ] as Array<[string, string]>) {
      expect(scoreOf(expected, answer), label).toBe(100);
    }
  });

  it("PASS-B3 全角拉丁字母（Ｉｔ＇ｓ）也能通过 U+FF01-FF5E 区整体左移折成半角", () => {
    expect(scoreOf(expected, "Ｉｔ＇ｓ cold today."), "全角字母").toBe(100);
  });

  it("PASS-B4 严格标点模式下全角句号仍等价于半角句号（foldFullWidth 在 strictPunctuation 之前）", () => {
    // 这在设置页「严格检查标点」开启时生效——中文输入法的句号不该被判成标点错误
    expect(scoreOf(expected, "It's cold today。", true), "严格模式 + 全角句号").toBe(100);
  });

  it("PASS-B5 大小写、首尾空白、连续空白都被归一（多空格 ↔ 单空格）", () => {
    for (const [label, answer] of [
      ["全小写", "it's cold today."],
      ["全大写", "IT'S COLD TODAY."],
      ["首尾空白", "   It's cold today.   "],
      ["中间多空格", "It's   cold    today."],
      ["制表符分隔", "It's\tcold\ttoday."]
    ] as Array<[string, string]>) {
      expect(scoreOf(expected, answer), label).toBe(100);
    }
  });

  it("PASS-B6 盘古空格 U+3000（中文输入法打出的全角空格）在句级判分里也安全", () => {
    // U+3000 命中 /[\uFF01-\uFF5E]/ 之外，但 \s+ → " " 的空白压缩把它一起吃掉了
    expect(scoreOf("It's cold today.", "It's\u3000cold\u3000today."), "全角空格 U+3000").toBe(100);
  });

  it("B7【已修 2026-09-23】弯双引号 U+201C/U+201D（中文输入法的双引号）已折进折叠表", () => {
    /**
     * 修复前：折叠表只列了 U+2018/U+2019（单引号），U+201C/U+201D 既不在
     * 全角 ASCII 区、也不在非严格模式的标点删除类（那是纯 ASCII），
     * 于是**粘在词上**变成 `“hello”` 一个 token，与 `hello` 对不上——5 词句掉到 80 分。
     * 修复：foldFullWidth 把弯双引号折成 ASCII `"`，随后被删标点类清掉。
     */
    const target = 'He said "hello" to me.';
    const answer = "He said “hello” to me.";
    const tokens = compareText(target, answer, false);
    const statuses = tokens.map((t) => `${t.status}:${t.token ?? t.expected}`);
    expect(statuses, "弯引号折成 ASCII 后与 hello 分离").toEqual([
      "match:he",
      "match:said",
      "match:hello",
      "match:to",
      "match:me"
    ]);
    expect(scoreOf(target, answer), "中文输入法的双引号不再扣分").toBe(100);
    // 其余几种弯引号变体同样处理
    for (const ch of ["\u201C", "\u201D", "\u201E", "\u2033"]) {
      expect(scoreOf("I like tea", `I like tea${ch}`), `变体 ${ch} 应被折叠清理`).toBe(100);
    }
  });

  it("B8【已修 2026-09-23】中文常用标点已全部折进折叠表：… — · 「」《》～ ・ ｡", () => {
    /**
     * 修复前：foldFullWidth 只处理三段（全角 ASCII 区、U+2018/19、U+3002/3001），
     * 下面这些中文输入法同样会打出的字符**一个都没覆盖**，
     * 在非严格模式下也不会被删标点字符类（那是纯 ASCII）清掉，于是粘在词上扣分。
     * 修复：统一折成对应 ASCII 标点，随后被删标点类清掉（标点不计分）。
     */
    const leaks: Array<[string, string]> = [
      ["中文省略号 …（U+2026）", "\u2026"],
      ["破折号 —（U+2014）", "\u2014"],
      ["间隔号 ·（U+00B7）", "\u00B7"],
      ["竖排书名号 「（U+300C）", "\u300C"],
      ["书名号 《（U+300A）", "\u300A"],
      ["全角波浪号 ～（U+FF5E）", "\uFF5E"],
      ["片假名中点 ・（U+30FB）", "\u30FB"],
      ["半角句号 ｡（U+FF61）", "\uFF61"],
      ["日文波浪 〜（U+301C）", "\u301C"],
      ["重音符 〰（U+3030）", "\u3030"],
      ["全角中点 •（U+2022）", "\u2022"],
      ["双点省略 ⁯（U+22EF）", "\u22EF"]
    ];
    for (const [label, ch] of leaks) {
      expect(scoreOf("I like tea", `I like tea${ch}`), `${label} 应被归一，不扣分`).toBe(100);
    }
    // 夹在词中间的标点也要能脱离（不粘在词上）
    expect(scoreOf("I like tea", `I like\u300C tea`), "标点夹在词间也应清理").toBe(100);
  });

  it("PASS-B9 半角标点差异在非严格模式下一律忽略（标点不参与判分）", () => {
    expect(scoreOf("I like tea.", "I like tea"), "无句号").toBe(100);
    expect(scoreOf("I like tea.", "I like tea!!!"), "多个感叹号").toBe(100);
    expect(scoreOf("I like tea.", "I like, tea;"), "逗号分号").toBe(100);
  });
});

describe("ENV3-B 词级判分：拼写页（normalizeSpelling）", () => {
  it("PASS-B10 大小写、首尾空白、词内空格都被归一", () => {
    expect(normalizeSpelling("Picture"), "首字母大写").toBe(normalizeSpelling("picture"));
    expect(normalizeSpelling("  picture  "), "首尾空白").toBe(normalizeSpelling("picture"));
    expect(normalizeSpelling("pic ture"), "词内空格被删（normalizeSpelling 删所有空白）").toBe("picture");
  });

  it("PASS-B11 U+2019 撇号被折成 ASCII（don’t ↔ don't）", () => {
    expect(normalizeSpelling("don’t"), "U+2019").toBe(normalizeSpelling("don't"));
    expect(normalizeSpelling("I’m"), "I’m").toBe(normalizeSpelling("I'm"));
  });

  it("PASS-B12 全角空格 U+3000 命中 \\s+ → 被删除（虽然字面看是空格）", () => {
    // JS 的 \s 包含 U+3000，所以这条侥幸安全
    expect(normalizeSpelling("to\u3000day"), "全角空格").toBe(normalizeSpelling("today"));
  });

  it("【已修 R09】拼写页现在也折叠全角句号——与句级判分口径一致", () => {
    /**
     * 修复前：`normalizeSpelling`（:279-284）只做 trim / toLowerCase /
     * U+2019→ASCII / 删空白，**没有 foldFullWidth**，而句级 `normalize`（:12-19）有。
     * 同样一句 "It's cold today。" 在复习页拿 100 分、在拼写页被判错——
     * 而拼写页恰恰是输入法状态最不可控的地方。
     * 修复后两条管线共用 foldFullWidth。
     */
    /**
     * 注意口径差异：`normalizeSpelling` **保留**标点（它给逐字母比对用，
     * 不能悄悄删字符），句级 `normalize` 才会去标点。所以这里断言的是
     * 「全角已折成等价的半角」而不是「标点消失了」。
     */
    expect(normalizeSpelling("today。"), "全角句号折成半角句号").toBe("today.");
    expect(normalizeSpelling("today。"), "与用户敲半角句号的结果一致").toBe(normalizeSpelling("today."));
    // 全角顿号折成半角逗号
    expect(normalizeSpelling("today、"), "全角顿号折成半角逗号").toBe("today,");
  });

  it("【已修 R09】拼写页也折叠全角拉丁字母与全角撇号", () => {
    // Ｉｔ＇ｓ / ｄｏｎ＇ｔ 这类全角输入此前只在句级判分能过，拼写页判错。
    expect(normalizeSpelling("Ｉｔ＇ｓ"), "全角字母折成 ASCII").toBe("it's");
    expect(normalizeSpelling("ｐｉｃｔｕｒｅ"), "全角单词折成 ASCII").toBe("picture");
  });

  it("B15【已修 2026-09-23】全角输入在拼写页不再被判错", () => {
    /**
     * 修复前：R09 只给 `normalizeSpelling` 补了 `foldFullWidth`——
     * 全角句号被折成半角 `.`，但词级**不删标点**（有意设计，见下），
     * 那个 `.` 仍算一个字符，于是 `today。` 判错、重复插队、写进错词记录。
     *
     * 修复方式（**没有**改 `normalizeSpelling`）：
     * 该函数同时喂给「判对错」（应宽容）与「字母级差异对照」（需保留标点才能高亮），
     * 删标点会让后者显示不出标点差异。故新增 `spellingMatches` 专供判定，
     * `SpellingPage` 的 `isCorrect` 改用它。
     */
    expect(spellingMatches("today", "today。"), "全角句号不再导致判错").toBe(true);
    expect(spellingMatches("today", "today."), "半角句号同理").toBe(true);
    expect(spellingMatches("today", "today"), "原样也对").toBe(true);
    // 其余常见全角/中文标点同样不该影响判定
    for (const ch of ["。", "，", "！", "？", "、", "…", "「", "《"]) {
      expect(spellingMatches(`today`, `today${ch}`), `标点 ${ch} 应被容忍`).toBe(true);
    }
    // ⚠️ 撇号必须保留：否则 its / it's 会被当成同一个词（L87/L88 考点）
    expect(spellingMatches("it's", "its"), "its ≠ it's").toBe(false);
    expect(spellingMatches("it's", "it's"), "撇号写对才算对").toBe(true);

    /**
     * 差异对照仍走 `normalizeSpelling`（保留标点）——这正是当初不改它的原因。
     * 若把标点删掉，界面就无法高亮「你多打了个句号」。
     */
    expect(normalizeSpelling("today。"), "差异对照口径：全角折成半角后保留").toBe("today.");
    const tokens = compareLetters("today", "today。");
    expect(tokens.map((t) => t.status), "差异对照仍能标出多出的标点").toEqual([
      "match", "match", "match", "match", "match", "extra"
    ]);
  });

  it("PASS-B16 两条管线口径已一致：同一个全角输入在句级与词级判定都通过", () => {
    expect(scoreOf("today", "today。"), "句级判分：满分").toBe(100);
    expect(spellingMatches("today", "today。"), "词级判定：也通过（B15 修复前为 false）").toBe(true);
    /**
     * 注意「一致」的确切含义：**判定结果**一致，不是归一化字符串一致。
     * `normalizeSpelling` 有意保留标点（供差异对照高亮），所以
     * `normalizeSpelling("today。")`（"today."）与 `normalizeSpelling("today")`（"today"）
     * **本来就不该相等**——这是设计，不是口径不一致。
     * 真正要求一致的是「判对错」这一层，那由 `spellingMatches` 承担。
     */
    expect(
      normalizeSpelling("today。") === normalizeSpelling("today"),
      "归一化字符串仍保留标点（差异对照需要，属设计）"
    ).toBe(false);
  });
});

describe("ENV3-B 词块题判分（checkLessonTokens）与句面无术语归一化", () => {
  it("PASS-B17 全角字母 / 撇号在词块题里通过（与句级判分同源）", () => {
    expect(checkLessonTokens(["Ｉｔ＇ｓ", "cold", "today"], "It's cold today"), "全角词块").toBe(true);
    expect(checkLessonTokens(["It’s", "cold", "today"], "It's cold today"), "U+2019 词块").toBe(true);
    expect(tokenSequencesEquivalent(["don’t"], "don't"), "U+2019 缩写").toBe(true);
  });

  it("PASS-B18 词块题对不同缩写的等价展开仍然成立（不因全角折叠而误判不同）", () => {
    // 折全角后 "Ｉｔ＇ｓ" → "it's" → 展开为 it is；下面验证它没有把 its 也判成对
    expect(checkLessonTokens(["its", "cold"], "It's cold"), "its ≠ it's（L87/L88 考点）").toBe(false);
    expect(checkLessonTokens(["it", "is", "cold"], "It's cold"), "长版写法算对").toBe(true);
  });

  it("PASS-B19 normalizeLessonSentence 覆盖中文标点（用于哈希与去重，不参与判分）", () => {
    // 该函数删 [.,!?;:'\"’‘（），。？！、]，注意它删的是单引号本身，
    // 所以 "It's" 与 "Its" 归一后相同——只用于句子身份哈希，不用于对错判定。
    expect(normalizeLessonSentence("It's cold today.")).toBe(normalizeLessonSentence("it’s cold today。"));
    expect(normalizeLessonSentence("It's cold today.")).toBe("its cold today");
  });
});

describe("ENV3-B 分值与阈值：全角字符造成的扣分是否足以越过通过线", () => {
  it("B20【已修 2026-09-23】原漏网标点不再压低得分（含两种通过线）", () => {
    /**
     * 修复前：通过线是忆段 70、产出段 90（见 contractionJudging.test.ts 的口径注释）。
     * 漏网标点粘在末词上时被 `isNearSpelling`（编辑距离 1）判成半对的 "spelling"，
     * 于是「吸附在最后一个词上」吃 0.5 分、粘在短词上整词判 substitution：
     *
     *   "I like tea" + 「  → 2.5/3 = 83 分 → **产出段 90 线不合格**
     *   "I am"       + 「  → 1/2   = 50 分 → 忆段 70 线也不合格
     *
     * 修复后这些标点被归一清理，两档通过线都不再受影响。
     */
    const leaky = compareText("I like tea", "I like tea\u300C");
    expect(leaky.map((t) => t.status), "标点清理后全部 match").toEqual(["match", "match", "match"]);
    expect(scoreOf("I like tea", "I like tea\u300C"), "3 词 → 满分（产出段 90 线合格）").toBe(100);
    expect(scoreOf("I am", "I am\u300C"), "2 词 → 满分（忆段 70 线合格）").toBe(100);
    // 而全角句号 / 问号 / 感叹号是被折叠的，即便在严格模式下也不扣分
    expect(scoreOf("I like tea.", "I like tea。", true), "全角句号（已折叠）满分").toBe(100);
    expect(scoreOf("I like tea?", "I like tea？", true), "全角问号（已折叠）满分").toBe(100);
    expect(scoreOf("I like tea!", "I like tea！", true), "全角感叹号（已折叠）满分").toBe(100);
  });
});

/**
 * ENV3-D 判分口径统一守门（2026-09-24 新增）。
 *
 * ## 为什么单独守这一条
 *
 * 全角折叠**只存在于 `diffService` 的归一化链路里**。任何页面/服务若自己写一句
 * `a.trim().toLowerCase() === b.trim().toLowerCase()` 来判对错，
 * 就**绕过了折叠**——中文输入法打出的全角字母（`ｐｉｃｔｕｒｅ`）或弯撇号（`don’t`）
 * 会被判错，而这在代码审查里完全看不出来（裸比较看起来非常正当）。
 *
 * 实测缺口（本守门逼出来的）：回访页 cloze 与趁热练 cloze 两处用裸比较判分，
 * 而同页的重组题走 `checkLessonTokens`（含折叠）——**同一个页面两套口径**，
 * 用户在两种题型间来回时同一个词一个判对一个判错。
 *
 * ## 判据
 *
 * 搜「判对错」的赋值点（`const passed = ...` / `return ... === ...`），
 * 要求右侧走 diffService 的归一化（或 lessonService 的 checkLessonTokens），
 * 不得出现裸 `toLowerCase()` 比较。白名单里逐条写明为什么可以例外。
 */
describe("ENV3-D 判分口径统一：手打输入的判分必须走归一化（防绕过全角折叠）", () => {
  /**
   * 判据设计说明（2026-09-24）。
   *
   * 首版判据是「搜所有 `toLowerCase() ===` 比较，除白名单外全报」——
   * 实测刷出 15+ 处，绝大多数是**按词面查找已有实体**（`wordDetails.find(...)`、
   * `favoriteWords.has(...)`、快捷键 `event.key`），与判分无关。
   * 继续加白名单会迅速把守门稀释成「谁都能过」，所以改为**精准判据**：
   *
   * 只在**判分函数体内**检查。判分函数的识别靠两条信号：
   *  ① 函数名含 judge / check / match / verify / passed；
   *  ② 该函数**接收两个字符串**（用户答案 + 标准答案）并返回 boolean。
   *
   * 这两条能覆盖全部真实判分点（judgeGrammarCloze / judgeBoostChoice /
   * checkLessonChoice / spellingMatches …），而把「查找实体」排除在外
   * （那些函数的语义是 find/has/lookup，返回值也不是 pass/fail）。
   */
  it("判分函数体内的字符串比较必须走归一化（spellingMatches / compareText / checkLessonTokens）", async () => {
    const { readFileSync, readdirSync, statSync } = await import("node:fs");
    const { join } = await import("node:path");

    const walk = (dir: string): string[] =>
      readdirSync(dir).flatMap((name) => {
        const full = join(dir, name);
        if (statSync(full).isDirectory()) return walk(full);
        return /\.tsx?$/.test(full) && !/\.test\./.test(full) ? [full] : [];
      });

    const offenders: string[] = [];
    const judgeFns: string[] = [];

    for (const file of walk("src/pages").concat(walk("src/services"))) {
      const source = readFileSync(file, "utf8");
      const lines = source.split("\n");

      /**
       * 逐个定位「判分函数」：名字含判分信号 + 参数里有两个字符串（用户侧 + 标准侧）。
       * 只取单行或双行的箭头函数体（本项目的判分函数都是这个形态）。
       */
      for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i];
        const m = /export const (\w*(?:[Jj]udge|check|Check|match|Match|verify|passed)\w*)\s*=/.exec(line);
        if (!m) continue;
        // 取函数声明的连续几行（覆盖多行签名）
        const body = lines.slice(i, i + 6).join("\n");
        if (!/:\s*boolean/.test(body)) continue;
        if (!/\(\s*\w+\s*:\s*string/.test(body)) continue;
        judgeFns.push(`${file.replace(process.cwd() + "/", "")} → ${m[1]}`);
        // 该函数体内不得出现裸 toLowerCase 比较
        const bodyLines = [line, ...lines.slice(i + 1, i + 4)];
        for (const bl of bodyLines) {
          if (!/toLowerCase\(\)\s*===|===\s*[^=]*toLowerCase\(\)/.test(bl)) continue;
          /**
           * 例外通道：该判分函数若在**紧邻的注释里声明**「两侧都不是用户手打」，
           * 就算已登记（本项目用 `⚠️ ... 有意为之` 这一固定措辞）。
           * 这样例外必须带理由、且理由写在函数旁边，而不是散落在一张远端白名单里——
           * 首版用文件级白名单时，白名单很快膨胀到 8 个文件，守门形同虚设。
           */
          const preceding = lines.slice(Math.max(0, i - 12), i).join("\n");
          const declared = /两侧都\*{0,2}不是用户手打|不是用户手打|有意为之/.test(preceding);
          if (declared) continue;
          offenders.push(`${file.replace(process.cwd() + "/", "")} ${m[1]}：${bl.trim()}`);
        }
      }
    }

    expect(judgeFns.length, `应识别到 ≥6 个判分函数（实际 ${judgeFns.length}）`).toBeGreaterThanOrEqual(6);
    expect(
      offenders.join("\n"),
      "判分函数里出现裸 toLowerCase 比较——用户手打输入会被全角/弯撇号判错；\n" +
        "请改走 diffService 的 spellingMatches（词级）或 compareText（句级）；\n" +
        "若该「判分」两侧都不是用户手打（如选项点选），请在函数上加注释说明并按本测试的方式登记。"
    ).toBe("");
  });

  it("cloze / 填空类判分对全角输入宽容（回归：曾用裸比较判错全角字母）", () => {
    const fullwidth = "ｐｉｃｔｕｒｅ";
    const plain = "picture";
    expect(spellingMatches(plain, fullwidth), "全角字母应判对").toBe(true);
    expect(spellingMatches(plain, "pictur"), "错词仍判错（不放过）").toBe(false);
    expect(spellingMatches("don't", "don’t"), "弯撇号应判对").toBe(true);
    expect(spellingMatches("don't", "dont"), "丢撇号仍判错（L87/L88 考点，不能放过）").toBe(false);
  });
});
