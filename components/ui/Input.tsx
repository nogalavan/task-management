import { cn } from "@/utils/cn";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id ?? label;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-stone-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
              {rightIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full h-10 rounded-xl border bg-cream px-3 text-sm text-stone-800",
              "placeholder:text-stone-400",
              "transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber",
              error
                ? "border-red-400 focus:ring-red-300/40 focus:border-red-400"
                : "border-amber/30 hover:border-amber/50",
              rightIcon && "pr-10",
              leftIcon && "pl-10",
              className
            )}
            {...props}
          />
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
              {leftIcon}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-stone-400">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
