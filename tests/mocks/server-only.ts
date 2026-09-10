// Intentionally empty: Next.js's webpack build aliases 'server-only' to a no-op
// for genuine server bundles too — its guard only fires for *client* bundles.
// Vitest isn't Next's bundler, so we alias it here the same way Next itself would.
export {};
