const fs = require("fs");
const puppeteer = require("puppeteer-core");

const SCALE = 1.7;
const PAGE_H = 841.89;

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage();
    const b64 = fs.readFileSync(".shots\\template-default-p1.png").toString("base64");
    const result = await page.evaluate(
      async (data, scale, pageH) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const c = document.createElement("canvas");
            c.width = img.width;
            c.height = img.height;
            const ctx = c.getContext("2d");
            ctx.drawImage(img, 0, 0);
            const hex = (n) => n.toString(16).padStart(2, "0");
            const at = (xPt, yPt) => {
              const px = Math.round(xPt * scale);
              const py = Math.round((pageH - yPt) * scale);
              const d = ctx.getImageData(
                Math.max(0, Math.min(c.width - 1, px)),
                Math.max(0, Math.min(c.height - 1, py)),
                1,
                1,
              ).data;
              return `#${hex(d[0])}${hex(d[1])}${hex(d[2])}`;
            };
            const scanY = (xPt) => {
              const changes = [];
              let last = "";
              for (let y = pageH; y >= 600; y -= 0.5) {
                const h = at(xPt, y);
                if (h !== last) {
                  changes.push(`y=${y.toFixed(1)} ${h}`);
                  last = h;
                }
              }
              return changes;
            };
            const scanHeadingLine = () => {
              // around Professional Summary baseline 798.7, look for a rule
              const hits = [];
              for (let x = 215; x < 580; x += 2) {
                for (let y of [790, 788, 786, 784, 782, 780]) {
                  const h = at(x, y);
                  if (h !== "#ffffff" && h !== "#395a86" && h !== "#385987") {
                    hits.push(`x=${x} y=${y} ${h}`);
                  }
                }
              }
              return hits.slice(0, 25);
            };
            resolve({
              bandCenter: scanY(100),
              bandLeft: scanY(10),
              bandRight: scanY(190),
              headingLine: scanHeadingLine(),
              name: at(80, 801),
              title: at(80, 780),
              heading: at(280, 799),
            });
          };
          img.src = `data:image/png;base64,${data}`;
        }),
      b64,
      SCALE,
      PAGE_H,
    );
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
