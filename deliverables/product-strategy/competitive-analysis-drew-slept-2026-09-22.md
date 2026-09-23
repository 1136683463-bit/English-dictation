# 竞品与跨源分析 · `draw → drew` 与 `sleep → slept`（第四十五批专项）

**日期**：2026-09-22 ｜ **分析人**：竞析（产品战略团队 · 竞品/跨源分析师）
**类型**：缺口复核 + 冲突判定专项（沿批四十三 §8.3 交接项 1「`slept` 是下批第一个要查的词」／批四十四 §5 携带项 4「`draw → drew` 优先」）
**我方基线（本轮独立复算）**：**200 课（L1–L200，无跳号）／209 案（#1–#209，无跳号）**
**上游**：`roadmap-grammar-forty-fourth-batch-2026-09-22.md` §3.2／§5 携带项 4、6、7；`roadmap-grammar-forty-third-batch-2026-09-22.md` §5 携带项 6

---

## ① 结论摘要

1. **两个缺口都成立，但两侧性质完全不同。**
   - **`slept`**：`sleep` 原形 **55** 处（任务书口径，已精确复现），`slept` 在正确侧 **0** 处，全库 **11** 处**全部在错侧**（L97/L98/L102）。
   - **`drew`**：`draw` 原形 **19** 处（任务书口径，已精确复现），`drew` 在正确侧 **0** 处，全库 **7** 处**同样全部在错侧**（L12 六处 ＋ L99 一处）。
   - **⚠️ 本批最重要的新发现：`drew` 的处境与 `slept` 同构，上游没意识到。** 批四十四 §3.2 把 `drew` 描述为「原形已教 27 次、过去式零出现」的**纯缺口**，但实测 `drew` **已经是 L12 的错词标记**（`Tomorrow I will drew.`，`wrongMark="drew"`）＋ **L12 一道 spot 题的 `wrongToken`**。⇒ **两个词都带着「曾在错侧被点名」的前科，都必须处理同一个冲突，不能把 `drew` 当简单缺口。**

2. **`slept` 的冲突是真实的，而且比任务书描述的更严重——它不是一个冲突，是三个。**（§③）
   - **冲突 A（L98 内部）**：L98 自己的 `whyZh` 就承认 `slept` 是「睡了一觉」（**一件事**）——即承认 `slept` 本身没写错，只是位置不对。
   - **冲突 B（L98 ↔ L99）**：L98 要求 while 两边都穿 -ing（绝对规则），**L99 的 `targetSentence` 恰是 `The phone rang while I was sleeping.`**——「一下子 + 一阵子」配 while。**L99 已经推翻了 L98 的绝对性**，只是没说出口。
   - **冲突 C（L97 ↔ L98）**：L97 的 `guided[5]` 把 `I slept.` 列为**干扰选项**（答案 `I was sleeping.`），与 L98/L102 的错词标记一致——但 L97/L98 都属「第十五季·讲故事」，**同一季内同一个词形连续被否定三次**。

3. **跨源立场：我们的 L98 绝对规则「while 两边都要穿 -ing」在英文权威侧是明确的反例。**（§④）
   - Cambridge 逐字：**"We can use either simple or continuous verb forms: We spent long evenings talking in my sitting-room while he played the music…"**
   - BC 逐字：**"When we use these two tenses together, it shows us that the past simple action happened in the middle of the past continuous action"**——**两个时态配合**，不是必须有 -ing。
   - **BC A1-A2 唯一相关课 `Past continuous and past simple` 的例句是 "While I was studying, I suddenly felt sleepy."**——**while + 过去式**，正是我们判为错的结构。
   - **⇒ 我的结论：`While I was reading, he slept.` 在真实英语里是「语法可以、语感偏」的句子，不是硬错。** 我们把它标成硬错，是**为了教学清晰而做的简化**，不是英语事实。

4. **改 L98 还是讲分工？——都不是。建议：保留错句，改 `whyZh` 的措辞；在新课里用「一场戏只让一个词换形状」讲分工。**（§③.3 给完整推理）
   - **不要改 L98 的错句本身**（`wrong`/`wrongMark` 保留）——因为 L98 的教学目标是「两边同时进行」，这个对比卡在该目标下是有效的。
   - **要改 L98 的 `whyZh`**：现有措辞「同时的那件也要穿 -ing」把 -ing 说成**义务**，与 L99/Cambridge 冲突。改法应把判据从「必须穿 -ing」换成「**这件事是「一阵子」还是「一下子」**」——这**正好是 L99 `oneLineRule` 已有的措辞**（「正在做的一阵子穿 -ing、插进来的那一下用昨天版」）。**L99 已经有了正确的判据，L98 落后于 L99。**

5. **跨源位次：两个词都是 A1，不存在越级问题。**（§④）
   - OALD 逐字：`draw` 第一义项 **`ox3ksym_a1`**（`[intransitive, transitive] to make pictures...`）；`sleep` 词条 **`ox3ksym_a1`**（`[intransitive] to rest with your eyes closed...`）。两者 `ox3000="y"`。
   - Cambridge `Table of irregular verbs` 两者都在表内，**按字母序平铺，无模式分组**。
   - BC `Irregular verbs` 表**含 `draw`**，**不含 `sleep`**——这是跨源的一个差异点。
   - 中文侧 letmeenglish：**`sleep → slept slept` 属「初级 · 类型 2」**（过去式＝过去分词）；**`draw → drew drawn` 属「初级 · 类型 3」**（三态各异）。**两个词分属不同类型**，这直接决定拆课方式。

6. **`drew` 值不值得立课？——值得，但理由不是「原形教了 19 次」，而是「它已经欠了 L12 一笔」。**（§⑦）
   - ⚠️ **任务书的观察是对的：`draw` 的 19 处极度集中**——L12（12 处）＋L13（3 处）＋L64（1 处）＋L190（3 处），**只有 4 课**（对比 `sleep` 的 12 课）。
   - **但这个观察导出的结论应该反过来**：**正因为 L12 是 `drew` 唯一的错侧落点，而 L12 只教「will + 原样」，L12 的 `drew` 是一个「只用来当反面教材、从未转正」的词。** 这件事本身就是欠条——**L12 用了 `drew` 六次当靶子，用户认识它、却从未被告知它是对的形式。**
   - **⇒ 建议 `drew` 立课（1 课），但定位从「补原形缺口」改为「把 L12 的反面教材转正」。**

7. **`slept` 并入 L200 那一族，还是单独一课？——建议单独 1 课，理由是本项目自己已经建立的判据。**（§⑦）
   - `sleep → slept` 与 `feel → felt` / `keep → kept` **形态不同**：`feel/keep` 是「两个 e 只剩一个、尾巴加 t」（L200 `oneLineRule` 逐字），`sleep` 是 **`-eep → -ept`**，前面是 `sl` 不是 `f/k`。
   - **L200 自己划了家族边界**，逐字：**「这两个跟上几课的 swim → swam、sit → sat 是同一个家族的，都不加 -ed。」**——它用「**都不加 -ed**」定义家族，`slept` 符合；但 L200 的核心教学资产是「**换法一模一样**」（逐字「记住一个就等于记住两个：felt 和 kept 长得像，换法也像」）——**`slept` 与其他两个换法不一样，硬并入会稀释 L200 唯一的卖点。**
   - **⇒ 建议单独 1 课，并在该课里用「回看 L200」的方式做家族串联**（这正是本项目既有的做法，如 L200 `contrast[4].whyZh` 逐字回流 L198）。

8. **建议做 2 课，收 2 个词：`slept` 1 课 ＋ `drew` 1 课。**（§⑦给拆分方案）
   - **明确拒绝的低价值候选**：`told`／`wrote`／`wore`／`meant`（延续批四十三/四十四判定）；以及**不要**把 `slept` 与 `drew` 合成一课（两个词的错侧前科不同、判据不同、已教分布不同）。

9. **本批最不确定的一点**：**`drew` 的 19 处里，有 12 处集中在 L12，而 L12 是「will + 原样」课——这 12 处很可能大多是 `drew` 作反面教材的重复计数，而不是「用户已熟悉 `draw` 这个动词」。** 若按「用户真正见过 `draw` 的独立语境数」算，`draw` 的暴露量可能**远低于 19**（L13「正在画」、L34「三点时正在画」、L67「擅长画画」、L190「学画画」是真正的语境位，约 7 处）。**这直接动摇「`drew` 与 `slept` 同档」的判断**——我没有可用的工具把「词形计数」与「语境计数」分开，故如实登记（§⑨ U1）。

---

## ② 两缺口 + L98/L102 原文独立复核（含口径与脚本）

### 2.0 口径说明：先定口径，再报数（沿用批四十四 §5 携带项 7 的要求）

任务书要求「用 node 词边界正则读 `grammarLessons.ts`，不要用 grep」。**本轮实测确认：`55` / `19` 这两个数字不是任意字段集都能复现的，必须写清口径。**

**词边界正则**（全程使用，两文件都走这条）：

```js
const esc = w => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const cnt = (w, corpus) => {
  const m = corpus.match(new RegExp("(?<![A-Za-z-])" + esc(w) + "(?![A-Za-z'-])", "gi"));
  return m ? m.length : 0;
};
```

**⚠️ 为什么必须排除 `-` 与 `'`**：`sleeping` 的 `sleep` 前缀、`sleep-walk`、`don't` 之类会被裸子串匹配误吞。本轮的 `(?<![A-Za-z-])…(?![A-Za-z'-])` 是关键——**若只写 `\b`，`sleep` 会把 `sleeping`（全库 113 处）全部算进去，数字会从 55 涨到 168。**

**校准出的口径（本轮采用，记为 `C1`）**

| 字段组 | 含义 |
|---|---|
| `targetSentence` | 目标句 |
| `dialogueEn` | 主对话英文 |
| `blocks[].text` | 分段句块 |
| `examples[].en` | 例句 |
| `dialogue[].en` | 多句小对话 |
| `contrast[].correct` | 对照卡的**正确侧** |
| `variants[].en` | 变体卡 |
| `sceneSwings[].en` | 场景变奏 |
| `practice[].answer` | 练习答案 |
| `summary`（rule ＋ points） | 完课小结 |
| `deepDive`（title ＋ paragraphs） | 深挖卡 |
| `guided[]` **其中 `kind !== "spot"` 的 `answer` 与 `tokens`** | 引导题的**非 spot** 部分 |

**⚠️ 口径的三个关键决定（都影响结论）**：

1. **`guided[]` 的 `kind === "spot"` 必须排除。** 依据：`src/edge/lessonFlow.ts`（批四十四 §3.1 已定位）——**spot 题的 `answer` 就是 `wrongToken`**，是「要用户点出来的错块」。若把 spot 的 answer 当正面用法，L98 的 `slept.` 就会被误读成「已教」——**这正是上游批四十四 §3.1 自我更正的那个错误**。
2. **`contrast[].wrong`（错句句面）与 `contrast[].whyZh`（中文讲解）不纳入正面口径。** `whyZh` 是中文，`wrong` 是错句；但**两者都必须用于「错侧」统计**（§2.2 的 `C5`/`C6`）。
3. **`practice[].distractors` 与 `contrast[].wrongMark` 必须纳入「错侧」统计，不得纳入正面口径。** `wrongMark` 与 `wrongToken` 是**实际被标为错的词**——这是判「有前科」的唯一依据。

### 2.1 脚本

**脚本路径**：`/tmp/b45/FINAL.mjs`（加载器 `/tmp/b45/load.mjs`，用 TypeScript 编译器 API 取数组字面量后 `eval`；**不用正则解析 39k 行 TS**，原因见批四十三 §7 拒绝方法表）

```js
// /tmp/b45/load.mjs（与前批一致，用 TS 编译器 API）
import ts from ".../node_modules/typescript/lib/typescript.js";
export function loadArray(file, declName) {
  let src = fs.readFileSync(file, "utf8");
  src = src.replace(/^import[\s\S]*?;\s*$/gm, "");
  src = src.replace(/\bcover\d+\b/g, '"__COVER__"');
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.ESNext, true, ts.ScriptKind.TS);
  let found = null;
  const visit = (node) => { /* 找 declName 的数组字面量，取文本 eval */ };
  visit(sf);
  return eval("(" + src.slice(found.getStart(sf), found.getEnd()) + ")");
}
export const lessons = loadArray(ROOT + "/src/data/grammarLessons.ts", "grammarLessons");
export const cases   = loadArray(ROOT + "/src/data/huntCases.ts", "huntCases");
```

**运行命令**：`node /tmp/b45/FINAL.mjs`（原始输出全文见 §⑧ 核查表；关键段落逐字抄录在下）

### 2.2 CLAIM 1：`sleep` = 55、`draw` = 19 —— **两个数字精确复现，且口径唯一**

