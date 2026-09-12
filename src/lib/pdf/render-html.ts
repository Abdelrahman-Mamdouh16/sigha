import type { DocumentModel } from "@/types/document";
import { getEmbeddedFontsBase64 } from "./fonts";

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nl2p(input: string): string {
  return escapeHtml(input).split("\n").filter(Boolean).map((line) => `<p>${line}</p>`).join("");
}

export function renderDocumentHtml(doc: DocumentModel): string {
  const { regular, bold } = getEmbeddedFontsBase64();

  const partiesHtml = doc.parties
    .map(
      (p) =>
        `<div class="party"><span class="party-role">${escapeHtml(p.role)}:</span> ${escapeHtml(p.name)}${
          p.details ? ` — ${escapeHtml(p.details)}` : ""
        }</div>`
    )
    .join("");

  const sectionsHtml = doc.sections
    .map(
      (s) => `
      <section class="clause">
        <h2>${escapeHtml(s.heading)}</h2>
        ${s.clauses.map((c) => `<div class="clause-body">${nl2p(c.body)}</div>`).join("")}
      </section>`
    )
    .join("");

  const signaturesHtml = doc.signatures
    .map(
      (s) => `
      <div class="sig-block">
        <div class="sig-line"></div>
        <div class="sig-role">${escapeHtml(s.role)}</div>
        <div class="sig-name">${escapeHtml(s.name)}</div>
      </div>`
    )
    .join("");

  const witnessesHtml = doc.witnesses.length
    ? `
    <div class="witnesses">
      <h3>الشهود</h3>
      <div class="sig-row">
        ${doc.witnesses
          .map(
            (w) => `
          <div class="sig-block">
            <div class="sig-line"></div>
            <div class="sig-role">${escapeHtml(w.role)}</div>
            <div class="sig-name">${escapeHtml(w.name)}</div>
          </div>`
          )
          .join("")}
      </div>
    </div>`
    : "";

  // const noticesHtml = doc.notices.map((n) => `<p class="notice">${escapeHtml(n)}</p>`).join("");

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<style>
  @font-face {
    font-family: 'DocFont';
    src: url(data:font/ttf;base64,${regular}) format('truetype');
    font-weight: normal;
  }
  @font-face {
    font-family: 'DocFont';
    src: url(data:font/ttf;base64,${bold}) format('truetype');
    font-weight: bold;
  }
  * { box-sizing: border-box; }
  body {
    font-family: 'DocFont', serif;
    direction: rtl;
    color: #111;
    font-size: 13.5px;
    line-height: 1.9;
    margin: 0;
    padding: 26mm 20mm;
  }
  h1 { font-size: 22px; text-align: center; margin: 0 0 6mm; font-weight: bold; }
  .meta { text-align: center; color: #444; font-size: 12px; margin-bottom: 10mm; }
  .intro { margin-bottom: 8mm; text-align: justify; }
  .parties { margin-bottom: 8mm; }
  .party { margin-bottom: 2mm; }
  .party-role { font-weight: bold; }
  .clause { margin-bottom: 6mm; break-inside: avoid; }
  .clause h2 { font-size: 14.5px; font-weight: bold; margin: 0 0 2mm; }
  .clause-body p { margin: 0 0 1.5mm; text-align: justify; }
  .closing { margin: 10mm 0; text-align: justify; }
  .sig-row { display: flex; justify-content: space-between; gap: 10mm; margin-top: 14mm; }
  .sig-block { flex: 1; break-inside: avoid; }
  .sig-line { border-top: 1px solid #333; margin-bottom: 2mm; height: 10mm; }
  .sig-role { font-weight: bold; font-size: 12px; }
  .sig-name { font-size: 12px; color: #333; }
  .witnesses { margin-top: 10mm; }
  .witnesses h3 { font-size: 13px; margin-bottom: 4mm; }
  .notice { margin-top: 14mm; padding-top: 4mm; border-top: 1px dashed #999; font-size: 10.5px; color: #555; text-align: center; }
</style>
</head>
<body>
  <h1>${escapeHtml(doc.title)}</h1>
  <div class="meta">${escapeHtml(doc.place)} — ${escapeHtml(
    new Date(doc.date).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })
  )}</div>

  <div class="intro">${nl2p(doc.introduction)}</div>
  <div class="parties">${partiesHtml}</div>

  ${sectionsHtml}

  <div class="closing">${escapeHtml(doc.closing)}</div>

  <div class="sig-row">${signaturesHtml}</div>
  ${witnessesHtml}
</body>
</html>`;
}
