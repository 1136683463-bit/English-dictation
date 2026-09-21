# 用户研究 · 语法线「小美的一天」第二十九批

> **作者**：瑞思（用户研究员） · **日期**：2026-09-20 · **基线**：156 课（L1–L156）／165 案／28 季
> **一句话推荐**：**取轴 A「`none` ／ `nobody`」，做 2 课（L157 `none` 立岗 → L158 `nobody` 立岗）**；**轴 C（`of` 那一层）判定为「必须与轴 A 绑定、不得独立成课」**（§4）；**轴 B（`way`）判定为伪缺口，押后**（§3）。

---

## §0 本轮实读口径声明（必读）

### 0.1 工具

**本机 `grep` 是 ugrep**，`grep -oniE "(^|[^A-Za-z])none([^A-Za-z]|$)"` 这类「词边界 + 分组」花式正则会**静默返回 0**。**本轮全部词频走 node 脚本**（落 `/tmp/*.js` 再执行，避免 shell 吃引号）。基础模板（本轮所有词频由此产出）：

```bash
cat > /tmp/freq.js <<'EOF'
const {readFileSync}=require("fs");
const GL=readFileSync("src/data/grammarLessons.ts","utf8");
const c=(w)=>(GL.match(new RegExp("(^|[^A-Za-z])"+w+"([^A-Za-z]|$)","gi"))??[]).length;
for(const w of ["none","nobody","no one","nothing","someone","way","of"]) console.log(w, c(w));
EOF
node /tmp/freq.js
```

### 0.2 三种口径并列（响应批二十二的方法学提醒）

批二十二的提醒是「引用『零缺口』口径不敏感，引用『已有厚度』必须写明口径」。**本轮实测复核——`way` 就是那条提醒的现成反例**：

| 词 | raw/token（词边界） | 引号内 | substring（含词内匹配） |
|---|---|---|---|
| `none`／`nobody`／`no one` | **0** | **0** | **0** |
| `nothing` | 71 | 63 | 71 |
| `someone` | 39 | 32 | 39 |
| **`way`** | **1** | **1** | **87** |
| `of` | 128 | 107 | 300 |

**→ `none`／`nobody`／`no one` 三词三口径全 0**（真零缺口，口径不敏感）；**`way` 的 substring 那 87 全来自 `always`／`away`／`highway` 之类词内匹配**，真实词位只有 1 处（§3）。复跑：

```bash
cat > /tmp/cal.js <<'EOF'
const {readFileSync}=require("fs");
const GL=readFileSync("src/data/grammarLessons.ts","utf8");
const raw=(w)=>(GL.match(new RegExp("(^|[^A-Za-z])"+w+"([^A-Za-z]|$)","gi"))??[]).length;
const quoted=(w)=>(GL.match(new RegExp("\"[^\"]*(^|[^A-Za-z])"+w+"([^A-Za-z]|$)[^\"]*\"","gi"))??[]).length;
const bare=(w)=>(GL.match(new RegExp(w,"gi"))??[]).length;
for(const w of ["none","nobody","no one","nothing","someone","way","of"])
  console.log(w+"  raw="+raw(w)+"  quoted="+quoted(w)+"  substring="+bare(w));
EOF
node /tmp/cal.js
```

### 0.3 逐字引用纪律：每处引文都跑「行号 + 所属课号」双验证

前批出过「引文真实存在但行号指错课」。**本轮每处引用都跑同一个定位脚本**，它同时打印行号与**该行所属的课**：

```bash
cat > /tmp/ctx.js <<'EOF'
const {readFileSync}=require("fs");
const L=readFileSync("src/data/grammarLessons.ts","utf8").split("\n");
const marks=[]; L.forEach((l,i)=>{const m=l.match(/^\s*id:\s*"(lesson-[\w-]+)"/); if(m)marks.push({line:i+1,id:m[1]});});
const numOf=(line)=>{ let cur=null; for(const m of marks){ if(m.line<=line) cur=m; else break;}
  const k=marks.indexOf(cur); const end=(k+1<marks.length?marks[k+1].line:L.length);
  const body=L.slice(cur.line-1,end-1).join("\n");
  return "L"+(body.match(/^\s*number:\s*(\d+)/m)||[])[1]+" ("+cur.id+") "+(body.match(/^\s*grammarLabel:\s*"([^"]*)"/m)||[])[1]; };
const needle=process.argv[2]; let n=0;
L.forEach((l,i)=>{ if(l.includes(needle)){ n++; console.log((i+1)+"  ["+numOf(i+1)+"]  "+l.trim().slice(0,200)); }});
if(!n) console.log("NO MATCH: "+needle);
EOF
node /tmp/ctx.js "all 管肯定侧"
```

**本报告一切 `:NNNNN` 行号，均可用上面这条命令以引文原文替换参数复跑复现。**

### 0.4 ⚠️ 复用核查：必须用「严格 token 序列」口径（本批新发现）

**朴素字符串匹配会把 token 数组（被引号与逗号切开）的句子误判为「未用过」。** 本轮 3 句候选错句在朴素匹配下都显示 0 命中，严格口径下**全部命中已有案件**：

```
❌ HC[#160] GL[:28461]  The books is good.
❌ HC[#165] GL[]        He don't know.
❌ HC[#163] GL[]        I see her yesterday.
```

**本批两案 8 句错句最终全部以严格口径复核为 ✅ FREE**（§7.1／§7.2）。脚本全文见 §10 ⑨。

---

## §1 逐轴缺口盘点

### 1.1 三条轴的实测缺口表

（GL = `grammarLessons.ts`，HC = `huntCases.ts`，raw/token 口径）

| 轴 | 目标词 | GL | HC | 库内许诺 | 判定 |
|---|---|---|---|---|---|
| **A** | `none` | **0** | **0** | **✅ 有逐字钩子** | **真缺口（强）** |
| **A** | `no one` | **0** | **0** | — | **真缺口（强）** |
| **A** | `nobody` | **0** | **0** | — | **真缺口（强）** |
| **B** | `way` | **1**（非词汇用法） | **1**（同） | — | **伪缺口（本轮不取）** |
| **C** | `of` | 128 | 24 | — | **非缺口，是「分层」问题** |

**轴 A 旁证（同家族其他成员全 0）**：

```bash
node -e '
const {readFileSync}=require("fs");
const GL=readFileSync("src/data/grammarLessons.ts","utf8");
const HC=readFileSync("src/data/huntCases.ts","utf8");
const mk=t=>(w)=>(t.match(new RegExp("(^|[^A-Za-z])"+w+"([^A-Za-z]|$)","gi"))??[]).length;
const g=mk(GL),h=mk(HC);
for(const w of ["none","nobody","no one","anyone","anybody","somebody","everybody","everyone","nothing","someone"])
  console.log(w+"\tGL="+g(w)+"\tHC="+h(w));
'
```

实测输出：

```
none GL=0 HC=0        nobody GL=0 HC=0      no one GL=0 HC=0
anyone GL=0 HC=0      anybody GL=0 HC=0     somebody GL=0 HC=0
everybody GL=0 HC=0
everyone GL=3 HC=3    nothing GL=71 HC=5    someone GL=39 HC=4
```

**→ 「不点名的人」这一格（`nobody`／`anybody`／`somebody`）整格是空的；`everyone` 仅 3 处且全在对白里（非目标句）；`nothing`（东西侧）与 `someone`（有人，肯定侧）已在 L84 教过。**

### 1.2 轴 A 的「库内许诺」证据（本轮亲自复核，并更正一处流传）

```bash
node /tmp/ctx.js "all 管肯定侧"
node /tmp/ctx.js "肯定侧"
```

实测输出：

```
28490  [L151 (lesson-151-all-three) 三个以上都 · all 也站最前面]  { label: "否定", en: "I don't like coffee.", zh: "我不喜欢咖啡。", noteZh: "这是第 5 课的老句子（all 管肯定侧，否定侧下一批再看）。" },
28684  [L152 (lesson-152-every-student) 差在哪儿 · 好多个一起／一个一个来]  { label: "否定", en: "I don't like coffee.", zh: "我不喜欢咖啡。", noteZh: "第 5 课的老句子（every 管肯定侧）。" },
```

**定案**：

1. **「否定侧下一批再看」确实存在，在 L151 `:28490`** —— ✅ **批二十八的复核实对**。
2. **L152 `:28684` 逐字确实是「（every 管肯定侧）」，无「下一批再看」** —— ✅ **批二十七对 L152 的核验也对**。
3. **两课各有一处「肯定侧」，只有 L151 那处带「下一批再看」**。批二十七把两行合成一句是**口径错误**；但「库里许过这句话」这个**事实成立**。

