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
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  resolvePrettierVersions,
  warnOnPrettierDrift,
} from "../src/prettierVersion";

const spyWarn = () =>
  vi.spyOn(console, "warn").mockImplementation(() => void 0);

describe("warnOnPrettierDrift", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("stays quiet when the plugin formats with the pinned prettier", () => {
    const warn = spyWarn();
    const drifted = warnOnPrettierDrift(() => ({
      configVersion: "3.9.4",
      pluginVersion: "3.9.4",
    }));
    expect(drifted).toBe(false);
    expect(warn).not.toHaveBeenCalled();
  });

  it("warns with both versions when the plugin resolves another prettier", () => {
    const warn = spyWarn();
    const drifted = warnOnPrettierDrift(() => ({
      configVersion: "3.9.4",
      pluginVersion: "3.9.9",
    }));
    expect(drifted).toBe(true);
    expect(warn).toHaveBeenCalledOnce();
    const [message] = warn.mock.calls[0] as [string];
    expect(message).toContain("[@the-rabbit-hole/eslint-config]");
    expect(message).toContain("prettier 3.9.9");
    expect(message).toContain('"prettier": "3.9.4"');
  });

  it("stays quiet when either version cannot be resolved", () => {
    const warn = spyWarn();
    expect(warnOnPrettierDrift(() => ({ configVersion: "3.9.4" }))).toBe(false);
    expect(warnOnPrettierDrift(() => ({ pluginVersion: "3.9.9" }))).toBe(false);
    expect(warn).not.toHaveBeenCalled();
  });

  it("stays quiet when resolving the versions throws", () => {
    const warn = spyWarn();
    expect(
      warnOnPrettierDrift(() => {
        throw new Error("no prettier");
      }),
    ).toBe(false);
    expect(warn).not.toHaveBeenCalled();
  });
});

describe("resolvePrettierVersions", () => {
  it("resolves the same prettier for this package and the plugin in this repo", () => {
    const { configVersion, pluginVersion } = resolvePrettierVersions();
    expect(configVersion).toMatch(/^\d+\.\d+\.\d+/u);
    expect(pluginVersion).toBe(configVersion);
  });
});
