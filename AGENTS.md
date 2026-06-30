# AGENTS.md - eslint-config

Guide for AI agents working in this repository. Pair with `CLAUDE.md` (the working agreement and
hook-enforced rules). Keep this file current when the build, layout, or public API changes.

## What this is

`@the-rabbit-hole/eslint-config` is the shared, flat-config ESLint preset used across the
`@the-rabbit-hole` projects (and usable publicly). It ships a single factory, `createESLintConfig`,
that composes a curated set of plugin configs (TypeScript, React, jsx-a11y, unicorn, perfectionist,
prettier, testing-library, storybook) and lets a consumer disable bundled extends, enable opt-in
extends, and merge/override rules. It is published to npm as dual ESM/CJS with type declarations.

## Using eslint-config

The public surface is the entry point `@the-rabbit-hole/eslint-config`:

- `default` export — the ready-made config (all base extends on).
- `createESLintConfig(options?)` — the factory. Options:
  - `disableExtends` — keys of base (default-on) extends to remove.
  - `enable` — keys of opt-in (default-off) extends to add; currently `eslintTypedoc`.
  - `rules` — rules merged on top of the bundled defaults; a key that collides with a bundled
    default replaces it and logs an info line.
- `globalIgnoresArray` — the shared ignore patterns.

Contract: extends load **lazily** so a disabled extend never imports its plugin. This matters for
`eslintStorybook`, whose plugin imports the `storybook` package at load time — the Storybook extend
is both lazy and guarded so Node libraries that don't install `storybook` never crash. Preserve that
laziness when adding extends whose plugins have heavy or optional load-time imports.

## Layout

- `src/index.ts` — the factory, the base/opt-in extend maps, default rules, and the default export.
- `src/eslint*.ts` — one file per bundled plugin config (e.g. `eslintTypescript.ts`,
  `eslintUnicorn.ts`, `eslintTypedoc.ts`). Each is a thin wrapper around an upstream preset.
- `__tests__/index.test.ts` — unit tests for option wiring (shape of the produced config).
- `__tests__/integration.test.ts` — real `ESLint` runs that assert specific plugin rules fire (or
  don't) for sample code. Note the documented `eslint-plugin-react` + ESLint v10 incompatibility,
  which keeps the React rule explicitly skipped until upstream ships a fix.

## Build, test, lint

- Build: `npm run build` (tsdown → `lib/` ESM+CJS+d.ts).
- Test: `npm test` (vitest). Integration tests run real ESLint; no external services.
- Lint: `npm run lint` (`eslint | snazzy`); `npm run lint:fix` to autofix.
- Package hygiene: `npm run lint:npm` (npmPkgJsonLint) and `npx sort-package-json`.
- License headers: `task golic-run -- ...` (golic verifies the MIT header on every source file in
  CI; the copyright holder is configured as `2026 Shane` in `Taskfile.yaml`).

## Conventions and gotchas

- See `CLAUDE.md` for the branch/commit/PR rules; they are enforced by the git hooks in
  `.claude/hooks` (run `bash .claude/hooks/install.sh` once per clone).
- This package **dogfoods its own built config** via `eslint.config.mjs`, which imports from
  `./lib/esm`. Run `npm run build` before `npm run lint` after changing `src/`.
- `eslint-plugin-prettier` formats with whatever Prettier resolves, so Prettier is pinned as an
  **exact direct dependency** (not a floating peer) to keep formatting deterministic. Bump it
  deliberately — a Prettier change is a changelogged release.
- Adding a plugin: create `src/eslint<Name>.ts`, register it in `baseExtendsMap` (default-on) or
  `optInExtendsMap` (default-off) in `src/index.ts`, add unit + integration coverage, and document
  it in `README.md`.
