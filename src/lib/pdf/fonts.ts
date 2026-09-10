import "server-only";
import { readFileSync } from "fs";
import { join } from "path";

let cache: { regular: string; bold: string } | null = null;

export function getEmbeddedFontsBase64() {
  if (cache) return cache;
  const dir = join(process.cwd(), "assets", "fonts");
  const regular = readFileSync(join(dir, "NotoNaskhArabic-Regular.ttf")).toString("base64");
  const bold = readFileSync(join(dir, "NotoNaskhArabic-Bold.ttf")).toString("base64");
  cache = { regular, bold };
  return cache;
}
