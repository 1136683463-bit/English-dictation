# 语法冒险 · 趣味化方案（V2）

更新时间：2026-09-12
关系说明：**本文档取代 `GRAMMAR_PRODUCT_PLAN.md` 的体验层设计**。V1 里的语法体系（6 个 Stage）、三层判定引擎（规则 → 本地模型 → LLM）、内容生产流水线仍然有效，作为本方案的底层底座。V1 的问题在于：它把「刷题」搬进了 App，本质还是课程 + 题库，只是换了皮。

---

## 0. 先说清楚 V1 为什么单薄

V1 的循环是：`看微课卡 → 做题 → 批改 → 复习`。这个循环**没有任何东西在等你**。

它的问题不在功能缺失，而在**动机结构的缺失**：

| V1 的假设 | 为什么站不住 |
| --- | --- |
| 用户有「我要学好语法」的目标感 | 初学者恰恰是**没有**这个目标感的人，否则他不会「零基础」 |
| 反馈本身就有趣 | 「红叉 + 正确答案」第 3 次就麻木了，第 30 次会让人关机 |
| 错误是学习材料 | 错误首先是**挫败源**。不处理情绪，错误就只是打击 |
| 微课卡 90 秒没负担 | 没负担的事，优先级永远排最后 |

而你现在这个项目里已经有一样别人没有的东西：**冒险系统**。5 个模板、章节树、场景插画、TTS 连续朗读、生词抽屉，AI 系统提示词里赫然写着 `Do not punish the learner.`

这句话就是 V2 的全部出发点。

**V2 的一句话**：

> 语法不是要背的规则，是**你在英语世界里说话的能力**。冒险的每一道门，都要你亲口说出那句话才打得开。说对了剧情往前走，说错了 NPC 会**当真**——然后故事用最温和的方式，让你自己把句子改对。

学习产品做趣味，最忌讳"加积分"。下面是我判断趣味到底从哪来的六个机制。

---

## 1. 趣味从哪来：六个真机制

不是加分数、加徽章、加签到。真正让人愿意一遍遍回来的，只有这六件事：

| 机制 | 心理学来源 | 在本产品里的落点 |
| --- | --- | --- |
| **① 即时因果** | 动作 → 世界立刻变化 | 你写的那句话**直接决定剧情走向**。语法第一次有了物理后果 |
| **② 收集** | 缺口驱动的闭合欲 | 30 张「语言符文」，图鉴上永远有空格 |
| **③ 成长可见** | 能力感，不是数值感 | 不是经验条，是「昨天你只能说我饿了，今天你能说我昨晚在车站饿了」 |
| **④ 悬念** | 想知道后面发生什么 | 故事卡在关键时刻，你必须学会下一句才能继续 |
| **⑤ 角色关系** | 被记住、被看见 | NPC 会记得你上次犯的错，会说「这次你记得加 -s 了」 |
| **⑥ 安全混乱** | 在无后果的环境里试探 | 允许你瞎说，NPC 给出荒诞但合理的回应——这是"冒险感"的真正来源 |

### 反例清单：明确不做的事

这些东西看着像游戏化，实际是负担：

- 签到打卡徽章（和"学会"毫无关系）
- 排行榜、好友 PK（**自用工具，无人可比；而且制造压力**）
- 经验值 / 等级条（数值膨胀，涨了不代表会了）
- 限时关卡、体力值、失败重来（违背 `Do not punish the learner.`）
- 抽卡式随机奖励（会让人觉得被操纵）
- 低幼化美术和音效（**目标用户是成年人初学者，不是小学生**）

一句话判据：**如果一个机制删掉之后学习效果不变、只是"少了点刺激"，那它就是假的。** 下面所有设计都要能通过这个判据。

---

## 2. 核心玩法重构：语言之门

### 2.1 从「点选项」到「说出这句话」

现在冒险的推进方式是**点选预设选项**（`Go to the library` / `Check the music room`）。玩家全程零语言产出。

改造：在选项之上，加一道**语言之门（Language Gate）**。

```
读一段剧情（有配音，可跟读）
   ↓
遇到语言之门：NPC 对你说了一句话，等你回答
   ↓
你写出一句英文（不是点选项，是自己写）
   ↓
判定 → 三档结果之一
   ↓
剧情继续，符文经验 +1，本章新词自动进词汇本
```

