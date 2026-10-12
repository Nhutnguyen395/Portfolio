import * as THREE from "three";
import {ArchiveItem, CardUserData} from "@/lib/types";

export class SphereLattice {
    public group: THREE.Group;
    public cardMeshes: THREE.Mesh[] = [];

    private geometries: THREE.BufferGeometry[] = [];
    private materials: THREE.Material[] = [];
    private textures: THREE.Texture[] = []
    private maxAnisotropy: number;

    constructor(items: ArchiveItem[], maxAnisotropy = 16) {
        this.group = new THREE.Group();
        this.maxAnisotropy = maxAnisotropy;
        this.initCoreTypography();
        this.initLattice(items);
        this.initGeodesicLines();
    }

    /**
    * 1. INNER 3D CORE TYPOGRAPHY (Visible through card gaps)
    */
    private initCoreTypography(): void {
        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");

        if (ctx) {
            ctx.fillStyle = "transparent";
            ctx.fillRect(0, 0, 1024, 512);
            
            ctx.font = '800 84px "JetBrains Mono", monospace';
            ctx.textAlign = "center";
            ctx.fillStyle = "rgba(17, 17, 17, 0.08)";
            ctx.fillText("NHUT NGUYEN", 512, 220);

            ctx.font = '400 36px "JetBrains Mono", monospace';
            ctx.fillText("ARCHIVAL WORLD // 2026", 512, 290);
        }

        const coreTexture = new THREE.CanvasTexture(canvas);
        coreTexture.anisotropy = this.maxAnisotropy;
        this.textures.push(coreTexture);

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
    * 2. PROCEDURAL CARD TEXTURE FACTORY
    */
    private createCardTexture(item: ArchiveItem): THREE.CanvasTexture {
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 640;
        const ctx = canvas.getContext("2d");

        const pad = 24;
        const pw = 512 - pad * 2;
        const ph = 480;

        if (ctx) {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, 512, 640);

            ctx.strokeStyle = "#E2DFD5";
            ctx.lineWidth = 6;
            ctx.strokeRect(4, 4, 504, 540);

            ctx.fillStyle = "#EEECE6";
            ctx.fillRect(pad, pad, pw, ph);

            ctx.font = '700 28px "JetBrains Mono", monospace';
            ctx.fillStyle = "#111111";
            ctx.textAlign = "center";
            ctx.fillText(item.fileCode, 256, 560);

            ctx.font = '500 20px "JetBrains Mono", monospace';
            ctx.fillStyle = "#85837B";
            ctx.fillText(item.title.toUpperCase(), 256, 602);
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        this.textures.push(texture);

        // ANISOTROPIC FILTERING: Keeps grazing angle textures sharp at the sphere edges
        texture.anisotropy = this.maxAnisotropy;
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        this.textures.push(texture);

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = item.url;
        img.onload = () => {
            if (ctx) {
                ctx.drawImage(img, pad, pad, pw, ph);
                ctx.strokeStyle = "rgba(0, 0, 0, 0.06)";
                ctx.lineWidth = 4;
                ctx.strokeRect(pad, pad, pw, ph);
                texture.needsUpdate = true;
            }
        };
        return texture;
    }

    /**
    * 3. 52-CARD FIBONACCI SPHERE DISTRIBUTION
    */
    private initLattice(items: ArchiveItem[]): void {
        const totalCards = items.length;
        const sphereRadius = 10;
        const phi = Math.PI * (3 - Math.sqrt(5));
        const cardGeo = new THREE.PlaneGeometry(3.9, 4.6);
        this.geometries.push(cardGeo);

        for (let i = 0; i < totalCards; i++){
            // 1. Calculate Fibonacci coordinate on sphere surface
            const y = 1 - (i / (totalCards - 1)) * 2;
            const radiusAtY = Math.sqrt(1 - y * y);
            const theta = phi * i;

            const x = Math.cos(theta) * radiusAtY;
            const z = Math.sin(theta) * radiusAtY;
            
            // 2. ONION LAYERING: Apply micro-depth tier offset
            // Using prime modulus 7 ensures adjacent neighbors never share the same depth layer
            const layerTier = ((i * 3) % 7) - 3; // Outputs: -3, -2, -1, 0, 1, 2, 3
            const radialOffset = layerTier * 0.16; // Micro-offset between -0.48 and +0.48
            const effectiveRadius = sphereRadius + radialOffset;

            const pos = new THREE.Vector3(
                x * effectiveRadius,
                y * effectiveRadius,
                z * effectiveRadius
            );

            // 3. Instantiate procedural texture and mesh
            const texture = this.createCardTexture(items[i]);
            const cardMat = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
            });
            this.materials.push(cardMat);

            const mesh = new THREE.Mesh(cardGeo, cardMat);
            mesh.position.copy(pos);

            // 4. Orient normal facing radially outward from center
            mesh.lookAt(pos.clone().multiplyScalar(2));

            // 5. Attach typed payload for Raycaster picking
            const userData: CardUserData = {
                item: items[i],
                originalScale: 1.0,
            };
            mesh.userData = userData;

            this.cardMeshes.push(mesh);
            this.group.add(mesh);
        }
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
        // 1. Dispose all textures from VRAM
        this.textures.forEach((t) => t.dispose());
        this.textures = [];

        // 2. Dispose all buffer geometries
        this.geometries.forEach((g) => g.dispose());
        this.geometries = [];

        // 3. Dispose all materials
        this.materials.forEach((m) => m.dispose());
        this.materials = [];

        // 4. Clear mesh references
        this.cardMeshes = [];
        this.group.clear();
    }
}