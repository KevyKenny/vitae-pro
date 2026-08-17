const fs = require("fs");
const puppeteer = require("puppeteer-core");

// Sample points expressed in PDF points; converted with the render scale.
const SCALE = 1.7;
const PAGE_H = 841.89;

const samples = {
  "template-1-p2.png": [
    ["divider", 180.5, 500],
    ["divider2", 180.5, 700],
    ["square marker", 203.7, 400.5],
    ["page bg", 400, 500],
  ],
  "template-1-p1.png": [
    ["header band", 300, 700],
    ["header band low", 300, 640],
    ["below band", 300, 620],
    ["divider p1", 180.5, 500],
  ],
};

(async () => {
  const dir = process.argv[2];
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.goto("about:blank");
    for (const [file, points] of Object.entries(samples)) {
      const b64 = fs.readFileSync(`${dir}\\${file}`).toString("base64");
      const result = await page.evaluate(
        async (data, pts, scale, pageH) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              const c = document.createElement("canvas");
              c.width = img.width;
              c.height = img.height;
              const ctx = c.getContext("2d");
              ctx.drawImage(img, 0, 0);
              const hex = (n) => n.toString(16).padStart(2, "0");
              resolve({
                size: [img.width, img.height],
                values: pts.map(([label, x, y]) => {
                  const px = Math.round(x * scale);
                  const py = Math.round((pageH - y) * scale);
                  const d = ctx.getImageData(px, py, 1, 1).data;
                  return `${label} @${px},${py} = #${hex(d[0])}${hex(d[1])}${hex(d[2])}`;
                }),
              });
            };
            img.src = `data:image/png;base64,${data}`;
          }),
        b64,
        points,
        SCALE,
        PAGE_H,
      );
      console.log(file, JSON.stringify(result, null, 2));
    }
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
