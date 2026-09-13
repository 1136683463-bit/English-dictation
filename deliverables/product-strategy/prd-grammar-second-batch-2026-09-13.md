# 功能规格书（PRD）：「小美的一天」第二批课程——现在完成时拆课 + 对比课（L21–L24）

| 元信息 | 内容 |
|---|---|
| 标题 | 第二批课程规格：现在完成时 Murphy 式拆 3 课 + 一般过去时对比课 |
| 日期 | 2026-09-13 |
| 类型 | 功能规格书（内容生产规格，基于已定稿六段式模板） |
| 执笔 | 析客（需求分析师） |
| 前置依赖 | prd-grammar-depth-2026-09-13.md（§1 目标、§6 需求池、§7 六段结构预算）；decision-gate-d1-grammar-2026-09-13.md（有条件放行，L21–L24 首玩遥测绑定验证）；六段式模板已定稿 |
| 交付物 | 4 课课程数据（L21–L24）+ 5 个新侦探案件（已 reviewed）+ 封面/场景确认 |

---

## 📌 TL;DR

第二批拍板为 **3+1 = 4 课（L21–L24）**：现在完成时按 Murphy 节奏拆 3 课（基本式「刚做完」→ 经历「去过」→ 结果「对现在的影响」），第 4 课做与一般过去时的对比收口。选 3+1 而非 4+1 的核心原因是：**D1 决策门已把第二批验证窗口锁定为 L21–L24 四课**，4+1 会把对比课挤到 L25，遥测验证计划落空；且学习者从未见过「第三种动词形状」，3 课新知 + 1 课对比已是认知负担上限。

核心减负手段：**不规则做过版每课只引入 2 个，全批共 6 个**（done/eaten → been/seen → broken/written），规则动词用「做过版 = 昨天版」一句话白捡；全程零术语（「做过版」「信号灯」「昨天版」话术延续）。

---

## 🎯 核心结论卡片

| 维度 | 结论 |
|---|---|
| 拆课方案 | **3+1 = 4 课**：L21 have+做过版（刚做完）→ L22 have been to（说经历）→ L23 have lost/broken（结果还在）→ L24 对比课（昨天版 vs 做过版） |
| 分词负担 | 不规则做过版分布：L21 引入 done、eaten；L22 引入 been、seen；L23 引入 broken、written；L24 零新增全复用。规则动词统一话术「做过版和昨天版长得一样」 |
| 六段映射 | 严格按 §7 预算：看 90–140s / 跟 50–80s / 忆 40–60s / 练 100–160s / 产 50–80s / 破 60–110s |
| 破案规划 | 新增 5 案（L21×1、L22×1–2、L23×1、L24×2），每案 3–4 错 = 新错 1–2 + 旧错 1–2，全部单 token 可修，新错复用现有罪名枚举（verb_form / tense），**零枚举扩展** |
| 验收 | §5 守卫级 checklist，覆盖 guided 四型、practice 变体逐字一致、distractors 整词不重复、recall intentZh、深度 6 字段、超纲词 0–3、对比课真错 |
| 风险 | **中高**：L03 旧知识「have = 有」负迁移 + recall 无提示产出「have + 做过版」难度陡增（D1 已点名 recall 一次通过率首玩 0/3）——L21 recall 明确降档到「昨天的核心句」，见 §4.5 |

---

## §1 拆课方案与理由

### 1.1 为什么是 3+1，不是 4+1

1. **验证窗口锁定**：D1 决策门放行条件白纸黑字绑定「L21–L24 首玩遥测」（有效认知时长 ≥6min、遥测健康四项）。4+1 会把对比课推到 L25，**四课窗口内就没有对比课**，而对比课恰恰是全批次最能产生「教学摩擦」（practice 通过率 70–85% 目标）的内容——拿基本式课去凑验证，摩擦结构最弱，数据会失真。
2. **认知负担上限**：学习者的动词形状世界只有两格（原形 / 昨天版），现在要开第三格（做过版）。Murphy《Essential Grammar in Use》把 have done 也拆成三个单元（14/15/16：have done → gone-been → just done），行业标杆就是这么拆的。硬塞 4 课新知会让 L24 前的每课分词存量逼近 4 个不规则词，超出初学者短时记忆承受力。
3. **内容生产节奏**：第二批同时背负「20 课补字段 + 遥测口径修复」的工程项，4 课总量让内容排期与上线窗口吻合。

