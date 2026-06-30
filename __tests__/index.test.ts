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
import type { Linter } from "eslint";

import { afterEach, describe, expect, it, vi } from "vitest";

import { createESLintConfig, globalIgnoresArray } from "../src";

type ConfigEntry = {
  ignores?: string[];
  name?: string;
  rules?: Linter.RulesRecord;
} & Linter.Config;

const getRulesBlock = (config: ConfigEntry[]) =>
  config.at(-1) as { rules: Linter.RulesRecord } & ConfigEntry;

const getIgnoresBlock = (config: ConfigEntry[]) =>
  config.find((entry): entry is { ignores: string[] } & ConfigEntry =>
    Array.isArray(entry.ignores),
  );

const includesPlugin = (config: ConfigEntry[], substring: string) =>
  config.some((entry) => entry.name?.includes(substring));

describe("createESLintConfig", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("globalIgnoresArray", () => {
    it("includes the standard project ignore patterns", () => {
      expect(globalIgnoresArray).toContain("**/node_modules{,/**}");
      expect(globalIgnoresArray).toContain("**/lib{,/**}");
    });

    it("is applied as the ignores block of the produced config", () => {
      const config = createESLintConfig() as ConfigEntry[];
      expect(getIgnoresBlock(config)?.ignores).toEqual(globalIgnoresArray);
    });
  });

  describe("disableExtends", () => {
    it("includes every bundled extend by default", () => {
      const config = createESLintConfig() as ConfigEntry[];
      expect(includesPlugin(config, "jsx-a11y")).toBe(true);
      expect(includesPlugin(config, "storybook")).toBe(true);
      expect(includesPlugin(config, "typescript-eslint")).toBe(true);
      expect(includesPlugin(config, "unicorn")).toBe(true);
    });

    it("removes only the entries named in disableExtends", () => {
      const config = createESLintConfig({
        disableExtends: ["eslintStorybook", "eslintA11y"],
      }) as ConfigEntry[];

      expect(includesPlugin(config, "storybook")).toBe(false);
      expect(includesPlugin(config, "jsx-a11y")).toBe(false);
      expect(includesPlugin(config, "unicorn")).toBe(true);
      expect(includesPlugin(config, "typescript-eslint")).toBe(true);
    });
  });

  describe("enable (opt-in extends)", () => {
    it("does not include eslintTypedoc by default", () => {
      const config = createESLintConfig() as ConfigEntry[];
      expect(includesPlugin(config, "typedoc")).toBe(false);
    });

    it("adds eslintTypedoc only when named in enable", () => {
      const config = createESLintConfig({
        enable: ["eslintTypedoc"],
      }) as ConfigEntry[];
      expect(includesPlugin(config, "typedoc")).toBe(true);
    });

    it("leaves the base extends intact when an opt-in extend is enabled", () => {
      const config = createESLintConfig({
        enable: ["eslintTypedoc"],
      }) as ConfigEntry[];
      expect(includesPlugin(config, "unicorn")).toBe(true);
      expect(includesPlugin(config, "typescript-eslint")).toBe(true);
    });
  });

  describe("rules", () => {
    it("applies the bundled default rule when no user rules are provided", () => {
      const config = createESLintConfig() as ConfigEntry[];
      expect(getRulesBlock(config).rules).toMatchObject({
        "react/react-in-jsx-scope": "off",
      });
    });

    it("merges additive user rules without touching the bundled default", () => {
      const info = vi.spyOn(console, "info").mockImplementation(() => {});

      const config = createESLintConfig({
        rules: { "no-console": "error" },
      }) as ConfigEntry[];

      expect(getRulesBlock(config).rules).toMatchObject({
        "no-console": "error",
        "react/react-in-jsx-scope": "off",
      });
      expect(info).not.toHaveBeenCalled();
    });

    it("lets a user rule override a bundled default and emits an info message", () => {
      const info = vi.spyOn(console, "info").mockImplementation(() => {});

      const config = createESLintConfig({
        rules: { "react/react-in-jsx-scope": "error" },
      }) as ConfigEntry[];

      expect(getRulesBlock(config).rules["react/react-in-jsx-scope"]).toBe(
        "error",
      );
      expect(info).toHaveBeenCalledTimes(1);
      expect(info).toHaveBeenCalledWith(
        expect.stringContaining(`"react/react-in-jsx-scope"`),
      );
      expect(info).toHaveBeenCalledWith(
        expect.stringContaining("overrides the bundled default"),
      );
    });

    it("emits one info message per colliding key only", () => {
      const info = vi.spyOn(console, "info").mockImplementation(() => {});

      createESLintConfig({
        rules: {
          "no-console": "error",
          "react/react-in-jsx-scope": "warn",
        },
      });

      expect(info).toHaveBeenCalledTimes(1);
    });
  });
});
