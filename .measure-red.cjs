const puppeteer = require("puppeteer-core");
const PX_PER_PT = 794 / 595.28;

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1100, height: 1200, deviceScaleFactor: 1 });
    await page.goto("http://localhost:3000/dev/templates/tpl_4", {
      waitUntil: "domcontentloaded",
      timeout: 120000,
    });
    await page.waitForSelector(".doc-page", { timeout: 120000 });
    await page.waitForSelector('[data-document-ready="true"]', { timeout: 90000 }).catch(() => {});
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
      const cs = (el, p) => (el ? getComputedStyle(el)[p] : null);
      const q = (sel) => root.querySelector(sel);
      const rail = q(".tpl-sidebar-panel");
      const name = q(".tpl-4-name");
      const sideH = q(".tpl-section-title--sidebar");
      const mainH = q(".tpl-section-title--plain");
      const contact = q(".tpl-sidebar-contact-item");
      const icon = q(".tpl-sidebar-contact-icon");
      const skill = q(".tpl-skill-line");
      const title = q(".tpl-entry-title");
      const date = q(".tpl-entry-date");
      return {
        page: { w: pt(base.width), padX: cs(root, "paddingLeft"), padY: cs(root, "paddingTop") },
        rail: { x: rel(rail, "x"), right: rel(rail, "right"), bg: cs(rail, "backgroundColor") },
        name: { x: rel(name, "x"), y: rel(name, "y"), size: cs(name, "fontSize"), color: cs(name, "color") },
        sideH: { x: rel(sideH, "x"), y: rel(sideH, "y"), text: sideH?.textContent, size: cs(sideH, "fontSize"), weight: cs(sideH, "fontWeight") },
        mainH: { x: rel(mainH, "x"), y: rel(mainH, "y"), text: mainH?.textContent, size: cs(mainH, "fontSize") },
        contact: { x: rel(contact, "x"), y: rel(contact, "y") },
        icon: { x: rel(icon, "x"), w: icon ? pt(icon.getBoundingClientRect().width) : null },
        skill: { x: rel(skill, "x"), y: rel(skill, "y"), text: skill?.textContent },
        title: { x: rel(title, "x") },
        date: { color: cs(date, "color") },
        pages: document.querySelectorAll(".doc-pages-stack .doc-page").length,
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
