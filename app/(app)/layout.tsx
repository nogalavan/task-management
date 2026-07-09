"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useSidebar } from "@/hooks/useSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isOpen, isMobile, toggle, close } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      {/* Sidebar on the right (RTL start) */}
      <Sidebar isOpen={isOpen} isMobile={isMobile} onClose={close} />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Navbar onMenuToggle={toggle} />

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
