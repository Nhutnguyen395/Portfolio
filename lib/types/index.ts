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

/* ------------------------------------------------------------------ */
/* About page                                                          */
/* ------------------------------------------------------------------ */

/** Shared placement for anything pinned to the About collage. */
interface CollageBase {
  /** left edge, % of the collage width */
  readonly x: number;
  /** top edge, % of the collage height */
  readonly y: number;
  /** width, % of the collage width */
  readonly w: number;
  /** resting tilt in degrees (negative = counter-clockwise) */
  readonly rotate: number;
}

/** A white-bordered photo print with a handwritten-style caption. */
export interface CollagePolaroid extends CollageBase {
  readonly kind: "polaroid";
  readonly src: string;
  readonly alt: string;
  readonly caption: string;
  /** CSS aspect-ratio of the photo area, e.g. "4 / 3" (default) or "1 / 1" */
  readonly aspect?: string;
}

/** A small postage-stamp style photo, no caption. */
export interface CollageStamp extends CollageBase {
  readonly kind: "stamp";
  readonly src: string;
  readonly alt: string;
}

/** A movie ticket stub, drawn in code (no image needed). */
export interface CollageTicket extends CollageBase {
  readonly kind: "ticket";
  readonly title: string;
  readonly detail: string;
  readonly number: string;
}

export type CollageItem = CollagePolaroid | CollageStamp | CollageTicket;

export interface Quote {
  /** the saying itself, in its original language */
  readonly text: string;
  /** optional English translation, shown after a dash */
  readonly translation?: string;
}

export interface Tool {
  readonly name: string;
  /** 1–3 characters shown in the little badge */
  readonly abbr: string;
  /** project names revealed on hover; leave empty to show nothing */
  readonly usedIn: readonly string[];
}

export interface ToolGroup {
  readonly title: string;
  readonly tools: readonly Tool[];
}
