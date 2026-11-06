// File: app/reise/page.tsx
import type { Metadata } from "next";
import { TopNav } from "@/components/ui/TopNav";
import { Reveal } from "@/components/about/Reveal";
import { JourneyTrail } from "@/components/journey/JourneyTrail";
import { JOURNEY_INTRO, JOURNEY_STOPS } from "@/lib/data/journeyData";

export const metadata: Metadata = {
    title: "Reise — Nhut Nguyen",
    description: "Camping and hiking trips: Yosemite, Sequoia, and the Grand Canyon.",
};

export default function ReisePage() {
    return (
        <>
            <TopNav />

            <main className="select-text font-sans text-ink mx-auto w-full max-w-6xl px-5 sm:px-8 pt-36 sm:pt-44 pb-40">
                <header className="max-w-2xl mx-auto text-center flex flex-col items-center gap-5 pb-14 sm:pb-16">
                    {/* no visible title; kept for screen readers and SEO */}
                    <h1 className="sr-only">{JOURNEY_INTRO.title}</h1>
                    <Reveal className="flex flex-col gap-4">
                        {JOURNEY_INTRO.paragraphs.map((p) => (
                            <p key={p} className="text-[17px] leading-relaxed text-subtle">{p}</p>
                        ))}
                    </Reveal>
                    <Reveal delay={0.1}>
                        <ol className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 font-mono text-[11px] tracking-[0.16em] uppercase text-label">
                            {JOURNEY_STOPS.map((s, i) => (
                                <li key={s.id} className="flex items-center gap-3">
                                    {i > 0 && <span aria-hidden="true">/</span>}
                                    <a href={`#${s.id}`} className="hover:text-ink transition-colors">{s.name}</a>
                                </li>
                            ))}
                        </ol>
                    </Reveal>
                </header>

                <JourneyTrail stops={JOURNEY_STOPS} outro={JOURNEY_INTRO.outro} />
            </main>
        </>
    );
}
