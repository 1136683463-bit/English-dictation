# PRD：第四批课程 · 句子变长（宾语从句 + 定语从句）

| 元信息 | 内容 |
|---|---|
| 标题 | 「小美的一天」第四批规格：宾语从句 4 课 + 定语从句 2 课 + 收口 1 课（L35–L41） |
| 日期 | 2026-09-14 |
| 类型 | 功能规格书（内容生产规格，基于已定稿六段式模板） |
| 执笔 | 析客（需求分析师） |
| 前置依赖 | `prd-grammar-advanced-2026-09-12.md` §6.2 R10/R11（本批为其正式展开）；`prd-grammar-three-stages-2026-09-13.md`（三关卡内容来源）；三份研究（瑞思/竞析/数析 2026-09-14） |
| 交付物 | 7 课课程数据（L35–L41）+ ≥7 个新侦探案件（reviewed）+ 封面复用确认 |
| 配档 | 路线图：`roadmap-grammar-clauses-2026-09-14.md`；研究：`user-research-grammar-clauses-2026-09-14.md`、`competitive-analysis-grammar-clauses-2026-09-14.md`、`data-audit-grammar-clauses-2026-09-14.md` |

---

## 📌 TL;DR（执行摘要，3-5 行）

- 核心目标：把学习者从「会说短句」带到「一句话说两件事」——第四批 7 课（L35–L41）：宾语从句 4 课 + 定语从句 2 课 + 收口 1 课。
- 关键决策：① 关系词 that **不进定语从句主线**（只做 who/which；that 放深挖卡认读）；② 课量 7 而非 6/8；③ 零枚举扩展（从句错误由 word_order/fragment/missing_be 承载）；④ 一课一增量，L41 零新知全对比。
- 排序依据：四来源一致「先宾从后定从」；L27 已有 `I know where it is` 种子，续写成本≈0。
- 下一步：排期归路径（见配档路线图）；开工前拍板开放问题 ①④（决策日程见路线图）。

---

## 🎯 核心结论卡片

| 项目 | 内容 |
|------|------|
| 推荐方案 | 7 课（L35–L41）+ 7 案：L35 语序 → L36 that 可选件 → L37 主句动词多样 → L38 转述+否定转移 → L39 who → L40 which → L41 收口 |
| 优先级 | P1（内容生产批次；不阻塞现行 9 周路线） |
| 预期影响 | 补齐 S4「句子变长」；差异化定位「把书末才敢教的东西提前到 A2」（竞析） |
| 资源需求 | ≈3.5–4 人日内容（0.5/课含案件）+ 验收 0.5 + word_order 泛化 0.25 |
| 风险等级 | 中（L39 后置修饰心理转换最可能超时；that 同形干扰未实测） |

---

## §1 问题陈述与批次定位

### 1.1 解决什么问题

学习者已完成 L1–L34：能说短句、能报时间、能问问题，但**句子说不到两件事**——「我知道钥匙在哪」「那个戴眼镜的男生是我哥」这类日常表达缺失。这正是 `GRAMMAR_PEDAGOGY_REVIEW.md` §1.2 的第 5 阶段 can-do（「能说出因果、能描述带修饰的东西」），也是 `GRAMMAR_PRODUCT_PLAN.md:158` 定义的 S4「句子变长」。竞析确认：面向初学者的「产品化从句训练」在中文侧仍是视频课/考研拆解形态，无中文负迁移专项、无产出→回流闭环——**本批是把既有路径的自然延伸做成章**。

### 1.2 前置已铺完，本批只是合拢

- L19/L20（连词）→ 句子连接意识
- L27（疑问词系统）+ L33（代词）→ 宾从的直接桥梁（`I don't know where it is` 已进 L27 variants/guided，`grammarLessons.ts:4863`、`:4956`）
- L25（三单）→ 定从内主谓一致的复现载体

### 1.3 与旧规划 R10/R11 的升级关系

