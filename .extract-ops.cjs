const fs = require("fs");
const puppeteer = require("puppeteer-core");

const PDFJS = "https://unpkg.com/pdfjs-dist@3.11.174/build";

(async () => {
  const b64 = fs.readFileSync("templates-layout/template-4.pdf").toString("base64");
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
      const out = [];
      for (let n = 1; n <= Math.min(pdf.numPages, 2); n += 1) {
        const pg = await pdf.getPage(n);
        const opList = await pg.getOperatorList();
        const fns = lib.OPS;
        const names = {};
        for (const [k, v] of Object.entries(fns)) names[v] = k;
        let fill = null;
        const paths = [];
        for (let i = 0; i < opList.fnArray.length; i += 1) {
          const fn = opList.fnArray[i];
          const args = opList.argsArray[i];
          const name = names[fn] || String(fn);
          if (name === "setFillRGBColor") {
            const r = Math.round(args[0]);
            const g = Math.round(args[1]);
            const b = Math.round(args[2]);
            fill = `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
          }
          if (name === "constructPath" && args && args[1] && args[1].length) {
            const nums = args[1].filter((v) => typeof v === "number");
            const xs = nums.filter((_, idx) => idx % 2 === 0);
            const ys = nums.filter((_, idx) => idx % 2 === 1);
            if (!xs.length) continue;
            const minX = Math.min(...xs);
            const maxX = Math.max(...xs);
            const minY = Math.min(...ys);
            const maxY = Math.max(...ys);
            const w = maxX - minX;
            const h = maxY - minY;
            if (w > 8 || h > 8) {
              paths.push({
                fill,
                minX: Math.round(minX * 10) / 10,
                maxX: Math.round(maxX * 10) / 10,
                minY: Math.round(minY * 10) / 10,
                maxY: Math.round(maxY * 10) / 10,
                w: Math.round(w * 10) / 10,
                h: Math.round(h * 10) / 10,
              });
            }
          }
        }
        out.push({ n, pathCount: paths.length, paths: paths.slice(0, 30) });
      }
      return out;
    }, b64, `${PDFJS}/pdf.worker.min.js`);
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
