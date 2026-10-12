// File: app/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import { ARCHIVE_DATA } from "@/lib/data/archiveData";
import { ArchiveItem } from "@/lib/types";

// Dynamically import Three.js canvas with zero SSR bundle bleed
const ArchiveCanvas = dynamic(
    () => import("@/components/scene/ArchiveCanvas"),
    { ssr: false }
);


export default function HomePage() {
    const [activeFile, setActiveFile] = useState<ArchiveItem | null>(null);

    const handleSelectCard = useCallback((item: ArchiveItem) => {
        setActiveFile(item);
    }, []);

    return (
        <main className="relative w-screen h-screen overflow-hidden">
            {/* 1. 3D WebGL Spherical Canvas */}
            <ArchiveCanvas items={ARCHIVE_DATA} onSelectCard={handleSelectCard} />

            {/* 2. Temporary Status Badge verifying selection */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface/90 backdrop-blur-sm border border-line rounded-full shadow-xs text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>
                        {activeFile ? `INSPECTING: ${activeFile.title} [${activeFile.fileCode}]` : "DRAG TO ORBIT · CLICK CARD TO SELECT"}
                    </span>
                </div>
            </div>
        </main>
    );
}