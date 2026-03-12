"use client";

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { Button } from "./button";
import { Input } from "./input";
import { Slider } from "./slider";
import {
  bestStopIndex,
  clamp,
  clamp01,
  POPOVER_MARGIN,
  POPOVER_MAX_H,
  POPOVER_MAX_W,
  POPOVER_MIN_H,
  POPOVER_OFFSET,
  toHexFromHexInput,
} from "./color-picker-utils";
import type {
  ColorPickerAdapter,
  ColorPickerGradientStop,
  ColorPickerPaint,
} from "./color-picker-types";

type PopoverPos =
  | {
      placement: "bottom" | "left" | "right";
      left: number;
      top: number;
      width: number;
      maxHeight: number;
    }
  | {
      placement: "top";
      left: number;
      bottom: number;
      width: number;
      maxHeight: number;
    };

export type ColorPickerProps = {
  value: string;
  onChange: (next: string) => void;
  adapter: ColorPickerAdapter;
  solidPresets?: readonly string[];
  gradientPresets?: readonly string[];
  disabled?: boolean;
  className?: string;
  popoverDirection?: "auto" | "bottom" | "top" | "left" | "right";
  onRangeGestureStart?: () => void;
  onInputGestureStart?: () => void;
  onInputGestureEnd?: () => void;
};

const toHex6 = (adapter: ColorPickerAdapter, raw: string) =>
  adapter.rgbaToHex(adapter.parseCssColor(raw), { includeAlpha: false });

const toHexFromInput = (adapter: ColorPickerAdapter, raw: string) =>
  toHexFromHexInput(raw, (value, includeAlpha) =>
    adapter.rgbaToHex(adapter.parseCssColor(value), { includeAlpha }),
  );

const isSupportedGradient = (
  paint: ColorPickerPaint,
): paint is Extract<
  ColorPickerPaint,
  { kind: "linear-gradient" | "radial-gradient" }
> => paint.kind === "linear-gradient" || paint.kind === "radial-gradient";