**→ 对轴 A 的意义**：批二十八把这条从「欠账」降为「普通真缺口」（理由：位置被合成过、可信度打折）。**本轮认为降级方向对，但不该降成「普通」**：

- 这一行**真实存在、用户可能已读过**（L151 的否定变体卡是首屏可点开字段）；
- 它**不是含糊暗示，而是明确排期承诺**（「下一批」）；
- 更重要：**L151／L152 两课都用「肯定侧」给变体卡加括号注**，说明写课人**有意在对比卡里为否定侧留了座位**——这个座位**空了两课了**。

**→ 轴 A 强度应为「真缺口 + 库内已许诺 + 已留座位」，排第一。**

### 1.3 真实表达需求（从零基础中国学习者出发）

| 中文里想说的话 | 现在能不能说出口 | 依赖轴 |
|---|---|---|
| 「一个人都没有。」 | ❌ **说不出**（`nobody`／`no one` 全库 0） | **A** |
| 「这几本一本都不好。」 | ❌ **说不出**（`none` 全库 0） | **A ＋ C** |
| 「他们一个都没来。」 | ❌ **说不出**（`none of them` 全库 0） | **A ＋ C** |
| 「这件事有别的做法。」／「这么走。」 | ❌ 说不出 | B |
| 「去图书馆的路。」 | ⚠️ 勉强能绕（`go to the library` L9） | B |

**→ 轴 A 的两个中文入口都是零基础口语高频句、当前完全无替代说法。轴 B 的入口（「怎么走」）在 L27 已有 `How` 的问方式用法可绕。**

### 1.4 排序与结论

> **排序：轴 A ≫ 轴 C（并入 A）＞ 轴 B（本轮不取）。**
>
> - **轴 A 第一**：三口径全零 ＋ 库内已许诺 ＋ 对比卡已留座位 ＋ 中文高频 ＋ 与已教 5 课同属「都」的语义场。
> - **轴 C 不是独立轴，是轴 A 的必然后半段**：`none` 现代英语几乎不裸用，`none of the…` 是常态形。**摘掉 `of` 单教 `none`，会教出一个用户几乎用不上的形式**（§4）。
> - **轴 B 不取**：真实词位只 1 处，且那 1 处**不是「路」的意思**（§3）。

---

## §2 轴 A 专项（本轮重点）

### 2.1 ① 第 5 次应用——**判定：不构成「重复」，但构成「稀释风险」，需要一次显式机制升级**

#### 2.1.1 先把「这条规矩用过几次」的账实数清楚

任务书清点是 L30／L83／L146／L149 四次。**本轮实测复核，并把「写课人自己怎么记账」拉出来对**：

```bash
node /tmp/ctx.js "老规矩，第三次来了"
node /tmp/ctx.js "老规矩，今天又来一遍"
node /tmp/ctx.js "有「不」就换"
```

实测输出（节选）：

```
28115  [L149 (lesson-149-neither)]  title: "第 83 课那条老规矩，第三次来了"
27537  [L146 (lesson-146-not-either)]  title: "第 83 课那条老规矩，今天又来一遍"
```

| 课 | 行号 | 逐字（`oneLineRule`） | 换的东西 | 换的位置 |
|---|---|---|---|---|
| **L30** | `:5457` | `"「一些」：好好说的时候用 some，问句和「不 / 没」的时候换 any。数得清的用 many，数不清的用 much。"` | `some`→`any` | 句中（量） |
| **L83** | `:15398` | `"说不清或者先不说是什么，用 something；问句和「不 / 没」里换成 anything——第 30 课 some/any 的老规矩。"` | `something`→`anything` | 句中 |
| **L146** | `:27473` | `"说「也不」：too 让位，either 上，还是站句尾——I don't like coffee either（我也不喜欢咖啡）。前面有了「不」，句尾就换 either。"` | `too`→`either` | **句尾** |
| **L149** | `:28051` | `"说「两个都不」：neither 站最前面，后面那个东西只说一个——Neither book is good（两本都不好）。中文是加一个「不」，英语要整个换人：both 让位，neither 上。"` | `both`→`neither` | **最前面** |
| **（本批）** | — | `none`／`nobody` | `all`→`none`；`someone`→`nobody` | **最前面** |

**关键：写课人自己的记账口径。** L149 深挖卡标题「**第 83 课那条老规矩，第三次来了**」，正文 `:28101` 逐字；L150 收官卡把这条线**显式编号**，`:28311` 逐字：

```
28101  [L149]  whyZh: "两句都对——第 83 课那句也是同一条老规矩：有「不」就把词换掉（something→anything）。"
28311  [L150 (lesson-150-close-25)]  "位置要注意：两个词都站最前面——不像第 146 课的 too 和 either 站句尾。从句子中间（第 83 课的 anything），到句尾（第 146 课的 either），到今天的最前面（neither），那条老规矩换过三个位置了。"
```

**→ 写课人已把这条规矩的账本公开写进课里**：① L83 是源头，② L146 第二次（句尾），③ L149 第三次（最前面）。**L30 被当作「更早的源头」而非「第 1 次」**（L83 称「第 30 课 some/any 的老规矩」，L147 `:27734` 又称「它抄的是第 83 课那条老规矩」）。**同一件事库里存在两套编号**——这是**需要对账的小问题**（§9-①）。

#### 2.1.2 判定：**不构成「重复」，但构成「稀释风险」**

**依据一：位置轴持续推进，且单向不回头。**
句中（`anything`，L83）→ 句尾（`either`，L146）→ 最前面（`neither`，L149）→ **最前面（`none`／`nobody`，本批）**。
**⚠️ 本批位置轴不推进**——**弱点一。**

**依据二：换的东西的「身份」在推进。**
L83：`something`→`anything`（**同一个人的两件衣服**）。L146：`too`→`either`（两个词，同句尾）。L149：`both`→`neither`（两个词，同句首，数量词）。**本批：`all`→`none`（数量词、句首，与 L149 同型）＋ `someone`→`nobody`（不定代词、句首，与 L83 同型）。⚠️ 本批在身份上也是回声——弱点二。**

**依据三：本批真正的新东西不在「换词」上，在「词肚子里装了什么」。**
`nothing`（L84 已教）**肚子里装了一个「不」**——`:15658` 逐字：「三个一起记：something（有样东西）、anything（任何东西，疑问否定用）、nothing（啥也没有）——「不点名的东西」三兄弟到齐了。」
**本批要把这条「自带不」的机制从「东西」扩到「人」和「一群人」**：`nobody`（没有人）／`none of them`（一个都不）。
**→ 本批的真实增量不是第 5 次「有『不』就换词」，而是第 2 次「自带『不』」**（第 1 次是 L84 `nothing`）。

> **判定**：**不构成「重复」**——一课一增量的判据是「本课有没有给出用户此前没有的能力」。本批给出的能力是**「一个人都没有」「一个都不好」两句中文出口**，此前**完全无法表达**（三口径全零）。
> **但构成「稀释风险」**——若 `oneLineRule`／深挖卡只写「有『不』就换个词」第 5 遍，用户读到的是**第 5 次复述**。**必须把「换词」降为背景、把「自带『不』」提为主角。**

**一条硬建议**：本批两课的一课一增量应写成「词肚子里装了什么」——**L157 `none`** 的增量 =「一个都不」后面要拴一个 `of`（新形式）；**L158 `nobody`** 的增量 =「没有人」装在一个词里（新机制，与 L84 `nothing` 同族）。**「有『不』就换词」在本批只作 `bothRight` 双正解卡的复现素材，不作本课一句话规则。**

### 2.2 ② 与 L84 的关系

**L84 逐字（本轮复核，行号带课号）**：

```
15588  [L84 (lesson-84-nothing) 不点名的东西 · nothing / someone]  oneLineRule: "说「什么也没有」用 nothing——它自带「不」，句子里不再请 not；someone 是「有人」，一个人配 is。",
15605  [L84]  whyZh: "nothing 自带「不」：一句话里有了它，就别再请 not——两个「不」打架。"
15657  [L84]  "someone 是「有人」——它说的是「某一个人」，所以配 is：Someone is at the door（有人在门口）。第 33 课的老台词 Someone left them here，今天正式转正。"
```

**任务书给的两句引文全部核对为真**（`:15588` 就是那条 `oneLineRule`，且确实在 L84）。

