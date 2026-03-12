export type ColorPickerRgba = readonly [number, number, number, number];

export type ColorPickerGradientStop = {
  pos: number;
  color: string;
};

export type ColorPickerSolidPaint = {
  kind: "solid";
  color: string;
};

export type ColorPickerLinearGradientPaint = {
  kind: "linear-gradient";
  angle: number;
  stops: ColorPickerGradientStop[];
};

export type ColorPickerRadialGradientPaint = {
  kind: "radial-gradient";
  cx: number;
  cy: number;
  r: number;
  stops: ColorPickerGradientStop[];
};

export type ColorPickerConicGradientPaint = {
  kind: "conic-gradient";
  cx: number;
  cy: number;
  angle: number;
  stops: ColorPickerGradientStop[];
};

export type ColorPickerMeshGradientPaint = {
  kind: "mesh-gradient";
  colors: [string, string, string, string];
};

export type ColorPickerFacetGradientPaint = {
  kind: "facet-gradient";
  cx: number;
  cy: number;
  stops: ColorPickerGradientStop[];
  threshold: number;
  intensity: number;
};

export type ColorPickerPaint =
  | ColorPickerSolidPaint
  | ColorPickerLinearGradientPaint
  | ColorPickerRadialGradientPaint
  | ColorPickerConicGradientPaint
  | ColorPickerMeshGradientPaint
  | ColorPickerFacetGradientPaint;

export type ColorPickerAdapter = {
  parsePaint: (raw: string | undefined | null) => ColorPickerPaint;
  normalizePaint: (paint: ColorPickerPaint) => ColorPickerPaint;
  serializePaint: (paint: ColorPickerPaint) => string;
  paintToSolidFallback: (paint: ColorPickerPaint) => string;
  paintToCssBackground: (paint: ColorPickerPaint) => string;
  parseCssColor: (raw: string | undefined | null) => ColorPickerRgba;
  rgbaToHex: (
    rgba: ColorPickerRgba,
    opts?: { includeAlpha?: boolean },
  ) => string;
  mixRgba: (
    a: ColorPickerRgba,
    b: ColorPickerRgba,
    t: number,
  ) => ColorPickerRgba;
  sampleGradientStops: (
    stops: ColorPickerGradientStop[],
    t: number,
  ) => ColorPickerRgba;
};
