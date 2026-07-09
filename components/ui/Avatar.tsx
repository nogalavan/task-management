import { cn } from "@/utils/cn";
import Image from "next/image";
import { getInitials } from "@/utils/formatters";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  name?: string;
  src?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

const sizeNumbers: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

function Avatar({ name = "", src, size = "md", className }: AvatarProps) {
  const initials = getInitials(name);
  const px = sizeNumbers[size];

  if (src) {
    return (
      <div
        className={cn(
          "relative rounded-full overflow-hidden flex-shrink-0 ring-2 ring-amber/20",
          sizeClasses[size],
          className
        )}
      >
        <Image
          src={src}
          alt={name}
          width={px}
          height={px}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full flex-shrink-0",
        "bg-amber/20 text-amber font-semibold ring-2 ring-amber/20",
        sizeClasses[size],
        className
      )}
      aria-label={name}
      title={name}
    >
      {initials}
    </div>
  );
}

interface AvatarGroupProps {
  users: Array<{ name: string; src?: string }>;
  max?: number;
  size?: AvatarSize;
}

function AvatarGroup({ users, max = 3, size = "sm" }: AvatarGroupProps) {
  const visible = users.slice(0, max);
  const rest = users.length - max;

  return (
    <div className="flex flex-row-reverse -space-x-2 space-x-reverse">
      {visible.map((user, i) => (
        <Avatar
          key={i}
          name={user.name}
          src={user.src}
          size={size}
          className="ring-2 ring-cream"
        />
      ))}
      {rest > 0 && (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-sage-light text-stone-600 text-xs font-medium ring-2 ring-cream",
            sizeClasses[size]
          )}
        >
          +{rest}
        </div>
      )}
    </div>
  );
}

export { Avatar, AvatarGroup };
export type { AvatarProps, AvatarSize };
