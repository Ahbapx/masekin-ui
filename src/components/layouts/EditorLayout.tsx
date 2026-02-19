"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { ChevronLeft, ChevronRight, PanelLeft, PanelRight, GripVertical } from "lucide-react";
import { Button } from "../ui/button";
import { FloatingToolbar } from "../ui/floating-toolbar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../ui/sheet";
import { Separator } from "../ui/separator";

// ============================================================================
// Types
// ============================================================================

export interface SidebarConfig {
    /** Whether this sidebar is enabled */
    enabled?: boolean;
    /** Width in pixels or CSS value */
    width?: number | string;
    /** Minimum width for resizable sidebars */
    minWidth?: number;
    /** Maximum width for resizable sidebars */
    maxWidth?: number;
    /** Content to render in the sidebar */
    content?: React.ReactNode;
    /** Header content (optional, renders at top of sidebar) */
    header?: React.ReactNode;
    /** Footer content (optional, renders at bottom of sidebar) */
    footer?: React.ReactNode;
    /** Whether sidebar is collapsible */
    collapsible?: boolean;
    /** Default collapsed state */
    defaultCollapsed?: boolean;
    /** Custom className */
    className?: string;
}

export interface TopbarConfig {
    /** Whether topbar is enabled */
    enabled?: boolean;
    /** Height in pixels */
    height?: number;
    /** Content to render in the topbar */
    content?: React.ReactNode;
    /** Custom className */
    className?: string;
}

export interface BottombarConfig {
    /** Whether bottombar is enabled */
    enabled?: boolean;
    /** Height in pixels */
    height?: number;
    /** Content to render in the bottombar */
    content?: React.ReactNode;
    /** Custom className */
    className?: string;
}

export interface CanvasConfig {
    /** Content to render in the canvas area */
    content?: React.ReactNode;
    /** Whether to show dot grid background */
    showGrid?: boolean;
    /** Custom className */
    className?: string;
    /** Background pattern style */
    backgroundStyle?: "dots" | "lines" | "none" | "transparent";
}

export interface FloatingToolbarConfig {
    /** Whether the floating toolbar is enabled */
    enabled?: boolean;
    /** Position of the floating toolbar */
    position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "bottom-center";
    /** Content to render in the floating toolbar */
    content?: React.ReactNode;
    /** Custom className */
    className?: string;
}

export interface EditorLayoutProps {
    /** Left sidebar configuration */
    leftSidebar?: SidebarConfig;
    /** Right sidebar configuration */
    rightSidebar?: SidebarConfig;
    /** Top bar configuration */
    topbar?: TopbarConfig;
    /** Bottom bar configuration */
    bottombar?: BottombarConfig;
    /** Canvas/main content area configuration */
    canvas?: CanvasConfig;
    /** Floating toolbar configuration */
    floatingToolbar?: FloatingToolbarConfig;
    /** Custom className for the root container */
    className?: string;
    /** Children (alternative to canvas.content) */
    children?: React.ReactNode;
}

// ============================================================================
// Context for controlling sidebar state from anywhere
// ============================================================================

interface EditorLayoutContextType {
    leftSidebarOpen: boolean;
    setLeftSidebarOpen: (open: boolean) => void;
    toggleLeftSidebar: () => void;
    rightSidebarOpen: boolean;
    setRightSidebarOpen: (open: boolean) => void;
    toggleRightSidebar: () => void;
    isMobile: boolean;
    leftMobileOpen: boolean;
    setLeftMobileOpen: (open: boolean) => void;
    rightMobileOpen: boolean;
    setRightMobileOpen: (open: boolean) => void;
}

const EditorLayoutContext = React.createContext<EditorLayoutContextType | null>(null);

export function useEditorLayout() {
    return React.useContext(EditorLayoutContext);
}

// ============================================================================
// Hook for detecting mobile
// ============================================================================

function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return isMobile;
}

// ============================================================================
// Sub-components
// ============================================================================

interface EditorSidebarProps {
    side: "left" | "right";
    config: SidebarConfig;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mobileOpen: boolean;
    onMobileOpenChange: (open: boolean) => void;
    isMobile: boolean;
}