`prd-grammar-advanced-2026-09-12.md` §6.2 的 R10（宾语从句 1 课）/R11（定语从句 1 课）是选题池级别的占位。本批是它们的**正式展开**，且按三份研究结论升级了结构：R10 的 1 课扩为宾从 4 课（语序这座桥必须单独走，不能和 that 混一课）；R11 的「who/which/that」三词收为「who/which 主线 + that 深挖」，理由见 §3。旧 R12/R13 不在本批，路线图另行处理。

---

## §2 拆课方案与逐课规格

### 2.1 课量决策：7 课（不是 6，也不是 8）

| 方案 | 取舍 | 裁决 |
|---|---|---|
| 6 课 | 宾从 3 + 定从 2 + 收口 1——砍的是转述课（tell/say + 否定转移）。但 L27 只教了 I don't know 一句，宾从主句动词单一，产出段会反复生产同一句式；且「I don't think…」这个中式高频点无落位 | ✗ |
| **7 课** | 宾从 4 + 定从 2 + 收口 1 = L35–L41 | **✓ 拍板** |
| 8 课 | 加上 that vs wh- 单独收口——与 L41 功能重叠，一课一增量红线被破；单人生产 4 人日 vs 3.5 人日，前批 10 课刚落地，节奏不宜再冲 | ✗ |

**7 课理由**：宾从 4 课对应 4 个独立增量（wh-语序 / that / 主句动词多样 / 否定转移），每课都有真新点；定从 2 课对应「人 who / 物 which」两次后置修饰训练，不可合并（合并后单课承载两个新词 + 一个心理转换，超 10 分钟红线）；收口 1 课对齐 Murphy U102 的「书末收口」形态前置到 A2。总人日 ≈3.5–4（每课 0.5，含案件）。

### 2.2 逐课规格

**L35 我知道它在哪（宾语从句 · wh- 语序）**

| 项 | 内容 |
|---|---|
| grammarLabel | 「话中话 · 疑问句回家换鞋」 |
| targetSentence | I know where it is. |
| 核心目标句 | I know where it is. / I don't know where it is. |
| 场景 | 出门前找钥匙，妈妈问你知不知道钥匙在哪（续 L27 的找钥匙场景，衔接成本≈0） |
| 新知识点（一课一增量） | **只有一件**：疑问句住进句子里面时，「回家要换鞋」——Where is it? → I know where it is（be 从主语前退回主语后，语序还原）。不碰 that、不碰 what/whether |
| 对比卡方向 | ① `I know where is it.` ❌ → `I know where it is.` ✅（真错：直译语序）；② `Where is it?` 问句 ✅ 并排 `I know where it is.` 陈述 ✅——同一件事，站的位置不同，衣服不同 |
| 变体方向 | 肯定 I know where it is. / 否定 I don't know where it is.（直接复用 L27 noteZh 已有话术）/ 疑问 Do you know where it is?（疑问句里的从句 still 换鞋） |
| 复现题设计 | guided 放替换题：复现 L27「Where is my key?」（问句原形），把它装进 I know 后面，is 要怎么动；practice 复现 L33 "This one is mine." 作干扰环境 |
| 案件规划 | 新案 hunt-key-clue「门卫的字条」（§4） |
| 六段要点 | watch 按「主句段→从句段→合体」分步揭示（瑞思建议）；arrange token≤6 |

**L36 我觉得她会来（宾语从句 · that 是可选小挂件）**

