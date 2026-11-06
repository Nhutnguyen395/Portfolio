// File: lib/data/journeyData.ts
//
// Everything on the Reise page lives here — edit this file, not the components.
//
// ORDER: stops appear top-to-bottom in the order of JOURNEY_STOPS (first = where the trail starts).
//
// PHOTOS: images live in /public/journey/<stop-id>/ as .webp (originals are kept in
// /archive-originals/journey/). Photos alternate left / right of the trail automatically.
// `aspect` is the photo's shape (width / height) so nothing gets cropped awkwardly.
// `caption` is optional — add one to write a line under a photo.

import type { JourneyStop } from "@/lib/types";

export const JOURNEY_INTRO = {
  title: "Reise",
  paragraphs: [
    "Away from the keyboard, I'm happiest somewhere with no cell signal — camping under the stars, hiking to a lookout, chasing a good view. This is the trail so far.",
  ],
  // shown at the very bottom of the trail
  outro: "to be continued",
};

export const JOURNEY_STOPS: readonly JourneyStop[] = [
  {
    id: "yosemite",
    kicker: "National Park",
    name: "Yosemite",
    region: "California",
    date: "Dec 2023",
    photos: [
      { src: "/journey/yosemite/entrance.webp", alt: "Clouds hanging over the cliffs of Yosemite Valley", aspect: "4 / 3" },
      { src: "/journey/yosemite/trail-head.webp", alt: "Tall pines lining a wet road", aspect: "3 / 4" },
      { src: "/journey/yosemite/hike.webp", alt: "Walking down a forest road in hoodies", aspect: "3 / 4" },
      { src: "/journey/yosemite/two-big-mountain.webp", alt: "Granite peaks above a frosty meadow", aspect: "1217 / 917" },
      { src: "/journey/yosemite/campsite.webp", alt: "Orange tent pitched among tall pines", aspect: "3 / 4" },
      { src: "/journey/yosemite/group.webp", alt: "The group posing on a stone wall with the valley behind", aspect: "4 / 3" },
    ],
  },
  {
    id: "sequoia",
    kicker: "National Park",
    name: "Sequoia",
    region: "California",
    date: "Jul 2025",
    photos: [
      { src: "/journey/sequoia/big-trees.webp", alt: "Friends standing under a cluster of giant sequoias", aspect: "3 / 4" },
      { src: "/journey/sequoia/one-big-tree.webp", alt: "Looking up a single giant sequoia trunk", aspect: "3 / 4" },
      { src: "/journey/sequoia/meadow.webp", alt: "Sunny meadow surrounded by sequoias", aspect: "3 / 4" },
      { src: "/journey/sequoia/big-rock.webp", alt: "Panorama of forest and mountains beside a huge boulder", aspect: "1600 / 501" },
      { src: "/journey/sequoia/lake.webp", alt: "Blue lake with mountains in the distance", aspect: "9 / 16" },
      { src: "/journey/sequoia/campsite.webp", alt: "Campsite with a tent and campfire smoke under the pines", aspect: "3 / 4" },
    ],
  },
  {
    id: "grand-canyon",
    kicker: "National Park",
    name: "Grand Canyon",
    region: "Arizona",
    date: "Dec 2025",
    photos: [
      { src: "/journey/grand-canyon/welcome-to-the-grand-canyon.webp", alt: "Passing the Arizona state sign from the car", aspect: "3 / 4" },
      { src: "/journey/grand-canyon/road.webp", alt: "Cloudy sky over the highway at sunrise", aspect: "4 / 3" },
      { src: "/journey/grand-canyon/horizon.webp", alt: "Wide view across the Grand Canyon under clouds", aspect: "4 / 3" },
      { src: "/journey/grand-canyon/horizon2.webp", alt: "Layered red canyon walls", aspect: "3 / 4" },
      { src: "/journey/grand-canyon/over-the-edge.webp", alt: "Canyon cliffs framed by a juniper tree", aspect: "1223 / 917" },
      { src: "/journey/grand-canyon/horizon3.webp", alt: "Sun low over the canyon rim", aspect: "4 / 3" },
    ],
  },
];
