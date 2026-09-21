# 用户研究 · 语法线「小美的一天」第三十四批

**日期**：2026-09-21 ｜ **类型**：用户研究（语法线第三十四批）｜ **研究员**：瑞思
**上游**：`b-tier-frontier-survey-2026-09-20.md`（B 档前沿普查）＋`roadmap-grammar-thirty-third-batch-2026-09-21.md`（批三十三）
**本批候选三轴**：轴 A `so that`（为了／以便）／轴 B `as long as`（只要）／轴 C `several`（几个）

---

## §0 本轮实读口径声明（必读）

### 0.1 冻结快照与课号边界

| 文件 | 行数 | 课／案 |
|---|---|---|
| `src/data/grammarLessons.ts` | **37,149** | **185 课** |
| `src/data/huntCases.ts` | **10,163** | **194 案** |
| `src/data/grammarSeasons.ts` | 75 | **28 季** |
| `src/components/AdventureScene.tsx` | 476 | 14 个合法场景 ID |

```bash
node -e '
const {readFileSync}=require("fs");
const lines=readFileSync("src/data/grammarLessons.ts","utf8").split("\n");
const ids=[],nums=[];
lines.forEach((l,i)=>{const m=l.match(/^\s*id:\s*"([^"]+)"/);if(m)ids.push([i+1,m[1]]);
 const n=l.match(/^\s*number:\s*(\d+)/);if(n)nums.push([i+1,+n[1]]);});
const recs=ids.map(([ln,id])=>{const c=nums.find(x=>x[0]>ln&&x[0]<ln+12);return{id,number:c?c[1]:null};});
const ns=recs.map(r=>r.number), max=Math.max(...ns), set=new Set(ns);
const missing=[];for(let i=1;i<=max;i++) if(!set.has(i)) missing.push(i);
const cnt={}; ns.forEach(n=>cnt[n]=(cnt[n]||0)+1);
console.log("课数",recs.length,"最大课号",max,"缺号",missing.join(",")||"(无)",
 "重号",Object.entries(cnt).filter(([,v])=>v>1).length);
'
# → 课数 185 最大课号 185 缺号 (无) 重号 0
```

**⇒ 结论：L1–L185 连续无缺号、无重号。下一可用课号 = L186。**

### 0.2 工具坑：本机 `grep` 是 ugrep（本轮当场复现）

```bash
grep -oniE "(^|[^A-Za-z])so that([^A-Za-z]|$)" src/data/grammarLessons.ts
# → 无输出（0 命中，错误）
node -e '
const {readFileSync}=require("fs");
const GL=readFileSync("src/data/grammarLessons.ts","utf8");
const c=(w)=>(GL.match(new RegExp(`(^|[^A-Za-z])${w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}([^A-Za-z]|$)`,"gi"))??[]).length;
console.log("so that =",c("so that"));
'
# → so that = 1   （且这 1 处是假阳性，见 §2.1）
```

**⇒ 本轮全部词频一律走 node 脚本、词边界口径**。`grep` 只用于不带词边界的粗定位。

### 0.3 三种口径并列（延续批三十至批三十三的纪律）

| 口径 | 定义 | 本批用途 |
|---|---|---|
| **词边界口径** | `(^\|[^A-Za-z])词([^A-Za-z]\|$)` | **词频唯一口径** |
| **连续子序列口径** | 标点／空白归一到单空格后做子串匹配（不跨词） | **复用／查重唯一口径** |
| **课程块口径** | 按 `id: "lesson-…",` 切块、剔注释行 | **逐课归因唯一口径** |

**两个脚本（本轮落在 `/tmp/`，可复跑）**：`glscan.js` ＝课程块索引（`.lessons`／`.count()`／`.hits()`／`.lessonsOf()`）；`dedup2.js` ＝连续子序列查重（`.scan(GL,句)`／`.scan(HC,句)`）。

```bash
# 口径自检：拿一条已知高频复现句做阳性对照
node -e 'const {scan,GL,HC}=require("/tmp/dedup2.js");
console.log("I go to the shop to buy milk. GL="+scan(GL,"I go to the shop to buy milk."));'
# → I go to the shop to buy milk. GL=33   ✅ 口径有效
```

### 0.4 ⚠️ 逐字引用纪律：引文全部给「文件＋行号＋课号」三元组

```bash
node -e '
const {readFileSync}=require("fs");
const lines=readFileSync("src/data/grammarLessons.ts","utf8").split("\n");
const starts=[]; lines.forEach((l,i)=>{ if(/^\s{4}id: "lesson-[^"]+",\s*$/.test(l)) starts.push(i); });
const ln=+process.argv[1]; let b=null;
for(const s of starts){ if(s<=ln-1) b=s; else break; }
console.log("行号 "+ln+" 属于 "+lines[b].trim());
' 33986
# → 行号 33986 属于 id: "lesson-173-in-order-to",   ✅ 行号与课号对应
```

### 0.5 红线基线实测（本轮独立复算，185 课全量）

| 断言 | 实测 | 状态 |
|---|---|---|
| `contrast` 恰好 6 条 | **185/185，零例外** | ✅ 红线成立 |
| `variants` 恰好 3 条 | **185/185，零例外** | ✅ |
| `scene` 非法 ID | **0 处**（14 个合法值全在内） | ✅ |
| `practice` 答案同句 ≤6 课 | **最高 6**（`Yesterday I went to the park.`／`There is a book on the desk.` 各 6 课） | ✅ 零越线 |
| 案号唯一 | **194/194 唯一、无缺号** | ✅ |
| `targetSentence` >8 词 | **9 课**（L86／L101／L102 历史 ＋ L173／L178／L182–185 并发新增） | ⚠️ 见 §9 |

```bash
node -e '
const S=require("/tmp/glscan.js");
let bad=[];
S.lessons.forEach(L=>{const seg=S.lines.slice(L.start-1,L.end).join("\n");
 const m=seg.match(/contrast:\s*\[([\s\S]*?)\n    \],/);
 const n=m?(m[1].match(/wrong:/g)||[]).length:0; if(n!==6)bad.push(L.number+":"+n);});
console.log("contrast != 6 =>", bad.length?bad.join(","):"(全库 6 条)");
'
# → contrast != 6 => (全库 6 条)
```

### 0.6 零术语口径

**红线词表 29 词**（`src/data/grammarZeroTerms.ts`）：主语／谓语／宾语／表语／定语／状语／单数／复数／三单／原形／时态／一般过去时／一般现在时／现在进行时／过去进行时／现在完成时／情态动词／比较级／最高级／从句／语序／可数／疑问句／否定句／被动语态／第三人称／形容词／副词／介词。

**守门现状（批三十三已升级为遍历式全字段兜底）**：`grammarLessons.test.ts` 末段遍历每课**所有字符串字段**，只豁免 `deepDive`。

**本批自检**：§7 两课的全部**用户可见必读文案**（`title`／`grammarLabel`／`oneLineRule`／`intentZh`／`sceneSetupZh`／`blocks.role`／`summary.*`／`guided.promptZh`／`practice.promptZh`／`contrast.whyZh`／`variants.*`／`recall.*`／`sceneSwings.sceneZh`）**已逐词对过 29 词表，零命中**。

```bash
node -e '
const {readFileSync}=require("fs");
const T=readFileSync("deliverables/product-strategy/user-research-grammar-thirty-fourth-batch-2026-09-21.md","utf8");
const Z=readFileSync("src/data/grammarZeroTerms.ts","utf8");
const terms=[...Z.matchAll(/"([^"]+)"/g)].map(m=>m[1]).filter(t=>!/^[a-z_]+$/.test(t)&&t.length>1);
const lines=T.split("\n"); const s=lines.findIndex(l=>l.startsWith("## §7")); const e=lines.findIndex(l=>l.startsWith("## §8"));
console.log("§7 命中术语:", terms.filter(t=>lines.slice(s,e).join("\n").includes(t)).join("/")||"(零 ✅)");
'
# → §7 命中术语: (零 ✅)
```

**⚠️ 自查抓到三处、均已改写**：① 轴 A 初稿「后面接**完整小句**」——擦边同族词，改为「后面要带上『谁 + 做什么』」；② 轴 B 初稿「**条件**从句」——**直接命中**，改为「前面那半句说『在什么前提下』」；③ §7 复现取材表初稿「同**主语**用 L173」——**直接命中**，改为「前后同一个人用 L173」。

**⚠️ 本报告正文（§0–§6、§8–§10）是研究方法记录，按本库惯例与 `deepDive` 同级处理**——正文在**引用红线词表本身**（本段）与**引用既有文档逐字**（§4.3 引批三十三改写表）时不可避免地出现术语，**这不属于面向学习者的文案**。**面向学习者的文案只在 §7，已实测零术语** ✅

---

## §1 逐轴缺口盘点

### 1.1 三轴实测缺口表（词边界口径，185 课快照）

| 轴 | 词串 | GL 实测 | HC 实测 | 档位（普查） | 独立增量 | 排期压力 |
|---|---|---|---|---|---|---|
| **A** | `so that` | **1**（**假阳性**） | **0** | B | **结构新**（后跟「谁＋做什么」而非动作） | **⚠️ 高**（撞 `in order to` L173／`so` 所以义 L20） |
| **B** | `as long as` | **0** | **0** | B | **结构新**（`as…as` 三词块 ＋ 现在时说将来） | **低**（与 `if`／`unless` 是三格刻度，不是重复） |
| **C** | `several` | **0** | **0** | B | **仅刻度一条**（`more than two but not very many`） | **高**（撞 L114 `a few`／L30 `some`／L167 `a lot of`） |

**轴 A 的唯一 1 处是假阳性**——逐字核实为 `So that was last night!`（`So` 开头的感叹句，与「为了」无关），落在 **L102**：

```bash
node -e '
const S=require("/tmp/glscan.js");
console.log("so that 命中行:", S.hits("so that").join(","));
console.log("行 19420 属于:", JSON.stringify(S.lessonAt(19420)));
'
# → so that 命中行: 19420
# → 行 19420 属于: { id: "lesson-102-phone-story", start: 19395, end: 19590, number: 102 }
```

