# B 档收口确认 ＋ 新候选评估（用户研究 · 瑞思）

**日期**：2026-09-21 ｜ **类型**：收口确认 ＋ 新候选档位评估（非课程批次）｜ **作者**：瑞思（用户研究员）
**上游**：`b-tier-frontier-survey-2026-09-20.md`（批三十一普查）／`user-research-grammar-thirty-fourth-batch-2026-09-21.md`／`competitive-analysis-grammar-thirty-fourth-batch-2026-09-21.md`（`as far as` 线索源）
**下游**：主理人裁决 §3；若取 §4 则由 pm 立批

---

## 📌 一句话结论

**B 档清单可以宣告清空（在原普查口径内）——9 项「判不做」全部维持，但 4 项理由需改写；8 项新候选里发现 2 项真缺口（`had to` ／ `so ... that` ＋ `such a`），其中 `had to` 是本轮唯一建议立独立课的一项。新候选轴 `as far as` 判不做。**

---

## §0 本轮实测基线

**全部实测，命令可复跑。** 以下数字是本报告所有判断的地基。

### 0.1 数据规模

| 项 | 实测值 | 复核方式 |
|---|---|---|
| 课数 | **187**（L1–L187，`number` 无跳号、无重复） | 解析 `grammarLessons.ts` 顶层记录 |
| 案数 | **196**（number 1–196 连续） | 解析 `huntCases.ts` |
| 季数 | **28**（区间 1–187 全覆盖，无静默过滤缺口） | 解析 `grammarSeasons.ts` ＋ 覆盖检查 |
| 合法场景 | **14 个** | `AdventureScene.tsx` 第 6–19 行 |
| 零术语词表 | **29 词** | `grammarZeroTerms.ts` |

```bash
cd /Users/liujun/Documents/英语听写 && node -e '
const {readFileSync}=require("fs");
const GL=readFileSync("src/data/grammarLessons.ts","utf8");
const ids=[...GL.matchAll(/^\s*id:\s*"([a-z0-9-]+)",\s*$/gm)].map(m=>m[1]);
const nums=[...GL.matchAll(/^\s*number:\s*(\d+),/gm)].map(m=>+m[1]);
console.log("lessons:",ids.length,"nums:",nums.length,"max:",Math.max(...nums));
const uniq=[...new Set(nums)].sort((a,b)=>a-b);
const gaps=[]; for(let i=1;i<=Math.max(...nums);i++) if(!uniq.includes(i)) gaps.push(i);
console.log("gaps:",gaps.join(",")||"none");
'   # → lessons: 187 nums: 187 max: 187 / gaps: none
```

### 0.2 四条产品红线的实测复核

| 红线 | 实测结果 | 判定 |
|---|---|---|
| **`contrast` 恰好 6 条** | **187/187 全部 = 6** | ✅ 无例外（坐实任务书陈述） |
| **场景 ID 合法** | **187/187 全部在 14 个合法值内**，非法 **0** | ✅ |
| **目标句 ≤8 词** | **178/187 ≤8**；**9 课 >8** | ⚠️ **红线已被历史批次突破 9 次**（§0.3） |
| **practice 同句 ≤6 课** | 全库 701 句；**最高正好 = 6**（2 句触顶） | ⚠️ **触顶未越线** |

**触顶的两句（不得再引用）**：

| 句子 | 课数 | 课号 |
|---|---|---|
| `Yesterday I went to the park.` | **6（顶格）** | L21、L24、L93、L95、L100、L104 |
| `There is a book on the desk.` | **6（顶格）** | L26、L37、L55、L60、L114、L148 |

**0.1／0.2 合并复跑命令**（按「顶层记录 `^  {$`」切课，避开 118 行 import；同时出红线条数、场景分布、目标句词数）：

```bash
cd /Users/liujun/Documents/英语听写 && node -e '
const {readFileSync}=require("fs");
const GL=readFileSync("src/data/grammarLessons.ts","utf8");
const lines=GL.split("\n");
const start=lines.findIndex(l=>l.startsWith("export const grammarLessons"));
const starts=[];
for(let i=start+1;i<lines.length;i++){ if(/^  \{$/.test(lines[i])) starts.push(i); if(/^\];/.test(lines[i])) break; }
const L=[];
for(let k=0;k<starts.length;k++){
  const s=starts[k], e=(k+1<starts.length)?starts[k+1]-1:lines.length;
  const t=lines.slice(s,e).join("\n");
  const g=(re)=>{const m=t.match(re); return m?m[1]:null;};
  const i0=t.indexOf("contrast: ["); let cc=0;
  if(i0>=0){const cb=t.slice(i0);const en=cb.indexOf("\n    ],");cc=(cb.slice(0,en>0?en:cb.length).match(/wrong:\s*"/g)||[]).length;}
  L.push({n:+g(/number:\s*(\d+)/),scene:g(/scene:\s*"([^"]+)"/),t:g(/targetSentence:\s*"([^"]+)"/),cc});
}
console.log("contrast!=6:",L.filter(l=>l.cc!==6).length);
const AS=readFileSync("src/components/AdventureScene.tsx","utf8");
const legal=[...AS.matchAll(/^\s*\| "([a-z]+)"/gm)].map(m=>m[1]);
console.log("illegal scene:",L.filter(l=>!legal.includes(l.scene)).length);
const wc=s=>s.split(/\s+/).map(x=>x.replace(/[^A-Za-z0-9\x27]/g,"")).filter(Boolean).length;
console.log("targetWords>8:",L.filter(l=>wc(l.t)>8).length);
const sc={}; legal.forEach(x=>sc[x]=0); L.forEach(l=>sc[l.scene]++); console.log(sc);'
# → contrast!=6: 0 / illegal scene: 0 / targetWords>8: 9
# → { campus:56, city:37, sparkle:9, island:5, train:5, forest:3, magic:2,
#      mansion:61, snow:2, mystery:4, ocean:1, lighthouse:1, desert:1, space:0 }
```

### 0.3 目标句 ≤8 词的实测真相（**9 课超标**）

| 课 | 词数 | 目标句 |
|---|---|---|
| L86 | 10 | `Whose bag is this? It is next to the door.` |
| L101／L102 | 12／14 | `I was reading. It was raining. When you called, I was reading.`（L102 前加 `I was reading at eight.`） |
| L173 | 10 | `I got up early in order to catch the bus.` |
| L178 | 9 | `I had lost my key before I got home.` |
| L182 | 10 | `All the books are good, and she hasn't come yet.` |
| L183 | 11 | `Nobody is at home, and the cloud looks like a boat.` |
| L184 | 10 | `I can do it myself, and we help each other.` |
| L185 | 13 | `She can both sing and dance, and she likes neither tea nor coffee.` |

**读法**：**L182–L185 是收口课**（零新知、把整季排一行，天然长）；**L101／L102 是「多句排一行」型**；**L173／L178 是真实单句超标**（2 词／1 词）。
**⇒ 对 §4 的含义**：新批**必须守 ≤8 且逐课实算**。**不要**用「历史有 9 课超标」当放宽理由——**那是历史欠账，不是许可**。

### 0.4 场景使用分布（取景依据）

| 场景 | 课数 | 备注 |
|---|---|---|
| `mansion` | 61 | 最饱和 |
| `campus` | 56 | 第二饱和 |
| `city` | 37 | 第三 |
| `sparkle` | 9 | 收口课常用 |
| `island`／`train` | 5／5 | |
| `mystery` | 4 | |
| `forest` | 3 | L187 最近用过 |
| `magic`／`snow` | 2／2 | **用得少** |
| `ocean`／`lighthouse`／`desert` | **各 1** | L159／L160／L186 独占 |
| **`space`** | **0** | **唯一合法但全库零使用的场景** |

**⇒ 本轮取景结论**：`desert`／`ocean`／`lighthouse` 已被用过（与任务书一致），**`space` 是唯一从未使用的合法场景**——若新批要「首用新场景」的话题度，`space` 最干净。

### 0.5 季体量红线（不能再新建小季）

| 项 | 实测 |
|---|---|
| ≤3 课的小季 | **3 个**（`season-6` 47–49／`season-12` 76–78／`season-19` 125–127）**已达上限** |
| 守门断言 | `grammarSeasons.test.ts`：`tiny.length` **必须 ≤3** |
| 当前季尾 | `season-28`（182–187，6 课） |

**⇒ 两条硬结论**：
1. **新批若从 L188 起，必须扩 `season-28` 或新建 ≥6 课大季**；**再建 3 课小季会立刻让 test 变红**。
2. **L188 起必须同步扩季区间**——否则 `findSeasonByLessonNumber` 找不到 → **整课在路径页静默消失（无报错）**。这是 `grammarSeasons.test.ts` 头号守门项。

### 0.6 `contrast` 六条的真实配方分布

任务书说「3 带标记 ＋ 3 双正解」。实测**这是主流配方但不是唯一配方**：

| 配方 | 课数 | 占比 |
|---|---|---|
| **`3m+3b`（严格 3 带标记 ＋ 3 双正解）** | **74** | 39.6% |
| `2m+4b` | 29 | 15.5% |
| `6m+0b`（全带标记，第一季为主） | 23 | 12.3% |
| `5m+0b` | 12 | 6.4% |
| `4m+2b` | 12 | 6.4% |
| `1m+4b` | 11 | 5.9% |
| 其余（`2m+3b`／`5m+1b`／`4m+0b`／`4m+1b`／`3m+2b`／`3m+0b`） | 26 | 13.9% |

**最近的 12 课**（L176–L187）里 **`3m+3b` 占 9 课**；**L177 是 `2m+4b`，L184／L185 是 `4m+2b`**。
**⇒ 对 §4 的含义**：**「3 带标记 ＋ 3 双正解」应作为新批默认配方**（近 12 课的绝对主流），**但不必当成不可变红线**——库里已有 113 课不是这个配方。**唯一不可变的是「恰好 6 条」。**

**复跑命令**（在 §0.2 脚本的循环里，把统计项换成下面 4 行即可）：

