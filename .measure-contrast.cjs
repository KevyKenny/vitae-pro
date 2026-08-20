const puppeteer = require("puppeteer-core");

const PX_PER_PT = 794 / 595.28;

(async () => {
  const url = process.argv[2] || "http://localhost:3000/dev/templates/tpl_0";
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
        if (prop === "w") return pt(r.width);
        if (prop === "h") return pt(r.height);
        return null;
      };
      const q = (sel) => root.querySelector(sel);
      const qa = (sel) => [...root.querySelectorAll(sel)];
      const cs = (el, p) => (el ? getComputedStyle(el)[p] : null);

      const headings = qa(".tpl-section-title--plain, .tpl-section-title--sidebar");
      const contacts = qa(".tpl-0-contacts .tpl-contact-item");

      return {
        page: { w: pt(base.width), h: pt(base.height) },
        pad: {
          x: cs(root, "paddingLeft"),
          y: cs(root, "paddingTop"),
          font: cs(root, "fontSize"),
        },
        header: {
          x: rel(q(".tpl-0-header"), "x"),
          y: rel(q(".tpl-0-header"), "y"),
          bottom: rel(q(".tpl-0-header"), "bottom"),
          h: rel(q(".tpl-0-header"), "h"),
          bg: cs(q(".tpl-0-header"), "backgroundColor"),
        },
        name: {
          x: rel(q(".tpl-0-name"), "x"),
          y: rel(q(".tpl-0-name"), "y"),
          bottom: rel(q(".tpl-0-name"), "bottom"),
          size: cs(q(".tpl-0-name"), "fontSize"),
          weight: cs(q(".tpl-0-name"), "fontWeight"),
          text: q(".tpl-0-name")?.textContent,
        },
        contacts: {
          y: rel(q(".tpl-0-contacts"), "y"),
          size: cs(q(".tpl-0-contacts"), "fontSize"),
          color: cs(q(".tpl-0-contacts"), "color"),
          items: contacts.map((c) => c.textContent?.trim()),
        },
        layout: {
          mainX: rel(q(".tpl-main-column"), "x"),
          mainRight: rel(q(".tpl-main-column"), "right"),
          mainW: rel(q(".tpl-main-column"), "w"),
          railX: rel(q(".tpl-sidebar-panel"), "x"),
          railRight: rel(q(".tpl-sidebar-panel"), "right"),
          railW: rel(q(".tpl-sidebar-panel"), "w"),
          border: cs(q(".tpl-sidebar-panel"), "borderLeft"),
        },
        headings: headings.slice(0, 8).map((h) => ({
          text: h.textContent?.trim(),
          x: rel(h, "x"),
          y: rel(h, "y"),
          size: cs(h, "fontSize"),
          color: cs(h, "color"),
        })),
        firstEntry: {
          title: q(".tpl-entry-title")?.textContent?.trim(),
          titleY: rel(q(".tpl-entry-title"), "y"),
          date: q(".tpl-entry-date")?.textContent?.trim(),
          dateX: rel(q(".tpl-entry-date"), "x"),
          dateRight: rel(q(".tpl-entry-date"), "right"),
        },
      };
    }, PX_PER_PT);

    console.log(JSON.stringify(data, null, 2));
    console.log("\nPDF reference targets (pt from top-left):");
    console.log("  name @ x=25 y≈50.3 size=25");
    console.log("  contacts @ y≈73.5 size=9");
    console.log("  Summary heading @ x=25 y≈140.6 size=15");
    console.log("  Personal details @ x=420.3 y≈140.6");
    console.log("  rail starts x=420.3; page 595.28; margin 25");
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
