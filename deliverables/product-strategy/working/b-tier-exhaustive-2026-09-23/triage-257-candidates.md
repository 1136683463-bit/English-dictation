# 257 条结构候选的逐层收口（批六十）

## 一、为什么做这一步

批五十九把「给 256 条结构候选加档位」列为顺位 1，并判定「机械路径已试两条皆不通」，
预估成本为「逐条选词 → 查词典 → 取 `epp-xref`」× 256 次。

**那个预估下得太快**——我漏了一步：**先做人工分桶**。
分桶不需要查上游、不需要档位，只靠「这条是不是一个可教的点」就能砍掉大半。
本批补上这一步，并把结果归档。

---

## 二、四层过滤（257 → 3）

| 层 | 筛掉 | 余下 | 依据 |
|---|---|---|---|
| 原始 | — | **257** | Cambridge 554 条去掉词汇类/Word patterns/超纲项 |
| A 类目中枢 | 31 | 226 | `Adjectives` / `Nouns` / `Pronouns` / `Prepositions` …——**整章目录页，不是教学点** |
| B 按单词建的参考条目 | 112 | 114 | `Prepositions: home` / `Word order: always` / `Part of speech: good or well?`——与已排除的 `Word patterns` **同形**（按词列搭配）|
| C 语域/文体/篇章 | 32 | **82** | `Newspaper headlines` / `Swearing` / `Internet discourse` / `Inversion` / `Fronting` …|
| **D 真候选** | — | **82** | 见下 |

### D 层的 82 条再分

| 子类 | 条数 | 处置 |
|---|---|---|
| **已用「具体实例」口径探测** | 47 | **36 已覆盖 / 8 存疑 / 3 缺口** |
| 章节式未探测 | 37 | 逐条判定（见 §四）|

---

## 三、47 条探测结果

### 3.1 已覆盖 36 条

覆盖的包括：`Adjectives: order`（`a white cat` 已教）、`Adverbs and adverb phrases: position`、
`Commands and instructions`（祈使句 L32）、`Invitations` / `Offers` / `Requests` / `Suggestions`
（L61/L168/L75/L69 系列）、`Dates`、`Politeness`、`Past continuous or past simple?`（L97）、
`Present simple or present continuous?`、`Phrasal verbs and multi-word verbs`、
`Passive: forms` / `Passive: uses`（L50）、`Conjunctions` 全部四个子类（L20/L139/L91/L98）、
`Table of irregular verbs`（L197-204）、`Relative pronouns`（L35）、`Nouns and prepositions`（L67）等。

### 3.2 存疑 8 条 —— 逐条核实**全部是探测词不足，不是缺口**

| 条 | 命中 | 核实 |
|---|---|---|
| `Noun phrases: order` | `a white cat` | 已教（L58 描述词位置），探测词只写了 2 个 |
| `Geographical places` | `in china` | 地名属词汇线，非语法点 |
| `Present perfect simple or continuous?` | `have done` | `have been doing` 属 B1+，我方教的是简单式（L21/L115 已裁定范围）|
| `Phrasal verbs and multi-word verbs` | `get up` | **上游标 B1**（词典 `phrasal-verb` = B1）|
| `Infinitive: active or passive?` | `to do` | 被动不定式属 B1+ |
| `Nouns and prepositions` | `good at` | **我方有专课 L67「我擅长画画」**（`good at + 名字版`）|
| `Past: typical errors` | `yesterday i go` | 「典型错误」索引页，非教学点 |
| `Future: typical errors` | `going to` | 同上 |

### 3.3 缺口 3 条 —— 逐条判档（用词典 `epp-xref`）

| 条 | 我方命中 | 词典档位 | 裁定 |
|---|---|---|---|
| `Names and titles: addressing people` | `mr` 0 / `mrs` 0 / `sir` 0（`miss` 9 是动词「想念」）| **`mr` = A1**，`sir` = B1 | ⚠️ **唯一落在我方线内的真缺口**——但 BC 三档**也没有**对应课（A1-A2/B1-B2/C1 全为 0），且我方 L1「我是谁」教的是 `I am Xiaomei.` 而非称呼 |
| `Future in the past` | `would go` 0 / `was going to` 0 | `would` = **B1** | ❌ 高于我方线 |
| `Reported speech: reporting nouns` | `the news` 0 / `a promise` 0 | `promise` = **B1** | ❌ 高于我方线；且 `Reported speech` 三条已由批四八/四九裁定不做 |

---

## 四、37 条章节式候选的判定

| 处置 | 条数 | 例 |
|---|---|---|
| **明显高于我方线**（形态学/短语结构/完成进行/情态细化）| **27** | `Adjectives: forms` / `Noun phrases: uses` / `Past perfect continuous` / `Modality: tense` |
| **已被裁定 / 非教学点** | **7** | `Reported speech` ×3（批四八/四九）+ `typical errors` ×4（索引页）|
| **落在我方线内** | **3** | `Passives with and without an agent` / `Passive: other forms` / `Passive: typical errors` |

那 3 条被动细化的核实：我方 **L50 已教被动**（`My cup was broken.`），
「带不带执行者（by her）」属**同一课的细化格**，不是新教学点。

**另核**：`Adverbs: functions`（归在 27 条里）经实测五类功能我方全教
——方式 L58（`quickly` 55 次 / `carefully` 14 次）、时间 L10（`yesterday` 301 次）、
地点 L48（`here` 231 次）、程度 L125-133（`very` 115 次）、频率 L28（`always` 86 次）。

---

## 五、收口结论

> **257 条结构候选，逐层收口到 1 条真候选，而它有独立理由不做。**

| 层 | 余下 |
|---|---|
| 257 原始 | 人工分桶砍到 82 |
| 82 真候选 | 探测/判定后：**36 覆盖 + 8 存疑（实为覆盖）+ 37 超纲或已裁定** |
| **真缺口** | **1 条：`Names and titles: addressing people`** |

**那唯一 1 条**：
- 词典档位 `mr` = **A1**（落在我方线内）；
- 但 **BC 三档 68 课全无对应**（A1-A2/B1-B2/C1 全为 0）；
- 我方 L1 教的是 `I am Xiaomei.`，从不涉及称呼（`Mr`/`Mrs`/`Ms`）。

**⇒ 裁定：不做。** 理由：① 它**不是语法点而是称呼礼节**（`Mr`/`Mrs` 是词汇项，不是句型）；
② **三个带档位的上游源里只有词典标 A1，BC 完全不收**；③ 引入 `Mr`/`Mrs` 要连带教中文没有的
「已婚/未婚」区分，是**文化礼节**而非语法；④ 单独立课撑不起（同 `several` 的「3 标记不可满足」——
`Mr Wang` / `Wang` / `Sir` 在中文里都对应「王先生」，标不出错）。

---

## 六、这一步把顺位 1 的成本从 256 降到 0

批五十九预估「256 条需 256 次词典查询」。实际做完发现：

- **人工分桶**砍掉 143 条（A/B/C 三层），不需要任何上游查询；
- **具体实例探测**处理 47 条，其中 36 条**当场判为已覆盖**；
- 只有 **3 条**真正需要查词典判档；
- 结果 **0 条待办**。

⇒ **顺位 1 已完成**，且它原本的成本估计高了一个数量级。
`triage-257-candidates.md`（本文件）+ `triage-data.json` 为可复核证据。
