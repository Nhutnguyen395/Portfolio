"use client";

export function TelemetryHUD() {
    return (
        <>
            {/* 1. Top Left Telemetry */}
            <div className="fixed top-8 left-8 z-20 text-[10px] text-muted tracking-widest uppercase hidden md:block pointer-events-none font-mono space-y-0.5 select-none">
                <div>SYSTEM // ONLINE</div>
                <div className="text-neutral-400">NODES // 052 MOUNTED</div>
            </div>

            {/* 2. Top Right Telemetry */}
            <div className="fixed top-8 right-8 z-20 text-[10px] text-muted tracking-widest uppercase hidden md:block pointer-events-none text-right font-mono space-y-0.5 select-none">
                <div>INDEX // STREET LEVEL INTEL</div>
                <div className="text-neutral-400">CLASS // ARCHIVE FILE</div>
            </div>

            {/* 3. Center Bottom Interaction Prompt */}
            <div className="fixed inset-x-0 bottom-16 z-20 flex flex-col items-center justify-center text-center pointer-events-none px-4 space-y-1 font-mono select-none">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface/85 backdrop-blur-md border border-line rounded-full shadow-xs">
                    <span className="text-[10px] tracking-widest text-ink font-semibold uppercase">
                        DRAG TO ORBIT · CLICK SUBJECT TO OPEN FILE
                    </span>
                </div>
                <span className="text-[11px] font-sans text-neutral-500 font-normal">
                    A living 3D index of scale, cinema & personal artifacts
                </span>
            </div>

            {/* 4. Bottom Perimeter Footer */}
            <footer className="fixed bottom-0 inset-x-0 z-20 max-w-7xl mx-auto w-full px-6 sm:px-12 h-14 flex items-center justify-between text-xs text-muted pointer-events-none font-mono select-none">
                <div>
                    <span>CS @ UC IRVINE &apos;26</span>
                </div>

                <div className="flex items-center gap-6 pointer-events-auto">
                    <a
                        href="https://github.com/Nhutnguyen395"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-ink transition-colors cursor-pointer"
                    >
                        GITHUB ↗
                    </a>
                    <a
                        href="https://linkedin.com/in/nhutnguyen395"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-ink transition-colors cursor-pointer"
                    >
                        LINKEDIN ↗
                    </a>
                    <a
                        href="mailto:nhutnguyen395@gmail.com"
                        className="hover:text-ink transition-colors cursor-pointer"
                    >
                        EMAIL ↗
                    </a>
                </div>
            </footer>
        </>
    );
}