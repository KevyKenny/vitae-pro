const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");

const PDFJS = "https://unpkg.com/pdfjs-dist@3.11.174/build";

(async () => {
  const [pdfPath, outDir, prefix] = process.argv.slice(2);
  fs.mkdirSync(outDir, { recursive: true });
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
    const count = await page.evaluate(async (data, workerSrc) => {
      const lib = window.pdfjsLib;
      lib.GlobalWorkerOptions.workerSrc = workerSrc;
      const raw = atob(data);
      const bytes = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i);
      const pdf = await lib.getDocument({ data: bytes }).promise;
      window.__pdf = pdf;
      return pdf.numPages;
    }, b64, `${PDFJS}/pdf.worker.min.js`);

    const scale = 1.7;
    for (let n = 1; n <= count; n += 1) {
      const dataUrl = await page.evaluate(async (num, s) => {
        const pdf = window.__pdf;
        const pg = await pdf.getPage(num);
        const viewport = pg.getViewport({ scale: s });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await pg.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
        return canvas.toDataURL("image/png");
      }, n, scale);
      const buf = Buffer.from(dataUrl.split(",")[1], "base64");
      const file = path.join(outDir, `${prefix}-p${n}.png`);
      fs.writeFileSync(file, buf);
      console.log(file);
    }
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
