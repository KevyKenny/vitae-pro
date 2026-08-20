const puppeteer = require("puppeteer-core");

const PX_PER_PT = 794 / 595.28; // A4 at 96dpi

(async () => {
  const url = process.argv[2];
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1100, height: 1200 });
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
    await page.waitForSelector(".doc-page", { timeout: 120000 });
    await page
      .waitForSelector('[data-document-ready="true"]', { timeout: 90000 })
      .catch(() => {});
    await new Promise((r) => setTimeout(r, 1200));

    const data = await page.evaluate((pxPerPt) => {
      const root = document.querySelector(".doc-pages-stack .doc-page");
      const base = root.getBoundingClientRect();
      const pt = (v) => Math.round((v / pxPerPt) * 10) / 10;
      const rel = (el, prop) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        if (prop === "x") return pt(r.left - base.left);
        if (prop === "right") return pt(r.right - base.left);
        if (prop === "y") return pt(r.top - base.top);
        if (prop === "bottom") return pt(r.bottom - base.top);
        return null;
      };
      const q = (sel) => root.querySelector(sel);
      const qa = (sel) => [...root.querySelectorAll(sel)];

      const asides = qa(".tpl-tl-aside");
      const headings = qa(".tpl-tl-heading");
      const dates = qa(".tpl-tl-date");
      const titles = qa(".tpl-tl-title");
      const bullets = qa(".tpl-tl-bullets li");
      const gridRows = qa(".tpl-tl-grid");

      const cs = (el, p) => (el ? getComputedStyle(el)[p] : null);

      return {
        pageWidthPt: pt(base.width),
        band: {
          left: rel(q(".tpl-5-band"), "x"),
          right: rel(q(".tpl-5-band"), "right"),
          top: rel(q(".tpl-5-band"), "y"),
          bottom: rel(q(".tpl-5-band"), "bottom"),
        },
        name: {
          x: rel(q(".tpl-5-name"), "x"),
          top: rel(q(".tpl-5-name"), "y"),
          fontSize: cs(q(".tpl-5-name"), "fontSize"),
        },
        contactTop: rel(q(".tpl-5-contact"), "y"),
        summaryTop: rel(q(".tpl-5-summary"), "y"),
        rule: {
          x: rel(q(".tpl-5-rule"), "x"),
          top: rel(q(".tpl-5-rule"), "y"),
          bottom: rel(q(".tpl-5-rule"), "bottom"),
        },
        asideX: rel(asides[0], "x"),
        asideRight: rel(asides[0], "right"),
        bodyX: rel(q(".tpl-tl-main"), "x"),
        bodyContentX: rel(q(".tpl-tl-title"), "x"),
        bodyRight: rel(q(".tpl-tl-main"), "right"),
        markerX: rel(q(".tpl-tl-marker"), "x"),
        markerRight: rel(q(".tpl-tl-marker"), "right"),
        markerTopOffset: (() => {
          const m = q(".tpl-tl-marker");
          if (!m) return null;
          const parent = m.parentElement;
          return pt(
            m.getBoundingClientRect().top - parent.getBoundingClientRect().top,
          );
        })(),
        bulletTextX: rel(bullets[0], "x"),
        heading1: {
          text: headings[0]?.textContent,
          top: rel(headings[0], "y"),
          fontSize: cs(headings[0], "fontSize"),
        },
        firstDate: { text: dates[0]?.textContent, top: rel(dates[0], "y") },
        firstTitle: { text: titles[0]?.textContent, top: rel(titles[0], "y") },
        bulletPitch: bullets
          .slice(0, 4)
          .map((b) => rel(b, "y"))
          .join(" / "),
        gridPitch: gridRows
          .slice(0, 4)
          .map((g) => rel(g, "y"))
          .join(" / "),
        headingTops: headings.map((h) => `${h.textContent}@${rel(h, "y")}`),
        baseFont: cs(root, "fontSize"),
        lineHeight: cs(root, "lineHeight"),
      };
    }, PX_PER_PT);

    console.log(JSON.stringify(data, null, 2));
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