### 2.2 三种介入模式（按难度递进）

| 模式 | 界面 | 用在 | 例子 |
| --- | --- | --- | --- |
| **补全** | 句子挖空，只需填动词/冠词 | 世界 1（站台）前半 | `I ___ (come) from Beijing last night.` |
| **说出这句** | 给中文意图，自己写整句 | 世界 1 后半起，全程主力 | 「告诉她自己从北京来，昨晚到的」 |
| **自由回应** | NPC 问开放问题，你怎么答都行 | 世界 3 之后 |  librarian: "What did you come here to find?" |

**关键约束**：无论哪种模式，每关**至少有一次玩家自己写英文**。趣味不能替代输出，这是红线。

### 2.3 三档反馈：这是整个方案的心脏

判定结果不是「对 / 错」，而是三档：

| 档位 | 触发条件 | NPC 的反应 | 玩家的感受 |
| --- | --- | --- | --- |
| **通过** | 完全正确，或只有标点/大小写差异 | 剧情推进，NPC 自然地接话 | 爽，有推进感 |
| **差一点** | 词序小问题、拼写错、漏冠词但能猜懂 | 「你是说……？」NPC 用正确句子复述一遍 | 有台阶，不丢脸 |
| **说错了** | 语法错误（时态/三单/骨架缺失） | **NPC 按字面意思理解你**，做出错位反应——然后故事用温和的方式把你拉回来 | 有趣 + 印象深刻 |

第三档是整个设计的核心。它把「语法错误」从**扣分**变成了**喜剧**，而且强化了一个正确的直觉：

**语法错误不是形式问题，是意思变了。**

你写 `I go to the park yesterday`，NPC 真的会以为你**现在**要去公园。这个错位感比任何讲解都记得牢。

---

## 3. 三个真实脚本示例

以下是完整可实现的关卡脚本。**建议 P0 直接照这三条写代码验证手感。**

### 示例 A：时态错位（误读支线，最出彩的一档）

```
场景：雨夜七号站台（复用 travel 模板的 Platform Seven 场景插画）

【NPC · 售票员 Vera】
  Where are you from? And when did you arrive?
  你是从哪里来的？什么时候到的？

【中文意图】
  告诉她你从北京来，昨天晚上到的。

【目标句式】
  I came from Beijing. I arrived last night.

【提示三档】
  1. I c____ from Beijing. I a______ last night.
  2. come → came；arrive → arrived（不规则的动词要换形）
  3. I came from Beijing. I arrived last night.

【玩家输入】I come from Beijing. I arrive last night.        ← 时态未变形

【判定】说错了 → 触发误读支线
【Vera 的反应】
  You come now? But the last train already left.
  你现在就来？可末班车已经开走了呀。
【小灯提示】
  她以为你正在从北京来。把时间放回「昨晚」试试。
【玩家修正】I came from Beijing. I arrived last night.
【Vera】
  Ah, last night! Then you must be tired. Here, hot tea.
  啊，昨晚！那你一定累了。来，热茶。

→ 符文「过去之痕」经验 +1；新词 arrive / last night / tired 进词汇本
```

为什么好：**错误被认真对待了**。NPC 没有说「你错了」，而是真的按字面理解，产生了荒谬（人正在北京来 + 末班车已开）。玩家自己就想改。

### 示例 B：骨架缺失（教会「为什么必须有动词」）

```
场景：站台候车长椅

【NPC · 小灯】
  Are you ready to board?
  你准备好上车了吗？

【中文意图】说自己准备好了。
【目标句式】I am ready.

【玩家输入】I ready.

【判定】说错了 → 误读支线
【小灯（灯焰闪了一下）】
  Ready for what? You are… what?
  准备好什么？你是……什么？
【小灯提示】
  英语的句子里，主语后面必须站一个动词。「I am」就是"我是"的地基，
  少了它，句子就塌了。
【玩家修正】I am ready.
【小灯】
  Now I understand you. Let's go.
  现在我懂你了。走吧。

→ 符文「be 之锚」经验 +1
```

为什么好：让玩家**亲身体会**到"缺 be 动词 → 对方听不懂"，而不是背「be 动词不能省略」这条规则。

### 示例 C：冠词（把 a/an 变成听觉问题）

