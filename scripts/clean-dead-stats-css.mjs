// 死 CSS 清理：删除选择器列表中所有选择器都含死类的规则；混合列表只摘除死选择器；空 @media 一并移除。
// 死类 = styles.css 中存在但 src/**/*.ts(x) 零引用（由调用方先扫描确认）。
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const cssPath = fileURLToPath(new URL("../src/styles.css", import.meta.url));
const css = readFileSync(cssPath, "utf8");

const DEAD = [
  "stats-action-workbench", "stats-advice-art", "stats-advice-panel", "stats-brief", "stats-brief-grid",
  "stats-brief-main", "stats-combo-list", "stats-combo-panel", "stats-combo-step", "stats-detail-grid",
  "stats-focus-card", "stats-focus-grid", "stats-focus-icon", "stats-goal-panel", "stats-health-meter",
  "stats-metric-grid", "stats-mobile-coach", "stats-mobile-coach-head", "stats-mobile-next-card",
  "stats-mobile-next-icon", "stats-mobile-plan-pill", "stats-mobile-plan-strip", "stats-mobile-risk",
  "stats-mobile-score", "stats-next-due", "stats-plan-actions", "stats-plan-chip", "stats-plan-meta",
  "stats-plan-tag", "stats-report-grid", "stats-risk-card", "stats-risk-list", "stats-risk-panel",
  "stats-trend-panel", "stats-wrong-panel", "health-ring",
  // v2 重构后无引用（src/**/*.tsx 零匹配）：
  "stats-zone", "stats-zone-body", "stats-zone-chevron", "stats-zone-columns", "stats-zone-due",
  "stats-zone-hint", "stats-zone-suggest", "stats-zone-title",
  "stats-coach-score", "stats-core-metrics", "stats-secondary-metrics", "stats-top-grid",
  "stats-north-star-head", "stats-plan-summary", "stats-plan-summary-copy",
  "stats-risk-summary", "stats-wrong-card",
  "trend-dot", "trend-legend-note", "ui-row-arrow"
];

const deadRe = new RegExp(`\\.(${DEAD.join("|")})(?![a-zA-Z-])`);
const selectorIsDead = (selector) => deadRe.test(selector);

const processCss = (input) => {
  let out = "";
  let i = 0;
  while (i < input.length) {
    const brace = input.indexOf("{", i);
    if (brace === -1) {
      out += input.slice(i);
      break;
    }
    const prelude = input.slice(i, brace);
    let depth = 1;
    let j = brace + 1;
    while (depth > 0 && j < input.length) {
      if (input[j] === "{") depth += 1;
      else if (input[j] === "}") depth -= 1;
      j += 1;
    }
    const body = input.slice(brace + 1, j - 1);

    if (prelude.trim().startsWith("@media")) {
      const inner = processCss(body);
      if (inner.trim()) out += `${prelude}{${inner}}`;
    } else {
      const selectors = prelude.split(",").map((item) => item.trim()).filter(Boolean);
      const live = selectors.filter((item) => !selectorIsDead(item));
      if (live.length === selectors.length) {
        out += `${prelude}{${body}}`;
      } else if (live.length > 0) {
        out += `\n${live.join(",\n")} {${body}}\n`;
      }
      // live.length === 0 → 整条规则删除
    }
    i = j;
  }
  return out;
};

const result = processCss(css);
// 收敛因删规则产生的连续空行（最多保留 1 个空行）
const compacted = result.replace(/\n{3,}/g, "\n\n");

const balance = (text) => {
  let depth = 0;
  for (const ch of text) {
    if (ch === "{") depth += 1;
    if (ch === "}") depth -= 1;
    if (depth < 0) return -1;
  }
  return depth;
};

if (balance(compacted) !== 0) {
  console.error("ABORT: brace imbalance after processing:", balance(compacted));
  process.exit(1);
}

const removed = css.split("\n").length - compacted.split("\n").length;
writeFileSync(cssPath, compacted);
console.log(`OK removed ~${removed} lines; dead selectors remaining: ${(compacted.match(deadRe) || []).length}`);