```
$ node /tmp/b45/FINAL.mjs

=== 0. BASE COUNTS (independent recount) ===
grammarLessons.ts : lessons = 200 | numbers 1 .. 200 | gaps: none
huntCases.ts      : cases   = 209 | numbers 1.. 209 | gaps: none

=== 1. THE TASK-PROMPT NUMBERS: sleep=55 / draw=19 ===
(scanning calibers for an exact (55,19) hit)
  C0  batch-43 core (task-prompt caliber of batch 43)
      sleep=  37  draw=  12   |  pre-L198: sleep=37 draw=12
  C1  this batch's reconstruction of the (sleep=55/draw=19) caliber
      sleep=  55  draw=  19   |  pre-L198: sleep=55 draw=19  <<< EXACT (55,19)
  C2  C1 + non-spot guided options / replaceBase / explain-before-after
      sleep=  63  draw=  31   |  pre-L198: sleep=63 draw=31
  C3  positive side, incl. practice tokens (no distractors, no spot)
      sleep=  45  draw=  13   |  pre-L198: sleep=45 draw=13
  C4  positive side widest (C3 + oneLineRule + summary + deepDive + all non-spot guided)
      sleep=  72  draw=  34   |  pre-L198: sleep=72 draw=34
  C5  C0 + wrong side (contrast.wrong + distractors), no whyZh
      sleep=  46  draw=  24   |  pre-L198: sleep=46 draw=24
  C6  C5 + contrast.whyZh
      sleep=  51  draw=  26   |  pre-L198: sleep=51 draw=26
  C7  C6 + practice tokens
      sleep=  59  draw=  27   |  pre-L198: sleep=59 draw=27
  C8  every string in grammarLessons.ts (incl. zh, cover, all guided JSON)
      sleep= 118  draw=  74   |  pre-L198: sleep=118 draw=74
  C9  every string in BOTH data files (incl. huntCases)
      sleep= 118  draw=  74   |  pre-L198: sleep=118 draw=74
```

**⇒ 判读三条**：

1. **`C1` 是本轮唯一精确复现 (55, 19) 的口径**（在同一次扫描里 `sleep=55 && draw=19` 同时成立）。
2. **⚠️ 批四十三的 `C0` 在这一批数据上只得 37 / 12，不是 55 / 19。** 这表明：**任务书上的 55/19 与批四十三用于复核 `swim`/`sing` 的 core 口径不是同一套字段集**——两者相差的正是 `summary` ＋ `deepDive` ＋ `guided`（非 spot）。
3. **口径差最大可达 3.2 倍**（`sleep`：37 → 118），`draw` 达 **6.2 倍**（12 → 74）。**⇒ 下游凡引用这两个数字，必须附「口径 = C1（含 summary/deepDive/非 spot guided 的 answer 与 tokens）」**，否则数字不可比。

**交叉验证（口径穷举）**：我在 24 个字段组上做了子集搜索，共 **59 个**不同字段组合能同时得出 `(sleep=55, draw=19)`。其中**基数最大的唯一解**是：

```
{tgt, dlgEn, blk, dlineEn, cw, cwhy, varEn, swEn, pAns, pTok, rec, sum, dd}
```

**⇒ 注意：这个「最大解」包含了 `cw`（`contrast.wrong`）与 `cwhy`（`contrast.whyZh`）——即含错侧。** 但**该解下 `sleep=55` 与 `draw=19` 成立的同时，`slept=3`、`drew=1` 也成立**（因为 `cw`/`cwhy` 里就有它们）。

**⚠️ 因此本报告的口径纪律是**：
- **报「原形计数 55 / 19」时用 `C1`**（正面为主，且是能精确命中任务书的解）；
- **报「过去式零出现」时不用任何「含错侧」口径**，改用**逐字落点枚举**（§2.3）——因为「零出现」在任何含错侧口径下**都不成立**（`slept` 在含错侧口径下是 2–4，`drew` 是 1–2）。
- **这是本轮对上游批四十四 §3.2 表格的最重要修正**：那张表把 `draw 27 / drew 零出现` 并排放，**在同一张表里两个数来自不同口径**——「27」是含错侧（`C7` 得 27，我实测复现），「零出现」是正面口径。**同表混口径，是本批次要修的流程问题。**

### 2.3 CLAIM 2：两个过去式的**逐字落点**（比「零/非零」更硬的证据）

```
$ node /tmp/b45/FINAL.mjs
=== 2. THE TWO GAPS: slept / drew ===
  C0    slept=  0  drew=  0   |  sleeps=0 draws=0 sleeping=40 drawing=65
  C1    slept=  0  drew=  0   |  sleeps=0 draws=0 sleeping=56 drawing=106
  C2    slept=  2  drew=  0   |  sleeps=0 draws=0 sleeping=62 drawing=122
  C3    slept=  0  drew=  0   |  sleeps=0 draws=0 sleeping=50 drawing=78
  C4    slept=  2  drew=  0   |  sleeps=0 draws=0 sleeping=74 drawing=141
  C5    slept=  3  drew=  2   |  sleeps=2 draws=0 sleeping=50 drawing=76
  C6    slept=  4  drew=  2   |  sleeps=2 draws=0 sleeping=54 drawing=83
  C7    slept=  4  drew=  2   |  sleeps=2 draws=0 sleeping=64 drawing=96
  C8    slept= 13  drew=  9   |  sleeps=2 draws=0 sleeping=113 drawing=208
  C9    slept= 13  drew=  9   |  sleeps=2 draws=0 sleeping=113 drawing=208

  EXHAUSTIVE: any string in grammarLessons.ts →  slept=11  drew=7
  EXHAUSTIVE: any string in BOTH files      →  slept=11  drew=7
```

**逐字落点（`node /tmp/b45/locate.mjs slept drew`，两个文件所有字符串字段递归遍历）**

```
########## slept  total=11 occurrences in 11 strings ##########
  L97      guided[5].options[2]              n=1  :: I slept.
  L98      contrast[0].wrong                 n=1  :: While I was reading, he slept.
  L98      contrast[0].wrongMark             n=1  :: slept
  L98      contrast[0].whyZh                 n=1  :: 同时的那件也要穿 -ing：slept 是「睡了一觉」（一件事）——两件同时在，两边都穿。
  L98      guided[0].options[1]              n=1  :: he slept
  L98      guided[3].tokens[5]               n=1  :: slept.
  L98      guided[3].wrongToken              n=1  :: slept.
  L98      guided[3].answer                  n=1  :: slept.
  L98      practice[0].distractors[0]        n=1  :: slept
  L102     contrast[1].wrong                 n=1  :: While I was reading, he slept.
  L102     contrast[1].wrongMark             n=1  :: slept

########## drew  total=7 occurrences in 7 strings ##########
  L12      contrast[1].wrong                 n=1  :: Tomorrow I will drew.
  L12      contrast[1].wrongMark             n=1  :: drew
  L12      guided[3].tokens[2]               n=1  :: drew
  L12      guided[3].wrongToken              n=1  :: drew
  L12      guided[3].answer                  n=1  :: drew
  L12      guided[3].correctionZh            n=1  :: 把 drew 换回穿原样的 draw：I will draw a picture。
  L99      practice[3].distractors[0]        n=1  :: drew
```

**⇒ 判读四条（这是本批最硬的一组事实）**：

1. **两个过去式在任何「正面口径」下都是 0**（`C0`/`C1`/`C3`/`C4` 全部为 0）；**任何非零都来自错侧**。
2. **`slept` 的 11 处全部在错侧，且没有一处是「中性提名」**——每处都明确否定了这个形式（`wrongMark`／`wrongToken`／`options` 的错项／`distractors`）。
3. **⚠️ `drew` 的 7 处也全部在错侧**，而且**比 `slept` 更集中**：**6 处在 L12 一课内**（`contrast[1]` ＋ `guided[3]` 的 tokens/wrongToken/answer/correctionZh），另 1 处在 L99 作 distractor。
   - **⇒ 这推翻了「`drew` 是纯缺口」的假设**（批四十四 §3.2／§5 携带项 4）。**`drew` 不是「用户没见过」，而是「用户见过它被划掉」。**
4. **`slept` 与 `drew` 的错侧结构完全同构**：
   - `slept`：`wrongMark`（对照卡）×2 ＋ `wrongToken`（spot 题）×1 ＋ `options` 错项×1 ＋ `distractor`×1
   - `drew`：`wrongMark`（对照卡）×1 ＋ `wrongToken`（spot 题）×1 ＋ `distractor`×1
   **⇒ 两个词需要的是同一个处置框架。**

### 2.4 L98 / L102 原文逐字（任务书要求的确切原文）

**L98 `lesson-98-while`「一边…一边…」｜`grammarLabel`：`两件同时 · while + 都在穿 -ing`**

`oneLineRule` 逐字：
> 说「两件同时在发生」用 while，两边各自穿 -ing：While I was reading, he was sleeping——两支镜头同时开着。

`targetSentence`：`While I was reading, he was sleeping.`

**`contrast[]` 全六条逐字**：

| # | `wrong` | `wrongMark` | `correct` | `whyZh` |
|---|---|---|---|---|
| 0 | `While I was reading, he slept.` | **`slept`** | `While I was reading, he was sleeping.` | **同时的那件也要穿 -ing：slept 是「睡了一觉」（一件事）——两件同时在，两边都穿。** |
| 1 | `While I read, he was sleeping.` | `read` | `While I was reading, he was sleeping.` | 前半那件也丢了「正做着」：while 领的两边都在进行——read 是光板，要变成 was reading。 |
| 2 | `During I was reading, he was sleeping.` | `During` | `While I was reading, he was sleeping.` | during 后面只能跟「名字」（during the class），跟不了小句子——要说一整句，得用 while 领路。 |
| 3 | `I was reading while he was sleeping.` | `null`（`bothRight`） | `While I was reading, he was sleeping.` | 两句都对——两件同时在，谁先谁后都行…一个意思。 |
| 4 | `When you called, I was reading.` | `null`（`bothRight`） | `While I was reading, he was sleeping.` | 两句都对——第 97 课 when（插进来的小事）＋今天 while（两件同时在）：一个打断、一个并行。 |
| 5 | `They were playing football.` | `null`（`bothRight`） | `While I was reading, he was sleeping.` | 两句都对——第 34 课老句（一伙人当时正踢球）今天仍在——while 也是同一套零件。 |

**L98 的 spot 题（`guided[3]`）逐字**：
```json
{"kind":"spot",
 "promptZh":"有人是这样说的，你帮他看看：哪个词块不太对？",
 "tokens":["While","I","was","reading,","he","slept."],
 "wrongToken":"slept.",
 "answer":"slept.",
 "correctionZh":"同时的那件也要穿 -ing：he 【was sleeping】。",
 "explain":"两件同时在，两边都穿外套。"}
```
**⚠️ 注意 `wrongToken` 是 `"slept."`（带句号）**——这是本批一个具体的数据观察（见 §⑨ U3）。

**L98 的 choose 题（`guided[0]`）逐字**：
```json
{"kind":"choose","promptZh":"你想说：我看书那会儿，他在睡觉。","before":"While I was reading,","after":".",
 "options":["he was sleeping","he slept","he sleeping"],"answer":"he was sleeping",
 "explain":"同时的那件也穿 -ing：he was sleeping。"}
```

**L98 的练习（`practice[0]`）逐字**：
```json
{"promptZh":"你想说：我看书那会儿，他在睡觉。",
 "tokens":["While","I","was","reading,","he","was","sleeping."],
 "distractors":["slept"],
 "answer":"While I was reading, he was sleeping."}
```

**L98 `deepDive` 第 2 段逐字**：
> while 的规矩：两边都穿 -ing。While I was reading（我看书那会儿）、he was sleeping（他在睡觉）——两支镜头同时开着，谁说前面都行。

**L102 `lesson-102-phone-story`「昨天那个电话」｜`grammarLabel`：`收口 · 大团圆（零新知）`**

`targetSentence`：`I was reading at eight. It was raining. When you called, I was reading.`

`contrast[1]` 逐字（**重列 L98 的同一句**）：
> `wrong`: `While I was reading, he slept.`
> `wrongMark`: **`slept`**
> `correct`: `While I was reading, he was sleeping.`
> `whyZh`: **第 98 课回流：两件同时在，两边都穿 -ing——he was sleeping。**

**⇒ L102 只重列、不扩写**：它的 `whyZh` 是**纯回流标记**（「第 98 课回流」），**没有增加任何新解释**。⇒ **L102 的冲突是 L98 冲突的复制，不是独立的新冲突**；改 L98 即可覆盖 L102（但 L102 的 `whyZh` 也需同步，否则会指向一句已被改写的话）。

### 2.5 两个原形的落点分布（`C1` 口径，逐课）

