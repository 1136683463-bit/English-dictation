# 数据审计 · 第二十四批（方向 A「也」的两张脸 vs 方向 B 让步与条件链）

> 审计员：数析｜日期：2026-09-20｜审计对象：批二十四 3 课选题（**两条竞争方向，本报告只给数据依据，不预设立场**）
> 数据基线：`grammarLessons` **144 课 / 27,264 行**；`huntCases` **153 案 / 8,445 行**；`LESSON_GROUPS` **23 季**；`huntCases` 罪名实例 **586 处**
> 复现口径：**每一个数字都给出可复跑命令**；所有 `grep` 一律带 `-w`（词边界）＋必要时大小写敏感，**已规避「`grep though` 误匹配 `Although`」的子串陷阱**（见 §0.2）
> 临时脚本：全部为 `src/services/__tmp_*.test.ts`，**已跑完删除**（`ls src/services/__tmp*` → no matches found）

---

## §0 复现台（先读这一段，后面所有小节共用）

### 0.1 基础计数与定位脚本

```bash
# ① 词频（词边界；GL=grammarLessons.ts，HC=huntCases.ts）
for w in too either also though unless although; do printf "%-9s GL=%s HC=%s\n" "$w" \
  "$(grep -o -i -w "$w" src/data/grammarLessons.ts|wc -l|tr -d ' ')" \
  "$(grep -o -i -w "$w" src/data/huntCases.ts|wc -l|tr -d ' ')"; done
# ② 子串口径（证明「连子串都没有」）
for w in either neither unless "in case" "in spite of" despite also; do printf "%-13s GL=%s HC=%s\n" "$w" \
  "$(grep -o -i "$w" src/data/grammarLessons.ts|wc -l|tr -d ' ')" \
  "$(grep -o -i "$w" src/data/huntCases.ts|wc -l|tr -d ' ')"; done
# ③ 「行号＋课号」定位器：node /tmp/da24/bucket.mjs '\btoo\b' GL   （GL|HC 切文件）
```

`/tmp/da24/bucket.mjs` 原理（可重建）：先收集全部 `id: "lesson-NNN-xxx"` 与 `id: "hunt-xxx"` 的行号，对每个命中行取「最近的前置 id」作为归属，输出 `行号<TAB>课号<TAB>逐字`；TOTAL 打到 stderr。`/tmp/da24/hcnum.mjs` 同原理但额外收集 `number:`／`title:`，把 HC 命中行映射到**案号**。

### 0.2 子串误匹配陷阱的实测证据（本次重点规避项）

```bash
$ grep -o -i -w though src/data/grammarLessons.ts | wc -l     # → 3
$ grep -o -i though   src/data/grammarLessons.ts | wc -l     # → 177  ← 其中 174 处是 Although
$ grep -o -i -w although src/data/grammarLessons.ts | wc -l  # → 174
```

**结论：`though` 的「无边界口径 177」与「有边界口径 3」相差 174——差额 100% 来自 `Although`。** 本报告后续凡涉及 `though` 一律使用 `-w` 或大小写严格匹配（`grep -n "Though"`，大写 T），并在 §2.2 逐处列出这 3 行本身。

---

## §1 方向 A 零件盘点（`too` 肯定句 / `either` 否定句）

### 1.1 四个候选词的**真实词次**（词边界口径）

| 词 | GL 词次 | GL 命中行数 | HC 词次 | HC 命中行数 | 备注 |
|---|---|---|---|---|---|
| `too` | **110** | **92** | **13** | 12 | HC 的 13 ＝ **8 处案件 `tokens` 实体词** ＋ 5 处 `explanation`／`correction` 讲解文本 |
| `either` | **0** | 0 | **0** | 0 | **连子串都是 0**（见 1.1.1） |
| `also` | **0** | 0 | **2** | 2 | GL 连子串都是 0；HC 2 处均为 `tokens` 实体词（案 #31／#33） |
| `as well` | **0** | 0 | **0** | 0 | 双词短语，两文件子串全 0 |

复跑命令：

```bash
grep -o -i -w too    src/data/grammarLessons.ts | wc -l   # 110
grep -n  -i -w too   src/data/grammarLessons.ts | wc -l   #  92
grep -o -i -w too    src/data/huntCases.ts      | wc -l   #  13
grep -o -i -w either src/data/grammarLessons.ts src/data/huntCases.ts | wc -l   # 0
grep -o -i -w also   src/data/grammarLessons.ts src/data/huntCases.ts | wc -l   # 2（全在 HC）
grep -o -i "as well" src/data/grammarLessons.ts src/data/huntCases.ts | wc -l   # 0
```

#### 1.1.1 `either`／`as well`／`also` 的「零」是怎么验的（三层口径）

```bash
grep -o -i -w either src/data/grammarLessons.ts src/data/huntCases.ts   # 层1 词边界：空
grep -rni "either"    src/data/grammarLessons.ts src/data/huntCases.ts # 层2 子串：空
grep -rn  "either"    src/data/                                                # 层3 全 src/data：0
```

**结论：`either` 零词次、零子串、零种子**——**纯造词**（与批二十一 `'ll`＝0、批二十二 §7 `have sth done` 七词全 0 同类）。**瑞思主张「只须造 1 词（`either`），`too` 已在库」——`too` 一端的成立度见 1.2.3：`too` 在库 110 次里 `也` 义只有 8 处实体句，且无一处是任何课的主题。**

### 1.2 `too` 的**逐处**义项切分（`太` vs `也`）

分类脚本 `/tmp/da24/tooclass.mjs`（判定规则：`too` 后紧跟形容词 → `太`；`too` 处于**引号内英文串的句尾**（后随 `.!?,;` 或 `"` 收尾）→ `也`；其余为 `meta`＝中文讲解/meta 行）：

```bash
node /tmp/da24/tooclass.mjs     # 逐行输出：行号 / 课号 / 义项 / 逐字
```

**实测分类统计（92 命中行）：`太` 55 行 ／ `也` 实体句 8 行 ／ meta 与中文讲解 29 行。**

#### 1.2.1 `也` 义的 **8 处实体句**（全部逐字，行号可核）

| # | 行号 | 课号 | 逐字（英文原文） | 位置类型 |
|---|---|---|---|---|
| 1 | `:1974` | `lesson-11-plural` | `Two? I want one too!` | `dialogue` npc 行 |
| 2 | `:4537` | `lesson-25-third-person` | `Does he play sports too?` | `dialogue` npc 行 |
| 3 | `:7947–7949` | `lesson-43-swimming-fun` | `Drawing is fun too.` | **`guided.arrange` tokens/answer/explain**（唯一进「练习」的一处） |
| 4 | `:9347` | `lesson-51-plural` | `The desks were cleaned too.` | `examples` |
| 5 | `:9402` | `lesson-51-plural` | `The desks were cleaned too.` | `sceneSwings`（与 4 同句） |
| 6 | `:10106` | `lesson-55-ordinal` | `Tom and Amy are on the board, too.` | `dialogue` npc 行 |
| 7 | `:18251` | `lesson-98-while` | `Was he reading, too?` | `dialogue` npc 行 |
| 8 | `:12241` | `lesson-66-too-to` | `I like tea too`（在**中文讲解串内**，非独立英文句） | `deepDive.paragraphs[1]` 引例 |

**关键判定 1：`也` 义 8 处实体句里，6 处在 `dialogue`／`examples`／`sceneSwings`（NPC 旁白位），只有 1 处（`:7947` `Drawing is fun too.`）进了 `guided` 练习 tokens——而它不是 L43 的目标句（L43 目标是 `Swimming is fun.`）。**
**关键判定 2：`也` 义从未作为任何课的 `grammarLabel`／`oneLineRule`／`targetSentence`**（复跑：`grep -n "grammarLabel:" src/data/grammarLessons.ts | grep -i "也\|too\|either"` → 仅 `:12161` `太…了装不下 · too…to`，是**太**义）。

#### 1.2.2 **风险项核实：`too` 的两种义相互撞吗？**

- `太` 义：55 行，**全部集中在 L66／L71 两课**（`too`+形容词，词前位）。
- `也` 义：8 行，**分散在 L11／L25／L43／L51／L55／L98**（句尾位）。
- **两义在「课程」维度零重叠**：L66 与 L71 是 `太` 义的主场（`太` 55 行全部落在这两课）；`也` 义的 8 处**无一落在 L66／L71**。
- **但 L66 自己已经把两义并置在首屏**——见 1.3。

### 1.3 L66 逐字（`lesson-66-too-to`，行号 `:12158–12344`）

```bash
sed -n '12158,12344p' src/data/grammarLessons.ts
```

**三个首屏字段逐字：** `:12161` `grammarLabel: "太…了装不下 · too…to"`；`:12174` `oneLineRule: "说「太…了（所以）不能…」用 too + 词 + to + 动作：too heavy to carry——一条句子装中文两句。"`；`:12169` `targetSentence: "It is too heavy to carry."`

**`deepDive` 全文（4 段，`:12237–12244`）——本批方向 A 的核心冲突证据：**

```
:12238   title: "too 的两个身份"
:12240   [0] "too 今天站的位子是「太」：站在词前面——too heavy、too hot、too dark。…"
:12241   [1] "too 还有一个老身份「也」：站在句子尾巴上——I like tea too（我也喜欢茶）。
             两个身份看站位：句尾是「也」，词前是「太」。"
:12242   [2] "为什么不用 very？very heavy 只说「很重」，话说到这儿就停了；too heavy to carry
             带上「拿不动」…"
:12243   [3] "回头看看第 32 课：外婆喊 Close the door，补了一句 The wind is too strong…"
```

**`summary` 逐字（`:12247–12253`）：** `rule: "太…了装不下：too + 词 + to + 动作（too heavy to carry）——一条句子装中文两句。"`；`points` 三条为 `"It is too heavy to carry. —— 太…了（所以）不能…"`／`"The wind is too strong. → too strong to go out —— 种子转正"`／`"too 两身份：词前是「太」、句尾是「也」"`。

