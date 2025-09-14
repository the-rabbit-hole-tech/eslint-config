# 🐇 ESLint Config – @the-rabbit-hole

![npm version](https://img.shields.io/npm/v/@the-rabbit-hole/eslint-config?style=for-the-badge&logo=npm&label=version)
![npm downloads](https://img.shields.io/npm/dm/@the-rabbit-hole/eslint-config?style=for-the-badge&logo=npm&label=downloads)
![ESLint](https://img.shields.io/badge/ESLint-9.x-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
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
import eslintConfig from "@the-rabbit-hole/eslint-config-plugin";
export default eslintConfig;
```

That’s it! 🚀

## 🧩 What’s Included?

This ESLint config comes pre-bundled with a set of plugins and shareable configs tailored for modern TypeScript + React projects:

* [@typescript-eslint](https://typescript-eslint.io) 📘 — TypeScript support and rules
* [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) ⚛️ — React best practices
* [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) ♿️ — Accessibility rules for JSX
* [eslint-plugin-testing-library](https://github.com/testing-library/eslint-plugin-testing-library) 🧪 — Testing Library linting
* [eslint-plugin-storybook](https://github.com/storybookjs/eslint-plugin-storybook) 📖 — Storybook linting
* [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier) 🎨 — Run Prettier as an ESLint rule
* [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) ✂️ — Disables ESLint rules that conflict with Prettier
* [eslint-plugin-perfectionist](https://perfectionist.dev) 🪄 — Enforces sorting and consistency
* [eslint-plugin-sort-class-members](https://github.com/bryanrsmith/eslint-plugin-sort-class-members) 🧩 — Consistent class member ordering
* [eslint-plugin-tailwindcss](https://github.com/francoismassart/eslint-plugin-tailwindcss) 🌬️ — Tailwind CSS class sorting and validation
* [eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n) 📦 — Node.js best practices
* [@eslint/js](https://eslint.org/docs/latest/use/configure/configuration-files-new) 🛠️ — Official ESLint base config


## 🤝 Contributing

Contributions are welcome!
If you have suggestions, improvements, or run into issues, please open a PR or issue.

## 📜 License

This project is licensed under the **MIT License**.
You’re free to use it in your own public or private projects.

---

Made with ❤️ by [@the-rabbit-hole](https://github.com/the-rabbit-hole-tech)