| 项 | 内容 |
|---|---|
| grammarLabel | 「话中话 · 小挂件 that」 |
| targetSentence | I think she is tired. |
| 场景 | 课间看同桌趴在桌上，跟同学说你的想法 |
| 新知识点 | **只有一件**：说想法用 I think + 一句话；that 是可拆的拉链小挂件，可以挂（I think that she is tired.）也可以不挂（I think she is tired.）——**漏 that 不是错** |
| 对比卡方向 | ① `I think she tired.` ❌ → `I think she is tired.` ✅（真错：从句缺 missing_be——把已有错误类型放进新结构，不是 that 问题）；② `I think that she is tired.` ✅ 并排 `I think she is tired.` ✅——两件都对！that 挂不挂都行（本课唯一允许「双正解」的对比条，教学点是「不强求」） |
| 变体方向 | 肯定 I think she is tired. / 否定 I don't think she is tired.（否定转移的认读种子，正式讲在 L38）/ 疑问 Do you think she is tired? |
| 复现题设计 | practice 复现 L25「He drinks milk every day.」→ I think he drinks milk every day.（R8：三单放进从句内部）；guided 复现 L34 过去进行变体 |
| 案件规划 | 新案 hunt-homework-guess「作业本上的猜测」（§4） |

**L37 我不知道他在哪（宾语从句 · 主句动词多样 + 听说）**

| 项 | 内容 |
|---|---|
| grammarLabel | 「话中话 · know / hear / forget」 |
| targetSentence | I don't know where he is. |
| 场景 | 小区门口，邻居阿姨问小美某个同学住哪 |
| 新知识点 | **只有一件**：主句动词可以换人——know（知道）/ hear（听说）/ forget（忘了）后面都能装同一句话；**不引入新的从句语序点**（继续复用 L35 的「换鞋」） |
| 对比卡方向 | ① `I don't know where is he.` ❌ → `I don't know where he is.` ✅（再现 L35 语序点，站不住就叫回来）；② `I hear he is new here.` ✅ 并排 `I hear is he new?` ❌——听说后面装的是陈述句，不是问句 |
| 变体方向 | 肯定 I know where he lives. / 否定 I don't know where he is. / 疑问 Do you know where he lives? |
| 复现题设计 | practice 复现 L26「There is a book on the desk.」→ I know there is a book on the desk.（存在句住在从句里）；guided 复现 L30 数量词 |
| 案件规划 | 新案 hunt-lost-dog「找狗启事」（§4） |

> ⚠️ 词汇审计：hear 在现有语料中出现极少（grep: hear 1 次）；L37 须把 hear 作为「超纲词 ≤3–5/课」名额之一配中文注释（「听说」），或改用已高频的 know/forget 组合——**本条列为生产前终审项**（开放问题②，兜底：收窄为 know 变奏，标题改「我不太确定他在哪」）。

**L38 她说她会来（宾语从句 · tell/say + 否定转移）**

| 项 | 内容 |
|---|---|
| grammarLabel | 「话中话 · 转述别人的话」 |
| targetSentence | She says she will come. |
| 场景 | 运动会前，小美把妈妈的话转告给教练 |
| 新知识点 | **只有一件**：转述别人说的话——主句 She says + 从句原话照装；中文「我觉得她不会来」的否定习惯在英语里跑回主句：**I don't think she will come**（中式「我不觉得」负迁移的正解） |
| 对比卡方向 | ① `She says she will comes.` ❌ → `She says she will come.` ✅（真错：will 后原形，复用 L29/L34 话术）；② `I think she will not come.` ❌ 并排 `I don't think she will come.` ✅——**否定搬回主句**是英语的习惯（本课 why 主线，放对比卡第 2 条） |
| 变体方向 | 肯定 She says she will come. / 否定 I don't think she will come. / 疑问 Do you think she will come? |
| 复现题设计 | practice 复现 L29「I am going to watch a movie.」→ She says she is going to watch a movie.（R8：将来放进从句） |
| 案件规划 | 新案 hunt-team-message「接力棒留言」（§4） |

**L39 那个戴眼镜的男生（定语从句 · who 指人）**