function EditorSidebar({
    side,
    config,
    open,
    onOpenChange: _onOpenChange,
    mobileOpen,
    onMobileOpenChange,
    isMobile,
}: EditorSidebarProps) {
    const width = typeof config.width === "number" ? `${config.width}px` : (config.width ?? "300px");

    // Mobile: use Sheet
    if (isMobile) {
        return (
            <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
                <SheetContent
                    side={side}
                    className="w-[85vw] max-w-[320px] p-0 flex flex-col"
                >
                    <SheetHeader className="sr-only">
                        <SheetTitle>{side === "left" ? "Left Sidebar" : "Right Sidebar"}</SheetTitle>
                        <SheetDescription>Navigation and controls</SheetDescription>
                    </SheetHeader>
                    {config.header && (
                        <div className="shrink-0 border-b border-border bg-muted/30">
                            {config.header}
                        </div>
                    )}
                    <div className="flex-1 overflow-y-auto">
                        {config.content}
                    </div>
                    {config.footer && (
                        <div className="shrink-0 border-t border-border bg-muted/30">
                            {config.footer}
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        );
    }

    // Desktop: inline sidebar
    if (!open && config.collapsible) {
        return (
            <aside
                className={cn(
                    "hidden md:block bg-background shrink-0 overflow-hidden transition-all duration-200",
                    side === "left" ? "border-r-0" : "border-l-0"
                )}
                style={{ width: 0 }}
            />
        );
    }

    return (
        <aside
            className={cn(
                "hidden md:flex flex-col bg-background border-border shrink-0 overflow-hidden transition-all duration-200 relative",
                side === "left" ? "border-r" : "border-l",
                config.className
            )}
            style={{ width: open ? width : 0 }}
        >

            {config.header && (
                <div className="shrink-0 border-b border-border bg-muted/30">
                    {config.header}
                </div>
            )}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                {config.content}
            </div>
            {config.footer && (
                <div className="shrink-0 border-t border-border bg-muted/30">
                    {config.footer}
                </div>
            )}
        </aside>
    );
}

// ============================================================================
// Main EditorLayout Component
// ============================================================================

export function EditorLayout({
    leftSidebar,
    rightSidebar,
    topbar,
    bottombar,
    canvas,
    floatingToolbar,
    className,
    children,
}: EditorLayoutProps) {
    const isMobile = useIsMobile();

    // Sidebar state (desktop)
    const [leftOpen, setLeftOpen] = React.useState(!leftSidebar?.defaultCollapsed);
    const [rightOpen, setRightOpen] = React.useState(!rightSidebar?.defaultCollapsed);

    // Mobile drawer state
    const [leftMobileOpen, setLeftMobileOpen] = React.useState(false);
    const [rightMobileOpen, setRightMobileOpen] = React.useState(false);

    // Context value
    const contextValue = React.useMemo<EditorLayoutContextType>(
        () => ({
            leftSidebarOpen: leftOpen,
            setLeftSidebarOpen: setLeftOpen,
            toggleLeftSidebar: () => setLeftOpen((v) => !v),
            rightSidebarOpen: rightOpen,
            setRightSidebarOpen: setRightOpen,
            toggleRightSidebar: () => setRightOpen((v) => !v),
            isMobile,
            leftMobileOpen,
            setLeftMobileOpen,
            rightMobileOpen,
            setRightMobileOpen,
        }),
        [leftOpen, rightOpen, isMobile, leftMobileOpen, rightMobileOpen]
    );

    // Floating toolbar position classes
    const toolbarPositionClasses: Record<NonNullable<FloatingToolbarConfig["position"]>, string> = {
        "bottom-right": "bottom-6 right-6",
        "bottom-left": "bottom-6 left-6",
        "top-right": "top-6 right-6",
        "top-left": "top-6 left-6",
        "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
    };

    // Background pattern styles
    const getBackgroundStyle = () => {
        const style = canvas?.backgroundStyle ?? "none";
        if (style === "none") return "bg-background";
        if (style === "transparent") return "bg-transparent";
        if (style === "lines") return "bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:24px_24px]";
        // "dots" - fluxcade style
        return "bg-[radial-gradient(color-mix(in_srgb,var(--muted-foreground),transparent_80%)_1px,transparent_1px)] [background-size:20px_20px]";
    };

    return (
        <EditorLayoutContext.Provider value={contextValue}>
            <div className={cn("flex flex-col h-full w-full overflow-hidden bg-background", className)}>
                {/* Topbar */}
                {topbar?.enabled && (
                    <header
                        className={cn(
                            "shrink-0 border-b border-border bg-background flex items-center",
                            topbar.className
                        )}
                        style={{ height: topbar.height ?? 64 }}
                    >
                        {topbar.content}
                    </header>
                )}

                {/* Main content area */}
                <div className="flex flex-1 min-h-0 overflow-hidden">
                    {/* Left Sidebar */}
                    {leftSidebar?.enabled && (
                        <EditorSidebar
                            side="left"
                            config={leftSidebar}
                            open={leftOpen}
                            onOpenChange={setLeftOpen}
                            mobileOpen={leftMobileOpen}
                            onMobileOpenChange={setLeftMobileOpen}
                            isMobile={isMobile}
                        />
                    )}

                    {/* Canvas / Main Area */}
                    <main
                        className={cn(
                            "flex-1 flex flex-col relative min-w-0 overflow-hidden",
                            getBackgroundStyle(),
                            canvas?.className
                        )}
                    >
                        {/* Open Left Sidebar Trigger */}
                        {leftSidebar?.enabled && leftSidebar.collapsible && !leftOpen && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="hidden md:flex absolute top-2 left-2 z-50 h-8 w-8 bg-background/80 hover:bg-background backdrop-blur-sm shadow-sm text-foreground"
                                onClick={() => setLeftOpen(true)}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        )}

                        {/* Open Right Sidebar Trigger */}
                        {rightSidebar?.enabled && rightSidebar.collapsible && !rightOpen && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="hidden md:flex absolute top-2 right-2 z-50 h-8 w-8 bg-background/80 hover:bg-background backdrop-blur-sm shadow-sm text-foreground"
                                onClick={() => setRightOpen(true)}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                        )}

                        {canvas?.content ?? children}

                        {/* Floating Toolbar */}
                        {floatingToolbar?.enabled && floatingToolbar.content && (
                            <div
                                className={cn(
                                    "absolute z-20",
                                    toolbarPositionClasses[floatingToolbar.position ?? "bottom-right"],
                                    floatingToolbar.className
                                )}
                            >
                                {floatingToolbar.content}
                            </div>
                        )}
                    </main>

                    {/* Right Sidebar */}
                    {rightSidebar?.enabled && (
                        <EditorSidebar
                            side="right"
                            config={rightSidebar}
                            open={rightOpen}
                            onOpenChange={setRightOpen}
                            mobileOpen={rightMobileOpen}
                            onMobileOpenChange={setRightMobileOpen}
                            isMobile={isMobile}
                        />
                    )}
                </div>

                {/* Bottom bar */}
                {bottombar?.enabled && (
                    <footer
                        className={cn(
                            "shrink-0 border-t border-border bg-background flex items-center justify-center", // Added justify-center
                            bottombar.className
                        )}
                        style={{ height: bottombar.height ?? 40 }} // Increased default height slightly
                    >
                        <div className="w-full h-full flex items-center px-4">
                            {bottombar.content}
                        </div>
                    </footer>
                )}
            </div>
        </EditorLayoutContext.Provider>
    );
}