```js
const cards=block.split(/\n      \{/).slice(1);
let m=0,b=0;
for(const c of cards){ const wm=c.match(/wrongMark:\s*(null|"[^"]*")/); if(wm&&wm[1]!=="null")m++; else if(/bothRight:\s*true/.test(c))b++; }
dist[m+"m+"+b+"b"]=(dist[m+"m+"+b+"b"]||0)+1;
// → 3m+3b 74 / 2m+4b 29 / 6m+0b 23 / 5m+0b 12 / 4m+2b 12 / 1m+4b 11
//   / 2m+3b 8 / 5m+1b 5 / 4m+0b 4 / 4m+1b 4 / 3m+2b 3 / 3m+0b 2  （合计 187）
```

### 0.7 覆盖层现状（新批的连带改动清单）

| 层 | 现状 | 新批需做 |
|---|---|---|
| 季 | 28 季，尾部 `season-28`(182–187) | **扩区间或新建 ≥6 课季**（§0.5） |
| can-do 里程碑 | 尾部 `can-do-m35`（`afterLesson: 187`，`GrammarPathPage.tsx:360`） | 新建 `can-do-m36` |
| 封面池 | `src/assets/lessons/` 共 **117 张，全部已用**（54 张各用 2 次） | **可复用**（无「首用新封面」空间，见 §5 项 5） |
| 案件 | 196 案；**191 被课程引用，5 案为番外孤儿**（`hunt-white-cat`／`hunt-sports-day`／`hunt-pen-pal-letter`／`hunt-fridge-note`／`hunt-term-review`） | 新课须配新案（#197 起） |
| 案件 tag | **10 个合法 tag**：`verb_form`(149)／`plural`(127)／`sv_agreement`(123)／`word_order`(88)／`tense`(73)／`preposition`(64)／`article`(32)／`fragment`(28)／`missing_be`(25)／`run_on`(19) | 新案 tag 必须取自这 10 个 |
| 测试基线 | `npx vitest run src/data/grammarSeasons.test.ts src/data/grammarLessons.test.ts` → **35 passed** | 改数据后须保持全绿 |

---

## §1 逐项收口确认表（9 项）

**复核方法**：每项走同一套五问——① 我方词频（词边界口径，node 实测）；② 中文锚占用；③ 与已教内容的关系（同义换词？）；④ 跨源档位（本轮重新实取）；⑤ **3 条带标记新错可否满足**。

### 1.1 汇总表

| # | 项 | GL 实测 | 原判理由是否成立 | 本轮判定 | 处置变化 |
|---|---|---|---|---|---|
| 1 | **`several`** | **0** | ✅ 全部成立，证据链比原记录更硬 | **维持不做** | 维持：转为 L114 刻度卡（已登记待办） |
| 2 | **`even if`** | **0** | ⚠️ **部分成立**——「增量只 1 条半」成立；「非独立页」本轮复核为真 | **维持不做独立课** | **改处置：折入对照卡**（§1.3） |
| 3 | **`as if`** | **0** | ✅ 全部成立（本轮跨源更薄） | **维持不做** | 维持 |
| 4 | **`as though`** | **0** | ✅ 成立（本轮再证无独立页） | **维持不做** | 维持 |
| 5 | **`ought to`** | **0** | ✅ 成立 | **维持不做** | 维持 |
| 6 | **`dare`** | **0** | ✅ 成立 | **维持不做** | 维持 |
| 7 | **`provided`** | **0** | ⚠️ **「无规则页」被推翻**（有落点，但是同页并列） | **维持不做** | **理由改写**（§1.8） |
| 8 | **`in case`** | **0**（`case` 亦 **0**） | ⚠️ **「无规则页」被推翻**（Cambridge 有独立页） | **维持不做** | **理由改写**（§1.9） |
| 9 | **`way`** | **38（5 课）** | ❌ **「词频近零」实测为假** | **维持不做** | **理由必须整条改写**（§1.10） |

**9 项全部维持「不做」。** 其中 **5 项原理由完全成立**；**4 项理由需改写／收窄**（`even if`／`provided`／`in case`／`way`）；**1 项理由链反被本轮加固**（`several`）。

**逐项词频复跑命令见附录 A.1**（一条命令同时输出 9 项 ＋ 8 项新候选的 GL／HC 计数）：

```
# → several 0/0 · even if 0/0 · as if 0/0 · as though 0/0 · ought to 0/0
#   dare 0/0 · provided 0/0 · in case 0/0 · case 0/1（注释）· way 38/3
```

---

### 1.2 `several` —— **维持不做**（理由链被加固）

**① 词频**：`several` **GL 0／HC 0**（真零，无假阳性）。

**② 中文锚「好几个」的占用（实测比原记录更重）**：**全库 68 处／20 课**。
逐课分布：`L5:8 L7:3 L11:8 L19:2 L26:11 L27:1 L30:1 L33:5 L37:1 L40:3 L50:1 L51:5 L54:2 L60:3 L84:1 L88:1 L114:5 L151:4 L152:2 L162:1`（合计 **68**）。

⚠️ **口径更正**：批三十四路线图记「20 课 67 处」，**实测 68 处**。差 1 处，**不影响判定**，**建议后续统一改用 68**。

**「好几个」进 `grammarLabel` 的只有 2 课**：**L11**（`好几个 + 特殊的昨天版`）与 **L51**（`幕后句 · 好几个的搭档`）。

**③ 关系：同义且撞自建体系。** 批三十三 §5.3 改写表把零术语红线里那个「一群东西」的说法，正式定为 **`好几个（东西）`**（逐字：「复数用 aren't」→「**好几个东西**用 aren't」）。
**⇒ 若 `several` 课写「『好几个』说 several」，用户会同时看到 `several` ＝ 好几个、以及 `are` 的搭档也叫「好几个」——自建体系正面矛盾。** 这不是「价值不够」，是**「教了会让 20 课已教内容变乱」**。

**④ 跨源档位**：Cambridge `several` ＝ **A2**（双源一致）；**无独立规则页**（slug 200 但 title 是通用页）；**跨源零禁用专属它**（批三十四竞析实证）。

**⑤ 3 条带标记新错**：❌ **不可**——三条错题只能是「换一个词」（`several` vs `a few` vs `some`），**全是同型卡**，`word_order`／`plural`／`sv_agreement` 三类里一类都占不到。

**⇒ 判定：维持不做。** 处置维持批三十四的「改为 L114 的 3 张刻度卡」。

---

### 1.3 `even if` —— **维持不做独立课；处置改为「折入对照卡」**

**① 词频**：`even if` **GL 0**；`even` **GL 0**（真零）。**词位成本 = 1（`even`）**。
**② 中文锚**：`即使` **0**／`就算` **0**／`哪怕` **0**——**中文锚完全空着**（比原记录更有利）。
**③ 关系：半新结构**——新的一面是「条件成立与否都不改变结果」这个**逻辑层**；旧的一面是 `if` 的壳（我方 `if` **GL 187**）。
**撞车点**：`if` 条件句已在 **L48**＋**L49** 立岗，且 **L187 刚把「if／unless／as long as」三个有条件的说法排成一行**（L187 `deepDive.title` 逐字：`三个「有条件」的说法排一行`）。

**④ 跨源（本轮重新实取）**

| 源 | 本轮实取 | 读法 |
|---|---|---|
| `/grammar/british-grammar/even-if` | **返回 200，但 page title 逐字是 `If`**——**不是独立页** | ✅ **原判成立** |
| 该页 h2 序列（逐字 6 个） | `If: conditions`／`If possible, if necessary`／`If so, if not`／**`Even if`**／`If: reporting questions`／`If and politeness` | **`even if` 只是 6 个 h2 里的一节** |
| `Even if` 节全文 | **仅两句**（"We can use even if to mean if when talking about surprising or extreme situations:" ＋ `You're still going to be cold even if you put on two or three jumpers.`） | **极薄** |
| Cambridge 词典 `EVEN IF` | **独立 headword ＋ B2 标位** | 词典级待遇存在 |

**⑤ 3 条带标记新错**：⚠️ **勉强**——本轮实测到一条词典级 ❌（批三十一记录：`Even if Barcelona will lose tomorrow, they will be champions. (incorrect)`），加上「`even` 不能单独当连词」（中文侧逐字：`I wouldn't date Sam even he were handsome and muscular. ❌`），**只有 2 条真错**；第 3 条只能是语义卡，**够不上「带标记」**。

**⑥ 判定**：**维持不做独立课**。但批三十一写「值得 1 课」、批三十四改判不做，**中间那一步没说清「不做之后放哪儿」**。本报告建议：

> **`even if` → 不立课；登记为对照卡候选（折入 L187 的家族，或未来某课的 `bothRight` 卡）。**
> 理由：`even if` 的真增量（surprising or extreme）**恰好是 L187 那三张「有条件」卡的自然第 4 张脸**；独立开课要背 6 条卡（其中 3 条带标记凑不出），**折成 1 张对照卡是成本最低的落点**。

---

### 1.4 `as if` —— **维持不做**（理由全部成立且加强）

**① 词频**：`as if` **GL 0**。

**② ③ 撞车点（本轮实证加强）**：
- **L125–L127**（`看起来怎样 · look 中间站`／`换人换形`／`收口 · 同一个 look 两张脸`，行号 23919／24118／24317）
- **L159**（`看起来像 · look 后面跟 like`，`It looks like a boat.`，行号 **30726**）
- **L160**（`好像 · seem 后面跟 to`，`He seems to know you.`，行号 **30932**）

**中文锚实测**：`好像` **4 课 39 处**；`看起来` **11 课 117 处**。
**⇒ `as if` 的中文入口「好像／看起来」已被 L159／L160 占满**，进来只能抢 `look`／`seem` 的槽位。

**④ 跨源**：本轮实取 `/grammar/british-grammar/as-if-or-as-though` → **返回通用 hub 页**（无独立页、无 h2、无规则句）。
**⇒ 原判「跨源薄」本轮坐实，且比原记录更薄。**

**⑤ 3 条带标记新错**：❌ 不可满足——`as if` 的错型与 `look like`／`seem to` **同型**，三条会全撞 `verb_form`。

**⇒ 判定：维持不做。** 无处置变化。

---

### 1.5 `as though` ／ 1.6 `ought to` ／ 1.7 `dare` —— **三项均维持不做**

三项的复核结论同型（**原理由全部成立，无处置变化**），合并如下：

