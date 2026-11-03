import * as THREE from "three";
import {ArchiveItem, CardUserData} from "@/lib/types";
import { spreadEvenly } from "./layout";

/**
 * Card layout. Every card keeps its photo's own proportions.
 * Photos are prepared by scripts/prepare_archive.py at exactly the pixel size
 * they're drawn at (item.width x item.height), so they render 1:1 = sharpest.
 * Card size on the sphere is pixels x PX_TO_WORLD, so texel density is the same
 * on every card and bigger cards are simply bigger photos.
 */
const PAD = 24;                      // white frame around the photo (px)
const BOTTOM = 80;                   // polaroid-style bottom margin (px)
const PX_TO_WORLD = 3.4 / 512;       // world units per texture pixel
const SPHERE_RADIUS = 10;
// Large cards sit slightly outside the shell, small ones slightly inside,
// so bigger photos layer on top of their neighbours instead of clipping.
const TIER_OFFSET = { small: -0.35, medium: 0, large: 0.6 } as const;

export class SphereLattice {
    public group: THREE.Group;
    public cardMeshes: THREE.Mesh[] = [];

    private geometries: THREE.BufferGeometry[] = [];
    private materials: THREE.Material[] = [];
    private textures: THREE.Texture[] = [];
    private materialCache = new Map<string, THREE.MeshBasicMaterial>();
    private geometryCache = new Map<string, THREE.PlaneGeometry>();
    private disposed = false;
    private maxAnisotropy: number;

    constructor(items: ArchiveItem[], maxAnisotropy = 16) {
        this.group = new THREE.Group();
        this.maxAnisotropy = maxAnisotropy;
        this.initCoreTypography();
        this.initLattice(items);
        this.initGeodesicLines();
    }

    /**
    * Resolve the real font-family list next/font registered for a CSS variable
    * (next/font may rename families, so a hard-coded "JetBrains Mono" can silently miss)
    */
    private resolveFontFamily(cssVar: string, fallback: string): string {
        const value = getComputedStyle(document.documentElement)
            .getPropertyValue(cssVar)
            .trim();
        return value ? `${value}, ${fallback}` : fallback;
    }

    /**
    * 1. INNER 3D CORE TYPOGRAPHY (Visible through card gaps)
    */
    private initCoreTypography(): void {
        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");
        const mono = this.resolveFontFamily("--font-jetbrains", "monospace");

        const coreTexture = new THREE.CanvasTexture(canvas);
        coreTexture.anisotropy = this.maxAnisotropy;
        this.textures.push(coreTexture);

        const draw = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, 1024, 512);

            ctx.font = `800 84px ${mono}`;
            ctx.textAlign = "center";
            ctx.fillStyle = "rgba(17, 17, 17, 0.08)";
            ctx.fillText("NHUT NGUYEN", 512, 220);

