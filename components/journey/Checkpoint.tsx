"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { JourneyStop } from "@/lib/types";

interface CheckpointProps {
    stop: JourneyStop;
}

/** The "Welcome to …" sign the trail runs through at the start of each location. */
export function Checkpoint({ stop }: CheckpointProps) {
    const reduce = useReducedMotion();
    const meta = [stop.region, stop.date].filter(Boolean);

    return (
        <div data-trail-anchor className="relative py-16 md:py-24">
            {/* mobile: pin on the left-hand trail */}
            <span
                aria-hidden="true"
                className="md:hidden absolute left-5 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-surface border-[3px] border-trail"
            />

            <motion.div
                className="ml-14 md:mx-auto w-fit max-w-[calc(100%-3.5rem)] md:max-w-[560px]"
                initial={reduce ? false : { opacity: 0, y: 40, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "0px 0px -20% 0px" }}
                transition={{ type: "spring", stiffness: 120, damping: 16 }}
            >
                <div className="relative bg-surface border border-line shadow-[0_14px_40px_rgba(17,17,17,0.10)] px-7 py-7 sm:px-10 sm:py-9 md:text-center">
                    <p className="font-serif italic text-xl sm:text-2xl text-label">Welcome to</p>
                    <h2 id={`${stop.id}-title`} className="font-display font-bold text-[40px] sm:text-[56px] md:text-[64px] leading-[0.95] tracking-tight text-ink">
                        {stop.name}
                    </h2>
                    {stop.kicker && (
                        <p className="mt-2 font-mono text-xs sm:text-[13px] tracking-[0.3em] uppercase text-subtle">{stop.kicker}</p>
                    )}

                    {meta.length > 0 && (
                        <p className="mt-6 pt-4 border-t border-dashed border-line font-mono text-[10px] sm:text-[11px] tracking-[0.14em] uppercase text-label flex flex-wrap gap-x-3 gap-y-1 md:justify-center">
                            {meta.map((m, i) => (
                                <span key={m}>
                                    {i > 0 && <span aria-hidden="true" className="hidden md:inline mr-3 text-line">·</span>}
                                    {m}
                                </span>
                            ))}
                        </p>
                    )}

                    {stop.note && <p className="mt-4 text-[15px] leading-relaxed text-subtle max-w-md md:mx-auto">{stop.note}</p>}
                </div>

                {/* sign posts (desktop) */}
                <div aria-hidden="true" className="hidden md:flex justify-between px-14">
                    <span className="w-2 h-10 bg-line" />
                    <span className="w-2 h-10 bg-line" />
                </div>
            </motion.div>
        </div>
    );
}
