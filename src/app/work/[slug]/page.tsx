import { notFound } from "next/navigation";
import MasonryGrid from "@/components/MasonryGrid";
import SectionLead from "@/components/SectionLead";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Params = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";


export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const genresConfig = (await import("@/data/genres.json")).default;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const title = (genresConfig as any)[slug]?.title || "Work";
  return { title };
}

export default async function WorkGenrePage({ params }: Params) {
  const { slug } = await params;
  
  // Import manifest and genres config directly - no file system access
  const photosManifest = (await import("@/data/photos-manifest.json")).default as { genres?: Record<string, { files: { filename: string; width: number; height: number }[] }> };
  const genresConfig = (await import("@/data/genres.json")).default;
  const framesConfig = (await import("@/data/frames.json")).default;
  const layoutsConfig = (await import("@/data/layouts.json")).default;
  
  const genreData = photosManifest.genres?.[slug];
  if (!genreData) notFound();
  
  // Build images array from manifest
  const images = genreData.files.map(f => {
    const src = `/photos/${slug}/${f.filename}`;
    const defaultAlt = f.filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const genreConfig = genresConfig[slug as keyof typeof genresConfig] as any;
    const customCaption = genreConfig?.captions?.[f.filename] ?? genreConfig?.title;
    const alt = customCaption ?? defaultAlt;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const layoutForGenre = (layoutsConfig as any)[slug] || {};
    const layout = layoutForGenre[f.filename] ? { ...layoutForGenre[f.filename] } : undefined;
    
    // Resolve frame style
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const frameDefaults = (framesConfig as any).default || {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const genreFrames = (framesConfig as any).genres?.[slug] || {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const imageFrames = (framesConfig as any).images?.[slug]?.[f.filename] || {};
    const frame = { ...frameDefaults, ...genreFrames, ...imageFrames };
    
    return {
      src,
      width: f.width,
      height: f.height,
      filename: f.filename,
      alt,
      caption: customCaption,
      frame: frame.framePx ? frame : undefined,
      layout,
    };
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const genreCopy = (genresConfig as any)[slug]?.description;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/work" className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10" aria-label="Back to Work">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight bg-gradient-to-b from-black to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(genresConfig as any)[slug]?.title || slug}
        </h1>
      </div>
      {genreCopy && (
        <SectionLead>
          {genreCopy}
        </SectionLead>
      )}
      <MasonryGrid images={images} columns={3} />
    </section>
  );
}


