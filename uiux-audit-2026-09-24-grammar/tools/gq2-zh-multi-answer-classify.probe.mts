// 对 29 条 zhMultiAnswerSingleKey 分类：真缺陷 vs 扫描的泛化指令误报。
// 只读。运行：npx vite-node <此文件>
import { grammarLessons } from "../../src/data/grammarLessons.ts";
import { buildBoostItems, judgeBoostItem } from "../../src/services/grammarBoostService.ts";

const L = grammarLessons as any[];
const norm = (v: string): string =>
  v.toLowerCase().replace(/[.,!?;:'"’‘“”()\[\]{}]/g, "").replace(/\s+/g, " ").trim();

const rawEn = new Map<string, string>();
const addRaw = (e?: string) => { if (e && e.trim()) rawEn.set(norm(e), e.trim()); };
for (const l of L) {
  addRaw(l.targetSentence);
  (l.examples ?? []).forEach((x: any) => addRaw(x.en));
  (l.sceneSwings ?? []).forEach((x: any) => addRaw(x.en));
  (l.variants ?? []).forEach((x: any) => addRaw(x.en));
  (l.practice ?? []).forEach((x: any) => addRaw(x.answer));
  if (l.recall) addRaw(l.recall.answer);
}
const restore = (k: string) => rawEn.get(k) ?? k;

// intentZh 是否只作「泛化指令」用：看共享这句中文的英文句子来自多少【不同的课】
const zhToSources = new Map<string, Set<string>>();
const zhToEn = new Map<string, Map<string, string>>();
const push = (zh: string, en: string, lessonId: string) => {
  const z = (zh ?? "").trim(), e = (en ?? "").trim();
  if (!z || !e) return;
  const s = zhToSources.get(z) ?? new Set<string>(); s.add(lessonId); zhToSources.set(z, s);
  const m = zhToEn.get(z) ?? new Map<string, string>(); m.set(norm(e), e); zhToEn.set(z, m);
};
for (const l of L) {
  push(l.intentZh, l.targetSentence, l.id);
  (l.sceneSwings ?? []).forEach((x: any) => push(x.zh, x.en, l.id));
  (l.variants ?? []).forEach((x: any) => push(x.zh, x.en, l.id));
  (l.examples ?? []).forEach((x: any) => push(x.zh, x.en, l.id));
  (l.practice ?? []).forEach((x: any) => push(x.promptZh, x.answer, l.id));
  if (l.recall) push(l.recall.intentZh, l.recall.answer, l.id);
}

type Row = { id: string; lessonId: string; kind: string; tier: number; intentZh: string; answer: string;
             altEn: string; altFromLesson: string; altScore: number; altPassed: boolean;
             zhLessonSpread: number; verdict: string };
const rows: Row[] = [];
for (const l of L) {
  for (const tier of [1, 2, 3] as const) {
    for (let r = 0; r < 16; r++) {
      for (const item of buildBoostItems(l.id, tier, { round: r }) as any[]) {
        if (!["recall", "translate", "produce"].includes(item.kind)) continue;
        const iz = String(item.intentZh ?? "").trim();
        if (!iz) continue;
        const m = zhToEn.get(iz);
        if (!m || m.size <= 1) continue;
        const alts = [...m.entries()].filter(([k]) => k !== norm(item.answer));
        if (!alts.length) continue;
        if (rows.some((x) => x.id === item.id)) continue;
        const [k, en] = alts[0];
        const j = judgeBoostItem(item, { text: en });
        const spread = zhToSources.get(iz)?.size ?? 0;
        rows.push({
          id: item.id, lessonId: l.id, kind: item.kind, tier,
          intentZh: iz, answer: item.answer, altEn: en, altFromLesson: k,
          altScore: (j as any).score ?? -1, altPassed: j.passed,
          zhLessonSpread: spread,
          verdict: j.passed ? "判分接受（非缺陷）"
                 : /说一遍|串起来|把这一|把这章|把这几/.test(iz) ? "扫描误报（题干是「指令」不是可翻译的句子）"
                 : k.startsWith(l.id + ":") ? "真缺陷·同课自相矛盾（另一解就出自本课）"
                 : "需人工判定（另一解来自别课，两种英文是否等价要看语义）"
        });
      }
    }
  }
}

console.log("命中题数:", rows.length);
console.log();
const byVerdict = new Map<string, Row[]>();
for (const r of rows) byVerdict.set(r.verdict, [...(byVerdict.get(r.verdict) ?? []), r]);
for (const [v, rs] of [...byVerdict.entries()].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`【${v}】${rs.length} 条`);
  for (const r of rs) {
    console.log(`   ${r.id}  [${r.kind} t${r.tier}]`);
    console.log(`      题干中文: 「${r.intentZh}」  ｜ 该中文被引用于 ${r.zhLessonSpread} 课的英文句子`);
    console.log(`      只认: 「${r.answer}」  另一解: 「${r.altEn}」→ ${r.altPassed ? "通过" : `不通过（${r.altScore} 分）`}`);
  }
  console.log();
}
