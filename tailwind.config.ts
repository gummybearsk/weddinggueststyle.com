import type { Config } from "tailwindcss";

const config: Config = {
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
        // Editorial palette
        cream: {
          50: "#FDFBF7",
          100: "#FAF6EE",
          200: "#F4ECDC",
        },
        ivory: "#FBF9F3",
        bone: "#F5EFE6",
        // Sophisticated muted rose (replaces harsh rose-600)
        blush: {
          50: "#FBF4F1",
          100: "#F4E3DC",
          200: "#E8C5B7",
          300: "#D9A292",
          400: "#C68374",
          500: "#B26856",
          600: "#9B5340",
          700: "#7D4232",
        },
        // Champagne/gold accents
        champagne: {
          400: "#C9B584",
          500: "#B59E69",
          600: "#9A8351",
        },
        // Editorial neutrals
        ink: {
          900: "#1A1815", // near-black with warm tone
          800: "#2D2925",
          700: "#4A4540",
          600: "#6B6560",
          500: "#8B8580",
          400: "#A8A29C",
          300: "#C4BFB8",
          200: "#E0DCD5",
          100: "#F0EDE7",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        "serif-italic": ["var(--font-serif-italic)", "Georgia", "serif"],
      },
      letterSpacing: {
        editorial: "0.18em",
      },
    },
  },
  plugins: [],
};
export default config;
