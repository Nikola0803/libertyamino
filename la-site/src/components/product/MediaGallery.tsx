"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ProductVisual } from "@/components/ui/ProductVisual";

export type GalleryMedia = { type: "image" | "video"; src: string };

const DEFAULT_VIDEO = "/videos/product-hover.mp4";

/**
 * Rotating hero media for the product page: the product photo plus any
 * extra gallery images/video, with thumbnail dots and prev/next arrows.
 * Falls back to the shared /videos/product-hover.mp4 loop when a product
 * has no dedicated video of its own yet -- swap in a per-product clip via
 * the product's `gallery` field the moment one exists.
 */
export function MediaGallery({
  name,
  title,
  dosage,
  image,
  gallery,
}: {
  name: string;
  title: string;
  dosage: string | null;
  image?: string;
  gallery?: GalleryMedia[];
}) {
  const media: GalleryMedia[] = image
    ? [{ type: "image" as const, src: image }, ...(gallery && gallery.length > 0 ? gallery : [{ type: "video" as const, src: DEFAULT_VIDEO }])]
    : [];

  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (media.length === 0) {
    return (
      <div className="overflow-hidden rounded-lg border border-stone bg-ivory-soft">
        <div className="aspect-square w-full">
          <ProductVisual name={title} dosage={dosage} className="h-full w-full p-10" />
        </div>
      </div>
    );
  }

  const current = media[index];

  function go(next: number) {
    const wrapped = (next + media.length) % media.length;
    setIndex(wrapped);
  }

  return (
    <div>
      <div className="group relative overflow-hidden rounded-lg border border-stone bg-ivory-soft">
        <div className="aspect-square w-full p-10 sm:p-14">
          {current.type === "video" ? (
            <video
              ref={videoRef}
              key={current.src}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-contain"
              poster={image}
            >
              <source src={current.src} type="video/mp4" />
            </video>
          ) : (
            <Image
              key={current.src}
              src={current.src}
              alt={name}
              width={800}
              height={800}
              sizes="(max-width: 1024px) 90vw, 560px"
              className="h-full w-full object-contain"
              priority={index === 0}
            />
          )}
        </div>

        {media.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous media"
              onClick={() => go(index - 1)}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-charcoal opacity-0 shadow-sm transition group-hover:opacity-100"
            >
              <i className="ri-arrow-left-s-line text-lg" />
            </button>
            <button
              type="button"
              aria-label="Next media"
              onClick={() => go(index + 1)}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-charcoal opacity-0 shadow-sm transition group-hover:opacity-100"
            >
              <i className="ri-arrow-right-s-line text-lg" />
            </button>
          </>
        )}
      </div>

      {media.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {media.map((m, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show ${m.type} ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`flex h-2 items-center justify-center rounded-full transition-all ${
                i === index ? "w-6 bg-copper" : "w-2 bg-stone hover:bg-charcoal/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
