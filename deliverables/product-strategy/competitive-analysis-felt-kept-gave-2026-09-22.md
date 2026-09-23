# 竞品与外部权威源分析 · `felt` / `kept` / `gave` 三个高价值过去式（第四十四批专项）

- **日期**：2026-09-22
- **负责人**：竞析（竞品与外部权威源分析）
- **数据基线**：`src/data/grammarLessons.ts` = **199 课**（末课 `lesson-199-sat-caught`）；`src/data/huntCases.ts` = **208 案**（末案 #208）
- **本批范围**：只做研究，**未改动任何代码/数据**（`git status` 已核：仅 `src/data/grammarLessons.ts` 有本批之前既存的未提交改动，非我所作）
- **工具纪律**：所有数据侧计数**一律用 node 词边界正则读解析后的数据对象**，**不使用 `grep`**（本地 `grep` 是 ugrep，会假返回 0）。全文凡出现数字，**必先声明口径**。

---

## ① 结论摘要

**1. `slept` 复核：上批的结论「`slept` 是第 8 个缺口」在实质上成立；本批「它在教学位有 2 处正面用法」不成立。**
`lived` 的 11 处落点经逐条判定为：**错侧 10 处 ＋ 讲解散文中引述错处 1 处 ＝ 正面教学位 0 处**。本批所指的「L98 的 guided 答案是正面用法 `slept.`」是**对 `spot` 题型的误读**：`spot` 题的 `answer` 与 `wrongToken` 是同一个值，它就是**要用户点出来的那个错词块**（题面逐字「有人是这样说的，你帮他看看：哪个词块不太对？」）。这一点由渲染器代码 `src/edge/lessonFlow.ts:178-179` 与数据不变量测试 `src/edge/e0-lesson-data-invariants.test.ts:104-105` 双重证实，**不是我的推断**。⇒ 差异来源＝**口径里「`guided[].answer` 一律算正面槽」这条规则，碰到 `spot` 题型就会把错词算成正面**。

**2. 三词缺口独立复核：`kept` / `gave` / `felt` 三个缺口全部成立**，且比上批描述的更干净——**三者在 grammarLessons 的「全字段」口径下都是 0**（连错句、干扰项、讲解散文里都没出现过）。唯一例外是 **`gave` 在 `huntCases` 里作为「正确 token」出现 3 处**（#9/#20/#27，均 `reviewed: true`）。

**3. 任务书给的 4 个数字（`keep` 46 / `give` 35 / `feel` 34 / `sleep` 35）在本机 22 套命名口径下无一命中**，在 2³⁵ 字段子集穷举的「自然口径」里也无解。上批给的 `sleep` **37 可复现**（=上批自建的 `core` 口径），本批给的 **35 不复现**。⇒ **数字不可跨报告引用，必须带口径**；但两套数字的**方向完全一致**（原形海量 / 过去式零），**不影响任何结论**。

**4. 最重要的负面发现（修正上批）：中文侧「按变化模式分组」比上批描述的更彻底，我们按模式分组并非原创设计。**
上批结论是「中文侧惯例是『三态同形 AAA/ABB/ABC』而非元音族」——**这条只对了一半，且证据深度不足**。本批拿到一篇可直连的全文（新浪转载《中考英语常见93个不规则动词变化》），它把分类做成**三级**：宏观三态型（`A—B—B型`）→ **微观音变族** → 例词。其中逐字包含：

> 「**4．把-eep变为-ept。(3个)** keep—kept—kept　sleep—slept—slept　sweep—swept—swept」
> 「**6．过去式、过去分词都含有-elt或-ilt。(4个)** smell—smelt—smelt　spell—spelt—spelt　**feel—felt—felt**　spill—spilt—spilt」
> 「**5．把-ell变为-old。(2个)** **tell—told—told**　sell—sold—sold」
> 「**1．i—a—u变化。(6个)** begin—began—begun　drink—drank—drunk　**sing—sang—sung**　ring—rang—rung　**swim—swam—swum**　sink—sank—sunk」

也就是说：**`-eep→-ept`、`-ell→-old`、`-elt/-ilt`、`i→a` 这些族，中文教辅早就一个一个分好了，而且分得比我们细**（我们 L198 把 `swim`/`sing` 放一族，中文源把 `i→a→u` 六个词放一族）。
**⇒ 引用纪律（必须遵守）**：**不得写「按变化模式分组是我们的原创」**。我们真正的、经得起检验的差异是：**用连续剧场景 + 错句回流来承载这个分组**——分组本身是中文教辅的公共财产。

**5. `Past: typical errors` 复核：上批结论精确成立。** 该页 `curl=200` 可直连，逐字核对：**7 条 `Not:` 全是时态选择错误（past simple vs past continuous vs present perfect/past perfect），0 条关于「误加 -ed / 用错不规则形」**。页面上唯一的 `irregular` 字样出现在**左侧栏的导航链接**（`Table of irregular verbs`），不在错误清单里——**引用时不得把它算成正文**。

**6. 「场景 + 错句回流」仍是零见空位**（7 款竞品公开层实测）：英文侧三源（Cambridge / BC / OALD）**连场景都没有**；中文侧 letmeenglish 与教辅品类**全是表格＋练习题**；扇贝 / 英语兔 / 可可 / 沪江**首页完全没有这个语法点**。⇒ **这个组合是真空位，可以写进产品文案。**

**7. 可做性判断：建议做 1 课，收 2 个词。**
- **立课 `L200 = felt + kept`**（同一机制：双 `ee` 缩成一个 `e`，尾巴加 `t`）——**单课同族，纯度最高**；
- **`gave` 不立课、走挂靠**（理由与挂靠点见 §7.3，与任务书猜的 L63 不同）；
- **明确拒绝 `told` / `wrote` / `meant`**（`meant` 的拒绝理由比「次数少」更硬：那 1 处是**另一个义项**）；
- **`slept` 本批仍不做**，但登记一个上批没有的观察：**它是全库唯一一个「已被错句正面打过」的不规则过去式**（10 处错侧），回流机制对它已经预热。

---

## ② `slept` 复核（含口径与脚本）

### 2.0 任务书的三方主张

| 方 | 主张 |
|---|---|
| 批四十三（上批） | `slept` 是**第 8 个缺口**（`sleep` 教学位 37 / `slept` 0）；「它的 3 处落点全在 `contrast.wrong`／`guided.answer`」 |
| 本批任务书 | **上批结论不成立**：`slept` 在教学位有 **2 处**（L98 的 guided 答案是**正面用法** `slept.`），且在 L98/L102 的**错句**里出现（`While I was reading, he slept.` 被判错，应为 `was sleeping`） |
| 我的独立复核 | **上批的实质结论（`slept` 从未被正面教过）成立**；**本批的「2 处正面用法」不成立**；上批给出的「3 处」这个**数字**也不成立（实测 11 处字段） |

### 2.1 口径声明（先定义，再报数）

`slept` 的 11 处落点分散在 5 类字段，**判定它们「是正面还是错侧」不能只看字段名，必须看题型（`kind`）**。我用的判定规则：

| 字段形态 | 判定 | 依据 |
|---|---|---|
| `contrast[].wrong` / `wrongMark` | **错侧** | 字段语义即「这样说不对」 |
| `guided[].wrongToken` | **错侧** | 类型注释逐字：「spot：藏了问题的那个词块」 |
| `guided[].options[]` / `practice[].distractors[]` | **错侧** | 干扰项（选它＝答错） |
| **`guided[].answer`** | **⚠️ 看 `kind`** | **`kind === "spot"` 时是错侧**（见 §2.2）；其他 kind 才是正面 |
| `*.explain` / `*.correctionZh` / `contrast[].whyZh` | **讲解散文**（引述错处，不计正面） | 它们是元语言说明，不是「照这样说」的示范 |

### 2.2 关键证据：`spot` 题的 `answer` 就是「要你点出来的错」

**证据 A · 渲染器代码**（`/Users/liujun/Documents/英语听写/src/edge/lessonFlow.ts:174-213`）：

```ts
/** 答对当前 guided 题（choose/replace/spot 点选项，arrange 按答案点词块）。 */
export const answerGuidedCorrectly = (page, entry) => {
  const step = entry.step;
  if (step.kind === "arrange") return answerArrangeCorrectly(page, step.answer);
  if (step.kind === "spot") {
    const target = step.wrongToken ?? step.answer;      // ← spot 的 answer 与 wrongToken 同值
    const chip = ...find((el) => (el.textContent ?? "").trim() === target);
    clickEl(chip);                                       // ← 点中它 == 答对
    return Boolean(chip);
  }
```

→ 「答对」＝点中 `wrongToken ?? answer`。**被点中的那个词块就是这道题的「错处」**。

**证据 B · 数据不变量测试**（`/Users/liujun/Documents/英语听写/src/edge/e0-lesson-data-invariants.test.ts:104-105`）：

