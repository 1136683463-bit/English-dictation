/* 用真实浏览器截图 150 张主题插画，供人工检查美术质量。 */
const { chromium } = require("/Users/liujun/.workbuddy/binaries/node/workspace/node_modules/playwright");

(async () => {
  const browser = await chromium.launch(["--no-sandbox"]);
  const page = await browser.newPage({ viewport: { width: 1180, height: 1400 }, deviceScaleFactor: 2 });
  await page.goto("http://localhost:5199/theme-art-preview.html", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const cards = await page.locator(".card").count();
  console.log("cards rendered:", cards);
  await page.screenshot({ path: "theme-art-preview-top.png", clip: { x: 0, y: 0, width: 1180, height: 1400 } });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.35));
  await page.waitForTimeout(200);
  await page.screenshot({ path: "theme-art-preview-mid.png", clip: { x: 0, y: 0, width: 1180, height: 1400 } });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.7));
  await page.waitForTimeout(200);
  await page.screenshot({ path: "theme-art-preview-bottom.png", clip: { x: 0, y: 0, width: 1180, height: 1400 } });
  await browser.close();
  console.log("done");
})();
