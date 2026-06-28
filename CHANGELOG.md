# Changelog

All notable changes to `@masekin/ui` should be documented in this file.

This project follows a simple Keep a Changelog style and SemVer-inspired versioning.

## [Unreleased]

- No unreleased entries yet.

## [0.1.33] - 2026-06-28

- Removed `[contain:layout_paint]` styling from labeled slider and thumbnail labeled slider container wrappers to fix rendering glitches/distortions on mobile devices when switching tabs in sidebars/drawers.

## [0.1.32] - 2026-06-27

- Added `select-none` style class to labeled slider container wrappers to prevent text selection during slider drags (leaving input fields selectable).
- Updated slider range fill opacity bounds to 10% min and 50% max.

## [0.1.31] - 2026-06-27

- Implemented dynamic value-dependent range fill opacity (mapping linearly from 15% opacity at minimum capacity to 80% opacity at maximum capacity).

## [0.1.30] - 2026-06-27

- Restored range fill opacity and vertical line tick opacity to the optimal visual layout of v0.1.28.

## [0.1.29] - 2026-06-27

- Increased slider active range fill opacity to `bg-primary/50` (up by 20%).
- Reduced opacity of track vertical line ticks by 20% using CSS `color-mix` with transparent.

## [0.1.28] - 2026-06-27

- Removed visual slider thumb entirely (making it hidden but retaining keyboard/accessibility support).
- Switched range fill opacity to a clean `bg-primary/30` with a `border-r border-primary/40` edge boundary line for a modern, sleek minimalist progress feel.

## [0.1.27] - 2026-06-27

- Applied `overflow-hidden rounded-lg` mask to the Slider Root to clip the vertical thumb line at the capsule boundaries.
- Replaced slider track and input wrapper capsule styling from fully-rounded (`rounded-full`) to `rounded-lg`.
- Updated active range fill to a solid, full-opacity background (`bg-primary`).
- Set track vertical line tick height to 65% of the container (10% shorter than before) using `inset-y-[17.5%]`.

## [0.1.26] - 2026-06-27

- Moved labeled slider input element to the right end of the slider track.
- Styled input element to have matching height (h-6) and capsule visual style as the slider.
- Vertically stacked the input's plus/minus buttons on its right end.
- Removed cross-hatching fill from the slider, replacing it with a solid mid-opacity fill.
- Adjusted vertical stripes/ticks of the slider track to be 75% of the track height.

## [0.1.25] - 2026-06-27

- Labeled slider text now wraps words properly (`break-words whitespace-normal`).
- Removed external +/- buttons from labeled slider layout.
- Added custom inline +/- buttons flanking the input value inside the input wrapper.
- Redesigned the slider track with a pill shape, custom vertical tick markings, diagonal cross-hatching fill, and vertical line thumb.

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