| 项 | 内容 |
|---|---|
| grammarLabel | 「给名词挂尾巴 · who」 |
| targetSentence | The boy who wears glasses is my brother. |
| 场景 | 校门口接人，指给同学看哪个是你哥 |
| 新知识点 | **只有一件**：给名词挂尾巴——中文「的」在前（戴眼镜的男生），英语尾巴在后（the boy **who wears glasses**）。who 是「这个人」的替身，帮他在从句里做事 |
| 对比卡方向 | ① `The boy wears glasses is my brother.` ❌ → `The boy who wears glasses is my brother.` ✅（真错：两条句子直接拼起来，没人当钩子——中文直译典型错）；② `The boy is my brother who wears glasses.` ❌ → `The boy who wears glasses is my brother.` ✅（真错：尾巴挂错位置，挂到句尾去了——修饰对象错位） |
| 变体方向 | 肯定 The boy who wears glasses is my brother. / 否定 The boy who wears glasses is not my brother.（贴尾修饰不变）/ 疑问 Is the boy who wears glasses your brother? |
| 复现题设计 | practice 复现 L25「He plays football.」→ 装进 who 从句：The boy who plays football is my friend.（R8：三单在从句里复活——关系从句内主谓一致） |
| 案件规划 | 新案 hunt-family-photo「一张全家福」（§4） |
| 摩擦控制 | 本课是全程 token 最长课——arrange 拆两段做（主句段 + 从句段合成），token 上限 8 强制执行 |

**L40 我读过的那本书（定语从句 · which 指物）**

| 项 | 内容 |
|---|---|
| grammarLabel | 「给名词挂尾巴 · which」 |
| targetSentence | This is the book which I read. |
| 场景 | 课桌分享会，推荐一本自己读过的书 |
| 新知识点 | **只有一件**：尾巴也能挂到东西上——which 是「这个（东西）」的替身；which 后面的东西**可以搬家**（I read it → the book which I read，it 消失，which 上场） |
| 对比卡方向 | ① `This is the book I read it.` ❌ → `This is the book which I read.` ✅（真错：尾巴里多了一个 it——多代词的冗余，中文「我读过它」直译）；② `This is the book which I read it.` ❌ → correct 同上（重复强调 it 必须消失） |
| 变体方向 | 肯定 This is the book which I read. / 否定 This is the book which I don't like.（贴尾）/ 疑问 Is this the book which you read? |
| 复现题设计 | practice 复现 L33「These are my books.」→ These are the books which I like.；guided 复现 L34 |
| 案件规划 | 新案 hunt-book-swap「图书交换角」（§4） |

> ⚠️ L40 关键决策：省略关系代词（the book I read）**不进 L40 主线**（那是 L41 收口课的认读点，对齐 Murphy U102——「书末才敢教的东西提前到 A2 但一次只给一口」）。

**L41 一句话说两件事（收口课 · 宾从 vs 定从混排）**

| 项 | 内容 |
|---|---|
| grammarLabel | 「收口 · 两句话拼一句」 |
| targetSentence | I know the boy who wears glasses.（双结构合体句） |
| 场景 | 期末班会，小美向新老师介绍同学和班级的事 |
| 新知识点 | **零新增**——全批复用。唯一新材料：「钩子可以省」（the people we met 型）在深挖卡认读，不进必做题 |
| 对比卡方向 | ① `I know the boy who he wears glasses.` ❌ → correct（双谓语/重复代词——**按开放问题①的裁决执行**，若验证不采用则换 `I like the boy is tall.` 型真错）；② 宾从错 vs 定从错的二选一：`I know where is he.` ❌ 并排 `I know the boy who is my friend.` ✅——两种尾巴都不换鞋（宾从换鞋 vs 定从不换鞋，一句话对撞） |
| 变体方向 | 肯定 I know the boy who wears glasses. / 否定 I don't know the boy who wears glasses. / 疑问 Do you know the boy who wears glasses? |
| 复现题设计 | 本课即全批总复现：practice 4 题中 2 题分别复现 L35（where it is 型）与 L39（who 型）原句变体；guided 复现 L27 疑问词原句 |
| 案件规划 | 收官案 hunt-class-intro（省略钩子只做深挖卡认读，不配案——默认单案，见开放问题③） |

---

## §3 中文负迁移处理专章

