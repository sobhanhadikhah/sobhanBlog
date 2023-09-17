/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').options} */
const config = {
  semi: true,
  trailingComma: "all",
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  quoteProps: "consistent",
  jsxBracketSameLine: true,
  endOfLine: "lf",
  arrowParens: "always",
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
