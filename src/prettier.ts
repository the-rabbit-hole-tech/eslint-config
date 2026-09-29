/*
MIT License

Copyright (c) 2026 Shane

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
import type { Config } from "prettier";

/**
 * Shared Prettier options for the rabbit hole projects.
 * @remarks These are the Prettier 3 defaults, written out. Every project that
 * formatted with no Prettier config keeps its output byte for byte, and a
 * Prettier release that changes a default cannot move the house style unless
 * this file changes too. Use it from `package.json`:
 *
 * ```json
 * { "prettier": "@the-rabbit-hole/eslint-config/prettier" }
 * ```
 *
 * or spread it in a `prettier.config.mjs` to override single options.
 * @since 0.8.0
 */
const prettierConfig: Config = {
  arrowParens: "always",
  bracketSameLine: false,
  bracketSpacing: true,
  endOfLine: "lf",
  jsxSingleQuote: false,
  objectWrap: "preserve",
  printWidth: 80,
  proseWrap: "preserve",
  quoteProps: "as-needed",
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  useTabs: false,
};

export default prettierConfig;
