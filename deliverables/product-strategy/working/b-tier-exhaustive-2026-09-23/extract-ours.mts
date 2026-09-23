/**
 * 把「我方到底教了什么」导出成清单（B 档同口径穷举的另一半）。
 *
 * 为什么需要它：Cambridge 的标签是**语法术语**（Adjectives / Determiners /
 * Noun phrases / Reported speech），而我方是**零术语设计**——`grammarZeroTerms.ts`
 * 明令禁用「形容词」「副词」「主语」「从句」「语序」等 29 个词，English 侧也从未
 * 用 `adjectives`／`determiners` 标注过任何一课。
 *
 * ⇒ **用 Cambridge 标签去 grep 我方语料，必然得到大量假缺口。** 实测：
 *   `Adjectives` 判「无匹配」，而我方 `tall` 出现 90 次、`cold` 355 次、
 *   专门讲「描述词站哪」的课有 L58 与 L125–L133 整系列。
 *   这是本批第一版脚本的口径缺陷（第 16 次同类错误），已弃用。
 *
 * 正确口径：**先列出我方实际教过的点**，再由人判断 Cambridge 的哪一条没有对应。
 * 本脚本出前半段——它逐课抽取，产出可复跑、可 diff 的清单。
 *
 * 用法（仓库根目录）：
 *   node --experimental-strip-types deliverables/product-strategy/working/b-tier-exhaustive-2026-09-23/extract-ours.mts
 */
import fs from "node:fs";

const HERE = "deliverables/product-strategy/working/b-tier-exhaustive-2026-09-23";
const src = fs.readFileSync("src/data/grammarLessons.ts", "utf8");

/**
 * 逐课抽取。注意条目排版有两种：
 *   ① 紧凑：`  {\n    id: "lesson-13-now",` （注释在 `{` 之前）
 *   ② 带行内注释：`  {\n    // ── … ──\n    id: "lesson-54-focus",`
 * 所以不能直接用 `id:` 切分——改用 `number:` 作锚（每课恰好一次），
 * 再在该课的窗口内取 `id` / `title` / `grammarLabel`。
 */
const lessons: Array<{ number: number; id: string; title: string; label: string }> = [];
const chunks = src.split(/\n  \{\n(?=(?:\s*\/\/[^\n]*\n)*\s*id: "lesson-)/).slice(1);
for (const chunk of chunks) {
  const number = Number((/^\s*number:\s*(\d+),/m.exec(chunk) ?? [])[1]);
  const id = (/^\s*id:\s*"([^"]+)",/m.exec(chunk) ?? [])[1];
  const title = (/^\s*title:\s*"([^"]+)",/m.exec(chunk) ?? [])[1];
  let label = (/^\s*grammarLabel:\s*"([^"]+)",/m.exec(chunk) ?? [])[1];
  if (label === undefined) {
    // 值折行：取 `grammarLabel:` 之后到下一个顶层字段为止，拼回一行
    const folded = /^\s*grammarLabel:\s*\n?([\s\S]*?)\n\s*(?:episode|scene|cover|sceneSetupZh|blocks):/m.exec(chunk);
    if (folded) {
      label = folded[1]
        .replace(/^\s*"/, "")
        .replace(/",?\s*$/, "")
        .replace(/"\s*\n\s*\+\s*"/g, "")
        .replace(/\s*\n\s*/g, " ")
        .trim();
    }
  }
  if (!Number.isFinite(number) || !id) continue;
  lessons.push({ number, id, title: title ?? "", label: label ?? "" });
}
lessons.sort((a, b) => a.number - b.number);

const missing: number[] = [];
for (let n = 1; n <= lessons[lessons.length - 1].number; n += 1) {
  if (!lessons.some((l) => l.number === n)) missing.push(n);
}
const duplicates = lessons.filter((l, i) => i > 0 && lessons[i - 1].number === l.number).map((l) => l.number);

fs.writeFileSync(`${HERE}/our-lessons.json`, JSON.stringify(lessons, null, 1));
fs.writeFileSync(
  `${HERE}/our-lessons.csv`,
  ["number,id,title,grammarLabel"]
    .concat(lessons.map((l) => `${l.number},"${l.id}","${l.title}","${l.label.replace(/"/g, '""')}"`))
    .join("\n")
);

console.log("抽取课程数:", lessons.length);
console.log("课号范围:", lessons[0].number, "→", lessons[lessons.length - 1].number);
console.log("缺号:", missing.length ? missing.join(",") : "无");
console.log("重号:", duplicates.length ? duplicates.join(",") : "无");
console.log("grammarLabel 为空:", lessons.filter((l) => !l.label).length);
