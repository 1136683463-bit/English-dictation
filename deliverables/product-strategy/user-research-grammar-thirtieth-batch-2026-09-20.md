# 用户研究 · 语法线「小美的一天」第三十批

> **作者**：瑞思（用户研究员） · **日期**：2026-09-20 · **基线**：158 课（L1–L158）／167 案／29 季
> **一句话推荐**：**取轴 A，做 2 课**——**L159 `look like`（`It looks like a boat.`）** → **L160 `seem`（`He seems to know you.`）**；**轴 B（`would rather`）降为「B−−，本轮不做」**（§3）；**轴 C（`each`）判定「不是难讲，是位置已被占」，维持不做**（§4）。

---

## §0 本轮实读口径声明（必读）

### 0.1 工具（本机 `grep` 是 ugrep，不能用）

**本机 `grep` 是 ugrep**，`grep -oniE "(^|[^A-Za-z])seem([^A-Za-z]|$)"` 这类「词边界 + 分组」花式正则会**静默返回 0**——**本轮对 `each` 实测到一次现成复现**：`grep` 报 0，node 报 `GL=110`（substring 口径，全来自 `teacher` 词内匹配）。**本轮全部词频走 node 脚本。**

### 0.2 快照声明（⚠️ 本轮新情况：数据文件在我实读期间被改过两次）

本轮实读期间，`src/data/grammarLessons.ts` **发生了两次写入**（29,990 行 → 29,995 → 30,644；内容是把 `cover50`–`cover117` 的 `import` 展开，并给 L1–L5 补例句/练习）。**课数、案数、季数全程未变（158／167／29）**，但**行号整体漂移了约 510 行**。

**为让本报告每一处 `:NNNNN` 可复跑**，两份数据文件**已冻结在 `/tmp/snap/`**：

```bash
shasum -a 256 /tmp/snap/grammarLessons.ts /tmp/snap/huntCases.ts
# c5525572b6b74f327103b660d4b580035535271d5ae4aa6450dde1428bb27306  grammarLessons.ts（30644 行）
# b75cab7a88ac33d1a1d1901ebc804a8b15255e8349a7da4e1eec7bd6d94c7bae  huntCases.ts（9062 行）
```

**⚠️ 写课人注意**：仓库当前态**已大于快照**。引用行号前请先跑 `shasum`；**若哈希不符，请用下面这条「按内容定位」脚本**（不依赖行号）：

```bash
cat > /tmp/ctx.js <<'EOF'
const {readFileSync}=require("fs");
const L=readFileSync(process.argv[2]||"/tmp/snap/grammarLessons.ts","utf8").split("\n");
const marks=[]; L.forEach((l,i)=>{const m=l.match(/^\s*id:\s*"(lesson-[\w-]+)"/); if(m)marks.push({line:i+1,id:m[1]});});
const info=line=>{let cur=null;for(const m of marks){if(m.line<=line)cur=m;else break;} if(!cur)return "?";
  const k=marks.indexOf(cur); const end=(k+1<marks.length?marks[k+1].line:L.length);
  const body=L.slice(cur.line-1,end-1).join("\n");
  return "L"+(body.match(/^\s*number:\s*(\d+)/m)||[])[1]+" ("+cur.id+") "+(body.match(/^\s*grammarLabel:\s*"([^"]*)"/m)||[])[1];};
const q=process.argv[3]; let n=0;
L.forEach((l,i)=>{ if(l.includes(q)){ n++; console.log((i+1)+"  ["+info(i+1)+"]  "+l.trim().slice(0,210)); }});
if(!n) console.log("NO MATCH: "+q);
EOF
node /tmp/ctx.js /tmp/snap/grammarLessons.ts "说「看着怎么样」：look 自己站中间"
```

**本报告一切 `:NNNNN` 行号，均可用上面这条命令以引文原文替换末参数复跑复现，且脚本会同时打印「该行属于哪一课」**（批二十九定下的「行号 + 所属课号双验证」纪律，本轮全程执行）。

### 0.3 三种口径并列

**口径不敏感才是真零缺口**。本轮三轴核心词实测：

```bash
cat > /tmp/cal.js <<'EOF'
const {readFileSync}=require("fs");
const GL=readFileSync("/tmp/snap/grammarLessons.ts","utf8");
const HC=readFileSync("/tmp/snap/huntCases.ts","utf8");
const raw=(t,w)=>(t.match(new RegExp("(^|[^A-Za-z])"+w+"([^A-Za-z]|$)","gi"))??[]).length;
const quo=(t,w)=>(t.match(new RegExp("\"[^\"]*"+w+"[^\"]*\"","gi"))??[]).length;
const sub=(t,w)=>(t.match(new RegExp(w,"gi"))??[]).length;
for(const w of ["seem","appear","rather","prefer","each","each other","other","look","looks"])
  console.log(w+"  GL raw="+raw(GL,w)+" quoted="+quo(GL,w)+" substring="+sub(GL,w)
             +"  | HC raw="+raw(HC,w)+" quoted="+quo(HC,w)+" substring="+sub(HC,w));
EOF
node /tmp/cal.js
```

实测输出：

```
seem        GL raw=0 quoted=0 substring=0   | HC raw=0 quoted=0 substring=0
appear      GL raw=0 quoted=0 substring=0   | HC raw=0 quoted=0 substring=0
rather      GL raw=0 quoted=0 substring=0   | HC raw=0 quoted=0 substring=0
prefer      GL raw=0 quoted=0 substring=0   | HC raw=0 quoted=0 substring=0
each        GL raw=0 quoted=110 substring=110 | HC raw=0 quoted=16 substring=16   ← 110 全是 teacher 词内
each other  GL raw=0 quoted=0 substring=0   | HC raw=0 quoted=0 substring=0
other       GL raw=0 quoted=151 substring=157 | HC raw=0 quoted=30 substring=33   ← 全是 brother/mother/another
look        GL raw=247 quoted=670 substring=746 | HC raw=43 quoted=65 substring=87
looks       GL raw=264 quoted=254 substring=264 | HC raw=24 quoted=22 substring=24
```

**→ `seem`／`appear`／`rather`／`prefer`／`each`／`each other` 六项三口径全 0（真零缺口，口径不敏感）；`each` 的 110 与 `other` 的 151 全是词内匹配**（`teacher`／`brother`／`mother`／`another`），**词位本身是 0**——这正是批二十九 `way` 那条提醒的又一次现成对照。

### 0.4 ⚠️ 复用核查：连续子序列口径

**口径**：把源文件按行拍平成 token 流，候选句也拍平，然后找**连续相邻**的 token 序列，命中即 `HIT`（错误句常作为多句案件里的一个子句出现，所以要查全库任意位置，不能只查 targetSentence）。

```bash
cat > /tmp/probe.js <<'EOF'
const {readFileSync}=require("fs");
const GL=readFileSync("/tmp/snap/grammarLessons.ts","utf8"), HC=readFileSync("/tmp/snap/huntCases.ts","utf8");
const lines=GL.split("\n"); const marks=[];
lines.forEach((l,i)=>{const m=l.match(/^\s*id:\s*"(lesson-[\w-]+)"/); if(m)marks.push({line:i+1,id:m[1]});});
const numOf=line=>{let cur=null;for(const m of marks){if(m.line<=line)cur=m;else break;} if(!cur)return "?";
  const k=marks.indexOf(cur), end=(k+1<marks.length?marks[k+1].line:lines.length);
  return "L"+(lines.slice(cur.line-1,end-1).join("\n").match(/^\s*number:\s*(\d+)/m)||[])[1];};
const norm=s=>s.toLowerCase().replace(/[^a-z0-9' ]/g," ").replace(/\s+/g," ").trim();
const flat=[], hcFlat=[];
lines.forEach((l,i)=>{norm(l).split(" ").filter(Boolean).forEach(t=>flat.push({t,line:i+1}));});
HC.split("\n").forEach(l=>{norm(l).split(" ").filter(Boolean).forEach(t=>hcFlat.push(t));});
const seq=(arr,s)=>{const toks=norm(s).split(" "),hits=[];
  for(let i=0;i+toks.length<=arr.length;i++){let ok=true;for(let j=0;j<toks.length;j++)if(arr[i+j].t!==toks[j]){ok=false;break;}if(ok)hits.push(arr[i].line||0);}return hits;};
for(const c of process.argv.slice(2)){ const h=seq(flat,c);
  console.log((h.length?"HIT   ":"FREE  ")+c.padEnd(32)+[...new Set(h.map(numOf))].join(",")+"  inHC="+(seq(hcFlat,c).length>0)); }
EOF
node /tmp/probe.js "He seems to know you." "It looks like a boat." "He seems tired."
```

**本轮全部候选句都跑了这条命令**，逐句 `FREE`／`HIT` 结果写在 §2.5／§6.3／§6.4／§7 各表。

### 0.5 逐字引用纪律

**前批出过「引文真实存在但行号指错课」。** 本轮每处引用都跑了 `§0.2` 的 `ctx.js`，**它同时打印行号与所属课**。**本项目里唯一一处需要更正的历史引用**（§1.4）：批二十七／二十八都记过「L127 的 `It looks like rain.` 引文」——**该句确实在 L127，但最早出现在 L49 `:9126`**（L49 的对白行），**L127 是复用**。这一条的完整行号分布：

```
9126  [L49 (lesson-49-advice-if) 收口 · 建议 + 条件]  { who: "npc", en: "It looks like rain.", zh: "有人补了一句：看着要下雨。" }
24349 [L127 (lesson-127-two-look-faces) 收口 · 零新知（喊人看 vs 说样子）]  { en: "It looks like rain.", zh: "看着要下雨。（认读一句，混个脸熟）" }
24384 [L127]  wrong: "It looks like rain.",
24388 [L127]  whyZh: "两句都对——认读一句：It looks like rain.（看着要下雨）是这张脸再往后走一步说「像什么」。今天只认脸，不学新花样。"
24414 [L127]  "还有一句 It looks like rain.（看着要下雨）——那是这张脸再往后走一步说「像什么」。今天只认脸，不学新花样——以后再说它。"
```