| 项 | ① 词频 | ② ③ 关系与撞车 | ④ 跨源 | ⑤ 3 条带标记错 | 判定 |
|---|---|---|---|---|---|
| **`as though`** | `as though` **GL 0** | **同义换词**——与 `as if` 是同一格的两种写法（词典定义仅 `as if:`） | `as-if-or-as-though` slug **返回通用 hub 页**：**既无 `as if` 独立页，也无 `as though` 独立页** | ❌ 不可满足 | **维持不做。比 `as if` 更弱一层**——`as if` 至少还有 BC C1 课程位记录，`as though` 连这个都没有 |
| **`ought to`** | `ought to` **GL 0**；`ought` **GL 0** | **同义换词**——跨源四处逐字都写「就是 should」；**撞 L47**（`lesson-47-should`／`情态三兄弟 · should`／`You should sleep early.`／行号 **8734–8919**）**中文锚 `应该`：6 课 48 处**（L47／L49／L118／L124／L168／L181） | CEFR **B1**；跨源四处同义 ⇒ **不给课的理由是「同义」，不是「档位低」** | ❌ 不可满足（三条会全是「should ↔ ought to 换词」） | **维持不做** |
| **`dare`** | `dare` **GL 0**；中文锚 `敢` **2 课 2 处**（L160／L174，均为另一种用法） | 无法与已教内容形成干净切分——它分裂成两套用法 | CEFR **B2**；跨源自述 **"Less commonly"**；中文侧 **404** | ❌ 不可满足 | **维持不做** |

**⚠️ 一条口径提醒（可逆性分级）**：**`ought to` 是「档位够、只是同义」；`dare`／`provided` 是「档位本身不够（C）」**。**两者都判不做，但可逆性不同**——若未来 `should` 系列要扩，**`ought to` 是第一个能回的；`dare`／`provided` 不能**。

---

### 1.8 `provided` —— **维持不做；「无规则页」这条理由被推翻，需改写**

**① 词频**：`provided` **GL 0**；`provide` **GL 0**（真零）。

**② ③ 关系**：`provided (that)` 与 `as long as` 同义（Cambridge `Conditionals` 页逐字把二者并列：`as long as, so long as, only if, on condition that, providing (that), provided (that)`）。**L187 刚教了 `as long as`** ⇒ **现在是「教完 `as long as` 的下一课就讲同义换词」**，撞车比批三十一时更严重。

**④ 跨源（本轮新增实测，原判不准确）**：
- Cambridge `Conditionals: other expressions (unless, should, as long as)` 页有 **h2 逐字 `As long as, so long as, providing, etc.`**，正文把 `provided (that)` 明确列为一员。**⇒ 「找不到页面」是错的，`provided` 有落点。**
- 但该落点是**同页并列**（与 `as long as`／`so long as`／`on condition that`／`only if` 共 5 项挤在一个 h2 里），**不是独立页**。
- 中文侧本轮新测：`letmeenglish.com/more-conditionals/`（200）h2 逐字 `as long as / provided (that) / providing (that) / on condition (that) / only if 只要…的話` —— **同样是并列，无专属**。

**⑤ 3 条带标记新错**：❌ 不可满足——三条全是「换词」。

**⇒ 判定：维持不做。理由改写为**：
> ~~无规则页~~ → **有落点，但落点是「同页并列」（5 词挤 1 个 h2），且与刚交付的 L187 `as long as` 同义；中文侧亦为并列、无专属专文；3 条带标记新错不可满足。**

---

### 1.9 `in case` —— **维持不做；两条理由一条成立、一条被推翻**

**① 词频**：`in case` **GL 0／HC 0**；`case` **GL 0／HC 1**（唯一一处是文件头注释 `huntCases.ts:11` 的 `case 9 的 advice / information`，**非教学内容**）。
**⇒ 「连 `case` 都 GL 0」成立。** 批二十七已登记该 HC 注释处「可能已不在文件里」——**本轮实测仍在**（`huntCases.ts:11`），**且确为非教学内容**。

**② ③ 关系：新结构**（语义对立干净）。Cambridge 逐字：**"We don't use in case to mean 'if'."**——「先做准备」vs「条件成立才做」是**我方零覆盖的语义对立**。
**中文锚实测**：`以防` **0**／`免得` **0**／`万一` **0**／`说不定` **0**／`提前` **0**／`做好准备` **0** —— **中文入口全空着**（比原记录更有利）。

**④ 跨源（本轮关键修正）**

| 源 | 本轮实取 | 结论 |
|---|---|---|
| `/grammar/british-grammar/in-case` | **有独立页，title 逐字 `In case (of)`** | ❌ **原判「无规则页」不成立** |
| 规则句 | "In case is a conjunction or adverb."／"In case of is a preposition."／**"We use in case to talk about things we should do in order to be prepared for possible future situations"**／**"We don't use in case to mean 'if'."** | **规则句真实且硬** |
| 硬错点 | **无 `Not:`**——用的是 `Compare` 版式（`in case there's a pool` vs `if there's a pool`） | ⚠️ **规则硬但无 ❌ 模板** |
| 中文侧 | 批二十五实测专文 **404**；`letmeenglish.com/more-conditionals/` 页题逐字含「**unless、in case 用法比較**」 | ⚠️ **有中文落点（并列），无专属专文** |

**⑤ 3 条带标记新错（真正的封杀理由）**：批二十七判「去掉 ❌will 后只剩 3 条卡」；本轮复核：
- 真错 ①：`in case` 后面接 `will`（错）→ 可用；
- 真错 ②：`in case` 与 `if` 混用（"We don't use in case to mean 'if'"）→ 可用；
- **真错 ③：找不到第三条独立的带标记错**——`in case of` 的 `of` 用法是**另一个词**，不是同一格的错。

**⇒ 3 条带标记新错不可满足** ⇒ **恰好 6 条卡凑不出来**。

**⑥ 判定：维持不做。理由改写为**：
> **原判两条理由：① 「中文侧 404」✅ 成立（无专属专文）；② 「无规则页」❌ 不成立（Cambridge 有独立页 `In case (of)`，规则句三条，含一条明文禁止 `in case` ＝ `if`）。**
> **真正成立且更硬的是第三条（本轮实测）：① 无 `Not:` 级硬错模板，2 条真错凑不出第 3 条 ⇒ 6 条卡不可满足；② 它的语义对手正是刚教完的 `if`，且中文侧连并列落点都无专属专文。**
> **⇒ 维持不做，但「无规则页」这条今后不得再引用。**

---

### 1.10 `way` —— **维持不做；但原判理由「词频近零」实测为假，必须整条改写**

**⚠️ 这是本轮最需要纠正的一条。**

**① 词频实测（词边界）**：
```
way   GL = 38    HC = 3    ← 原判写「词频近零」，实测为假
```
**逐课分布（5 课）**

| 课 | `way` 次数 | 语境 |
|---|---|---|
| **L179**（`lesson-179-shall`） | **32** | **整课主题句**：`Shall we take the quiet way?`（**已在 `targetSentence` 里**） |
| L160 | 2 | `He seems to know the way.` |
| L174 | 1 | `Are you sure you know the way?` |
| L185 | 2 | 复现 L179 的句子 |
| L140 | 1 | `Say it another way?`（NPC 台词） |

**② 关键区分**：这 38 处**全部是 `way` 的「路／路线」实义名词**，**没有一处是原判要做的那个结构**。**实测该结构真零**：`the way` **2**（均为 L160／L174 的 `know the way` 实义）／`ways` **0**／`way of` **0**／`in a way` **0**／`the way I` **0**／`the way you` **0**／`the way to` **0**／`another way` **1**（L140 NPC 台词）。

**③ 跨源本轮实取**：Cambridge `/grammar/british-grammar/way` 确有独立页，**h2 三个逐字 `Way as a noun`／`Way as an adverb`／`In the way, on the way`**。
**⚠️ 但该页讲的正是 `way` 的实义名词／程度用法／`in the way`／`on the way`——恰是我方已有 38 处的那一部分；页内没有 `the way ...` 那个结构。**

**④ 中文锚实测**：`方式` **3 课**／`样子` **16 课**／`怎么说` **15 课** —— **中文入口不空**。

**⑤ 3 条带标记新错**：❌ 不可满足——做那个结构要连带造一串词，且三条错题会是「省略连接词」这类**无具体错词可指**的错。

**⑥ 判定：维持不做。但原判理由必须整条作废并改写**：

> ❌ **原判**：「`way` 是伪缺口（**词频近零**，且要连带造一串词）」
> ✅ **实测**：`way` **GL 38／HC 3，5 课**——**词频不近零，近零的是「要做的那个结构」**（实测 0）。
> **正确的理由是**：① **`way` 作实义名词我方已有 38 处、且 L179 已把它写进目标句**——**再做就是与 L179 撞车**；② **作结构我方真零，但该结构在 Cambridge 的 `Way` 页上不存在**（该页三个 h2 全是实义用法），**跨源不支持把它当「新结构课」**；③ **3 条带标记新错不可满足**（无具体错词可框）。

**⇒ 为什么这条纠正重要**：原判用「词频近零」当理由，**万一后续有人用词边界口径复算，会发现 38 而误以为原判错了、进而翻案**。必须把真实理由写进档，**避免用错误理由得出正确结论**。

---

## §2 新候选评估表（8 项）

### 2.1 判定汇总

| # | 候选 | 中文入口 | 与已教关系 | 缺口强度 | 能否撑 1 课 | 排序 |
|---|---|---|---|---|---|---|
| 1 | **`had to`** | **不得不（昨天版）** | ⚠️ **不是同义换词**——是 L16 的**空白格** | **🟢 真缺口（本轮最强）** | ✅ **能** | **1** |
| 2 | **`so ... that`** | **如此…以至于** | 半新（新结果层 ＋ 旧 `so`） | 🟡 真缺口（中） | ⚠️ **需与 `such a` 合并** | **2** |
| 3 | **`such a`** | **这样一个** | ⚠️ 撞 L89 `What a` | 🟡 真缺口（中） | ⚠️ 同上 | **2（合并）** |
| 4 | `by the time` | 到…的时候 | ⚠️ 撞 L92 `when` ＋ 条件家族 | 🟡 真缺口，但依赖 `will have` | ❌ **单撑不住** | 4 |
| 5 | `now that` | 既然 | ⚠️ 撞 `when`／`after` | ⚪ 伪缺口（弱） | ❌ | 5 |
| 6 | `supposed to` | 应该／本该 | **同义换词**（撞 L47 `should` ＋ L16） | ⚪ 伪缺口 | ❌ | 6 |
| 7 | `such as` | 例如 | ⚠️ 撞 `like`（L159） | ⚪ 伪缺口（词汇点） | ❌ | 7 |
| 8 | **`as far as`** | 据…／就…而言 | ⚠️ 与 L65／L187 **同形不同义** | ⚪ **伪缺口** | ❌ | 8 |

