import "server-only";
import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

/**
 * Lazily creates the Gemini client so the app can still boot (and show a clear
 * error at call time) when GEMINI_API_KEY is not configured, instead of crashing on import.
 */
export function getGeminiClient(): GoogleGenAI {
  console.log(process.env.GEMINI_API_KEY);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY_MISSING");
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

export const GEMINI_MODEL = "gemini-2.5-flash";
