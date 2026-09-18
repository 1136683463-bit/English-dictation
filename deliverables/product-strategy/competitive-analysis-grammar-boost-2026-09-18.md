# 竞品研究报告：课后强化训练 + AI 批改

**日期**：2026-09-18 ｜ **类型**：竞品分析（语法·课后训练与 AI 批改专项）｜ **成员**：竞析（竞品分析师）
**主交付物**：`prd-grammar-boost-2026-09-18.md`

> **核实口径说明**：本报告所有竞品细节均来自公开页面、科技媒体、App Store 官方描述与真实用户评价的检索推断，**无法登录 App 内部验证，逐条标注「未核实」**；仅认知科学/算法类事实标「行业常识」。凡未标记者，均为我方代码核实结论。

---

## ① 竞品概述

**Duolingo（未核实）**：Max 层 $29.99/月、$167.99/年（2023 年发布价，TechCrunch），含 Roleplay（AI 对话）+ Explain My Answer（练习后点按钮进入与 Duo 的问答，解释对错、要例子）；2024 年后新增 Video Call（与 Lily 视频）。Roleplay 的人类专家只写场景与开场白，对话内容由模型自由生成。**关键动态：Explain My Answer 已于 2026 年前后向全体免费开放（未核实）**，付费墙从"解释"移向"对话"。用户侧最尖锐的批评是：AI 解释"不稳定、有时完全无用"，且 Duolingo 用 AI 取代了原有的逐题人类讨论区（未核实）。

**Busuu（未核实，本轮检索价值最高）**：2023-12 Grammar Review（Premium 专属，把学过的语法归类成 Needs practice / Improving / Strong / Mastered 四档进度图，附迷你讲解）；2024-10 Conversations（AI 口语，**反馈刻意放在整段对话结束后**，逐条点评 + 指出"哪些已说得很好"；入口在"章节末尾"的课程标签里，另有独立 Speak 标签页）；**2025-10 Mistake Repair——正是本次功能最直接的对照物**：收集你在课程里犯的错 → 挑出最该练的一个 → **解释你最主要的错误 → 自动生成针对性练习题**，位置"内建在 learning timeline，练习出现在下一章开头"，Premium 无限次、免费用户可试 2 次，初期仅 iOS + 有限语种。

**Babbel（未核实）**：Babbel Speak（AI 对话伙伴，App Store 标为 Beta）走"Guided Conversations → 自由对话"两段；复习侧是 revision manager 按表现调整复习频率（Wikipedia）。**定价把 AI 对话包在订阅内，不单独收费（未核实）**。

**Memrise（未核实）**：GPT-3 时代的 AI Language partner；雅思/GCSE/A-level 备考有 AI 反馈。用户对 AI 的抵触情绪在全样本中最强（"希望能选真人反馈而不是 AI"）。

**ELSA Speak（未核实）**：Speech Analyzer 逐句给发音细节反馈；AI Role-play 对话后给即时反馈；**零基础有"母语起步"的双语 AI 导师**。评价共识：发音反馈真有用，但"内容量压倒性"、"语音算法有时不准"。

**Speak（未核实）**：三步法 Learn → Practice → Apply（AI Tutor）。**Premium Plus 才给"用你犯过的错组装成的复习"**（review assembled from the mistakes you make）+ Made for You 课程，属最高价位。

**Grammarly（写作批改锚点，未核实）**：实时建议 + 语气检测；风格建议自 2015 起就在付费墙后。批评集中于"建议不正确、不懂语境语气、压缩表达自由"。

**对照组**：Anki（行业常识：SM-2/FSRS + 四键自评 + 用户自建卡，无内容）；Quizlet（App Store 官方称 Learn 是"adaptive practice that meets you at your level and adjusts as you improve"，未核实）；Khan Academy（行业常识：mastery learning 概念 + 分层练习，**具体 mastery 档位文档被 Cloudflare 拦截，未能核实**）；Brilliant（官网自述 Koji 看得见你卡在哪、"你准备好就加速、需要就放慢"，**但明确"不给答案，只引导"**，未核实）；Cake（AI 发音教练 + Smart Revision 收藏句复习）。**本土**：墨墨背单词（基于 1200 亿条记忆行为数据的可解释记忆模型 + 动态调度，未核实）、扇贝（"难词定向突破"+ 基于已学词自动生成首字母填空/选词填空，未核实）、百词斩（打卡提醒 + 多种巩固题型 + 组队打卡，未核实）。

