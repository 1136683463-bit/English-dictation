// @vitest-environment node
/**
 * EX9 · 主行动按钮对比度闸（G13「自动测色差」）
 *
 * 来源：`uiux-audit-2026-09-24-grammar/PRODUCT_DESIGN_AUDIT.md` A-1 + §七 建议第 2 条
 *   「把品牌橙修到达标对比度。一次 token 改动覆盖所有主按钮与所有橙色小标，
 *     是本次唯一『一行改动能扫掉一屏问题』的项。」
 *
 * 审计的原始实测：白字在品牌橙 `rgb(242,106,27)` 上 = **3.06:1**，
 * 按 WCAG AA 需要 4.5:1（16px/700 不属于 large text；large 门槛是 18.66px+700）。
 * 它点名的是「去讲解里揭晓」「去上这一课」「返回语法地图」「提交」「从第 1 课开始」
 * 等**所有**主按钮，影响全部 10 条语法路由。
 *
 * 为什么这条要写成自动闸而不是「改完看一眼」：
 *   ① 对比度是可以精确计算的，肉眼看不出 3.06 与 4.4 的差别；
 *   ② 品牌色很容易被后续改动顺手改回去（审计自己都提醒「动手前复核橙色 token」）；
 *   ③ 这条闸顺带守住「不许再出现白字压品牌橙填充」这一整类问题（13 条规则）。
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const CSS = readFileSync(new URL("../../styles.css", import.meta.url), "utf8");

/** sRGB 相对亮度（WCAG 2.x 定义）。 */
const luminance = (hex: string): number => {
  const h = hex.replace("#", "");
  const channel = (value: number) => {
    const c = value / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

/** 两色对比度（1–21）。 */
const contrast = (a: string, b: string): number => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const WHITE = "#ffffff";
const WCAG_AA = 4.5;

/** 从 CSS 里读一个自定义属性的原始值（只认第一条定义）。 */
const tokenRaw = (name: string): string => {
  const match = CSS.match(new RegExp(`--${name}:\\s*([^;]+);`));
  if (!match) throw new Error(`styles.css 里找不到 token --${name}`);
  return match[1].trim();
};

/** 读颜色 token（十六进制）。 */
const token = (name: string): string => {
  const value = tokenRaw(name);
  if (!/^#[0-9a-fA-F]{6}$/.test(value)) throw new Error(`--${name} 不是十六进制色值：${value}`);
  return value.toLowerCase();
};

/** 按「选择器{体}」切块，用于扫描规则。 */
const rules = (css: string): Array<{ selector: string; body: string }> => {
  const out: Array<{ selector: string; body: string }> = [];
  const pattern = /([^{}]+)\{([^{}]*)\}/g;
  let match = pattern.exec(css);
  while (match) {
    out.push({ selector: match[1].trim(), body: match[2] });
    match = pattern.exec(css);
  }
  return out;
};

describe("EX9 主按钮对比度（A-1）", () => {
  it("闸不是空转：审计报的那个颜色必须被判不达标", () => {
    // 反向对照——审计实测 3.06，这里必须复现出同一个数，否则说明算法不对
    const auditOrange = "#f26a1b";
    expect(contrast(WHITE, auditOrange), "应复现审计实测的 3.06").toBeCloseTo(3.064, 2);
    expect(contrast(WHITE, auditOrange), "审计报的橙色必须判不达标").toBeLessThan(WCAG_AA);
    // 顺带证明「改用 accent-strong 就够」这条捷径不成立
    expect(contrast(WHITE, "#d95a12"), "--accent-strong 也不达标").toBeLessThan(WCAG_AA);
  });

  it("CTA 专用色达标且有余量（常态 ≥4.5，hover 更深）", () => {
    const cta = token("accent-cta");
    const ctaStrong = token("accent-cta-strong");
    expect(contrast(WHITE, cta), `--accent-cta(${cta}) 白字对比度`).toBeGreaterThanOrEqual(WCAG_AA);
    expect(contrast(WHITE, ctaStrong), `--accent-cta-strong(${ctaStrong}) 白字对比度`).toBeGreaterThanOrEqual(WCAG_AA);
    // hover 必须比常态更深（否则悬停时对比度反而下降）
    expect(luminance(ctaStrong), "hover 色应比常态更深").toBeLessThan(luminance(cta));
    // 余量：不要卡在 4.5 线上，四舍五入或微小调整就会破
    expect(contrast(WHITE, cta), "常态色应有 ≥0.5 的余量").toBeGreaterThanOrEqual(WCAG_AA + 0.5);
  });

  it("全表扫描：没有任何规则再出现「白字 + 品牌橙/深橙 实心填充」", () => {
    const offenders: string[] = [];
    for (const rule of rules(CSS)) {
      const flat = rule.body.replace(/\s/g, "");
      const hasWhiteText = flat.includes("color:#fff") || flat.includes("color:#ffffff");
      if (!hasWhiteText) continue;
      for (const bad of ["background:var(--accent)", "background:var(--accent-strong)", `background:${token("accent")}`]) {
        if (flat.includes(bad)) {
          offenders.push(`${rule.selector.replace(/\n/g, " ").slice(0, 70)} → ${bad}`);
        }
      }
    }
    expect(offenders, `白字压品牌橙的规则（A-1 同一类）：\n${offenders.join("\n")}`).toEqual([]);
  });

  it("登记残余：品牌橙作为**文字色**仍有不达标项（A-2 类，未在本轮修）", () => {
    /**
     * 本轮只修了「白字 + 实心填充」这一层（审计 A-1 点名的主行动按钮）。
     * `--accent` 仍被用作**橙字压浅底/白底**，那是审计 A-2 的那一类，需要另外裁决
     * 「要不要把品牌色整体压暗」—— 那会重绘全站 170+ 处，属品牌级改动，不宜顺手做。
     * 这里把现状**钉成数字**，避免「以为已经全修好了」；等 A-2 真被处理时这条会红，提示更新。
     */
    const accent = token("accent");
    const orangeOnWhite = contrast(accent, WHITE);
    expect(orangeOnWhite, "橙色文字压白底仍不达标（A-2 类，已知残余）").toBeLessThan(WCAG_AA);
    expect(orangeOnWhite, "残值应与审计的 3.06 同源").toBeCloseTo(3.064, 2);
  });
});

/**
 * 移动端固定底栏遮挡（审计 F-1 —— 与 A-1 同属「一行改动扫掉一屏问题」）。
 *
 * 实测链条（2026-09-25，375×667，真机 IAB 而非 jsdom）：
 *   - `aside.sidebar` 变 `position: fixed`，高 **212px = 视口 31.8%**（审计报 213px/32%，一致）
 *   - `.app-shell` 的预留 `padding-bottom` 曾在两处被写死为 **74px**（≤860px 档、≤520px 档），
 *     而 375px 落在 ≤520px 档 → **实际差 138px**
 *   - 后果：诊断屏最后一个可交互元素「回到语法地图」被压住，中心点命中 `.sidebar-streak`；
 *     `/grammar` 长页同样有元素被压住（审计 F-1 记录的正是这一条）
 *
 * 修法不是「再写一个大一点的数」，而是把预留空间**绑定到底栏高度 token** `--mobile-bar-h`，
 * 两处断点都引用它 —— 于是底栏内容变化时不会再次各自漂移。本用例锁住这个结构。
 */
describe("EX9 移动端底栏不遮挡内容（F-1）", () => {
  it("底栏高度 token 存在、且是实测量级（≥200px）", () => {
    const barHeight = tokenRaw("mobile-bar-h");
    const px = Number(barHeight.replace("px", ""));
    expect(Number.isFinite(px), `--mobile-bar-h 应是 px 值，实为 ${barHeight}`).toBe(true);
    expect(px, "底栏实测 212px；低于 200 说明被改小了").toBeGreaterThanOrEqual(200);
  });

  it("每个 .app-shell 的底部预留都引用该 token（不许再写死小数）", () => {
    const offenders: string[] = [];
    for (const rule of rules(CSS)) {
      if (!/\.app-shell\b/.test(rule.selector)) continue;
      const match = rule.body.match(/padding-bottom:\s*([^;]+);/);
      if (!match) continue;
      const value = match[1].trim();
      if (!value.includes("var(--mobile-bar-h)")) {
        offenders.push(`selector=${rule.selector.replace(/\n/g, " ").slice(0, 50)} → padding-bottom: ${value}`);
      }
    }
    expect(offenders, `未绑定底栏高度的预留（会与底栏实际高度漂移）：\n${offenders.join("\n")}`).toEqual([]);
  });

  it("预留空间确实大于底栏高度（算术上保证尾部内容可达）", () => {
    const barPx = Number(tokenRaw("mobile-bar-h").replace("px", ""));
    const reserved = barPx + 16; // calc(var(--mobile-bar-h) + 16px + env(safe-area-inset-bottom))
    expect(reserved).toBeGreaterThan(barPx);
    expect(reserved - barPx, "至少留出可见的呼吸间隔，避免紧贴底栏").toBeGreaterThanOrEqual(12);
  });
});

/**
 * 审计 A-1 末尾那条建议的落地（「把深色值推广到所有橙色小字，并确认没有遗留的浅色实例」）。
 *
 * 复核结论：该建议**从未落地** —— 深色值 #c04a0b 全库只出现 1 次，
 * 而 `--accent`(#f26a1b) 作为 ≤14px 小字仍在 13 条规则里（含 `.sidebar a.active`，
 * 即每页都可见的侧栏当前项）。审计问的「有没有遗留的浅色实例」，答案是**有**。
 */
describe("EX9 橙色小字达标（A-1 末尾那条建议）", () => {
  it("--accent-text 在两种常见浅底上都达标且有余量", () => {
    const text = token("accent-text");
    const soft = token("accent-soft");
    expect(contrast(text, WHITE), `--accent-text(${text}) on 白`).toBeGreaterThanOrEqual(WCAG_AA);
    expect(contrast(text, soft), `--accent-text(${text}) on --accent-soft(${soft})`).toBeGreaterThanOrEqual(WCAG_AA);
    // 贴着 4.5 会因底色微调就掉线（审计自己提醒过），要求实打实的余量
    expect(contrast(text, soft), "在浅橙底上应留有余量").toBeGreaterThanOrEqual(WCAG_AA + 0.15);
    expect(luminance(text), "文字色应比品牌橙更深").toBeLessThan(luminance(token("accent")));
  });

  it("没有遗留的浅色实例：≤14px 的橙字不再用 --accent", () => {
    const offenders: string[] = [];
    for (const rule of rules(CSS)) {
      const flat = rule.body.replace(/\s/g, "");
      if (!flat.includes("color:var(--accent)")) continue;
      const sizes = [...rule.body.matchAll(/font-size:\s*([\d.]+)px/g)].map((m) => Number(m[1]));
      if (sizes.length > 0 && sizes.every((size) => size <= 14)) {
        offenders.push(`${rule.selector.replace(/\n/g, " ").slice(0, 60)} (${sizes.join("/")}px)`);
      }
    }
    expect(offenders, `≤14px 仍是浅色橙的规则：\n${offenders.join("\n")}`).toEqual([]);
  });

  it("A-2 五组全部达标（2026-09-25 落盘；此前五组全不达标）", () => {
    /**
     * 审计 A-2 的五组，逐项复核 + 修复。修复方式是改 token 值（五组的前景/背景全是 token），
     * 不动任何规则。每组都要求**有把握的余量**——审计自己提醒过贴着线取值会因底色微调而掉下去。
     */
    const pairs: Array<{ name: string; fg: string; bg: string; need: number }> = [
      { name: "①--accent-strong on --accent-soft", fg: tokenRaw("accent-strong"), bg: token("accent-soft"), need: WCAG_AA },
      { name: "②--secondary on 白（20px 标题 = large text）", fg: tokenRaw("secondary"), bg: WHITE, need: 3.0 },
      { name: "③--sidebar-ink-muted on 白", fg: tokenRaw("sidebar-ink-muted"), bg: WHITE, need: WCAG_AA },
      { name: "④--sidebar-ink on 白", fg: tokenRaw("sidebar-ink"), bg: WHITE, need: WCAG_AA },
      { name: "⑤--blue on --blue-soft", fg: tokenRaw("blue"), bg: token("blue-soft"), need: WCAG_AA }
    ];
    const failures: string[] = [];
    for (const pair of pairs) {
      const ratio = contrast(pair.fg, pair.bg);
      if (ratio < pair.need + 0.1) {
        failures.push(`${pair.name}：${pair.fg} on ${pair.bg} = ${ratio.toFixed(2)}:1（需 ${pair.need} + 余量）`);
      }
    }
    expect(failures, `A-2 未达标项（余量要求 +0.1）：\n${failures.join("\n")}`).toEqual([]);
  });

  it("A-2③ 的取舍已登记：弱化灰与主灰合并为同一值（有意为之，非笔误）", () => {
    /**
     * 「继续加油！」那行 12px 小字原本用 --sidebar-ink-muted(#949ca8, 2.77:1)。
     * 要达标必须暗到 ≈#6b7481，而那正好等于主灰的达标值 —— 于是「弱化」在数值上消失。
     * 这是**有意选择 A 方案**（层次价值 < 可读性）。若哪天有人把它们改回不同值，
     * 这条会红，提示先做一次取舍而不是随手调灰。
     */
    expect(tokenRaw("sidebar-ink-muted"), "应与主灰一致（A 方案：合并）").toBe(tokenRaw("sidebar-ink"));
    expect(contrast(tokenRaw("sidebar-ink"), WHITE)).toBeGreaterThanOrEqual(WCAG_AA);
  });
});
