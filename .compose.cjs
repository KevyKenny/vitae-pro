const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");

// node .compose.cjs <dir> <out.png> <refPrefix> <curPrefix> <pageCount>
const [dir, out, refPrefix, curPrefix, countArg] = process.argv.slice(2);
const count = Number(countArg || 3);

const toSrc = (file) => {
  const full = path.join(dir, file);
  if (!fs.existsSync(full)) return null;
  return `data:image/png;base64,${fs.readFileSync(full).toString("base64")}`;
};

const rows = [];
for (let i = 1; i <= count; i += 1) {
  const a = toSrc(`${refPrefix}-p${i}.png`);
  const b = toSrc(`${curPrefix}-p${i}.png`);
  if (!a && !b) continue;
  rows.push(`<div class="row">
    <div class="col"><div class="cap">REFERENCE ${refPrefix} — page ${i}</div>${
      a ? `<img src="${a}">` : '<div class="miss">no page</div>'
    }</div>
    <div class="col"><div class="cap">CURRENT ${curPrefix} — page ${i}</div>${
      b ? `<img src="${b}">` : '<div class="miss">no page</div>'
    }</div>
  </div>`);
}

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body { margin: 0; background: #eef1f5; font: 13px/1.4 "Segoe UI", system-ui, sans-serif; }
  .row { display: flex; gap: 18px; padding: 18px; }
  .col { flex: 1; }
  .cap { font-weight: 600; margin-bottom: 6px; color: #1f2937; }
  img { width: 100%; display: block; border: 1px solid #cbd5e1; background: #fff; }
  .miss { border: 1px dashed #cbd5e1; padding: 40px; text-align: center; color: #64748b; background:#fff; }
</style></head><body>${rows.join("\n")}</body></html>`;

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1500, height: 1200, deviceScaleFactor: 1.3 });
    await page.setContent(html, { waitUntil: "load" });
    await page.screenshot({ path: out, fullPage: true });
    console.log(out);
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