| 干扰类型 | 机制 | 讲解话术方向 | 归入 |
|---|---|---|---|
| **宾从语序直译**（\*I know where is he） | 中文「他在哪」疑问语序直接搬入 | 「疑问句搬进别人家里，要换拖鞋」——Where is it? 是站在门口的句子；住进 I know 后面，is 要退回 it 后面 | **对比卡（主线必修）**，L35 第 1 条 + L37/L41 再现 |
| **that 省略当错误** | 中文无对应虚词 | that 是「可有可无的小挂件」——挂上也对，不挂也对；本产品**不把漏 that 设为错** | 对比卡（L36 双正解条）+ 深挖卡 |
| **双谓语 / 重复主语代词**（\*The man who he helped me） | 中文无关系词、保留从句内主语 | 「一个萝卜一个坑」——who 已经替了「他」的位置，再站一个他就挤了 | **待验证**（开放问题①）：若采用，L39 深挖卡先认读、L41 对比卡收口；否则不进主线 |
| **定语前置直译 / 回避从句**（「的」在前） | 语序类型差异：前置修饰→后置修饰 | 「先叫人，再挂尾巴」——先说出 the boy，再把「戴眼镜的」这条尾巴挂他后面；中文的「的」住前面，英语的尾巴住后面 | **对比卡（主线必修）**，L39 第 1 条 |
| **which 从句内多 it**（\*the book which I read it） | 中文「我读过它」直译 | 「替身上场，本尊退场」——which 已经替了 it，尾巴里就不许再有 it | **对比卡（主线必修）**，L40 第 1/2 条 |
| **关系从句内主谓一致**（\*The boy who like…） | 与 L25 三单同源 | 不单独讲——作为 R8 复现题载体（L39 practice 装载） | 复现题（不设对比卡） |
| **否定转移**（I think she will not come → I don't think…） | 中文「我觉得她不会来」vs 英语否定搬回家 | 「坏消息让主句说」——「不」字回到 I don't think 里 | **对比卡（主线必修）**，L38 第 2 条 |
| **that 同形干扰**（指代词 that / 关系词 that） | L17/L21/L24 已高频教过指示词 that | 关系词 that 一律放 deepDive 折叠卡，零术语讲「that 也能当钩子」；主线不出现，避免三义同台 | **深挖卡（隔离）** |

---

## §4 案件规划（7 案）

**总规则**：7 案对应 L35–L41 每课 ≥1 案，L35 首日必须有案。每案 4 处错 = 新错 2 + 旧错 2（旧错混入 50%）；旧错罪名从已学池挑且不出现未学结构；每处错锚定单个 token 即可修——correction 为单词、含标点粘连的短语形或「去掉 X」型删除（与现有案件口径一致，如 `lost → did you lose`、`去掉 most`）；每案留 ≥1 净词；话术零术语。新错承载限 word_order / fragment / missing_be 三者，tag 全部在现有 10 枚举内，零新增。

**word_order 文案泛化需求（研发项，P0 阻断）**：现 `GRAMMAR_ERROR_TAG_PLAIN.word_order` =「形容词要放在名词前面」（`huntService.ts:39`）、`tagHintForWrongGuess.word_order` =「看看修饰词应该站在名词的前面还是后面」（`huntService.ts:127`），只覆盖形容词。本批从句语序错误复用 word_order 罪名，须先泛化文案：PLAIN 改为「词语站错了位置——英语的语序和中文不太一样」，hint 改为「看看这句里哪个词站错了位置」。只改文案，不动枚举与 tagStats 长度（10）断言（`huntService.test.ts:109`）。

