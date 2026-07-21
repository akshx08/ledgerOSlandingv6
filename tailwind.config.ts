import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        porcelain: "oklch(var(--porcelain) / <alpha-value>)",
        paper: "oklch(var(--paper) / <alpha-value>)",
        ink: "oklch(var(--ink) / <alpha-value>)",
        graphite: "oklch(var(--graphite) / <alpha-value>)",
        vermilion: "oklch(var(--vermilion) / <alpha-value>)",
        edge: "oklch(var(--edge) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-archivo)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        // fluid display steps, ≥1.25 ratio, ceiling under 6rem
        d1: ["clamp(3.1rem, 11.5vw, 5.9rem)", { lineHeight: "0.87" }],
        d2: ["clamp(2.3rem, 7.2vw, 4.1rem)", { lineHeight: "0.9" }],
        d3: ["clamp(1.75rem, 4.4vw, 2.7rem)", { lineHeight: "0.95" }],
        lede: ["clamp(1.05rem, 1.7vw, 1.35rem)", { lineHeight: "1.45" }],
      },
      transitionTimingFunction: {
        // ease-out-quint / expo — no bounce, no elastic
        quint: "cubic-bezier(0.22, 1, 0.36, 1)",
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      zIndex: {
        stage: "0",
        content: "10",
        rail: "30",
        dock: "40",
        boot: "80",
        cursor: "90",
      },
    },
  },
  plugins: [],
};
export default config;
