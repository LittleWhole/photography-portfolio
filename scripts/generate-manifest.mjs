import fs from 'node:fs';
import path from 'node:path';
import { imageSize } from 'image-size';
import ExifParser from 'exif-parser';
import sharp from 'sharp';

const PROJECT_ROOT = process.cwd();
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');
const PHOTOS_ROOT = path.join(PUBLIC_DIR, 'photos');
const THUMBS_ROOT = path.join(PHOTOS_ROOT, '_thumbs');

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
    const thumbsDir = path.join(THUMBS_ROOT, slug);
    await fs.promises.mkdir(thumbsDir, { recursive: true });
    const files = await fs.promises.readdir(dir);
    const images = [];
    for (const name of files) {
      const ext = path.extname(name);
      if (!SUPPORTED.has(ext)) continue;
      const filePath = path.join(dir, name);
      const buf = await fs.promises.readFile(filePath);
      const { width, height } = readDims(buf);
      if (!width || !height) continue;
      // Generate thumbnail (webp) and tiny blur
      const baseName = path.basename(name, ext);
      const thumbFile = path.join(thumbsDir, `${baseName}.webp`);
      const thumbPublicSrc = `/photos/_thumbs/${slug}/${baseName}.webp`;

      const THUMB_MAX_DIM = 1280; // px, longest side
      const BLUR_WIDTH = 24; // px

      // Compute resize target for thumbnail based on longest side
      const landscape = width >= height;
      const scale = Math.min(1, (landscape ? THUMB_MAX_DIM / width : THUMB_MAX_DIM / height));
      const thumbW = Math.round(width * scale);
      const thumbH = Math.round(height * scale);

      try {
        // Thumbnail (webp)
        const resizeOptions = landscape
          ? { width: THUMB_MAX_DIM, fit: 'inside', withoutEnlargement: true }
          : { height: THUMB_MAX_DIM, fit: 'inside', withoutEnlargement: true };
        await sharp(buf).rotate().resize(resizeOptions).webp({ quality: 75 }).toFile(thumbFile);
      } catch {}

      // Blur tiny preview as data URL
      let blurDataURL = undefined;
      try {
        const blurBuf = await sharp(buf).rotate().resize({ width: BLUR_WIDTH }).webp({ quality: 40 }).toBuffer();
        blurDataURL = `data:image/webp;base64,${blurBuf.toString('base64')}`;
      } catch {}

      images.push({ filename: name, width, height, thumb: { src: thumbPublicSrc, width: thumbW, height: thumbH }, blurDataURL });
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


