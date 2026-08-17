const fs = require("fs");
const puppeteer = require("puppeteer-core");

(async () => {
  const [dir] = process.argv.slice(2);
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.goto("about:blank");

    const load = async (file) =>
      page.evaluate(
        (data) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              const c = document.createElement("canvas");
              c.width = img.width;
              c.height = img.height;
              c.getContext("2d").drawImage(img, 0, 0);
              window.__ctx = c.getContext("2d");
              window.__size = [img.width, img.height];
              resolve(window.__size);
            };
            img.src = `data:image/png;base64,${data}`;
          }),
        fs.readFileSync(`${dir}\\${file}`).toString("base64"),
      );

    await load("template-1-p1.png");
    console.log(
      "vertical scan x=850 (header band, py 0..400 step 8):",
      await page.evaluate(() => {
        const hex = (n) => n.toString(16).padStart(2, "0");
        const out = [];
        let prev = "";
        for (let py = 0; py < 420; py += 2) {
          const d = window.__ctx.getImageData(850, py, 1, 1).data;
          const v = `#${hex(d[0])}${hex(d[1])}${hex(d[2])}`;
          if (v !== prev) {
            out.push(`${py}:${v}`);
            prev = v;
          }
        }
        return out.join(" ");
      }),
    );

    await load("template-1-p2.png");
    console.log(
      "horizontal scan across divider py=800 (px 295..320):",
      await page.evaluate(() => {
        const hex = (n) => n.toString(16).padStart(2, "0");
        const out = [];
        for (let px = 295; px <= 320; px += 1) {
          const d = window.__ctx.getImageData(px, 800, 1, 1).data;
          out.push(`${px}:#${hex(d[0])}${hex(d[1])}${hex(d[2])}`);
        }
        return out.join(" ");
      }),
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
