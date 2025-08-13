import { notFound } from "next/navigation";
import { getGenres, getImagesForGenre } from "@/lib/gallery";
import genresData from "@/data/genres.json";
type GenresData = typeof genresData;
import MasonryGrid from "@/components/MasonryGrid";
import SectionLead from "@/components/SectionLead";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Params = {
  params: Promise<{ slug: string }>;
};

export const generateStaticParams = async () => {
  const genres = await getGenres();
  return genres.map((g) => ({ slug: g.slug }));
};


export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const genres = await getGenres();
  const genre = genres.find((g) => g.slug === slug);
  return { title: genre ? genre.title : "Work" };
}

export default async function WorkGenrePage({ params }: Params) {
  const { slug } = await params;
  const images = await getImagesForGenre(slug);
  if (images.length === 0) notFound();

  const data: GenresData | undefined = genresData as GenresData;
  const genreCopy = (data && (data as Record<string, { description?: string }>)[slug]?.description) as
    | string
    | undefined;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/work" className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10" aria-label="Back to Work">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight bg-gradient-to-b from-black to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
          {data[slug as keyof GenresData].title}
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