| 层次 | L84 给了什么 | 本批接什么 | 怎么接 |
|---|---|---|---|
| **机制层（直接继承）** | 「自带『不』，句子里不再请 `not`」 | `nobody`／`none` 同样自带「不」，同样不再请 `not` | **完全继承**——本批是这条机制的**第 2 次应用** |
| **外形层（本批新增）** | `nothing` 是**东西**侧；`someone` 说**「有人」**（肯定侧） | `nobody`／`no one` 是**人**侧；`none` 是**一群人／一堆东西**侧 | **「东西／人」分岔是 L84 留的天然接口**——人侧只给了肯定版 |
| **搭配层（直接继承）** | `:15611` 逐字「someone 是「一个人」：配 is——第 26 课单好几个判断的老规矩。」 | `nobody` 同样「一个人」→ 同样配 `is` | **完全继承**——`Nobody is here.` 的 `is` 不需新教 |

**→ 本批与 L84 是「同一机制的第二次应用 ＋ 一次从东西到人的横移」，不是重复课。** 库里已留好接口：L84 `:15658` 把「东西三兄弟」列全了，**人侧只列了 `someone` 一个**——空缺是结构性的、有意的。

**⚠️ 必须处理的碰撞**：`nothing` 是全库 71 处高频词，**本批 `none` 与它在中文上都可能译成「什么都没有」**。切分口径：**笼统的「什么也没有」（想不出具体是啥）用 `nothing`（L84，`I have nothing.`，不点名的东西）；「给定的那一堆里，一个都没有」用 `none`（本批，`None of the books are good.`，必须点名那一堆 `of the…`）。**

### 2.3 ③ 能否撑 2 课？**能，且必须 2 课；不建议合并**

1. **中文入口完全不同**：`none` 的入口是「**这些里一个都不**」（必须有一堆东西当前提），`nobody` 的入口是「**一个人都没有**」（说人，不需前提）。
2. **外形负担完全不同**：`none` 背着 **`of` 结构**（`of the books` 要带 `the`、带 `s`——**一个新形式 ＋ 两条老规矩**）；`nobody` 是**一个词整装**（`Nobody is here.`——**无新形式，只有机制**）。**新形式量与机制量不能同课压。**
3. **复用对象不同**：`nobody` 的 `is` 复用 L84 `someone`；`none of the books` 的 `are` 复用 L7／L11。**混在一起会互相干扰。**

**→ 结论：2 课。L157 `none`（带 `of`），L158 `nobody`（不带 `of`，纯机制）。**

**⚠️ 反方意见（诚实登记）**：批二十八 §2.4 判「能撑 2 课，但建议只排第 1 课或整轴顺延」，路线图 §219 登记「批二十九开工时须复核」。**本轮复核结论是 2 课**：批二十八走的是「一课立岗＋一课切开」（`ago` vs `for`），**本批同样有两件不同的事（`of` 结构 vs 自带「不」的人）**，且**都不需第三课来切开**（两课各自独立，不像 `ago`／`for` 必须对照）。

#### 2.3.1 L157 的三条带标记新错

**目标句：`None of the books are good.`（6 词 ✅）**

| # | `wrong` | `wrongMark` | 性质 | `whyZh` 草稿（零术语已验） |
|---|---|---|---|---|
| 1 | `All of the books are good.` | `All` | **有「不」没换词** | 「中文说「一本都不好」，最前面那个词要整个换掉——All 让位，None 上。第 149 课 both→neither 那条老规矩，今天轮到这个位置。」 |
| 2 | `None the books are good.` | `None` | **`of` 丢了**（本课新形式负担） | 「上一课那个 all 后面直接接、中间不加 of；今天这个不一样——它后面必须带 of：None 【of】 the books。」 |
| 3 | `None of books are good.` | `of books` | **`of` 后面少了 `the`** | 「of 后面那几本，得是「大家都知道的那几本」——带上 the：None of 【the books】。」 |

**实测：三条 `wrong` 严格口径全零命中**（§10 ⑨ 脚本）：

```
✅ FREE  All of the books are good.
✅ FREE  None the books are good.
✅ FREE  None of books are good.
```

**⚠️ 与 L151 的正面冲突（必须处理）**：L151 对比卡 `:28455` 逐字把 `All of books are good.` 标为**错**（`wrongMark: "of"`），理由 `:28458` 逐字：

```
28455  [L151 (lesson-151-all-three)]  wrong: "All of books are good.",
28458  [L151]  whyZh: "中文说「所有的书」直接连着说，英语的 all 后面也直接接——中间不加 of。"
```

**→ 本批的 `None of the books…` 与 L151 的「all 后面不加 of」会并排出现在同一批用户眼前。这不是错误，但必须显式切开**：`all` 可裸接（`All the books`），`none` 必须带 `of`。

**⚠️ L151 还有一处更细的冲突**：`:28563` 的 `replace` 选项把 `"All of my books are good."` 当**干扰项**（正确答案是 `All my books are good.`）：

```
28563  [L151]  options: ["All my books are good.", "All of my books are good.", "My all books are good."],
```

实测 `All of my books are good.` GL=**1**（就这一处）／HC=**0**。**该形在真实英语里合法**，L151 当干扰项是**教学简化**。**本批不翻这个案，但必须避免在 `none` 的例子里出现 `All of…` 合法形**——**本批所有 `none` 反例一律用「`All` 光杆 + 批注」形式。**

#### 2.3.2 L157 的三条双正解

| # | `wrong`（也是对的句子） | `whyZh` 草稿 | practice 余量 |
|---|---|---|---|
| 4 | `Someone is at the door.` | 「两句都对——第 84 课那句是「有人」（肯定侧，配 is）；今天这句是「一个都不」。中文一个「没有人」的正反面，英语两个词。」 | **5** |
| 5 | `I don't have anything for you.` | 「两句都对——第 83 课那句也是「有『不』就把词换掉」（something→anything）；今天换的是最前面那个词。规矩还是同一条。」 | **3** |
| 6 | `Neither book is good.` | 「两句都对——第 149 课那句管**两个**（后面只说一个）；今天这句管**三个以上**（后面要带 s）。同一个「都不」，看你要说的是几个。」 | **4** |

**第 4 条为什么选 `Someone is at the door.`**：`someone`（有人）与 `none`（一个都不）在人侧正好一对反义，比 `nothing`（东西）更贴。

#### 2.3.3 L158 的三条带标记新错

**目标句：`Nobody is here.`（3 词 ✅）**

| # | `wrong` | `wrongMark` | 性质 | `whyZh` 草稿（零术语已验） |
|---|---|---|---|---|
| 1 | `Nobody are here.` | `are` | **`-body` 配 `are`**（中文「没有人」听起来是一堆人） | 「nobody 是「一个人」——配 is：Nobody 【is】 here。第 84 课 someone 那条老规矩，今天换了个词照样管用。」 |
| 2 | `Nobody isn't here.` | `isn't` | **两个「不」打架** | 「nobody 自己装着「不」——后面不要再补 not：两个「不」撞一起，意思就翻成「有人在这儿」。第 84 课 nothing 那条老规矩。」 |
| 3 | `Nobody here.` | `here` | **少了 `is`**（中文直译的洞） | 「中文说「一个人都没有」，这句话里没有动作；英语的句子必须有动词，is 不能丢——Nobody 【is】 here。」 |

**关于第 3 条的替换说明**：原拟用 `No body is here.`（外形拆分），但 **`body` 在全库 0 次**——把它作干扰项等于**在教一个新词**。**改判 `Nobody here.`**：它是**真实的零基础错型**（中文直译本就无动词），且复用 L1 `:178` 逐字「中文说「我小美」不用动词，但英语的句子必须有动词。把 am 丢了，句子就塌了。」**（`No body` 条登记为备选，§9-④。）**

**实测：三条 `wrong` 严格口径全零命中**：

```
✅ FREE  Nobody are here.
✅ FREE  Nobody isn't here.
✅ FREE  Nobody here.
```

#### 2.3.4 L158 的三条双正解

| # | `wrong`（也是对的句子） | `whyZh` 草稿 | 余量 |
|---|---|---|---|
| 4 | `Everyone is gone.`（**L154 `:29026` 逐字老台词**，原形带感叹号） | 「两句都对——第 154 课那句是「人都走光了」；今天这句是「一个人都没到」。一个说走、一个说没来。」 | **6（从未做过答案）** |
| 5 | `Someone is at the door.` | 「两句都对——第 84 课那句是「有一个人」（肯定侧）；今天这句是「一个人都没有」。同一个位置，两张脸。」 | 5 |
| 6 | `Every student is here.` | 「两句都对——第 152 课那句是「一个一个都到」；今天这句是「一个都没到」。中文一个「都没有」，英语换个词。」 | 5 |

