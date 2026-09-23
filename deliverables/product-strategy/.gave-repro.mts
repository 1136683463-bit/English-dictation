/**
 * 瑞思 · 第 47 批核查脚本 3（gave）—— 反推简报「give 正侧 25」的口径。
 * 做法：把库内所有「顶层字段名」当成一个槽集合，穷举子集（排除法），
 *       找出哪个子集组合能同时满足 give=25、gives=0、gave=0、given=0。
 * 运行：./node_modules/.bin/vite-node deliverables/product-strategy/.gave-repro.mts
 */
import { grammarLessons } from "../../src/data/grammarLessons";

const wbTest = (w: string) => (s: string) => new RegExp(`(?<![A-Za-z-])${w}(?![A-Za-z-])`).test(s);
const wbCount = (w: string, s: string) => (s.match(new RegExp(`(?<![A-Za-z-])${w}(?![A-Za-z-])`, "g")) ?? []).length;

function strings(v: unknown, path = "", out: { p: string; s: string }[] = []): { p: string; s: string }[] {
  if (typeof v === "string") out.push({ p: path, s: v });
  else if (Array.isArray(v)) v.forEach((x, i) => strings(x, `${path}[${i}]`, out));
  else if (v && typeof v === "object")
    for (const [k, x] of Object.entries(v as Record<string, unknown>)) strings(x, path ? `${path}.${k}` : k, out);
  return out;
}
type Row = { L: number; p: string; s: string };
const F: Row[] = [];
for (const L of grammarLessons) for (const { p, s } of strings(L)) F.push({ L: L.number, p, s });

/** 把路径归一成「槽签名」：xx[3].yy[2].zz → xx[].yy[].zz */
const sig = (p: string) => p.replace(/\[\d+\]/g, "[]");
const S = new Set<string>();
for (const r of F) S.add(sig(r.p));
const slots = [...S].sort();

const count = (w: string, keep: (r: Row) => boolean, mode: "fields" | "occ" | "uniq") => {
  const t = wbTest(w);
  const rows = F.filter((r) => keep(r) && t(r.s));
  if (mode === "fields") return rows.length;
  if (mode === "occ") return rows.reduce((a, r) => a + wbCount(w, r.s), 0);
  return new Set(rows.map((r) => r.s.trim())).size;
};

console.log(`共 ${F.length} 个字段，${slots.length} 种槽签名：`);
console.log(slots.join("\n"));

const TARGET: Record<string, number> = { give: 25, gives: 0, gave: 0, given: 0 };
console.log("\n全部槽签名下的原始计数（fields / occ / uniq）：");
console.log("槽签名".padEnd(46) + ["give", "gives", "gave", "given"].map((w) => w.padStart(20)).join(""));
for (const s of slots) {
  const keep = (r: Row) => sig(r.p) === s;
  console.log(
    s.padEnd(46) +
      ["give", "gives", "gave", "given"]
        .map((w) => `${count(w, keep, "fields")}/${count(w, keep, "occ")}/${count(w, keep, "uniq")}`.padStart(20))
        .join("")
  );
}

/** 穷举：从槽集合里选一个「顶层字段名白名单」（按第一段字段名分组），看能否命中 give=25。 */
const topGroups = new Map<string, string[]>();
for (const s of slots) {
  const top = s.split(/[.[]/)[0];
  if (!topGroups.has(top)) topGroups.set(top, []);
  topGroups.get(top)!.push(s);
}
const tops = [...topGroups.keys()].sort();
console.log(`\n顶层字段名 ${tops.length} 个：${tops.join(" ")}`);

console.log("\n穷举「保留哪些顶层字段」的所有子集（2^n），找 give 正侧 = 25 的组合（fields / occ / uniq 三种度量）：");
const hits: string[] = [];
const n = tops.length;
if (n > 22) {
  console.log(`  ⚠️ 顶层字段 ${n} 个，2^${n} 太大，改为贪心：从全字段出发，逐个剔除单个顶层字段，看是否出现 25。`);
  for (const drop of tops) {
    const keep = (r: Row) => sig(r.p).split(/[.[]/)[0] !== drop;
    const v = [count("give", keep, "fields"), count("give", keep, "occ"), count("give", keep, "uniq")];
    if (v.some((x) => x === 25)) hits.push(`剔除[${drop}] → ${v.join("/")}`);
  }
} else {
  for (let mask = 0; mask < 1 << n; mask++) {
    const allow = new Set(tops.filter((_, i) => mask & (1 << i)));
    const keep = (r: Row) => allow.has(sig(r.p).split(/[.[]/)[0]);
    const v = [count("give", keep, "fields"), count("give", keep, "occ"), count("give", keep, "uniq")];
    v.forEach((x, i) => {
      if (x === 25 && count("gives", keep, ["fields", "occ", "uniq"][i] as "fields") === 0) {
        hits.push(`保留[${[...allow].join(",")}] ${["f", "o", "u"][i]}=25`);
      }
    });
  }
}
console.log(hits.length ? hits.slice(0, 40).join("\n") : "  （没有任何单层组合给出 25）");

console.log("\n逐个剔除单槽（从全字段出发）能否得到 give 正侧 = 25：");
for (const s of slots) {
  const keep = (r: Row) => sig(r.p) !== s;
  const v = [count("give", keep, "fields"), count("give", keep, "occ"), count("give", keep, "uniq")];
  if (v.some((x) => x === 25)) console.log(`  剔除 ${s.padEnd(40)} → f/o/u = ${v.join("/")}  ✅ 命中 25`);
}

console.log("\n两两剔除组合（找 give=25 且 gives=gave=given=0）：");
let found2 = 0;
for (let i = 0; i < slots.length; i++) {
  for (let j = i + 1; j < slots.length; j++) {
    const drop = new Set([slots[i], slots[j]]);
    const keep = (r: Row) => !drop.has(sig(r.p));
    for (const mode of ["fields", "occ", "uniq"] as const) {
      if (count("give", keep, mode) === 25 && count("gives", keep, mode) === 0 && count("gave", keep, mode) === 0 && count("given", keep, mode) === 0) {
        console.log(`  ✅ 剔除 {${slots[i]}, ${slots[j]}} ${mode} → give=25 gives=0 gave=0 given=0`);
        found2++;
      }
    }
  }
}
console.log(`  两两组合命中 ${found2} 组`);
