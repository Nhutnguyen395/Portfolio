import * as THREE from "three";
import { SphereLattice } from "./SphereLattice";
import { Controls } from "./Controls";
import { ArchiveItem } from "@/lib/types";

export interface WorldConfig {
    container: HTMLElement;
    items: ArchiveItem[];
    onSelectCard: (item: ArchiveItem) => void;
}

export class World {
    private container: HTMLElement;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private lattice: SphereLattice;
    private controls: Controls;
  
    private animationFrameId: number | null = null;
    private onResizeBound: () => void;

    constructor(config: WorldConfig) {
        this.container = config.container;

        // 1. Scene Setup
        this.scene = new THREE.Scene();

        // 2. Camera Setup (Balanced 45deg Frustum)
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        this.camera.position.z = 32;

        // 3. WebGL Renderer with Alpha Transparency
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Clamped for performance
        this.container.appendChild(this.renderer.domElement);

        // 4. Initialize 3D Sphere Lattice
        this.lattice = new SphereLattice(config.items);
        this.scene.add(this.lattice.group);

        // 5. Initialize Drag & Hover Physics
        this.controls = new Controls(
            this.renderer.domElement,
            this.camera,
            this.lattice.group,
            this.lattice.cardMeshes,
            { onSelectCard: config.onSelectCard }
        );

        // 6. Bind & Attach Resize Observer
        this.onResizeBound = this.onResize.bind(this);
        window.addEventListener("resize", this.onResizeBound);

        // 7. Start Render Loop
        this.start();
    }

    private onResize(): void {
        if (!this.renderer || !this.camera) return;
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    private render = (): void => {
        // Run physics update on each frame
        this.controls.update();

        // Rasterize 3D scene to screen buffer
        this.renderer.render(this.scene, this.camera);

        this.animationFrameId = requestAnimationFrame(this.render);
    };

    public start(): void {
        if (this.animationFrameId === null) {
            this.render();
        }
    }

    public stop(): void {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
    * Complete GPU memory release & listener unmounting
    */
    public dispose(): void {
        this.stop();

        // 1. Remove resize listener
        window.removeEventListener("resize", this.onResizeBound);

        // 2. Dispose controls and lattice
        this.controls.dispose();
        this.lattice.dispose();

        // 3. Clean up WebGL rendering context
        if (this.renderer.domElement && this.renderer.domElement.parentNode) {
            this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        }
        this.renderer.dispose();
    }
}