**⚠️ `Everyone is gone!` 带感叹号**。放进 `contrast.wrong` 时**建议去掉感叹号写作 `Everyone is gone.`**——实测该形 GL=0／HC=0（**从未出现过，干净复用**），用户在第 154 课见过带感叹号的原形，认得出来。它是**唯一一处「人全没了」的现成画面**，与 `Nobody is here.` 是**最贴的反义对**，故放第 4 条（第一张双正解卡）。

**⚠️ `Everyone is gone!` 在 L154 是 `dialogue` 行**（不是 `examples`），因此**不违反「对话行不得整段复用例句」守门**，也不占 practice 余量。

#### 2.3.5 变体三态草案

**L157 `none`**

| 标签 | 句 | `noteZh` |
|---|---|---|
| 肯定 | `All the books are good.` | 第 151 课——没有「不」，最前面用 all，后面直接接 the。 |
| **否定** | `None of the books are good.` | 今天的新脸——有「不」，最前面换 none，而且它后面必须带 of。 |
| 疑问 | `Are all the books good?` | 问句里照样用 all（它不是「不」）——Are 搬句首。 |

**L158 `nobody`**

| 标签 | 句 | `noteZh` |
|---|---|---|
| 肯定 | `Someone is at the door.` | 第 84 课——「有一个人」，配 is。 |
| **否定** | `Nobody is here.` | 今天的新脸——「一个人都没有」，一个词装完，照样配 is。 |
| 疑问 | `Is everyone here?` | 第 152 课那句是问「全都到了吗」——它没有「不」，所以问句照样能用。 |

**⚠️ 为什么 L158 疑问态不用 `Is someone at the door?`**：实测该形 GL=**0**（需新造）。**`Is everyone here?` 实测 GL=1（L152 `:28637` 逐字确有）**，**零造词**。

---

## §3 轴 B 专项：`way` 是不是真缺口

### 3.1 实测：`way` 真实词位只 1 处，且**不是「路」的意思**

```bash
node /tmp/ctx.js "Say it another way?"
```

实测输出：

```
26325  [L140 (lesson-140-but-vs-although) 两张脸 · although 站前面 / but 站中间]  { who: "npc", en: "Say it another way?", zh: "妈妈看你写在便签上的句子。" },
```

**→ 这是「换个说法」（`another way` = 另一种方式），是 `way` 的「方法」义，不是「路」义。且它在 L140 的 `dialogue`，是妈妈问「能不能换个说法」的元话语，不是教学内容。**

**三口径复核**（§0.2 已给全表）：raw=1、quoted=1、substring=87，**substring 那 87 全是词内匹配**。

```bash
node /tmp/w2.js   # 输出：{"way":1,"another_way":1,"the_way":0,"way_home":0,"on_the_way":0}
```

**`on the way`／`the way`／`way home` 全为 0。** 唯一的「路」义语料在案件侧——HC 里 `way` 也只有 1 处（`:1743` 逐字 `"way",`），宿主是 `hunt-photo-album`（案 #30），整句为 `On the way home, I ate an apple and shared it with her.`。**该案被 L22 引用**（`:4140` 逐字 `huntCaseIds: ["hunt-photo-album"]`）。

```bash
node -e '
const {readFileSync}=require("fs");
const H=readFileSync("src/data/huntCases.ts","utf8").split("\n");
H.forEach((l,i)=>{ if(/(^|[^A-Za-z])ways?([^A-Za-z]|$)/i.test(l)) console.log((i+1)+": "+l.trim()); });
'   # 实测输出：1743: "way",
```

**⚠️ 但这是「考」不是「教」**：用户在 L22 做该案时，`On the way home` 是**整句语料里的一段**，不是被讲解的落点（案 #30 的 `errors` 落在 `have was`／`have see` 这类动词形上）。**「见过」不等于「会自己造」。**

### 3.2 判定：**`way` 不是本轮缺口，判为「伪缺口」，押后**

**理由一：「缺口」要按「有没有替代说法」判，不能按「词频是不是 0」判。**
L27 `:4904` 逐字 `"问事情用 What，问地方用 Where，问时间用 When，问方式用 How——疑问词站句首，后面跟着 be 或帮手动词。"`——**`How` 的「问方式」义已教**。L9 `:1600` 逐字 `"去什么地方用 go to。去「那个」大家都知道的地方，前面加 the：the library、the park。"`——**「去某地」已教**。
**→ 「怎么走」是「已有零件、拼装不顺」，不是「没有零件」。它的问题层级是流利度，不是能力缺口。**

**理由二：`way` 的真正难点不在 `way` 本身，在「问路的整句话术」，那需要一整套新零件。**
实测：`get to` GL=**0**、`How do I` GL=**0**、`This way`／`That way`／`on the way`／`turn right` GL=**0**、`turn left` GL=**1**（仅 L32 祈使句陪衬）、`street` GL=**0**、`road` GL=**0**、`crossing` GL=**0**、`hotel`／`museum`／`restaurant`／`bridge` GL=**0**。
**→ 要教 `way`，实际要连带造一串词（成本见 §6.3）。**

**理由三：「中文痛点密度」不在一个量级。**
「一个人都没有」／「一个都不好」是**零基础说话的高频句、当前完全说不出**；「怎么走」是**旅行场景高频句，但有 `How` 可绕**，且**不是小美的一天（校园＋家庭）的核心场景**。

**→ 排后。登记为批三十或更后候选，前置条件是「先补 `get to` 一套」**（§9-⑥）。

---

## §4 轴 C 专项：`of` 那一层是否该做

### 4.1 先纠一条口径：`of` 不是没碰过——**已教 6 课**

```bash
node /tmp/oflesson.js   # 输出：L11:1 L52:5 L62:36 L69:7 L70:4 L75:1 L79:1 L80:36 L81:2 L86:4 L109:1 L111:6 L117:1 L118:1 L142:3 L144:1 L151:4
```

**其中真正「教 `of`」的两课**：

| 课 | 行号 | 逐字 | 教的是 |
|---|---|---|---|
| **L62** | `:11413` | `targetSentence: "I would like a cup of tea."` | **「一 X of Y」量词块** |
| **L80** | `:14893` | `deepDive.title: "前后配对：谁带 of、谁不带"` | **`in front of` 带 of／`behind` 不带** |
| **L80** | `:14894` | 逐字 `"两位住的房间不一样：in front of 是三个词一起住（in + front + of），of 不能丢；behind 只住一个词，别给它加 of。中文都是「前/后」，英语这两位一个带 of、一个不带——记住这一对。"` | 同上 |

**→ 「`of` 是中级层、从没碰过」不准确：`of` 已以「量词块」（L62）和「位置词配件」（L80）两种身份出现过，且 L80 专门教了「谁带 of、谁不带」这条判据。**

**但批二十五／二十八想说的那层确实还没做**：**`of` 作「限定词短语的引桥」（`of the books`／`of them`／`of us`）这一层**。实测：`of the books` GL=**0**、`of them` GL=**1**（L144 `:27097` 的 `Six of them?`）、`of us` GL=**0**、`of the students` GL=**0**。

**→ 修正口径：「`of` 引桥层」是空白（真）；「`of`」不是空白（已教 2 课）。**

### 4.2 判定：**这一层必须做，但不得独立成课——它是轴 A 的组成件，不是轴 C**

**依据一：`none` 没有 `of` 就几乎用不了。** `None the books are good.` ❌／`None books are good.` ❌。现代英语 `none` 作限定词直接接名词的用法**极度受限**。**摘掉 `of` 单教 `none`，等于教一个用户造不出正确句子的词。**

**依据二：L151 已用一张对比卡为这条撞点埋了伏笔，且埋的方向是反的。** L151 `:28455` 明确标 `All of books are good.` 为**错**。**→ 用户带着「`all` 不带 `of`」的记忆进入本批。本批必须在不推翻 L151 的前提下讲清「`all` 可裸接、`none` 必须带 `of`」——这是一次「同一位置、两个词、两条规矩」的精细切分，是真实的教学增量。**

**依据三：与轴 A 不撞车，因为它就是轴 A 的一半。** L157 的**新形式负担就是 `of` 结构**。

