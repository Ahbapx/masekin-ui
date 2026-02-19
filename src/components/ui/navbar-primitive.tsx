"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const navbarVariants = cva(
  "flex bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border z-50",
  {
    variants: {
      orientation: {
        horizontal:
          "h-14 w-full items-center border-b px-4 md:px-6 top-0 justify-between gap-4",
        vertical: "h-full w-64 flex-col border-r py-6 px-4 left-0 gap-6",
        rail: "h-full w-20 flex-col items-center border-r py-6 px-2 left-0 gap-4",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
);

export interface NavbarProps
  extends
    React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof navbarVariants> {
  asChild?: boolean;
}

const NavbarContext = React.createContext<{
  orientation: "horizontal" | "vertical" | "rail";
}>({
  orientation: "horizontal",
});

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  (
    { className, orientation = "horizontal", asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "nav";
    return (
      <NavbarContext.Provider value={{ orientation: orientation as any }}>
        <Comp
          ref={ref}
          className={cn(navbarVariants({ orientation, className }))}
          {...props}
        />
      </NavbarContext.Provider>
    );
  },
);
Navbar.displayName = "Navbar";

export interface NavbarBrandProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const NavbarBrand = React.forwardRef<HTMLDivElement, NavbarBrandProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn("flex items-center gap-2 font-bold shrink-0", className)}
        {...props}
      />
    );
  },
);
NavbarBrand.displayName = "NavbarBrand";

export interface NavbarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const NavbarContent = React.forwardRef<HTMLDivElement, NavbarContentProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const { orientation } = React.useContext(NavbarContext);
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn(
          "flex items-center gap-1",
          orientation === "horizontal"
            ? "flex-row"
            : "flex-col items-center w-full",
          className,
        )}
        {...props}
      />
    );
  },
);
NavbarContent.displayName = "NavbarContent";

export interface NavbarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  active?: boolean;
}

const NavbarItem = React.forwardRef<HTMLDivElement, NavbarItemProps>(
  ({ className, active, asChild = false, ...props }, ref) => {
    const { orientation } = React.useContext(NavbarContext);
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn(
          "px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all cursor-pointer select-none",
          orientation === "rail"
            ? "flex-col w-full px-1 py-3 text-[10px] gap-1.5 text-center justify-center rounded-xl"
            : "",
          active
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          className,
        )}
        {...props}
      />
    );
  },
);
NavbarItem.displayName = "NavbarItem";

export interface NavbarActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const NavbarActions = React.forwardRef<HTMLDivElement, NavbarActionsProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const { orientation } = React.useContext(NavbarContext);
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn(
          "flex items-center gap-2",
          orientation === "horizontal"
            ? "ml-auto flex-row"
            : "mt-auto flex-col w-full",
          className,
        )}
        {...props}
      />
    );
  },
);
NavbarActions.displayName = "NavbarActions";

export { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarActions };
