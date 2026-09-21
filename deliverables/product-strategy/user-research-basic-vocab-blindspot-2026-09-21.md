# 基础词覆盖面盲区盘点（用户研究 · 瑞思）

**日期**：2026-09-21 ｜ **类型**：覆盖面普查（非课程批次）｜ **作者**：瑞思（用户研究员）
**对象**：「小美的一天」语法线 188 课（L1–L188）／197 案／28 季
**上游**：`b-tier-frontier-survey-2026-09-20.md`（批三十一 26 项普查）／`user-research-b-tier-closure-2026-09-21.md`（批三十五收口 9+8 项）
**下游**：主理人裁决 §4；若取语法缺口则由 pm 立批

---

## 📌 一句话结论

**前两轮普查（批三十一/批三十五）查的是「B 档候选」——中高阶结构；本轮查的是「A0/A1 地板完整性」。主理人给的 23 项零全部复核成立（22 项确认零、1 项 `welcome` 仅案件层 3 处），本轮**另**扩展扫出 **316 项全库皆零**的基础词；其中**只有 8 项属于语法缺口（能撑课）**，其余 308 项是词汇缺口（不属语法线，应登记词汇线）。最关键的一条：**`their` 不是词汇缺口，是 L8/L33/L163 三条已教词族的「缺格」——三处清单都把它漏掉了。**

---

> **零术语声明**：本报告是**内部研究文档**（读者是产品/研发），因此分析措辞使用了「介词」「形容词」「从句」「单数/复数」等上位概念以便精确沟通。**这些词不得进入任何面向学习者的文案**——新增课的 `oneLineRule`／`contrast.whyZh`／`guided.explain`／`recall.noteZh`／`variants.noteZh` 必须通过 `grammarZeroTerms.ts`（29 词）守门，`grammarLessons.test.ts` 第 251–341 行有全字段断言。本线现有正确范式：把「介词」说成**「小词」**（逐字见 L3333／L14932），把「形容词」说成**「…的（样子）」**（逐字见 L16697）。

---

## §0 本轮实测基线

### 0.1 数据规模（复跑）

| 项 | 实测值 | 口径 |
|---|---|---|
| 课数 | **188**（L1–L188，无跳号无重复） | `grammarLessons.ts` 顶层 `number:` |
| 案数 | **197** | `huntCases.ts` |
| 季数 | **28**（区间 1–188 全覆盖） | `grammarSeasons.ts` |
| 合法场景 ID | **14 个** | `AdventureScene.tsx` 第 22–25 行 |
| 零术语词表 | **29 词** | `grammarZeroTerms.ts` |

```bash
cd /Users/liujun/Documents/英语听写 && node -e '
const {readFileSync}=require("fs");
const GL=readFileSync("src/data/grammarLessons.ts","utf8");
const nums=[...GL.matchAll(/^\s{4}number:\s*(\d+),/gm)].map(m=>+m[1]);
const u=[...new Set(nums)].sort((a,b)=>a-b);const gaps=[];
for(let i=1;i<=Math.max(...nums);i++) if(!u.includes(i)) gaps.push(i);
console.log("lessons:",nums.length,"max:",Math.max(...nums),"gaps:",gaps.join(",")||"none");
'   # → lessons: 188 max: 188 gaps: none
```

### 0.2 四条产品红线的实测复核

| 红线 | 实测结果 | 判定 |
|---|---|---|
| **`contrast` 恰好 6 条** | **188/188 全部 = 6**，无例外 | ✅ 完全成立 |
| **场景 ID 合法** | 全部在 14 个合法值内 | ✅ |
| **目标句 ≤8 词** | **182/188 ≤8**；**6 课 >8**（全部是收口课） | ⚠️ 见下 |
| **季体量：≤3 课小季 ≤3 个** | **恰好 3 个**（season-6／12／19 各 3 课） | ⚠️ **触顶，不能新建小季** |

**目标句超 8 词的 6 课**（全部为「零新知收口课」，拼句是设计意图，非违规）：

| 课 | 最长分句 | 教学点 |
|---|---|---|
| L173 | 10 词 | 为了 · in order to |
| L178 | 9 词 | 更早的那件 · had + 做过版 |
| L182 | 10 词 | 收口 · 六件事排一行 |
| L183 | 11 词 | 收口 · 身边的事排一行 |
| L184 | 10 词 | 收口 · 日常六句排一行 |
| L185 | 13 词 | 收口 · 成对儿的说法 |

> **对本轮的约束**：新增课若走「尾批并入」路线，只能塞进现有季（season-28 已 7 课，可扩），**不得新开季**；目标句按非收口课口径 ≤8 词执行。

```bash
# 红线复跑
cd /Users/liujun/Documents/英语听写 && node -e '
const {readFileSync}=require("fs");
const s=readFileSync("src/data/grammarLessons.ts","utf8");
const b=s.split(/\n  \{\n    id: "lesson-/).slice(1);
let c6=0,over=[];
for(const x of b){
  const num=+(x.match(/number:\s*(\d+)/)||[])[1];
  const seg=x.split("\n    contrast: [")[1].split("\n    ],")[0];
  const n=(seg.match(/\n      \{/g)||[]).length; if(n===6)c6++;
  const ts=(x.match(/targetSentence: "((?:[^"\\]|\\.)*)"/)||[])[1]||"";
  const mx=Math.max(...ts.split(/[.!?]\s*/).filter(y=>y.trim()).map(y=>y.trim().split(/\s+/).length));
  if(mx>8) over.push("L"+num+"("+mx+")");
}
console.log("contrast=6 的课:",c6,"/188  超8词:",over.join(" "));
'   # → contrast=6 的课: 188 /188  超8词: L173(10) L178(9) L182(10) L183(11) L184(10) L185(13)
```

### 0.3 词频口径（回应工具坑）

本机 `grep` 是 ugrep，`grep -oniE "(^|[^A-Za-z])their([^A-Za-z]|$)"` 返回 0 是**错误结果**。本报告**全部数字用 node 词边界正则**产出，并在同一脚本内用两个已知锚点自校：

| 锚点 | 主理人给定 | 本轮实测 | 一致？ |
|---|---|---|---|
| `the` | 2764 | **2764** | ✅ |
| `good` | 606 | **606** | ✅ |
| `thanks` | 11 | **11** | ✅ |

**口径声明**：本报告「GL 词频」= `grammarLessons.ts` **全文**（含 TS 结构键）匹配数，与主理人口径一致，便于直接对读。

```bash
# 自校 + 本报告统一工具
cd /Users/liujun/Documents/英语听写 && cat > /tmp/scan.js <<'EOF'
const {readFileSync}=require("fs");
const GL=readFileSync("src/data/grammarLessons.ts","utf8");
const HC=readFileSync("src/data/huntCases.ts","utf8");
const esc=(w)=>w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
const r=(w)=>new RegExp(`(^|[^A-Za-z])${esc(w)}([^A-Za-z]|$)`,"gi");
const g=(w)=>(GL.match(r(w))??[]).length, h=(w)=>(HC.match(r(w))??[]).length;
for(const w of process.argv.slice(2))
  console.log(w.padEnd(14)+"GL="+String(g(w)).padStart(5)+" HC="+String(h(w)).padStart(4)+(g(w)+h(w)===0?"  【全零】":""));
EOF
node /tmp/scan.js the good thanks their hello "thank you"
# → the GL= 2764  good GL=  606  thanks GL=   11  their GL=    0  hello GL=    0  thank you GL=    0
```

**三类计数严格区分**（否则会把练习卡字段名 `answer:`／`explain:`／`before:`／`after:` 误当语料）：

| 类别 | 含义 | 例 |
|---|---|---|
| **GL 词频** | 课文件全文匹配（本报告主口径） | `answer` 2292（几乎全是练习字段名） |
| **GL 正例** | 学习者可见英文句里的出现 | `please` 95 中 L32 真句 9 处 |
| **GL 仅负例** | 只作为「错句／干扰项」出现 | `Its`（L87 的 `wrong:`／`distractors:`） |

---

## §1 复核并扩展盲区清单

### 1.1 主理人 23 项逐项复核

**复核结论：23 项全部成立（GL=0）。** 其中 3 项在 `huntCases.ts` 有残留出现，须注明——它们不是「完全不存在」，而是「课里没教、只在案件 token 里飘过一次」。

| # | 词 | GL | HC | 复核判定 | 备注 |
|---|---|---|---|---|---|
| 1 | `their` | 0 | **1** | ✅ 课里零 | 仅 HC L2303（案 37「习惯调查表」tokens） |
| 2 | `theirs` | 0 | 0 | ✅ **全库皆零** | |
| 3 | `around` | 0 | 0 | ✅ **全库皆零** | |
| 4 | `through` | 0 | 0 | ✅ **全库皆零** | |
| 5 | `learn` | 0 | **2** | ✅ 课里零 | HC L986（tokens）＋ L1016（`original: "learn"`） |
| 6 | `decide` | 0 | 0 | ✅ **全库皆零** | |
| 7 | `hope` | 0 | **1** | ✅ 课里零 | HC L1639（tokens） |
| 8 | `try` | 0 | 0 | ✅ **全库皆零** | 派生形 `tried` GL=1（L171） |
| 9 | `bring` | 0 | **3** | ✅ 课里零 | HC L2384／L3685（tokens）＋ L3713（explanation 逐字：`should bring an umbrella`） |
| 10 | `wake` | 0 | 0 | ✅ **全库皆零** | 派生形 `woke`／`woken`／`waking` 亦皆零 |
| 11 | `sad` | 0 | 0 | ✅ **全库皆零** | |
| 12 | `fine` | 0 | 0 | ✅ **全库皆零** | |
| 13 | `slow` | 0 | 0 | ✅ **全库皆零** | `slowly` GL=1（L126 讲解举例） |
| 14 | `young` | 0 | 0 | ✅ **全库皆零** | |
| 15 | `dirty` | 0 | 0 | ✅ **全库皆零** | |
| 16 | `important` | 0 | 0 | ✅ **全库皆零** | |
| 17 | `different` | 0 | 0 | ✅ **全库皆零** | |
| 18 | `hello` | 0 | 0 | ✅ **全库皆零** | |
| 19 | `welcome` | 0 | **3** | ✅ 课里零 | HC L2493／L3108／L3183，全部是 `Welcome to our shop!/book corner!/class!` |
| 20 | `okay` | 0 | 0 | ✅ **全库皆零** | |
| 21 | `thanks` | **11** | 0 | ⚠️ **不为零** | 全部集中在 L70 |
| 22 | `thank you` | 0 | 0 | ✅ **全库皆零** | 关键对照项，见 §1.4 |
| 23 | `excuse me` | 0 | 0 | ✅ **全库皆零** | |