**→ 结论：不另立「轴 C 课」。把 `of` 引桥层作为 L157 的核心教学内容，与 `none` 同时立岗。**

### 4.3 与已教 `of` 的切分表

| 已教的 `of` | 课 | 本批的 `of` | 怎么切 |
|---|---|---|---|
| **量词块**：`a cup of tea` | L62 | **引桥**：`of the books` | **前者 `of` 前面是「量的单位」（cup），后者前面是「一个都不」（none）** |
| **位置词配件**：`in front of` 带 of／`behind` 不带 | L80 | **引桥**：`none` 带 of／`all` 不带 | **⚠️ 最易混**——L80 教「哪一个词带 of」，本批教的也是「哪一个词带 of」，**同型判据、不同词对** |

---

## §5 中文负迁移分析（为推荐轴：L157／L158）

### 5.1 L157 `none of the…` 的典型中式错句

| # | `*错句` | 中文里为什么会长成这样 | 干扰点 |
|---|---|---|---|
| 1 | `*All of the books are not good.` | 中文「这些书**都不**好」——在「都」上压一个「不」就行，词不用换 | **有「不」没换词**（复用 L149 both→neither，位置同型） |
| 2 | `*None the books are good.` | 中文「这些书一本都不好」——「这些书」直接跟后面，没有「的」这个引桥 | **`of` 丢了**（本课新形式负担） |
| 3 | `*None of books are good.` | 中文「书一本都不好」——「书」本来就泛指，不需要「那」 | **`of` 后面少了 `the`** |
| 4 | `*None of the book are good.` | 中文「一本都不好」——「一本」是单的 | **`of` 后面那堆要带 s** |
| 5 | `*None of the books is good.` | 中文「一本都不好」——配 `is` 顺口 | **`of` 后面是好几个 → 用 are**（复用 L7／L151） |
| 6 | `*None of the books are not good.` | 中文「一本都**不**好」——把「不」明说出来才安心 | **两个「不」打架**（复用 L149 `Neither book is not good.` ❌ 与 L84 `I don't have nothing.` ❌） |

**⚠️ 第 5 条最危险**：`None of the books is good.` 在正式书面英语里有派别接受（`none` 可作单数），但在零基础口语教学里是干扰。**建议本批不碰这条（不进对比卡）**，登记 §9-③。

### 5.2 L158 `nobody` 的典型中式错句

| # | `*错句` | 中文里为什么会长成这样 | 干扰点 |
|---|---|---|---|
| 1 | `*Nobody are here.` | 中文「一个人都没到」——「没到」的是一群人，用「一伙的」那个搭档顺口 | **`-body` 配 `are`**（复用 L84 `Someone are at the door.` ❌ → `is`） |
| 2 | `*Nobody isn't here.` | 中文「**没有**一个人**不**在」——双重否定在中文里是强调，在英语里翻意思 | **两个「不」打架**（复用 L84 `I don't have nothing.` ❌） |
| 3 | `*Nobody here.` | 中文「一个人都没有」——**这句本来就没有动词**（「没有」不是动作） | **少了 `is`**（复用 L1 `:178`） |
| 4 | `*Nobody is not here.` | 同 #2，把「不」写在 `is` 后面 | 同上 |
| 5 | `*No body is here.` | 中文「没有人」是两个音节的词，容易被拆 | **外形拆分**（本轮降为备选，§9-④） |

### 5.3 干扰点总表（两课合并）

| 干扰点 | 来自哪条中文习惯 | 复用哪个已教判据 |
|---|---|---|
| 有「不」不换词 | 「都」上加一个「不」 | L149（both→neither） |
| `of` 丢／`the` 丢 | 中文没有「的」引桥、没有冠词 | L151（`All of books` ❌）反向 |
| `of` 后不带 s／配 `is` | 中文量词「一本」是单的 | L11（好几个带 s）／L7（一伙的用 are） |
| 两「不」同台 | 中文双重否定＝强调 | L84（`nothing` 自带「不」）／L149（`neither` 自带「不」） |
| 少动词 | 中文「一个人都没有」无动词 | L1（英语句子必须有动词） |
| 配错搭档 | 「没有人」听起来是一群 | L84（`someone` 是「一个人」，配 `is`） |

---

## §6 场景设计

### 6.1 合法场景 ID（源头 `src/components/AdventureScene.tsx:6-19`）

实测原文（14 个合法值）：`campus`／`city`／`train`／`lighthouse`／`desert`／`space`／`ocean`／`island`／`mansion`／`forest`／`snow`／`magic`／`mystery`／`sparkle`。

```bash
sed -n '6,25p' src/components/AdventureScene.tsx
node -e '
const {readFileSync}=require("fs");
const GL=readFileSync("src/data/grammarLessons.ts","utf8");
const ids=[...GL.matchAll(/scene:\s*"([^"]*)"/g)].map(m=>m[1]);
const u={};ids.forEach(i=>u[i]=(u[i]||0)+1);
console.log(JSON.stringify(u,null,1));
'
sed -n '474p' src/components/AdventureScene.tsx
```

**⚠️ 本轮发现一个数据问题**：`grammarLessons.ts` 有 **5 课用了非法值 `"school"`**（`:15957`／`:16147`／`:16337`／`:16527`／`:17472`，即 L86／87／88／89／94），而 `"school"` **不在合法 ID 列表里**。渲染时走 `AdventureScene.tsx:474` 的 `const Scene = SCENES[scene] ?? SparkleScene;` **静默回退到 `sparkle`**。

实测输出：

```
{ "campus":39, "city":25, "sparkle":9, "island":5, "train":4, "forest":2,
  "magic":2, "mansion":61, "snow":1, "mystery":3, "school":5 }

  const Scene = SCENES[scene] ?? SparkleScene;
```

**→ 本批不碰这个问题（不在研究范围），登记 §9-⑤。**

| 场景 | 已用课数 | 备注 |
|---|---|---|
| `mansion` | **61** | ⚠️ 任务书要求优先别的 |
| `campus` | 39 | ⚠️ L152／L156 刚用过 |
| `city` | 25 | — |
| `sparkle` | 9 | 含 5 课 `school` 的静默回退，**真实主动使用仅 4 课** |
| `island` | 5 | — |
| **`train`** | **4** | **✅ L158 推荐** |
| **`mystery`** | **3** | **✅ L157 推荐** |
| `forest`／`magic` | 各 2 | — |
| `snow` | 1 | — |
| **`lighthouse`／`desert`／`space`／`ocean`** | **0** | **从未用过** |

### 6.2 推荐场景（两课各一）

#### L157 `none` —— **`mystery`（悬疑侦探）**

**场景锚**：小美在美术教室收拾一摞画稿，老师问「这几张都画得好吗」——她一张张翻完，一本都不满意。

- **⚠️ 不用 `campus`**：**L152 刚用过 `campus`（`:28619` 逐字 `scene: "campus"`），L156 也用 `campus`**——连着三课都 `campus` 会撞。
- **⚠️ 不用 `mansion`**：任务书明确要求（且 L143–L151 连续 9 课 `mansion`）。
- **`mystery` 只用过 3 课**（L24／L33／L85），但**那三课是「失物／伞／书包」**——本课画面里要有「一摞纸／画稿」，与它们拉开。

#### L158 `nobody` —— **`train`（列车旅行）**

**场景锚**：小美坐夜车回家，中途醒来发现车厢里一个人都没有，只剩她一个。

- **`train` 只用过 4 课**（L8／L11／L15／L155）——**配额宽裕**。
- **L155 刚用过 `train`**（`:29389` 逐字 `scene: "train"`），但那是「站台上的告示纸」（案 #164 的场景），**该课是站台、本课是车厢内**——同场景、不同空间，可接受。
- **「车厢里一个人都没有」是 `Nobody is here.` 的天然画面**——**「这里」有明确所指（这节车厢）**。

**⚠️ 零雨线纪律核查**：`rain`／`raining`／`rainy`／`stops`／`stopped`／`the movie`／`ends`／`ended` 是 L109 专属叙事资产，本批两课一律不碰。实测（逐词统计宿主课，脚本与 §10 ⑦ 同型，仅换词表）：

```
rain      -> L12:8 L29:7 L30:2 L48:12 L49:5 L96:9 L101:1 L102:7 L109:45 L110:3 L127:4 L139:2
raining   -> L6:2 L34:3 L48:1 L96:53 L99:1 L100:1 L101:18 L102:19 L139:46 L140:52 L141:57
rainy     -> L34:1 L92:1 L96:1
stops     -> L94:1 L109:8
stopped   -> L109:41 L110:3 L139:1
the movie -> L109:8
ends      -> L109:2
ended     -> L109:8
```

