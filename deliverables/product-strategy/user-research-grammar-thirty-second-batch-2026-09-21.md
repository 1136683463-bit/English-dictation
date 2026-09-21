# 用户研究 · 语法线「小美的一天」第三十二批

**日期**：2026-09-21 ｜ **类型**：用户研究（语法线第三十二批）｜ **研究员**：瑞思
**上游**：`b-tier-frontier-survey-2026-09-20.md`（B 档前沿普查）＋ `roadmap-grammar-thirty-first-batch-2026-09-20.md`（批三十一）
**本批候选三轴**：轴 A `had better`（最好…）／轴 B `whole`（整个）／轴 C `several`（几个）

---

## §0 本轮实读口径声明（必读）

### 0.1 工具（本机 `grep` 是 ugrep，不能用）

本机 `grep` 为 **ugrep**，实测 `grep -oniE "(^|[^A-Za-z])whole([^A-Za-z]|$)" src/data/grammarLessons.ts` **返回 0（错误）**，而实际 `whole` 在库中确实为 0——**这条恰好「对」，但同一条命令查 `better` 会给出错数**。

**本轮全部词频一律用 node 脚本（词边界口径）**，脚本落在 `/tmp/b32/` 下：`freq.js`（全库词频）／`had.js`（`had`／`better` 逐课归因）／`final.js`（L76 区间复算）／`anchor.js`（中文锚点逐课归因）／`design.js`＋`prewrite.js`（设计句连续子序列查重）／`marks.js`（`wrongMark` 清单）。

**词边界口径的必要性（普查 §4.3 已登记，本轮复现）**：子串口径会把 `table` 算成 `able`（GL 43）、`bought` 算成 `ought`（GL 44）。**本批 `whole`／`several`／`able` 三项的子串假阳性风险最高**——`whole` 会命中 `wholesome` 之类、`able` 会命中 `table`／`comfortable`。**三轴的「真零」判定全部已核过是词边界下的零。**

### 0.2 ⚠️ 快照声明（本轮新情况：数据文件在我实读期间长大了）

**这是本轮必须最先说的事**：我开工时任务书写的是「**162 课／171 案／31 季**」，但**我实读期间 `grammarLessons.ts` 从 31,528 行增长到 33,239 行，`huntCases.ts` 从 9,237 行增长到 9,513 行**——**有并行 agent 同时在生产第三十二批之后的内容**。

| 时点 | grammarLessons.ts 行数 | huntCases.ts 行数 | 课数 | 案数 | 季数 |
|---|---|---|---|---|---|
| 任务书声明 | ~33,000 | ~10,500 | **162** | **171** | **31** |
| 本轮实读开头 | 31,528 | 9,237 | 162 | 171 | 31 |
| 本轮实读中途（增长） | 33,239 | 9,513 | **169** | **178** | **33** |

**最终冻结快照（我全部数字以此为准）**：

```
3af849811fab0802b2fc9c83ccb811eeac6294da6926ca713cb0e05e94cd7f0c  /tmp/b32/GL.ts   (33,239 行)
9a94849e88ca8272b4d0fbbe1793fb960b30659d20c4e2e21dcb0219aed10ce2  /tmp/b32/HC.ts   (9,513 行)
```

**新增的 7 课（全部在本轮实读期间出现，任务书未提及）**：

| 课 | 行号 | 标题 | grammarLabel | 目标句 | 场景 |
|---|---|---|---|---|---|
| **L163** | 31527 | 我自己来 | 自己做 · myself | `I can do it myself.` | campus |
| **L164** | 31771 | 她自己会 | 自己做 · himself / herself | `She can do it herself.` | campus |
| **L165** | 32008 | 互相帮忙 | 互相 · each other | `We help each other.` | campus |
| **L166** | 32245 | 人太多了 | 太多 · too many / too much | `There are too many people.` | city |
| **L167** | 32493 | 有很多朋友 | 很多 · a lot of | `I have a lot of friends.` | campus |
| **L168** | 32741 | 怎么不歇一会儿 | 建议 · Why don't you…? | `Why don't you take a rest?` | campus |
| **L169** | 32989 | 我想要一杯茶 | 缩写 · I'd like（更口语） | `I'd like a cup of tea.` | city |

**这 7 课对本批三条轴有两处决定性冲击**：① **L168 是「建议」轴的第 2 课**——把轴 A（`had better`）的排期压力**又推高一档**；② **L169 已经付掉了 `'d` 缩写这笔账**（普查 §6 项 1 登记的「`'d` 缩写形是我方从未付过的账」**已不再是问题**，`'d` 现 GL 49 处）。

**处理方式**：我**全部数字在冻结快照上重算了一遍**（不沿用开工时的读数），**并在正文逐处标明口径**。凡与任务书 162 课口径不同的地方，我按 169 课口径报，并加注。

### 0.3 三种口径并列（延续批三十的纪律）

| 口径 | 定义 | 本批用途 |
|---|---|---|
| **词边界口径** | `(^\|[^A-Za-z])词([^A-Za-z]\|$)` | **词频唯一口径** |
| **连续子序列口径** | 整句按词切分后允许词间任意非字母字符 | **复用／查重唯一口径** |
| **课程块口径** | 按 `id: "lesson-…",` 切块、剔注释行 | **逐课归因唯一口径** |

### 0.4 ⚠️ 复用核查：连续子序列口径

| 断言 | 实测 | 状态 |
|---|---|---|
| 全库 contrast「恰好 6 条」 | **169/169 无例外** | ✅ 红线仍成立 |
| `practice` 口径同句 ≤6 课 | **最高 6**（`Yesterday I went to the park.`／`There is a book on the desk.` 各 6） | ✅ 零越线 |
| 非法 `scene` ID | **全库 0 违规**（169 处全合法） | ✅ |
| `targetSentence` ≤8 词 | 166/169 ✅；**3 课超长**（L86＝10／L101＝12／L102＝14） | ⚠️ 见 §9 |

### 0.5 逐字引用纪律

**本报告所有逐字引用均给「文件＋行号＋课号」三元组，行号已在冻结快照上复核**。任务书警告过「曾出现引文真实存在但行号指错课」——**本轮每条引文都用 `lessonOf(行号)` 反查过归属**。

```bash
sed -n '14330p' src/data/grammarLessons.ts          # → grammarLabel: "加力 · much + 更…",
node -e '
const {readFileSync}=require("fs");
const lines=readFileSync("src/data/grammarLessons.ts","utf8").split("\n");
const starts=[]; lines.forEach((l,i)=>{ if(/^\s{4}id: "lesson-[^"]+",\s*$/.test(l)) starts.push(i); });
const ln=+process.argv[1]; let b=null;
for(const s of starts){ if(s<=ln-1) b=s; else break; }
console.log(lines[b].trim());
' 14330
# → id: "lesson-76-much-better",   ✅ 行号与课号对应
```

### 0.6 零术语口径

**红线词表 29 词**（`src/data/grammarZeroTerms.ts`）：主语／谓语／宾语／表语／定语／状语／单数／复数／三单／原形／时态／一般过去时／一般现在时／现在进行时／过去进行时／现在完成时／情态动词／比较级／最高级／从句／语序／可数／疑问句／否定句／被动语态／第三人称／形容词／副词／介词。

**守门范围**（`src/data/grammarLessons.test.ts:94-127`）：**只守三个字段**——`grammarLabel`／`oneLineRule`／`summary.rule`。`deepDive`／`explain`／`whyZh` 按既定分级计划**允许保留术语**（深挖卡是进阶内容）。

**本批自检**：我为本批设计的 `grammarLabel`／`oneLineRule`／`summary.rule` **全部零术语**（§7 逐课给文案，已逐词对表核过）。**⚠️ 自查中抓到一处**：初稿 L170 规则里写了「后面接**单数**」——「单数」正在红线表内，**已改为「后面那个东西只说一个」**。

---

## §1 逐轴缺口盘点

### 1.1 三条轴实测缺口表（词边界口径，169 课快照）

| 轴 | 词串 | GL 实测 | HC 实测 | 档位（普查） | 独立增量 | 排期压力 |
|---|---|---|---|---|---|---|
| **A** | `had better` | **0** | **0** | B | **词形＋句法双新**（`had` 不变 ＋ 后面不垫 `to`） | **高**（撞 L47 ＋ L168） |
| **B** | `whole` | **0** | **0** | B（↑从 C＋） | **2 条硬规则**（`a/an + whole` ／不可数只能用 `all the`） | **低**（与 L151 是补格关系） |
| **C** | `several` | **0** | **0** | B | **量级刻度**（`more than two but not very many`） | **中**（撞 L114 `a few`） |

**三条轴都是「真零」**——**词边界口径下 GL／HC 四格全 0**（`whole` 0／0、`several` 0／0、`had better` 0／0）。**子串口径下有假阳性**：`whole` 会命中 `wholesome`（库中 0 处）、`several` 无假阳性、`had better` 的 `had`（GL 91）与 `better`（GL 85）**都是独立词，不是 `had better` 的一部分**——**这一点是轴 A 判定的关键，见 §2.2**。

### 1.2 三轴证据链（本轮亲自复核）

**轴 A `had better`**：整串 **GL 0／HC 0**；但 `had` **GL 91**（**65 处在 L107**）与 `better` **GL 85**（**59 处在 L76**）——**两词都在库、分布高度集中**。**⇒ 轴 A 的真实风险不是「词不认识」，而是「两个熟词凑一起变新意思」**（§2）。

**轴 B `whole`**：**GL 0／HC 0**（真零）；**`all` 已教（L151，GL 127／HC 19）**，两词大量互替（Cambridge 逐字承认）。普查称 `whole` 有「**2 条 `all` 做不到的硬规则**」——**我本轮独立取到 Cambridge 原文逐字复核，两条均成立，且实际有 3 条**（§3.1）。