---

## ② 功能对比矩阵

> 除「我方」列（代码核实）外，**全部竞品格位均为公开信息推断，一律视为「未核实」**。

| 维度 | 我方（现状） | Duolingo | Busuu | Babbel | Memrise | ELSA | Speak | Quizlet | Anki |
|---|---|---|---|---|---|---|---|---|---|
| 课后练习入口时机 | ⚠️ 关2 次日 20h 解锁；无"课刚上完"的即时入口 | ⚠️ 结算页+Practice Hub，强推 | ✅ **章节末尾 + 下一章开头**（练完即练） | ⚠️ 订阅制课程内置 | ⚠️ 课程内置 | ✅ 课后即练 | ✅ 课后即 Apply | ⚠️ 任意时刻自选 | ❌ 无课程概念 |
| 难度显式分层 | ⚠️ SRS 题型轮换 cloze→rebuild→free_type 隐含由易到难，无显式分档 | ⚠️ 有难度阶梯但无显式说明 | ⚠️ 四档掌握度（非难度分档） | ❌ | ❌ | ⚠️ 分级课程 | ⚠️ 分级课程 | ⚠️ Learn 自适应替代显式分档 | ❌ |
| 自适应难度 | ⚠️ SM-2 调间隔，不调题型难度 | ⚠️ 有 | ⚠️ 有（AI 驱动掌握度图） | ⚠️ revision manager | ❌ | ✅ 自称 | ✅ 自称 | ✅ 官方称 adaptive | ⚠️ 算法调间隔 |
| 逐句/逐处批改 | ✅ AI 日记批改逐处 issues | ⚠️ 仅错题后手动触发 | ✅ Conversations 逐条点评 | ❌（用户明确抱怨"不告诉我错在哪"） | ⚠️ | ✅ 逐句发音 | ✅ 逐句 | ❌ | ❌ |
| 错误归因到类型体系 | ✅ **10 类罪名 taxonomy** | ❌ 无 | ⚠️ 挑"最该练的一个"语法点 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| 变式题生成 | ❌（有故事生成，非变式题） | ⚠️ Target Practice（被批"没真正定制"） | ✅ **Mistake Repair 自动生成练习** | ❌ | ❌ | ⚠️ 生成练习 | ⚠️ Made for You | ⚠️ 自动出题（质量差评多） | ❌ |
| 地道改写 recast | ✅ diaryService 双版本（corrected + recast） | ⚠️ Roleplay 给"更自然说法" | ⚠️ | ❌ | ❌ | ❌ | ⚠️ "natural wording" 反馈 | ❌ | ❌ |
| 无 AI 降级路径 | ✅ AI 默认关闭 + 未配置降级 | ❌ AI 是卖点，无降级 | ❌ | ❌ | ❌ | ❌ | ❌ | ⚠️ | ✅ 纯本地 |
| 离线可用 | ✅ 数据全本地 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ⚠️ | ✅ |
| AI 批改是否付费墙 | ✅ **不存在付费墙（免费自用）** | ⚠️ 由 Max 转免费（未核实） | ⚠️ Mistake Repair Premium 无限/免费仅 2 次 | ⚠️ 含在订阅内 | ⚠️ Pro | ⚠️ Premium | ⚠️ **最高档 Premium Plus** | ⚠️ Learn 无限需 Plus | N/A |
| 零术语面向零基础 | ✅ 红线 | ❌ | ❌ | ❌ | ⚠️ | ⚠️ 有母语起步 | ❌ | ❌ | ❌ |
| 无正确率门禁 | ✅ 红线 | ❌ 能量/心值阻断 | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ 无限需付费 | ✅ |

---

## ③ 定位分析

| | 目标客户 | 品类主张 | 核心差异化 |
|---|---|---|---|
| Duolingo | 大众免费流量 | 游戏化日活 | 规模 + 习惯循环 |
| Busuu | 认真但碎片化的自学者 | **"从错误到掌握"** | 错题 → 生成练习闭环 |
| Babbel | 成人实用口语 | 母语定制课程 | 订阅内置 AI 对话 |
| ELSA / Speak | 职场口语焦虑者 | 开口即练 | 发音/语音 AI |
| Grammarly | 写作场景 | 实时纠错 | 更正 + 语气 |
| **我方** | **单一零基础中文母语自学者** | **零术语连续剧式语法课** | **错误 taxonomy + 全本地 + 无门禁** |