**→ `the movie`（8）／`ends`（2）／`ended`（8）全部只在 L109（`stops`／`stopped` 也以 L109 为绝对主场）。本批两课场景描述里一律不出现这些词** ✅。

### 6.3 零件清单（逐词实测 GL 词次）

| 课 | 零件（GL 词次） |
|---|---|
| **L157** `None of the books are good.` | `none` **0（本课新教）** · `of` **128**（L62／L80 已教） · `the` 2280（L2 起） · `books` 216（L11） · `are` 841（L7） · `good` 516（L5 起） · **`of the books` 整块 = 0（新结构，本课增量）** |
| **L158** `Nobody is here.` | `nobody` **0（本课新教）** · `is` 2581（L1 起） · `here` 202（L2 起） |

**双正解卡需要的复现零件（practice 余量实测）**：

| 句 | GL／HC | practice 余量 |
|---|---|---|
| `Someone is at the door.` | 39／4 | **5**（已用于 L84） |
| `Everyone is gone.` | **0／0**（带感叹号为 GL 1） | **6（从未做过答案）** |
| `Every student is here.` | — | **5**（已用于 L152） |
| `I don't have anything for you.` | — | **3**（L146／147／149） |
| `Neither book is good.` | — | **4**（L149／150） |
| `All the books are good.` | — | **4**（L151／152） |
| `Are all the books good?` | — | **5**（L151） |
| `Is everyone here?` | — | —（L152 dialogue，非 practice） |

**⚠️ 必须避开的句子（余量耗尽或过低）**：`There is a book on the desk.`（**余量 0**，已用 6 课 L26／37／55／60／114／148）、`Both books are good.`（**余量 2**，L148／149／150／151）、`I am happy.`（**余量 1**，已用 5 课）。

**造词成本：两课合计需造 2 个词（`none`／`nobody`）＋ 1 个结构（`of the + 复数`）。** 这是**正常「造词课」量级**（批二十「五种感官」是 4 词大章）。**不需为场景额外造词。**

**覆盖（cover）配额**：实测 117 个 cover 全部用过 1–2 次（分布 `{"1":78,"2":39}`，**无一个用过 3 次**）。**新两课需新增 2 张，或从已用 1 次的 78 张里挑 2 张复用（升到 2 次，仍在先例内）。**

---

## §7 逐课规格（推荐 2 课）

### 7.1 L157 · `none`

| 字段 | 值 |
|---|---|
| **课注 id** | `lesson-157-none-of` |
| **number** | 157 |
| **title** | `一本都不好` |
| **grammarLabel** | `一个都不 · none 后面跟着 of` |
| **目标句** | `None of the books are good.`（**6 词** ✅） |
| **场景** | `mystery`（合法 ID ✅；已用 3 课；非 `mansion`／非 `campus`） |
| **一句话规则** | 「说「一个都不」：none 站最前面，后面必须跟着 of——None of the books are good（这几本一本都不好）。中文的「都」上压一个「不」就行，英语这个词后面还拴着一个 of。」 |
| **零术语校验** | ✅ `ALL CLEAN`（§10 ⑥） |

**对比卡 6 条（3 带标记 ＋ 3 双正解）**：见 §2.3.1／§2.3.2。

**变体三态**：见 §2.3.5。

**`sceneSwings` 三条**：

| `sceneZh` | `en` | 余量 |
|---|---|---|
| 说这几本一本都不好 | `None of the books are good.` | 本课目标句 |
| 说这些书都很好（第 151 课） | `All the books are good.` | 4 |
| 说两本都不好（第 149 课） | `Neither book is good.` | 4 |

**复现取材建议**：

- **必取 1**：`Neither book is good.`（L149，余量 **4**）——「两个都不」与「一个都不」并排，本课最重要对照。
- **必取 2**：`All the books are good.`（L151，余量 **4**）——肯定侧的脸。
- **必取 3**：`Someone is at the door.`（L84，余量 **5**）——「有人」与「一个都不」是人与人的对照。
- **⚠️ 避免**：`Both books are good.`（余量 **2**）、`There is a book on the desk.`（余量 **0**）。

**案件设计（`huntCases.ts` #166）**：

```
id: "hunt-none-of-the-books"
title: "一摞画稿"
scene: "美术教室的桌上摊着一摞画稿，一张张翻过去"
tokens: [
  "All", "of", "the", "books", "are", "good.",   ← idx 0–5（新错：有「不」没换词）
  "None", "the", "books", "are", "good.",         ← idx 6–10（新错：of 丢了）
  "The", "book", "are", "good.",                  ← idx 11–14（旧错回流 L7）
  "She", "have", "two", "books."                  ← idx 15–18（旧错回流 L25）
]
```

- ① `tokenIndex: 0`，`tag: "word_order"`，`All`→`None`（**本课新错**）
- ② `tokenIndex: 6`，`tag: "fragment"`，`None`→`None of`（**本课新错**）
- ③ `tokenIndex: 13`，`tag: "sv_agreement"`，`are`→`is`（L7 回流）
- ④ `tokenIndex: 16`，`tag: "sv_agreement"`，`have`→`has`（L25 回流）

**⚠️ 第 3 句为什么是 `The book are good.` 而非 `The books is good.`**：**首版写的 `The books is good.` 被自己拦下**——朴素串匹配测得 0 命中，**严格 token 口径实测命中案 #160（`hunt-all-the-books`，`:8718` 逐字 `"All", "the", "books", "is", "good.",`）**。**换成 `The book are good.`（方向相反的同一条老规矩），严格口径 ✅ FREE。这是「复用核查必须用连续子序列口径」的又一例证。**

### 7.2 L158 · `nobody`

| 字段 | 值 |
|---|---|
| **课注 id** | `lesson-158-nobody` |
| **number** | 158 |
| **title** | `一个人都没到` |
| **grammarLabel** | `没有人 · nobody 自带「不」` |
| **目标句** | `Nobody is here.`（**3 词** ✅） |
| **场景** | `train`（合法 ID ✅；已用 4 课；非 `mansion`／非 `campus`） |
| **一句话规则** | 「说「一个人都没有」：nobody 一个词就够——Nobody is here（一个人都没到）。它肚子里装着「没有人」，后面配 is——第 84 课 someone 那条老规矩。」 |
| **零术语校验** | ✅ `ALL CLEAN` |

**对比卡 6 条（3 带标记 ＋ 3 双正解）**：见 §2.3.3／§2.3.4。

**变体三态**：见 §2.3.5。

**`sceneSwings` 三条**：

| `sceneZh` | `en` | 余量 |
|---|---|---|
| 说这节车厢一个人都没有 | `Nobody is here.` | 本课目标句 |
| 说人都走光了（第 154 课） | `Everyone is gone.` | **6（从未做过答案）** |
| 说有人在门口（第 84 课） | `Someone is at the door.` | 5 |

**复现取材建议**：

- **必取 1**：`Every student is here.`（L152，余量 **5**）——「一个一个都到」与「一个都没到」是最贴的正反。
- **必取 2**：`Someone is at the door.`（L84，余量 **5**）。
- **必取 3**：`I have nothing.`（**余量 6，从未做过 practice 答案**）——东西侧／人侧的对照。
- **⚠️ 避免**：`I don't have anything for you.`（余量 **3**——L157 已用一次，本课再用会到 4；**建议留给后续批次**）、`I am happy.`（余量 **1**）。

**案件设计（`huntCases.ts` #167）**：

```
id: "hunt-nobody-here"
title: "夜车上的空车厢"
scene: "夜车车厢里，座位一个个都空着，只剩你一个"
tokens: [
  "Nobody", "are", "here.",                     ← idx 0–2（新错：-body 配 are）
  "Nobody", "isn't", "here.",                   ← idx 3–5（新错：两个「不」打架）
  "She", "don't", "know.",                       ← idx 6–8（旧错回流 L25）
  "She", "go", "to", "school", "yesterday."      ← idx 9–13（旧错回流 L10）
]
```

- ① `tokenIndex: 1`，`tag: "sv_agreement"`，`are`→`is`（**本课新错**）
- ② `tokenIndex: 4`，`tag: "word_order"`，`isn't`→`is`（**本课新错**）
- ③ `tokenIndex: 7`，`tag: "sv_agreement"`，`don't`→`doesn't`（L25 回流）
- ④ `tokenIndex: 11`，`tag: "tense"`，`go`→`went`（L10 回流）

