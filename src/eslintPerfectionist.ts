import { Linter } from "eslint";
import perfectionist from "eslint-plugin-perfectionist";

/**
 * ESLing for Prettier
 * @since 1.0.0
 **/
export const eslintPerfectionist: Linter.Config = {
  ...perfectionist.configs["recommended-alphabetical"],
  files: ["**/*.{js,mjs,cjs,ts}"],
  // ...perfectionist.configs["recommended-line-length"],
  rules: {
    ...perfectionist.configs["recommended-alphabetical"].rules,
    // ...perfectionist.configs["recommended-line-length"].rules,
  },
};

export default eslintPerfectionist;
