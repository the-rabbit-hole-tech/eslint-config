import { Linter } from "eslint";

export const eslintGlobalIgnores: Linter.Config = {
  ignores: [
    "./idea",
    ".node_modules/*",
    "./dist/*",
    "./lib/*",
    "./storybook-static/*",
    "./.storybook/*",
  ],
};

export default eslintGlobalIgnores;
