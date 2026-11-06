"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import type { JourneyPhoto } from "@/lib/types";

/** resting tilts + sideways/vertical nudges, deliberately uneven so it feels hand-placed */
const TILTS = [-2.2, 1.4, -0.6, 2.8, -3.1, 0.9, 1.9, -1.3];
const NUDGE_X = [0, 18, -14, 6, 22, -8, 10, -20];
const NUDGE_Y = [0, 24, 6, 40, 12, 0, 30, 4];
const WIDTH = ["max-w-[400px]", "max-w-[360px]", "max-w-[420px]", "max-w-[380px]", "max-w-[340px]", "max-w-[410px]"];

interface TrailPhotoProps {
    photo: JourneyPhoto;
    index: number;
}

/**
 * A polaroid that pops in beside the trail. Even photos sit left of the trail, odd ones
 * right (desktop), each spanning two grid rows so the two sides stagger.
 */
export function TrailPhoto({ photo, index }: TrailPhotoProps) {
    const reduce = useReducedMotion();
    const left = index % 2 === 0;
    const tilt = TILTS[index % TILTS.length];
    const nx = NUDGE_X[index % NUDGE_X.length] * (left ? -1 : 1);
    const ny = NUDGE_Y[index % NUDGE_Y.length];
    // portrait photos a touch narrower, wide panoramas a touch wider
    const width = WIDTH[index % WIDTH.length];
    const hasCaption = Boolean(photo.caption);

    const placement = {
        "--col": left ? "1" : "3",
        "--row": `${index + 1} / span 2`,
    } as CSSProperties;

    return (
        <div
            style={placement}
            className={`md:[grid-column:var(--col)] md:[grid-row:var(--row)] md:py-8 w-full flex ${left ? "md:justify-end" : "md:justify-start"}`}
        >
            <motion.figure
                className={`m-0 w-full ${width} cursor-default md:[translate:var(--nx)_var(--ny)]`}
                style={{ "--nx": `${nx}px`, "--ny": `${ny}px` } as CSSProperties}
                initial={reduce ? false : { opacity: 0, y: 60, scale: 0.88, rotate: 0, x: left ? 30 : -30 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotate: tilt, x: 0 }}
                whileHover={reduce ? undefined : { rotate: 0, scale: 1.035, y: -6 }}
                viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                transition={{ type: "spring", stiffness: 110, damping: 15 }}
            >
                <div className={`bg-surface p-3 ${hasCaption ? "pb-12" : "pb-3"} shadow-[0_12px_32px_rgba(17,17,17,0.13)] relative`}>
                    <div className="relative w-full overflow-hidden" style={{ aspectRatio: photo.aspect ?? "4 / 3" }}>
                        {photo.src ? (
                            <Image
                                src={photo.src}
                                alt={photo.alt}
                                fill
                                sizes="(min-width: 768px) 400px, 85vw"
                                className="object-cover pointer-events-none"
                                draggable={false}
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gallery border border-dashed border-line text-label">
                                <svg width="40" height="28" viewBox="0 0 40 28" fill="none" aria-hidden="true">
                                    <path d="M1 27 L14 8 L22 19 L27 13 L39 27 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                    <circle cx="31" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                                <span className="font-mono text-[10px] tracking-[0.2em] uppercase">Photo coming soon</span>
                            </div>
                        )}
                    </div>
                    {hasCaption && (
                        <figcaption className="absolute inset-x-0 bottom-3 text-center font-serif italic text-xl text-ink">
                            {photo.caption}
                        </figcaption>
                    )}
                </div>
            </motion.figure>
        </div>
    );
}