```ts
if (step.kind === "spot") {
  const target = step.wrongToken ?? step.answer;
  if (!(step.tokens ?? []).includes(target)) bad.push(`${lesson.id} guided#${index} spot 命中词不在题干`);
```

→ 测试断言 `target` **必须出现在题干词块里**——这正是「在句子里找错」的语义。

**证据 C · L98 那一步的原始数据**（`node /tmp/b44/guided.mjs`，逐字）：

```json
{
  "kind": "spot",
  "promptZh": "有人是这样说的，你帮他看看：哪个词块不太对？",
  "tokens": ["While","I","was","reading,","he","slept."],
  "wrongToken": "slept.",
  "answer": "slept.",
  "correctionZh": "同时的那件也要穿 -ing：he 【was sleeping】。",
  "explain": "两件同时在，两边都穿外套。"
}
```

→ 题面问「**哪个词块不太对**」；`correctionZh` 给的**正确**说法是 `he 【was sleeping】`。**用户在这里被明确告知 `slept` 是错的。** 这是一处**反面用例**，恰恰是最强的「slept 需要被教」的证据，而不是相反。

### 2.3 `slept` 全落点逐条判定（脚本输出）

```
$ node /tmp/b44/slept_final.mjs

  L 97 guided[5].options[2]      [kind=replace ] ❌ 错侧：干扰选项（选它=答错）        :: I slept.
  L 98 guided[0].options[1]      [kind=choose  ] ❌ 错侧：干扰选项（选它=答错）        :: he slept
  L 98 guided[3].answer          [kind=spot    ] ❌ 错侧：spot 题的 answer == 要你点出来的那个错词块 ::
  L 98 guided[3].wrongToken      [kind=spot    ] ❌ 错侧：被指认的那个词块              :: slept.
  L 98 guided[3].tokens[5]       [kind=spot    ] ❌ 错侧：spot 题里藏错的那个词块        :: slept.
  L 98 contrast[0].wrong         [kind=contrast] ❌ 错侧：明确标注的说法               :: While I was reading, he slept.
  L 98 contrast[0].wrongMark     [kind=contrast] ❌ 错侧：被标红的词                  :: slept
  L 98 contrast[0].whyZh         [kind=contrast] ◻︎ 讲解文字（引述错处）
  L 98 practice[0].distractors[0][kind=practice] ❌ 错侧：干扰项                     :: slept
  L102 contrast[1].wrong         [kind=contrast] ❌ 错侧：明确标注的说法               :: While I was reading, he slept.
  L102 contrast[1].wrongMark     [kind=contrast] ❌ 错侧：被标红的词                  :: slept

  ⇒ 总计 11 处；其中「正面教学位」0 处（零）
  ⇒ 「错侧」10 处；「讲解引述」1 处
```

**`huntCases` 侧**：`slept` **0 处**（`node /tmp/b44/triple.mjs`）。

### 2.4 我们三方差异的来源（定位到规则）

**我复现了「2 处」这个数字的产生机制**（`node /tmp/b44/slept_final.mjs` §G）：

```
  ⚠️ 被判为「展示槽·非错侧」：L98 contrast[0].whyZh
        :: 同时的那件也要穿 -ing：slept 是「睡了一觉」（一件事）——两件同时在，两边都穿。
  ⚠️ 被判为「展示槽·非错侧」：L98 guided[3].answer
        :: slept.
```

上批的展示槽正则里有一条 `(^|\.)guided\[\d+\]\.(answer|explain|...)$`——它把 **`guided[].answer` 无差别当成正面槽**。碰到 `spot` 题型，这个假设就翻了。

**⇒ 差异来源三句话**：
1. **本批的「2 处正面」**＝`spot` 题的 `answer`（1 处）＋ `contrast[].whyZh` 讲解散文（1 处）。**两处都不是正面示范**。
2. **上批的「3 处」**＝上批用了另一套更窄的脚本（`/tmp/irr2/nature.mjs` 只扫 `targetSentence/dialogueEn/blocks/examples/dialogue/contrast.correct+wrong/variants/sceneSwings/guided.answer/practice.answer/recall/deepDive/summary/oneLineRule`），漏掉了 `options`／`tokens`／`distractors`／`wrongToken`／`wrongMark`／`whyZh`。**上批的结论方向对、计数漏了一半以上。**
3. **上批的 `sleep` 37 可复现**：我实测 `sleep` 在**上批自建的 `core` 口径**下 = **37**。**上批这个数字是对的（在它自己的口径下）**。**本批的 35 在我 22 套口径下都不复现**（`sleep` 实测：全字段 96 / 非错侧 85 / 句子槽 44 / 严格正面 69 / core 37）。

### 2.5 `slept` 的复核结论

- **`slept` 从未作为正面教学位出现**——这一点在我能穷举的所有口径下都成立（0 处），**上批的实质判断正确**；
- 但 **`slept` 的性质确实与 `felt`/`kept` 不同**：**它是全库唯一一个「已经在 10 处错句里被反复打过」的不规则过去式**，集中在 **L97／L98／L102**，罪因全部是 **`was sleeping` vs `slept`（进行 vs 完成）**，与「换零件」无关。
- **⇒ 处置建议**：`slept` 若要做，**不该做成「换零件」课**（它的教学冲突点在「什么时候用 -ing」，第 98 课已经讲透了），而应做成**「同一批老朋友」清单的补票**（挂 L197 的续做承诺）。**本批不做**，理由见 §7.5。

---

## ③ 三词缺口独立复核

### 3.0 口径声明（本批最重要的一段，避免上批的误引）

同一位任务书在上一轮被误引过数字，根因是**口径没写在数字旁边**。本批**每个数字都带口径标签**。四套口径的定义：

| 标签 | 定义（字段集合） |
|---|---|
| **① 全字段** | 两个数据文件的**所有字符串**，含错句、干扰项、讲解散文、`huntCases` 全部字段除外（`huntCases` 单列） |
| **② 非错侧** | ① 去掉 `contrast[].wrong`／`wrongMark`／`guided[].wrongToken`／`practice[].distractors[]` |
| **③ 句子槽** | 真正被当成「一句话」呈现的位置：`targetSentence`／`dialogueEn`／`examples[].en`／`contrast[].correct`／`variants[].en`／`sceneSwings[].en`／`dialogue[].en`／`blocks[].text`／`guided[].answer`＋`replaceBase`／`practice[].answer`／`recall.answer`（**不含**讲解散文与选项词块） |
| **④ 严格正面** | ② 再剔除 `guided[].options[]`／`guided[].tokens[]`／`practice[].tokens[]`（**＝「不含错句也不含干扰项」**，最接近任务书自述的「正确句口径」） |

**脚本**：`/tmp/b44/load.mjs`（esbuild 打包 `.jpg` 资源为文本后 eval，规避 39k 行 TS 的正则解析）＋ `/tmp/b44/caliber.mjs`／`triple.mjs`／`hypo.mjs`。

### 3.1 三词缺口：**全部成立**

```
$ node /tmp/b44/triple.mjs

原形     全字段  非错侧  句子槽  课数  hunt  │ 过去式   全字段 非错侧 句子槽 hunt
keep        94     90     38     2     4   │ kept         0     0     0    0
give        67     65     23     2     5   │ gave         0     0     0    3
feel        61     53     27     5     7   │ felt         0     0     0    0
tell         2      2      2     1     0   │ told         0     0     0    0
write        2      2      0     1     1   │ wrote        1     1     0    0
mean         1      1      1     1     0   │ meant        0     0     0    0
sleep       96     85     44    14     3   │ slept       11     5     1    0
```

**`kept` / `gave` / `felt` 的过去式在 `grammarLessons` 的「①全字段」下都是 0** ——比任务书说的「正确句 0」更强：**连错句、干扰项、讲解散文里都没出现过**。

### 3.2 唯一的例外：`gave` 在 `huntCases` 里是「正确 token」

```
$ node /tmp/b44/gave_hunt.mjs

#9  hunt-uncountable  | tokens[2] = "gave"  → 是否被纠错：否（是正确 token）
     The teacher gave us many advice and some informations about the exam.
     （本案的 2 个错是 many→a lot of、informations→information）
#20 hunt-term-review   | tokens[10] = "gave" → 是否被纠错：否
     Last term, I learn a lot of English. My teacher gave us useful advice. ...
#27 hunt-snow-day      | tokens[25] = "gave" → 是否被纠错：否
     ... Mom gave us a orange juice.
```
三案均 `reviewed: true`。

**⇒ 精确表述**：`gave` 缺的不是「见过」——用户已经**在 3 个找错案的正确句里读到过 `gave`**；它缺的是**「被讲解」**。这一点让 §7.3 的挂靠方案比另两个词更自然。

### 3.3 三词的挂靠点强度（原形从哪来）

```
$ node /tmp/b44/prec.mjs（非错侧计数）