**判定①：`太`/`也` 是否值得切开？——数据说「值得」，但切法不能是「再教一次 `too`」。**
理由（量化）：
1. `也` 义在库里的 8 处实体句，**0 处进入任何课的 `targetSentence`／`grammarLabel`／`oneLineRule`**；也就是说「`也` 义」从来没有过「课程位」。
2. 但 L66 的 `deepDive` **已经用整段把「`也` 义」定性完毕**（`:12241` 逐字给出 `I like tea too` 并给出口诀「句尾是『也』、词前是『太』」），`summary.points` 第三条 `:12252` **再复述一次**。
3. 因此若方向 A 的 L145 目标是 `too`（也义），**首屏将与 L66 的深挖卡重复**——零基础用户会在两课看到同一句话「句尾是『也』、词前是『太』」。这是**批二十二「although 立岗」可用的位（L139 是 although 的第一次课程位）在 `too` 上不成立**：`too`（也义）已被 L66 认领过讲解。

**判定②：怎么切？——数据给三种可选位（按与 L66 的重复度从低到高）**

| 切法 | 数据依据 | 与 L66 重复度 |
|---|---|---|
| **A1：L145 只教 `either`（否定句的「也」），`too`（也义）作为「正面已会」对照出现** | `either` **全库 0** → 纯新增、零覆盖冲突；`too`（也义）已有 8 处实体句可当垫子（`Two? I want one too!` `:1974` 等） | **低**——L66 只讲了 `too`（也），没讲过 `either`（`:12241` 逐字只提 `I like tea too`，全段无 `either`） |
| A2：L145「`too` 与 `either` 排一行」（两面同课立岗） | `too` 句尾位有 8 处垫子；`either` 需新造 | **中**——L66 已给 `too`（也）的口诀，重复度高 |
| A3：先教 `either`、把 `also` ／ `as well` 也拉进来 | **`also` GL 0／HC 2、`as well` 两文件全 0**——两词都是「造词课」，本批 3 课装不下三词 | 低但**份量超载** |

**登记风险：若走 A2／A3，必须在 L145 首屏显式写「L66 那张深挖卡讲过的 `too` 也义，今天从**否定面**翻过来」——否则构成对 L66 `deepDive` 的**无差异重复**（本项目守门测试不查这个维度，属人工红线）。**

### 1.4 场景零件（「我也喜欢茶」一句话所需的词）逐个词次

```bash
/tmp/da24/words.sh tea coffee music like likes dance sing song milk book film
# 或逐条：grep -o -i -w tea src/data/grammarLessons.ts | wc -l
```

| 词 | GL | HC | 词 | GL | HC |
|---|---|---|---|---|---|
| `tea` | **119** | 6 | `milk` | 150 | 22 |
| `coffee` | **25** | 3 | `apple` | 52 | 19 |
| `music` | **47** | 3 | `book` | 434 | 37 |
| `like` | **361** | 24 | `film` | 28 | 4 |
| `likes` | **54** | 17 | `school` | 218 | 22 |
| `dance` | 6 | 3 | `student` | 10 | 2 |
| `sing` | 28 | 7 | `teacher` | 106 | 14 |
| `song` | 2 | 2 | `friend` | 44 | 10 |

**判定：方向 A 的场景零件**全部是**超高密度词**（`tea` 119、`music` 47、`coffee` 25、`like` 361）。**「我也喜欢茶」这句话的除 `too`／`either` 外的每个零件都已饱和**——即方向 A 的**唯一新增承载物就是 `either` 一个词**（与瑞思主张一致：本批零件需求极小）。
**副产：`sport` GL 0／HC 0**（`Does he play sports too?` `:4537` 里的 `sports` 是复数形，`grep -o -i -w sport` 命中 0 是因为词边界；**该句若要复用需注意 `sports` 计数口径**）。

---

## §2 方向 B 零件盘点（`though` / `even though` / `unless` / `in case`）

### 2.1 六个候选表达的**真实词次**

| 表达 | GL（词边界） | HC（词边界） | 备注 |
|---|---|---|---|
| `though` | **3** | **2** | **排除 `Although` 后**（见 §0.2：无边界口径 177 中有 174 处是 `Although`） |
| `even though` | **0** | **0** | 双词短语 |
| `unless` | **0** | **0** | 连子串 0 |
| `in case` | **0** | **0** | 连子串 0 |
| `in spite of` | **0** | **0** | 连子串 0 |
| `despite` | **0** | **0** | 连子串 0 |
| （对照）`although` | **174** | **14** | 批二十二已教，占满 L139／L140／L141 |

```bash
for w in though unless "even though" "in case" "in spite of" despite although; do
  printf "%-14s GL=%s HC=%s\n" "$w" \
    "$(grep -o -i -w "$w" src/data/grammarLessons.ts | wc -l | tr -d ' ')" \
    "$(grep -o -i -w "$w" src/data/huntCases.ts | wc -l | tr -d ' ')"
done
# 双词短语请改用无边界：grep -c -i "even though" / "in case"
```

**判定：方向 B 的四个候选中，`even though`／`unless`／`in case` 三个是「连子串都是 0」的纯造词；`though` 只有 5 处总量（GL 3 ＋ HC 2），而这 5 处的性质见 2.2——全部是「引文／旧判例」性质，不是「已教」。**

### 2.2 **`though` 的逐处定位**（本批裁决「与 L139/L141 是否冲突」的关键证据）

**GL 全部 3 处**（`node /tmp/da24/bucket.mjs '\bthough\b' GL`）：

```
26189  lesson-139-although   "第 12 课你判过一句「Though it was cold, but we went out.」——当时你找出了那个多余的 but，
                              把它划掉了。今天它转正了：这个「虽然」怎么说、怎么说才不错，今天正经学。"
26190  lesson-139-although   "记住那条判例的重点：错的是多出来的 but，不是 Though 本身。「虽然天冷」那半句是好的，
                              问题出在后面又补了一个「但是」。中文成对说，英语只留一个。"
26577  lesson-141-close-22   "这两张脸还有一个来头：第 12 课你在案件里判过一句「Though it was cold, but we went out.」，
                              当时你划掉了那个多余的 but。这一章就是那句话的正经课——错的是多出来的 but，不是「虽然」本身。"
```

**GL 侧的 3 处 100% 位于 `deepDive.paragraphs`**，且全部是**同一句引文**（`Though it was cold, but we went out.`）——**没有一处进入 `targetSentence`／`grammarLabel`／`oneLineRule`／`examples`／`practice`／`guided`。**

**HC 全部 2 处**（`node /tmp/da24/hcnum.mjs '\bthough\b'`）：

```
343  案#7  hunt-because-so  "Though"          ← tokens[10]
366  案#7  hunt-because-so  explanation: "同样的道理：Though 和 but 不能同时出现，留一个就够。"
```

案 #7 `hunt-because-so` 逐字（`:328–371`）：

```
tokens: ["Because","I","was","tired,","so","I","went","to","bed","early.",
         "Though","it","was","cold,","but","we","went","out."]
errors: [ {tokenIndex: 4,  tag: "run_on", original: "so",  correction: "去掉 so",
           explanation: "中文的「因为…所以…」在英语里只能留一个。..."},
          {tokenIndex: 14, tag: "run_on", original: "but", correction: "去掉 but",
           explanation: "同样的道理：Though 和 but 不能同时出现，留一个就够。"} ]
```

**关键：案 #7 的两个植错点 `tokenIndex` 分别是 `4`（`so`）与 `14`（`but`）——都不是 `10`（`Though`）。`Though` 在本案里是「陷阱词」（故意写成看着可疑但其实没错），`tag` 里没有针对 `though` 本身的错误。**

### 2.3 **逐字读 L139 与 L141 的 `deepDive` 全文**

#### L139 `lesson-139-although` 的 `deepDive`（`:26187–26193`，4 段）

```bash
sed -n '26187,26193p' src/data/grammarLessons.ts
```

```
:26188   title: "这一句，案件里你判过"
:26189 [0] "第 12 课你判过一句「Though it was cold, but we went out.」——当时你找出了那个多余的 but，
            把它划掉了。今天它转正了：这个「虽然」怎么说、怎么说才不错，今天正经学。"
:26190 [1] "记住那条判例的重点：错的是多出来的 but，不是 Though 本身。「虽然天冷」那半句是好的，
            问题出在后面又补了一个「但是」。中文成对说，英语只留一个。"
:26191 [2] "Although 的位置很特别：它站最前面，领着一整个小句子——Although it is raining（虽然下着雨）…
            第 19 课的 but 不一样：but 站中间，把两半接起来。下一课把这两张脸摆一起看。"
:26192 [3] "场景也是接着第 109 课那场雨的：那回小美在屋檐下一直等，等到雨停（I waited until the rain stopped.）…"
```

#### L141 `lesson-141-close-22` 的 `deepDive`（`:26575–26580`，4 段）

```
:26576   title: "这一页上有什么"
:26577 [0] "这一章学了两张脸。第 139 课的 Although 站最前面…；第 140 课的 but 站中间…"
:26578 [1] "这两张脸还有一个来头：第 12 课你在案件里判过一句「Though it was cold, but we went out.」，
            当时你划掉了那个多余的 but。这一章就是那句话的正经课——错的是多出来的 but，不是「虽然」本身。"
:26579 [2] "规矩只有一条：中文的「虽然…但是…」成对说，英语只留一个。前面用了 Although，后面就不带 but…"
:26580 [3] "两张脸排一行念一遍：Although it is raining, I will go out.／It is raining, but I will go out.…"
```

#### **冲突判定（本批最关键的一条）**

**判定：L139／L141 对 `though` 的定性是「旧判例的引文」，不是「已教」——但这个定性有一个真实的「误读面」。**

