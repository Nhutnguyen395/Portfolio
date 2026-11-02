import * as THREE from "three";
import { ArchiveItem, CardUserData } from "@/lib/types";

export interface ControlsCallbacks {
    onSelectCard: (item: ArchiveItem) => void;
}

// World-space rotation axes (screen-relative, since the camera looks down -Z)
const AXIS_X = new THREE.Vector3(1, 0, 0);
const AXIS_Y = new THREE.Vector3(0, 1, 0);

// Tuning (velocities are radians per 60fps frame)
const DRAG_SENSITIVITY = 0.00035;
const IDLE_DRIFT = 0.0014;       // baseline spin around the vertical axis
const FRICTION = 0.975;          // per-frame inertia decay
const DRIFT_RECOVERY = 0.03;     // how quickly speed eases back to the idle drift
const HOVER_SCALE = 1.18;
const HOVER_EASE = 0.18;         // per-frame lerp factor for hover scale
const CLICK_THRESHOLD = 6;       // px of movement before a press counts as a drag
const RELEASE_STILL_MS = 80;     // holding still this long before release cancels the flick

/** True when the event originated on floating UI rather than the 3D canvas */
function isUiTarget(target: EventTarget | null): boolean {
    if (!(target instanceof Element)) return false;
    return Boolean(
        target.closest("header") ||
        target.closest("nav") ||
        target.closest("footer") ||
        target.closest("a, button") ||
        target.closest("[role='dialog']") ||
        target.closest("aside")
    );
}

export class Controls {
    private domElement: HTMLElement;
    private camera: THREE.PerspectiveCamera;
    private sphereGroup: THREE.Group;
    private cardMeshes: THREE.Mesh[];
    private callbacks: ControlsCallbacks;

    // Interaction State
    private isDragging = false;
    private activePointerId: number | null = null;
    private lastPointerType = "mouse";
    private prevMouseX = 0;
    private prevMouseY = 0;
    private lastMoveTime = 0;
    private velocityX = 0;
    private velocityY = IDLE_DRIFT;
    private driftDirection = 1; // keeps idle drift going the way the user last flicked
    private dragDist = 0;

    // Raycaster & Hover State
    private raycaster = new THREE.Raycaster();
    private mouse = new THREE.Vector2(-1000, -1000);
    private hoveredMesh: THREE.Mesh | null = null;
    private tmpQuat = new THREE.Quaternion();

    // Bound Event Listeners (for strict teardown)
    private onPointerDownBound: (e: PointerEvent) => void;
    private onPointerMoveBound: (e: PointerEvent) => void;
    private onPointerUpBound: (e: PointerEvent) => void;
    private onClickBound: (e: MouseEvent) => void;
    private onPointerLeaveBound: () => void;

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
        this.onPointerLeaveBound = this.onPointerLeave.bind(this);

