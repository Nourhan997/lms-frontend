import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        // Wired to the next/font CSS variables set in the root layout.
        sans: ["var(--font-sans)", "var(--font-arabic)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "sans-serif"],
      },
      keyframes: {
        "slide-in": {
          from: { transform: "translateX(calc(100% + 1rem))" },
          to: { transform: "translateX(0)" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
      },
      animation: {
        "slide-in": "slide-in 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-out": "fade-out 100ms ease-in",
      },
    },
  },
  plugins: [],
};
export default config;
