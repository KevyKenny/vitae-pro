const fs = require("fs");
const puppeteer = require("puppeteer-core");

const PDFJS = "https://unpkg.com/pdfjs-dist@3.11.174/build";

(async () => {
  const pdfPath = process.argv[2] || "templates-layout/template-3.pdf";
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
    const result = await page.evaluate(async (data, workerSrc) => {
      const lib = window.pdfjsLib;
      lib.GlobalWorkerOptions.workerSrc = workerSrc;
      const raw = atob(data);
      const bytes = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i);
      const pdf = await lib.getDocument({ data: bytes }).promise;
      const pages = [];
      for (let n = 1; n <= pdf.numPages; n += 1) {
        const pg = await pdf.getPage(n);
        const vp = pg.getViewport({ scale: 1 });
        const text = await pg.getTextContent();
        const items = text.items.map((it) => {
          const [a, b, c, d, e, f] = it.transform;
          return {
            str: it.str,
            x: Math.round(e * 10) / 10,
            y: Math.round(f * 10) / 10,
            w: Math.round(it.width * 10) / 10,
            h: Math.round(it.height * 10) / 10,
            font: it.fontName,
            size: Math.round(Math.hypot(a, b) * 10) / 10,
          };
        }).filter((it) => it.str && it.str.trim());

        const opList = await pg.getOperatorList();
        const rects = [];
        const fills = [];
        let fill = null;
        let stroke = null;
        const fns = lib.OPS;
        for (let i = 0; i < opList.fnArray.length; i += 1) {
          const fn = opList.fnArray[i];
          const args = opList.argsArray[i];
          if (fn === fns.setFillRGBColor || fn === fns.setFillGray) {
            fill = args;
          }
          if (fn === fns.setStrokeRGBColor || fn === fns.setStrokeGray) {
            stroke = args;
          }
          if (fn === fns.rectangle) {
            rects.push({
              x: Math.round(args[0] * 10) / 10,
              y: Math.round(args[1] * 10) / 10,
              w: Math.round(args[2] * 10) / 10,
              h: Math.round(args[3] * 10) / 10,
              fill,
              stroke,
            });
          }
        }

        const fonts = {};
        for (const it of items) {
          fonts[it.font] = (fonts[it.font] || 0) + 1;
        }

        pages.push({
          n,
          width: vp.width,
          height: vp.height,
          fonts,
          items: items.slice(0, 120),
          itemCount: items.length,
          rects: rects.filter((r) => Math.abs(r.w) > 2 || Math.abs(r.h) > 2).slice(0, 40),
          rectCount: rects.length,
        });
      }
      return pages;
    }, b64, `${PDFJS}/pdf.worker.min.js`);
    fs.writeFileSync(".shots/template-3-extract.json", JSON.stringify(result, null, 2));
    for (const p of result) {
      console.log("--- page", p.n, p.width, "x", p.height, "items", p.itemCount, "rects", p.rectCount);
      console.log("fonts", p.fonts);
      console.log("rects", JSON.stringify(p.rects, null, 2));
      for (const it of p.items.slice(0, 80)) {
        console.log(`${it.x.toFixed(1).padStart(6)} ${it.y.toFixed(1).padStart(6)} ${String(it.size).padStart(5)} ${it.font} | ${it.str}`);
      }
    }
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