**轴 C `several`**：**GL 0／HC 0**（真零）；最近邻 **L114 `a few`／`few`**（`few` GL 98），上位 **L30 `some`／`any`／`many`**（`some` 186／`any` 88／`many` 116）。普查判其增量为「**量级刻度**」——**我复核两源释义逐字一致，成立**（§4.1）。

### 1.3 真实表达需求（从零基础中国学习者出发）

**判定标准**：一个学完 169 课的零基础中国学习者，**在真实生活场景里会不会「想说却说不出来」**。

| 轴 | 真实口语场景 | 中文常用度 | 说不出来的后果 |
|---|---|---|---|
| **B `whole`** | 「我把**整本**书读完了」「**一整天**都在下雪」「**全班**都到了」 | **极常用**（中文「整」是高频字） | **能绕开但很别扭**：只能说 `All the books`／`all day`，**而 `all` 在两处根本替代不了 `whole`**（§3.1） |
| **A `had better`** | 「你**最好**早点睡」「我们**最好**现在就走」 | **极常用**（「最好」是中文建议的**头号说法**） | **能绕开**：说 `You should sleep early.`（L47）**意思 90% 到位**，只丢了「不然会有麻烦」那层 |
| **C `several`** | 「我读了**好几**本书」「**好几个**同学都这么问」 | **常用** | **能绕开**：说 `a few`（L114）或 `some`（L30），**听话人不会误解**，只是数量感偏了 |

**⇒ 从「真实表达需求」看，紧急度排序是 B ＞ A ＞ C**——**B 的缺口是「结构性缺失」**（有场合完全说不出来），**A／C 是「精度缺失」**（能说，只是不够准／不够客气）。

### 1.4 排序与结论（本报告的推荐）

**但排序必须与「红线风险」和「排期压力」加权**：

| 加权项 | 轴 A `had better` | 轴 B `whole` | 轴 C `several` |
|---|---|---|---|
| 真实需求（1.3） | 高 | **最高** | 中 |
| 独立增量条数 | **2–3 条**（词形永不 `have`／不垫 `to`／否定疑问形态） | **2 条硬 ＋ 1 条软** | **2 条**（量级 ＋ 可数复数） |
| 撞已教内容 | **⚠️ 高**（L47 `should` 同轴 ＋ **L168 `Why don't you`** 新占） | **低**（L151 `all` 是**补格**不是重复） | **中**（L114 `a few` 同轴不同刻度） |
| 场景位（scene） | 可用 `train`（仅 4 课） | 可用 `snow`／`forest`（各 1／2 课） | 可用 `magic`／`mystery`（各 2／4 课） |
| 造词成本 | **1**（`had better` 整串；`had`／`better` 都已面熟） | **1**（`whole`） | **1**（`several`） |
| 一句话规则能否说清 | ✅ 能 | ✅ 能 | ⚠️ **较难**（要跟 `a few` 比刻度） |

**⇒ 本报告的推荐排序：**

| 顺位 | 轴 | 建议课量 | 理由 |
|---|---|---|---|
| **1** | **轴 B `whole`** | **1 课** | **唯一「结构性缺口」**（2 条硬规则 `all` 做不到）＋ **零撞车** ＋ **场景零件最齐**（`day` 256／`book` 521／`homework` 263） |
| **2** | **轴 A `had better`** | **1 课** | 需求极真实（「最好」是中文建议头号说法）＋ 增量最硬（**词形＋句法双新**）；**排在 B 之后**——理由见 §2.5 |
| **3** | **轴 C `several`** | **缓排／可并课** | 增量只有「刻度」一条性质，**与 L114 `a few` 同轴**；普查自己也判它与 `a couple of`「二选一」（§4.3） |

**⇒ 本批建议取 2 课**：**L170 `whole`（轴 B）＋ L171 `had better`（轴 A）**，**轴 C 缓排**（逐课规格见 §7）。---

## §2 轴 A 专项（本轮重点）：`had better` 与 L76 的 `much better` 的切分

### 2.1 逐字读 L76（全部引文已用 `lessonOf` 反查归属）

**L76 课程块**：`src/data/grammarLessons.ts` **行 14327–14522**，`id: "lesson-76-much-better"`。

| 字段 | 行号 | 逐字内容 | 归属核对 |
|---|---|---|---|
| `id` | **14327** | `id: "lesson-76-much-better",` | ✅ 该行即 L76 块首行 |
| `number` | 14328 | `number: 76,` | ✅ |
| `title` | 14329 | `title: "好多了",` | ✅ |
| `grammarLabel` | **14330** | `grammarLabel: "加力 · much + 更…",` | ✅ |
| `scene` | 14332 | `scene: "mansion",` | ✅ 合法 ID |
| `targetSentence` | **14338** | `targetSentence: "I feel much better today.",` | ✅ |
| `oneLineRule` | **14344** | `oneLineRule: "给「更」加力的小词用 much：much better、much taller——它站在「更…」前面，比单说 better 力气更大。",` | ✅ |

**复跑命令**：

```bash
sed -n '14327p;14330p;14338p;14344p' src/data/grammarLessons.ts
```

**`examples` 字段逐字（L76，行 14345–14350）**：`{ en: "I feel much better today.", zh: "我今天好多了。" }` ／ `{ en: "He is much taller than me.", zh: "他比我高多了。" }` ／ `{ en: "This one is much better.", zh: "这个好多了。" }` ／ `{ en: "How far is the school?", zh: "学校有多远？" }`

**L76 的 `better` 实测：59（段内，行 14327–14522，词边界口径）**。全库 `better` 85 处的分布：**L76: 59**／L78: 8（收口回流）／L131: 8（收口回流）／L17: 6（`good 的「更好」是 better`）／L31: 2（`good→better→best`）／L65: 1／L121: 1。

**⇒ 关键事实：`better` 的 85 处里，59 处（69%）在 L76 一课；其余 26 处全是「回流复现」，没有第二课在教 `better`。**

**复跑命令**：

```bash
node -e '
const {readFileSync}=require("fs");
const GL=readFileSync("src/data/grammarLessons.ts","utf8");
const b=GL.split("\n").slice(14326,14522).join("\n");
console.log("L76段内 better =",(b.match(/(^|[^A-Za-z])better([^A-Za-z]|$)/gi)??[]).length);
'
# → L76段内 better = 59
```

### 2.2 问题①：中文里「最好…」和「更好」会不会被学生混？

**先说结论：会混，但混的位置不在英语、在中文。**

**证据链（本轮实测，中文锚点逐课归因）**：

| 中文词 | 全库处数 | 分布（课号：处数） | 判读 |
|---|---|---|---|
| **「最好」** | **11** | **L31: 9**／L55: 1／L76: 1 | **9/11 已经被 L31（最高级 the best）占了** |
| **「更好」** | **4** | L17: 4 | **全部在 L17（比较级）** |
| **「好多了」** | **28** | L76: 14／L78: 3／L131: 6／其余零散 | **全部是 `much better` 的回流** |
| **「你最好／你们最好／我们最好」** | **各 0** | — | **中文「最好」的建议义，全库零占用** |
| **「最好别／最好不要／最好还是」** | **各 0** | — | 同上 |

```bash
node /tmp/b32/anchor.js      # 中文锚点逐课归因（好几个／整个）
node -e '
const {readFileSync}=require("fs");
const GL=readFileSync("src/data/grammarLessons.ts","utf8");
const lines=GL.split("\n");
const starts=[]; lines.forEach((l,i)=>{ if(/^\s{4}id: "lesson-[^"]+",\s*$/.test(l)) starts.push(i); });
function L(ln){ let b=null; for(const s of starts){ if(s<=ln-1) b=s; else break; }
  const i=starts.indexOf(b), e=(i+1<starts.length?starts[i+1]:lines.length);
  return "L"+lines.slice(b,e).join("\n").match(/number:\s*(\d+),/)[1]; }
const re=/最好/g; const by={}; let m;
while((m=re.exec(GL))){ const k=L(GL.slice(0,m.index).split("\n").length); by[k]=(by[k]||0)+1; }
console.log(by);
'
# → { L31: 9, L55: 1, L76: 1 }
```

**⇒ 三个判定**：

1. **「最好」在中文里有两个意思**：「这是**最好**的电影」（＝ the best，**最高级**）vs「你**最好**早点睡」（＝ 建议，**had better**）。**中文用同一个词，英语用两套完全不同的形式。**
2. **L31 已经占了「最好」的最高级义**（9/11 处）——**这意味着 `had better` 立岗时，`最好` 这个中文锚点在库里已经「有主」**。**这是本轴最大的一个既有内容冲突，比 L76 更值得注意**（任务书只点了 L76）。
3. **L76 的那 1 处「最好」**在行 14462，是复现第 31 课时的引用（`promptZh: "再对照一句——第 31 课学过：这是今年最好的电影。"`）——**不是 L76 自己在教「最好」**。

**⇒ 学生混的机制**：学生看到中文「最好…」，**会把 L31 的 `the best` 和 L76 的 `much better` 都翻出来试**——因为这两个他都学过、都跟「好」有关。**而正确答案 `had better` 他完全没见过。** 这不是「与 L76 混淆」，**是「与 L31／L76 两条既有链一起混淆」**。

### 2.3 问题②：`had better` 的形态与 L76 的 `better` 结构上是不是两回事？

**是两回事，而且分离度是「本批最高」的一档。**

| 维度 | L76 `much better` | `had better`（拟教） | 分离度 |
|---|---|---|---|
| **`better` 的身份** | **形容词的比较级**（「更好」）——`feel` 后面的「怎么样」 | **固定搭配里的一个零件**（本身不再表示「更好」） | ✅ **完全不同** |
| **前面那个词** | `much`（**加力小词**，L76 教的） | `had`（**本身不表示「有」**，是固定件） | ✅ **不同词** |
| **后面接什么** | **什么都不接**（`much better` 已经是「怎么样」）／或 `than me` | **必须接一个动作的原样**（`had better **go**`） | ✅ **结构上完全不同的走向** |
| **能不能换词** | `much` 可换 `far`（L76 deepDive 逐字：「far 也行——far better」） | `had` **永远是 `had`**（Cambridge 逐字 "The verb form is always had, not have."） | ✅ **一个可换、一个不可换** |
| **中文对应** | 「好**多了**」 | 「**最好**…（不然）」 | ✅ **中文也不同词** |
| **句子里站哪** | 站在「怎么样」那个位置（`I feel ___ today.`） | 站在句首附近（`___ go now.`） | ✅ **不同位置** |