| 案件 id | 配课 | 场景 | 定稿错误构成（原 → 修正） |
|---|---|---|---|
| hunt-key-clue | L35 | 门卫大叔留的字条（说钥匙可能在哪） | N1：`is it → it is`（word_order，新错）；N2：`is the key → the key is`（word_order，新错）；O1：`key → keys`（plural，旧错）；O2：`in the door → at the door`（preposition，旧错） |
| hunt-homework-guess | L36 | 作业本空白处的猜测句 | N1：`tired → is tired`（missing_be，新错）；N2：`at home → is at home`（missing_be，新错）；O1：`is → are`（sv_agreement，旧错）；O2：`boy → boys`（plural，旧错） |
| hunt-lost-dog | L37 | 小区布告栏的找狗启事 | N1：`is he → he is`（word_order，新错）；N2：`at the school → is at the school`（missing_be，新错）；O1：`live → lives`（sv_agreement，旧错）；O2：`on 8 → at 8`（preposition，旧错） |
| hunt-team-message | L38 | 田径队的接力留言 | N1：`ready → is ready`（missing_be，新错）；N2：`think she will not → don't think she will`（word_order，新错）；O1：`say → says`（sv_agreement，旧错）；O2：`comes → come`（verb_form，旧错） |
| hunt-family-photo | L39 | 外婆相册里的全家福手写说明 | N1：`wears → who wears`（fragment，新错）；N2：`tall → is tall`（missing_be，新错）；O1：`have → has`（sv_agreement，旧错）；O2：`in the left → on the left`（preposition，旧错） |
| hunt-book-swap | L40 | 图书交换角的交换登记 | N1：`it → 去掉 it`（fragment，新错）；N2：`on the desk → is on the desk`（missing_be，新错）；O1：`likes → like`（sv_agreement，旧错）；O2：`on the corner → in the corner`（preposition，旧错） |
| hunt-class-intro | L41 | 新老师的第一张班级介绍卡 | N1：`is he → he is`（word_order，新错）；N2 候选（待开放问题①裁决）：`he → 去掉 he`（fragment，新错），若否决则本错替换为 `wears → who wears`（fragment，新错）；O1：`live → lives`（sv_agreement，旧错）；O2：`in the school gate → at the school gate`（preposition，旧错） |

> 上线前每案须按 `huntCases.ts` 头部 R15 口径逐案人工校验（语法正确性、罪名标注、话术、tokenIndex），标记 `reviewed: true`。

---

## §5 验收标准

### 5.1 覆盖数析 12 项护栏的检查清单（生产与研发共用，任何一条不过即打回）

- [ ] **G1 practice 下限与变体题**：每课 practice ≥4 题；至少 1 题 answer 与 variants 否定/疑问卡 en **逐字一致**（含标点）——`grammarLessons.test.ts:10-28` 机器校验
- [ ] **G2 tokens/answer 一致**：tokens 去标点小写后词集 = answer；distractors 整词不与答案词重复——`grammarLessons.test.ts:30-66`
- [ ] **G3 recall 三字段**：L35+ 每课 recall 的 promptZh / intentZh / answer 非空（noteZh 建议填）——`grammarLessons.test.ts:68-78`
- [ ] **G4 防退化打乱**：arrange/practice 中 >2 词的题，展示序≠答案序——`lessonService.test.ts:236-260`
- [ ] **G5 罪名枚举**：所有案件 tag ∈ 现有 10 枚举（本批仅用 word_order / fragment / missing_be / verb_form / tense / sv_agreement / plural / preposition）；零新增
- [ ] **G6 案件结构**：tokenIndex 对齐 token 文本（忽略标点）；每案 errors 4 处、每处 correction 单 token 可修；每案留 ≥1 净词；reviewed=true——`huntService.test.ts:312-330`
- [ ] **G7 罪名面板钉死**：tagStats 长度断言=10 不动（改词表文案可以，改枚举不行）
- [ ] **G8 封面**：cover 复用池 24 张（10 对复用先例）；L35–L41 沿用静态 import，缺省回退 scene SVG
- [ ] **G9 路径页分组**：L35+ 自动落入 season-3（min 25 / max 999）无需改代码——`GrammarPathPage.tsx:239-244`
- [ ] **G10 can-do 里程碑**：m5 afterLesson=34 之后无锚点——本批**不新增里程碑**（等更长线收口，列入 Non-goals）
- [ ] **G11 关 2 回访问卷**：题源自动 = targetSentence + variants 三态——每课 variants 必须齐三态，否则回访题不足
- [ ] **G12 关 3 重审/回马枪**：每课 huntCaseIds ≥1（L35 首日必须有案）；L35–L41 连续有案，链路健康

