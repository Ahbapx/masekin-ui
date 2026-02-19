# Releasing `@masekin/ui`

This repo is the shared UI package used by multiple apps. Use this release flow to keep upgrades predictable.

## Versioning Rule (SemVer)

- `patch` (`0.1.3` -> `0.1.4`): bug fixes, no breaking API changes
- `minor` (`0.1.3` -> `0.2.0`): new backward-compatible components/props
- `major` (`0.x` -> `1.0.0` or higher): breaking API changes

## Release Steps

1. Update code and docs.
2. Update `CHANGELOG.md` with release notes.
3. Ensure working tree is clean.
4. Run pre-release gate:
   - `npm run check:release`
5. Bump version in `package.json`.
6. Commit:
   - `git commit -am "Release vX.Y.Z"`
7. Tag:
   - `git tag vX.Y.Z`
8. Push commit + tag:
   - `git push origin main`
   - `git push origin vX.Y.Z`

## Consumer Upgrade Rule

- Apps do **not** auto-upgrade.
- Each consumer app should explicitly update dependency to the new tag, then run:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run build`

This keeps changes controlled and reversible.
