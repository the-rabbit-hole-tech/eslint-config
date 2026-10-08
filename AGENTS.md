# AGENTS.md - eslint-config

Guide for AI agents working in this repository. Pair with `CLAUDE.md` (the working agreement and
hook-enforced rules). Keep this file current when the build, layout, or public API changes.

## What this is

`@the-rabbit-hole/eslint-config` is the shared, flat-config ESLint preset used across the
`@the-rabbit-hole` projects (and usable publicly). It ships a single factory, `createESLintConfig`,
that composes a curated set of plugin configs and lets a consumer disable default-on extends, enable
opt-in extends, and merge/override rules. It is published to npm as dual ESM/CJS with type
declarations.

Extends split into two groups (see `baseExtendsMap` / `optInExtendsMap` in `src/index.ts`):

- **Default-on** (every consumer): TypeScript, React, unicorn, perfectionist.
- **Opt-in** (off unless named in `enable`): jsx-a11y, testing-library, storybook, typedoc — each
  targets React/test/doc-specific code, so a plain Node library does not inherit them.

After both groups, `eslint-config-prettier` is always applied as the last extend. It switches off
every layout rule (core, unicorn, typescript-eslint, react), so ESLint never reports what Prettier
decides. It is not in either map and cannot be disabled. ESLint does not format: Prettier runs as
its own `prettier --check`.

## Using eslint-config

The public surface is the entry point `@the-rabbit-hole/eslint-config`:

- `default` export — the ready-made config (all base extends on).
- `createESLintConfig(options?)` — the factory. Options:
  - `disableExtends` — keys of base (default-on) extends to remove (the base keys plus the retired ones). The
    retired `eslintPrettier` key is still accepted as a no-op that prints one `console.warn` line,
    so consumers' TypeScript keeps compiling; drop it from `retiredExtends` in a later breaking
    release.
  - `enable` — keys of opt-in (default-off) extends to add: `eslintA11y`, `eslintStorybook`,
    `eslintTesting`, `eslintTypedoc`.
  - `rules` — rules merged on top of the bundled defaults; a key that collides with a bundled
    default replaces it and logs an info line.
- `globalIgnoresArray` — the shared ignore patterns.

