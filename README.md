# 🐇 ESLint Config – @the-rabbit-hole

![npm version](https://img.shields.io/npm/v/@the-rabbit-hole/eslint-config?style=for-the-badge&logo=npm&label=version)
![npm downloads](https://img.shields.io/npm/dm/@the-rabbit-hole/eslint-config?style=for-the-badge&logo=npm&label=downloads)
![ESLint](https://img.shields.io/badge/ESLint-9.x-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Overview

This package provides a **shared ESLint configuration** used across all  
[`@the-rabbit-hole`](https://github.com/the-rabbit-hole) projects.  

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
import rabbitHoleConfig from "@the-rabbit-hole/eslint-config";

export default [
  ...rabbitHoleConfig,
];
```

That’s it! 🚀

## 🧩 What’s Included?

* [@typescript-eslint](https://typescript-eslint.io) 📘
* [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) ⚛️
* [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) ♿️
* [eslint-plugin-testing-library](https://github.com/testing-library/eslint-plugin-testing-library) 🧪
* [eslint-plugin-storybook](https://github.com/storybookjs/eslint-plugin-storybook) 📖
* [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier) 🎨
* [eslint-plugin-perfectionist](https://perfectionist.dev) 🪄

## 🤝 Contributing

Contributions are welcome!
If you have suggestions, improvements, or run into issues, please open a PR or issue.

## 📜 License

This project is licensed under the **MIT License**.
You’re free to use it in your own public or private projects.

---

Made with ❤️ by [@the-rabbit-hole](https://github.com/the-rabbit-hole-tech)
