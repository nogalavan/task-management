import { cn } from "@/utils/cn";

type SpinnerSize = "sm" | "md" | "lg" | "xl";

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  className?: string;
  label?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-3",
  xl: "h-16 w-16 border-4",
};

function LoadingSpinner({
  size = "md",
  className,
  label = "טוען...",
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-3", className)}
      role="status"
      aria-label={label}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-amber/30 border-t-amber",
          sizeClasses[size]
        )}
      />
      {label && <p className="text-sm text-stone-500 animate-pulse">{label}</p>}
    </div>
  );
}

function PageLoader() {
  return (
    <div className="flex h-full min-h-[400px] w-full items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}

export { LoadingSpinner, PageLoader };
export type { LoadingSpinnerProps };