```
场景：清晨集市水果摊

【NPC · 摊主 Omar】
  What would you like today?
  今天想要点什么？

【中文意图】说想要一个苹果。
【目标句式】I want an apple.

【玩家输入】I want a apple.

【判定】说错了 → 误读支线
【Omar（皱眉）】
  A apple? I've never heard of that fruit. Do you mean an apple?
  「啊破」？我没听过这种水果。你是说 an apple？

【小灯提示】
  两个元音撞在一起会黏住。a 和 apple 之间，需要一个 n 当垫片。
【玩家修正】I want an apple.
【Omar】
  One an apple, coming right up.
  一个 an apple，马上来。

→ 符文「冠词之环」经验 +1
```

为什么好：`a apple` 真的很难发音——**冠词规则本质是发音规则**，NPC 的反应直接让玩家"听见"了原因。

---

## 4. 语言符文：把语法点变成可收集的物件

语法点最大的问题是**不可见**。「你已经学会了三单」是句空话；「你收集到了 三单之刺」是一件东西。

### 4.1 符文设计

- 每张符文是一个**几何符号**（不是插画，是符号：环、链、锚、镜、羽……），风格克制，符合现有设计语言
- 一张符文包含：符号 + 名字 + 一句话规则 + 三条「咒语」（例句）+ 所属世界
- 四个熟练度等级，用符文的**描边亮度**表示，不用百分比：

| 等级 | 含义 | 达成条件 |
| --- | --- | --- |
| 初识 | 见过 | 完成对应关卡 |
| 会用 | 认得出 | 补全 / 选择题通过 |
| 熟练 | 能改写 | 「说出这句」通过 |
| 本能 | 不用想 | 自由回应模式下正确使用 2 次 |

**只有到「本能」才算真正掌握。** 选择题全对不算——这条和 V1 一致。

### 4.2 30 张符文清单

| 世界 | 符文 | 稀有度 |
| --- | --- | --- |
| **站台**（S0 句子骨架） | 主语之心、谓语之骨、be 之锚、there 之眼 | 常见 |
| **集市**（S1 名词与限定） | 单复之镜、冠词之环、代词之影、指示之指、量词之衡 | 常见 |
| **回声城**（S2 谓语动词） | 现在之钟、三单之刺、过去之痕、进行之波、将来之门、完成之桥、一致之链 | 少见 / 稀有 |
| **山径**（S3 修饰与扩展） | 形容之羽、比较之尺、介词之结、语序之轨 | 少见 |
| **图书馆**（S4 句子变长） | 连词之梭、不定之芽、动名之叶、定语之扣、宾语之匣、长句之梯 | 稀有 / 传说 |
| **灯塔**（S5 按需） | 情态之钥、被动之幕、条件之路、语用之灯 | 传说 |

共 30 张：常见 9、少见 7、稀有 8、传说 6。

### 4.3 组合技：把「能力」而不是「分数」显性化

集齐特定几张三阶符文，解锁一枚**徽记**。徽记不是分数，是一句能力描述：

| 徽记 | 需要 | 能力描述 |
| --- | --- | --- |
| 「日常描述」 | 三单之刺 + 现在之钟 + 量词之衡 | 我现在能说清楚每天的日常习惯 |
| 「讲昨天的事」 | 过去之痕 + 一致之链 + 语序之轨 | 我现在能完整讲一件昨天发生的事 |
| 「说明白一个东西」 | 单复之镜 + 冠词之环 + 形容之羽 | 我现在能把一个东西描述得让对方知道是哪一个 |
| 「说出因果」 | 连词之梭 + 宾语之匣 + 长句之梯 | 我现在能说出「因为……所以……」这样的话 |

这四枚徽记，对初学者来说就是**看得见的进度条**。而且它是诚实的——你确实获得了这个能力。

---

## 5. 世界地图：六段递进的旅途

每个世界 = 一个 Stage + 一个场景 + 6–10 道语言之门。

| 世界 | 对应 | 场景基调 | 核心机制 | 关卡数 |
| --- | --- | --- | --- | --- |
| **站台** | S0 句子骨架 | 雨夜的火车站，所有人都急着说话 | 你说话别人才能听懂 | 8 |
| **集市** | S1 名词与限定 | 清晨市集，要什么得说清楚 | 数量、特指、泛指 | 8 |
| **回声城** | S2 谓语动词 | 城市会复读你说过的每句话，时间线会错乱 | **说错时间 → 城市把你在过去和现在之间拉来拉去** | 10 |
| **山径** | S3 修饰与扩展 | 雾中盘山路，要描述路况才能前进 | 比较、方向、程度 | 8 |
| **图书馆** | S4 句子变长 | 有些书只有说出完整长句才会打开 | 从句、连接、限定 | 10 |
| **灯塔** | S5 特殊与语用 | 终章，塔顶的守灯人在等一句道别 | 情态、被动、条件 | 6 |

