import { cn } from "@/utils/cn";
import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const textareaId = id ?? label;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-stone-700"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={4}
          className={cn(
            "w-full rounded-xl border bg-cream px-3 py-2.5 text-sm text-stone-800",
            "placeholder:text-stone-400 resize-none",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber",
            error
              ? "border-red-400 focus:ring-red-300/40 focus:border-red-400"
              : "border-amber/30 hover:border-amber/50",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-stone-400">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
export type { TextareaProps };
