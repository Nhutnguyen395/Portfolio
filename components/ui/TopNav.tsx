"use client";

import { DrawerType, ModalType } from "@/lib/types";

interface TopNavProps {
    onOpenDrawer: (drawer: DrawerType) => void;
    onOpenModal: (modal: ModalType) => void;
}

export function TopNav({onOpenDrawer, onOpenModal}: TopNavProps) {
    return (
        <header className="fixed top-6 inset-x-0 z-30 flex justify-center items-center px-4 pointer-events-none">
            <nav 
                className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 p-1.5 bg-surface/90 backdrop-blur-md border border-line rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.05)] text-xs font-mono select-none"
                aria-label="Main Navigation"
            >
                {/* Identity Stamp */}
                <div className="flex items-center gap-2 pl-3.5 pr-3 py-1 text-ink border-r border-line">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold tracking-wider">NHUT NGUYEN</span>
                </div>

                {/* Navigation Action Buttons */}
                <button
                    onClick={() => onOpenDrawer("about")}
                    className="px-3.5 py-1.5 rounded-full hover:bg-neutral-100 text-muted hover:text-ink transition-all cursor-pointer font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                >
                    ABOUT
                </button>

                <button
                    onClick={() => onOpenDrawer("projects")}
                    className="px-3.5 py-1.5 rounded-full hover:bg-neutral-100 text-muted hover:text-ink transition-all flex items-center gap-1 cursor-pointer font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                >
                    <span>PROJECTS</span>
                    <span className="text-[10px] text-neutral-400">[04]</span>
                </button>

                <button
                    onClick={() => onOpenDrawer("vault")}
                    className="px-3.5 py-1.5 rounded-full hover:bg-neutral-100 text-muted hover:text-ink transition-all cursor-pointer font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                >
                    VAULT
                </button>

                <button
                    onClick={() => onOpenModal("contact")}
                    className="px-4 py-1.5 rounded-full bg-ink text-gallery hover:bg-neutral-800 transition-all cursor-pointer font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                >
                    CONTACT
                </button>
            </nav>
      </header>
    );
}