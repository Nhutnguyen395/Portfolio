// File: app/kino/page.tsx
import type { Metadata } from "next";
import { TopNav } from "@/components/ui/TopNav";
import { TapeWall } from "@/components/tapes/TapeWall";
import { MOVIES } from "@/lib/data/moviesData";

export const metadata: Metadata = {
    title: "Kino — Nhut Nguyen",
    description: "A wall of films I keep rewinding.",
};

export default function KinoPage() {
    return (
        <>
            <TopNav />
            <main className="h-dvh overflow-hidden">
                {/* no visible title; kept for screen readers and SEO */}
                <h1 className="sr-only">Kino — favorite films</h1>
                <TapeWall movies={MOVIES} />
            </main>
        </>
    );
}
