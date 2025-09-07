import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";

export const eslintReactA11y = {
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
