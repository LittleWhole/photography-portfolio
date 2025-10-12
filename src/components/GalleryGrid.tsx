"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GalleryImage } from "@/lib/gallery";
import dynamic from "next/dynamic";

const Lightbox = dynamic(() => import("@/components/Lightbox"), { ssr: false });

export type GalleryGridProps = {
  images: GalleryImage[];
  itemMinWidth?: number; // px
  gap?: number; // px
};

export default function GalleryGrid({ images, itemMinWidth = 280, gap = 16 }: GalleryGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const useAbsolute = images.some((img) => (img.layout as { x?: number; y?: number } | undefined)?.x !== undefined || (img.layout as { x?: number; y?: number } | undefined)?.y !== undefined);
  const columnsStyle = useMemo(() => {
    return useAbsolute
      ? ({ position: "relative" } as React.CSSProperties)
      : ({ gridTemplateColumns: `repeat(auto-fill, minmax(${itemMinWidth}px, 1fr))`, gap: `${gap}px`, gridAutoFlow: "dense" } as React.CSSProperties);
  }, [useAbsolute, itemMinWidth, gap]);

  // Track nodes and set CSS variable --framePx based on measured width so SSR stays stable
  const containerRefs = useRef(new Map<string, HTMLDivElement | null>());
  useEffect(() => {
    const observers: ResizeObserver[] = [];
    images.forEach((img) => {
      const node = containerRefs.current.get(img.src);
      if (!node) return;
      const basePx = img.frame?.framePx ?? 0;
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.contentRect.width;
          if (width <= 0) continue;
          const aspect = img.width / img.height;
          const lightboxMaxW = Math.min(window.innerWidth * 0.95, window.innerHeight * 0.9 * aspect);
          const scale = lightboxMaxW > 0 ? width / lightboxMaxW : 1;
          const px = Math.max(0, Math.round(basePx * scale));
          node.style.setProperty("--framePx", `${px}px`);
        }
      });
      ro.observe(node);
      observers.push(ro);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [images]);

  return (
    <div className={useAbsolute ? "relative" : "grid"} style={columnsStyle}>
      {images.map((img) => {
        const frameColor = img.frame?.frameColor ?? "#ffffff";
        const hasFrame = (img.frame?.framePx ?? 0) > 0;
        const spanW = img.layout?.w && img.layout.w > 0 ? img.layout.w : undefined;
        const spanH = img.layout?.h && img.layout.h > 0 ? img.layout.h : undefined;
        const gridColStart = img.layout?.c && img.layout.c > 0 ? img.layout.c : undefined;
        const gridRowStart = img.layout?.r && img.layout.r > 0 ? img.layout.r : undefined;
        const absX = (img.layout as { x?: number } | undefined)?.x;
        const absY = (img.layout as { y?: number } | undefined)?.y;
        const absW = (img.layout as { wPx?: number } | undefined)?.wPx;
        const absH = (img.layout as { hPx?: number } | undefined)?.hPx;
        return (
          <figure
            key={img.src}
            className="flex flex-col items-center"
            style={
              useAbsolute
                ? ({ position: "absolute", left: absX, top: absY, width: absW, height: absH } as React.CSSProperties)
                : ({
                    gridColumn: [gridColStart ? `${gridColStart} / span ${spanW || 1}` : spanW ? `span ${spanW}` : undefined].filter(Boolean)[0] as
                      | string
                      | undefined,
                    gridRow: [gridRowStart ? `${gridRowStart} / span ${spanH || 1}` : spanH ? `span ${spanH}` : undefined].filter(Boolean)[0] as
                      | string
                      | undefined,
                  } as React.CSSProperties)
            }
          >
            <button
              type="button"
              aria-label={`View ${img.alt}`}
              className="group block w-full cursor-zoom-in"
              onClick={() => setLightboxIndex(images.findIndex((i) => i.src === img.src))}
            >
              <div
                ref={(el: HTMLDivElement | null) => {
                  containerRefs.current.set(img.src, el);
                }}
                className="relative w-full box-border transition-transform duration-200 ease-out group-hover:scale-[1.02] group-hover:shadow-sm"
              >
                <div className="relative w-full" style={{ aspectRatio: `${img.width}/${img.height}` }} data-masonry-content>
                  <Image
                    src={img.thumb?.src || img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain bg-white"
                    placeholder={img.blurDataURL ? "blur" : undefined}
                    blurDataURL={img.blurDataURL}
                  />
                   {hasFrame && (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{ boxShadow: `inset 0 0 0 var(--framePx, 0px) ${frameColor}` }}
                    />
                  )}
                </div>
              </div>
            </button>
            <figcaption className="sr-only">{img.alt}</figcaption>
          </figure>
        );
      })}
      {lightboxIndex !== null && (
        <Lightbox images={images} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </div>
  );
}