            ctx.font = `400 36px ${mono}`;
            ctx.fillText("ARCHIVAL WORLD // 2026", 512, 290);
            coreTexture.needsUpdate = true;
        };

        // Draw immediately, then redraw once the web font has actually loaded
        draw();
        Promise.all([
            document.fonts.load(`800 84px ${mono}`),
            document.fonts.load(`400 36px ${mono}`),
        ])
            .then(() => {
                if (!this.disposed) draw();
            })
            .catch(() => { /* keep fallback rendering */ });

        const coreGeo = new THREE.PlaneGeometry(16, 8);
        this.geometries.push(coreGeo);

        const coreMat = new THREE.MeshBasicMaterial({
            map: coreTexture,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
        });
        this.materials.push(coreMat);

        const coreMesh1 = new THREE.Mesh(coreGeo, coreMat);
        this.group.add(coreMesh1);

        const coreMesh2 = coreMesh1.clone();
        coreMesh2.rotation.y = Math.PI / 2;
        this.group.add(coreMesh2);
    }

    /**
    * 2. PROCEDURAL CARD MATERIAL FACTORY
    * One texture + material per unique image (shared if an image repeats)
    */
    private getCardMaterial(item: ArchiveItem): THREE.MeshBasicMaterial {
        const cached = this.materialCache.get(item.url);
        if (cached) return cached;

        const canvas = document.createElement("canvas");
        const pad = PAD;
        const pw = item.width;
        const ph = item.height;
        const cardW = pw + pad * 2;
        const cardH = pad + ph + BOTTOM;

        canvas.width = cardW;
        canvas.height = cardH;
        const ctx = canvas.getContext("2d");

        if (ctx) {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, cardW, cardH);

            ctx.strokeStyle = "#E2DFD5";
            ctx.lineWidth = 6;
            ctx.strokeRect(4, 4, cardW - 8, pad + ph + 20);

            ctx.fillStyle = "#EEECE6";
            ctx.fillRect(pad, pad, pw, ph);
        }

        const texture = new THREE.CanvasTexture(canvas);
        // ANISOTROPIC FILTERING: Keeps grazing angle textures sharp at the sphere edges
        texture.anisotropy = this.maxAnisotropy;
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        this.textures.push(texture);

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            // Image may arrive after the scene was torn down (e.g. React StrictMode remount)
            if (this.disposed || !ctx) return;
            // "object-fit: cover": crop the source to the photo area's ratio
            // instead of stretching it (centered crop)
            const targetRatio = pw / ph;
            const srcRatio = img.naturalWidth / img.naturalHeight;
            let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
            if (srcRatio > targetRatio) {
                sw = sh * targetRatio;
                sx = (img.naturalWidth - sw) / 2;
            } else if (srcRatio < targetRatio) {
                sh = sw / targetRatio;
                sy = (img.naturalHeight - sh) / 2;
            }
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, sx, sy, sw, sh, pad, pad, pw, ph);
            ctx.strokeStyle = "rgba(0, 0, 0, 0.06)";
            ctx.lineWidth = 4;
            ctx.strokeRect(pad, pad, pw, ph);
            texture.needsUpdate = true;
        };
        img.src = item.url;

        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
        this.materials.push(material);
        this.materialCache.set(item.url, material);
        return material;
    }

    /** Card plane geometry for an item, shared between cards of the same size */
    private getCardGeometry(item: ArchiveItem): THREE.PlaneGeometry {
        const w = item.width + PAD * 2;
        const h = PAD + item.height + BOTTOM;
        const key = `${w}x${h}`;
        let geo = this.geometryCache.get(key);
        if (!geo) {
            geo = new THREE.PlaneGeometry(w * PX_TO_WORLD, h * PX_TO_WORLD);
            this.geometryCache.set(key, geo);
            this.geometries.push(geo);
        }
        return geo;
    }

    /**
    * Decide which sphere slot each photo goes to: large cards are spread as far
    * apart as possible (farthest-point sampling), the rest fill the gaps.
    */
    private assignSlots(items: ArchiveItem[], points: THREE.Vector3[]): number[] {
        const slotOf = new Array<number>(items.length).fill(-1);
        const free = new Set(points.map((_, i) => i));
        const taken: THREE.Vector3[] = [];

        const large = items.map((it, i) => i).filter((i) => items[i].size === "large");
        for (const itemIdx of large) {
            let best = -1;
            let bestDist = -1;
            for (const p of free) {
                const d = taken.length
                    ? Math.min(...taken.map((t) => t.distanceToSquared(points[p])))
                    : -Math.abs(points[p].y); // first large card near the equator
                if (d > bestDist) { bestDist = d; best = p; }
            }
            slotOf[itemIdx] = best;
            free.delete(best);
            taken.push(points[best]);
        }

        const remainingSlots = [...free].sort((a, b) => a - b);
        let k = 0;
        items.forEach((it, i) => {
            if (slotOf[i] === -1) slotOf[i] = remainingSlots[k++];
        });
        return slotOf;
    }

    /**
    * 3. FIBONACCI SPHERE DISTRIBUTION (one card per photo, varied sizes)
    */
    private initLattice(items: ArchiveItem[]): void {
        const totalCards = items.length;
        const phi = Math.PI * (3 - Math.sqrt(5));

        // 1. Evenly spread unit directions on the sphere (Fibonacci lattice)
        const points: THREE.Vector3[] = [];
        for (let i = 0; i < totalCards; i++) {
            const y = totalCards > 1 ? 1 - (i / (totalCards - 1)) * 2 : 0;
            const radiusAtY = Math.sqrt(1 - y * y);
            const theta = phi * i;
            points.push(new THREE.Vector3(Math.cos(theta) * radiusAtY, y, Math.sin(theta) * radiusAtY));
        }

        const slotOf = this.assignSlots(items, points);

        // 2. Even out the spacing for the cards' real sizes: no crowded clumps,
        //    no big empty pockets (card sizes and sphere size stay the same)
        const dirs = spreadEvenly(
            items.map((item) => ({
                w: (item.width + PAD * 2) * PX_TO_WORLD,
                h: (PAD + item.height + BOTTOM) * PX_TO_WORLD,
            })),
            items.map((_, i) => points[slotOf[i]]),
            SPHERE_RADIUS,
        );

        items.forEach((item, i) => {
            const slot = slotOf[i];

            // 3. ONION LAYERING: size tier + micro-depth jitter so neighbours
            //    never share a depth (prime modulus 7 => adjacent slots differ)
            const layerTier = ((slot * 3) % 7) - 3;
            const radius = SPHERE_RADIUS + TIER_OFFSET[item.size] + layerTier * 0.08;
            const pos = dirs[i].clone().multiplyScalar(radius);

            // 3. Mesh sized to the photo's own proportions
            const mesh = new THREE.Mesh(this.getCardGeometry(item), this.getCardMaterial(item));
            mesh.position.copy(pos);

            // 4. Orient normal facing radially outward from center
            mesh.lookAt(pos.clone().multiplyScalar(2));

            // 5. Attach typed payload for Raycaster picking
            const userData: CardUserData = {
                item,
                originalScale: 1.0,
            };
            mesh.userData = userData;

            this.cardMeshes.push(mesh);
            this.group.add(mesh);
        });
    }

    /**
    * 4. GEODESIC STRUCTURAL WIREFRAME (Light structural lines connecting nearby nodes)
    */
    private initGeodesicLines(): void {
        const linePositions: number[] = [];
        const count = this.cardMeshes.length;

        for (let i = 0; i < count; i++) {
            for (let j = i + 1; j < count; j++) {
                const dist = this.cardMeshes[i].position.distanceTo(
                    this.cardMeshes[j].position
                );
                // Connect neighboring nodes within proximate shell distance
                if (dist < 3.8) {
                    linePositions.push(
                        this.cardMeshes[i].position.x,
                        this.cardMeshes[i].position.y,
                        this.cardMeshes[i].position.z,
                        this.cardMeshes[j].position.x,
                        this.cardMeshes[j].position.y,
                        this.cardMeshes[j].position.z
                    );
                }
            }
        }

        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(linePositions, 3)
        );
        this.geometries.push(lineGeo);

        const lineMat = new THREE.LineBasicMaterial({
            color: 0x111111,
            transparent: true,
            opacity: 0.08,
        });
        this.materials.push(lineMat);

        const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
        this.group.add(lineMesh);
    }

    /**
    * DETERMINISTIC GPU TEARDOWN
    */
    public dispose(): void {
        this.disposed = true;

        // 1. Dispose all textures from VRAM
        this.textures.forEach((t) => t.dispose());
        this.textures = [];

        // 2. Dispose all buffer geometries
        this.geometries.forEach((g) => g.dispose());
        this.geometries = [];

        // 3. Dispose all materials
        this.materials.forEach((m) => m.dispose());
        this.materials = [];
        this.materialCache.clear();
        this.geometryCache.clear();

        // 4. Clear mesh references
        this.cardMeshes = [];
        this.group.clear();
    }
}