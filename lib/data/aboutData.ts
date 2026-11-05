// File: lib/data/aboutData.ts
//
// Everything on the About page lives here — edit this file, not the components.
//
// PHOTOS: drop your own images into /public/about/ and point `src` at them,
// e.g. src: "/about/me-at-the-beach.jpg". The defaults below borrow from the
// landing-page archive so the page works before you add your own.
// Collage positions are percentages of the collage box (x/y = top-left corner,
// w = width). Tweak them until the pile looks right — clicking a piece brings it to the front.

import type { CollageItem, Quote, ToolGroup } from "@/lib/types";

export const ABOUT_INTRO = {
  greeting: "Hi, welcome to my digital playground!",
  // optional: italic words after the greeting (leave "" for none)
  greetingAccent: "",
  paragraphs: [
    "I'm a full-stack software engineer passionate about architecting and building mission-critical software that solves real-world problems. My focus is designing backend infrastructure, and I find joy in creating efficient, reliable data pipelines and frontends that deliver the best possible user experience. I'm dedicated to working through complex problems that push me to learn something new. For me, good engineering means solving the right problems as simply as possible and building something people can trust.",
  ],
};

export const CURRENT_ENDEAVORS: readonly string[] = [
  "I recently graduated from UC Irvine with a B.S. in Computer Science, and I'm currently working towards my AWS and CompTIA Security+ certifications. My coursework and personal projects have centered around mission-critical software, system design, and cloud deployments. Going forward, I'm especially interested in roles in aerospace, defense, and robotics, where reliability and security matter most.",
];

// Shown as a numbered list: [01] text - translation
export const QUOTES: readonly Quote[] = [
  { text: "Insanity is doing the same thing over and over again and expecting different results." },
  { text: "Có công mài sắt, có ngày nên kim", translation: "Grind an iron bar long enough, some day it will become a needle" },
  { text: "Gieo nhân nào, gặt quả nấy", translation: "You reap what you sow" },
  { text: "Muốn biết phải hỏi, muốn giỏi phải học", translation: "Ask to know, learn to grow" },
];

// Later items sit on top of earlier ones.
export const COLLAGE: readonly CollageItem[] = [
  {
    kind: "polaroid",
    src: "/about/lake.webp",
    alt: "A mountain lake with a wooden dock, pine trees and peaks behind it",
    caption: "lakeside",
    aspect: "3 / 4",
    x: 0, y: 2, w: 34, rotate: -7,
  },
  {
    kind: "polaroid",
    src: "/about/lookout.webp",
    alt: "Friends at a mountain lookout under a bright sun",
    caption: "the view up top",
    aspect: "3 / 4",
    x: 70, y: 5, w: 30, rotate: 8,
  },
  {
    kind: "polaroid",
    src: "/about/fishing.webp",
    alt: "Fishing at the edge of a lake",
    caption: "gone fishing",
    x: 0, y: 34, w: 40, rotate: 5,
  },
  {
    kind: "polaroid",
    src: "/about/park-ridge.webp",
    alt: "Nhut sitting on a log at Park Ridge Lookout",
    caption: "park ridge lookout",
    x: 34, y: 45, w: 52, rotate: -4,
  },
  {
    kind: "polaroid",
    src: "/about/crew.webp",
    alt: "A group of friends with arms around each other at a mountain overlook",
    caption: "the crew",
    aspect: "3 / 4",
    x: 4, y: 60, w: 38, rotate: -5,
  },
  {
    kind: "polaroid",
    src: "/about/vista.webp",
    alt: "Pine trees and layered mountain ridges under a clear blue sky",
    caption: "above the treeline",
    x: 50, y: 72, w: 46, rotate: 5,
  },
  {
    kind: "stamp",
    src: "/about/cat.webp",
    alt: "A gray tabby cat stretched out on a sunny deck",
    x: 78, y: 36, w: 22, rotate: 8,
  },
  {
    kind: "polaroid",
    src: "/about/sequoia.webp",
    alt: "Nhut standing in front of a giant sequoia",
    caption: "big trees",
    aspect: "3 / 4",
    x: 28, y: 0, w: 50, rotate: -2,
  },
];

// Hover a tool on the page to see `usedIn`. Add a group or a tool by copying a line.
export const TOOLKIT: readonly ToolGroup[] = [
  {
    title: "Languages",
    tools: [
      { name: "Go", abbr: "Go", usedIn: ["Hermes"] },
      { name: "Java", abbr: "Jv", usedIn: ["Sentinel", "Fablix"] },
      { name: "TypeScript", abbr: "TS", usedIn: ["Busway"] },
    ],
  },
  {
    title: "Cloud & DevOps",
    tools: [
      { name: "Kubernetes", abbr: "K8", usedIn: ["Hermes"] },
      { name: "Docker", abbr: "Dk", usedIn: ["Sentinel"] },
    ],
  },
  {
    title: "Systems & Protocols",
    tools: [
      { name: "Kafka", abbr: "Kf", usedIn: ["Hermes"] },
      { name: "gRPC", abbr: "gR", usedIn: ["Sentinel"] },
      { name: "GeoJSON", abbr: "{}", usedIn: ["Busway"] },
    ],
  },
  {
    title: "Databases",
    tools: [
      { name: "MySQL", abbr: "My", usedIn: ["Fablix"] },
      { name: "MongoDB", abbr: "Mg", usedIn: ["Fablix"] },
    ],
  },
  {
    title: "Developer Tools",
    tools: [
      // TODO: e.g. { name: "Git", abbr: "Gt", usedIn: [] },
    ],
  },
];
