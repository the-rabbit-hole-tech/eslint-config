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
import { Linter } from "eslint";
import { defineConfig } from "eslint/config";

import eslintA11y from "./eslintA11y";
import eslintPerfectionist from "./eslintPerfectionist";
import eslintPrettier from "./eslintPretter";
import eslintReact from "./eslintReact";
import eslintStorybook from "./eslintStorybook";
import eslintTesting from "./eslintTesting";
import eslintTypescript from "./eslintTypescript";
import eslintUnicorn from "./eslintUnicorn";

/**
 * Global Ignores
 * @since 1.0.0
 **/
export const globalIgnoresArray = [
  "**/.idea/**",
  "**/coverage/**",
  "**/node_modules{,/**}",
  "**/dist{,/**}",
  "**/lib{,/**}",
  "**/docs{,/**}",
  "**/storybook-static{,/**}",
  "**/.storybook{,/**}",
  "**/.husky{,/**}",
];

/**
 * Base extends with string keys
 * @remarks These are items that can be disabled.
 * @since 1.0.0
 */
const baseExtendsMap = {
  eslintA11y: eslintA11y.recommended,
  eslintPerfectionist,
  eslintPrettier,
  eslintReact,
  eslintStorybook: eslintStorybook["flat/recommended"],
  eslintTesting,
  eslintTypescript: eslintTypescript.recommended,
  eslintUnicorn,
} as const;

/**
 * Factory to create ESLint config
 * @since 1.0.0
 * @param options - List of extend names (keys) to remove from base config
 */
export function createESLintConfig(options?: {
  disableExtends?: (keyof typeof baseExtendsMap)[];
}) {
  const disabled = options?.disableExtends ?? [];
  return defineConfig([
    {
      ignores: globalIgnoresArray,
    },
    {
      extends: Object.entries(baseExtendsMap)
        .filter(
          ([key]) => !disabled.includes(key as keyof typeof baseExtendsMap),
        )
        .map(([, value]) => value as Linter.Config),
      rules: {
        "react/react-in-jsx-scope": "off",
      },
    },
  ]);
}

/**
 * Default Config
 * @remarks Used for all 'the rabbit hole' projects.
 * @since 1.0.0
 */
export default createESLintConfig();