**Cambridge `Had better` 页逐字（本轮 WebFetch 独立取到，与普查一致）**：「**The verb form is always had, not have.**」／「**It is followed by the infinitive without to**」＋ ❌ `Not: I'd better to go now.`／「**We normally shorten it to 'd better in informal situations.**」／「**The negative of had better is had better not (or 'd better not)**」／「**The question form of had better is made by inverting the subject and had.**」／**五个实 h2**：`Had better: form and meaning`／`Had better: negative and question forms`／`Had better or be better, be best?`／`Had better or would rather, would prefer?`／`Had better: typical errors`。

**⇒ 结构上，「`had` ＋ `better` ＋ 动作原样」与「`much` ＋ `better`（形容词）」没有任何一个零件是重合的**（`had` 与 `much` 不同、后面接的东西不同、能不能换词不同）。**切分是干净的。**

**但有一个真风险（任务书没点，我必须提出来）**：**`had` 这个拼写本身在库里已经「有主」——L107 教的是 `had + 人名 + 动作穿原样`**（`The teacher had me come early.`，`had` 在 L107 出现 **65 处**）。

| 维度 | L107 `had me come` | `had better go`（拟教） | 分离度 |
|---|---|---|---|
| `had` 后面的东西 | **一个人**（`me`／`him`） | **`better`**（不是人） | ✅ 可分开 |
| 后面动作的主语 | **是那个人**（老师让我来 → 我来） | **是句子主语自己**（`We had better go` → 我们走） | ✅ **语义走向完全不同** |
| 中文 | 「让我做」（**分内的事请你做**） | 「最好…」（**建议**） | ✅ 不同 |

**⇒ 结论：`had better` 与 L107 的分离也是干净的**（后面跟「人」还是跟「better」，一眼可分）。**但 `had` 的「同一个词第 3 张脸」这个讲法，本课必须用上**——因为库里已有的两张脸是 L16（`have to` 不得不）与 L107（`had me come` 让我做）。

### 2.4 问题③：能否设计出 3 条不重复的带标记新错？

**能，而且难度不高——因为 `had better` 在库里是绝对真零（GL 0／HC 0），所有错句都是一次性的。**

**候选带标记新错（全部经连续子序列口径查重，GL 与 HC 双文件）**：

| # | 带标记错句 | `wrongMark` | 罪名 | GL | HC |
|---|---|---|---|---|---|
| **1** | `We have better go now.` | `have` | **词形错**：`had better` 永远是 `had`，不能换成 `have` | **0** | **0** |
| **2** | `We had better to go now.` | `to` | **不垫板**：后面跟动作原样，不垫 `to` | **0** | **0** |
| **3** | `We had not better go now.` | `not` | **否定位置**：`not` 站在 `better` **后面**，不是前面 | **0** | **0** |

**这三条的「不重复」核查**：`have`（课内 1 次，全库既有 10 次）／`to`（课内 1 次，全库 30 次）／`not`（课内 1 次，全库 8 次）——**三条标记互不相同，且与 L76 的 `very`／`more` 零重叠**。

**⚠️ 一条必须登记的既有惯例**：本库 **36 课在 contrast 内出现过同一个 `wrongMark` 重复**（如 L49 的 `to` 用了 3 次、L35／L37 的 `is` 用了 4 次）——**所以「同课标记不重复」不是硬约束**。**但我仍建议本课三条标记各不相同**，因为这是最近几批的**事实标准**（批三十一 L161／L162 都是 3 条标记互不相同）。

```bash
node /tmp/b32/prewrite.js   # 全部候选错句的 GL／HC 连续子序列查重
node /tmp/b32/marks.js      # wrongMark 全库清单 ＋ 课内重复统计
```

**✅ 三条新错全部 GL 0／HC 0。**

### 2.5 问题④：与已教 L47 `should` 的关系——会不会是同义换词？

**这是本轴最关键、也是唯一真正减分的一项。诚实回答：会撞，且 Cambridge 自己承认。**

**Cambridge `Had better` 页逐字（本轮独立取到）**：

> `Had better: negative and question forms` 节：「**This means the same as should, but is more formal**」

**词典定义亦自证**：`used to give advice`（`You'd better (= you should) go home now…`）——**词典直接在括号里写 `= you should`**。

**我方 L47 的既有事实（逐字）**：

| 字段 | 行号 | 逐字 |
|---|---|---|
| `grammarLabel` | **8739** | `grammarLabel: "情态三兄弟 · should",` |
| `targetSentence` | **8747** | `targetSentence: "You should sleep early.",` |
| `oneLineRule` | **8753** | `oneLineRule: "should 也进「不变词家族」：can / must / should 从来不变形，后面动词穿原样；不一样的是口气——can 能、must 必须、should 应该（给建议，比 must 轻）。",` |
| 既有 `examples` 之一 | — | `{ en: "You shouldn't sleep late.", zh: "你不该熬夜。" }` |

**⚠️ 叠加本轮新情况：L168（`Why don't you…?`）已经把「建议」轴又占了一课。**

| 课 | 中文 | 英语形式 | 语义轴 |
|---|---|---|---|
| **L47** | 你应该… | `should` | **建议（中性）** |
| **L168**（新增） | 你怎么不… | `Why don't you…?` | **建议（商量口气）** |
| **L161** | 我需要… | `need to` | 需要（**已切开**：不是建议） |
| **L75** | 咱们…吧 | `Let's` | 建议（**含自己**） |
| **L15／L44** | 我想… | `want to` ／ `to + 去做什么` | 意愿（不是建议） |

**⇒ 判定：`had better` 落在「建议」轴上是第 3 个成员（L47 ／ L168 之后）。**

**但——它比 L168 立得住，理由三条（全部有逐字依据）**：

1. **口气强度是第三个刻度，不是重复**：L47 `should`（**应该**，中性）→ L168 `Why don't you`（**商量**，轻）→ `had better`（**最好，不然**，重）。**Cambridge 逐字把它归为「更正式」（more formal），而我们可用的切口是「有负面后果」**——中文「你最好…」**天生带着「不然会出事」的暗示**，`should` 没有。
2. **词形是全新的（这是最硬的一条）**：`should` 属于「不变词家族」（L47 逐字：「can / must / should 从来不变形」）——**而 `had better` 里的 `had` 是过去形状**，**学生按家族规矩会写 `have better`**。**这是 L47 教的东西本身会产生的错**——`We have better go` 这条带标记错句，**正是 L47 的既有知识引起的**。**这证明它教的不是同一个点。**
3. **句法也是全新的**：`should` 后面直接跟动作原样（`should sleep`）；`had better` 后面**是「better ＋ 动作原样」**，中间多一个词，**且这个位置学生容易垫 `to`**（因为 `had` 长得像动词、中文「最好去」也容易诱导加东西）。

**⇒ 结论：不是同义换词，但它必须被排在有「建议」轴空位的时候。**
**本批推荐它取第 2 顺位（§1.4），排在 `whole` 之后——理由是：`whole` 零撞车且需求更结构性；`had better` 价值高但需要写课方在 L47／L168 上做足切分（本报告 §7.2 已给出切分口径）。**

---

## §3 轴 B 专项：`whole` 的两条硬规则与 L151 `all` 的切分

### 3.1 核实普查的说法：两条硬规则是什么？

**普查称 `whole` 有「2 条 `all` 做不到的硬规则」。我本轮独立取到 Cambridge 原文，逐字复核结果：两条均成立，且第三条也成立。**

**Cambridge `All or whole?` 页**（`grammar/british-grammar/all-or-whole`，h1／title 双核为 `All or whole?`，面包屑 `Grammar > Easily confused words > All or whole?`）：

**页内实 h2 五个**：
`All or whole for single entities` ／ `All the with uncountable nouns` ／ `All and whole with plural nouns` ／ `All and whole: typical errors` ／ （`All and whole?` 作为 intro）

#### 硬规则 ①：`a/an + whole` ✅ —— **`all` 做不到**

> 逐字（intro）：「**We use a/an with whole but not with all:**」
> 正句：「**She ate a whole bar of chocolate in one go.**」
> ❌ 逐字（`All and whole: typical errors` 节）：「**Not: She ate all a bar …**」

**⇒ `a` 与 `whole` 能搭，`a` 与 `all` 不能搭。这是 `all` 结构上做不到的。**

**中文对应**：「我吃了**一整个**蛋糕」——**中文的「一整个」正好是 `a whole` 的形状**。**这是零基础学生极高频的表达。**

#### 硬规则 ②：不可数名词只能用 `all the` ✅ —— **`the whole` 做不到**

> 逐字（h2 `All the with uncountable nouns`）：「**We use all the and not the whole with uncountable nouns:**」
> 正句：「**She was given all the advice she needed.**」／「**All the equipment is supplied.**」
> ❌ 逐字：「**Not: She was given the whole advice …**」

**⇒ 数不清的东西（advice／milk／water／equipment）前面只能用 `all the`，不能用 `the whole`。这是 `the whole` 结构上做不到的。**

**中文对应**：「这些建议全都是…」——**中文的「全都」在这里必须走 `all` 这一条路，`whole` 走不通。**

#### 硬规则 ③（普查未列，本轮补）：`the` 不能省 ✅

> 逐字（`All and whole: typical errors`）：「**We can't omit the before whole with a singular noun:**」
> 正句：「**We travelled throughout the whole country.**」
> ❌ 逐字：「**Not: … throughout whole country.**」