keep   L77 一直在做（60 处）＋ L78 收口（30 处）  —— 仅 2 课，高度集中
give   L63 把它递给我（54 处）＋ L68 买给你（11 处）—— 仅 2 课
feel   L131 水摸着凉（27）＋ L76 好多了（20）＋ L78（4）＋ L132（1）＋ L133（1）—— 5 课，较分散
```

### 3.4 ⚠️ 任务书 4 个数字的复现尝试：**全部不复现**

```
$ node /tmp/b44/hunt46.mjs    （22 套命名口径，逐套实测）

任务书声称：keep=46  give=35  feel=34
口径                                            keep   give   feel   命中?
1 全部字段                                        94     67     61
2 非错侧                                         90     65     53
3 全字段去重                                       40     31     23
4 非错侧去重                                       39     30     21
5 句子槽                                          38     23     27
6 句子槽非错侧                                      38     23     27
7 例句+目标句+对话句                                  10      7      5
8 例句+目标句                                       8      6      4
9 仅examples[].en                                 4      4      2
10 仅 blocks[].text                               2      1      1
11 targetSentence+blocks                          6      3      3
12 非错侧 剔 deepDive                              80     57     49
13 非错侧 剔 deepDive+summary                      73     51     46
14 非错侧 剔 deepDive+summary+guided                51     33     35
15 非错侧 剔讲解                                    86     61     52
16 非错侧 剔 guided/practice                       62     41     32
17 非错侧 剔讲解+guided/practice                     41     23     25
18 非错侧句子+讲解                                   55     37     33
19 非错侧 剔 options/tokens/distractors             81     56     43
20 huntCases(正确token+corrections)                4      4      5
21 非错侧语法课 + huntCases                          94     69     58
22 句子槽非错侧 + huntCases                           42     27     32
```

并做了 2³⁵ 字段子集穷举（`/tmp/b44/mitm2.mjs`，限定字段族、左半剪枝）：
```
→ 精确命中 keep=46/give=35/feel=34 的字段子集：0 个（无解）
```

**⇒ 判定**：**任务书的 46/35/34 不是任何「字段族选择」口径的计数**，与上批登记的不确定项 U1/U2 同源（数字出自另一套未留存的脚本）。
**⇒ 引用纪律**：**凡引用这些数字，必须带口径标签**；**但三词的「原形海量 / 过去式零」这个方向，在全部 22 套口径下都成立，缺口判定不受影响。**

### 3.5 顺手发现的既有成果（影响本批判断）

`L197`／`L198`／`L199` **已经上线**（`git diff` 显示是未提交的新增，`760 insertions`）。意味着上批的「本批 2 课收 4 词」计划**已执行**：

| 课 | 标题 | 语法点 | 场景 | target |
|---|---|---|---|---|
| L197 | 想了一晚上，想通了 | 昨天的老朋友 · 有些词的昨天版要单独记 | campus | `I thought about it and knew the answer.` |
| L198 | 又游泳又唱歌 | 昨天版换零件 · swim 变 swam、sing 变 sang | ocean | `We swam in the water and sang together.` |
| L199 | 坐旁边，赶上了 | 昨天版 · sit 变 sat、catch 变 caught | train | `I sat next to her and caught the bus.` |

**⇒ 这直接影响本批判断**：`gave` / `felt` / `kept` 的「换零件」概念底座（L197 的框架 + L199 的三类换法）**已经就位**，本批不必再铺概念，**可以由 L200 直接收词**。

### 3.6 ⚠️ 修正上批一个错误结论：L197「4 词欠条」不成立

上批 §2.4 报「L197 点名了 4 个它没有教学位的词（`gave`/`told`/`felt`/`kept`）」，并逐字引用：

> 「这一批只能一个个记，没有捷径。好消息是它们数量有限，而且都是最常用的——记住一个就常在句子里碰到：went、ate、saw、bought、thought、knew、**gave、told、felt、kept**…」

**该引文在当前数据、上一批的快照（`/tmp/dd/lessons.stub.js`）、全部 git 提交对象、全部 dangling object、以及 `dist/` 构建产物中都不存在。**
证据链（全部实测）：

```
$ git log --all -S "记住一个就常在句子里碰到" -- src/data/grammarLessons.ts
（空）
$ git rev-list --objects --all | ... 逐个 blob grep "记住一个就常在句子里碰到"
（空 —— 该句从未进入任何一次提交）
$ git diff src/data/grammarLessons.ts | grep "这一批只能一个个记"
+ "这一批只能一个个记，没有捷径。好消息是它们数量有限，而且都是最常用的——你在前面几课已经碰过好几个了：
   went（第 10 课）、ate（第 10 课）、saw（第 10 课）、bought（第 11 课）、thought 和 knew（就是今天这两个）。
   剩下的以后再一个一个补。"
```

**L197 的 `deepDive.paragraphs[3]` 现行逐字点名的只有 6 个词：`went`／`ate`／`saw`／`bought`／`thought`／`knew`** —— 我逐词核验，**6 个全部有教学位**：

```
$ node /tmp/b44/iou.mjs
  went     句子槽= 55  课=[10,11,12,17,20,21,22,24,53,68,82,93,95,100,104,139,140,141,173,191,197,198,199]
  ate      句子槽= 39  课=[10,11,12,20,24,52,82,148,150,151,180,186,193,197,198]
  saw      句子槽=  8  课=[10,22,24,82,104,136,197,198]
  bought   句子槽= 24  课=[11,68,197,198,199]
  thought  句子槽= 21  课=[197,198,199]
  knew     句子槽= 18  课=[197,198]
  ⇒ 当前不存在「点名但无教学位」的欠条
