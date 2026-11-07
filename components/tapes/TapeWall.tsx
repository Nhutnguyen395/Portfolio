"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Movie } from "@/lib/types";
import { Tape, scatterLooks } from "./Tape";
import { marker, stamp } from "./fonts";

/** the tape's natural proportions (a real cassette is ~100 × 63 mm) */
const BASE_W = 196;
const BASE_H = 124;
/** roughly how wide a tape should be on screen; smaller = more tapes */
const TARGET_W = { desktop: 190, phone: 118 };

interface Grid {
    cols: number;
    rows: number;
    tapeW: number;
    tapeH: number;
    gap: number;
    top: number;
}

/**
 * Fit whole tapes edge to edge under the navbar: pick the column count closest to
 * the target tape width, then the row count, and stretch the tapes a touch so the
 * last row lands exactly on the bottom edge.
 */
function measureGrid(): Grid {
    const nav = document.querySelector<HTMLElement>("[data-topnav]");
    const top = nav ? Math.ceil(nav.getBoundingClientRect().height) : 72;
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const phone = vw < 760;
    const gap = phone ? 6 : 10;
    const target = phone ? TARGET_W.phone : TARGET_W.desktop;

    const w = vw - gap * 2;
    const h = vh - top - gap;
    const cols = Math.max(2, Math.round((w + gap) / (target + gap)));
    const tapeW = (w - (cols - 1) * gap) / cols;
    const idealH = (tapeW * BASE_H) / BASE_W;
    const rows = Math.max(2, Math.round((h + gap) / (idealH + gap)));
    const tapeH = (h - (rows - 1) * gap) / rows;
    return { cols, rows, tapeW, tapeH, gap, top };
}

/** seconds between one tape landing and the next */
const DROP_STEP = 0.055;

/** a fresh random drop order for each visit: rank[slot] = when that tape drops (0 = first) */
function randomDropOrder(count: number): number[] {
    const slots = Array.from({ length: count }, (_, i) => i);
    for (let i = count - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [slots[i], slots[j]] = [slots[j], slots[i]];
    }
    const rank: number[] = [];
    slots.forEach((slot, r) => (rank[slot] = r));
    return rank;
}

/** tiny resting tilt per tape so the wall feels hand-stacked */
const tilt = (n: number) => (((n * 37) % 7) - 3) * 0.18;

