const puppeteer = require("puppeteer-core");

const PX_PER_PT = 794 / 595.28;

(async () => {
  const url = process.argv[2] || "http://localhost:3000/dev/templates/tpl_3";
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1100, height: 1200, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
    await page.waitForSelector(".doc-page", { timeout: 120000 });
    await page
      .waitForSelector('[data-document-ready="true"]', { timeout: 90000 })
      .catch(() => {});
    await new Promise((r) => setTimeout(r, 1500));

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
      const cs = (el, p) => (el ? getComputedStyle(el)[p] : null);

      const headings = qa(".tpl-3-heading, .tpl-tl-heading");
      const dates = qa(".tpl-tl-date");
      const titles = qa(".tpl-tl-title");
      const bullets = qa(".tpl-tl-bullets li");
      const labels = qa(".tpl-label-value-row dt");
      const values = qa(".tpl-label-value-row dd");
      const skills = qa(".tpl-tl-grid--skill .tpl-tl-grid-cell");

      return {
        page: { w: pt(base.width), h: pt(base.height) },
        pad: {
          x: cs(root, "paddingLeft"),
          y: cs(root, "paddingTop"),
        },
        title: {
          text: q(".tpl-3-title")?.textContent,
          x: rel(q(".tpl-3-title"), "x"),
          y: rel(q(".tpl-3-title"), "y"),
          size: cs(q(".tpl-3-title"), "fontSize"),
          weight: cs(q(".tpl-3-title"), "fontWeight"),
          color: cs(q(".tpl-3-title"), "color"),
        },
        firstHeading: {
          text: headings[0]?.textContent,
          x: rel(headings[0], "x"),
          y: rel(headings[0], "y"),
          size: cs(headings[0], "fontSize"),
          weight: cs(headings[0], "fontWeight"),
          color: cs(headings[0], "color"),
        },
        firstLabel: {
          text: labels[0]?.textContent,
          x: rel(labels[0], "x"),
          y: rel(labels[0], "y"),
          color: cs(labels[0], "color"),
          weight: cs(labels[0], "fontWeight"),
        },
        firstValue: {
          x: rel(values[0], "x"),
          color: cs(values[0], "color"),
          weight: cs(values[0], "weight"),
        },
        asideX: rel(q(".tpl-tl-aside"), "x"),
        asideRight: rel(q(".tpl-tl-aside"), "right"),
        titleX: rel(titles[0], "x"),
        dateX: rel(dates[0], "x"),
        bulletX: rel(bullets[0], "x"),
        skill0: { x: rel(skills[0], "x"), text: skills[0]?.textContent },
        skill1: { x: rel(skills[1], "x"), text: skills[1]?.textContent },
        headingTops: headings.slice(0, 8).map((h) => `${h.textContent}@${rel(h, "y")}`),
        baseFont: cs(root, "fontSize"),
        pageCount: document.querySelectorAll(".doc-pages-stack .doc-page").length,
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
