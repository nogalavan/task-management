import { cn } from "@/utils/cn";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-8",
        className
      )}
    >
      <div>
        <h1 className="text-2xl font-bold text-stone-800 leading-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-stone-500 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 mt-3 sm:mt-0 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}

export { PageHeader };
export type { PageHeaderProps };