**`thanks` 的 11 处逐条归属**（全部在 L70「提供 · Would you like…? + Yes, please / No, thanks」）：

| 行号 | 逐字 |
|---|---|
| L13171 | `grammarLabel: "提供 · Would you like…? + Yes, please / No, thanks"` |
| L13184 | `oneLineRule: "问对方「要不要」用 Would you like + 东西：要就说 Yes, please.；不要就说 No, thanks.。"` |
| L13188 | `{ en: "No, thanks.", zh: "不要，谢谢。" }` |
| L13240 | `{ label: "否定", en: "No, thanks.", zh: "不要，谢谢。", noteZh: "不要就说——thanks 让拒绝也体面。" }` |
| L13246 | `{ sceneZh: "婉拒「不要」", en: "No, thanks.", zh: "不要，谢谢。" }` |
| L13253 | `"应答成对记：要——Yes, please.；不要——No, thanks.。两个都带上 please/thanks，答得周全。"` |
| L13258 | `rule: "问「要不要」：Would you like + 东西——要答 Yes, please.；不要答 No, thanks.。"` |
| L13261 | `"Yes, please. / No, thanks. —— 应答成对"` |

**⇒ 关键判断：`thanks` 的唯一语境是「婉拒」（No, thanks），而感谢义的 `thank you` 是 0。** 也就是说这门课教了「谢谢」的**拒绝用法**，却没教它的**致谢用法**——这是本轮最有价值的一条对照发现（§1.4）。

### 1.2 三项「看着有、其实是假的」——本轮的假阳性排查

这三项若只看正则会误判为「已覆盖」，实际对用户是**负资产**：

| 词 | GL | 真相 | 逐字证据 |
|---|---|---|---|
| `its` | 17 | **全部是「少一撇的错法」**，没有一处教「它的」 | L16579 `"Its ❌ —— 少一小撇就成了「它的」"`；L16588 `options: ["It's", "Its", "It"]`；L16611 `wrongToken: "Its"`；L16639／L16652／L16665／L16848／L18004／L18410 全是 `distractors: ["Its"]` |
| `glad` | 0（HC=4） | 只在案里当**错句** | HC L269-270 `original: "glad"` / `correction: "is glad"`；L272 `"同样少了 be 动词：She is very glad。"` |
| `sorry` | 2 | 两处都是**边角对白**，未教 | L13058（L69 讲解提到 `Sorry, I can't`）；L19807（L104 对白 `"Sorry I'm late!"`） |

> **`its` 是本轮最隐蔽的一项**：GL 词频 17 看着不低，但逐条读下来，**它在这门课里唯一身份就是「反面教材」**。学习者学完 L87 会知道「`Its` 是错的」，但**没有任何一课教他「它的是 its」这个正确用法**（`its` 作物主词的正确例句 = 0）。这是一个教科书级的**只教了反面、没教正面**的缺口。

### 1.3 扩展扫描：316 项全库皆零

**扫描方法**：20 个范畴共 **1126 词项**，取自「中国零基础学习者前 500 词」的常用核心（CEFR A1 为主，少量 A2 高频）；每项用 GL ＋ HC 双文件词边界正则实测。

| # | 范畴 | 扫描项 | GL=0 | 全库皆零 | 零项举例（逐字） |
|---|---|---|---|---|---|
| 1 | 人称与物主 | 34 | 6 | 6 | `theirs`、`itself`、`ourselves`、`yourselves`、`themselves`、`one another` |
| 2 | 介词与方位 | 52 | 21 | 21 | `around`、`through`、`across`、`along`、`into`、`onto`、`toward`、`against`、`without`、`beside`、`above`、`below`、`besides`、`except`、`instead`、`upon`、`within`、`beyond`、`opposite`、`since` |
| 3 | 日常动词 | 157 | 65 | 60 | `decide`、`try`、`wake`、`sell`、`drive`、`ride`、`speak`、`begin`、`hold`、`stand`、`fall`、`hurt`、`smile`、`cry`、`remember`、`understand`、`believe`、`become`、`grow`、`hate`、`share`、`borrow`、`lend`、`send`、`receive`、`join`、`hurry`、`teach`、`follow`、`pick`、`drop`、`throw`、`build`、`cut`、`touch`、`pay`、`spend`、`spell`、`refuse`、`allow`、`introduce`、`describe`、`discuss`、`mention`、`imagine`、`expect`、`fail`、`manage`、`afford`、`belong`、`promise`、`agree`、`wish`、`chat`、`relax`、`wonder`、`repeat`、`own`、`happen` |
| 4 | 身体部位 | 40 | 32 | 32 | `head`、`eye`、`eyes`、`ear`、`nose`、`mouth`、`tooth`、`teeth`、`arm`、`leg`、`finger`、`body`、`heart`、`stomach`、`neck`、`shoulder`、`knee`、`skin`、`brain`、`bone`、`lip`、`tongue`、`chest`、`voice`、`beard` 类 |
| 5 | 家庭成员 | 40 | 18 | 14 | `father`、`parents`、`grandfather`、`grandmother`、`son`、`daughter`、`husband`、`wife`、`baby`、`kid`、`neighbor`、`relative`、`twins`、`mum`、`women` |
| 6 | 食物饮品 | 71 | 39 | 39 | `rice`、`noodle`、`fruit`、`vegetable`、`meat`、`beef`、`pork`、`sugar`、`salt`、`delicious`、`sweet`、`sour`、`snack`、`meal`、`dish`、`plate`、`glass`、`chopsticks`、`spoon`、`fork`、`knife`、`menu`、`cookie`、`chocolate`、`pizza`、`dumpling`、`salad`、`banana`、`tomato`、`potato`、`carrot` |
| 7 | 时间 | 50 | 7 | 5 | `evening`、`weeks`（复数形）、`years`（复数形）、`seconds`、`recently`、`midnight`、`moment`、`future` |
| 8 | 天气 | 26 | 9 | 9 | `cool`、`foggy`、`storm`、`sunshine`、`temperature`、`dry`、`fog`、`moon`、`star` |
| 9 | 颜色 | 19 | 12 | 12 | `yellow`、`black`、`pink`、`brown`、`purple`、`grey`、`gray`、`color`、`colors`、`golden`、`silver`、`bright` |
| 10 | 数字与量 | 57 | 20 | 20 | `twelve`、`thirteen`、`twenty`、`thirty`、`fifty`、`hundred`、`thousand`、`million`、`zero`、`double`、`pair`、`dozen`、`several`、`piece`、`bit`、`slice`、`bottle`、`kilo`、`meter`、`liter` |
| 11 | 学校与工作 | 55 | 24 | 22 | `pencil`、`subject`、`Chinese`、`office`、`job`、`worker`、`driver`、`police`、`farmer`、`engineer`、`boss`、`manager`、`waiter`、`artist`、`writer`、`scientist`、`lawyer`、`college`、`grade`、`score`、`backpack` |
| 12 | 家居与物品 | 50 | 29 | 27 | `bedroom`、`bathroom`、`sofa`、`computer`、`garden`、`yard`、`stairs`、`mirror`、`plate`、`spoon`、`knife`、`fork`、`bottle`、`glass`、`towel`、`soap`、`brush`、`blanket`、`pillow`、`closet`、`curtain`、`toilet`、`shower`、`sink`、`trash` |
| 13 | 交通与地点 | 48 | 22 | 22 | `bicycle`、`plane`、`subway`、`road`、`street`、`ticket`、`bridge`、`village`、`country`、`place`、`museum`、`hospital`、`store`、`restaurant`、`hotel`、`church`、`mountain`、`field`、`farm`、`hill`、`valley` |
| 14 | 衣服与穿戴 | 32 | 22 | 22 | `clothing`、`shirt`、`skirt`、`pants`、`socks`、`jacket`、`sweater`、`sunglasses`、`pocket`、`size`、`boot`、`glove`、`scarf`、`belt`、`tie`、`button`、`zipper`、`put on`、`take off`、`try on` |
| 15 | 自然与动物 | 60 | 42 | 42 | `grass`、`moon`、`star`、`mountain`、`hill`、`animal`、`horse`、`pig`、`cow`、`rabbit`、`panda`、`tiger`、`lion`、`monkey`、`leaf`、`stone`、`sand`、`field`、`farm`、`duck`、`sheep`、`snake`、`elephant`、`bear`、`bee`、`plant`、`wood`、`fire`、`earth`、`world`、`nature` |
| 16 | 情感与态度 | 43 | 27 | 27 | `sad`、`afraid`、`nervous`、`worried`、`surprised`、`fine`、`proud`、`shy`、`calm`、`lonely`、`lucky`、`safe`、`friendly`、`polite`、`honest`、`brave`、`lazy`、`clever`、`serious`、`angry`、`glad`、`grateful`、`jealous`、`confident`、`curious`、`patient`、`generous` |
| 17 | 社交用语 | 30 | 14 | 12 | `hello`、`hey`、`bye`、`thank you`、`okay`、`yeah`、`nope`、`excuse me`、`pardon`、`congratulations`、`good night`、`nice to meet you`、`you're welcome` |
| 18 | 程度与频度 | 52 | 20 | 20 | `quite`、`even`、`less`、`least`、`different`、`such`、`pretty`、`hardly`、`nearly`、`exactly`、`probably`、`maybe`、`perhaps`、`certainly`、`absolutely`、`completely`、`totally`、`especially`、`rarely`、`seldom` |
| 19 | 高频名词 | 92 | 42 | 39 | `place`、`price`、`holiday`、`vacation`、`present`、`reason`、`chance`、`life`、`world`、`country`、`sport`、`mistake`、`surprise`、`trouble`、`health`、`luck`、`wish`、`goal`、`law`、`fact`、`truth`、`joke`、`secret`、`danger`、`safety`、`care`、`job`、`task`、`duty`、`skill`、`ability`、`experience`、`thought`、`opinion`、`knowledge`、`education`、`culture`、`history`、`science`、`language` |
| 20 | 常用形容词 | 118 | 62 | 62 | `high`、`low`、`young`、`difficult`、`slow`、`weak`、`dirty`、`cool`、`dry`、`cheap`、`expensive`、`pretty`、`ugly`、`important`、`popular`、`famous`、`delicious`、`healthy`、`dangerous`、`false`、`real`、`possible`、`clear`、`bright`、`soft`、`sweet`、`round`、`thin`、`thick`、`wide`、`narrow`、`deep`、`shallow`、`sudden`、`main`、`safe`、`lucky`、`proud`、`polite`、`honest`、`brave`、`serious`、`different`、`special`、`common`、`simple`、`modern`、`ancient`、`local`、`foreign`、`national`、`personal`、`public`、`private`、`normal`、`strange`、`wonderful`、`terrible`、`awful`、`excellent`、`amazing` |
| | **合计** | **1126** | **587** | **533** | |