1. **两处 `deepDive` 都把 `Though` 关在引号内**（`:26189`、`:26577` 逐字为「第 12 课你判过一句**「Though it was cold, but we went out.」**」）——`Though` 是被引句的一部分，是**案 #7 的原文**（案 #7 `tokens[10]` ＝ `"Though"`），不是 L139／L141 自己写的教学句。
2. **两处都显式把「错」定位到 `but`**：`:26190` 逐字「**错的是多出来的 `but`，不是 `Though` 本身**」；`:26577` 逐字「**错的是多出来的 `but`，不是「虽然」本身**」→ 这是「`though` 无罪」的宣示。
3. **但 `:26189` 有一句可被读成「已教」**：「**今天它转正了**：这个「虽然」怎么说、怎么说才不错，**今天正经学**。」——「它」的先行词是「第 12 课判过的那句『虽然天冷…』」，而 L139 教的是 `Although`。逐字核到底：L139 `grammarLabel`（`:26110`）＝ `虽然 · although 站最前面`，`targetSentence`（`:26118`）＝ `Although it is raining, I will go out.`，`examples`（`:26125–26128`）四句**无一句用 `Though`**。→ **被「转正」的是「虽然这个意思」，不是「`though` 这个词」。**
4. **L141 `:26577` 更收口**：「**这一章就是那句话的正经课**」——「那句话」＝案 #7 引文，「正经课」＝L139–L141 三课。**若读成「`though` 的正经课已经上过了」，就会得出「`though` 旧判例、不是新课」的结论。** → 瑞思主张的**来源就是这个「可被读出的误读」，它不是文件的明文定性。**
5. **`though` 在全库的「已教度」＝ 0**：`grep -n "grammarLabel:" src/data/grammarLessons.ts | grep -i though` → **0**；`node /tmp/da24/bucket.mjs '\bthough\b' GL` → 3 处**全在 `deepDive.paragraphs`**；`though` 从未出现在任何 `targetSentence`；GL 的 3 处中 **0 处**是 L139／L141 自己造的英文教学句。

**结论（给裁决用）：**
> **L139／L141 没有把 `though` 定性为「已教」，而是定性为「案 #7 引文里的一个词，且这个词本身没错」。但 `:26189`「今天它转正了……今天正经学」与 `:26577`「这一章就是那句话的正经课」两句，在逐字层面确实可被读成「`though` 已被 L139–L141 处理过」。→ 瑞思的「冲突」主张有文本依据，但依据是两句可误读的表述，不是明文定性。**
>
> **实务判定：方向 B 开新课教 `though` 与 L139／L141 不构成「重复教学」（那三课教的是 `although`／`but`），但构成「引文话术撞车」——新 L145 若也讲「第 12 课那句」，就是第三、第四次讲同一判例。必须显式分工：L139/L141 讲「Although 与 but 两张脸」，L145 讲「案 #7 里那个被引用的 `Though` 词本身」，并在 L145 首屏承认「这个词你在第 12 课案件里见过、在第 139／141 深挖里被引过」。**

### 2.4 场景零件（让步链／条件链一句话所需的词）

```bash
/tmp/da24/words.sh rain raining umbrella cold warm stay home wait carry tired late early sun sunny stop
```

| 词 | GL | HC | 词 | GL | HC |
|---|---|---|---|---|---|
| `rain` | **105** | 21 | `carry` | 100 | 8 |
| `raining` | **253** | 28 | `tired` | **155** | 18 |
| `umbrella` | **60** | 14 | `late` | 79 | 15 |
| `cold` | **287** | 16 | `early` | 257 | 18 |
| `warm` | **11** | **0** | `sun` | 7 | 0 |
| `stay` | **57** | 7 | `sunny` | **91** | 12 |
| `home` | **109** | 42 | `stop` | **8** | 6 |
| `wait` | **75** | 8 | | | |

**判定：方向 B 的场景零件同样饱和**（`raining` 253、`cold` 287、`umbrella` 60、`tired` 155）。**L139 已铺好的「雨天」场景（`:26192` 明写接着 L109 那场雨）可直接复用**——这是方向 B 的**正向零件证据**：`Although it is raining, I will go out.` 与 `it was cold` 两个场景骨架在库内的零件密度极高。
**反向零件证据：`warm` GL 11／HC 0、`sun` GL 7／HC 0**——若方向 B 的 `even though` 要写「虽然天暖」，`warm` 是薄底座（11 处）；`cold` 是厚底座（287 处）。**建议场景选 `cold` 不选 `warm`。**

---

## §3 「先考后教」倒挂核查（两个方向都做）

**先例（本项目已有两次，均已被后续批「补教」闭环）：**
- 案 #16/#17 考 `excited` → **L113 补教**。逐字证据 `src/data/grammarLessons.ts:21153`：「**你在案件里已经见过这张脸了：She was excited about it.（她为这事很兴奋）——当时你修的是 excite 忘了穿 -ed 外衣。今天正式认领：-ed 就是「感到」。**」案 #16 `hunt-white-cat` `tokens[8]` ＝ `"excite"`，`errors[1]` ＝ `verb_form excite→excited`。
- 案 #7 考 `Though...but` → **L139 补教**（`:26189` 逐字「今天它转正了」）。

**核查脚本**：把 HC 每案的 `tokens` 与 `errors[].tokenIndex` 与 GL 的 `grammarLabel`／`targetSentence`／`examples`／`practice` 做交叉（本次用临时 vitest 全量导出 HC 后离线比对）：

```bash
# 导出（临时 vitest，跑完即删）
#   fs.writeFileSync("/tmp/da24/cases.json", JSON.stringify(huntCases.map(...)))
# 比对：目标词所在的 token 是否属于 errors[].tokenIndex
node -e "const c=require('/tmp/da24/cases.json'); ..."
```

### 3.1 方向 A

| 案件 | 行号 | 词 | token 下标 | 该下标是否植错点？ | GL 是否教过该结构？ |
|---|---|---|---|---|---|
| 案#13 `hunt-mom-note` | `:600` | `too.` | **21** | **否**（errors ＝ `1`／`8`／`12`） | **否**（`too` 也义无课程位） |
| 案#14 `hunt-school-show` | `:648` | `too.` | **12** | **否**（errors ＝ `3`／`11`／`13`） | 否 |
| 案#15 `hunt-weekend-plan` | `:702` | `too.` | **19** | **否**（errors ＝ `6`／`10`／`18`） | 否 |
| 案#29 `hunt-homework-note` | `:1650` | `too` | **19** | **否**（errors ＝ `11`／`16`／`27`／`29`） | 否 |
| 案#36 `hunt-question-words` | `:2258` | `too.` | **26** | **否**（errors ＝ `3`／`16`／`21`） | 否 |
| 案#53 `hunt-shop-note` | `:3391` | `too.` | **18** | **否**（errors ＝ `4`／`6`／`9`／`16`） | 否 |
| 案#59 `hunt-broken-window` | `:3768` | `too.` | **20**（末位） | **否**（errors ＝ `6`／`7`／`13`／`17`） | 否 |
| 案#60 `hunt-clean-classroom` | `:3822` | `too.` | **11** | **否**（errors ＝ `0`／`5`／`8`／`15`） | 否 |
| 案#31 `hunt-lost-key` | `:1831` | `also` | **33** | **否**（errors ＝ `5`／`17`／`21`／`34`） | **否**（`also` GL 0） |
| 案#33 `hunt-weekend-note` | `:2021` | `also` | **41** | **否**（errors ＝ `8`／`13`／`26`／`34`） | 否 |

**方向 A 结论：`too`（也义）已在 8 个案件里作为「句尾词／陷阱词」出现，`also` 在 2 个案件里出现；`either` 0 案。**
- **「倒挂」严格定义**（考了错点却没教过该结构）在方向 A **不成立**：这 10 处**没有一处是植错点**（`tokenIndex` 全部不指向 `too`/`also`），它们是**故意留的「看着可疑但其实没错」的陷阱词**（见 `huntCases.ts:8–9` 头注）。
- **但「先见后教」的另一形态成立且量化明确**：`too`（也义）**已在 8 案里被「见过」**——若方向 A 开新课，**L145 须承认「这个词形你在案件里见过 8 次」**。**这是与 `excited` 先例同型的处理路径**（`excited` 先在案 #16/#17 被「见过」，再在 L113 补教，且 L113 首屏显式承认 `:21153`）。

### 3.2 方向 B

| 案件 | 行号 | 词 | token 下标 | 是否植错点？ | GL 是否教过？ | 判定 |
|---|---|---|---|---|---|---|
| **案#7 `hunt-because-so`** | `:343` | `Though` | **10** | **否**（errors ＝ `4`／`14`，均 `run_on`，指向 `so` 与 `but`） | **否**（GL 0 课程位） | **「考了 `Though+but` 并存，但 `though` 本身没教」** |
| （同案） | `:366` | `Though` | — | `explanation` 逐字「同样的道理：**Though 和 `but` 不能同时出现**，留一个就够」 | — | **讲解里点名了规则，但规则对象是「多余的 `but`」** |

**方向 B 结论：`though` 只在 1 个案件（案 #7）出现，`tokenIndex` 不指向它，它在案里是「陷阱词」。但案 #7 的 `explanation` `:366` 明文把 `Though` 写进规则**——这是全库**唯一一处把 `though` 当规则主体讲写的文本**（GL 3 处全是引文、HC 2 处，共 5 处，性质已全数列于 §2.2）。
→ **`unless`／`in case`／`even though` 在 HC 与 GL 均 0 案 0 处——「倒挂」不适用（连「先见」都没有）。**

### 3.3 「倒挂」台账（本批口径）

| 结构 | HC 出现案数 | HC 植错点指向该词的案数 | GL 课程位 | 倒挂 |
|---|---|---|---|---|
| `too`（也义） | **8** | **0** | **0** | **否**（陷阱词，非考点） |
| `also` | **2** | **0** | **0** | **否**（同上） |
| `either` / `unless` / `in case` | **0** | 0 | 0 | 不适用 |
| `though` | **1** | **0** | **0** | **否**（陷阱词），但 `explanation:366` 把它写进规则 |

