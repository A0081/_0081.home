// Regenerates the site icons from public/i0081.jpg.
//
//   node scripts/build-favicon.mjs
//
// Writes favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png and a
// multi-size favicon.ico into public/. sharp cannot write .ico, so the ICO
// container is assembled here from the 16/32 px PNGs (PNG-in-ICO, supported by
// every current browser).

import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const SOURCE = "public/i0081.jpg";
const OUT_DIR = "public";

// The sidebar draws this portrait at rounded-2xl (1rem) inside an 8.5rem box,
// so its corners are 11.77% of the width. The tab icons copy that ratio to
// match the avatar. The home-screen icon is left square on purpose: iOS masks
// apple-touch-icon itself, and a pre-rounded source would be rounded twice with
// the mask's background showing through the corners.
const RADIUS_RATIO = 0.1177;

const targets = [
  { file: "favicon-16x16.png", size: 16, round: true },
  { file: "favicon-32x32.png", size: 32, round: true },
  { file: "apple-touch-icon.png", size: 180, round: false },
];

const cornerMask = (size) => {
  const radius = (size * RADIUS_RATIO).toFixed(2);
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#fff"/>` +
      `</svg>`,
  );
};

const rendered = new Map();

for (const { file, size, round } of targets) {
  let pipeline = sharp(SOURCE).resize(size, size, { fit: "cover" });

  if (round) {
    pipeline = pipeline.composite([
      { input: cornerMask(size), blend: "dest-in" },
    ]);
  }

  const data = await pipeline.png({ compressionLevel: 9 }).toBuffer();

  await writeFile(`${OUT_DIR}/${file}`, data);
  rendered.set(size, data);
  console.log(`${file}  ${size}x${size}  ${data.length} bytes`);
}

const toIco = (images) => {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = [];

  for (const { size, data } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2); // palette size
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(entry);
  }

  return Buffer.concat([
    header,
    ...entries,
    ...images.map((image) => image.data),
  ]);
};

const ico = toIco([
  { size: 16, data: rendered.get(16) },
  { size: 32, data: rendered.get(32) },
]);

await writeFile(`${OUT_DIR}/favicon.ico`, ico);
console.log(`favicon.ico  16+32  ${ico.length} bytes`);