### 1.2 分词引入分布表（守卫级，逐课核对）

| 课 | 新引入不规则做过版 | 白捡（不占负担） | 本课分词存量 |
|---|---|---|---|
| L21 | **done**（do 的做过版）、**eaten**（eat 的做过版） | finished、watched（规则：做过版 = 昨天版，加 -ed） | 2 不规则 + 2 规则 |
| L22 | **been**（be/am/is 的做过版；昨天版是 was）、**seen**（see 的做过版） | gone（仅深挖卡认读，**不进任何必做题**） | 2 不规则（+1 认读） |
| L23 | **broken**（break 的做过版；昨天版是 broke）、**written**（write 的做过版） | lost（lose 的昨天版和做过版**同形**，零新增）、cleaned | 2 不规则 + 2 白捡 |
| L24 | **零新增** | 全批 6 个分词复用；gone 在深挖卡二次认读（「去了还没回来」） | 复用 8 |

> 话术锚点（继承现有课风格）：做过版 = 动词的第三件外套。大多数动词的做过版和昨天版长得一样（watched 就是 watched）；只有几个老词走自己的路：do→done、eat→eaten、see→seen、be→been、break→broken、write→written。

### 1.3 每课规格速览

| 课号 | 标题 | grammarLabel | episode | targetSentence | 场景 | 与前面课程的复现关系 |
|---|---|---|---|---|---|---|
| L21 | 作业写完了 | 现在完成时 · have + 做过版 | 小美的一天 ㉑ | I have done my homework. | 清晨出门前，妈妈指门口问作业。NPC："Have you finished your homework?" → 我："I have done my homework." | practice 复现 L10「昨天版」（Yesterday I ate / went）；examples 呼应 L03 have a new bag（一词两义正面拆解）；scenes 呼应 L16 must finish |
| L22 | 去过北京 | 现在完成时 · have been to / have seen | 小美的一天 ㉒ | I have been to Beijing. | 班级新同学课间聊旅行和电影。NPC："Have you been to Beijing?" → 我："I have been to Beijing." | 复现 L09 go to the library（地名语序 been to Beijing）；复现 L05 I like music（谈喜好的延续）；复现 L21 have+done 句骨架 |
| L23 | 钥匙不见了 | 现在完成时 · have lost / have broken | 小美的一天 ㉓ | I have lost my key. | 放学回家，门口翻遍书包找钥匙，外婆帮忙开门。NPC："Is it in your bag?" → 我："I have lost my key." | 复现 L18 介词（Is it in your bag?）；复现 L03 have a key（新句式对比）；复现 L21 忆段句式 |
| L24 | 昨天去了，还是去过了？ | 对比 · 一般过去时 vs 现在完成时 | 小美的一天 ㉔ | Yesterday I went to the park. ＋ I have been to the park.（双核心句） | 周日晚写周记，妈妈来聊天。周记句 "Yesterday I went to the park."；妈妈问 "Have you been to the new park?" → 我答 "I have been to the park." | 全批总收口：L10 went/ate/saw、L21–L23 全部核心句在 practice 与破案中螺旋混排 |

### 1.4 一词两义的正面处理（L21 关键设计）

L03 学过「I have a new bag」（have = 有），L21 起变成「I have done」（have = 装做过版的信号灯）。**不回避、不假装没这回事**：L21 对比卡第 2 条直接做 `I have a bag.` vs `I have done my homework.` 的并排揭示——have 后面跟「东西」是「有」，跟「做过版」是「做过了」，看 have 后面站的是什么词。深挖卡展开讲这一点。这是本批最大负迁移点，必须在主线讲，不能塞进折叠卡。