**§1.3 总量口径说明**（避免与 §1.4 的「316」混淆）：

| 口径 | 数量 | 含义 |
|---|---|---|
| 扩展扫描全量零 | **533** | 20 范畴 1126 项里 GL=0 且 HC=0 的 |
| **分层口径（本报告主口径）** | **316** | 去掉生僻／高阶／中英不对等项，只留「A0/A1 地基必备」 |
| T1 核心层 | **207**（去重 239 项中） | 一个零基础学习者**前 3 个月就会用到**的词 |
| T2 边缘层 | **111**（去重 262 项中） | 有场景但可延后（职业名／罕见动物／A2 抽象词） |

### 1.4 对照验证：证明「零是真的」

零不是文件残缺造成的，因为同族词的频次都很健康：

| 对照词 | GL | 说明 |
|---|---|---|
| `the` | **2764** | 主理人锚点，完全一致 |
| `good` | **606** | 主理人锚点，完全一致 |
| `my` | **1113** | 物主词家族里 `their`=0，`my`=1113 |
| `thanks` | **11** | 但 `thank you`=0 |
| `please` | **95** | 但 `hello`=0、`excuse me`=0 |
| `goodbye` | **20** | 但 `bye`=0 |
| `hi` | **1** | 全库唯一 1 处（L1 对白 `Hi! Who are you?`） |

**最有说服力的一条**：`goodbye` 有 20 处，`bye` 有 0 处；`thanks` 有 11 处，`thank you` 有 0 处。**这不是「文件缺了」，而是「同一家族的某一个成员被系统性漏掉」**——这种「半张脸」现象在本轮扫描里反复出现（§1.5）。

### 1.5 「半张脸」现象清单（本轮新增的一类发现）

比「整词缺席」更隐蔽的一类：**同族词里一半有、一半没有**，学习者会立刻撞上不对称：

| 家族 | 已教（GL） | 缺席（GL=0） | 用户何时撞上 |
|---|---|---|---|
| 物主词（贴名词版） | `my` 1113、`your` 145、`his` 24、`her` 110、`our` 14、`its` 17（仅负例） | **`their` 0** | 说「他们的」时无词可用 |
| 物主词（独立版） | `mine` 176、`yours` 21、`hers` 18、`ours` 1 | **`theirs` 0** | 同上，句子收尾版 |
| 反身词 | `myself` 130、`yourself` 18、`himself` 31、`herself` 56 | **`ourselves`/`yourselves`/`themselves` 0** | 说「我们自己」时 |
| 位置介词 | `in`/`on`/`at`（L18）、`next to`（L79）、`in front of`/`behind`（L80）、`between`（L81）、`under` 26、`near` 29 | **`around`/`through`/`across`/`along`/`into`/`beside`/`above`/`below` 0** | 说「穿过马路」「沿着街走」时 |
| 星期 | `Monday` 24、`Friday` 11、`Sunday` 11 | **`Tuesday`/`Wednesday`/`Thursday`/`Saturday` 0** | 说「周三」时 |
| 数字 | `one`–`eleven` 都有（`eleven` GL=1 属勉强） | **`twelve`/`twenty`/`thirty`/`hundred` 0** | 报时间「十二点」「二十」时 |
| 颜色 | `red` 4、`blue` 2、`white` 4、`green` 1、`orange` 1 | **`yellow`/`black`/`pink`/`brown`/`purple`/`grey` 0** | 描述物品颜色时立刻撞墙 |
| 亲属 | `mom` 126、`dad` 16、`sister` 21、`brother` 145、`grandma` 99、`grandpa` 15、`mother` 3、`cousin` 1 | **`father`/`parents`/`uncle`/`aunt`/`son`/`daughter`/`husband`/`wife` 0** | 介绍家人时说不出「爸爸」「父母」 |
| 天气形容词 | `sunny` 95、`windy` 70、`cloudy` 9、`snowy` 13、`rainy` 5、`warm` 9 | **`cool`/`dry`/`foggy`/`storm` 0** | 说「凉快」「干燥」时 |
| 三餐 | `breakfast` 11、`lunch` 3、`dinner` 85 | **（此项其实完整）** | — |

> **`father` 缺席但 `mother` 有 3 处、`mom` 有 126 处**，是本轮读起来最刺眼的一条：**「爸爸」这个最基础的词，188 课里一次都没有正式教过**（`dad` 有 16 处，但 `dad` 是口语变体，不能替代 `father` 的书面/正式位）。

### 1.6 §1 总量汇总

| 口径 | 项数 |
|---|---|
| 主理人给清单复核成立 | **23/23**（22 项零 ＋ `thanks` 不为零） |
| 本轮扩展扫描命中（GL=0） | **587** |
| 其中全库皆零（GL=0 且 HC=0） | **533** |
| **「A0/A1 地基必备」分层口径（本报告结论口径）** | **316** |
| ├ T1 核心层（前 3 个月必用） | **207** |
| └ T2 边缘层（有场景可延后） | **111** |
| 其中「半张脸」家族缺格 | **约 40 项**（含 `their`/`theirs`/星期×4/颜色×6/亲属×8 等） |

---

## §2 分类与优先级

### 2.1 三级严重度总表

**判定标准**：
- **🔴 真的会卡住用户** = 用户**想表达一件日常事时找不到任何替代说法**，或**替代说法会用错结构**。
- **🟡 能绕开** = 有语义等价的替代路径，用户说得出来（可能啰嗦一点）。
- **⚪ 不影响** = 零基础阶段完全不需要，迟教不损失。

| 严重度 | 项数（估） | 典型项 | 判据 |
|---|---|---|---|
| 🔴 卡住 | **约 55** | `their`、`hello`、`thank you`、`excuse me`、`father`、颜色 6 项、星期 4 项、`twelve`/`twenty`/`hundred`、`sad`、`wake`、`around`/`through`、`learn`/`try`/`decide`/`hope` | 无替代说法，或替代会造出错句 |
| 🟡 能绕开 | **约 120** | `theirs`、`ourselves` 组、`foggy`/`storm`/`temperature`、`fork`/`knife`/`spoon`、`engineer`/`scientist` | 有等价说法（`their + 名词`／「天不好」／「吃饭的东西」） |
| ⚪ 不影响 | **约 140** | `okay`、`pardon`、`congratulations`、`jealous`、`generous`、`ancient`、`liter`/`kilo`/`meter` | 零基础不需要 |

### 2.2 逐类严重度判定（T1 核心层）

#### A 类：物主／人称缺格 —— 🔴 卡住（且是语法缺口）

| 项 | GL | 严重度 | 为什么卡 |
|---|---|---|---|
| `their` | 0 | 🔴🔴 **最高** | 学习者学完 L7 `they are` 会自然说「their bag」；学完 L8 会自然类推 `my/your/his/her` 的下一格就是 `their`。**没有替代说法**（`of them` 远超零基础）。 |
| `theirs` | 0 | 🟡 能绕开 | 可用 `their + 名词` 绕（`It's their book`），但长版位置仍会卡。 |
| `ourselves`/`yourselves`/`themselves` | 0 | 🟡 能绕开 | `each other` 已教（L165，GL=50），部分场景能顶；但反身词家族 L163/L164 只教了一半。 |
| `its`（正确义） | 0 | 🔴 卡住 | **这个词存在的唯一形式是反面教材**（L16579）。学习者知道「Its 错」，但没人告诉他「它的」怎么说。 |

#### B 类：位置介词缺员 —— 🔴 卡住（语法缺口）

| 项 | GL | 严重度 | 为什么卡 |
|---|---|---|---|
| `through` | 0 | 🔴 卡住 | 「穿过马路／透过窗户」是零基础高频场景，`in/on/at` 全部无法替代。 |
| `around` | 0 | 🔴 卡住 | 「环顾四周／在附近转转」日常表达，`near` 只能覆盖一半。 |
| `across` | 0 | 🔴 卡住 | 「过马路」的另一半（`through` 管穿、`across` 管越）。 |
| `along` | 0 | 🟡 | 「沿着街走」可说 `on the street`。 |
| `into` | 0 | 🔴 卡住 | 「走进屋里」——`in` 说不了「进入」这个动作方向。 |
| `without` | 0 | 🟡 | 「没带伞」可用 `I don't have an umbrella` 绕。 |
| `beside`/`above`/`below`/`except`/`instead` | 0 | 🟡 ～ ⚪ | L79–L81 已给 `next to`/`in front of`/`behind`/`between`，同族能顶。 |

#### C 类：动词 `to` 轴空位 —— 🔴 卡住（语法缺口）

| 项 | GL | 严重度 | 为什么卡 |
|---|---|---|---|
| `try` | 0 | 🔴 卡住 | `try to help`——零基础第一周就会用。0 处。 |
| `learn` | 0（`learned` 仅 1 处 L118） | 🔴 卡住 | 「学英语」是这门课**自身主题**，居然没有 `learn`。 |
| `decide` | 0 | 🔴 卡住 | `decide to go`。 |
| `hope` | 0 | 🔴 卡住 | `I hope to see you`——日常告别语。 |
| `begin`/`start` | `begin` 0；`start` 7（全在 L57 讲日期） | 🟡 | `start` 勉强有，`begin` 可延后。 |
| `remember`/`forget` | `remember` 0；`forget` 12 | 🔴 | 「记得/忘了」对举，只教一半；L37 已把 `forget` 用作从句引子（`I forget where he is`），**同位置缺 `remember`**。 |
| `hold`/`stand`/`fall`/`hurt` | 0 | 🟡 | 有替代（`have`/`is`/`go down`/`pain`）。 |
| `smile`/`laugh`/`cry` | 0 | 🟡 | L126 讲了 `look tired`／`face red`，情绪靠形容词能顶。 |
| `become`/`grow`/`understand`/`believe` | 0 | ⚪ T2 | A2 层，可延后。 |
| `share`/`borrow`/`lend`/`send`/`receive` | 0 | 🟡 | `give`（63）＋`take`（168）能顶大部分。 |
| `drive`/`ride`/`sell` | 0 | 🟡 | `go by car`／`take the bus`／`buy` 能顶。 |
| `pay`/`spend` | 0 | 🟡 | `buy` 能顶。 |
| `teach`/`follow`/`pick`/`drop`/`throw`/`build`/`cut`/`touch` | 0 | ⚪ T2 | 场景窄，可延后。 |
| `wake`（及 `wake up`） | 0 | 🔴 卡住 | 「起床」是每日流程第一句；`get up` 有 37 处（L16）算部分覆盖，但**`wake up` 是独立高频短语，0 处**。 |
| `spell`/`repeat`/`wonder` | 0 | ⚪ T2 | — |

