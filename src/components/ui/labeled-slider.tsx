"use client"

import * as React from "react"
import { Minus, Plus, Lock, Unlock, RotateCcw } from "lucide-react"
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

export const LabeledSlider: React.FC<LabeledSliderProps> = ({
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
}) => {
    const handleDecrease = () => {
        if (locked) return
        const newVal = Math.max(min, value - step)
        onChange(Number(newVal.toFixed(step < 1 ? 3 : 1)))
    }

    const handleIncrease = () => {
        if (locked) return
        const newVal = Math.min(max, value + step)
        onChange(Number(newVal.toFixed(step < 1 ? 3 : 1)))
    }

    const handleReset = () => {
        if (locked || defaultValue === undefined) return
        onChange(defaultValue)
    }

    const showReset = defaultValue !== undefined && Math.abs(value - defaultValue) > 0.0001 && !locked

    return (
        <div
            onPointerDown={onPointerDown}
            className={cn(
                "p-3 border rounded-xl transition-all duration-200 group",
                variantClasses[variant],
                locked && "opacity-60 border-dashed",
                className
            )}>
            <div className="flex justify-between mb-2 font-bold text-[10px] uppercase tracking-wider items-center">
                <label className={cn("truncate mr-2", locked ? "text-muted-foreground" : "text-foreground")}>
                    {label}
                </label>

                <div className="flex items-center gap-1.5 shrink-0">
                    {showReset && (
                        <button
                            type="button"
                            onClick={handleReset}
                            className="p-1 rounded-md hover:bg-background/50 text-muted-foreground hover:text-foreground transition-colors"
                            title="Reset to default"
                        >
                            <RotateCcw size={12} />
                        </button>
                    )}

                    {lockId && onToggleLock && (
                        <button
                            type="button"
                            onClick={() => onToggleLock(lockId)}
                            className={cn(
                                "p-1 rounded-md transition-all",
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
                        {value.toFixed(step < 1 ? 2 : 0)}{unit}
                    </span>
                </div>
            </div>

            <div className={cn("flex items-center gap-3", locked && "hidden")}>
                <button
                    onClick={handleDecrease}
                    className="w-8 h-8 flex items-center justify-center bg-background border rounded-full hover:bg-muted active:scale-95 transition-all text-muted-foreground hover:text-foreground shrink-0"
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
                    onValueChange={([val]) => onChange(val)}
                    className="flex-1"
                    disabled={locked}
                />

                <button
                    onClick={handleIncrease}
                    className="w-8 h-8 flex items-center justify-center bg-background border rounded-full hover:bg-muted active:scale-95 transition-all text-muted-foreground hover:text-foreground shrink-0"
                    type="button"
                    disabled={locked}
                >
                    <Plus size={14} />
                </button>
            </div>
        </div>
    )
}