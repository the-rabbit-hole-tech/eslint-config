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
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it } from "vitest";

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
      ]),
    );
  });

  it("ships no source maps", () => {
    expect(packedPaths.filter((file) => file.endsWith(".map"))).toEqual([]);
  });
});