**回声城是整条线的高潮**——它的世界机制就是"时态"，机制和主题完全咬合。这是整个方案里最值得投入的一个世界。

### 单关结构（2–4 分钟）

```
30 秒  前情（一句话回顾上次结局）
60 秒  剧情推进：读 2–3 句，有配音
60 秒  语言之门：写一句英文，三档反馈
30 秒  收尾：NPC 一句话 + 符文经验 + 新词提示
```

一次坐下来玩 2–3 关 = 8–12 分钟。**这个时长是设计目标，不是巧合**——超过 20 分钟说明关卡里有摩擦。

### 回访钩子

每关结束时给一句**下一关预告**，而且必须留悬念：

> 灯焰暗了一下。「回声城那边……有人在念你刚才说的那句话。」

不做推送通知、不做每日任务催促。悬念本身就是钩子。

---

## 6. 角色与陪伴

### 6.1 小灯（The Lamp）

你在奇幻模板里已经有一盏"会说话的灯"。把它升级为全程陪伴角色：

- **灯焰状态**：亮 / 微亮 / 暗——只反映你最近的状态，**暗了不损失任何东西**，只是小灯会说一句温和的话（「好久没见你了。要不要在站台坐一会儿？」）
- **它会替 NPC 说话**：三档反馈里的「提示」全部由小灯给出，而不是系统弹窗。这样提示不是纠错，是**同伴在帮你**
- **它有自己的性格**：好奇、爱插话、偶尔说错话然后自己纠正（这是最好的示范——**承认错误不可耻**）

### 6.2 NPC 记忆（"被看见"）

这是比积分强十倍的黏性来源。NPC 记得你的历史：

```
【Vera · 第三次见她】
  Last time you forgot the -s. But today—"she goes"—perfect.
  上次你把 -s 忘了。可今天——「she goes」——完美。
```

实现上只需要读 `GateAttempt` 的 `errorTags` 历史。技术上很简单，情感上极有效。

### 6.3 基调：温和的都市奇幻，不是卡通风

明确避免低幼化：

- 美术沿用现有 `AdventureScene` 与主题插画系统的克制风格
- 不出现卡通大眼睛、拟声词、夸张音效
- 情绪基调偏**安静、温柔、有点诗意**（你现有的奇幻模板「雾林灯塔」就是这个调，继续保持）
- 目标用户是成年人初学者：他们要的是**体面地学会**，不是被哄

---

## 7. 反馈的乐趣设计细则

### 7.1 错误永远不打断

- 不做震动、不做红色警告框、不播放失败音效
- 错误只是**剧情分叉**，玩家修正后剧情**回到正轨**，并且 NPC 会把它变成一次互动（示例 A / B / C 都是这个结构）
- 修正的瞬间要有一点仪式感：NPC 那句"Ah, last night!"或"Now I understand you."——**让玩家感到被理解**，这比"回答正确"动人得多

### 7.2 「说对了」也不能太平淡

连续 3 次一次通过，触发**流利时刻**：整个界面安静 2 秒，灯焰明显变亮，小灯说一句话（随机）：

> - 「你刚才一句话都没停顿。」
> - 「我听见了。完全没有中文的影子。」
> - 「就是这个感觉。记住它。」

这是把"正确"变成**值得回味的事件**，而不是一闪而过的绿勾。

### 7.3 允许安全地瞎说

自由回应模式下，玩家写出奇怪但语法正确的句子（`I want to eat the moon.`），NPC 应该**当真回应**：

> Omar: Then I'll need a very long ladder. But first—one apple?

这个"安全混乱"是趣味性的重要来源。它告诉玩家：**这里是可以说错话的地方**。降低试错的心理成本，比任何鼓励文案都有效。

### 7.4 三档判定的技术口径

