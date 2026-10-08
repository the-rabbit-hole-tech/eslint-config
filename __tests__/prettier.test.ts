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
import { format } from "prettier";
import { describe, expect, it } from "vitest";

import prettierConfig from "../src/prettier";

// The shared options spell out the Prettier 3 defaults that every consumer
// without its own config was already formatting with. Moving them into a
// config file must not reformat a single line, and a later Prettier release
// that changes a default must not change the house style silently.

const SAMPLE = [
  "import {a,b} from 'x'",
  "export const f = (value: string | number, other = {key: 'v'}) => ({a, b, value, other, long: `${value}-${value}-${value}-${value}`})",
  "export type Union = 'one' | 'two' | 'three' | 'four' | 'five' | 'six' | 'seven'",
  "const Component = () => <div className='x' data-long-attribute-name=\"value\">{a}</div>",
  "",
].join("\n");

describe("shared prettier options", () => {
  it("pins the house style explicitly", () => {
    expect(prettierConfig).toEqual({
      arrowParens: "always",
      bracketSameLine: false,
      bracketSpacing: true,
      endOfLine: "lf",
      jsxSingleQuote: false,
      objectWrap: "preserve",
      printWidth: 80,
      proseWrap: "preserve",
      quoteProps: "as-needed",
      semi: true,
      singleQuote: false,
      tabWidth: 2,
      trailingComma: "all",
      useTabs: false,
    });
  });

  it("formats exactly like Prettier with no config", async () => {
    const withShared = await format(SAMPLE, {
      ...prettierConfig,
      filepath: "sample.tsx",
    });
    const withDefaults = await format(SAMPLE, { filepath: "sample.tsx" });

    expect(withShared).toBe(withDefaults);
    expect(withShared).not.toBe(SAMPLE);
  });
});
