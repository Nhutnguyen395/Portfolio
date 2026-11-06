"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
    children: ReactNode;
    /** seconds to wait before animating in */
    delay?: number;
    className?: string;
    /** slide in horizontally from this many px instead of lifting up */
    x?: number;
}

/** Fades + lifts its children into place the first time they scroll into view. */
export function Reveal({ children, delay = 0, className, x }: RevealProps) {
    const reduce = useReducedMotion();

    return (
        <motion.div
            className={className}
            initial={reduce ? false : x !== undefined ? { opacity: 0, x } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -80px 0px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
        >
            {children}
        </motion.div>
    );
}