#### D 类：身体部位 —— 🟡 能绕开

| 项 | GL | 严重度 | 说明 |
|---|---|---|---|
| `head`/`eye`/`ear`/`nose`/`mouth`/`tooth`/`arm`/`leg`/`finger`/`body`/`heart` | 全 0 | 🟡 | 已有 `hand` 2／`hands` 57／`face` 1／`back` 2／`foot` 3／`feet` 2——**「半张脸」的典型**：身体词族只教了 4-5 个。L126 `Is my face red?` 是小美唯一一次提到身体部位。 |

#### E 类：家庭成员 —— 🔴 卡住（`father` 单项）

| 项 | GL | 严重度 | 说明 |
|---|---|---|---|
| `father` | 0 | 🔴 | `mother` 3／`mom` 126／`dad` 16 都有，**`father` 0**。介绍家庭成员时无词。 |
| `parents` | 0 | 🔴 | 「父母」是最高频家庭成员统称，无替代。 |
| `uncle`/`aunt` | 0 | 🔴（中国语境） | **中国家庭必说**（叔叔/舅舅/姑姑/姨），且 HC 有残留（案里出现 3／5 次）说明场景已存在、只是课里没教。 |
| `son`/`daughter`/`husband`/`wife` | 0 | 🟡 | 可绕（`my child`／`my boy`），但零基础教材通常都教。 |
| `baby`/`kid` | 0 | 🟡 | — |
| `grandfather`/`grandmother` | 0 | 🟡 | `grandma` 99／`grandpa` 15 已覆盖口语位。 |
| `neighbor` | 0 | ⚪ | — |

#### F 类：食物与餐具 —— 🟡 能绕开（个别 🔴）

| 项 | GL | 严重度 | 说明 |
|---|---|---|---|
| `rice` | 0（HC 1） | 🔴（中国语境） | **「米饭」是中国餐桌第一词，0 处。** 而 `noodles` 有 49 处——「面条有、米饭没有」是不对称。 |
| `fruit`/`vegetable`/`meat` | 0/0/0 | 🟡 | 可说具体食物绕。 |
| `beef`/`pork`/`chicken`（GL 0/0/0，chicken HC=2） | — | 🟡 | `noodles`/`egg`/`fish` 已够日常。 |
| `chopsticks` | 0 | 🟡 | 中国主题线里本该有一处。 |
| `plate`/`glass`/`spoon`/`fork`/`knife` | 0 | 🟡 | `cup` 188／`bowl` HC 1；餐具是词汇线典型内容。 |
| `delicious`/`sweet`/`sour` | 0 | 🟡 | `good` 606／`nice` 253 能顶。 |
| `snack`/`meal`/`dish`/`menu` | 0 | ⚪ | — |

#### G 类：时间 —— 🟡（个别 🔴）

| 项 | GL | 严重度 | 说明 |
|---|---|---|---|
| `evening` | 0 | 🔴 | `morning` 12／`afternoon` 3／`night` 63 都有，**`evening` 0**——「早上/下午/晚上」三段里缺一段，且课程有「小美的一天」主题，晚间场景必然出现。 |
| 星期 `Tuesday`/`Wednesday`/`Thursday`/`Saturday` | 0 | 🔴 | `Monday` 24／`Friday` 11／`Sunday` 11——**七天只教了三天**。说「周三」直接卡死。 |
| `weeks`/`years`（复数形） | 0 | 🟡 | `week` 40／`year` 5 有单数；L155 已专门讲「数着说要加 s」（L29992），复数形缺失是执行遗漏。 |
| `seconds`/`midnight`/`moment`/`future`/`recently` | 0 | ⚪ | — |
| `noon` 1／`tonight` 2 | — | ⚪ | 已在。 |

#### H 类：天气 —— 🟡

| 项 | GL | 严重度 | 说明 |
|---|---|---|---|
| `cool` | 0 | 🟡 | L88 讲了 `windy/snowy/cloudy`，`warm` 9 有，`cool` 0。 |
| `foggy`/`storm`/`sunshine`/`temperature` | 0 | ⚪ | — |
| `dry` | 0 | 🟡 | `wet` 1 有、`dry` 0。 |

#### I 类：颜色 —— 🔴 卡住（整片）

| 项 | GL | 严重度 | 说明 |
|---|---|---|---|
| `yellow`/`black`/`pink`/`brown`/`purple`/`grey`/`gray` | 全 0 | 🔴 | 已教只有 `red` 4／`blue` 2／`white` 4／`green` 1／`orange` 1，且全是**顺带出现在别的课里**（L3 例句、L8 练习、L126 对白），**没有任何一课教颜色**。颜色是零基础第一课的标配词族——「这个东西是什么颜色」是最早的表达需求之一。 |

#### J 类：数字 —— 🔴 卡住（`twelve`/`twenty` 单项）

| 项 | GL | 严重度 | 说明 |
|---|---|---|---|
| `twelve` | 0 | 🔴 | 报时间「12 点」直接卡；`eleven` GL=1 也是勉强。 |
| `twenty`/`thirty` | 0 | 🔴 | 报年龄「我妈三十多岁」/报价格直接卡。 |
| `hundred` | 0 | 🟡 | 「一百」—可绕。 |
| `thousand`/`million`/`zero` | 0 | ⚪ | — |
| `one`–`ten` | 均有（`four` 4／`five` 7／`seven` 3／`nine` 7 偏低） | 🟡 | 覆盖但分布很薄。 |
| `pair`/`piece`/`bit`/`dozen`/`slice`/`bottle` | 0 | 🟡 | 量词是词汇线内容。 |

#### K 类：学校与工作 —— 🟡

| 项 | GL | 严重度 | 说明 |
|---|---|---|---|
| `pencil` | 0 | 🔴（校园线） | `pen` 30／`book` 577／`desk` 120 都有，`pencil` 0——校园主题线里最刺眼的一条。 |
| `subject`/`Chinese`/`exam`/`grade` | 0 | 🟡 | 「我最喜欢的科目是语文」是中国学生必说句，但可绕。 |
| `office`/`job`/`worker`/`driver`/`police`/`farmer`/`engineer`/`boss` | 0 | 🟡～⚪ | 职业词族，词汇线内容。 |

#### L 类：家居物品 —— 🟡

| 项 | GL | 严重度 |
|---|---|---|
| `bedroom`/`bathroom`/`kitchen`（6 有）/`sofa`/`computer`/`garden`/`yard`/`stairs`/`mirror` | 全 0 | 🟡 房间名靠 `home` 302／`room` 24 能顶大部分 |

#### M 类：交通与地点 —— 🟡（个别 🔴）

| 项 | GL | 严重度 | 说明 |
|---|---|---|---|
| `road`/`street` | 0 | 🔴 | 「过马路」场景必备，`way` 38（但 32 处在 L179 讲 `Shall we`）不能顶。 |
| `ticket` | 0 | 🟡 | — |
| `plane`/`subway`/`bicycle` | 0 | 🟡 | `bus` 78／`bike` 84／`train` 6／`taxi` 1 已覆盖主要交通。 |
| `place`/`country`/`world`/`village` | 0 | 🟡 | `city` 49 有。 |
| `mountain`（HC 1）/`hill`/`field`/`farm` | 0 | ⚪ | 场景窄。 |

#### N 类：衣服穿戴 —— 🟡

| 项 | GL | 严重度 |
|---|---|---|
| `shirt`/`skirt`/`pants`/`socks`/`jacket`/`sweater`/`shoe`/`shoes`/`dress`/`size`/`pocket`/`clothes` | 全 0 | 🟡 衣物是词汇线典型内容；`hat` 30／`glasses` 85／`umbrella` 59 已有，缺口不影响主线表达 |

#### O 类：自然与动物 —— 🟡～⚪

| 项 | GL | 严重度 |
|---|---|---|
| `moon`/`star`/`mountain`/`animal`/`horse`/`pig`/`cow`/`rabbit`/`grass`/`sand`/`leaf`/`fire`/`earth`/`world`/`nature` | 全 0 | 🟡～⚪；`tree` 6／`flower` 25／`cat` 76／`dog` 7／`bird` 40／`sky` 45 已有，动物场景能撑 |

#### P 类：情感与态度 —— 🔴（`sad` 单项）

| 项 | GL | 严重度 | 说明 |
|---|---|---|---|
| `sad` | 0 | 🔴 | `happy` 163／`angry` HC 2／`tired` 171／`excited` 7／`bored` 62 都有，**`sad` 0**。「开心」有词、「难过」没词——情绪表达只有一半。 |
| `fine` | 0 | 🔴 | 「I'm fine」是最早的应答语之一，0 处。 |
| `afraid`/`nervous`/`worried`/`surprised`/`proud`/`shy` | 0 | 🟡 | 有替代（`not happy`／`scared`）。 |
| `lucky`/`safe`/`polite`/`honest`/`brave`/`lazy`/`clever`/`serious`/`calm`/`lonely` | 0 | ⚪ T2 | — |

#### Q 类：社交用语 —— 🔴 卡住（整片）

| 项 | GL | 严重度 | 说明 |
|---|---|---|---|
| `hello` | 0 | 🔴🔴 | 全库唯一问候语是 `Hi!`（L1，1 处）。**`hello` 是零基础第一个词，188 课没有。** |
| `thank you` | 0 | 🔴🔴 | `thanks` 11 全在「婉拒」语境（L70 `No, thanks`），**致谢义 0**。 |
| `excuse me` | 0 | 🔴 | 「借过／打扰一下」——零基础生存句。 |
| `welcome`（作「欢迎」教） | 0（HC 3） | 🟡 | 案里出现 3 次说明场景已有。 |
| `okay`/`yeah`/`bye`/`hey` | 0 | ⚪ | 可不说（`goodbye` 20 已覆盖 `bye`）。 |
| `good night`/`nice to meet you`/`you're welcome` | 0 | 🟡 | 「不客气」的应答缺口最真实。 |

#### R 类：程度与频度 —— 🟡