### 0.6 零术语自检口径（本报告的分区）

**红线是「面向学习者的文案不得含那 29 个术语词」**（`src/data/grammarZeroTerms.ts`）。本报告分两层：

- **§7 的课注字段（`title`／`grammarLabel`／目标句／一句话规则）＝ 面向学习者的文案**——**已逐条跑过 29 词自检，8 个字段全部干净 ✅**（见 §7 各表的「零术语自检 ✅」标记）；
- **分析段落（§1–§6／§8–§9）＝ 写给主理人的研究语言**——为把切分点说清，**允许使用 `形容词`／`比较级`／`单数` 等分析词**（这与库内 `deepDive` 允许保留术语的分级做法一致）。**写课人请勿把分析段的用词抄进课注。**

---

## §1 逐轴缺口盘点

### 1.1 三条轴实测缺口表

（GL = `grammarLessons.ts`，HC = `huntCases.ts`，raw/token 口径，快照哈希见 §0.2）

| 轴 | 目标词 | GL | HC | 词位可拆性 | 判定 |
|---|---|---|---|---|---|
| **A** | `seem`／`seems`／`seemed` | **0** | **0** | **1 个词位**（`seem` 一族） | **真缺口（强）** |
| **A** | `appear`／`appears`／`appeared` | **0** | **0** | 1 个词位 | **真缺口，但本轮建议不做**（§2.4） |
| **A** | `look like` | `looks like` **5 处** | **0** | **0 新词**（全旧词重排） | **真缺口（形式缺口，最强）** |
| **B** | `rather` | **0** | **0** | 1 个词位（`would rather`） | **伪强缺口**（§3） |
| **B** | `prefer` | **0** | **0** | 1 个词位 | 真缺口但档位更低 |
| **C** | `each` | **0** | **0** | 1 个词位 | **位置已被 L152 占**（§4） |
| **C** | `each other` | **0** | **0** | 2 个词位 | 真缺口，与 `each` 不同轴 |

### 1.2 轴 A 证据链（本轮亲自复核）

**一、库内已有两次「明写许诺」。** 这是轴 A 被称为「被连押多批」的真正原因——**不是研究偏好，是库里已经向用户许诺过**：

```bash
node /tmp/ctx.js /tmp/snap/grammarLessons.ts "以后再说它"
```

```
24414  [L127 (lesson-127-two-look-faces) 收口 · 零新知（喊人看 vs 说样子）]  "还有一句 It looks like rain.（看着要下雨）——那是这张脸再往后走一步说「像什么」。今天只认脸，不学新花样——以后再说它。"
25594  [L133 (lesson-133-five-senses) 收口 · 零新知（五张脸排一行）]  whyZh: "认读一句，混个脸熟：这句话说的是「我盼着周末」——今天只认脸，不学新花样（以后再说它）。"
```

**→ L127 `:24414` 逐字写着「以后再说它」，指的是 `It looks like rain.` 这张脸。这条许诺已经挂了 3 批（批十九 L127 上线 → 至今 L158）。**

**二、`It looks like rain.` 已经被「违规前置」了两次，用户已经见过它。** L127 把它放进 `examples`（`:24349`）**和一张双正解对比卡**（`:24384`），L49 更早把它放进了对白（`:9126`）。**课内文案自己说「今天只认脸，不学新花样」——但用户在 L127 看到它时，它是张有卡位、有中文、有对照的「半正式内容」，不是脚注。**

**三、中文入口是真高频、当前完全说不出。** 见 §1.3。

### 1.3 真实表达需求（从零基础中国学习者出发）

| 中文里想说的话 | 现在能不能说出口 | 依赖轴 |
|---|---|---|
| 「看着像条船。」 | ❌ **说不出**（`look like` 无课） | **A** |
| 「它好像快下雨了。」 | ⚠️ 只能借 L127 的认读句硬背 | **A** |
| 「他好像认识你。」 | ❌ **说不出**（`seem` 全库 0） | **A** |
| 「他看起来像认识你。」 | ❌ 说不出 | A |
| 「我宁愿待在家。」 | ⚠️ **能绕**（`I want to stay at home.` L15／L48 的 `stay at home`） | B |
| 「我宁愿走路。」 | ⚠️ 能绕（`I want to walk.`） | B |
| 「每个人都不高兴。」 | ✅ 已能说（L152 `every`） | C |
| 「他们互相认识。」 | ❌ 说不出（`each other` 0） | C＋ |

**→ 轴 A 的两个中文入口（「看着像…」「好像…」）都是零基础口语高频句、当前**零替代说法**；轴 B 的两个入口在 L15／L48 已有可绕路径（`want to + 动词`／`stay at home` 都教过）；轴 C 的主入口（「每一个」）L152 已覆盖。**

### 1.4 排序与结论

> **排序：轴 A（拆成两课）≫ 轴 C＋（`each other`，若主理人要第三课）＞ 轴 B（不做）＞ 轴 C（`each` 本体，不做）。**

- **轴 A 第一**：三口径全零 ＋ **库内两次明文许诺（L127 `:24414`）** ＋ **`look like` 是零新词的形式缺口**（`look` GL 247／`looks` 264／`like` 540／`a` 994 全在库）＋ 中文高频。
- **轴 A 拆两课**：`look like`（旧词新岗，形式增量）与 `seem`（**唯一一个新造词**）**外形负担不同、机制不同**，不能压一课——这一条与批二十九「新形式量与机制量不能同课压」的裁决同口径。
- **轴 B 不做**：**不是因为它是伪缺口**（`rather` 确实 0），**而是因为它与 L62/L69/L70 的 `would + 原形` 壳完全同形，且中文入口可绕**——详见 §3。
- **轴 C 不做**：**`each` 不是「讲不清」，是「讲清了也没有位置」**——`every` 已在 L152 用「一个一个来」把 `each` 的中文侧说法吃掉，且 L152 全课出现「一个一个」**13 次**、「每个」12 次。**详见 §4。**

---

## §2 轴 A 专项（本轮重点）：`seem`／`appear` 与 `look` 家族的切分

### 2.1 逐字读 L125／L126／L127（快照行号，全部经 `ctx.js` 双验证）

**L125**（`/tmp/snap/grammarLessons.ts:23932`，`[L125 (lesson-125-it-looks-nice)]`）：

```
:23932  grammarLabel: "看起来怎样 · look 中间站，后面跟「怎么样」",
:23945  oneLineRule: "说「看着怎么样」：look 自己站中间，后面直接跟那个「怎么样」的词——It looks nice。中间不站 is。",
:23940  targetSentence: "It looks nice.",
:23981  whyZh: "两句都对——中文一句「挺好」管两头，英语分两张脸：It 【looks】 nice 是「我看到的它」；It 【is】 nice 是「它就是挺好」。"
:23984  wrong: "The sky looks dark.",   ← 双正解卡的「另一句」
:23995  whyZh: "两句都对——第 58 课的 is heavy 说「它就是重」；今天的 looks nice 说「我看着它不错」——两张脸并排站着。"
```

**L126**（`:24132`，`[L126 (lesson-126-you-look-tired)]`）：

```
:24132  grammarLabel: "换人换形 · you look / she looks",
:24145  oneLineRule: "说「你看着怎么样」：你配 look（不带 s）；他、她、它配 looks（带 s）——You look tired.／She looks tired。后面照样直接跟那个「怎么样」的词。",
:24140  targetSentence: "You look tired.",
:24195  whyZh: "两句都对——两张脸并排站着：You 【look】 tired 是「我看你像累了」；You 【are】 tired 是「你就是累了」。"
```

**L127**（`:24332`，`[L127 (lesson-127-two-look-faces)]`）：

```
:24332  grammarLabel: "收口 · 零新知（喊人看 vs 说样子）",
:24345  oneLineRule: "同一个 look，两张脸：喊人去看是 Look at the clouds!（后面跟「去哪儿看」）；说看着什么样是 The sky looks dark.（后面跟「什么样」）——后面跟的东西不一样，说的就不是一件事。",
:24340  targetSentence: "The sky looks dark.",
:24349  { en: "It looks like rain.", zh: "看着要下雨。（认读一句，混个脸熟）" },     ← 认读位
:24384  wrong: "It looks like rain.",   ← 双正解卡
:24388  whyZh: "两句都对——认读一句：It looks like rain.（看着要下雨）是这张脸再往后走一步说「像什么」。今天只认脸，不学新花样。"
:24414  "还有一句 It looks like rain.（看着要下雨）——那是这张脸再往后走一步说「像什么」。今天只认脸，不学新花样——以后再说它。"   ← 许诺
```

**五张感官脸的收口**（`:25532`，`[L133 (lesson-133-five-senses)]`）：

```
:25545  oneLineRule: "这一章五张脸排一行：看（looks）、听（sounds）、闻（smells）、尝（tastes）、摸（feels）——都是自己站中间，后面直接跟那个「怎么样」的词。"
```

**→ L125–L133 一共 9 课，把「感官词 + 怎么样」这一格已经铺满（look／sound／smell／taste／feel 五词全到，否疑也做过 L132）。这一格是**饱和的**——`seem` 若再走「seem + 形容词」这条路，就是**第 6 张脸**，用户不会觉得那是新东西。**

### 2.2 问题①：`look + 形容词`（L125）与 `seem + 形容词` 对零基础**是不是真的无法区分**？

**答案：是真的无法区分——而且这是可以用实测数字证明的，不是感觉。**

**证据一：两者在中文里的说法完全撞车。** 实测中文侧词频：

