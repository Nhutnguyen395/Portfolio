"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { CollageItem } from "@/lib/types";

/** width / height of the collage box; taller = photos spread further down */
const COLLAGE_ASPECT = "27 / 50";

const SPRING = { type: "spring", stiffness: 300, damping: 22 } as const;

function CollagePiece({ item }: { item: CollageItem }) {
    switch (item.kind) {
        case "polaroid":
            return (
                <figure className="relative m-0 bg-surface p-2.5 pb-10 sm:p-3 sm:pb-12 shadow-[0_10px_30px_rgba(17,17,17,0.14)]">
                    <div className="relative w-full overflow-hidden" style={{ aspectRatio: item.aspect ?? "4 / 3" }}>
                        <Image
                            src={item.src}
                            alt={item.alt}
                            fill
                            sizes="(min-width: 1024px) 340px, 60vw"
                            className="object-cover pointer-events-none"
                            draggable={false}
                        />
                    </div>
                    <figcaption className="absolute inset-x-0 bottom-2.5 sm:bottom-3 text-center font-serif italic text-lg sm:text-xl text-ink">
                        {item.caption}
                    </figcaption>
                </figure>
            );

        case "stamp":
            return (
                <div className="bg-surface p-1.5 border-[6px] border-dotted border-gallery outline outline-1 outline-line shadow-[0_6px_18px_rgba(17,17,17,0.12)]">
                    <div className="relative w-full aspect-[3/4] overflow-hidden">
                        <Image
                            src={item.src}
                            alt={item.alt}
                            fill
                            sizes="140px"
                            className="object-cover pointer-events-none"
                            draggable={false}
                        />
                    </div>
                </div>
            );

        case "ticket":
            return (
                <div className="flex bg-ink text-gallery shadow-[0_8px_22px_rgba(17,17,17,0.22)]">
                    <div className="flex-1 flex flex-col gap-1 px-3.5 py-3 border-r border-dashed border-muted">
                        <span className="font-mono text-[9px] tracking-[0.2em] text-neutral-300">ADMIT ONE</span>
                        <span className="font-serif text-lg sm:text-xl leading-none">{item.title}</span>
                        <span className="font-mono text-[9px] tracking-[0.14em] text-neutral-300">{item.detail}</span>
                    </div>
                    <div className="w-8 flex items-center justify-center font-mono text-[9px] tracking-[0.2em] text-neutral-300 [writing-mode:vertical-rl]">
                        {item.number}
                    </div>
                </div>
            );
    }
}

/**
 * A pile of photos / tickets / stamps that drop in on load.
 * Hovering a piece straightens and lifts it; clicking brings it to the front.
 */
export function Collage({ items }: { items: readonly CollageItem[] }) {
    const reduce = useReducedMotion();
    // stacking order: last index = on top
    const [order, setOrder] = useState<number[]>(() => items.map((_, i) => i));

    const bringToFront = (i: number) =>
        setOrder((prev) => [...prev.filter((x) => x !== i), i]);

    return (
        <div className="w-full max-w-[560px] mx-auto lg:mx-0">
            <div
                role="group"
                aria-label="Photo collage"
                className="relative w-full"
                // inline so it never depends on Tailwind generating the class
                style={{ aspectRatio: COLLAGE_ASPECT }}
            >
                {items.map((item, i) => (
                    <motion.div
                        key={i}
                        className="absolute cursor-pointer select-none"
                        style={{
                            left: `${item.x}%`,
                            top: `${item.y}%`,
                            width: `${item.w}%`,
                            zIndex: order.indexOf(i) + 1,
                        }}
                        onClick={() => bringToFront(i)}
                        initial={reduce ? false : { opacity: 0, y: -30, scale: 1.08, rotate: 0 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            rotate: item.rotate,
                            transition: { ...SPRING, stiffness: 170, damping: 18, delay: 0.1 + i * 0.09 },
                        }}
                        whileHover={reduce ? undefined : { scale: 1.04, rotate: 0 }}
                        transition={SPRING}
                    >
                        <CollagePiece item={item} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
