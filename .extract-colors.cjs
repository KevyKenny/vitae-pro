const fs = require("fs");
const puppeteer = require("puppeteer-core");

const PDFJS = "https://unpkg.com/pdfjs-dist@3.11.174/build";

(async () => {
  const b64 = fs.readFileSync(process.argv[2] || "templates-layout/template-4.pdf").toString("base64");
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
      const allPages = [];
      for (let n = 1; n <= pdf.numPages; n += 1) {
      const pg = await pdf.getPage(n);
      const opList = await pg.getOperatorList();
      const fns = lib.OPS;
      const names = {};
      for (const [k, v] of Object.entries(fns)) names[v] = k;
      let fill = "none";
      let font = "";
      let size = 0;
      const colors = new Set();
      const textFills = [];
      const pathFills = [];
      for (let i = 0; i < opList.fnArray.length; i += 1) {
        const fn = opList.fnArray[i];
        const args = opList.argsArray[i];
        const name = names[fn] || String(fn);
        if (name === "setFillRGBColor") {
          const r = Math.round(args[0]);
          const g = Math.round(args[1]);
          const b = Math.round(args[2]);
          fill = `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`;
          colors.add(fill);
        }
        if (name === "setFont") {
          font = args[0];
          size = args[1];
        }
        if (name === "showText") {
          textFills.push({ fill, font, size, sample: String(args[0]).slice(0, 40) });
        }
        if (name === "fill") {
          pathFills.push(fill);
        }
      }
      const uniqueText = [];
      const seen = new Set();
      for (const t of textFills) {
        const k = `${t.fill}|${t.size}|${t.font}`;
        if (!seen.has(k)) {
          seen.add(k);
          uniqueText.push(t);
        }
      }
      allPages.push({ n, colors: [...colors], uniqueText, pathFills: [...new Set(pathFills)] });
      }
      return allPages;
    }, b64, `${PDFJS}/pdf.worker.min.js`);
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
