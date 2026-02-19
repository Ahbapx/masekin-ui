import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const floatingToolbarVariants = cva(
    "flex items-center gap-1 border border-border bg-background/95 shadow-2xl backdrop-blur-sm",
    {
        variants: {
            orientation: {
                horizontal: "flex-row",
                vertical: "flex-col",
            },
            size: {
                default: "p-1.5 rounded-xl",
                sm: "p-1 rounded-lg",
                lg: "p-2 rounded-2xl",
                pill: "p-2 rounded-full", // Matches fluxcade/lumina style
            }
        },
        defaultVariants: {
            orientation: "horizontal",
            size: "default",
        },
    }
)

export interface FloatingToolbarProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof floatingToolbarVariants> { }

function FloatingToolbar({ className, orientation, size, ...props }: FloatingToolbarProps) {
    return (
        <div className={cn(floatingToolbarVariants({ orientation, size, className }))} {...props} />
    )
}

export { FloatingToolbar, floatingToolbarVariants }
