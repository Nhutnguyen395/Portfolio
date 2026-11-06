"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/** Fixed number rail on the left (large screens). Highlights the project in view; click to jump. */
export function ProjectIndex({ ids }: { ids: readonly string[] }) {
    const reduce = useReducedMotion();
    const [current, setCurrent] = useState(ids[0]);

    useEffect(() => {
        const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
        const io = new IntersectionObserver(
            (entries) => {
                const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
                if (hit) setCurrent(hit.target.id);
            },
            // a thin band across the upper-middle of the screen decides which project is "current"
            { rootMargin: "-35% 0px -60% 0px" },
        );
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, [ids]);

    return (
        <motion.nav
            aria-label="Projects"
            className="fixed left-10 xl:left-12 top-1/3 -translate-y-1/2 z-20 hidden lg:block"
            initial={reduce ? false : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        >
            <ul className="flex flex-col gap-4">
                {ids.map((id, i) => {
                    const on = id === current;
                    return (
                        <li key={id}>
                            <a
                                href={`#${id}`}
                                aria-current={on ? "true" : undefined}
                                className={`group flex items-center gap-3 font-mono text-sm tabular-nums transition-colors duration-300 focus-visible:outline-none focus-visible:underline ${on ? "text-ink" : "text-muted hover:text-subtle"}`}
                            >
                                <span className={`h-px transition-all duration-300 ${on ? "w-6 bg-ink" : "w-3 bg-line group-hover:w-5 group-hover:bg-muted"}`} />
                                {String(i + 1).padStart(2, "0")}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </motion.nav>
    );
}