**本报告最重要的一个空白点**：行业里"课后即时可选强化训练"**确有先例，但都做成了"错题驱动的自动生成练习"**（Busuu Mistake Repair 最典型、Speak Premium Plus 次之），而**没有任何一家把 AI 批改从"写作/口语域"延伸到"语法专项课的课后巩固"**。Busuu 的 Mistake Repair 只覆盖"课程里出现的语法错"，Speak 的错题复习只在最高付费档——**这与我方既有结论（语法域 SRS 窗口期 1-2 年）一致，本次研究未发现翻案证据**。

---

## ④ 优劣势对比

**Duolingo**｜优势可参考：练习后的"追问"入口（Explain My Answer 是**用户主动点开**，不打断主流程）；Roleplay 的人类专家只写场景骨架、模型填内容——**"人工定框 + AI 填肉"是成本与质量的最优解**。弱点可攻击：AI 解释"不稳定"，且用 AI 替换了逐题人类讨论区引发长期用户流失——**提醒我们：AI 不能用来"替代"原有更可靠的东西**。

**Busuu**｜优势可参考（**本轮最大收获**）：① 练习**出现在下一章开头**，把"上完课"和"练上节课"缝在同一动线上，不需要用户自己想起来；② 反馈**刻意延后到整段结束后**，避免打断心流（Conversations 的设计理由明确写了这点）；③ 反馈里先讲"你哪里已经对了"，再讲改进；④ **免费可试 2 次**——钩子而非墙。弱点：Mistake Repair 免费仅 2 次 + 仅 iOS + 语种受限；社区互改会出现"错误纠正"；被批评计费方式。

**Babbel**｜优势：复习频率按表现自动调整。**弱点极其可攻击**：App Store 差评 "What did I do wrong? If you would tell me why my answer was wrong it would be so much more helpful"——**只判对错不解释，是行业里最普遍、最被厌恶的失败模式**；还有"答案是它自己给的却说错"、"没教过就考"。

**ELSA / Speak**｜优势：逐句即时反馈 + 无限重试（Speak 明确"想重来多少次都行"）；ELSA 零基础有母语起步。**弱点是 AI 批改的经典失败模式全集**：语音识别不准却给错判；**明明说错了却夸"你做得很好"（假阳性表扬）**；内容错误（发音、语义混淆）；**试用前看不到 AI 质量**（付费墙挡在体验之前，直接劝退，"我连试都没试过怎么可能掏钱"）。

**Quizlet / Brilliant / Khan**｜优势：Quizlet Learn 的自适应与 Anki 的四键自评是"无门禁前提下做个性化"的成熟范式；Brilliant **"不给答案只引导"**值得参考其"引导式追问"。弱点：Brilliant 用户抱怨"标准题连正确答案都不告诉"；Quizlet AI 生成的释义/答案频繁被指错误——**AI 生成内容不做校验就是负债**。

**研究锚点（arXiv 2026-07，未核实）**：《How Well Does AI-Generated Feedback Work?》在 EFL 课堂部署 2,000 名学生、20,000+ 篇草稿，发现**教师专家评分与学生主观有用性之间"低对齐"**——结论是：**批改质量必须用"学习者觉得有用"来验收，而不是用"语言学家觉得正确"来验收**。这直接支持我方 diary 批改的"三档强度"设计。

---

## ⑤ 战略建议

**差异化投资（加码，别人做不到或不愿做）**
1. **错误 taxonomy 是唯一护城河**：Busuu 只说"你最该练这个语法点"，说不出"你第 3 次犯三单错、且已从时态错迁移到主谓一致错"。把 10 类罪名做成课后训练的**选题引擎**，而非只用于日记。
2. **批改锚在"课后 6-10 分钟"这个行业真空**：所有竞品的 AI 批改都在写作域（Grammarly/Busuu）或口语域（ELSA/Speak），**语法课后即时批改无人做**。
3. **"温柔档"是独有资产**：行业 AI 批改一律"全量纠错"，零基础用户被劝退。三档强度在行业里无对应物，应作为海报功能。