| 项 | GL | 严重度 | 说明 |
|---|---|---|---|
| `different` | 0 | 🔴 | `same` 2 有、`different` 0——「一样/不一样」只教一半。 |
| `important` | 0 | 🟡 | — |
| `quite`/`maybe`/`even`/`less`/`such`/`least` | 0 | 🟡 | `very` 103／`really` 3／`too` 423／`enough` 83 已覆盖主要程度表达。 |
| `pretty`/`hardly`/`nearly`/`exactly`/`probably`/`perhaps`/`certainly` | 0 | ⚪ T2 | — |

#### S 类：常用形容词 —— 🔴（前 8 项）

| 项 | GL | 严重度 | 说明 |
|---|---|---|---|
| `slow` | 0 | 🔴 | `fast` 26 有、`slow` 0（L58 讲副词时提过 `slowly`，但形容词本体 0）。 |
| `young` | 0 | 🔴 | `old` 21 有、`young` 0——「老/少」对举缺一半。 |
| `dirty` | 0 | 🔴 | `clean` 25 有、`dirty` 0——「干净/脏」缺一半。 |
| `difficult` | 0 | 🟡 | `easy` 5 有、`difficult` 0；`hard` 7 能顶。 |
| `high`/`low` | 0 | 🟡 | `tall` 94 能顶一部分。 |
| `weak` | 0 | 🟡 | `strong` 27 有、`weak` 0。 |
| `cheap`/`expensive` | 0 | 🟡 | `money` 10／`price` 0；买东西场景必然用到。 |
| `famous`/`popular`/`possible`/`real`/`sudden`/`clear`/`soft`/`round`/`thin`/`wide`/`deep`/`ugly`/`healthy`/`dangerous` | 0 | ⚪ T2 | A2 层。 |

#### T 类：高频名词 —— 🟡

| 项 | GL | 严重度 | 说明 |
|---|---|---|---|
| `price`/`reason`/`chance`/`mistake`/`surprise`/`trouble`/`health`/`holiday`/`present`/`sport`/`life`/`news`/`woman` | 0 | 🟡 | 有替代；`woman` 0 但 `man` 2／`boy` 101／`girl` 10——仍是「半张脸」。 |
| `place`/`world`/`country` | 0 | 🟡 | — |

### 2.3 严重度小结（一句话）

**会卡住用户的 55 项，全部集中在「同一语法家族的缺格」上**：物主词缺 `their`、位置介词缺 `through/around/into`、`to` 轴缺 `try/learn/decide/hope`、颜色整族缺、星期缺 4 天、亲属缺 `father/parents`、情绪缺 `sad/fine`、问候缺 `hello/thank you`。**它们全都是「已经教了同族的一半、另一边不见了」——不是随机遗漏，是系统性不对称。**

---

## §3 与已教内容的接口（逐项判定：语法缺口 vs 词汇缺口）

### 3.0 判定标准

本线是**语法线**（教结构），不是词汇线。判定口径：

| 判定 | 定义 | 处置 |
|---|---|---|
| **语法缺口** | 该词是**某个已教语法槽位的一个格**——已教同槽位的其他格，缺这一格会让学习者**类推失败或说出错句** | **能撑课**，可作新一课或对照卡 |
| **词汇缺口** | 该词是**内容词**，换掉它不改变句子结构 | 登记词汇线待办 |

### 3.1 判定结果：语法缺口 8 项（能撑课）

#### 缺口 1 —— **物主词第三档 `their` / `theirs`** ⭐ 本轮最强

**接口课**：`L8 物主词 my / her`（`id: "lesson-08-my"`，L1442–L1630）

**逐字证据（三处清单都漏了 `their`）**：

| 行号 | 逐字 | 问题 |
|---|---|---|
| **L1460** | `oneLineRule: "my / your / his / her 是小标签，永远贴在东西或人的前面：my friend、his bag。"` | 清单 **my/your/his/her** —— 缺 `their` |
| **L1525** | `"同一套标签还有 your（你的）、his（他的）、her（她的）。第 2 课的 he / she 管主角位，他们的标签位就是 his / her。"` | 列举 **your/his/her** —— 缺 `their` |
| **L1530** | `rule: "my / your / his / her 是小标签，永远贴在东西或人的前面。"` | 同一清单 —— 缺 `their` |

**为什么这是语法缺口（不是词汇缺口）**：
1. **L7 已经教了 `they`**（`lesson-07-we`，L1254；L1271 逐字：`"你们、我们、他们都是「一伙的」，搭档都用 are：You are、We are、They are。"`）——**「他们」这个主角位已经有了**。
2. **L8 同一课的 `oneLineRule`（L1460）本身就在讲「这套标签」**，且 deepDive（L1525）明确说「第 2 课的 he / she 管主角位，他们的标签位就是 his / her」——**这是「主角位→标签位」的成套映射**，`they → their` 是这张表的第三行，**不是新结构，是同一张表的一格**。
3. **`my/your/his/her` 是 1113/145/24/110 的高频**，学习者必然内化「这张表」，一旦要指「他们的」就必然类推——**类推到空位，直接卡死**。
4. **对照 `hers` 有 18 处 / `yours` 21 处 / `mine` 176 处**，即长版（独立版）已经教了 3/4 格，`theirs` 是第 4 格。L33 的 deepDive 逐字（**L6217**）：`"一家人都这样：your/yours、her/hers、our/ours——带 s 的那个独立用，不带的贴名词。"` ——**这条清单同样停在 `our/ours`，把 `their/theirs` 漏掉了**。

**⇒ 判定：`their` ＋ `theirs` = 语法缺口，且是本轮唯一「三处已教清单都在等它」的项。** 挂靠点：L8（贴名词版）＋ L33（独立版）／L112（长版短版）。

#### 缺口 2 —— **位置介词同族缺员 `through` / `around` / `across` / `along` / `into`**

**接口课**：`L18 在哪儿 · in / on / at`（`id: "lesson-18-preposition"`，L3315–L3503）
＋ `L79–L81 位置词三课`（`next to` / `in front of`＋`behind` / `between`）

**逐字证据（课程自己承认这是「一家人」）**：

| 行号 | 逐字 |
|---|---|
| **L3333** | `oneLineRule: "「在哪」和「什么时候」都靠三个小词：in（里面 / 大块时间）、on（上面 / 某一天）、at（某一点）。"` |
| **L3402** | `rule: "地方和时间都靠小词：in 里面 / 大块时间，on 上面 / 某天，at 点位。"` |
| **L14932** | `oneLineRule: "说「紧挨着」用 next to——两个词一起住（to 不能丢）；它和第 18 课的 in/on/at 是一家人，都是说位置的。"` |
| **L15128** | `oneLineRule: "说「在前面」用 in front of、「在后面」用 behind——一对好搭档：一个脸朝那边，一个背朝那边。"` |
| **L15324** | `oneLineRule: "说「在中间」用 between——两头都要点名，中间用 and 牵起来（between Tom and Amy）。"` |

**为什么是语法缺口**：课程**已经用两课专门教「位置词家族」**（L79–L81），并明说「和第 18 课的 in/on/at 是一家人」（L14932 逐字）。家族成员已教：`in`/`on`/`at`/`next to`/`in front of`/`behind`/`between`/`under`(26)/`near`(29)。**缺的 `through`/`around`/`into`/`across`/`along` 不是新结构，是同一张家族名册的空行。**

**⇒ 判定：`through`/`around`/`into`/`across`/`along` = 语法缺口（介词家族补员）。** 挂靠点：L79–L81 位置词家族的延伸课（season-13 已 8 课，可在同一季内扩容）。

#### 缺口 3 —— **`to` 轴动词空位 `try` / `learn` / `decide` / `hope`**

**接口课**：`L15 want to + 原样`（`id: "lesson-15-want-to"`，L2756–L2940）
已扩轴：`L44 go … to buy`（小垫板目的用法）、`L160 seem to`、`L161 need to`、`L173 in order to`、`L174 be able to`

**逐字证据（这同一条 `to` 轴的完整课程链）**：

| 课 | 行号 | 逐字 |
|---|---|---|
| L15 | **L2774** | `oneLineRule: "「想做……」= want to + 原样：I want to travel。want 后面要垫一块小垫板 to。"` |
| L15 | **L2844** | `rule: "想做……= want to + 原样，to 这块小垫板不能丢。"` |
| L44 | **L8189** | `oneLineRule: "两个动作要垫板才缝得上：go to the shop「to buy」milk——到地方垫一块 to（带路），去做什么再垫一块 to（说明目的）。"` |
| L44 | **L8260** | `rule: "两个动作用垫板缝：go to the shop【to buy】milk——第一块带路，第二块说去干嘛。"` |
| L160 | — | `oneLineRule: "说「好像」用 seem，后面请 to 垫一下——He seems to know you（他好像认识你）。to 后面那个动作穿原样：to know，不换形状。"` |
| L161 | — | `oneLineRule: "说「需要」用 need，后面请 to 垫一下——I need to buy some milk（我需要买点牛奶）。"` |
| L173 | — | `oneLineRule: "说「为了」用 in order to——I got up early in order to catch the bus（为了赶上那班车，我起得很早）。它和第 44 课那块小垫板 to 是一家人。"` |
| L174 | — | `oneLineRule: "说「能」除了 can，还有 be able to——I am able to go there myself now（我现在能自己去了）。"` |

**为什么是语法缺口**：这条 `to` 轴**已经开了 5 课**（L15／L44／L160／L161／L173），课程自己用「小垫板」「一家人」的比喻把 `want to`／`go to … to`／`seem to`／`need to`／`in order to`／`be able to` 串成一条线。`try to`／`learn to`／`decide to`／`hope to` **是同一条轴的同一个槽位**——零基础学习者的实际使用频率甚至高于 `seem to`（GL=32）和 `in order to`（GL=86）。

**⇒ 判定：`try`/`learn`/`decide`/`hope`（+ `remember to`，与已教 L37 `forget` 对举）= 语法缺口（`to` 轴补员）。** 挂靠点：L15 轴延伸（可并成一课「还想做：try / learn / decide / hope + to」）。

#### 缺口 4 —— **物主词 `its` 的正用（当前只有反面）**

**接口课**：`L87 合体 It's`（`id: "lesson-87-its-cold"`，L16484–L16679）

**逐字证据**：

| 行号 | 逐字 |
|---|---|
| **L16570** | `"那一小撇很重要：It's 是「它是」的短版，Its 是「它的」——读起来一样，写法差一小撇，意思差一条街。写的时候记得把尾巴带上。"` |
| **L16579** | `"Its ❌ —— 少一小撇就成了「它的」"` |
| L16588 | `options: ["It's", "Its", "It"]` |
| L16611 | `wrongToken: "Its"` |
| L16639／L16652／L16665／L16848／L18004／L18410 | `distractors: ["Its"]` |