**净产出：1 项建议立独立课（`had to`）＋ 1 项建议合并成课（`so ... that` ＋ `such a`）。其余 6 项不做。**

**8 项词频复跑**：

```bash
cd /Users/liujun/Documents/英语听写 && node -e '
const {readFileSync}=require("fs");
const GL=readFileSync("src/data/grammarLessons.ts","utf8");
const esc=(w)=>w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
const c=(w)=>(GL.match(new RegExp(`(^|[^A-Za-z])${esc(w)}([^A-Za-z]|$)`,"gi"))??[]).length;
for(const w of ["as far as","such as","now that","by the time","supposed to","had to","so that","such a"]) console.log(w.padEnd(14),c(w));'
# → as far as 0 · such as 0 · now that 0 · by the time 0
#   supposed to 0 · had to 0 · so that 60（L186 立岗后）· such a 0
```

---

### 2.2 `had to`（不得不，昨天版）—— **🟢 本轮唯一真缺口，建议立 1 课**

**① 中文入口**：「**不得不**」（昨天版：「当时不得不／只好」）。
**实测占用**：`不得不` **6 课 25 处**（L16／L103／L105／L107／L115／L183）——**⚠️ 这个占用是「正资产」而不是「撞车」**：它在库里**只出现在 `have to` 的中文译文里**，而 `has to`／`had to` **从来没有被立岗**。

**② 与已教内容的关系（本轮最关键的一处实测）**

| 实测项 | 值 | 含义 |
|---|---|---|
| `have to` GL | **50** | 已教 |
| **`has to` GL** | **2**（**唯一 2 处都在 L16 的对比卡里**，逐字 `correct: "She has to get up early."` ＋ `whyZh: "have to 里的 have 要变他/她/它版：she has to。must 不变形，但 have to 的 have 会变。"`） | **只被提了一句，没立岗** |
| **`had to` GL** | **0** | **真零** |
| `had to` HC | **0** | **真零** |

**⇒ `had to` 不是同义换词，因为：**
1. **它是我方 `have to` 这一格的时空扩展**——`have to`（现在）→ `had to`（过去）。这与跨源明文的 `must` → `had to` 是**同一条**。
2. **L16 的 `deepDive` 只讲了「must vs have to 的口气差」和「否定刚好相反」**——**逐字全文 3 段里，一次都没提过去怎么办**。L16 `oneLineRule` 逐字：`说「必须」：must + 原样——I must go。must 和 can 一样，从来不变装。`
3. **`must` 的过去式是我方一个真实空白**：L16 教了 `must`，但用户想说明天／昨天必须做时，**库里没有任何一课告诉他 `must` 不能配过去**。

**③ 零基础缺口强度：🟢 真缺口（本轮最强）**
**负迁移方向明确**：用户学了 L16 的 `must`（逐字「**从来不变装**」），**最自然的错误就是把它直接搬去说昨天**：「昨天我必须早起」→ `I must got up early` / `I must get up early yesterday`。**中文「必须」没有时间标记，用户不会有任何警觉。**

**④ 跨源档位（本轮新取，比预期强得多）**

| 逐字证据（`/grammar/british-grammar/must`） | 内容 |
|---|---|
| **硬规则 ×2** | **"We use had to not must to express obligation and necessity in the past"** ／ **"We don't use must to express obligation and necessity in the past. We use had to instead"** |
| **`Not:` 硬错 ×2（正好对上 §4 要的两条带标记错）** | **"Not: Last year, teachers must make a report …"** ／ **"Not: When she got home, she must cook dinner before …"** |
| 正例 | `When she got home, she had to cook dinner before everyone arrived.`／`Last year, teachers had to make a report on each child every week.` |
| 补充规则 | "We use will have to more than must to express future obligation" → **`will have to` 也与 `must` 分工** |
| 第二落点 | `/grammar/british-grammar/have-got-to-and-have-to` 的 `Have got to and have to: tense` 节逐字 **"Have got to can only be used in the present. Have to can be used in a variety of forms"**，例 `I had to study for the exam`／`She'd had to call her parents by ten o'clock.` ＋ `Not: I'd got to study for the exam.` |
| 课程位 | **BC 三档未见专课**（未逐目复核，见 §5 项 1） |

**⑤ 能否撑 1 课（含 3 条带标记新错）—— ✅ 能，本轮唯一稳稳满足的**

| 卡 | 类型 | 内容 | 依据 |
|---|---|---|---|
| 1 | **带标记** | ❌ `I must get up early yesterday.` → ✅ `I had to get up early yesterday.`（标记 `must`） | Cambridge 逐字 `Not: Last year, teachers **must** make a report` |
| 2 | **带标记** | ❌ `When she got home, she must cook dinner.` → ✅ `she had to cook dinner`（标记 `must`） | Cambridge 逐字 `Not: When she got home, she must cook dinner before …` |
| 3 | **带标记** | ❌ `I had to get up early yesterday?` → ✅ `Did you have to get up early yesterday?`（问的时候要借 `did`，标记 `had to`） | 由 "have to can be used in a variety of forms" ＋ 我方 L10 的老规矩推出 |
| 4 | 双正解 | `I must finish my homework today.`（**L16 复现**） | 与今天「昨天版」对照：一个今天、一个昨天 |
| 5 | 双正解 | `I have to get up early.`（**L16 复现**） | 现在版 vs 昨天版 |
| 6 | 双正解 | ⚠️ **原拟 `Yesterday I went to the park.` 须换掉**——**该句 practice 层已 6 课触顶** | **改用** `It was cold, so I stayed at home.`（**L20 复现**，practice 层仅 **1 课**用过，余量充足） |

**⑥ 零件实测（造词成本）**：`had` 262／`to` 3147／`get up early` 29／`cook`(1)＋`cooked`(2)／`dinner` 83／`yesterday` 200／`bus` 78／`late` 79／`early` 382／`walk home` **0**（`walked home` 1）／`wash` 56 ＋`washed` 3 —— **全部可用**。
⚠️ **`study` 6／`studied` 0** ⇒ **`studied` 需造词，建议避开**。
**⇒ 造词成本：0（只要避开 `studied`）**。**这是本轮唯一「零造词 ＋ 真缺口 ＋ 3 条带标记错跨源明文齐备」的项。**

**⑦ 排序：1（唯一建议立独立课）。**

---

### 2.3 `so ... that`（如此…以至于）＋ `such a`（这样一个）—— **建议合并为 1 课**

**① 中文入口**：`so ... that` → 「**如此…以至于**」（实测：`如此` **0**／`以至于` **1 课 2 处**，仅 L166）；`such a` → 「**这样一个**」（实测 **0**）。

**② 与已教内容的关系**

| 相关课 | 实测 | 关系 |
|---|---|---|
| **L20** `连词 · because / so`（行号 **3687**） | 目标句 `I was late because the bus was late.`；规则逐字「说「因为」用 because 接原因，说「所以」用 so 接结果——英语只用其中一个，不成对出现」 | ⚠️ **`so`（所以）已占**——但**结果连词 `so` ≠ 程度结构 `so ... that`**，**可切** |
| **L186** `是为了 · so that`（行号 **37147**） | 目标句 `I came early so that you can rest.`；规则逐字把 `so that`（目的）与 L20 的 `so`（结果）**明确切开** | ✅ **`so that`（目的）已立岗** ⇒ `so ... that`（程度结果）**正好是第三个位置，切分干净** |
| **L166** `太多 · too many / too much`（行号 **32244**） | 「以至于」唯一出现处 | ⚠️ 关联但不同结构 |
| **L89** `多好的… · What a + 东西`（行号 **16875**） | 目标句 `What a nice day!` | ⚠️ **`such a` 会撞 L89 的 `What a` 摆放壳**——**这是 `such a` 的主要风险** |
| **L180** `整个 · whole`（行号 **35712**） | `I finished the whole book.` | 无冲突 |

**③ 缺口强度：🟡 真缺口（中）**
- **`so ... that` 实测真零**：`so_X_that` 模式全库 **0**；`so much/many that` **0**；`such ... that` **0**。
- 跨源 Cambridge `/grammar/british-grammar/so` 页**规则真实**：逐字 **"We also use so + adjective or adverb before that-clauses. We do not use very in this structure:"** ＋ 例 `It was so hot that we didn't leave the air-conditioned room all day.`／`They drove so fast that they escaped the police car that was chasing them.`
- **⚠️ 但档位比 `had to` 低一档**：跨源 `so` 页**没有把它做成独立页**（是该页 h2 之一）；中文侧 `如此` **0 处** ⇒ **中文入口尚未建立，用户不主动说「如此…以至于」**。

**④ 能否撑 1 课—— ⚠️ 单撑不住；`so ... that` ＋ `such a` 合并才够**

`so ... that` 的可用真错**只有 1 条**（Cambridge 逐字 `Not: They drove very fast that …`——**错在用 `very` 代替 `so`**）。

**`such a` 的硬错点反而更富**（`/grammar/british-grammar/such`，h2 逐字 `Such as a determiner`／`Such meaning 'of this or that kind'`／`Such … that`）：
- 规则逐字 **"We use such before the indefinite article, a/an"**
- **`Not: We had a such awful meal …`**（← 摆放硬错，**正好是带标记卡**）
- `/grammar/british-grammar/such-or-so` 页十条 `Not:` 可直接用作错卡来源：`Not: She is so great cook.`／`Not: That was such unpleasant.`／`Not: Why do you drive such fast?`／`Not: Such much food was wasted …`／`Not: This is a so wonderful kitchen!`／`Not: You're such kind.`

**⇒ 合并方案**（一课的增量 = 「程度高到引出结果」这一个逻辑，`so` 与 `such` 是两个入口）

