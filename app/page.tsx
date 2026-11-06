// File: app/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import { TopNav } from "@/components/ui/TopNav";
import { ARCHIVE_DATA } from "@/lib/data/archiveData";
import { ArchiveItem } from "@/lib/types";

// Isolated 3D Canvas
const ArchiveCanvas = dynamic(
    () => import("@/components/scene/ArchiveCanvas"),
    { ssr: false }
);


export default function HomePage() {
    const [, setActiveFile] = useState<ArchiveItem | null>(null);

    const handleSelectCard = useCallback((item: ArchiveItem) => {
        setActiveFile(item);
    }, []);

    return (
        <main className="relative w-screen h-screen overflow-hidden">
            {/* 1. Minimal top bar: home mark · ~/pages · socials */}
            <TopNav />

            {/* 2. 3D WebGL Spherical Canvas */}
            <ArchiveCanvas items={ARCHIVE_DATA} onSelectCard={handleSelectCard} />
        </main>
    );
}