        this.attachEvents();
    }

    private attachEvents(): void {
        window.addEventListener("pointerdown", this.onPointerDownBound);
        window.addEventListener("pointermove", this.onPointerMoveBound);
        window.addEventListener("pointerup", this.onPointerUpBound);
        window.addEventListener("pointercancel", this.onPointerUpBound);
        window.addEventListener("click", this.onClickBound);
        document.documentElement.addEventListener("pointerleave", this.onPointerLeaveBound);
    }

    /** Rotate the sphere around screen-relative axes (no gimbal lock / tumbling) */
    private rotate(angleX: number, angleY: number): void {
        if (angleY !== 0) {
            this.tmpQuat.setFromAxisAngle(AXIS_Y, angleY);
            this.sphereGroup.quaternion.premultiply(this.tmpQuat);
        }
        if (angleX !== 0) {
            this.tmpQuat.setFromAxisAngle(AXIS_X, angleX);
            this.sphereGroup.quaternion.premultiply(this.tmpQuat);
        }
    }

    private updateMouse(e: PointerEvent | MouseEvent): void {
        // Map window pixels to Three.js Normalized Device Coordinates (-1 to +1)
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    private onPointerDown(e: PointerEvent): void {
        this.lastPointerType = e.pointerType;
        // Ignore presses on floating navigation, modals, or drawers
        if (isUiTarget(e.target)) return;
        if (this.isDragging) return; // ignore a second finger

        this.isDragging = true;
        this.activePointerId = e.pointerId;
        this.dragDist = 0;
        this.prevMouseX = e.clientX;
        this.prevMouseY = e.clientY;
        this.lastMoveTime = performance.now();
        this.velocityX = 0;
        this.velocityY = 0;
        this.updateMouse(e);
        this.domElement.style.cursor = "grabbing";
    }

    private onPointerMove(e: PointerEvent): void {
        this.lastPointerType = e.pointerType;
        this.updateMouse(e);

        if (this.isDragging && e.pointerId === this.activePointerId) {
            const dx = e.clientX - this.prevMouseX;
            const dy = e.clientY - this.prevMouseY;
            this.dragDist += Math.abs(dx) + Math.abs(dy);

            this.velocityY = dx * DRAG_SENSITIVITY;
            this.velocityX = dy * DRAG_SENSITIVITY;
            this.rotate(this.velocityX, this.velocityY);

            if (Math.abs(this.velocityY) > 1e-5) {
                this.driftDirection = Math.sign(this.velocityY);
            }

            this.prevMouseX = e.clientX;
            this.prevMouseY = e.clientY;
            this.lastMoveTime = performance.now();
        }
    }

    private onPointerUp(e: PointerEvent): void {
        if (!this.isDragging || e.pointerId !== this.activePointerId) return;
        this.isDragging = false;
        this.activePointerId = null;

        // Pointer was held still before release: don't fling with a stale velocity
        if (performance.now() - this.lastMoveTime > RELEASE_STILL_MS) {
            this.velocityX = 0;
            this.velocityY = 0;
        }
        this.domElement.style.cursor = this.hoveredMesh ? "pointer" : "grab";
    }

    private onPointerLeave(): void {
        // Mouse left the window: clear hover
        this.mouse.set(-1000, -1000);
    }

    private onClick(e: MouseEvent): void {
        // Clicks on the nav / footer / links must never fall through to cards
        if (isUiTarget(e.target)) return;
        // If movement was greater than the threshold, treat as an orbit drag, NOT a card click
        if (this.dragDist > CLICK_THRESHOLD) return;

        this.updateMouse(e);
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.cardMeshes);

        if (intersects.length > 0) {
            const clickedMesh = intersects[0].object as THREE.Mesh;
            const userData = clickedMesh.userData as CardUserData;
            if (userData?.item) {
                this.callbacks.onSelectCard(userData.item);
            }
        }

        // Touch has no hover: don't leave a card "lifted" after a tap
        if (this.lastPointerType !== "mouse") {
            this.mouse.set(-1000, -1000);
        }
    }

    /**
    * Called every frame inside the requestAnimationFrame loop
    * @param delta seconds since the previous frame
    */
    public update(delta: number): void {
        // Normalise to a 60fps frame so speed is identical on 60/120/144Hz displays
        const frames = Math.min(delta, 0.1) * 60;

        // 1. Inertia Momentum & Idle Drift
        if (!this.isDragging) {
            this.rotate(this.velocityX * frames, this.velocityY * frames);

            const decay = Math.pow(FRICTION, frames);
            this.velocityX *= decay;
            this.velocityY *= decay;

            // Ease back toward a gentle spin around the vertical axis only,
            // in whichever direction the user last pushed it
            const target = IDLE_DRIFT * this.driftDirection;
            if (Math.abs(this.velocityY) < IDLE_DRIFT) {
                const k = 1 - Math.pow(1 - DRIFT_RECOVERY, frames);
                this.velocityY += (target - this.velocityY) * k;
            }
        }

        // 2. Raycaster Hover Detection
        let topMesh: THREE.Mesh | null = null;
        if (!this.isDragging) {
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.cardMeshes);
            if (intersects.length > 0) topMesh = intersects[0].object as THREE.Mesh;
        }

        if (topMesh !== this.hoveredMesh) {
            this.hoveredMesh = topMesh;
            if (!this.isDragging) {
                this.domElement.style.cursor = topMesh ? "pointer" : "grab";
            }
        }

        // 3. Eased hover lift (every card glides toward its target scale)
        const ease = 1 - Math.pow(1 - HOVER_EASE, frames);
        for (const mesh of this.cardMeshes) {
            const targetScale = mesh === this.hoveredMesh ? HOVER_SCALE : 1;
            const s = mesh.scale.x + (targetScale - mesh.scale.x) * ease;
            mesh.scale.setScalar(Math.abs(s - targetScale) < 0.0005 ? targetScale : s);
        }
    }

    /**
    * Deterministic Teardown: Remove all window listeners to prevent leaks
    */
    public dispose(): void {
        window.removeEventListener("pointerdown", this.onPointerDownBound);
        window.removeEventListener("pointermove", this.onPointerMoveBound);
        window.removeEventListener("pointerup", this.onPointerUpBound);
        window.removeEventListener("pointercancel", this.onPointerUpBound);
        window.removeEventListener("click", this.onClickBound);
        document.documentElement.removeEventListener("pointerleave", this.onPointerLeaveBound);
        this.hoveredMesh = null;
    }
}