**⚠️ 与先例的差别（必须登记）：`excited` 与 `Though...but` 的先例里，被考的词是植错点本身**（案 #16 `:8` `excite→excited` 是 `verb_form` 错；案 #7 的 `but` 是 `run_on` 错、`Though` 是被引的规则主体）。**本批两方向的目标词没有一个是植错点——本批不存在「严格意义的先考后教倒挂」。** 这是本批与批二十二的一条实质差异：**裁决时应避免把「陷阱词出现过」当作「倒挂」而虚增紧迫性。**

---

## §4 cloze 落点实跑（两个方向都做）

### 4.1 真种子算法复刻（两条链的源码逐字）

**`grammarAmbushService.pickClozeWord`（`:195–212`）**——**无随机、确定性取首个命中**：

```js
const words = sentence.split(/\s+/).filter(Boolean);
const cleaned = words.map((w) => w.replace(/[.,!?;:]$/g, ""));
let index = cleaned.findIndex((w) => GRAMMAR_WORDS.test(w));          // ① 语法承载词（首个命中）
if (index < 0) index = cleaned.findIndex((w) => w.length >= 3 && !CLOZE_STOP_WORDS.has(w.toLowerCase()) && /^[a-z']+$/i.test(w)); // ② 实词
if (index < 0) index = Math.min(1, words.length - 1);                  // ③ 第 2 词
```

**`GRAMMAR_WORDS`（`:160–187`）词表里与本次相关的关键条目**：含 `too`（`:179`，与 `how/often/long/much/many/enough` 同组）；**不含 `either`／`though`／`although`／`unless`／`also`**。

**`grammarBoostService.buildCloze`（`:261–395`）**——**种子化随机**：

```js
const keywordIndexes = (sentence) => { /* 长度 ≥3 且不在 FUNCTION_WORDS 里的词的下标 */ };
const random = mulberry32(hashText(`cloze:${seed}`));
const pickedIndex = indexes[Math.floor(random() * indexes.length)];
```

**`keywordIndexes`／`FUNCTION_WORDS`（`:244–258`）**：`too` **不在** `FUNCTION_WORDS`，长度 3 ≥ 3 → **`too` 是合法空位候选**；`either`（6）／`though`（6）／`unless`（6）同样**都是合法候选**；`also`（4）同样是。

### 4.2 全库实测：144 课真的跑一遍（不是抽样）

临时 vitest（已删）对 **全部 144 课 × tier1** 调 `buildBoostItems(lessonId, 1)`，并对 **全部 144 课** 调 `buildRevisitQuiz(lessonId)`，统计空位答案：

```
=== 目标词落进 boost 空位（全 144 课 tier1）===
lesson-66-too-to  answer="too"  clozeText="It is ___ heavy for me."
（其余目标词：0 次）

=== 目标词落进 ambush 空位（全 144 课）===
(none)

=== boost 空位词频 Top 20 ===
not:16, don't:11, didn't:4, was:4, used:4, forward:4, wasn't:3, good:3, want:2, cold:2,
book:2, drink:2, coffee:2, apples:2, tired:2, wears:2, reading:2, weren't:2, window:2, birthday:2

=== ambush 空位词频 Top 15 ===
is:58, do:26, are:23, was:18, does:16, have:13, am:12, did:12, were:10, will:9, has:5,
want:4, can:4, should:4, looks:4
```

**三条硬结论：**
1. **boost 侧：`too` 能被抽中**（唯一实例 `lesson-66-too-to`：`It is ___ heavy for me.`，答案 `too`，**且这是「太」义位**）。
2. **ambush 侧：`too`／`either`／`though`／`unless` 在全库 144 课的 `buildRevisitQuiz` 里 0 次成为空位**——因为 `pickClozeWord` 是**「取第一个 `GRAMMAR_WORDS` 命中」**：只要句中出现了任何 be 动词／助动词／情态／高频实词（`is`／`do`／`want`／`like`…），空位就被它们吃掉，**晚出现的 `too`／`either`／`though`／`unless` 永远轮不到**。**这是「结构性假友好」。**
3. **ambush 空位高度集中在 be／助动词**（`is` 58／`do` 26／`are` 23／`was` 18／`does` 16／`have` 13／`am` 12／`did` 12）——**占全部 ambush 空位的压倒多数**。方向 A／B 的目标词**都不在这个家族里**。

#### 4.2.1 ambush 侧「结构性假友好」的**基率量化**

```bash
node /tmp/da24/ambushbase.mjs
# 语料：GL 全文去重后的所有 `en:` / `targetSentence:` / `answer:` 英文串
```

实测输出：

```
unique sentences with a candidate word: 74
...of which ambush blanks the candidate word: 4
landing rate: 5.41%
（4 个命中全部是 "in"/"but"/"too heavy"/"too hot" 这类**首个命中**的情形）

[narrow four: too / either / though / unless]
sentences: 16, ambush lands on them: 2 (12.50%)
```

**即：含目标词的句子里，ambush 只有 12.5% 会把目标词挖空；剩下 87.5% 会把空位给句首的 be／助动词。** 且 2 个命中**都是 `太` 义**（`too heavy` / `too hot`，位于句首区），`也` 义的 `too`（句尾）**结构性不可能命中**。

### 4.3 逐句落点（真引擎 `buildBoostItems` ＋ `buildRevisitQuiz`，新课程用 L144 作载体）

**方法**：临时 vitest 把候选句注入 `lesson-144-close-23` 的各内容槽（`variants`／`sceneSwings`／`practice`／`examples`／`dialogue`／`recall`），清空其余槽以避免他句污染池，跑 `round ∈ {0,1,2,3,4,5}`，记录 `clozeText` 里 `___` 的下标与答案。**这是真引擎调用，不是复刻。**

#### 4.3.1 方向 A 候选句（ambush ＝ `pickClozeWord`，boost ＝ 6 轮实测）

| 候选句 | 词数 | **ambush 落点** | **boost 落点分布**（每个槽 × 6 轮，稳定不随 round 变） |
|---|---|---|---|
| `I like tea too.` | 4 | idx **1** `a=like`（**吃在 `like`**） | `variants`→**3 `too`**；`sceneSwings`→**3 `too`**；`dialogue`→**3 `too`**；`practice`→2 `tea`；`examples`→1 `like`；`recall`→2 `tea` |
| `I like tea, too.` | 4 | idx **1** `a=like` | 同上（逗号不影响） |
| `She likes music too.` | 4 | idx **1** `a=likes` | `variants`/`sceneSwings`/`dialogue`→**3 `too`**；`practice`→2 `music`；`examples`→1 `likes`；`recall`→2 `music` |
| `I want to go too.` | 5 | idx **1** `a=want` | `variants`/`sceneSwings`/`dialogue`/`recall`→**4 `too`**；`practice`/`examples`→1 `want` |
| `He is a student too.` | 5 | idx **1** `a=is` | `variants`/`sceneSwings`/`dialogue`/`recall`→**4 `too`**；`practice`/`examples`→3 `student` |
| `I don't like coffee either.` | 5 | idx **1** `a=don't` | `variants`→**4 `either`**；`dialogue`→**4 `either`**；`sceneSwings`→3 `coffee`；`practice`→2 `like`；`examples`→1 `don't` |
| `She doesn't like coffee either.` | 5 | idx **1**（`doesn't`） | 同构（`variants`/`dialogue` 落 `either`） |
| `I am not tired either.` | 5 | idx **1** `a=am` | `variants` 落 `tired`／`either`（见 4.3.3 分布） |

**种子扫描（162 个真实 sourceRef 种子 × 三课编排）：**

```bash
node /tmp/da24/repl.mjs      # 内含 boostCloze 与 pickClozeWord 的逐字复刻＋162 种子扫描
```

```
"I like tea too."                 ambush=1:like    boost seeds(162)= 2:tea×69  3:too×53  1:like×40
"I don't like coffee either."     ambush=1:don't   boost seeds(162)= 3:coffee×50 2:like×48 4:either×40 1:don't×24
"She likes music too."            ambush=1:likes   boost seeds(162)= 2:music×69 3:too×53  1:likes×40
"I want to go too."               ambush=1:want    boost seeds(162)= 4:too×90  1:want×72
"He is a student too."            ambush=1:is      boost seeds(162)= 4:too×90  3:student×72
"I am not tired either."          ambush=1:am      boost seeds(162)= 3:tired×69 4:either×53 2:not×40
```

**boost 侧落点分布的关键：`too` 落在 53/162 ≈ **32.7%**（4 词句）到 **90/162 ≈ 55.6%**（5 词句 `I want to go too.`）；`either` 落在 **40/162 ≈ 24.7%**（`I don't like coffee either.`）到 **53/162 ≈ 32.7%**。**

#### 4.3.2 方向 B 候选句

| 候选句 | 词数 | **ambush 落点** | **boost 落点分布**（162 种子） |
|---|---|---|---|
| `Although it is raining, I will go out.` | 8 | idx **2** `is` | `5:will`×51, `3:raining`×43, `7:out`×34, `0:Although`×34 |
| `Even though it was raining, we went out.` | 8 | idx **3** `was` | `4:raining`×36, `3:was`×29, **`1:though`×27**, `6:went`×26, `7:out`×23, `0:Even`×21 |
| `I will go out even though it is raining.` | 9 | idx **1** `will` | `4:even`×49, `3:out`×31, **`5:though`×31**, `8:raining`×26, `1:will`×25 |
| `Unless it rains, I will go out.` | 7 | idx **4** `will` | `4:will`×51, **`2:rains`×43**, `6:out`×34, `0:Unless`×34 |
| `I will stay at home unless it stops raining.` | 9 | idx **1** `will` | **`5:unless`×36**, `4:home`×29, `2:stay`×27, `7:stops`×26, `8:raining`×23, `1:will`×21 |
| `I will take an umbrella in case it rains.` | 9 | idx **1** `will` | `4:umbrella`×49, `2:take`×31, **`6:case`×31**, `8:rains`×26, `1:will`×25 |
| `Take an umbrella in case it rains.` | 7 | idx **0** `Take` | **`4:case`×51**, `2:umbrella`×43, `6:rains`×34, `0:Take`×34 |
| `I will go out although it is raining.` | 8 | idx **1** `will` | **`4:although`×51**, `3:out`×43, `7:raining`×34, `1:will`×34 |