| 卡 | 类型 | 内容 |
|---|---|---|
| 1 | **带标记** | ❌ `It was very cold that I stayed home.` → ✅ `It was so cold that I stayed home.`（标记 `very`→`so`；Cambridge 逐字 `Not: They drove very fast that …`） |
| 2 | **带标记** | ❌ `We had a such awful meal.` → ✅ `We had such an awful meal.`（标记 `a such`→`such an`；Cambridge 逐字 `Not: We had a such awful meal`） |
| 3 | **带标记** | ❌ `She is so great cook.` → ✅ `She is such a great cook.`（标记 `so`→`such a`；Cambridge `Not: She is so great cook.`） |
| 4 | 双正解 | `I was late because the bus was late.`（**L20 复现**——「因为／所以」× 今天「如此…以至于」） |
| 5 | 双正解 | `I came early so that you can rest.`（**L186 复现**——目的 × 结果） |
| 6 | 双正解 | `What a nice day!`（**L89 复现**——`What a` × `such a`，**正好把风险点变成教学点**） |

**⑤ 零件实测**：`so` 244／`that` 227／`cold` 303／`heavy` 79／`tired` 170／`stay` 78／`stayed at home` 17／`hot` 24 —— **全部在库，造词成本 0**。
⚠️ **`such` GL 0 ⇒ 需造 1 个词位**（`such`）。

**⑥ 排序：2（合并后与 `had to` 同批可立 2 课）。**

---

### 2.4 `by the time`（到…的时候）—— **不做（依赖 `will have`，已判撤出）**

**① 中文入口**：「**到…的时候**」（实测 **0**）。
**② 关系**：撞 `when`（L92 `什么时候 · when + 小句子`／L97 `那时候 · when + 当时正做着`）与 L48／L172／L187 的条件家族。
**③ ④ 跨源**：`/grammar/british-grammar/by` 页有真规则——逐字 **"We use by the time, meaning 'when', to connect an action that has happened or will have happened before a second action."** ＋ **`Not: By the time you will wake up …`**（h2 逐字 `By and time`）。**⇒ 规则真实，且有一条硬错。**
**⑤ 但真正的封杀理由是历史裁决（批二十二／批二十三）**：`by the time` **的真搭档是 `will have`**；批二十二判 **`will have` 撤出**——理由逐字「**『课程位在但场景不在』**（将来完成要求『到那时已经做完』的完成视点，与单日线叙事不合）」。
**⇒ 顺位跟随 `will have`；`will have` 不做，单开就只剩「什么时候」义 ⇒ 与 L92 同义换词。**
**排序：4。不做。**

---

### 2.5 `now that` ／ 2.6 `supposed to` ／ 2.7 `such as` —— **三项均不做**

三项复核结论同型（**不做的理由都是「没有真增量」或「是词汇点」**），合并如下：

| 项 | ① 中文入口 | ② ③ 关系与撞车 | ④ 跨源（本轮实取） | ⑤ 判定 |
|---|---|---|---|---|
| **`now that`**（既然） | `既然` **0** | `now that` ＝「既然」——**与 L92 `when`／L90 `after` 共壳**；且**中文「既然」在口语里几乎总被「都…了」替代** | slug `/now-that` **返回 200 但 page title 逐字是 `Now`**——**不是独立页**（`Now (that)` 只是 `Now` 页 4 个 h2 之一）。规则逐字 "We can use now that as a conjunction to refer to something and its result(s):"。**⚠️ 该节 `Not:` ＝ 0** | **伪缺口 ＋ 无硬错 ⇒ 不做。排序：5** |
| **`supposed to`**（应该／本该） | `应该` **6 课 48 处**／`本该` **0** | **同义换词**——撞 **L47 `should`**（`You should sleep early.`）＋ **L16 `must / have to`** | `/supposed-to` **返回 200，但主文 title 是 `Be expressions (be able to, be due to)`**——**`Be supposed to` 是 6 个 h2 之一**（逐字 `Be about to`／`Be able to`／`Be due to`／`Be likely to`／`Be meant to`／`Be supposed to`）。**⚠️ 与 L174 `be able to` 同页**；**该节 `Not:` ＝ 0** | **三面被封：同义换词 ＋ 与 L174 同页 ＋ 无硬错 ⇒ 不做。排序：6** |
| **`such as`**（例如） | `例如` **0**／`比如` **3 课 3 处** | **撞 `like`**（L159）——Cambridge 逐字：`Such as is similar to like for introducing examples, but it is more formal, and is used more in writing than like` | ⚠️ **本轮发现它是本批唯一有「独立页 ＋ 两条 `Not:`」的候选**：title 逐字 `Such as`；规则 `We can use such as to introduce an example or examples of something we mention.`；**`Not:` ×2**（`Not: … to love 1960s rock bands, as the Beatles …`／`Not: … such as the colours of their national flag.`）；两条 Warning | **仍是词汇点 ⇒ 不做。排序：7** |

**`such as` 为什么「跨源最厚」却仍不做（三条）**：
1. **它是词汇点，不是结构课**——与批三十一判「7 项动词短语全不做」同一条口径（**「例如」是一个词的功能，不是一个句式**）。
2. **唯一真增量「逗号」是书写规范**，零基础听力线**不教标点**。
3. **`such` GL 0 ⇒ 需造 1 词位**，而**同一格已被 L159 的 `like` 占住**——按本项目「同义换词 ⇒ 课量 0」的处置。

**⚠️ 但登记一条**：`such as` 是**「`such` 家族里跨源最厚的一项」**——若未来 `such` 要立课，**应从 `such a`（§2.3）入手，不要从 `such as`**。

---

### 2.8 `as far as`（据…／就…而言）—— **不做（伪缺口；本轮新候选轴终判）**

**这是批三十四竞析点名要评估的那一支。**

**① 中文入口（逐项实测）**：`就我而言` **0**／`据我`（含「据我所知」）**0**／`在我看来` **0**。
**⇒ 三个入口全零。但注意：全零不等于缺口**（见 ③-1）。

**② 线索核对（本轮复跑竞析引文，结论：引文为真，但读法要修正）**

本轮实取 `english.cool/as-long-as/`，**逐字确认**：h2 序列为 `1. as long as  只要…` ／ `2. as soon as  一…就…` ／ **`3. as far as`**；**`as far as` 节有 5 个 h3，逐字**：`❶ as far as [something] is concerned  關於某事物` ／ `❷ as far as I am concerned  就我而言` ／ `❸ as far as I know  就我所知` ／ `❹ as far as I can tell/see/remember  按照我所理解/看見/記得` ／ `❺ as far as it goes 在一定程度上還不錯`；该节开场句逐字 `far 的意思為「遠的」，可以用在距離或程度方面，而此用法的 as far as 後面會加上名詞。`
**⇒ 竞析记录（「独立 h2 ＋ 5 个 h3 子用法」）✅ 完全属实。**

**③ 但四问四答下来，判定是「不做」**

**③-1 它是固定短语家族，不是轴（最核心的一条）**
**5 个 h3 全部是同一个骨架的变体**：`as far as` ＋ **某个「我」的认知动作**（`I know`／`I am concerned`／`I can tell`／`it goes`）。
**⇒ 这是 5 个词汇搭配，不是 5 层句式增量。** 学一个「轴」应该能迁移；而学会了 `as far as I know` **不能推出** `as far as I can remember`——后者要单独记。**这与「动词短语组」是同一性质**（批三十一判该组「7/7 全是词汇点，无一项教新结构」）。

**③-2 跨源档位：无独立语法页（本轮实测）**

| 源 | 本轮实取 | 结论 |
|---|---|---|
| `/grammar/british-grammar/as-far-as` | **返回 200，但 title 是 `Explore the English Grammar`（通用 hub 页）** | ❌ **无独立页** |
| `/grammar/british-grammar/as-and-as-expressions` | **无 `as far as` 任何出现** | ❌ |
| `/grammar/british-grammar/far` | **仅 1 处，是距离义**：`From here, you can see as far as the ocean.` | ⚠️ **距离义，不是「据…而言」义** |
| 词典 `as-so-far-as-i-know` | **独立 headword，`phrase`，CEFR = B2**，逐字 `used to say what you think is true, although you do not know all the facts` | ⚠️ **词典级待遇存在（B2）** |
| 词典 `as-far-as` | **只有 `as far as it goes` 一条 idiom**（`used to say that something has good qualities but could be better`） | ❌ |
| BC | 本轮尝试的 `as-and-as-phrases` slug **404**，未取到专页 | ❌ |

**⇒ 对照 `as long as`（L187 已教）：那一项有 Cambridge 独立页 ＋ 3 个落点 ＋ LDOCE 双义项 ＋ 中文侧独立专文。`as far as` 只有「中文侧专文的 1 个 h2」＋「词典 B2 短语条目」。档位明显更低。**

**③-3 它与 L65／L187 是「同形不同义」，会加剧误推广**
- **L65**（`一样 · as tall as`，行号 **12191**）教了 **`as` ＋ 描述词 ＋ `as`** 的「一样」壳；
- **L187**（`只要 · as long as`，行号 **37341**）刚教了 **`as` ＋ `long` ＋ `as`** 的「只要」义，**其 `deepDive` 逐字就是在讲**「外形上它跟第 65 课的 as tall as 是一个家族：两头各卡一个 as，中间换上要说的那个词」。
- **⇒ 再加第三个 `as` ＋ X ＋ `as`（「据…而言」），会让「两个 as 中间换个词就换个意思」这个已经很难的家族变成三义混淆**——而 `as far as` 的义与 `as long as` 的义**在中文里都常译作「只要／就」**，是**最坏的一对**。

**④ 能否撑 1 课**：❌ **不能**。
- 3 条带标记新错：**不可满足**（该短语的错型是「`as far as` 后面接什么」，三条会全是同型；且**跨源零 `Not:` 模板**——Cambridge `Far` 页、词典页**均无 `Not:`**）。
- 目标句候选 `As far as I know, she is at home.` **7 词（合规）**，且**零件 `know` 240／`home` 258 全在库 ⇒ 造词成本 0**——**成本不是问题，问题是它撑不起 6 条有教学区分度的卡**。

**⑤ 零件（备用最小成本路径，若产品负责人否决本判定）**：`as` 575／`far` 18（**但全为 L73／L76 的「多远」认读义 ＋ `far better`**）／`know` 240／`home` 258 ⇒ **需造 1 词位（若取 ❶❷，`concerned` 真零；取 ❸ 则 0 造词）**。

**⑥ 最终判定：❌ 不做。**