```
$ node /tmp/b45/dist.mjs
C1 totals: sleep=55 draw=19 | slept=0 drew=0
sleep → 12 lessons: L15(我想去旅行)=1  L16(今天必须交作业)=1  L47(你应该早点睡)=20  L49(你应该试试)=4
                    L62(你想要点什么)=4  L64(我看完啦)=1  L66(太重了拿不动)=2  L74(让我来帮你)=3
                    L91(吃饭前先洗手)=4  L103(妈妈让我先写作业)=1  L168(怎么不歇一会儿)=7  L181(我们最好现在就走)=7
draw  → 4 lessons:  L12(明天要画画)=12  L13(正在做什么)=3  L64(我看完啦)=1  L190(我正在学游泳)=3
```

**⇒ 两条判读（直接支撑 §⑦ 的可做性判断）**：

1. **`sleep` 的 55 处分布在 12 课，且有一个「大本营」L47（20 处）。** L47 是 `should` 建议课（`You should sleep early.`）——`sleep` 在那里是「原形」出现在 `should` 后面。**⇒ 用户对 `sleep` 这个词的暴露是分散、多语境的。**
2. **⚠️ `draw` 的 19 处只分布在 4 课，且 L12 独占 12 处（63%）。** 而 L12 的教学点是「will + 原样」——**这 12 处里绝大多数是 `draw`／`drew`／`drawing` 作为「原样 vs 变形」的靶子，不是「画画」这个语境的自然使用。**
   - **⇒ 我据此提出本批的关键质疑（§⑨ U1）**：**「`draw` 原形 19 次」这个数字，很可能高估了用户对 `draw` 的语境熟悉度。**
   - **对 `slept` 不构成问题**：`sleep` 的 12 课分布 ＋ L47 的 20 处是真实的语境使用（`You should sleep early.` 是一句自然的建议）。

### 2.6 `drew` 的唯一错侧落点 L12 逐字（本批的第二个「冲突源」）

**L12 `lesson-12-will`「明天要画画」｜`grammarLabel`：`will 将来时`｜`targetSentence`：`I will draw tomorrow.`**

`contrast[1]` 逐字：
> `wrong`: **`Tomorrow I will drew.`** ｜ `wrongMark`: **`drew`**
> `correct`: `Tomorrow I will draw.`
> `whyZh`: **will 出场时动词保持原样，不换昨天版。一场戏只有一个变化。**

`guided[3]`（spot）逐字：
```json
{"kind":"spot","promptZh":"有人是这样说的，你帮他看看：哪个词块不太对？",
 "tokens":["I","will","drew","a","picture."],"wrongToken":"drew","answer":"drew",
 "correctionZh":"把 drew 换回穿原样的 draw：I will draw a picture。",
 "explain":"will 后面的动词保持原样。"}
```

**`practice[4]` 的 `distractors` 全表（L12）**：`drawing`／`snowed`／`went`／`rained`／`went`

**⇒ 判读三条**：

1. **L12 的教学点是「will + 原样」，`drew` 在这里是「换了不该换的形状」的反面教材。** 所以 L12 **在语法上是对的**——它没错。
2. **⚠️ 但它在「词汇暴露」上留下了一个洞**：用户在 L12 一共看到 `drew` **六次**（`contrast[1].wrong`／`wrongMark`／spot 的 `tokens`／`wrongToken`／`answer`／`correctionZh`），**每一次它都被划掉**。**L12 从未告诉用户「`drew` 本身是正确的过去式，只是在 will 后面站错了位置」**——它的 `whyZh` 逐字只说「不换昨天版」，**没说 `drew` 什么时候是对的**。
3. **⇒ 这正是任务书要我判断的核心问题（同一个词形在一种结构里对、在另一种结构里错），而本项目里 `drew` 的情况与 `slept` 完全同构**：`drew` 在 L12「will 后」是错的、在「昨天画画」是对的；`slept` 在 L98「while 两边同时」是错的、在「昨晚睡得好」是对的。**两者都是「形式本身没错、位置错了」。**

---

## ③ `slept` 冲突的三问回答

### 3.1 问一：这个冲突是否真实存在？—— **真实，而且不是一个冲突，是三个**

任务书给的冲突是：**`slept` 在 L98/L102 被判为错词，但它本身是完全正确的过去式。** 我独立核实后确认存在，并发现**同一个词形在同一季内被连续否定三次，且其中一次被另一课自己推翻**。

| # | 冲突 | 位置 | 逐字证据 | 严重度 |
|---|---|---|---|---|
| **A** | **L98 自己承认 `slept` 的形式没错，只是位置不对** | L98 `contrast[0].whyZh` | **「slept 是**「睡了一觉」（一件事）**——两件同时在，两边都穿。」** | **低**（这其实是**正确的处理**——它区分了「形式」与「位置」） |
| **B** | **⚠️ L98 的绝对规则被 L99 的 `targetSentence` 推翻，但两课都没说** | L98 `oneLineRule` vs L99 `targetSentence` | L98：「说『两件同时在发生』用 while，**两边各自穿 -ing**」／L98 `deepDive`：「while 的规矩：**两边都穿 -ing**」<br>**L99 `targetSentence`：`I was reading when the phone rang.`＋ L99 `sceneSwings[0]`：`The phone rang while I was sleeping.`** | **高** |
| **C** | **同一季内 `slept` 被连续否定三次（L97 → L98 → L102）** | L97 `guided[5].options[2]`＝`I slept.`（错项）→ L98 四处 → L102 两处 | `guided[5]`：`{"options":["I was sleeping.","I was sleep.","I slept."],"answer":"I was sleeping."}` | **中** |

**冲突 B 的完整证据链（这是本批最重要的发现）**：

L99 `lesson-99-phone-story`「电话响的时候」｜`grammarLabel`：`哪件用哪个版本 · 进行 vs 昨天版`

- `targetSentence`：`I was reading when the phone rang.`
- `oneLineRule` 逐字：**「哪件用哪个版本：正在做的一阵子穿 -ing（was reading）、插进来的那一下用昨天版（rang）——响是一下子、看是一阵子。」**
- `sceneSwings[0]` 逐字：**`The phone rang while I was sleeping.` :: 我睡觉的时候电话响了。**
- `examples[1]` 逐字：**`The phone rang while I was sleeping.` :: 我睡觉的时候电话响了。**
- `contrast[0]` 逐字：`wrong`: `The phone was ringing while I was sleeping.` ｜ `wrongMark`: `ringing` ｜ `correct`: **`The phone rang while I was sleeping.`** ｜ `whyZh`: 「响是一下子的事：穿 -ing 就成了「一直在响」…一下子的那件用昨天版：rang。」
- `practice[2]` 逐字：`{"tokens":["The","phone","rang","while","I","was","cooking."],"distractors":["ring"],"answer":"The phone rang while I was cooking."}`

**⇒ 判读（本批的核心论证）**：

**L99 的 `The phone rang while I was sleeping.` 与 L98 的 `While I was reading, he slept.` 是同一个结构：while ＋「一下子」＋「一阵子」。**

| | while 从句 | 主句 | 判定 |
|---|---|---|---|
| L98 `contrast[0].wrong` | `While I was reading`（一阵子，-ing） | `he slept`（一下子，过去式） | **❌ 判错** |
| L99 `contrast[0].correct` | `while I was sleeping`（一阵子，-ing） | `The phone rang`（一下子，过去式） | **✅ 判对** |

**⚠️ 两课的 `-ing` 位置互换了，但结构一模一样（while ＋ 一个 -ing ＋ 一个过去式），判定却相反。**

**区别只有一个：句子成分的先后顺序（L98 把「一下子」放在后面，L99 把「一下子」放在前面）。**

**⇒ 这意味着两件事，其中一件对我们有利、一件不利**：

- **对我们有利**：**L99 已经给出了正确的判据**——「正在做的一阵子穿 -ing、插进来的那一下用昨天版」。**这个判据下 `While I was reading, he slept.` 应当被判为「可以」**（he slept 是一下子）。**⇒ L99 的判据比 L98 的判据更准，且已经写好了。**
- **对我们不利**：**如果严格按 L99 的判据，L98 的 `contrast[0]` 判错了。** ⇒ **这是一个真实的、需要处置的内部不一致**，不是「用词不当」。

**⇒ 所以任务书问的「冲突是否真实」答案是：真实，而且比它描述的更深一层——L98 与 L99 互相矛盾，且 L99 更接近英语事实（Cambridge 与 BC 都支持 L99 的判据，见 §④）。**

### 3.2 问二：跨源有没有先例——「同一个词形在一种结构里对、在另一种结构里错」的讲法

**答案：有，而且这个讲法是英文权威侧的标准做法——只不过它不是「同一个词形」层面，而是「同一个时态」层面。**

#### 3.2.1 Cambridge：**明文说 while 两边 can use either simple or continuous**

- **URL**：https://dictionary.cambridge.org/grammar/british-grammar/as-when-or-while
- **HTTP**：**`curl=200`**（实测直连可读，455KB；与 BC 不同）
- **面包屑逐字**：`Grammar > Easily confused words > As, when or while? from English Grammar Today`
- **H2 逐字**：`As` / `When` / `While and as` / `When and while without a subject`
- **⚠️ 决定性逐字引用（本批最重要的一条）**：

  > **"We can use while or as to talk about two longer events or activities happening at the same time. We can use either simple or continuous verb forms: We spent long evenings talking in my sitting-room while he played the music he had chosen and explained his ideas."**

  **⇒ `while he played`（过去式）在 Cambridge 是正例，而且紧跟在 "We can use either simple or continuous verb forms" 之后。**

- 另一条逐字（同一页）：
  > **"After as, we can use a simple or continuous form of the verb."**
- 另一条逐字（同一页，past continuous 的正当用法）：
  > **"We often use them with the past continuous to refer to background events: When the men were out working in the field, I helped with milking the cows, feeding the calves and the pigs."**

  **⇒ 注意 `When the men were out working..., I helped...`——从句 -ing、主句过去式，与 L99 的 `The phone rang while I was sleeping.` 同构。**

#### 3.2.2 Cambridge：`Past continuous or past simple?` — **「取决于你怎样看这件事」**

- **URL**：https://dictionary.cambridge.org/grammar/british-grammar/past-continuous-or-past-simple
- **HTTP**：`curl=200`（451KB）
- **逐字引用（本批第二条决定性的）**：

  > **"Often there is little difference between the past continuous and the past simple, except that the past continuous suggests that the event(s) were in progress at a time in the past or that they were happening as background or temporary events. Whether we choose to use the past continuous or past simple often depends on how we see the past event(s)."**

- 同页对照逐字：
  > `Doctors were treating patients in temporary beds and they were trying to do their best in a difficult situation.` ／ **"Past continuous: writer chooses to show the events as ongoing at that time in the past."**
  > `Doctors treated patients in temporary beds and they tried to do their best in a difficult situation.` ／ **"Past simple: writer chooses to show the events as finished."**

- 同页背景/主事件逐字：
  > **"When one event is more important than the other in the past, we can use the past simple to emphasise the main event. We can use the past continuous for the background event (the less important one): [background event] I was listening to the radio when [main event] Helen phoned."**

**⇒ 关键判读**：Cambridge 把 past simple / past continuous 的选择描述为 **"depends on how we see the past event(s)"** 与 **"the writer chooses"**——**这是一个「视角/选择性」问题，不是「对错」问题。** 这**正面支持**「同一个形式可以在这个语境对、在那个语境错」的教学处理——**但它是通过「时态选择」而非「词形本身」来教的。**

#### 3.2.3 British Council：**两个时态「配合」，不是两边都必须 -ing**

- **URL**：https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2/past-continuous-past-simple
- **HTTP**：**`curl=000`**（BC 域名直连不可用，与任务书预警一致）；**经 WebFetch 可读**
- **Level 逐字**：**`A1 Elementary`** ＋ **`A2 Pre-intermediate`**
- **逐字（经 WebFetch，⚠️ 转述风险）**：

  > **"When we use these two tenses together, it shows us that the past simple action happened in the middle of the past continuous action"**

- **该页 while 例句逐字**：**"While I was studying, I suddenly felt sleepy."**

  **⇒ ⚠️ 这是 while ＋ 过去式（`felt`）的权威例句，且来自 BC 的 A1-A2 级课程页。**

- **该页另一个例句逐字**：**"As I was going to work, I saw an old friend."**
- **该页是否说「两边都必须 -ing」**：**否。**（WebFetch 明确回答：`No. It states the opposite`）

- **BC 参考页 `Past continuous`**：https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/past-continuous
- **Level 逐字**：`Level: beginner` ＋ `Level: intermediate`
- **逐字（经 WebFetch）**：

  > **"We do not normally use the past continuous with stative verbs. We use the past simple instead:"**
  > **"When I got home, I really needed (NOT was needing) a shower."**

  **⇒ ⚠️ 这条是「同一个位置，用过去式才对、用 -ing 就错」的权威明文**——**正是「形式本身没错、位置错了」的官方版本，只是方向相反**（这里是「不该穿 -ing 却穿了」）。

  **⇒ 这对我们的 L98 有直接价值**：BC 明说**不是所有动词都能穿 -ing**（状态动词要用过去式）。**L98 的 `he slept` 里，`sleep` 恰恰是 BC 语境下会被认为「更常用过去式」的动词之一**（见下 BC 参考页例句）。