**⇒ 单数名词前的 `whole` **必须**带 `the`（或 `my` 等其他限定词）。**这也是一条形态硬规则**，**且与硬规则①互补**（①说 `a/an` 能用、③说单数时必须有限定词）。

**复跑命令**：

```bash
# 本轮独立取到的 Cambridge 原文（WebFetch，两页都取到）
# https://dictionary.cambridge.org/grammar/british-grammar/all-or-whole
# https://dictionary.cambridge.org/grammar/british-grammar/had-better
```

**⇒ 核实结论：普查的说法成立**（2 条硬规则），**实际比普查说的还多 1 条**（共 3 条可教的形态规则）。**普查 §7 项 3 登记「两报告均用 WebFetch 替代直连（BC 直连 403）——逐字可靠性低于直连 HTML」——本轮同样是 WebFetch，可靠性同级；但我取到的三条与普查取到的两条一致，互证成立。**

### 3.2 `whole` 与 L151 `all` 的关系（切分）

**我方 L151 的既有事实（逐字）**：

| 字段 | 行号 | 逐字 |
|---|---|---|
| `grammarLabel` | **29094** | `grammarLabel: "三个以上都 · all 也站最前面",` |
| `targetSentence` | **29102** | `targetSentence: "All the books are good.",` |
| `oneLineRule` | **29107** | `oneLineRule: "说「全都」：all 也站最前面，后面可以站 the——All the books are good（这几本全都好）。它管的是三个以上，一个都不落下。",` |
| `examples` 之一 | — | `{ en: "All my books are new.", zh: "我的书全是新的。" }` |
| `examples` 之一 | — | `{ en: "All three are good.", zh: "三本都好。" }` |

**L151 教的是**：`all`（**三个以上，一个不落**）＋ 后面可以站 `the` ／ `my` ＋ 配 `are`。

**切片表（核心）**：

| 维度 | L151 `all`（已教） | `whole`（拟教） | 切分方式 |
|---|---|---|---|
| **管几个** | **三个以上**（L151 逐字：「它管的是三个以上」）／复数／也可数不清 | **单数**（「一个东西的完整」）＋ 也可配复数（「全整的」） | ✅ **`all` 管「多」，`whole` 管「一」** |
| **后面站什么** | **可以站 `the`／`my`**（`All the books`／`All my books`） | **可以站 `a/an`／`the`／`my`**（`a whole day`／`the whole book`／`my whole life`） | ✅ **`a/an` 这个位只有 `whole` 能站**（硬规则①） |
| **数不清的东西** | **✅ 能用**（`all the advice`） | **❌ 不能用**（`the whole advice` 错） | ✅ **硬规则②：`all` 独占这一格** |
| **能不能不带限定词** | **✅ 能**（`All three are good.`） | **❌ 单数时不能**（`whole country` 错） | ✅ **硬规则③** |
| **配单数还是复数** | 复数（`are`）／不可数（`is`） | 单数（`is`）／复数（`are`，`whole families`） | ⚠️ **重叠区**（见下） |
| **中文** | 「**全**都」 | 「**整**个」 | ✅ **中文也不同锚点** |

**重叠区（诚实登记）**：Cambridge 逐字承认大量互替——「**When we can split up a thing into parts, we can use either whole or all with the same meaning:**」（`She ate the whole orange.` ＝ `She ate all of the orange.`）／「**All my family lives abroad. or My whole family lives abroad.**」／「**We often use all and the whole with of the:**」（`She complains all of the time. or She complains the whole of the time.`）

**⇒ 这是 `whole` 立岗的最大折价项**：**两词在「可切分的东西」上大量同义**。**但上面的 3 条硬规则是不可互替的**——**所以 `whole` 的价值不在「又一个说全」的词，而在「3 格 `all` 站不了的位置」。**

### 3.3 与 `every`（L152）的第三边关系

**L152 既有事实**：`grammarLabel` 行 **29300** ＝ `"差在哪儿 · 好多个一起／一个一个来"`；`targetSentence` 行 **29308** ＝ `"Every student is here."`。

| 词 | 管几个 | 后面那个东西 | 搭档 | 中文 |
|---|---|---|---|---|
| `all`（L151） | 三个以上／一群 | **带 s** | `are` | 全都 |
| `every`（L152） | 一群里的**每一个** | **不带 s**（**只说一个**） | `is` | 每个都 |
| **`whole`（拟教）** | **一个东西的完整** | **单数（或复数表「整」）** | **看东西定** | **整个** |

**⇒ `whole` 补的是第三格（「一个东西的完整」），与 `all`／`every` 都不撞。**

### 3.4 能否撑 1 课？

**能，而且从容。**

| 判据 | 实测 | 结论 |
|---|---|---|
| 独立增量条数 | **3 条硬规则**（`a/an + whole` ／ 不可数只用 `all the` ／ `the` 不能省） | ✅ ≥2 |
| 场景零件是否在库 | `day` 256／`book` 521／`books` 255／`homework` 263（**普查已核，本轮复算一致**） | ✅ **零造词零件** |
| 造词成本 | **1**（`whole`，GL 0／HC 0） | ✅ 可控 |
| 场景位 | `snow`（**已用仅 1 课：L19**）／`forest`（2 课） | ✅ **本批最空** |
| 一句话规则能否说清 | ✅ 能（见 §7.1） | ✅ |
| 与已教内容的切分 | **补格，不重复**（§3.2） | ✅ **零撞车** |

**⇒ 强烈推荐立 1 课。**

---

## §4 轴 C 专项：`several` 与 `a few`／`some`／`many` 的关系

### 4.1 `several` 的源证据（普查逐字，本轮复核一致）

**我方 `several` 实测：GL 0 ／ HC 0**（真零，词边界口径）。

**跨源逐字**：

| 源 | 逐字 | 判读 |
|---|---|---|
| Cambridge 词典 `SEVERAL` | **`A2`**；逐字 "**(A2) more than two but not very many**"（`determiner`） | **下限被明文写死：两个以上** |
| Oxford `several` | **`a2`**（`cefr="a2"`／`fkcefr="a2"`／`ox3000="y"`） | **双源一致 A2** |
| BC `Quantifiers` | 逐字 "**Some quantifiers can be used only with count nouns:**" —— **`several` 在该名单内** | **BC 把它当成员，不当单元** |
| Cambridge 独立页 | **无**（slug `grammar/british-grammar/several` 返回 **200 但页题是通用页** `English Grammar Today on Cambridge Dictionary`——**这正是任务书警告的 slug 陷阱**） | ❌ 无规则页 |

**⇒ 普查的「无规则页却够 B」判定成立**（理由：我方有真缺口 ＋ 造词成本低）。

### 4.2 与已教内容的关系

| 已教 | 处数 | 它说的是什么 | 与 `several` 的关系 |
|---|---|---|---|
| **L114 `a few`／`few`** | `few` **98** | 逐字 `oneLineRule`（行 21744）：「「还有几个」说 a few（a 在，够）；「几乎没了」说 few（a 不在，不够）——就靠那个小 a，意思反一半。」 | **⚠️ 同轴最近邻**：`a few` 是「量少但够」；**它没有下限，可以指两个**；`several` 明文「**两个以上**」 |
| **L30 `some`／`any`** | `some` **186**／`any` **88** | 逐字（行 5587）：「「一些」：好好说的时候用 some，问句和「不 / 没」的时候换 any。数得清的用 many，数不清的用 much。」 | **不同轴**：`some` 管「肯定／否定」的极性；`several` 只管数量 |
| **L30 `many`** | `many` **116** | 同上 | **不同刻度**：`many` 是「多」；`several` 是「几个」（比 `a few` 多、比 `many` 少） |
| **L162 `most of`** | — | 逐字（批三十一）：「大多数 · most 后面也要 of」 | **同一张表的两端**：`several`（少数几个）↔ `most`（大多数） |
| **L151 `all`／L157 `none`** | `all` **127** | 「全」／「一个都不」 | **同一张表的四格** |

**⇒ 「数量刻度表」的既有占用情况（判断 `several` 有无独立增量的关键）**：

| 刻度 | 词 | 课 | 状态 |
|---|---|---|---|
| 一个都不 | `none`／`nobody` | L157／L158 | ✅ 已教 |
| 几乎没了 | `few`／`little` | L114 | ✅ 已教 |
| **还有几个（可指两个）** | **`a few`** | **L114** | ✅ 已教 |
| **几个（两个以上）** | **`several`** | **（空）** | ⚠️ **有缺** |
| 一些 | `some` | L30 | ✅ 已教 |
| 许多（可数） | `many` | L30 | ✅ 已教 |
| 大多数 | `most of` | L162 | ✅ 已教 |
| 全都 | `all` | L151 | ✅ 已教 |

**⇒ 表上确实有一格空着**（`a few` 与 `some`／`many` 之间的那格）。

### 4.3 是否真有独立增量？与 `a couple of` 比谁更好？

**有，但是「同一张表补一格」性质的增量，不是新结构。**

**✓ 支持（2 条）**：① **量级刻度独立**——`several` 源释义明文「**more than two but not very many**」（下限两个以上），而 `a few` **没有下限**；**学生在真实场景里确实需要「好几本书」这个刻度**（说 `a few` 太少、`many` 太多）。② **可数复数是硬约束**——BC 逐字归入 "**only with count nouns**"，**后面必须带 s**（`several books`）；**这是与 `much`／`a little` 家族的分界线**。

**✗ 折价（3 条）**：① **它没有自己的结构**——`several + 复数` ＝ `a few + 复数` ＝ `some + 复数`，**句型完全一样，只有数量词换人**；**一课一增量的「新结构」要求它不满足**（它教的是**词汇精度**）。② **与 `a few` 的边界对零基础很难讲清**——「两个以上」这个下限，**中文的「几个」本身就没有下限**，**学生没有语感抓手**（要用「`a few` 两三个、`several` 四五个到八九个」这种刻度感去讲，而中文「几个」两个都能说）。③ **与 `a couple of`「二选一」的普查判定成立**——普查判 `a couple of` 为 B−（BC 逐字归入 "**These more colloquial forms**"）；**`several` 更书面、更该进语法线**，**两者确实该二选一，`several` 胜出**。

