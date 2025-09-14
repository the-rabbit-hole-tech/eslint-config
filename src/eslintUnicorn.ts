import { Linter } from "eslint";
import eslintPluginUnicorn from "eslint-plugin-unicorn";

/**
 * ESLint for Unicorn
 */
export const eslintUnicorn: Linter.Config = {
  ...eslintPluginUnicorn.configs.recommended,
  rules: {
    ...eslintPluginUnicorn.configs.recommended.rules,
    "unicorn/filename-case": [
      "warn",
      {
        case: "camelCase",
      },
    ],
  },
};

export default eslintUnicorn;
