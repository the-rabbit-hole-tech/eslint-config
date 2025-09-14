import testingLibrary from "eslint-plugin-testing-library";

/**
 * ESLing for Testing Library
 * @since 1.0.0
 */
export const eslintTesting = {
  ...testingLibrary.configs["flat/react"],
  files: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(test|spec).[jt]s?(x)",
    "**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)",
  ],
};

export default eslintTesting;
