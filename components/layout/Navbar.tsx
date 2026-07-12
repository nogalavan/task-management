"use client";

import { Menu, LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { logout } from "@/app/actions/auth";
import { useTransition } from "react";

interface NavbarProps {
  onMenuToggle?: () => void;
  userName: string;
}

function Navbar({ onMenuToggle, userName }: NavbarProps) {
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logout();
    });
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-amber/20 bg-cream/95 backdrop-blur-sm px-4 md:px-6 shadow-[0_2px_16px_0_rgba(212,163,115,0.10)]">
      {/* Right side: logo + menu toggle */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuToggle}
          aria-label="תפריט"
          className=""
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber shadow-sm">
            <span className="text-white font-bold text-sm">מ</span>
          </div>
          <span className="font-bold text-stone-800 text-base hidden sm:inline">
            ניהול משימות
          </span>
        </div>
      </div>

      {/* Left side: actions + avatar + logout */}
      <div className="flex items-center gap-1.5">
        {/* User avatar */}
        <div className="mr-1 flex items-center gap-2">
          <Avatar name={userName} size="sm" />
          <span className="hidden md:block text-sm font-medium text-stone-700 max-w-[120px] truncate">
            {userName}
          </span>
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          disabled={isPending}
          aria-label="התנתקות"
          title="התנתקות"
        >
          <LogOut className="h-4 w-4 text-stone-500" />
        </Button>
      </div>
    </header>
  );
}

export { Navbar };