**追平（补课）**
1. **反馈延后不打断**（学 Busuu Conversations 的显式设计理由）。
2. **复述"你哪里已经对了"**（Busuu 明确把"看到自己会什么"当作独立模块）。
3. **无限重试**（Speak 的"go again as many times as you need"），与我方无门禁红线天然一致。
4. **人工定框 + AI 填肉**（Duolingo Roleplay 的成本结构），而非让模型自由发挥。

**防守（不做，与既有红线一致）**
实时口语陪练、streak 排行榜、多语种扩张、自研纠错引擎——**本次检索未发现任何需要翻案的证据**。此外新增一条防守项：**不做"AI 生成题目未经校验直接下发"**（Quizlet/Brilliant 的差评主因）。

---

## ⑥ 对本功能的具体设计启示

1. **入口放在课程结算页 + 课程卡片双出口，默认收起、点一下才进**——学 Explain My Answer 的"用户主动触发"，不学 Duolingo 的强推（强推已被列为 App Store 差评主因）。
2. **不新造"课后练习"这个第四关卡**，而是把训练挂在关 1 结算页上，作为**可选增强**，与关 2 的 20h 回访形成"即时热身 → 次日巩固"的两段式，不破坏既有三关卡叙事。
3. **难度分档显式化但去术语**：用"再走一遍 / 换个说法 / 你来出题"这类动作命名，不用"基础/进阶/挑战"标签，并复用 SRS 已有题型轮换（cloze→rebuild→free_type）作为底层难度轴。
4. **选题由 10 类罪名的历史犯错记录驱动**（Busuu Mistake Repair 的机制），并且只生成"变式题"而非重复原题——这是我方相对 Busuu 的增强点。
5. **AI 批改放在练习之后，不放在每道题之后**（Busuu Conversations 的显式理由：避免打断）。
6. **输出结构对齐现有 diary 契约**：逐处 issues（original / correction / explanation / tag）+ recast 地道版 + followUp 追问，复用同一个 prompt 家族与降级路径，不做第二套 AI 管线。
7. **保留"你哪里已经对了"模块**，且温柔档强制"只夸 + 最多指 1 处"——对抗行业最普遍的假阳性与过量纠错问题。
8. **AI 输出的题目与批改必须过校验**：变式题的答案先由确定性规则（课程数据里的 targetSentence/variants）生成，AI 只负责措辞与解释，避免 Quizlet 式"生成内容本身是错的"。
9. **未配置 AI 时给完整可用路径**：只判对错 + 显示标准答案 + 从 taxonomy 取一句预写好的错误讲解（这恰好补上的正是 Babbel 差评"为什么不告诉我错在哪"）。
10. **不做正确率门禁与结算分数**：训练的结束条件是"做完 3 题"或"用户主动退出"，永不出现"未达标需重练"。

---

## ⑦ 竞析的三点待决策（回主理人）

1. 建议把 **Busuu Mistake Repair（2025-10）作为本功能的第一对标物**写进 PRD 的"竞品参照"。
2. 建议新增一条红线：**"AI 生成题目不得未经规则校验直接下发"**，理由是 Quizlet/Brilliant 的差评几乎全部源于此。
3. 本报告**未能核实 Khan Academy 的 mastery 档位**（全站 Cloudflare 拦截），若该机制对设计关键，需人工试用或换检索路径补课。

---

## ⚠️ 未核实清单

1. Duolingo Max 具体现价（$29.99/月为 2023 年发布价，现已变动）
2. Explain My Answer 转为免费的确切时间与范围（Wikipedia 标注需补充来源；Reddit 称"今年早些时候"）
3. Duolingo Practice Hub / Mistakes / Daily Refresh 的具体机制与位置（fan site 403）
4. Duolingo 移除逐题人类论坛的确切时间
5. Busuu Mistake Repair 的"下一章开头"呈现细节、可生成练习的题型、四档掌握度的算法
6. Busuu Premium / Premium Plus 现价（第三方 2024 口径 $13.95/月、€6.66/月）
7. Babbel Speak 是否含在标准订阅内、Beta 状态与定价
8. Babbel revision manager 的具体算法
9. ELSA Premium 价格与免费额度边界
10. Speak Premium / Premium Plus 价格与"错题复习"的具体形态
11. Quizlet Learn 的自适应算法（help 页面被 Cloudflare 拦截）；Plus 价格
12. **Khan Academy mastery 档位（familiar/proficient/mastered）与练习题量要求——文档全部被 Cloudflare 拦截，本报告未采信任何具体档位数字**
13. Brilliant 的"由易到难"是否显式分档，或纯算法自适应
14. Cake Smart Revision 机制
15. 墨墨/扇贝/百词斩/流利说的 AI 功能边界与订阅价（仅依据 App Store 官方文案）
16. 所有竞品的"逐句批改/归因/变式题"格位评级均为公开信息推断，未在 App 内验证

