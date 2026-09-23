import { grammarLessons } from "../../../../src/data/grammarLessons";
import * as echo from "../../../../src/data/echoGateScripts";
import * as gate from "../../../../src/data/gateScripts";
import * as lib from "../../../../src/data/libraryGateScripts";
import * as lh from "../../../../src/data/lighthouseGateScripts";
import * as mk from "../../../../src/data/marketGateScripts";
import * as mt from "../../../../src/data/mountainGateScripts";
const W = (f: string, t?: string) => !!t && new RegExp(`(?<![A-Za-z-])${f}(?![A-Za-z-])`, "i").test(t);
const gateLists: Record<string, any[]> = { echo: echo.ECHO_GATES, gate: gate.STATION_GATES, lib: lib.LIBRARY_GATES, lh: lh.LIGHTHOUSE_GATES, mk: mk.MARKET_GATES, mt: mt.MOUNTAIN_GATES };
// ① IRREGULAR_PAST 的 tell→told 能否触发？触发条件是「参考答案含 told 且玩家用 tell」
let canFire = 0;
const witnesses: string[] = [];
for (const [n, list] of Object.entries(gateLists)) for (const g of list) {
  const sample = g.sampleAnswer ?? "";
  const accept = g.acceptRegex ?? "";
  if (W("told", sample) || (accept && /told/i.test(accept))) { canFire++; witnesses.push(`${n}:${g.id}`); }
}
console.log("=== ① languageGateService.IRREGULAR_PAST 的 `tell: \"told\"` 能否被触发？===");
console.log(`  触发条件：某关的 sampleAnswer / acceptRegex 里含 told`);
console.log(`  实测含 told 的关卡数 = ${canFire}  ${witnesses.join(",") || "（0 → 该表项为死代码）"}`);
console.log(`  另：PAST_TIME_HINTS 需玩家答案含 yesterday/last night/… 才会进入判定——即使有 told 也只在这些场景`);
// ② grammarAmbushService 的 GRAMMAR_WORDS 含 tell/tells/told —— 它作用在 variant.en 上
let ambushFire: string[] = [];
for (const l of grammarLessons) for (const v of l.variants ?? []) if (W("tell", v.en) || W("tells", v.en) || W("told", v.en)) ambushFire.push(`L${l.number}`);
console.log("\n=== ② grammarAmbushService.GRAMMAR_WORDS（cloze 抽空）作用在 variants[].en ===");
console.log(`  含 tell 家族的 variant.en 数 = ${ambushFire.length} ${ambushFire.join(",") || "（0 → 该词表项为死代码）"}`);
// recall 也用 pickClozeWord? 检查
console.log(`  recall.answer 含 tell? ${grammarLessons.filter(l=>l.recall&&W("tell",l.recall.answer)).length} 处`);
// ③ adventureService 的 englishText
console.log("\n=== ③ adventureService 的 story englishText（用户可见叙事文本）===");
