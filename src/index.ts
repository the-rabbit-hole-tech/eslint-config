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
export const globalIgnores = [
  "./idea",
  ".node_modules/*",
  "./dist/*",
  "./lib/*",
  "./storybook-static/**/*",
  "./.storybook/*",
];

/**
 * Default Config
 * @since 1.0.0
 */
export default defineConfig([
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
    ignores: globalIgnores,
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },
]);
