# صِيغة | Sigha

Arabic-first AI-assisted legal document draft generator for individuals and small businesses in Egypt.

**صِيغة is a drafting-assistance demo, not a lawyer, not legal advice, and not a guarantee of legal validity.** Every generated draft carries a visible notice recommending review by a legal professional before use.

## Features

- Landing page, document-type picker, guided multi-step forms (rental contract, power of attorney)
- One-click demo data for a fast job-fair walkthrough
- AI-assisted clause drafting (Gemini) with a **deterministic fallback** — the app produces a complete, correctly formatted document even with no API key configured, no network access, or if Gemini returns something invalid
- A4 on-screen preview + a formally typeset, print-ready Arabic PDF
- Arabic/English UI, right-to-left layout, light/dark themes
- No accounts, no database — data lives only in the browser session

## Tech stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · React Hook Form · Joi · `@google/genai` · `puppeteer-core` + `@sparticuz/chromium` for PDF · Radix primitives (shadcn-style, built locally) · Vitest

No MongoDB, no auth, no Redux/Zustand, no database — intentionally, per the MVP scope.

## Architecture

```
Form (RHF) -> Joi (client) -> Review -> POST /api/generate
  -> Joi (server, re-validated) -> template clause slots + Gemini (or deterministic fallback)
  -> Joi validates the AI's JSON response -> normalized DocumentModel
  -> A4 web preview / POST /api/pdf -> Chromium renders formal HTML -> PDF
```

- `src/templates/*` define the **fixed clause structure** for each document type (original wording, not copied from any source). Gemini only rephrases each clause using the data already interpolated into its instruction — it cannot invent sections, names, amounts, or legal claims, because the structure and the facts never come from the model.
- `src/lib/gemini/generate-document.ts` validates Gemini's JSON response against a strict Joi schema before trusting any of it, and falls back per-clause to deterministic text on any failure (missing key, timeout, malformed JSON, invalid shape).
- `src/lib/pdf/` renders the same document as standalone HTML with an embedded (base64) Arabic font, then prints it to PDF with headless Chromium.

### Why Chromium instead of `@react-pdf/renderer`

The spec asked for this to actually be tested, not assumed — so it was. `@react-pdf/renderer`'s Arabic shaping was tested against three different fonts (Noto Naskh Arabic, both variable and statically-instanced, and Noto Kufi Arabic) and reproducibly produced stray floating diacritic marks; a fourth font (Amiri) instead mis-rendered a specific word ("بتاريخ") as a broken ligature. Switching the same content to a headless-Chromium HTML-to-PDF pipeline (`puppeteer-core` + `@sparticuz/chromium`, which bundles a serverless-compatible binary and works on Vercel) rendered everything correctly — verified by rasterizing the output and visually inspecting it. `@react-pdf/renderer` was removed from the dependencies.

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in GEMINI_API_KEY
npm run dev
```

### Environment variables

| Variable | Required | Notes |
|---|---|---|
| `GEMINI_API_KEY` | No | Server-only. Without it, every document is generated using the deterministic fallback drafting (fully functional, just not AI-phrased). Never expose this with a `NEXT_PUBLIC_` prefix. |

## Scripts

```bash
npm run dev          # local dev server
npm run build        # production build
npm run start         # run the production build
npm run lint            # ESLint
npm run typecheck    # tsc --noEmit
npm run test            # Vitest (unit + integration, incl. a real Chromium PDF render)
npm run test:watch  # Vitest watch mode
```

## Testing

63 tests across 12 files: Joi schema edge cases (bad dates, negative/huge rent, oversized strings, mixed Arabic/English/number addresses, missing optional fields), the Gemini response schema and fallback behavior, the document-model builders, HTML-escaping in the PDF renderer (XSS defense), the rate limiter, and integration tests that call the real `/api/generate` and `/api/pdf` route handlers directly — including one that runs an actual headless-Chromium PDF render and asserts on the resulting `%PDF-` bytes.

Not included: a browser-automation E2E suite (Playwright). A one-off Puppeteer smoke script was used manually during development to click through the full rental flow (landing -> demo data -> review -> generate -> preview) and screenshot light/dark/mobile, all of which rendered correctly — but that script isn't part of the committed, repeatable test suite. Adding a proper Playwright spec for the same journey is the natural next step (see Known limitations).

## Deployment (Vercel)

- Both `/api/generate` and `/api/pdf` are pinned to `export const runtime = "nodejs"` (Puppeteer needs Node APIs, not Edge) with `maxDuration = 30`.
- `next.config.ts` sets `serverExternalPackages` for `@sparticuz/chromium` / `puppeteer-core` so the bundler doesn't try to process the binary.
- Fonts are self-hosted under `src/app/fonts/` (web) and `assets/fonts/` (PDF) via `next/font/local` and a direct `fs.readFileSync`, respectively — no external font-CDN dependency at build or request time. Both are Google/IBM-published fonts under the SIL Open Font License.
- The in-memory rate limiter (`src/lib/validation/rate-limit.ts`) is per serverless-function instance, not shared globally across a Vercel deployment's concurrent instances. This was a deliberate MVP trade-off (no paid store) — it meaningfully slows casual abuse but is not a hard global cap. A shared store (Vercel KV / Upstash Redis) would close that gap if usage grows.
- `@sparticuz/chromium`'s bundled binary adds real weight to the function bundle; confirm your Vercel plan's function-size limit accommodates it (verified working in this sandboxed Node 22 environment; not yet verified on Vercel's actual infrastructure).

## Security

- Server-only Gemini client (`import "server-only"`); `GEMINI_API_KEY` never reaches the client.
- Every request is re-validated with Joi server-side regardless of client-side validation.
- Request size limits and a rate limiter on both API routes.
- AI output is never rendered as raw HTML/trusted blindly — it's validated against a strict schema, and anything that fails validation falls back to deterministic text.
- All user-supplied text is HTML-escaped before being placed into the PDF's HTML (tested).
- Security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) applied globally via `next.config.ts`.
- No national IDs, full contracts, or personal data are logged; only generic error messages reach the client, full errors go to `console.error` server-side only.

## Known limitations

- **No formal E2E suite** — see Testing above.
- **English translations are functional but not exhaustively proofread** — the dictionary covers the full flow, but hasn't had a native-English editing pass.
- **Rate limiting is per-instance**, as noted above.
- **Not yet tested on actual Vercel infrastructure** — build, typecheck, lint, unit/integration tests (including a real Chromium PDF render), and a manual click-through of the full UI (light/dark/mobile) were all verified in this development sandbox; a real Vercel deployment should be smoke-tested before a job fair demo.
- Only two document types are implemented (rental, power of attorney), matching the requested MVP scope; the third "coming soon" card on the documents page is inert by design.
- Accessibility, additional edge-case testing (very long clause text across PDF page breaks with more than 2 pages, RTL/LTR live-switching mid-form), and a full line-by-line WCAG pass have not been separately audited beyond what's described above.

## Future improvements

- Persist a shared rate-limit store.
- Add the missing document types (sale contract, employment contract, إقرار).
- Playwright E2E coverage for the full demo path.
- PDF page-numbering footer for 3+ page documents.