---

## §2 认知层级与六段映射（逐课）

> 结构与预算以 PRD §7 为准；以下只写各课六段的**内容要点**。guided 四型固定 = 1 choose + 2 arrange + 1 spot；practice 4 题中第 4 题固定放「与 variants 否定/疑问变体逐字一致」题；每课 practice 留 1 题位做跨课复现（R8）。

### L21 作业写完了（基本式 · 刚做完）

| 段 | 内容要点 |
|---|---|
| ① 看 · 辨识 | **why 主线**：中文一个「了」字，英语用 have + 做过版来装——「作业写**了**」= I have done my homework。对比揭示 ×2：① "I have do my homework." ❌ → have 后面站做过的版，do 的做过版是 done（why：一场戏里 have 已经换了位置，动词要穿做过版的外套）；② "I have a bag. / I have done my homework." 并排——have 后面跟东西 = 有，跟做过版 = 做过了。variants：肯定 I have done my homework. / 否定 I haven't done my homework.（noteZh：haven't = have not，have 后面加 not）/ 疑问 Have you finished your homework?（noteZh：Have 搬到句首）。sceneSwings ×3：早餐桌（I have eaten breakfast.）、画室（I have finished my picture.）、球场（I have watched the game.）。deepDive 3 段：为什么 have 后动词要变形状 / 做过版和昨天版的异同表 / 一词两义拆解 |
| ② 跟 · 辨识 | choose：I ___ my homework.（have / has / had，考 have 不随 I 变）；arrange ×2：I have done my homework. ／ I have eaten breakfast.（词块乱序 + 1 个干扰词块）；spot：["I", "have", "do", "my", "homework."] → do ❌ 改 done |
| ③ 忆 · 回忆 | 忆 L10 的**已知句**降档（见 §4.5）：promptZh「周日的日记本摊在桌上，写下昨天最开心的一件事」intentZh「我昨天去了公园」→ Yesterday I went to the park.（intentZh 必填，无选项遮盖） |
| ④ 练 · 构造 | ① I have done my homework.（distractors: has、do）② I have eaten breakfast.（distractors: eat、ate——ate 是昨天版，考新旧形状分辨）③ 复现题：Yesterday I went to the park.（distractors: go）④ 变体逐字一致题：Have you finished your homework?（对应 variants 疑问卡） |
| ⑤ 产 · 产出 | 半提示题：句型框「I have + ____（做过版）+ my homework.」+ 词库 done/eaten/finished → 出 I have finished my homework.（考：从词库挑对**做过版形状**）；无提示题：intentZh「我写完了作业」→ I have finished my homework.（考：整句自组 + 形状自选） |
| ⑥ 破 · 纠错 | 新案 hunt-homework-note「书包里的字条」（详见 §4 案件规划） |

### L22 去过北京（经历 · 说去过哪儿、见过什么）

