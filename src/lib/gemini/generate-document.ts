import "server-only";
import { getGeminiClient, GEMINI_MODEL } from "./client";
import { SYSTEM_PROMPT, buildClausesPrompt } from "./prompts";
import { buildClausesResponseSchema } from "./schemas";
import type { ClauseSlot } from "@/templates/types";

export interface DraftResult {
  clauseText: Record<string, string>;
  aiUsed: boolean;
}

/**
 * Drafts every clause for a document in a single Gemini call, then validates the
 * response against a strict schema. Any clause that is missing, malformed, or
 * simply absent (no API key, timeout, network error) silently falls back to the
 * deterministic template sentence — the document is never left half-broken and
 * the AI is never trusted blindly.
 */
export async function draftClauses<T>(slots: ClauseSlot<T>[], values: T): Promise<DraftResult> {
  const fallback: Record<string, string> = {};
  for (const slot of slots) fallback[slot.id] = slot.fallback(values);

  let apiKeyConfigured = true;
  try {
    getGeminiClient();
  } catch {
    apiKeyConfigured = false;
  }
  if (!apiKeyConfigured) {
    return { clauseText: fallback, aiUsed: false };
  }

  try {
    const client = getGeminiClient();
    const prompt = buildClausesPrompt(slots.map((s) => ({ id: s.id, instruction: s.instruction(values) })));

    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        temperature: 0.3,
        maxOutputTokens: 4096,
      },
    });

    const text = response.text;
    if (!text) return { clauseText: fallback, aiUsed: false };

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return { clauseText: fallback, aiUsed: false };
    }

    const schema = buildClausesResponseSchema(slots.map((s) => s.id));
    const { error, value } = schema.validate(parsed, { stripUnknown: true });
    if (error) {
      // Partial trust: keep any individual clause that *does* validate on its own,
      // fall back only for the ones that don't.
      const maybe = parsed as { clauses?: Record<string, unknown> };
      const merged = { ...fallback };
      if (maybe?.clauses && typeof maybe.clauses === "object") {
        for (const slot of slots) {
          const candidate = maybe.clauses[slot.id];
          if (typeof candidate === "string" && candidate.trim().length >= 3 && candidate.trim().length <= 1200) {
            merged[slot.id] = candidate.trim();
          }
        }
      }
      return { clauseText: merged, aiUsed: true };
    }

    const merged: Record<string, string> = { ...fallback, ...value.clauses };
    return { clauseText: merged, aiUsed: true };
  } catch {
    return { clauseText: fallback, aiUsed: false };
  }
}
