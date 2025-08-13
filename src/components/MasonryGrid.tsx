"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryImage } from "@/lib/gallery";
import dynamic from "next/dynamic";

const Lightbox = dynamic(() => import("@/components/Lightbox"), { ssr: false });

export default function MasonryGrid({ images, minColumnWidth = 280, gap = 16, columns: columnsProp }: { images: GalleryImage[]; minColumnWidth?: number; gap?: number; columns?: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [layout, setLayout] = useState<{ left: number; top: number; width: number; height: number; framePx: number }[]>([]);
  const [containerHeight, setContainerHeight] = useState(0);

  const compute = useCallback(() => {
    const node = containerRef.current;
    if (!node) return;
    const width = node.clientWidth;
    if (width === 0) return;
    const columns = columnsProp && columnsProp > 0 ? columnsProp : width < 640 ? 1 : width < 1024 ? 2 : 3;
    const colWidth = (width - gap * (columns - 1)) / columns;

    const colHeights = new Array(columns).fill(0) as number[];
    const next = images.map((img) => {
      // If absolute override exists
      const abs = (img.layout as { x?: number; y?: number; wPx?: number; hPx?: number } | undefined) || {};
      if (abs.x !== undefined && abs.y !== undefined && abs.wPx && abs.hPx) {
        const basePx = img.frame?.framePx ?? 0;
        return { left: abs.x, top: abs.y, width: abs.wPx, height: abs.hPx, framePx: basePx };
      }

      const aspect = img.width / img.height;
      const widthPx = colWidth * Math.max(1, Math.min(columns, img.layout?.w || 1)) + gap * ((img.layout?.w || 1) - 1);
      const heightPx = widthPx / aspect;

      const takeCols = Math.max(1, Math.min(columns, img.layout?.w || 1));
      // find best column index with minimum height window of takeCols
      let bestIdx = 0;
      let bestH = Number.POSITIVE_INFINITY;
      for (let i = 0; i <= columns - takeCols; i++) {
        const h = Math.max(...colHeights.slice(i, i + takeCols));
        if (h < bestH) {
          bestH = h;
          bestIdx = i;
        }
      }
      const left = bestIdx * (colWidth + gap);
      const top = bestH ? bestH + gap : 0;
      for (let i = 0; i < takeCols; i++) {
        colHeights[bestIdx + i] = top + heightPx;
      }
      // Scale frame thickness relative to lightbox reference
      const basePx = img.frame?.framePx ?? 0;
      let scaledFrame = basePx;
      try {
        const lightboxMaxW = Math.min(window.innerWidth * 0.95, window.innerHeight * 0.9 * aspect);
        const scale = lightboxMaxW > 0 ? widthPx / lightboxMaxW : 1;
        scaledFrame = Math.max(0, Math.round(basePx * scale));
      } catch {}
      return { left, top, width: widthPx, height: heightPx, framePx: scaledFrame };
    });
    setLayout(next);
    setContainerHeight(Math.max(0, ...next.map((b) => b.top + b.height)));
  }, [images, gap, minColumnWidth]);

  useEffect(() => {
    compute();
    const ro = new ResizeObserver(() => compute());
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [compute]);

  return (
    <div ref={containerRef} className="relative" style={{ height: containerHeight }}>
      {images.map((img, idx) => {
        const b = layout[idx];
        if (!b) return null;
      const framePx = layout[idx]?.framePx ?? (img.frame?.framePx ?? 0);
        const frameColor = img.frame?.frameColor ?? "#ffffff";
        return (
          <figure key={img.src} className="absolute" style={{ left: b.left, top: b.top, width: b.width, height: b.height }}>
            <button
              type="button"
              aria-label={`View ${img.alt}`}
              className="group block w-full h-full cursor-zoom-in"
              onClick={() => setLightboxIndex(idx)}
            >
              <div className="relative w-full h-full" style={{ padding: framePx, background: frameColor, boxSizing: "border-box" }}>
                <div className="relative w-full h-full">
                  <Image src={img.src} alt={img.alt} fill className="object-cover bg-white" sizes="100vw" />
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


