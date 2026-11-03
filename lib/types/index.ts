/**
 * Core metadata for an archival photo artifact
 */
export interface ArchiveItem {
    readonly id: number;
    readonly fileCode: string;
    readonly url: string;
    readonly title: string;
    readonly label: string;
    readonly desc: string;
    readonly status?: string;
    /** pixel size of the prepared image (= the card's photo area) */
    readonly width: number;
    readonly height: number;
    /** card size tier on the sphere */
    readonly size: "small" | "medium" | "large";
}

/**
 * Three.js Mesh custom data payload
 */
export interface CardUserData {
  item: ArchiveItem;
  originalScale: number;
}

/**
 * Navigation and UI Drawer IDs
 */
export type DrawerType = "about" | "projects" | "vault" | null;

/**
 * UI Modal IDs
 */
export type ModalType = "contact" | "lightbox" | null;

/**
 * Technical project dossier entry
 */
export interface ProjectItem {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly stack: string;
  readonly description: string;
  readonly href: string;
}