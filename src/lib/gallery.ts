import fs from "fs";
import path from "path";
import { imageSize } from "image-size";
import ExifParser from "exif-parser";
import photosManifest from "@/data/photos-manifest.json";

export type Genre = {
  slug: string;
  title: string;
  description?: string;
  coverSrc?: string;
  coverOffsetX?: number; // 0-100 percent
  coverOffsetY?: number; // 0-100 percent
  count: number;
};

export type GenreConfig = {
  title?: string;
  description?: string;
  captions?: Record<string, string>;
  order?: number; // manual ordering on /work
  cover?: string; // thumbnail image filename or absolute path
  coverOffsetX?: number; // 0-100
  coverOffsetY?: number; // 0-100
};

export type GenresConfig = Record<string, GenreConfig>;

export type FrameStyle = {
  framePx?: number;
  frameColor?: string;
};

export type FramesConfig = {
  default?: FrameStyle;
  genres?: Record<string, FrameStyle>;
  images?: Record<string, Record<string, FrameStyle>>;
};

export type GalleryImage = {
  src: string; // public-relative src, e.g. /photos/portraits/img.jpg
  width: number;
  height: number;
  filename: string;
  alt: string;
  caption?: string;
  frame?: FrameStyle;
  layout?: { c?: number; r?: number; w?: number; h?: number };
  thumb?: { src: string; width: number; height: number };
  blurDataURL?: string;
};

const PROJECT_ROOT = process.cwd();
const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");
const PHOTOS_ROOT = path.join(PUBLIC_DIR, "photos");

const SUPPORTED_IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
]);

function toTitleCase(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function normalizeSlug(raw: string): string {
  // Map common variants to a single slug
  const s = raw.toLowerCase();
  if (s === "landscapes-travel" || s === "landscapes_and_travel") return "landscapes-and-travel";
  return s;
}

function isImageFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return SUPPORTED_IMAGE_EXTENSIONS.has(ext);
}

export async function getGenres(): Promise<Genre[]> {
  if (!fs.existsSync(PHOTOS_ROOT)) {
    return [];
  }
  const entries = await fs.promises.readdir(PHOTOS_ROOT, { withFileTypes: true });
  const genresConfig = await loadGenresConfig();

  const genres: Genre[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const slug = normalizeSlug(entry.name);
    const dir = path.join(PHOTOS_ROOT, slug);
    const files = await fs.promises.readdir(dir);
    const imageFiles = files.filter((f) => isImageFile(f));
    if (imageFiles.length === 0) continue;
    const config = genresConfig[slug];
    const coverSrc = config?.cover
      ? (config.cover.startsWith("/") ? config.cover : `/photos/${slug}/${config.cover}`)
      : `/photos/${slug}/${imageFiles[0]}`;
    const title = config?.title ?? toTitleCase(slug);
    const description = config?.description;
    const coverOffsetX = typeof config?.coverOffsetX === "number" ? Math.min(100, Math.max(0, config!.coverOffsetX)) : undefined;
    const coverOffsetY = typeof config?.coverOffsetY === "number" ? Math.min(100, Math.max(0, config!.coverOffsetY)) : undefined;
    
    genres.push({ 
      slug, 
      title, 
      description,
      coverSrc, 
      coverOffsetX,
      coverOffsetY,
      count: imageFiles.length 
    });
  }

  // Sort by manual order, then alphabetically
  genres.sort((a, b) => {
    const aOrder = genresConfig[a.slug]?.order;
    const bOrder = genresConfig[b.slug]?.order;
    if (typeof aOrder === "number" && typeof bOrder === "number") return aOrder - bOrder;
    if (typeof aOrder === "number") return -1;
    if (typeof bOrder === "number") return 1;
    return a.title.localeCompare(b.title);
  });
  return genres;
}

export async function loadGenresConfig(): Promise<GenresConfig> {
  const genresPathCandidates = [
    path.join(PROJECT_ROOT, "src", "data", "genres.json"),
    path.join(PUBLIC_DIR, "genres.json"),
  ];

  for (const candidate of genresPathCandidates) {
    try {
      if (fs.existsSync(candidate)) {
        const raw = await fs.promises.readFile(candidate, "utf8");
        const parsed = JSON.parse(raw) as GenresConfig;
        return parsed;
      }
    } catch {
      // fall through to default
    }
  }
  return {};
}