### 1.2 三轴证据链（本轮亲自复核，逐条给数）

| 轴 | 关键实测（GL／HC）与归因 |
|---|---|
| **A `so that`** | 整串 **GL 1（假阳性）／HC 0** ⇒ **真零**。`so` **159／30**——但「所以」义已被 **L20** 付掉（L20 出现 58 次）。`that` **162／9**——两张脸全与「为了」无关（L35／L36 的「话中话」＋ L65 的第二个 `as`）。`in order to` **48／2**，**45 处在 L173 一课**；**`为了` 全库 40 处，L173 占 39** |
| **B `as long as`** | 整串 **GL 0／HC 0**（`as long` 亦 **0**，不是「部分存在」）⇒ **真零**。`as` **432／53**——**`as…as`（L65）与 `as soon as`（L142／L143）已把 `as` 教过两轮**。`long` **43／2**——**L73 是主场（38 处）**。`unless` **81／6**（L172 占 65）；`if` **176／7**（L48 占 64／L49 占 54） |
| **C `several`** | 整串 **GL 0／HC 0** ⇒ **真零**（无假阳性）。上位四层全部已教且同构：`some` **195／16**、`many` **131／13**、`a few` **62／7**、`a lot of` **70／5**。普查判它与 `a couple of`「二选一」，而**我方两个都没教**（`a couple of` GL 0） |

### 1.3 真实表达需求：从零基础中国学习者的「想说却说不出来」出发

**判定标准**：一个学完 185 课的零基础中国学习者，在真实生活场景里会不会「有话卡在嘴边」。

| 轴 | 真实口语场景 | 中文常用度 | 说不出来的后果 |
|---|---|---|---|
| **A `so that`** | 「我**早点来**是为了让你**能歇会儿**」「我把**灯开着**是为了让你**看得见**」「我**说慢点**是为了让你**听得懂**」 | **极常用**：中文「是为了…能…」是**目的＋后果**的头号说法；且**中文允许两个人** | **能绕开但会绕错**：学过 `in order to`（L173）的学生会说 `I came early in order to you can rest.`——**L173 的 `in order to` 后面只能跟动作，前后必须是同一个人**。**中文允许换人，英语这个说法不允许** ⇒ **这是「越学越错」的一格** |
| **B `as long as`** | 「**只要**你来我就去」「**只要**你写完就能玩」「**只要**天晴我们就出发」 | **常用**：中文「只要…就…」是**条件＋承诺**的标准说法 | **能绕开**：说 `If you come, I will go.`（L48）**意思 90% 到位**，只丢了「这是个承诺／这是个底线」那层口气。**不是结构性缺失** |
| **C `several`** | 「我读了**好几**本书」「**好几**个同学都这么问」 | **常用**：中文「好几」高频 | **能绕开**：说 `a few`（L114）或 `some`（L30）或 `a lot of`（L167），**听话人不会误解**，只是数量感偏了 |

**⇒ 从「真实表达需求」单一维度看：A ＞ B ＞ C。**

**关键判读（本批与批三十二最关键的不同点）**：
- **批三十二的轴 A（`had better`）是「能绕开、只丢口气」**；
- **本批的轴 A（`so that`）是「绕不开、且用已教内容去绕必然出错」**——`in order to`（L173，并发方刚教）**只允许同一个人**，而中文「是为了让你…」**几乎总是换人**。**学生越熟练 L173，越会把 `in order to you can rest` 说出来。** 这是一个**由既有课程本身产生的、可复现的错误**（§2.2 逐条论证）。

### 1.4 排序与结论（本报告的推荐）

**排序不能只看需求，必须与「独立增量条数」「撞车程度」「造词成本」「场景零件齐备度」加权**：

| 加权项 | 轴 A `so that` | 轴 B `as long as` | 轴 C `several` |
|---|---|---|---|
| 真实需求（1.3） | **最高** | 中 | 低 |
| 独立增量条数 | **3 条**（换人 ／ 后跟「谁＋做什么」／ `that` 可省但 `so` 不能单用） | **3 条**（`as…as` 三词块两头卡 ／ 现在时说将来 ／ 与 `if` 的口气差） | **1 条**（刻度） |
| 撞已教内容 | ⚠️ 中（L173 同中文锚「为了」；**但结构正好相反，是可教的对立**） | **低**（与 L48／L172 是三格刻度） | **⚠️ 高**（L114／L30／L167 三层已占满同一句法位） |
| 场景位（`scene`） | ✅ 可用 `desert`（**0 课**）／`space`（**0 课**） | ✅ 可用 `forest`（2 课）／`magic`（2 课） | ⚠️ 仅剩 `desert`／`space`／`magic` |
| 造词成本 | **0**（`came`／`early`／`so`／`that`／`can`／`rest` 全在库） | **0**（`will`／`go`／`as`／`long`／`you`／`come` 全在库） | **1**（`several` 真零，无同根词） |
| 一句话规则能否说清 | ✅ 能（「两个人做两件事」一句话切分） | ✅ 能（「前提那半句用现在时」） | ⚠️ **很难**（要与 `a few` 比刻度，必然拖成两条） |
| **结论** | ✅ **1 课，第 1 顺位** | ✅ **1 课，第 2 顺位** | ❌ **不做**（缓排 → 不做，见 §4） |

**⇒ 本报告的推荐：**

| 顺位 | 轴 | 建议课量 | 课号 | 理由 |
|---|---|---|---|---|
| **1** | **轴 A `so that`** | **1 课** | **L186** | **唯一「越学越错」型缺口**——L173 `in order to` 只允许同一个人，中文「为了让你…」几乎总是换人 ⇒ 学生必然产出 `in order to you can rest`。**造词 0、场景位可用 `desert`。** |
| **2** | **轴 B `as long as`** | **1 课** | **L187** | 需求真、增量硬（`as…as` 两头卡 ＋ 现在时说将来）、造词 0；**但与 `if`／`unless` 是三格刻度，紧急度低于 A**。 |
| **3** | **轴 C `several`** | **0 课（不做）** | — | **复核结论：批三十二的「缓排」不仅成立、且应升级为「不做」**（§4）——**中文锚「好几个」已被批三十三正式定为「复数」的替代表达**，教了会让 20 课已教内容变乱。 |

**⇒ 本批建议取 2 课：L186（轴 A）＋ L187（轴 B）；轴 C 建议从 B 档候选清单关闭（§4）。**

---

## §2 轴 A 专项（本轮重点）：`so that` 与 L173 `in order to` 的切分

### 2.1 ① 逐字读并发方新教的 L173

**L173 课程块**：`src/data/grammarLessons.ts` **行 33983–34230**，`id: "lesson-173-in-order-to"`。

| 字段 | 行号 | 逐字内容 |
|---|---|---|
| `id` | **33983** | `id: "lesson-173-in-order-to",` |
| `number` | 33984 | `number: 173,` |
| `title` | 33985 | `title: "为了赶上早班车",` |
| **`grammarLabel`** | **33986** | `grammarLabel: "为了 · in order to",` |
| `scene` | 33987 | `scene: "city",` |
| **`targetSentence`** | **33993** | `targetSentence: "I got up early in order to catch the bus.",` |
| **`oneLineRule`** | **34004** | `oneLineRule: "说「为了」用 in order to——I got up early in order to catch the bus（为了赶上那班车，我起得很早）。它和第 44 课那块小垫板 to 是一家人，说的时候正式一点、清楚一点。",` |
| `huntCaseIds` | — | `["hunt-in-order-to-bus"]` |

```bash
sed -n '33983p;33986p;33991p;33993p;34004p' src/data/grammarLessons.ts
node -e '
const {readFileSync}=require("fs");
const lines=readFileSync("src/data/grammarLessons.ts","utf8").split("\n");
const starts=[]; lines.forEach((l,i)=>{ if(/^\s{4}id: "lesson-[^"]+",\s*$/.test(l)) starts.push(i); });
[33983,33986,33993,34004].forEach(ln=>{ let b=null;
  for(const s of starts){ if(s<=ln-1) b=s; else break; }
  console.log(ln, "→", lines[b].trim()); });
'
# → 33983 → id: "lesson-173-in-order-to",   ✅
# → 33986 → id: "lesson-173-in-order-to",   ✅ (grammarLabel: "为了 · in order to")
# → 33993 → id: "lesson-173-in-order-to",   ✅ (targetSentence: "I got up early in order to catch the bus.")
# → 34004 → id: "lesson-173-in-order-to",   ✅ (oneLineRule: "说「为了」用 in order to…")
```

**L173 的三条带标记错（逐字）与 `blocks`（逐字）**：

| # | `wrong` | `wrongMark` | 教的是什么 |
|---|---|---|---|
| 1 | `I got up early in order to catching the bus.` | `catching` | `in order to` 后穿原样 |
| 2 | `I got up early in order catch the bus.` | `order` | 三词块不能少 `to` |
| 3 | `I got up early for to catch the bus.` | `for` | 「为了做某事」不用 `for to` |

```js
// L173 的 blocks 逐字（行 33995–34002）——in order to 被界定为「一整个块」
blocks: [
  { text: "I got up early", role: "我起得很早（做的事）" },
  { text: "in order to catch the bus", role: "为了赶上那班车（为的是什么）" }
]
```

**⇒ 关键事实：L173 的三条错句、`blocks`、以及 `variants[1]` 的 `in order not to miss the bus`——前后全是同一个人（我早起、我赶车）。L173 从未教过「两个人」的情形。**

### 2.2 ② ③ 判定：是不是同义？「谁＋做什么」是不是真增量？

**外部源逐字（本轮 WebFetch 独立取到，非转引）**：

**Cambridge `So that or in order that?` 页**：

