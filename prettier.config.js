module.exports = {
  svelteSortOrder: "options-scripts-markup-styles",
  svelteStrictMode: false,
  svelteBracketNewLine: true,
  svelteAllowShorthand: true,
  svelteIndentScriptAndStyle: true,
  plugins: ["prettier-plugin-svelte"],
  semi: true,
  singleQuote: false,
  trailingComma: "es5",
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  arrowParens: "avoid",
  endOfLine: "lf",
  proseWrap: "always",
  htmlWhitespaceSensitivity: "css",
  vueIndentScriptAndStyle: true,
  embeddedLanguageFormatting: "auto",
  overrides: [
    {
      files: "*.svelte",
      options: {
        parser: "svelte"
      }
    }
  ]
};
