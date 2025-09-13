import perfectionist from "eslint-plugin-perfectionist";
import prettierPlugin from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "./idea",
      ".node_modules/*",
      "./dist/*",
      "./lib/*",
      "./storybook-static/*",
      "./.storybook/*",
    ],
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

  // Perfectionist sorting
  {
    ...perfectionist.configs["recommended-alphabetical"],
    files: ["**/*.{js,mjs,cjs,ts}"],
    rules: {
      ...perfectionist.configs["recommended-alphabetical"].rules,
    },
  },
];
