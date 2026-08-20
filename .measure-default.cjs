const puppeteer = require("puppeteer-core");

const PX_PER_PT = 794 / 595.28;

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
    await new Promise((r) => setTimeout(r, 1500));

    const data = await page.evaluate((pxPerPt) => {
      const pages = [...document.querySelectorAll(".doc-pages-stack .doc-page")];
      const pt = (v) => Math.round((v / pxPerPt) * 10) / 10;
      const measure = (root) => {
        const base = root.getBoundingClientRect();
        const rel = (el, prop) => {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          if (prop === "x") return pt(r.left - base.left);
          if (prop === "right") return pt(r.right - base.left);
          if (prop === "y") return pt(r.top - base.top);
          if (prop === "bottom") return pt(r.bottom - base.top);
          return null;
        };
        const cs = (el, p) => (el ? getComputedStyle(el)[p] : null);
        const rail = root.querySelector(".tpl-sidebar-panel");
        const main = root.querySelector(".tpl-main-column");
        const band = root.querySelector(".tpl-header-band");
        const name = root.querySelector(".tpl-header-name");
        const title = root.querySelector(".tpl-header-title");
        const heading = root.querySelector(".tpl-section-title--plain");
        const footer = root.querySelector(".tpl-sidebar-footer-mark");
        return {
          pageW: pt(base.width),
          rail: {
            x: rel(rail, "x"),
            w: rail ? pt(rail.getBoundingClientRect().width) : null,
            bg: cs(rail, "backgroundColor"),
          },
          mainX: rel(main, "x"),
          band: {
            top: rel(band, "y"),
            bottom: rel(band, "bottom"),
            bg: cs(band, "backgroundColor"),
            radius: cs(band, "borderBottomLeftRadius"),
          },
          name: {
            size: cs(name, "fontSize"),
            weight: cs(name, "fontWeight"),
            align: name ? cs(name.parentElement, "textAlign") : null,
          },
          title: {
            size: cs(title, "fontSize"),
            bg: cs(title, "backgroundColor"),
            text: title?.textContent,
          },
          heading: {
            text: heading?.textContent,
            size: cs(heading, "fontSize"),
            weight: cs(heading, "fontWeight"),
            color: cs(heading, "color"),
            top: rel(heading, "y"),
          },
          footer: footer
            ? { bottom: rel(footer, "bottom"), h: pt(footer.getBoundingClientRect().height) }
            : null,
          lastMain: root.querySelector(".tpl-main-column")?.lastElementChild?.textContent?.slice(0, 80),
        };
      };
      return {
        pageCount: pages.length,
        p1: measure(pages[0]),
        p2: pages[1] ? measure(pages[1]) : null,
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
