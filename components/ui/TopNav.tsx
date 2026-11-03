"use client";

import Link from "next/link";
import { DrawerType, ModalType } from "@/lib/types";

interface TopNavProps {
    onOpenDrawer: (drawer: DrawerType) => void;
    onOpenModal: (modal: ModalType) => void;
}

const SOCIALS = [
    { label: "GITHUB", href: "https://github.com/Nhutnguyen395" },
    { label: "LINKEDIN", href: "https://linkedin.com/in/nhutnguyen395" },
    { label: "EMAIL", href: "mailto:nhutnguyen395@gmail.com" },
] as const;

const linkClass =
    "group relative text-muted hover:text-ink transition-colors cursor-pointer " +
    "focus-visible:outline-none focus-visible:text-ink focus-visible:underline underline-offset-4";

/** "~/ABOUT" style path link with a blinking cursor on hover */
function PathLink({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <button type="button" onClick={onClick} className={linkClass}>
            <span className="text-neutral-400 group-hover:text-muted transition-colors">~/</span>
            {label}
            <span
                aria-hidden="true"
                className="absolute -right-2.5 opacity-0 group-hover:opacity-100 group-hover:animate-pulse"
            >
                _
            </span>
        </button>
    );
}

export function TopNav({ onOpenDrawer, onOpenModal }: TopNavProps) {
    return (
        <header
            className="fixed top-0 inset-x-0 z-30 px-5 sm:px-8 pt-5 sm:pt-7 pointer-events-none select-none font-mono text-[11px] sm:text-xs tracking-widest uppercase"
        >
            <div className="grid grid-cols-[auto_1fr] md:grid-cols-[1fr_auto_1fr] items-center gap-y-4">
                {/* Top Left: home mark (placeholder until the final icon is chosen) */}
                <Link
                    href="/"
                    aria-label="Nhut Nguyen, home"
                    className="pointer-events-auto justify-self-start text-ink hover:opacity-60 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink rounded-sm"
                >
                    {/* TODO: swap this placeholder mark for the final logo/icon */}
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                        <rect x="1" y="1" width="24" height="24" rx="3" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="13" cy="13" r="3" fill="currentColor" />
                    </svg>
                </Link>

                {/* Center (desktop) / second row (mobile): page links */}
                <nav
                    aria-label="Main Navigation"
                    className="pointer-events-auto col-span-2 row-start-2 md:col-span-1 md:row-start-1 md:col-start-2 flex items-center justify-center gap-6 sm:gap-9"
                >
                    <PathLink label="ABOUT" onClick={() => onOpenDrawer("about")} />
                    <PathLink label="PROJECTS" onClick={() => onOpenDrawer("projects")} />
                    <PathLink label="VAULT" onClick={() => onOpenDrawer("vault")} />
                    <PathLink label="CONTACT" onClick={() => onOpenModal("contact")} />
                </nav>

                {/* Top Right: socials */}
                <div className="pointer-events-auto justify-self-end flex items-center gap-4 sm:gap-6 md:col-start-3">
                    {SOCIALS.map(({ label, href }) => (
                        <a
                            key={label}
                            href={href}
                            {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            className={linkClass}
                        >
                            {label} <span aria-hidden="true">↗</span>
                        </a>
                    ))}
                </div>
            </div>
        </header>
    );
}
