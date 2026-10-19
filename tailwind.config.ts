import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        stripe: {
          primary: "#533afd",
          "primary-deep": "#4434d4",
          "primary-press": "#2e2b8c",
          "primary-soft": "#665efd",
          "primary-subdued": "#b9b9f9",
          "brand-dark": "#1c1e54",
          ink: "#0d253d",
          "ink-secondary": "#273951",
          "ink-mute": "#64748d",
          "ink-mute-2": "#61718a",
          canvas: "#ffffff",
          "canvas-soft": "#f6f9fc",
          "canvas-cream": "#f5e9d4",
          hairline: "#e3e8ee",
          "hairline-input": "#a8c3de",
          ruby: "#ea2261",
          magenta: "#f96bee",
          lemon: "#9b6829",
        },
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        pill: "9999px",
      },
      boxShadow: {
        "stripe-sm": "0 1px 3px rgba(0, 55, 112, 0.08)",
        "stripe-md": "0 8px 24px rgba(0, 55, 112, 0.08), 0 2px 6px rgba(0, 55, 112, 0.04)",
        "stripe-lg": "0 18px 45px rgba(0, 55, 112, 0.12), 0 4px 12px rgba(0, 55, 112, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