**⇒ 判定**：**`several` 勉强够 1 课，但是三条轴里最弱的一条，建议缓排。** 若一定要做，**最好并进一张「数量刻度表」的收口课**（把 `none` → `few` → `a few` → `several` → `some` → `many` → `most` → `all` 排一行），**而不是立独立课**。

**⚠️ 一个必须登记的既有事实**：**「好几个」这个中文锚点已被 59 处占用，跨 17 课**（L5: 8／L11: 7／L26: 8／L114: 5／L151: 4／L152: 2 …；复跑 `node /tmp/b32/anchor.js`）。**⇒ `several` 立岗时中文锚点会与 17 课既有用语撞车**（尤其 L114 用了 5 次「好几个」正是 `a few`）。**这是它相对 `whole` 的又一个劣势**（`whole` 的中文锚点「整个」仅 12 处，且**全是讲解用语、不是教学锚点**）。

---

## §5 中文负迁移分析（为推荐轴给典型中式错句）

### 5.1 轴 B `whole`（推荐第 1 位）

| # | 错句 | 干扰点（中文怎么诱导的） | 标记建议 |
|---|---|---|---|
| **1** | `* I finished the whole books.` | **中文「整」后面不加复数**——「整本书」说「书」不加「们／些」，学生把中文的「单数感」带过来，**在 `whole` 后面写了复数** | `books` |
| **2** | `* I finished all a book.` | **中文「全（都）」和「一整个」都能说**——学生想表达「整整一本」，**用已学的 `all` ＋ 中文的「一本」拼出来**（硬规则①正是这一格） | `all` |
| **3** | `* I drank the whole milk.` | **中文「整瓶牛奶」完全通顺**——学生不知道「数不清的东西」不能用 `the whole`（**硬规则②**） | `whole` |
| **4** | `* I read whole book.` | **中文「整本书」中间不加「这」也通顺**（「我读完整本书」）——学生省掉了 `the`（**硬规则③**） | `the`（或整块） |
| **5** | `* I finished whole the book.` | **中文语序「整本书」把「整」放最前**——学生把 `whole` 挪到 `the` 前面 | `whole` |
| **6** | `* All the book is good.`（L151 回流错） | 已学 `all` 后面带 s 的规矩，**换成 `whole` 的场景时把 s 丢了** | `book` |

**⇒ 干扰点总结**：`whole` 一课的错，**几乎全部来自「中文『整』的形状 vs 英语限定词位置的规矩」**——中文的「整」是个自由的字，可以跟「一本／这本书／牛奶」任意组合；**英语的 `whole` 站的位置和带的限定词是被钉死的**。

**⚠️ 与「零雨线纪律」的冲突核查**：本轴错句**零命中** `rain`／`raining`／`rainy`／`stops`／`stopped`／`the movie`／`ends`／`ended`（**这 8 个是 L109 专属叙事资产**）。**场景若选 `snow`，注意 L19 已用过「下雪 ＋ 一整个下午」**（L19 `sceneSetupZh` 逐字：「下雪了，小美和同学在院子里堆雪人，玩了一整个下午。」）——**这正是 `whole` 的语义场，但 L19 的中文用的是「一整个」，英语句子是 `I was busy and happy.`（没教 `whole`）。所以场景可用，只要不重复那个叙事。**

### 5.2 轴 A `had better`（推荐第 2 位）

| # | 错句 | 干扰点（中文怎么诱导的） | 标记建议 |
|---|---|---|---|
| **1** | `* We have better go now.` | **`had` 长得像过去形状，学生按「不变词家族」的规矩（L47 教的）把它改成 `have`** | `have` |
| **2** | `* We had better to go now.` | **中文「最好**去**」的「去」像是不定式**；且 L15／L44 教过 `to` 垫板，学生照搬 | `to` |
| **3** | `* We had not better go now.` | **中文「最好不要」的「不」在「最好」后面**——学生按中文语序把 `not` 插在 `better` 前面；**而英语的 `not` 站在 `better` 后面** | `not` |
| **4** | `* We had better going now.` | **`better` 长得像 L76 的比较级**——学生按「形容词后面」的感觉接了 `-ing`（L131／L77 的 `feel`／`keep` 习惯回流） | `going` |
| **5** | `* We are better go now.` | **中文「我们最好…」的「是」隐含**——学生按「主语 ＋ be」的习惯补了 `are` | `are` |
| **6** | `* You should better go now.` | **L47 `should` 回流干扰**：学生把「应该」和「最好」叠一起 | `should` |

**⇒ 干扰点总结**：**最危险的是 #1 和 #6**——这两条不是「中文干扰」，**是「我方已教内容的干扰」**（L47 的「不变词家族」规矩 ＋ L47 的「应该」轴）。**#1 是本课存在的理由**（它证明 `had better` 教的不是 L47 的同义词）。

### 5.3 `wrongMark` 惯例（两课共同的写课约束）

**全库 `wrongMark` 清单（552 处，前 20 名）**：`is` 34／`to` 30／`read` 14／`a` 12／`have` 10／`are` 9／`look` 8／`not` 8／`go` 7／`eat` 7／`use` 7／`yesterday` 6／`get` 6／`am` 5／`like` 5／`see` 5／`don't` 5／`was` 5／`will` 5／`the` 4…

**多词标记有先例**（36 种，如 `you don't`／`Did you finish`／`has left`／`each other`／`those one is`）——**所以本批若需要（如 `had not better`）可以用多词标记，但建议优先单词标记以保持与最近批次一致。**

---

## §6 场景设计

### 6.1 场景 ID 合法性（必读）

**合法 ID（14 个，`src/components/AdventureScene.tsx` 第 6–19 行 `AdventureSceneId` 联合类型 + 第 20–23 行 `ADVENTURE_SCENE_IDS`）**：

```
campus ／ city ／ train ／ lighthouse ／ desert ／ space ／ ocean ／ island ／ mansion ／ forest ／ snow ／ magic ／ mystery ／ sparkle
```

**本轮实测：全库 169 处 `scene` 字段全部合法，0 违规。**

```bash
node -e '
const {readFileSync}=require("fs");
const GL=readFileSync("src/data/grammarLessons.ts","utf8");
const legal=new Set(["campus","city","train","lighthouse","desert","space","ocean","island","mansion","forest","snow","magic","mystery","sparkle"]);
const ids=[...GL.matchAll(/^    scene: "([^"]*)",/gm)].map(m=>m[1]);
console.log("total",ids.length,"illegal",JSON.stringify([...new Set(ids.filter(i=>!legal.has(i)))]));
'
# → total 169 illegal []   ✅
```

### 6.2 全库场景使用分布（node 实测 169 课）

| 场景 | 课数 | 最近使用 | 判读 |
|---|---|---|---|
| **`mansion`** | **61** | 145,146,147,148,149,150,151,153 | ⛔ **严重饱和，本批禁用** |
| **`campus`** | **50** | 152,156,162,163,164,165,167,168 | ⛔ **饱和＋L163–168 刚连用 6 课，本批禁用** |
| `city` | 29 | 121,136,140,154,158,161,166,169 | ⛔ 偏多，本批不用 |
| `sparkle` | 9 | 42,78,101,110,117,122,127,137 | ⚠️ 中等偏多 |
| `island` | 5 | 7,17,31,43,71 | ⚠️ 尚可 |
| `train` | 4 | 8,11,15,155 | ✅ **很空** |
| `mystery` | 4 | 24,33,85,157 | ✅ 很空 |
| `forest` | 2 | 10,75 | ✅ **很空** |
| `magic` | 2 | 12,45 | ✅ 很空 |
| **`snow`** | **1** | **19** | ✅✅ **最空** |
| **`ocean`** | **1** | **159** | ⚠️ **批三十刚首用** |
| **`lighthouse`** | **1** | **160** | ⚠️ **批三十刚首用** |
| **`desert`** | **0** | — | ✅✅✅ **完全未用** |
| **`space`** | **0** | — | ✅✅✅ **完全未用** |

**复跑命令**：

```bash
node -e '
const {readFileSync}=require("fs");
const lines=readFileSync("src/data/grammarLessons.ts","utf8").split("\n");
const starts=[]; lines.forEach((l,i)=>{ if(/^\s{4}id: "lesson-[^"]+",\s*$/.test(l)) starts.push(i); });
const cnt={},arr={};
for(let k=0;k<starts.length;k++){
  const s=starts[k], e=(k+1<starts.length?starts[k+1]:lines.length);
  const t=lines.slice(s,e).join("\n");
  const n=+t.match(/number:\s*(\d+),/)[1], sc=t.match(/scene: "([^"]*)"/)[1];
  cnt[sc]=(cnt[sc]||0)+1; (arr[sc]=arr[sc]||[]).push(n);
}
for(const [k,v] of Object.entries(cnt).sort((a,b)=>b[1]-a[1])) console.log(k,v,"last:",arr[k].slice(-8).join(","));
'
```

### 6.3 L170 场景锚：`whole` → 场景 `snow`（全库仅 1 课）

**为什么选 `snow`**：① 全库仅 L19 用过（**最空的可用场景**）；② **「一整天都在下雪」是 `whole` 的天然语义场**（时长 ＋ 完整）；③ `desert`／`space` 虽然完全未用，但**它们与 `whole` 的语义场没有天然联系**（沙漠／太空场景里说「整本书」很别扭）。

**⚠️ 与 L19 的间隔核查**：L19 的场景设定是「下雪了，小美和同学在院子里堆雪人，**玩了一整个下午**」——**间隔 151 课**（L19 → L170），且 L19 的英语句子是 `I was busy and happy.`（**没教 `whole`**）。**两课的叙事要素可以完全不同**（L19＝堆雪人／玩耍；L170＝在家读完整本书）。

