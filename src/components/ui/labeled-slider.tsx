"use client"

import * as React from "react"
import { Minus, Plus, Lock, Unlock, RotateCcw, Settings2 } from "lucide-react"
import { Slider } from "./slider"
import { cn } from "../../lib/utils"

export interface LabeledSliderProps {
    label: string
    value: number
    min: number
    max: number
    step?: number
    onChange: (val: number) => void
    className?: string
    unit?: string
    variant?: "default" | "accent" | "muted" | "pink" | "yellow" | "cyan" | "lime" | "orange"
    // Action props
    lockId?: string
    locked?: boolean
    onToggleLock?: (id: string) => void
    defaultValue?: number
    onPointerDown?: (e: React.PointerEvent) => void
}

export interface ThumbnailLabeledSliderProps {
    label: string
    value: number
    min: number
    max: number
    step?: number
    onChange: (val: number) => void
    className?: string
    unit?: string
    defaultValue?: number
    disabled?: boolean
    thumbnailSrc?: string
    thumbnailAlt?: string
    thumbnailFallback?: React.ReactNode
    meta?: React.ReactNode
    onOpenPanel?: () => void
    openButtonLabel?: string
}

const variantClasses = {
    default: "bg-secondary/20 hover:bg-secondary/30 border-border",
    accent: "bg-accent/20 hover:bg-accent/30 border-accent/30",
    muted: "bg-muted hover:bg-muted/80 border-border",
    // Lumina style variants
    pink: "bg-brand-pink/10 hover:bg-brand-pink/20 border-brand-pink/20",
    yellow: "bg-brand-yellow/10 hover:bg-brand-yellow/20 border-brand-yellow/20",
    cyan: "bg-brand-cyan/10 hover:bg-brand-cyan/20 border-brand-cyan/20",
    lime: "bg-brand-lime/10 hover:bg-brand-lime/20 border-brand-lime/20",
    orange: "bg-brand-orange/10 hover:bg-brand-orange/20 border-brand-orange/20",
}

function useSliderControls({
    value,
    min,
    max,
    step,
    onChange,
    locked,
    defaultValue
}: {
    value: number
    min: number
    max: number
    step: number
    onChange: (val: number) => void
    locked: boolean
    defaultValue?: number
}) {
    const decimals = React.useMemo(() => {
        if (step < 0.001) return 4;
        if (step < 0.01) return 3;
        if (step < 1) return 2;
        return 0;
    }, [step]);

    const handleDecrease = React.useCallback(() => {
        if (locked) return
        const newVal = Math.max(min, value - step)
        onChange(Number(newVal.toFixed(decimals)))
    }, [decimals, locked, min, onChange, step, value])

    const handleIncrease = React.useCallback(() => {
        if (locked) return
        const newVal = Math.min(max, value + step)
        onChange(Number(newVal.toFixed(decimals)))
    }, [decimals, locked, max, onChange, step, value])

    const handleReset = React.useCallback(() => {
        if (locked || defaultValue === undefined) return
        onChange(defaultValue)
    }, [defaultValue, locked, onChange])

    const handleValueChange = React.useCallback((nextValue: number[]) => {
        const [next] = nextValue
        if (typeof next !== "number") return
        onChange(next)
    }, [onChange])

    return {
        decimals,
        handleDecrease,
        handleIncrease,
        handleReset,
        handleValueChange,
        showReset: defaultValue !== undefined && Math.abs(value - defaultValue) > 0.0001 && !locked,
    }
}

function LabeledSliderComponent({
    label,
    value,
    min,
    max,
    step = 1,
    onChange,
    className,
    unit = "",
    variant = "default",
    lockId,
    locked = false,
    onToggleLock,
    defaultValue,
    onPointerDown
}: LabeledSliderProps) {
    const {
        decimals,
        handleDecrease,
        handleIncrease,
        handleReset,
        handleValueChange,
        showReset,
    } = useSliderControls({
        value,
        min,
        max,
        step,
        onChange,
        locked,
        defaultValue
    })

    return (
        <div
            onPointerDown={onPointerDown}
            className={cn(
                "group rounded-xl border p-3 transition-colors duration-150 [contain:layout_paint]",
                variantClasses[variant],
                locked && "opacity-60 border-dashed",
                className
            )}>
            <div className="flex justify-between mb-2 font-bold text-[10px] uppercase tracking-wider items-center">
                <label className={cn("truncate mr-2", locked ? "text-muted-foreground" : "text-foreground")}>
                    {label}
                </label>

                <div className="flex items-center gap-1.5 shrink-0">
                    <button
                        type="button"
                        onClick={handleReset}
                        className={cn(
                            "rounded-md p-1 text-muted-foreground transition-colors hover:bg-background/50 hover:text-foreground",
                            showReset ? "visible" : "invisible pointer-events-none"
                        )}
                        title="Reset to default"
                        aria-hidden={!showReset}
                        tabIndex={showReset ? 0 : -1}
                    >
                        <RotateCcw size={12} />
                    </button>

                    {lockId && onToggleLock && (
                        <button
                            type="button"
                            onClick={() => onToggleLock(lockId)}
                            className={cn(
                                "rounded-md p-1 transition-colors",
                                locked
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            )}
                            title={locked ? 'Unlock parameter' : 'Lock parameter'}
                        >
                            {locked ? <Lock size={12} /> : <Unlock size={12} />}
                        </button>
                    )}

                    <span className={cn(
                        "bg-background px-2 py-0.5 rounded-lg border text-center font-mono text-[10px] min-w-[50px]",
                        locked ? "text-muted-foreground" : "text-foreground"
                    )}>
                        {value.toFixed(decimals)}{unit}
                    </span>
                </div>
            </div>

            <div className={cn("flex items-center gap-3", locked && "hidden")}>
                <button
                    onClick={handleDecrease}
                    className="h-8 w-8 shrink-0 rounded-full border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    type="button"
                    disabled={locked}
                >
                    <Minus size={14} />
                </button>

                <Slider
                    value={[value]}
                    min={min}
                    max={max}
                    step={step}
                    onValueChange={handleValueChange}
                    className="flex-1"
                    disabled={locked}
                />

                <button
                    onClick={handleIncrease}
                    className="h-8 w-8 shrink-0 rounded-full border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    type="button"
                    disabled={locked}
                >
                    <Plus size={14} />
                </button>
            </div>
        </div>
    )
}

