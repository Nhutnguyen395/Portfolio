// File: app/page.tsx
"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import { TopNav } from "@/components/ui/TopNav";
import { TelemetryHUD } from "@/components/ui/TelemetryHUD";
import { ARCHIVE_DATA } from "@/lib/data/archiveData";
import { ArchiveItem, DrawerType, ModalType } from "@/lib/types";

// Isolated 3D Canvas
const ArchiveCanvas = dynamic(
    () => import("@/components/scene/ArchiveCanvas"),
    { ssr: false }
);


export default function HomePage() {
    const [, setActiveFile] = useState<ArchiveItem | null>(null);
    const [, setActiveDrawer] = useState<DrawerType>(null);
    const [, setActiveModal] = useState<ModalType>(null);

    const handleSelectCard = useCallback((item: ArchiveItem) => {
        setActiveFile(item);
    }, []);

    return (
        <main className="relative w-screen h-screen overflow-hidden">
            {/* 1. Floating Top Navigation */}
            <TopNav
                onOpenDrawer={(drawer) => setActiveDrawer(drawer)}
                onOpenModal={(modal) => setActiveModal(modal)}
            />

            {/* 2. 3D WebGL Spherical Canvas */}
            <ArchiveCanvas items={ARCHIVE_DATA} onSelectCard={handleSelectCard} />

            {/* 3. Temporary Status Badge verifying selection */}
            <TelemetryHUD />
        </main>
    );
}