| 段 | 内容要点 |
|---|---|
| ① 看 · 辨识 | **why 主线**：说「去过某地方、见过某东西」像翻相册——不用报哪一天，have + 做过版直接说。对比揭示 ×2：① "I have be to Beijing." ❌ → be 的做过版是 been，不是 be 本身（why：做过版是另一件外套，不能拿原形充数）；② "I have seen that film." ✅ 并排 "I see that film yesterday." ❌ —— 有 yesterday 就回昨天版（为 L24 埋线）。variants：肯定 I have been to Beijing. / 否定 I haven't seen that film. / 疑问 Have you been to Beijing?。sceneSwings ×3：相册前（I have seen that film.）、地图前（I have been to Beijing.）、聊宠物（I have been to the zoo.）。deepDive 3 段：been 和 was 是一个动词的两件外套 / gone 认读段（gone = 去了还没回来，been = 去过回来了，认读不考核）/ 为什么说经历不报日子 |
| ② 跟 · 辨识 | choose：I have ___ to Beijing.（been / was / go，考 been ≠ was）；arrange ×2：I have been to Beijing. ／ I have seen that film.；spot：["She", "have", "been", "to", "the", "zoo."] → have ❌（主语 She 的信号灯是 has——**只认读改对，不展开 has 体系**，见 Non-goals） |
| ③ 忆 · 回忆 | 忆 L22 核心句：promptZh「新同学问你暑假去过哪儿，轮到你说了」intentZh「我去过北京」→ I have been to Beijing.（本课起 recall 恢复考新句型，L21 已降档一次） |
| ④ 练 · 构造 | ① I have been to Beijing.（distractors: was、go）② I have seen that film.（distractors: saw——昨天版混入，考分辨）③ 复现题：I go to the library.（L09 复现，distractors: go to school 语序块）④ 变体逐字一致题：I haven't seen that film.（对应 variants 否定卡） |
| ⑤ 产 · 产出 | 半提示题：句型框「I have + ____（做过版）+ to + 地名」+ 词库 been/seen/gone → 出 I have been to Shanghai.（考：挑对 been；gone 是陷阱词块，考「去了还没回来」不适用于经历表述——半提示强度兜底）；无提示题：intentZh「我看过那部电影」→ I have seen that film. |
| ⑥ 破 · 纠错 | 新案 hunt-photo-album「相册里的一页」＋备选案 hunt-new-classmate（详见 §4） |

### L23 钥匙不见了（结果 · 对现在还有影响）

| 段 | 内容要点 |
|---|---|
| ① 看 · 辨识 | **why 主线**：有些「做过了」的事，**现在还看得见结果**——钥匙丢了，现在还进不了门。这时重点不是哪一天丢的，是「现在还没找回来」：I have lost my key。对比揭示 ×2：① "I have lose my key." ❌ → lose 的做过版是 lost（why：lose 走的老路，做过版不加 -ed）；② "I have broken my cup." ✅ 并排 "I break my cup yesterday." ❌ —— 有 yesterday 用昨天版 broke。variants：肯定 I have lost my key. / 否定 I haven't found it.（found 超纲改用 I haven't cleaned my room. 保持词内）/ 疑问 Have you broken anything?（改：Have you cleaned your room?）。sceneSwings ×3：家门口（I have lost my key.）、厨房（I have broken my cup.）、书房（I have written a letter.）。deepDive 3 段：为什么丢钥匙用做过版（结果还在现在）/ lost 白捡说明（昨天版做过版同形）/ broken、written 的形状对照 |
| ② 跟 · 辨识 | choose：I have ___ my key.（lost / lose / losed——losed 是常见杜撰形）；arrange ×2：I have lost my key. ／ I have written a letter.；spot：["I", "have", "break", "my", "cup."] → break ❌ 改 broken |
| ③ 忆 · 回忆 | 忆 L23 核心句：promptZh「外婆在门口等你，你翻遍了书包，该告诉她坏消息了」intentZh「我丢了钥匙」→ I have lost my key. |
| ④ 练 · 构造 | ① I have lost my key.（distractors: lose、losed）② I have broken my cup.（distractors: broke——昨天版混入）③ 复现题：Is it in your bag?（L18 介词复现，distractors: on、at）④ 变体逐字一致题：I haven't cleaned my room.（对应 variants 否定卡） |
| ⑤ 产 · 产出 | 半提示题：句型框「I have + ____（做过版）+ my + 东西」+ 词库 lost/broken/written → 出 I have broken my cup.（考：三选一形状）；无提示题：intentZh「我写好了一封信」→ I have written a letter. |
| ⑥ 破 · 纠错 | 新案 hunt-lost-key「门口的求助字条」（详见 §4） |

### L24 昨天去了，还是去过了？（对比收口课）