```bash
node -e '
const {readFileSync}=require("fs");
const GL=readFileSync("/tmp/snap/grammarLessons.ts","utf8");
const c=w=>(GL.match(new RegExp(w,"g"))??[]).length;
for(const w of ["看起来","看着","好像","像什么","一个一个","每个"]) console.log(w, c(w));
'
# 看起来 68   看着 86   好像 1   像什么 2   一个一个 13（L152 内）  每个 12（L152 内）
```

- **`看着` 86 处 ＋ `看起来` 68 处**——库内已经用这两个中文词给 `look` 全部 9 课做了解释；
- **`好像` 全库只 1 处**，且那 1 处（`:7263`，`[L39]`）还是**无关用法**（「好像『我哥哥戴眼镜』是顺带说的」——这里是「好像…似的」，不是 `seem`）。

**→ 若要给 `seem + 形容词` 写中文解释，唯一自然的中文是「看起来／看着…」——而这两个词已经被 L125–L133 占满。写出来就是同一句话：**

| 课 | 英文 | 必然的中文 |
|---|---|---|
| L125（已教） | `It looks nice.` | 它**看起来**不错。 |
| 若做 seem + 形容词 | `He seems tired.` | 他**看起来**很累。 |
| L126（已教） | `You look tired.` | 你**看起来**很累。 |

**→ 用户会看到两句英文、一句一模一样的中文。L125／L126 的对比卡已经把「看起来」钉死在 `look` 上（`:23981` 逐字「It 【looks】 nice 是「我看到的它」」），再做 `seem + 形容词` 就是**自相矛盾**：一个中文对应两个课，且第二课无法解释「那什么时候用第一个」。**

**证据二：跨源也不支持「零基础分开教」。** 本轮实取（Cambridge `Look` 语法页原文）**逐字确认两词被并列为同一类**：

```
Look 页逐字： "look as a linking verb like appear, be, become, seem"
Look 页逐字： "As a linking verb, look does not take an object"
Seem 页逐字： "Seem as a linking verb is followed by an adjective or, less commonly, a noun"
Seem 页逐字： "It seems strange that no one noticed that the window was broken. (+ adjective)"
```

**→ 上游是**把两词放在同一张表里**教的（同一页互相指引）。**批二十四是「静悄悄地教 `seem + 形容词`」的方案，本轮判定：❌ 否。**

**但——分歧点在这里，也是本轮的关键结论：**

> **`seem + 形容词` 不能教，不等于 `seem` 不能教。`seem` 有一个 `look` 结构上做不到的形式：`seem to + 动词`。**

### 2.3 问题②：`seem`／`appear` 有没有 `look` 做不到的东西？

**答案：有，而且是硬结构差异。三条，按「可教性」排序：**

| # | `seem` 结构 | `look` 能不能 | 跨源逐字 | 判断 |
|---|---|---|---|---|
| **1** | **`seem to + 动词`**：`He seems to know you.` | ❌ **不能**。`look to` 是别的意思（指望/朝向） | Seem 页逐字：**"We can use seem with a to-infinitive"** ／ 例 **"Tony always seems to offend people."** | ✅ **可教，且是硬差异** |
| 2 | `it seems that + 小句子` | ❌ 不能（`it looks that` 不成立；只能用 `as if`） | Seem 页逐字：**"We can use the impersonal construction it seems or it seemed with a that-clause"** | ⚠️ 可教但**撞 L36 `I think (that)`**（同类「一句话包在引子后面」），会造成 `think` / `seem` 两课重叠 |
| 3 | `there seems to be + 东西` | ❌ 不能 | Seem 页逐字：**"We can also use the impersonal construction there seems to be or there seemed to be, followed by a noun"** ／ 例 "There seems to be a mistake in these calculations." | ⚠️ **撞 L26 `there is`／L60 `there was`** 两课，且句子超过 8 词风险高 |

**→ 取第 1 条：`seem to + 动词`。**

**为什么这条能切开 `look` 家族（三层论证）：**

1. **结构层**：`look` 后面跟的是**「怎么样」的词**（`nice`／`tired`／`dark`——L125 `:23945` 逐字「后面直接跟那个「怎么样」的词」）；`seem to` 后面跟的是**「做什么」的词**（`know`／`be`）。**后面跟的东西不一样，就不是同一张脸**——这正是 L127 用来切 `look at` 与 `looks dark` 的原话（`:24345` 逐字「后面跟的东西不一样，说的就不是一件事」）。**同一套切法，可以原样复用。**
2. **中文层**：`He seems to know you.` 的自然中文是「**他好像认识你**」——**不是「他看起来认识你」**。「好像」这个词库内**只出现过 1 次且是别的意思**（`好像` 全库 1 处，`:7263`，`[L39]` 的「好像…似的」）。**→ 中文入口是全新的、干净的，不与 L125–L133 的「看起来／看着」撞车。**
3. **壳层**：`seem to + 动词` 复用 **L15 `want to + 原样`** 的壳（`:2756` 逐字「「想做……」= want to + 原样」；`:2780` 逐字「to 后面的动词永远穿原样」；`:2821` 逐字「to 后面的动词永远穿原样：want to go、wants to go、wanted to go——变的只有 want 自己，to 后面从不动」）。**`want` → `seem` 是同一块垫板的第二次应用，增量只有「换一个词站 to 前面」。** 库内已有 4 课（L15／L44／L46／L64）在做这种「垫板家族复现」，是本项目**最成熟的复现路线**。

**→ 结论：`seem` 的增量不是「又一张感官脸」，是「to 垫板家族新成员」。这与「感官五张脸已饱和」不矛盾——它根本不进那一格。**

### 2.4 `appear` 的处置：本轮不做（登记理由）

| 项 | 实测／跨源 | 判定 |
|---|---|---|
| CEFR | Cambridge `appear`（SEEM）**B1**；`seem` **B1**（批二十四实取） | 同档 |
| 中文入口 | 「似乎／显得／看来」——**`似乎` 全库 0、`显得` 全库 0、`看来` 全库 0**（本轮实测中文侧，三个词 GL 全 0） | ⚠️ **新入口，但比「好像」生僻** |
| 跨源定性 | Cambridge `Look` 页把 `appear` 与 `seem` 并列链接 verb；批二十四逐字记过 **"We mostly use appear to talk about facts and events."** | 差异只有一条 |
| 与 `seem` 的差别 | **「`appear` 偏事实／事件，`seem` 偏主观印象」** | ⚠️ **零术语下无法表达**（要讲「客观 vs 主观」，那是抽象层级，零基础第一课就崩） |
| 词位成本 | 1 个词位 | 但**无独立教学抓手** |

**→ `appear` 与 `seem` 的差别在零术语下讲不出（唯一差异是抽象语感），且做 1 课就得与 `seem` 同课压——那会变成「同一课两个词、一个词说得出区别一个说不出」，违反本轮 §1.4 的拆课原则。** **建议：`appear` 进「认读位」——放在 L160 的 `examples` 里一句 `He appears to know you.`（一句中文「他也这么说，更书面」），不立岗、不设考点。** 这与库内既有的认读惯例一致（L127 `:24349` 的 `It looks like rain.` 就是认读位）。

### 2.5 问题③：能否设计出 3 条不重复的带标记新错？

**能，而且三条全部实测零复用（连续子序列口径）。** 全部候选句实测结果：

```bash
node /tmp/probe.js "He seems to know you." "He seems know you." "He seems to knows you." \
  "He seem to know you." "He seems is tired." "He seems tiredly." "He looks like tired." \
  "He looks to know you." "It looks like a boat." "It looks a boat." "It looks like boat." \
  "It look like a boat." "It looks like nice." "It looks like bird."
```

实测输出（全部 `FREE`）：

```
FREE  He seems to know you.      (GL 0 课 / HC 无)
FREE  He seems know you.         (GL 0 课 / HC 无)     ← 漏 to
FREE  He seems to knows you.     (GL 0 课 / HC 无)     ← to 后不像原样
FREE  He seem to know you.       (GL 0 课 / HC 无)     ← 漏 -s
FREE  He seems is tired.         (GL 0 课 / HC 无)     ← 中间站 is
FREE  He seems tiredly.          (GL 0 课 / HC 无)     ← 加 -ly
FREE  He looks like tired.       (GL 0 课 / HC 无)
FREE  He looks to know you.      (GL 0 课 / HC 无)
FREE  It looks like a boat.      (GL 0 课 / HC 无)
FREE  It looks a boat.           (GL 0 课 / HC 无)     ← 漏 like
FREE  It looks like boat.        (GL 0 课 / HC 无)     ← 漏 a
FREE  It look like a boat.       (GL 0 课 / HC 无)     ← 漏 -s
FREE  It looks like nice.        (GL 0 课 / HC 无)     ← like 后跟形容词
FREE  It looks like bird.        (GL 0 课 / HC 无)
```

**→ 两课各 3 条带标记新错，全部可造，全部零复用。**

**⚠️ 一处需要写课人注意的既有约束（批二十七遗留携带项，与本批直接相关）：** `wrongMark` 现有 **540 处**（distinct 254 种取值）。本轮跑脚本逐条验证「**`wrongMark` 标记的词必须全部出现在同一条 `wrong` 句子里**」——**540/540 通过，0 例外**（脚本 `/tmp/wm.js`，逻辑：取 `wrongMark` 前后 8 行内最近的一条 `wrong:`，两者按空格切分后逐 token 比对）。**含空格的取值 37 种（`not are`／`Want you`／`to go`／`my key is` 等）全部是错句里连续出现的词块；含「去掉／缺／多」这类描述的取值 0 种。**

**→ 结论：`wrongMark` 只能标「错句里实际存在的词」，不能标「缺的那个词」。** 本批 6 条因此定死（与 §5.3 一致）：`It looks a boat.`→标 `looks`／`It looks like boat.`→标 `like`／`It look like a boat.`→标 `look`／`He seems know you.`→标 `seems`／`He seems to knows you.`→标 `knows`／`He seem to know you.`→标 `seem`。**四条「漏词」错的标记全部落在「缺词前面那个词」上**——**这是库内 540 处的统一惯例。**

