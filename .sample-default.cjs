const fs = require("fs");
const puppeteer = require("puppeteer-core");

const SCALE = 1.7;
const PAGE_H = 841.89;

const samples = {
  "template-default-p1.png": [
    ["page left edge", 2, 400],
    ["sidebar mid", 80, 400],
    ["sidebar rightish", 190, 400],
    ["sidebar edge hunt 198", 198, 400],
    ["sidebar edge hunt 200", 200, 400],
    ["sidebar edge hunt 205", 205, 400],
    ["gutter", 210, 400],
    ["main bg", 300, 400],
    ["header band", 80, 800],
    ["header name", 80, 790],
    ["heading Professional Summary", 220, 800],
    ["heading color sample", 250, 800],
    ["footer not p1", 80, 20],
    ["square quality", 18, 78],
  ],
  "template-default-p2.png": [
    ["sidebar p2", 80, 400],
    ["footer mark", 40, 15],
    ["main p2", 300, 400],
    ["heading Achievements", 250, 770],
  ],
};

(async () => {
  const dir = process.argv[2] || ".shots";
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
                  const d = ctx.getImageData(
                    Math.max(0, Math.min(c.width - 1, px)),
                    Math.max(0, Math.min(c.height - 1, py)),
                    1,
                    1,
                  ).data;
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

    // Scan horizontal strip to find sidebar edge
    const scan = await page.evaluate(async (data, scale, pageH) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const c = document.createElement("canvas");
          c.width = img.width;
          c.height = img.height;
          const ctx = c.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const py = Math.round((pageH - 400) * scale);
          const hex = (n) => n.toString(16).padStart(2, "0");
          let last = "";
          const changes = [];
          for (let x = 0; x < img.width; x += 1) {
            const d = ctx.getImageData(x, py, 1, 1).data;
            const h = `#${hex(d[0])}${hex(d[1])}${hex(d[2])}`;
            if (h !== last) {
              changes.push(`${(x / scale).toFixed(1)}pt ${h}`);
              last = h;
            }
          }
          resolve(changes.slice(0, 20));
        };
        img.src = `data:image/png;base64,${data}`;
      });
    }, fs.readFileSync(`${dir}\\template-default-p1.png`).toString("base64"), SCALE, PAGE_H);
    console.log("sidebar edge scan y=400:", scan);
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