**零件盘点（逐词实测词次，GL／HC 双文件，词边界口径）**：
`snow` **15**／4 ｜ `snowy` **13**／0 ｜ `cold` **301**／16 ｜ `home` **173**／51 ｜ `window` **168**／16 ｜ `tea` **256**／19 ｜ **`book` 521**／55 ｜ `books` **255**／58 ｜ `read` **207**／28 ｜ **`finished` 86**／7 ｜ **`day` 256**／42 ｜ `warm` **10**／0 ｜ `outside` **9**／2 ｜ `cup` **170**／17 ｜ `chair` **13**／6 ｜ **`whole` 0／0 ← 须造（唯一新词）**

**⇒ 造词成本：1 个（`whole`）**。**其余零件全部在库、且词次极充足**（`book` 521／`day` 256／`read` 207／`finished` 86）。

**推荐目标句零件核算**：`I finished the whole book.`（6 词）＝ `I` ／ `finished`（86）／ `the`（2525）／ **`whole`（0 ← 本课新造）** ／ `book`（521）—— **5 个零件在库、1 个新造**。

### 6.4 L171 场景锚：`had better` → 场景 `train`（全库 4 课）

**为什么选 `train`**：① 仅 4 课用过（8／11／15／155），**最近一次 L155（间隔 16 课，本批最远）**；② **「末班车快没了，我们最好现在就走」是 `had better` 的完美语义场**（**有负面后果的强建议**——正是我们用来与 `should` 切开的那个切口）；③ `desert`／`space` 仍未用，但**「赶末班车」在沙漠／太空里说不通**。

**零件盘点（逐词实测词次）**：
`train` **4**／0 ｜ `station` **2**／6 ｜ `bus` **29**／7 ｜ **`late` 79**／16 ｜ `dark` **52**／2 ｜ **`now` 44**／5 ｜ **`go` 682**／143 ｜ `home` **173**／51 ｜ `wait` **91**／11 ｜ `sky` **45**／2 ｜ `clock` **29**／8 ｜ `door` **152**／19 ｜ `soon` **151**／23 ｜ `last` **32**／19 ｜ `had` **91**／7（⚠️ 全是 L107／L110 的「让我做」）｜ `better` **85**／7（⚠️ 全是 L76 的「好多了」）｜ **`had better` 整串 0／0 ← 须造**

**⇒ 造词成本：1 个词位（`had better` 整串）**。**`had`／`better` 两词都已面熟**（L107／L76），**但整串是零**。

**推荐目标句零件核算**：`We had better go now.`（5 词）＝ `We`（252）／ **`had better`（0 ← 本课新造）** ／ `go`（682）／ `now`（44）—— **3 个零件在库、1 个新造**。

**⚠️ 场景零件的一个诚实提醒**：`train` 场景的既有零件**词次偏低**（`train` GL 4／`station` GL 2）。**若写课方要把场景做实（站台、末班车、钟），需要新造词**（`platform` GL 0／`bell` GL 0）。**建议：场景叙述用「等车／天黑了／现在就走」这类现有零件承担，不引入新场景名词**——**或把场景从 `train` 换成 `city`（29 课，偏多但零件足）**。**本报告推荐 `train`**，因为 `city` 已经 29 课。

### 6.5 零雨线纪律核查（两课均通过）

**L109 专属叙事资产**（**不得触碰**）：`rain`／`raining`／`rainy`／`stops`／`stopped`／`the movie`／`ends`／`ended`。实测 L109 一课独占 `rain` 45／`stopped` 41／`stops` 8／`the movie` 7／`ends` 1（**合计 102 处，全库最高**）。

**我为本批设计的全部句子（§7）逐条查过：零命中这 8 个资产**（GL 0／HC 0）。

```bash
node -e '
const {readFileSync}=require("fs");
const GL=readFileSync("src/data/grammarLessons.ts","utf8");
const HC=readFileSync("src/data/huntCases.ts","utf8");
const esc=(w)=>w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
function has(f,s){ const w=s.replace(/[.?!]$/,"").toLowerCase().split(/\s+/);
  return (f.match(new RegExp(w.map(esc).join("[^A-Za-z]+"),"gi"))||[]).length; }
for(const s of ["I finished the whole book.","We had better go now.","We had better not go now."])
  console.log("GL"+has(GL,s),"HC"+has(HC,s),s);
'
# → GL 0 HC 0（三行，零雨线资产零命中）
```

---

## §7 逐课规格（推荐 2 课）

**⚠️ 编号提醒**：任务书说「当前 162 课」，但我实读期间库已到 **169 课**。**本规格按 169 课口径编号（L170／L171）**；**若写课方以 162 课为基准，则编号应为 L163／L164**——**编号以写课时的实际库状态为准，本报告的 id／title／grammarLabel 全部可直接复用**。

**配套规模提醒**：`season-32`（L163–165）与 `season-33`（L166–169）**已被并行 agent 占用**；`can-do` 已到 `can-do-m33`。**若本批落地，需要 `season-34` ＋ `can-do-m34`**（以及新案 #179／#180）。

**封面提醒**：`cover1`–`cover117` **全部已被用过**（**无全新封面可用**；`cover45` 已用 3 次为最高）。**建议复用低次数封面或新造 `cover118`／`cover119`**——**这是本批新增的一个成本项，任务书未提。**

### 7.1 L170 规格（轴 B · `whole`）

| 项 | 内容 |
|---|---|
| **课注 id** | `lesson-170-whole` |
| **number** | `170` |
| **title** | **「整本书都读完了」** |
| **grammarLabel** | **「整个 · whole 管一个完整的」** ← ✅ 零术语（29 词全过） |
| **目标句** | **`I finished the whole book.`** ← **6 词 ✅** |
| **场景** | **`snow`** ← ✅ 合法 ID（全库仅 L19 用过） |
| **一句话规则** | 「说「**整**」用 whole——**I finished the whole book**（我把整本书读完了）。它管的是**一个东西从头到尾**；后面那个东西只说一个、前面要带上 the 或者 a。」 ← ✅ 零术语（**注意：不能说「接单数」——「单数」在 29 词红线表里**） |
| **blocks** | `{ text: "I finished", role: "我读完了" }` ／ `{ text: "the whole book", role: "整本书（一个东西从头到尾）" }` |
| **episode** | 「小美的一天 一百七十」 |
| **sceneSetupZh** | 「雪下了一整天，小美没出门。下午她把那本书翻到最后一页，合上——整本都读完了。」 |
| **dialogueEn** | `I finished the whole book.` |
| **intentZh** | 「我把整本书都读完了。」 |

**对比卡 6 条（3 带标记 ＋ 3 双正解）**：

| # | 类型 | wrong | wrongMark | correct | whyZh 方向（零术语） |
|---|---|---|---|---|---|
| **1** | 带标记 | `I finished the whole books.` | **`books`** | `I finished the whole book.` | 「整个」说的是**一个东西从头到尾**——后面那个东西只说一个，不加 s。【查重 GL 0／HC 0 ✅】 |
| **2** | 带标记 | `I finished all a book.` | **`all`** | `I finished the whole book.` | 想说「整整一本」要用 whole：**a 和 whole 能搭，a 和 all 搭不上**。【GL 0／HC 0 ✅】 |
| **3** | 带标记 | `I drank the whole milk.` | **`whole`** | `I drank all the milk.` | 数不清的东西（milk、water）**只能用 all the，不能用 the whole**——这一格 all 站得住、whole 站不住。【GL 0／HC 0 ✅】 |
| **4** | 双正解 | `All the books are good.` | `null` | `I finished the whole book.` | 两句都对——第 151 课那个 all 管**三个以上、一群**；今天这个 whole 管**一个东西的完整**。【GL 40／HC 1；practice 复用 3 课（151,152,157）✅ 余量足】 |
| **5** | 双正解 | `Every book is good.` | `null` | `I finished the whole book.` | 两句都对——第 152 课那个 every 说**一本一本里的每一本**；今天这个 whole 说**一整本**。【GL 2／HC 0 ✅】 |
| **6** | 双正解 | `I finished my homework.` | `null` | `I finished the whole book.` | 两句都对——同一件事做完的说法，一个具体说是什么、一个没说。【GL 5／HC 0 ✅；注意：此句在 **L64** 有 4 处，**不是 practice 复用**】 |

**变体三态**：

| 态 | 英文 | 中文 | noteZh |
|---|---|---|---|
| 肯定 | `I finished the whole book.` | 我把整本书读完了。 | whole 前面带上 the——光着站可不行。 |
| 否定 | `I did not finish the whole book.` | 我没把整本书读完。 | not 跟 did 走（第 13 课老规矩），whole book 不动。【GL 0／HC 0 ✅】 |
| 疑问 | `Did you finish the whole book?` | 你把整本书读完了吗？ | Did 搬句首（第 13 课），finish 穿原样。【GL 0／HC 0 ✅】 |

**复现取材建议**：

| 复现对象 | 取句 | 查重状态 |
|---|---|---|
| L151 `all`（三个以上） | `All the books are good.` | practice 已 3 课（151,152,157）→ **加到第 4 课仍在 ≤6 内 ✅** |
| L152 `every`（一个一个） | `Every book is good.` | practice **0 课** ✅（examples 在 L152 有 1 处） |
| **不建议**复现 L114 `a few` | — | `There are a few apples.` 已 3 课（114,117,118）；**本课语义不需要它** |

**案件设计建议（`hunt-whole-book`，编号 #179）**：