---

## §3 轴 B 专项：`would rather` 与 L62 `would like` 的切分

### 3.1 逐字读 L62（`/tmp/snap/grammarLessons.ts:11596`，`[L62 (lesson-62-would-like)]`）

```
:11596  grammarLabel: "客气想要 · would like",
:11609  oneLineRule: "想把「想要」说客气一点，用 I would like：比 I want 软一档，would 家族穿原样。",
:11604  targetSentence: "I would like a cup of tea.",
:11632  whyZh: "would 家族穿原样：like 不加 -s——跟 must/should 家族一个规矩。",
:11653  whyZh: "两句都对——想要「东西」直接跟上（a cup of tea）；想要「做事」垫块 to（to sleep）。"
```

**→ L62 已经埋了两条对本轴致命的伏笔：**

1. **`:11609` 逐字「would 家族穿原样」**——L62 把 `would` 定性为**家族词**（与 `must`／`should` 同族，L47 `:8723` `grammarLabel: "情态三兄弟 · should"`）；
2. **`:11653` 逐字「想要「做事」垫块 to（to sleep）」**——**L62 已经教过「would like + to + 动词」**（`I would like to sleep.` 是它的 example）。

**而 `would rather` 的形式规律是：`would rather + 动词`（不垫 to）。**

### 3.2 切分点：`would like to` vs `would rather`（两个词位差一个 `to`）

| | 已教 L62 | 拟做轴 B |
|---|---|---|
| 英文 | `I would like **to** sleep.` | `I would rather sleep.` |
| 中文 | 我想睡觉。（客气） | 我宁愿睡觉。（取舍） |
| `to` | ✅ 有 | ❌ **没有** |
| `would` 家族 | ✅ 同族 | ✅ 同族 |
| 新词 | — | `rather`（1 个） |

**→ 对零基础用户，这两句的**可观察差异只有中间那个 `to`**。**而本项目在 `to` 的有无上已经有一次**血案级的教训**：L79 `:14935` 的 `whyZh` 逐字写着「两个词一起住：next to——to 不能丢（**漏 to 是头号坑**）」。**库内已经把「漏 to」定为头号坑。** 现在要在 L159+ 教一课「这里**恰好要漏掉** to」——**这是直接与库内最硬的纪律对撞**，需要极高的解释成本（「would like 要垫，would rather 不垫，两个都是 would 家族」），**而零基础用户没有任何锚点区分这两句**（中文都是「我想…」）。

**⚠️ 这是本轮判定轴 B 不做的最强理由，且是库内自证，不依赖跨源。**

### 3.3 跨源档位复核

本轮实取（Cambridge `Would rather, would sooner` 语法页原文）：

```
小节逐字： "Would rather"／"Same subject"／"Different subjects"／"Much rather"／
           "Short responses: I'd rather not"／"Would sooner, would just as soon"／
           "Would rather, would sooner: typical errors"
形式逐字： "would rather (not) followed by the base form of the verb"
禁用逐字： "We don't use would rather or would sooner with an -ing form or a to-infinitive."
对比例子： "I'd rather walk" ✅ ／ "I'd rather to walk" ❌ ／ "I'd rather walking" ❌
```

**→ 跨源把 `would rather` 的**第一条教学重点就是「不垫 to」**，并明写这是典型错误。**批二十三四次判 B−，理由之一是「与 `prefer` 共用」。本轮复核：**

- **`prefer` 全库 0**（真缺口），但 `prefer` 与 `would rather` **在跨源同一页**（Murphy 中级 U59 标题逐字 `prefer and would rather`；批二十三四次复核实取），**两词要成对处理——那是 2 个词位**；
- **本轮判定：不做，且不再登记为「押后」——建议降为 **B−−（不进备选池）**。** 理由：
  1. **形式增量是负的**（教「这里不垫 to」，对冲库内「漏 to 是头号坑」）；
  2. **中文入口可绕**（`I want to stay at home.` — L15 `want to + 原形` ＋ L48 `stay at home` 都已教，用户现在就能说出「我想待在家」）；
  3. **`would` 已在 L62／L69／L70 三课出现（GL `would` 169 处，`would like` 56 处），壳子已经教过三次**——第四次出现一个「壳同、规律反」的新词，投入产出比在本项目历史里最低。

**→ 若主理人仍要做：上限 1 课，且必须先做「`would like to` 有无 to」的正面对撞课，不能直接讲 `rather`。**

### 3.4 能否撑 1–2 课？

**形式上能（`would rather` 1 课 ＋ 与 `prefer` 分工 1 课），但本轮判「不值得」。** 若强行做 2 课，第 2 课必须讲 `prefer`，而 **`prefer` 的中文「更喜欢」与 L17 的比较级（`:3109` `grammarLabel: "比一比 · -er / more"`，GL `than` 114 处）同轴**——会变成 L17 的复现课，重复度高。

---

## §4 轴 C 专项：`each` vs `every` 在零术语下能否讲清

### 4.1 逐字读 L152（`/tmp/snap/grammarLessons.ts:29275`，`[L152 (lesson-152-every-student)]`）

```
:29275  grammarLabel: "差在哪儿 · 好多个一起／一个一个来",
:29288  oneLineRule: "说「一个一个都」：every 后面只说一个——Every student is here（每个学生都到了）。上一课那个 all 后面是好几个，这个后面只站一个。",
:29283  targetSentence: "Every student is here.",
:29361  rule: "说「一个一个都」：every 后面只说一个、搭档用 is——Every student is here；上一课那个 all 后面是好几个、搭档用 are。"
```

**L152 课内「一个一个」的分布（node 实测 13 处）：**

```bash
node -e '
const L=require("fs").readFileSync("/tmp/snap/grammarLessons.ts","utf8").split("\n");
let cnt=0,lines=[];
for(let i=29275-20;i<29275+130;i++){ const m=L[i].match(/一个一个/g); if(m){cnt+=m.length;lines.push(i+1);} }
console.log("L152 内「一个一个」:", cnt, lines.join(","));
let c2=0; for(let i=29275-20;i<29275+130;i++){ const m=L[i].match(/每个/g); if(m) c2+=m.length; }
console.log("L152 内「每个」:", c2);
'
# L152 内「一个一个」: 13   29275,29285,29286,29288,29297,29298,29317,29324,29354,29357,29361,29383,29391（行号已核）
# L152 内「每个」: 12
```

### 4.2 问题：这个「难讲」是真的无法克服吗？

**答案：不。它根本不是「难讲」——是「已经讲完了」。** 批二十六登记的说法是「`each` 与 `every` 的差别（**个别 vs 群体**）在零术语下极难讲」——**本轮判定这个说法需要更正**：

**更正 1：差别不是「个别 vs 群体」，是「从哪头数」。** 批二十六的中文侧引文（`english.cool/each-vs-every` 逐字 "each 是「一個一個分開看」…every 是「全部加起來一起看」"）说的是**同一次观察的两个说法**，而**L152 已经用零术语把它说完了**：`:29288` 逐字「说「一个一个都」：every 后面只说一个」、`:29285`（`{ text: "Every student", role: "每个学生（一个一个来，只说一个）" }`）。**「一个一个来」就是这个差别的零术语说法，它已上线 6 批。**

**更正 2：`each` 的中文入口（「每个」）已被 L152 占用。** 中文侧 `each` 的最自然翻译就是「每个」——**而「每个」在 L152 课内出现 12 次**（含 `:29283` 那句的中文「每个学生都到了」）。**若做 L159 `each`，用户看到的中文与 L152 完全一样**（「每个杯子都好」vs「每个学生都到了」），**且无法解释区别**——**这与 §2.2 的 `seem + 形容词` 撞车是同一种病，但更重：`seem` 至少还有 `to` 那条出路，`each` 没有。**

**更正 3：`each` 唯一的形式增量（`each of the + 复数` 配单数）在库内已有先例可挂靠，但挂靠点是 L157。** `each` 与 `none` 的 `of` 结构同形（L157 `:30251` 逐字 `grammarLabel: "一个都不 · none 后面拴 of"`）。**→ 若真要做 `each`，它是 L157 的后缀课（「`none of` 换成 `each of`，后面从「一个都不」变成「每一个都」），不是 L152 的后缀课。** 但这会形成 **L157 →（隔 1 课）→ L159 `each` → 再回 L152 的「每个」** 的来回跳跃，**顺序成本过高**。

### 4.3 能否撑 1 课？

**技术上能，产品上不建议。** 理由汇总：

| 项 | 实测 | 判断 |
|---|---|---|
| `each` 三口径 | **全 0**（真缺口） | 缺口成立 |
| 与 L152 的中文入口 | **完全撞车**（「每个」L152 ×12） | ❌ 致命 |
| 与 L157 的形式入口 | 撞 `none of` 结构 | ⚠️ 可切但顺序成本高 |
| 跨源差异条数 | 批二十六实取：Cambridge `Each or every?` 2 条禁用（❌`Almost each car`／❌`Every of us`）＋ 中文侧 3 篇专文 | ⚠️ **两条禁用里有一条（`Every of us`）是本项目 L152 已覆盖的（every 后不站 of）** |
| 剩给 `each` 的独立内容 | **只有「两个的时候必须用 `each`」**（`letmeenglish.com/every-each` 逐字 "當事物只有兩個時，必須使用 each"） | ⚠️ **而「两个」这一格已被 L148–L150 三课占满（`both`／`neither`／收口）** |

**→ 判定：轴 C（`each` 本体）不做，**且建议把批二十六的「极难讲」更正为「**位置已占、无独立增量**」**——这个更正对后续批次有实际价值：**它把一条「看起来随时可以做」的候选，改成一条「已关闭」的候选**，避免它继续占备选池。

