const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");

const PDFJS = "https://unpkg.com/pdfjs-dist@3.11.174/build";

(async () => {
  const [pdfPath, outDir, scaleArg] = process.argv.slice(2);
  const scale = Number(scaleArg || 1.6);
  fs.mkdirSync(outDir, { recursive: true });
  const b64 = fs.readFileSync(pdfPath).toString("base64");

  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1000, height: 1400 });
    await page.goto("https://unpkg.com/", { waitUntil: "domcontentloaded" });
    await page.addScriptTag({ url: `${PDFJS}/pdf.min.js` });

    const images = await page.evaluate(
      async (data, workerSrc, renderScale) => {
        const lib = window.pdfjsLib;
        lib.GlobalWorkerOptions.workerSrc = workerSrc;
        const raw = atob(data);
        const bytes = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i);
        const pdf = await lib.getDocument({ data: bytes }).promise;
        const out = [];
        for (let p = 1; p <= pdf.numPages; p += 1) {
          const pg = await pdf.getPage(p);
          const viewport = pg.getViewport({ scale: renderScale });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await pg.render({ canvasContext: ctx, viewport }).promise;
          out.push(canvas.toDataURL("image/png"));
        }
        return out;
      },
      b64,
      `${PDFJS}/pdf.worker.min.js`,
      scale,
    );

    const base = path.basename(pdfPath, ".pdf");
    images.forEach((dataUrl, index) => {
      const file = path.join(outDir, `${base}-p${index + 1}.png`);
      fs.writeFileSync(file, Buffer.from(dataUrl.split(",")[1], "base64"));
      console.log(file);
    });
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
