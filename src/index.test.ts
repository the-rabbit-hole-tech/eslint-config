import type { Linter } from "eslint";

import { afterEach, describe, expect, it, vi } from "vitest";

import { createESLintConfig, globalIgnoresArray } from "./index";

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
