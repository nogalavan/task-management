import { cn } from "@/utils/cn";
import { HTMLAttributes } from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "outline";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-warm text-amber border border-amber/30",
  success: "bg-sage/30 text-green-800 border border-sage",
  warning: "bg-amber/20 text-amber-800 border border-amber/40",
  danger: "bg-red-100 text-red-700 border border-red-200",
  info: "bg-blue-100 text-blue-700 border border-blue-200",
  outline: "bg-transparent text-stone-600 border border-stone-300",
};

function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
export type { BadgeProps, BadgeVariant };
