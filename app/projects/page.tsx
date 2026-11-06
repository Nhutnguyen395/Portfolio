// File: app/projects/page.tsx
import type { Metadata } from "next";
import { TopNav } from "@/components/ui/TopNav";
import { Reveal } from "@/components/about/Reveal";
import { ProjectDeck } from "@/components/projects/ProjectDeck";
import { ProjectIndex } from "@/components/projects/ProjectIndex";
import { PROJECTS } from "@/lib/data/projectsData";

export const metadata: Metadata = {
    title: "Projects — Nhut Nguyen",
    description: "Things I've designed and built — distributed systems, data pipelines, and the dashboards that watch them.",
};

function LinkIcon({ label }: { label: string }) {
    if (label.toLowerCase() === "github") {
        return (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
        );
    }
    if (label.toLowerCase() === "demo") {
        return (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
            </svg>
        );
    }
    // anything else: generic external-link arrow
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 17 17 7M8 7h9v9" />
        </svg>
    );
}

export default function ProjectsPage() {
    return (
        <>
            <TopNav />
            <ProjectIndex ids={PROJECTS.map((p) => p.id)} />

            <main className="select-text font-sans text-ink mx-auto w-full max-w-3xl px-5 sm:px-8 pt-36 sm:pt-40 pb-32">

                <h1 className="sr-only">Projects</h1>
                <ol className="flex flex-col gap-10">
                    {PROJECTS.map((project, i) => {
                        const num = String(i + 1).padStart(2, "0");
                        return (
                            <li key={project.id} id={project.id} className="scroll-mt-32 border-b border-line pb-10">
                                <Reveal x={-20} className="flex flex-col gap-5">
                                    {/* number · title · stack · links */}
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <span className="font-display text-[28px] sm:text-3xl font-bold leading-tight text-ink/80 tabular-nums">
                                                {num}
                                            </span>
                                            <div className="flex flex-col gap-1.5">
                                                <h2 className="font-display text-[26px] sm:text-3xl font-medium leading-tight text-ink">
                                                    {project.name}
                                                    <span className="text-ink/45">: {project.tagline}</span>
                                                </h2>
                                                <p className="font-mono text-[13px] leading-relaxed text-label">
                                                    {project.stack.join(", ")}
                                                </p>
                                            </div>
                                        </div>

                                        {project.links && project.links.length > 0 && (
                                            <div className="flex shrink-0 items-center gap-2 pt-1.5">
                                                {project.links.map((l) => (
                                                    <a
                                                        key={l.href + l.label}
                                                        href={l.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        aria-label={`${l.label} for ${project.name}`}
                                                        title={l.label}
                                                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink text-white transition-colors duration-200 hover:bg-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-gallery"
                                                    >
                                                        <LinkIcon label={l.label} />
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* bullets + images, indented under the title */}
                                    <div className="flex flex-col gap-7 sm:pl-12">
                                        <ul className="flex flex-col gap-3 text-[15.5px] leading-relaxed text-subtle">
                                            {project.bullets.map((b) => (
                                                <li key={b} className="flex items-start gap-3">
                                                    <span aria-hidden="true" className="text-ink/30">•</span>
                                                    <span>{b}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <ProjectDeck images={project.images} projectName={project.name} eager={i === 0} />
                                    </div>
                                </Reveal>
                            </li>
                        );
                    })}
                </ol>
            </main>
        </>
    );
}