| 项 | 建议 |
|---|---|
| 标题 | 「窗台边的书」 |
| 场景叙述 | 「雪下了一整天。窗台上摊着一本书，翻到最后一页，旁边一张小纸条。」 |
| 植错（4 处，2–4 达标） | ① `I finished the whole books.` → `books`（标记 `plural`，多 s）／② `I read all a book yesterday.` → `all a` → `a whole`（标记 `article`／`word_order`）／③ `I drank the whole milk.` → `whole` → `all the`（标记 `article`）／④ 回流：`I go to home.` → `go` → `went`（标记 `tense`，**L9 回流**） |
| 查重 | ④ 号句 `I go to home.` **GL 1／HC 2**（**已在库，需换**）→ **建议改用 `We is late.`（GL 0／HC 0 ✅）或 `I eat two cake.`（GL 0／HC 0 ✅）** |

**⚠️ 新增成本的诚实提醒**：`I finished the whole book.` 的 `finished` 是 **L64 教的**（`I finished reading the book.`，GL 31），**学生到 L170 已学过 100+ 课**，**难度合适**。但 **`whole` 必须新造词位**——这是本课唯一成本。

### 7.2 L171 规格（轴 A · `had better`）

| 项 | 内容 |
|---|---|
| **课注 id** | `lesson-171-had-better` |
| **number** | `171` |
| **title** | **「我们最好现在就走」** |
| **grammarLabel** | **「最好… · had better（永远用 had）」** ← ✅ 零术语 |
| **目标句** | **`We had better go now.`** ← **5 词 ✅** |
| **场景** | **`train`** ← ✅ 合法 ID（全库仅 4 课） |
| **一句话规则** | 「说「**最好**…（不然会误事）」用 **had better**——**We had better go now**（我们最好现在就走）。它就长这样：**永远用 had**，后面那个动作穿原样、**不垫 to**。」 ← ✅ 零术语 |
| **blocks** | `{ text: "We had better", role: "我们最好（口气比 should 重一点）" }` ／ `{ text: "go now", role: "现在就走（动作穿原样）" }` |
| **episode** | 「小美的一天 一百七十一」 |
| **sceneSetupZh** | 「车站的钟指到八点，天已经黑了。小美看了一眼时刻表，拉了拉同伴的袖子——再不走就赶不上末班车了。」 |
| **dialogueEn** | `We had better go now.` |
| **intentZh** | 「我们最好现在就走。」 |

**对比卡 6 条（3 带标记 ＋ 3 双正解）**：

| # | 类型 | wrong | wrongMark | correct | whyZh 方向（零术语） |
|---|---|---|---|---|---|
| **1** | 带标记 | `We have better go now.` | **`have`** | `We had better go now.` | 这句话**永远是 had**，不管说的是今天还是昨天——换成 have 就走样了。【GL 0／HC 0 ✅】**（这条正是 L47「不变词家族」规矩的干扰，见 §2.5）** |
| **2** | 带标记 | `We had better to go now.` | **`to`** | `We had better go now.` | 后面那个动作穿原样、**不垫 to**——had better go，中间不加东西。【GL 0／HC 0 ✅】 |
| **3** | 带标记 | `We had not better go now.` | **`not`** | `We had better not go now.` | 中文说「最好不要」，那个「不」在**后面**——had better **not** go。【GL 0／HC 0 ✅】 |
| **4** | 双正解 | `You should sleep early.` | `null` | `We had better go now.` | 两句都对——第 47 课那个 should 是「应该」（中性建议）；今天这个 had better 是「最好…**不然会误事**」，口气重一点。【practice 已 3 课（47,74,168）→ **加到第 4 课仍 ≤6 ✅**】 |
| **5** | 双正解 | `Why don't you take a rest?` | `null` | `We had better go now.` | 两句都对——第 168 课那句是「你怎么不…」（商量口气）；今天这句是**自己这一边也该动身了**。【practice 已 1 课（168）✅】 |
| **6** | 双正解 | `The teacher had me come early.` | `null` | `We had better go now.` | 两句都对——第 107 课那个 had 后面跟着**人**（had **me** come，让我做）；今天这个 had 后面跟着 **better**（had **better** go，最好…）。同一个 had，后面跟的东西不一样。【practice 已 2 课（107,110）→ **加到第 3 课 ✅**】 |

**变体三态**：

| 态 | 英文 | 中文 | noteZh |
|---|---|---|---|
| 肯定 | `We had better go now.` | 我们最好现在就走。 | had better ＋ 动作穿原样。【GL 0／HC 0 ✅】 |
| 否定 | `We had better not go now.` | 我们最好现在别走。 | not 站在 better **后面**——had better 【not】 go。【GL 0／HC 0 ✅】 |
| 疑问 | `Had we better go now?` | 我们最好现在就走吗？ | Had 搬到句首（跟 are／did 一个搬法）。【GL 0／HC 0 ✅】 |

**复现取材建议**：

| 复现对象 | 取句 | 查重状态 |
|---|---|---|
| L47 `should` | `You should sleep early.` | practice 已 3 课（47,74,168）→ **第 4 课 ✅** |
| L168 `Why don't you` | `Why don't you take a rest?` | practice 已 1 课（168）→ **第 2 课 ✅** |
| L107 `had me come` | `The teacher had me come early.` | practice 已 2 课（107,110）→ **第 3 课 ✅** |
| **L76 `much better`（⚠️必须做对照）** | 建议**只在 `deepDive` 里认读**，不进 practice | `I feel much better today.` practice 已 3 课（76,78,131）→ 若要加也在 ≤6 内，**但本课语义不需要，且加了会强化混淆**——**建议只在讲解里点一句**（「第 76 课那个 better 是『更好』，今天这个 better 是『最好』的半个身子，两个别串」） |

**案件设计建议（`hunt-catch-train`，编号 #180）**：

| 项 | 建议 |
|---|---|
| 标题 | 「站台上的纸条」 |
| 场景叙述 | 「天黑了，站台上人不多。长椅上留着一张字条，是同伴写的几句话。」 |
| 植错（4 处，2–4 达标） | ① `We have better go now.` → `have`（标记 `verb_form`）／② `We had better to go now.` → `to`（标记 `verb_form`／`word_order`）／③ `We had not better go now.` → `not`（标记 `word_order`）／④ 回流：`We is late.` → `is`（标记 `sv_agreement`，**GL 0／HC 0 ✅**） |
| 查重 | ①②③ **全部 GL 0／HC 0 ✅**；④ `We is late.` **GL 0／HC 0 ✅**（**已避开**批三十一用过的 `We is at school.`／`We need two chair.`／`She read book.`／`They watch TV yesterday.`） |

**⚠️ 新增成本的诚实提醒**：**`had better` 整串须造**（GL 0／HC 0）。**`'d better` 缩写形不须新造**——**L169 已经付掉了 `'d` 的账**（`'d` 现 GL 49 处）。**但不建议本课教 `'d better`**（一课一增量：本课增量已经是「词形 ＋ 不垫 to ＋ not 位置」三条，再加缩写会超载）。

---

## §8 与已教内容的切分

### 8.1 L170 `whole` 的最近邻：L151 `all`（切分点 ＝ **「管一个」还是「管一群」**）

| 课 | 词 | 管几个 | 后面 | 本课怎么切 |
|---|---|---|---|---|
| **L151（已教）** | `all` | **三个以上／一群** | 带 s、配 `are`；**数不清的也能用** | 逐字：「它管的是三个以上，一个都不落下」 |
| **L170（本课）** | **`whole`** | **一个东西的完整** | **单数**、**前面必须带 the／a** | **新面**：`the whole book`（一整本） |

**第二近邻：L152 `every`**（`Every student is here.`）——**every 说「一个一个里的每一个」，`whole` 说「一个东西的一整份」**。两者都涉及「单数」，但**方向相反**（every 从群体里数每一个；whole 从一个东西里说完整）。

**第三近邻：L114 `a few`／`few`（a 在不在，意思反一半）**——**⚠️ 这是最容易混的一课**，因为 **L114 教的正是「那个小 a 有没有、意思不一样」**，而 **`whole` 的硬规则①也涉及 `a`**（`a whole day` ✅ vs `all a day` ❌）。**切分点**：L114 的 `a` 管**「够不够」**；`whole` 的 `a` 管**「一整个」**（`a whole day` 就是「一整天」）。**必须在 deepDive 里点明这两处的 `a` 不是一回事。**

**⚠️ 另一个必须登记的既有占用**：**「整个」这个中文锚点在库里已有 12 处**，其中 **L149（3 处）／L157（2 处）是「整个换人」的意思**（如 L149 逐字「有「不」的时候，最前面那个词**整个**换人」）——**那是「整个」当副词用（＝ completely），不是本课要教的 `whole`（＝ 整一个东西）**。**写课时要避开这个歧义**，建议中文锚点用「**一整**」而非「整个」（库中「一整个」仅 7 处，且都是讲解用语；「整整」0 处、「整本」0 处——**都是干净可用的**）。

### 8.2 L171 `had better` 的最近邻：L47 `should`（切分点 ＝ **口气强度 ＋ 词形规矩**）

| 课 | 词 | 中文 | 口气 | 词形规矩 | 后面 |
|---|---|---|---|---|---|
| **L47（已教）** | `should` | 应该 | **中性** | **不变形**（家族成员） | 动作原样 |
| **L168（已教）** | `Why don't you` | 你怎么不… | **轻／商量** | 助动词搬句首 | 动作原样 |
| **L171（本课）** | **`had better`** | **最好…（不然）** | **重／有后果** | **永远 had（不是 have）** | **better ＋ 动作原样** |

**切分三句话（写课口径）**：

1. **中文不同**：L47 是「**应该**」、L168 是「**你怎么不**」、本课是「**最好**」——**中文本身三个词**。
2. **口气不同**：本课的中文「最好」**天生带「不然会误事」**——**这是 L47 没有的**（`should` 只是「这样做对」）。
3. **形状不同（最硬）**：**`had better` 里的 had 是过去形状、却是固定件**——**这正好和 L47「不变词家族」（can／must／should 从来不变形）相反**，所以**学生按 L47 的规矩会写 `have better`**。**这条错的存在本身就证明两课不重复。**