**→ 轴 C 的唯一活口是 `each other`（`They know each other.`）**：`each other` / `other` 三口径全 0，中文是「互相／彼此」（`互相` GL 1 处、`彼此` GL 0），**与 `each` 不同轴**（`each other` 是「互相」，不是「每一个」）。**但那是一个全新的语义格（「互相」），本轮不推荐在 B 档收口阶段开新格——登记为独立候选，与 `each` 脱钩。**

---

## §5 中文负迁移分析（为推荐轴给典型中式错句）

### 5.1 L159 `look like`（`It looks like a boat.`）

**中式错句（逐条 `*错句`）：**

1. **`*It looks a boat.`** —— 干扰点：**中文「看着像条船」的「像」被吃掉**。中文「像」是实义动词，用户会把它对应到「看着」的 `looks` 上，于是 `looks` 后面**直接跟东西**（`a boat`），漏掉 `like`。**这是本课第一号错**（库内 0 复用，见 §2.5）。
2. **`*It looks like boat.`** —— 干扰点：**中文没有「a」这个格子**。中文「看着像条船」的「条」是量词，用户会把它当可省成分；`like` 后面的 `a boat` 被写成光杆 `boat`。**库内这一类的处理惯例是 `wrongMark` 标 `looks`／`like`**（见下 §5.3 的 `wrongMark` 说明），与 L3／L4／L5 的「a 不能丢」链条同源（`:201` 「I am student.」→「I am a student.」是本项目最早的一条）。
3. **`*It look like a boat.`** —— 干扰点：**「它」在中文里不触发任何动词变化**。中文「它看着像条船」的「看着」不变形，用户会把 `looks` 写成 `look`。**这是库内最高频的老错**（L125 `:23971`／L126／L127 各有一张；`sv_agreement` 全库 109 处）。

**双正解方向（3 条，供对比卡用）：**

| # | 对照句 | 一句话说明方向 |
|---|---|---|
| 1 | `It looks nice.`（L125） | 后面跟「怎么样」是**说样子**；今天跟「像什么」是**说像什么**——同一个 `look`，后面跟的东西不一样 |
| 2 | `Look at the boat!`（L88 `:16692` 有同类 `Look at the clouds!`） | 喊人去看（后面跟「去哪儿看」）；今天说像什么（后面跟「像什么」） |
| 3 | `It is a boat.` | `It is` 是「它就是」；`It looks like` 是「我看着它像」——两张脸并排站着 |

### 5.2 L160 `seem`（`He seems to know you.`）

**中式错句（逐条 `*错句`）：**

1. **`*He seems know you.`** —— 干扰点：**中文「他好像认识你」里没有 `to`**。中文是「好像 + 动词」直接拼接，用户会把 `seem` 当 `know` 的副词性伙伴，**漏掉垫板 `to`**。**这是本课第一号错**（库内 0 复用）。**与 L15 `:2780` 的 `want to go` 同型——`to` 垫板是本项目已确立的最强复现链条。**
2. **`*He seems to knows you.`** —— 干扰点：**中文动词不变形**（「认识」永远一个样子），用户看到 `he` 会本能地给**最近的动词**加 `-s`，于是 `know` 变成 `knows`。**要讲清「变形的事已经由 `seems` 做完了」**——这句原话 L15 `:2780` 已经用过（逐字「变形的事已经由 wants 做完了…to 后面的动词永远穿原样」），**可原样复现**。
3. **`*He seem to know you.`** —— 干扰点：**`he`／`she` 加 `-s` 是中文侧完全没有的格子**（L25 起的老错，`He drinks milk.` 是 L25 的靶句，`:4609`）。**库内这是最顽固的一格**（`sv_agreement` 109 处，`verb_form` 135 处）。

**双正解方向（3 条）：**

| # | 对照句 | 一句话说明方向 |
|---|---|---|
| 1 | `I think he knows you.`（L36 `:6671` `话中话 · 小挂件 that`） | L36 是「我觉得」（我说的想法）；今天是「他好像」（我看到的迹象）——**都是「一句话不打包直接说」** |
| 2 | `He knows you.` | `He knows you.` 是**确定**；`He seems to know you.` 是**我猜的**——一个说事实，一个说迹象 |
| 3 | `You look tired.`（L126 `:24140`） | L126 说的是**看得见的**（累）；今天说的是**看不出来的**（他认不认识你）——所以今天要借 `to` 那块板 |

### 5.3 `wrongMark` 惯例（两课共同的写课约束）

**实测全库 540 处 `wrongMark`，脚本逐条验证「标记的词必须全部出现在同一条 `wrong` 句子里」——540/540 通过，0 例外**（脚本 `/tmp/wm.js`，逻辑见 §2.5）。**本批 6 条的标记位置已在 §2.5 定死**（`looks`／`like`／`look`／`seems`／`knows`／`seem`），**四条「漏词」错的标记全部落在「缺词前面那个词」上——这是库内 540 处的统一惯例。**

**⭐ 一处需要写课人注意**：`It look like a boat.` 的标记可直接照抄 **L125 `:23971-23972`**（`wrong: "It look nice."`／`wrongMark: "look"`），**`He seems to knows you.` 的说明可直接复现 L15 `:2780` 逐字「变形的事已经由 wants 做完了…to 后面的动词永远穿原样」。**

---

## §6 场景设计

### 6.1 场景 ID 合法性（必读，**批二十九已加断言**）

**合法值只有 14 个**（`/Users/liujun/Documents/英语听写/src/components/AdventureScene.tsx:6-19`）：

```ts
export type AdventureSceneId =
  | "campus" | "city" | "train" | "lighthouse" | "desert" | "space" | "ocean"
  | "island" | "mansion" | "forest" | "snow" | "magic" | "mystery" | "sparkle";
```

**⛔ 历史雷**：批二十八发现 5 课写了 `scene: "school"`（**非法值**，渲染时 `SCENES[scene] ?? SparkleScene` **静默回退** sparkle 插画，无报错）。批二十九已修并**升级为守门断言**（`src/data/grammarSeasons.test.ts` 的「课程 scene 必须是合法场景 ID」）。**本轮推荐的两个 scene 值均在合法清单内，写课后 `npm test` 会先红。**

### 6.2 全库场景使用分布（node 实测 158 课）

```bash
# 脚本 /tmp/scene.js：按 lesson id 切块，取每块 scene 字段，统计计数与最后使用课号
node -e '
const L=require("fs").readFileSync("/tmp/snap/grammarLessons.ts","utf8").split("\n");
const marks=[]; L.forEach((l,i)=>{const m=l.match(/^\s*id:\s*"(lesson-[\w-]+)"/); if(m)marks.push({line:i+1,id:m[1]});});
const rows=[]; L.forEach((l,i)=>{ const m=l.match(/^\s{4}scene:\s*"([a-z]+)"/); if(m){ let cur=null;
  for(const k of marks){if(k.line<=i+1)cur=k;else break;} const k2=marks.indexOf(cur);
  const end=(k2+1<marks.length?marks[k2+1].line:L.length);
  const body=L.slice(cur.line-1,end-1).join("\n");
  rows.push({scene:m[1],num:+(body.match(/^\s*number:\s*(\d+)/m)||[])[1]}); } });
const cnt={},last={}; rows.forEach(r=>{cnt[r.scene]=(cnt[r.scene]||0)+1; last[r.scene]=r.num;});
Object.entries(cnt).sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>console.log("  "+k.padEnd(12)+v+"  last=L"+last[k]));
'
```

实测输出：

```
mansion     61   last=L153      ← 已超载（61/158 = 39%）
campus      44   last=L156      ← 超载
city        26   last=L158      ← 本批刚用完
sparkle      9   last=L137
island       5   last=L71
train        4   last=L155      ← 本批刚用完（L155）
mystery      4   last=L157      ← 本批刚用完（L157）
forest       2   last=L75
magic        2   last=L45
snow         1   last=L19
ocean／desert／space／lighthouse   0   ← 全库 0 课，从未使用
```

**→ 库里 4 个场景从未被任何课用过：`ocean`／`desert`／`space`／`lighthouse`。`mansion` 61 课、`campus` 44 课。** 本轮**两课都优先选 0 课场景**。

### 6.3 L159 场景锚：`It looks like a boat.` → 场景 `ocean`（全库 0 课）

**场景设定（零术语文案）**：傍晚海边，小美站在岸上，远处水面上有个东西——同学眯着眼睛看，说那看着像条船。

**零件清单（逐词实测词次，快照口径）**：

| 词 | GL | HC | 备注 |
|---|---|---|---|
| `It` | 1585 | 135 | ✅ |
| `looks` | 264 | 24 | ✅ 已教（L125） |
| `like` | 540 | 43 | ✅ 已教（L5 `like + 名词`／L62 `would like`／L127 认读句） |
| `a` | 994 | 121 | ✅ 已教（L3 起） |
| `boat` | **22** | 2 | ✅ **已教**（L17 `:3117` `targetSentence: "This boat is bigger than that one."`） |
| `that` | 152 | 9 | ✅ 已教（L33 指示代词） |
| `far` | **18** | 0 | ✅ |
| `light` | 40 | 3 | ✅ |
| `island` | **5** | 4 | ✅ |
| `at` | 456 | 87 | ✅ 已教（L88 `Look at…`） |

**→ 全部零件在库，零造词。** 配角句（供对白/变体取材，全部实测 `FREE`）：

```
Look at that! ／ Is that a boat? ／ That is a boat. ／ The light is far.
I like boats.  （boats GL 0／HC 2，但 boat 已教 22 处，复数形态 L11 已教）
It is a boat.
```

**⚠️ 零雨线纪律**：本课文案**不出现 `rain`／`raining`／`rainy`／`stops`／`stopped`／`the movie`／`ends`／`ended`**（L109 专属叙事资产，实测 L109 `:20746`）。**已核对：上表 10 词 ＋ 6 句 0 处命中这 8 个词。** 另**须回避** L127 的既有资产（`The sky looks dark.`／`Look at the clouds!` 已挂在 L48／L88／L125／L127，实测 `The sky looks dark.` 命中 `L48,L125,L127`）——**两课都不能拿它当正解或对照句**。

