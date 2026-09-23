# 真机复核：dev-server 侧数据**不是真实使用**产生的（三处结构矛盾）

**日期**：2026-09-24
**方法**：真实浏览器（非 jsdom）打开 `http://127.0.0.1:1420`，直读该 origin 的 localStorage
**结论**：dev-server 那份「看起来像真实使用」的数据（178 复习 / 8 课 / 473 遥测）
**不可能是 `applyReview` 写出来的**——三处结构性矛盾。
⚠️ 它一度让我在上一轮报告里写错一句话（见第一节），本报告是更正。

⚠️ **判定边界**：能证明「不是真实使用」；**不能**指认「是哪一次注入写的」
（仓库里搜不到对应的现成脚本）。措辞上分清这两件事。

---

## 一、为什么要做这次真机复核

上一轮（`data-audit-real-usage-verification-2026-09-24.md`）我用 Node 脚本解开了
Chrome `Profile 1` 里 `127.0.0.1:1420` origin 的 leveldb 数据，读到：
`schemaVersion 6`、**无语法键**、时间停在 09-10。

当时我据此写了一句：

> 「dev-server 侧的数据确实存在，但它比 Tauri 侧更旧、且早于语法模块」

**这句话只对 leveldb 快照成立，对「dev-server 的实际存储」不成立。**
本次用真实浏览器打开该 origin（当前活跃的 dev server），
读到的 localStorage 与那个 leveldb 快照**完全不同**：

| 项 | leveldb 快照（09-10） | 活的 dev server（本次） |
|---|---|---|
| `schemaVersion` | 6 | **8** |
| `cards` | 116 | **128** |
| `reviews` | **0** | **178** |
| `grammarLessonsDone` | 不存在 | **8 课** |
| `grammar-telemetry-events-v1` | 不存在 | **473 条事件** |
| 别的语法键 | 无 | `grammar-explain` / `grammar-why-wrong-log` / `grammar-lesson-time` / `grammar-weekly-summary` / `grammar-boost-ai-cache` / `grammar:resume:*` |

⇒ **我读的是 leveldb 里的旧快照，而真实存储已经被后来的写入覆盖了。**
这条更正很重要：**「读 Tauri 的 sqlite」能拿到权威数据，
但「读 Chrome 的 leveldb」可能只拿到某个历史快照。**

---

## 二、那这份 dev-server 数据是「真人使用」吗？——不是

第一眼它非常像真实使用：178 条复习、14 天连续（08-31 → 09-13）、
8 课语法完成、473 条语法遥测（含 `section_dwell: 153`、`lesson_exit: 140`）、
甚至有一本被拆分过的词书「核心100 - Unit 1 · 2」。

**但内部有三处结构性矛盾，证明它不可能是 `applyReview` 写出来的：**

### 矛盾 ①：复习记录比卡片还早 13 天

| 项 | 值 |
|---|---|
| 最早的卡片 `createdAt` | **2026-09-13T07:00:47Z** |
| 最早的复习 `reviewedAt` | **2026-08-31T07:40:26Z** |

**复习发生在被复习的卡诞生之前 13 天。** 真实使用不可能这样
（复习必须选中一张已存在的卡）。

### 矛盾 ②：86 张「复习过」的卡，`status` 全是 `new`

全库 128 张卡 **`status` 全为 `new`**（含那 86 张有复习记录的）。

而 `reviewService.ts:566-572` 明确：任何一次真实复习都会把卡
`new` → `review` 或 `mastered`：

```ts
const spacedRepetitionStatus: CardStatus = isMasteredBySpacedRepetition(rating, nextSchedule.reviewCount)
  ? "mastered"
  : "review";
```

**实测验证**（隔离用例，非推断）：一张 `status:"new"` 的卡调 `applyReview` 一次后，
`status` 立刻变成 `review`。

⇒ 有 178 条复习、却一张卡都没被提升过 ⇒ **这些复习记录不是 `applyReview` 写的。**

**补强（防「是不是旧版本不提升状态」这个反例）**：查了**初始提交**（`8f44fa3`）
的 `reviewService.ts`——它同样在写复习的那一刻改卡状态：

