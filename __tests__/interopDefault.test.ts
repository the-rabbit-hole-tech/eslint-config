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
import { describe, expect, it } from "vitest";

import { interopDefault } from "../src/interopDefault";

describe("interopDefault", () => {
  const plugin = { configs: { recommended: {} }, rules: {} };

  it("unwraps a module namespace returned by require() of an ESM module", () => {
    expect(interopDefault({ __esModule: true, default: plugin })).toBe(plugin);
  });

  it("passes a plugin object through unchanged", () => {
    expect(interopDefault(plugin)).toBe(plugin);
  });

  it("leaves a plugin that happens to have a default key alone", () => {
    const withDefault = { ...plugin, default: "not a namespace" };
    expect(interopDefault(withDefault)).toBe(withDefault);
  });

  it("leaves a namespace without a default export alone", () => {
    const namespace = { __esModule: true, configs: {} };
    expect(interopDefault(namespace)).toBe(namespace);
  });

  it("passes non-object values through", () => {
    expect(interopDefault("plugin")).toBe("plugin");
    expect(interopDefault(0)).toBe(0);
  });
});
