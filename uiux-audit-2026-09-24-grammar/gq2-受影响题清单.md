# 趁热练（boost）生成题：扫描发现的问题清单

来源：`.rvfind/gq2-findings.json`（项目自带的 GQ2 全库扫描，2026-09-21 生成）。
覆盖：205 课 × 三档 × 16 轮 = 66420 次出题调用，去重后 7021 道独立题。

**findings.json 里的 samples 共 102 条，恰好等于各检查项计数之和（102），所以它是全量、不是抽样。**
涉及 78 课。

复跑方式：`npx vitest run src/edge/verify/gq2-boost-items.test.ts`（会重写 `.rvfind/gq2-findings.json`）。

---

## 一、P0（5 条）：逐条已核实

下面每条的「题面 / 标准答案 / 判分模拟」是用项目自己的生成器与判分函数跑出来的
（探针：`tools/gq2-bothright-pool.probe.mts`，只读，不改 src/）。

| 题号 | 课 | 题面（被判为「写错了」的句子） | 标准答案 | 判分：输入题面那句 |
|---|---|---|---|---|
| `boost-lesson-76-much-better-t3-fix-0` | lesson-76-much-better | `How much milk is there?` | `I feel much better.` | **不通过（17 分）** |
| `boost-lesson-87-its-cold-t3-fix-0` | lesson-87-its-cold | `It's cold today.` | `It is cold today.` | 通过（100 分） |
| `boost-lesson-114-a-few-t3-fix-0` | lesson-114-a-few | `There are few apples.` | `There are a few apples.` | **不通过（80 分）** |
| `boost-lesson-169-id-like-t3-fix-1` | lesson-169-id-like | `I'd like a cup of tea.` | `I would like a cup of tea.` | 通过（100 分） |

### 逐条读法与处置

**① `lesson-76-much-better` —— 真正的坏题（不可作答）**
题面「How much milk is there?」和答案「I feel much better.」是两道毫无关系的句子。
学习者被告知「这句写错了——请你把它改对，整句写出来」，而那正确无误；能通过的只有一句他不可能推导出来的另一句话。
根因：该课 `contrast[0]` 的 `bothRight: true` 条目里，`wrong` 存的是**往期课的句子**（第 30 课的 How much milk），
`correct` 存的是**今天的句子**——这对字段被用来表示「往期 + 今天」的复现关系，而不是「错句 + 正确句」。

**② `lesson-114-a-few` —— 坏题，但性质不同（前提为假且会扣分）**
题面「There are few apples.」语法完全正确，只是意思和答案不同。该课自己的 `whyZh` 就写着：
「两句都成立，只是意思不同：『还有几个』（够）要说 a few；光说 few 是『几乎没了』。想表达哪个，就选哪个。」
既然「想表达哪个就选哪个」，就不存在「这句写错了」。学习者照题面输入得 80 分、低于 90 分线。
这不是改错题该用的素材，而是**词义辨析**素材被塞进了改错通道。

**③ `lesson-87-its-cold` / `lesson-169-id-like` —— 前提为假，但判分放行**
`It's cold today.` 与 `It is cold today.`（以及 `I'd` / `I would`）都是正确英语，判分对两种写法都给 100 分。
所以不会扣分。**但题面写着「这句写错了」——这是在教错东西**：学习者会以为缩写形式本身是错、必须改全写。
对语法学习产品来说，这仍然是要修的，只是优先级低于 ①②。

### ⚠ 对扫描报告措辞的一处更正

gq2 对这 5 条的 `detail` 统一写作「用户选『没问题』反被判错」。实测下来这句话
**只适用于 `contrast` 类题**（给句子让你选有没有问题），而**不适用于这 4 道 `fix` 类题**——
`fix` 是让学习者自己写出整句，没有「没问题」这个选项。其中 2 道（87 / 169）根本不会判错。
按原措辞去修，会白修 2 道、也会找错位置。

**④ `fabricatedDistractor`：`boost-lesson-161-need-to-t1-cloze-variants-1`**
实测该题字段：
```
clozeText    = "I don't ___ to buy milk."
clozeAnswer  = "need"
clozeOptions = ["finish", "key", "need", "ned"]
```
**规模已实测**：把全库 205 课 × 三档 × 16 轮的 cloze 干扰项扫一遍，去重后 369 个候选词里，
不是英语词的只有 `ned` 这一个——这不是积压问题，是 1 道题。
`ned` 与正确答案 `need` 只差一个字母，是拼写陷阱而不是语法干扰项；
另外两个选项 `finish` / `key` 与本课语法点（don't + 动词原形）毫无关系，这道题实际上什么也没测。

