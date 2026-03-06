"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import {
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "../ui/sidebar";
import { SidebarThinbar, type ThinbarTab } from "../ui/sidebar-thinbar";

export interface EditorSidebarThinbarConfig {
    tabs: ThinbarTab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    position?: "left" | "right";
    className?: string;
}

export interface EditorSidebarProps {
    side: "left" | "right";
    open: boolean;
    mobileOpen: boolean;
    onMobileOpenChange: (open: boolean) => void;
    isMobile: boolean;
    width?: number | string;
    collapsible?: boolean;
    className?: string;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    content?: React.ReactNode;
    scrollAreaClassName?: string;
    scrollViewportClassName?: string;
    contentClassName?: string;
    thinbar?: EditorSidebarThinbarConfig;
}

function SidebarBody({
    content,
    footer,
    header,
    scrollAreaClassName,
    scrollViewportClassName,
    contentClassName,
    thinbar,
}: Pick<
    EditorSidebarProps,
    | "content"
    | "footer"
    | "header"
    | "scrollAreaClassName"
    | "scrollViewportClassName"
    | "contentClassName"
    | "thinbar"
>) {
    const thinbarPosition = thinbar?.position ?? "right";

    const mainContent = (
        <SidebarContent className="min-h-0 min-w-0 flex-1 gap-0 overflow-hidden p-0">
            <ScrollArea
                className={cn("flex-1 min-h-0", scrollAreaClassName)}
                viewportClassName={scrollViewportClassName}
            >
                <div
                    className={cn(
                        "box-border h-full w-full max-w-full min-w-0 overflow-x-hidden",
                        contentClassName,
                    )}
                >
                    {content}
                </div>
            </ScrollArea>
        </SidebarContent>
    );

    return (
        <>
            {header && (
                <SidebarHeader className="shrink-0 gap-0 border-b border-border bg-muted/30 p-0">
                    {header}
                </SidebarHeader>
            )}

            <div className="flex flex-1 min-h-0 min-w-0">
                {thinbar && thinbarPosition === "left" && (
                    <SidebarThinbar
                        tabs={thinbar.tabs}
                        activeTab={thinbar.activeTab}
                        onTabChange={thinbar.onTabChange}
                        position="left"
                        className={thinbar.className}
                    />
                )}

                {mainContent}

                {thinbar && thinbarPosition === "right" && (
                    <SidebarThinbar
                        tabs={thinbar.tabs}
                        activeTab={thinbar.activeTab}
                        onTabChange={thinbar.onTabChange}
                        position="right"
                        className={thinbar.className}
                    />
                )}
            </div>

            {footer && (
                <SidebarFooter className="shrink-0 gap-0 border-t border-border bg-muted/30 p-0">
                    {footer}
                </SidebarFooter>
            )}
        </>
    );
}

export function EditorSidebar({
    side,
    open,
    mobileOpen,
    onMobileOpenChange,
    isMobile,
    width,
    collapsible,
    className,
    header,
    footer,
    content,
    scrollAreaClassName,
    scrollViewportClassName,
    contentClassName,
    thinbar,
}: EditorSidebarProps) {
    const resolvedWidth = typeof width === "number" ? `${width}px` : (width ?? "300px");

    if (isMobile) {
        return (
            <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
                <SheetContent
                    side={side}
                    className={cn("flex h-full w-[85vw] max-w-[320px] flex-col p-0", className)}
                >
                    <SheetHeader className="sr-only">
                        <SheetTitle>{side === "left" ? "Left Sidebar" : "Right Sidebar"}</SheetTitle>
                        <SheetDescription>Navigation and controls</SheetDescription>
                    </SheetHeader>

                    <SidebarBody
                        header={header}
                        footer={footer}
                        content={content}
                        scrollAreaClassName={scrollAreaClassName}
                        scrollViewportClassName={scrollViewportClassName}
                        contentClassName={contentClassName}
                        thinbar={thinbar}
                    />
                </SheetContent>
            </Sheet>
        );
    }

    if (!open && collapsible) {
        return (
            <aside
                className={cn(
                    "hidden bg-background shrink-0 overflow-hidden transition-all duration-200 md:block",
                    side === "left" ? "border-r-0" : "border-l-0",
                )}
                style={{ width: 0 }}
            />
        );
    }

    return (
        <aside
            className={cn(
                "relative hidden h-full shrink-0 flex-col overflow-hidden border-border bg-sidebar transition-all duration-200 md:flex",
                side === "left" ? "border-r" : "border-l",
                className,
            )}
            style={{ width: open ? resolvedWidth : 0 }}
        >
            <SidebarBody
                header={header}
                footer={footer}
                content={content}
                scrollAreaClassName={scrollAreaClassName}
                scrollViewportClassName={scrollViewportClassName}
                contentClassName={contentClassName}
                thinbar={thinbar}
            />
        </aside>
    );
}
