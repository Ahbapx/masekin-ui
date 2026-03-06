"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "../ui/sheet";
import {
  Navbar as UINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem as UINavbarItem,
  NavbarActions,
} from "../ui/navbar-primitive";

// ============================================================================
// Types
// ============================================================================

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface BrandingNavbarProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  appName?: string;
  items?: NavItem[];
  rightContent?: React.ReactNode;
  cta?: {
    label: string;
    href: string;
  };
  sticky?: boolean;
  containerClassName?: string;
  fluid?: boolean;
  ghost?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function BrandingNavbar({
  logo,
  appName,
  items = [],
  rightContent,
  cta,
  sticky = true,
  containerClassName,
  fluid = true,
  ghost = false,
  className,
  ...props
}: BrandingNavbarProps) {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  return (
    <UINavbar
      className={cn(
        "z-50 h-16 px-0 border-b",
        !ghost && "bg-background/80 backdrop-blur-md",
        ghost &&
          "bg-transparent supports-[backdrop-filter]:bg-transparent backdrop-blur-none",
        sticky ? "sticky top-0" : "relative",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full flex items-center justify-between w-full",
          fluid
            ? containerClassName || "px-0"
            : containerClassName || "container mx-auto px-4",
        )}
      >
        {/* Logo Area */}
        <NavbarBrand asChild>
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity mr-8"
          >
            {logo}
            {appName && <span className="text-xl font-bold">{appName}</span>}
          </Link>
        </NavbarBrand>

        {/* Desktop Navigation */}
        <NavbarContent className="hidden md:flex gap-6 lg:gap-8 ml-8">
          {items.map((item, idx) => (
            <UINavbarItem
              key={idx}
              asChild
              className="bg-transparent hover:bg-transparent p-0 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Link
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
              >
                {item.label}
              </Link>
            </UINavbarItem>
          ))}
        </NavbarContent>

        {/* Right Area (CTA, Theme Toggle, etc) */}
        <NavbarActions className="hidden md:flex gap-4">
          {rightContent}
          {cta && (
            <Button asChild>
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          )}
        </NavbarActions>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden flex items-center gap-4 ml-auto">
          {rightContent && <div className="flex">{rightContent}</div>}
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-6 mt-8">
                <Link
                  href="/"
                  className="font-bold text-lg flex items-center gap-2"
                  onClick={() => setIsMobileOpen(false)}
                >
                  {logo}
                  {appName && <span>{appName}</span>}
                </Link>
                <nav className="flex flex-col gap-4">
                  {items.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                {cta && (
                  <Button asChild size="lg" className="w-full mt-4">
                    <Link
                      href={cta.href}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {cta.label}
                    </Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </UINavbar>
  );
}
