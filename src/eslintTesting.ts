import testingLibrary from "eslint-plugin-testing-library";

export const eslintTesting = {
  files: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(test|spec).[jt]s?(x)",
    "**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)",
  ],
  ...testingLibrary.configs["flat/react"],
};

export default eslintTesting;
