import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "custom-green": "#15803D",
        "custom-blue": "#1E40AF"
      },
      screens: {
        '3xs': '550px',
        '2xs': '420px',
        'xs': '360px',
        'xxs': '300px',
      },
      lineHeight: {
        'extra-loose': '2.5',
        'super-loose': '3',
      },
    },
  },
  plugins: [],
} satisfies Config;