| 段 | 内容要点 |
|---|---|
| ① 看 · 辨识 | **why 主线（人话切口）**：「**有具体时间点**（yesterday、last week）→ 动词穿**昨天版**：Yesterday I went to the park。**只说『做过了、去过』，不报时间**，事情又和现在有关 → have + **做过版**：I have been to the park。」一句话判据：**句子里有时间点吗？有 → 昨天版；没有、只说经历或影响 → 做过版。** 对比揭示 ×2（**wrong 必须真错**）：① "I have seen that film yesterday." ❌ → correct "I saw that film yesterday."（why：yesterday 站在句子里，就得用昨天版，做过版和具体时间点不能同台）；② "Yesterday I have done my homework." ❌ → correct "Yesterday I did my homework."。variants：肯定 I have been to the park. / 否定 I didn't go out yesterday.（昨天版否定，考旧知识）/ 疑问 Have you been to the new park?。sceneSwings ×3（每条都是「一句话选对形状」的示范）：日记里（I went to the park yesterday.）、聊天时（I have eaten breakfast, so I am full.）、照片前（I have been to Beijing.）。deepDive 4 段：两句话并排讲透（went vs have been 的分工）/ gone vs been 二次认读（去了还没回来 vs 去过回来了）/ 信号词小清单（yesterday、last week、…ago → 昨天版；just、不报时间 → 做过版）/ 时间线小图文字版 |
| ② 跟 · 辨识 | choose：___ I went to the park.（Yesterday / Just / Now——考信号词决定形状）；arrange ×2：Yesterday I went to the park. ／ I have been to the park.（两组词块故意高度相似，含 went/been 各一，考分辨）；spot：["I", "have", "seen", "that", "film", "yesterday."] → seen（或 have）❌——出题时标注唯一 wrongToken：seen ❌ 改 saw（ Yesterday 型真错） |
| ③ 忆 · 回忆 | 忆 L24 核心句（对比句二选一）：promptZh「妈妈问你去没去过新开的公园」intentZh「我去过那个公园」→ I have been to the park. |
| ④ 练 · 构造 | ① Yesterday I went to the park.（distractors: have、been——考「有时间点不给 have」）② I have been to the park.（distractors: went、Yesterday——反向考）③ 复现题：I ate two sandwiches.（L11 复现，distractors: eat）④ 变体逐字一致题：I didn't go out yesterday.（对应 variants 否定卡） |
| ⑤ 产 · 产出 | 半提示题：给两个 intentZh（「我昨天去了公园」/「我去过北京」）+ 句型框各一个（Yesterday I + 昨天版 ／ I have + 做过版 + to + 地名）→ 各出一句（考：按时间点有无**选对形状**）；无提示题：intentZh「我昨天吃了面条」→ I ate noodles yesterday.（考：无提示下识别「昨天」信号选昨天版——这是对比课的终极考法） |
| ⑥ 破 · 纠错 | 新案 hunt-diary-mix「混了时间的日记」＋ hunt-weekend-note「外婆的周末字条」（详见 §4） |

---

## §3 对比课（L24）设计专章

### 3.1 人话切口（主线必修，常显）

> **看句子里有没有「具体时间点」。**
> 有——yesterday、last week——用**昨天版**：Yesterday I went to the park.
> 没有，只说「做过了、去过」，事情和现在有关——用 **have + 做过版**：I have been to the park.
> 昨天版讲故事（哪一天、干了啥）；做过版说结果（去过了、还在呢）。

### 3.2 三类内容方向

| 内容 | 方向 |
|---|---|
| **对比卡**（contrast ×2） | 两条都是「同内容、只换时间表达」的最小对：① have 做过版句里混入 yesterday → 真错；② Yesterday 句里误用 have + 做过版 → 真错。每条 whyZh 一句话讲清「时间点在场，昨天版必须登场」 |
| **对话** | 周记（书面、有时间点 → 昨天版）和饭桌聊天（口头、只说经历 → 做过版）两幕自然交替，让两种形状在同一晚的剧情里各干各的活；`me` 台词一句昨天版一句做过版 |
| **变体与场景变奏** | variants 的否定卡给**昨天版否定**（I didn't go out yesterday.，复用 L10 did not 话术），疑问卡给**做过版疑问**（Have you been to the new park?，复用 L21 Have 搬句首话术）——一张卡同时盘活两套旧知识；sceneSwings 三条按「日记 / 聊天 / 照片」分配，形成「时间点有无」的条件反射 |

