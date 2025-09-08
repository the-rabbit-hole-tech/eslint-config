import { Linter } from "eslint";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";

/**
 * ESLing for React/A11y
 * @since 1.0.0
 */
export const eslintReactA11y: Linter.Config = {
  plugins: {
    react,
    "jsx-a11y": jsxA11y,
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",
    "react/jsx-uses-vars": "error",

    "jsx-a11y/alt-text": "warn",
    "jsx-a11y/anchor-is-valid": "warn",
  },
  settings: {
    react: { version: "detect" },
  },
};

export default eslintReactA11y;