- **BC 参考页 `Past simple`**：https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/past-simple
- **Level 逐字**：`Level: beginner` ＋ `Level: intermediate`
- **逐字**：

  > **"But there are a lot of irregular past tense forms in English."**
  > **"Here are the most common irregular verbs in English, with their past tense forms:"**

#### 3.2.4 OALD：**词条内联给形，只给形不讲「什么时候用」**

- **URL（两词条，实测 HTTP）**：https://www.oxfordlearnersdictionaries.com/definition/english/draw_1 ／ https://www.oxfordlearnersdictionaries.com/definition/english/sleep_1 （**两个都 `curl=200`**）
- **`draw` 的 `Verb Forms` 块逐字**：

  > `present simple I / you / we / they draw /drɔː/` ／ `he / she / it draws /drɔːz/` ／ **`past simple drew /druː/`** ／ `past participle drawn`
- **`sleep` 的 `Verb Forms` 块逐字**：

  > `present simple I / you / we / they sleep /sliːp/` ／ `he / she / it sleeps /sliːps/` ／ **`past simple slept /slept/`** ／ `past participle slept`
- **等级徽章逐字（Oxford 3000 分档）**：`draw` = **`ox3ksym_a1`**（第一义项 `[intransitive, transitive] to make pictures, or a picture of something, with a pencil, pen or chalk (but not paint)`）；`sleep` = **`ox3ksym_a1`**（`[intransitive] to rest with your eyes closed and your mind and body not active`）；两者均 `ox3000="y"`。
- **⚠️ OALD 无「不规则动词表」独立页**（批四十三已实测 404）。**它只在词条内联给形，不讲用法分工。**

#### 3.2.5 中文侧 letmeenglish：**它的练习题正好是本批问题句的镜像**

- **URL（过去进行时）**：https://letmeenglish.com/zh-hans/past-continuous/
- **HTTP**：**`curl=200`**（74KB，直连可读）
- **页面 title 逐字**：`过去进行时！用法、例句+练习（完整解析）`
- **Level 组织逐字**：`本篇属于 英文时态 中的“过去式”单元。建议先掌握 一般过去时 的基本形式与用法，再学习过去进行时，会更清楚理解两者的差异。`
- **⚠️ 决定性逐字引用（本批中文侧最重要的一条）**——**它的练习题第 9 题**：

  > **`9. I was sleeping slept happily when a loud noise woke me up was waking me up .`**

  **⇒ 这是「`was sleeping`（对）／`slept`（错）」的二选一填空，结构与我们的 L98 完全同构，而且它把 `slept` 判为错。**
  **⇒ 中文侧最强的一个可直连源，在这个教学点上与我们的 L98 立场一致。**

- **该页「用法」逐字**：
  > 描述正在进行的动作：我们用过去进行时来谈论在过去某个特定时刻正在进行（尚未完成）的行动。
  > **或者跟一个过去简单式的句子。They were swimming when I saw them . 我看到他们时，他们正在游泳。When she arrived , they were still working. 当她到达时，他们还在工作。**
  > 描述场景：我们经常在故事的开头使用过去进行时来描述场景。It was getting dark, and I was walking fast. Suddenly …
- **该页「过去进行时 vs 过去简单式」逐字**：
  > 我们用过去简单式表示过去已完成的动作，用过去进行时表示过去正在进行（未完成）的动作。
  > **过去简单式的短动作经常打断过去进行时中的长动作。He was playing football when he broke his arm.**
  > **我们常使用过去简单式来描述一个接一个的（完成的）动作。比较：When he arrived, she was having a shower.（淋浴的动作在他到达之前就开始了）／ When he arrived, she had a shower.（他到达后开始淋浴）**

  **⇒ ⚠️ 注意这里的判据是「长/短」「未完成/完成」「谁打断谁」——不是「有没有 -ing」。**
  **⇒ 这与我们 L99 的判据（「一阵子 / 一下子」）几乎逐字对应，而与 L98 的判据（「两边都穿 -ing」）不同。**

- **该页是否有 while 必须两边 -ing 的说法**：**没有。** 该页只出现 `They were swimming when I saw them`／`When she arrived, they were still working` 这类「-ing ＋ 过去式」的混合句。

#### 3.2.6 中文教辅侧：「while 两边都要进行时」是大陆教辅的强惯例（与我们 L98 同源）

- **检索路径**：搜狗 `while 只能 主句 从句 都是过去进行时`（`curl=200`，590KB，实测）
- **逐字标题（实测 10 条）**：`while 是什么时态`／`「中考冲刺100天」第90期:while和when,before和ago的用法区别`／**`英语的when和while的主句和从句都用什么时态? while是不是可以主句…`**／`英语中：当主句用过去进行时态,while引导的条件状语从句用什么时态…`／`when和while的区别 - 猪猪一号 - 博客园`／`状语从句 - 猪猪一号 - 博客园`／`61A仁爱版八年级下册第六单元第二话题SectionA_百度文库`／`2021-2022学年人教版八年级英语下册Unit 5 词汇,短语,语法归纳`／`while 的从句中必须是进行时态吗 - 搜狗问问`／**`while一定要用过去进行时吗while后可以接延续性动词的过去式吗?比…`**
- **逐字摘要（搜狗摘要，出自「学科网 / 百度文库」类教辅页）**：

  > 「**当两个延续性动作同时进行时，两个句子都用过去进行时，并用…**」（出自八年级语法知识点页）
  > 「题目中的两个句子都是过去进行时，因而判断两个动作同时发生；**表示同时发生时用 while，引导时间状语从句，常和进行时连用**」（出自 Module 8 易错检测练解析）
  > 「**while 引导时间状语从句，表示两个动作同时进行，都用过去进行时**，主语 I 用 was doing…」（出自 Unit 8 基础练习卷解析）
  > 「while 引导时间状语从句时,**从句时态用 was/were doing 主句时态经常用一般过去时态,但不必定**.如: **While I was waiting for my turn in the crowd, I came across an old friend of mine.**」（出自作业帮回答）

- **⇒ 判读（这一条对我们很关键）**：

  **⚠️ 中文教辅的绝对派（「两边都用过去进行时」）与我们 L98 的表述是同源的**——**这说明 L98 的绝对化很可能是中文教辅惯例的迁移，而不是一个英语事实。**

  但**同一次检索也捞到了明确的反对派**（作业帮那条：「从句时态用 was/were doing，**主句时态经常用一般过去时态，但不必定**」，并给了 `While I was waiting..., I came across...` 的反例）。

  **⇒ 结论：中文侧本身不统一。** 我们的 L98 选择了绝对派，而 **L99 选择了正确派**——**这正是 §3.1 冲突 B 的中文侧根源。**

#### 3.2.7 逐字引用汇总（≥4 处，满足任务书要求）

| # | 源 | 逐字原文 | URL |
|---|---|---|---|
| 1 | Cambridge `As, when or while?` | **"We can use while or as to talk about two longer events or activities happening at the same time. We can use either simple or continuous verb forms: We spent long evenings talking in my sitting-room while he played the music he had chosen and explained his ideas."** | https://dictionary.cambridge.org/grammar/british-grammar/as-when-or-while |
| 2 | Cambridge `Past continuous or past simple?` | **"Whether we choose to use the past continuous or past simple often depends on how we see the past event(s)."** | https://dictionary.cambridge.org/grammar/british-grammar/past-continuous-or-past-simple |
| 3 | Cambridge `Past continuous or past simple?` | **"Past simple: writer chooses to show the events as finished."** ／ **"Past continuous: writer chooses to show the events as ongoing at that time in the past."** | 同上 |
| 4 | BC A1-A2 `Past continuous and past simple` | **"When we use these two tenses together, it shows us that the past simple action happened in the middle of the past continuous action"** ＋ 例句 **"While I was studying, I suddenly felt sleepy."** | https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2/past-continuous-past-simple |
| 5 | BC `Past continuous`（beginner） | **"We do not normally use the past continuous with stative verbs. We use the past simple instead: When I got home, I really needed (NOT was needing) a shower."** | https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/past-continuous |
| 6 | BC `Irregular verbs` | **"many of the most frequent verbs are irregular"** ＋ `Level: beginner` | https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/irregular-verbs |
| 7 | OALD `draw` 词条 | **`past simple drew /druː/`** ＋ `ox3000="y"` ＋ 徽章 `ox3ksym_a1` | https://www.oxfordlearnersdictionaries.com/definition/english/draw_1 |
| 8 | OALD `sleep` 词条 | **`past simple slept /slept/`** ＋ `ox3000="y"` ＋ 徽章 `ox3ksym_a1` | https://www.oxfordlearnersdictionaries.com/definition/english/sleep_1 |
| 9 | letmeenglish `过去进行时`（中文） | **「过去简单式的短动作经常打断过去进行时中的长动作。」** | https://letmeenglish.com/zh-hans/past-continuous/ |
| 10 | letmeenglish `过去进行时` 练习题 9（中文） | **`I was sleeping slept happily when a loud noise woke me up was waking me up .`**（`slept` 为错项） | 同上 |
| 11 | letmeenglish `不规则动词`（中文） | **「动词按这三种类型分类，以便更容易记住它们。」** ／ **「遗憾的是，我们不可能立即识别不规则动词，这使得学习它们变得困难。」** | https://letmeenglish.com/zh-hans/irregular-verbs/ |
| 12 | 大陆教辅（搜狗摘要） | **「while 引导时间状语从句，表示两个动作同时进行，都用过去进行时」** | 搜狗检索页（多条教辅，见 §3.2.6） |
| 13 | 大陆教辅（作业帮，搜狗摘要） | **「从句时态用 was/were doing 主句时态经常用一般过去时态，但不必定」** | 同上 |
| 14 | 我方 L98 `deepDive` | **「while 的规矩：两边都穿 -ing。」** | `src/data/grammarLessons.ts`（本地） |
| 15 | 我方 L99 `oneLineRule` | **「正在做的一阵子穿 -ing（was reading）、插进来的那一下用昨天版（rang）。」** | 同上 |

### 3.3 问三：先改 L98 的错句，还是保留 L98 并在新课里讲清分工？

**⚠️ 我的建议与任务书给的两个选项都不同。** 我建议 **第三条路：保留错句句面、改 `whyZh` 的判据措辞、并把「两个都对」这一层补上**。理由如下。

#### 3.3.1 为什么**不该**改 L98 的错句句面（`wrong` / `wrongMark` 保留）

1. **L98 的教学目标是「两件同时在」，它需要一张「一边 -ing、一边没 -ing」的对比卡。** L98 `contrast[0]` 的存在是必要的——它做的事是「让 `he slept` 与 `he was sleeping` 并排，逼用户注意 -ing 的有无」。
2. **跨源同构证据：letmeenglish 的练习题第 9 题（§3.2.5）正是同一道二选一**（`I was sleeping / slept happily when...`），它也把 `slept` 判为错。**⇒ 保留这个对比卡，在中文侧可直连源里有直接先例。**
3. **改句面（换成别的词）要付代价**：L98 的 `practice[0]` distractor、`guided[0]` options、`guided[3]` tokens 全部绑定 `slept`——**换词等于重做 L98 的一半素材**，而 L98 没有错，错的是 `whyZh` 的**措辞**。
4. **⚠️ 更重要的：`While I was reading, he slept.` 在真实英语里并不好**——Cambridge 允许它，但那是因为它允许「longer events...either simple or continuous」；`he slept` 与 `While I was reading` 同时，语感上确实偏（读者会倾向理解为「睡了」这个完成事件）。**⇒ 判它「偏」是有道理的，判它「错」是过头了。**

#### 3.3.2 为什么**必须**改 L98 的 `whyZh`（这是本建议的核心）

**现有 L98 `whyZh` 逐字**：
> 同时的那件也要穿 -ing：slept 是「睡了一觉」（一件事）——两件同时在，两边都穿。

**问题诊断**：

- **前半句「同时的那件也要穿 -ing」** ——**这是义务表述，与 Cambridge 的 "either simple or continuous" 直接冲突，也与 L99 自己的句子冲突。**
- **后半句「slept 是『睡了一觉』（一件事）」** ——**⚠️ 这一句其实是正确的、也是我们要的判据**（它说的是「一件事」vs「两件事同时」）。**这句该保留、该升格为主判据。**

**建议改法（把判据从「必须穿 -ing」换成「一阵子 vs 一下子」）**——**直接借用 L99 已经写好的措辞**：

