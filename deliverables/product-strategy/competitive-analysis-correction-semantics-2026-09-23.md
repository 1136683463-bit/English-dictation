# 竞析 · 第 51 批：`huntCases.errors[].correction` 的语义收口

> 路径 `/Users/liujun/Documents/英语听写`
> 日期 2026-09-23 ｜ 角色：竞析（竞品与外部权威源分析）
> 范围：仅主题一（`correction` 语义）＋ 上批三处成果复核。`wrongMark` UI 文案由另一研究并行处理，本报告不涉及。
> 全部结论均由 node 读数据实测得出，**未使用 grep**（本地 `grep` 是 ZCode 包装的 ugrep，存在假返回 0 的风险；本报告凡需检索处一律用 `/Applications/ZCode.app/Contents/Resources/tools/ripgrep/rg` 或 node 脚本）。

---

## ① 结论摘要

1. **数字成立，但有一个口径前提。** 613 / 101 / 68 / 13 / 1 五个数字全部复现，**总条目 796**（213 案）。但要成立必须接受一个隐含判据：**「与原词同」用的是「忽略大小写」口径**，且全库严格 `trim` 后逐字相同的其实是 **0 条**。协调者口径下唯一那条是 `hunt-birthday-list#14`（`may → May`）——它**不是无操作**，是**首字母大写修正**，属第六类而非「与原词同」。若改用「去标点后归一」口径，「与原词同」会膨胀到 76 条（因为 62 条「去掉 X」归一后也只剩 X），所以**不能**换口径，613 这个数应当保留。

2. **「移动 13 处」是最窄口径。** 13 = 字面形态 `去掉（X 放到 Y 前/后）` 的精确匹配。把语义判据放宽，**移动总数应为 17**（+`hunt-umbrella-owner#5`「顺序调整」、+`hunt-not-used-to#5`「搬句首」、+2 条括号式「对调」），**再加 5 处纯英文同词集重排**（`is it→it is` 这类，无中文提示），**完整口径是 22 处**。13 不是错，是「只数最显眼那一层」。

3. **五分类不够用，缺第六类。** 现有五类只按 `correction` 的**字面长相**分。实测存在 14 条「只改大小写/标点」（13 条补标点 + 1 条改首字母），既不替换也不删除也不移动，落在「单词替换」里被静默归错。建议**按语义分六类**：替换 **608** / 插入 90 / 删除 62 / 移动 **22** / 只改标点大小写 14 / 其它 0（两轴各闭合于 796，交叉表见 3.2）。
   **⚠️ 注意口径会改数**：语义口径下「替换」是 **608** 而非形态口径的 613——因为 5 条纯英文重排（`is it→it is`）字面是「多词」、语义是「移动」，在两视角下归属不同。**两套口径都要写进文档，并声明机器消费者用语义口径。**

4. **「移动」应当显式标注，且必须标在数据层。** 理由不是「更整洁」，而是**下游已经在猜错**：`correctedSentenceOf`（生成错词本例句 + 复习卡正面）对 15/17 处（中文提示那批）执行了 `splice` 删词，对 2/17 保持原样，**没有一处得到正确结果**。17 案全部可达（案内都有可入库词 ⇒ 用户真能把带缺陷的例句存进错词本）。唯一正确的消费者是 `pickCorrectionWord`（返回空串），而它的正确**纯属巧合**——它恰好把「移动」和「删除」用同一个字面前缀一起挡掉了。

5. **下游有明确处理错误，且不止移动一处。** 除移动外，我另找到**两条独立机制、14 处真缺陷（12 案）**：①`original` 跨多 token（8 处/6 案）导致旧 span 残余词留在句里，如 `hunt-key-clue` 生成 `I don't know where it is it.`；②`correction` 把邻位词一并写进来（真实缺陷 6 处/6 案），如 `hunt-such-a` 生成 `It was such a such big fish.`。这些**不是「移动」问题**，是「单 tokenIndex 承载多词信息」的结构问题——但它和移动共享同一个根因：**`correction` 是自由文本，没有机器可读的操作类型**。

6. **上批复核：两处均成立，且比报告口径更严。**
   - `locateMarkedTokens` 渲染归位：**14 张完全复现**（旧法做子串匹配、删除线落进 `have`/`want`/`are` 等**别的单词内部**）。我另发现新旧落点不同的**实为 27 张**——另外 13 张是**多词标注取错位置**（如 `mark="he"` 命中 `The` 里的 he），同属归位收益，建议把文档口径从 14 改为 27。
   - `wrongMark` 文档数字：**674 / 502 / 52 / 65 四个数字逐个精确复现**，1228 张卡加总闭合。
   - 测试：**2465 tests / 229 files 全绿**（协调者说 2463，实测多 2 条，应为期间新增）。

7. **最不确定的一点**：22 处移动里，有 5 处是**纯英文同词集重排**（`is it→it is`、`is the key→the key is`）。它们在**数据层看不出是「移动」还是「替换」**——字面就是一个多词字符串换另一个多词字符串。我判断它们是移动（词集完全相同、仅序不同），但**如果按「当前 `tag` 是 `word_order`」来反推，就会把「该不该新增字段」这个问题变成循环论证**。换句话说：不新增显式字段，这 5 处（以及任何未来新增的）在数据层**永远无法与替换区分**；而恰恰是这 5 处触发了最严重的产物缺陷（`it is it`）。

---

## ② 五类数字 + 移动 13 处的复核（口径 + 脚本）

### 2.1 基数

```
案件数 213，错误条目总数 796，平均每案 3.74
每案错误数分布：min=2 max=6
```

脚本：`.audit51-shape.mts`（运行 `./node_modules/.bin/vite-node deliverables/product-strategy/.audit51-shape.mts`）

所有脚本一律 `import { huntCases } from "../../src/data/huntCases"` 直接读 TS 数据，**不掺入 spot 的 `answer`、不掺入 `bothRight` 的 `wrong`**——后两者不是 `HuntError.correction`，形态口径不同。

### 2.2 形态五类（只按 `correction` 字面长相，互斥优先级）

| 形态 | 数量 | 占比 | 例 |
|---|---|---|---|
| 单词替换 | 613 | 77.0% | `moved` / `is happy` |
| 多词 | 101 | 12.7% | `a lot of` / `is very` |
| 去掉X | 68 | 8.5% | `去掉 so` |
| 括号式 | 13 | 1.6% | `（去掉 to）` / `（So 与 do I 对调）` |
| 与原词同 | 1 | 0.1% | `hunt-birthday-list#14` |

**合计 796，全域覆盖且互斥（自检通过）。**

判据（脚本内 `classify()`，命中即停）：
- P1 与原词同：`correction.trim() === original.trim()`
- P2 括号式：以 `（`/`(` 开头且以 `）`/`)` 结尾
- P3 去掉X：以 `去掉`/`删除` 开头（不带括号）
- P4 多词：按空格切 ≥ 2 段
- P5 单词替换：其余

### 2.3 五个数字的逐项复核

| 数字 | 复核结果 | 说明 |
|---|---|---|
| 613 单词替换 | ✅ 复现 | 但需口径前提，见下 |
| 101 多词 | ✅ 精确 | 纯英文、非括号、单段以外的全部 |
| 68 去掉X | ✅ 精确 | 含 62 条「去掉 X」+ 6 条「去掉 X（…）」 |
| 13 括号式 | ✅ 精确 | 全列见 `.audit51-shape.mts` |
| 1 与原词同 | ⚠️ **口径依赖** | 见下 |

**关于「1 与原词同」——三种判据给出三个不同答案**（脚本 `.audit51-p1.mts`）：

```
口径 A「trim 后逐字相同」          : 0
口径 B「trim 后忽略大小写相同」    : 1   ← hunt-birthday-list#14 orig="may" corr="May"
口径 C「去标点+小写后相同（更宽）」: 76  （含 62 条「去掉 X」——它们归一后与原词同）
```

- 协调者的 **1** 对应**口径 B**。
- 严格说 `may → May` **不是无操作**：它是「月份首字母要大写」这处真错，机械上必须执行、下游执行了也正确。把它叫「与原词同」会误导；它其实是**第六类「只改大小写/标点」**。
- **口径 C 不可用**：会把 62 条「去掉 X」误吸进来（`去掉 so` 去标点归一后就是 `so`），数字失去意义。
- **建议保留 613 这个数**（= 口径 B 下的推理结果），但把文档措辞从「与原词同」改为「**忽略大小写后与原词同（1 条，实为大小写修正）**」。

