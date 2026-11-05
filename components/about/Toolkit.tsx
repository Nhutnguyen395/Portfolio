import type { ToolGroup } from "@/lib/types";
import { Reveal } from "./Reveal";

/** Grouped tool lists; hovering (or focusing) a tool reveals the projects it was used in. */
export function Toolkit({ groups }: { groups: readonly ToolGroup[] }) {
    const visible = groups.filter((g) => g.tools.length > 0);

    return (
        <section aria-labelledby="toolkit-heading" className="flex flex-col items-center gap-12">
            <Reveal className="flex flex-col items-center gap-2.5 text-center">
                <h2 id="toolkit-heading" className="font-serif font-normal text-5xl leading-none">
                    The Toolkit
                </h2>
                <p className="font-mono text-xs tracking-wider text-label">
                    hover a tool to see where I used it
                </p>
            </Reveal>

            <div className="grid w-full gap-x-8 gap-y-12 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
                {visible.map((group, gi) => (
                    <Reveal key={group.title} delay={gi * 0.07} className="flex flex-col gap-4">
                        <h3 className="text-base font-bold">{group.title}</h3>
                        <ul className="flex flex-col gap-3">
                            {group.tools.map((tool) => (
                                <li
                                    key={tool.name}
                                    tabIndex={tool.usedIn.length ? 0 : undefined}
                                    className="group flex items-center gap-3 outline-none"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="w-[26px] h-[26px] shrink-0 flex items-center justify-center border border-line bg-surface font-mono text-[10px] text-ink transition-colors group-hover:border-ink group-focus-visible:border-ink"
                                    >
                                        {tool.abbr}
                                    </span>
                                    <span className="text-[15px] text-subtle transition-colors group-hover:text-ink group-focus-visible:text-ink">
                                        {tool.name}
                                    </span>
                                    {tool.usedIn.length > 0 && (
                                        <span className="font-mono text-[11px] text-label transition-all duration-300 sm:opacity-0 sm:-translate-x-1 sm:group-hover:opacity-100 sm:group-hover:translate-x-0 sm:group-focus-visible:opacity-100 sm:group-focus-visible:translate-x-0">
                                            <span className="sr-only">used in </span>→ {tool.usedIn.join(" · ")}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}
