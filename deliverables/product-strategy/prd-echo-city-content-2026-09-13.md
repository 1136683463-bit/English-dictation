# 回声城世界内容生产 PRD

**日期**：2026-09-13
**类型**：PRD（工作流 W1，续接站台关卡页优化项目）
**参与成员**：方向明（主理人）、析客（需求规格）
**上游输入**：GRAMMAR_ADVENTURE_PLAN §4/§5（回声城定位：全线高潮，机制=时态）、站台世界 8 关已验证的内容管线

---

## 📌 TL;DR

- **核心目标**：生产回声城（S2 谓语动词，全线高潮）10 关内容 + 6 张新符文，复用站台已验证的完整内容管线（三拍子/settle 因果链/红线测试），机制零改动。
- **关键决策**：分 3 批生产（3+4+3，按时态族群）；批 1 顺带打通多世界技术通路（解锁/路由/数据索引）；过去时占 3 关（初学者最大坑）。
- **回声城独有资产**：误读支线"时间线错乱"四拍模板（复读→城市反应→错误时间后果→点拨），让时态错误获得世界级叙事皮肤。
- **下一步**：批 1（G1-G3 现在系统 + 世界解锁接入）。

---

## 🎯 核心结论卡片

| 项目 | 内容 |
|------|------|
| 推荐方案 | 新建 echoGateScripts.ts + 6 新符文 + 世界解锁逻辑，10 关分 3 批交付 |
| 优先级 | P1（站台 P0 手感已验证，回声城为设计文档钦定的全线高潮） |
| 预期影响 | S2 教学点全覆盖（六类时态）；误读支线叙事资产从站台级升级为世界级 |
| 资源需求 | 纯内容生产 + 少量接入改动；判定引擎/埋点零改动 |
| 风险等级 | 中（G10 完成时难度可能过重；误读支线"复读错句"与语法红线冲突需裁决） |

---

# PRD 正文（析客）

**版本**：v1.0　**状态**：待产品负责人审定
**范围**：回声城（S2 谓语动词世界）10 关内容的生产标准、教学点地图与批次计划。本文不定关卡成稿。

## 1. 问题陈述与目标

**为什么是现在**：站台 8 关 P0 已验证核心手感——剧情三拍子（目标句型高亮复现）、任务预告、settle 因果链构成完整闭环；数据管线（gateScripts / GATE_STORIES / runes + L1 判定 + 埋点）成熟可复用。此时开回声城边际成本最低：机制零改动，纯内容生产。

**为什么是回声城**：设计文档明确定位 S2 为全线高潮，机制（时态）与主题（时间线错乱的城市）完全咬合，"最值得投入"；时态恰是成人初学者最大痛点（中文无时态标记），教学价值与叙事价值同向叠加。

**目标（3 个，正交）**：
1. 交付 10 关内容 + 6 张新符文，覆盖 S2 全部教学点，红线测试全绿。
2. 产出回声城独有内容资产：误读支线的"时间线错乱"叙事模板。
3. 打通多世界技术通路（解锁、路由、数据索引），为后续世界铺路，但不实现它们。

**成功指标**（本地埋点）：回声城 `gate_abandoned` 率不高于站台均值；`gate_hint_used` 中 hint1/hint2 占比不低于站台（证明梯度有效）；`rune_unlocked` 新符文 6/6 触发。

## 2. 10 关教学点地图

难度螺旋：G1–G7 单时态单点突破 → G8–G10 混合辨析。过去时占 3 关。G1 承接站台结尾 teaser——"念你那句话的"，就是回声城。