| 判定 | 触发 | 界面行为 |
| --- | --- | --- |
| 通过 | 规则引擎判定核心结构正确；容错：标点、大小写、缩写 | 直接给 NPC 台词，不显示任何"判定结果"字样 |
| 差一点 | 拼写/词序/冠词小问题，`diffService` 能对齐到词级 | 小灯说"你是说……？"+ 正确句子的高亮版本，可原地修改 |
| 说错了 | 命中 `errorTag`（tense / sv_agreement / missing_be / article / plural / preposition / fragment / run_on / word_order / verb_form） | 播放误读支线台词，再给小灯提示，再给三次提示分级 |

**注意**：界面上不出现"正确 / 错误"字样。只有剧情反应。这是设计纪律。

---

## 8. 与现有系统的技术整合

好消息：**不需要新建一套系统**。

### 8.1 复用清单（零改动）

| 现有资产 | 用途 |
| --- | --- |
| `Adventure` / `AdventureNode` 数据结构 | 世界与关卡的容器 |
| `AdventureScene` + `adventureThemeArtworks` + `adventureThemeLibrary` | 六个世界的场景插画 |
| `speechService` / `SpeakButton` | NPC 台词朗读、跟读 |
| `AdventurePlayPage` 的阅读器（分段、字号、连续播放、进度） | 剧情阅读区 |
| `adventure-vocab-drawer`「这章想带走什么？」 | 关卡结算的新词收集 |
| `AdventurePlayPage` 的 `adventure-action-dock` | **语言之门的输入区就插在这里**，在选项之上 |
| `diffService` | 词级对齐，用于「差一点」档 |
| `errorTag` 规则引擎（V1 的 L1 层） | 三档判定 |
| `cardService` / `reviewService` / `mistakeBookService` | 新词入库、符文复习、错误回流 |
| `aiHttpClient` / `adventureModelService` | 关卡自动生成 |

### 8.2 新增类型

```ts
/** 语言之门：挂在 AdventureNode 上的语法挑战 */
interface LanguageGate {
  id: string;
  topicId: string;                    // 对应语法点（V1 的 grammarTopics）
  runeId: string;                     // 对应符文
  mode: "complete" | "say" | "respond";
  npcLine: string;                    // NPC 的英文台词
  npcLineZh: string;
  zhIntent: string;                   // 中文意图（"告诉她自己昨天到的"）
  requiredPattern: string;            // 期望句式
  sampleAnswer: string;
  hints: [string, string, string];    // 三档提示（由小灯说出）
  acceptRegex?: string;               // 宽松接受（同义表达）
  misreadBranches: MisreadBranch[];   // 误读支线，按 errorTag 匹配
}

interface MisreadBranch {
  errorTag: string;                   // tense | sv_agreement | missing_be | ...
  npcReply: string;                   // NPC 按字面理解后的反应（喜剧）
  npcReplyZh: string;
  lampHint: string;                   // 小灯的一句话提示
}

/** 玩家回答记录：驱动 NPC 记忆与弱点档案 */
interface GateAttempt {
  id: string;
  adventureId: string;
  nodeId: string;
  gateId: string;
  topicId: string;
  raw: string;
  verdict: "pass" | "near" | "misread";
  errorTags: string[];
  hintsUsed: number;
  attemptIndex: number;
  createdAt: string;
}

/** 符文与状态 */
interface GrammarRune {
  id: string;
  topicId: string;
  stage: "S0" | "S1" | "S2" | "S3" | "S4" | "S5";
  worldId: string;
  name: string;
  glyph: string;                      // 几何符号 id
  rarity: "common" | "uncommon" | "rare" | "legendary";
  oneLineRule: string;
  spells: string[];                   // 三条例句
}

interface RuneState {
  runeId: string;
  mastery: "unseen" | "seen" | "usable" | "fluent" | "instinct";
  xp: number;
  unlockedAt?: string;
}
```

`AppData` 只追加三个字段：`languageGates`（可内置可 AI 生成）、`gateAttempts`、`runeStates`。

### 8.3 新增服务

| 文件 | 职责 |
| --- | --- |
| `src/services/languageGateService.ts` | 判定（复用 diffService + errorTag 规则）、选误读支线、生成小灯提示、更新符文经验 |
| `src/services/runeService.ts` | 符文图鉴、熟练度推进、组合技徽记判定、NPC 记忆查询 |
| `src/services/grammarCheckService.ts` | V1 的三层判定引擎（规则 → compromise → LLM） |
| `src/data/gateScripts.ts` | 手写关卡脚本（首批 8 关） |
| `src/data/runes.ts` | 30 张符文定义 |

