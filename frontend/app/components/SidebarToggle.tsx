"use client";

import { useSidebarStore } from "@/store/sidebarStore";
import { PanelLeft, PanelRight } from "lucide-react";

export default function SidebarToggle() {
  const { isOpen, toggle } = useSidebarStore();

  return (
    <button
      onClick={toggle}
      className={`fixed top-1/2 -translate-y-1/2 z-50 p-2 bg-card-bg border-y border-r border-border rounded-r-lg transition-transform duration-300
        ${isOpen ? "translate-x-[250px] md:translate-x-0" : "translate-x-0"}
      `}
      aria-label="Toggle Sidebar"
    >
      {isOpen ? (
        <PanelLeft size={20} className="text-muted-accent" />
      ) : (
        <PanelRight size={20} className="text-muted-accent" />
      )}
    </button>
  );
}
