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
        background: "#FFFBF5",
        secondary: "#F7EFE5",
        light: "#C3ACD0",
        tertiary: "#7743DB",
      },
    },
  },
  plugins: [],
};
export default config;
