import { Linter } from "eslint";
import react from "eslint-plugin-react";

/**
 * ESLing for React
 * @since 1.0.0
 */
export const eslintReact: Linter.Config = {
  ...react.configs.flat.recommended,
  settings: {
    react: { version: "detect" },
  },
};

export default eslintReact;