**为什么是语法缺口**：L87 的讲解**已经点明了「Its 是『它的』」**（L16570 逐字），但整课的练习设计只把 `Its` 当**错误选项**用（`wrongToken`／`distractors` 共 8 处）。**学习者被反复告知「Its 是错的」，却从没被给过一个「Its 是对的」的句子。** 这是同一课里的**教学缺口**——不是词不认识，是**槽位有正反两面，只教了反面**。

**⇒ 判定：`its`（正确用法）= 语法缺口（L87 同课补正面）。** 最小改动：L87 加一条对照卡或一个正例句。

#### 缺口 5 —— **颜色整族（作为语法课：形容词作表语/定语）**

**接口课**：`L88 名词穿外套 · windy / snowy / cloudy`（`id: "lesson-88-its-windy"`，L16680–L16875）
＋ `L17 比一比 · -er / more`（颜色是 `-er` 比较的最自然载体）

**逐字证据**：

| 行号 | 逐字 |
|---|---|
| **L16697** | `oneLineRule: "名词穿上一件 -y 外套，就变成「…的」：wind→windy（刮风的）、snow→snowy（下雪的）、cloud→cloudy（多云的）。"` |
| **L16771** | `rule: "名词穿 -y 外套变成「…的」：wind→windy、snow→snowy、cloud→cloudy。"` |

**为什么算语法缺口（而非纯词汇）**：L88 教的**不是天气词，是「形容词怎么用」这个结构**（`It's + 形容词` / 形容词作表语）。颜色词是**同一结构的第二组填充物**——`The bag is red.` 用的是 L88 的同一个槽位。当前 `red`(4)/`blue`(2)/`white`(4) 全是**在别的课的例句里顺带出现**（L3 `I have a red cup.`、L8 `His cup is red.`、L126 `Is my face red?`），**没有任何一课以颜色作为教学点**。

**⇒ 判定：颜色词族 = 语法缺口的「载体」（结构已在 L88/L17，缺的是填充物成组出现）。** 保守起见列为**语法线可做、但优先级低于 `their`/介词/`to` 轴**——因为它更接近词汇线的填充。建议：**若走语法线，做成 L88 的对照卡（形容词槽位的第二组填充）；若不做，登记词汇线。**

#### 缺口 6 —— **`remember` 与已教 `forget` 对举**

**接口课**：`L37 话中话 · 引子可以换人`（`id: "lesson-37-…"`）

**逐字证据**：

| 行号 | 逐字 |
|---|---|
| **L6888** | `oneLineRule: "引子可以换人：I know / I think / I forget 后面都能装同一句话；里面永远是 where + 谁 + is——换鞋的老规矩不变。"` |
| **L6951** | `"说「话中话」的引子不止一个：I know（我知道）、I don't know（我不知道）、I think（我觉得）、I forget（我忘了）——后面都能装同一句话。"` |
| **L6958** | `rule: "引子（I know / I don't know / I think / I forget）+ 换好鞋的一句话：where + 谁 + is。"` |

**为什么是语法缺口**：L37 的 `oneLineRule`／`rule` 逐字把 `I forget` 列为**「引子」这个语法槽位的一个成员**（与 `I know`／`I think` 并列）。`I remember where he is` 是同一槽位的**同一个结构**，且「记得/忘了」是天然对举——**同一张引子表的空格**。

**⇒ 判定：`remember`（作从句引子）= 语法缺口（L37 引子表补员）。** 可合并进缺口 3 的 `to` 轴课（`remember to do`），一箭双雕。

#### 缺口 7 —— **`sad` / `fine` 与已教情绪/应答结构对举**

**接口课**：`L1 be 动词 · I am`（`id: "lesson-01-am"`，L138 起；L187 逐字 `{ en: "I am happy.", zh: "我很开心。" }`）

**逐字证据**：

| 行号 | 逐字 |
|---|---|
| **L169** | `oneLineRule: "英语说「我是谁」，am 不能丢。I am 是一对固定搭档，说「我是……」它们就一起出场。"` |
| **L187** | `{ en: "I am happy.", zh: "我很开心。" }`（L1 examples） |
| — | `happy` GL=163、`tired` 171、`bored` 62——**`I am + 情绪形容词` 这个槽位已经非常饱和** |
| — | 但 `sad`=0、`fine`=0 |

**为什么是语法缺口（弱）**：`I am + 形容词` 的**结构**已在 L1 立好；`sad`/`fine` 是同一槽位的填充物。**且 `I'm fine.` 是英语世界最高频的应答句之一**，`How are you?`／`I'm fine` 配对在 L27（`how are you` 6 处）已有场景。

**⇒ 判定：`sad`/`fine` = 语法缺口（弱）／词汇缺口（强）的边界项。** 保守判为**词汇缺口**（结构不缺，只是词缺）——除非要做「情绪词"成组立岗"专题课。

#### 缺口 8 —— **`wake (up)` 与已教 `get up` 的接口**

**接口课**：`L16 必须 · must / have to`（`id: "lesson-16-must"`）

**逐字证据**：

| 行号 | 逐字 |
|---|---|
| **L2963** | `{ en: "I have to get up early.", zh: "我不得不早起。" }` |
| **L2991** | `wrong: "She have to get up early."` |
| **L3022** | `"意思很近，口气不同：must 多是「自己要求自己，或规矩要求」——I must study（我要学）；have to 多是「外面的情况逼着你」——I have to get up early（不得不早起）。"` |

**为什么是语法缺口（弱）**：`get up`（GL=37）已教，「起床」这个概念已覆盖。`wake up` 是**另一个高频搭配**（`wake` 0 处）——属词汇缺口而非结构缺口，因为「起床」的表达需求已被 `get up` 满足。

**⇒ 判定：`wake (up)` = 词汇缺口。** 本轮判定**不是**语法缺口（尽管主理人原清单把它放在「基础动词」里）。

### 3.2 判定结果：词汇缺口（不属语法线）

以下项**结构上无新东西**，纯内容词——登记词汇线待办：

| 类别 | 项数 | 代表项 |
|---|---|---|
| 身体部位 | 32 | `head`/`eye`/`ear`/`nose`/`mouth`/`tooth`/`arm`/`leg`/`finger`/`body`/`heart`/`stomach`/`neck`/`shoulder`/`knee`/`skin`/`voice` |
| 食物饮品 | 39 | `rice`/`noodle`/`fruit`/`vegetable`/`meat`/`beef`/`pork`/`sugar`/`salt`/`delicious`/`sweet`/`sour`/`snack`/`meal`/`dish`/`plate`/`glass`/`chopsticks`/`spoon`/`fork`/`knife`/`menu` |
| 家居物品 | 27 | `bedroom`/`bathroom`/`sofa`/`computer`/`garden`/`yard`/`stairs`/`mirror`/`towel`/`soap`/`blanket`/`pillow`/`closet`/`curtain`/`toilet`/`shower`/`sink` |
| 衣服穿戴 | 22 | `shirt`/`skirt`/`pants`/`socks`/`jacket`/`sweater`/`shoe`/`dress`/`size`/`pocket`/`clothes`/`put on`/`take off`/`try on` |
| 自然与动物 | 42 | `moon`/`star`/`mountain`/`animal`/`horse`/`pig`/`cow`/`rabbit`/`grass`/`sand`/`leaf`/`fire`/`earth`/`world`/`nature`/`duck`/`sheep`/`snake`/`elephant`/`bear`/`bee`/`plant`/`wood` |
| 交通与地点 | 22 | `road`/`street`/`ticket`/`plane`/`subway`/`bicycle`/`bridge`/`place`/`country`/`village`/`museum`/`hospital`/`store`/`restaurant`/`hotel`/`church`/`hill`/`valley` |
| 学校与工作 | 22 | `pencil`/`subject`/`Chinese`/`office`/`job`/`worker`/`driver`/`police`/`farmer`/`engineer`/`boss`/`manager`/`waiter`/`artist`/`writer`/`scientist`/`lawyer`/`college`/`grade`/`score` |
| 家庭成员 | 14 | `father`/`parents`/`grandfather`/`grandmother`/`son`/`daughter`/`husband`/`wife`/`baby`/`kid`/`neighbor`/`relative`/`twins` |
| 数字与量 | 20 | `twelve`/`twenty`/`thirty`/`hundred`/`thousand`/`million`/`zero`/`pair`/`piece`/`bit`/`slice`/`bottle`/`kilo`/`meter`/`dozen` |
| 时间（残余） | 5 | `weeks`/`years`（复数形）/`seconds`/`midnight`/`recently`/`moment`/`future` |
| 程度与频度 | 20 | `quite`/`maybe`/`even`/`less`/`least`/`such`/`pretty`/`hardly`/`nearly`/`exactly`/`probably`/`perhaps`/`certainly` |
| 常用形容词 | 62 | 见 §2.2 S 类 |
| 高频名词 | 39 | `price`/`reason`/`chance`/`mistake`/`surprise`/`trouble`/`health`/`holiday`/`present`/`sport`/`life`/`news`/`woman` |
| 社交用语（纯语用） | 12 | `hello`/`hey`/`bye`/`thank you`/`okay`/`yeah`/`nope`/`excuse me`/`pardon`/`good night`/`nice to meet you`/`you're welcome` |
| 手部动词 | 45 | `hold`/`stand`/`fall`/`hurt`/`smile`/`laugh`/`cry`/`share`/`borrow`/`lend`/`send`/`receive`/`join`/`hurry`/`teach`/`follow`/`pick`/`drop`/`throw`/`build`/`cut`/`touch`/`drive`/`ride`/`sell`/`pay`/`spend` |

### 3.3 社交用语的特殊判定（`hello` / `thank you` / `excuse me`）

主理人猜测「`thank you`／`hello` 可能属词汇线」——**本轮判为「界线项，建议按语用课做，而非纯词汇」**，理由：

1. **本线已有 10 课以上的语用课**（不是纯语法线）：`L32 祈使句`（`please`，GL=95）、`L61 Could you…?`（GL=59）、`L62 would like`、`L69 Would you mind…?`、`L70 Would you like…? + Yes, please / No, thanks`、`L74 Let me / help`、`L75 Let's`、`L168 Why don't you…?`、`L179 Shall we…?`
2. **L70 这条课的 grammarLabel 逐字是**：`"提供 · Would you like…? + Yes, please / No, thanks"`（L13171）——**它已经是一课「应答语块」教学**，但**只教了婉拒（`No, thanks`），没教致谢（`Thank you`）**。
3. **⇒ 语用课的「空位」是真实存在的**：要说的不是「`thank you` 这个词」，而是「**接受/致谢/致歉/招呼**这四组交际语块」——这与 L70 的「应答成对记」是同一个教学设计。