> 「We use **so that and in order that** to talk about purpose.」／「**So that is far more common than in order that**, and in order that is more formal.」
> 「We often leave out **that** after so in informal situations.」／「When referring to the future, we can use the present simple or **will/'ll** after so that.」
> 例：`I'll go by car so that I can take more luggage.`
> 例：`We left a message with his neighbour so that he would know we'd called.` ← **从 we 换成了 he**
> 例：`I'll post the CD today so that you get it by the weekend.` ← **从 I 换成了 you**

**Cambridge `In order to` 页**：

> 「We use in order to **with an infinitive form of a verb** to express the purpose of something.」／「It is **more common in writing than in speaking**.」／「**The negative of in order to is in order not to.**」

**⇒ 判定：不是同义换词，是「同目的、不同结构」的一对。**

| 维度 | `in order to`（L173 已教） | `so that`（拟教） | 同义？ |
|---|---|---|---|
| **后面跟什么** | **一个动作**（`catch the bus`）——Cambridge 逐字 `with an infinitive form of a verb` | **「谁 + 做什么」**——Cambridge 例 `so that I can take more luggage` | ❌ 结构不同 |
| **能不能换人** | **不能**（前后都是「我」） | **能，官方三例里两例换了人**（`we→he`、`I→you`） | ❌ 能力不同 |
| **`that` 能不能省** | 整块不可拆 | Cambridge 逐字 `We often leave out that after so` | ❌ 形态不同 |
| **能不能带 `can`／`will`** | 不能（后面只能是动作原样） | 常见（Cambridge 逐字 `often with modal verbs: can, would, will`） | ❌ 搭配不同 |
| **中文对应** | 「为了**做**某事」（同一人） | 「是为了**让某人能**做某事」 | ✅ 目的义相同 |

**⇒ 一句话给零基础：`in order to` 后面跟「做什么」，`so that` 后面跟「谁 + 能做什么」。**

#### 「谁＋做什么」是真增量吗？——**是，三层证据**

**① 学生的母语在逼他犯错**：中文「是为了…」**天生允许换人**——「我早点来是为了**让你**能歇会儿」（我→你）／「我把灯开着是为了**让你**看得见」／「我说慢点是为了**让你**听得懂」。**而 L173 的 `in order to` 不允许换人。** ⇒ 学生按中文结构把 L173 的零件装到换人的位置上，产出 `*I came early in order to you can rest.`——**这不是「没学好 L173」，恰恰是「L173 学好了，但那一格装不下这个意思」。**

**② 这个错在库里可复现、且是完整句**：L173 的 `blocks` 逐字把 `in order to catch the bus` 界定为一个**不可分整块**，后面接的是「一件事」。学生想塞进「让你能歇会儿」，整块就不成立——**这正是 `so that` 的位子。**

**③ 后半截能带 `can` 在库里是新形态**：`can` **GL 431／HC 24**、分布 38 课，但**从未与一个「为了」结构合用过**（`so that` GL 0）。L14 教的是 `can` 独立表能力（逐字 `oneLineRule: "说「能/会」，动词前面放 can，动词一点不变：I can swim。"` @行 2584）。**⇒ `so that` 把两个已教零件（`so` 的「所以」义 ＋ `can` 的能力义）拼成一个新结构——词全是熟的，结构是新的，正是「一课一增量」的理想形态。**

#### ⚠️ 减分项：**L173 抢占了中文锚「为了」**

| 中文锚 | 全库处数 | 分布 | 判读 |
|---|---|---|---|
| **「为了」** | **40** | **L173: 39**／L185: 1 | **已被 L173 独占** |
| 「以便」／「好让」 | **0** | — | **完全空白** |
| **「是为了」** | **1** | **L173 @33989 的 `sceneSetupZh`**（`早起就是为了它`） | **仅 1 处、且不是本轴的结构义**（那里是「为了它」＝为了那班车）；**「是为了让谁做什么」全库 0 处** ✅ |
| **「让你」** | **48** | 27 课零散（L103:5／L104:6／L107:6…） | **库里已流通的中文表达，不是生造** |

```bash
node -e '
const S=require("/tmp/glscan.js");
["为了","以便","好让","是为了","让你"].forEach(w=>{
  const hits=[]; let tot=0;
  S.lessons.forEach(L=>{let n=0;for(let i=L.start-1;i<L.end;i++){const m=S.lines[i].match(new RegExp(w,"g"));if(m)n+=m.length;}
    if(n){hits.push("L"+L.number+":"+n);tot+=n;}});
  console.log(w.padEnd(8)+" total="+String(tot).padStart(3)+"  "+hits.join(" "));
});
'
# → 为了      total= 40  L173:39 L185:1
# → 以便      total=  0
# → 好让      total=  0
# → 是为了     total=  1  L173:1（sceneSetupZh 的「早起就是为了它」，非本轴结构义）
# → 让你      total= 48  L32:1 L44:1 L47:1 L58:1 L65:1 L91:1 L101:1 L102:1 L103:5 L104:6 L105:4 L107:6 L110:3 L118:1 L124:1 L127:1 L133:1 L139:2 L141:2 L142:1 L144:2 L147:2 L150:2 L157:1
```

**⇒ 处置建议（给写课方）：本课中文锚走「是为了让你…能…」，不走裸「为了」。** L173 ＝「为了赶上那班车」（**同一人**，动作）；L186 ＝「是为了**让你能**歇会儿」（**换人**，谁＋做什么）。**两个中文锚不撞，且差别正好落在结构差别上。**

### 2.3 ④ 能否设计出 3 条不重复的带标记新错？

**能。三条全部经连续子序列口径查重，GL／HC 双文件均为 0。**

| # | 带标记错句 | `wrongMark` | 罪名（`GrammarErrorTag`） | 为什么零基础会这么写 | GL | HC |
|---|---|---|---|---|---|---|
| **1** | `I came early so that can rest.` | `that` | `fragment` | **漏了后半截的「谁」**——中文「是为了能歇会儿」可省「你」，英语这半截必须有 | **0** | **0** |
| **2** | `I came early so that you can resting.` | `resting` | `verb_form` | **`can` 后面穿了 `-ing`**——L173 的 `in order to catching` 毛病迁移过来 | **0** | **0** |
| **3** | `I came early in order to you can rest.` | `in order to you` | `verb_form` | **把 L173 的 `in order to` 装到换人的位置上**——母语负迁移的典型产物，**本课存在的根本理由** | **0** | **0** |

```bash
node -e '
const {scan,GL,HC}=require("/tmp/dedup2.js");
[["错1","I came early so that can rest."],
 ["错2","I came early so that you can resting."],
 ["错3","I came early in order to you can rest."]].forEach(([k,s])=>
  console.log(k, "GL="+scan(GL,s), "HC="+scan(HC,s)));
'
# → 错1 GL=0 HC=0 / 错2 GL=0 HC=0 / 错3 GL=0 HC=0
```

**三条标记互不相同，且与 L173 的三条标记（`catching`／`order`／`for`）零重叠** ✅

**⚠️ 多词 `wrongMark` 的既有惯例核实**：本库 `wrongMark` 共 **619 条**，其中 **48 条是多词**（`Am I`／`not are`／`to go`／`will going`／`each other`／`rather would`…）⇒ **多词标记是既有惯例**：

```bash
node -e '
const S=require("/tmp/glscan.js");
const marks=[];
S.lessons.forEach(L=>{const seg=S.lines.slice(L.start-1,L.end).join("\n");
 const m=seg.match(/contrast:\s*\[([\s\S]*?)\n    \],/); if(!m)return;
 [...m[1].matchAll(/wrongMark:\s*"([^"]*)"/g)].forEach(x=>marks.push(x[1]));});
console.log("wrongMark 总数",marks.length,"| 多词标记",marks.filter(m=>m.includes(" ")).length);
'
# → wrongMark 总数 619 | 多词标记 48
```

### 2.4 轴 A 结论

| 项 | 判定 |
|---|---|
| 与 `in order to`（L173）是否同义？ | **不是同义换词，是「同目的、不同结构」**——换人能力、后接成分、`that` 可省三项全不同 |
| 「谁＋做什么」是不是真增量？ | **是，且是本批最硬的一条**——**中文逼学生换人，而 L173 装不下** |
| 能否撑 1 课？ | **能**——1 条规则 ＋ 3 条带标记新错 ＋ 3 条双正解 ＋ 否定/疑问三态，**全部零造词** |
| 主要减分项 | **中文锚「为了」已被 L173 占 39/40** ⇒ 本课改走「是为了让你…能…」（`让你` 48 处在库、`是为了让谁做什么` **全库 0 处**，无撞车） |

---

## §3 轴 B 专项：`as long as` 与 `if`／`unless` 的切分

### 3.1 三方逐字对照（本轮实读，全部给行号）

| 课 | 行号块 | `grammarLabel` @行 | `targetSentence` @行 | `oneLineRule` 逐字 |
|---|---|---|---|---|
| **L48** | 8923–9115 | `条件句 · if 里说现在` @**8941** | `If it rains, I will stay at home.` @8948 | @**8940**：`说「如果…就…」：if 里说现在（If it rains），主句说将来（I will stay）——if 里不用 will，「如果的路面用现在时铺」。` |
| **L172**（并发） | 33734–33982 | `除非 · unless` @**33737** | `We will go unless it rains.` @**33744** | @**33755**：`说「除非」用 unless——We will go unless it rains（除非下雨，不然我们就去）。它和第 48 课那个 if 正好反着：if 说「如果下雨就不去」，unless 说「不下雨就去」。` |
| **L49** | 9116–9308 | `收口 · 建议 + 条件` @9130 | `You should take an umbrella if it rains.` @9137 | @**9133**：`建议加条件：主建议用 should（You should take an umbrella），条件用 if 挂后面（if it rains）——should 不垫板、if 里说现在。` |

```bash
sed -n '8940p;8941p;8948p;9133p;33737p;33744p;33755p' src/data/grammarLessons.ts
```

### 3.2 中文「只要」的入口：干净，但有两处擦边

**实测**：`只要` **全库 10 处／8 课**，**没有一处是「只要…就…」的条件义**：

