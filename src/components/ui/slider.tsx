"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "../../lib/utils"

const Slider = React.forwardRef<
    React.ComponentRef<typeof SliderPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, value, defaultValue, min = 0, max = 100, ...props }, ref) => {
    const currentValue = (value && typeof value[0] === 'number') 
        ? value[0] 
        : (defaultValue && typeof defaultValue[0] === 'number' ? defaultValue[0] : min)
    
    const range = max - min
    const percentage = range > 0 ? (currentValue - min) / range : 0
    const opacity = 0.10 + percentage * (0.50 - 0.10)

    return (
        <SliderPrimitive.Root
            ref={ref}
            value={value}
            defaultValue={defaultValue}
            min={min}
            max={max}
            className={cn(
                "relative flex w-full touch-none select-none items-center h-6",
                className
            )}
            {...props}
        >
            <SliderPrimitive.Track className="relative h-6 w-full grow overflow-hidden rounded-lg bg-muted/40 border border-border/80">
                <div 
                    className="absolute inset-y-[17.5%] inset-x-0 pointer-events-none" 
                    style={{
                        backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 9px, color-mix(in srgb, var(--border) 80%, transparent) 9px, color-mix(in srgb, var(--border) 80%, transparent) 10px)`
                    }}
                />
                <SliderPrimitive.Range 
                    className="absolute h-full bg-primary border-r border-primary/40" 
                    style={{ opacity }}
                />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb className="w-0 h-0 opacity-0 pointer-events-none focus-visible:outline-none" />
        </SliderPrimitive.Root>
    )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
