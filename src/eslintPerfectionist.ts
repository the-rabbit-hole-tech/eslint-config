import { Linter } from "eslint";
import perfectionist from "eslint-plugin-perfectionist";

/**
 * ESLing for Prettier
 * @since 1.0.0
 */
export const eslintPerfectionist: Linter.Config = {
  plugins: {
    perfectionist,
  },
  rules: {
    "perfectionist/sort-imports": [
      "error",
      {
        type: "natural",
        order: "asc",
      },
    ],
    "perfectionist/sort-interfaces": [
      "error",
      {
        type: "alphabetical",
        order: "asc",
      },
    ],
    "perfectionist/sort-object-types": [
      "error",
      {
        type: "alphabetical",
        order: "asc",
      },
    ],
    "perfectionist/sort-intersection-types": [
      "error",
      {
        type: "alphabetical",
        order: "asc",
      },
    ],
    "perfectionist/sort-exports": [
      "error",
      {
        type: "alphabetical",
        order: "asc",
      },
    ],
    "perfectionist/sort-named-imports": [
      "error",
      {
        type: "alphabetical",
        order: "asc",
      },
    ],
    "perfectionist/sort-named-exports": [
      "error",
      {
        type: "alphabetical",
        order: "asc",
      },
    ],
  },
};

export default eslintPerfectionist;