export async function loadFramesConfig(): Promise<FramesConfig> {
  const framesPathCandidates = [
    path.join(PROJECT_ROOT, "src", "data", "frames.json"),
    path.join(PUBLIC_DIR, "frames.json"),
  ];

  for (const candidate of framesPathCandidates) {
    try {
      if (fs.existsSync(candidate)) {
        const raw = await fs.promises.readFile(candidate, "utf8");
        const parsed = JSON.parse(raw) as FramesConfig;
        return parsed;
      }
    } catch {
      // fall through to default
    }
  }
  return { default: { framePx: 0, frameColor: "#ffffff" } };
}

export function resolveFrameStyle(
  frames: FramesConfig,
  genreSlug: string,
  filename: string
): FrameStyle | undefined {
  // Check for image-specific style in nested structure
  const byImage = frames.images?.[genreSlug]?.[filename];
  if (byImage) return mergeFrameStyles(frames.default, frames.genres?.[genreSlug], byImage);

  // Check for genre-specific style
  const byGenre = frames.genres?.[genreSlug];
  if (byGenre) return mergeFrameStyles(frames.default, byGenre);

  // Return default style
  return frames.default;
}

function mergeFrameStyles(
  ...styles: Array<FrameStyle | undefined>
): FrameStyle | undefined {
  const merged: FrameStyle = {};
  for (const s of styles) {
    if (!s) continue;
    if (typeof s.framePx === "number") merged.framePx = s.framePx;
    if (typeof s.frameColor === "string") merged.frameColor = s.frameColor;
  }
  return Object.keys(merged).length ? merged : undefined;
}

export async function getImagesForGenre(slug: string): Promise<GalleryImage[]> {
  const manifest = (photosManifest as unknown as { genres?: Record<string, { files: Array<{ filename: string; width: number; height: number; thumb?: { src: string; width: number; height: number }; blurDataURL?: string }> }> }).genres || {};
  const entry = manifest[slug];
  if (!entry) return [];
  const frames = await loadFramesConfig();
  const genresConfig = await loadGenresConfig();
  const layouts = await loadLayoutsConfig();

  const images: GalleryImage[] = [];
  for (const f of entry.files) {
    const file = f.filename;
    const dims = { width: f.width, height: f.height };
    const src = `/photos/${slug}/${file}`;
    const defaultAlt = toTitleCase(path.basename(file, path.extname(file)));
    const genreConfig = genresConfig[slug];
    const customCaption = genreConfig?.captions?.[file] ?? genreConfig?.title;
    const alt = customCaption ?? defaultAlt;
    const layoutForGenre = layouts[slug] || {};
    const layout = layoutForGenre[file] ? { ...layoutForGenre[file] } : undefined;
    images.push({
      src,
      width: dims.width,
      height: dims.height,
      filename: file,
      alt,
      caption: customCaption,
      frame: resolveFrameStyle(frames, slug, file),
      layout,
      thumb: f.thumb ? { src: f.thumb.src, width: f.thumb.width, height: f.thumb.height } : undefined,
      blurDataURL: f.blurDataURL,
    });
  }

  // Stable order by filename
  images.sort((a, b) => a.filename.localeCompare(b.filename));
  return images;
}

export const GalleryConfig = {
  photosRootPublicPath: "/photos",
  supportedExtensions: Array.from(SUPPORTED_IMAGE_EXTENSIONS.values()),
};

export type LayoutsConfig = Record<string, Record<string, { c?: number; r?: number; w?: number; h?: number; x?: number; y?: number; wPx?: number; hPx?: number }>>;

export async function loadLayoutsConfig(): Promise<LayoutsConfig> {
  const candidates = [
    path.join(PROJECT_ROOT, "src", "data", "layouts.json"),
    path.join(PUBLIC_DIR, "layouts.json"),
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        const raw = await fs.promises.readFile(p, "utf8");
        return JSON.parse(raw) as LayoutsConfig;
      }
    } catch {}
  }
  return {};
}


