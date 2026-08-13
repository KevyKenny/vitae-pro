import "server-only";

import type { DocumentPageSize } from "@/components/document/types";

export class PdfGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PdfGenerationError";
  }
}

async function resolveExecutablePath(): Promise<string> {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  try {
    const chromium = await import("@sparticuz/chromium");
    return await chromium.default.executablePath();
  } catch {
    const candidates = [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/usr/bin/google-chrome",
      "/usr/bin/chromium-browser",
    ];
    for (const candidate of candidates) {
      try {
        const fs = await import("node:fs");
        if (fs.existsSync(/* turbopackIgnore: true */ candidate)) return candidate;
      } catch {
        // continue
      }
    }
  }

  throw new PdfGenerationError(
    "PDF engine unavailable. Set PUPPETEER_EXECUTABLE_PATH or use Print to save as PDF.",
  );
}

export async function urlToPdfBuffer(
  url: string,
  cookieHeader: string | null,
  pageSize: DocumentPageSize = "a4",
): Promise<Buffer> {
  const puppeteer = await import("puppeteer-core");
  let chromiumArgs: string[] = ["--no-sandbox", "--disable-setuid-sandbox"];

  try {
    const chromium = await import("@sparticuz/chromium");
    chromiumArgs = chromium.default.args;
  } catch {
    // local Chrome fallback
  }

  const executablePath = await resolveExecutablePath();
  const browser = await puppeteer.default.launch({
    args: chromiumArgs,
    executablePath,
    headless: true,
  });

  try {
    const page = await browser.newPage();
    if (cookieHeader) {
      await page.setExtraHTTPHeaders({ cookie: cookieHeader });
    }
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60_000 });
    await page.waitForSelector(".doc-page", { timeout: 30_000 });
    const pdf = await page.pdf({
      format: pageSize === "letter" ? "letter" : "a4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