**⚠️ 两处必须说明的替换（严格口径拦下的）**：

1. **第 3 句原拟 `He don't know.`** —— ❌ **严格口径实测命中案 #165（`hunt-waited-an-hour`，`:8898` 逐字 `"He", "don't", "know.",`）**。**换 `She don't know.`（✅ FREE）。**
2. **第 4 句原拟 `I see her yesterday.`** —— ❌ **严格口径实测命中案 #163（`hunt-still-waiting`，`:8851` 逐字 `"I", "see", "her", "yesterday."`）**。**换 `She go to school yesterday.`（✅ FREE）。**

**⚠️ 另一条已避开的高频错型**：`They is at home.` 实测命中 **案 #163**；`We is happy.` 实测命中 **案 #164** 且 GL `:1250`。**→ 「一伙的配 `is`」这条极常见错型已被近三案用尽，本批两案都避开了它。**

**案件 `tag` 合法性**：`src/types.ts:435` 定义 `tag: GrammarErrorTag`，实测全库 10 种合法值及用量——`tense:65` `plural:115` `sv_agreement:106` `article:29` `missing_be:24` `preposition:62` `run_on:19` `verb_form:135` `word_order:63` `fragment:16`。**本批两案用到的 `word_order`／`fragment`／`sv_agreement`／`tense` 全部合法 ✅。**

### 7.3 两课必需的随批接线（提醒）

1. **`grammarSeasons.ts` 追加 `season-29`**（`min: 157, max: 158`）——**`grammarSeasons.test.ts` 会守门**：`「课程号不落在任何季区间内会被路径页静默过滤（整课不显示、无报错）」`。
2. **`huntCases.ts` 追加 2 案**（#166／#167），`reviewed: true`。
3. **封面**：需 2 张（`cover118`／`cover119`），或复用已用 1 次的现成图。

---

## §8 与已教内容的切分

### 8.1 逐步切分表

| 对谁 | 它教了什么 | 本批教什么 | 怎么切开 |
|---|---|---|---|
| **L151 `all`**（最近） | `All the books are good.`——**三个以上全都**，后面**直接接** `the`，**中间不加 `of`** | `None of the books are good.`——**一个都不**，后面**必须带** `of` | **同一位置、同一堆东西：肯定侧裸接、否定侧带 `of`**——⚠️ **本批第一号撞点**（§8.3） |
| **L152 `every`** | `Every student is here.`——**一个一个来**，后面只说一个 | `Nobody is here.`——**一个人都没到** | **`every` 说「每一个都到」（肯定侧，后面要跟名词）；`nobody` 说「一个都没到」（否定侧，自己就是名词）** |
| **L149 `neither`** | `Neither book is good.`——**两个都不**，后面只说**一个** | `None of the books are good.`——**三个以上都不**，后面带 **s** | **`neither` 管两个（后面单数）；`none of` 管三个以上（后面复数）**——⚠️ **第二号撞点**（§8.2） |
| **L84 `nothing`／`someone`** | `There is nothing in the box.`（**东西侧**，自带「不」）／`Someone is at the door.`（**人侧肯定**，配 `is`） | `nobody`（**人侧否定**）／`none of…`（**一堆东西侧否定**） | **L84 把「东西三兄弟」凑齐了、人侧只给肯定那一个**——本批补人侧否定与一堆东西的否定 |
| **L30 `some/any`**（rule 源头） | `There are some apples on the table.`——「不／没」里换 `any` | 本批**不教「换词」** | **本批主角是「自带『不』」和「`of` 结构」**（§2.1.3） |
| **L80 `in front of`** | **`in front of` 带 `of`／`behind` 不带 `of`** | **`none` 带 `of`／`all` 不带 `of`** | **同型判据、不同词对**——必须并排写（§8.3） |
| **L62 `a cup of tea`** | **量词块的 `of`** | **引桥的 `of`** | **前者 `of` 前面是「量的单位」，后者前面是「一个都不」** |

### 8.2 与 L149 的精细切分（本批最需写清的一处）

| 维度 | L149（已交付） | L157（本批） |
|---|---|---|
| **管几个** | **两个**（`Neither book`） | **三个以上**（`None of the books`） |
| **后面接什么** | **只说一个**：`book`（不带 s） | **带 s**：`the books` |
| **搭档** | `is` | `are` |
| **有没有 `of`** | **没有** | **必须有** |
| **中文入口** | 「两本都不好」 | 「这些一本都不好」 |
| **共同点** | 都站最前面、都自带「不」 | 同 |

**→ 一句话**：**`neither` 是「两个」的否定（后面单数、无 `of`）；`none of` 是「三个以上」的否定（后面复数、必须带 `of`）。**

### 8.3 与 L151／L80 的 `of` 撞点处理（建议写进深挖卡）

| 词 | 带不带 `of` | 例子 | 出典 |
|---|---|---|---|
| `all` | **不带** | `All the books are good.` | L151 `:28435` |
| `in front of` | **带** | `The school is in front of the park.` | L80 `:14831` |
| `behind` | **不带** | `The cat is behind the door.` | L80 `:14813` |
| **`none`** | **带** | `None of the books are good.` | **本批 L157** |

**建议深挖卡标题**：`「谁带 of、谁不带」——这次轮到 none`

**建议文案（零术语已验）**：

> 第 80 课你见过一对：`in front of` 带 `of`、`behind` 不带。第 151 课又见过一个不带 `of` 的：`all` 后面直接接 `the books`。
>
> 今天的 `none` 站在「带 `of`」那一边——它后面必须拴一个 `of`：`None of the books`。**同样是「一堆东西」，`all` 直接接、`none` 要带 `of`——这一对要分开记。**

---

## §9 未核实项

| # | 未核实项 | 现状 | 影响 | 建议谁核 |
|---|---|---|---|---|
| ① | **「这条规矩是第几次」库里有两套编号** | L83 `:15398` 称源头是「第 30 课」；L147 `:27734` 称源头是「第 83 课」；L149 `:28115` 标题称「第三次」 | **本批文案若写「第 5 次」会与库里两套编号都不一致** | 产品负责人拍口径（**建议本批文案不写次数，只写机制**） |
| ② | **L151 把 `All of my books are good.` 当干扰项** | `:28563` 实测 GL=1；真实英语里该形合法 | 本批若在例子里出现 `All of…` 会与 L151 打架；**本轮已主动规避** | 产品负责人（**本轮不建议动 L151**） |
| ③ | **`None of the books is good.` 是否该进对比卡** | 正式书面英语有派别接受 `none` 作单数 | **本轮建议不碰**（会在两可之间困惑用户） | 待有上游课程位依据时再裁 |
| ④ | **L158 第 3 张卡用 `Nobody here.` 还是 `No body is here.`** | 两者全库皆 0；`body` 全库 0（**新词**） | 本轮**推荐 `Nobody here.`** | 产品负责人（二选一） |
| ⑤ | **`school` 是非法场景 ID** | `:15957`／`:16147`／`:16337`／`:16527`／`:17472` 共 5 课 | 渲染时**静默回退 `sparkle`** | **数析／工程师**（不在本批范围，登记） |
| ⑥ | **`way` 的完整造词成本未精算** | 只测了 `get to`=0／`How do I`=0／`turn left`≈1 | 影响轴 B 押后到哪一批 | 下一批研究期（若做「问路」章） |
| ⑦ | **`Every student is here.` 余量 5，本批若 L158 用则到 4** | 已核 | 低 | 工程师配课时复核 |
| ⑧ | **两课封面是复用还是新增** | 117 张现存，分布 1–2 次 | 影响资产生产 | 产品负责人 |
| ⑨ | **⚠️ 朴素串匹配会漏判案件复用（本批新发现的方法学问题）** | 本批 3 句候选错句朴素匹配显示「0 命中」，严格 token 口径下**全部命中已有案件**（§0.4／§10 ⑨） | **若后续继续用朴素匹配配案，会持续产生重复案件** | **建议把严格 token 口径写进配案流程／或加守门测试** |
| ⑩ | **三条常见错型已被近案用尽** | `He don't know.`（#165）／`They is at home.`（#163）／`We is happy.`（#164） | **后续批次「旧错回流」选型空间在收窄** | 建议研究期做一次「错型占用率」盘点 |

---

## §10 附录：本轮全部复跑命令速查