### 5.2 Given/When/Then 抽查（QA 抽测剧本）

- **Given** 学习者完成 L27（会问 Where is my key?）**When** 进入 L35 看到对比卡 `I know where is it.` **Then** 能指出 is 站错了位置（点对 wrongMark），且解释不含「宾语从句」术语
- **Given** 学习者刚在 L36 variants 看过 `I don't think she is tired.` **When** practice 出现该句变体题 **Then** tokens 词集与 answer 逐字一致、distractors 无重复词
- **Given** 学习者在 L39 破案段遇到 `The woman wears red is my aunt.` **When** 只修 wears → who wears **Then** 修正后句子语法全对（不得残留第二处错）
- **Given** 学习者完成 L41 全批 **When** 进入关 3 旧案重审 **Then** 混入案件含 30–50% 旧罪名且不出现未学结构（不定式/被动/时态呼应）
- **Given** 完成 L35 首日 **When** 打开侦探页 **Then** hunt-key-clue 已解锁（不出现「完课无案可破」断点）

---

## §6 Non-goals

- **不做**不定式/动名词（want to / -ing 主语）——三份研究一致：独立认知负荷，留第五批；允许自然出现在例句（I want to know…）但不设教学目标、不进任何必做题
- **不做**时态呼应（主句过去 → 从句过去：He said he was…）——L38 限定现在时场景（She says…）
- **不做**被动语态（be + done 体系）
- **不做** not…but、条件句、虚拟语气
- **不做**关系代词 that 主线（裁定见 TL;DR；深挖卡认读级出现，不进 guided/practice/recall/output）
- **不做**省略关系代词的主线考核（L41 深挖卡认读 only，对齐 Murphy U102 但一次只给一口）
- **不做** whose / where / when 关系副词、非限定从句（逗号从句）
- **不新增** GrammarErrorTag 枚举、不改 tagStats 长度
- **不新增** can-do 里程碑、不新增 schema 必填字段（零迁移）
- **不改动** L1–L34 既有数据与六段模板结构
- **不做** what/whether 引导的宾从（本批只走 wh- 与 that 两型）

---

## §7 开放问题（真正开放的决策点）

1. **双谓语错误示例是否采用**（\*The man who he helped me）——语言学常识推断，无产品内证据；建议：L39 深挖卡先以「认读」出现，L41 视上线后 hunt 误报率与复发率再决定是否进对比卡。**若采用，L41 对比卡第 1 条 = 双谓语，hunt-class-intro N2 按此定稿；若不采用，替换为 `I know the boy is tall.`（缺钩子型真错），案件相应改写。** 拍板时机：L41 生产前（路线图排 11/30，默认建议：不采用）。
2. **L37 主句动词 hear 的词汇成本**——hear 全库仅 1 次（几乎超纲）；若核心 500 词表终审否决，改用 know 变奏。**兜底方案：L37 主句动词收窄为 know 的否定/疑问变奏 + 标题改「我不太确定他在哪」**，课程结构不变。拍板时机：L37 生产前（路线图排 11/16，默认：降级）。
3. **L41 单案还是双案**——受单人生产节奏影响；默认单案 + 省略钩子只做深挖卡（不配案）。拍板时机：L41 生产前（路线图排 11/30）。
4. **核心 500 词表终审**——本批新词候选（tired / glasses / wear / photo / hear / live）中哪些落在核心 500 内、哪些配注释；数析已指出核心 500 词表资产不存在，只能代理抽查；需产品负责人按经验终审。拍板时机：L35 相关词在 W6 开工前（10/18），全表在 M3 门（11/15）。

---

## §8 里程碑（粗略，正式排期归路径）

