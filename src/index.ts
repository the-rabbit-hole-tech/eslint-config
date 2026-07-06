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

import eslintA11y, { eslintA11yRegister } from "./eslintA11y";
import eslintPerfectionist from "./eslintPerfectionist";
import eslintPrettier from "./eslintPretter";
import eslintReact from "./eslintReact";
import eslintStorybook from "./eslintStorybook";
import eslintTesting, { eslintTestingRegister } from "./eslintTesting";
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
  eslintPerfectionist: (() => eslintPerfectionist) as ExtendFactory,
  eslintPrettier: (() => eslintPrettier) as ExtendFactory,
  eslintReact: (() => eslintReact) as ExtendFactory,
  eslintTypescript: (() => eslintTypescript.recommended) as ExtendFactory,
  eslintUnicorn: (() => eslintUnicorn) as ExtendFactory,
};

/**
 * Opt-in extends with string keys.
 * @remarks Unlike {@link baseExtendsMap}, their **rules** are off unless the
 * key is named in `createESLintConfig({ enable })`. They target a specific kind
 * of project rather than every consumer:
 *
 * - `eslintA11y` -- JSX accessibility rules (React component code).
 * - `eslintStorybook` -- Storybook story linting.
 * - `eslintTesting` -- Testing Library rules (test files).
 * - `eslintTypedoc` -- TSDoc/TypeDoc doc-comment coverage on exported APIs.
 *
 * Each entry has a `full` form (plugin + recommended rules), applied when the
 * key is enabled. `eslintA11y` and `eslintTesting` additionally have a
 * `register` form (plugin loaded, **no** rules) that is applied even when *not*
 * enabled, so a consumer's inline `jsx-a11y/*` or `testing-library/*`
 * `eslint-disable` directives still resolve instead of hard-erroring with
 * "Definition for rule … was not found". Their rules stay off until enabled, so
 * opt-in coverage is unchanged.
 *
 * `eslintStorybook` and `eslintTypedoc` have no `register` form -- they stay
 * fully lazy (`full` only): the storybook plugin imports the optional
 * `storybook` package at load time (see the laziness contract in AGENTS.md), so
 * it must not be loaded for consumers that don't enable it; typedoc is
 * doc-coverage that a non-documented project shouldn't load.
 * @since 0.5.0
 */
const optInExtendsMap = {
  eslintA11y: {
    full: (() => eslintA11y.recommended) as ExtendFactory,
    register: (() => eslintA11yRegister) as ExtendFactory,
  },
  eslintStorybook: { full: (() => eslintStorybook()) as ExtendFactory },
  eslintTesting: {
    full: (() => eslintTesting) as ExtendFactory,
    register: (() => eslintTestingRegister) as ExtendFactory,
  },
  eslintTypedoc: { full: (() => eslintTypedoc) as ExtendFactory },
} satisfies Record<string, { full: ExtendFactory; register?: ExtendFactory }>;

/**
 * Default rules applied on top of the bundled extends.
 * @since 1.0.0
 */
const baseRules: Linter.RulesRecord = {
  // Enforce arrow-function style: functions must be expressions (arrow
  // functions), not declarations. A consumer that must use a declaration can
  // override this key via createESLintConfig({ rules }).
  "func-style": ["error", "expression"],
  "react/react-in-jsx-scope": "off",
};

/**
 * Factory to create ESLint config
 * @since 1.0.0
 * @param options.disableExtends - Extend names (keys) to remove from base config
 * @param options.enable - Opt-in extend names (keys) whose rules to turn on:
 *   `eslintA11y`, `eslintStorybook`, `eslintTesting`, and `eslintTypedoc`.
 *   Rules are off unless named here. Note: the `eslintA11y` and `eslintTesting`
 *   plugins are still *loaded* (rules off) when not enabled, so existing
 *   `jsx-a11y/*` and `testing-library/*` disable directives resolve;
 *   `eslintStorybook` and `eslintTypedoc` are not loaded at all until enabled.
 * @param options.rules - Rules to merge on top of the base rules. Keys that
 *   collide with a base rule will replace it; an info message is printed for
 *   each override so the consumer is aware.
 */
export const createESLintConfig = (options?: {
  disableExtends?: (keyof typeof baseExtendsMap)[];
  enable?: (keyof typeof optInExtendsMap)[];
  rules?: Linter.RulesRecord;
}) => {
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
        ...Object.entries(optInExtendsMap).flatMap(([key, entry]) => {
          // Enabled -> the full plugin + recommended rules. Not enabled ->
          // the register-only form (plugin loaded, no rules) if the extend
          // has one, so its `eslint-disable` directives still resolve; extends
          // with no register form (storybook, typedoc) stay fully lazy.
          if (enabled.includes(key as keyof typeof optInExtendsMap)) {
            return [entry.full()];
          }
          return "register" in entry ? [entry.register()] : [];
        }),
      ],
      rules: {
        ...baseRules,
        ...userRules,
      },
    },
  ]);
};

/**
 * Default Config
 * @remarks Used for all 'the rabbit hole' projects.
 * @since 1.0.0
 */
export default createESLintConfig();
