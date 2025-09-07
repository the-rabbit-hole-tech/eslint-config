import jsxA11y from "eslint-plugin-jsx-a11y";
import perfectionist from "eslint-plugin-perfectionist";
import prettierPlugin from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import storybook from "eslint-plugin-storybook";
import testingLibrary from "eslint-plugin-testing-library";
import tseslint from "typescript-eslint";

const globalIgnores = [
  "./idea",
  ".node_modules/*",
  "./dist/*",
  "./lib/*",
  "./storybook-static/*",
  "./.storybook/*",
];

export default [
  {
    ignores: globalIgnores,
  },

  // TypeScript recommended
  ...tseslint.configs.recommended,

  // Prettier integration
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": ["error"],
    },
  },

  // React + A11y
  {
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
  },

  // Storybook
  ...storybook.configs["flat/recommended"].map((cfg) => ({
    files: ["**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)"],
    plugins: { storybook },
    ...cfg,
  })),

  // Testing Library
  {
    files: [
      "**/__tests__/**/*.[jt]s?(x)",
      "**/?(*.)+(test|spec).[jt]s?(x)",
      "**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)",
    ],
    ...testingLibrary.configs["flat/react"],
  },

  // Perfectionist sorting
  {
    plugins: {
      perfectionist,
    },
    rules: {
      "perfectionist/sort-imports": [
        "error",
        { type: "natural", order: "asc" },
      ],
      "perfectionist/sort-interfaces": [
        "error",
        { type: "alphabetical", order: "asc" },
      ],
      "perfectionist/sort-object-types": [
        "error",
        { type: "alphabetical", order: "asc" },
      ],
      "perfectionist/sort-intersection-types": [
        "error",
        { type: "alphabetical", order: "asc" },
      ],
      "perfectionist/sort-exports": [
        "error",
        { type: "alphabetical", order: "asc" },
      ],
      "perfectionist/sort-named-imports": [
        "error",
        { type: "alphabetical", order: "asc" },
      ],
      "perfectionist/sort-named-exports": [
        "error",
        { type: "alphabetical", order: "asc" },
      ],
    },
  },
];
