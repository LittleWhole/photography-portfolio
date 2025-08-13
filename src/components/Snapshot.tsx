import { cn } from "@/lib/utils";

type SnapshotProps = {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  stacked?: boolean;
  size?: "sm" | "md" | "lg";
};

export default function Snapshot({ src, alt, caption, className, stacked = false, size = "md" }: SnapshotProps) {
  const maxWidthClass =
    size === "lg"
      ? "max-w-[340px] sm:max-w-[380px] md:max-w-[420px]"
      : size === "sm"
      ? "max-w-[240px] sm:max-w-[260px] md:max-w-[280px]"
      : "max-w-[280px] sm:max-w-[320px] md:max-w-[360px]";

  return (
    <figure className={cn("group inline-block select-none z-0", className)}>
      <div className="relative inline-block">

        {stacked && (
          <div className="absolute inset-0 translate-x-2 translate-y-2 rotate-3">
            <div className="bg-white p-3 border border-black/10 rounded-md shadow-[0_8px_20px_rgba(0,0,0,0.12)]" />
          </div>
        )}

        <div className="inline-block -rotate-2 group-hover:rotate-0 transition-transform duration-300 z-0">
          <div className={cn("bg-white p-3 shadow-[0_10px_25px_rgba(0,0,0,0.15)] border border-black/10 rounded-md overflow-hidden", maxWidthClass)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} className={cn("h-auto w-full object-cover", maxWidthClass)} />
          </div>
        </div>
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-neutral-600 dark:text-neutral-300">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}


