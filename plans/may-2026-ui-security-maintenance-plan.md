# May 2026 UI Security Maintenance Plan

## Goal

Bring `@masekin/ui` onto the same patched Next/React baseline as Moondrawn and make the package easier to audit and validate.

## Audit Findings

- [x] Repo is clean on `main` before changes.
- [x] No repo-local `AGENTS.md`; workspace rules apply.
- [x] `npm run typecheck` passes.
- [x] Initial `npm run lint` passed with one warning in `src/components/ui/labeled-slider.tsx`.
- [x] Initial `npm run check:release` passed with the same lint warning.
- [x] `npm audit` cannot run because the repo has no `package-lock.json`.
- [x] Dev `next` and `eslint-config-next` are pinned to vulnerable `16.1.6`.
- [x] Local install currently resolves React/React DOM to `19.2.4`, not the `19.2.6` May 2026 patch line.
- [x] No server routes or server actions live in this package; auth-sensitive logic remains consumer-owned.
- [x] Broad risky-pattern scan found no `eval`, `new Function`, `dangerouslySetInnerHTML`, storage token handling, or direct fetch calls.

## Checklist

- [x] Add a committed `package-lock.json` so `npm audit` and installs are reproducible.
- [x] Upgrade dev `next` from `16.1.6` to `16.2.6`.
- [x] Upgrade dev `eslint-config-next` from `16.1.6` to `16.2.6`.
- [x] Add explicit dev `react` and `react-dom` pins at `19.2.6` for local validation.
- [x] Update `next-auth` dev dependency to the current beta used by consumers if compatible.
- [x] Add root overrides for `postcss`, `react`, and `react-dom` to keep the local tree on patched single versions.
- [x] Run `npm audit --audit-level=low` and make it report zero vulnerabilities.
- [x] Review the `labeled-slider.tsx` lint warning and document why the raw image element is intentional.
- [x] Add `SameSite=Lax` to the client-set sidebar state cookie.
- [x] Run `npm run typecheck`.
- [x] Run `npm run lint`.
- [x] Run `npm run check:release` after committing, because the script intentionally refuses dirty working trees.

## Validation

- [x] `npm audit --audit-level=low` reports zero vulnerabilities.
- [x] `npm ls next postcss react react-dom` resolves to `next@16.2.6`, `postcss@8.5.14`, `react@19.2.6`, and `react-dom@19.2.6`.
- [x] `npm run typecheck` passes.
- [x] `npm run lint` passes with no warnings.
- [x] `git diff --check` passes.
- [x] `npm run check:release` clean-tree validation passes.

## Non-Goals

- Do not redesign component APIs.
- Do not change consumer-facing styles unless required by validation.
- Do not publish or tag a new package version in this pass.