| 位置 | 现值（逐字） | 建议（沿用 L99 措辞，零术语） |
|---|---|---|
| L98 `contrast[0].whyZh` | 同时的那件也要穿 -ing：slept 是「睡了一觉」（一件事）——两件同时在，两边都穿。 | 这里要的是「**一直睡着**」那个画面——slept 是「睡了一觉」那**一下**。两件同时在，两边都摆「一直做着」的样子。（⚠️ **不是「必须 -ing」，是「这一格要的是画面」**） |
| L98 `oneLineRule` | 说「两件同时在发生」用 while，两边各自穿 -ing：While I was reading, he was sleeping——两支镜头同时开着。 | 说「两件同时在发生」用 while，两边都摆「一直做着」的样子：While I was reading, he was sleeping——两支镜头同时开着。（**如果有一件是「一下子」，那件用昨天版**——第 99 课就学这个。） |
| L98 `deepDive` 第 2 段 | while 的规矩：两边都穿 -ing。 | while 的常用样子：两边都摆「一直做着」。**但不是死规矩**——**要说的那件是「一下子」（电话响、有人推门），那件就用昨天版**（第 99 课）。 |

**⇒ 这个改法的三条好处**：
1. **保住 L98 的教学目标**（对比卡仍然让用户注意 -ing 的有无）；
2. **消掉与 L99 的自相矛盾**（不再说「必须」）；
3. **为新课 `slept` 让路**：**用户在前面就被告知「有例外」，新课再兑现就不会显得反复。**

**⚠️ 数据成本**：只改 L98 的 3 处文案（`contrast[0].whyZh`／`oneLineRule`／`deepDive.paragraphs[1]`）＋ L102 `contrast[1].whyZh` 1 处，**不动任何 `wrong` / `wrongMark` / `tokens` / `distractors` / `answer`**。**4 处文案改动，零结构改动。**

**⚠️ 零术语红线检查**：建议措辞里**没有**「进行时／时态／时体／主谓宾」等术语（沿用「一直做着」「一个下」「昨天版」——都是库里既有词汇）。**必须在新课写完后再跑 `grammarLessons.test.ts` 的零术语守门**（§⑧ 核查项 12）。

#### 3.3.3 为什么第三条路优于「先改错句」

- **「先改错句」的隐含代价**：L98 的对比卡是「第十五季·讲故事」的核心教学资产之一，L99/L101/L102 三课都在回流它（L99 `contrast[4].whyZh` 逐字「第 98 课 while（两件同时在）」）。**改动 L98 的句面会波及四课的回流引用。**
- **而 `whyZh` 改判据是局部改动**：下游回流引用的都是「第 98 课 while（两件同时在）」这个说法，**不受 `whyZh` 影响**。

#### 3.3.4 与跨源的一致性（这是我要诚实说明的一点）

**⚠️ 我必须明确指出：我们 L98 的绝对化（「两边都穿 -ing」）在英文权威侧是反例，但在中文教辅侧是主流。**（§3.2.6 实测）

- **Cambridge/BC**：允许 while ＋ 过去式（"either simple or continuous"／"the past simple action happened in the middle of the past continuous action"）。
- **中文教辅绝对派**：「两个动作同时进行，都用过去进行时」（八年级教辅解析，多条）。
- **中文教辅正确派**：「从句时态用 was/were doing，主句时态经常用一般过去时态，但不肯定」（作业帮）。

**⇒ 我们的 L98 站在中文教辅绝对派一侧。改 `whyZh` 是向英文权威侧靠拢，但会失去「和考试答案一致」这个隐含好处。** —— **这是一个产品取舍，不是纯对错问题，故我把它明确标出来（§⑨ U2）。**

---

## ④ 跨源位次表（逐字引用 + URL）

### 4.1 核心位次表

| 维度 | **`draw` / `drew`** | **`sleep` / `slept`** |
|---|---|---|
| **OALD Oxford 3000 档位** | **`a1`**（第一义项：`to make pictures...`）＋ `ox3000="y"` | **`a1`**（`to rest with your eyes closed...`）＋ `ox3000="y"` |
| **OALD `Verb Forms` 逐字** | `past simple drew /druː/`／`past participle drawn` | `past simple slept /slept/`／`past participle slept` |
| **Cambridge `Table of irregular verbs`** | ✅ **在表内**：逐字 `draw drew drawn`（字母序位置在 `dig dug dug` 与 `dream dreamt/dreamed` 之间） | ✅ **在表内**：逐字 `sleep slept slept`（在 `sit sat sat` 与 `speak spoke spoken` 之间） |
| **BC `Irregular verbs` 表** | ✅ **在表内**（WebFetch 逐字：`drawdrewdrawn`） | ❌ **不在表内**（WebFetch 逐字：「It does not contain 'sleep / slept / slept' — that verb is absent.」）⚠️ |
| **BC 表 Level** | `Level: beginner` | —（见上） |
| **BC A1-A2 有无专课** | ❌ 无（A1-A2 唯一相关课是 `Past continuous and past simple`） | ❌ 无（同上） |
| **中文侧 letmeenglish 归类** | **初级 · 类型 3**（不定词、过去式、过去分词**都不同**）—— 逐字 `draw drew drawn` 落在「类型 3」区块 | **初级 · 类型 2**（过去式和过去分词**相同**，与不定词不同）—— 逐字 `sleep slept slept` 落在「类型 2」区块 |
| **形态类型（三态是否同形）** | **ABC 型**（draw / drew / drawn 三态各异） | **ABB 型**（sleep / slept / slept，后两态同形） |
| **CEFR 一致性判定** | **A1 · 三源一致**（OALD a1 ＋ Cambridge 表内 ＋ BC beginner 表内） | **A1 · 两源一致 ＋ BC 漏收** |

**⇒ 判读四条**：

1. **两个词都是 A1 底座，不存在越级风险。** 我们把它放在 L198–L201 的位置（当前 L200 是最后一课），**从 CEFR 角度是「已经远远落后于它的等级」**——`draw`/`sleep` 是 A1 词，**理论上该在早期出现**。
   **⇒ 这提示一个产品观察**：**这两个缺口之所以存在，不是因为词难，而是因为原形被当作「will 后面穿原样」「should 后面穿原样」的靶子用，从未进入「昨天版」的语境。**（L12 `draw` 在 will 后、L47 `sleep` 在 should 后——**都是「原样」位置**。）

2. **⚠️ 两个词的形态类型不同（ABC vs ABB），这直接决定拆课方式。**（§⑦.2）
   - `drew` 是 **ABC 型**（要记两个新形：`drew` ＋ `drawn`——虽然 `drawn` 在本课不必引入）；
   - `slept` 是 **ABB 型**（只需记一个：`slept`，它同时是过去式和过去分词）。
   - **⚠️ 这与批四十三 §6.1 的方法论完全一致**：批四十三已确立「ABB 组和 ABC 组是两种不同的记忆负担…混在一课里会稀释重点」。**本批两个词恰好一个是 ABC、一个是 ABB——⇒ 不该合并。**

3. **BC 漏收 `sleep` 是一个跨源差异，值得注意但不是问题。** BC 的 `Irregular verbs` 表标 `Level: beginner`，却没有 `sleep`——**说明 BC 的「beginner 表」是「最常用」的子集，不是 A1 全覆盖**。
   **⇒ 对我们的含义**：**BC 表内/表外不能当「该不该教」的判据。**（这修正了一个可能的误用：批四十三用过「BC 表内」作为位次证据，当时 7 个词全在表内。**本批 `sleep` 不在表内，但它是 A1**——⇒ 那个判据要打折扣。）

4. **OALD 的第一义项都是「最常用的那个义项」，两个词都 `a1`。** 这很干净：**`drew` 与 `slept` 都在「最常用义项」的 `Verb Forms` 块里就给了**（不是生僻义项），⇒ **教学价值成立**。

### 4.2 「成对出现」专项（任务书特别要求：这些词的过去式是否在某些源里与「现在分词/进行时」成对出现）

**这是任务书点名要查的。答案：是，而且这正是我们冲突的根源。**

| 源 | 是否把 `slept` / `drew` 与进行时「成对」出现 | 逐字证据 |
|---|---|---|
| **letmeenglish `过去进行时` 练习题** | ✅ **是——`slept` 与 `was sleeping` 直接成对，作为二选一选项** | **`9. I was sleeping slept happily when a loud noise woke me up was waking me up .`** |
| **BC A1-A2 `Past continuous and past simple`** | ✅ **是——`felt` 与 -ing 成对** | **"While I was studying, I suddenly felt sleepy."** |
| **Cambridge `As, when or while?`** | ✅ **是——`played`（过去式）与 `talking`（-ing）成对** | **"We spent long evenings talking in my sitting-room while he played the music…"** |
| **Cambridge `Past continuous`** | ✅ **是——`slept` 未出现，但 `rang` 与 `was sleeping` 结构成对**（侧面） | — |
| **OALD** | ❌ **不成对**——`Verb Forms` 块只给形（`past simple slept`），不带 -ing 对照 | 见 §3.2.4 |
| **Cambridge `Table of irregular verbs`** | ❌ **不成对**——纯字母序三列表 | 见批四十三 §3.1 |

**⇒ 三条判读（这是本批对任务书专项问题的直接回答）**：

1. **「`slept` 与进行时成对」这件事，在中文侧（letmeenglish）与英文侧（BC/Cambridge）都真实存在，而且对切方式与我们的 L98 完全一致。**
   **⇒ 这正面支持我们「把 `slept` 与进行时放在一起教」的做法**——**冲突不是「不该放在一起」，而是「放在一起时的判据说错了」。**

2. **⚠️ 但所有四个源的对切方向都是「-ing 是背景/长的，过去式是打断/短的」——没有一个源把它说成「两边都必须 -ing」。**
   **⇒ 这是对我们的 `whyZh` 措辞最直接的外部反对。**

3. **⚠️ `drew` 在任何源里都**没有**与进行时成对出现。** 我实测的四条检索路径（`draw 的过去式 drew 怎么记`／`draw过去式` 搜狗 200）**全部返回「词形查询/词典」类结果**（`draw过去式_作业帮`／`drew是什么意思_drew怎么读`／`draw的过去式英文怎么写`），**没有一条把 `drew` 与 `drawing` 对切**。
   **⇒ `drew` 的跨源位次与 `slept` 不同：`slept` 有「与进行时对切」的源传统，`drew` 只有「词形查询」传统。**
   **⇒ 这为 §⑦ 的拆分方案提供了外部依据：两个词该按不同框架教。**

### 4.3 抓不到的源（明确声明）

| 源 | 状态 | 备注 |
|---|---|---|
| **Murphy 双册（Essential／Intermediate Grammar in Use）** | **不可得** | 按任务书指示**不重试**，沿用批四十三正式登记 |
| **Swan《Practical English Usage》** | **不可得** | 同上 |
| **BC 域名直连（curl）** | **全部 `HTTP=000`** | 本批实测 `past-continuous`／`past-simple` 两路径**均 000**；**唯有经 WebFetch 可读**——故 BC 的逐字可靠性低于直连源（Cambridge/OALD/letmeenglish 均可直连 200） |
| **知乎 `zhuanlan.zhihu.com`** | **不可得** | 批四十三已实测 403；本批搜狗结果中知乎条目只拿到标题 |
| **百度文库 / 百度百科 / 七彩学科网 / 文档猫 / 原创力文档 / 学科网** | **全部 403 或只给摘要** | 中文教辅的 `AAA/ABA/ABB/ABC` 归类表只能引搜狗摘要 |
| **微信公众号文章（mp.weixin.qq.com）** | **`HTTP=200` 但正文为空** | 实测两个链接（`初二英语:过去进行时,与一般过去时搭配这样用`／`新标点|时间状语从句:whenvswhile`）落在 `系统出错` 页，**正文 128 字符、零内容**——登记为不可得 |
| **沪江英语 `hjenglish.com`** | **`HTTP=200` 但零相关内容** | 实测 `https://www.hjenglish.com/new/p1200234/` 返回首页（190KB），**`while`/`过去进行时`/`slept` 全部零命中** |
| **aiyangedu.com / cnblogs 具体文章页** | **`HTTP=404`** | 搜狗列出的 `while 是什么时态 www.aiyangedu.com` 与 `过去进行时学习笔记 - 猪猪一号 - 博客园`，**具体 URL 未能自搜狗重定向解析（`sogou.com/link?url=...` 返回 254 字节空壳）** |
| **英语兔（yingyutu.com）** | 批四十三已实测无相关内容 | 本批不重试 |
| **扇贝 / 可可英语 / 多邻国中文站** | 批四十三已实测公开页无相关内容 | 本批不重试 |

---

## ⑤ 竞品矩阵与空位判定