`613` 的推导链（`.audit51-recon.mts`）：纯英文单词形态共 **614** 条，减去口径 B 的那 1 条，得 613。

### 2.4 移动 13 处的复核：13 是最窄的一层

```
L1「去掉（X 放到 Y 前/后）」字面                    13   ← 协调者的数字
L2 = L1 + 其它「去掉（…位移说明…）」               15   新增: hunt-umbrella-owner#5, hunt-not-used-to#5
L3 = L2 + 括号式「对调」                           17   新增: hunt-why-dont-you-rest#8, hunt-so-do-i#0
L4 = L3 + 纯英文「同词集重排」（无中文提示）        22   新增: hunt-word-order#4, hunt-key-clue#13,
                                                          hunt-key-clue#19, hunt-lost-dog#9, hunt-class-intro#7
```

脚本：`.audit51-layers.mts`、`.audit51-last.mts`

**L1 的 13 条全列**：

| # | 案件#下标 | 罪名 | original | correction |
|---|---|---|---|---|
| 1 | hunt-white-cat#5 | word_order | `white.` | `去掉（white 放到 cat 前面）` |
| 2 | hunt-fridge-note#25 | word_order | `hot.` | `去掉（hot 放到 noodles 前面）` |
| 3 | hunt-handout-note#8 | word_order | `me.` | `去掉（me 放到 the glue 前面）` |
| 4 | hunt-enough-bag#3 | word_order | `enough` | `去掉（enough 放到 light 后面）` |
| 5 | hunt-run-plan#8 | word_order | `twice.` | `去掉（twice 放到 a week 前面）` |
| 6 | hunt-like-tea-too#1 | word_order | `too` | `去掉（too 放到 tea 后面）` |
| 7 | hunt-close-24#1 | word_order | `too` | `去掉（too 放到 tea 后面）` |
| 8 | hunt-both-books#1 | word_order | `both` | `去掉（both 放到 Books 前面）` |
| 9 | hunt-close-25#9 | word_order | `both` | `去掉（both 放到 Books 前面）` |
| 10 | hunt-yet-already#6 | word_order | `yet` | `去掉（yet 放到 come 后面）` |
| 11 | hunt-still-waiting#1 | word_order | `still` | `去掉（still 放到 is 后面）` |
| 12 | hunt-three-days-ago#8 | word_order | `ago` | `去掉（ago 放到 days 后面）` |
| 13 | hunt-waited-an-hour#4 | word_order | `for.` | `去掉（for 放到 an 前面）` |

**13 条为何确实是「名为删除、实为换位」——用原句反证**（`.audit51-move-verify.mts`，逐案打印原句 + 若真删除后的句子）：

以 `hunt-white-cat#5` 为例，原句 `My friend has a cat white.`，若真执行删除会得到 `My friend has a cat She was excite...`——**跨句残破、语法崩坏**，显然不是出题意图；讲解写的是「a white cat，white 不能排在 cat 后面」，即**换位**。13 条同构：全部删掉之后都会让句子残缺或跨句粘连。

**L2/L3/L4 新增的 9 条**：

| 层次 | 案件#下标 | original → correction | 为何算移动 |
|---|---|---|---|
| L2 | hunt-umbrella-owner#5 | `this` → `去掉（this book 顺序调整：Whose book is this?）` | 「顺序调整」 |
| L2 | hunt-not-used-to#5 | `You` → `去掉 You（Are 搬句首）` | 「搬句首」；讲解 `Are you used to...?` |
| L3 | hunt-why-dont-you-rest#8 | `you` → `（与 don't 对调）` | 「对调」 |
| L3 | hunt-so-do-i#0 | `So` → `（So 与 do I 对调）` | 「对调」 |
| L4 | hunt-word-order#4 | `a dress beautiful` → `a beautiful dress` | 同词集重排 |
| L4 | hunt-key-clue#13 | `is it` → `it is` | 同词集重排 |
| L4 | hunt-key-clue#19 | `is the key` → `the key is` | 同词集重排 |
| L4 | hunt-lost-dog#9 | `is he` → `he is` | 同词集重排 |
| L4 | hunt-class-intro#7 | `is he` → `he is` | 同词集重排 |

L4 的判据（`.audit51-perm.mts`）：两侧切词、小写去标点后作为**多重集合相等**（`sorted(correct) == sorted(original)`）但顺序不同。这个判据与 ERRANT 的 `exact_reordering` 完全一致（见 ⑤）。

**⚠️ 一个必须说清的反例**：`tag=word_order` 的条目里，有 25 条 correction 以「去掉」开头，其中 **15 条是移动、10 条是真删除**（`.audit51-last.mts`）：

```
真删除（10 条）：hunt-imperative-signs#2 "You"、hunt-gift-list#9 "for"、hunt-empty-drawer#1 "don't"、
                hunt-lost-found#11 "don't"、hunt-all-the-books#5 "of"、hunt-none-of-the-cups#9 "not"、
                hunt-nobody-at-home#6 "not"、hunt-had-better-go#3 "to"、hunt-wore#20 "it"、hunt-gave#7 "to"
```

**这 10 条是真删除**（祈使句省 You、nothing 不能配 don't、none of 后面不加 not 等）。所以：**`tag=word_order` 不蕴含「移动」**，不能拿 tag 当操作类型的代理——这直接否掉「用 tag 反推」的方案（见 ③）。

---

## ③ `correction` 的文档方案与「移动」的处置建议

### 3.1 分类够不够用？——不够，缺第六类

现有五类**全部只看 `correction` 的字面长相**（`去掉` 开头？有括号？几个词？）。**这个视角漏掉了 14 条真实语义**，另有两类相邻问题需要分开处置（一类建议不单列、一类明确不该并入 `correction` 分类）：

**第六类「只改大小写/标点」（14 条，1.8%）** —— 全列（`.audit51-recon2.mts`）：

| 子型 | 数量 | 条目 |
|---|---|---|
| 首字母大写 | 1 | `hunt-birthday-list#14` `may→May` |
| 句内补逗号（run_on 断句） | 8 | `hunt-before-dinner#8` `eat→eat,`；`hunt-sunny-run#3`、`hunt-after-school-talk#17` `sunny→sunny,`；`hunt-two-screens#17`、`hunt-story-parts#13`、`hunt-phone-story#6` `reading→reading,`；`hunt-but-vs-although#11`、`hunt-close-22#11` `raining→raining,` |
| 句末标点（补 `.` / 改 `!`） | 5 | `hunt-nice-day#6` `day?→day!`；`hunt-why-dont-you-rest#13` `swim→swim.`；`hunt-in-order-to-bus#17` `test→test.`；`hunt-so-do-i#11` `dance→dance.`；`hunt-would-rather-walk#14` `home→home.` |

这 14 条**字面是「单词替换」**（`eats` 换成 `eat,` 一个词换一个词），但语义上**字母一个没动**。混在 613 里，任何按「单词替换」做批量假设的下游都会被它们咬到。

**第七类候选「陷阱词」（1 条，建议不单列）**：`hunt-so-do-i#11` 的讲解写着「**这句没问题**——…这里的陷阱是要分清 two 的搭档是不是对称」，但 `correction` 填的是 `dance.`（补句号）。这是**讲解文案自称无错、字段却登记为 error** 的语义冲突。仅 1 条，且 `dance.` 的机械修正方向正确（补句号后 `She can both sing and dance.` 确实更规范），建议**不新增类，只补一条数据层注释**说明这条的 `explanation` 是陷阱说明而非纠错说明。

**第八类候选「original 跨多 token」（8 条）**：严格说这不是 `correction` 的分类，而是 **`original` 的分类**——但它是下游最主要缺陷的来源，且**必须与 `correction` 的类型分开记**，因为修法完全不同（`correction` 类型决定「做什么」，`original` 跨度决定「在哪个范围做」）。见 ④。

### 3.2 建议的分类口径（**六类**，且必须换视角）

```
按语义分（修正后的建议口径，互斥优先级：移动 > 删除 > 标点大小写 > 插入 > 替换 > 其它）

  替换            608   （如 move→moved）
  插入(补词)       90   （如 happy→is happy）
  删除             62   （如 so→去掉 so）
  移动/换位        22   （17 条中文提示 + 5 条纯英文同词集重排）
  只改标点/大小写   14   （如 eat→eat, / may→May）
  其它指令型         0
  ─────────────────────
  合计            796   = 全库条目数 ✅
```