```

**⇒ 结论**：上批的「L197 开出了 4 个词的欠条」是**不成立的推论**（引文来源不明；`gave`/`told`/`felt`/`kept` 这四个词恰好就是上批在查的候选词，疑为把候选清单误植为课程原文）。
**但这不动摇三词缺口的判定**——缺口由 §3.1 的独立实测成立，**只是理由必须换**：**不是「L197 承诺了」，而是「原形教了 23–90 处、过去式 0 处」**。
**⇒ L197 现行确实留了一句开放的续做承诺**，可作正当引用的替代：「**剩下的以后再一个一个补。**」

**⚠️ 承重影响**：`deliverables/product-strategy/prd-grammar-hunt-zero-term-irregular-2026-09-22.md:65` 与 `user-research-irregular-past-2-2026-09-22.md:40,431` 两处下游文档**都转引了这段不存在的原文**。本批登记为需修正项（我按纪律**不改他人产物**，只在此登记）。

---

## ④ 跨源位次表（含「按模式还是按频率」的明确回答）

### 4.0 直接回答任务书的核心问题

| 源 | 组织方式 | 是否按变化模式 | 是否按频率 |
|---|---|---|---|
| **Cambridge Dictionary Grammar** | **字母序平表**（`base form` / `past simple` / `-ed` 三列） | **否** | **否**（既非按频率排列，也非按频率选词） |
| **British Council LearnEnglish** | **字母序平表**（`Base form` / `Past tense` / `Past participle`） | **否**（分组建议只出现在**读者评论**里） | **仅按频率「选词」**（逐字 `many of the most frequent verbs are irregular`），**不按频率排序** |
| **OALD（牛津）** | **词条内联给形**，无独立表页 | **否** | **否**（按查词路径） |
| **letmeenglish（中文）** | **5 等级 × 3 类型**分组表 | **是**（但只到「三态是否同形」这一层） | 否 |
| **大陆教辅品类（新浪 93 词全文实测）** | **三级：三态型 → 音变族 → 例词** | **是，且细到音变族** | 否 |

**⇒ 明确回答**：
1. **英文权威侧（Cambridge／BC／OALD）一律是「平铺」，不是「按模式」也不是「按频率」**——`-eep→-ept`、`-eel→-elt` 这类族在三个英文源里**一次都没有出现**（我对 Cambridge 表页做了关键词计数：`"-ept": 0`、`"-elt": 0`、`"-ave": 0`、`"vowel": 0`、`"alphabet": 0`）。
2. **中文侧是「按模式」，而且分两层**：宏观用 `AAA/ABB/ABA/ABC` 三态同形型，**微观再用音变族细分**。
3. **⚠️ 因此：我们「按模式分组」不是原创设计。** 中文教辅已经做到 `-eep→-ept`（`keep/sleep/sweep`）与 `-elt/-ilt`（`feel/smell/spell/spill`）这一层，**比我们现有课程分得更细**（我们只在 L198 把 `swim/sing` 合成「i 换成 a」一族，L199 才补了三种换法的元分类）。
   **我们可声明的唯一差异，是「承载方式」：用连续剧场景 + 找错案回流来装这个分组，而不是用表格 + 默写。** 引用时**必须**这样写，不得写「分组是原创」。

### 4.1 逐字引用（≥4 处，均标 URL 与获取方式）

| # | 源 | 逐字原文 | URL | 获取方式 |
|---|---|---|---|---|
| **V1** | Cambridge `Past simple (I worked)` | **"Past simple: irregular verbs　Many verbs are irregular. Here are some common ones. Each one has to be learnt."** | https://dictionary.cambridge.org/grammar/british-grammar/past-simple-i-worked | **curl=200 直连**（本机复核） |
| **V2** | Cambridge `Table of irregular verbs` | 全页**唯一**说明文字：**"Note that be has several irregular forms: Present: (I) am, (she, he, it) is, (you, we, they) are　Past: (I, she, he, it) was, (you, we, they) were　-ed form: been"** | https://dictionary.cambridge.org/grammar/british-grammar/irregular-verbs | **curl=200 直连** |
| **V3** | British Council `Irregular verbs` | **"Most verbs have a past tense and past participle with –ed:"** … **"But many of the most frequent verbs are irregular:"** ＋ 页首 **"Level: beginner"** | https://learnenglish.britishcouncil.org/grammar/english-grammar-reference/irregular-verbs | ⚠️ **curl=000**，**经 WebFetch**（模型转述） |
| **V4** | BC 同名页**读者评论**（署名 Kirk Moore） | **"The past forms for irregular verbs are not regular -- you just have to learn them."** ＋ 学习者会 **"study these verbs in groups based on the past simple form"**（举例 `buy`/`bring`/`think` 同收 `-ought`） | 同 V3 | 同 V3 |
| **V5** | OALD `keep` / `feel` / `give` | 词条内联逐字：**`past simple kept`** / **`past simple felt`** / **`past simple gave`**；三词均带 `ox3ksym_a1`（**Oxford 3000 A1 档**）；**无「不规则动词表」页** | https://www.oxfordlearnersdictionaries.com/definition/english/keep ・ `/feel` ・ `/give` | **curl=200 直连**（需 `-L` 跟 302） |
| **V6** | letmeenglish（中文） | **「遗憾的是，我们不可能立即识别不规则动词，这使得学习它们变得困难。然而，我们可以将不规则动词分为三种主要类型」** ＋ **「动词按这三种类型分类，以便更容易记住它们。」** | https://letmeenglish.com/zh-hans/irregular-verbs/ | **curl=200 直连** |
| **V7** | 大陆教辅（新浪，**本批最关键的引用**） | **「4．把-eep变为-ept。(3个)　keep—kept—kept　sleep—slept—slept　sweep—swept—swept」** | https://k.sina.com.cn/article_6839260292_197a6d48400100e2mc.html | **curl=200 直连，全文可读** |
| **V8** | 同上 | **「6．过去式、过去分词都含有-elt或-ilt。(4个)　smell—smelt—smelt　spell—spelt—spelt　feel—felt—felt　spill—spilt—spilt」** | 同 V7 | 同 V7 |
| **V9** | 同上 | **「1．i—a—u变化。(6个)　begin—began—begun　drink—drank—drunk　sing—sang—sung　ring—rang—rung　swim—swam—swum　sink—sank—sunk」** | 同 V7 | 同 V7 |
| **V10** | 同上 | **「（二）A—B—B型，即过去式、过去分词相同。(共41个)」「（三）A—B—C型，即原形、过去式、过去分词都不相同。(共35个)」** | 同 V7 | 同 V7 |
| **V11** | 教辅（搜狐，经搜狗摘要） | **「过度依赖规则：尽管大多数动词遵循加-ed规则，但不规则动词在英语中占有重要地位，不可忽视。」** | https://www.sohu.com/a/878047005_121814834 （经搜狗检索页摘要） | 搜狗**摘要级** |
| **V12** | 教辅（搜狗摘要） | **「这份汇总表将 100 + 个常用不规则动词按形式规律分成 16 大类，每类附典型例词、变化规则和汉语意思」** ＋ **「把"无序"变"有序"，记忆效率提升 300%」** | 搜狗检索页（多条教辅） | 摘要级 |

### 4.2 位次表（本批 3 词 × 4 源）

| 词 | Cambridge 表 | BC 表 | OALD | letmeenglish（等级／类型） | 大陆教辅（族） |
|---|---|---|---|---|---|
| **`felt`** (feel) | ✅ 在表（`feel felt felt`），**位于 `feed fed fed` 与 `fight fought fought` 之间** ＝ 纯字母序 | ✅ 在表 | A1，内联 `past simple felt` | **初级** / **类型 2** | **`-elt或-ilt` 族**（4 词：smell/spell/feel/spill） |
| **`kept`** (keep) | ✅ 在表（`keep kept kept`），**位于 `hurt hurt hurt` 与 `know knew known` 之间** ＝ 纯字母序 | ✅ 在表 | A1，内联 `past simple kept` | **初中级** / **类型 2** | **`把-eep变为-ept` 族**（3 词：keep/sleep/sweep） |
| **`gave`** (give) | ✅ 在表（`give gave given`），**位于 `get got got` 与 `go went gone` 之间** ＝ 纯字母序 | ✅ 在表 | A1，内联 `past simple gave` | **初级** / **类型 3** | **`i—a—u` 族** 的邻位（give 走 `过去分词由原形加(e)n构成` 一支，见 §9.3 不确定项） |

**⚠️ 一个重要的反面观察（对我方拆课有直接约束）**：
**`feel` 与 `keep` 在 letmeenglish 里被分在「不同等级」**（feel＝初级，keep＝初中级），**尽管它们共享同一音变模式**（双 `ee` → 短 `e` + `t`）。
⇒ **即使是中文侧最「按模式分组」的产品，等级轴也会把同模式词切开。** 这说明**「同模式同课」不是行业惯例，而是一个取舍**——我方 L200 把 `felt`+`kept` 合并（跨等级），是一个**有意的设计选择**，引用时应说明理由（同机制、同期出现频率都高），**不能声称「行业都这么做」**。

---

## ⑤ 竞品矩阵与空位判定

**⚠️ 说明**：本批**无法访问竞品付费/登录内容**。区分「**实测可见**」（首页／公开页／可直连内容页）与「**未核实**」。**不把未核实项写成结论。**

| # | 产品 | 侧 | 不规则过去式的公开处理 | 组织方式（实测／推断） | 「场景」 | 「错句回流」 | 空位 |
|---|---|---|---|---|---|---|---|
| 1 | **Cambridge Dictionary Grammar** | 英 | `Table of irregular verbs` 一整页**字母序平表**（三列）；全页**唯一**说明文字是 `be` 的说明 | **平铺＋字母序**（实测：`feel` 邻 `feed`/`fight`；`keep` 邻 `hurt`/`know`；`give` 邻 `get`/`go`） | ❌ 无场景，只有例句 | ❌ | **零教学指导**：「怎么记」完全空缺，逐字 `Each one has to be learnt.` 后面没有任何方法 |
| 2 | **British Council LearnEnglish** | 英 | 参考页平表；页首 `Level: beginner` | **平铺＋字母序**；**分组建议只在读者评论里**（V4） | ❌ 有 Story zone，但**不服务不规则过去式** | ❌ | 上游把问题交还学习者；**「按 -ought 分组」的好想法被埋在评论区**，未被产品化 |
| 3 | **OALD（牛津）** | 英 | **词条内联给形**（`past simple kept`）；**无独立表页** | **逐词条** | ❌ | ❌ | 有 **Oxford 3000 A1/A2/B1 分档**（可作等级依据），但**不做教学组织** |
| 4 | **Duolingo（多邻国）** | 英/中 | **未核实**（`duolingo.cn` 首页仅返回字符串 `Duolingo`；沿用前批存档） | 推测**按句型/场景的树** | ✅ 场景化最强 | ❌ 有错题重练，但**不回流到语法点** | **场景强、显式规则弱**；不规则形散落句型中，不集中 |
| 5 | **letmeenglish** | 中 | **5 等级 × 3 类型**完整表（**curl=200 全表可读**） | **按形态类型分组**（逐字「动词按这三种类型分类，以便更容易记住它们」）；**但等级轴会把同模式词切开**（feel 初级 / keep 初中级） | ❌ 纯表格 + 填空练习 | ❌ | **中文侧最佳的分组意识，但无场景、无错句回流**；且**分组只到「三态同形」，不到音变族** |
| 6 | **大陆教辅（`归类记忆表` 品类）** | 中 | **`AAA/ABA/ABB/ABC` 归类表 + 默写版；细分到音变族**（V7–V10：`-eep→-ept`／`-elt,-ilt`／`i→a→u`） | **三级：三态型 → 音变族 → 例词** | ❌ | ❌ | **分组已做到极致**——但它**只解决「表怎么变小」，不解决「用户想不想学、错了能不能被打回来」**；实测多条标题含「归类记忆表」「默写表」，**无一条含场景或错句纠错** |
| 7 | **扇贝** | 中 | 首页**完全无**该语法点（title 逐字 `扇贝英语 - AI 驱动的英语学习平台｜背单词·阅读·听力口语`） | 推测**词书驱动** | ❌ | ❌ | **背单词平台**——不规则形不在其「词」的概念里，**结构性缺位** |
| 8 | **英语兔** | 中 | 首页**完全无**该语法点（实测 `不规则`/`过去式`/`irregular`/`past tense` 计数全为 0） | — | ✅ 有「情境口语」产品线 | ❌ | 有「情境」但**语法点组织未知**；不规则过去式未在其公开可见内容中出现 |
| 9 | **可可英语 / 沪江** | 中 | 首页**完全无**该语法点（实测两站四词计数全为 0） | — | ❌ | ❌ | 资讯/题库站；该语法点不在公开入口 |

### 5.1 空位判定的三条硬结论

**① 「场景 + 错句回流」在全部被测产品的公开层是零见——这个组合是真的空位。**
- 英文侧：Cambridge／BC／OALD **三源连「场景」都没有**（全是用例句 + 表）；
- 中文侧：letmeenglish 与教辅**是纯表格 + 练习题**；
- 扇贝／英语兔／可可／沪江：首页**完全没有这个语法点**。
- **⇒ 我方「小美的一天」连续剧 + 找错案回流，在这个点上没有对标产品。这是真实差异化。**

**② ⚠️ 但空位的表述必须精确，不能说成「分组是原创」**（这是本批对上批最重要的修正）。
- 中文侧**不是「无组织的表格」**，而是**「按形态类型分组、且细分到音变族的表格」**（V7–V10 实证）；
- **中文侧已经解决了「怎么把表变小」**（`-eep→-ept` 三词一族，`-elt/-ilt` 四词一族）；
- **它没解决的是「怎么让用户想学、并且在错的时候被打回来」。**
- **⇒ 准确的空位表述**：**「不是分组，是承载方式」** —— 我们不跟它比表做得好不好，我们比**表之外的东西**（场景连续性 + 错句回流 + 零术语叙事）。

**③ 英文权威侧的空位是「怎么记」，而且是明说的。**
- Cambridge 逐字 `Each one has to be learnt.` 后面**没有任何方法**（V1）；
- BC 逐字给了 `most frequent` 的表**却不说怎么记**，而唯一的「怎么记」好点子（按 `-ought` 分组）**被放在读者评论里**（V4）；
- **⇒ 上游是「把问题交还给学习者」。** 我方 L197 deepDive 已给出的机制说明（「它们是英语里最老的词，老到还没形成『加 -ed』这套规矩的时候就在用了」）**已经超出上游**。

---

## ⑥ 中文负迁移证据（严格区分「明说」与「推断」）

**纪律声明**：本节每条标 `【明说】`（源里逐字写了）或 `【推断】`（我的推理，源里没写）。**两者不混排。每条都带来源 URL。**

### 6.1 【明说】源里明确承认的痛点

| # | 逐字原文 | 来源 URL | 获取方式 | 判读 |
|---|---|---|---|---|
| **M1** | **「遗憾的是，我们不可能立即识别不规则动词，这使得学习它们变得困难。」** | https://letmeenglish.com/zh-hans/irregular-verbs/ | curl=200 | 中文侧自认的核心痛点 ＝ **「看不出来」**（无法从原形预测过去式） |
| **M2** | **「动词按这三种类型分类，以便更容易记住它们。」** | 同上 | curl=200 | 自认的解法 ＝ **按形态分组**（承认「记不住」是问题） |
| **M3** | **「日常英语中大约有 200 个不规则动词。」** | 同上 | curl=200 | 给出规模感知 |
| **M4** | **"Each one has to be learnt."** | https://dictionary.cambridge.org/grammar/british-grammar/past-simple-i-worked | curl=200 | **英文权威侧同样承认「无捷径」** |
| **M5** | **「过度依赖规则：尽管大多数动词遵循加-ed规则，但不规则动词在英语中占有重要地位，不可忽视。」**（列为「**常见误区**」第一条） | https://www.sohu.com/a/878047005_121814834 | ⚠️ **搜狗摘要级** | **中文侧自认的第一号误区就是「过度依赖规则」**——与「误加 -ed」直接对应 |
| **M6** | 知乎问题标题逐字：**「给英语不规则动词错加上了 -ed 是一种怎样的体验？」**（4 个回答 / 20 人关注 / 1051 次浏览） | https://www.zhihu.com/question/267533925 | ⚠️ **搜狗摘要级**（知乎本体 403） | 说明「误加 -ed」是**中文学习者实际遭遇过并会拿出来讨论的现象**（但样本量小，不可当规模证据） |
| **M7** | 同一问答的高赞回答逐字：**「之前我妹跟我提到了meeted这个词，我一时没反应过来……然后跟她科普了下XeeX的过去一般都是XeXt。」** | 同上 | ⚠️ 搜狗摘要级 | **自认的具体错形是 `meeted`**（`meet` 误加 -ed）；且**自认的教法是「XeeX 的过去一般是 XeXt」＝按模式类推** |
| **M8** | **「将 100 + 个常用不规则动词按形式规律分成 16 大类」**＋**「把"无序"变"有序"，记忆效率提升 300%」** | 搜狗检索页（多家教辅） | ⚠️ 摘要级 | 「无序→有序」是中文教辅的**核心卖点主张**（`300%` 为营销数字，无实证） |
| **M9** | **「不规则动词的过去式是同学们学习的重点也是一个难点」** | 搜狗检索页（爱问共享资料多份文档） | ⚠️ 摘要级 | 教辅品类自认的重难点 |

### 6.2 【复核】上批关于 Cambridge `Past: typical errors` 的结论：**精确成立**

**复核方式**：`curl=200` 直连 https://dictionary.cambridge.org/grammar/british-grammar/past-typical-errors ，全文提取。

```
$ node /tmp/b44/camb4.mjs
  'Not:' 出现 7 次
   [0] I was walking to school every day …            （该用 past simple 表习惯）
   [1] I was calling her office at 4 o'clock yesterday afternoon
   [2] I've woken up at seven o'clock this morning
   [3] I didn't pay my electricity bill yet
   [4] He was cycling to Claire's house last night
   [5] We were having picnics in the park in the summer
   [6] If we had known you were alone, we had visited you
  === 是否存在 -ed / 误加 ed / 不规则 相关字眼 ===
    "-ed": 0 ・ "add -ed": 0 ・ "correct form": 0 ・ "wrong form": 0
    "irregular": 1 ・ "irregular verb": 1