### 3.3 刻意不做

- 不做「同一动词 12 格变化表」（Murphy 左页式）——那是深挖卡的文字版时间线足够。
- 不做「两种时态自由写作二选一」——output 保持六段模板的半提示→无提示两档。

---

## §4 侦探案件规划（新增 5 案）

**总规则**：每案 3–4 处错 = **新错 1–2 + 旧错 1–2**；旧错罪名只从已学罪名池挑（tense / plural / article / sv_agreement / verb_form / preposition / word_order / missing_be / fragment / run_on，且不得使用未来课罪名）；**每处错必须单 token 可修**（correction 为一个 token，允许含标点粘连，与现有案件口径一致）；新错话术零术语（沿用「做过版」「昨天版」）。新错 tag 复用现有枚举：漏做过版/形状错 → `verb_form`；新旧形状混用/时间点错配 → `tense`。**零枚举扩展**。

| 案件 id | 配课 | 场景 | 错误构成（新 N / 旧 O） |
|---|---|---|---|
| hunt-homework-note「书包里的字条」 | L21（1 案） | 妈妈清晨留在书包里的一张字条 | N1：have do → done（verb_form）；N2：have eated → eaten（verb_form）；O1：Yesterday I go → went（tense，L10 旧罪名）；O2：two sandwich → sandwiches（plural，L11 旧罪名） |
| hunt-photo-album「相册里的一页」 | L22（主案） | 小美和外婆一起翻旧相册，念出照片背后的字 | N1：have see → seen（verb_form）；N2：I have was to Beijing → been（verb_form）；O1：a apple → an apple（article，L04 旧罪名）；O2：We was → were（sv_agreement，L10/07 旧罪名） |
| hunt-lost-key「门口的求助字条」 | L23（1 案） | 邻居贴在楼门口的寻钥匙字条 | N1：have losed → lost（verb_form，杜撰形陷阱）；N2：have broke → broken（verb_form）；O1：in the box → on the box（preposition，L18 旧罪名——注意此处按上下文真错）；O2：My keys is → are（sv_agreement） |
| hunt-diary-mix「混了时间的日记」 | L24（主案） | 一篇把两种时间搅在一起的周记 | N1：Yesterday I have seen → saw（tense，**本批核心新错型**：时间点与做过版同台）；N2：I have eat → eaten（verb_form）；O1：go to school yesterday → went（tense 旧型）；O2：three book → books（plural） |
| hunt-weekend-note「外婆的周末字条」 | L24（第 2 案） | 外婆冰箱上的周末安排便条 | N1：have went → gone→改为考核 safe 形：have did → done（verb_form）；O1：was → were（sv_agreement）；O2：in Monday → on Monday（preposition）；O3（备用）：must to go → must go（verb_form，L16 旧罪名「must 后动词不变」） |

> 上线前每案须按 huntCases.ts 头部 R15 口径逐案人工校验（语法正确性、罪名标注、话术、tokenIndex），标记 `reviewed: true`。

---

## §5 验收标准（数据 schema 硬规则 · 守卫级）

生产与研发共用此 checklist；任何一条不过即打回。类型校验基于 `src/types.ts` 现有接口，**不新增必填字段、零迁移**。

### 5.1 六段结构与题型构成

