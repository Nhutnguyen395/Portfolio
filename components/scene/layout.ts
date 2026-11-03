import * as THREE from "three";

export interface CardFootprint {
    /** card width / height in world units */
    w: number;
    h: number;
}

const PHI = Math.PI * (3 - Math.sqrt(5));

/** Evenly spread sample points on the unit sphere (Fibonacci lattice) */
function fibonacciPoints(count: number): THREE.Vector3[] {
    return Array.from({ length: count }, (_, i) => {
        const y = 1 - ((i + 0.5) / count) * 2;
        const r = Math.sqrt(1 - y * y);
        const t = PHI * i;
        return new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r);
    });
}

/**
 * Pass 1 — fill the empty pockets (size-weighted Lloyd relaxation).
 * Every bit of the sphere's surface is "owned" by the nearest card (bigger
 * cards own proportionally more), and each card drifts to the middle of the
 * area it owns. Cards next to a hole get pulled into it.
 */
function fillGaps(dirs: THREE.Vector3[], size: number[], iterations: number, samples = 4000): void {
    const pts = fibonacciPoints(samples);
    const acc = dirs.map(() => new THREE.Vector3());
    for (let it = 0; it < iterations; it++) {
        for (const a of acc) a.set(0, 0, 0);
        for (const q of pts) {
            let best = 0;
            let bestScore = Infinity;
            for (let i = 0; i < dirs.length; i++) {
                const score = Math.acos(Math.min(1, q.dot(dirs[i]))) / size[i];
                if (score < bestScore) { bestScore = score; best = i; }
            }
            acc[best].add(q);
        }
        dirs.forEach((d, i) => {
            if (acc[i].lengthSq() > 0) d.lerp(acc[i].normalize(), 0.7).normalize();
        });
    }
}

/**
 * Pass 2 — even out crowding between neighbours.
 * Each card claims a circle proportional to its size (scaled so all circles
 * together cover the sphere); neighbours that crowd each other are pushed
 * apart until the pressure is equal everywhere.
 */
function relieveCrowding(dirs: THREE.Vector3[], size: number[], radius: number, iterations: number): void {
    const n = dirs.length;
    const sumSq = size.reduce((a, s) => a + s * s, 0);
    const k = Math.sqrt((4 * radius * radius) / sumSq);
    const reach = size.map((s) => (k * s) / radius);  // angular radius of each card's circle
    const minCos = Math.cos(Math.min(Math.PI, 2 * Math.max(...reach)));
    const push = dirs.map(() => new THREE.Vector3());
    const tmp = new THREE.Vector3();

    for (let it = 0; it < iterations; it++) {
        const damping = 0.5 * (1 - it / iterations) + 0.05; // settle gently
        for (const p of push) p.set(0, 0, 0);
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                const cos = dirs[i].dot(dirs[j]);
                if (cos < minCos) continue;
                const overlap = reach[i] + reach[j] - Math.acos(Math.min(1, Math.max(-1, cos)));
                if (overlap <= 0) continue;
                tmp.copy(dirs[j]).addScaledVector(dirs[i], -cos); // tangent dir i -> j
                if (tmp.lengthSq() < 1e-12) tmp.set(1, 0, 0).cross(dirs[i]);
                tmp.normalize();
                const shareI = size[j] / (size[i] + size[j]);      // bigger cards move less
                push[i].addScaledVector(tmp, -overlap * shareI);
                push[j].addScaledVector(tmp, overlap * (1 - shareI));
            }
        }
        for (let i = 0; i < n; i++) dirs[i].addScaledVector(push[i], damping).normalize();
    }
}

/**
 * Spread cards evenly over a sphere of fixed radius: no crowded clumps and no
 * big empty pockets. Card sizes and the sphere size don't change, and cards can
 * still layer slightly over their neighbours.
 *
 * @param initial starting directions (e.g. a Fibonacci lattice)
 * @returns one unit direction (from the sphere centre) per card
 */
export function spreadEvenly(
    cards: CardFootprint[],
    initial: THREE.Vector3[],
    radius: number,
): THREE.Vector3[] {
    const dirs = initial.map((d) => d.clone().normalize());
    if (dirs.length < 2) return dirs;
    const size = cards.map((c) => Math.sqrt(c.w * c.h));
    fillGaps(dirs, size, 10);
    relieveCrowding(dirs, size, radius, 300);
    return dirs;
}
