"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  User,
  Settings,
  X,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: "לוח ראשי", href: "/dashboard", icon: LayoutDashboard },
  { label: "פרויקטים", href: "/projects", icon: FolderKanban },
  { label: "משימות", href: "/tasks", icon: CheckSquare },
  { label: "פרופיל", href: "/profile", icon: User },
  { label: "הגדרות", href: "/settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
}

function Sidebar({ isOpen, isMobile, onClose }: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <aside
      className={cn(
        "flex h-full w-64 flex-col bg-sage-light border-l border-amber/20",
        "shadow-[2px_0_24px_0_rgba(212,163,115,0.10)]",
        "transition-transform duration-300 ease-in-out"
      )}
      aria-label="ניווט ראשי"
    >
      {/* Sidebar header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-amber/20">
        <span className="text-sm font-semibold text-stone-600 uppercase tracking-wider">
          תפריט
        </span>
        {isMobile ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="סגור תפריט"
          >
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="כווץ תפריט"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3" aria-label="דפים">
        <ul role="list" className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={isMobile ? onClose : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber",
                    isActive
                      ? "bg-amber text-white shadow-sm"
                      : "text-stone-600 hover:bg-warm hover:text-stone-800"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0 transition-colors",
                      isActive
                        ? "text-white"
                        : "text-stone-400 group-hover:text-amber"
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar footer */}
      <div className="border-t border-amber/20 p-4">
        <div className="rounded-xl bg-warm p-3">
          <p className="text-xs font-medium text-stone-700">גרסה 1.0.0</p>
          <p className="text-xs text-stone-400 mt-0.5">מערכת ניהול משימות</p>
        </div>
      </div>
    </aside>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
        {/* Mobile drawer sliding from right */}
        <div
          className={cn(
            "fixed inset-y-0 right-0 z-50 transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {sidebarContent}
        </div>
      </>
    );
  }

  return (
    <div
      className={cn(
        "hidden md:flex flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden",
        isOpen ? "w-64" : "w-0"
      )}
    >
      {sidebarContent}
    </div>
  );
}

export { Sidebar };