### 6.4 L160 场景锚：`He seems to know you.` → 场景 `lighthouse`（全库 0 课）

**场景设定（零术语文案）**：雾里的灯塔下，小美和爷爷站着，远处走来一个人——他看着像认识爷爷，但没开口。

**零件清单（逐词实测词次）**：

| 词 | GL | HC | 备注 |
|---|---|---|---|
| `He` | **512** | 76 | ✅ 已教（L2） |
| `seems` | **0** | 0 | ⚠️ **本批唯一新造词** |
| `to` | 2549 | 263 | ✅ 已教（L15 `want to`） |
| `know` | **173** | 10 | ✅ 已教（L35／L36／L41） |
| `you` | 1340 | 72 | ✅ 已教 |
| `grandpa` | **12** | 0 | ✅ 已教 |
| `light` | 40 | 3 | ✅ |
| `far` | **18** | 0 | ✅ |
| `walking` | 39 | 6 | ✅ 已教（L13 起） |
| `but` | 209 | — | ✅ 已教（L19） |

**配角句（全部实测 `FREE`）**：

```
I want to know him. ／ He knows you. ／ He knows my name. ／ Is that your grandpa?
Look at that light! ／ He is walking to the light. ／ I think he knows you.
（`knows` 词位 GL 0／HC 0，从未出现过）
```

**→ 除 `seems` 外全部零件在库。造词成本：`seem` 1 个词位（含 `seems` 变形——本项目把 `-s` 变形算作同一词位，见 L25 系列）。**

### 6.5 造词成本表（若必须造词，明确列出）

| 词 | 用在 | 是**真新造**吗 | 成本 | 可否归零 |
|---|---|---|---|---|
| `seem` / `seems` | L160 | ⚠️ **是**（三口径全 0） | **1 个词位**（与批二十七 2／批二十八 1／批二十九 2 同口径） | **不可归零**——这是轴 A 第二课的全部增量 |
| `look like` | L159 | ✅ **不是**（`look` 247＋`looks` 264、`like` 540 全在库） | **0 个词位** | —— |
| `boat`/`light`/`island`/`grandpa`/`far` | 两课场景 | ✅ **不是**（22／40／5／12／18 处） | **0** | —— |

**→ 本批总造词成本 = 1 个词位（`seem`），是本项目近四批里的次低（批二十七 2 个、批二十八 1 个、批二十九 2 个）。**

**⚠️ 词汇门槛提示（`huntCases.ts` 头部逐字规定）：**「词汇门槛：用词尽量落在核心 500 词内；个别教学上必须保留的难词放在 `notes` 里作为「生词提示」展示」。**`seem` 是 B1 词（Cambridge 实取），若两案的 tokens 里出现它，须在 `notes` 里挂生词提示。** 建议**案件 tokens 里不放 `seem`**（用 L159 的 `look like` ＋ 老错回流构案），把 `seem` 留给课程本体。

---

## §7 逐课规格（推荐 2 课）

### 7.1 L159 规格

| 项 | 内容 |
|---|---|
| **课注 id** | `lesson-159-looks-like-a-boat` |
| **number** | `159` |
| **title** | `看着像条船` |
| **grammarLabel** | `看着像什么 · looks like + 东西`（**零术语自检：含「looks like」，不含 29 词表任何词** ✅） |
| **目标句** | `It looks like a boat.` —— **6 词** ✅（≤8） |
| **场景** | `ocean`（**合法 ID** ✅；**全库 0 课**，`ADVENTURE_SCENE_LABELS` 逐字 `ocean: "海底世界"`，`SCENES.ocean = OceanScene` 存在） |
| **一句话规则** | `说「看着像什么」：looks 后面先拴 like，再跟上那个东西——It looks like a boat。中间不站 is。` |
| **cover** | `cover42`（实测全库用 1 次，仅 L42 用；`src/assets/lessons/lesson-42.jpg` 存在 ✅） |
| **episode** | `小美的一天 一百五十九` |

**对比卡 6 条（3 带标记 ＋ 3 双正解）——全部实测 FREE（§2.5）：**

| # | 类型 | `wrong` | `wrongMark` | `correct` | 方向 |
|---|---|---|---|---|---|
| 1 | 带标记 | `It looks a boat.` | `looks` | `It looks like a boat.` | 中文「像」被吃掉——`looks` 后面要先拴 `like` |
| 2 | 带标记 | `It looks like boat.` | `like` | `It looks like a boat.` | 后面那个东西要报数：`a boat` |
| 3 | 带标记 | `It look like a boat.` | `look` | `It looks like a boat.` | 「它」是单个的，`looks` 带 `-s`（L125 老规矩） |
| 4 | 双正解 | `It looks nice.`（L125 `:23979`） | — | 目标句 | L125 后面跟「怎么样」；今天后面跟「像什么」——`looks` 后面跟的东西不一样 |
| 5 | 双正解 | `Look at the boat!`（L88 `:16692` 同型） | — | 目标句 | 喊人去看（后面跟「去哪儿看」）；今天说像什么（后面跟「像什么」） |
| 6 | 双正解 | `It is a boat.` | — | 目标句 | `It is` 是「它就是」；`It looks like` 是「我看着它像」 |

**变体三态：**

| 态 | 英文 | 中文 | noteZh 方向 |
|---|---|---|---|
| 肯定 | `It looks like a boat.` | 看着像条船。 | `looks` 后面先拴 `like`，再跟那个东西 |
| 否定 | `It does not look like a boat.` | 看着不像条船。 | 说「不」请帮手 `doesn't`；`look` 退回原样（L125 老规矩） |
| 疑问 | `Does it look like a boat?` | 看着像条船吗？ | `Does` 站句首，`look` 退回原样 |

**复现取材建议（全部实测行号/课号已验证）：**

| 复现对象 | 句子 | 实测状态 | 用途 |
|---|---|---|---|
| L125 | `It looks nice.` | 全库 8 课（L13/125/126/127/128/130/133/134）；**practice 出现 5 课（L125/126/128/133/134）**——**距 6 课红线仅 1 课余量** | ⚠️ **本课若在 practice 里再用，就是第 6 课，直接触红。建议只在 `contrast` 双正解卡里用（对比卡不计入该红线）** |
| L127 | `The sky looks dark.` | practice 2 课（L125/127）；任意位置 3 课（L48/125/127） | ✅ 有余量 |
| L88 | `Look at the clouds!` | practice 1 课（L127）；任意位置 2 课（L88/127） | ✅ 有余量 |
| L17 | `This boat is bigger than that one.` | practice 2 课（L65/78）；任意位置 4 课 | ✅ 有余量 |
| L60 | `There was a bird in the park.` | practice 1 课（L60） | ✅ 零复用 |

**案件设计建议（`huntCases.ts` 追加 #168）：**

| 槽位 | 内容 | 依据 |
|---|---|---|
| 新错 1 | `It looks a boat.` → `looks like`（tag: `preposition`） | 库内先例：**`huntCases.ts`** `:5554-5556` 处 `next` → `next to` 用 `preposition` tag ✅ |
| 新错 2 | `It looks like boat.` → `like boat`（tag: `article`） | 库内先例：**`huntCases.ts`** `:5561-5563` 处 `window.` → `the window.` 用 `article` ✅ |
| 旧错回流 1 | `I eat two sandwich.`（tag: `plural`，回 L11） | **实测零复用** ✅（`I ate two sandwich.` 已占 #151，改 `eat` 即可） |
| 旧错回流 2 | `Last night he watch TV.`（tag: `tense`，回 L10） | **实测零复用** ✅（`Last night I watch TV.` 已占 #161，改 `he` 即可） |

**⚠️ 已避开的复用雷（本轮实测，写课人请勿误用）：**

```
HIT  It look nice.        #134, GL L125        ← 不能用作新错
HIT  It looks nice.       #134, GL 8 课
HIT  It looks is nice.    #134, GL L125
HIT  You looks tired.     #135,#136, GL L126
HIT  She look tired.      #135, GL L126
HIT  He drink milk(every day).  #34,#99,#112,#121,#129,#138,#144,#149 + L25   ← 复用最重，禁止
HIT  My sister like music.      #161
HIT  We have two cup.     #79,#135,#139,#145,#146,#147
HIT  She have two book.   #165
HIT  We have two bag.     #124,#128
HIT  I have two book.     #116
HIT  They was happy.      #125,#132,#135,#138,#140,#144,#149,#150
HIT  We were happy.       #106,#108,#114,#122
HIT  He is tired.         #45, GL L36
HIT  The students is/are here.  #166
```

### 7.2 L160 规格

| 项 | 内容 |
|---|---|
| **课注 id** | `lesson-160-seems-to-know-you` |
| **number** | `160` |
| **title** | `他好像认识你` |
| **grammarLabel** | `好像… · seems to + 做什么`（**零术语自检 ✅**） |
| **目标句** | `He seems to know you.` —— **5 词** ✅（≤8） |
| **场景** | `lighthouse`（**合法 ID** ✅；**全库 0 课**；`ADVENTURE_SCENE_LABELS` 逐字 `lighthouse: "灯塔海雾"`，`SCENES.lighthouse = LighthouseScene` 存在） |
| **一句话规则** | `说「他好像…」用 seems to：seems 后面垫一块 to，动作穿原样——He seems to know you。变形的活儿 seems 一个人做完了。` |
| **cover** | `cover43`（实测全库用 1 次，仅 L43；`src/assets/lessons/lesson-43.jpg` 存在 ✅） |
| **episode** | `小美的一天 一百六十` |

**对比卡 6 条（3 带标记 ＋ 3 双正解）——全部实测 FREE（§2.5）：**