---

## 📚 检索来源 URL

**官方产品/博客**
- https://en.wikipedia.org/wiki/Duolingo ; https://en.wikipedia.org/wiki/Babbel ; https://en.wikipedia.org/wiki/Memrise ; https://en.wikipedia.org/wiki/Lingoda ; https://en.wikipedia.org/wiki/Quizlet ; https://en.wikipedia.org/wiki/Anki_(software) ; https://en.wikipedia.org/wiki/SuperMemo ; https://en.wikipedia.org/wiki/Grammarly ; https://en.wikipedia.org/wiki/Busuu
- https://blog.duolingo.com/duolingo-max/ ; https://blog.busuu.com/ ; https://blog.busuu.com/new-mistake-repair-release/ ; https://blog.busuu.com/new-conversations-release/ ; https://blog.busuu.com/grammar-review-web-release/ ; https://blog.busuu.com/speaking-practice-release/ ; https://blog.busuu.com/speaking-practice-pre-announcement/
- https://www.memrise.com/ ; https://www.speak.com/ ; https://elsaspeak.com/en/ ; https://brilliant.org/ ; https://www.cake.day/

**媒体报道**
- https://techcrunch.com/2023/03/14/duolingo-launches-new-subscription-tier-with-access-to-ai-tutor-powered-by-gpt-4/
- https://techcrunch.com/2025/04/29/google-launches-ai-tools-for-practicing-languages-through-personalized-lessons/
- https://techcrunch.com/2023/10/19/google-takes-aim-at-duolingo-with-new-english-tutoring-tool/

**用户评价 / 独立评测**
- App Store 官方描述与客户评价（iTunes Search & RSS Customer Reviews API，US 区）：Duolingo / Busuu / Babbel / Memrise / ELSA Speak / Speak / Quizlet / Brilliant
- https://www.fluentu.com/blog/reviews/busuu/ ; https://www.fluentu.com/blog/english/elsa-speak-review/ ; https://www.mezzoguild.com/busuu-review/ ; https://www.mezzoguild.com/babbel-review/
- Reddit 讨论与评论（PullPush API 检索 r/duolingo、r/languagelearning 等）：关于 Explain My Answer 准确性、Duolingo 练习/错误清单、Busuu 错题修复的多条评论

**学术**
- arXiv:2607（2026-07）《How Well Does AI-Generated Feedback Work? Intrinsic and Extrinsic Evaluation across more than 20,000 EFL Essay Drafts》（export.arxiv.org API 检索）

**我方代码核实依据**
- `/Users/liujun/Documents/英语听写/src/services/diaryService.ts`（:201 归因到 10 类罪名，:242-244 recast prompt，:313 recast 解析）
- `/Users/liujun/Documents/英语听写/src/services/lessonService.ts`（:101 STAGE2_UNLOCK_DELAY_MS = 20h）
- `/Users/liujun/Documents/英语听写/src/services/reviewService.ts`（:389-416 SM-2 easeFactor/interval 实现）
- `/Users/liujun/Documents/英语听写/src/services/aiHttpClient.ts`（:13 isAiProviderConfigured 需 enabled + baseUrl + apiKey + model 四项齐全，默认关闭）
- `/Users/liujun/Documents/英语听写/src/data/grammarLessons.ts`（75 课）、`src/data/huntCases.ts`（84 案卷）
- `/Users/liujun/Documents/英语听写/deliverables/product-strategy/competitive-grammar-2026-09-13.md:125/145`（既有红线）

---

## 📚 数据来源 & 成员产出索引

- 竞析（本文件，竞品分析）
- 瑞思（用户研究）：`user-research-grammar-boost-2026-09-18.md`
- 数析（数据盘点）：`data-audit-grammar-boost-2026-09-18.md`
- 析客（PRD）：`prd-grammar-boost-2026-09-18.md`
- 路径（路线图）：`roadmap-grammar-boost-2026-09-18.md`

---

> 本研究报告由产品战略团队竞析执笔，经主理人汇编落盘。重要决策请由产品负责人审定。
