export interface ClauseSlot<T> {
  id: string;
  heading: string;
  /** What Gemini is told to phrase, with the actual user data already interpolated in. */
  instruction: (v: T) => string;
  /** Deterministic Arabic sentence used if AI drafting is unavailable or its output fails validation. */
  fallback: (v: T) => string;
}