**方向 B 的 boost 侧**：`though` 以 **27/162 ≈ 16.7%**（`Even though...` 句）／**31/162 ≈ 19.1%**（`...even though...` 句）成为空位；`unless` 以 **36/162 ≈ 22.2%**；`in case` 的 `case` 以 **31–51/162 ≈ 19–31%**。**即方向 B 的考点词在 boost 侧「能被抽到」的比率显著低于方向 A 的 `too`（53–90/162），但均 > 0。**

#### 4.3.3 **关键判定：考点词能否成为空位？**

| 考点词 | boost 侧（tier1，真引擎 6 轮 + 162 种子） | ambush 侧（全库 144 课） | 判定 |
|---|---|---|---|
| `too`（也义，句尾位） | **能**（53/162 ≈ 32.7%；`variants`/`dialogue`/`sceneSwings` 槽位稳定命中 idx 3–4） | **不能**（`GRAMMAR_WORDS` 含 `too`，但**句首的 be／助动词先被吃掉**；实测 16 句含目标词的句子只有 2 句落在 `too`，且都是 `太` 义） | **半友好**：boost 友好、ambush 假友好 |
| `either` | **能**（40–53/162 ≈ 24.7–32.7%；`variants`/`dialogue` 槽稳定落 idx 4） | **不能**（`either` **根本不在 `GRAMMAR_WORDS`**；且句首必有 be／助动词） | **半友好** |
| `though` | **能**（27–31/162 ≈ 16.7–19.1%） | **不能**（不在词表；且句首 `Even`/`it` 先被吃） | **半友好** |
| `unless` | **能**（36/162 ≈ 22.2%） | **不能**（不在词表） | **半友好** |
| `in case` 的 `case` | **能**（31–51/162 ≈ 19–31%） | **不能** | **半友好**（且 `in case` 是**双词**，空位只能挖 `case`，`in` 会被 ambush 的停用词/长度规则排除——**「双词构件被单点挖空」是独立风险**） |

**登记（「假友好」清单，两方向共同）：**
> **ambush 侧对本批全部四个候选考点词（`too` 也义／`either`／`though`／`unless`）是「结构性假友好」——0/144 课能命中。** 原因有二且均已在源码中定位：① `pickClozeWord` 的 ① 分支是「首个 `GRAMMAR_WORDS` 命中」，句中若有任何 be／助动词必然先被吃掉（全库 ambush 空位 Top1 是 `is` 58 次）；② `either`／`though`／`unless` **不在 `GRAMMAR_WORDS` 词表内**（`:160–187`）。
> **影响**：方向 A／B 的新课在「关 2 复习」里**都不会练到自己的考点**（会练成 be 动词题）。**若要关 2 练考点，须改 `GRAMMAR_WORDS`（加 `either`／`though`／`unless` 并**把它们排到 be／助动词之前**或用「优先取最靠后的语法词」策略）——这属于**引擎改动**，不是数据改动。本批若不动引擎，**须在 PRD 里显式接受「关 2 复习不练本课考点」**。**

---

## §5 干扰项伪造词风险（`KNOWN_VERBS` ＋ 词干还原分支）

### 5.1 源码实读：分支的确切触发条件（`grammarBoostService.ts:326–378`）

```js
const lower = answer.toLowerCase();
const isContraction = /['’]/.test(answer);
const family = FUNCTION_FAMILIES.find((group) => group.includes(lower));
if (family) { /* ① 同族替换 */ }
if (!isContraction && !family) {                    // ← 只有「非缩略、非同族」才进 ②
  const KNOWN_VERBS = new Set([...]);               // :327–339
  const IRREGULAR_VERBS = new Set([...]);           // :343–348
  if (KNOWN_VERBS.has(lower) && !IRREGULAR_VERBS.has(lower)) {   // ← 双重门
    const base = lower.replace(/ies$/,"y").replace(/ing$/,"").replace(/ed$/,"").replace(/s$/,"");
    if (base && !IRREGULAR_VERBS.has(base) && !IRREGULAR_VERBS.has(lower)) {
      for (const suffix of ["s","ed","ing"]) {
        if (/[^aeiou]y$/.test(base)) push(`${base.slice(0,-1)}ies`);
        else if (/e$/.test(base))   push(`${base}d`);
        else                        push(`${base}${suffix}`);
      }
    }
  }
}
```

### 5.2 **实跑验证：四个目标词逐个走一遍该分支**

```bash
# 逐词代入 KNOWN_VERBS 与 IRREGULAR_VERBS（两表已逐字抄录于 /tmp/da24/pairs.mjs）
node -e "
const KV=new Set('go,goes,went,...,enjoy,enjoys,enjoyed'.split(','));   // 见源码 :327-339，逐字
const IR=new Set('go,went,have,has,had,do,does,did,...,sit,sat'.split(',')); // :343-348
for (const w of ['too','either','though','unless','also','although','in','case']) {
  console.log(w, 'KNOWN_VERBS='+KV.has(w), 'IRREGULAR='+IR.has(w), '→', (KV.has(w)&&!IR.has(w))?'进变形分支':'不进');
}"
```

| 目标词 | 在 `KNOWN_VERBS`？ | 在 `IRREGULAR_VERBS`？ | 进变形分支？ | 会产出伪词？ |
|---|---|---|---|---|
| `too` | **否** | 否 | **不进** | **否** |
| `either` | **否** | 否 | **不进** | **否** |
| `though` | **否** | 否 | **不进** | **否** |
| `unless` | **否** | 否 | **不进** | **否** |
| `also` | **否** | 否 | **不进** | **否** |
| `although` | **否** | 否 | **不进** | **否** |
| （对照）`in` | 否 | 否 | 不进（且在 `FUNCTION_FAMILIES` 的 `["in","on","at"]` 里） | 否 |
| （对照）`case` | **否** | 否 | **不进** | 否 |

**判定：本批四个候选考点词（`too`／`either`／`though`／`unless`）——以及 `also`／`although`——全部不在 `KNOWN_VERBS` 表内，因此**永不触发 `-s/-ed/-ing` 变形分支**，**不会产出 `tooed`／`eithers`／`thoughing`／`unlessed` 这类伪词。** 这一条**风险为 0**，是本次审计中最干净的一项。

### 5.3 但**全库扫出的伪词风险是实打实存在的**（与目标词无关，登记备查）

**方法**：全 144 课跑 `buildBoostItems(lessonId, 1)`，把每个 cloze 的 `clozeOptions` 与 `/usr/share/dict/words`（web2，235,976 词）对表：

```bash
# ① 导出全部选项（临时 vitest，输出 /tmp/da24/options.tsv）
# ② 对表
node -e "const fs=require('fs');const dict=new Set(fs.readFileSync('/usr/share/dict/words','utf8').split('\n')...); ..."
```

**实测：全库 boost cloze 共 310 个不重复选项，其中 42 个不在系统词典内。** 逐字抽样（＝**会在真机上出现在选项里的字符串**）：

| 伪词／非词 | 出现次数 | 被当作谁的干扰项 | 出处课 |
|---|---|---|---|
| `tao` | 1 | `nurse`（L02 `She is not a ___.`） | `lesson-02-is` |
| `lin` | 1 | `Close`（L32 `___ the door, please.`） | `lesson-32-imperative` |
| `sung` | 2 | `cold`／`new` | `lesson-06-it`, `lesson-116-has-got` |
| `to's` | 1 | （L141 `Two 'to's on one page!` 对话行泄入池） | `lesson-141-close-22` |
| `goodbye` | 1 | `reading` | `lesson-78-day-story` |
| `seen`／`done`／`said` | 各 1 | `good`／`soon`／`not` | L133／L144／L17 |
| `plays`／`isn't` | 5／5 | 各种 | 多课 |

**溯源（可复跑 `grep`）：**
- `tao` ← `:384` `{ sceneZh: "教室里，老师点名认识新同学", en: "You are Lin Tao.", zh: "你是林涛。" }` **人名 `Lin Tao` 被切成了两个词并当成了干扰项候选**（`courseVocabulary` 只过滤长度与字符，**不过滤专有名词**）。
- `lin` ← 同上。
- `to's` ← `:25938` `{ who: "npc", en: "Two 'to's on one page!", zh: "同桌凑过来看你的本子。" }`——**这条对话里的 `'to's` 进了词汇池**，产出的选项是**带撇号的 `to's`**（`courseVocabulary` 的 `^[a-z]+('[a-z]+)?$` 规则**恰好放行了它**）。
- `sung` ← `courseVocabulary` **不收 `-ed/-ing/-est/-ly` 结尾但收 `sung`**（不规则过去分词不在该后缀表里），于是 `sung` 作为「基础形」进了池。

**判定：伪造词风险在「本批四个目标词」上为 0；但在「全库既有题面」上有 42 个非词典串，其中 `tao`／`lin`／`to's` 是**明确的应剔除项**（人名与带撇号构词）。**建议（不属本批必做）：给 `courseVocabulary`（`:421–452`）加两条过滤——① 剔除首字母大写出现过的词（专名）；② 剔除含撇号的非缩略构词（`'to's` 这类）。**本批交付前须跑一次上面的对表脚本确认新句没新增伪词。**

---

## §6 复现取材头寸

### 6.1 全库 practice 答案的跨课复现（红线 ≤6 课）

**判据源码**（`src/data/grammarLessons.test.ts:163`）：

