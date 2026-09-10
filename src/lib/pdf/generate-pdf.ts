// import "server-only";
// import puppeteer from "puppeteer-core";
// import chromium from "@sparticuz/chromium";
// import { renderDocumentHtml } from "./render-html";
// import type { DocumentModel } from "@/types/document";

// export async function generateDocumentPdf(doc: DocumentModel): Promise<Buffer> {
//   const html = renderDocumentHtml(doc);

//   const executablePath = await chromium.executablePath();
//   const browser = await puppeteer.launch({
//     args: chromium.args,
//     executablePath,
//     headless: true,
//   });

//   try {
//     const page = await browser.newPage();
//     // "load" is sufficient (and the only option TS allows for setContent): the HTML has no
//     // external requests — the font is embedded as a base64 data URI, nothing to wait network-idle for.
//     await page.setContent(html, { waitUntil: "load" });
//     const pdf = await page.pdf({
//       format: "A4",
//       printBackground: true,
//       margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
//     });
//     return Buffer.from(pdf);
//   } finally {
//     await browser.close();
//   }
// }
import "server-only";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { renderDocumentHtml } from "./render-html";
import type { DocumentModel } from "@/types/document";

export async function generateDocumentPdf(doc: DocumentModel): Promise<Buffer> {
  const html = renderDocumentHtml(doc);

  const isDevelopment = process.env.NODE_ENV === "development";

  const browser = isDevelopment
    ? await puppeteer.launch({
        channel: "chrome",
        headless: true,
      })
    : await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      });

  try {
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "load",
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0mm",
        bottom: "0mm",
        left: "0mm",
        right: "0mm",
      },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