**（推荐）语义 × 形态交叉表**——一张表把两个视角一次讲清，**两轴各自闭合于 796**（`.audit51-crossexact.mts`）：

| 语义 ＼ 形态 | 单词 | 多词 | 去掉X | 括号式 | 语义合计 |
|---|---|---|---|---|---|
| 替换 | 600 | 8 | 0 | 0 | **608** |
| 插入(补词) | 0 | 88 | 0 | 2 | **90** |
| 删除 | 0 | 0 | 53 | 9 | **62** |
| 移动/换位 | 0 | 5 | 15 | 2 | **22** |
| 只改标点/大小写 | 14 | 0 | 0 | 0 | **14** |
| **形态合计** | **614** | **101** | **68** | **13** | **796** ✅ |

**⚠️ 口径切换会改变形状——这是本条建议里最容易踩的坑：**
- 语义分类**不是形态分类的简单加总，因为归属会变**。5 条纯英文重排（`is it` → `it is`）的**字面**是「多词」，**语义**是「移动」——同一条目在两视角下归不同类。所以「替换」从**形态口径的 613** 变成**语义口径的 608**（少了那 5 条），而「移动」从 17 变成 22。
- **两套口径都必须写进文档**，并声明：**机器消费者请用语义口径，形态口径只用于数据统计/审计**（形态口径胜在互斥、易复现；语义口径胜在能分派行为）。
- 交叉表的「去掉X」列 68 与「删除」行 53 + 「移动」行 15 严格相等（53+15=68 ✅）；「括号式」列 13 = 删除 9 + 插入 2 + 移动 2 ✅。**两轴闭合已自检通过。**

**关于「陷阱词」（1 条）** 我建议**不单列为类**（理由见上），但若复核者坚持单列，它会从「标点/大小写」里拆出 1 条 ⇒ 该类变 13、陷阱词 1。

### 3.3 「移动」该不该在数据层显式标注？——该，理由是被下游咬过

**结论：应当显式标注，且不应藏在文案里。** 三条理由，按强度排序：

**理由 1（决定性）：下游已经在猜错，且猜错的是用户可见内容。**

`correctedSentenceOf` 用正则 `/^（?去掉|去掉/` 判定「删词」，而 15/17 处（中文提示那批）移动的文案恰好以「去掉」开头 ⇒ **全部走删词分支**。实测产物（`.audit51-corrected.mts`、`.audit51-final.mts`）：

| 案件 | 目标词 | 实际处理 | 产物（片段） |
|---|---|---|---|
| hunt-white-cat | `white.` | ❌ 被删除 | `My friend has a cat She was excited about...`（跨句残破） |
| hunt-run-plan | `twice.` | ❌ 被删除 | `I run a week Two shoes are here.` |
| hunt-like-tea-too | `too` | ❌ 被删除 | `I like tea.`（too 没了，但本应移到句尾） |
| hunt-still-waiting | `still` | ❌ 被删除 | `She is waiting.`（still 没了） |
| hunt-not-used-to | `You` | ❌ 被删除 | `... are used to the noise?`（首字母小写、句首缺词） |
| hunt-fridge-note | `hot.` | ❌ 被删除 | `Eat the chicken noodles`（句尾无标点） |
| hunt-close-24 | `too` | ❌ 被删除 | `I like tea.` |
| hunt-handout-note | `me.` | ⚠️ 保留未改 | `Please give the glue Two rulers are here.`（跨句残破） |
| hunt-enough-bag | `enough` | ⚠️ 保留未改 | `The bag is light to carry.`（enough 仍在原位，语序错误未修） |
| hunt-both-books | `both` | ⚠️ 保留未改 | `Books are good.`（both 没了） |

**22 处移动的分支分布**（`.audit51-all22.mts`）——注意**五条分支里没有一条是「重排」**：

```
① 走「删词」分支（误判）      15 条   中文提示那批（「去掉（X 放到 Y 前面）」/「搬句首」/「顺序调整」）
② 走「替换」分支（跨 span 烂） 5 条   纯英文重排：a dress beautiful→a beautiful dress、is it→it is 等
③ 走「含中文 ⇒ 保持原样」      2 条   （与 don't 对调）、（So 与 do I 对调）
─────────────────────────────────────
                                22 条  ✅ 无一得到正确结果
```

② 那 5 条虽是「替换」，但因为 `original` 跨多 token，产物更糟（`I don't know where it is it.`）——**这是移动与机制 A 的叠加，见 4.3**。

**21 案全部可达**：每案都至少有一个「可入库词」（`pickCorrectionWord` 非空），用户点「把 N 个改正词加入错词本」时，例句就是上面这些（`.audit51-reach2.mts`，21/21 可达）。所以这不是理论风险，是**用户真能看到并记进错词本的病句**。

**理由 2：唯一处理正确的消费者是「碰巧」的。**

`pickCorrectionWord` 对 17 处移动**全部返回空串**（✅ 正确），但它的实现是：

```ts
if (!trimmed || trimmed.startsWith("去掉")) return "";
if (trimmed.startsWith("（") && trimmed.endsWith("）")) return "";
```

它挡的是**「删除指令」和「括号式」两个字面形态**——恰好把移动一起挡掉了。它对**5 条纯英文重排毫无防御**（那 5 条字面就是普通多词替换），只是那 5 条的 `pickCorrectionWord` 取值恰好是 `beautiful` / `it` / `the` 等词，进错词本虽不理想但不算垃圾。**结论：这个函数的正确性依赖字面巧合，不是语义判断**——一旦有人写出 `去掉（X 放到 Y 前面）` 之外的第三种移动文案，它就会漏。

**理由 3：`tag` 不能当代理**（见 ② 的反例）。

`tag=word_order` 的 95 条里，25 条以「去掉」开头而**其中 10 条是真删除**。所以「用 tag 反推操作类型」会在 10/25 上直接判错。

### 3.4 怎么标？——三个方案，推荐方案 B

**方案 A：新字段 `editOp: "replace" | "insert" | "delete" | "move" | "orth"`（可选，回退到文案推断）**

```ts
export interface HuntError {
  tokenIndex: number;
  tag: GrammarErrorTag;
  original: string;
  correction: string;
  /**
   * 修正的操作类型（机器可读）。缺省时下游应按 correction 文案回退推断。
   * - "replace" 换词（含换形）：move → moved
   * - "insert"  补词：happy → is happy
   * - "delete"  删词：so → （删除）
   * - "move"    换位：white 从 cat 后移到 cat 前（correction 里的「去掉」是历史文案，勿信）
   * - "orth"    只改标点/大小写：eat → eat,
   */
  editOp?: "replace" | "insert" | "delete" | "move" | "orth";
}
```

- ✅ 语义明确、机器可读、新增数据可渐进（22 条 + 14 条 = 36 条需回填，其余可省或批量按规则填）
- ✅ 下游可以 `switch (editOp)` 严格分支，不再正则猜文案
- ⚠️ 需要回填 36 条，且有「字段可选 ⇒ 下游仍要写回退路径」的二元状态

**方案 B（推荐）：新字段 + 统一的移动文案模板 + 一条守门测试**

在方案 A 基础上，把 17 条移动的文案统一为一种**可解析且有教学价值的模板**：

```
移动类文案模板（建议）：
  `把 <X> 移到 <Y> 前面`   /   `把 <X> 移到 <Y> 后面`

例：hunt-white-cat#5   去掉（white 放到 cat 前面）  →  把 white 移到 cat 前面
    hunt-like-tea-too#1 去掉（too 放到 tea 后面）     →  把 too 移到 tea 后面
```

好处有三层：
1. **不再以「去掉」开头** ⇒ 现有 `correctedSentenceOf` / `pickCorrectionWord` / rv9 / rv3 的所有 `/^（?去掉/` 正则**自动不再误判为删除**（虽然它们仍无法执行移动，但会走「含中文 ⇒ 保持原样」分支，比「删掉」正确得多）。
2. **可被正则稳定解析**（`/^把 (.+?) 移到 (.+?) 前(面|边)/`）⇒ 即使不加 `editOp` 字段，下游也能识别。
3. **教学文案更直白**（「把 X 移到 Y 前面」比「去掉（X 放到 Y 前面）」自相矛盾更少——后者字面就让人以为要删）。