export function TapeWall({ movies }: { movies: readonly Movie[] }) {
    const reduce = useReducedMotion();
    const [grid, setGrid] = useState<Grid | null>(null);
    const [dropRank, setDropRank] = useState<number[]>([]);
    const [hovered, setHovered] = useState<number | null>(null);
    const [open, setOpen] = useState<number | null>(null);
    const tapeRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const closeRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        let t: ReturnType<typeof setTimeout>;
        const update = () => {
            const g = measureGrid();
            setGrid(g);
            // shuffle once on load; tapes added later by a resize just appear
            setDropRank((prev) => (prev.length ? prev : randomDropOrder(g.cols * g.rows)));
        };
        const onResize = () => {
            clearTimeout(t);
            t = setTimeout(update, 120);
        };
        update();
        window.addEventListener("resize", onResize);
        return () => {
            clearTimeout(t);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    // Esc closes the detail card; focus goes back to the tape that opened it
    useEffect(() => {
        if (open === null) return;
        closeRef.current?.focus();
        const opener = tapeRefs.current[open];
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("keydown", onKey);
            opener?.focus({ preventScroll: true });
        };
    }, [open]);

    if (!grid || movies.length === 0) return null;

    // more slots than films → loop the list
    const slots = Array.from({ length: grid.cols * grid.rows }, (_, n) => movies[n % movies.length]);
    const looks = scatterLooks(slots, grid.cols);
    const active = open !== null ? slots[open] : null;

    return (
        <div className={`${marker.variable} ${stamp.variable}`}>
            <ul
                aria-label="Favorite films"
                className="fixed grid"
                style={{
                    top: grid.top,
                    left: grid.gap,
                    gridTemplateColumns: `repeat(${grid.cols}, ${grid.tapeW}px)`,
                    gridAutoRows: `${grid.tapeH}px`,
                    gap: grid.gap,
                }}
            >
                {slots.map((movie, n) => {
                    const rank = dropRank[n];
                    return (
                        <motion.li
                            key={n}
                            className="relative"
                            style={{ zIndex: hovered === n ? 5 : undefined }}
                            // drops in from above one at a time, in random order, with a small bounce on landing
                            initial={reduce || rank === undefined ? false : { opacity: 0, y: -48, scale: 1.05 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                                delay: (rank ?? 0) * DROP_STEP,
                                y: { type: "spring", stiffness: 520, damping: 26, delay: (rank ?? 0) * DROP_STEP },
                                scale: { type: "spring", stiffness: 520, damping: 26, delay: (rank ?? 0) * DROP_STEP },
                                opacity: { duration: 0.12, delay: (rank ?? 0) * DROP_STEP },
                            }}
                        >
                            <motion.button
                                ref={(el) => {
                                    tapeRefs.current[n] = el;
                                }}
                                type="button"
                                aria-label={`${movie.title} (${movie.year})`}
                                className="absolute inset-0 text-left cursor-pointer rounded-[4%] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                                animate={{ rotate: tilt(n), opacity: open === n ? 0.15 : 1 }}
                                whileHover={reduce ? undefined : { y: -6, scale: 1.04, rotate: 0 }}
                                transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                                onHoverStart={() => setHovered(n)}
                                onHoverEnd={() => setHovered((h) => (h === n ? null : h))}
                                onFocus={() => setHovered(n)}
                                onBlur={() => setHovered((h) => (h === n ? null : h))}
                                onClick={() => setOpen(n)}
                            >
                                <Tape movie={movie} look={looks[n]} spinning={hovered === n} sizes="60px" />
                            </motion.button>
                        </motion.li>
                    );
                })}
            </ul>

            {/* soft vignette, like light falling on a shelf */}
            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0"
                style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 60%, rgba(60,45,25,.14) 100%)" }}
            />

            <AnimatePresence>
                {active && open !== null && (
                    <motion.div
                        key="detail"
                        className="fixed inset-0 z-50 grid place-items-center bg-[rgba(25,20,14,.45)] backdrop-blur-[4px] p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={(e) => e.target === e.currentTarget && setOpen(null)}
                    >
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="tape-title"
                            className="relative grid w-full max-w-[680px] max-h-[90vh] overflow-auto grid-cols-1 sm:grid-cols-[220px_1fr] items-center gap-6 sm:gap-7 rounded-2xl border border-line bg-gallery p-6 sm:p-7 shadow-[0_30px_80px_rgba(0,0,0,.35)]"
                            initial={reduce ? false : { y: 30, scale: 0.97 }}
                            animate={{ y: 0, scale: 1 }}
                            exit={reduce ? undefined : { y: 20, scale: 0.98 }}
                            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                        >
                            <button
                                ref={closeRef}
                                type="button"
                                onClick={() => setOpen(null)}
                                className="absolute top-3.5 right-4 font-mono text-[11px] tracking-widest text-muted hover:text-ink transition-colors cursor-pointer"
                            >
                                ESC ✕
                            </button>

                            <div
                                className="relative mx-auto w-full max-w-[200px] sm:max-w-none aspect-[2/3] overflow-hidden rounded-lg shadow-[0_10px_24px_rgba(0,0,0,.25)]"
                                style={{ background: looks[open].tint }}
                            >
                                {active.poster ? (
                                    <Image src={active.poster} alt={`${active.title} poster`} fill sizes="220px" className="object-cover" />
                                ) : (
                                    <span className="absolute inset-x-4 bottom-4 font-serif text-[28px] leading-none text-white">
                                        {active.title}
                                    </span>
                                )}
                            </div>

                            <div className="min-w-0">
                                <div className="mb-5 w-full max-w-[330px] aspect-[196/124]">
                                    <Tape movie={active} look={looks[open]} spinning sizes="120px" />
                                </div>
                                <h2 id="tape-title" className="font-serif text-[38px] leading-none text-ink">
                                    {active.title}
                                </h2>
                                <p className="mt-2.5 font-mono text-[11px] tracking-wider uppercase text-muted">
                                    {active.year} · dir. {active.director}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
