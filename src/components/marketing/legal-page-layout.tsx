"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { Separator } from "../ui/separator";

// ============================================================================
// Types
// ============================================================================

export interface LegalPageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    lastUpdated?: string;
    children: React.ReactNode;
}

// ============================================================================
// Component
// ============================================================================

export function LegalPageLayout({
    title,
    lastUpdated,
    children,
    className,
    ...props
}: LegalPageLayoutProps) {
    return (
        <div className={cn("min-h-screen bg-background", className)} {...props}>
            <div className="container mx-auto px-4 py-12 md:py-20 max-w-3xl">
                {/* Header */}
                <header className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                        {title}
                    </h1>
                    {lastUpdated && (
                        <p className="text-sm text-muted-foreground">
                            Last updated: {lastUpdated}
                        </p>
                    )}
                </header>

                <Separator className="mb-10" />

                {/* Content */}
                <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-primary hover:prose-a:text-primary/80">
                    {children}
                </div>
            </div>
        </div>
    );
}
