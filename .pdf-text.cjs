const fs = require("fs");
const puppeteer = require("puppeteer-core");

const PDFJS = "https://unpkg.com/pdfjs-dist@3.11.174/build";

(async () => {
  const [pdfPath, pageNumArg] = process.argv.slice(2);
  const pageNum = Number(pageNumArg || 1);
  const b64 = fs.readFileSync(pdfPath).toString("base64");

  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.goto("https://unpkg.com/", { waitUntil: "domcontentloaded" });
    await page.addScriptTag({ url: `${PDFJS}/pdf.min.js` });

    const items = await page.evaluate(
      async (data, workerSrc, num) => {
        const lib = window.pdfjsLib;
        lib.GlobalWorkerOptions.workerSrc = workerSrc;
        const raw = atob(data);
        const bytes = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i);
        const pdf = await lib.getDocument({ data: bytes }).promise;
        const pg = await pdf.getPage(num);
        const content = await pg.getTextContent();
        return content.items
          .filter((it) => it.str.trim())
          .map((it) => ({
            x: Math.round(it.transform[4] * 10) / 10,
            y: Math.round(it.transform[5] * 10) / 10,
            h: Math.round(it.height * 10) / 10,
            f: it.fontName,
            t: it.str,
          }));
      },
      b64,
      `${PDFJS}/pdf.worker.min.js`,
      pageNum,
    );

    // Group onto baselines so the row structure is readable.
    const rows = new Map();
    for (const it of items) {
      const key = it.y;
      if (!rows.has(key)) rows.set(key, []);
      rows.get(key).push(it);
    }
    [...rows.entries()]
      .sort((a, b) => b[0] - a[0])
      .forEach(([y, list]) => {
        list.sort((a, b) => a.x - b.x);
        const text = list.map((i) => i.t).join("");
        const first = list[0];
        console.log(
          `y=${String(y).padStart(7)} x=${String(first.x).padStart(6)} h=${first.h} ${first.f}  ${text.slice(0, 95)}`,
        );
      });
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
