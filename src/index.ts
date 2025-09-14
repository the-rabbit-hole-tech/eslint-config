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
  "**/node_modules{,/**}",
  "**/dist{,/**}",
  "**/lib{,/**}",
  "**/docs{,/**}",
  "**/storybook-static{,/**}",
  "**/.storybook{,/**}",
  "**/.husky{,/**}",
];

/**
 * Default Config
 * @description Used for all 'the rabbit hole' projects.
 * @since 1.0.0
 */
export default defineConfig([
  {
    ignores: globalIgnoresArray,
  },
  {
    extends: [
      eslintPerfectionist,
      eslintTypescript.recommended,
      eslintReact,
      eslintA11y.recommended,
      eslintTesting,
      eslintPrettier,
      eslintStorybook["flat/recommended"],
    ],
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },
]);
