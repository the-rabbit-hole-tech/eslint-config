// import storybook from "eslint-plugin-storybook";
import { defineConfig } from "eslint/config";

import eslintStorybook from "./eslintStorybook";
import {
  eslintPerfectionist,
  eslintReactA11y,
  eslintTesting,
  eslintTypescript,
} from "./index";

/**
 * ESLint for All
 * @since 1.0.0
 */
export const eslintAll = defineConfig(
  {
    ...eslintTypescript,
    ...eslintReactA11y,
    ...eslintPerfectionist,
    ...eslintTesting,
    ...eslintStorybook,
  },
  {
    ignores: [
      "./idea/*",
      "./node_modules/*",
      "./dist/*",
      "./lib/*",
      "./.storybook/*",
      "./storybook-static/*",
    ],
  },
);
