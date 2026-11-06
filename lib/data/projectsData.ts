// File: lib/data/projectsData.ts
//
// Everything on the Projects page lives here — edit this file, not the components.
// Projects are numbered automatically in the order they appear below (01, 02, ...).
//
// ADD A PROJECT: copy one block, paste it where you want it in the list, and edit it.
//
// IMAGES: drop screenshots into /public/projects/<project-id>/ and list them in `images`,
// e.g. { src: "/projects/hermes/dashboard.webp", alt: "Grafana dashboard of edge latency" }.
// Images stack like a deck of cards; clicking the stack cycles to the next one.
// Keep the DESIGN (architecture diagram) FIRST so every project starts on it, then add
// dashboards / UI screenshots after it.
// While `images` is empty the page shows a dashed "screenshots coming soon" frame.
//
import type { Project } from "@/lib/types";

const GITHUB = "https://github.com/Nhutnguyen395";

export const PROJECTS: readonly Project[] = [
  {
    id: "hermes",
    name: "Hermes",
    tagline: "Distributed CDN & edge routing simulator",
    year: "2026",
    stack: ["Go", "Java", "Spring Boot", "Kubernetes", "Nginx", "Kafka", "Prometheus", "Grafana"],
    bullets: [
      "Simulates a global CDN: a Spring Boot origin behind NGINX edge PoPs (US-East, EU-West) that cache assets and enforce token-bucket rate limiting to absorb traffic spikes.",
      "Layer 7 geo-routing with the Kubernetes Gateway API forwards each request to the nearest edge based on its region header.",
      "Event-driven cache invalidation: a Go sidecar consumes Kafka purge events and deletes only the affected assets by their NGINX cache key, with zero downtime and no full cache wipes.",
      "Prometheus + Grafana telemetry tracks cache hit ratio, p95 latency, and dropped requests, validated with k6 load tests of concurrent users across regions.",
      "An LLM incident agent diagnoses alerts from the telemetry and auto-runs only low-risk fixes (single-key purge, +1 replica); anything riskier goes to a human for approval.",
    ],
    links: [{ label: "GitHub", href: GITHUB }],
    images: [
      {
        src: "/projects/hermes/architecture.webp",
        alt: "Hermes architecture: geo-router, US and EU edge PoPs with invalidator sidecars, Kafka, origin service, and Prometheus/Grafana",
        caption: "architecture",
        aspect: "1055 / 613",
      },
    ],
  },
  {
    id: "sentinel",
    name: "Sentinel",
    tagline: "Real-time threat simulation & telemetry platform",
    year: "2026",
    stack: ["Java", "Spring Boot", "Node.js", "React", "Kafka", "gRPC", "PostGIS", "AWS ECS"],
    bullets: [
      "Event-driven command-and-control system: 7 microservices decoupled by Kafka streams, with sub-second threat identification from raw sensor noise.",
      "Spatial-temporal sensor fusion in PostGIS confirms a target only when 3+ independent sensors agree within 50 m and 3 s, filtering out birds, weather, and jamming.",
      "Confirmed targets switch to synchronous gRPC / Protobuf calls to the battery service for intercept vectors and firing authorization.",
      "Live React + Leaflet tactical map fed over WebSockets, plus an operator panel to inject drone swarms, hypersonics, and sensor storms on demand.",
      "Deployed as 9 containers on AWS ECS Fargate with ECR images, Cloud Map service discovery, and health-checked self-healing restarts.",
    ],
    links: [
      { label: "GitHub", href: GITHUB },
      { label: "Demo", href: "https://vimeo.com/1206292818" },
    ],
    images: [
      {
        src: "/projects/sentinel/architecture.webp",
        alt: "Sentinel architecture: simulation engine, sensor gateway, Kafka, fusion engine with PostGIS, interceptor and battery services over gRPC, dashboard BFF and tactical dashboard on AWS",
        caption: "architecture",
        aspect: "1797 / 646",
      },
      {
        src: "/projects/sentinel/ecs_deployment.png",
        alt: "AWS ECS console showing the sentinel-cluster with all 9 services active and running",
        caption: "aws ecs deployment",
      },
      {
        src: "/projects/sentinel/service_logs.png",
        alt: "Service logs: the fusion engine confirming targets, the interceptor issuing launch commands, and the battery service answering gRPC firing requests",
        caption: "kill chain in the logs",
      },
    ],
  },
  {
    id: "fablix",
    name: "Fablix",
    tagline: "High-throughput movie e-commerce & analytics platform",
    year: "2026",
    stack: ["Java", "Node.js", "MySQL", "MongoDB", "Tomcat", "JMeter"],
    bullets: [
      "ETL ingestion pipeline that parses large catalog datasets, growing the catalog 5x from 10,000 to 50,000+ records.",
      "Optimized database access patterns and queries under heavy concurrent read/write load, cutting end-to-end query latency by 2.3x (measured with JMeter).",
      "Secure backend covering 20+ core features, with JWT role-based access control, ACID transactions, and automated bot mitigation.",
    ],
    links: [{ label: "GitHub", href: GITHUB }],
    images: [
      {
        src: "/projects/fablix/movies_dashboard.png",
        alt: "Fablix search and browse page with a table of action movies, directors, genres, stars, and ratings",
        caption: "browse & search",
      },
      {
        src: "/projects/fablix/migration_to_mongodb.png",
        alt: "Console output of the MySQL to MongoDB migration: 76,890 stars, 21,131 movies, 453 customers migrated",
        caption: "mysql → mongodb migration",
      },
    ],
  },
  {
    id: "busway",
    name: "Busway",
    tagline: "Geospatial transit intelligence & routing engine",
    year: "2026",
    stack: ["Java", "Spring Boot", "Node.js", "React", "TypeScript", "PostGIS", "Docker"],
    bullets: [
      "Custom in-memory Dijkstra routing engine in Spring Boot that resolves multi-stop routes in under 50 ms, factoring in walking distance and transfer penalties.",
      "ETL pipeline turns real-world GTFS transit feeds into indexed PostGIS geometry, building a 6,000-node transit graph.",
      "Routes are snapped to real streets with OSRM, and a Node.js physics engine interpolates bus positions along them in real time.",
      "Live fleet map in React + Leaflet streams vehicle GPS over WebSockets (Socket.IO) as buses move stop to stop.",
      "Containerized multi-tier stack with Docker; frontend on Vercel, backend on Render, CI/CD through GitHub.",
    ],
    links: [
      { label: "GitHub", href: GITHUB },
      { label: "Demo", href: "https://vimeo.com/1202375828" },
    ],
    images: [
      {
        src: "/projects/busway/architecture.webp",
        alt: "Busway architecture: React dashboard, Spring Boot routing engine with PostGIS, Node.js simulation service over WebSockets, and OSRM",
        caption: "architecture",
        aspect: "955 / 681",
      },
      {
        src: "/projects/busway/dashboard.png",
        alt: "Busway Command Center: trip planner with departure and arrival stops and the optimal route drawn on a map of Long Beach",
        caption: "command center",
      },
    ],
  },
];
