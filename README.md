# 🐇 ESLint Config – @the-rabbit-hole

![npm version](https://img.shields.io/npm/v/@the-rabbit-hole/eslint-config?style=for-the-badge&logo=npm&label=version)
![npm downloads](https://img.shields.io/npm/dm/@the-rabbit-hole/eslint-config?style=for-the-badge&logo=npm&label=downloads)
![ESLint](https://img.shields.io/badge/ESLint-9.x%20%7C%2010.x-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Overview

This package provides a **shared ESLint configuration** used across all  
[`@the-rabbit-hole`](https://github.com/the-rabbit-hole-tech) projects.  

It is designed to be:
- 🛠 **Reusable** – a single config for all JS/TS projects
- 📦 **Pluggable** – easy to extend if needed
- 🌍 **Publicly available** – you can use it in your own projects too!

## 📦 Installation

```bash
# with npm
npm install --save-dev eslint @the-rabbit-hole/eslint-config

# with yarn
yarn add -D eslint @the-rabbit-hole/eslint-config

# with pnpm
pnpm add -D eslint @the-rabbit-hole/eslint-config
````

## ⚙️ Usage

In your `eslint.config.js` (or `eslint.config.mjs`):

```js
import eslintConfig from "@the-rabbit-hole/eslint-config";
export default eslintConfig;
```

That’s it! 🚀

### 🛠 Customizing

Use the named `createESLintConfig` factory to disable bundled extends, add new rules, or override the package's defaults:

```js
import { createESLintConfig } from "@the-rabbit-hole/eslint-config";

export default createESLintConfig({
  // Drop bundled extends you don't want
  disableExtends: ["eslintReact", "eslintA11y", "eslintStorybook"],

  // Turn on opt-in extends that are off by default
  enable: ["eslintTypedoc"],

  // Add your own rules — or override bundled ones
  rules: {
    "no-console": "error",                // additive — applied as-is
    "react/react-in-jsx-scope": "warn",   // overrides the bundled default
  },
});
```

All options are independent — pass any combination, or none.

#### Override notifications

If a key in `rules` matches a rule the package sets by default, an info line is printed when ESLint loads the config so the override is visible:

```
[@the-rabbit-hole/eslint-config] Rule "react/react-in-jsx-scope" overrides the bundled default.
```

Adding rules the package does not set is silent — no message.

#### Available `disableExtends` keys

`eslintA11y` · `eslintPerfectionist` · `eslintPrettier` · `eslintReact` · `eslintStorybook` · `eslintTesting` · `eslintTypescript` · `eslintUnicorn`

#### Opt-in extends (`enable`)

These are **off by default** and only applied when named in `enable`:

* `eslintTypedoc` — enforces [TypeDoc](https://typedoc.org)/TSDoc documentation quality via [eslint-plugin-typedoc](https://github.com/Nick2bad4u/eslint-plugin-typedoc): doc-comment coverage on exported APIs (`typedoc/require-exported-doc-comment`), plus tag correctness (unknown/duplicate/empty tags, malformed inline links). It is opt-in so non-library consumers aren't forced into doc-coverage errors. Scoped to `**/*.{ts,tsx,mts,cts}`.

```js
import { createESLintConfig } from "@the-rabbit-hole/eslint-config";

// A library that wants its public API documentation linted:
export default createESLintConfig({ enable: ["eslintTypedoc"] });
```

## 🧩 What’s Included?

This ESLint config comes pre-bundled with a set of plugins and shareable configs tailored for modern TypeScript + React projects:

### Plugins

* [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) ⚛️ — React best practices
* [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) ♿️ — Accessibility rules for JSX
* [eslint-plugin-testing-library](https://github.com/testing-library/eslint-plugin-testing-library) 🧪 — Testing Library linting
* [eslint-plugin-storybook](https://github.com/storybookjs/eslint-plugin-storybook) 📖 — Storybook linting
* [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier) 🎨 — Run Prettier as an ESLint rule
* [eslint-plugin-perfectionist](https://perfectionist.dev) 🪄 — Enforces sorting and consistency
* [eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn) 🦄— Massive rules for good code

### Opt-in plugins

* [eslint-plugin-typedoc](https://github.com/Nick2bad4u/eslint-plugin-typedoc) 📚 — TypeDoc/TSDoc documentation quality (enable with `enable: ["eslintTypedoc"]`)

## 🎨 A note on Prettier

`eslint-plugin-prettier` runs Prettier as an ESLint rule, so the **Prettier version decides the formatting**. To keep `prettier/prettier` verdicts deterministic, this package ships **Prettier as a pinned, exact dependency** rather than a floating peer — the formatter engine only changes in an intentional, changelogged release. You do **not** need to install or pin Prettier yourself; remove any `prettier` peer expectation you previously satisfied for this config.

## 🤝 Contributing

Contributions are welcome!
If you have suggestions, improvements, or run into issues, please open a PR or issue.

## 📜 License

This project is licensed under the **MIT License**.
You’re free to use it in your own public or private projects.

Made with ❤️ by [@the-rabbit-hole](https://github.com/the-rabbit-hole-tech)