```ts
it("练习答案不得跨课高频复现（同一句最多出现在 6 课，当前最差为 6）", () => {
  // 归一化：小写 + 去标点 + 压空白；统计 practice[].answer 跨课出现次数；>6 即红
});
```

**实测分布（我用同口径脚本复算）：**

```
histogram (出现在几课 -> 这样的句子有几条):
  6 课: 1 条
  5 课: 6 条
  4 课: 6 条
  3 课: 30 条
  2 课: 58 条
  1 课: 348 条
总计：449 条不重复 practice 答案 / 614 个 practice 题位（144 课）
```

### 6.2 **已顶死 6 课（不可再引用）的句子清单**

```
"yesterday i went to the park"
  -> lesson-21-have-done, lesson-24-past-vs-perfect, lesson-93-used-to,
     lesson-95-was-doing, lesson-100-used-to-story, lesson-104-made-me
```

**⚠️ 红线状态：全库当前最差 ＝ 6，恰好压在门槛上。本批 3 课若任何一课把 `Yesterday I went to the park.` 放进 `practice[].answer`，守门测试立即变红（7 > 6）。→ 本句**绝对不可引用**。**

### 6.3 已用满 5 课（**只剩 1 课头寸**，引用须极谨慎）

| 句子 | 课号链 | 剩余头寸 |
|---|---|---|
| `i like reading` | L5, L42, L46, L77, L120 | **1** |
| `there is a book on the desk` | L26, L37, L55, L60, L114 | **1** |
| `i was busy and happy` | L81, L113, **L139, L140, L141** | **1** |
| `i am happy` | L113, L119, L125, L128, L134 | **1** |
| `i am used to getting up early` | L120, L122, L124, L136, L138 | **1** |
| `it looks nice` | L125, L126, L128, L133, L134 | **1** |

**⚠️ 与本批两条方向直接相关的两条：**
- **`I was busy and happy.`（5/6）**：批二十二刚在 L139／L140／L141 **连用三次**把它推到 5。**本批两方向若再引用它，第 4 次进本批、总计 8 → 直接撞红。→ 不可引用。**
- **`It is too heavy to carry.`（2/6）**：L66 与 L71 各 1 次，**头寸 4**。方向 A 若走 `太`/`也` 对照，此句是最自然的回流句——**安全，且是唯一既「头寸足」又「与 `too` 直接同形」的句子**。
- **`Although it is raining, I will go out.`（3/6）**：L139／L140／L141 各 1 次，**头寸 3**；`Although it was cold, we went out.` 同为 **3/6**。方向 B 若引用，剩 3 课。

### 6.4 本批候选复现句的**当前课数与剩余头寸**

| 候选句 | 当前课数 | 剩余头寸 | 课号链 |
|---|---|---|---|
| `I like tea too.` | **0** | **6** | — |
| `I like tea, too.` | **0** | **6** | — |
| `I don't like coffee either.` | **0** | **6** | — |
| `She likes music too.` | **0** | **6** | — |
| `I want to go too.` | **0** | **6** | — |
| `He is a student too.` | **0** | **6** | — |
| `I like tea.` | **0** | **6** | —（L5 用 `I like tea.` 但不在 practice） |
| `I don't like coffee.` | **0** | **6** | — |
| `She doesn't like coffee.` | **1** | **5** | `lesson-25-third-person` |
| `Would you like some tea?` | **1** | **5** | `lesson-70-would-you-like` |
| `I drank tea.` | **1** | **5** | `lesson-11-plural` |
| `I want a milk tea.` | **0** | **6** | — |
| `I would like a cup of tea.` | **2** | **4** | L62, L70 |
| `Can I have a milk tea?` | **2** | **4** | L61, L62 |
| `It is too heavy to carry.` | **2** | **4** | L66, L71 |
| `The wind is too strong.` | **0** | **6** | — |
| `I will go out.` | **0** | **6** | — |
| `Although it is raining, I will go out.` | **3** | **3** | L139, L140, L141 |
| `Although it was cold, we went out.` | **3** | **3** | L139, L140, L141 |
| `It is raining, but I will go out.` | **2** | **4** | L140, L141 |
| `I will call you tomorrow.` | **2** | **4** | L12, L139 |
| `I was busy and happy.` | **5** | **1（本批不可用）** | L81, L113, L139, L140, L141 |

**判定：方向 A 的候选句全部是「零复现」（头寸 6），头寸状况**全面优于**方向 B**（B 的最自然回流句 `Although it is raining…` 与 `Although it was cold…` 已各 3/6，`It is raining, but I will go out.` 2/6，且 L140／L141 刚连用）。

---

## §7 罪名与案件可行性

### 7.1 罪名枚举（**不可扩展**）

**实测源码枚举**（`src/types.ts:419–429`，`GrammarErrorTag` 联合类型）——**共 11 个，其中 `comparison` 在 HC 里 0 使用**：

```
tense | sv_agreement | missing_be | article | plural | preposition
| fragment | run_on | word_order | verb_form | comparison
```

复跑：

```bash
sed -n '419,432p' src/types.ts
grep -c "comparison" src/data/huntCases.ts        # → 0
grep -n "errorTag: \"comparison\"" src/data/mountainGateScripts.ts   # → :164（只出现在山径关卡脚本，不在 HC）
```

**HC 现有 586 处植错的罪名分布（实测）：**

```
verb_form:133 · plural:104 · sv_agreement:94 · preposition:62 · tense:56
word_order:50 · article:29 · missing_be:24 · run_on:19 · fragment:15 · comparison:0
```

**⚠️ 与任务书口径的差异（须登记）：任务书写「10 个罪名枚举（`tense`/…/`verb_form`）——不能扩展」。实测源码是**11 个**（多一个 `comparison`），且 `comparison` **在 HC 里 0 使用**（只在 `mountainGateScripts.ts:164` 用过一次）。本报告按「HC 可用罪名 ＝ 任务书列的 10 个」执行，`comparison` **不列入本批可选**（与任务书一致）；但**源码枚举本身是 11 个**这一事实须登记，以免后续出现「某案标 `comparison` 是否合法」的歧义。**

### 7.2 方向 A 的案件设计（2–3 案，tokenIndex 全部按脚本枚举）

**下标枚举脚本**（临时 vitest，逐 token 打印下标并标出错点；下表 `tokenIndex` 全部由该脚本枚举）：

| 案 | 场景句（tokens，**加粗＝错点**） | 错点下标 | 罪名 | 依据 |
|---|---|---|---|---|
| **A-案 1** | `[0]I [1]don't [2]like [3]coffee` **`[4]too.`** | **4** | **`run_on`** | 否定句的「也」用 `either`；`too` 在否定句里是连接词误用。与案 #7 的 `so`／`but` 同罪名（`run_on` 已有 19 处实例） |
| **A-案 2** | `[0]I [1]like [2]tea. [3]She` **`[4]like`** `[5]tea [6]too.` | **4** | **`sv_agreement`** | 三单漏 -s；与 L25 正课同点（`sv_agreement` 94 处，全库最熟罪名之一） |
| **A-案 3**（可选） | `[0]I [1]too [2]like [3]tea.`（`too` 错位） | **1** | **`word_order`** | `too` 应在句尾；`word_order` 已有 50 处实例 |

**可行性评分：** **A-案 1 最稳**——`either` 与 `too` 的否定句分工是 `run_on` 家族的标准用法错误，HC 里 `run_on` 19 处全部是「成对连词多留一个」同型，**本案是其自然延伸**。
**风险**：`either` 全库 0 → **案件首次出现该词时须在 `notes` 里挂生词提示**（沿用 `huntCases.ts:11` 头注的既有做法：「个别教学上必须保留的难词放在 notes 里作为『生词提示』展示（如 case 9 的 advice / information）」）。

### 7.3 方向 B 的案件设计（2–3 案）

**下标枚举（同上脚本，加粗＝错点）：**

| 案 | 场景句（tokens） | 错点下标 | 罪名 | 依据与风险 |
|---|---|---|---|---|
| **B-案 1** | `[0]Though [1]it [2]is [3]raining,` **`[4]but`** `[5]I [6]will [7]go [8]out.` | **4** | **`run_on`** | **零风险**——案 #7 已验证该型（案 #7 错点在 `but` ＝ `14`）。**须与 L139／L141 话术分工**（§2.3）；且**案 #7 的 `Though` 是陷阱词，若新案把 `Though` 也设陷阱词就是第 2 次同构**——建议新案 `Though` 只作词汇位、错点唯一给 `but` |
| **B-案 2** | **`[0]Even`** `[1]though [2]it [3]was [4]raining, [5]we [6]went [7]out.` | **0** | **`fragment`** | `fragment` 现有 15 处实例；**`even` GL 0／HC 0，属纯造词**，作为案件首见词须 notes 提示 |
| **B-案 3** | `[0]I [1]will [2]stay [3]at [4]home` **`[5]unless`** `[6]it [7]stops [8]raining.` | **5** | **`run_on`** | `unless` 全库 0，`run_on` 家族自然延伸。**`unless` 与 `if not` 的对应在零基础层面较抽象**，属「教学中必须保留」的难词 → notes 提示 |
| **B-案 4** | `[0]Take [1]an [2]umbrella [3]in` **`[4]case`** `[5]it [6]rains.` | **4** | **`verb_form`** | 风险最高：**`in case` 是双词构件，`tokenIndex` 只能指向 `case`（单点）**，会暗示「错的是 `case` 这个词」而非「整个构件形态」——与案 #75（`tokenIndex:3 very→too`）同类，可接受但需话术兜住 |

**可行性评分：** **`run_on` 是两方向共同最稳罪名**（HC 已有 19 处，含案 #7 的 `so`／`but`、案 #15 的 `so`）。
**方向 A 的风险低于方向 B**：A-案 1 **不需要引入任何新造的语法词**（`too` 已有 110 处词面、8 处也义实体句）；B 的 B-案 2/3/4 **每案各引入 1 个全库 0 的新词**（`even`／`unless`／`case`），**每案都要挂 notes 生词提示**。