```

**这 7 条的分类**（我逐条判定）：

| # | 错误性质 | 计数 |
|---|---|---|
| 1 | past simple vs past continuous（表习惯） | 时态选择 |
| 2 | past simple vs past continuous（特定时刻的完成事件） | 时态选择 |
| 3 | past simple vs present perfect（确定过去时间） | 时态选择 |
| 4 | present perfect vs past simple（延续到现在） | 时态选择 |
| 5 | past simple vs past continuous（重复主事件） | 时态选择 |
| 6 | past continuous vs used to | 时态选择 |
| 7 | past perfect 用于条件句主句 | 时态选择 |
| **时态选择类合计** | | **7** |
| **误加 -ed / 用错不规则形类合计** | | **0** |

**⚠️ 一个溯源陷阱（必须写进引用纪律）**：该页 `"irregular"` 出现 **1 次**，但**它出现在左侧栏的导航链接**（`… Table of irregular verbs Words, sentences and clauses …`），**不在 7 条错误清单里**。任何自动抓取若只做字符串匹配，会误报「该页提到 1 次 irregular（=关于不规则动词）」。
**⇒ 【明说】权威侧的错误清单里，零条关于误加 -ed。**

### 6.3 【推断】我的推理（源里没写，标注依据强度）

| # | 推断 | 依据 | 强度 |
|---|---|---|---|
| **I1** | **「误加 -ed」在中文学习者中真实存在，但权威侧不给它位置**：Cambridge 的 `Past: typical errors` 页 7 条全是时态选择、0 条误加 -ed（§6.2 实证），而中文侧自己把「过度依赖规则」列为**常见误区第一条**（M5）。**⇒ 这是一个「学习者实际会犯、权威教材不处理」的错型**，正好是我方找错案的价值位。 | M5（明说）＋ §6.2（明说）× 我的连接 | **中高**（两端都有明说证据，连接是我的） |
| **I2** | **中文教辅的「归类记忆表」解决的是「复习效率」，不是「首次理解」**：`300%` 之类的卖点（M8）都指向「背得快」，而 M1 承认的痛点是「识别不出」。**⇒ 归类表假设用户已经知道要背哪些词，不解决「第一次遇到时怎么认出来」。** | M1＋M8（均明说）× 我的解释 | **中** |
| **I3** | **`felt`/`kept` 的「同族」性质中文侧已明说，但我方不该声称原创**（V7/V8 逐字已给 `-eep→-ept`、`-elt/-ilt` 两组）。**⇒ 我方 L200 若把 `felt`+`kept` 合课，理由应写成「同一机制」，不是「我们首创了按模式分组」。** | V7/V8（明说） | **高** |
| **I4** | **`gave` 的错型很可能不是「误加 -ed（`gived`）而是「错形替换」**（`give`/`gave`/`given` 三态全不同，且 `give` 在双宾语结构里高频出现，中文学习者易把语序错误与形式错误混同）。但这**没有任何源明说**，`gived` 我在全部可访问源里**一处也没见到**。 | 无源，纯推理 | **低（明确标为待验证）** |
| **I5** | **我方「连续剧场景 + 错句回流」之所以是真空位，是因为上游的激励机制不同**：英文权威侧的目标是「描述语言」（所以只给表），中文教辅的目标是「应试复习」（所以给默写表）。二者都**不承担「让用户愿意反复回来」的职责**。 | §5 公开层实测 × 我的解释 | **中**（业务判断，非语言学结论） |

**⚠️ 明确登记「无从证明」的两条**：
- **「误加 -ed 是中国学生的主要错法」没有任何实证源**（频率、占比、与其它错型的相对位次全部无数据）。**不得写「研究表明」**。
- **`gived` / `keeped` / `feeled` 这三个具体错形，我在全部可访问源里（Cambridge 错误页、BC、OALD、letmeenglish、搜狐、知乎摘要、新浪教辅）一处也没找到明说。** 唯一见到明说的具体错形是 **`meeted`**（M7）。

---

## ⑦ 独立可做性判断

### 7.0 先回答「该做几个」

**建议：1 课，收 2 个词（`felt` + `kept`）；`gave` 挂靠不立课。**

| 候选 | 原形非错侧（②口径） | 原形句子槽（③口径） | 过去式（全库①口径） | 判定 |
|---|---|---|---|---|
| **`felt`** | **53** | **27**（5 课） | **0** | ✅ **做**（入 L200） |
| **`kept`** | **90** | **38**（2 课） | **0** | ✅ **做**（入 L200） |
| **`gave`** | **65** | **23**（2 课） | **0**（语法课）／**3 处正确 token**（hunt） | ⚠️ **做，但走挂靠**（见 §7.3） |
| `told` | 2 | 2（1 课） | 0 | ❌ **拒绝** |
| `wrote` | 2 | 0 | 1（仅 L23 讲解提及） | ❌ **拒绝立课**（可低成本挂靠 L23） |
| `meant` | 1 | 1（**义项不符**） | 0 | ❌ **拒绝**（理由见 §7.4） |
| `slept` | 85 | 44（14 课） | 0 正面／**10 处错侧** | ⏸ **本批不做**（见 §7.5） |

### 7.1 `felt` + `kept` 合并成一课（L200）——**推荐**

**支持证据（全部实测）**：
1. **同一机制**：两者都是「双 `ee` 缩成一个 `e`，尾巴加 `t`」——`feel→felt`、`keep→kept`。**中文侧明确把这归为族**：`-eep→-ept`（keep/sleep/sweep，V7）与 `-elt或-ilt`（smell/spell/feel/spill，V8）。
2. **概念底座已就位**：L197 已建立「有一批老朋友的昨天版要单独记」，L199 的 deepDive 已逐字给出**三种换法**（元音换／整个换带不发音字母／连开头都换）。**L200 只需增加第四种：「尾巴上加一个 t」。**
3. **两者频率都高**：非错侧 `keep` 90 处、`feel` 53 处。**这是本批唯一两个「原形 ≥50 且过去式 0」的词。**
4. **对照卡设计现成可用**（沿用 L197/L198/L199 已验证的错型家族 `*+ed`）：`*I keeped reading.` / `*The water feeled cold.`
5. **可同场景**：`keep reading`（一直看）＋ `feel cold`（觉得冷）**天然同处一个夜晚场景**——天气冷、一直看书，是我方场景库的现成组合（`snow` 场景仅 2 课用过，末次 L180，**资源闲置**）。

**⚠️ 与上批计划的差异（必须说明）**：上批把 `felt`/`kept` 列为「**不立课**，补进已有课」。**我不同意**，理由：
- `keep` 的落点只有 **L77/L78 两课**，`feel` 的落点是 **L76/L131 等 5 课**——**两词的挂靠点不相交**，挂靠意味着**改动两处**；
- 而 L77（`keep + 动名词`）的教学点是**动词搭配**（`keep doing` vs `finish doing`），L131（`feels cold`）的教学点是**感官动词不站 be**。**在这两处塞「昨天版」都会与原有焦点竞争**（两课的 `contrast` 都已经是满 6 张）。
- **⇒ 立一课（场景内同族收纳）比改两课（各自混焦）更干净。**

### 7.2 ⚠️ 但 L200 有一个**待守门项**（诚实登记）

`L199` 的 `longestClause` ＝ **9**（`I sat next to her and caught the bus.` 共 9 词，逗号不切句——切句规则是 `[.!?]`）。按上批核验代码的守门规则（**跳 ≤5**），L200 的 `targetSentence` **最长分句 ≤14 词**；上批计划里的 `I felt cold in the snow, but I kept reading.`（**10 词，跳 +1**）**仍可用**。
（实测：`L197 = 8`、`L198 = 8`、`L199 = 9`、L200 候选 = 10。）
我**未做**完整的「未教过的词」守门复算（需要 `cumulativeUpTo(199)` 的全量词汇累积）——**这属于实现期守门，本批只做研究，故登记为待执行项**，不写成已通过。

### 7.3 `gave`：挂靠 vs 立课 —— **独立评估（我的结论与任务书猜的挂靠点不同）**

**先给结论**：**`gave` 应当挂靠（不立新课）**，但**挂靠点应是 L199（按机制同类），不是 L63（那是语义/语序课）**。

**A. 为什么「不立课」**：
1. **单课收一个词，密度过低**。本批若立 L200（`felt`+`kept`）+ L201（`gave`），**两课收 3 词**；而 `gave` 与 L198/L199 的机制**完全同型**（`i→a` 元音换：`swim→swam`、`sing→sang`、`sit→sat`、`give→gave`），**本可以不必单独占一课**。
2. **它已经在 3 个 hunt 案里作为正确 token 出现**（#9/#20/#27）——缺的是「讲」，不是「见」。

**B. 为什么挂靠点是 L199 而不是 L63（评估任务书提的 L63 方案）**：

| | **挂 L63（任务书提案）** | **挂 L199（我的提案）** |
|---|---|---|
| 优势 | **同词**：L63 是 `give` 的主课（54 处），用户在这里学过 `give` 的**语序** | **同机制**：L199 的 deepDive 已逐字讲「**i 换成 a**」（`sit→sat`），`gave` 是**同一个换法**；L199 的场景是 `train`，`give` 的「递给」动作可自然发生 |
| 优势 2 | L63 已有 6 张对照卡与 hunt 案 #72（含 `give`） | 不必重铺「换零件」概念——L199 就在讲这件事 |
| **劣势** | **与 L63 焦点冲突**：L63 的 6 张对照卡**全部用在语序**（`Give me it.` / `Give the book me.` / `to` vs `for`）。再塞「昨天版」会让一课的焦点从 1 个变 2 个 | 需**回填**已上线的课（改动面比新课小，但仍是改动） |
| **劣势 2** | **时序问题（决定性）**：**L63 在 L197 之前**。用户在 L63 时**还没有「换零件」的概念**——在 L63 讲 `gave` 要么「超前」（违反课程次序），要么只能在 L197 之后**回填**。**既然无论如何都要回填，就没有理由选一个焦点冲突的挂靠点。** | — |

**⇒ 判定**：**任务书的 L63 方案「可行但次优」**。若采用，**必须以后置回填（挂复习面）的形式，不得改 L63 正文**。**我推荐改挂 L199**，成本相当而焦点不冲突。

**C. 一个次要但真实的顾虑（登记，不阻塞）**：`gave` 的 `i→a` 虽与 `sit→sat` 同族，但 **`give` 是三态全不同**（`give/gave/given`），而 `sit`/`sit/sat/sat` 是两态同形。**在 L199 加 `gave` 会引入「第三态」这个概念**，而 L199 的 `deepDive` 只讲「昨天版」、不讲「做过版」。**⇒ 建议：在 L199 只提 `gave`（昨天版），明确不碰 `given`**，把 `given` 留给将来的完成时课。

### 7.4 明确拒绝的低价值候选（含比上批更硬的拒绝理由）

| 候选 | 判定 | 理由（实测） |
|---|---|---|
| **`told`** | ❌ **拒绝**（立课与挂靠**都拒绝**） | ① `tell` 全库仅 **2 处**（`L41 dialogueEn` ＋ `L41 dialogue[0].en`，同一句 `Can you tell me about your class?`），**且是对话里的顺带一句，不是教学点**；② 原形**没被当作语法点教过**（L41 的语法点是定语从句）——**先有原形教学位，才谈得上过去式缺口**；③ ⚠️ **上批把 `told` 列为「L197 的欠条」，该欠条已证伪（§3.6）**，所以上批「该做的是补回流，不是立课」这个结论**依据已消失**，本批改为**完全拒绝** |
| **`wrote`** | ❌ **拒绝立课**；✅ **可低成本挂靠 L23** | ① `write` 全库 **2 处**，且**句子槽 0 处**——原形从未作为句子被教过；② `wrote` 仅 **1 处**，在 `L23 deepDive.paragraphs[2]` 的**元语言旁注**里（逐字：「write 的昨天版是 wrote、做过版是 written。两件外套别穿混。」），**不是在教 wrote**；③ **但这一处是真实存在的「点名」**（与 §3.6 那个不存在的引文不同，这个是实测到的）——**⇒ 若未来要做，挂 L23（`have + 做过版`）是唯一自然位置，成本极低**；本批**不做** |
| **`meant`** | ❌ **拒绝**（理由比上批更硬） | ① `mean` 全库仅 **1 处**：`L95 dialogue[1].en` ＝ **`At eight, I mean.`** ——**这是话语标记「我是说」，不是「意思是/意味着」那个义项**；② **⇒「意思是」这个义项（`mean` 作为可教的实义动词）在全库 0 处**——这已不是「频次低」，而是**原形教学位根本不存在，且现存那 1 处是另一个义项**；③ 上批说「原形只教过 1 次，过去式不是瓶颈」**低估了问题**：真实情况是**该义项零教学位** |
| **`slept`** | ⏸ **本批不做**（但升级为下批第一候选，且**性质已查明**） | 见 §7.5 |
| `wore` / `sought` / `fed` 等层 C 词 | ❌ 拒绝 | 原形教学位 **0**（上批已实测 37 词，本批未复算，沿用） |

### 7.5 `slept`：本批不做的理由，以及一个上批没有的观察

**为什么不并入 L200**：
- `slept` 的教学冲突点**不是「换零件」**，而是 **「`was sleeping` vs `slept`（进行 vs 完成）」**——它已经在 **L98/L102 的 10 处错句**里被反复打过，罪因**全部是时态选择**，与 `felt`/`kept` 的「加 -ed」错型**不同科**；
- 把 `slept` 塞进「换零件」课会**混淆两个不同的语法冲突**（L199 的 deepDive 已明确把「-aught/-ought」和「元音换」分开讲，说明我方课程有意识地在区分机制）。

**上批没有的观察（本批新增）**：**`slept` 是全库唯一一个「已经被错句正面打过」的不规则过去式**——用户已经**在 3 节课（L97/L98/L102）被明确告知「这里不能用 slept」**。
⇒ **正面意义**：**错句回流机制对 `slept` 已经预热完毕**——用户对 `slept` 有「这是个陷阱」的印象，此时**给它一个正面教学位，转化率应高于一个全新词**。
⇒ **这在产品上是一个可用的钩子**：`slept` 的处理方式**不该是「再开一课教它」，而该是「把用户已有的『这个错了』的记忆翻正成『那什么时候用它』」**。**这是一个独立的、值得单独设计的小课题**，不是 L200 的附庸。

---

## ⑧ 自我核查记录（命令 ＋ 口径 ＋ 输出）

### 8.1 脚本清单（全部只读，位于 `/tmp/b44/`，未写入项目目录）

| 脚本 | 用途 |
|---|---|
| `load.mjs` | **加载器**：esbuild 打包 `src/data/*.ts`（`.jpg`/`.png`/`.svg` 资源 loader=text），规避 39k 行 TS 的正则解析 |
| `slept.mjs` | `slept`/`sleep`/`sleeping`/`asleep` 逐字段落点（无口径过滤） |
| `guided.mjs` | L97/L98 的 `guided`/`practice`/`contrast` 全量 JSON dump |
| **`slept_final.mjs`** | **`slept` 定案**：带 `kind` 感知的正面/错侧判定 ＋ 复现「2 处」的产生机制 |
| `caliber.mjs` | 五套口径（全字段/非错侧/句子槽/展示槽/core）对 14 词的交叉表 |
| `triple.mjs` | `kept`/`gave`/`felt`/`told`/`wrote`/`meant`/`slept` 全字段落点逐条 |
| `hunt46.mjs` | **22 套命名口径**对 `keep`/`give`/`feel` 的计数（复现任务书 46/35/34 的尝试） |
| `mitm2.mjs` / `mitm4.mjs` | **2³⁵ 字段子集穷举**（meet-in-the-middle ＋ 剪枝），搜「哪套字段子集能产出 46/35/34」 |
| `hypo.mjs` | 8 套「非字段类」假设（去重／课数／含 huntCases／含变形） |
| `snap.mjs` | 快照假设（L≤192/194/…/199，看数字是否来自更早基线） |
| `iou.mjs` | L197 现行点名 6 词的欠条核验 ＋ L198/L199 的「原形→昨天版」对核验 |
| `l198.mjs` / `l63.mjs` / `l23.mjs` / `prec.mjs` | L197/L198/L199 全量 dump；L63/L68/L77/L131 挂靠点分析；L10/L11/L23/L41/L95 先例 |
| `gave_hunt.mjs` | `gave` 在 3 个 hunt 案里的身份（正确 token vs 被纠错） |
| `camb*.mjs` / `lme*.mjs` / `sina*.mjs` / `sog*.mjs` / `ox*.mjs` / `comp.mjs` | 外部源抓取与逐字提取 |

### 8.2 关键命令与实际输出（可直接复跑）

```bash
# 数据基线（口径：数组长度）
$ node -e '...load...'
grammarLessons: 199 课（末课 lesson-199-sat-caught）  huntCases: 208 案（末案 #208）

# slept 定案（口径：kind 感知的正面/错侧判定）
$ node /tmp/b44/slept_final.mjs
⇒ 总计 11 处；其中「正面教学位」0 处（零）；「错侧」10 处；「讲解引述」1 处

# 三词缺口（口径：①全字段 / ②非错侧 / ③句子槽）
$ node /tmp/b44/triple.mjs
kept  全字段=0  非错侧=0  句子槽=0  hunt=0
gave  全字段=0  非错侧=0  句子槽=0  hunt=3（正确 token）
felt  全字段=0  非错侧=0  句子槽=0  hunt=0

# 任务书数字复现（口径：22 套命名口径逐一实测）
$ node /tmp/b44/hunt46.mjs
⇒ 46/35/34 在 22 套口径下无一命中

# 字段子集穷举（口径：字段族 == 数组下标折叠）
$ node /tmp/b44/mitm2.mjs
→ 精确命中 keep=46/give=35/feel=34 的字段子集：0 个（无解）

# L197 欠条核验（口径：句子槽·非错侧）
$ node /tmp/b44/iou.mjs
went 55 / ate 39 / saw 8 / bought 24 / thought 21 / knew 18 —— 6 词全部有教学位

# 上批遗留脚本对当前数据复跑（口径：上批脚本原样）
$ ./node_modules/.bin/vite-node deliverables/product-strategy/.irregular-past-2-check.mts
kept 0/0/0、felt 0/0/0、gave 0/0/0（hunt 3）、swam 48、sang 42、caught 48、sat 44
→ 与上批报告一致 ⇒ 上批的数字在它自己的口径下自洽；swam/sang/caught/sat 已被 L198/L199 兑现
```

### 8.3 外部源获取状态（逐条实测）

| 源 | 状态 | 备注 |
|---|---|---|
| Cambridge `Table of irregular verbs` | **HTTP 200** ✅ | 463,308 bytes；逐字全文可读 |
| Cambridge `Past simple (I worked)` | **HTTP 200** ✅ | 462,883 bytes；`Each one has to be learnt.` 逐字定位到 offset 67331 |
| Cambridge `Past: typical errors` | **HTTP 200** ✅ | 448,092 bytes；`Not:` ×7 全文提取 |
| OALD `keep`/`feel`/`give`/… | **HTTP 200** ✅ | ⚠️ **必须用 `curl -L`**（裸 URL 返回 302、0 字节）；`past simple kept/felt/gave` 逐字 |
| letmeenglish（中文） | **HTTP 200** ✅ | 80,236 bytes；5 等级 × 3 类型全表可读 |
| 新浪《中考英语常见93个不规则动词变化》 | **HTTP 200** ✅ | **本批最有价值的中文全文源**（V7–V10） |
| 搜狗检索 | **HTTP 200** ✅ | 摘要级可用（摘要里含 `commonResult` 的 JSON 正文） |
| **British Council** | **HTTP 000** ❌ 直连 | **7 个路径全部 000**，与上批一致；**唯有经 WebFetch 可读** ⇒ BC 逐字可靠性低于直连源 |
| 知乎（`zhihu.com/question/...`） | **HTTP 403** ❌ | 本体不可读，只能借搜狗摘要（M6/M7 已标为摘要级） |
| **Bing 中文检索** | **不可用** ❌ | 实测同上批：多词中文查询被拆成单字（查「不规则动词 过去式 类型」返回「不（汉语汉字）_百度百科」） |
| 多邻国 `duolingo.cn` | HTTP 200 但**仅返回字符串 `Duolingo`** | 无法核实 |
| 扇贝 / 英语兔 / 可可 / 沪江 | **HTTP 200**，但**四词计数全为 0** | 首页完全无该语法点（§5 已按此写） |

### 8.4 我**没有**做的事（边界声明）

- ❌ **未改动任何代码或数据**（任务书要求只做研究）；
- ❌ **未复算 L200 的「未教过的词」守门**（需 `cumulativeUpTo(199)` 全量词汇累积）——登记为实现期待执行项（§7.2）；
- ❌ **未重试 Murphy 双册 / Swan PEU**（按任务书指示，正式登记「不可得」，见 §9.1）；
- ❌ **未逐字读到 letmeenglish 的练习题原文**（页面把练习题放在折叠/懒加载区，我的提取脚本未取到；**未把「练习题是填空型」写成结论**——上批有此表述，本批**未复现**，故不沿用其逐字）。
- ❌ **未修改下游三份被污染文档**（`competitive-analysis-irregular-past-2-*.md`／`prd-grammar-hunt-zero-term-irregular-*.md`／`user-research-irregular-past-2-*.md`）中那段不存在的 L197 引文，**只登记**（§3.6）。

---

## ⑨ 抓不到的源与不确定项

### 9.1 按任务书指示「正式登记不可得」（本批未重试）

| 源 | 状态 |
|---|---|
| **Murphy《Essential Grammar in Use》** | **不可得**（上批已建议正式登记，本批按要求不重试） |
| **Murphy《English Grammar in Use》(Intermediate)** | **不可得**（同上） |
| **Swan《Practical English Usage》** | **不可得**（同上） |

**替代方案（沿用上批）**：**OALD 的 Oxford 3000 档位徽章**（`ox3ksym_a1` 等，可直连实测）**是比 Murphy 更细的可核验等级依据**。本批实测：`keep`／`feel`／`give`／`tell`／`write`／`mean`／`sleep`／`swim`／`sing`／`sit`／`buy`／`think`／`know` **均为 A1**；`catch` 为 **A2/B1/B2**（= 唯一非 A1 的），与上批「`catch` 是唯一的 A2」**一致**。

### 9.2 不确定项（诚实登记）

| # | 不确定项 | 影响 | 处置 |
|---|---|---|---|
| **U1** | **任务书的 `keep` 46／`give` 35／`feel` 34 在 22 套命名口径 ＋ 2³⁵ 字段子集穷举下均不复现** | **中**：与上批 U1/U2 同源（数字出自另一套未留存的脚本） | **本报告一律用自报实测值并带口径标签**；**建议下游引用这些数字必须带口径** |
| **U2** | **本批给的 `sleep` 35 不复现**（上批的 37 可复现＝上批 `core` 口径） | **低** | 已登记；**方向（原形海量／过去式零）在全部口径下成立** |
| **U3** | **上批 L197「4 词欠条」的引文在任何数据/快照/git 对象里都不存在** | **中**：三份下游文档已转引 | **已在 §3.6 完整登记证据链**；**建议修正下游三处引用**（我未改他人产物） |
| **U4** | **BC 的逐字全部经 WebFetch（模型转述）** | **中** | 凡引 BC 处已标「经 WebFetch」；**BC 的关键结论（平铺、`Level: beginner`、无专课）与 Cambridge/OALD 独立一致**，可靠性由交叉印证兜底 |
| **U5** | **BC「按 -ought 分组」的说法只在读者评论里**（V4） | **中**：若下游当 BC 立场会溯源错误 | 已在 §4.1（V4）与 §5（#2 行）**两处显式标注为读者评论** |
| **U6** | **中文侧的「音变族」证据目前只有 1 个全文源（新浪）**（其余为搜狗摘要） | **中** | **结论（中文侧按模式分组且细到音变族）有 1 个全文 ＋ 多条摘要一致支撑**；但**「是不是行业普遍做法」只能说「不罕见，需第二全文源补强」** |
| **U7** | **`gived`/`keeped`/`feeled` 三个具体错形，在全部可访问源里零明说** | **中**：影响 §6.3 的 I4 与错句设计论证 | **已在 §6.3 全部标为【推断】并给强度评级**；**不得写「研究表明」** |
| **U8** | **竞品付费/登录内容未核实**（多邻国/扇贝/英语兔/可可/沪江） | **中** | §5 已逐行标「未核实/推断」；**「场景 + 错句回流零见」严格说是「公开层零见」** |
| **U9** | **L200 的「未教过的词」守门未复算** | **中**：影响 L200 可行性 | 已在 §7.2 登记为**实现期待执行项**，**未写成已通过** |
| **U10** | **`gave` 在中文教辅的族归属有两种可能**（`i—a—u` 族 vs `过去分词由原形加(e)n构成` 一支） | **低**：不影响「`gave` 走 `i→a`」的机制判断 | 已在 §4.2 表内标注；**V7 全文里 `give` 归在「6．过去分词由原形加(e)n构成。（6个）」一支**（因 `given` 形态），**不从 `i—a—u` 族**——**⇒ 我方若把 `gave` 与 `swam/sang/sat` 归为「i→a 一族」，那是按「昨天版」单看的选择，与中文教辅按「三态」归属不同，需声明** |
| **U11** | **letmeenglish 练习题未能提取原文** | **低** | 已在 §8.4 声明；**不沿用上批「练习题是填空型」的表述**（本批未复现） |

### 9.3 给下一批的交接（4 条）

1. **`slept` 的正面教学位**——性质已查明（**10 处错侧、0 处正面、罪因全是 `was sleeping` vs `slept`**），**下批该做的是「把已有的『这个错了』记忆翻正」的设计**，而不是把它塞进「换零件」课（§7.5）。
2. **修正三份下游文档里那段不存在的 L197 引文**（§3.6 有完整证据链与替代引用「剩下的以后再一个一个补。」）。
3. **`gave` 的挂靠点改成 L199**（而非任务书提的 L63），并**明确在 L199 只提「昨天版」、不碰 `given`**（§7.3）。
4. **`wrote` 的唯一自然挂靠点是 L23**（`have + 做过版`，`deepDive.paragraphs[2]` 已有真实点名）；**`meant` 应彻底出列**（现存 1 处是「我是说」义项，§7.4）。

---

## 附：本批与上批的结论差异一览（便于下游对账）

| 议题 | 上批（批四十三） | 本批（批四十四） | 依据 |
|---|---|---|---|
| `slept` 是否缺口 | **是**（第 8 个缺口），3 处落点在错句位 | **实质结论维持**；但上批「3 处」应为 **11 处字段**，且**0 处正面** | §2.3 |
| 本批称 `slept` 有 2 处正面教学位 | — | **❌ 不成立**：1 处是 `spot` 题错词、1 处是讲解散文 | §2.2（渲染器 ＋ 数据不变量测试双重证实） |
| `felt`/`kept` 处置 | **不立课**，补进已有课 | **❗改为立课 L200**（挂靠点不相交且均焦点冲突） | §7.1 |
| `gave` 处置 | **不立课**，挂 L63 | **维持不立课**，但**挂靠点改为 L199** | §7.3 |
| `told` 处置 | 拒绝立课，但「该补回流」（因 L197 欠条） | **❗完全拒绝**（欠条证伪，依据消失） | §3.6／§7.4 |
| `wrote` 处置 | 拒绝（原形 1 处） | **维持拒绝立课**，但**登记 L23 存在真实点名** | §7.4 |
| `meant` 处置 | 拒绝（原形仅 1 处） | **维持拒绝，理由升级**：那 1 处是**另一个义项** | §7.4 |
| 中文侧是否支持「按模式分组」 | **不支持元音族**，只支持「三态同形 AAA/ABB/ABC」 | **❗强烈支持，且细到音变族**（`-eep→-ept`、`-elt/-ilt`、`i→a→u`） | §4.1 V7–V10（新浪全文，curl=200） |
| 「按模式分组」是否我方原创 | 上批 §6 称「不按元音族拆课」（暗示该做法非惯例） | **❗明确不是原创**，引用必须声明；我方差异在**承载方式**（场景＋错句回流） | §4.0／§5.1 ② |
| L197 欠条 | **4 个词（`gave`/`told`/`felt`/`kept`）** | **❗证伪，不存在**；现行只点名 6 词且全部有教学位 | §3.6 |
| Cambridge `Past: typical errors` = 7 条全时态、0 条误加 -ed | 上批提出 | **✅ 精确复核成立** ＋ 新增溯源陷阱（`irregular` 那 1 次在导航栏） | §6.2 |
| 任务书 4 个数字（46/35/34/35） | 上批已报「不复现」 | **✅ 一致**（22 套口径 ＋ 子集穷举复测） | §3.4 |

**报告结束**。本批共**复核 1 处上批结论（`slept`，实质维持、口径修正）**、**证伪 1 处上批结论（L197 欠条）**、**修正 1 处上批结论（中文侧支持音变族分组 ⇒ 我方非原创）**、**推翻本批任务书 1 处主张（`slept` 有 2 处正面教学位）**、**独立复核 3 词缺口全部成立**，并给出 **1 课 2 词的拆课建议 ＋ `gave` 改挂 L199 ＋ 三项明确拒绝**。