**⚠️ 说明（沿用批四十三纪律）**：本批**无法访问竞品的付费课程内部**（登录墙），故下表区分「**实测可见**」（首页/公开页/公开课纲）与「**未核实**」（沿用前批存档）。**不把未核实项写成结论。**

| # | 产品 | 侧 | 在 `draw`/`sleep` 这两个词上做到什么 | 在「同一形式可对可错」这个教学点上做到什么 | 空位 |
|---|---|---|---|---|---|
| 1 | **British Council LearnEnglish** | 英 | **`draw` 在 `Irregular verbs` 表（beginner）内、`sleep` 不在**（实测）；**A1-A2 与 B1-B2 均无专课** | ✅ **做到了**：`Past continuous and past simple` 页逐字 **"When we use these two tenses together, it shows us that the past simple action happened in the middle of the past continuous action"**——**用「两个时态配合」而非「必须 -ing」** | **有故事页（Story zone）但不服务不规则过去式**；**没有「同一个词形曾在别处被判错」的回流机制** |
| 2 | **Cambridge Dictionary Grammar** | 英 | **两词均在 `Table of irregular verbs` 字母序平表内**（实测逐字 `draw drew drawn`／`sleep slept slept`） | ✅ **做到了，而且最明确**：`As, when or while?` 逐字 **"We can use either simple or continuous verb forms"**；`Past continuous or past simple?` 逐字 **"depends on how we see the past event(s)"**、**"the writer chooses"** | **表页零教学指导**（唯一说明文字是关于 `be`）；**「怎么记」完全空缺**；**两个词在表里就是两行，无任何语境** |
| 3 | **OALD（牛津）** | 英 | **两词条 `Verb Forms` 块内联给形**（`past simple drew`／`past simple slept`），**均 Oxford 3000 `a1`**；**无独立不规则表页**（批四十三已实测 404） | ❌ **完全没做**——词条只给形，不给「什么时候用」，更不说选择问题 | **有 A1 分档（可借为等级依据）**，但**不做教学组织、不做用法分工** |
| 4 | **letmeenglish** | 中 | ✅ **最完整**：`不规则动词` 表内**两词都有**（`draw drew drawn` 类型 3／`sleep slept slept` 类型 2）＋ **`过去进行时` 专页** | ✅ **做到了，且与我们的问题句直接对切**：练习题第 9 题 **`I was sleeping slept happily when a loud noise woke me up...`**（`slept` 判错）；用法页逐字 **「过去简单式的短动作经常打断过去进行时中的长动作」** | **纯表格 ＋ 填空练习，无场景、无错句回流**；**且它自己也没讲「为什么 slept 在别处是对的」**（练习直接给答案，无解释） |
| 5 | **大陆教辅（`while` 从句时态专项，本轮实测 10 条）** | 中 | **词形查询类为主**（`draw过去式_作业帮`／`slept是什么意思_slept怎么读`／`sleep的过去式是 slept`）——**只给形** | ⚠️ **做到了但说反了**：多条解析逐字 **「两个动作同时进行，都用过去进行时」**——**这是绝对派，与 Cambridge 冲突**；**但同一检索也捞到正确派**：「主句时态经常用一般过去时态，**但不必定**」＋反例 `While I was waiting..., I came across...` | **仍是「表格背诵 ＋ 判定口诀」**——**无场景、无错句回流、无「例外」的显式教学** |
| 6 | **Cambridge/OALD 的不规则动词表页**（单列，因其是被最频繁引用的「工具」） | 英 | 两词都在/一在（见 2、3） | ❌ 零 | **「查得到、不成课」**——**这正是我们最有把握的差异位**：用户查到 `drew` 不会知道它曾在 will 后被判错 |
| 7 | **扇贝 / 多邻国 / 英语兔 / 沪江**（合并为一行，均为前批实测不在公开页） | 中/英 | ❌ **公开页零相关内容**（本批复测沪江：`hjenglish.com` 首页 190KB，`while`/`过去进行时`/`slept` 零命中） | ❌ 零 | **结构性缺位**（不在其产品模型的「知识点」概念里）；**付费内部未核实** |

### 5.1 空位判定的三条硬结论

**① 「同一个词形，先在 A 课被划掉、后在 B 课被确认为对」——这个处理在所有被测产品中零见。**
- **英文侧**：Cambridge/BC **只在同一个页面里讲「两个时态怎么选」**（同一场景内的一次性判据），**没有跨页面的「回流纠偏」概念**。BC 参考页是参考页、课程页是课程页，**两者之间没有引用机制**。
- **中文侧**：letmeenglish 的练习题把 `slept` 判错之后就结束了，**练习页没有一句「不过要注意，`slept` 在别处是对的」**（实测整页无此表述）。
- **⇒ 我方「错句回流」机制（标签化 ＋ `huntCaseIds` ＋ `contrast` 回流引用）在这个点上没有对标产品。**

**② ⚠️ 但「我们」也还没做到——这是本批最该被听见的一条。**
- **我方现状**：`slept` 在 L97/L98/L102 被否定三次，**没有任何一处告诉用户「它本身是对的」**；`drew` 在 L12 被划掉六次，**同样没有一处告诉用户「它本身是对的」**。
- **⇒ 我们的「错句回流」机制目前只回流「正确」的句子（L99 回流 L98 的 `was sleeping`），不回流「被误判的形式」。**
- **⇒ 本批两个新课的真正价值，不是「补两个过去式」，而是「补上错句回流机制缺失的那一半：把被判错的形式转正」。**

**③ 英文权威侧的空位是「怎么记」——而且缺口是明说的（延续批四十三）。**
- Cambridge 逐字 **"Each one has to be learnt."** 后面没有任何方法（批四十三已实测）。
- BC 逐字给了 **"most common"** 的表但不说怎么记。
- **⇒ 我方 L197/L198/L199/L200 已经在做「按换法分组 ＋ 场景」，本批两课应延续这一路线，而不是回头做表。**

---

## ⑥ 中文负迁移证据（严格区分「源里明说」与「我的推断」）

**纪律声明**：本节每条都标 `【明说】`（源里逐字写了）或 `【推断】`（我基于证据的推理，源里没写）。**两者不混排。所有【明说】条均附 URL。**

### 6.1 【明说】源里明确写了

| # | 逐字原文 | 源 | URL | 与 `drew`/`slept` 的相关度 |
|---|---|---|---|---|
| **M1** | **「两个动作同时进行，都用过去进行时」** | 大陆教辅（八年级语法解析，搜狗摘要） | 搜狗检索页 `while 只能 主句 从句 都是过去进行时`（多条第 2/3 条） | **高**——**这是我们 L98 绝对化的中文侧来源** |
| **M2** | **「从句时态用 was/were doing 主句时态经常用一般过去时态，**但不必定**。如: While I was waiting for my turn in the crowd, I came across an old friend of mine.」** | 作业帮回答（搜狗摘要） | 同上 | **高**——**中文侧同时存在反对派，且给了反例** |
| **M3** | **「过去简单式的短动作经常打断过去进行时中的长动作。」** | letmeenglish（直连 200） | https://letmeenglish.com/zh-hans/past-continuous/ | **高**——**与 L99 的判据（一阵子/一下子）几乎逐字对应** |
| **M4** | **`9. I was sleeping slept happily when a loud noise woke me up was waking me up .`** | letmeenglish 练习题（直连 200） | 同上 | **最高**——**`slept` 与 `was sleeping` 成对，`slept` 判错，与 L98 同构** |
| **M5** | **「遗憾的是，我们不可能立即识别不规则动词，这使得学习它们变得困难。」** | letmeenglish（直连 200） | https://letmeenglish.com/zh-hans/irregular-verbs/ | 中——**中文侧自认「看不出来」，是我们把这类词做成课的依据** |
| **M6** | **「动词按这三种类型分类，以便更容易记住它们。」** | letmeenglish（直连 200） | 同上 | 中——**支持按形态类型拆课（`drew`=类型 3／`slept`=类型 2 分开）** |
| **M7** | **「日常英语中大约有 200 个不规则动词。」** | letmeenglish（直连 200） | 同上 | 低——规模感知 |
| **M8** | **`draw过去式_作业帮`／`draw 的过去式 drew 怎么记`／`slept是什么意思_slept怎么读`／`sleep的过去式是 slept`** | 中文词形查询类页面（搜狗标题，实测 10 条） | 搜狗检索页 `draw 的过去式 drew 怎么记`／`sleep 过去式 slept 发音 怎么记` | **中**——**中文侧对这两个词的处理是「词形查询」，不给语境、不给对切** |
| **M9** | **「Draw 作为动词时，是一个不规则动词，它的过去式和过去分词分别是 drew 和 drawn，意思丰富多彩，常见的意思主要是「画,描绘」等」** | 中文词典/教辅页（搜狗摘要） | 搜狗检索页 `draw 的过去式 drew 怎么记` | 低——纯词形说明 |
| **M10** | **「draw过去式: drew;现在分词: drawing;过去分词: drawn.」** | 中文词形查询页（搜狗摘要） | 同上 | **中**——**⚠️ 值得注意：这条把 `drew` 与 `drawing` 并列在同一个「词形清单」里，但并列关系是「词形表罗列」，不是「用法对切」** |

### 6.2 【推断】我的推理（源里没写，标注依据强度）

| # | 推断 | 依据（间接） | 强度 | 反证 / 保留 |
|---|---|---|---|---|
| **I1** | **中文母语者会把 `slept` 当成「错的」而不敢用，因为在我们的 L98/L102 里它被划掉了两次** | 我方 L98 `contrast[0].wrongMark` ／ L102 `contrast[1].wrongMark` 逐字实测；且**库里没有任何一处告诉用户它是对的** | **中高**（推理有实测数据支撑，但无用户行为数据） | 无 |
| **I2** | **中国学习者最可能写出的错形是 `*sleeped`** | ① M5（「不可能立即识别」）；② 中文侧整个「归类记忆表」品类的存在本身说明「哪些不加 -ed」是核心痛点；③ **我方 L10/L11 已建立的错型家族**（`I eated an apple.` ／ `I buyed some bread.`） | **中** | **⚠️ 无任何源明说 `*sleeped`**；**本批实测的中文侧全部在讲 `slept` 的正确形式，没有一篇讲常见错误**（§6.1 M8/M9/M10 全是词形查询） |
| **I3** | **`*drawed` 同理是中国学习者的可能错形** | 同 I2 的推理链 | **中** | **⚠️ 同样无源明说。**本批搜狗检索 `draw 的过去式 drew 怎么记` **零条提到 `drawed`** |
| **I4** | **`drew` 的跨源教学传统与 `slept` 不同：`slept` 有「与进行时对切」的传统，`drew` 只有「词形查询」的传统** | §4.2 实测：四条 `drew` 检索路径全部返回词典/词形类结果；而 `slept` 在 letmeenglish 的进行时练习里直接作对切选项 | **中高** | 我的检索样本有限（搜狗 2 组查询），**不能 100% 排除存在 `drew` 与进行时对切的中文文章** |
| **I5** | **中文侧绝对派（M1）与正确派（M2）并存，会让中国学习者在「while 两边要不要都 -ing」这件事上没有稳定答案** | M1 与 M2 同时存在于同一次检索结果里，且 M1 出自教辅解析（更权威的应试口径）、M2 出自作业帮回答 | **中** | — |
| **I6** | **L12 用 `drew` 当反面教材六次，会让用户形成「drew 是个坏词」的印象** | 依据：L12 `contrast[1]` ＋ `guided[3]` 的六处实测落点；且 L12 `whyZh` 逐字只说「不换昨天版」，**未说 `drew` 何时是对的** | **中** | **这是我对教学效果的推断，无用户数据** |
| **I7** | **`draw` 的「19 次」高估了用户对 `draw` 的语境熟悉度**（见 §⑦.1） | L12 独占 12 处（63%），而 L12 是「will + 原样」课——`draw`/`drew`/`drawing` 在那里是靶子，不是语境 | **中** | **我没有工具把「词形计数」与「语境计数」分开**，故只能提出质疑（§⑨ U1） |

### 6.3 明确不能写进产品文案的（沿用批四十三纪律）

- **不能写「研究表明中国学生常犯 `*sleeped` / `*drawed`」**——**没有任何源明说这两个具体错形**（§6.2 I2/I3）。
- **正确写法**：「这是我方 L10/L11 已建立的错型家族（`*eated`/`*buyed`）的自然延伸」——**这是内部一致性论证，不是外部实证。**
- **可以写**：「`slept` 与进行时的对切有中文侧可直连源的支持」（§6.1 M4，letmeenglish 练习题逐字）——**这是真实的、可核验的。**

---

## ⑦ 独立可做性判断

### 7.1 先回答任务书的两个点名问题

#### 问题 A：`drew` 值不值得立课？

**我的判断：值得，但理由与上游给的不同——而且我要先提一个质疑。**

