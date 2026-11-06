"use client";

import {
    motion,
    useMotionValue,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
    useSpring,
} from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

/** px between wave crests */
const PERIOD = 820;
/** wave width as a fraction of the strip width (each side of center) */
const AMP_RATIO = 0.3;
/** how far (px) from a checkpoint the trail is pulled straight through its center */
const CALM_RADIUS = 230;

const smoothstep = (t: number) => t * t * (3 - 2 * t);

/**
 * A gently winding path down the strip. Near every anchor (checkpoint, trailhead, finish)
 * the wave flattens out so the trail passes straight through the anchor's center.
 */
function buildPath(w: number, h: number, anchors: number[]) {
    if (!w || !h) return "";
    const cx = w / 2;
    const amp = w * AMP_RATIO;
    const calm = [0, h, ...anchors];
    const step = 8;
    let d = `M ${cx.toFixed(1)} 0`;
    for (let y = step; y < h; y += step) {
        const dist = Math.min(...calm.map((a) => Math.abs(y - a)));
        const env = smoothstep(Math.min(1, Math.max(0, (dist - 30) / CALM_RADIUS)));
        const x = cx + amp * env * Math.sin((y / PERIOD) * Math.PI * 2);
        d += ` L ${x.toFixed(1)} ${y}`;
    }
    return d + ` L ${cx.toFixed(1)} ${h}`;
}

interface TrailProps {
    children: ReactNode;
    className?: string;
}

/**
 * Wraps the journey content and draws a trail behind it that fills in as you scroll,
 * with a marker riding the tip. Any child element with `data-trail-anchor` becomes a
 * point the trail runs straight through (used for checkpoints).
 *
 * The strip is pinned to the left edge on mobile and centered on desktop — children
 * should leave room for it (pl-14 on mobile, a 160px center column on md+).
 */
export function Trail({ children, className }: TrailProps) {
    const reduce = useReducedMotion();
    const wrapRef = useRef<HTMLDivElement>(null);
    const stripRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const [geo, setGeo] = useState({ w: 0, h: 0, d: "" });

    const measure = useCallback(() => {
        const wrap = wrapRef.current;
        const strip = stripRef.current;
        if (!wrap || !strip) return;
        const w = strip.clientWidth;
        const h = wrap.clientHeight;
        const top = wrap.getBoundingClientRect().top;
        const anchors = Array.from(wrap.querySelectorAll<HTMLElement>("[data-trail-anchor]")).map((el) => {
            const r = el.getBoundingClientRect();
            return r.top - top + r.height / 2;
        });
        const d = buildPath(w, h, anchors);
        setGeo((g) => (g.d === d ? g : { w, h, d }));
    }, []);

    useLayoutEffect(() => {
        measure();
        const ro = new ResizeObserver(measure);
        if (wrapRef.current) ro.observe(wrapRef.current);
        if (stripRef.current) ro.observe(stripRef.current);
        return () => ro.disconnect();
    }, [measure]);

    // Progress runs from "trail top reaches 55% of the screen" to "trail bottom reaches 55%".
    const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start 55%", "end 55%"] });
    const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
    const progress = reduce ? scrollYProgress : smooth;

    // Marker follows the tip of the drawn line.
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const place = useCallback(
        (v: number) => {
            const p = pathRef.current;
            if (!p) return;
            const len = p.getTotalLength();
            if (!len) return;
            const pt = p.getPointAtLength(Math.min(1, Math.max(0, v)) * len);
            mx.set(pt.x);
            my.set(pt.y);
        },
        [mx, my],
    );
    useMotionValueEvent(progress, "change", place);
    useEffect(() => place(progress.get()), [geo.d, place, progress]);

    return (
        <div ref={wrapRef} className={`relative ${className ?? ""}`}>
            {/* the trail strip */}
            <div
                ref={stripRef}
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-10 md:left-1/2 md:w-[160px] md:-translate-x-1/2"
            >
                {geo.d && (
                    <svg width={geo.w} height={geo.h} className="absolute inset-0 overflow-visible">
                        {/* faint dotted path still ahead */}
                        <path
                            d={geo.d}
                            fill="none"
                            className="stroke-trail-soft"
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            strokeDasharray="1 10"
                        />
                        {/* path already walked */}
                        <motion.path
                            ref={pathRef}
                            d={geo.d}
                            fill="none"
                            className="stroke-trail"
                            strokeWidth={3}
                            strokeLinecap="round"
                            style={{ pathLength: progress }}
                        />
                    </svg>
                )}

                {/* marker at the tip */}
                <motion.div className="absolute left-0 top-0" style={{ x: mx, y: my }}>
                    <div className="relative size-5 -translate-x-1/2 -translate-y-1/2">
                        <span className="absolute inset-[3px] rounded-full bg-trail ring-[3px] ring-surface shadow-[0_2px_8px_rgba(47,93,70,0.45)]" />
                    </div>
                </motion.div>
            </div>

            <div className="relative z-10">{children}</div>
        </div>
    );
}