- [ ] 每课六段齐全：看（watch）→ 跟（guided）→ 忆（recall）→ 练（practice）→ 产（output）→ 破（huntCaseIds ≥1）；单课时长落 PRD §7 预算区间 390–630s
- [ ] **guided ≥4 题**，构成恰为 1 choose + 2 arrange + 1 spot；每题带 explain；spot 带 correctionZh
- [ ] **跨课复现题 ≥1 道**/课（guided 或 practice 段均可，缺省放 practice，R8 口径），复现对象为上一课或更早已学句式，答案句在其来源课数据中存在
- [ ] **practice ≥4 题**，每题带 distractors ≥1；**至少 1 题（固定第 4 题）与 variants 的否定或疑问变体逐字一致**（答案句与 variants.en 完全相同，含标点）
- [ ] **distractors 整词不与答案词重复**：任一 distractor token（忽略大小写与标点）不得与该题 answer 拆分出的任何 token 相同
- [ ] **recall 必含 intentZh**（+ promptZh / answer / noteZh 四字段齐备）；answer 与本课 targetSentence 或指定核心句一致
- [ ] output 两题：第 1 题带结构提示（句型框 + 词库），第 2 题无提示；半提示在无提示之前

### 5.2 深度字段（深度 6 字段全量）

- [ ] `dialogue` 恰 3 句（who: npc/npc/me，en+zh）
- [ ] `contrast` 恰 2 条；**wrong 必须真错、correct 必须真对**（人工复核 + 语法自查双保险）；每条 whyZh ≤60 字、零术语、无挫败字眼
- [ ] `variants` 恰 3 条（肯定/否定/疑问，各带 noteZh）
- [ ] `sceneSwings` 恰 3 条
- [ ] `deepDive` 2–4 段，标题为有信息量的问句（R2 口径）
- [ ] `summary` 含 rule + points ≥3

### 5.3 词汇与话术红线

- [ ] **超纲词 0–3 个/课**，逐课列出清单并给出中文注释位（本批已知：L21 just、L22 Beijing（专名）、L24 already——上线前按核心 500 词表终审）
- [ ] 主线与对比卡话术零术语：不得出现「现在完成时」「过去分词」「助动词」「时态」等术语（grammarLabel 元字段除外）；统一话术 = 「做过版」「昨天版」「信号灯」「固定搭档」
- [ ] 不出现挫败性字眼；无「必须全对才能继续」设计（阶梯提示口径，R12）

### 5.4 破案段

- [ ] 每课 `huntCaseIds` 1–2 个；新案已标记 `reviewed: true`
- [ ] 每案 errors 3–4 处：新错 1–2（本批 → verb_form/tense）+ 旧错 1–2（已学罪名）；**每处 correction 单 token 可修**
- [ ] 新案话术零术语；案件词汇落在核心 500 词（必要难词进 notes 生词提示）

### 5.5 Given/When/Then 抽查（QA 抽测剧本）

- **Given** 学习者完成 L10（学会昨天版）**When** 进入 L21 破案段遇到 "Yesterday I go…" **Then** 能凭旧罪名独立修出 went，且新错（have do）答错时半提示指向「做过版」而非术语解释
- **Given** 学习者刚在 variants 卡看过 "Have you finished your homework?" **When** practice 第 4 题出现同句点词成句 **Then** 词块含 ≥1 干扰项且答案逐字等于 variants.en
- **Given** 学习者在 L24 破案段遇到 "Yesterday I have seen that film." **When** 只修 seen → saw **Then** 修正后句子语法全对（不得残留第二处错）

---

## §6 Non-goals（明确划界）

- **不做** from / since 的精确区分（含 "for two years" 时长表达）——初学者负担，留给后续批次
- **不做**现在完成进行时（have been doing）
- **不做**被动语态（be + done 体系）
- **不做** already / yet / ever / never 副词系统——仅 L24 深挖卡信号词清单中「认读级」出现 just/already，不进任何必做题
- **不做** gone vs been 的主线考核——仅在 L22/L24 深挖卡认读，不进 guided/practice/output/recall
- **不做** he/she has done 的第三人称系统性训练——guided/spot 至多以干扰项或单点认读出现 has，不安排产出题
- **不做**过去分词不规则表总集（6 个之外的 irregular participles 不出现）
- **不改动**既有 20 课数据与六段模板结构；不新增 schema 必填字段
- **不做**自由写作段（R13 维持 P2 停车）

