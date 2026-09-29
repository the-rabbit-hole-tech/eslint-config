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
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// Guards the published tarball contents (#71). The build keeps source maps in
// lib/ for local debugging; the "files" field in package.json must keep them
// out of the package. The suite builds first because CI runs the tests before
// its build step, and packing without lib/ would pass vacuously.

type PackResult = { files: { path: string }[] };

const BUILD_TIMEOUT = 120_000;
const repoRoot = fileURLToPath(new URL("..", import.meta.url));

const npm = (npmArguments: string[]) =>
  execFileSync("npm", npmArguments, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

describe("npm package contents", () => {
  let packedPaths: string[] = [];

  beforeAll(() => {
    npm(["run", "build"]);
    // --ignore-scripts mirrors the publish workflow, which packs that way.
    const [result] = JSON.parse(
      npm(["pack", "--dry-run", "--json", "--ignore-scripts"]),
    ) as PackResult[];
    packedPaths = result.files.map((file) => file.path);
  }, BUILD_TIMEOUT);

  it("ships the ESM and CJS entry points", () => {
    expect(packedPaths).toEqual(
      expect.arrayContaining([
        "lib/cjs/index.cjs",
        "lib/cjs/index.d.cts",
        "lib/esm/index.d.mts",
        "lib/esm/index.mjs",
        "lib/cjs/prettier.cjs",
        "lib/cjs/prettier.d.cts",
        "lib/esm/prettier.d.mts",
        "lib/esm/prettier.mjs",
      ]),
    );
  });

  it("ships no source maps", () => {
    expect(packedPaths.filter((file) => file.endsWith(".map"))).toEqual([]);
  });
});

// Loads the packed tarball the way a consumer would, through both export
// conditions. The tarball is unpacked into a throwaway node_modules inside the
// repo's own node_modules, so the bundled plugins resolve from the repo's
// install and the check runs offline. Each load runs in a fresh Node process:
// vitest's own module loader would hide a broken CommonJS build.

type LoadSummary = {
  defaultEntries: number;
  enabledPlugins: string[];
  factory: string;
  plugins: string[];
};

const PACKAGE_NAME = "@the-rabbit-hole/eslint-config";
const OPT_IN_EXTENDS = [
  "eslintA11y",
  "eslintStorybook",
  "eslintTesting",
  "eslintTypedoc",
];

// Collects the plugin names a config registers, so the ESM and CJS loads can
// be compared on what they actually wire up, not just on having loaded.
const summarize = `
const pluginNames = (config) =>
  [...new Set(config.flatMap((entry) => Object.keys(entry.plugins ?? {})))].sort();
const summarize = (mod) => ({
  defaultEntries: mod.default.length,
  enabledPlugins: pluginNames(
    mod.createESLintConfig({ enable: ${JSON.stringify(OPT_IN_EXTENDS)} }),
  ),
  factory: typeof mod.createESLintConfig,
  plugins: pluginNames(mod.default),
});
`;

describe("packed tarball", () => {
  let consumerDirectory = "";

  const load = (script: string, inputType: "commonjs" | "module") =>
    JSON.parse(
      execFileSync(
        process.execPath,
        [`--input-type=${inputType}`, "--eval", summarize + script],
        {
          cwd: consumerDirectory,
          encoding: "utf8",
          stdio: ["ignore", "pipe", "pipe"],
        },
      ),
    ) as LoadSummary;

  beforeAll(() => {
    npm(["run", "build"]);
    const scratchRoot = path.join(repoRoot, "node_modules", ".tarball-test");
    mkdirSync(scratchRoot, { recursive: true });
    consumerDirectory = mkdtempSync(path.join(scratchRoot, "consumer-"));
    const [result] = JSON.parse(
      npm([
        "pack",
        "--json",
        "--ignore-scripts",
        "--pack-destination",
        consumerDirectory,
      ]),
    ) as { filename: string }[];
    execFileSync("tar", ["-xzf", result.filename], { cwd: consumerDirectory });
    const installed = path.join(
      consumerDirectory,
      "node_modules",
      PACKAGE_NAME,
    );
    mkdirSync(path.dirname(installed), { recursive: true });
    renameSync(path.join(consumerDirectory, "package"), installed);
  }, BUILD_TIMEOUT);

  afterAll(() => {
    if (consumerDirectory) {
      rmSync(consumerDirectory, { force: true, recursive: true });
    }
  });

  it("loads through the ESM import condition", () => {
    const summary = load(
      `const mod = await import(${JSON.stringify(PACKAGE_NAME)});
console.log(JSON.stringify(summarize(mod)));`,
      "module",
    );
    expect(summary.factory).toBe("function");
    expect(summary.plugins).toContain("unicorn");
    expect(summary.plugins).not.toContain("prettier");
    expect(summary.enabledPlugins).toContain("storybook");
  });

  it("loads through the CJS require condition with the same config", () => {
    const esm = load(
      `const mod = await import(${JSON.stringify(PACKAGE_NAME)});
console.log(JSON.stringify(summarize(mod)));`,
      "module",
    );
    const cjs = load(
      `const mod = require(${JSON.stringify(PACKAGE_NAME)});
console.log(JSON.stringify(summarize(mod)));`,
      "commonjs",
    );
    expect(cjs).toEqual(esm);
  });

  // Prettier loads a shared config by package specifier, and a CommonJS
  // prettier.config.cjs may require() it: both must hand back the options
  // object itself, not a module namespace wrapped around it.
  const PRETTIER_ENTRY = `${PACKAGE_NAME}/prettier`;

  it("loads ./prettier through import and require as the same options", () => {
    const esm = execFileSync(
      process.execPath,
      [
        "--input-type=module",
        "--eval",
        `const mod = await import(${JSON.stringify(PRETTIER_ENTRY)});
console.log(JSON.stringify(mod.default));`,
      ],
      { cwd: consumerDirectory, encoding: "utf8" },
    );
    const cjs = execFileSync(
      process.execPath,
      [
        "--input-type=commonjs",
        "--eval",
        `console.log(JSON.stringify(require(${JSON.stringify(PRETTIER_ENTRY)})));`,
      ],
      { cwd: consumerDirectory, encoding: "utf8" },
    );
    const options = JSON.parse(esm) as Record<string, unknown>;
    expect(options).toMatchObject({ printWidth: 80, trailingComma: "all" });
    expect(options).not.toHaveProperty("default");
    expect(JSON.parse(cjs)).toEqual(options);
  });

  it("is picked up by Prettier as a shared config from package.json", () => {
    const project = mkdtempSync(path.join(consumerDirectory, "project-"));
    writeFileSync(
      path.join(project, "package.json"),
      JSON.stringify({ name: "project", prettier: PRETTIER_ENTRY }),
    );
    const resolved = execFileSync(
      process.execPath,
      [
        "--input-type=module",
        "--eval",
        `const prettier = await import("prettier");
const config = await prettier.resolveConfig(${JSON.stringify(path.join(project, "sample.ts"))});
console.log(JSON.stringify(config));`,
      ],
      { cwd: project, encoding: "utf8" },
    );
    expect(JSON.parse(resolved)).toMatchObject({
      printWidth: 80,
      trailingComma: "all",
    });
  });

  // Consumers still passing the removed "eslintPrettier" key must compile
  // for one release. A misspelt key must still fail, which proves the check
  // is real rather than a type that accepts any string.
  const typeCheck = (source: string, extension: "cts" | "mts") => {
    const file = path.join(consumerDirectory, `check.${extension}`);
    writeFileSync(file, source);
    try {
      execFileSync(
        process.execPath,
        [
          path.join(repoRoot, "node_modules", "typescript", "bin", "tsc"),
          "--ignoreConfig",
          "--noEmit",
          "--strict",
          "--skipLibCheck",
          "--module",
          "nodenext",
          "--moduleResolution",
          "nodenext",
          "--types",
          "node",
          "--typeRoots",
          path.join(repoRoot, "node_modules", "@types"),
          file,
        ],
        { cwd: consumerDirectory, encoding: "utf8", stdio: "pipe" },
      );
      return "";
    } catch (error) {
      return String((error as { stdout?: string }).stdout ?? error);
    }
  };

  it(
    'type-checks disableExtends: ["eslintPrettier"] under import and require',
    () => {
      const esm = `import { createESLintConfig } from ${JSON.stringify(PACKAGE_NAME)};
import prettierConfig from ${JSON.stringify(PRETTIER_ENTRY)};
export const config = createESLintConfig({ disableExtends: ["eslintPrettier"] });
export const width: number | undefined = prettierConfig.printWidth;
`;
      const cjs = `import eslintConfig = require(${JSON.stringify(PACKAGE_NAME)});
import prettierConfig = require(${JSON.stringify(PRETTIER_ENTRY)});
export const config = eslintConfig.createESLintConfig({ disableExtends: ["eslintPrettier"] });
export const width: number | undefined = prettierConfig.printWidth;
`;
      expect(typeCheck(esm, "mts")).toBe("");
      expect(typeCheck(cjs, "cts")).toBe("");
      expect(
        typeCheck(
          `import { createESLintConfig } from ${JSON.stringify(PACKAGE_NAME)};
export const config = createESLintConfig({ disableExtends: ["eslintPretier"] });
`,
          "mts",
        ),
      ).toContain("eslintPretier");
    },
    BUILD_TIMEOUT,
  );
});
