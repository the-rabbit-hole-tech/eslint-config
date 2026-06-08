/*
MIT License

Copyright (c) 2026 Shane

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
import { Linter } from "eslint";
import { createRequire } from "node:module";

const requirePlugin = createRequire(import.meta.url);

/**
 * ESLint config for Storybook, loaded lazily and treated as optional.
 *
 * @remarks eslint-plugin-storybook imports the `storybook` package at module
 * load time. The plugin is required lazily (only when this extend is resolved)
 * AND guarded: the default export resolves every extend at module load, so a
 * project without `storybook` would otherwise crash on `import` even when it
 * disables this extend. When `storybook` is absent the Storybook config is
 * skipped instead, so Node libraries never need to install it.
 * @since 1.0.0
 */
export default function eslintStorybook(): Linter.Config[] {
  try {
    const storybook = requirePlugin("eslint-plugin-storybook");
    return storybook.configs["flat/recommended"];
  } catch {
    return [];
  }
}