| 课 | 处数 | 逐字语境 | 是不是条件义？ |
|---|---|---|---|
| L1／L17／L115×2／L142／L163 | 各 1–2 | `现在只要记住…`／`否定只要把 not 放回…`／`一句话只要一个「发动机」` | ❌ **「只需要」** |
| L73 | 2 | `说走路只要五分钟` | ❌ 「仅仅」 |
| **L35** | 1 | `但只要这句话被「我知道」包住` | ⚠️ **擦边**（让步义） |
| **L165** | 1 | `只要那件事是「你对我、我也对你」，就能用它。` | ⚠️ **擦边**（条件义，但藏在 deepDive） |

```bash
node -e '
const S=require("/tmp/glscan.js");
S.lessons.forEach(L=>{for(let i=L.start-1;i<L.end;i++){
  if(S.lines[i].includes("只要")) console.log("L"+L.number+" @"+(i+1)+": "+S.lines[i].trim().slice(0,110));}});
'
```

**⇒ 判定：「只要」这个中文锚基本上是干净的**，但有 **2 处擦边（L35／L165）需写课方在切分时点明**。**⚠️ 更重要**：**L172 已把 `不然` 用掉 21 处**（`不然` 全库 26 处：L172 占 21）⇒ **本课不能走「只要…不然…」，要走「只要…就…」**（否则与 L172 撞）。

### 3.3 负迁移三问（逐一给判定）

| 问 | 实测 | 判定 |
|---|---|---|
| **① 学生会不会说成 `only if`？** | `only` **GL 1**（L134 里的 `only`）、**`only if` GL 0** | ❌ **不成立**——**`only` 在库里只有 1 处、学生从未学过**，**不会用一个没学过的词来犯错** |
| **② 会不会说成 `as long`（漏一个 `as`）？** | `as long` **GL 0／HC 0** | ✅ **成立，且是本轴头号错**——库里**已有同型先例**：L65 `as…as` 的逐字规则是「**两个 as 一个都不能丢**」（`sed -n '12209p'` ＝ `oneLineRule: "说「一样」用 as…as 两头卡住（as tall as me）——两个 as 一个都不能丢。"`）。**L65 学生已在「两头卡」上被训练过 ⇒ 这是正迁移，写课应显式借力 L65** |
| **③ 会不会把 `will` 塞进前半句？** | Cambridge `As long as` 页逐字：`We always use the present simple to refer to the future after as long as` ＋ ❌ `Not: … as long as I will live.` | ✅ 成立，**与 L48／L172 的老规矩同源**（L48 逐字「if 里不用 will」／L172 逐字「unless 后面那小句用现在时——第 48 课的老规矩」）。**⚠️ 但 L48／L172 已各收过一笔 ⇒ 本课把这条降级为「借力复现」，不作主增量** |

### 3.4 切分：`as long as` 与 `if`／`unless` 的三方关系

| 说法 | 中文 | 口气 | 已教 |
|---|---|---|---|
| `if` | **如果** | 「假如」（中性，**不承诺**） | L48／L49 |
| `unless` | **除非** | 「例外」（从反面留口子） | L172（并发） |
| **`as long as`** | **只要** | 「**底线／承诺**」（你做到这条，我就一定） | **本课** |

**外部源逐字（Cambridge `As long as` 页）**：

> 「As long as or so long as also means **'provided that', 'providing that' or 'on condition that'**」／「So long as is a little more informal」
> 「We use as long as to refer to **the intended duration** of a plan or idea…」（**时长义，本批不教**）
> 关于将来：`We always use the present simple to refer to the future after as long as` ＋ ❌ `Not: … as long as I will live.`

**⇒ 判读：Cambridge 把 `as long as` 的义项挂在 `provided that`／`on condition that` 上，不与 `if` 同项。** 中文对位是「**只要**」（含承诺）而非「如果」（纯假设）。**⇒ 这是三格刻度，不是同义重复**（与批三十二 `had better` 撞 L47 `should` 性质不同：那对 Cambridge 逐字承认 `= you should`；**这对的中文锚是两个不同的词**）。

**⚠️ 必须诚实登记的减分项**：**能绕开**——学生说 `If you come, I will go.`（L48）**意思 90% 到位**，**只丢了「这是承诺／底线」那层口气**。**这是本轴排在第 2 顺位的唯一理由。**

### 3.5 轴 B 结论

| 项 | 判定 |
|---|---|
| 与 `if`／`unless` 的切分 | **三格刻度**：`if` 假如 ／ `unless` 除非（例外）／ `as long as` 只要（**底线／承诺**）；Cambridge 把义项挂在 `provided that`／`on condition that`，**不与 `if` 同项** |
| 中文「只要」入口 | **干净**（10 处里 8 处是「只需要」，2 处擦边 L35／L165）；**⚠️ 不能走「只要…不然…」**（`不然` 26 处 L172 占 21） |
| `only if` 负迁移 | ❌ **不成立**（`only` GL 1、学生从未学过） |
| `as long` 漏一个 `as` | ✅ **成立且是本轴头号错**（L65 `as…as` 已验证同一技能） |
| `will` 塞前半句 | ✅ 成立（Cambridge 逐字 ❌ `Not: … as long as I will live.`），**但降级为借力复现，不作主增量** |
| 能否撑 1 课？ | **能**——1 条规则 ＋ 3 条带标记新错 ＋ 3 条双正解 ＋ 三态，**全部零造词** |

---

## §4 轴 C 专项：复核 `several` 的「缓排」判定

**复核目标**：批三十二建议「`several` 缓排」，理由「句法与 `a few`／`some` 全同、只差刻度，且中文锚『好几个』已被 17 课占用」。**逐条复核如下。**

| 复核点 | 批三十二原判 | 本轮复核（185 课快照） | 变化 |
|---|---|---|---|
| **1. 句法与 `a few`／`some` 全同** | ✅ 成立 | ✅ **成立**——`several` GL 0／HC 0（真零，无假阳性）；而 `some` **195／16**、`many` **131／13**、`a few` **62／7**、`a lot of` **70／5** **四层同构**（都是「数量词 ＋ 复数」） | 无 |
| **2. 只差刻度** | ✅ 成立 | ✅ **成立**——词典义 `more than two but not very many`；**但刻度在中文里对不上**（见下） | 无 |
| **3. 中文锚「好几个」被 17 课占用** | ✅ 成立 | ⚠️ **升级为 20 课，且性质变了**（见下） | **⚠️ 加重** |
| **4.（本轮新增）`several` 有无词形／结构触发器** | — | ❌ **没有**——对照 L114（`a` 在不在）、L166（`many` vs `much`）、L162（`of` 拴后面），**都是可见的抓手；`several` 只是一个孤立刻度词** | **⚠️ 新增减分项** |
| **5. 增量条数** | 1 条（刻度） | ✅ **1 条，且「后面跟复数」这条已被付过三次**（L114 逐字「a few 后面跟着的是好几个东西，要加**尾巴**：a few 【apples】」／L166「能一个两个数出来的用 too many」／L167「数得出来的能用，数不出来的也能用」） | 无 |
| **总判定** | **缓排** | ❌ **建议升级为「不做」** | **⚠️ 升级** |

#### ⚠️ 复核点 3 的加重证据（本轮最重要的发现）：「好几个」已被正式定为「复数」的替代表达

**实测**：`好几个` **全库 67 处／20 课**，其中 **10 处是纯「多个」的意思（＝复数），不是「好几个」这个刻度**：

| 课的用法 | 逐字 | 意思 |
|---|---|---|
| L7 @1268 | `{ text: "are", role: "是（好几个的搭档）" }` | **＝复数** |
| L26 @4878／4879 | `好几个东西用 aren't。`／`好几个东西用 Are there。` | **＝复数** |
| L51 @9500／9511／9531 | `grammarLabel: "幕后句 · 好几个的搭档"`／`{ text: "were", role: "过去版 be（好几个的搭档）" }`／`句首那个「谁」 The windows 是一群（好几个）` | **＝复数** |
| L5／L11／L151／L152 | `dogs 表示好几个`／`一整类用好几个`／`第 11 课那句也是「好几个」（带上 s）`／`上一课那个 all 后面是好几个` | **＝复数** |

**⇒ 「好几个」在库里已经是「复数」的自建替代表达**——**批三十三的术语改写表逐字登记：`复数 → 好几个（东西）`**：

```bash
node -e '
const {readFileSync}=require("fs");
const T=readFileSync("deliverables/product-strategy/roadmap-grammar-thirty-third-batch-2026-09-21.md","utf8");
const i=T.indexOf("好几个（东西）");
console.log(T.slice(i-160,i+160));
'
# → 批三十三 §5.3 改写表逐字：| 复数 | **好几个（东西）** | 「复数用 aren't」→「**好几个东西**用 aren't」 |
```

**⇒ 这是本轮复核中最硬的一条**：**若 `several` 课写「『好几个』说 several」，会与 20 课的自建体系正面矛盾**——用户看到 `several` ＝ 好几个，又看到 `are` 的搭档叫「好几个」，**必然混乱**。**这不是「价值不够高」，而是「教了会让已教内容变乱」。**

**⇒ 处置建议：`several` 从「缓排」升级为「不做」，并从 B 档候选清单关闭。**

---

## §5 中文负迁移分析（为推荐轴给典型中式错句）

### 5.1 轴 A `so that` 的负迁移（推荐轴之一）

| # | 典型中式错句 | 干扰点（学生会这么想） | 正解 | 罪名 |
|---|---|---|---|---|
| 1 | `*I came early in order to you can rest.` | **中文「我早点来是为了让你能歇会儿」允许换人**，而 L173 的 `in order to` 只能是同一个人 | `I came early so that you can rest.` | `verb_form` |
| 2 | `*I came early so that can rest.` | **中文「是为了能歇会儿」可以省略「你」**——英语这半截必须有「谁」 | `I came early so that you can rest.` | `fragment` |
| 3 | `*I came early so that you can resting.` | **`can` 后面加 `-ing`**（L173 的 `catching` 毛病迁移） | `I came early so that you can rest.` | `verb_form` |
| 4 | `*I came early so that you can to rest.` | **`can` 后面垫 `to`**（L15 `want to` 的 `to` 迁移） | `I came early so that you can rest.` | `verb_form` |
| 5 | `*I came early because you can rest.` | **「因为」和「是为了」在中文口语里都能说**（「我早点来，因为你能歇会儿」） | `I came early so that you can rest.` | `tense`（口径问题） |
| 6 | `*I came early for you can rest.` | **中文「为了你」可以带人**（`for you`）——学生顺手用 `for` | `I came early so that you can rest.` | `preposition` |

