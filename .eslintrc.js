module.exports = {
  root: true,
  extends: [
    "@meteorjs/eslint-config-meteor",
    "prettier"
  ],
  plugins: ["svelte"],
  overrides: [
    {
      files: ["*.svelte"],
      processor: "svelte/svelte"
    }
  ],
  rules: {
    indent: ["error", 2]
  }
}; 