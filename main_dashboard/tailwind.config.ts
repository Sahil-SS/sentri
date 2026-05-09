import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },

      colors: {
        void: "#080A0F",
        bone: "#C8C4B7",
        amber: "#D4810A",
        crimson: "#C42B2B",
      },
    },
  },

  plugins: [],
};

export default config;