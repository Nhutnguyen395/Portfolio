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

/* ------------------------------------------------------------------ */
/* Projects page                                                       */
/* ------------------------------------------------------------------ */

export interface ProjectImage {
  /** path under /public, e.g. "/projects/hermes/dashboard.webp" */
  readonly src: string;
  readonly alt: string;
  /** optional small label shown under the image */
  readonly caption?: string;
  /** CSS aspect-ratio of the frame, e.g. "16 / 10" (default) or "4 / 3" */
  readonly aspect?: string;
}

export interface ProjectLink {
  readonly label: string;
  readonly href: string;
}

export interface Project {
  /** unique, url-safe id — also used as the #anchor */
  readonly id: string;
  readonly name: string;
  /** one-line summary shown under the name */
  readonly tagline: string;
  /** e.g. "2025" or "Spring 2025" */
  readonly year?: string;
  readonly stack: readonly string[];
  readonly bullets: readonly string[];
  readonly links?: readonly ProjectLink[];
  /** first image is shown large; the rest sit in a 2-column grid below it */
  readonly images: readonly ProjectImage[];
}

/* ------------------------------------------------------------------ */
/* Journey page                                                        */
/* ------------------------------------------------------------------ */

/** One photo pinned along the trail. */
export interface JourneyPhoto {
  /** path under /public, e.g. "/journey/yosemite/half-dome.webp". Leave "" for a placeholder frame. */
  readonly src: string;
  readonly alt: string;
  /** short handwritten-style caption under the photo */
  readonly caption?: string;
  /** CSS aspect-ratio of the photo, e.g. "4 / 3" (default), "3 / 4", "1 / 1" */
  readonly aspect?: string;
}

/** A location on the trail: a "Welcome to …" checkpoint followed by its photos. */
export interface JourneyStop {
  /** unique, used for anchors (#yosemite) */
  readonly id: string;
  /** big name on the checkpoint sign */
  readonly name: string;
  /** smaller line above the name, e.g. "National Park" */
  readonly kicker?: string;
  /** e.g. "California, USA" */
  readonly region: string;
  /** e.g. "Summer 2024" (optional) */
  readonly date?: string;
  /** e.g. "37.8651° N, 119.5383° W" (optional) */
  readonly coords?: string;
  /** one or two sentences about the trip (optional) */
  readonly note?: string;
  readonly photos: readonly JourneyPhoto[];
}
