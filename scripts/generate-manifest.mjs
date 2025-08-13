import fs from 'node:fs';
import path from 'node:path';
import { imageSize } from 'image-size';
import ExifParser from 'exif-parser';

const PROJECT_ROOT = process.cwd();
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const PHOTOS_ROOT = path.join(PUBLIC_DIR, 'photos');

const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.JPG', '.JPEG']);

function normalizeSlug(raw) {
  const s = raw.toLowerCase();
  if (s === 'landscapes-travel' || s === 'landscapes_and_travel') return 'landscapes-and-travel';
  return s;
}

function readDims(buffer) {
  const dims = imageSize(buffer);
  let { width, height } = dims;
  try {
    const exif = ExifParser.create(buffer).parse();
    const orientation = exif.tags.Orientation;
    if (orientation && [5, 6, 7, 8].includes(orientation)) {
      const w = width; width = height; height = w;
    }
  } catch {}
  return { width, height };
}

async function main() {
  const out = { genres: {} };
  if (!fs.existsSync(PHOTOS_ROOT)) {
    await fs.promises.mkdir(path.dirname(path.join(PROJECT_ROOT, 'src', 'data', 'photos-manifest.json')), { recursive: true });
    await fs.promises.writeFile(path.join(PROJECT_ROOT, 'src', 'data', 'photos-manifest.json'), JSON.stringify(out, null, 2));
    return;
  }
  const entries = await fs.promises.readdir(PHOTOS_ROOT, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const slug = normalizeSlug(entry.name);
    const dir = path.join(PHOTOS_ROOT, entry.name);
    const files = await fs.promises.readdir(dir);
    const images = [];
    for (const name of files) {
      const ext = path.extname(name);
      if (!SUPPORTED.has(ext)) continue;
      const buf = await fs.promises.readFile(path.join(dir, name));
      const { width, height } = readDims(buf);
      if (!width || !height) continue;
      images.push({ filename: name, width, height });
    }
    images.sort((a, b) => a.filename.localeCompare(b.filename));
    if (images.length) out.genres[slug] = { files: images };
  }
  await fs.promises.mkdir(path.join(PROJECT_ROOT, 'src', 'data'), { recursive: true });
  await fs.promises.writeFile(path.join(PROJECT_ROOT, 'src', 'data', 'photos-manifest.json'), JSON.stringify(out, null, 2));
}

main().catch((err) => {
  console.error('Failed to generate manifest', err);
  process.exit(0);
});