| 关 | 教学点（topicId，拟） | 模式 | 目标句方向（非成稿） | 符文 | 误读 errorTag | 时间线叙事钩子 |
|---|---|---|---|---|---|---|
| G1 | 一般现在 s2-present-simple | say | "I live near the old tower." 型自述 | 现在之钟（新） | tense | 城墙复读你在站台说过的话；守钟人登场："城市记得每句话，但它只对'现在'开门" |
| G2 | 三单 s2-third-person | complete | "She goes to work by tram." | 三单之刺（新） | sv_agreement | 复读市民转述第三人称的事；漏了 s，城市把动作安错人 |
| G3 | 主谓一致 s2-sv-agreement | respond | "My friends live across the river."（复数主语，与 G2 对照） | 一致之链（新·稀有） | sv_agreement | 市民合唱各说各的主语，链子配不上对就全城走调 |
| G4 | 现在进行 s2-present-cont | complete | "The bells are ringing again." | 进行之波（新） | missing_be | 漏了 be，城市静止——正在发生的波纹凝固在半空 |
| G5 | 一般过去·规则动词 s2-past-regular | say | "I arrived yesterday evening." | 过去之痕（复用） | tense | 档案馆登记你的来路；说成现在，档案把你写成"还没出发的人" |
| G6 | 过去·不规则①（go/come/see） s2-past-irregular-1 | complete | "She went home before dark." | 过去之痕（复用） | tense | 不规则动词是城市的"旧方言"；用原形，街道把你拉回错的那天 |
| G7 | 过去·不规则②（take/buy/eat/have）+ 时间状语 s2-past-irregular-2 | respond | "We took the night train last week." | 过去之痕（复用） | tense | 夜市老人考你三件往事，答对才点亮回旅馆的路 |
| G8 | 将来·will s2-future-will | say | "The gate will open at dawn." | 将来之门（新） | tense | 城东门只对"将来"显形；说成现在，门永远在你面前关着 |
| G9 | be going to（计划）vs will（意愿）辨析 s2-future-going-to | complete | "I am going to visit the clock tower." | 将来之门（复用） | tense | Omar 客串谈生意：写进日程的用 going to，脱口而出的用 will |
| G10 | 现在完成 + 全线混合辨析 s2-present-perfect | respond | "I have never seen a talking city." | 完成之桥（新） | tense | 高潮：大钟敲响，三条时间线同时敞开；完成 vs 过去正面对决 |

覆盖校验：一般现在 G1／三单 G2／主谓一致 G3／现在进行 G4／过去 G5–G7／将来 G8–G9／完成 G10，六类全覆盖；模式 say×3 / complete×4 / respond×3。errorTag 只用既有四类中的三类，不新增判定类型。

## 3. 新增符文清单

6 张（过去之痕已定义，直接复用并校验归属），world=S2。

| 符文 | id（拟） | oneLineRule 方向 | 对应关 |
|---|---|---|---|
| 现在之钟 | rune-present-clock | "每天都发生的事，动词用原形" | G1 |
| 三单之刺 | rune-third-sting | "他她它，动词加 s" | G2 |
| 一致之链 | rune-agreement-chain | "主语和动词要配得上对" | G3 |
| 进行之波 | rune-ing-wave | "正在发生，be + ing" | G4 |
| 将来之门 | rune-future-gate | "还没发生，will 开路" | G8–G9 |
| 完成之桥 | rune-perfect-bridge | "经历过的事，have + 过去分词" | G10 |

撰写标准：oneLineRule ≤20 字中文、口语可背诵、禁用语法术语；spells 3 条（规则正例 / 高频主语动词不规则优先 / 回声城场景词嵌入），每条 5–8 词全高频词。

## 4. 内容标准（每关验收 checklist）

- [ ] setup：英文 2–4 句；目标句型 `**bold**` 高亮 ≥2 处、成对不嵌套；高亮句型本身，不高亮生词。
- [ ] npcLine：5–12 词，口语，自然复现目标句型；TTS 试听无歧义。
- [ ] hints 三级：hint1 镂空骨架；hint2 规则点拨（措辞呼应符文 oneLineRule）；hint3 === sampleAnswer。
- [ ] 口径统一：counterExample / counterNote / lampHint 指向同一 errorTag 根因；counterNote 用"城市听成了什么时间"的中性叙述，禁对错字样。
- [ ] acceptRegex 放行四类变体：缩略式双向、大小写标点、等量时间状语替换、代词性别互换（保持三单一致）。不放行改变时态或人称数的"变体"。
- [ ] 误读支线统一"时间线错乱"四拍模板：①复读玩家句子 → ②城市具象反应 → ③错误时间后果 → ④lampHint 点拨。

**误读支线成稿示例**：

示例 A（tense，过去说成现在）：
- npcReply: "*I come here yesterday* — the square repeats your words, but the lanterns light up for this morning. The city has placed you in the wrong day."
- npcReplyZh: "「I come here yesterday」——广场复读着你的话，灯笼却为今天早晨亮起。城市把你放进了错误的一天。"
- lampHint: "yesterday 是过去的门票：come 要换成 came。"

示例 B（missing_be，进行时漏 be）：
- npcReply: "*I going home* — the city waits. Nothing moves. Without *am*, your sentence stands still in time."
- npcReplyZh: "「I going home」——城市在原地等，什么都没有移动。少了 am，你的句子凝固在时间里。"
- lampHint: "正在发生的事，要请 be 来推动：I am going."

## 5. 角色设定

- **珂拉 Cora**（新主 NPC）：守钟人，成年女性，温和而带点疲惫。维护城市大钟、听过每个人说过的每句话；市民时态越来越乱、钟越来越不准——玩家说对句子就是在帮她修钟。不卖萌、不说教。
- **复读市民 the Echoers**（群像）：复读一切听到的话，却常把动作安错人、安错时间——G2/G3 功能性对手戏 + 误读支线发声体。
- **客串**：Vera 在 G1 送玩家进城（承接站台 teaser）；Omar 在 G9 谈"明天的生意"。
- **小灯**：全程陪伴 + 提示发出者，与站台一致。