export const ColorPicker = memo(function ColorPicker({
  value,
  onChange,
  adapter,
  solidPresets = [],
  gradientPresets = [],
  disabled,
  className,
  popoverDirection = "auto",
  onRangeGestureStart,
  onInputGestureStart,
  onInputGestureEnd,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverPos, setPopoverPos] = useState<PopoverPos | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const parsed = useMemo(() => adapter.parsePaint(value), [adapter, value]);
  const mode: "flat" | "gradient" =
    parsed.kind === "solid" ? "flat" : "gradient";

  const [selectedStop, setSelectedStop] = useState(0);
  const [solidInput, setSolidInput] = useState(() => {
    const p = adapter.parsePaint(value);
    if (p.kind === "solid") return toHex6(adapter, p.color);
    return toHex6(adapter, adapter.paintToSolidFallback(p));
  });
  const [stopColorInput, setStopColorInput] = useState("");
  const [stopPosInput, setStopPosInput] = useState("");
  const [isSolidEditing, setIsSolidEditing] = useState(false);
  const [isStopColorEditing, setIsStopColorEditing] = useState(false);
  const [isStopPosEditing, setIsStopPosEditing] = useState(false);

  const barRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    kind: "stop";
    pos: number;
    color: string;
  } | null>(null);

  const updatePaint = useCallback(
    (
      next: ColorPickerPaint,
      opts?: { selectedStopHint?: { pos: number; color?: string } },
    ) => {
      const normalized = adapter.normalizePaint(next);
      onChange(adapter.serializePaint(normalized));
      if (isSupportedGradient(normalized)) {
        const hint = opts?.selectedStopHint;
        if (hint) setSelectedStop(bestStopIndex(normalized.stops, hint));
      }
    },
    [adapter, onChange],
  );

  const solidHex = useMemo(() => {
    if (parsed.kind === "solid") return toHex6(adapter, parsed.color);
    return toHex6(adapter, adapter.paintToSolidFallback(parsed));
  }, [adapter, parsed]);

  const previewBg = useMemo(
    () => adapter.paintToCssBackground(parsed),
    [adapter, parsed],
  );

  const gradient = isSupportedGradient(parsed) ? parsed : null;
  const stops = gradient?.stops ?? [];
  const selectedStopIndex = gradient
    ? Math.min(Math.max(0, selectedStop), Math.max(0, stops.length - 1))
    : 0;
  const selected = gradient ? stops[selectedStopIndex] ?? null : null;

  const solidInputValue = isSolidEditing ? solidInput : solidHex;
  const stopHexDerived = selected ? toHex6(adapter, selected.color) : "#000000";
  const stopColorInputValue = isStopColorEditing
    ? stopColorInput
    : stopHexDerived;
  const stopPosDerived = selected
    ? String(Math.round(clamp01(selected.pos) * 100))
    : "0";
  const stopPosInputValue = isStopPosEditing ? stopPosInput : stopPosDerived;

  const triggerLabel = (() => {
    if (parsed.kind === "solid") return solidHex;
    if (parsed.kind === "linear-gradient") {
      const angle = ((parsed.angle % 360) + 360) % 360;
      return `Linear ${Math.round(angle)}°`;
    }
    if (parsed.kind === "radial-gradient") return "Radial";
    return "Gradient";
  })();

  const triggerMeta = disabled
    ? "Disabled"
    : parsed.kind === "solid"
      ? "Click to edit"
      : `${stops.length} stops`;

  const setModeFlat = useCallback(() => {
    if (disabled || mode === "flat") return;
    updatePaint({ kind: "solid", color: adapter.paintToSolidFallback(parsed) });
  }, [adapter, disabled, mode, parsed, updatePaint]);

  const setModeGradient = useCallback(() => {
    if (disabled || mode === "gradient") return;
    const base = adapter.parseCssColor(
      parsed.kind === "solid"
        ? parsed.color
        : adapter.paintToSolidFallback(parsed),
    );
    const lighter = adapter.mixRgba(base, [1, 1, 1, base[3]] as const, 0.7);
    updatePaint({
      kind: "linear-gradient",
      angle: 90,
      stops: [
        {
          color: adapter.rgbaToHex(base, { includeAlpha: base[3] < 1 }),
          pos: 0,
        },
        {
          color: adapter.rgbaToHex(lighter, {
            includeAlpha: lighter[3] < 1,
          }),
          pos: 1,
        },
      ],
    });
  }, [adapter, disabled, mode, parsed, updatePaint]);

  const setSolid = useCallback(
    (hex: string) => {
      if (disabled) return;
      updatePaint({ kind: "solid", color: hex });
    },
    [disabled, updatePaint],
  );

  const setGradientKind = useCallback(
    (kind: "linear" | "radial") => {
      if (disabled || !gradient) return;
      if (kind === "linear" && gradient.kind === "linear-gradient") return;
      if (kind === "radial" && gradient.kind === "radial-gradient") return;

      const hint = {
        pos: gradient.stops[selectedStopIndex]?.pos ?? 0.5,
        color: gradient.stops[selectedStopIndex]?.color,
      };

      if (kind === "linear") {
        updatePaint(
          { kind: "linear-gradient", angle: 90, stops: gradient.stops },
          { selectedStopHint: hint },
        );
        return;
      }

      updatePaint(
        {
          kind: "radial-gradient",
          cx: 0.5,
          cy: 0.5,
          r: 1,
          stops: gradient.stops,
        },
        { selectedStopHint: hint },
      );
    },
    [disabled, gradient, selectedStopIndex, updatePaint],
  );

  const updateStop = useCallback(
    (stopIndex: number, next: Partial<ColorPickerGradientStop>) => {
      if (!gradient || disabled) return;
      const base = gradient.stops[stopIndex];
      if (!base) return;
      const nextStops = gradient.stops.map((stop, index) =>
        index === stopIndex ? { ...stop, ...next } : stop,
      );
      updatePaint({ ...gradient, stops: nextStops }, {
        selectedStopHint: {
          pos: typeof next.pos === "number" ? next.pos : base.pos,
          color: typeof next.color === "string" ? next.color : base.color,
        },
      });
    },
    [disabled, gradient, updatePaint],
  );

  const removeStop = useCallback(() => {
    if (!gradient || disabled || gradient.stops.length <= 2) return;
    const nextStops = gradient.stops.filter((_, index) => index !== selectedStopIndex);
    const hint = nextStops[Math.min(selectedStopIndex, nextStops.length - 1)] ?? null;
    updatePaint({ ...gradient, stops: nextStops }, {
      selectedStopHint: { pos: hint?.pos ?? 0.5, color: hint?.color },
    });
  }, [disabled, gradient, selectedStopIndex, updatePaint]);

  const addStopAt = useCallback(
    (pos: number) => {
      if (!gradient || disabled) return;
      const t = clamp01(pos);
      const sampled = adapter.sampleGradientStops(gradient.stops, t);
      const color = adapter.rgbaToHex(sampled, {
        includeAlpha: sampled[3] < 1,
      });
      const nextStops = [...gradient.stops, { color, pos: t }];
      updatePaint({ ...gradient, stops: nextStops }, {
        selectedStopHint: { pos: t, color },
      });
    },
    [adapter, disabled, gradient, updatePaint],
  );

  const onBarPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!gradient || disabled) return;
      if (e.target !== e.currentTarget) return;
      const element = barRef.current;
      if (!element) return;
      onRangeGestureStart?.();
      const rect = element.getBoundingClientRect();
      const t = rect.width > 0 ? (e.clientX - rect.left) / rect.width : 0.5;
      addStopAt(t);
    },
    [addStopAt, disabled, gradient, onRangeGestureStart],
  );

  const beginStopDrag = useCallback(
    (stopIndex: number) => (e: React.PointerEvent) => {
      if (!gradient || disabled) return;
      onRangeGestureStart?.();
      setSelectedStop(stopIndex);
      const stop = gradient.stops[stopIndex];
      dragRef.current = {
        pointerId: e.pointerId,
        kind: "stop",
        pos: stop?.pos ?? 0.5,
        color: stop?.color ?? "#ffffff",
      };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [disabled, gradient, onRangeGestureStart],
  );

  const onStopPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== e.pointerId || drag.kind !== "stop") return;
      if (!gradient || disabled) return;
      const element = barRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const t = rect.width > 0
        ? clamp01((e.clientX - rect.left) / rect.width)
        : 0.5;
      const index = bestStopIndex(gradient.stops, {
        pos: drag.pos,
        color: drag.color,
      });
      dragRef.current = { ...drag, pos: t };
      updateStop(index, { pos: t });
    },
    [disabled, gradient, updateStop],
  );

  const endDrag = useCallback((e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    dragRef.current = null;
  }, []);

  const computePopoverPos = useCallback((): PopoverPos | null => {
    if (typeof window === "undefined") return null;
    const element = triggerRef.current;
    if (!element) return null;
    const rect = element.getBoundingClientRect();

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const width = Math.min(
      POPOVER_MAX_W,
      Math.max(240, viewportW - POPOVER_MARGIN * 2),
    );
    const below = viewportH - rect.bottom - POPOVER_OFFSET - POPOVER_MARGIN;
    const above = rect.top - POPOVER_OFFSET - POPOVER_MARGIN;

    const placement =
      popoverDirection === "auto"
        ? below < 260 && above > below
          ? "top"
          : "bottom"
        : popoverDirection;

    if (placement === "left" || placement === "right") {
      const maxHeight = Math.max(
        POPOVER_MIN_H,
        Math.min(POPOVER_MAX_H, viewportH - POPOVER_MARGIN * 2),
      );
      const top = clamp(
        rect.top,
        POPOVER_MARGIN,
        Math.max(POPOVER_MARGIN, viewportH - maxHeight - POPOVER_MARGIN),
      );
      const idealLeft =
        placement === "left"
          ? rect.left - POPOVER_OFFSET - width
          : rect.right + POPOVER_OFFSET;
      const left = clamp(
        idealLeft,
        POPOVER_MARGIN,
        Math.max(POPOVER_MARGIN, viewportW - width - POPOVER_MARGIN),
      );
      return { placement, left, top, width, maxHeight };
    }

    const left = clamp(
      rect.left,
      POPOVER_MARGIN,
      Math.max(POPOVER_MARGIN, viewportW - width - POPOVER_MARGIN),
    );
    const space = placement === "bottom" ? below : above;
    const maxHeight = Math.max(
      POPOVER_MIN_H,
      Math.min(POPOVER_MAX_H, space),
    );

    if (placement === "bottom") {
      return {
        placement: "bottom",
        left,
        top: rect.bottom + POPOVER_OFFSET,
        width,
        maxHeight,
      };
    }

    return {
      placement: "top",
      left,
      bottom: viewportH - rect.top + POPOVER_OFFSET,
      width,
      maxHeight,
    };
  }, [popoverDirection]);

  const syncPopoverPos = useCallback(() => {
    const next = computePopoverPos();
    if (next) setPopoverPos(next);
  }, [computePopoverPos]);

  const openPopover = useCallback(() => {
    if (disabled) return;
    syncPopoverPos();
    setIsOpen(true);
  }, [disabled, syncPopoverPos]);

  const closePopover = useCallback(() => {
    setIsOpen(false);
  }, []);

  const togglePopover = useCallback(() => {
    if (disabled) return;
    if (isOpen) closePopover();
    else openPopover();
  }, [closePopover, disabled, isOpen, openPopover]);

  const onWindowKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") closePopover();
  }, [closePopover]);

  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return;
    window.addEventListener("resize", syncPopoverPos);
    window.addEventListener("scroll", syncPopoverPos, true);
    window.addEventListener("keydown", onWindowKeyDown);
    return () => {
      window.removeEventListener("resize", syncPopoverPos);
      window.removeEventListener("scroll", syncPopoverPos, true);
      window.removeEventListener("keydown", onWindowKeyDown);
    };
  }, [isOpen, onWindowKeyDown, syncPopoverPos]);

  const popover =
    isOpen && popoverPos && typeof document !== "undefined"
      ? createPortal(
          <div
            className="fixed inset-0 z-90"
            onPointerDown={(e) => {
              if (e.target === e.currentTarget) closePopover();
            }}
          >
            <div
              className="fixed rounded-lg border border-white/10 bg-[#0b0f14] p-3 shadow-xl"
              style={{
                left: popoverPos.left,
                width: popoverPos.width,
                maxHeight: popoverPos.maxHeight,
                overflow: "auto",
                ...(popoverPos.placement === "top"
                  ? { bottom: popoverPos.bottom }
                  : { top: popoverPos.top }),
              }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex min-w-0 items-center gap-2">
                    <div
                      className="h-8 w-8 rounded-md border border-white/10 bg-black/20"
                      style={{ background: previewBg }}
                    />
                    <div className="min-w-0">
                      <div className="truncate text-xs font-semibold text-zinc-100">
                        {triggerLabel}
                      </div>
                      <div className="truncate text-[11px] text-zinc-500">
                        {triggerMeta}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-zinc-100 hover:bg-white/10"
                    onClick={closePopover}
                  >
                    Close
                  </Button>
                </div>

                <div className="flex rounded-md border border-white/10 bg-black/20 p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-auto flex-1 rounded px-2 py-1 text-[11px] font-semibold ${mode === "flat" ? "bg-white/10 text-zinc-50 hover:bg-white/10" : "text-zinc-300 hover:bg-white/5"}`}
                    onClick={setModeFlat}
                    disabled={disabled}
                  >
                    Flat
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-auto flex-1 rounded px-2 py-1 text-[11px] font-semibold ${mode === "gradient" ? "bg-white/10 text-zinc-50 hover:bg-white/10" : "text-zinc-300 hover:bg-white/5"}`}
                    onClick={setModeGradient}
                    disabled={disabled}
                  >
                    Gradient
                  </Button>
                </div>

                {mode === "flat" ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Input
                        className="h-9 w-9 cursor-pointer rounded-md border-white/10 bg-black/20 p-0.5"
                        type="color"
                        value={solidHex}
                        onPointerDown={() => onRangeGestureStart?.()}
                        onChange={(e) => setSolid(e.target.value)}
                        disabled={disabled}
                        title="Color"
                      />
                      <Input
                        className="min-w-0 h-9 flex-1 rounded-md border-white/10 bg-black/20 px-2 py-1 text-xs text-zinc-100 outline-none focus-visible:ring-0"
                        value={solidInputValue}
                        onFocus={() => {
                          setIsSolidEditing(true);
                          onInputGestureStart?.();
                          setSolidInput(solidHex);
                        }}
                        onBlur={() => {
                          setIsSolidEditing(false);
                          onInputGestureEnd?.();
                          const next = toHexFromInput(adapter, solidInput);
                          if (!next) setSolidInput(solidHex);
                        }}
                        onChange={(e) => {
                          const raw = e.target.value;
                          setSolidInput(raw);
                          const next = toHexFromInput(adapter, raw);
                          if (next) setSolid(next);
                        }}
                        disabled={disabled}
                        placeholder="#RRGGBB"
                      />
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-[11px] text-zinc-400">
                        <span>Presets</span>
                        <span className="text-zinc-500">{solidPresets.length}</span>
                      </div>
                      <div className="grid grid-cols-8 gap-1">
                        {solidPresets.map((color, index) => (
                          <Button
                            key={`${color}-${index}`}
                            variant="ghost"
                            className="h-7 w-full rounded-md border border-white/10 p-0 hover:border-white/30 hover:bg-transparent"
                            style={{ background: color }}
                            onClick={() => setSolid(color)}
                            disabled={disabled}
                            aria-label="Color preset"
                          />
                        ))}
                      </div>
                    </div>
                  </>
                ) : gradient ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-1 rounded-md border border-white/10 bg-black/20 p-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-auto flex-1 rounded px-2 py-1 text-[11px] font-semibold ${gradient.kind === "linear-gradient" ? "bg-white/10 text-zinc-50 hover:bg-white/10" : "text-zinc-300 hover:bg-white/5"}`}
                          onClick={() => setGradientKind("linear")}
                          disabled={disabled}
                        >
                          Linear
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-auto flex-1 rounded px-2 py-1 text-[11px] font-semibold ${gradient.kind === "radial-gradient" ? "bg-white/10 text-zinc-50 hover:bg-white/10" : "text-zinc-300 hover:bg-white/5"}`}
                          onClick={() => setGradientKind("radial")}
                          disabled={disabled}
                        >
                          Radial
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-zinc-100 hover:bg-white/10"
                        onClick={() => {
                          if (!gradient || disabled) return;
                          const nextStops = gradient.stops.map((stop) => ({
                            ...stop,
                            pos: 1 - stop.pos,
                          }));
                          updatePaint({ ...gradient, stops: nextStops }, {
                            selectedStopHint: {
                              pos: 1 - (gradient.stops[selectedStopIndex]?.pos ?? 0.5),
                              color: gradient.stops[selectedStopIndex]?.color,
                            },
                          });
                        }}
                        disabled={disabled}
                      >
                        Reverse
                      </Button>
                    </div>

                    <div>
                      <div
                        ref={barRef}
                        className="relative h-10 w-full rounded-md border border-white/10 bg-black/20"
                        style={{ background: adapter.paintToCssBackground(gradient) }}
                        onPointerDown={onBarPointerDown}
                        onPointerMove={onStopPointerMove}
                        onPointerUp={endDrag}
                        onPointerCancel={endDrag}
                      >
                        {stops.map((stop, index) => {
                          const isSelected = index === selectedStopIndex;
                          return (
                            <Button
                              key={`${stop.color}-${index}`}
                              variant="ghost"
                              className={`absolute bottom-1 h-4 w-4 -translate-x-1/2 rounded-full border p-0 shadow-sm hover:bg-transparent disabled:opacity-40 ${isSelected ? "border-white" : "border-black/50"}`}
                              style={{
                                left: `${clamp01(stop.pos) * 100}%`,
                                background: stop.color,
                              }}
                              onPointerDown={beginStopDrag(index)}
                              onPointerMove={onStopPointerMove}
                              onPointerUp={endDrag}
                              onPointerCancel={endDrag}
                              onClick={() => setSelectedStop(index)}
                              disabled={disabled}
                              aria-label="Gradient stop"
                            />
                          );
                        })}
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-500">
                        <span>Click to add · Drag to move</span>
                        <span>{stops.length} stops</span>
                      </div>
                    </div>

                    {gradient.kind === "linear-gradient" ? (
                      <div className="rounded-md border border-white/10 bg-black/20 p-2">
                        <div className="mb-2 flex items-center justify-between text-[11px] text-zinc-400">
                          <span>Angle</span>
                          <span className="text-zinc-200">
                            {Math.round(((gradient.angle % 360) + 360) % 360)}°
                          </span>
                        </div>
                        <Slider
                          min={0}
                          max={360}
                          step={1}
                          value={[((gradient.angle % 360) + 360) % 360]}
                          onPointerDown={() => onRangeGestureStart?.()}
                          onValueChange={([val]) =>
                            updatePaint({ ...gradient, angle: val ?? 0 })
                          }
                          disabled={disabled}
                        />
                      </div>
                    ) : (
                      <div className="space-y-2 rounded-md border border-white/10 bg-black/20 p-2">
                        <div className="flex items-center justify-between text-[11px] text-zinc-400">
                          <span>Center</span>
                          <span className="text-zinc-200">
                            {Math.round(clamp01(gradient.cx) * 100)}%,{" "}
                            {Math.round(clamp01(gradient.cy) * 100)}%
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="mb-1 text-[11px] text-zinc-400">X</div>
                            <Slider
                              min={0}
                              max={100}
                              step={1}
                              value={[Math.round(clamp01(gradient.cx) * 100)]}
                              onPointerDown={() => onRangeGestureStart?.()}
                              onValueChange={([val]) =>
                                updatePaint({
                                  ...gradient,
                                  cx: (val ?? 0) / 100,
                                })
                              }
                              disabled={disabled}
                            />
                          </div>
                          <div>
                            <div className="mb-1 text-[11px] text-zinc-400">Y</div>
                            <Slider
                              min={0}
                              max={100}
                              step={1}
                              value={[Math.round(clamp01(gradient.cy) * 100)]}
                              onPointerDown={() => onRangeGestureStart?.()}
                              onValueChange={([val]) =>
                                updatePaint({
                                  ...gradient,
                                  cy: (val ?? 0) / 100,
                                })
                              }
                              disabled={disabled}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="mb-1 flex items-center justify-between text-[11px] text-zinc-400">
                            <span>Radius</span>
                            <span className="text-zinc-200">
                              {Math.round(clamp(gradient.r, 0.1, 2) * 100)}%
                            </span>
                          </div>
                          <Slider
                            min={10}
                            max={200}
                            step={1}
                            value={[Math.round(clamp(gradient.r, 0.1, 2) * 100)]}
                            onPointerDown={() => onRangeGestureStart?.()}
                            onValueChange={([val]) =>
                              updatePaint({
                                ...gradient,
                                r: (val ?? 100) / 100,
                              })
                            }
                            disabled={disabled}
                          />
                        </div>
                      </div>
                    )}

                    {selected ? (
                      <div className="rounded-md border border-white/10 bg-black/20 p-2">
                        <div className="flex items-center justify-between text-[11px] text-zinc-400">
                          <span>Stop</span>
                          <span className="text-zinc-200">
                            {Math.round(clamp01(selected.pos) * 100)}%
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Input
                            className="h-9 w-9 cursor-pointer rounded-md border-white/10 bg-black/20 p-0.5"
                            type="color"
                            value={toHex6(adapter, selected.color)}
                            onPointerDown={() => onRangeGestureStart?.()}
                            onChange={(e) =>
                              updateStop(selectedStopIndex, { color: e.target.value })
                            }
                            disabled={disabled}
                            title="Stop color"
                          />
                          <Input
                            className="min-w-0 h-9 flex-1 rounded-md border-white/10 bg-black/20 px-2 py-1 text-xs text-zinc-100 outline-none focus-visible:ring-0"
                            value={stopColorInputValue}
                            onFocus={() => {
                              setIsStopColorEditing(true);
                              onInputGestureStart?.();
                              setStopColorInput(stopHexDerived);
                            }}
                            onBlur={() => {
                              setIsStopColorEditing(false);
                              onInputGestureEnd?.();
                              const next = toHexFromInput(adapter, stopColorInput);
                              if (!next) setStopColorInput(stopHexDerived);
                            }}
                            onChange={(e) => {
                              const raw = e.target.value;
                              setStopColorInput(raw);
                              const next = toHexFromInput(adapter, raw);
                              if (next) updateStop(selectedStopIndex, { color: next });
                            }}
                            disabled={disabled}
                            placeholder="#RRGGBB"
                          />
                          <Input
                            className="h-9 w-21.5 rounded-md border-white/10 bg-black/20 px-2 py-1 text-xs text-zinc-100 outline-none focus-visible:ring-0"
                            inputMode="numeric"
                            value={stopPosInputValue}
                            onFocus={() => {
                              setIsStopPosEditing(true);
                              onInputGestureStart?.();
                              setStopPosInput(stopPosDerived);
                            }}
                            onBlur={() => {
                              setIsStopPosEditing(false);
                              onInputGestureEnd?.();
                              const n = Number(stopPosInput);
                              if (!Number.isFinite(n)) setStopPosInput(stopPosDerived);
                            }}
                            onChange={(e) => {
                              const raw = e.target.value;
                              setStopPosInput(raw);
                              const n = Number(raw);
                              if (!Number.isFinite(n)) return;
                              updateStop(selectedStopIndex, { pos: clamp01(n / 100) });
                            }}
                            disabled={disabled}
                            title="Position (%)"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-zinc-100 hover:bg-white/10"
                            onClick={removeStop}
                            disabled={disabled || stops.length <= 2}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ) : null}

                    <div>
                      <div className="mb-2 flex items-center justify-between text-[11px] text-zinc-400">
                        <span>Presets</span>
                        <span className="text-zinc-500">{gradientPresets.length}</span>
                      </div>
                      <div className="grid grid-cols-5 gap-1">
                        {gradientPresets.map((preset, index) => (
                          <Button
                            key={`${preset}-${index}`}
                            variant="ghost"
                            className="h-9 w-full rounded-md border border-white/10 bg-black/20 p-0 hover:border-white/30 hover:bg-transparent"
                            style={{
                              background: adapter.paintToCssBackground(
                                adapter.parsePaint(preset),
                              ),
                            }}
                            onClick={() => updatePaint(adapter.parsePaint(preset))}
                            disabled={disabled}
                            aria-label="Gradient preset"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className={className || ""}>
      <Button
        ref={triggerRef}
        variant="ghost"
        className="flex h-auto w-full items-center gap-2 rounded-md border border-white/10 bg-black/20 px-2 py-2 text-left hover:bg-white/5 disabled:opacity-40"
        onClick={togglePopover}
        disabled={disabled}
      >
        <div
          className="h-8 w-8 rounded-md border border-white/10 bg-black/20"
          style={{ background: previewBg }}
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-semibold text-zinc-100">
            {triggerLabel}
          </div>
          <div className="truncate text-[11px] text-zinc-500">
            {triggerMeta}
          </div>
        </div>
        <div className="text-xs text-zinc-400">▾</div>
      </Button>
      {popover}
    </div>
  );
});
