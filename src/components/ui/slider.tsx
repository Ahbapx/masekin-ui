"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "../../lib/utils"

const Slider = React.forwardRef<
    React.ComponentRef<typeof SliderPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
    <SliderPrimitive.Root
        ref={ref}
        className={cn(
            "relative flex w-full touch-none select-none items-center h-6",
            className
        )}
        {...props}
    >
        <SliderPrimitive.Track className="relative h-6 w-full grow overflow-hidden rounded-full bg-muted/40 border border-border/80">
            <div 
                className="absolute inset-y-[12.5%] inset-x-0 pointer-events-none" 
                style={{
                    backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 9px, var(--border) 9px, var(--border) 10px)`
                }}
            />
            <SliderPrimitive.Range className="absolute h-full bg-primary/40 border-r border-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="flex h-6 w-[2px] bg-primary ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