| 阶段 | 产出 | 说明 |
|---|---|---|
| M0 规格冻结 | 本 PRD 评审通过 + 开放问题 1/2 拍板 | 前置：无（可立即开始） |
| M1 打样 | L35 单课全量（含 hunt-key-clue）+ 零基础走查一次（清 localStorage，重点看语序对比卡 noticing 与长句摩擦） | D1 式验收：有效认知时长 ≥6min、practice 一次通过率观察 |
| M2 生产 | L36–L41 六课 + 6 案（每课 0.5 人日，合计 ≈3.5–4 人日） | 沿用 `produce_second_batch.py` 数组尾插模式 |
| M3 验收 | §5 全量 checklist + 抽测剧本 | 与测试脚本双轨 |
| M4 上线观察 | 遥测四指标（guidedFirstTry/practiceFirstTry、word_order 复发率、hunt 误报率、关 2/关 3 完成率） | 挂在既有埋点上，无需新工程 |

> 与 9 周路线的衔接：本批整体排 M3（11/15）后启动，W6–W7 仅做 L35 打样——最终以路线图为准（见配档 `roadmap-grammar-clauses-2026-09-14.md`），本 PRD 不锁定日期。

---

## ✅ 行动清单

| # | 行动 | 负责方 | 时间窗 |
|---|------|--------|--------|
| 1 | 拍板开放问题 ①④（词表终审与双谓语取舍的输入收集） | 产品负责人 | 10/18 / 11/15 / 11/30（见路线图日程） |
| 2 | word_order 文案泛化（2 处，改文案不动枚举） | 开发 | W6 首日（10/19） |
| 3 | L35 数据 + hunt-key-clue 生产；零基础走查 | 内容 | W6–W7（10/19–11/1） |
| 4 | G4-A 打样门裁决（D1 式口径） | 产品负责人 | 11/8 |
| 5 | L36–L41 + 6 案生产（含 §7 各拍板点） | 内容 | W10–W12（11/16–12/6） |
| 6 | §5 全量验收 + 打包上线 | 内容/开发 | W13（12/7–12/13） |
| 7 | G4-B 上线观察门（8 项遥测） | 产品负责人 | 12/27 |

---

## ⚠️ 待确认 / 假设 / Non-goals

- **待确认**：§7 四个开放问题（均有默认方案，到点未拍板自动落默认）。
- **假设**：huntCaseIds 多案挂载、六段字段、三关卡内容自动取源均已就绪（三关卡已上线、L34 已验证单案挂载）；单人节奏按 ≤3 人日/周封顶。
- **依赖**：word_order 文案泛化（§4）须在 L35 案件生产前完成，否则案件解释文案与案情不符。
- **Non-goals**：见 §6（不定式/时态呼应/被动/that 主线/新增枚举等）。
- **风险**：① 定从「后置修饰」心理转换——L39 最可能超 10 分钟红线（缓解：arrange 拆段、token≤8、深挖卡默认折叠）；② that 同形干扰若在 L36 意外引发混淆（备选：双正解条后置到 L41，不影响拆课结构）。

---

## 📚 数据来源 & 成员产出索引

- 析客（需求分析师）：本 PRD 全部（拆课方案、逐课规格、负迁移专章、案件规划、验收、Non-goals、开放问题）
- 瑞思（用户研究员）：`user-research-grammar-clauses-2026-09-14.md`（关键发现 F1–F5、负迁移专项、8 条体验建议）
- 竞析（竞品分析师）：`competitive-analysis-grammar-clauses-2026-09-14.md`（四来源编排规律、差异化定位、选题建议）
- 数析（数据分析师）：`data-audit-grammar-clauses-2026-09-14.md`（12 项护栏、罪名承载分析、8 项决策门指标、缺口清单）
- 路径（路线图规划师）：`roadmap-grammar-clauses-2026-09-14.md`（排期、两道决策门、风险登记册、开放问题日程）

---

> 本报告由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。
