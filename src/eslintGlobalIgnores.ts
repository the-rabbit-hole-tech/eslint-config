import { Linter } from "eslint";

/**
 * GLobal Ignores
 * @default
 *     "./idea",
 *     ".node_modules/*",
 *     "./dist/*",
 *     "./lib/*",
 *     "./storybook-static/*",
 *     "./.storybook/*",
 * @since 1.0.0
 */
export const eslintGlobalIgnores: Linter.Config = {
  ignores: [
    "./idea",
    ".node_modules/*",
    "./dist/*",
    "./lib/*",
    "./storybook-static/*",
    "./.storybook/*",
  ],
};

export default eslintGlobalIgnores;
