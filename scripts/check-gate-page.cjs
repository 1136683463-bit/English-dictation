/* 站台关卡页 v1 实测：story 三拍子 / gate 参照保留 / 提交流程 / 埋点 */
const { chromium } = require("/Users/liujun/.workbuddy/binaries/node/workspace/node_modules/playwright");

(async () => {
  const browser = await chromium.launch(["--no-sandbox"]);
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });

  // ── story 阶段 ──────────────────────────────
  await page.goto("http://localhost:5199/adventure/gate/station-gate-2", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // 关闭首次启动的 onboarding 弹窗（真实用户只会看到一次）
  const overlay = page.locator(".onboarding-overlay");
  if (await overlay.count()) {
    const skip = overlay.locator("button", { hasText: /跳过|知道了|开始|关闭|以后/ }).first();
    if (await skip.count()) await skip.click();
    else await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
  }

  const highlights = await page.locator(".gate-story-text .gate-highlight").count();
  const briefCard = await page.locator(".gate-brief-card").count();
  const skeleton = await page.locator(".gate-brief-skeleton code").textContent().catch(() => null);
  const intent = await page.locator(".gate-brief-intent").textContent().catch(() => null);
  console.log("story 高亮段数:", highlights, "| 预告卡:", briefCard, "| 镂空句:", skeleton?.trim(), "| 意图:", intent?.replace(/\s+/g, " ").trim());

  // 符文 chip 展开
  await page.locator(".gate-play-rune-chip").click();
  await page.waitForTimeout(300);
  const runeRule = await page.locator(".gate-rune-rule").textContent().catch(() => null);
  console.log("符文 chip 展开:", runeRule?.trim());

  // 折叠提示卡展开
  await page.locator(".gate-tip-toggle").click();
  await page.waitForTimeout(300);
  const tipContent = await page.locator(".gate-tip-content").textContent().catch(() => null);
  console.log("提示卡展开:", tipContent?.replace(/\s+/g, " ").trim());
  await page.screenshot({ path: "gate-v1-story.png" });

  // ── 进入 gate 阶段 ──────────────────────────
  await page.locator(".gate-story-cta").click();
  await page.waitForTimeout(500);
  const inlineSkeleton = await page.locator(".gate-brief-skeleton-line").textContent().catch(() => null);
  const gateIntent = await page.locator(".gate-panel .gate-intent").textContent().catch(() => null);
  console.log("gate 阶段镂空句:", inlineSkeleton?.trim(), "| 意图保留:", gateIntent?.replace(/\s+/g, " ").trim());
  await page.screenshot({ path: "gate-v1-gate.png" });

  // ── 提交正确答案 → settle ───────────────────
  await page.locator(".gate-answer-input").fill("I am ready.");
  await page.locator(".gate-input-actions .primary-button").click();
  await page.waitForTimeout(800);
  const settleVisible = await page.locator(".gate-settle").count();
  console.log("settle 阶段到达:", settleVisible > 0);
  await page.screenshot({ path: "gate-v1-settle.png" });

  // ── 埋点核对 ────────────────────────────────
  const events = await page.evaluate(() => {
    const raw = window.localStorage.getItem("adventure-telemetry-events-v1");
    if (!raw) return [];
    return JSON.parse(raw).events.map((e) => e.kind + (e.phase ? `(${e.phase})` : "") + (e.dwellMs != null ? ` dwell=${e.dwellMs}ms` : ""));
  });
  console.log("埋点事件:", events.slice(-8));

  await browser.close();
  console.log("done");
})();
