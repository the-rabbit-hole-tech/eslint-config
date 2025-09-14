import { createESLintConfig } from "./lib/esm/index.js";

export default createESLintConfig({
  disableExtends: ["eslintReact", "eslintA11y", "eslintStorybook"],
});