```ts
cards: data.cards.map((item) =>
  item.id === card.id ? { ...item, status: nextStatus, ... } : item
)
```

⇒ **从项目第一天起，真实复习就会提升状态**，不存在「写了复习但状态不动」的历史版本。
这个矛盾在**任何版本**下都成立。

### 矛盾 ③：所有 `schedule.reviewCount` 都是 0

`applyReview` 每次都会 `reviewCount += 1`。
实测：**128 条 schedule 里 `reviewCount > 0` 的有 0 条。**

⇒ 与 ② 同源：复习记录与排期状态**互不对应**。

### 注入机制（已定位到「能这么写」的地方，但不是「谁写的」）

`src/edge/verify/fixtures.ts:93`：

```ts
window.localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
```

**夹具直接写 localStorage，绕过 `applyReview`**——
所以能造出「有复习记录、但卡片状态与排期完全没被推进」的形态。
这与上一轮确认过的「走查报告注入真实用户数据（学 7 课）」是同一类动作。

⚠️ **诚实边界**：我只能证明「三处矛盾使它不可能是 `applyReview` 写的」，
**不能指认具体是哪一次注入**（仓库里没有任何脚本的常量是 178 条复习，
也搜不到写 8 课完成 + 178 复习的现成脚本）。
但**是外部写入这一点是确定的**——因为真实使用路径写不出这个形态。

⇒ 判定表述：**「不是真实使用产生的」是结论；「由哪次夹具注入」是未确证的推测。**

---

## 三、对结论的影响：**不改变**，但修正一处表述

| 结论 | 状态 |
|---|---|
| Tauri 两份数据（`cn.personal.vocab` / `personal-vocab-desktop`）：语法线零使用 | ✅ **不变**（那是 sqlite 直读，无夹具痕迹） |
| 「用户可能在用 dev server 学语法」 | ✅ **仍被排除**——dev-server 侧确实有数据，但**是夹具**，且矛盾如上 |
| 上一轮「dev-server 数据早于语法模块」 | ⚠️ **更正**：那句只对 leveldb 旧快照成立（见第一节） |

**净结论不变**：能找到的三处口径，**没有任何一处是真实使用**。
Tauri 两份是权威数据（语法线 0 课 / 0 复习），dev-server 那份是夹具。

---

## 四、一条方法学教训（写给后人）

**「同一个 origin，两个存储位置，会给出两个不同答案」。**

| 读法 | 拿到什么 | 适合判断什么 |
|---|---|---|
| Chrome `leveldb`（`Local Storage/leveldb/*.ldb`） | 可能只是**某个历史快照**，还可能是 snappy 压的 | 只看「某个时点存在过什么」，**不能当现状** |
| 真实浏览器打开该 origin，读 `localStorage` | **活的当前值** | 现状（但可能是夹具写的，需查一致性） |
| Tauri 的 `localstorage.sqlite3` | 桌面端权威数据 | 桌面端真实使用 |

⚠️ 与之配套的判据：**别只看「数据像不像人用的」（时间跨度、事件多样性都能被夹具伪造），
要查内部一致性**——本例是「复习早于建卡」「复习过却没提升状态」这类
**结构上不可能**的组合。这类矛盾伪造不出来（除非夹具刻意模拟全套副作用）。

---

## 五、本报告的产出与未做

| 项 | 状态 |
|---|---|
| 真机打开 dev server 并读取 localStorage | ✅ 128 卡 / 178 复习 / 473 遥测 |
| 判定为「非真实使用」 | ✅ 三处结构矛盾（复习早于建卡 / 复习过仍 new / reviewCount 全 0） |
| 指认具体是哪次注入 | ⚠️ **未确证**——只证明「不是真实使用路径写的」 |
| 更正上一轮的一处表述 | ✅ leveldb 是旧快照，不等于现状 |
| 方法学记录 | ✅ 三种读法的适用范围 + 「查一致性而非像不像」 |
| 是否改代码 | ❌ **不改**——本轮只做判定 |
| 浏览器标签 | ✅ 只关自建的那个；并发进程的 3 个 `/grammar` 标签未动 |