---

## 二、根因：tier-3「改错」通道少了一道过滤

`src/services/grammarBoostService.ts` 里，`bothRight` 素材在其他通道都被挡掉了，
例如 `if (contrast.bothRight) continue;` / `if (contrast.bothRight) return;`，
但 tier-3 的 `fix`（自己改错）通道**没有这道判断**：

```ts
// ── 自己改错：给错句，让用户写出正确句（产出形态的改错）──
for (const [index, contrast] of (lesson.contrast ?? []).entries()) {
  if (!contrast.wrong.trim() || !contrast.correct.trim()) continue;
  if (normalizeLessonSentence(contrast.wrong) === normalizeLessonSentence(contrast.correct)) continue;
  // ← 这里缺 if (contrast.bothRight) continue;
  candidates.fix.push({ ... promptZh: "这句写错了——请你把它改对，整句写出来。" ... });
}
```

### 为什么不能只改那 4 道题

候选池实测：**全库 205 课里有 505 条 `bothRight: true` 的 contrast 条目**（分布在 166 课）。
每条都可能成为 `boost-<课>-t3-fix-<序号>`。空 `seen` 跑 16 轮只命中 4 道，
但把 `seen` 按真实语义累积后，仅 5 课就浮出 **19 道**：

```
lesson-76-much-better  → fix-0, fix-3, fix-4, fix-5
lesson-87-its-cold     → fix-0, fix-3, fix-4, fix-5
lesson-114-a-few       → fix-0, fix-3, fix-4, fix-5
lesson-169-id-like     → fix-1, fix-3, fix-4, fix-5
lesson-55-ordinal      → fix-3, fix-4, fix-5
```

结论：**该修的是那道缺失的 `bothRight` 过滤，而不是这 4 道题。**
改题目数据的话，学习者练习历史一变就会撞上下一条。

---

## 三、P1（97 条）：完整清单

### bothRightAsWrong（4 条，P0）— 双正解素材被当成「有错」的题面

| 课 | 题号 | kind | tier | 说明 | 示例 |
|---|---|---|---|---|---|
| lesson-76-much-better | `boost-lesson-76-much-better-t3-fix-0` | fix | 3 | bothRight（两句都对）素材被当成「这句写错了」的题面：用户选「没问题」反被判错 | `boost-lesson-76-much-better-t3-fix-0 t3 kind=fix shapedFrom="How much milk is there?" answ` |
| lesson-87-its-cold | `boost-lesson-87-its-cold-t3-fix-0` | fix | 3 | bothRight（两句都对）素材被当成「这句写错了」的题面：用户选「没问题」反被判错 | `boost-lesson-87-its-cold-t3-fix-0 t3 kind=fix shapedFrom="It's cold today." answer="It is ` |
| lesson-114-a-few | `boost-lesson-114-a-few-t3-fix-0` | fix | 3 | bothRight（两句都对）素材被当成「这句写错了」的题面：用户选「没问题」反被判错 | `boost-lesson-114-a-few-t3-fix-0 t3 kind=fix shapedFrom="There are few apples." answer="The` |
| lesson-169-id-like | `boost-lesson-169-id-like-t3-fix-1` | fix | 3 | bothRight（两句都对）素材被当成「这句写错了」的题面：用户选「没问题」反被判错 | `boost-lesson-169-id-like-t3-fix-1 t3 kind=fix shapedFrom="I'd like a cup of tea." answer="` |

### fabricatedDistractor（1 条，P0）— 干扰项不是英语词

| 课 | 题号 | kind | tier | 说明 | 示例 |
|---|---|---|---|---|---|
| lesson-161-need | `boost-lesson-161-need-to-t1-cloze-variants-1` | cloze | 1 | 干扰项 "ned" 不是英语词（加后缀硬造） | `boost-lesson-161-need-to-t1-cloze-variants-1 answer="need"` |

### zhMultiAnswerSingleKey（29 条，P1）— 中文题干对应多个正解，但只留一个标准答案

