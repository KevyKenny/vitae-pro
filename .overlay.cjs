const fs = require("fs");
const puppeteer = require("puppeteer-core");

// Overlay reference and current page 1 for difference analysis.
const [dir, out] = process.argv.slice(2);
const ref = fs.readFileSync(`${dir}\\template-1-p1.png`).toString("base64");
const cur = fs.readFileSync(`${dir}\\tpl5-export-p1.png`).toString("base64");

const html = `<!doctype html><html><body style="margin:0;background:#111">
<canvas id="c"></canvas>
<script>
(async () => {
  const load = (b64) => new Promise((res) => {
    const img = new Image();
    img.onload = () => res(img);
    img.src = "data:image/png;base64," + b64;
  });
  const a = await load(${JSON.stringify(ref)});
  const b = await load(${JSON.stringify(cur)});
  const w = Math.max(a.width, b.width);
  const h = Math.max(a.height, b.height);
  const c = document.getElementById("c");
  c.width = w * 2; c.height = h;
  const ctx = c.getContext("2d");
  // left: blended overlay
  ctx.globalAlpha = 1; ctx.drawImage(a, 0, 0);
  ctx.globalAlpha = 0.45; ctx.drawImage(b, 0, 0, a.width, a.height);
  ctx.globalAlpha = 1;
  // right: absolute difference heat
  const ca = document.createElement("canvas"); ca.width=a.width; ca.height=a.height;
  const cb = document.createElement("canvas"); cb.width=a.width; cb.height=a.height;
  const cxa = ca.getContext("2d"); const cxb = cb.getContext("2d");
  cxa.drawImage(a,0,0);
  cxb.drawImage(b,0,0,a.width,a.height);
  const da = cxa.getImageData(0,0,a.width,a.height);
  const db = cxb.getImageData(0,0,a.width,a.height);
  const out = cxa.createImageData(a.width, a.height);
  let sum = 0, count = a.width * a.height;
  for (let i=0;i<da.data.length;i+=4){
    const d = Math.abs(da.data[i]-db.data[i]) + Math.abs(da.data[i+1]-db.data[i+1]) + Math.abs(da.data[i+2]-db.data[i+2]);
    sum += d;
    const v = Math.min(255, d);
    out.data[i] = v; out.data[i+1] = 255-v; out.data[i+2] = 40; out.data[i+3] = 255;
  }
  cxb.putImageData(out,0,0);
  ctx.drawImage(cb, a.width, 0);
  document.title = "meanAbs=" + (sum/(count*3)).toFixed(2);
})();
</script></body></html>`;

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 2200, height: 1600, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: "load" });
    await new Promise((r) => setTimeout(r, 800));
    const title = await page.title();
    await page.screenshot({ path: out, fullPage: true });
    console.log(out, title);
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