**干扰点总述**：**这一轴的负迁移源头是「中文允许换人」**。学生学完 L173 后，**会把 `in order to` 当成「为了」的全能工具**，而中文「是为了让你…」正是它装不下的那一格。**本课的核心教学价值就在这里。**

### 5.2 轴 B `as long as` 的负迁移（推荐轴之二）

| # | 典型中式错句 | 干扰点（学生会这么想） | 正解 | 罪名 |
|---|---|---|---|---|
| 1 | `*I will go as long you come.` | **中文「只要」是一个词，学生漏掉第二个 `as`**（L65 `as…as` 同型毛病） | `I will go as long as you come.` | `fragment` |
| 2 | `*I will go as long as you will come.` | **中文没有「时态呼应」，学生按「将来的事用 will」推断** | `I will go as long as you come.` | `tense` |
| 3 | `*I will go as soon as you come.` | **`as soon as`（L142）与 `as long as` 共享 `as…as` 外形** ⇒ 学生混用 | `I will go as long as you come.` | — （形近混淆） |
| 4 | `*I will go as long as you don't come.` | **中文「只要你不来」的双重否定被省略**——学生不加 `don't` 就以为表达了否定条件 | `I will go as long as you come.` | `verb_form` |
| 5 | `*As long as you come, so I will go.` | **中文「只要…就…」是成对出现的**（L20 已教过 `because`／`so` 不成对） | `As long as you come, I will go.` | `run_on` |
| 6 | `*I will go if as long as you come.` | **`if` 和 `as long as` 中文都能说「如果／只要」，学生两个都要** | `I will go as long as you come.` | `run_on` |

**干扰点总述**：**这一轴的负迁移源头是「`as…as` 家族已有两个成员」**——`as tall as`（L65）与 `as soon as`（L142）。**学生把 `as long as` 当成第三个外形相似的块，会发生「形近混用」。** 写课时必须**显式点出三者外形相同、各管一件事**。

### 5.3 轴 C `several` 的负迁移（**不推荐，此处仅登记**）

| # | 典型中式错句 | 干扰点 |
|---|---|---|
| 1 | `*I read several book.` | 「好几个」后面忘加 `s`（与 L114 同型错，**已被教过**） |
| 2 | `*I read several of books.` | 与 L162 `most of` 的 `of` 混（`several` 不需要 `of`） |
| 3 | `*There are several much water.` | 「好几个」的中文可以修饰不可数（「好几瓶水」），学生直接套 |

**⇒ 这三条里，第 1 条是 L114 已付过的、第 2 条是 L162 已付过的、第 3 条虽然新但**不足以撑一课**（且它会与 L166 `too much`／`much` 的既有教学打架）。**

---

## §6 场景设计：场景锚与零件实测

### 6.1 场景 ID 合法性（红线）与用量分布

**合法场景 ID 共 14 个**（`src/components/AdventureScene.tsx` **行 6–19**：`campus`／`city`／`train`／`lighthouse`／`desert`／`space`／`ocean`／`island`／`mansion`／`forest`／`snow`／`magic`／`mystery`／`sparkle`）。

| 场景 | 用课数 | 判读 | 场景 | 用课数 | 判读 |
|---|---|---|---|---|---|
| `mansion` | **61** | 🔴 过载 | `magic` | **2** | ✅ 少（L12／L45） |
| `campus` | **56** | 🔴 过载 | `lighthouse` | **1** | ✅ 少（L160） |
| `city` | **37** | 🔴 过载 | `ocean` | **1** | ✅ 少（L159） |
| `sparkle` | 9 | 中 | **`desert`** | **0** | ✅✅ **完全未用** |
| `train`／`island` | 5／5 | 中 | **`space`** | **0** | ✅✅ **完全未用** |
| `mystery` | 4 | 少 | **非法 ID** | **0 处** | ✅ |
| `forest`／`snow` | **2／2** | ✅ 少（L10／L75；L88／L180） | | | |

```bash
node -e '
const S=require("/tmp/glscan.js");
const cnt={};
S.lessons.forEach(L=>{const seg=S.lines.slice(L.start-1,L.end).join("\n");
 const sc=(seg.match(/scene:\s*"([^"]*)"/)||[])[1]; cnt[sc]=(cnt[sc]||0)+1;});
const legal=["campus","city","train","lighthouse","desert","space","ocean","island","mansion","forest","snow","magic","mystery","sparkle"];
legal.forEach(s=>console.log(s.padEnd(11), cnt[s]||0));
console.log("非法 scene:", Object.keys(cnt).filter(k=>!legal.includes(k)).join(",")||"(0 处)");
'
```

### 6.2 零雨线纪律（红线）

**L109 专属叙事资产**：`rain`／`raining`／`rainy`／`stops`／`stopped`／`the movie`／`ends`／`ended`——**不碰**。**本轮实测确认这条纪律的必要性**（分布高度集中在 L109 及其邻课）：

| 词 | GL | 主场 | 词 | GL | 主场 |
|---|---|---|---|---|---|
| `stopped` | **45** | **L109: 40** | `end`／`ends`／`ended` | 1／1／**6** | **全在 L109** |
| `stops` | **9** | **L109: 8** | `movie` | **49** | L29: 30／L109: 5 |
| `raining` | **257** | L101: 18／L102: 19／**L139–141 各 46–50**（过度集中，避免） | `rains` | **160** | **L48: 55／L49: 43／L172: 46** |

**⇒ 本批两课的场景设计：不出现 `rain` 家族、不出现 `movie`／`stop`／`end` 系列。** ✅

### 6.3 两课的场景锚与零件实测

| 项 | **L186（轴 A）** | **L187（轴 B）** |
|---|---|---|
| **`scene`** | **`desert`**（**0 课，完全未用** ✅ 合法 ID） | **`forest`**（**仅 2 课：L10／L75** ✅ 合法 ID） |
| **场景叙事** | **沙漠营地出发前**：天还没亮，小美先起来收行囊，为了让同伴多睡一会儿／赶上日头出来前那段凉快时辰 | **迷雾森林入口**：同伴在木牌前犹豫，小美把背包带一收，给出条件——跟着我，咱们就进去 |
| **为什么选它** | ① **0 课占用**，全新场景位；② 场景中文标签 ＝**「沙漠古城」**，与「早起赶路、避开日头」契合；③ **避开 `city`／`campus`／`mansion` 三个过载区** | ① **仅 2 课占用且都是「公园」泛用**（L10／L75 的 `sceneSetupZh` 均无森林叙事），**不撞**；② 标签 ＝**「迷雾森林」**，与「进森林前约定条件」契合；③ 同样避开三个过载区 |
| **目标句（≤8 词）** | `I came early so that you can rest.`（**8 词** ✅） | `I will go as long as you come.`（**8 词** ✅） |
| **逐词核对** | `I(1) came(2) early(3) so(4) that(5) you(6) can(7) rest(8)` ✅ | `I(1) will(2) go(3) as(4) long(5) as(6) you(7) come(8)` ✅ |
| **造词成本** | **0** | **0** |

**零件逐词实测（词边界口径；省略全库高频、任何课可直接取用的 `I` 5194／`you` 1590／`go` 860／`to` 3121／`the` 2754）**：