基调红线：温和都市奇幻；NPC 有自己的动机与麻烦，不是出题机器。

## 6. 生产批次与验收

| 批次 | 内容 | 符文 | 附带技术项 |
|---|---|---|---|
| 批 1（3 关） | G1–G3 现在系统 | 现在之钟、三单之刺、一致之链 | 世界解锁 + 路由与数据索引打通 |
| 批 2（4 关） | G4–G7 进行 + 过去三关 | 进行之波；过去之痕复用校验 | — |
| 批 3（3 关） | G8–G10 将来两关 + 完成终章 | 将来之门、完成之桥 | 全量回归 |

每批 DoD：①红线测试复刻版全绿；②全量实测（skeleton/counterExample/符文归属）；③判定跑通含 acceptRegex 变体抽测；④埋点在新 gateId 命名空间正常上报；⑤TTS 试听全部 npcLine。

**Non-goals**：不做集市/山径/图书馆/灯塔；不做 AI 生成关卡；不为 respond 开发新判定；不新增 errorTag；不动站台内容（除解锁衔接最小改动）；不重设计世界地图视觉。

## 7. 技术接入清单

1. **世界解锁**：COMING_WORLDS 静态锁卡 → 按站台通关状态计算点亮。
2. **数据文件**：新建 echoGateScripts.ts（ECHO_GATES + stories），站台文件保持稳定；红线测试复刻。
3. **runes.ts**：追加 6 张符文。
4. **路由**：`/adventure/gate/:gateId` 改为查询合并后的门索引。
5. **判定引擎**：零改动（L1 + acceptRegex + 既有 errorTag）。
6. **埋点**：零新增事件。

## 8. 开放问题（已裁决）

1. **引文豁免**（误读支线复读玩家错句 vs 红线②语法正确）：裁决——引文用直引号「…」标记，测试检测排除「」内的引文（引文本就是错句，是机制核心资产）。已落地（见下方补充）。
2. **"站台全通关"判定**：裁决——以"第 8 关有 passed attempt"为解锁条件（`findPassedAttempt(station-gate-8)`），不要求 8 关全过——P0 手感期允许跳跃重玩。
3. **文件拆分**：裁决——新建 echoGateScripts.ts。
4. **G9 判定粒度**：批 3 用样例句实测后定（倾向：acceptRegex 主放行 going to 形态 + 语义副标志）。
5. **一致之链"稀有"**：按设计文档列"少见/稀有"，P0 不做替代获取路径，G3 必经。
6. **G10 难度**：批 3 决策门——若实测放弃率高，拆为两关（总数 11）。

---

## ✅ 行动清单

| # | 行动 | 负责方 | 时间窗 |
|---|------|--------|--------|
| 1 | 批 1：G1–G3 内容成稿 + 6 符文中的 3 张 + 世界解锁/路由/索引接入 | 开发+内容 | 下一个工作块 |
| 2 | 批 1 DoD 验证（红线测试 + 全量实测 + 埋点） | 开发 | 同上 |
| 3 | 批 2：G4–G7（进行 + 过去三关） | 内容 | 批 1 验收后 |
| 4 | 批 3：G8–G10（将来 + 完成终章）+ 全量回归 | 内容 | 批 2 验收后 |
| 5 | 站台北极星观测继续攒数据（30 session 口径不变） | 产品负责人 | 并行 |

---

## ⚠️ 待确认 / 假设 / Non-goals

- 待确认：G9 判定粒度（批 3 实测后定）；G10 是否拆关（批 3 决策门）。
- 假设：站台管线可直接承载 S2 内容（errorTag 三类足够覆盖）。
- Non-goals：见 §6（五世界其余、AI 生成、respond 新判定、errorTag 新增、世界地图视觉重设计）。

---

## 📚 数据来源 & 成员产出索引

- 析客（需求分析师）：PRD 全文（教学点地图/符文清单/内容标准/角色设定/批次计划/技术接入/开放问题）
- 方向明（主理人）：开放问题 1-3 裁决（引文豁免方案、解锁条件、文件拆分）；背景汇编与上游输入（GRAMMAR_ADVENTURE_PLAN、站台已验证管线、types/gateScripts/runes/判定/埋点代码事实）
- 代码事实来源：src/types.ts、src/data/gateScripts.ts、src/data/runes.ts、src/services/languageGateService.ts、src/services/adventureTelemetry.ts、src/pages/AdventureWorldsPage.tsx、GRAMMAR_ADVENTURE_PLAN.md §4/§5

---

> 本报告由产品战略团队 AI 协作生成，重要决策请由产品负责人审定。
