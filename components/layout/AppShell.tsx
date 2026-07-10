"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useSidebar } from "@/hooks/useSidebar";

interface AppShellProps {
  children: React.ReactNode;
  userName: string;
}

export function AppShell({ children, userName }: AppShellProps) {
  const { isOpen, isMobile, toggle, close } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      <Sidebar isOpen={isOpen} isMobile={isMobile} onClose={close} />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Navbar onMenuToggle={toggle} userName={userName} />

        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-5 md:p-8"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