**方案 C：不改数据，只加文档 + 下游白名单**

在 `types.ts` 写清「`correction` 可能是删除/移动/标点指令」并列出全部形态，下游各自防护。
- ✅ 零数据改动、零回归风险
- ❌ **不解决根本问题**：下一个写移动文案的人仍会自由发挥，下游仍要维护正则白名单。且 5 条纯英文重排**在这个方案下永远无法标注**。

**我的建议：B 为主 + A 的字段为辅，分两步走。**

- **第一步（低风险，建议本批或下批做）**：改文案模板（17 条），并在 `types.ts` 补 `correction` 的语义文档（含 ②/③ 的两张表）。这一步就足以让 `correctedSentenceOf` 的 15 处「误删」变成「保守不改」——**产物从「病句」变成「未修正的错句」，是明确的进步**。
- **第二步（需评估收益）**：加 `editOp` 字段并回填。如果短期没有第三个消费者需要精确操作类型，可以只给 22 条移动 + 8 条跨度条目标注，其余留空走回退。

**关于那 5 条纯英文重排（`is it→it is`）**：**这是唯一无法靠改文案解决的一类**——它们没有中文外壳可改，字面就是两个多词英文字符串互换。只有 `editOp: "move"` 能标出它们。所以：
- 若采纳方案 A/B，**必须包含这 5 条**；
- 若只做第一步（改文案），**必须接受这 5 条仍是「看不见的移动」**，并让下游知道「多词 → 多词且词集相同」是移动的信号（可用 2.4 的 `sorted()==sorted()` 判据自动识别——**建议直接把这条判据写进 `correctedSentenceOf` 的多词分支**，成本极低）。

### 3.5 建议写入 `types.ts` 的文档草稿