### 7.4 旧错回流池的 **HC 复用次数**（推荐零复用的句子）

**回流池现有四句（任务书给定）：L10（`go`→`went`）、L11（`apple`→`apples`）、L19（`was`→`were`）、L25（`drink`→`drinks`）。**

**四型在 HC 的复用次数（逐处行号可核，脚本 `/tmp/da24/errshape.mjs`）：**

| 回流型 | HC 复用次数 | 分布 |
|---|---|---|
| **`go`→`went`（tense）** | **24 处** | 案 #2, #32, #91, #96, #102, #104, #105, #109, #113, #120, #124, #128, #131, #134, #136, #137, #139, #141, #143, #145, #146, #148, #151, **#153** —— **最近 5 案（#148–#153，批二十二／二十三）里用了 4 次** |
| **`apple`→`apples`（plural）** | **3 处** | 案 #15（`:721`）, 案 #90（`:5663`）, 案 #98（`:6008`） |
| **`was`→`were`（sv_agreement）** | **21 处** | 案 #1, #10, #30, #33, #43, #60, #69, #104, #106, #108, #114, #122, #125, #132, #135, #138, #140, #144, **#149, #150, #152**——最近 4 案里用了 3 次 |
| **`drink`→`drinks`（sv_agreement）** | **9 处** | 案 #34, #99, #112, #121, #129, #138, #140, #144, **#149** |

**逐句复核（把 L10／L11／L19／L25 的 practice 原句拿去全 153 案做 token 级子串匹配，脚本 `/tmp/da24/hcmatch.mjs`）：15 句全部「零复用（全 153 案无此句）」。**

**判定：四型回流句的「整句」在 HC 里都是零复用**（HC 用的是同型不同句的变式）。**「复用次数」的正确口径因此要分层给：**

| 口径 | `go→went` | `apple→apples` | `was→were` | `drink→drinks` |
|---|---|---|---|---|
| **整句复用（HC 里出现同一句）** | **0** | **0** | **0** | **0** |
| **同型错误复用（同原词→同修正）** | **24** | **3** | **21** | **9** |
| 最近 6 案内是否刚用过 | **是（#148/#151/#153）** | 否（最近 #98） | **是（#149/#150/#152）** | **是（#149）** |

**推荐（零复用优先）——本批新案选哪一句回流：**
> **首选 `I ate two sandwiches.`**（L11 `apple→apples` 型：整句 HC 0 复用、同型仅 3 处且最近一次在案 #98，距今 55 案）——两方向通用，作为「plural 旧错回流」位。
> **次选 `I drank tea.`**（L11，整句 HC 0 复用）——与方向 A 的 `tea` 场景天然同题（`tea` GL 119 处厚垫子）。
> **避开 `Yesterday I went to the park.`**：同型 `go→went` 已 24 处、且**最近 5 案里用了 4 次**（#148／#151／#153／#146），再加一次就是第 25 次同型——虽不触任何守门断言，但**「旧错回流」会退化为「每次都是 go→went」**，是本批应主动避免的单调化。
> **同样避开 `He drinks milk every day.` 同型（`drink→drinks`）**：案 #149（批二十二）刚用过。

---

## §8 展示层与资产

### 8.1 封面池

```bash
ls src/assets/lessons/ | wc -l            # 117（lesson-1.jpg … lesson-117.jpg）
grep -o "cover: cover[0-9]*" src/data/grammarLessons.ts | wc -l   # 144
```

**实测：封面文件 117 张，课程引用 144 次 → 27 张被用了 2 次，90 张用了 1 次。**

**使用规律（逐课实测，脚本 `/tmp/da24/covers.mjs`）：** `L1–L117` 是 `cover1→cover117` 一一对应；`L118–L144` **回到开头循环**（`L118→c1` … `L144→c27`）。

**被用 2 次的 27 张：** `cover1: L1,L118` … `cover24: L24,L141`／`cover25: L25,L142`／`cover26: L26,L143`／`cover27: L27,L144`（连续无缺口）。
**未见过的封面：无**（`covers never used:` 为空）。

**判定（本批该用哪几张）：**
> 循环是 `cover{N} = cover{N mod 117}`，**L142→c25／L143→c26／L144→c27** 已经验证了「L118 起重新从 c1 开始」的规律。
> **→ 本批 L145／L146／L147 应使用 `cover28`／`cover29`／`cover30`。**
> 说明：`cover28/29/30` 目前 **各已被 L28／L29／L30 用过 1 次**，本批是它们的**第 2 次**（与 c1–c27 的状态一致）。**这是连续规律的自然延续，且不引入任何「第 3 次」封面**（当前全库没有任何封面被用 3 次）。

### 8.2 季分组与里程碑

**现状（`src/data/grammarSeasons.ts:64`）：**

```ts
{ id: "season-23", label: "第二十三季 · 一…就…", hint: "我一写完就来吃、一写完立刻就去——前面那件事一到，后面那件马上做", min: 142, max: 144 }
```

**守门测试（`src/data/grammarSeasons.test.ts`，4 条断言）：** ① 每课号必须落在某个季区间内（**否则路径页静默过滤、整课不显示**）；② 区间互不重叠且 `min ≤ max`；③ `label`／`hint` 非空；④ **最高季的 `max` 必须覆盖全库最高课号**。

**→ `season-24` 该怎么填：**

| 字段 | 值 | 依据 |
|---|---|---|
| `id` | `"season-24"` | 序列延续 |
| `min` | **145** | 紧接 `season-23` 的 `max: 144`（断言②要求 `min > 144`） |
| `max` | **147** | 本批 3 课（L145–L147） |
| `label` | 按方向定（如方向 A→`"第二十四季 · 也的两张脸"`／方向 B→`"第二十四季 · 让步与条件"`） | 断言③非空 |
| `hint` | 按方向定，需含两句本批目标句 | 断言③非空 |

**⚠️ 硬护栏：若只加 `season-24` 但 `max` 写 146（漏 L147），断言④不会报错（因为 147 未上线），但下一批上线 L147 时会命中断言①——**必须一次写足 `max: 147`**。

**can-do 里程碑（`src/pages/GrammarPathPage.tsx:108–283`）现状：**

```
can-do-m25  afterLesson: 144   "我能说「一到…就…」"
（m1:12, m2:18, m3:24, m4:27, m5:34, m6:41, m7:46, m8:49, m9:54, m10:60, m11:66,
 m12:71, m13:75, m14:78, m15:86, m16:94, m17:102, m18:110, m19:118, m20:124,
 m21:127, m22:133, m23:138, m24:141, m25:144 —— 共 25 条，末条锚在 144）
```

**→ `can-do-m26` 该怎么填：**

| 字段 | 值 | 依据 |
|---|---|---|
| `id` | `"can-do-m26"` | 序列延续（现有 m1–m25） |
| `afterLesson` | **147** | 模式：**每条里程碑锚在该章最后一课**（m24→141＝批二十二收口，m25→144＝批二十三收口）。本批 L145–147 → **147** |
| `title` | 「我能说『也』的两种说法」（A）／「我能说『虽然』和『除非』」（B） | — |
| `samples` | 3 句（现有 m1–m25 全部是 3 句） | 长度约束 |
| 存储键 | `localStorage["grammar-can-do-v1"]`（`GrammarPathPage.tsx:109`）；追加即可，**无序号上限断言** | 新增 m26 不需改任何测试 |

### 8.3 `bundledDictionary` 与生词提示

```bash
node /tmp/da24/dict.mjs      # 解析 src/data/bundledDictionary.ts 的 {"word":"..."} 键
```

**实测：词典 12,000 条，文件 3.34 MB。**

| 词 | 在词典？ | 词 | 在词典？ |
|---|---|---|---|
| `too` | **YES** | `unless` | **YES** |
| `either` | **YES** | `also` | **YES** |
| `though` | **YES** | `despite` | **YES** |
| `although` | **YES** | `in case`／`in spite of` | **no**（双词构件，词典按单词索引） |

**判定：四个候选考点词（`too`／`either`／`though`／`unless`）全部在词典内**——生词提示有词条可回退。
**唯二缺口：`in case`／`in spite of` 两个双词构件不在词典索引内**（词典是单词表）。→ 若方向 B 选 `in case`，**生词提示对该构件无词条**；`case` 单词本身在词典里，但显示出来的是「case＝情况/盒子」，**与「in case＝万一」不是同一义项**——**这是选 `in case` 时的一个具体展示层缺陷。**

**词典调用路径（`src/services/dictionaryService.ts:84–104`）：** `bundledDictionary` 是**动态 import**（`import("../data/bundledDictionary")`），只在查词时加载，**课程页首屏不加载 3.34 MB**——新增课不会因词典体积受影响。

### 8.4 TTS 依赖

```bash
grep -n "lang\|voice\|speak" src/services/speechService.ts | head -40
sed -n '525,560p' src/services/speechService.ts
```

**实测判定：`speechService.ts` 是**纯文本驱动**的 TTS 服务，不对课程数据做任何词级／语法级判断：**
1. 入口 `speak(text, options)`／`speakWithSystemVoice(text, options)`——**输入只有文本串与 `lang`／`voiceURI`**（`:6–12`、`:328`）。
2. 语言选择走 `normalizeVoiceLanguage`／`scoreSpeechVoice`（`:120–163`），**只按 `en-US` 之类 locale 打分，不解析句子内容**。
3. 发音音频走 `fetchPronunciationAudioUrl(text, lang)`（`:434`）与回退（`:457`），**缓存键是 `normalizedText:lang`**（`:438`、`:463`）——**不区分词性或义项**。

