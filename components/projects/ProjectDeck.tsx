"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type { ProjectImage } from "@/lib/types";

/** how many cards peek out behind the front one */
const VISIBLE_BEHIND = 2;
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * A stack of white image cards. Click the stack to send the front card to the back.
 * The first image in the list (the design / architecture diagram) starts on top.
 * The ⤢ button opens the current image full screen.
 */
export function ProjectDeck({
    images,
    projectName,
    eager = false,
}: {
    images: readonly ProjectImage[];
    projectName: string;
    /** load the front image immediately (first project, above the fold) */
    eager?: boolean;
}) {
    const reduce = useReducedMotion();
    const [active, setActive] = useState(0);
    const [zoomed, setZoomed] = useState(false);
    const n = images.length;

    const next = () => setActive((a) => (a + 1) % n);
    const prev = () => setActive((a) => (a - 1 + n) % n);

    // Esc closes the full-screen view; arrows step through images
    useEffect(() => {
        if (!zoomed) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setZoomed(false);
            if (e.key === "ArrowRight") setActive((a) => (a + 1) % n);
            if (e.key === "ArrowLeft") setActive((a) => (a - 1 + n) % n);
        };
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", onKey);
        };
    }, [zoomed, n]);

    if (n === 0) {
        return (
            <div className="flex h-72 sm:h-80 w-full items-center justify-center rounded-lg border border-dashed border-line bg-surface/70">
                <span className="font-mono text-[11px] tracking-widest uppercase text-label">screenshots coming soon</span>
            </div>
        );
    }

    const current = images[active];

    return (
        <div className="flex flex-col gap-3">
            <div className="group relative h-72 sm:h-80 w-full">
                <button
                    type="button"
                    onClick={n > 1 ? next : () => setZoomed(true)}
                    onKeyDown={(e) => {
                        if (n > 1 && e.key === "ArrowLeft") { e.preventDefault(); prev(); }
                        if (n > 1 && e.key === "ArrowRight") { e.preventDefault(); next(); }
                    }}
                    aria-label={
                        n > 1
                            ? `${projectName} image ${active + 1} of ${n}: ${current.alt}. Click for the next image.`
                            : `${projectName}: ${current.alt}. Click to enlarge.`
                    }
                    className={`absolute inset-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 focus-visible:ring-offset-gallery ${n > 1 ? "cursor-pointer" : "cursor-zoom-in"}`}
                >
                    {images.map((img, i) => {
                        const pos = (i - active + n) % n; // 0 = front
                        const behind = Math.min(pos, VISIBLE_BEHIND);
                        const justSentBack = pos === n - 1 && n > 1;
                        return (
                            <motion.div
                                key={img.src}
                                aria-hidden={pos !== 0}
                                className="absolute inset-0 overflow-hidden rounded-lg border border-line bg-surface p-3 sm:p-4 shadow-[0_18px_40px_-12px_rgba(17,17,17,0.18)]"
                                style={{ zIndex: n - pos, transformOrigin: "50% 100%" }}
                                initial={false}
                                animate={{
                                    y: behind * 10,
                                    scale: 1 - behind * 0.035,
                                    opacity: pos > VISIBLE_BEHIND ? 0 : 1,
                                    x: justSentBack && !reduce ? [56, 0] : 0,
                                    rotate: justSentBack && !reduce ? [3, 0] : 0,
                                }}
                                transition={{ duration: reduce ? 0 : 0.45, ease: EASE }}
                            >
                                <div className="relative h-full w-full">
                                    <Image
                                        src={img.src}
                                        alt={img.alt}
                                        fill
                                        sizes="(min-width: 768px) 720px, 100vw"
                                        quality={90}
                                        loading={eager && i === 0 ? "eager" : "lazy"}
                                        draggable={false}
                                        className="object-contain pointer-events-none"
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </button>

                {/* full-screen view */}
                <button
                    type="button"
                    onClick={() => setZoomed(true)}
                    aria-label={`Enlarge ${current.alt}`}
                    className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-md border border-line bg-surface/90 text-muted opacity-0 transition-opacity hover:text-ink group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                    style={{ zIndex: n + 1 }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                </button>
            </div>

            <AnimatePresence>
                {zoomed && (
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label={`${projectName} — ${current.alt}`}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-gallery/95 backdrop-blur-sm p-4 sm:p-10 cursor-zoom-out"
                        onClick={() => setZoomed(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.25 }}
                    >
                        <div className="relative h-full w-full max-w-6xl">
                            <Image src={current.src} alt={current.alt} fill sizes="100vw" quality={95} className="object-contain" />
                        </div>
                        <p className="font-mono text-[11px] tracking-widest uppercase text-label">
                            {current.caption ?? current.alt}
                            {n > 1 && <> · {active + 1}/{n} · ← →</>} · esc to close
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
