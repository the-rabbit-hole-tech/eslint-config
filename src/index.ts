import { defineConfig } from "eslint/config";

import eslintA11y from "./eslintA11y";
import eslintPerfectionist from "./eslintPerfectionist";
import eslintPrettier from "./eslintPretter";
import eslintReact from "./eslintReact";
import eslintStorybook from "./eslintStorybook";
import eslintTesting from "./eslintTesting";
import eslintTypescript from "./eslintTypescript";

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
 * @description These are items that can be disabled.
 * @example
 * - eslintPerfectionist
 * - eslintTypescript
 * - eslintReact
 * - eslintA11y
 * - eslintTesting
 * - eslintPrettier
 * - eslintStorybook
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
} as const;

/**
 * Factory to create ESLint config
 * @description Review for more info.
 * @since 1.0.0
 * @param options List of extend names (keys) to remove from base config
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
        .map(([, value]) => value),
      rules: {
        "react/react-in-jsx-scope": "off",
      },
    },
  ]);
}

/**
 * Default Config
 * @description Used for all 'the rabbit hole' projects.
 * @since 1.0.0
 */
export default createESLintConfig();
