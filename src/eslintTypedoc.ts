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
import typedocPlugin from "eslint-plugin-typedoc";

/**
 * ESLint for TypeDoc / TSDoc documentation quality.
 *
 * @remarks Wraps `eslint-plugin-typedoc`'s `recommended` preset, which enforces
 * doc-comment coverage on exported APIs (`require-exported-doc-comment`) and
 * tag correctness (unknown/duplicate/empty tags, malformed inline links). The
 * preset is already scoped to `**\/*.{ts,tsx,mts,cts}`. This extend is opt-in
 * so non-library consumers are not forced into doc-coverage errors -- enable it
 * via `createESLintConfig({ enable: ["eslintTypedoc"] })`.
 * @since 0.5.0
 */
export const eslintTypedoc = typedocPlugin.configs.recommended as Linter.Config;

export default eslintTypedoc;
