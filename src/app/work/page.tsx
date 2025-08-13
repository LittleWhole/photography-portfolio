import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export const metadata = { title: "Work" };
export const dynamic = "force-static";

export default async function WorkPage() {
  // Import manifest and genres config directly - no file system access
  const photosManifest = (await import("@/data/photos-manifest.json")).default as { genres?: Record<string, { files: { filename: string; width: number; height: number }[] }> };
  const genresConfig = (await import("@/data/genres.json")).default;
  
  // Build genres array from manifest and config
  const genreEntries = Object.entries(photosManifest.genres || {});
  const genres = genreEntries.map(([slug, data]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config = genresConfig[slug as keyof typeof genresConfig] as any;
    return {
      slug,
      title: config?.title || slug.charAt(0).toUpperCase() + slug.slice(1),
      description: config?.description,
      coverSrc: config?.cover ? `/photos/${slug}/${config.cover}` : data.files[0] ? `/photos/${slug}/${data.files[0].filename}` : undefined,
      coverOffsetX: config?.coverOffsetX,
      coverOffsetY: config?.coverOffsetY,
      order: config?.order ?? 999,
      count: data.files.length,
    };
  }).sort((a, b) => a.order - b.order);
  return (
    <section className="space-y-8">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight bg-gradient-to-b from-black to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
        Work
      </h1>
      {genres.length === 0 ? (
        <p className="text-neutral-600 dark:text-neutral-400">
          No work yet. Create folders in <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">public/photos/&lt;genre&gt;</code> and add images.
        </p>
      ) : (
        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {genres.map((g) => (
            <li key={g.slug}>
              <Card className="group overflow-hidden transition-all duration-300 hover:-translate-y-2">
                <Link href={`/work/${g.slug}`} className="block">
                  {g.coverSrc && (
                    <div className="relative overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={g.coverSrc}
                        alt=""
                        className="w-full h-56 sm:h-64 object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        style={{ objectPosition: `${g.coverOffsetX ?? 50}% ${g.coverOffsetY ?? 50}%` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/0" />
                    </div>
                  )}
                  <div className="p-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 group-hover:text-black dark:group-hover:text-white transition-colors">
                        {g.title}
                      </h2>
                    </div>
                    <span 
                      aria-hidden 
                      className="text-xl text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 group-hover:translate-x-1 transition-all duration-200"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}