**⇒ 判定：`hello`／`thank you`／`excuse me`／`you're welcome` = 语用课的语法/语用缺口（可做），但优先级排在 §3.1 的 1–3 号之后。**

---

## §4 结论与建议

### 4.1 该做（语法缺口，能撑课）—— 按优先级

| 序 | 缺口 | 挂靠点（逐字行号） | 可撑几课 | 用户卡点强度 | 建议 |
|---|---|---|---|---|---|
| **P1** | **`their` / `theirs`** | L8 `my/your/his/her`（L1460／L1530 清单）＋ L33 `your/yours、her/hers、our/ours`（L6217）＋ L112 长版短版（L21345） | **1 课**（或 L8 对照卡 + L33 对照卡 2 张） | 🔴🔴 **最高** | **做**。这是唯一「三处已教清单都在等它」的项，改动面最小（补格）、收益最大（消除类推失败） |
| **P2** | **⚠️ 零术语红线冲突：`through` / `around` / `into` / `across` / `along`** | L18 `in/on/at`（L3333／L3402）＋ L79–L81 位置词家族（L14932 逐字「和第 18 课的 in/on/at 是一家人」） | **1–2 课** | 🔴 高 | **做，但注意**：零术语词表第 23 项**就是「介词」**（`grammarZeroTerms.ts` L23）。本线现有做法是**说「小词」不说「介词」**（L3333／L15128 逐字全用「小词」）。新课文案必须沿用「小词」 |
| **P3** | **`try` / `learn` / `decide` / `hope` + `to`**（可并 `remember to`） | L15 `want to + 原样`（L2774／L2844）＋ L44（L8189／L8260）＋ L160 `seem to` ＋ L161 `need to` ＋ L173 `in order to` ＋ L174 `be able to` | **1 课** | 🔴 高 | **做**。这条轴已开 5 课，语料与讲解范式（「小垫板 to」「动作穿原样」）全部现成，几乎零设计成本 |
| **P4** | **`its`（正确用法）** | L87 `It's vs Its`（L16570 逐字已点明「Its 是『它的』」，但 8 处全用作 `wrongToken`/`distractors`） | **对照卡 1 张**（不需整课） | 🔴 高 | **做，最小改动**。L87 加 1 条正例（如 `The cat likes its box.`）＋ 1 条 contrast 即可。**注意 contrast 必须恰好 6 条** |
| **P5** | **`remember`（从句引子位）** | L37 `I know / I don't know / I think / I forget`（L6888／L6951／L6958 逐字） | **并入 P3 或 L37 对照卡** | 🟡 | **做（低成本）**。与 `forget` 对举，L37 引子表补一行 |
| **P6** | **颜色词族 + L88 形容词槽位** | L88 `-y 外套`（L16697／L16771）＋ L17 `-er / more` | **1 课或 L88 对照卡** | 🔴 高（词族整片缺） | **建议做**（但更接近词汇线）。若不做，登记词汇线 |
| **P7** | **`hello` / `thank you` / `excuse me` / `you're welcome`（语用块）** | L70 `Would you like…? + Yes, please / No, thanks`（L13171）；全库 `thanks` 11 处**全在婉拒语境** | **1 课**（交际语块四组） | 🔴🔴 高 | **建议做**。但它是**语用课**不是语法课——若主理人认为本线不做语用，则转词汇线 |
| **P8** | **`sad` / `fine`** | L1 `I am happy.`（L187）——`I am + 情绪` 槽位已饱和（`happy` 163／`tired` 171／`bored` 62） | 对照卡 | 🟡 | **可不做**（结构不缺）→ 归词汇线 |

**⚠️ 结构约束（硬）**：
- **不能新建小季**：现有 ≤3 课小季恰好 3 个（season-6／12／19，各 3 课），`grammarSeasons.test.ts` 第 45–61 行守门「上限 3」。
- **若上述 6 课全做**：建议**并入 season-28**（现 182–188 共 7 课 → 扩为 13 课）或**新开一个 ≥6 课的大季**（≥6 课不触发小季断言）。
- 每课 `contrast` **恰好 6 条**（188/188 实测）；目标句 ≤8 词（非收口课口径）。

### 4.2 该登记为词汇线待办（不属语法线）

**共约 308 项**（316 项 T1 核心层扣除 §4.1 的 8 项语法缺口）。分三档：

| 档 | 项数 | 内容 | 建议 |
|---|---|---|---|
| **V1 生活必需** | 约 90 | 身体部位（`head`/`eye`/`ear`/`nose`/`mouth`/`tooth`/`arm`/`leg`/`finger`/`body`/`heart`…）／食物（`rice`/`noodle`/`fruit`/`vegetable`/`plate`/`glass`/`chopsticks`…）／衣服（`shirt`/`skirt`/`pants`/`socks`/`shoe`…）／家居（`bedroom`/`bathroom`/`sofa`/`computer`…）／亲属（`father`/`parents`/`uncle`/`aunt`/`son`/`daughter`…）／星期缺 4 天／数字（`twelve`/`twenty`/`thirty`） | **词汇线 P0**——这些是「活人每天要说」的词 |
| **V2 场景词** | 约 100 | 交通地点／学校工作／自然动物／量词（`pair`/`piece`/`bottle`）／程度频度（`quite`/`maybe`/`even`） | **词汇线 P1** |
| **V3 拓展词** | 约 118 | 手部动词 45 项／A2 形容词／抽象名词 | **词汇线 P2** |

**词汇线专项建议**（不在本轮范围，仅提示）：`prd-vocab-library-2026-09-13.md` 与 `prd-wordbook-v2-2026-09-13.md` 是现有词库/词书线文档。**建议把 316 项做一次「A0/A1 地基完整度」对照，而不是塞进现有词书单元**——因为本轮的发现是「**同族缺格**」，不是「总量不足」。

### 4.3 优先级排序（一句话版）

```
P1  their / theirs         —— 三处已教清单等它，补格，最小改动最大收益（1 课）
P2  through/around/into/across/along —— 位置词家族补员（1–2 课，文案必须说「小词」）
P3  try/learn/decide/hope + to —— to 轴补员，范式现成（1 课，含 remember）
P4  its 正例               —— L87 同课补正面（1 张对照卡）
P5  hello/thank you/excuse me —— 交际语块（1 课，属语用；本线有 9 课语用先例）
P6  颜色词族               —— L88 形容词槽位第二组填充（1 课或对照卡；否则转词汇线）
——————————————————————————————————————————————
V0  father/parents/uncle/aunt + 星期 4 天 + 颜色 6 词 + 身体部位 32 词 + 米饭/筷子
    —— 词汇线 P0，本轮最真实的「日常卡点」
```

### 4.4 对「完成所有 B 档系列课程」这个长期目标的影响

主理人的长期目标是「完成所有 B 档系列课程」。**本轮结论：B 档（中高阶结构）确实已清空（批三十五已确认），但 A0/A1 地板有 316 个洞。**

这个组合是危险的：**学习者走完 188 课，语法结构到了 B1 水平（被动语态、让步从句、had to 都学了），但说不出「我爸爸」「周三」「蓝色的」「谢谢」「他们的」**。这不是「课程深度不足」，是**深度与地基不匹配**——越往后学，能说的结构越复杂、能说的内容越窄。

**建议**：在「B 档清空」之后、开 C 档之前，**先补一次 A0/A1 地板收口**（即 §4.1 的 6 项语法缺口 + §4.2 的词汇线 V0 批）。理由：① 补语法缺口只需 5–6 课，成本极低；② 它直接决定「用户能不能用这门课说出自己的一天」——而这正是产品名「小美的一天」的承诺。

---

## §5 未核实项

### 5.1 口径与方法未核实

| # | 项 | 说明 |
|---|---|---|
| 1 | **GL 词频含 TS 结构键** | 本报告 GL 口径与主理人一致（全文匹配）。**副作用已排查**：`answer` 2292／`explain` 1127／`kind`/`choose` 等绝大部分来自练习字段名，非教学语料。本轮对 §1 的 23 项＋§2 高危项**逐条做了结构键排查**（`its`/`sorry`/`had`/`learned`/`tried` 已归位），但**§1.3 的 533 项未逐条排查**——其中可能有 ≤5% 是「只在结构键里出现过」的假零。 |
| 2 | **`after`/`before` 的介词义未单独剥离** | L237 起每课有 `after: "happy."`（练习题空位字段），导致 `after` GL=395／`before` GL=357 **几乎全是字段名**。**真实介词义的 `after`／`before` 频次未单独统计**——但 L90／L91 已专门教 `after + 小句子`／`before + 小句子`（`lesson-90-…`／`lesson-91-…`），**介词义实际已覆盖**，故不影响本轮结论。 |
| 3 | **`choose` GL=351 是 `kind: "choose"` 字段名** | 非教学语料。真实「选择」义的 `choose` 未单独统计（但 `options`／`answer` 结构说明这是题型枚举）。 |
| 4 | **`grep` 在本机不可信** | 已全程改用 node；但**此前批次的报告若用过 `grep -oniE`，其数字需重核**（本轮 `the`/`good`/`thanks` 三个锚点与主理人一致，说明主理人也用 node）。 |
| 5 | **词边界正则不含连字符处理** | `(^|[^A-Za-z])` 不含 `-` 与 `'`。故 `thank you`／`excuse me`／`put on`／`take off`／`try on`／`wake up`／`get up` 这类**短语**的匹配是「完整短语字面匹配」，对断行的短语可能漏计。**已人工抽查**：`wake up`=0、`put on`=0、`take off`=0、`try on`=0——这些在文件里都是单行字符串，无跨行风险。 |

### 5.2 判断未核实（需主理人裁决）

