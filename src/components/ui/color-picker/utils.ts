import type { ColorPickerGradientStop } from "./types";

export const isHex = (raw: string) =>
  /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(raw.trim());

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, n));

export const toHexFromHexInput = (
  raw: string,
  toHexFromCss: (value: string, includeAlpha: boolean) => string,
) => {
  const v = raw.trim();
  if (!isHex(v)) return null;
  const includeAlpha = v.length === 5 || v.length === 9;
  return toHexFromCss(v, includeAlpha);
};

export const bestStopIndex = (
  stops: ColorPickerGradientStop[],
  hint: { pos: number; color?: string },
) => {
  const targetPos = hint.pos;
  const targetColor = (hint.color ?? "").trim().toLowerCase();
  let best = 0;
  let bestScore = Infinity;

  for (let i = 0; i < stops.length; i++) {
    const stop = stops[i]!;
    const d = Math.abs(stop.pos - targetPos);
    const colorMatch =
      targetColor && stop.color.trim().toLowerCase() === targetColor ? 0 : 1;
    const score = d + colorMatch * 0.25;
    if (score < bestScore) {
      bestScore = score;
      best = i;
    }
  }

  return best;
};

export const POPOVER_MAX_W = 360;
export const POPOVER_MAX_H = 560;
export const POPOVER_MIN_H = 220;
export const POPOVER_MARGIN = 10;
export const POPOVER_OFFSET = 8;
