import perfectionist from "eslint-plugin-perfectionist";
import prettierPlugin from "eslint-plugin-prettier";
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