> **判定理由汇总**：① **是固定短语家族（5 个搭配），不是句式轴**——与批三十一判「动词短语组全不做」同一口径；② **跨源无独立语法页**（Cambridge 三个候选 slug 实测全部落空，只剩词典 B2 短语条目）；③ **与 L65／L187 构成「同形三义」**，是**最坏的误推广组合**；④ **3 条带标记新错不可满足**（跨源零 `Not:` 模板）；⑤ **中文入口三问全零，用户不主动说「就我而言」**——**先说「我觉得」就够了，绕开成本为零**。
>
> **⇒ `as far as` 登记为「已评估 · 判不做」，从候选池关闭。** 批三十四竞析的线索**属实但不足以立轴**——**这是一次成功的「登记进普查」，不是一次错过**。

---

## §3 最终结论：B 档是否已清空？

### 3.1 直接回答

> ## ✅ **可以宣告「完成所有 B 档系列课程」——在原普查口径内。**
> ## ⚠️ **但有 2 项例外必须一起宣告，否则这个「完成」是不诚实的。**

### 3.2 三层结论

**第一层：清单侧 —— 已清空 ✅**

| 检查 | 结果 |
|---|---|
| 批三十一普查的 **26 项** | 全部有终局处置（**已交付 / 判不做**），**零项遗留** |
| 批三十四清掉的最后 2 项可做项 | `so that` → **L186** ✅ ／ `as long as` → **L187** ✅ |
| 本轮复核的 **9 项「判不做」** | **9/9 维持不做**（其中 4 项理由已改写收窄） |
| 本轮新评估的 **8 项新候选** | **1 项建议立课（`had to`）＋ 1 项建议合并立课（`so ... that` ＋ `such a`）**；其余 6 项不做 |
| 新候选轴 `as far as` | **已评估 · 判不做**（§2.8） |

**第二层：口径侧 —— 「完成」的边界必须写明 ⚠️**

批三十一 §5 自己写明：
> **「本报告只普查了『主理人凭语感列举的 26 项』——这仍不是数学意义上的全库穷举。」**

**本轮印证了这句话是对的，而且是可操作的**：**本轮从两个新入口（竞析的 `as far as` 线索 ＋ 用户研究侧的 8 项新候选）又捞出了 8 项**，其中 **2 项是本轮新发现的真缺口**（`had to`／`so ... that` ＋ `such a`）。
**⇒ 「26 项清空」不等于「B 档清空」——但「每轮普查都从新入口补捞、捞完即评估」是一个可收敛的流程。** 本轮之后新入口状态：

| 入口 | 状态 |
|---|---|
| 批三十一 26 项 | ✅ 清空 |
| 批三十四 2 项 | ✅ 交付 |
| 竞析 `as far as` 线索 | ✅ 本轮评估完（判不做） |
| 用户研究 8 项新候选 | ✅ 本轮评估完 |
| **遗留下一个入口** | **`had to` / `so ... that` / `such a`（本轮新捞出的 3 项）** |

**第三层：还剩什么？—— 精确清单**

> **若采纳 §4：还剩 2 课。做完这 2 课，B 档在「本轮口径」内清空。**
> **若不采纳 §4：B 档在「原普查口径」内已清空，但库里留着 2 个已识别的真缺口。**

| 状态 | 项 | 说明 |
|---|---|---|
| **已交付** | 187 课 | L1–L187 |
| **本轮建议做（§4）** | **`had to`（1 课）＋ `so ... that`/`such a`（1 课）** | **共 2 课，可同批交付** |
| **判不做（本轮确认）** | 9 项（§1）＋ 6 项（§2.4–2.8） | 全部有理由与实测依据 |
| **处置待办（非新课）** | `several` 刻度卡（L114） | 批三十四已登记，本轮维持 |
| **处置建议（本轮新增）** | `even if` 折入对照卡 | §1.3 |

### 3.3 给主理人的一句话（附条件版宣告）

> **「B 档前沿清单（批三十一 26 项 ＋ 批三十四 2 项 ＋ 本轮普查新增 8 项）已全部收口：17 项已交付、17 项经实测判不做、3 项为本轮新识别缺口（`had to`／`so ... that`／`such a`）待 2 课补齐。」**
> **若主理人裁决不做那 2 课，则改为：「B 档已清空（口径：三批普查的全部 36 项候选）。」**

---

## §4 逐课规格（若采纳）

### 4.0 批次前置（五条硬约束）

| # | 约束 | 实测依据 |
|---|---|---|
| **1** | **课号 = L188、L189**；**案件 = #197、#198** | `number` max=187（无跳号）／`huntCases` max=196 |
| **2** | **季：必须扩 `season-28` 或新建 ≥6 课大季** | `season-28` 现为 182–187；**新建 3 课小季会立刻让 `grammarSeasons.test.ts` 变红**（≤3 课小季上限 3，已满） |
| **3** | **建议扩 `season-28` 为 182–189（8 课）** | 8 课属常规大章体量 |
| **4** | **封面**：`src/assets/lessons/` **117 张全部已用**（54 张各用 2 次） | 新 2 课直接复用（沿用批三十四「取 cover46／47」先例） |
| **5** | **can-do**：新建 `can-do-m36`（`afterLesson: 189`） | 尾项 `can-do-m35`（`afterLesson: 187`，`GrammarPathPage.tsx:360`） |

### 4.1 课一：`had to`（不得不 · 昨天版）

| 字段 | 值（已按红线逐项核过） |
|---|---|
| **id** | `lesson-188-had-to` |
| **number** | **188** |
| **title** | `昨天不得不早起` |
| **grammarLabel** | `不得不 · 昨天版 had to` |
| **episode** | `小美的一天 一百八十八` |
| **目标句** | `I had to get up early yesterday.` |
| **词数** | **7** ✅（≤8） |
| **scene** | **`space`** ——**唯一合法但全库零使用的场景**（实测 0 课）；次选 **`snow`**（仅 2 课） |
| **一句话规则** | 说「当时不得不」用 had to——I had to get up early yesterday（昨天我不得不早起）。现在说「不得不」是 have to，说到昨天要换成 had to；must 没有昨天版，别把它搬过去。 |
| **术语自查** | ✅ 干净（「昨天版」是我方既有自建表达：L11 标题 `昨天吃了三明治`／L104 `昨天版的「让」` 先例） |

**对比卡 6 条（3 带标记 ＋ 3 双正解）**

| # | wrong | wrongMark | correct | whyZh 要点 |
|---|---|---|---|---|
| 1 | `I must get up early yesterday.` | `must` | `I had to get up early yesterday.` | must 没有昨天版——说到昨天要换成 had to |
| 2 | `When she got home, she must cook dinner.` | `must` | `When she got home, she had to cook dinner.` | 换一个场景再打一次 |
| 3 | `I had to get up early yesterday?` | `had to` | `Did you have to get up early yesterday?` | 问的时候要借 did，have 回到原样 |
| 4 | `I must finish my homework today.` | `null`＋`bothRight` | `I had to get up early yesterday.` | 第 16 课复现——那是今天，这是昨天 |
| 5 | `I have to get up early.` | `null`＋`bothRight` | `I had to get up early yesterday.` | 第 16 课复现——现在版 vs 昨天版 |
| 6 | `It was cold, so I stayed at home.` | `null`＋`bothRight` | `I had to get up early yesterday.` | 第 20 课复现（⚠️ **刻意避开已触顶 6 课的 `Yesterday I went to the park.`**） |

**变体三态**

| 态 | 内容 |
|---|---|
| 肯定 | `I had to get up early yesterday.` ／ 昨天我不得不早起 |
| 否定 | `I didn't have to get up early.` ／ 我昨天不用早起（noteZh：那个「不」跟着 did 走，have 回到原样） |
| 问 | `Did you have to get up early?` ／ 你昨天不得不早起吗？（noteZh：did 搬句首，have to 不变） |

**复现取材（均已实测余量）**：**L16** `I have to get up early.`（practice 已 **3 课**：L105／L107／L115）／**L16** `I must finish my homework today.`（**1 课**：L161）／**L20** `It was cold, so I stayed at home.`（**0 课**）。
⚠️ **禁用** `Yesterday I went to the park.`（L10 的昨天版代表句）——**practice 层已 6 课触顶**（§0.2）。

**案件建议**

| 字段 | 值 |
|---|---|
| id | `hunt-had-to-space` |
| number | **197** |
| title | 建议「**昨天的那句「必须」**」 |
| scene | 与课同场景（`太空舱里，舷窗外一片深蓝` 等） |
| 植错 4 处 | 建议 tag 组合：**`verb_form` ×2**／**`tense` ×1**／**`plural` 或 `sv_agreement` ×1** |
| ⚠️ 约束 | tag 必须取自实测 10 个合法值；`reviewed: true`；**单 token 错误须与 `tokenIndex` 对齐**（批三十四 E2 先例） |

### 4.2 课二：`so ... that` ＋ `such a`（如此…以至于）

| 字段 | 值 |
|---|---|
| **id** | `lesson-189-so-that-result`（**⚠️ 勿与 L186 `lesson-186-so-that` 混淆，见下**） |
| **number** | **189** |
| **title** | `冷到我都没出门` |
| **grammarLabel** | `如此…以至于 · so / such` |
| **episode** | `小美的一天 一百八十九` |
| **目标句** | ⚠️ `It was so cold that I stayed at home.` ＝ **9 词（超线）** → **改取 `It was so cold that I stayed home.`（8 词 ✅）** |
| **scene** | `snow`（实测仅 2 课，与「冷」贴合）——若课一取了 `snow`，本课取 `magic`（2 课） |
| **一句话规则** | 说「如此…以至于」用 so 中间站：It was so cold that I stayed home（天冷到我没出门）。冷的程度放在 so 后面，结果是 that 后面那半句。注意区分第 186 课那个 so that：那个说「是为了」（目的），这个说「以至于」（结果）。 |
| **术语自查** | ✅ 干净 |

**对比卡 6 条（3 带标记 ＋ 3 双正解）**