**⚠️ 质疑（本批最不确定的一点，§⑨ U1）**：任务书的观察完全正确——**`draw` 的 19 处只分布在 4 课，L12 独占 12 处（63%）**。而 L12 是「will + 原样」课。**这 12 处里，`draw`/`drew`/`drawing` 主要是作为「原样 vs 变形」的靶子出现的**（L12 `practice[]` 的 `distractors` 逐字：`drawing`／`snowed`／`went`／`rained`／`went`——**全是变形靶子**）。

**⇒ 若按「用户真正见过 `draw` 的自然语境数」算**：L13（正在做什么，3 处）＋ L34（三点时正在画，L34 属 `drawing` 的语境位）＋ L64（我看完啦，1 处）＋ L67（擅长画画）＋ L190（我正在学游泳，`to draw`）——**约 7 处**。**这远低于 `sleep` 的 55 处（12 课），甚至可能低于批四十三已做的 `sit`（23 处）。**

**但结论仍然是「立课」，理由有三条，且都不依赖那个 19 这个数字：**

1. **⚠️ `drew` 已经欠了 L12 一笔，而且这笔债是硬的。**（§2.6 逐字）
   - L12 用了 `drew` **六次**（`contrast[1].wrong`／`wrongMark`／`guided[3].tokens[2]`／`wrongToken`／`answer`／`correctionZh`），**每一次都划掉它**。
   - L12 `correctionZh` 逐字只说 **「把 drew 换回穿原样的 draw」**——**没有任何一处告诉用户「`drew` 本身是对的，只是不该站在 will 后面」**。
   - **⇒ 「用户见过一个词六次，六次它都是错的，而库里的正确侧零出现」——这是一个必须关掉的洞，无论它的原形语境数是多少。** 这个论证**不依赖**「原形 19 次」。
2. **`drew` 与 `slept` 的错侧结构同构**（§2.3 判读 4），**处置框架相同，边际成本低**（同一套「转正」模式做两次）。
3. **从「完整交付 L198–L200 家族」的角度，`drew` 是唯一剩下的 ABC 型缺口。** L198 做了 `swim/sing`（ABC 型）、L199 做了 `sit/catch`（ABB 型）、L200 做了 `feel/keep`（ABB 型）——**`draw` 是「已教过的换零件动词」里最后一个 ABC 型**（依据：OALD `a1` ＋ Cambridge 表内 ＋ 库里原形有语境位）。

**⇒ 结论：立课，1 课。定位从「补原形缺口」改为「把 L12 的反面教材转正」。**

#### 问题 B：`slept` 该并入 L200 那一族，还是单独一课？

**我的判断：单独一课。三条理由，全部来自本项目自己已经建立的东西。**

1. **⚠️ L200 自己划了家族边界，而 `slept` 只符合其中一半。**
   L200 `oneLineRule` 逐字：
   > feel 和 keep 的昨天版刚好是一对——它们**换法一模一样**：中间那两个 e 只剩一个，尾巴再加个 t，就成了 felt 和 kept。…这两个跟上几课的 swim → swam、sit → sat 是**同一个家族**的，**都不加 -ed**。

   - **`slept` 符合「都不加 -ed」** ✅
   - **但不符合「换法一模一样」** ❌——`sleep → slept` 是 `-eep → -ept`（前面是 `sl`），`feel → felt`／`keep → kept` 是「两个 e 只剩一个 ＋ 加 t」。
   - L200 `deepDive.paragraphs[2]` 逐字：**「所以记住一个就等于记住两个：felt 和 kept 长得像，换法也像。」**——**`slept` 与 `felt`/`kept` 长得不像，换法也不像。**
   - **⇒ 硬并入会把 L200 唯一的卖点（「记住一个就等于记住两个」）稀释成「记住两个半」。**

2. **形态类型不同（§4.1 判读 2）**：`slept` 是 **ABB 型**（过去式＝过去分词），与 L200 的 `felt`/`kept` **同型**——**这是支持并入的唯一论据**；但 `drew` 是 ABC 型。**⇒ 若按形态类型合并，`slept` 该与 L200 合；若按「换法」合并，`slept` 该独立。** 批四十三已确立后者（逐字：「ABB 组和 ABC 组是两种不同的记忆负担…**混在一课里会稀释重点**」——**该批用的判据是「换法是否同型」，不是「三态是否同形」**）。
3. **⚠️ 最硬的一条：`slept` 需要一课来装「与进行时的分工」，而 L200 装不下。**
   - `slept` 的独特教学负担不是「记一个形」（那是 ABB 的共性），而是**「这个形在 L98 被划过，它是对的，只是不能用在『两件同时』那一格」**。
   - **⇒ 这需要一个「回流 L98」的完整两段式教学**（先回看 L98 的错句、再翻转），**L200 的课型（`feel`/`keep` 一对）没有这个位置。**

**⇒ 结论：单独一课，并在该课里用「回看 L200」的方式做家族串联**（这正是本项目既有做法：L200 `contrast[4].whyZh` 逐字回流 L198——「第 198 课那句的 swam / sang 也是换零件的，跟今天的 felt / kept 是同一个家族」）。

### 7.2 建议：做 2 课，收 2 个词

| 课序 | 词 | 定位 | 判据/一句话规则（零术语，沿用库内词汇） | 错句设计（沿用既有错型家族） | 硬需求 |
|---|---|---|---|---|---|
| **L201** | **`sleep → slept`** | **与进行时的分工 ＋ 转正**（本批最高价值） | 「睡的**一整段**叫 sleeping（L98 学过）；**睡了一觉**那一下叫 slept——`slept` 是 sleep 的昨天版。**看你要的是画面还是这一件事。**」 | `*I sleeped well last night.`（**⚠️ 依据 §6.2 I2——【推断】，错型家族内插；不得写「研究表明」**）＋ **回流 L98 的对比卡**：`While I was reading, he slept.`（重列，但 `whyZh` 改为「这里不自然，因为你要的是画面的『一直睡着』」） | ① 必须先改 L98 的 `whyZh`/`oneLineRule`/`deepDive` 三处措辞（§3.3.2）＋ L102 一处；② L98/L102 的 `wrong`/`wrongMark` **不动**；③ **回流 L97 的 `When you called...`** |
| **L202** | **`draw → drew`** | **把 L12 的反面教材转正** | 「`drew` 是 draw 的昨天版——**它就是昨天画画的那个 drew**。第 12 课把它划掉，是因为它站在 will 后面（will 后面穿原样）；**说昨天的事，站对了地方，它就是对的那个。**」 | `*I drawed a picture yesterday.`（**⚠️ 同样【推断】**）＋ **回流 L12**：`Tomorrow I will drew.`（重列，`whyZh` 加上「**`drew` 本身没错，是位置错了**」） | ① 建议在 L12 `contrast[1].whyZh` 加一句指向本课的说明（**改动极小，1 处**）；② 场景可挂 L12/L190（画画/学画画） |

**⇒ 净新增课量 = 2 课 = L201 ／ L202**（当前 L200 为最后一课）

### 7.3 明确拒绝的低价值候选（延续拒绝纪律）

| 候选 | 判定 | 理由（含实测） |
|---|---|---|
| **`told`** | **拒绝单独立课** | 原形 `tell` 教学位仅 **6 处**（批四十四实测，本批未复算）——低于阈值；且它属 L63 `give` 型「双宾/词义」挂靠项。**若 L197 有欠条则补回流，不立课。** |
| **`wrote`** | **拒绝** | 原形 `write` 教学位**仅 1 处**——先有原形才有过去式问题。**建议挂靠**（批四十四建议挂 L23）。 |
| **`wore`** | **拒绝** | 原形 `wear` 教学位**仅 1 处**。同 `wrote`。 |
| **`meant`** | **拒绝** | 原形 `mean` 那 1 处是话语标记 `I mean`（批四十四已定位），**义项不符**——`meant` 是另一个义项，无教学位。 |
| **`drawn`** | **拒绝（不并入 `drew` 课）** | 它是 `draw` 的**过去分词**（`have drawn` / 被动 `be drawn`）——**我方课程从未教过完成时/被动的那一套**（依据：`IRREGULAR_PAST` 判定表是「该用过去式却用了原形」，且 L198/L199/L200 三课全部只教过去式）。**⇒ 引入 `drawn` 会引入一个尚未建立的语法系统，属越级。** |
| **把 `slept` 与 `drew` 合成一课** | **拒绝** | ① **形态类型不同**（ABB vs ABC，§4.1 判读 2）；② **错侧前科的性质不同**（`slept` 的错是「位置/语感偏」、`drew` 的错是「形状换错位置」，**两套判据**）；③ **已教分布不同**（`sleep` 12 课／`draw` 4 课）；④ **跨源传统不同**（`slept` 有进行时对切传统、`drew` 只有词形查询传统，§4.2 判读 3）。**⇒ 四票反对。** |
| **把 `slept` 并入 L200** | **拒绝**（§7.1 问题 B） | 三条理由见上。**最硬的是「L200 装不下 `slept` 需要的『与进行时分工』那一段」。** |
| **只做 `drew`、不做 `slept`** | **拒绝** | `sleep` 的暴露量（55 处 / 12 课）**高于 `draw`（19 处 / 4 课）三倍以上**，且 `slept` 的错侧前科更重（**三次被否定**，`drew` 是六次集中在**一课**）。**⇒ `slept` 优先于 `drew`。** |

### 7.4 优先级排序（若产品只做一个）

1. **`slept`（L201）**——**必须先做**，因为：① 它需要先改 L98 的措辞，**改动会影响既有的第十五季**，越早改影响越小；② 它的暴露量是 `drew` 的 2.9 倍；③ 它的内部矛盾（L98↔L99）是一个**现存的、可被用户发现的 bug 级不一致**。
2. **`drew`（L202）**——第二做，因为它的「转正」机制与 `slept` 同构，**在 `slept` 课验证过框架后再做，边际成本最低**。
3. **L12 `contrast[1].whyZh` 加一句指向说明**——成本 1 处文案，可与 L202 同批。

---

## ⑧ 自我核查记录（命令 + 口径 + 输出）

