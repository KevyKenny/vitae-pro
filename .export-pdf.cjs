const fs = require("fs");
const puppeteer = require("puppeteer-core");

(async () => {
  const [url, out] = process.argv.slice(2);
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
    await page.waitForSelector(".doc-page", { timeout: 120000 });
    await page
      .waitForSelector('[data-document-ready="true"]', { timeout: 90000 })
      .catch(() => console.warn("no document-ready marker; continuing"));
    await page.emulateMediaType("print");
    await new Promise((r) => setTimeout(r, 1200));
    const pdf = await page.pdf({
      format: "a4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
    fs.writeFileSync(out, Buffer.from(pdf));
    console.log(out, Buffer.from(pdf).length, "bytes");
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