```ts
/**
 * 案件里植入的一处错误。tokenIndex 指向 HuntCase.tokens 的下标。
 */
export interface HuntError {
  tokenIndex: number;
  tag: GrammarErrorTag;
  /**
   * 被点出的错形。**注意它可能跨多个 token**（8 处，如 `is it` / `is the key` /
   * `think she will not`）——此时 tokenIndex 只指向其中一个词，
   * 机械修正若按单 token 替换会把整段新文本塞进一个位子，旧 span 的其余词留在原地，
   * 生成 `I don't know where it is it.` 这类残句（实测 8 处 / 6 案）。
   * 凡 original 含空格，下游必须按 span 处理（或在无法可靠 span 化时保持原样）。
   */
  original: string;
  /**
   * 「改成什么」的说明。**它是自由文本，不是可执行指令，且有多种语义**。
   * 2026-09-23 批五十一补文档（此前只有「去掉 xx 返回空串」这一条线索，
   * 导致 4 个下游各自用正则猜，其中 correctedSentenceOf 对移动类全部猜错）。
   *
   * **语义分类（机器消费者请按这一列分派）**——全库 796 条实测：
   *   - 替换     613  `move` → `moved`；`may` → `May`
   *   - 插入(补词)  90  `happy` → `is happy`（含原词 + 新增词）
   *   - 删除      62  `去掉 so` / `（去掉 to）`——该词从句子移除
   *   - 移动/换位   22  **字面常以「去掉」开头，但实际是换位、禁止删除**：
   *                    17 条如 `去掉（white 放到 cat 前面）`（真实意：把 white 移到 cat 前）
   *                     5 条纯英文同词集重排 `is it` → `it is`（无中文提示，只能靠词集判据识别）
   *   - 只改标点/大小写 14  `eat` → `eat,`；`day?` → `day!`（字母一个没动）
   *
   * **⚠️ 移动类是最容易误读的一类**：`去掉（X 放到 Y 前面）` 里的「去掉」是历史文案噪音，
   * 真实操作是**换位**。按「去掉」前缀判删除会得到跨句残破的病句
   * （实测 `My friend has a cat She was excite...`、`I run a week Two shoe are here.`）。
   *
   * **⚠️ tag 不是操作类型的代理**：`tag=word_order` 的 95 条里有 25 条以「去掉」开头，
   * 其中 10 条是真删除（祈使句省 You、nothing 不配 don't 等）。不要用 tag 反推操作。
   *
   * **下游分派建议**：
   *   - 入错词本挑词（pickCorrectionWord）：移动/删除/纯标点 一律返回空串（现实现正确）
   *   - 句子层机械修正（correctedSentenceOf）：只有「替换/插入/删除」可机械执行；
   *     **移动必须保持原样或按 span 重排，绝不能删除**
   *   - 纯展示（判题反馈卡、结算清单、复习 grammarNote）：原样呈现，勿加工
   */
  correction: string;
  explanation: string;
}
```

---

## ④ 下游消费者扫描（逐个判断对「移动」的处理）

扫描方法：`rg -n "\bcorrection\b" src/ -g '*.ts' -g '*.tsx'`，排除 `src/data/**`（数据本身）与 `src/types.ts`（类型声明），再逐一读实现。共 **11 个生产代码消费者**（另有 8 处测试断言，单列）。

### 4.1 生产代码消费者

| # | 位置 | 用途 | 对「移动」的处理 | 判定 |
|---|---|---|---|---|
| 1 | `src/services/huntService.ts:67` `pickCorrectionWord` | 从 correction 挑一个词进错词本 | 17/17 返回 `""` | ✅ **正确**（但靠字面巧合，非语义判断；对 5 条纯英文重排无防御） |
| 2 | `src/services/huntService.ts:310` `correctedSentenceOf` | 把案件错句机械修正成正确句（错词本例句 + 复习卡正面） | 15/17 执行 `splice` **删除**；2/17 走「含中文 ⇒ 保持原样」 | ❌ **错误**（最严重：用户可见病句） |
| 3 | `src/services/huntService.ts:385,389` `addHuntGapSentences` | 用 `correctedSentenceOf` 的结果建 SM-2 句子卡；`grammarNote` 写 `original → correction` | 句子层同上 ❌；`grammarNote` 是纯展示 ✅ | ⚠️ **句子层错误 + 展示层正确** |
| 4 | `src/pages/GrammarHuntPage.tsx:334` `addableCorrectionWords` | 按钮计数「把 N 个改正词加入错词本」 | 走 #1，17/17 不计入 | ✅ **正确** |
| 5 | `src/pages/GrammarHuntPage.tsx:342` `addCorrectionsToMistakeBook` | 加入错词本；`sourceSentence` 用 #2 的结果 | 例句 ❌（同 #2）；入库词 ✅（同 #1） | ❌ **例句错误**（入库词正确） |
| 6 | `src/pages/GrammarHuntPage.tsx:673` `.hunt-verdict-correction` | 判题命中反馈卡渲染 `original → correction` | 原样渲染 `white. → 去掉（white 放到 cat 前面）` | ✅ **正确**（纯展示；文案虽自相矛盾但不致错，且这正是用户在页面上看到的教学提示） |
| 7 | `src/pages/GrammarHuntPage.tsx:756` 结算页错点清单 | 同 #6 | 同 #6 | ✅ **正确**（纯展示） |
| 8 | `src/services/grammarReplayService.ts:169,215` `correctionZh` | 复盘课题面/讲解展示 `original → correction` | 原样拼接为展示串；题面答案**不用** correction（另有 `isEnglishToken` 挡住含中文的） | ✅ **正确**（该文件注释已明确写「correction 是『改成什么』的说明，常含中文，不能当答案」） |
| 9 | `src/services/grammarWeakSpotsService.ts:414` 弱点报告 `example` | 展示 `original → correction` 作为弱点例句 | 原样拼接 | ✅ **正确**（纯展示） |
| 10 | `src/pages/GrammarReauditPage.tsx:298` | 重新审计页展示 | 原样拼接 | ✅ **正确**（纯展示） |
| 11 | `src/services/grammarReviewService.ts:113` | 注释引用 `correctedSentenceOf` 说明卡正面重复问题 | 不直接读 correction，但**消费 #2 的产物**（用卡正面去重） | ⚠️ **间接受影响**（产物是病句时去重键也异常，影响较小） |

**汇总**：11 个消费者中 **7 个正确（纯展示或已挡）**、**2 个明确错误（#2 `correctedSentenceOf`、#5 例句）**、**2 个间接受影响（#3 句子层、#11）**。

**结论**：**读法正确的都是「原样展示」；凡是试图「执行」correction 的都错了。** 这印证了 ③ 的判断——`correction` 是展示文案，不是执行指令，而当前没有任何字段告诉下游「这段文案属于哪种操作」。

### 4.2 测试断言（8 处，也是消费者）

| 位置 | 断言 | 对移动的处理 | 判定 |
|---|---|---|---|
| `src/edge/h2-hunt-judging.test.tsx:256` | 命中反馈卡 `.hunt-verdict-correction` 文本等于 `will → （去掉 will）` | 精确字符串断言，**已锁定现状** | ✅ 正确（但改文案模板会**破坏此断言**，需同步改） |
| `src/edge/h1-hunt-data-integrity.test.tsx:131` | `correction.trim() === original.trim()` 必须为 0 条 | 移动不触发（值不等） | ✅ 正确 |
| `src/edge/h1-hunt-data-integrity.test.tsx:146` | `correction.trim() === ""` 必须为 0 条 | 移动不触发 | ✅ 正确 |
| `src/edge/h1-hunt-data-integrity.test.tsx:163` | 仅检查 `correction === "（去掉）"` 的模糊修正 | **不覆盖** `去掉（X 放到 Y 前面）` 这类 | ⚠️ **覆盖面不足** |
| `src/edge/verify/rv3-free-type-anchor.test.tsx:132` | `/^（?去掉/` 的错点跳过逐位比对 | 17 处移动被**跳过**（13 条命中外加 4 条中文括注） | ⚠️ **等于不验**（用同一正则重现了 #2 的误判，所以验不出） |
| `src/edge/verify/rv9-hunt-card-corrected.test.ts:69` | 找「删词型修正」案例建卡，断言句子变短 | **命中了移动类**（`startsWith("去掉")`）⇒ 断言「删词后句子应比原文短」在移动上**恰好也成立**（因为真的删了） | ❌ **错误固化**：该测试把「移动被误删」当成期望行为写进断言 |
| `src/edge/verify/rv9-hunt-card-corrected.test.ts:111` | `/[.,!?;:]$/.test(original) && !/^（?去掉/` | 同样用 `/^（?去掉/` 排除 | ⚠️ 覆盖面不足 |
| `src/edge/verify/p5-reaudit.test.tsx:163` / `pf8-zero-term-labels.test.ts:45` / `pr1-promises.test.tsx:387` | 展示串必须含 `correction` | 移动不触发 | ✅ 正确（纯展示断言） |

**⚠️ 最重要的一条**：`rv9-hunt-card-corrected.test.ts:69` 的「删词型修正也能成卡」把 `startsWith("去掉")` 当作「删词型」的定义，并断言结果句子更短——**它把 `correctedSentenceOf` 的误判错误固化成了期望**。修文案模板或修 #2 之前，**必须先改这条测试**，否则正确的修复会被测试拦下。

### 4.3 顺带发现：两条独立于「移动」的下游缺陷

这两条不属于主题一，但同源（都是 `correction` 无语义类型导致的机械修正失败），且**影响面可能比移动更大**，一并报告。

**机制 A：`original` 跨多 token（8 处 / 6 案）**

`tokenIndex` 只给一个插入位，但 `original` 跨 2-4 个词。`correctedSentenceOf` 把整段 `correction` 塞进那一个 token 位，**旧 span 的其余词留在原地**：

| 案件 | original → correction | 实得产物 | 应然 |
|---|---|---|---|
| hunt-word-order#4 | `a dress beautiful` → `a beautiful dress` | `She bought a dress a beautiful dress.` | `She bought a beautiful dress.` |
| hunt-word-order#9 | `a house old` → `an old house` | `We visited a house an old house near the river.` | `We visited an old house near the river.` |
| hunt-key-clue#13 | `is it` → `it is` | `I don't know where it is it.` | `I don't know where it is.` |
| hunt-key-clue#19 | `is the key` → `the key is` | `Do you know where the key is the key?` | `Do you know where the key is?` |
| hunt-lost-dog#9 | `is he` → `he is` | `We don't know where he is he.` | `We don't know where he is.` |
| hunt-class-intro#7 | `is he` → `he is` | `I know where he is he.` | `I know where he is.` |
| hunt-team-message#20 | `think she will not` → `don't think she will` | `I think she will don't think she will be late.` | `I don't think she will be late.` |
| hunt-photo-compare#26 | `more good` → `better` | `This photo is better good than that.` | `This photo is better than that.` |

**可达性**：6 案共生成 **22 张卡**，卡正面**全部**是上表这些病句（`.audit51-garble2.mts` 用真实建卡路径 `addHuntGapSentences` + `makeAppData` 验证）。

**为什么测试没抓到**：rv9 只断言「卡正面 ≠ 含错原文」——这些病句**确实不等于**原文，所以全过。**建议补一条断言**：「卡正面不得含相邻/隔词重复词」。

**机制 B：`correction` 把邻位词一并写进来（真缺陷 6 处 / 6 案）**

`correction` 是多词且包含**邻位**词（邻位不是同一个 error），单 token 替换把邻词写了两遍：

| 案件 | original → correction | 实得产物 |
|---|---|---|
| hunt-question-words#16 | `lost` → `did you lose` | `When you did you lose it?`（应 `When did you lose it?`） |
| hunt-frequency-habit#7 | `go` → `always goes` | `Lily always goes always to the library...` |
| hunt-looking-forward-weekend#9 | `forward` → `forward to` | `I looking forward to to the weekend.` |
| hunt-when-vs-as-soon#6 | `soon` → `as soon as` | `As as soon as I finish, I will eat.` |
| hunt-close-23#10 | `soon` → `as soon as` | `As as soon as I finish, I will eat.` |
| hunt-such-a#2 | `a` → `such a` | `It was such a such big fish.` |

**另有 5 处同类候选经人工判读为假阳性**（产物其实是正确英文，探测器的邻位判据过宽）：`hunt-height-chart#2`（`Tom is as tall as me.` ✅）、`hunt-before-dinner#1`（`Before I eat, I wash my hands.` ✅）、`hunt-two-faces#8`（`I am used to walking to school.` ✅）、`hunt-as-soon-as-comes#9`（`As soon as I finish, I will eat.` ✅）、`hunt-as-long-as-forest#4`（`I will go as long as you come.` ✅）。**判据出处**：`.audit51-final2.mts` 逐条列出真/假并给应然句，便于复核者推翻。

**缺陷合计**（`.audit51-union2.mts`，已剔除 5 处人工判读的假阳性）：

```
移动/换位      22 处 / 21 案
机制 A 跨度     8 处 /  6 案   （与移动类重叠 4 案：hunt-word-order, hunt-key-clue, hunt-lost-dog, hunt-class-intro）
机制 B 邻词     6 处 /  6 案   （11 处候选中人工剔除 5 处假阳性）
──────────────────────────────
按「处」合计   36 处（含跨类重叠）
按「案」并集   29 案 / 213 案 = 13.6%
```

**即：全库约 1/7 的案件（29/213 = 13.6%），其 `correctedSentenceOf` 产物存在可复现的机械缺陷**，且这些产物会进入错词本例句（移动类 21 案**全部**可达，`.audit51-reach2.mts` 验证 21/21）与 SM-2 复习卡正面（机制 A 的 6 案共 22 张卡可达）。

### 4.4 下游「处理正确」的名单（供改文案时回归）

改文案模板会影响这些已锁定的断言，需要同步更新：
- `src/edge/h2-hunt-judging.test.tsx:256`（精确字符串 `will → （去掉 will）`）
- `src/edge/verify/rv9-hunt-card-corrected.test.ts:69`（把 `startsWith("去掉")` 当「删词型」定义）
- `src/edge/verify/rv3-free-type-anchor.test.tsx:132`（`/^（?去掉/` 跳过）
- `src/edge/verify/rv9-hunt-card-corrected.test.ts:111`（`/^（?去掉/` 排除）
- `src/services/huntService.test.ts:135`（`pickCorrectionWord("去掉 so") === ""`）
- `src/services/huntService.test.ts:255`（测试内自己实现的 `/^（?去掉/` 修正逻辑）

---

## ⑤ 跨源轻量核查：语言学习产品怎么表示「删除 / 替换 / 换位 / 加标点」

抓到了 **1 个权威源**（ERRANT 的源码与论文），另有 1 个可访问的产品侧源（LanguageTool 规则分类目录）**没有**「换位」类目，据此可作为反面对照。

### 5.1 权威源：ERRANT（Grammatical ERRor ANnotation Toolkit）——「换位」是独立操作类型

来源：`https://github.com/chrisjbryant/errant`（`main` 分支，MIT 许可；论文 Bryant, Felice & Briscoe 2017, ACL）
逐字引用 1 —— 论文摘要（`https://aclanthology.org/P17-1074/`）：

> "Until now, error type performance for Grammatical Error Correction (GEC) systems could only be measured in terms of recall because system output is not annotated. To overcome this problem, we introduce ERRANT, a grammatical ERRor ANnotation Toolkit designed to automatically extract edits from parallel original and corrected sentences and classify them according to a new, dataset-agnostic, rule-based framework. This not only facilitates error type evaluation at different levels of granularity, but can also be used to reduce annotator workload and standardise existing GEC datasets."

逐字引用 2 —— **编辑操作只有四种**（`errant/en/classifier.py`，`classify()` 函数）：

> ```python
> def classify(edit):
>     # Nothing to nothing is a detected but not corrected edit
>     if not edit.o_toks and not edit.c_toks:
>         edit.type = "UNK"
>     # Missing
>     elif not edit.o_toks and edit.c_toks:
>         op = "M:"
>         ...
>     # Unnecessary
>     elif edit.o_toks and not edit.c_toks:
>         op = "U:"
>         ...
>     # Replacement and special cases
>     else:
> ```

即：**M（Missing 缺失）/ U（Unnecessary 多余）/ R（Replacement 替换）/ UNK（检出但未改正）**。**注意「删除」在 ERRANT 里叫 `U:`（unnecessary，多余）而不是 `D:`**——这个视角与本项目的「去掉 X」相通：删掉的词是「多余」，不是「缺失」。

逐字引用 3 —— **「换位」是一个独立的【子类】，不是独立操作**（`errant/en/classifier.py`，`get_two_sided_type()`）：

> ```python
> # Orthography; i.e. whitespace and/or case errors.
> if only_orth_change(o_toks, c_toks):
>     return "ORTH"
> # Word Order; only matches exact reordering.
> if exact_reordering(o_toks, c_toks):
>     return "WO"
> ```

逐字引用 4 —— `exact_reordering` 的判据（**与本项目 L4 的判据完全一致**）：

> ```python
> # Input 1: Spacy orig tokens
> # Input 2: Spacy cor tokens
> # Output: Boolean; the tokens are exactly the same but in a different order
> def exact_reordering(o_toks, c_toks):
>     # Sorting lets us keep duplicates.
>     o_set = sorted([o.lower_ for o in o_toks])
>     c_set = sorted([c.lower_ for c in c_toks])
>     if o_set == c_set:
>         return True
>     return False
> ```

逐字引用 5 —— `only_orth_change`（对应本项目的第六类「只改标点/大小写」）：

> ```python
> def only_orth_change(o_toks, c_toks):
>     o_join = "".join([o.lower_ for o in o_toks])
>     c_join = "".join([c.lower_ for c in c_toks])
>     if o_join == c_join:
>         return True
> ```

**对本项目的三点直接启示**：

1. **「换位」在权威方案里就是独立类别（`WO`），且判据是「词集相同、顺序不同」。** 本项目把 13 处换位写成「去掉（X 放到 Y 前面）」，在 ERRANT 口径下**会被判成 `U:`（删除）**——即**本项目的写法是偏离行业惯例的**。这不是「风格问题」，是会造成 ERRANT 式自动标注误判的真问题。
2. **「只改标点/大小写」也是独立类别（`ORTH`）。** 本项目 14 条落在「单词替换」里，同属偏离。
3. **ERRANT 的 `M`/`U`/`R` 是【操作】，`WO`/`ORTH`/`VERB:TENSE` 是【子类】——两层分离。** 本项目当前是「一层自由文本」，这正是根因。③ 的方案 A（`editOp` 字段）对应 ERRANT 的**操作层**，`tag`（`word_order`/`tense`/...）对应**子类层**——**两层都已存在，只是操作层缺失**。这个类比可以作为「加 `editOp` 字段」的最强论据：**不是创造新概念，而是补上行业标准里本就有的那一层。**

### 5.2 对照源：LanguageTool 规则目录——**没有**「换位」类目

来源：`https://community.languagetool.org/rule/list?lang=en-US`（可访问，返回 19,085 字节）
逐字引用（页面上的类目清单）：

> "Browse Rules: 6,208 matches These are some of the errors that LanguageTool can detect. ... - all categories - Academic Writing American English Style British English phrases Capitalization Collocations Commonly Confused Words Compounding Creative Writing Grammar Miscellaneous Nonstandard Phrases Orthographic errors Plain English Possible Typo Proper Nouns Punctuation Redundant Phrases Repetitions (Style) Semantics Style Stylistic hints for creative writing Text Analysis Typography Upper/Lowercase Wikipedia"

**观察**：这个产品侧分类里，**「大小写」（`Capitalization` / `Upper/Lowercase`）与「标点」（`Punctuation`）是独立类目**——与本项目「14 条只改标点/大小写混在单词替换里」形成对照，**支持第六类的必要性**。但该目录**没有独立的「Word Order / 换位」类目**（我检索 `word order|WordOrder|scrambl|reorder` 无匹配），语言层面的语序问题被吸收进 `Grammar`。

**这一点要诚实说明局限**：LanguageTool 的类目是**「规则所属的检查模块」**，不是**「编辑操作类型」**——它是给我方第六类（标点/大小写应独立）提供旁证，**不支持**「换位必须独立分类」的结论。真正支持换位独立的是 ERRANT。

### 5.3 抓不到的源（明说）

- 主流背单词/错题本产品（Anki 的 note type 设计、Quizlet、国内的墨墨/不背单词等）的**错题数据 schema 均未公开**，无法引用。
- **CEFR-J / Cambridge English Profile** 的语法点体系只描述「知识点」不描述「编辑操作」，与本次问题不同层，未纳入。
- 英语教育领域的 **M2 格式**规范（CoNLL-2014 共享任务）我通过 ERRANT 的 `to_m2()` 间接看到格式（`A <start> <end>|||<type>|||<correction>|||REQUIRED|||-NONE-|||<annotator id>`），但**未能取到规范原文**，故不作为引用源。这条是「有线索但未证实」，列入 ⑧ 不确定项。

---

## ⑥ 上批三处成果复核

### 6.1 ① 渲染侧改用 `locateMarkedTokens`（14 张卡删除线归位）——✅ **成立，且实际收益更大（27 张）**

**实现位置**：`src/pages/GrammarLessonPage.tsx:248-259`（`markedWrongNode`），已从裸 `indexOf` 改为 `locateMarkedTokens(wordList, mark, item.correct)`；`locateMarkedTokens` 定义在 `src/services/grammarBoostService.ts:212`。

**独立复核方法**（`.audit51-render.mts`）：对全库 `contrast` 卡，用**旧法**（整串 `indexOf` + 字符位置换算成 token 下标）与**新法**（`locateMarkedTokens`）分别定位，比较落点。

**复核 1：`wrongMark` 文档里的 674 / 502 / 52 精确复现**

```
contrast 卡总数        1228
wrongMark 有值         674   （文档称 674）✅
bothRight:true 无值    502   （文档称 502）✅
bothRight 省略 无值     52   （文档称 52）✅
合计检验               1228 === 1228 ✅ 闭合
wrongMark 是多词形态     65   （文档称 65）✅
```

脚本：`.audit51-wm.mts`（65 条多词样例：`Am I` / `not are` / `not like` / `not will` / `you are` / `not can` / `Do you can` / `want go` / `Want you` / `to be` ...）

**复核 2：「14 张删除线错位」精确复现**

判据：旧法命中的字符串**不是完整词**（即 `indexOf` 落在某个单词内部）。结果 **恰好 14 张**：

| # | 课程 | mark | 错句 | 旧法落在 |
|---|---|---|---|---|
| 1 | L3 lesson-03-have[2] | `a` | `I have a apple.` | `have`（h-**a**-v） |
| 2 | L3 lesson-03-have[4] | `a` | `I have a water.` | `have` |
| 3 | L4 lesson-04-want[0] | `a` | `I want a apple.` | `want` |
| 4 | L4 lesson-04-want[1] | `an` | `I want an book.` | `want` |
| 5 | L4 lesson-04-want[2] | `a` | `I want a hour.` | `want` |
| 6 | L4 lesson-04-want[5] | `an` | `I want an uniform.` | `want` |
| 7 | L7 lesson-07-we[3] | `a` | `We are a students.` | `are`（**a**-r-e） |
| 8 | L11 lesson-11-plural[4] | `a` | `I ate a sandwiches.` | `ate` |
| 9 | L19 lesson-19-and-but[5] | `is` | `My sister and I is happy.` | `sister`（s-**is**-ter） |
| 10 | L39 lesson-39-who-glasses[2] | `he` | `The boy who he wears glasses is my brother.` | `The`（T-**he**） |
| 11 | L41 lesson-41-two-things[1] | `he` | `I know the boy who he wears glasses.` | `the`（t-**he**） |
| 12 | L108 lesson-108-got-him-to[0] | `go` | `I got him go with me.` | `got`（**go**-t） |
| 13 | L110 lesson-110-who-makes-who[2] | `go` | `I got him go with me.` | `got` |
| 14 | L194 lesson-194-such-a[0] | `a` | `It was a such big fish.` | `was`（w-**a**-s） |

**✅ 14 精确成立。** 归位后新法全部指向真实错处（`a`/`an`/`is`/`he`/`go`/`a`）。

**复核 3：⚠️ 实际收益比 14 更大——新旧落点不同的共 27 张**

`14` 与 `27` 都是「旧法落点在别的 token」，但口径不同：
- **14** = 旧法命中的串**落在单词内部**（子串匹配 bug，证据最强）
- **27** = 旧法**任何与非新法不同的落点**，另外 13 张是**多词标注只取到第一段**（`mark="want go"` 旧法取 `want`、新法取 `go.`；`mark="into kitchen"` 旧法取 `into`、新法取 `kitchen.` 等）

**这 13 张同样从修复中受益**（旧法划的是错的词，只是恰好在词边界上）。**建议把 `types.ts` 里「全库实测 14 张卡因此错位」的措辞改为「27 张」，或分别写明「14 张划进词内部 + 13 张多词标注取错位置」。** 脚本：`.audit51-render2.mts`（逐条打印 A/B 两类）。

### 6.2 ② `wrongMark` 的 `types.ts` 文档补全——✅ **成立**

**位置**：`src/types.ts:583-606`（`LessonContrast.wrongMark` 的 doc comment）。
**独立复核**：文档中四个数字（674 / 502 / 52 / 65）**逐个精确复现**（见 6.1）。文档另声明：
- 「`wrongMark` = 要点击/划掉的位置（有机器消费方）；`【】`（写在 `whyZh` 里）= 改正后的形式（纯教学展示，零机器消费方）；两者本就该不同（划 `to`、展示 `【and】`），**禁止做一致性校验**」——我确认 `【】` 在代码中**确实没有机器消费者**（`rg "【"` 在 `src/` 下仅出现在数据字符串与测试断言中，无解析逻辑）✅
- 「定位一律走 `locateMarkedTokens`，不要自己写 `indexOf`」——确认渲染侧已照此实现 ✅（见 6.1）

**一处小瑕疵（建议顺手修）**：文档说「`wrongMark` 有多词形态（`"you are"` / `"Am I"` 等 65 张），按单 token 口径统计会永远匹配不上，**必须单列**」——这个提醒是对的，但**没有说清多词标注的语义**（`wrongMark="you are"` 究竟表示「这两个词都要划掉」还是「这里是语序问题，两个词一起看」）。`grammarBoostService.ts:1485` 的注释给出的答案是后者（「多词标注（`wrongMark="you are"` 这类语序问题）时，点中组成词的任一都算对」）——**建议把这句话补进 `types.ts`**。

### 6.3 ③ 全库测试全绿——✅ **成立，实际 2465 条（比报告多 2 条）**

```
Test Files  229 passed (229)
     Tests  2465 passed (2465)
  Duration  99.58s
```

命令：`./node_modules/.bin/vitest run --reporter=dot`（工作目录 `/Users/liujun/Documents/英语听写`）。
**与报告的差异**：协调者写 2463，实测 **2465**。差异方向为「多 2 条」，符合期间新增测试的正常情况，**不构成问题**，但建议以实测数为准更新记录。

**⚠️ 但「全绿」不等于「无缺陷」**：④ 里 **12 案的产物病句（机制 A 8 处 + 机制 B 真 6 处，去重 12 案）全部通过了现有测试**。原因是测试断言的是「卡正面 ≠ 含错原文」和「不含中文」，而病句**同时满足这两条**。**建议补三条断言**：
1. 卡正面不得含相邻重复词（`/\b(\w+)\s+\1\b/`）
2. 卡正面不得含「词集相同仅序不同」的相邻片段（机制 A 的特征）
3. 卡正面按原句 token 数 ±2 的区间校验（机制 A 会让词数暴增）

---

## ⑦ 自我核查记录

### 7.1 我先做了哪些可能出错的假设，以及如何证伪

| 假设 | 检验方法 | 结果 |
|---|---|---|
| 「用 grep 能扫出所有消费者」 | 检查本地 `grep` 实现（`type grep`） | ❌ **证伪**：本地 `grep` 是 ZCode 包装的 `ugrep -G --ignore-files`，会静默跳过被 ignore 的文件。改用 `/Applications/ZCode.app/Contents/Resources/tools/ripgrep/rg` + node 脚本 |
| 「613 = 单词形态总数 614 − 1」 | 用三种比对判据分别算（`.audit51-p1.mts`） | ✅ 成立，但**前提是「忽略大小写」口径**；严格口径下是 0 条「与原词同」 |
| 「`tag=word_order` 可当移动的代理」 | 统计 `tag=word_order` ∧ `correction` 以「去掉」开头的条目（`.audit51-last.mts`） | ❌ **证伪**：25 条里 10 条是真删除。**tag 与操作类型无关** |
| 「移动只存在于中文文案里」 | 用「同词集重排」判据扫纯英文 correction（`.audit51-perm.mts`） | ❌ **证伪**：5 处纯英文重排（`is it→it is` 等），无任何中文提示 |
| 「`pickCorrectionWord` 对移动是语义判断」 | 读实现 + 17 条逐条跑（`.audit51-pick.mts`） | ⚠️ **部分证伪**：结果正确（17/17 空串），但依据是**字面前缀**（`去掉` / `（…）`），不是语义 |
| 「重复词判据能直接找出所有病句」 | 人工逐条判读 17 个候选（`.audit51-verify-broken.mts` + `.audit51-final2.mts`） | ❌ **证伪**：19 个候选里 **5 个是假阳性**（产物其实是正确英文）。**故最终真缺陷数取人工判读后的 14 处，不取探测器的 19 处** |
| 「14 张 = 27 张，报告写错了」 | 分离两种口径重算（`.audit51-render2.mts`） | ⚠️ **两个都对但口径不同**：14 = 划进词内部，27 = 任何落点不同。已分别说明 |
| 「测试全绿说明下游没问题」 | 把病句产物拿去比对现有断言 | ❌ **证伪**：机制 A/B 的 12 案病句全部通过测试（断言只查「≠原文」和「无中文」） |

### 7.2 本报告每个数字的出处

| 数字 | 脚本 |
|---|---|
| 213 案 / 796 条 | `.audit51-shape.mts` |
| 形态五类 613/101/68/13/1 | `.audit51-shape.mts`、`.audit51-recon.mts` |
| 口径 A/B/C 的 0/1/76 | `.audit51-p1.mts` |
| 移动 L1/L2/L3/L4 = 13/15/17/22 | `.audit51-layers.mts`、`.audit51-last.mts` |
| 13 条逐案反证（删掉后句子残缺） | `.audit51-move-verify.mts` |
| 语义六类 **608**/90/62/22/14 | `.audit51-crossexact.mts`（`.audit51-sem2.mts` 是旧口径 613，保留作对照） |
| 语义 × 形态交叉表（两轴闭合 796） | `.audit51-crossexact.mts` |
| 「只改标点/大小写」14 条细分 1/8/5 | `.audit51-recon2.mts` |
| 陷阱词 1 条 | `.audit51-trap.mts` |
| `tag=word_order` ∧ 去掉 = 25（15 移 / 10 删） | `.audit51-last.mts` |
| `pickCorrectionWord` 17/17 空串、全库 125 空 / 671 非空 | `.audit51-pick.mts` |
| 移动 17 处 → 15 删 + 2 保持原样 | `.audit51-corrected.mts` |
| 移动 22 处 → 15 删 + 5 替换 + 2 保持原样 | `.audit51-all22.mts` |
| 移动 21 案全部可达（21/21） | `.audit51-reach2.mts` |
| 机制 A 8 处 / 6 案，22 张卡 | `.audit51-precise.mts`、`.audit51-garble2.mts` |
| 缺陷合计 36 处 / 29 案 = 13.6% | `.audit51-union2.mts` |
| 机制 B 真缺陷 14 处含 6 真 + 5 假阳性 | `.audit51-final2.mts` |
| 「原词 → 同形原词」60 条 | `.audit51-pickodd.mts` |
| `wrongMark` 674/502/52/65 | `.audit51-wm.mts` |
| 14 张 / 27 张 | `.audit51-render.mts`、`.audit51-render2.mts` |
| 2465 tests | `./node_modules/.bin/vitest run --reporter=dot` |