| # | 项 | 我的判断 | 待裁决 |
|---|---|---|---|
| 6 | **颜色词族是否算语法缺口** | 判为「载体型缺口」——结构已在 L88（形容词槽位），缺的是填充物。**边界项**。 | 主理人裁定归语法线（L88 对照卡）还是词汇线 |
| 7 | **`hello`/`thank you`/`excuse me` 是否算语法线可做** | 判为「语用块，界线项」——**本线有 9 课语用先例**（L32/61/62/69/70/74/75/168/179），且 L70 已是「应答语块」教学 | 主理人裁定本线是否接受语用课 |
| 8 | **`sad`/`fine`** | 判为词汇缺口（`I am + 形容词` 结构不缺） | 若要做情绪专题则升为语法缺口 |
| 9 | **`wake (up)`** | 判为**词汇缺口**（`get up` 已覆盖「起床」义）——**与主理人原清单把它归「基础动词」的暗示不同** | 主理人可改判 |
| 10 | **T1/T2 分层的主观性** | 207/111 的切分依据是「中国零基础前 3 个月使用频率」——**这是经验判断，非语料库统计**。建议用 CEFR A1 官方词表或 COCA 儿童语料交叉验证 | 若要精确，需引入外部词表（本轮未做） |
| 11 | **316 项总数的不确定性** | 1126 项扫描词表是我按经验构造的（非权威表），**可能漏项**（如 `grandson`/`stepmother`/`classmate` 之外的亲属词）也可能含项偏（如 `liter`/`meter` 对零基础偏难） | 建议以权威 A1 表复核 |

### 5.3 未核实的连带影响

| # | 项 | 说明 |
|---|---|---|
| 12 | **`its` 的 17 处是否真的全部是负例** | 我逐条读了 17 处（L16484–L16848），**判定全部为 `wrong`/`wrongToken`/`distractors`/`options` 负位**，但其中 `options: ["It's", "Its", "It"]`（L16588）是**多选题选项集**——若 `Its` 曾在某题作正确答案，我的判断需修正。**未逐题核对每题答案**。 |
| 13 | **`their` 在案 37 的 token 位是否构成「已覆盖」** | 案 37 tokens 含 `their`（HC L2303），但**该案的教学点是词序/三单**（`errors` 是 `go→always goes`／`play→plays`），`their` 只是句子成分，**无讲解**。判为「未教」。 |
| 14 | **新增课是否会撞「同句 ≤6 课」红线** | `user-research-b-tier-closure-2026-09-21.md` §0.2 记录 2 句**触顶**：`Yesterday I went to the park.`（6 课）、`There is a book on the desk.`（6 课）。**新批不得再引用这两句**——本轮未逐一核验新候选句是否踩线。 |
| 15 | **`poor`/`rich`/`busy`/`free` 等未扫** | 我的 1126 项词表**未覆盖全部 A1 词**（如 `poor`/`rich`/`safe` 已扫但 `clever` 类未穷尽）。**316 是「至少」而非「恰好」**。 |
| 16 | **未做用户实测验证** | 本轮全部为**数据侧盘点**，无用户访谈／无 A/B。严重度判定（🔴/🟡/⚪）基于我作为研究员的经验判断，**未用真实用户验证「卡住」的程度**。 |

---

## 附录 A：复核与扩展扫描完整命令

```bash
# ── A1 自校（三个锚点必须与主理人一致）
cd /Users/liujun/Documents/英语听写 && node -e '
const {readFileSync}=require("fs");
const GL=readFileSync("src/data/grammarLessons.ts","utf8");
const esc=(w)=>w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
const c=(w)=>(GL.match(new RegExp(`(^|[^A-Za-z])${esc(w)}([^A-Za-z]|$)`,"gi"))??[]).length;
for(const w of ["the","good","thanks","their","hello","thank you","excuse me"]) console.log(w, c(w));
'
# → the 2764 / good 606 / thanks 11 / their 0 / hello 0 / thank you 0 / excuse me 0   ✅ 与主理人一致

# ── A2 红线复跑（contrast=6 × 188；超 8 词 6 课；小季 3 个）
cd /Users/liujun/Documents/英语听写 && node /tmp/vocabscan/stats2.js
# → contrast 分布: {"6":188} / 最长分句 >8: L173(10) L178(9) L182(10) L183(11) L184(10) L185(13)

# ── A3 物主词家族全覆盖（证明 their/theirs 是缺格）
cd /Users/liujun/Documents/英语听写 && node -e '
const {readFileSync}=require("fs");
const GL=readFileSync("src/data/grammarLessons.ts","utf8");
const esc=(w)=>w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
const c=(w)=>(GL.match(new RegExp(`(^|[^A-Za-z])${esc(w)}([^A-Za-z]|$)`,"gi"))??[]).length;
for(const w of ["my","your","his","her","our","its","their","mine","yours","hers","ours","theirs","myself","yourself","himself","herself","ourselves","yourselves","themselves"])
  console.log(w.padEnd(12), String(c(w)).padStart(5), c(w)===0?"【零】":"");
'
# → my 1113 / your 145 / his 24 / her 110 / our 14 / its 17 / **their 0**
#   mine 176 / yours 21 / hers 18 / ours 1 / **theirs 0**
#   myself 130 / yourself 18 / himself 31 / herself 56 / **ourselves 0 / yourselves 0 / themselves 0**

# ── A4 位置介词家族（证明 through/around/into 是缺员）
cd /Users/liujun/Documents/英语听写 && node -e '
const {readFileSync}=require("fs");
const GL=readFileSync("src/data/grammarLessons.ts","utf8");
const esc=(w)=>w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
const c=(w)=>(GL.match(new RegExp(`(^|[^A-Za-z])${esc(w)}([^A-Za-z]|$)`,"gi"))??[]).length;
for(const w of ["in","on","at","next to","in front of","behind","between","under","near","around","through","across","along","into","onto","beside","above","below"])
  console.log(w.padEnd(12), String(c(w)).padStart(5), c(w)===0?"【零】":"");
'
# → in 1372 / on 400 / at 800+ / next to 117 / in front of 29 / behind 64 / between 63 / under 26 / near 29
#   **around 0 / through 0 / across 0 / along 0 / into 0 / onto 0 / beside 0 / above 0 / below 0**

# ── A5 星期/颜色/亲属/身体「半张脸」扫描
cd /Users/liujun/Documents/英语听写 && node -e '
const {readFileSync}=require("fs");
const GL=readFileSync("src/data/grammarLessons.ts","utf8");
const esc=(w)=>w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
const c=(w)=>(GL.match(new RegExp(`(^|[^A-Za-z])${esc(w)}([^A-Za-z]|$)`,"gi"))??[]).length;
const G={星期:["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
颜色:["red","blue","green","yellow","black","white","pink","brown","purple","grey","orange"],
亲属:["mom","dad","mother","father","sister","brother","grandma","grandpa","uncle","aunt","parents","son","daughter","husband","wife","baby","kid"],
身体:["head","eye","ear","nose","mouth","tooth","arm","leg","finger","body","heart","hand","face","back","foot"]};
for(const [k,ws] of Object.entries(G)){ console.log("### "+k);
  ws.forEach(w=>console.log("   "+w.padEnd(11)+String(c(w)).padStart(5)+(c(w)===0?"  【零】":""))); }
'
# → 星期: Monday 24 / **Tuesday 0 / Wednesday 0 / Thursday 0** / Friday 11 / **Saturday 0** / Sunday 11
# → 颜色: red 4 / blue 2 / green 1 / **yellow 0 / black 0** / white 4 / **pink 0 / brown 0 / purple 0 / grey 0** / orange 1
# → 亲属: mom 144 / dad 26 / mother 3 / **father 0** / sister 52 / brother 183 / grandma 111 / grandpa 16 / **uncle 0 / aunt 0 / parents 0 / son 0 / daughter 0 / husband 0 / wife 0 / baby 0 / kid 0**
# → 身体: **head 0 / eye 0 / ear 0 / nose 0 / mouth 0 / tooth 0 / arm 0 / leg 0 / finger 0 / body 0 / heart 0** / hand 2 / face 1 / back 2 / foot 3
```

## 附录 B：关键行号索引（逐字引用可回溯）

| 行号 | 内容摘要 | 用途 |
|---|---|---|
| L169 | `oneLineRule: "英语说「我是谁」，am 不能丢。I am 是一对固定搭档…"` | L1 结构立岗 |
| L187 | `{ en: "I am happy.", zh: "我很开心。" }` | `I am + 情绪` 槽位 |
| L1271 | `oneLineRule: "你们、我们、他们都是「一伙的」，搭档都用 are：You are、We are、They are。"` | **L7 已教 `they`**（`their` 的上游） |
| **L1460** | `oneLineRule: "my / your / his / her 是小标签…"` | ⭐ **L8 物主清单缺 `their`** |
| **L1525** | `"同一套标签还有 your（你的）、his（他的）、her（她的）…"` | ⭐ **L8 deepDive 列举缺 `their`** |
| **L1530** | `rule: "my / your / his / her 是小标签…"` | ⭐ **L8 rule 缺 `their`** |
| L2774 / L2844 | `want to + 原样` / `to 这块小垫板不能丢` | **L15 `to` 轴起点** |
| L3333 / L3402 | `in/on/at` 三个小词 | **L18 介词家族**（措辞用「小词」避零术语） |
| L2963 | `{ en: "I have to get up early." }` | L16 `get up`（`wake` 的替代覆盖） |
| **L6217** | `"一家人都这样：your/yours、her/hers、our/ours——带 s 的那个独立用，不带的贴名词。"` | ⭐ **L33 长版清单缺 `their/theirs`** |
| L6888 / L6951 / L6958 | `I know / I don't know / I think / I forget` 引子表 | **L37 引子表缺 `remember`** |
| L8189 / L8260 | `go to the shop「to buy」milk` | L44 `to` 轴第二站 |
| **L16570** | `"It's 是「它是」的短版，Its 是「它的」…"` | ⭐ **L87 已点明 `its` 是「它的」，但只当错例** |
| L16579 | `"Its ❌ —— 少一小撇就成了「它的」"` | ⭐ `its` 的唯一身份是反面 |
| L16697 / L16771 | `名词穿一件 -y 外套变成「…的」` | **L88 形容词槽位（颜色词族的接口）** |
| L14932 / L15128 / L15324 | `next to` / `in front of`+`behind` / `between` | **L79–L81 位置词家族**（自称「一家人」） |
| L13171 / L13184 | L70 `Would you like…? + Yes, please / No, thanks` | **语用课先例（`thank you` 的接口）** |
| L21345 | `oneLineRule: "东西是谁的…短版 my…长版 mine。"` | **L112 长版短版** |
| L31668 / L31909 | `my→myself、your→yourself、him→himself、her→herself` | **L163/L164 反身词表缺复数格** |
| L34011 | `en: "She studies hard in order to pass the test."` | L173 `to` 轴第四站 |

---

**报告完** ｜ 瑞思（用户研究员）｜ 2026-09-21
