#!/usr/bin/env node
// Generates optimized WebP versions of the referenced /public images.
// Idempotent: re-running produces byte-identical output for the same source bytes.
// Re-run whenever a source image is added or replaced.

import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, "..", "public");

// Only images that are actually referenced from components/ or app/.
// No resize: sources are already at appropriate dimensions for the layout
// (Lighthouse mobile renders at 412×823 × 2 DPR; 1024px sources downsample cleanly).
const IMAGES = [
  { src: "hero_reception.png", dest: "hero_reception.webp", quality: 82 },
  { src: "dr_sarah.png",       dest: "dr_sarah.webp",       quality: 82 },
  { src: "office_map.png",     dest: "office_map.webp",     quality: 82 },
];

let total = 0;
for (const { src, dest, quality } of IMAGES) {
  const input = path.join(PUBLIC, src);
  const output = path.join(PUBLIC, dest);
  const info = await sharp(input)
    .webp({ quality, effort: 6 })
    .toFile(output);
  total += info.size;
  console.log(`OK  ${dest.padEnd(28)}  ${info.width}x${info.height}  ${info.size.toLocaleString()} bytes`);
}
console.log(`Total WebP bytes: ${total.toLocaleString()}`);
