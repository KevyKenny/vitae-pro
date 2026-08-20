const fs = require("fs");
const puppeteer = require("puppeteer-core");

const SCALE = 1.7;
const PAGE_H = 841.89;

(async () => {
  const file = process.argv[2];
  const points = [
    ["heading Personal x55 y708", 55, PAGE_H - 708],
    ["heading Personal x70 y705", 70, PAGE_H - 705],
    ["name x210 y772", 210, PAGE_H - 772],
    ["name x230 y775", 230, PAGE_H - 775],
    ["resume x70 y775", 70, PAGE_H - 775],
    ["badge x70 y800", 70, PAGE_H - 800],
    ["skill ReactJS x50 y448", 50, PAGE_H - 448],
    ["skill Next x320 y448", 320, PAGE_H - 448],
    ["skills heading x55 y478", 55, PAGE_H - 478],
  ];
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage();
    const b64 = fs.readFileSync(file).toString("base64");
    const result = await page.evaluate(
      async (data, pts, scale) => {
        const hex = (n) => n.toString(16).padStart(2, "0");
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const c = document.createElement("canvas");
            c.width = img.width;
            c.height = img.height;
            const ctx = c.getContext("2d");
            ctx.drawImage(img, 0, 0);
            const values = pts.map(([label, x, y]) => {
              const px = Math.round(x * scale);
              const py = Math.round(y * scale);
              const d = ctx.getImageData(
                Math.max(0, Math.min(c.width - 1, px)),
                Math.max(0, Math.min(c.height - 1, py)),
                1,
                1,
              ).data;
              return `${label} @${px},${py} = #${hex(d[0])}${hex(d[1])}${hex(d[2])}`;
            });
            resolve({ size: [img.width, img.height], values });
          };
          img.src = `data:image/png;base64,${data}`;
        });
      },
      b64,
      points,
      SCALE,
    );
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
