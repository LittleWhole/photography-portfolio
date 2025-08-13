"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { GalleryImage } from "@/lib/gallery";

type LightboxProps = {
  images: GalleryImage[];
  startIndex?: number;
  onClose: () => void;
};

export default function Lightbox({ images, startIndex = 0, onClose }: LightboxProps) {
  const [index, setIndex] = useState(startIndex);

  const total = images.length;
  const current = images[index];

  const goNext = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const goPrev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, onClose]);

  const counterText = useMemo(() => `${index + 1} / ${total}`, [index, total]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 text-white">
      <button
        aria-label="Close lightbox"
        className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center"
        onClick={onClose}
      >
        ✕
      </button>

      <div className="absolute top-1/2 left-0 -translate-y-1/2 p-4">
        <button
          aria-label="Previous image"
          className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center"
          onClick={goPrev}
        >
          ←
        </button>
      </div>
      <div className="absolute top-1/2 right-0 -translate-y-1/2 p-4">
        <button
          aria-label="Next image"
          className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center"
          onClick={goNext}
        >
          →
        </button>
      </div>

      <div className="h-full w-full flex items-center justify-center p-6" onClick={onClose}>
        <div className="max-w-[95vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
          <div
            className="relative inline-block box-border"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.src}
              alt={current.alt}
              style={{ maxWidth: "95vw", maxHeight: "90vh" }}
              className="object-contain select-none bg-white"
              draggable={false}
            />
            {(current.frame?.framePx ?? 0) > 0 && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ boxShadow: `inset 0 0 0 ${current.frame?.framePx ?? 0}px ${current.frame?.frameColor || "#ffffff"}` }}
              />
            )}
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-white/80">
            <span>{current.caption || current.alt}</span>
            <span>{counterText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}