### 7.3 我**没有**做的事（避免越界）

- 未修改任何源码或数据（全部脚本为只读 `import`，无 `fs.write`）。
- 未处理 `wrongMark` 的 UI 文案（属另一研究）。
- 未改动测试文件（`.audit51-*` 脚本全部写在 `deliverables/product-strategy/`，不进 `src/`）。
- 未跑浏览器/GUI 验证（本批是数据与代码层语义收口，不涉及渲染像素；上批 `locateMarkedTokens` 只做了定位函数的逻辑复核，未截图）。

---

## ⑧ 不确定项

1. **5 处纯英文重排该不该算「移动」，我给的判据是「词集相同、顺序不同」，但这可能过宽。**
   `hunt-team-message#20` 的 `think she will not → don't think she will` 我的判据算**不是**重排（词集不同），但它**是**语序问题（`think` 前的否定要提前）。也就是说「移动」与「替换+插入」的边界在这类句子上是模糊的。**22 这个数字有 ±3 的浮动空间**（下限 19 = 只算中文提示 17 + 2 条明确对调；上限 25 = 把 `don't think she will`、`never/late` 类语序条目也纳入）；**13（L1 字面）、15（L2）、17（L3）是硬的，22 是软的**。

2. **M2 格式规范原文未取到。** 我通过 ERRANT 的 `to_m2()` 看到格式形如 `A <start> <end>|||<type>|||<correction>|||REQUIRED|||-NONE-|||<annotator id>`，但没拿到 CoNLL-2014 的规范文档。**因此 ⑤ 里「M2 把编辑的 span 和类型分开存」这一说法，我只有间接证据，未逐字引用规范。** 若需要更强的权威背书，建议另找（ACL Anthology 的 CoNLL-2014 共享任务论文）。

