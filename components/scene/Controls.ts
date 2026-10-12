import * as THREE from "three";
import { ArchiveItem, CardUserData } from "@/lib/types";

export interface ControlsCallbacks {
    onSelectCard: (item: ArchiveItem) => void;
}

export class Controls {
    private domElement: HTMLElement;
    private camera: THREE.PerspectiveCamera;
    private sphereGroup: THREE.Group;
    private cardMeshes: THREE.Mesh[];
    private callbacks: ControlsCallbacks;

    // Interaction State
    private isDragging = false;
    private prevMouseX = 0;
    private prevMouseY = 0;
    private velocityX = 0.0012;
    private velocityY = 0.0018;
    private dragDist = 0;

    // Raycaster & Hover State
    private raycaster = new THREE.Raycaster();
    private mouse = new THREE.Vector2(-1000, -1000);
    private hoveredMesh: THREE.Mesh | null = null;

    // Bound Event Listeners (for strict teardown)
    private onPointerDownBound: (e: PointerEvent) => void;
    private onPointerMoveBound: (e: PointerEvent) => void;
    private onPointerUpBound: () => void;
    private onClickBound: (e: MouseEvent) => void;

    constructor(
        domElement: HTMLElement,
        camera: THREE.PerspectiveCamera,
        sphereGroup: THREE.Group,
        cardMeshes: THREE.Mesh[],
        callbacks: ControlsCallbacks
    ) {
        this.domElement = domElement;
        this.camera = camera;
        this.sphereGroup = sphereGroup;
        this.cardMeshes = cardMeshes;
        this.callbacks = callbacks;

        this.onPointerDownBound = this.onPointerDown.bind(this);
        this.onPointerMoveBound = this.onPointerMove.bind(this);
        this.onPointerUpBound = this.onPointerUp.bind(this);
        this.onClickBound = this.onClick.bind(this);

        this.attachEvents();
    }

    private attachEvents(): void {
        window.addEventListener("pointerdown", this.onPointerDownBound);
        window.addEventListener("pointermove", this.onPointerMoveBound);
        window.addEventListener("pointerup", this.onPointerUpBound);
        window.addEventListener("click", this.onClickBound);
    }

    private onPointerDown(e: PointerEvent): void {
        // Ignore clicks on floating navigation, modals, or drawers
        const target = e.target as HTMLElement;
        if (target.closest("header") ||
            target.closest("nav") ||
            target.closest("[role='dialog']") ||
            target.closest("aside")
        ) {
            return;
        }

        this.isDragging = true;
        this.dragDist = 0;
        this.prevMouseX = e.clientX;
        this.prevMouseY = e.clientY;
    }

    private onPointerMove(e: PointerEvent): void {
        // Map window pixels to Three.js Normalized Device Coordinates (-1 to +1)
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        if (this.isDragging) {
            const dx = e.clientX - this.prevMouseX;
            const dy = e.clientY - this.prevMouseY;
            this.dragDist += Math.abs(dx) + Math.abs(dy);

            this.velocityY = dx * 0.00035;
            this.velocityX = dy * 0.00035;

            this.sphereGroup.rotation.y += this.velocityY;
            this.sphereGroup.rotation.x += this.velocityX;

            this.prevMouseX = e.clientX;
            this.prevMouseY = e.clientY;
        }
    }

    private onPointerUp(): void {
        this.isDragging = false;
    }

    private onClick(): void {
        // If movement was greater than 6px, treat as an orbit drag, NOT a card click
        if (this.dragDist > 6) return;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.cardMeshes);

        if (intersects.length > 0) {
            const clickedMesh = intersects[0].object as THREE.Mesh;
            const userData = clickedMesh.userData as CardUserData;
            if (userData?.item) {
                this.callbacks.onSelectCard(userData.item);
            }
        }
    }

    /**
    * Called every frame inside the requestAnimationFrame loop
    */
    public update(): void {
        // 1. Inertia Momentum & Idle Drift
        if (!this.isDragging) {
            this.sphereGroup.rotation.y += this.velocityY;
            this.sphereGroup.rotation.x += this.velocityX;

            this.velocityY *= 0.975;
            this.velocityX *= 0.975;

            // Keep subtle orbital baseline drift
            if (Math.abs(this.velocityY) < 0.0008) this.velocityY = 0.0012;
            if (Math.abs(this.velocityX) < 0.0008) this.velocityX = 0.0005;
        }

        // 2. Raycaster Hover Detection & Micro-Scale Animation
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.cardMeshes);

        if (intersects.length > 0) {
            const topMesh = intersects[0].object as THREE.Mesh;
            if (this.hoveredMesh !== topMesh) {
                if (this.hoveredMesh) this.hoveredMesh.scale.set(1, 1, 1);
                this.hoveredMesh = topMesh;
                this.hoveredMesh.scale.set(1.18, 1.18, 1.18); // Elegant hover lift
                this.domElement.style.cursor = "pointer";
            }
        } else {
            if (this.hoveredMesh) {
                this.hoveredMesh.scale.set(1, 1, 1);
                this.hoveredMesh = null;
                this.domElement.style.cursor = this.isDragging ? "grabbing" : "grab";
            }
        }
    }

    /**
    * Deterministic Teardown: Remove all window listeners to prevent leaks
    */
    public dispose(): void {
        window.removeEventListener("pointerdown", this.onPointerDownBound);
        window.removeEventListener("pointermove", this.onPointerMoveBound);
        window.removeEventListener("pointerup", this.onPointerUpBound);
        window.removeEventListener("click", this.onClickBound);
        this.hoveredMesh = null;
    }
}