### 8.4 新增页面（只 2 个）

| 路由 | 页面 | 说明 |
| --- | --- | --- |
| `/adventure/worlds` | 世界地图 | 六个世界的路线图 + 解锁状态 + 符文进度 |
| `/grammar/runes` | 符文图鉴 | 30 格图鉴 + 熟练度 + 组合技徽记 |

**练习页不新增任何页面。** 语言之门完全内嵌在 `AdventurePlayPage` 的 `adventure-action-dock` 里——保持沉浸，不能让玩家觉得"我现在在学习了"。

### 8.5 页面改造点（`AdventurePlayPage.tsx`）

```
adventure-action-dock 内，选项列表之上，插入 <LanguageGatePanel>：

  ┌──────────────────────────────────────────┐
  │  Vera                                     │
  │  Where are you from? And when did you    │
  │  arrive?                          [▶ 听]  │
  ├──────────────────────────────────────────┤
  │  你想说：告诉她你从北京来，昨晚到的         │
  │  ┌────────────────────────────────────┐  │
  │  │ I come from Beijing. I arrive last │  │
  │  │ night.                             │  │
  │  └────────────────────────────────────┘  │
  │  提示 1/3 · 小灯   [说出这句话]            │
  └──────────────────────────────────────────┘

提交后 → 同一块区域替换为 NPC 的回应（误读支线 / 接受）
```

### 8.6 让 AI 自动生成关卡（关键扩量手段）

手写 50 个关卡脚本太累。扩展 `adventureModelService` 的 JSON 契约，让 AI 在生成章节时**同时生成一道语言之门和它的误读支线**：

```ts
const buildGateSystemPrompt = () => [
  "You also design ONE language gate for each chapter.",
  "The gate must target exactly one grammar topic from the allowed list.",
  "npcLine: one short natural English line the NPC says to the learner.",
  "zhIntent: the Chinese intention, e.g. 告诉她你昨天到的.",
  "sampleAnswer: one correct answer, at most 10 words.",
  "hints: three escalating hints; hint 3 may reveal the answer.",
  "misreadBranches: for each listed errorTag, write what the NPC honestly",
  "  thinks the learner meant, as a SHORT and mildly funny reply.",
  "The NPC must ALWAYS speak correct English, even in misread branches.",
  "Never punish the learner. Never say 'wrong' or 'incorrect'.",
  "Return JSON only, with the gate as a top-level field."
].join(" ");
```

三条硬约束写进提示词：① NPC 永远说正确英语（玩笑里也不能用错句，否则强化错误）；② 不许出现 "wrong" / "incorrect"；③ 误读分支必须"当真理解"而不是嘲讽。

---

## 9. 命名：让枯燥的功能有世界观

V1 里几个功能名太"工具"了，改个名，同样的功能立刻有归属感：

| V1 名字 | V2 名字 | 理由 |
| --- | --- | --- |
| 弱点档案 | **回声墙** | 回声城会复读你犯过的错 |
| 中式英语 Top 30 | **母语回声** | 中文思维在你脑内的回声，不是"错误清单" |
| 语法地图 | **符文图鉴** | 可收集的物件，不是进度表 |
| 知识点微课卡 | **符文之书** | 一张符文的说明页 |
| 语法练习 | **语言之门** | 有剧情后果的挑战，不是练习 |

改名成本几乎为零，但会把整个功能的体感从"学习软件"变成"一个地方"。

---

## 10. 实施路线（重排，趣味层优先）

| 阶段 | 目标 | 交付 | 验收 |
| --- | --- | --- | --- |
| **P0 · 3–5 天** | **验证手感，不做别的** | 站台世界 8 关；补全 + 说出两种模式；三档判定；示例 A/B/C 三条误读支线；4 张符文；关卡结算 | 自己连玩 3 天，每天 2 关，不觉得是任务 |
| **P1 · 1 周** | 收集与陪伴 | 符文图鉴页、小灯灯焰状态、NPC 记忆（读 `gateAttempts`）、母语回声 Top 30 嵌入关卡 | 主动重玩率 > 20%；错误后重试率 > 90% |
| **P2 · 1–2 周** | 扩量与自由 | 集市 + 回声城两个世界；自由回应模式；AI 自动生成关卡（含 gate）跑通 | AI 生成关卡可用率 > 70%（无需手改） |
| **P3 · 按需** | 完整体验 | 山径 / 图书馆 / 灯塔；组合技徽记；传说符文；回声墙周报 | 世界完成率、D7 回访 |