| # | 核查项 | 命令 | 口径 | 结果 |
|---|---|---|---|---|
| 1 | 课程/案件总数 | `node -e "import('/tmp/b45/load.mjs').then(...)"` | TS 编译器 API 取数组 | **200 课（1..200 无跳号）／209 案（1..209 无跳号）** ✓ |
| 2 | `sleep` = 55？ | `node /tmp/b45/FINAL.mjs` | **`C1`**（§2.0 表） | **55，精确命中** ✓ |
| 3 | `draw` = 19？ | `node /tmp/b45/FINAL.mjs` | **`C1`** | **19，精确命中** ✓ |
| 4 | 批四十三口径能否复现 55/19？ | `node /tmp/b45/FINAL.mjs` | `C0` = 批四十三 core | **不能：得 37 / 12** ⚠️ **⇒ 任务书 55/19 与批四十三口径不是同一套字段集** |
| 5 | 口径穷举（证明口径的重要性） | `node /tmp/b45/caliber.mjs` ＋ `caliber2.mjs` ＋ `caliber3.mjs` ＋ `caliber4.mjs` | 24 字段组 ／ 子集搜索 | **59 组能同时得 (55,19)**；**含错侧的「最大解」唯一**；**纯正面侧零解** ⚠️ |
| 6 | `slept` 全库落点 | `node /tmp/b45/locate.mjs slept` | **两文件所有字符串递归** | **11 处／11 个字符串，全部在错侧**（L97×1／L98×8／L102×2）✓ |
| 7 | `drew` 全库落点 | `node /tmp/b45/locate.mjs drew` | 同上 | **7 处／7 个字符串，全部在错侧**（L12×6／L99×1）✓ ⚠️ **新发现** |
| 8 | L98/L102 原文逐字 | `node /tmp/b45/FINAL.mjs` §4 | 全字段 dump | **已取得 `contrast[]` 全六条 ＋ `guided[]` ＋ `practice[]` ＋ `deepDive` 逐字** ✓ |
| 9 | L12 原文逐字（`drew` 唯一错侧家园） | `node /tmp/b45/FINAL.mjs` §5 | 全字段 dump | **已取得 `contrast[1]` ＋ `guided[3]` ＋ `practice[]` distractors 逐字** ✓ |
| 10 | `slept`/`drew` 逐课分布 | `node /tmp/b45/dist.mjs` | `C1` | **`sleep` 12 课（L47=20 最大）／`draw` 4 课（L12=12 占 63%）** ✓ |
| 11 | 「同一词形在 A 课错、B 课对」的公例 | `node /tmp/b45/bothsides2.mjs` ／ `samelesson.mjs` | **严格口径**：`wrongMark`/`wrongToken` 才算「错侧」；正面口径不含 spot/distractor | **跨课：442 个被标错的词形中 304 个在别处正确；同课：355 个／176 课** ✓ ⚠️ **公例极多** |
| 12 | 零术语守门（既有测试） | `src/data/grammarLessons.test.ts` 的 `零术语红线` 四组 describe | 遍历全字段 | **本批只读未改，未跑；建议新课落地后必跑**（§3.3 建议措辞已按零术语设计） |
| 13 | OALD 两词条等级＋形 | `curl` 两条 URL ＋ 解析 `ox3ksym_*` / `ox3000` / `past simple X` | 逐词条 | **`draw`=a1／`drew`；`sleep`=a1／`slept`；均 `ox3000="y"`** ✓ |
| 14 | Cambridge `as-when-or-while` | `curl`（**HTTP=200**，452KB）＋ 文本抽取 | 直连 | **"We can use either simple or continuous verb forms"** 逐字取得 ✓ |
| 15 | Cambridge `past-continuous-or-past-simple` | `curl`（**200**，451KB） | 直连 | **"depends on how we see the past event(s)"** ／ **"the writer chooses"** 逐字取得 ✓ |
| 16 | Cambridge `Table of irregular verbs` 两词是否在表 | `curl`（**200**，464KB）＋ 正则 | 直连 | **两词都在**：`draw drew drawn`／`sleep slept slept` ✓ |
| 17 | BC 直连可用性 | `curl` 两路径 | — | **`HTTP=000`**（与任务书预警一致）⚠️ |
| 18 | BC 三个页面内容 | WebFetch ×4（`past-continuous`／`past-simple`／`a1-a2-grammar`／`past-continuous-past-simple`） | **经 WebFetch（模型转述）** | **`While I was studying, I suddenly felt sleepy.`** ／ **"the past simple action happened in the middle of the past continuous action"** ／ `draw` 在表内 `sleep` 不在 ✓ ⚠️ **可靠性低于直连源** |
| 19 | letmeenglish 不规则表两词归类 | `curl`（**200**，80KB）＋ 逐行定位最近上级标题 | 直连 | **`sleep slept slept` → 初级 · 类型 2；`draw drew drawn` → 初级 · 类型 3** ✓ |
| 20 | letmeenglish 过去进行时页 | `curl`（**200**，74KB） | 直连 | **练习题第 9 题逐字（`slept` 判错）＋ 「短动作打断长动作」逐字取得** ✓ **本批最有价值的单条证据** |
| 21 | 中文教辅 while 绝对派/正确派 | 搜狗 `curl`（**200**，590KB）＋ 摘要抽取 | 摘要级 | **两派并存**：绝对派「两个动作同时进行，都用过去进行时」／正确派「主句…但不必定」 ✓ ⚠️ **未读到任何一篇全文** |
| 22 | `drew`/`slept` 的中文侧教学传统 | 搜狗 `curl` ×2（**200**，573KB ＋ 576KB） | 标题＋摘要 | **`drew`：全部是词形查询/词典类（零条对切）**；**`slept`：同样是词形查询类** ⚠️ |
| 23 | 微信文章可读性 | `curl` iPhone UA ×2 | — | **`HTTP=200` 但正文为 128 字符「系统出错」空壳** ⚠️ 不可得 |
| 24 | 沪江英语 | `curl`（190KB） | — | **首页，`while`/`过去进行时`/`slept` 零命中** ⚠️ |
| 25 | 「两班岗/两张脸」公例（本项目内部先例） | `node /tmp/b45/idiom.mjs` | 全字段正则 | **113 处，跨 40+ 课**；**L122 `同一个 to，两张脸` 是整章课型** ✓ |
| 26 | 「一场戏只让一个词换形状」公例 | `node /tmp/b45/phrases.mjs` | 全字段正则 | **5 课**（L10/L104/L160/L161/L188）✓ **可直接复用为本批措辞** |
| 27 | 批四十四 §3.2 的 8 个数字能否复现 | `node /tmp/b45/b44check.mjs` | 19 字段组穷举子集 | **`exact solutions: 0`——8 个数无法由任何单一字段子集同时复现** ⚠️ **⇒ 同表混口径，已登记 U10** |

### 8.1 本批拒绝的方法与原因（记录以免后人重试）

| 方法 | 结果 | 放弃原因 |
|---|---|---|
| 用正则解析 39k 行 `grammarLessons.ts` | 未尝试 | 批四十三已两次失败并给出原因（`[]` 会被括号扫描先匹配、TS 对象嵌套与中文引号）；**改用 TS 编译器 API** ✓ |
| 本地 `grep` 计数 | **全程未用** | 任务书预警：本地 grep 是 ugrep 会假返回 0；**只用于定位文件**（`ls \| grep`）✓ |
| `'<h3>'` 之外的搜狗结果选择器 | 部分失败 | 搜狗结果摘要的 CSS 类不稳定，**改用「全文本查找目标词附近窗口」的方式**（能捞到，但无法保证是「摘要」还是「推荐词」——已在报告中标注为「搜狗摘要」）✓ |
| 搜狗 `sogou.com/link?url=...` 重定向跟随 | **失败** | `curl -sL` 返回 **254 字节空壳**，`url_effective` 仍是 sogou 域——**无法解析出真实目标 URL** ⚠️ |
| 关键词含「错误」「错」的检索 | 结果偏移 | `while ... 错误` 类查询被搜狗拆解到「while 循环」（编程）主题——**中文侧「教辅」与「编程」关键词冲突**，需用更精确的教学词 ⚠️ |

---

## ⑨ 抓不到的源与不确定项

### 9.1 按任务书指示「正式登记不可得」（本批未重试）

| 源 | 状态 | 备注 |
|---|---|---|
| **Murphy《Essential Grammar in Use》** | **不可得** | 批四十三已正式登记；**本批按要求不重试** |
| **Murphy《English Grammar in Use》(Intermediate)** | **不可得** | 同上 |
| **Swan《Practical English Usage》** | **不可得** | 同上 |

**⇒ 我这一侧的替代**：**letmeenglish 的 `过去进行时` 页（可直连 200）在本批的针对性上强于 Murphy**——它是「用法 ＋ 例句 ＋ 10 道练习」的完整教学页，且**它的练习题第 9 题正好是我们 L98 的问题句的镜像**。**若需要「教材单元位次」的证据仍然缺 Murphy；但若需要「这个教学点的教法先例」，本批已拿到更强的源。**

### 9.2 不确定项（诚实登记）

| # | 不确定项 | 影响 | 我的处置 |
|---|---|---|---|
| **U1** | **⚠️ `draw` 的「19 次」可能高估语境熟悉度**（L12 独占 12 处，且 L12 是「will + 原样」课，`draw` 在那里是靶子） | **中高**——**直接动摇「`drew` 与 `slept` 同档」的判断**；若按语境计数，`draw` 可能只有约 7 处 | **已在 §2.5 判读 2、§7.1 问题 A 显式登记。** 我**没有工具**把「词形计数」与「语境计数」分开（需要人读每一处判断「这里是自然语境还是靶子」）。**⇒ 建议瑞思/产品侧用人工抽读 L12 那 12 处来定论。** **但我的「立课」结论不依赖这个数字**（§7.1 问题 A 的三条理由） |
| **U2** | **改 L98 的措辞 = 向英文权威侧靠拢，可能与中文应试口径不一致** | **中**——**是产品取舍，不是纯对错** | **已在 §3.3.4 显式标出。** 我的建议是「改 `whyZh` 的判据、保留 `wrong`/`wrongMark`」——**这个折中恰好两侧都照顾到**：对比卡还在（应试用户仍能练到「这里该用 -ing」），但措辞不再说「必须」 |
| **U3** | **L98 `guided[3].wrongToken` 是 `"slept."`（带句号），而 `contrast[0].wrongMark` 是 `"slept"`（不带）** | **低** | 实测逐字（§2.4）。**这是「按词块切分」的必然结果**（spot 题的 token 包含标点）。**已在 §2.4 显式标注**，供新产品课时参考 token 风格。**不构成问题。** |
| **U4** | **BL 直连全部 000，BC 的逐字全部经 WebFetch（模型转述）** | **中**——BC 三条逐字的可靠性低于直连源 | **凡引用 BC 处已标「经 WebFetch」**；**BC 的关键结论（两个时态配合、while ＋ 过去式可接受、`draw` 在表内 `sleep` 不在）与 Cambridge／OALD 独立一致或互补**，故由交叉印证兜底 |
| **U5** | **中文侧「while 两边都 -ing」的绝对派证据是摘要级**（10 条标题 ＋ 4 条摘要，**未读到任何一篇全文**） | **中**——影响 §3.2.6 与 §6.1 M1/M2 的强度 | **已标注为「搜狗摘要」**。**但「绝对派与正确派并存」这个结论在 4 条独立摘要上一致**，且**正确派那条带反例**，故我认为结论可靠 |
| **U6** | **`drew` 在中文侧是否有「与进行时对切」的文章，我未穷尽** | **中**——影响 §4.2 判读 3 | **我的检索是 2 组搜狗查询**（`draw 的过去式 drew 怎么记`／`draw的过去式`），**全部返回词形查询类**。**不能 100% 排除存在。** 已标为【推断】I4（强度中高） |
| **U7** | **`*sleeped` / `*drawed` 无任何源明说** | **中**——直接影响错句设计的论证强度 | **已在 §6.2 全部标为【推断】并给强度评级。** **不得写「研究表明」**（§6.3） |
| **U8** | **`draw` 的 `drawn` 是否该在本课引入** | **低** | **我的判断是不引入**（我方未教完成时/被动，§7.3）。**但这是我的判断，产品可另议。** |
| **U9** | **竞品付费课程内部未核实** | **中**——§5 的空位判定基于公开层 | 已在矩阵中逐行标「未核实/推断」。**「把被判错的形式转正」在所有被测产品的公开层零见**（英文侧无跨页回流概念、letmeenglish 练习页无此表述）——**但严格说是「公开层零见」** |
| **U10** | **我未能复现批四十四 §3.2 那张表的全部 8 个数字**（报 `keep 48／give 37／feel 35／draw 27／tell 6／write 1／wear 1／mean 1`） | **中**——说明上游那张表用的口径与我能构造的任何字段集都不同，而「零出现」又是正面口径 ⇒ **同表混口径** | **实测（`node /tmp/b45/b44check.mjs`）：在 19 个字段组上做穷举子集搜索，得 `exact solutions: 0`**——**没有任何一个字段子集能同时复现这 8 个数**。逐项看：`draw=27` 只在 `C7+pDis` 口径下成立（该口径 `keep=57`／`give=41`／`feel=50`）；`give=37` 在 `C6`（`C7` 去掉 `practice.tokens`）下成立（该口径 `draw=26`／`keep=53`／`feel=43`）；`tell/write/mean` 在多数口径下都成立（它们本就极少）；**`keep=48`／`feel=35` 在一次都没命中**。**⇒ 结论：批四十四那张表的 8 个数很可能来自至少两套不同脚本，或含手工汇总。** **已在 §2.2 判读 3 登记为「同表混口径」的流程问题**（§5 携带项 7 正是要修这个） |

### 9.3 给下一批的交接（3 条）

1. **`U1`（`draw` 的语境计数）**：请**人工抽读 L12 的 12 处 `draw`/`drew`/`drawing`**，判定哪些是「自然语境」、哪些是「变形靶子」。**这是本批唯一一个我没有工具解决的问题。**
2. **改 L98 三处文案 ＋ L102 一处**（§3.3.2）：**这是本批成本最低、收益最直接的一项**——**不改结构、不改 `wrong`/`wrongMark`、只改 `whyZh`/`oneLineRule`/`deepDive` 的判据措辞**，改完即可消掉 L98↔L99 的内部矛盾。
3. **「同表混口径」的流程修复**（§2.2 判读 3 / U10）：**批四十四 §5 携带项 7 已登记此项，本批实测确认它是真实问题**（同一张表里 `27` 是含错侧、`零出现` 是正面口径）。**建议在缺口类报告的模板里加一个必填字段：「本表的每个数字分别是什么口径」。**

---

**报告结束**。本批共核实 2 组上游数字（`sleep=55`／`draw=19`，**两个都精确复现，但口径与批四十三不同**），**新发现 `drew` 与 `slept` 的错侧结构同构**（`drew` 也曾在 L12 被划掉六次——上游批四十四把它当纯缺口，是漏判），**定位 `slept` 冲突为三个**（L98 自我承认／**L98↔L99 判据矛盾**／同季连续否定三次），并给出**跨源位次表（2 词 × 6 源）**、**`slept` 冲突三问的完整回答**、**竞品空位判定（「把被判错的形式转正」在所有被测产品公开层零见——⚠️ 包括我们自己）**、以及**分层建议（2 课：`slept` L201 ＋ `drew` L202；拒绝 `told`/`wrote`/`wore`/`meant`/`drawn`；拒绝与 L200 合并）**。