**第二近邻：L107 `had me come`**——**切分点 ＝ `had` 后面跟「人」还是跟「better」**（§2.3 已详述：跟人是「让我做」，跟 better 是「最好…」）。

**第三近邻：L76 `much better`（本批重点）**——**切分点 ＝ `better` 是「更好」（形容词）还是「最好…」的半个身子**。**§2.3 已给出 6 维分离表**（前面那个词／后面接什么／能不能换词／中文／位置／身份，**全部不同**）。

### 8.3 一句话总表

| 本课 | 最近邻 | 切分点（一句话） |
|---|---|---|
| **L170 `whole`** | L151 `all` | **all 管一群，whole 管一个的完整**；且 **a／数不清的东西**两格只有一边能站 |
| **L171 `had better`** | L47 `should` | **should 中性、had better 有后果**；且 **had better 永远用 had，正好违反 should 家族的不变形规矩** |

---

## §9 未核实项（诚实登记）

| # | 项 | 影响 | 状态 |
|---|---|---|---|
| **1** | **⚠️ 数据文件在本轮实读期间增长（162 课 → 169 课）** | **高**——本轮全部数字基于 169 课快照；**若写课时库又变了，逐课归因需重跑** | **已登记（§0.2）**；冻结快照 shasum 已给 |
| **2** | **`had better` 的 Murphy 课程位未复核** | **中**——普查 §6 项 1 已登记「Murphy 双册 TOC 本轮完全未取到」；**本报告未新增取证**（本机 `find *murphy*` 上一轮已 0 命中，本轮未重跑） | 延续普查 |
| **3** | **Cambridge 原文用 WebFetch 而非直连** | **中**——`dictionary.cambridge.org` 直连 403，本轮与普查同级；**但两轮独立取到的 `whole` 条文一致（互证）**，`had better` 的 5 条规则本轮独立取到且与普查一致 | 延续普查 §6 项 3；**互证已加强** |
| **4** | **`several` 的「两个以上」下限在中文里没有对应语感** | **中**——这是轴 C 判缓排的核心理由之一，但**「零基础学生能否内化这个刻度」需要真人测试**（本报告无真人数据） | **未核实**——建议若做轴 C，先做小规模真人验证 |
| **5** | **`had better` 与 L168 的教学顺序影响** | **中**——L168（`Why don't you`）与 L171（`had better`）相隔 3 课，**学生可能把两个「建议」混在一起**；**本报告建议 L171 的 deepDive 明确点出「第 168 课那个是商量、今天这个是提醒后果」**，但**实际混淆率未测** | **未核实**——建议列入下次走查的观测点 |
| **6** | **封面池已耗尽**（`cover1`–`cover117` 全部用过） | **中**——本批若落地需复用（`cover45` 已 3 次）或新造 `cover118`／`cover119`。**任务书未提这项成本，是本轮新发现** | **已登记（§7 提醒）** |
| **7** | **`season-32`／`season-33`／`can-do-m33` 已被并行 agent 占用** | **中**——本批需 `season-34` ＋ `can-do-m34`；**若并行 agent 继续推进，编号会再变** | **已登记（§7 提醒）** |
| **8** | **`targetSentence` ≤8 词有 3 课例外**（L86＝10／L101＝12／L102＝14） | **低**——这 3 课都是「收口／混排」性质的既有课，**红线在历史上已有例外**；**本批两课均 5–6 词，不涉** | **已登记（§0.4）** |
| **9** | **本批未做真人可读性测试** | **中**——`whole` 的「一整 vs 整个」锚点选择、`had better` 的口气解释，**都只有纸面论证** | **未核实** |
| **10** | **HC 侧案件资产只做了查重，未做难度闸门复核** | **低**——§7 的案件设计建议**只保证「错句不重复」**，未核 `tag` 分布与既有 178 案的一致性 | **未核实** |

---

## 附录 A：本轮实测结果汇总

### A.1 规模与快照

| 项 | 值 |
|---|---|
| 课数 | **169**（任务书声明 162） |
| 案数 | **178**（任务书声明 171） |
| 季数 | **33**（任务书声明 31） |
| `can-do` 里程碑 | **33**（到 `can-do-m33`／L162） |
| 封面资产 | **117**（`cover1`–`cover117`） |
| `GL.ts` shasum | `3af849811fab0802b2fc9c83ccb811eeac6294da6926ca713cb0e05e94cd7f0c` |
| `HC.ts` shasum | `9a94849e88ca8272b4d0fbbe1793fb960b30659d20c4e2e21dcb0219aed10ce2` |

### A.2 三轴词频（词边界口径，GL＋HC 双文件）

| 词串 | GL | HC |
|---|---|---|
| `whole` | **0** | **0** |
| `several` | **0** | **0** |
| `had better`（整串） | **0** | **0** |
| `better` | 85（**L76 占 59**） | 7 |
| `had` | 91（**L107 占 65**） | 7 |
| `all` | 127 | 19 |
| `few` | 98 | 13 |
| `some` | 186 | 16 |
| `any` | 88 | 8 |
| `many` | 116 | 13 |
| `most` | 115 | 15 |
| `should` | 174 | 11 |
| `'d`（撇号 d） | **49** | 5 |

### A.3 结构红线（全库实测）

| 断言 | 结果 |
|---|---|
| 全库 contrast「恰好 6 条」 | ✅ **169/169 无例外** |
| `practice` 口径同句 ≤6 课 | ✅ **最高 6**（0 句越线） |
| 非法 `scene` ID | ✅ **0 违规**（169 处全合法） |
| `targetSentence` ≤8 词 | ⚠️ **166/169**（L86／L101／L102 例外） |
| 零术语（三字段守门） | ✅ 本批设计的 `grammarLabel`／`oneLineRule`／`summary.rule` 全过 |

### A.4 本批设计句查重（连续子序列口径，GL／HC 双文件）

**14 句全部 GL 0／HC 0** ✅：`I finished the whole book.`／`I did not finish the whole book.`／`Did you finish the whole book?`／`I finished the whole books.`／`I finished all a book.`／`I drank the whole milk.`／`We had better go now.`／`We had better not go now.`／`Had we better go now?`／`We have better go now.`／`We had better to go now.`／`We had not better go now.`／`We is late.`／`I eat two cake.`

**复现取材句的 practice 占用**（均 ≤6，余量足）：`All the books are good.` 3（151,152,157）→ **4** ✅ ｜ `You should sleep early.` 3（47,74,168）→ **4** ✅ ｜ `Why don't you take a rest?` 1（168）→ **2** ✅ ｜ `The teacher had me come early.` 2（107,110）→ **3** ✅ ｜ `Every book is good.` 0 → **1** ✅

### A.5 场景使用分布（169 课）

| 场景 | 课数 | 场景 | 课数 |
|---|---|---|---|
| `mansion` | **61** ⛔ | `train` | **4** ✅ |
| `campus` | **50** ⛔ | `mystery` | 4 ✅ |
| `city` | 29 ⛔ | `forest` | **2** ✅ |
| `sparkle` | 9 ⚠️ | `magic` | **2** ✅ |
| `island` | 5 ⚠️ | **`snow`** | **1** ✅✅ |
| `ocean` | 1（L159 批三十）⚠️ | **`desert`** | **0** ✅✅✅ |
| `lighthouse` | 1（L160 批三十）⚠️ | **`space`** | **0** ✅✅✅ |

---

## 附录 B：推荐一览表（给主理人的决策卡）

| 项 | L170（推荐） | L171（推荐） | 轴 C `several`（缓排） |
|---|---|---|---|
| **轴** | B `whole`（整个） | A `had better`（最好…） | C `several`（几个） |
| **档位（普查）** | B（↑从 C＋） | B | B |
| **课量** | **1 课** | **1 课** | **0 课（建议并进数量表收口）** |
| **目标句** | `I finished the whole book.`（6） | `We had better go now.`（5） | — |
| **场景** | **`snow`**（1 课，最空） | **`train`**（4 课，很空） | — |
| **独立增量** | **3 条硬规则** | **3 条（词形／不垫 to／not 位置）** | 1.5 条（刻度 ＋ 可数复数） |
| **造词成本** | **1**（`whole`） | **1**（`had better` 整串） | 1（`several`） || **撞已教** | **低**（L151 是补格） | **中**（L47＋L168 同轴，但词形／句法全新） | **中高**（L114 同轴 ＋ 中文锚点 17 课占用） |
| **中文负迁移强度** | **强**（「整」的形状 vs 限定词规矩） | **强**（且含「已教内容干扰」#1 `have better`） | 中（「几个」中文无下限） |
| **建议** | ✅ **做** | ✅ **做** | ⏸ **缓排** |

---

## 附录 C：给主理人的三条机制提醒（与本批直接相关）

1. **⚠️ 数据文件正在被并行修改**——本轮开工时 162 课、收工时 169 课（**30 分钟内长了 7 课**）。**建议：写课前先冻结快照并记 shasum（本报告 §0.2 已示范），否则逐课归因会失效。** 批三十一 §6 携带项 7 说的「多 agent 并行时测试时序」是同一类问题的测试侧表现——**这是内容侧的表现**，建议一并正式写入流程。

2. **⚠️ 封面池已耗尽**（`cover1`–`cover117` 全部用过，`cover45` 已 3 次）。**任务书与本批上游文档均未提这项成本**——**建议登记为固定携带项**，并在封面资产扩充前不再假定「复用即可」。

3. **`wrongMark` 的「同课不重复」不是硬约束**（实测 **36 课在课内重复使用过同一个标记**，如 L49 的 `to` 用 3 次、L35／L37 的 `is` 用 4 次）。**但最近几批的事实标准是「3 条标记互不相同」**——**本报告的两课规格都按事实标准设计**（L170：`books`／`all`／`whole`；L171：`have`／`to`／`not`）。

---

> 本报告由产品战略团队 AI 协作生成（研究员：瑞思），重要决策请由产品负责人审定。