| L186 零件 | GL | HC | 归因 | L187 零件 | GL | HC | 归因 |
|---|---|---|---|---|---|---|---|
| **`came`** | **13** | 3 | **L155**（`He came two days ago.`）正式立岗；L107／L110 作错句标记 | `will` | **706** | 60 | **L12(71)／L48(67)／L172(61)** |
| `early` | **333** | 19 | L173(39)／L120(42)／L107(48)／L16(11) | `as` | **432** | 53 | **L65**（`as tall as`）／**L142**（`as soon as`） |
| `so` | **159** | 30 | **L20(58，`so` 所以义）** | `long` | **43** | 2 | **L73(38，`How long does it take?`)** |
| `that` | **162** | 9 | L35／L36（话中话） | `as`（第二次） | 432 | 53 | 同 L65 |
| `can` | **431** | 24 | **L14(72，`能 · can`)** | `come` | **233** | 13 | **L38(56)／L107(46)** |
| `rest` | **70** | 7 | **L168(44，`take a rest`)／L47／L49** | — | — | — | — |

**⚠️ 唯一需要写课方留意的是 L186 的 `came`**：**它只在 L155 作为「目标句动词」正式立岗**，在 L107（`had me came early.` ❌）／L110 是当**错句标记**出现的。**⇒ 本课用 `I came early` 是借 L155 的既教动词（合规），但写课方应在 `deepDive` 里点一句「came 是 come 的昨天版（第 155 课）」，以免学生误以为新词。**

**查重实测（连续子序列口径，GL／HC 双文件全为 0）**：

| L186 候选句 | GL | HC | L187 候选句 | GL | HC |
|---|---|---|---|---|---|
| `I came early so that you can rest.`（目标句） | **0** | **0** | `I will go as long as you come.`（目标句） | **0** | **0** |
| `She came early so that we can rest.` | **0** | **0** | `You can go as long as you finish.` | **0** | **0** |
| `I came early so that you don't wait.`（否定） | **0** | **0** | `Can I go as long as I finish?`（疑问） | **0** | **0** |
| `Why did you come so early?`（疑问） | **0** | **0** | `You can't go as long as you don't finish.`（否定） | **0** | **0** |
| `I turned on the light so that you can see.` | **0** | **0** | `I will go as long as you will come.`（错句） | **0** | **0** |
| `I came early so that can rest.`（错句） | **0** | **0** | `I will go as long you come.`（错句） | **0** | **0** |
| `I came early in order to you can rest.`（错句） | **0** | **0** | `As long as you come, so I will go.`（错句） | **0** | **0** |

### 6.4 造词成本汇总（**「若必须造词」的成本说明**）

| 轴 | 目标句全部零件 | 造词数 | 若必须造词 |
|---|---|---|---|
| **A `so that`** | `I`／`came`／`early`／`so`／`that`／`you`／`can`／`rest` **全在库** | **0** | 无需造词 |
| **B `as long as`** | `I`／`will`／`go`／`as`／`long`／`as`／`you`／`come` **全在库** | **0** | 无需造词 |
| **C `several`**（不推荐） | `several` **真零、无同根词可借** | **1** | 成本含：① 词表入库；② 发音／跟读素材；③「练习答案每个词都要在本课（含此前累计）教过」的守门断言会多一个词。**对照 A／B 的成本 0，这是本轴的额外减分项。** |

**⚠️ 特别说明 `so that` 的造词问题**：**`so` 与 `that` 两个词都已在库**——`so` GL 159（L20 教了「所以」义）、`that` GL 162（L35／L36 教了「话中话」义）。**本课不是造词，是给两个熟词一个新组合**——**这正是「一课一增量」的理想形态。**

---

## §7 逐课规格（推荐 2 课）

### 7.1 L186（轴 A）· `so that`

| 字段 | 值 |
|---|---|
| **课注 id** | `lesson-186-so-that` |
| **number** | **186**（实测下一可用课号） |
| **title** | `早点来是为了让你歇会儿` |
| **grammarLabel** | `是为了 · so that` |
| **目标句** | `I came early so that you can rest.`（**8 词** ✅ 零造词 ✅） |
| **intentZh** | `我早点来，是为了让你能歇会儿。` |
| **scene** | **`desert`**（**0 课，完全未用** ✅ 合法 ID） |
| **sceneSetupZh** | `天还没亮，沙漠营地只有风声。小美已经收好了行囊，同伴还在睡——她轻手轻脚把水壶摆好，等日头出来前那段凉快时辰。` |
| **episode** | `小美的一天 一百八十六` |

**一句话规则（`oneLineRule`，零术语）**：

> `说「是为了让谁做什么」用 so that——I came early so that you can rest（我早点来，是为了让你能歇会儿）。它和第 173 课那个 in order to 分工很清楚：in order to 后面跟「做什么」（都是同一个人），so that 后面跟「谁 + 能做什么」（可以是另一个人）。`

```js
blocks: [
  { text: "I came early", role: "我早点来（做的事）" },
  { text: "so that you can rest", role: "是为了让你能歇会儿（为的是谁、能做什么）" }
]
```

**`contrast` 6 条（3 带标记 ＋ 3 双正解）**：

| # | `wrong` | `wrongMark` | `correct` | `whyZh` 方向 |
|---|---|---|---|---|
| 1 | `I came early in order to you can rest.` | **`in order to you`** | 目标句 | **换人要换说法**：第 173 课那个 in order to 后面只跟「做什么」，前后是同一个人；要换成另一个人，得改用 so that——so that 【you can rest】。 |
| 2 | `I came early so that can rest.` | **`that`** | 目标句 | **后半截不能少「谁」**：中文「是为了能歇会儿」可以不说「你」，英语这半截得把「谁」带上——so that 【you】 can rest。 |
| 3 | `I came early so that you can resting.` | **`resting`** | 目标句 | **can 后面穿原样**：so that you can 【rest】。第 14 课的老规矩（can 后面一点不变）。 |
| 4 | `I got up early in order to catch the bus.` | `null` ＋ `bothRight` | 目标句 | **两句都对**——第 173 课那句前后是同一个人（我早起、我赶车），用 in order to 正合适；今天多了一格：后一件事是**别人**做的，就用 so that。 |
| 5 | `I was hungry, so I ate noodles.` | `null` ＋ `bothRight` | 目标句 | **两句都对**——第 20 课那个 so 说的是「所以」（结果已经发生）；今天这个 so that 说的是「是为了」（目的，还没发生）。看后面跟的是「结果」还是「目的」。 |
| 6 | `It was cold, so I stayed at home.` | `null` ＋ `bothRight` | 目标句 | **两句都对**——第 20 课那句是「因为冷，所以我待在家」；今天这句说目的。一个说原因结果，一个说目的。 |

**⚠️ 第 4／5／6 条的选句理由**：**第 4 条是 L173 复现**（把切分讲透）、**第 5／6 条是 L20 复现**（把 `so` 的两张脸切开）——**三条双正解直接承载本课最重要的两个切分，不是凑数陪衬。**

**`variants` 三态**：

| label | en | zh | noteZh |
|---|---|---|---|
| **肯定** | `I came early so that you can rest.` | 我早点来，是为了让你能歇会儿。 | `so that 后面带「谁 + 能做什么」。` |
| **否定** | `I came early so that you don't wait.` | 我早点来，是为了让你不用等。 | `后面那半截的「不」跟着 do 走：don't wait。` |
| **疑问** | `Why did you come so early?` | 你为什么来这么早？ | `问「为什么」用 Why + did，来的目的就接在后面。` |

**`sceneSwings` 场景变奏（3 条）**：

| sceneZh | en | zh |
|---|---|---|
| 说早点来是为了让对方歇会儿 | `I came early so that you can rest.` | 我早点来，是为了让你能歇会儿。 |
| 说把灯开了是为了让对方看得见 | `I turned on the light so that you can see.` | 我把灯开了，是为了让你看得见。 |
| 说去商店是为了买牛奶（第 44 课） | `I go to the shop to buy milk.` | 我去商店买牛奶。 |

**复现取材建议（5 句，复现课数全部远低于 6 课红线 ✅）**：

| 复现哪课 | 句子 | 理由 | `practice` 口径复现课数 |
|---|---|---|---|
| **L173**（`in order to`） | `I got up early in order to catch the bus.` | **头号切分对象**——前后同一个人用 L173，换人用今天 | **1 课** |
| **L20**（`because`／`so`） | `I was hungry, so I ate noodles.` | 把 `so` 的「所以」义与今天「是为了」义切开 | 0 课（全库仅 1 处，非练习答案） |
| **L44**（`to` 小垫板） | `I go to the shop to buy milk.` | L173 的 deepDive 已把 L44 当上游，本课延续这条链 | **4 课** |
| **L14**（`can`） | `I can swim.` | `so that you can rest` 里的 `can` 是 L14 的零件，**显式借力** | **3 课**（L14／L47／L174） |
| **L155**（`came`） | `He came two days ago.` | `came` 是 L155 正式立岗的动词，**应显式复现以免学生当新词** | **1 课** |

**案件设计建议（`huntCaseIds`）**：

- **案 id**：`hunt-so-that-desert` ｜ **案号**：**195**（实测当前 194 案、1–194 连续无缺号、无重号 ⇒ **下一可用案号 = 195** ✅）
- **title**：`天亮前的营地` ｜ **scene**：`沙丘边上一只翻倒的水壶`
- **植入 2 处**（红线：每案 2–4 处）：

| # | 原句片段 | `tokenIndex` 指向 | `tag` | `original` → `correction` | `explanation` |
|---|---|---|---|---|---|
| 1 | `I came early in order to you can rest.` | `in order to you`（多词标记，按既有 48 条例以块为单位） | `verb_form` | `in order to you` → `so that you` | 「后一件事是别人做的，就不再用 in order to——改说 so that you can rest。第 173 课那个 in order to 只跟同一个人做的事。」 |
| 2 | `She turned on the light so that we can see.` | 句尾句号 | `fragment` | `see` → `see.` | 「句尾少了句号——一个句子说完要有个收尾的记号。」 |

### 7.2 L187（轴 B）· `as long as`

| 字段 | 值 |
|---|---|
| **课注 id** | `lesson-187-as-long-as` |
| **number** | **187** |
| **title** | `只要你跟着我` |
| **grammarLabel** | `只要 · as long as` |
| **目标句** | `I will go as long as you come.`（**8 词** ✅ 零造词 ✅） |
| **intentZh** | `只要你来，我就去。` |
| **scene** | **`forest`**（**仅 2 课：L10／L75，且都是「公园」泛用，不撞** ✅ 合法 ID） |
| **sceneSetupZh** | `雾还没散，森林入口的木牌上挂着水珠。同伴在边上犹豫，小美把背包带往肩上一收——她给了个条件：跟着我，咱们就进去。` |
| **episode** | `小美的一天 一百八十七` |

**一句话规则（`oneLineRule`，零术语）**：

> `说「只要」用 as long as——I will go as long as you come（只要你来，我就去）。它和第 65 课那个 as tall as 是一个家族：两个 as 一个都不能少。前面那半句说「在什么前提下」，用现在时说将来的事（第 48 课的老规矩）。`

```js
blocks: [
  { text: "I will go", role: "我就去（我这边的话）" },
  { text: "as long as you come", role: "只要你来（前提）" }
]
```

**`contrast` 6 条（3 带标记 ＋ 3 双正解）**：

| # | `wrong` | `wrongMark` | `correct` | `whyZh` 方向 |
|---|---|---|---|---|
| 1 | `I will go as long you come.` | **`long`** | 目标句 | **两个 as 一个都不能少**：as 【long as】——第 65 课 as tall as 的老规矩，两头各卡一个 as，少一头就散架。 |
| 2 | `I will go as long as you will come.` | **`will come`** | 目标句 | **前提那半句说现在**：as long as you 【come】。第 48 课的老规矩——if 和 unless 都守这条，as long as 也一样。 |
| 3 | `As long as you come, so I will go.` | **`so`** | `As long as you come, I will go.` | **「只要…就…」不配成对**：前提说完，后面直接说结果——第 20 课说过 because 和 so 只能来一个，这里也一样。 |
| 4 | `If it rains, I will stay at home.` | `null` ＋ `bothRight` | 目标句 | **两句都对**——第 48 课那句说「如果」（假如而已）；今天说「只要」（你做到这条，我就一定）——一个不承诺，一个下承诺。 |
| 5 | `We will go unless it rains.` | `null` ＋ `bothRight` | 目标句 | **两句都对**——第 172 课那句从「例外」说（除非下雨就不去）；今天从「前提」说（只要你来就去）。一个留退路，一个给底线。 |
| 6 | `He is as tall as me.` | `null` ＋ `bothRight` | 目标句 | **两句都对**——第 65 课那句是「一样」（两头卡住比高低）；今天这两头中间换了个 long，说的是「只要」——外形一样，各管一件事。 |

**⚠️ 第 4／5／6 条的选句理由**：**第 4 条切 `if`（L48）／第 5 条切 `unless`（L172）／第 6 条切 `as…as`（L65）**——正好是本轴三个必需的切分点，且都是「双正解」形态（不贬低已学内容）。

**`variants` 三态**：

| label | en | zh | noteZh |
|---|---|---|---|
| **肯定** | `I will go as long as you come.` | 只要你来，我就去。 | `两个 as 各卡一头。` |
| **否定** | `You can't go as long as you don't finish.` | 只要你没写完，就不能去。 | `两半句的「不」各自跟着自己的 do 走。` |
| **疑问** | `Can I go as long as I finish?` | 只要我写完，就能去吗？ | `Can 搬句首，as long as 那半句不动。` |

**`sceneSwings` 场景变奏（3 条）**：

| sceneZh | en | zh |
|---|---|---|
| 说只要对方来就去 | `I will go as long as you come.` | 只要你来，我就去。 |
| 说只要写完就能去 | `You can go as long as you finish.` | 只要你写完，就能去。 |
| 说和对方一样高（第 65 课） | `He is as tall as me.` | 他和我一样高。 |

**复现取材建议（5 句，复现课数全部远低于 6 课红线 ✅）**：

| 复现哪课 | 句子 | 理由 | 复现课数 |
|---|---|---|---|
| **L65**（`as…as`） | `He is as tall as me.` | **同族外形**——「两个 as 一个都不能少」这条技能直接借用 | **1 课** |
| **L48**（`if`） | `If it rains, I will stay at home.` | 老规矩「前提那半句说现在」 | **3 课**（L48／L49／L172） |
| **L172**（`unless`） | `We will go unless it rains.` | 三方刻度的第三格（例外 vs 前提） | **1 课** |
| **L142**（`as soon as`） | `As soon as I finish, I will eat.` | **形近易混**——显式点出外形相同、各管一件事 | **3 课**（L142／L143／L144） |
| **L73**（`How long...`） | `How long does it take?` | `long` 是 L73 的主场，**显式借力以免学生以为 long 只是「长」** | **1 课** |

**案件设计建议（`huntCaseIds`）**：

- **案 id**：`hunt-as-long-as-forest` ｜ **案号**：**196** ｜ **title**：`雾里的木牌` ｜ **scene**：`木牌上挂着一串水珠`
- **植入 2 处**：

| # | 原句 | `tokenIndex` 指向 | `tag` | `original` → `correction` | `explanation` |
|---|---|---|---|---|---|
| 1 | `I will go as long you come.` | `long` | `fragment` | `long` → `long as` | 「两个 as 各卡一头，少一头就散架——as long as you come。第 65 课 as tall as 也是这个规矩。」 |
| 2 | `I will go as long as you will come.` | `will come` | `tense` | `will come` → `come` | 「前提那半句说明天的事，用现在时——as long as you come。第 48 课的老规矩。」 |

### 7.3 两课的季分组（**必做随批上线项，否则课程被静默过滤**）

**⚠️ 硬护栏（`grammarSeasons.ts` 文件头逐字）**：

> 「**课程号不落在任何区间内会被路径页静默过滤（整课不显示、无报错）**。新增课程批次时必须同步追加 season-N 分组，并有 `grammarSeasons.test.ts` 守门。」

**实测当前最大季区间 = season-28（182–185）⇒ L186／L187 落在所有区间之外，必须处理。**

**⚠️ 但有一个测试约束必须先算清**：`grammarSeasons.test.ts`「**季体量不得过小**」断言——**≤3 课的小季上限 3 个**，而**实测当前正好是 3 个**（season-6 ＝ 47–49／season-12 ＝ 76–78／season-19 ＝ 125–127）。

```bash
node -e '
const {readFileSync}=require("fs");
const T=readFileSync("src/data/grammarSeasons.ts","utf8");
const arr=[...T.matchAll(/\{\s*id:\s*"(season-\d+)",\s*label:\s*"([^"]*)",[\s\S]*?min:\s*(\d+),\s*max:\s*(\d+)\s*\}/g)];
const tiny=arr.filter(m=>(+m[4]-+m[3]+1)<=3);
console.log("季数",arr.length,"| ≤3 课小季",tiny.length,"（测试上限 3）");
tiny.forEach(t=>console.log("  ",t[2],t[3]+"-"+t[4]));
'
# → 季数 28 | ≤3 课小季 3 （测试上限 3）→ 第六季 47-49 / 第十二季 76-78 / 第十九季 125-127
```

**⇒ 可行方案只有两种，禁止「新建一个 2 课小季」（会让 tiny 变 4 个、测试直接变红）**：

| 方案 | 做法 | `tiny` 变化 | 评价 |
|---|---|---|---|
| **① 推荐：扩 `season-28` 到 182–187** | 只改 `max: 185 → 187`，`label` 前缀「第二十八季」**不动** | 3 → **3** ✅ | ✅ **最简、零测试风险**；附带把 `hint` 里「这一季排一行」的措辞改成也涵盖两个新知课 |
| ② 新建 `season-29`（6 课） | 本批先落 186–187，后续 4 课填满 | 3 → **4** ❌ | ❌ 只覆盖 186–187 会变红；覆盖 6 课需后 4 课有排期 |

**⇒ 推荐方案的落地改动（逐字可抄）**：

```js
// 改前
{ id: "season-28", label: "第二十八季 · 这一季排一行（收口）", hint: "把整季的句型排一行：六件事、身边的事、日常六句、五对八句——学完回头看一眼", min: 182, max: 185 }
// 改后（只动 hint 与 max，label 前缀保持「第二十八季」以不破坏「季名序号连贯」断言）
{ id: "season-28", label: "第二十八季 · 排一行与新的两格", hint: "把整季的句型排一行：六件事、身边的事、日常六句、五对八句；再补上「是为了让谁做什么」和「只要」两格——学完回头看一眼，再往前迈两步", min: 182, max: 187 }
```

**⇒ ① `tiny` 保持 3 ✅；② L186／L187 不再被静默过滤 ✅；③ 季名序号链不断（不动 `第N季` 前缀）✅。**

---

## §8 与已教内容的切分（明确说明与哪一课最接近、怎么切开）

### 8.1 L186（`so that`）vs 已教内容

| 最接近的课 | 逐字标签／目标句 | 怎么切开 |
|---|---|---|
| **L173 `in order to`**（行 33983–34230）｜**最接近** | `grammarLabel: "为了 · in order to"` ／ `I got up early in order to catch the bus.` | **切分口径 = 「换不换人」**：L173 的 `in order to` 后面**只能是动作**，前后**必须同一个人**（我早起 → 我赶车）；本课 `so that` 后面是**「谁 + 能做什么」**，**可以是另一个人**（我早来 → **你**歇会儿）。**Cambridge 逐字佐证**：`in order to` 是 `with an infinitive form of a verb`；`so that` 的官方例句 `We left a message with his neighbour so that he would know we'd called.` **从 we 换成了 he**。 |
| **L20 `because`／`so`** | `grammarLabel: "连词 · because / so"` ／ `I was late because the bus was late.` ／ `oneLineRule: "说「因为」用 because 接原因，说「所以」用 so 接结果——英语只用其中一个，不成对出现。"` | **切分口径 = 「so 的两张脸」**：L20 的 `so` 是**「所以」**（`so` 后面跟**结果**，事已发生）；本课的 `so that` 是**「是为了」**（后面跟**目的**，事还没发生）。**对照：`It was cold, so I stayed at home.`（结果，L20）vs `I came early so that you can rest.`（目的，本课）。** |
| **L44 `to` 小垫板** | `I go to the shop to buy milk.` | **切分口径 = 「三个说法一条链」**：L44（`to` 去做什么）→ L173（`in order to` 为了做什么，更正式）→ **L186（`so that` 为了谁做什么）**。**三者是同一条链上的三级，各有各的位子。** |
| **L14 `can`** | `grammarLabel: "能 · can"` ／ `I can swim.` | **本课后半截 `can` 是 L14 的零件**——L14 教 `can` 独立表能力，本课把 `can` 装进 `so that` 的后半截（`so that you can rest`）。**不是新教 `can`，是新教「can 能站在 so that 后面」。** |

### 8.2 L187（`as long as`）vs 已教内容

| 最接近的课 | 逐字标签／目标句 | 怎么切开 |
|---|---|---|
| **L48 `if`** | `grammarLabel: "条件句 · if 里说现在"` ／ `If it rains, I will stay at home.` ／ `oneLineRule: "…if 里不用 will，「如果的路面用现在时铺」。"` | **切分口径 = 「承诺 vs 假如」**：`if` 是**中性假设**（不承诺任何事）；`as long as` 是**底线／承诺**（你做到这条，我就一定）。**Cambridge 逐字佐证**：`as long as` 的义项挂在 `'provided that', 'providing that' or 'on condition that'`，**不与 `if` 同项**。 |
| **L172 `unless`**（并发方） | `grammarLabel: "除非 · unless"` ／ `We will go unless it rains.` ／ `oneLineRule: "…它和第 48 课那个 if 正好反着…"` | **切分口径 = 「三格刻度」**：`if`（假如）／`unless`（除非，从**例外**说）／`as long as`（只要，从**前提**说）。**L172 已经建立了「同一件事从两面说」的教学框架，本课是第三面。** |
| **L65 `as…as`** | `grammarLabel: "一样 · as tall as"` ／ `He is as tall as me.` ／ `oneLineRule: "说「一样」用 as…as 两头卡住（as tall as me）——两个 as 一个都不能丢。"` | **切分口径 = 「同族外形、各管一件事」**：两者外形完全一样（`as + 词 + as`），`as tall as` 比高低，`as long as` 说条件。**L65 的「两个 as 一个都不能丢」这条技能完全复用。** |
| **L142／L143 `as soon as`** | `grammarLabel: "一到就做 · as soon as + 小句子"` ／ `As soon as I finish, I will eat.` | **切分口径 = 「形近易混，必须显式点出」**：`as soon as`（一到就）／`as long as`（只要）**外形同族、意思无关**。**这是本课最需要主动防守的混淆点**（§5.2 负迁移第 3 条）。 |

### 8.3 不推荐的轴 C（`several`）vs 已教内容（**为什么切不开**）

| 已教的课 | 逐字 | 为什么切不开 |
|---|---|---|
| **L114 `a few`／`few`** | `grammarLabel: "还有几个 vs 几乎没了 · a 在不在，意思反一半"` ／ `oneLineRule: "「还有几个」说 a few（a 在，够）；「几乎没了」说 few（a 不在，不够）"` | **L114 的立岗点正是「几个」这个刻度**——`several`＝「两个以上、不太多」，**与 `a few` 的刻度区间重叠且无法用一句话划清**（英语母语者对 `a few` vs `several` 的界线本身就不固定）。**若硬切，只能说「a few 更少、several 更多」——这是一条模糊的相对判断，零基础学习者拿不到抓手。** |
| **L30 `some`／`many`** | `grammarLabel: "数量词 · some / any / much / many"` ／ `oneLineRule: "「一些」：好好说的时候用 some…数得清的用 many，数不清的用 much。"` | **`some` 已经覆盖「一些」这个不定量**——`several` 的语义区间落在 `some` 内部。**切不开。** |
| **L167 `a lot of`** | `grammarLabel: "很多 · a lot of"` ／ `oneLineRule: "说「很多」用 a lot of…它比 many 更随口：数得出来的（朋友、书）能用，数不出来的（水、时间）也能用，一个就够。"` | **L167 已经明确宣称「一个就够」**——**若再教 `several`，与 L167 的「一个就够」正面矛盾**。**切不开，且会削弱 L167。** |
| **L166 `too many`／`too much`** | `grammarLabel: "太多 · too many / too much"` ／ `oneLineRule: "…能一个两个数出来的（人、书、苹果）用 too many；数不出来的（水、牛奶、时间）用 too much。"` | **L166 已把「可数 vs 不可数」这条判断收走**——`several` 的「后面跟复数」这条增量**已被 L166 覆盖**。**切不开。** |
| **批三十三的自建术语体系** | `复数 → 好几个（东西）`（`roadmap-grammar-thirty-third-batch-2026-09-21.md` §5.3 改写表逐字） | **这是最硬的一条**：**「好几个」已被正式定为我方「复数」的替代表达**。**若 `several` 课写「『好几个』说 several」，会与 20 课的自建体系矛盾。** **不是切不开，是不能切。** |

---

## §9 未核实项（诚实登记）

| # | 项 | 影响 | 说明 |
|---|---|---|---|
| 1 | **`so that` vs `in order to` 的「同一个人／换人」规则，本轮未能取到一句话的权威原文** | **中** | Cambridge 的 `So that or in order that?` 页与 `In order to` 页**都没有明说这条规则**（我逐字核对过两页，两页互相只有 `See also` 链接）。**但方向是确定的**：`in order to` 页逐字 `with an infinitive form of a verb`（后面只能跟动作）＋ 三个例句**前后全是同一个人**；`so that` 页的三个例句**两个换了人**（`we → he`、`I → you`）。**⇒ 我的判定是从「后接成分类型」＋「官方例句里人的分布」推出来的，不是从一句显式规则读出来的。** 写课方若要把这条写成硬规则，**建议再取一份带显式表述的来源**（Murphy 中级 U115 是本批上游点名的来源，但它本轮不可达——见本表第 2 项）。 |
| 2 | **Murphy 中级 U115（`as long as` 三词共用）本轮仍未复核** | 低 | 沿批三十一普查与批三十二的登记（`b-tier-frontier-survey-2026-09-20.md` §6 项 2）。**本轮我改用 Cambridge `As long as` 页独立取到了义项划分**（`provided that`／`on condition that`），**判定不依赖 Murphy**。 |
| 3 | **Cambridge 的 `As long as` 页没有直接对比 `if`／`unless`** | 低 | 逐字核实过：该页只列 `provided that`／`providing that`／`on condition that` 三个同义说法，**没有一句与 `if`／`unless` 的直接对照**。§3.4 的「三格刻度」是我基于**中文锚**（如果／除非／只要）＋ **Cambridge 义项归属**做的判定。 |
| 4 | **`as long as` 的「时长义」（`as long as I live`）本轮未纳入设计** | 低 | Cambridge 逐字：「We use as long as to refer to **the intended duration** of a plan or idea, most commonly referring to the future.」**这是一条独立义项，本批不教**（一课一增量）。**⚠️ 但写课方须注意：不要在同课引入 `as long as I live` 这类时长句，否则一课两增量。** |
| 5 | **本轮快照可能不是最终态（并发生产的风险）** | **中** | 批三十二与批三十三都记录过「实读期间文件被并发进程改大」。**本轮实读期间 `grammarLessons.ts` 稳定在 37,149 行、`huntCases.ts` 稳定在 10,163 行**（开工与收尾两次测量一致）——**但若本报告交付后有并发方继续新增课程，§1 的课号边界与 §7 的课号建议须重算**。**建议写课方落笔前重跑 §0.1 的课号边界脚本。** |
| 6 | **`several` 的「不做」判定，依赖批三十三的「复数 → 好几个」改写表** | 低 | 我逐字引用了 `roadmap-grammar-thirty-third-batch-2026-09-21.md` §5.3 的改写表。**若产品负责人决定推翻那条改写（把「好几个」恢复成「复数」），`several` 的中文锚冲突会解除**——但那时要重新评估的是**术语红线**本身，不是 `several`。 |
| 7 | **L186／L187 的 `practice` 第 5 题设计未在本报告给全** | 低 | §7 给了 `contrast`／`variants`／`sceneSwings`／复现取材／案件设计，**未逐题给 `practice`（红线要求 ≥4 题、含一道否定或疑问变体、C 层新句 Jaccard < 0.8）**。**这些是写课方按现有守门测试现场构造的**，我在 §7 已给出足够的候选句（全部查重为 0）。 |
| 8 | **`desert`／`forest` 的插画资源本轮未核** | 低 | `AdventureScene.tsx` 里 14 个场景**都有实现**（实测每个场景 ID 在文件里各出现 2 次：类型定义 ＋ 数组），**⇒ `desert`／`forest` 有插画实现** ✅。**但课程卡封面（`cover`）走的是另一套资源**——实测 **117 个 cover 全部已用、无闲置**（`cover1`–`cover117`，其中 `cover45`–`cover51` 各用 3 次、`cover1`–`cover44` 各 2 次、`cover52`–`cover117` 各 1 次）。**⇒ L186／L187 需新封面资源，或沿用三次复用的先例（`cover45`–`cover51` 已各用 3 次）。** |

```bash
# 未核实项 8 的复跑命令
node -e '
const S=require("/tmp/glscan.js");
const used=new Set();
S.lessons.forEach(L=>{const seg=S.lines.slice(L.start-1,L.end).join("\n");
 const m=seg.match(/cover:\s*(cover\d+)/); if(m) used.add(+m[1].replace("cover",""));});
const {readFileSync}=require("fs");
const GL=readFileSync("src/data/grammarLessons.ts","utf8");
const imps=[...GL.matchAll(/import cover(\d+) from/g)].map(m=>+m[1]);
console.log("cover 导入",imps.length,"| 已被使用",used.size,"| 闲置",imps.filter(i=>!used.has(i)).length);
'
# → cover 导入 117 | 已被使用 117 | 闲置 0
```

---

## §10 本批净产出与给写课方的一句话

### 10.1 净产出

| 轴 | 判定 | 课量 | 课号 |
|---|---|---|---|
| **A `so that`** | ✅ **做**（第 1 顺位） | **1 课** | **L186** |
| **B `as long as`** | ✅ **做**（第 2 顺位） | **1 课** | **L187** |
| **C `several`** | ❌ **不做**（缓排升级为不做） | **0 课** | — |

**⇒ 本批建议取 2 课：L186 ＋ L187。**

### 10.2 三条必须随批上线的项（缺一即出问题）

| # | 项 | 不做的后果 |
|---|---|---|
| **1** | **`grammarSeasons.ts` 的区间必须覆盖 L186／L187** | **路径页静默过滤，整课不显示、无报错**（该文件逐字警告） |
| **2** | **`tiny` 小季数不能被推到 4** | `grammarSeasons.test.ts`「季体量不得过小」变红（当前正好 3，**上限 3**）⇒ **不要新建 2 课的小季**，按 §7.3 方案改 `season-28` 的 `max` |
| **3** | **案号 195／196、案 id 唯一、`reviewed: true`** | 当前 194 案编号连续无缺号；新增案未被课程引用须先校验并标 `reviewed` |

### 10.3 给写课方的一句话

> **本批两条轴的价值都不在「教一个新词」，而在「把已有的两个说法切开」**：
> **L186 切 `in order to`（L173）**——中文「是为了**让你**…」允许换人，而 L173 装不下；
> **L187 切 `as…as` 家族（L65／L142）＋ `if`／`unless`（L48／L172）**——`as long as` 与它们外形同族、中文却各是一个词。
> **两课的目标句都恰好 8 词、零件全部在库、造词成本为 0。**

---

> 本报告由产品战略团队 AI 协作生成（研究员：瑞思），重要决策请由产品负责人审定。