```bash
# ①②③ 词频 / 三口径 / 逐字定位 —— 脚本全文见 §0.1 / §0.2 / §0.3，调用示例：
node /tmp/freq.js
node /tmp/cal.js
node /tmp/ctx.js "all 管肯定侧"
node /tmp/ctx.js "老规矩，第三次来了"
node /tmp/ctx.js "中间不加 of"
node /tmp/ctx.js "Say it another way?"
node /tmp/ctx.js "nothing 自带「不」"

# ④⑤ 合法场景 ID / 场景使用实况
sed -n '6,25p' src/components/AdventureScene.tsx
node -e '
const {readFileSync}=require("fs");
const GL=readFileSync("src/data/grammarLessons.ts","utf8");
const ids=[...GL.matchAll(/scene:\s*"([^"]*)"/g)].map(m=>m[1]);
const u={};ids.forEach(i=>u[i]=(u[i]||0)+1);
console.log(JSON.stringify(u,null,1));
'

# ⑥ 零术语校验（本批全部文案）
cat > /tmp/zt.js <<'EOF'
const Z=["主语","谓语","宾语","表语","定语","状语","单数","复数","三单","原形","时态",
"一般过去时","一般现在时","现在进行时","过去进行时","现在完成时","情态动词","比较级",
"最高级","从句","语序","可数","疑问句","否定句","被动语态","第三人称","形容词","副词","介词"];
const T={
"L157 label":"一个都不 · none 后面跟着 of",
"L157 rule":"说「一个都不」：none 站最前面，后面必须跟着 of——None of the books are good（这几本一本都不好）。中文的「都」上压一个「不」就行，英语这个词后面还拴着一个 of。",
"L158 label":"没有人 · nobody 自带「不」",
"L158 rule":"说「一个人都没有」：nobody 一个词就够——Nobody is here（一个人都没到）。它肚子里装着「没有人」，后面配 is——第 84 课 someone 那条老规矩。",
"L157 c1":"上一课那个 all 后面直接接、中间不加 of；今天这个不一样——它后面必须带 of：None 【of】 the books。",
"L158 c1":"nobody 是「一个人」——配 is：Nobody 【is】 here。第 84 课 someone 那条老规矩。",
"L158 c2":"nobody 自己装着「不」——后面不要再补 not：两个「不」撞一起，意思就翻成「有人在这儿」。第 84 课 nothing 那条老规矩。",
"deepDive":"第 151 课你学过 All the books are good.（这几本全都好）——那是肯定侧。今天轮到否定侧：一本都不好。中文只要在「都」上压一个「不」，英语要把最前面那个词整个换掉，而且换出来的 none 还多带一个 of。"
};
let bad=0;
for(const [k,v] of Object.entries(T)){const h=Z.filter(z=>v.includes(z));
 if(h.length){bad++;console.log("HIT "+k+" -> "+h.join("/"));}}
console.log(bad?"":("ALL CLEAN ("+Object.keys(T).length+" strings)"));
EOF
node /tmp/zt.js   # 实测：ALL CLEAN (8 strings)

# ⑦ 目标句词数（列出全库 >8 词者）
node -e '
const {readFileSync}=require("fs");
const GL=readFileSync("src/data/grammarLessons.ts","utf8");
const L=GL.split("\n");const marks=[];
L.forEach((l,i)=>{const m=l.match(/^\s*id:\s*"(lesson-[\w-]+)"/);if(m)marks.push({line:i+1,id:m[1]});});
marks.forEach((mk,k)=>{const e=(k+1<marks.length?marks[k+1].line:L.length);
 const b=L.slice(mk.line-1,e-1).join("\n");
 const n=+((b.match(/^\s*number:\s*(\d+)/m)||[])[1]);
 const t=(b.match(/^\s*targetSentence:\s*"([^"]*)"/m)||[])[1]||"";
 const w=t.replace(/[.?!]/g,"").split(/\s+/).filter(Boolean).length;
 if(w>8) console.log("L"+n+" ("+w+" words) "+JSON.stringify(t));});
'
# 实测：仅 L86(10)／L101(12)／L102(14) 三课超 8 词（均为「收口·零新知」的拼接句，先例）

# ⑧ 对比卡公式（6 条／带标记分配）
node /tmp/contrast3.js
# 实测（全库 156 课逐课解析，行内格式 = marked/bothRight/plainNull）：
#   ·「恰好 6 条」= 156/156，**全库无一例外** ✅（与任务书一致）
#   · 但「3 条带标记 ＋ 3 条双正解」**不是全库一致形态**，只是主流形态之一：
#       3m/3br/0n -> 49 课（含 L151–L156 全部 6 课）   2m/4br/0n -> 25 课
#       6m/0br/0n -> 23 课（早期课：全标记、无正解卡）  5m/0br/1n -> 12 课
#       1m/4br/1n -> 11 课                             4m/2br/0n -> 10 课
#       其余 6 种形态合计 26 课
#   · **「4m/2br」那 10 课恰好是全部「收口」课**：L51/117/118/124/133/138/141/144/147/150
#   · L129–L156（近 28 课）：3m/3br 共 20 课、4m/2br 共 6 课、2m/3br 共 2 课
# ⚠️ **结论：任务书所称「配方＝3 条带标记新错 ＋ 3 条双正解 ＋ 全库 156 课无一例外」
#    应修正为「6 条/课：全库 156/156 无例外；其中『3 带标记 + 3 双正解』49 课，
#    另有『4 带标记 + 2 双正解』10 课（全部是收口课）等形态」**。
#    本批两课按 L151–L156 的近期水位（3m/3br）设计，与最近 6 课完全对齐 ✅。

# ⑨ ⚠️ 复用核查：严格 token 序列口径（本批新增，**必须用这个**）
cat > /tmp/seq.js <<'EOF'
const {readFileSync}=require("fs");
const H=readFileSync("src/data/huntCases.ts","utf8").split("\n");
const cases=[]; let cur=null; let inTok=false;
H.forEach((l,i)=>{
  const idm=l.match(/^\s*id:\s*"(hunt-[\w-]+)"/);
  if(idm){ cur={id:idm[1],num:null,tokens:[]}; cases.push(cur); }
  if(cur){ const nm=l.match(/^\s*number:\s*(\d+)/); if(nm&&!cur.num)cur.num=+nm[1];
    if(/^\s*tokens:\s*\[/.test(l)) inTok=true;
    if(inTok){ cur.tokens.push(...[...l.matchAll(/"([^"]*)"/g)].map(m=>m[1].replace(/[.,!?;:]/g,"").toLowerCase()));
      if(/\]/.test(l)) inTok=false; } }
});
const GL=readFileSync("src/data/grammarLessons.ts","utf8").split("\n");
const glSeq=[]; GL.forEach((l,i)=>{
  const m=l.match(/^\s*(?:wrong|correct|en|dialogueEn|targetSentence|answer):\s*"([^"]*)"/);
  if(m) glSeq.push({line:i+1,text:m[1]});
  if(/^\s*answer:\s*"/.test(l)){const a=l.match(/answer:\s*"([^"]*)"/); if(a)glSeq.push({line:i+1,text:a[1]});}
});
const norm=s=>s.replace(/[.,!?;:]/g,"").toLowerCase().split(/\s+/).filter(Boolean);
const contains=(h,n)=>{for(let i=0;i+n.length<=h.length;i++){let ok=true;
  for(let j=0;j<n.length;j++)if(h[i+j]!==n[j]){ok=false;break;}if(ok)return true;}return false;};
const probe=s=>{const n=norm(s);
  const hc=cases.filter(c=>contains(c.tokens,n)).map(c=>"#"+c.num);
  const gl=glSeq.filter(g=>contains(norm(g.text),n)).map(g=>":"+g.line);
  return (hc.length||gl.length ? "❌ HC["+hc.join(",")+"] GL["+gl.join(",")+"]" : "✅ FREE")+"  "+s;};
process.argv.slice(2).forEach(s=>console.log(probe(s)));
EOF
node /tmp/seq.js "The books is good." "He don't know." "I see her yesterday." \
  "Nobody are here." "Nobody isn't here." "Nobody here." \
  "None the books are good." "All of the books are good." \
  "The book are good." "She have two books." "She don't know." "She go to school yesterday."
# 实测：前三句 ❌（HC[#160] GL[:28461] ／ HC[#165] ／ HC[#163]）
#       其余 9 句全部 ✅ FREE（= 本批两案最终采用的 8 句 ＋ 1 句备选）
```

---

**报告完 · 瑞思 · 2026-09-20**