**→ `too`（也/太）与 `either`／`though`／`unless` 在 TTS 层无任何特殊依赖。** 但登记一条局限：**TTS 对同形异义词不区分读音或义项**（`too` 两义同音 `/tuː/`，不成问题）；**真正的未知点是 `either` 的英式 `/ˈaɪðə/` 与美式 `/ˈiːðə/` 双读**——系统音色按 locale 打分选择，**库内既无先例也无断言**（`grep -rn "either" src/services/speechService.ts` → 0），**属「首次引入该词」的未知项**。建议：`either` 在 §4.3 实测会成为 cloze 选项，**听力题里可能出现「同一选项两种读法」的干扰**，上线前须实测两种音色。

---

## §9 数据裁决结论

### 9.1 数据侧推荐

> **数据侧推荐：方向 A（「也」的两张脸）优先，但推荐形态是「只教 `either`＋把 `too`（也义）作为正面垫子做 1 课对照」，而不是「`too`／`either` 两课平摊」。**
> **方向 B 在数据上不是不可做，而是**三笔账同时偏贵**：① 4 个候选表达里 3 个（`even though`／`unless`／`in case`）是**连子串都为 0** 的纯造词；② `though` 与 L139／L141 存在**可误读的话术重叠**（§2.3）；③ 最自然的回流句（`Although it is raining…`）**已用满 3/6 头寸**（§6.4）。
> **若裁决走 B，则数据侧建议的最小改动版是「`though` 单课（不拉 `even though`／`unless`／`in case`）」**——即把 3 课缩为 1 课，因为**另外三个词的新增零件量在 3 课里装不下而且每一个都要挂 notes 生词提示**。

### 9.2 五条量化理由

| # | 理由 | 量化 | 性质 |
|---|---|---|---|
| **1** | **方向 A 的「造词量」是 1 个，方向 B 是 3–4 个** | A：`either` 需造（其它零件全饱和：`tea` 119／`coffee` 25／`music` 47／`like` 361）；B：`even though`＝0、`unless`＝0、`in case`＝0（**连子串都 0**），仅 `though` 有 5 处（GL 3 ＋ HC 2）——**且这 5 处全部是引文／陷阱词，非已教** | **数据结论** |
| **2** | **方向 A 无「已教」冲突，方向 B 有「可误读的已教假象」** | A：`too`（也义）**从未当过任何课的 `grammarLabel`／`targetSentence`**（`grep -n "grammarLabel:" … \| grep -i too` → 仅 `:12161` 命中，是 `太` 义）；B：`though` 同样 0 课程位，**但** L139 `:26189`「今天它**转正了**……今天正经学」＋ L141 `:26577`「这一章就是**那句话的正经课**」**在逐字层面可被读成「`though` 已处理过」** | **数据结论**（含一处**文本歧义**的判断） |
| **3** | **cloze 落点：A 明显强于 B（boost 侧）** | boost 侧考点词命中率：`too`（也义）**53–90/162 ≈ 33–56%**；`either` **40–53/162 ≈ 25–33%**；`though` **27–31/162 ≈ 17–19%**；`unless` **36/162 ≈ 22%**。**ambush 侧两方向同坏（0/144 课）**——但 A 的考点词 `too` **在 `GRAMMAR_WORDS` 表内**（`:179`），B 的 `either`／`though`／`unless` **根本不在表内** → **若将来要修引擎让 ambush 能练考点，A 的改动量小于 B**（A 只需改「取最后而非第一个语法词」；B 还需加词表条目） | **数据＋源码结论** |
| **4** | **复现头寸：A 全部零复现，B 最自然回流句已 3/6** | A 候选句头寸全部 **6/6**（`I like tea too.`／`I don't like coffee either.`／`She likes music too.`… 当前课数 **0**）；B 的 `Although it is raining, I will go out.` 与 `Although it was cold, we went out.` **均 3/6**（L139／L140／L141 连用），`It is raining, but I will go out.` **2/6**；且 **`I was busy and happy.` 已 5/6，本批绝不可用** | **数据结论** |
| **5** | **案件可行性：A 的 `run_on` 案不需引入新造语法词，B 的 2/3 案要** | A-案 1（`too` 用在否定句）**只需 `too`（已有 110 处词面／8 处也义实体句）＋`either`（1 个新词）**；B-案 2/3/4 **各引入 1 个全库 0 的新词**（`even`／`unless`／`case`），**每案都要挂 notes 生词提示**（`huntCases.ts:11` 的既有机制）。两方向最稳罪名同为 **`run_on`**（HC 已有 19 处实例） | **数据结论** |

### 9.3 诚实标注：**哪些是数据结论、哪些超出数据范围**

**✅ 属数据结论（可用上面的命令逐条复跑）：**
- §1／§2 全部词次、逐处行号、逐字引文（含 §0.2 的 `though`／`Although` 子串陷阱实测）
- §2.3 的「`though` 在 GL 的 3 处 100% 位于 `deepDive`、0 处课程位」——**「不构成重复教学」是数据结论**
- §3 的倒挂台账（含「本批两方向均无严格意义的倒挂」这一**否定性结论**）
- §4 的落点实测与 162 种子分布、§4.2.1 的 5.41%／12.5% 基率
- §5 的「四目标词全部不进变形分支」与 42 个非词典选项清单
- §6 全部头寸数字（含红线 6 与 `I was busy and happy.` 5/6 的**不可用**判定）
- §7 的 11 个罪名源码枚举、586 处罪名分布、四型回流复用次数（24/3/21/9）
- §8 的封面 117 张／L145–147→cover28/29/30、词典命中表、TTS 纯文本驱动的源码判定

**⚠️ 超出数据范围（须由瑞思／竞析／主理人裁，本报告只提供数据不裁决）：**
1. **`though` 与 L139／L141 是否构成「冲突」——最终是「文本解释」问题，不是数据问题。** 数据能证明「`though` 0 课程位、3 处全在 deepDive 引文里」；但 `:26189`「今天它转正了」与 `:26577`「这一章就是那句话的正经课」两句**是否会被用户读成「已教」**——**这取决于话术设计意图与用户理解，本报告不能给出数据结论**。若裁决认定这两句已足以让用户认为「`though` 学过了」，则方向 B 的 risk 1 **成立**（且需回头修 L139／L141 的话术，那是**批二十二的返工**，不是本批的新增）。
2. **Murphy 中级 U113／U114／U115 是否为连续三单元——属教材证据，本报告未核 Murphy 原件**（`/private/tmp/murphy_*.txt`／PDF 是否仍在机亦未验），**竞析主张的「最强课程位证据」在本报告中不置可否**。
3. **「本项目对『中级册单元』有折价先例」——本报告只核到存续记录**：批二十一 `roadmap-grammar-twenty-first-batch-2026-09-20.md:382` 逐字「Murphy 仅中级 **U46**（**跨级**，在 U42–45 被动块之后）」、`:384` 逐字「Murphy 最近邻只到**中级 U67**」、`:383` 逐字「Murphy 初 **U112**／中 **U130–131**」——**折价的具体折多少、是否已成文，本报告未找到量化条款**，**须查更早的决策文档（非本报告范围）**。
4. **「瑞思推荐 A 档／B 档」的定档本身——B 档 vs A 档的档位判定不属数据侧**（数据只能给零件量：A＝1 新词、B＝3–4 新词）。
5. **`either` 的英式／美式双读对听力题的实际影响——须实测音色**（§8.4 已登记为未知项，本报告无法从代码得出）。
6. **`comparison` 罪名在本批是否可用**——任务书列 10 个罪名，**实测源码是 11 个**（§7.1）。本报告按任务书执行，但**「多出的 `comparison` 能否用」须主理人裁**。

### 9.4 本批「登记项」汇总（无论最终选哪个方向，以下都须进 PRD）

| # | 登记项 | 依据 | 严重度 |
|---|---|---|---|
| **R1** | **ambush 侧（关 2）对两方向全部考点词「结构性假友好」**：0/144 课能命中 | §4.2／§4.2.1（`pickClozeWord` 取首个 `GRAMMAR_WORDS`；`either`/`though`/`unless` 不在表内） | **高**（影响关 2 的复习价值；要么改引擎、要么在 PRD 里显式接受） |
| **R2** | **`I was busy and happy.` 已 5/6，红线 6** | §6.3 | **高**（不可引用） |
| **R3** | **`Yesterday I went to the park.` 已 6/6，压线** | §6.2 | **高**（不可引用；守门测试 `grammarLessons.test.ts:163` 会红） |
| **R4** | **`go→went` 同型回流已 24 处，且最近 5 案用了 4 次** | §7.4 | 中（建议本批换用 `apple→apples` 型） |
| **R5** | **封面须用 `cover28/29/30`**（循环规律 L145–147） | §8.1 | 中（不用则破坏 L118 起的循环） |
| **R6** | **`season-24` 必须一次写足 `max: 147`** | §8.2（断言①「区间外静默过滤」） | **高**（漏写 = 整课不显示、无报错） |
| **R7** | **`can-do-m26` 填 `afterLesson: 147`** | §8.2（m24→141、m25→144 的模式） | 中 |
| **R8** | **`either`／`even`／`unless`／`case` 若成案件首见词，须挂 `notes` 生词提示** | §7.2／§7.3（机制见 `huntCases.ts:11`） | 中 |
| **R9** | **全库已有 42 个非词典串出现在 cloze 选项里（`tao`／`lin`／`to's`／`sung`…）** | §5.3 | 中（存量问题，非本批引入；建议给 `courseVocabulary` 加专名＋撇号过滤） |
| **R10** | **`in case` 在 `bundledDictionary` 无词条**（双词构件），生词提示只能显示 `case` 的义项 | §8.3 | 低（仅当方向 B 选 `in case` 时触发） |
| **R11** | **源码罪名枚举是 11 个（含 `comparison`），任务书口径为 10 个** | §7.1 | 低（口径须统一） |

---

**审计完成。全部临时脚本已删除（`ls src/services/__tmp*` → no matches）。**
**报告落盘：`/Users/liujun/Documents/英语听写/deliverables/product-strategy/data-audit-grammar-twenty-fourth-batch-2026-09-20.md`**
