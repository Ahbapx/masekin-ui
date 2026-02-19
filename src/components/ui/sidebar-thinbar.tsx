"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

// ============================================================================
// Types
// ============================================================================

export interface ThinbarTab {
    /** Unique identifier for the tab */
    id: string
    /** Display label (used for tooltip/accessibility) */
    label: string
    /** Icon component to render */
    icon: React.ElementType
}

export interface SidebarThinbarProps {
    /** Array of tab configurations */
    tabs: ThinbarTab[]
    /** Currently active tab ID */
    activeTab: string
    /** Callback when tab is clicked */
    onTabChange: (tabId: string) => void
    /** Position of the thinbar relative to sidebar content */
    position?: "left" | "right"
    /** Custom className for the container */
    className?: string
}

// ============================================================================
// SidebarThinbar Component
// ============================================================================

export const SidebarThinbar: React.FC<SidebarThinbarProps> = ({
    tabs,
    activeTab,
    onTabChange,
    position = "right",
    className,
}) => {
    return (
        <div
            className={cn(
                "w-10 bg-muted/50 flex flex-col items-center py-3 gap-1 shrink-0",
                position === "left" ? "border-r border-border" : "border-l border-border",
                className
            )}
        >
            {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id

                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            "w-8 h-8 flex items-center justify-center rounded-md transition-all",
                            isActive
                                ? "bg-background border border-border shadow-sm text-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        )}
                        title={tab.label}
                        aria-label={tab.label}
                        aria-pressed={isActive}
                    >
                        <Icon className="w-4 h-4" strokeWidth={2} />
                    </button>
                )
            })}
        </div>
    )
}

// ============================================================================
// TabbedSidebar - Convenience wrapper combining thinbar + content
// ============================================================================

export interface TabbedSidebarProps {
    /** Tabs configuration */
    tabs: ThinbarTab[]
    /** Currently active tab ID */
    activeTab: string
    /** Callback when tab changes */
    onTabChange: (tabId: string) => void
    /** Content to render for current tab */
    children: React.ReactNode
    /** Position of thinbar (left or right side of content) */
    thinbarPosition?: "left" | "right"
    /** Width of the content area */
    contentWidth?: number | string
    /** Custom className for container */
    className?: string
}

export const TabbedSidebar: React.FC<TabbedSidebarProps> = ({
    tabs,
    activeTab,
    onTabChange,
    children,
    thinbarPosition = "right",
    contentWidth = 200,
    className,
}) => {
    const width = typeof contentWidth === "number" ? `${contentWidth}px` : contentWidth

    return (
        <div className={cn("flex h-full", className)}>
            {thinbarPosition === "left" && (
                <SidebarThinbar
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={onTabChange}
                    position="left"
                />
            )}

            <div
                className="flex-1 flex flex-col overflow-hidden bg-background"
                style={{ width }}
            >
                {children}
            </div>

            {thinbarPosition === "right" && (
                <SidebarThinbar
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={onTabChange}
                    position="right"
                />
            )}
        </div>
    )
}
