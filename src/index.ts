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
import eslintTypedoc from "./eslintTypedoc";
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
/**
 * A lazy producer of one extend's config. Loading is deferred so a disabled
 * extend never loads its plugin -- critical for eslintStorybook, whose plugin
 * imports the `storybook` package at load time. The explicit return type keeps
 * the inferred map type portable for declaration emit.
 * @since 1.0.0
 */
type ExtendFactory = () => Linter.Config | Linter.Config[];

const baseExtendsMap = {
  eslintA11y: (() => eslintA11y.recommended) as ExtendFactory,
  eslintPerfectionist: (() => eslintPerfectionist) as ExtendFactory,
  eslintPrettier: (() => eslintPrettier) as ExtendFactory,
  eslintReact: (() => eslintReact) as ExtendFactory,
  eslintStorybook: (() => eslintStorybook()) as ExtendFactory,
  eslintTesting: (() => eslintTesting) as ExtendFactory,
  eslintTypescript: (() => eslintTypescript.recommended) as ExtendFactory,
  eslintUnicorn: (() => eslintUnicorn) as ExtendFactory,
};

/**
 * Opt-in extends with string keys.
 * @remarks Unlike {@link baseExtendsMap}, these are never applied unless named
 * in `createESLintConfig({ enable })`. `eslintTypedoc` enforces TSDoc/TypeDoc
 * doc-comment coverage on exported APIs, so it is opt-in to keep non-library
 * consumers from being forced into doc-coverage errors.
 * @since 0.5.0
 */
const optInExtendsMap = {
  eslintTypedoc: (() => eslintTypedoc) as ExtendFactory,
};

/**
 * Default rules applied on top of the bundled extends.
 * @since 1.0.0
 */
const baseRules: Linter.RulesRecord = {
  "react/react-in-jsx-scope": "off",
};

/**
 * Factory to create ESLint config
 * @since 1.0.0
 * @param options.disableExtends - Extend names (keys) to remove from base config
 * @param options.enable - Opt-in extend names (keys) to add on top of the base
 *   config. Currently `eslintTypedoc` (TSDoc/TypeDoc doc-coverage enforcement).
 * @param options.rules - Rules to merge on top of the base rules. Keys that
 *   collide with a base rule will replace it; an info message is printed for
 *   each override so the consumer is aware.
 */
export function createESLintConfig(options?: {
  disableExtends?: (keyof typeof baseExtendsMap)[];
  enable?: (keyof typeof optInExtendsMap)[];
  rules?: Linter.RulesRecord;
}) {
  const disabled = options?.disableExtends ?? [];
  const enabled = options?.enable ?? [];
  const userRules = options?.rules ?? {};

  for (const ruleName of Object.keys(userRules)) {
    if (Object.hasOwn(baseRules, ruleName)) {
      console.info(
        `[@the-rabbit-hole/eslint-config] Rule "${ruleName}" overrides the bundled default.`,
      );
    }
  }

  return defineConfig([
    {
      ignores: globalIgnoresArray,
    },
    {
      extends: [
        ...Object.entries(baseExtendsMap)
          .filter(
            ([key]) => !disabled.includes(key as keyof typeof baseExtendsMap),
          )
          .map(([, factory]) => factory()),
        ...Object.entries(optInExtendsMap)
          .filter(([key]) =>
            enabled.includes(key as keyof typeof optInExtendsMap),
          )
          .map(([, factory]) => factory()),
      ],
      rules: {
        ...baseRules,
        ...userRules,
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
