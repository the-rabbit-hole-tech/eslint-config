import { Linter } from "eslint";
import prettierPlugin from "eslint-plugin-prettier";

/**
 * ESLint for Prettier Plugin
 * @since 1.0.0
 */
export const eslintPrettier: Linter.Config = {
  plugins: {
    prettier: prettierPlugin,
  },
  rules: {
    "prettier/prettier": ["error"],
  },
};

export default eslintPrettier;