The second entry point is `@the-rabbit-hole/eslint-config/prettier`: the shared Prettier options
(the Prettier 3 defaults, written out). ESM gets a default export; the CommonJS build is
`module.exports = options` (`export =` in its declarations, via tsdown's `cjsDefault`), because
Prettier and `prettier.config.cjs` files read `module.exports` as the options. `prettier` is an
optional peer (`^3.9.0`); consumers pin it exactly themselves.

Contract: extends load **lazily** so a disabled extend never imports its plugin. This matters for
`eslintStorybook`, whose plugin imports the `storybook` package at load time — the Storybook extend
is both lazy and guarded so Node libraries that don't install `storybook` never crash. Preserve that
laziness when adding extends whose plugins have heavy or optional load-time imports.

## Layout

- `src/index.ts` — the factory, the base/opt-in extend maps, default rules, and the default export.
- `src/eslint*.ts` — one file per bundled plugin config (e.g. `eslintTypescript.ts`,
  `eslintUnicorn.ts`, `eslintTypedoc.ts`, `eslintConfigPrettier.ts`). Each is a thin wrapper around
  an upstream preset.
- `src/prettier.ts` — the shared Prettier options behind the `./prettier` export.
- `src/interopDefault.ts` — unwraps the module namespace the CJS build gets from `require()` of an
  ESM-only plugin (see the gotcha below).
- `__tests__/index.test.ts` — unit tests for option wiring (shape of the produced config).
- `__tests__/package.test.ts` — packs the tarball, checks its file list, and loads it in fresh Node
  processes through both `import` and `require`, asserting both builds wire up the same plugins.
  It also loads `./prettier` both ways, resolves it through Prettier from a `package.json`, and
  type-checks consumer code (including `disableExtends: ["eslintPrettier"]`) against the packed
  declarations.
- `__tests__/prettier.test.ts` — the shared options, and that they format exactly like Prettier with
  no config.
- `__tests__/integration.test.ts` — real `ESLint` runs that assert specific plugin rules fire (or
  don't) for sample code, and that no layout rule is left on. Note the documented `eslint-plugin-react` + ESLint v10 incompatibility,
  which keeps the React rule explicitly skipped until upstream ships a fix.
- `__tests__/package.test.ts` — builds, then runs `npm pack --dry-run --json` and fails if the
  tarball lacks an entry point or contains a `.map` file. The build keeps source maps in `lib/`
  for local debugging; the `"!lib/**/*.map"` entry in `files` keeps them out of the package.

## Build, test, lint

- Build: `npm run build` (tsdown → `lib/` ESM+CJS+d.ts).
- Test: `npm test` (vitest). Integration tests run real ESLint; no external services.
- Lint: `npm run lint` (`eslint`, exits non-zero on any error); `npm run lint:fix` to autofix.
- Format: `npm run format:check`; `npm run format` to rewrite. `.prettierignore` skips `lib/`, the
  generated `CHANGELOG.md` and the hub-synced `.github/` and `.claude/`.
- Package hygiene: `npm run lint:npm` (npmPkgJsonLint) and `npx sort-package-json`.
- License headers: `task golic-run -- ...` (golic verifies the MIT header on every source file in
  CI; the copyright holder is configured as `2026 Shane` in `Taskfile.yaml`).

## CI

This is a public repo, so every job runs on GitHub-hosted runners (`runs-on: ubuntu-latest`) and
sets a `timeout-minutes`.

- Pull requests only, and never while the PR is a draft: CI starts when the PR is marked ready.
  Nothing reruns on the push to `main` after a squash merge, because the PR run already tested
  the tree being merged.
- **PR Checks** (`job-pr-checks.yaml`) is one job whose steps are the PR title, PR body, Prettier,
  hygiene, gitleaks and categorizing-label checks. It is the only workflow that reruns when a PR's
  title or body is edited. The Prettier step runs `prettier --check .` with the exact version read
  from `package.json`, fetched alone through `npx`.
- **Test** (`action-test.yaml`) builds, tests and lints on three Node versions and against each
  supported ESLint major. **GoLic** checks license headers. **License Check** checks npm
  dependency licenses, and only runs when `package.json` or the lockfile changes.
- On `main`, **Release Manager** prepares the changelog and version, and **Label Sync** runs when
  `.github/labels.yml` changes. **Release and Publish** runs Test again and then publishes to npm
  when a release is published.

## Conventions and gotchas

- See `CLAUDE.md` for the branch/commit/PR rules; they are enforced by the git hooks in
  `.claude/hooks` (run `bash .claude/hooks/install.sh` once per clone).
- This package **dogfoods its own built config** via `eslint.config.mjs`, which imports from
  `./lib/esm`. Run `npm run build` before `npm run lint` after changing `src/`.
- This repo's own Prettier is an **exact devDependency**. Bump it deliberately and run
  `npm run format` in the same PR. The shipped package carries no Prettier: consumers bring and
  pin their own, which is why `prettier` is only an optional peer. Do not reintroduce
  `eslint-plugin-prettier`: it formats with whichever Prettier npm installs next to it, not the
  one this package pins.
- Keep `eslint-config-prettier` the last extend in `createESLintConfig`; an extend added after it
  could switch a layout rule back on.
- The CJS build turns every plugin import into `require()`. For an ESM-only plugin that has only a
  default export (eslint-plugin-unicorn), that returns `{ __esModule, default }` and the bundler's
  interop passes the namespace through as the default, so `plugin.configs` is undefined and
  `require` of the whole package throws. Wrap such imports in `interopDefault`. The tarball test
  in `__tests__/package.test.ts` fails if a new plugin needs it.
- Adding a plugin: create `src/eslint<Name>.ts`, register it in `baseExtendsMap` (default-on) or
  `optInExtendsMap` (default-off) in `src/index.ts`, add unit + integration coverage, and document
  it in `README.md`.
