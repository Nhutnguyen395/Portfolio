import Image from "next/image";
import type { Movie } from "@/lib/types";
import styles from "./tapes.module.css";

const SHELLS = [styles.shellBlack, styles.shellClear, styles.shellCream, styles.shellBlue, styles.shellCharcoal, styles.shellRed, styles.shellGreen, styles.shellSmoke];
const LENGTHS = ["C60", "C90", "SA90", "AR60", "D90"];

/** stand-in colours until a poster is added */
const TINTS = [
    ["#f08a24", "#3a1b0b"], ["#b3141c", "#2a0507"], ["#7fb7c9", "#c4473a"], ["#ff4fa3", "#1a0f2e"],
    ["#3f5b3a", "#0e120d"], ["#f2a6b8", "#7a2a4a"], ["#2b59c3", "#e0457b"], ["#d9a066", "#4a2d17"],
    ["#2bb39b", "#f2d03b"], ["#5b3ea6", "#f4c54a"], ["#9aa5a8", "#2a2f33"], ["#e8553e", "#f6c9a8"],
];

export interface TapeLook {
    shell: string;
    look: "classic" | "poster";
    length: string;
    side: "A" | "B";
    tint: string;
}

/** small seeded random so the wall is scattered but looks the same on every visit */
function seeded(seed: number) {
    let a = seed + 0x6d2b79f5;
    return () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/** pick from `options`, avoiding anything in `avoid` when possible */
function pick<T>(rand: () => number, options: readonly T[], avoid: readonly (T | undefined)[]): T {
    const ok = options.filter((o) => !avoid.includes(o));
    const pool = ok.length ? ok : options;
    return pool[Math.floor(rand() * pool.length)];
}

/**
 * Scatter the tape styles across the wall: each tape gets a random shell, label
 * style, colour and length, never matching the tape to its left or the one above it.
 */
export function scatterLooks(movies: readonly Movie[], cols: number): TapeLook[] {
    const looks: TapeLook[] = [];
    movies.forEach((movie, n) => {
        const rand = seeded(n * 97 + 13);
        const left = n % cols ? looks[n - 1] : undefined;
        const up = looks[n - cols];
        const [a, b] = pick(rand, TINTS, [TINTS.find((t) => left?.tint.includes(t[0])), TINTS.find((t) => up?.tint.includes(t[0]))]);
        looks.push({
            shell: pick(rand, SHELLS, [left?.shell, up?.shell]),
            // roughly 1 in 4 tapes use the poster as the whole label, never two touching
            look: movie.look ?? (left?.look === "poster" || up?.look === "poster" ? "classic" : rand() < 0.3 ? "poster" : "classic"),
            length: pick(rand, LENGTHS, [left?.length]),
            side: rand() < 0.5 ? "A" : "B",
            tint: `linear-gradient(155deg, ${a}, ${b})`,
        });
    });
    return looks;
}

interface TapeProps {
    movie: Movie;
    look: TapeLook;
    /** reels turning (hover on the wall, always in the detail card) */
    spinning?: boolean;
    /** next/image sizes hint for the poster crop */
    sizes?: string;
}

/** A cassette tape with a film on its label. Fills its parent box. */
export function Tape({ movie, look: t, spinning = false, sizes = "120px" }: TapeProps) {
    const art = movie.poster ? (
        <Image src={movie.poster} alt="" fill sizes={sizes} className="object-cover" draggable={false} />
    ) : null;

    return (
        <div className={styles.frame}>
            <div
                className={[styles.tape, t.shell, t.look === "poster" ? styles.lookPoster : "", spinning ? styles.spinning : ""].join(" ")}
                style={{ "--tint": t.tint } as React.CSSProperties}
            >
                <div className={styles.label}>
                    {t.look === "poster" && <div className={styles.labelArt}>{art}</div>}
                    <div className={styles.sticker}>
                        <span className={styles.side}>{t.side}</span>
                        <span className={styles.title}>{movie.title}</span>
                        <span className={styles.year}>&apos;{String(movie.year).slice(2)}</span>
                    </div>
                    <div className={styles.window}>
                        <div className={styles.reel} />
                        {t.look === "classic" && <div className={styles.peek}>{art}</div>}
                        <div className={styles.reel} />
                    </div>
                    <span className={styles.brand}>{movie.directorShort ?? movie.director.split(" ").pop()}</span>
                    <span className={styles.length}>{t.length}</span>
                </div>
                <div className={styles.foot}><i /><i /><i /><i /></div>
            </div>
        </div>
    );
}
