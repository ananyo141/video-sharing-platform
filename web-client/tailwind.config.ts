import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFBF5",
        secondary: "#F7EFE5",
        light: "#C3ACD0",
        tertiary: "#7743DB",
        primary: "#6D28D9",
        accent: "#7C3AED",
        muted: "#6B7280",
        surface: "#FFFFFF",
        "bg-dark": "#0B1220",
        "text-dark": "#E6EEF8",
      },
    },
  },
  plugins: [],
};
export default config;
