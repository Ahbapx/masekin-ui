"use client";

import * as React from "react";
import Link from "next/link";
import { Twitter, Github, Linkedin, Instagram, Facebook, Youtube } from "lucide-react";
import { cn } from "../../lib/utils";
import { Separator } from "../ui/separator";

// ============================================================================
// Types
// ============================================================================

export interface FooterLink {
    label: string;
    href: string;
    external?: boolean;
}

export interface FooterColumn {
    title: string;
    links: FooterLink[];
}

export interface SocialLinks {
    twitter?: string;
    github?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
    appName: string;
    description?: string;
    columns?: FooterColumn[];
    socials?: SocialLinks;
    copyright?: string;
    logo?: React.ReactNode;
}

// ============================================================================
// Component
// ============================================================================

export function Footer({
    appName,
    description = "Building the future of digital experiences.",
    columns = [],
    socials,
    copyright,
    logo,
    className,
    ...props
}: FooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={cn("bg-background border-t border-border/50", className)} {...props}>
            <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Brand Column (Takes up 2 columns on large screens) */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-2 font-bold text-xl">
                            {logo}
                            <span>{appName}</span>
                        </div>
                        <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                            {description}
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <SocialIcon href={socials?.twitter} icon={Twitter} label="Twitter" />
                            <SocialIcon href={socials?.github} icon={Github} label="GitHub" />
                            <SocialIcon href={socials?.linkedin} icon={Linkedin} label="LinkedIn" />
                            <SocialIcon href={socials?.instagram} icon={Instagram} label="Instagram" />
                            <SocialIcon href={socials?.facebook} icon={Facebook} label="Facebook" />
                            <SocialIcon href={socials?.youtube} icon={Youtube} label="YouTube" />
                        </div>
                    </div>

                    {/* Links Columns */}
                    {columns.map((column, idx) => (
                        <div key={idx} className="space-y-4">
                            <h3 className="font-semibold text-sm tracking-wider uppercase text-foreground/90">
                                {column.title}
                            </h3>
                            <ul className="space-y-2.5">
                                {column.links.map((link, linkIdx) => (
                                    <li key={linkIdx}>
                                        <Link
                                            href={link.href}
                                            target={link.external ? "_blank" : undefined}
                                            rel={link.external ? "noopener noreferrer" : undefined}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <Separator className="my-8 lg:my-10" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>
                        {copyright || `© ${currentYear} ${appName}. All rights reserved.`}
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="hover:text-foreground transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-foreground transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({
    href,
    icon: Icon,
    label,
}: {
    href?: string;
    icon: React.ElementType;
    label: string;
}) {
    if (!href) return null;
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors p-2 -ml-2 hover:bg-muted rounded-full"
            aria-label={label}
        >
            <Icon className="h-5 w-5" />
        </a>
    );
}