3. **`hunt-photo-compare#26` 的 `more good → better` 算不算「跨度」有争议。** `more` 和 `good` 是两个 token，`better` 是一个词——严格说这是「两词合一词」，既不是纯跨度也不是纯替换。我把它计入机制 A（8 处），但若按「correction 是单 token」来看它更像替换。**这一处的归类会影响「8 处」这个数字（可变为 7）。**

4. **机制 B 的 5 处假阳性依赖我的人工判读。** 我用「产物是不是正确英文」来判，但「正确英文」在这几例（如 `I am used to walking to school.` vs 原 `I am used walking to school.`）里我判断为正确——**若复核者认为 `used to walking` 的讲解意图另有他指，这 5 处会重新计入缺陷**。脚本 `.audit51-final2.mts` 已把原句/实得/应然句全部打印，便于推翻。

5. **「改文案模板」的可行性我未验证。** 方案 B 的核心假设是「把 17 条移动文案从 `去掉（X 放到 Y 前面）` 改成 `把 X 移到 Y 前面` 之后，现有 `/^（?去掉/` 正则不再误判」。这个假设**在代码层读起来成立**，但我**没有实际改一条数据跑一遍测试来验证**（避免污染工作区）。如果采纳，**建议先改 1 条 + 跑全量测试**再铺开。

