import { Archivo_Black, Reenie_Beanie } from "next/font/google";

/** handwritten marker for the label sticker */
export const marker = Reenie_Beanie({ subsets: ["latin"], weight: "400", variable: "--font-marker", display: "swap" });

/** chunky "tape brand" lettering (director, A/B side, C90) */
export const stamp = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-stamp", display: "swap" });
