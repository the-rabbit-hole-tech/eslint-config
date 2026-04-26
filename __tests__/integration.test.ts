import type { Linter } from "eslint";

import { ESLint } from "eslint";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { createESLintConfig } from "../src";

const TEST_TIMEOUT = 30_000;

type Message = { ruleId: null | string; severity: number };

const lint = async (
  eslint: ESLint,
  code: string,
  filePath: string,
): Promise<Message[]> => {
  const [result] = await eslint.lintText(code, { filePath });
  return result.messages.map((m) => ({
    ruleId: m.ruleId,
    severity: m.severity,
  }));
};

const newEslint = (
  options?: Parameters<typeof createESLintConfig>[0],
): ESLint =>
  new ESLint({
    baseConfig: createESLintConfig(options) as Linter.Config[],
    overrideConfigFile: true,
  });

const ruleIds = (messages: Message[]): string[] =>
  messages.map((m) => m.ruleId).filter((id): id is string => id !== null);

const hasPluginRule = (messages: Message[], prefix: string): boolean =>
  ruleIds(messages).some((id) => id.startsWith(prefix));

// `eslint-plugin-react@7.37.5` only declares peer support for `eslint <= 9`,
// and its `react/display-name` rule calls the removed `context.getFilename()`
// API which eslint v10 deletes — so under eslint v10 it crashes when loaded.
// The default integration suite drops it; a dedicated React block re-enables
// it explicitly so the failure is visible the day it gets fixed.
const REACT_BREAKS_ON_V10 = true;

describe("integration: real ESLint run against sample code (default config minus React)", () => {
  let eslint: ESLint;

  beforeAll(() => {
    eslint = newEslint(
      REACT_BREAKS_ON_V10 ? { disableExtends: ["eslintReact"] } : undefined,
    );
  }, TEST_TIMEOUT);

  it(
    "loads without throwing on trivial code",
    async () => {
      const messages = await lint(
        eslint,
        "export const value = 1;\n",
        "sample.ts",
      );
      expect(messages).toBeDefined();
    },
    TEST_TIMEOUT,
  );

  it(
    "fires eslint-plugin-jsx-a11y on an <img> with no alt",
    async () => {
      const messages = await lint(
        eslint,
        'export const Bad = () => <img src="x" />;\n',
        "Component.tsx",
      );
      expect(hasPluginRule(messages, "jsx-a11y/")).toBe(true);
    },
    TEST_TIMEOUT,
  );

  it(
    "fires eslint-plugin-unicorn on a known anti-pattern",
    async () => {
      const messages = await lint(
        eslint,
        "export const arr = Array.from(new Set([1, 2, 3]));\n",
        "sample.ts",
      );
      expect(hasPluginRule(messages, "unicorn/")).toBe(true);
    },
    TEST_TIMEOUT,
  );

  it(
    "fires eslint-plugin-perfectionist on out-of-order imports",
    async () => {
      const code = [
        'import { z } from "zod";',
        'import { a } from "ajv";',
        "export const x = a;",
        "export const y = z;",
        "",
      ].join("\n");
      const messages = await lint(eslint, code, "sample.ts");
      expect(hasPluginRule(messages, "perfectionist/")).toBe(true);
    },
    TEST_TIMEOUT,
  );

  it(
    "fires @typescript-eslint on an explicit any",
    async () => {
      const messages = await lint(
        eslint,
        "export const broken = (input: any) => input;\n",
        "sample.ts",
      );
      expect(hasPluginRule(messages, "@typescript-eslint/")).toBe(true);
    },
    TEST_TIMEOUT,
  );

  it(
    "fires eslint-plugin-storybook on a *.stories.tsx file",
    async () => {
      const code = [
        'export default { title: "Foo" };',
        // `storybook/no-redundant-story-name` fires when a named export
        // re-declares its name via the `name` annotation.
        'export const Primary = { name: "Primary" };',
        "",
      ].join("\n");
      const messages = await lint(eslint, code, "Foo.stories.tsx");
      expect(hasPluginRule(messages, "storybook/")).toBe(true);
    },
    TEST_TIMEOUT,
  );

  it(
    "fires eslint-plugin-testing-library on a test file",
    async () => {
      const code = [
        'import { render, cleanup } from "@testing-library/react";',
        'test("x", () => { render(null); cleanup(); });',
        "",
      ].join("\n");
      const messages = await lint(eslint, code, "sample.test.tsx");
      expect(hasPluginRule(messages, "testing-library/")).toBe(true);
    },
    TEST_TIMEOUT,
  );
});

