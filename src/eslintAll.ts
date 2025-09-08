import {
  eslintGlobalIgnores,
  eslintPerfectionist,
  eslintReactA11y,
  eslintTesting,
  eslintTypescript,
} from "./index";

/**
 * ESLint for All
 * @since 1.0.0
 */
export const eslintAll = [
  {
    ...eslintGlobalIgnores,
  },
  // ...eslintTypescript.recommended,
  {
    ...eslintReactA11y,
  },
  {
    ...eslintTesting,
  },
  {
    ...eslintPerfectionist,
  },
];

export default eslintAll;
