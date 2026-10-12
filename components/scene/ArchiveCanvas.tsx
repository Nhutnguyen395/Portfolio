"use client";

import { useEffect, useRef } from "react";
import { World } from "./World";
import { ArchiveItem } from "@/lib/types";

interface ArchiveCanvasProps {
    items: ArchiveItem[];
    onSelectCard: (item: ArchiveItem) => void;
}

export default function ArchiveCanvas({ items, onSelectCard }: ArchiveCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // 1. Initialize WebGL World engine
        const world = new World({
            container: containerRef.current,
            items,
            onSelectCard,
        });

        // 2. Teardown lifecycle on unmount
        return () => {
            world.dispose();
        };
    }, [items, onSelectCard]);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing overflow-hidden"
            aria-label="Interactive 3D Archival Sphere"
            role="region"
        />
    );
}