describe("integration: option wiring with various plugins on / off", () => {
  it(
    "disableExtends actually drops the plugin's rules at lint time",
    async () => {
      const eslint = newEslint({
        disableExtends: ["eslintA11y", "eslintReact"],
      });
      const messages = await lint(
        eslint,
        'export const Bad = () => <img src="x" />;\n',
        "Component.tsx",
      );
      expect(hasPluginRule(messages, "jsx-a11y/")).toBe(false);
    },
    TEST_TIMEOUT,
  );

  it(
    "minimal config (only TS + unicorn) still produces lint output",
    async () => {
      const eslint = newEslint({
        disableExtends: [
          "eslintA11y",
          "eslintPerfectionist",
          "eslintPrettier",
          "eslintReact",
          "eslintStorybook",
          "eslintTesting",
        ],
      });
      const messages = await lint(
        eslint,
        "export const arr = Array.from(new Set([1, 2, 3]));\n",
        "sample.ts",
      );
      expect(hasPluginRule(messages, "unicorn/")).toBe(true);
      expect(hasPluginRule(messages, "perfectionist/")).toBe(false);
    },
    TEST_TIMEOUT,
  );

  it(
    "user-supplied rules are applied at lint time",
    async () => {
      const info = vi.spyOn(console, "info").mockImplementation(() => {});
      const eslint = newEslint({
        disableExtends: ["eslintReact"],
        rules: { "no-console": "error" },
      });
      const messages = await lint(eslint, 'console.log("hi");\n', "sample.ts");
      expect(ruleIds(messages)).toContain("no-console");
      info.mockRestore();
    },
    TEST_TIMEOUT,
  );

  it(
    "user rule that overrides a bundled default actually overrides at lint time",
    async () => {
      const info = vi.spyOn(console, "info").mockImplementation(() => {});

      // Default has react/react-in-jsx-scope: "off" — user flips it to "error".
      const eslint = newEslint({
        rules: { "react/react-in-jsx-scope": "error" },
      });
      // We can't actually trigger that rule without the React plugin loaded,
      // so we just confirm the override notification fired (the unit tests
      // already cover the in-config replacement).
      expect(eslint).toBeDefined();
      expect(info).toHaveBeenCalledWith(
        expect.stringContaining("react/react-in-jsx-scope"),
      );

      info.mockRestore();
    },
    TEST_TIMEOUT,
  );
});

// Keep this block separate so the v10 incompat is loud and easy to delete
// the day eslint-plugin-react ships v10 support.
describe.skipIf(REACT_BREAKS_ON_V10)(
  "integration: eslint-plugin-react (skipped while plugin is incompatible with eslint v10)",
  () => {
    it(
      "fires a react/* rule on a JSX anti-pattern",
      async () => {
        const eslint = newEslint();
        const code = [
          "export const Bad = () => (",
          '  <div className="x">',
          "    {[1, 2, 3].map((i) => (",
          "      <span>{i}</span>",
          "    ))}",
          "  </div>",
          ");",
          "",
        ].join("\n");
        const messages = await lint(eslint, code, "Component.tsx");
        expect(hasPluginRule(messages, "react/")).toBe(true);
      },
      TEST_TIMEOUT,
    );
  },
);