| 课 | 题号 | kind | tier | 说明 | 示例 |
|---|---|---|---|---|---|
| lesson-10-went | `boost-lesson-10-went-t2-recall-target-0` | recall | 2 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="我昨天去了公园。" answer="Yesterday I went to the park." 另一解=i went to the park yesterda` |
| lesson-10-went | `boost-lesson-10-went-t3-produce-target-0` | produce | 3 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="我昨天去了公园。" answer="Yesterday I went to the park." 另一解=i went to the park yesterda` |
| lesson-24-past-vs-perfect | `boost-lesson-24-past-vs-perfect-t2-recall-target-0` | recall | 2 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="我昨天去了公园。" answer="Yesterday I went to the park." 另一解=i went to the park yesterda` |
| lesson-24-past-vs-perfect | `boost-lesson-24-past-vs-perfect-t3-produce-target-0` | produce | 3 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="我昨天去了公园。" answer="Yesterday I went to the park." 另一解=i went to the park yesterda` |
| lesson-54-focus | `boost-lesson-54-focus-t2-translate-examples-1` | translate | 2 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="窗户昨天被打扫了。" answer="The window was cleaned yesterday." 另一解=the windows were clean` |
| lesson-68-buy-for | `boost-lesson-68-buy-for-t2-recall-target-0` | recall | 2 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="我给妈妈买了份礼物。" answer="I bought a gift for my mom." 另一解=i bought my mom a gift(less` |
| lesson-68-buy-for | `boost-lesson-68-buy-for-t3-produce-target-0` | produce | 3 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="我给妈妈买了份礼物。" answer="I bought a gift for my mom." 另一解=i bought my mom a gift(less` |
| lesson-110-who-makes-who | `boost-lesson-110-who-makes-who-t2-recall-target-0` | recall | 2 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="把这些事串起来说一遍。" answer="My mom makes me do my homework." 另一解=grandmas birthday is i` |
| lesson-110-who-makes-who | `boost-lesson-110-who-makes-who-t3-produce-target-0` | produce | 3 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="把这些事串起来说一遍。" answer="My mom makes me do my homework." 另一解=grandmas birthday is i` |
| lesson-112 | `boost-lesson-112-this-is-mine-t2-recall-target-0` | recall | 2 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="这本是我的。" answer="This book is mine." 另一解=this one is mine(lesson-85-whose:swing)` |
| lesson-112 | `boost-lesson-112-this-is-mine-t3-produce-target-0` | produce | 3 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="这本是我的。" answer="This book is mine." 另一解=this one is mine(lesson-85-whose:swing)` |
| lesson-117-all-i-wanted | `boost-lesson-117-all-i-wanted-t2-recall-target-0` | recall | 2 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="把这些事串起来说一遍。" answer="Grandma's birthday is in May." 另一解=my mom makes me do my ho` |
| lesson-117-all-i-wanted | `boost-lesson-117-all-i-wanted-t3-produce-target-0` | produce | 3 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="把这些事串起来说一遍。" answer="Grandma's birthday is in May." 另一解=my mom makes me do my ho` |
| lesson-118-close-17 | `boost-lesson-118-close-17-t2-recall-target-0` | recall | 2 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="把这章学过的说法一次说一遍。" answer="Grandma's birthday is in May." 另一解=i used to walk to sch` |
| lesson-118-close-17 | `boost-lesson-118-close-17-t3-produce-target-0` | produce | 3 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="把这章学过的说法一次说一遍。" answer="Grandma's birthday is in May." 另一解=i used to walk to sch` |
| lesson-124-close-18 | `boost-lesson-124-close-18-t2-recall-target-0` | recall | 2 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="把这章学过的说法一次说一遍。" answer="I used to walk to school." 另一解=grandmas birthday is in m` |
| lesson-124-close-18 | `boost-lesson-124-close-18-t3-produce-target-0` | produce | 3 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="把这章学过的说法一次说一遍。" answer="I used to walk to school." 另一解=grandmas birthday is in m` |
| lesson-133-five-senses | `boost-lesson-133-five-senses-t2-recall-target-0` | recall | 2 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="把这章学过的说法一次说一遍。" answer="It looks nice." 另一解=grandmas birthday is in may(lesson-1` |
| lesson-133-five-senses | `boost-lesson-133-five-senses-t3-produce-target-0` | produce | 3 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="把这章学过的说法一次说一遍。" answer="It looks nice." 另一解=grandmas birthday is in may(lesson-1` |
| lesson-138 | `boost-lesson-138-two-stations-t2-recall-target-0` | recall | 2 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="把这章学过的说法一次说一遍。" answer="I am used to getting up early." 另一解=grandmas birthday is` |
| lesson-138 | `boost-lesson-138-two-stations-t3-produce-target-0` | produce | 3 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="把这章学过的说法一次说一遍。" answer="I am used to getting up early." 另一解=grandmas birthday is` |
| lesson-144-close-23 | `boost-lesson-144-close-23-t2-recall-target-0` | recall | 2 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="把这章学过的说法一次说一遍。" answer="As soon as I finish, I will eat." 另一解=grandmas birthday ` |
| lesson-144-close-23 | `boost-lesson-144-close-23-t3-produce-target-0` | produce | 3 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="把这章学过的说法一次说一遍。" answer="As soon as I finish, I will eat." 另一解=grandmas birthday ` |
| lesson-147-close-24 | `boost-lesson-147-close-24-t2-recall-target-0` | recall | 2 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="把这章学过的两张脸一次说一遍。" answer="I like tea too." 另一解=both books are good(lesson-150-clo` |
| lesson-147-close-24 | `boost-lesson-147-close-24-t3-produce-target-0` | produce | 3 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="把这章学过的两张脸一次说一遍。" answer="I like tea too." 另一解=both books are good(lesson-150-clo` |
| lesson-150-close-25 | `boost-lesson-150-close-25-t2-recall-target-0` | recall | 2 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="把这章学过的两张脸一次说一遍。" answer="Both books are good." 另一解=i like tea too(lesson-147-clo` |
| lesson-150-close-25 | `boost-lesson-150-close-25-t3-produce-target-0` | produce | 3 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="把这章学过的两张脸一次说一遍。" answer="Both books are good." 另一解=i like tea too(lesson-147-clo` |
| lesson-175-so-do-i | `boost-lesson-175-so-do-i-t2-recall-target-0` | recall | 2 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="我也是。" answer="So do I." 另一解=so am i(lesson-175-so-do-i:swing)` |
| lesson-175-so-do-i | `boost-lesson-175-so-do-i-t3-produce-target-0` | produce | 3 | 中文提示对应的英文有多个合法写法，判分只认其中一个（用户写出另一解会被判错） | `intentZh="我也是。" answer="So do I." 另一解=so am i(lesson-175-so-do-i:swing)` |

### variantLabelMismatch（2 条，P1）— 变体标签与内容不匹配

| 课 | 题号 | kind | tier | 说明 | 示例 |
|---|---|---|---|---|---|
| lesson-66 | `boost-lesson-66-too-to-t3-variant-否定` | variant | 3 | 题面要求写成「否定」形态，答案却不是否定句 | `promptZh="这句话还能换个说法——把它说成「否定」的样子。" answer="It is too heavy for me."` |
| lesson-89-what-a-day | `boost-lesson-89-what-a-day-t3-variant-否定` | variant | 3 | 题面要求写成「否定」形态，答案却不是否定句 | `promptZh="这句话还能换个说法——把它说成「否定」的样子。" answer="What a bad day!"` |

### clozeAnswerVisible（1 条，P1）— 填空题的答案在题面里可见

| 课 | 题号 | kind | tier | 说明 | 示例 |
|---|---|---|---|---|---|
| lesson-98-while | `boost-lesson-98-while-t1-cloze-variants-1` | cloze | 1 | 答案词仍出现在题面里（可照抄） | `clozeText="While I was reading, he ___ not sleeping." answer="was"` |

### weakDistractors（65 条，P1）— 干扰项过弱（一眼排除，测不出掌握）

| 课 | 题号 | kind | tier | 说明 | 示例 |
|---|---|---|---|---|---|
| lesson-01-am | `boost-lesson-01-am-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="tired" options=["friend","gift","tired","none"]` |
| lesson-04-want | `boost-lesson-04-want-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="want" options=["want","wanting","wanted","wants"]` |
| lesson-08-my | `boost-lesson-08-my-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="book" options=["warm","hours","book","keeps"]` |
| lesson-15-want | `boost-lesson-15-want-to-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="want" options=["want","wanting","wants","wanted"]` |
| lesson-20-because-so | `boost-lesson-20-because-so-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="went" options=["cup","pens","drinks","went"]` |
| lesson-23-have-lost | `boost-lesson-23-have-lost-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="cleaned" options=["while","cleaned","cleans","cleaning"]` |
| lesson-25 | `boost-lesson-25-third-person-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="coffee" options=["free","hand","students","coffee"]` |
| lesson-28-frequency | `boost-lesson-28-frequency-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="candy" options=["does","candy","nobody","plans"]` |
| lesson-30-some-any | `boost-lesson-30-some-any-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="apples" options=["fish","eats","apples","weekend"]` |
| lesson-31-superlative | `boost-lesson-31-superlative-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="one" options=["wind","been","dogs","one"]` |
| lesson-34-past-continuous | `boost-lesson-34-past-continuous-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="sleeping" options=["sleeping","watches","cousin","sunday"]` |
| lesson-36 | `boost-lesson-36-think-that-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="tired" options=["knew","tired","live","well"]` |
| lesson-39-who-glasses | `boost-lesson-39-who-glasses-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="wears" options=["warm","much","wears","idea"]` |
| lesson-41 | `boost-lesson-41-two-things-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="wears" options=["sung","weather","wears","late"]` |
| lesson-42-like-reading | `boost-lesson-42-like-reading-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="reading" options=["reading","notebook","quiet","library"]` |
| lesson-49-advice-if | `boost-lesson-49-advice-if-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="rains" options=["rains","amy","house","cloud"]` |
| lesson-61-could-you | `boost-lesson-61-could-you-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="help" options=["helping","helped","helps","help"]` |
| lesson-65-as-as | `boost-lesson-65-as-as-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="not" options=["not","likes","week","feels"]` |
| lesson-66 | `boost-lesson-66-too-to-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="too" options=["there","plays","days","too"]` |
| lesson-67-good-at | `boost-lesson-67-good-at-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="good" options=["good","broke","run","while"]` |
| lesson-74-help-let | `boost-lesson-74-help-let-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="help" options=["help","helps","helping","helped"]` |
| lesson-75-lets | `boost-lesson-75-lets-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="Let's" options=["names","Let's","candy","money"]` |
| lesson-78-day-story | `boost-lesson-78-day-story-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="reading" options=["weekend","leave","reading","bigger"]` |
| lesson-86-lost-and-found | `boost-lesson-86-lost-and-found-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="nothing" options=["month","letter","nothing","course"]` |
| lesson-87-its-cold | `boost-lesson-87-its-cold-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="cold" options=["broken","girl","come","cold"]` |
| lesson-90-after | `boost-lesson-90-after-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="homework" options=["thanks","homework","easier","windows"]` |
| lesson-93-used | `boost-lesson-93-used-to-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="play" options=["plays","play","played","playing"]` |
| lesson-94-gate | `boost-lesson-94-gate-talk-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="not" options=["not","ruler","games","has"]` |
| lesson-96-was-raining | `boost-lesson-96-was-raining-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="raining" options=["desks","older","studies","raining"]` |
| lesson-100-used | `boost-lesson-100-used-to-story-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="play" options=["play","plays","playing","played"]` |
| lesson-106-let-him | `boost-lesson-106-let-him-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="dinner" options=["cloud","under","need","dinner"]` |
| lesson-118-close-17 | `boost-lesson-118-close-17-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="apples" options=["apples","draw","little","listen"]` |
| lesson-119-used | `boost-lesson-119-used-to-it-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="used" options=["used","leaves","that","made"]` |
| lesson-120-used | `boost-lesson-120-used-to-doing-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="getting" options=["still","getting","yourself","likes"]` |
| lesson-121-get-used | `boost-lesson-121-get-used-to-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="used" options=["face","used","cats","shelf"]` |
| lesson-123-not-used | `boost-lesson-123-not-used-to-t1-cloze-variants-2` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="used" options=["i'm","used","take","few"]` |
| lesson-124-close-18 | `boost-lesson-124-close-18-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="used" options=["books","free","used","too"]` |
| lesson-126-you-look | `boost-lesson-126-you-look-tired-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="tired" options=["tired","said","train","eats"]` |
| lesson-128-it-sounds-great | `boost-lesson-128-it-sounds-great-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="sound" options=["came","boat","sound","days"]` |
| lesson-133-five-senses | `boost-lesson-133-five-senses-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="good" options=["good","sing","don't","city"]` |
| lesson-134-looking-forward | `boost-lesson-134-looking-forward-to-the-weekend-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="looking" options=["looking","broke","sleepy","track"]` |
| lesson-135-she-looks-forward | `boost-lesson-135-she-looks-forward-to-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="forward" options=["months","month","questions","forward"]` |
| lesson-136-looking-forward | `boost-lesson-136-looking-forward-to-seeing-you-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="forward" options=["every","night","forward","plans"]` |
| lesson-137-are-you-looking-forward | `boost-lesson-137-are-you-looking-forward-to-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="saying" options=["sunday","name","mimi","saying"]` |
| lesson-138 | `boost-lesson-138-two-stations-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="forward" options=["catch","windows","forward","finish"]` |
| lesson-149-neither | `boost-lesson-149-neither-t1-cloze-variants-2` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="books" options=["pass","books","have","bigger"]` |
| lesson-150-close-25 | `boost-lesson-150-close-25-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="Neither" options=["always","sound","Neither","noise"]` |
| lesson-153-yet-already | `boost-lesson-153-yet-already-t1-cloze-variants-2` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="finished" options=["finishs","finished","forget","finishing"]` |
| lesson-154-still | `boost-lesson-154-still-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="waiting" options=["seems","third","hungry","waiting"]` |
| lesson-157-none | `boost-lesson-157-none-t1-cloze-variants-2` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="yours" options=["clock","grandma","yours","october"]` |
| lesson-161-need | `boost-lesson-161-need-to-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="need" options=["finish","key","need","ned"]` |
| lesson-165-each-other | `boost-lesson-165-each-other-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="other" options=["other","cheese","stops","can"]` |
| lesson-167-a-lot-of | `boost-lesson-167-a-lot-of-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="friends" options=["grandma","isn't","friends","students"]` |
| lesson-169-id-like | `boost-lesson-169-id-like-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="like" options=["feels","like","liked","whole"]` |
| lesson-171-neither-nor | `boost-lesson-171-neither-nor-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="noodles" options=["taken","lunch","noodles","wears"]` |
| lesson-175-so-do-i | `boost-lesson-175-so-do-i-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="Neither" options=["classroom","questions","glasses","Neither"]` |
| lesson-180-whole | `boost-lesson-180-whole-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="finish" options=["finishing","finishs","finish","finished"]` |
| lesson-184-close-26 | `boost-lesson-184-close-26-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="help" options=["help","helps","helped","helping"]` |
| lesson-185-close-27 | `boost-lesson-185-close-27-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="likes" options=["likes","these","liked","they"]` |
| lesson-189 | `boost-lesson-189-their-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="books" options=["kind","books","thirsty","kept"]` |
| lesson-190-learning | `boost-lesson-190-learning-to-swim-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="learning" options=["people","cannot","guests","learning"]` |
| lesson-192 | `boost-lesson-192-through-across-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="through" options=["hands","sings","hadn't","through"]` |
| lesson-196-among | `boost-lesson-196-among-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="boxes" options=["mimi","boxes","close","word"]` |
| lesson-197-irregular-past | `boost-lesson-197-irregular-past-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="think" options=["it's","comes","think","been"]` |
| lesson-203-wore | `boost-lesson-203-wore-t1-cloze-variants-1` | cloze | 1 | 有效干扰项 < 2（题目近似白送） | `answer="yesterday" options=["yesterday","weren't","minutes","classroom"]` |

---

## 四、已知基线上界（`src/edge/verify/gq2-boost-items.test.ts`）

该测试断言的是「不超过基线」，不是「为零」：

```ts
/** 已知基线上界（2026-09-21 扫描；源码 grammarBoostService.ts sha256 d8f95f40…）。 */
const BASELINE = {
  bothRightAsWrong: 12,        // 实际  4
  fabricatedDistractor: 10,    // 实际  1
  visibleAnswer: 1,            // 实际  1（扫描里的 clozeAnswerVisible）
  emptyOrBadAnswer: 0,         // 实际  0
  arrangeNotConstructible: 0,  // 实际  0
  zhMultiAnswerSingleKey: 40,  // 实际 29
  weakDistractors: 160         // 实际 65
};
```

实际值全部低于上界，所以测试是绿的——**而绿的原因是它允许了一定量的已知错误存在**。
换句话说：`bothRightAsWrong` 这个检查项留了 12 个名额，目前用掉 4 个，还有 8 个名额的空位；
`fabricatedDistractor` 留了 10 个，用掉 1 个。要让它有意义，这几个数字应当逐步压到 0。


本次新增的三个探针（只读，不改 src/）：
- `tools/gq2-bothright-pool.probe.mts` —— 候选池规模 + 逐题判分模拟
- `tools/gq2-latent-pool.probe.mts` —— seen 累积下潜藏候选的浮出数量
- `tools/gq2-ned-item.probe.mts` —— `ned` 干扰项那道的完整字段
运行：`npx vite-node uiux-audit-2026-09-24-grammar/tools/<文件名>`

---

## 五、追加核实：`zhMultiAnswerSingleKey` 这 29 条，只有 4 条是真的

扫描把这一项标成 P1、29 条。我用项目自己的判分器逐条跑过（探针
`tools/gq2-zh-multi-answer.probe.mts`、`tools/gq2-zh-multi-answer-classify.probe.mts`），
**复现值正好 29，与扫描一致**（说明我的复现是同口径的），但里面：

| 分类 | 条数 | 判据 |
|---|---|---|
| 扫描误报：题干是「指令」 | 18 | 见下 |
| 判分接受，非缺陷 | 5 | 判分对另一解给「通过」（如词序变体 `Yesterday I went to the park.` / `I went to the park yesterday.`） |
| 需人工判定，实际是误报 | 2 | `lesson-175-so-do-i`：`So do I.` / `So am I.`——这一课的语法点**就是**「do 和 be 各接各的」，只认一个是**正确的教学意图** |
| **真缺陷** | **4** | 见下 |

### 扫描误报的根因

扫描的 B-6 检查把 `intentZh` 当「一句可翻译的中文」，然后看全库同一句中文对应几个英文。
但有一批 `intentZh` 根本不是句子，而是**指令**：

```
「把这些事串起来说一遍。」        （lesson-110 / 117）
「把这章学过的说法一次说一遍。」    （lesson-118 / 124 / 133 / 138 / 144）
「把这章学过的两张脸一次说一遍。」  （lesson-147 / 150）
```

于是扫描发现「这句中文对应 8 种英文写法」，得出「题目只认一个、写另一个会被判错」——
可实际上每课考的是**本课自己那句 target**，学习者知道该写哪句。这 18 条是扫描凭空造出来的。

### 4 条真缺陷（可确证）

| 题号 | 题干 | 只认 | 写出另一解 | 为什么是真缺陷 |
|---|---|---|---|---|
| `boost-lesson-68-buy-for-t2-recall-target-0` | 我给妈妈买了份礼物。 | `I bought a gift for my mom.` | `I bought my mom a gift.` → **不通过（29 分）** | 另一解出自**本课的 `sceneSwings`**（`lesson-68-buy-for:swing`）——同一课既教这个说法，又判它不及格 |
| `boost-lesson-68-buy-for-t3-produce-target-0` | 同上 | 同上 | 同上 → **不通过（29 分）** | 同上 |
| `boost-lesson-54-focus-t2-translate-examples-1` | 窗户昨天被打扫了。 | `The window was cleaned yesterday.` | `The windows were cleaned yesterday.` → **不通过（70 分）** | 中文「窗户」不标单复数，两种英文读法都合法；另一解出自 lesson-51 的例句（应用自己教过） |
| `boost-lesson-112-this-is-mine-t3-produce-target-0` | 这本是我的。 | `This book is mine.` | `This one is mine.` → **不通过（75 分）** | 同课同题的中文，`t2-recall` 版本对这句话给「**通过**」，`t3-produce` 却给 75 分——**recall 线是 70、produce 线是 90，同一答案只在其中一边过关** |

### 后续：扫描已按这两条修正（2026-09-24）

`gq2-boost-items.test.ts` 的 B-6 已改：加入「题干是指令」的排除（按**占比**而非最大值判词面重合），
并把「假定判分会拒」改为**真正调 `judgeBoostItem`**。
`zhMultiAnswerSingleKey` 由 **29 → 6**，`BASELINE` 由 40 压到 6。剩下的 6 条逐条可核对：

| 题号 | 性质 |
|---|---|
| `lesson-54-focus-t2-translate-examples-1` | 真缺陷：「窗户」不标单复数，两种英文读法都合法 |
| `lesson-68-buy-for-t2-recall-target-0` | 真缺陷：另一解出自**本课自己的 sceneSwings** |
| `lesson-68-buy-for-t3-produce-target-0` | 同上 |
| `lesson-112-this-is-mine-t3-produce-target-0` | 真缺陷：同答案 recall 判通过、produce 判 75 |
| `lesson-175-so-do-i-t2-recall-target-0` | 人工判定：本课语法点就是 do／be 各接各的，只认一个可能是有意的 |
| `lesson-175-so-do-i-t3-produce-target-0` | 同上 |

### 当时提出的两条修正建议（原文保留）


1. **B-6 应排除「指令型 `intentZh`」**，否则每加一章「把这章……说一遍」就会凭空多出几条 P1。可用「同一句中文对应多个**不同课**的 target 且彼此语义无关」作为排除条件。
2. **B-6 现在是「推断」而非「测量」**：它看到多解就假定判分会拒，但实测有 5 条判分是接受的。改成直接调 `judgeBoostItem` 拿真实分数，P1 计数会从 29 降到 4。

---

## 六、剩下三类 P1 的核实结论（2026-09-24 补）

至此 102 条 findings 全部核实完毕。前三类（`bothRightAsWrong` / `fabricatedDistractor` /
`zhMultiAnswerSingleKey`）见上文与 `改动方案.md`。

### 6.1 `variantLabelMismatch`（2 条）——真缺陷，根因是「label 被当成了语法描述」

| 题号 | 题面要求 | 实际答案 |
|---|---|---|
| `boost-lesson-66-too-to-t3-variant-否定` | 把它说成「**否定**」的样子 | `It is too heavy for me.`（**不是否定句**） |
| `boost-lesson-89-what-a-day-t3-variant-否定` | 同上 | `What a bad day!`（**不是否定句**） |

**根因（已查全库）**：615 条 variant 的 `label` 恰好是 **205/205/205** 的「肯定 / 否定 / 疑问」，
也就是说 `label` 实际承担的是**「第几个变体」的槽位编号**。但出题侧把它当语法描述用：

```ts
promptZh: `这句话还能换个说法——把它说成「${target.label}」的样子。`,
```

该课的第 2 个变体恰好不是否定句时，题面就给出了**假指令**——学习者照「写成否定」去写，
会被判错；而正确答案（`It is too heavy for me.`）从指令里推不出来。

这两课的 `noteZh` 其实**描述正确**（L66「搬不动就说 for me——说明对谁来说太重」、
L89「换个词就换了心情——架子不变」），说明内容没问题，**错的是那个 label 与由它拼出的题面**。

只有 2 / 410（否定 205 + 疑问 205）不成立，其余都恰好成立——所以这不是「到处都错」，
而是**枚举太窄**：只有三种 label，装不下「换词 / 加成分」这类变体。

**建议**：加第四种 label（名称由内容作者定，如「换说法」），出题侧对三种标准 label 沿用
现有题面、对第四种改用中性措辞（如「这句话还能换个说法——照提示写出来」，
把具体变化放进 `noteZh`）。**不改数据模型的话，至少把这两课的变体改成真否定句。**

### 6.2 `clozeAnswerVisible`（1 条）——真缺陷，但基数已锁在 1

`boost-lesson-98-while-t1-cloze-variants-1`：
```
clozeText = "While I was reading, he ___ not sleeping."
answer    = "was"
```
答案词 `was` 在题面前半句里就写着（`While I **was** reading`），可以照抄。
`BASELINE.visibleAnswer` 已等于实际值 1，属已知且已封顶。修法：挖空时避开与题面重复的词形。

### 6.3 `weakDistractors`（65 条）——性质混杂，至少部分是误报，**不建议直接动手**

抽样 3 条：

| 题 | 答案 / 选项 | 判断 |
|---|---|---|
| `lesson-01-am` | `tired` / `friend`,`gift`,`none` | 确实弱：与 `I am ___.` 搭配无关，一眼排除 |
| `lesson-04-want` | `want` / `want`,`wanting`,`wanted`,`wants` | **疑似误报**：该课的点正是 `don't` 后接动词原形，四个同词形式**恰是正确干扰项**（与 §四 `ned` 修好后 L161 的选项同型） |
| `lesson-08-my` | `book` / `warm`,`hours`,`keeps` | 偏弱：同课其它词，尚可用 |

**这与 §4.5 的 `needing` 是同一类问题**：用形状判「弱」而不看这一课要考什么。
建议先按上面这种方式抽样 20 条人工判一遍，再决定这个检查项的判据要不要改——
**在那之前不要为了消数字去重做干扰项**（65 条重做成本高，且可能把对的改坏）。
