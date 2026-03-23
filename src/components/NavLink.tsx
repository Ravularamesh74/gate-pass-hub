import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "sidebar" | "pill";

interface NavLinkPropsEx extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;

  variant?: Variant;
  exact?: boolean;

  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  default: "text-sm font-medium transition-colors",
  sidebar: "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
  pill: "px-4 py-1.5 rounded-full text-sm font-medium transition",
};

const activeStyles: Record<Variant, string> = {
  default: "text-primary",
  sidebar: "bg-primary text-white shadow",
  pill: "bg-primary text-white",
};

const inactiveStyles: Record<Variant, string> = {
  default: "text-muted-foreground hover:text-foreground",
  sidebar: "text-muted-foreground hover:bg-muted hover:text-foreground",
  pill: "text-muted-foreground hover:bg-muted",
};

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkPropsEx>(
  (
    {
      className,
      activeClassName,
      pendingClassName,
      to,
      variant = "default",
      exact = false,
      icon,
      badge,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        end={exact}
        className={({ isActive, isPending }) =>
          cn(
            variantStyles[variant],
            isActive ? activeStyles[variant] : inactiveStyles[variant],
            className,
            isActive && activeClassName,
            isPending && pendingClassName
          )
        }
        {...props}
      >
        {(renderProps) => (
          <span className="flex items-center justify-between w-full">
            <span className="flex items-center gap-2">
              {icon && (
                <span
                  className={cn(
                    "transition-transform",
                    renderProps.isActive && "scale-110"
                  )}
                >
                  {icon}
                </span>
              )}
              {typeof children === "function"
                ? children(renderProps)
                : children}
            </span>

            {badge && (
              <span className="text-xs px-2 py-0.5 rounded bg-muted">
                {badge}
              </span>
            )}
          </span>
        )}
      </RouterNavLink>
    );
  }
);

NavLink.displayName = "NavLink";