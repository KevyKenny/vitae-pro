const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");

(async () => {
  const [url, outDir, prefix, widthArg] = process.argv.slice(2);
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: Number(widthArg || 1000),
      height: 1200,
      deviceScaleFactor: 1.7,
    });
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
    await page.waitForSelector(".doc-page", { timeout: 120000 });
    await page
      .waitForSelector('[data-document-ready="true"]', { timeout: 90000 })
      .catch(() => console.warn("no ready marker"));
    await new Promise((r) => setTimeout(r, 1500));

    // Hide the dev overlay so it never lands in a comparison shot.
    await page.addStyleTag({
      content: "nextjs-portal,#__next-build-watcher{display:none !important}",
    });

    const pages = await page.$$(".doc-pages-stack .doc-page");
    console.log("pages:", pages.length);
    for (let i = 0; i < pages.length; i += 1) {
      const file = path.join(outDir, `${prefix}-p${i + 1}.png`);
      await pages[i].screenshot({ path: file });
      console.log(file);
    }
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
