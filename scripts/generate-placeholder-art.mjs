// Generates simple, on-brand SVG placeholder illustrations so the site has
// no broken images. Each one is a deterministic, lightweight vector built
// from the item's slug — swap any of these for real photography later by
// replacing the file at the same path.
import fs from "node:fs";
import path from "node:path";

const palette = {
  forest: "#1F3D2B",
  green: "#2F6B3A",
  leaf: "#6FA85A",
  sand: "#F4EFE3",
  terracotta: "#E2672B",
  olive: "#93A14A",
};

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function svgFor(slug, label, w = 800, h = 600) {
  const seed = hash(slug);
  const colors = [palette.green, palette.leaf, palette.olive, palette.terracotta];
  const c1 = colors[seed % colors.length];
  const c2 = colors[(seed + 1) % colors.length];
  const circles = Array.from({ length: 5 }).map((_, i) => {
    const cx = ((seed >> (i * 2)) % w);
    const cy = ((seed >> (i * 3)) % h);
    const r = 40 + ((seed >> (i * 4)) % 90);
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${i % 2 ? c2 : c1}" opacity="0.18"/>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g-${seed}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.forest}"/>
      <stop offset="1" stop-color="${c1}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g-${seed})"/>
  ${circles}
  <g transform="translate(${w / 2}, ${h / 2})" text-anchor="middle">
    <text y="-6" font-family="Georgia, serif" font-size="${Math.round(w / 18)}" fill="${palette.sand}" opacity="0.92">${label}</text>
  </g>
</svg>`;
}

const items = [];

// Guides
for (const slug of ["home-composting", "outdoor-composting", "leaf-composting", "drum-composting", "pipe-composting", "bokashi-composting"]) {
  items.push(["guides", slug, slug.replace(/-/g, " ")]);
}
// Products
for (const slug of [
  "home-composting-kit",
  "bokashi-bin",
  "drum-composter",
  "pipe-composting-set",
  "compost-aerator",
  "compost-thermometer",
  "coco-peat",
  "bokashi-bran",
  "diy-segregation-bin",
]) {
  items.push(["products", slug, slug.replace(/-/g, " ")]);
}
// Blog
for (const slug of ["mastering-wet-waste", "from-trash-to-treasure", "clean-living-made-easy"]) {
  items.push(["blog", slug, slug.replace(/-/g, " ")]);
}

const root = path.join(process.cwd(), "public", "images");
for (const [dir, slug, label] of items) {
  const outDir = path.join(root, dir);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, `${slug}.svg`), svgFor(slug, label));
}

// Hero + misc brand art
fs.mkdirSync(path.join(root, "brand"), { recursive: true });
fs.writeFileSync(path.join(root, "brand", "hero.svg"), svgFor("hero", "ascend sustainability", 1600, 900));
fs.writeFileSync(path.join(root, "brand", "og.svg"), svgFor("og", "ascend sustainability", 1200, 630));

console.log(`Generated ${items.length + 2} placeholder illustrations.`);
