import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["var(--font-inter)", "system-ui", "sans-serif"] },
      colors: {
        brand: { 50:"#E9F7EF",100:"#CBEEDB",200:"#9BDCB8",500:"#1E9E5A",600:"#178A4E",700:"#0F6E3D" },
        sky:   { 50:"#EAF3FF",500:"#2E90FA",600:"#1F7AE0",700:"#175CD3" },
        earth: { 50:"#F7EEE1",500:"#C08A3E",600:"#A0702E",700:"#7C5522" },
        accent:{ berry:"#D6336C", sun:"#F5A524" },
        danger:"#DC2626",
        surface:{ DEFAULT:"#FFFFFF", subtle:"#F5FAF7" },
      },
      boxShadow: {
        soft:"0 1px 2px rgba(16,24,40,.06), 0 1px 3px rgba(16,24,40,.10)",
        card:"0 6px 16px rgba(16,24,40,.09), 0 2px 6px rgba(16,24,40,.05)",
      },
    },
  },
  plugins: [],
};
export default config;
