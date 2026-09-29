# ESLint Config – @the-rabbit-hole 🐇

> 🧹 A shared ESLint configuration used across all the rabbit hole projects.

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
```

ESLint does not format your code. Prettier does that as its own step, with the shared options this package ships; see [🎨 Prettier](#-prettier) for the setup.

## ⚙️ Usage

In your `eslint.config.js` (or `eslint.config.mjs`):

```js
import eslintConfig from "@the-rabbit-hole/eslint-config";
export default eslintConfig;
```

That’s it! 🚀

In a CommonJS config (`eslint.config.cjs`), `require` works the same way:

```js
const { createESLintConfig } = require("@the-rabbit-hole/eslint-config");
module.exports = createESLintConfig();
```

Some bundled plugins ship as ES modules only, so CommonJS loading needs a Node.js release that can `require()` ES modules (20.19+, 22.12+ or 24+). ESLint 10 already requires one of those.

### Customizing

Use the named `createESLintConfig` factory to disable bundled extends, add new rules, or override the package's defaults:

```js
import { createESLintConfig } from "@the-rabbit-hole/eslint-config";

export default createESLintConfig({
  // Drop default-on extends you don't want
  disableExtends: ["eslintReact"],

  // Turn on opt-in extends that are off by default
  enable: ["eslintA11y", "eslintTypedoc"],

  // Add your own rules — or override bundled ones
  rules: {
    "no-console": "error", // additive — applied as-is
    "react/react-in-jsx-scope": "warn", // overrides the bundled default
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

#### Available `disableExtends` keys (default-on extends)

`eslintPerfectionist` · `eslintReact` · `eslintTypescript` · `eslintUnicorn`

`eslintPrettier` is still accepted for one release so existing configs keep compiling, but it no longer selects anything. Naming it prints one notice when ESLint loads the config:

```
[@the-rabbit-hole/eslint-config] disableExtends "eslintPrettier" is ignored: Prettier no longer runs inside ESLint, so there is nothing to disable; remove it from disableExtends and run prettier --check instead.
```

#### Opt-in extends (`enable`)

These are **off by default** and only applied when named in `enable`. They target a specific kind of project rather than every consumer, so a plain Node library never inherits rules it has no use for:

- `eslintA11y` — JSX accessibility rules ([eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)), for React component code.
- `eslintStorybook` — Storybook story linting ([eslint-plugin-storybook](https://github.com/storybookjs/eslint-plugin-storybook)).
- `eslintTesting` — Testing Library rules ([eslint-plugin-testing-library](https://github.com/testing-library/eslint-plugin-testing-library)), for test files.
- `eslintTypedoc` — [TypeDoc](https://typedoc.org)/TSDoc documentation quality ([eslint-plugin-typedoc](https://github.com/Nick2bad4u/eslint-plugin-typedoc)): doc-comment coverage on exported APIs (`typedoc/require-exported-doc-comment`) plus tag correctness (unknown/duplicate/empty tags, malformed inline links). Scoped to `**/*.{ts,tsx,mts,cts}`.

```js
import { createESLintConfig } from "@the-rabbit-hole/eslint-config";

// A React component library that wants a11y, Storybook, and doc-coverage:
export default createESLintConfig({
  enable: ["eslintA11y", "eslintStorybook", "eslintTypedoc"],
});
```

> ⚠️ **Upgrading from 0.4.x:** `eslintA11y`, `eslintTesting`, and `eslintStorybook` used to be on by default. They are now opt-in — add them to `enable` (and remove them from `disableExtends`) if your project relied on them.

## 🧩 What’s Included?

This ESLint config comes pre-bundled with a set of plugins and shareable configs tailored for modern TypeScript + React projects:

### Default plugins (on by default)

- ⚛️ **[eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react)** — React best practices
- 🎨 **[eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)** — Turns off every rule that would fight Prettier, including the layout rules in unicorn's recommended set. It is always applied last and cannot be disabled.
- 🪄 **[eslint-plugin-perfectionist](https://perfectionist.dev)** — Enforces sorting and consistency
- 🦄 **[eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn)** — Massive rules for good code
- 🟦 **[typescript-eslint](https://typescript-eslint.io)** — TypeScript linting

### Opt-in plugins (`enable`)

- ♿️ **[eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)** — Accessibility rules for JSX (`enable: ["eslintA11y"]`)
- 🧪 **[eslint-plugin-testing-library](https://github.com/testing-library/eslint-plugin-testing-library)** — Testing Library linting (`enable: ["eslintTesting"]`)
- 📖 **[eslint-plugin-storybook](https://github.com/storybookjs/eslint-plugin-storybook)** — Storybook linting (`enable: ["eslintStorybook"]`)
- 📚 **[eslint-plugin-typedoc](https://github.com/Nick2bad4u/eslint-plugin-typedoc)** — TypeDoc/TSDoc documentation quality (`enable: ["eslintTypedoc"]`)

## 🎨 Prettier

Prettier runs on its own, not inside ESLint. This package ships the shared options and switches off the ESLint rules that would disagree with them; your project installs Prettier and runs the check.

**1. Install Prettier, pinned to an exact version.** `prettier` is an optional peer dependency (`^3.9.0`). Pin it without a range:

```bash
npm install --save-dev --save-exact prettier
```

**2. Use the shared options.** Point Prettier at them from `package.json`:

```json
{
  "prettier": "@the-rabbit-hole/eslint-config/prettier"
}
```

To change a single option, spread them in a `prettier.config.mjs` instead:

```js
import sharedConfig from "@the-rabbit-hole/eslint-config/prettier";

export default { ...sharedConfig, printWidth: 100 };
```

A CommonJS `prettier.config.cjs` works too: `require("@the-rabbit-hole/eslint-config/prettier")` returns the options object itself.

The options are the Prettier 3 defaults, written out. A project that formatted with no Prettier config before keeps its output unchanged.

**3. Add the scripts and run the check in CI.**

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

Run `npm run format:check` in CI next to `npm run lint`. Add a `.prettierignore` for build output and generated files (for example `lib/`, `dist/` and a generated `CHANGELOG.md`).

### Why it works this way

Up to 0.7, `eslint-plugin-prettier` ran Prettier as an ESLint rule, and this package pinned the Prettier it expected. The pin never reached a project that listed its own `prettier`. npm installed the project's copy next to the plugin, and the plugin formatted with that copy, so lint results changed with every Prettier release while `npm ls` reported nothing wrong. No arrangement of dependency and peer entries fixed it. When Prettier is a separate step, the version that formats your code is the one in your own `package.json`, pinned exactly, and a Prettier upgrade is a deliberate one-line change.

> ⚠️ **Upgrading from 0.7.x:** `prettier/prettier` is gone from ESLint. Install Prettier as above, add the `format:check` script to CI, and run `npm run format` once. Remove `"eslintPrettier"` from `disableExtends` when convenient; it is ignored with a notice for now and will be rejected in a later release. If you relied on `eslint --fix` to format, run `npm run format` instead.

## 🤝 Contributing

Contributions are welcome!
If you have suggestions, improvements, or run into issues, please open a PR or issue.

## 📜 License

This project is licensed under the **MIT License**.
You’re free to use it in your own public or private projects.

Made with ❤️ by [@the-rabbit-hole](https://github.com/the-rabbit-hole-tech)