function ThumbnailLabeledSliderComponent({
    label,
    value,
    min,
    max,
    step = 1,
    onChange,
    className,
    unit = "",
    defaultValue,
    disabled = false,
    thumbnailSrc,
    thumbnailAlt = label,
    thumbnailFallback,
    meta,
    onOpenPanel,
    openButtonLabel = "Open panel",
}: ThumbnailLabeledSliderProps) {
    const [imageFailed, setImageFailed] = React.useState(false)
    const [draftValue, setDraftValue] = React.useState<number>(value)
    const {
        decimals,
        handleDecrease,
        handleIncrease,
        handleReset,
        showReset,
    } = useSliderControls({
        value,
        min,
        max,
        step,
        onChange,
        locked: disabled,
        defaultValue
    })

    React.useEffect(() => {
        setDraftValue(value)
    }, [value])

    const handleLiveChange = React.useCallback((nextValue: number[]) => {
        const [next] = nextValue
        if (typeof next !== "number" || disabled) return
        setDraftValue(next)
        onChange(next)
    }, [disabled, onChange])

    const showThumbnailImage = Boolean(thumbnailSrc) && !imageFailed

    return (
        <div
            className={cn(
                "group rounded-xl border border-border p-3 transition-colors duration-150 [contain:layout_paint]",
                disabled ? "bg-muted/30 opacity-75" : "bg-secondary/20 hover:bg-secondary/30",
                className
            )}
        >
            <div className="mb-3 flex items-center gap-3">
                <span className="bg-background px-2 py-0.5 rounded-lg border text-center font-mono text-[10px] min-w-[50px] text-foreground shrink-0">
                    {value.toFixed(decimals)}{unit}
                </span>
                <div className="min-w-0 flex-1">
                    <label className={cn(
                        "truncate text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5",
                        disabled ? "text-muted-foreground" : "text-foreground"
                    )}>
                        {label}
                        {disabled && <Lock size={10} className="text-muted-foreground" />}
                    </label>
                    {meta ? (
                        <div className="mt-1 truncate font-mono text-[10px] text-muted-foreground">
                            {meta}
                        </div>
                    ) : null}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={disabled || !showReset}
                        className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-md transition-colors",
                            disabled
                                ? "opacity-60 cursor-not-allowed"
                                : "text-muted-foreground hover:bg-background/50 hover:text-foreground",
                            showReset ? "visible" : "invisible"
                        )}
                        title="Reset to default"
                        aria-hidden={!showReset}
                        tabIndex={showReset ? 0 : -1}
                    >
                        <RotateCcw size={10} />
                    </button>
                    {onOpenPanel ? (
                        <button
                            type="button"
                            onClick={onOpenPanel}
                            className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background/50 hover:text-foreground"
                            title={openButtonLabel}
                        >
                            <Settings2 size={10} />
                        </button>
                    ) : null}
                </div>
            </div>

            <div className="flex items-center gap-3">
                {onOpenPanel ? (
                    <button
                        type="button"
                        onClick={onOpenPanel}
                        className="relative w-16 aspect-video shrink-0 overflow-hidden rounded-md border border-border bg-muted/30 text-left"
                        title={openButtonLabel}
                    >
                        {showThumbnailImage ? (
                            <img
                                src={thumbnailSrc}
                                alt={thumbnailAlt}
                                className="h-full w-full object-cover"
                                onError={() => setImageFailed(true)}
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                {thumbnailFallback}
                            </div>
                        )}
                    </button>
                ) : null}

                <button
                    onClick={handleDecrease}
                    className="h-8 w-8 shrink-0 rounded-full border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    type="button"
                    disabled={disabled}
                >
                    <Minus size={14} />
                </button>

                <Slider
                    value={[draftValue]}
                    min={min}
                    max={max}
                    step={step}
                    onValueChange={handleLiveChange}
                    className="flex-1"
                    disabled={disabled}
                />

                <button
                    onClick={handleIncrease}
                    className="h-8 w-8 shrink-0 rounded-full border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    type="button"
                    disabled={disabled}
                >
                    <Plus size={14} />
                </button>
            </div>
        </div>
    )
}

export const LabeledSlider = React.memo(LabeledSliderComponent)
export const ThumbnailLabeledSlider = React.memo(ThumbnailLabeledSliderComponent)