// ============================================================================
// Convenience Components
// ============================================================================

/** Header component for sidebars */
export function EditorSidebarHeader({
    icon,
    title,
    className,
    children,
}: {
    icon?: React.ReactNode;
    title?: string;
    className?: string;
    children?: React.ReactNode;
}) {
    return (
        <div className={cn("h-12 flex items-center gap-2 px-4", className)}>
            {icon && <span className="text-primary">{icon}</span>}
            {title && <span className="font-semibold text-sm tracking-tight">{title}</span>}
            {children}
        </div>
    );
}

/** Section/Group component for sidebars */
export function EditorSidebarSection({
    title,
    className,
    children,
}: {
    title?: string;
    className?: string;
    children?: React.ReactNode;
}) {
    return (
        <div className={cn("p-2", className)}>
            {title && (
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {title}
                </div>
            )}
            {children}
        </div>
    );
}

/** Toggle buttons for mobile sidebar access */
export function EditorMobileControls() {
    const context = useEditorLayout();

    if (!context || !context.isMobile) return null;

    const { setLeftMobileOpen, setRightMobileOpen } = context;

    return (
        <div className="flex items-center gap-1 md:hidden">
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setLeftMobileOpen(true)}
            >
                <PanelLeft className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setRightMobileOpen(true)}
            >
                <PanelRight className="h-4 w-4" />
            </Button>
        </div>
    );
}

/** Toggle buttons for desktop sidebar collapse */
export function EditorSidebarToggles() {
    const context = useEditorLayout();

    if (!context || context.isMobile) return null;

    const { toggleLeftSidebar, toggleRightSidebar, leftSidebarOpen, rightSidebarOpen } = context;

    return (
        <div className="hidden md:flex items-center gap-1">
            <Button
                variant="ghost"
                size="icon"
                className={cn("h-7 w-7 text-foreground", !leftSidebarOpen && "bg-accent")}
                onClick={toggleLeftSidebar}
            >
                <PanelLeft className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className={cn("h-7 w-7 text-foreground", !rightSidebarOpen && "bg-accent")}
                onClick={toggleRightSidebar}
            >
                <PanelRight className="h-4 w-4" />
            </Button>
        </div>
    );
}

/** Reusable toolbar for centered editor actions */
export function EditorToolbar({
    children,
    className,
    showGrip = false
}: {
    children: React.ReactNode;
    className?: string;
    showGrip?: boolean;
}) {
    return (
        <FloatingToolbar
            size="sm"
            className={cn("bg-background/95 border-border shadow-lg", className)}
        >
            {showGrip && (
                <div className="px-1 text-muted-foreground/30">
                    <GripVertical className="h-4 w-4" />
                </div>
            )}
            {children}
        </FloatingToolbar>
    );
}

/** Toolbar separator */
export function EditorToolbarSeparator() {
    return <Separator orientation="vertical" className="h-4 bg-border/50 mx-1" />;
}

