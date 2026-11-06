"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { JourneyStop } from "@/lib/types";
import { Checkpoint } from "./Checkpoint";
import { Trail } from "./Trail";
import { TrailPhoto } from "./TrailPhoto";

interface JourneyTrailProps {
    stops: readonly JourneyStop[];
    outro: string;
}

/** One location: its checkpoint sign followed by its photos. Reports when it's on screen. */
function StopSection({
    stop,
    onActive,
}: {
    stop: JourneyStop;
    onActive: (id: string) => void;
}) {
    const ref = useRef<HTMLElement>(null);
    // "active" = this stop crosses the middle band of the screen
    const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
    useEffect(() => {
        if (inView) onActive(stop.id);
    }, [inView, onActive, stop.id]);

    return (
        <section ref={ref} id={stop.id} aria-labelledby={`${stop.id}-title`} className="scroll-mt-24">
            <Checkpoint stop={stop} />

            {stop.photos.length > 0 && (
                <div className="pl-14 md:pl-0 flex flex-col gap-10 md:gap-0 md:grid md:grid-cols-[minmax(0,1fr)_160px_minmax(0,1fr)] md:gap-x-4 pb-6">
                    {stop.photos.map((photo, i) => (
                        <TrailPhoto key={`${stop.id}-${i}`} photo={photo} index={i} />
                    ))}
                </div>
            )}
        </section>
    );
}

/** Fixed list of checkpoints on wide screens; highlights where you are and jumps on click. */
function Itinerary({ stops, active, visible }: { stops: readonly JourneyStop[]; active: string | null; visible: boolean }) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.nav
                    aria-label="Journey checkpoints"
                    className="hidden xl:flex fixed right-6 2xl:right-10 top-1/2 -translate-y-1/2 z-20 flex-col items-end gap-4"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.35 }}
                >
                    {stops.map((s) => {
                        const on = s.id === active;
                        return (
                            <a
                                key={s.id}
                                href={`#${s.id}`}
                                aria-current={on ? "location" : undefined}
                                className="group flex items-center gap-3 font-mono text-[10px] tracking-[0.18em] uppercase focus-visible:outline-none"
                            >
                                <span
                                    className={
                                        "whitespace-nowrap transition-all duration-300 " +
                                        (on
                                            ? "text-ink opacity-100"
                                            : "text-label opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100")
                                    }
                                >
                                    {s.name}
                                </span>
                                <span
                                    className={
                                        "block rounded-full transition-all duration-300 " +
                                        (on ? "size-3 bg-trail ring-4 ring-trail/15" : "size-2 bg-line group-hover:bg-trail-soft")
                                    }
                                />
                            </a>
                        );
                    })}
                </motion.nav>
            )}
        </AnimatePresence>
    );
}

export function JourneyTrail({ stops, outro }: JourneyTrailProps) {
    const [active, setActive] = useState<string | null>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const onTrail = useInView(wrapRef, { margin: "-40% 0px -40% 0px" });

    return (
        <div ref={wrapRef}>
            <Trail>
                {/* start of the trail */}
                <div data-trail-anchor className="relative h-6" />

                {stops.map((stop) => (
                    <StopSection key={stop.id} stop={stop} onActive={setActive} />
                ))}

                {/* finish */}
                <div data-trail-anchor className="relative pt-20 pb-4 flex md:justify-center">
                    <span
                        aria-hidden="true"
                        className="md:hidden absolute left-5 top-[calc(50%+2rem)] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-trail bg-surface"
                    />
                    <motion.div
                        className="ml-14 md:ml-0 md:bg-[var(--background)] md:px-8 py-3 md:text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <p className="font-serif italic text-2xl sm:text-3xl text-label">{outro}</p>
                    </motion.div>
                </div>
            </Trail>

            <Itinerary stops={stops} active={active} visible={onTrail} />
        </div>
    );
}