| # | wrong | wrongMark | correct | whyZh 要点 |
|---|---|---|---|---|
| 1 | `It was very cold that I stayed home.` | `very` | `It was so cold that I stayed home.` | 想说「如此…以至于」，中间不能用 very（跨源明文禁止） |
| 2 | `We had a such awful meal.` | `a such` | `We had such an awful meal.` | such 要站在 a 前面：such an awful meal |
| 3 | `She is so great cook.` | `so` | `She is such a great cook.` | 后面跟的是「一个东西」时该用 such a——so 后面只能跟「有多…」 |
| 4 | `I came early so that you can rest.` | `null`＋`bothRight` | `It was so cold that I stayed home.` | 第 186 课复现——目的 vs 结果 |
| 5 | `I was late because the bus was late.` | `null`＋`bothRight` | `It was so cold that I stayed home.` | 第 20 课复现——「所以」vs「如此…以至于」 |
| 6 | `What a nice day!` | `null`＋`bothRight` | `It was so cold that I stayed home.` | 第 89 课复现——What a 也是「a 站在前面」，与今天的 such a 对照 |

**变体三态**

| 态 | 内容 |
|---|---|
| 肯定 | `It was so cold that I stayed home.` ／ 天冷到我没出门 |
| 否定 | `It was so cold that I didn't go out.` ／ 天冷到我没出去（noteZh：那个「不」跟着 did 走） |
| 问 | `Was it so cold that you stayed home?` ／ 天冷到你没出门吗？（noteZh：was 搬句首，后面不动） |

**复现取材**：**L186** `I came early so that you can rest.`（practice **1 课**）／**L20** `I was late because the bus was late.`（**0 课**）／**L89** `What a nice day!`（**2 课**：L89／L94）／⚠️ **L173** `I got up early in order to catch the bus.` **10 词，若引用须整句照抄**。

**案件建议**

| 字段 | 值 |
|---|---|
| id | `hunt-so-cold-snow` |
| number | **198** |
| title | 建议「**冷到没出门那天**」 |
| 植错 4 处 | 建议 tag：**`word_order` ×1**（`a such`／`so a`）／**`verb_form` ×1**／**`tense` ×1**／**`article` ×1** |

**⚠️ 三处命名风险（务必避开）**

| 风险 | 说明 | 处置 |
|---|---|---|
| **id 撞 L186** | L186 已用 `lesson-186-so-that`；**新课 id 若写 `lesson-189-so-that` 会与「so that」语义混淆** | **用 `so-that-result`** |
| **`grammarLabel` 撞 L186** | L186 是 `是为了 · so that`；**两课在路径页并列时需一眼分辨** | 已按此写 |
| **`such` 造词** | `such` **GL 0 ⇒ 需造 1 词位**（本课唯一造词） | 已登记 |

### 4.3 若只做一课：取课一

**理由**：`had to` 是**零造词 ＋ 真缺口 ＋ 3 条带标记新错跨源明文齐备**（Cambridge `must` 页两条 `Not:` 直接对位）；`so ... that`/`such a` 需造 `such` 且中文入口（`如此` 0 处）尚未建立，**优先级低一档**。
**⇒ 若资源只够一课：做 L188 `had to`。**

---

## §5 未核实项（诚实登记）

| # | 项 | 状态 | 影响 |
|---|---|---|---|
| **1** | **BC 三档索引未逐目复核** | 本轮**未**重取 BC 的 A1–A2（18 课）／B1–B2（36 课）／C1（14 课）索引全目 | **中**——`had to`／`so ... that`／`such a` **三项的「课程位」均记为「未见专课（未逐目）」**；批三十四已实证 BC 直连 403，本轮未再尝试 |
| **2** | **Murphy 双册 TOC 完全未取到** | 延续批三十一 §7 项 1／批三十四 §7 项 1——本机原件已失，cambridge.org 403／archive.org 不可达 | **中**——`had to` 的 Murphy 单元位**未核**；本报告对 `had to` 的判定**不依赖 Murphy** |
| **3** | **`such as`／`as far as` 的中文侧第二源未探** | `such as` 只核了 Cambridge；`as far as` 只实取了 `english.cool`（竞析线索源），未探 `letmeenglish.com` | **低**——前者已判不做；后者判不做的主因是「固定短语家族 ＋ 跨源无独立页 ＋ 同形三义」，**不依赖中文侧第二源** |
| **4** | **`even if` 折入对照卡的具体落点未定** | §1.3 建议「折入 L187 的家族，或未来某课的 `bothRight` 卡」，**未指定确定课** | **低**——属处置建议，非本报告必答项 |
| **5** | **封面池「117 张全部已用」未核到守门层** | 实测 187 课共引用 117 个不同 `coverN`，**54 张各用 2 次**；**未找到断言「封面不得重复」的测试** | **低**——不影响 §4 可行性（可复用），**但「首用新封面」在 117 张池内已不可能** |
| **6** | **`so ... that` 目标句词数按两版计算** | `It was so cold that I stayed at home.` **9 词（超线）**；已给替代 `... I stayed home.` **8 词**；**`stayed home`（0 处）vs `stayed at home`（17 处）的语感差未核实** | **低**——若取 9 词版，**须知这是历史 9 课同类欠账的第 10 次** |
| **7** | **批三十四「20 课 67 处」的口径差未回溯** | 本轮实测 **68 处**（差 1）；**未回溯该 1 处的来源** | **低**——不影响 `several` 判定 |
| **8** | **`hunt-my-sister` 被 2 课重复引用** | 实测 `huntCaseIds` 共 192 条引用／191 唯一；`hunt-my-sister` 出现 2 次；未核实是否合规 | **低**——与本轮判定无关，**登记为数据质量观察点** |
| **9** | **`CAN_DO_MILESTONES` 是否有数量上限未核实** | 未确认里程碑条数是否有断言 | **低**——新建 `can-do-m36` 的前提 |
| **10** | **`english.cool` 的 `as far as` 节未逐句通读** | 只取了 h2／h3 标题 ＋ 开场句（够支撑判定）；**5 个 h3 各自的例句未逐条取** | **低**——判定理由**不依赖例句** |
| **11** | **`cdo_elvl` 抖动问题（批三十四新坑）本轮未复现** | 本轮取到的 CEFR 值（`several` A2／`as far as I know` B2／`EVEN IF` B2）**均有 badge 伴随**，符合批三十四 §7 项 3 的引用规则 | **✅ 已闭合**——**本轮未误用无 badge 的 `cdo_elvl` 单值** |
| **12** | **本轮报告自身未跑全库测试** | 只跑了 `grammarSeasons.test.ts` ＋ `grammarLessons.test.ts`（**35 passed**）；**未跑全库 825 项** | **低**——本轮未改任何数据文件，只读 |

---

## 附录 A：本轮逐字引用与可复跑清单

**⚠️ 每条引文均注明「文件＋行号」或「URL」；**库内引文的行号均经核对落在所述课内**。

### A.1 库内引文（文件＋行号）

| # | 引文（逐字） | 位置 | 复核命令 |
|---|---|---|---|
| 1 | `id: "lesson-186-so-that",` | `src/data/grammarLessons.ts:37148`（该课 **37147–37339**） | `grep -n 'id: "lesson-186-so-that"' src/data/grammarLessons.ts` |
| 2 | `id: "lesson-187-as-long-as",` | `:37342`（该课 **37341–37538**） | `grep -n 'id: "lesson-187-as-long-as"' src/data/grammarLessons.ts` |
| 3 | `id: "lesson-16-must",` ＋ `grammarLabel: "必须 · must / have to"` ＋ 目标句 `I must finish my homework today.` | `:2941`（该课 **2939–3120**） | `grep -n 'id: "lesson-16-must"' src/data/grammarLessons.ts` |
| 4 | `correct: "She has to get up early.",` ＋ `whyZh: "have to 里的 have 要变他/她/它版：she has to。must 不变形，但 have to 的 have 会变。"` | **L16 课内**（`has to` 全库仅此 2 处） | `node -e`（`has to` → 2） |
| 5 | `targetSentence: "Shall we take the quiet way?",` ＋ `wrong: "Shall we take the quiet way?",` | `:35469`（该课 **35468–35710**；`way` 全课 **32** 次） | `grep -n 'id: "lesson-179-shall"'` |
| 6 | `tokens: ["He","seems","to","know","the","way."],` | `:30932`（该课 **30932–31136**；`way` 2 次） | 逐课 `way` 计数 → L160:2 |
| 7 | `deepDive.title: "三个「有条件」的说法排一行"` | **L187 课内** | `sed -n '37341,37538p' src/data/grammarLessons.ts` |
| 8 | `deepDive` 逐字：`"外形上它跟第 65 课的 as tall as 是一个家族：两头各卡一个 as，中间换上要说的那个词。"` | **L187 课内** | 同上 |
| 9 | `deepDive.title: "must 和 have to 有什么不一样？"`（正文三段全文）＋ `oneLineRule: "说「必须」：must + 原样——I must go。must 和 can 一样，从来不变装。"` | **L16 课内** | `sed -n '2939,3120p' src/data/grammarLessons.ts` |
| 10 | `huntCases.ts:11` 注释：`如 case 9 的 advice / information` | `src/data/huntCases.ts:11`（**非教学内容**） | `grep -n "case" src/data/huntCases.ts` |
| 11 | `id: "hunt-as-long-as-forest",` ／ `number: 196` | `src/data/huntCases.ts:10209` | `grep -n 'hunt-as-long-as-forest' src/data/huntCases.ts` |
| 12 | `id: "can-do-m35",` ／ `afterLesson: 187` | `src/pages/GrammarPathPage.tsx:360` | `grep -n "can-do-m35" src/pages/GrammarPathPage.tsx` |
| 13 | 合法场景 14 个（`campus`…`sparkle`） | `src/components/AdventureScene.tsx:6–19` | `sed -n '1,40p' src/components/AdventureScene.tsx` |
| 14 | `tiny.length` **必须 ≤3**（小季上限） | `src/data/grammarSeasons.test.ts`（「季体量不得过小」用例） | `npx vitest run src/data/grammarSeasons.test.ts` |
| 15 | 批三十三 §5.3 改写表（把「复数用 aren't」改写成「**好几个东西**用 aren't」） | `roadmap-grammar-thirty-third-batch-2026-09-21.md` §5.3（经批三十四 `user-research-grammar-thirty-fourth-batch-2026-09-21.md:468` 转引） | `grep -n "好几个（东西）" deliverables/product-strategy/*.md` |
| 16 | L179／L160／L174／L140／L185 的 `way` 次数（32／2／1／1／2） | 逐课解析 | 见 §1.10 复跑命令 |

**一处引用格式说明**：上表 #15 的改写表原文含零术语词表里的词——**那是被引用文件的原文，本报告照实转引并加引号**；**本报告面向学习者的文案（§4 的 `oneLineRule` 与 `whyZh` 要点）已逐条自查，不含词表 29 词** ✅。