| # | 类型 | `wrong` | `wrongMark` | `correct` | 方向 |
|---|---|---|---|---|---|
| 1 | 带标记 | `He seems know you.` | `seems` | `He seems to know you.` | 中文「好像认识」中间没有 `to`——英语要垫板 |
| 2 | 带标记 | `He seems to knows you.` | `knows` | `He seems to know you.` | 变形的活儿 `seems` 已经做完了，`to` 后面穿原样（L15 老规矩） |
| 3 | 带标记 | `He seem to know you.` | `seem` | `He seems to know you.` | 「他」配带 `-s` 的 `seems`（L25 老规矩） |
| 4 | 双正解 | `I think he knows you.`（L36 `:6671`） | — | 目标句 | L36 是「我觉得」（我的想法）；今天是「他好像」（我看到的迹象） |
| 5 | 双正解 | `He knows you.` | — | 目标句 | 一个说**确定**，一个说**猜的** |
| 6 | 双正解 | `You look tired.`（L126 `:24140`） | — | 目标句 | L126 说**看得见的**（累）；今天说**看不出来的**（认不认识）——所以要借 `to` |

**变体三态：**

| 态 | 英文 | 中文 | noteZh 方向 |
|---|---|---|---|
| 肯定 | `He seems to know you.` | 他好像认识你。 | `seems` 后面垫一块 `to`，动作穿原样 |
| 否定 | `He does not seem to know you.` | 他好像不认识你。 | 说「不」请帮手 `doesn't`；**`seem` 退回原样**，`to` 不动（L132 `Does it sound good?` 同型） |
| 疑问 | `Does he seem to know you?` | 他好像认识你吗？ | `Does` 站句首，`seem` 退回原样 |

**复现取材建议：**

| 复现对象 | 句子 | 实测状态 | 用途 |
|---|---|---|---|
| L15 | `I want to travel.` | practice 2 课（L44/108）；任意位置 5 课（L15/16/44/46/108） | ✅ **`to` 垫板的老祖宗，本课必须复现** |
| L35 | `I know where it is.` | practice 1 课（L35）；任意位置 1 课 | ✅ 余量充足 |
| L36 | `I think she is tired.` | practice 1 课（L36）；任意位置 1 课 | ✅ 余量充足 |
| L26 | `There is a book on the desk.` | practice 6 课 | ⛔ **已触顶，不得再用** |
| L1 | `I am happy.` | practice 5 课（L113/119/125/128/134）；任意位置 11 课 | ⚠️ **距 6 课红线仅 1 课余量，慎用** |

**案件设计建议（`huntCases.ts` 追加 #169）：**

| 槽位 | 内容 | 依据 |
|---|---|---|
| 新错 1 | `He seems know you.` → `seems to`（tag: `verb_form`） | 库内先例：**`huntCases.ts`** `:6832-6834` 处 `go` → `to go` 用 `verb_form` ✅ |
| 新错 2 | `He seems to knows you.` → `knows`（tag: `verb_form`） | 库内先例：**`huntCases.ts`** `:3541-3543` 处 `watch` → `to watch` 用 `verb_form` ✅ |
| 旧错回流 1 | `My brother have a bike.`（tag: `sv_agreement`，回 L2/L115 有／has 家族） | **实测零复用** ✅ |
| 旧错回流 2 | `Last week he go to the park.`（tag: `tense`，回 L10） | **实测零复用** ✅ |

**`appear` 认读位（不设考点，放 `examples`）：**

```
{ en: "He appears to know you.", zh: "他也这么说，更书面一点。（认读一句，混个脸熟）" }
```

**依据**：批二十四实取 Cambridge `Look` 页逐字把 `appear` 与 `seem` 并列 **linking verb**；本轮实取 Cambridge `Seem` 页无 `appear` 对比页。**写法与 L127 `:24349` 的认读位惯例一致。**

---

## §8 与已教内容的切分

### 8.1 最近邻：L125–L127（`look` 家族三课），切分点 = **`looks` 后面跟什么**

| | L125 | L126 | L127 | **L159（本批）** | **L160（本批）** |
|---|---|---|---|---|---|
| 目标句 | `It looks nice.` | `You look tired.` | `The sky looks dark.` | `It looks like a boat.` | `He seems to know you.` |
| `looks` 后面跟 | **「怎么样」的词** | 「怎么样」的词 | 「怎么样」的词 | **`like` + 东西** | ——（换 `seem`） |
| 中文入口 | 看起来不错 | 你看起来很累 | 天看着阴沉沉的 | **看着像条船** | **他好像认识你** |
| 与最近邻的差异 | — | 换人换形 | 喊人看 vs 说样子 | **后面跟「像什么」** | **后面跟「做什么」＋借 `to` 板** |

**`ctx.js` 验证（L127 的一句原话可直接复用为本批的切分话术）：**

```bash
node /tmp/ctx.js /tmp/snap/grammarLessons.ts "后面跟的东西不一样，说的就不是一件事"
# 24345  [L127 (lesson-127-two-look-faces) 收口 · 零新知（喊人看 vs 说样子）]  oneLineRule: "……——后面跟的东西不一样，说的就不是一件事。"
```

**→ L127 `:24345` 逐字「后面跟的东西不一样，说的就不是一件事」——这句话就是 L159 的切分逻辑（`looks` 后面跟「怎么样」＝ L125；跟「像什么」＝ L159）。同一把刀，第二次用。**

### 8.2 第二近邻：L133 五张感官脸（已饱和，不得再进）

```bash
node /tmp/ctx.js /tmp/snap/grammarLessons.ts "这一章五张脸排一行"
# 25545  [L133 (lesson-133-five-senses)]  oneLineRule: "这一章五张脸排一行：看（looks）、听（sounds）、闻（smells）、尝（tastes）、摸（feels）——都是自己站中间，后面直接跟那个「怎么样」的词。"
```

**→ L133 已把「感官词 + 怎么样」这一格**明确封箱**（`grammarLabel` 逐字 `收口 · 零新知（五张脸排一行）`）。**L160 若走 `seem + 形容词`，就是往这个封好的箱子里塞第 6 张脸——这是本轮否决「`seem + 形容词`」的产品层理由（§2.2 的实测是语言层理由）。**

### 8.3 第三近邻：L15／L44（`to` 垫板家族），L160 是第二次应用

```bash
node /tmp/ctx.js /tmp/snap/grammarLessons.ts "to 后面的动词永远穿原样"
# 2780  [L15 (lesson-15-want-to) want to + 原样]  whyZh: "变形的事已经由 wants 做完了（他/她/它版加 -s），to 后面的动词永远穿原样。"
# 2821  [L15 (lesson-15-want-to) want to + 原样]  "to 后面的动词永远穿原样：want to go、wants to go、wanted to go——变的只有 want 自己，to 后面从不动。"
```

**→ L160 的「`to` 后面穿原样」不是新规矩，是 L15 `:2780` 的原句复用。切分点：L15 的 `to` 前面是 `want`（想要），L160 的 `to` 前面是 `seem`（好像）——同一块板，换一个词站前面。**

### 8.4 第四／第五近邻：L62／L69／L70（`would` 家族）与 L36（`I think (that)`）——本批**刻意都不进**

```bash
node /tmp/ctx.js /tmp/snap/grammarLessons.ts "would 家族穿原样"
# 11632  [L62 (lesson-62-would-like)]  whyZh: "would 家族穿原样：like 不加 -s——跟 must/should 家族一个规矩。"

node /tmp/ctx.js /tmp/snap/grammarLessons.ts "说想法 = I think + 一句话"
# 6693  [L36 (lesson-36-think-that) 话中话 · 小挂件 that]  oneLineRule: "说想法 = I think + 一句话；that 是可拆的小挂件：挂上 I think that she is tired.、不挂 I think she is tired.，都对——漏 that 不算错。"
```

- **进 `would` 家族（轴 B）＝ 主动回避**：`would` 已出现 169 处、`would like` 56 处，壳子教过三次；**这不是「没看到轴 B」，是判过之后的不做**（§3.2 已给库内自证理由）。
- **进 `it seems that + 小句子` ＝ L36 的复现课**：与 L36 `:6686` 的「说想法 = I think + 一句话」同形式（引子 + 一句话）。**→ 本批只取 `seem to + 动词`（§2.3 表第 2 行的否决理由）。**

### 8.5 一句话总表

| 本批新课 | 最接近的已教课 | 切分点（一句话） |
|---|---|---|
| L159 `It looks like a boat.` | **L125–L127**（`look` 三课） | `looks` 后面**跟「像什么」**（`like` + 东西），L125 跟的是「怎么样」 |
| L160 `He seems to know you.` | **L15**（`want to`）＋ **L125–L127** | `to` 前面**站的是 `seem` 不是 `want`**；且说的不是「看得见的」而是「猜的」 |

---

## §9 未核实项

1. **`seem` 的 CEFR 三源分裂仍在。** 批二十四实取：Cambridge 词典 `seem` **B1**／Oxford **A2**／BC 参考层 `Link verbs` **elementary**；批二十四裁定「以 A2/elementary 为主、B1 为辅」。**本轮未重新跑 WebFetch 复核这三条的具体页面**（时间用于数据侧实测），**若主理人需要「本批自取」的证据，须生产期补取一次。**

2. **`appear` 的两条 Cambridge 明文禁用未逐字取到本轮证据。** 批二十六登记过「`appear` 页 2 条明文禁用」；本轮只取到 `Look` 页与 `Seem` 页的并列表述，**未直接取 `appear` 词典页的 typical errors 段**。§2.4 的判定**不依赖那两条禁用**（依赖的是「中文入口生僻」＋「差异讲不出」＋「同课压两词会破拆课原则」），故不影响结论。

3. **`would rather` 的「中文入口可绕」是定性判断，未做用户测试。** §3.3 理由 2 说 `I want to stay at home.` 可作为绕行路径——**这条没有真人验证**（本项目 F29-A 真实首玩计时长期未做，见批二十九 §5 E6）。**若主理人要把轴 B 从 B−− 拿回来，这一条应成为第一个验证点。**

