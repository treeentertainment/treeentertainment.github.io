module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./posts/**/*.{md,mdx}"
  ],
  theme: { extend: {} },
  plugins: [require("@tailwindcss/typography")],
};