**A.1 复核总命令**（一次跑完上表 1–14 的词频部分）：

```bash
cd /Users/liujun/Documents/英语听写 && node -e '
const {readFileSync}=require("fs");
const GL=readFileSync("src/data/grammarLessons.ts","utf8");
const HC=readFileSync("src/data/huntCases.ts","utf8");
const esc=(w)=>w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
const c=(t,w)=>(t.match(new RegExp(`(^|[^A-Za-z])${esc(w)}([^A-Za-z]|$)`,"gi"))??[]).length;
const items=["several","even if","as if","as though","ought to","dare","provided","in case","case","way","far",
 "as far as","such as","now that","by the time","supposed to","had to","has to","have to","so that","such a","such",
 "even","ought","provide","suppose","supposed","the way","know","concerned","stayed home","stayed at home"];
for(const w of items) console.log(w.padEnd(16),String(c(GL,w)).padStart(6),String(c(HC,w)).padStart(6));
console.log("好几个 全库:",(GL.match(/好几个/g)||[]).length,"／不得不:",c(GL,"不得不"));'
```

### A.2 跨源引文（URL ＋ 本轮实取日期 2026-09-21）

**约定**：`…/must` 等简写均指 `dictionary.cambridge.org/grammar/british-grammar/` 下同路径。

| # | 引文（逐字） | URL（简写） |
|---|---|---|
| 1 | **"We use had to not must to express obligation and necessity in the past"** | `…/must` |
| 2 | **"We don't use must to express obligation and necessity in the past. We use had to instead"** | `…/must` |
| 3 | **"Not: Last year, teachers must make a report …"** | `…/must` |
| 4 | **"Not: When she got home, she must cook dinner before …"** | `…/must` |
| 5 | `When she got home, she had to cook dinner before everyone arrived.` | `…/must` |
| 6 | **"have to can be used in a variety of forms"** ＋ `I had to study for the exam` | `…/have-got-to-and-have-to` |
| 7 | **"We also use so + adjective or adverb before that-clauses. We do not use very in this structure:"** ＋ **"Not: They drove very fast that …"** | `…/so` |
| 8 | `It was so hot that we didn't leave the air-conditioned room all day.` | `…/so` |
| 9 | **"We use such before the indefinite article, a/an"** ＋ **"Not: We had a such awful meal …"** | `…/such` |
| 10 | h2 逐字 `Such as a determiner`／`Such meaning 'of this or that kind'`／`Such … that` | `…/such` |
| 11 | **`Not: She is so great cook.`**／`Not: That was such unpleasant.`／`Not: Why do you drive such fast?`／`Not: This is a so wonderful kitchen!`／`Not: You're such kind.` | `…/such-or-so` |
| 12 | **"We use by the time, meaning 'when', to connect an action that has happened or will have happened before a second action."** ＋ **"Not: By the time you will wake up …"** | `…/by` |
| 13 | **"In case is a conjunction or adverb."**／**"We don't use in case to mean 'if'."**（title 逐字 `In case (of)`） | `…/in-case` |
| 14 | **"We can use now that as a conjunction to refer to something and its result(s):"**（**page title 逐字 `Now`**，`Not:` ＝ 0） | `…/now-that` |
| 15 | **"Be supposed to is used to talk about obligations and arrangements:"**（**主文 title 逐字 `Be expressions (be able to, be due to)`**，`Not:` ＝ 0） | `…/supposed-to` |
| 16 | **"We can use such as to introduce an example or examples of something we mention."** ＋ `Not: … to love 1960s rock bands, as the Beatles …`（title 逐字 `Such as`） | `…/such-as` |
| 17 | `Such as is similar to like for introducing examples, but it is more formal, and is used more in writing than like:` | `…/such-as` |
| 18 | **"We can use even if to mean if when talking about surprising or extreme situations:"**（**page title 逐字 `If`**，该节全文仅两句） | `…/even-if` |
| 19 | h2 逐字 `If: conditions`／`If possible, if necessary`／`If so, if not`／`Even if`／`If: reporting questions`／`If and politeness` | `…/even-if` |
| 20 | **"used to say what you think is true, although you do not know all the facts"**（headword `as/so far as I know`，`phrase`，**CEFR B2**） | `dictionary.cambridge.org/dictionary/english/as-so-far-as-i-know` |
| 21 | **`From here, you can see as far as the ocean.`**（**距离义**，`Far` 页唯一 `as far as`） | `…/far` |
| 22 | **`as far as` 无独立页**：`/grammar/british-grammar/as-far-as` → title 逐字 **`Explore the English Grammar`** | `dictionary.cambridge.org` |
| 23 | h2 逐字 `1. as long as  只要…`／`2. as soon as  一…就…`／**`3. as far as`** ＋ h3 ×5 逐字（`❶ as far as [something] is concerned  關於某事物` … `❺ as far as it goes 在一定程度上還不錯`）＋ 开场句 `far 的意思為「遠的」…後面會加上名詞。` | `english.cool/as-long-as/` |
| 24 | **"As long as and so long as are conjunctions."**（**L187 的跨源依据，本轮复核仍在**） | `…/as-long-as-and-so-long-as` |
| 25 | h2 逐字 `Way as a noun`／`Way as an adverb`／`In the way, on the way`（**页内无 `the way ...` 那个结构**） | `…/way` |
| 26 | h2 逐字 `Be about to`／`Be able to`／`Be due to`／`Be likely to`／`Be meant to`／`Be supposed to` | `…/supposed-to` |

### A.3 一处方法论更正（请后续批次采用）

**批三十一 §4.3 登记的「子串口径会误判」（`table` 算成 `able`／`bought` 算成 `ought`）本轮复现，并扩展出一类新假阳性：**

> **⚠️ 新坑：字段名会被词边界口径算成「教学内容」。**
> 实测：`kind` 原始计数 **1123**，其中 **1121 处是 `kind:` 字段名**（`guided` 步骤的类型字段），**真正的散文 `kind` 只有 2 处**。
> 同类高危字段名词：`text`(469)／`cover`(491)／`title`(374)／`answer`(2280)／`number`(187)／`scene`(187)／`id`(201)。
>
> **⇒ 引用规则**：**任何词频统计在报告前，必须扣除同名字段键的计数**。
>
> ```js
> const raw   = (w)=>(GL.match(new RegExp(`(^|[^A-Za-z])${esc(w)}([^A-Za-z]|$)`,"gi"))??[]).length;
> const field = (w)=>(GL.match(new RegExp(`${esc(w)}:\\s*"`,"g"))||[]).length;
> for(const w of ["kind","text","cover","title","answer","number","scene","id"])
>   console.log(w, "raw="+raw(w), "field="+field(w), "real="+(raw(w)-field(w)));
> // → kind raw=1123 field=1121 real=2 / text raw=469 field=469 real=0
> ```
>
> **对本轮的影响**：**判定用的词（`way`／`far`／`such`／`case`／`several`）均不是字段名，未受影响** ✅。**但 `kind` 一类的词今后必须按此口径统计。**

---

## 附录 B：本轮的「不做」总清单（15 项 ＋ 1 轴）

| # | 项 | 判定 | 一句话理由 | 来源 |
|---|---|---|---|---|
| 1 | `several` | ❌ 维持不做 | 中文锚「好几个」＝我方自建替代表达（20 课 68 处）；3 条带标记错不可满足 | §1.2 |
| 2 | `even if` | ❌ 维持不做独立课（**改为折入对照卡**） | 是 `If` 页的 h2（page title 逐字 `If`）；真错只 2 条 | §1.3 |
| 3 | `as if` | ❌ 维持不做 | 跨源落 hub 页；抢 L159／L160 的 `look`／`seem` 槽位（`好像` 4 课 39 处／`看起来` 11 课 117 处） | §1.4 |
| 4 | `as though` | ❌ 维持不做 | 同义换词（`as if`）；跨源比 `as if` 更薄 | §1.5 |
| 5 | `ought to` | ❌ 维持不做 | 同义换词，撞 L47 `should`（`:8734–8919`）；`应该` 6 课 48 处 | §1.6 |
| 6 | `dare` | ❌ 维持不做 | 跨源自述 "Less commonly"；CEFR B2；中文侧 404 | §1.7 |
| 7 | `provided` | ❌ 维持不做（**理由改写**） | 跨源落点是「同页并列」（5 词挤 1 个 h2）；刚交付的 L187 是同义 | §1.8 |
| 8 | `in case` | ❌ 维持不做（**理由改写**） | **有独立规则页（原判「无规则页」被推翻）**；但无 `Not:` 模板，真错只 2 条 | §1.9 |
| 9 | `way` | ❌ 维持不做（**理由必须整条作废**） | **「词频近零」实测为假（GL 38／5 课）**；真零的是那个结构（0）而该结构跨源不存在 | §1.10 |
| 10 | `by the time` | ❌ 不做 | 真搭档 `will have` 已判撤出（批二十二）；单开与 L92 `when` 同义 | §2.4 |
| 11 | `now that` | ❌ 不做 | 非独立页（page title 逐字 `Now`）；`Not:` ＝ 0；中文「既然」0 处 | §2.5 |
| 12 | `supposed to` | ❌ 不做 | 同义换词（撞 L47／L16）；与 L174 同页；`Not:` ＝ 0 | §2.6 |
| 13 | `such as` | ❌ 不做 | 词汇点非结构课；撞 L159 `like`；唯一增量是逗号（不教标点） | §2.7 |
| 14 | **`as far as`** | ❌ **不做（本轮新候选轴终判）** | **固定短语家族非句式轴；跨源无独立语法页；与 L65／L187 构成同形三义** | §2.8 |
| 15 | `several`（刻度卡） | ⏳ 处置待办（非新课） | 转为 L114 的 3 张刻度卡 | §1.2 |

**⇒ 净产出：15 项不做 ＋ 3 项建议做（`had to`／`so ... that`／`such a`，合并为 2 课）。**

---

> 本报告由产品战略团队 AI 协作生成（瑞思 · 用户研究）。**所有库内数字均以 node 脚本词边界口径实测、附可复跑命令；所有跨源引文标注 URL 并于 2026-09-21 实取。§5 未核实项请勿当作已验证结论使用。** 重要决策请由产品负责人审定。
