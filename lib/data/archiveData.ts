// File: lib/data/archiveData.ts
import { ArchiveItem, ProjectItem } from "@/lib/types";

export const CURATED_PICTURES = [
  {
    url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=600&q=80",
    title: "Yosemite Crest",
    label: "SIERRA HIGH PEAK",
    desc: "Sub-zero morning above the granite monoliths. A pure study in natural stillness.",
  },
  {
    url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    title: "Blade Runner 2049",
    label: "CINEMA // DEAKINS",
    desc: "Brutalist architecture framed by heavy sodium atmosphere and existential silence.",
  },
  {
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    title: "Gargantua Orbit",
    label: "INTERSTELLAR",
    desc: "Theoretical astrophysics rendered as celluloid poetry.",
  },
  {
    url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80",
    title: "Apex Telemetry",
    label: "FORMULA 1",
    desc: "Chasing hundredths of a second through aerodynamic downforce and driver commitment.",
  },
  {
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80",
    title: "Giant Forest",
    label: "SEQUOIA 6000FT",
    desc: "Canopies that have witnessed 2,000 years of earth history.",
  },
  {
    url: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
    title: "Saigon Monsoons",
    label: "ROOTS & MEMORY",
    desc: "Warm tropical downpours on city asphalt. The acoustic sound of childhood.",
  },
  {
    url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
    title: "Mechanical Shutter",
    label: "LEICA 35MM",
    desc: "Manual focus, chemical grain, and the deliberate patience of analog exposures.",
  },
  {
    url: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=600&q=80",
    title: "South Rim Descent",
    label: "GRAND CANYON",
    desc: "Millions of geological layers exposed under crimson sunset light.",
  },
  {
    url: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80",
    title: "Apex Flight",
    label: "BADMINTON COURT",
    desc: "Smashing at 200 MPH. Lightning reflex and strict geometric discipline.",
  },
  {
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    title: "Pacific Dusk",
    label: "CALIFORNIA COAST",
    desc: "Cold breeze along the Pacific Coast Highway after a 12-hour build sprint.",
  },
  {
    url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80",
    title: "Flow State Pour",
    label: "ROAST // 02:30 AM",
    desc: "Ethiopian single-origin espresso when the rest of the campus is asleep.",
  },
  {
    url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80",
    title: "Aldrich Ring",
    label: "UC IRVINE",
    desc: "The concentric green park linking science, engineering, and arts.",
  },
] as const;

export const TOTAL_CARDS = 52;

/**
 * 52-card archival dataset mapped for spherical Fibonacci distribution
 */
export const ARCHIVE_DATA: ArchiveItem[] = Array.from({ length: TOTAL_CARDS }, (_, i) => {
  const base = CURATED_PICTURES[i % CURATED_PICTURES.length];
  return {
    id: i,
    fileCode: `FILE // ${String(i + 1).padStart(3, "0")}`,
    url: base.url,
    title: base.title,
    label: base.label,
    desc: base.desc,
    status: "DECLASSIFIED",
  };
});

/**
 * Systems projects dossier
 */
export const PROJECT_DATA: ProjectItem[] = [
  {
    id: "hermes",
    code: "01 // Hermes",
    name: "Hermes CDN",
    stack: "Go · Kafka · K8s",
    description: "Distributed CDN & edge routing layer with dynamic cache partitioning.",
    href: "https://github.com/Nhutnguyen395",
  },
  {
    id: "sentinel",
    code: "02 // Sentinel",
    name: "Sentinel Engine",
    stack: "Java · gRPC · Docker",
    description: "Real-time threat simulation & IPC contracts under high packet loads.",
    href: "https://github.com/Nhutnguyen395",
  },
  {
    id: "busway",
    code: "03 // Busway",
    name: "Busway Routing",
    stack: "TypeScript · GeoJSON",
    description: "Geospatial transit engine with Dijkstra shortest-path calculations.",
    href: "https://github.com/Nhutnguyen395",
  },
  {
    id: "fablix",
    code: "04 // Fablix",
    name: "Fablix Catalog",
    stack: "MySQL · MongoDB · Java",
    description: "High-throughput movie catalog ETL pipeline with full-text search.",
    href: "https://github.com/Nhutnguyen395",
  },
];