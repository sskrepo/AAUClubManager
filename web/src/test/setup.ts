import "@testing-library/jest-dom";

// ── Global test environment setup ─────────────────────────────────────────

// Suppress Next.js router warnings in test environment
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
