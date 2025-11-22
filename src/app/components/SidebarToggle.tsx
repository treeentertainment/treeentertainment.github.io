"use client";

import { useState } from "react";
import { ThreeBarsIcon, XIcon } from "@primer/octicons-react";

interface SidebarToggleProps {
  children: React.ReactNode;
}

export default function SidebarToggle({ children }: SidebarToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle button - visible when sidebar is closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-md shadow-md transition-colors"
          aria-label="Open sidebar"
        >
          <ThreeBarsIcon size={24} />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`p-4 border-r border-neutral-200 fixed top-0 left-0 h-screen w-64 overflow-y-auto bg-neutral-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } z-40`}
      >
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 p-1 hover:bg-neutral-200 rounded-md transition-colors"
          aria-label="Close sidebar"
        >
          <XIcon size={20} />
        </button>

        {children}
      </aside>
    </>
  );
}
