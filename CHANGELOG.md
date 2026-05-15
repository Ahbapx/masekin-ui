# Changelog

All notable changes to `@masekin/ui` should be documented in this file.

This project follows a simple Keep a Changelog style and SemVer-inspired versioning.

## [Unreleased]

- No unreleased entries yet.

## [0.1.24] - 2026-05-15

- Added a committed npm lockfile so installs and audits are reproducible.
- Updated local validation dependencies to the May 2026 patched Next/React baseline.
- Added package overrides for patched `postcss`, `react`, and `react-dom` versions.
- Documented the shared thumbnail image lint exception.
- Added `SameSite=Lax` to the sidebar state cookie.

## [0.1.20] - 2026-04-09

- Added minimal editor architecture documentation:
  - `docs/EDITOR_LAYOUT_GUIDE.md`
- Linked editor layout guide from package README.

## [0.1.2] - 2026-02-19

- Fixed typed-route compatibility in shared marketing components:
  - `branding-navbar`
  - `footer`

## [0.1.1] - 2026-02-19

- Internal stabilization updates (no major public API changes).

## [0.1.0] - 2026-02-19

- Initial shared package extraction.
- Core shared exports for:
  - UI primitives
  - layouts
  - marketing components
  - global styles
