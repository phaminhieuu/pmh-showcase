/** @type {import("prettier").Config} */
module.exports = {
  arrowParens: 'always',
  bracketSameLine: false,
  bracketSpacing: true,
  jsxSingleQuote: true,
  printWidth: 70,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none',
  useTabs: false,
  plugins: [require.resolve('prettier-plugin-tailwindcss')]
};
