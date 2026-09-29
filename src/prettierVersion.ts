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
import { createRequire } from "node:module";

const requireFromConfig = createRequire(import.meta.url);

/**
 * The prettier versions seen from this package and from eslint-plugin-prettier.
 * @since 0.7.0
 */
export type PrettierVersions = {
  /** The prettier this package depends on (the pinned version). */
  configVersion?: string;
  /** The prettier eslint-plugin-prettier will actually format with. */
  pluginVersion?: string;
};

const readPrettierVersion = (
  requireFrom: NodeJS.Require,
): string | undefined => {
  try {
    return (requireFrom("prettier/package.json") as { version: string })
      .version;
  } catch {
    return undefined;
  }
};

/**
 * Resolves prettier twice: once from this package and once from
 * eslint-plugin-prettier.
 *
 * @remarks The plugin loads prettier from its own install location, not from
 * this package. When a consumer lists its own `prettier` at a different
 * version, npm hoists the consumer's copy next to the plugin and nests the
 * pinned copy under this package, so the plugin formats with the consumer's
 * version and the pin decides nothing.
 * @since 0.7.0
 */
export const resolvePrettierVersions = (): PrettierVersions => {
  const requireFromPlugin = createRequire(
    requireFromConfig.resolve("eslint-plugin-prettier"),
  );
  return {
    configVersion: readPrettierVersion(requireFromConfig),
    pluginVersion: readPrettierVersion(requireFromPlugin),
  };
};

/**
 * Warns when `prettier/prettier` would format with a different prettier than
 * the one this package pins.
 *
 * @remarks A warning rather than an error: the config still loads and lints,
 * but the output names the version actually in use and the fix, so a lint
 * result that changes with a prettier release is explained where it shows up.
 * Resolution failures stay quiet; the plugin reports a missing prettier itself.
 * @param resolve - Supplies the two versions (injectable for tests).
 * @returns Whether drift was detected.
 * @since 0.7.0
 */
export const warnOnPrettierDrift = (
  resolve: () => PrettierVersions = resolvePrettierVersions,
): boolean => {
  let versions: PrettierVersions;
  try {
    versions = resolve();
  } catch {
    return false;
  }
  const { configVersion, pluginVersion } = versions;
  if (!configVersion || !pluginVersion || configVersion === pluginVersion) {
    return false;
  }
  console.warn(
    `[@the-rabbit-hole/eslint-config] prettier/prettier is formatting with prettier ${pluginVersion}, but this config pins prettier ${configVersion}. Lint results will follow ${pluginVersion}. Set "prettier": "${configVersion}" in your package.json (or remove your prettier dependency) so both resolve the same copy.`,
  );
  return true;
};

let driftChecked = false;

/**
 * Runs {@link warnOnPrettierDrift} once per process, so building the default
 * export and a consumer's own `createESLintConfig()` call warn only once.
 * @since 0.7.0
 */
export const warnOnPrettierDriftOnce = (): void => {
  if (driftChecked) {
    return;
  }
  driftChecked = true;
  warnOnPrettierDrift();
};
