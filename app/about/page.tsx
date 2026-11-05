// File: app/about/page.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { TopNav } from "@/components/ui/TopNav";
import { Collage } from "@/components/about/Collage";
import { Reveal } from "@/components/about/Reveal";
import { Toolkit } from "@/components/about/Toolkit";
import {
    ABOUT_INTRO,
    COLLAGE,
    CURRENT_ENDEAVORS,
    QUOTES,
    TOOLKIT,
} from "@/lib/data/aboutData";

export const metadata: Metadata = {
    title: "About — Nhut Nguyen",
    description: "Who I am, what I'm working toward, and what I build with.",
};

function SectionLabel({ children }: { children: ReactNode }) {
    return (
        <h2 className="font-mono text-xs font-semibold tracking-[0.16em] uppercase text-ink">
            {children} <span className="text-label">{"//"}</span>
        </h2>
    );
}

export default function AboutPage() {
    return (
        <>
            <TopNav />

            <main className="select-text font-sans text-ink mx-auto w-full max-w-6xl px-5 sm:px-8 pt-36 sm:pt-40 pb-32 flex flex-col gap-32">
                <div className="grid items-start gap-14 lg:gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
                    <Collage items={COLLAGE} />

                    <div className="flex flex-col gap-11 lg:pt-8">
                        <Reveal delay={0.15} className="flex flex-col gap-4">
                            <h1 className="font-serif font-normal text-[32px] sm:text-[40px] leading-tight">
                                {ABOUT_INTRO.greeting}
                                {ABOUT_INTRO.greetingAccent && <> <em>{ABOUT_INTRO.greetingAccent}</em></>}
                            </h1>
                            {ABOUT_INTRO.paragraphs.map((p) => (
                                <p key={p} className="text-[17px] leading-relaxed text-subtle">{p}</p>
                            ))}
                        </Reveal>

                        {CURRENT_ENDEAVORS.length > 0 && (
                            <Reveal delay={0.25} className="flex flex-col gap-2.5">
                                <SectionLabel>Current endeavors</SectionLabel>
                                {CURRENT_ENDEAVORS.map((p) => (
                                    <p key={p} className="text-[17px] leading-relaxed text-subtle">{p}</p>
                                ))}
                            </Reveal>
                        )}

                        {QUOTES.length > 0 && (
                            <Reveal delay={0.35} className="flex flex-col gap-2.5">
                                <SectionLabel>Words I live by</SectionLabel>
                                <ol className="flex flex-col gap-2 text-[17px] leading-relaxed text-subtle">
                                    {QUOTES.map((q, i) => (
                                        <li key={q.text} className="flex gap-2">
                                            <span className="shrink-0 tabular-nums">[{String(i + 1).padStart(2, "0")}]</span>
                                            <span>
                                                {q.text}
                                                {q.translation && <> - {q.translation}</>}
                                            </span>
                                        </li>
                                    ))}
                                </ol>
                            </Reveal>
                        )}
                    </div>
                </div>

                <Toolkit groups={TOOLKIT} />
            </main>
        </>
    );
}