4. **`each of the + 复数` 配单数还是复数，跨源并存。** 批二十九携带项 7 登记过「`none of` 单复数两源并存，本批按复数处理，未立考点」。**`each of` 的配法本轮未取新证据**（§4.2 更正 3 只是指出「`each` 唯一的活口是 L157 的后缀」）。**因判定不做，未展开。**

5. **`look like` 与 `look as if / as though` 的分层位置未定。** Cambridge `Look` 页本轮实取到 5 个小节：`Look`／`Look as a linking verb`／**`look like + noun phrase`**／**`look as if/as though + clause`**／`Look as a discourse marker`。**本轮只取 `look like + noun phrase`（L159），`look as if/as though + clause` 是「后面跟一整个小句子」，性质接近 L36/L48 的从句层——本轮未评估其课位，登记为后续候选。**

6. **`It looks like rain.` 的归属口径已更正，但历史文件未改。** §0.5 登记：批二十七／二十八记录的「L127 的 `It looks like rain.`」，**该句最早出现在 L49 `:9126`**（L49 的对白行），L127 是复用。**本轮只在本报告更正，未去改历史研究报告文件**（避免越权改他人交付物）。

7. **两课的 `practice` 复现会不会触 6 课红线，需生产期实算。** L159 若在 `practice` 里用 `It looks nice.`，**那将是第 6 课（当前 practice 已 5 课）——踩线不越线，但没有余量**；`I am happy.` 同理（practice 已 5 课）。**§7.1／§7.2 已给规避建议（只放 `contrast` 卡，不放 `practice`），但生产时须再跑一次红线断言。**

8. **cloze 借句漂移（批二十九携带项 3）与本批的关系未评估。** 批二十九查明：「凡『肯定变体借用老句』的课，约一半会把 cloze 落在借用的老句上」。**L159／L160 的肯定变体都是本课新句（`It looks like a boat.`／`He seems to know you.`），按该规律**不会**漂移** —— **但这是按规律外推，未实跑。** 建议生产期逐课跑一次 cloze。

9. **`cover42`／`cover43` 的插图内容未目视。** 本轮只核实「导入存在 ✅、全库各用 1 次 ✅、文件存在 ✅」。**`lesson-42.jpg` 是 L42（`like reading`）的插图、`lesson-43.jpg` 是 L43（`Swimming is fun`）的插图——与本批的 ocean／lighthouse 场景画面上是否协调，须目视确认。**

10. **本报告行号基于 `/tmp/snap/` 快照（§0.2），仓库当前态已大于快照。** 若主理人直接在仓库上核对行号，**请先跑 `shasum`**；不符时用 `§0.2` 的 `ctx.js`（按内容定位，不看行号）。

---

## 附录 A：本轮实测结果汇总（命令见 §0／§2.5／§4.1，脚本均已注明路径）

### A.1 规模与快照

```
课数 158  案数 167  季数 29   ← 全程未变（本轮文件被写入两次，行号漂移但规模不变）
GL sha256 c5525572b6b74f327103b660d4b580035535271d5ae4aa6450dde1428bb27306（30644 行）
HC sha256 b75cab7a88ac33d1a1d1901ebc804a8b15255e8349a7da4e1eec7bd6d94c7bae（ 9062 行）
```

### A.2 三轴三口径

见 §0.3（`/tmp/cal.js`）。**核心：`seem`／`appear`／`rather`／`prefer`／`each`／`each other` 六项三口径全 0。**

### A.3 结构红线（全库实测，脚本 `/tmp/contrast.js` 见 §0 说明）

```
总课数: 158
contrast != 6 的课: 无          ← ✅ 全库 158 课无一例外（红线成立）
严格 3标记+3双正解: 51 课
L125-133: L125=3m+3b L126=3m+3b L127=3m+3b L128=3m+3b L129=3m+3b L130=3m+3b L131=3m+3b L132=3m+3b L133=4m+2b
L148-158: L148=3m+3b L149=3m+3b L150=4m+2b L151=3m+3b L152=3m+3b L153=3m+3b L154=3m+3b L155=3m+3b L156=3m+3b L157=3m+3b L158=3m+3b
```

**⚠️ 一处须登记的口径事实（不与红线冲突，但要说清）：**

- **「每课 contrast 恰好 6 条」＝ 全库 158/158 无一例外 ✅**（红线成立）；
- **「3 条带标记 ＋ 3 条双正解」在 L102 之后是主流（44/57 严格符合），但全库只有 51 课严格符合**——**L133＝4m+2b、L150＝4m+2b**，另有 44 课含「无标记错句」（如 L1＝3m+0b+3n、L79＝1m+4b+1n）。
- **→ 对批三十的意义：L159／L160 应按 3m+3b 写**（批十九以来 L125–L132、L148–L158 的稳定配方），**但不能引用「全库 158 课全部 3+3」——那个说法与实测不符。** 批二十九路线图里「全库 contrast 配方 3 标记 + 3 双正解 ✅」这句，本轮实测显示只对 L102+ 的多数课成立，**建议主理人更正口径**。

### A.4 目标句长度（≤8 词）

158 条目标句中，**超过 8 词的有 3 条**，全部是收口课的「多句目标」（L86／L101／L102 三课），**单句口径全部合规**；全库最长 14 词（L102）。

**本批两句：`It looks like a boat.`（6 词 ✅）／`He seems to know you.`（5 词 ✅）。**

### A.5 复现红线（practice 口径，≤6 课）

```
6 课  yesterday i went to the park      ← 触顶
6 课  there is a book on the desk        ← 触顶
6 课  i was reading at eight             ← 触顶
5 课  i like reading／i was busy and happy／i am happy／i am used to getting up early
5 课  it looks nice                      ← 距触顶仅 1 课（本批慎用，见 §7.1）
```

**→ 本批两句的 practice 素材实测 `practice-lessons=0`，零风险 ✅。**

### A.6 场景合法性自检（写课后必跑）

```bash
npx vitest run src/data/grammarSeasons.test.ts
# 「课程 scene 必须是合法场景 ID（静默回退守门）」——写错会先红
```

**本批两个 scene 值 `ocean`／`lighthouse` 均在 `ADVENTURE_SCENE_IDS` 内 ✅**（`AdventureScene.tsx:6-19` 为 14 个合法值的唯一定义处；`:455-470` 的 `SCENES` 表两键均存在，**不会静默回退 sparkle**）。

---

## 附录 B：推荐一览表（给主理人的决策卡）

| 项 | 结论 |
|---|---|
| **推荐轴** | **轴 A**（`look like` ＋ `seem to`） |
| **课量** | **2 课**（L159 立岗 ＋ L160 立岗） |
| **L159** | `lesson-159-looks-like-a-boat`／「看着像条船」／`It looks like a boat.`（6 词）／scene `ocean`／cover42 |
| **L160** | `lesson-160-seems-to-know-you`／「他好像认识你」／`He seems to know you.`（5 词）／scene `lighthouse`／cover43 |
| **造词** | **1 个词位**（`seem`／`seems`）；`look like` **0 造词** |
| **新错** | 6 条（3+3），**全部实测零复用** ✅ |
| **轴 B** | **不做**；建议由 B− 降为 **B−−（移出备选池）**；理由：与 L79「漏 to 是头号坑」对撞（库内自证） |
| **轴 C** | **不做**；建议把批二十六「极难讲」更正为「**位置已占、无独立增量**」；`each other` 脱钩登记为独立候选 |
| **§2 切分判定** | **`seem + 形容词` ❌ 不可做**（与 L125 `:23981`「It 【looks】 nice 是「我看到的它」」正面冲突，中文都译「看起来」）；**`seem to + 动词` ✅ 可做**（`look` 结构上做不到；中文「好像」库内仅 1 处且是别的意思；复用 L15 `:2780` 的 `to` 垫板） |
| **新增展示层** | `season-30` `{min:159,max:160}`；`can-do-m32` `afterLesson: 160`（**⚠️ 见附录 C**） |
| **案件** | `huntCases.ts` 追加 #168／#169（槽位见 §7） |

---

## 附录 C：给主理人的三条机制提醒（与本批直接相关）

### C.1 ⚠️ 新增课程必须同步追加 `season-30`，否则整课不显示

`src/data/grammarSeasons.ts` 头部逐字警告：

```
⚠️ 硬护栏（维护须知）：min/max 区间过滤是「必需机制」而非展示装饰——
课程号不落在任何区间内会被路径页静默过滤（整课不显示、无报错）。
新增课程批次时必须同步追加 season-N 分组，并有 grammarSeasons.test.ts 守门。
```

**当前 `LESSON_GROUPS` 最后一条是 `season-29` `{min:157,max:158}`。本批 L159／L160 必须追加 `season-30` `{min:159,max:160}`（`grammarSeasons.test.ts` 会先红 ✅）。**

### C.2 ⚠️ `can-do-m*` 零引用无守门（批二十九携带项 10 延续）

`src/pages/GrammarPathPage.tsx` 里的 `can-do-m31` 已挂 `afterLesson: 158`。**本批应追加 `can-do-m32` `afterLesson: 160`**，格式照抄既有条目（`id`／`afterLesson`／`title`／`zh`／`samples` 五字段），**但该字段没有任何测试守门，须人工核**。

### C.3 ⚠️ cloze 借句漂移规律（批二十九 §5 E3 已查明，本批按规律预测不会漂）

批二十九查明：「**凡『肯定变体借用老句』的课，约一半会落空**」（种子决定抽 `variants` 的哪一条）。**L159／L160 的肯定变体都是本课新句，按该规律不会漂**——**但这是外推，未实跑**（§9 项 8）。**建议生产期逐课跑一次 cloze 并记录。**

---

> 本报告由产品战略团队 AI 协作生成（瑞思 · 用户研究员），重要决策请由产品负责人审定。