**P0 的唯一目标是把"手感"跑出来。** 如果示例 A 那条误读支线玩起来不有趣，后面所有世界都是白做——这时候要停下来改机制，而不是继续堆内容。

---

## 11. 趣味性怎么度量（不是"好玩"）

"有趣"必须落成可测指标，否则就是在自我感动：

| 指标 | 定义 | 目标 | 说明 |
| --- | --- | --- | --- |
| **主动重玩率** | 同一关卡被重复进入的比例 | > 20% | 这是趣味性最硬的证据。不好玩没人回头 |
| **错误后立即重试率** | 说错后 5 秒内再次提交 | > 90% | 高 = 不挫败。低于 70% 说明反馈伤人了 |
| **平均每关尝试次数** | 含重试 | 1.5–2.5 | 太低=太简单无聊；太高=提示不够 |
| **单次时长** | 一次会话 | 8–12 分钟 | > 20 分钟说明有摩擦 |
| **世界完成率** | 单个世界 100% 关卡的玩家比例 | > 60% | 中途流失说明剧情不抓人 |
| **符文收集进度** | 平均已解锁 / 30 | 稳定增长 | 增长停滞 = 收集驱动失效 |
| **D1 / D7 回访** | 次日、七日回访 | D1 > 50% | 对比 V1 的纯复习队列 |
| **主观一句话** | 结算后可选填 | — | 「刚才那句我记住了」是最高评价 |

如果 P1 结束时「主动重玩率」低于 10%，说明机制不成立，应该**改机制而不是加内容**。

---

## 12. 三条红线

趣味化最大的风险是**把学习效果做没了**。三条不能越的线：

1. **趣味不能替代输出。** 每一关都必须有至少一次玩家自己写英文。如果一个机制让玩家可以在不写句子的情况下过关，这个机制就是错的。
2. **NPC 永远说正确英语。** 包括玩笑、包括误读分支。一旦为了搞笑让 NPC 说 `I no understand`，就在强化错误。
3. **不制造焦虑。** 不做限时、不做体力、不做失败重来、不做排名、不做"你已连续 3 天未学习"的红色警告。延续现有代码里已经写下的原则：`Do not punish the learner.`

---

## 13. 一句话总结

V1 是把刷题搬进了 App。V2 是：

> **让语法第一次有了后果——你说错一句话，故事里会有人真的误解你；你改对那句话，故事会继续往前走。**

学习者不是在"学语法"，是在**跟一群记得他的人，走完一段路**。走完之后，他发现自己能说英语了。

---

## 14. 参考资料

**趣味化与游戏化设计**

- Jane McGonigal《游戏改变世界》—— 即时反馈与"有意义的选择"
- Nir Eyal《上瘾》Hook 模型（触发 → 行动 → 多变奖励 → 投入）
- Duolingo 的 streak 设计与其争议：<https://blog.duolingo.com/streak-society/>
- 反例参考：Wired《The Rise and Fall of Gamification》：<https://www.wired.com/story/gamification-is-broken/>

**叙事驱动的语言学习**

- LingQ 的"在故事中学语法"路径：<https://www.lingq.com/>
- 现有开源项目 Tense Playground 的游戏化设计（12 时态 + 拖拽造句 + AI 助教）：<https://github.com/dharam-gfx/tense-playground>
- GrammarLab 的 error-driven review 原则：<https://github.com/sythang/grammarLab>

**本项目既有资产（复用基础）**

- `src/services/adventureService.ts` —— 章节树、离线剧情、词汇收纳
- `src/services/adventureModelService.ts` —— AI 生成契约（`Do not punish the learner.` 出自此处）
- `src/pages/AdventurePlayPage.tsx` —— 阅读器、播放控制、`adventure-action-dock`、生词抽屉
- `src/components/AdventureScene.tsx` + `adventureThemeArtworks.tsx` —— 场景插画系统
- `src/services/diffService.ts` —— 词级对齐（「差一点」档的判定基础）
- `GRAMMAR_PRODUCT_PLAN.md` —— 语法体系、三层判定引擎、内容生产流水线（本方案的底座）