---

## ✅ 行动清单

| # | 行动 | 负责 | 前置 | 产出 |
|---|---|---|---|---|
| 1 | 核对 L21–L24 scene id 是否在 AdventureSceneId 枚举内（campus/city/mansion/forest 等），缺则补插画或回退 | 析客 + 研发 | 本 PRD 评审 | 4 课 scene 确认单 |
| 2 | 按本规格生产 4 课数据（含深度 6 字段全量） | 析客 + 内容 | #1 | L21–L24 数据 |
| 3 | 生产 5 个新侦探案件并逐案人工校验标 reviewed | 析客 | #2 | 5 案入池 |
| 4 | 跑 §5 守卫 checklist（建议落成脚本校验 + 人工抽查双轨） | 研发 + 析客 | #2、#3 | 校验报告 |
| 5 | 按 D1 放行条件试玩 L21–L24 首玩遥测（关 HMR/用打包版），核对时长 ≥6min、practice 70–85%、recall 通过率观察项 | 数析 | #4 | 绑定验证报告（D1 收口） |
| 6 | 超纲词按核心 500 词表终审（just / already / Beijing / film） | 析客 | #2 | 超纲词终审单 |

---

## ⚠️ 待确认 / 假设 / 风险

**待确认（需产品负责人拍板）**

1. L21 recall 降档方案（忆 L10 旧句 vs 忆本课新句）：本规格选「L21 降档、L22 起考新句」，依据是 D1 裁决点名 recall 首玩 0/3——若倾向严格考新句，需同步接受 L21 recall 通过率可能 <30% 并触发复核条款。
2. L22 的 has 单点认读（spot 题里 She have → has）：是否担心超前引入三单 have？本规格按「只认读、不展开」处理，如需彻底回避可换错型。
3. L24 双核心句（targetSentence 字段存哪句）：建议存 "Yesterday I went to the park."，对比句 "I have been to the park." 放 intentZh/contrast 承载——targetSentence 为单句字段，需研发确认无单句假设的渲染逻辑。

**假设**：huntCaseIds 多案挂载能力已就绪（L10/L11/L13/L20 已验证）；`recall`、`deepDive`、半提示产出等字段渲染已随模板定稿上线。

**最担心的风险**：L03「have = 有」与 L21「have + 做过版」的一词两义负迁移，叠加 recall 无提示产出难度陡增——双风险集中在 L21，是本批唯一可能让「卡住 ≤5 次」护栏破防的课，缓解手段已在 §1.4 与 §2 L21 忆段落位。

---

## 📚 数据来源索引

| 来源 | 内容 |
|---|---|
| prd-grammar-depth-2026-09-13.md | §1 三目标、§6 R5/R6/R8 验收口径、§7 六段结构与时长预算、§9 第二批拍板 |
| decision-gate-d1-grammar-2026-09-13.md | L21–L24 验证窗口锁定、recall 0/3 观察项、放行条件五条 |
| src/data/grammarLessons.ts（20 课） | 话术风格锚点（「昨天版」「-ing 外套」「固定搭档」）、L10 过去时全量结构、深度字段形态、huntCaseIds 配课模式 |
| src/data/huntCases.ts（28 案） | 案件结构、罪名分布、单 token 修复口径、R15 校验流程 |
| src/types.ts | GrammarLesson/LessonRecall/GrammarErrorTag 枚举——确认新错零枚举扩展可行 |
| Murphy, *Essential Grammar in Use* Unit 14–16 | 拆课节奏（have done → gone/been → just done）与「每单元只给几个不规则形」的做法 |
| 用户原话（2026-09-13，试玩 L13–L20） | 「太短/讲不透/练太少」三条抱怨 → 本批全部按六段模板新产，不复用旧四段 |

---

> 本报告由产品战略团队析客执笔，重要决策（§待确认 1–3）请由产品负责人审定。