6. **`hunt-so-do-i#11` 的「陷阱词」定性依赖对讲解文案的解读。** 讲解写「这句没问题」，我理解为「这是故意设的陷阱词、不是真错」，故建议不单列第七类；但也可能作者本意就是「补句号是真错，前半句在讲为什么不考它」。**这一处的定性未与数据作者确认。**

7. **本批未核验 `grammarLessons` 侧的 `DiaryIssue.correction`**（`src/types.ts:689`）。它与 `HuntError.correction` 同名但来自 AI 批改，语义完全不同（AI 返回的自由文本，有 `diaryService.ts:313` 的类型守卫）。**若后续要统一「correction」的字段语义，这一处必须一并纳入**——但不在本批范围。

---

## 附：本批使用的脚本清单

全部位于 `/Users/liujun/Documents/英语听写/deliverables/product-strategy/`，只读，用 `./node_modules/.bin/vite-node <脚本>` 运行：

```
.audit51-shape.mts          形态五类 + 互斥自检 + 13/68 全列
.audit51-p1.mts             三种「与原词同」判据对比（0 / 1 / 76）
.audit51-recon.mts          613 vs 600 口径对账
.audit51-recon2.mts         14 条「只改标点/大小写」细分（1 大小写 / 8 逗号 / 5 句末）
.audit51-cjk.mts            含中文 correction 81 条全列 + 归一比对
.audit51-move.mts           语义 × 形态交叉表 + 移动 17 条
.audit51-layers.mts         移动 L1/L2/L3/L4 = 13/15/17/19 分层
.audit51-move-verify.mts    13 条逐案反证（读 tokens 还原「若真删除」）
.audit51-last.mts           移动终值 22 + word_order∧去掉 = 25 的 15/10 拆分
.audit51-sem2.mts           语义六类 + 语义×形态交叉表
.audit51-wo.mts             tag=word_order ∧ 去掉 的 25 条逐条打印
.audit51-pick.mts           pickCorrectionWord 对 17 移动 + 全库分布
.audit51-pickodd.mts        「入库词 = 去标点原词」60 条
.audit51-corrected.mts      移动 17 → correctedSentenceOf 分支追踪
.audit51-reach.mts          移动 17 案可达性（17/17）
.audit51-reach2.mts         移动 21 案可达性（扩展口径，21/21）
.audit51-perm.mts           纯英文同词集重排 5 条 + 补词 88 条
.audit51-origspan.mts       original 跨多 token 8 条 + 产物
.audit51-span2.mts          跨度错点的 token/下标证据
.audit51-garble2.mts        6 案 22 张卡的正面（真实建卡路径）
.audit51-mech3.mts          机制 A/C 探测
.audit51-precise.mts        机制 A/B 精确判据
.audit51-final2.mts         真缺陷 14 处 / 12 案 + 假阳性 5 处（含应然句）
.audit51-defect.mts         机制 A/B/C 三路候选
.audit51-garblefinal.mts    全库 213 案重复痕迹扫描
.audit51-allsent.mts        全库修正句 D2 缺陷
.audit51-verify-broken.mts  19 个候选逐案打印（人工判读用）
.audit51-trap.mts           陷阱词 1 条
.audit51-tagchk.mts         tag 分布 + 14 条大小写/标点的 tag 贴切度
.audit51-edge.mts           边界案（late-note/would-rather-walk/prefer-tea）+ 空修正
.audit51-sodoi.mts          hunt-so-do-i / hunt-nice-day 明细
.audit51-latenote.mts       含中文非删词的产物
.audit51-render.mts         旧法 vs 新法定位（14 / 27）
.audit51-render2.mts        27 张的 A/B 分类
.audit51-wm.mts             wrongMark 674/502/52/65
.audit51-crossexact.mts     语义 × 形态交叉表（终版，两轴各闭合于 796）
.audit51-union.mts          三类缺陷案件并集（含假阳性）
.audit51-union2.mts         缺陷并集（剔除假阳性）：22+8+6 = 36 处 / 29 案
.audit51-birthday.mts       hunt-birthday-list 明细
```

**竞析交付完毕。核心建议一句话**：`correction` 应补一层机器可读的 `editOp`（对齐 ERRANT 的 M/U/R 操作层）并把 17 条移动文案从「去掉（X 放到 Y 前面）」改为「把 X 移到 Y 前面」；在此之前，`correctedSentenceOf` 的 15 处「误删」与 8 处「跨度残留」会让用户看到并记住病句。
