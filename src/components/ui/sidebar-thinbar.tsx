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
    /** Render visible text labels next to icons */
    showLabels?: boolean
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
    showLabels = false,
    className,
}) => {
    return (
        <div
            className={cn(
                "h-full min-h-0 shrink-0 self-stretch bg-muted/50 flex flex-col py-3 gap-1",
                showLabels ? "w-16 items-stretch px-1" : "w-10 items-center",
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
                            "flex min-w-0 items-center rounded-md transition-colors",
                            showLabels ? "w-full flex-col justify-center gap-1 px-1 py-1.5" : "h-8 w-8 justify-center",
                            isActive
                                ? "bg-background border border-border shadow-sm text-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        )}
                        title={tab.label}
                        aria-label={tab.label}
                        aria-pressed={isActive}
                    >
                        <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                        {showLabels ? (
                            <span className="max-w-full truncate text-center text-[10px] font-medium leading-none">
                                {tab.label}
                            </span>
                        ) : null}
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
    /** Render visible text labels in the thinbar */
    showThinbarLabels?: boolean
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
    showThinbarLabels = false,
    contentWidth = 200,
    className,
}) => {
    const width = typeof contentWidth === "number" ? `${contentWidth}px` : contentWidth

    return (
        <div className={cn("flex h-full min-h-0 min-w-0 overflow-hidden", className)}>
            {thinbarPosition === "left" && (
                <SidebarThinbar
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={onTabChange}
                    position="left"
                    showLabels={showThinbarLabels}
                />
            )}

            <div
                className="flex-1 min-h-0 min-w-0 flex flex-col overflow-hidden bg-background"
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
                    showLabels={showThinbarLabels}
                />
            )}
        </div>
    )
}
